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
var ie = "data-ui-id", ae = "data-ui-context", oe = "data-ui-pc", y = "data-ui-key", se = "data-ui-unselectable", ce = "data-ui-undraggable", le = "data-ui-unremovable", ue = "data-ui-unrenamable", de = "data-ui-no-context-menu", fe = "data-ui-no-row-open", pe = "data-ui-no-row-drag", me = "data-ui-drag-kind", he = "data-ui-drag-source", ge = "data-ui-item-drop-over", _e = "data-ui-drop-boxed", ve = "ui-row__grip", ye = "data-ui-row-drop", be = "data-ui-tabs-none-removable", xe = "data-ui-tabs-draggable", Se = "data-ui-tabs-menu", Ce = "data-ui-context-menu", we = "data-ui-context-menu-owner", Te = "data-ui-context-menu-later", Ee = "data-ui-context-menu-template", De = "data-ui-context-menu-use", Oe = "data-ui-action-bar", ke = "data-ui-action-bar-key", Ae = "data-ui-action-bar-rest", je = "data-ui-menu-left-out", Me = "data-ui-in-action-bar", Ne = "ui-action-bar", Pe = "data-ui-row-focus", Fe = "data-ui-row-cursor-waits", Ie = "data-ui-tab-out", Le = "data-ui-cell-focus", Re = "ui-cell-key", ze = "data-ui-tooltip", Be = "data-ui-tooltip-placement", Ve = "data-ui-tooltip-mark", He = "data-ui-tooltip-severity", Ue = "data-ui-tooltip-press", We = "data-ui-badge-text", Ge = "data-ui-badge-set", Ke = "data-ui-badge-icon", qe = "data-ui-folds", Je = "data-ui-name", Ye = "data-ui-bind-", Xe = "data-ui-into-", Ze = "data-ui-bind-value", Qe = (e) => `data-ui-no-${e}`, $e = "data-ui-event-boundary", et = "data-ui-image-caption", tt = "data-ui-image-crop", nt = "data-ui-image-crop-size", rt = "ui-image", it = "ui-image__picture", at = "ui-image--circle", ot = "data-ui-fallback-src", st = "data-ui-fallback-icon", ct = "data-ui-image-failed", lt = "data-ui-icon-failed", b = "data-ui-items-host", ut = "data-ui-collection-sink", dt = "data-ui-items-query", ft = "data-ui-first-visible-key", pt = "data-ui-last-visible-key", mt = "data-ui-number-culture", ht = "data-ui-page-culture", gt = "data-ui-pager-target", _t = "data-ui-pager-page", vt = "data-ui-pager-size", yt = "data-ui-temporal-culture", bt = "data-ui-temporal", xt = "data-ui-awaits-draw", St = "ui-timestamp", Ct = "ui-timestamp__text", wt = "data-ui-timestamp-format", Tt = "ui-file-tile", Et = "ui-file-tile__glyph", Dt = "ui-file-tile__name", Ot = "ui-file-tile__size", kt = "data-ui-file-name", At = "data-ui-file-type", jt = "data-ui-file-size", Mt = "data-ui-file-icon", Nt = "data-ui-empty-template", Pt = "data-ui-group-template", Ft = "data-ui-empty-placeholder", It = "data-ui-group-header", Lt = "data-ui-group-anchor", Rt = "data-ui-group", zt = "data-ui-value-holder", Bt = "data-ui-value-end", Vt = "data-ui-value-kind", Ht = "items-query", Ut = "first-visible-key", Wt = "last-visible-key", Gt = "data-ui-host-mode", Kt = "data-ui-host-viewport", qt = "data-ui-scroll-group", Jt = "data-ui-scroll-lines", Yt = "data-ui-source-line", Xt = "data-ui-window-spacer", Zt = "data-ui-window-pending", Qt = "data-ui-window-paged", $t = "data-ui-window-size", en = "data-ui-window-offset", tn = "data-ui-window-total", nn = "data-ui-window-more-before", rn = "data-ui-window-more-after", an = "data-ui-window-group-before", on = "data-ui-window-aggregates", sn = "data-ui-form-id", cn = "data-ui-forms", ln = "data-ui-visibility", un = "data-ui-collapsed", dn = "data-ui-menu-group", fn = "data-ui-menu-select", pn = "data-ui-menu-open", mn = "data-ui-menu-holds-current", hn = "data-ui-menu-icons", gn = "data-ui-menu-passive", _n = "data-ui-menu-item-shortcut", vn = "data-ui-menu-surface", yn = "data-ui-menu-search", bn = "data-ui-menu-searching", xn = "data-ui-menu-unmatched", Sn = "data-ui-drawer-toggle", Cn = "data-ui-drawer-open", wn = "data-ui-drawer-switch", Tn = "data-ui-drawer-switch-row", En = "data-ui-side-drawers", Dn = "data-ui-drawer-pin";
function On(e) {
	return e === "right-side" ? "data-ui-pinned-right-side" : "data-ui-pinned-left-side";
}
var kn = "data-ui-bottom-bar", An = "data-ui-rail-drawer", jn = "data-ui-content-fills", Mn = "data-ui-region", Nn = "data-ui-menu-item-kind", x = "ui-menu", S = "ui-menu-item", Pn = "ui-menu-item--checked", Fn = "ui-menu-item--selected", In = "ui-menu--rail", Ln = "ui-menu--nested", Rn = `[${Nn}="header"], [${Nn}="separator"]`, zn = `[${dn}] > .${S}`, Bn = `.${S}:not(${Rn})`, Vn = `${zn}, .${S}[${Nn}="check"]`, Hn = "data-ui-shortcut", Un = "data-ui-collapse-toggle", Wn = "data-ui-folding", Gn = "data-ui-column-limits", Kn = "data-ui-row-limits", qn = "data-ui-splitter-step", Jn = "data-ui-splitter-position", Yn = "data-ui-pane-layout", Xn = "data-ui-pane", Zn = "data-ui-table-column", Qn = "data-ui-table-hide-below", $n = "data-ui-table-starts-hidden", er = "data-ui-table-hidden", tr = "ui-table__row", nr = "ui-table__scroll", rr = "ui-table__header", ir = "ui-table__resizer", ar = "ui-tree", or = "ui-tree__row", sr = "ui-tree-node", cr = "data-ui-tree-drop", lr = "ui-tree__row--filtered", ur = "data-ui-table-last", dr = "data-ui-table-reordering", fr = "data-ui-table-dragging", pr = "data-ui-table-drop", mr = "data-ui-table-scrolled", hr = "data-ui-table-scrollbar", gr = "data-ui-no-row-select", _r = "data-ui-tree-parent", vr = "data-ui-tree-children", yr = "data-ui-tree-folder", br = "data-ui-tree-expanded", xr = "data-ui-tree-title", Sr = "data-ui-tree-loading", Cr = "data-ui-tree-drop-target", wr = "data-ui-tree-boot", Tr = "data-ui-tree-draggable", Er = "data-ui-row-editing", Dr = "data-ui-boxed-editor", Or = "data-ui-row-idle", kr = "data-ui-step-collapsed", Ar = "data-ui-step-end", jr = "data-ui-row-bar", Mr = "data-ui-image-source", Nr = "data-ui-file-max-size", Pr = "data-ui-file-pick", Fr = "data-ui-file-drop-target-id", Ir = "data-ui-service-worker", Lr = "data-ui-theme", Rr = "data-ui-theme-colors", zr = "data-ui-words", Br = "#text", Vr = "data-ui-language-switcher", Hr = "data-ui-theme-switcher", Ur = "data-ui-theme-choice", Wr = "field", Gr = "data-ui-language", Kr = "data-ui-splitting", qr = "data-ui-keyboard-up", Jr = "data-ui-connection", Yr = "data-ui-split-folded", Xr = "data-ui-split-edge", Zr = "data-ui-pointer-focus", Qr = "data-ui-focus-within", $r = "data-ui-popup-hover", ei = "data-ui-inner-pointer", ti = "data-ui-selection", ni = "data-ui-selected", ri = "data-ui-selected-key", ii = "data-ui-selected-keys", ai = "data-ui-bind-selected-key", oi = "data-ui-tabs-selected", si = "data-ui-tab-caption", ci = "data-ui-tab-pinned", li = [
	ln,
	"data-ui-visibility-sm",
	"data-ui-visibility-md",
	"data-ui-visibility-xl",
	"data-ui-visibility-xxl"
], ui = "data-ui-submit-form-id", C = `[${ie}]`, di = "data-ui-href", fi = "ui-disabled", pi = "ui-loading", mi = "ui-readonly", hi = "ui-hidden", gi = "ui-dialog__surface", _i = "ui-flyout__content", vi = `.ui-context-menu, .ui-split-button__menu, .${_i}`, yi = "data-ui-focus-holder", bi = "data-ui-owns-keys", xi = "[role='listbox'], [role='menu'], [role='dialog']", Si = "ui-select__trigger", Ci = `.${Si}`, wi = "ui-button", Ti = `${wi} ui-button--ghost ui-button--small`, Ei = "ui-select", Di = "data-ui-text-title", Oi = "data-ui-text-description", ki = "data-ui-text-icon", Ai = "data-ui-text-badge-icon", ji = "data-ui-text-badge-text", Mi = "ui-card__header--empty", Ni = "ui-text-input", Pi = "ui-invalid", Fi = "data-ui-validation-message", Ii = {
	componentId: ie,
	key: y,
	selected: ni,
	selectedKey: ri,
	selectedKeys: ii,
	unselectable: se,
	rowFocus: Pe,
	cellFocus: Le,
	cellKey: Re,
	itemsHost: b,
	valueHolder: zt,
	bindValue: Ze,
	noRowOpen: fe,
	noRowDrag: pe,
	eventBoundary: $e,
	focusHolder: yi,
	ownsKeys: bi,
	tooltip: ze,
	tooltipPlacement: Be,
	contextMenu: Ce,
	contextMenuUse: De,
	actionBar: Oe,
	actionBarKey: ke,
	actionBarRest: Ae,
	disabledClass: fi,
	loadingClass: pi,
	readOnlyClass: mi,
	hiddenClass: hi,
	buttonClass: wi,
	selectClass: Ei,
	textInputClass: Ni,
	invalidClass: Pi,
	validationMessage: Fi,
	sourceLine: Yt,
	textDescription: Oi,
	popupSelector: xi,
	listTriggerSelector: Ci,
	tableRowClass: tr,
	tableScrollClass: nr,
	tableHeaderClass: rr,
	tableResizerClass: ir,
	tableHidden: er,
	hostMode: Gt,
	windowOffset: en,
	windowTotal: tn,
	windowSize: $t,
	windowMoreAfter: rn,
	windowAggregates: on,
	itemsQuery: dt,
	valueKind: Vt,
	itemsQueryKind: Ht,
	menuItemClass: S,
	menuItemKind: Nn,
	menuItemCheckedClass: Pn
};
function w(e) {
	return String(e).replace(/[\\"]/g, "\\$&").replace(/[\u0000-\u001f\u007f]/g, (e) => `\\${e.charCodeAt(0).toString(16)} `);
}
function Li(e) {
	return e.replace(/(\p{Ll})(\p{Lu})/gu, "$1-$2").replace(/([\p{L}\p{Nd}])(\p{Lu}\p{Ll})/gu, "$1-$2").replace(/_/g, "-").toLowerCase();
}
var Ri = 0;
function zi(e, t) {
	return e.id.length === 0 && (Ri++, e.id = `${t}-${Ri}`), e.id;
}
//#endregion
//#region src/addressing/operation-targets.ts
function Bi(e, t, n) {
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
var Vi = {
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
}, Hi = class {
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
		for (let t of e.validationTargets ?? []) this.validationTargetsByComponentId.set(E(t.componentId), t);
		for (let t of e.exposedProperties ?? []) {
			let e = this.getPropertyDefinition(t.propertyId);
			e !== void 0 && this.exposedProperties.set(`${E(t.componentId)}:${e.propertyName}`, t);
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
		return this.propertyDefinitionsById.get(e.propertyId)?.translatable !== !0 || e.content === !0 ? !1 : ("bindingId" in e ? e : this.getBindingByComponentAndPropertyId(E(e.componentId), e.propertyId))?.content !== !0;
	}
	getWords() {
		return this.metadata.words ?? [];
	}
	hasComponentBindings(e) {
		for (let t of this.metadata.bindings) if (E(t.componentId) === e) return !0;
		return !1;
	}
	getBindingByComponentAndPropertyId(e, t) {
		return this.bindingsByComponentAndPropertyId.get(fa(e, t));
	}
	getBindingByComponentAndPropertyName(e, t) {
		return this.bindingsByComponentAndPropertyName.get(fa(e, da(t)));
	}
	getEvent(e, t) {
		return this.eventsByComponentAndName.get(pa(e, t));
	}
	hasServerEvent(e) {
		return this.eventNames.has(ua(e));
	}
	getEventNames() {
		return this.eventNames;
	}
	hasServerEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(ua(e))?.has(t) === !0;
	}
	getItemsTemplateMetadata(e) {
		return this.itemsTemplatesByComponentId.get(e);
	}
	getItemsFilterSortMetadata(e) {
		return this.itemsFilterSortByComponentId.get(e);
	}
	getItemValues(e, t = []) {
		return this.itemValuesByAddress.get(ma(e, t))?.items ?? [];
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
		let t = E(e.componentId), n = this.getPropertyDefinition(e.propertyId);
		if (t <= 0 || n === void 0) return;
		let r = E(e.bindingId);
		r > 0 && this.bindingsById.set(r, e), this.bindingsByComponentAndPropertyId.set(fa(t, e.propertyId), e), this.bindingsByComponentAndPropertyName.set(fa(t, n.propertyName), e);
	}
	addEvent(e) {
		let t = ua(e.eventName), n = E(e.componentId);
		if (t.length === 0 || n <= 0) return;
		this.eventsByComponentAndName.set(pa(n, t), e), this.eventNames.add(t);
		let r = this.eventComponentIdsByName.get(t);
		r === void 0 && (r = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(t, r)), r.add(n);
	}
	addItemsTemplate(e) {
		let t = E(e.componentId);
		t <= 0 || this.itemsTemplatesByComponentId.set(t, e);
	}
	addItemsFilterSort(e) {
		let t = E(e.componentId);
		t <= 0 || this.itemsFilterSortByComponentId.set(t, e);
	}
	addItemValues(e) {
		let t = E(e.componentId);
		t > 0 && this.itemValuesByAddress.set(ma(t, e.dynamicParameters ?? []), e);
	}
	addValidation(e) {
		let t = E(e.target?.componentId);
		if (t <= 0) return;
		let n = this.validationsByComponentId.get(t);
		n === void 0 && (n = [], this.validationsByComponentId.set(t, n)), n.push(e);
	}
};
function T(e, t) {
	return typeof e == "number" ? t[e] ?? "Unknown" : e != null && t.includes(e) ? e : "Unknown";
}
function Ui(e) {
	return T(e, [
		"Dynamic",
		"Fixed",
		"Scope"
	]);
}
function Wi(e) {
	return e == null ? "OneWay" : T(e, [
		"OneWay",
		"TwoWay",
		"OneWayToSource",
		"OnSubmit"
	]);
}
function Gi(e) {
	return T(e, ["Property", "Event"]);
}
function Ki(e) {
	return e == null ? "SetProperty" : T(e, [
		"SetProperty",
		"Effect",
		"CopyValue"
	]);
}
function qi(e) {
	return T(e, [
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
function Ji(e) {
	return T(e, ["Ascending", "Descending"]);
}
function Yi(e) {
	return T(e, [
		"Change",
		"Blur",
		"Submit"
	]);
}
function Xi(e) {
	return T(e, [
		"Error",
		"Warning",
		"Info"
	]);
}
function Zi(e) {
	return typeof e == "string" ? e : T(e, [
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
function Qi(e) {
	return T(e, [
		"None",
		"HasValue",
		"HasText",
		"IsTrue",
		"IsFalse",
		"DrawsIcon"
	]);
}
function $i(e) {
	return T(e, [
		"Insert",
		"Remove",
		"Move",
		"Replace",
		"Reset"
	]);
}
function E(e) {
	return e ?? 0;
}
function ea(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function ta(e) {
	return typeof e == "string" ? e : "";
}
function na(e) {
	return T(e.kind, [
		"Value",
		"CollectionChange",
		"FullResync",
		"Validation",
		"Page"
	]);
}
function ra(e) {
	return typeof e == "string" ? e.trim() : "";
}
function ia(e) {
	return T(e, ["Auto", "Smooth"]);
}
function aa(e) {
	return T(e, [
		"Start",
		"Center",
		"End",
		"Nearest"
	]);
}
function oa(e) {
	return T(e, [
		"Start",
		"End",
		"Offset",
		"PageBack",
		"PageForward"
	]);
}
function sa(e) {
	return T(e, ["Light", "Dark"]);
}
function ca(e) {
	return T(e, ["Horizontal", "Vertical"]);
}
function la(e) {
	return T(e, ["Polite", "Assertive"]);
}
function ua(e) {
	return e?.trim().toLowerCase() ?? "";
}
function da(e) {
	return e?.trim() ?? "";
}
function fa(e, t) {
	return `${e}:${da(t)}`;
}
function pa(e, t) {
	return `${e}:${ua(t)}`;
}
function ma(e, t) {
	return `${e}:${ea(t)}`;
}
//#endregion
//#region src/addressing/address-resolver.ts
var ha = class {
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
		return this.dom.findAllComponents(E(e.componentId), []).length > 0;
	}
	resolveProperties(e, t) {
		let n = E(e.componentId), r = this.metadata.getPropertyDefinition(e.propertyId);
		if (n <= 0 || r === void 0) return [];
		let i = this.dom.findAllComponents(n, t);
		if (i.length === 0) return [];
		let a = E(this.metadata.getBindingByComponentAndPropertyId(n, e.propertyId)?.bindingId), o = a > 0 ? this.bindingSelector(a, r.propertyName) : null;
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
		return n === void 0 && (n = `[${Ye}${Li(t)}="${w(e)}"]`, this.bindingSelectors.set(e, n)), n;
	}
	resolvePropertyOn(e, t) {
		let n = E(t.componentId), r = this.metadata.getPropertyDefinition(t.propertyId);
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
		return Bi(e.component, t, () => {
			if (e.bindingSelector === null) return [e.component.querySelector(this.intoSelector(e.propertyName)) ?? e.component];
			let t = Array.from(e.component.querySelectorAll(e.bindingSelector));
			return e.component.matches(e.bindingSelector) && t.unshift(e.component), t;
		});
	}
	intoSelector(e) {
		let t = this.intoSelectors.get(e);
		return t === void 0 && (t = `[${Xe}${Li(e)}]`, this.intoSelectors.set(e, t)), t;
	}
};
//#endregion
//#region src/addressing/dynamic-parameters.ts
function ga(e) {
	return ba(e, oe);
}
function _a(e, t) {
	if (t <= 0) return [];
	let n = [], r = e, i = null;
	for (; r !== null && n.length < t;) {
		let e = Sa(r);
		if (e !== void 0) {
			let t = r.closest(xa);
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
function va(e, t) {
	let n = ga(e);
	if (n !== t.length) return !1;
	if (n === 0) return !0;
	let r = _a(e, n);
	if (r.length !== t.length) return !1;
	for (let e = 0; e < t.length; e++) if (String(r[e] ?? "") !== String(t[e] ?? "")) return !1;
	return !0;
}
function ya(e, t) {
	let n = t.length - 1, r = e, i = null;
	for (; r !== null && n >= 0;) {
		let e = Sa(r);
		if (e !== void 0) {
			let a = r.closest(xa);
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
function ba(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.trim().length === 0) return 0;
	let r = Number(n);
	return Number.isInteger(r) ? r : 0;
}
var xa = `[${b}]`;
function Sa(e) {
	return e.getAttribute("data-ui-key") ?? e.getAttribute("data-ui-group-anchor") ?? void 0;
}
//#endregion
//#region src/addressing/dom-registry.ts
var Ca = `[${It}]`, wa = 64, Ta = 256;
function Ea(e, t) {
	let n = [];
	for (let r of e) r instanceof HTMLElement && r.matches(t) ? n.push(r) : n.push(...r.querySelectorAll(t));
	return n;
}
var Da = class {
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
			if (e === void 0 || this.changedScopes.size >= wa) {
				this.stale = !0, this.changedScopes.clear();
				return;
			}
			this.changedScopes.add(e);
		}
	}
	rebuild() {
		this.stale = !1, this.componentsById.clear(), this.staticComponentsById.clear(), this.keyedComponentsById.clear(), this.indexed.clear(), this.changedScopes.clear(), this.unsettledIds.clear();
		let e = this.root.querySelectorAll(C), t = this.root.querySelector(Ca) !== null;
		for (let n of e) {
			let e = D(n);
			if (e <= 0 || t && n.closest(Ca) !== null) continue;
			let r = this.componentsById.get(e);
			r === void 0 && (r = [], this.componentsById.set(e, r)), r.push(n), this.indexed.add(n), !this.staticComponentsById.has(e) && Aa(n) && this.staticComponentsById.set(e, n);
		}
		this.patchedSincePrune = 0, this.prunedSize = this.indexed.size;
	}
	findComponent(e, t) {
		return this.findAllComponents(e, t)[0] ?? null;
	}
	ensureId(e, t) {
		return zi(e, t);
	}
	findComponentParts(e, t, n) {
		return Ea(this.findAllComponents(e, t), n);
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
		let n = this.keyedComponents(e).get(ea(t)) ?? [];
		if (n.length > 0 && n.every((e) => this.holds(e) && va(e, t))) return [...n];
		let r = this.liveComponents(e).filter((e) => va(e, t));
		return (n.length > 0 || r.length > 0) && this.keyedComponentsById.delete(e), r;
	}
	sync() {
		if (this.stale) {
			this.rebuild();
			return;
		}
		if (this.changedScopes.size !== 0) {
			for (let e of this.changedScopes) this.holds(e) && this.addComponentsIn(e);
			this.changedScopes.clear(), this.patchedSincePrune > Math.max(this.prunedSize, Ta) && this.prune();
		}
	}
	addComponentsIn(e) {
		if (e.closest(Ca) !== null) return;
		let t = e.querySelector(Ca) !== null;
		e.matches(C) && this.addComponent(e, !1);
		for (let n of e.querySelectorAll(C)) this.addComponent(n, t);
	}
	addComponent(e, t) {
		let n = D(e);
		if (n <= 0) return;
		if (this.indexed.has(e)) {
			this.unsettledIds.add(n);
			return;
		}
		if (t && e.closest(Ca) !== null) return;
		this.indexed.add(e), this.patchedSincePrune++, this.keyedComponentsById.delete(n);
		let r = this.componentsById.get(n);
		r === void 0 ? (this.componentsById.set(n, [e]), Aa(e) && this.staticComponentsById.set(n, e)) : (r.push(e), this.unsettledIds.add(n));
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
		r && (t.length = n, this.keyedComponentsById.delete(e)), i && !Na(t) && t.sort(Ma), t.length === 0 ? (this.componentsById.delete(e), this.staticComponentsById.delete(e)) : (r || i) && this.settleStatic(e, t);
	}
	settleStatic(e, t) {
		for (let n of t) if (Aa(n)) {
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
			let e = ga(n);
			if (e === 0) continue;
			let r = _a(n, e);
			if (r.length !== e) continue;
			let i = ea(r), a = t.get(i);
			a === void 0 ? t.set(i, [n]) : a.push(n);
		}
		return this.keyedComponentsById.set(e, t), t;
	}
	holds(e) {
		return Pa(this.root, e);
	}
	resolveNearestComponent(e, t) {
		this.sync();
		let n = e;
		for (; n !== null;) {
			let e = n.closest(C);
			if (e === null || !Pa(this.root, e)) return null;
			let r = D(e);
			if (r > 0 && t(r, e)) return {
				element: e,
				componentId: r,
				dynamicParameters: _a(e, ga(e))
			};
			n = e.parentElement;
		}
		return null;
	}
};
function D(e) {
	return ba(e, ie);
}
function Oa(e) {
	let t = e.closest(C), n = t === null ? 0 : D(t);
	return n > 0 ? n : null;
}
function ka(e) {
	let t = e.closest(C), n = t === null ? 0 : D(t);
	return t === null || n <= 0 ? null : {
		componentId: n,
		dynamicParameters: _a(t, ga(t))
	};
}
function Aa(e) {
	return ga(e) === 0;
}
function ja(e, t) {
	return (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
}
function Ma(e, t) {
	return e === t ? 0 : ja(e, t) ? -1 : 1;
}
function Na(e) {
	for (let t = 1; t < e.length; t++) if (!ja(e[t - 1], e[t])) return !1;
	return !0;
}
function Pa(e, t) {
	return e === t || e instanceof Node && e.contains(t);
}
//#endregion
//#region src/runtime/plural-rules.ts
function Fa(e, t) {
	if (!Number.isFinite(t)) return "other";
	let n = Math.abs(t), r = Math.trunc(n), i = Ia(n);
	switch (La(e)) {
		case "en":
		case "de": return r === 1 && i === 0 ? "one" : "other";
		case "es": return n === 1 ? "one" : Ra(r, i) ? "many" : "other";
		case "fr": return r === 0 || r === 1 ? "one" : Ra(r, i) ? "many" : "other";
		case "ru":
		case "uk": return za(r, i);
		case "pl": return Ba(r, i);
		default: return "other";
	}
}
function Ia(e) {
	if (Number.isInteger(e)) return 0;
	let t = String(e), n = t.indexOf("e"), r = n < 0 ? t : t.slice(0, n), i = n < 0 ? 0 : Number(t.slice(n + 1)), a = r.indexOf("."), o = a < 0 ? 0 : r.length - a - 1;
	return Math.max(0, o - i);
}
function La(e) {
	return e == null || e.trim().length === 0 ? "" : e.split(/[-_]/, 1)[0].toLowerCase();
}
function Ra(e, t) {
	return t === 0 && e !== 0 && e % 1e6 == 0;
}
function za(e, t) {
	if (t !== 0) return "other";
	let n = e % 10, r = e % 100;
	return n === 1 && r !== 11 ? "one" : n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
function Ba(e, t) {
	if (t !== 0) return "other";
	if (e === 1) return "one";
	let n = e % 10, r = e % 100;
	return n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
//#endregion
//#region src/rendering/temporal-format.ts
function Va(e, t) {
	return `${e.date} ${t ? e.longTime : e.shortTime}`;
}
var Ha = {
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
function Ua(e) {
	let t = e.closest("[data-ui-temporal-culture]")?.getAttribute("data-ui-temporal-culture") ?? null;
	if (t === null) return Ha;
	try {
		return {
			...Ha,
			...JSON.parse(t)
		};
	} catch {
		return Ha;
	}
}
var Wa = [
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
function Ga(e, t, n) {
	if (t == null || t.trim().length === 0) return `${Qa(e.getFullYear(), 4)}-${Qa(e.getMonth() + 1, 2)}-${Qa(e.getDate(), 2)} ${Qa(e.getHours(), 2)}:${Qa(e.getMinutes(), 2)}:${Qa(e.getSeconds(), 2)}`;
	let r = "", i = Ka(t);
	for (let a = 0; a < t.length;) {
		let o = Xa(t, a);
		if (o === null) {
			r += t[a], a++;
			continue;
		}
		r += Za(o, e, n, i), a += o.length;
	}
	return r;
}
function Ka(e) {
	for (let t = 0; t < e.length;) {
		let n = Xa(e, t);
		if (n === null) {
			t++;
			continue;
		}
		if (n === "d" || n === "dd") return !0;
		t += n.length;
	}
	return !1;
}
var qa = /^[-./:,]$/, Ja = /* @__PURE__ */ new Set([
	"MMMM",
	"MMM",
	"dddd",
	"ddd",
	"tt"
]);
function Ya(e) {
	for (let t = 0; t < e.length;) {
		let n = Xa(e, t);
		if (n !== null && Ja.has(n) || n === null && !qa.test(e[t]) && !/\s/.test(e[t])) return !1;
		t += n?.length ?? 1;
	}
	return e.trim().length > 0;
}
function Xa(e, t) {
	for (let n of Wa) if (e.startsWith(n, t)) return n;
	return null;
}
function Za(e, t, n, r) {
	let i = t.getHours(), a = vo(i);
	switch (e) {
		case "yyyy": return Qa(t.getFullYear(), 4);
		case "yy": return Qa(t.getFullYear() % 100, 2);
		case "MMMM": return r ? n.monthGenitiveNames[t.getMonth()] : n.monthNames[t.getMonth()];
		case "MMM": return n.abbreviatedMonthNames[t.getMonth()];
		case "MM": return Qa(t.getMonth() + 1, 2);
		case "M": return String(t.getMonth() + 1);
		case "dddd": return n.dayNames[t.getDay()];
		case "ddd": return n.abbreviatedDayNames[t.getDay()];
		case "dd": return Qa(t.getDate(), 2);
		case "d": return String(t.getDate());
		case "HH": return Qa(i, 2);
		case "H": return String(i);
		case "hh": return Qa(a, 2);
		case "h": return String(a);
		case "mm": return Qa(t.getMinutes(), 2);
		case "m": return String(t.getMinutes());
		case "ss": return Qa(t.getSeconds(), 2);
		case "s": return String(t.getSeconds());
		case "tt": return i < 12 ? n.amDesignator : n.pmDesignator;
		default: return e;
	}
}
function Qa(e, t) {
	return String(e).padStart(t, "0");
}
var $a = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function eo(e) {
	let t = $a.exec(e.trim());
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
function to(e) {
	return no(e.year, e.month - 1, e.day, e.hour, e.minute, e.second, e.millisecond);
}
function no(e, t, n, r = 0, i = 0, a = 0, o = 0) {
	let s = new Date(2e3, 0, 1, r, i, a, o);
	return s.setFullYear(e, t, n), s;
}
var ro = {
	year: "y",
	month: "M",
	day: "d",
	hour: "H",
	minute: "m",
	second: "s"
};
function io(e, t) {
	let n = "";
	for (let r = 0; r < e.length;) {
		let i = Xa(e, r);
		if (i === null) {
			n += e[r], r++;
			continue;
		}
		n += ao(i, t).repeat(i.length), r += i.length;
	}
	return n;
}
function ao(e, t) {
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
function oo(e, t, n) {
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
		let a = Xa(t, e);
		if (a === null) {
			if (!so(r, i, t[e])) return null;
			e++;
			continue;
		}
		if (!co(r, i, a, n)) return null;
		e += a.length;
	}
	return r.length > 0 && i.position === r.length ? go(i) : null;
}
function so(e, t, n) {
	if (/\s/.test(n)) {
		for (; t.position < e.length && /\s/.test(e[t.position]);) t.position++;
		return !0;
	}
	return qa.test(n) ? t.position >= e.length || !qa.test(e[t.position]) ? !1 : (t.position++, !0) : t.position >= e.length || e[t.position].toLowerCase() !== n.toLowerCase() ? !1 : (t.position++, !0);
}
function co(e, t, n, r) {
	switch (n) {
		case "yyyy": return lo(t, "year", po(e, t, 4, 4));
		case "yy": return lo(t, "year", uo(po(e, t, 2, 2)));
		case "MMMM":
		case "MMM": return lo(t, "month", fo(mo(e, t, [
			r.monthNames,
			r.monthGenitiveNames,
			r.abbreviatedMonthNames
		])));
		case "MM":
		case "M": return lo(t, "month", po(e, t, 1, 2));
		case "dddd":
		case "ddd": return mo(e, t, [r.dayNames, r.abbreviatedDayNames]) !== null;
		case "dd":
		case "d": return lo(t, "day", po(e, t, 1, 2));
		case "HH":
		case "H": return lo(t, "hour", po(e, t, 1, 2));
		case "hh":
		case "h": return lo(t, "hour12", po(e, t, 1, 2));
		case "mm":
		case "m": return lo(t, "minute", po(e, t, 1, 2));
		case "ss":
		case "s": return lo(t, "second", po(e, t, 1, 2));
		case "tt": return ho(e, t, r);
		default: return !1;
	}
}
function lo(e, t, n) {
	return n !== null && (e[t] = n, !0);
}
function uo(e) {
	return e === null ? null : e + (e < 50 ? 2e3 : 1900);
}
function fo(e) {
	return e === null ? null : e + 1;
}
function po(e, t, n, r) {
	let i = t.position;
	for (; i < e.length && i - t.position < r && e[i] >= "0" && e[i] <= "9";) i++;
	if (i - t.position < n) return null;
	let a = Number(e.slice(t.position, i));
	return t.position = i, a;
}
function mo(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = null, a = 0;
	for (let e of n) for (let t = 0; t < e.length; t++) {
		let n = e[t].toLowerCase();
		n.length > a && r.startsWith(n) && (i = t, a = n.length);
	}
	return t.position += a, i;
}
function ho(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = n.amDesignator.toLowerCase(), a = n.pmDesignator.toLowerCase();
	for (let [e, n] of i.length >= a.length ? [[i, !1], [a, !0]] : [[a, !0], [i, !1]]) if (e.length > 0 && r.startsWith(e)) return t.position += e.length, t.afternoon = n, !0;
	return i.length === 0 && a.length === 0;
}
function go(e) {
	let t = e.hour ?? 0;
	if (e.hour12 !== null) {
		if (e.hour12 < 1 || e.hour12 > 12) return null;
		t = e.hour12 % 12 + (e.afternoon === !0 ? 12 : 0);
	}
	return e.year === null || e.month === null || e.day === null || e.year < 1 || e.month < 1 || e.month > 12 || e.day < 1 || e.day > no(e.year, e.month, 0).getDate() || t > 23 || e.minute > 59 || e.second > 59 ? null : {
		year: e.year,
		month: e.month,
		day: e.day,
		hour: t,
		minute: e.minute,
		second: e.second,
		millisecond: 0
	};
}
var _o = {
	readCulture: Ua,
	format: Ga,
	parse: eo,
	toDate: to
};
function vo(e) {
	return e % 12 == 0 ? 12 : e % 12;
}
//#endregion
//#region src/rendering/timestamp-format.ts
var yo = /(?:Z|[+-]\d{2}(?::?\d{2})?)$/i, bo = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function xo(e) {
	let t = e?.trim() ?? "";
	if (!bo.test(t)) return null;
	let n = Date.parse(yo.test(t) ? t : `${t}Z`);
	return Number.isNaN(n) ? null : n;
}
function So(e) {
	return e === "date" || e === "time" || e === "relative" || e === "relative-date" ? e : "date-time";
}
function Co(e) {
	return e === "relative" || e === "relative-date";
}
var wo = {
	...Ha,
	date: "yyyy-MM-dd",
	shortTime: "HH:mm",
	longTime: "HH:mm:ss"
};
function To(e, t, n, r) {
	if (t === "relative") return Io(e - r, n.language);
	if (t === "relative-date") {
		let t = Do(e, r);
		if (t !== null) return Ao(n.language).format(t, "day");
	}
	let i = n.temporal ?? wo, a = t === "date" || t === "relative-date" ? i.date : t === "time" ? i.shortTime : Va(i, !1);
	return Ga(new Date(e), a, i);
}
function Eo(e, t, n, r) {
	let i = To(e, t, n, r);
	return t === "relative-date" ? Oo(i, n.language) : i;
}
function Do(e, t) {
	let n = new Date(e), r = new Date(t), i = Math.round((Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) - Date.UTC(r.getFullYear(), r.getMonth(), r.getDate())) / Fo);
	return Math.abs(i) <= 1 ? i : null;
}
function Oo(e, t) {
	return e.length === 0 ? e : e.charAt(0).toLocaleUpperCase(jo(t)) + e.slice(1);
}
var ko = /* @__PURE__ */ new Map();
function Ao(e) {
	let t = ko.get(e);
	return t === void 0 && (t = new Intl.RelativeTimeFormat(jo(e), { numeric: "auto" }), ko.set(e, t)), t;
}
function jo(e) {
	if (e.length !== 0) try {
		return Intl.DateTimeFormat.supportedLocalesOf(e).length > 0 ? e : void 0;
	} catch {
		return;
	}
}
var Mo = 1e3, No = 60 * Mo, Po = 60 * No, Fo = 24 * Po;
function Io(e, t) {
	let n = Ao(t), r = Math.abs(e);
	return r < 45 * Mo ? n.format(0, "second") : r < 45 * No ? n.format(Math.round(e / No), "minute") : r < 22 * Po ? n.format(Math.round(e / Po), "hour") : r < 26 * Fo ? n.format(Math.round(e / Fo), "day") : r < 320 * Fo ? n.format(Math.round(e / (30.4375 * Fo)), "month") : n.format(Math.round(e / (365.25 * Fo)), "year");
}
//#endregion
//#region src/runtime/words.ts
var Lo = "count";
function Ro(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	if (typeof t.key != "string" || t.key.trim().length === 0) return !1;
	for (let e of Object.keys(t)) if (e !== "key" && e !== "args") return !1;
	return t.args === void 0 || t.args === null || typeof t.args == "object" && !Array.isArray(t.args);
}
function zo(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.text == "string" && t.text.trim().length > 0 && Object.keys(t).length === 1;
}
var Bo = /* @__PURE__ */ new Set([
	"date-time",
	"date",
	"time",
	"relative",
	"relative-date"
]);
function Vo(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	for (let e of Object.keys(t)) if (e !== "moment" && e !== "format") return !1;
	return typeof t.moment == "string" && xo(t.moment) !== null && (t.format === void 0 || typeof t.format == "string" && Bo.has(t.format));
}
function Ho(e) {
	if (typeof e != "object" || !e) return !1;
	if (Vo(e)) return !0;
	for (let t of Array.isArray(e) ? e : Object.values(e)) if (Ho(t)) return !0;
	return !1;
}
function Uo(e, t) {
	let n = new Date(e).toISOString(), r = n.slice(0, 10), i = n.slice(11, 16);
	return t === "date" || t === "relative-date" ? r : t === "time" ? `${i} UTC` : `${r} ${i} UTC`;
}
function Wo(e, t, n) {
	return Ro(e) ? qo(n, e.key, e.args) : zo(e) ? Go(n, e.text) : t && typeof e == "string" ? Go(n, e) : e;
}
function Go(e, t) {
	return t.trim().length === 0 || !Ko(e.prefixes, t) ? t : e.lookup(t) ?? t;
}
function Ko(e, t) {
	if (e.length === 0) return !0;
	for (let n of e) if (t.startsWith(n)) return !0;
	return !1;
}
function qo(e, t, n) {
	let r = n?.[Lo];
	return Jo(typeof r == "number" ? e.lookup(`${t}.${Fa(e.language, r)}`) ?? e.lookup(`${t}.other`) ?? e.lookup(t) ?? t : e.lookup(t) ?? t, n, (t) => zo(t) ? Go(e, t.text) : qo(e, t.key, t.args), e.writeMoment);
}
function Jo(e, t, n, r = Uo) {
	if (t == null || !e.includes("{")) return e;
	let i = "", a = 0;
	for (; a < e.length;) {
		if (e[a] === "{") {
			let o = Yo(e, a);
			if (o > 0) {
				let s = e.slice(a + 1, o);
				if (Object.hasOwn(t, s)) {
					i += Zo(t[s], n, r), a = o + 1;
					continue;
				}
			}
		}
		i += e[a], a++;
	}
	return i;
}
function Yo(e, t) {
	let n = t + 1;
	for (; n < e.length && Xo(e.charCodeAt(n));) n++;
	return n > t + 1 && n < e.length && e[n] === "}" ? n : -1;
}
function Xo(e) {
	return e >= 48 && e <= 57 || e >= 65 && e <= 90 || e >= 97 && e <= 122 || e === 95;
}
function Zo(e, t, n) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "boolean" ? e ? "true" : "false" : Ro(e) ? t === void 0 ? Jo(e.key, e.args, void 0, n) : t(e) : zo(e) ? t === void 0 ? e.text : t(e) : Vo(e) ? n(xo(e.moment) ?? 0, e.format ?? "date-time") : String(e);
}
//#endregion
//#region src/rendering/moment-first-paint.ts
var Qo = `script[type='application/json'][${bt}]`;
function $o(e) {
	let t = e.querySelector(Qo)?.textContent?.trim() ?? "";
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
var es = 15e3, ts = /* @__PURE__ */ new Set(), ns = null;
function rs(e) {
	ts.add(e), ns === null && (ns = setInterval(is, es));
}
function is() {
	for (let e of [...ts]) {
		let t = !1;
		try {
			t = e();
		} catch (e) {
			s("a relative tick failed; it is ticked no more.", e);
		}
		t || ts.delete(e);
	}
	ts.size === 0 && ns !== null && (clearInterval(ns), ns = null);
}
//#endregion
//#region src/runtime/client-strings.ts
var as = 256, os = 512, ss = "script[type='application/json'][data-ui-strings]", cs = `[${zr}*='"moment"']`, ls = class {
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
		this.tableLoaded || (this.currentTemporal = $o(e) ?? this.currentTemporal);
		let t = e.querySelector(ss)?.textContent?.trim() ?? "";
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
		return this.lookup(e) === void 0 && this.text(e), qo(this, e, t);
	}
	translate(e, t) {
		return qo(this, e, t);
	}
	writeMoment = (e, t) => (Co(t) && this.noteRelative(), To(e, t, {
		temporal: this.currentTemporal,
		language: this.currentLanguage
	}, Date.now()));
	noteRelative() {
		this.relativeWritten = !0, this.momentHandlers.size > 0 && rs(this.tickMoments);
	}
	tickMoments = () => this.relativeWritten ? (this.relativeWritten = !1, this.notify(this.momentHandlers, "a moment tick handler failed."), !0) : !1;
	resolve(e, t) {
		return Wo(e, t, this);
	}
	resolveText(e) {
		return Wo(e, !0, this);
	}
	write(e, t, n, r) {
		hs(e, t, this.translate(n, r)), this.mark(e, t, r == null || Object.keys(r).length === 0 ? [n] : [n, r]);
	}
	writeText(e, t, n) {
		hs(e, t, Wo(n, !0, this)), this.mark(e, t, n);
	}
	writeValue(e, t, n) {
		if (Ro(n)) {
			this.write(e, t, n.key, n.args);
			return;
		}
		let r = zo(n) ? n.text : typeof n == "string" ? n : "";
		if (r.trim().length > 0) {
			this.writeText(e, t, r);
			return;
		}
		hs(e, t, ""), this.mark(e, t, null);
	}
	mark(e, t, n) {
		fs(e, t, n);
	}
	rewriteMarks(e, t = !1) {
		gs(e, (e) => {
			for (let n of e.querySelectorAll(t ? cs : `[${zr}]`)) for (let [e, r] of Object.entries(ms(n))) {
				if (t && !Ho(r)) continue;
				let i = this.wordsOfMark(r);
				i !== null && hs(n, e === "#text" ? null : e, i);
			}
		});
	}
	wordsOfMark(e) {
		if (typeof e == "string") return Wo(e, !0, this);
		if (!Array.isArray(e)) return null;
		let [t, n] = e;
		return typeof t == "string" ? this.translate(t, typeof n == "object" && n ? n : null) : null;
	}
	askLater(e) {
		this.asker === null || !this.tableLoaded || e.length > os || e.trim().length === 0 || this.complete && !(this.report && this.currentPrefixes.length > 0 && Ko(this.currentPrefixes, e)) || this.askedIn(this.currentLanguage).has(e) || (this.pending.add(e), !this.flushQueued && (this.flushQueued = !0, setTimeout(() => void this.flushAsync(), 0)));
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
		for (let r = 0; r < n.length; r += as) try {
			let a = await e(t, n.slice(r, r + as));
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
function us(e) {
	let t = !1;
	return gs(e, (e) => {
		t ||= e.querySelector(cs) !== null;
	}), t;
}
function ds(e, t) {
	e.hasAttribute("data-ui-words") && fs(e, t, null);
}
function fs(e, t, n) {
	let r = ms(e), i = t ?? "#text";
	if (n === null) {
		if (!(i in r)) return;
		delete r[i];
	} else r[i] = n;
	let a = JSON.stringify(r);
	Object.keys(r).length === 0 ? e.removeAttribute(zr) : e.getAttribute("data-ui-words") !== a && e.setAttribute(zr, a);
}
function ps(e) {
	let t = ms(e)[Br];
	if (typeof t == "string") return t;
	if (!Array.isArray(t) || typeof t[0] != "string") return null;
	let n = t[1];
	return {
		key: t[0],
		args: typeof n == "object" && n ? n : null
	};
}
function ms(e) {
	let t = e.getAttribute(zr);
	if (t === null || t.length === 0) return {};
	try {
		let e = JSON.parse(t);
		return typeof e == "object" && e && !Array.isArray(e) ? e : {};
	} catch {
		return {};
	}
}
function hs(e, t, n) {
	if (t === null) {
		e.textContent !== n && (e.textContent = n);
		return;
	}
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function gs(e, t) {
	t(e);
	for (let n of e.querySelectorAll("template")) gs(n.content, t);
}
var O = new ls();
function _s(e, t) {
	let n = zo(e) ? e.text : e;
	return O.resolve(n, typeof n == "string" && n.length > 0 && t());
}
//#endregion
//#region src/updates/row-idle.ts
var vs = "row-idle";
function ys(e) {
	let t = e.parentElement;
	t !== null && (Cs(t) ? bs(t) : !t.hasAttribute("data-ui-id") && t.parentElement !== null && Cs(t.parentElement) && bs(t.parentElement));
}
function bs(e) {
	let t = xs(e);
	e.hasAttribute("data-ui-row-idle") !== t && e.toggleAttribute(Or, t);
}
function xs(e) {
	for (let t of e.children) {
		if (t.hasAttribute("data-ui-id")) {
			if (Ss(t)) return !0;
			continue;
		}
		for (let e of t.children) if (e.hasAttribute("data-ui-id") && Ss(e)) return !0;
	}
	return !1;
}
function Ss(e) {
	return e.classList.contains("ui-disabled") || e.classList.contains("ui-loading");
}
function Cs(e) {
	return e.hasAttribute("data-ui-key") && e.parentElement?.hasAttribute("data-ui-items-host") === !0;
}
//#endregion
//#region src/interactions/interactive-state.ts
var ws = `.${fi}, .${pi}, [inert]`;
function Ts(e) {
	return `:scope > [${ie}]:is(${e}), :scope > :not([${ie}]) > [${ie}]:is(${e})`;
}
var Es = Ts(ws), Ds = /* @__PURE__ */ new Map();
function k(e) {
	return e.closest(ws) !== null || e.matches(":disabled, [aria-disabled='true']");
}
function A(e) {
	return e.matches(ws) || e.querySelector(Es) !== null;
}
function Os(e, t) {
	if (e.hasAttribute(t)) return !0;
	let n = Ds.get(t);
	return n === void 0 && (n = Ts(`[${t}]`), Ds.set(t, n)), e.querySelector(n) !== null;
}
function ks(e) {
	return e.getClientRects().length > 0 && !e.matches(":disabled") && e.closest("[inert]") === null;
}
var As = `[${ie}], .${mi}`;
function j(e) {
	return e.closest(As)?.matches(`.${mi}`) === !0;
}
function js(e, t) {
	e.classList.contains("ui-disabled") !== t && (e.classList.toggle(fi, t), ys(e)), t ? e.setAttribute("aria-disabled", "true") : e.removeAttribute("aria-disabled");
}
var Ms = {
	isInert: k,
	isReadOnly: j,
	setDisabled: js
};
//#endregion
//#region src/interactions/grid-tracks.ts
function Ns(e, t) {
	return Math.max(e, Math.round(t / 10));
}
function Ps(e) {
	let t = [];
	for (let n of Ls(e.trim())) {
		let e = /^repeat\(\s*(\d+)\s*,(.+)\)$/s.exec(n);
		if (e !== null) {
			let n = Ps(e[2]);
			if (n === null) return null;
			for (let r = Number(e[1]); r > 0; r--) t.push(...n);
			continue;
		}
		let r = Fs(n);
		if (r === null) return null;
		t.push(r);
	}
	return t.length === 0 ? null : t;
}
function Fs(e) {
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
	if (n !== null) return Is({
		kind: "auto",
		value: 0
	}, Number(n[1]));
	let r = /^minmax\(\s*([\d.]+)(?:px)?\s*,\s*([\d.]+)(fr|px)\s*\)$/.exec(e);
	if (r !== null) return Is(r[3] === "fr" ? {
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
function Is(e, t) {
	return t > 0 ? {
		...e,
		min: t
	} : e;
}
function Ls(e) {
	let t = [], n = 0, r = 0;
	for (let i = 0; i < e.length; i++) {
		let a = e[i];
		a === "(" ? n++ : a === ")" ? n-- : a === " " && n === 0 && (i > r && t.push(e.slice(r, i)), r = i + 1);
	}
	return r < e.length && t.push(e.slice(r)), t;
}
function Rs(e, t = "auto") {
	return e.map((e) => zs(e, t)).join(" ");
}
function zs(e, t) {
	switch (e.kind) {
		case "px": return `${Bs(e.value)}px`;
		case "star": return `minmax(${e.min === void 0 ? "0" : `${Bs(e.min)}px`}, ${Bs(e.value)}fr)`;
		case "auto": return e.min === void 0 ? e.max === void 0 ? t : `fit-content(${Bs(e.max)}px)` : `minmax(${Bs(e.min)}px, auto)`;
	}
}
function Bs(e) {
	return String(Math.round(e * 1e3) / 1e3);
}
function Vs(e) {
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
function Hs(e, t) {
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
function Us(e, t, n) {
	let r = 0, i = n;
	for (let n of t) n < e && n + 1 > r ? r = n + 1 : n > e && n < i && (i = n);
	let a = Ws(r, e), o = Ws(e + 1, i);
	return a.length === 0 || o.length === 0 ? null : {
		before: a,
		after: o
	};
}
function Ws(e, t) {
	let n = [];
	for (let r = e; r < t; r++) n.push(r);
	return n;
}
var Gs = {
	sliver: 120,
	passFloors: !1
};
function Ks(e, t, n, r, i = Gs) {
	let a = Ys(e, t, n.before), o = Ys(e, t, n.after);
	if (a.total + o.total <= 0) return null;
	let s = Math.max((i.passFloors ? 0 : a.min) - a.total, o.total - o.max), c = Math.min(a.max - a.total, o.total - (i.passFloors ? 0 : o.min));
	if (s > c) return null;
	let l = (e) => i.sliver > 0 && i.passFloors ? Math.max(i.sliver, e.min) : i.sliver, u = Js(Math.min(Math.max(r, s), c), r, a.total, o.total, s, c, l(a), l(o));
	if (u === 0) return null;
	let d = [...e], f = n.before.every((t) => e[t].kind === "star"), p = n.after.every((t) => e[t].kind === "star");
	if (f && p) {
		let t = ec(n.before, e) + ec(n.after, e), r = a.total + o.total;
		Xs(d, e, a, t * (a.total + u) / r), Xs(d, e, o, t * (o.total - u) / r);
	} else f || Zs(d, a, a.total + u), p || Zs(d, o, o.total - u);
	return i.passFloors && (qs(d, a, a.total + u), qs(d, o, o.total - u)), d;
}
function qs(e, t, n) {
	if (!(n >= t.min - .5)) for (let n of t.indices) {
		let { min: t, ...r } = e[n];
		e[n] = r;
	}
}
function Js(e, t, n, r, i, a, o, s) {
	let c = e, l = n + c, u = r - c;
	return l > 0 && l < o ? c = t < 0 ? -n : o - n : u > 0 && u < s && (c = t > 0 ? r : r - s), Math.min(Math.max(c, i), a);
}
function Ys(e, t, n) {
	let r = $s(n, t), i = n.map((e) => r > 0 ? t[e] / r : 1 / n.length), a = 0, o = Infinity;
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
function Xs(e, t, n, r) {
	let i = ec(n.indices, t);
	for (let a = 0; a < n.indices.length; a++) {
		let o = n.indices[a], s = i > 0 && n.total > 0 ? n.shares[a] : 1 / n.indices.length;
		e[o] = {
			...t[o],
			value: r * s
		};
	}
}
function Zs(e, t, n) {
	for (let r = 0; r < t.indices.length; r++) {
		let i = t.indices[r];
		e[i] = {
			kind: "px",
			value: n * t.shares[r],
			...Qs(e[i])
		};
	}
}
function Qs(e) {
	return {
		...e.min === void 0 ? {} : { min: e.min },
		...e.max === void 0 ? {} : { max: e.max }
	};
}
function $s(e, t) {
	let n = 0;
	for (let r of e) n += t[r];
	return n;
}
function ec(e, t) {
	let n = 0;
	for (let r of e) n += t[r].value;
	return n;
}
function tc(e, t) {
	return Math.round(nc(e, t) * 100);
}
function nc(e, t) {
	let n = $s(t.before, e), r = n + $s(t.after, e);
	return r <= 0 ? 0 : n / r;
}
function rc(e, t, n) {
	let r = $s(t.before, e);
	return (r + $s(t.after, e)) * Math.min(Math.max(n, 0), 1) - r;
}
function ic(e) {
	let t = e === null || e.length === 0 ? NaN : Number(e);
	return t >= 0 && t <= 1 ? t : null;
}
function ac(e, t) {
	let n = [];
	for (let r = 0, i = 0; r < t; r++) n.push(i), i += Number.isFinite(e[r]) ? e[r] : 0;
	return n;
}
var oc = /* @__PURE__ */ new Set();
function sc(e, t, n, r) {
	let i = Ys(e, t, n.before), a = Ys(e, t, n.after);
	return i.total >= 1 && i.total < r ? -i.total : a.total >= 1 && a.total < r ? a.total : i.total >= 1 && i.total < i.min - .5 ? i.min - i.total : a.total >= 1 && a.total < a.min - .5 ? a.total - a.min : 0;
}
function cc(e, t, n, r) {
	let i = /* @__PURE__ */ new Set();
	for (let a of [n.before, n.after]) {
		let n = Ys(e, t, a);
		n.total < Math.max(r, n.min - .5) && a.forEach((e) => i.add(e));
	}
	return i;
}
function lc(e, t) {
	return e.map((e, n) => t.has(n) ? {
		kind: "px",
		value: 0
	} : e);
}
function uc(e, t, n, r = oc) {
	let i = Number(e);
	if (!Number.isInteger(i) || i < 1) return !1;
	let a = /^span\s+(\d+)$/.exec(t.trim()), o = Number(t), s = a === null ? Number.isInteger(o) && o > i ? o : i + 1 : i + Number(a[1]);
	return s - 1 <= n.length && n.slice(i - 1, s - 1).every((e, t) => e < 1 || r.has(i - 1 + t));
}
//#endregion
//#region src/extensions/value-readers.ts
function dc(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" ? String(e) : JSON.stringify(e);
}
function fc(e) {
	return e == null;
}
var pc = "data-ui-trim-input", mc = class {
	readers = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let e of vc) this.register(e);
		for (let t of e ?? []) this.register(t);
	}
	register(e) {
		this.readers.set(e.kind, e.read);
	}
	read(e) {
		let t = e.getAttribute(Vt);
		if (t === null) return hc(e);
		let n = this.readers.get(t);
		return n === void 0 ? (s("value reader: no reader registered for this kind.", { kind: t }), null) : n(e);
	}
	readBound(e) {
		let t = this.read(e);
		return typeof t == "string" && e.hasAttribute(pc) ? t.trim() : t;
	}
	readHeld(e) {
		let t = _c(e);
		return t === null ? null : this.read(t);
	}
};
function hc(e) {
	if (e instanceof HTMLInputElement) switch (e.type) {
		case "checkbox": return e.checked;
		case "number":
		case "range": return e.value.trim().length === 0 ? null : Number(e.value);
		default: return e.value;
	}
	return e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement ? e.value : e instanceof HTMLDetailsElement ? e.open : null;
}
var gc = "input, textarea, select";
function _c(e) {
	return e.hasAttribute("data-ui-value-kind") || e.matches(gc) ? e : e.querySelector("[data-ui-value-holder]") ?? e.querySelector(`[data-ui-value-kind], ${gc}`);
}
var vc = [
	{
		kind: "flyout-open",
		read: (e) => e.classList.contains("ui-flyout--open")
	},
	{
		kind: "splitter-position",
		read: (e) => ic(e.getAttribute(Jn))
	},
	{
		kind: "pane-layout",
		read: (e) => e.getAttribute(Yn)
	},
	{
		kind: "tabs-selected",
		read: (e) => e.getAttribute(oi)
	},
	{
		kind: "tab-caption",
		read: (e) => e.getAttribute(si)
	},
	{
		kind: "tab-pinned",
		read: (e) => e.hasAttribute(ci)
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
		read: (e) => e.getAttribute(ri)
	},
	{
		kind: "selected-keys",
		read: (e) => yc(e, ii)
	},
	{
		kind: Ht,
		read: (e) => yc(e, dt)
	},
	{
		kind: Ut,
		read: (e) => e.getAttribute(ft)
	},
	{
		kind: Wt,
		read: (e) => e.getAttribute(pt)
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
function yc(e, t) {
	let n = e.getAttribute(t);
	return n === null ? null : JSON.parse(n);
}
function bc(e) {
	if (e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio")) {
		e.checked = !1;
		return;
	}
	(e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement) && (e.value = "");
}
//#endregion
//#region src/interactions/keyboard-shortcut.ts
function xc(e) {
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
		default: o = Lc(e);
	}
	return o === null ? null : {
		code: o,
		ctrl: n,
		shift: r,
		alt: i,
		meta: a
	};
}
function Sc(e, t, n = jc()) {
	return t.code !== e.code || t.shiftKey !== e.shift || t.altKey !== e.alt ? !1 : e.ctrl && !e.meta && n ? t.ctrlKey !== t.metaKey : t.ctrlKey === e.ctrl && t.metaKey === e.meta;
}
function Cc(e, t = jc()) {
	let n = Dc(e.code, t);
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
function wc(e, t = jc()) {
	let n = Tc(e.code), r = (t, r) => [
		t ? "Control" : "",
		e.alt ? "Alt" : "",
		e.shift ? "Shift" : "",
		r ? "Meta" : "",
		n
	].filter((e) => e.length > 0).join("+");
	return e.ctrl && !e.meta && t ? `${r(!0, !1)} ${r(!1, !0)}` : r(e.ctrl, e.meta);
}
function Tc(e) {
	return /^Key[A-Z]$/.test(e) ? e.slice(3) : /^Digit[0-9]$/.test(e) ? e.slice(5) : Ec[e] ?? e;
}
var Ec = {
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
function Dc(e, t) {
	return /^Key[A-Z]$/.test(e) ? e.slice(3) : /^Digit[0-9]$/.test(e) ? e.slice(5) : (t ? kc[e] : void 0) ?? Oc[e] ?? e;
}
var Oc = {
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
}, kc = {
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
}, Ac = null;
function jc() {
	return Ac === null && (Ac = Mc()), Ac;
}
function Mc() {
	if (typeof navigator > "u") return !1;
	let e = navigator.userAgentData?.platform;
	return /mac/i.test(e ?? navigator.platform ?? "");
}
var Nc = {
	words(e) {
		let t = xc(e);
		return t === null ? null : Cc(t);
	},
	aria(e) {
		let t = xc(e);
		return t === null ? null : wc(t);
	},
	matches(e, t) {
		let n = xc(t);
		return n !== null && Sc(n, e);
	},
	isComposing: M
}, Pc = 229;
function M(e) {
	return e.isComposing || e.keyCode === Pc;
}
function N(e, t = {}) {
	return !e.ctrlKey && !e.metaKey && (t.alt === !0 || !e.altKey) && (t.shift === !0 || !e.shiftKey) && !M(e);
}
var Fc = class {
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
function Ic(e) {
	return [
		e.ctrl ? "ctrl" : "",
		e.shift ? "shift" : "",
		e.alt ? "alt" : "",
		e.meta ? "meta" : "",
		e.code
	].filter((e) => e.length > 0).join("+");
}
function Lc(e) {
	if (e.length === 1) {
		let t = e.toUpperCase();
		return t >= "A" && t <= "Z" ? `Key${t}` : t >= "0" && t <= "9" ? `Digit${t}` : Rc[t] ?? null;
	}
	let t = e.length === 0 ? "" : e[0].toUpperCase() + e.slice(1).toLowerCase();
	return /^F([1-9]|1[0-9]|2[0-4])$/.test(t.toUpperCase()) ? t.toUpperCase() : Rc[t] ?? null;
}
var Rc = {
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
}, zc = "data-ui-rename-field";
function Bc(e) {
	return e instanceof Element && e.closest(`[${zc}]`) !== null;
}
function Vc(e) {
	let { container: t, title: n } = e;
	if (t.querySelector(`.${e.className}`) !== null) return !1;
	let r = document.createElement("input");
	r.type = "text", r.className = e.className, r.setAttribute(zc, ""), r.setAttribute($e, ""), r.value = e.value, Hc(r, n, t);
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
function Hc(e, t, n) {
	let r = t.getBoundingClientRect(), i = n.getBoundingClientRect(), a = getComputedStyle(t), o = Uc(n), s = o > 0 && i.width > 0 ? i.width / o : 1;
	e.style.left = Wc((r.left - i.left) / s - n.clientLeft), e.style.top = Wc((r.top - i.top) / s - n.clientTop), e.style.width = Wc(r.width / s), e.style.height = Wc(r.height / s), e.style.fontFamily = a.fontFamily, e.style.fontSize = a.fontSize, e.style.fontWeight = a.fontWeight, e.style.fontStyle = a.fontStyle, e.style.lineHeight = a.lineHeight, e.style.letterSpacing = a.letterSpacing, e.style.textAlign = a.textAlign;
}
function Uc(e) {
	let t = getComputedStyle(e), n = parseFloat(t.width);
	return Number.isFinite(n) ? t.boxSizing === "border-box" ? n : n + parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth) : e.offsetWidth;
}
function Wc(e) {
	return `${Math.round(e * 64) / 64}px`;
}
//#endregion
//#region src/interactions/field-escape.ts
var Gc = "data-ui-runs-on-escape", Kc = "ui-key-value-action__row", qc = "ui-key-value-action__value-input", Jc = "ui-key-value-action__edit-action";
function Yc(e) {
	return M(e) || Xc(e.target) !== null;
}
function Xc(e) {
	return e instanceof Element ? Bc(e) || Zc(e) ? e : e.closest("[data-ui-owns-keys]") ?? Qc(e)?.cell ?? null : null;
}
function Zc(e) {
	return e instanceof Element && e.hasAttribute(Gc) && (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && !e.readOnly && !k(e);
}
function Qc(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${qc}, .${Jc}`), n = t?.closest(".ui-key-value-action__row") ?? null;
	return t === null || n === null || !n.hasAttribute("data-ui-row-editing") ? null : {
		cell: t,
		row: n
	};
}
//#endregion
//#region src/interactions/caret-fields.ts
var $c = /* @__PURE__ */ new Set([
	"text",
	"search",
	"number",
	"password",
	"email",
	"url",
	"tel"
]), el = /* @__PURE__ */ new Set([
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
]), tl = /* @__PURE__ */ new Set([
	"KeyA",
	"KeyC",
	"KeyV",
	"KeyX",
	"KeyZ",
	"KeyY",
	"Insert"
]), nl = /^F\d{1,2}$/;
function rl(e) {
	return e instanceof HTMLInputElement && $c.has(e.type);
}
function il(e) {
	return rl(e) || e instanceof HTMLTextAreaElement;
}
function al(e) {
	return il(e) || e instanceof HTMLElement && e.isContentEditable;
}
function ol(e) {
	let t = e.target;
	if (!al(t)) return !1;
	if (M(e)) return !0;
	let n = e.key;
	return n === "Tab" || n === "Escape" || nl.test(n) || e.altKey ? !1 : n === "Enter" ? !rl(t) : e.ctrlKey || e.metaKey ? el.has(n) || tl.has(e.code) : !0;
}
var sl = {
	...Nc,
	isFieldKey: ol,
	isPlainKey: N,
	isEscapeClaimed: Yc
}, cl = "ui-draft-dropped";
function ll(e) {
	e.dispatchEvent(new Event(cl, { bubbles: !0 }));
}
//#endregion
//#region src/interactions/own-control.ts
var ul = `.ui-text-input__row, .ui-number-input__row, .ui-temporal-input__row, .ui-file-input__row, .ui-color-input__row, .${Si}, .ui-field-box`, dl = "button, a, input, select, textarea, label, summary, [role='button'], [contenteditable=''], [contenteditable='true']", fl = `${dl}, ${ul}, ${xi}, .${ve}`, pl = "button, a, summary, [role='button']";
function ml(e) {
	let t = [];
	for (let n of e.querySelectorAll(fl)) if (!(n.classList.contains("ui-row__grip") || !_l(e, n) || gl(e, n) || t.some((e) => e.contains(n))) && (t.push(n), t.length > 1)) return null;
	let n = t[0];
	return n instanceof HTMLElement && n.matches(pl) ? n : null;
}
function hl(e) {
	let t = [];
	for (let n of e.querySelectorAll(dl)) gl(e, n) && _l(e, n) && t.push(n);
	return t;
}
function gl(e, t) {
	let n = t.closest(`[${fe}]`);
	return n !== null && n !== e && e.contains(n);
}
function _l(e, t) {
	let n = t.closest(xi);
	return (n === null || !e.contains(n)) && t.closest(".ui-action-bar") === null;
}
function vl(e, t) {
	if (!(e instanceof Element)) return null;
	let n = e.closest(fl);
	return n !== null && n !== t && t.contains(n) ? n : null;
}
//#endregion
//#region src/interactions/roving-focus.ts
function yl(e) {
	let t = Cl(e.key), n = wl(e.key, e.axis);
	if (t === null && n === 0) return null;
	let r = e.items.filter(F);
	if (r.length === 0) return null;
	if (t !== null) return t === "first" ? r[0] : r[r.length - 1];
	let i = e.current === null ? -1 : r.indexOf(e.current);
	if (i === -1) return n > 0 ? r[0] : r[r.length - 1];
	let a = i + n;
	return a >= 0 && a < r.length ? r[a] : e.loop ?? !0 ? r[(a + r.length) % r.length] : null;
}
function bl(e, t) {
	return Cl(e) !== null || wl(e, t) !== 0;
}
var xl = {
	target: yl,
	applyTabIndex: P
};
function P(e, t) {
	for (let n of e) n.tabIndex = n === t ? 0 : -1;
}
function Sl(e, t) {
	t !== null && (P(e, t), t.focus());
}
function F(e) {
	return e.getClientRects().length > 0 && !k(e);
}
function Cl(e) {
	return e === "Home" ? "first" : e === "End" ? "last" : null;
}
function wl(e, t) {
	return t !== "horizontal" && (e === "ArrowDown" || e === "ArrowUp") ? e === "ArrowDown" ? 1 : -1 : t !== "vertical" && (e === "ArrowRight" || e === "ArrowLeft") ? e === "ArrowRight" ? 1 : -1 : 0;
}
//#endregion
//#region src/items/items-viewport.ts
function Tl(e) {
	return e.hasAttribute("data-ui-host-viewport") ? e.parentElement ?? e : e;
}
function El(e) {
	return e instanceof Element ? e.hasAttribute("data-ui-items-host") ? e : e.querySelector(`:scope > [${b}][${Kt}]`) : null;
}
function Dl(e) {
	let t = Tl(e);
	return t === e ? {
		top: e.scrollTop,
		height: e.clientHeight,
		contentHeight: e.scrollHeight
	} : {
		top: t.scrollTop - kl(e, t),
		height: t.clientHeight,
		contentHeight: e.scrollHeight
	};
}
function Ol(e, t) {
	let n = Tl(e);
	n.scrollTop = n === e ? t : t + kl(e, n);
}
function kl(e, t) {
	return e.getBoundingClientRect().top - t.getBoundingClientRect().top - t.clientTop + t.scrollTop;
}
function Al(e) {
	let t = e.getBoundingClientRect();
	return t.height > 0 || e.firstElementChild === null ? t : e.firstElementChild.getBoundingClientRect();
}
//#endregion
//#region src/interactions/multi-select-keys.ts
function jl(e) {
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
function Ml(e) {
	if (e === null) return null;
	let t = Number(e);
	return Number.isInteger(t) && t > 0 ? t : null;
}
function Nl(e, t) {
	return t !== null && e.length >= t;
}
function Pl(e, t, n) {
	return e.includes(t) ? e.filter((e) => e !== t) : Nl(e, n) ? null : [...e, t];
}
function Fl(e, t) {
	return e.includes(t) ? e.filter((e) => e !== t) : null;
}
var Il = /[,\uFF0C\r\n]/;
function Ll(e) {
	return Il.test(e);
}
function Rl(e) {
	return e.split(Il).map((e) => e.trim()).filter((e) => e.length > 0);
}
function zl(e) {
	let t = e.split(Il), n = t.pop() ?? "";
	return {
		tags: t.map((e) => e.trim()).filter((e) => e.length > 0),
		rest: n
	};
}
function Bl(e, t, n, r, i) {
	let a = [...e], o = [], s = null;
	for (let e of t) {
		if (a.includes(e.key)) continue;
		let t = [...a, e.key], c = Nl(a, n) ? r : i(a, t);
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
function Vl(e, t, n) {
	let r = [];
	for (let i of e.querySelectorAll(t)) i.closest(n) === e && r.push(i);
	return r;
}
function Hl(e) {
	return Vl(e, Bn, `.${x}`);
}
//#endregion
//#region src/interactions/selected-key.ts
function Ul(e, t, n) {
	t.length !== 0 && e.getAttribute(n.attribute) !== t && (e.setAttribute(n.attribute, t), n.apply(e), e.hasAttribute(n.bindingAttribute) && e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function Wl(e, t, n) {
	return e.length === 0 ? null : e.some((e) => n(e) === t) ? t : n(e[0]);
}
//#endregion
//#region src/interactions/row-selection.ts
var Gl = "data-ui-bind-selected-keys", I = `.ui-items-view, .ui-table, .${ar}`, Kl = `.ui-items-view__item, .${tr}, .${or}`, ql = ".ui-items-view, .ui-table", Jl = {
	shift: !1,
	ctrl: !1
}, Yl = /* @__PURE__ */ new WeakMap();
function Xl(e, t) {
	t !== null && !Yl.has(e) && Zl(e, t);
}
function Zl(e, t) {
	let n = R(t);
	n.length > 0 && Yl.set(e, n);
}
function Ql(e) {
	return {
		shift: e.shiftKey,
		ctrl: e.ctrlKey || e.metaKey
	};
}
function $l(e, t) {
	let n = Ql(t);
	return n.shift && e.hasAttribute("data-ui-no-row-select") ? {
		shift: !0,
		ctrl: !0
	} : n;
}
function eu(e) {
	return !e.hasAttribute(gr);
}
function L(e) {
	if (e.getClientRects().length > 0) return e;
	let t = e.querySelector(`:scope > [${ie}]`);
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function tu(e) {
	switch (e.getAttribute(ti)) {
		case "one": {
			let t = e.getAttribute(ri);
			return new Set(t === null || t.length === 0 ? [] : [t]);
		}
		case "many": return new Set(uu(du(e)));
		default: return /* @__PURE__ */ new Set();
	}
}
function nu(e, t) {
	let n = tu(e), r = e.getAttribute(ti), i = r === "one" || r === "many";
	for (let e of t) {
		let t = n.has(R(e));
		e.toggleAttribute(ni, t), i ? e.setAttribute("aria-selected", t ? "true" : "false") : e.removeAttribute("aria-selected");
	}
}
function ru(e) {
	return e.filter((e) => e.hasAttribute(ni));
}
function iu(e, t, n, r, i) {
	let a = R(n);
	if (!su(n)) return !1;
	switch (e.getAttribute(ti)) {
		case "one": return Ul(e, a, {
			attribute: ri,
			bindingAttribute: ai,
			apply: (e) => nu(e, t)
		}), !0;
		case "many": return au(e, t, n, a, r, i), !0;
		default: return !1;
	}
}
function au(e, t, n, r, i, a) {
	let o = du(e);
	if (o === null) return;
	let s = uu(o), c;
	if (i.shift) {
		let o = Yl.get(e), l = o === void 0 ? null : a?.(o, r) ?? null, u = t.find((e) => R(e) === o) ?? n, d = l === null ? lu(t, u, n).map(R) : cu(l, t);
		c = i.ctrl ? [...s.filter((e) => !d.includes(e)), ...d] : d;
	} else i.ctrl ? (c = s.includes(r) ? s.filter((e) => e !== r) : [...s, r], Yl.set(e, r)) : (c = [r], Yl.set(e, r));
	ou(e, t, c);
}
function ou(e, t, n) {
	let r = du(e);
	if (r === null) return;
	let i = JSON.stringify(n);
	r.getAttribute("data-ui-selected-keys") !== i && (r.setAttribute(ii, i), nu(e, t), r.hasAttribute(Gl) && r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function su(e) {
	return R(e).length > 0 && !Os(e, "data-ui-unselectable") && !A(e);
}
function cu(e, t) {
	let n = new Map(t.map((e) => [R(e), e]));
	return e.filter((e) => {
		let t = n.get(e);
		return t === void 0 || L(t) !== null && su(t);
	});
}
function lu(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	return r < 0 || i < 0 ? [n] : e.slice(Math.min(r, i), Math.max(r, i) + 1).filter((e) => L(e) !== null && su(e));
}
function uu(e) {
	return jl(e?.getAttribute("data-ui-selected-keys") ?? null);
}
function du(e) {
	let t = e.closest(C);
	for (let n of e.querySelectorAll(`[${b}]`)) if (n.closest(I) === e && n.closest(C) === t) return n;
	return null;
}
function R(e) {
	return e.getAttribute("data-ui-key") ?? "";
}
var fu = {
	isSelected: (e) => e.hasAttribute(ni),
	toggle: pu,
	setSelected: mu,
	setSelectedKeys: hu
};
function pu(e) {
	let t = e.closest(I);
	t !== null && e instanceof HTMLElement && iu(t, gu(t), e, {
		shift: !1,
		ctrl: !0
	});
}
function mu(e, t, n) {
	let r = [];
	for (let e of t) e.classList.contains("ui-hidden") || r.push(R(e));
	hu(e, r, n);
}
function hu(e, t, n) {
	if (!(e instanceof HTMLElement)) return;
	let r = gu(e), i = new Set(r.filter((e) => !su(e)).map(R)), a = /* @__PURE__ */ new Set();
	for (let e of t) e.length > 0 && !i.has(e) && a.add(e);
	let o = [...tu(e)].filter((e) => !a.has(e));
	ou(e, r, n ? [...o, ...a] : o);
}
function gu(e) {
	return Vl(e, Kl, I);
}
//#endregion
//#region src/interactions/table-column-layout.ts
var _u = "--ui-table-order-";
function vu(e) {
	let t = new Set((e.getAttribute("data-ui-table-hidden") ?? "").split(" ").filter((e) => e.length > 0)), n = e instanceof HTMLElement ? e.style : null;
	return {
		place: (e) => {
			let t = n?.getPropertyValue(`--ui-table-order-${e}`).trim() ?? "";
			return t.length === 0 ? e : Number(t);
		},
		isHidden: (e) => t.has(String(e))
	};
}
var yu = "ui-table", bu = `[${Zn}]:not(.${ir})`, xu = `.${tr} > [aria-colspan]:not([${Zn}])`;
function Su(e, t, n, r) {
	let i = /* @__PURE__ */ new Map();
	for (let e of t) n.has(e) || i.set(e, String(i.size + 1));
	let a = String(i.size), o = r ? ":not([aria-colindex])" : "";
	Cu(e, "aria-colcount", a);
	for (let t of e.querySelectorAll(`${bu}${o}, ${xu}${o}`)) {
		if (t.closest(`.${yu}`) !== e) continue;
		if (!t.hasAttribute("data-ui-table-column")) {
			Cu(t, "aria-colindex", "1"), Cu(t, "aria-colspan", a);
			continue;
		}
		let n = i.get(Number(t.getAttribute(Zn)));
		n === void 0 ? t.removeAttribute("aria-colindex") : Cu(t, "aria-colindex", n);
	}
}
function Cu(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/interactions/row-cursor.ts
var wu = ".ui-table[role='grid']", Tu = "gridcell", Eu = "aria-colspan", Du = /* @__PURE__ */ new WeakMap();
function Ou(e) {
	let t = e.closest(I);
	if (t === null) return null;
	if (e === t) return {
		root: t,
		row: null
	};
	let n = e.closest(Kl);
	return n !== null && n.closest(I) === t ? {
		root: t,
		row: n
	} : null;
}
function ku(e) {
	return e.target instanceof Element && !ol(e) ? Au(e.target) : null;
}
function Au(e) {
	let t = Ou(e);
	if (t === null || t.row !== null && vl(e, t.row) !== null) return null;
	let n = e.closest(`[${bi}]`);
	return n !== null && n !== t.root && t.root.contains(n) ? null : t;
}
function ju(e) {
	return e.filter((e) => L(e) !== null && !A(e));
}
function Mu(e) {
	return Nu(e) ?? ju(e)[0] ?? null;
}
function Nu(e) {
	return e.find((e) => e.hasAttribute("data-ui-row-focus")) ?? e.find((e) => e.hasAttribute("data-ui-selected") && !A(e)) ?? null;
}
function Pu(e) {
	return Nu(gu(e));
}
function Fu(e, t) {
	if (e.hasAttribute("data-ui-row-cursor-waits") || t.some((e) => e.hasAttribute("data-ui-row-focus"))) return;
	let n = Mu(t);
	n !== null && Lu(e, t, n);
}
function Iu(e, t) {
	t === null ? e.removeAttribute("aria-labelledby") : e.setAttribute("aria-labelledby", zi(t, "ui-row-name"));
}
function Lu(e, t, n, r = null, i = !0) {
	for (let e of t) e !== n && e.hasAttribute("data-ui-row-focus") && e.removeAttribute(Pe);
	n.hasAttribute("data-ui-row-focus") || n.setAttribute(Pe, ""), e.removeAttribute(Fe);
	let a = Ru(e, n, r);
	i && ((L(n) ?? n).scrollIntoView({ block: "nearest" }), a !== null && Wu(e, n, a));
}
function Ru(e, t, n) {
	let r = zu(e) ? Bu(e, t, n) : null;
	for (let t of e.querySelectorAll(`[${Le}]`)) t !== r && t.closest(I) === e && t.removeAttribute(Le);
	if (r === null) return e.setAttribute("aria-activedescendant", zi(t, "ui-row")), null;
	r.hasAttribute("data-ui-cell-focus") || r.setAttribute(Le, "");
	let i = r.getAttribute(Zn);
	return i !== null && Du.set(e, i), e.setAttribute("aria-activedescendant", zi(r, "ui-cell")), r;
}
function zu(e) {
	return e.matches(wu);
}
function Bu(e, t, n) {
	if (n instanceof HTMLElement && n.parentElement === t && n.getAttribute("role") === Tu) {
		if (!n.hasAttribute("data-ui-owns-keys")) return n;
		let e = Vu(t, n.getAttribute(Zn));
		if (e !== null) return e;
	}
	let r = Hu(e, t), i = Du.get(e);
	if (i === void 0) return r[0] ?? null;
	let a = r.find((e) => e.getAttribute(Zn) === i);
	if (a !== void 0) return a;
	let o = vu(e), s = o.place(Number(i)), c = (e) => Math.abs(o.place(Number(e.getAttribute(Zn))) - s);
	return r.reduce((e, t) => e === null || c(t) < c(e) ? t : e, null);
}
function Vu(e, t) {
	for (let n of e.children) if (t !== null && n instanceof HTMLElement && n.getAttribute("data-ui-table-column") === t && Uu(n)) return n;
	return null;
}
function Hu(e, t) {
	let n = vu(e), r = [];
	for (let e of t.children) {
		let t = Number(e.getAttribute("data-ui-table-column") ?? NaN);
		e instanceof HTMLElement && Number.isInteger(t) && Uu(e) && !n.isHidden(t) && r.push({
			cell: e,
			place: n.place(t)
		});
	}
	return r.sort((e, t) => e.place - t.place).map((e) => e.cell);
}
function Uu(e) {
	return e.getAttribute("role") === Tu && !e.hasAttribute("data-ui-owns-keys");
}
function Wu(e, t, n) {
	let r = e.querySelector(`:scope > .${nr}`);
	if (r === null || !(r.scrollWidth > r.clientWidth) || !n.hasAttribute("data-ui-table-column")) return;
	let i = r.getBoundingClientRect(), a = i.left + i.width / 2, o = i.left + r.clientLeft, s = o + r.clientWidth;
	for (let e of t.children) {
		if (e === n || !(e instanceof HTMLElement) || getComputedStyle(e).position !== "sticky") continue;
		let t = e.getBoundingClientRect();
		t.left + t.width / 2 < a ? o = Math.max(o, t.right) : s = Math.min(s, t.left);
	}
	let c = n.getBoundingClientRect();
	r.scrollLeft += Gu(c.left, c.right, o, s);
}
function Gu(e, t, n, r) {
	return e < n ? e - n : t > r ? Math.min(t - r, e - n) : 0;
}
function Ku(e) {
	for (let t of e.children) if (t instanceof HTMLElement && t.hasAttribute("data-ui-cell-focus")) return t;
	return null;
}
function qu(e) {
	return Du.get(e) ?? null;
}
function Ju(e, t, n, r) {
	if (n !== null && Zu(n)) return null;
	let i = Hu(e, t), a = n?.getAttribute("data-ui-table-column") ?? null, o = i.findIndex((e) => e.getAttribute(Zn) === a);
	switch (r) {
		case "Home": return i[0] ?? null;
		case "End": return i[i.length - 1] ?? null;
		case "ArrowLeft": return o > 0 ? i[o - 1] : null;
		case "ArrowRight": return o < 0 ? i[0] ?? null : i[o + 1] ?? null;
		default: return null;
	}
}
function Yu(e, t, n, r) {
	let i = Xu(t), a = (n === null ? -1 : i.indexOf(n)) + (r ? 1 : -1);
	return i.length === 0 || a < -1 || a >= i.length ? null : a === -1 ? Bu(e, t, null) : i[a];
}
function Xu(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && Zu(e));
}
function Zu(e) {
	return Uu(e) && e.hasAttribute(Eu) && !e.hasAttribute("data-ui-table-column");
}
function Qu(e) {
	let t = Xu(e);
	return t[t.length - 1] ?? null;
}
function $u(e, t) {
	let n = t;
	for (; n !== null && n.parentElement !== e;) n = n.parentElement;
	return n?.getAttribute("role") === Tu ? n : null;
}
function ed(e, t = null) {
	let n = e.closest(I);
	n !== null && e instanceof HTMLElement && Lu(n, gu(n), e, t);
}
function td(e, t) {
	let n = new CustomEvent(Re, {
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
function nd(e, t) {
	return bl(e, t === "grid" ? "both" : t) || t !== "horizontal" && rd(e);
}
function rd(e) {
	return e === "PageDown" || e === "PageUp";
}
function id(e, t, n, r) {
	if (!nd(e, r)) return null;
	let i = ju(t);
	if (rd(e)) return ad(i, n, e === "PageDown");
	if (r === "grid" && (e === "ArrowUp" || e === "ArrowDown")) return od(i, n, e === "ArrowDown");
	let a = i.map((e) => L(e) ?? e), o = yl({
		key: e,
		items: a,
		current: n === null ? null : L(n),
		axis: r === "grid" ? "horizontal" : r,
		loop: !1
	});
	return o === null ? null : i[a.indexOf(o)] ?? null;
}
function ad(e, t, n) {
	let r = t === null ? -1 : e.indexOf(t), i = r < 0 ? null : e[r].parentElement;
	if (i === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let a = (L(e[r]) ?? e[r]).getBoundingClientRect(), o = Math.min(Dl(i).height, window.innerHeight), s = n ? 1 : -1, c = null;
	for (let t = r + s; t >= 0 && t < e.length; t += s) {
		let r = (L(e[t]) ?? e[t]).getBoundingClientRect();
		if (c !== null && (n ? r.bottom > a.top + o + .5 : r.top < a.bottom - o - .5)) break;
		c = e[t];
	}
	return c;
}
function od(e, t, n) {
	let r = t === null ? null : L(t);
	if (r === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let i = r.getBoundingClientRect(), a = sd(i), o = e.map((e) => ({
		row: e,
		rect: (L(e) ?? e).getBoundingClientRect()
	})).filter(({ rect: e }) => n ? e.top >= i.bottom - .5 : e.bottom <= i.top + .5);
	if (o.length === 0) return null;
	let s = o.reduce((e, t) => (n ? t.rect.top < e.rect.top : t.rect.bottom > e.rect.bottom) ? t : e);
	return o.filter(({ rect: e }) => n ? e.top < s.rect.bottom - .5 : e.bottom > s.rect.top + .5).reduce((e, t) => Math.abs(sd(t.rect) - a) < Math.abs(sd(e.rect) - a) ? t : e).row;
}
function sd(e) {
	return e.left + e.width / 2;
}
var cd = "ui-row-press";
function ld(e, t, n) {
	(e.hasAttribute("data-ui-id") ? e : e.querySelector(":scope > [data-ui-id]") ?? e).dispatchEvent(n === void 0 ? new Event(t, { bubbles: !0 }) : new CustomEvent(t, {
		bubbles: !0,
		detail: n
	}));
}
function ud(e, t, n) {
	let r = n.hasAttribute(Pe), i = n.contains(document.activeElement);
	if (!r && !i) return null;
	let a = t.indexOf(n), o = t.filter((e) => e !== n);
	return () => {
		if (i && e.focus({ preventScroll: !0 }), !r) return;
		let n = dd(t, o, a);
		n !== null && Lu(e, o, n);
	};
}
function dd(e, t, n) {
	let r = ju(t);
	return n < 0 || r.length === 0 ? null : r.find((t) => e.indexOf(t) > n) ?? r[r.length - 1];
}
function fd(e, t) {
	let n = t.find((e) => e.hasAttribute(Pe));
	if (n === void 0 || L(n) !== null) return;
	let r = dd(t, t, t.indexOf(n));
	if (r !== null) {
		Lu(e, t, r, null, !1);
		return;
	}
	n.removeAttribute(Pe), Ku(n)?.removeAttribute(Le), e.removeAttribute("aria-activedescendant");
}
function pd(e) {
	let t = e.parentElement, n = t?.closest(I) ?? null;
	return n !== null && (n === t || n === t?.parentElement) ? n : t;
}
function md(e) {
	let t = e.hasAttribute(Pe), n = e.contains(document.activeElement);
	return t || n ? {
		cursor: t,
		focus: n,
		key: e.getAttribute(y)
	} : null;
}
function hd(e, t, n) {
	let r = pd(e);
	if (n !== null && r !== null && (n.focus && !r.contains(document.activeElement) && r.focus({ preventScroll: !0 }), n.cursor)) {
		if (t === null) {
			typeof n.key == "string" && r.setAttribute(Fe, n.key);
			return;
		}
		[...e.children].some((e) => e !== t && e.hasAttribute("data-ui-row-focus")) || vd(r, t);
	}
}
function gd(e, t) {
	let n = pd(e), r = n?.getAttribute("data-ui-row-cursor-waits") ?? null;
	n !== null && r !== null && r === t.getAttribute("data-ui-key") && (n.removeAttribute(Fe), [...e.children].some((e) => e !== t && e.hasAttribute("data-ui-row-focus")) || vd(n, t));
}
function _d(e) {
	return e.getAttribute(Fe);
}
function vd(e, t) {
	t.setAttribute(Pe, ""), Ru(e, t, null);
}
//#endregion
//#region src/interactions/popup-focus.ts
var yd = "data-ui-active", bd = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(","), xd = /* @__PURE__ */ new Set([
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
]), Sd = !1, Cd = !1, wd = null, Td = /* @__PURE__ */ new Set(), Ed = [], Dd = /* @__PURE__ */ new WeakSet();
typeof window < "u" && (window.addEventListener("pointerdown", (e) => Od(e.target, e.pointerType), !0), window.addEventListener("keydown", (e) => kd(e), !0), window.addEventListener("focus", (e) => jd(e.target), !0), window.addEventListener("focusin", (e) => jd(e.target), !0), window.addEventListener("focusout", (e) => Md(e), !0), window.addEventListener("keydown", (e) => Ad(e)));
function Od(e, t = "") {
	Sd = !0, Cd = t === "touch";
	let n = document.activeElement;
	wd = n, n instanceof Element && n !== document.body && e instanceof Node && n.contains(e) && Ld(n, !Nd(n)), Rd(n);
}
function kd(e) {
	if (!(e instanceof KeyboardEvent && xd.has(e.key))) {
		Sd = !1;
		for (let e of [...Td]) Ld(e, !1);
		Rd(document.activeElement);
	}
}
function Ad(e) {
	if (!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || !N(e)) return;
	let t = document.activeElement;
	t instanceof Element && t !== document.body && !Nd(t) && Ld(t, !0);
}
function jd(e) {
	Sd && !Nd(e) && Ld(e, !0), e === document.activeElement && Rd(document.activeElement);
}
function Md(e) {
	e.target instanceof Element && e.target.hasAttribute(yd) || Ld(e.target, !1), e.relatedTarget === null && queueMicrotask(() => Rd(document.activeElement));
}
function Nd(e) {
	return il(e) ? !e.readOnly && !e.disabled : e instanceof HTMLElement && (e.isContentEditable || e.getAttribute("role") === "spinbutton" && e.getAttribute("aria-readonly") !== "true");
}
function Pd() {
	return Sd && wd instanceof HTMLElement && wd !== document.body ? wd : null;
}
function Fd() {
	return Sd;
}
function Id() {
	return Sd && Cd;
}
function Ld(e, t) {
	if (e instanceof Element) {
		if (t) {
			for (let e of Td) e.isConnected || Td.delete(e);
			Td.add(e);
		} else Td.delete(e);
		e.hasAttribute("data-ui-pointer-focus") !== t && e.toggleAttribute(Zr, t), e === document.activeElement && Rd(e);
	}
}
function Rd(e) {
	let t = e === null || e === document.body || Nd(e) ? null : e.hasAttribute("data-ui-pointer-focus") ? "pointer" : "keyboard", n = e === null || t === null ? [] : zd(e);
	for (let e of Ed) n.includes(e) || e.removeAttribute(Qr);
	for (let e of n) t !== null && e.getAttribute("data-ui-focus-within") !== t && e.setAttribute(Qr, t);
	Ed = n;
}
function zd(e) {
	let t = [];
	for (let n = e.parentElement; n !== null && n !== document.body && !n.hasAttribute("data-ui-region") && (t.push(n), !(n.hasAttribute("data-ui-id") && !Bd(n))); n = n.parentElement);
	return t;
}
function Bd(e) {
	return e.classList.contains("ui-menu--nested") || (e.parentElement?.closest(ul) ?? null) !== null;
}
function z(e) {
	jd(e), Vd(e);
}
function Vd(e) {
	Rd(e), e.focus({ preventScroll: !0 }), Rd(document.activeElement);
}
function Hd(e) {
	Ld(e, !0), Vd(e);
}
function Ud(e) {
	for (let t of e.querySelectorAll(bd)) if (ks(t)) return t;
	return null;
}
var Wd = {
	first: Ud,
	stops: (e) => Gd(e, document.activeElement),
	giveBack: (e) => $d(e),
	trapTab: Jd
};
function Gd(e, t) {
	let n = [...e.querySelectorAll(bd)].filter((e) => e === t || e.tabIndex >= 0 && ks(e)), r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let t = Kd(e);
		if (t === null) continue;
		let n = r.get(t);
		(n === void 0 || !qd(n) && qd(e)) && r.set(t, e);
	}
	return n.filter((e) => {
		let t = Kd(e);
		return t === null || r.get(t) === e;
	});
}
function Kd(e) {
	return e instanceof HTMLInputElement && e.type === "radio" && e.name !== "" ? e.name : null;
}
function qd(e) {
	return e instanceof HTMLInputElement && e.checked;
}
function Jd(e, t) {
	let n = Gd(e, document.activeElement);
	if (n.length === 0) {
		t.preventDefault();
		return;
	}
	let r = Yd(e, n, document.activeElement, t.shiftKey);
	r !== null && (t.preventDefault(), r.focus());
}
function Yd(e, t, n, r) {
	let i = t[0], a = t[t.length - 1];
	return n === null || !e.contains(n) ? r ? a : i : !r && Xd(n, a) ? i : r && Xd(n, i) ? a : null;
}
function Xd(e, t) {
	return e === t || Kd(e) !== null && Kd(e) === Kd(t);
}
var Zd = `.${gi}, .${_i}, [${yi}]`;
function Qd(e) {
	let t = Ou(e)?.root ?? null;
	for (let n = e.parentElement; n !== null; n = n.parentElement) if ((n === t || n.matches(Zd)) && n.hasAttribute("tabindex") && ks(n)) return n;
	return null;
}
function $d(e, t = Qd(e)) {
	let n = document.activeElement;
	if (t?.isConnected !== !0 || n !== null && n !== document.body) return;
	let r = Ou(e);
	r?.root === t && r.row !== null && Lu(t, gu(t), r.row, $u(r.row, e)), z(t);
}
function ef(e, t) {
	if (e.contains(document.activeElement)) return null;
	let n = document.activeElement instanceof HTMLElement ? document.activeElement : null, r = t ?? Ud(e);
	return tf(e), (r === null || r === e) && !e.hasAttribute("tabindex") && (e.tabIndex = -1), z(r ?? e), n;
}
function tf(e) {
	Sd ? Dd.add(e) : Dd.delete(e);
}
function nf(e, t) {
	e.scrollTop = 0, e.scrollLeft = 0;
	let n = t ?? Ud(e);
	return n !== null && rf(e, n), ef(e, n);
}
function rf(e, t) {
	let n = e.getBoundingClientRect().top + e.clientTop, r = n + e.clientHeight, i = t.getBoundingClientRect();
	i.bottom > r && (e.scrollTop += Math.min(i.bottom - r, i.top - n));
}
function af(e, t, n = !1) {
	if (tf(e), Sd) {
		P(t, null), e.hasAttribute("tabindex") || (e.tabIndex = -1), z(e);
		return;
	}
	let r = t.filter(F), i = (n ? r[r.length - 1] : r[0]) ?? null;
	i !== null && (P(t, i), z(i));
}
function of(e, t = null) {
	let n = e == null ? null : e.isConnected ? e : sf(e, t);
	for (let e = n; e !== null; e = e.parentElement) if (e.matches(`${bd}, [tabindex]`) && ks(e)) return e;
	return n === null ? null : cf(n);
}
function sf(e, t) {
	if (t === null) return null;
	for (let n = e.closest(C); n !== null; n = n.parentElement?.closest(C) ?? null) {
		let e = t.findEveryComponent(D(n)).filter((e) => e.isConnected);
		if (e.length === 1 && e[0] instanceof HTMLElement) return e[0];
	}
	return null;
}
function cf(e) {
	for (let t = e.closest(C); t !== null; t = t.parentElement?.closest(C) ?? null) if (ks(t)) return lf(t), t;
	return null;
}
function lf(e) {
	if (e.hasAttribute("tabindex") || e.tabIndex >= 0) return;
	e.tabIndex = -1;
	let t = (n) => {
		n.target === e && (e.removeAttribute("tabindex"), e.removeEventListener("focusout", t));
	};
	e.addEventListener("focusout", t);
}
function uf(e, t) {
	let n = document.activeElement;
	e == null || !t.contains(n) || (df(n, t) && Ld(e, !Nd(e)), z(e));
}
function df(e, t) {
	for (let n = e; n !== null; n = n === t ? null : n.parentElement ?? null) if (Dd.has(n)) return !0;
	return !1;
}
//#endregion
//#region src/updates/value-binding-engine.ts
var ff = "data-ui-clear", pf = ["change", "toggle"], mf = [
	...pf,
	"expand",
	"collapse",
	"open",
	"close"
];
function hf(e) {
	let t = Wi(e);
	return t === "TwoWay" || t === "OneWayToSource" || t === "OnSubmit";
}
function gf(e) {
	return Wi(e) === "OnSubmit";
}
function _f(e, t) {
	let n = e.getAttribute(Ze);
	if (n !== null) {
		let e = t.getBindingById(Number(n));
		return {
			bindingId: n,
			binding: e,
			buffered: e !== void 0 && gf(e.mode)
		};
	}
	for (let n of e.getAttributeNames()) {
		if (!n.startsWith("data-ui-bind-")) continue;
		let r = e.getAttribute(n) ?? "", i = t.getBindingById(Number(r));
		if (i !== void 0 && hf(i.mode)) return {
			bindingId: r,
			binding: i,
			buffered: gf(i.mode)
		};
	}
	return null;
}
var vf = class {
	options;
	root;
	pendingSyncByComponent = /* @__PURE__ */ new WeakMap();
	bufferedElements = /* @__PURE__ */ new Set();
	unanswered = /* @__PURE__ */ new Map();
	sends = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document;
		for (let e of pf) this.root.addEventListener(e, (e) => {
			this.handleValueEventAsync(e).catch((e) => {
				c("value binding engine failed.", e);
			});
		}, !0);
		this.root.addEventListener("input", (e) => this.holdEdited(e), !0), this.root.addEventListener(cl, (e) => this.releaseDropped(e)), this.root.addEventListener("click", (e) => this.handleClear(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && e.target.closest(`[${ff}]`) !== null && e.preventDefault();
		}, !0);
	}
	holdEdited(e) {
		!(e.target instanceof Element) || this.bufferedElements.has(e.target) || !e.target.hasAttribute("data-ui-form-id") || _f(e.target, this.options.metadata)?.buffered === !0 && this.bufferValue(e.target);
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
		let t = e.target.closest(`[${ff}]`);
		if (t === null) return;
		let n = t.closest(C), r = n?.querySelector("[data-ui-bind-value]") ?? n?.querySelector("input, textarea, select");
		r == null || yf(r) || (bc(r), r.dispatchEvent(new Event("input", { bubbles: !0 })), r.dispatchEvent(new Event("change", { bubbles: !0 })), il(r) && document.activeElement !== r && z(r));
	}
	async handleValueEventAsync(e) {
		if (!(e.target instanceof Element) || e.type === "change" && (j(e.target) || k(e.target))) return;
		let t = _f(e.target, this.options.metadata);
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
			let r = _f(n, this.options.metadata);
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
		if (i === void 0 || !hf(i.mode) || gf(i.mode)) return;
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
function yf(e) {
	return e.matches(":disabled") || (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.readOnly;
}
//#endregion
//#region src/events/event-boundary.ts
function bf(e, t) {
	let n = e.closest(`[${$e}]`);
	return n !== null && n !== t && t.contains(n);
}
//#endregion
//#region src/events/command-turns.ts
var xf = class {
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
}, Sf = class {
	catalog;
	registrations = /* @__PURE__ */ new Map();
	attachments = /* @__PURE__ */ new Map();
	constructor(e) {
		this.catalog = e;
	}
	add(e, t = {}) {
		let n = ua(e);
		if (n.length === 0) throw Error("Event name is required.");
		let r = ua(t.domEventName) || this.catalog.get(n)?.domEventName || n, i = {
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
		return this.registrations.get(ua(e));
	}
	isAttached(e) {
		return this.attachments.has(ua(e));
	}
	attach(e) {
		let t = {};
		return this.attachments.set(ua(e), t), t;
	}
	isCurrent(e, t) {
		return this.attachments.get(e) === t;
	}
}, Cf = class {
	create(e, t) {
		return e.createRequest === void 0 ? t.metadata === void 0 ? null : {
			eventId: E(t.metadata.eventId),
			dynamicParameters: [...t.dynamicParameters]
		} : e.createRequest(t);
	}
}, wf = {
	dispatched: !1,
	success: !1
}, Tf = class extends Error {
	reason;
	constructor(e) {
		super(String(e)), this.reason = e;
	}
}, Ef = class {
	options;
	root;
	registry;
	requestFactory = new Cf();
	turns = new xf();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.registry = new Sf(e.eventCatalog), this.addEvent("click");
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
		if (r === null || Of(t, r.element) || bf(t.target, r.element)) return;
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
			let t = e instanceof Tf, r = t ? e.reason : e;
			throw n.completed?.({
				...a,
				dispatched: t,
				success: !1,
				error: String(r)
			}), r;
		}
	}
	async runAsync(e, t, n, r) {
		if (r.domEvent.target instanceof Element && k(r.domEvent.target)) return wf;
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
		if (this.options.dispatcher.isPending(i)) return r.domEvent.preventDefault(), wf;
		let a = this.turns.take();
		try {
			return await this.sendInTurnAsync(e, t, n, r, i, a);
		} finally {
			a.done();
		}
	}
	async sendInTurnAsync(e, t, n, r, i, a) {
		let o = n.getAttribute("data-ui-submit-form-id") ?? (t.submitsForm === !0 ? kf(r) : null);
		if (o !== null) {
			if (this.options.validationEngine?.runSubmitValidation(o) === !1) return r.domEvent.preventDefault(), this.options.validationEngine.focusFirstInvalid(o), wf;
			await this.options.valueBinding?.submitFormAsync(o);
		}
		if (await this.isRefusedValueEventAsync(t, n) || (await a.ahead, await this.options.valueBinding?.whenSent(), this.options.dispatcher.isPending(i))) return wf;
		this.options.interactionEngine.applyEvent({
			name: `before-${e}`,
			componentId: r.componentId,
			dynamicParameters: r.dynamicParameters,
			domEvent: r.domEvent
		});
		let s = this.options.dispatcher.dispatchAsync(i);
		a.done();
		let c = await s.catch((t) => {
			throw this.applyAfterEvent(e, r), new Tf(t);
		});
		return this.options.effects.applyAll(c.command?.effects, this.options.dom), this.options.afterEffects?.(), this.applyAfterEvent(e, r), o !== null && this.options.validationEngine?.focusFirstInvalid(o), {
			dispatched: !0,
			success: c.command?.success !== !1,
			error: c.command?.error ?? null
		};
	}
	async isRefusedValueEventAsync(e, t) {
		return !mf.includes(e.name) && e.settlesValue !== !0 ? !1 : (await this.options.valueBinding?.whenSettled(t), this.options.validationEngine?.isRefused(t) === !0);
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
		return n.hasAttribute(Qe(e)) ? !1 : this.options.metadata.hasServerEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(`before-${e}`, t) || this.options.interactionEngine.hasEventForComponent(`after-${e}`, t);
	}
	applyDomPolicy(e, t) {
		Df(e.preventDefault, t) && t.domEvent.preventDefault(), Df(e.stopPropagation, t) && t.domEvent.stopPropagation();
	}
};
function Df(e, t) {
	return e === void 0 ? !1 : typeof e == "function" ? e(t) : e;
}
function Of(e, t) {
	if (e.type !== "mouseenter" && e.type !== "mouseleave") return !1;
	let n = e.relatedTarget;
	return n instanceof Node && t.contains(n);
}
function kf(e) {
	let t = e.domEvent.target;
	return ((t instanceof Element ? t.closest("[data-ui-form-id]") : null) ?? e.component.querySelector("[data-ui-form-id]"))?.getAttribute("data-ui-form-id") ?? null;
}
//#endregion
//#region src/state/value-equality.ts
function Af(e, t) {
	return Object.is(e, t) ? !0 : e === null || t === null || e === void 0 || t === void 0 ? !1 : e instanceof Date || t instanceof Date ? e instanceof Date && t instanceof Date && e.getTime() === t.getTime() : typeof e != "object" || typeof t != "object" ? !1 : Array.isArray(e) || Array.isArray(t) ? Array.isArray(e) && Array.isArray(t) && jf(e, t) : Mf(e, t);
}
function jf(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!Af(e[n], t[n])) return !1;
	return !0;
}
function Mf(e, t) {
	for (let n in e) if (Object.hasOwn(e, n) && (Object.hasOwn(t, n) ? !Af(e[n], t[n]) : !Nf(e[n]))) return !1;
	for (let n in t) if (Object.hasOwn(t, n) && !Object.hasOwn(e, n) && !Nf(t[n])) return !1;
	return !0;
}
function Nf(e) {
	return e == null;
}
//#endregion
//#region src/interactions/focus-handoff.ts
function Pf() {
	let e = document.activeElement;
	return e === null || e === document.body ? null : e;
}
function Ff(e) {
	let t = document.activeElement;
	if (!e.isConnected || t !== e && t !== document.body) return null;
	if (If(e)) return Lf(e, () => Ff(e)), null;
	let n = e;
	for (; n.parentElement !== null && !If(n.parentElement);) n = n.parentElement;
	let r = Bf(n) ?? Vf(n) ?? Hf();
	return r !== null && z(r), r;
}
function If(e) {
	return e.checkVisibility({ visibilityProperty: !0 });
}
function Lf(e, t) {
	if (typeof document.getAnimations != "function") return;
	let n = document.getAnimations().filter((t) => Rf(t) && zf(t)?.contains(e) === !0);
	n.length > 0 && Promise.all(n.map((e) => e.finished)).then(t, () => void 0);
}
function Rf(e) {
	return e.transitionProperty === "visibility";
}
function zf(e) {
	return e.effect?.target ?? null;
}
function Bf(e) {
	let t = (e.closest(".ui-key-value-action__value-input, .ui-key-value-action__edit-action")?.closest(".ui-key-value-action__row") ?? null)?.querySelector(".ui-key-value-action__action")?.querySelector(bd) ?? null;
	return t !== null && If(t) ? t : null;
}
function Vf(e) {
	let t = Gd(e.closest(Zd) ?? document, null).filter((t) => !e.contains(t)), n = t.find((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0), r = t.filter((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_PRECEDING) !== 0);
	return n ?? r[r.length - 1] ?? null;
}
function Hf() {
	let e = document.querySelector(`[${Mn}="content"]`);
	return e === null ? null : (lf(e), e);
}
//#endregion
//#region src/interactions/interaction-engine.ts
var Uf = class {
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
		for (let e of pf) i.addEventListener(e, (e) => this.applyEditedValue(e), !0);
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
		let n = this.options.valueReaders.readBound(e.target), r = Kf(t.interactions[0].source, t.dynamicParameters);
		if (!(this.heard.has(r) && Af(this.heard.get(r), n))) {
			this.heard.set(r, n);
			for (let e of t.interactions) this.applyInteraction(e, t.dynamicParameters, !0, n);
		}
	}
	resolveEdited(e) {
		let t = this.options.dom.resolveNearestComponent(e, () => !0);
		if (t === null) return null;
		let n = _f(e, this.options.metadata), r;
		if (n === null) r = e.hasAttribute("data-ui-value-end") ? this.index.getEndValueInteractions(t.componentId) : this.index.getValueInteractions(t.componentId);
		else if (n.binding === void 0) return null;
		else r = this.index.getPropertyInteractions(E(n.binding.componentId), n.binding.propertyId);
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
			for (let e of t.interactions) Ki(e.actionKind) === "CopyValue" && qf(e.target) && this.writeTarget(e.target, t.dynamicParameters, Wf(e, n), !0);
		}
		this.moved.clear();
	};
	applyPropertyInteractions(e) {
		if (this.applyDepth > 8) {
			s("interaction chain depth limit exceeded.", {
				componentId: E(e.reference.componentId),
				propertyId: e.reference.propertyId
			});
			return;
		}
		let t = this.index.getPropertyInteractions(E(e.reference.componentId), e.reference.propertyId), n = t.length > 0 ? Kf(e.reference, e.dynamicParameters) : null;
		n !== null && this.heard.has(n) && this.heard.set(n, e.value);
		for (let n of t) this.applyInteraction(n, e.dynamicParameters, !1, e.value);
	}
	applyInteraction(e, t, n, r = !0) {
		let i = Ki(e.actionKind);
		if (i === "Effect") {
			this.applyEffectInteraction(e, t, r);
			return;
		}
		let a = e.target;
		if (!qf(a)) return;
		let o = i === "CopyValue" ? Wf(e, r) : this.evaluator.evaluate(e, r);
		this.writeTarget(a, t, o, n), n && this.options.writeBack?.(a, t, o);
	}
	writeTarget(e, t, n, r) {
		let i = Pf();
		this.applyDepth++;
		try {
			this.propertyPatchEngine.applyPropertyValue(e, t, n, r);
		} finally {
			this.applyDepth--;
		}
		i !== null && Ff(i);
	}
	applyEffectInteraction(e, t, n) {
		let r = e.effect;
		if (r == null) {
			s("effect interaction carries no effect.", e);
			return;
		}
		this.evaluator.matches(e, n) && this.options.effects.apply({
			effect: Gf(r, t, this.options.dom),
			dom: this.options.dom,
			row: t
		});
	}
};
function Wf(e, t) {
	return (t == null || typeof t == "string" && t.trim().length === 0) && e.falseValue !== void 0 ? e.falseValue : t;
}
function Gf(e, t, n) {
	if (t.length === 0) return e;
	let r = e.target;
	if (r === void 0 || (r.dynamicParameters?.length ?? 0) > 0) return e;
	let i = E(r.id);
	for (let a = t.length; a >= 0; a--) {
		let o = t.slice(0, a), s = n.findComponent(i, o);
		if (s !== null && va(s, o)) return a === 0 ? e : {
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
function Kf(e, t) {
	return JSON.stringify([E(e?.componentId), e?.propertyId ?? ""]) + ea(t);
}
function qf(e) {
	return e != null && e.propertyId.length > 0;
}
//#endregion
//#region src/interactions/interaction-evaluator.ts
var Jf = class {
	evaluate(e, t) {
		return this.matches(e, t) ? e.trueValue : e.falseValue;
	}
	matches(e, t) {
		return Yf(t, e.operator, e.value);
	}
};
function Yf(e, t, n) {
	let r = Xf(e), i = Xf(n);
	switch (qi(t)) {
		case "Required": return r != null && r !== !1 && String(r).trim().length > 0;
		case "Equal": return String(r ?? "") === String(i ?? "");
		case "NotEqual": return String(r ?? "") !== String(i ?? "");
		case "Greater": return Zf(r, i, (e) => e > 0);
		case "GreaterOrEqual": return Zf(r, i, (e) => e >= 0);
		case "Less": return Zf(r, i, (e) => e < 0);
		case "LessOrEqual": return Zf(r, i, (e) => e <= 0);
		case "Like": return String(r ?? "").includes(String(i ?? ""));
		case "LikeIgnoreCase": return String(r ?? "").toLocaleLowerCase().includes(String(i ?? "").toLocaleLowerCase());
		case "In": return Array.isArray(i) && i.some((e) => String(e ?? "") === String(r ?? ""));
		case "Regex": return $f(r, i);
		case "RegexEach": return Qf(r, i);
		default: return !1;
	}
}
function Xf(e) {
	return Ro(e) ? e.key : zo(e) ? e.text : e;
}
function Zf(e, t, n) {
	let r = Number(e), i = Number(t);
	return !Number.isNaN(r) && !Number.isNaN(i) ? n(r < i ? -1 : +(r > i)) : !Number.isNaN(r) || !Number.isNaN(i) || typeof e != "string" || typeof t != "string" ? !1 : n(e < t ? -1 : +(e > t));
}
function Qf(e, t) {
	return e == null ? !0 : Array.isArray(e) ? e.every((e) => $f(Xf(e), t)) : $f(e, t);
}
function $f(e, t) {
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
var ep = "Value", tp = "EndValue", np = "Pressed", rp = class {
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
		return this.eventNames.has(ua(e));
	}
	getSourceEventNames() {
		let e = /* @__PURE__ */ new Set();
		for (let t of this.eventNames) op(t) || e.add(t);
		return e;
	}
	hasEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(ua(e))?.has(t) === !0;
	}
	getEventInteractions(e, t) {
		return this.eventInteractions.get(sp(e, t)) ?? [];
	}
	getPropertyInteractions(e, t) {
		return this.propertyInteractions.get(cp(e, t)) ?? [];
	}
	getValueInteractions(e) {
		return this.valueInteractions.get(e) ?? [];
	}
	getEndValueInteractions(e) {
		return this.endValueInteractions.get(e) ?? [];
	}
	addInteraction(e) {
		if (ip(e)) {
			let t = E(e.sourceEvent?.componentId), n = ua(e.sourceEvent?.eventName);
			if (t > 0 && n.length > 0) {
				let r = this.eventInteractions.get(sp(t, n));
				r === void 0 && (r = [], this.eventInteractions.set(sp(t, n), r)), r.push(e), this.eventNames.add(n);
				let i = this.eventComponentIdsByName.get(n);
				i === void 0 && (i = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(n, i)), i.add(t);
			}
			return;
		}
		if (ap(e)) {
			let t = E(e.source?.componentId), n = e.source?.propertyId ?? "";
			if (t > 0 && n.length > 0) {
				let r = this.propertyInteractions.get(cp(t, n));
				r === void 0 && (r = [], this.propertyInteractions.set(cp(t, n), r)), r.push(e), Ki(e.actionKind) === "CopyValue" && (this.copiesValues = !0);
				let i = this.metadata.getPropertyDefinition(n)?.propertyName, a = i === ep || i === np ? this.valueInteractions : i === tp ? this.endValueInteractions : null;
				if (a !== null) {
					let n = a.get(t) ?? [];
					n.push(e), a.set(t, n);
				}
			}
		}
	}
};
function ip(e) {
	return Gi(e.sourceKind) === "Event";
}
function ap(e) {
	return Gi(e.sourceKind) === "Property";
}
function op(e) {
	return e.startsWith("before-") || e.startsWith("after-");
}
function sp(e, t) {
	return `${e}:${ua(t)}`;
}
function cp(e, t) {
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
function lp() {
	return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function up(e) {
	if (typeof e.getAnimations == "function") for (let t of e.getAnimations()) typeof CSSTransition == "function" && t instanceof CSSTransition && t.finish();
}
function dp(e, t, n) {
	let r = !1, i = () => {
		r || (r = !0, clearTimeout(a), n());
	}, a = setTimeout(i, t), o = typeof e.getAnimations == "function" ? e.getAnimations().filter((e) => typeof CSSTransition != "function" || e instanceof CSSTransition) : [];
	Promise.allSettled(o.map((e) => e.finished)).then(i);
}
//#endregion
//#region src/rendering/responsive-tier.ts
var fp = [
	"base",
	"sm",
	"md",
	"xl",
	"xxl"
], pp = {
	sm: 640,
	md: 768,
	xl: 1280,
	xxl: 1536
};
function mp(e) {
	return `(min-width: ${pp[e]}px)`;
}
var hp = mp("sm");
function gp(e = (e) => matchMedia(e).matches) {
	for (let t of [
		"xxl",
		"xl",
		"md",
		"sm"
	]) if (e(mp(t))) return t;
	return "base";
}
function _p(e, t) {
	return t === "base" ? e : `${e}-${t}`;
}
function vp(e, t) {
	if (e == null) return;
	let n = typeof e == "object" ? e : void 0;
	return n === void 0 || !("base" in n) ? t === "base" ? e : void 0 : n[t];
}
function yp(e, t) {
	return bp(t, (t) => vp(e, t));
}
function bp(e, t) {
	for (let n = fp.indexOf(e); n >= 0; n--) {
		let e = t(fp[n]);
		if (e != null) return e;
	}
}
//#endregion
//#region src/interactions/anchored-popup.ts
var xp = /* @__PURE__ */ new Set([
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
function Sp(e) {
	return xp.has(e);
}
var Cp = 4, wp = 12, Tp = /* @__PURE__ */ new Map(), Ep = !1, Dp = null, Op = /* @__PURE__ */ new WeakMap(), kp = "data-ui-popup-stood-in";
function Ap(e, t) {
	t === null ? Op.delete(e) : Op.set(e, t);
}
var jp = "--ui-popup-ground";
function Mp(e, t) {
	let n = e.closest("[data-ui-theme]") === t.closest("[data-ui-theme]") ? getComputedStyle(e).getPropertyValue(jp).trim() : "";
	n.length === 0 ? t.style.removeProperty(jp) : t.style.setProperty(jp, n);
}
function Np(e, t, n) {
	Tp.set(t, {
		anchor: e,
		options: n
	}), Kp(), Dp?.observe(t), zp(e, t), Jp(e, t, n);
}
var Pp = "data-ui-popup-lifted", Fp = "data-ui-sheet";
function Ip() {
	return typeof matchMedia == "function" && !matchMedia(hp).matches;
}
function Lp(e) {
	return e.hasAttribute(Fp);
}
function Rp(e) {
	if (e.hasAttribute(Pp)) {
		e.matches(":popover-open") || e.showPopover();
		return;
	}
	e.setAttribute("popover", "manual"), e.setAttribute(Pp, ""), Bp(e);
}
function zp(e, t) {
	(t.hasAttribute(Pp) || Vp(t) || e.closest(`[${Pp}]`) !== null) && Rp(t);
}
function Bp(e) {
	let t = getComputedStyle(e), n = t.transitionProperty.split(",").map((e) => e.trim()), r = n.indexOf("overlay");
	if (r === -1) {
		e.showPopover();
		return;
	}
	let i = t.transitionDuration.split(",").map((e) => e.trim());
	e.style.setProperty("transition-duration", n.map((e, t) => t === r ? "0s" : i[t % i.length]).join(", ")), e.showPopover(), getComputedStyle(e).getPropertyValue("overlay"), e.style.removeProperty("transition-duration");
}
function Vp(e) {
	for (let t = e.parentElement; t !== null; t = t.parentElement) {
		let e = getComputedStyle(t);
		if (e.transform !== "none" || e.filter !== "none" || e.perspective !== "none" || t.hasAttribute("data-ui-surface-image-blur") && e.isolation === "isolate") return !0;
	}
	return !1;
}
var Hp = B.normal * 5;
function Up(e, t) {
	e.hasAttribute(Pp) && (e.matches(":popover-open") && e.hidePopover(), dp(e, Hp, () => {
		e.matches(":popover-open") || Tp.has(e) || (e.removeAttribute("popover"), e.removeAttribute(Pp), t?.());
	}));
}
function Wp(e) {
	let t = Tp.get(e);
	t !== void 0 && Jp(t.anchor, e, t.options);
}
function Gp(e) {
	e != null && (Tp.delete(e), Dp?.unobserve(e), Up(e));
}
function Kp() {
	Ep || (Ep = !0, document.addEventListener("scroll", (e) => qp(e.target), !0), window.addEventListener("resize", () => qp(null)), window.visualViewport?.addEventListener("resize", () => qp(null)), window.visualViewport?.addEventListener("scroll", () => qp(null)), Dp = new ResizeObserver((e) => {
		for (let t of e) {
			if (!(t.target instanceof HTMLElement)) continue;
			let e = Tp.get(t.target);
			e !== void 0 && Jp(e.anchor, t.target, e.options, !0);
		}
	}));
}
function qp(e) {
	for (let [t, n] of Tp) {
		if (!t.isConnected) {
			Gp(t);
			continue;
		}
		e instanceof Node && t.contains(e) || Jp(n.anchor, t, n.options);
	}
}
function Jp(e, t, n, r = !1) {
	if (!e.isConnected) return;
	let i = Qp(e), a = i !== e;
	t.hasAttribute(kp) !== a && t.toggleAttribute(kp, a), n.minAnchorWidth === !0 && (t.style.minWidth = `${i.getBoundingClientRect().width}px`);
	let o = t.hasAttribute(Yp) ? {
		top: t.scrollTop,
		left: t.scrollLeft
	} : null;
	Zp(t);
	let s = i.getBoundingClientRect(), c = (i === e ? n.crossAnchor ?? i : i).getBoundingClientRect(), l = i === e && n.surface !== void 0 ? n.surface.getBoundingClientRect() : s, u = n.gap ?? 4, d = t.getBoundingClientRect(), f = tm(n.boundary), p = Tp.get(t), m = r ? p?.side : void 0, h = m !== void 0 && rm(l, d, m, u, f) ? m : nm(l, d, n.placement, u, f);
	p !== void 0 && (p.side = h), rm(l, d, h, u, f) || (Xp(t, h, sm(l, h, f) - u - Cp), d = t.getBoundingClientRect(), o !== null && (t.scrollTop = o.top, t.scrollLeft = o.left));
	let g = n.alignEntries === !0 ? dm(t, h) : um, _ = pm(l, c, d, h, u, g), v = mm(l, c, d, h, u, g);
	n.arrow === !0 && (om(h) ? v = $p(v, c.left + c.width / 2, d.width) : _ = $p(_, c.top + c.height / 2, d.height));
	let ee = gm();
	_ = ee.top + bm(_ - ee.top, d.height, ee.bottom - ee.top), v = bm(v, d.width, window.innerWidth), t.style.top = `${_}px`, t.style.left = `${v}px`, t.dataset.uiPlacement !== h && (t.dataset.uiPlacement = h), em(t, c, d, h, _, v);
}
var Yp = "data-ui-popup-capped";
function Xp(e, t, n) {
	let r = om(t);
	e.setAttribute(Yp, ""), e.style.setProperty(r ? "max-height" : "max-width", `${Math.max(0, n)}px`), e.style.setProperty(r ? "overflow-y" : "overflow-x", "auto");
}
function Zp(e) {
	if (e.hasAttribute(Yp)) {
		e.removeAttribute(Yp);
		for (let t of [
			"max-height",
			"max-width",
			"overflow-y",
			"overflow-x"
		]) e.style.removeProperty(t);
	}
}
function Qp(e) {
	for (let t = e; t !== null; t = t.parentElement) {
		if (t.hasAttribute(kp)) return e;
		let n = Op.get(t);
		if (n !== void 0) return n;
	}
	return e;
}
function $p(e, t, n) {
	let r = t - e;
	return r < wp ? e - (wp - r) : r > n - wp ? e + (r - (n - wp)) : e;
}
function em(e, t, n, r, i, a) {
	let o = om(r), s = o ? t.left + t.width / 2 - a : t.top + t.height / 2 - i, c = o ? n.width : n.height;
	e.style.setProperty("--ui-popup-arrow", `${Math.max(wp, Math.min(s, c - wp))}px`);
}
function tm(e) {
	let t = gm(), n = {
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
function nm(e, t, n, r, i) {
	let a = cm(n);
	if (rm(e, t, n, r, i)) return n;
	if (rm(e, t, a, r, i)) return a;
	for (let a of im(n)) if (rm(e, t, a, r, i)) return a;
	return sm(e, a, i) > sm(e, n, i) ? a : n;
}
function rm(e, t, n, r, i) {
	return sm(e, n, i) >= am(t, n) + r;
}
function im(e) {
	return e.startsWith("bottom") ? ["right-start", "left-start"] : e.startsWith("top") ? ["right-end", "left-end"] : e.startsWith("right") ? ["bottom-start", "top-start"] : ["bottom-end", "top-end"];
}
function am(e, t) {
	return om(t) ? e.height : e.width;
}
function om(e) {
	return e.startsWith("top") || e.startsWith("bottom");
}
function sm(e, t, n) {
	return t.startsWith("top") ? e.top - n.top : t.startsWith("bottom") ? n.bottom - e.bottom : t.startsWith("left") ? e.left - n.left : n.right - e.right;
}
function cm(e) {
	return e.startsWith("top") ? `bottom${lm(e)}` : e.startsWith("bottom") ? `top${lm(e)}` : e.startsWith("left") ? `right${lm(e)}` : `left${lm(e)}`;
}
function lm(e) {
	let t = e.indexOf("-");
	return t === -1 ? "" : e.slice(t);
}
var um = {
	start: 0,
	end: 0
};
function dm(e, t) {
	let n = getComputedStyle(e);
	return om(t) ? {
		start: fm(n.paddingLeft) + fm(n.borderLeftWidth),
		end: fm(n.paddingRight) + fm(n.borderRightWidth)
	} : {
		start: fm(n.paddingTop) + fm(n.borderTopWidth),
		end: fm(n.paddingBottom) + fm(n.borderBottomWidth)
	};
}
function fm(e) {
	let t = Number.parseFloat(e ?? "");
	return Number.isFinite(t) ? t : 0;
}
function pm(e, t, n, r, i, a) {
	return r.startsWith("top") ? e.top - i - n.height : r.startsWith("bottom") ? e.bottom + i : hm(t.top, t.height, n.height, r, a);
}
function mm(e, t, n, r, i, a) {
	return r.startsWith("left") ? e.left - i - n.width : r.startsWith("right") ? e.right + i : hm(t.left, t.width, n.width, r, a);
}
function hm(e, t, n, r, i) {
	let a = lm(r);
	return a === "-start" ? e - i.start : a === "-end" ? e + t - n + i.end : e + (t - n) / 2;
}
function gm() {
	let e = window.visualViewport, t = e == null || Math.abs(e.scale - 1) > .01, n = t ? 0 : Math.max(0, e.offsetTop), r = t ? window.innerHeight : Math.min(window.innerHeight, e.offsetTop + e.height);
	return {
		top: n,
		bottom: Math.min(r, _m(r))
	};
}
function _m(e) {
	let t = document.querySelector(`[${kn}]`);
	if (t === null) return e;
	let n = t.getBoundingClientRect();
	return n.height > 0 && n.width >= window.innerWidth - 1 && n.top > 0 ? n.top : e;
}
function vm(e, t, n) {
	if (Lp(e)) return;
	let r = e.getBoundingClientRect(), i = gm();
	e.style.left = `${ym(t, r.width, 0, window.innerWidth)}px`, e.style.top = `${ym(n, r.height, i.top, i.bottom)}px`;
}
function ym(e, t, n, r) {
	return e + t <= r - Cp ? e : e - t >= n + Cp ? e - t : n + bm(e - n, t, r - n);
}
function bm(e, t, n) {
	return Math.max(Cp, Math.min(e, n - t - Cp));
}
//#endregion
//#region src/interactions/press-wave.ts
var xm = "ui-press-wave", Sm = "ui-press-wave__ink";
function Cm(e) {
	if (e.type !== "childList" || e.addedNodes.length + e.removedNodes.length === 0) return !1;
	for (let t of e.addedNodes) if (!wm(t)) return !1;
	for (let t of e.removedNodes) if (!wm(t)) return !1;
	return !0;
}
function wm(e) {
	return e instanceof Element && e.classList.contains("ui-press-wave");
}
function Tm(e) {
	return e.length > 0 && e.every(Cm);
}
function Em(e) {
	for (let t of e.querySelectorAll(`.${xm}`)) t.remove();
}
//#endregion
//#region src/interactions/dom-mutations.ts
var Dm = 32;
function V(e, t, n, r) {
	if (!(e instanceof Node)) return null;
	let i = new MutationObserver((i) => {
		let a = Om(e, i.filter((e) => !Cm(e) && (n.relevant?.(e) ?? !0)), t);
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
function Om(e, t, n) {
	let r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set();
	for (let a of t) {
		let t = a.target instanceof Element ? a.target : a.target.parentElement;
		if (t === null || i.has(t)) continue;
		i.add(t);
		let o = t.closest(n);
		if (o !== null) {
			r.add(o);
			continue;
		}
		for (let e of t.querySelectorAll(n)) r.add(e);
		if (r.size > Dm) return new Set(e.querySelectorAll(n));
	}
	return r.size === 0 ? null : r;
}
function km(e, t, n) {
	return (e.target instanceof Element ? e.target : e.target.parentElement)?.closest(`${t}, ${n}`)?.matches(t) === !0;
}
//#endregion
//#region src/interactions/open-dialogs.ts
var Am = "data-ui-dialog", jm = "data-ui-dialog-modal", Mm = "data-ui-dialog-backdrop", Nm = "data-ui-dialog-close-backdrop", Pm = "data-ui-dialog-close-escape", Fm = `[${Am}]:not([hidden]), dialog[open]`, Im = "dialog:modal";
function Lm(e) {
	let t = e.querySelectorAll(`[${Am}]:not([hidden])`);
	return t.length === 0 ? null : t[t.length - 1];
}
function Rm(e) {
	let t = e.querySelectorAll(Im);
	if (t.length > 0) return t[t.length - 1];
	let n = Lm(e);
	return n !== null && n.hasAttribute("data-ui-dialog-modal") ? n : null;
}
function zm(e) {
	let t = typeof document > "u" ? null : Rm(document);
	return t !== null && !t.contains(e);
}
//#endregion
//#region src/interactions/popup-dismissal.ts
var Bm = /* @__PURE__ */ new Set(), Vm = null;
function Hm(e) {
	Vm = e;
}
function Um(e) {
	let t = e.composedPath(), n = Vm?.(t) ?? null;
	if (n === null) return t;
	let r = [...t];
	for (let e = n; e !== null; e = e.parentElement) r.push(e);
	return r;
}
var Wm = /* @__PURE__ */ new Map(), Gm = 0, Km = !1;
function qm() {
	Km || (Km = !0, document.addEventListener("keydown", (e) => {
		!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || M(e) || Xm(Xc(e.target)) && e.preventDefault();
	}, !0));
}
function Jm() {
	for (let e of Bm) for (let t of e.openPopups()) if (t.isConnected && !e.isBehind(t)) return !0;
	return !1;
}
function Ym(e) {
	for (let t of Bm) t.hearRefusedClick(e);
}
function Xm(e) {
	let t = [];
	for (let e of Bm) for (let n of e.openPopups()) n.isConnected && t.push({
		instance: e,
		popup: n
	});
	let n = new Set(t.map((e) => e.popup));
	for (let e of [...Wm.keys()]) n.has(e) || Wm.delete(e);
	for (let { popup: e } of t) Wm.has(e) || Wm.set(e, ++Gm);
	let r = Zm(t, (e) => Wm.get(e.popup) ?? 0, (e, t) => e.popup.contains(t.popup));
	for (let { instance: t, popup: n } of r) if ((e === null || e.contains(n)) && t.dismiss(n, "escape")) return !0;
	return !1;
}
function Zm(e, t, n) {
	let r = [...e].sort((e, n) => t(n) - t(e)), i = [];
	for (; r.length > 0;) {
		let e = r.findIndex((e) => !r.some((t) => t !== e && n(e, t)));
		i.push(...r.splice(e, 1));
	}
	return i;
}
var Qm = class {
	options;
	pressedInside = /* @__PURE__ */ new Set();
	constructor(e) {
		this.options = e, document.addEventListener("pointerdown", (e) => this.handlePress(e), !0), document.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), e.onPress !== !0 && document.addEventListener("click", (e) => this.handleClick(e), !0), e.onWindowBlur === !0 && window.addEventListener("blur", () => this.dismissAll("blur")), Bm.add(this), qm();
	}
	openPopups() {
		return [...this.options.openPopups()];
	}
	handlePress(e) {
		let t = Um(e), n = this.options.onPress === !0 || e instanceof MouseEvent && e.button !== 0;
		this.pressedInside.clear();
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) ? this.pressedInside.add(e) : n && this.dismiss(e, "outside");
	}
	handleContextMenu(e) {
		let t = Um(e);
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) || this.dismiss(e, "outside");
	}
	hearRefusedClick(e) {
		this.options.onPress !== !0 && this.handleClick(e);
	}
	handleClick(e) {
		let t = Um(e);
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) || this.pressedInside.has(e) || this.dismiss(e, "outside");
		this.pressedInside.clear();
	}
	dismissAll(e) {
		let t = !1;
		for (let n of [...this.options.openPopups()]) t = this.dismiss(n, e) || t;
		return t;
	}
	isBehind(e) {
		return this.options.isBehind === void 0 ? zm(e) : this.options.isBehind(e);
	}
	dismiss(e, t) {
		return this.isBehind(e) || this.options.canDismiss?.(e, t) === !1 ? !1 : (this.options.close(e, t), !0);
	}
	isInside(e, t) {
		return this.options.isInside === void 0 ? t.includes(e) : this.options.isInside(e, t);
	}
}, $m = /\p{M}/gu, eh = ".ui-text__title";
function th(e, t) {
	return nh(e, t).split(/\s+/).filter((e) => e.length !== 0);
}
function nh(e, t) {
	return ah(e, ih(t));
}
function rh(e, t) {
	return t.every((t) => e.includes(t));
}
function ih(e) {
	return e.closest("[lang]")?.getAttribute("lang") || void 0;
}
function ah(e, t) {
	let n = e.normalize("NFD").replace($m, "");
	try {
		return n.toLocaleLowerCase(t);
	} catch {
		return n.toLowerCase();
	}
}
function oh(e) {
	return e.querySelector(eh)?.textContent ?? e.textContent ?? "";
}
//#endregion
//#region src/interactions/pointer-drag.ts
var sh = class {
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
		t.setAttribute(Kr, ""), t.tabIndex >= 0 && t.focus({ preventScroll: !0 });
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
			e.pointerId === t.pointerId ? t.point = n : t.second.point = n, this.options.pinch?.(t.context, ch(r, i, t.point, t.second.point));
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
		this.drag = null, n.removeAttribute(Kr), e.type === "pointercancel" && this.options.takenBack !== void 0 ? this.options.takenBack(n, r) : this.options.end(n, r);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || M(e) || this.drag === null) return;
		e.preventDefault();
		let { handle: t, context: n, pointerId: r, originPoint: i, second: a } = this.drag;
		this.drag = null, t.removeAttribute(Kr);
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
function ch(e, t, n, r) {
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
function lh() {
	let e = (e) => {
		e.preventDefault(), e.stopImmediatePropagation(), t();
	}, t = () => {
		window.removeEventListener("click", e, !0), window.removeEventListener("pointerdown", t, !0), window.removeEventListener("keydown", t, !0);
	};
	window.addEventListener("click", e, !0), window.addEventListener("pointerdown", t, !0), window.addEventListener("keydown", t, !0);
}
function uh(e, t) {
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
		lh();
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
var dh = "data-ui-sheet-dragging", fh = "--ui-sheet-drag", ph = 24, mh = 1 / 3;
function hh(e, t, n) {
	return e > t * mh || n > .5 && e > 6;
}
function gh(e, t, n) {
	e.style.removeProperty(fh), e.removeAttribute(dh);
	let r = uh(e, {
		axis: "y",
		oneWay: !0,
		holdsTouch: !0,
		begins: (n) => t.scrollTop <= 0 && (n.pointerType === "touch" || n.clientY - e.getBoundingClientRect().top <= ph),
		start: (t) => {
			e.setAttribute(dh, ""), _h(e, t.pointerId);
		},
		follow: (t) => e.style.setProperty(fh, `${t}px`),
		end: (t, r, i) => {
			e.removeAttribute(dh), i && hh(t, e.getBoundingClientRect().height, r) ? n() : e.style.setProperty(fh, "0px");
		}
	});
	return () => {
		r(), e.removeAttribute(dh);
	};
}
function _h(e, t) {
	try {
		e.setPointerCapture(t);
	} catch {}
}
//#endregion
//#region src/rendering/url-safety.ts
var vh = [
	"http",
	"https",
	"mailto",
	"tel"
];
function yh(e) {
	let t = String(e ?? "");
	if (t.trim().length === 0) return !1;
	for (let e of t) {
		let t = e.codePointAt(0) ?? 0;
		if (t <= 32 || t >= 127 && t <= 159) return !1;
	}
	if ("/#?.".includes(t[0])) return !0;
	let n = t.indexOf(":");
	return n < 0 || vh.includes(t.slice(0, n).toLowerCase());
}
function bh(e) {
	return yh(e) ? String(e) : void 0;
}
var xh = [
	"http:",
	"https:",
	"mailto:",
	"tel:"
];
function Sh(e) {
	let t = Eh(e), n = t.toLowerCase();
	return /^[\\/]{2}/.test(t) || xh.some((e) => n.startsWith(e));
}
function Ch(e) {
	return typeof e != "string" || /[\x00-\x1f\x7f-\x9f]/.test(e) ? !1 : e === "/" || wh(e);
}
function wh(e) {
	return e.length > 1 && e[0] === "/" && e[1] !== "/" && e[1] !== "\\";
}
function Th(e) {
	return e.length > 0 && e[0] !== "/" && e[0] !== "\\" && !/^[A-Za-z][A-Za-z\d+.-]*:/.test(e);
}
function Eh(e) {
	let t = 0, n = e.length;
	for (; t < n && e.charCodeAt(t) <= 32;) t++;
	for (; n > t && e.charCodeAt(n - 1) <= 32;) n--;
	return e.slice(t, n).replace(/[\t\n\r]/g, "");
}
function Dh(e) {
	return Oh(e) !== null;
}
function Oh(e) {
	let t = Eh(e), n = t.toLowerCase();
	return wh(t) || Th(t) || n.startsWith("https://") || n.startsWith("http://") || n.startsWith("data:image/") ? t : null;
}
function kh(e) {
	return Oh(String(e ?? "").trim()) ?? void 0;
}
//#endregion
//#region src/rendering/icon-value.ts
var Ah = "mask:", jh = "ui-icon--image", Mh = "ui-icon--mask";
function Nh(e) {
	let t = String(e ?? "").trim(), n = !1;
	t.startsWith(Ah) && (n = !0, t = t.slice(5).trim());
	let r = t.includes("/") ? Oh(t) : null;
	return r === null ? null : {
		source: r,
		tinted: n
	};
}
function Ph(e) {
	let t = Nh(e);
	return t === null ? "" : Fh(t.source);
}
function Fh(e) {
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
var Ih = "ui-icon", Lh = "data-ui-icon", Rh = "--ui-icon-url";
function zh(e, t) {
	e.classList.add(Ih);
	for (let t of Array.from(e.classList)) Vh(t) && e.classList.remove(t);
	(e instanceof HTMLElement || e instanceof SVGElement) && e.style.removeProperty(Rh);
	let n = Hh(t);
	if (n.length === 0) {
		e.removeAttribute(Lh);
		return;
	}
	e.setAttribute(Lh, ""), e.classList.add(n);
	let r = Nh(t);
	r !== null && (e instanceof HTMLElement || e instanceof SVGElement) && e.style.setProperty(Rh, Fh(r.source));
}
var Bh = "ui-icon-glyph--";
function Vh(e) {
	return e === jh || e === Mh || e.startsWith(Bh);
}
function Hh(e) {
	let t = Nh(e);
	return t === null ? Uh(e) : t.tinted ? Mh : jh;
}
function Uh(e) {
	let t = String(e ?? "").trim();
	if (t.length === 0) return "";
	let n = Bh;
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
//#region src/interactions/popup-sheet.ts
var Wh = "data-ui-sheet-covered", Gh = "ui-sheet-scrim", Kh = "data-ui-sheet-scrim-leaving", qh = 400, Jh = "ui-sheet__back", Yh = "ui.sheet.back", Xh = "ne-arrow-back", Zh = [], Qh = null, $h = !1, eg = !1;
function tg(e, t) {
	if (ng(e) !== null) return;
	let n = t.anchor?.closest("[data-ui-sheet]") ?? null, r = n === null ? null : ng(n);
	e.style.removeProperty("top"), e.style.removeProperty("left"), e.style.removeProperty("min-width");
	let i = Lp(e);
	e.setAttribute(Fp, r === null ? "root" : "nested"), i || (e.setAttribute("popover", "manual"), up(e));
	let a = null;
	e.querySelector(`:scope > .${Jh}`)?.remove(), r !== null && (e.style.minHeight = `${r.popup.getBoundingClientRect().height}px`, r.popup.setAttribute(Wh, ""), a = rg(t), e.prepend(a)), ag(), Rp(e);
	let o = {
		popup: e,
		parent: r,
		opening: t,
		back: a,
		hidden: [],
		detachSwipe: gh(e, e, () => og(e))
	};
	Zh.push(o), sg(), queueMicrotask(() => lg(o));
}
function ng(e) {
	return Zh.find((t) => t.popup === e) ?? null;
}
function rg(e) {
	let t = document.createElement("button"), n = e.anchor === void 0 ? "" : oh(e.anchor).trim();
	return t.type = "button", t.className = Jh, t.tabIndex = -1, t.textContent = n, t.prepend(ig()), O.write(t, "aria-label", Yh, { entry: n }), t.addEventListener("click", (t) => {
		t.stopPropagation(), e.close();
	}), t;
}
function ig() {
	let e = document.createElement("span");
	return e.className = "ui-sheet__back-mark", e.setAttribute("aria-hidden", "true"), zh(e, Xh), e;
}
function ag() {
	Qh === null && (Qh = document.createElement("div"), Qh.className = Gh, Qh.setAttribute("aria-hidden", "true"), Qh.addEventListener("mousedown", (e) => e.preventDefault())), Qh.parentElement === null && document.body.appendChild(Qh), Qh.removeAttribute(Kh), Rp(Qh);
}
function og(e) {
	for (let t = ng(e); t !== null; t = t.parent) t.opening.close();
}
function sg() {
	$h || ($h = !0, window.addEventListener("pointerdown", () => {
		eg = !0;
	}, !0), window.addEventListener("pointerup", cg, !0), window.addEventListener("pointercancel", cg, !0), window.addEventListener("keydown", (e) => {
		let t = Zh.at(-1);
		e.key === "Tab" && !e.defaultPrevented && t !== void 0 && t.opening.trapsTab && e.target instanceof Node && t.popup.contains(e.target) && Jd(t.popup, e);
	}, !0), matchMedia(hp).addEventListener("change", () => {
		for (let e of Zh.filter((e) => e.parent === null)) e.opening.close();
	}));
}
function cg() {
	if (eg = !1, Qh?.hasAttribute(Kh) !== !0) return;
	let e = () => {
		Qh?.hasAttribute(Kh) === !0 && Zh.length === 0 && (Qh.removeAttribute(Kh), Qh.hidePopover());
	};
	window.addEventListener("click", () => window.setTimeout(e), { once: !0 }), window.setTimeout(e, qh);
}
function lg(e) {
	if (!Zh.includes(e)) return;
	let { popup: t } = e;
	t.contains(document.activeElement) || (t.hasAttribute("tabindex") || (t.tabIndex = -1), z(t)), e.hidden = ug(t);
}
function ug(e) {
	let t = [];
	for (let n = e; n.parentElement !== null && n !== document.body; n = n.parentElement) for (let e of n.parentElement.children) e === n || e === Qh || !(e instanceof HTMLElement) || e.getAttribute("aria-hidden") === "true" || (e.setAttribute("aria-hidden", "true"), t.push(e));
	return t;
}
function dg(e) {
	let t = ng(e);
	if (t !== null) {
		for (let e of [...Zh].reverse()) if (e === t || fg(e, t)) {
			for (let t of e.hidden) t.removeAttribute("aria-hidden");
			e.hidden = [];
		}
	}
}
function fg(e, t) {
	for (let n = e.parent; n !== null; n = n.parent) if (n === t) return !0;
	return !1;
}
function pg(e) {
	let t = ng(e);
	if (t !== null) {
		for (let e of Zh.filter((e) => e.parent === t)) e.opening.close(), pg(e.popup);
		dg(e), Zh.splice(Zh.indexOf(t), 1), t.detachSwipe(), t.parent?.popup.removeAttribute(Wh), Zh.length === 0 && mg(), Up(e, () => {
			ng(e) === null && (e.removeAttribute(Fp), e.removeAttribute(Wh), e.style.removeProperty("min-height"), e.style.removeProperty("--ui-sheet-drag"), t.back?.remove());
		});
	}
}
function mg() {
	Qh?.matches(":popover-open") === !0 && (eg ? Qh.setAttribute(Kh, "") : Qh.hidePopover());
}
//#endregion
//#region src/interactions/owned-popup.ts
function hg(e, t) {
	return e.isConnected && !k(e) && !(t && j(e));
}
var gg = class {
	options;
	entries = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, new Qm({
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
			isBehind: (e) => zm(this.entryOf(e)?.opening.owner ?? e),
			onPress: e.onPress,
			onWindowBlur: e.onWindowBlur
		}), (e.closesOnFocusLeave ?? !0) && document.addEventListener("focusout", (e) => this.handleFocusLeave(e), !0), e.closesOnTab !== void 0 && e.closesOnTab !== !1 && vg(this);
	}
	listsAround(e) {
		return [...this.entries.values()].filter(({ opening: t }) => t.popup.contains(e) && wg(this.options.closesOnTab, t)).map(({ opening: e }) => ({
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
		if (!(e.target instanceof Node) || Fd() || t instanceof Element && t.hasAttribute("data-ui-pointer-focus")) return;
		if (t instanceof Element) {
			this.leaveFocus(e.target, t);
			return;
		}
		let n = e.target;
		bg(n) && queueMicrotask(() => this.letGo(n));
	}
	leaveFocus(e, t) {
		for (let { opening: n } of [...this.entries.values()]) (n.popup.contains(e) || n.owner.contains(e)) && !this.isInside(n, Cg(t)) && !zm(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
	}
	letGo(e) {
		if (!bg(e)) return;
		let t = Qd(e);
		for (let { opening: n } of [...this.entries.values()]) {
			let r = n.popup.contains(e) || n.owner.contains(e), i = t !== null && n.popup.contains(t) || n.popup.contains(document.activeElement);
			r && !i && hg(n.owner, this.closesWhenReadOnly) && !zm(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
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
		if (this.close(e.owner), !hg(e.owner, this.closesWhenReadOnly)) return !1;
		(this.options.single ?? !0) && this.closeAll();
		let t = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		return this.entries.set(e.owner, {
			opening: e,
			returnFocus: t
		}), this.options.show(e), this.place(e), Tg(e, !0), Fg(this), Ag(e), e.focus !== void 0 && e.focus !== !1 && ef(e.popup, e.focus === !0 ? null : e.focus), !0;
	}
	get closesWhenReadOnly() {
		return this.options.closesWhenReadOnly ?? !0;
	}
	closeAll() {
		for (let e of [...this.entries.keys()]) this.close(e);
	}
	place(e) {
		if (Lp(e.popup) || wg(this.options.sheetOnPhone, e) && Ip()) {
			tg(e.popup, {
				anchor: e.anchor,
				close: () => this.close(e.owner, "escape"),
				trapsTab: !wg(this.options.closesOnTab, e)
			});
			return;
		}
		e.anchor !== void 0 && e.placement !== void 0 && Np(e.anchor, e.popup, e.placement);
	}
	reposition(e) {
		let t = this.entries.get(e);
		t !== void 0 && this.place(t.opening);
	}
	close(e = this.current, t) {
		let n = e === null ? void 0 : this.entries.get(e);
		if (e === null || n === void 0) return;
		let { opening: r } = n;
		this.entries.delete(e), jg(r.popup), dg(r.popup), r.popup.contains(document.activeElement) && uf(r.returnFocus === void 0 ? n.returnFocus : r.returnFocus(), r.popup), this.options.hide(r, t), Tg(r, !1), Lp(r.popup) ? pg(r.popup) : Gp(r.popup), this.entries.size === 0 && Ig(this);
	}
	closeStranded() {
		for (let [e, { opening: t }] of [...this.entries]) {
			if (hg(e, this.closesWhenReadOnly)) continue;
			let n = document.activeElement, r = n === null || n === document.body || t.popup.contains(n) || e.contains(n);
			this.close(e, "owner"), r && e.isConnected && !xg() && Sg(e);
		}
	}
}, _g = /* @__PURE__ */ new Set();
function vg(e) {
	_g.size === 0 && window.addEventListener("keydown", (e) => {
		e instanceof KeyboardEvent && e.key === "Tab" && !e.defaultPrevented && !M(e) && e.target instanceof Node && yg(e.target);
	}, !0), _g.add(e);
}
function yg(e) {
	let t = [..._g].flatMap((t) => t.listsAround(e).map((e) => ({
		popups: t,
		...e
	})));
	for (let { popups: e, owner: n } of Zm(t, () => 0, (e, t) => e.popup.contains(t.popup))) e.close(n, "focus");
}
function bg(e) {
	return e instanceof Element && e.isConnected && ks(e) && typeof document.hasFocus == "function" && document.hasFocus();
}
function xg() {
	let e = document.activeElement;
	return e instanceof Element && e !== document.body && ks(e);
}
function Sg(e) {
	lf(e), z(e);
}
function Cg(e) {
	let t = [];
	for (let n = e; n !== null; n = n.parentNode) t.push(n);
	return t;
}
function wg(e, t) {
	return e === !0 || typeof e == "function" && e(t);
}
function Tg(e, t) {
	for (let n of e.openers ?? []) n.setAttribute("aria-expanded", t ? "true" : "false");
}
var Eg = /* @__PURE__ */ new Map(), Dg = /* @__PURE__ */ new Set(), Og = /* @__PURE__ */ new WeakSet(), kg = [];
function Ag(e) {
	let { popup: t } = e;
	Eg.set(t, e.owner), !Og.has(t) && (Og.add(t), t.addEventListener("pointerenter", () => {
		Eg.has(t) && (Dg.add(t), Mg());
	}), t.addEventListener("pointerleave", () => {
		Dg.delete(t) && Mg();
	}));
}
function jg(e) {
	Eg.delete(e), Dg.delete(e) && Mg();
}
function Mg() {
	let e = /* @__PURE__ */ new Set();
	for (let t of Dg) {
		let n = Eg.get(t);
		if (!(n === void 0 || !n.contains(t))) for (let r = t.parentElement; r !== null && (e.add(r), r !== n); r = r.parentElement);
	}
	for (let t of kg) e.has(t) || t.removeAttribute($r);
	for (let t of e) t.hasAttribute("data-ui-popup-hover") || t.setAttribute($r, "");
	kg = [...e];
}
var Ng = /* @__PURE__ */ new Set(), Pg = null;
function Fg(e) {
	Ng.add(e), Pg === null && typeof MutationObserver == "function" && (Pg = new MutationObserver(() => {
		for (let e of [...Ng]) e.closeStranded();
	}), Pg.observe(document, {
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
function Ig(e) {
	Ng.delete(e), !(Ng.size > 0 || Pg === null) && (Pg.disconnect(), Pg = null);
}
//#endregion
//#region src/interactions/flyout-interaction-engine.ts
var Lg = "ui-flyout", Rg = "ui-flyout--open", zg = "ui-flyout__anchor", Bg = "data-ui-flyout-no-backdrop-close", Vg = "data-ui-flyout-no-escape-close", Hg = `${Lg}--`, Ug = "bottom-start", Wg = class {
	root;
	flyouts = new gg({
		show: ({ owner: e }) => e.classList.add(Rg),
		hide: ({ owner: e }, t) => this.markClosed(e, t !== "owner"),
		single: !1,
		closesWhenReadOnly: !1,
		canDismiss: ({ owner: e }, t) => !e.hasAttribute(t === "escape" ? Vg : Bg)
	});
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${Lg}`)) this.place(e);
		V(this.root, `.${Lg}`, { attributeFilter: ["class"] }, (e) => {
			for (let t of e) this.place(t);
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	place(e) {
		let t = e.querySelector(`:scope > .${_i}`), n = e.querySelector(`:scope > .${zg}`);
		if (t === null) return;
		let r = Gg(n, t);
		if (!e.classList.contains(Rg)) {
			this.flyouts.close(e), r?.setAttribute("aria-expanded", "false");
			return;
		}
		this.flyouts.open({
			owner: e,
			popup: t,
			anchor: qg(n) ?? e,
			placement: { placement: Jg(e) },
			openers: r === null ? [] : [r],
			focus: !Fd() || t
		}) || this.markClosed(e);
	}
	markClosed(e, t = !0) {
		e.classList.contains(Rg) && (e.classList.remove(Rg), Kg(e, !1, t));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${zg}`)?.closest(`.${Lg}`) ?? null;
		if (t !== null) {
			if (this.flyouts.isOpen(t)) {
				this.flyouts.close(t);
				return;
			}
			t.classList.add(Rg), this.place(t), this.flyouts.isOpen(t) && Kg(t, !0);
		}
	}
};
function Gg(e, t) {
	if (e === null) return null;
	let n = e.querySelector(bd) ?? e;
	return n.setAttribute("aria-haspopup", "dialog"), n.setAttribute("aria-controls", zi(t, "ui-flyout-content")), n;
}
function Kg(e, t, n = !0) {
	e.dispatchEvent(new Event("toggle", { bubbles: !0 })), n && e.dispatchEvent(new Event(t ? "open" : "close", { bubbles: !0 }));
}
function qg(e) {
	if (e === null) return null;
	let t = e.firstElementChild;
	return t instanceof HTMLElement ? t : e;
}
function Jg(e) {
	for (let t of e.classList) {
		if (!t.startsWith(Hg)) continue;
		let e = t.slice(Hg.length);
		if (Sp(e)) return e;
	}
	return Ug;
}
//#endregion
//#region src/interactions/drag-marks.ts
var Yg = `:scope > :is(${ul}, .ui-image-input__surface)`;
function Xg(e, t, n, r, i, a = [], o = "move") {
	Zg(t, r), n.classList.add(r);
	for (let e of a) e.classList.add(r);
	Qg(e, i, o);
}
function Zg(e, t) {
	for (let n of e.querySelectorAll(`.${t}`)) n.classList.remove(t);
}
function Qg(e, t, n) {
	!(e instanceof DragEvent) || e.dataTransfer === null || (e.dataTransfer.effectAllowed = n, e.dataTransfer.setData("text/plain", t));
}
function $g(e, t) {
	return !(e.relatedTarget instanceof Node && t.contains(e.relatedTarget));
}
function e_(e, t) {
	let n = t && e.querySelector(Yg) !== null;
	e.hasAttribute("data-ui-drop-boxed") !== n && e.toggleAttribute(_e, n);
}
//#endregion
//#region src/interactions/file-drop.ts
var t_ = "data-ui-file-drop-over", n_ = 120, r_ = "refused", i_ = !1;
function a_(e) {
	let t = {
		marked: /* @__PURE__ */ new Map(),
		leaving: 0
	};
	l_();
	for (let n of [
		"dragenter",
		"dragover",
		"dragleave",
		"drop"
	]) e.root.addEventListener(n, (n) => o_(e, t, n), !0);
	e.root.addEventListener("dragend", () => h_(t.marked), !0), window.addEventListener("blur", () => h_(t.marked)), e.root.addEventListener("paste", (t) => s_(e, t), !0);
}
function o_(e, t, n) {
	if (!(n instanceof DragEvent) || !(n.target instanceof Element)) return;
	let r = t.marked;
	n.type !== "dragleave" && t.leaving !== 0 && (window.clearTimeout(t.leaving), t.leaving = 0);
	let i = e.resolveTarget(n.target);
	if (i === null || !(n.dataTransfer?.types.includes("Files") ?? !1)) {
		i === null && n.type === "dragover" && h_(r);
		return;
	}
	let a = i.mark ?? i.host;
	if (i.refused === !0) {
		u_(n), n.type !== "dragleave" && h_(r);
		return;
	}
	if (n.type === "dragleave") {
		n.relatedTarget instanceof Node ? a.contains(n.relatedTarget) || m_(r, a) : t.leaving = window.setTimeout(() => h_(r), n_);
		return;
	}
	if (n.preventDefault(), n.type !== "drop") {
		let t = d_(i.accept, n.dataTransfer);
		n.dataTransfer !== null && (n.dataTransfer.dropEffect = t ? "none" : "copy");
		for (let e of r.keys()) e !== a && m_(r, e);
		let o = i.mark === void 0 ? e.draggingAttribute : t_;
		r.set(a, o), a.setAttribute(o, t ? r_ : ""), e_(a, o === t_);
		return;
	}
	h_(r);
	let o = [...n.dataTransfer?.files ?? []].filter((e) => g_(i.accept, e));
	o.length !== 0 && e.onFiles(i.host, i.multiple ? o : [o[0]]);
}
function s_(e, t) {
	if (!(t instanceof ClipboardEvent) || !(t.target instanceof Element)) return;
	let n = t.clipboardData;
	if (n === null || n.files.length === 0 || n.getData("text/plain").trim().length > 0) return;
	let r = e.resolveTarget(t.target);
	if (r === null || r.refused === !0) return;
	let i = [...n.files].filter((e) => g_(r.accept, e));
	i.length !== 0 && (t.preventDefault(), e.onFiles(r.host, r.multiple ? i : [i[0]]));
}
function c_(e, t, n) {
	for (let r = t.closest(`[${ie}]`); r !== null; r = r.parentElement?.closest("[data-ui-id]") ?? null) {
		let t = r.getAttribute("data-ui-id") ?? "", i = [...e.querySelectorAll(`${n}[${Fr}="${w(t)}"]`)];
		if (i.length > 0) return {
			field: i.find((e) => r.contains(e)) ?? i[0],
			component: r
		};
	}
	return null;
}
function l_() {
	if (!i_) {
		i_ = !0;
		for (let e of ["dragover", "drop"]) window.addEventListener(e, (e) => {
			e instanceof DragEvent && !e.defaultPrevented && (e.dataTransfer?.types.includes("Files") ?? !1) && u_(e);
		});
	}
}
function u_(e) {
	e.type !== "dragleave" && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "none"));
}
function d_(e, t) {
	let n = f_(e);
	if (t === null || n.length === 0 || n.some((e) => e.startsWith("."))) return !1;
	let r = [...t.items].filter((e) => e.kind === "file").map((e) => e.type.toLowerCase());
	return r.length !== 0 && !r.some((e) => n.some((t) => p_(t, e)));
}
function f_(e) {
	return e.split(",").map((e) => e.trim().toLowerCase()).filter((e) => e.length > 0);
}
function p_(e, t) {
	return e.endsWith("/*") ? t.startsWith(e.slice(0, -1)) : t === e;
}
function m_(e, t) {
	let n = e.get(t);
	e.delete(t), n !== void 0 && t.removeAttribute(n), e_(t, !1);
}
function h_(e) {
	for (let t of [...e.keys()]) m_(e, t);
}
function g_(e, t) {
	let n = f_(e);
	if (n.length === 0) return !0;
	let r = t.name.toLowerCase(), i = t.type.toLowerCase();
	return n.some((e) => e.startsWith(".") ? r.endsWith(e) : p_(e, i));
}
//#endregion
//#region src/rendering/file-glyphs.ts
var __ = "ne-picture-as-pdf", v_ = "ne-text-snippet", y_ = "ne-description", b_ = "ne-table-chart", x_ = "ne-slideshow", S_ = "ne-folder-zip", C_ = "ne-audio-file", w_ = "ne-video-file", T_ = "ne-image", E_ = "ne-code", D_ = "ne-draft", O_ = new Map([
	...M_(__, "pdf"),
	...M_(v_, "txt", "md", "log"),
	...M_(y_, "doc", "docx", "odt", "rtf"),
	...M_(b_, "xls", "xlsx", "ods", "csv", "tsv"),
	...M_(x_, "ppt", "pptx", "odp", "key"),
	...M_(S_, "zip", "rar", "7z", "tar", "gz", "tgz", "bz2", "xz"),
	...M_(C_, "mp3", "wav", "ogg", "oga", "opus", "flac", "m4a", "aac"),
	...M_(w_, "mp4", "m4v", "mov", "avi", "mkv", "webm"),
	...M_(T_, "png", "jpg", "jpeg", "gif", "webp", "avif", "bmp", "svg", "ico", "tif", "tiff", "heic", "heif"),
	...M_(E_, "json", "xml", "yml", "yaml", "html", "htm", "css", "less", "scss", "js", "mjs", "ts", "tsx", "jsx", "cs", "csproj", "sln", "java", "kt", "py", "rb", "php", "go", "rs", "c", "h", "cpp", "hpp", "swift", "sql", "sh", "ps1")
]), k_ = /* @__PURE__ */ new Map([
	["application/pdf", __],
	["text/csv", b_],
	["application/msword", y_],
	["application/rtf", y_],
	["application/vnd.openxmlformats-officedocument.wordprocessingml.document", y_],
	["application/vnd.oasis.opendocument.text", y_],
	["application/vnd.ms-excel", b_],
	["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", b_],
	["application/vnd.oasis.opendocument.spreadsheet", b_],
	["application/vnd.ms-powerpoint", x_],
	["application/vnd.openxmlformats-officedocument.presentationml.presentation", x_],
	["application/vnd.oasis.opendocument.presentation", x_],
	["application/zip", S_],
	["application/x-zip-compressed", S_],
	["application/x-7z-compressed", S_],
	["application/vnd.rar", S_],
	["application/x-rar-compressed", S_],
	["application/x-tar", S_],
	["application/gzip", S_],
	["application/json", E_],
	["application/xml", E_],
	["text/xml", E_],
	["text/html", E_]
]), A_ = /* @__PURE__ */ new Map([
	["image", T_],
	["audio", C_],
	["video", w_],
	["text", v_]
]);
function j_(e, t) {
	let n = e.lastIndexOf("."), r = n < 0 ? void 0 : O_.get(e.slice(n + 1).toLowerCase());
	if (r !== void 0) return r;
	let i = t.split(";", 1)[0].trim().toLowerCase(), a = i.indexOf("/");
	return k_.get(i) ?? (a < 0 ? void 0 : A_.get(i.slice(0, a))) ?? D_;
}
function M_(e, ...t) {
	return t.map((t) => [t, e]);
}
//#endregion
//#region src/rendering/file-tile.ts
var N_ = [
	"kilobyte",
	"megabyte",
	"gigabyte"
];
function P_(e, t, n) {
	let r = document.createElement("span"), i = document.createElement("span"), a = document.createElement("span");
	return e.classList.add(Tt), e.setAttribute("title", t.name), e.setAttribute(kt, t.name), F_(e, At, t.type.length > 0 ? t.type : null), F_(e, jt, t.size === null ? null : String(t.size)), r.className = Et, r.setAttribute("aria-hidden", "true"), i.className = Dt, i.textContent = t.name, a.className = Ot, L_(e, r, a, n), [
		r,
		i,
		a
	];
}
function F_(e, t, n) {
	n === null ? e.removeAttribute(t) : e.setAttribute(t, n);
}
function I_(e, t) {
	let n = e.querySelector(`:scope > .${Et}`), r = e.querySelector(`:scope > .${Ot}`);
	n !== null && r !== null && L_(e, n, r, t);
}
function L_(e, t, n, r) {
	let i = e.getAttribute(Mt), a = i !== null && Hh(i).length > 0 ? i : j_(e.getAttribute("data-ui-file-name") ?? "", e.getAttribute("data-ui-file-type") ?? "");
	(!t.classList.contains(Hh(a)) || i !== null) && zh(t, a);
	let o = Number(e.getAttribute("data-ui-file-size") ?? NaN), s = Number.isFinite(o) && o >= 0 ? R_(o, r) : "";
	n.textContent !== s && (n.textContent = s);
}
function R_(e, t) {
	let n = e, r = "byte";
	for (let e of N_) {
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
//#region src/interactions/file-upload.ts
var z_ = "/_ne/files/upload", B_ = "/_ne/files/selection/", V_ = "/_ne/files/upload/", H_ = /* @__PURE__ */ new Map(), U_ = !1;
function W_(e, t, n, r) {
	let i = Number(e.getAttribute(Nr)), a = [], o = [];
	for (let e of t) !Number.isFinite(i) || i <= 0 || e.size <= i ? a.push(e) : o.push(e);
	if (o.length === 0) return H_.delete(e) && r?.mark(e, null), a;
	if (r === void 0) return s("a chosen file exceeds the input's size limit and was refused.", {
		names: o.map((e) => e.name),
		limit: i
	}), a;
	let c = {
		validation: r,
		limit: i,
		names: n ? o.map((e) => e.name) : null
	};
	for (let e of H_.keys()) e.isConnected || H_.delete(e);
	return H_.set(e, c), G_(e, c), K_(), a;
}
function G_(e, t) {
	let n = R_(t.limit, O.language);
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
function K_() {
	U_ || (U_ = !0, O.onChange(() => {
		for (let [e, t] of H_) e.isConnected ? G_(e, t) : H_.delete(e);
	}));
}
function q_(e, t) {
	return new Promise((n, r) => {
		let i = new FormData(), a = performance.now(), o = 0, s = 0;
		for (let t of e) i.append("files", t, t.name), o += t.size, s++;
		let c = new XMLHttpRequest();
		c.open("POST", z_), c.responseType = "json", c.withCredentials = !0, c.upload.addEventListener("progress", (e) => {
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
async function J_(e) {
	let t = await fetch(`${B_}${encodeURIComponent(e)}`, {
		credentials: "same-origin",
		cache: "no-store"
	});
	if (!t.ok) throw Error(`Reading selection failed with status ${t.status}.`);
	let n = (await t.json())?.files ?? [];
	return n.length === 0 ? null : n;
}
function Y_(e) {
	return `${V_}${encodeURIComponent(e)}`;
}
var X_ = () => {};
function Z_(e) {
	return {
		uploadAsync: (e, t) => q_(e, t ?? X_),
		accepts: g_,
		takeWithinSizeLimit: (t, n, r) => W_(t, n, r, e)
	};
}
function Q_(e, t) {
	e !== null && e.value !== t && (e.value = t, e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/picker-events.ts
var $_ = "ui-open-picker";
function ev(e) {
	return !e.dispatchEvent(new Event($_, {
		bubbles: !0,
		cancelable: !0
	}));
}
function tv(e, t) {
	if (!(e.target instanceof Element)) return;
	let n = e.target.closest(t.rootSelector);
	if (n === null) return;
	e.preventDefault();
	let r = n.querySelector(t.nativeSelector), i = t.pressed(n);
	r === null || r.disabled || i === null || j(n) || k(i) || r.click();
}
//#endregion
//#region src/interactions/file-input-engine.ts
var nv = "ui-file-input", rv = "ui-file-input__row", iv = "ui-file-input__native", av = "ui-file-input__field", ov = "ui-file-input__selection", sv = "data-ui-file-dragging", cv = class {
	root;
	validation;
	picks = /* @__PURE__ */ new WeakMap();
	shownWords = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation, O.onChange(() => this.rewriteShownWords()), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener($_, (e) => tv(e, {
			rootSelector: `.${nv}`,
			nativeSelector: `.${iv}`,
			pressed: (e) => e
		})), this.root.addEventListener("change", (e) => void this.handleSelectionAsync(e), !0), a_({
			root: this.root,
			draggingAttribute: sv,
			resolveTarget: (e) => {
				let t = e.closest(`.${rv}`)?.closest(`.${nv}`) ?? null, n = t === null ? c_(this.root, e, `.${nv}`) : null, r = t ?? n?.field ?? null, i = r?.querySelector(`.${iv}`) ?? null;
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
		let t = e.target.closest(`[${Pr}], .${rv}`);
		if (t === null || k(t) || j(t) || !t.hasAttribute("data-ui-file-pick") && e.target.closest("button, a") !== null) return;
		let n = t.closest(`.${nv}`)?.querySelector(`.${iv}`);
		n == null || n.disabled || n.click();
	}
	async handleSelectionAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(iv)) return;
		let t = e.target.closest(`.${nv}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && await this.takeFilesAsync(t, n);
	}
	async takeFilesAsync(e, t) {
		let n = e.querySelector(`.${av}`);
		if (n === null) return;
		if (t.length === 0) {
			this.show(n, ""), this.publishSelection(e, "");
			return;
		}
		let r = W_(e, t, e.querySelector(`.${iv}`)?.multiple === !0, this.validation);
		if (r.length === 0) return;
		let i = (this.picks.get(e) ?? 0) + 1;
		this.picks.set(e, i);
		try {
			let t = await q_(r, (t) => {
				this.picks.get(e) === i && this.show(n, () => O.format("ui.file.uploading", { percent: t }));
			});
			if (this.picks.get(e) !== i) return;
			this.show(n, lv(r)), this.publishSelection(e, t.selectionId);
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
		Q_(e.querySelector(`.${ov}`), t);
	}
};
function lv(e) {
	return e.length === 1 ? e[0].name : () => O.format("ui.file.count", { count: e.length });
}
var uv = 1024, dv = 16777216;
function fv(e) {
	return {
		x: e.width / 2,
		y: e.height / 2,
		zoom: 1
	};
}
function pv(e, t) {
	let n = Cv(t.zoom, 1, 4), r = Sv(e) / n / 2;
	return {
		x: Cv(t.x, r, e.width - r),
		y: Cv(t.y, r, e.height - r),
		zoom: n
	};
}
function mv(e, t) {
	let n = Sv(e) / t.zoom;
	return {
		x: t.x - n / 2,
		y: t.y - n / 2,
		side: n
	};
}
function hv(e, t, n) {
	return t.zoom * n / Sv(e);
}
function gv(e, t, n, r, i) {
	let a = hv(e, t, n);
	return a > 0 ? pv(e, {
		x: t.x - r / a,
		y: t.y - i / a,
		zoom: t.zoom
	}) : t;
}
function _v(e, t, n, r, i = {
	x: 0,
	y: 0
}) {
	let a = Cv(t.zoom * r, 1, 4), o = hv(e, t, n), s = hv(e, {
		...t,
		zoom: a
	}, n);
	return !(o > 0) || !(s > 0) ? pv(e, {
		...t,
		zoom: a
	}) : pv(e, {
		x: t.x + i.x / o - i.x / s,
		y: t.y + i.y / o - i.y / s,
		zoom: a
	});
}
function vv(e, t) {
	return Math.max(1, Math.min(t, Math.round(e.side)));
}
function yv(e, t) {
	return Math.min(1, t * 4 / Sv(e), Math.sqrt(dv / (e.width * e.height)));
}
function bv(e) {
	return e === "image/jpeg" || e === "image/png" || e === "image/webp" ? e : "image/png";
}
function xv(e, t, n) {
	if (n === t) return e;
	let r = e.lastIndexOf(".");
	return `${r > 0 ? e.slice(0, r) : e}.${n === "image/jpeg" ? "jpg" : n.slice(n.indexOf("/") + 1)}`;
}
function Sv(e) {
	return Math.min(e.width, e.height);
}
function Cv(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
//#endregion
//#region src/interactions/page-dialog.ts
function wv(e) {
	let t = document.createElement("div");
	t.className = `ui-dialog ${e.className}`, t.setAttribute(Am, e.key), t.setAttribute(jm, ""), e.closesOnEscapeAndBackdrop && (t.setAttribute(Pm, ""), t.setAttribute(Nm, "")), t.setAttribute("hidden", "");
	let n = document.createElement("div");
	n.className = "ui-dialog__backdrop", n.setAttribute(Mm, "");
	let r = document.createElement("div");
	return r.className = e.surfaceClassName === void 0 ? gi : `${gi} ${e.surfaceClassName}`, r.setAttribute("role", e.role), r.setAttribute("tabindex", "-1"), r.setAttribute("aria-modal", "true"), r.setAttribute("aria-labelledby", e.labelledBy), e.describedBy !== void 0 && r.setAttribute("aria-describedby", e.describedBy), t.append(n, r), {
		dialog: t,
		surface: r
	};
}
var Tv = class {
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
}, Ev = 100 / 3, Dv = 1, Ov = 2;
function kv(e, t = Ev) {
	let n = e.deltaMode === Dv ? Ev : e.deltaMode === Ov ? t : 1;
	return {
		x: e.deltaX * n,
		y: e.deltaY * n
	};
}
function Av(e, t) {
	let n = (Math.sign(e) === Math.sign(t) ? e : 0) + t, r = Math.trunc(n / 100) || 0;
	return {
		steps: r,
		carried: n - r * 100
	};
}
var jv = {
	notch: 100,
	pixels: kv
}, Mv = "ui-image-crop", Nv = "ui-image-crop-title", Pv = new Tv("data-ui-image-crop-part"), Fv = "data-ui-image-crop-frame", Iv = 10, Lv = 1.2, Rv = 380, zv = 100, Bv = .92, H = null, Vv = !1, Hv = null, Uv = !1;
async function Wv(e, t, n, r = ny) {
	if (H !== null || Vv) return "cancelled";
	Vv = !0;
	let i;
	try {
		i = await r.decodeAsync(t, n.size);
	} finally {
		Vv = !1;
	}
	if (i === null) return "unreadable";
	let a = i;
	return new Promise((i) => {
		Hv ??= Gv();
		let o = Hv;
		o.dialog.isConnected || document.body.append(o.dialog), H = {
			file: t,
			source: a,
			request: n,
			imaging: r,
			view: fv(a),
			finish: (t) => {
				H = null, e.close(Mv), a.release(), i(t);
			}
		}, O.write(o.title, null, "ui.crop.title"), O.write(o.stage, "aria-label", "ui.crop.frame"), O.write(o.zoom, "aria-label", "ui.crop.zoom"), O.write(o.cancel, null, "ui.crop.cancel"), O.write(o.apply, null, "ui.crop.apply"), o.stage.setAttribute(Fv, n.frame), e.open(Mv), ey(o);
	});
}
function Gv() {
	let { dialog: e, surface: t } = wv({
		key: Mv,
		className: "ui-image-crop",
		surfaceClassName: "ui-image-crop__surface",
		role: "dialog",
		labelledBy: Nv,
		closesOnEscapeAndBackdrop: !1
	}), n = Pv.element("h2", "ui-image-crop__title ui-text-type--subtitle");
	n.id = Nv;
	let r = Pv.element("div", "ui-image-crop__stage", "stage");
	r.setAttribute("tabindex", "0"), r.setAttribute("role", "group");
	let i = Pv.element("canvas", "ui-image-crop__canvas"), a = Pv.element("span", "ui-image-crop__frame");
	i.setAttribute("aria-hidden", "true"), a.setAttribute("aria-hidden", "true"), r.append(i, a);
	let o = Pv.element("input", "ui-image-crop__zoom", "zoom");
	o.type = "range", o.min = "1", o.max = "4", o.step = "0.01";
	let s = Pv.button("ui-button--ghost", "cancel"), c = Pv.button("ui-button--primary", "apply");
	t.append(n, r, o, Pv.actions(s, c));
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
		let t = Pv.pressed(e);
		t === "cancel" ? H?.finish("cancelled") : t === "apply" && Kv();
	}), new MutationObserver(() => {
		H !== null && e.hasAttribute("hidden") && H.finish("cancelled");
	}).observe(e, {
		attributes: !0,
		attributeFilter: ["hidden"]
	}), e.addEventListener("keydown", (e) => qv(l, e)), o.addEventListener("input", () => Qv(l, Number(o.value))), r.addEventListener("wheel", (e) => Jv(l, e), { passive: !1 }), window.addEventListener("resize", () => ty(l)), new sh({
		root: e,
		resolveHandle: (e) => r.contains(e) ? r : null,
		begin: (e, t) => H === null ? null : {
			last: t,
			start: H.view
		},
		move: (e, t, n) => {
			e.last !== null && Yv(l, n.x - e.last.x, n.y - e.last.y), e.last = n;
		},
		end: () => void 0,
		cancel: (e, t) => {
			H !== null && (H.view = t.start, ey(l));
		},
		pinch: (e, t) => {
			e.last = null, Xv(l, t);
		}
	}), l;
}
async function Kv() {
	let e = H;
	if (e === null) return;
	let { file: t, source: n, request: r, imaging: i, view: a } = e, o = mv(n, a), s = bv(t.type), c = i.encodeAsync(n, o, vv(o, r.size), s);
	H = null;
	let l;
	try {
		l = await c;
	} catch {
		l = null;
	}
	e.finish(l === null ? "unreadable" : new File([l], xv(t.name, t.type, l.type), {
		type: l.type,
		lastModified: t.lastModified
	}));
}
function qv(e, t) {
	if (t.defaultPrevented || M(t) || H === null) return;
	if (t.key === "Escape") {
		t.preventDefault(), H.finish("cancelled");
		return;
	}
	if (t.target !== e.stage || t.ctrlKey || t.altKey || t.metaKey) return;
	let n = t.shiftKey ? 50 : Iv;
	switch (t.key) {
		case "ArrowLeft":
			Yv(e, -n, 0);
			break;
		case "ArrowRight":
			Yv(e, n, 0);
			break;
		case "ArrowUp":
			Yv(e, 0, -n);
			break;
		case "ArrowDown":
			Yv(e, 0, n);
			break;
		case "+":
		case "=":
			Zv(e, Lv);
			break;
		case "-":
		case "_":
			Zv(e, 1 / Lv);
			break;
		case "Enter":
			Kv();
			break;
		default: return;
	}
	t.preventDefault();
}
function Jv(e, t) {
	if (H === null) return;
	t.preventDefault();
	let n = kv(t, e.stage.clientHeight), r = t.ctrlKey ? zv : Rv;
	Zv(e, 2 ** (-n.y / r), $v(e, t.clientX, t.clientY));
}
function Yv(e, t, n) {
	H !== null && (H.view = gv(H.source, H.view, e.frame.clientWidth, t, n), ey(e));
}
function Xv(e, t) {
	if (H === null) return;
	let n = gv(H.source, H.view, e.frame.clientWidth, t.shift.x, t.shift.y);
	H.view = _v(H.source, n, e.frame.clientWidth, t.factor, $v(e, t.center.x, t.center.y)), ey(e);
}
function Zv(e, t, n) {
	H !== null && (H.view = _v(H.source, H.view, e.frame.clientWidth, t, n), ey(e));
}
function Qv(e, t) {
	H !== null && Number.isFinite(t) && t > 0 && Zv(e, t / H.view.zoom);
}
function $v(e, t, n) {
	let r = e.stage.getBoundingClientRect();
	return {
		x: t - (r.left + r.width / 2),
		y: n - (r.top + r.height / 2)
	};
}
function ey(e) {
	if (H === null) return;
	let t = H.view.zoom;
	e.zoom.value = String(t), e.zoom.setAttribute("aria-valuetext", `${Math.round(t * 100)}%`), e.zoom.style.setProperty("--ui-slider-fraction", String((t - 1) / 3)), ty(e);
}
function ty(e) {
	Uv || H === null || (Uv = !0, requestAnimationFrame(() => {
		if (Uv = !1, H === null) return;
		let t = e.frame.clientWidth, n = e.stage.clientWidth, r = e.stage.clientHeight, i = H.view, a = hv(H.source, i, t);
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
var ny = {
	decodeAsync: async (e, t) => {
		let n = await ry(e);
		if (n === null) return null;
		let r = n, i = yv(r, t);
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
		}, r, Bv);
	})
};
async function ry(e) {
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
var iy = "ui-image-input", ay = "ui-image-input--multiple", oy = "ui-image-input__surface", sy = "ui-image-input__native", cy = "ui-image-input__picture", ly = "ui-image-input__text", uy = "ui-image-input__selection", dy = "ui-image-input__selections", fy = "ui-image-input__tiles", py = "ui-image-input__tile", my = "ui-image-input__remove", hy = "ui-image-input__progress", gy = "SelectionId", _y = "--ui-image-progress", vy = "data-ui-image-preview", yy = "data-ui-image-dragging", by = "data-ui-image-tiles", xy = class {
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
		this.root = e.root ?? document, this.validation = e.validation, this.dialogs = e.dialogs, this.cropImaging = e.cropImaging, this.applyAll(this.root.querySelectorAll(`.${iy}`)), V(this.root, `.${iy}`, {
			childList: !0,
			attributeFilter: [
				Mr,
				et,
				ii
			]
		}, (e) => {
			this.applyAll(e), this.releaseDetached();
		}), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			e.propertyName === gy && (e.value === null || e.value === void 0 || e.value === "") && this.clearAll(Ea(e.components, `.${iy}`));
		}), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("click", (e) => this.handleRemoveClick(e), !0), this.root.addEventListener("change", (e) => void this.handleNativeChangeAsync(e), !0), this.root.addEventListener($_, (e) => tv(e, {
			rootSelector: `.${iy}`,
			nativeSelector: `.${sy}`,
			pressed: (e) => e.querySelector(`.${oy}`)
		})), this.root.addEventListener(cl, (e) => this.handleDraftDropped(e)), a_({
			root: this.root,
			draggingAttribute: yy,
			resolveTarget: (e) => {
				let t = e.closest(`.${oy}`), n = t?.closest(`.${iy}`) ?? null, r = n === null ? c_(this.root, e, `.${iy}`) : null, i = n ?? r?.field ?? null, a = t ?? i?.querySelector(`.${oy}`) ?? null;
				return i === null || a === null ? null : {
					host: i,
					mark: r?.component,
					accept: i.querySelector(`.${sy}`)?.getAttribute("accept") ?? "",
					multiple: Sy(i),
					refused: j(i) || k(a)
				};
			},
			onFiles: (e, t) => void (Sy(e) ? this.takeManyAsync(e, t) : this.takeFileAsync(e, t[0]))
		});
	}
	applyAll(e) {
		for (let t of e) Sy(t) ? this.reconcileShelf(t) : this.apply(t);
	}
	apply(e) {
		let t = e.querySelector(`.${cy}`);
		if (t === null) return;
		let n = e.getAttribute("data-ui-image-source") ?? "", r = this.previews.has(e);
		if (r && e.dataset.previewFor === n) return;
		let i = r && n.length > 0;
		this.dropPreview(e, i), n.length === 0 ? t.removeAttribute("src") : t.getAttribute("src") !== n && t.setAttribute("src", n), i || jy(e, e.getAttribute("data-ui-image-caption") ?? Py(n)), Ny(e, n.length > 0);
	}
	reconcileShelf(e) {
		let t = e.getAttribute(ii);
		if (this.seenKeys.get(e) === t) return;
		this.seenKeys.set(e, t);
		let n = this.published.get(e) ?? [], r = t === null ? -1 : n.indexOf(t);
		if (r >= 0) {
			n.splice(0, r + 1);
			return;
		}
		let i = Ey(t);
		if (i === null) return;
		let a = this.shelves.get(e) ?? [];
		for (let t of [...a]) t.selectionId !== null && !i.has(t.selectionId) && this.dropTile(e, t);
		this.restoreTiles(e, a, i);
	}
	restoreTiles(e, t, n) {
		let r = e.querySelector(`.${fy}`);
		if (r === null || n.size === 0) return;
		let i = /* @__PURE__ */ new Map();
		for (let e of t) e.selectionId !== null && i.set(e.selectionId, e);
		let a = [];
		for (let t of n) {
			let n = i.get(t);
			n === void 0 && (n = Oy(t), this.fillStoredTileAsync(e, n, t)), a.push(n);
		}
		for (let e of t) e.selectionId === null && a.push(e);
		a.length === t.length && a.every((e, n) => t[n] === e) || (t.splice(0, t.length, ...a), this.shelves.set(e, t), r.replaceChildren(...t.map((e) => e.element)), Cy(e, t));
	}
	async fillStoredTileAsync(e, t, n) {
		let r;
		try {
			r = await J_(n);
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
		ky(t.element, a, i === void 0 ? "" : Y_(i.fileId)), t.element.classList.remove(pi);
	}
	releaseDetached() {
		for (let e of this.holding) if (!e.isConnected) {
			this.holding.delete(e), this.dropPreview(e);
			for (let t of [...this.shelves.get(e) ?? []]) this.dropTile(e, t);
		}
	}
	clearAll(e) {
		for (let t of e) Sy(t) || this.previews.get(t)?.landed !== !0 || (t.dataset.previewFor === (t.getAttribute("data-ui-image-source") ?? "") && this.dropPreview(t), this.apply(t));
	}
	handlePickClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Pr}]`), n = t?.closest(`.${iy}`) ?? null;
		t === null || n === null || j(n) || k(t) || n.querySelector(`.${sy}`)?.click();
	}
	handleRemoveClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${my}`), n = t?.closest(`.${iy}`) ?? null;
		if (t === null || n === null || j(n) || k(n)) return;
		e.preventDefault(), e.stopPropagation();
		let r = this.shelves.get(n)?.find((e) => e.element === t.parentElement);
		r !== void 0 && (this.dropTile(n, r), this.publishShelf(n));
	}
	async handleNativeChangeAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(sy)) return;
		let t = e.target.closest(`.${iy}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && n.length !== 0 && (Sy(t) ? await this.takeManyAsync(t, n) : await this.takeFileAsync(t, n[0]));
	}
	handleDraftDropped(e) {
		if (e.target instanceof Element) for (let t of e.target.querySelectorAll(`.${iy}`)) this.previews.has(t) && (this.dropPreview(t), this.apply(t), Q_(t.querySelector(`.${uy}`), ""));
	}
	async takeFileAsync(e, t) {
		this.releaseDetached();
		let n = e.querySelector(`.${oy}`), r = e.querySelector(`.${cy}`), i = e.querySelector(`.${uy}`);
		if (n === null || r === null) return;
		let a = await this.cropAsync(e, t);
		if (a === null || W_(e, [a], !1, this.validation).length === 0) return;
		this.dropPreview(e);
		let o = {
			url: URL.createObjectURL(a),
			landed: !1
		};
		this.previews.set(e, o), this.holding.add(e), e.dataset.previewFor = e.getAttribute("data-ui-image-source") ?? "", e.setAttribute(vy, ""), r.setAttribute("src", o.url), jy(e, a.name), Ny(e, !0), n.classList.add(pi);
		try {
			let t = await q_([a], () => void 0);
			this.previews.get(e) === o && (o.landed = !0, Q_(i, t.selectionId));
		} catch (t) {
			s("picture upload failed.", t), this.previews.get(e) === o && (My(e), Q_(i, ""));
		} finally {
			(this.previews.get(e) === o || !this.previews.has(e)) && n.classList.remove(pi);
		}
	}
	async cropAsync(e, t) {
		let n = wy(e);
		if (n === null || this.dialogs === void 0) return t;
		if (this.cropping.has(e)) return null;
		this.cropping.add(e);
		try {
			let r = await Wv(this.dialogs, t, {
				frame: n,
				size: Ty(e)
			}, this.cropImaging);
			return r === "cancelled" || !e.isConnected ? null : r === "unreadable" ? (this.unreadable.add(e), this.validation?.mark(e, "error", { key: "ui.image.unreadable" }), null) : (this.unreadable.delete(e) && this.validation?.mark(e, null), r);
		} finally {
			this.cropping.delete(e);
		}
	}
	async takeManyAsync(e, t) {
		this.releaseDetached();
		let n = e.querySelector(`.${fy}`), r = W_(e, t, !0, this.validation);
		if (n === null || r.length === 0) return;
		let i = this.shelves.get(e) ?? [];
		this.shelves.set(e, i), this.holding.add(e);
		let a = r.map(async (t) => {
			let r = Dy(t);
			i.push(r), n.appendChild(r.element);
			try {
				let n = await q_([t], (e) => r.element.style.setProperty(_y, `${e}%`));
				if (!i.includes(r)) return;
				r.selectionId = n.selectionId, r.element.classList.remove(pi), this.publishShelf(e);
			} catch (t) {
				this.dropTile(e, r), s("picture upload failed.", t);
			}
		});
		Cy(e, i), await Promise.all(a);
	}
	dropTile(e, t) {
		let n = this.shelves.get(e), r = n?.indexOf(t) ?? -1;
		n !== void 0 && r >= 0 && n.splice(r, 1), t.url !== null && URL.revokeObjectURL(t.url), t.element.remove(), Cy(e, n ?? []);
	}
	publishShelf(e) {
		let t = e.querySelector(`.${dy}`), n = (this.shelves.get(e) ?? []).map((e) => e.selectionId).filter((e) => e !== null), r = JSON.stringify(n);
		if (t === null || t.getAttribute("data-ui-selected-keys") === r) return;
		let i = this.published.get(e) ?? [];
		i.push(r), this.published.set(e, i), t.setAttribute(ii, r), t.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	dropPreview(e, t = !1) {
		let n = this.previews.get(e);
		n !== void 0 && (URL.revokeObjectURL(n.url), this.previews.delete(e), delete e.dataset.previewFor, e.removeAttribute(vy), t || jy(e, ""));
	}
};
function Sy(e) {
	return e.classList.contains(ay);
}
function Cy(e, t) {
	e.hasAttribute(by) !== t.length > 0 && e.toggleAttribute(by, t.length > 0);
}
function wy(e) {
	let t = e.getAttribute(tt);
	return t === "square" || t === "circle" ? t : null;
}
function Ty(e) {
	let t = Number(e.getAttribute(nt));
	return Number.isInteger(t) && t > 0 ? t : uv;
}
function Ey(e) {
	if (e === null) return /* @__PURE__ */ new Set();
	let t;
	try {
		t = JSON.parse(e);
	} catch {
		return null;
	}
	return Array.isArray(t) ? new Set(t.filter((e) => typeof e == "string")) : null;
}
function Dy(e) {
	let t = document.createElement("span"), n = URL.createObjectURL(e);
	return t.className = `${py} ${pi}`, ky(t, e, n), {
		element: t,
		url: n,
		selectionId: null
	};
}
function Oy(e) {
	let t = document.createElement("span"), n = document.createElement("button"), r = document.createElement("span");
	return t.className = `${py} ${pi}`, n.type = "button", n.className = my, r.className = hy, O.write(n, "aria-label", "ui.file.remove"), t.append(n, r), {
		element: t,
		url: null,
		selectionId: e
	};
}
function ky(e, t, n) {
	let r = document.createElement("button"), i = document.createElement("span");
	if (r.type = "button", r.className = my, i.className = hy, t.type.startsWith("image/")) {
		let a = document.createElement("img");
		a.src = n, a.alt = t.name, O.write(r, "aria-label", "ui.image.remove"), a.addEventListener("error", () => e.replaceChildren(...Ay(e, r, t), r, i), { once: !0 }), e.replaceChildren(a, r, i);
	} else e.replaceChildren(...Ay(e, r, t), r, i);
}
function Ay(e, t, n) {
	return O.write(t, "aria-label", "ui.file.remove"), P_(e, n, O.language);
}
function jy(e, t) {
	let n = e.querySelector(`.${ly}`);
	n !== null && (ds(n, null), n.textContent !== t && (n.textContent = t));
}
function My(e) {
	let t = e.querySelector(`.${ly}`);
	t !== null && O.write(t, null, "ui.file.failed");
}
function Ny(e, t) {
	let n = e.querySelector(`.${oy}`);
	n !== null && O.write(n, "aria-label", t ? "ui.image.change" : "ui.image.choose");
}
function Py(e) {
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
var Fy = "ui-key-value-action__value", Iy = "ui-key-value-action--editable", Ly = "ui-text__title", Ry = "ui-row-form-", zy = ":scope > :is(.ui-input--filled, .ui-input--tonal, .ui-input--outline, .ui-input--ghost, .ui-input--underline)", By = class {
	options;
	root;
	openRows = /* @__PURE__ */ new WeakSet();
	closedRows = /* @__PURE__ */ new WeakSet();
	rowForms = /* @__PURE__ */ new WeakMap();
	formCount = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.handleRows(this.root.querySelectorAll(`.${Kc}`), !1), V(this.root, `.${Kc}`, {
			childList: !0,
			attributeFilter: [Er]
		}, (e) => this.handleRows(e, !0)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && Gy(e.target) && e.preventDefault();
		}, !0), (this.root === document ? window : this.root).addEventListener("change", (e) => Wy(e), !0);
	}
	handleRows(e, t) {
		for (let n of e) {
			if (!n.hasAttribute("data-ui-row-editing")) {
				this.closedRows.has(n) || (this.openRows.delete(n), this.closedRows.add(n), this.close(n));
				continue;
			}
			this.closedRows.delete(n), this.joinForm(n), Vy(n), this.openRows.has(n) || (this.openRows.add(n), this.open(n, t), this.judge(n));
		}
	}
	joinForm(e) {
		let t = e.querySelector(`.${Jc} button`);
		if (t === null) return;
		let n = this.rowForms.get(e);
		n === void 0 && (n = `${Ry}${++this.formCount}`, this.rowForms.set(e, n));
		for (let t of e.querySelectorAll(`.${qc} [${Ze}]:not([${sn}])`)) t.setAttribute(sn, n);
		t.setAttribute(ui, n);
	}
	leaveForm(e) {
		let t = this.rowForms.get(e);
		if (t !== void 0) for (let n of e.querySelectorAll(`[${sn}="${t}"], [${ui}="${t}"]`)) n.removeAttribute(sn), n.removeAttribute(ui);
	}
	close(e) {
		this.leaveForm(e);
		for (let t of e.querySelectorAll(`.${qc} [${Ze}]`)) {
			if (il(t)) {
				t.value = "";
				continue;
			}
			let e = this.options.dom.resolveNearestComponent(t, () => !0);
			this.options.propertyPatchEngine.restoreBoundValue(t, e?.dynamicParameters ?? []);
		}
		ll(e), this.judge(e);
	}
	judge(e) {
		let t = Uy(e);
		for (let n of e.querySelectorAll(`.${qc} [${Ze}]`)) this.options.validation.judgeShown(n, il(n) && n.value.length === 0 ? t : null);
	}
	open(e, t) {
		let n = e.querySelector(`.${qc} :is(input, textarea, select)`);
		if (n !== null) {
			if (il(n) && n.value.length === 0 && n.hasAttribute("data-ui-bind-value")) {
				let t = Uy(e);
				t.length > 0 && (n.value = t, n.dispatchEvent(new Event("change", { bubbles: !0 })));
			}
			t && (n.focus({ preventScroll: !0 }), rl(n) && n.select());
		}
	}
	handleKeydown(e) {
		if (e.key === "F2" && !e.defaultPrevented && N(e)) {
			Hy(e);
			return;
		}
		if (e.defaultPrevented || M(e) || !(e.target instanceof Element) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = Qc(e.target);
		if (t === null || e.key === "Enter" && t.cell.classList.contains("ui-key-value-action__edit-action")) return;
		let { cell: n, row: r } = t, i = e.target.closest(xi), a = n.querySelector("[role='listbox']");
		if (i !== null && n.contains(i) || a !== null && a.getClientRects().length > 0 || e.key === "Enter" && e.target instanceof HTMLTextAreaElement) return;
		let o = r.querySelectorAll(`.${Jc} button`), s = e.key === "Enter" ? o[0] : o[o.length - 1];
		s !== void 0 && (e.preventDefault(), !k(s) && (e.key === "Enter" && e.target instanceof HTMLInputElement && (e.target.dispatchEvent(new Event("change", { bubbles: !0 })), s.focus({ preventScroll: !0 })), s.click()));
	}
};
function Vy(e) {
	for (let t of e.querySelectorAll(`:scope > .${qc}`)) {
		let e = t.querySelector(zy) !== null;
		t.hasAttribute("data-ui-boxed-editor") !== e && t.toggleAttribute(Dr, e);
	}
}
function Hy(e) {
	let t = e.target instanceof Element ? e.target.closest(`.${Kc}`) : null, n = t === null || t.hasAttribute("data-ui-row-editing") || t.closest(`.${Iy}`) === null ? null : t.querySelector(".ui-key-value-action__action")?.querySelector(bd) ?? null;
	n === null || k(n) || (e.preventDefault(), n.click());
}
function Uy(e) {
	return e.querySelector(`.${Fy} .${Ly}`)?.textContent?.trim() ?? "";
}
function Wy(e) {
	if (!e.isTrusted || !(e.target instanceof Element)) return;
	let t = e.target.closest(".ui-key-value-action__value-input")?.closest(".ui-key-value-action__row") ?? null;
	t !== null && !t.hasAttribute("data-ui-row-editing") && e.stopImmediatePropagation();
}
function Gy(e) {
	let t = e.closest(`.${Jc} button`), n = t?.closest(`.${Jc}`)?.querySelectorAll("button");
	return t !== null && n !== void 0 && n[n.length - 1] === t;
}
var Ky = `.ui-button[${Vt}="pressed"]`, qy = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(Ky);
		t === null || k(t) || t.hasAttribute("data-ui-drawer-pin") || (t.setAttribute("aria-pressed", t.getAttribute("aria-pressed") === "true" ? "false" : "true"), t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, Jy = `${dl}, [tabindex], [contenteditable], ${xi}, [${$e}]`, Yy = ":scope > input.ui-field, :scope > textarea.ui-field", Xy = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("pointerdown", (e) => this.handlePointerDown(e));
	}
	handlePointerDown(e) {
		if (e.defaultPrevented || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(ul);
		if (t === null || e.target !== t && e.target.closest(Jy) !== null) return;
		let n = t.querySelector(Yy);
		if (!il(n) || n.readOnly || k(n) || j(n) || (e.preventDefault(), n.focus({ preventScroll: !0 }), n.selectionStart === null)) return;
		let r = n.value.length;
		n.setSelectionRange(r, r);
	}
}, Zy = "data-ui-input-debounce", Qy = `input[${Zy}], textarea[${Zy}]`;
function $y(e) {
	return (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.matches(Qy);
}
var eb = /* @__PURE__ */ new Set();
function tb() {
	for (let e of eb) if (e.waiting) return !0;
	return !1;
}
function nb() {
	for (let e of eb) e.commitAll();
}
function rb(e) {
	for (let t of eb) t.drop(e);
}
var ib = class {
	waits = /* @__PURE__ */ new Map();
	composing = /* @__PURE__ */ new WeakSet();
	constructor(e) {
		e.addEventListener("compositionstart", (e) => this.mark(e, !0), !0), e.addEventListener("compositionend", (e) => this.mark(e, !1), !0), eb.add(this);
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
}, ab = class {
	root;
	pauses;
	constructor(e = {}) {
		this.root = e.root ?? document, this.pauses = new ib(this.root), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("compositionend", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleChange(e), !0);
	}
	handleInput(e) {
		let t = e.target;
		if (!$y(t) || e.isComposing === !0) return;
		let n = Number(t.getAttribute(Zy));
		this.pauses.wait(t, Number.isFinite(n) && n >= 0 ? n : 0, () => t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	handleChange(e) {
		$y(e.target) && this.pauses.drop(e.target);
	}
}, ob = "data-ui-submit-on-enter", sb = "data-ui-runs-on-enter", cb = "enter", lb = "escape", ub = {
	name: cb,
	registration: { settlesValue: !0 }
}, db = "ui-commit-in-place", fb = class {
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
		}, !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), this.root.addEventListener(db, (e) => {
			(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) && this.commitInPlace(e.target);
		}), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = this.focusedField;
			t !== null && !(e.local && this.edited.has(t)) && e.components.some((e) => e.contains(t)) && (this.lastCommitted = t.value);
		});
	}
	handleKeydown(e) {
		if (e.defaultPrevented || M(e) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = e.target;
		if (t instanceof HTMLTextAreaElement) {
			e.key === "Escape" ? (e.preventDefault(), Zc(t) ? this.runEscape(t, e) : this.leave(t)) : pb(t, e) ? (e.preventDefault(), this.runEnter(t, e)) : mb(t, e) && (e.preventDefault(), this.commitInPlace(t), this.submitForm(t));
			return;
		}
		if (rl(t)) {
			if (e.preventDefault(), pb(t, e)) {
				this.runEnter(t, e);
				return;
			}
			if (e.key === "Escape" && Zc(t)) {
				this.runEscape(t, e);
				return;
			}
			this.leave(t), e.key === "Enter" && this.submitForm(t);
		}
	}
	runEnter(e, t) {
		t.repeat || e.readOnly || k(e) || (this.commitInPlace(e), e.dispatchEvent(new Event(cb, { bubbles: !0 })));
	}
	runEscape(e, t) {
		if (t.repeat) return;
		rb(e), this.edited.delete(e), e === this.focusedField && e.value !== this.lastCommitted && this.putBack(e, this.lastCommitted);
		let n = Qd(e);
		e.blur(), $d(e, n), e.dispatchEvent(new Event(lb, { bubbles: !0 }));
	}
	putBack(e, t) {
		this.propertyPatchEngine?.writeBoundValue(e, t), e.value !== t && (e.value = t);
	}
	submitForm(e) {
		let t = e.getAttribute(sn);
		if (t === null || t.length === 0) return;
		let n = this.root.querySelector(`[${ui}="${w(t)}"]`);
		n !== null && !k(n) && n.click();
	}
	leave(e) {
		let t = this.changes, n = Qd(e);
		e.blur(), this.changes === t && this.commit(e), $d(e, n);
	}
	commit(e) {
		e.value !== this.committedValue && e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	commitInPlace(e) {
		this.edited.has(e) ? e.dispatchEvent(new Event("change", { bubbles: !0 })) : this.commit(e);
	}
};
function pb(e, t) {
	return hb(t) && e.hasAttribute(sb);
}
function mb(e, t) {
	return hb(t) && e.hasAttribute(ob) && !e.readOnly && !k(e);
}
function hb(e) {
	return e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey;
}
//#endregion
//#region src/updates/icon-stand-in.ts
var gb = "icon-stand-in", _b = ".ui-icon.ui-icon--circle", vb = "ne-person", yb = "ui-icon--circle", bb = "ui-icon--image", xb = "ui-icon-stand-in", Sb = `:scope > .${xb}`, Cb = "missing", wb = "failed", Tb = 512, Eb = /* @__PURE__ */ new Map(), Db = /* @__PURE__ */ new Map();
function Ob(e) {
	let t = e.getAttribute(lt), n = kb(e);
	return n === null ? e.removeAttribute(lt) : t !== n && e.setAttribute(lt, n), Nb(e, n !== null), n === Cb ? "show" : t === Cb ? "release" : "keep";
}
function kb(e) {
	if (!e.classList.contains(yb)) return null;
	if (!e.className.split(" ").some(Vh)) return Cb;
	let t = e.classList.contains(bb) ? Ab(e) : null;
	if (t === null) return null;
	let n = Eb.get(t);
	return n === void 0 || !n.loaded && Date.now() - n.at >= 3e4 ? (jb(t, e), n === void 0 ? null : wb) : n.loaded ? null : wb;
}
function Ab(e) {
	let t = e.style.getPropertyValue(Rh).trim();
	return t.startsWith("url(\"") && t.endsWith("\")") ? t.slice(5, -2) : null;
}
function jb(e, t) {
	let n = Db.get(e);
	if (n !== void 0) {
		n.add(t);
		return;
	}
	Db.set(e, /* @__PURE__ */ new Set([t]));
	let r = new Image();
	r.addEventListener("load", () => Mb(e, !0)), r.addEventListener("error", () => Mb(e, !1)), r.src = e;
}
function Mb(e, t) {
	let n = Db.get(e);
	Eb.delete(e), Eb.set(e, {
		loaded: t,
		at: Date.now()
	}), Db.delete(e), Eb.size > Tb && Eb.delete(Eb.keys().next().value);
	for (let e of n ?? []) Ob(e);
}
function Nb(e, t) {
	let n = e.querySelector(Sb);
	if (!t) {
		n?.remove();
		return;
	}
	let r = e.getAttribute(st), i = r !== null && Hh(r).length > 0 ? r : vb;
	if (n === null) n = document.createElement("span"), n.setAttribute("aria-hidden", "true"), e.appendChild(n);
	else if (n.classList.contains(Hh(i))) return;
	zh(n, i), n.classList.add(xb);
}
//#endregion
//#region src/interactions/image-fallback-engine.ts
var Pb = `.${rt}`, Fb = `img.${it}`, Ib = `:scope > ${Fb}`, Lb = "%238c8c8c", Rb = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='-12 -12 48 48'%3E%3Crect x='3' y='3' width='18' height='18' rx='3' fill='none' stroke='${Lb}' stroke-width='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.75' fill='${Lb}'/%3E%3Cpath d='M4 18l5-6 4 4.5 3-3 4 4.5' fill='none' stroke='${Lb}' stroke-width='2' stroke-linejoin='round'/%3E%3C/svg%3E`, zb = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'/%3E", Bb = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("error", (e) => this.handleError(e), !0);
		for (let e of this.root.querySelectorAll(Fb)) (Ub(e) || e.complete && e.naturalWidth === 0) && Gb(e);
		for (let e of this.root.querySelectorAll(_b)) Ob(e);
		V(this.root, `${Pb}, ${_b}`, {
			childList: !0,
			attributeFilter: ["src", "class"],
			relevant: Vb
		}, (e) => {
			for (let t of e) t.classList.contains("ui-image") ? Hb(t) : Ob(t);
		});
	}
	handleError(e) {
		let t = e.target;
		t instanceof HTMLImageElement && t.matches(Fb) && Gb(t);
	}
};
function Vb(e) {
	if (e.type === "childList") return !0;
	let t = e.target;
	return t instanceof Element && (e.attributeName === "src" ? t.matches(Fb) : t.matches(Pb));
}
function Hb(e) {
	let t = e.querySelector(Ib);
	t !== null && (e.hasAttribute("data-ui-image-failed") && (Wb(t) ? t.getAttribute("src") !== qb(e) && Kb(e, t) : (e.removeAttribute(ct), Nb(e, !1))), Ub(t) && Gb(t));
}
function Ub(e) {
	let t = e.getAttribute("src");
	return t === null || t.trim().length === 0;
}
function Wb(e) {
	let t = e.getAttribute("src");
	return t === Rb || t === zb;
}
function Gb(e) {
	if (Wb(e)) return;
	let t = e.getAttribute(ot);
	if (t !== null && t.length > 0 && e.getAttribute("src") !== t) {
		e.setAttribute("src", t);
		return;
	}
	let n = e.parentElement;
	n === null || !n.classList.contains("ui-image") || (n.setAttribute(ct, ""), Kb(n, e));
}
function Kb(e, t) {
	t.setAttribute("src", qb(e)), Nb(e, e.classList.contains(at));
}
function qb(e) {
	return e.classList.contains("ui-image--circle") ? zb : Rb;
}
//#endregion
//#region src/items/radio-row-decorator.ts
var Jb = "ui-radio-group__input", Yb = "ui-radio-group__dot", Xb = {
	kind: "radio",
	decorate: Zb
};
function Zb(e) {
	let t = document.createElement("input");
	t.className = Jb, t.type = "radio", t.value = e.key;
	let n = document.createElement("span");
	n.className = Yb, e.row.prepend(t, n);
}
//#endregion
//#region src/interactions/radio-group-sync-engine.ts
var Qb = "data-ui-radio-value", $b = "ui-radio-group", ex = "ui-radio-group__item", tx = "data-ui-radio-group-name", nx = "data-ui-radio-bind-value-id", rx = class {
	root;
	renamed = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.claimGroupNames([...this.root.querySelectorAll(`.${$b}`)]);
		for (let e of this.root.querySelectorAll(`.${$b}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = [];
			for (let n of e) {
				if (n.type === "attributes" && n.target instanceof HTMLElement) {
					this.sync(n.target.closest(`.${$b}`));
					continue;
				}
				if (!Cm(n)) for (let e of n.addedNodes) e instanceof HTMLElement && t.push(e);
			}
			this.claimGroupNames(t.flatMap(ix));
			for (let e of new Set(t.map((e) => e.closest(`.${$b}`)))) this.sync(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: [Qb, "class"],
			childList: !0,
			subtree: !0
		});
	}
	claimGroupNames(e) {
		if (e.length === 0) return;
		let t = /* @__PURE__ */ new Map();
		for (let e of this.root.querySelectorAll(`.${$b}`)) {
			let n = e.getAttribute(tx);
			n !== null && t.set(n, (t.get(n) ?? 0) + 1);
		}
		let n = /* @__PURE__ */ new Set();
		for (let r of e) {
			let e = r.getAttribute(tx), i = e === null ? 0 : t.get(e) ?? 0;
			if (e === null || i < 2) continue;
			t.set(e, i - 1), n.add(e);
			let a = `${e}-${++this.renamed}`;
			r.setAttribute(tx, a);
			for (let e of Vl(r, `.${Jb}`, `.${$b}`)) e.name = a;
			this.sync(r);
		}
		if (n.size !== 0) for (let e of this.root.querySelectorAll(`.${$b}`)) n.has(e.getAttribute(tx) ?? "") && this.sync(e);
	}
	sync(e) {
		if (e === null) return;
		let t = e.getAttribute(Qb), n = e.getAttribute(tx), r = e.getAttribute(nx);
		for (let i of Vl(e, `.${Jb}`, `.${$b}`)) {
			n !== null && i.name !== n && (i.name = n), r !== null && i.getAttribute("data-ui-bind-value") !== r && i.setAttribute(Ze, r), i.checked = i.value === t;
			let e = ax(i);
			i.disabled !== e && (i.disabled = e);
		}
	}
};
function ix(e) {
	return e.classList.contains($b) ? [e] : [...e.querySelectorAll(`.${$b}`)];
}
function ax(e) {
	let t = e.closest(`.${ex}`);
	return t !== null && A(t);
}
//#endregion
//#region src/rendering/color-bytes.ts
function ox(e) {
	return Number.isFinite(e) ? Math.min(255, Math.max(0, Math.round(e))) : 0;
}
function sx(e) {
	return ox(e).toString(16).padStart(2, "0").toUpperCase();
}
function cx(e, t, n, r) {
	let i = r / 255, a = (e) => Math.round(e * i + 255 * (1 - i));
	return (lx(a(e), a(t), a(n)) + .05) ** 2 > 1.05 * .05 ? "var(--ui-color-on-light)" : "var(--ui-color-on-dark)";
}
function lx(e, t, n) {
	return .2126 * ux(e) + .7152 * ux(t) + .0722 * ux(n);
}
function ux(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
//#endregion
//#region src/rendering/inline-markup.ts
var dx = {
	None: 0,
	Bold: 1,
	Italic: 2,
	Underline: 4,
	Strikethrough: 8,
	Code: 16
}, fx = "\\", px = "`", mx = "!", hx = "{", gx = "}", _x = "ui-text__fold", vx = "ui-text__fold-toggle", yx = "ui-text__fold-content", bx = 8;
function xx(e) {
	if (e == null || e.length === 0) return [];
	let t = [], n = { value: "" };
	return Nx(new Hx(e), 0, e.length, dx.None, null, t, n), Px(t, n, dx.None, null), t;
}
function Sx(e) {
	return xx(e).map((e) => Dx(e) ? `${e.fold} ${Sx(e.text)}` : e.text).join("");
}
function Cx(e) {
	let t = "";
	for (let n of e) t += Gx(n) ? fx + n : n;
	return t;
}
function wx(e, t, n = {}) {
	let r = xx(t), i = r.some(Dx);
	if (e.hasAttribute("data-ui-folds") !== i && e.toggleAttribute(qe, i), r.length === 0) {
		e.textContent = "";
		return;
	}
	if (r.length === 1 && Tx(r[0])) {
		e.textContent = r[0].text;
		return;
	}
	e.replaceChildren(Ox(r, n));
}
function Tx(e) {
	return e.styles === dx.None && e.url === null && !Ex(e) && !Dx(e);
}
function Ex(e) {
	return e.icon !== null && e.icon !== void 0 && e.icon.length > 0;
}
function Dx(e) {
	return e.fold !== null && e.fold !== void 0;
}
function Ox(e, t) {
	let n = document.createDocumentFragment();
	for (let r of e) n.append(kx(r, t));
	return n;
}
function kx(e, t) {
	if (Ex(e)) return jx(e.icon);
	let n = Dx(e) ? Ax(e, t) : document.createTextNode(e.text);
	if ((e.styles & dx.Code) !== 0) {
		let e = document.createElement("code");
		e.className = "ui-text__code", e.append(n), n = e;
	}
	if ((e.styles & dx.Strikethrough) !== 0 && (n = Mx("s", n)), (e.styles & dx.Underline) !== 0 && (n = Mx("u", n)), (e.styles & dx.Italic) !== 0 && (n = Mx("em", n)), (e.styles & dx.Bold) !== 0 && (n = Mx("strong", n)), e.url !== null) {
		let t = document.createElement("a");
		t.setAttribute("href", e.url), t.className = "ui-text__link", Sh(e.url) && (t.setAttribute("target", "_blank"), t.setAttribute("rel", "noopener noreferrer")), t.append(n), n = t;
	}
	return n;
}
function Ax(e, t) {
	let n = document.createElement("span"), r = document.createElement(t.staticFolds === !0 ? "span" : "button"), i = document.createElement("span");
	return n.className = t.staticFolds === !0 ? `${_x} ${_x}--static` : _x, r.className = vx, r.textContent = e.fold ?? "", i.className = yx, i.append(Ox(xx(e.text), t)), t.staticFolds === !0 ? (n.append(r, " ", i), n) : (r.setAttribute("type", "button"), r.setAttribute("aria-expanded", "false"), r.setAttribute($e, ""), n.append(r, i), n);
}
function jx(e) {
	let t = document.createElement("i");
	return t.className = "ui-text__icon-inline", zh(t, e), t.setAttribute("aria-hidden", "true"), t;
}
function Mx(e, t) {
	let n = document.createElement(e);
	return n.append(t), n;
}
function Nx(e, t, n, r, i, a, o) {
	let s = e.text, c = t;
	for (; c < n;) {
		let t = s[c];
		if (t === fx && c + 1 < n && Gx(s[c + 1])) {
			o.value += s[c + 1], c += 2;
			continue;
		}
		let l = Fx(e, c, n);
		if (l !== null) {
			Px(a, o, r, i), Ix(s, c + 1, l, o), Px(a, o, r | dx.Code, i), c = l + 1;
			continue;
		}
		let u = zx(e, c, n);
		if (u !== null) {
			Px(a, o, r, i), Nx(e, c + u.markerLength, u.contentEnd, r | u.style, i, a, o), Px(a, o, r | u.style, i), c = u.contentEnd + u.markerLength;
			continue;
		}
		let d = Lx(e, c, n);
		if (d !== null) {
			Px(a, o, r, i), a.push({
				text: "",
				styles: r,
				url: i,
				icon: d.name
			}), c = d.iconEnd;
			continue;
		}
		let f = i === null ? Bx(e, c, n) : null;
		if (f !== null) {
			Px(a, o, r, i), Nx(e, f.labelStart, f.labelEnd, r, f.url, a, o), Px(a, o, r, f.url), c = f.linkEnd;
			continue;
		}
		let p = Vx(e, c, n);
		if (p !== null) {
			Px(a, o, r, i), a.push({
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
function Px(e, t, n, r) {
	t.value.length !== 0 && (e.push({
		text: t.value,
		styles: n,
		url: r
	}), t.value = "");
}
function Fx(e, t, n) {
	let r = e.text;
	if (r[t] !== px) return null;
	let i = t + 1;
	if (i >= n || Kx(r[i])) return null;
	let a = e.findClosingMarker(i, n, px, 1);
	return a > i ? a : null;
}
function Ix(e, t, n, r) {
	for (let i = t; i < n; i++) {
		if (e[i] === fx && i + 1 < n && Gx(e[i + 1])) {
			r.value += e[i + 1], i++;
			continue;
		}
		r.value += e[i];
	}
}
function Lx(e, t, n) {
	let r = e.text;
	if (r[t] !== mx || t + 1 >= n || r[t + 1] !== "[") return null;
	let i = t + 2, a = e.findClosingBracket(i, n);
	if (a <= i) return null;
	let o = r.slice(i, a);
	return Rx(o) ? {
		name: o,
		iconEnd: a + 1
	} : null;
}
function Rx(e) {
	return e.length > 0 && /^[A-Za-z0-9._-]+$/.test(e);
}
function zx(e, t, n) {
	let r = e.text, i = r[t];
	if (i !== "*" && i !== "_" && i !== "~") return null;
	let a = t + 1 < n && r[t + 1] === i, o, s;
	if (i === "*" && a) o = dx.Bold, s = 2;
	else if (i === "*") o = dx.Italic, s = 1;
	else if (i === "_" && a) o = dx.Underline, s = 2;
	else if (i === "~" && a) o = dx.Strikethrough, s = 2;
	else return null;
	let c = t + s;
	if (c >= n || Kx(r[c])) return null;
	let l = e.findClosingMarker(c, n, i, s);
	return l > c ? {
		style: o,
		markerLength: s,
		contentEnd: l
	} : null;
}
function Bx(e, t, n) {
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
function Vx(e, t, n) {
	let r = e.text;
	if (r[t] !== "[") return null;
	let i = e.findClosingBracket(t + 1, n);
	if (i <= t + 1 || i + 1 >= n || r[i + 1] !== hx || e.hasOpeningBracket(t + 1, i)) return null;
	let a = i + 1, o = a + 1, s = e.findMatchingBrace(a, n);
	if (s <= o || e.braceDepth(a) > bx) return null;
	let c = { value: "" };
	return Ix(r, t + 1, i, c), {
		caption: c.value,
		contentStart: o,
		contentEnd: s
	};
}
var Hx = class {
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
		return this.closeBrackets ??= this.next("]", !0), Ux(this.closeBrackets[e], t);
	}
	hasOpeningBracket(e, t) {
		return this.openBrackets ??= this.next("[", !0), Ux(this.openBrackets[e], t) >= 0;
	}
	findClosingParen(e, t) {
		return this.closeParens ??= this.next(")", !1), Ux(this.closeParens[e], t);
	}
	findMatchingBrace(e, t) {
		return Ux(this.braces()[e], t);
	}
	braceDepth(e) {
		return this.braces(), this.braceDepths[e];
	}
	findClosingMarker(e, t, n, r) {
		let i = Wx(n, r), a = this.closers[i] ?? this.buildClosers(n, r);
		this.closers[i] = a;
		let o = a[e + 1];
		if (r === 2) return o >= 0 && o + 1 < t ? o : -1;
		if (o >= 0 && o < t - 1) return o;
		let s = t - 1;
		return s > e && this.text[s] === n && !this.isEscaped(s) && !Kx(this.text[s - 1]) ? s : -1;
	}
	readLinkUrl(e, t) {
		if (this.linkLabel !== e) {
			let n = this.text.slice(e + 2, t).trim();
			this.linkLabel = e, this.linkUrl = yh(n) ? n : null;
		}
		return this.linkUrl;
	}
	isEscaped(e) {
		if (this.escaped === null) {
			let e = new Uint8Array(this.text.length);
			for (let t = 1; t < this.text.length; t++) e[t] = +(this.text[t - 1] === fx && e[t - 1] === 0);
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
			if (this.text[r] === hx) n.push(r);
			else if (this.text[r] === gx && n.length > 0) {
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
		if (e === 0 || this.text[e] !== t || this.isEscaped(e) || Kx(this.text[e - 1])) return !1;
		let r = e + 1 < this.text.length && this.text[e + 1] === t;
		return n === 2 ? r : !r;
	}
};
function Ux(e, t) {
	return e >= 0 && e < t ? e : -1;
}
function Wx(e, t) {
	switch (e) {
		case "*": return t === 2 ? 0 : 1;
		case "_": return 2;
		case "~": return 3;
		default: return 4;
	}
}
function Gx(e) {
	return e === "*" || e === "_" || e === "~" || e === "[" || e === "]" || e === "(" || e === ")" || e === hx || e === gx || e === px || e === fx;
}
function Kx(e) {
	return e === " " || e === "	" || e === "\r" || e === "\n";
}
//#endregion
//#region src/rendering/web-dom-converters.ts
var qx = /* @__PURE__ */ new Map([
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
]), Jx = [
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
function Yx(e) {
	return W(e, Jx);
}
var Xx = [
	"small",
	"medium",
	"large"
], Zx = ["default", "circle"], Qx = [
	"display",
	"title",
	"subtitle",
	"body",
	"caption",
	"overline"
], $x = [
	"start",
	"center",
	"end",
	"justify"
], eS = ["nowrap", "wrap"], tS = /* @__PURE__ */ new Map([
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
]), nS = /* @__PURE__ */ new Map([
	["primary", "--ui-color-primary-ink"],
	["accent", "--ui-color-accent-ink"],
	["info", "--ui-color-info-ink"],
	["warning", "--ui-color-warning-ink"],
	["success", "--ui-color-success-ink"],
	["danger", "--ui-color-danger-ink"]
]), rS = /* @__PURE__ */ new Map([
	["primary", "--ui-color-on-primary"],
	["accent", "--ui-color-on-accent"],
	["info", "--ui-color-on-info"],
	["warning", "--ui-color-on-warning"],
	["success", "--ui-color-on-success"],
	["danger", "--ui-color-on-danger"],
	["muted", "--ui-color-surface"]
]), iS = ["inline", "trailing"], aS = [
	"filled",
	"outline",
	"underline",
	"ghost",
	"tonal"
], oS = [
	"small",
	"medium",
	"large"
], sS = [
	"small",
	"medium",
	"large"
], cS = [
	"primary",
	"accent",
	"danger",
	"outline",
	"ghost",
	"link",
	"surface"
], lS = [
	"primary",
	"accent",
	"info",
	"warning",
	"success",
	"danger",
	"surface",
	"plain"
], uS = [
	"filled",
	"tinted",
	"outline"
], dS = ["light", "dark"], fS = [
	"start",
	"center",
	"end",
	"stretch"
], pS = ["clip", "visible"], mS = [
	"visible",
	"hidden",
	"collapsed"
], hS = [
	"background",
	"raised",
	"tinted",
	"flat"
], gS = ["horizontal", "vertical"], _S = [
	"none",
	"gap",
	"rule"
], vS = [
	"none",
	"one",
	"many"
], yS = [
	"none",
	"left",
	"right",
	"top",
	"bottom"
], bS = ["stack", "wrap"], xS = ["end", "start"], SS = [
	"disabled",
	"auto",
	"always"
], CS = [
	"disabled",
	"proximity",
	"mandatory"
], wS = [
	"text",
	"email",
	"password",
	"search",
	"tel",
	"url"
], TS = [
	"text",
	"numeric",
	"decimal",
	"tel",
	"email",
	"url",
	"search"
], ES = ["hex", "rgb"], DS = ["field", "swatch"], OS = [
	"fill",
	"contain",
	"cover",
	"none"
], kS = [
	"100% 100%",
	"contain",
	"cover",
	"auto"
], AS = ["default", "circle"], jS = ["card", "quiet"], MS = ["uniform", "vignette"], NS = ["linear", "circular"], PS = [
	"none",
	"vertical",
	"horizontal",
	"both"
], FS = [
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
], IS = [
	"None",
	"Shade",
	"Tint"
], LS = /* @__PURE__ */ new Map();
function RS(e) {
	return LS.get(e);
}
function U(e, t, n) {
	return VS(e, zS(t, n), (e) => `${t}${W(e, n)}`);
}
function zS(e, t) {
	return BS(t.map((t) => `${e}${t}`));
}
function BS(e) {
	let t = new Set(e);
	return (e) => t.has(e);
}
function VS(e, t, n) {
	return LS.set(e, t), [e, n];
}
function HS(e, t, n) {
	return fp.map((r) => [`${e}${r[0].toUpperCase()}${r.slice(1)}${t}`, (e) => n(e, r)]);
}
var US = new Map([
	U("colorClass", "ui-color--", Jx),
	VS("themeColorClass", zS("ui-color--", Jx), (e) => OC(e)),
	VS("iconClass", Vh, (e) => Hh(e)),
	["iconUrlCss", (e) => Ph(e)],
	["safeUrl", (e) => bh(e)],
	["safeImageSource", (e) => kh(e)],
	["inlineMarkupPlainText", (e) => e == null ? void 0 : Sx(String(e))],
	["ariaBooleanAttribute", (e) => e === !0 ? "true" : "false"],
	["placeholderText", (e) => typeof e == "string" && e.length > 0 ? e : " "],
	U("iconSizeClass", "ui-icon-size--", Xx),
	VS("iconShapeClass", BS(["ui-icon--circle"]), (e) => W(e, Zx) === "circle" ? "ui-icon--circle" : ""),
	U("textTypeClass", "ui-text-type--", Qx),
	VS("textAppearanceClass", zS("ui-text-type--", Qx), (e) => RC(e, "ui-text-type--")),
	VS("textDescriptionTypeClass", zS("ui-text--description-", Qx), (e) => RC(e, "ui-text--description-")),
	U("textAlignmentClass", "ui-text--align-", $x),
	U("textWrapClass", "ui-text--", eS),
	U("buttonAlignmentClass", "ui-button--align-", $x),
	U("textBadgePlacementHostClass", "ui-text--badge-", iS),
	U("badgeStyleClass", "ui-badge-style--", lS),
	U("badgeFillClass", "ui-badge-fill--", uS),
	VS("badgeColoredClass", BS(["ui-badge--colored"]), (e) => yC(e).length > 0 ? "ui-badge--colored" : ""),
	["badgeTextFit", (e) => kC(e)],
	U("buttonClass", "ui-button--", cS),
	U("surfaceStyleClass", "ui-surface--", hS),
	U("orientationClass", "ui-orientation--", gS),
	U("groupSeparatorClass", "ui-command-bar--separator-", _S),
	["selectionModeAttribute", (e) => W(e, vS)],
	["selectionBackgroundCss", (e) => yC(gC(e, "background"))],
	["selectionForegroundCss", (e) => yC(gC(e, "foreground"))],
	["selectionMarkColorCss", (e) => yC(gC(e, "markColor"))],
	["selectionMarkCss", (e) => vC(gC(e, "mark"))],
	["selectionFontWeightCss", (e) => _C(gC(e, "bold"))],
	["selectionActionBarBackgroundCss", (e) => yC(gC(e, "actionBarBackground"))],
	U("itemsViewLayoutClass", "ui-items-view--", bS),
	U("dragHandlePlacementClass", "ui-drag-handle--", xS),
	U("scrollXClass", "ui-scroll-x--", SS),
	U("scrollYClass", "ui-scroll-y--", SS),
	["hostViewport", (e) => iC(e)],
	U("scrollSnapClass", "ui-scroll-snap--", CS),
	U("inputAppearanceClass", "ui-input--", aS),
	U("inputSizeClass", "ui-input--", sS),
	U("buttonSizeClass", "ui-button--", oS),
	U("buttonGroupSizeClass", "ui-button-group--", oS),
	["textInputTypeAttribute", (e) => W(e, wS)],
	["inputModeAttribute", (e) => W(e, TS)],
	["colorTextFormatAttribute", (e) => W(e, ES)],
	["colorInputVariantAttribute", (e) => W(e, DS)],
	["themeNameCss", (e) => W(e, dS)],
	["alignmentCss", (e) => W(e, fS)],
	["alignmentStretchFallbackCss", (e) => W(e, fS) === "stretch" ? "start" : ""],
	["overflowCss", (e) => W(e, pS)],
	["layoutLengthCss", (e) => aC(e)],
	["thicknessCss", (e) => cC(e)],
	VS("borderNoneClass", BS(["ui-border--none"]), (e) => dC(e)),
	["radiusCss", (e) => fC(e)],
	["gridUnitCss", (e) => pC(e)],
	["pixelsCss", (e) => JC(e)],
	["gridTemplateCss", (e) => mC(e)],
	["colorVariantCss", (e) => HC(e)],
	["themeColorCss", (e) => yC(e)],
	["themeInkCss", (e) => xC(e)],
	["roleInkCss", (e) => SC(e)],
	["themeOnColorCss", (e) => wC(e)],
	["themeGroundCss", (e) => TC(e)],
	["themeColorInlineCss", (e) => bC(e) ? "" : yC(e)],
	["themeColorCanonical", (e) => BC(e)],
	["textAppearanceFontSizeCss", (e) => zC(e, "size")],
	["textAppearanceFontWeightCss", (e) => zC(e, "weight")],
	["textAppearanceLineHeightCss", (e) => zC(e, "lineHeight")],
	["textAppearanceLetterSpacingCss", (e) => zC(e, "letterSpacing")],
	...HS("responsiveLayoutLength", "Css", (e, t) => aC(vp(e, t))),
	...HS("responsiveWidth", "Css", (e, t) => oC(vp(e, t), "horizontal")),
	...HS("responsiveHeight", "Css", (e, t) => oC(vp(e, t), "vertical")),
	...HS("responsiveThickness", "Css", (e, t) => cC(vp(e, t))),
	...HS("responsivePadding", "Css", (e, t) => lC(vp(e, t))),
	...HS("responsiveThicknessHorizontal", "Css", (e, t) => uC(vp(e, t), "horizontal")),
	...HS("responsiveThicknessVertical", "Css", (e, t) => uC(vp(e, t), "vertical")),
	...HS("responsiveRadius", "Css", (e, t) => fC(vp(e, t))),
	...HS("responsivePixels", "Css", (e, t) => YC(vp(e, t))),
	...HS("visibility", "Attribute", (e, t) => XC(e, t)),
	...HS("gridPlacement", "ColumnCss", (e, t) => hC(vp(e, t), "column")),
	...HS("gridPlacement", "RowCss", (e, t) => hC(vp(e, t), "row")),
	...HS("gridPlacement", "ColumnSpanCss", (e, t) => hC(vp(e, t), "columnSpan")),
	...HS("gridPlacement", "RowSpanCss", (e, t) => hC(vp(e, t), "rowSpan")),
	U("imageFitClass", "ui-image-fit--", OS),
	VS("expanderVariantClass", BS(["ui-expander--quiet"]), (e) => W(e, jS) === "quiet" ? "ui-expander--quiet" : ""),
	VS("imageShapeClass", BS(["ui-image--circle"]), (e) => W(e, AS) === "circle" ? "ui-image--circle" : ""),
	["backgroundImageCss", (e) => JS(e)],
	["backgroundImageAttribute", (e) => JS(e).length === 0 ? void 0 : ""],
	["imageFitSizeCss", (e) => W(e, kS)],
	["backgroundImageDimCss", (e) => YS(e)],
	["backgroundImageDimModeAttribute", (e) => W(e, MS) === "vignette" ? "vignette" : void 0],
	["backgroundImageBlurCss", (e) => $S(e) ? `${Number(e)}px` : ""],
	["backgroundImageBlurAttribute", (e) => $S(e) ? "" : void 0],
	["positiveCount", (e) => XS(e)?.toString()],
	["nonNegativeCount", (e) => ZS(e, (e) => e >= 0)?.toString()],
	["nonZeroCount", (e) => ZS(e, (e) => e !== 0)?.toString()],
	["positiveNumber", (e) => QS(e, (e) => e > 0)?.toString()],
	["nonNegativeNumber", (e) => QS(e, (e) => e >= 0)?.toString()],
	["share", (e) => QS(e, (e) => e >= 0 && e <= 1)?.toString()],
	["positiveFlagAttribute", (e) => XS(e) === void 0 ? void 0 : ""],
	VS("maxLinesClass", BS(["ui-text--max-lines"]), (e) => XS(e) === void 0 ? "" : "ui-text--max-lines"),
	U("progressVariantClass", "ui-progress--", NS),
	["progressValueText", (e) => qC(e)],
	["textAreaResizeCss", (e) => W(e, PS)],
	U("flyoutPlacementClass", "ui-flyout--", FS),
	["popupPlacementAttribute", (e) => W(e, FS)],
	["tabMenuEntriesAttribute", (e) => KS(e)],
	["markedDaysAttribute", (e) => qS(e)]
]);
function WS(e) {
	let t = US.get("surfaceStyleClass");
	return hS.find((n, r) => e.classList.contains(t?.(r) ?? "")) ?? null;
}
var GS = [
	["rename", 1],
	["pin", 2],
	["close", 4],
	["delete", 8]
];
function KS(e) {
	let t = typeof e == "string" ? e.split(",").map((e) => e.trim().toLowerCase()) : null, n = typeof e == "number" ? e : 0, r = GS.filter(([e, r]) => t === null ? (n & r) !== 0 : t.includes(e)).map(([e]) => e);
	return r.length === 0 ? void 0 : r.join(" ");
}
function qS(e) {
	let t = Array.isArray(e) ? e.filter((e) => typeof e == "string" && e.length > 0).map((e) => e.slice(0, 10)) : [];
	return t.length === 0 ? void 0 : [...new Set(t)].sort().join(" ");
}
function JS(e) {
	return Ph(e);
}
function YS(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isNaN(t) ? "" : String(Math.min(1, Math.max(0, t)));
}
function XS(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isInteger(t) && t > 0 ? t : void 0;
}
function ZS(e, t) {
	let n = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isInteger(n) && t(n) ? n : void 0;
}
function QS(e, t) {
	let n = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isFinite(n) && t(n) ? n : void 0;
}
function $S(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isFinite(t) && t > 0;
}
var eC = [
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
], tC = new Map(eC.map(([, e, t, n, r]) => [e, [
	t,
	n,
	r
]])), nC = new Map(eC.map(([e, t]) => [e, t])), rC = /* @__PURE__ */ new Map([[pS, /* @__PURE__ */ new Map([["Hidden", "clip"]])], [kS, /* @__PURE__ */ new Map([["Fill", "100% 100%"], ["None", "auto"]])]]);
function W(e, t) {
	return typeof e == "string" ? (t === void 0 ? void 0 : rC.get(t)?.get(e)) ?? qx.get(e) ?? Li(e) : typeof e == "number" && t !== void 0 ? t[e] ?? String(e) : String(e ?? "");
}
function iC(e) {
	return e == null || W(e, SS) === "disabled" ? void 0 : "parent";
}
function aC(e) {
	if (e == null) return "";
	if (typeof e == "number") return JC(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.kind, r = t.value ?? 0;
	return n === "Auto" || n === 0 ? "" : n === "Absolute" || n === 1 ? JC(r) : n === "Fill" || n === 2 ? "100%" : "";
}
function oC(e, t) {
	if (typeof e != "object" || !e) return aC(e);
	let n = e.kind;
	return n !== "Fill" && n !== 2 ? aC(e) : t === "horizontal" ? "var(--ui-fill-width, 100%)" : "var(--ui-fill-height, 100%)";
}
function sC(e) {
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
function cC(e) {
	if (e == null) return "";
	let t = sC(e);
	return t === void 0 ? String(e) : `${t.top}px ${t.right}px ${t.bottom}px ${t.left}px`;
}
function lC(e) {
	let t = e == null ? void 0 : sC(e);
	return t === void 0 ? "" : `${t.top}px max(${t.right}px, var(--ui-scroll-room-right), var(--ui-scroll-cap)) max(${t.bottom}px, var(--ui-scroll-room-x)) max(${t.left}px, var(--ui-scroll-room-left), var(--ui-scroll-cap))`;
}
function uC(e, t) {
	let n = sC(e);
	return n === void 0 ? "" : JC(t === "horizontal" ? n.left + n.right : n.top + n.bottom);
}
function dC(e) {
	if (e == null) return "";
	if (typeof e == "object" && "base" in e) return fp.map((t) => vp(e, t)).filter((e) => e != null).every((e) => dC(e) !== "") ? "ui-border--none" : "";
	let t = sC(e);
	return t !== void 0 && t.top === 0 && t.right === 0 && t.bottom === 0 && t.left === 0 ? "ui-border--none" : "";
}
function fC(e) {
	if (e == null) return "";
	if (typeof e == "number") return JC(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.topLeft ?? 0, r = t.topRight ?? 0, i = t.bottomRight ?? 0, a = t.bottomLeft ?? 0;
	return n === r && n === i && n === a ? JC(n) : `${n}px ${r}px ${i}px ${a}px`;
}
function pC(e) {
	if (e == null) return "";
	if (typeof e == "number") return e <= 0 ? "minmax(0, 1fr)" : `minmax(0, ${e}fr)`;
	if (typeof e != "object") return String(e);
	let t = e, n = t.unit, r = t.value ?? 1, i = t.minValue, a = t.maxValue;
	if (n === "Absolute" || n === 1) return JC(r);
	if (n === "Star" || n === 0) {
		let e = i != null && i > 0 ? `${i}px` : "0";
		return r <= 0 ? `minmax(${e}, 1fr)` : `minmax(${e}, ${r}fr)`;
	}
	return n === "Auto" || n === 2 ? i == null ? a == null ? "auto" : `fit-content(${a}px)` : `minmax(${i}px, auto)` : "";
}
function mC(e) {
	if (e == null) return "";
	if (!Array.isArray(e)) return pC(e);
	if (e.length === 0) return "none";
	if (e.length === 1) return pC(e[0]);
	let t = JSON.stringify(e[0]);
	return e.every((e) => JSON.stringify(e) === t) ? `repeat(${e.length}, ${pC(e[0])})` : e.map((e) => pC(e)).join(" ");
}
function hC(e, t) {
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
function gC(e, t) {
	return typeof e != "object" || !e ? null : e[t] ?? null;
}
function _C(e) {
	return e == null ? "" : e === !0 ? "600" : "400";
}
function vC(e) {
	if (e == null) return "";
	switch (W(e, yS)) {
		case "left": return "inset 2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "right": return "inset -2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "top": return "inset 0 2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "bottom": return "inset 0 -2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		default: return "none";
	}
}
function yC(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	if (VC(e)) return HC(e);
	let t = e, n = HC(t.light), r = HC(t.dark), i = n.length > 0 ? n : r, a = r.length > 0 ? r : n;
	if (i.length > 0 && a.length > 0) return i === a ? i : `light-dark(${i}, ${a})`;
	let o = t.style;
	if (o == null) return "";
	let s = tS.get(W(o, Jx));
	return s ? `var(${s})` : "";
}
function bC(e) {
	if (typeof e != "object" || !e || VC(e)) return !1;
	let t = e;
	return t.light == null && t.dark == null && t.style != null;
}
function xC(e) {
	if (bC(e)) {
		let t = nS.get(W(e.style, Jx));
		if (t !== void 0) return `var(${t})`;
	}
	return yC(e);
}
function SC(e) {
	if (typeof e != "object" || !e || VC(e)) return "";
	let t = e;
	return t.light == null && t.dark == null ? xC(e) : "";
}
var CC = /* @__PURE__ */ new Set(["background", "surface"]);
function wC(e) {
	if (typeof e != "object" || !e) return "";
	if (VC(e)) return EC(e) ? "initial" : DC(e);
	let t = e, n = DC(t.light ?? t.dark), r = DC(t.dark ?? t.light);
	if (n.length > 0 && r.length > 0 && EC(t.light ?? t.dark) && EC(t.dark ?? t.light)) return "initial";
	if (n.length > 0 && r.length > 0) return n === r ? n : `light-dark(${n}, ${r})`;
	if (t.style === null || t.style === void 0) return "";
	let i = W(t.style, Jx);
	if (CC.has(i)) return "initial";
	let a = rS.get(i);
	return a ? `var(${a})` : "";
}
function TC(e) {
	if (typeof e == "object" && e) {
		let t = e;
		if (VC(e) ? EC(e) : EC(t.light ?? t.dark) && EC(t.dark ?? t.light)) return "inherit";
	}
	return yC(e);
}
function EC(e) {
	return UC(e)?.[3] === 0;
}
function DC(e) {
	let t = UC(e);
	return t === void 0 ? "" : cx(t[0], t[1], t[2], t[3]);
}
function OC(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.light != null || t.dark != null) return "";
	let n = t.style;
	return n == null ? "" : `ui-color--${W(n, Jx)}`;
}
function kC(e) {
	let t = NC(e == null ? "" : String(e).trim(), AC + 1);
	return t > 0 && t <= AC ? "compact" : "";
}
var AC = 2, jC = /[\u0300-\uFFFF]/, MC = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function NC(e, t) {
	if (!jC.test(e)) return e.length;
	let n = 0;
	for (let { segment: r } of MC.segment(e)) {
		if (n >= t) break;
		n += PC(r) ? 2 : 1;
	}
	return n;
}
function PC(e) {
	if (e.includes("️")) return !0;
	let t = e.codePointAt(0) ?? 0;
	for (let e = 0; e < FC.length; e += 2) if (t >= FC[e] && t <= FC[e + 1]) return !0;
	return !1;
}
var FC = [
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
function IC(e, t) {
	LC(e, String(t));
}
function LC(e, t) {
	let n = e.querySelector(".ui-badge__text");
	n !== null && (n.textContent = t), e.setAttribute(We, kC(t)), e.setAttribute(Ge, "");
}
function RC(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size != null) return "";
	let r = n.role;
	return r == null ? "" : `${t}${W(r, Qx)}`;
}
function zC(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size == null) return "";
	switch (t) {
		case "size": return JC(n.size);
		case "weight": {
			let e = n.weight;
			return e == null ? "" : String(e);
		}
		case "lineHeight": {
			let e = n.lineHeight;
			return e == null ? "" : JC(e);
		}
		case "letterSpacing": {
			let e = n.letterSpacing;
			return e == null ? "" : JC(e);
		}
		default: return "";
	}
}
function BC(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return "";
	let t = e, n = WC(t.style);
	if (n !== null) return `@${n}`;
	let r = t.light ?? t.dark;
	if (r == null) return "";
	if (typeof r.rgb == "number") {
		let e = r.opacity ?? 255, t = `#${sx(r.rgb >> 16 & 255)}${sx(r.rgb >> 8 & 255)}${sx(r.rgb & 255)}`;
		return e === 255 ? t : `${t}${sx(e)}`;
	}
	let i = GC(r.name);
	return i === null ? "" : `${i}/${KC(r.adjustment) ?? "None"}/${r.factor ?? 0}/${r.opacity ?? 255}`;
}
function VC(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.name !== void 0 || t.rgb !== void 0;
}
function HC(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	let t = UC(e);
	return t === void 0 ? "" : `#${sx(t[0])}${sx(t[1])}${sx(t[2])}${sx(t[3])}`;
}
function UC(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = typeof t.rgb == "number" ? [
		t.rgb >> 16 & 255,
		t.rgb >> 8 & 255,
		t.rgb & 255
	] : void 0, r = GC(t.name), i = n ?? (r === null ? void 0 : tC.get(r));
	if (!i) return;
	let a = KC(t.adjustment), o = (t.factor ?? 0) / 10, s = t.opacity ?? 255, [c, l, u] = i;
	return a === "Shade" ? (c = ox(c * (1 - o)), l = ox(l * (1 - o)), u = ox(u * (1 - o))) : a === "Tint" && (c = ox(c + (255 - c) * o), l = ox(l + (255 - l) * o), u = ox(u + (255 - u) * o)), [
		c,
		l,
		u,
		s
	];
}
function WC(e) {
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	if (typeof e != "number") return null;
	let t = Jx[e];
	return t === void 0 ? null : t.split("-").map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join("");
}
function GC(e) {
	if (typeof e == "number") return nC.get(e) ?? null;
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	return null;
}
function KC(e) {
	if (typeof e == "number") return IS[e] ?? "None";
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? "None" : t;
	}
	return "None";
}
function qC(e) {
	if (e == null || e === "") return "";
	let t = typeof e == "number" ? e : Number(e);
	return Number.isFinite(t) ? String(t) : "";
}
function JC(e) {
	return `${typeof e == "number" ? e : Number(e ?? 0)}px`;
}
function YC(e) {
	return e == null ? "" : JC(e);
}
function XC(e, t) {
	let n = yp(e, t);
	if (n == null) return;
	let r = W(n, mS);
	return r === "visible" ? void 0 : r;
}
//#endregion
//#region src/interactions/search-input-engine.ts
var ZC = "data-ui-search-debounce", QC = "data-ui-search-min-length", $C = "data-ui-search-manual", ew = "data-ui-search-answered", tw = "ui-search__input", nw = "ui-select__list", rw = "ui-select__option", iw = 300, aw = class {
	root;
	pauses;
	constructor(e = {}) {
		this.root = e.root ?? document, this.pauses = new ib(this.root), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("compositionend", (e) => this.handleInput(e), !0), this.root.addEventListener("keydown", (e) => this.handleEnter(e), !0);
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(tw) || e.isComposing === !0) return;
		let t = e.target;
		sw(t);
		let n = t.getAttribute(ZC), r = n === null ? iw : Number(n);
		this.pauses.wait(t, Number.isFinite(r) && r >= 0 ? r : iw, () => this.commit(t));
	}
	handleEnter(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Enter" || e.defaultPrevented || M(e) || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(tw)) return;
		let t = e.target;
		e.preventDefault(), this.pauses.drop(t), this.commit(t, !0);
	}
	commit(e, t = !1) {
		e.dispatchEvent(new Event("change", { bubbles: !0 })), !(!t && e.hasAttribute($C)) && ow(e) && e.dispatchEvent(new Event("search", { bubbles: !0 }));
	}
};
function ow(e) {
	let t = Number(e.getAttribute(QC) ?? 0);
	return !Number.isFinite(t) || e.value.trim().length >= t;
}
function sw(e) {
	if (e.hasAttribute(ew)) return;
	let t = e.closest(`.${Ei}`), n = t?.querySelector(`.${nw}`);
	if (t == null || n == null) return;
	let r = ow(e) ? th(e.value, e) : [], i = cw(n, (e) => r.length === 0 || rh(nh(oh(e), e), r));
	dw(t, n, r.length > 0 && i === 0);
}
function cw(e, t) {
	let n = null, r = !1, i = 0;
	for (let a of e.children) {
		if (!(a instanceof HTMLElement)) continue;
		if (a.hasAttribute("data-ui-group-header")) {
			n !== null && lw(n, r), n = a, r = !1;
			continue;
		}
		if (!a.classList.contains(rw)) continue;
		let e = t(a);
		lw(a, e), r ||= e, e && i++;
	}
	return n !== null && lw(n, r), i;
}
function lw(e, t) {
	let n = t ? "" : "none";
	e.style.display !== n && (e.style.display = n);
}
function uw(e) {
	let t = e.querySelector(`.${nw}`);
	t !== null && dw(e, t, cw(t, (e) => e.style.display !== "none") === 0);
}
function dw(e, t, n) {
	let r = t.querySelector(`:scope > [${Ft}]`);
	if (!n) {
		r?.remove();
		return;
	}
	if (r !== null) return;
	let i = e.querySelector(`:scope > template[${Nt}]`);
	if (i === null) return;
	let a = i.content.cloneNode(!0).firstElementChild;
	a !== null && (a.setAttribute(Ft, ""), t.appendChild(a));
}
//#endregion
//#region src/interactions/type-ahead.ts
var fw = 500, pw = class {
	owner = null;
	typed = "";
	last = -Infinity;
	now;
	constructor(e = () => performance.now()) {
		this.now = e;
	}
	next(e) {
		let t = this.now();
		(e.owner !== this.owner || t - this.last > fw) && (this.typed = ""), this.owner = e.owner, this.last = t, this.typed += nh(e.character, e.context);
		let n = Array.from(this.typed), r = n.every((e) => e === n[0]), i = r ? n[0] : this.typed, a = e.entries.length, o = e.current === null ? -1 : e.entries.indexOf(e.current), s = r ? o + 1 : Math.max(o, 0);
		for (let t = 0; t < a; t++) {
			let n = e.entries[(s + t) % a];
			if (nh(e.words(n), e.context).trimStart().startsWith(i)) return n;
		}
		return null;
	}
};
function mw(e) {
	return M(e) || e.metaKey || Array.from(e.key).length !== 1 || !/\S/u.test(e.key) || (e.ctrlKey || e.altKey) && !e.getModifierState("AltGraph") ? null : e.key;
}
//#endregion
//#region src/interactions/select-interaction-engine.ts
var hw = "data-ui-select-value", gw = "data-ui-select-placement", _w = "ui-select--open", vw = "ui-select__trigger-content", yw = "data-ui-select-content", bw = "ui-select__placeholder", xw = "ui-input__affix-icon--prefix", Sw = "ui-select__popup", Cw = "ui-select__list", ww = "ui-select__option", Tw = "ui-select__value-input", Ew = "data-ui-select-clear", Dw = "ui-select--clearable", Ow = "ui-search", kw = "ui-search__input", Aw = "data-ui-active", jw = "data-ui-list-keyboard", Mw = /* @__PURE__ */ new Set([
	"ArrowDown",
	"ArrowUp",
	"Home",
	"End",
	"PageDown",
	"PageUp"
]), Nw = "ui-multi-select", Pw = "ui-multi-select__chips", Fw = "ui-multi-select__chip", Iw = "ui-multi-select__chip-label", Lw = "ui-multi-select__chip-remove", Rw = "ui-badge-select", zw = "ui-text__badge", Bw = "ui-badge", Vw = "ui-badge__icon", Hw = "ui-badge__text", Uw = "ui-badge-style--info ui-text-type--overline", Ww = "ui-text-type--overline", Gw = "data-ui-select-chip", Kw = "data-ui-select-chips", qw = "data-ui-select-max", Jw = "data-ui-select-free-text", Yw = "ui-multi-select__entry", Xw = "data-ui-select-tag-entry", Zw = [
	hw,
	ii,
	qw
], Qw = ["class", y], $w = [...Qw, "style"];
function eT(e) {
	return e === null || j(e) || k(e);
}
function tT(e) {
	return e.classList.contains(Nw);
}
function nT(e) {
	return e.classList.contains(Ow);
}
function rT(e) {
	return nT(e) ? e.querySelector(`.${kw}`) : null;
}
function iT(e) {
	return e.hasAttribute(Jw) ? e.querySelector(`:scope > .${Si} .${Yw}`) : null;
}
function aT(e) {
	return rT(e) ?? iT(e);
}
function oT(e) {
	return iT(e) ?? e.querySelector(".ui-select__trigger");
}
function sT(e) {
	let t = e.target instanceof HTMLInputElement && e.target.classList.contains(Yw) ? e.target : null, n = t?.closest(".ui-select") ?? null;
	return t === null || n === null ? null : {
		entry: t,
		select: n
	};
}
function cT(e) {
	return Vl(e, `.${Sw} .${ww}`, `.${Ei}`);
}
function lT(e) {
	let t = cT(e).filter((e) => !A(e));
	return t.find((e) => e === document.activeElement) ?? t.find((e) => e.hasAttribute(Aw)) ?? null;
}
function uT(e) {
	for (let t of Vl(e, `.${Cw}`, `.${Ei}`)) {
		let e = t.querySelector(`:scope > .${ww}[${Aw}]:not([${Zr}])`) !== null;
		t.hasAttribute(jw) !== e && t.toggleAttribute(jw, e);
	}
}
function dT(e) {
	return e === null ? null : oh(e);
}
function fT(e) {
	for (let t of [e, ...e.querySelectorAll("*")]) {
		t.removeAttribute(ie), t.removeAttribute(y), t.removeAttribute(oe), t.removeAttribute(ae);
		for (let e of t.getAttributeNames()) e.startsWith("data-ui-bind-") && t.removeAttribute(e);
	}
}
var pT = class {
	root;
	popups = new gg({
		show: ({ owner: e }) => e.classList.add(_w),
		hide: ({ owner: e }) => {
			e.classList.remove(_w), this.markActive(e, null);
			let t = e.querySelector(`.${Sw}`);
			t !== null && (t.style.minHeight = "");
		},
		closesOnTab: !0,
		sheetOnPhone: ({ owner: e }) => aT(e) === null
	});
	typeAhead = new pw();
	drawnKeys = /* @__PURE__ */ new WeakMap();
	validation;
	refusedEntries = /* @__PURE__ */ new WeakSet();
	optionWatch;
	watched = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation;
		let t = (e) => {
			let t = /* @__PURE__ */ new Set();
			for (let n of e) Cm(n) || AT(n, t);
			for (let e of t) this.sync(e);
		};
		this.optionWatch = this.root instanceof Node ? new MutationObserver(t) : null, this.root instanceof Node && new MutationObserver(t).observe(this.root, {
			attributes: !0,
			attributeFilter: Zw,
			childList: !0,
			subtree: !0
		});
		for (let e of this.root.querySelectorAll(`.${Ei}`)) this.sync(e);
		this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && (e.target.closest(`[${Ew}], .${Lw}`) !== null || yT(e.target)) && e.preventDefault();
		}, !0), window.addEventListener("input", (e) => this.handleEntryEdit(e), !0), window.addEventListener("compositionend", (e) => this.handleEntryEdit(e), !0), window.addEventListener("change", (e) => this.holdEntryDraft(e), !0), window.addEventListener("keydown", (e) => this.handleEntryEscape(e), !0), this.root.addEventListener("paste", (e) => this.handleEntryPaste(e), !0);
	}
	handleEntryEdit(e) {
		let t = this.holdEntryDraft(e);
		if (t === null || e.isComposing === !0) return;
		let { entry: n, select: r } = t;
		if (eT(r)) return;
		this.releaseRefusal(r);
		let i = zl(n.value);
		i.tags.length > 0 ? this.enterTyped(r, n, i.tags, i.rest) : this.suggest(r, n);
	}
	holdEntryDraft(e) {
		let t = sT(e);
		return t === null || this.root instanceof Node && !this.root.contains(t.select) ? null : (e.stopImmediatePropagation(), t);
	}
	handleEntryEscape(e) {
		let t = e instanceof KeyboardEvent && e.key === "Escape" && !e.defaultPrevented && !M(e) ? sT(e) : null;
		t === null || this.openSelect !== t.select || t.select.getAttribute(Xw) !== "first-suggestion" || !cT(t.select).some((e) => e.hasAttribute(Aw)) || (e.preventDefault(), this.markActive(t.select, null));
	}
	handleEntryPaste(e) {
		let t = sT(e), n = e.clipboardData?.getData("text") ?? "";
		if (t === null || eT(t.select) || !Ll(n)) return;
		let { entry: r, select: i } = t, a = r.selectionStart ?? r.value.length, o = r.selectionEnd ?? a;
		e.preventDefault(), this.releaseRefusal(i), this.enterTyped(i, r, Rl(r.value.slice(0, a) + n + r.value.slice(o)), "");
	}
	enterTyped(e, t, n, r) {
		let i = jl(e.getAttribute(ii)), a = Ml(e.getAttribute(qw)), o = Bl(i, n.map((t) => ({
			text: t,
			key: bT(e, t) ?? t
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
		sw(t);
		let n = t.value.trim().length > 0, r = n ? hT(e) : [], i = r.find((e) => e.getAttribute("aria-selected") !== "true") ?? null;
		this.openSelect === e ? r.length > 0 || !n ? this.popups.reposition(e) : this.close() : r.length > 0 && this.toggle(e, !0), this.openSelect === e && e.getAttribute(Xw) === "first-suggestion" && (this.markActive(e, i), i !== null && _T(e, i));
	}
	get openSelect() {
		return this.popups.current;
	}
	sync(e) {
		if (this.watchOptions(e), uT(e), tT(e)) {
			this.syncMultiple(e);
			return;
		}
		let t = e.getAttribute(hw);
		this.decorateOptions(e);
		let n = t === null ? null : cT(e).find((e) => e.getAttribute("data-ui-key") === t) ?? null, r = this.renderTriggerContent(e, n, t), i = e.querySelector(`.${bw}`);
		i !== null && (i.style.display = r ? "none" : "");
		for (let n of cT(e)) n.setAttribute("aria-selected", t !== null && n.dataset.uiKey === t ? "true" : "false");
		let a = e.querySelector(`.${Tw}`);
		a !== null && a.value !== (t ?? "") && (a.value = t ?? ""), uw(e);
	}
	watchOptions(e) {
		if (this.optionWatch === null || this.watched.has(e)) return;
		this.watched.add(e);
		let t = e.classList.contains(Rw) ? $w : Qw;
		this.optionWatch.observe(e, {
			attributes: !0,
			attributeFilter: t,
			characterData: !0,
			subtree: !0
		});
	}
	syncMultiple(e) {
		let t = jl(e.getAttribute(ii)), n = new Set(t), r = Nl(t, Ml(e.getAttribute(qw)));
		this.decorateOptions(e, (e) => r && !n.has(e.dataset.uiKey ?? ""));
		let i = cT(e), a = new Map(i.map((e) => [e.dataset.uiKey ?? "", e])), o = iT(e), s = o === null ? t.filter((e) => a.has(e)) : t, c = e.classList.contains(Rw);
		CT(e, s.map((e) => {
			let t = a.get(e) ?? null, n = c ? xT(t) : void 0;
			return {
				key: e,
				label: ST(t, e, n ?? null),
				badge: n
			};
		})), o !== null && o.readOnly !== eT(e) && (o.readOnly = eT(e));
		let l = e.querySelector(`.${bw}`);
		l !== null && (l.style.display = s.length > 0 ? "none" : "");
		for (let e of i) e.setAttribute("aria-selected", n.has(e.dataset.uiKey ?? "") ? "true" : "false");
		let u = e.querySelector(`.${Tw}`), d = JSON.stringify(t);
		u !== null && u.getAttribute("data-ui-selected-keys") !== d && u.setAttribute(ii, d), uw(e);
	}
	renderTriggerContent(e, t, n) {
		let r = e.querySelector(`.${Si}`);
		if (r === null) return t !== null;
		let i = r.querySelector(`:scope > .${vw}`), a = i?.getAttribute(yw) ?? null;
		if (i !== null && a !== null && (i.removeAttribute(yw), this.drawnKeys.set(e, a)), t === null) return i !== null && n !== null && nT(e) && this.drawnKeys.get(e) === n ? !0 : (i?.remove(), this.drawnKeys.delete(e), !1);
		let o = t.getAttribute(y);
		if (o === null ? this.drawnKeys.delete(e) : this.drawnKeys.set(e, o), i !== null && o !== null && a === o) return !0;
		if (i === null) {
			i = document.createElement("span"), i.className = vw;
			let e = r.querySelector(`:scope > .${xw}`);
			e === null ? r.prepend(i) : e.after(i);
		}
		i.style.display = "inline-flex";
		let s = t.cloneNode(!0);
		return fT(s), Em(s), i.replaceChildren(...s.childNodes), !0;
	}
	decorateOptions(e, t = () => !1) {
		for (let n of cT(e)) {
			n.hasAttribute("role") || n.setAttribute("role", "option");
			let e = A(n), r = e || t(n) ? "true" : "false";
			n.getAttribute("aria-disabled") !== r && n.setAttribute("aria-disabled", r), (e ? n.tabIndex !== -1 : !n.hasAttribute("tabindex")) && (n.tabIndex = -1);
		}
	}
	handlePointerMove(e) {
		let t = this.openSelect, n = t === null || !(e.target instanceof Element) ? null : e.target.closest(`.${ww}`);
		t === null || n === null || n.hasAttribute(Aw) || A(n) || k(n) || n.closest(".ui-select") !== t || (aT(t) === null && (P(cT(t).filter((e) => !A(e)), n), Hd(n)), this.markActive(t, n, !0));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Lw}`);
		if (t !== null) {
			let n = t.closest(`.${Ei}`);
			n !== null && (e.preventDefault(), e.stopPropagation(), eT(n) || this.removeChosen(n, t.closest(`.${Fw}`)?.getAttribute(Gw) ?? null));
			return;
		}
		let n = e.target.closest(`[${Ew}]`);
		if (n !== null) {
			let t = n.closest(`.${Ei}`);
			t !== null && (e.preventDefault(), e.stopPropagation(), eT(t) || (this.clearValue(t), mT(t)));
			return;
		}
		let r = e.target.closest(`.${Si}`);
		if (r !== null) {
			let t = r.closest(`.${Ei}`);
			if (eT(t)) return;
			e.preventDefault();
			let n = t === null ? null : iT(t);
			t !== null && n !== null ? this.pressEntryBox(t, n, e.target === n) : this.toggle(t);
			return;
		}
		let i = e.target.closest(`.${ww}`);
		if (i === null) return;
		let a = i.closest(`.${Ei}`);
		a !== null && this.choose(a, i);
	}
	pressEntryBox(e, t, n) {
		document.activeElement !== t && t.focus(), !(cT(e).length === 0 || n && this.openSelect === e) && this.toggle(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || M(e) || (this.openSelect !== null && uT(this.openSelect), this.handleEntryKey(e) || this.handleChipKey(e)) || this.openSelect !== null && e.target instanceof Node && this.openSelect.contains(e.target) && this.handleOpenListKey(e, this.openSelect) || this.handleClearKey(e) || (e.key === "ArrowDown" || e.key === "ArrowUp") && N(e, { alt: e.key === "ArrowDown" }) && this.handleClosedArrow(e) || this.handleTypeAhead(e) || this.handleMultipleTriggerKey(e) || e.key !== "Enter" && e.key !== " " || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${ww}`) ?? this.markedOption(e);
		if (t === null) return;
		let n = t.closest(`.${Ei}`);
		n !== null && (e.preventDefault(), this.choose(n, t));
	}
	handleOpenListKey(e, t) {
		if (e.key === "ArrowUp" && e.altKey && N(e, { alt: !0 })) {
			e.preventDefault();
			let n = lT(t);
			return n !== null && !tT(t) ? this.choose(t, n) : this.close(), !0;
		}
		return !Mw.has(e.key) || !N(e) || (e.key === "Home" || e.key === "End") && il(e.target) ? !1 : (e.preventDefault(), this.moveCurrent(t, e.key), !0);
	}
	handleEntryKey(e) {
		let t = sT(e);
		if (t === null) return !1;
		let { entry: n, select: r } = t;
		if (eT(r)) return !1;
		switch (e.key) {
			case "ArrowLeft": return n.selectionStart === 0 && n.selectionEnd === 0 && this.focusChip(e, r, -1);
			case "ArrowDown":
			case "ArrowUp": return e.preventDefault(), this.openSelect === r ? this.moveCurrent(r, e.key) : this.openSuggestions(r, n, e.key === "ArrowDown"), !0;
			case "Enter": {
				let t = this.openSelect === r ? hT(r).find((e) => e.hasAttribute(Aw)) : void 0;
				return t === void 0 ? (e.preventDefault(), n.value.trim().length === 0 ? (this.pressEntryBox(r, n, !1), !0) : (this.releaseRefusal(r), this.enterTyped(r, n, Rl(n.value), ""), !0)) : (e.preventDefault(), this.choose(r, t), !0);
			}
			case ",": return e.preventDefault(), this.releaseRefusal(r), this.enterTyped(r, n, Rl(n.value), ""), !0;
			case "Backspace": {
				if (n.value.length > 0) return !1;
				let t = r.querySelectorAll(`.${Pw} > .${Fw}`);
				return t.length !== 0 && (e.preventDefault(), this.removeChosen(r, t[t.length - 1].getAttribute(Gw)), !0);
			}
			default: return !1;
		}
	}
	focusChip(e, t, n, r = null) {
		let i = vT(t);
		if (i.length === 0) return !1;
		let a = i[(r === null ? i.length : i.findIndex((e) => e.contains(r))) + n]?.querySelector(`.${Lw}`) ?? (n === 1 ? oT(t) : null);
		return e.preventDefault(), a === null || (a.focus(), a instanceof HTMLInputElement && a.setSelectionRange(0, 0), !0);
	}
	openSuggestions(e, t, n) {
		sw(t);
		let r = hT(e), i = (n ? r[0] : r[r.length - 1]) ?? null;
		i !== null && this.toggle(e, !0, i);
	}
	handleChipKey(e) {
		let t = e.target instanceof HTMLElement && e.target.classList.contains(Lw) ? e.target : null, n = t?.closest(".ui-select") ?? null;
		if (t === null || n === null || !tT(n)) return !1;
		switch (e.key) {
			case "ArrowLeft": return this.focusChip(e, n, -1, t);
			case "ArrowRight": return this.focusChip(e, n, 1, t);
			case "Backspace":
			case "Delete": {
				if (e.preventDefault(), eT(n)) return !0;
				let r = vT(n), i = r.findIndex((e) => e.contains(t)), a = (r[i + 1] ?? r[i - 1])?.getAttribute(Gw) ?? null;
				this.removeChosen(n, r[i]?.getAttribute(Gw) ?? null);
				let o = a === null ? null : vT(n).find((e) => e.getAttribute(Gw) === a) ?? null;
				return o !== null && o.querySelector(`.${Lw}`)?.focus(), !0;
			}
			default: return !1;
		}
	}
	handleClosedArrow(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || t === this.openSelect || eT(t)) return !1;
		e.preventDefault();
		let n = rT(t);
		n !== null && sw(n);
		let r = hT(t), i = r.find((e) => e.getAttribute("aria-selected") === "true") ?? (e.key === "ArrowDown" ? r[0] : r[r.length - 1]) ?? null;
		return this.toggle(t, !1, i), !0;
	}
	handleTypeAhead(e) {
		let t = mw(e), n = e.target instanceof HTMLElement ? e.target : null;
		if (t === null || n === null || !(n.classList.contains("ui-select__trigger") || n.classList.contains(ww))) return !1;
		let r = n.closest(`.${Ei}`), i = r !== null && r === this.openSelect;
		if (r === null || eT(r) || !i && !n.classList.contains("ui-select__trigger")) return !1;
		let a = rT(r);
		if (a !== null) return !i && (e.preventDefault(), this.typeIntoSearch(r, a, t), !0);
		e.preventDefault();
		let o = hT(r), s = i ? o.find((e) => e === document.activeElement) ?? o.find((e) => e.hasAttribute(Aw)) ?? null : o.find((e) => e.getAttribute("aria-selected") === "true") ?? null, c = this.typeAhead.next({
			owner: r,
			character: t,
			entries: o,
			current: s,
			words: (e) => dT(e) ?? "",
			context: r
		});
		return c === null ? !0 : i ? (P(cT(r).filter((e) => !A(e)), c), _T(r, c), z(c), this.markActive(r, c), !0) : (this.toggle(r, !1, c), !0);
	}
	typeIntoSearch(e, t, n) {
		this.toggle(e, !0), this.openSelect === e && (t.value = n, t.setSelectionRange(n.length, n.length), t.dispatchEvent(new Event("input", { bubbles: !0 })));
	}
	handleClearKey(e) {
		if (e.key !== "Delete" && e.key !== "Backspace" || !N(e) || !(e.target instanceof HTMLElement)) return !1;
		let t = e.target.closest(`.${Ei}`);
		return t === null || t === this.openSelect || !t.classList.contains(Dw) || eT(t) || e.target !== oT(t) || e.key === "Backspace" && tT(t) || (iT(t)?.value ?? "") !== "" ? !1 : (e.preventDefault(), this.clearValue(t), !0);
	}
	handleMultipleTriggerKey(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || !tT(t) || eT(t)) return !1;
		switch (e.key) {
			case "Enter":
			case " ": return e.preventDefault(), this.toggle(t), !0;
			case "ArrowLeft": return this.focusChip(e, t, -1);
			case "Backspace": {
				let n = t.querySelectorAll(`.${Pw} > .${Fw}`);
				return n.length !== 0 && (e.preventDefault(), this.removeChosen(t, n[n.length - 1].getAttribute(Gw)), !0);
			}
			default: return !1;
		}
	}
	markedOption(e) {
		let t = this.openSelect;
		return e.key !== "Enter" || t === null || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(kw) || !t.contains(e.target) ? null : hT(t).find((e) => e.hasAttribute(Aw)) ?? null;
	}
	toggle(e, t = !1, n = null) {
		if (e === null) return;
		if (this.openSelect === e) {
			this.close();
			return;
		}
		this.close();
		let r = aT(e), i = iT(e);
		r !== null && !t && sw(r), uw(e);
		let a = e.querySelector(`.${Si}`), o = e.querySelector(`.${Sw}`), s = e.querySelector(`.${Cw}`) ?? o, c = e.getAttribute(gw);
		if (a === null || o === null || s === null) return;
		let l = zi(s, "ui-select-list");
		if (i === null && a.setAttribute("aria-controls", l), r?.setAttribute("aria-controls", l), this.popups.open({
			owner: e,
			popup: o,
			anchor: a,
			placement: {
				placement: c !== null && Sp(c) ? c : "bottom-start",
				minAnchorWidth: !0
			},
			openers: i === null ? r === null ? [a] : [a, r] : [i],
			returnFocus: () => i ?? a
		})) {
			if (r === null) {
				this.initializeFocus(e, n);
				return;
			}
			i === null ? this.initializeSearch(e, r, n, t) : this.initializeEntry(e, n), jT(o);
		}
	}
	close() {
		this.popups.close();
	}
	initializeFocus(e, t) {
		let n = hT(e);
		if (n.length === 0) return;
		let r = t ?? n.find((e) => e.getAttribute("aria-selected") === "true");
		if (r === void 0 && Fd()) {
			P(n, null), this.markActive(e, null), mT(e);
			return;
		}
		let i = r ?? n[0];
		P(n, i), this.markActive(e, i, Fd()), _T(e, i), z(i);
	}
	initializeSearch(e, t, n, r) {
		let i = cT(e), a = hT(e), o = (r ? void 0 : n ?? a.find((e) => e.getAttribute("aria-selected") === "true")) ?? (r || Fd() ? null : a[0] ?? null);
		P(i, null), this.markActive(e, o, Fd()), o !== null && _T(e, o), !Id() && (z(t), t.select());
	}
	initializeEntry(e, t) {
		P(cT(e), null), this.markActive(e, t), t !== null && _T(e, t);
	}
	moveCurrent(e, t) {
		let n = cT(e).filter((e) => !A(e)), r = id(t, n, lT(e), "vertical");
		r !== null && (aT(e) === null ? Sl(n, r) : _T(e, r), this.markActive(e, r));
	}
	markActive(e, t, n = !1) {
		for (let r of cT(e)) r === t ? r.setAttribute(Aw, "") : r.hasAttribute(Aw) && r.removeAttribute(Aw), Ld(r, r === t && n);
		uT(e);
		let r = aT(e);
		r !== null && (t === null ? r.removeAttribute("aria-activedescendant") : r.setAttribute("aria-activedescendant", zi(t, "ui-select-option")));
	}
	choose(e, t) {
		let n = t.dataset.uiKey;
		if (n === void 0 || A(t) || eT(e)) return;
		if (tT(e)) {
			let r = Pl(jl(e.getAttribute(ii)), n, Ml(e.getAttribute(qw)));
			this.markActive(e, t, Fd()), r !== null && this.writeChosen(e, r);
			let i = iT(e);
			i !== null && i.value.length > 0 && (i.value = "", this.releaseRefusal(e), this.suggest(e, i));
			return;
		}
		if (e.getAttribute(hw) === n) {
			this.close();
			return;
		}
		e.setAttribute(hw, n), this.sync(e);
		let r = e.querySelector(`.${Tw}`);
		r !== null && (r.value = n, r.dispatchEvent(new Event("change", { bubbles: !0 }))), this.close();
	}
	removeChosen(e, t) {
		let n = t === null ? null : Fl(jl(e.getAttribute(ii)), t);
		if (n === null) return;
		let r = document.activeElement instanceof HTMLElement && document.activeElement.closest(`.${Fw}`) !== null;
		this.writeChosen(e, n), (r || document.activeElement === document.body) && oT(e)?.focus();
	}
	writeChosen(e, t) {
		t.length === 0 ? e.removeAttribute(ii) : e.setAttribute(ii, JSON.stringify(t)), this.sync(e), this.popups.reposition(e), e.querySelector(`.${Tw}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	clearValue(e) {
		if (tT(e)) {
			e.hasAttribute("data-ui-selected-keys") && this.writeChosen(e, []);
			return;
		}
		if (!e.hasAttribute(hw)) return;
		e.removeAttribute(hw), this.sync(e);
		let t = e.querySelector(`.${Tw}`);
		t !== null && (t.value = "", t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
};
function mT(e) {
	let t = e.querySelector(`.${Si}`), n = oT(e);
	t !== null && n !== null && !t.contains(document.activeElement) && z(n);
}
function hT(e) {
	return cT(e).filter((e) => gT(e) && !A(e) && !k(e));
}
function gT(e) {
	return e.style.display !== "none" && !e.classList.contains("ui-hidden");
}
function _T(e, t) {
	let n = e.querySelector(`.${Cw}`);
	if (n === null) return;
	let r = n.getBoundingClientRect(), i = t.getBoundingClientRect(), a = getComputedStyle(n), o = r.top + (Number.parseFloat(a.borderTopWidth) || 0), s = o + (Number.parseFloat(a.paddingTop) || 0), c = o + n.clientHeight - (Number.parseFloat(a.paddingBottom) || 0);
	i.top < s ? n.scrollTop -= s - i.top : i.bottom > c && (n.scrollTop += i.bottom - c);
}
function vT(e) {
	return [...e.querySelectorAll(`.${Pw} > .${Fw}`)];
}
function yT(e) {
	let t = e.closest(".ui-select__trigger")?.closest(".ui-select") ?? null;
	return t !== null && iT(t) !== null && !e.classList.contains(Yw);
}
function bT(e, t) {
	let n = t.trim().toLocaleLowerCase();
	for (let t of cT(e)) {
		let e = t.dataset.uiKey;
		if (e !== void 0 && !A(t) && (e.toLocaleLowerCase() === n || dT(t)?.trim().toLocaleLowerCase() === n)) return e;
	}
	return null;
}
function xT(e) {
	return e?.querySelector(`.${zw}`) ?? null;
}
function ST(e, t, n = null) {
	let r = ((n?.hasAttribute("data-ui-badge-text") === !0 ? n.querySelector(`.${Hw}`)?.textContent ?? null : null) ?? dT(e))?.trim() ?? "";
	return r.length > 0 ? r : t;
}
function CT(e, t) {
	let n = e.querySelector(`.${Pw}`);
	if (n === null) return;
	n.hasAttribute(Kw) !== t.length > 0 && n.toggleAttribute(Kw, t.length > 0);
	let r = [...n.querySelectorAll(`:scope > .${Fw}`)];
	if (!(r.length === t.length && r.every((e, n) => e.getAttribute(Gw) === t[n].key && e.querySelector(`.${Iw}`)?.textContent === t[n].label && (t[n].badge === void 0 || OT(e) === OT(t[n].badge ?? DT()))))) {
		for (let e of r) e.remove();
		n.prepend(...t.map(wT));
	}
}
function wT(e) {
	let t = document.createElement("button"), n = e.badge === void 0 ? TT(e.label) : ET(e.label, e.badge);
	return n.classList.add(Fw), n.setAttribute(Gw, e.key), t.className = Lw, t.type = "button", t.tabIndex = -1, O.write(t, "aria-label", "ui.select.remove", { label: e.label }), n.append(t), n;
}
function TT(e) {
	let t = document.createElement("span"), n = document.createElement("span");
	return n.className = Iw, n.textContent = e, t.append(n), t;
}
function ET(e, t) {
	let n = t === null ? DT() : t.cloneNode(!0);
	fT(n), n.classList.remove(zw);
	let r = n.querySelector(`:scope > .${Hw}`);
	return r?.classList.add(Iw), r !== null && !n.hasAttribute("data-ui-badge-text") && LC(n, e), n;
}
function DT() {
	let e = document.createElement("span"), t = document.createElement("span"), n = document.createElement("span");
	return e.className = `${Bw} ${Uw}`, t.className = `${Vw} ui-icon`, n.className = `${Hw} ${Ww}`, e.append(t, n), e;
}
function OT(e) {
	let t = e.querySelector(`:scope > .${Vw}`);
	return `${kT(e)}|${t === null ? "" : kT(t)}`;
}
function kT(e) {
	return `${[...e.classList].filter((e) => e !== Fw && e !== zw).sort().join(" ")};${e.getAttribute("style") ?? ""};${e.hasAttribute(Ke)}`;
}
function AT(e, t) {
	if (e.type === "childList") {
		for (let n of e.addedNodes) if (n instanceof HTMLElement) {
			n.classList.contains("ui-select") && t.add(n);
			for (let e of n.querySelectorAll(`.${Ei}`)) t.add(e);
		}
	}
	if (e.type === "attributes" && (e.attributeName === hw || e.attributeName === "data-ui-selected-keys" || e.attributeName === qw)) {
		e.target instanceof HTMLElement && e.target.classList.contains("ui-select") && t.add(e.target);
		return;
	}
	let n = e.target instanceof HTMLElement ? e.target : e.target.parentElement;
	if (e.attributeName === "style" && n?.classList.contains(Bw) !== !0) return;
	let r = n?.closest(`.${Sw}`)?.closest(`.${Ei}`);
	r != null && t.add(r);
}
function jT(e) {
	e.dataset.uiPlacement?.startsWith("top") === !0 && (e.style.minHeight = `${e.offsetHeight}px`);
}
//#endregion
//#region src/interactions/commit-gate.ts
var MT = class {
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
		!il(t) || !this.root.contains(t) || (this.field = t, this.committed = t.value);
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
}, NT = "textarea.ui-text-area__field", PT = "data-ui-text-area-grow";
function FT() {
	return typeof CSS < "u" && CSS.supports("field-sizing", "content");
}
var IT = class {
	root;
	widths = /* @__PURE__ */ new WeakMap();
	observer;
	constructor(e = {}) {
		this.root = e.root ?? document, this.observer = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null, this.root.addEventListener("input", (e) => {
			e.target instanceof HTMLTextAreaElement && e.target.matches(NT) && this.fit(e.target);
		}, !0), this.fitAll(this.root.querySelectorAll(NT)), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.fitAll(Ea(e.components, NT));
		}), V(this.root, NT, {
			childList: !0,
			attributeFilter: [PT]
		}, (e) => {
			this.fitAll(Ea(e, NT));
		});
	}
	fitAll(e) {
		for (let t of e) this.fit(t);
	}
	fit(e) {
		if (!e.hasAttribute(PT)) {
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
function LT(e) {
	let t = RT(e.getAttribute("min"), 0), n = RT(e.getAttribute("max"), 100), r = e.getAttribute("step");
	return {
		min: t,
		max: Math.max(t, n),
		step: r === "any" ? 0 : Math.max(0, RT(r, 1))
	};
}
function RT(e, t) {
	let n = e === null || e.trim().length === 0 ? NaN : Number(e);
	return Number.isFinite(n) ? n : t;
}
function zT(e, t, n, r) {
	let i = (n ? e.height : e.width) - r;
	if (i <= 0) return 0;
	let a = n ? e.top + e.height - t.y : t.x - e.left;
	return Math.min(1, Math.max(0, (a - r / 2) / i));
}
function BT(e, t) {
	return VT(t.min + e * (t.max - t.min), t);
}
function VT(e, t) {
	let n = Math.min(t.max, Math.max(t.min, e));
	if (t.step <= 0) return n;
	let r = Math.round((n - t.min) / t.step);
	return t.min + r * t.step > t.max && r--, HT(t.min + r * t.step, t);
}
function HT(e, t) {
	return Number(e.toFixed(Math.min(20, Math.max(UT(t.step), UT(t.min)))));
}
function UT(e) {
	let t = String(e), n = t.indexOf("e-");
	if (n >= 0) return Number(t.slice(n + 2));
	let r = t.indexOf(".");
	return r < 0 ? 0 : t.length - r - 1;
}
function WT(e, t, n) {
	return t === n ? e < t ? "start" : e > t ? "end" : null : Math.abs(e - t) < Math.abs(e - n) ? "start" : "end";
}
function GT(e, t, n, r, i) {
	let a = Math.max(0, r);
	if (t === "start" ? e <= n - a : e >= n + a) return e;
	let o = t === "start" ? n - a : n + a;
	if (i.step <= 0) return KT(o, i);
	let s = (o - i.min) / i.step;
	return KT(HT(i.min + (t === "start" ? Math.floor(s + 1e-9) : Math.ceil(s - 1e-9)) * i.step, i), i);
}
function KT(e, t) {
	return Math.min(t.max, Math.max(t.min, e));
}
//#endregion
//#region src/interactions/range-value-engine.ts
var qT = "ui-slider__input", JT = "ui-slider__input--end", YT = "ui-slider__input--held", XT = "ui-slider__value", ZT = "ui-slider__bubble", QT = "ui-slider__track", $T = "ui-slider__thumb-anchor", eE = "ui-slider", tE = "ui-slider--range", nE = "ui-orientation--vertical", rE = "--ui-slider-fraction", iE = "--ui-slider-end-fraction", aE = 6, oE = "Value", sE = "EndValue", cE = /* @__PURE__ */ new Set([
	"Value",
	"EndValue",
	"Min",
	"Max"
]), lE = class {
	options;
	root;
	settled = /* @__PURE__ */ new WeakMap();
	pressedFrom = /* @__PURE__ */ new WeakMap();
	cancelled = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("pointerdown", (e) => {
			this.notePress(e.target), this.placeBubble(e.target);
		}, !0), this.root.addEventListener("pointercancel", (e) => this.takeBackPress(e.target), !0), (this.root === document ? window : this.root).addEventListener("change", (e) => this.refuseCancelledChange(e), !0), this.root.addEventListener("focusin", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusout", (e) => this.releaseBubble(e.target), !0), new sh({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${tE} .${QT}`),
			begin: (e, t) => this.beginBandDrag(e, t),
			move: (e, t, n) => this.moveBandDrag(e, n),
			end: (e, t) => this.endBandDrag(t),
			cancel: (e, t) => this.putBandBack(t),
			takenBack: (e, t) => this.putBandBack(t)
		}), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			if (cE.has(e.propertyName)) for (let t of Ea(e.components, `.${qT}`)) this.settled.set(t, t.value), this.writeReadings(t), e.propertyName === (dE(t) ? sE : oE) && this.reportClamped(t, e.value);
		});
	}
	notePress(e) {
		let t = uE(e);
		t !== null && (this.cancelled.delete(t), this.pressedFrom.set(t, t.value));
	}
	takeBackPress(e) {
		let t = uE(e), n = t === null ? void 0 : this.pressedFrom.get(t);
		t !== null && n !== void 0 && (this.pressedFrom.delete(t), t.value !== n && (t.value = n, this.cancelled.add(t), this.settled.set(t, n), this.writeReadings(t)));
	}
	refuseCancelledChange(e) {
		let t = uE(e.target);
		t === null || !this.cancelled.has(t) || (this.cancelled.delete(t), e.stopImmediatePropagation());
	}
	reportClamped(e, t) {
		t == null || e.value === String(t) || mE(e) || e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(qT)) return;
		let t = e.target;
		if (this.cancelled.delete(t), mE(t)) {
			t.value = this.settled.get(t) ?? t.defaultValue;
			return;
		}
		let n = fE(t);
		if (n !== null) {
			let e = pE(t, Number(t.value), n);
			e !== t.value && (t.value = e, e === (this.settled.get(t) ?? t.defaultValue) && this.cancelled.add(t));
		}
		this.settled.set(t, t.value), this.writeReadings(t);
	}
	beginBandDrag(e, t) {
		let n = e.querySelector(`.${qT}:not(.${JT})`), r = e.querySelector(`.${JT}`);
		if (n === null || r === null) return null;
		let i = BT(zT(e.getBoundingClientRect(), t, hE(e), gE(e)), LT(n)), a = WT(i, Number(n.value), Number(r.value));
		if (mE(n)) return z(a === "end" ? r : n), null;
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
		let n = e.start.closest(`.${QT}`);
		if (n === null) return;
		let r = BT(zT(n.getBoundingClientRect(), t, hE(n), gE(n)), LT(e.start));
		if (e.held === null) {
			if (r === e.pressed) return;
			this.holdHandle(e, r < e.pressed ? "start" : "end", r);
			return;
		}
		this.moveHandle(e.held, r);
	}
	holdHandle(e, t, n) {
		let r = t === "start" ? e.start : e.end;
		e.held = r, r.classList.add(YT), z(r), this.moveHandle(r, n), this.placeBubble(r);
	}
	moveHandle(e, t) {
		let n = fE(e), r = n === null ? String(t) : pE(e, t, n);
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
		e.held?.classList.remove(YT), e.held !== null && this.writeReadings(e.held);
	}
	placeBubble(e) {
		let t = _E(e);
		t !== null && Np(t.anchor, t.bubble, {
			placement: t.vertical ? "left" : "top",
			gap: aE
		});
	}
	releaseBubble(e) {
		Gp(_E(e)?.bubble);
	}
	writeReadings(e) {
		let t = dE(e), n = e.closest(`.${QT}`)?.parentElement ?? e.parentElement, r = t ? `.${XT}--end, .${ZT}--end` : `.${XT}:not(.${XT}--end), .${ZT}:not(.${ZT}--end)`;
		for (let t of n?.querySelectorAll(r) ?? []) t.textContent = e.value;
		e.closest(`.${QT}`)?.style.setProperty(t ? iE : rE, String(vE(e))), e.matches(`:active, :focus-visible, .${YT}`) ? this.placeBubble(e) : this.releaseBubble(e);
	}
};
function uE(e) {
	return e instanceof HTMLInputElement && e.classList.contains(qT) ? e : null;
}
function dE(e) {
	return e.classList.contains(JT);
}
function fE(e) {
	return e.closest(`.${tE} .${QT}`)?.querySelector(dE(e) ? `.${qT}:not(.${JT})` : `.${JT}`) ?? null;
}
function pE(e, t, n) {
	let r = Number(e.closest(`.${eE}`)?.getAttribute("data-ui-slider-min-distance") ?? 0);
	return String(GT(t, dE(e) ? "end" : "start", Number(n.value), Number.isFinite(r) ? r : 0, LT(e)));
}
function mE(e) {
	return j(e) || k(e);
}
function hE(e) {
	return e.closest(`.${eE}`)?.classList.contains(nE) === !0;
}
function gE(e) {
	let t = e.querySelector(`.${$T}`)?.getBoundingClientRect();
	return t === void 0 ? 0 : hE(e) ? t.height : t.width;
}
function _E(e) {
	if (!(e instanceof Element) || !e.classList.contains(qT)) return null;
	let t = e.closest(`.${QT}`), n = dE(e), r = t?.querySelector(n ? `.${ZT}--end` : `.${ZT}:not(.${ZT}--end)`) ?? null, i = t?.querySelector(n ? `.${$T}--end` : `.${$T}:not(.${$T}--end)`) ?? null;
	return r === null || i === null ? null : {
		bubble: r,
		anchor: i,
		vertical: hE(e)
	};
}
function vE(e) {
	let { min: t, max: n } = LT(e), r = Number(e.value);
	return !Number.isFinite(r) || n <= t ? 0 : Math.min(1, Math.max(0, (r - t) / (n - t)));
}
//#endregion
//#region src/rendering/number-format.ts
var yE = {
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
}, bE = [
	"(n)",
	"-n",
	"- n",
	"n-",
	"n -"
], xE = [
	"$n",
	"n$",
	"$ n",
	"n $"
], SE = [
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
], CE = [
	"n %",
	"n%",
	"%n",
	"% n"
], wE = [
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
], TE = /[1-9]/;
function EE(e) {
	let t = e.closest("[data-ui-number-culture]")?.getAttribute("data-ui-number-culture") ?? null;
	if (t === null) return yE;
	try {
		return {
			...yE,
			...JSON.parse(t)
		};
	} catch {
		return yE;
	}
}
function DE(e, t, n) {
	if (!Number.isFinite(e)) return String(e);
	let r = kE(t);
	if (r === null) return AE(e, n);
	let i = Math.abs(e);
	switch (r.kind) {
		case "N": {
			let t = jE(i, 0, r.precision ?? n.decimalDigits, n.groupSizes, n.groupSeparator, n.decimalSeparator);
			return OE(e, t) ? IE(bE[n.negativePattern] ?? "-n", t, "", n.negativeSign) : t;
		}
		case "F": {
			let t = jE(i, 0, r.precision ?? n.decimalDigits, [], "", n.decimalSeparator);
			return OE(e, t) ? n.negativeSign + t : t;
		}
		case "D": {
			let t = ME(i, 0, 0).integer.padStart(r.precision ?? 1, "0");
			return OE(e, t) ? n.negativeSign + t : t;
		}
		case "C": {
			let t = jE(i, 0, r.precision ?? n.currencyDecimalDigits, n.currencyGroupSizes, n.currencyGroupSeparator, n.currencyDecimalSeparator);
			return IE(OE(e, t) ? SE[n.currencyNegativePattern] ?? "-$n" : xE[n.currencyPositivePattern] ?? "$n", t, n.currencySymbol, n.negativeSign);
		}
		case "P": {
			let t = jE(i, 2, r.precision ?? n.percentDecimalDigits, n.percentGroupSizes, n.percentGroupSeparator, n.percentDecimalSeparator);
			return IE(OE(e, t) ? wE[n.percentNegativePattern] ?? "-n %" : CE[n.percentPositivePattern] ?? "n %", t, n.percentSymbol, n.negativeSign);
		}
		default: return AE(e, n);
	}
}
function OE(e, t) {
	return e < 0 && TE.test(t);
}
function kE(e) {
	if (e == null || e.trim().length === 0) return null;
	let t = /^([NFCPDnfcpd])(\d{0,2})$/.exec(e.trim());
	if (t === null) throw Error(`Number format '${e}' is outside the shared subset (N, F, C, P, D, with an optional precision).`);
	return {
		kind: t[1].toUpperCase(),
		precision: t[2].length === 0 ? null : Number(t[2])
	};
}
function AE(e, t) {
	let { integer: n, fraction: r } = NE(Math.abs(e), 0), i = r.length === 0 ? n : `${n}${t.decimalSeparator}${r}`;
	return e < 0 ? t.negativeSign + i : i;
}
function jE(e, t, n, r, i, a) {
	let { integer: o, fraction: s } = ME(e, t, n);
	return n === 0 ? FE(o, r, i) : `${FE(o, r, i)}${a}${s}`;
}
function ME(e, t, n) {
	let { integer: r, fraction: i } = NE(e, t), a = r + i.slice(0, n).padEnd(n, "0"), o = i.length > n && i[n] >= "5" ? PE(a) : a, s = o.length - n;
	return {
		integer: o.slice(0, s),
		fraction: o.slice(s)
	};
}
function NE(e, t) {
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
function PE(e) {
	let t = e.length - 1;
	for (; t >= 0 && e[t] === "9";) t--;
	let n = "0".repeat(e.length - 1 - t);
	return t < 0 ? `1${n}` : `${e.slice(0, t)}${String(Number(e[t]) + 1)}${n}`;
}
function FE(e, t, n) {
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
function IE(e, t, n, r) {
	let i = "";
	for (let a of e) i += a === "n" ? t : a === "$" || a === "%" ? n : a === "-" ? r : a;
	return i;
}
var LE = /^[\t\n\v\f\r ]*[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?[\t\n\v\f\r ]*$/;
function RE(e) {
	if (!LE.test(e)) return null;
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}
var zE = {
	readCulture: EE,
	format: DE,
	parseInvariant: RE
}, BE = /^-?(\d+(\.\d*)?|\.\d+)$/;
function VE(e, t, n) {
	if (!BE.test(e)) return e;
	let r = n.thousands === !1 ? JE(t) : t, i = Number(e), a = n.format?.trim() ?? "";
	if (a.length > 0) try {
		return DE(i, n.thousands === !0 ? HE(a) : a, r);
	} catch {}
	let o = e.includes(".") ? e.length - e.indexOf(".") - 1 : 0;
	return DE(i, `${n.thousands === !0 ? "N" : "F"}${Math.min(o, 99)}`, r);
}
function HE(e) {
	return /^[fF]\d{0,2}$/.test(e) ? `N${e.slice(1)}` : e;
}
function UE(e, t, n) {
	return BE.test(e) ? (qE(n) ? YE(e, 2) : e).replace(".", t.decimalSeparator) : e;
}
function WE(e, t, n) {
	let r = e.trim();
	if (r.length === 0) return "";
	let i = !1;
	r.startsWith("(") && r.endsWith(")") && (i = !0, r = r.slice(1, -1));
	let a = qE(n) || t.percentSymbol.length > 0 && r.includes(t.percentSymbol);
	for (let e of [t.currencySymbol, t.percentSymbol]) r = e.length === 0 ? r : r.split(e).join("");
	for (let e of /* @__PURE__ */ new Set([
		t.negativeSign,
		"-",
		"−"
	])) e.length > 0 && r.includes(e) && (i = !0, r = r.split(e).join(""));
	let o = t.decimalSeparator, [s, ...c] = o.length === 0 ? [r] : r.split(o);
	if (c.length > 1) return null;
	let l = s.replace(/[\s  ]/g, "").split(t.groupSeparator).join("").split(t.currencyGroupSeparator).join(""), u = c.length === 0 ? null : c[0].replace(/[\s  ]/g, ""), d = u === null ? l : `${l}.${u}`;
	if (!BE.test(d)) return null;
	let f = a ? YE(d, -2) : d;
	return i && Number(f) !== 0 ? `-${f}` : f;
}
function GE(e, t, n, r, i) {
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
function KE(e) {
	return e.includes(".") ? e.replace(/0+$/, "").replace(/\.$/, "") : e;
}
function qE(e) {
	return /^\s*[pP]\d{0,2}\s*$/.test(e ?? "");
}
function JE(e) {
	return {
		...e,
		groupSeparator: "",
		currencyGroupSeparator: "",
		percentGroupSeparator: ""
	};
}
function YE(e, t) {
	let n = e.startsWith("-"), r = n ? e.slice(1) : e, i = r.indexOf("."), a = r.replace(".", ""), o = (i < 0 ? r.length : i) + t, s = a;
	o <= 0 && (s = "0".repeat(1 - o) + s, o = 1), o > s.length && (s += "0".repeat(o - s.length));
	let c = s.slice(0, o).replace(/^0+(?=\d)/, ""), l = s.slice(o).replace(/0+$/, ""), u = l.length === 0 ? c : `${c}.${l}`;
	return n ? `-${u}` : u;
}
//#endregion
//#region src/interactions/number-input-engine.ts
var XE = "ui-number-input", ZE = "ui-number-input__field", QE = "data-ui-number-no-decimals", $E = "data-ui-number-no-negative", eD = "data-ui-number-thousands", tD = "data-ui-number-no-thousands", nD = "data-ui-number-trim-zeros", rD = "data-ui-number-step", iD = "data-ui-number-min", aD = "data-ui-number-max", oD = "data-ui-number-step-direction", sD = /* @__PURE__ */ new Map([
	["ArrowUp", 1],
	["ArrowDown", -1],
	["PageUp", 10],
	["PageDown", -10]
]), cD = class {
	options;
	root;
	values = /* @__PURE__ */ new WeakMap();
	shown = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("focus", (e) => this.handleFocus(e), !0), this.root.addEventListener("blur", (e) => this.handleBlur(e), !0), this.root.addEventListener("click", (e) => this.handleStepClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleStepKey(e), !0), window.addEventListener("change", (e) => this.handleChangeCapture(e), !0), window.addEventListener("change", (e) => this.handleChangeDone(e)), this.showAtRest(this.root.querySelectorAll(`.${ZE}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.showAtRest(Ea(e.components, `.${ZE}`));
		}), O.onChange(() => this.showAtRest(this.root.querySelectorAll(`.${ZE}`)));
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
		let t = lD(e);
		if (t !== null) return this.keptValue(t) ?? mD(t) ?? t.value.trim();
	}
	show(e) {
		let t = this.values.get(e) ?? e.value, n = e.hasAttribute(nD) ? KE(t) : t, r = EE(e), i = e === document.activeElement ? UE(n, r, hD(e)) : fD(e, n, r);
		e.value = i, this.shown.set(e, i);
	}
	handleInput(e) {
		let t = lD(e.target);
		if (t === null) return;
		let n = !t.hasAttribute(QE), r = !t.hasAttribute($E), i = t.selectionStart ?? t.value.length, a = GE(t.value, i, EE(t), n, r);
		a.value !== t.value && (t.value = a.value, t.setSelectionRange(a.cursor, a.cursor));
	}
	handleFocus(e) {
		let t = lD(e.target);
		t !== null && (this.values.set(t, this.valueOf(t)), this.show(t));
	}
	handleBlur(e) {
		let t = lD(e.target);
		if (t === null) return;
		let n = this.showsOwnText(t) ? null : mD(t);
		if (n !== null && this.values.set(t, n), t.hasAttribute(nD) && !j(t) && !k(t)) {
			let e = this.values.get(t) ?? "", n = KE(e);
			n !== e && this.commit(t, n);
		}
		this.show(t);
	}
	handleChangeCapture(e) {
		let t = lD(e.target);
		if (t === null) return;
		let n = mD(t);
		n !== null && (this.values.set(t, n), t.value = n, this.shown.set(t, n));
	}
	handleChangeDone(e) {
		let t = lD(e.target);
		t !== null && t === document.activeElement && this.show(t);
	}
	commit(e, t) {
		this.values.set(e, t), e.value = UE(t, EE(e), hD(e)), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleStepClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[" + oD + "]");
		if (t === null) return;
		let n = t.closest(".ui-number-input__row")?.querySelector(`.${ZE}`) ?? null;
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t.getAttribute(oD) === "down" ? -1 : 1));
	}
	handleStepKey(e) {
		let t = sD.get(e.key);
		if (t === void 0 || !N(e, { shift: !0 }) || e.defaultPrevented) return;
		let n = lD(e.target);
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t));
	}
	step(e, t) {
		let n = Number(e.getAttribute(rD) ?? "1"), r = (Number(this.showsOwnText(e) ? this.valueOf(e) : mD(e) ?? "0") || 0) + n * t, i = e.getAttribute(iD), a = e.getAttribute(aD);
		i !== null && (r = Math.max(r, Number(i))), a !== null && (r = Math.min(r, Number(a))), this.commit(e, gD(r)), this.show(e);
	}
};
function lD(e) {
	return e instanceof HTMLInputElement && e.classList.contains(ZE) ? e : null;
}
function uD(e, t) {
	let n = e.classList.contains(XE) ? e.querySelector(`.${ZE}`) : null, r = n === null ? null : t(n);
	if (n === null || typeof r != "string" || r.trim().length === 0 || !Number.isFinite(Number(r))) return null;
	let i = dD(n, iD), a = dD(n, aD);
	return i !== null && Number(r) < Number(i) ? {
		key: "ui.value.min",
		args: { min: fD(n, i, EE(n)) }
	} : a !== null && Number(r) > Number(a) ? {
		key: "ui.value.max",
		args: { max: fD(n, a, EE(n)) }
	} : null;
}
function dD(e, t) {
	let n = e.getAttribute(t)?.trim() ?? "";
	return n.length > 0 && Number.isFinite(Number(n)) ? n : null;
}
function fD(e, t, n) {
	return VE(t, n, {
		format: hD(e),
		thousands: pD(e)
	});
}
function pD(e) {
	return e.hasAttribute(eD) ? !0 : !e.hasAttribute(tD) && null;
}
function mD(e) {
	return WE(e.value, EE(e), hD(e));
}
function hD(e) {
	return e.closest(`.${XE}`)?.getAttribute("data-ui-number-format") ?? null;
}
function gD(e) {
	return Number(e.toFixed(10)).toString();
}
//#endregion
//#region src/events/ahead-of-answer.ts
function _D(e, t) {
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
function vD(e) {
	switch (e.getAttribute(Gt)) {
		case "windowed": return "windowed";
		case "virtualized": return "virtualized";
		default: return "plain";
	}
}
function yD(e) {
	let t = vD(e) === "windowed" ? bD(e, "data-ui-window-offset") ?? 0 : 0;
	return Number.isInteger(t) && t > 0 ? t : 0;
}
function bD(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.length === 0) return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
function xD(e, t) {
	return e.getAttribute(t)?.toLowerCase() === "true";
}
//#endregion
//#region src/interactions/item-drags.ts
var SD = "application/x-ne-items", CD = null, wD = null;
function TD(e, t, n) {
	let r = e.getAttribute(me), i = new Set((e.getAttribute("data-ui-drag-effects") ?? "").split(" ").filter((e) => e === "move" || e === "copy"));
	return r === null || r.length === 0 || i.size === 0 || n.length === 0 ? null : {
		kind: r,
		root: e,
		host: t,
		rows: n,
		keys: n.map(R),
		effects: i,
		source: e.getAttribute(he)
	};
}
function ED(e, t) {
	let n = ru(t);
	return n.includes(e) ? n.filter((t) => t === e || OD(t)) : [e];
}
function DD(e) {
	return !Os(e, "data-ui-undraggable") && !A(e);
}
function OD(e) {
	return DD(e) && L(e) !== null;
}
function kD(e, t) {
	let n = e?.effects.has("copy") === !0, r = t || e?.effects.has("move") === !0;
	return n && r ? "copyMove" : n ? "copy" : "move";
}
function AD(e, t, n = null) {
	CD = t, wD = t === null ? null : n, t !== null && e instanceof DragEvent && e.dataTransfer !== null && e.dataTransfer.setData(SD, t.kind);
}
function jD(e) {
	return CD !== null && e.dataTransfer?.types.includes(SD) === !0 ? CD : null;
}
function MD() {
	let e = wD;
	CD = null, wD = null, e?.();
}
//#endregion
//#region src/items/items-empty-renderer.ts
var ND = `:scope > [${Ft}], :scope > [${It}], :scope > [${Xt}]`;
function G(e) {
	let t = new Set(e.querySelectorAll(ND));
	return [...e.children].filter((e) => !t.has(e));
}
function PD(e) {
	return e === null ? [] : [e];
}
function FD(e) {
	return e.querySelector(`:scope > [${Ft}]`);
}
function ID(e, t, n, r, i) {
	i ??= G(e).some((e) => !e.classList.contains(hi));
	let a = FD(e);
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
	c.setAttribute(Ft, ""), c.appendChild(s), e.appendChild(c);
}
//#endregion
//#region src/items/binding-template-evaluator.ts
var LD = { ok: !1 }, RD = {
	ok: !0,
	value: null
}, zD = null;
function BD(e) {
	zD = e;
}
function VD(e, t, n) {
	let r = e.length === 0 ? void 0 : e[e.length - 1].item, i = t ?? "";
	if (i.length === 0 || i === ".") return {
		ok: !0,
		value: r,
		scope: r
	};
	let a = (n ?? []).filter((e) => Ui(e.kind) !== "Scope"), o = -1;
	for (let e = 0; e < a.length; e++) Ui(a[e].kind) === "Dynamic" && (o = e);
	let s = r, c = r, l = !0, u = 0, d = 0, f = !0;
	for (; d < i.length;) {
		let t = i[d];
		if (t === ".") {
			if (f) return LD;
			f = !0, d++;
			continue;
		}
		if (t === "[") {
			if (d + 1 >= i.length || i[d + 1] !== "]" || u >= a.length) return LD;
			let t = a[u];
			if (u++, Ui(t.kind) === "Dynamic") {
				let n = GD(e, t.componentId);
				if (!n.ok) return LD;
				s = n.value, c = n.value, l = !0;
			} else {
				if (!l) return LD;
				let e = QD(s, t.value);
				if (!e.ok) return LD;
				s = e.value;
			}
			d += 2, f = !1;
			continue;
		}
		let n = d;
		for (; d < i.length && i[d] !== "." && i[d] !== "[";) d++;
		if (d === n) return LD;
		if (l) {
			let e = JD(s, i.slice(n, d), u > o);
			e.ok ? s = e.value : l = !1;
		}
		f = !1;
	}
	return f || u !== a.length || !l ? LD : {
		ok: !0,
		value: s,
		scope: c
	};
}
function HD(e, t, n) {
	for (let r of t ?? []) {
		if (Ui(r.kind) !== "Dynamic") continue;
		let t = E(r.componentId);
		if (t > 0 && !n.some((e) => e.scopeComponentId === t) && e.closest(`[data-ui-id="${t}"][data-ui-key]`) !== null) return !0;
	}
	return !1;
}
function UD(e) {
	let t = qD(e, "IsContent");
	return t.ok && t.value === !0;
}
var WD = /* @__PURE__ */ new Set();
function GD(e, t) {
	let n = E(t);
	if (n > 0) {
		for (let t = e.length - 1; t >= 0; t--) if (e[t].scopeComponentId === n) return {
			ok: !0,
			value: e[t].item
		};
	}
	return WD.has(n) || (WD.add(n), s("an item scope a binding parameter names is not on the stack; the binding resolves to nothing.", {
		targetId: n,
		stack: e
	})), LD;
}
function KD(e, t) {
	let n = e;
	for (let e of t.split(".")) {
		let t = qD(n, e);
		if (!t.ok) return;
		n = t.value;
	}
	return n;
}
function qD(e, t) {
	return JD(e, t, !0);
}
function JD(e, t, n) {
	if (e == null) return LD;
	if (t === ".") return {
		ok: !0,
		value: e
	};
	if (typeof e != "object") return LD;
	let r = e, i = YD(r, t);
	return Object.hasOwn(r, i) ? {
		ok: !0,
		value: r[i]
	} : Array.isArray(e) ? LD : (n && zD?.(r, t), RD);
}
function YD(e, t) {
	if (Object.hasOwn(e, t)) return t;
	let n = XD(t);
	if (Object.hasOwn(e, n)) return n;
	let r = null;
	for (let n in e) if (!(n.length !== t.length || !Object.hasOwn(e, n)) && (r ??= t.toLowerCase(), n.toLowerCase() === r)) return n;
	return n;
}
function XD(e) {
	let t = e.charAt(0);
	return t === t.toLowerCase() ? e : t.toLowerCase() + e.slice(1);
}
function ZD(e) {
	let t = e.itemTemplate;
	if (t == null) return null;
	let n = (e.itemTemplateParameters ?? []).filter((e) => Ui(e.kind) !== "Scope"), r = [], i = [], a = !1, o = 0, s = 0, c = 0;
	for (; c < t.length;) {
		let e = t[c];
		if (e === ".") {
			c++;
			continue;
		}
		if (e === "[") {
			if (c + 1 >= t.length || t[c + 1] !== "]" || s >= n.length) return null;
			let e = n[s];
			if (s++, c += 2, Ui(e.kind) !== "Dynamic") {
				r.push({
					kind: "element",
					key: e.value
				}), a = !0;
				continue;
			}
			r = [], i = [], a = !1, o = E(e.componentId);
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
function QD(e, t) {
	if (e == null || t == null) return LD;
	if (typeof t == "number") return Array.isArray(e) && t >= 0 && t < e.length ? {
		ok: !0,
		value: e[t]
	} : LD;
	if (typeof t != "string") return LD;
	if (!Array.isArray(e) && typeof e == "object") {
		let n = e;
		if (Object.hasOwn(n, t)) return {
			ok: !0,
			value: n[t]
		};
	}
	if (Array.isArray(e)) {
		for (let n of e) if (eO(n, t)) return {
			ok: !0,
			value: n
		};
	}
	return LD;
}
function $D(e, t, n) {
	if (e == null || t == null) return !1;
	if (Array.isArray(e)) {
		if (typeof t == "number") return t < 0 || t >= e.length ? !1 : (e[t] = n, !0);
		if (typeof t != "string") return !1;
		for (let r = 0; r < e.length; r++) if (eO(e[r], t)) return e[r] = n, !0;
		return !1;
	}
	if (typeof t != "string" || typeof e != "object") return !1;
	let r = e;
	return Object.hasOwn(r, t) ? (r[t] = n, !0) : !1;
}
function eO(e, t) {
	return typeof e == "object" && !!e && e.id === t;
}
//#endregion
//#region src/items/items-filter-sort.ts
function tO(e) {
	let t = e.closest(C)?.querySelector(":scope > [data-ui-items-query]")?.getAttribute("data-ui-items-query") ?? null;
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
function nO(e, t, n, r, i) {
	let a = n.getItemsFilterSortMetadata(t), o = tO(e);
	if (a === void 0 && o === null) {
		for (let t of G(e)) t.classList.remove(hi);
		return;
	}
	for (let n of G(e)) {
		let e = r.getItemValue(n);
		if (e === void 0) {
			s("item value is unknown, leaving the item visible.", {
				componentId: t,
				item: n
			}), n.classList.remove(hi);
			continue;
		}
		n.classList.toggle(hi, !rO(a, e, i, o));
	}
}
function rO(e, t, n, r = null) {
	return (e?.filters ?? []).every((e) => cO(e, t, n)) && (r?.filters ?? []).every((e) => Yf(KD(t, e.itemProperty), e.operator, e.value));
}
function iO(e, t, n = null) {
	return (e?.filters ?? []).some((e) => lO(e.source, e.activeOperator, e.activeValue, t)) || (n?.filters?.length ?? 0) > 0;
}
function aO(e, t, n = null) {
	let r = (e?.sorts ?? []).filter((e) => lO(e.source, e.activeOperator, e.activeValue, t)).sort((e, t) => e.priority - t.priority);
	return [...n?.sorts ?? [], ...r];
}
function oO(e, t, n) {
	return t.length === 0 ? [...e] : [...e].sort((e, r) => sO(n.getItemValue(e), n.getItemValue(r), t));
}
function sO(e, t, n) {
	for (let r of n) {
		let n = uO(Xf(KD(e, r.itemProperty)), Xf(KD(t, r.itemProperty)));
		if (n !== 0) return Ji(r.direction) === "Descending" ? -n : n;
	}
	return 0;
}
function cO(e, t, n) {
	if (!lO(e.source, e.activeOperator, e.activeValue, n)) return !0;
	let r = e.source !== null && e.source !== void 0 ? n.get(e.source, []) : e.value;
	return Yf(KD(t, e.itemProperty), e.operator, r);
}
function lO(e, t, n, r) {
	return e == null || Yf(r.get(e, []), t, n);
}
function uO(e, t) {
	if (e === t) return 0;
	let n = fO(e), r = fO(t);
	if (n !== r) return n - r;
	if (n === dO.Nothing) return 0;
	if (n === dO.Number) {
		let n = Number(e) - Number(t);
		return Number.isNaN(n) ? 0 : Math.sign(n);
	}
	return String(e).localeCompare(String(t));
}
var dO = {
	Nothing: 0,
	Number: 1,
	Text: 2
};
function fO(e) {
	return e == null ? dO.Nothing : typeof e == "number" ? Number.isNaN(e) ? dO.Nothing : dO.Number : typeof e == "string" && e.trim().length === 0 ? dO.Nothing : Number.isNaN(Number(e)) ? dO.Text : dO.Number;
}
//#endregion
//#region src/items/items-source-order.ts
var pO = /* @__PURE__ */ new WeakMap();
function mO(e, t) {
	let n = pO.get(e), r = n === void 0 ? [...t] : hO(n, t);
	return pO.set(e, r), r;
}
function hO(e, t) {
	let n = new Set(t), r = e.filter((e) => n.has(e));
	return r.length === t.length ? r : [...t];
}
function gO(e, t, n) {
	let r = n === null || n > e.length ? e.length : n;
	return e.splice(r, 0, t), e[r + 1] ?? null;
}
function _O(e, t) {
	let n = e.indexOf(t);
	n >= 0 && e.splice(n, 1);
}
function vO(e, t, n) {
	return _O(e, t), gO(e, t, n);
}
function yO(e, t, n) {
	let r = e.indexOf(t);
	r >= 0 && (e[r] = n);
}
function bO(e, t) {
	pO.set(e, [...t]);
}
function xO(e) {
	pO.delete(e);
}
//#endregion
//#region src/interactions/live-announcer.ts
var SO = "ui-announcer", CO = 7e3, wO = null;
function TO(e, t = "polite") {
	(wO ?? EO(document.body)).announce(e, t);
}
function EO(e) {
	return wO = new OO(e), wO;
}
function DO(e, t) {
	TO({
		key: "ui.move.done",
		args: {
			index: e,
			count: t
		}
	});
}
var OO = class {
	container;
	regions = /* @__PURE__ */ new Map();
	constructor(e) {
		this.container = e, this.ensureRegion("polite"), this.ensureRegion("assertive");
	}
	announce(e, t = "polite") {
		let n = document.createElement("div");
		return typeof e == "string" ? n.textContent = e : O.writeValue(n, null, e), this.ensureRegion(t).append(n), setTimeout(() => n.remove(), CO), n;
	}
	ensureRegion(e) {
		let t = this.regions.get(e);
		if (t !== void 0 && t.isConnected) return t;
		let n = `.${SO}[aria-live="${e}"]`, r = this.container.querySelector(n), i = r ?? document.createElement("div");
		return r === null && (i.className = SO, i.setAttribute("aria-live", e), this.container.append(i)), this.regions.set(e, i), i;
	}
}, kO = "ui-tab-item";
function AO(e) {
	let t = e.parentElement;
	return t !== null && !t.hasAttribute("data-ui-items-host") && t.closest("[data-ui-items-host]") === t.parentElement ? t : e;
}
function jO(e) {
	return e instanceof HTMLElement && e.classList.contains("ui-tab-item") ? AO(e).parentElement : null;
}
function MO(e, t) {
	return Os(AO(e), t);
}
//#endregion
//#region src/interactions/items-reorder-engine.ts
var NO = ".ui-items-view__item, .ui-table__row", PO = "ui-row--dragging", FO = "--ui-row-drop-offset", IO = "move", LO = ".ui-items-view--wrap", RO = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight"
]);
function zO(e, t) {
	ld(e, IO, { index: t });
}
function BO(e) {
	return {
		name: IO,
		registration: {
			dynamicParameters: (e) => {
				let t = VO(e.domEvent);
				return t === null ? null : [...e.dynamicParameters, t];
			},
			..._D((t) => e === void 0 ? null : HO(e, t), (t) => "pending" in t ? e?.settle(t.pending) : e?.resort(t.strip))
		}
	};
}
function VO(e) {
	let t = e instanceof CustomEvent ? e.detail?.index : void 0;
	return typeof t == "number" ? t : null;
}
function HO(e, t) {
	let n = VO(t);
	if (n === null || !(t.target instanceof Element)) return null;
	let r = jO(t.target);
	if (r !== null) return { strip: r };
	let i = t.target.closest(NO), a = i?.parentElement ?? null, o = i === null || a === null || !a.hasAttribute("data-ui-items-host") ? null : e.ahead(a, R(i), n);
	return o === null ? null : { pending: o };
}
var UO = class {
	root;
	services;
	drag = null;
	lifted = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.services = e.services, this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("pointerup", () => this.release(), !0), this.root.addEventListener("pointercancel", () => this.release(), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", () => this.endDrag(), !0);
	}
	handlePointerDown(e) {
		if (this.release(), !(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = this.liftableRow(e.target), n = t === null ? null : L(t.row);
		if (t === null || n === null) return;
		let r = JO(t.root, t.row);
		if (r === null ? !YO(e.target, t.row) : !r.contains(e.target)) return;
		r !== null && (Lu(t.root, tk(t.row.parentElement ?? t.root), t.row), t.root.focus({ preventScroll: !0 }));
		let i = document.getSelection();
		i !== null && !i.isCollapsed && i.removeAllRanges(), n.draggable || (n.draggable = !0, this.lifted = n);
	}
	release() {
		this.lifted !== null && this.drag === null && (this.lifted.draggable = !1, this.lifted = null);
	}
	liftableRow(e) {
		let t = e.closest(Kl), n = t?.parentElement ?? null, r = n?.closest(I) ?? null;
		if (t === null || n === null || r === null || !t.matches(NO) || !n.hasAttribute("data-ui-items-host") || k(r) || !OD(t)) return null;
		let i = r.hasAttribute("data-ui-rows-draggable") && !this.isSorted(r, n);
		return i || r.hasAttribute("data-ui-drag-kind") ? {
			root: r,
			row: t,
			moves: i
		} : null;
	}
	isSorted(e, t) {
		let n = Oa(e);
		return this.services === void 0 || n === null ? !1 : aO(this.services.metadata.getItemsFilterSortMetadata(n), this.services.state, tO(t)).length > 0;
	}
	handleDragStart(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.liftableRow(e.target), n = t?.row.parentElement ?? null, r = t === null ? null : L(t.row);
		if (t === null || n === null || r === null || e.target !== r) return;
		this.drag = {
			...t,
			host: n
		};
		let i = TD(t.root, n, ED(t.row, tk(n))), a = (i?.rows ?? []).filter((e) => e !== t.row).map((e) => L(e) ?? e);
		Xg(e, t.root, r, PO, R(t.row), a, kD(i, t.moves)), AD(e, i, () => this.endDrag());
	}
	handleDragOver(e) {
		let t = this.ownDrag(e);
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let n = ZO(t.root, t.host), r = tk(t.host), i = KO(t.host, e.target, e, n, r);
		e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), i === null || this.indexOf(t, i.anchor, i.side) === null ? nk(t.root, null) : nk(t.root, i, $O(r, i, n));
	}
	ownDrag(e) {
		let t = this.drag;
		return t !== null && t.moves && e.target instanceof Element && t.host.contains(e.target) ? t : null;
	}
	indexOf(e, t, n) {
		if (XO(t) !== XO(e.row)) return null;
		let r = WO(qO(e.host, this.services?.keysOf), R(e.row), R(t), n);
		return r === null ? null : r + yD(e.host);
	}
	handleDragLeave(e) {
		let t = this.drag;
		t !== null && e instanceof DragEvent && $g(e, t.host) && nk(t.root, null);
	}
	handleDrop(e) {
		let t = this.ownDrag(e);
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		e.preventDefault();
		let n = KO(t.host, e.target, e, ZO(t.root, t.host), tk(t.host)), r = n === null ? null : this.indexOf(t, n.anchor, n.side);
		this.endDrag(), r !== null && zO(t.row, r);
	}
	endDrag() {
		let e = this.drag;
		this.drag = null, this.release(), e !== null && (Zg(e.root, PO), nk(e.root, null));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !e.altKey || !N(e, { alt: !0 }) || !RO.has(e.key) || !(e.target instanceof Element)) return;
		let t = ku(e);
		if (t === null || !t.root.matches(".ui-items-view, .ui-table")) return;
		let n = du(t.root), r = n === null ? null : ZO(t.root, n), i = e.key === "ArrowLeft" || e.key === "ArrowRight";
		if (n === null || r === null || i && !r.across) return;
		let a = tk(n), o = Mu(a);
		if (o === null || this.liftableRow(o)?.moves !== !0) return;
		e.preventDefault();
		let s = e.key === "ArrowDown" || e.key === "ArrowRight", c = !i && t.root.matches(LO) ? od(a, o, s) : a[a.indexOf(o) + (s ? 1 : -1)] ?? null, l = c === null ? null : this.indexOf({
			host: n,
			row: o
		}, c, s ? "after" : "before");
		l !== null && (zO(o, l), DO(l + 1, bD(n, "data-ui-window-total") ?? yD(n) + qO(n, this.services?.keysOf).length));
	}
};
function WO(e, t, n, r) {
	let i = e.indexOf(t);
	if (i < 0 || t === n) return null;
	let a = GO(e.filter((e) => e !== t), n, r);
	return a === i ? null : a;
}
function GO(e, t, n) {
	let r = e.indexOf(t);
	return r < 0 ? null : n === "before" ? r : r + 1;
}
function KO(e, t, n, r, i) {
	if (t.closest("[data-ui-group-header]")?.parentElement === e) return null;
	let a = t.closest(Kl);
	for (; a !== null && a.parentElement !== e;) a = a.parentElement?.closest(Kl) ?? null;
	if (a ??= ek(i, n), a === null) return null;
	let o = (L(a) ?? a).getBoundingClientRect();
	if ((r.across ? n.clientX < o.left + o.width / 2 : n.clientY < o.top + o.height / 2) === r.rightToLeft) return {
		anchor: a,
		side: "after"
	};
	let s = i[i.indexOf(a) - 1];
	return s !== void 0 && QO(s, a, r) ? {
		anchor: s,
		side: "after"
	} : {
		anchor: a,
		side: "before"
	};
}
function qO(e, t) {
	switch (vD(e)) {
		case "virtualized": return [...t?.(e) ?? G(e).map(R)];
		case "windowed": return G(e).map(R);
		default: return mO(e, G(e)).map(R);
	}
}
function JO(e, t) {
	let n = e.hasAttribute("data-ui-rows-drag-handle") ? t.querySelector(`:scope > .${ve}`) : null;
	return n !== null && n.getClientRects().length > 0 ? n : null;
}
function YO(e, t) {
	return vl(e, t) === null && e.closest("[data-ui-no-row-drag]") === null;
}
function XO(e) {
	return e.getAttribute("data-ui-group") ?? "";
}
function ZO(e, t) {
	let n = e.matches(".ui-orientation--horizontal, .ui-items-view--wrap");
	return {
		across: n,
		rightToLeft: n && getComputedStyle(t).direction === "rtl"
	};
}
function QO(e, t, n) {
	if (XO(e) !== XO(t)) return !1;
	if (!n.across) return !0;
	let r = (L(e) ?? e).getBoundingClientRect(), i = (L(t) ?? t).getBoundingClientRect();
	return r.top < i.bottom && i.top < r.bottom;
}
function $O(e, t, n) {
	let r = t.side === "after" ? e[e.indexOf(t.anchor) + 1] : void 0;
	if (r === void 0 || !QO(t.anchor, r, n)) return -1;
	let i = (L(t.anchor) ?? t.anchor).getBoundingClientRect(), a = (L(r) ?? r).getBoundingClientRect(), o = n.across ? n.rightToLeft ? i.left - a.right : a.left - i.right : a.top - i.bottom;
	return Math.max(o, 0) / 2;
}
function ek(e, t) {
	let n = null, r = Infinity;
	for (let i of e) {
		let e = (L(i) ?? i).getBoundingClientRect(), a = Math.max(e.left - t.clientX, 0, t.clientX - e.right), o = Math.max(e.top - t.clientY, 0, t.clientY - e.bottom), s = a * a + o * o;
		s < r && (n = i, r = s);
	}
	return n;
}
function tk(e) {
	return G(e).filter((e) => e instanceof HTMLElement && e.matches(Kl) && L(e) !== null);
}
function nk(e, t, n = 0) {
	let r = t === null ? null : L(t.anchor);
	for (let t of e.querySelectorAll(`[${ye}]`)) t !== r && (t.removeAttribute(ye), t.style.removeProperty(FO));
	if (r === null || t === null) return;
	r.getAttribute("data-ui-row-drop") !== t.side && r.setAttribute(ye, t.side);
	let i = `${n}px`;
	r.style.getPropertyValue(FO) !== i && r.style.setProperty(FO, i);
}
function rk(e) {
	e.classList.remove(PO), e.querySelector(`:scope > [${ie}]`)?.classList.remove(PO);
}
//#endregion
//#region src/interactions/tree-drop.ts
var ik = "--ui-tree-drop-depth";
function ak(e) {
	return e.querySelector(`.${sr}`);
}
function ok(e, t) {
	if (A(e)) return !1;
	let n = t?.getAttribute(yr);
	return n === "true" || n !== "false" && e.hasAttribute("aria-expanded");
}
function sk(e, t) {
	let n = e.length === 0 ? null : t(e);
	return n === null || ok(n, ak(n));
}
function ck(e, t) {
	let n = ak(e);
	if (ok(e, n)) return R(e);
	let r = n?.getAttribute("data-ui-tree-parent") ?? "";
	return sk(r, t) ? r : null;
}
function lk(e, t, n = "", r) {
	for (let n of e.querySelectorAll(`[${cr}]`)) n !== t && (n.removeAttribute(cr), n.style.removeProperty(ik));
	t !== null && (t.setAttribute(cr, n), r === void 0 ? t.style.removeProperty(ik) : t.style.setProperty(ik, String(r)));
}
function uk(e, t, n) {
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
function dk(e, t, n) {
	let r = e.find((e) => e.key === t);
	if (r === void 0) return null;
	let i = fk(e, r, n);
	return i === null || !pk(e, i.parent) ? null : i;
}
function fk(e, t, n) {
	if (n === "in") {
		let n = uk(e, t.key, !0);
		return n === null ? null : {
			parent: n,
			before: null
		};
	}
	if (n === "out") {
		let n = uk(e, t.key, !1);
		return n === null ? null : {
			parent: n,
			before: hk(e, n, t.parent, !1)
		};
	}
	let r = mk(e, t.parent), i = r.findIndex((e) => e.key === t.key), a = n === "up" ? -1 : 1, o = i + a;
	for (; o >= 0 && o < r.length && r[o].shown === !1;) o += a;
	return o < 0 || o >= r.length ? null : {
		parent: t.parent,
		before: n === "up" ? r[o].key : r[o + 1]?.key ?? null
	};
}
function pk(e, t) {
	return t.length === 0 || e.find((e) => e.key === t)?.takesDrop === !0;
}
function mk(e, t) {
	return e.filter((e) => e.parent === t);
}
function hk(e, t, n, r, i = /* @__PURE__ */ new Set()) {
	let a = mk(e, t);
	for (let e = a.findIndex((e) => e.key === n) + 1; e > 0 && e < a.length; e++) if (!i.has(a[e].key) && (!r || a[e].shown !== !1)) return a[e].key;
	return null;
}
function gk(e, t, n) {
	let r = mk(e, n.parent).map((e) => e.key), i = new Set(t), a = n.before !== null && i.has(n.before) ? hk(e, n.parent, n.before, !1, i) : n.before, o = [], s = null;
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
var _k = "drop:", vk = "ui-row--cut", yk = {
	code: "KeyX",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
}, bk = {
	code: "KeyC",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
}, xk = {
	code: "KeyV",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
};
function Sk(e) {
	return {
		dynamicParameters: (e) => {
			let t = Ck(e.domEvent);
			return t === null ? null : [...e.dynamicParameters, JSON.stringify(t.drop)];
		},
		..._D((t) => wk(e, t), (t) => e?.settle(t))
	};
}
function Ck(e) {
	let t = e instanceof CustomEvent ? e.detail : null;
	return t?.drop === void 0 ? null : t;
}
function wk(e, t) {
	let n = Ck(t)?.transfer ?? null;
	return n === null || e === void 0 ? null : e.ahead(n.source, n.target, n.keys, n.index);
}
var Tk = class {
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
		let t = jD(e), n = e.target instanceof Element ? e.target : null, r = t === null || n === null ? null : this.targetOf(t, n);
		if (t === null || n === null || r === null) return null;
		let i = Ek(t, r, Dk(e)), a = i === null ? null : this.landingOf(r, n, e);
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
		let r = e.matches(".ui-items-view, .ui-table") ? du(e) : null;
		if (r !== null) {
			let i = tk(r), a = ZO(e, r), o = qO(r, this.options.keysOf), s = t !== null && n !== null ? KO(r, t, n, a, i) : Ok(i);
			return {
				index: ((s === null ? null : GO(o, R(s.anchor), s.side)) ?? o.length) + yD(r),
				folder: null,
				list: r,
				mark: () => s === null ? e.setAttribute(ge, "") : nk(e, s, $O(i, s, a))
			};
		}
		if (e.classList.contains("ui-tree")) {
			let n = kk(e, t ?? document.activeElement);
			if (n === null) return null;
			let r = n.length === 0 ? du(e) : Ak(e, n);
			return {
				index: null,
				folder: n,
				list: null,
				mark: () => lk(e, r)
			};
		}
		return {
			index: null,
			folder: null,
			list: null,
			mark: () => {
				e.setAttribute(ge, ""), e_(e, !0);
			}
		};
	}
	unmark() {
		let e = this.marked;
		this.marked = null, e !== null && (e.removeAttribute(ge), e_(e, !1), e.matches(".ui-items-view, .ui-table") ? nk(e, null) : e.classList.contains("ui-tree") && lk(e, null));
	}
	handleDragLeave(e) {
		this.marked !== null && e instanceof DragEvent && $g(e, this.marked) && this.unmark();
	}
	handleDrop(e) {
		let t = e instanceof DragEvent ? this.dropOf(e) : null;
		t !== null && (e.preventDefault(), this.unmark(), MD(), this.drop(t.drag, t.target, t.effect, t.landing));
	}
	drop(e, t, n, r) {
		let i = n === "move" && r.list !== null && r.index !== null && e.host.isConnected && e.root.matches(".ui-items-view, .ui-table") && t.getAttribute("data-ui-drag-kind") === e.kind && vD(e.host) === "plain" && vD(r.list) === "plain", a = {
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
		t.dispatchEvent(new CustomEvent(_k + e.kind, {
			bubbles: !0,
			detail: a
		}));
	}
	endDrag() {
		this.unmark(), MD();
	}
	handleKeyDown(e) {
		if (!(!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element))) {
			if (e.key === "Escape") {
				this.clipboard !== null && !M(e) && (this.clipboard.items.root.isConnected && e.preventDefault(), this.letGo());
				return;
			}
			al(e.target) || (Sc(xk, e) ? this.paste(e, e.target) : Sc(yk, e) ? this.take(e, e.target, !0) : Sc(bk, e) && this.take(e, e.target, !1));
		}
	}
	letGo() {
		for (let e of this.clipboard?.items.rows ?? []) (L(e) ?? e).classList.remove(vk);
		this.clipboard = null;
	}
	paste(e, t) {
		let n = this.clipboard, r = n === null ? null : this.targetOf(n.items, t), i = n === null || r === null ? null : Ek(n.items, r, !n.cut), a = r === null || i === null ? null : this.landingOf(r, null, null);
		n !== null && r !== null && i !== null && a !== null && (e.preventDefault(), this.drop(n.items, r, i, a), n.cut && this.letGo());
	}
	take(e, t, n) {
		let r = document.getSelection();
		if (r !== null && !r.isCollapsed) return;
		let i = Ou(t), a = i === null ? null : du(i.root);
		if (i === null || a === null || k(i.root) || !i.root.hasAttribute("data-ui-drag-kind")) return;
		let o = tk(a), s = i.row ?? Mu(o), c = s === null || !OD(s) ? null : TD(i.root, a, ED(s, o));
		if (!(c === null || !c.effects.has(n ? "move" : "copy")) && (e.preventDefault(), this.letGo(), this.clipboard = {
			items: c,
			cut: n
		}, n)) for (let e of c.rows) (L(e) ?? e).classList.add(vk);
	}
};
function Ek(e, t, n) {
	let r = n || t.getAttribute("data-ui-drag-kind") !== e.kind ? "copy" : "move";
	return e.effects.has(r) ? r : n ? null : r === "move" ? "copy" : "move";
}
function Dk(e) {
	return jc() ? e.altKey : e.ctrlKey;
}
function Ok(e) {
	let t = Nu(e);
	return t === null ? null : {
		anchor: t,
		side: "after"
	};
}
function kk(e, t) {
	let n = t?.closest(".ui-tree__row") ?? null;
	return n === null || n.closest(".ui-tree") !== e ? "" : ck(n, (t) => Ak(e, t));
}
function Ak(e, t) {
	return e.querySelector(`.${or}[${y}="${w(t)}"]`);
}
//#endregion
//#region src/interactions/temporal-range.ts
function jk(e, t, n) {
	if (t === "start" || e.start === null) {
		let t = Fk(n, e.start ?? n);
		return {
			start: t,
			end: e.end !== null && e.end.getTime() < t.getTime() ? null : e.end,
			active: "end",
			complete: !1
		};
	}
	return n.getTime() < Ik(e.start).getTime() ? {
		start: Fk(n, e.start),
		end: null,
		active: "end",
		complete: !1
	} : {
		start: e.start,
		end: Fk(n, e.end ?? e.start),
		active: "end",
		complete: !0
	};
}
function Mk(e, t, n) {
	if (t === null || n === null) return !1;
	let r = Ik(e).getTime();
	return r > Ik(t).getTime() && r < Ik(n).getTime();
}
function Nk(e, t, n) {
	return !n && Mk(e, t.start, t.end);
}
function Pk(e) {
	return e.start !== null && e.end !== null && e.end.getTime() < e.start.getTime() ? {
		start: e.end,
		end: e.start
	} : e;
}
function Fk(e, t) {
	return no(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function Ik(e) {
	return no(e.getFullYear(), e.getMonth(), e.getDate());
}
//#endregion
//#region src/interactions/temporal-dom.ts
var K = "ui-temporal-input", Lk = "ui-calendar", Rk = `.${K}, .${Lk}`, zk = "ui-temporal-input__value-input", Bk = "ui-temporal-input__end-value-input", Vk = "data-ui-temporal-range", Hk = "data-ui-temporal-end", Uk = "data-ui-temporal-mode", Wk = "data-ui-temporal-format", Gk = "data-ui-temporal-default-format", Kk = "data-ui-temporal-min", qk = "data-ui-temporal-max", Jk = "data-ui-temporal-step", Yk = "data-ui-temporal-step-unit", Xk = "data-ui-temporal-marked-days", Zk = "data-ui-temporal-marked-only", Qk = "data-ui-temporal-page-culture", $k = "data-ui-temporal-months", eA = "data-ui-temporal-months-genitive", tA = "data-ui-temporal-months-short", nA = "data-ui-temporal-daynames", rA = "data-ui-temporal-weekdays", iA = "data-ui-temporal-first-day", aA = "data-ui-temporal-am", oA = "data-ui-temporal-pm", sA = /* @__PURE__ */ new Set([
	Wk,
	Gk,
	Kk,
	qk,
	$k,
	aA,
	oA,
	Xk,
	Zk
]), cA = 2e3;
function lA(e) {
	let t = e.getAttribute(Uk);
	return t === "time" || t === "date-time" ? t : "date";
}
function uA(e) {
	let t = e.getAttribute(Wk);
	return t === null || t.trim().length === 0 ? e.getAttribute(Gk) ?? "" : t;
}
function dA(e) {
	let t = e.getAttribute(Yk), n = Math.max(1, Math.trunc(Number(e.getAttribute(Jk))) || 1);
	return {
		unit: t === "hour" || t === "minute" || t === "second" ? t : "day",
		hour: t === "hour" ? n : 1,
		minute: t === "minute" ? n : 1,
		second: t === "second" ? n : 1
	};
}
function fA(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function pA(e, t) {
	return t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function mA(e, t, n) {
	let r = new Date(e);
	return t === "hour" ? r.setHours(n) : t === "minute" ? r.setMinutes(n) : r.setSeconds(n), r;
}
function hA(e) {
	return {
		monthNames: gA(e, $k),
		monthGenitiveNames: gA(e, eA),
		abbreviatedMonthNames: gA(e, tA),
		dayNames: gA(e, nA),
		abbreviatedDayNames: gA(e, rA),
		amDesignator: e.getAttribute(aA) ?? "AM",
		pmDesignator: e.getAttribute(oA) ?? "PM"
	};
}
function gA(e, t) {
	return (e.getAttribute(t) ?? "").split("|");
}
function _A(e, t) {
	e.hasAttribute(Qk) && (xA(e, eA, t.monthGenitiveNames.join("|")), xA(e, tA, t.abbreviatedMonthNames.join("|")), xA(e, nA, t.dayNames.join("|")), xA(e, rA, t.abbreviatedDayNames.join("|")), xA(e, $k, t.monthNames.join("|")), xA(e, aA, t.amDesignator), xA(e, oA, t.pmDesignator), xA(e, Gk, bA(lA(e), dA(e), t)));
}
function vA(e) {
	for (let t = 0; t < e.length;) {
		let n = Xa(e, t);
		if (n === "h" || n === "hh") return !0;
		t += n?.length ?? 1;
	}
	return !1;
}
function yA(e, t, n) {
	if (!t) return String(e).padStart(2, "0");
	let r = e < 12 ? n.amDesignator : n.pmDesignator, i = String(vo(e));
	return r.length === 0 ? i : `${i} ${r}`;
}
function bA(e, t, n) {
	let r = t.unit === "second";
	return e === "date" ? n.date : e === "time" ? r ? n.longTime : n.shortTime : Va(n, r);
}
function xA(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function SA(e) {
	return e.hasAttribute(Vk);
}
function CA(e) {
	return e !== null && e.hasAttribute(Hk);
}
function wA(e) {
	return q(e, !1);
}
function q(e, t) {
	let n = TA(e, t);
	return n === null ? null : KA(n.value, lA(e));
}
function TA(e, t) {
	return e.querySelector(`.${t ? Bk : zk}`);
}
function EA(e, t) {
	let n = e.getAttribute(t) ?? "", r = KA(n, lA(e)), i = IA(n);
	if (r === null || i === null) return r;
	let a = FA(e, !1), o = /* @__PURE__ */ new Date(DA(r) - OA(i) * 6e4);
	if (a !== null) {
		let e = new Date(o.getTime() + OA(a) * 6e4);
		return no(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate(), e.getUTCHours(), e.getUTCMinutes(), e.getUTCSeconds(), e.getUTCMilliseconds());
	}
	return kA(e) ? r : o;
}
function DA(e) {
	let t = /* @__PURE__ */ new Date(0);
	return t.setUTCFullYear(e.getFullYear(), e.getMonth(), e.getDate()), t.setUTCHours(e.getHours(), e.getMinutes(), e.getSeconds(), e.getMilliseconds()), t.getTime();
}
function OA(e) {
	let t = /^([+-])(\d{2}):?(\d{2})?$/.exec(e);
	return t === null ? 0 : (t[1] === "-" ? -1 : 1) * (Number(t[2]) * 60 + Number(t[3] ?? "0"));
}
function kA(e) {
	return (TA(e, !1)?.value.trim() ?? "").length > 0 || (TA(e, !0)?.value.trim() ?? "").length > 0;
}
function AA(e) {
	let t = EA(e, Kk), n = EA(e, qk), r = (e.getAttribute(Xk) ?? "").split(" ").filter((e) => e.length > 0);
	return {
		min: t === null ? null : qA(t, "date"),
		max: n === null ? null : qA(n, "date"),
		marked: new Set(r),
		markedOnly: e.hasAttribute(Zk)
	};
}
function jA(e, t) {
	return (e.min === null || t >= e.min) && (e.max === null || t <= e.max) && (!e.markedOnly || e.marked.has(t));
}
function MA(e, t, n) {
	RA(e, t === null ? "" : NA(e, t, n), n);
}
function NA(e, t, n) {
	let r = lA(e), i = qA(t, r);
	return r === "date-time" ? i + (FA(e, n) ?? LA(t)) : i;
}
var PA = /T\d{1,2}:\d{1,2}(?::\d{1,2}(?:\.\d+)?)?(Z|[+-]\d{2}(?::?\d{2})?)$/i;
function FA(e, t) {
	return IA(TA(e, t)?.value ?? "") ?? IA(TA(e, !t)?.value ?? "");
}
function IA(e) {
	return PA.exec(e.trim())?.[1] ?? null;
}
function LA(e) {
	let t = -e.getTimezoneOffset(), n = Math.abs(t);
	return `${t < 0 ? "-" : "+"}${JA(Math.floor(n / 60))}:${JA(n % 60)}`;
}
function RA(e, t, n) {
	let r = TA(e, n);
	r !== null && r.value !== t && (r.value = t, r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function zA(e, t) {
	let n = t.trim(), r = n.length === 0 ? null : oo(n, uA(e), hA(e));
	return r === null ? n : qA(to(r), lA(e));
}
function BA(e) {
	if (!SA(e)) return;
	let t = {
		start: q(e, !1),
		end: q(e, !0)
	};
	if (Pk(t) === t) return;
	let n = TA(e, !1)?.value ?? "";
	RA(e, TA(e, !0)?.value ?? "", !1), RA(e, n, !0);
}
function VA(e) {
	let t = EA(e, Kk), n = EA(e, qk);
	if (t === null && n === null) return null;
	for (let r of SA(e) ? [!1, !0] : [!1]) {
		let i = q(e, r);
		if (i !== null && t !== null && i.getTime() < t.getTime()) return {
			key: "ui.value.before",
			args: { min: Ga(t, uA(e), hA(e)) }
		};
		if (i !== null && n !== null && i.getTime() > n.getTime()) return {
			key: "ui.value.after",
			args: { max: Ga(n, uA(e), hA(e)) }
		};
	}
	return null;
}
function HA(e) {
	return WA(e, UA(e, /* @__PURE__ */ new Date()));
}
function UA(e, t) {
	let n = EA(e, Kk), r = EA(e, qk);
	return n !== null && t.getTime() < n.getTime() ? n : r !== null && t.getTime() > r.getTime() ? r : t;
}
function WA(e, t) {
	let n = dA(e), r = new Date(t);
	return r.setMilliseconds(0), r.setSeconds(n.unit === "second" ? Math.floor(r.getSeconds() / n.second) * n.second : 0), n.unit === "hour" ? r.setMinutes(0) : r.setMinutes(Math.floor(r.getMinutes() / n.minute) * n.minute), r.setHours(Math.floor(r.getHours() / n.hour) * n.hour), r;
}
var GA = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/;
function KA(e, t) {
	let n = e.trim();
	if (n.length === 0) return null;
	if (t === "time") {
		let e = GA.exec(n);
		return e === null ? null : new Date(cA, 0, 1, Number(e[1]), Number(e[2]), Number(e[3] ?? "0"));
	}
	let r = eo(n);
	return r === null ? null : to(r);
}
function qA(e, t) {
	let n = `${JA(e.getHours())}:${JA(e.getMinutes())}:${JA(e.getSeconds())}`;
	if (t === "time") return n;
	let r = `${String(e.getFullYear()).padStart(4, "0")}-${JA(e.getMonth() + 1)}-${JA(e.getDate())}`;
	return t === "date" ? r : `${r}T${n}`;
}
function JA(e) {
	return String(e).padStart(2, "0");
}
//#endregion
//#region src/interactions/temporal-calendar.ts
var YA = "ui-temporal-input__day", XA = "ui-temporal-input__month", ZA = 3, QA = "data-ui-temporal-nav", $A = "data-ui-temporal-day", ej = 366;
function tj(e) {
	let t = wA(e);
	return {
		view: Tj(t ?? UA(e, /* @__PURE__ */ new Date())),
		pane: "days",
		focusedDay: t,
		activeEnd: "start",
		hoverDay: null,
		choosingEnd: !1
	};
}
function nj(e, t, n, r) {
	let i = wj("div", `${K}__calendar`), a = wj("div", `${K}__calendar-header`), o = AA(e), s = Cj("previous", "‹", O.text("ui.picker.previous"));
	s.disabled = rj(o, t, -1) === null, a.append(s);
	let c = Cj("pane", t.pane === "days" ? `${n.monthNames[t.view.getMonth()]} ${t.view.getFullYear()}` : String(t.view.getFullYear()));
	c.classList.add(`${K}__calendar-label`), a.append(c);
	let l = Cj("next", "›", O.text("ui.picker.next"));
	return l.disabled = rj(o, t, 1) === null, a.append(l), i.append(a), i.append(t.pane === "days" ? sj(e, t, n, r, o) : cj(t, n, o)), i;
}
function rj(e, t, n) {
	let r = t.pane === "months", i = Oj(t.view, n * (r ? 12 : 1));
	return aj(e, ij(i, r ? 4 : 7)) ? oj(e, i) : null;
}
function ij(e, t) {
	return qA(e, "date").slice(0, t);
}
function aj(e, t) {
	return (e.min === null || t >= e.min.slice(0, t.length)) && (e.max === null || t <= e.max.slice(0, t.length));
}
function oj(e, t) {
	let n = ij(t, 7), r = e.min !== null && n < e.min.slice(0, 7) ? e.min : e.max !== null && n > e.max.slice(0, 7) ? e.max : null, i = r === null ? null : KA(r, "date");
	return i === null ? t : Tj(i);
}
function sj(e, t, n, r, i) {
	let a = bj(e), o = wj("div", `${K}__weekdays`);
	for (let e = 0; e < 7; e++) {
		let t = wj("span", `${K}__weekday`);
		t.textContent = n.abbreviatedDayNames[(a + e) % 7], o.append(t);
	}
	let s = wj("div", `${K}__days`), c = Ik(/* @__PURE__ */ new Date()), l = SA(e), u = l ? q(e, !1) : r, d = l ? q(e, !0) : null, f = Ej(t.view, a);
	for (let e = 0; e < 42; e++) {
		let n = Dj(f, e), r = qA(n, "date"), a = wj("button", YA);
		a.type = "button", a.tabIndex = -1, a.textContent = String(n.getDate()), a.setAttribute($A, r), n.getMonth() !== t.view.getMonth() && a.classList.add(`${YA}--outside`), kj(n, c) && (a.classList.add(`${YA}--today`), a.setAttribute("aria-current", "date")), i.marked.has(r) && a.classList.add(`${YA}--marked`);
		let o = u !== null && kj(n, u), p = d !== null && kj(n, d);
		a.setAttribute("aria-pressed", o || p ? "true" : "false"), (o || p) && a.classList.add(`${YA}--selected`), l && (o || p) && a.setAttribute("aria-description", O.text(o ? "ui.picker.start" : "ui.picker.end")), Nk(n, {
			start: u,
			end: d
		}, t.choosingEnd) && a.classList.add(`${YA}--within`), jA(i, r) || (a.disabled = !0), s.append(a);
	}
	let p = wj("div", `${K}__calendar-pane`);
	return p.append(o, s), p;
}
function cj(e, t, n) {
	let r = wj("div", `${K}__months`);
	for (let i = 0; i < 12; i++) {
		let a = wj("button", XA);
		a.type = "button", a.textContent = t.abbreviatedMonthNames[i], a.setAttribute(QA, `month:${i}`), i === e.view.getMonth() && (a.classList.add(`${XA}--selected`), a.setAttribute("aria-current", "true")), aj(n, ij(no(e.view.getFullYear(), i, 1), 7)) || (a.disabled = !0), r.append(a);
	}
	let i = [...r.children];
	return P(i, i.find((e) => e.getAttribute("aria-current") === "true" && !e.disabled) ?? i.find((e) => !e.disabled) ?? null), r;
}
function lj(e, t) {
	let n = [...e.parentElement?.querySelectorAll(".ui-temporal-input__month") ?? []], r = n.indexOf(e), i = r === -1 ? null : uj(t, r % ZA);
	if (i === null) return null;
	for (let e = r + i.offset; e >= 0 && e < n.length; e += i.step) if (!n[e].disabled) return n[e];
	return null;
}
function uj(e, t) {
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
			offset: ZA,
			step: ZA
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
function dj(e) {
	let t = wj("div", `${K}__period-caption`);
	return t.textContent = O.text(e.activeEnd === "end" ? "ui.picker.end" : "ui.picker.start"), t;
}
function fj(e, t, n) {
	let r = AA(e);
	if (n.startsWith("month:")) {
		let i = no(t.view.getFullYear(), Number(n.slice(6)), 1);
		return aj(r, ij(i, 7)) && (t.view = i, t.pane = "days", t.focusedDay = _j(r, gj(i, t.focusedDay ?? wA(e) ?? UA(e, /* @__PURE__ */ new Date())))), !0;
	}
	switch (n) {
		case "previous": return t.view = rj(r, t, -1) ?? t.view, !0;
		case "next": return t.view = rj(r, t, 1) ?? t.view, !0;
		case "pane": return t.pane = t.pane === "days" ? "months" : "days", !0;
		default: return !1;
	}
}
function pj(e, t, n) {
	if (SA(e)) {
		mj(e, t, n);
		return;
	}
	let r = Fk(n, wA(e) ?? HA(e));
	t.focusedDay = r, t.view = Tj(r), MA(e, r, !1);
}
function mj(e, t, n) {
	let r = jk({
		start: q(e, !1),
		end: q(e, !0)
	}, t.activeEnd, Fk(n, HA(e)));
	t.focusedDay = r.end ?? r.start, t.view = Tj(n), t.activeEnd = r.active, t.choosingEnd = !r.complete, t.hoverDay = null, MA(e, r.end, !0), MA(e, r.start, !1);
}
function hj(e, t, n, r = !1) {
	let i = vj(n), a = yj(t, n, bj(e), r);
	if (a === null) return null;
	let o = AA(e);
	if (i === 0) return _j(o, a);
	let s = a;
	for (let e = 0; e < ej; e++) {
		if (jA(o, qA(s, "date"))) return s;
		s = Dj(s, i);
	}
	return t;
}
function gj(e, t) {
	let n = no(e.getFullYear(), e.getMonth() + 1, 0).getDate();
	return no(e.getFullYear(), e.getMonth(), Math.min(t.getDate(), n), t.getHours(), t.getMinutes(), t.getSeconds());
}
function _j(e, t) {
	let n = qA(t, "date"), r = e.min !== null && n < e.min ? e.min : e.max !== null && n > e.max ? e.max : null, i = r === null ? null : KA(r, "date");
	return i === null ? t : Fk(i, t);
}
function vj(e) {
	switch (e) {
		case "ArrowLeft": return -1;
		case "ArrowRight": return 1;
		case "ArrowUp": return -7;
		case "ArrowDown": return 7;
		default: return 0;
	}
}
function yj(e, t, n, r) {
	let i = (e.getDay() - n + 7) % 7;
	switch (t) {
		case "ArrowLeft": return Dj(e, -1);
		case "ArrowRight": return Dj(e, 1);
		case "ArrowUp": return Dj(e, -7);
		case "ArrowDown": return Dj(e, 7);
		case "PageUp": return Oj(e, r ? -12 : -1);
		case "PageDown": return Oj(e, r ? 12 : 1);
		case "Home": return Dj(e, -i);
		case "End": return Dj(e, 6 - i);
		default: return null;
	}
}
function bj(e) {
	let t = Number(e.getAttribute(iA));
	return Number.isInteger(t) && t >= 0 && t <= 6 ? t : 1;
}
function xj(e, t, n, r) {
	let i = [...e.querySelectorAll(`.${YA}`)];
	if (i.length === 0) return;
	let a = qA(Ik(t.focusedDay ?? n ?? /* @__PURE__ */ new Date()), "date"), o = i.find((e) => e.getAttribute("data-ui-temporal-day") === a && !e.disabled) ?? i.find((e) => !e.disabled);
	o !== void 0 && (P(i, o), r && z(o));
}
function Sj(e, t) {
	let n = t.activeEnd === "end" && t.hoverDay !== null ? q(e, !1) : null, r = t.hoverDay;
	for (let t of e.querySelectorAll(`.${YA}`)) {
		let e = KA(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		t.classList.toggle(`${YA}--preview`, e !== null && n !== null && r !== null && Mk(e, n, Dj(r, 1)));
	}
}
function Cj(e, t, n) {
	let r = wj("button", `${K}__nav`);
	return r.type = "button", r.textContent = t, r.setAttribute(QA, e), n !== void 0 && r.setAttribute("aria-label", n), r;
}
function wj(e, t) {
	let n = document.createElement(e);
	return n.className = t, n;
}
function Tj(e) {
	return no(e.getFullYear(), e.getMonth(), 1);
}
function Ej(e, t) {
	let n = Tj(e);
	return Dj(n, -((n.getDay() - t + 7) % 7));
}
function Dj(e, t) {
	return no(e.getFullYear(), e.getMonth(), e.getDate() + t, e.getHours(), e.getMinutes(), e.getSeconds());
}
function Oj(e, t) {
	let n = no(e.getFullYear(), e.getMonth() + t, 1), r = no(n.getFullYear(), n.getMonth() + 1, 0).getDate();
	return no(n.getFullYear(), n.getMonth(), Math.min(e.getDate(), r), e.getHours(), e.getMinutes(), e.getSeconds());
}
function kj(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
//#endregion
//#region src/interactions/temporal-picker-engine.ts
var Aj = "ui-temporal-input__field", jj = "ui-temporal-input__popup", Mj = "ui-temporal-input--open", Nj = "ui-calendar__body", Pj = "ui-temporal-input__time-cell", Fj = "ui-temporal-input__time-column", Ij = 140, Lj = "data-ui-temporal-toggle", Rj = "data-ui-temporal-unit", zj = "data-ui-temporal-cell", Bj = "data-ui-temporal-centred", Vj = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	written = /* @__PURE__ */ new WeakSet();
	drawnLanguage = document.documentElement.lang;
	popups = new gg({
		show: ({ owner: e, popup: t }) => {
			e.classList.add(Mj), t.addEventListener("wheel", this.onColumnWheel, { passive: !1 }), this.renderSurface(e, !0);
		},
		hide: ({ owner: e, popup: t }) => {
			for (let [t, n] of [...this.columnSettles]) window.clearTimeout(n), this.chooseCentredTime(e, t);
			this.columnSettles.clear(), this.wheelTurns.clear(), t.removeEventListener("wheel", this.onColumnWheel), e.classList.remove(Mj);
		}
	});
	columnSettles = /* @__PURE__ */ new Map();
	wheelTurns = /* @__PURE__ */ new Map();
	onColumnWheel = (e) => this.handleColumnWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.arrive(this.root.querySelectorAll(Rk)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = Ea(e.components, Rk), n = e.propertyName === "Value" || e.propertyName === "EndValue";
			this.applyDisplay(t);
			for (let e of t) n && Hj(e) && this.states.set(e, tj(e)), this.isShowing(e) && this.renderSurface(e);
		}), V(this.root, Rk, { attributeFilter: [...sA] }, (e) => {
			for (let t of e) this.applyDisplay([t]), this.isShowing(t) && this.renderSurface(t);
		}), V(this.root, Rk, { childList: !0 }, (e) => this.arrive(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), this.root.addEventListener("focusin", (e) => this.handleFieldFocus(e), !0), this.root.addEventListener("mouseover", (e) => this.handleDayHover(e), !0), this.root.addEventListener("mouseout", (e) => this.handleDayHover(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("scroll", (e) => this.handleColumnScroll(e), !0), this.root.addEventListener("blur", (e) => this.handleFieldBlur(e), !0), O.onChange(() => this.applyWords());
	}
	arrive(e) {
		let t = [...e];
		this.applyDisplay(t);
		for (let e of t) Hj(e) && Uj(e)?.firstElementChild === null && this.renderSurface(e);
	}
	applyWords() {
		let e = [...this.root.querySelectorAll(Rk)], t = O.temporal;
		if (t !== null && O.language !== this.drawnLanguage) {
			this.drawnLanguage = O.language;
			for (let n of e) _A(n, t);
		}
		this.applyDisplay(e);
		for (let t of e) this.isShowing(t) && this.renderSurface(t);
	}
	get openPicker() {
		return this.popups.current;
	}
	isShowing(e) {
		return e === this.openPicker || Hj(e);
	}
	calendarFor(e) {
		if (!(e instanceof Element)) return null;
		let t = e.closest(`.${Nj}`)?.closest(".ui-calendar") ?? null;
		if (t !== null) return t;
		let n = this.openPicker;
		return n !== null && Uj(n)?.contains(e) === !0 ? n : null;
	}
	applyDisplay(e) {
		for (let t of e) {
			let e = io(uA(t), nM()), n = Ya(uA(t)) ? "numeric" : "text";
			for (let r of t.querySelectorAll(`.${Aj}`)) {
				if (r.placeholder !== e && (r.placeholder = e), r.inputMode !== n && (r.inputMode = n), r === document.activeElement && this.written.has(r)) continue;
				this.written.add(r);
				let i = TA(t, CA(r))?.value ?? "", a = KA(i, lA(t));
				if (a !== null) {
					r.value = Ga(a, uA(t), hA(t));
					continue;
				}
				i.length === 0 && (r.value = "");
			}
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Aj)) return;
		let t = e.target.closest(`.${K}`), n = t === null ? null : TA(t, CA(e.target));
		if (t === null || n === null) return;
		let r = zA(t, e.target.value), i = KA(r, lA(t)), a = i === null ? r : NA(t, i, CA(e.target));
		if (Wj(t, a)) {
			let n = q(t, CA(e.target));
			e.target.value = n === null ? "" : Ga(n, uA(t), hA(t));
			return;
		}
		CA(e.target) && (this.getState(t).choosingEnd = !1), n.value = a, n.dispatchEvent(new Event("change", { bubbles: !0 })), BA(t), this.applyDisplay([t]);
	}
	handleFieldFocus(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(Aj)) return;
		let t = e.target.closest(`.${K}`);
		t !== null && SA(t) && (this.getState(t).activeEnd = CA(e.target) ? "end" : "start");
	}
	handleDayHover(e) {
		let t = this.calendarFor(e.target);
		if (t === null || !(e.target instanceof Element) || !SA(t)) return;
		let n = e.type === "mouseover" ? e.target.closest(`[${$A}]`) : null, r = this.getState(t), i = n === null ? null : KA(n.getAttribute("data-ui-temporal-day") ?? "", "date");
		(r.hoverDay?.getTime() ?? null) !== (i?.getTime() ?? null) && (r.hoverDay = i, Sj(t, r));
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`[${$A}], .${Pj}`) : null, n = this.calendarFor(t);
		n === null || t === null || t === document.activeElement || t.matches(":disabled") || (t.classList.contains(Pj) ? aM(t) : this.followPointer(n, t));
	}
	followPointer(e, t) {
		let n = Uj(e), r = KA(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		n === null || r === null || !n.contains(document.activeElement) || (this.getState(e).focusedDay = r, P([...n.querySelectorAll(`.${YA}`)], t), Hd(t));
	}
	handleFieldBlur(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(Aj)) return;
		let t = e.target.closest(`.${K}`);
		t !== null && this.applyDisplay([t]);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Lj}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${K}`));
			return;
		}
		let n = this.calendarFor(e.target);
		if (n === null) return;
		let r = e.target.closest(`[${QA}]`);
		if (r !== null) {
			e.preventDefault(), this.applyNavigation(n, r.getAttribute("data-ui-temporal-nav") ?? "");
			return;
		}
		let i = e.target.closest(`[${$A}]`);
		if (i !== null) {
			e.preventDefault(), this.chooseDay(n, i.getAttribute("data-ui-temporal-day") ?? "");
			return;
		}
		let a = e.target.closest(`[${zj}]`);
		if (a !== null) {
			e.preventDefault();
			let t = a.closest(`[${Rj}]`)?.getAttribute(Rj);
			t != null && this.chooseTime(n, t, Number(a.getAttribute(zj)));
		}
	}
	applyNavigation(e, t) {
		let n = this.getState(e);
		if (fj(e, n, t)) {
			this.renderSurface(e);
			return;
		}
		switch (t) {
			case "now":
				n.choosingEnd = !1, this.commit(e, HA(e), n.activeEnd === "end");
				return;
			case "clear":
				this.commit(e, null), SA(e) && this.commit(e, null, !0), n.activeEnd = "start", n.choosingEnd = !1, this.close();
				return;
			case "done":
				this.close();
				return;
			default: return;
		}
	}
	chooseDay(e, t) {
		let n = KA(t, "date");
		if (n === null || j(e) || k(e) || !jA(AA(e), t)) return;
		let r = this.getState(e);
		Hj(e) && SA(e) && !r.choosingEnd && q(e, !1) !== null && q(e, !0) !== null && (r.activeEnd = "start");
		let i = TA(e, !1), a = `${i?.value ?? ""}|${TA(e, !0)?.value ?? ""}`;
		pj(e, r, n), Hj(e) && `${i?.value ?? ""}|${TA(e, !0)?.value ?? ""}` === a && i?.dispatchEvent(new Event("change", { bubbles: !0 })), this.applyDisplay([e]), this.renderSurface(e);
	}
	chooseTime(e, t, n) {
		if (!Number.isFinite(n)) return;
		let r = SA(e) && this.getState(e).activeEnd === "end", i = mA(q(e, r) ?? HA(e), t, n);
		this.commit(e, i, r);
	}
	commit(e, t, n = !1) {
		MA(e, t, n), BA(e), this.applyDisplay([e]), this.isShowing(e) && this.renderSurface(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || M(e)) return;
		if (e.key === "ArrowDown" && N(e, { alt: !0 }) && e.target instanceof HTMLElement && e.target.classList.contains(Aj)) {
			e.preventDefault(), this.toggle(e.target.closest(`.${K}`), CA(e.target) ? "end" : "start");
			return;
		}
		let t = this.calendarFor(e.target);
		if (t === null) return;
		if (e.target instanceof HTMLElement && e.target.classList.contains(Pj)) {
			N(e) && sM(e);
			return;
		}
		if (e.target instanceof HTMLElement && e.target.classList.contains("ui-temporal-input__month")) {
			N(e) && oM(e, e.target);
			return;
		}
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains("ui-temporal-input__day") || !N(e, { shift: e.key === "PageUp" || e.key === "PageDown" })) return;
		let n = KA(e.target.getAttribute("data-ui-temporal-day") ?? "", "date");
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault(), this.chooseDay(t, qA(n, "date"));
			return;
		}
		let r = hj(t, n, e.key, e.shiftKey);
		if (r === null) return;
		e.preventDefault();
		let i = this.getState(t);
		i.focusedDay = r, i.view = Tj(r), this.renderSurface(t, !0);
	}
	handleColumnScroll(e) {
		let t = this.openPicker;
		if (t === null || !(e.target instanceof Element)) return;
		let n = e.target.closest(`.${Fj}`);
		n === null || !t.contains(n) || (window.clearTimeout(this.columnSettles.get(n)), this.columnSettles.set(n, window.setTimeout(() => {
			this.columnSettles.delete(n), this.chooseCentredTime(t, n);
		}, Ij)));
	}
	handleColumnWheel(e) {
		if (this.openPicker === null || e.deltaY === 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Fj}`), n = t?.getAttribute(Rj) ?? null;
		if (t === null || n === null || !this.openPicker.contains(t)) return;
		e.preventDefault();
		let { steps: r, carried: i } = Av(this.wheelTurns.get(n) ?? 0, kv(e).y);
		if (this.wheelTurns.set(n, i), r === 0) return;
		let a = [...t.querySelectorAll(`.${Pj}`)].filter((e) => !e.disabled), o = a.findIndex((e) => e.classList.contains(`${Pj}--selected`)), s = a[Math.min(a.length - 1, Math.max(0, Math.max(0, o) + r))];
		s !== void 0 && !s.classList.contains(`${Pj}--selected`) && this.chooseTime(this.openPicker, n, Number(s.getAttribute(zj)));
	}
	chooseCentredTime(e, t) {
		if (!e.isConnected || !e.contains(t) || j(e) || k(e)) return;
		let n = Number(t.getAttribute(Bj));
		if (Number.isFinite(n) && Math.abs(t.scrollTop - n) <= 1) return;
		let r = t.getAttribute(Rj), i = Zj(t);
		if (!(r === null || i === null || i.classList.contains(`${Pj}--selected`))) {
			if (i.matches(":disabled")) {
				Yj(e);
				return;
			}
			this.chooseTime(e, r, Number(i.getAttribute(zj)));
		}
	}
	toggle(e, t) {
		let n = e?.querySelector(`.${jj}`) ?? null;
		if (e === null || n === null) return;
		if (this.openPicker === e) {
			this.close();
			return;
		}
		this.close();
		let r = this.getState(e);
		r.activeEnd = SA(e) ? t ?? (q(e, !1) === null ? "start" : q(e, !0) === null ? "end" : r.activeEnd) : "start", r.hoverDay = null, r.choosingEnd = !1;
		let i = q(e, r.activeEnd === "end") ?? wA(e);
		r.pane = "days", r.view = Tj(i ?? UA(e, /* @__PURE__ */ new Date())), r.focusedDay = i;
		let a = e.querySelector(`[${Lj}]`);
		this.popups.open({
			owner: e,
			popup: n,
			anchor: e.querySelector(".ui-temporal-input__row") ?? e,
			placement: { placement: "bottom-end" },
			openers: a === null ? [] : [a],
			returnFocus: () => iM(e, this.getState(e).activeEnd === "end")
		});
	}
	close() {
		this.popups.close();
	}
	getState(e) {
		let t = this.states.get(e);
		return t === void 0 && (t = tj(e), this.states.set(e, t)), t;
	}
	renderSurface(e, t = !1) {
		let n = Uj(e);
		if (n === null) return;
		let r = Hj(e), i = lA(e), a = this.getState(e), o = hA(e), s = SA(e), c = q(e, s && a.activeEnd === "end"), l = Qj(n), u = $j(n), d = n.contains(document.activeElement);
		if (n.replaceChildren(), s && n.append(dj(a)), r) n.append(nj(e, a, o, c));
		else {
			let t = wj("div", `${K}__panes`);
			t.append(nj(e, a, o, c)), i === "date-time" && t.append(Gj(e, c)), n.append(t, tM(i));
		}
		let f = u === null ? null : n.querySelector(`[${QA}="${w(u)}"]:not(:disabled)`);
		xj(n, a, c, t || d && l === null && f === null), Sj(e, a), r || (Jj(n), Yj(n), eM(n, l)), f !== null && z(f), r || this.popups.reposition(e);
	}
};
function Hj(e) {
	return e.classList.contains(Lk);
}
function Uj(e) {
	return e.querySelector(`.${Hj(e) ? Nj : jj}`);
}
function Wj(e, t) {
	let n = AA(e), r = n.markedOnly ? KA(t, lA(e)) : null;
	return r !== null && !n.marked.has(qA(r, "date"));
}
function Gj(e, t) {
	let n = dA(e), r = wj("div", `${K}__time`), i = wj("div", `${K}__time-columns`);
	for (let r of Kj(n)) i.append(qj(e, r, fA(n, r), t));
	return r.append(i), r;
}
function Kj(e) {
	return e.unit === "second" ? [
		"hour",
		"minute",
		"second"
	] : e.unit === "hour" ? ["hour"] : ["hour", "minute"];
}
function qj(e, t, n, r) {
	let i = wj("div", Fj);
	i.setAttribute(Rj, t), i.setAttribute("role", "listbox"), i.setAttribute("aria-label", O.text(t === "hour" ? "ui.picker.hours" : t === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"));
	let a = t === "hour" ? 24 : 60, o = r === null ? null : pA(r, t), s = t === "hour" && vA(uA(e)), c = hA(e), l = null;
	for (let u = 0; u < a; u += n) {
		let n = wj("button", Pj);
		n.type = "button", n.tabIndex = -1, n.textContent = t === "hour" ? yA(u, s, c) : String(u).padStart(2, "0"), n.setAttribute(zj, String(u)), n.setAttribute("role", "option"), n.setAttribute("aria-selected", u === o ? "true" : "false"), u === o && n.classList.add(`${Pj}--selected`), dM(e, t, u, r) ? n.disabled = !0 : (l === null || u === o) && (l = n), i.append(n);
	}
	return l !== null && (l.tabIndex = 0), i;
}
function Jj(e) {
	let t = e.querySelector(`.${K}__calendar`), n = e.querySelector(`.${K}__time-columns`);
	t !== null && n !== null && (n.style.maxHeight = `${t.clientHeight}px`);
}
function Yj(e) {
	for (let t of e.querySelectorAll(`.${Fj}`)) {
		let e = t.querySelector(`.${Pj}--selected`) ?? t.firstElementChild;
		if (!(e instanceof HTMLElement)) continue;
		let n = Math.max(0, (t.clientHeight - e.getBoundingClientRect().height) / 2);
		t.style.paddingTop = `${n}px`, t.style.paddingBottom = `${n}px`, Xj(t, e), t.setAttribute(Bj, String(t.scrollTop));
	}
}
function Xj(e, t) {
	let n = t.getBoundingClientRect();
	e.scrollTop += n.top - e.getBoundingClientRect().top - (e.clientHeight - n.height) / 2;
}
function Zj(e) {
	let t = e.getBoundingClientRect().top + e.clientHeight / 2, n = null, r = Infinity;
	for (let i of e.querySelectorAll(`.${Pj}`)) {
		let e = i.getBoundingClientRect(), a = Math.abs(e.top + e.height / 2 - t);
		a < r && (r = a, n = i);
	}
	return n;
}
function Qj(e) {
	let t = document.activeElement;
	return !(t instanceof HTMLElement) || !e.contains(t) || !t.classList.contains(Pj) ? null : t.closest(`.${Fj}`)?.getAttribute(Rj) ?? null;
}
function $j(e) {
	let t = document.activeElement;
	return t instanceof HTMLElement && e.contains(t) ? t.getAttribute(QA) : null;
}
function eM(e, t) {
	if (t === null) return;
	let n = e.querySelector(`.${Fj}[${Rj}="${t}"]`)?.querySelector(`.${Pj}--selected`) ?? null;
	n !== null && z(n);
}
function tM(e) {
	let t = wj("div", `${K}__popup-footer`);
	return t.append(Cj("now", O.text(e === "date" ? "ui.picker.today" : "ui.picker.now"))), t.append(Cj("clear", O.text("ui.picker.clear"))), t.append(Cj("done", O.text("ui.picker.done"))), t;
}
function nM() {
	return {
		year: rM("ui.picker.letter.year", ro.year),
		month: rM("ui.picker.letter.month", ro.month),
		day: rM("ui.picker.letter.day", ro.day),
		hour: rM("ui.picker.letter.hour", ro.hour),
		minute: rM("ui.picker.letter.minute", ro.minute),
		second: rM("ui.picker.letter.second", ro.second)
	};
}
function rM(e, t) {
	let n = O.lookup(e);
	return n === void 0 || n.trim().length === 0 ? t : n;
}
function iM(e, t) {
	for (let n of e.querySelectorAll(`.${Aj}`)) if (CA(n) === t) return n;
	return e.querySelector(`.${Aj}`);
}
function aM(e) {
	let t = document.activeElement;
	t instanceof HTMLElement && t.classList.contains(Pj) && Hd(e);
}
function oM(e, t) {
	if (!bl(e.key, "both")) return;
	e.preventDefault();
	let n = lj(t, e.key);
	Sl([...n?.parentElement?.children ?? []], n);
}
function sM(e) {
	let t = e.target, n = t.closest(`.${Fj}`);
	if (n === null) return;
	let r = e.key === "ArrowLeft" || e.key === "ArrowRight" ? lM(n, e.key === "ArrowRight" ? 1 : -1) : cM(n, t, e.key);
	r !== null && (e.preventDefault(), r.focus({ preventScroll: !0 }), uM(r));
}
function cM(e, t, n) {
	let r = [...e.querySelectorAll(`.${Pj}`)];
	return n === "PageUp" || n === "PageDown" ? id(n, r.filter(F), t, "vertical") ?? t : yl({
		key: n,
		items: r,
		current: t,
		axis: "vertical",
		loop: !1
	});
}
function lM(e, t) {
	let n = [...e.parentElement?.querySelectorAll(`.${Fj}`) ?? []], r = n[n.indexOf(e) + t];
	return r === void 0 ? null : r.querySelector(`.${Pj}--selected`) ?? r.querySelector(`.${Pj}:not(:disabled)`);
}
function uM(e) {
	let t = e.closest(`.${Fj}`);
	t !== null && (Xj(t, e), t.setAttribute(Bj, String(t.scrollTop)));
}
function dM(e, t, n, r) {
	let i = EA(e, Kk), a = EA(e, qk);
	if (i === null && a === null) return !1;
	let o = mA(r ?? HA(e), t, n), s = new Date(o), c = new Date(o);
	return t === "hour" ? (s.setMinutes(0, 0, 0), c.setMinutes(59, 59, 999)) : t === "minute" && (s.setSeconds(0, 0), c.setSeconds(59, 999)), i !== null && c.getTime() < i.getTime() || a !== null && s.getTime() > a.getTime();
}
//#endregion
//#region src/rendering/theme-choice.ts
var fM = `[${Hr}="${Wr}"] [${Ur}]`, pM = "ui-theme-switcher__label-text--current";
function mM() {
	let e = document.documentElement.getAttribute(Lr);
	return e === "light" || e === "dark" ? e : "auto";
}
function hM(e, t) {
	let n = e.getAttribute(Ur) === t;
	if (e.getAttribute("role") === "option") {
		let t = n ? "true" : "false";
		e.getAttribute("aria-selected") !== t && e.setAttribute("aria-selected", t);
	} else e.classList.toggle(pM, n);
}
//#endregion
//#region src/interactions/popup-list.ts
var gM = new pw();
function _M(e, t, n, r, i = !1, a = !0) {
	let o = r ?? (a ? null : n.find(F) ?? null);
	o !== null && P(n, o);
	let s = e.open({
		...t,
		focus: a && r !== null ? r : !1
	});
	return s && a && r === null && af(t.popup, n, i), s;
}
function vM(e, t) {
	let n = e.target instanceof HTMLElement && t.includes(e.target) ? e.target : null, r = mw(e);
	if (r !== null) return e.preventDefault(), Sl(t, bM(t, n, r)), !0;
	if (!bl(e.key, "vertical") || !N(e)) return !1;
	let i = yl({
		key: e.key,
		items: t,
		current: n,
		axis: "vertical"
	});
	return i !== null && e.preventDefault(), Sl(t, i), !0;
}
var yM = {
	character: mw,
	entry: bM
};
function bM(e, t, n) {
	let r = e.filter(F), i = r[0]?.parentElement;
	return i == null ? null : gM.next({
		owner: i,
		character: n,
		entries: r,
		current: t,
		words: oh,
		context: i
	});
}
function xM(e, t) {
	e === document.activeElement || !F(e) || (P(t, e), Hd(e));
}
//#endregion
//#region src/interactions/switcher-list.ts
var SM = class {
	parts;
	selector;
	menus;
	constructor(e) {
		this.parts = e, this.selector = `[${e.attribute}]`, this.menus = new gg({
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
		return e.getAttribute(this.parts.attribute) === Wr;
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
		_M(this.menus, {
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
		if (i !== null && t(n, r) && !this.menus.isOpen(n) && (e.key === "ArrowDown" || e.key === "ArrowUp") && N(e)) {
			e.preventDefault(), this.open(n, i, e.key === "ArrowUp");
			return;
		}
		this.menus.isOpen(n) && vM(e, r);
	}
	handlePointerMove(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${this.parts.choiceClass}`), n = t === null ? null : this.switcherOf(t);
		t !== null && n !== null && this.menus.isOpen(n) && xM(t, this.choicesOf(n));
	}
}, CM = `[${Hr}="${Wr}"]`, wM = "ui-theme-switcher__choice", TM = class {
	options;
	root;
	list = new SM({
		attribute: Hr,
		menuClass: "ui-theme-switcher__menu",
		choiceClass: wM,
		openClass: "ui-theme-switcher--open",
		triggerSelector: `.${Si}`
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.list.handleKeyDown(e, (e) => this.list.isField(e))), this.root.addEventListener("pointermove", (e) => this.list.handlePointerMove(e)), new MutationObserver(() => this.showTheme()).observe(document.documentElement, {
			attributes: !0,
			attributeFilter: [Lr]
		}), V(this.root, CM, { childList: !0 }, (e) => this.showTheme(e)), this.showTheme();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.list.switcherOf(e.target);
		if (t === null) return;
		if (!this.list.isField(t)) {
			if (t.hasAttribute("disabled")) return;
			e.preventDefault(), this.apply(EM() === "dark" ? "Light" : "Dark");
			return;
		}
		let n = e.target.closest(`.${wM}`);
		if (n !== null) {
			e.preventDefault(), this.choose(t, n.getAttribute(Ur));
			return;
		}
		let r = e.target.closest(`.${Si}`);
		r === null || k(r) || (e.preventDefault(), this.list.toggle(t, r));
	}
	choose(e, t) {
		this.list.close(e), t !== null && this.apply(t === "light" ? "Light" : t === "dark" ? "Dark" : null);
	}
	apply(e) {
		this.options.effects.apply({
			effect: {
				kind: Vi.SetTheme,
				mode: e
			},
			dom: this.options.dom
		});
	}
	showTheme(e) {
		let t = mM();
		if (e === void 0) {
			for (let e of this.root.querySelectorAll(fM)) hM(e, t);
			return;
		}
		for (let n of e) for (let e of n.querySelectorAll(`[${Ur}]`)) hM(e, t);
	}
};
function EM() {
	let e = mM();
	return e === "light" || e === "dark" ? e : window.matchMedia?.("(prefers-color-scheme: dark)").matches === !0 ? "dark" : "light";
}
//#endregion
//#region src/interactions/language-switcher-engine.ts
var DM = `.ui-language-switcher__trigger, .${Si}`, OM = "ui-language-switcher__label-text", kM = "ui-language-switcher__label-text--current", AM = "ui-language-switcher__label-text--page", jM = "ui-language-switcher__choice", MM = "ui.language.switch", NM = "ui.language.current", PM = class {
	options;
	root;
	list = new SM({
		attribute: Vr,
		menuClass: "ui-language-switcher__menu",
		choiceClass: jM,
		openClass: "ui-language-switcher--open",
		triggerSelector: DM
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.list.handleKeyDown(e, (e, t) => this.opensList(e, t))), this.root.addEventListener("pointermove", (e) => this.list.handlePointerMove(e)), O.onChange(() => this.showLanguage(O.language));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${jM}`), n = this.list.switcherOf(e.target);
		if (n === null) return;
		if (t !== null) {
			e.preventDefault(), this.choose(n, t.getAttribute(Gr));
			return;
		}
		let r = e.target.closest(DM);
		if (r === null || k(r)) return;
		e.preventDefault();
		let i = this.list.choicesOf(n);
		if (i.length === 2 && !this.list.isField(n)) {
			let e = O.requestedLanguage;
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
				kind: Vi.SetLanguage,
				language: t
			},
			dom: this.options.dom
		});
	}
	showLanguage(e) {
		for (let t of this.root.querySelectorAll(`[${Vr}]`)) {
			let n = t.querySelector(`:scope > :is(${DM})`);
			if (n === null) continue;
			let r = this.list.choicesOf(t), i = this.list.chosenAttribute(t);
			for (let t of r) t.setAttribute(i, t.getAttribute("data-ui-language") === e ? "true" : "false");
			for (let t of n.querySelectorAll(`.${OM}`)) {
				let n = t.getAttribute(Gr) === e;
				t.classList.toggle(kM, n), t.classList.contains(AM) && t.toggleAttribute("hidden", !n);
			}
			if (this.list.isField(t)) continue;
			let a = t.getAttribute(ze) === n.getAttribute("aria-label"), o = (r.find((t) => t.getAttribute("data-ui-language") !== e) ?? r[0]).getAttribute("data-ui-language") ?? "", [s, c] = r.length === 2 ? [MM, {
				language: FM(r, e),
				code: IM(e),
				other: FM(r, o),
				otherCode: IM(o)
			}] : [NM, {
				language: FM(r, e),
				code: IM(e)
			}];
			O.write(n, "aria-label", s, c), a && O.write(t, ze, s, c);
		}
	}
};
function FM(e, t) {
	let n = e.find((e) => e.getAttribute(Gr) === t)?.textContent;
	if (n != null && n.length > 0) return n;
	try {
		let e = new Intl.DisplayNames([t], { type: "language" }).of(t) ?? t;
		return e.charAt(0).toLocaleUpperCase(t) + e.slice(1);
	} catch {
		return IM(t);
	}
}
function IM(e) {
	return e.split("-")[0].toUpperCase();
}
//#endregion
//#region src/interactions/action-bar.ts
var LM = `${Ne}__button`, RM = `${Ne}__more`, zM = `${LM}--icon`, BM = "ui-text__icon", VM = `.ui-button__content .${BM}`, HM = ".ui-button__content .ui-text__title", UM = /* @__PURE__ */ new WeakMap();
function WM(e) {
	let t = [], n = !1;
	for (let r of e.querySelectorAll(Bn)) GM(r, e) && (r.hasAttribute("data-ui-in-action-bar") && !r.matches(zn) ? t.push(r) : n = !0);
	return {
		entries: t,
		more: n
	};
}
function GM(e, t) {
	for (let n = e; n !== null && n !== t; n = n.parentElement) if (!n.hasAttribute("data-ui-menu-left-out") && getComputedStyle(n).display === "none") return !1;
	return getComputedStyle(e).visibility !== "hidden";
}
function KM(e, t) {
	let n = t.entries.map((e) => qM(e, t));
	return t.more && t.openMore !== void 0 && n.push(YM(t.openMore)), e.replaceChildren(...n), n;
}
function qM(e, t) {
	let n = XM(LM), r = QM(e), i = JM(e);
	return i === null ? n.textContent = r : (n.classList.add(zM), n.append(i), n.setAttribute("aria-label", r)), t.role === "menuitem" && n.setAttribute("role", "menuitem"), k(e) && (n.classList.add(fi), n.setAttribute("aria-disabled", "true")), e.getAttribute("data-ui-menu-item-kind") === "check" && n.setAttribute("aria-pressed", e.getAttribute("aria-checked") === "true" ? "true" : "false"), UM.set(n, e), n.addEventListener("click", () => t.press(e, n)), n;
}
function JM(e) {
	let t = e.querySelector(VM);
	if (t === null || !t.className.split(" ").some(Vh)) return null;
	let n = document.createElement("span");
	n.className = t.className, n.classList.remove(BM), n.setAttribute(Lh, ""), n.setAttribute("aria-hidden", "true");
	let r = t.style.getPropertyValue(Rh);
	return r.length > 0 && n.style.setProperty(Rh, r), n;
}
function YM(e) {
	let t = XM(`${LM} ${RM}`);
	return t.setAttribute("aria-haspopup", "menu"), O.write(t, "aria-label", "ui.actionbar.more"), t.addEventListener("click", () => e(t)), t;
}
function XM(e) {
	let t = document.createElement("button");
	return t.setAttribute("type", "button"), t.className = `${e} ${Ti}`, t.tabIndex = -1, t;
}
function ZM(e) {
	return UM.get(e) ?? null;
}
function QM(e) {
	return e.querySelector(HM)?.textContent?.trim() ?? "";
}
//#endregion
//#region src/interactions/long-press.ts
var $M = 500, eN = 10, tN = /* @__PURE__ */ new WeakSet();
function nN(e) {
	return tN.has(e);
}
var rN = class {
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
			timer: setTimeout(() => this.fireHeld(), $M)
		};
	}
	handleMove(e) {
		let t = e, n = this.press, r = this.openedAt;
		r !== null && t.pointerId === r.pointerId && Math.hypot((t.clientX ?? r.x) - r.x, (t.clientY ?? r.y) - r.y) > eN && (this.slid = !0, (this.answered?.closest("[data-ui-splitting]") ?? null) !== null && this.leaveMenuToDrag()), n !== null && t.pointerId === n.pointerId && Math.hypot((t.clientX ?? n.x) - n.x, (t.clientY ?? n.y) - n.y) > eN && this.cancel();
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
		tN.add(t), e.target.dispatchEvent(t), this.answered = t.defaultPrevented ? e.target : null, this.openedAt = this.answered === null ? null : {
			pointerId: e.pointerId,
			x: e.x,
			y: e.y
		};
	}
	handleContextMenu(e) {
		if (tN.has(e)) return;
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
		!this.dragging || n === null || t.clientX === void 0 || t.clientY === void 0 || Math.hypot(t.clientX - n.x, t.clientY - n.y) > eN && this.leaveMenuToDrag();
	}
	endDrag() {
		this.dragging = !1;
	}
	handleClick(e) {
		let t = e.target instanceof Element ? e.target : null;
		this.answered === null || t === null || this.slid && t.closest("[data-ui-context-menu]") !== null || (this.answered = null, e.preventDefault(), e.stopImmediatePropagation());
	}
}, iN = [
	mp("md"),
	mp("xl"),
	mp("xxl")
], aN = {
	md: mp("md"),
	xl: mp("xl"),
	xxl: mp("xxl")
}, oN = mp("md");
function sN(e, t) {
	return cN(e) && !(e.hasAttribute(On(t)) && !uN(e, t) && lN(oN));
}
function cN(e) {
	let t = e.getAttribute(En);
	if (t === null) return !1;
	let n = aN[t];
	return n === void 0 || !lN(n);
}
function lN(e) {
	return typeof matchMedia == "function" && matchMedia(e).matches;
}
function uN(e, t) {
	return e.querySelector(`:scope > [${Mn}="${w(t)}"][${kn}]`) !== null;
}
//#endregion
//#region src/state/client-store.ts
var dN = "ne.ui", fN = "boot", pN = /* @__PURE__ */ new Set(), mN = class {
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
		let r = this.resolveKey(e, fN);
		if (r !== null) try {
			let e = hN(window.localStorage.getItem(r));
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
		let n = e.getAttribute(Je);
		if (n === null || n.length === 0) {
			let n = `${e.tagName}:${t}`;
			return pN.has(n) || (pN.add(n), l("client state is not kept for a component with no authored id.", {
				slot: t,
				component: e
			})), null;
		}
		return `${dN}:${n}:${t}`;
	}
};
function hN(e) {
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
var gN = "menu-current", _N = `[${dn}]`;
function vN(e) {
	for (let t = e.closest(_N); t !== null; t = t.parentElement?.closest(_N) ?? null) bN(t);
}
function yN(e) {
	for (let t of e.querySelectorAll(_N)) bN(t);
	vN(e);
}
function bN(e) {
	let t = e.querySelector(`.${Fn}`) !== null;
	e.hasAttribute("data-ui-menu-holds-current") !== t && e.toggleAttribute(mn, t);
}
//#endregion
//#region src/updates/menu-icons.ts
var xN = "menu-icons", SN = "ui-menu__host", CN = `:scope > :not([${gn}]) > .${S}[${ki}]`;
function wN(e) {
	let t = e.closest(`.${SN}`);
	t !== null && EN(t);
}
function TN(e) {
	for (let t of e.querySelectorAll(`.${SN}`)) EN(t);
}
function EN(e) {
	let t = e.querySelector(CN) !== null;
	e.hasAttribute("data-ui-menu-icons") !== t && e.toggleAttribute(hn, t);
}
//#endregion
//#region src/interactions/menu-group-engine.ts
var DN = "ui-menu__submenu", ON = dn, kN = pn, AN = "data-ui-menu-flyout", jN = `[${AN}], ${vi}`, MN = "data-ui-menu-unfolded", NN = fn, PN = "data-ui-menu-rail-list", FN = "left-side", IN = "[data-ui-root]", LN = "menu-open-group", RN = B.normal * 5, zN = Qe("click"), BN = class {
	root;
	store = new mN();
	seenCollapsed = /* @__PURE__ */ new WeakMap();
	flyouts = new gg({
		show: ({ owner: e, popup: t }) => {
			e.setAttribute(kN, ""), t.setAttribute(AN, "");
		},
		hide: ({ owner: e, popup: t }) => {
			e.removeAttribute(kN), queueMicrotask(() => dp(t, RN, () => {
				this.flyouts.isOpen(e) || t.removeAttribute(AN);
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
		let t = this.root.querySelectorAll(`.${x}`);
		GN(t), this.reconcileEach(t);
		for (let e of t) yN(e), TN(e);
		V(this.root, `.${x}`, {
			childList: !0,
			attributeFilter: [un]
		}, (e) => {
			GN(e), this.reconcileEach(e);
			for (let t of e) yN(t), TN(t);
		});
		for (let e of this.root.querySelectorAll(`[${ON}]`)) VN(e);
		if (V(this.root, `[${ON}]`, {
			childList: !0,
			attributeFilter: [kN]
		}, (e) => {
			for (let t of e) VN(t);
		}), typeof matchMedia == "function") for (let e of iN) matchMedia(e).addEventListener("change", () => {
			this.closeBarFlyout(), this.refitDrawerRails();
		});
		V(this.root, IN, { attributeFilter: [On(FN)] }, () => this.refitDrawerRails());
	}
	refitDrawerRails() {
		let e = this.root.querySelectorAll(`[${An}] .${x}`);
		GN(e), this.reconcileEach(e);
	}
	closeBarFlyout() {
		let e = this.flyouts.current;
		e !== null && e.closest("[data-ui-bottom-bar]") !== null && this.flyouts.close(e);
	}
	reconcileEach(e) {
		for (let t of e) {
			let e = ZN(t), n = this.seenCollapsed.get(t);
			n !== e && (this.seenCollapsed.set(t, e), n === void 0 ? this.restore(t, e) : this.handleCollapsedChange(t, e));
		}
	}
	restore(e, t) {
		t ? this.closeGroups(e) : this.openResolvedGroup(e);
	}
	handleCollapsedChange(e, t) {
		this.flyouts.close(), HN(e), this.closeGroups(e), e.hasAttribute("data-ui-folding") && e.setAttribute(MN, ""), t || this.openResolvedGroup(e);
		for (let t of e.querySelectorAll(`[${ON}]`)) VN(t);
	}
	openResolvedGroup(e) {
		let t = this.groupOf(e.querySelector(`.${Fn}`), e);
		if (t !== null && !t.hasAttribute(NN)) {
			this.openInline(t);
			return;
		}
		let n = e.classList.contains("ui-menu--nested") ? null : this.store.read(e, LN), r = n === null ? null : this.findGroup(e, n);
		r !== null && this.openInline(r);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${S}`), n = this.flyouts.current, r = n === null ? null : this.submenuOf(n);
		if (r !== null && r.contains(e.target)) {
			t !== null && r.contains(t) && KN(t) && this.flyouts.close();
			return;
		}
		let i = t === null ? null : this.ownGroupOf(t);
		if (t === null || i === null) {
			this.flyouts.close();
			return;
		}
		e.preventDefault();
		let a = i.closest(`.${x}`);
		a !== null && (XN(i) ? this.toggleFlyout(a, i, t) : this.toggleInline(a, i));
	}
	toggleInline(e, t) {
		let n = e.classList.contains(Ln);
		if (e.setAttribute(MN, ""), t.closest("[data-ui-menu-searching]") !== null) {
			t.toggleAttribute(kN);
			return;
		}
		if (t.hasAttribute(kN)) {
			t.removeAttribute(kN), n || this.store.write(e, LN, null);
			return;
		}
		this.closeGroups(e), this.openInline(t), n || this.store.write(e, LN, t.getAttribute(y));
	}
	openInline(e) {
		e.setAttribute(kN, "");
	}
	closeGroups(e) {
		for (let t of e.querySelectorAll(`[${ON}][${kN}]`)) t.hasAttribute(NN) || t.removeAttribute(kN);
	}
	toggleFlyout(e, t, n) {
		let r = this.submenuOf(t);
		if (r === null) return;
		let i = this.flyouts.isOpen(t);
		if (this.flyouts.close(), i) return;
		HN(e), this.closeGroups(e);
		let a = n.closest(jN) ?? void 0;
		if (!this.flyouts.open({
			owner: t,
			popup: r,
			anchor: n,
			placement: {
				placement: `${UN(e)}-start`,
				surface: a,
				alignEntries: !0
			}
		})) return;
		let o = r.querySelector(`:scope > .${x}`);
		o !== null && !Fd() && af(o, qN(o));
	}
	findGroup(e, t) {
		for (let n of e.querySelectorAll(`[${ON}]`)) if (n.getAttribute("data-ui-key") === t) return n;
		return null;
	}
	ownGroupOf(e) {
		return e.matches(zn) ? e.parentElement : null;
	}
	groupOf(e, t) {
		let n = e?.closest(`[${ON}]`) ?? null;
		return n !== null && t.contains(n) ? n : null;
	}
	submenuOf(e) {
		return e.querySelector(`:scope > .${DN}`);
	}
};
function VN(e) {
	let t = e.querySelector(`:scope > .${S}`);
	t !== null && (t.setAttribute(zN, ""), t.setAttribute($e, ""), t.setAttribute("aria-expanded", e.hasAttribute(kN) ? "true" : "false"), XN(e) ? t.setAttribute("aria-haspopup", "menu") : t.removeAttribute("aria-haspopup"));
}
function HN(e) {
	for (let t of e.querySelectorAll(`[${AN}]`)) t.removeAttribute(AN);
}
function UN(e) {
	return WN(e) ? "top" : e.classList.contains("ui-side--right") ? "left" : e.classList.contains("ui-side--top") ? "bottom" : e.classList.contains("ui-side--bottom") ? "top" : "right";
}
function WN(e) {
	let t = e.closest(`[${kn}]`);
	return e.classList.contains("ui-menu--rail") && t?.parentElement !== null && t?.parentElement !== void 0 && typeof matchMedia == "function" && sN(t.parentElement, FN);
}
function GN(e) {
	for (let t of e) {
		let e = t.closest(`[${An}]`);
		if (!t.classList.contains("ui-menu--rail") && !t.hasAttribute(PN) || e?.parentElement === null || e?.parentElement === void 0) continue;
		let n = typeof matchMedia == "function" && sN(e.parentElement, FN);
		t.classList.toggle(In, !n), t.toggleAttribute(PN, n);
	}
}
function KN(e) {
	let t = e.closest(`.${S}`);
	return t !== null && t.matches(Bn) && !t.matches(Vn) && !k(t);
}
function qN(e) {
	let t = [];
	for (let n of Hl(e)) {
		t.push(n);
		let e = n.matches(zn) ? n.parentElement : null, r = e === null || !e.hasAttribute(kN) || XN(e) ? null : e.querySelector(`:scope > .${DN} > .${x}`);
		r !== null && t.push(...qN(r));
	}
	return t;
}
function JN(e) {
	let t = YN(e), n = t?.closest(".ui-menu") ?? null;
	return t === null || n === null || XN(t) ? e : JN(n);
}
function YN(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(DN) && t.parentElement?.hasAttribute(ON) === !0 ? t.parentElement : null;
}
function XN(e) {
	let t = e.closest(`.${x}`);
	return e.hasAttribute(NN) || t !== null && ZN(t);
}
function ZN(e) {
	return e.hasAttribute("data-ui-collapsed") || e.classList.contains("ui-menu--rail");
}
var QN = "tabs:rename", $N = "tabs:pin", eP = "tabs:unpin", tP = "tabs:close", nP = "tabs:delete";
function rP(e) {
	let t = (e ?? "").split(/\s+/);
	return {
		rename: t.includes("rename"),
		pin: t.includes("pin"),
		close: t.includes("close"),
		delete: t.includes("delete")
	};
}
function iP(e, t) {
	let n = !t.pinned && t.removable;
	return /* @__PURE__ */ new Map([
		[QN, e.rename && t.renamable],
		[$N, e.pin && !t.pinned],
		[eP, e.pin && t.pinned],
		[tP, e.close && !e.delete && n],
		[nP, e.delete && n]
	]);
}
function aP(e) {
	let t = e.map(() => !1), n = !1, r = -1;
	for (let i = 0; i < e.length; i++) e[i] === "rule" ? n && r === -1 && (r = i) : e[i] === "shown" && (r !== -1 && (t[r] = !0), r = -1, n = !0);
	return t;
}
function oP(e, t) {
	return typeof e == "string" ? [...t, e] : null;
}
//#endregion
//#region src/interactions/context-menu-engine.ts
var sP = Ce, cP = "ui-context-menu--open", lP = `${Ne}--strip`, uP = `.${Ne}:not(.${lP}) > .${RM}`, dP = "ui-context-menu-opening", fP = null, pP = /* @__PURE__ */ new WeakSet();
function mP(e) {
	fP = e;
}
var hP = class {
	root;
	components;
	closed = null;
	menus = new gg({
		show: ({ popup: e }) => e.classList.add(cP),
		hide: ({ popup: e }, t) => {
			e.classList.remove(cP), this.closed = e, t === "outside" && NP();
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e),
		onPress: !0,
		onWindowBlur: !0,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, new rN({
			root: this.root,
			first: typeof window > "u" ? void 0 : window,
			holds: (e) => e.closest("[data-ui-context-menu-owner]") !== null && !al(e),
			closeMenu: () => this.menus.close(this.menus.current, "outside")
		}), this.root.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), this.root.addEventListener("click", (e) => this.handleInside(e), !1);
	}
	get openMenu() {
		let e = this.menus.current;
		return e === null ? null : this.menus.popupOf(e);
	}
	handleContextMenu(e) {
		if (!(e instanceof MouseEvent) || !(e.target instanceof Element)) return;
		let t = !Fd() && !nN(e), n = (t ? vP() : null) ?? e.target;
		if (this.openMenu !== null && e.composedPath().includes(this.openMenu)) {
			e.preventDefault();
			return;
		}
		let r = gP(n);
		if (r === null) return;
		e.preventDefault();
		let i = EP(e) ? n : null, a = n.closest(uP), o = t ? yP(n) : null, s = () => this.open(r.owner, r.menu, e.clientX, e.clientY, i, a, o);
		pP.delete(r.menu) ? queueMicrotask(s) : s();
	}
	open(e, t, n, r, i, a, o) {
		this.menus.close(), t.querySelector(`:scope > .${lP}`)?.remove(), DP(t), i !== null && OP(e, t, i), a?.closest("[data-ui-action-bar]")?.hasAttribute("data-ui-action-bar-rest") === !0 && AP(t), this.closed !== null && (up(this.closed), this.closed = null);
		let s = (document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null) ?? Pd(), c = a ?? o, l = {
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
			returnFocus: () => (s === null ? null : of(s, this.components)) ?? of(e, this.components)
		}) && (c === null && vm(t, n, r), MP(t));
	}
	handleInside(e) {
		this.openMenu === null || !e.composedPath().includes(this.openMenu) || e.target instanceof Element && KN(e.target) && this.menus.close();
	}
};
function gP(e) {
	let t = e.closest(`[${de}]`);
	for (let n = e.closest(`[${we}]`); n !== null; n = n.parentElement?.closest("[data-ui-context-menu-owner]") ?? null) {
		if (t !== null && n.contains(t)) return null;
		if (!SP(n, e) || k(n)) continue;
		if (FP(n)) return null;
		let r = xP(n, e).find((t) => wP(t, e, !1));
		if (r !== void 0) return {
			owner: n,
			menu: r
		};
	}
	return null;
}
var _P = `[${we}]`;
function vP() {
	let e = document.activeElement;
	if (e === null || e === document.body) return null;
	let t = Ou(e);
	if (t === null || t.row !== null && t.row !== e) return e;
	let n = t.row ?? Pu(t.root);
	return n === null ? t.root : bP(n);
}
function yP(e) {
	let t = e.closest(Kl);
	return t === null ? e : L(t) ?? t;
}
function bP(e) {
	if (e.matches(_P)) return e;
	for (let t of e.querySelectorAll(_P)) if (t.closest(Kl) === e) return t;
	return e;
}
function xP(e, t) {
	return CP(e, t).map((t) => PP(e, t)).filter((e) => e !== null);
}
function SP(e, t) {
	return CP(e, t).some((t) => PP(e, t, !1) !== null || t.length === 0 && e.hasAttribute("data-ui-context-menu-later"));
}
function CP(e, t) {
	let n = t.closest(`[${De}]`), r = n !== null && e.contains(n) ? n.getAttribute("data-ui-context-menu-use") ?? "" : "";
	return r.length > 0 ? [r, ""] : [""];
}
function wP(e, t, n) {
	let r = new CustomEvent(dP, {
		bubbles: !0,
		cancelable: !0,
		detail: {
			target: t,
			actionBar: n
		}
	});
	return e.dispatchEvent(r);
}
function TP(e, t) {
	let n = e.closest(`[${we}]`), r = e.closest(`[${de}]`);
	return n === null || k(n) || FP(n) || r !== null && n.contains(r) ? null : xP(n, e).find((n) => wP(n, e, t)) ?? null;
}
function EP(e) {
	let t = e.pointerType;
	return nN(e) ? !0 : typeof t == "string" && t.length > 0 ? t === "touch" : Id();
}
function DP(e) {
	for (let t of e.querySelectorAll(`[${je}]`)) t.removeAttribute(je);
}
function OP(e, t, n) {
	let r = n.closest(`[${Oe}]`);
	if (r === null || n.closest(".ui-action-bar") !== null || !e.contains(r) || !xP(e, r).includes(t)) return;
	let { entries: i } = WM(t);
	if (i.length === 0) return;
	let a = document.createElement("div");
	a.className = `${Ne} ${lP}`, a.setAttribute("role", "group"), KM(a, {
		entries: i,
		more: !1,
		role: "menuitem",
		press: kP
	}), t.insertBefore(a, t.firstElementChild);
}
function kP(e) {
	k(e) || e.click();
}
function AP(e) {
	let { entries: t } = WM(e), n = e.querySelector(`.${x}`);
	if (t.length === 0 || n === null) return;
	for (let e of t) jP(e);
	let r = Vl(n, `.${S}`, `.${x}`).filter((t) => t.closest("[data-ui-menu-left-out]") === null && GM(t, e)), i = [];
	for (let [e, t] of r.entries()) {
		let n = r[e + 1];
		t.getAttribute("data-ui-menu-item-kind") === "header" && (n === void 0 || n.matches(Rn)) ? jP(t) : i.push(t);
	}
	let a = i.map((e) => {
		let t = e.getAttribute(Nn);
		return t === "separator" ? "rule" : t === "header" ? "hidden" : "shown";
	});
	aP(a).forEach((e, t) => {
		a[t] === "rule" && !e && jP(i[t]);
	});
}
function jP(e) {
	let t = e.parentElement;
	(t !== null && t.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t : e).setAttribute(je, "");
}
function MP(e) {
	let t = e.querySelector(`.${x}`);
	t !== null && af(e, qN(t));
}
function NP() {
	let e = (e) => {
		e.target instanceof Element && e.target.closest(`${bd}, [contenteditable='true']`) === null && e.preventDefault();
	};
	document.addEventListener("mousedown", e, {
		capture: !0,
		once: !0
	}), setTimeout(() => document.removeEventListener("mousedown", e, !0));
}
function PP(e, t, n = !0) {
	for (let n of e.querySelectorAll(`[${sP}]`)) if ((n.getAttribute(sP) ?? "") === t && n.closest("[data-ui-context-menu-owner]") === e) return n;
	if (!n || t.length > 0 || fP === null || !e.hasAttribute("data-ui-context-menu-later")) return null;
	let r = fP(e);
	return r !== null && pP.add(r), r;
}
function FP(e) {
	if (e.hasAttribute("data-ui-no-context-menu")) return !0;
	let t = e.closest(`[${b}]`);
	if (t === null) return !1;
	let n = e;
	for (; n.parentElement !== null && n.parentElement !== t;) n = n.parentElement;
	return Os(n, "data-ui-no-context-menu") || t.closest(C)?.hasAttribute("data-ui-no-context-menu") === !0;
}
//#endregion
//#region src/interactions/element-visibility.ts
function IP(e, t) {
	let n = getComputedStyle(e), r = t ? n.overflowY : n.overflowX;
	return r === "auto" || r === "scroll";
}
function LP(e) {
	return getComputedStyle(e).display !== "none";
}
function RP(e) {
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
				if (e.overflowX !== "visible" && VP(n, i, i + t.clientWidth, !0), e.overflowY !== "visible" && VP(n, a, a + t.clientHeight, !1), HP(n)) return !0;
			}
			r = e.position;
		}
	}
	return VP(n, 0, window.innerWidth, !0), VP(n, 0, window.innerHeight, !1), HP(n);
}
function zP(e) {
	let t = getComputedStyle(e).position;
	for (let n = e.parentElement; n !== null && t !== "fixed"; n = n.parentElement) {
		let e = getComputedStyle(n);
		if (t !== "absolute" || e.position !== "static" || e.transform !== "none") {
			if (!(n.classList.contains("ui-scroll-y--disabled") && !IP(n, !1)) && (BP(e.overflowX) || BP(e.overflowY))) return n;
			t = e.position;
		}
	}
	return null;
}
function BP(e) {
	return e === "hidden" || e === "auto" || e === "scroll";
}
function VP(e, t, n, r) {
	r ? (e.left = Math.max(e.left, t), e.right = Math.min(e.right, n)) : (e.top = Math.max(e.top, t), e.bottom = Math.min(e.bottom, n));
}
function HP(e) {
	return e.left > e.right || e.top > e.bottom;
}
//#endregion
//#region src/interactions/action-bar-engine.ts
var UP = `[${Oe}]`, WP = `.${Ne}`, GP = `${Ne}--out`, KP = `.ui-items-view__item, .${tr}`, qP = "ui-tree__node", JP = 6, YP = "--ui-action-bar-gap", XP = 400, ZP = /* @__PURE__ */ new WeakMap(), QP = [
	"class",
	"style",
	"hidden",
	"aria-disabled",
	"aria-checked",
	Me,
	...li
], $P = class {
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
		if (n === null || n.closest(`${WP}, [data-ui-context-menu]`) !== null) return;
		let r = eF(n), i = r !== null && r !== this.chosen && tF(n, r) ? null : r;
		if (t.pointerType === "touch") {
			this.pendingTap = {
				pointerId: t.pointerId ?? 0,
				host: i,
				identity: i === null ? null : sF(i)
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
			let e = t.host !== null && !t.host.isConnected && t.identity !== null ? cF(t.identity) : t.host;
			e !== null && e === this.chosen ? this.askAgain(e) : this.choose(e);
		}
		this.chosen !== null && this.chosen.isConnected && !this.shown.has(this.chosen) && this.sync();
	}
	handleContextMenu(e) {
		this.pendingTap = null, e instanceof MouseEvent && e.target instanceof Element && e.target.closest(WP) === null && EP(e) && this.choose(null);
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement ? e.target : null;
		if (t === null) return;
		let n = t.closest(WP);
		if (n !== null) {
			this.isHostedBar(n) && P(gF(n), t);
			return;
		}
		Fd() || this.isInOpenMenu(t) || this.menuHost !== null && t.contains(this.menuHost) || this.choose(aF(t));
	}
	handleFocusOut(e) {
		let t = e.relatedTarget, n = t instanceof Element ? t.closest(WP) : null;
		n !== null && this.isHostedBar(n) && e.target instanceof HTMLElement && !n.contains(e.target) && (this.cameFrom = e.target);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || !(e.target instanceof HTMLElement)) return;
		let t = e.target;
		if (e.defaultPrevented) {
			t.matches(I) && this.choose(aF(t));
			return;
		}
		let n = t.closest(WP);
		if (n !== null && t.classList.contains(LM)) {
			this.handleBarKey(e, n, t);
			return;
		}
		if (e.key === "Escape") {
			if (Yc(e)) return;
			let n = t.closest(Fm);
			(n === null || this.chosen !== null && n.contains(this.chosen)) && (this.chosen !== null && e.preventDefault(), this.choose(null));
			return;
		}
		if (e.key === "Tab" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey && t.matches(I)) {
			let n = this.chosen === null ? null : this.tabStopOf(this.chosen);
			n !== null && t.contains(n) && (e.preventDefault(), n.focus());
			return;
		}
		t.matches(I) && this.choose(aF(t));
	}
	handleBarKey(e, t, n) {
		if (e.ctrlKey || e.altKey || e.metaKey) return;
		if (e.key === "Escape") {
			if (!this.isHostedBar(t)) return;
			let n = this.hostOfBar(t), r = this.cameFrom !== null && this.cameFrom.isConnected && bF(this.cameFrom) && n !== null && (n.contains(this.cameFrom) || this.cameFrom.contains(n)) ? this.cameFrom : of(n, this.components);
			e.preventDefault(), r?.focus();
			return;
		}
		let r = gF(t), i = yl({
			key: e.key,
			items: r,
			current: n,
			axis: "horizontal"
		});
		i !== null && (e.preventDefault(), Sl(r, i));
	}
	choose(e) {
		(e === null ? this.chosen === null && this.identity === null : e === this.chosen) || (this.chosen = e, this.identity = e === null ? null : sF(e), this.watchScope(), this.sync(), e !== null && this.makeRoomAbove(e));
	}
	makeRoomAbove(e) {
		let t = this.shown.get(e), n = zP(e);
		if (t === void 0 || n === null || !IP(n, !0)) return;
		let r = Math.max(0, n.getBoundingClientRect().top + n.clientTop), i = Math.ceil(t.bar.getBoundingClientRect().height + uF(e) - (e.getBoundingClientRect().top - r));
		i <= 0 || i > n.scrollTop || (n.scrollTop -= i, Wp(t.bar), this.markOut());
	}
	askAgain(e) {
		let t = this.shown.get(e);
		if (t === void 0) {
			this.sync();
			return;
		}
		TP(e, !0) === null && this.hide(e, t);
	}
	watchScope() {
		this.scopeObserver?.disconnect(), this.scopeObserver = null, this.identity !== null && (this.scopeObserver = new MutationObserver((e) => {
			Tm(e) || this.scopeChanged();
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
				this.chosen = cF(e), this.sync();
			}
			for (let e of this.shown.values()) Wp(e.bar);
			this.markOut();
		}
	}
	sync() {
		for (let [e, t] of this.shown) (e !== this.chosen && e !== this.menuHost || !e.isConnected) && this.hide(e, t);
		for (let e of [this.chosen, this.menuHost]) e !== null && e.isConnected && !this.shown.has(e) && this.show(e);
	}
	show(e) {
		let t = TP(e, !0);
		if (t === null) return;
		let n = document.createElement("div");
		if (n.className = Ne, n.setAttribute("role", "toolbar"), O.write(n, "aria-label", "ui.actionbar.label"), n.setAttribute($e, ""), n.setAttribute(pe, ""), !fF(n, t, (t) => this.openMore(e, t), !1)) return;
		e.insertBefore(n, hF(e)), Np(e, n, {
			placement: lF(e),
			gap: uF(e),
			boundary: zP(e) ?? void 0
		}), n.classList.toggle(GP, RP(e));
		let r = new MutationObserver((t) => {
			Tm(t) || this.redraw(e);
		});
		r.observe(t, {
			subtree: !0,
			childList: !0,
			characterData: !0,
			attributes: !0,
			attributeFilter: QP
		});
		let i = dF(e);
		i?.setAttribute(jr, ""), this.shown.set(e, {
			bar: n,
			menu: t,
			observer: r,
			row: i
		}), ZP.set(n, Date.now());
	}
	redraw(e) {
		let t = this.shown.get(e);
		if (t === void 0) return;
		let n = document.activeElement, r = n instanceof HTMLElement && t.bar.contains(n) ? n : null, i = r === null ? null : ZM(r);
		if (!fF(t.bar, t.menu, (t) => this.openMore(e, t), e === this.menuHost)) {
			this.hide(e, t);
			return;
		}
		if (r === null) return;
		let a = gF(t.bar);
		Sl(a, a.find((e) => ZM(e) === i) ?? a.find(F) ?? null);
	}
	openMore(e, t) {
		let n = this.shown.get(e);
		if (n === void 0 || vF(t)) return;
		if (this.menuHost = e, yF(t), !n.menu.classList.contains("ui-context-menu--open")) {
			this.menuHost = null;
			return;
		}
		pF(n.bar, !0);
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
		pF(t.bar, !1);
		let n = document.activeElement;
		!Fd() && (n === null || n === document.body || e.contains(n) || n.contains(e)) && mF(t.bar)?.focus();
	}
	hide(e, t) {
		t.observer.disconnect(), Gp(t.bar), t.bar.remove(), this.shown.delete(e), t.row !== null && ![...this.shown.values()].some((e) => e.row === t.row) && t.row.removeAttribute(jr);
	}
	markOut() {
		for (let [e, t] of this.shown) t.bar.classList.toggle(GP, RP(e));
	}
	isInOpenMenu(e) {
		for (let t of this.shown.values()) if (t.menu.classList.contains("ui-context-menu--open") && t.menu.contains(e)) return !0;
		return !1;
	}
	tabStopOf(e) {
		let t = this.shown.get(e);
		return t === void 0 ? null : gF(t.bar).find((e) => e.tabIndex === 0) ?? null;
	}
	isHostedBar(e) {
		return this.hostOfBar(e) !== null;
	}
	hostOfBar(e) {
		for (let [t, n] of this.shown) if (n.bar === e) return t;
		return null;
	}
};
function eF(e) {
	let t = e.closest(UP);
	if (t !== null) return t;
	let n = e.closest(`[${y}]`), r = e.closest(C);
	return n === null || r !== null && !r.contains(n) ? null : oF(n)[0] ?? null;
}
function tF(e, t) {
	let n = vl(e, t.closest("[data-ui-key]") ?? t);
	return n !== null && !rF(n, t);
}
var nF = `[${Ce}], .${Ne}, ${xi}`;
function rF(e, t) {
	if (e.contains(t)) return !0;
	for (let n = e; n !== t;) {
		let e = n.parentElement;
		if (e === null) return !1;
		let t = iF(e) - iF(n);
		for (let r of e.children) if (r !== n) {
			if (!r.matches(nF)) return !1;
			t -= iF(r);
		}
		if (t > 0) return !1;
		n = e;
	}
	return !0;
}
function iF(e) {
	return (e.textContent ?? "").replace(/s+/g, "").length;
}
function aF(e) {
	if (e instanceof HTMLElement && e.matches(I)) {
		let t = Pu(e), n = t === null ? void 0 : oF(t)[0];
		if (n !== void 0) return n;
	}
	return e.closest(UP);
}
function oF(e) {
	let t = [...e.querySelectorAll(UP)];
	return e.matches(UP) ? [e, ...t] : t;
}
function sF(e) {
	let t = e.getAttribute(ke);
	if (t !== null && e.parentElement !== null) return {
		scope: e.parentElement,
		attribute: ke,
		key: t,
		index: 0
	};
	let n = e.closest(`[${y}]`), r = n?.getAttribute("data-ui-key") ?? null;
	return n === null || r === null || n.parentElement === null ? null : {
		scope: n.parentElement,
		attribute: y,
		key: r,
		index: oF(n).indexOf(e)
	};
}
function cF(e) {
	for (let t of e.scope.children) if (t.getAttribute(e.attribute) === e.key) return oF(t)[e.index] ?? null;
	return null;
}
function lF(e) {
	let t = e.getAttribute(Oe);
	if (t === "center") return "top";
	let n = getComputedStyle(e).direction === "rtl";
	return t === "start" === n ? "top-end" : "top-start";
}
function uF(e) {
	let t = Number.parseFloat(getComputedStyle(e).getPropertyValue(YP));
	return Number.isFinite(t) ? t : JP;
}
function dF(e) {
	if (e.classList.contains("ui-table__row")) return e;
	let t = e.parentElement;
	if (t === null) return null;
	if (t.matches(KP)) return t;
	let n = t.parentElement;
	return t.classList.contains(qP) && n !== null && n.classList.contains("ui-tree__row") ? n : null;
}
function fF(e, t, n, r) {
	let { entries: i, more: a } = WM(t);
	if (i.length === 0 && !a) return !1;
	let o = KM(e, {
		entries: i,
		more: a,
		role: "button",
		press: _F,
		openMore: n
	});
	return P(o, o.find((e) => !k(e)) ?? o[0] ?? null), pF(e, r), !0;
}
function pF(e, t) {
	mF(e)?.setAttribute("aria-expanded", t ? "true" : "false");
}
function mF(e) {
	return gF(e).find((e) => ZM(e) === null) ?? null;
}
function hF(e) {
	for (let t of e.children) if (t.hasAttribute("data-ui-context-menu")) return t;
	return null;
}
function gF(e) {
	return [...e.querySelectorAll(`:scope > .${LM}`)];
}
function _F(e, t) {
	if (k(t) || vF(t)) return;
	let n = TP(t, !1);
	n === null || !n.contains(e) || k(e) || !GM(e, n) || e.click();
}
function vF(e) {
	let t = e.closest(WP), n = t === null ? void 0 : ZP.get(t);
	return n !== void 0 && Id() && Date.now() - n < XP;
}
function yF(e) {
	let t = e.getBoundingClientRect();
	e.dispatchEvent(new MouseEvent("contextmenu", {
		bubbles: !0,
		cancelable: !0,
		button: 2,
		clientX: t.left,
		clientY: t.bottom
	}));
}
function bF(e) {
	return e.matches(bd) || e.hasAttribute("tabindex");
}
//#endregion
//#region src/interactions/tooltip-engine.ts
var xF = "ui-tooltip", SF = "ui-tooltip", CF = "ui-tooltip--visible", wF = "ui-tooltip--linked", TF = "[aria-haspopup][aria-expanded=\"true\"]", EF = "a[href], button, input, select, textarea, label, [role='button'], [role='link'], [tabindex]", DF = "top", OF = 250, kF = 200, AF = 300, jF = 7, MF = null, NF = null, PF = null, FF = null, IF = null, LF = 0, RF = null, zF = 0, BF = 0, VF = !1, HF = /* @__PURE__ */ new Set();
function UF(e) {
	HF.add(e);
}
function WF(e = document) {
	if (VF) return;
	VF = !0;
	let t = e instanceof Document ? e : document;
	t.addEventListener("pointerover", GF, !0), t.addEventListener("pointerout", JF, !0), t.addEventListener("focusin", XF, !0), t.addEventListener("focusout", ZF, !0), t.addEventListener("scroll", qF, !0), t.addEventListener("pointerdown", $F, !0), t.addEventListener("click", rI, !0), new rN({
		root: t,
		first: window,
		holds: tI,
		answer: nI
	}), window.addEventListener("keydown", QF, !0), window.addEventListener("blur", DI);
}
function GF(e) {
	if (KF(), aI(e.target)) {
		window.clearTimeout(zF);
		return;
	}
	let t = oI(e.target);
	t !== null && t !== NF && dI(t);
}
function KF() {
	NF === null || NF.isConnected || DI();
}
function qF(e) {
	if (KF(), NF === null) return;
	let t = e.target;
	t instanceof Node && !(t instanceof Document) && !t.contains(NF) || RP(NF) && DI();
}
function JF(e) {
	if (FF !== null || IF !== null) return;
	let t = e.relatedTarget, n = NF ?? RF?.target ?? null, r = n === null ? null : YF(n);
	t instanceof Node && (r !== null && r.contains(t) || aI(t)) || (aI(e.target) || r !== null && e.target instanceof Node && r.contains(e.target)) && OI(!1);
}
function YF(e) {
	let t = e.parentElement?.closest("[data-ui-tooltip-mark]") ?? null;
	return t !== null && sI(t) === e ? t : e;
}
function XF(e) {
	if (e.target instanceof Element && e.target.hasAttribute("data-ui-pointer-focus")) return;
	let t = oI(e.target);
	t !== null && (FF = e.target instanceof Element && e.target.closest("[data-ui-tooltip-mark]") !== null ? t : null, fI(t));
}
function ZF(e) {
	oI(e.target) === NF && DI();
}
function QF(e) {
	e.key !== "Escape" || NF === null || e.defaultPrevented || (Yc(e) || e.preventDefault(), DI());
}
function $F(e) {
	if (aI(e.target)) return;
	let t = iI(e.target);
	if (t !== null) {
		if (IF === t) {
			OI(!0);
			return;
		}
		DI(), fI(t), IF = NF;
		return;
	}
	FF === null && OI(!0);
}
var eI = `[${we}]`;
function tI(e) {
	let t = e.closest(eI) === null && !al(e) ? oI(e) : null;
	return t !== null && !t.hasAttribute("data-ui-tooltip-press");
}
function nI(e) {
	let t = oI(e);
	return t !== null && (DI(), fI(t), IF = NF, !0);
}
function rI(e) {
	iI(e.target) !== null && e.preventDefault();
}
function iI(e) {
	let t = oI(e);
	if (t === null || !t.hasAttribute("data-ui-tooltip-press") || !(e instanceof Element)) return null;
	let n = e.closest(EF);
	return n === null || n.contains(t) ? t : null;
}
function aI(e) {
	return MF !== null && e instanceof Node && MF.contains(e);
}
function oI(e) {
	if (!(e instanceof Element)) return null;
	let t = sI(e);
	for (let n of HF) {
		let r = n.anchor(e);
		if (r !== null && (t === null || t !== r && t.contains(r)) && uI(r).length > 0) return r;
	}
	return t;
}
function sI(e) {
	let t = e.closest(`[${ze}], [${Ve}]`);
	if (t === null) return null;
	let n = t.hasAttribute("data-ui-tooltip") ? t : t.querySelector("[data-ui-tooltip][data-ui-tooltip-severity]") ?? t.querySelector("[data-ui-tooltip]");
	return n === null ? null : (n.getAttribute("data-ui-tooltip") ?? "").trim().length > 0 ? n : null;
}
function cI(e) {
	let t = (e.getAttribute("data-ui-tooltip") ?? "").trim();
	return t.length > 0 ? t + lI(e) : uI(e);
}
function lI(e) {
	let t = "";
	for (let n of HF) {
		let r = n.anchor(e) === e ? n.after?.(e)?.trim() ?? "" : "";
		r.length > 0 && (t += ` ${r}`);
	}
	return t;
}
function uI(e) {
	for (let t of HF) {
		if (t.anchor(e) !== e) continue;
		let n = t.words(e)?.trim() ?? "";
		if (n.length > 0) return n;
	}
	return "";
}
function dI(e, t) {
	if (FF === null && IF === null) {
		if (window.clearTimeout(zF), RF !== null && RF.target === e) {
			RF.words = t;
			return;
		}
		if (window.clearTimeout(LF), RF = null, NF !== null) {
			OI(!0), fI(e, t);
			return;
		}
		if (Date.now() - BF < AF) {
			fI(e, t);
			return;
		}
		RF = {
			target: e,
			words: t
		}, LF = window.setTimeout(() => {
			let e = RF;
			RF = null, e !== null && fI(e.target, e.words);
		}, OF);
	}
}
function fI(e, t) {
	let n = (t ?? cI(e)).trim();
	if (n.length === 0 || !e.isConnected || !LP(e) || hI(e) || RP(e)) return;
	window.clearTimeout(LF), window.clearTimeout(zF), RF = null;
	let r = kI();
	wx(r, n, { staticFolds: !0 }), r.classList.toggle(wF, r.querySelector("a[href]") !== null), r.classList.add(CF), NF = e, _I(gI(e)), r.setAttribute("data-ui-tooltip-text", Sx(n)), bI(r, e.getAttribute(He)), Mp(e, r), Np(e, r, {
		placement: EI(e),
		gap: jF,
		arrow: !0
	}), mI();
}
var pI = null;
function mI() {
	typeof MutationObserver > "u" || (pI ??= new MutationObserver(KF), pI.observe(document.documentElement, {
		childList: !0,
		subtree: !0
	}));
}
function hI(e) {
	return e.matches(TF) || e.querySelector(TF) !== null || e.querySelector(":scope > .ui-action-bar") !== null;
}
function gI(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t) ? t : e;
}
function _I(e) {
	PF !== null && PF !== e && vI();
	let t = yI(e);
	t.includes(SF) || e.setAttribute("aria-describedby", [...t, SF].join(" ")), PF = e;
}
function vI() {
	if (PF === null) return;
	let e = yI(PF).filter((e) => e !== SF);
	e.length === 0 ? PF.removeAttribute("aria-describedby") : PF.setAttribute("aria-describedby", e.join(" ")), PF = null;
}
function yI(e) {
	return (e.getAttribute("aria-describedby") ?? "").split(" ").filter((e) => e.length > 0);
}
function bI(e, t) {
	t === null ? e.removeAttribute(He) : e.setAttribute(He, t);
}
function xI(e, t, n) {
	let r = n?.plain === !0 ? Cx(t) : t;
	n?.delay === !0 && NF !== e ? dI(e, r) : fI(e, r);
}
function SI() {
	OI(!0);
}
var CI = {
	show: xI,
	hide: SI,
	escape: Cx
};
function wI(e) {
	FF = e, fI(e);
}
function TI(e) {
	if (NF === e) {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) {
			DI();
			return;
		}
		fI(e);
	}
}
function EI(e) {
	if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) for (let t of HF) {
		let n = t.anchor(e) === e ? t.placement?.(e) ?? null : null;
		if (n !== null) return n;
	}
	let t = e.getAttribute(Be);
	return t !== null && Sp(t) ? t : DF;
}
function DI() {
	FF = null, OI(!0);
}
function OI(e) {
	window.clearTimeout(LF), window.clearTimeout(zF), RF = null;
	let t = () => {
		NF !== null && (vI(), NF = null, IF = null, pI?.disconnect(), MF !== null && (MF.classList.remove(CF), Gp(MF)), BF = Date.now());
	};
	e ? t() : zF = window.setTimeout(t, kF);
}
function kI() {
	return MF !== null && MF.isConnected ? MF : (MF = document.createElement("div"), MF.id = SF, MF.className = xF, MF.setAttribute("role", "tooltip"), MF.setAttribute("aria-hidden", "true"), document.body.append(MF), MF);
}
//#endregion
//#region src/interactions/menu-engine.ts
var AI = "ui-orientation--horizontal", jI = `.${In} > .ui-menu__host > .ui-menu__item > .${S}`, MI = `${jI}, ${`.ui-menu[${un}] > .ui-menu__host > .ui-menu__item > .${S}`}`, NI = ":scope > .ui-button__content > .ui-text__body > .ui-text__header > .ui-text__title", PI = "[role='menuitem'], [role='menuitemcheckbox']", FI = class {
	root;
	tabStopsScheduled = !1;
	touched = /* @__PURE__ */ new Set();
	space = new Fc();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("keydown", (e) => this.handleEntryKeydown(e), !0), this.root.addEventListener("keyup", (e) => this.space.release(e, F), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), UF(zI), this.applyTabStops(this.root.querySelectorAll(`.${x}`)), this.root instanceof Node && new MutationObserver((e) => {
			for (let t of e) Cm(t) || BI(t, this.touched);
			this.touched.size > 0 && this.scheduleTabStops();
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [xn, pn]
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
		for (let n of e) n.isConnected && t.add(JN(n));
		for (let e of t) {
			let t = qN(e);
			if (t.length === 0) continue;
			let n = t.filter((e) => e.tabIndex === 0 && F(e));
			P(t, t.find((e) => e === document.activeElement) ?? t.find((e) => e.classList.contains("ui-menu-item--selected") && F(e)) ?? (n.length === 1 ? n[0] : void 0) ?? t.find(F) ?? t[0]);
		}
	}
	handleEntryKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || ol(e) || M(e) || !(e.target instanceof Element)) return;
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
		let r = JN(n), i = qN(r), a = mw(e);
		if (a !== null) {
			e.preventDefault(), Sl(i, bM(i, t, a));
			return;
		}
		let o = r.classList.contains(AI) || WN(r) ? "horizontal" : "vertical";
		if (!N(e) || this.handleGroupKey(e, t, r, o)) return;
		let s = e.key === "ArrowUp" && t === i.find(F) ? RI(r) : null, c = s ?? yl({
			key: e.key,
			items: i,
			current: t,
			axis: o
		});
		c !== null && (e.preventDefault(), c !== s && P(i, c), c.focus());
	}
	handleGroupKey(e, t, n, r) {
		let i = r === "vertical" ? "ArrowRight" : UN(n) === "top" ? "ArrowUp" : "ArrowDown", a = t.matches(zn) ? t.parentElement : null;
		if (e.key === i && a !== null) return e.preventDefault(), a.hasAttribute("data-ui-menu-open") ? Sl([], II(a)) : t.click(), !0;
		if (e.key !== "ArrowLeft" || r !== "vertical") return !1;
		let o = a !== null && a.hasAttribute("data-ui-menu-open") && !XN(a) ? a : LI(t), s = o?.querySelector(":scope > .ui-menu-item") ?? null;
		return o === null || s === null ? !1 : (e.preventDefault(), XN(o) || s.focus(), s.click(), !0);
	}
	pressEntry(e, t) {
		e.target !== t || !N(e, { shift: !0 }) || t.matches(Rn) || !F(t) || t.hasAttribute("href") && e.key === "Enter" || (e.preventDefault(), !e.repeat && (e.key === " " ? this.space.hold(t) : t.click()));
	}
	enterFromContainer(e) {
		let t = e.target instanceof HTMLElement && e.target.getAttribute("role") === "menu" ? e.target : null, n = t === null ? null : t.matches(".ui-menu") ? t : t.querySelector(`.${x}`);
		if (n === null) return;
		let r = qN(n), i = mw(e);
		if (i !== null) {
			e.preventDefault(), Sl(r, bM(r, null, i));
			return;
		}
		let a = N(e) ? yl({
			key: e.key,
			items: r,
			current: null,
			axis: n.classList.contains(AI) ? "horizontal" : "vertical"
		}) : null;
		a !== null && (e.preventDefault(), Sl(r, a));
	}
	handleFocusIn(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${S}`), n = t?.closest(".ui-menu") ?? null;
		t !== null && n !== null && P(qN(JN(n)), t);
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${S}`) : null;
		if (t === null || t === document.activeElement || !t.matches(PI) || t.matches(Rn) || !F(t)) return;
		let n = document.activeElement;
		(n instanceof HTMLElement && n.getAttribute("role") === "menu" && n.contains(t) || t.closest(".ui-menu")?.contains(n) === !0) && Hd(t);
	}
};
function II(e) {
	let t = e.querySelector(`:scope > .ui-menu__submenu > .${x}`);
	return t === null ? null : qN(t).find(F) ?? null;
}
function LI(e) {
	let t = e.closest(`.${x}`), n = t === null ? null : YN(t);
	return n !== null && n.hasAttribute("data-ui-menu-open") ? n : null;
}
function RI(e) {
	return e.hasAttribute("data-ui-menu-search") ? e.querySelector(":scope > .ui-collapsible__bar input") : null;
}
var zI = {
	anchor: (e) => e.closest(MI),
	words: (e) => {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length > 0) return null;
		let t = e.querySelector(NI), n = t?.textContent?.trim() ?? "";
		return t === null || n.length === 0 || e.matches(jI) && t.scrollWidth <= t.clientWidth ? null : Cx(n);
	},
	placement: (e) => {
		let t = e.closest(`.${x}`);
		return t === null ? null : UN(t);
	}
};
function BI(e, t) {
	let n = (e.target instanceof Element ? e.target : e.target.parentElement)?.closest(".ui-menu") ?? null;
	n !== null && t.add(n);
	for (let n of e.addedNodes) if (n instanceof HTMLElement) {
		n.classList.contains("ui-menu") && t.add(n);
		for (let e of n.querySelectorAll(`.${x}`)) t.add(e);
	}
}
//#endregion
//#region src/interactions/shortcut-engine.ts
var VI = "shortcut:", HI = ":scope > .ui-menu-item__shortcut", UI = `[${Ce}]`, WI = `[${Hn}]`, GI = ".ui-text__title", KI = class {
	root;
	options;
	claims = /* @__PURE__ */ new Map();
	entryShortcuts = /* @__PURE__ */ new Map();
	stale = !0;
	laterVersion = -1;
	constructor(e = {}) {
		this.root = e.root ?? document, this.options = e, this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), UF($I), XI(this.root), this.root instanceof Node && new MutationObserver((e) => {
			if (!Tm(e)) {
				this.stale = !0;
				for (let t of e) YI(t);
			}
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [Hn]
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || M(e) || ((this.stale || this.laterVersion !== (this.options.laterChords?.version ?? -1)) && this.rebuild(), this.claims.size === 0 && this.entryShortcuts.size === 0 || ol(e))) return;
		let t = Rm(this.root);
		if (!this.pressContextEntry(e, t)) for (let n of this.claims.values()) {
			if (n === null || !Sc(n.shortcut, e)) continue;
			let r = n.element ?? this.contentOf(n.view);
			if (r === null || !F(r) || t !== null && !t.contains(r)) return;
			e.preventDefault(), JI(e), n.view === null ? r.click() : r.dispatchEvent(new CustomEvent(n.view.name, { bubbles: !0 }));
			return;
		}
	}
	pressContextEntry(e, t) {
		let n = !1;
		for (let t of this.entryShortcuts.values()) n ||= Sc(t, e);
		let r = n ? vP() : null;
		if (r === null || t !== null && !t.contains(r)) return !1;
		let i = gP(r);
		if (i === null) return !1;
		let a = [...i.menu.querySelectorAll(WI)].filter((t) => {
			let n = xc(t.getAttribute(Hn));
			return n !== null && Sc(n, e) && !k(t) && GM(t, i.menu);
		});
		return a.length === 1 ? (e.preventDefault(), JI(e), a[0].click(), !0) : (a.length > 1 && s("context menu shortcut is claimed twice and will fire nothing.", { entries: a }), !1);
	}
	contentOf(e) {
		let t = e === null ? null : this.options.componentOf?.(e.componentId) ?? null;
		return t instanceof HTMLElement ? t : null;
	}
	rebuild() {
		this.claims.clear(), this.entryShortcuts.clear(), this.stale = !1;
		for (let e of this.root.querySelectorAll(WI)) {
			let t = e.getAttribute("data-ui-shortcut") ?? "", n = xc(t);
			if (n === null) {
				t.trim().length > 0 && s("shortcut could not be parsed.", {
					element: e,
					value: t
				});
				continue;
			}
			e.closest(UI) === null ? this.claim({
				shortcut: n,
				element: e,
				view: null
			}) : this.entryShortcuts.set(Ic(n), n);
		}
		for (let e of this.options.laterChords?.chords() ?? []) {
			let t = xc(e);
			t !== null && this.entryShortcuts.set(Ic(t), t);
		}
		this.laterVersion = this.options.laterChords?.version ?? -1;
		for (let e of this.options.viewShortcuts ?? []) {
			let t = xc(e.name.slice(9));
			t !== null && this.claim({
				shortcut: t,
				element: null,
				view: e
			});
		}
	}
	claim(e) {
		let t = Ic(e.shortcut);
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
function qI(e) {
	let t = /* @__PURE__ */ new Map(), n = [...e.events, ...e.interactions.map((e) => e.sourceEvent)];
	for (let e of n) e != null && e.eventName.startsWith(VI) && t.set(e.eventName, {
		name: e.eventName,
		componentId: e.componentId
	});
	return [...t.values()];
}
function JI(e) {
	il(e.target) && e.target.dispatchEvent(new Event(db, { bubbles: !0 }));
}
function YI(e) {
	if (e.type === "attributes") {
		e.target instanceof HTMLElement && ZI(e.target);
		return;
	}
	for (let t of e.addedNodes) t instanceof HTMLElement && XI(t);
}
function XI(e) {
	e instanceof HTMLElement && e.matches(WI) && ZI(e);
	for (let t of e.querySelectorAll(WI)) ZI(t);
}
function ZI(e) {
	let t = e.querySelector(HI);
	if (t === null) return;
	let n = QI(e) ?? "";
	t.textContent !== n && (t.textContent = n), e.hasAttribute("data-ui-menu-item-shortcut") !== n.length > 0 && e.toggleAttribute(_n, n.length > 0);
}
function QI(e) {
	let t = e.getAttribute(Hn), n = xc(t);
	return n === null ? t?.trim() || null : Cc(n);
}
var $I = {
	anchor: (e) => {
		let t = e.closest(WI);
		return t === null || t.classList.contains("ui-menu-item") || t.closest(UI) !== null ? null : t;
	},
	words: (e) => {
		let t = QI(e), n = (e.getAttribute("aria-label") ?? e.querySelector(GI)?.textContent ?? "").trim();
		return t === null ? null : Cx(n.length > 0 ? `${n} (${t})` : t);
	},
	after: (e) => {
		let t = QI(e);
		return t === null ? null : Cx(`(${t})`);
	}
}, eL = 50, tL = 1, nL = 7;
function rL(e) {
	let t = 0;
	for (let n of e.children) n.hasAttribute("data-ui-key") && t++;
	let n = bD(e, "data-ui-window-size") ?? 0;
	return {
		offset: bD(e, "data-ui-window-offset") ?? 0,
		count: t,
		size: n > 0 ? n : t > 0 ? t : eL,
		total: bD(e, tn),
		moreAfter: xD(e, rn)
	};
}
function iL(e) {
	return Math.floor(e.offset / e.size) + 1;
}
function aL(e) {
	return e.total === null ? null : Math.max(1, Math.ceil(e.total / e.size));
}
function oL(e, t) {
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
			let n = Number(t), r = aL(e);
			return !Number.isInteger(n) || n < 1 || r !== null && n > r || n === iL(e) ? null : (n - 1) * e.size;
		}
	}
}
function sL(e, t) {
	if (t <= nL) return lL(1, t);
	let n = Math.max(Math.min(e - tL, t - 2 - 2), 3), r = Math.min(Math.max(e + tL, 5), t - 2);
	return [
		1,
		n > 3 ? "gap" : 2,
		...lL(n, r),
		r < t - 2 ? "gap" : t - 1,
		t
	];
}
function cL(e, t) {
	let n = sL(e, t ? e + 1 : e);
	return t ? [...n, "gap"] : n;
}
function lL(e, t) {
	let n = [];
	for (let r = e; r <= t; r++) n.push(r);
	return n;
}
//#endregion
//#region src/interactions/pager-engine.ts
var uL = ".ui-pager", dL = "ui-pager__button", fL = "ui-pager__number", pL = "ui-pager__pages", mL = "ui-pager__gap", hL = "ui-pager__range", gL = "ui-pager__size", _L = "ui-pager__size--open", vL = "ui-pager__size-trigger", yL = "ui-pager__size-label", bL = "ui-pager__sizes", xL = "ui-pager__size-choice", SL = [
	dL,
	fL,
	"ui-button",
	"ui-button--ghost",
	"ui-button--small"
], CL = "ui.pager.page", wL = "ui.pager.range", TL = "ui.pager.rows", EL = "ui.pager.size", DL = [
	en,
	tn,
	rn,
	$t,
	Qt
], OL = "page-size", kL = class {
	options;
	root;
	drawn = /* @__PURE__ */ new WeakMap();
	store = new mN();
	restored = /* @__PURE__ */ new WeakSet();
	menus = new gg({
		show: ({ owner: e }) => e.classList.add(_L),
		hide: ({ owner: e }) => e.classList.remove(_L),
		closesWhenReadOnly: !1,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.syncAll(), this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e)), (e.pageKeys ?? window).addEventListener("keydown", (e) => this.handlePageKey(e), !0), V(this.root, `${uL}, [${b}]`, {
			childList: !0,
			attributeFilter: DL,
			relevant: (e) => e.type === "attributes" || RL(e.target) || zL(e)
		}, (e) => this.syncFound(e)), O.onChange(() => {
			this.drawn = /* @__PURE__ */ new WeakMap(), this.syncAll();
		});
	}
	syncAll() {
		for (let e of this.root.querySelectorAll(uL)) this.sync(e);
	}
	syncFound(e) {
		let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
		for (let r of e) {
			if (r.matches(uL)) {
				t.add(r);
				continue;
			}
			let e = r.closest(C), i = e === null ? 0 : D(e);
			i > 0 && n.add(String(i));
		}
		if (n.size > 0) for (let e of this.root.querySelectorAll(uL)) n.has(e.getAttribute("data-ui-pager-target") ?? "") && t.add(e);
		for (let e of t) this.sync(e);
	}
	hostOf(e) {
		return this.targetOf(e)?.host ?? null;
	}
	targetOf(e) {
		let t = Number(e.getAttribute(gt));
		if (!Number.isInteger(t) || t <= 0) return null;
		for (let e of this.options.dom.findEveryComponent(t)) {
			let t = LL(e);
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
		let i = rL(n), a = `${i.offset}|${i.count}|${i.size}|${i.total}|${i.moreAfter}`;
		if (this.drawn.get(e) === a) return;
		this.drawn.set(e, a);
		let o = EE(e), s = (e) => DE(e, "N0", o);
		this.drawNumbers(e, i, o), jL(e, i, s), ML(e, i, s);
		for (let t of e.querySelectorAll(`:scope > .${dL}[${_t}]`)) Ms.setDisabled(t, oL(i, t.getAttribute("data-ui-pager-page") ?? "") === null);
		PL(e);
	}
	drawNumbers(e, t, n) {
		let r = e.querySelector(`:scope > .${pL}`);
		if (r === null) return;
		let i = iL(t), a = aL(t), o = a === null ? cL(i, t.moreAfter) : sL(i, a), s = r.contains(document.activeElement);
		r.replaceChildren(...o.map((e) => AL(e, i, n))), s && !e.contains(document.activeElement) && r.querySelector("[aria-current='page']")?.focus({ preventScroll: !0 });
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(uL);
		if (t === null || k(e.target)) return;
		let n = e.target.closest(`.${xL}`);
		if (n !== null) {
			e.preventDefault(), this.chooseSize(t, Number(n.getAttribute(vt)));
			return;
		}
		let r = e.target.closest(`.${vL}`);
		if (r !== null) {
			e.preventDefault(), this.toggleSizes(r);
			return;
		}
		let i = e.target.closest(`[${_t}]`), a = i === null ? null : this.hostOf(t);
		if (i === null || a === null) return;
		let o = oL(rL(a), i.getAttribute("data-ui-pager-page") ?? "");
		o !== null && (e.preventDefault(), this.turnAsync(a, o));
	}
	async turnAsync(e, t) {
		await this.options.windows.requestOffsetAsync(e, t), Dl(e).top > 0 && Ol(e, 0);
	}
	handleKeyDown(e) {
		if (e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(uL);
		if (t === null) return;
		let n = e.target.closest(`.${gL}`);
		if (n !== null && this.handleSizeKey(e, n)) return;
		let r = e.target.closest(`.${dL}, .${vL}`), i = NL(t);
		if (r === null || !i.includes(r) || !N(e)) return;
		let a = yl({
			key: e.key,
			items: i,
			current: r,
			axis: "horizontal"
		});
		a !== null && (e.preventDefault(), Sl(i, a));
	}
	handleSizeKey(e, t) {
		let n = e.target instanceof Element ? e.target.closest(`.${vL}`) : null;
		return n !== null && !this.menus.isOpen(t) && (e.key === "ArrowDown" || e.key === "ArrowUp") && N(e) ? (e.preventDefault(), this.openSizes(t, n, e.key === "ArrowUp"), !0) : this.menus.isOpen(t) && vM(e, IL(t));
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${xL}`) : null, n = t?.closest(`.${gL}`) ?? null;
		t !== null && n !== null && this.menus.isOpen(n) && xM(t, IL(n));
	}
	toggleSizes(e) {
		let t = e.closest(`.${gL}`);
		t !== null && (this.menus.isOpen(t) ? this.menus.close(t) : this.openSizes(t, e, !1));
	}
	openSizes(e, t, n) {
		let r = e.querySelector(`:scope > .${bL}`);
		if (r === null) return;
		let i = IL(e), a = i.find((e) => e.getAttribute("aria-checked") === "true") ?? null;
		_M(this.menus, {
			owner: e,
			popup: r,
			anchor: t,
			placement: { placement: "bottom-end" },
			openers: [t]
		}, i, a, n);
	}
	restoreSize(e, t, n) {
		let r = this.store.read(t, OL), i = r === null ? 0 : Number(r);
		if (!Number.isInteger(i) || i <= 0) return;
		if (!FL(e, i)) {
			this.store.write(t, OL, null);
			return;
		}
		let a = rL(n);
		i !== a.size && (n.setAttribute($t, String(i)), a.count > 0 && this.turnAsync(n, Math.floor(a.offset / i) * i));
	}
	chooseSize(e, t) {
		let n = e.querySelector(`.${gL}`);
		n !== null && this.menus.close(n);
		let r = this.targetOf(e);
		if (r === null || !Number.isInteger(t) || t <= 0) return;
		let i = rL(r.host);
		t !== i.size && (this.store.write(r.component, OL, String(t)), r.host.setAttribute($t, String(t)), this.turnAsync(r.host, Math.floor(i.offset / t) * t));
	}
	handlePageKey(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "PageDown" && e.key !== "PageUp" || !N(e) || !(e.target instanceof Element)) return;
		let t = ku(e);
		if (t === null || !t.root.matches(".ui-items-view, .ui-table") || k(t.root)) return;
		let n = LL(t.root);
		if (n === null || !n.hasAttribute("data-ui-window-paged")) return;
		let r = oL(rL(n), e.key === "PageDown" ? "next" : "previous");
		r !== null && (e.preventDefault(), this.turnFromKeyAsync(t.root, n, r));
	}
	async turnFromKeyAsync(e, t, n) {
		let r = gu(e), i = Nu(r), a = i === null ? 0 : Math.max(0, r.indexOf(i));
		await this.options.windows.requestOffsetAsync(t, n);
		let o = gu(e);
		o.length > 0 && Lu(e, o, o[Math.min(a, o.length - 1)]);
	}
};
function AL(e, t, n) {
	if (e === "gap") {
		let e = document.createElement("span");
		return e.className = mL, e.setAttribute("aria-hidden", "true"), e.textContent = "…", e;
	}
	let r = document.createElement("button"), i = DE(e, "N0", n);
	return r.className = SL.join(" "), r.setAttribute("type", "button"), r.setAttribute(_t, String(e)), r.textContent = i, O.write(r, "aria-label", CL, { page: i }), e === t && r.setAttribute("aria-current", "page"), r;
}
function jL(e, t, n) {
	let r = e.querySelector(`:scope > .${hL}`);
	if (r === null) return;
	let i = n(t.count === 0 ? 0 : t.offset + 1), a = n(t.offset + t.count);
	t.total === null ? O.write(r, null, TL, {
		from: i,
		to: a
	}) : O.write(r, null, wL, {
		from: i,
		to: a,
		total: n(t.total)
	});
}
function ML(e, t, n) {
	let r = e.querySelector(`:scope > .${gL}`), i = r?.querySelector(`.${yL}`) ?? null;
	if (r !== null && i !== null) {
		O.write(i, null, EL, { size: n(t.size) });
		for (let e of IL(r)) e.setAttribute("aria-checked", Number(e.getAttribute("data-ui-pager-size")) === t.size ? "true" : "false");
	}
}
function NL(e) {
	return [...e.querySelectorAll(`.${dL}, .${vL}`)];
}
function PL(e) {
	let t = NL(e), n = t.find((e) => e === document.activeElement), r = t.filter((e) => e.getAttribute("data-ui-pager-page") === "previous" || e.getAttribute("data-ui-pager-page") === "next");
	P(t, n ?? r.find(F) ?? t.find((e) => e.getClientRects().length > 0) ?? null);
}
function FL(e, t) {
	let n = e.querySelector(`:scope > .${gL}`);
	return n !== null && IL(n).some((e) => Number(e.getAttribute("data-ui-pager-size")) === t);
}
function IL(e) {
	return [...e.querySelectorAll(`:scope > .${bL} > .${xL}`)];
}
function LL(e) {
	for (let t of e.querySelectorAll(`[${b}][${Gt}="windowed"]`)) if (t.closest(C) === e) return t;
	return null;
}
function RL(e) {
	return e instanceof Element && e.hasAttribute("data-ui-items-host");
}
function zL(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(uL) || t.querySelector(uL) !== null)) return !0;
	return !1;
}
//#endregion
//#region src/interactions/menu-search-engine.ts
var BL = `.${x}[${yn}]`, VL = ":scope > .ui-collapsible__bar", HL = ":scope > .ui-menu__host", UL = "ui-menu__item", WL = `:scope > .${S}`, GL = ":scope > .ui-menu__submenu > .ui-menu > .ui-menu__host", KL = class {
	active = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("input", (e) => this.handle(e), !0), t.addEventListener("change", (e) => this.handle(e), !0), t.addEventListener("keydown", (e) => this.handleKeydown(e)), V(t, BL, {
			childList: !0,
			characterData: !0,
			attributeFilter: [un]
		}, (e) => this.reconcile(e));
	}
	handle(e) {
		let t = e.target;
		if (!(t instanceof HTMLInputElement)) return;
		let n = qL(t);
		n !== null && this.search(n, t);
	}
	search(e, t) {
		let n = e.querySelector(HL);
		if (n === null) return;
		let r = th(t.value, e);
		if (r.length === 0) {
			this.clear(e, n);
			return;
		}
		this.active.has(e) || this.active.set(e, {
			field: t,
			openBefore: JL(n)
		}), e.setAttribute(bn, ""), dw(e, n, !this.filter(n, r));
	}
	filter(e, t) {
		let n = null, r = !1, i = !1;
		for (let a of YL(e)) {
			let e = XL(a);
			if (e === "header") {
				n !== null && QL(n, r), n = a, r = !1;
				continue;
			}
			let o = e !== "separator" && this.match(a, t);
			QL(a, o), r ||= o, i ||= o;
		}
		return n !== null && QL(n, r), i;
	}
	match(e, t) {
		let n = rh(ZL(e), t), r = e.hasAttribute("data-ui-menu-group") ? e.querySelector(GL) : null;
		if (r === null) return n;
		if (n) return $L(r), e.removeAttribute(pn), !0;
		let i = this.filter(r, t);
		return e.toggleAttribute(pn, i), i;
	}
	clear(e, t) {
		$L(t), e.removeAttribute(bn), YL(t).length > 0 && dw(e, t, !1);
		let n = this.active.get(e);
		if (n === void 0) return;
		this.active.delete(e);
		let r = e.hasAttribute(un);
		for (let e of t.querySelectorAll(`[${dn}]:not([${fn}])`)) e.toggleAttribute(pn, !r && n.openBefore.has(e.getAttribute("data-ui-key") ?? e));
	}
	reconcile(e) {
		for (let t of e) {
			let e = this.active.get(t);
			e !== void 0 && (t.hasAttribute("data-ui-collapsed") && (e.field.value = "", e.field.blur()), this.search(t, e.field));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "ArrowDown" || e.defaultPrevented || !N(e) || !(e.target instanceof HTMLInputElement)) return;
		let t = qL(e.target), n = t === null ? void 0 : qN(t).find(F);
		n !== void 0 && (e.preventDefault(), n.focus());
	}
};
function qL(e) {
	let t = e.closest(BL), n = t?.querySelector(VL) ?? null;
	return t !== null && n !== null && n.contains(e) ? t : null;
}
function JL(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e.querySelectorAll(`[${dn}][${pn}]`)) t.add(n.getAttribute("data-ui-key") ?? n);
	return t;
}
function YL(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && e.classList.contains(UL));
}
function XL(e) {
	return e.querySelector(WL)?.getAttribute("data-ui-menu-item-kind") ?? "item";
}
function ZL(e) {
	let t = e.querySelector(WL);
	return t === null ? "" : nh(oh(t), e);
}
function QL(e, t) {
	e.toggleAttribute(xn, !t);
}
function $L(e) {
	for (let t of e.querySelectorAll(`[${xn}]`)) t.removeAttribute(xn);
}
//#endregion
//#region src/interactions/screen-keyboard.ts
var eR = 120;
function tR(e) {
	return e.typing && e.tallest - e.height > eR;
}
var nR = class {
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
		let t = tR({
			height: e.height,
			tallest: this.tallest,
			typing: al(document.activeElement)
		});
		t !== document.documentElement.hasAttribute("data-ui-keyboard-up") && document.documentElement.toggleAttribute(qr, t);
	}
}, rR = "[data-ui-root]", iR = "a[href]", aR = "ui-collapsible", oR = "ui-collapsible__bar", sR = "right-side", cR = "ui-side--left", lR = "ui-side--right", uR = "pinned", dR = class {
	root;
	holders = /* @__PURE__ */ new Map();
	openers = /* @__PURE__ */ new WeakMap();
	switchNames = /* @__PURE__ */ new Map();
	store = new mN();
	constructor(e = {}) {
		if (this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), typeof matchMedia == "function") for (let e of iN) matchMedia(e).addEventListener("change", () => this.refit());
		for (let e of document.querySelectorAll(rR)) vR(e);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Sn}]`);
		if (t !== null) {
			let e = t.closest(rR), n = t.getAttribute(Sn);
			e !== null && n !== null && this.toggle(e, n, t);
			return;
		}
		let n = e.target.closest(`[${Dn}]`);
		if (n !== null) {
			let e = n.closest(rR), t = n.getAttribute(Dn);
			e !== null && t !== null && this.pin(e, t, !e.hasAttribute(On(t)), n);
			return;
		}
		if (e.target.closest("[data-ui-drawer-backdrop]") !== null) {
			this.closeAll();
			return;
		}
		let r = e.target.closest(`[${Un}]`);
		if (r !== null && !e.defaultPrevented && hR(r)) {
			this.closeAll();
			return;
		}
		let i = e.target.closest(`${iR}, .${S}`), a = i?.closest(`[${Mn}]`), o = a?.parentElement ?? null;
		i !== null && a != null && o?.getAttribute("data-ui-drawer-open") === a.getAttribute("data-ui-region") && gR(i) && this.close(o);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || M(e)) return;
		if (e.key === "Tab") {
			this.trapTab(e);
			return;
		}
		if (e.key !== "Escape" || Yc(e) || Jm()) return;
		let t = !1;
		for (let { shell: e, drawer: n, modal: r } of this.openDrawers()) !r && !n.contains(document.activeElement) || (this.close(e), t = !0);
		t && e.preventDefault();
	}
	trapTab(e) {
		for (let { drawer: t, modal: n } of this.openDrawers()) n && Jd(t, e);
	}
	openDrawers() {
		let e = [];
		for (let t of document.querySelectorAll(`${rR}[${Cn}]`)) {
			let n = t.getAttribute("data-ui-drawer-open") ?? "", r = yR(t, n);
			r !== null && !zm(r) && e.push({
				shell: t,
				drawer: r,
				modal: _R(t, n)
			});
		}
		return e;
	}
	refit() {
		for (let e of document.querySelectorAll(`${rR}[${Cn}]`)) {
			let t = e.getAttribute("data-ui-drawer-open") ?? "", n = yR(e, t), r = this.openers.get(e);
			n === null || !sN(e, t) ? this.close(e) : r?.isConnected === !0 && this.placeSwitch(n, r);
		}
	}
	toggle(e, t, n) {
		if (e.getAttribute("data-ui-drawer-open") === t) {
			this.close(e);
			return;
		}
		let r = yR(e, t);
		r === null || r.hasAttribute("data-ui-bottom-bar") || !sN(e, t) || (e.hasAttribute("data-ui-drawer-open") && this.close(e), e.setAttribute(Cn, t), this.openers.set(e, n), this.markToggles(e), this.hold(r, _R(e, t)), this.placeSwitch(r, n), this.focusInto(e, t, r, document.activeElement, Fd(), performance.now() + B.normal));
	}
	hold(e, t) {
		if (this.holders.has(e) || e.hasAttribute("data-ui-focus-holder")) return;
		let n = !e.hasAttribute("tabindex"), r = t && !e.hasAttribute("aria-label") && !e.hasAttribute("aria-labelledby");
		this.holders.set(e, {
			modal: t,
			addsTabIndex: n,
			addsName: r,
			role: e.getAttribute("role")
		}), n && (e.tabIndex = -1), t && (e.setAttribute(yi, ""), e.setAttribute("role", "dialog"), e.setAttribute("aria-modal", "true"), r && e.setAttribute("aria-label", O.text("ui.side.panel")));
	}
	placeSwitch(e, t) {
		let n = fR(e), r = t.getBoundingClientRect();
		if (n === null) return;
		this.switchNames.has(n) || this.switchNames.set(n, n.getAttribute("aria-label")), n.setAttribute("aria-label", O.text("ui.side.close"));
		let i = n.parentElement?.classList.contains(oR) === !0 ? n.parentElement : n;
		if (r.width === 0 || r.height === 0) {
			n.removeAttribute(wn), i.removeAttribute(Tn);
			return;
		}
		n.style.setProperty("--ui-drawer-switch-width", `${r.width}px`), n.style.setProperty("--ui-drawer-switch-height", `${r.height}px`), n.style.setProperty("--ui-drawer-switch-x", "0px"), i.style.setProperty("--ui-drawer-switch-y", "0px"), n.setAttribute(wn, ""), i.setAttribute(Tn, "");
		let a = n.getBoundingClientRect(), o = e.getBoundingClientRect(), s = mR(r.left - e.offsetLeft, e.clientWidth - a.width), c = mR(r.top - o.top, e.clientHeight - a.height);
		n.style.setProperty("--ui-drawer-switch-x", `${s - (a.left - o.left)}px`), i.style.setProperty("--ui-drawer-switch-y", `${c - (a.top - o.top)}px`);
	}
	focusInto(e, t, n, r, i, a) {
		e.getAttribute("data-ui-drawer-open") !== t || document.activeElement !== r || n.contains(r) || (ef(n, i ? n : null), performance.now() < a && document.activeElement === r && requestAnimationFrame(() => this.focusInto(e, t, n, r, i, a)));
	}
	pin(e, t, n, r) {
		let i = yR(e, t);
		if (i === null || uN(e, t)) return;
		let a = i.contains(r);
		if (n && e.getAttribute("data-ui-drawer-open") === t && this.close(e, !a), e.toggleAttribute(On(t), n), vR(e), !n && a && i.contains(document.activeElement)) {
			let n = this.returnTarget(e, t);
			n !== null && z(n);
		}
		let o = i.querySelector(`[${Je}]`);
		o !== null && this.store.write(o, uR, n ? "true" : null, n ? {
			root: !0,
			attributes: { [On(t)]: "" }
		} : null);
	}
	closeAll() {
		for (let e of document.querySelectorAll(`${rR}[${Cn}]`)) this.close(e);
	}
	close(e, t = !0) {
		let n = e.getAttribute(Cn);
		if (e.removeAttribute(Cn), this.markToggles(e), n === null) return;
		let r = yR(e, n), i = document.activeElement;
		if (t && (i === null || i === document.body || r?.contains(i) === !0)) {
			let t = this.returnTarget(e, n);
			t !== null && r !== null && r.contains(i) ? uf(t, r) : t !== null && z(t);
		}
		this.release(r), this.renameSwitch(r);
	}
	returnTarget(e, t) {
		let n = this.openers.get(e);
		if (this.openers.delete(e), n?.isConnected === !0 && n.getAttribute("data-ui-drawer-toggle") === t && n.checkVisibility()) return n;
		let r = [...e.querySelectorAll(`[${Sn}="${w(t)}"]`)];
		return r.find((e) => e.checkVisibility()) ?? r[0] ?? null;
	}
	markToggles(e) {
		let t = e.getAttribute(Cn);
		for (let n of e.querySelectorAll(`[${Sn}]`)) n.setAttribute("aria-expanded", String(n.getAttribute(Sn) === t));
	}
	release(e) {
		let t = e === null ? void 0 : this.holders.get(e);
		e !== null && t !== void 0 && (this.holders.delete(e), t.addsTabIndex && e.removeAttribute("tabindex"), t.modal && (e.removeAttribute(yi), e.removeAttribute("aria-modal"), t.role === null ? e.removeAttribute("role") : e.setAttribute("role", t.role), t.addsName && e.removeAttribute("aria-label")));
	}
	renameSwitch(e) {
		for (let [t, n] of this.switchNames) e?.contains(t) !== !0 && t.isConnected || (this.switchNames.delete(t), n === null ? t.removeAttribute("aria-label") : t.setAttribute("aria-label", n));
	}
};
function fR(e) {
	for (let t of e.querySelectorAll(`[${Un}]`)) if (hR(t) && t.checkVisibility() && pR(t.closest(`.${aR}`), e)) return t;
	return null;
}
function pR(e, t) {
	let n = e;
	for (; n !== null && n !== t;) {
		let e = n.parentElement;
		if (e === null || e.firstElementChild !== n) return !1;
		n = e;
	}
	return n === t;
}
function mR(e, t) {
	return Math.max(0, Math.min(e, t));
}
function hR(e) {
	let t = e.closest(`.${aR}`), n = t?.closest(`[${Mn}]`), r = n?.getAttribute(Mn), i = n?.parentElement;
	return t == null || t.hasAttribute("data-ui-collapsed") || r == null || i == null ? !1 : i.matches(rR) && i.getAttribute("data-ui-drawer-open") === r && t.classList.contains(r === sR ? lR : cR);
}
function gR(e) {
	return !e.classList.contains("ui-menu-item") || KN(e) && e.closest(vi) === null;
}
function _R(e, t) {
	return !(e.getAttribute("data-ui-drawer-modeless") ?? "").split(" ").includes(t);
}
function vR(e) {
	for (let t of e.querySelectorAll(`[${Dn}]`)) {
		let n = String(e.hasAttribute(On(t.getAttribute("data-ui-drawer-pin") ?? "")));
		t.getAttribute("aria-pressed") !== n && (t.setAttribute("aria-pressed", n), t.getAttribute("data-ui-value-kind") === "pressed" && t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}
function yR(e, t) {
	return e.querySelector(`:scope > [${Mn}="${w(t)}"]`);
}
//#endregion
//#region src/interactions/collapsible-engine.ts
var bR = "ui-collapsible", xR = "ui-collapsible__content", SR = "ui-collapsible__bar", CR = "ui-collapsible__bar-content", wR = "collapsed", TR = class {
	root;
	store = new mN();
	restored = /* @__PURE__ */ new WeakSet();
	folds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.restoreEach(this.root.querySelectorAll(`.${bR}`)), V(this.root, `.${bR}`, {
			childList: !0,
			attributeFilter: [un]
		}, (e) => this.restoreEach(e));
	}
	restoreEach(e) {
		for (let t of e) {
			if (this.restored.has(t)) {
				this.apply(t, t.hasAttribute(un));
				continue;
			}
			this.restored.add(t), this.restore(t);
		}
	}
	restore(e) {
		if (this.toggleOf(e) === null) return;
		let t = this.store.read(e, wR);
		t !== null && this.apply(e, t === "true");
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Un}]`), n = t?.closest(`.${bR}`) ?? null;
		if (t === null || n === null || hR(t)) return;
		e.preventDefault();
		let r = !n.hasAttribute(un), i = this.partsOf(n, t);
		this.cancelFold(n);
		let a = DR(n, i);
		this.apply(n, r), this.playFold(n, i, a, r), this.store.write(n, wR, r ? "true" : "false", r ? { attributes: { [un]: "" } } : null);
	}
	apply(e, t) {
		e.toggleAttribute(un, t), this.toggleOf(e)?.setAttribute("aria-expanded", t ? "false" : "true");
	}
	partsOf(e, t) {
		return {
			content: e.querySelector(`:scope > .${xR}`),
			bar: e.querySelector(`:scope > .${SR} > .${CR}`),
			toggle: t
		};
	}
	toggleOf(e) {
		return e.querySelector(`:scope > [${Un}], :scope > .${SR} > [${Un}]`);
	}
	playFold(e, t, n, r) {
		if (typeof e.animate != "function" || lp()) return;
		let i = kR(ER(e), n, DR(e, t), r);
		if (i === null) return;
		e.setAttribute(Wn, ""), e.offsetWidth;
		let a = {
			duration: B.normal,
			easing: B.ease
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
function ER(e) {
	return e.classList.contains("ui-side--top") || e.classList.contains("ui-side--bottom") ? "height" : "width";
}
function DR(e, t) {
	let n = ER(e), r = OR(n), i = e.getBoundingClientRect(), a = t.content?.getBoundingClientRect(), o = t.toggle.getBoundingClientRect();
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
function OR(e) {
	return e === "width" ? "height" : "width";
}
function kR(e, t, n, r) {
	let i = OR(e), a = t.component !== n.component, o = Math.abs(t.componentAcross - n.componentAcross) >= .5;
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
function AR(e, t) {
	if (typeof ResizeObserver == "function") {
		let n = new ResizeObserver(() => t(e));
		return n.observe(e), () => n.disconnect();
	}
	let n = () => t(e);
	return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
}
//#endregion
//#region src/interactions/grid-splitter-engine.ts
var jR = "ui-grid-splitter", MR = "ui-container", NR = "ui-orientation--vertical", PR = 16, FR = {
	sliver: 0,
	passFloors: !0
}, IR = {
	sliver: 48,
	passFloors: !0
}, LR = {
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
}, RR = {
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
}, zR = class {
	root;
	store = new mN();
	restored = /* @__PURE__ */ new WeakMap();
	warner = new p();
	drag;
	placedTiers = /* @__PURE__ */ new WeakMap();
	waiting = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new sh({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${jR}`),
			begin: (e) => this.resolveContext(e),
			coordinate: (e) => e.axis.coordinate,
			move: (e, t) => {
				this.apply(e, t, FR) && this.reportPosition(e.splitter, e.tracks);
			},
			end: (e, t) => {
				this.settle(e), this.remember(t), this.reportPosition(e), this.writeBack(e, t);
			},
			cancel: (e, t) => this.putBack(e, t)
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.prepareEach(this.root.querySelectorAll(`.${jR}`)), V(this.root, `.${jR}`, { childList: !0 }, (e) => this.prepareEach(e)), V(this.root, `.${jR}`, { attributeFilter: [Jn] }, (e) => this.takeEach(e)), window.addEventListener("resize", () => this.reportEach());
	}
	prepareEach(e) {
		for (let t of e) {
			let e = HR(t);
			e !== null && (this.restore(e, UR(t)), this.place(t), this.reportPosition(t));
		}
	}
	restore(e, t) {
		let n = this.restored.get(e);
		if (n === void 0 && (n = /* @__PURE__ */ new Set(), this.restored.set(e, n)), n.has(t.slot)) return;
		n.add(t.slot);
		let r = this.store.readJson(e, t.slot);
		if (r !== null) for (let n of fp) {
			let i = r[n], a = _p(t.split, n);
			i !== void 0 && e.style.getPropertyValue(a).length === 0 && e.style.setProperty(a, i);
		}
	}
	place(e) {
		let t = XR(e);
		if (t === null) return;
		if (e.getClientRects().length === 0) {
			this.waitForBox(e);
			return;
		}
		this.stopWaiting(e);
		let n = this.resolveContext(e);
		if (n === null || (this.placedTiers.set(e, n.tier), !e.hasAttribute("data-ui-bind-position") && GR(n.container, n.axis, n.tier) !== void 0)) return;
		let r = rc(n.sizes, n.runs, t);
		Math.abs(r) >= 1 && this.apply(n, r) && this.remember(n);
	}
	waitForBox(e) {
		this.waiting.has(e) || this.waiting.set(e, AR(e, () => {
			!e.isConnected || XR(e) === null ? this.stopWaiting(e) : e.getClientRects().length > 0 && (this.place(e), this.reportPosition(e));
		}));
	}
	stopWaiting(e) {
		this.waiting.get(e)?.(), this.waiting.delete(e);
	}
	takeEach(e) {
		for (let t of e) XR(t) === null && t.hasAttribute("data-ui-bind-position") ? this.reset(t, !1) : this.place(t), this.reportPosition(t);
	}
	reportEach() {
		let e = gp();
		for (let t of this.root.querySelectorAll(`.${jR}`)) this.placedTiers.has(t) && this.placedTiers.get(t) !== e && this.place(t), this.reportPosition(t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || !N(e)) return;
		let t = e.target.closest(`.${jR}`);
		if (t === null || this.drag.active || k(t)) return;
		if (e.key === "Enter") {
			e.preventDefault(), this.reset(t);
			return;
		}
		let n = this.resolveContext(t);
		if (n === null) return;
		let r = QR(t), i = n.sizes.reduce((e, t) => e + t, 0), a;
		switch (e.key) {
			case n.axis.decrease:
				a = -r;
				break;
			case n.axis.increase:
				a = r;
				break;
			case "PageUp":
			case "PageDown":
				a = Ns(r, i) * YR(e.key, n.axis);
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
		let n = HR(e);
		if (n === null) return;
		let r = UR(e);
		for (let e of fp) n.style.removeProperty(_p(r.split, e));
		this.store.write(n, r.slot, null), this.placedTiers.delete(e), e.hasAttribute("data-ui-bind-position") || this.place(e), this.reportPosition(e), t && e.hasAttribute("data-ui-bind-position") && e.hasAttribute("data-ui-splitter-position") && (e.removeAttribute(Jn), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	writeBack(e, t) {
		if (!e.hasAttribute("data-ui-bind-position")) return;
		let n = ZR(nc(KR(t.container, t.axis), t.runs));
		e.getAttribute("data-ui-splitter-position") !== n && (e.setAttribute(Jn, n), this.placedTiers.set(e, t.tier), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	handleDoubleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${jR}`) : null;
		t !== null && this.reset(t);
	}
	settle(e) {
		let t = this.resolveContext(e), n = t === null ? 0 : sc(t.tracks, t.sizes, t.runs, 48);
		t !== null && n !== 0 && this.apply(t, n, FR);
	}
	putBack(e, t) {
		let n = _p(t.axis.split, t.tier);
		t.before.length === 0 ? t.container.style.removeProperty(n) : t.container.style.setProperty(n, t.before), this.reportPosition(e);
	}
	apply(e, t, n = IR) {
		let r = Ks(e.tracks, e.sizes, e.runs, t, n);
		return r !== null && (e.container.style.setProperty(_p(e.axis.split, e.tier), Rs(r)), !0);
	}
	remember(e) {
		let { container: t, axis: n } = e, r = {}, i = {};
		for (let e of fp) {
			let a = _p(n.split, e), o = t.style.getPropertyValue(a).trim();
			o.length > 0 && (r[e] = o, i[a] = o);
		}
		let a = { styles: i };
		this.store.write(t, n.slot, Object.keys(r).length === 0 ? null : JSON.stringify(r), a);
	}
	resolveContext(e) {
		let t = HR(e);
		if (t === null) return this.warner.warn(e, "a grid splitter must be a direct child of a container."), null;
		let n = UR(e), r = gp(), i = WR(t, n, r), a = i === null ? null : Ps(i);
		if (a === null) return this.warner.warn(e, "the container's track list could not be read.", { template: i }), null;
		let o = Hs(a, Vs(t.getAttribute(n.limits))), s = KR(t, n), c = qR(e, n);
		if (c === null || c >= o.length || s.length < o.length) return this.warner.warn(e, "the splitter's track could not be found in its container.", {
			index: c,
			tracks: o.length,
			sizes: s.length
		}), null;
		o[c].kind === "star" && this.warner.warn(e, "a grid splitter sits in a star track and shares the room it divides; give it an Auto or Absolute track.");
		let l = Us(c, JR(t, n).map((e) => qR(e, n)).filter((e) => e !== null && e !== c), o.length);
		return l === null ? (this.warner.warn(e, "a grid splitter at the container's edge has nothing on one side to move."), null) : {
			splitter: e,
			container: t,
			axis: n,
			tracks: o,
			sizes: s,
			runs: l,
			tier: r,
			before: t.style.getPropertyValue(_p(n.split, r))
		};
	}
	reportPosition(e, t) {
		let n = HR(e);
		if (n === null) return;
		let r = UR(e), i = qR(e, r), a = KR(n, r), o = JR(n, r).map((e) => qR(e, r)).filter((e) => e !== null && e !== i), s = i === null ? null : Us(i, o, a.length);
		if (s === null) return;
		e.setAttribute("aria-valuemin", "0"), e.setAttribute("aria-valuemax", "100"), e.setAttribute("aria-valuenow", String(tc(a, s)));
		let c = BR(a, s.before) ? "before" : BR(a, s.after) ? "after" : null;
		c === null ? e.removeAttribute(Xr) : e.getAttribute("data-ui-split-edge") !== c && e.setAttribute(Xr, c), VR(n, t === void 0 ? null : {
			axis: r,
			tracks: cc(t, a, s, 48)
		});
	}
};
function BR(e, t) {
	return t.every((t) => (e[t] ?? 0) < 1);
}
function VR(e, t) {
	let n = [LR, RR].filter((t) => JR(e, t).length > 0).map((t) => ({
		axis: t,
		sizes: KR(e, t)
	}));
	for (let r of e.children) {
		if (!(r instanceof HTMLElement)) continue;
		let e = getComputedStyle(r), i = r.classList.contains(jR) ? UR(r) : null, a = n.some(({ axis: n, sizes: r }) => n !== i && uc(e[n.lineStart], e[n.lineEnd], r, t?.axis === n ? t.tracks : void 0));
		a !== r.hasAttribute("data-ui-split-folded") && r.toggleAttribute(Yr, a);
	}
}
function HR(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(MR) ? t : null;
}
function UR(e) {
	return e.classList.contains(NR) ? LR : RR;
}
function WR(e, t, n) {
	let r = GR(e, t, n);
	if (r !== void 0) return r;
	let i = e.style.getPropertyValue(t.authored).trim();
	return i.length > 0 ? i : null;
}
function GR(e, t, n) {
	return bp(n, (n) => e.style.getPropertyValue(_p(t.split, n)).trim() || void 0);
}
function KR(e, t) {
	return getComputedStyle(e)[t.computed].split(" ").map(parseFloat).filter((e) => Number.isFinite(e));
}
function qR(e, t) {
	let n = Number(getComputedStyle(e)[t.lineStart]);
	return Number.isInteger(n) && n >= 1 ? n - 1 : null;
}
function JR(e, t) {
	let n = [];
	for (let r of e.children) r instanceof HTMLElement && r.classList.contains(jR) && UR(r) === t && n.push(r);
	return n;
}
function YR(e, t) {
	return t.increase === "ArrowDown" ? e === "PageDown" ? 1 : -1 : e === "PageUp" ? 1 : -1;
}
function XR(e) {
	return ic(e.getAttribute(Jn));
}
function ZR(e) {
	return String(Math.round(e * 1e4) / 1e4);
}
function QR(e) {
	let t = Number(e.getAttribute(qn));
	return Number.isFinite(t) && t > 0 ? t : PR;
}
//#endregion
//#region src/interactions/pane-container-engine.ts
var $R = "ui-pane-container", ez = "ui-pane-container__place", tz = "ui-pane-container__pane", nz = "ui-pane-container__grip", rz = "data-ui-pane-lifted", iz = "data-ui-pane-target", az = "data-ui-pane-moving", oz = "data-ui-pane-near", sz = ".ui-text-type--display, .ui-text-type--title, .ui-text-type--subtitle", cz = "panes", lz = ",", uz = 32, dz = class {
	root;
	store = new mN();
	drag;
	restored = /* @__PURE__ */ new WeakSet();
	held = null;
	near = null;
	nearTop = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new sh({
			root: this.root,
			resolveHandle: (e) => pz(e),
			begin: (e, t) => this.lift(e, t),
			move: (e, t, n) => this.follow(e, n),
			end: (e, t) => this.put(t),
			cancel: (e, t) => this.putBack(t),
			takenBack: (e, t) => this.putBack(t)
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), { passive: !0 }), this.root.addEventListener("pointerout", (e) => this.handlePointerOut(e), { passive: !0 }), this.root.addEventListener("pointerover", () => this.forgetNearTop(), { passive: !0 }), this.root.addEventListener("scroll", () => this.forgetNearTop(), {
			capture: !0,
			passive: !0
		}), window.addEventListener("resize", () => this.forgetNearTop()), this.arrangeEach(this.root.querySelectorAll(`.${$R}`), !1), V(this.root, `.${$R}`, {
			childList: !0,
			attributeFilter: [Yn],
			relevant: vz
		}, (e) => this.arrangeEach(yz(e), !0));
	}
	arrangeEach(e, t) {
		for (let n of e) {
			let e = !this.restored.has(n);
			if (e) {
				this.restored.add(n), this.restore(n);
				for (let e of bz(n)) {
					let t = e.querySelector(`:scope > .${tz} > .${nz}`);
					t !== null && hz(t);
				}
			}
			n.hasAttribute(az) || wz(n, Sz(n), t && !e);
		}
	}
	restore(e) {
		if (e.hasAttribute("data-ui-bind-layout")) return;
		let t = this.store.read(e, cz);
		t !== null && e.setAttribute(Yn, t);
	}
	lift(e, t) {
		this.dropStaleHold();
		let n = e.parentElement, r = n?.parentElement, i = r?.parentElement;
		if (this.held !== null || n === null || r == null || i == null || xz(i).length < 2) return null;
		if (typeof n.getAnimations == "function") for (let e of n.getAnimations()) e.cancel();
		return n.setAttribute(rz, ""), i.setAttribute(az, ""), {
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
		e.pane.style.transform = `translate(${t.x - e.start.x}px, ${t.y - e.start.y}px)`, this.mark(e, kz(e.container, e.origin, t));
	}
	mark(e, t) {
		e.target !== t && (e.target?.removeAttribute(iz), t?.setAttribute(iz, ""), e.target = t);
	}
	put(e) {
		let t = e.target, n = e.pane.parentElement, r = t?.querySelector(`:scope > .${tz}`) ?? null;
		if (t === null || n === null || r === e.pane || !e.container.isConnected) return this.putBack(e), null;
		this.settle(e);
		let i = /* @__PURE__ */ new Map([[e.pane, t]]);
		return r !== null && i.set(r, n), Tz(i, !0), this.keep(e.container), t;
	}
	putBack(e) {
		this.settle(e), Ez(e.pane), e.container.isConnected && wz(e.container, Sz(e.container), !0);
	}
	settle(e) {
		e.target?.removeAttribute(iz), e.pane.removeAttribute(rz), e.container.removeAttribute(az), e.grip.setAttribute("aria-pressed", "false"), e.grip.removeAttribute(bi);
	}
	keep(e) {
		let t = Cz(e);
		e.setAttribute(Yn, t), e.hasAttribute("data-ui-bind-layout") ? e.dispatchEvent(new Event("change", { bubbles: !0 })) : this.store.write(e, cz, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || !N(e)) return;
		this.dropStaleHold();
		let t = pz(e.target);
		if (t === null || this.drag.active) return;
		let n = this.held;
		if (n === null) {
			if (e.key !== " " && e.key !== "Enter") return;
			e.preventDefault(), this.hold(t);
			return;
		}
		if (n.pane !== t.parentElement) return;
		let r = fz[e.key];
		if (r !== void 0) {
			e.preventDefault();
			let t = Az(n.container, n.origin, n.target ?? n.origin, r) ?? n.target;
			t !== null && t !== n.target && TO({
				key: "ui.pane.target",
				args: _z(n.container, t)
			}), this.mark(n, t);
			return;
		}
		if (e.key === " " || e.key === "Enter") {
			e.preventDefault(), this.held = null;
			let r = this.put(n);
			if (r === null) TO({ key: "ui.pane.back" });
			else {
				let { index: e, count: t } = _z(n.container, r);
				DO(e, t);
			}
			t.focus({ preventScroll: !0 });
			return;
		}
		e.key === "Escape" && (e.preventDefault(), this.held = null, this.putBack(n), TO({ key: "ui.pane.back" }));
	}
	hold(e) {
		this.held = this.lift(e, {
			x: 0,
			y: 0
		}), this.held !== null && (e.setAttribute("aria-pressed", "true"), e.setAttribute(bi, ""), TO({ key: "ui.pane.lifted" }));
	}
	handleFocusOut(e) {
		let t = this.held;
		t === null || !(e.target instanceof Element) || e.target.parentElement !== t.pane || (this.held = null, this.putBack(t));
	}
	handleFocusIn(e) {
		let t = e.target instanceof Element ? pz(e.target) : null;
		t !== null && hz(t);
	}
	handlePointerMove(e) {
		if (!(e instanceof PointerEvent) || e.pointerType === "touch") return;
		let t = e.target instanceof Element ? mz(e.target) : null;
		if (t === null) {
			this.markNear(null);
			return;
		}
		let n = this.nearTop;
		n?.pane !== t && (n = {
			pane: t,
			top: t.getBoundingClientRect().top
		}, this.nearTop = n), this.markNear(e.clientY - n.top < uz ? t : null);
	}
	forgetNearTop() {
		this.nearTop = null;
	}
	markNear(e) {
		e !== this.near && (this.near?.removeAttribute(oz), e?.setAttribute(oz, ""), this.near = e);
	}
	handlePointerOut(e) {
		e instanceof PointerEvent && e.relatedTarget === null && this.markNear(null);
	}
}, fz = {
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
function pz(e) {
	let t = e.closest(`.${nz}`);
	return t?.parentElement?.parentElement?.parentElement?.classList.contains($R) === !0 ? t : null;
}
function mz(e) {
	let t = e.closest(`.${tz}`);
	return t?.parentElement?.parentElement?.classList.contains($R) === !0 ? t : null;
}
function hz(e) {
	let t = e.parentElement, n = t === null ? null : gz(t), r = n === null ? "ui.pane.move" : "ui.pane.grip", i = n === null ? null : { name: n };
	e.getAttribute("aria-label") !== O.translate(r, i) && O.write(e, "aria-label", r, i);
}
function gz(e) {
	for (let t of e.querySelectorAll(sz)) {
		let n = mz(t) === e ? t.textContent?.trim() ?? "" : "";
		if (n.length > 0) return n;
	}
	return null;
}
function _z(e, t) {
	let n = xz(e);
	return {
		index: n.indexOf(t) + 1,
		count: n.length
	};
}
function vz(e) {
	if (e.type === "attributes") return e.target instanceof Element && e.target.classList.contains($R);
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains($R) || t.querySelector(`.${$R}`) !== null)) return !0;
	return !1;
}
function yz(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) {
		t.add(n);
		for (let e of n.querySelectorAll(`.${$R}`)) t.add(e);
	}
	return t;
}
function bz(e) {
	return Array.from(e.querySelectorAll(`:scope > .${ez}`));
}
function xz(e) {
	return bz(e).filter((e) => e.getClientRects().length > 0);
}
function Sz(e) {
	return e.getAttribute(Yn);
}
function Cz(e) {
	return bz(e).map((e) => e.querySelector(`:scope > .${tz}`)?.getAttribute("data-ui-pane") ?? "").join(lz);
}
function wz(e, t, n) {
	let r = bz(e), i = Oz(r.map((e) => e.getAttribute("data-ui-pane-place") ?? ""), t), a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
	for (let e of r) {
		let t = e.querySelector(`:scope > .${tz}`), n = t?.getAttribute(Xn);
		t != null && n != null && a.set(n, t);
	}
	r.forEach((e, t) => {
		let n = a.get(i[t]);
		n !== void 0 && n.parentElement !== e && o.set(n, e);
	}), o.size > 0 && Tz(o, n);
}
function Tz(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let t of e.keys()) n.set(t, t.getBoundingClientRect());
	for (let [t, n] of e) t.style.transform = "", n.append(t);
	if (!t || lp()) return;
	let r = e.size + 1;
	for (let [e, t] of n) {
		let n = typeof e.animate == "function" ? Dz(t, e.getBoundingClientRect()) : null, i = String(r--);
		n !== null && e.animate(n.map((e) => ({
			...e,
			zIndex: i
		})), {
			duration: B.normal + 60,
			easing: B.ease
		});
	}
}
function Ez(e) {
	let t = e.style.transform;
	e.style.transform = "", !(t.length === 0 || t === "translate(0px, 0px)" || lp() || typeof e.animate != "function") && e.animate([{ transform: t }, { transform: "none" }], {
		duration: B.normal,
		easing: B.ease
	});
}
function Dz(e, t) {
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
function Oz(e, t) {
	let n = new Set(e), r = /* @__PURE__ */ new Set(), i = e.map(() => null), a = t === null || t.length === 0 ? [] : t.split(lz).map((e) => e.trim());
	for (let e = 0; e < i.length && e < a.length; e++) n.has(a[e]) && !r.has(a[e]) && (i[e] = a[e], r.add(a[e]));
	let o = e.filter((e) => !r.has(e));
	return i.map((e) => e ?? o.shift() ?? "");
}
function kz(e, t, n) {
	for (let r of xz(e)) {
		if (r === t) continue;
		let e = r.getBoundingClientRect();
		if (n.x >= e.left && n.x <= e.right && n.y >= e.top && n.y <= e.bottom) return r;
	}
	return null;
}
function Az(e, t, n, r) {
	let i = xz(e).map((e) => ({
		place: e,
		box: e.getBoundingClientRect()
	})), a = i.find((e) => e.place === n)?.box;
	if (a === void 0) return null;
	let o = Mz(jz(a), i.map((e) => e.place === t || e.place === n ? null : jz(e.box)), r);
	return o === null ? null : i[o].place;
}
function jz(e) {
	return {
		x: e.left + e.width / 2,
		y: e.top + e.height / 2
	};
}
function Mz(e, t, n) {
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
var Nz = "ui-split-button", Pz = "ui-split-button__main", Fz = "ui-split-button__toggle", Iz = "ui-split-button__menu", Lz = "ui-split-button--open", Rz = class {
	root;
	menus = new gg({
		show: ({ owner: e }) => e.classList.add(Lz),
		hide: ({ owner: e }) => e.classList.remove(Lz),
		closesWhenReadOnly: !1,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), document.addEventListener("click", (e) => this.handleChoice(e), !1);
	}
	handleClick(e) {
		let t = zz(e.target);
		if (t !== null) {
			e.preventDefault(), this.menus.isOpen(t) ? this.menus.close(t) : this.openMenu(t);
			return;
		}
		let n = this.menus.current;
		n !== null && e.target instanceof Element && e.target.closest(`.${Pz}`)?.closest(`.${Nz}`) === n && this.menus.close(n);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "ArrowDown" && e.key !== "ArrowUp" || !N(e)) return;
		let t = zz(e.target);
		t === null || this.menus.isOpen(t) || (e.preventDefault(), this.openMenu(t, e.key === "ArrowUp"));
	}
	handleChoice(e) {
		let t = this.menus.current;
		if (t === null || !(e.target instanceof Element)) return;
		let n = Bz(t), r = e.target.closest(`.${S}`);
		n !== null && r !== null && n.contains(r) && KN(r) && this.menus.close(t);
	}
	openMenu(e, t = !1) {
		let n = Bz(e), r = n?.querySelector(".ui-menu") ?? null;
		if (n === null || r === null) return;
		let i = e.getAttribute("data-ui-split-placement") ?? "";
		this.menus.open({
			owner: e,
			popup: n,
			anchor: e,
			placement: { placement: Sp(i) ? i : "bottom-end" },
			openers: Vz(e)
		}) && af(r, qN(r), t);
	}
};
function zz(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${Fz}, .${Pz}`), n = t?.closest(`.${Nz}`) ?? null;
	return t === null || n === null || t.classList.contains(Pz) && n.getAttribute("data-ui-split-mode") !== "menu" ? null : n;
}
function Bz(e) {
	return e.querySelector(`:scope > .${Iz}`);
}
function Vz(e) {
	return [...e.querySelectorAll(":scope > [aria-haspopup]")];
}
//#endregion
//#region src/interactions/button-group-engine.ts
var Hz = "ui-button-group", Uz = "ui-button-group__item", Wz = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${Hz}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), V(this.root, `.${Hz}`, {
			childList: !0,
			attributeFilter: [ri]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-selected-key") ?? "", n = [], r = null;
		for (let i of this.ownItems(e)) {
			let e = t.length > 0 && i.getAttribute("data-ui-key") === t, a = Gz(i);
			i.toggleAttribute(ni, e), a !== null && (a.setAttribute("aria-pressed", e ? "true" : "false"), n.push(a), e && (r = a));
		}
		P(n, r ?? n.find(F) ?? null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Uz}`), n = t?.closest(`.${Hz}`) ?? null;
		if (t === null || n === null || t.closest(`.${Hz}`) !== n || k(n)) return;
		let r = Gz(t);
		r !== null && k(r) || this.choose(n, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Uz} > .${wi}`), n = t?.closest(`.${Hz}`) ?? null;
		if (t === null || n === null || !N(e)) return;
		let r = this.ownItems(n).map(Gz).filter((e) => e !== null), i = yl({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault(), i.focus({ preventScroll: !0 });
		let a = i.closest(`.${Uz}`);
		a !== null && this.choose(n, a);
	}
	choose(e, t) {
		Ul(e, t.getAttribute("data-ui-key") ?? "", {
			attribute: ri,
			bindingAttribute: ai,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return Vl(e, `.${Uz}`, `.${Hz}`);
	}
};
function Gz(e) {
	return e.querySelector(`:scope > .${wi}`);
}
//#endregion
//#region src/interactions/accordion-engine.ts
var Kz = "ui-accordion", qz = "details", Jz = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleSummaryClick(e), !0), this.root.addEventListener("toggle", (e) => this.handleToggle(e), !0), this.normalizeAll(this.root.querySelectorAll(`.${Kz}`)), V(this.root, `.${Kz}`, { childList: !0 }, (e) => this.normalizeAll(e));
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
		if (!(t === null || !t.classList.contains(Kz))) for (let n of this.sectionsOf(t)) n !== e && n.open && (n.open = !1);
	}
	sectionsOf(e) {
		return [...e.querySelectorAll(`:scope > ${qz}`)];
	}
}, Yz = "ui-tab-overflow", Xz = "ui-tab-overflow__menu", Zz = "ui-tab-overflow__menu--open", Qz = "ui-tab-overflow__entry", $z = "ui-tab-overflow__entry--current", eB = class {
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
		this.options = e, this.list = new rB(e.pick);
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
		let r = () => e.classList.add(this.options.overflowingClass), i = this.options.trailing === !0 ? this.fitTrailing(t, r) : tB({
			...t,
			hiddenClass: this.options.hiddenClass,
			showButton: r
		});
		e.classList.toggle(this.options.overflowingClass, i), i || this.closeListOf(e);
	}
	fitTrailing(e, t) {
		for (let t of e.captions) this.resizes?.observe(t);
		return nB(e, this.options.hiddenClass, t);
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
function tB(e) {
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
function nB(e, t, n) {
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
var rB = class {
	menu;
	button = null;
	list = new gg({
		show: ({ popup: e }) => e.classList.add(Zz),
		hide: ({ popup: e }) => {
			e.classList.remove(Zz), this.button = null;
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e) || this.button !== null && t.includes(this.button),
		onWindowBlur: !0,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	pick;
	constructor(e) {
		this.pick = e, this.menu = document.createElement("div"), this.menu.className = Xz, this.menu.setAttribute("role", "menu"), this.menu.addEventListener("click", (e) => this.handleClick(e)), this.menu.addEventListener("keydown", (e) => this.handleKeydown(e)), this.menu.addEventListener("pointermove", (e) => this.handlePointerMove(e));
	}
	isOpenFor(e) {
		return this.list.isOpen(e);
	}
	open(e, t, n) {
		this.close(), this.menu.replaceChildren(...n.map(iB)), this.menu.parentElement === null && document.body.appendChild(this.menu);
		let r = this.menu.querySelector(`.${$z}`);
		this.button = e, Mp(e, this.menu);
		let i = {
			owner: t,
			popup: this.menu,
			anchor: e,
			placement: { placement: "bottom-end" },
			openers: [e],
			returnFocus: () => e
		};
		_M(this.list, i, this.entries(), r) || (this.button = null);
	}
	close() {
		this.list.close();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Qz}`), n = t?.getAttribute("data-ui-key") ?? null, r = this.list.current;
		t === null || n === null || r === null || k(t) || (this.close(), this.pick(r, n));
	}
	handleKeydown(e) {
		e.defaultPrevented || vM(e, this.entries());
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${Qz}`) : null;
		t !== null && xM(t, this.entries());
	}
	entries() {
		return Array.from(this.menu.querySelectorAll(`.${Qz}`));
	}
};
function iB(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${Qz} ${Ti}`, t.classList.toggle($z, e.current), t.setAttribute("role", "menuitem"), t.setAttribute(y, e.key), t.textContent = e.title, e.current && t.setAttribute("aria-current", "true"), e.disabled && (t.classList.add(fi), t.setAttribute("aria-disabled", "true")), t;
}
//#endregion
//#region src/interactions/tab-switch.ts
var aB = "data-ui-caption-text", oB = ".ui-text__title";
function sB(e) {
	for (let t of e.querySelectorAll(oB)) {
		let e = t.textContent ?? "";
		t.getAttribute(aB) !== e && t.setAttribute(aB, e);
	}
}
function cB(e, t) {
	if (e === null || t === null || e === t || typeof t.animate != "function" || lp()) return;
	let n = e.getBoundingClientRect(), r = t.getBoundingClientRect();
	n.width !== 0 && r.width !== 0 && t.animate([{ transform: `translateX(${n.left - r.left}px) scaleX(${n.width / r.width})` }, { transform: "none" }], {
		duration: B.normal,
		easing: B.ease,
		pseudoElement: "::after"
	});
}
function lB(e) {
	if (!(e === null || lp())) for (let t of e.children) typeof t.animate == "function" && t.animate([{ opacity: 0 }, { opacity: 1 }], {
		duration: B.fast,
		easing: B.enter
	});
}
//#endregion
//#region src/interactions/tabs-engine.ts
var uB = "ui-tabs", dB = "ui-tab-header", fB = "ui-tab-header--selected", pB = "ui-tab-header--overflowed", mB = "ui-tabs--overflowing", hB = "ui-tabs--no-overflow", gB = "ui-tabs__strip", _B = "data-ui-tab-key", vB = "data-ui-tab-page", yB = class {
	root;
	fitter;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new eB({
			rootClass: uB,
			overflowingClass: mB,
			wraps: (e) => e.classList.contains(hB),
			hiddenClass: pB,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${uB}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), V(this.root, `.${uB}`, {
			childList: !0,
			attributeFilter: [oi, ...li],
			relevant: (e) => !km(e, `[${vB}]`, `.${uB}`)
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-tabs-selected") ?? "", n = this.ownHeaders(e), r = n.filter(bB), i = Wl(r, t, (e) => e.getAttribute(_B) ?? "");
		if (i !== null && i !== t) {
			this.select(e, i);
			return;
		}
		let a = n.find((e) => e.classList.contains(fB)) ?? null, o = null;
		for (let e of n) {
			let n = (e.getAttribute(_B) ?? "") === t;
			e.classList.toggle(fB, n), e.setAttribute("aria-selected", n ? "true" : "false"), sB(e), n && (o = e);
		}
		this.fitHeaders(e, r, o), cB(a, o), P(n.filter((e) => !e.classList.contains(pB)), o);
		for (let n of this.ownPages(e)) n.hidden = (n.getAttribute(vB) ?? "") !== t, !n.hidden && a !== null && a !== o && lB(n);
	}
	fitHeaders(e, t, n) {
		let r = e.querySelector(`:scope > .${gB}`), i = r?.querySelector(":scope > .ui-tab-overflow") ?? null;
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownHeaders(e).find((e) => (e.getAttribute(_B) ?? "") === t)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownHeaders(e).filter(bB).map((e) => {
				let n = e.getAttribute(_B) ?? "";
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
		let t = e.target.closest(`.${Yz}`), n = t?.closest(`.${uB}`) ?? null;
		if (t !== null && n !== null && t.closest(`.${uB}`) === n) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = e.target.closest(`.${dB}`);
		if (r === null || k(r)) return;
		let i = r.closest(`.${uB}`), a = r.getAttribute(_B);
		i !== null && a !== null && r.closest(`.${uB}`) === i && (e.preventDefault(), this.select(i, a));
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || ol(e) || !N(e)) return;
		let t = e.target.closest(`.${dB}`), n = t?.closest(`.${uB}`) ?? null;
		if (t === null || n === null) return;
		let r = yl({
			key: e.key,
			items: this.ownHeaders(n),
			current: t,
			axis: "horizontal"
		});
		r !== null && (e.preventDefault(), this.select(n, r.getAttribute(_B) ?? ""), r.focus());
	}
	select(e, t) {
		Ul(e, t, {
			attribute: oi,
			bindingAttribute: ai,
			apply: (e) => this.apply(e)
		});
	}
	ownHeaders(e) {
		return Vl(e, `.${dB}`, `.${uB}`);
	}
	ownPages(e) {
		return Vl(e, `[${vB}]`, `.${uB}`);
	}
};
function bB(e) {
	return e.classList.contains(pB) || LP(e);
}
//#endregion
//#region src/interactions/tab-out.ts
function xB(e) {
	e.hasAttribute("data-ui-tab-out") || (e.setAttribute(Ie, e.getAttribute("tabindex") ?? ""), e.setAttribute("tabindex", "-1"));
}
function SB(e) {
	let t = e.getAttribute(Ie);
	t !== null && (e.removeAttribute(Ie), t.length === 0 ? e.removeAttribute("tabindex") : e.setAttribute("tabindex", t));
}
function CB(e) {
	return e.tabIndex >= 0 || e.hasAttribute("data-ui-tab-out");
}
//#endregion
//#region src/interactions/command-bar-engine.ts
var wB = "ui-command-bar", TB = "ui-command-bar__host", EB = "ui-command-bar__item", DB = "ui-command-bar__overflow", OB = "ui-command-bar--overflowing", kB = "ui-command-bar__overflowed", AB = "ui-orientation--vertical", jB = "ui-text__title", MB = `${bd}, [${Ie}]`, NB = class {
	root;
	fitter;
	listed = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new eB({
			rootClass: wB,
			overflowingClass: OB,
			wraps: (e) => !RB(e),
			hiddenClass: kB,
			trailing: !0,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pick(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${wB}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), V(this.root, `.${wB}`, {
			childList: !0,
			relevant: PB
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = FB(e), n = e.querySelector(`:scope > .${DB}`);
		if (t === null || n === null) return;
		let r = zB(t);
		this.fitter.fit(e, {
			room: e,
			button: n,
			captions: r,
			selected: null
		}), e.classList.contains(OB) && BB(r);
		for (let e of r) Ap(e, e.classList.contains(kB) ? n : null);
		e.classList.contains(AB) ? e.setAttribute("aria-orientation", "vertical") : e.removeAttribute("aria-orientation"), IB(e, null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${DB}`), n = t?.parentElement ?? null;
		t === null || n === null || !n.classList.contains(wB) || (e.preventDefault(), this.fitter.toggleList(n, t, () => this.entriesOf(n)));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof HTMLElement) || !N(e) || ol(e)) return;
		let t = e.target.closest(`.${wB}`), n = t === null ? [] : LB(t);
		if (t === null || !n.includes(e.target)) return;
		let r = yl({
			key: e.key,
			items: n,
			current: e.target,
			axis: t.classList.contains(AB) ? "vertical" : "horizontal"
		});
		r !== null && (e.preventDefault(), IB(t, r), r.focus());
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement ? e.target : null, n = t?.closest(`.${wB}`) ?? null;
		t !== null && n !== null && LB(n).includes(t) && IB(n, t);
	}
	entriesOf(e) {
		let t = FB(e), n = t === null ? [] : zB(t).filter((e) => e.classList.contains(EB) && e.classList.contains(kB)).map((e) => e.querySelector(C) ?? e);
		return this.listed.set(e, n), n.map((e, t) => ({
			key: String(t),
			title: VB(e),
			current: !1,
			disabled: k(e)
		}));
	}
	pick(e, t) {
		let n = this.listed.get(e)?.[Number(t)];
		n?.isConnected === !0 && !k(n) && HB(n).click();
	}
};
function PB(e) {
	let t = e.target;
	if (t instanceof Element && (t.classList.contains(wB) || t.classList.contains(TB) || t.classList.contains(EB))) return !0;
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains(wB) || t.querySelector(`.${wB}`) !== null)) return !0;
	return !1;
}
function FB(e) {
	return e.querySelector(`:scope > .${TB}`);
}
function IB(e, t) {
	let n = LB(e), r = n.find((e) => e.tabIndex >= 0 && F(e)), i = t ?? n.find((e) => e === document.activeElement) ?? r ?? n.find(F) ?? null;
	for (let e of n) e === i ? SB(e) : xB(e);
}
function LB(e) {
	let t = FB(e), n = [];
	for (let e of t === null ? [] : zB(t)) if (!(!e.classList.contains(EB) || e.classList.contains(kB))) for (let t of e.querySelectorAll(MB)) CB(t) && _l(e, t) && n.push(t);
	let r = e.querySelector(`:scope > .${DB}`);
	return r !== null && e.classList.contains(OB) && n.push(r), n;
}
function RB(e) {
	let t = FB(e);
	if (t === null) return !1;
	let n = getComputedStyle(t);
	return n.flexDirection.startsWith("row") && n.flexWrap === "nowrap";
}
function zB(e) {
	let t = [];
	for (let n of Array.from(e.children)) {
		if (n.classList.contains("ui-hidden")) continue;
		if (n.hasAttribute("data-ui-group-header")) {
			t.push(n);
			continue;
		}
		let e = n.classList.contains(EB) ? n.querySelector(C) : null;
		e !== null && LP(e) && t.push(n);
	}
	return t;
}
function BB(e) {
	let t = !1;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.classList.contains(EB) ? t ||= !r.classList.contains(kB) : t || r.classList.add(kB);
	}
}
function VB(e) {
	let t = HB(e), n = t.querySelector(`.${jB}`)?.textContent?.trim() ?? "";
	return n.length > 0 ? n : e.getAttribute("aria-label")?.trim() || t.getAttribute("aria-label")?.trim() || t.textContent?.trim() || "";
}
function HB(e) {
	return e.matches(bd) ? e : e.querySelector(bd) ?? e;
}
//#endregion
//#region src/interactions/breadcrumbs-engine.ts
var UB = "ui-breadcrumbs", WB = "ui-breadcrumbs__item", GB = "ui-breadcrumb", KB = "ui-breadcrumb--current", qB = "ui-hidden", JB = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), V(this.root, `.${UB}`, {
			childList: !0,
			attributeFilter: ["class", ...li]
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${UB}`)) this.apply(e);
	}
	apply(e) {
		let t = Vl(e, `.${WB}`, `.${UB}`);
		YB(t);
		let n = t.filter((e) => !e.classList.contains(qB)).map((e) => e.querySelector(`.${GB}`)).filter((e) => e !== null && !e.classList.contains(qB)), r = n.length === 0 ? null : n[n.length - 1];
		for (let e of n) {
			let t = e === r;
			e.classList.toggle(KB, t), t ? (e.setAttribute("aria-current", "page"), e.setAttribute("tabindex", "-1")) : (e.removeAttribute("aria-current"), e.removeAttribute("tabindex"));
		}
	}
};
function YB(e) {
	let t = fp.map(() => !1);
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n], i = fp.map((e, t) => XB(r, t));
		if (ZB(r, kr, fp.filter((e, t) => i[t])), ZB(r, Ar, fp.filter((e, n) => !t[n])), !r.classList.contains(qB)) for (let e = 0; e < fp.length; e++) t[e] ||= !i[e];
	}
}
function XB(e, t) {
	for (let n of e.children) if (n.getAttribute(li[t]) === "collapsed") return !0;
	return !1;
}
function ZB(e, t, n) {
	let r = n.join(" ");
	r.length === 0 ? e.removeAttribute(t) : e.getAttribute(t) !== r && e.setAttribute(t, r);
}
//#endregion
//#region src/interactions/color-input-engine.ts
var QB = "ui-color-input", $B = "ui-color-input--open", eV = "ui-color-input__popup", tV = "ui-color-input__text", nV = "ui-color-input__row", rV = "ui-color-input__swatch--button", iV = "ui-color-input__value-input", aV = "ui-color-input__square-thumb", oV = "ui-color-input__hue-thumb", sV = "data-ui-color-toggle", cV = "data-ui-color-tab", lV = "data-ui-color-tab-selected", uV = "data-ui-color-pane", dV = "data-ui-color-pane-selected", fV = "data-ui-color-square", pV = "data-ui-color-hue", mV = "data-ui-color-hex", hV = "data-ui-color-channel", gV = "data-ui-color-factor", _V = "data-ui-color-opacity", vV = "data-ui-color-name", yV = "data-ui-color-name-selected", bV = "data-ui-color-format", xV = "data-ui-color-variant", SV = "data-ui-color-no-picker", CV = "data-ui-color-no-palette", wV = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	popups = new gg({
		show: ({ owner: e }) => e.classList.add($B),
		hide: ({ owner: e }) => e.classList.remove($B)
	});
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${QB}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(Ea(e.components, `.${QB}`));
		}), V(this.root, `.${QB}`, {
			childList: !0,
			attributeFilter: [
				bV,
				xV,
				SV,
				CV
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), new sh({
			root: this.root,
			resolveHandle: (e) => e.closest(`[${fV}], [${pV}]`),
			begin: (e, t) => {
				let n = e.closest(`.${QB}`);
				if (n === null) return null;
				let r = {
					input: n,
					element: e,
					surface: e.hasAttribute(fV) ? "square" : "hue",
					stateBefore: this.states.get(n),
					valueBefore: n.querySelector(`.${iV}`)?.value ?? null
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
		let t = kV(e), n = this.states.get(e), r = n?.paneChosen === !0 ? TV(e, n.pane) : EV(e);
		if (t.length === 0 || t.startsWith("@")) return {
			...n ?? DV(r),
			pane: r,
			held: !1
		};
		if (t.startsWith("#")) {
			let i = LV(t);
			if (i === null) return n ?? DV(r);
			let [a, o, s, c] = i;
			if (n !== void 0 && n.name === null && OV(this.resolveRgb(e, n), [
				a,
				o,
				s
			])) return {
				...n,
				pane: r,
				opacity: c,
				held: !0
			};
			let [l, u, d] = BV(a, o, s);
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
			...n ?? DV(r),
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
			let [e, a, o] = BV(n, r, i);
			t = {
				...t,
				hue: e,
				saturation: a,
				value: o
			};
		}
		let a = this.states.get(e);
		this.states.set(e, t), NV(e, "--ui-color-input-color", t.held ? zV(n, r, i, t.opacity) : "transparent"), NV(e, "--ui-color-input-solid", zV(n, r, i, 255)), NV(e, "--ui-color-input-on-color", t.held ? cx(n, r, i, t.opacity) : "inherit"), MV(e, t.held ? jV(e, n, r, i, t.opacity) : ""), this.applyPicker(e, t, n, r, i), (a === void 0 || a.name !== t.name || a.pane !== t.pane || a.held !== t.held) && (this.applyPalette(e, t), this.applyPanes(e, t));
	}
	applyPicker(e, t, n, r, i) {
		let a = e.querySelector(`[${fV}]`), o = e.querySelector(`[${pV}]`), [s, c, l] = VV(t.hue, 1, 1);
		if (NV(e, "--ui-color-input-hue", zV(s, c, l, 255)), a !== null) {
			let e = a.querySelector(`.${aV}`);
			e !== null && (NV(e, "left", `${t.saturation * 100}%`), NV(e, "top", `${(1 - t.value) * 100}%`));
		}
		if (o !== null) {
			let e = o.querySelector(`.${oV}`);
			e !== null && NV(e, "top", `${t.hue / 360 * 100}%`);
		}
		PV(e, `[${mV}]`, RV(n, r, i)), PV(e, `[${hV}="r"]`, String(n)), PV(e, `[${hV}="g"]`, String(r)), PV(e, `[${hV}="b"]`, String(i)), NV(e, "--ui-color-input-opacity-fill", `${t.opacity / 255 * 100}%`), FV(e, `[${_V}]`, t.opacity);
	}
	applyPalette(e, t) {
		for (let n of e.querySelectorAll(`[${vV}]`)) n.getAttribute(vV) === t.name ? n.setAttribute(yV, "") : n.removeAttribute(yV);
		let n = t.name === null ? null : e.querySelector(`[${vV}="${w(t.name)}"]`), r = n === null ? null : LV(n.style.getPropertyValue("--ui-color-input-chip").trim());
		NV(e, "--ui-color-input-base", r === null ? "transparent" : zV(r[0], r[1], r[2], 255)), FV(e, `[${gV}]`, t.factor);
	}
	applyPanes(e, t) {
		for (let n of e.querySelectorAll(`[${uV}]`)) n.getAttribute(uV) === t.pane ? n.setAttribute(dV, "") : n.removeAttribute(dV);
		for (let n of e.querySelectorAll(`[${cV}]`)) n.getAttribute(cV) === t.pane ? n.setAttribute(lV, "") : n.removeAttribute(lV);
	}
	resolveRgb(e, t) {
		if (t.name === null) return VV(t.hue, t.saturation, t.value);
		let n = e.querySelector(`[${vV}="${w(t.name)}"]`), r = n === null ? null : LV(n.style.getPropertyValue("--ui-color-input-chip").trim());
		return r === null ? VV(t.hue, t.saturation, t.value) : IV([
			r[0],
			r[1],
			r[2]
		], t.factor);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${sV}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${QB}`));
			return;
		}
		let n = e.target.closest(`[${cV}]`), r = e.target.closest(`.${QB}`);
		if (r === null) return;
		if (n !== null) {
			e.preventDefault();
			let t = n.getAttribute(cV), i = this.states.get(r);
			i !== void 0 && (t === "picker" || t === "palette") && this.applyState(r, {
				...i,
				pane: t,
				paneChosen: !0
			});
			return;
		}
		let i = e.target.closest(`[${vV}]`);
		if (i !== null) {
			e.preventDefault(), this.commit(r, (e) => ({
				...e,
				name: i.getAttribute(vV)
			}));
			return;
		}
		let a = r.querySelector(`.${eV}`);
		(a === null || !e.composedPath().includes(a)) && (e.preventDefault(), this.toggle(r));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target.closest(`.${QB}`);
		if (t !== null) {
			if (e.target.hasAttribute(gV)) {
				this.commit(t, (t) => ({
					...t,
					factor: Number(e.target instanceof HTMLInputElement ? e.target.value : 0)
				}), !1);
				return;
			}
			e.target.hasAttribute(_V) && this.commit(t, (t) => ({
				...t,
				opacity: ox(Number(e.target instanceof HTMLInputElement ? e.target.value : 255))
			}), !1);
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target, n = t.closest(`.${QB}`);
		if (n === null) return;
		if (t.hasAttribute(gV) || t.hasAttribute(_V)) {
			this.send(n);
			return;
		}
		if (t.hasAttribute(mV)) {
			let e = LV(t.value);
			if (e === null) {
				this.applyAll([n]);
				return;
			}
			let [r, i, a] = BV(e[0], e[1], e[2]);
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
		let r = t.getAttribute(hV);
		if (r === null) return;
		let i = this.states.get(n);
		if (i === void 0) return;
		let [a, o, s] = this.resolveRgb(n, i), c = {
			r: a,
			g: o,
			b: s
		};
		c[r] = ox(Number(t.value));
		let [l, u, d] = BV(c.r, c.g, c.b);
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
		let t = e.input.querySelector(`.${iV}`);
		t !== null && e.valueBefore !== null && (t.value = e.valueBefore);
	}
	applyPoint(e, t) {
		let { input: n, element: r, surface: i } = e, a = r.getBoundingClientRect();
		if (i === "hue") {
			let e = HV((t.y - a.top) / a.height);
			this.commit(n, (t) => ({
				...t,
				hue: e * 360,
				name: null
			}), !1);
			return;
		}
		let o = HV((t.x - a.left) / a.width), s = 1 - HV((t.y - a.top) / a.height);
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
		let a = e.querySelector(`.${iV}`);
		a !== null && (a.value = AV(i, this.resolveRgb(e, i)), n && this.send(e));
	}
	send(e) {
		j(e) || e.querySelector(`.${iV}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	toggle(e) {
		if (e === null || e.hasAttribute(SV) && e.hasAttribute(CV)) return;
		if (this.popups.isOpen(e)) {
			this.popups.close(e);
			return;
		}
		let t = e.querySelector(`.${eV}`);
		if (t === null) return;
		let n = e.getAttribute(xV) === "swatch", r = n ? e.querySelector(`.${rV}`) : e.querySelector(`.${nV}`), i = n ? r : r?.querySelector(`[${sV}]`) ?? null;
		this.popups.open({
			owner: e,
			popup: t,
			anchor: r ?? e,
			placement: { placement: "bottom-end" },
			openers: i === null ? [] : [i],
			focus: t.querySelector(`[${lV}]`) ?? !0
		});
	}
};
function TV(e, t) {
	return ((t) => !e.hasAttribute(t === "picker" ? SV : CV))(t) ? t : t === "picker" ? "palette" : "picker";
}
function EV(e) {
	return TV(e, "picker");
}
function DV(e) {
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
function OV(e, t) {
	return e[0] === t[0] && e[1] === t[1] && e[2] === t[2];
}
function kV(e) {
	return e.querySelector(`.${iV}`)?.value.trim() ?? "";
}
function AV(e, t) {
	if (e.name !== null) {
		let t = e.factor === 0 ? "None" : e.factor < 0 ? "Shade" : "Tint";
		return `${e.name}/${t}/${Math.abs(e.factor)}/${e.opacity}`;
	}
	let n = RV(t[0], t[1], t[2]);
	return e.opacity === 255 ? n : `${n}${sx(e.opacity)}`;
}
function jV(e, t, n, r, i) {
	if (e.getAttribute(bV) === "rgb") return i === 255 ? `rgb(${t}, ${n}, ${r})` : `rgba(${t}, ${n}, ${r}, ${(i / 255).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")})`;
	let a = RV(t, n, r);
	return i === 255 ? a : `${a}${sx(i)}`;
}
function MV(e, t) {
	for (let n of e.querySelectorAll(`.${tV}`)) n.textContent !== t && (n.textContent = t);
}
function NV(e, t, n) {
	e !== null && e.style.getPropertyValue(t) !== n && e.style.setProperty(t, n);
}
function PV(e, t, n) {
	let r = e.querySelector(t);
	r !== null && r !== document.activeElement && r.value !== n && (r.value = n);
}
function FV(e, t, n) {
	for (let r of e.querySelectorAll(t)) r !== document.activeElement && r.value !== String(n) && (r.value = String(n));
}
function IV(e, t) {
	if (t === 0) return e;
	let n = Math.abs(t) / 10;
	return t < 0 ? [
		ox(e[0] * (1 - n)),
		ox(e[1] * (1 - n)),
		ox(e[2] * (1 - n))
	] : [
		ox(e[0] + (255 - e[0]) * n),
		ox(e[1] + (255 - e[1]) * n),
		ox(e[2] + (255 - e[2]) * n)
	];
}
function LV(e) {
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
function RV(e, t, n) {
	return `#${sx(e)}${sx(t)}${sx(n)}`;
}
function zV(e, t, n, r) {
	return `rgba(${e}, ${t}, ${n}, ${(r / 255).toFixed(3)})`;
}
function BV(e, t, n) {
	let r = e / 255, i = t / 255, a = n / 255, o = Math.max(r, i, a), s = o - Math.min(r, i, a), c = 0;
	return s !== 0 && (c = o === r ? (i - a) / s % 6 : o === i ? (a - r) / s + 2 : (r - i) / s + 4, c *= 60, c < 0 && (c += 360)), [
		c,
		o === 0 ? 0 : s / o,
		o
	];
}
function VV(e, t, n) {
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
		ox((o + a) * 255),
		ox((s + a) * 255),
		ox((c + a) * 255)
	];
}
function HV(e) {
	return Math.min(1, Math.max(0, e));
}
//#endregion
//#region src/interactions/surface-press-engine.ts
var UV = `:is(.ui-surface, .ui-card, .${Tt})[${ie}]`, WV = "ui-surface--clickable", GV = class {
	pressable = /* @__PURE__ */ new WeakSet();
	space = new Fc();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("keydown", (e) => this.handleKeyDown(e)), t.addEventListener("keyup", (e) => this.space.release(e)), XV(t, ["hover", "press"], (e) => YV(e.closest(fl))), V(t, UV, {
			childList: !0,
			attributeFilter: ["class"]
		}, (e) => this.syncEach(e)), this.syncEach(t.querySelectorAll(UV));
	}
	syncEach(e) {
		for (let t of e) {
			this.sync(t);
			let e = t.parentElement?.closest(UV) ?? null;
			e !== null && this.sync(e);
		}
	}
	sync(e) {
		if (!e.classList.contains(WV)) {
			this.pressable.delete(e) && (e.removeAttribute("tabindex"), e.removeAttribute("role"));
			return;
		}
		this.pressable.add(e), QV(e, "role", JV(e) ? "group" : "button"), QV(e, "tabindex", e.matches(".ui-disabled, .ui-loading") ? null : qV(e) ? "-1" : "0");
	}
	handleKeyDown(e) {
		let t = KV(e);
		if (t === null) return;
		let n = e.key;
		n === "Enter" ? (e.preventDefault(), e.repeat || t.click()) : n === " " && (e.preventDefault(), this.space.hold(t));
	}
};
function KV(e) {
	if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !N(e, { shift: !0 })) return null;
	let t = e.target;
	return t instanceof HTMLElement && t.classList.contains(WV) && t.hasAttribute("tabindex") ? t : null;
}
function qV(e) {
	let t = e.closest(Kl);
	return t !== null && t.closest(I)?.matches(".ui-items-view, .ui-table") === !0 && ml(t) === e;
}
function JV(e) {
	for (let t of e.querySelectorAll(fl)) if (_l(e, t)) return !0;
	return !1;
}
function YV(e) {
	let t = [];
	for (let n = e?.parentElement?.closest(`.${WV}`) ?? null; n !== null; n = n.parentElement?.closest(`.${WV}`) ?? null) t.push(n);
	return t;
}
function XV(e, t, n) {
	let r = {
		hover: [],
		press: []
	}, i = !1, a = (e, t) => {
		let a = t instanceof Element ? n(t) : [];
		e === "press" && (i = !1);
		for (let t of r[e]) a.includes(t) || ZV(t, e, !1);
		for (let t of a) ZV(t, e, !0);
		r[e] = a;
	};
	t.includes("hover") && (e.addEventListener("pointerover", (e) => a("hover", e.target)), e.addEventListener("pointerout", (e) => a("hover", e.relatedTarget))), t.includes("press") && (e.addEventListener("pointerdown", (e) => a("press", e.button === 0 ? e.target : null), !0), e.addEventListener("pointerup", () => a("press", null), !0), e.addEventListener("dragend", () => a("press", null), !0), e.addEventListener("dragstart", () => {
		i = r.press.length > 0;
	}, !0), e.addEventListener("pointercancel", () => {
		i || a("press", null);
	}, !0));
}
function ZV(e, t, n) {
	let r = (e.getAttribute("data-ui-inner-pointer") ?? "").split(" ").filter((e) => e !== "" && e !== t);
	n && r.push(t), QV(e, ei, r.length === 0 ? null : r.sort().join(" "));
}
function QV(e, t, n) {
	n === null ? e.removeAttribute(t) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/interactions/table-columns-engine.ts
var $V = "ui-table", eH = "ui-table--reorderable", tH = "ui-scroll-x--auto", nH = "ui-scroll-x--always", rH = `:scope > .${nr}`, iH = `.${ir}`, aH = "ui-table__header-cell", oH = `${aH}--pinned`, sH = `${rH} > .${rr} > .${aH}`, cH = `${sH}--pinned`, lH = "ui-table__host", uH = `${rH} > .${lH}`, dH = `.${$V}, .${tr}, [${Zn}]`, fH = "--ui-table-columns", pH = "--ui-table-sticky-top", mH = "--ui-table-sticky-bottom", hH = "--ui-table-sized-columns", gH = "--ui-table-pin-", _H = 64, vH = "data-ui-table-cell-hidden", yH = "data-ui-table-cell-last", bH = "columns", xH = "hidden", SH = "order", CH = "layout", wH = 32, TH = 16, EH = class {
	root;
	store = new mN();
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
		if (this.root = e.root ?? document, this.drag = new sh({
			root: this.root,
			resolveHandle: (e) => e.closest(iH),
			begin: (e) => this.resolveContext(e),
			coordinate: () => "clientX",
			move: (e, t) => this.apply(e, t),
			end: (e, t) => this.remember(t.table),
			cancel: (e, t) => this.putBack(t)
		}), this.reorder = new sh({
			root: this.root,
			resolveHandle: (e) => this.resolveCaption(e),
			begin: (e, t) => this.beginReorder(e, t.x),
			coordinate: () => "clientX",
			move: (e, t) => this.aimDrop(e, t),
			end: (e, t) => this.endReorder(e, t)
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), XV(this.root, ["hover", "press"], (e) => {
			let t = e.closest(iH)?.parentElement ?? null;
			return t === null ? [] : [t];
		}), typeof matchMedia == "function") for (let e of fp) e !== "base" && matchMedia(mp(e)).addEventListener("change", () => this.layoutAll());
		this.restoreEach(this.root.querySelectorAll(`.${$V}`)), V(this.root, `.${$V}`, {
			childList: !0,
			relevant: jH
		}, (e) => {
			for (let t of e) this.restored.has(t) && (this.stampUnstyledColumns(t, !0), this.indexColumns(t, !0));
			this.restoreEach(e);
		}), V(this.root, `.${$V}`, {
			attributeFilter: ["class"],
			relevant: (e) => e.target instanceof Element && e.target.classList.contains($V)
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.layout(t);
		}), V(this.root, `.${$V}`, {
			childList: !0,
			attributeFilter: ["class", "hidden"],
			relevant: MH
		}, (e) => {
			for (let t of e) {
				let e = t.querySelector(uH);
				e !== null && t.hasAttribute("data-ui-table-scrollbar") && this.markScrollbar(t, e);
			}
		});
	}
	restoreEach(e) {
		for (let t of e) {
			if (this.restored.has(t)) continue;
			this.restored.add(t), this.restore(t), this.layout(t), AR(t, () => this.pin(t));
			let e = t.querySelector(rH);
			e !== null && AR(e, () => DH(t, e));
			let n = t.querySelector(uH);
			n !== null && (this.markScrollbar(t, n), AR(n, () => this.markScrollbar(t, n)));
		}
	}
	restore(e) {
		let t = this.columnsOf(e), n = this.store.read(e, bH), r = n === null ? null : Ps(n);
		r !== null && r.length !== t.length ? (this.store.write(e, bH, null), this.store.writeBoot(e, CH, null), this.widths.set(e, null)) : this.widths.set(e, r);
		let i = this.store.readJson(e, SH);
		if (i !== null && !PH(i, t)) {
			this.store.write(e, SH, null), this.orders.set(e, null);
			return;
		}
		this.orders.set(e, i);
	}
	markScrollbar(e, t) {
		let n = getComputedStyle(t).overflowY;
		e.toggleAttribute(hr, n === "scroll" || n === "auto" && t.scrollHeight > t.clientHeight);
	}
	layoutAll() {
		for (let e of this.root.querySelectorAll(`.${$V}`)) this.layout(e);
	}
	layout(e) {
		let t = this.columnsOf(e), n = this.hiddenOf(e, t), r = this.placesOf(e, t), i = NH(r), a = this.widths.get(e) ?? null, o = r.some((e, t) => e !== t), s = e.classList.contains(tH) || e.classList.contains(nH);
		if (a === null && n.size === 0 && !o && !s) e.style.removeProperty(hH);
		else {
			let t = a ?? this.authoredTracks(e);
			if (t !== null) {
				let r = lc(t, n);
				e.style.setProperty(hH, Rs(i.map((e) => r[e]), s ? "max-content" : "auto"));
			}
		}
		for (let t = 0; t < r.length; t++) o ? e.style.setProperty(`${_u}${t}`, String(r[t])) : e.style.removeProperty(`${_u}${t}`);
		let c = [...n].sort((e, t) => e - t).join(" ");
		c.length === 0 ? e.removeAttribute(er) : e.getAttribute("data-ui-table-hidden") !== c && e.setAttribute(er, c);
		let l = [...i].reverse().find((e) => !n.has(e));
		if (l === void 0 ? e.removeAttribute(ur) : e.getAttribute("data-ui-table-last") !== String(l) && e.setAttribute(ur, String(l)), this.columnStates.set(e, {
			places: r,
			hidden: n,
			last: l ?? -1
		}), this.stampUnstyledColumns(e, !1), this.indexColumns(e, !1), e.classList.contains(eH)) for (let e of t) !e.anchored && !e.cell.hasAttribute("tabindex") && e.cell.setAttribute("tabindex", "-1");
		this.pin(e);
	}
	stampUnstyledColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0 || n.places.length <= _H) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}|${n.last}`;
		if (!(!t && this.stampedStates.get(e) === r)) {
			this.stampedStates.set(e, r);
			for (let t of e.querySelectorAll(`[${Zn}]`)) {
				let r = Number(t.getAttribute(Zn));
				!(r >= _H) || t.closest(`.${$V}`) !== e || (t.style.order = String(n.places[r] ?? r), t.toggleAttribute(vH, n.hidden.has(r)), t.toggleAttribute(yH, r === n.last));
			}
		}
	}
	indexColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}`, i = this.indexedStates.get(e) === r;
		i && !t || (this.indexedStates.set(e, r), Su(e, NH(n.places), n.hidden, i));
	}
	columnsOf(e) {
		let t = [];
		for (let n of e.querySelectorAll(sH)) {
			let e = Number(n.getAttribute(Zn)), r = n.getAttribute(Qn), i = n.classList.contains(oH) || n.hasAttribute("data-ui-table-fixed");
			Number.isInteger(e) && t.push({
				index: e,
				key: n.getAttribute("data-ui-table-column-key") ?? String(e),
				hideBelow: RH(r) ? r : null,
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
		for (let e of t) (n[e.key] ?? LH(e)) && r.add(e.index);
		return r;
	}
	choicesOf(e) {
		let t = this.hiddenChoices.get(e);
		return t === void 0 && (t = this.store.readJson(e, xH) ?? {}, this.hiddenChoices.set(e, t)), t;
	}
	authoredTracks(e) {
		let t = e.style.getPropertyValue(fH).trim(), n = t.length === 0 ? null : Ps(t);
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
		n === null || i !== void 0 && n === LH(i) ? delete r[t] : r[t] = n, this.hiddenChoices.set(e, r), this.store.writeJson(e, xH, Object.keys(r).length === 0 ? null : r), this.layout(e), this.rememberBoot(e);
	}
	columnOrder(e) {
		if (!(e instanceof HTMLElement)) return [];
		let t = this.columnsOf(e), n = new Map(t.map((e) => [e.index, e]));
		return NH(this.placesOf(e, t)).map((e) => n.get(e)?.key ?? "").filter((e) => e.length > 0);
	}
	pin(e) {
		let t = e.querySelectorAll(cH).length;
		if (t < 2) return;
		let n = ac(this.trackSizes(e), t);
		for (let t = 1; t < n.length; t++) e.style.setProperty(`${gH}${t}`, `${n[t]}px`);
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof HTMLElement) || !t.classList.contains("ui-table__scroll") || t.closest(`.${$V}`)?.toggleAttribute(mr, t.scrollLeft > 0);
	}
	trackSizes(e) {
		let t = e.querySelector(rH), n = t === null ? [] : getComputedStyle(t).gridTemplateColumns.split(" ").map(parseFloat);
		return kH(e) ? n.slice(1) : n;
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
		let t = e.target.closest(iH), n = t ?? (e.shiftKey ? OH(e.target) : null);
		if (n === null || this.drag.active || !N(e, { shift: t === null })) return;
		if (t !== null && e.key === "Enter" || t === null && e.key === "Backspace") {
			e.preventDefault(), this.reset(n);
			return;
		}
		let r = e.key === "PageUp" || e.key === "PageDown";
		if (!r && e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
		let i = this.resolveContext(n);
		if (i === null) return;
		let a = r ? Ns(TH, i.sizes.reduce((e, t) => e + t, 0)) : TH;
		e.preventDefault(), this.apply(i, e.key === "ArrowRight" || e.key === "PageUp" ? a : -a) && this.remember(i.table);
	}
	stepColumn(e, t) {
		let n = e.target instanceof Element ? this.resolveCaption(e.target) : null, r = n?.closest(`.${$V}`) ?? null;
		if (n === null || r === null || this.reorder.active) return;
		let i = this.movableColumns(r), a = Number(n.getAttribute(Zn)), o = i.findIndex((e) => e.index === a), s = o + t;
		if (o < 0 || (e.preventDefault(), s < 0 || s >= i.length)) return;
		this.moveColumn(r, a, t < 0 ? i[s].index : i[s + 1]?.index ?? null), n.focus({ preventScroll: !0 });
		let c = this.columnStates.get(r);
		if (c !== void 0) {
			let e = NH(c.places).filter((e) => !c.hidden.has(e));
			DO(e.indexOf(a) + 1, e.length);
		}
	}
	handleDoubleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(iH) : null;
		t !== null && this.reset(t);
	}
	reset(e) {
		let t = e.closest(`.${$V}`);
		t !== null && (this.widths.set(t, null), this.layout(t), this.remember(t));
	}
	apply(e, t) {
		let n = Ks(e.tracks.map((t, n) => n === e.index || n === e.after ? {
			...t,
			min: Math.max(wH, e.floors.get(n) ?? 0)
		} : t), e.sizes, {
			before: [e.index],
			after: [e.after]
		}, t);
		return n !== null && (this.widths.set(e.table, AH(e.tracks, n, [e.index, e.after])), this.layout(e.table), !0);
	}
	putBack(e) {
		this.widths.set(e.table, e.before), this.layout(e.table);
	}
	remember(e) {
		let t = this.widths.get(e) ?? null;
		this.store.write(e, bH, t === null ? null : Rs(t), null), this.rememberBoot(e);
	}
	rememberBoot(e) {
		let t = e.style.getPropertyValue(hH).trim(), n = e.getAttribute(er), r = {};
		t.length > 0 && (r[hH] = t);
		for (let t of e.style) t.startsWith("--ui-table-order-") && (r[t] = e.style.getPropertyValue(t));
		if (Object.keys(r).length === 0 && n === null) {
			this.store.writeBoot(e, CH, null);
			return;
		}
		this.store.writeBoot(e, CH, {
			styles: r,
			attributes: {
				[er]: n,
				[ur]: e.getAttribute(ur)
			}
		});
	}
	resolveContext(e) {
		let t = e.closest(`.${$V}`);
		if (t === null) return null;
		let n = this.widths.get(t) ?? null, r = n ?? this.authoredTracks(t);
		if (r === null) return null;
		let i = Vs(t.getAttribute(Gn)), a = Hs(r, i), o = /* @__PURE__ */ new Map(), s = this.columnsOf(t), c = this.placesOf(t, s), l = this.columnSizes(t, c).filter((e) => Number.isFinite(e));
		for (let e of i) e.min !== void 0 && o.set(e.index, e.min);
		let u = Number(e.getAttribute(Zn)), d = this.hiddenOf(t, s), f = NH(c), p = (c[u] ?? -1) + 1;
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
		let t = e.closest(`.${aH}`), n = t?.closest(`.${$V}`) ?? null;
		return t === null || n === null || !n.classList.contains(eH) || e.closest(iH) !== null || t.classList.contains(oH) || t.hasAttribute("data-ui-table-fixed") ? null : t;
	}
	beginReorder(e, t) {
		let n = e.closest(`.${$V}`), r = Number(e.getAttribute(Zn));
		if (n === null || !Number.isInteger(r)) return null;
		let i = this.movableColumns(n), a = i.findIndex((e) => e.index === r);
		if (a < 0 || i.length < 2) return null;
		let o = i.map(FH), s = n.querySelector(rH), c = getComputedStyle(n).direction === "rtl";
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
		for (let a of NH(this.placesOf(e, t))) {
			let e = r.get(a);
			e !== void 0 && !e.anchored && !n.has(a) && i.push(e);
		}
		return i;
	}
	aimDrop(e, t) {
		let n = e.origin + t + ((e.scroll?.scrollLeft ?? 0) - e.scrolledAt), r = 0;
		for (; r < e.middles.length && (e.rightToLeft ? n < e.middles[r] : n > e.middles[r]);) r++;
		let i = Math.min(Math.max(r > e.from ? r - 1 : r, 0), e.places.length - 1);
		if (i === e.target || (e.target = i, IH(e.table), i === e.from)) return;
		let a = e.places.filter((t, n) => n !== e.from), o = a[e.target];
		o === void 0 ? a[a.length - 1].cell.setAttribute(pr, "after") : o.cell.setAttribute(pr, "before");
	}
	endReorder(e, t) {
		if (e.removeAttribute(fr), t.table.removeAttribute(dr), IH(t.table), t.target === t.from) return;
		let n = t.places.filter((e, n) => n !== t.from);
		lh(), this.moveColumn(t.table, t.index, n[t.target]?.index ?? null);
	}
	moveColumn(e, t, n) {
		let r = this.columnsOf(e), i = new Map(r.map((e) => [e.index, e])), a = NH(this.placesOf(e, r)).filter((e) => i.get(e)?.anchored === !1), o = a.indexOf(t);
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
		this.orders.set(e, u ? null : c), this.store.write(e, SH, u ? null : JSON.stringify(c)), this.layout(e), this.rememberBoot(e);
	}
};
function DH(e, t) {
	let n = 0, r = 0, i = !1;
	for (let e of t.children) if (e.matches(`.${lH}`)) i = !0;
	else if (!(e instanceof HTMLElement) || e.getAttribute("role") !== "row") continue;
	else i ? r += e.offsetHeight : n += e.offsetHeight;
	e.style.setProperty(pH, `${n}px`), e.style.setProperty(mH, `${r}px`);
}
function OH(e) {
	let t = e.matches(`.${aH}`) ? e.querySelector(`:scope > ${iH}`) : null;
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function kH(e) {
	return e.hasAttribute("data-ui-rows-draggable") && e.hasAttribute("data-ui-rows-drag-handle") && e.classList.contains("ui-drag-handle--start");
}
function AH(e, t, n) {
	for (let r of n) e[r].kind === "star" && e[r].min === e[r].value && t[r].kind === "star" && (t[r] = {
		...t[r],
		min: t[r].value
	});
	return t;
}
function jH(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(dH) || t.querySelector(dH) !== null)) return !0;
	return !1;
}
function MH(e) {
	let t = e.type === "childList" ? e.target : e.target.parentElement;
	return t instanceof Element && t.classList.contains(lH);
}
function NH(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) t[e[n]] = n;
	return t;
}
function PH(e, t) {
	if (e.length !== t.length) return !1;
	let n = new Set(t.map((e) => e.key));
	return e.every((e) => n.delete(e)) && n.size === 0;
}
function FH(e) {
	let t = e.cell.getBoundingClientRect();
	return t.left + t.width / 2;
}
function IH(e) {
	for (let t of e.querySelectorAll(`[${pr}]`)) t.removeAttribute(pr);
}
function LH(e) {
	return e.startsHidden || e.hideBelow !== null && fp.indexOf(gp()) < fp.indexOf(e.hideBelow);
}
function RH(e) {
	return e !== null && fp.includes(e);
}
//#endregion
//#region src/items/items-group-runs.ts
var zH = /* @__PURE__ */ new WeakMap();
function BH(e, t) {
	let n = /* @__PURE__ */ new Set(), r = e.getAttribute(an);
	for (let i of G(e)) {
		let a = i.getAttribute("data-ui-group") ?? "";
		if (a !== "" && a !== r) {
			let r = VH(i, a) ?? HH(e, i, a, t);
			r !== null && n.add(r);
		}
		r = a;
	}
	for (let t of e.querySelectorAll(`:scope > [${It}]`)) n.has(t) || t.remove();
}
function VH(e, t) {
	let n = e.previousElementSibling, r = n === null ? void 0 : zH.get(n);
	return r !== void 0 && r.row === e && r.group === t ? n : null;
}
function HH(e, t, n, r) {
	let i = r(t);
	return i === null ? null : (KH(i, t.getAttribute(y)), zH.set(i, {
		row: t,
		group: n
	}), e.insertBefore(i, t), i);
}
function UH(e, t, n) {
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
function WH(e) {
	return e.find((e) => !e.classList.contains(hi));
}
function GH(e, t, n, r, i) {
	let a = t.renderFromTemplate(e, n, i);
	if (a === null) return null;
	let o = document.createElement("div");
	return KH(o, r), o.appendChild(a), o;
}
function KH(e, t) {
	e.setAttribute(It, ""), t === null ? e.removeAttribute(Lt) : e.setAttribute(Lt, t);
}
var qH = "bottom", JH = "pending";
function YH(e, t, n) {
	let r = e.querySelector(`:scope > [${Xt}="${t}"]`);
	if (n <= 0) {
		r?.remove();
		return;
	}
	r === null && (r = document.createElement("div"), r.setAttribute(Xt, t), r.style.flexShrink = "0"), t === "top" ? e.firstElementChild !== r && e.insertBefore(r, e.firstElementChild) : e.lastElementChild !== r && e.appendChild(r), r.style.height = `${n}px`;
}
//#endregion
//#region src/items/items-dom-order.ts
function XH(e, t) {
	let n = e.firstElementChild;
	n !== null && n.getAttribute("data-ui-window-spacer") === "top" && (n = n.nextElementSibling);
	for (let r of t) r !== n && e.insertBefore(r, n), n = r.nextElementSibling;
}
//#endregion
//#region src/items/items-group-renderer.ts
var ZH = /* @__PURE__ */ new WeakMap(), QH = /* @__PURE__ */ new WeakMap();
function $H(e) {
	for (let t of e.querySelectorAll(`:scope > [${It}]`)) t.remove();
}
function eU(e, t, n, r, i, a) {
	let o = mO(e, G(e)), s = n.getGroupTemplate(t), c = s !== void 0, l = c && o.some((e) => e.hasAttribute("data-ui-group")), u = aO(i.getItemsFilterSortMetadata(t), a, tO(e));
	if (c && !l && ($H(e), QH.delete(e)), o.length === 0) {
		ZH.set(e, []);
		return;
	}
	let d = FD(e);
	if (!l) {
		XH(e, [...oO(o, u, r), ...PD(d)]);
		return;
	}
	let { buckets: f, order: p } = UH(o, (e) => e.getAttribute("data-ui-group") ?? "", ZH.get(e) ?? []), m = r.getAncestorStack(e), h = QH.get(e), g = /* @__PURE__ */ new Map();
	ZH.set(e, p);
	let _ = [];
	for (let t of p) {
		let n = f.get(t);
		u.length > 0 && (n = oO(n, u, r));
		let i = t === "" ? void 0 : WH(n);
		if (i !== void 0) {
			let n = tU(e, h?.get(t), i) ?? GH(s, r, r.getItemValue(i), i.getAttribute("data-ui-key"), m);
			n !== null && (g.set(t, n), _.push(n));
		}
		_.push(...n);
	}
	let v = new Set(g.values());
	for (let t of e.querySelectorAll(`:scope > [${It}]`)) v.has(t) || t.remove();
	QH.set(e, g), XH(e, [..._, ...PD(d)]);
}
function tU(e, t, n) {
	if (t !== void 0 && t.parentElement === e) return KH(t, n.getAttribute(y)), t;
}
//#endregion
//#region src/items/items-host-sync.ts
var nU = "ui-tree-rules", rU = `:scope > .${or}:not(.${lr})`;
function iU(e, t, n) {
	if (e.parentElement?.classList.contains("ui-tree") === !0) {
		e.dispatchEvent(new Event(nU, { bubbles: !0 })), ID(e, t, n.templates, n.renderer, e.querySelector(rU) !== null);
		return;
	}
	switch (vD(e)) {
		case "windowed":
			ID(e, t, n.templates, n.renderer), oU(e, t, n);
			return;
		case "virtualized":
			n.virtualization.sync(e);
			return;
		default:
			nO(e, t, n.metadata, n.renderer, n.state), aU(e), ID(e, t, n.templates, n.renderer), eU(e, t, n.templates, n.renderer, n.metadata, n.state);
			return;
	}
}
function aU(e) {
	let t = pd(e);
	t !== null && fd(t, G(e).filter((e) => e instanceof HTMLElement));
}
function oU(e, t, n) {
	let r = n.templates.getGroupTemplate(t);
	if (r === void 0) return;
	let i = n.renderer.getAncestorStack(e);
	BH(e, (e) => GH(r, n.renderer, n.renderer.getItemValue(e), e.getAttribute(y), i));
}
//#endregion
//#region src/interactions/table-header-group.ts
var sU = ".ui-table", cU = `:scope > .${nr} > .${rr} > [role='columnheader']`, lU = `:scope > .${ir}`, uU = "input:not([type='hidden']), button, select, textarea, a[href]", dU = /* @__PURE__ */ new WeakMap();
function fU(e) {
	for (let t of e.querySelectorAll(cU)) {
		let e = pU(t);
		e !== null && e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
	}
}
function pU(e) {
	let t = e.querySelector(uU);
	if (t !== null) return t;
	if (e.hasAttribute("tabindex")) return e;
	let n = e.querySelector(lU);
	return n !== null && n.getClientRects().length > 0 ? e : null;
}
function mU(e, t = null) {
	let n = hU(e), r = dU.get(e), i = n.find((e) => t !== null && _U(e) === t) ?? (r !== void 0 && n.includes(r) ? r : n[0]);
	return i !== void 0 && (gU(e, i), !0);
}
function hU(e) {
	let t = vu(e), n = [];
	for (let r of e.querySelectorAll(cU)) {
		let e = pU(r), i = Number(r.getAttribute("data-ui-table-column") ?? NaN);
		e !== null && Number.isInteger(i) && F(e) && n.push({
			stop: e,
			place: t.place(i)
		});
	}
	return n.sort((e, t) => e.place - t.place).map((e) => e.stop);
}
function gU(e, t) {
	t.hasAttribute("tabindex") || t.setAttribute("tabindex", "-1"), dU.set(e, t), t.focus();
}
function _U(e) {
	return e.closest("[role='columnheader']")?.getAttribute("data-ui-table-column") ?? null;
}
function vU(e) {
	let t = e.closest("[role='columnheader']"), n = t?.parentElement?.parentElement?.parentElement ?? null;
	return t !== null && n instanceof HTMLElement && n.matches(sU) && pU(t) === e ? n : null;
}
function yU(e, t, n) {
	if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || !(e.target instanceof HTMLElement)) return !1;
	switch (e.key) {
		case "ArrowDown": return n(_U(e.target)), !0;
		case "ArrowUp": return !0;
	}
	if (!bl(e.key, "horizontal")) return !1;
	let r = yl({
		key: e.key,
		items: hU(t),
		current: e.target,
		axis: "horizontal",
		loop: !1
	});
	return r !== null && r !== e.target && gU(t, r), !0;
}
//#endregion
//#region src/interactions/items-selection-engine.ts
var bU = /* @__PURE__ */ new Set([
	" ",
	"Enter",
	"Delete"
]), xU = ".ui-table", SU = /* @__PURE__ */ new Set([
	"ArrowLeft",
	"ArrowRight",
	"ArrowUp",
	"ArrowDown",
	"Home",
	"End",
	"Enter",
	"F2",
	" "
]), CU = `:scope > [${b}], :scope > .${nr}, :scope > .${nr} > [${b}]`, wU = class {
	root;
	rows;
	pressedBoxes = [];
	windowEnds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.rows = e.rows, this.applyAll(this.root.querySelectorAll(I)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("mouseup", () => this.restoreBoxes(), !0), this.root.addEventListener("pointercancel", () => this.restoreBoxes(), !0), this.root.addEventListener("contextmenu", () => this.restoreBoxes(), !0), V(this.root, I, {
			childList: !0,
			attributeFilter: [
				ti,
				ri,
				ii,
				Zt
			]
		}, (e) => this.applyAll(e)), this.root instanceof Node && new MutationObserver((e) => this.followCursor(e)).observe(this.root, {
			subtree: !0,
			attributes: !0,
			attributeFilter: [Pe]
		});
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = gu(e);
		nu(e, t);
		for (let t of e.querySelectorAll(CU)) EU(t);
		if (!e.matches(".ui-items-view, .ui-table")) return;
		e.matches(xU) && fU(e);
		for (let n of t) {
			let t = ml(n);
			t !== null && EU(t);
			for (let e of hl(n)) EU(e);
			TU(e, n, n.hasAttribute(Pe));
		}
		let n = this.windowEnds.get(e);
		n !== void 0 && this.settleWindowEnd(e, t, n);
	}
	settleWindowEnd(e, t, n) {
		let r = du(e);
		if (r === null || r.hasAttribute("data-ui-window-pending")) return;
		let i = bD(r, tn) !== null, a = n === "first" ? yD(r) === 0 && !xD(r, "data-ui-window-more-before") : !xD(r, rn);
		if (i && !a) return;
		this.windowEnds.delete(e);
		let o = id(n === "first" ? "Home" : "End", t, null, PU(e));
		o !== null && (Lu(e, t, o), e.getAttribute("data-ui-selection") === "one" && iu(e, t, o, Jl));
	}
	handleClick(e) {
		let t = this.resolveRow(e, I);
		if (t === null || !(e instanceof MouseEvent)) return;
		let { root: n, item: r } = t, i = gu(n);
		if (Lu(n, i, r, e.target instanceof Element ? $u(r, e.target) : null), z(n), n.hasAttribute("data-ui-no-row-select")) {
			Zl(n, r);
			return;
		}
		iu(n, i, r, Ql(e), this.heldRange(n)) && e.preventDefault();
	}
	resolveRow(e, t) {
		if (!(e.target instanceof Element)) return null;
		let n = e.target.closest(Kl), r = n?.closest(I) ?? null;
		return n === null || r === null || n.closest(I) !== r || !r.matches(t) || k(r) ? null : vl(e.target, n) === null && !A(n) ? {
			root: r,
			item: n
		} : null;
	}
	heldRange(e) {
		let t = this.rows, n = du(e);
		return t === void 0 || n === null ? void 0 : (e, r) => t.rangeKeysOf(n, e, r);
	}
	handleDoubleClick(e) {
		let t = this.resolveRow(e, ql);
		t === null || e.target instanceof Element && t.item.contains(e.target.closest("[data-ui-no-row-open]")) || (e.preventDefault(), ld(t.item, "open"));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.altKey || !(e.target instanceof Element) || ol(e)) return;
		let t = vU(e.target);
		if (t !== null && !k(t)) {
			yU(e, t, (e) => this.enterRows(t, e)) && e.preventDefault();
			return;
		}
		let n = ku(e);
		if (n === null) return;
		let { root: r } = n;
		if (!r.matches(".ui-items-view, .ui-table") || k(r) || zu(r) && DU(e) && this.handleCellKey(r, e)) return;
		let i = PU(r);
		if (!bU.has(e.key) && !nd(e.key, i)) return;
		if (this.windowEnds.delete(r), this.reachWindowEnd(r, e)) {
			e.preventDefault();
			return;
		}
		this.bringRowsIn(r, e.key);
		let a = gu(r), o = Mu(a), s = id(e.key, a, Nu(a), i);
		if (s !== null) {
			e.preventDefault(), Lu(r, a, s, e.key === "ArrowUp" && !e.shiftKey && zu(r) ? Qu(s) : null), kU(r, a, o, s, $l(r, e), this.heldRange(r));
			return;
		}
		if (e.key === "ArrowUp" && !e.shiftKey && !e.ctrlKey && !e.metaKey && r.matches(xU) && mU(r, qu(r))) {
			e.preventDefault();
			return;
		}
		if (o === null || A(o)) return;
		let c = ml(o);
		switch (e.key) {
			case " ":
				AU(r, a, o, c);
				break;
			case "Enter":
				MU(r, a, o, c);
				break;
			case "Delete":
				if (!jU(r, a, o)) return;
				break;
			default: return;
		}
		e.preventDefault();
	}
	handleCellKey(e, t) {
		this.bringCursorRowIn(e);
		let n = gu(e), r = Nu(n);
		if (r === null || A(r)) return !1;
		let i = Ku(r), a = !t.ctrlKey && !t.metaKey && !t.shiftKey;
		switch (t.key) {
			case "ArrowLeft":
			case "ArrowRight":
			case "Home":
			case "End": {
				if (!a) return !1;
				let o = Ju(e, r, i, t.key);
				return o !== null && Lu(e, n, r, o), t.preventDefault(), !0;
			}
			case "ArrowDown":
			case "ArrowUp": {
				let o = a ? Yu(e, r, i, t.key === "ArrowDown") : null;
				return o !== null && (t.preventDefault(), Lu(e, n, r, o), !0);
			}
			default: return i !== null && OU(i, t);
		}
	}
	reachWindowEnd(e, t) {
		let n = t.key === "Home" || t.key === "End" ? du(e) : null;
		if (n === null || vD(n) !== "windowed" || n.hasAttribute("data-ui-window-paged")) return !1;
		let r = t.key === "Home";
		return !(r ? yD(n) === 0 && !xD(n, "data-ui-window-more-before") : !xD(n, "data-ui-window-more-after")) && (this.windowEnds.set(e, r ? "first" : "last"), Ol(n, r ? 0 : Dl(n).contentHeight), !0);
	}
	bringRowsIn(e, t) {
		let n = this.rows, r = n === void 0 ? null : du(e);
		if (n === void 0 || r === null) return;
		let i = _d(e);
		switch (t) {
			case "Home":
			case "End": {
				let e = n.shownKeysOf(r);
				e !== null && e.length > 0 && n.reveal(r, t === "Home" ? e[0] : e[e.length - 1], "nearest");
				return;
			}
			case "PageDown":
			case "PageUp": {
				let a = i === null ? Nu(gu(e)) : null, o = i ?? (a === null ? null : R(a));
				o !== null && n.reveal(r, o, t === "PageDown" ? "start" : "end");
				return;
			}
			default: this.bringCursorRowIn(e);
		}
	}
	bringCursorRowIn(e) {
		let t = this.rows === void 0 ? null : du(e), n = _d(e);
		t !== null && n !== null && this.rows?.reveal(t, n, "nearest");
	}
	enterRows(e, t) {
		let n = gu(e), r = Nu(n) ?? id("ArrowDown", n, null, "vertical");
		e.focus({ preventScroll: !0 }), r !== null && (Lu(e, n, r, Vu(r, t)), e.getAttribute("data-ui-selection") === "one" && iu(e, n, r, Jl));
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement && e.target.matches("[data-ui-items-host], .ui-table__scroll") ? e.target : null, n = t?.closest(I) ?? null;
		if (t !== null && n !== null && [...n.querySelectorAll(CU)].includes(t)) {
			z(n);
			return;
		}
		if (e.target instanceof HTMLElement && e.target.matches(I) && e.target.matches(".ui-items-view, .ui-table") && !k(e.target) && !Fd()) {
			Fu(e.target, gu(e.target));
			return;
		}
		let r = e.target instanceof Element ? e.target.closest(Kl) : null, i = r?.closest(I) ?? null;
		r === null || i === null || r.hasAttribute("data-ui-row-focus") || !i.matches(".ui-items-view, .ui-table") || vl(e.target, r) === null || Lu(i, gu(i), r, e.target instanceof Element ? $u(r, e.target) : null, !1);
	}
	handlePointerDown(e) {
		this.restoreBoxes();
		let t = e.target instanceof Element ? e.target : null, n = t?.closest(I) ?? null;
		if (t !== null && n !== null) {
			document.activeElement !== n && Ld(n, !0);
			for (let e of n.querySelectorAll(CU)) e.contains(t) && e.getAttribute("tabindex") === "-1" && (e.removeAttribute("tabindex"), this.pressedBoxes.push(e));
		}
	}
	restoreBoxes() {
		for (let e of this.pressedBoxes) EU(e);
		this.pressedBoxes = [];
	}
	followCursor(e) {
		for (let t of e) {
			let e = t.target;
			if (!(e instanceof HTMLElement) || !e.matches(Kl)) continue;
			let n = e.closest(I);
			n !== null && n.matches(".ui-items-view, .ui-table") && TU(n, e, e.hasAttribute(Pe));
		}
	}
};
function TU(e, t, n) {
	if (n) {
		for (let n of t.querySelectorAll(`[${Ie}]`)) n.parentElement?.closest(I) === e && SB(n);
		return;
	}
	for (let n of t.querySelectorAll(bd)) n.tabIndex >= 0 && n.parentElement?.closest(I) === e && _l(t, n) && xB(n);
}
function EU(e) {
	e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
}
function DU(e) {
	return SU.has(e.key) || mw(e) !== null;
}
function OU(e, t) {
	let n = t.key, r = mw(t) !== null, i = !t.ctrlKey && !t.metaKey && !t.altKey;
	if (!r && (!i || n !== "Enter" && n !== "F2" && n !== " ")) return !1;
	if (n !== " " && td(e, t)) return !0;
	let a = ml(e);
	if (a !== null && (n === "Enter" || n === " ")) return t.preventDefault(), a.click(), !0;
	if (n !== "F2" && (n !== "Enter" || !Zu(e))) return !1;
	let o = Ud(e);
	return o !== null && (t.preventDefault(), o.focus(), !0);
}
function kU(e, t, n, r, i, a) {
	e.getAttribute("data-ui-selection") !== "one" && !i.shift || (i.shift && Xl(e, n), iu(e, t, r, i, a));
}
function AU(e, t, n, r) {
	iu(e, t, n, {
		shift: !1,
		ctrl: !0
	}) || NU(n, r);
}
function jU(e, t, n) {
	if (!e.hasAttribute("data-ui-rows-remove")) return !1;
	let r = FU(t, n);
	for (let e of r) ld(e, "remove");
	return r.length > 0;
}
function MU(e, t, n, r) {
	eu(e) && !ru(t).includes(n) && iu(e, t, n, Jl), NU(n, r), r === null && ld(n, "open");
}
function NU(e, t) {
	t === null ? ld(e, cd) : t.click();
}
function PU(e) {
	return e.matches(".ui-items-view--wrap") ? "grid" : e.matches(".ui-orientation--horizontal") ? "both" : "vertical";
}
function FU(e, t) {
	let n = ru(e);
	return (n.includes(t) ? n : [t]).filter((e) => !Os(e, "data-ui-unremovable") && !A(e));
}
//#endregion
//#region src/interactions/tree-engine.ts
var IU = "ui-tree__row--folded", LU = "fold-hidden", RU = "fold-shown", zU = "ui-tree__row--dragging", BU = "ui-tree__loading", VU = "ui-tree__loading-ring", HU = "ui-tree-node__text", UU = "ui-tree-node__toggle", WU = "ui-tree-node__rename", GU = ".ui-text__title", KU = cr, qU = "--ui-tree-depth", JU = "expanded", YU = 600, XU = .25, ZU = {
	ArrowUp: "up",
	ArrowDown: "down",
	ArrowLeft: "out",
	ArrowRight: "in"
}, QU = /* @__PURE__ */ new Set([
	" ",
	"ArrowRight",
	"ArrowLeft",
	"Enter",
	"F2",
	"Delete"
]), $U = class {
	root;
	store = new mN();
	rules;
	folds = /* @__PURE__ */ new WeakMap();
	requested = /* @__PURE__ */ new WeakSet();
	writtenBoot = /* @__PURE__ */ new WeakMap();
	springTarget = null;
	springTimer = 0;
	dropPlace = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.rules = e.rules, this.root.addEventListener(nU, (e) => {
			let t = e.target instanceof Element ? e.target.closest(`.${ar}`) : null;
			t !== null && (this.layout(t), fd(t, this.rowsOf(t)));
		}, !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), e.effects?.register("RenameNode", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename node effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(E(n.id), n.dynamicParameters ?? []), i = r === null ? null : this.rowsOf(r).find((e) => R(e) === t.key) ?? null;
			if (i === null) {
				s("rename node effect names no node on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.layoutAll(this.root.querySelectorAll(`.${ar}`)), V(this.root, `.${ar}`, {
			childList: !0,
			attributeFilter: [
				_r,
				vr,
				br,
				Tr
			],
			relevant: nW
		}, (e) => this.layoutAll(e));
	}
	layoutAll(e) {
		for (let t of e) this.layout(t);
	}
	layout(e) {
		let t = this.foldOf(e), n = this.resolveRules(e), r = n === null ? this.rowsOf(e) : this.orderRows(e, n), i = e.hasAttribute("data-ui-tree-draggable") || e.hasAttribute("data-ui-drag-kind"), a = /* @__PURE__ */ new Set();
		for (let e of r) {
			let t = ak(e)?.getAttribute(_r);
			t != null && t.length > 0 && a.add(t);
		}
		let o = n?.filtering === !0 ? this.matchingRows(r, n) : null, s = /* @__PURE__ */ new Map();
		for (let e of r) {
			let n = R(e), r = ak(e), c = r?.getAttribute("data-ui-tree-parent") ?? "", l = c.length > 0 ? s.get(c) : void 0, u = l === void 0 ? 0 : l.depth + 1, d = l === void 0 || l.shown && l.expanded, f = r?.hasAttribute(vr) === !0, p = f || a.has(n), m = p && r?.hasAttribute("data-ui-tree-expanded") === !0, h = l === void 0 || l.authoredShown && this.authoredExpandedOf(l), g = p && (o === null ? t[n] ?? m : o.has(n)), _ = o !== null && !o.has(n);
			e.style.setProperty(qU, String(u)), e.setAttribute("aria-level", String(u + 1)), Iu(e, r?.querySelector(`:scope > .${HU}`) ?? null), e.classList.toggle(IU, !d), e.classList.toggle(lr, _), e.removeAttribute(wr), e.draggable = i && DD(e), p ? e.setAttribute("aria-expanded", g ? "true" : "false") : e.removeAttribute("aria-expanded"), (a.has(n) || !f) && e.removeAttribute(Sr), g && d && f && !a.has(n) && !this.requested.has(e) && (this.requested.add(e), e.setAttribute(Sr, ""), e.dispatchEvent(new Event("unfold", { bubbles: !0 }))), g || this.requested.delete(e), this.placeLoadingRow(e, u + 1, e.hasAttribute(Sr), d && g && !_), s.set(n, {
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
		return ak(e.row)?.hasAttribute(br) === !0;
	}
	writeBootFold(e, t, n) {
		if (Object.keys(t).length === 0) return;
		let r = [], i = [];
		for (let [e, t] of n) t.shown !== t.authoredShown && (t.shown ? i : r).push(`.${or}[${y}="${w(e)}"]`);
		let a = `${r.join(",")}|${i.join(",")}`;
		this.writtenBoot.get(e) !== a && (this.writtenBoot.set(e, a), this.store.writeBoot(e, LU, r.length === 0 ? null : this.bootPatch(r, "hidden")), this.store.writeBoot(e, RU, i.length === 0 ? null : this.bootPatch(i, "shown")));
	}
	bootPatch(e, t) {
		return {
			selector: e.join(","),
			attributes: { [wr]: t }
		};
	}
	resolveRules(e) {
		let t = this.hostOf(e), n = Oa(e);
		if (this.rules === void 0 || t === null || n === null) return null;
		let r = this.rules.metadata.getItemsFilterSortMetadata(n), i = tO(t);
		if (r === void 0 && i === null) return null;
		let a = aO(r, this.rules.state, i), o = iO(r, this.rules.state, i);
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
			let t = ak(e)?.getAttribute("data-ui-tree-parent") ?? "", n = i.has(t) ? t : "", r = a.get(n);
			r === void 0 ? a.set(n, [e]) : r.push(e);
		}
		let o = [], s = (e) => {
			let n = a.get(e);
			if (n !== void 0) {
				n.sort((e, n) => sO(r.getItemValue(e), r.getItemValue(n), t.sorts));
				for (let e of n) o.push(e), s(R(e));
			}
		};
		if (s(""), o.length !== n.length || o.every((e, t) => e === n[t])) return o.length === n.length ? o : n;
		let c = this.hostOf(e);
		if (c === null) return n;
		for (let e of c.querySelectorAll(`:scope > .${BU}`)) e.remove();
		for (let e of o) c.appendChild(e);
		return o;
	}
	matchingRows(e, t) {
		let n = /* @__PURE__ */ new Set();
		if (this.rules === void 0) return n;
		let r = this.rules.state, i = this.rules.renderer;
		for (let a = e.length - 1; a >= 0; a--) {
			let o = e[a], s = R(o), c = i.getItemValue(o);
			if (c === void 0 || rO(t.config, c, r, t.query) || n.has(s)) {
				n.add(s);
				let e = ak(o)?.getAttribute("data-ui-tree-parent") ?? "";
				e.length > 0 && n.add(e);
			}
		}
		return n;
	}
	placeLoadingRow(e, t, n, r) {
		let i = e.nextElementSibling, a = i instanceof HTMLElement && i.classList.contains(BU) ? i : null;
		if (!n) {
			a?.remove();
			return;
		}
		let o = a ?? rW();
		o.style.setProperty(qU, String(t)), o.classList.toggle(IU, !r), a === null && e.after(o);
	}
	handleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null) return;
		let { tree: n, row: r, target: i } = t;
		i.closest(`.${UU}`) === null && (!Os(r, "data-ui-unselectable") || vl(i, r) !== null) || (e.preventDefault(), this.setFocus(n, r, null), this.toggle(n, r));
	}
	handleDoubleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null || vl(t.target, t.row) !== null) return;
		let { tree: n, row: r } = t;
		e.preventDefault(), n.hasAttribute("data-ui-tree-rename-dblclick") && this.canRename(n, r) ? this.startRename(r) : ld(r, "open");
	}
	rowOfEvent(e) {
		if (!(e.target instanceof Element)) return null;
		let t = e.target.closest(`.${or}`), n = t?.closest(".ui-tree") ?? null;
		return t === null || n === null || t.closest(".ui-tree") !== n || A(t) ? null : {
			tree: n,
			row: t,
			target: e.target
		};
	}
	handleFocusIn(e) {
		let t = e.target;
		!(t instanceof HTMLElement) || !t.classList.contains("ui-tree") || k(t) || Fd() || Fu(t, this.rowsOf(t));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || M(e) || !(e.target instanceof Element)) return;
		let t = ku(e);
		if (t === null) return;
		let n = t.root;
		if (!n.classList.contains("ui-tree") || k(n)) return;
		let r = e.altKey && N(e, { alt: !0 }) ? ZU[e.key] : void 0;
		if (r !== void 0 && n.hasAttribute("data-ui-tree-draggable")) {
			e.preventDefault(), this.moveByKey(n, r);
			return;
		}
		if (e.altKey || !QU.has(e.key) && !nd(e.key, "vertical")) return;
		let i = this.rowsOf(n), a = Mu(i), o = id(e.key, i, Nu(i), "vertical");
		if (o !== null) {
			e.preventDefault(), this.setFocus(n, o, $l(n, e));
			return;
		}
		if (!(a === null || A(a))) {
			switch (e.key) {
				case " ":
					AU(n, i, a, null);
					break;
				case "ArrowRight":
					a.getAttribute("aria-expanded") === "false" ? this.toggle(n, a) : a.getAttribute("aria-expanded") === "true" && this.setFocus(n, id("ArrowDown", i, a, "vertical"), Jl);
					break;
				case "ArrowLeft":
					a.getAttribute("aria-expanded") === "true" ? this.toggle(n, a) : this.setFocus(n, this.parentOf(n, a), Jl);
					break;
				case "Enter":
					MU(n, i, a, null);
					break;
				case "F2":
					if (!this.canRename(n, a)) return;
					this.startRename(a);
					break;
				case "Delete":
					if (n.hasAttribute("data-ui-tree-unremovable") || !jU(n, i, a)) return;
					break;
				default: return;
			}
			e.preventDefault();
		}
	}
	moveByKey(e, t) {
		let n = this.rowsOf(e), r = Mu(n);
		if (r === null || !r.draggable || (t === "up" || t === "down") && this.isSorted(e)) return;
		let i = aW(n), a = R(r), o = dk(i, a, t);
		if (o === null) return;
		let [s] = this.moveRows(e, [r], o, t === "in" ? n.find((e) => R(e) === o.parent) ?? null : null), c = i.filter((e) => e.parent === o.parent && e.key !== a).length + 1;
		DO(s + 1, c);
	}
	isSorted(e) {
		return (this.resolveRules(e)?.sorts.length ?? 0) > 0;
	}
	canRename(e, t) {
		return e.hasAttribute("data-ui-tree-renamable") && !Os(t, "data-ui-unrenamable");
	}
	handleDragStart(e) {
		let t = iW(e), n = t?.closest(".ui-tree") ?? null, r = n?.hasAttribute(Tr) === !0, i = n === null ? null : this.hostOf(n);
		if (t === null || n === null || i === null || !r && !n.hasAttribute("data-ui-drag-kind")) return;
		if (A(t)) {
			e.preventDefault();
			return;
		}
		let a = ED(t, this.rowsOf(n)), o = TD(n, i, a);
		r ? Xg(e, n, t, zU, R(t), a.filter((e) => e !== t), kD(o, !0)) : Qg(e, R(t), kD(o, !1)), AD(e, o);
	}
	draggingRows(e) {
		return this.rowsOf(e).filter((e) => e.classList.contains(zU));
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
		let i = this.parentKeysOf(e), a = R(t), o = (e) => n.some((t) => R(t) === e || tW(i, e, R(t))), s = ok(t, ak(t)), c = t.getBoundingClientRect(), l = c.height > 0 ? (r - c.top) / c.height : .5, u = s ? XU : .5, d = this.isSorted(e) ? null : l < u ? "before" : l >= 1 - u ? "after" : null;
		if (d === null) return s && !o(a) ? {
			mark: "",
			place: {
				parent: a,
				before: null
			}
		} : null;
		if (n.includes(t)) return null;
		let f = this.rowsOf(e), p = aW(f), m = Number(t.style.getPropertyValue(qU)) || 0, h = new Set(n.map(R)), g = d === "after" && t.getAttribute("aria-expanded") === "true" ? p.find((e) => e.parent === a && e.shown !== !1 && !h.has(e.key)) : void 0, _ = i.get(a) ?? "", v = g === void 0 ? {
			parent: _,
			before: d === "before" ? a : hk(p, _, a, !1, h)
		} : {
			parent: a,
			before: g.key
		};
		return !sk(v.parent, (e) => f.find((t) => R(t) === e) ?? null) || o(v.parent) ? null : {
			mark: d,
			place: v,
			depth: g === void 0 ? m : m + 1
		};
	}
	springOpen(e, t) {
		let n = t !== null && t.getAttribute("aria-expanded") === "false" ? t : null;
		n !== this.springTarget && (window.clearTimeout(this.springTimer), this.springTarget = n, n !== null && (this.springTimer = window.setTimeout(() => this.expand(e, n), YU)));
	}
	handleDragLeave(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${ar}`);
		t !== null && $g(e, t) && (this.markDrop(t, null), this.springOpen(t, null));
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${ar}`), n = t === null ? [] : this.draggingRows(t), r = t?.querySelector(`[${KU}]`) ?? null, i = this.dropPlace;
		if (t === null || n.length === 0 || r === null || i === null) return;
		e.preventDefault();
		let a = this.parentKeysOf(t), o = n.filter((e) => !n.some((t) => t !== e && tW(a, R(e), R(t)))), s = r.getAttribute(KU) === "" && r.classList.contains("ui-tree__row") ? r : null;
		this.markDrop(t, null), this.springOpen(t, null), Zg(t, zU), this.moveRows(t, o, i, s);
	}
	moveRows(e, t, n, r) {
		let i = gk(aW(this.rowsOf(e)), t.map(R), n);
		return r !== null && this.expand(e, r), t.forEach((e, t) => {
			let r = ak(e)?.querySelector(`.${HU}`) ?? null;
			r !== null && (r.setAttribute(Cr, n.parent), r.dispatchEvent(new Event("change", { bubbles: !0 })), zO(e, i[t]));
		}), i;
	}
	handleDragEnd(e) {
		let t = iW(e)?.closest(".ui-tree") ?? null;
		t !== null && (Zg(t, zU), this.markDrop(t, null), this.springOpen(t, null));
	}
	markDrop(e, t, n = "", r) {
		lk(e, t, n, r), t === null && (this.dropPlace = null);
	}
	parentKeysOf(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of this.rowsOf(e)) t.set(R(n), ak(n)?.getAttribute("data-ui-tree-parent") ?? "");
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
		let i = this.foldOf(e);
		i[r] = n;
		let a = n ? this.rowsOf(e).filter((e) => e.classList.contains(IU)) : [];
		this.store.writeJson(e, JU, i), this.layout(e), eW(a.filter((e) => !e.classList.contains(IU)));
	}
	foldOf(e) {
		let t = this.folds.get(e);
		return t === void 0 && (t = this.store.readJson(e, JU) ?? {}, this.folds.set(e, t)), t;
	}
	setFocus(e, t, n) {
		if (t === null) return;
		let r = this.rowsOf(e), i = Mu(r);
		Lu(e, r, t), n !== null && kU(e, r, i, t, n);
	}
	parentOf(e, t) {
		let n = ak(t)?.getAttribute("data-ui-tree-parent") ?? "";
		return n.length === 0 ? null : this.rowsOf(e).find((e) => R(e) === n) ?? null;
	}
	startRename(e) {
		let t = e.closest(`.${ar}`), n = ak(e), r = n?.querySelector(GU) ?? null;
		t === null || n === null || r === null || Os(e, "data-ui-unrenamable") || (this.setFocus(t, e, null), Vc({
			container: n,
			title: r,
			className: WU,
			value: n.getAttribute("data-ui-tree-title") ?? r.textContent?.trim() ?? "",
			commit: (t) => {
				n.setAttribute(xr, t), n.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			refocus: () => t.focus({ preventScroll: !0 })
		}));
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${b}]`);
	}
	rowsOf(e) {
		let t = this.hostOf(e), n = [];
		if (t === null) return n;
		for (let e of t.children) e instanceof HTMLElement && e.classList.contains("ui-tree__row") && n.push(e);
		return n;
	}
};
function eW(e) {
	if (!(e.length === 0 || lp())) for (let t of e) t.animate([{
		opacity: 0,
		offset: 0
	}], {
		duration: B.fast,
		easing: B.enter
	});
}
function tW(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let i = e.get(t) ?? ""; i.length > 0 && !r.has(i); i = e.get(i) ?? "") {
		if (i === n) return !0;
		r.add(i);
	}
	return !1;
}
function nW(e) {
	if (e.type !== "childList") return !0;
	let t = e.target;
	return t instanceof HTMLElement && (t.classList.contains("ui-tree__row") || t.hasAttribute("data-ui-items-host") && t.parentElement?.classList.contains("ui-tree") === !0);
}
function rW() {
	let e = document.createElement("div"), t = document.createElement("span");
	return e.className = BU, e.setAttribute("aria-hidden", "true"), t.className = VU, e.append(t, O.text("ui.tree.loading")), e;
}
function iW(e) {
	return e.target instanceof Element ? e.target.closest(`.${or}`) : null;
}
function aW(e) {
	return e.map((e) => ({
		key: R(e),
		parent: ak(e)?.getAttribute("data-ui-tree-parent") ?? "",
		takesDrop: ok(e, ak(e)),
		shown: !e.classList.contains(lr)
	}));
}
//#endregion
//#region src/runtime/client-state.ts
var oW = {
	visibilityState: () => document.visibilityState,
	notificationPermission: cW
};
function sW(e) {
	return e !== "hidden";
}
function cW() {
	return typeof Notification > "u" || !window.isSecureContext ? void 0 : Notification.permission;
}
var lW = 200;
function uW(e = oW) {
	return {
		visible: sW(e.visibilityState()),
		notificationPermission: e.notificationPermission() ?? "unsupported"
	};
}
var dW = class {
	report;
	source;
	settleMilliseconds;
	held = null;
	timer;
	constructor(e) {
		this.report = e.report, this.source = e.source ?? oW, this.settleMilliseconds = e.settleMilliseconds ?? lW;
	}
	forAttach() {
		return clearTimeout(this.timer), this.held = uW(this.source), this.held;
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
		let t = uW(this.source);
		(t.visible !== e.visible || t.notificationPermission !== e.notificationPermission) && (this.held = t, this.report(t).catch(() => void 0));
	}
};
//#endregion
//#region src/interactions/system-notifications.ts
function fW(e) {
	return {
		permission: cW,
		registration: e ?? (() => Promise.resolve(void 0)),
		create: (e, t) => new Notification(e, t),
		focus: () => window.focus()
	};
}
async function pW(e, t, n = fW()) {
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
function mW(e, t, n, r = window.location) {
	if (e.bringTo !== void 0 && hW(e.bringTo, r)) {
		t(e.bringTo);
		return;
	}
	e.action !== void 0 && n(e.action);
}
function hW(e, t = window.location) {
	let n = new URL(e, t.origin);
	return n.pathname !== t.pathname || n.search !== t.search || n.hash !== "" && n.hash !== t.hash;
}
//#endregion
//#region src/interactions/tab-order.ts
function gW(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) e[n].pinned && (t = n + 1);
	return t;
}
//#endregion
//#region src/interactions/tabs-view-engine.ts
var J = "ui-tabs-view", _W = "ui-tab-item__label", vW = "ui-tab-item__close", yW = "ui-tab-item__rename", bW = "ui-tab-item__caption", xW = "ui-tab-item__pin", SW = ".ui-text__title", CW = "ui-tab-item--dragging", wW = "ui-tab-item__caption--overflowed", TW = "ui-tabs-view--overflowing", EW = "ui-tabs-view--no-overflow", DW = "ui-tab-item__page", OW = "ui-tab-item--selected", kW = `.${S}`, AW = "tab-menu-entry", jW = {
	name: AW,
	registration: { dynamicParameters: (e) => oP(e.domEvent.detail?.entry, e.dynamicParameters) }
}, MW = "tab-pin";
function NW(e) {
	return {
		name: MW,
		registration: _D((e) => jO(e.target), e)
	};
}
var PW = "--ui-tabs-view-strip", FW = class {
	root;
	fitter;
	dragStart = null;
	menuTab = null;
	closed = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new eB({
			rootClass: J,
			overflowingClass: TW,
			wraps: (e) => e.classList.contains(EW),
			hiddenClass: wW,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(), e.effects?.register("RenameTab", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename tab effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(E(n.id), n.dynamicParameters ?? []), i = (r === null ? void 0 : this.ownItems(r).find((e) => KW(e) === t.key))?.querySelector(`.${_W}`) ?? null;
			if (i === null) {
				s("rename tab effect names no tab on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.root.addEventListener(dP, (e) => this.prepareMenu(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), XV(this.root, ["press"], (e) => {
			let t = e.closest(`.${vW}`)?.closest(`.${bW}`) ?? null;
			return t === null ? [] : [t];
		}), V(this.root, `.${J}`, {
			childList: !0,
			attributeFilter: [
				oi,
				xe,
				le,
				...li
			],
			relevant: (e) => !km(e, `.${DW}`, `.${J}`)
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${J}`)) this.apply(e);
	}
	apply(e) {
		let t = this.ownItems(e);
		LW(e, t);
		let n = t.filter(LP), r = e.getAttribute("data-ui-tabs-selected") ?? "", i = Wl(n, r, KW);
		if (i === null) return;
		if (i !== r) {
			this.select(e, i);
			return;
		}
		let a = e.hasAttribute(xe), o = t.find((e) => e.classList.contains(OW))?.querySelector(`.${bW}`) ?? null, s = [], c = null, l = null;
		for (let e of t) {
			let t = KW(e) === r;
			e.classList.toggle(OW, t);
			let i = e.querySelector(`.${bW}`);
			i !== null && (i.draggable = a, sB(i), n.includes(e) && (s.push(i), t && (c = i))), e.querySelector(`.${_W}`)?.setAttribute("aria-selected", t ? "true" : "false");
			for (let n of e.querySelectorAll(`.${DW}`)) n.hidden = !t;
			t && (l = e.querySelector(`.${DW}`));
		}
		this.fitCaptions(e, s, c), this.writeStripHeight(e, l), cB(o, c), o !== null && o !== c && lB(l);
		let u = [], d = null;
		for (let e of s) {
			let t = e.querySelector(`.${_W}`);
			t === null || e.classList.contains(wW) || (u.push(t), e === c && (d = t));
		}
		P(u, d), this.focusAfterClose(e, d);
	}
	focusAfterClose(e, t) {
		let n = this.closed;
		n === null || n.root !== e || n.item.isConnected || (this.closed = null, t !== null && (document.activeElement === null || document.activeElement === document.body) && z(t));
	}
	writeStripHeight(e, t) {
		let n = this.hostOf(e);
		if (n === null || t === null || !LP(t)) return;
		let r = Math.max(0, Math.round(t.getBoundingClientRect().top - n.getBoundingClientRect().top));
		n.style.setProperty(PW, `${r}px`);
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${b}]`);
	}
	fitCaptions(e, t, n) {
		let r = this.hostOf(e), i = e.querySelector(`:scope > .${Yz}`);
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownItems(e).find((e) => KW(e) === t)?.querySelector(`.${_W}`)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownItems(e).filter(LP).map((e) => ({
				key: KW(e),
				title: e.querySelector(`.${_W}`)?.textContent?.trim() ?? KW(e),
				current: KW(e) === t,
				disabled: k(e.querySelector(`.${_W}`) ?? e)
			}));
		});
	}
	prepareMenu(e) {
		let t = e.target;
		if (!(e instanceof CustomEvent) || !(t instanceof HTMLElement) || t.getAttribute("data-ui-context-menu") !== "tab") return;
		let n = t.parentElement, r = e.detail.target.closest(`.${kO}`);
		if (n === null || !n.classList.contains(J) || r === null || r.closest(`.${J}`) !== n) {
			e.preventDefault();
			return;
		}
		let i = BW(n, r), a = HW(t), o = a.map((e) => {
			if (VW(e)) return "rule";
			let t = i.get(e.getAttribute("data-ui-key") ?? "");
			return t !== void 0 && (e.style.display = t ? "" : "none"), t ?? LP(e) ? "shown" : "hidden";
		});
		if (aP(o).forEach((e, t) => {
			o[t] === "rule" && (a[t].style.display = e ? "" : "none");
		}), !o.includes("shown")) {
			e.preventDefault();
			return;
		}
		this.menuTab = {
			root: n,
			key: KW(r)
		};
	}
	handleMenuEntry(e) {
		let t = e.closest(`[${Ce}="tab"]`), n = t?.parentElement ?? null, r = e.closest(kW);
		if (t === null || n === null || !n.classList.contains(J) || r === null || !t.contains(r)) return !1;
		let i = r.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "", a = this.menuTab, o = a === null || a.root !== n ? void 0 : this.ownItems(n).find((e) => KW(e) === a.key);
		if (i.length === 0 || r.matches(`${zn}, ${Rn}`) || o === void 0) return !0;
		if (!i.startsWith("tabs:")) return o.dispatchEvent(new CustomEvent(AW, {
			bubbles: !0,
			detail: { entry: i }
		})), !0;
		if (BW(n, o).get(i) !== !0) return !0;
		switch (i) {
			case QN: {
				let e = o.querySelector(`.${_W}`);
				e !== null && this.startRename(e);
				break;
			}
			case $N:
			case eP:
				this.setPinned(n, o, i === $N);
				break;
			default: o.dispatchEvent(new Event("remove", { bubbles: !0 }));
		}
		return !0;
	}
	setPinned(e, t, n) {
		if (t.hasAttribute("data-ui-tab-pinned") === n) return;
		let r = t.querySelector(`:scope > .${bW} > .${xW}`);
		t.toggleAttribute(ci, n), r !== null && (r.toggleAttribute(ci, n), r.dispatchEvent(new Event("change", { bubbles: !0 })));
		let i = this.ownItems(e), a = i.filter((e) => e !== t), o = gW(a.map(GW));
		if (i.indexOf(t) === o) return;
		let s = a[o];
		s === void 0 ? AO(a[a.length - 1]).after(AO(t)) : AO(s).before(AO(t)), t.dispatchEvent(new Event(MW, { bubbles: !0 }));
	}
	handleClick(e) {
		if (!(e.target instanceof Element) || this.handleMenuEntry(e.target) || this.handleClose(e, e.target)) return;
		let t = e.target.closest(`.${Yz}`), n = t?.parentElement ?? null;
		if (t !== null && n !== null && n.classList.contains(J)) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = UW(e.target), i = r?.closest(`.${J}`) ?? null;
		if (r === null || i === null || k(r)) return;
		let a = r.closest(`.${kO}`);
		a !== null && a.closest(`.${J}`) === i && (e.preventDefault(), this.select(i, KW(a)), document.activeElement !== r && z(r));
	}
	handleClose(e, t) {
		let n = t.closest(`.${vW}`), r = n?.closest(".ui-tab-item") ?? null, i = r?.closest(`.${J}`) ?? null;
		return n === null || r === null || i === null ? !1 : (e.preventDefault(), e.stopPropagation(), RW(i, r) && r.dispatchEvent(new Event("remove", { bubbles: !0 })), !0);
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = UW(e.target), n = t?.closest(`.${J}`) ?? null;
		t === null || n === null || !n.hasAttribute("data-ui-tabs-renamable") || (e.preventDefault(), this.startRename(t));
	}
	startRename(e) {
		let t = e.parentElement, n = e.querySelector(SW) ?? e, r = e.closest(`.${kO}`);
		t === null || r === null || MO(r, "data-ui-unrenamable") || Vc({
			container: t,
			title: n,
			className: yW,
			value: e.getAttribute("data-ui-tab-caption") ?? n.textContent?.trim() ?? "",
			commit: (t) => {
				e.setAttribute(si, t), e.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			refocus: () => z(e)
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || ol(e)) return;
		let t = e.target.closest(`.${_W}`), n = t?.closest(`.${J}`) ?? null;
		if (t === null || n === null) return;
		if (e.key === "F2" && N(e)) {
			if (!n.hasAttribute("data-ui-tabs-renamable")) return;
			e.preventDefault(), this.startRename(t);
			return;
		}
		let r = t.closest(`.${kO}`);
		if (r === null || r.closest(`.${J}`) !== n) return;
		if (e.key === "Delete" && N(e)) {
			if (!zW(n, r)) return;
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
		let i = this.ownItems(n).map((e) => e.querySelector(`.${_W}`)).filter((e) => e !== null), a = yl({
			key: e.key,
			items: i,
			current: t,
			axis: "horizontal"
		});
		if (a === null) return;
		e.preventDefault();
		let o = a.closest(`.${kO}`);
		o !== null && this.select(n, KW(o)), a.focus();
	}
	moveByKey(e, t, n) {
		if (!e.hasAttribute("data-ui-tabs-draggable") || MO(t, "data-ui-undraggable") || k(t) || t.hasAttribute("data-ui-tab-pinned")) return;
		n.preventDefault();
		let r = this.ownItems(e), i = r[r.indexOf(t) + (n.key === "ArrowLeft" ? -1 : 1)];
		i === void 0 || i.hasAttribute("data-ui-tab-pinned") || (n.key === "ArrowLeft" ? AO(t).after(AO(i)) : AO(t).before(AO(i)), zO(t, this.ownItems(e).indexOf(t)));
	}
	handleDragStart(e) {
		let t = WW(e);
		if (t === null) return;
		if (MO(t, "data-ui-undraggable") || k(t) || t.hasAttribute("data-ui-tab-pinned")) {
			e.preventDefault();
			return;
		}
		Xg(e, t.closest(`.${J}`) ?? t, t, CW, KW(t));
		let n = AO(t);
		this.dragStart = n.parentNode === null ? null : {
			parent: n.parentNode,
			next: n.nextSibling
		};
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${bW}`)?.closest(".ui-tab-item") ?? null, n = t?.closest(`.${J}`) ?? null;
		if (t === null || n === null) return;
		let r = n.querySelector(`.${CW}`);
		if (r === null || (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), r === t)) return;
		let i = t.querySelector(`.${bW}`)?.getBoundingClientRect();
		if (i === void 0) return;
		let a = AO(r), o = t.hasAttribute("data-ui-tab-pinned") ? IW(n, a) : null, s = o ?? AO(t), c = o === null && e.clientX < i.left + i.width / 2 ? s : s.nextElementSibling;
		c !== a && s.parentElement?.insertBefore(a, c);
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${J}`);
		t !== null && t.querySelector(`.${CW}`) !== null && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"));
	}
	handleDragEnd(e) {
		let t = WW(e);
		if (t === null) return;
		t.classList.remove(CW);
		let n = this.dragStart;
		if (this.dragStart = null, e instanceof DragEvent && e.dataTransfer?.dropEffect === "none" && n !== null) {
			n.parent.insertBefore(AO(t), n.next);
			return;
		}
		let r = AO(t);
		if (n !== null && r.parentNode === n.parent && r.nextSibling === n.next) return;
		let i = t.closest(`.${J}`);
		i !== null && zO(t, this.ownItems(i).indexOf(t));
	}
	select(e, t) {
		Ul(e, t, {
			attribute: oi,
			bindingAttribute: ai,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return Vl(e, `.${kO}`, `.${J}`);
	}
};
function IW(e, t) {
	let n = null;
	for (let r of Vl(e, `.${kO}`, `.${J}`)) {
		let e = AO(r);
		e !== t && r.hasAttribute("data-ui-tab-pinned") && (n = e);
	}
	return n;
}
function LW(e, t) {
	let n = !t.some((e) => !MO(e, le));
	e.hasAttribute("data-ui-tabs-none-removable") !== n && e.toggleAttribute(be, n);
}
function RW(e, t) {
	return !e.hasAttribute("data-ui-tabs-unremovable") && !MO(t, "data-ui-unremovable");
}
function zW(e, t) {
	return e.hasAttribute("data-ui-tabs-removes") && RW(e, t) && !t.hasAttribute("data-ui-tab-pinned") && !k(t);
}
function BW(e, t) {
	return iP(rP(e.getAttribute(Se)), {
		pinned: t.hasAttribute(ci),
		renamable: !MO(t, ue),
		removable: e.hasAttribute("data-ui-tabs-removes") && RW(e, t)
	});
}
function VW(e) {
	let t = e.getAttribute(y);
	return t === "tabs:separator" || t === "tabs:separator-remove" || e.querySelector(":scope > [data-ui-menu-item-kind=\"separator\"]") !== null;
}
function HW(e) {
	let t = e.querySelector(`[${b}]`);
	return t === null ? [] : Array.from(t.children).filter((e) => e instanceof HTMLElement && e.hasAttribute("data-ui-key"));
}
function UW(e) {
	return e.closest(`.${vW}`) !== null || Bc(e) ? null : e.closest(`.${bW}`)?.querySelector(`:scope > .${_W}`) ?? null;
}
function WW(e) {
	return e.target instanceof Element ? e.target.closest(`.${bW}`)?.closest(".ui-tab-item") ?? null : null;
}
function GW(e) {
	return { pinned: e.hasAttribute(ci) };
}
function KW(e) {
	return e.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "";
}
//#endregion
//#region src/interactions/text-fold-engine.ts
var qW = "button.ui-text__fold-toggle", JW = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(qW);
		t !== null && (e.preventDefault(), t.setAttribute("aria-expanded", t.getAttribute("aria-expanded") === "true" ? "false" : "true"));
	}
}, YW = "ui-temporal-input__segments", XW = "ui-temporal-input__segment", ZW = "ui-temporal-input__segment-literal", QW = "ui-temporal-input__segment--empty", $W = "data-ui-temporal-segment", eG = "data-ui-temporal-step-direction", tG = "data-ui-temporal-segments-of", nG = "--", rG = /* @__PURE__ */ new Map([
	["ArrowUp", 1],
	["ArrowDown", -1],
	["PageUp", 10],
	["PageDown", -10]
]), iG = class {
	options;
	root;
	edits = /* @__PURE__ */ new WeakMap();
	wheelTurn = 0;
	onWheel = (e) => this.handleWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${K}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(Ea(e.components, `.${K}`));
		}), V(this.root, `.${K}`, { attributeFilter: [...sA] }, (e) => this.applyAll(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("mousedown", (e) => this.handleStepperPress(e), !0);
	}
	applyAll(e) {
		for (let t of e) lA(t) === "time" && this.applySegments(t);
	}
	applySegments(e) {
		for (let t of e.querySelectorAll(`.${YW}`)) this.applyContainer(e, t);
	}
	applyContainer(e, t) {
		let n = uA(e), r = hA(e), i = q(e, CA(t));
		t.getAttribute(tG) !== n && (t.replaceChildren(...aG(n).map((e) => sG(e))), t.setAttribute(tG, n));
		for (let n of t.children) {
			if (!(n instanceof HTMLElement)) continue;
			let t = n.getAttribute($W);
			if (t === null) {
				n.textContent = lG(n.dataset.token ?? "", n.dataset.formatted !== void 0, i, r);
				continue;
			}
			n.textContent = uG(t, Number(n.dataset.width ?? "2"), i, r), n.classList.toggle(QW, i === null), n.tabIndex = 0, dG(n, t, i, j(e));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !N(e, { shift: !0 })) return;
		let t = pG(e.target);
		if (t === null) return;
		let n = t.closest(`.${K}`), r = t.getAttribute($W), i = fG(t), a = rG.get(e.key);
		if (a !== void 0) {
			e.preventDefault(), this.resetBuffer(n), this.applyStep(n, r, a, i);
			return;
		}
		if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
			e.preventDefault(), this.resetBuffer(n), hG(n, t, e.key);
			return;
		}
		if (e.key === "Backspace" || e.key === "Delete") {
			e.preventDefault(), this.resetBuffer(n), MA(n, null, i), this.applySegments(n);
			return;
		}
		if (r === "meridiem") {
			let t = gG(e.key, hA(n));
			t !== null && (e.preventDefault(), this.applyMeridiem(n, t, i));
			return;
		}
		e.key.length === 1 && e.key >= "0" && e.key <= "9" && (e.preventDefault(), this.applyDigit(n, t, r, e.key, i));
	}
	handleFocusIn(e) {
		let t = pG(e.target);
		t !== null && (this.wheelTurn = 0, t.addEventListener("wheel", this.onWheel, { passive: !1 }));
	}
	handleWheel(e) {
		let t = pG(e.currentTarget);
		if (t === null || t !== document.activeElement || e.deltaY === 0) return;
		e.preventDefault();
		let { steps: n, carried: r } = Av(this.wheelTurn, kv(e).y);
		if (this.wheelTurn = r, n === 0) return;
		let i = t.closest(`.${K}`);
		this.resetBuffer(i);
		for (let e = 0; e < Math.abs(n); e++) this.applyStep(i, t.getAttribute($W), n < 0 ? 1 : -1, fG(t));
	}
	handleStepperPress(e) {
		e.target instanceof Element && e.target.closest(`[${eG}]`) !== null && e.preventDefault();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${eG}]`);
		if (t === null) return;
		let n = t.closest(`.${K}`);
		if (n === null || j(n)) return;
		e.preventDefault();
		let r = mG(n) ?? n.querySelector(`.${XW}`);
		r !== null && (r.focus(), this.resetBuffer(n), this.applyStep(n, r.getAttribute($W), t.getAttribute(eG) === "up" ? 1 : -1, fG(r)));
	}
	handleFocusOut(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${XW}`) : null;
		if (t === null) return;
		t.removeEventListener("wheel", this.onWheel);
		let n = t.closest(`.${K}`);
		n !== null && this.resetBuffer(n);
	}
	applyStep(e, t, n, r) {
		if (t === "meridiem") {
			let t = q(e, r), n = t !== null && t.getHours() >= 12 ? "am" : "pm";
			this.write(e, UA(e, vG(this.baseValue(e, r), n)), r);
			return;
		}
		let i = this.baseValue(e, r), a = _G(t), o = fA(dA(e), a) * n, s = a === "hour" ? 24 : 60, c = ((pA(i, a) + o) % s + s) % s;
		this.write(e, UA(e, mA(i, a, c)), r);
	}
	applyDigit(e, t, n, r, i) {
		let a = this.editState(e), o = n === "hour" ? 23 : n === "hour12" ? 12 : 59, s = +(n === "hour12"), c = (a.unit === n ? a.buffer : "") + r;
		Number(c) > o && (c = r);
		let l = Number(c), u = c.length >= 2 || l * 10 > o;
		if (a.unit = n, a.buffer = u ? "" : c, l >= s) {
			let t = this.baseValue(e, i);
			this.write(e, n === "hour12" ? mA(t, "hour", yG(l, t.getHours() >= 12)) : mA(t, _G(n), l), i);
		}
		u && hG(e, t, "ArrowRight");
	}
	applyMeridiem(e, t, n) {
		this.write(e, vG(this.baseValue(e, n), t), n);
	}
	baseValue(e, t) {
		return q(e, t) ?? HA(e);
	}
	write(e, t, n) {
		MA(e, t, n), BA(e), this.applySegments(e);
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
function aG(e) {
	let t = [];
	for (let n = 0; n < e.length;) {
		let r = Xa(e, n);
		if (r === null) {
			t.push({
				kind: "literal",
				token: e[n],
				formatted: !1
			}), n++;
			continue;
		}
		t.push(oG(r)), n += r.length;
	}
	return t;
}
function oG(e) {
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
function sG(e) {
	if (e.kind === "literal") {
		let t = document.createElement("span");
		return t.className = ZW, t.dataset.token = e.token, e.formatted && (t.dataset.formatted = ""), t;
	}
	let t = document.createElement("span");
	return t.className = XW, t.tabIndex = 0, t.setAttribute("role", "spinbutton"), t.setAttribute($W, e.unit), t.dataset.width = String(e.width), cG(t, e.unit), t;
}
function cG(e, t) {
	if (t === "meridiem") {
		O.write(e, "aria-label", "ui.picker.meridiem");
		return;
	}
	let n = _G(t);
	O.write(e, "aria-label", n === "hour" ? "ui.picker.hours" : n === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"), e.setAttribute("aria-valuemin", t === "hour12" ? "1" : "0"), e.setAttribute("aria-valuemax", t === "hour12" ? "12" : t === "hour" ? "23" : "59");
}
function lG(e, t, n, r) {
	return t && n !== null ? Ga(n, e, r) : e;
}
function uG(e, t, n, r) {
	if (n === null) return nG;
	if (e === "meridiem") return n.getHours() < 12 ? r.amDesignator : r.pmDesignator;
	let i = e === "hour12" ? vo(n.getHours()) : pA(n, _G(e));
	return String(i).padStart(t, "0");
}
function dG(e, t, n, r) {
	if (r !== e.hasAttribute("aria-readonly") && (r ? e.setAttribute("aria-readonly", "true") : e.removeAttribute("aria-readonly")), t === "meridiem" || n === null) {
		e.removeAttribute("aria-valuenow");
		return;
	}
	e.setAttribute("aria-valuenow", String(t === "hour12" ? vo(n.getHours()) : pA(n, _G(t))));
}
function fG(e) {
	return CA(e.closest(`.${YW}`));
}
function pG(e) {
	let t = e instanceof Element ? e.closest(`.${XW}`) : null;
	if (t === null) return null;
	let n = t.closest(`.${K}`);
	return n === null || j(n) ? null : t;
}
function mG(e) {
	return document.activeElement instanceof HTMLElement && document.activeElement.closest(".ui-temporal-input") === e ? document.activeElement.closest(`.${XW}`) : null;
}
function hG(e, t, n) {
	yl({
		key: n,
		items: [...e.querySelectorAll(`.${XW}`)],
		current: t,
		axis: "horizontal",
		loop: !1
	})?.focus();
}
function gG(e, t) {
	let n = e.toLowerCase();
	return n.length === 1 ? n === "a" || n === t.amDesignator.charAt(0).toLowerCase() ? "am" : n === "p" || n === t.pmDesignator.charAt(0).toLowerCase() ? "pm" : null : null;
}
function _G(e) {
	return e === "hour12" || e === "meridiem" ? "hour" : e;
}
function vG(e, t) {
	return mA(e, "hour", yG(vo(e.getHours()), t === "pm"));
}
function yG(e, t) {
	let n = e % 12;
	return t ? n + 12 : n;
}
//#endregion
//#region src/interactions/timestamp-engine.ts
var bG = "datetime", xG = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.apply(this.root.querySelectorAll(`.${St}`), O.temporal === null), O.onTable(() => this.apply(this.root.querySelectorAll(`.${St}`))), e.propertyPatchEngine?.addValueChangeHandler((e) => this.apply(Ea(e.components, `.${St}`))), V(this.root, `.${St}`, {
			childList: !0,
			attributeFilter: [bG],
			relevant: (e) => e.type === "attributes" || !(e.target instanceof Element && e.target.closest(".ui-timestamp") !== null)
		}, (e) => this.apply(e));
	}
	apply(e, t = !1) {
		let n = {
			temporal: O.temporal,
			language: O.language || document.documentElement.lang
		}, r = Date.now(), i = !1;
		for (let a of e) {
			let e = So(a.getAttribute(wt)), o = xo(a.getAttribute(bG)), s = a.querySelector(`.${Ct}`);
			if (s === null || t && !SG(e, o, r)) continue;
			let c = o === null ? "" : Eo(o, e, n, r);
			s.textContent !== c && (s.textContent = c), i ||= Co(e) && o !== null;
		}
		i && rs(this.refreshRelative);
	}
	refreshRelative = () => {
		let e = [...this.root.querySelectorAll(`.${St}:is([${wt}="relative"], [${wt}="relative-date"])`)];
		return e.length !== 0 && (this.apply(e), !0);
	};
};
function SG(e, t, n) {
	return e === "relative" || e === "relative-date" && t !== null && Do(t, n) !== null;
}
//#endregion
//#region src/interactions/file-tile-engine.ts
var CG = `.${Tt}`, wG = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), O.onChange(() => this.applyAll()), e.propertyPatchEngine?.addValueChangeHandler((e) => TG(Ea(e.components, CG))), V(this.root, CG, {
			childList: !0,
			attributeFilter: [
				kt,
				At,
				jt,
				Mt
			],
			relevant: (e) => e.type === "attributes" || !(e.target instanceof Element && e.target.closest(CG) !== null)
		}, TG);
	}
	applyAll() {
		TG(this.root.querySelectorAll(CG));
	}
};
function TG(e) {
	let t = O.language || document.documentElement.lang;
	for (let n of e) I_(n, t);
}
//#endregion
//#region src/items/item-reveal.ts
var EG = /* @__PURE__ */ new Map();
function DG(e) {
	if (e.hasAttribute("data-ui-items-host")) return e;
	for (let t of e.querySelectorAll(`[${b}]`)) if (t.closest(C) === e) return t;
	return null;
}
function OG(e, t, n, r) {
	let i = kG(e, t);
	return i !== null && (EG.set(e, {
		key: t,
		block: n
	}), AG(e, i, n, r), !0);
}
function kG(e, t) {
	for (let n of e.children) if (n.getAttribute("data-ui-key") === t) return n;
	return null;
}
function AG(e, t, n, r) {
	let i = t.previousElementSibling, a = i !== null && i.hasAttribute("data-ui-group-header") && i.getAttribute("data-ui-group-anchor") === t.getAttribute("data-ui-key") ? i : null, o = Tl(e);
	if (o.scrollHeight <= o.clientHeight) {
		(a ?? t).scrollIntoView({
			behavior: r,
			block: n === "Start" ? "start" : n === "End" ? "end" : n === "Center" ? "center" : "nearest"
		});
		return;
	}
	let s = o.getBoundingClientRect().top + o.clientTop, c = o.clientHeight, l = (a ?? t).getBoundingClientRect().top, u = t.getBoundingClientRect().bottom, d = jG(n, l - s, u - s, c);
	d !== 0 && (r === "smooth" ? o.scrollTo({
		top: o.scrollTop + d,
		behavior: r
	}) : o.scrollTop += d);
}
function jG(e, t, n, r) {
	switch (e) {
		case "Center": return (t + n - r) / 2;
		case "End": return n - r;
		case "Nearest": return t >= 0 && n <= r ? 0 : t < 0 || n - t > r ? t : n - r;
		default: return t;
	}
}
function MG(e) {
	let t = EG.get(e);
	if (t === void 0) return;
	let n = kG(e, t.key);
	if (n === null) {
		EG.delete(e);
		return;
	}
	AG(e, n, t.block, "auto");
}
function NG(e) {
	if (!(EG.size === 0 || !(e instanceof Node))) for (let t of [...EG.keys()]) (!t.isConnected || Tl(t).contains(e)) && EG.delete(t);
}
//#endregion
//#region src/interactions/scroll-anchor-engine.ts
var PG = "data-ui-scroll-anchor", FG = "End", IG = `[${PG}="${FG}"]`, LG = 4, RG = [
	"wheel",
	"touchstart",
	"pointerdown",
	"keydown"
], zG = /* @__PURE__ */ new WeakSet();
function BG(e) {
	zG.add(e);
}
function VG(e) {
	NG(e);
	for (let t = e.closest(IG); t !== null; t = t.parentElement?.closest(IG) ?? null) zG.delete(t);
}
var HG = class {
	root;
	pinned = /* @__PURE__ */ new WeakMap();
	resizes = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null;
	watched = /* @__PURE__ */ new WeakMap();
	watchedContainers = /* @__PURE__ */ new WeakSet();
	heights = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0);
		for (let e of RG) this.root.addEventListener(e, (e) => UG(e), {
			capture: !0,
			passive: !0
		});
		V(this.root, `[${PG}="${FG}"]`, {
			childList: !0,
			characterData: !0,
			attributeFilter: [ln]
		}, (e) => this.followEach(e)), this.followContent();
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof Element) || !GG(t) || this.pinned.set(t, zG.has(t) || qG(t) && !KG(t));
	}
	followContent() {
		this.followEach(this.root.querySelectorAll(`[${PG}="${FG}"]`));
	}
	followEach(e) {
		for (let t of e) {
			if (this.watchRows(t), zG.has(t)) {
				this.pinned.set(t, !0), WG(t);
				continue;
			}
			if (this.pinned.get(t) !== !1) {
				if (KG(t)) {
					this.pinned.set(t, !1);
					continue;
				}
				this.pinned.set(t, !0), WG(t);
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
			if (!e.isConnected || r === null || !GG(r)) {
				this.forget(e);
				continue;
			}
			let i = e.getBoundingClientRect(), a = this.heights.get(e);
			if (this.heights.set(e, i.height), a === i.height) continue;
			let o = a !== void 0 && i.top + a <= r.getBoundingClientRect().top ? i.height - a : 0;
			t.set(r, (t.get(r) ?? 0) + o);
		}
		for (let [e, n] of t) this.followsEnd(e) ? WG(e) : n !== 0 && e.getAttribute("data-ui-host-mode") !== "virtualized" && getComputedStyle(e).overflowAnchor === "none" && (e.scrollTop += n);
	}
	followOwnBox(e) {
		if (!e.isConnected || !GG(e)) {
			this.watchedContainers.delete(e), this.resizes?.unobserve(e);
			return;
		}
		this.followsEnd(e) && WG(e);
	}
	followsEnd(e) {
		return zG.has(e) || this.pinned.get(e) !== !1 && !KG(e);
	}
	forget(e) {
		this.resizes?.unobserve(e), this.heights.delete(e);
	}
};
function UG(e) {
	NG(e.target);
	let t = e.target instanceof Element ? e.target.closest(IG) : null;
	t !== null && zG.delete(t);
}
function WG(e) {
	e.scrollTop = e.scrollHeight;
}
function GG(e) {
	return e.getAttribute(PG) === FG;
}
function KG(e) {
	return xD(e, rn);
}
function qG(e) {
	return e.scrollHeight - e.scrollTop - e.clientHeight <= LG;
}
//#endregion
//#region src/interactions/text-selection-engine.ts
var JG = `${dl}, [role='menu'], [role='tab']`, YG = class {
	selection;
	selects;
	constructor(e = {}) {
		let t = e.root ?? document;
		this.selection = e.selection ?? (() => document.getSelection()), this.selects = e.selects ?? XG, t.addEventListener("pointerdown", (e) => this.handlePointerDown(e), { capture: !0 });
	}
	handlePointerDown(e) {
		if (e.button !== 0 || e.pointerType === "touch" || !(e.target instanceof Element)) return;
		let t = this.selection();
		t === null || t.isCollapsed || e.target.closest(JG) !== null || this.selects(e.target) || t.removeAllRanges();
	}
};
function XG(e) {
	let t = getComputedStyle(e);
	return (t.getPropertyValue("user-select") || t.getPropertyValue("-webkit-user-select")) !== "none";
}
//#endregion
//#region src/interactions/scroll-group-mapping.ts
function ZG(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.top(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = $G(e, a, n), s = $G(e, a + 1, n);
	return eK(t, o.top, s.top, o.line, s.line);
}
function QG(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.line(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = $G(e, a, n), s = $G(e, a + 1, n);
	return eK(t, o.line, s.line, o.top, s.top);
}
function $G(e, t, n) {
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
function eK(e, t, n, r, i) {
	return n <= t ? r : r + Math.min(1, Math.max(0, (e - t) / (n - t))) * (i - r);
}
//#endregion
//#region src/interactions/scroll-group-engine.ts
var tK = 250, nK = class {
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
		let r = this.memberScrolledBy(t), i = r?.getAttribute(qt);
		if (r != null && i != null && i.length !== 0) for (let e of this.membersOf(i)) e !== r && e.isConnected && this.follow(t, this.viewportOf(e));
	}
	membersOf(e) {
		let t = performance.now(), n = this.members.get(e);
		if (n !== void 0 && t - n.at < tK && n.found.every((e) => e.isConnected)) return n.found;
		let r = [...this.root.querySelectorAll(`[${qt}="${w(e)}"]`)];
		return this.members.set(e, {
			found: r,
			at: t
		}), r;
	}
	memberScrolledBy(e) {
		for (let t = e.closest(`[${qt}]`); t !== null; t = t.parentElement?.closest("[data-ui-scroll-group]") ?? null) if (this.viewportOf(t) === e) return t;
		return null;
	}
	viewportOf(e) {
		let t = this.viewports.get(e);
		if (t !== void 0 && t.isConnected && e.contains(t)) return t;
		let n = rK(e, "data-ui-scroll-viewport") ?? iK(e) ?? e;
		return this.viewports.set(e, n), n;
	}
	follow(e, t) {
		let n = e.scrollHeight - e.clientHeight, r = t.scrollHeight - t.clientHeight;
		if (r <= 0 && t.scrollWidth <= t.clientWidth) return;
		let i = n > 0 ? oK(e) : null, a = i === null ? null : oK(t), o;
		if (n <= 0 || e.scrollTop <= 0) o = 0;
		else if (e.scrollTop >= n - 1) o = r;
		else if (i !== null && a !== null) {
			let t = Math.max(i.endLine, a.endLine);
			o = QG(a, ZG(i, e.scrollTop, t), t);
		} else o = e.scrollTop / n * r;
		let s = i === null && a === null ? aK(e.scrollLeft, e.scrollWidth - e.clientWidth) * Math.max(0, t.scrollWidth - t.clientWidth) : t.scrollLeft;
		o = Math.round(Math.min(Math.max(0, o), Math.max(0, r))), !(Math.abs(t.scrollTop - o) < 1 && Math.abs(t.scrollLeft - s) < 1) && (t.scrollTo({
			top: o,
			left: s,
			behavior: "instant"
		}), this.driven.set(t, t.scrollTop));
	}
};
function rK(e, t) {
	for (let n of e.querySelectorAll(`[${t}]`)) if (n.closest("[data-ui-id]") === e) return n;
	return null;
}
function iK(e) {
	let t = e.hasAttribute("data-ui-items-host") ? e : rK(e, b);
	return t === null ? null : Tl(t);
}
function aK(e, t) {
	return t > 0 ? e / t : 0;
}
function oK(e) {
	let t = e.getBoundingClientRect().top + e.clientTop - e.scrollTop, n = (e) => e.getBoundingClientRect().top - t, r = e.querySelector(`[${Jt}]`);
	if (r !== null && r.children.length > 0) return {
		count: r.children.length,
		line: (e) => e + 1,
		top: (e) => n(r.children[e]),
		endLine: r.children.length + 1,
		scrollHeight: e.scrollHeight
	};
	let i = e.querySelectorAll(`[${Yt}]`);
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
var sK = ".ui-tab-item__caption, .ui-split-button:not([data-ui-split-mode='menu']) > :is(.ui-split-button__main, .ui-split-button__toggle)", cK = `.${wi}, .ui-action, .${S}, .ui-select__option, .ui-language-switcher__choice, .ui-pager__size-choice, .ui-color-input__swatch--button, .ui-expander__header, ${sK}`, lK = ".ui-expander--quiet > .ui-expander__header", uK = "ui-key-value-action__row", dK = `${cK}, ${`${Kl}, .${uK}`}`, fK = "ui-pressing", pK = "ui-press-held", mK = class {
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
		if (t === null || typeof t.animate != "function" || lp()) return;
		for (let [e, n] of this.presses) n.element === t && this.finish(e, n);
		let n = t.getBoundingClientRect(), r = e.clientX - n.left, i = e.clientY - n.top, a = Math.hypot(Math.max(r, n.width - r), Math.max(i, n.height - i)), { wave: o, ink: s } = hK(r - t.clientLeft, i - t.clientTop, a);
		t.classList.add(fK, pK), t.append(o);
		let c = s.animate([{ transform: "scale(0)" }, { transform: "scale(1)" }], {
			duration: B.ripple,
			easing: B.ease,
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
		let t = e.closest(sK) ?? e.closest(dK);
		if (t === null || k(t) || t.matches(lK)) return null;
		let n = e.closest(xi);
		return n !== null && n !== t && t.contains(n) ? null : t.matches(cK) ? t : this.pressedRow(t, e);
	}
	pressedRow(e, t) {
		if (vl(t, e) !== null || A(e) || e.hasAttribute("data-ui-row-editing")) return null;
		let n = e.closest(I), r = n !== null && !e.classList.contains(uK) && !n.hasAttribute("data-ui-no-row-select") && (n.getAttribute("data-ui-selection") === "one" || n.getAttribute("data-ui-selection") === "many"), i = e.classList.contains("ui-tree__row") && Os(e, "data-ui-unselectable");
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
		e instanceof PointerEvent && this.end(e.pointerId, t);
	}
	finishAll() {
		for (let [e, t] of [...this.presses]) this.finish(e, t);
	}
	end(e, t) {
		let n = this.presses.get(e);
		if (n === void 0 || n.fade !== null) return;
		n.element.classList.remove(pK);
		let r = Math.max(0, B.ripple - (performance.now() - n.started)), i = 0;
		!t && r > 0 && (i = Math.min(r, B.fast), n.grow.updatePlaybackRate(r / i)), n.fade = n.wave.animate([{ opacity: 1 }, { opacity: 0 }], {
			duration: B.normal,
			delay: i,
			easing: B.exit,
			fill: "forwards"
		}), n.fade.addEventListener("finish", () => this.finish(e, n));
	}
	finish(e, t) {
		t.grow.cancel(), t.fade?.cancel(), t.wave.remove(), t.element.classList.remove(fK, pK), this.presses.get(e) === t && this.presses.delete(e);
	}
};
function hK(e, t, n) {
	let r = document.createElement("span"), i = document.createElement("span");
	return r.className = xm, r.setAttribute("aria-hidden", "true"), i.className = Sm, i.style.setProperty("left", `${e - n}px`), i.style.setProperty("top", `${t - n}px`), i.style.setProperty("width", `${n * 2}px`), i.style.setProperty("height", `${n * 2}px`), r.append(i), {
		wave: r,
		ink: i
	};
}
//#endregion
//#region src/interactions/overlay-scrollbar-engine.ts
var gK = "ui-overlay-scrollbar", _K = "ui-overlay-scrollbar__box", vK = "ui-overlay-scrollbar__thumb", yK = "ui-overlay-scrollbar--shown", bK = "ui-overlay-scrollbar__thumb--held", xK = "(hover: hover) and (forced-colors: none)", SK = "--ui-overlay-thumb", CK = "--ui-scroll-hung", wK = 12, TK = 2, EK = 24, DK = 900, OK = 400, kK = 16, AK = class {
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
		this.doc = e, this.layer = e.createElement("div"), this.layer.className = gK, this.layer.setAttribute("aria-hidden", "true"), this.layer.setAttribute("popover", "manual"), this.bars = {
			y: this.createBar(e, "y"),
			x: this.createBar(e, "x")
		}, this.layer.addEventListener("mousedown", (e) => e.preventDefault()), this.layer.addEventListener("contextmenu", (e) => e.preventDefault()), e.body.append(this.layer), Hm((e) => e.includes(this.bars.y.thumb) ? this.bars.y.scroller : e.includes(this.bars.x.thumb) ? this.bars.x.scroller : null), this.media = window.matchMedia(xK), this.active = this.media.matches, this.media.addEventListener("change", () => this.follow()), this.active && this.raise(), e.addEventListener("pointermove", (e) => this.handlePointerMove(e), {
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
		return n.className = `${_K} ${_K}--${t}`, r.className = `${vK} ${vK}--${t}`, n.append(r), this.layer.append(n), r.addEventListener("pointerdown", (e) => this.grab(e, t)), r.addEventListener("pointermove", (e) => this.pull(e)), r.addEventListener("pointerup", (e) => this.release(e)), r.addEventListener("pointercancel", (e) => this.release(e)), r.addEventListener("lostpointercapture", (e) => this.lose(e)), r.addEventListener("wheel", (e) => this.forwardWheel(e, t), { passive: !1 }), {
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
			this.readerScrolled(e) && (this.pick(IK(t, "y") ? t : null, IK(t, "x") ? t : null, !1), this.flash(), this.settleLater(), this.schedule());
		}
	}
	noteInput(e) {
		this.inputAt = e.timeStamp;
	}
	readerScrolled(e) {
		return e.timeStamp - this.inputAt < OK;
	}
	flash() {
		this.scrolling = !0, window.clearTimeout(this.fade), this.fade = window.setTimeout(() => {
			this.fade = 0, this.scrolling = !1, this.paint();
		}, DK), this.paint();
	}
	approach() {
		let e = !1;
		for (let t of [this.bars.y, this.bars.x]) {
			let n = this.point !== null && t.view !== null && jK(this.point, t.view, t.axis, t.rtl);
			e ||= n !== t.near, t.near = n;
		}
		e && this.paint();
	}
	paint() {
		for (let e of [this.bars.y, this.bars.x]) e.box.classList.toggle(yK, e.view !== null && (this.scrolling || e.near || this.drag?.axis === e.axis));
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
		}, DK);
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
		e !== null && this.layer.contains(e) || (this.target = e, this.pick(MK(e, "y"), MK(e, "x"), !0));
	}
	measure(e) {
		let t = this.bars[e].scroller;
		if (t === null || !t.isConnected || !IK(t, e)) return null;
		let n = BK(t);
		if (n === null) return null;
		let r = this.bars[e === "y" ? "x" : "y"].scroller === t;
		return {
			view: n,
			thumb: HK(t, e, e === "y" ? zK(t) : LK(t), r),
			rtl: KK(t)
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
		let r = t === "x" && KK(n), i = UK(n, t, LK(n), this.bars[t === "y" ? "x" : "y"].scroller === n, r), a = i.length - i.thumb;
		VG(n), this.bars[t].thumb.setPointerCapture(e.pointerId), this.bars[t].thumb.classList.add(bK), this.drag = {
			axis: t,
			scroller: n,
			pointerId: e.pointerId,
			from: t === "y" ? e.clientY : e.clientX,
			scroll: GK(n, t),
			ratio: a > 0 ? i.max / a : 0,
			rtl: r
		};
	}
	pull(e) {
		let t = this.drag;
		if (t === null || e.pointerId !== t.pointerId || !t.scroller.isConnected) return;
		let n = (t.axis === "y" ? e.clientY : e.clientX) - t.from;
		t.axis === "y" ? t.scroller.scrollTop = WK(t.scroll, n, t.ratio, !1) : t.scroller.scrollLeft = WK(t.scroll, n, t.ratio, t.rtl);
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
			e.preventDefault(), t.axis === "y" ? t.scroller.scrollTop = WK(t.scroll, 0, t.ratio, !1) : t.scroller.scrollLeft = WK(t.scroll, 0, t.ratio, t.rtl), this.endDrag();
			try {
				this.bars[t.axis].thumb.releasePointerCapture(t.pointerId);
			} catch {}
		}
	}
	endDrag() {
		this.drag !== null && this.bars[this.drag.axis].thumb.classList.remove(bK), this.drag = null, this.paint();
	}
	forwardWheel(e, t) {
		let n = this.bars[t].scroller;
		if (n === null || e.ctrlKey) return;
		let r = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? "y" : "x", i = e.deltaX * FK(e, n, "x"), a = e.deltaY * FK(e, n, "y"), o = NK(n, r, r === "y" ? a : i);
		e.preventDefault(), o !== null && (VG(o), o.scrollBy({
			left: i,
			top: a
		}));
	}
};
function jK(e, t, n, r) {
	return n === "x" ? e.x >= t.left && e.x <= t.right && e.y <= t.bottom && e.y > t.bottom - 28 : e.y < t.top || e.y > t.bottom ? !1 : r ? e.x >= t.left && e.x < t.left + 28 : e.x <= t.right && e.x > t.right - 28;
}
function MK(e, t) {
	for (let n = e; n !== null; n = n.parentElement) if (IK(n, t)) return n;
	return null;
}
function NK(e, t, n) {
	for (let r = e; r !== null; r = MK(r.parentElement, t)) if (IK(r, t) && PK(r, t, n)) return r;
	return null;
}
function PK(e, t, n) {
	let r = t === "y" ? e.scrollHeight - e.clientHeight : e.scrollWidth - e.clientWidth, i = GK(e, t), a = t === "x" && KK(e) ? n < 0 : n > 0;
	return n !== 0 && (a ? i < r - 1 : i > 0);
}
function FK(e, t, n) {
	return e.deltaMode === WheelEvent.DOM_DELTA_LINE ? kK : e.deltaMode === WheelEvent.DOM_DELTA_PAGE ? n === "y" ? t.clientHeight : t.clientWidth : 1;
}
function IK(e, t) {
	if ((t === "y" ? e.scrollHeight - e.clientHeight : e.scrollWidth - e.clientWidth) <= 1) return !1;
	let n = e === document.scrollingElement, r = getComputedStyle(n ? document.documentElement : e), i = t === "y" ? r.overflowY : r.overflowX;
	return n ? i !== "hidden" && i !== "clip" : (i === "auto" || i === "scroll") && r.getPropertyValue(SK).trim() !== "none";
}
function LK(e) {
	if (e === document.scrollingElement) return qK(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
	let t = e.getBoundingClientRect(), n = e instanceof HTMLElement ? e : null, r = RK(t.width, n?.offsetWidth), i = RK(t.height, n?.offsetHeight), a = t.left + e.clientLeft * r, o = t.top + e.clientTop * i;
	return qK(a, o, a + e.clientWidth * r, o + e.clientHeight * i);
}
function RK(e, t) {
	return t === void 0 || t <= 0 || e <= 0 ? 1 : e / t;
}
function zK(e) {
	let t = LK(e);
	if (e === document.scrollingElement) return t;
	let n = Number.parseFloat(getComputedStyle(e).getPropertyValue(CK));
	return n > 0 ? KK(e) ? qK(t.left - n, t.top, t.right, t.bottom) : qK(t.left, t.top, t.right + n, t.bottom) : t;
}
function BK(e) {
	let t = zK(e);
	for (let n = e; n !== null && n !== document.documentElement; n = n.parentElement) {
		let r = getComputedStyle(n);
		if (n !== e && (r.overflowX !== "visible" || r.overflowY !== "visible") && (t = JK(t, VK(n, r))), r.position === "fixed" || n.matches(":popover-open, dialog:modal")) break;
	}
	return t = JK(t, qK(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight)), t.width > 0 && t.height > 0 ? t : null;
}
function VK(e, t) {
	let n = LK(e), r = Number.parseFloat((t.overflowClipMargin ?? "").split(" ").at(-1) ?? "") || 0, i = t.overflowX === "visible" ? Infinity : t.overflowX === "clip" ? r : 0, a = t.overflowY === "visible" ? Infinity : t.overflowY === "clip" ? r : 0;
	return qK(n.left - i, n.top - a, n.right + i, n.bottom + a);
}
function HK(e, t, n, r) {
	let i = KK(e), a = UK(e, t, n, r, i), o = a.max > 0 ? GK(e, t) / a.max * (a.length - a.thumb) : 0;
	return t === "y" ? {
		left: i ? n.left : n.right - wK,
		top: a.start + o,
		width: wK,
		height: a.thumb
	} : {
		left: i ? a.start + a.length - a.thumb - o : a.start + o,
		top: n.bottom - wK,
		width: a.thumb,
		height: wK
	};
}
function UK(e, t, n, r, i) {
	let a = (t === "y" ? n.top : n.left) + TK + (r && i && t === "x" ? wK : 0), o = (t === "y" ? n.height : n.width) - 4 - (r ? wK : 0), s = t === "y" ? e.clientHeight : e.clientWidth, c = t === "y" ? e.scrollHeight : e.scrollWidth;
	return {
		start: a,
		length: o,
		thumb: Math.min(o, Math.max(EK, o * s / c)),
		max: c - s
	};
}
function WK(e, t, n, r) {
	return r ? -(e - t * n) : e + t * n;
}
function GK(e, t) {
	return t === "y" ? e.scrollTop : Math.abs(e.scrollLeft);
}
function KK(e) {
	return getComputedStyle(e).direction === "rtl";
}
function qK(e, t, n, r) {
	return {
		left: e,
		top: t,
		right: n,
		bottom: r,
		width: Math.max(0, n - e),
		height: Math.max(0, r - t)
	};
}
function JK(e, t) {
	return qK(Math.max(e.left, t.left), Math.max(e.top, t.top), Math.min(e.right, t.right), Math.min(e.bottom, t.bottom));
}
//#endregion
//#region src/interactions/refusal-engine.ts
var YK = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"Home",
	"End",
	"PageUp",
	"PageDown"
]), XK = [
	"click",
	"dblclick",
	"auxclick",
	"dragstart"
], ZK = `.${fi}, .${pi}`, QK = RegExp(`(^|\\s)(${fi}|${pi})(\\s|$)`), $K = RegExp(`(^|\\s)${mi}(\\s|$)`), eq = "[type='range']", tq = /* @__PURE__ */ new WeakSet(), nq = /* @__PURE__ */ new WeakSet();
function rq(e = document) {
	let t = e === document ? window : e;
	for (let e of XK) t.addEventListener(e, dq, !0);
	t.addEventListener("keydown", pq, !0), t.addEventListener("change", mq, !0), t.addEventListener("pointerdown", hq, !0), t.addEventListener("mousedown", hq, !0), cq(e.querySelectorAll(ZK)), oq(e.querySelectorAll(`[${di}]`)), aq(e.querySelectorAll(eq)), new MutationObserver((e) => {
		for (let t of e) iq(t);
	}).observe(e, {
		subtree: !0,
		childList: !0,
		attributes: !0,
		attributeFilter: ["class", di],
		attributeOldValue: !0
	});
}
function iq(e) {
	if (e.type === "attributes") {
		let t = e.target;
		if (e.attributeName === "data-ui-href") {
			sq(t, e.oldValue !== null);
			return;
		}
		let n = QK.test(e.oldValue ?? ""), r = t.matches(ZK);
		n !== r && (lq(t, r), sq(t)), $K.test(e.oldValue ?? "") !== t.matches(".ui-readonly") && aq(t.querySelectorAll(eq));
		return;
	}
	let t = (e.target instanceof Element ? e.target : null)?.matches(ZK) === !0;
	for (let n of e.addedNodes) n instanceof Element && (t && uq(n), n.matches(ZK) && lq(n, !0), cq(n.querySelectorAll(ZK)), sq(n), oq(n.querySelectorAll(`[${di}]`)), aq([n, ...n.querySelectorAll(eq)]));
}
function aq(e) {
	for (let t of e) {
		if (!(t instanceof HTMLInputElement) || t.type !== "range") continue;
		let e = j(t);
		e !== tq.has(t) && (e ? (tq.add(t), t.addEventListener("touchstart", hq, { passive: !1 })) : (tq.delete(t), t.removeEventListener("touchstart", hq)));
	}
}
function oq(e) {
	for (let t of e) sq(t);
}
function sq(e, t = !1) {
	let n = e.getAttribute(di);
	n === null && !t || (e.matches(ZK) ? (e.removeAttribute("href"), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0")) : n === null || !yh(n) ? e.removeAttribute("href") : e.getAttribute("href") !== n && (e.setAttribute("href", n), e.getAttribute("tabindex") === "0" && e.removeAttribute("tabindex")));
}
function cq(e) {
	for (let t of e) lq(t, !0);
}
function lq(e, t) {
	for (let n of e.children) t ? uq(n) : nq.has(n) && (nq.delete(n), n.removeAttribute("inert"));
}
function uq(e) {
	e.hasAttribute("inert") || (nq.add(e), e.setAttribute("inert", ""));
}
function dq(e) {
	e.target instanceof Element && (k(e.target) ? (e.type === "click" && Ym(e), gq(e)) : e.type === "click" && fq(e.target) && e.preventDefault());
}
function fq(e) {
	return e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio") && j(e);
}
function pq(e) {
	if (!(!(e instanceof KeyboardEvent) || !(e.target instanceof Element))) {
		if ((e.key === "Enter" || e.key === " ") && k(e.target)) {
			gq(e);
			return;
		}
		!YK.has(e.key) || !(e.target instanceof HTMLInputElement) || (e.target.type === "range" || e.target.type === "radio") && j(e.target) && e.preventDefault();
	}
}
function mq(e) {
	e.target instanceof HTMLInputElement && e.target.type === "range" && j(e.target) && e.stopImmediatePropagation();
}
function hq(e) {
	!(e.target instanceof HTMLInputElement) || e.target.type !== "range" || !j(e.target) || (e.preventDefault(), e.target.focus({ preventScroll: !0 }));
}
function gq(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region src/interactions/popup-service.ts
var _q = /* @__PURE__ */ new WeakMap(), vq = /* @__PURE__ */ new WeakSet(), yq = /* @__PURE__ */ new WeakSet(), bq = new gg({
	show: () => void 0,
	hide: ({ popup: e }, t) => {
		let n = _q.get(e);
		_q.delete(e), t !== void 0 && n?.(t);
	},
	single: !1,
	isInside: ({ popup: e, anchor: t }, n) => n.includes(e) || t !== void 0 && n.includes(t),
	onPress: !0,
	closesOnTab: ({ popup: e }) => vq.has(e),
	sheetOnPhone: ({ popup: e }) => yq.has(e)
});
function xq(e) {
	return {
		open: (e, t, n) => Sq(e, t, n, (e) => bq.open(e)),
		openList: Cq,
		listKey: vM,
		followPointer: xM,
		focusReturn: (t) => of(t, e)
	};
}
function Sq(e, t, n, r) {
	let i = n.owner ?? (e instanceof HTMLElement ? e : t), a = () => bq.popupOf(i) === t;
	return _q.set(t, n.onDismiss), n.closesOnTab === !0 ? vq.add(t) : vq.delete(t), n.sheetOnPhone === !0 ? yq.add(t) : yq.delete(t), r({
		owner: i,
		popup: t,
		anchor: e,
		placement: n
	}) || (_q.delete(t), queueMicrotask(() => n.onDismiss("owner"))), {
		reposition: () => {
			a() && bq.reposition(i);
		},
		close: () => {
			a() && bq.close(i);
		}
	};
}
function Cq(e, t, n) {
	return Sq(e, t, {
		...n,
		closesOnTab: !0
	}, (e) => _M(bq, e, n.entries, n.checked, n.fromEnd, n.focus));
}
//#endregion
//#region src/rendering/series-colors.ts
var wq = "--ui-color-series-count", Tq = "--ui-color-series-", Eq = 8;
function Dq(e) {
	let t = Number(getComputedStyle(e).getPropertyValue(wq));
	return Number.isFinite(t) && t >= 1 ? Math.floor(t) : Eq;
}
function Oq(e, t) {
	return `var(${Tq}${e % t + 1})`;
}
var kq = {
	count: Dq,
	color: Oq
}, Aq = ".ui-items-view", jq = `:scope > [${b}]`, Mq = `:scope > [${It}]`, Nq = "ui-orientation--horizontal", Pq = 1, Fq = [{
	edge: "first",
	holder: `:scope > [${Vt}="${Ut}"]`,
	bound: `${Ye}first-visible-key`,
	attribute: ft
}, {
	edge: "last",
	holder: `:scope > [${Vt}="${Wt}"]`,
	bound: `${Ye}last-visible-key`,
	attribute: pt
}], Iq = class {
	root;
	views = /* @__PURE__ */ new Set();
	waiting = /* @__PURE__ */ new Map();
	sized = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, V(this.root, Aq, { childList: !0 }, (e) => this.findEach(e));
		let t = this.root.querySelectorAll(`[${Vt}="${Ut}"], [${Vt}="${Wt}"]`);
		this.findEach(new Set(Array.from(t, (e) => e.parentElement).filter((e) => e !== null))), this.root.addEventListener("scroll", (e) => this.handleScroll(e), {
			capture: !0,
			passive: !0
		});
	}
	findEach(e) {
		for (let t of e) Lq(t) ? (this.views.add(t), this.watchHost(t), this.schedule(t)) : this.views.has(t) && this.forget(t);
	}
	watchHost(e) {
		let t = e.querySelector(jq), n = this.sized.get(e);
		if (n?.host === t) return;
		if (n?.stop(), t === null) {
			this.sized.delete(e);
			return;
		}
		let r = AR(t, () => this.schedule(e)), i = new MutationObserver((n) => {
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
		let t = e.isConnected ? Rq(e) : [];
		if (t.length === 0) {
			this.forget(e);
			return;
		}
		let n = e.querySelector(jq);
		if (n === null || k(t[0].holder)) return;
		let r = Bq(e, n);
		for (let { holder: e, edge: n, attribute: i } of t) {
			let t = zq(r, n);
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
function Lq(e) {
	return Rq(e).length > 0;
}
function Rq(e) {
	let t = [];
	for (let { holder: n, bound: r, edge: i, attribute: a } of Fq) {
		let o = e.querySelector(n);
		o?.hasAttribute(r) === !0 && t.push({
			holder: o,
			edge: i,
			attribute: a
		});
	}
	return t;
}
function zq(e, t) {
	if (e === null) return null;
	let { rows: n, band: r } = e;
	if (!(r.end - r.start <= Pq)) return (t === "first" ? qq(n, r) : Jq(n, r)) ?? void 0;
}
function Bq(e, t) {
	let n = e.classList.contains(Nq), r = n && getComputedStyle(t).direction === "rtl", i = [], a = !1;
	for (let e of t.children) {
		let t = e.getAttribute(y);
		if (t === null || e.hasAttribute("data-ui-group-header")) continue;
		a = !0;
		let o = Al(e);
		!e.classList.contains("ui-hidden") && (o.width > 0 || o.height > 0) && i.push({
			key: t,
			...Vq(o, n, r)
		});
	}
	return a ? {
		rows: i,
		band: Hq(t, n, r)
	} : null;
}
function Vq(e, t, n) {
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
function Hq(e, t, n) {
	let r = Tl(e), i = Vq(Uq(r, getComputedStyle(r)), t, n);
	for (let e = r.parentElement; e !== null; e = e.parentElement) {
		let r = getComputedStyle(e);
		(t ? r.overflowX : r.overflowY) !== "visible" && (i = Gq(i, Vq(Uq(e, null), t, n)));
	}
	return i = Gq(i, Vq({
		left: 0,
		top: 0,
		right: window.innerWidth,
		bottom: window.innerHeight
	}, t, n)), Kq(e, i, t, n);
}
function Uq(e, t) {
	let n = e.getBoundingClientRect(), r = n.left + e.clientLeft, i = n.top + e.clientTop;
	return {
		left: r + Wq(t?.paddingLeft),
		top: i + Wq(t?.paddingTop),
		right: r + e.clientWidth - Wq(t?.paddingRight),
		bottom: i + e.clientHeight - Wq(t?.paddingBottom)
	};
}
function Wq(e) {
	let t = e === void 0 ? NaN : parseFloat(e);
	return Number.isFinite(t) ? t : 0;
}
function Gq(e, t) {
	return {
		start: Math.max(e.start, t.start),
		end: Math.min(e.end, t.end)
	};
}
function Kq(e, t, n, r) {
	let i = t.start;
	for (let t of e.querySelectorAll(Mq)) {
		let e = Vq(t.getBoundingClientRect(), n, r);
		e.start <= i + Pq && e.end > i && getComputedStyle(t).position === "sticky" && (i = e.end);
	}
	return {
		start: i,
		end: t.end
	};
}
function qq(e, t) {
	for (let n of e) if (Yq(n, t)) return n.key;
	return null;
}
function Jq(e, t) {
	for (let n = e.length - 1; n >= 0; n--) if (Yq(e[n], t)) return e[n].key;
	return null;
}
function Yq(e, t) {
	return e.key.length > 0 && e.end > t.start + Pq && e.start < t.end - Pq;
}
//#endregion
//#region src/items/item-rows.ts
function Xq(e, t, n) {
	return {
		itemOf: (e) => t.getItemValue(e),
		itemsOf: (e) => n.itemsOf(e),
		readPath: KD,
		renderVariant: (n, r, i) => {
			let a = e.getVariantTemplate(r, i), o = t.getItemScope(n);
			return a === void 0 || o === void 0 ? null : t.renderFromTemplate(a, o.item, t.getAncestorStack(n));
		},
		isKeyTarget: (e) => Au(e) !== null,
		cellsOf: (e) => {
			let t = e.closest(I);
			return t !== null && zu(t) ? Hu(t, e) : [];
		},
		moveCursor: (e, t) => ed(e, t ?? null)
	};
}
//#endregion
//#region src/items/items-template-renderer.ts
var Zq = class {
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
		let c = this.metadata.getItemsTemplateMetadata(e), l = c?.itemWrapperElementName ? eJ(o, c.itemWrapperElementName, c.itemWrapperClassName ?? null, c.itemWrapperRole ?? null) : o;
		l !== o && this.moveItemScope(o, l), tJ(l, n, t);
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
		let i = $q(r.item, t, n);
		i !== r.item && this.itemStackByRoot.set(e, {
			scopeComponentId: r.scopeComponentId,
			item: i
		});
	}
	renderFromTemplate(e, t, n = []) {
		let r = e.content.cloneNode(!0).firstElementChild;
		if (r === null) return s("template is empty.", { item: t }), null;
		let i = {
			scopeComponentId: D(r),
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
			Qq(n, e) && this.applyBoundAttribute(i, n, e, t);
		}
	}
	findTranslatableRowBindings() {
		let e = [];
		for (let t of this.metadata.metadata.bindings) {
			let n = this.metadata.getPropertyDefinition(t.propertyId);
			if (n === void 0 || typeof t.itemTemplate != "string" || !this.metadata.isTranslatable(t)) continue;
			let r = E(t.bindingId);
			e.push([t, `[${Ye}${Li(n.propertyName)}="${w(r)}"]`]);
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
		let r = oJ(t, n.templateKeyPropertyName);
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
		i !== void 0 && !HD(e, i.itemTemplateParameters, n) && this.applyBoundAttribute(e, i, n);
	}
	applyBoundAttribute(e, t, n, r) {
		let i = E(t.bindingId), a = this.metadata.getPropertyDefinition(t.propertyId);
		if (a === void 0) return;
		let o = t.itemTemplate === null || t.itemTemplate === void 0 ? this.state.has(t, []) ? {
			ok: !0,
			value: this.state.get(t, [])
		} : { ok: !1 } : VD(n, t.itemTemplate, t.itemTemplateParameters);
		if (!o.ok) {
			t.optional !== !0 && !this.unresolved.has(i) && (this.unresolved.add(i), s("item binding value could not be resolved; the item's path stops short of the property.", {
				binding: t,
				stack: n
			}));
			return;
		}
		let c = "scope" in o ? o.scope : void 0, l = o.value ?? t.fallbackValue;
		if (r !== void 0 && !r(l)) return;
		let u = _s(l, () => this.metadata.isTranslatable(t) && !UD(c)), d = E(t.componentId), f = e.closest(this.componentSelector(d));
		if (f === null) {
			s("item binding component root was not found in the cloned template.", { binding: t });
			return;
		}
		let p = {
			componentId: d,
			propertyId: t.propertyId,
			propertyName: a.propertyName,
			dynamicParameters: [],
			component: f,
			definition: a,
			address: {
				component: {
					id: d,
					dynamicParameters: []
				},
				property: a.propertyName
			},
			bindingId: i,
			bindingSelector: null
		};
		for (let t of a.operations) {
			let n = Bi(f, t, () => [e])[0] ?? null;
			if (n === null) continue;
			let r = this.extensions.converters.convert(t.converter, u);
			this.operations.apply({
				resolved: p,
				operation: t,
				target: n,
				value: u,
				convertedValue: r,
				local: !1
			});
		}
	}
	componentSelector(e) {
		let t = this.componentSelectors.get(e);
		return t === void 0 && (t = `[${ie}="${e}"]`, this.componentSelectors.set(e, t)), t;
	}
};
function Qq(e, t) {
	for (let n of e.itemTemplateParameters ?? []) {
		let e = E(n.componentId);
		if (e > 0 && !t.some((t) => t.scopeComponentId === e)) return !1;
	}
	return !0;
}
function $q(e, t, n) {
	if (t.length === 0) return n;
	let r = e;
	for (let n = 0; n < t.length - 1; n++) {
		let i = t[n], a = i.kind === "property" ? qD(r, i.name) : QD(r, i.key);
		if (!a.ok) return e;
		r = a.value;
	}
	if (typeof r != "object" || !r) return e;
	let i = t[t.length - 1];
	if (i.kind === "element") return $D(r, i.key, n), e;
	let a = r;
	return a[YD(a, i.name)] = n, e;
}
function eJ(e, t, n, r) {
	let i = document.createElement(t);
	return n !== null && (i.className = n), r !== null && r.length > 0 && i.setAttribute("role", r), i.appendChild(e), i;
}
function tJ(e, t, n) {
	e.setAttribute(y, t), aJ(e, n), rJ(e, n);
}
var nJ = [
	["CanSelect", se],
	["CanDrag", ce],
	["CanRemove", le],
	["CanRename", ue],
	["CanShowContextMenu", de]
];
function rJ(e, t) {
	for (let [n, r] of nJ) {
		let i = qD(t, n);
		e.toggleAttribute(r, i.ok && i.value === !1);
	}
}
function iJ(e, t) {
	let n = e.getAttribute(y), r = e.closest(`[${b}]`);
	if (rJ(e, t), n !== null) for (let i of e.querySelectorAll(`[${y}="${w(n)}"]`)) i.closest("[data-ui-items-host]") === r && rJ(i, t);
}
function aJ(e, t) {
	let n = qD(t, "Group");
	n.ok && typeof n.value == "string" ? e.setAttribute(Rt, n.value) : e.removeAttribute(Rt);
}
function oJ(e, t) {
	if (t == null || t.trim().length === 0) return null;
	let n = qD(e, t);
	return !n.ok || n.value === null || n.value === void 0 ? null : typeof n.value == "string" ? n.value : String(n.value);
}
//#endregion
//#region src/items/items-rule-watcher.ts
var sJ = "Group", cJ = class {
	options;
	dragged = null;
	deferred = /* @__PURE__ */ new Map();
	drawnByHost = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, e.propertyPatchEngine.addValueChangeHandler((e) => this.handleItemValueChange(e));
		for (let t of e.metadata.metadata.itemsFilterSort) {
			let n = E(t.componentId), r = [...t.filters, ...t.sorts], i = () => this.syncComponentHosts(n);
			for (let t of r) t.source !== null && t.source !== void 0 && e.reactiveSources.watch(t.source, i);
		}
		e.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), e.root.addEventListener("dragend", () => this.land(), !0), V(e.root, `[${Vt}="${Ht}"]`, { attributeFilter: [dt] }, (e) => {
			for (let t of e) {
				let e = Oa(t);
				e !== null && this.syncComponentHosts(e);
			}
		}), V(e.root, `[${Gt}="windowed"]`, { attributeFilter: [an] }, (e) => {
			for (let t of e) {
				let e = Oa(t);
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
			for (let [t, n] of e) t.isConnected && iU(t, n, this.options);
		});
	}
	handleItemValueChange(e) {
		if (e.dynamicParameters.length === 0) return;
		let t = this.options.metadata.getBindingByComponentAndPropertyId(E(e.reference.componentId), e.reference.propertyId), n = t === void 0 ? null : ZD(t);
		if (n === null) return;
		let r = this.resolveItemRoots(e, n);
		for (let t of r) this.applyItemValue(t, n, e.value);
		r.length === 0 && this.applyVirtualizedItemValue(e, n);
	}
	applyVirtualizedItemValue(e, t) {
		let n = e.dynamicParameters[e.dynamicParameters.length - 1];
		if (typeof n == "string") for (let r of this.options.root.querySelectorAll(`[${b}]`)) {
			if (vD(r) !== "virtualized") continue;
			let i = r.closest(C);
			i === null || !this.drawsPatchedComponent(i, E(e.reference.componentId), t) || !lJ(i, e.dynamicParameters) || this.options.virtualization.updateValue(r, n, t.steps, e.value) && this.redrawsVirtualized(D(i), t) && this.sync(r, D(i));
		}
	}
	drawsPatchedComponent(e, t, n) {
		let r = `${D(e)}:${n.scopeComponentId}:${t}`, i = this.drawnByHost.get(r);
		if (i !== void 0) return i;
		let a = !1;
		for (let r of e.querySelectorAll(":scope > template")) {
			let e = r.content.firstElementChild;
			if (e !== null && (a = n.scopeComponentId > 0 ? D(e) === n.scopeComponentId : D(e) === t || e.querySelector(`[data-ui-id="${t}"]`) !== null, a)) break;
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
		iU(e, t, this.options);
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
		return typeof t == "string" ? [...this.options.root.querySelectorAll(`[${y}="${w(t)}"]`)].filter((t) => this.isItemRoot(t) && va(t, e)) : [];
	}
	applyItemValue(e, t, n) {
		let r = e.closest(`[${b}]`), i = r === null ? null : Oa(r);
		if (r !== null && i !== null && vD(r) === "virtualized") {
			let a = e.getAttribute(y);
			if (a === null || !this.options.virtualization.updateValue(r, a, t.steps, n)) return;
			e.isConnected && this.restampAbilities(e, t), this.redrawsVirtualized(i, t) && this.sync(r, i);
			return;
		}
		this.options.renderer.updateItemValue(e, t.steps, n);
		let a = uJ(sJ, t);
		a && aJ(e, this.options.renderer.getItemValue(e)), this.restampAbilities(e, t), r !== null && i !== null && (!a && !this.feedsRule(i, t) || this.sync(r, i));
	}
	restampAbilities(e, t) {
		nJ.some(([e]) => uJ(e, t)) && iJ(e, this.options.renderer.getItemValue(e));
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
		if (this.options.templates.getGroupTemplate(e) !== void 0 && uJ(sJ, t)) return !0;
		let n = this.options.metadata.getItemsFilterSortMetadata(e);
		return n === void 0 ? !1 : n.filters.some((e) => uJ(e.itemProperty, t)) || n.sorts.some((e) => uJ(e.itemProperty, t));
	}
	syncComponentHosts(e) {
		for (let t of this.options.root.querySelectorAll(`[${b}]`)) {
			let n = Oa(t);
			n === e && this.sync(t, n);
		}
	}
};
function lJ(e, t) {
	let n = _a(e, ga(e));
	return t.length === n.length + 1 && n.every((e, n) => String(e ?? "") === String(t[n] ?? ""));
}
function uJ(e, t) {
	let n = t.ruleSegments.join(".");
	return n.length === 0 || e === n || e.startsWith(`${n}.`);
}
//#endregion
//#region src/items/table-row-indices.ts
var dJ = "ui-table", fJ = "ui-table--no-header";
function pJ(e, t, n) {
	let r = e.parentElement, i = r?.parentElement ?? null;
	if (r === null || i === null || !r.classList.contains("ui-table__scroll") || !i.classList.contains(dJ)) return;
	let a = [], o = [], s = !1;
	for (let t of r.children) t === e ? s = !0 : t.getAttribute("role") === "row" && !(t === r.firstElementChild && i.classList.contains(fJ)) && (s ? o : a).push(t);
	a.forEach((e, t) => mJ(e, t));
	for (let [e, n] of t) mJ(e, a.length + n);
	n !== null && o.forEach((e, t) => mJ(e, a.length + n + t)), hJ(i, "aria-rowcount", n === null ? "-1" : String(a.length + n + o.length));
}
function mJ(e, t) {
	hJ(e, "aria-rowindex", String(t + 1));
}
function hJ(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/items/items-window-engine.ts
var gJ = 50, _J = 1, vJ = .5, yJ = 60, bJ = "--ui-window-look", xJ = "--ui-window-row", SJ = "--ui-window-tile", CJ = 3, wJ = class {
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
			if (this.layout(t), PJ(t) === 0) {
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
		let t = bD(e, en);
		if (t !== null && GG(e) && xD(e, "data-ui-window-more-after")) {
			Ol(e, Math.max(0, this.windowBottom(e, t) - Dl(e).height));
			return;
		}
		t !== null && t !== 0 && Ol(e, xD(e, "data-ui-window-more-after") ? t * this.getState(e).itemSize : e.scrollHeight);
	}
	windowBottom(e, t) {
		let n = NJ(e), r = this.getState(e).itemSize, i = n.length === 0 ? 0 : Al(n[n.length - 1]).bottom - Al(n[0]).top;
		return t * r + (i > 0 ? i : n.length * r);
	}
	sync(e) {
		if (e.length !== 0) for (let t of this.hosts()) e.some((e) => e.contains(t) || t.contains(e)) && (this.layout(t), this.getState(t).pending || this.realign(t));
	}
	realign(e) {
		let t = bD(e, en), n = NJ(e);
		if (t === null || n.length === 0 || e.hasAttribute("data-ui-window-paged")) return;
		let r = this.getState(e), i = Dl(e), a = Math.floor(i.top / r.itemSize);
		Math.ceil((i.top + i.height) / r.itemSize) >= t && a <= t + n.length || this.revealWindow(e);
	}
	reconsider() {
		for (let e of this.hosts()) this.considerRequest(e);
	}
	async requestOffsetAsync(e, t) {
		vD(e) === "windowed" && await this.requestAsync(e, "Offset", Math.max(0, Math.floor(t)), null, !1);
	}
	hosts() {
		return [...this.root.querySelectorAll(`[${b}][${Gt}="windowed"]`)];
	}
	handleScroll(e) {
		let t = El(e.target);
		if (t === null || vD(t) !== "windowed" || t.hasAttribute("data-ui-window-paged")) return;
		let n = this.getState(t);
		n.scheduled === 0 && (this.considerRequest(t), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.considerRequest(t);
		}, yJ));
	}
	considerRequest(e) {
		let t = this.getState(e);
		if (t.pending) {
			t.restless = !0;
			return;
		}
		if (e.hasAttribute("data-ui-window-paged") && PJ(e) > 0) return;
		let n = NJ(e);
		if (n.length === 0) {
			this.requestAsync(e, "Start", 0, null, !1);
			return;
		}
		let r = bD(e, en), i = xD(e, nn), a = xD(e, rn);
		if (r !== null) {
			let o = this.windowSize(e), s = Dl(e), c = Math.max(1, Math.round(s.height * _J / t.itemSize), Math.floor(o * vJ)), l = Math.floor(s.top / t.itemSize), u = Math.ceil((s.top + s.height) / t.itemSize);
			if (u < r || l > r + n.length) {
				this.requestAsync(e, "Offset", this.landingOffset(e, l, o), null, !1);
				return;
			}
			if (l - c <= r && i) {
				this.requestAsync(e, "Before", 0, FJ(n[0]), !0);
				return;
			}
			if (u + c >= r + n.length && a) {
				this.requestAsync(e, "After", 0, FJ(n[n.length - 1]), !0);
				return;
			}
			return;
		}
		let o = Dl(e), s = Math.max(1, o.height * _J), c = o.contentHeight - o.top - o.height;
		if (o.top <= s && i) {
			this.requestAsync(e, "Before", 0, FJ(n[0]), !0);
			return;
		}
		c <= s && a && this.requestAsync(e, "After", 0, FJ(n[n.length - 1]), !0);
	}
	landingOffset(e, t, n) {
		let r = Math.max(0, t - Math.floor(n / 4)), i = bD(e, tn);
		return i === null ? r : Math.min(r, Math.max(0, i - n));
	}
	async requestAsync(e, t, n, r, i) {
		let a = Oa(e);
		if (a === null) {
			s("a windowed items host is not inside an addressable component.", e);
			return;
		}
		if (r === null && (t === "Before" || t === "After")) return;
		let o = this.getState(e);
		o.pending = !0;
		let c = e.closest(C);
		e.setAttribute(Zt, t.toLowerCase()), c?.setAttribute(Zt, t.toLowerCase()), e.setAttribute("aria-busy", "true"), t === "After" && bD(e, "data-ui-window-total") === null && EJ(e) && (YH(e, JH, CJ * this.rowSize(e)), DJ(e, o));
		let l = bD(e, en) === null, u = l && t === "Before" ? AJ(e) : null;
		try {
			await this.options.requestWindow({
				componentId: a,
				dynamicParameters: IJ(e),
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
			o.pending = !1, e.removeAttribute(Zt), c?.removeAttribute(Zt), e.removeAttribute("aria-busy"), YH(e, JH, 0), this.layout(e), u !== null && MJ(e, u), o.restless || l && kJ(e, t, r) ? (o.restless = !1, this.considerRequest(e)) : this.realign(e);
		}
	}
	layout(e) {
		let t = this.getState(e), n = NJ(e), r = bD(e, tn), i = bD(e, en);
		if (pJ(e, n.map((e, t) => [e, (i ?? 0) + t]), r), e.hasAttribute("data-ui-window-paged")) {
			YH(e, "top", 0), YH(e, qH, 0);
			return;
		}
		if (n.length > 0) {
			let e = Al(n[n.length - 1]).bottom - Al(n[0]).top;
			if (e > 0) {
				let r = TJ(n), i = Math.ceil(n.length / r);
				t.itemSize = Math.max(1, Math.round(e / (i * r))), t.skeletonRow = i > 1 ? (Al(n[n.length - 1]).top - Al(n[0]).top) / (i - 1) : e, t.skeletonTile = r > 1 ? Al(n[1]).left - Al(n[0]).left : null;
			}
		}
		let a = r === null || i === null ? 0 : i * t.itemSize, o = r === null || i === null ? 0 : Math.max(0, r - i - n.length) * t.itemSize;
		YH(e, "top", a), YH(e, qH, o), DJ(e, t), MG(e);
	}
	rowSize(e) {
		let t = this.getState(e);
		return t.skeletonRow > 0 ? OJ(t.skeletonRow) : t.itemSize;
	}
	windowSize(e) {
		let t = bD(e, $t);
		return t !== null && t > 0 ? t : gJ;
	}
	getState(e) {
		let t = this.states.get(e);
		return t === void 0 && (t = {
			pending: !1,
			restless: !1,
			itemSize: 32,
			scheduled: 0,
			skeletonRow: 0,
			skeletonTile: null
		}, this.states.set(e, t)), t;
	}
};
function TJ(e) {
	let t = Al(e[0]).top, n = 1;
	for (; n < e.length && Al(e[n]).top === t;) n++;
	return n;
}
function EJ(e) {
	return getComputedStyle(e).getPropertyValue(bJ).trim() === "skeleton";
}
function DJ(e, t) {
	if (t.skeletonRow <= 0) return;
	let n = `${OJ(t.skeletonRow)}px`, r = t.skeletonTile !== null && t.skeletonTile > 0 ? `${OJ(t.skeletonTile)}px` : "";
	for (let t of e.querySelectorAll(`:scope > [${Xt}]`)) {
		let e = t.style;
		e.getPropertyValue(xJ) !== n && e.setProperty(xJ, n), e.getPropertyValue(SJ) !== r && (r.length === 0 ? e.removeProperty(SJ) : e.setProperty(SJ, r));
	}
}
function OJ(e) {
	return Math.round(e * 100) / 100;
}
function kJ(e, t, n) {
	let r = NJ(e), i = t === "Before" ? r[0] : t === "After" ? r[r.length - 1] : void 0;
	return i !== void 0 && FJ(i) !== n;
}
function AJ(e) {
	let t = NJ(e)[0];
	return t === void 0 ? null : {
		row: t,
		at: jJ(e, t)
	};
}
function jJ(e, t) {
	return Al(t).top + Dl(e).top;
}
function MJ(e, t) {
	if (!t.row.isConnected) return;
	let n = jJ(e, t.row) - t.at;
	n !== 0 && Ol(e, Dl(e).top + n);
}
function NJ(e) {
	return [...e.children].filter((e) => e.hasAttribute(y));
}
function PJ(e) {
	return NJ(e).length;
}
function FJ(e) {
	return e.getAttribute(y);
}
function IJ(e) {
	let t = e.closest(C);
	return t === null ? [] : _a(t, ga(t));
}
//#endregion
//#region src/items/items-composite-renderer.ts
var LJ = [
	ie,
	ae,
	oe
];
function RJ(e, t, n, r, i, a, o) {
	let c = document.createElement(e.itemElementName);
	c.className = e.itemClassName, zJ(c, e.itemRole);
	let l = VJ(c, e, t, a);
	l !== 0 && o.populateElement(c, n, l, i);
	for (let l of e.slots) {
		let e = BJ(l, t, n, a);
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
		d.className = l.wrapperClassName, zJ(d, l.wrapperRole);
		for (let [e, t] of Object.entries(l.wrapperAttributes ?? {})) d.setAttribute(e, t);
		d.appendChild(u), tJ(d, r, n), c.appendChild(d);
	}
	return tJ(c, r, n), o.registerItemScope(c, l, n), c;
}
function zJ(e, t) {
	t != null && t.length > 0 && e.setAttribute("role", t);
}
function BJ(e, t, n, r) {
	let i = oJ(n, e.variantKeyPropertyName);
	if (i !== null && i.length > 0) {
		let n = r.getVariantTemplate(t, `${e.variantKey}:${i}`);
		if (n !== void 0) return n;
	}
	return r.getVariantTemplate(t, e.variantKey);
}
function VJ(e, t, n, r) {
	let i = t.hostSlotVariantKey;
	if (i == null || i.length === 0) return 0;
	let a = r.getVariantTemplate(n, i)?.content.firstElementChild ?? null;
	if (a === null) return s("composite item host slot template was not found.", {
		componentId: n,
		hostSlotVariantKey: i
	}), 0;
	for (let t of LJ) {
		let n = a.getAttribute(t);
		n !== null && e.setAttribute(t, n);
	}
	for (let t of Array.from(a.attributes)) t.name.startsWith("data-ui-bind-") && e.setAttribute(t.name, t.value);
	return e instanceof HTMLElement && (e.style.alignSelf = "stretch", e.style.justifySelf = "stretch"), D(a);
}
//#endregion
//#region src/items/items-row-renderer.ts
function HJ(e, t, n, r, i) {
	let a = i.metadata.getItemsTemplateMetadata(e), o = a?.composite;
	if (o == null) return UJ(i.renderer.renderItem(e, t, n, r), a);
	let s = RJ(o, e, t, n, r, i.templates, i.renderer);
	return s !== null && a?.rowDecorator && i.renderer.decorateRow(a.rowDecorator, s, t, n, e, r), UJ(s, a);
}
function UJ(e, t) {
	return e === null ? null : (t?.announcesSelection === !0 && !e.hasAttribute("aria-selected") && e.setAttribute("aria-selected", "false"), bs(e), e);
}
//#endregion
//#region src/items/items-virtualization-engine.ts
var WJ = 6, GJ = 60, KJ = class {
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
		return r === void 0 || i < 0 || a < 0 ? null : r.slice(Math.min(i, a), Math.max(i, a) + 1).filter((e) => XJ(e.entry) === !1).map((e) => e.entry.key);
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
		if (!eY(e) && !QJ(e)) return a.element;
		let o = getComputedStyle(e), s = rY(o), c = r.projected.map((e) => this.pitchOf(r, e) + s), l = eY(e) ? tY(r.projected, c, r.across) : null, u = l === null ? i : $J(l.starts, i), d = l?.pitches ?? c, f = iY(o.paddingTop) + aY(d, 0, u), p = f + d[u] - s, m = Dl(e), h = n === "start" || n === "nearest" && f < m.top ? f : n === "end" || p > m.top + m.height ? p - m.height : null;
		return h !== null && Ol(e, Math.max(0, h)), this.layout(e, r), a.element;
	}
	sync(e) {
		let t = this.getState(e);
		if (t === null) return;
		let n = GG(e) && qG(e), r = t.projected;
		this.project(e, t), this.keepCursorShown(e, t, r), this.layout(e, t), n && !qG(e) && (Ol(e, e.scrollHeight), this.layout(e, t));
	}
	refill(e, t) {
		let n = this.getState(e);
		if (n === null) return [];
		let r = new Map(n.entries.map((e) => [e.key, e])), i = [], a = [];
		for (let { key: n, item: o } of t) {
			let t = r.get(n);
			if (r.delete(n), t !== void 0 && Af(t.item, o)) {
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
		let n = md(t);
		t.remove(), hd(e, null, n);
	}
	keepCursorShown(e, t, n) {
		let r = pd(e), i = t.entries.find((e) => e.element?.hasAttribute("data-ui-row-focus") === !0) ?? null, a = i?.key ?? (r === null ? null : _d(r));
		if (r === null || a === null) return;
		let o = /* @__PURE__ */ new Set();
		for (let e of t.projected) e.header || o.add(e.entry.key);
		if (o.has(a)) return;
		let s = n.filter((e) => !e.header).map((e) => e.entry), c = s.findIndex((e) => e.key === a), l = c < 0 ? void 0 : s.slice(c + 1).find((e) => o.has(e.key)) ?? s.slice(0, c).reverse().find((e) => o.has(e.key));
		if (i?.element?.removeAttribute(Pe), l === void 0) {
			r.removeAttribute(Fe), r.removeAttribute("aria-activedescendant");
			return;
		}
		l.element instanceof HTMLElement ? Lu(r, G(e).filter((e) => e instanceof HTMLElement), l.element, null, !1) : r.setAttribute(Fe, l.key);
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
		let i = n.entries[r].element, a = pd(e), o = G(e).filter((e) => e instanceof HTMLElement), s = a !== null && i instanceof HTMLElement ? ud(a, o, i) : null;
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
		return i === null || a === void 0 ? !1 : (a.item = $q(a.item, n, r), n.length === 0 && a.element !== null && (this.dropRow(e, a.element), a.element = null), !0);
	}
	project(e, t) {
		let n = this.options.metadata.getItemsFilterSortMetadata(t.componentId), r = tO(e), i = this.options.templates.getGroupTemplate(t.componentId), a = aO(n, this.options.state, r), o = t.entries;
		if ((n !== void 0 && n.filters.length > 0 || (r?.filters ?? []).length > 0) && (o = o.filter((e) => rO(n, e.item, this.options.state, r))), !(i !== void 0 && o.some((e) => ZJ(e) !== ""))) {
			a.length > 0 && (o = [...o].sort((e, t) => sO(e.item, t.item, a))), t.projected = o.map((e) => ({
				entry: e,
				header: !1
			}));
			return;
		}
		let { buckets: s, order: c } = UH(o, ZJ, t.groupOrder);
		t.groupOrder = c;
		let l = [];
		for (let e of c) {
			let t = s.get(e);
			a.length > 0 && (t = [...t].sort((e, t) => sO(e.item, t.item, a))), e !== "" && l.push({
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
		let t = El(e.target);
		t !== null && vD(t) === "virtualized" && this.relayout(t);
	}
	handleResize(e) {
		for (let t of e) {
			let e = t.target;
			e.isConnected && vD(e) === "virtualized" ? window.requestAnimationFrame(() => this.relayout(e)) : this.resizes?.unobserve(e);
		}
	}
	relayout(e) {
		let t = this.getState(e);
		t !== null && t.scheduled === 0 && (this.layout(e, t), t.scheduled = window.setTimeout(() => {
			t.scheduled = 0, this.layout(e, t);
		}, GJ));
	}
	layout(e, t) {
		let n = t.projected, r = getComputedStyle(e), i = rY(r), a = n.map((e) => this.pitchOf(t, e) + i), o = n.length, s = t.across, c = eY(e) ? tY(n, a, s) : null, l = c?.pitches ?? a, u = l.length, d = 0, f = u;
		if ((c !== null || QJ(e)) && u > 0) {
			let i = iY(r.paddingTop), a = Dl(e), o = JJ(e, t, n, l, s, a.top - i, i), c = o + a.height, p = 0;
			d = u;
			for (let e = 0; e < u; e++) {
				let t = p + l[e];
				if (d === u && t > o && (d = e), p >= c) {
					f = e;
					break;
				}
				p = t;
			}
			d === u && (d = Math.max(0, u - 1)), d = Math.max(0, d - WJ), f = Math.min(u, f + WJ);
		}
		let p = c === null ? d : c.starts[d] ?? o, m = c === null ? f : f < u ? c.starts[f] : o, h = this.options.renderer.getAncestorStack(e), g = [], _ = [], v = -1, ee = !1;
		for (let r = 0; r < o; r++) {
			let i = n[r];
			i.header || v++;
			let a = r >= p && r < m, o = (i.header ? t.headers.get(ZJ(i.entry)) ?? null : i.entry)?.element ?? null;
			if (!a) {
				o !== null && (this.dropRow(e, o), YJ(t, i, null), ee = !0);
				continue;
			}
			if (o !== null) {
				i.header && KH(o, i.entry.key), g.push(o), i.header || _.push([o, v]);
				continue;
			}
			let s = i.header ? this.renderHeader(t, i.entry, h) : this.renderRow(t, i.entry, h);
			s !== null && (i.header || gd(e, s), YJ(t, i, s), g.push(s), i.header || _.push([s, v]), ee = !0);
		}
		let te = new Set(g);
		for (let n of t.entries) n.element !== null && !te.has(n.element) && (this.dropRow(e, n.element), n.element = null, ee = !0);
		for (let t of G(e)) te.has(t) || (this.dropRow(e, t), ee = !0);
		for (let t of e.querySelectorAll(`:scope > [${It}]`)) te.has(t) || (t.remove(), ee = !0);
		for (let e of t.headers.values()) e.element !== null && !te.has(e.element) && (e.element = null);
		let ne = aY(l, 0, d), re = aY(l, f, u);
		XH(e, [...g, ...PD(FD(e))]), YH(e, "top", ne > 0 ? ne - i : 0), YH(e, qH, re > 0 ? re - i : 0), ID(e, t.componentId, this.options.templates, this.options.renderer, o > 0), pJ(e, _, v + 1), (ee || t.first !== p || t.last !== m) && (t.first = p, t.last = m, this.options.dom.invalidate(e)), t.laidOut = n, t.pitches = l, t.laidAcross = s, t.firstLine = d, t.lastLine = f, this.measure(t, n, p, m), c !== null && (t.across = nY(e, r, t.tileWidth) ?? t.across, t.across !== s && this.layout(e, t));
	}
	renderRow(e, t, n) {
		return HJ(e.componentId, t.item, t.key, n, this.options);
	}
	renderHeader(e, t, n) {
		let r = this.options.templates.getGroupTemplate(e.componentId);
		return r === void 0 ? null : GH(r, this.options.renderer, t.item, t.key, n);
	}
	measure(e, t, n, r) {
		let i = 0;
		for (let a = n; a < r && a < t.length; a++) {
			let n = t[a], r = n.header ? e.headers.get(ZJ(n.entry)) : n.entry, o = r?.element;
			if (r == null || o == null) continue;
			let s = Al(o);
			s.height <= 0 || (qJ(n.header ? e.headerHeights : e.itemHeights, r.height, s.height), r.height = s.height, n.header || (i = Math.max(i, s.width)));
		}
		i > 0 && (e.tileWidth = i), e.itemHeights.count > 0 && (e.itemEstimate = e.itemHeights.sum / e.itemHeights.count), e.headerHeights.count > 0 && (e.headerEstimate = e.headerHeights.sum / e.headerHeights.count);
	}
	pitchOf(e, t) {
		return t.header ? e.headers.get(ZJ(t.entry))?.height ?? e.headerEstimate : t.entry.height ?? e.itemEstimate;
	}
	getState(e) {
		let t = this.states.get(e);
		if (t !== void 0) return t;
		let n = ka(e);
		if (n === null) return s("a virtualized items host is not inside an addressable component.", e), null;
		let r = n.componentId, i = [], a = /* @__PURE__ */ new Map();
		for (let t of G(e)) {
			let e = t.getAttribute(y);
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
function qJ(e, t, n) {
	t === null ? (e.sum += n, e.count++) : e.sum += n - t;
}
function JJ(e, t, n, r, i, a, o) {
	if (t.laidOut !== n || t.laidAcross !== i || t.pitches.length !== r.length || a <= 0) return a;
	let s = 0, c = 0;
	for (let e = 0; e < r.length; e++) {
		let n = e >= t.firstLine && e < t.lastLine ? r[e] : t.pitches[e];
		if (s + n > a) break;
		s += n, c += r[e];
	}
	let l = c - s;
	return Math.abs(l) < .5 ? a : (Ol(e, a + l + o), a + l);
}
function YJ(e, t, n) {
	if (!t.header) {
		t.entry.element = n;
		return;
	}
	let r = ZJ(t.entry), i = e.headers.get(r);
	i === void 0 ? e.headers.set(r, {
		element: n,
		height: null
	}) : i.element = n;
}
function XJ(e) {
	let t = qD(e.item, "CanSelect");
	return t.ok && t.value === !1;
}
function ZJ(e) {
	let t = qD(e.item, "Group");
	return t.ok && typeof t.value == "string" ? t.value : "";
}
function QJ(e) {
	let t = e.parentElement;
	return t !== null && (t.classList.contains("ui-table__scroll") || t.classList.contains("ui-items-view--stack") && t.classList.contains("ui-orientation--vertical"));
}
function $J(e, t) {
	let n = 0;
	for (; n + 1 < e.length && e[n + 1] <= t;) n++;
	return n;
}
function eY(e) {
	return e.parentElement?.classList.contains("ui-items-view--wrap") === !0;
}
function tY(e, t, n) {
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
function nY(e, t, n) {
	let r = e.clientWidth - iY(t.paddingLeft) - iY(t.paddingRight);
	if (n === null || n <= 0 || r <= 0) return null;
	let i = iY(t.columnGap);
	return Math.max(1, Math.floor((r + i + .5) / (n + i)));
}
function rY(e) {
	return iY(e.rowGap);
}
function iY(e) {
	let t = Number.parseFloat(e);
	return Number.isFinite(t) ? t : 0;
}
function aY(e, t, n) {
	let r = 0;
	for (let i = t; i < n; i++) r += e[i];
	return r;
}
//#endregion
//#region src/items/items-template-registry.ts
var oY = "data-ui-template", sY = "default", cY = class {
	dom;
	templateComponentIds = null;
	constructor(e) {
		this.dom = e;
	}
	getTemplate(e, t) {
		let n = t ?? sY, r = this.findTemplate(e, n);
		return r === void 0 ? n === sY ? void 0 : this.getTemplate(e, null) : r;
	}
	getVariantTemplate(e, t) {
		return this.findTemplate(e, t);
	}
	findTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		if (n === null) return;
		let r = n.querySelectorAll(`:scope > template[${oY}]`);
		for (let e of r) if (e.getAttribute(oY) === t) return e;
	}
	isTemplateComponent(e) {
		return this.templateComponentIds ??= lY(this.dom.root), this.templateComponentIds.has(e);
	}
	getEmptyTemplate(e) {
		return this.getMarkedTemplate(e, Nt);
	}
	getGroupTemplate(e) {
		return this.getMarkedTemplate(e, Pt);
	}
	getMarkedTemplate(e, t) {
		return this.dom.findComponent(e, [])?.querySelector(`:scope > template[${t}]`) ?? void 0;
	}
};
function lY(e) {
	let t = /* @__PURE__ */ new Set();
	return gs(e, (n) => {
		if (n !== e) for (let e of n.querySelectorAll(C)) {
			let n = D(e);
			n > 0 && t.add(n);
		}
	}), t;
}
//#endregion
//#region src/items/row-menus.ts
var uY = `:scope > ${`template[${Ee}]`}`, dY = class {
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
			this.components.has(e) && pY(t.item, this.chordSet);
		}), this.chordSet;
	}
	draw(e) {
		if (!e.hasAttribute("data-ui-context-menu-later")) return null;
		this.scan();
		let t = this.drawFrom(e) ?? this.drawAfterRescan(e);
		return e.removeAttribute(Te), t === null ? (s("a row's context menu waits in no template.", { owner: e }), null) : (this.options.drawn(t), t);
	}
	drawAfterRescan(e) {
		return this.scanned = !1, this.scan(), this.drawFrom(e);
	}
	drawFrom(e) {
		let t = e.querySelector(uY);
		if (t !== null) {
			let e = t.content.firstElementChild;
			return t.replaceWith(t.content), e;
		}
		let n = this.shared.get(D(e)), r = n === void 0 ? null : this.options.render(n, e);
		return r !== null && e.appendChild(r), r;
	}
	scanContainer(e, t, n) {
		for (let r of [...e.querySelectorAll("template")]) {
			if (this.taken.has(r)) continue;
			let e = [...t, ...fY(r)];
			if (r.hasAttribute("data-ui-context-menu-template")) {
				this.takeMenu(r, e, n);
				continue;
			}
			let i = r.parentElement === null ? 0 : D(r.parentElement);
			this.scanContainer(r.content, i > 0 ? [...e, i] : e, n ?? r);
		}
	}
	takeMenu(e, t, n) {
		let r = Number(e.getAttribute(Ee)), i = !this.declared.has(r);
		this.taken.add(e), this.declared.add(r), gs(e.content, (e) => {
			if (i) for (let n of e.querySelectorAll(C)) this.components.set(D(n), t), this.menuOf.set(D(n), r);
			for (let t of e.querySelectorAll(`[${Hn}]`)) {
				let e = t.getAttribute("data-ui-shortcut")?.trim() ?? "";
				e.length > 0 && this.writtenChords.add(e);
			}
		}), (e.parentElement?.hasAttribute("data-ui-context-menu-later") !== !0 || n !== null) && (n !== null && n.after(e), Number.isInteger(r) && r > 0 && this.shared.set(r, e));
	}
};
function fY(e) {
	let t = [];
	for (let n = e.parentElement?.closest("[data-ui-items-host]") ?? null; n !== null; n = n.parentElement?.closest("[data-ui-items-host]") ?? null) {
		let e = Oa(n);
		e !== null && t.unshift(e);
	}
	return t;
}
function pY(e, t) {
	let n = qD(e, "Shortcut");
	n.ok && typeof n.value == "string" && n.value.trim().length > 0 && t.add(n.value.trim());
	let r = qD(e, "Items");
	if (r.ok && Array.isArray(r.value)) for (let e of r.value) pY(e, t);
}
//#endregion
//#region src/rendering/theme-colors.ts
function mY(e, t) {
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
var hY = "script[type='application/json'][data-ui-metadata]";
function gY(e = document) {
	let t = e.querySelector(hY);
	if (t === null) return _Y();
	let n = t.textContent?.trim() ?? "";
	if (n.length === 0) return _Y();
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
function _Y() {
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
var vY = "script[type='application/json'][data-ui-hydration]";
function yY(e) {
	return e !== null && (Ho(e.title) || Ho(e.changes));
}
function bY(e = document) {
	let t = e.querySelector(vY)?.textContent?.trim() ?? "";
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
var xY = "reconnecting";
async function SY(e, t, n, r) {
	for (let i = 0;; i++) try {
		return await e();
	} catch (e) {
		if (t()) return s("attaching the runtime failed as the connection dropped again; the reconnect attaches.", e), xY;
		if (i >= n.length) return c("attaching the runtime failed after retrying; giving up.", e), null;
		s("attaching the runtime failed; retrying.", {
			attempt: i + 1,
			error: e
		}), await r(n[i]);
	}
}
//#endregion
//#region src/transport/reader-time-zone.ts
function CY(e = () => Intl.DateTimeFormat().resolvedOptions().timeZone) {
	try {
		let t = e();
		return typeof t == "string" && t.length > 0 ? t : null;
	} catch {
		return null;
	}
}
function wY(e, t, n) {
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
var TY = "/_ne/", EY = 3e3;
function DY(e, t, n) {
	let r = e.getAttribute(Ir);
	if (r === null || !("serviceWorker" in navigator)) return;
	let i = navigator.serviceWorker;
	if (wY(i, t, n), e.hasAttribute("data-ui-service-worker-imported")) return () => kY(i.ready);
	let a = i.register(r, { scope: TY }).then(OY).catch((e) => {
		s("registering the notification service worker failed; notifications are the page's own.", e);
	});
	return () => a;
}
function OY(e) {
	let t = e.installing ?? e.waiting;
	return e.active !== null || t === null ? Promise.resolve(e) : new Promise((n) => {
		t.addEventListener("statechange", () => {
			t.state === "activated" && n(e);
		});
	});
}
function kY(e) {
	return Promise.race([e, new Promise((e) => setTimeout(() => e(void 0), EY))]);
}
//#endregion
//#region src/runtime/reload-guard.ts
var AY = "ne-standard-ui:reloaded-view";
function jY(e, t, n) {
	if (!t) return "no-cookie";
	if (PY(n) === e) return "asked-again";
	try {
		n?.setItem(AY, e);
	} catch {}
	return "reload";
}
function MY(e) {
	try {
		e?.removeItem(AY);
	} catch {}
}
function NY() {
	try {
		return window.sessionStorage;
	} catch {
		return null;
	}
}
function PY(e) {
	try {
		return e?.getItem(AY) ?? null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/runtime/window-id.ts
function FY(e, t) {
	let n = null;
	try {
		n = window.sessionStorage;
	} catch (e) {
		s("session storage is unavailable, so this tab is new on every load.", e);
	}
	return IY(e, {
		memory: n,
		lifecycle: window,
		openChannel: typeof BroadcastChannel == "function" ? (e) => new BroadcastChannel(e) : null,
		rekeyed: t
	});
}
function IY(e, t) {
	let n = t.create ?? HY, r = t.now ?? Date.now, i = t.memory, a = `${e}:claimed`, o = zY(i, e), s = n(), c = o !== null && o.length > 0 && zY(i, a) !== o ? o : n(), l = null, u = 0, d = () => {
		BY(i, e, c), BY(i, a, c);
	}, f = (e) => {
		e?.kind === "ask" && e.id === c && e.from !== s ? LY(l, {
			kind: "held",
			id: c,
			to: e.from,
			by: s,
			at: u
		}) : e?.kind === "held" && e.id === c && e.to === s && (e.at < u || e.at === u && e.by < s) && (c = n(), d(), t.rekeyed(c));
	}, p = () => {
		l = RY(t, e), l?.addEventListener("message", (e) => f(e.data)), u = r(), LY(l, {
			kind: "ask",
			id: c,
			from: s,
			at: u
		});
	};
	return d(), p(), t.lifecycle.addEventListener("pagehide", () => {
		VY(i, a), l?.close(), l = null;
	}), t.lifecycle.addEventListener("pageshow", (e) => {
		e.persisted && (d(), p());
	}), c;
}
function LY(e, t) {
	e?.postMessage(t);
}
function RY(e, t) {
	try {
		return e.openChannel?.(t) ?? null;
	} catch (e) {
		return s("the channel tabs ask for their ids on could not be opened.", e), null;
	}
}
function zY(e, t) {
	try {
		return e?.getItem(t) ?? null;
	} catch (e) {
		return s("reading the tab id failed.", e), null;
	}
}
function BY(e, t, n) {
	try {
		e?.setItem(t, n);
	} catch (e) {
		s("storing the tab id failed.", e);
	}
}
function VY(e, t) {
	try {
		e?.removeItem(t);
	} catch {}
}
function HY() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `tab-${typeof crypto < "u" && typeof crypto.getRandomValues == "function" ? [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16))].map((e) => e.toString(16).padStart(2, "0")).join("") : Math.random().toString(16).slice(2).padEnd(16, "0")}-${performance.now().toString(36).replace(".", "")}`;
}
//#endregion
//#region src/runtime/connection-watch.ts
var UY = 2e3, WY = class {
	root;
	notifications;
	graceMilliseconds;
	grace = null;
	notice = null;
	given = !1;
	constructor(e) {
		this.root = e.root, this.notifications = e.notifications, this.graceMilliseconds = e.graceMilliseconds ?? UY, e.connection.onReconnecting(() => this.reconnecting()), e.connection.onReconnected(() => this.reconnected());
	}
	reconnecting() {
		this.given || this.grace !== null || this.notice !== null || (this.grace = window.setTimeout(() => this.showReconnecting(), this.graceMilliseconds));
	}
	showReconnecting() {
		this.grace = null, this.root.setAttribute(Jr, "reconnecting"), this.notice = this.notifications.show({
			message: O.text("ui.connection.reconnecting"),
			sticky: !0,
			connection: !0
		});
	}
	reconnected() {
		this.given || (this.clear(), this.root.removeAttribute(Jr));
	}
	clear() {
		this.grace !== null && (window.clearTimeout(this.grace), this.grace = null), this.notice !== null && (this.notifications.dismiss(this.notice), this.notice = null);
	}
	lost() {
		this.given = !0, this.clear(), this.root.setAttribute(Jr, "lost");
	}
}, GY = "/_ne/values", KY = 32768;
KY / 4;
var qY = 3e4;
function JY(e) {
	let t = JSON.stringify(e);
	if (t === void 0 || t.length * 3 <= 8192) return null;
	let n = new TextEncoder().encode(t);
	return n.byteLength > 8192 ? n : null;
}
function YY(e) {
	return e?.updates?.some((e) => typeof e.valueToken == "string") === !0;
}
async function XY(e, t = null, n = qY) {
	if (e === void 0 || !YY(e)) return e;
	let r = await Promise.all((e.updates ?? []).map(async (e) => {
		let r = e.valueToken;
		if (typeof r != "string") return e;
		let i = t === null ? "" : `?instance=${encodeURIComponent(t)}`, a = await fetch(`${GY}/${encodeURIComponent(r)}${i}`, {
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
async function ZY(e) {
	let t = await fetch(GY, {
		method: "POST",
		body: e,
		headers: { "Content-Type": "application/json" },
		credentials: "same-origin",
		signal: AbortSignal.timeout(qY)
	});
	if (!t.ok) throw Error(`Staging a large value failed with status ${t.status}.`);
	let n = (await t.json())?.token;
	if (n === void 0 || n.length === 0) throw Error("Staging a large value answered with no token.");
	return n;
}
//#endregion
//#region src/transport/command-dispatcher.ts
var QY = class {
	transport;
	pendingKeys = /* @__PURE__ */ new Set();
	nextRequestId = 1;
	awaited = /* @__PURE__ */ new Map();
	staging = null;
	constructor(e) {
		this.transport = e;
	}
	isPending(e) {
		return this.pendingKeys.has($Y(eX(e)));
	}
	async dispatchAsync(e) {
		let t = eX(e), n = $Y(t);
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
		let t = JY(e.dynamicParameters);
		if (t === null && this.staging === null) return this.transport.processEventAsync(e);
		let n = this.staging, r = t === null ? null : ZY(t), i = () => {}, a = new Promise((e) => {
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
function $Y(e) {
	return e.action === void 0 ? `${JSON.stringify(e.eventId)}:${JSON.stringify(e.dynamicParameters ?? [])}` : `action:${e.action}`;
}
function eX(e) {
	return e.action === void 0 ? {
		eventId: E(e.eventId),
		dynamicParameters: e.dynamicParameters ?? []
	} : {
		eventId: 0,
		action: e.action,
		dynamicParameters: []
	};
}
//#endregion
//#region src/transport/inbound-order.ts
var tX = class {
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
async function nX(e, t) {
	try {
		await e();
	} finally {
		t();
	}
}
//#endregion
//#region src/state/property-state-store.ts
var rX = class {
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
		let i = this.createKey(e, t), a = this.values.get(i), o = a !== void 0 && Af(a.value, n);
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
		let r = iX(e, t);
		for (let e of n) this.forgetRow(r, e), this.forgetUnplaced(ea([...t, e]));
	}
	forgetHost(e, t) {
		this.forgetScope(iX(e, t));
		let n = this.unplaced.get(ea(t));
		for (let e of [...n?.children ?? []]) this.forgetUnplaced(e);
	}
	clear() {
		this.values.clear(), this.scopes.clear(), this.unplaced.clear(), this.unplacedPathByEntry.clear();
	}
	recordRows(e, t) {
		let n = null;
		for (let [r, i] of t.entries()) {
			let t = iX(i.host, i.hostParameters), a = this.rowState(t, i.key);
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
		let n = this.unplacedNode(ea([]), null), r = "";
		for (let e = 1; e <= t.length; e++) r = ea(t.slice(0, e)), n.children.add(r), n = this.unplacedNode(r, ea(t.slice(0, e - 1)));
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
		return `${E(e.componentId)}:${e.propertyId}:${ea(t)}`;
	}
};
function iX(e, t) {
	return `${e}:${ea(t)}`;
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Errors.js
var aX = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(`${e}: Status code '${t}'`), this.statusCode = t, this.__proto__ = n;
	}
}, oX = class extends Error {
	constructor(e = "A timeout occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, sX = class extends Error {
	constructor(e = "An abort occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, cX = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "UnsupportedTransportError", this.__proto__ = n;
	}
}, lX = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "DisabledTransportError", this.__proto__ = n;
	}
}, uX = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "FailedToStartTransportError", this.__proto__ = n;
	}
}, dX = class extends Error {
	constructor(e) {
		let t = new.target.prototype;
		super(e), this.errorType = "FailedToNegotiateWithServerError", this.__proto__ = t;
	}
}, fX = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.innerErrors = t, this.__proto__ = n;
	}
}, pX = class {
	constructor(e, t, n) {
		this.statusCode = e, this.statusText = t, this.content = n;
	}
}, mX = class {
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
var hX = class {
	constructor() {}
	log(e, t) {}
};
hX.instance = new hX();
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/pkg-version.js
var gX = "10.0.11", X = class {
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
function _X(e, t) {
	let n = "";
	return yX(e) ? (n = `Binary data of length ${e.byteLength}`, t && (n += `. Content: '${vX(e)}'`)) : typeof e == "string" && (n = `String data of length ${e.length}`, t && (n += `. Content: '${e}'`)), n;
}
function vX(e) {
	let t = new Uint8Array(e), n = "";
	return t.forEach((e) => {
		n += `0x${e < 16 ? "0" : ""}${e.toString(16)} `;
	}), n.substring(0, n.length - 1);
}
function yX(e) {
	return e && typeof ArrayBuffer < "u" && (e instanceof ArrayBuffer || e.constructor && e.constructor.name === "ArrayBuffer");
}
async function bX(e, t, n, r, i, a) {
	let o = {}, [s, c] = wX();
	o[s] = c, e.log(Y.Trace, `(${t} transport) sending data. ${_X(i, a.logMessageContent)}.`);
	let l = yX(i) ? "arraybuffer" : "text", u = await n.post(r, {
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
function xX(e) {
	return e === void 0 ? new CX(Y.Information) : e === null ? hX.instance : e.log === void 0 ? new CX(e) : e;
}
var SX = class {
	constructor(e, t) {
		this._subject = e, this._observer = t;
	}
	dispose() {
		let e = this._subject.observers.indexOf(this._observer);
		e > -1 && this._subject.observers.splice(e, 1), this._subject.observers.length === 0 && this._subject.cancelCallback && this._subject.cancelCallback().catch((e) => {});
	}
}, CX = class {
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
function wX() {
	let e = "X-SignalR-User-Agent";
	return Z.isNode && (e = "User-Agent"), [e, TX(gX, EX(), OX(), DX())];
}
function TX(e, t, n, r) {
	let i = "Microsoft SignalR/", a = e.split(".");
	return i += `${a[0]}.${a[1]}`, i += ` (${e}; `, i += t && t !== "" ? `${t}; ` : "Unknown OS; ", i += `${n}`, i += r ? `; ${r}` : "; Unknown Runtime Version", i += ")", i;
}
/*#__PURE__*/ function EX() {
	if (Z.isNode) switch (process.platform) {
		case "win32": return "Windows NT";
		case "darwin": return "macOS";
		case "linux": return "Linux";
		default: return process.platform;
	}
	else return "";
}
/*#__PURE__*/ function DX() {
	if (Z.isNode) return process.versions.node;
}
function OX() {
	return Z.isNode ? "NodeJS" : "Browser";
}
function kX(e) {
	return e.stack ? e.stack : e.message ? e.message : `${e}`;
}
function AX() {
	if (typeof globalThis < "u") return globalThis;
	if (typeof self < "u") return self;
	if (typeof window < "u") return window;
	if (typeof global < "u") return global;
	throw Error("could not find global");
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js
var jX = class extends mX {
	constructor(t) {
		if (super(), this._logger = t, typeof fetch > "u" || Z.isNode) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._jar = new (t("tough-cookie")).CookieJar(), this._fetchType = typeof fetch > "u" ? t("node-fetch") : fetch, this._fetchType = t("fetch-cookie")(this._fetchType, this._jar);
		} else this._fetchType = fetch.bind(AX());
		if (typeof AbortController > "u") {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._abortControllerType = t("abort-controller");
		} else this._abortControllerType = AbortController;
	}
	async send(e) {
		if (e.abortSignal && e.abortSignal.aborted) throw new sX();
		if (!e.method) throw Error("No method defined.");
		if (!e.url) throw Error("No url defined.");
		let t = new this._abortControllerType(), n;
		e.abortSignal && (e.abortSignal.onabort = () => {
			t.abort(), n = new sX();
		});
		let r = null;
		if (e.timeout) {
			let i = e.timeout;
			r = setTimeout(() => {
				t.abort(), this._logger.log(Y.Warning, "Timeout from HTTP request."), n = new oX();
			}, i);
		}
		e.content === "" && (e.content = void 0), e.content && (e.headers = e.headers || {}, yX(e.content) ? e.headers["Content-Type"] = "application/octet-stream" : e.headers["Content-Type"] = "text/plain;charset=UTF-8");
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
		if (!i.ok) throw new aX(await MX(i, "text") || i.statusText, i.status);
		let a = await MX(i, e.responseType);
		return new pX(i.status, i.statusText, a);
	}
	getCookieString(e) {
		let t = "";
		return Z.isNode && this._jar && this._jar.getCookies(e, (e, n) => t = n.join("; ")), t;
	}
};
function MX(e, t) {
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
var NX = class extends mX {
	constructor(e) {
		super(), this._logger = e;
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new sX()) : e.method ? e.url ? new Promise((t, n) => {
			let r = new XMLHttpRequest();
			r.open(e.method, e.url, !0), r.withCredentials = e.withCredentials === void 0 || e.withCredentials, r.setRequestHeader("X-Requested-With", "XMLHttpRequest"), e.content === "" && (e.content = void 0), e.content && (yX(e.content) ? r.setRequestHeader("Content-Type", "application/octet-stream") : r.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"));
			let i = e.headers;
			i && Object.keys(i).forEach((e) => {
				r.setRequestHeader(e, i[e]);
			}), e.responseType && (r.responseType = e.responseType), e.abortSignal && (e.abortSignal.onabort = () => {
				r.abort(), n(new sX());
			}), e.timeout && (r.timeout = e.timeout), r.onload = () => {
				e.abortSignal && (e.abortSignal.onabort = null), r.status >= 200 && r.status < 300 ? t(new pX(r.status, r.statusText, r.response || r.responseText)) : n(new aX(r.response || r.responseText || r.statusText, r.status));
			}, r.onerror = () => {
				this._logger.log(Y.Warning, `Error from HTTP request. ${r.status}: ${r.statusText}.`), n(new aX(r.statusText, r.status));
			}, r.ontimeout = () => {
				this._logger.log(Y.Warning, "Timeout from HTTP request."), n(new oX());
			}, r.send(e.content);
		}) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
}, PX = class extends mX {
	constructor(e) {
		if (super(), typeof fetch < "u" || Z.isNode) this._httpClient = new jX(e);
		else if (typeof XMLHttpRequest < "u") this._httpClient = new NX(e);
		else throw Error("No usable HttpClient found.");
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new sX()) : e.method ? e.url ? this._httpClient.send(e) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
	getCookieString(e) {
		return this._httpClient.getCookieString(e);
	}
}, FX = class e {
	static write(t) {
		return `${t}${e.RecordSeparator}`;
	}
	static parse(t) {
		if (t[t.length - 1] !== e.RecordSeparator) throw Error("Message is incomplete.");
		let n = t.split(e.RecordSeparator);
		return n.pop(), n;
	}
};
FX.RecordSeparatorCode = 30, FX.RecordSeparator = String.fromCharCode(FX.RecordSeparatorCode);
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js
var IX = class {
	writeHandshakeRequest(e) {
		return FX.write(JSON.stringify(e));
	}
	parseHandshakeResponse(e) {
		let t, n;
		if (yX(e)) {
			let r = new Uint8Array(e), i = r.indexOf(FX.RecordSeparatorCode);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = String.fromCharCode.apply(null, Array.prototype.slice.call(r.slice(0, a))), n = r.byteLength > a ? r.slice(a).buffer : null;
		} else {
			let r = e, i = r.indexOf(FX.RecordSeparator);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = r.substring(0, a), n = r.length > a ? r.substring(a) : null;
		}
		let r = FX.parse(t), i = JSON.parse(r[0]);
		if (i.type) throw Error("Expected a handshake response from the server.");
		return [n, i];
	}
}, Q;
(function(e) {
	e[e.Invocation = 1] = "Invocation", e[e.StreamItem = 2] = "StreamItem", e[e.Completion = 3] = "Completion", e[e.StreamInvocation = 4] = "StreamInvocation", e[e.CancelInvocation = 5] = "CancelInvocation", e[e.Ping = 6] = "Ping", e[e.Close = 7] = "Close", e[e.Ack = 8] = "Ack", e[e.Sequence = 9] = "Sequence";
})(Q ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Subject.js
var LX = class {
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
		return this.observers.push(e), new SX(this, e);
	}
}, RX = class {
	constructor(e, t, n) {
		this._bufferSize = 1e5, this._messages = [], this._totalMessageCount = 0, this._waitForSequenceMessage = !1, this._nextReceivingSequenceId = 1, this._latestReceivedSequenceId = 0, this._bufferedByteCount = 0, this._reconnectInProgress = !1, this._protocol = e, this._connection = t, this._bufferSize = n;
	}
	async _send(e) {
		let t = this._protocol.writeMessage(e), n = Promise.resolve();
		if (this._isInvocationMessage(e)) {
			this._totalMessageCount++;
			let e = () => {}, r = () => {};
			yX(t) ? this._bufferedByteCount += t.byteLength : this._bufferedByteCount += t.length, this._bufferedByteCount >= this._bufferSize && (n = new Promise((t, n) => {
				e = t, r = n;
			})), this._messages.push(new zX(t, this._totalMessageCount, e, r));
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
			if (r._id <= e.sequenceId) t = n, yX(r._message) ? this._bufferedByteCount -= r._message.byteLength : this._bufferedByteCount -= r._message.length, r._resolver();
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
}, zX = class {
	constructor(e, t, n, r) {
		this._message = e, this._id = t, this._resolver = n, this._rejector = r;
	}
}, BX = 3e4, VX = 15e3, HX = 1e5, $;
(function(e) {
	e.Disconnected = "Disconnected", e.Connecting = "Connecting", e.Connected = "Connected", e.Disconnecting = "Disconnecting", e.Reconnecting = "Reconnecting";
})($ ||= {});
var UX = class e {
	static create(t, n, r, i, a, o, s) {
		return new e(t, n, r, i, a, o, s);
	}
	constructor(e, t, n, r, i, a, o) {
		this._nextKeepAlive = 0, this._freezeEventListener = () => {
			this._logger.log(Y.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
		}, X.isRequired(e, "connection"), X.isRequired(t, "logger"), X.isRequired(n, "protocol"), this.serverTimeoutInMilliseconds = i ?? BX, this.keepAliveIntervalInMilliseconds = a ?? VX, this._statefulReconnectBufferSize = o ?? HX, this._logger = t, this._protocol = n, this.connection = e, this._reconnectPolicy = r, this._handshakeProtocol = new IX(), this.connection.onreceive = (e) => this._processIncomingData(e), this.connection.onclose = (e) => this._connectionClosed(e), this._callbacks = {}, this._methods = {}, this._closedCallbacks = [], this._reconnectingCallbacks = [], this._reconnectedCallbacks = [], this._invocationId = 0, this._receivedHandshakeResponse = !1, this._connectionState = $.Disconnected, this._connectionStarted = !1, this._cachedPingMessage = this._protocol.writeMessage({ type: Q.Ping });
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
			this.connection.features.reconnect && (this._messageBuffer = new RX(this._protocol, this.connection, this._statefulReconnectBufferSize), this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer), this.connection.features.resend = () => {
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
		return this._connectionState = $.Disconnecting, this._logger.log(Y.Debug, "Stopping HubConnection."), this._reconnectDelayHandle ? (this._logger.log(Y.Debug, "Connection stopped during reconnect delay. Done reconnecting."), clearTimeout(this._reconnectDelayHandle), this._reconnectDelayHandle = void 0, this._completeClose(), Promise.resolve()) : (t === $.Connected && this._sendCloseMessage(), this._cleanupTimeout(), this._cleanupPingTimer(), this._stopDuringStartError = e || new sX("The connection was stopped before the hub handshake could complete."), this.connection.stop(e));
	}
	async _sendCloseMessage() {
		try {
			await this._sendWithProtocol(this._createCloseMessage());
		} catch {}
	}
	stream(e, ...t) {
		let [n, r] = this._replaceStreamingParams(t), i = this._createStreamInvocation(e, t, r), a, o = new LX();
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
						this._logger.log(Y.Error, `Invoke client method threw error: ${kX(e)}`);
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
							this._logger.log(Y.Error, `Stream callback threw error: ${kX(e)}`);
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
		this._logger.log(Y.Debug, `HubConnection.connectionClosed(${e}) called while in state ${this._connectionState}.`), this._stopDuringStartError = this._stopDuringStartError || e || new sX("The underlying connection was closed before the hub handshake could complete."), this._handshakeResolver && this._handshakeResolver(), this._cancelCallbacksWithError(e || /* @__PURE__ */ Error("Invocation canceled due to the underlying connection being closed.")), this._cleanupTimeout(), this._cleanupPingTimer(), this._connectionState === $.Disconnecting ? this._completeClose(e) : this._connectionState === $.Connected && this._reconnectPolicy ? this._reconnect(e) : this._connectionState === $.Connected && this._completeClose(e);
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
				this._logger.log(Y.Error, `Stream 'error' callback called with '${e}' threw error: ${kX(t)}`);
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
}, WX = [
	0,
	2e3,
	1e4,
	3e4,
	null
], GX = class {
	constructor(e) {
		this._retryDelays = e === void 0 ? WX : [...e, null];
	}
	nextRetryDelayInMilliseconds(e) {
		return this._retryDelays[e.previousRetryCount];
	}
}, KX = class {};
KX.Authorization = "Authorization", KX.Cookie = "Cookie";
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js
var qX = class extends mX {
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
		e.headers ||= {}, this._accessToken ? e.headers[KX.Authorization] = `Bearer ${this._accessToken}` : this._accessTokenFactory && e.headers[KX.Authorization] && delete e.headers[KX.Authorization];
	}
	getCookieString(e) {
		return this._innerClient.getCookieString(e);
	}
}, JX;
(function(e) {
	e[e.None = 0] = "None", e[e.WebSockets = 1] = "WebSockets", e[e.ServerSentEvents = 2] = "ServerSentEvents", e[e.LongPolling = 4] = "LongPolling";
})(JX ||= {});
var YX;
(function(e) {
	e[e.Text = 1] = "Text", e[e.Binary = 2] = "Binary";
})(YX ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AbortController.js
var XX = class {
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
}, ZX = class {
	get pollAborted() {
		return this._pollAbort.aborted;
	}
	constructor(e, t, n) {
		this._httpClient = e, this._logger = t, this._pollAbort = new XX(), this._options = n, this._running = !1, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		if (X.isRequired(e, "url"), X.isRequired(t, "transferFormat"), X.isIn(t, YX, "transferFormat"), this._url = e, this._logger.log(Y.Trace, "(LongPolling transport) Connecting."), t === YX.Binary && typeof XMLHttpRequest < "u" && typeof new XMLHttpRequest().responseType != "string") throw Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
		let [n, r] = wX(), i = {
			[n]: r,
			...this._options.headers
		}, a = {
			abortSignal: this._pollAbort.signal,
			headers: i,
			timeout: 1e5,
			withCredentials: this._options.withCredentials
		};
		t === YX.Binary && (a.responseType = "arraybuffer");
		let o = `${e}&_=${Date.now()}`;
		this._logger.log(Y.Trace, `(LongPolling transport) polling: ${o}.`);
		let s = await this._httpClient.get(o, a);
		s.statusCode === 200 ? this._running = !0 : (this._logger.log(Y.Error, `(LongPolling transport) Unexpected response code: ${s.statusCode}.`), this._closeError = new aX(s.statusText || "", s.statusCode), this._running = !1), this._receiving = this._poll(this._url, a);
	}
	async _poll(e, t) {
		try {
			for (; this._running;) try {
				let n = `${e}&_=${Date.now()}`;
				this._logger.log(Y.Trace, `(LongPolling transport) polling: ${n}.`);
				let r = await this._httpClient.get(n, t);
				r.statusCode === 204 ? (this._logger.log(Y.Information, "(LongPolling transport) Poll terminated by server."), this._running = !1) : r.statusCode === 200 ? r.content ? (this._logger.log(Y.Trace, `(LongPolling transport) data received. ${_X(r.content, this._options.logMessageContent)}.`), this.onreceive && this.onreceive(r.content)) : this._logger.log(Y.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._logger.log(Y.Error, `(LongPolling transport) Unexpected response code: ${r.statusCode}.`), this._closeError = new aX(r.statusText || "", r.statusCode), this._running = !1);
			} catch (e) {
				this._running ? e instanceof oX ? this._logger.log(Y.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._closeError = e, this._running = !1) : this._logger.log(Y.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
			}
		} finally {
			this._logger.log(Y.Trace, "(LongPolling transport) Polling complete."), this.pollAborted || this._raiseOnClose();
		}
	}
	async send(e) {
		return this._running ? bX(this._logger, "LongPolling", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	async stop() {
		this._logger.log(Y.Trace, "(LongPolling transport) Stopping polling."), this._running = !1, this._pollAbort.abort();
		try {
			await this._receiving, this._logger.log(Y.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
			let e = {}, [t, n] = wX();
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
			i ? i instanceof aX && (i.statusCode === 404 ? this._logger.log(Y.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.") : this._logger.log(Y.Trace, `(LongPolling transport) Error sending a DELETE request: ${i}`)) : this._logger.log(Y.Trace, "(LongPolling transport) DELETE request accepted.");
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
}, QX = class {
	constructor(e, t, n, r) {
		this._httpClient = e, this._accessToken = t, this._logger = n, this._options = r, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		return X.isRequired(e, "url"), X.isRequired(t, "transferFormat"), X.isIn(t, YX, "transferFormat"), this._logger.log(Y.Trace, "(SSE transport) Connecting."), this._url = e, this._accessToken && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(this._accessToken)}`), new Promise((n, r) => {
			let i = !1;
			if (t !== YX.Text) {
				r(/* @__PURE__ */ Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
				return;
			}
			let a;
			if (Z.isBrowser || Z.isWebWorker) a = new this._options.EventSource(e, { withCredentials: this._options.withCredentials });
			else {
				let t = this._httpClient.getCookieString(e), n = {};
				n.Cookie = t;
				let [r, i] = wX();
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
						this._logger.log(Y.Trace, `(SSE transport) data received. ${_X(e.data, this._options.logMessageContent)}.`), this.onreceive(e.data);
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
		return this._eventSource ? bX(this._logger, "SSE", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	stop() {
		return this._close(), Promise.resolve();
	}
	_close(e) {
		this._eventSource && (this._eventSource.close(), this._eventSource = void 0, this.onclose && this.onclose(e));
	}
}, $X = class {
	constructor(e, t, n, r, i, a) {
		this._logger = n, this._accessTokenFactory = t, this._logMessageContent = r, this._webSocketConstructor = i, this._httpClient = e, this.onreceive = null, this.onclose = null, this._headers = a;
	}
	async connect(e, t) {
		X.isRequired(e, "url"), X.isRequired(t, "transferFormat"), X.isIn(t, YX, "transferFormat"), this._logger.log(Y.Trace, "(WebSockets transport) Connecting.");
		let n;
		return this._accessTokenFactory && (n = await this._accessTokenFactory()), new Promise((r, i) => {
			e = e.replace(/^http/, "ws");
			let a, o = this._httpClient.getCookieString(e), s = !1;
			if (Z.isNode || Z.isReactNative) {
				let t = {}, [r, i] = wX();
				t[r] = i, n && (t[KX.Authorization] = `Bearer ${n}`), o && (t[KX.Cookie] = o), a = new this._webSocketConstructor(e, void 0, { headers: {
					...t,
					...this._headers
				} });
			} else n && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(n)}`);
			a ||= new this._webSocketConstructor(e), t === YX.Binary && (a.binaryType = "arraybuffer"), a.onopen = (t) => {
				this._logger.log(Y.Information, `WebSocket connected to ${e}.`), this._webSocket = a, s = !0, r();
			}, a.onerror = (e) => {
				let t = null;
				t = typeof ErrorEvent < "u" && e instanceof ErrorEvent ? e.error : "There was an error with the transport", this._logger.log(Y.Information, `(WebSockets transport) ${t}.`);
			}, a.onmessage = (e) => {
				if (this._logger.log(Y.Trace, `(WebSockets transport) data received. ${_X(e.data, this._logMessageContent)}.`), this.onreceive) try {
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
		return this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN ? (this._logger.log(Y.Trace, `(WebSockets transport) sending data. ${_X(e, this._logMessageContent)}.`), this._webSocket.send(e), Promise.resolve()) : Promise.reject("WebSocket is not in the OPEN state");
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
}, eZ = 100, tZ = class {
	constructor(t, n = {}) {
		if (this._stopPromiseResolver = () => {}, this.features = {}, this._negotiateVersion = 1, X.isRequired(t, "url"), this._logger = xX(n.logger), this.baseUrl = this._resolveUrl(t), n ||= {}, n.logMessageContent = n.logMessageContent !== void 0 && n.logMessageContent, typeof n.withCredentials == "boolean" || n.withCredentials === void 0) n.withCredentials = n.withCredentials === void 0 || n.withCredentials;
		else throw Error("withCredentials option was not a 'boolean' or 'undefined' value");
		n.timeout = n.timeout === void 0 ? 1e5 : n.timeout;
		let r = null, i = null;
		if (Z.isNode && e !== void 0) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			r = t("ws"), i = t("eventsource");
		}
		!Z.isNode && typeof WebSocket < "u" && !n.WebSocket ? n.WebSocket = WebSocket : Z.isNode && !n.WebSocket && r && (n.WebSocket = r), !Z.isNode && typeof EventSource < "u" && !n.EventSource ? n.EventSource = EventSource : Z.isNode && !n.EventSource && i !== void 0 && (n.EventSource = i), this._httpClient = new qX(n.httpClient || new PX(this._logger), n.accessTokenFactory), this._connectionState = "Disconnected", this._connectionStarted = !1, this._options = n, this.onreceive = null, this.onclose = null;
	}
	async start(e) {
		if (e ||= YX.Binary, X.isIn(e, YX, "transferFormat"), this._logger.log(Y.Debug, `Starting connection with transfer format '${YX[e]}'.`), this._connectionState !== "Disconnected") return Promise.reject(/* @__PURE__ */ Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
		if (this._connectionState = "Connecting", this._startInternalPromise = this._startInternal(e), await this._startInternalPromise, this._connectionState === "Disconnecting") {
			let e = "Failed to start the HttpConnection before stop() was called.";
			return this._logger.log(Y.Error, e), await this._stopPromise, Promise.reject(new sX(e));
		}
		if (this._connectionState !== "Connected") {
			let e = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
			return this._logger.log(Y.Error, e), Promise.reject(new sX(e));
		}
		this._connectionStarted = !0;
	}
	send(e) {
		return this._connectionState === "Connected" ? (this._sendQueue ||= new rZ(this.transport), this._sendQueue.send(e)) : Promise.reject(/* @__PURE__ */ Error("Cannot send data if the connection is not in the 'Connected' State."));
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
				if (this._options.transport === JX.WebSockets) this.transport = this._constructTransport(JX.WebSockets), await this._startTransport(t, e);
				else throw Error("Negotiation can only be skipped when using the WebSocket transport directly.");
			} else {
				let n = null, r = 0;
				do {
					if (n = await this._getNegotiationResponse(t), this._connectionState === "Disconnecting" || this._connectionState === "Disconnected") throw new sX("The connection was stopped during negotiation.");
					if (n.error) throw Error(n.error);
					if (n.ProtocolVersion) throw Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
					if (n.url && (t = n.url), n.accessToken) {
						let e = n.accessToken;
						this._accessTokenFactory = () => e, this._httpClient._accessToken = e, this._httpClient._accessTokenFactory = void 0;
					}
					r++;
				} while (n.url && r < eZ);
				if (r === eZ && n.url) throw Error("Negotiate redirection limit exceeded.");
				await this._createTransport(t, this._options.transport, n, e);
			}
			this.transport instanceof ZX && (this.features.inherentKeepAlive = !0), this._connectionState === "Connecting" && (this._logger.log(Y.Debug, "The HttpConnection connected successfully."), this._connectionState = "Connected");
		} catch (e) {
			return this._logger.log(Y.Error, "Failed to start the connection: " + e), this._connectionState = "Disconnected", this.transport = void 0, this._stopPromiseResolver(), Promise.reject(e);
		}
	}
	async _getNegotiationResponse(e) {
		let t = {}, [n, r] = wX();
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
			return (!n.negotiateVersion || n.negotiateVersion < 1) && (n.connectionToken = n.connectionId), n.useStatefulReconnect && this._options._useStatefulReconnect !== !0 ? Promise.reject(new dX("Client didn't negotiate Stateful Reconnect but the server did.")) : n;
		} catch (e) {
			let t = "Failed to complete negotiation with the server: " + e;
			return e instanceof aX && e.statusCode === 404 && (t += " Either this is not a SignalR endpoint or there is a proxy blocking the connection."), this._logger.log(Y.Error, t), Promise.reject(new dX(t));
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
					if (this._logger.log(Y.Error, `Failed to start the transport '${n.transport}': ${e}`), s = void 0, a.push(new uX(`${n.transport} failed: ${e}`, JX[n.transport])), this._connectionState !== "Connecting") {
						let e = "Failed to select transport before stop() was called.";
						return this._logger.log(Y.Debug, e), Promise.reject(new sX(e));
					}
				}
			}
		}
		return a.length > 0 ? Promise.reject(new fX(`Unable to connect to the server with any of the available transports. ${a.join(" ")}`, a)) : Promise.reject(/* @__PURE__ */ Error("None of the transports supported by the client are supported by the server."));
	}
	_constructTransport(e) {
		switch (e) {
			case JX.WebSockets:
				if (!this._options.WebSocket) throw Error("'WebSocket' is not supported in your environment.");
				return new $X(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
			case JX.ServerSentEvents:
				if (!this._options.EventSource) throw Error("'EventSource' is not supported in your environment.");
				return new QX(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
			case JX.LongPolling: return new ZX(this._httpClient, this._logger, this._options);
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
		let i = JX[e.transport];
		if (i == null) return this._logger.log(Y.Debug, `Skipping transport '${e.transport}' because it is not supported by this client.`), /* @__PURE__ */ Error(`Skipping transport '${e.transport}' because it is not supported by this client.`);
		if (nZ(t, i)) {
			if (e.transferFormats.map((e) => YX[e]).indexOf(n) >= 0) {
				if (i === JX.WebSockets && !this._options.WebSocket || i === JX.ServerSentEvents && !this._options.EventSource) return this._logger.log(Y.Debug, `Skipping transport '${JX[i]}' because it is not supported in your environment.'`), new cX(`'${JX[i]}' is not supported in your environment.`, i);
				this._logger.log(Y.Debug, `Selecting transport '${JX[i]}'.`);
				try {
					return this.features.reconnect = i === JX.WebSockets ? r : void 0, this._constructTransport(i);
				} catch (e) {
					return e;
				}
			}
			return this._logger.log(Y.Debug, `Skipping transport '${JX[i]}' because it does not support the requested transfer format '${YX[n]}'.`), /* @__PURE__ */ Error(`'${JX[i]}' does not support ${YX[n]}.`);
		}
		return this._logger.log(Y.Debug, `Skipping transport '${JX[i]}' because it was disabled by the client.`), new lX(`'${JX[i]}' is disabled by the client.`, i);
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
function nZ(e, t) {
	return !e || (t & e) !== 0;
}
var rZ = class e {
	constructor(e) {
		this._transport = e, this._buffer = [], this._executing = !0, this._sendBufferedData = new iZ(), this._transportResult = new iZ(), this._sendLoopPromise = this._sendLoop();
	}
	send(e) {
		return this._bufferData(e), this._transportResult ||= new iZ(), this._transportResult.promise;
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
			this._sendBufferedData = new iZ();
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
}, iZ = class {
	constructor() {
		this.promise = new Promise((e, t) => [this._resolver, this._rejecter] = [e, t]);
	}
	resolve() {
		this._resolver();
	}
	reject(e) {
		this._rejecter(e);
	}
}, aZ = "json", oZ = class {
	constructor() {
		this.name = aZ, this.version = 2, this.transferFormat = YX.Text;
	}
	parseMessages(e, t) {
		if (typeof e != "string") throw Error("Invalid input for JSON hub protocol. Expected a string.");
		if (!e) return [];
		t === null && (t = hX.instance);
		let n = FX.parse(e), r = [];
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
		return FX.write(JSON.stringify(e));
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
}, sZ = {
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
function cZ(e) {
	let t = sZ[e.toLowerCase()];
	if (t !== void 0) return t;
	throw Error(`Unknown log level: ${e}`);
}
var lZ = class {
	configureLogging(e) {
		if (X.isRequired(e, "logging"), uZ(e)) this.logger = e;
		else if (typeof e == "string") {
			let t = cZ(e);
			this.logger = new CX(t);
		} else this.logger = new CX(e);
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
		return this.reconnectPolicy = e ? Array.isArray(e) ? new GX(e) : e : new GX(), this;
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
		let t = new tZ(this.url, e);
		return UX.create(t, this.logger || hX.instance, this.protocol || new oZ(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
	}
};
function uZ(e) {
	return e.log !== void 0;
}
//#endregion
//#region src/transport/attach-gate.ts
var dZ = class extends Error {
	byServerError;
	constructor(e) {
		super("the connection to the server dropped under the call; it is reconnecting.", { cause: e }), this.name = "ConnectionDropped", this.byServerError = e instanceof Error && e.message.startsWith("Server returned an error on close");
	}
}, fZ = class {
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
}, pZ = 500;
function mZ(e) {
	let { changes: t, ...n } = e;
	return n;
}
function hZ() {
	return {};
}
function gZ(e) {
	return typeof e == "string" ? e : null;
}
var _Z = class {
	windowId;
	connection;
	started = !1;
	gate = new fZ();
	inbound;
	constructor(e, t, n = {}) {
		this.windowId = e, this.inbound = new tX(t), this.connection = new lZ().withUrl(n.hubUrl ?? "/_ne/hub").withAutomaticReconnect([...n.reconnectDelays ?? [
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
		this.connection.on("ui.changes", this.inbound.pushed((t, n) => e(t, gZ(n))));
	}
	onCommandResult(e) {
		this.connection.on("ui.commandResult", this.inbound.pushed((t, n) => e(t, gZ(n))));
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
		return await this.invokeAsync("ProcessEventAsync", [e], (e) => this.inbound.answered(e, (e) => e.changes, mZ));
	}
	async requestLeaveAsync(e) {
		return await this.invokeAsync("RequestLeaveAsync", [{ target: e }], (e) => this.inbound.answered(e, (e) => e.changes, mZ));
	}
	async navigateInPlaceAsync(e) {
		return await this.invokeAsync("NavigateInPlaceAsync", [{ parameters: e }], (e) => this.inbound.answered(e, (e) => e.changes, mZ));
	}
	async processChangeSetAsync(e, t) {
		try {
			await this.invokeAsync("ProcessChangeSetAsync", [e], (e) => this.inbound.answered(e, (e) => e, hZ, t));
		} catch (e) {
			throw this.isReconnecting && this.gate.failure === null ? new dZ(e) : e;
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
		await this.invokeAsync("RequestItemWindowAsync", [e], (e) => this.inbound.answered(e, (e) => e, hZ));
	}
	async invokeAsync(e, t, n) {
		let r = window.setTimeout(() => s("call waiting behind the attach.", { methodName: e }), pZ);
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
}, vZ = Promise.resolve(), yZ = () => {}, bZ = KY * 3 / 4, xZ = 128, SZ = class {
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
		if (this.handed >= this.given) return vZ;
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
		for (; this.flight !== null;) await this.flight.catch(yZ);
	}
	dispatchAsync(e, t) {
		let n = ++this.given, r = JY(e.value), i = r === null ? null : ZY(r);
		return i?.catch(yZ), new Promise((a, o) => {
			let s = wZ(e), c = this.queue.findIndex((e) => e.field === s), l = [{
				resolve: a,
				reject: o
			}], u = n;
			c >= 0 && (l = [...this.queue[c].settles, ...l], u = this.queue[c].sequence, this.queue.splice(c, 1));
			let d = r === null ? CZ(e) : CZ({
				...e,
				value: void 0
			}) + xZ;
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
		let i = n.length === 0 ? null : this.transport.processChangeSetAsync({ updates: n }, TZ(r));
		if (this.markHanded(t), i !== null) try {
			await i;
			for (let e of r) for (let t of e.settles) t.resolve();
		} catch (e) {
			if (e instanceof dZ) {
				this.requeue(r, e);
				return;
			}
			for (let t of r) for (let n of t.settles) n.reject(e);
		}
	}
	takeBatch() {
		let e = 0, t = 0;
		for (; e < this.queue.length && (e === 0 || t + this.queue[e].bytes <= bZ);) t += this.queue[e].bytes, e++;
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
		let t = this.transport.whenAttached().then(() => ZY(e));
		return t.catch(yZ), t;
	}
	markHanded(e) {
		this.handed = Math.max(this.handed, e);
		for (let e = this.sentWaiters.length - 1; e >= 0; e--) {
			let t = this.sentWaiters[e];
			t.through <= this.handed && (this.sentWaiters.splice(e, 1), t.resolve());
		}
	}
};
function CZ(e) {
	return new TextEncoder().encode(JSON.stringify(e)).byteLength;
}
function wZ(e) {
	return `${e.componentId}:${e.propertyName}:${JSON.stringify(e.dynamicParameters)}`;
}
function TZ(e) {
	let t = e.map((e) => e.before).filter((e) => e !== void 0);
	if (t.length !== 0) return () => {
		for (let e of t) e();
	};
}
//#endregion
//#region src/updates/content-fills.ts
var EZ = "content-fills", DZ = "content", OZ = "data-ui-root", kZ = "--ui-height", AZ = "var(--ui-fill-height";
function jZ(e) {
	let t = e.parentElement;
	if (t === null || t.getAttribute("data-ui-region") !== "content") return;
	let n = t.parentElement;
	if (n === null || !n.hasAttribute(OZ)) return;
	let r = e.style.getPropertyValue(kZ).trimStart().startsWith(AZ);
	n.hasAttribute("data-ui-content-fills") !== r && n.toggleAttribute(jn, r);
}
//#endregion
//#region src/updates/form-owner.ts
var MZ = "form-owner", NZ = "ui-form-";
function PZ(e) {
	return NZ + e.replace(/[ \t\n\f\r]/g, "_");
}
function FZ(e, t) {
	if (typeof t != "string" || t.trim().length === 0) {
		e.hasAttribute("form") && e.removeAttribute("form");
		return;
	}
	let n = PZ(t);
	LZ(n), e.getAttribute("form") !== n && e.setAttribute("form", n);
}
function IZ(e) {
	for (let t of e.querySelectorAll("[form]")) {
		let e = t.getAttribute("form");
		e !== null && e.startsWith(NZ) && LZ(e);
	}
}
function LZ(e) {
	let t = RZ();
	if (t.querySelector(`form[id="${w(e)}"]`) !== null) return;
	let n = document.createElement("form");
	n.setAttribute("id", e), n.setAttribute("method", "dialog"), n.setAttribute("novalidate", ""), t.appendChild(n);
}
function RZ() {
	let e = document.body.querySelector(`[${cn}]`);
	if (e !== null) return e;
	let t = document.createElement("div");
	return t.setAttribute(cn, ""), t.setAttribute("hidden", ""), document.body.appendChild(t);
}
//#endregion
//#region src/interactions/legacy-commands.ts
var zZ = document;
function BZ() {
	try {
		return zZ.execCommand("copy");
	} catch {
		return !1;
	}
}
function VZ(e) {
	try {
		return typeof zZ.execCommand == "function" && zZ.execCommand("insertText", !1, e);
	} catch {
		return !1;
	}
}
//#endregion
//#region src/interactions/lightbox.ts
var HZ = "ui-lightbox", UZ = "ui-lightbox-title", WZ = new Tv("data-ui-lightbox-part"), GZ = "data-ui-lightbox-set", KZ = "data-ui-lightbox-slot", qZ = "data-ui-lightbox-still", JZ = "--ui-lightbox-shift", YZ = 16, XZ = 1 / 5, ZZ = null, QZ = null, $Z = null;
function eQ(e, t, n) {
	let r = t.filter((e) => Oh(e.source) !== null);
	if (r.length === 0) return s("show image effect carries no picture the page may fetch.", t), !1;
	ZZ ??= aQ(e), (ZZ.dialog.hasAttribute("hidden") || !ZZ.dialog.isConnected) && document.body.append(ZZ.dialog);
	let i = t.slice(0, Math.max(0, n)).filter((e) => Oh(e.source) === null).length;
	$Z = null, QZ = {
		pictures: r,
		index: iQ(n - i, r.length)
	}, ZZ.dialog.toggleAttribute(GZ, r.length > 1);
	for (let e of ZZ.neighbours) e.hidden = r.length < 2;
	return pQ(ZZ), mQ(ZZ, QZ), e.open(HZ);
}
function tQ(e, t, n) {
	let r = nQ(e);
	if (r === null) return null;
	let i = e.closest(`[${b}]`);
	if (!t || i === null) return {
		pictures: [r],
		start: 0
	};
	let a = [], o = 0;
	for (let t of [...n(e)].filter((e) => e.closest(`[${b}]`) === i).sort(rQ)) {
		let n = t === e ? r : nQ(t);
		n !== null && (t === e && (o = a.length), a.push(n));
	}
	return {
		pictures: a,
		start: o
	};
}
function nQ(e) {
	let t = e.matches("img") ? e : e.querySelector("img");
	if (t === null || t.closest("[data-ui-image-failed]") !== null) return null;
	let n = t.currentSrc, r = Oh(typeof n == "string" && n.length > 0 ? n : t.getAttribute("src") ?? "");
	return r === null ? null : {
		source: r,
		altText: t.getAttribute("alt") ?? ""
	};
}
function rQ(e, t) {
	return e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}
function iQ(e, t) {
	return Math.min(Math.max(0, Math.trunc(Number.isFinite(e) ? e : 0)), t - 1);
}
function aQ(e) {
	let { dialog: t, surface: n } = wv({
		key: HZ,
		className: "ui-lightbox",
		surfaceClassName: "ui-lightbox__surface",
		role: "dialog",
		labelledBy: UZ,
		closesOnEscapeAndBackdrop: !0
	}), r = WZ.element("h2", "ui-lightbox__title"), i = sQ("ui-lightbox__close", "close"), a = WZ.element("div", "ui-lightbox__stage"), [o, s] = oQ("previous"), [c, l] = oQ("current"), [u, d] = oQ("next"), f = WZ.element("div", "ui-lightbox__nav"), p = sQ("ui-lightbox__step ui-lightbox__step--previous", "previous"), m = sQ("ui-lightbox__step ui-lightbox__step--next", "next"), h = WZ.element("span", "ui-lightbox__counter ui-text-type--caption"), g = WZ.element("span", "ui-lightbox__count-room"), _ = WZ.element("span", "ui-lightbox__count"), v = WZ.element("p", "ui-lightbox__caption ui-text-type--body", "caption");
	return r.id = UZ, _.setAttribute("aria-live", "polite"), g.setAttribute("aria-hidden", "true"), O.write(r, null, "ui.lightbox.label"), O.write(i, "aria-label", "ui.action.close"), O.write(p, "aria-label", "ui.lightbox.previous"), O.write(m, "aria-label", "ui.lightbox.next"), h.append(g, _), f.append(p, h, m), c.append(f), a.append(o, c, u), n.append(r, i, a, v), t.addEventListener("click", (t) => {
		switch (WZ.pressed(t)) {
			case "close":
				e.dismiss(HZ);
				break;
			case "previous":
				cQ(-1);
				break;
			case "next": cQ(1);
		}
	}), t.addEventListener("keydown", (e) => {
		if (e.defaultPrevented || !N(e) || QZ === null || QZ.pictures.length < 2) return;
		let n = e.key === "ArrowLeft" ? -1 : +(e.key === "ArrowRight");
		n !== 0 && (e.preventDefault(), cQ(gQ(t) ? -n : n));
	}), _Q(t, a), {
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
function oQ(e) {
	let t = WZ.element("div", "ui-lightbox__figure"), n = WZ.element("img", "ui-lightbox__picture", e === "current" ? "picture" : void 0);
	return t.setAttribute(KZ, e), n.decoding = "async", n.draggable = !1, n.addEventListener("error", () => n.setAttribute(ct, "")), e !== "current" && t.setAttribute("aria-hidden", "true"), t.append(n), [t, n];
}
function sQ(e, t) {
	let n = WZ.element("button", e, t);
	return n.type = "button", n;
}
function cQ(e) {
	if (ZZ === null || QZ === null || QZ.pictures.length < 2) return;
	let t = ZZ;
	if (dQ(t), lp()) {
		fQ(t, e), pQ(t), mQ(t, QZ);
		return;
	}
	let n = {
		by: e,
		landed: !1
	}, r = gQ(t.dialog) ? -1 : 1;
	$Z = n, t.stage.removeAttribute(qZ), t.stage.style.setProperty(JZ, `${-e * r * lQ(t.stage)}px`), dp(t.current, B.normal + 100, () => uQ(t, n));
}
function lQ(e) {
	return e.getBoundingClientRect().width + YZ;
}
function uQ(e, t) {
	if ($Z !== t || t.landed) return;
	fQ(e, t.by), t.landed = !0;
	let n = typeof e.picture.decode == "function" ? e.picture.decode().catch(() => void 0) : null;
	n === null ? dQ(e) : n.then(() => {
		$Z === t && dQ(e);
	});
}
function dQ(e) {
	let t = $Z;
	t !== null && QZ !== null && ($Z = null, t.landed || fQ(e, t.by), pQ(e), mQ(e, QZ));
}
function fQ(e, t) {
	if (QZ === null) return;
	let n = QZ.pictures.length;
	QZ.index = ((QZ.index + t) % n + n) % n, hQ(e.picture, QZ.pictures[QZ.index].source);
}
function pQ(e) {
	e.stage.setAttribute(qZ, ""), e.stage.style.setProperty(JZ, "0px"), e.stage.getBoundingClientRect();
}
function mQ(e, t) {
	let n = t.pictures.length, r = t.pictures[t.index];
	hQ(e.picture, r.source), hQ(e.previousPicture, t.pictures[(t.index + n - 1) % n].source), hQ(e.nextPicture, t.pictures[(t.index + 1) % n].source), O.writeValue(e.picture, "alt", r.altText ?? r.caption ?? ""), O.writeValue(e.caption, null, r.caption ?? ""), e.caption.hidden = r.caption === void 0, O.write(e.count, null, "ui.lightbox.counter", {
		index: t.index + 1,
		count: n
	}), O.write(e.countRoom, null, "ui.lightbox.counter", {
		index: n,
		count: n
	});
}
function hQ(e, t) {
	e.getAttribute("src") !== t && (e.removeAttribute(ct), e.src = t);
}
function gQ(e) {
	return getComputedStyle(e).direction === "rtl";
}
function _Q(e, t) {
	uh(e, {
		axis: "x",
		begins: (e) => e.pointerType !== "touch" || ZZ === null || QZ === null || QZ.pictures.length < 2 ? !1 : (dQ(ZZ), !0),
		start: () => t.setAttribute(qZ, ""),
		follow: (e) => t.style.setProperty(JZ, `${e}px`),
		end: (n, r, i) => {
			if (i && vQ(n, window.innerWidth, r)) {
				cQ((gQ(e) ? n > 0 : n < 0) ? 1 : -1);
				return;
			}
			t.removeAttribute(qZ), t.style.setProperty(JZ, "0px");
		}
	});
}
function vQ(e, t, n) {
	return Math.abs(e) > t * XZ || Math.abs(n) > .5 && Math.abs(e) > 6;
}
//#endregion
//#region src/interactions/notification-engine.ts
var yQ = "ui-notification-host", bQ = "ui-notification", xQ = "ui-notification--leaving", SQ = "ui-notification__message", CQ = "ui-notification__title", wQ = "ui-notification__action", TQ = "ui-notification__close", EQ = 5e3, DQ = 8e3, OQ = "ui-notification--connection", kQ = "--ui-notification-lift", AQ = /* @__PURE__ */ new Set([
	"info",
	"success",
	"warning",
	"danger",
	"primary",
	"accent"
]), jQ = class {
	root;
	components;
	durationMs;
	host = null;
	announcer;
	focusOrigins = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, this.durationMs = e.durationMs ?? EQ, this.ensureHost(), this.announcer = EO(this.root instanceof Document ? this.root.body : this.root);
	}
	announce(e, t) {
		return this.announcer.announce(e, t);
	}
	show(e) {
		let t = Yx(e.severity), n = document.createElement("div");
		n.className = AQ.has(t) ? `${bQ} ${bQ}--${t}` : bQ, n.classList.toggle(OQ, e.connection === !0), t === "danger" && n.setAttribute("role", "alert");
		let r = document.createElement("span");
		if (r.className = SQ, e.title !== void 0) {
			let t = document.createElement("span");
			t.className = CQ, O.writeValue(t, null, e.title), n.append(t);
		}
		typeof e.message == "string" ? r.textContent = e.message : O.writeValue(r, null, e.message), n.append(r);
		let i = document.createElement("button");
		return i.type = "button", i.className = TQ, O.write(i, "aria-label", "ui.notification.close"), i.addEventListener("click", () => this.dismiss(n)), n.append(i), e.action !== void 0 && n.append(FQ(e.action, e.sticky === !0 ? null : () => this.dismiss(n))), n.addEventListener("keydown", (e) => {
			e.key !== "Escape" || e.defaultPrevented || M(e) || (e.preventDefault(), this.dismiss(n));
		}), n.addEventListener("focusin", (e) => {
			let t = e.relatedTarget;
			t instanceof HTMLElement && !n.contains(t) && this.focusOrigins.set(n, t);
		}), MQ(() => {
			if (n.classList.contains(xQ)) return;
			let t = this.ensureHost();
			NQ(t), t.append(n), e.sticky !== !0 && this.standFor(n, e);
		}), n;
	}
	standFor(e, t) {
		let n = t.durationMs !== void 0 && t.durationMs > 0 ? t.durationMs : t.action === void 0 ? this.durationMs : DQ, r = !1, i = !1, a = window.setTimeout(() => this.dismiss(e), n), o = () => window.clearTimeout(a), s = () => {
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
		if (!e.classList.contains(xQ) && (e.classList.add(xQ), e.isConnected)) {
			if (this.returnFocus(e), lp() || typeof e.animate != "function") {
				e.remove();
				return;
			}
			window.setTimeout(() => PQ(e), B.fast);
		}
	}
	returnFocus(e) {
		if (!e.contains(document.activeElement)) return;
		let t = [...e.parentElement?.children ?? []].find((t) => t !== e && !t.classList.contains(xQ));
		uf(of(this.focusOrigins.get(e), this.components) ?? t?.querySelector(`.${TQ}`) ?? null, e);
	}
	ensureHost() {
		if (this.host !== null && this.host.isConnected) return this.host;
		let e = this.root instanceof Document ? this.root.body : this.root, t = e.querySelector(`.${yQ}`), n = t ?? document.createElement("div");
		return n.classList.add(yQ), n.setAttribute("role", "status"), n.setAttribute("aria-live", "polite"), t === null && e.append(n), this.host = n, n;
	}
};
function MQ(e) {
	if (sW(document.visibilityState)) {
		e();
		return;
	}
	let t = () => {
		sW(document.visibilityState) && (document.removeEventListener("visibilitychange", t), e());
	};
	document.addEventListener("visibilitychange", t);
}
function NQ(e) {
	let t = window.innerHeight - _m(window.innerHeight);
	t > 0 ? e.style.setProperty(kQ, `${Math.round(t)}px`) : e.style.removeProperty(kQ);
}
function PQ(e) {
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
function FQ(e, t) {
	let n = document.createElement("button"), r = !1;
	return n.type = "button", n.className = `${wQ} ui-button ui-button--primary ui-button--small`, typeof e.label == "string" ? n.textContent = e.label : O.writeValue(n, null, e.label), n.addEventListener("click", () => {
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
function IQ(e, t) {
	let n = LQ(e), r = e?.label;
	if (n !== void 0) {
		if (!Ro(r) && !zo(r)) {
			s("a notification's action carries no words.", e);
			return;
		}
		return {
			label: r,
			run: () => t(n)
		};
	}
}
function LQ(e) {
	return e != null && typeof e.id == "string" && e.id.length > 0 ? e.id : void 0;
}
//#endregion
//#region src/effects/insert-text.ts
function RQ(e, t, n) {
	let r = e.itemKey === !0 ? zQ(n) : e.text;
	if (typeof r != "string") {
		s(e.itemKey === !0 ? "insert text effect reads the row's key but ran for no row." : "insert text effect carries no text.", e);
		return;
	}
	let i = BQ(t);
	if (i === null) {
		s("insert text effect target holds no text field.", e);
		return;
	}
	VQ(i, r);
}
function zQ(e) {
	let t = e.length === 0 ? null : e[e.length - 1];
	return t == null ? null : String(t);
}
function BQ(e) {
	if (il(e)) return e;
	for (let t of e.querySelectorAll("input, textarea")) if (il(t)) return t;
	return null;
}
function VQ(e, t) {
	if (t.length === 0 || e.readOnly || e.disabled || k(e) || j(e)) return !1;
	let n = e.value, r = e.selectionStart !== null, i = e.selectionStart ?? n.length, a = e.selectionEnd ?? i;
	return e.maxLength >= 0 && n.length - (a - i) + t.length > e.maxLength ? !1 : (document.activeElement !== e && e.focus({ preventScroll: !0 }), r && e.setSelectionRange(i, a), document.activeElement === e && VZ(t) && e.value !== n ? !0 : (r ? e.setRangeText(t, i, a, "end") : e.value = n + t, e.dispatchEvent(new Event("input", { bubbles: !0 })), !0));
}
//#endregion
//#region src/effects/navigation-url.ts
function HQ(e) {
	let t = e.request?.route;
	return t == null || t.length === 0 ? null : UQ(t, e.request?.parameters ?? null);
}
function UQ(e, t) {
	let n = WQ(t);
	if (n.length === 0) return e;
	let r = e.indexOf("#"), i = r < 0 ? e : e.slice(0, r), a = r < 0 ? "" : e.slice(r);
	return `${i}${i.includes("?") ? i.endsWith("?") || i.endsWith("&") ? "" : "&" : "?"}${n}${a}`;
}
function WQ(e) {
	if (e === null) return "";
	let t = new URLSearchParams();
	for (let [n, r] of Object.entries(e)) if (r != null) for (let e of Array.isArray(r) ? r : [r]) e != null && t.append(n, GQ(e));
	return t.toString();
}
function GQ(e) {
	return typeof e == "object" ? JSON.stringify(e) : String(e);
}
//#endregion
//#region src/effects/scroller.ts
function KQ(e, t) {
	let n = JQ([e, ...e.querySelectorAll("*")], t);
	if (n !== null) return n;
	let r = [];
	for (let t = e.parentElement; t !== null; t = t.parentElement) r.push(t);
	return JQ(r, t) ?? qQ(t);
}
function qQ(e) {
	let t = typeof document > "u" ? null : document.scrollingElement ?? null;
	return t !== null && YQ(t, e) ? t : null;
}
function JQ(e, t) {
	let n = null;
	for (let r of e) if (IP(r, t)) {
		if (YQ(r, t)) return r;
		n ??= r;
	}
	return n;
}
function YQ(e, t) {
	return t ? e.scrollHeight > e.clientHeight : e.scrollWidth > e.clientWidth;
}
//#endregion
//#region src/effects/effect-registry.ts
var XQ = class {
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
		this.handlers.set(ra(e), t);
	}
	applyAll(e, t) {
		if (e != null) for (let n of e) this.apply({
			effect: n,
			dom: t
		});
	}
	apply(e) {
		let t = ra(e.effect?.kind), n = t.length === 0 ? void 0 : this.handlers.get(t);
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
			let t = HQ(e.effect);
			if (t === null) {
				s("navigate effect carries no route.", e.effect);
				return;
			}
			if (!Ch(t)) {
				s("navigate effect names no route of this site; not followed.", e.effect);
				return;
			}
			this.leaveFor(t);
		}), this.register("NavigateBack", (e) => {
			if (this.address?.back() === !0) return;
			let t = e.effect.fallback;
			if (typeof t != "string" || !Ch(t)) {
				s("navigate back effect has nothing to go back to and names no route of this site; not followed.", e.effect);
				return;
			}
			this.leaveFor(t);
		}), this.register("ReplaceAddress", (e) => {
			this.writeAddress(e, (e, t) => e.replace(t));
		}), this.register("PushAddress", (e) => {
			this.writeAddress(e, (e, t) => e.push(t));
		}), this.register("SetTheme", (e) => {
			let t = e.effect, n = sa(t.mode), r = n === "Unknown" ? "auto" : n.toLowerCase();
			document.documentElement.getAttribute("data-ui-theme") !== r && document.documentElement.setAttribute(Lr, r), t.stored !== !0 && this.reportTheme?.(r);
		}), this.register("Focus", (e) => {
			let t = n$(e);
			t !== null && (VG(t), i$(t));
		}), this.register("ScrollTo", (e) => {
			let t = n$(e);
			if (t === null) return;
			let n = e.effect, r = ia(n.behavior), i = aa(n.block);
			VG(t), t.scrollIntoView({
				behavior: r$(r),
				block: i === "Unknown" ? "nearest" : i.toLowerCase()
			});
		}), this.register("ScrollToItem", (e) => {
			let t = n$(e);
			if (t === null) return;
			let n = e.effect, r = DG(t);
			if (r === null || typeof n.key != "string" || n.key.length === 0) {
				s("scroll to item effect names no items host or no key.", e.effect);
				return;
			}
			let i = aa(n.block);
			VG(Tl(r)), OG(r, n.key, i === "Unknown" ? "Start" : i, r$(ia(n.behavior))) || s("scroll to item effect names a row the host has not drawn.", e.effect);
		}), this.register("Scroll", (e) => {
			let t = n$(e);
			if (t === null) return;
			let n = e.effect, r = ca(n.axis) !== "Horizontal", i = KQ(t, r);
			if (i === null) {
				s("scroll effect target has no scrollable element.", e.effect);
				return;
			}
			let a = r ? i.clientHeight : i.clientWidth, o = (r ? i.scrollHeight : i.scrollWidth) - a, c = r ? i.scrollTop : i.scrollLeft, l = oa(n.position), u;
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
			let d = r$(ia(n.behavior));
			VG(i), r && l === "End" && GG(i) && BG(i), i.scrollTo(r ? {
				top: u,
				behavior: d
			} : {
				left: u,
				behavior: d
			});
		}), this.register("Show", (e) => {
			t$(n$(e), null);
		}), this.register("Hide", (e) => {
			t$(n$(e), "hidden");
		}), this.register("Collapse", (e) => {
			t$(n$(e), "collapsed");
		}), this.register("CopyToClipboard", (e) => {
			let t = a$(e, this.valueReaders);
			t !== null && o$(t).catch((e) => s("copy to clipboard failed.", e));
		}), this.register("InsertText", (e) => {
			let t = n$(e);
			t !== null && RQ(e.effect, t, e.row ?? []);
		}), this.register("OpenPicker", (e) => {
			let t = n$(e);
			t !== null && !ev(t) && s("open picker effect names no file or image input.", e.effect);
		}), this.register("OpenDialog", (e) => {
			this.applyDialogEffect(e, "OpenDialog", (e, t) => e.open(t));
		}), this.register("ShowImage", (e) => {
			let t = e.effect;
			if (this.dialogs === void 0) {
				s("show image effect arrived but no dialog engine is wired up.", t);
				return;
			}
			if (t.target === void 0 || t.target === null) {
				eQ(this.dialogs, QQ(t.images), t.startIndex ?? 0);
				return;
			}
			let n = n$(e), r = n === null ? null : tQ(n, t.rows === !0, (t) => e.dom.findEveryComponent(D(t)));
			r === null ? s("show image effect names a component that shows no picture.", t) : eQ(this.dialogs, r.pictures, r.start);
		}), this.register("CloseDialog", (e) => {
			let t = e.effect.raisesClose === !0;
			this.applyDialogEffect(e, "CloseDialog", (e, n) => t ? e.dismiss(n) : e.close(n));
		}), this.register("DownloadFile", (e) => {
			let t = e.effect;
			if (t.requestPath === void 0 || t.requestPath.length === 0) {
				s("download effect carries no path.", e.effect);
				return;
			}
			if (!yh(t.requestPath)) {
				s("download effect refused: the path's scheme is not one a link may carry.", e.effect);
				return;
			}
			let n = document.createElement("a");
			n.href = t.requestPath, n.download = t.fileName ?? "", n.style.display = "none", document.body.appendChild(n), n.click(), n.remove();
		}), this.register("ShowNotification", (e) => {
			let t = e.effect;
			if (!Ro(t.message) && !zo(t.message)) {
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
				action: this.runAction === void 0 ? void 0 : IQ(t.action, this.runAction)
			});
		}), this.register("RequestNotificationPermission", () => {
			cW() !== void 0 && Notification.requestPermission().then(() => this.clientStateChanged?.()).catch((e) => s("asking for the notification permission failed.", e));
		}), this.register("ShowSystemNotification", (e) => this.showSystemNotification(e.effect)), this.register("Announce", (e) => {
			let t = e.effect;
			if (!Ro(t.message) && !zo(t.message)) {
				s("announce effect carries no message.", e.effect);
				return;
			}
			if (this.notifications === void 0) {
				s("announce effect arrived but no notification engine is wired up.", t.message);
				return;
			}
			this.notifications.announce(t.message, la(t.politeness) === "Assertive" ? "assertive" : "polite");
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
		if (!Ro(t) && !zo(t)) {
			s("system notification effect carries no title.", e);
			return;
		}
		let n = Ro(e.body) || zo(e.body) ? e.body : void 0, r = typeof e.address == "string" && Ch(e.address) ? e.address : void 0, i = () => {
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
		if (e.when !== "Always" && sW(document.visibilityState)) {
			i();
			return;
		}
		let a = LQ(e.action);
		pW({
			title: ZQ(t),
			body: n === void 0 ? void 0 : ZQ(n),
			tag: e.tag ?? "",
			icon: typeof e.icon == "string" && Ch(e.icon) ? e.icon : $Q(),
			silent: e.silent === !0,
			requireInteraction: e.requireInteraction === !0,
			address: r ?? e$(),
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
		return t !== void 0 && n !== void 0 && hW(t) ? {
			label: Ro(e.addressLabel) || zo(e.addressLabel) ? e.addressLabel : { key: "ui.notification.open" },
			run: () => n(t)
		} : this.runAction === void 0 ? void 0 : IQ(e.action, this.runAction);
	}
};
function ZQ(e) {
	return Ro(e) ? O.translate(e.key, e.args) : zo(e) ? O.resolveText(e.text) : "";
}
function QQ(e) {
	let t = [];
	for (let n of e ?? []) typeof n?.source == "string" && t.push({
		source: n.source,
		caption: Ro(n.caption) || zo(n.caption) ? n.caption : void 0,
		altText: Ro(n.altText) || zo(n.altText) ? n.altText : void 0
	});
	return t;
}
function $Q() {
	let e = document.querySelector("link[rel~='icon']")?.href;
	return e === void 0 || e.startsWith("data:") ? void 0 : e;
}
function e$() {
	return window.location.pathname + window.location.search + window.location.hash;
}
function t$(e, t) {
	if (e === null) return;
	let n = Pf();
	for (let n of li) t === null ? e.removeAttribute(n) : e.setAttribute(n, t);
	n !== null && Ff(n);
}
function n$(e) {
	let t = e.effect.target;
	if (t === void 0 || t.id === void 0) return s("targeted client effect carries no resolved component address.", e.effect), null;
	let n = e.dom.findComponent(E(t.id), t.dynamicParameters ?? []);
	return n === null && s("client effect target was not found in the DOM.", e.effect), n;
}
function r$(e) {
	return e === "Smooth" && !lp() ? "smooth" : "auto";
}
function i$(e) {
	if (e instanceof HTMLElement && (e.tabIndex >= 0 || e.matches(bd))) {
		e.focus();
		return;
	}
	let t = Ud(e);
	if (t !== null) {
		t.focus();
		return;
	}
	s("focus effect target has nothing focusable.", e);
}
function a$(e, t) {
	let n = e.effect;
	if (typeof n.text == "string") return n.text;
	let r = n$(e);
	return r === null ? null : t === void 0 ? (s("copy to clipboard effect names a component but no value reader is wired up.", e.effect), null) : _c(r) === null ? (s("copy to clipboard effect target holds no value.", e.effect), null) : dc(t.readHeld(r));
}
async function o$(e) {
	if (navigator.clipboard !== void 0) try {
		await navigator.clipboard.writeText(e);
		return;
	} catch {}
	if (!s$(e)) throw Error("neither the clipboard API nor the selection command took the text.");
}
function s$(e) {
	let t = document.createElement("textarea");
	t.value = e, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.opacity = "0", document.body.appendChild(t), t.select();
	try {
		return BZ();
	} finally {
		t.remove();
	}
}
//#endregion
//#region src/interactions/dialog-engine.ts
var c$ = class {
	root;
	components;
	returnFocusByKey = /* @__PURE__ */ new Map();
	swipes = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, this.root.addEventListener("mousedown", (e) => l$(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0);
	}
	open(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (!t.hasAttribute("hidden")) return !0;
		t.removeAttribute("hidden");
		let n = t.querySelector(".ui-dialog__surface") ?? t, r = Ud(t), i = Id() && il(r);
		i && !n.hasAttribute("tabindex") && (n.tabIndex = -1);
		let a = nf(n, i ? n : r);
		return a !== null && this.returnFocusByKey.set(e, a), u$(t) && this.swipes.set(e, gh(n, n, () => this.dismiss(e))), !0;
	}
	close(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (t.hasAttribute("hidden")) return !0;
		let n = this.returnFocusByKey.get(e);
		return this.returnFocusByKey.delete(e), this.swipes.get(e)?.(), this.swipes.delete(e), t.contains(document.activeElement) && uf(of(n, this.components), t), t.setAttribute("hidden", ""), !0;
	}
	closeAll() {
		for (let e of this.root.querySelectorAll(`[${Am}]:not([hidden])`)) {
			let t = e.getAttribute(Am);
			t !== null && this.close(t);
		}
	}
	find(e) {
		return this.root.querySelector(`[${Am}="${w(e)}"]`);
	}
	handleClick(e) {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest(`[${Mm}]`);
		if (n === null) return;
		let r = n.closest(`[${Am}]`);
		if (!(r instanceof HTMLElement) || r.hasAttribute("hidden") || !r.hasAttribute("data-ui-dialog-close-backdrop")) return;
		let i = r.getAttribute(Am);
		i !== null && this.dismiss(i);
	}
	handleKeydown(e) {
		if (e.defaultPrevented || M(e)) return;
		let t = this.getTopmostOpen();
		if (!(t === null || zm(t))) {
			if (e.key === "Escape" && t.hasAttribute("data-ui-dialog-close-escape") && !Jm() && !Yc(e)) {
				let n = t.getAttribute(Am);
				n !== null && (e.preventDefault(), this.dismiss(n));
				return;
			}
			e.key === "Tab" && t.hasAttribute("data-ui-dialog-modal") && Jd(t, e);
		}
	}
	dismiss(e) {
		let t = this.find(e), n = t !== null && !t.hasAttribute("hidden");
		return !this.close(e) || !n || t === null ? !1 : (t.querySelector(C)?.dispatchEvent(new Event("close", { bubbles: !0 })), !0);
	}
	getTopmostOpen() {
		return Lm(this.root);
	}
};
function l$(e) {
	let t = e.target instanceof Element ? e.target.closest(`[${Mm}]`) : null;
	t !== null && t.closest("[data-ui-dialog]:not([hidden])") !== null && e.preventDefault();
}
function u$(e) {
	return e.getAttribute("data-ui-dialog-placement") === "bottom" && (e.hasAttribute("data-ui-dialog-close-backdrop") || e.hasAttribute("data-ui-dialog-close-escape"));
}
//#endregion
//#region src/interactions/leave-dialog.ts
var d$ = "ui-leave", f$ = new Tv("data-ui-leave-part"), p$ = "560px", m$ = null, h$ = null;
function g$(e, t) {
	m$ ??= _$();
	let n = m$;
	n.isConnected || document.body.append(n), v$(n, "title", O.text("ui.leave.title")), v$(n, "message", O.text("ui.leave.message")), v$(n, "stay", O.text("ui.leave.stay")), v$(n, "leave", O.text("ui.leave.confirm")), h$ = {
		dialogs: e,
		leave: t
	}, e.open(d$);
}
function _$() {
	let { dialog: e, surface: t } = wv({
		key: d$,
		className: "ui-leave-dialog",
		role: "alertdialog",
		labelledBy: "ui-leave-title",
		describedBy: "ui-leave-message",
		closesOnEscapeAndBackdrop: !0
	});
	t.style.setProperty("--ui-max-width-sm", p$);
	let n = f$.element("h2", "ui-leave-dialog__title ui-text-type--subtitle", "title"), r = f$.element("p", "ui-leave-dialog__message ui-text-type--body", "message");
	return n.id = "ui-leave-title", r.id = "ui-leave-message", t.append(n, r, f$.actions(f$.button("ui-button--ghost", "stay"), f$.button("ui-button--danger", "leave"))), e.addEventListener("click", (e) => {
		let t = f$.pressed(e);
		if (t !== "stay" && t !== "leave") return;
		let n = h$;
		h$ = null, n?.dialogs.close(d$), t === "leave" && n?.leave();
	}), e;
}
function v$(e, t, n) {
	let r = f$.find(e, t);
	r !== null && r.textContent !== n && (r.textContent = n);
}
//#endregion
//#region src/interactions/leave-guard.ts
var y$ = class {
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
		let t = b$(e, this.options.window.location.href);
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
function b$(e, t) {
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
	return Ch(s) ? s : null;
}
//#endregion
//#region src/effects/address-history.ts
var x$ = "neEntry", S$ = class {
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
		this.window = e.window, this.revisit = e.revisit, this.switchRuntime = e.switchRuntime, this.load = e.load, this.route = e.window.location.pathname, this.search = e.window.location.search, this.entry = C$(e.window.history.state) ?? 0, C$(e.window.history.state) === null && e.window.history.replaceState({ [x$]: this.entry }, ""), e.window.addEventListener("popstate", () => this.onPopState());
	}
	replace(e) {
		this.write(UQ(this.route, e), !1);
	}
	push(e) {
		let t = UQ(this.route, e), n = this.window.location;
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
		t ? (this.entry++, this.window.history.pushState({ [x$]: this.entry }, "", e)) : this.window.history.replaceState({ [x$]: this.entry }, "", e), this.search = this.window.location.search;
	}
	onPopState() {
		let e = this.window.location, t = C$(this.window.history.state), n = t === null ? null : t - this.entry;
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
		}, this.switchRuntime(e.search, r) || this.revisit(E$(e.search));
	}
};
function C$(e) {
	if (typeof e != "object" || !e) return null;
	let t = e[x$];
	return typeof t == "number" ? t : null;
}
function w$(e, t, n) {
	if (n.length === 0) return !1;
	let r = new URLSearchParams(e), i = new URLSearchParams(t);
	return n.some((e) => T$(r, e) !== T$(i, e));
}
function T$(e, t) {
	return e.getAll(t).map(encodeURIComponent).join(",");
}
function E$(e) {
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
var D$ = class {
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
		!this.state.set(e, t, n, () => k$(i[0]?.component)) && !this.restoring || o || this.notifyValueChanged({
			reference: e,
			propertyName: i[0]?.propertyName ?? this.addressResolver.getPropertyName(e.propertyId) ?? "",
			dynamicParameters: t,
			value: a,
			local: r,
			components: i.map((e) => e.component)
		});
	}
	shownValue(e, t) {
		return _s(t, () => this.addressResolver.isTranslatable(e));
	}
	holdsProperty(e, t) {
		if (!this.isHeld(e)) return !1;
		let n = e.getAttribute(Ze), r = n === null ? void 0 : this.addressResolver.getBindingById(Number(n));
		return r === void 0 || r.propertyId === t;
	}
	recordValue(e, t, n) {
		let r = this.addressResolver.resolveProperties(e, t);
		return this.state.set(e, t, n, () => k$(r[0]?.component)) ? {
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
			(typeof n == "string" || zo(n) ? this.addressResolver.isTranslatable(t.reference) : Ro(n)) && (e === void 0 || e(n)) && this.applyPropertyValue(t.reference, t.dynamicParameters, n, !1);
		}
	}
	rewriteStatic(e, t, n) {
		let r = this.addressResolver.resolvePropertyOn(e, t);
		if (r === null) return;
		let i = `[${Xe}${Li(r.propertyName)}]`;
		this.applyOperations(r, this.shownValue(t, n), (t) => Bi(e, t, () => O$(e, i)));
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
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(Ze))), r = e.closest(C);
		return n === void 0 || r === null ? !1 : this.applyToComponent(r, {
			componentId: n.componentId,
			propertyId: n.propertyId
		}, t);
	}
	restoreBoundValue(e, t) {
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(Ze)));
		if (n === void 0) return;
		let r = {
			componentId: n.componentId,
			propertyId: n.propertyId
		};
		if (!this.state.has(r, t)) {
			bc(e);
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
function O$(e, t) {
	if (e.matches(t)) return [e];
	for (let n of e.querySelectorAll(t)) if (n.closest(C) === e) return [n];
	return [e];
}
function k$(e) {
	let t = [], n = e?.closest("[data-ui-key]") ?? null;
	for (; n !== null;) {
		let e = n.parentElement?.closest(C) ?? null, r = e === null ? 0 : D(e), i = n.getAttribute(y);
		e !== null && r > 0 && i !== null && t.push({
			host: r,
			hostParameters: _a(e, ga(e)),
			key: i
		}), n = n.parentElement?.closest("[data-ui-key]") ?? null;
	}
	return t;
}
//#endregion
//#region src/updates/reactive-source-registry.ts
var A$ = "EndValue", j$ = class {
	watchers = /* @__PURE__ */ new Map();
	sourcesByComponent = /* @__PURE__ */ new Map();
	propertyPatchEngine;
	edits;
	constructor(e, t) {
		if (this.propertyPatchEngine = e, this.edits = t, e.addValueChangeHandler((e) => this.notify(e)), t !== void 0) for (let e of pf) t.root.addEventListener(e, (e) => this.applyEditedValue(e, t), !0);
	}
	watch(e, t) {
		let n = E(e.componentId), r = N$(n, e.propertyId), i = this.watchers.get(r);
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
		let t = this.edits?.root.querySelector(`[data-ui-id="${E(e.componentId)}"]`) ?? null, n = t === null ? null : M$(e, this.edits?.metadata) ? t.querySelector(`[${Bt}]`) : _c(t);
		this.edits !== void 0 && n !== null && this.propertyPatchEngine.recordValue(e, [], this.edits.valueReaders.readBound(n));
	}
	applyEditedValue(e, t) {
		if (!(e.target instanceof Element)) return;
		let n = Oa(e.target), r = n === null ? void 0 : this.sourcesByComponent.get(n);
		if (r === void 0) return;
		let i = t.valueReaders.readBound(e.target), a = e.target.hasAttribute(Bt);
		for (let e of r) {
			if (t.metadata !== void 0 && M$(e, t.metadata) !== a) continue;
			let n = this.propertyPatchEngine.recordValue(e, [], i);
			n !== null && this.notify(n);
		}
	}
	notify(e) {
		let t = N$(E(e.reference.componentId), e.reference.propertyId), n = this.watchers.get(t);
		if (n !== void 0) for (let t of n) t(e);
	}
};
function M$(e, t) {
	return t?.getPropertyDefinition(e.propertyId)?.propertyName === A$;
}
function N$(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/items/composite-slots.ts
function P$(e) {
	let t = [];
	for (let n of e.children) {
		let e = n.hasAttribute("data-ui-key") ? n.firstElementChild : null, r = e === null ? 0 : D(e);
		e !== null && r > 0 && t.push([e, r]);
	}
	return t;
}
//#endregion
//#region src/items/held-collections.ts
var F$ = class {
	collections = /* @__PURE__ */ new Map();
	rowCollections = /* @__PURE__ */ new Map();
	waiting = /* @__PURE__ */ new WeakMap();
	hold(e, t) {
		this.collections.set(e, z$(t));
	}
	apply(e) {
		let t = E(e.component?.id), n = this.collections.get(t);
		n === void 0 && (n = [], this.collections.set(t, n)), I$(n, e);
	}
	get(e) {
		return this.collections.get(e);
	}
	holdRow(e, t, n) {
		this.rowCollections.set(L$(e, t), {
			componentId: e,
			dynamicParameters: t,
			rows: z$(n)
		});
	}
	applyRow(e) {
		let t = E(e.component?.id), n = e.component?.dynamicParameters ?? [], r = L$(t, n), i = this.rowCollections.get(r);
		i === void 0 && (i = {
			componentId: t,
			dynamicParameters: n,
			rows: []
		}, this.rowCollections.set(r, i)), I$(i.rows, e);
	}
	getRow(e, t) {
		return this.rowCollections.get(L$(e, t))?.rows;
	}
	forgetRows(e, t) {
		for (let [n, r] of this.rowCollections) t(r.componentId) && R$(r.dynamicParameters, e) && this.rowCollections.delete(n);
	}
	writeRowItem(e, t, n, r) {
		let i = !1;
		for (let a of this.rowCollections.values()) {
			if (!n(a.componentId) || a.dynamicParameters.length !== e.length || !R$(a.dynamicParameters, e)) continue;
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
function I$(e, t) {
	switch ($i(t.action)) {
		case "Insert":
			for (let n of t.items ?? []) B$(e, n);
			break;
		case "Remove":
			for (let n of t.items ?? []) V$(e, n.key);
			break;
		case "Replace":
			for (let n of t.items ?? []) H$(e, n);
			break;
		case "Move":
			for (let n of t.moves ?? []) U$(e, n.key, n.newIndex);
			break;
		case "Reset": e.length = 0;
	}
}
function L$(e, t) {
	return `${e}:${ea(t)}`;
}
function R$(e, t) {
	if (e.length < t.length) return !1;
	for (let n = 0; n < t.length; n++) if (String(e[n] ?? "") !== String(t[n] ?? "")) return !1;
	return !0;
}
function z$(e) {
	let t = [];
	for (let n of e) typeof n.key == "string" && t.push({
		key: n.key,
		item: n.item
	});
	return t;
}
function B$(e, t) {
	typeof t.key == "string" && (V$(e, t.key), e.splice(W$(t.index, e.length), 0, {
		key: t.key,
		item: t.item
	}));
}
function V$(e, t) {
	let n = e.findIndex((e) => e.key === t);
	n >= 0 && e.splice(n, 1);
}
function H$(e, t) {
	if (typeof t.key != "string") return;
	let n = e.findIndex((e) => e.key === (t.oldKey ?? t.key));
	if (n < 0) {
		B$(e, t);
		return;
	}
	e[n] = {
		key: t.key,
		item: t.item
	};
}
function U$(e, t, n) {
	let r = e.findIndex((e) => e.key === t);
	if (r < 0) return;
	let [i] = e.splice(r, 1);
	e.splice(W$(n, e.length), 0, i);
}
function W$(e, t) {
	return typeof e == "number" && e >= 0 && e < t ? e : t;
}
//#endregion
//#region src/items/item-projections.ts
var G$ = class {
	byHost = /* @__PURE__ */ new Map();
	records = /* @__PURE__ */ new WeakMap();
	reported = /* @__PURE__ */ new Set();
	get isEmpty() {
		return this.byHost.size === 0;
	}
	describe(e, t) {
		this.byHost.set(e, K$(e, "", t.map((e) => e.split("."))));
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
function K$(e, t, n) {
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
	for (let [n, a] of r) i.set(n, a.whole || a.rest.length === 0 ? null : K$(e, `${t}${a.name}.`, a.rest));
	return {
		host: e,
		prefix: t,
		members: i
	};
}
function q$(e) {
	let t = new G$();
	for (let n of e.metadata.items) n.itemPaths !== null && n.itemPaths !== void 0 && t.describe(E(n.componentId), n.itemPaths);
	return t;
}
//#endregion
//#region src/items/pending-moves.ts
var J$ = class {
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
}, Y$ = class {
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
function X$(e, t) {
	let n = Z$(e[t], "Reset");
	if (n === null) return null;
	let r = E(n.component?.id), i = n.component?.dynamicParameters ?? [];
	if (r <= 0) return null;
	let a = null, o = null, s = t + 1;
	for (; s < e.length; s++) {
		let t = Z$(e[s], "Insert");
		if (t === null || E(t.component?.id) !== r || !Af(i, t.component?.dynamicParameters ?? [])) break;
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
function Z$(e, t) {
	if (e === void 0 || na(e) !== "CollectionChange") return null;
	let n = e;
	return $i(n.action) === t ? n : null;
}
//#endregion
//#region src/updates/collection-sinks.ts
var Q$ = class {
	handlers = /* @__PURE__ */ new Map();
	register(e) {
		this.handlers.set(e.kind, e.handler);
	}
	dispatch(e, t) {
		let n = this.handlers.get(e);
		return n !== void 0 && (n(t), !0);
	}
};
function $$(e, t, n, r) {
	return {
		action: $i(e.action),
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
var e1 = [], t1 = class {
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
	held = new F$();
	projections;
	touched = null;
	moves = new J$({
		indexOf: (e, t) => this.indexOfRow(e, t),
		move: (e, t, n) => this.moveRow(e, t, n)
	});
	transfers = new Y$({
		take: (e, t) => this.takeRow(e, t),
		restore: (e, t) => this.restoreRow(e, t),
		place: (e, t, n, r) => this.placeRow(e, t, n, r),
		remove: (e, t) => this.removeRow(e, t),
		holds: (e, t) => c1(G(e), t) !== null,
		itemOf: (e) => this.readItemValue(e)
	});
	constructor(e, t, n, r, i, a, o, s, c) {
		this.metadata = e, this.propertyPatchEngine = t, this.state = n, this.itemsRenderer = r, this.itemsTemplates = i, this.dom = a, this.virtualization = o, this.sinks = s, this.rowMenus = c, r.setRowFiller((e) => this.fillHeldCollections(e)), t.addValueChangeHandler((e) => this.writeHeldItemValue(e)), t.addValueChangeHandler((e) => this.touch(e.components)), this.projections = q$(e), this.projections.isEmpty || BD((e, t) => this.projections.check(e, t));
	}
	fillHeldCollections(e) {
		let t = [];
		for (let n of e.querySelectorAll(`[${b}]`)) {
			let e = Oa(n);
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
		for (let n = o1(e, t); n !== null; n = o1(e, t)) {
			t.add(n);
			let e = ka(n);
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
		let t = E(e.reference.componentId), n = e.dynamicParameters;
		if (n.length < 2 || !this.rowMenus.holds(t)) return;
		let r = this.metadata.getBindingByComponentAndPropertyId(t, e.reference.propertyId), i = r === void 0 ? null : ZD(r);
		if (i === null || i.scopeComponentId > 0 && !this.rowMenus.inOneMenu(i.scopeComponentId, t)) return;
		let a = this.state.get(e.reference, n);
		this.held.writeRowItem(n.slice(0, -1), String(n[n.length - 1] ?? ""), (e) => this.rowMenus.inOneMenu(e, t), (e) => $q(e, i.steps, a)) && this.rowMenus.heldChanged();
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
			return n === void 0 && (n = l1(e), t.set(e, n)), n;
		};
		this.registerRenderedRows(this.dom.root, n);
		for (let t of e?.updates ?? []) {
			if (na(t) !== "CollectionChange") continue;
			let e = t;
			if ($i(e.action) !== "Insert") continue;
			let r = E(e.component?.id);
			for (let t of this.findItemsHosts(r, e.component?.dynamicParameters ?? [])) {
				let i = n(t);
				for (let t of e.items ?? []) this.registerItemValue(r, i, t.key, t.item);
			}
		}
	}
	registerRenderedRows(e, t = (e) => l1(e)) {
		for (let n of e.querySelectorAll(`[${b}]`)) {
			let e = ka(n);
			if (e === null) continue;
			let r = this.metadata.getItemValues(e.componentId, e.dynamicParameters);
			this.projections.isEmpty || this.projections.mark(e.componentId, r);
			for (let i of r) this.registerItemValue(e.componentId, t(n), i.key, i.item);
		}
	}
	registerItemValue(e, t, n, r) {
		if (n == null) return;
		let i = t.get(n) ?? null;
		if (i !== null && this.readItemScope(i) === void 0 && (this.itemsRenderer.registerItemScope(i, s1(i), r), this.metadata.getItemsTemplateMetadata(e)?.composite != null)) for (let [e, t] of P$(i)) this.itemsRenderer.registerItemScope(e, t, r);
	}
	readItemScope(e) {
		let t = this.itemsRenderer.getItemScope(e);
		if (t !== void 0) return t;
		let n = e.firstElementChild;
		return n === null ? void 0 : this.itemsRenderer.getItemScope(n);
	}
	initializeItemsHosts() {
		for (let e of this.dom.root.querySelectorAll(`[${b}]`)) {
			let t = Oa(e);
			t !== null && this.syncItemsHost(e, t);
		}
	}
	resortHost(e) {
		let t = Oa(e);
		t !== null && this.syncItemsHost(e, t);
	}
	syncItemsHost(e, t) {
		iU(e, t, {
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
		let n = u() ? performance.now() : -1, r = Pf(), i = /* @__PURE__ */ new Set();
		this.touched = i;
		try {
			this.applyUpdates(t);
		} finally {
			this.touched = null;
		}
		return r !== null && Ff(r), n >= 0 && d(`applied ${t.length} server update(s)`, n), [...i];
	}
	applyUpdates(e) {
		for (let t = 0; t < e.length; t++) {
			let n = e[t];
			try {
				let r = X$(e, t);
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
		return this.dom.findComponent(e.componentId, e.dynamicParameters)?.hasAttribute(ut) === !0;
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
		this.transfers.around(e, () => this.moves.around(e, e1, () => this.refillHostRows(e, t)));
	}
	refillHostRows(e, t) {
		try {
			if (vD(e) === "virtualized") {
				let n = this.virtualization.refill(e, t.items.filter((e) => e.key !== null && e.key !== void 0).map((e) => ({
					key: e.key,
					item: e.item
				})));
				this.state.forgetRows(t.componentId, t.dynamicParameters, n);
			} else this.reconcileRows(e, t);
		} finally {
			this.afterRowsChanged(e, t.componentId);
		}
	}
	reconcileRows(e, t) {
		let n = this.itemsRenderer.getAncestorStack(e), r = l1(e), i = [], a = [], o = null;
		for (let e of t.items) {
			let c = e.key ?? null;
			if (c === null) {
				s("collection insert carried no item key.", e);
				continue;
			}
			let l = r.get(c) ?? null;
			if (r.delete(c), l !== null && Af(this.readItemValue(l), e.item)) {
				i.push(l);
				continue;
			}
			let u = this.renderItemElement(t.componentId, e.item, c, n);
			if (l !== null) {
				let e = md(l);
				e !== null && u !== null && (o = {
					row: u,
					held: e
				}), l.remove(), a.push(c);
			}
			u !== null && i.push(u);
		}
		let c = vD(e) === "windowed";
		for (let [t, n] of r) {
			let r = c ? md(n) : null;
			n.remove(), hd(e, null, r), a.push(t);
		}
		if (this.state.forgetRows(t.componentId, t.dynamicParameters, a), this.forgetHeldRows(t.componentId, t.dynamicParameters, a), a1(e, i), bO(e, i), o !== null && hd(e, o.row, o.held), c) for (let t of i) gd(e, t);
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
		switch (na(e)) {
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
		let t = E(e.address?.component?.id), n = ta(e.address?.property), r = e.address?.component?.dynamicParameters ?? [];
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
		if (E(e.address?.component?.id) <= 0) {
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
		let t = E(e.component?.id);
		if (t <= 0) {
			s("collection change update has an invalid component address.", e);
			return;
		}
		let n = e.component?.dynamicParameters ?? [], r = this.dom.findComponent(t, n), i = r?.getAttribute("data-ui-collection-sink") ?? null;
		if (this.projections.isEmpty || this.projections.mark(t, e.items ?? []), r !== null && i !== null) {
			this.sinks.dispatch(i, $$(e, r, t, n)) || s("no collection sink is registered for the kind the component names.", {
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
			a || o ? l("a collection change for a host inside an item template is held until a row draws it.", { componentId: t }) : ($i(e.action) !== "Reset" || (e.items ?? []).length > 0) && s("items host was not found for a collection change update.", e);
			return;
		}
		let u = $i(e.action) === "Move" ? r1(e.moves ?? []) : e1;
		for (let n of c) a && this.held.isWaiting(n) || this.transfers.around(n, () => this.moves.around(n, u, () => this.applyCollectionChangeToHost(n, t, e)));
	}
	applyCollectionChangeToHost(e, t, n) {
		try {
			vD(e) === "virtualized" ? this.applyVirtualizedCollectionChange(e, n) : this.applyRowsChange(e, t, n);
		} finally {
			this.afterRowsChanged(e, t);
		}
	}
	applyRowsChange(e, t, n) {
		switch ($i(n.action)) {
			case "Insert":
				this.applyCollectionInsert(e, t, n.items ?? []);
				break;
			case "Remove":
				n1(e, n.items ?? []);
				break;
			case "Replace":
				this.applyCollectionReplace(e, t, n.items ?? []);
				break;
			case "Move":
				i1(e, n.moves ?? []);
				break;
			case "Reset":
				e.replaceChildren(), xO(e);
				break;
			default: s("collection update action is not supported.", n);
		}
	}
	afterRowsChanged(e, t = Oa(e)) {
		this.touched?.add(e), t !== null && this.syncItemsHost(e, t), this.dom.invalidate(e);
	}
	indexOfRow(e, t) {
		let n = vD(e) === "virtualized" ? this.virtualization.keysOf(e)?.indexOf(t) ?? -1 : mO(e, G(e)).findIndex((e) => e.getAttribute(y) === t);
		return n < 0 ? null : n + yD(e);
	}
	moveRow(e, t, n) {
		let r = Oa(e);
		if (r === null) return;
		let i = Math.max(0, n - yD(e));
		vD(e) === "virtualized" ? this.virtualization.move(e, t, i) : i1(e, [{
			key: t,
			newIndex: i
		}]), this.afterRowsChanged(e, r);
	}
	takeRow(e, t) {
		let n = G(e), r = c1(n, t);
		if (r === null) return null;
		let i = mO(e, n), a = i.indexOf(r);
		return _O(i, r), r.remove(), this.afterRowsChanged(e), {
			element: r,
			index: a
		};
	}
	restoreRow(e, t) {
		let n = mO(e, G(e));
		rk(t.element), e.insertBefore(t.element, gO(n, t.element, t.index)), this.afterRowsChanged(e);
	}
	placeRow(e, t, n, r) {
		let i = Oa(e), a = i === null ? null : this.renderItemElement(i, n, t, this.itemsRenderer.getAncestorStack(e));
		return a === null ? null : (e.insertBefore(a, gO(mO(e, G(e)), a, r)), this.afterRowsChanged(e), a);
	}
	removeRow(e, t) {
		_O(mO(e, G(e)), t), t.remove(), this.afterRowsChanged(e);
	}
	forgetRowState(e, t, n) {
		switch ($i(n.action)) {
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
		switch ($i(t.action)) {
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
			let e = DG(r);
			e !== null && n.push(e);
		}
		return n;
	}
	applyCollectionInsert(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = mO(e, G(e));
		for (let a of n) {
			let n = a.key ?? null;
			if (n === null) {
				s("collection insert carried no item key.", a);
				continue;
			}
			let o = this.renderItemElement(t, a.item, n, r);
			o !== null && (e.insertBefore(o, gO(i, o, a.index ?? null)), gd(e, o));
		}
	}
	renderItemElement(e, t, n, r) {
		try {
			return HJ(e, t, n, r, {
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
		let r = this.itemsRenderer.getAncestorStack(e), i = G(e), a = mO(e, i), o = l1(e, i);
		for (let i of n) {
			let n = i.key ?? null;
			if (n === null) {
				s("collection replace carried no item key.", i);
				continue;
			}
			let c = o.get(i.oldKey ?? n) ?? null, l = this.renderItemElement(t, i.item, n, r);
			if (l !== null) {
				if (o.delete(i.oldKey ?? n), o.set(n, l), c !== null) {
					let t = md(c);
					yO(a, c, l), c.replaceWith(l), hd(e, l, t);
				} else e.insertBefore(l, gO(a, l, i.index ?? null));
			}
		}
	}
};
function n1(e, t) {
	let n = G(e), r = mO(e, n), i = l1(e, n), a = pd(e), o = a === null ? [] : n.filter((e) => e instanceof HTMLElement);
	for (let e of t) {
		let t = e.key ?? null, n = t === null ? null : i.get(t) ?? null;
		if (t === null || n === null) {
			s("collection remove did not resolve an item.", e);
			continue;
		}
		let c = a !== null && n instanceof HTMLElement ? ud(a, o, n) : null;
		i.delete(t), _O(r, n), n.remove();
		let l = o.indexOf(n);
		l >= 0 && o.splice(l, 1), c?.();
	}
}
function r1(e) {
	return e.map((e) => e.key).filter((e) => typeof e == "string");
}
function i1(e, t) {
	let n = G(e), r = mO(e, n), i = l1(e, n);
	for (let n of t) {
		let t = n.key === null || n.key === void 0 ? null : i.get(n.key) ?? null;
		if (t === null) {
			s("collection move did not resolve an item.", n);
			continue;
		}
		let a = vO(r, t, n.newIndex ?? null);
		e.insertBefore(t, a ?? r[r.length - 2]?.nextSibling ?? null);
	}
}
function a1(e, t) {
	let n = null;
	for (let r of t) {
		let t = n === null ? G(e)[0] ?? null : n.nextElementSibling;
		r !== t && e.insertBefore(r, t), n = r;
	}
}
function o1(e, t) {
	for (let n of e.querySelectorAll(`[${b}]`)) if (!t.has(n)) return n;
	return null;
}
function s1(e) {
	let t = D(e);
	if (t > 0) return t;
	let n = e.firstElementChild;
	return n === null ? 0 : D(n);
}
function c1(e, t) {
	return e.find((e) => e.getAttribute("data-ui-key") === t) ?? null;
}
function l1(e, t = G(e)) {
	let n = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.getAttribute(y);
		t !== null && !n.has(t) && n.set(t, e);
	}
	return n;
}
//#endregion
//#region src/interactions/validation-words.ts
function u1(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = t.message;
	return Ro(n) || zo(n) || typeof n == "string" && n.length > 0 ? {
		message: n,
		severity: f1(t.severity)
	} : void 0;
}
function d1(e) {
	let t = e.message;
	if (e.content === !0) return String(t ?? "");
	let n = O.resolve(Ro(t) || zo(t) ? t : String(t ?? ""), !0);
	return typeof n == "string" ? n : "";
}
function f1(e) {
	let t = Xi(e);
	return t === "Unknown" ? "Error" : t;
}
//#endregion
//#region src/interactions/validation-engine.ts
var p1 = "ui-validation--warning", m1 = "ui-validation--info", h1 = "ui-validation-message--marker", g1 = "top-end", _1 = "right", v1 = "--ui-validation-marker-host", y1 = "ui-validation-mark", b1 = "--ui-validation-presentation", x1 = "--ui-validation-color", S1 = "Validation", C1 = /* @__PURE__ */ new Set(["Value", "EndValue"]), w1 = /* @__PURE__ */ new Set(["Min", "Max"]), T1 = `input:not([type='hidden']), textarea, select, .${Si}[role='combobox'], [role='spinbutton']`, E1 = {
	Error: 0,
	Warning: 1,
	Info: 2
}, D1 = {
	Error: Pi,
	Warning: p1,
	Info: m1
}, O1 = `.${Pi}, .${p1}, .${m1}`, k1 = {
	Error: "danger",
	Warning: "warning",
	Info: "info"
}, A1 = {
	Error: "error",
	Warning: "warning",
	Info: "info"
}, j1 = {
	Error: `${y1}--error`,
	Warning: `${y1}--warning`,
	Info: `${y1}--info`
}, M1 = {
	error: "Error",
	warning: "Warning",
	info: "Info"
}, N1 = class {
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
		}, !0), this.applyRenderedMessages(this.root.querySelectorAll(O1)), V(this.root, O1, { childList: !0 }, (e) => this.applyRenderedMessages(e)), O.onChange(() => {
			this.applyRenderedMessages(this.root.querySelectorAll(O1)), this.rewriteMessageLines(), this.rejudgeBounds();
		}), O.onTable(() => this.rewriteShownMessages());
	}
	rewriteShownMessages() {
		for (let e of this.root.querySelectorAll(O1)) {
			let t = D(e);
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
			R1(t, I1(t) === "Error");
			let e = t.querySelector(`:scope > [${Fi}]`), n = e?.textContent ?? "";
			e !== null && n.length !== 0 && (this.recordRenderedMessage(t, e), z1(this.markerMirrors, t, e, {
				message: n,
				severity: I1(t)
			}));
		}
	}
	recordRenderedMessage(e, t) {
		if (this.renderedRead.has(e) || (this.renderedRead.add(e), this.resolveDisplay(D(e), e) !== void 0)) return;
		let n = ps(t), r = I1(e);
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
		if (e.propertyName === S1) {
			this.applyBoundMessage(e);
			return;
		}
		this.applyGivenValue(e), this.applyChangeTrigger(e);
	}
	applyGivenValue(e) {
		let t = C1.has(e.propertyName), n = w1.has(e.propertyName);
		for (let r of e.components) {
			let i = this.refusalByElement.get(r)?.property === e.propertyName, a = this.boundRefusalByElement.has(r);
			if (a && n) {
				this.judgeBounds(D(r), r);
				continue;
			}
			!i && !(a && t) || (i && this.refusalByElement.delete(r), t && this.forgetBoundRefusal(r), this.applyCurrentState(D(r), r));
		}
	}
	applyBoundMessage(e) {
		let t = E(e.reference.componentId), n = u1(e.value);
		for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) n === void 0 ? this.boundMessageByElement.delete(r) : this.boundMessageByElement.set(r, n), this.touchedElements.add(r), this.applyCurrentState(t, r);
	}
	applyChangeTrigger(e) {
		let t = E(e.reference.componentId), n = this.options.metadata.getValidationsForComponent(t).filter((t) => Yi(t.trigger) === "Change" && t.target.propertyId === e.reference.propertyId);
		if (n.length !== 0) for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) this.evaluateAndApply(t, r, n, e.value);
	}
	applyServerRefusal(e) {
		let t = E(e.address?.component?.id), n = e.address?.component?.dynamicParameters ?? [], r = e.message ?? "", i = Ro(r) || typeof r == "string" && r.length > 0;
		for (let a of this.options.dom.findAllComponents(t, n)) i ? (this.refusalByElement.set(a, {
			message: r,
			severity: f1(e.severity),
			content: e.content === !0,
			property: ta(e.address?.property)
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
		let n = j(t) || k(t) ? null : P1(t, (e) => this.readValue(e)), r = this.boundRefusalByElement.get(t)?.message;
		return F1(r, n) ? n !== null : (n === null ? this.forgetBoundRefusal(t) : (this.boundRefusalByElement.set(t, {
			message: n,
			severity: "Error"
		}), this.boundRefused.add(t), this.touchedElements.add(t), this.refusalByElement.delete(t)), this.applyCurrentState(e, t), n !== null);
	}
	readValue(e) {
		return this.options.readValue?.(e) ?? this.options.valueReaders.readBound(e);
	}
	readRuleValue(e) {
		let t = _c(e);
		return t === null ? null : this.readValue(t);
	}
	forgetBoundRefusal(e) {
		this.boundRefusalByElement.delete(e), this.boundRefused.delete(e);
	}
	rejudgeBounds() {
		for (let e of [...this.boundRefused]) e.isConnected ? this.judgeBounds(D(e), e) : this.forgetBoundRefusal(e);
	}
	mark(e, t, n) {
		t === null ? this.packageMarkByElement.delete(e) : this.packageMarkByElement.set(e, {
			message: n ?? null,
			severity: M1[t]
		}), this.applyCurrentState(D(e), e);
	}
	entryRefusal(e, t, n) {
		for (let r of this.options.metadata.getValidationsForComponent(D(e))) if (f1(r.severity) === "Error" && Yf(t, r.operator, r.value) && !Yf(n, r.operator, r.value)) return r.message;
		return null;
	}
	judge(e, t) {
		let n = null;
		for (let r of this.options.metadata.getValidationsForComponent(e)) !Yf(t, r.operator, r.value) && (n === null || E1[f1(r.severity)] < E1[f1(n.severity)]) && (n = r);
		return n === null ? null : {
			severity: A1[f1(n.severity)],
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
		L1(this.markerMirrors, t, n), this.writeMessageElsewhere(e, t, n);
	}
	writeMessageElsewhere(e, t, n) {
		let r = this.options.metadata.getValidationTarget(e);
		if (r === void 0) return;
		let i = `${E(r.message.componentId)}:${r.message.propertyId}`, a = this.messageLines.get(i);
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
		}, [], [...e.lines.values()].map(d1).join("\n"), !0);
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
			severity: f1(t.severity)
		});
		let c;
		for (let e of n) (c === void 0 || E1[e.severity] < E1[c.severity]) && (c = e);
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
		let r = this.options.metadata.getValidationsForComponent(n.componentId).filter((e) => Yi(e.trigger) === t);
		r.length !== 0 && this.evaluateAndApply(n.componentId, n.element, r, this.readRuleValue(n.element));
	}
	runSubmitValidation(e) {
		let t = !0, n = /* @__PURE__ */ new Set();
		for (let { component: r } of this.formFields(e)) {
			if (n.has(r.element)) continue;
			n.add(r.element);
			let e = this.options.metadata.getValidationsForComponent(r.componentId).filter((e) => Yi(e.trigger) === "Submit");
			e.length > 0 && (this.touchedElements.add(r.element), this.evaluateAndApply(r.componentId, r.element, e, this.readRuleValue(r.element))), this.hasError(r.componentId, r.element) && (t = !1, this.touchedElements.has(r.element) || (this.touchedElements.add(r.element), this.applyCurrentState(r.componentId, r.element)));
		}
		return t;
	}
	*formFields(e) {
		for (let t of this.root.querySelectorAll(`[${sn}="${w(e)}"]`)) {
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
			let e = [...t.element.querySelectorAll(T1)].find((e) => e.closest("[role='listbox'], [role='menu'], [role='dialog']") === null) ?? null;
			if (e !== null) return e.focus({ preventScroll: !0 }), e.scrollIntoView({
				block: "center",
				behavior: lp() ? "auto" : "smooth"
			}), !0;
		}
		return !1;
	}
	hasError(e, t) {
		if (this.boundRefusalByElement.has(t) || this.refusalByElement.get(t)?.severity === "Error") return !0;
		let n = this.failingRulesByElement.get(t);
		if (n === void 0) return !1;
		for (let t of this.options.metadata.getValidationsForComponent(e)) if (n.has(t) && f1(t.severity) === "Error") return !0;
		return !1;
	}
	evaluateAndApply(e, t, n, r) {
		let i = this.failingRulesByElement.get(t);
		i === void 0 && (i = /* @__PURE__ */ new Set(), this.failingRulesByElement.set(t, i));
		for (let e of n) Yf(r, e.operator, e.value) ? i.delete(e) : i.add(e);
		this.touchedElements.has(t) && this.applyCurrentState(e, t);
	}
};
function P1(e, t) {
	return uD(e, t) ?? (e.matches(Rk) ? VA(e) : null);
}
function F1(e, t) {
	return e === void 0 || t === null ? e === void 0 && t === null : Ro(e) && e.key === t.key && JSON.stringify(e.args) === JSON.stringify(t.args);
}
function I1(e) {
	return e.classList.contains(p1) ? "Warning" : e.classList.contains(m1) ? "Info" : "Error";
}
function L1(e, t, n) {
	for (let e of Object.values(D1)) t.classList.toggle(e, n !== void 0 && D1[n.severity] === e);
	R1(t, n?.severity === "Error");
	let r = t;
	n === void 0 ? r.style.removeProperty(x1) : r.style.setProperty(x1, `var(--ui-color-${k1[n.severity]}-ink)`);
	let i = t.querySelector(":scope > [data-ui-validation-message]") ?? t.querySelector("[data-ui-validation-message]");
	i !== null && (n?.content === !0 ? (ds(i, null), i.textContent = String(n.message ?? "")) : O.writeValue(i, null, n?.message ?? null), z1(e, r, i, n));
}
function R1(e, t) {
	for (let n of e.querySelectorAll(T1)) {
		let r = n.closest(xi);
		r !== null && e.contains(r) || (t ? n.setAttribute("aria-invalid", "true") : n.removeAttribute("aria-invalid"));
	}
}
function z1(e, t, n, r) {
	let i = getComputedStyle(n), a = i.getPropertyValue(b1).trim(), o = r !== void 0 && a === "marker";
	if (n.classList.toggle(h1, o), B1(e, t, a === "elsewhere" ? void 0 : r, n.textContent ?? "", i.getPropertyValue(v1).trim()), r !== void 0 && o) {
		n.setAttribute(ze, n.textContent ?? ""), n.setAttribute(Be, g1), n.setAttribute(He, A1[r.severity]), t.setAttribute(Ve, ""), t.contains(document.activeElement) ? wI(n) : TI(n);
		return;
	}
	n.removeAttribute(ze), n.removeAttribute(Be), n.removeAttribute(He), t.removeAttribute(Ve), TI(n);
}
function B1(e, t, n, r, i) {
	let a = e.get(t), o = n === void 0 || i.length === 0 ? null : H1(t, i);
	if (n === void 0 || o === null) {
		a !== void 0 && V1(a), e.delete(t);
		return;
	}
	let s = a ?? document.createElement("span");
	s.className = `${y1} ${j1[n.severity]}`, s.textContent = r, s.setAttribute(ze, r), s.setAttribute(Be, _1), s.setAttribute(He, A1[n.severity]), s.setAttribute(Ue, ""), s.parentElement !== o && (V1(s), o.append(s)), o.setAttribute(Ve, ""), e.set(t, s), TI(s);
}
function V1(e) {
	let t = e.parentElement;
	e.remove(), t !== null && t.querySelector(`:scope > .${y1}`) === null && t.removeAttribute(Ve);
}
function H1(e, t) {
	for (let n = e.parentElement; n !== null; n = n.parentElement) {
		let e = n.querySelector(`:scope > .${t}`);
		if (e !== null) return e;
	}
	return null;
}
//#endregion
//#region src/items/row-decorators.ts
var U1 = class {
	decorators = /* @__PURE__ */ new Map();
	register(e) {
		this.decorators.set(e.kind, e.decorate);
	}
	get(e) {
		return this.decorators.get(e);
	}
}, W1 = "card-header-shown", G1 = `[${Di}], [${Oi}], [${ki}], [${Ai}], [${ji}]`;
function K1(e) {
	let t = e.parentElement?.parentElement;
	if (t == null || !t.classList.contains("ui-card__header")) return;
	let n = !e.matches(G1);
	t.classList.contains("ui-card__header--empty") !== n && t.classList.toggle(Mi, n);
}
//#endregion
//#region src/updates/menu-surface.ts
var q1 = "menu-surface";
function J1(e) {
	let t = e.parentElement;
	if (t === null || !t.matches(".ui-context-menu, .ui-split-button__menu")) return;
	let n = WS(e);
	n === null ? t.removeAttribute(vn) : t.getAttribute("data-ui-menu-surface") !== n && t.setAttribute(vn, n);
}
//#endregion
//#region src/updates/tooltip-name.ts
var Y1 = "tooltip-name";
function X1(e, t, n) {
	let r = Sx(e.getAttribute(ze));
	if (ds(t, n), r.trim().length === 0) {
		t.hasAttribute(n) && t.removeAttribute(n);
		return;
	}
	t.getAttribute(n) !== r && t.setAttribute(n, r);
}
//#endregion
//#region src/updates/dom-operation-registry.ts
var Z1 = /* @__PURE__ */ new WeakMap(), Q1 = /* @__PURE__ */ new WeakMap(), $1 = class {
	handlers = /* @__PURE__ */ new Map();
	constructor() {
		this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(Zi(e), t);
	}
	apply(e) {
		let t = Zi(e.operation.kind), n = this.handlers.get(t);
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
		this.register("Text", (e) => {
			let t = dc(e.convertedValue);
			e.target.textContent !== t && (e.target.textContent = t), ds(e.target, null);
		}), this.register("Markup", (e) => {
			wx(e.target, fc(e.convertedValue) ? "" : dc(e.convertedValue)), ds(e.target, null);
		}), this.register("Attribute", (e) => {
			let t = s0(e.operation);
			if (ds(e.target, t), e.operation.convertsNull !== !0 && fc(e.value) || fc(e.convertedValue)) {
				o0(e.target, t);
				return;
			}
			a0(e.target, t, dc(e.convertedValue));
		}), this.register("RemoveAttribute", (e) => {
			let t = s0(e.operation);
			ds(e.target, t), o0(e.target, t);
		}), this.register("ToggleAttribute", (e) => {
			let t = s0(e.operation), n = e.operation.condition ?? "HasValue", r = !fc(e.value) && e0(e.value, n), i = e.operation.value ?? (fc(e.convertedValue) || t0(n) ? "" : dc(e.convertedValue));
			n0(e.target, i0(e), t, r, i);
		}), this.register("Class", (e) => {
			let t = !fc(e.value) && e0(e.value, e.operation.condition ?? "None") ? dc(e.convertedValue).trim() : "";
			r0(e.target, i0(e), t, RS(e.operation.converter ?? ""));
		}), this.register("ToggleClass", (e) => {
			let t = s0(e.operation), n = !fc(e.value) && e0(e.value, e.operation.condition ?? "IsTrue");
			if (e.target.classList.toggle(t, n), e.operation.converter !== null && e.operation.converter !== void 0 && e.operation.converter.trim().length > 0) {
				let t = n ? dc(e.convertedValue).trim() : "";
				r0(e.target, i0(e), t, RS(e.operation.converter));
			}
		}), this.register("Style", (e) => {
			let t = s0(e.operation), n = e.target;
			if (fc(e.value) || fc(e.convertedValue) || e.convertedValue === "") {
				n.style.getPropertyValue(t).length > 0 && n.style.removeProperty(t);
				return;
			}
			let r = dc(e.convertedValue);
			n.style.getPropertyValue(t) !== r && n.style.setProperty(t, r);
		}), this.register("Data", () => {}), this.register(Y1, (e) => X1(e.resolved.component, e.target, s0(e.operation))), this.register(MZ, (e) => FZ(e.target, e.value)), this.register(W1, (e) => K1(e.resolved.component)), this.register(vs, (e) => ys(e.target)), this.register(EZ, (e) => jZ(e.target)), this.register(gN, (e) => vN(e.target)), this.register(xN, (e) => wN(e.resolved.component)), this.register(gb, (e) => {
			let t = Ob(e.target);
			t !== "keep" && n0(e.resolved.component, gb, s0(e.operation), t === "show", "");
		}), this.register(q1, (e) => J1(e.target)), this.register("Property", (e) => {
			let t = s0(e.operation), n = e.target, r = fc(e.convertedValue) ? "" : e.convertedValue;
			n[t] !== r && (n[t] = r);
		});
	}
};
function e0(e, t) {
	switch (Qi(t)) {
		case "None": return !0;
		case "HasValue": return !fc(e);
		case "HasText": return typeof e == "string" ? e.trim().length > 0 : !fc(e) && String(e).trim().length > 0;
		case "IsTrue": return e === !0;
		case "IsFalse": return e === !1;
		case "DrawsIcon": return Hh(e).length > 0;
		default: return !fc(e);
	}
}
function t0(e) {
	let t = Qi(e);
	return t === "IsTrue" || t === "IsFalse";
}
function n0(e, t, n, r, i) {
	let a = Q1.get(e);
	a === void 0 && (a = /* @__PURE__ */ new Map(), Q1.set(e, a));
	let o = a.get(n);
	if (o === void 0 && (o = /* @__PURE__ */ new Set(), a.set(n, o)), r) {
		o.add(t), a0(e, n, i);
		return;
	}
	o.delete(t), o.size === 0 && o0(e, n);
}
function r0(e, t, n, r) {
	let i = Z1.get(e);
	i === void 0 && (i = /* @__PURE__ */ new Map(), Z1.set(e, i));
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
function i0(e) {
	return `${e.resolved.componentId}:${e.resolved.propertyId}:${e.operation.kind}:${e.operation.name ?? ""}:${e.operation.converter ?? ""}`;
}
function a0(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function o0(e, t) {
	e.hasAttribute(t) && e.removeAttribute(t);
}
function s0(e) {
	let t = e.name;
	if (t == null || t.trim().length === 0) throw Error(`Operation '${e.kind}' requires a name.`);
	return t;
}
//#endregion
//#region src/extensions/converters.ts
var c0 = class {
	converters = /* @__PURE__ */ new Map();
	constructor() {
		this.register({
			name: "*",
			canConvert: (e) => US.has(e.name),
			convert: (e) => US.get(e.name)(e.value)
		});
	}
	register(e) {
		let t = l0(e.name), n = {
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
function l0(e) {
	let t = e.trim();
	if (t.length === 0) throw Error("Converter name is required.");
	return t;
}
//#endregion
//#region src/extensions/events.ts
var u0 = class {
	definitions = /* @__PURE__ */ new Map();
	register(e) {
		let t = ua(e.name);
		if (t.length === 0) throw Error("Event name is required.");
		let n = ua(e.domEventName) || t;
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
		return this.definitions.get(ua(e));
	}
};
function d0(e, t) {
	e.root.addEventListener("toggle", (n) => {
		n.target instanceof HTMLDetailsElement && n.target.open === t && e.dispatch(n);
	}, !0);
}
function f0(e) {
	e.register({
		name: "click",
		attach: (e) => {
			e.root.addEventListener("click", e.dispatch, !0), e.root.addEventListener(cd, e.dispatch, !0);
		}
	}), e.registerNative("change"), e.registerNative("focus"), e.registerNative("blur"), e.registerNative("mouse-enter", "mouseenter"), e.registerNative("mouse-leave", "mouseleave"), e.registerNative("toggle"), e.register({
		name: "expand",
		domEventName: "toggle",
		attach: (e) => d0(e, !0)
	}), e.register({
		name: "collapse",
		domEventName: "toggle",
		attach: (e) => d0(e, !1)
	}), e.registerNative("open"), e.registerNative("close"), e.registerNative("search"), e.registerNative("enter"), e.registerNative("escape"), e.registerNative("rename"), e.registerNative("unfold"), e.registerNative("move"), e.registerNative("remove");
}
//#endregion
//#region src/extensions/extension-registry.ts
var p0 = class {
	converters = new c0();
	events = new u0();
	operations = new $1();
	valueReaders;
	collectionSinks = new Q$();
	rowDecorators = new U1();
	constructor(e, t, n, r) {
		f0(this.events), this.valueReaders = new mc(r);
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
}, m0 = "Submenu", h0 = "ui-menu__submenu", g0 = "Select", _0 = ["Header", "Separator"], v0 = {
	kind: "menu",
	decorate: y0
};
function y0(e) {
	if (_0.includes(x0(e.item, "Kind")) && e.row.setAttribute(gn, ""), !b0(e.item)) return;
	let t = e.templates.getVariantTemplate(e.componentId, m0);
	if (t === void 0) {
		s("menu submenu template was not found.", { componentId: e.componentId });
		return;
	}
	let n = e.renderer.renderFromTemplate(t, e.item, e.ancestors);
	if (n === null) return;
	e.row.setAttribute(dn, ""), x0(e.item, "Kind") === g0 && e.row.setAttribute(fn, ""), x0(e.item, "Expanded") === !0 && e.row.setAttribute(pn, "");
	let r = document.createElement("div");
	r.className = h0, r.appendChild(n), tJ(r, e.key, e.item), e.row.appendChild(r);
}
function b0(e) {
	let t = x0(e, "Items");
	return Array.isArray(t) && t.length > 0;
}
function x0(e, t) {
	let n = qD(e, t);
	return n.ok ? n.value : void 0;
}
//#endregion
//#region src/items/row-grip.ts
var S0 = {
	kind: "grip",
	decorate: C0
};
function C0(e) {
	e.row.append(w0());
}
function w0() {
	let e = document.createElement("span");
	return e.className = ve, e.setAttribute("role", "button"), O.write(e, "aria-label", "ui.row.drag"), e;
}
//#endregion
//#region src/rendering/page-culture.ts
function T0(e, t, n) {
	let r = t === null ? null : JSON.stringify(t), i = n === null ? null : JSON.stringify(D0(n));
	for (let t of e.querySelectorAll(`[${ht}]`)) E0(t, mt, r), E0(t, yt, i);
}
function E0(e, t, n) {
	n !== null && e.hasAttribute(t) && e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function D0(e) {
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
var O0 = `[${xt}]`;
function k0(e) {
	for (let t of e.querySelectorAll(O0)) t.removeAttribute(xt);
}
//#endregion
//#region src/runtime/engine-start.ts
var A0 = 2;
function j0(e, t, n) {
	let r = u() ? performance.now() : -1;
	try {
		t(n);
	} catch (t) {
		c(`the ${e} engine failed to start; the page goes on without it.`, t);
	}
	if (r >= 0) {
		let t = performance.now() - r;
		t >= A0 && l(`the ${e} engine took ${f(t)} to start.`);
	}
}
function M0(e) {
	return e.name.length > 0 ? `"${e.name}" package` : "package";
}
//#endregion
//#region src/runtime/web-ui-runtime.ts
var N0 = "ne.standard.ui.windowId", P0 = [
	500,
	1e3,
	2e3
], F0 = 3, I0 = [
	["refusal", ({ root: e }) => rq(e)],
	["file input", ({ root: e, validation: t }) => new cv({
		root: e,
		validation: t
	})],
	["image input", ({ root: e, validation: t, propertyPatchEngine: n, dialogs: r }) => new xy({
		root: e,
		validation: t,
		propertyPatchEngine: n,
		dialogs: r
	})],
	["key value action", ({ root: e, dom: t, propertyPatchEngine: n, validation: r }) => new By({
		root: e,
		dom: t,
		propertyPatchEngine: n,
		validation: r
	})],
	["field keys", ({ root: e, propertyPatchEngine: t }) => new fb({
		root: e,
		propertyPatchEngine: t
	})],
	["field box press", ({ root: e }) => new Xy({ root: e })],
	["image fallback", ({ root: e }) => new Bb({ root: e })],
	["radio group sync", ({ root: e }) => new rx({ root: e })],
	["select interaction", ({ root: e, validation: t }) => new pT({
		root: e,
		validation: t
	})],
	["search input", ({ root: e }) => new aw({ root: e })],
	["debounced commit", ({ root: e }) => new ab({ root: e })],
	["commit gate", ({ root: e, propertyPatchEngine: t }) => new MT({
		root: e,
		propertyPatchEngine: t
	})],
	["text area grow", ({ root: e, propertyPatchEngine: t }) => FT() ? void 0 : new IT({
		root: e,
		propertyPatchEngine: t
	})],
	["items selection", ({ root: e, heldRows: t }) => new wU({
		root: e,
		rows: t
	})],
	["range value", ({ root: e, propertyPatchEngine: t }) => new lE({
		root: e,
		propertyPatchEngine: t
	})],
	["color input", ({ root: e, propertyPatchEngine: t }) => new wV({
		root: e,
		propertyPatchEngine: t
	})],
	["temporal picker", ({ root: e, propertyPatchEngine: t }) => new Vj({
		root: e,
		propertyPatchEngine: t
	})],
	["theme switcher", ({ root: e, effects: t, dom: n }) => new TM({
		root: e,
		effects: t,
		dom: n
	})],
	["language switcher", ({ root: e, effects: t, dom: n }) => new PM({
		root: e,
		effects: t,
		dom: n
	})],
	["time segment", ({ root: e, propertyPatchEngine: t }) => new iG({
		root: e,
		propertyPatchEngine: t
	})],
	["timestamp", ({ root: e, propertyPatchEngine: t }) => new xG({
		root: e,
		propertyPatchEngine: t
	})],
	["file tile", ({ root: e, propertyPatchEngine: t }) => new wG({
		root: e,
		propertyPatchEngine: t
	})],
	["context menu", ({ root: e, dom: t }) => new hP({
		root: e,
		dom: t
	})],
	["split button", ({ root: e }) => new Rz({ root: e })],
	["toggle button", ({ root: e }) => new qy({ root: e })],
	["button group", ({ root: e }) => new Wz({ root: e })],
	["menu", ({ root: e }) => new FI({ root: e })],
	["action bar", ({ root: e, dom: t }) => new $P({
		root: e,
		dom: t
	})],
	["collapsible", ({ root: e }) => new TR({ root: e })],
	["menu group", ({ root: e }) => new BN({ root: e })],
	["menu search", ({ root: e }) => new KL({ root: e })],
	["side drawer", ({ root: e }) => new dR({ root: e })],
	["screen keyboard", () => new nR()],
	["grid splitter", ({ root: e }) => new zR({ root: e })],
	["pane container", ({ root: e }) => new dz({ root: e })],
	["accordion", ({ root: e }) => new Jz({ root: e })],
	["tabs", ({ root: e }) => new yB({ root: e })],
	["tabs view", ({ root: e, effects: t }) => new FW({
		root: e,
		effects: t
	})],
	["command bar", ({ root: e }) => new NB({ root: e })],
	["breadcrumbs", ({ root: e }) => new JB({ root: e })],
	["scroll anchor", ({ root: e }) => new HG({ root: e })],
	["visible keys", ({ root: e }) => new Iq({ root: e })],
	["surface press", ({ root: e }) => new GV({ root: e })],
	["text selection", ({ root: e }) => new YG({ root: e })],
	["scroll group", ({ root: e }) => new nK({ root: e })],
	["flyout interaction", ({ root: e }) => new Wg({ root: e })],
	["text fold", ({ root: e }) => new JW({ root: e })],
	["tooltip", ({ root: e }) => WF(e)]
], L0 = class {
	windowId;
	options;
	root;
	culturesLanguage = document.documentElement.lang;
	metadata = new Hi(gY());
	hydration = bY();
	renderSequence = this.hydration?.sequence ?? null;
	rewriteMoments;
	dom;
	transport;
	dispatcher;
	updateProcessor;
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
		this.options = e, this.root = e.root ?? document, this.windowId = FY(e.windowIdStorageKey ?? N0, (e) => this.reloadAsOwnTab(e)), this.dom = new Da(this.root), O.load(this.root), O.setLanguage(document.documentElement.lang), e.strings !== void 0 && O.register(e.strings), this.gateInbound(this.hydration?.words === null || this.hydration?.words === void 0 ? null : O.loadTableAsync(this.hydration.words.href)), this.extensions = new p0(e.converters, e.eventDefinitions, e.domOperations, e.valueReaders), this.extensions.registerRowDecorator(v0), this.extensions.registerRowDecorator(S0), this.extensions.registerRowDecorator(Xb);
		let t = new ha(this.dom, this.metadata), n = this.extensions.operations, r = new rX(), i = new D$(t, n, this.extensions, r);
		this.reactiveSources = new j$(i, {
			root: this.root,
			valueReaders: this.extensions.valueReaders,
			metadata: this.metadata
		}), this.dialogs = new c$({
			root: this.root,
			dom: this.dom
		}), this.notifications = new jQ({
			root: this.root,
			dom: this.dom
		}), this.address = new S$({
			window,
			revisit: (e) => void this.navigateInPlaceAsync(e),
			switchRuntime: (e, t) => this.revisitRuntime(e, t),
			load: () => window.location.reload()
		});
		let a = (e) => this.eventPipeline.dispatchCommandAsync({
			eventId: 0,
			action: e,
			dynamicParameters: []
		}).catch((e) => (s("running a notification's action failed.", e), !1)), o = (e) => mW(e, (e) => this.leaveGuard.navigate(e), (e) => void a(e)), u = DY(document.documentElement, this.windowId, o);
		this.effects = new XQ({
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
			systemNotifications: fW(u)
		});
		let d = new rp(this.metadata), f, p = new Uf(d, i, new Jf(), {
			root: this.root,
			effects: this.effects,
			dom: this.dom,
			metadata: this.metadata,
			valueReaders: this.extensions.valueReaders,
			writeBack: (e, t, n) => {
				f?.syncPropertyAsync(E(e.componentId), e.propertyId, t, n).catch((e) => s("writing an interaction's value back failed.", e));
			}
		}), m = new cY(this.dom), h = new Zq(this.metadata, m, this.extensions, n, r), g = new dY({
			root: this.root,
			render: (e, t) => h.renderPart(e, t),
			drawn: (e) => this.updateProcessor.fillDrawnPart(e),
			heldRows: (e) => this.updateProcessor.forEachHeldRow(e)
		});
		g.scan(), mP((e) => g.draw(e)), this.rowMenus = g, this.virtualization = new KJ({
			root: this.root,
			metadata: this.metadata,
			templates: m,
			renderer: h,
			state: r,
			dom: this.dom
		}), this.updateProcessor = new t1(this.metadata, i, r, h, m, this.dom, this.virtualization, this.extensions.collectionSinks, g), O.onChange(() => this.rewriteWords(i, h)), this.rewriteMoments = () => this.rewriteWords(i, h, !0), O.onMomentTick(this.rewriteMoments), new cJ({
			root: this.root,
			metadata: this.metadata,
			templates: m,
			renderer: h,
			state: r,
			propertyPatchEngine: i,
			reactiveSources: this.reactiveSources,
			virtualization: this.virtualization
		}), this.transport = new _Z(this.windowId, (e, t) => this.applyChanges(e, t, this.heldRuntime), e.signalR), this.clientState = new dW({ report: (e) => this.transport.reportClientStateAsync(e) }), this.dispatcher = new QY(this.transport), O.setAsker((e, t) => this.transport.translateAsync(e, t)), this.effects.register(Vi.SetLanguage, (e) => {
			let t = e.effect, n = t.language;
			if (typeof n != "string" || n.trim().length === 0) {
				s("set language effect carries no language.", e.effect);
				return;
			}
			let r = typeof t.href == "string" && t.href.length > 0 ? t.href : null;
			this.switchLanguageAsync(n, r).catch((e) => s("switching the page's language failed.", e));
		}), this.effects.register(Vi.SetThemeColors, (e) => {
			let t = e.effect, n = ++this.themeColorChanges;
			if (typeof t.css == "string") {
				mY(document.head, t.css);
				return;
			}
			this.transport.setThemeColorsAsync(t.colors ?? null).then((e) => {
				n === this.themeColorChanges && mY(document.head, e);
			}).catch((e) => s("applying the reader's colours failed.", e));
		});
		let _ = new SZ(this.transport);
		f = new vf({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: _,
			valueReaders: this.extensions.valueReaders,
			recordSent: (e, t, n) => i.recordValue(e, t, n),
			refuses: (e) => v.refusesBounds(e)
		}), i.setHeldTargets((e) => f?.isHeld(e) === !0), this.settleValues = async () => {
			nb(), await _.whenAnsweredAsync();
		}, this.effects.register(Vi.DiscardForm, (e) => {
			let t = e.effect.formId;
			if (typeof t == "string" && t.length !== 0) {
				for (let n of f?.releaseForm(t) ?? []) i.restoreBoundValue(n, e.dom.resolveNearestComponent(n, () => !0)?.dynamicParameters ?? []);
				v.discardForm(t);
			}
		}), this.leaveGuard = new y$({
			window,
			ask: async (e) => (await f?.whenSent(), (await this.transport.requestLeaveAsync(e)).command?.effects),
			apply: (e) => {
				this.effects.applyAll(e, this.dom), this.windows.reconsider();
			},
			confirm: (e, t) => g$(this.dialogs, t),
			pending: () => tb() || _.isBusy,
			settle: () => this.settleValues(),
			follow: (e) => this.followInPlace(e)
		}), this.updateProcessor.addPageHandler((e) => this.leaveGuard.set(e.holdsUnsavedWork === !0)), this.effects.register(Vi.ConfirmLeave, (e) => {
			let t = e.effect.target;
			if (!Ch(t)) {
				s("confirm leave effect names no address of this site; nothing asked.", e.effect);
				return;
			}
			this.leaveGuard.confirm(t);
		});
		let v = new N1({
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
		for (let [e, t] of I0) j0(e, t, this.engineContext);
		j0("number input", ({ root: e, propertyPatchEngine: t }) => {
			this.numberInputs = new cD({
				root: e,
				propertyPatchEngine: t
			});
		}, this.engineContext), j0("tree", ({ root: e, effects: t }) => new $U({
			root: e,
			effects: t,
			rules: {
				metadata: this.metadata,
				state: r,
				renderer: h
			}
		}), this.engineContext), j0("items reorder", ({ root: e }) => new UO({
			root: e,
			services: {
				metadata: this.metadata,
				state: r,
				keysOf: (e) => this.virtualization.keysOf(e)
			}
		}), this.engineContext), j0("press ripple", ({ root: e }) => document.documentElement.hasAttribute("data-ui-press-ripple") ? new mK({
			root: e,
			clicks: (e) => this.metadata.hasServerEventForComponent("click", D(e)) || p.hasEventForComponent("click", D(e))
		}) : void 0, this.engineContext), j0("overlay scrollbars", () => document.documentElement.hasAttribute("data-ui-overlay-scrollbars") ? new AK() : void 0, this.engineContext), this.eventPipeline = new Ef({
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
		this.eventPipeline.addEvent(jW.name, jW.registration);
		let ee = (e) => this.updateProcessor.resortHost(e), te = BO({
			ahead: (e, t, n) => this.updateProcessor.moves.ahead(e, t, n),
			settle: (e) => this.updateProcessor.moves.settle(e),
			resort: ee
		});
		this.eventPipeline.addEvent(te.name, te.registration);
		let ne = NW(ee);
		this.eventPipeline.addEvent(ne.name, ne.registration);
		let re = Sk(this.updateProcessor.transfers);
		for (let e of this.metadata.getEventNames()) e.startsWith("drop:") && this.eventPipeline.addEvent(e, re);
		this.eventPipeline.addEvent(ub.name, ub.registration), j0("shortcuts", ({ root: e, dom: t }) => new KI({
			root: e,
			viewShortcuts: qI(this.metadata.metadata),
			componentOf: (e) => t.findComponent(e, []),
			laterChords: this.rowMenus
		}), this.engineContext), j0("item drag", ({ root: e, dom: t }) => new Tk({
			root: e,
			targetOf: (e, n) => {
				let r = t.resolveNearestComponent(e, (e) => this.metadata.hasServerEventForComponent("drop:" + n, e))?.element ?? null;
				return r instanceof HTMLElement ? r : null;
			},
			keysOf: (e) => this.virtualization.keysOf(e)
		}), this.engineContext), this.tables = new EH({ root: this.root }), this.windows = new wJ({
			root: this.root,
			requestWindow: (e) => this.transport.requestItemWindowAsync(e)
		}), j0("pager", ({ root: e, dom: t }) => new kL({
			root: e,
			dom: t,
			windows: this.windows
		}), this.engineContext), this.pluginContext = {
			...this.engineContext,
			strings: O,
			observeComponents: V,
			observeSize: AR,
			store: new mN(),
			numbers: zE,
			temporal: _o,
			icons: { apply: zh },
			badges: { writeCount: IC },
			urls: {
				isImageSource: Dh,
				asBrowserReads: Eh,
				isSafeLink: yh,
				isExternalLink: Sh
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
				let r = e.closest(C), a = r === null ? void 0 : this.metadata.getExposedProperty(D(r), t);
				return r === null || a === void 0 ? (s("a package set a property its component's renderer did not expose.", { propertyName: t }), !1) : i.applyToComponent(r, a, n);
			} },
			windows: this.windows,
			tooltips: CI,
			renames: { open: Vc },
			tables: this.tables,
			rows: Xq(m, h, this.virtualization),
			uploads: Z_(v),
			selection: fu,
			popups: xq(this.dom),
			roving: xl,
			typeAhead: yM,
			focus: Wd,
			states: Ms,
			validation: v,
			wheel: jv,
			colors: kq,
			shortcuts: sl,
			names: Ii
		}, this.transport.onChanges((e, t) => void this.applyChanges(e, void 0, t)), this.transport.onCommandResult((e, t) => {
			let { changes: n, ...r } = e;
			nX(() => this.applyChanges(n, void 0, t), () => {
				!this.holdsRuntime(t) || this.dispatcher.settle(r) || (this.effects.applyAll(e.command?.effects, this.dom), this.windows.reconsider());
			}).catch((e) => c("a pushed command result could not be applied.", e));
		}), this.updateProcessor.addFullResyncHandler(() => {
			this.attachAsync().catch((e) => c("re-attaching after a full resync failed.", e));
		}), this.transport.onReconnecting((e) => {
			s("SignalR reconnecting.", e), this.dispatcher.release(Error("the connection to the server dropped before the command answered.", { cause: e }));
		}), this.transport.onReconnected(async () => {
			l("SignalR reconnected. Reattaching runtime."), await this.attachAsync();
		}), this.transport.onClosed((e) => this.loseConnection(e ?? /* @__PURE__ */ Error("the connection to the server closed."))), this.connection = new WY({
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
		let t = _c(e);
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
		return r.length > 0 && this.heldRuntime !== null && !this.connectionLost && e === window.location.pathname && U0() === null && w$(t, n, r);
	}
	async switchRuntimeAsync() {
		try {
			await this.settleValues();
		} catch (e) {
			s("the values still on their way did not settle before the page went to another runtime.", e);
		}
		this.dialogs.closeAll(), this.dispatcher.release(/* @__PURE__ */ Error("the page went to another runtime of its route before the command answered.")), this.transport.holdCalls();
		let e = z0();
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
		this.dom.invalidate(), O.language !== this.culturesLanguage && (this.culturesLanguage = O.language, gs(this.root, (e) => T0(e, O.number, O.temporal)));
		let i = n ? Ho : void 0;
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
		gs(this.root, (e) => {
			e !== this.root && r.push(e);
		});
		for (let t of n) {
			let n = E(t.componentId), i = {
				componentId: n,
				propertyId: t.propertyId
			}, a = t.dynamicParameters ?? [];
			for (let r of this.findWordInstances(n, a)) e.rewriteStatic(r, i, t.key);
			for (let o of r) for (let r of o.querySelectorAll(`[${ie}="${w(n)}"]`)) ya(r, a) && e.rewriteStatic(r, i, t.key);
		}
	}
	findWordInstances(e, t) {
		if (t.length === 0) return this.dom.findEveryComponent(e);
		let n = this.dom.findAllComponents(e, t);
		return n.length > 0 ? n : this.dom.findAllComponents(e, []).filter((e) => ya(e, t));
	}
	loseConnection(e) {
		if (this.connectionLost) return;
		this.connectionLost = !0, c("the connection to the server is lost; the page offers a reload.", e), this.connection.lost();
		let t = Error("the connection to the server is lost; reload the page.", { cause: e });
		this.transport.close(t), this.dispatcher.release(t), this.notifications.show({
			message: O.text("ui.connection.lost"),
			severity: "danger",
			sticky: !0,
			connection: !0,
			action: {
				label: O.text("ui.connection.reload"),
				run: () => {
					this.leaveGuard.release(), window.location.reload();
				}
			}
		});
	}
	reloadForView(e) {
		let t = jY(e, navigator.cookieEnabled, NY());
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
	reloadAsOwnTab(e) {
		s("another live tab holds this tab's id; reloading under one of its own.", { id: e }), this.leaveGuard.release(), window.location.reload();
	}
	reloadForFreshRuntime(e) {
		if (jY(e, navigator.cookieEnabled, NY()) !== "reload") {
			this.loseConnection(/* @__PURE__ */ Error("the server holds a new runtime for this page again after a reload for one."));
			return;
		}
		s("the page's runtime is gone and the server built a new one; reloading.", { view: e }), this.leaveGuard.release(), window.location.reload();
	}
	get instanceId() {
		return this.transport.instanceId;
	}
	async startAsync() {
		v(this, this.options.handlerGlobalKey), IZ(this.root), await H0();
		let e = this.connectAsync();
		await this.hydrateAsync(), this.startEnginesAwaitingHydration(), k0(this.root), this.clientState.start(), await e && (await this.attachAsync(), this.connectionLost || l(`page live ${f(performance.now())} after the navigation started.`));
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
		return us(this.root) || yY(this.hydration) || this.metadata.getWords().some((e) => Ho(e.key)) || Ho(this.metadata.metadata.itemValues);
	}
	startEnginesAwaitingHydration() {
		let e = this.enginesAwaitingHydration ?? [];
		this.enginesAwaitingHydration = null;
		for (let t of e) j0(M0(t), t, this.pluginContext);
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
		if (this.enginesAwaitingHydration !== null) {
			this.enginesAwaitingHydration.push(e);
			return;
		}
		j0(M0(e), e, this.pluginContext);
	}
	applyChanges(e, t, n) {
		if (this.inbound === null && !YY(e)) {
			t?.(), this.holdsRuntime(n) && this.applyNow(e);
			return;
		}
		let r = this.transport.instanceId, i = (this.inbound ?? Promise.resolve()).then(async () => {
			t?.(), this.holdsRuntime(n) && this.applyNow(await XY(e, r));
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
		this.windows.sync(this.updateProcessor.applyChangeSet(e));
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
			if (e >= F0) {
				this.loseConnection(/* @__PURE__ */ Error("the page fell behind the server on every attach."));
				return;
			}
		}
	}
	async attachCoreAsync() {
		if (this.connectionLost) return !1;
		let e = window.location.search, t = this.createAttachRequest(e), n = this.holdInbound(), r = performance.now();
		try {
			let i = await SY(() => this.transport.attachAsync(t), () => this.transport.isReconnecting, P0, V0), a = performance.now();
			if (i === null) return this.loseConnection(/* @__PURE__ */ Error("attaching the runtime failed after retrying.")), !1;
			if (i === "reconnecting") return !1;
			if (i.reload === !0) return this.reloadForView(this.hydration?.view ?? ""), !1;
			if (i.fresh === !0) return this.reloadForFreshRuntime(this.hydration?.view ?? ""), !1;
			MY(NY()), this.heldRuntime = i.runtime ?? null, this.runtimeSearch = e, this.dom.rebuild(), this.updateProcessor.registerServerRenderedItems(i.initialChanges), await n.previous;
			let o = z0();
			return t.switchRuntime && (this.pageId = null, o !== null && this.windows.forget(o)), this.leaveGuard.set(!1), await this.applyAttachChangesAsync(i.initialChanges), this.updateProcessor.initializeItemsHosts(), t.switchRuntime && B0(o), this.releaseInertContent(), this.windows.start(), d("runtime attached", r, {
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
		let t = U0(), n = t === null && this.heldRuntime !== null && w$(e, this.runtimeSearch, this.hydration?.identity ?? []), r = {
			clientWindowId: this.windowId,
			route: t?.route ?? window.location.pathname,
			pageId: n ? null : this.pageId,
			view: this.hydration?.view ?? null,
			since: this.renderSequence,
			runtime: this.heldRuntime,
			parameters: t === null ? E$(e) : t.parameters,
			timeZone: CY(),
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
			let t = YY(e) ? await XY(e, this.transport.instanceId) : e;
			this.releaseInertContent(), this.applyNow(t);
		} catch (e) {
			c("a staged value of the attach could not be fetched; the page attaches again.", e), this.reattachRequested = !0;
		}
	}
	releaseInertContent() {
		this.inertContent?.removeAttribute("inert"), this.inertContent = null;
	}
};
async function R0(e = {}) {
	let t = performance.now(), n = new L0(e);
	return d("runtime built", t), await n.startAsync(), n;
}
function z0() {
	return document.querySelector(`[${Mn}="${DZ}"]`);
}
function B0(e) {
	if (document.scrollingElement?.scrollTo({
		top: 0,
		left: 0,
		behavior: "instant"
	}), e !== null) for (let t of [e, ...e.querySelectorAll("*")]) GG(t) && !(vD(t) === "windowed" && KG(t)) ? (BG(t), t.scrollTo({
		top: t.scrollHeight,
		left: 0,
		behavior: "instant"
	})) : (t.scrollTop !== 0 || t.scrollLeft !== 0) && t.scrollTo({
		top: 0,
		left: 0,
		behavior: "instant"
	});
}
function V0(e) {
	return new Promise((t) => window.setTimeout(t, e));
}
function H0() {
	let e = performance.getEntriesByType("navigation")[0];
	return document.readyState === "complete" || e !== void 0 && e.domContentLoadedEventStart > 0 ? Promise.resolve() : new Promise((e) => document.addEventListener("DOMContentLoaded", () => e(), { once: !0 }));
}
function U0() {
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
_(), R0().catch((e) => {
	c("Web client failed to start.", e);
});
//#endregion
