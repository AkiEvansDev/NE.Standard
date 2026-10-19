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
var y = "data-ui-id", ie = "data-ui-context", ae = "data-ui-pc", b = "data-ui-key", oe = "data-ui-unselectable", se = "data-ui-undraggable", ce = "data-ui-unremovable", le = "data-ui-unrenamable", ue = "data-ui-no-context-menu", de = "data-ui-no-row-open", fe = "data-ui-no-row-drag", pe = "data-ui-drag-kind", me = "data-ui-drag-source", he = "data-ui-item-drop-over", ge = "data-ui-drop-boxed", _e = "ui-row__grip", ve = "data-ui-row-drop", ye = "data-ui-tabs-none-removable", be = "data-ui-tabs-draggable", xe = "data-ui-tabs-menu", Se = "data-ui-context-menu", Ce = "data-ui-context-menu-owner", we = "data-ui-context-menu-later", Te = "data-ui-context-menu-template", Ee = "data-ui-context-menu-use", De = "data-ui-action-bar", Oe = "data-ui-action-bar-key", ke = "data-ui-action-bar-rest", Ae = "data-ui-menu-left-out", je = "data-ui-in-action-bar", Me = "ui-action-bar", Ne = "data-ui-row-focus", Pe = "data-ui-row-cursor-waits", Fe = "data-ui-tab-out", Ie = "data-ui-cell-focus", Le = "ui-cell-key", Re = "data-ui-tooltip", ze = "data-ui-tooltip-placement", Be = "data-ui-tooltip-plain", Ve = "data-ui-tooltip-mark", He = "data-ui-tooltip-severity", Ue = "data-ui-tooltip-press", We = "data-ui-badge-text", Ge = "data-ui-badge-set", Ke = "data-ui-badge-icon", qe = "data-ui-folds", Je = "data-ui-name", Ye = "data-ui-bind-", Xe = "data-ui-into-", Ze = "data-ui-bind-value", Qe = (e) => `data-ui-no-${e}`, $e = "data-ui-event-boundary", et = "data-ui-image-caption", tt = "data-ui-image-crop", nt = "data-ui-image-crop-size", rt = "ui-image", it = "ui-image__picture", at = "ui-image--circle", ot = "data-ui-fallback-src", st = "data-ui-fallback-icon", ct = "data-ui-image-failed", lt = "data-ui-icon-failed", x = "data-ui-items-host", ut = "data-ui-items-empty", dt = "data-ui-collection-sink", ft = "data-ui-items-query", pt = "data-ui-first-visible-key", mt = "data-ui-last-visible-key", ht = "data-ui-number-culture", gt = "data-ui-page-culture", _t = "data-ui-pager-target", vt = "data-ui-pager-page", yt = "data-ui-pager-size", bt = "data-ui-temporal-culture", xt = "data-ui-temporal", St = "data-ui-awaits-draw", Ct = "ui-timestamp", wt = "ui-timestamp__text", Tt = "data-ui-timestamp-format", Et = "ui-file-tile", Dt = "ui-file-tile__glyph", Ot = "ui-file-tile__name", kt = "ui-file-tile__size", At = "data-ui-file-name", jt = "data-ui-file-type", Mt = "data-ui-file-size", Nt = "data-ui-file-icon", Pt = "data-ui-empty-template", Ft = "data-ui-group-template", It = "data-ui-empty-placeholder", Lt = "data-ui-group-header", Rt = "data-ui-group-anchor", zt = "data-ui-group", Bt = "data-ui-value-holder", Vt = "data-ui-value-end", Ht = "data-ui-value-kind", Ut = "items-query", Wt = "first-visible-key", Gt = "last-visible-key", Kt = "data-ui-host-mode", qt = "data-ui-host-viewport", Jt = "data-ui-scroll-group", Yt = "data-ui-scroll-lines", Xt = "data-ui-source-line", Zt = "data-ui-window-spacer", Qt = "data-ui-window-pending", $t = "data-ui-window-paged", en = "data-ui-window-size", tn = "data-ui-window-offset", nn = "data-ui-window-total", rn = "data-ui-window-more-before", an = "data-ui-window-more-after", on = "data-ui-window-group-before", sn = "data-ui-window-aggregates", cn = "data-ui-form-id", ln = "data-ui-forms", un = "data-ui-visibility", dn = "data-ui-collapsed", fn = "data-ui-menu-group", pn = "data-ui-menu-select", mn = "data-ui-menu-open", hn = "data-ui-menu-holds-current", gn = "data-ui-menu-icons", _n = "data-ui-menu-passive", vn = "data-ui-menu-item-shortcut", yn = "data-ui-menu-surface", bn = "data-ui-menu-search", xn = "data-ui-menu-searching", Sn = "data-ui-menu-unmatched", Cn = "data-ui-drawer-toggle", wn = "data-ui-drawer-open", Tn = "data-ui-drawer-switch", En = "data-ui-drawer-switch-row", Dn = "data-ui-side-drawers", On = "data-ui-drawer-pin";
function kn(e) {
	return e === "right-side" ? "data-ui-pinned-right-side" : "data-ui-pinned-left-side";
}
var An = "data-ui-bottom-bar", jn = "data-ui-rail-drawer", Mn = "data-ui-menu-rail-tiers", Nn = "data-ui-window-foot", Pn = "data-ui-content-fills", Fn = "data-ui-region", In = "data-ui-menu-item-kind", Ln = "ui-menu", Rn = "ui-menu-item", zn = "ui-menu-item--checked", Bn = "ui-menu-item--selected", Vn = "ui-menu--rail", Hn = "ui-menu--nested", Un = `[${In}="header"], [${In}="separator"]`, Wn = `[${fn}] > .${Rn}`, Gn = `.${Rn}:not(${Un})`;
`${Wn}${Rn}${In}`;
var Kn = "data-ui-shortcut", qn = "data-ui-collapse-toggle", Jn = "data-ui-folding", Yn = "data-ui-column-limits", Xn = "data-ui-row-limits", Zn = "data-ui-splitter-step", Qn = "data-ui-splitter-position", $n = "data-ui-pane-layout", er = "data-ui-pane", tr = "data-ui-pane-columns", nr = "data-ui-pane-rows", rr = "data-ui-table-column", ir = "data-ui-table-hide-below", ar = "data-ui-table-starts-hidden", or = "data-ui-table-hidden", sr = "ui-table__row", cr = "ui-table__scroll", lr = "ui-table__header", ur = "ui-table__resizer", dr = "ui-tree", fr = "ui-tree__row", pr = "ui-tree-node", mr = "data-ui-tree-drop", hr = "ui-tree__row--filtered", gr = "data-ui-table-last", _r = "data-ui-table-reordering", vr = "data-ui-table-dragging", yr = "data-ui-table-drop", br = "data-ui-table-scrolled", xr = "data-ui-table-scrollbar", Sr = "data-ui-no-row-select", Cr = "data-ui-tree-parent", wr = "data-ui-tree-children", Tr = "data-ui-tree-folder", Er = "data-ui-tree-expanded", Dr = "data-ui-tree-title", Or = "data-ui-tree-loading", kr = "data-ui-tree-drop-target", Ar = "data-ui-tree-boot", jr = "data-ui-tree-draggable", Mr = "data-ui-row-editing", Nr = "data-ui-boxed-editor", Pr = "data-ui-row-idle", Fr = "data-ui-step-collapsed", Ir = "data-ui-step-end", Lr = "data-ui-row-bar", Rr = "data-ui-image-source", zr = "data-ui-file-max-size", Br = "data-ui-file-pick", Vr = "data-ui-file-drop-target-id", Hr = "data-ui-press-ripple", Ur = "data-ui-service-worker", Wr = "data-ui-theme", Gr = "data-ui-theme-colors", Kr = "data-ui-words", qr = "data-ui-language-switcher", Jr = "data-ui-theme-switcher", Yr = "data-ui-theme-choice", Xr = "field", Zr = "data-ui-language", Qr = "data-ui-splitting", $r = "data-ui-keyboard-up", ei = "data-ui-window-foot-edge", ti = "data-ui-connection", ni = "data-ui-pending", ri = "data-ui-split-folded", ii = "data-ui-split-edge", ai = "data-ui-pointer-focus", oi = "data-ui-focus-within", si = "data-ui-popup-hover", ci = "data-ui-inner-pointer", li = "data-ui-selection", ui = "data-ui-selected", di = "data-ui-selected-key", fi = "data-ui-selected-keys", pi = "data-ui-bind-selected-key", mi = "data-ui-tabs-selected", hi = "data-ui-tab-caption", gi = "data-ui-tab-key", _i = "data-ui-tab-page", vi = "data-ui-tab-actions", yi = "data-ui-tab-pinned", bi = [
	un,
	"data-ui-visibility-sm",
	"data-ui-visibility-md",
	"data-ui-visibility-xl",
	"data-ui-visibility-xxl"
], xi = "data-ui-submit-form-id", S = `[${y}]`, Si = "data-ui-href", Ci = "ui-disabled", wi = "ui-loading", Ti = "ui-readonly", Ei = "ui-hidden", Di = "ui-dialog__surface", Oi = "ui-flyout__content", ki = `.ui-context-menu, .ui-split-button__menu, .${Oi}`, Ai = "data-ui-focus-holder", ji = "data-ui-owns-keys", Mi = "[role='listbox'], [role='menu'], [role='dialog']", Ni = "ui-select__trigger", Pi = `.${Ni}`, Fi = "ui-button", Ii = "ui-button--ghost", Li = "ui-button--small", Ri = `${Fi} ${Ii} ${Li}`, zi = "ui-select", Bi = "data-ui-text-title", Vi = "data-ui-text-description", Hi = "ui-text__description", Ui = "data-ui-plain-text", Wi = "data-ui-autolinks", Gi = "data-ui-text-icon", Ki = "data-ui-text-badge-icon", qi = "data-ui-text-badge-text", Ji = "ui-card__header--empty", Yi = "ui-text-input", Xi = "ui-invalid", Zi = "data-ui-validation-message", Qi = {
	componentId: y,
	key: b,
	selected: ui,
	selectedKey: di,
	selectedKeys: fi,
	unselectable: oe,
	rowFocus: Ne,
	cellFocus: Ie,
	cellKey: Le,
	itemsHost: x,
	valueHolder: Bt,
	bindValue: Ze,
	noRowOpen: de,
	noRowDrag: fe,
	eventBoundary: $e,
	focusHolder: Ai,
	ownsKeys: ji,
	tooltip: Re,
	tooltipPlacement: ze,
	contextMenu: Se,
	contextMenuUse: Ee,
	actionBar: De,
	actionBarKey: Oe,
	actionBarRest: ke,
	disabledClass: Ci,
	loadingClass: wi,
	readOnlyClass: Ti,
	hiddenClass: Ei,
	buttonClass: Fi,
	ghostButtonClass: Ii,
	smallButtonClass: Li,
	selectClass: zi,
	textInputClass: Yi,
	invalidClass: Xi,
	validationMessage: Zi,
	sourceLine: Xt,
	textDescription: Vi,
	popupSelector: Mi,
	listTriggerSelector: Pi,
	tableRowClass: sr,
	tableScrollClass: cr,
	tableHeaderClass: lr,
	tableResizerClass: ur,
	tableHidden: or,
	hostMode: Kt,
	windowOffset: tn,
	windowTotal: nn,
	windowSize: en,
	windowMoreAfter: an,
	windowAggregates: sn,
	itemsQuery: ft,
	valueKind: Ht,
	itemsQueryKind: Ut,
	menuItemClass: Rn,
	menuItemKind: In,
	menuItemCheckedClass: zn
};
function C(e) {
	return String(e).replace(/[\\"]/g, "\\$&").replace(/[\u0000-\u001f\u007f]/g, (e) => `\\${e.charCodeAt(0).toString(16)} `);
}
function $i(e) {
	return e.replace(/(\p{Ll})(\p{Lu})/gu, "$1-$2").replace(/([\p{L}\p{Nd}])(\p{Lu}\p{Ll})/gu, "$1-$2").replace(/_/g, "-").toLowerCase();
}
var ea = 0;
function ta(e, t) {
	return e.id.length === 0 && (ea++, e.id = `${t}-${ea}`), e.id;
}
function w(e, t, n) {
	n === null ? e.removeAttribute(t) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/addressing/operation-targets.ts
function na(e, t, n) {
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
var ra = {
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
	ShowImage: "ShowImage",
	DevelopmentReport: "DevelopmentReport"
}, ia = Object.freeze([]), aa = class {
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
	validationsAgainstComponentId = /* @__PURE__ */ new Map();
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
		return this.bindingsByComponentAndPropertyId.get(ja(e, t));
	}
	getBindingByComponentAndPropertyName(e, t) {
		return this.bindingsByComponentAndPropertyName.get(ja(e, Aa(t)));
	}
	getEvent(e, t) {
		return this.eventsByComponentAndName.get(Ma(e, t));
	}
	hasServerEvent(e) {
		return this.eventNames.has(ka(e));
	}
	getEventNames() {
		return this.eventNames;
	}
	hasServerEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(ka(e))?.has(t) === !0;
	}
	getItemsTemplateMetadata(e) {
		return this.itemsTemplatesByComponentId.get(e);
	}
	getItemsFilterSortMetadata(e) {
		return this.itemsFilterSortByComponentId.get(e);
	}
	getItemValues(e, t = []) {
		return this.itemValuesByAddress.get(Na(e, t))?.items ?? [];
	}
	getValidationsForComponent(e) {
		return this.validationsByComponentId.get(e) ?? ia;
	}
	getValidationsAgainst(e) {
		return this.validationsAgainstComponentId.get(e) ?? ia;
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
		r > 0 && this.bindingsById.set(r, e), this.bindingsByComponentAndPropertyId.set(ja(t, e.propertyId), e), this.bindingsByComponentAndPropertyName.set(ja(t, n.propertyName), e);
	}
	addEvent(e) {
		let t = ka(e.eventName), n = T(e.componentId);
		if (t.length === 0 || n <= 0) return;
		this.eventsByComponentAndName.set(Ma(n, t), e), this.eventNames.add(t);
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
		t > 0 && this.itemValuesByAddress.set(Na(t, e.dynamicParameters ?? []), e);
	}
	addValidation(e) {
		let t = T(e.target?.componentId);
		if (t <= 0) return;
		oa(this.validationsByComponentId, t, e);
		let n = T(e.valueSource?.componentId);
		n > 0 && oa(this.validationsAgainstComponentId, n, e);
	}
};
function oa(e, t, n) {
	let r = e.get(t);
	r === void 0 ? e.set(t, [n]) : r.push(n);
}
function sa(e, t) {
	return typeof e == "number" ? t[e] ?? "Unknown" : e != null && t.includes(e) ? e : "Unknown";
}
function ca(e) {
	return sa(e, [
		"Dynamic",
		"Fixed",
		"Scope"
	]);
}
function la(e) {
	return e == null ? "OneWay" : sa(e, [
		"OneWay",
		"TwoWay",
		"OneWayToSource",
		"OnSubmit"
	]);
}
function ua(e) {
	return sa(e, ["Property", "Event"]);
}
function da(e) {
	return e == null ? "SetProperty" : sa(e, [
		"SetProperty",
		"Effect",
		"CopyValue"
	]);
}
function fa(e) {
	return sa(e, [
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
function pa(e) {
	return sa(e, ["Ascending", "Descending"]);
}
function ma(e) {
	return sa(e, [
		"Change",
		"Blur",
		"Submit"
	]);
}
function ha(e) {
	return sa(e, [
		"Error",
		"Warning",
		"Info"
	]);
}
function ga(e) {
	return typeof e == "string" ? e : sa(e, [
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
function _a(e) {
	return sa(e, [
		"None",
		"HasValue",
		"HasText",
		"IsTrue",
		"IsFalse",
		"DrawsIcon"
	]);
}
function va(e) {
	return sa(e, [
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
function ya(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function ba(e) {
	return typeof e == "string" ? e : "";
}
function xa(e) {
	return sa(e.kind, [
		"Value",
		"CollectionChange",
		"FullResync",
		"Validation",
		"Page"
	]);
}
function Sa(e) {
	return typeof e == "string" ? e.trim() : "";
}
function Ca(e) {
	return sa(e, ["Auto", "Smooth"]);
}
function wa(e) {
	return sa(e, [
		"Start",
		"Center",
		"End",
		"Nearest"
	]);
}
function Ta(e) {
	return sa(e, [
		"Start",
		"End",
		"Offset",
		"PageBack",
		"PageForward"
	]);
}
function Ea(e) {
	return sa(e, ["Light", "Dark"]);
}
function Da(e) {
	return sa(e, ["Horizontal", "Vertical"]);
}
function Oa(e) {
	return sa(e, ["Polite", "Assertive"]);
}
function ka(e) {
	return e?.trim().toLowerCase() ?? "";
}
function Aa(e) {
	return e?.trim() ?? "";
}
function ja(e, t) {
	return `${e}:${Aa(t)}`;
}
function Ma(e, t) {
	return `${e}:${ka(t)}`;
}
function Na(e, t) {
	return `${e}:${ya(t)}`;
}
//#endregion
//#region src/addressing/address-resolver.ts
var Pa = class {
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
		return n === void 0 && (n = `[${Ye}${$i(t)}="${C(e)}"]`, this.bindingSelectors.set(e, n)), n;
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
		return na(e.component, t, () => {
			if (e.bindingSelector === null) return [e.component.querySelector(this.intoSelector(e.propertyName)) ?? e.component];
			let t = Array.from(e.component.querySelectorAll(e.bindingSelector));
			return e.component.matches(e.bindingSelector) && t.unshift(e.component), t;
		});
	}
	intoSelector(e) {
		let t = this.intoSelectors.get(e);
		return t === void 0 && (t = `[${Xe}${$i(e)}]`, this.intoSelectors.set(e, t)), t;
	}
};
//#endregion
//#region src/addressing/dynamic-parameters.ts
function Fa(e) {
	return za(e, ae);
}
function Ia(e, t) {
	if (t <= 0) return [];
	let n = [], r = e, i = null;
	for (; r !== null && n.length < t;) {
		let e = Va(r);
		if (e !== void 0) {
			let t = r.closest(Ba);
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
function La(e, t) {
	let n = Fa(e);
	if (n !== t.length) return !1;
	if (n === 0) return !0;
	let r = Ia(e, n);
	if (r.length !== t.length) return !1;
	for (let e = 0; e < t.length; e++) if (String(r[e] ?? "") !== String(t[e] ?? "")) return !1;
	return !0;
}
function Ra(e, t) {
	let n = t.length - 1, r = e, i = null;
	for (; r !== null && n >= 0;) {
		let e = Va(r);
		if (e !== void 0) {
			let a = r.closest(Ba);
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
function za(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.trim().length === 0) return 0;
	let r = Number(n);
	return Number.isInteger(r) ? r : 0;
}
var Ba = `[${x}]`;
function Va(e) {
	return e.getAttribute("data-ui-key") ?? e.getAttribute("data-ui-group-anchor") ?? void 0;
}
//#endregion
//#region src/addressing/dom-registry.ts
var Ha = `[${Lt}]`, Ua = 64, Wa = 256;
function Ga(e, t) {
	let n = [];
	for (let r of e) r instanceof HTMLElement && r.matches(t) ? n.push(r) : n.push(...r.querySelectorAll(t));
	return n;
}
var Ka = class {
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
		this.stale || (e === void 0 || this.changedScopes.size >= Ua ? (this.stale = !0, this.changedScopes.clear()) : this.changedScopes.add(e));
	}
	rebuild() {
		this.stale = !1, this.componentsById.clear(), this.staticComponentsById.clear(), this.keyedComponentsById.clear(), this.indexed.clear(), this.changedScopes.clear(), this.unsettledIds.clear();
		let e = this.root.querySelectorAll(S), t = this.root.querySelector(Ha) !== null;
		for (let n of e) {
			let e = E(n);
			if (e <= 0 || t && n.closest(Ha) !== null) continue;
			let r = this.componentsById.get(e);
			r === void 0 && (r = [], this.componentsById.set(e, r)), r.push(n), this.indexed.add(n), !this.staticComponentsById.has(e) && Ya(n) && this.staticComponentsById.set(e, n);
		}
		this.patchedSincePrune = 0, this.prunedSize = this.indexed.size;
	}
	findComponent(e, t) {
		return this.findAllComponents(e, t)[0] ?? null;
	}
	ensureId(e, t) {
		return ta(e, t);
	}
	findComponentParts(e, t, n) {
		return Ga(this.findAllComponents(e, t), n);
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
		let n = this.keyedComponents(e).get(ya(t)) ?? [];
		if (n.length > 0 && n.every((e) => this.holds(e) && La(e, t))) return [...n];
		let r = this.liveComponents(e).filter((e) => La(e, t));
		return (n.length > 0 || r.length > 0) && this.keyedComponentsById.delete(e), r;
	}
	sync() {
		if (this.stale) this.rebuild();
		else if (this.changedScopes.size !== 0) {
			for (let e of this.changedScopes) this.holds(e) && this.addComponentsIn(e);
			this.changedScopes.clear(), this.patchedSincePrune > Math.max(this.prunedSize, Wa) && this.prune();
		}
	}
	addComponentsIn(e) {
		if (e.closest(Ha) !== null) return;
		let t = e.querySelector(Ha) !== null;
		e.matches("[data-ui-id]") && this.addComponent(e, !1);
		for (let n of e.querySelectorAll(S)) this.addComponent(n, t);
	}
	addComponent(e, t) {
		let n = E(e);
		if (n <= 0) return;
		if (this.indexed.has(e)) {
			this.unsettledIds.add(n);
			return;
		}
		if (t && e.closest(Ha) !== null) return;
		this.indexed.add(e), this.patchedSincePrune++, this.keyedComponentsById.delete(n);
		let r = this.componentsById.get(n);
		r === void 0 ? (this.componentsById.set(n, [e]), Ya(e) && this.staticComponentsById.set(n, e)) : (r.push(e), this.unsettledIds.add(n));
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
		r && (t.length = n, this.keyedComponentsById.delete(e)), i && !Qa(t) && t.sort(Za), t.length === 0 ? (this.componentsById.delete(e), this.staticComponentsById.delete(e)) : (r || i) && this.settleStatic(e, t);
	}
	settleStatic(e, t) {
		for (let n of t) if (Ya(n)) {
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
			let e = Fa(n);
			if (e === 0) continue;
			let r = Ia(n, e);
			if (r.length !== e) continue;
			let i = ya(r), a = t.get(i);
			a === void 0 ? t.set(i, [n]) : a.push(n);
		}
		return this.keyedComponentsById.set(e, t), t;
	}
	holds(e) {
		return $a(this.root, e);
	}
	resolveNearestComponent(e, t) {
		this.sync();
		let n = e;
		for (; n !== null;) {
			let e = n.closest(S);
			if (e === null || !$a(this.root, e)) return null;
			let r = E(e);
			if (r > 0 && t(r, e)) return {
				element: e,
				componentId: r,
				dynamicParameters: Ia(e, Fa(e))
			};
			n = e.parentElement;
		}
		return null;
	}
};
function E(e) {
	return za(e, y);
}
function qa(e) {
	let t = e.closest(S), n = t === null ? 0 : E(t);
	return n > 0 ? n : null;
}
function Ja(e) {
	let t = e.closest(S), n = t === null ? 0 : E(t);
	return t === null || n <= 0 ? null : {
		componentId: n,
		dynamicParameters: Ia(t, Fa(t))
	};
}
function Ya(e) {
	return Fa(e) === 0;
}
function Xa(e, t) {
	return (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
}
function Za(e, t) {
	return e === t ? 0 : Xa(e, t) ? -1 : 1;
}
function Qa(e) {
	for (let t = 1; t < e.length; t++) if (!Xa(e[t - 1], e[t])) return !1;
	return !0;
}
function $a(e, t) {
	return e === t || e instanceof Node && e.contains(t);
}
//#endregion
//#region src/rendering/file-size.ts
var eo = [
	"kilobyte",
	"megabyte",
	"gigabyte"
], to = [
	"kB",
	"MB",
	"GB"
];
function no(e, t) {
	let n = e, r = "byte";
	for (let e of eo) {
		if (n < 1024) break;
		n /= 1024, r = e;
	}
	return io(t, r).format(n);
}
var ro = /* @__PURE__ */ new Map();
function io(e, t) {
	let n = `${e}|${t}`, r = ro.get(n);
	return r === void 0 && (r = ao(e, t), ro.set(n, r)), r;
}
function ao(e, t) {
	let n = {
		style: "unit",
		unit: t,
		unitDisplay: t === "byte" ? "long" : "short",
		maximumFractionDigits: 1
	};
	try {
		return new Intl.NumberFormat(e.length > 0 ? e : void 0, n);
	} catch {
		return new Intl.NumberFormat(void 0, n);
	}
}
function oo(e, t) {
	let n = Number(e ?? NaN);
	return Number.isFinite(n) && n >= 0 ? no(n, t) : "";
}
function so(e) {
	if (e < 1024) return e === 1 ? "1 byte" : `${co(e)} bytes`;
	let t = e, n = -1;
	for (; n < to.length - 1 && t >= 1024;) t /= 1024, n++;
	let r = Math.round(t * 10), i = Math.floor(r / 10), a = r % 10;
	return `${co(i)}${a === 0 ? "" : `.${a}`} ${to[n]}`;
}
function co(e) {
	return String(e).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//#endregion
//#region src/rendering/url-safety.ts
var lo = [
	"http",
	"https",
	"mailto",
	"tel"
];
function uo(e) {
	let t = String(e ?? "");
	if (t.trim().length === 0) return !1;
	for (let e of t) {
		let t = e.codePointAt(0) ?? 0;
		if (t <= 32 || t >= 127 && t <= 159) return !1;
	}
	if ("/#?.".includes(t[0])) return !0;
	let n = t.indexOf(":");
	return n < 0 || lo.includes(t.slice(0, n).toLowerCase());
}
function fo(e) {
	return uo(e) ? String(e) : void 0;
}
var po = [
	"http:",
	"https:",
	"mailto:",
	"tel:"
];
function mo(e) {
	let t = vo(e), n = t.toLowerCase();
	return /^[\\/]{2}/.test(t) || po.some((e) => n.startsWith(e));
}
function ho(e) {
	return typeof e != "string" || /[\x00-\x1f\x7f-\x9f]/.test(e) ? !1 : e === "/" || go(e);
}
function go(e) {
	return e.length > 1 && e[0] === "/" && e[1] !== "/" && e[1] !== "\\";
}
function _o(e) {
	return e.length > 0 && e[0] !== "/" && e[0] !== "\\" && !/^[A-Za-z][A-Za-z\d+.-]*:/.test(e);
}
function vo(e) {
	let t = 0, n = e.length;
	for (; t < n && e.charCodeAt(t) <= 32;) t++;
	for (; n > t && e.charCodeAt(n - 1) <= 32;) n--;
	return e.slice(t, n).replace(/[\t\n\r]/g, "");
}
function yo(e) {
	return bo(e) !== null;
}
function bo(e) {
	let t = vo(e), n = t.toLowerCase();
	return go(t) || _o(t) || n.startsWith("https://") || n.startsWith("http://") || n.startsWith("data:image/") ? t : null;
}
function xo(e) {
	return bo(String(e ?? "").trim()) ?? void 0;
}
//#endregion
//#region src/rendering/icon-value.ts
var So = "mask:", Co = "ui-icon--image", wo = "ui-icon--mask";
function To(e) {
	let t = String(e ?? "").trim(), n = !1;
	t.startsWith(So) && (n = !0, t = t.slice(5).trim());
	let r = t.includes("/") ? bo(t) : null;
	return r === null ? null : {
		source: r,
		tinted: n
	};
}
function Eo(e) {
	let t = To(e);
	return t === null ? "" : Do(t.source);
}
function Do(e) {
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
var Oo = "ui-icon", ko = "data-ui-icon", Ao = "--ui-icon-url";
function jo(e, t) {
	e.classList.add(Oo);
	for (let t of Array.from(e.classList)) No(t) && e.classList.remove(t);
	(e instanceof HTMLElement || e instanceof SVGElement) && e.style.removeProperty(Ao);
	let n = Po(t);
	if (n.length === 0) {
		e.removeAttribute(ko);
		return;
	}
	e.setAttribute(ko, ""), e.classList.add(n);
	let r = To(t);
	r !== null && (e instanceof HTMLElement || e instanceof SVGElement) && e.style.setProperty(Ao, Do(r.source));
}
var Mo = "ui-icon-glyph--";
function No(e) {
	return e === Co || e === wo || e.startsWith(Mo);
}
function Po(e) {
	let t = To(e);
	return t === null ? Fo(e) : t.tinted ? wo : Co;
}
function Fo(e) {
	let t = String(e ?? "").trim();
	if (t.length === 0) return "";
	let n = Mo;
	for (let e of t) {
		let t = e.charCodeAt(0);
		t >= 48 && t <= 57 || t >= 65 && t <= 90 || t >= 97 && t <= 122 ? n += e.toLowerCase() : (e === "-" || e === "_" || e === "." || e === " ") && (n.endsWith("-") || (n += "-"));
	}
	return n.length === 15 ? "" : n;
}
//#endregion
//#region src/rendering/inline-markup.ts
var Io = {
	None: 0,
	Bold: 1,
	Italic: 2,
	Underline: 4,
	Strikethrough: 8,
	Code: 16
}, Lo = "\\", Ro = "`", zo = "!", Bo = "{", Vo = "}", Ho = "ui-text__fold", Uo = "ui-text__fold-toggle", Wo = "ui-text__fold-content", Go = 8;
function Ko(e, t = {}) {
	if (e == null || e.length === 0) return [];
	let n = [], r = { value: "" };
	return is(new ys(e, t.autolinks === !0), 0, e.length, Io.None, null, n, r), as(n, r, Io.None, null), n;
}
function qo(e, t = {}) {
	return Ko(e, t).map((e) => Qo(e) ? `${e.fold} ${qo(e.text, t)}` : e.text).join("");
}
function Jo(e) {
	let t = "";
	for (let n of e) t += Ss(n) ? Lo + n : n;
	return t;
}
function Yo(e, t, n = {}) {
	let r = Ko(t, n), i = r.some(Qo);
	e.hasAttribute("data-ui-folds") !== i && e.toggleAttribute(qe, i), r.length === 0 ? e.textContent = "" : r.length === 1 && Xo(r[0]) ? e.textContent = r[0].text : e.replaceChildren($o(r, n));
}
function Xo(e) {
	return e.styles === Io.None && e.url === null && !Zo(e) && !Qo(e);
}
function Zo(e) {
	return e.icon !== null && e.icon !== void 0 && e.icon.length > 0;
}
function Qo(e) {
	return e.fold !== null && e.fold !== void 0;
}
function $o(e, t) {
	let n = document.createDocumentFragment();
	for (let r of e) n.append(es(r, t));
	return n;
}
function es(e, t) {
	if (Zo(e)) return ns(e.icon);
	let n = Qo(e) ? ts(e, t) : document.createTextNode(e.text);
	if ((e.styles & Io.Code) !== 0) {
		let e = document.createElement("code");
		e.className = "ui-text__code", e.append(n), n = e;
	}
	if ((e.styles & Io.Strikethrough) !== 0 && (n = rs("s", n)), (e.styles & Io.Underline) !== 0 && (n = rs("u", n)), (e.styles & Io.Italic) !== 0 && (n = rs("em", n)), (e.styles & Io.Bold) !== 0 && (n = rs("strong", n)), e.url !== null && t.insideLink !== !0) {
		let t = document.createElement("a");
		t.setAttribute("href", e.url), t.className = "ui-text__link", mo(e.url) && (t.setAttribute("target", "_blank"), t.setAttribute("rel", "noopener noreferrer")), t.append(n), n = t;
	}
	return n;
}
function ts(e, t) {
	let n = document.createElement("span"), r = document.createElement(t.staticFolds === !0 ? "span" : "button"), i = document.createElement("span");
	return n.className = t.staticFolds === !0 ? `${Ho} ${Ho}--static` : Ho, r.className = Uo, r.textContent = e.fold ?? "", i.className = Wo, i.append($o(Ko(e.text, t), t)), t.staticFolds === !0 ? (n.append(r, " ", i), n) : (r.setAttribute("type", "button"), r.setAttribute("aria-expanded", "false"), r.setAttribute($e, ""), n.append(r, i), n);
}
function ns(e) {
	let t = document.createElement("i");
	return t.className = "ui-text__icon-inline", jo(t, e), t.setAttribute("aria-hidden", "true"), t;
}
function rs(e, t) {
	let n = document.createElement(e);
	return n.append(t), n;
}
function is(e, t, n, r, i, a, o) {
	let s = e.text, c = t;
	for (; c < n;) {
		let t = s[c];
		if (t === Lo && c + 1 < n && Ss(s[c + 1])) {
			o.value += s[c + 1], c += 2;
			continue;
		}
		let l = os(e, c, n);
		if (l !== null) {
			as(a, o, r, i), ss(s, c + 1, l, o), as(a, o, r | Io.Code, i), c = l + 1;
			continue;
		}
		let u = us(e, c, n);
		if (u !== null) {
			as(a, o, r, i), is(e, c + u.markerLength, u.contentEnd, r | u.style, i, a, o), as(a, o, r | u.style, i), c = u.contentEnd + u.markerLength;
			continue;
		}
		let d = cs(e, c, n);
		if (d !== null) {
			as(a, o, r, i), a.push({
				text: "",
				styles: r,
				url: i,
				icon: d.name
			}), c = d.iconEnd;
			continue;
		}
		let f = i === null && e.autolinks ? ds(e, c, n) : null;
		if (f !== null) {
			as(a, o, r, i), a.push({
				text: f.address,
				styles: r,
				url: f.address
			}), c = f.addressEnd;
			continue;
		}
		let p = i === null ? _s(e, c, n) : null;
		if (p !== null) {
			as(a, o, r, i), is(e, p.labelStart, p.labelEnd, r, p.url, a, o), as(a, o, r, p.url), c = p.linkEnd;
			continue;
		}
		let m = vs(e, c, n);
		m === null ? (o.value += t, c++) : (as(a, o, r, i), a.push({
			text: s.slice(m.contentStart, m.contentEnd),
			styles: r,
			url: i,
			fold: m.caption
		}), c = m.contentEnd + 1);
	}
}
function as(e, t, n, r) {
	t.value.length !== 0 && (e.push({
		text: t.value,
		styles: n,
		url: r
	}), t.value = "");
}
function os(e, t, n) {
	let r = e.text;
	if (r[t] !== Ro) return null;
	let i = t + 1;
	if (i >= n || Cs(r[i])) return null;
	let a = e.findClosingMarker(i, n, Ro, 1);
	return a > i ? a : null;
}
function ss(e, t, n, r) {
	for (let i = t; i < n; i++) e[i] === Lo && i + 1 < n && Ss(e[i + 1]) ? (r.value += e[i + 1], i++) : r.value += e[i];
}
function cs(e, t, n) {
	let r = e.text;
	if (r[t] !== zo || t + 1 >= n || r[t + 1] !== "[") return null;
	let i = t + 2, a = e.findClosingBracket(i, n);
	if (a <= i) return null;
	let o = r.slice(i, a);
	return ls(o) ? {
		name: o,
		iconEnd: a + 1
	} : null;
}
function ls(e) {
	return e.length > 0 && /^[A-Za-z0-9._-]+$/.test(e);
}
function us(e, t, n) {
	let r = e.text, i = r[t];
	if (i !== "*" && i !== "_" && i !== "~") return null;
	let a = t + 1 < n && r[t + 1] === i, o, s;
	if (i === "*" && a) o = Io.Bold, s = 2;
	else if (i === "*") o = Io.Italic, s = 1;
	else if (i === "_" && a) o = Io.Underline, s = 2;
	else if (i === "~" && a) o = Io.Strikethrough, s = 2;
	else return null;
	let c = t + s;
	if (c >= n || Cs(r[c])) return null;
	let l = e.findClosingMarker(c, n, i, s);
	return l > c ? {
		style: o,
		markerLength: s,
		contentEnd: l
	} : null;
}
function ds(e, t, n) {
	let r = e.text;
	if (r[t] !== "h" && r[t] !== "H" || t > 0 && !fs(r[t - 1])) return null;
	let i = r.slice(t, Math.min(t + 8, n)).toLowerCase(), a = i.startsWith("https://") ? t + 8 : i.startsWith("http://") ? t + 7 : -1;
	if (a < 0) return null;
	let o = ps(r, a, n);
	if (!gs(r.slice(a, hs(e, a, o, 0, 0)))) return null;
	let s = o, c = 0, l = 0;
	for (; s < n && !ws(r[s]) && !Ts(r[s]) && r[s] !== "<";) r[s] === "(" ? c-- : r[s] === ")" ? c++ : r[s] === "[" ? l-- : r[s] === "]" && l++, s++;
	if (s = hs(e, a, s, c, l), !gs(r.slice(a, Math.min(o, s)))) return null;
	let u = { value: "" };
	return ss(r, t, s, u), uo(u.value) ? {
		address: u.value,
		addressEnd: s
	} : null;
}
function fs(e) {
	return !/^[\p{L}\p{Nd}]$/u.test(e);
}
function ps(e, t, n) {
	let r = t;
	for (; r < n;) if (ms(e[r])) r++;
	else if (e[r] === Lo && r + 1 < n && e[r + 1] === "_") r += 2;
	else break;
	return r;
}
function ms(e) {
	return /^[\p{L}\p{Nd}_.-]$/u.test(e);
}
function hs(e, t, n, r, i) {
	let a = e.text;
	for (; n > t;) {
		let t = n - 1, o = a[t];
		if (o === ")" && r > 0) r--;
		else if (o === "]" && i > 0) i--;
		else if (!"?!.,:;*_~'\"»”’".includes(o)) break;
		n = e.isEscaped(t) && Ss(o) ? t - 1 : t;
	}
	return n;
}
function gs(e) {
	let t = (e.endsWith(".") ? e.slice(0, -1) : e).split(".");
	return t.length >= 2 && t.every((e) => e.length > 0) && !t.slice(-2).some((e) => e.includes("_"));
}
function _s(e, t, n) {
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
function vs(e, t, n) {
	let r = e.text;
	if (r[t] !== "[") return null;
	let i = e.findClosingBracket(t + 1, n);
	if (i <= t + 1 || i + 1 >= n || r[i + 1] !== Bo || e.hasOpeningBracket(t + 1, i)) return null;
	let a = i + 1, o = a + 1, s = e.findMatchingBrace(a, n);
	if (s <= o || e.braceDepth(a) > Go) return null;
	let c = { value: "" };
	return ss(r, t + 1, i, c), {
		caption: c.value,
		contentStart: o,
		contentEnd: s
	};
}
var ys = class {
	text;
	autolinks;
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
	constructor(e, t) {
		this.text = e, this.autolinks = t;
	}
	findClosingBracket(e, t) {
		return this.closeBrackets ??= this.next("]", !0), bs(this.closeBrackets[e], t);
	}
	hasOpeningBracket(e, t) {
		return this.openBrackets ??= this.next("[", !0), bs(this.openBrackets[e], t) >= 0;
	}
	findClosingParen(e, t) {
		return this.closeParens ??= this.next(")", !1), bs(this.closeParens[e], t);
	}
	findMatchingBrace(e, t) {
		return bs(this.braces()[e], t);
	}
	braceDepth(e) {
		return this.braces(), this.braceDepths[e];
	}
	findClosingMarker(e, t, n, r) {
		let i = xs(n, r), a = this.closers[i] ?? this.buildClosers(n, r);
		this.closers[i] = a;
		let o = a[e + 1];
		if (r === 2) return o >= 0 && o + 1 < t ? o : -1;
		if (o >= 0 && o < t - 1) return o;
		let s = t - 1;
		return s > e && this.text[s] === n && !this.isEscaped(s) && !Cs(this.text[s - 1]) ? s : -1;
	}
	readLinkUrl(e, t) {
		if (this.linkLabel !== e) {
			let n = this.text.slice(e + 2, t).trim();
			this.linkLabel = e, this.linkUrl = uo(n) ? n : null;
		}
		return this.linkUrl;
	}
	isEscaped(e) {
		if (this.escaped === null) {
			let e = new Uint8Array(this.text.length);
			for (let t = 1; t < this.text.length; t++) e[t] = +(this.text[t - 1] === Lo && e[t - 1] === 0);
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
			if (this.text[r] === Bo) n.push(r);
			else if (this.text[r] === Vo && n.length > 0) {
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
		if (e === 0 || this.text[e] !== t || this.isEscaped(e) || Cs(this.text[e - 1])) return !1;
		let r = e + 1 < this.text.length && this.text[e + 1] === t;
		return n === 2 ? r : !r;
	}
};
function bs(e, t) {
	return e >= 0 && e < t ? e : -1;
}
function xs(e, t) {
	switch (e) {
		case "*": return t === 2 ? 0 : 1;
		case "_": return 2;
		case "~": return 3;
		default: return 4;
	}
}
function Ss(e) {
	return e === "*" || e === "_" || e === "~" || e === "[" || e === "]" || e === "(" || e === ")" || e === Bo || e === Vo || e === Ro || e === Lo;
}
function Cs(e) {
	return e === " " || e === "	" || e === "\r" || e === "\n";
}
function ws(e) {
	return /^\p{White_Space}$/u.test(e);
}
function Ts(e) {
	let t = e.charCodeAt(0);
	return t < 32 || t >= 127 && t <= 159;
}
//#endregion
//#region src/runtime/plural-rules.ts
function Es(e, t) {
	if (!Number.isFinite(t)) return "other";
	let n = Math.abs(t), r = Math.trunc(n), i = Ds(n);
	switch (Os(e)) {
		case "en":
		case "de": return r === 1 && i === 0 ? "one" : "other";
		case "es": return n === 1 ? "one" : ks(r, i) ? "many" : "other";
		case "fr": return r === 0 || r === 1 ? "one" : ks(r, i) ? "many" : "other";
		case "ru":
		case "uk": return As(r, i);
		case "pl": return js(r, i);
		default: return "other";
	}
}
function Ds(e) {
	if (Number.isInteger(e)) return 0;
	let t = String(e), n = t.indexOf("e"), r = n < 0 ? t : t.slice(0, n), i = n < 0 ? 0 : Number(t.slice(n + 1)), a = r.indexOf("."), o = a < 0 ? 0 : r.length - a - 1;
	return Math.max(0, o - i);
}
function Os(e) {
	return e == null || e.trim().length === 0 ? "" : e.split(/[-_]/, 1)[0].toLowerCase();
}
function ks(e, t) {
	return t === 0 && e !== 0 && e % 1e6 == 0;
}
function As(e, t) {
	if (t !== 0) return "other";
	let n = e % 10, r = e % 100;
	return n === 1 && r !== 11 ? "one" : n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
function js(e, t) {
	if (t !== 0) return "other";
	if (e === 1) return "one";
	let n = e % 10, r = e % 100;
	return n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
//#endregion
//#region src/rendering/temporal-format.ts
function Ms(e, t) {
	return `${e.date} ${t ? e.longTime : e.shortTime}`;
}
var Ns = {
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
function Ps(e) {
	let t = e.closest("[data-ui-temporal-culture]")?.getAttribute("data-ui-temporal-culture") ?? null;
	if (t === null) return Ns;
	try {
		return {
			...Ns,
			...JSON.parse(t)
		};
	} catch {
		return Ns;
	}
}
var Fs = [
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
function Is(e, t, n) {
	if (t == null || t.trim().length === 0) return `${Us(e.getFullYear(), 4)}-${Us(e.getMonth() + 1, 2)}-${Us(e.getDate(), 2)} ${Us(e.getHours(), 2)}:${Us(e.getMinutes(), 2)}:${Us(e.getSeconds(), 2)}`;
	let r = "", i = Ls(t);
	for (let a = 0; a < t.length;) {
		let o = Vs(t, a);
		o === null ? (r += t[a], a++) : (r += Hs(o, e, n, i), a += o.length);
	}
	return r;
}
function Ls(e) {
	for (let t = 0; t < e.length;) {
		let n = Vs(e, t);
		if (n === null) t++;
		else {
			if (n === "d" || n === "dd") return !0;
			t += n.length;
		}
	}
	return !1;
}
var Rs = /^[-./:,]$/, zs = /* @__PURE__ */ new Set([
	"MMMM",
	"MMM",
	"dddd",
	"ddd",
	"tt"
]);
function Bs(e) {
	for (let t = 0; t < e.length;) {
		let n = Vs(e, t);
		if (n !== null && zs.has(n) || n === null && !Rs.test(e[t]) && !/\s/.test(e[t])) return !1;
		t += n?.length ?? 1;
	}
	return e.trim().length > 0;
}
function Vs(e, t) {
	for (let n of Fs) if (e.startsWith(n, t)) return n;
	return null;
}
function Hs(e, t, n, r) {
	let i = t.getHours(), a = cc(i);
	switch (e) {
		case "yyyy": return Us(t.getFullYear(), 4);
		case "yy": return Us(t.getFullYear() % 100, 2);
		case "MMMM": return r ? n.monthGenitiveNames[t.getMonth()] : n.monthNames[t.getMonth()];
		case "MMM": return n.abbreviatedMonthNames[t.getMonth()];
		case "MM": return Us(t.getMonth() + 1, 2);
		case "M": return String(t.getMonth() + 1);
		case "dddd": return n.dayNames[t.getDay()];
		case "ddd": return n.abbreviatedDayNames[t.getDay()];
		case "dd": return Us(t.getDate(), 2);
		case "d": return String(t.getDate());
		case "HH": return Us(i, 2);
		case "H": return String(i);
		case "hh": return Us(a, 2);
		case "h": return String(a);
		case "mm": return Us(t.getMinutes(), 2);
		case "m": return String(t.getMinutes());
		case "ss": return Us(t.getSeconds(), 2);
		case "s": return String(t.getSeconds());
		case "tt": return i < 12 ? n.amDesignator : n.pmDesignator;
		default: return e;
	}
}
function Us(e, t) {
	return String(e).padStart(t, "0");
}
var Ws = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function Gs(e) {
	let t = Ws.exec(e.trim());
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
function Ks(e) {
	return qs(e.year, e.month - 1, e.day, e.hour, e.minute, e.second, e.millisecond);
}
function qs(e, t, n, r = 0, i = 0, a = 0, o = 0) {
	let s = new Date(2e3, 0, 1, r, i, a, o);
	return s.setFullYear(e, t, n), s;
}
var Js = {
	year: "y",
	month: "M",
	day: "d",
	hour: "H",
	minute: "m",
	second: "s"
};
function Ys(e, t) {
	let n = "";
	for (let r = 0; r < e.length;) {
		let i = Vs(e, r);
		i === null ? (n += e[r], r++) : (n += Xs(i, t).repeat(i.length), r += i.length);
	}
	return n;
}
function Xs(e, t) {
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
function Zs(e, t, n) {
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
		let a = Vs(t, e);
		if (a === null) {
			if (!Qs(r, i, t[e])) return null;
			e++;
		} else {
			if (!$s(r, i, a, n)) return null;
			e += a.length;
		}
	}
	return r.length > 0 && i.position === r.length ? oc(i) : null;
}
function Qs(e, t, n) {
	if (/\s/.test(n)) {
		for (; t.position < e.length && /\s/.test(e[t.position]);) t.position++;
		return !0;
	}
	return Rs.test(n) ? t.position >= e.length || !Rs.test(e[t.position]) ? !1 : (t.position++, !0) : t.position >= e.length || e[t.position].toLowerCase() !== n.toLowerCase() ? !1 : (t.position++, !0);
}
function $s(e, t, n, r) {
	switch (n) {
		case "yyyy": return ec(t, "year", rc(e, t, 4, 4));
		case "yy": return ec(t, "year", tc(rc(e, t, 2, 2)));
		case "MMMM":
		case "MMM": return ec(t, "month", nc(ic(e, t, [
			r.monthNames,
			r.monthGenitiveNames,
			r.abbreviatedMonthNames
		])));
		case "MM":
		case "M": return ec(t, "month", rc(e, t, 1, 2));
		case "dddd":
		case "ddd": return ic(e, t, [r.dayNames, r.abbreviatedDayNames]) !== null;
		case "dd":
		case "d": return ec(t, "day", rc(e, t, 1, 2));
		case "HH":
		case "H": return ec(t, "hour", rc(e, t, 1, 2));
		case "hh":
		case "h": return ec(t, "hour12", rc(e, t, 1, 2));
		case "mm":
		case "m": return ec(t, "minute", rc(e, t, 1, 2));
		case "ss":
		case "s": return ec(t, "second", rc(e, t, 1, 2));
		case "tt": return ac(e, t, r);
		default: return !1;
	}
}
function ec(e, t, n) {
	return n !== null && (e[t] = n, !0);
}
function tc(e) {
	return e === null ? null : e + (e < 50 ? 2e3 : 1900);
}
function nc(e) {
	return e === null ? null : e + 1;
}
function rc(e, t, n, r) {
	let i = t.position;
	for (; i < e.length && i - t.position < r && e[i] >= "0" && e[i] <= "9";) i++;
	if (i - t.position < n) return null;
	let a = Number(e.slice(t.position, i));
	return t.position = i, a;
}
function ic(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = null, a = 0;
	for (let e of n) for (let t = 0; t < e.length; t++) {
		let n = e[t].toLowerCase();
		n.length > a && r.startsWith(n) && (i = t, a = n.length);
	}
	return t.position += a, i;
}
function ac(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = n.amDesignator.toLowerCase(), a = n.pmDesignator.toLowerCase();
	for (let [e, n] of i.length >= a.length ? [[i, !1], [a, !0]] : [[a, !0], [i, !1]]) if (e.length > 0 && r.startsWith(e)) return t.position += e.length, t.afternoon = n, !0;
	return i.length === 0 && a.length === 0;
}
function oc(e) {
	let t = e.hour ?? 0;
	if (e.hour12 !== null) {
		if (e.hour12 < 1 || e.hour12 > 12) return null;
		t = e.hour12 % 12 + (e.afternoon === !0 ? 12 : 0);
	}
	return e.year === null || e.month === null || e.day === null || e.year < 1 || e.month < 1 || e.month > 12 || e.day < 1 || e.day > qs(e.year, e.month, 0).getDate() || t > 23 || e.minute > 59 || e.second > 59 ? null : {
		year: e.year,
		month: e.month,
		day: e.day,
		hour: t,
		minute: e.minute,
		second: e.second,
		millisecond: 0
	};
}
var sc = {
	readCulture: Ps,
	format: Is,
	parse: Gs,
	toDate: Ks
};
function cc(e) {
	return e % 12 == 0 ? 12 : e % 12;
}
//#endregion
//#region src/rendering/timestamp-format.ts
var lc = /(?:Z|[+-]\d{2}(?::?\d{2})?)$/i, uc = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function dc(e) {
	let t = e?.trim() ?? "";
	if (!uc.test(t)) return null;
	let n = Date.parse(lc.test(t) ? t : `${t}Z`);
	return Number.isNaN(n) ? null : n;
}
function fc(e) {
	return e === "date" || e === "time" || e === "relative" || e === "relative-date" ? e : "date-time";
}
function pc(e) {
	return e === "relative" || e === "relative-date";
}
var mc = {
	...Ns,
	date: "yyyy-MM-dd",
	shortTime: "HH:mm",
	longTime: "HH:mm:ss"
};
function hc(e, t, n, r) {
	if (t === "relative") return Ec(e - r, n.language);
	if (t === "relative-date") {
		let t = _c(e, r);
		if (t !== null) return bc(n.language).format(t, "day");
	}
	let i = n.temporal ?? mc, a = t === "date" || t === "relative-date" ? i.date : t === "time" ? i.shortTime : Ms(i, !1);
	return Is(new Date(e), a, i);
}
function gc(e, t, n, r) {
	let i = hc(e, t, n, r);
	return t === "relative-date" ? vc(i, n.language) : i;
}
function _c(e, t) {
	let n = new Date(e), r = new Date(t), i = Math.round((Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) - Date.UTC(r.getFullYear(), r.getMonth(), r.getDate())) / Tc);
	return Math.abs(i) <= 1 ? i : null;
}
function vc(e, t) {
	return e.length === 0 ? e : e.charAt(0).toLocaleUpperCase(xc(t)) + e.slice(1);
}
var yc = /* @__PURE__ */ new Map();
function bc(e) {
	let t = yc.get(e);
	return t === void 0 && (t = new Intl.RelativeTimeFormat(xc(e), { numeric: "auto" }), yc.set(e, t)), t;
}
function xc(e) {
	if (e.length !== 0) try {
		return Intl.DateTimeFormat.supportedLocalesOf(e).length > 0 ? e : void 0;
	} catch {
		return;
	}
}
var Sc = 1e3, Cc = 60 * Sc, wc = 60 * Cc, Tc = 24 * wc;
function Ec(e, t) {
	let n = bc(t), r = Math.abs(e);
	return r < 45 * Sc ? n.format(0, "second") : r < 45 * Cc ? n.format(Math.round(e / Cc), "minute") : r < 22 * wc ? n.format(Math.round(e / wc), "hour") : r < 26 * Tc ? n.format(Math.round(e / Tc), "day") : r < 320 * Tc ? n.format(Math.round(e / (30.4375 * Tc)), "month") : n.format(Math.round(e / (365.25 * Tc)), "year");
}
//#endregion
//#region src/runtime/words.ts
var Dc = "count";
function D(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	if (typeof t.key != "string" || t.key.trim().length === 0) return !1;
	for (let e of Object.keys(t)) if (e !== "key" && e !== "args") return !1;
	return t.args === void 0 || t.args === null || typeof t.args == "object" && !Array.isArray(t.args);
}
function Oc(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.text == "string" && t.text.trim().length > 0 && Object.keys(t).length === 1;
}
var kc = /* @__PURE__ */ new Set([
	"date-time",
	"date",
	"time",
	"relative",
	"relative-date"
]);
function Ac(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	for (let e of Object.keys(t)) if (e !== "moment" && e !== "format") return !1;
	return typeof t.moment == "string" && dc(t.moment) !== null && (t.format === void 0 || typeof t.format == "string" && kc.has(t.format));
}
function jc(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	return Object.keys(t).length === 1 && typeof t.fileSize == "number" && Number.isSafeInteger(t.fileSize) && t.fileSize >= 0;
}
function Mc(e) {
	return Nc(e, Ac);
}
function Nc(e, t) {
	if (typeof e != "object" || !e) return !1;
	if (t(e)) return !0;
	for (let n of Array.isArray(e) ? e : Object.values(e)) if (Nc(n, t)) return !0;
	return !1;
}
function Pc(e) {
	return Nc(e, Fc);
}
function Fc(e) {
	return Ac(e) || jc(e);
}
function Ic(e, t) {
	let n = new Date(e).toISOString(), r = n.slice(0, 10), i = n.slice(11, 16);
	return t === "date" || t === "relative-date" ? r : t === "time" ? `${i} UTC` : `${r} ${i} UTC`;
}
function Lc(e, t, n) {
	return D(e) ? Bc(n, e.key, e.args) : Oc(e) ? Rc(n, e.text) : t && typeof e == "string" ? Rc(n, e) : e;
}
function Rc(e, t) {
	return t.trim().length === 0 || !zc(e.prefixes, t) ? t : e.lookup(t) ?? t;
}
function zc(e, t) {
	if (e.length === 0) return !0;
	for (let n of e) if (t.startsWith(n)) return !0;
	return !1;
}
function Bc(e, t, n, r = !1) {
	let i = n?.[Dc];
	return Vc(typeof i == "number" ? e.lookup(`${t}.${Es(e.language, i)}`) ?? e.lookup(`${t}.other`) ?? e.lookup(t) ?? t : e.lookup(t) ?? t, n, (t) => Oc(t) ? Rc(e, t.text) : Bc(e, t.key, t.args, r), e, r);
}
function Vc(e, t, n, r = {}, i = !1) {
	if (t == null || !e.includes("{")) return e;
	let a = "", o = 0;
	for (; o < e.length;) {
		if (e[o] === "{") {
			let s = Hc(e, o);
			if (s > 0) {
				let c = e.slice(o + 1, s);
				if (Object.hasOwn(t, c)) {
					a += Wc(t[c], n, r, i), o = s + 1;
					continue;
				}
			}
		}
		a += e[o], o++;
	}
	return a;
}
function Hc(e, t) {
	let n = t + 1;
	for (; n < e.length && Uc(e.charCodeAt(n));) n++;
	return n > t + 1 && n < e.length && e[n] === "}" ? n : -1;
}
function Uc(e) {
	return e >= 48 && e <= 57 || e >= 65 && e <= 90 || e >= 97 && e <= 122 || e === 95;
}
function Wc(e, t, n, r) {
	if (e == null) return "";
	if (typeof e == "string") return r ? Jo(e) : e;
	if (typeof e == "boolean") return e ? "true" : "false";
	if (D(e)) return t === void 0 ? Vc(e.key, e.args, void 0, n, r) : t(e);
	if (Oc(e)) {
		let n = t === void 0 ? e.text : t(e);
		return r ? Jo(n) : n;
	}
	return Ac(e) ? (n.writeMoment ?? Ic)(dc(e.moment) ?? 0, e.format ?? "date-time") : jc(e) ? (n.writeFileSize ?? so)(e.fileSize) : String(e);
}
//#endregion
//#region src/rendering/first-paint-words.ts
var Gc = `script[type='application/json'][${xt}]`, Kc = `[${Kr}*='"moment"'], [${Kr}*='"fileSize"']`;
function qc(e) {
	let t = e.querySelector(Gc)?.textContent?.trim() ?? "";
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
var Jc = 15e3, Yc = /* @__PURE__ */ new Set(), Xc = null;
function Zc(e) {
	Yc.add(e), Xc === null && (Xc = setInterval(Qc, Jc));
}
function Qc() {
	for (let e of [...Yc]) {
		let t = !1;
		try {
			t = e();
		} catch (e) {
			s("a relative tick failed; it is ticked no more.", e);
		}
		t || Yc.delete(e);
	}
	Yc.size === 0 && Xc !== null && (clearInterval(Xc), Xc = null);
}
//#endregion
//#region src/runtime/client-strings.ts
var $c = 256, el = 512, tl = "script[type='application/json'][data-ui-strings]", nl = class {
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
		this.tableLoaded || (this.currentTemporal = qc(e) ?? this.currentTemporal);
		let t = e.querySelector(tl)?.textContent?.trim() ?? "";
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
		return this.lookup(e) === void 0 && this.text(e), Bc(this, e, t, n);
	}
	translate(e, t, n = !1) {
		return Bc(this, e, t, n);
	}
	writeMoment = (e, t) => (pc(t) && this.noteRelative(), hc(e, t, {
		temporal: this.currentTemporal,
		language: this.currentLanguage
	}, Date.now()));
	noteRelative() {
		this.relativeWritten = !0, this.momentHandlers.size > 0 && Zc(this.tickMoments);
	}
	tickMoments = () => this.relativeWritten ? (this.relativeWritten = !1, this.notify(this.momentHandlers, "a moment tick handler failed."), !0) : !1;
	writeFileSize = (e) => no(e, this.currentLanguage);
	resolve(e, t = !0) {
		return Lc(e, t, this);
	}
	resolveText(e) {
		return Lc(e, !0, this);
	}
	write(e, t, n, r) {
		ul(e, t, this.translate(n, r, ll(e, t))), this.mark(e, t, r == null || Object.keys(r).length === 0 ? [n] : [n, r]);
	}
	writeText(e, t, n) {
		ul(e, t, Lc(n, !0, this)), this.mark(e, t, n);
	}
	writeValue(e, t, n) {
		if (D(n)) {
			this.write(e, t, n.key, n.args);
			return;
		}
		let r = Oc(n) ? n.text : typeof n == "string" ? n : "";
		r.trim().length > 0 ? this.writeText(e, t, r) : (ul(e, t, ""), this.mark(e, t, null));
	}
	mark(e, t, n) {
		al(e, t, n);
	}
	rewriteMarks(e, t) {
		dl(e, (e) => {
			for (let n of e.querySelectorAll(t === void 0 ? `[${Kr}]` : Kc)) for (let [e, r] of Object.entries(cl(n))) {
				if (t !== void 0 && !t(r)) continue;
				let i = e === "#text" ? null : e, a = this.wordsOfMark(r, ll(n, i));
				a !== null && ul(n, i, a);
			}
		});
	}
	wordsOfMark(e, t) {
		if (typeof e == "string") return Lc(e, !0, this);
		if (!Array.isArray(e)) return null;
		let [n, r] = e;
		return typeof n == "string" ? this.translate(n, typeof r == "object" && r ? r : null, t) : null;
	}
	askLater(e) {
		this.asker === null || !this.tableLoaded || e.length > el || e.trim().length === 0 || (!this.complete || this.report && this.currentPrefixes.length > 0 && zc(this.currentPrefixes, e)) && (this.askedIn(this.currentLanguage).has(e) || (this.pending.add(e), !this.flushQueued && (this.flushQueued = !0, setTimeout(() => void this.flushAsync(), 0))));
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
		for (let r = 0; r < n.length; r += $c) try {
			let a = await e(t, n.slice(r, r + $c));
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
function rl(e) {
	let t = !1;
	return dl(e, (e) => {
		t ||= e.querySelector(Kc) !== null;
	}), t;
}
function il(e, t) {
	e.hasAttribute("data-ui-words") && al(e, t, null);
}
function al(e, t, n) {
	let r = cl(e), i = t ?? "#text";
	if (n === null) {
		if (!(i in r)) return;
		delete r[i];
	} else r[i] = n;
	let a = JSON.stringify(r);
	w(e, Kr, Object.keys(r).length === 0 ? null : a);
}
function ol(e) {
	return sl(e, null);
}
function sl(e, t) {
	let n = cl(e)[t ?? "#text"];
	if (typeof n == "string") return n;
	if (!Array.isArray(n) || typeof n[0] != "string") return null;
	let r = n[1];
	return {
		key: n[0],
		args: typeof r == "object" && r ? r : null
	};
}
function cl(e) {
	let t = e.getAttribute(Kr);
	if (t === null || t.length === 0) return {};
	try {
		let e = JSON.parse(t);
		return typeof e == "object" && e && !Array.isArray(e) ? e : {};
	} catch {
		return {};
	}
}
function ll(e, t) {
	return t === "data-ui-tooltip" && !e.hasAttribute("data-ui-tooltip-plain");
}
function ul(e, t, n) {
	t === null ? e.textContent !== n && (e.textContent = n) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function dl(e, t) {
	t(e);
	for (let n of e.querySelectorAll("template")) dl(n.content, t);
}
var O = new nl();
function fl(e, t) {
	let n = Oc(e) ? e.text : e;
	return O.resolve(n, typeof n == "string" && n.length > 0 && t());
}
//#endregion
//#region src/updates/row-idle.ts
var pl = "row-idle";
function ml(e) {
	let t = e.parentElement;
	t !== null && (vl(t) ? hl(t) : !t.hasAttribute("data-ui-id") && t.parentElement !== null && vl(t.parentElement) && hl(t.parentElement));
}
function hl(e) {
	let t = gl(e);
	e.hasAttribute("data-ui-row-idle") !== t && e.toggleAttribute(Pr, t);
}
function gl(e) {
	for (let t of e.children) if (t.hasAttribute("data-ui-id")) {
		if (_l(t)) return !0;
	} else for (let e of t.children) if (e.hasAttribute("data-ui-id") && _l(e)) return !0;
	return !1;
}
function _l(e) {
	return e.classList.contains("ui-disabled") || e.classList.contains("ui-loading");
}
function vl(e) {
	return e.hasAttribute("data-ui-key") && e.parentElement?.hasAttribute("data-ui-items-host") === !0;
}
//#endregion
//#region src/interactions/interactive-state.ts
var yl = `.${Ci}, .${wi}, [inert]`;
function bl(e) {
	return `:scope > [${y}]:is(${e}), :scope > :not([${y}]) > [${y}]:is(${e})`;
}
var xl = bl(yl), Sl = /* @__PURE__ */ new Map();
function k(e) {
	return e.closest(yl) !== null || e.matches(":disabled, [aria-disabled='true']");
}
function A(e) {
	return e.matches(yl) || e.querySelector(xl) !== null;
}
function Cl(e, t) {
	if (e.hasAttribute(t)) return !0;
	let n = Sl.get(t);
	return n === void 0 && (n = bl(`[${t}]`), Sl.set(t, n)), e.querySelector(n) !== null;
}
function wl(e) {
	return e.getClientRects().length > 0 && !e.matches(":disabled") && e.closest("[inert]") === null;
}
var Tl = `[${y}], .${Ti}`;
function j(e) {
	return e.closest(Tl)?.matches(`.${Ti}`) === !0;
}
function El(e, t) {
	e.classList.contains("ui-disabled") !== t && (e.classList.toggle(Ci, t), ml(e)), t ? e.setAttribute("aria-disabled", "true") : e.removeAttribute("aria-disabled");
}
var Dl = {
	isInert: k,
	isReadOnly: j,
	setDisabled: El
};
//#endregion
//#region src/interactions/grid-tracks.ts
function Ol(e, t) {
	return Math.max(e, Math.round(t / 10));
}
function kl(e) {
	let t = [];
	for (let n of Ml(e.trim())) {
		let e = /^repeat\(\s*(\d+)\s*,(.+)\)$/s.exec(n);
		if (e !== null) {
			let n = kl(e[2]);
			if (n === null) return null;
			for (let r = Number(e[1]); r > 0; r--) t.push(...n);
			continue;
		}
		let r = Al(n);
		if (r === null) return null;
		t.push(r);
	}
	return t.length === 0 ? null : t;
}
function Al(e) {
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
	if (n !== null) return jl({
		kind: "auto",
		value: 0
	}, Number(n[1]));
	let r = /^minmax\(\s*([\d.]+)(?:px)?\s*,\s*([\d.]+)(fr|px)\s*\)$/.exec(e);
	if (r !== null) return jl(r[3] === "fr" ? {
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
function jl(e, t) {
	return t > 0 ? {
		...e,
		min: t
	} : e;
}
function Ml(e) {
	let t = [], n = 0, r = 0;
	for (let i = 0; i < e.length; i++) {
		let a = e[i];
		a === "(" ? n++ : a === ")" ? n-- : a === " " && n === 0 && (i > r && t.push(e.slice(r, i)), r = i + 1);
	}
	return r < e.length && t.push(e.slice(r)), t;
}
function Nl(e, t = "auto") {
	return e.map((e) => Pl(e, t)).join(" ");
}
function Pl(e, t) {
	switch (e.kind) {
		case "px": return `${Fl(e.value)}px`;
		case "star": return `minmax(${e.min === void 0 ? "0" : `${Fl(e.min)}px`}, ${Fl(e.value)}fr)`;
		case "auto": return e.min === void 0 ? e.max === void 0 ? t : `fit-content(${Fl(e.max)}px)` : `minmax(${Fl(e.min)}px, auto)`;
	}
}
function Fl(e) {
	return String(Math.round(e * 1e3) / 1e3);
}
function Il(e) {
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
function Ll(e, t) {
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
function Rl(e, t, n) {
	let r = 0, i = n;
	for (let n of t) n < e && n + 1 > r ? r = n + 1 : n > e && n < i && (i = n);
	let a = zl(r, e), o = zl(e + 1, i);
	return a.length === 0 || o.length === 0 ? null : {
		before: a,
		after: o
	};
}
function zl(e, t) {
	let n = [];
	for (let r = e; r < t; r++) n.push(r);
	return n;
}
var Bl = {
	sliver: 120,
	passFloors: !1
};
function Vl(e, t, n, r, i = Bl) {
	let a = Wl(e, t, n.before), o = Wl(e, t, n.after);
	if (a.total + o.total <= 0) return null;
	let s = Math.max((i.passFloors ? 0 : a.min) - a.total, o.total - o.max), c = Math.min(a.max - a.total, o.total - (i.passFloors ? 0 : o.min));
	if (s > c) return null;
	let l = (e) => i.sliver > 0 && i.passFloors ? Math.max(i.sliver, e.min) : i.sliver, u = Ul(Math.min(Math.max(r, s), c), r, a.total, o.total, s, c, l(a), l(o));
	if (u === 0) return null;
	let d = [...e], f = n.before.every((t) => e[t].kind === "star"), p = n.after.every((t) => e[t].kind === "star");
	if (f && p) {
		let t = Yl(n.before, e) + Yl(n.after, e), r = a.total + o.total;
		Gl(d, e, a, t * (a.total + u) / r), Gl(d, e, o, t * (o.total - u) / r);
	} else f || Kl(d, a, a.total + u), p || Kl(d, o, o.total - u);
	return i.passFloors && (Hl(d, a, a.total + u), Hl(d, o, o.total - u)), d;
}
function Hl(e, t, n) {
	if (!(n >= t.min - .5)) for (let n of t.indices) {
		let { min: t, ...r } = e[n];
		e[n] = r;
	}
}
function Ul(e, t, n, r, i, a, o, s) {
	let c = e, l = n + c, u = r - c;
	return l > 0 && l < o ? c = t < 0 ? -n : o - n : u > 0 && u < s && (c = t > 0 ? r : r - s), Math.min(Math.max(c, i), a);
}
function Wl(e, t, n) {
	let r = Jl(n, t), i = n.map((e) => r > 0 ? t[e] / r : 1 / n.length), a = 0, o = Infinity;
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
function Gl(e, t, n, r) {
	let i = Yl(n.indices, t);
	for (let a = 0; a < n.indices.length; a++) {
		let o = n.indices[a], s = i > 0 && n.total > 0 ? n.shares[a] : 1 / n.indices.length;
		e[o] = {
			...t[o],
			value: r * s
		};
	}
}
function Kl(e, t, n) {
	for (let r = 0; r < t.indices.length; r++) {
		let i = t.indices[r];
		e[i] = {
			kind: "px",
			value: n * t.shares[r],
			...ql(e[i])
		};
	}
}
function ql(e) {
	return {
		...e.min === void 0 ? {} : { min: e.min },
		...e.max === void 0 ? {} : { max: e.max }
	};
}
function Jl(e, t) {
	let n = 0;
	for (let r of e) n += t[r];
	return n;
}
function Yl(e, t) {
	let n = 0;
	for (let r of e) n += t[r].value;
	return n;
}
function Xl(e, t) {
	return Math.round(Zl(e, t) * 100);
}
function Zl(e, t) {
	let n = Jl(t.before, e), r = n + Jl(t.after, e);
	return r <= 0 ? 0 : n / r;
}
function Ql(e, t, n) {
	let r = Jl(t.before, e);
	return (r + Jl(t.after, e)) * Math.min(Math.max(n, 0), 1) - r;
}
function $l(e) {
	let t = e === null || e.length === 0 ? NaN : Number(e);
	return t >= 0 && t <= 1 ? t : null;
}
function eu(e, t) {
	let n = [];
	for (let r = 0, i = 0; r < t; r++) n.push(i), i += Number.isFinite(e[r]) ? e[r] : 0;
	return n;
}
var tu = /* @__PURE__ */ new Set();
function nu(e, t, n, r) {
	let i = Wl(e, t, n.before), a = Wl(e, t, n.after);
	return i.total >= 1 && i.total < r ? -i.total : a.total >= 1 && a.total < r ? a.total : i.total >= 1 && i.total < i.min - .5 ? i.min - i.total : a.total >= 1 && a.total < a.min - .5 ? a.total - a.min : 0;
}
function ru(e, t, n, r) {
	let i = /* @__PURE__ */ new Set();
	for (let a of [n.before, n.after]) {
		let n = Wl(e, t, a);
		n.total < Math.max(r, n.min - .5) && a.forEach((e) => i.add(e));
	}
	return i;
}
function iu(e, t) {
	return e.map((e, n) => t.has(n) ? {
		kind: "px",
		value: 0
	} : e);
}
function au(e, t, n, r = tu) {
	let i = Number(e);
	if (!Number.isInteger(i) || i < 1) return !1;
	let a = /^span\s+(\d+)$/.exec(t.trim()), o = Number(t), s = a === null ? Number.isInteger(o) && o > i ? o : i + 1 : i + Number(a[1]);
	return s - 1 <= n.length && n.slice(i - 1, s - 1).every((e, t) => e < 1 || r.has(i - 1 + t));
}
//#endregion
//#region src/extensions/value-readers.ts
function ou(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" ? String(e) : JSON.stringify(e);
}
function su(e) {
	return e == null;
}
var cu = "data-ui-trim-input", lu = class {
	readers = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let e of pu) this.register(e);
		for (let t of e ?? []) this.register(t);
	}
	register(e) {
		this.readers.set(e.kind, e.read);
	}
	read(e) {
		let t = e.getAttribute(Ht);
		if (t === null) return uu(e);
		let n = this.readers.get(t);
		return n === void 0 ? (s("value reader: no reader registered for this kind.", { kind: t }), null) : n(e);
	}
	readBound(e) {
		let t = this.read(e);
		return typeof t == "string" && e.hasAttribute(cu) ? t.trim() : t;
	}
	readHeld(e) {
		let t = fu(e);
		return t === null ? null : this.read(t);
	}
};
function uu(e) {
	if (e instanceof HTMLInputElement) switch (e.type) {
		case "checkbox": return e.checked;
		case "number":
		case "range": return e.value.trim().length === 0 ? null : Number(e.value);
		default: return e.value;
	}
	return e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement ? e.value : e instanceof HTMLDetailsElement ? e.open : null;
}
var du = "input, textarea, select";
function fu(e) {
	return e.hasAttribute("data-ui-value-kind") || e.matches(du) ? e : e.querySelector("[data-ui-value-holder]") ?? e.querySelector(`[data-ui-value-kind], ${du}`);
}
var pu = [
	{
		kind: "flyout-open",
		read: (e) => e.classList.contains("ui-flyout--open")
	},
	{
		kind: "splitter-position",
		read: (e) => $l(e.getAttribute(Qn))
	},
	{
		kind: "pane-layout",
		read: (e) => e.getAttribute($n)
	},
	{
		kind: "tabs-selected",
		read: (e) => e.getAttribute(mi)
	},
	{
		kind: "tab-caption",
		read: (e) => e.getAttribute(hi)
	},
	{
		kind: "tab-pinned",
		read: (e) => e.hasAttribute(yi)
	},
	{
		kind: "tree-title",
		read: (e) => e.getAttribute(Dr)
	},
	{
		kind: "tree-drop-target",
		read: (e) => e.getAttribute("data-ui-tree-drop-target") ?? ""
	},
	{
		kind: "selected-key",
		read: (e) => e.getAttribute(di)
	},
	{
		kind: "selected-keys",
		read: (e) => mu(e, fi)
	},
	{
		kind: Ut,
		read: (e) => mu(e, ft)
	},
	{
		kind: Wt,
		read: (e) => e.getAttribute(pt)
	},
	{
		kind: Gt,
		read: (e) => e.getAttribute(mt)
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
function mu(e, t) {
	let n = e.getAttribute(t);
	return n === null ? null : JSON.parse(n);
}
function hu(e) {
	e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio") ? e.checked = !1 : (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement) && (e.value = "");
}
//#endregion
//#region src/interactions/keyboard-shortcut.ts
function gu(e) {
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
		default: o = Mu(e);
	}
	return o === null ? null : {
		code: o,
		ctrl: n,
		shift: r,
		alt: i,
		meta: a
	};
}
function _u(e, t, n = Eu()) {
	return t.code !== e.code || t.shiftKey !== e.shift || t.altKey !== e.alt ? !1 : e.ctrl && !e.meta && n ? t.ctrlKey !== t.metaKey : t.ctrlKey === e.ctrl && t.metaKey === e.meta;
}
function vu(e, t = Eu()) {
	let n = Su(e.code, t);
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
function yu(e, t = Eu()) {
	let n = bu(e.code), r = (t, r) => [
		t ? "Control" : "",
		e.alt ? "Alt" : "",
		e.shift ? "Shift" : "",
		r ? "Meta" : "",
		n
	].filter((e) => e.length > 0).join("+");
	return e.ctrl && !e.meta && t ? `${r(!0, !1)} ${r(!1, !0)}` : r(e.ctrl, e.meta);
}
function bu(e) {
	return /^Key[A-Z]$/.test(e) ? e.slice(3) : /^Digit[0-9]$/.test(e) ? e.slice(5) : xu[e] ?? e;
}
var xu = {
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
function Su(e, t) {
	return /^Key[A-Z]$/.test(e) ? e.slice(3) : /^Digit[0-9]$/.test(e) ? e.slice(5) : (t ? wu[e] : void 0) ?? Cu[e] ?? e;
}
var Cu = {
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
}, wu = {
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
}, Tu = null;
function Eu() {
	return Tu === null && (Tu = Du()), Tu;
}
function Du() {
	if (typeof navigator > "u") return !1;
	let e = navigator.userAgentData?.platform;
	return /mac/i.test(e ?? navigator.platform ?? "");
}
var Ou = {
	words(e) {
		let t = gu(e);
		return t === null ? null : vu(t);
	},
	aria(e) {
		let t = gu(e);
		return t === null ? null : yu(t);
	},
	matches(e, t) {
		let n = gu(t);
		return n !== null && _u(n, e);
	},
	isComposing: M
}, ku = 229;
function M(e) {
	return e.isComposing || e.keyCode === ku;
}
function N(e, t = {}) {
	return !e.ctrlKey && !e.metaKey && (t.alt === !0 || !e.altKey) && (t.shift === !0 || !e.shiftKey) && !M(e);
}
var Au = class {
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
function ju(e) {
	return [
		e.ctrl ? "ctrl" : "",
		e.shift ? "shift" : "",
		e.alt ? "alt" : "",
		e.meta ? "meta" : "",
		e.code
	].filter((e) => e.length > 0).join("+");
}
function Mu(e) {
	if (e.length === 1) {
		let t = e.toUpperCase();
		return t >= "A" && t <= "Z" ? `Key${t}` : t >= "0" && t <= "9" ? `Digit${t}` : Nu[t] ?? null;
	}
	let t = e.length === 0 ? "" : e[0].toUpperCase() + e.slice(1).toLowerCase();
	return /^F([1-9]|1[0-9]|2[0-4])$/.test(t.toUpperCase()) ? t.toUpperCase() : Nu[t] ?? null;
}
var Nu = {
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
}, Pu = "data-ui-rename-field";
function Fu(e) {
	return e instanceof Element && e.closest(`[${Pu}]`) !== null;
}
function Iu(e) {
	let { container: t, title: n } = e;
	if (t.querySelector(`.${e.className}`) !== null) return !1;
	let r = document.createElement("input");
	r.type = "text", r.className = e.className, r.setAttribute(Pu, ""), r.setAttribute($e, ""), r.value = e.value, zu(r, n, t);
	let i = !1, a = null, o = (t, o) => {
		if (i) return;
		i = !0, a?.();
		let s = r.value.trim();
		r.remove(), n.style.visibility = "", t && (s.length > 0 || e.allowEmpty === !0) && s !== e.value && e.commit(s), e.done?.(), o && e.refocus?.();
	};
	return r.addEventListener("keydown", (e) => {
		if (!M(e)) {
			if (e.key === "Enter") o(!0, !0);
			else if (e.key === "Escape") o(!1, !0);
			else return;
			e.preventDefault(), e.stopPropagation();
		}
	}), r.addEventListener("blur", () => o(!0, !1)), n.style.visibility = "hidden", t.appendChild(r), t.getClientRects().length > 0 ? Lu(r) : a = Ru(t, () => {
		zu(r, n, t), Lu(r);
	}), !0;
}
function Lu(e) {
	e.focus(), e.setSelectionRange(0, e.value.length, "backward"), e.scrollLeft = 0;
}
function Ru(e, t) {
	let n = new ResizeObserver(() => {
		e.getClientRects().length !== 0 && (n.disconnect(), t());
	});
	return n.observe(e), () => n.disconnect();
}
function zu(e, t, n) {
	let r = t.getBoundingClientRect(), i = n.getBoundingClientRect(), a = getComputedStyle(t), o = Bu(n), s = o > 0 && i.width > 0 ? i.width / o : 1;
	e.style.left = Vu((r.left - i.left) / s - n.clientLeft), e.style.top = Vu((r.top - i.top) / s - n.clientTop), e.style.width = Vu(r.width / s), e.style.height = Vu(r.height / s), e.style.fontFamily = a.fontFamily, e.style.fontSize = a.fontSize, e.style.fontWeight = a.fontWeight, e.style.fontStyle = a.fontStyle, e.style.lineHeight = a.lineHeight, e.style.letterSpacing = a.letterSpacing, e.style.textAlign = a.textAlign;
}
function Bu(e) {
	let t = getComputedStyle(e), n = parseFloat(t.width);
	return Number.isFinite(n) ? t.boxSizing === "border-box" ? n : n + parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth) : e.offsetWidth;
}
function Vu(e) {
	return `${Math.round(e * 64) / 64}px`;
}
//#endregion
//#region src/interactions/field-escape.ts
var Hu = "data-ui-runs-on-escape", Uu = "ui-key-value-action__row", Wu = "ui-key-value-action__value-input", Gu = "ui-key-value-action__edit-action";
function Ku(e) {
	return M(e) || qu(e.target) !== null;
}
function qu(e) {
	return e instanceof Element ? Fu(e) || Ju(e) ? e : e.closest("[data-ui-owns-keys]") ?? Yu(e)?.cell ?? null : null;
}
function Ju(e) {
	return e instanceof Element && e.hasAttribute(Hu) && (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && !e.readOnly && !k(e);
}
function Yu(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${Wu}, .${Gu}`), n = t?.closest(".ui-key-value-action__row") ?? null;
	return t === null || n === null || !n.hasAttribute("data-ui-row-editing") ? null : {
		cell: t,
		row: n
	};
}
//#endregion
//#region src/interactions/caret-fields.ts
var Xu = /* @__PURE__ */ new Set([
	"text",
	"search",
	"number",
	"password",
	"email",
	"url",
	"tel"
]), Zu = /* @__PURE__ */ new Set([
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
]), Qu = /* @__PURE__ */ new Set([
	"KeyA",
	"KeyC",
	"KeyV",
	"KeyX",
	"KeyZ",
	"KeyY",
	"Insert"
]), $u = /^F\d{1,2}$/;
function ed(e) {
	return e instanceof HTMLInputElement && Xu.has(e.type);
}
function td(e) {
	return ed(e) || e instanceof HTMLTextAreaElement;
}
function nd(e) {
	return td(e) || e instanceof HTMLElement && e.isContentEditable;
}
function rd(e) {
	let t = e.target;
	if (!nd(t)) return !1;
	if (M(e)) return !0;
	let n = e.key;
	return n === "Tab" || n === "Escape" || $u.test(n) || e.altKey ? !1 : n === "Enter" ? !ed(t) : e.ctrlKey || e.metaKey ? Zu.has(n) || Qu.has(e.code) : !0;
}
var id = {
	...Ou,
	isFieldKey: rd,
	isPlainKey: N,
	isEscapeClaimed: Ku
}, ad = "ui-draft-dropped";
function od(e) {
	e.dispatchEvent(new Event(ad, { bubbles: !0 }));
}
//#endregion
//#region src/interactions/own-control.ts
var sd = `.ui-text-input__row, .ui-number-input__row, .ui-temporal-input__row, .ui-file-input__row, .ui-color-input__row, .${Ni}, .ui-field-box`, cd = "button, a, input, select, textarea, label, summary, [role='button'], [contenteditable=''], [contenteditable='true']", ld = `${cd}, ${sd}, ${Mi}, .${_e}`, ud = "button, a, summary, [role='button']";
function dd(e) {
	let t = [];
	for (let n of e.querySelectorAll(ld)) if (!(n.classList.contains("ui-row__grip") || !md(e, n) || pd(e, n) || t.some((e) => e.contains(n))) && (t.push(n), t.length > 1)) return null;
	let n = t[0];
	return n instanceof HTMLElement && n.matches(ud) ? n : null;
}
function fd(e) {
	let t = [];
	for (let n of e.querySelectorAll(cd)) pd(e, n) && md(e, n) && t.push(n);
	return t;
}
function pd(e, t) {
	let n = t.closest(`[${de}]`);
	return n !== null && n !== e && e.contains(n);
}
function md(e, t) {
	let n = t.closest(Mi);
	return (n === null || !e.contains(n)) && t.closest(".ui-action-bar") === null;
}
function hd(e, t) {
	if (!(e instanceof Element)) return null;
	let n = e.closest(ld);
	return n !== null && n !== t && t.contains(n) ? n : null;
}
//#endregion
//#region src/interactions/roving-focus.ts
function gd(e) {
	let t = bd(e.key), n = xd(e.key, e.axis);
	if (t === null && n === 0) return null;
	let r = e.items.filter(F);
	if (r.length === 0) return null;
	if (t !== null) return t === "first" ? r[0] : r[r.length - 1];
	let i = e.current === null ? -1 : r.indexOf(e.current);
	if (i === -1) return n > 0 ? r[0] : r[r.length - 1];
	let a = i + n;
	return a >= 0 && a < r.length ? r[a] : e.loop ?? !0 ? r[(a + r.length) % r.length] : null;
}
function _d(e, t) {
	return bd(e) !== null || xd(e, t) !== 0;
}
var vd = {
	target: gd,
	applyTabIndex: P
};
function P(e, t) {
	for (let n of e) n.tabIndex = n === t ? 0 : -1;
}
function yd(e, t) {
	t !== null && (P(e, t), t.focus());
}
function F(e) {
	return e.getClientRects().length > 0 && !k(e);
}
function bd(e) {
	return e === "Home" ? "first" : e === "End" ? "last" : null;
}
function xd(e, t) {
	return t !== "horizontal" && (e === "ArrowDown" || e === "ArrowUp") ? e === "ArrowDown" ? 1 : -1 : t !== "vertical" && (e === "ArrowRight" || e === "ArrowLeft") ? e === "ArrowRight" ? 1 : -1 : 0;
}
//#endregion
//#region src/items/items-viewport.ts
function Sd(e) {
	return e.hasAttribute("data-ui-host-viewport") ? e.parentElement ?? e : e;
}
function Cd(e) {
	return e instanceof Element ? e.hasAttribute("data-ui-items-host") ? e : e.querySelector(`:scope > [${x}][${qt}]`) : null;
}
function wd(e) {
	let t = Sd(e);
	return t === e ? {
		top: e.scrollTop,
		height: e.clientHeight,
		contentHeight: e.scrollHeight
	} : {
		top: t.scrollTop - Ed(e, t),
		height: t.clientHeight,
		contentHeight: e.scrollHeight
	};
}
function Td(e, t) {
	let n = Sd(e);
	n.scrollTop = n === e ? t : t + Ed(e, n);
}
function Ed(e, t) {
	return e.getBoundingClientRect().top - t.getBoundingClientRect().top - t.clientTop + t.scrollTop;
}
function Dd(e) {
	let t = e.getBoundingClientRect();
	return t.height > 0 || e.firstElementChild === null ? t : e.firstElementChild.getBoundingClientRect();
}
//#endregion
//#region src/interactions/multi-select-keys.ts
function Od(e) {
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
function kd(e) {
	if (e === null) return null;
	let t = Number(e);
	return Number.isInteger(t) && t > 0 ? t : null;
}
function Ad(e, t) {
	return t !== null && e.length >= t;
}
function jd(e, t, n) {
	return e.includes(t) ? e.filter((e) => e !== t) : Ad(e, n) ? null : [...e, t];
}
function Md(e, t) {
	return e.includes(t) ? e.filter((e) => e !== t) : null;
}
var Nd = /[,\uFF0C\r\n]/;
function Pd(e) {
	return Nd.test(e);
}
function Fd(e) {
	return e.split(Nd).map((e) => e.trim()).filter((e) => e.length > 0);
}
function Id(e) {
	let t = e.split(Nd), n = t.pop() ?? "";
	return {
		tags: t.map((e) => e.trim()).filter((e) => e.length > 0),
		rest: n
	};
}
function Ld(e, t, n, r, i) {
	let a = [...e], o = [], s = null;
	for (let e of t) {
		if (a.includes(e.key)) continue;
		let t = [...a, e.key], c = Ad(a, n) ? r : i(a, t);
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
function Rd(e, t, n) {
	let r = [];
	for (let i of e.querySelectorAll(t)) i.closest(n) === e && r.push(i);
	return r;
}
function zd(e) {
	return Rd(e, Gn, `.${Ln}`);
}
//#endregion
//#region src/interactions/selected-key.ts
function Bd(e, t, n) {
	t.length !== 0 && e.getAttribute(n.attribute) !== t && (e.setAttribute(n.attribute, t), n.apply(e), e.hasAttribute(n.bindingAttribute) && e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function Vd(e, t, n) {
	return e.length === 0 ? null : e.some((e) => n(e) === t) ? t : n(e[0]);
}
//#endregion
//#region src/interactions/row-selection.ts
var Hd = "data-ui-bind-selected-keys", I = `.ui-items-view, .ui-table, .${dr}`, Ud = `.ui-items-view__item, .${sr}, .${fr}`, Wd = ".ui-items-view, .ui-table", Gd = {
	shift: !1,
	ctrl: !1
}, Kd = /* @__PURE__ */ new WeakMap();
function qd(e, t) {
	t !== null && !Kd.has(e) && Jd(e, t);
}
function Jd(e, t) {
	let n = R(t);
	n.length > 0 && Kd.set(e, n);
}
function Yd(e) {
	return {
		shift: e.shiftKey,
		ctrl: e.ctrlKey || e.metaKey
	};
}
function Xd(e, t) {
	let n = Yd(t);
	return n.shift && e.hasAttribute("data-ui-no-row-select") ? {
		shift: !0,
		ctrl: !0
	} : n;
}
function Zd(e) {
	return !e.hasAttribute(Sr);
}
function L(e) {
	if (e.getClientRects().length > 0) return e;
	let t = e.querySelector(`:scope > [${y}]`);
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function Qd(e) {
	switch (e.getAttribute(li)) {
		case "one": {
			let t = e.getAttribute(di);
			return new Set(t === null || t.length === 0 ? [] : [t]);
		}
		case "many": return new Set(cf(lf(e)));
		default: return /* @__PURE__ */ new Set();
	}
}
function $d(e, t) {
	let n = Qd(e), r = e.getAttribute(li), i = r === "one" || r === "many";
	for (let e of t) {
		let t = n.has(R(e));
		e.toggleAttribute(ui, t);
		let r = i ? t ? "true" : "false" : null;
		e.getAttribute("aria-selected") !== r && (r === null ? e.removeAttribute("aria-selected") : e.setAttribute("aria-selected", r));
	}
}
function ef(e) {
	return e.filter((e) => e.hasAttribute(ui));
}
function tf(e, t, n, r, i) {
	let a = R(n);
	if (!af(n)) return !1;
	switch (e.getAttribute(li)) {
		case "one": return Bd(e, a, {
			attribute: di,
			bindingAttribute: pi,
			apply: (e) => $d(e, t)
		}), !0;
		case "many": return nf(e, t, n, a, r, i), !0;
		default: return !1;
	}
}
function nf(e, t, n, r, i, a) {
	let o = lf(e);
	if (o === null) return;
	let s = cf(o), c;
	if (i.shift) {
		let o = Kd.get(e), l = o === void 0 ? null : a?.(o, r) ?? null, u = t.find((e) => R(e) === o) ?? n, d = l === null ? sf(t, u, n).map(R) : of(l, t);
		c = i.ctrl ? [...s.filter((e) => !d.includes(e)), ...d] : d;
	} else i.ctrl ? (c = s.includes(r) ? s.filter((e) => e !== r) : [...s, r], Kd.set(e, r)) : (c = [r], Kd.set(e, r));
	rf(e, t, c);
}
function rf(e, t, n) {
	let r = lf(e);
	if (r === null) return;
	let i = JSON.stringify(n);
	r.getAttribute("data-ui-selected-keys") !== i && (r.setAttribute(fi, i), $d(e, t), r.hasAttribute(Hd) && r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function af(e) {
	return R(e).length > 0 && !Cl(e, "data-ui-unselectable") && !A(e);
}
function of(e, t) {
	let n = new Map(t.map((e) => [R(e), e]));
	return e.filter((e) => {
		let t = n.get(e);
		return t === void 0 || L(t) !== null && af(t);
	});
}
function sf(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	return r < 0 || i < 0 ? [n] : e.slice(Math.min(r, i), Math.max(r, i) + 1).filter((e) => L(e) !== null && af(e));
}
function cf(e) {
	return Od(e?.getAttribute("data-ui-selected-keys") ?? null);
}
function lf(e) {
	let t = e.closest(S);
	for (let n of e.querySelectorAll(`[${x}]`)) if (n.closest(I) === e && n.closest("[data-ui-id]") === t) return n;
	return null;
}
function R(e) {
	return e.getAttribute("data-ui-key") ?? "";
}
var uf = {
	isSelected: (e) => e.hasAttribute(ui),
	toggle: df,
	setSelected: ff,
	setSelectedKeys: pf
};
function df(e) {
	let t = e.closest(I);
	t !== null && e instanceof HTMLElement && tf(t, mf(t), e, {
		shift: !1,
		ctrl: !0
	});
}
function ff(e, t, n) {
	let r = [];
	for (let e of t) e.classList.contains("ui-hidden") || r.push(R(e));
	pf(e, r, n);
}
function pf(e, t, n) {
	if (!(e instanceof HTMLElement)) return;
	let r = mf(e), i = new Set(r.filter((e) => !af(e)).map(R)), a = /* @__PURE__ */ new Set();
	for (let e of t) e.length > 0 && !i.has(e) && a.add(e);
	let o = [...Qd(e)].filter((e) => !a.has(e));
	rf(e, r, n ? [...o, ...a] : o);
}
function mf(e) {
	return Rd(e, Ud, I);
}
//#endregion
//#region src/interactions/table-column-layout.ts
var hf = "--ui-table-order-";
function gf(e) {
	let t = new Set((e.getAttribute("data-ui-table-hidden") ?? "").split(" ").filter((e) => e.length > 0)), n = e instanceof HTMLElement ? e.style : null;
	return {
		place: (e) => {
			let t = n?.getPropertyValue(`--ui-table-order-${e}`).trim() ?? "";
			return t.length === 0 ? e : Number(t);
		},
		isHidden: (e) => t.has(String(e))
	};
}
var _f = "ui-table", vf = `[${rr}]:not(.${ur})`, yf = `.${sr} > [aria-colspan]:not([${rr}])`;
function bf(e, t, n, r) {
	let i = /* @__PURE__ */ new Map();
	for (let e of t) n.has(e) || i.set(e, String(i.size + 1));
	let a = String(i.size), o = r ? ":not([aria-colindex])" : "";
	w(e, "aria-colcount", a);
	for (let t of e.querySelectorAll(`${vf}${o}, ${yf}${o}`)) {
		if (t.closest(`.${_f}`) !== e) continue;
		if (!t.hasAttribute("data-ui-table-column")) {
			w(t, "aria-colindex", "1"), w(t, "aria-colspan", a);
			continue;
		}
		let n = i.get(Number(t.getAttribute(rr)));
		n === void 0 ? t.removeAttribute("aria-colindex") : w(t, "aria-colindex", n);
	}
}
//#endregion
//#region src/interactions/row-cursor.ts
var xf = ".ui-table[role='grid']", Sf = "gridcell", Cf = "aria-colspan", wf = /* @__PURE__ */ new WeakMap();
function Tf(e) {
	let t = e.closest(I);
	if (t === null) return null;
	if (e === t) return {
		root: t,
		row: null
	};
	let n = e.closest(Ud);
	return n !== null && n.closest(I) === t ? {
		root: t,
		row: n
	} : null;
}
function Ef(e) {
	return e.target instanceof Element && !rd(e) ? Df(e.target) : null;
}
function Df(e) {
	let t = Tf(e);
	if (t === null || t.row !== null && hd(e, t.row) !== null) return null;
	let n = e.closest(`[${ji}]`);
	return n !== null && n !== t.root && t.root.contains(n) ? null : t;
}
function Of(e) {
	return e.filter(kf);
}
function kf(e) {
	return L(e) !== null && !A(e);
}
function Af(e) {
	return jf(e) ?? Of(e)[0] ?? null;
}
function jf(e) {
	return e.find((e) => e.hasAttribute("data-ui-row-focus")) ?? e.find((e) => e.hasAttribute("data-ui-selected") && !A(e)) ?? null;
}
function Mf(e) {
	return jf(mf(e));
}
function Nf(e, t) {
	if (e.hasAttribute("data-ui-row-cursor-waits") || t.some((e) => e.hasAttribute("data-ui-row-focus"))) return;
	let n = Af(t);
	n !== null && Ff(e, t, n);
}
function Pf(e, t) {
	t === null ? e.removeAttribute("aria-labelledby") : e.setAttribute("aria-labelledby", ta(t, "ui-row-name"));
}
function Ff(e, t, n, r = null, i = !0) {
	for (let e of t) e !== n && e.hasAttribute("data-ui-row-focus") && e.removeAttribute(Ne);
	n.hasAttribute("data-ui-row-focus") || n.setAttribute(Ne, ""), e.removeAttribute(Pe);
	let a = If(e, n, r);
	i && ((L(n) ?? n).scrollIntoView({ block: "nearest" }), a !== null && Hf(e, n, a));
}
function If(e, t, n) {
	let r = Lf(e) ? Rf(e, t, n) : null;
	for (let t of e.querySelectorAll(`[${Ie}]`)) t !== r && t.closest(I) === e && t.removeAttribute(Ie);
	if (r === null) return e.setAttribute("aria-activedescendant", ta(t, "ui-row")), null;
	r.hasAttribute("data-ui-cell-focus") || r.setAttribute(Ie, "");
	let i = r.getAttribute(rr);
	return i !== null && wf.set(e, i), e.setAttribute("aria-activedescendant", ta(r, "ui-cell")), r;
}
function Lf(e) {
	return e.matches(xf);
}
function Rf(e, t, n) {
	if (n instanceof HTMLElement && n.parentElement === t && n.getAttribute("role") === Sf) {
		if (!n.hasAttribute("data-ui-owns-keys")) return n;
		let e = zf(t, n.getAttribute(rr));
		if (e !== null) return e;
	}
	let r = Bf(e, t), i = wf.get(e);
	if (i === void 0) return r[0] ?? null;
	let a = r.find((e) => e.getAttribute(rr) === i);
	if (a !== void 0) return a;
	let o = gf(e), s = o.place(Number(i)), c = (e) => Math.abs(o.place(Number(e.getAttribute(rr))) - s);
	return r.reduce((e, t) => e === null || c(t) < c(e) ? t : e, null);
}
function zf(e, t) {
	for (let n of e.children) if (t !== null && n instanceof HTMLElement && n.getAttribute("data-ui-table-column") === t && Vf(n)) return n;
	return null;
}
function Bf(e, t) {
	let n = gf(e), r = [];
	for (let e of t.children) {
		let t = Number(e.getAttribute("data-ui-table-column") ?? NaN);
		e instanceof HTMLElement && Number.isInteger(t) && Vf(e) && !n.isHidden(t) && r.push({
			cell: e,
			place: n.place(t)
		});
	}
	return r.sort((e, t) => e.place - t.place).map((e) => e.cell);
}
function Vf(e) {
	return e.getAttribute("role") === Sf && !e.hasAttribute("data-ui-owns-keys");
}
function Hf(e, t, n) {
	let r = e.querySelector(`:scope > .${cr}`);
	if (r === null || !(r.scrollWidth > r.clientWidth) || !n.hasAttribute("data-ui-table-column")) return;
	let i = r.getBoundingClientRect(), a = i.left + i.width / 2, o = i.left + r.clientLeft, s = o + r.clientWidth;
	for (let e of t.children) {
		if (e === n || !(e instanceof HTMLElement) || getComputedStyle(e).position !== "sticky") continue;
		let t = e.getBoundingClientRect();
		t.left + t.width / 2 < a ? o = Math.max(o, t.right) : s = Math.min(s, t.left);
	}
	let c = n.getBoundingClientRect();
	r.scrollLeft += Uf(c.left, c.right, o, s);
}
function Uf(e, t, n, r) {
	return e < n ? e - n : t > r ? Math.min(t - r, e - n) : 0;
}
function Wf(e) {
	for (let t of e.children) if (t instanceof HTMLElement && t.hasAttribute("data-ui-cell-focus")) return t;
	return null;
}
function Gf(e) {
	return wf.get(e) ?? null;
}
function Kf(e, t, n, r) {
	if (n !== null && Yf(n)) return null;
	let i = Bf(e, t), a = n?.getAttribute("data-ui-table-column") ?? null, o = i.findIndex((e) => e.getAttribute(rr) === a);
	switch (r) {
		case "Home": return i[0] ?? null;
		case "End": return i[i.length - 1] ?? null;
		case "ArrowLeft": return o > 0 ? i[o - 1] : null;
		case "ArrowRight": return o < 0 ? i[0] ?? null : i[o + 1] ?? null;
		default: return null;
	}
}
function qf(e, t, n, r) {
	let i = Jf(t), a = (n === null ? -1 : i.indexOf(n)) + (r ? 1 : -1);
	return i.length === 0 || a < -1 || a >= i.length ? null : a === -1 ? Rf(e, t, null) : i[a];
}
function Jf(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && Yf(e));
}
function Yf(e) {
	return Vf(e) && e.hasAttribute(Cf) && !e.hasAttribute("data-ui-table-column");
}
function Xf(e) {
	let t = Jf(e);
	return t[t.length - 1] ?? null;
}
function Zf(e, t) {
	let n = t;
	for (; n !== null && n.parentElement !== e;) n = n.parentElement;
	return n?.getAttribute("role") === Sf ? n : null;
}
function Qf(e, t = null) {
	let n = e.closest(I);
	n !== null && e instanceof HTMLElement && Ff(n, mf(n), e, t);
}
function $f(e, t) {
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
function ep(e, t) {
	return _d(e, t === "grid" ? "both" : t) || t !== "horizontal" && tp(e);
}
function tp(e) {
	return e === "PageDown" || e === "PageUp";
}
function np(e, t, n, r) {
	if (!ep(e, r)) return null;
	let i = Of(t);
	if (tp(e)) return rp(i, n, e === "PageDown");
	if (r === "grid" && (e === "ArrowUp" || e === "ArrowDown")) return ip(i, n, e === "ArrowDown");
	let a = i.map((e) => L(e) ?? e), o = gd({
		key: e,
		items: a,
		current: n === null ? null : L(n),
		axis: r === "grid" ? "horizontal" : r,
		loop: !1
	});
	return o === null ? null : i[a.indexOf(o)] ?? null;
}
function rp(e, t, n) {
	let r = t === null ? -1 : e.indexOf(t), i = r < 0 ? null : e[r].parentElement;
	if (i === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let a = (L(e[r]) ?? e[r]).getBoundingClientRect(), o = Math.min(wd(i).height, window.innerHeight), s = n ? 1 : -1, c = null;
	for (let t = r + s; t >= 0 && t < e.length; t += s) {
		let r = (L(e[t]) ?? e[t]).getBoundingClientRect();
		if (c !== null && (n ? r.bottom > a.top + o + .5 : r.top < a.bottom - o - .5)) break;
		c = e[t];
	}
	return c;
}
function ip(e, t, n) {
	let r = t === null ? null : L(t);
	if (r === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let i = r.getBoundingClientRect(), a = ap(i), o = e.map((e) => ({
		row: e,
		rect: (L(e) ?? e).getBoundingClientRect()
	})).filter(({ rect: e }) => n ? e.top >= i.bottom - .5 : e.bottom <= i.top + .5);
	if (o.length === 0) return null;
	let s = o.reduce((e, t) => (n ? t.rect.top < e.rect.top : t.rect.bottom > e.rect.bottom) ? t : e);
	return o.filter(({ rect: e }) => n ? e.top < s.rect.bottom - .5 : e.bottom > s.rect.top + .5).reduce((e, t) => Math.abs(ap(t.rect) - a) < Math.abs(ap(e.rect) - a) ? t : e).row;
}
function ap(e) {
	return e.left + e.width / 2;
}
var op = "ui-row-press";
function sp(e, t, n) {
	(e.hasAttribute("data-ui-id") ? e : e.querySelector(":scope > [data-ui-id]") ?? e).dispatchEvent(n === void 0 ? new Event(t, { bubbles: !0 }) : new CustomEvent(t, {
		bubbles: !0,
		detail: n
	}));
}
function cp(e, t, n) {
	let r = null, i = !1;
	for (let e of n) e instanceof HTMLElement && e.hasAttribute("data-ui-row-focus") && (r = e), i ||= e.contains(document.activeElement);
	if (r === null && !i) return null;
	let a = [], o = -1;
	if (r !== null) for (let e of t) e === r && (o = a.length), e instanceof HTMLElement && !n.has(e) && a.push(e);
	let s = r !== null && lp(r);
	return () => {
		i && e.focus({ preventScroll: !0 });
		let t = up(a, o);
		t === null ? r !== null && e.removeAttribute("aria-activedescendant") : Ff(e, a, t, null, s);
	};
}
function lp(e) {
	let t = L(e), n = e.parentElement;
	if (t === null || n === null) return !1;
	let r = t.getBoundingClientRect(), i = Sd(n).getBoundingClientRect();
	return r.bottom > Math.max(i.top, 0) && r.top < Math.min(i.bottom, window.innerHeight) && r.right > Math.max(i.left, 0) && r.left < Math.min(i.right, window.innerWidth);
}
function up(e, t) {
	if (t < 0) return null;
	for (let n = t; n < e.length; n++) if (kf(e[n])) return e[n];
	for (let n = Math.min(t, e.length) - 1; n >= 0; n--) if (kf(e[n])) return e[n];
	return null;
}
function dp(e, t) {
	let n = t.find((e) => e.hasAttribute(Ne));
	if (n === void 0 || L(n) !== null) return;
	let r = up(t, t.indexOf(n));
	r === null ? (n.removeAttribute(Ne), Wf(n)?.removeAttribute(Ie), e.removeAttribute("aria-activedescendant")) : Ff(e, t, r, null, !1);
}
function fp(e) {
	let t = e.parentElement, n = t?.closest(I) ?? null;
	return n !== null && (n === t || n === t?.parentElement) ? n : t;
}
function pp(e) {
	let t = e.hasAttribute(Ne), n = e.contains(document.activeElement);
	return t || n ? {
		cursor: t,
		focus: n,
		key: e.getAttribute(b)
	} : null;
}
function mp(e, t, n) {
	let r = fp(e);
	n !== null && r !== null && (n.focus && !r.contains(document.activeElement) && r.focus({ preventScroll: !0 }), n.cursor && (t === null ? (typeof n.key == "string" && r.setAttribute(Pe, n.key), r.removeAttribute("aria-activedescendant")) : [...e.children].some((e) => e !== t && e.hasAttribute("data-ui-row-focus")) || _p(r, t)));
}
function hp(e, t) {
	let n = fp(e), r = n?.getAttribute("data-ui-row-cursor-waits") ?? null;
	n !== null && r !== null && r === t.getAttribute("data-ui-key") && (n.removeAttribute(Pe), [...e.children].some((e) => e !== t && e.hasAttribute("data-ui-row-focus")) || _p(n, t));
}
function gp(e) {
	return e.getAttribute(Pe);
}
function _p(e, t) {
	t.setAttribute(Ne, ""), If(e, t, null);
}
//#endregion
//#region src/interactions/popup-focus.ts
var vp = "data-ui-active", yp = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(","), bp = /* @__PURE__ */ new Set([
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
]), xp = /* @__PURE__ */ new Set([
	"ArrowDown",
	"ArrowUp",
	"PageDown",
	"PageUp"
]), Sp = !1, Cp = !1, wp = null, Tp = /* @__PURE__ */ new Set(), Ep = [], Dp = /* @__PURE__ */ new WeakSet();
typeof window < "u" && (window.addEventListener("pointerdown", (e) => Op(e.target, e.pointerType), !0), window.addEventListener("keydown", (e) => kp(e), !0), window.addEventListener("focus", (e) => Mp(e.target), !0), window.addEventListener("focusin", (e) => Mp(e.target), !0), window.addEventListener("focusout", (e) => Np(e), !0), window.addEventListener("keydown", (e) => jp(e)));
function Op(e, t = "") {
	Sp = !0, Cp = t === "touch";
	let n = document.activeElement;
	wp = n, n instanceof Element && n !== document.body && e instanceof Node && n.contains(e) && Rp(n, !Pp(n)), zp(n);
}
function kp(e) {
	if (!(e instanceof KeyboardEvent && (bp.has(e.key) || Sp && Ap(e)))) {
		Sp = !1;
		for (let e of [...Tp]) Rp(e, !1);
		zp(document.activeElement);
	}
}
function Ap(e) {
	return !Pp(e.target) || e.key === "Tab" || e.altKey || e.ctrlKey || e.metaKey ? !1 : !(xp.has(e.key) && e.target instanceof Element && e.target.getAttribute("role") === "combobox");
}
function jp(e) {
	if (!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || !N(e)) return;
	let t = document.activeElement;
	t instanceof Element && t !== document.body && !Pp(t) && Rp(t, !0);
}
function Mp(e) {
	Sp && !Pp(e) && Rp(e, !0), e === document.activeElement && zp(document.activeElement);
}
function Np(e) {
	e.target instanceof Element && e.target.hasAttribute(vp) || Rp(e.target, !1), e.relatedTarget === null && queueMicrotask(() => zp(document.activeElement));
}
function Pp(e) {
	return td(e) ? !e.readOnly && !e.disabled : e instanceof HTMLElement && (e.isContentEditable || e.getAttribute("role") === "spinbutton" && e.getAttribute("aria-readonly") !== "true");
}
function Fp() {
	return Sp && wp instanceof HTMLElement && wp !== document.body ? wp : null;
}
function Ip() {
	return Sp;
}
function Lp() {
	return Sp && Cp;
}
function Rp(e, t) {
	if (e instanceof Element) {
		if (t) {
			for (let e of Tp) e.isConnected || Tp.delete(e);
			Tp.add(e);
		} else Tp.delete(e);
		e.hasAttribute("data-ui-pointer-focus") !== t && e.toggleAttribute(ai, t), e === document.activeElement && zp(e);
	}
}
function zp(e) {
	let t = e === null || e === document.body || Pp(e) ? null : e.hasAttribute("data-ui-pointer-focus") ? "pointer" : "keyboard", n = e === null || t === null ? [] : Bp(e);
	for (let e of Ep) n.includes(e) || e.removeAttribute(oi);
	for (let e of n) t !== null && e.getAttribute("data-ui-focus-within") !== t && e.setAttribute(oi, t);
	Ep = n;
}
function Bp(e) {
	let t = [];
	for (let n = e.parentElement; n !== null && n !== document.body && !n.hasAttribute("data-ui-region") && (t.push(n), !n.hasAttribute("data-ui-id") || Vp(n)); n = n.parentElement);
	return t;
}
function Vp(e) {
	return e.classList.contains("ui-menu--nested") || (e.parentElement?.closest(sd) ?? null) !== null;
}
function z(e) {
	Mp(e), Hp(e);
}
function Hp(e) {
	zp(e), e.focus({ preventScroll: !0 }), zp(document.activeElement);
}
function Up(e) {
	Rp(e, !0), Hp(e);
}
function Wp(e) {
	for (let t of e.querySelectorAll(yp)) if (wl(t)) return t;
	return null;
}
var Gp = {
	first: Wp,
	stops: (e) => Kp(e, document.activeElement),
	giveBack: (e) => em(e),
	trapTab: Yp
};
function Kp(e, t) {
	let n = [...e.querySelectorAll(yp)].filter((e) => e === t || e.tabIndex >= 0 && wl(e)), r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let t = qp(e);
		if (t === null) continue;
		let n = r.get(t);
		(n === void 0 || !Jp(n) && Jp(e)) && r.set(t, e);
	}
	return n.filter((e) => {
		let t = qp(e);
		return t === null || r.get(t) === e;
	});
}
function qp(e) {
	return e instanceof HTMLInputElement && e.type === "radio" && e.name !== "" ? e.name : null;
}
function Jp(e) {
	return e instanceof HTMLInputElement && e.checked;
}
function Yp(e, t) {
	let n = Kp(e, document.activeElement);
	if (n.length === 0) {
		t.preventDefault();
		return;
	}
	let r = Xp(e, n, document.activeElement, t.shiftKey);
	r !== null && (t.preventDefault(), r.focus());
}
function Xp(e, t, n, r) {
	let i = t[0], a = t[t.length - 1];
	return n === null || !e.contains(n) ? r ? a : i : !r && Zp(n, a) ? i : r && Zp(n, i) ? a : null;
}
function Zp(e, t) {
	return e === t || qp(e) !== null && qp(e) === qp(t);
}
var Qp = `.${Di}, .${Oi}, [${Ai}]`;
function $p(e) {
	let t = Tf(e)?.root ?? null;
	for (let n = e.parentElement; n !== null; n = n.parentElement) if ((n === t || n.matches(Qp)) && n.hasAttribute("tabindex") && wl(n)) return n;
	return null;
}
function em(e, t = $p(e)) {
	let n = document.activeElement;
	if (t?.isConnected !== !0 || n !== null && n !== document.body) return;
	let r = Tf(e);
	r?.root === t && r.row !== null && Ff(t, mf(t), r.row, Zf(r.row, e)), z(t);
}
function tm(e, t) {
	if (e.contains(document.activeElement)) return null;
	let n = document.activeElement instanceof HTMLElement ? document.activeElement : null, r = t ?? Wp(e);
	return nm(e), (r === null || r === e) && !e.hasAttribute("tabindex") && (e.tabIndex = -1), z(r ?? e), n;
}
function nm(e) {
	Sp ? Dp.add(e) : Dp.delete(e);
}
function rm(e, t) {
	e.scrollTop = 0, e.scrollLeft = 0;
	let n = t ?? Wp(e);
	return n !== null && im(e, n), tm(e, n);
}
function im(e, t) {
	let n = e.getBoundingClientRect().top + e.clientTop, r = n + e.clientHeight, i = t.getBoundingClientRect();
	i.bottom > r && (e.scrollTop += Math.min(i.bottom - r, i.top - n));
}
function am(e, t, n = !1) {
	if (nm(e), Sp) {
		P(t, null), e.hasAttribute("tabindex") || (e.tabIndex = -1), z(e);
		return;
	}
	let r = t.filter(F), i = (n ? r[r.length - 1] : r[0]) ?? null;
	i !== null && (P(t, i), z(i));
}
function om(e, t = null) {
	let n = e == null ? null : e.isConnected ? e : sm(e, t);
	for (let e = n; e !== null; e = e.parentElement) if (e.matches(`${yp}, [tabindex]`) && wl(e)) return e;
	return n === null ? null : cm(n);
}
function sm(e, t) {
	if (t === null) return null;
	for (let n = e.closest(S); n !== null; n = n.parentElement?.closest("[data-ui-id]") ?? null) {
		let e = t.findEveryComponent(E(n)).filter((e) => e.isConnected);
		if (e.length === 1 && e[0] instanceof HTMLElement) return e[0];
	}
	return null;
}
function cm(e) {
	for (let t = e.closest(S); t !== null; t = t.parentElement?.closest("[data-ui-id]") ?? null) if (wl(t)) return lm(t), t;
	return null;
}
function lm(e) {
	if (e.hasAttribute("tabindex") || e.tabIndex >= 0) return;
	e.tabIndex = -1;
	let t = (n) => {
		n.target === e && (e.removeAttribute("tabindex"), e.removeEventListener("focusout", t));
	};
	e.addEventListener("focusout", t);
}
function um(e, t) {
	let n = document.activeElement;
	e != null && t.contains(n) && (dm(n, t) && Rp(e, !Pp(e)), z(e));
}
function dm(e, t) {
	for (let n = e; n !== null; n = n === t ? null : n.parentElement ?? null) if (Dp.has(n)) return !0;
	return !1;
}
//#endregion
//#region src/state/value-equality.ts
function fm(e, t) {
	return Object.is(e, t) ? !0 : e === null || t === null || e === void 0 || t === void 0 ? !1 : e instanceof Date || t instanceof Date ? e instanceof Date && t instanceof Date && e.getTime() === t.getTime() : typeof e != "object" || typeof t != "object" ? !1 : Array.isArray(e) || Array.isArray(t) ? Array.isArray(e) && Array.isArray(t) && pm(e, t) : mm(e, t);
}
function pm(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!fm(e[n], t[n])) return !1;
	return !0;
}
function mm(e, t) {
	for (let n in e) if (Object.hasOwn(e, n) && (Object.hasOwn(t, n) ? !fm(e[n], t[n]) : !hm(e[n]))) return !1;
	for (let n in t) if (Object.hasOwn(t, n) && !Object.hasOwn(e, n) && !hm(t[n])) return !1;
	return !0;
}
function hm(e) {
	return e == null;
}
//#endregion
//#region src/updates/value-binding-engine.ts
var gm = "data-ui-clear", _m = ["change", "toggle"], vm = [
	..._m,
	"expand",
	"collapse",
	"open",
	"close"
];
function ym(e) {
	let t = la(e);
	return t === "TwoWay" || t === "OneWayToSource" || t === "OnSubmit";
}
function bm(e) {
	return la(e) === "OnSubmit";
}
function xm(e, t) {
	let n = e.getAttribute(Ze);
	if (n !== null) {
		let e = t.getBindingById(Number(n));
		return {
			bindingId: n,
			binding: e,
			buffered: e !== void 0 && bm(e.mode)
		};
	}
	for (let n of e.getAttributeNames()) {
		if (!n.startsWith("data-ui-bind-")) continue;
		let r = e.getAttribute(n) ?? "", i = t.getBindingById(Number(r));
		if (i !== void 0 && ym(i.mode)) return {
			bindingId: r,
			binding: i,
			buffered: bm(i.mode)
		};
	}
	return null;
}
var Sm = class {
	options;
	root;
	pendingSyncByComponent = /* @__PURE__ */ new WeakMap();
	bufferedElements = /* @__PURE__ */ new Set();
	unanswered = /* @__PURE__ */ new Map();
	sends = 0;
	pressedText = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, this.root = e.root ?? document;
		for (let e of _m) this.root.addEventListener(e, (e) => {
			this.handleValueEventAsync(e).catch((e) => {
				c("value binding engine failed.", e);
			});
		}, !0);
		this.root.addEventListener("input", (e) => this.holdEdited(e), !0), this.root.addEventListener(ad, (e) => this.releaseDropped(e)), this.root.addEventListener("click", (e) => this.handleClear(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && e.target.closest(`[${gm}]`) !== null && e.preventDefault();
		}, !0);
	}
	holdEdited(e) {
		e.target instanceof Element && !this.bufferedElements.has(e.target) && e.target.hasAttribute("data-ui-form-id") && xm(e.target, this.options.metadata)?.buffered === !0 && this.bufferValue(e.target);
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
	holdsPush(e, t) {
		let n = this.pressedText.get(e);
		if (n === void 0 || !td(e)) return this.isHeld(e);
		let r = this.options.valueReaders.readBound(e);
		if (r === n.text || typeof r != "string") return this.isHeld(e);
		if (r.startsWith(n.text) && (typeof t == "string" || t == null)) {
			let i = t ?? "";
			Cm(e, i + r.slice(n.text.length)), this.pressedText.set(e, {
				text: i,
				press: n.press
			}), e.dispatchEvent(new Event("input", { bubbles: !0 }));
		}
		return this.commitTyped(e), !0;
	}
	commitTyped(e) {
		let t = xm(e, this.options.metadata);
		t !== null && (t.buffered ? this.bufferValue(e) : this.syncValueAsync(e, t.bindingId).catch((e) => c("value binding engine failed.", e)));
	}
	handleClear(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${gm}]`);
		if (t === null) return;
		let n = t.closest(S), r = n?.querySelector("[data-ui-bind-value]") ?? n?.querySelector("input, textarea, select");
		r == null || wm(r) || (hu(r), r.dispatchEvent(new Event("input", { bubbles: !0 })), r.dispatchEvent(new Event("change", { bubbles: !0 })), td(r) && document.activeElement !== r && z(r));
	}
	async handleValueEventAsync(e) {
		if (!(e.target instanceof Element) || e.type === "change" && (j(e.target) || k(e.target))) return;
		let t = xm(e.target, this.options.metadata);
		t !== null && (e.type !== "change" || this.options.refuses?.(e.target) !== !0) && (t.buffered ? this.bufferValue(e.target) : (this.bufferedElements.delete(e.target), await this.syncValueAsync(e.target, t.bindingId)));
	}
	bufferValue(e) {
		e.getAttribute("data-ui-form-id") === null ? s("value binding engine: an OnSubmit value has no form to be submitted with.", { element: e.tagName }) : (this.bufferedElements.has(e) || this.pruneDetached(), this.bufferedElements.add(e));
	}
	pruneDetached() {
		for (let e of this.bufferedElements) e.isConnected || this.bufferedElements.delete(e);
	}
	pressForm(e) {
		let t = /* @__PURE__ */ new Map(), n = {}, r = [];
		for (let n of this.bufferedElements) n.isConnected && n.getAttribute("data-ui-form-id") === e && t.set(n, this.options.valueReaders.readBound(n));
		for (let t of this.root.querySelectorAll(`[${cn}="${C(e)}"]`)) {
			let e = td(t) && t.hasAttribute("data-ui-bind-value") ? this.options.valueReaders.readBound(t) : null;
			typeof e == "string" && (this.pressedText.set(t, {
				text: e,
				press: n
			}), r.push(t));
		}
		return {
			values: t,
			close: () => {
				for (let e of r) this.pressedText.get(e)?.press === n && this.pressedText.delete(e);
			}
		};
	}
	async submitFormAsync(e, t, n) {
		let r = [];
		for (let i of [...this.bufferedElements]) {
			if (i.getAttribute("data-ui-form-id") !== e) continue;
			let a = t === void 0 || n?.(i) === !0;
			if (t !== void 0 && !a && !t.has(i)) continue;
			let o = t === void 0 || a ? this.options.valueReaders.readBound(i) : t.get(i);
			if ((a || !i.isConnected || fm(o, this.options.valueReaders.readBound(i))) && this.bufferedElements.delete(i), !i.isConnected) continue;
			let s = xm(i, this.options.metadata);
			s !== null && r.push(this.syncValueAsync(i, s.bindingId, o));
		}
		await Promise.all(r);
	}
	async syncValueAsync(e, t, n = this.options.valueReaders.readBound(e)) {
		let r = this.options.metadata.getBindingById(Number(t)), i = r === void 0 ? void 0 : this.options.metadata.getPropertyDefinition(r.propertyId)?.propertyName;
		if (r === void 0 || i === void 0) {
			s("value binding engine: binding metadata not found.", { bindingIdText: t });
			return;
		}
		let a = this.options.dom.resolveNearestComponent(e, () => !0);
		if (a === null) return;
		let o = this.dispatchAndApplyAsync(e, i, a, r, n);
		this.pendingSyncByComponent.set(a.element, o);
		try {
			await o;
		} finally {
			this.pendingSyncByComponent.get(a.element) === o && this.pendingSyncByComponent.delete(a.element);
		}
	}
	async dispatchAndApplyAsync(e, t, n, r, i) {
		let a = this.holdUnanswered(e), o = () => this.releaseUnanswered(e, a);
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
		if (i === void 0 || !ym(i.mode) || bm(i.mode)) return;
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
function Cm(e, t) {
	let n = document.activeElement === e && typeof e.selectionEnd == "number" ? e.value.length - e.selectionEnd : null;
	if (e.value = t, n !== null) {
		let r = Math.max(0, t.length - n);
		e.setSelectionRange(r, r);
	}
}
function wm(e) {
	return e.matches(":disabled") || (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.readOnly;
}
//#endregion
//#region src/events/event-boundary.ts
function Tm(e, t) {
	let n = e.closest(`[${$e}]`);
	return n !== null && n !== t && t.contains(n);
}
//#endregion
//#region src/events/command-turns.ts
var Em = class {
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
}, Dm = class {
	catalog;
	registrations = /* @__PURE__ */ new Map();
	attachments = /* @__PURE__ */ new Map();
	constructor(e) {
		this.catalog = e;
	}
	add(e, t = {}) {
		let n = ka(e);
		if (n.length === 0) throw Error("Event name is required.");
		let r = ka(t.domEventName) || this.catalog.get(n)?.domEventName || n, i = {
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
		return this.registrations.get(ka(e));
	}
	isAttached(e) {
		return this.attachments.has(ka(e));
	}
	attach(e) {
		let t = {};
		return this.attachments.set(ka(e), t), t;
	}
	isCurrent(e, t) {
		return this.attachments.get(e) === t;
	}
}, Om = class {
	create(e, t) {
		return e.createRequest === void 0 ? t.metadata === void 0 ? null : {
			eventId: T(t.metadata.eventId),
			dynamicParameters: [...t.dynamicParameters]
		} : e.createRequest(t);
	}
}, km = "aria-busy";
function Am(e, t) {
	let n = null, r = !1, i = !1, a = () => {
		n = null, !(!e.isConnected || e.classList.contains("ui-loading") || e.hasAttribute("data-ui-pending")) && (e.setAttribute(ni, ""), r = !0, e.hasAttribute(km) || (e.setAttribute(km, "true"), i = !0));
	};
	return t <= 0 ? a() : n = setTimeout(a, t), () => {
		n !== null && (clearTimeout(n), n = null), r && (r = !1, e.removeAttribute(ni), i && !e.classList.contains("ui-loading") && e.removeAttribute(km));
	};
}
//#endregion
//#region src/events/event-pipeline.ts
var jm = {
	dispatched: !1,
	success: !1
}, Mm = () => void 0, Nm = class extends Error {
	reason;
	constructor(e) {
		super(String(e)), this.reason = e;
	}
}, Pm = class {
	options;
	root;
	registry;
	requestFactory = new Om();
	turns = new Em();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.registry = new Dm(e.eventCatalog), this.addEvent("click");
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
		if (r === null || Im(t, r.element) || Tm(t.target, r.element)) return;
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
			let t = e instanceof Nm, r = t ? e.reason : e;
			throw n.completed?.({
				...a,
				dispatched: t,
				success: !1,
				error: String(r)
			}), r;
		}
	}
	async runAsync(e, t, n, r) {
		if (r.domEvent.target instanceof Element && k(r.domEvent.target)) return jm;
		this.applyDomPolicy(t, r);
		let i = this.options.interactionEngine.takesRowEvent(e, r.componentId, r.dynamicParameters) ? null : this.requestFactory.create(t, r);
		if (i === null) return this.options.interactionEngine.applyEvent({
			name: e,
			componentId: r.componentId,
			dynamicParameters: r.dynamicParameters,
			domEvent: r.domEvent
		}), {
			dispatched: !1,
			success: !0
		};
		if (this.options.dispatcher.isPending(i)) return r.domEvent.preventDefault(), jm;
		let a = this.startPendingMark(e, n, r), o = n.getAttribute("data-ui-submit-form-id") ?? (t.submitsForm === !0 ? Rm(r) : null), s = null;
		try {
			if (s = o === null ? null : await this.waitForUploadsAsync(o, n, r), s === void 0) return jm;
			let a = this.turns.take();
			try {
				return await this.sendInTurnAsync(e, t, n, r, i, s, a);
			} finally {
				a.done();
			}
		} finally {
			s?.pressed?.close(), a();
		}
	}
	startPendingMark(e, t, n) {
		return e !== "click" || n.metadata?.showsPending === !1 ? Mm : Am(t, this.options.isReattaching?.() === !0 ? 0 : 300);
	}
	async waitForUploadsAsync(e, t, n) {
		let r = this.options.valueBinding?.pressForm(e), i = await this.options.uploads?.whenUploadedAsync(e) ?? /* @__PURE__ */ new Set();
		if (i.size === 0) return r?.close(), {
			formId: e,
			waited: i
		};
		let a = n.domEvent.target;
		if (!t.isConnected || a instanceof Element && (!a.isConnected || k(a))) r?.close();
		else return {
			formId: e,
			pressed: r,
			waited: i
		};
	}
	async sendInTurnAsync(e, t, n, r, i, a, o) {
		if (a !== null) {
			if (this.options.validationEngine?.runSubmitValidation(a.formId) === !1) return r.domEvent.preventDefault(), this.options.validationEngine.focusFirstInvalid(a.formId), jm;
			await this.options.valueBinding?.submitFormAsync(a.formId, a.pressed?.values, (e) => Lm(a.waited, e));
		}
		if (await this.isRefusedValueEventAsync(t, n) || (await o.ahead, await this.options.valueBinding?.whenSent(), this.options.dispatcher.isPending(i))) return jm;
		this.options.interactionEngine.applyEvent({
			name: `before-${e}`,
			componentId: r.componentId,
			dynamicParameters: r.dynamicParameters,
			domEvent: r.domEvent
		});
		let s = this.options.dispatcher.dispatchAsync(i);
		o.done();
		let c = await s.catch((t) => {
			throw this.applyAfterEvent(e, r), new Nm(t);
		});
		return this.options.effects.applyAll(c.command?.effects, this.options.dom), this.options.afterEffects?.(), this.applyAfterEvent(e, r), a !== null && this.options.validationEngine?.focusFirstInvalid(a.formId), {
			dispatched: !0,
			success: c.command?.success !== !1,
			error: c.command?.error ?? null
		};
	}
	async isRefusedValueEventAsync(e, t) {
		return !vm.includes(e.name) && e.settlesValue !== !0 ? !1 : (await this.options.valueBinding?.whenSettled(t), this.options.validationEngine?.isRefused(t) === !0);
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
		Fm(e.preventDefault, t) && t.domEvent.preventDefault(), Fm(e.stopPropagation, t) && t.domEvent.stopPropagation();
	}
};
function Fm(e, t) {
	return e === void 0 ? !1 : typeof e == "function" ? e(t) : e;
}
function Im(e, t) {
	if (e.type !== "mouseenter" && e.type !== "mouseleave") return !1;
	let n = e.relatedTarget;
	return n instanceof Node && t.contains(n);
}
function Lm(e, t) {
	for (let n of e) if (n.contains(t)) return !0;
	return !1;
}
function Rm(e) {
	let t = e.domEvent.target;
	return ((t instanceof Element ? t.closest("[data-ui-form-id]") : null) ?? e.component.querySelector("[data-ui-form-id]"))?.getAttribute("data-ui-form-id") ?? null;
}
//#endregion
//#region src/interactions/focus-handoff.ts
function zm() {
	let e = document.activeElement;
	return e === null || e === document.body ? null : e;
}
function Bm(e) {
	let t = document.activeElement;
	if (!e.isConnected || t !== e && t !== document.body) return null;
	if (Vm(e)) return Hm(e, () => Bm(e)), null;
	let n = e;
	for (; n.parentElement !== null && !Vm(n.parentElement);) n = n.parentElement;
	let r = Gm(n) ?? Km(n) ?? qm();
	return r !== null && z(r), r;
}
function Vm(e) {
	return e.checkVisibility({ visibilityProperty: !0 });
}
function Hm(e, t) {
	if (typeof document.getAnimations != "function") return;
	let n = document.getAnimations().filter((t) => Um(t) && Wm(t)?.contains(e) === !0);
	n.length > 0 && Promise.all(n.map((e) => e.finished)).then(t, () => void 0);
}
function Um(e) {
	return e.transitionProperty === "visibility";
}
function Wm(e) {
	return e.effect?.target ?? null;
}
function Gm(e) {
	let t = (e.closest(".ui-key-value-action__value-input, .ui-key-value-action__edit-action")?.closest(".ui-key-value-action__row") ?? null)?.querySelector(".ui-key-value-action__action")?.querySelector(yp) ?? null;
	return t !== null && Vm(t) ? t : null;
}
function Km(e) {
	let t = Kp(e.closest(Qp) ?? document, null).filter((t) => !e.contains(t)), n = t.find((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0), r = t.filter((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_PRECEDING) !== 0);
	return n ?? r[r.length - 1] ?? null;
}
function qm() {
	let e = document.querySelector(`[${Fn}="content"]`);
	return e === null ? null : (lm(e), e);
}
//#endregion
//#region src/interactions/interaction-engine.ts
var Jm = class {
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
		for (let e of _m) i.addEventListener(e, (e) => this.applyEditedValue(e), !0);
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
		for (let n of t) Xm(n, e.dynamicParameters) && this.applyInteraction(n, e.dynamicParameters, !0);
	}
	takesRowEvent(e, t, n) {
		for (let r of this.index.getEventInteractions(t, e)) if (Ym(r) && Xm(r, n)) return !0;
		return !1;
	}
	applyEditedValue(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.resolveEdited(e.target);
		if (t === null) return;
		let n = this.options.valueReaders.readBound(e.target), r = $m(t.interactions[0].source, t.dynamicParameters);
		if (!(this.heard.has(r) && fm(this.heard.get(r), n))) {
			this.heard.set(r, n);
			for (let e of t.interactions) this.applyInteraction(e, t.dynamicParameters, !0, n);
		}
	}
	resolveEdited(e) {
		let t = this.options.dom.resolveNearestComponent(e, () => !0);
		if (t === null) return null;
		let n = xm(e, this.options.metadata), r;
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
			for (let e of t.interactions) da(e.actionKind) === "CopyValue" && eh(e.target) && this.writeTarget(e.target, t.dynamicParameters, Zm(e, n), !0);
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
		let t = this.index.getPropertyInteractions(T(e.reference.componentId), e.reference.propertyId), n = t.length > 0 ? $m(e.reference, e.dynamicParameters) : null;
		n !== null && this.heard.has(n) && this.heard.set(n, e.value);
		for (let n of t) this.applyInteraction(n, e.dynamicParameters, !1, e.value);
	}
	applyInteraction(e, t, n, r = !0) {
		let i = da(e.actionKind);
		if (i === "Effect") {
			this.applyEffectInteraction(e, t, r);
			return;
		}
		let a = e.target;
		if (!eh(a)) return;
		let o = i === "CopyValue" ? Zm(e, r) : this.evaluator.evaluate(e, r);
		this.writeTarget(a, t, o, n), n && this.options.writeBack?.(a, t, o);
	}
	writeTarget(e, t, n, r) {
		let i = zm();
		this.applyDepth++;
		try {
			this.propertyPatchEngine.applyPropertyValue(e, t, n, r);
		} finally {
			this.applyDepth--;
		}
		i !== null && Bm(i);
	}
	applyEffectInteraction(e, t, n) {
		let r = e.effect;
		r == null ? s("effect interaction carries no effect.", e) : this.evaluator.matches(e, n) && this.options.effects.apply({
			effect: Qm(r, t, this.options.dom),
			dom: this.options.dom,
			row: t
		});
	}
};
function Ym(e) {
	return e.sourceEvent?.rowKey != null;
}
function Xm(e, t) {
	let n = e.sourceEvent?.rowKey;
	if (n == null) return !0;
	let r = t.length === 0 ? void 0 : t[t.length - 1];
	return r != null && String(r) === n;
}
function Zm(e, t) {
	return (t == null || typeof t == "string" && t.trim().length === 0) && e.falseValue !== void 0 ? e.falseValue : t;
}
function Qm(e, t, n) {
	if (t.length === 0) return e;
	let r = e.target;
	if (r === void 0 || (r.dynamicParameters?.length ?? 0) > 0) return e;
	let i = T(r.id);
	for (let a = t.length; a >= 0; a--) {
		let o = t.slice(0, a), s = n.findComponent(i, o);
		if (s !== null && La(s, o)) return a === 0 ? e : {
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
function $m(e, t) {
	return JSON.stringify([T(e?.componentId), e?.propertyId ?? ""]) + ya(t);
}
function eh(e) {
	return e != null && e.propertyId.length > 0;
}
//#endregion
//#region src/interactions/interaction-evaluator.ts
var th = class {
	evaluate(e, t) {
		return this.matches(e, t) ? e.trueValue : e.falseValue;
	}
	matches(e, t) {
		return nh(t, e.operator, e.value);
	}
};
function nh(e, t, n) {
	let r = rh(e), i = rh(n);
	switch (fa(t)) {
		case "Required": return r != null && r !== !1 && String(r).trim().length > 0;
		case "Equal": return String(r ?? "") === String(i ?? "");
		case "NotEqual": return String(r ?? "") !== String(i ?? "");
		case "Greater": return ih(r, i, (e) => e > 0);
		case "GreaterOrEqual": return ih(r, i, (e) => e >= 0);
		case "Less": return ih(r, i, (e) => e < 0);
		case "LessOrEqual": return ih(r, i, (e) => e <= 0);
		case "Like": return String(r ?? "").includes(String(i ?? ""));
		case "LikeIgnoreCase": return String(r ?? "").toLocaleLowerCase().includes(String(i ?? "").toLocaleLowerCase());
		case "In": return Array.isArray(i) && i.some((e) => String(e ?? "") === String(r ?? ""));
		case "Regex": return oh(r, i);
		case "RegexEach": return ah(r, i);
		default: return !1;
	}
}
function rh(e) {
	return D(e) ? e.key : Oc(e) ? e.text : e;
}
function ih(e, t, n) {
	let r = Number(e), i = Number(t);
	return !Number.isNaN(r) && !Number.isNaN(i) ? n(r < i ? -1 : +(r > i)) : !Number.isNaN(r) || !Number.isNaN(i) || typeof e != "string" || typeof t != "string" ? !1 : n(e < t ? -1 : +(e > t));
}
function ah(e, t) {
	return e == null ? !0 : Array.isArray(e) ? e.every((e) => oh(rh(e), t)) : oh(e, t);
}
function oh(e, t) {
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
var sh = "Value", ch = "EndValue", lh = "Pressed", uh = class {
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
		return this.eventNames.has(ka(e));
	}
	getSourceEventNames() {
		let e = /* @__PURE__ */ new Set();
		for (let t of this.eventNames) ph(t) || e.add(t);
		return e;
	}
	hasEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(ka(e))?.has(t) === !0;
	}
	getEventInteractions(e, t) {
		return this.eventInteractions.get(mh(e, t)) ?? [];
	}
	getPropertyInteractions(e, t) {
		return this.propertyInteractions.get(hh(e, t)) ?? [];
	}
	getValueInteractions(e) {
		return this.valueInteractions.get(e) ?? [];
	}
	getEndValueInteractions(e) {
		return this.endValueInteractions.get(e) ?? [];
	}
	addInteraction(e) {
		if (dh(e)) {
			let t = T(e.sourceEvent?.componentId), n = ka(e.sourceEvent?.eventName);
			if (t > 0 && n.length > 0) {
				let r = this.eventInteractions.get(mh(t, n));
				r === void 0 && (r = [], this.eventInteractions.set(mh(t, n), r)), r.push(e), this.eventNames.add(n);
				let i = this.eventComponentIdsByName.get(n);
				i === void 0 && (i = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(n, i)), i.add(t);
			}
		} else if (fh(e)) {
			let t = T(e.source?.componentId), n = e.source?.propertyId ?? "";
			if (t > 0 && n.length > 0) {
				let r = this.propertyInteractions.get(hh(t, n));
				r === void 0 && (r = [], this.propertyInteractions.set(hh(t, n), r)), r.push(e), da(e.actionKind) === "CopyValue" && (this.copiesValues = !0);
				let i = this.metadata.getPropertyDefinition(n)?.propertyName, a = i === sh || i === lh ? this.valueInteractions : i === ch ? this.endValueInteractions : null;
				if (a !== null) {
					let n = a.get(t) ?? [];
					n.push(e), a.set(t, n);
				}
			}
		}
	}
};
function dh(e) {
	return ua(e.sourceKind) === "Event";
}
function fh(e) {
	return ua(e.sourceKind) === "Property";
}
function ph(e) {
	return e.startsWith("before-") || e.startsWith("after-");
}
function mh(e, t) {
	return `${e}:${ka(t)}`;
}
function hh(e, t) {
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
function gh() {
	return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function _h(e) {
	if (typeof e.getAnimations == "function") for (let t of e.getAnimations()) typeof CSSTransition == "function" && t instanceof CSSTransition && t.finish();
}
function vh(e, t, n) {
	let r = !1, i = () => {
		r || (r = !0, clearTimeout(a), n());
	}, a = setTimeout(i, t), o = typeof e.getAnimations == "function" ? e.getAnimations().filter((e) => typeof CSSTransition != "function" || e instanceof CSSTransition) : [];
	Promise.allSettled(o.map((e) => e.finished)).then(i);
}
//#endregion
//#region src/rendering/responsive-tier.ts
var yh = [
	"base",
	"sm",
	"md",
	"xl",
	"xxl"
], bh = yh.filter((e) => e !== "base"), xh = {
	sm: 640,
	md: 768,
	xl: 1280,
	xxl: 1536
};
function Sh(e) {
	return `(min-width: ${xh[e]}px)`;
}
var Ch = Sh("sm"), wh = /* @__PURE__ */ new Map();
function Th(e, t = bh) {
	if (typeof matchMedia == "function") for (let n of t) {
		let t = wh.get(n);
		t === void 0 && (t = matchMedia(Sh(n)), wh.set(n, t)), t.addEventListener("change", () => e());
	}
}
function Eh(e = (e) => matchMedia(e).matches) {
	for (let t of [...bh].reverse()) if (e(Sh(t))) return t;
	return "base";
}
function Dh(e, t) {
	return t === "base" ? e : `${e}-${t}`;
}
function Oh(e, t) {
	if (e == null) return;
	let n = typeof e == "object" ? e : void 0;
	return n === void 0 || !("base" in n) ? t === "base" ? e : void 0 : n[t];
}
function kh(e, t) {
	return Ah(t, (t) => Oh(e, t));
}
function Ah(e, t) {
	for (let n = yh.indexOf(e); n >= 0; n--) {
		let e = t(yh[n]);
		if (e != null) return e;
	}
}
//#endregion
//#region src/interactions/anchored-popup.ts
var jh = /* @__PURE__ */ new Set([
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
function Mh(e) {
	return jh.has(e);
}
var Nh = 4, Ph = 12, Fh = /* @__PURE__ */ new Map(), Ih = !1, Lh = null, Rh = /* @__PURE__ */ new WeakMap(), zh = "data-ui-popup-stood-in";
function Bh(e, t) {
	t === null ? Rh.delete(e) : Rh.set(e, t);
}
var Vh = "--ui-popup-ground";
function Hh(e, t) {
	let n = e.closest("[data-ui-theme]") === t.closest("[data-ui-theme]") ? getComputedStyle(e).getPropertyValue(Vh).trim() : "";
	n.length === 0 ? t.style.removeProperty(Vh) : t.style.setProperty(Vh, n);
}
function Uh(e, t, n) {
	Fh.set(t, {
		anchor: e,
		options: n
	}), ng(), Lh?.observe(t), Yh(e, t), ig(e, t, n);
}
var Wh = "data-ui-popup-lifted", Gh = "data-ui-sheet";
function Kh() {
	return typeof matchMedia == "function" && !matchMedia(Ch).matches;
}
function qh(e) {
	return e.hasAttribute(Gh);
}
function Jh(e) {
	e.hasAttribute(Wh) ? e.matches(":popover-open") || e.showPopover() : (e.setAttribute("popover", "manual"), e.setAttribute(Wh, ""), Xh(e));
}
function Yh(e, t) {
	(t.hasAttribute(Wh) || Zh(t) || e.closest(`[${Wh}]`) !== null) && Jh(t);
}
function Xh(e) {
	let t = getComputedStyle(e), n = t.transitionProperty.split(",").map((e) => e.trim()), r = n.indexOf("overlay");
	if (r === -1) {
		e.showPopover();
		return;
	}
	let i = t.transitionDuration.split(",").map((e) => e.trim());
	e.style.setProperty("transition-duration", n.map((e, t) => t === r ? "0s" : i[t % i.length]).join(", ")), e.showPopover(), getComputedStyle(e).getPropertyValue("overlay"), e.style.removeProperty("transition-duration");
}
function Zh(e) {
	for (let t = e.parentElement; t !== null; t = t.parentElement) {
		let e = getComputedStyle(t);
		if (e.transform !== "none" || e.filter !== "none" || e.perspective !== "none" || t.hasAttribute("data-ui-surface-image-blur") && e.isolation === "isolate") return !0;
	}
	return !1;
}
var Qh = B.normal * 5;
function $h(e, t) {
	e.hasAttribute(Wh) && (e.matches(":popover-open") && e.hidePopover(), vh(e, Qh, () => {
		e.matches(":popover-open") || Fh.has(e) || (e.removeAttribute("popover"), e.removeAttribute(Wh), t?.());
	}));
}
function eg(e) {
	let t = Fh.get(e);
	t !== void 0 && ig(t.anchor, e, t.options);
}
function tg(e) {
	e != null && (Fh.delete(e), Lh?.unobserve(e), $h(e));
}
function ng() {
	Ih || (Ih = !0, document.addEventListener("scroll", (e) => rg(e.target), !0), window.addEventListener("resize", () => rg(null)), window.visualViewport?.addEventListener("resize", () => rg(null)), window.visualViewport?.addEventListener("scroll", () => rg(null)), Lh = new ResizeObserver((e) => {
		for (let t of e) {
			if (!(t.target instanceof HTMLElement)) continue;
			let e = Fh.get(t.target);
			e !== void 0 && ig(e.anchor, t.target, e.options, !0);
		}
	}));
}
function rg(e) {
	for (let [t, n] of Fh) t.isConnected ? e instanceof Node && t.contains(e) || ig(n.anchor, t, n.options) : tg(t);
}
function ig(e, t, n, r = !1) {
	if (!e.isConnected) return;
	let i = cg(e), a = i !== e;
	t.hasAttribute(zh) !== a && t.toggleAttribute(zh, a), n.minAnchorWidth === !0 && (t.style.minWidth = `${i.getBoundingClientRect().width}px`);
	let o = t.hasAttribute(ag) ? {
		top: t.scrollTop,
		left: t.scrollLeft
	} : null;
	sg(t);
	let s = i.getBoundingClientRect(), c = (i === e ? n.crossAnchor ?? i : i).getBoundingClientRect(), l = i === e && n.surface !== void 0 ? n.surface.getBoundingClientRect() : s, u = n.gap ?? 4, d = t.getBoundingClientRect(), f = dg(n.boundary), p = Fh.get(t), m = r ? p?.side : void 0, h = m !== void 0 && pg(l, d, m, u, f) ? m : fg(l, d, n.placement, u, f);
	p !== void 0 && (p.side = h), pg(l, d, h, u, f) || (og(t, h, _g(l, h, f) - u - Nh), d = t.getBoundingClientRect(), o !== null && (t.scrollTop = o.top, t.scrollLeft = o.left));
	let g = n.alignEntries === !0 ? xg(t, h) : bg, _ = Cg(l, c, d, h, u, g), v = wg(l, c, d, h, u, g);
	n.arrow === !0 && (gg(h) ? v = lg(v, c.left + c.width / 2, d.width) : _ = lg(_, c.top + c.height / 2, d.height));
	let ee = Eg();
	_ = ee.top + Ag(_ - ee.top, d.height, ee.bottom - ee.top), v = Ag(v, d.width, window.innerWidth), t.style.top = `${_}px`, t.style.left = `${v}px`, t.dataset.uiPlacement !== h && (t.dataset.uiPlacement = h), ug(t, c, d, h, _, v);
}
var ag = "data-ui-popup-capped";
function og(e, t, n) {
	let r = gg(t);
	e.setAttribute(ag, ""), e.style.setProperty(r ? "max-height" : "max-width", `${Math.max(0, n)}px`), e.style.setProperty(r ? "overflow-y" : "overflow-x", "auto");
}
function sg(e) {
	if (e.hasAttribute(ag)) {
		e.removeAttribute(ag);
		for (let t of [
			"max-height",
			"max-width",
			"overflow-y",
			"overflow-x"
		]) e.style.removeProperty(t);
	}
}
function cg(e) {
	for (let t = e; t !== null; t = t.parentElement) {
		if (t.hasAttribute(zh)) return e;
		let n = Rh.get(t);
		if (n !== void 0) return n;
	}
	return e;
}
function lg(e, t, n) {
	let r = t - e;
	return r < Ph ? e - (Ph - r) : r > n - Ph ? e + (r - (n - Ph)) : e;
}
function ug(e, t, n, r, i, a) {
	let o = gg(r), s = o ? t.left + t.width / 2 - a : t.top + t.height / 2 - i, c = o ? n.width : n.height;
	e.style.setProperty("--ui-popup-arrow", `${Math.max(Ph, Math.min(s, c - Ph))}px`);
}
function dg(e) {
	let t = Eg(), n = {
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
function fg(e, t, n, r, i) {
	let a = vg(n);
	if (pg(e, t, n, r, i)) return n;
	if (pg(e, t, a, r, i)) return a;
	for (let a of mg(n)) if (pg(e, t, a, r, i)) return a;
	return _g(e, a, i) > _g(e, n, i) ? a : n;
}
function pg(e, t, n, r, i) {
	return _g(e, n, i) >= hg(t, n) + r;
}
function mg(e) {
	return e.startsWith("bottom") ? ["right-start", "left-start"] : e.startsWith("top") ? ["right-end", "left-end"] : e.startsWith("right") ? ["bottom-start", "top-start"] : ["bottom-end", "top-end"];
}
function hg(e, t) {
	return gg(t) ? e.height : e.width;
}
function gg(e) {
	return e.startsWith("top") || e.startsWith("bottom");
}
function _g(e, t, n) {
	return t.startsWith("top") ? e.top - n.top : t.startsWith("bottom") ? n.bottom - e.bottom : t.startsWith("left") ? e.left - n.left : n.right - e.right;
}
function vg(e) {
	return e.startsWith("top") ? `bottom${yg(e)}` : e.startsWith("bottom") ? `top${yg(e)}` : e.startsWith("left") ? `right${yg(e)}` : `left${yg(e)}`;
}
function yg(e) {
	let t = e.indexOf("-");
	return t === -1 ? "" : e.slice(t);
}
var bg = {
	start: 0,
	end: 0
};
function xg(e, t) {
	let n = getComputedStyle(e);
	return gg(t) ? {
		start: Sg(n.paddingLeft) + Sg(n.borderLeftWidth),
		end: Sg(n.paddingRight) + Sg(n.borderRightWidth)
	} : {
		start: Sg(n.paddingTop) + Sg(n.borderTopWidth),
		end: Sg(n.paddingBottom) + Sg(n.borderBottomWidth)
	};
}
function Sg(e) {
	let t = Number.parseFloat(e ?? "");
	return Number.isFinite(t) ? t : 0;
}
function Cg(e, t, n, r, i, a) {
	return r.startsWith("top") ? e.top - i - n.height : r.startsWith("bottom") ? e.bottom + i : Tg(t.top, t.height, n.height, r, a);
}
function wg(e, t, n, r, i, a) {
	return r.startsWith("left") ? e.left - i - n.width : r.startsWith("right") ? e.right + i : Tg(t.left, t.width, n.width, r, a);
}
function Tg(e, t, n, r, i) {
	let a = yg(r);
	return a === "-start" ? e - i.start : a === "-end" ? e + t - n + i.end : e + (t - n) / 2;
}
function Eg() {
	let e = window.visualViewport, t = e == null || Math.abs(e.scale - 1) > .01, n = t ? 0 : Math.max(0, e.offsetTop), r = t ? window.innerHeight : Math.min(window.innerHeight, e.offsetTop + e.height);
	return {
		top: n,
		bottom: Math.min(r, Dg(r))
	};
}
function Dg(e) {
	let t = document.querySelector(`[${An}]`);
	if (t === null) return e;
	let n = t.getBoundingClientRect();
	return n.height > 0 && n.width >= window.innerWidth - 1 && n.top > 0 ? n.top : e;
}
function Og(e, t, n) {
	if (qh(e)) return;
	let r = e.getBoundingClientRect(), i = Eg();
	e.style.left = `${kg(t, r.width, 0, window.innerWidth)}px`, e.style.top = `${kg(n, r.height, i.top, i.bottom)}px`;
}
function kg(e, t, n, r) {
	return e + t <= r - Nh ? e : e - t >= n + Nh ? e - t : n + Ag(e - n, t, r - n);
}
function Ag(e, t, n) {
	return Math.max(Nh, Math.min(e, n - t - Nh));
}
//#endregion
//#region src/interactions/press-wave.ts
var jg = "ui-press-wave", Mg = "ui-press-wave__ink";
function Ng(e) {
	if (e.type !== "childList" || e.addedNodes.length + e.removedNodes.length === 0) return !1;
	for (let t of e.addedNodes) if (!Pg(t)) return !1;
	for (let t of e.removedNodes) if (!Pg(t)) return !1;
	return !0;
}
function Pg(e) {
	return e instanceof Element && e.classList.contains("ui-press-wave");
}
function Fg(e) {
	return e.length > 0 && e.every(Ng);
}
function Ig(e) {
	for (let t of e.querySelectorAll(`.${jg}`)) t.remove();
}
//#endregion
//#region src/interactions/dom-mutations.ts
var Lg = 32;
function V(e, t, n, r) {
	if (!(e instanceof Node)) return null;
	let i = new MutationObserver((i) => {
		let a = Rg(e, i.filter((e) => !Ng(e) && (n.relevant?.(e) ?? !0)), t, n.addedOnly ?? !1);
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
function Rg(e, t, n, r = !1) {
	let i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set();
	for (let o of t) {
		let t = o.target instanceof Element ? o.target : o.target.parentElement;
		if (t === null) continue;
		if (r && o.type === "childList" && t.closest(n) === null) {
			zg(o.addedNodes, n, i);
			continue;
		}
		if (a.has(t)) continue;
		a.add(t);
		let s = t.closest(n);
		if (s !== null) i.add(s);
		else {
			for (let e of t.querySelectorAll(n)) i.add(e);
			if (i.size > Lg) return new Set(e.querySelectorAll(n));
		}
	}
	return i.size === 0 ? null : i;
}
function zg(e, t, n) {
	for (let r of e) if (r instanceof Element && r.isConnected) {
		r instanceof HTMLElement && r.matches(t) && n.add(r);
		for (let e of r.querySelectorAll(t)) n.add(e);
	}
}
function Bg(e, t, n) {
	return (e.target instanceof Element ? e.target : e.target.parentElement)?.closest(`${t}, ${n}`)?.matches(t) === !0;
}
//#endregion
//#region src/interactions/element-visibility.ts
var Vg = [
	"hidden",
	"class",
	dn,
	...bi
];
function Hg(e, t, n) {
	for (let r = t; r !== null; r = r.parentElement) e.observe(r, {
		attributes: !0,
		attributeFilter: n
	});
}
function Ug(e, t) {
	let n = /* @__PURE__ */ new Set();
	for (let r of e) if (r.type === "childList") for (let e of r.addedNodes) for (let r of t) e.contains(r) && n.add(r);
	return n;
}
function Wg(e, t) {
	let n = getComputedStyle(e), r = t ? n.overflowY : n.overflowX;
	return r === "auto" || r === "scroll";
}
function Gg(e) {
	return getComputedStyle(e).display !== "none";
}
function Kg(e) {
	for (let t = e; t !== null; t = t.parentElement) {
		if (t.checkVisibility()) return !0;
		if (getComputedStyle(t).display !== "contents") return !1;
	}
	return !1;
}
function qg(e) {
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
				if (e.overflowX !== "visible" && Xg(n, i, i + t.clientWidth, !0), e.overflowY !== "visible" && Xg(n, a, a + t.clientHeight, !1), Zg(n)) return !0;
			}
			r = e.position;
		}
	}
	return Xg(n, 0, window.innerWidth, !0), Xg(n, 0, window.innerHeight, !1), Zg(n);
}
function Jg(e) {
	let t = getComputedStyle(e).position;
	for (let n = e.parentElement; n !== null && t !== "fixed"; n = n.parentElement) {
		let e = getComputedStyle(n);
		if (t !== "absolute" || e.position !== "static" || e.transform !== "none") {
			if ((!n.classList.contains("ui-scroll-y--disabled") || Wg(n, !1)) && (Yg(e.overflowX) || Yg(e.overflowY))) return n;
			t = e.position;
		}
	}
	return null;
}
function Yg(e) {
	return e === "hidden" || e === "auto" || e === "scroll";
}
function Xg(e, t, n, r) {
	r ? (e.left = Math.max(e.left, t), e.right = Math.min(e.right, n)) : (e.top = Math.max(e.top, t), e.bottom = Math.min(e.bottom, n));
}
function Zg(e) {
	return e.left > e.right || e.top > e.bottom;
}
//#endregion
//#region src/interactions/open-dialogs.ts
var Qg = "data-ui-dialog", $g = "data-ui-dialog-modal", e_ = "data-ui-dialog-backdrop", t_ = "data-ui-dialog-close-backdrop", n_ = "data-ui-dialog-close-escape", r_ = `[${Qg}]:not([hidden]), dialog[open]`, i_ = "dialog:modal";
function a_(e) {
	let t = e.querySelectorAll(`[${Qg}]:not([hidden])`);
	return t.length === 0 ? null : t[t.length - 1];
}
function o_(e) {
	let t = e.querySelectorAll(i_);
	if (t.length > 0) return t[t.length - 1];
	let n = a_(e);
	return n !== null && n.hasAttribute("data-ui-dialog-modal") ? n : null;
}
function s_(e) {
	let t = typeof document > "u" ? null : o_(document);
	return t !== null && !t.contains(e);
}
//#endregion
//#region src/interactions/popup-dismissal.ts
var c_ = /* @__PURE__ */ new Set(), l_ = null;
function u_(e) {
	l_ = e;
}
function d_(e) {
	let t = e.composedPath(), n = l_?.(t) ?? null;
	if (n === null) return t;
	let r = [...t];
	for (let e = n; e !== null; e = e.parentElement) r.push(e);
	return r;
}
var f_ = /* @__PURE__ */ new Map(), p_ = 0, m_ = !1;
function h_() {
	m_ || (m_ = !0, document.addEventListener("keydown", (e) => {
		!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || M(e) || b_(qu(e.target)) && e.preventDefault();
	}, !0));
}
var g_ = [];
function __(e) {
	g_.push(e);
}
function v_(e = null) {
	for (let e of c_) for (let t of e.openPopups()) if (t.isConnected && !e.isBehind(t)) return !0;
	return g_.some((t) => t(e));
}
function y_(e) {
	for (let t of c_) t.hearRefusedClick(e);
}
function b_(e) {
	let t = [];
	for (let e of c_) for (let n of e.openPopups()) n.isConnected && t.push({
		instance: e,
		popup: n
	});
	let n = new Set(t.map((e) => e.popup));
	for (let e of [...f_.keys()]) n.has(e) || f_.delete(e);
	for (let { popup: e } of t) f_.has(e) || f_.set(e, ++p_);
	let r = x_(t, (e) => f_.get(e.popup) ?? 0, (e, t) => e.popup.contains(t.popup));
	for (let { instance: t, popup: n } of r) if ((e === null || e.contains(n)) && t.dismiss(n, "escape")) return !0;
	return !1;
}
function x_(e, t, n) {
	let r = [...e].sort((e, n) => t(n) - t(e)), i = [];
	for (; r.length > 0;) {
		let e = r.findIndex((e) => !r.some((t) => t !== e && n(e, t)));
		i.push(...r.splice(e, 1));
	}
	return i;
}
var S_ = class {
	options;
	pressedInside = /* @__PURE__ */ new Set();
	constructor(e) {
		this.options = e, document.addEventListener("pointerdown", (e) => this.handlePress(e), !0), document.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), e.onPress !== !0 && document.addEventListener("click", (e) => this.handleClick(e), !0), e.onWindowBlur === !0 && window.addEventListener("blur", () => this.dismissAll("blur")), c_.add(this), h_();
	}
	openPopups() {
		return [...this.options.openPopups()];
	}
	handlePress(e) {
		let t = d_(e), n = this.options.onPress === !0 || e instanceof MouseEvent && e.button !== 0;
		this.pressedInside.clear();
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) ? this.pressedInside.add(e) : n && this.dismiss(e, "outside");
	}
	handleContextMenu(e) {
		let t = d_(e);
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) || this.dismiss(e, "outside");
	}
	hearRefusedClick(e) {
		this.options.onPress !== !0 && this.handleClick(e);
	}
	handleClick(e) {
		let t = d_(e);
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) || this.pressedInside.has(e) || this.dismiss(e, "outside");
		this.pressedInside.clear();
	}
	dismissAll(e) {
		let t = !1;
		for (let n of [...this.options.openPopups()]) t = this.dismiss(n, e) || t;
		return t;
	}
	isBehind(e) {
		return this.options.isBehind === void 0 ? s_(e) : this.options.isBehind(e);
	}
	dismiss(e, t) {
		return this.isBehind(e) || this.options.canDismiss?.(e, t) === !1 ? !1 : (this.options.close(e, t), !0);
	}
	isInside(e, t) {
		return this.options.isInside === void 0 ? t.includes(e) : this.options.isInside(e, t);
	}
}, C_ = /\p{M}/gu, w_ = ".ui-text__title";
function T_(e, t) {
	return E_(e, t).split(/\s+/).filter((e) => e.length !== 0);
}
function E_(e, t) {
	return k_(e, O_(t));
}
function D_(e, t) {
	return t.every((t) => e.includes(t));
}
function O_(e) {
	return e.closest("[lang]")?.getAttribute("lang") || void 0;
}
function k_(e, t) {
	let n = e.normalize("NFD").replace(C_, "");
	try {
		return n.toLocaleLowerCase(t);
	} catch {
		return n.toLowerCase();
	}
}
function A_(e) {
	return e.querySelector(w_)?.textContent ?? e.textContent ?? "";
}
//#endregion
//#region src/interactions/pointer-drag.ts
var j_ = class {
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
		t.setAttribute(Qr, ""), t.tabIndex >= 0 && t.focus({ preventScroll: !0 });
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
			e.pointerId === t.pointerId ? t.point = n : t.second.point = n, this.options.pinch?.(t.context, M_(r, i, t.point, t.second.point));
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
		this.drag = null, n.removeAttribute(Qr), e.type === "pointercancel" && this.options.takenBack !== void 0 ? this.options.takenBack(n, r) : this.options.end(n, r);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || M(e) || this.drag === null) return;
		e.preventDefault();
		let { handle: t, context: n, pointerId: r, originPoint: i, second: a } = this.drag;
		this.drag = null, t.removeAttribute(Qr);
		for (let e of a === null ? [r] : [r, a.pointerId]) try {
			t.releasePointerCapture(e);
		} catch {}
		this.options.cancel === void 0 ? (this.options.move(n, 0, i), this.options.end(t, n)) : this.options.cancel(t, n);
	}
};
function M_(e, t, n, r) {
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
function N_() {
	let e = (e) => {
		e.preventDefault(), e.stopImmediatePropagation(), t();
	}, t = () => {
		window.removeEventListener("click", e, !0), window.removeEventListener("pointerdown", t, !0), window.removeEventListener("keydown", t, !0);
	};
	window.addEventListener("click", e, !0), window.addEventListener("pointerdown", t, !0), window.addEventListener("keydown", t, !0);
}
function P_(e, t) {
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
		N_();
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
var F_ = "data-ui-sheet-dragging", I_ = "--ui-sheet-drag", L_ = 24, R_ = 1 / 3;
function z_(e, t, n) {
	return e > t * R_ || n > .5 && e > 6;
}
function B_(e, t, n) {
	e.style.removeProperty(I_), e.removeAttribute(F_);
	let r = P_(e, {
		axis: "y",
		oneWay: !0,
		holdsTouch: !0,
		begins: (n) => t.scrollTop <= 0 && (n.pointerType === "touch" || n.clientY - e.getBoundingClientRect().top <= L_),
		start: (t) => {
			e.setAttribute(F_, ""), V_(e, t.pointerId);
		},
		follow: (t) => e.style.setProperty(I_, `${t}px`),
		end: (t, r, i) => {
			e.removeAttribute(F_), i && z_(t, e.getBoundingClientRect().height, r) ? n() : e.style.setProperty(I_, "0px");
		}
	});
	return () => {
		r(), e.removeAttribute(F_);
	};
}
function V_(e, t) {
	try {
		e.setPointerCapture(t);
	} catch {}
}
//#endregion
//#region src/interactions/popup-sheet.ts
var H_ = "data-ui-sheet-covered", U_ = "ui-sheet-scrim", W_ = "data-ui-sheet-scrim-leaving", G_ = 400, K_ = "ui-sheet__back", q_ = "ui.sheet.back", J_ = "ne-arrow-back", Y_ = [], X_ = null, Z_ = !1, Q_ = !1;
function $_(e, t) {
	if (ev(e) !== null) return;
	let n = t.anchor?.closest("[data-ui-sheet]") ?? null, r = n === null ? null : ev(n);
	e.style.removeProperty("top"), e.style.removeProperty("left"), e.style.removeProperty("min-width");
	let i = qh(e);
	e.setAttribute(Gh, r === null ? "root" : "nested"), i || (e.setAttribute("popover", "manual"), _h(e)), e.querySelector(`:scope > .${K_}`)?.remove(), r !== null && (e.style.minHeight = `${r.popup.getBoundingClientRect().height}px`, r.popup.setAttribute(H_, ""), e.prepend(tv(t))), rv(), Jh(e);
	let a = {
		popup: e,
		parent: r,
		opening: t,
		hidden: [],
		detachSwipe: B_(e, e, () => iv(e))
	};
	Y_.push(a), av(), queueMicrotask(() => sv(a));
}
function ev(e) {
	return Y_.find((t) => t.popup === e) ?? null;
}
function tv(e) {
	let t = document.createElement("button"), n = e.anchor === void 0 ? "" : A_(e.anchor).trim();
	return t.type = "button", t.className = K_, t.tabIndex = -1, t.textContent = n, t.prepend(nv()), O.write(t, "aria-label", q_, { entry: n }), t.addEventListener("click", (t) => {
		t.stopPropagation(), e.close();
	}), t;
}
function nv() {
	let e = document.createElement("span");
	return e.className = "ui-sheet__back-mark", e.setAttribute("aria-hidden", "true"), jo(e, J_), e;
}
function rv() {
	X_ === null && (X_ = document.createElement("div"), X_.className = U_, X_.setAttribute("aria-hidden", "true"), X_.addEventListener("mousedown", (e) => e.preventDefault())), X_.parentElement === null && document.body.appendChild(X_), X_.removeAttribute(W_), Jh(X_);
}
function iv(e) {
	for (let t = ev(e); t !== null; t = t.parent) t.opening.close();
}
function av() {
	Z_ || (Z_ = !0, window.addEventListener("pointerdown", () => {
		Q_ = !0;
	}, !0), window.addEventListener("pointerup", ov, !0), window.addEventListener("pointercancel", ov, !0), window.addEventListener("keydown", (e) => {
		let t = Y_.at(-1);
		e.key === "Tab" && !e.defaultPrevented && t !== void 0 && t.opening.trapsTab && e.target instanceof Node && t.popup.contains(e.target) && Yp(t.popup, e);
	}, !0));
}
function ov() {
	if (Q_ = !1, X_?.hasAttribute(W_) !== !0) return;
	let e = () => {
		X_?.hasAttribute(W_) === !0 && Y_.length === 0 && (X_.removeAttribute(W_), X_.hidePopover());
	};
	window.addEventListener("click", () => window.setTimeout(e), { once: !0 }), window.setTimeout(e, G_);
}
function sv(e) {
	if (!Y_.includes(e)) return;
	let { popup: t } = e;
	t.contains(document.activeElement) || (t.hasAttribute("tabindex") || (t.tabIndex = -1), z(t)), e.hidden = cv(t);
}
function cv(e) {
	let t = [];
	for (let n = e; n.parentElement !== null && n !== document.body; n = n.parentElement) for (let e of n.parentElement.children) e !== n && e !== X_ && e instanceof HTMLElement && e.getAttribute("aria-hidden") !== "true" && (e.setAttribute("aria-hidden", "true"), t.push(e));
	return t;
}
function lv(e) {
	let t = ev(e);
	if (t !== null) {
		for (let e of [...Y_].reverse()) if (e === t || uv(e, t)) {
			for (let t of e.hidden) t.removeAttribute("aria-hidden");
			e.hidden = [];
		}
	}
}
function uv(e, t) {
	for (let n = e.parent; n !== null; n = n.parent) if (n === t) return !0;
	return !1;
}
function dv(e) {
	let t = ev(e);
	if (t !== null) {
		for (let e of Y_.filter((e) => e.parent === t)) e.opening.close(), dv(e.popup);
		lv(e), Y_.splice(Y_.indexOf(t), 1), t.detachSwipe(), t.parent?.popup.removeAttribute(H_), Y_.length === 0 && pv(), $h(e, () => {
			ev(e) === null && fv(e);
		});
	}
}
function fv(e) {
	e.removeAttribute(Gh), e.removeAttribute(H_), e.style.removeProperty("min-height"), e.style.removeProperty("--ui-sheet-drag"), e.querySelector(`:scope > .${K_}`)?.remove();
}
function pv() {
	X_?.matches(":popover-open") === !0 && (Q_ ? X_.setAttribute(W_, "") : X_.hidePopover());
}
//#endregion
//#region src/interactions/owned-popup.ts
function mv(e, t) {
	let { owner: n } = e;
	return n.isConnected && (n === e.popup || Kg(n)) && !k(n) && !(t && j(n));
}
var hv = null;
function gv(e) {
	hv = e;
}
var _v = class {
	options;
	entries = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, new S_({
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
			isBehind: (e) => s_(this.entryOf(e)?.opening.owner ?? e),
			onPress: e.onPress,
			onWindowBlur: e.onWindowBlur
		}), (e.closesOnFocusLeave ?? !0) && document.addEventListener("focusout", (e) => this.handleFocusLeave(e), !0), e.closesOnTab !== void 0 && e.closesOnTab !== !1 && yv(this);
	}
	listsAround(e) {
		return [...this.entries.values()].filter(({ opening: t }) => t.popup.contains(e) && Ev(this.options.closesOnTab, t)).map(({ opening: e }) => ({
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
		if (!(e.target instanceof Node) || Ip() || t instanceof Element && t.hasAttribute("data-ui-pointer-focus")) return;
		if (t instanceof Element) {
			this.leaveFocus(e.target, t);
			return;
		}
		let n = e.target;
		xv(n) && queueMicrotask(() => this.letGo(n));
	}
	leaveFocus(e, t) {
		for (let { opening: n } of [...this.entries.values()]) (n.popup.contains(e) || n.owner.contains(e)) && !this.isInside(n, Tv(t)) && !s_(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
	}
	letGo(e) {
		if (!xv(e)) return;
		let t = $p(e);
		for (let { opening: n } of [...this.entries.values()]) {
			let r = n.popup.contains(e) || n.owner.contains(e), i = t !== null && n.popup.contains(t) || n.popup.contains(document.activeElement);
			r && !i && mv(n, this.closesWhenReadOnly) && !s_(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
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
	owners() {
		return this.entries.keys();
	}
	holding(e) {
		for (let { opening: t } of this.entries.values()) if (t.popup.contains(e)) return {
			owner: t.owner,
			popup: t.popup
		};
		return null;
	}
	open(e) {
		if (this.entries.get(e.owner)?.opening.popup === e.popup) return this.reposition(e.owner), !0;
		if (this.close(e.owner), !mv(e, this.closesWhenReadOnly)) return !1;
		(this.options.single ?? !0) && this.closeAll();
		let t = document.activeElement instanceof HTMLElement ? document.activeElement : null, n = Kh(), r = {
			opening: e,
			returnFocus: t,
			phone: n,
			sheet: n && Ev(this.options.sheetOnPhone, e)
		};
		return this.entries.set(e.owner, r), this.options.show(e), this.place(r), Dv(e, !0), Vv(this, e.owner), Mv(e), e.focus !== void 0 && e.focus !== !1 && tm(e.popup, e.focus === !0 ? null : e.focus), !0;
	}
	get closesWhenReadOnly() {
		return this.options.closesWhenReadOnly ?? !0;
	}
	closeAll() {
		for (let e of [...this.entries.keys()]) this.close(e);
	}
	place(e) {
		let { opening: t } = e;
		e.sheet ? $_(t.popup, {
			anchor: t.anchor,
			close: () => this.close(t.owner, "escape"),
			trapsTab: !Ev(this.options.closesOnTab, t)
		}) : (qh(t.popup) && fv(t.popup), t.anchor !== void 0 && t.placement !== void 0 && Uh(t.anchor, t.popup, t.placement));
	}
	reposition(e) {
		let t = this.entries.get(e);
		t !== void 0 && this.place(t);
	}
	close(e = this.current, t) {
		let n = e === null ? void 0 : this.entries.get(e);
		if (e === null || n === void 0) return;
		let { opening: r } = n;
		this.entries.delete(e), Nv(r.popup), lv(r.popup), r.popup.contains(document.activeElement) && um(r.returnFocus === void 0 ? n.returnFocus : r.returnFocus(), r.popup), this.options.hide(r, t), Dv(r, !1), n.sheet ? dv(r.popup) : tg(r.popup), this.entries.size === 0 && Gv(this);
	}
	closeStranded(e) {
		for (let [t, { opening: n }] of [...this.entries]) {
			if (e !== void 0 && !e.has(t) ? t.isConnected : mv(n, this.closesWhenReadOnly)) continue;
			let r = document.activeElement, i = r === null || r === document.body || n.popup.contains(r) || t.contains(r);
			this.close(t, "owner"), i && !Sv() && Cv(t);
		}
	}
	closeReformed() {
		let e = Kh();
		for (let [t, n] of [...this.entries]) n.phone !== e && (n.opening.anchor === void 0 || Ev(this.options.sheetOnPhone, n.opening)) && this.close(t, "owner");
	}
	closeOutOfSight(e) {
		for (let [t, { opening: n, sheet: r }] of [...this.entries]) {
			let i = n.anchor === void 0 ? t : cg(n.anchor);
			!r && e.some((e) => !(e instanceof Node) || !n.popup.contains(e) && (e.contains(i) || e.contains(t))) && (wv(i) || i === n.anchor && wv(t)) && !s_(t) && this.close(t, "owner");
		}
	}
}, vv = /* @__PURE__ */ new Set();
function yv(e) {
	vv.size === 0 && window.addEventListener("keydown", (e) => {
		e instanceof KeyboardEvent && e.key === "Tab" && !e.defaultPrevented && !M(e) && e.target instanceof Node && bv(e.target);
	}, !0), vv.add(e);
}
function bv(e) {
	let t = [...vv].flatMap((t) => t.listsAround(e).map((e) => ({
		popups: t,
		...e
	})));
	for (let { popups: e, owner: n } of x_(t, () => 0, (e, t) => e.popup.contains(t.popup))) e.close(n, "focus");
}
function xv(e) {
	return e instanceof Element && e.isConnected && wl(e) && typeof document.hasFocus == "function" && document.hasFocus();
}
function Sv() {
	let e = document.activeElement;
	return e instanceof Element && e !== document.body && wl(e);
}
function Cv(e) {
	if (e.isConnected && Kg(e)) {
		lm(e), z(e);
		return;
	}
	let t = om(e, hv);
	t !== null && z(t);
}
function wv(e) {
	return e.getClientRects().length > 0 && qg(e);
}
function Tv(e) {
	let t = [];
	for (let n = e; n !== null; n = n.parentNode) t.push(n);
	return t;
}
function Ev(e, t) {
	return e === !0 || typeof e == "function" && e(t);
}
function Dv(e, t) {
	for (let n of e.openers ?? []) n.setAttribute("aria-expanded", t ? "true" : "false");
}
var Ov = /* @__PURE__ */ new Map(), kv = /* @__PURE__ */ new Set(), Av = /* @__PURE__ */ new WeakSet(), jv = [];
function Mv(e) {
	let { popup: t } = e;
	Ov.set(t, e.owner), !Av.has(t) && (Av.add(t), t.addEventListener("pointerenter", () => {
		Ov.has(t) && (kv.add(t), Pv());
	}), t.addEventListener("pointerleave", () => {
		kv.delete(t) && Pv();
	}));
}
function Nv(e) {
	Ov.delete(e), kv.delete(e) && Pv();
}
function Pv() {
	let e = /* @__PURE__ */ new Set();
	for (let t of kv) {
		let n = Ov.get(t);
		if (n !== void 0 && n.contains(t)) for (let r = t.parentElement; r !== null && (e.add(r), r !== n); r = r.parentElement);
	}
	for (let t of jv) e.has(t) || t.removeAttribute(si);
	for (let t of e) t.hasAttribute("data-ui-popup-hover") || t.setAttribute(si, "");
	jv = [...e];
}
var Fv = /* @__PURE__ */ new Set(), Iv = [
	"inert",
	"disabled",
	"aria-disabled",
	...Vg
], Lv = null, Rv = !1, zv = null;
function Bv(e) {
	if (e === null) return null;
	for (let t of Fv) {
		let n = t.holding(e);
		if (n !== null) return n;
	}
	return null;
}
function Vv(e, t) {
	Fv.add(e), Uv(), typeof MutationObserver == "function" && (Lv === null && (Lv = new MutationObserver((e) => Hv(e)), Lv.observe(document, {
		subtree: !0,
		childList: !0
	})), Hg(Lv, t, Iv));
}
function Hv(e) {
	let t = e.some((e) => e.type === "attributes"), n = Ug(e, [...Fv].flatMap((e) => [...e.owners()]));
	for (let e of [...Fv]) e.closeStranded(t ? void 0 : n);
	for (let e of n) Lv !== null && e.isConnected && Hg(Lv, e, Iv);
}
function Uv() {
	Rv || (Rv = !0, Th(() => {
		for (let e of [...Fv]) e.closeReformed(), e.closeStranded();
	}), document.addEventListener("scroll", (e) => {
		Fv.size !== 0 && (zv === null ? (zv = [e.target], Wv(() => {
			let e = zv ?? [];
			zv = null;
			for (let t of [...Fv]) t.closeOutOfSight(e);
		})) : zv.push(e.target));
	}, {
		capture: !0,
		passive: !0
	}));
}
function Wv(e) {
	typeof requestAnimationFrame == "function" ? requestAnimationFrame(e) : setTimeout(e, 0);
}
function Gv(e) {
	Fv.delete(e), !(Fv.size > 0 || Lv === null) && (Lv.disconnect(), Lv = null);
}
//#endregion
//#region src/interactions/flyout-interaction-engine.ts
var Kv = "ui-flyout", qv = "ui-flyout--open", Jv = "ui-flyout__anchor", Yv = "data-ui-flyout-no-backdrop-close", Xv = "data-ui-flyout-no-escape-close", Zv = `${Kv}--`, Qv = [...Vg], $v = "bottom-start", ey = class {
	root;
	waiting = /* @__PURE__ */ new Set();
	sightWatch = null;
	tiersWatched = !1;
	flyouts = new _v({
		show: ({ owner: e }) => e.classList.add(qv),
		hide: ({ owner: e }, t) => {
			t === "owner" && ty(e) ? this.wait(e) : this.markClosed(e, t !== "owner" || !k(e));
		},
		single: !1,
		closesWhenReadOnly: !1,
		canDismiss: ({ owner: e }, t) => !e.hasAttribute(t === "escape" ? Xv : Yv)
	});
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${Kv}`)) this.place(e);
		V(this.root, `.${Kv}`, { attributeFilter: ["class"] }, (e) => {
			for (let t of e) this.place(t);
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	place(e) {
		let t = e.querySelector(`:scope > .${Oi}`), n = e.querySelector(`:scope > .${Jv}`);
		if (t === null) return;
		let r = ny(n, t);
		e.classList.contains(qv) ? this.flyouts.open({
			owner: e,
			popup: t,
			anchor: iy(n) ?? e,
			placement: { placement: ay(e) },
			openers: r === null ? [] : [r],
			focus: !this.waiting.has(e) && (!Ip() || t)
		}) ? this.waiting.delete(e) : ty(e) ? this.wait(e) : this.markClosed(e, !k(e)) : (this.waiting.delete(e), this.flyouts.close(e), r?.setAttribute("aria-expanded", "false"));
	}
	wait(e) {
		this.waiting.add(e), this.tiersWatched || (this.tiersWatched = !0, Th(() => this.placeWaiting())), typeof MutationObserver == "function" && (this.sightWatch === null && (this.sightWatch = new MutationObserver((e) => this.placeWaiting(e)), this.sightWatch.observe(document, {
			subtree: !0,
			childList: !0
		})), Hg(this.sightWatch, e, Qv));
	}
	placeWaiting(e) {
		let t = e === void 0 || e.some((e) => e.type === "attributes") ? null : Ug(e, [...this.waiting]);
		for (let e of [...this.waiting]) !e.isConnected || !e.classList.contains(qv) ? this.waiting.delete(e) : (t?.has(e) === !0 && this.sightWatch !== null && Hg(this.sightWatch, e, Qv), (t === null || t.has(e)) && Kg(e) && this.place(e));
		this.waiting.size === 0 && (this.sightWatch?.disconnect(), this.sightWatch = null);
	}
	markClosed(e, t = !0) {
		e.classList.contains(qv) && (e.classList.remove(qv), ry(e, !1, t));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Jv}`)?.closest(`.${Kv}`) ?? null;
		t !== null && (this.flyouts.isOpen(t) ? this.flyouts.close(t) : (t.classList.add(qv), this.place(t), this.flyouts.isOpen(t) && ry(t, !0)));
	}
};
function ty(e) {
	return e.isConnected && !k(e) && !Kg(e);
}
function ny(e, t) {
	if (e === null) return null;
	let n = e.querySelector(yp) ?? e;
	return n.setAttribute("aria-haspopup", "dialog"), n.setAttribute("aria-controls", ta(t, "ui-flyout-content")), n;
}
function ry(e, t, n = !0) {
	e.dispatchEvent(new Event("toggle", { bubbles: !0 })), n && e.dispatchEvent(new Event(t ? "open" : "close", { bubbles: !0 }));
}
function iy(e) {
	if (e === null) return null;
	let t = e.firstElementChild;
	return t instanceof HTMLElement ? t : e;
}
function ay(e) {
	for (let t of e.classList) {
		if (!t.startsWith(Zv)) continue;
		let e = t.slice(Zv.length);
		if (Mh(e)) return e;
	}
	return $v;
}
//#endregion
//#region src/interactions/drag-picture.ts
var oy = "ui-drag-picture", sy = "data-ui-drag-part", cy = ["::before", "::after"], ly = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", uy = /* @__PURE__ */ new Set(/* @__PURE__ */ "src.srcset.sizes.alt.width.height.type.viewbox.preserveaspectratio.href.xlink:href.d.points.cx.cy.r.rx.ry.x.y.x1.y1.x2.y2.fill.stroke.stroke-width.transform".split(".")), dy = null, fy = null;
typeof Image == "function" && my();
function py(e, t, n) {
	let r = n.getBoundingClientRect(), i = e.clientX - r.left, a = e.clientY - r.top, o = my();
	fy?.(), o === null || typeof n.showPopover != "function" ? t.setDragImage(n, i, a) : (t.setDragImage(o, 0, 0), hy(n, r, i, a), setTimeout(() => {
		e.defaultPrevented && fy?.();
	}, 0));
}
function my() {
	return dy === null && typeof Image == "function" && (dy = new Image(1, 1), dy.src = ly), dy;
}
function hy(e, t, n, r) {
	let i = document.createElement("div"), a = e.cloneNode(!0), o = [];
	i.className = oy, i.setAttribute("popover", "manual"), i.setAttribute("aria-hidden", "true"), i.inert = !0, i.style.width = `${t.width}px`, i.style.height = `${t.height}px`, _y(e, a, o);
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
	let s = (e) => gy(i, e.clientX - n, e.clientY - r), c = (e) => {
		e.relatedTarget === null && (i.style.visibility = "hidden");
	}, l = () => {
		i.style.visibility = "";
	}, u = () => {
		document.removeEventListener("dragover", s, !0), document.removeEventListener("dragleave", c, !0), document.removeEventListener("dragenter", l, !0), document.removeEventListener("drop", u, !0), document.removeEventListener("dragend", u, !0), e.removeEventListener("dragend", u), i.remove(), fy === u && (fy = null);
	};
	document.addEventListener("dragover", s, !0), document.addEventListener("dragleave", c, !0), document.addEventListener("dragenter", l, !0), document.addEventListener("drop", u, !0), document.addEventListener("dragend", u, !0), e.addEventListener("dragend", u), fy = u, gy(i, t.left, t.top), document.body.append(i), i.showPopover();
}
function gy(e, t, n) {
	e.style.transform = `translate(${t}px, ${n}px)`;
}
function _y(e, t, n) {
	let r = t.style;
	r !== void 0 && (xy(getComputedStyle(e), (e, t) => r.setProperty(e, t)), vy(e, r, "columns"), vy(e, r, "rows"));
	for (let e of t.getAttributeNames()) e !== "style" && !uy.has(e.toLowerCase()) && t.removeAttribute(e);
	by(e, t, n), e instanceof HTMLInputElement && t instanceof HTMLInputElement && (t.value = e.value, t.checked = e.checked);
	for (let r = e.children.length - 1; r >= 0; r--) {
		let i = e.children[r], a = t.children[r];
		i.classList.contains("ui-press-wave") ? a.remove() : _y(i, a, n);
	}
}
function vy(e, t, n) {
	t.getPropertyValue(`grid-template-${n}`).startsWith("subgrid") && t.setProperty(`grid-template-${n}`, yy(e, n).join(" "));
}
function yy(e, t) {
	let n = getComputedStyle(e), r = n.getPropertyValue(`grid-template-${t}`);
	if (!r.startsWith("subgrid")) return r.split(/\s+/).filter((e) => /^-?[\d.]+px$/.test(e));
	if (e.parentElement === null) return [];
	let i = yy(e.parentElement, t), a = t === "columns" ? "column" : "row", o = Number.parseInt(n.getPropertyValue(`grid-${a}-start`), 10), s = Number.parseInt(n.getPropertyValue(`grid-${a}-end`), 10), c = Number.isNaN(o) ? 0 : o > 0 ? o - 1 : i.length + o + 1, l = Number.isNaN(s) ? i.length : s > 0 ? s - 1 : i.length + s + 1;
	return i.slice(c, l);
}
function by(e, t, n) {
	for (let r of cy) {
		let i = getComputedStyle(e, r);
		if (i.content === void 0 || i.content === "none" || i.content === "normal") continue;
		t.hasAttribute(sy) || t.setAttribute(sy, String(n.length));
		let a = [];
		xy(i, (e, t) => a.push(`${e}: ${t};`)), n.push(`.${oy} [${sy}="${t.getAttribute(sy)}"]${r} { ${a.join(" ")} }`);
	}
}
function xy(e, t) {
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		r.startsWith("--") || t(r, e.getPropertyValue(r));
	}
}
//#endregion
//#region src/interactions/drag-marks.ts
var Sy = `:scope > :is(${sd}, .ui-image-input__surface)`;
function Cy(e, t, n, r, i, a = [], o = "move") {
	wy(t, r), Ty(e, i, o), n.classList.add(r);
	for (let e of a) e.classList.add(r);
}
function wy(e, t) {
	for (let n of e.querySelectorAll(`.${t}`)) n.classList.remove(t);
}
function Ty(e, t, n) {
	e instanceof DragEvent && e.dataTransfer !== null && (e.dataTransfer.effectAllowed = n, e.dataTransfer.setData("text/plain", t), e.target instanceof HTMLElement && py(e, e.dataTransfer, e.target));
}
function Ey(e, t) {
	return !(e.relatedTarget instanceof Node && t.contains(e.relatedTarget));
}
function Dy(e, t) {
	let n = t && e.querySelector(Sy) !== null;
	e.hasAttribute("data-ui-drop-boxed") !== n && e.toggleAttribute(ge, n);
}
//#endregion
//#region src/interactions/file-drop.ts
var Oy = "data-ui-file-drop-over", ky = 120, Ay = "refused", jy = !1;
function My(e) {
	let t = {
		marked: /* @__PURE__ */ new Map(),
		leaving: 0
	};
	Iy();
	for (let n of [
		"dragenter",
		"dragover",
		"dragleave",
		"drop"
	]) e.root.addEventListener(n, (n) => Ny(e, t, n), !0);
	e.root.addEventListener("dragend", () => Hy(t.marked), !0), window.addEventListener("blur", () => Hy(t.marked)), e.root.addEventListener("paste", (t) => Py(e, t), !0);
}
function Ny(e, t, n) {
	if (!(n instanceof DragEvent) || !(n.target instanceof Element)) return;
	let r = t.marked;
	n.type !== "dragleave" && t.leaving !== 0 && (window.clearTimeout(t.leaving), t.leaving = 0);
	let i = e.resolveTarget(n.target);
	if (i === null || !(n.dataTransfer?.types.includes("Files") ?? !1)) {
		i === null && n.type === "dragover" && Hy(r);
		return;
	}
	let a = i.mark ?? i.host;
	if (i.refused === !0) {
		Ly(n), n.type !== "dragleave" && Hy(r);
		return;
	}
	if (n.type === "dragleave") {
		n.relatedTarget instanceof Node ? a.contains(n.relatedTarget) || Vy(r, a) : t.leaving = window.setTimeout(() => Hy(r), ky);
		return;
	}
	if (n.preventDefault(), n.type !== "drop") {
		let t = Ry(i.accept, n.dataTransfer);
		n.dataTransfer !== null && (n.dataTransfer.dropEffect = t ? "none" : "copy");
		for (let e of r.keys()) e !== a && Vy(r, e);
		let o = i.mark === void 0 ? e.draggingAttribute : Oy;
		r.set(a, o), a.setAttribute(o, t ? Ay : ""), Dy(a, o === Oy);
		return;
	}
	Hy(r);
	let o = [...n.dataTransfer?.files ?? []].filter((e) => Uy(i.accept, e));
	o.length !== 0 && e.onFiles(i.host, i.multiple ? o : [o[0]]);
}
function Py(e, t) {
	if (!(t instanceof ClipboardEvent) || !(t.target instanceof Element)) return;
	let n = t.clipboardData;
	if (n === null || n.files.length === 0 || n.getData("text/plain").trim().length > 0) return;
	let r = e.resolveTarget(t.target);
	if (r === null || r.refused === !0) return;
	let i = [...n.files].filter((e) => Uy(r.accept, e));
	i.length !== 0 && (t.preventDefault(), e.onFiles(r.host, r.multiple ? i : [i[0]]));
}
function Fy(e, t, n) {
	for (let r = t.closest(`[${y}]`); r !== null; r = r.parentElement?.closest("[data-ui-id]") ?? null) {
		let t = r.getAttribute("data-ui-id") ?? "", i = [...e.querySelectorAll(`${n}[${Vr}="${C(t)}"]`)];
		if (i.length > 0) return {
			field: i.find((e) => r.contains(e)) ?? i[0],
			component: r
		};
	}
	return null;
}
function Iy() {
	if (!jy) {
		jy = !0;
		for (let e of ["dragover", "drop"]) window.addEventListener(e, (e) => {
			e instanceof DragEvent && !e.defaultPrevented && (e.dataTransfer?.types.includes("Files") ?? !1) && Ly(e);
		});
	}
}
function Ly(e) {
	e.type !== "dragleave" && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "none"));
}
function Ry(e, t) {
	let n = zy(e);
	if (t === null || n.length === 0 || n.some((e) => e.startsWith("."))) return !1;
	let r = [...t.items].filter((e) => e.kind === "file").map((e) => e.type.toLowerCase());
	return r.length !== 0 && !r.some((e) => n.some((t) => By(t, e)));
}
function zy(e) {
	return e.split(",").map((e) => e.trim().toLowerCase()).filter((e) => e.length > 0);
}
function By(e, t) {
	return e.endsWith("/*") ? t.startsWith(e.slice(0, -1)) : t === e;
}
function Vy(e, t) {
	let n = e.get(t);
	e.delete(t), n !== void 0 && t.removeAttribute(n), Dy(t, !1);
}
function Hy(e) {
	for (let t of [...e.keys()]) Vy(e, t);
}
function Uy(e, t) {
	let n = zy(e);
	if (n.length === 0) return !0;
	let r = t.name.toLowerCase(), i = t.type.toLowerCase();
	return n.some((e) => e.startsWith(".") ? r.endsWith(e) : By(e, i));
}
//#endregion
//#region src/runtime/session-key.ts
var Wy = "SessionKey", Gy = "/_ne/session/key", Ky = 1e4, qy = new class {
	trade;
	pending = null;
	lastToken = null;
	constructor(e = Yy) {
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
function Jy(e, t) {
	for (let n of t ?? []) n.kind === "SessionKey" && e.start(n.token);
}
async function Yy(e) {
	let t = await fetch(Gy, {
		method: "POST",
		credentials: "same-origin",
		keepalive: !0,
		cache: "no-store",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ token: e }),
		signal: AbortSignal.timeout(Ky)
	});
	if (!t.ok) throw Error(`the session key trade failed with status ${t.status}.`);
}
//#endregion
//#region src/interactions/file-upload.ts
var Xy = "/_ne/files/upload", Zy = "/_ne/files/selection/", Qy = "/_ne/files/upload/", $y = /* @__PURE__ */ new Map(), eb = !1;
function tb(e, t, n, r) {
	let i = Number(e.getAttribute(zr)), a = [], o = [];
	for (let e of t) !Number.isFinite(i) || i <= 0 || e.size <= i ? a.push(e) : o.push(e);
	return o.length === 0 ? ($y.delete(e) && r?.mark(e, null), a) : r === void 0 ? (s("a chosen file exceeds the input's size limit and was refused.", {
		names: o.map((e) => e.name),
		limit: i
	}), a) : (rb(e, {
		validation: r,
		size: nb(i, n ? o.map((e) => e.name).join(", ") : null),
		failed: []
	}), a);
}
function nb(e, t) {
	let n = { fileSize: e };
	return t === null ? {
		key: "ui.file.oversized",
		args: { limit: n }
	} : {
		key: "ui.file.leftout",
		args: {
			limit: n,
			names: t
		}
	};
}
function rb(e, t) {
	for (let e of $y.keys()) e.isConnected || $y.delete(e);
	$y.set(e, t), ib(e, t), ob();
}
function ib(e, t) {
	t.validation.mark(e, "error", ab(t));
}
function ab(e) {
	let t = e.size, n = e.failed.length === 0 ? null : {
		key: "ui.file.notuploaded",
		args: { names: e.failed.join(", ") }
	};
	return t === null || n === null ? t ?? n ?? { text: "" } : { text: `${O.translate(t.key, t.args)}\n${O.translate(n.key, n.args)}` };
}
function ob() {
	eb || (eb = !0, O.onChange(() => {
		for (let [e, t] of $y) e.isConnected ? ib(e, t) : $y.delete(e);
	}));
}
function sb(e, t, n) {
	if (n === void 0) return;
	let r = $y.get(e);
	rb(e, {
		validation: n,
		size: r?.size ?? null,
		failed: [...r?.failed ?? [], t]
	});
}
async function cb(e, t) {
	let n = [...e];
	return await qy.settled(), await lb(n, t);
}
function lb(e, t) {
	return new Promise((n, r) => {
		let i = new FormData(), a = performance.now(), o = 0, s = 0;
		for (let t of e) i.append("files", t, t.name), o += t.size, s++;
		let c = new XMLHttpRequest();
		c.open("POST", Xy), c.responseType = "json", c.withCredentials = !0, c.upload.addEventListener("progress", (e) => {
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
async function ub(e) {
	await qy.settled();
	let t = await fetch(`${Zy}${encodeURIComponent(e)}`, {
		credentials: "same-origin",
		cache: "no-store"
	});
	if (!t.ok) throw Error(`Reading selection failed with status ${t.status}.`);
	let n = (await t.json())?.files ?? [];
	return n.length === 0 ? null : n;
}
function db(e) {
	return `${Qy}${encodeURIComponent(e)}`;
}
var fb = () => {};
function pb(e, t) {
	return {
		uploadAsync: (e, n, r) => {
			let i = cb(e, n ?? fb);
			if (r !== void 0) {
				let e = t.hold(r, {}), n = () => void setTimeout(e, 0);
				i.then(n, n);
			}
			return i;
		},
		accepts: Uy,
		takeWithinSizeLimit: (t, n, r) => tb(t, n, r, e)
	};
}
function mb(e, t) {
	e !== null && e.value !== t && (e.value = t, e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/picker-events.ts
var hb = "ui-open-picker";
function gb(e) {
	return !e.dispatchEvent(new Event(hb, {
		bubbles: !0,
		cancelable: !0
	}));
}
function _b(e, t) {
	if (!(e.target instanceof Element)) return;
	let n = e.target.closest(t.rootSelector);
	if (n === null) return;
	e.preventDefault();
	let r = n.querySelector(t.nativeSelector), i = t.pressed(n);
	r === null || r.disabled || i === null || j(n) || k(i) || r.click();
}
//#endregion
//#region src/interactions/uploads-in-flight.ts
var vb = class {
	slots = /* @__PURE__ */ new Map();
	wake = () => void 0;
	changed = this.nextChange();
	waiting = 0;
	removals = null;
	hold(e, t = e) {
		let n = this.slots.get(e);
		n === void 0 && (n = /* @__PURE__ */ new Map(), this.slots.set(e, n));
		let r = () => this.release(e, t, r);
		return n.set(t, r), r;
	}
	release(e, t, n) {
		let r = this.slots.get(e);
		if (r !== void 0) {
			if (r.get(t) !== n) return;
			r.delete(t), r.size === 0 && this.slots.delete(e);
		}
		this.wakeWaiters();
	}
	wakeWaiters() {
		let e = this.wake;
		this.changed = this.nextChange(), e();
	}
	nextChange() {
		return new Promise((e) => {
			this.wake = e;
		});
	}
	forget(e, t = e) {
		this.slots.get(e)?.get(t)?.();
	}
	async whenUploadedAsync(e) {
		let t = /* @__PURE__ */ new Set();
		this.waiting++;
		try {
			for (; this.holdsForm(e, t);) this.watchRemovals(), await this.changed;
		} finally {
			--this.waiting === 0 && (this.removals?.disconnect(), this.removals = null);
		}
		return t;
	}
	holdsForm(e, t) {
		let n = !1;
		for (let r of this.slots.keys()) r.isConnected ? yb(r) === e && (t.add(r), n = !0) : this.slots.delete(r);
		return n;
	}
	watchRemovals() {
		this.removals === null && typeof MutationObserver < "u" && (this.removals = new MutationObserver(() => {
			for (let e of this.slots.keys()) if (!e.isConnected) {
				this.wakeWaiters();
				return;
			}
		}), this.removals.observe(document, {
			childList: !0,
			subtree: !0
		}));
	}
};
function yb(e) {
	return (e.hasAttribute("data-ui-form-id") ? e : e.querySelector("[data-ui-form-id]"))?.getAttribute("data-ui-form-id") ?? null;
}
var bb = new vb(), xb = "ui-file-input", Sb = "ui-file-input__row", Cb = "ui-file-input__native", wb = "ui-file-input__field", Tb = "ui-file-input__selection", Eb = "data-ui-file-dragging", Db = class {
	root;
	validation;
	uploads;
	picks = /* @__PURE__ */ new WeakMap();
	shownWords = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation, this.uploads = e.uploads ?? bb, O.onChange(() => this.rewriteShownWords()), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener(hb, (e) => _b(e, {
			rootSelector: `.${xb}`,
			nativeSelector: `.${Cb}`,
			pressed: (e) => e
		})), this.root.addEventListener("change", (e) => void this.handleSelectionAsync(e), !0), My({
			root: this.root,
			draggingAttribute: Eb,
			resolveTarget: (e) => {
				let t = e.closest(`.${Sb}`)?.closest(`.${xb}`) ?? null, n = t === null ? Fy(this.root, e, `.${xb}`) : null, r = t ?? n?.field ?? null, i = r?.querySelector(`.${Cb}`) ?? null;
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
		let t = e.target.closest(`[${Br}], .${Sb}`);
		if (t === null || k(t) || j(t) || !t.hasAttribute("data-ui-file-pick") && e.target.closest("button, a") !== null) return;
		let n = t.closest(`.${xb}`)?.querySelector(`.${Cb}`);
		n == null || n.disabled || n.click();
	}
	async handleSelectionAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Cb)) return;
		let t = e.target.closest(`.${xb}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && await this.takeFilesAsync(t, n);
	}
	async takeFilesAsync(e, t) {
		let n = e.querySelector(`.${wb}`);
		if (n === null) return;
		if (t.length === 0) {
			this.show(n, ""), this.publishSelection(e, "");
			return;
		}
		let r = tb(e, t, e.querySelector(`.${Cb}`)?.multiple === !0, this.validation);
		if (r.length === 0) return;
		let i = (this.picks.get(e) ?? 0) + 1;
		this.picks.set(e, i);
		let a = this.uploads.hold(e);
		try {
			let t = await cb(r, (t) => {
				this.picks.get(e) === i && this.show(n, () => O.format("ui.file.uploading", { percent: t }));
			});
			if (this.picks.get(e) !== i) return;
			this.show(n, Ob(r)), this.publishSelection(e, t.selectionId);
		} catch (t) {
			if (s("file upload failed.", t), this.picks.get(e) !== i) return;
			this.show(n, () => O.text("ui.file.failed")), this.publishSelection(e, "");
		} finally {
			a();
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
		mb(e.querySelector(`.${Tb}`), t);
	}
};
function Ob(e) {
	return e.length === 1 ? e[0].name : () => O.format("ui.file.count", { count: e.length });
}
//#endregion
//#region src/rendering/file-glyphs.ts
var kb = "ne-picture-as-pdf", Ab = "ne-text-snippet", jb = "ne-description", Mb = "ne-table-chart", Nb = "ne-slideshow", Pb = "ne-folder-zip", Fb = "ne-audio-file", Ib = "ne-video-file", Lb = "ne-image", Rb = "ne-code", zb = "ne-draft", Bb = new Map([
	...Wb(kb, "pdf"),
	...Wb(Ab, "txt", "md", "log"),
	...Wb(jb, "doc", "docx", "odt", "rtf"),
	...Wb(Mb, "xls", "xlsx", "ods", "csv", "tsv"),
	...Wb(Nb, "ppt", "pptx", "odp", "key"),
	...Wb(Pb, "zip", "rar", "7z", "tar", "gz", "tgz", "bz2", "xz"),
	...Wb(Fb, "mp3", "wav", "ogg", "oga", "opus", "flac", "m4a", "aac"),
	...Wb(Ib, "mp4", "m4v", "mov", "avi", "mkv", "webm"),
	...Wb(Lb, "png", "jpg", "jpeg", "gif", "webp", "avif", "bmp", "svg", "ico", "tif", "tiff", "heic", "heif"),
	...Wb(Rb, "json", "xml", "yml", "yaml", "html", "htm", "css", "less", "scss", "js", "mjs", "ts", "tsx", "jsx", "cs", "csproj", "sln", "java", "kt", "py", "rb", "php", "go", "rs", "c", "h", "cpp", "hpp", "swift", "sql", "sh", "ps1")
]), Vb = /* @__PURE__ */ new Map([
	["application/pdf", kb],
	["text/csv", Mb],
	["application/msword", jb],
	["application/rtf", jb],
	["application/vnd.openxmlformats-officedocument.wordprocessingml.document", jb],
	["application/vnd.oasis.opendocument.text", jb],
	["application/vnd.ms-excel", Mb],
	["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", Mb],
	["application/vnd.oasis.opendocument.spreadsheet", Mb],
	["application/vnd.ms-powerpoint", Nb],
	["application/vnd.openxmlformats-officedocument.presentationml.presentation", Nb],
	["application/vnd.oasis.opendocument.presentation", Nb],
	["application/zip", Pb],
	["application/x-zip-compressed", Pb],
	["application/x-7z-compressed", Pb],
	["application/vnd.rar", Pb],
	["application/x-rar-compressed", Pb],
	["application/x-tar", Pb],
	["application/gzip", Pb],
	["application/json", Rb],
	["application/xml", Rb],
	["text/xml", Rb],
	["text/html", Rb]
]), Hb = /* @__PURE__ */ new Map([
	["image", Lb],
	["audio", Fb],
	["video", Ib],
	["text", Ab]
]);
function Ub(e, t) {
	let n = e.lastIndexOf("."), r = n < 0 ? void 0 : Bb.get(e.slice(n + 1).toLowerCase());
	if (r !== void 0) return r;
	let i = t.split(";", 1)[0].trim().toLowerCase(), a = i.indexOf("/");
	return Vb.get(i) ?? (a < 0 ? void 0 : Hb.get(i.slice(0, a))) ?? zb;
}
function Wb(e, ...t) {
	return t.map((t) => [t, e]);
}
//#endregion
//#region src/rendering/file-tile.ts
function Gb(e, t, n) {
	let r = document.createElement("span"), i = document.createElement("span"), a = document.createElement("span");
	return e.classList.add(Et), e.setAttribute("title", t.name), e.setAttribute(At, t.name), Kb(e, jt, t.type.length > 0 ? t.type : null), Kb(e, Mt, t.size === null ? null : String(t.size)), r.className = Dt, r.setAttribute("aria-hidden", "true"), i.className = Ot, i.textContent = t.name, a.className = kt, Jb(e, r, a, n), [
		r,
		i,
		a
	];
}
function Kb(e, t, n) {
	n === null ? e.removeAttribute(t) : e.setAttribute(t, n);
}
function qb(e, t) {
	let n = e.querySelector(`:scope > .${Dt}`), r = e.querySelector(`:scope > .${kt}`);
	n !== null && r !== null && Jb(e, n, r, t);
}
function Jb(e, t, n, r) {
	let i = e.getAttribute(Nt), a = i !== null && Po(i).length > 0 ? i : Ub(e.getAttribute("data-ui-file-name") ?? "", e.getAttribute("data-ui-file-type") ?? "");
	(!t.classList.contains(Po(a)) || i !== null) && jo(t, a);
	let o = oo(e.getAttribute(Mt), r);
	n.textContent !== o && (n.textContent = o);
}
var Yb = 1024, Xb = 16777216;
function Zb(e) {
	return {
		x: e.width / 2,
		y: e.height / 2,
		zoom: 1
	};
}
function Qb(e, t) {
	let n = cx(t.zoom, 1, 4), r = sx(e) / n / 2;
	return {
		x: cx(t.x, r, e.width - r),
		y: cx(t.y, r, e.height - r),
		zoom: n
	};
}
function $b(e, t) {
	let n = sx(e) / t.zoom;
	return {
		x: t.x - n / 2,
		y: t.y - n / 2,
		side: n
	};
}
function ex(e, t, n) {
	return t.zoom * n / sx(e);
}
function tx(e, t, n, r, i) {
	let a = ex(e, t, n);
	return a > 0 ? Qb(e, {
		x: t.x - r / a,
		y: t.y - i / a,
		zoom: t.zoom
	}) : t;
}
function nx(e, t, n, r, i = {
	x: 0,
	y: 0
}) {
	let a = cx(t.zoom * r, 1, 4), o = ex(e, t, n), s = ex(e, {
		...t,
		zoom: a
	}, n);
	return !(o > 0) || !(s > 0) ? Qb(e, {
		...t,
		zoom: a
	}) : Qb(e, {
		x: t.x + i.x / o - i.x / s,
		y: t.y + i.y / o - i.y / s,
		zoom: a
	});
}
function rx(e, t) {
	return Math.max(1, Math.min(t, Math.round(e.side)));
}
function ix(e, t) {
	return Math.min(1, t * 4 / sx(e), Math.sqrt(Xb / (e.width * e.height)));
}
function ax(e) {
	return e === "image/jpeg" || e === "image/png" || e === "image/webp" ? e : "image/png";
}
function ox(e, t, n) {
	if (n === t) return e;
	let r = e.lastIndexOf(".");
	return `${r > 0 ? e.slice(0, r) : e}.${n === "image/jpeg" ? "jpg" : n.slice(n.indexOf("/") + 1)}`;
}
function sx(e) {
	return Math.min(e.width, e.height);
}
function cx(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
//#endregion
//#region src/interactions/page-dialog.ts
function lx(e) {
	let t = document.createElement("div");
	t.className = `ui-dialog ${e.className}`, t.setAttribute(Qg, e.key), t.setAttribute($g, ""), e.closesOnEscapeAndBackdrop && (t.setAttribute(n_, ""), t.setAttribute(t_, "")), t.setAttribute("hidden", "");
	let n = document.createElement("div");
	n.className = "ui-dialog__backdrop", n.setAttribute(e_, "");
	let r = document.createElement("div");
	return r.className = e.surfaceClassName === void 0 ? Di : `${Di} ${e.surfaceClassName}`, r.setAttribute("role", e.role), r.setAttribute("tabindex", "-1"), r.setAttribute("aria-modal", "true"), r.setAttribute("aria-labelledby", e.labelledBy), e.describedBy !== void 0 && r.setAttribute("aria-describedby", e.describedBy), t.append(n, r), {
		dialog: t,
		surface: r
	};
}
var ux = class {
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
}, dx = 100 / 3, fx = 1, px = 2;
function mx(e, t = dx) {
	let n = e.deltaMode === fx ? dx : e.deltaMode === px ? t : 1;
	return {
		x: e.deltaX * n,
		y: e.deltaY * n
	};
}
function hx(e, t) {
	let n = (Math.sign(e) === Math.sign(t) ? e : 0) + t, r = Math.trunc(n / 100) || 0;
	return {
		steps: r,
		carried: n - r * 100
	};
}
var gx = {
	notch: 100,
	pixels: mx
}, _x = "ui-image-crop", vx = "ui-image-crop-title", yx = new ux("data-ui-image-crop-part"), bx = "data-ui-image-crop-frame", xx = 10, Sx = 1.2, Cx = 380, wx = 100, Tx = .92, H = null, Ex = !1, Dx = null, Ox = !1;
async function kx(e, t, n, r = Vx) {
	if (H !== null || Ex) return "cancelled";
	Ex = !0;
	let i;
	try {
		i = await r.decodeAsync(t, n.size);
	} finally {
		Ex = !1;
	}
	if (i === null) return "unreadable";
	let a = i;
	return new Promise((i) => {
		Dx ??= Ax();
		let o = Dx;
		o.dialog.isConnected || document.body.append(o.dialog), H = {
			file: t,
			source: a,
			request: n,
			imaging: r,
			view: Zb(a),
			finish: (t) => {
				H = null, e.close(_x), a.release(), i(t);
			}
		}, O.write(o.title, null, "ui.crop.title"), O.write(o.stage, "aria-label", "ui.crop.frame"), O.write(o.zoom, "aria-label", "ui.crop.zoom"), O.write(o.cancel, null, "ui.crop.cancel"), O.write(o.apply, null, "ui.crop.apply"), o.stage.setAttribute(bx, n.frame), e.open(_x), zx(o);
	});
}
function Ax() {
	let { dialog: e, surface: t } = lx({
		key: _x,
		className: "ui-image-crop",
		surfaceClassName: "ui-image-crop__surface",
		role: "dialog",
		labelledBy: vx,
		closesOnEscapeAndBackdrop: !1
	}), n = yx.element("h2", "ui-image-crop__title ui-text-type--subtitle");
	n.id = vx;
	let r = yx.element("div", "ui-image-crop__stage", "stage");
	r.setAttribute("tabindex", "0"), r.setAttribute("role", "group");
	let i = yx.element("canvas", "ui-image-crop__canvas"), a = yx.element("span", "ui-image-crop__frame");
	i.setAttribute("aria-hidden", "true"), a.setAttribute("aria-hidden", "true"), r.append(i, a);
	let o = yx.element("input", "ui-image-crop__zoom", "zoom");
	o.type = "range", o.min = "1", o.max = "4", o.step = "0.01";
	let s = yx.button("ui-button--ghost", "cancel"), c = yx.button("ui-button--primary", "apply");
	t.append(n, r, o, yx.actions(s, c));
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
		let t = yx.pressed(e);
		t === "cancel" ? H?.finish("cancelled") : t === "apply" && jx();
	}), new MutationObserver(() => {
		H !== null && e.hasAttribute("hidden") && H.finish("cancelled");
	}).observe(e, {
		attributes: !0,
		attributeFilter: ["hidden"]
	}), e.addEventListener("keydown", (e) => Mx(l, e)), o.addEventListener("input", () => Lx(l, Number(o.value))), r.addEventListener("wheel", (e) => Nx(l, e), { passive: !1 }), window.addEventListener("resize", () => Bx(l)), new j_({
		root: e,
		resolveHandle: (e) => r.contains(e) ? r : null,
		begin: (e, t) => H === null ? null : {
			last: t,
			start: H.view
		},
		move: (e, t, n) => {
			e.last !== null && Px(l, n.x - e.last.x, n.y - e.last.y), e.last = n;
		},
		end: () => void 0,
		cancel: (e, t) => {
			H !== null && (H.view = t.start, zx(l));
		},
		pinch: (e, t) => {
			e.last = null, Fx(l, t);
		}
	}), l;
}
async function jx() {
	let e = H;
	if (e === null) return;
	let { file: t, source: n, request: r, imaging: i, view: a } = e, o = $b(n, a), s = ax(t.type), c = i.encodeAsync(n, o, rx(o, r.size), s);
	H = null;
	let l;
	try {
		l = await c;
	} catch {
		l = null;
	}
	e.finish(l === null ? "unreadable" : new File([l], ox(t.name, t.type, l.type), {
		type: l.type,
		lastModified: t.lastModified
	}));
}
function Mx(e, t) {
	if (t.defaultPrevented || M(t) || H === null) return;
	if (t.key === "Escape") {
		t.preventDefault(), H.finish("cancelled");
		return;
	}
	if (t.target !== e.stage || !N(t, { shift: !0 })) return;
	let n = t.shiftKey ? 50 : xx;
	switch (t.key) {
		case "ArrowLeft":
			Px(e, -n, 0);
			break;
		case "ArrowRight":
			Px(e, n, 0);
			break;
		case "ArrowUp":
			Px(e, 0, -n);
			break;
		case "ArrowDown":
			Px(e, 0, n);
			break;
		case "+":
		case "=":
			Ix(e, Sx);
			break;
		case "-":
		case "_":
			Ix(e, 1 / Sx);
			break;
		case "Enter":
			jx();
			break;
		default: return;
	}
	t.preventDefault();
}
function Nx(e, t) {
	if (H === null) return;
	t.preventDefault();
	let n = mx(t, e.stage.clientHeight), r = t.ctrlKey ? wx : Cx;
	Ix(e, 2 ** (-n.y / r), Rx(e, t.clientX, t.clientY));
}
function Px(e, t, n) {
	H !== null && (H.view = tx(H.source, H.view, e.frame.clientWidth, t, n), zx(e));
}
function Fx(e, t) {
	if (H === null) return;
	let n = tx(H.source, H.view, e.frame.clientWidth, t.shift.x, t.shift.y);
	H.view = nx(H.source, n, e.frame.clientWidth, t.factor, Rx(e, t.center.x, t.center.y)), zx(e);
}
function Ix(e, t, n) {
	H !== null && (H.view = nx(H.source, H.view, e.frame.clientWidth, t, n), zx(e));
}
function Lx(e, t) {
	H !== null && Number.isFinite(t) && t > 0 && Ix(e, t / H.view.zoom);
}
function Rx(e, t, n) {
	let r = e.stage.getBoundingClientRect();
	return {
		x: t - (r.left + r.width / 2),
		y: n - (r.top + r.height / 2)
	};
}
function zx(e) {
	if (H === null) return;
	let t = H.view.zoom;
	e.zoom.value = String(t), e.zoom.setAttribute("aria-valuetext", `${Math.round(t * 100)}%`), e.zoom.style.setProperty("--ui-slider-fraction", String((t - 1) / 3)), Bx(e);
}
function Bx(e) {
	Ox || H === null || (Ox = !0, requestAnimationFrame(() => {
		if (Ox = !1, H === null) return;
		let t = e.frame.clientWidth, n = e.stage.clientWidth, r = e.stage.clientHeight, i = H.view, a = ex(H.source, i, t);
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
var Vx = {
	decodeAsync: async (e, t) => {
		let n = await Hx(e);
		if (n === null) return null;
		let r = n, i = ix(r, t);
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
		}, r, Tx));
	})
};
async function Hx(e) {
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
var Ux = "ui-image-input", Wx = "ui-image-input--multiple", Gx = "ui-image-input__surface", Kx = "ui-image-input__native", qx = "ui-image-input__picture", Jx = "ui-image-input__text", Yx = "ui-image-input__selection", Xx = "ui-image-input__selections", Zx = "ui-image-input__tiles", Qx = "ui-image-input__tile", $x = "ui-image-input__remove", eS = "ui-image-input__progress", tS = "SelectionId", nS = "--ui-image-progress", rS = "data-ui-image-preview", iS = "data-ui-image-dragging", aS = "data-ui-image-tiles", oS = class {
	root;
	validation;
	uploads;
	propertyPatchEngine;
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
		this.root = e.root ?? document, this.validation = e.validation, this.uploads = e.uploads ?? bb, this.propertyPatchEngine = e.propertyPatchEngine, this.dialogs = e.dialogs, this.cropImaging = e.cropImaging, this.applyAll(this.root.querySelectorAll(`.${Ux}`)), V(this.root, `.${Ux}`, {
			childList: !0,
			attributeFilter: [
				Rr,
				et,
				fi
			]
		}, (e) => {
			this.applyAll(e), this.releaseDetached();
		}), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			e.propertyName === tS && (e.value === null || e.value === void 0 || e.value === "") && this.clearAll(Ga(e.components, `.${Ux}`));
		}), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("click", (e) => this.handleRemoveClick(e), !0), this.root.addEventListener("error", (e) => cS(e.target), !0), this.root.addEventListener("change", (e) => void this.handleNativeChangeAsync(e), !0), this.root.addEventListener(hb, (e) => _b(e, {
			rootSelector: `.${Ux}`,
			nativeSelector: `.${Kx}`,
			pressed: (e) => e.querySelector(`.${Gx}`)
		})), this.root.addEventListener(ad, (e) => this.handleDraftDropped(e)), My({
			root: this.root,
			draggingAttribute: iS,
			resolveTarget: (e) => {
				let t = e.closest(`.${Gx}`), n = t?.closest(`.${Ux}`) ?? null, r = n === null ? Fy(this.root, e, `.${Ux}`) : null, i = n ?? r?.field ?? null, a = t ?? i?.querySelector(`.${Gx}`) ?? null;
				return i === null || a === null ? null : {
					host: i,
					mark: r?.component,
					accept: i.querySelector(`.${Kx}`)?.getAttribute("accept") ?? "",
					multiple: sS(i),
					refused: j(i) || k(a)
				};
			},
			onFiles: (e, t) => void (sS(e) ? this.takeManyAsync(e, t) : this.takeFileAsync(e, t[0]))
		});
	}
	applyAll(e) {
		for (let t of e) sS(t) ? this.reconcileShelf(t) : this.apply(t);
	}
	apply(e) {
		let t = e.querySelector(`.${qx}`);
		if (t === null) return;
		let n = e.getAttribute("data-ui-image-source") ?? "", r = this.previews.has(e);
		if (r && e.dataset.previewFor === n) return;
		let i = r && n.length > 0;
		this.dropPreview(e, i), t.getAttribute("src") !== (n.length === 0 ? null : n) && e.removeAttribute(ct), n.length === 0 ? t.removeAttribute("src") : t.getAttribute("src") !== n && t.setAttribute("src", n), t.hasAttribute("src") && t.complete && t.naturalWidth === 0 && e.setAttribute(ct, ""), i || _S(e, e.getAttribute("data-ui-image-caption") ?? bS(n)), yS(e, n.length > 0);
	}
	reconcileShelf(e) {
		let t = e.getAttribute(fi);
		if (this.seenKeys.get(e) === t) return;
		this.seenKeys.set(e, t);
		let n = this.published.get(e) ?? [], r = e.querySelector(`.${Xx}`);
		(r === null || this.propertyPatchEngine?.isHeldTarget(r) !== !0) && (n.length = 0);
		let i = t === null ? -1 : n.indexOf(t);
		if (i >= 0) {
			n.splice(0, i + 1);
			return;
		}
		n.length = 0;
		let a = fS(t);
		if (a === null) return;
		let o = this.shelves.get(e) ?? [];
		for (let t of [...o]) t.selectionId !== null && !a.has(t.selectionId) && this.dropTile(e, t);
		this.restoreTiles(e, o, a);
	}
	restoreTiles(e, t, n) {
		let r = e.querySelector(`.${Zx}`);
		if (r === null || n.size === 0) return;
		let i = /* @__PURE__ */ new Map();
		for (let e of t) e.selectionId !== null && i.set(e.selectionId, e);
		let a = [];
		for (let t of n) {
			let n = i.get(t);
			n === void 0 && (n = mS(t), this.fillStoredTileAsync(e, n, t)), a.push(n);
		}
		for (let e of t) e.selectionId === null && a.push(e);
		a.length === t.length && a.every((e, n) => t[n] === e) || (t.splice(0, t.length, ...a), this.shelves.set(e, t), r.replaceChildren(...t.map((e) => e.element)), lS(e, t));
	}
	async fillStoredTileAsync(e, t, n) {
		let r;
		try {
			r = await ub(n);
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
		hS(t.element, a, i === void 0 ? "" : db(i.fileId)), t.element.classList.remove(wi);
	}
	releaseDetached() {
		for (let e of this.holding) if (!e.isConnected) {
			this.holding.delete(e), this.dropPreview(e);
			for (let t of [...this.shelves.get(e) ?? []]) this.dropTile(e, t);
		}
	}
	clearAll(e) {
		for (let t of e) sS(t) || this.previews.get(t)?.landed !== !0 || (t.dataset.previewFor === (t.getAttribute("data-ui-image-source") ?? "") && this.dropPreview(t), this.apply(t));
	}
	handlePickClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Br}]`), n = t?.closest(`.${Ux}`) ?? null;
		t === null || n === null || j(n) || k(t) || n.querySelector(`.${Kx}`)?.click();
	}
	handleRemoveClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${$x}`), n = t?.closest(`.${Ux}`) ?? null;
		if (t === null || n === null || j(n) || k(n)) return;
		e.preventDefault(), e.stopPropagation();
		let r = this.shelves.get(n)?.find((e) => e.element === t.parentElement);
		r !== void 0 && (this.dropTile(n, r), this.publishShelf(n));
	}
	async handleNativeChangeAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Kx)) return;
		let t = e.target.closest(`.${Ux}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && n.length !== 0 && (sS(t) ? await this.takeManyAsync(t, n) : await this.takeFileAsync(t, n[0]));
	}
	handleDraftDropped(e) {
		if (e.target instanceof Element) for (let t of e.target.querySelectorAll(`.${Ux}`)) this.previews.has(t) && (this.dropPreview(t), this.apply(t), mb(t.querySelector(`.${Yx}`), ""));
	}
	async takeFileAsync(e, t) {
		this.releaseDetached();
		let n = e.querySelector(`.${Gx}`), r = e.querySelector(`.${qx}`), i = e.querySelector(`.${Yx}`);
		if (n === null || r === null) return;
		let a = await this.cropAsync(e, t);
		if (a === null || tb(e, [a], !1, this.validation).length === 0) return;
		this.dropPreview(e);
		let o = {
			url: URL.createObjectURL(a),
			landed: !1
		};
		this.previews.set(e, o), this.holding.add(e), e.dataset.previewFor = e.getAttribute("data-ui-image-source") ?? "", e.setAttribute(rS, ""), e.removeAttribute(ct), r.setAttribute("src", o.url), _S(e, a.name), yS(e, !0), n.classList.add(wi);
		let c = this.uploads.hold(e);
		try {
			let t = await cb([a], () => void 0);
			this.previews.get(e) === o && (o.landed = !0, mb(i, t.selectionId));
		} catch (t) {
			s("picture upload failed.", t), this.previews.get(e) === o && (vS(e), mb(i, ""));
		} finally {
			c(), (this.previews.get(e) === o || !this.previews.has(e)) && n.classList.remove(wi);
		}
	}
	async cropAsync(e, t) {
		let n = uS(e);
		if (n === null || this.dialogs === void 0) return t;
		if (this.cropping.has(e)) return null;
		this.cropping.add(e);
		try {
			let r = await kx(this.dialogs, t, {
				frame: n,
				size: dS(e)
			}, this.cropImaging);
			return r === "cancelled" || !e.isConnected ? null : r === "unreadable" ? (this.unreadable.add(e), this.validation?.mark(e, "error", { key: "ui.image.unreadable" }), null) : (this.unreadable.delete(e) && this.validation?.mark(e, null), r);
		} finally {
			this.cropping.delete(e);
		}
	}
	async takeManyAsync(e, t) {
		this.releaseDetached();
		let n = e.querySelector(`.${Zx}`), r = tb(e, t, !0, this.validation);
		if (n === null || r.length === 0) return;
		let i = this.shelves.get(e) ?? [];
		this.shelves.set(e, i), this.holding.add(e);
		let a = r.map(async (t) => {
			let r = pS(t), a = this.uploads.hold(e, r);
			i.push(r), n.appendChild(r.element);
			try {
				let n = await cb([t], (e) => r.element.style.setProperty(nS, `${e}%`));
				if (!i.includes(r)) return;
				r.selectionId = n.selectionId, r.element.classList.remove(wi), this.publishShelf(e);
			} catch (n) {
				if (s("picture upload failed.", n), !i.includes(r)) return;
				this.dropTile(e, r), sb(e, t.name, this.validation);
			} finally {
				a();
			}
		});
		lS(e, i), await Promise.all(a);
	}
	dropTile(e, t) {
		let n = this.shelves.get(e), r = n?.indexOf(t) ?? -1;
		n !== void 0 && r >= 0 && n.splice(r, 1), this.uploads.forget(e, t), t.url !== null && URL.revokeObjectURL(t.url), t.element.remove(), lS(e, n ?? []);
	}
	publishShelf(e) {
		let t = e.querySelector(`.${Xx}`), n = (this.shelves.get(e) ?? []).map((e) => e.selectionId).filter((e) => e !== null), r = JSON.stringify(n);
		if (t === null || t.getAttribute("data-ui-selected-keys") === r) return;
		let i = this.published.get(e) ?? [];
		i.push(r), this.published.set(e, i), t.setAttribute(fi, r), this.seenKeys.set(e, r), e.setAttribute(fi, r), t.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	dropPreview(e, t = !1) {
		let n = this.previews.get(e);
		n !== void 0 && (this.uploads.forget(e), URL.revokeObjectURL(n.url), this.previews.delete(e), delete e.dataset.previewFor, e.removeAttribute(rS), t || _S(e, ""));
	}
};
function sS(e) {
	return e.classList.contains(Wx);
}
function cS(e) {
	e instanceof Element && e.classList.contains(qx) && e.closest(`.${Ux}`)?.setAttribute(ct, "");
}
function lS(e, t) {
	e.hasAttribute(aS) !== t.length > 0 && e.toggleAttribute(aS, t.length > 0);
}
function uS(e) {
	let t = e.getAttribute(tt);
	return t === "square" || t === "circle" ? t : null;
}
function dS(e) {
	let t = Number(e.getAttribute(nt));
	return Number.isInteger(t) && t > 0 ? t : Yb;
}
function fS(e) {
	if (e === null) return /* @__PURE__ */ new Set();
	let t;
	try {
		t = JSON.parse(e);
	} catch {
		return null;
	}
	return Array.isArray(t) ? new Set(t.filter((e) => typeof e == "string")) : null;
}
function pS(e) {
	let t = document.createElement("span"), n = URL.createObjectURL(e);
	return t.className = `${Qx} ${wi}`, hS(t, e, n), {
		element: t,
		url: n,
		selectionId: null
	};
}
function mS(e) {
	let t = document.createElement("span"), n = document.createElement("button"), r = document.createElement("span");
	return t.className = `${Qx} ${wi}`, n.type = "button", n.className = $x, r.className = eS, O.write(n, "aria-label", "ui.file.remove"), t.append(n, r), {
		element: t,
		url: null,
		selectionId: e
	};
}
function hS(e, t, n) {
	let r = document.createElement("button"), i = document.createElement("span");
	if (r.type = "button", r.className = $x, i.className = eS, t.type.startsWith("image/")) {
		let a = document.createElement("img");
		a.src = n, a.alt = t.name, O.write(r, "aria-label", "ui.image.remove"), a.addEventListener("error", () => e.replaceChildren(...gS(e, r, t), r, i), { once: !0 }), e.replaceChildren(a, r, i);
	} else e.replaceChildren(...gS(e, r, t), r, i);
}
function gS(e, t, n) {
	return O.write(t, "aria-label", "ui.file.remove"), Gb(e, n, O.language);
}
function _S(e, t) {
	let n = e.querySelector(`.${Jx}`);
	n !== null && (il(n, null), n.textContent !== t && (n.textContent = t));
}
function vS(e) {
	let t = e.querySelector(`.${Jx}`);
	t !== null && O.write(t, null, "ui.file.failed");
}
function yS(e, t) {
	let n = e.querySelector(`.${Gx}`);
	n !== null && O.write(n, "aria-label", t ? "ui.image.change" : "ui.image.choose");
}
function bS(e) {
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
var xS = "ui-key-value-action__value", SS = "ui-key-value-action--editable", CS = "ui-text__title", wS = "ui-row-form-", TS = ":scope > :is(.ui-input--filled, .ui-input--tonal, .ui-input--outline, .ui-input--ghost, .ui-input--underline)", ES = class {
	options;
	root;
	openRows = /* @__PURE__ */ new WeakSet();
	closedRows = /* @__PURE__ */ new WeakSet();
	rowForms = /* @__PURE__ */ new WeakMap();
	formCount = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.handleRows(this.root.querySelectorAll(`.${Uu}`), !1), V(this.root, `.${Uu}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [Mr]
		}, (e) => this.handleRows(e, !0)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && jS(e.target) && e.preventDefault();
		}, !0), (this.root === document ? window : this.root).addEventListener("change", (e) => AS(e), !0);
	}
	handleRows(e, t) {
		for (let n of e) n.hasAttribute("data-ui-row-editing") ? (this.closedRows.delete(n), this.joinForm(n), DS(n), this.openRows.has(n) || (this.openRows.add(n), this.open(n, t), this.judge(n))) : this.closedRows.has(n) || (this.openRows.delete(n), this.closedRows.add(n), this.close(n));
	}
	joinForm(e) {
		let t = e.querySelector(`.${Gu} button`);
		if (t === null) return;
		let n = this.rowForms.get(e);
		n === void 0 && (n = `${wS}${++this.formCount}`, this.rowForms.set(e, n));
		for (let t of e.querySelectorAll(`.${Wu} [${Ze}]:not([${cn}])`)) t.setAttribute(cn, n);
		t.setAttribute(xi, n);
	}
	leaveForm(e) {
		let t = this.rowForms.get(e);
		if (t !== void 0) for (let n of e.querySelectorAll(`[${cn}="${t}"], [${xi}="${t}"]`)) n.removeAttribute(cn), n.removeAttribute(xi);
	}
	close(e) {
		this.leaveForm(e);
		for (let t of e.querySelectorAll(`.${Wu} [${Ze}]`)) {
			if (td(t)) {
				t.value = "";
				continue;
			}
			let e = this.options.dom.resolveNearestComponent(t, () => !0);
			this.options.propertyPatchEngine.restoreBoundValue(t, e?.dynamicParameters ?? []);
		}
		od(e), this.judge(e);
	}
	judge(e) {
		let t = kS(e);
		for (let n of e.querySelectorAll(`.${Wu} [${Ze}]`)) this.options.validation.judgeShown(n, td(n) && n.value.length === 0 ? t : null);
	}
	open(e, t) {
		let n = e.querySelector(`.${Wu} :is(input, textarea, select)`);
		if (n !== null) {
			if (td(n) && n.value.length === 0 && n.hasAttribute("data-ui-bind-value")) {
				let t = kS(e);
				t.length > 0 && (n.value = t, n.dispatchEvent(new Event("change", { bubbles: !0 })));
			}
			t && (n.focus({ preventScroll: !0 }), ed(n) && n.select());
		}
	}
	handleKeydown(e) {
		if (e.key === "F2" && !e.defaultPrevented && N(e)) {
			OS(e);
			return;
		}
		if (e.defaultPrevented || M(e) || !(e.target instanceof Element) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = Yu(e.target);
		if (t === null || e.key === "Enter" && t.cell.classList.contains("ui-key-value-action__edit-action")) return;
		let { cell: n, row: r } = t, i = e.target.closest(Mi), a = n.querySelector("[role='listbox']");
		if (i !== null && n.contains(i) || a !== null && a.getClientRects().length > 0 || e.key === "Enter" && e.target instanceof HTMLTextAreaElement) return;
		let o = r.querySelectorAll(`.${Gu} button`), s = e.key === "Enter" ? o[0] : o[o.length - 1];
		s !== void 0 && (e.preventDefault(), !k(s) && (e.key === "Enter" && e.target instanceof HTMLInputElement && (e.target.dispatchEvent(new Event("change", { bubbles: !0 })), s.focus({ preventScroll: !0 })), s.click()));
	}
};
function DS(e) {
	for (let t of e.querySelectorAll(`:scope > .${Wu}`)) {
		let e = t.querySelector(TS) !== null;
		t.hasAttribute("data-ui-boxed-editor") !== e && t.toggleAttribute(Nr, e);
	}
}
function OS(e) {
	let t = e.target instanceof Element ? e.target.closest(`.${Uu}`) : null, n = t === null || t.hasAttribute("data-ui-row-editing") || t.closest(`.${SS}`) === null ? null : t.querySelector(".ui-key-value-action__action")?.querySelector(yp) ?? null;
	n === null || k(n) || (e.preventDefault(), n.click());
}
function kS(e) {
	return e.querySelector(`.${xS} .${CS}`)?.textContent?.trim() ?? "";
}
function AS(e) {
	if (!e.isTrusted || !(e.target instanceof Element)) return;
	let t = e.target.closest(".ui-key-value-action__value-input")?.closest(".ui-key-value-action__row") ?? null;
	t !== null && !t.hasAttribute("data-ui-row-editing") && e.stopImmediatePropagation();
}
function jS(e) {
	let t = e.closest(`.${Gu} button`), n = t?.closest(`.${Gu}`)?.querySelectorAll("button");
	return t !== null && n !== void 0 && n[n.length - 1] === t;
}
var MS = `.ui-button[${Ht}="pressed"]`, NS = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(MS);
		t === null || k(t) || t.hasAttribute("data-ui-drawer-pin") || (t.setAttribute("aria-pressed", t.getAttribute("aria-pressed") === "true" ? "false" : "true"), t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, PS = `${cd}, [tabindex], [contenteditable], ${Mi}, [${$e}]`, FS = ":scope > input.ui-field, :scope > textarea.ui-field", IS = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("pointerdown", (e) => this.handlePointerDown(e));
	}
	handlePointerDown(e) {
		if (e.defaultPrevented || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(sd);
		if (t === null || e.target !== t && e.target.closest(PS) !== null) return;
		let n = t.querySelector(FS);
		if (!td(n) || n.readOnly || k(n) || j(n) || (e.preventDefault(), n.focus({ preventScroll: !0 }), n.selectionStart === null)) return;
		let r = n.value.length;
		n.setSelectionRange(r, r);
	}
}, LS = "data-ui-input-debounce", RS = `input[${LS}], textarea[${LS}]`;
function zS(e) {
	return (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.matches(RS);
}
var BS = /* @__PURE__ */ new Set();
function VS() {
	for (let e of BS) if (e.waiting) return !0;
	return !1;
}
function HS() {
	for (let e of BS) e.commitAll();
}
function US(e) {
	for (let t of BS) t.drop(e);
}
var WS = class {
	waits = /* @__PURE__ */ new Map();
	composing = /* @__PURE__ */ new WeakSet();
	constructor(e) {
		e.addEventListener("compositionstart", (e) => this.mark(e, !0), !0), e.addEventListener("compositionend", (e) => this.mark(e, !1), !0), BS.add(this);
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
}, GS = class {
	root;
	pauses;
	constructor(e = {}) {
		this.root = e.root ?? document, this.pauses = new WS(this.root), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("compositionend", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleChange(e), !0);
	}
	handleInput(e) {
		let t = e.target;
		if (!zS(t) || e.isComposing === !0) return;
		let n = Number(t.getAttribute(LS));
		this.pauses.wait(t, Number.isFinite(n) && n >= 0 ? n : 0, () => t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	handleChange(e) {
		zS(e.target) && this.pauses.drop(e.target);
	}
}, KS = "data-ui-submit-on-enter", qS = "data-ui-runs-on-enter", JS = "enter", YS = "escape", XS = {
	name: JS,
	registration: { settlesValue: !0 }
}, ZS = "ui-commit-in-place", QS = class {
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
		}, !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), this.root.addEventListener(ZS, (e) => {
			(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) && this.commitInPlace(e.target);
		}), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = this.focusedField;
			t !== null && !(e.local && this.edited.has(t)) && e.components.some((e) => e.contains(t)) && (this.lastCommitted = t.value);
		});
	}
	handleKeydown(e) {
		if (e.defaultPrevented || M(e) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = e.target;
		t instanceof HTMLTextAreaElement ? e.key === "Escape" ? (e.preventDefault(), Ju(t) ? this.runEscape(t, e) : this.leave(t)) : $S(t, e) ? (e.preventDefault(), this.runEnter(t, e)) : eC(t, e) && (e.preventDefault(), this.commitInPlace(t), this.submitForm(t)) : ed(t) && (e.preventDefault(), $S(t, e) ? this.runEnter(t, e) : e.key === "Escape" && Ju(t) ? this.runEscape(t, e) : (this.leave(t), e.key === "Enter" && this.submitForm(t)));
	}
	runEnter(e, t) {
		t.repeat || e.readOnly || k(e) || (this.commitInPlace(e), e.dispatchEvent(new Event(JS, { bubbles: !0 })));
	}
	runEscape(e, t) {
		if (t.repeat) return;
		US(e), this.edited.delete(e), e === this.focusedField && e.value !== this.lastCommitted && this.putBack(e, this.lastCommitted);
		let n = $p(e);
		e.blur(), em(e, n), e.dispatchEvent(new Event(YS, { bubbles: !0 }));
	}
	putBack(e, t) {
		this.propertyPatchEngine?.writeBoundValue(e, t), e.value !== t && (e.value = t);
	}
	submitForm(e) {
		let t = e.getAttribute(cn);
		if (t === null || t.length === 0) return;
		let n = this.root.querySelector(`[${xi}="${C(t)}"]`);
		n !== null && !k(n) && n.click();
	}
	leave(e) {
		let t = this.changes, n = $p(e);
		e.blur(), this.changes === t && this.commit(e), em(e, n);
	}
	commit(e) {
		e.value !== this.committedValue && e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	commitInPlace(e) {
		this.edited.has(e) ? e.dispatchEvent(new Event("change", { bubbles: !0 })) : this.commit(e);
	}
};
function $S(e, t) {
	return tC(t) && e.hasAttribute(qS);
}
function eC(e, t) {
	return tC(t) && e.hasAttribute(KS) && !e.readOnly && !k(e);
}
function tC(e) {
	return e.key === "Enter" && N(e);
}
//#endregion
//#region src/updates/icon-stand-in.ts
var nC = "icon-stand-in", rC = "ne-person", iC = "ne-image", aC = "ui-icon", oC = "ui-icon--circle", sC = "ui-icon--image", cC = "ui-icon-stand-in", lC = `:scope > .${cC}`, uC = `.${aC}.${oC}:not(.${cC}), .${aC}.${sC}:not(.${cC})`, dC = "missing", fC = "failed", pC = 512, mC = /* @__PURE__ */ new Map(), hC = /* @__PURE__ */ new Map();
function gC(e) {
	let t = e.getAttribute(lt), n = _C(e);
	return n === null ? e.removeAttribute(lt) : t !== n && e.setAttribute(lt, n), xC(e, n !== null, e.classList.contains(oC)), n === dC ? "show" : t === dC ? "release" : "keep";
}
function _C(e) {
	let t = e.classList.contains(oC);
	if (!e.className.split(" ").some(No)) return t ? dC : null;
	let n = e.classList.contains(sC) ? vC(e) : null;
	if (n === null) return null;
	let r = mC.get(n);
	return r === void 0 || !r.loaded && Date.now() - r.at >= 3e4 ? (yC(n, e), r === void 0 ? null : fC) : r.loaded ? null : fC;
}
function vC(e) {
	let t = e.style.getPropertyValue(Ao).trim();
	return t.startsWith("url(\"") && t.endsWith("\")") ? t.slice(5, -2) : null;
}
function yC(e, t) {
	let n = hC.get(e);
	if (n !== void 0) {
		n.add(t);
		return;
	}
	hC.set(e, /* @__PURE__ */ new Set([t]));
	let r = new Image();
	r.addEventListener("load", () => bC(e, !0)), r.addEventListener("error", () => bC(e, !1)), r.src = e;
}
function bC(e, t) {
	let n = hC.get(e);
	mC.delete(e), mC.set(e, {
		loaded: t,
		at: Date.now()
	}), hC.delete(e), mC.size > pC && mC.delete(mC.keys().next().value);
	for (let e of n ?? []) gC(e);
}
function xC(e, t, n) {
	let r = e.querySelector(lC);
	if (!t) {
		r?.remove();
		return;
	}
	let i = e.getAttribute(st), a = i !== null && Po(i).length > 0 ? i : n ? rC : iC;
	if (r === null) r = document.createElement("span"), r.setAttribute("aria-hidden", "true"), e.appendChild(r);
	else if (r.classList.contains(Po(a))) return;
	jo(r, a), r.classList.add(cC);
}
//#endregion
//#region src/interactions/image-fallback-engine.ts
var SC = `.${rt}`, CC = `img.${it}`, wC = `:scope > ${CC}`, TC = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'/%3E", EC = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'/%3E", DC = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("error", (e) => this.handleError(e), !0);
		for (let e of this.root.querySelectorAll(CC)) (AC(e) || e.complete && e.naturalWidth === 0) && MC(e);
		for (let e of this.root.querySelectorAll(uC)) gC(e);
		V(this.root, `${SC}, ${uC}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: ["src", "class"],
			relevant: OC
		}, (e) => {
			for (let t of e) t.classList.contains("ui-image") ? kC(t) : gC(t);
		});
	}
	handleError(e) {
		let t = e.target;
		t instanceof HTMLImageElement && t.matches(CC) && MC(t);
	}
};
function OC(e) {
	if (e.type === "childList") return !0;
	let t = e.target;
	return t instanceof Element && (e.attributeName === "src" ? t.matches(CC) : t.matches(SC));
}
function kC(e) {
	let t = e.querySelector(wC);
	t !== null && (e.hasAttribute("data-ui-image-failed") && (jC(t) ? t.getAttribute("src") !== PC(e) && NC(e, t) : (e.removeAttribute(ct), xC(e, !1, !1))), AC(t) && MC(t));
}
function AC(e) {
	let t = e.getAttribute("src");
	return t === null || t.trim().length === 0;
}
function jC(e) {
	let t = e.getAttribute("src");
	return t === EC || t === TC;
}
function MC(e) {
	if (jC(e)) return;
	let t = e.getAttribute(ot);
	if (t !== null && t.length > 0 && e.getAttribute("src") !== t) {
		e.setAttribute("src", t);
		return;
	}
	let n = e.parentElement;
	n !== null && n.classList.contains("ui-image") && (n.setAttribute(ct, ""), NC(n, e));
}
function NC(e, t) {
	t.setAttribute("src", PC(e)), xC(e, !0, e.classList.contains(at));
}
function PC(e) {
	return e.classList.contains("ui-image--circle") ? TC : EC;
}
//#endregion
//#region src/items/radio-row-decorator.ts
var FC = "ui-radio-group__input", IC = "ui-radio-group__dot", LC = {
	kind: "radio",
	decorate: RC
};
function RC(e) {
	let t = document.createElement("input");
	t.className = FC, t.type = "radio", t.value = e.key;
	let n = document.createElement("span");
	n.className = IC, e.row.prepend(t, n);
}
//#endregion
//#region src/interactions/radio-group-sync-engine.ts
var zC = "data-ui-radio-value", BC = "ui-radio-group", VC = "ui-radio-group__item", HC = "data-ui-radio-group-name", UC = "data-ui-radio-bind-value-id", WC = class {
	root;
	renamed = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.claimGroupNames([...this.root.querySelectorAll(`.${BC}`)]);
		for (let e of this.root.querySelectorAll(`.${BC}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = [];
			for (let n of e) if (n.type === "attributes" && n.target instanceof HTMLElement) this.sync(n.target.closest(`.${BC}`));
			else if (!Ng(n)) for (let e of n.addedNodes) e instanceof HTMLElement && t.push(e);
			this.claimGroupNames(t.flatMap(GC));
			for (let e of new Set(t.map((e) => e.closest(`.${BC}`)))) this.sync(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: [zC, "class"],
			childList: !0,
			subtree: !0
		});
	}
	claimGroupNames(e) {
		if (e.length === 0) return;
		let t = /* @__PURE__ */ new Map();
		for (let e of this.root.querySelectorAll(`.${BC}`)) {
			let n = e.getAttribute(HC);
			n !== null && t.set(n, (t.get(n) ?? 0) + 1);
		}
		let n = /* @__PURE__ */ new Set();
		for (let r of e) {
			let e = r.getAttribute(HC), i = e === null ? 0 : t.get(e) ?? 0;
			if (e === null || i < 2) continue;
			t.set(e, i - 1), n.add(e);
			let a = `${e}-${++this.renamed}`;
			r.setAttribute(HC, a);
			for (let e of Rd(r, `.${FC}`, `.${BC}`)) e.name = a;
			this.sync(r);
		}
		if (n.size !== 0) for (let e of this.root.querySelectorAll(`.${BC}`)) n.has(e.getAttribute(HC) ?? "") && this.sync(e);
	}
	sync(e) {
		if (e === null) return;
		let t = e.getAttribute(zC), n = e.getAttribute(HC), r = e.getAttribute(UC);
		for (let i of Rd(e, `.${FC}`, `.${BC}`)) {
			n !== null && i.name !== n && (i.name = n), r !== null && i.getAttribute("data-ui-bind-value") !== r && i.setAttribute(Ze, r), i.checked = i.value === t;
			let e = KC(i);
			i.disabled !== e && (i.disabled = e);
		}
	}
};
function GC(e) {
	return e.classList.contains(BC) ? [e] : [...e.querySelectorAll(`.${BC}`)];
}
function KC(e) {
	let t = e.closest(`.${VC}`);
	return t !== null && A(t);
}
//#endregion
//#region src/rendering/color-bytes.ts
function qC(e) {
	return Number.isFinite(e) ? Math.min(255, Math.max(0, Math.round(e))) : 0;
}
function JC(e) {
	return qC(e).toString(16).padStart(2, "0").toUpperCase();
}
function YC(e, t, n, r) {
	let i = r / 255, a = (e) => Math.round(e * i + 255 * (1 - i));
	return (XC(a(e), a(t), a(n)) + .05) ** 2 > 1.05 * .05 ? "var(--ui-color-on-light)" : "var(--ui-color-on-dark)";
}
function XC(e, t, n) {
	return .2126 * ZC(e) + .7152 * ZC(t) + .0722 * ZC(n);
}
function ZC(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
//#endregion
//#region src/rendering/web-dom-converters.ts
var QC = "inlineMarkupPlainText", $C = /* @__PURE__ */ new Map([
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
]), ew = [
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
function tw(e) {
	return W(e, ew);
}
var nw = [
	"small",
	"medium",
	"large"
], rw = ["default", "circle"], iw = [
	"display",
	"title",
	"subtitle",
	"body",
	"caption",
	"overline"
], aw = [
	"start",
	"center",
	"end",
	"justify"
], ow = ["nowrap", "wrap"], sw = /* @__PURE__ */ new Map([
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
]), cw = /* @__PURE__ */ new Map([
	["primary", "--ui-color-primary-ink"],
	["accent", "--ui-color-accent-ink"],
	["info", "--ui-color-info-ink"],
	["warning", "--ui-color-warning-ink"],
	["success", "--ui-color-success-ink"],
	["danger", "--ui-color-danger-ink"]
]), lw = /* @__PURE__ */ new Map([
	["primary", "--ui-color-on-primary"],
	["accent", "--ui-color-on-accent"],
	["info", "--ui-color-on-info"],
	["warning", "--ui-color-on-warning"],
	["success", "--ui-color-on-success"],
	["danger", "--ui-color-on-danger"],
	["muted", "--ui-color-surface"]
]), uw = ["inline", "trailing"], dw = [
	"none",
	"left",
	"top",
	"right",
	"bottom"
], fw = [
	"filled",
	"outline",
	"underline",
	"ghost",
	"tonal"
], pw = [
	"small",
	"medium",
	"large"
], mw = [
	"small",
	"medium",
	"large"
], hw = [
	"primary",
	"accent",
	"danger",
	"outline",
	"ghost",
	"link",
	"surface"
], gw = [
	"primary",
	"accent",
	"info",
	"warning",
	"success",
	"danger",
	"surface",
	"plain"
], _w = [
	"filled",
	"tinted",
	"outline"
], vw = ["light", "dark"], yw = [
	"start",
	"center",
	"end",
	"stretch"
], bw = ["clip", "visible"], xw = [
	"visible",
	"hidden",
	"collapsed"
], Sw = [
	"background",
	"raised",
	"tinted",
	"flat"
], Cw = ["horizontal", "vertical"], ww = [
	"none",
	"gap",
	"rule"
], Tw = [
	"none",
	"one",
	"many"
], Ew = [
	"none",
	"left",
	"right",
	"top",
	"bottom"
], Dw = ["stack", "wrap"], Ow = ["end", "start"], kw = [
	"disabled",
	"auto",
	"always"
], Aw = [
	"disabled",
	"proximity",
	"mandatory"
], jw = [
	"text",
	"email",
	"password",
	"search",
	"tel",
	"url"
], Mw = [
	"text",
	"numeric",
	"decimal",
	"tel",
	"email",
	"url",
	"search"
], Nw = ["hex", "rgb"], Pw = ["field", "swatch"], Fw = [
	"fill",
	"contain",
	"cover",
	"none"
], Iw = [
	"100% 100%",
	"contain",
	"cover",
	"auto"
], Lw = ["default", "circle"], Rw = ["card", "quiet"], zw = ["uniform", "vignette"], Bw = ["linear", "circular"], Vw = [
	"none",
	"vertical",
	"horizontal",
	"both"
], Hw = [
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
], Uw = [
	"None",
	"Shade",
	"Tint"
], Ww = /* @__PURE__ */ new Map();
function Gw(e) {
	return Ww.get(e);
}
function U(e, t, n) {
	return Jw(e, Kw(t, n), (e) => `${t}${W(e, n)}`);
}
function Kw(e, t) {
	return qw(t.map((t) => `${e}${t}`));
}
function qw(e) {
	let t = new Set(e);
	return (e) => t.has(e);
}
function Jw(e, t, n) {
	return Ww.set(e, t), [e, n];
}
function Yw(e, t, n) {
	return yh.map((r) => [`${e}${r[0].toUpperCase()}${r.slice(1)}${t}`, (e) => n(e, r)]);
}
var Xw = new Map([
	U("colorClass", "ui-color--", ew),
	Jw("themeColorClass", Kw("ui-color--", ew), (e) => FT(e)),
	Jw("iconClass", No, (e) => Po(e)),
	["iconUrlCss", (e) => Eo(e)],
	["safeUrl", (e) => fo(e)],
	["safeImageSource", (e) => xo(e)],
	[QC, (e) => e == null ? void 0 : qo(String(e))],
	["ariaBooleanAttribute", (e) => e === !0 ? "true" : "false"],
	["placeholderText", (e) => typeof e == "string" && e.length > 0 ? e : " "],
	U("iconSizeClass", "ui-icon-size--", nw),
	["iconSizeAttribute", (e) => W(e, nw)],
	Jw("iconShapeClass", qw(["ui-icon--circle"]), (e) => W(e, rw) === "circle" ? "ui-icon--circle" : ""),
	U("textTypeClass", "ui-text-type--", iw),
	Jw("textAppearanceClass", Kw("ui-text-type--", iw), (e) => GT(e, "ui-text-type--")),
	Jw("textDescriptionTypeClass", Kw("ui-text--description-", iw), (e) => GT(e, "ui-text--description-")),
	U("textAlignmentClass", "ui-text--align-", aw),
	U("textWrapClass", "ui-text--", ow),
	U("buttonAlignmentClass", "ui-button--align-", aw),
	U("textBadgePlacementHostClass", "ui-text--badge-", uw),
	U("badgeStyleClass", "ui-badge-style--", gw),
	U("badgeFillClass", "ui-badge-fill--", _w),
	Jw("badgeColoredClass", qw(["ui-badge--colored"]), (e) => ET(e).length > 0 ? "ui-badge--colored" : ""),
	["badgeTextFit", (e) => IT(e)],
	U("buttonClass", "ui-button--", hw),
	U("surfaceStyleClass", "ui-surface--", Sw),
	U("orientationClass", "ui-orientation--", Cw),
	U("groupSeparatorClass", "ui-command-bar--separator-", ww),
	["selectionModeAttribute", (e) => W(e, Tw)],
	["selectionBackgroundCss", (e) => ET(CT(e, "background"))],
	["selectionForegroundCss", (e) => ET(CT(e, "foreground"))],
	["selectionMarkColorCss", (e) => ET(CT(e, "markColor"))],
	["selectionMarkCss", (e) => TT(CT(e, "mark"))],
	["selectionFontWeightCss", (e) => wT(CT(e, "bold"))],
	["selectionActionBarBackgroundCss", (e) => ET(CT(e, "actionBarBackground"))],
	U("itemsViewLayoutClass", "ui-items-view--", Dw),
	U("dragHandlePlacementClass", "ui-drag-handle--", Ow),
	U("scrollXClass", "ui-scroll-x--", kw),
	U("scrollYClass", "ui-scroll-y--", kw),
	["hostViewport", (e) => dT(e)],
	U("scrollSnapClass", "ui-scroll-snap--", Aw),
	U("inputAppearanceClass", "ui-input--", fw),
	U("inputSizeClass", "ui-input--", mw),
	U("buttonSizeClass", "ui-button--", pw),
	U("buttonGroupSizeClass", "ui-button-group--", pw),
	["textInputTypeAttribute", (e) => W(e, jw)],
	["inputModeAttribute", (e) => W(e, Mw)],
	["colorTextFormatAttribute", (e) => W(e, Nw)],
	["colorInputVariantAttribute", (e) => W(e, Pw)],
	["themeNameCss", (e) => W(e, vw)],
	["alignmentCss", (e) => W(e, yw)],
	["alignmentStretchFallbackCss", (e) => W(e, yw) === "stretch" ? "start" : ""],
	["overflowCss", (e) => W(e, bw)],
	["layoutLengthCss", (e) => fT(e)],
	["thicknessCss", (e) => hT(e)],
	Jw("borderEdgeClass", Kw("ui-border--", dw), (e) => {
		let t = vT(e);
		return t === void 0 ? "" : `ui-border--${t}`;
	}),
	["radiusCss", (e) => yT(e)],
	["gridUnitCss", (e) => bT(e)],
	["pixelsCss", (e) => tE(e)],
	["gridTemplateCss", (e) => xT(e)],
	["colorVariantCss", (e) => YT(e)],
	["themeColorCss", (e) => ET(e)],
	["themeInkCss", (e) => OT(e)],
	["roleInkCss", (e) => kT(e)],
	["themeOnColorCss", (e) => jT(e)],
	["themeGroundCss", (e) => MT(e)],
	["themeColorInlineCss", (e) => DT(e) ? "" : ET(e)],
	["themeColorCanonical", (e) => qT(e)],
	["textAppearanceFontSizeCss", (e) => KT(e, "size")],
	["textAppearanceFontWeightCss", (e) => KT(e, "weight")],
	["textAppearanceLineHeightCss", (e) => KT(e, "lineHeight")],
	["textAppearanceLetterSpacingCss", (e) => KT(e, "letterSpacing")],
	...Yw("responsiveLayoutLength", "Css", (e, t) => fT(Oh(e, t))),
	...Yw("responsiveWidth", "Css", (e, t) => pT(Oh(e, t), "horizontal")),
	...Yw("responsiveHeight", "Css", (e, t) => pT(Oh(e, t), "vertical")),
	...Yw("responsiveThickness", "Css", (e, t) => hT(Oh(e, t))),
	...Yw("responsivePadding", "Css", (e, t) => gT(Oh(e, t))),
	...Yw("responsiveThicknessHorizontal", "Css", (e, t) => _T(Oh(e, t), "horizontal")),
	...Yw("responsiveThicknessVertical", "Css", (e, t) => _T(Oh(e, t), "vertical")),
	...Yw("responsiveRadius", "Css", (e, t) => yT(Oh(e, t))),
	...Yw("responsivePixels", "Css", (e, t) => nE(Oh(e, t))),
	...Yw("visibility", "Attribute", (e, t) => rE(e, t)),
	...Yw("gridPlacement", "ColumnCss", (e, t) => ST(Oh(e, t), "column")),
	...Yw("gridPlacement", "RowCss", (e, t) => ST(Oh(e, t), "row")),
	...Yw("gridPlacement", "ColumnSpanCss", (e, t) => ST(Oh(e, t), "columnSpan")),
	...Yw("gridPlacement", "RowSpanCss", (e, t) => ST(Oh(e, t), "rowSpan")),
	U("imageFitClass", "ui-image-fit--", Fw),
	Jw("expanderVariantClass", qw(["ui-expander--quiet"]), (e) => W(e, Rw) === "quiet" ? "ui-expander--quiet" : ""),
	Jw("imageShapeClass", qw(["ui-image--circle"]), (e) => W(e, Lw) === "circle" ? "ui-image--circle" : ""),
	["backgroundImageCss", (e) => tT(e)],
	["backgroundImageAttribute", (e) => tT(e).length === 0 ? void 0 : ""],
	["imageFitSizeCss", (e) => W(e, Iw)],
	["backgroundImageDimCss", (e) => nT(e)],
	["backgroundImageDimModeAttribute", (e) => W(e, zw) === "vignette" ? "vignette" : void 0],
	["backgroundImageBlurCss", (e) => oT(e) ? `${Number(e)}px` : ""],
	["backgroundImageBlurAttribute", (e) => oT(e) ? "" : void 0],
	["positiveCount", (e) => rT(e)?.toString()],
	["nonNegativeCount", (e) => iT(e, (e) => e >= 0)?.toString()],
	["nonZeroCount", (e) => iT(e, (e) => e !== 0)?.toString()],
	["positiveNumber", (e) => aT(e, (e) => e > 0)?.toString()],
	["nonNegativeNumber", (e) => aT(e, (e) => e >= 0)?.toString()],
	["share", (e) => aT(e, (e) => e >= 0 && e <= 1)?.toString()],
	["positiveFlagAttribute", (e) => rT(e) === void 0 ? void 0 : ""],
	Jw("maxLinesClass", qw(["ui-text--max-lines"]), (e) => rT(e) === void 0 ? "" : "ui-text--max-lines"),
	Jw("textAreaGrowClass", qw(["ui-text-area--grow"]), (e) => rT(e) === void 0 ? "" : "ui-text-area--grow"),
	U("progressVariantClass", "ui-progress--", Bw),
	["progressValueText", (e) => eE(e)],
	["textAreaResizeCss", (e) => W(e, Vw)],
	U("flyoutPlacementClass", "ui-flyout--", Hw),
	["popupPlacementAttribute", (e) => W(e, Hw)],
	["tabMenuEntriesAttribute", (e) => $w(e)],
	["markedDaysAttribute", (e) => eT(e)]
]);
function Zw(e) {
	let t = Xw.get("surfaceStyleClass");
	return Sw.find((n, r) => e.classList.contains(t?.(r) ?? "")) ?? null;
}
var Qw = [
	["rename", 1],
	["pin", 2],
	["close", 4],
	["delete", 8]
];
function $w(e) {
	let t = typeof e == "string" ? e.split(",").map((e) => e.trim().toLowerCase()) : null, n = typeof e == "number" ? e : 0, r = Qw.filter(([e, r]) => t === null ? (n & r) !== 0 : t.includes(e)).map(([e]) => e);
	return r.length === 0 ? void 0 : r.join(" ");
}
function eT(e) {
	let t = Array.isArray(e) ? e.filter((e) => typeof e == "string" && e.length > 0).map((e) => e.slice(0, 10)) : [];
	return t.length === 0 ? void 0 : [...new Set(t)].sort().join(" ");
}
function tT(e) {
	return Eo(e);
}
function nT(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isNaN(t) ? "" : String(Math.min(1, Math.max(0, t)));
}
function rT(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isInteger(t) && t > 0 ? t : void 0;
}
function iT(e, t) {
	let n = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isInteger(n) && t(n) ? n : void 0;
}
function aT(e, t) {
	let n = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isFinite(n) && t(n) ? n : void 0;
}
function oT(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isFinite(t) && t > 0;
}
var sT = [
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
], cT = new Map(sT.map(([, e, t, n, r]) => [e, [
	t,
	n,
	r
]])), lT = new Map(sT.map(([e, t]) => [e, t])), uT = /* @__PURE__ */ new Map([[bw, /* @__PURE__ */ new Map([["Hidden", "clip"]])], [Iw, /* @__PURE__ */ new Map([["Fill", "100% 100%"], ["None", "auto"]])]]);
function W(e, t) {
	return typeof e == "string" ? (t === void 0 ? void 0 : uT.get(t)?.get(e)) ?? $C.get(e) ?? $i(e) : typeof e == "number" && t !== void 0 ? t[e] ?? String(e) : String(e ?? "");
}
function dT(e) {
	return e == null || W(e, kw) === "disabled" ? void 0 : "parent";
}
function fT(e) {
	if (e == null) return "";
	if (typeof e == "number") return tE(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.kind, r = t.value ?? 0;
	return n === "Auto" || n === 0 ? "" : n === "Absolute" || n === 1 ? tE(r) : n === "Fill" || n === 2 ? "100%" : "";
}
function pT(e, t) {
	if (typeof e != "object" || !e) return fT(e);
	let n = e.kind;
	return n !== "Fill" && n !== 2 ? fT(e) : t === "horizontal" ? "var(--ui-fill-width, 100%)" : "var(--ui-fill-height, 100%)";
}
function mT(e) {
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
function hT(e) {
	if (e == null) return "";
	let t = mT(e);
	return t === void 0 ? String(e) : `${t.top}px ${t.right}px ${t.bottom}px ${t.left}px`;
}
function gT(e) {
	let t = e == null ? void 0 : mT(e);
	return t === void 0 ? "" : `${t.top}px max(${t.right}px, var(--ui-scroll-room-right), var(--ui-scroll-cap)) max(${t.bottom}px, var(--ui-scroll-room-x)) max(${t.left}px, var(--ui-scroll-room-left), var(--ui-scroll-cap))`;
}
function _T(e, t) {
	let n = mT(e);
	return n === void 0 ? "" : tE(t === "horizontal" ? n.left + n.right : n.top + n.bottom);
}
function vT(e) {
	if (e == null) return;
	if (typeof e == "object" && "base" in e) {
		let t = yh.map((t) => Oh(e, t)).filter((e) => e != null), n = new Set(t.map((e) => vT(e)));
		return n.size === 0 ? "none" : n.size === 1 ? [...n][0] : void 0;
	}
	let t = mT(e);
	if (t === void 0) return;
	let { top: n, right: r, bottom: i, left: a } = t;
	return n === 0 && r === 0 && i === 0 && a === 0 ? "none" : n === 0 && r === 0 && i === 0 ? "left" : a === 0 && r === 0 && i === 0 ? "top" : a === 0 && n === 0 && i === 0 ? "right" : a === 0 && n === 0 && r === 0 ? "bottom" : void 0;
}
function yT(e) {
	if (e == null) return "";
	if (typeof e == "number") return tE(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.topLeft ?? 0, r = t.topRight ?? 0, i = t.bottomRight ?? 0, a = t.bottomLeft ?? 0;
	return n === r && n === i && n === a ? tE(n) : `${n}px ${r}px ${i}px ${a}px`;
}
function bT(e) {
	if (e == null) return "";
	if (typeof e == "number") return e <= 0 ? "minmax(0, 1fr)" : `minmax(0, ${e}fr)`;
	if (typeof e != "object") return String(e);
	let t = e, n = t.unit, r = t.value ?? 1, i = t.minValue, a = t.maxValue;
	if (n === "Absolute" || n === 1) return tE(r);
	if (n === "Star" || n === 0) {
		let e = i != null && i > 0 ? `${i}px` : "0";
		return r <= 0 ? `minmax(${e}, 1fr)` : `minmax(${e}, ${r}fr)`;
	}
	return n === "Auto" || n === 2 ? i == null ? a == null ? "auto" : `fit-content(${a}px)` : `minmax(${i}px, auto)` : "";
}
function xT(e) {
	if (e == null) return "";
	if (!Array.isArray(e)) return bT(e);
	if (e.length === 0) return "none";
	if (e.length === 1) return bT(e[0]);
	let t = JSON.stringify(e[0]);
	return e.every((e) => JSON.stringify(e) === t) ? `repeat(${e.length}, ${bT(e[0])})` : e.map((e) => bT(e)).join(" ");
}
function ST(e, t) {
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
function CT(e, t) {
	return typeof e != "object" || !e ? null : e[t] ?? null;
}
function wT(e) {
	return e == null ? "" : e === !0 ? "600" : "400";
}
function TT(e) {
	if (e == null) return "";
	switch (W(e, Ew)) {
		case "left": return "inset 2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "right": return "inset -2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "top": return "inset 0 2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "bottom": return "inset 0 -2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		default: return "none";
	}
}
function ET(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	if (JT(e)) return YT(e);
	let t = e, n = YT(t.light), r = YT(t.dark), i = n.length > 0 ? n : r, a = r.length > 0 ? r : n;
	if (i.length > 0 && a.length > 0) return i === a ? i : `light-dark(${i}, ${a})`;
	let o = t.style;
	if (o == null) return "";
	let s = sw.get(W(o, ew));
	return s ? `var(${s})` : "";
}
function DT(e) {
	if (typeof e != "object" || !e || JT(e)) return !1;
	let t = e;
	return t.light == null && t.dark == null && t.style != null;
}
function OT(e) {
	if (DT(e)) {
		let t = cw.get(W(e.style, ew));
		if (t !== void 0) return `var(${t})`;
	}
	return ET(e);
}
function kT(e) {
	if (typeof e != "object" || !e || JT(e)) return "";
	let t = e;
	return t.light == null && t.dark == null ? OT(e) : "";
}
var AT = /* @__PURE__ */ new Set(["background", "surface"]);
function jT(e) {
	if (typeof e != "object" || !e) return "";
	if (JT(e)) return NT(e) ? "initial" : PT(e);
	let t = e, n = PT(t.light ?? t.dark), r = PT(t.dark ?? t.light);
	if (n.length > 0 && r.length > 0 && NT(t.light ?? t.dark) && NT(t.dark ?? t.light)) return "initial";
	if (n.length > 0 && r.length > 0) return n === r ? n : `light-dark(${n}, ${r})`;
	if (t.style === null || t.style === void 0) return "";
	let i = W(t.style, ew);
	if (AT.has(i)) return "initial";
	let a = lw.get(i);
	return a ? `var(${a})` : "";
}
function MT(e) {
	if (typeof e == "object" && e) {
		let t = e;
		if (JT(e) ? NT(e) : NT(t.light ?? t.dark) && NT(t.dark ?? t.light)) return "inherit";
	}
	return ET(e);
}
function NT(e) {
	return XT(e)?.[3] === 0;
}
function PT(e) {
	let t = XT(e);
	return t === void 0 ? "" : YC(t[0], t[1], t[2], t[3]);
}
function FT(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.light != null || t.dark != null) return "";
	let n = t.style;
	return n == null ? "" : `ui-color--${W(n, ew)}`;
}
function IT(e) {
	let t = BT(e == null ? "" : String(e).trim(), LT + 1);
	return t > 0 && t <= LT ? "compact" : "";
}
var LT = 2, RT = /[\u0300-\uFFFF]/, zT = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function BT(e, t) {
	if (!RT.test(e)) return e.length;
	let n = 0;
	for (let { segment: r } of zT.segment(e)) {
		if (n >= t) break;
		n += VT(r) ? 2 : 1;
	}
	return n;
}
function VT(e) {
	if (e.includes("️")) return !0;
	let t = e.codePointAt(0) ?? 0;
	for (let e = 0; e < HT.length; e += 2) if (t >= HT[e] && t <= HT[e + 1]) return !0;
	return !1;
}
var HT = [
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
function UT(e, t) {
	WT(e, String(t));
}
function WT(e, t) {
	let n = e.querySelector(".ui-badge__text");
	n !== null && (n.textContent = t), e.setAttribute(We, IT(t)), e.setAttribute(Ge, "");
}
function GT(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size != null) return "";
	let r = n.role;
	return r == null ? "" : `${t}${W(r, iw)}`;
}
function KT(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size == null) return "";
	switch (t) {
		case "size": return tE(n.size);
		case "weight": {
			let e = n.weight;
			return e == null ? "" : String(e);
		}
		case "lineHeight": {
			let e = n.lineHeight;
			return e == null ? "" : tE(e);
		}
		case "letterSpacing": {
			let e = n.letterSpacing;
			return e == null ? "" : tE(e);
		}
		default: return "";
	}
}
function qT(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return "";
	let t = e, n = ZT(t.style);
	if (n !== null) return `@${n}`;
	let r = t.light ?? t.dark;
	if (r == null) return "";
	if (typeof r.rgb == "number") {
		let e = r.opacity ?? 255, t = `#${JC(r.rgb >> 16 & 255)}${JC(r.rgb >> 8 & 255)}${JC(r.rgb & 255)}`;
		return e === 255 ? t : `${t}${JC(e)}`;
	}
	let i = QT(r.name);
	return i === null ? "" : `${i}/${$T(r.adjustment) ?? "None"}/${r.factor ?? 0}/${r.opacity ?? 255}`;
}
function JT(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.name !== void 0 || t.rgb !== void 0;
}
function YT(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	let t = XT(e);
	return t === void 0 ? "" : `#${JC(t[0])}${JC(t[1])}${JC(t[2])}${JC(t[3])}`;
}
function XT(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = typeof t.rgb == "number" ? [
		t.rgb >> 16 & 255,
		t.rgb >> 8 & 255,
		t.rgb & 255
	] : void 0, r = QT(t.name), i = n ?? (r === null ? void 0 : cT.get(r));
	if (!i) return;
	let a = $T(t.adjustment), o = (t.factor ?? 0) / 10, s = t.opacity ?? 255, [c, l, u] = i;
	return a === "Shade" ? (c = qC(c * (1 - o)), l = qC(l * (1 - o)), u = qC(u * (1 - o))) : a === "Tint" && (c = qC(c + (255 - c) * o), l = qC(l + (255 - l) * o), u = qC(u + (255 - u) * o)), [
		c,
		l,
		u,
		s
	];
}
function ZT(e) {
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	if (typeof e != "number") return null;
	let t = ew[e];
	return t === void 0 ? null : t.split("-").map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join("");
}
function QT(e) {
	if (typeof e == "number") return lT.get(e) ?? null;
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	return null;
}
function $T(e) {
	if (typeof e == "number") return Uw[e] ?? "None";
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? "None" : t;
	}
	return "None";
}
function eE(e) {
	if (e == null || e === "") return "";
	let t = typeof e == "number" ? e : Number(e);
	return Number.isFinite(t) ? String(t) : "";
}
function tE(e) {
	return `${typeof e == "number" ? e : Number(e ?? 0)}px`;
}
function nE(e) {
	return e == null ? "" : tE(e);
}
function rE(e, t) {
	let n = kh(e, t);
	if (n == null) return;
	let r = W(n, xw);
	return r === "visible" ? void 0 : r;
}
//#endregion
//#region src/interactions/search-input-engine.ts
var iE = "data-ui-search-debounce", aE = "data-ui-search-min-length", oE = "data-ui-search-manual", sE = "data-ui-search-answered", cE = "ui-search__input", lE = "ui-select__list", uE = "ui-select__option", dE = 300, fE = "data-ui-search-waiting", pE = "ui-search__field", mE = /* @__PURE__ */ new WeakMap(), hE = {
	name: "search",
	registration: {
		started: (e) => gE(e.domEvent.target),
		completed: (e) => _E(e.domEvent.target)
	}
};
function gE(e) {
	if (!(e instanceof Element)) return;
	let t = mE.get(e) ?? {
		asked: 0,
		timer: null
	};
	mE.set(e, t), !(t.asked++ > 0) && (vE(e)?.setAttribute("aria-busy", "true"), t.timer = window.setTimeout(() => {
		t.timer = null, e.closest(`.${pE}`)?.setAttribute(fE, "");
	}, 300));
}
function _E(e) {
	if (!(e instanceof Element)) return;
	let t = mE.get(e);
	t === void 0 || --t.asked > 0 || (mE.delete(e), t.timer !== null && window.clearTimeout(t.timer), vE(e)?.removeAttribute("aria-busy"), e.closest(`.${pE}`)?.removeAttribute(fE));
}
function vE(e) {
	return e.closest(".ui-select")?.querySelector(`.${lE}`) ?? null;
}
var yE = class {
	root;
	pauses;
	constructor(e = {}) {
		this.root = e.root ?? document, this.pauses = new WS(this.root), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("compositionend", (e) => this.handleInput(e), !0), this.root.addEventListener("keydown", (e) => this.handleEnter(e), !0);
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(cE) || e.isComposing === !0) return;
		let t = e.target;
		xE(t);
		let n = t.getAttribute(iE), r = n === null ? dE : Number(n);
		this.pauses.wait(t, Number.isFinite(r) && r >= 0 ? r : dE, () => this.commit(t));
	}
	handleEnter(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Enter" || e.defaultPrevented || M(e) || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(cE)) return;
		let t = e.target;
		e.preventDefault(), this.pauses.drop(t), this.commit(t, !0);
	}
	commit(e, t = !1) {
		e.dispatchEvent(new Event("change", { bubbles: !0 })), (t || !e.hasAttribute(oE)) && bE(e) && e.dispatchEvent(new Event("search", { bubbles: !0 }));
	}
};
function bE(e) {
	let t = Number(e.getAttribute(aE) ?? 0);
	return !Number.isFinite(t) || e.value.trim().length >= t;
}
function xE(e) {
	if (e.hasAttribute(sE)) return;
	let t = e.closest(`.${zi}`), n = t?.querySelector(`.${lE}`);
	if (t == null || n == null) return;
	let r = bE(e) ? T_(e.value, e) : [], i = SE(n, (e) => r.length === 0 || D_(E_(A_(e), e), r));
	TE(t, n, r.length > 0 && i === 0);
}
function SE(e, t) {
	let n = null, r = !1, i = 0;
	for (let a of e.children) {
		if (!(a instanceof HTMLElement)) continue;
		if (a.hasAttribute("data-ui-group-header")) {
			n !== null && CE(n, r), n = a, r = !1;
			continue;
		}
		if (!a.classList.contains(uE)) continue;
		let e = t(a);
		CE(a, e), r ||= e, e && i++;
	}
	return n !== null && CE(n, r), i;
}
function CE(e, t) {
	let n = t ? "" : "none";
	e.style.display !== n && (e.style.display = n);
}
function wE(e) {
	let t = e.querySelector(`.${lE}`);
	t !== null && TE(e, t, SE(t, (e) => e.style.display !== "none") === 0);
}
function TE(e, t, n) {
	let r = t.querySelector(`:scope > [${It}]`);
	n ? t.toggleAttribute(ut, r !== null || EE(e, t)) : (r?.remove(), t.toggleAttribute(ut, !1));
}
function EE(e, t) {
	let n = e.querySelector(`:scope > template[${Pt}]`);
	if (n === null) return !1;
	let r = n.content.cloneNode(!0).firstElementChild;
	return r !== null && (r.setAttribute(It, ""), t.appendChild(r), !0);
}
//#endregion
//#region src/interactions/type-ahead.ts
var DE = 500, OE = class {
	owner = null;
	typed = "";
	last = -Infinity;
	now;
	constructor(e = () => performance.now()) {
		this.now = e;
	}
	next(e) {
		let t = this.now();
		(e.owner !== this.owner || t - this.last > DE) && (this.typed = ""), this.owner = e.owner, this.last = t, this.typed += E_(e.character, e.context);
		let n = Array.from(this.typed), r = n.every((e) => e === n[0]), i = r ? n[0] : this.typed, a = e.entries.length, o = e.current === null ? -1 : e.entries.indexOf(e.current), s = r ? o + 1 : Math.max(o, 0);
		for (let t = 0; t < a; t++) {
			let n = e.entries[(s + t) % a];
			if (E_(e.words(n), e.context).trimStart().startsWith(i)) return n;
		}
		return null;
	}
};
function kE(e) {
	return M(e) || e.metaKey || Array.from(e.key).length !== 1 || !/\S/u.test(e.key) || (e.ctrlKey || e.altKey) && !e.getModifierState("AltGraph") ? null : e.key;
}
//#endregion
//#region src/interactions/select-interaction-engine.ts
var AE = "data-ui-select-value", jE = "data-ui-select-placement", ME = "ui-select--open", NE = "ui-select__trigger-content", PE = "data-ui-select-content", FE = "ui-select__placeholder", IE = "ui-input__affix-icon--prefix", LE = "ui-select__popup", RE = "ui-select__list", zE = "ui-select__option", BE = "ui-select__value-input", VE = "data-ui-select-clear", HE = "ui-select--clearable", UE = "ui-search", WE = "ui-search__input", GE = "data-ui-active", KE = "data-ui-list-keyboard", qE = /* @__PURE__ */ new Set([
	"ArrowDown",
	"ArrowUp",
	"Home",
	"End",
	"PageDown",
	"PageUp"
]), JE = "ui-multi-select", YE = "ui-multi-select__chips", XE = "ui-multi-select__chip", ZE = "ui-multi-select__chip-label", QE = "ui-multi-select__chip-remove", $E = "ui-badge-select", eD = "ui-text__badge", tD = "ui-badge", nD = "ui-badge__icon", rD = "ui-badge__text", iD = "ui-badge-style--info ui-text-type--overline", aD = "ui-text-type--overline", oD = "data-ui-select-chip", sD = "data-ui-select-chips", cD = "data-ui-select-max", lD = "data-ui-select-free-text", uD = "ui-multi-select__entry", dD = "data-ui-select-tag-entry", fD = [
	AE,
	fi,
	cD
], pD = ["class", b], mD = [...pD, "style"];
function hD(e) {
	return e === null || j(e) || k(e);
}
function gD(e) {
	return e.classList.contains(JE);
}
function _D(e) {
	return e.classList.contains(UE);
}
function vD(e) {
	return _D(e) ? e.querySelector(`.${WE}`) : null;
}
function yD(e) {
	return e.hasAttribute(lD) ? e.querySelector(`:scope > .${Ni} .${uD}`) : null;
}
function bD(e) {
	return vD(e) ?? yD(e);
}
function xD(e) {
	return yD(e) ?? e.querySelector(".ui-select__trigger");
}
function SD(e) {
	let t = e.target instanceof HTMLInputElement && e.target.classList.contains(uD) ? e.target : null, n = t?.closest(".ui-select") ?? null;
	return t === null || n === null ? null : {
		entry: t,
		select: n
	};
}
function CD(e) {
	return Rd(e, `.${LE} .${zE}`, `.${zi}`);
}
function wD(e) {
	let t = CD(e).filter((e) => !A(e));
	return t.find((e) => e === document.activeElement) ?? t.find((e) => e.hasAttribute(GE)) ?? null;
}
function TD(e) {
	for (let t of Rd(e, `.${RE}`, `.${zi}`)) {
		let e = t.querySelector(`:scope > .${zE}[${GE}]:not([${ai}])`) !== null;
		t.hasAttribute(KE) !== e && t.toggleAttribute(KE, e);
	}
}
function ED(e) {
	return e === null ? null : A_(e);
}
function DD(e) {
	for (let t of [e, ...e.querySelectorAll("*")]) {
		t.removeAttribute(y), t.removeAttribute(b), t.removeAttribute(ae), t.removeAttribute(ie);
		for (let e of t.getAttributeNames()) e.startsWith("data-ui-bind-") && t.removeAttribute(e);
	}
}
var OD = class {
	root;
	popups = new _v({
		show: ({ owner: e }) => e.classList.add(ME),
		hide: ({ owner: e }) => {
			e.classList.remove(ME), this.markActive(e, null);
			let t = e.querySelector(`.${LE}`);
			t !== null && (t.style.minHeight = "");
		},
		closesOnTab: !0,
		sheetOnPhone: ({ owner: e }) => bD(e) === null
	});
	typeAhead = new OE();
	drawnKeys = /* @__PURE__ */ new WeakMap();
	validation;
	refusedEntries = /* @__PURE__ */ new WeakSet();
	optionWatch;
	watched = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation;
		let t = (e) => {
			let t = /* @__PURE__ */ new Set();
			for (let n of e) Ng(n) || GD(n, t);
			for (let e of t) this.sync(e);
		};
		this.optionWatch = this.root instanceof Node ? new MutationObserver(t) : null, this.root instanceof Node && new MutationObserver(t).observe(this.root, {
			attributes: !0,
			attributeFilter: fD,
			childList: !0,
			subtree: !0
		});
		for (let e of this.root.querySelectorAll(`.${zi}`)) this.sync(e);
		this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && (e.target.closest(`[${VE}], .${QE}`) !== null || PD(e.target)) && e.preventDefault();
		}, !0), window.addEventListener("input", (e) => this.handleEntryEdit(e), !0), window.addEventListener("compositionend", (e) => this.handleEntryEdit(e), !0), window.addEventListener("change", (e) => this.holdEntryDraft(e), !0), window.addEventListener("keydown", (e) => this.handleEntryEscape(e), !0), this.root.addEventListener("paste", (e) => this.handleEntryPaste(e), !0);
	}
	handleEntryEdit(e) {
		let t = this.holdEntryDraft(e);
		if (t === null || e.isComposing === !0) return;
		let { entry: n, select: r } = t;
		if (hD(r)) return;
		this.releaseRefusal(r);
		let i = Id(n.value);
		i.tags.length > 0 ? this.enterTyped(r, n, i.tags, i.rest) : this.suggest(r, n);
	}
	holdEntryDraft(e) {
		let t = SD(e);
		return t === null || this.root instanceof Node && !this.root.contains(t.select) ? null : (e.stopImmediatePropagation(), t);
	}
	handleEntryEscape(e) {
		let t = e instanceof KeyboardEvent && e.key === "Escape" && !e.defaultPrevented && !M(e) ? SD(e) : null;
		t !== null && this.openSelect === t.select && t.select.getAttribute(dD) === "first-suggestion" && CD(t.select).some((e) => e.hasAttribute(GE)) && (e.preventDefault(), this.markActive(t.select, null));
	}
	handleEntryPaste(e) {
		let t = SD(e), n = e.clipboardData?.getData("text") ?? "";
		if (t === null || hD(t.select) || !Pd(n)) return;
		let { entry: r, select: i } = t, a = r.selectionStart ?? r.value.length, o = r.selectionEnd ?? a;
		e.preventDefault(), this.releaseRefusal(i), this.enterTyped(i, r, Fd(r.value.slice(0, a) + n + r.value.slice(o)), "");
	}
	enterTyped(e, t, n, r) {
		let i = Od(e.getAttribute(fi)), a = kd(e.getAttribute(cD)), o = Ld(i, n.map((t) => ({
			text: t,
			key: FD(e, t) ?? t
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
		xE(t);
		let n = t.value.trim().length > 0, r = n ? AD(e) : [], i = r.find((e) => e.getAttribute("aria-selected") !== "true") ?? null;
		this.openSelect === e ? r.length > 0 || !n ? this.popups.reposition(e) : this.close() : r.length > 0 && this.toggle(e, !0), this.openSelect === e && e.getAttribute(dD) === "first-suggestion" && (this.markActive(e, i), i !== null && MD(e, i));
	}
	get openSelect() {
		return this.popups.current;
	}
	sync(e) {
		if (this.watchOptions(e), TD(e), gD(e)) {
			this.syncMultiple(e);
			return;
		}
		let t = e.getAttribute(AE);
		this.decorateOptions(e);
		let n = t === null ? null : CD(e).find((e) => e.getAttribute("data-ui-key") === t) ?? null, r = this.renderTriggerContent(e, n, t), i = e.querySelector(`.${FE}`);
		i !== null && (i.style.display = r ? "none" : "");
		for (let n of CD(e)) n.setAttribute("aria-selected", t !== null && n.dataset.uiKey === t ? "true" : "false");
		let a = e.querySelector(`.${BE}`);
		a !== null && a.value !== (t ?? "") && (a.value = t ?? ""), wE(e);
	}
	watchOptions(e) {
		if (this.optionWatch === null || this.watched.has(e)) return;
		this.watched.add(e);
		let t = e.classList.contains($E) ? mD : pD;
		this.optionWatch.observe(e, {
			attributes: !0,
			attributeFilter: t,
			characterData: !0,
			subtree: !0
		});
	}
	syncMultiple(e) {
		let t = Od(e.getAttribute(fi)), n = new Set(t), r = Ad(t, kd(e.getAttribute(cD)));
		this.decorateOptions(e, (e) => r && !n.has(e.dataset.uiKey ?? ""));
		let i = CD(e), a = new Map(i.map((e) => [e.dataset.uiKey ?? "", e])), o = yD(e), s = o === null ? t.filter((e) => a.has(e)) : t, c = e.classList.contains($E);
		RD(e, s.map((e) => {
			let t = a.get(e) ?? null, n = c ? ID(t) : void 0;
			return {
				key: e,
				label: LD(t, e, n ?? null),
				badge: n
			};
		})), o !== null && o.readOnly !== hD(e) && (o.readOnly = hD(e));
		let l = e.querySelector(`.${FE}`);
		l !== null && (l.style.display = s.length > 0 ? "none" : "");
		for (let e of i) e.setAttribute("aria-selected", n.has(e.dataset.uiKey ?? "") ? "true" : "false");
		let u = e.querySelector(`.${BE}`), d = JSON.stringify(t);
		u !== null && u.getAttribute("data-ui-selected-keys") !== d && u.setAttribute(fi, d), wE(e);
	}
	renderTriggerContent(e, t, n) {
		let r = e.querySelector(`.${Ni}`);
		if (r === null) return t !== null;
		let i = r.querySelector(`:scope > .${NE}`), a = i?.getAttribute(PE) ?? null;
		if (i !== null && a !== null && (i.removeAttribute(PE), this.drawnKeys.set(e, a)), t === null) return i !== null && n !== null && _D(e) && this.drawnKeys.get(e) === n ? !0 : (i?.remove(), this.drawnKeys.delete(e), !1);
		let o = t.getAttribute(b);
		if (o === null ? this.drawnKeys.delete(e) : this.drawnKeys.set(e, o), i !== null && o !== null && a === o) return !0;
		if (i === null) {
			i = document.createElement("span"), i.className = NE;
			let e = r.querySelector(`:scope > .${IE}`);
			e === null ? r.prepend(i) : e.after(i);
		}
		i.style.display = "inline-flex";
		let s = t.cloneNode(!0);
		return DD(s), Ig(s), i.replaceChildren(...s.childNodes), !0;
	}
	decorateOptions(e, t = () => !1) {
		for (let n of CD(e)) {
			n.hasAttribute("role") || n.setAttribute("role", "option");
			let e = A(n), r = e || t(n) ? "true" : "false";
			n.getAttribute("aria-disabled") !== r && n.setAttribute("aria-disabled", r), (e ? n.tabIndex !== -1 : !n.hasAttribute("tabindex")) && (n.tabIndex = -1);
		}
	}
	handlePointerMove(e) {
		let t = this.openSelect, n = t === null || !(e.target instanceof Element) ? null : e.target.closest(`.${zE}`);
		t === null || n === null || n.hasAttribute(GE) || A(n) || k(n) || n.closest(".ui-select") !== t || (bD(t) === null && (P(CD(t).filter((e) => !A(e)), n), Up(n)), this.markActive(t, n, !0));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${QE}`);
		if (t !== null) {
			let n = t.closest(`.${zi}`);
			n !== null && (e.preventDefault(), e.stopPropagation(), hD(n) || this.removeChosen(n, t.closest(`.${XE}`)?.getAttribute(oD) ?? null));
			return;
		}
		let n = e.target.closest(`[${VE}]`);
		if (n !== null) {
			let t = n.closest(`.${zi}`);
			t !== null && (e.preventDefault(), e.stopPropagation(), hD(t) || (this.clearValue(t), kD(t)));
			return;
		}
		let r = e.target.closest(`.${Ni}`);
		if (r !== null) {
			let t = r.closest(`.${zi}`);
			if (hD(t)) return;
			e.preventDefault();
			let n = t === null ? null : yD(t);
			t !== null && n !== null ? this.pressEntryBox(t, n, e.target === n) : this.toggle(t);
			return;
		}
		let i = e.target.closest(`.${zE}`);
		if (i === null) return;
		let a = i.closest(`.${zi}`);
		a !== null && this.choose(a, i);
	}
	pressEntryBox(e, t, n) {
		document.activeElement !== t && t.focus(), !(CD(e).length === 0 || n && this.openSelect === e) && this.toggle(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || M(e) || (this.openSelect !== null && TD(this.openSelect), this.handleEntryKey(e) || this.handleChipKey(e)) || this.openSelect !== null && e.target instanceof Node && this.openSelect.contains(e.target) && this.handleOpenListKey(e, this.openSelect) || this.handleClearKey(e) || (e.key === "ArrowDown" || e.key === "ArrowUp") && N(e, { alt: e.key === "ArrowDown" }) && this.handleClosedArrow(e) || this.handleTypeAhead(e) || this.handleMultipleTriggerKey(e) || e.key !== "Enter" && e.key !== " " || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${zE}`) ?? this.markedOption(e);
		if (t === null) return;
		let n = t.closest(`.${zi}`);
		n !== null && (e.preventDefault(), this.choose(n, t));
	}
	handleOpenListKey(e, t) {
		if (e.key === "ArrowUp" && e.altKey && N(e, { alt: !0 })) {
			e.preventDefault();
			let n = wD(t);
			return n !== null && !gD(t) ? this.choose(t, n) : this.close(), !0;
		}
		return !qE.has(e.key) || !N(e) || (e.key === "Home" || e.key === "End") && td(e.target) ? !1 : (e.preventDefault(), this.moveCurrent(t, e.key), !0);
	}
	handleEntryKey(e) {
		let t = SD(e);
		if (t === null) return !1;
		let { entry: n, select: r } = t;
		if (hD(r)) return !1;
		switch (e.key) {
			case "ArrowLeft": return n.selectionStart === 0 && n.selectionEnd === 0 && this.focusChip(e, r, -1);
			case "ArrowDown":
			case "ArrowUp": return e.preventDefault(), this.openSelect === r ? this.moveCurrent(r, e.key) : this.openSuggestions(r, n, e.key === "ArrowDown"), !0;
			case "Enter": {
				let t = this.openSelect === r ? AD(r).find((e) => e.hasAttribute(GE)) : void 0;
				return t === void 0 ? (e.preventDefault(), n.value.trim().length === 0 ? (this.pressEntryBox(r, n, !1), !0) : (this.releaseRefusal(r), this.enterTyped(r, n, Fd(n.value), ""), !0)) : (e.preventDefault(), this.choose(r, t), !0);
			}
			case ",": return e.preventDefault(), this.releaseRefusal(r), this.enterTyped(r, n, Fd(n.value), ""), !0;
			case "Backspace": {
				if (n.value.length > 0) return !1;
				let t = r.querySelectorAll(`.${YE} > .${XE}`);
				return t.length !== 0 && (e.preventDefault(), this.removeChosen(r, t[t.length - 1].getAttribute(oD)), !0);
			}
			default: return !1;
		}
	}
	focusChip(e, t, n, r = null) {
		let i = ND(t);
		if (i.length === 0) return !1;
		let a = i[(r === null ? i.length : i.findIndex((e) => e.contains(r))) + n]?.querySelector(`.${QE}`) ?? (n === 1 ? xD(t) : null);
		return e.preventDefault(), a === null || (a.focus(), a instanceof HTMLInputElement && a.setSelectionRange(0, 0)), !0;
	}
	openSuggestions(e, t, n) {
		xE(t);
		let r = AD(e), i = (n ? r[0] : r[r.length - 1]) ?? null;
		i !== null && this.toggle(e, !0, i);
	}
	handleChipKey(e) {
		let t = e.target instanceof HTMLElement && e.target.classList.contains(QE) ? e.target : null, n = t?.closest(".ui-select") ?? null;
		if (t === null || n === null || !gD(n)) return !1;
		switch (e.key) {
			case "ArrowLeft": return this.focusChip(e, n, -1, t);
			case "ArrowRight": return this.focusChip(e, n, 1, t);
			case "Backspace":
			case "Delete": {
				if (e.preventDefault(), hD(n)) return !0;
				let r = ND(n), i = r.findIndex((e) => e.contains(t)), a = (r[i + 1] ?? r[i - 1])?.getAttribute(oD) ?? null;
				this.removeChosen(n, r[i]?.getAttribute(oD) ?? null);
				let o = a === null ? null : ND(n).find((e) => e.getAttribute(oD) === a) ?? null;
				return o !== null && o.querySelector(`.${QE}`)?.focus(), !0;
			}
			default: return !1;
		}
	}
	handleClosedArrow(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || t === this.openSelect || hD(t)) return !1;
		e.preventDefault();
		let n = vD(t);
		n !== null && xE(n);
		let r = AD(t), i = r.find((e) => e.getAttribute("aria-selected") === "true") ?? (e.key === "ArrowDown" ? r[0] : r[r.length - 1]) ?? null;
		return this.toggle(t, !1, i), !0;
	}
	handleTypeAhead(e) {
		let t = kE(e), n = e.target instanceof HTMLElement ? e.target : null;
		if (t === null || n === null || !(n.classList.contains("ui-select__trigger") || n.classList.contains(zE))) return !1;
		let r = n.closest(`.${zi}`), i = r !== null && r === this.openSelect;
		if (r === null || hD(r) || !i && !n.classList.contains("ui-select__trigger")) return !1;
		let a = vD(r);
		if (a !== null) return !i && (e.preventDefault(), this.typeIntoSearch(r, a, t), !0);
		e.preventDefault();
		let o = AD(r), s = i ? o.find((e) => e === document.activeElement) ?? o.find((e) => e.hasAttribute(GE)) ?? null : o.find((e) => e.getAttribute("aria-selected") === "true") ?? null, c = this.typeAhead.next({
			owner: r,
			character: t,
			entries: o,
			current: s,
			words: (e) => ED(e) ?? "",
			context: r
		});
		return c === null ? !0 : i ? (P(CD(r).filter((e) => !A(e)), c), MD(r, c), z(c), this.markActive(r, c), !0) : (this.toggle(r, !1, c), !0);
	}
	typeIntoSearch(e, t, n) {
		this.toggle(e, !0), this.openSelect === e && (t.value = n, t.setSelectionRange(n.length, n.length), t.dispatchEvent(new Event("input", { bubbles: !0 })));
	}
	handleClearKey(e) {
		if (e.key !== "Delete" && e.key !== "Backspace" || !N(e) || !(e.target instanceof HTMLElement)) return !1;
		let t = e.target.closest(`.${zi}`);
		return t === null || t === this.openSelect || !t.classList.contains(HE) || hD(t) || e.target !== xD(t) || e.key === "Backspace" && gD(t) || (yD(t)?.value ?? "") !== "" ? !1 : (e.preventDefault(), this.clearValue(t), !0);
	}
	handleMultipleTriggerKey(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || !gD(t) || hD(t)) return !1;
		switch (e.key) {
			case "Enter":
			case " ": return e.preventDefault(), this.toggle(t), !0;
			case "ArrowLeft": return this.focusChip(e, t, -1);
			case "Backspace": {
				let n = t.querySelectorAll(`.${YE} > .${XE}`);
				return n.length !== 0 && (e.preventDefault(), this.removeChosen(t, n[n.length - 1].getAttribute(oD)), !0);
			}
			default: return !1;
		}
	}
	markedOption(e) {
		let t = this.openSelect;
		return e.key !== "Enter" || t === null || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(WE) || !t.contains(e.target) ? null : AD(t).find((e) => e.hasAttribute(GE)) ?? null;
	}
	toggle(e, t = !1, n = null) {
		if (e === null) return;
		if (this.openSelect === e) {
			this.close();
			return;
		}
		this.close();
		let r = bD(e), i = yD(e);
		r !== null && !t && xE(r), wE(e);
		let a = e.querySelector(`.${Ni}`), o = e.querySelector(`.${LE}`), s = e.querySelector(`.${RE}`) ?? o, c = e.getAttribute(jE);
		if (a === null || o === null || s === null) return;
		let l = ta(s, "ui-select-list");
		i === null && a.setAttribute("aria-controls", l), r?.setAttribute("aria-controls", l), this.popups.open({
			owner: e,
			popup: o,
			anchor: a,
			placement: {
				placement: c !== null && Mh(c) ? c : "bottom-start",
				minAnchorWidth: !0
			},
			openers: i === null ? r === null ? [a] : [a, r] : [i],
			returnFocus: () => i ?? a
		}) && (r === null ? this.initializeFocus(e, n) : (i === null ? this.initializeSearch(e, r, n, t) : this.initializeEntry(e, n), KD(o)));
	}
	close() {
		this.popups.close();
	}
	initializeFocus(e, t) {
		let n = AD(e);
		if (n.length === 0) return;
		let r = t ?? n.find((e) => e.getAttribute("aria-selected") === "true");
		if (r === void 0 && Ip()) {
			P(n, null), this.markActive(e, null), kD(e);
			return;
		}
		let i = r ?? n[0];
		P(n, i), this.markActive(e, i, Ip()), MD(e, i), z(i);
	}
	initializeSearch(e, t, n, r) {
		let i = CD(e), a = AD(e), o = (r ? void 0 : n ?? a.find((e) => e.getAttribute("aria-selected") === "true")) ?? (r || Ip() ? null : a[0] ?? null);
		P(i, null), this.markActive(e, o, Ip()), o !== null && MD(e, o), !Lp() && (z(t), t.select());
	}
	initializeEntry(e, t) {
		P(CD(e), null), this.markActive(e, t), t !== null && MD(e, t);
	}
	moveCurrent(e, t) {
		let n = CD(e).filter((e) => !A(e)), r = np(t, n, wD(e), "vertical");
		r !== null && (bD(e) === null ? yd(n, r) : MD(e, r), this.markActive(e, r));
	}
	markActive(e, t, n = !1) {
		for (let r of CD(e)) r === t ? r.setAttribute(GE, "") : r.hasAttribute(GE) && r.removeAttribute(GE), Rp(r, r === t && n);
		TD(e);
		let r = bD(e);
		r !== null && (t === null ? r.removeAttribute("aria-activedescendant") : r.setAttribute("aria-activedescendant", ta(t, "ui-select-option")));
	}
	choose(e, t) {
		let n = t.dataset.uiKey;
		if (n === void 0 || A(t) || hD(e)) return;
		if (gD(e)) {
			let r = jd(Od(e.getAttribute(fi)), n, kd(e.getAttribute(cD)));
			this.markActive(e, t, Ip()), r !== null && this.writeChosen(e, r);
			let i = yD(e);
			i !== null && i.value.length > 0 && (i.value = "", this.releaseRefusal(e), this.suggest(e, i));
			return;
		}
		if (e.getAttribute(AE) === n) {
			this.close();
			return;
		}
		e.setAttribute(AE, n), this.sync(e);
		let r = e.querySelector(`.${BE}`);
		r !== null && (r.value = n, r.dispatchEvent(new Event("change", { bubbles: !0 }))), this.close();
	}
	removeChosen(e, t) {
		let n = t === null ? null : Md(Od(e.getAttribute(fi)), t);
		if (n === null) return;
		let r = document.activeElement instanceof HTMLElement && document.activeElement.closest(`.${XE}`) !== null;
		this.writeChosen(e, n), (r || document.activeElement === document.body) && xD(e)?.focus();
	}
	writeChosen(e, t) {
		t.length === 0 ? e.removeAttribute(fi) : e.setAttribute(fi, JSON.stringify(t)), this.sync(e), this.popups.reposition(e), e.querySelector(`.${BE}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	clearValue(e) {
		if (gD(e)) {
			e.hasAttribute("data-ui-selected-keys") && this.writeChosen(e, []);
			return;
		}
		if (!e.hasAttribute(AE)) return;
		e.removeAttribute(AE), this.sync(e);
		let t = e.querySelector(`.${BE}`);
		t !== null && (t.value = "", t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
};
function kD(e) {
	let t = e.querySelector(`.${Ni}`), n = xD(e);
	t !== null && n !== null && !t.contains(document.activeElement) && z(n);
}
function AD(e) {
	return CD(e).filter((e) => jD(e) && !A(e) && !k(e));
}
function jD(e) {
	return e.style.display !== "none" && !e.classList.contains("ui-hidden");
}
function MD(e, t) {
	let n = e.querySelector(`.${RE}`);
	if (n === null) return;
	let r = n.getBoundingClientRect(), i = t.getBoundingClientRect(), a = getComputedStyle(n), o = r.top + (Number.parseFloat(a.borderTopWidth) || 0), s = o + (Number.parseFloat(a.paddingTop) || 0), c = o + n.clientHeight - (Number.parseFloat(a.paddingBottom) || 0);
	i.top < s ? n.scrollTop -= s - i.top : i.bottom > c && (n.scrollTop += i.bottom - c);
}
function ND(e) {
	return [...e.querySelectorAll(`.${YE} > .${XE}`)];
}
function PD(e) {
	let t = e.closest(".ui-select__trigger")?.closest(".ui-select") ?? null;
	return t !== null && yD(t) !== null && !e.classList.contains(uD);
}
function FD(e, t) {
	let n = t.trim().toLocaleLowerCase();
	for (let t of CD(e)) {
		let e = t.dataset.uiKey;
		if (e !== void 0 && !A(t) && (e.toLocaleLowerCase() === n || ED(t)?.trim().toLocaleLowerCase() === n)) return e;
	}
	return null;
}
function ID(e) {
	return e?.querySelector(`.${eD}`) ?? null;
}
function LD(e, t, n = null) {
	let r = ((n?.hasAttribute("data-ui-badge-text") === !0 ? n.querySelector(`.${rD}`)?.textContent ?? null : null) ?? ED(e))?.trim() ?? "";
	return r.length > 0 ? r : t;
}
function RD(e, t) {
	let n = e.querySelector(`.${YE}`);
	if (n === null) return;
	n.hasAttribute(sD) !== t.length > 0 && n.toggleAttribute(sD, t.length > 0);
	let r = [...n.querySelectorAll(`:scope > .${XE}`)];
	if (!(r.length === t.length && r.every((e, n) => e.getAttribute(oD) === t[n].key && e.querySelector(`.${ZE}`)?.textContent === t[n].label && (t[n].badge === void 0 || UD(e) === UD(t[n].badge ?? HD()))))) {
		for (let e of r) e.remove();
		n.prepend(...t.map(zD));
	}
}
function zD(e) {
	let t = document.createElement("button"), n = e.badge === void 0 ? BD(e.label) : VD(e.label, e.badge);
	return n.classList.add(XE), n.setAttribute(oD, e.key), t.className = QE, t.type = "button", t.tabIndex = -1, O.write(t, "aria-label", "ui.select.remove", { label: e.label }), n.append(t), n;
}
function BD(e) {
	let t = document.createElement("span"), n = document.createElement("span");
	return n.className = ZE, n.textContent = e, t.append(n), t;
}
function VD(e, t) {
	let n = t === null ? HD() : t.cloneNode(!0);
	DD(n), n.classList.remove(eD);
	let r = n.querySelector(`:scope > .${rD}`);
	return r?.classList.add(ZE), r !== null && !n.hasAttribute("data-ui-badge-text") && WT(n, e), n;
}
function HD() {
	let e = document.createElement("span"), t = document.createElement("span"), n = document.createElement("span");
	return e.className = `${tD} ${iD}`, t.className = `${nD} ui-icon`, n.className = `${rD} ${aD}`, e.append(t, n), e;
}
function UD(e) {
	let t = e.querySelector(`:scope > .${nD}`);
	return `${WD(e)}|${t === null ? "" : WD(t)}`;
}
function WD(e) {
	return `${[...e.classList].filter((e) => e !== XE && e !== eD).sort().join(" ")};${e.getAttribute("style") ?? ""};${e.hasAttribute(Ke)}`;
}
function GD(e, t) {
	if (e.type === "childList") {
		for (let n of e.addedNodes) if (n instanceof HTMLElement) {
			n.classList.contains("ui-select") && t.add(n);
			for (let e of n.querySelectorAll(`.${zi}`)) t.add(e);
		}
	}
	if (e.type === "attributes" && (e.attributeName === AE || e.attributeName === "data-ui-selected-keys" || e.attributeName === cD)) {
		e.target instanceof HTMLElement && e.target.classList.contains("ui-select") && t.add(e.target);
		return;
	}
	let n = e.target instanceof HTMLElement ? e.target : e.target.parentElement;
	if (e.attributeName === "style" && n?.classList.contains(tD) !== !0) return;
	let r = n?.closest(`.${LE}`)?.closest(`.${zi}`);
	r != null && t.add(r);
}
function KD(e) {
	e.dataset.uiPlacement?.startsWith("top") === !0 && (e.style.minHeight = `${e.offsetHeight}px`);
}
//#endregion
//#region src/interactions/commit-gate.ts
var qD = class {
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
		td(t) && this.root.contains(t) && (this.field = t, this.committed = t.value);
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
}, JD = "textarea.ui-text-area__field", YD = "data-ui-text-area-grow";
function XD() {
	return typeof CSS < "u" && CSS.supports("field-sizing", "content");
}
var ZD = class {
	root;
	widths = /* @__PURE__ */ new WeakMap();
	observer;
	constructor(e = {}) {
		this.root = e.root ?? document, this.observer = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null, this.root.addEventListener("input", (e) => {
			e.target instanceof HTMLTextAreaElement && e.target.matches(JD) && this.fit(e.target);
		}, !0), this.fitAll(this.root.querySelectorAll(JD)), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.fitAll(Ga(e.components, JD));
		}), V(this.root, JD, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [YD]
		}, (e) => {
			this.fitAll(Ga(e, JD));
		});
	}
	fitAll(e) {
		for (let t of e) this.fit(t);
	}
	fit(e) {
		if (!e.hasAttribute(YD)) {
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
function QD(e) {
	let t = $D(e.getAttribute("min"), 0), n = $D(e.getAttribute("max"), 100), r = e.getAttribute("step");
	return {
		min: t,
		max: Math.max(t, n),
		step: r === "any" ? 0 : Math.max(0, $D(r, 1))
	};
}
function $D(e, t) {
	let n = e === null || e.trim().length === 0 ? NaN : Number(e);
	return Number.isFinite(n) ? n : t;
}
function eO(e, t, n, r) {
	let i = (n ? e.height : e.width) - r;
	if (i <= 0) return 0;
	let a = n ? e.top + e.height - t.y : t.x - e.left;
	return Math.min(1, Math.max(0, (a - r / 2) / i));
}
function tO(e, t) {
	return nO(t.min + e * (t.max - t.min), t);
}
function nO(e, t) {
	let n = Math.min(t.max, Math.max(t.min, e));
	if (t.step <= 0) return n;
	let r = Math.round((n - t.min) / t.step);
	return t.min + r * t.step > t.max && r--, rO(t.min + r * t.step, t);
}
function rO(e, t) {
	return Number(e.toFixed(Math.min(20, Math.max(iO(t.step), iO(t.min)))));
}
function iO(e) {
	let t = String(e), n = t.indexOf("e-");
	if (n >= 0) return Number(t.slice(n + 2));
	let r = t.indexOf(".");
	return r < 0 ? 0 : t.length - r - 1;
}
function aO(e, t, n) {
	return t === n ? e < t ? "start" : e > t ? "end" : null : Math.abs(e - t) < Math.abs(e - n) ? "start" : "end";
}
function oO(e, t, n, r, i) {
	let a = Math.max(0, r);
	if (t === "start" ? e <= n - a : e >= n + a) return e;
	let o = t === "start" ? n - a : n + a;
	if (i.step <= 0) return sO(o, i);
	let s = (o - i.min) / i.step;
	return sO(rO(i.min + (t === "start" ? Math.floor(s + 1e-9) : Math.ceil(s - 1e-9)) * i.step, i), i);
}
function sO(e, t) {
	return Math.min(t.max, Math.max(t.min, e));
}
//#endregion
//#region src/interactions/range-value-engine.ts
var cO = "ui-slider__input", lO = "ui-slider__input--end", uO = "ui-slider__input--held", dO = "ui-slider__value", fO = "ui-slider__bubble", pO = "ui-slider__track", mO = "ui-slider__thumb-anchor", hO = "ui-slider", gO = "ui-slider--range", _O = "ui-orientation--vertical", vO = "--ui-slider-fraction", yO = "--ui-slider-end-fraction", bO = 6, xO = "Value", SO = "EndValue", CO = /* @__PURE__ */ new Set([
	"Value",
	"EndValue",
	"Min",
	"Max"
]), wO = class {
	options;
	root;
	settled = /* @__PURE__ */ new WeakMap();
	pressedFrom = /* @__PURE__ */ new WeakMap();
	cancelled = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("pointerdown", (e) => {
			this.notePress(e.target), this.placeBubble(e.target);
		}, !0), this.root.addEventListener("pointercancel", (e) => this.takeBackPress(e.target), !0), (this.root === document ? window : this.root).addEventListener("change", (e) => this.refuseCancelledChange(e), !0), this.root.addEventListener("focusin", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusout", (e) => this.releaseBubble(e.target), !0), new j_({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${gO} .${pO}`),
			begin: (e, t) => this.beginBandDrag(e, t),
			move: (e, t, n) => this.moveBandDrag(e, n),
			end: (e, t) => this.endBandDrag(t),
			cancel: (e, t) => this.putBandBack(t),
			takenBack: (e, t) => this.putBandBack(t)
		}), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			if (CO.has(e.propertyName)) for (let t of Ga(e.components, `.${cO}`)) this.settled.set(t, t.value), this.writeReadings(t), e.propertyName === (EO(t) ? SO : xO) && this.reportClamped(t, e.value);
		});
	}
	notePress(e) {
		let t = TO(e);
		t !== null && (this.cancelled.delete(t), this.pressedFrom.set(t, t.value));
	}
	takeBackPress(e) {
		let t = TO(e), n = t === null ? void 0 : this.pressedFrom.get(t);
		t !== null && n !== void 0 && (this.pressedFrom.delete(t), t.value !== n && (t.value = n, this.cancelled.add(t), this.settled.set(t, n), this.writeReadings(t)));
	}
	refuseCancelledChange(e) {
		let t = TO(e.target);
		t !== null && this.cancelled.has(t) && (this.cancelled.delete(t), e.stopImmediatePropagation());
	}
	reportClamped(e, t) {
		t == null || e.value === String(t) || kO(e) || e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(cO)) return;
		let t = e.target;
		if (this.cancelled.delete(t), kO(t)) {
			t.value = this.settled.get(t) ?? t.defaultValue;
			return;
		}
		let n = DO(t);
		if (n !== null) {
			let e = OO(t, Number(t.value), n);
			e !== t.value && (t.value = e, e === (this.settled.get(t) ?? t.defaultValue) && this.cancelled.add(t));
		}
		this.settled.set(t, t.value), this.writeReadings(t);
	}
	beginBandDrag(e, t) {
		let n = e.querySelector(`.${cO}:not(.${lO})`), r = e.querySelector(`.${lO}`);
		if (n === null || r === null) return null;
		let i = tO(eO(e.getBoundingClientRect(), t, AO(e), jO(e)), QD(n)), a = aO(i, Number(n.value), Number(r.value));
		if (kO(n)) return z(a === "end" ? r : n), null;
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
		let n = e.start.closest(`.${pO}`);
		if (n === null) return;
		let r = tO(eO(n.getBoundingClientRect(), t, AO(n), jO(n)), QD(e.start));
		if (e.held === null) {
			if (r === e.pressed) return;
			this.holdHandle(e, r < e.pressed ? "start" : "end", r);
		} else this.moveHandle(e.held, r);
	}
	holdHandle(e, t, n) {
		let r = t === "start" ? e.start : e.end;
		e.held = r, r.classList.add(uO), z(r), this.moveHandle(r, n), this.placeBubble(r);
	}
	moveHandle(e, t) {
		let n = DO(e), r = n === null ? String(t) : OO(e, t, n);
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
		e.held?.classList.remove(uO), e.held !== null && this.writeReadings(e.held);
	}
	placeBubble(e) {
		let t = MO(e);
		t !== null && Uh(t.anchor, t.bubble, {
			placement: t.vertical ? "left" : "top",
			gap: bO
		});
	}
	releaseBubble(e) {
		tg(MO(e)?.bubble);
	}
	writeReadings(e) {
		let t = EO(e), n = e.closest(`.${pO}`)?.parentElement ?? e.parentElement, r = t ? `.${dO}--end, .${fO}--end` : `.${dO}:not(.${dO}--end), .${fO}:not(.${fO}--end)`;
		for (let t of n?.querySelectorAll(r) ?? []) t.textContent = e.value;
		e.closest(`.${pO}`)?.style.setProperty(t ? yO : vO, String(NO(e))), e.matches(`:active, :focus-visible, .${uO}`) ? this.placeBubble(e) : this.releaseBubble(e);
	}
};
function TO(e) {
	return e instanceof HTMLInputElement && e.classList.contains(cO) ? e : null;
}
function EO(e) {
	return e.classList.contains(lO);
}
function DO(e) {
	return e.closest(`.${gO} .${pO}`)?.querySelector(EO(e) ? `.${cO}:not(.${lO})` : `.${lO}`) ?? null;
}
function OO(e, t, n) {
	let r = Number(e.closest(`.${hO}`)?.getAttribute("data-ui-slider-min-distance") ?? 0);
	return String(oO(t, EO(e) ? "end" : "start", Number(n.value), Number.isFinite(r) ? r : 0, QD(e)));
}
function kO(e) {
	return j(e) || k(e);
}
function AO(e) {
	return e.closest(`.${hO}`)?.classList.contains(_O) === !0;
}
function jO(e) {
	let t = e.querySelector(`.${mO}`)?.getBoundingClientRect();
	return t === void 0 ? 0 : AO(e) ? t.height : t.width;
}
function MO(e) {
	if (!(e instanceof Element) || !e.classList.contains(cO)) return null;
	let t = e.closest(`.${pO}`), n = EO(e), r = t?.querySelector(n ? `.${fO}--end` : `.${fO}:not(.${fO}--end)`) ?? null, i = t?.querySelector(n ? `.${mO}--end` : `.${mO}:not(.${mO}--end)`) ?? null;
	return r === null || i === null ? null : {
		bubble: r,
		anchor: i,
		vertical: AO(e)
	};
}
function NO(e) {
	let { min: t, max: n } = QD(e), r = Number(e.value);
	return !Number.isFinite(r) || n <= t ? 0 : Math.min(1, Math.max(0, (r - t) / (n - t)));
}
//#endregion
//#region src/rendering/number-format.ts
var PO = {
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
}, FO = [
	"(n)",
	"-n",
	"- n",
	"n-",
	"n -"
], IO = [
	"$n",
	"n$",
	"$ n",
	"n $"
], LO = [
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
], RO = [
	"n %",
	"n%",
	"%n",
	"% n"
], zO = [
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
], BO = /[1-9]/;
function VO(e) {
	let t = e.closest("[data-ui-number-culture]")?.getAttribute("data-ui-number-culture") ?? null;
	if (t === null) return PO;
	try {
		return {
			...PO,
			...JSON.parse(t)
		};
	} catch {
		return PO;
	}
}
function HO(e, t, n) {
	if (!Number.isFinite(e)) return String(e);
	let r = WO(t);
	if (r === null) return GO(e, n);
	let i = Math.abs(e);
	switch (r.kind) {
		case "N": {
			let t = KO(i, 0, r.precision ?? n.decimalDigits, n.groupSizes, n.groupSeparator, n.decimalSeparator);
			return UO(e, t) ? ZO(FO[n.negativePattern] ?? "-n", t, "", n.negativeSign) : t;
		}
		case "F": {
			let t = KO(i, 0, r.precision ?? n.decimalDigits, [], "", n.decimalSeparator);
			return UO(e, t) ? n.negativeSign + t : t;
		}
		case "D": {
			let t = qO(i, 0, 0).integer.padStart(r.precision ?? 1, "0");
			return UO(e, t) ? n.negativeSign + t : t;
		}
		case "C": {
			let t = KO(i, 0, r.precision ?? n.currencyDecimalDigits, n.currencyGroupSizes, n.currencyGroupSeparator, n.currencyDecimalSeparator);
			return ZO(UO(e, t) ? LO[n.currencyNegativePattern] ?? "-$n" : IO[n.currencyPositivePattern] ?? "$n", t, n.currencySymbol, n.negativeSign);
		}
		case "P": {
			let t = KO(i, 2, r.precision ?? n.percentDecimalDigits, n.percentGroupSizes, n.percentGroupSeparator, n.percentDecimalSeparator);
			return ZO(UO(e, t) ? zO[n.percentNegativePattern] ?? "-n %" : RO[n.percentPositivePattern] ?? "n %", t, n.percentSymbol, n.negativeSign);
		}
		default: return GO(e, n);
	}
}
function UO(e, t) {
	return e < 0 && BO.test(t);
}
function WO(e) {
	if (e == null || e.trim().length === 0) return null;
	let t = /^([NFCPDnfcpd])(\d{0,2})$/.exec(e.trim());
	if (t === null) throw Error(`Number format '${e}' is outside the shared subset (N, F, C, P, D, with an optional precision).`);
	return {
		kind: t[1].toUpperCase(),
		precision: t[2].length === 0 ? null : Number(t[2])
	};
}
function GO(e, t) {
	let { integer: n, fraction: r } = JO(Math.abs(e), 0), i = r.length === 0 ? n : `${n}${t.decimalSeparator}${r}`;
	return e < 0 ? t.negativeSign + i : i;
}
function KO(e, t, n, r, i, a) {
	let { integer: o, fraction: s } = qO(e, t, n);
	return n === 0 ? XO(o, r, i) : `${XO(o, r, i)}${a}${s}`;
}
function qO(e, t, n) {
	let { integer: r, fraction: i } = JO(e, t), a = r + i.slice(0, n).padEnd(n, "0"), o = i.length > n && i[n] >= "5" ? YO(a) : a, s = o.length - n;
	return {
		integer: o.slice(0, s),
		fraction: o.slice(s)
	};
}
function JO(e, t) {
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
function YO(e) {
	let t = e.length - 1;
	for (; t >= 0 && e[t] === "9";) t--;
	let n = "0".repeat(e.length - 1 - t);
	return t < 0 ? `1${n}` : `${e.slice(0, t)}${String(Number(e[t]) + 1)}${n}`;
}
function XO(e, t, n) {
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
function ZO(e, t, n, r) {
	let i = "";
	for (let a of e) i += a === "n" ? t : a === "$" || a === "%" ? n : a === "-" ? r : a;
	return i;
}
var QO = /^[\t\n\v\f\r ]*[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?[\t\n\v\f\r ]*$/;
function $O(e) {
	if (!QO.test(e)) return null;
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}
var ek = {
	readCulture: VO,
	format: HO,
	parseInvariant: $O
}, tk = /^-?(\d+(\.\d*)?|\.\d+)$/;
function nk(e, t, n) {
	if (!tk.test(e)) return e;
	let r = n.thousands === !1 ? lk(t) : t, i = Number(e), a = n.format?.trim() ?? "";
	if (a.length > 0) try {
		return HO(i, n.thousands === !0 ? rk(a) : a, r);
	} catch {}
	let o = e.includes(".") ? e.length - e.indexOf(".") - 1 : 0;
	return HO(i, `${n.thousands === !0 ? "N" : "F"}${Math.min(o, 99)}`, r);
}
function rk(e) {
	return /^[fF]\d{0,2}$/.test(e) ? `N${e.slice(1)}` : e;
}
function ik(e, t, n) {
	return tk.test(e) ? (ck(n) ? uk(e, 2) : e).replace(".", t.decimalSeparator) : e;
}
function ak(e, t, n) {
	let r = e.trim();
	if (r.length === 0) return "";
	let i = !1;
	r.startsWith("(") && r.endsWith(")") && (i = !0, r = r.slice(1, -1));
	let a = ck(n) || t.percentSymbol.length > 0 && r.includes(t.percentSymbol);
	for (let e of [t.currencySymbol, t.percentSymbol]) r = e.length === 0 ? r : r.split(e).join("");
	for (let e of /* @__PURE__ */ new Set([
		t.negativeSign,
		"-",
		"−"
	])) e.length > 0 && r.includes(e) && (i = !0, r = r.split(e).join(""));
	let o = t.decimalSeparator, [s, ...c] = o.length === 0 ? [r] : r.split(o);
	if (c.length > 1) return null;
	let l = s.replace(/[\s  ]/g, "").split(t.groupSeparator).join("").split(t.currencyGroupSeparator).join(""), u = c.length === 0 ? null : c[0].replace(/[\s  ]/g, ""), d = u === null ? l : `${l}.${u}`;
	if (!tk.test(d)) return null;
	let f = a ? uk(d, -2) : d;
	return i && Number(f) !== 0 ? `-${f}` : f;
}
function ok(e, t, n, r, i) {
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
function sk(e) {
	return e.includes(".") ? e.replace(/0+$/, "").replace(/\.$/, "") : e;
}
function ck(e) {
	return /^\s*[pP]\d{0,2}\s*$/.test(e ?? "");
}
function lk(e) {
	return {
		...e,
		groupSeparator: "",
		currencyGroupSeparator: "",
		percentGroupSeparator: ""
	};
}
function uk(e, t) {
	let n = e.startsWith("-"), r = n ? e.slice(1) : e, i = r.indexOf("."), a = r.replace(".", ""), o = (i < 0 ? r.length : i) + t, s = a;
	o <= 0 && (s = "0".repeat(1 - o) + s, o = 1), o > s.length && (s += "0".repeat(o - s.length));
	let c = s.slice(0, o).replace(/^0+(?=\d)/, ""), l = s.slice(o).replace(/0+$/, ""), u = l.length === 0 ? c : `${c}.${l}`;
	return n ? `-${u}` : u;
}
//#endregion
//#region src/interactions/number-input-engine.ts
var dk = "ui-number-input", fk = "ui-number-input__field", pk = "data-ui-number-no-decimals", mk = "data-ui-number-no-negative", hk = "data-ui-number-thousands", gk = "data-ui-number-no-thousands", _k = "data-ui-number-trim-zeros", vk = "data-ui-number-step", yk = "data-ui-number-min", bk = "data-ui-number-max", xk = "data-ui-number-step-direction", Sk = /* @__PURE__ */ new Map([
	["ArrowUp", 1],
	["ArrowDown", -1],
	["PageUp", 10],
	["PageDown", -10]
]), Ck = class {
	options;
	root;
	values = /* @__PURE__ */ new WeakMap();
	shown = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("focus", (e) => this.handleFocus(e), !0), this.root.addEventListener("blur", (e) => this.handleBlur(e), !0), this.root.addEventListener("click", (e) => this.handleStepClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleStepKey(e), !0), window.addEventListener("change", (e) => this.handleChangeCapture(e), !0), window.addEventListener("change", (e) => this.handleChangeDone(e)), this.showAtRest(this.root.querySelectorAll(`.${fk}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.showAtRest(Ga(e.components, `.${fk}`));
		}), O.onChange(() => this.showAtRest(this.root.querySelectorAll(`.${fk}`)));
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
		let t = wk(e);
		if (t !== null) return this.keptValue(t) ?? kk(t) ?? t.value.trim();
	}
	show(e) {
		let t = this.values.get(e) ?? e.value, n = e.hasAttribute(_k) ? sk(t) : t, r = VO(e), i = e === document.activeElement ? ik(n, r, Ak(e)) : Dk(e, n, r);
		e.value = i, this.shown.set(e, i);
	}
	handleInput(e) {
		let t = wk(e.target);
		if (t === null) return;
		let n = !t.hasAttribute(pk), r = !t.hasAttribute(mk), i = t.selectionStart ?? t.value.length, a = ok(t.value, i, VO(t), n, r);
		a.value !== t.value && (t.value = a.value, t.setSelectionRange(a.cursor, a.cursor));
	}
	handleFocus(e) {
		let t = wk(e.target);
		t !== null && (this.values.set(t, this.valueOf(t)), this.show(t));
	}
	handleBlur(e) {
		let t = wk(e.target);
		if (t === null) return;
		let n = this.showsOwnText(t) ? null : kk(t);
		if (n !== null && this.values.set(t, n), t.hasAttribute(_k) && !j(t) && !k(t)) {
			let e = this.values.get(t) ?? "", n = sk(e);
			n !== e && this.commit(t, n);
		}
		this.show(t);
	}
	handleChangeCapture(e) {
		let t = wk(e.target);
		if (t === null) return;
		let n = kk(t);
		n !== null && (this.values.set(t, n), t.value = n, this.shown.set(t, n));
	}
	handleChangeDone(e) {
		let t = wk(e.target);
		t !== null && t === document.activeElement && this.show(t);
	}
	commit(e, t) {
		this.values.set(e, t), e.value = ik(t, VO(e), Ak(e)), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleStepClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[" + xk + "]");
		if (t === null) return;
		let n = t.closest(".ui-number-input__row")?.querySelector(`.${fk}`) ?? null;
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t.getAttribute(xk) === "down" ? -1 : 1));
	}
	handleStepKey(e) {
		let t = Sk.get(e.key);
		if (t === void 0 || !N(e, { shift: !0 }) || e.defaultPrevented) return;
		let n = wk(e.target);
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t));
	}
	step(e, t) {
		let n = Number(e.getAttribute(vk) ?? "1"), r = (Number(this.showsOwnText(e) ? this.valueOf(e) : kk(e) ?? "0") || 0) + n * t, i = e.getAttribute(yk), a = e.getAttribute(bk);
		i !== null && (r = Math.max(r, Number(i))), a !== null && (r = Math.min(r, Number(a))), this.commit(e, jk(r)), this.show(e);
	}
};
function wk(e) {
	return e instanceof HTMLInputElement && e.classList.contains(fk) ? e : null;
}
function Tk(e, t) {
	let n = e.classList.contains(dk) ? e.querySelector(`.${fk}`) : null, r = n === null ? null : t(n);
	if (n === null || typeof r != "string" || r.trim().length === 0 || !Number.isFinite(Number(r))) return null;
	let i = Ek(n, yk), a = Ek(n, bk);
	return i !== null && Number(r) < Number(i) ? {
		key: "ui.value.min",
		args: { min: Dk(n, i, VO(n)) }
	} : a !== null && Number(r) > Number(a) ? {
		key: "ui.value.max",
		args: { max: Dk(n, a, VO(n)) }
	} : null;
}
function Ek(e, t) {
	let n = e.getAttribute(t)?.trim() ?? "";
	return n.length > 0 && Number.isFinite(Number(n)) ? n : null;
}
function Dk(e, t, n) {
	return nk(t, n, {
		format: Ak(e),
		thousands: Ok(e)
	});
}
function Ok(e) {
	return e.hasAttribute(hk) ? !0 : !e.hasAttribute(gk) && null;
}
function kk(e) {
	return ak(e.value, VO(e), Ak(e));
}
function Ak(e) {
	return e.closest(`.${dk}`)?.getAttribute("data-ui-number-format") ?? null;
}
function jk(e) {
	return Number(e.toFixed(10)).toString();
}
//#endregion
//#region src/events/ahead-of-answer.ts
function Mk(e, t) {
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
function Nk(e) {
	switch (e.getAttribute(Kt)) {
		case "windowed": return "windowed";
		case "virtualized": return "virtualized";
		default: return "plain";
	}
}
function Pk(e) {
	let t = Nk(e) === "windowed" ? Fk(e, "data-ui-window-offset") ?? 0 : 0;
	return Number.isInteger(t) && t > 0 ? t : 0;
}
function Fk(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.length === 0) return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
function Ik(e, t) {
	return e.getAttribute(t)?.toLowerCase() === "true";
}
//#endregion
//#region src/interactions/item-drags.ts
var Lk = "application/x-ne-items", Rk = null, zk = null;
function Bk(e, t, n) {
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
function Vk(e, t) {
	let n = ef(t);
	return n.includes(e) ? n.filter((t) => t === e || Uk(t)) : [e];
}
function Hk(e) {
	return !Cl(e, "data-ui-undraggable") && !A(e);
}
function Uk(e) {
	return Hk(e) && L(e) !== null;
}
function Wk(e, t) {
	let n = e?.effects.has("copy") === !0, r = t || e?.effects.has("move") === !0;
	return n && r ? "copyMove" : n ? "copy" : "move";
}
function Gk(e, t, n = null) {
	Rk = t, zk = t === null ? null : n, t !== null && e instanceof DragEvent && e.dataTransfer !== null && e.dataTransfer.setData(Lk, t.kind);
}
function Kk(e) {
	return Rk !== null && e.dataTransfer?.types.includes(Lk) === !0 ? Rk : null;
}
function qk() {
	let e = zk;
	Rk = null, zk = null, e?.();
}
//#endregion
//#region src/items/items-empty-renderer.ts
var Jk = "data-ui-non-item";
function G(e) {
	let t = [];
	for (let n of e.children) Yk(n) || t.push(n);
	return t;
}
function Yk(e) {
	return e.hasAttribute("data-ui-non-item") || e.hasAttribute("data-ui-empty-placeholder") || e.hasAttribute("data-ui-group-header") || e.hasAttribute("data-ui-window-spacer");
}
function Xk(e) {
	return e === null ? [] : [e];
}
function Zk(e) {
	return e.querySelector(`:scope > [${It}]`);
}
function Qk(e, t, n, r, i) {
	i ??= G(e).some((e) => !e.classList.contains(Ei));
	let a = Zk(e);
	i ? (a?.remove(), e.toggleAttribute(ut, !1)) : e.toggleAttribute(ut, a !== null || $k(e, t, n, r));
}
function $k(e, t, n, r) {
	let i = n.getEmptyTemplate(t);
	if (i === void 0) return !1;
	let a = r.renderFromTemplate(i, null, r.getAncestorStack(e));
	if (a === null) return !1;
	let o = document.createElement("div");
	return o.setAttribute(It, ""), o.appendChild(a), e.appendChild(o), !0;
}
//#endregion
//#region src/items/binding-template-evaluator.ts
var eA = { ok: !1 }, tA = {
	ok: !0,
	value: null
}, nA = null;
function rA(e) {
	nA = e;
}
function iA(e, t, n) {
	let r = e.length === 0 ? void 0 : e[e.length - 1].item, i = t ?? "";
	if (i.length === 0 || i === ".") return {
		ok: !0,
		value: r,
		scope: r
	};
	let a = (n ?? []).filter((e) => ca(e.kind) !== "Scope"), o = -1;
	for (let e = 0; e < a.length; e++) ca(a[e].kind) === "Dynamic" && (o = e);
	let s = r, c = r, l = !0, u = 0, d = 0, f = !0;
	for (; d < i.length;) {
		let t = i[d];
		if (t === ".") {
			if (f) return eA;
			f = !0, d++;
			continue;
		}
		if (t === "[") {
			if (d + 1 >= i.length || i[d + 1] !== "]" || u >= a.length) return eA;
			let t = a[u];
			if (u++, ca(t.kind) === "Dynamic") {
				let n = cA(e, t.componentId);
				if (!n.ok) return eA;
				s = n.value, c = n.value, l = !0;
			} else {
				if (!l) return eA;
				let e = hA(s, t.value);
				if (!e.ok) return eA;
				s = e.value;
			}
			d += 2, f = !1;
			continue;
		}
		let n = d;
		for (; d < i.length && i[d] !== "." && i[d] !== "[";) d++;
		if (d === n) return eA;
		if (l) {
			let e = dA(s, i.slice(n, d), u > o);
			e.ok ? s = e.value : l = !1;
		}
		f = !1;
	}
	return f || u !== a.length || !l ? eA : {
		ok: !0,
		value: s,
		scope: c
	};
}
function aA(e, t, n) {
	for (let r of t ?? []) {
		if (ca(r.kind) !== "Dynamic") continue;
		let t = T(r.componentId);
		if (t > 0 && !n.some((e) => e.scopeComponentId === t) && e.closest(`[data-ui-id="${t}"][data-ui-key]`) !== null) return !0;
	}
	return !1;
}
function oA(e) {
	let t = uA(e, "IsContent");
	return t.ok && t.value === !0;
}
var sA = /* @__PURE__ */ new Set();
function cA(e, t) {
	let n = T(t);
	if (n > 0) {
		for (let t = e.length - 1; t >= 0; t--) if (e[t].scopeComponentId === n) return {
			ok: !0,
			value: e[t].item
		};
	}
	return sA.has(n) || (sA.add(n), s("an item scope a binding parameter names is not on the stack; the binding resolves to nothing.", {
		targetId: n,
		stack: e
	})), eA;
}
function lA(e, t) {
	let n = e;
	for (let e of t.split(".")) {
		let t = uA(n, e);
		if (!t.ok) return;
		n = t.value;
	}
	return n;
}
function uA(e, t) {
	return dA(e, t, !0);
}
function dA(e, t, n) {
	if (e == null) return eA;
	if (t === ".") return {
		ok: !0,
		value: e
	};
	if (typeof e != "object") return eA;
	let r = e, i = fA(r, t);
	return Object.hasOwn(r, i) ? {
		ok: !0,
		value: r[i]
	} : Array.isArray(e) ? eA : (n && nA?.(r, t), tA);
}
function fA(e, t) {
	if (Object.hasOwn(e, t)) return t;
	let n = pA(t);
	if (Object.hasOwn(e, n)) return n;
	let r = null;
	for (let n in e) if (n.length === t.length && Object.hasOwn(e, n) && (r ??= t.toLowerCase(), n.toLowerCase() === r)) return n;
	return n;
}
function pA(e) {
	let t = e.charAt(0);
	return t === t.toLowerCase() ? e : t.toLowerCase() + e.slice(1);
}
function mA(e) {
	let t = e.itemTemplate;
	if (t == null) return null;
	let n = (e.itemTemplateParameters ?? []).filter((e) => ca(e.kind) !== "Scope"), r = [], i = [], a = !1, o = 0, s = 0, c = 0;
	for (; c < t.length;) {
		let e = t[c];
		if (e === ".") {
			c++;
			continue;
		}
		if (e === "[") {
			if (c + 1 >= t.length || t[c + 1] !== "]" || s >= n.length) return null;
			let e = n[s];
			if (s++, c += 2, ca(e.kind) !== "Dynamic") {
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
function hA(e, t) {
	if (e == null || t == null) return eA;
	if (typeof t == "number") return Array.isArray(e) && t >= 0 && t < e.length ? {
		ok: !0,
		value: e[t]
	} : eA;
	if (typeof t != "string") return eA;
	if (!Array.isArray(e) && typeof e == "object") {
		let n = e;
		if (Object.hasOwn(n, t)) return {
			ok: !0,
			value: n[t]
		};
	}
	if (Array.isArray(e)) {
		for (let n of e) if (_A(n, t)) return {
			ok: !0,
			value: n
		};
	}
	return eA;
}
function gA(e, t, n) {
	if (e == null || t == null) return !1;
	if (Array.isArray(e)) {
		if (typeof t == "number") return t < 0 || t >= e.length ? !1 : (e[t] = n, !0);
		if (typeof t != "string") return !1;
		for (let r = 0; r < e.length; r++) if (_A(e[r], t)) return e[r] = n, !0;
		return !1;
	}
	if (typeof t != "string" || typeof e != "object") return !1;
	let r = e;
	return Object.hasOwn(r, t) ? (r[t] = n, !0) : !1;
}
function _A(e, t) {
	return typeof e == "object" && !!e && e.id === t;
}
//#endregion
//#region src/items/items-filter-sort.ts
var vA = /* @__PURE__ */ new WeakMap();
function yA(e) {
	let t = bA(e), n = t?.getAttribute("data-ui-items-query") ?? null;
	if (t === null || n === null || n.length === 0) return null;
	let r = vA.get(t);
	if (r !== void 0 && r.text === n) return r.query;
	let i = xA(e, n);
	return vA.set(t, {
		text: n,
		query: i
	}), i;
}
function bA(e) {
	let t = e.closest(S);
	if (t === null) return null;
	for (let e of t.children) if (e.hasAttribute("data-ui-items-query")) return e;
	return null;
}
function xA(e, t) {
	try {
		return JSON.parse(t);
	} catch {
		return s("the items query on the page does not parse; the authored rules alone apply.", {
			host: e,
			text: t
		}), null;
	}
}
function SA(e, t, n, r, i) {
	let a = n.getItemsFilterSortMetadata(t), o = yA(e);
	if (a === void 0 && o === null) for (let t of G(e)) t.classList.remove(Ei);
	else for (let n of G(e)) {
		let e = r.getItemValue(n);
		e === void 0 ? (s("item value is unknown, leaving the item visible.", {
			componentId: t,
			item: n
		}), n.classList.remove(Ei)) : n.classList.toggle(Ei, !CA(a, e, i, o));
	}
}
function CA(e, t, n, r = null) {
	return (e?.filters ?? []).every((e) => OA(e, t, n)) && (r?.filters ?? []).every((e) => nh(lA(t, e.itemProperty), e.operator, e.value));
}
function wA(e, t, n = null) {
	return (e?.filters ?? []).some((e) => kA(e.source, e.activeOperator, e.activeValue, t)) || (n?.filters?.length ?? 0) > 0;
}
function TA(e, t, n = null) {
	let r = (e?.sorts ?? []).filter((e) => kA(e.source, e.activeOperator, e.activeValue, t)).sort((e, t) => e.priority - t.priority);
	return [...n?.sorts ?? [], ...r];
}
function EA(e, t, n) {
	return t.length === 0 ? [...e] : [...e].sort((e, r) => DA(n.getItemValue(e), n.getItemValue(r), t));
}
function DA(e, t, n) {
	for (let r of n) {
		let n = AA(rh(lA(e, r.itemProperty)), rh(lA(t, r.itemProperty)));
		if (n !== 0) return pa(r.direction) === "Descending" ? -n : n;
	}
	return 0;
}
function OA(e, t, n) {
	if (!kA(e.source, e.activeOperator, e.activeValue, n)) return !0;
	let r = e.source !== null && e.source !== void 0 ? n.get(e.source, []) : e.value;
	return nh(lA(t, e.itemProperty), e.operator, r);
}
function kA(e, t, n, r) {
	return e == null || nh(r.get(e, []), t, n);
}
function AA(e, t) {
	if (e === t) return 0;
	let n = MA(e), r = MA(t);
	if (n !== r) return n - r;
	if (n === jA.Nothing) return 0;
	if (n === jA.Number) {
		let n = Number(e) - Number(t);
		return Number.isNaN(n) ? 0 : Math.sign(n);
	}
	return String(e).localeCompare(String(t));
}
var jA = {
	Nothing: 0,
	Number: 1,
	Text: 2
};
function MA(e) {
	return e == null ? jA.Nothing : typeof e == "number" ? Number.isNaN(e) ? jA.Nothing : jA.Number : typeof e == "string" && e.trim().length === 0 ? jA.Nothing : Number.isNaN(Number(e)) ? jA.Text : jA.Number;
}
//#endregion
//#region src/items/items-source-order.ts
var NA = /* @__PURE__ */ new WeakMap();
function PA(e, t) {
	let n = NA.get(e), r = n === void 0 ? [...t] : FA(n, t);
	return NA.set(e, r), r;
}
function FA(e, t) {
	let n = new Set(t), r = e.filter((e) => n.has(e));
	return r.length === t.length ? r : [...t];
}
function IA(e, t, n) {
	let r = n === null || n > e.length ? e.length : n;
	return e.splice(r, 0, t), e[r + 1] ?? null;
}
function LA(e, t) {
	let n = e.indexOf(t);
	n >= 0 && e.splice(n, 1);
}
function RA(e, t) {
	let n = 0;
	for (let r of e) t.has(r) || (e[n++] = r);
	e.length = n;
}
function zA(e, t, n) {
	return LA(e, t), IA(e, t, n);
}
function BA(e, t, n) {
	let r = e.indexOf(t);
	r >= 0 && (e[r] = n);
}
function VA(e, t) {
	NA.set(e, [...t]);
}
function HA(e) {
	NA.delete(e);
}
//#endregion
//#region src/interactions/live-announcer.ts
var UA = "ui-announcer", WA = 7e3, GA = null;
function KA(e, t = "polite") {
	(GA ?? qA(document.body)).announce(e, t);
}
function qA(e) {
	return GA = new YA(e), GA;
}
function JA(e, t) {
	KA({
		key: "ui.move.done",
		args: {
			index: e,
			count: t
		}
	});
}
var YA = class {
	container;
	regions = /* @__PURE__ */ new Map();
	constructor(e) {
		this.container = e, this.ensureRegion("polite"), this.ensureRegion("assertive");
	}
	announce(e, t = "polite") {
		let n = document.createElement("div");
		return typeof e == "string" ? n.textContent = e : O.writeValue(n, null, e), this.ensureRegion(t).append(n), setTimeout(() => n.remove(), WA), n;
	}
	ensureRegion(e) {
		let t = this.regions.get(e);
		if (t !== void 0 && t.isConnected) return t;
		let n = `.${UA}[aria-live="${e}"]`, r = this.container.querySelector(n), i = r ?? document.createElement("div");
		return r === null && (i.className = UA, i.setAttribute("aria-live", e), this.container.append(i)), this.regions.set(e, i), i;
	}
}, XA = "ui-tab-item";
function ZA(e) {
	let t = e.parentElement;
	return t !== null && !t.hasAttribute("data-ui-items-host") && t.closest("[data-ui-items-host]") === t.parentElement ? t : e;
}
function QA(e) {
	return e instanceof HTMLElement && e.classList.contains("ui-tab-item") ? ZA(e).parentElement : null;
}
function $A(e, t) {
	return Cl(ZA(e), t);
}
//#endregion
//#region src/interactions/items-reorder-engine.ts
var ej = ".ui-items-view__item, .ui-table__row", tj = "ui-row--dragging", nj = "--ui-row-drop-offset", rj = "move", ij = ".ui-items-view--wrap", aj = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight"
]);
function oj(e, t) {
	sp(e, rj, { index: t });
}
function sj(e) {
	return {
		name: rj,
		registration: {
			dynamicParameters: (e) => {
				let t = cj(e.domEvent);
				return t === null ? null : [...e.dynamicParameters, t];
			},
			...Mk((t) => e === void 0 ? null : lj(e, t), (t) => "pending" in t ? e?.settle(t.pending) : e?.resort(t.strip))
		}
	};
}
function cj(e) {
	let t = e instanceof CustomEvent ? e.detail?.index : void 0;
	return typeof t == "number" ? t : null;
}
function lj(e, t) {
	let n = cj(t);
	if (n === null || !(t.target instanceof Element)) return null;
	let r = QA(t.target);
	if (r !== null) return { strip: r };
	let i = t.target.closest(ej), a = i?.parentElement ?? null, o = i === null || a === null || !a.hasAttribute("data-ui-items-host") ? null : e.ahead(a, R(i), n);
	return o === null ? null : { pending: o };
}
var uj = class {
	root;
	services;
	drag = null;
	views;
	marked = null;
	lifted = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.services = e.services, this.views = new dj(this.root, e.services?.keysOf), this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("pointerup", () => this.release(), !0), this.root.addEventListener("pointercancel", () => this.release(), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", () => this.endDrag(), !0);
	}
	handlePointerDown(e) {
		if (this.release(), !(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = this.liftableRow(e.target), n = t === null ? null : L(t.row);
		if (t === null || n === null) return;
		let r = _j(t.root, t.row);
		if (r === null ? !vj(e.target, t.row) : !r.contains(e.target)) return;
		r !== null && (Ff(t.root, Tj(t.row.parentElement ?? t.root), t.row), t.root.focus({ preventScroll: !0 }));
		let i = document.getSelection();
		i !== null && !i.isCollapsed && i.removeAllRanges(), n.draggable || (n.draggable = !0, this.lifted = n);
	}
	release() {
		this.lifted !== null && this.drag === null && (this.lifted.draggable = !1, this.lifted = null);
	}
	liftableRow(e) {
		let t = e.closest(Ud), n = t?.parentElement ?? null, r = n?.closest(I) ?? null;
		if (t === null || n === null || r === null || !t.matches(ej) || !n.hasAttribute("data-ui-items-host") || k(r) || !Uk(t)) return null;
		let i = r.hasAttribute("data-ui-rows-draggable") && !this.isSorted(r, n);
		return i || r.hasAttribute("data-ui-drag-kind") ? {
			root: r,
			row: t,
			moves: i
		} : null;
	}
	isSorted(e, t) {
		let n = qa(e);
		return this.services === void 0 || n === null ? !1 : TA(this.services.metadata.getItemsFilterSortMetadata(n), this.services.state, yA(t)).length > 0;
	}
	handleDragStart(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.liftableRow(e.target), n = t?.row.parentElement ?? null, r = t === null ? null : L(t.row);
		if (t === null || n === null || r === null || e.target !== r) return;
		this.drag = {
			...t,
			host: n
		};
		let i = Bk(t.root, n, Vk(t.row, Tj(n))), a = (i?.rows ?? []).filter((e) => e !== t.row).map((e) => L(e) ?? e);
		Cy(e, t.root, r, tj, R(t.row), a, Wk(i, t.moves)), Gk(e, i, () => this.endDrag()), this.dropView();
	}
	handleDragOver(e) {
		let t = this.ownDrag(e);
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let n = this.views.read(t.root, t.host), r = hj(t.host, e.target, e, n.flow, n.rows, n.boxes), i = r === null || this.indexOf(t, r.anchor, r.side, n.order) === null ? null : r, a = i === null ? 0 : Cj(n.rows, i, n.flow);
		e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), !(this.marked !== null && this.marked.view === n && xj(this.marked.place, i) && this.marked.offset === a) && (Ej(t.root, i, a), this.marked = {
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
		if (yj(t) !== yj(e.row)) return null;
		let i = pj(r ?? gj(e.host, this.services?.keysOf), R(e.row), R(t), n);
		return i === null ? null : i + Pk(e.host);
	}
	handleDragLeave(e) {
		let t = this.drag;
		t !== null && e instanceof DragEvent && Ey(e, t.host) && (Ej(t.root, null), this.dropView());
	}
	handleDrop(e) {
		let t = this.ownDrag(e);
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		e.preventDefault();
		let n = hj(t.host, e.target, e, bj(t.root, t.host), Tj(t.host)), r = n === null ? null : this.indexOf(t, n.anchor, n.side);
		this.endDrag(), r !== null && oj(t.row, r);
	}
	endDrag() {
		let e = this.drag;
		this.drag = null, this.dropView(), this.release(), e !== null && (wy(e.root, tj), Ej(e.root, null));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !e.altKey || !N(e, { alt: !0 }) || !aj.has(e.key) || !(e.target instanceof Element)) return;
		let t = Ef(e);
		if (t === null || !t.root.matches(".ui-items-view, .ui-table")) return;
		let n = lf(t.root), r = n === null ? null : bj(t.root, n), i = e.key === "ArrowLeft" || e.key === "ArrowRight";
		if (n === null || r === null || i && !r.across) return;
		let a = Tj(n), o = Af(a);
		if (o === null || this.liftableRow(o)?.moves !== !0) return;
		e.preventDefault();
		let s = e.key === "ArrowDown" || e.key === "ArrowRight", c = !i && t.root.matches(ij) ? ip(a, o, s) : a[a.indexOf(o) + (s ? 1 : -1)] ?? null, l = c === null ? null : this.indexOf({
			host: n,
			row: o
		}, c, s ? "after" : "before");
		l !== null && (oj(o, l), JA(l + 1, Fk(n, "data-ui-window-total") ?? Pk(n) + gj(n, this.services?.keysOf).length));
	}
}, dj = class {
	keysOf;
	view = null;
	changes = typeof MutationObserver == "function" ? new MutationObserver((e) => this.hear(e)) : null;
	constructor(e, t) {
		this.keysOf = t, e.addEventListener("scroll", () => this.drop(), !0);
	}
	read(e, t) {
		if (this.view !== null && this.view.host === t) return this.view;
		this.drop();
		let n = Tj(t);
		return this.view = {
			host: t,
			flow: bj(e, t),
			rows: n,
			boxes: n.map((e) => (L(e) ?? e).getBoundingClientRect()),
			order: gj(t, this.keysOf)
		}, this.changes?.observe(t, {
			childList: !0,
			subtree: !0,
			attributes: !0,
			attributeFilter: [
				"class",
				"hidden",
				zt,
				"style"
			]
		}), this.view;
	}
	drop() {
		this.view = null, this.changes?.disconnect();
	}
	hear(e) {
		e.some(fj) && this.drop();
	}
};
function fj(e) {
	return e.attributeName !== "style" || e.target instanceof Element && e.target.hasAttribute("data-ui-window-spacer");
}
function pj(e, t, n, r) {
	let i = e.indexOf(t);
	if (i < 0 || t === n) return null;
	let a = mj(e.filter((e) => e !== t), n, r);
	return a === i ? null : a;
}
function mj(e, t, n) {
	let r = e.indexOf(t);
	return r < 0 ? null : n === "before" ? r : r + 1;
}
function hj(e, t, n, r, i, a) {
	if (t.closest("[data-ui-group-header]")?.parentElement === e) return null;
	let o = t.closest(Ud);
	for (; o !== null && o.parentElement !== e;) o = o.parentElement?.closest(Ud) ?? null;
	if (o ??= wj(i, n, a), o === null) return null;
	let s = (L(o) ?? o).getBoundingClientRect();
	if ((r.across ? n.clientX < s.left + s.width / 2 : n.clientY < s.top + s.height / 2) === r.rightToLeft) return {
		anchor: o,
		side: "after"
	};
	let c = i[i.indexOf(o) - 1];
	return c !== void 0 && Sj(c, o, r) ? {
		anchor: c,
		side: "after"
	} : {
		anchor: o,
		side: "before"
	};
}
function gj(e, t) {
	switch (Nk(e)) {
		case "virtualized": return [...t?.(e) ?? G(e).map(R)];
		case "windowed": return G(e).map(R);
		default: return PA(e, G(e)).map(R);
	}
}
function _j(e, t) {
	let n = e.hasAttribute("data-ui-rows-drag-handle") ? t.querySelector(`:scope > .${_e}`) : null;
	return n !== null && n.getClientRects().length > 0 ? n : null;
}
function vj(e, t) {
	return hd(e, t) === null && e.closest("[data-ui-no-row-drag]") === null;
}
function yj(e) {
	return e.getAttribute("data-ui-group") ?? "";
}
function bj(e, t) {
	let n = e.matches(".ui-orientation--horizontal, .ui-items-view--wrap");
	return {
		across: n,
		rightToLeft: n && getComputedStyle(t).direction === "rtl"
	};
}
function xj(e, t) {
	return e === t || e !== null && t !== null && e.anchor === t.anchor && e.side === t.side;
}
function Sj(e, t, n) {
	if (yj(e) !== yj(t)) return !1;
	if (!n.across) return !0;
	let r = (L(e) ?? e).getBoundingClientRect(), i = (L(t) ?? t).getBoundingClientRect();
	return r.top < i.bottom && i.top < r.bottom;
}
function Cj(e, t, n) {
	let r = t.side === "after" ? e[e.indexOf(t.anchor) + 1] : void 0;
	if (r === void 0 || !Sj(t.anchor, r, n)) return -1;
	let i = (L(t.anchor) ?? t.anchor).getBoundingClientRect(), a = (L(r) ?? r).getBoundingClientRect(), o = n.across ? n.rightToLeft ? i.left - a.right : a.left - i.right : a.top - i.bottom;
	return Math.max(o, 0) / 2;
}
function wj(e, t, n) {
	let r = null, i = Infinity;
	for (let a = 0; a < e.length; a++) {
		let o = e[a], s = n?.[a] ?? (L(o) ?? o).getBoundingClientRect(), c = Math.max(s.left - t.clientX, 0, t.clientX - s.right), l = Math.max(s.top - t.clientY, 0, t.clientY - s.bottom), u = c * c + l * l;
		u < i && (r = o, i = u);
	}
	return r;
}
function Tj(e) {
	return G(e).filter((e) => e instanceof HTMLElement && e.matches(Ud) && L(e) !== null);
}
function Ej(e, t, n = 0) {
	let r = t === null ? null : L(t.anchor);
	for (let t of e.querySelectorAll(`[${ve}]`)) t !== r && (t.removeAttribute(ve), t.style.removeProperty(nj));
	if (r === null || t === null) return;
	r.getAttribute("data-ui-row-drop") !== t.side && r.setAttribute(ve, t.side);
	let i = `${n}px`;
	r.style.getPropertyValue(nj) !== i && r.style.setProperty(nj, i);
}
function Dj(e) {
	e.classList.remove(tj), e.querySelector(`:scope > [${y}]`)?.classList.remove(tj);
}
//#endregion
//#region src/interactions/tree-drop.ts
var Oj = "--ui-tree-drop-depth";
function kj(e) {
	return e.querySelector(`.${pr}`);
}
function Aj(e, t) {
	if (A(e)) return !1;
	let n = t?.getAttribute(Tr);
	return n === "true" || n !== "false" && e.hasAttribute("aria-expanded");
}
function jj(e, t) {
	let n = e.length === 0 ? null : t(e);
	return n === null || Aj(n, kj(n));
}
function Mj(e, t) {
	let n = kj(e);
	if (Aj(e, n)) return R(e);
	let r = n?.getAttribute("data-ui-tree-parent") ?? "";
	return jj(r, t) ? r : null;
}
function Nj(e, t, n = "", r) {
	for (let n of e.querySelectorAll(`[${mr}]`)) n !== t && (n.removeAttribute(mr), n.style.removeProperty(Oj));
	t !== null && (t.setAttribute(mr, n), r === void 0 ? t.style.removeProperty(Oj) : t.style.setProperty(Oj, String(r)));
}
function Pj(e, t, n) {
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
function Fj(e, t, n) {
	let r = e.find((e) => e.key === t);
	if (r === void 0) return null;
	let i = Ij(e, r, n);
	return i === null || !Lj(e, i.parent) ? null : i;
}
function Ij(e, t, n) {
	if (n === "in") {
		let n = Pj(e, t.key, !0);
		return n === null ? null : {
			parent: n,
			before: null
		};
	}
	if (n === "out") {
		let n = Pj(e, t.key, !1);
		return n === null ? null : {
			parent: n,
			before: zj(e, n, t.parent, !1)
		};
	}
	let r = Rj(e, t.parent), i = r.findIndex((e) => e.key === t.key), a = n === "up" ? -1 : 1, o = i + a;
	for (; o >= 0 && o < r.length && r[o].shown === !1;) o += a;
	return o < 0 || o >= r.length ? null : {
		parent: t.parent,
		before: n === "up" ? r[o].key : r[o + 1]?.key ?? null
	};
}
function Lj(e, t) {
	return t.length === 0 || e.find((e) => e.key === t)?.takesDrop === !0;
}
function Rj(e, t) {
	return e.filter((e) => e.parent === t);
}
function zj(e, t, n, r, i = /* @__PURE__ */ new Set()) {
	let a = Rj(e, t);
	for (let e = a.findIndex((e) => e.key === n) + 1; e > 0 && e < a.length; e++) if (!i.has(a[e].key) && (!r || a[e].shown !== !1)) return a[e].key;
	return null;
}
function Bj(e, t, n) {
	let r = Rj(e, n.parent).map((e) => e.key), i = new Set(t), a = n.before !== null && i.has(n.before) ? zj(e, n.parent, n.before, !1, i) : n.before, o = [], s = null;
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
var Vj = "drop:", Hj = "ui-row--cut", Uj = {
	code: "KeyX",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
}, Wj = {
	code: "KeyC",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
}, Gj = {
	code: "KeyV",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
};
function Kj(e) {
	return {
		dynamicParameters: (e) => {
			let t = qj(e.domEvent);
			return t === null ? null : [...e.dynamicParameters, JSON.stringify(t.drop)];
		},
		...Mk((t) => Jj(e, t), (t) => e?.settle(t))
	};
}
function qj(e) {
	let t = e instanceof CustomEvent ? e.detail : null;
	return t?.drop === void 0 ? null : t;
}
function Jj(e, t) {
	let n = qj(t)?.transfer ?? null;
	return n === null || e === void 0 ? null : e.ahead(n.source, n.target, n.keys, n.index);
}
var Yj = class {
	root;
	options;
	marked = null;
	clipboard = null;
	views;
	constructor(e) {
		this.root = e.root ?? document, this.options = e, this.views = new dj(this.root, e.keysOf), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", () => this.endDrag(), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e));
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent)) return;
		let t = this.dropOf(e);
		this.unmark(), t !== null && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = t.effect), t.landing.mark(), this.marked = t.target);
	}
	dropOf(e) {
		let t = Kk(e), n = e.target instanceof Element ? e.target : null, r = t === null || n === null ? null : this.targetOf(t, n);
		if (t === null || n === null || r === null) return null;
		let i = Xj(t, r, Zj(e)), a = i === null ? null : this.landingOf(r, n, e);
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
		let r = e.matches(".ui-items-view, .ui-table") ? lf(e) : null;
		if (r !== null) {
			let i = this.views.read(e, r), a = t !== null && n !== null ? hj(r, t, n, i.flow, i.rows, i.boxes) : Qj(i.rows);
			return {
				index: ((a === null ? null : mj(i.order, R(a.anchor), a.side)) ?? i.order.length) + Pk(r),
				folder: null,
				list: r,
				mark: () => a === null ? e.setAttribute(he, "") : Ej(e, a, Cj(i.rows, a, i.flow))
			};
		}
		if (e.classList.contains("ui-tree")) {
			let n = $j(e, t ?? document.activeElement);
			if (n === null) return null;
			let r = n.length === 0 ? lf(e) : eM(e, n);
			return {
				index: null,
				folder: n,
				list: null,
				mark: () => Nj(e, r)
			};
		}
		return {
			index: null,
			folder: null,
			list: null,
			mark: () => {
				e.setAttribute(he, ""), Dy(e, !0);
			}
		};
	}
	unmark() {
		let e = this.marked;
		this.marked = null, e !== null && (e.removeAttribute(he), Dy(e, !1), e.matches(".ui-items-view, .ui-table") ? Ej(e, null) : e.classList.contains("ui-tree") && Nj(e, null));
	}
	handleDragLeave(e) {
		this.marked !== null && e instanceof DragEvent && Ey(e, this.marked) && this.unmark();
	}
	handleDrop(e) {
		this.views.drop();
		let t = e instanceof DragEvent ? this.dropOf(e) : null;
		t !== null && (e.preventDefault(), this.unmark(), qk(), this.drop(t.drag, t.target, t.effect, t.landing));
	}
	drop(e, t, n, r) {
		let i = n === "move" && r.list !== null && r.index !== null && e.host.isConnected && e.root.matches(".ui-items-view, .ui-table") && t.getAttribute("data-ui-drag-kind") === e.kind && Nk(e.host) === "plain" && Nk(r.list) === "plain", a = {
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
		t.dispatchEvent(new CustomEvent(Vj + e.kind, {
			bubbles: !0,
			detail: a
		}));
	}
	endDrag() {
		this.unmark(), this.views.drop(), qk();
	}
	handleKeyDown(e) {
		e instanceof KeyboardEvent && !e.defaultPrevented && e.target instanceof Element && (e.key === "Escape" ? this.clipboard !== null && !M(e) && (this.clipboard.items.root.isConnected && e.preventDefault(), this.letGo()) : nd(e.target) || (_u(Gj, e) ? this.paste(e, e.target) : _u(Uj, e) ? this.take(e, e.target, !0) : _u(Wj, e) && this.take(e, e.target, !1)));
	}
	letGo() {
		for (let e of this.clipboard?.items.rows ?? []) (L(e) ?? e).classList.remove(Hj);
		this.clipboard = null;
	}
	paste(e, t) {
		let n = this.clipboard, r = n === null ? null : this.targetOf(n.items, t), i = n === null || r === null ? null : Xj(n.items, r, !n.cut);
		this.views.drop();
		let a = r === null || i === null ? null : this.landingOf(r, null, null);
		n !== null && r !== null && i !== null && a !== null && (e.preventDefault(), this.drop(n.items, r, i, a), n.cut && this.letGo());
	}
	take(e, t, n) {
		let r = document.getSelection();
		if (r !== null && !r.isCollapsed) return;
		let i = Tf(t), a = i === null ? null : lf(i.root);
		if (i === null || a === null || k(i.root) || !i.root.hasAttribute("data-ui-drag-kind")) return;
		let o = Tj(a), s = i.row ?? Af(o), c = s === null || !Uk(s) ? null : Bk(i.root, a, Vk(s, o));
		if (c !== null && c.effects.has(n ? "move" : "copy") && (e.preventDefault(), this.letGo(), this.clipboard = {
			items: c,
			cut: n
		}, n)) for (let e of c.rows) (L(e) ?? e).classList.add(Hj);
	}
};
function Xj(e, t, n) {
	let r = n || t.getAttribute("data-ui-drag-kind") !== e.kind ? "copy" : "move";
	return e.effects.has(r) ? r : n ? null : r === "move" ? "copy" : "move";
}
function Zj(e) {
	return Eu() ? e.altKey : e.ctrlKey;
}
function Qj(e) {
	let t = jf(e);
	return t === null ? null : {
		anchor: t,
		side: "after"
	};
}
function $j(e, t) {
	let n = t?.closest(".ui-tree__row") ?? null;
	return n === null || n.closest(".ui-tree") !== e ? "" : Mj(n, (t) => eM(e, t));
}
function eM(e, t) {
	return e.querySelector(`.${fr}[${b}="${C(t)}"]`);
}
//#endregion
//#region src/interactions/temporal-range.ts
function tM(e, t, n) {
	if (t === "start" || e.start === null) {
		let t = oM(n, e.start ?? n);
		return {
			start: t,
			end: e.end !== null && e.end.getTime() < t.getTime() ? null : e.end,
			active: "end",
			complete: !1
		};
	}
	return n.getTime() < sM(e.start).getTime() ? {
		start: oM(n, e.start),
		end: null,
		active: "end",
		complete: !1
	} : {
		start: e.start,
		end: oM(n, e.end ?? e.start),
		active: "end",
		complete: !0
	};
}
function nM(e, t, n) {
	if (t === null || n === null) return !1;
	let r = sM(e).getTime();
	return r > sM(t).getTime() && r < sM(n).getTime();
}
function rM(e, t) {
	return !t && e.start !== null && e.end !== null && sM(e.start).getTime() < sM(e.end).getTime();
}
function iM(e, t, n) {
	return !n && nM(e, t.start, t.end);
}
function aM(e) {
	return e.start !== null && e.end !== null && e.end.getTime() < e.start.getTime() ? {
		start: e.end,
		end: e.start
	} : e;
}
function oM(e, t) {
	return qs(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function sM(e) {
	return qs(e.getFullYear(), e.getMonth(), e.getDate());
}
//#endregion
//#region src/interactions/temporal-dom.ts
var K = "ui-temporal-input", cM = "ui-calendar", lM = `.${K}, .${cM}`, uM = "ui-temporal-input__value-input", dM = "ui-temporal-input__end-value-input", fM = "data-ui-temporal-range", pM = "data-ui-temporal-end", mM = "data-ui-temporal-mode", hM = "data-ui-temporal-format", gM = "data-ui-temporal-default-format", _M = "data-ui-temporal-min", vM = "data-ui-temporal-max", yM = "data-ui-temporal-step", bM = "data-ui-temporal-step-unit", xM = "data-ui-temporal-marked-days", SM = "data-ui-temporal-marked-only", CM = "data-ui-temporal-page-culture", wM = "data-ui-temporal-months", TM = "data-ui-temporal-months-genitive", EM = "data-ui-temporal-months-short", DM = "data-ui-temporal-daynames", OM = "data-ui-temporal-weekdays", kM = "data-ui-temporal-first-day", AM = "data-ui-temporal-am", jM = "data-ui-temporal-pm", MM = /* @__PURE__ */ new Set([
	hM,
	gM,
	_M,
	vM,
	wM,
	AM,
	jM,
	xM,
	SM
]), NM = 2e3;
function PM(e) {
	let t = e.getAttribute(mM);
	return t === "time" || t === "date-time" ? t : "date";
}
function FM(e) {
	let t = e.getAttribute(hM);
	return t === null || t.trim().length === 0 ? e.getAttribute(gM) ?? "" : t;
}
function IM(e) {
	let t = e.getAttribute(bM), n = Math.max(1, Math.trunc(Number(e.getAttribute(yM))) || 1);
	return {
		unit: t === "hour" || t === "minute" || t === "second" ? t : "day",
		hour: t === "hour" ? n : 1,
		minute: t === "minute" ? n : 1,
		second: t === "second" ? n : 1
	};
}
function LM(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function RM(e, t) {
	return t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function zM(e, t, n) {
	let r = new Date(e);
	return t === "hour" ? r.setHours(n) : t === "minute" ? r.setMinutes(n) : r.setSeconds(n), r;
}
function BM(e) {
	return {
		monthNames: VM(e, wM),
		monthGenitiveNames: VM(e, TM),
		abbreviatedMonthNames: VM(e, EM),
		dayNames: VM(e, DM),
		abbreviatedDayNames: VM(e, OM),
		amDesignator: e.getAttribute(AM) ?? "AM",
		pmDesignator: e.getAttribute(jM) ?? "PM"
	};
}
function VM(e, t) {
	return (e.getAttribute(t) ?? "").split("|");
}
function HM(e, t) {
	e.hasAttribute(CM) && (w(e, TM, t.monthGenitiveNames.join("|")), w(e, EM, t.abbreviatedMonthNames.join("|")), w(e, DM, t.dayNames.join("|")), w(e, OM, t.abbreviatedDayNames.join("|")), w(e, wM, t.monthNames.join("|")), w(e, AM, t.amDesignator), w(e, jM, t.pmDesignator), w(e, gM, GM(PM(e), IM(e), t)));
}
function UM(e) {
	for (let t = 0; t < e.length;) {
		let n = Vs(e, t);
		if (n === "h" || n === "hh") return !0;
		t += n?.length ?? 1;
	}
	return !1;
}
function WM(e, t, n) {
	if (!t) return String(e).padStart(2, "0");
	let r = e < 12 ? n.amDesignator : n.pmDesignator, i = String(cc(e));
	return r.length === 0 ? i : `${i} ${r}`;
}
function GM(e, t, n) {
	let r = t.unit === "second";
	return e === "date" ? n.date : e === "time" ? r ? n.longTime : n.shortTime : Ms(n, r);
}
function KM(e) {
	return e.hasAttribute(fM);
}
function qM(e) {
	return e !== null && e.hasAttribute(pM);
}
function JM(e) {
	return q(e, !1);
}
function q(e, t) {
	let n = YM(e, t);
	return n === null ? null : gN(n.value, PM(e));
}
function YM(e, t) {
	return e.querySelector(`.${t ? dM : uM}`);
}
function XM(e, t) {
	let n = e.getAttribute(t) ?? "", r = gN(n, PM(e)), i = oN(n);
	if (r === null || i === null) return r;
	let a = aN(e, !1), o = /* @__PURE__ */ new Date(ZM(r) - QM(i) * 6e4);
	if (a !== null) {
		let e = new Date(o.getTime() + QM(a) * 6e4);
		return qs(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate(), e.getUTCHours(), e.getUTCMinutes(), e.getUTCSeconds(), e.getUTCMilliseconds());
	}
	return $M(e) ? r : o;
}
function ZM(e) {
	let t = /* @__PURE__ */ new Date(0);
	return t.setUTCFullYear(e.getFullYear(), e.getMonth(), e.getDate()), t.setUTCHours(e.getHours(), e.getMinutes(), e.getSeconds(), e.getMilliseconds()), t.getTime();
}
function QM(e) {
	let t = /^([+-])(\d{2}):?(\d{2})?$/.exec(e);
	return t === null ? 0 : (t[1] === "-" ? -1 : 1) * (Number(t[2]) * 60 + Number(t[3] ?? "0"));
}
function $M(e) {
	return (YM(e, !1)?.value.trim() ?? "").length > 0 || (YM(e, !0)?.value.trim() ?? "").length > 0;
}
function eN(e) {
	let t = XM(e, _M), n = XM(e, vM), r = (e.getAttribute(xM) ?? "").split(" ").filter((e) => e.length > 0);
	return {
		min: t === null ? null : _N(t, "date"),
		max: n === null ? null : _N(n, "date"),
		marked: new Set(r),
		markedOnly: e.hasAttribute(SM)
	};
}
function tN(e, t) {
	return (e.min === null || t >= e.min) && (e.max === null || t <= e.max) && (!e.markedOnly || e.marked.has(t));
}
function nN(e, t, n) {
	cN(e, t === null ? "" : rN(e, t, n), n);
}
function rN(e, t, n) {
	let r = PM(e), i = _N(t, r);
	return r === "date-time" ? i + (aN(e, n) ?? sN(t)) : i;
}
var iN = /T\d{1,2}:\d{1,2}(?::\d{1,2}(?:\.\d+)?)?(Z|[+-]\d{2}(?::?\d{2})?)$/i;
function aN(e, t) {
	return oN(YM(e, t)?.value ?? "") ?? oN(YM(e, !t)?.value ?? "");
}
function oN(e) {
	return iN.exec(e.trim())?.[1] ?? null;
}
function sN(e) {
	let t = -e.getTimezoneOffset(), n = Math.abs(t);
	return `${t < 0 ? "-" : "+"}${vN(Math.floor(n / 60))}:${vN(n % 60)}`;
}
function cN(e, t, n) {
	let r = YM(e, n);
	r !== null && r.value !== t && (r.value = t, r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function lN(e, t) {
	let n = t.trim(), r = n.length === 0 ? null : Zs(n, FM(e), BM(e));
	return r === null ? n : _N(Ks(r), PM(e));
}
function uN(e) {
	if (!KM(e)) return;
	let t = {
		start: q(e, !1),
		end: q(e, !0)
	};
	if (aM(t) === t) return;
	let n = YM(e, !1)?.value ?? "";
	cN(e, YM(e, !0)?.value ?? "", !1), cN(e, n, !0);
}
function dN(e) {
	let t = XM(e, _M), n = XM(e, vM);
	if (t === null && n === null) return null;
	for (let r of KM(e) ? [!1, !0] : [!1]) {
		let i = q(e, r);
		if (i !== null && t !== null && i.getTime() < t.getTime()) return {
			key: "ui.value.before",
			args: { min: Is(t, FM(e), BM(e)) }
		};
		if (i !== null && n !== null && i.getTime() > n.getTime()) return {
			key: "ui.value.after",
			args: { max: Is(n, FM(e), BM(e)) }
		};
	}
	return null;
}
function fN(e) {
	return mN(e, pN(e, /* @__PURE__ */ new Date()));
}
function pN(e, t) {
	let n = XM(e, _M), r = XM(e, vM);
	return n !== null && t.getTime() < n.getTime() ? n : r !== null && t.getTime() > r.getTime() ? r : t;
}
function mN(e, t) {
	let n = IM(e), r = new Date(t);
	return r.setMilliseconds(0), r.setSeconds(n.unit === "second" ? Math.floor(r.getSeconds() / n.second) * n.second : 0), n.unit === "hour" ? r.setMinutes(0) : r.setMinutes(Math.floor(r.getMinutes() / n.minute) * n.minute), r.setHours(Math.floor(r.getHours() / n.hour) * n.hour), r;
}
var hN = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/;
function gN(e, t) {
	let n = e.trim();
	if (n.length === 0) return null;
	if (t === "time") {
		let e = hN.exec(n);
		return e === null ? null : new Date(NM, 0, 1, Number(e[1]), Number(e[2]), Number(e[3] ?? "0"));
	}
	let r = Gs(n);
	return r === null ? null : Ks(r);
}
function _N(e, t) {
	let n = `${vN(e.getHours())}:${vN(e.getMinutes())}:${vN(e.getSeconds())}`;
	if (t === "time") return n;
	let r = `${String(e.getFullYear()).padStart(4, "0")}-${vN(e.getMonth() + 1)}-${vN(e.getDate())}`;
	return t === "date" ? r : `${r}T${n}`;
}
function vN(e) {
	return String(e).padStart(2, "0");
}
//#endregion
//#region src/interactions/temporal-calendar.ts
var yN = "ui-temporal-input__day", bN = "ui-temporal-input__month", xN = 3, SN = "data-ui-temporal-nav", CN = "data-ui-temporal-day", wN = 366;
function TN(e) {
	let t = JM(e);
	return {
		view: YN(t ?? pN(e, /* @__PURE__ */ new Date())),
		pane: "days",
		focusedDay: t,
		activeEnd: "start",
		hoverDay: null,
		choosingEnd: !1
	};
}
function EN(e, t, n, r) {
	let i = JN("div", `${K}__calendar`), a = JN("div", `${K}__calendar-header`), o = eN(e), s = qN("previous", "‹", O.text("ui.picker.previous"));
	s.disabled = DN(o, t, -1) === null, a.append(s);
	let c = qN("pane", t.pane === "days" ? `${n.monthNames[t.view.getMonth()]} ${t.view.getFullYear()}` : String(t.view.getFullYear()));
	c.classList.add(`${K}__calendar-label`), a.append(c);
	let l = qN("next", "›", O.text("ui.picker.next"));
	return l.disabled = DN(o, t, 1) === null, a.append(l), i.append(a), i.append(t.pane === "days" ? jN(e, t, n, r, o) : MN(t, n, o)), i;
}
function DN(e, t, n) {
	let r = t.pane === "months", i = QN(t.view, n * (r ? 12 : 1));
	return kN(e, ON(i, r ? 4 : 7)) ? AN(e, i) : null;
}
function ON(e, t) {
	return _N(e, "date").slice(0, t);
}
function kN(e, t) {
	return (e.min === null || t >= e.min.slice(0, t.length)) && (e.max === null || t <= e.max.slice(0, t.length));
}
function AN(e, t) {
	let n = ON(t, 7), r = e.min !== null && n < e.min.slice(0, 7) ? e.min : e.max !== null && n > e.max.slice(0, 7) ? e.max : null, i = r === null ? null : gN(r, "date");
	return i === null ? t : YN(i);
}
function jN(e, t, n, r, i) {
	let a = WN(e), o = JN("div", `${K}__weekdays`);
	for (let e = 0; e < 7; e++) {
		let t = JN("span", `${K}__weekday`);
		t.textContent = n.abbreviatedDayNames[(a + e) % 7], o.append(t);
	}
	let s = JN("div", `${K}__days`), c = sM(/* @__PURE__ */ new Date()), l = KM(e), u = l ? q(e, !1) : r, d = l ? q(e, !0) : null, f = l && rM({
		start: u,
		end: d
	}, t.choosingEnd), p = XN(t.view, a);
	for (let e = 0; e < 42; e++) {
		let n = ZN(p, e), r = _N(n, "date"), a = JN("button", yN);
		a.type = "button", a.tabIndex = -1, a.textContent = String(n.getDate()), a.setAttribute(CN, r), n.getMonth() !== t.view.getMonth() && a.classList.add(`${yN}--outside`), $N(n, c) && (a.classList.add(`${yN}--today`), a.setAttribute("aria-current", "date")), i.marked.has(r) && a.classList.add(`${yN}--marked`);
		let o = u !== null && $N(n, u), m = d !== null && $N(n, d);
		a.setAttribute("aria-pressed", o || m ? "true" : "false"), (o || m) && a.classList.add(`${yN}--selected`), f && o && a.classList.add(`${yN}--period-start`), f && m && a.classList.add(`${yN}--period-end`), l && (o || m) && a.setAttribute("aria-description", O.text(o ? "ui.picker.start" : "ui.picker.end")), iM(n, {
			start: u,
			end: d
		}, t.choosingEnd) && a.classList.add(`${yN}--within`), tN(i, r) || (a.disabled = !0), s.append(a);
	}
	let m = JN("div", `${K}__calendar-pane`);
	return m.append(o, s), m;
}
function MN(e, t, n) {
	let r = JN("div", `${K}__months`);
	for (let i = 0; i < 12; i++) {
		let a = JN("button", bN);
		a.type = "button", a.textContent = t.abbreviatedMonthNames[i], a.setAttribute(SN, `month:${i}`), i === e.view.getMonth() && (a.classList.add(`${bN}--selected`), a.setAttribute("aria-current", "true")), kN(n, ON(qs(e.view.getFullYear(), i, 1), 7)) || (a.disabled = !0), r.append(a);
	}
	let i = [...r.children];
	return P(i, i.find((e) => e.getAttribute("aria-current") === "true" && !e.disabled) ?? i.find((e) => !e.disabled) ?? null), r;
}
function NN(e, t) {
	let n = [...e.parentElement?.querySelectorAll(".ui-temporal-input__month") ?? []], r = n.indexOf(e), i = r === -1 ? null : PN(t, r % xN);
	if (i === null) return null;
	for (let e = r + i.offset; e >= 0 && e < n.length; e += i.step) if (!n[e].disabled) return n[e];
	return null;
}
function PN(e, t) {
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
			offset: xN,
			step: xN
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
function FN(e) {
	let t = JN("div", `${K}__period-caption`);
	return t.textContent = O.text(e.activeEnd === "end" ? "ui.picker.end" : "ui.picker.start"), t;
}
function IN(e, t, n) {
	let r = eN(e);
	if (n.startsWith("month:")) {
		let i = qs(t.view.getFullYear(), Number(n.slice(6)), 1);
		return kN(r, ON(i, 7)) && (t.view = i, t.pane = "days", t.focusedDay = VN(r, BN(i, t.focusedDay ?? JM(e) ?? pN(e, /* @__PURE__ */ new Date())))), !0;
	}
	switch (n) {
		case "previous": return t.view = DN(r, t, -1) ?? t.view, !0;
		case "next": return t.view = DN(r, t, 1) ?? t.view, !0;
		case "pane": return t.pane = t.pane === "days" ? "months" : "days", !0;
		default: return !1;
	}
}
function LN(e, t, n) {
	if (KM(e)) {
		RN(e, t, n);
		return;
	}
	let r = oM(n, JM(e) ?? fN(e));
	t.focusedDay = r, t.view = YN(r), nN(e, r, !1);
}
function RN(e, t, n) {
	let r = tM({
		start: q(e, !1),
		end: q(e, !0)
	}, t.activeEnd, oM(n, fN(e)));
	t.focusedDay = r.end ?? r.start, t.view = YN(n), t.activeEnd = r.active, t.choosingEnd = !r.complete, t.hoverDay = null, nN(e, r.end, !0), nN(e, r.start, !1);
}
function zN(e, t, n, r = !1) {
	let i = HN(n), a = UN(t, n, WN(e), r);
	if (a === null) return null;
	let o = eN(e);
	if (i === 0) return VN(o, a);
	let s = a;
	for (let e = 0; e < wN; e++) {
		if (tN(o, _N(s, "date"))) return s;
		s = ZN(s, i);
	}
	return t;
}
function BN(e, t) {
	let n = qs(e.getFullYear(), e.getMonth() + 1, 0).getDate();
	return qs(e.getFullYear(), e.getMonth(), Math.min(t.getDate(), n), t.getHours(), t.getMinutes(), t.getSeconds());
}
function VN(e, t) {
	let n = _N(t, "date"), r = e.min !== null && n < e.min ? e.min : e.max !== null && n > e.max ? e.max : null, i = r === null ? null : gN(r, "date");
	return i === null ? t : oM(i, t);
}
function HN(e) {
	switch (e) {
		case "ArrowLeft": return -1;
		case "ArrowRight": return 1;
		case "ArrowUp": return -7;
		case "ArrowDown": return 7;
		default: return 0;
	}
}
function UN(e, t, n, r) {
	let i = (e.getDay() - n + 7) % 7;
	switch (t) {
		case "ArrowLeft": return ZN(e, -1);
		case "ArrowRight": return ZN(e, 1);
		case "ArrowUp": return ZN(e, -7);
		case "ArrowDown": return ZN(e, 7);
		case "PageUp": return QN(e, r ? -12 : -1);
		case "PageDown": return QN(e, r ? 12 : 1);
		case "Home": return ZN(e, -i);
		case "End": return ZN(e, 6 - i);
		default: return null;
	}
}
function WN(e) {
	let t = Number(e.getAttribute(kM));
	return Number.isInteger(t) && t >= 0 && t <= 6 ? t : 1;
}
function GN(e, t, n, r) {
	let i = [...e.querySelectorAll(`.${yN}`)];
	if (i.length === 0) return;
	let a = _N(sM(t.focusedDay ?? n ?? /* @__PURE__ */ new Date()), "date"), o = i.find((e) => e.getAttribute("data-ui-temporal-day") === a && !e.disabled) ?? i.find((e) => !e.disabled);
	o !== void 0 && (P(i, o), r && z(o));
}
function KN(e, t) {
	let n = t.activeEnd === "end" && t.hoverDay !== null ? q(e, !1) : null, r = t.hoverDay, i = n !== null && r !== null && sM(r).getTime() > sM(n).getTime();
	for (let t of e.querySelectorAll(`.${yN}`)) {
		let e = gN(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		t.classList.toggle(`${yN}--preview`, i && e !== null && nM(e, n, ZN(r, 1))), t.classList.toggle(`${yN}--preview-start`, i && e !== null && $N(e, n)), t.classList.toggle(`${yN}--preview-end`, i && e !== null && $N(e, r));
	}
}
function qN(e, t, n) {
	let r = JN("button", `${K}__nav`);
	return r.type = "button", r.textContent = t, r.setAttribute(SN, e), n !== void 0 && r.setAttribute("aria-label", n), r;
}
function JN(e, t) {
	let n = document.createElement(e);
	return n.className = t, n;
}
function YN(e) {
	return qs(e.getFullYear(), e.getMonth(), 1);
}
function XN(e, t) {
	let n = YN(e);
	return ZN(n, -((n.getDay() - t + 7) % 7));
}
function ZN(e, t) {
	return qs(e.getFullYear(), e.getMonth(), e.getDate() + t, e.getHours(), e.getMinutes(), e.getSeconds());
}
function QN(e, t) {
	let n = qs(e.getFullYear(), e.getMonth() + t, 1), r = qs(n.getFullYear(), n.getMonth() + 1, 0).getDate();
	return qs(n.getFullYear(), n.getMonth(), Math.min(e.getDate(), r), e.getHours(), e.getMinutes(), e.getSeconds());
}
function $N(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
//#endregion
//#region src/interactions/temporal-picker-engine.ts
var eP = "ui-temporal-input__field", tP = "ui-temporal-input__popup", nP = "ui-temporal-input--open", rP = "ui-calendar__body", iP = "ui-temporal-input__time-cell", aP = "ui-temporal-input__time-column", oP = 140, sP = "data-ui-temporal-toggle", cP = "data-ui-temporal-unit", lP = "data-ui-temporal-cell", uP = "data-ui-temporal-centred", dP = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	written = /* @__PURE__ */ new WeakSet();
	drawnLanguage = document.documentElement.lang;
	popups = new _v({
		show: ({ owner: e, popup: t }) => {
			e.classList.add(nP), t.addEventListener("wheel", this.onColumnWheel, { passive: !1 }), this.renderSurface(e, !0);
		},
		hide: ({ owner: e, popup: t }) => {
			for (let [t, n] of [...this.columnSettles]) window.clearTimeout(n), this.chooseCentredTime(e, t);
			this.columnSettles.clear(), this.wheelTurns.clear(), t.removeEventListener("wheel", this.onColumnWheel), e.classList.remove(nP);
		}
	});
	columnSettles = /* @__PURE__ */ new Map();
	wheelTurns = /* @__PURE__ */ new Map();
	onColumnWheel = (e) => this.handleColumnWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.arrive(this.root.querySelectorAll(lM)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = Ga(e.components, lM), n = e.propertyName === "Value" || e.propertyName === "EndValue";
			this.applyDisplay(t);
			for (let e of t) n && fP(e) && this.states.set(e, TN(e)), this.isShowing(e) && this.renderSurface(e);
		}), V(this.root, lM, { attributeFilter: [...MM] }, (e) => {
			for (let t of e) this.applyDisplay([t]), this.isShowing(t) && this.renderSurface(t);
		}), V(this.root, lM, {
			childList: !0,
			addedOnly: !0
		}, (e) => this.arrive(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), this.root.addEventListener("focusin", (e) => this.handleFieldFocus(e), !0), this.root.addEventListener("mouseover", (e) => this.handleDayHover(e), !0), this.root.addEventListener("mouseout", (e) => this.handleDayHover(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("scroll", (e) => this.handleColumnScroll(e), !0), this.root.addEventListener("blur", (e) => this.handleFieldBlur(e), !0), O.onChange(() => this.applyWords());
	}
	arrive(e) {
		let t = [...e];
		this.applyDisplay(t);
		for (let e of t) fP(e) && pP(e)?.firstElementChild === null && this.renderSurface(e);
	}
	applyWords() {
		let e = [...this.root.querySelectorAll(lM)], t = O.temporal;
		if (t !== null && O.language !== this.drawnLanguage) {
			this.drawnLanguage = O.language;
			for (let n of e) HM(n, t);
		}
		this.applyDisplay(e);
		for (let t of e) this.isShowing(t) && this.renderSurface(t);
	}
	get openPicker() {
		return this.popups.current;
	}
	isShowing(e) {
		return e === this.openPicker || fP(e);
	}
	calendarFor(e) {
		if (!(e instanceof Element)) return null;
		let t = e.closest(`.${rP}`)?.closest(".ui-calendar") ?? null;
		if (t !== null) return t;
		let n = this.openPicker;
		return n !== null && pP(n)?.contains(e) === !0 ? n : null;
	}
	applyDisplay(e) {
		for (let t of e) {
			let e = Ys(FM(t), EP()), n = Bs(FM(t)) ? "numeric" : "text";
			for (let r of t.querySelectorAll(`.${eP}`)) {
				if (r.placeholder !== e && (r.placeholder = e), r.inputMode !== n && (r.inputMode = n), r === document.activeElement && this.written.has(r)) continue;
				this.written.add(r);
				let i = YM(t, qM(r))?.value ?? "", a = gN(i, PM(t));
				a === null ? i.length === 0 && (r.value = "") : r.value = Is(a, FM(t), BM(t));
			}
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(eP)) return;
		let t = e.target.closest(`.${K}`), n = t === null ? null : YM(t, qM(e.target));
		if (t === null || n === null) return;
		let r = lN(t, e.target.value), i = gN(r, PM(t)), a = i === null ? r : rN(t, i, qM(e.target));
		if (mP(t, a)) {
			let n = q(t, qM(e.target));
			e.target.value = n === null ? "" : Is(n, FM(t), BM(t));
		} else qM(e.target) && (this.getState(t).choosingEnd = !1), n.value = a, n.dispatchEvent(new Event("change", { bubbles: !0 })), uN(t), this.applyDisplay([t]);
	}
	handleFieldFocus(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(eP)) return;
		let t = e.target.closest(`.${K}`);
		t !== null && KM(t) && (this.getState(t).activeEnd = qM(e.target) ? "end" : "start");
	}
	handleDayHover(e) {
		let t = this.calendarFor(e.target);
		if (t === null || !(e.target instanceof Element) || !KM(t)) return;
		let n = e.type === "mouseover" ? e.target.closest(`[${CN}]`) : null, r = this.getState(t), i = n === null ? null : gN(n.getAttribute("data-ui-temporal-day") ?? "", "date");
		(r.hoverDay?.getTime() ?? null) !== (i?.getTime() ?? null) && (r.hoverDay = i, KN(t, r));
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`[${CN}], .${iP}`) : null, n = this.calendarFor(t);
		n === null || t === null || t === document.activeElement || t.matches(":disabled") || (t.classList.contains(iP) ? kP(t) : this.followPointer(n, t));
	}
	followPointer(e, t) {
		let n = pP(e), r = gN(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		n !== null && r !== null && n.contains(document.activeElement) && (this.getState(e).focusedDay = r, P([...n.querySelectorAll(`.${yN}`)], t), Up(t));
	}
	handleFieldBlur(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(eP)) return;
		let t = e.target.closest(`.${K}`);
		t !== null && this.applyDisplay([t]);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${sP}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${K}`));
			return;
		}
		let n = this.calendarFor(e.target);
		if (n === null) return;
		let r = e.target.closest(`[${SN}]`);
		if (r !== null) {
			e.preventDefault(), this.applyNavigation(n, r.getAttribute("data-ui-temporal-nav") ?? "");
			return;
		}
		let i = e.target.closest(`[${CN}]`);
		if (i !== null) {
			e.preventDefault(), this.chooseDay(n, i.getAttribute("data-ui-temporal-day") ?? "");
			return;
		}
		let a = e.target.closest(`[${lP}]`);
		if (a !== null) {
			e.preventDefault();
			let t = a.closest(`[${cP}]`)?.getAttribute(cP);
			t != null && this.chooseTime(n, t, Number(a.getAttribute(lP)));
		}
	}
	applyNavigation(e, t) {
		let n = this.getState(e);
		if (IN(e, n, t)) this.renderSurface(e);
		else switch (t) {
			case "now":
				n.choosingEnd = !1, this.commit(e, fN(e), n.activeEnd === "end");
				return;
			case "clear":
				this.commit(e, null), KM(e) && this.commit(e, null, !0), n.activeEnd = "start", n.choosingEnd = !1, this.close();
				return;
			case "done":
				this.close();
				return;
			default: return;
		}
	}
	chooseDay(e, t) {
		let n = gN(t, "date");
		if (n === null || j(e) || k(e) || !tN(eN(e), t)) return;
		let r = this.getState(e);
		fP(e) && KM(e) && !r.choosingEnd && q(e, !1) !== null && q(e, !0) !== null && (r.activeEnd = "start");
		let i = YM(e, !1), a = `${i?.value ?? ""}|${YM(e, !0)?.value ?? ""}`;
		LN(e, r, n), fP(e) && `${i?.value ?? ""}|${YM(e, !0)?.value ?? ""}` === a && i?.dispatchEvent(new Event("change", { bubbles: !0 })), this.applyDisplay([e]), this.renderSurface(e);
	}
	chooseTime(e, t, n) {
		if (!Number.isFinite(n)) return;
		let r = KM(e) && this.getState(e).activeEnd === "end", i = zM(q(e, r) ?? fN(e), t, n);
		this.commit(e, i, r);
	}
	commit(e, t, n = !1) {
		nN(e, t, n), uN(e), this.applyDisplay([e]), this.isShowing(e) && this.renderSurface(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || M(e)) return;
		if (e.key === "ArrowDown" && N(e, { alt: !0 }) && e.target instanceof HTMLElement && e.target.classList.contains(eP)) {
			e.preventDefault(), this.toggle(e.target.closest(`.${K}`), qM(e.target) ? "end" : "start");
			return;
		}
		let t = this.calendarFor(e.target);
		if (t === null) return;
		if (e.target instanceof HTMLElement && e.target.classList.contains(iP)) {
			N(e) && jP(e);
			return;
		}
		if (e.target instanceof HTMLElement && e.target.classList.contains("ui-temporal-input__month")) {
			N(e) && AP(e, e.target);
			return;
		}
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains("ui-temporal-input__day") || !N(e, { shift: e.key === "PageUp" || e.key === "PageDown" })) return;
		let n = gN(e.target.getAttribute("data-ui-temporal-day") ?? "", "date");
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault(), this.chooseDay(t, _N(n, "date"));
			return;
		}
		let r = zN(t, n, e.key, e.shiftKey);
		if (r === null) return;
		e.preventDefault();
		let i = this.getState(t);
		i.focusedDay = r, i.view = YN(r), this.renderSurface(t, !0);
	}
	handleColumnScroll(e) {
		let t = this.openPicker;
		if (t === null || !(e.target instanceof Element)) return;
		let n = e.target.closest(`.${aP}`);
		n !== null && t.contains(n) && (window.clearTimeout(this.columnSettles.get(n)), this.columnSettles.set(n, window.setTimeout(() => {
			this.columnSettles.delete(n), this.chooseCentredTime(t, n);
		}, oP)));
	}
	handleColumnWheel(e) {
		if (this.openPicker === null || e.deltaY === 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${aP}`), n = t?.getAttribute(cP) ?? null;
		if (t === null || n === null || !this.openPicker.contains(t)) return;
		e.preventDefault();
		let { steps: r, carried: i } = hx(this.wheelTurns.get(n) ?? 0, mx(e).y);
		if (this.wheelTurns.set(n, i), r === 0) return;
		let a = [...t.querySelectorAll(`.${iP}`)].filter((e) => !e.disabled), o = a.findIndex((e) => e.classList.contains(`${iP}--selected`)), s = a[Math.min(a.length - 1, Math.max(0, Math.max(0, o) + r))];
		s !== void 0 && !s.classList.contains(`${iP}--selected`) && this.chooseTime(this.openPicker, n, Number(s.getAttribute(lP)));
	}
	chooseCentredTime(e, t) {
		if (!e.isConnected || !e.contains(t) || j(e) || k(e)) return;
		let n = Number(t.getAttribute(uP));
		if (Number.isFinite(n) && Math.abs(t.scrollTop - n) <= 1) return;
		let r = t.getAttribute(cP), i = xP(t);
		r === null || i === null || i.classList.contains(`${iP}--selected`) || (i.matches(":disabled") ? yP(e) : this.chooseTime(e, r, Number(i.getAttribute(lP))));
	}
	toggle(e, t) {
		let n = e?.querySelector(`.${tP}`) ?? null;
		if (e === null || n === null) return;
		if (this.openPicker === e) {
			this.close();
			return;
		}
		this.close();
		let r = this.getState(e);
		r.activeEnd = KM(e) ? t ?? (q(e, !1) === null ? "start" : q(e, !0) === null ? "end" : r.activeEnd) : "start", r.hoverDay = null, r.choosingEnd = !1;
		let i = q(e, r.activeEnd === "end") ?? JM(e);
		r.pane = "days", r.view = YN(i ?? pN(e, /* @__PURE__ */ new Date())), r.focusedDay = i;
		let a = e.querySelector(`[${sP}]`);
		this.popups.open({
			owner: e,
			popup: n,
			anchor: e.querySelector(".ui-temporal-input__row") ?? e,
			placement: { placement: "bottom-end" },
			openers: a === null ? [] : [a],
			returnFocus: () => OP(e, this.getState(e).activeEnd === "end")
		});
	}
	close() {
		this.popups.close();
	}
	getState(e) {
		let t = this.states.get(e);
		return t === void 0 && (t = TN(e), this.states.set(e, t)), t;
	}
	renderSurface(e, t = !1) {
		let n = pP(e);
		if (n === null) return;
		let r = fP(e), i = PM(e), a = this.getState(e), o = BM(e), s = KM(e), c = q(e, s && a.activeEnd === "end"), l = SP(n), u = CP(n), d = n.contains(document.activeElement);
		if (n.replaceChildren(), s && n.append(FN(a)), r) n.append(EN(e, a, o, c));
		else {
			let t = JN("div", `${K}__panes`);
			t.append(EN(e, a, o, c)), i === "date-time" && t.append(hP(e, c)), n.append(t, TP(i));
		}
		let f = u === null ? null : n.querySelector(`[${SN}="${C(u)}"]:not(:disabled)`);
		GN(n, a, c, t || d && l === null && f === null), KN(e, a), r || (vP(n), yP(n), wP(n, l)), f !== null && z(f), r || this.popups.reposition(e);
	}
};
function fP(e) {
	return e.classList.contains(cM);
}
function pP(e) {
	return e.querySelector(`.${fP(e) ? rP : tP}`);
}
function mP(e, t) {
	let n = eN(e), r = n.markedOnly ? gN(t, PM(e)) : null;
	return r !== null && !n.marked.has(_N(r, "date"));
}
function hP(e, t) {
	let n = IM(e), r = JN("div", `${K}__time`), i = JN("div", `${K}__time-columns`);
	for (let r of gP(n)) i.append(_P(e, r, LM(n, r), t));
	return r.append(i), r;
}
function gP(e) {
	return e.unit === "second" ? [
		"hour",
		"minute",
		"second"
	] : e.unit === "hour" ? ["hour"] : ["hour", "minute"];
}
function _P(e, t, n, r) {
	let i = JN("div", aP);
	i.setAttribute(cP, t), i.setAttribute("role", "listbox"), i.setAttribute("aria-label", O.text(t === "hour" ? "ui.picker.hours" : t === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"));
	let a = t === "hour" ? 24 : 60, o = r === null ? null : RM(r, t), s = t === "hour" && UM(FM(e)), c = BM(e), l = null;
	for (let u = 0; u < a; u += n) {
		let n = JN("button", iP);
		n.type = "button", n.tabIndex = -1, n.textContent = t === "hour" ? WM(u, s, c) : String(u).padStart(2, "0"), n.setAttribute(lP, String(u)), n.setAttribute("role", "option"), n.setAttribute("aria-selected", u === o ? "true" : "false"), u === o && n.classList.add(`${iP}--selected`), FP(e, t, u, r) ? n.disabled = !0 : (l === null || u === o) && (l = n), i.append(n);
	}
	return l !== null && (l.tabIndex = 0), i;
}
function vP(e) {
	let t = e.querySelector(`.${K}__calendar`), n = e.querySelector(`.${K}__time-columns`);
	t !== null && n !== null && (n.style.maxHeight = `${t.clientHeight}px`);
}
function yP(e) {
	for (let t of e.querySelectorAll(`.${aP}`)) {
		let e = t.querySelector(`.${iP}--selected`) ?? t.firstElementChild;
		if (!(e instanceof HTMLElement)) continue;
		let n = Math.max(0, (t.clientHeight - e.getBoundingClientRect().height) / 2);
		t.style.paddingTop = `${n}px`, t.style.paddingBottom = `${n}px`, bP(t, e), t.setAttribute(uP, String(t.scrollTop));
	}
}
function bP(e, t) {
	let n = t.getBoundingClientRect();
	e.scrollTop += n.top - e.getBoundingClientRect().top - (e.clientHeight - n.height) / 2;
}
function xP(e) {
	let t = e.getBoundingClientRect().top + e.clientHeight / 2, n = null, r = Infinity;
	for (let i of e.querySelectorAll(`.${iP}`)) {
		let e = i.getBoundingClientRect(), a = Math.abs(e.top + e.height / 2 - t);
		a < r && (r = a, n = i);
	}
	return n;
}
function SP(e) {
	let t = document.activeElement;
	return !(t instanceof HTMLElement) || !e.contains(t) || !t.classList.contains(iP) ? null : t.closest(`.${aP}`)?.getAttribute(cP) ?? null;
}
function CP(e) {
	let t = document.activeElement;
	return t instanceof HTMLElement && e.contains(t) ? t.getAttribute(SN) : null;
}
function wP(e, t) {
	if (t === null) return;
	let n = e.querySelector(`.${aP}[${cP}="${t}"]`)?.querySelector(`.${iP}--selected`) ?? null;
	n !== null && z(n);
}
function TP(e) {
	let t = JN("div", `${K}__popup-footer`);
	return t.append(qN("now", O.text(e === "date" ? "ui.picker.today" : "ui.picker.now"))), t.append(qN("clear", O.text("ui.picker.clear"))), t.append(qN("done", O.text("ui.picker.done"))), t;
}
function EP() {
	return {
		year: DP("ui.picker.letter.year", Js.year),
		month: DP("ui.picker.letter.month", Js.month),
		day: DP("ui.picker.letter.day", Js.day),
		hour: DP("ui.picker.letter.hour", Js.hour),
		minute: DP("ui.picker.letter.minute", Js.minute),
		second: DP("ui.picker.letter.second", Js.second)
	};
}
function DP(e, t) {
	let n = O.lookup(e);
	return n === void 0 || n.trim().length === 0 ? t : n;
}
function OP(e, t) {
	for (let n of e.querySelectorAll(`.${eP}`)) if (qM(n) === t) return n;
	return e.querySelector(`.${eP}`);
}
function kP(e) {
	let t = document.activeElement;
	t instanceof HTMLElement && t.classList.contains(iP) && Up(e);
}
function AP(e, t) {
	if (!_d(e.key, "both")) return;
	e.preventDefault();
	let n = NN(t, e.key);
	yd([...n?.parentElement?.children ?? []], n);
}
function jP(e) {
	let t = e.target, n = t.closest(`.${aP}`);
	if (n === null) return;
	let r = e.key === "ArrowLeft" || e.key === "ArrowRight" ? NP(n, e.key === "ArrowRight" ? 1 : -1) : MP(n, t, e.key);
	r !== null && (e.preventDefault(), r.focus({ preventScroll: !0 }), PP(r));
}
function MP(e, t, n) {
	let r = [...e.querySelectorAll(`.${iP}`)];
	return n === "PageUp" || n === "PageDown" ? np(n, r.filter(F), t, "vertical") ?? t : gd({
		key: n,
		items: r,
		current: t,
		axis: "vertical",
		loop: !1
	});
}
function NP(e, t) {
	let n = [...e.parentElement?.querySelectorAll(`.${aP}`) ?? []], r = n[n.indexOf(e) + t];
	return r === void 0 ? null : r.querySelector(`.${iP}--selected`) ?? r.querySelector(`.${iP}:not(:disabled)`);
}
function PP(e) {
	let t = e.closest(`.${aP}`);
	t !== null && (bP(t, e), t.setAttribute(uP, String(t.scrollTop)));
}
function FP(e, t, n, r) {
	let i = XM(e, _M), a = XM(e, vM);
	if (i === null && a === null) return !1;
	let o = zM(r ?? fN(e), t, n), s = new Date(o), c = new Date(o);
	return t === "hour" ? (s.setMinutes(0, 0, 0), c.setMinutes(59, 59, 999)) : t === "minute" && (s.setSeconds(0, 0), c.setSeconds(59, 999)), i !== null && c.getTime() < i.getTime() || a !== null && s.getTime() > a.getTime();
}
//#endregion
//#region src/rendering/theme-choice.ts
var IP = `[${Jr}="${Xr}"] [${Yr}]`, LP = "ui-theme-switcher__label-text--current";
function RP() {
	let e = document.documentElement.getAttribute(Wr);
	return e === "light" || e === "dark" ? e : "auto";
}
function zP(e, t) {
	let n = e.getAttribute(Yr) === t;
	if (e.getAttribute("role") === "option") {
		let t = n ? "true" : "false";
		e.getAttribute("aria-selected") !== t && e.setAttribute("aria-selected", t);
	} else e.classList.toggle(LP, n);
}
//#endregion
//#region src/interactions/popup-list.ts
var BP = new OE();
function VP(e, t, n, r, i = !1, a = !0) {
	let o = r ?? (a ? null : n.find(F) ?? null);
	o !== null && P(n, o);
	let s = e.open({
		...t,
		focus: a && r !== null ? r : !1
	});
	return s && a && r === null && am(t.popup, n, i), s;
}
function HP(e, t) {
	let n = e.target instanceof HTMLElement && t.includes(e.target) ? e.target : null, r = kE(e);
	if (r !== null) return e.preventDefault(), yd(t, WP(t, n, r)), !0;
	if (!_d(e.key, "vertical") || !N(e)) return !1;
	let i = gd({
		key: e.key,
		items: t,
		current: n,
		axis: "vertical"
	});
	return i !== null && e.preventDefault(), yd(t, i), !0;
}
var UP = {
	character: kE,
	entry: WP
};
function WP(e, t, n) {
	let r = e.filter(F), i = r[0]?.parentElement;
	return i == null ? null : BP.next({
		owner: i,
		character: n,
		entries: r,
		current: t,
		words: A_,
		context: i
	});
}
function GP(e, t) {
	e !== document.activeElement && F(e) && (P(t, e), Up(e));
}
//#endregion
//#region src/interactions/switcher-list.ts
var KP = class {
	parts;
	selector;
	menus;
	constructor(e) {
		this.parts = e, this.selector = `[${e.attribute}]`, this.menus = new _v({
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
		return e.getAttribute(this.parts.attribute) === Xr;
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
		VP(this.menus, {
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
		i !== null && t(n, r) && !this.menus.isOpen(n) && (e.key === "ArrowDown" || e.key === "ArrowUp") && N(e) ? (e.preventDefault(), this.open(n, i, e.key === "ArrowUp")) : this.menus.isOpen(n) && HP(e, r);
	}
	handlePointerMove(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${this.parts.choiceClass}`), n = t === null ? null : this.switcherOf(t);
		t !== null && n !== null && this.menus.isOpen(n) && GP(t, this.choicesOf(n));
	}
}, qP = `[${Jr}="${Xr}"]`, JP = "ui-theme-switcher__choice", YP = class {
	options;
	root;
	list = new KP({
		attribute: Jr,
		menuClass: "ui-theme-switcher__menu",
		choiceClass: JP,
		openClass: "ui-theme-switcher--open",
		triggerSelector: `.${Ni}`
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.list.handleKeyDown(e, (e) => this.list.isField(e))), this.root.addEventListener("pointermove", (e) => this.list.handlePointerMove(e)), new MutationObserver(() => this.showTheme()).observe(document.documentElement, {
			attributes: !0,
			attributeFilter: [Wr]
		}), V(this.root, qP, {
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
			e.preventDefault(), this.apply(XP() === "dark" ? "Light" : "Dark");
			return;
		}
		let n = e.target.closest(`.${JP}`);
		if (n !== null) {
			e.preventDefault(), this.choose(t, n.getAttribute(Yr));
			return;
		}
		let r = e.target.closest(`.${Ni}`);
		r === null || k(r) || (e.preventDefault(), this.list.toggle(t, r));
	}
	choose(e, t) {
		this.list.close(e), t !== null && this.apply(t === "light" ? "Light" : t === "dark" ? "Dark" : null);
	}
	apply(e) {
		this.options.effects.apply({
			effect: {
				kind: ra.SetTheme,
				mode: e
			},
			dom: this.options.dom
		});
	}
	showTheme(e) {
		let t = RP();
		if (e === void 0) for (let e of this.root.querySelectorAll(IP)) zP(e, t);
		else for (let n of e) for (let e of n.querySelectorAll(`[${Yr}]`)) zP(e, t);
	}
};
function XP() {
	let e = RP();
	return e === "light" || e === "dark" ? e : window.matchMedia?.("(prefers-color-scheme: dark)").matches === !0 ? "dark" : "light";
}
//#endregion
//#region src/interactions/language-switcher-engine.ts
var ZP = `.ui-language-switcher__trigger, .${Ni}`, QP = "ui-language-switcher__label-text", $P = "ui-language-switcher__label-text--current", eF = "ui-language-switcher__label-text--page", tF = "ui-language-switcher__choice", nF = "ui.language.switch", rF = "ui.language.current", iF = class {
	options;
	root;
	list = new KP({
		attribute: qr,
		menuClass: "ui-language-switcher__menu",
		choiceClass: tF,
		openClass: "ui-language-switcher--open",
		triggerSelector: ZP
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.list.handleKeyDown(e, (e, t) => this.opensList(e, t))), this.root.addEventListener("pointermove", (e) => this.list.handlePointerMove(e)), O.onChange(() => this.showLanguage(O.language));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${tF}`), n = this.list.switcherOf(e.target);
		if (n === null) return;
		if (t !== null) {
			e.preventDefault(), this.choose(n, t.getAttribute(Zr));
			return;
		}
		let r = e.target.closest(ZP);
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
				kind: ra.SetLanguage,
				language: t
			},
			dom: this.options.dom
		});
	}
	showLanguage(e) {
		for (let t of this.root.querySelectorAll(`[${qr}]`)) {
			let n = t.querySelector(`:scope > :is(${ZP})`);
			if (n === null) continue;
			let r = this.list.choicesOf(t), i = this.list.chosenAttribute(t);
			for (let t of r) t.setAttribute(i, t.getAttribute("data-ui-language") === e ? "true" : "false");
			for (let t of n.querySelectorAll(`.${QP}`)) {
				let n = t.getAttribute(Zr) === e;
				t.classList.toggle($P, n), t.classList.contains(eF) && t.toggleAttribute("hidden", !n);
			}
			if (this.list.isField(t)) continue;
			let a = aF(sl(t, Re)), o = (r.find((t) => t.getAttribute("data-ui-language") !== e) ?? r[0]).getAttribute("data-ui-language") ?? "", [s, c] = r.length === 2 ? [nF, {
				language: oF(r, e),
				code: sF(e),
				other: oF(r, o),
				otherCode: sF(o)
			}] : [rF, {
				language: oF(r, e),
				code: sF(e)
			}];
			O.write(n, "aria-label", s, c), a && O.write(t, Re, s, c);
		}
	}
};
function aF(e) {
	return D(e) && (e.key === nF || e.key === rF);
}
function oF(e, t) {
	let n = e.find((e) => e.getAttribute(Zr) === t)?.textContent;
	if (n != null && n.length > 0) return n;
	try {
		let e = new Intl.DisplayNames([t], { type: "language" }).of(t) ?? t;
		return e.charAt(0).toLocaleUpperCase(t) + e.slice(1);
	} catch {
		return sF(t);
	}
}
function sF(e) {
	return e.split("-")[0].toUpperCase();
}
//#endregion
//#region src/interactions/action-bar.ts
var cF = `${Me}__button`, lF = `${Me}__more`, uF = `${cF}--icon`, dF = "ui-text__icon", fF = `.ui-button__content .${dF}`, pF = ".ui-button__content .ui-text__title", mF = /* @__PURE__ */ new WeakMap();
function hF(e) {
	let t = [], n = !1;
	for (let r of e.querySelectorAll(Gn)) gF(r, e) && (r.hasAttribute("data-ui-in-action-bar") && !r.matches("[data-ui-menu-group] > .ui-menu-item") ? t.push(r) : n = !0);
	return {
		entries: t,
		more: n
	};
}
function gF(e, t) {
	for (let n = e; n !== null && n !== t; n = n.parentElement) if (!n.hasAttribute("data-ui-menu-left-out") && getComputedStyle(n).display === "none") return !1;
	return getComputedStyle(e).visibility !== "hidden";
}
function _F(e, t) {
	let n = t.entries.map((e) => vF(e, t));
	return t.more && t.openMore !== void 0 && n.push(bF(t.openMore)), e.replaceChildren(...n), n;
}
function vF(e, t) {
	let n = xF(cF), r = CF(e), i = yF(e);
	return i === null ? n.textContent = r : (n.classList.add(uF), n.append(i), n.setAttribute("aria-label", r)), t.role === "menuitem" && n.setAttribute("role", "menuitem"), k(e) && (n.classList.add(Ci), n.setAttribute("aria-disabled", "true")), e.getAttribute("data-ui-menu-item-kind") === "check" && n.setAttribute("aria-pressed", e.getAttribute("aria-checked") === "true" ? "true" : "false"), mF.set(n, e), n.addEventListener("click", () => t.press(e, n)), n;
}
function yF(e) {
	let t = e.querySelector(fF);
	if (t === null || !t.className.split(" ").some(No)) return null;
	let n = document.createElement("span");
	n.className = t.className, n.classList.remove(dF), n.setAttribute(ko, ""), n.setAttribute("aria-hidden", "true");
	let r = t.style.getPropertyValue(Ao);
	return r.length > 0 && n.style.setProperty(Ao, r), n;
}
function bF(e) {
	let t = xF(`${cF} ${lF}`);
	return t.setAttribute("aria-haspopup", "menu"), O.write(t, "aria-label", "ui.actionbar.more"), t.addEventListener("click", () => e(t)), t;
}
function xF(e) {
	let t = document.createElement("button");
	return t.setAttribute("type", "button"), t.className = `${e} ${Ri}`, t.tabIndex = -1, t;
}
function SF(e) {
	return mF.get(e) ?? null;
}
function CF(e) {
	return e.querySelector(pF)?.textContent?.trim() ?? "";
}
//#endregion
//#region src/interactions/long-press.ts
var wF = 500, TF = 150, EF = 10, DF = /* @__PURE__ */ new WeakSet(), OF = "ui-long-press-hold", kF = "ui-long-press-hold-end";
function AF(e) {
	return DF.has(e);
}
var jF = class {
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
		let n = e.target, r = t.clientX ?? 0, i = t.clientY ?? 0, a = this.shows === void 0 ? null : setTimeout(() => this.showHold(), TF);
		this.press = {
			pointerId: t.pointerId ?? 0,
			x: r,
			y: i,
			target: n,
			timer: setTimeout(() => this.fireHeld(), wF),
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
		}, t.dispatchEvent(new CustomEvent(OF, {
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
		(t.part.isConnected ? t.part : this.root).dispatchEvent(new CustomEvent(kF, {
			bubbles: !0,
			detail: n
		}));
	}
	handleMove(e) {
		let t = e, n = this.press, r = this.openedAt;
		r !== null && t.pointerId === r.pointerId && Math.hypot((t.clientX ?? r.x) - r.x, (t.clientY ?? r.y) - r.y) > EF && (this.slid = !0, (this.answered?.closest("[data-ui-splitting]") ?? null) !== null && this.leaveMenuToDrag()), n !== null && t.pointerId === n.pointerId && Math.hypot((t.clientX ?? n.x) - n.x, (t.clientY ?? n.y) - n.y) > EF && this.cancel();
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
		DF.add(t), e.target.dispatchEvent(t), this.answered = t.defaultPrevented ? e.target : null, this.openedAt = this.answered === null ? null : {
			pointerId: e.pointerId,
			x: e.x,
			y: e.y
		}, this.endHold(this.answered !== null);
	}
	handleContextMenu(e) {
		if (DF.has(e)) return;
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
		this.dragging && n !== null && t.clientX !== void 0 && t.clientY !== void 0 && Math.hypot(t.clientX - n.x, t.clientY - n.y) > EF && this.leaveMenuToDrag();
	}
	endDrag() {
		this.dragging = !1;
	}
	handleClick(e) {
		let t = e.target instanceof Element ? e.target : null;
		this.answered === null || t === null || this.slid && t.closest("[data-ui-context-menu]") !== null || (this.answered = null, e.preventDefault(), e.stopImmediatePropagation());
	}
}, MF = [
	"md",
	"xl",
	"xxl"
], NF = {
	md: Sh("md"),
	xl: Sh("xl"),
	xxl: Sh("xxl")
}, PF = Sh("md");
function FF(e, t) {
	return IF(e) && !(e.hasAttribute(kn(t)) && !RF(e, t) && LF(PF));
}
function IF(e) {
	let t = e.getAttribute(Dn);
	if (t === null) return !1;
	let n = NF[t];
	return n === void 0 || !LF(n);
}
function LF(e) {
	return typeof matchMedia == "function" && matchMedia(e).matches;
}
function RF(e, t) {
	return e.querySelector(`:scope > [${Fn}="${C(t)}"][${An}]`) !== null;
}
//#endregion
//#region src/rendering/menu-shape.ts
var zF = "data-ui-menu-rail-list", BF = ["left-side", "right-side"];
function VF(e) {
	let t = e.getAttribute(Mn), n = e.classList.contains(Vn);
	if (t === null && !n && !e.hasAttribute(zF)) return !1;
	let r = HF(e, t);
	return e.classList.toggle(Vn, r), e.toggleAttribute(zF, t === null && !r), r !== n;
}
function HF(e, t) {
	let n = UF(e);
	if (n !== null) return !n.hasAttribute("data-ui-rail-drawer") && (t === null || t.split(" ").includes("base"));
	if (t === null) return !0;
	let r = typeof matchMedia == "function" ? Eh() : "base";
	return t.split(" ").includes(r);
}
function UF(e) {
	let t = e.closest(`[${Fn}]`), n = t?.getAttribute(Fn), r = t?.parentElement;
	return t === null || n == null || !BF.includes(n) || r == null ? null : FF(r, n) ? t : null;
}
//#endregion
//#region src/state/client-store.ts
var WF = "ne.ui", GF = "boot", KF = /* @__PURE__ */ new Set(), qF = class {
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
		let r = this.resolveKey(e, GF);
		if (r !== null) try {
			let e = JF(window.localStorage.getItem(r));
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
			return KF.has(n) || (KF.add(n), l("client state is not kept for a component with no authored id.", {
				slot: t,
				component: e
			})), null;
		}
		return `${WF}:${n}:${t}`;
	}
};
function JF(e) {
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
var YF = "menu-current", XF = `[${fn}]`;
function ZF(e) {
	for (let t = e.closest(XF); t !== null; t = t.parentElement?.closest(XF) ?? null) $F(t);
}
function QF(e) {
	for (let t of e.querySelectorAll(XF)) $F(t);
	ZF(e);
}
function $F(e) {
	let t = e.querySelector(`.${Bn}`) !== null;
	e.hasAttribute("data-ui-menu-holds-current") !== t && e.toggleAttribute(hn, t);
}
//#endregion
//#region src/updates/menu-icons.ts
var eI = "menu-icons", tI = "ui-menu__host", nI = `:scope > :not([${_n}]) > .${Rn}[${Gi}]`;
function rI(e) {
	let t = e.closest(`.${tI}`);
	t !== null && aI(t);
}
function iI(e) {
	for (let t of e.querySelectorAll(`.${tI}`)) aI(t);
}
function aI(e) {
	let t = e.querySelector(nI) !== null;
	e.hasAttribute("data-ui-menu-icons") !== t && e.toggleAttribute(gn, t);
}
//#endregion
//#region src/interactions/menu-group-engine.ts
var oI = "ui-menu__submenu", sI = fn, cI = mn, lI = "data-ui-menu-flyout", uI = `[${lI}], ${ki}`, dI = "data-ui-menu-unfolded", fI = pn, pI = "left-side", mI = "right-side", hI = "[data-ui-root]", gI = `[${jn}] .${Ln}, .${Ln}[${Mn}]`, _I = "menu-open-group", vI = B.normal * 5, yI = Qe("click"), bI = class {
	root;
	store = new qF();
	seenCollapsed = /* @__PURE__ */ new WeakMap();
	flyouts = new _v({
		show: ({ owner: e, popup: t }) => {
			e.setAttribute(cI, ""), t.setAttribute(lI, "");
		},
		hide: ({ owner: e, popup: t }) => {
			e.removeAttribute(cI), queueMicrotask(() => vh(t, vI, () => {
				this.flyouts.isOpen(e) || t.removeAttribute(lI);
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
		let t = this.root.querySelectorAll(`.${Ln}`);
		TI(t), this.reconcileEach(t);
		for (let e of t) QF(e), iI(e);
		V(this.root, `.${Ln}`, {
			childList: !0,
			attributeFilter: [dn]
		}, (e) => {
			TI(e), this.reconcileEach(e);
			for (let t of e) QF(t), iI(t);
		});
		for (let e of this.root.querySelectorAll(`[${sI}]`)) xI(e);
		V(this.root, `[${sI}]`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [cI]
		}, (e) => {
			for (let t of e) xI(t);
		}), Th(() => this.closeBarFlyout(), MF), Th(() => this.refitShapes()), V(this.root, hI, { attributeFilter: [kn(pI), kn(mI)] }, () => this.refitShapes());
	}
	refitShapes() {
		let e = this.root.querySelectorAll(gI);
		TI(e), this.reconcileEach(e);
	}
	closeBarFlyout() {
		let e = this.flyouts.current;
		e !== null && e.closest("[data-ui-bottom-bar]") !== null && this.flyouts.close(e);
	}
	reconcileEach(e) {
		for (let t of e) {
			let e = jI(t), n = this.seenCollapsed.get(t);
			n !== e && (this.seenCollapsed.set(t, e), n === void 0 ? this.restore(t, e) : this.handleCollapsedChange(t, e));
		}
	}
	restore(e, t) {
		t ? this.closeGroups(e) : this.openResolvedGroup(e);
	}
	handleCollapsedChange(e, t) {
		this.flyouts.close(), SI(e), this.closeGroups(e), e.hasAttribute("data-ui-folding") && e.setAttribute(dI, ""), t || this.openResolvedGroup(e);
		for (let t of e.querySelectorAll(`[${sI}]`)) xI(t);
	}
	openResolvedGroup(e) {
		let t = this.groupOf(e.querySelector(`.${Bn}`), e);
		if (t !== null && !t.hasAttribute(fI)) {
			this.openInline(t);
			return;
		}
		let n = e.classList.contains("ui-menu--nested") ? null : this.store.read(e, _I), r = n === null ? null : this.findGroup(e, n);
		r !== null && this.openInline(r);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Rn}`), n = this.flyouts.current, r = n === null ? null : this.submenuOf(n);
		if (r !== null && r.contains(e.target)) {
			t !== null && r.contains(t) && EI(t) && this.flyouts.close();
			return;
		}
		let i = t === null ? null : this.ownGroupOf(t);
		if (t === null || i === null) {
			this.flyouts.close();
			return;
		}
		e.preventDefault();
		let a = i.closest(`.${Ln}`);
		a !== null && (AI(i) ? this.toggleFlyout(a, i, t) : this.toggleInline(a, i));
	}
	toggleInline(e, t) {
		let n = e.classList.contains(Hn);
		e.setAttribute(dI, ""), t.closest("[data-ui-menu-searching]") === null ? t.hasAttribute(cI) ? (t.removeAttribute(cI), n || this.store.write(e, _I, null)) : (this.closeGroups(e), this.openInline(t), n || this.store.write(e, _I, t.getAttribute(b))) : t.toggleAttribute(cI);
	}
	openInline(e) {
		e.setAttribute(cI, "");
	}
	closeGroups(e) {
		for (let t of e.querySelectorAll(`[${sI}][${cI}]`)) t.hasAttribute(fI) || t.removeAttribute(cI);
	}
	toggleFlyout(e, t, n) {
		let r = this.submenuOf(t);
		if (r === null) return;
		let i = this.flyouts.isOpen(t);
		if (this.flyouts.close(), i) return;
		SI(e), this.closeGroups(e);
		let a = n.closest(uI) ?? void 0;
		if (!this.flyouts.open({
			owner: t,
			popup: r,
			anchor: n,
			placement: {
				placement: `${CI(e)}-start`,
				surface: a,
				alignEntries: !0
			}
		})) return;
		let o = r.querySelector(`:scope > .${Ln}`);
		o !== null && !Ip() && am(o, DI(o));
	}
	findGroup(e, t) {
		for (let n of e.querySelectorAll(`[${sI}]`)) if (n.getAttribute("data-ui-key") === t) return n;
		return null;
	}
	ownGroupOf(e) {
		return e.matches("[data-ui-menu-group] > .ui-menu-item") ? e.parentElement : null;
	}
	groupOf(e, t) {
		let n = e?.closest(`[${sI}]`) ?? null;
		return n !== null && t.contains(n) ? n : null;
	}
	submenuOf(e) {
		return e.querySelector(`:scope > .${oI}`);
	}
};
function xI(e) {
	let t = e.querySelector(`:scope > .${Rn}`);
	t !== null && (t.setAttribute(yI, ""), t.setAttribute($e, ""), t.setAttribute("aria-expanded", e.hasAttribute(cI) ? "true" : "false"), AI(e) ? t.setAttribute("aria-haspopup", "menu") : t.removeAttribute("aria-haspopup"));
}
function SI(e) {
	for (let t of e.querySelectorAll(`[${lI}]`)) t.removeAttribute(lI);
}
function CI(e) {
	return wI(e) ? "top" : e.classList.contains("ui-side--right") ? "left" : e.classList.contains("ui-side--top") ? "bottom" : e.classList.contains("ui-side--bottom") ? "top" : "right";
}
function wI(e) {
	let t = e.closest(`[${An}]`);
	return e.classList.contains("ui-menu--rail") && t?.parentElement !== null && t?.parentElement !== void 0 && typeof matchMedia == "function" && FF(t.parentElement, pI);
}
function TI(e) {
	for (let t of e) VF(t);
}
function EI(e) {
	let t = e.closest(`.${Rn}`);
	return t !== null && t.matches(".ui-menu-item:not([data-ui-menu-item-kind=\"header\"], [data-ui-menu-item-kind=\"separator\"])") && !t.matches("[data-ui-menu-group] > .ui-menu-item, .ui-menu-item[data-ui-menu-item-kind=\"check\"]") && !k(t);
}
function DI(e) {
	let t = [];
	for (let n of zd(e)) {
		t.push(n);
		let e = n.matches("[data-ui-menu-group] > .ui-menu-item") ? n.parentElement : null, r = e === null || !e.hasAttribute(cI) || AI(e) ? null : e.querySelector(`:scope > .${oI} > .${Ln}`);
		r !== null && t.push(...DI(r));
	}
	return t;
}
function OI(e) {
	let t = kI(e), n = t?.closest(".ui-menu") ?? null;
	return t === null || n === null || AI(t) ? e : OI(n);
}
function kI(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(oI) && t.parentElement?.hasAttribute(sI) === !0 ? t.parentElement : null;
}
function AI(e) {
	let t = e.closest(`.${Ln}`);
	return e.hasAttribute(fI) || t !== null && jI(t);
}
function jI(e) {
	return e.hasAttribute("data-ui-collapsed") || e.classList.contains("ui-menu--rail");
}
var MI = "tabs:rename", NI = "tabs:pin", PI = "tabs:unpin", FI = "tabs:close", II = "tabs:delete";
function LI(e) {
	let t = (e ?? "").split(/\s+/);
	return {
		rename: t.includes("rename"),
		pin: t.includes("pin"),
		close: t.includes("close"),
		delete: t.includes("delete")
	};
}
function RI(e, t) {
	let n = !t.pinned && t.removable;
	return /* @__PURE__ */ new Map([
		[MI, e.rename && t.renamable],
		[NI, e.pin && !t.pinned],
		[PI, e.pin && t.pinned],
		[FI, e.close && !e.delete && n],
		[II, e.delete && n]
	]);
}
function zI(e) {
	let t = e.map(() => !1), n = !1, r = -1;
	for (let i = 0; i < e.length; i++) e[i] === "rule" ? n && r === -1 && (r = i) : e[i] === "shown" && (r !== -1 && (t[r] = !0), r = -1, n = !0);
	return t;
}
function BI(e, t) {
	return typeof e == "string" ? [...t, e] : null;
}
//#endregion
//#region src/interactions/context-menu-engine.ts
var VI = Se, HI = "ui-context-menu--open", UI = `${Me}--strip`, WI = `.${Me}:not(.${UI}) > .${lF}`, GI = "ui-context-menu-opening", KI = null, qI = /* @__PURE__ */ new WeakSet();
function JI(e) {
	KI = e;
}
var YI = class {
	root;
	components;
	closed = null;
	menus = new _v({
		show: ({ popup: e }) => e.classList.add(HI),
		hide: ({ popup: e }, t) => {
			e.classList.remove(HI), this.closed = e, t === "outside" && hL();
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e),
		onPress: !0,
		onWindowBlur: !0,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, new jF({
			root: this.root,
			first: typeof window > "u" ? void 0 : window,
			holds: (e) => e.closest("[data-ui-context-menu-owner]") !== null && !nd(e),
			closeMenu: () => this.menus.close(this.menus.current, "outside"),
			shows: QI
		}), this.root.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), this.root.addEventListener("click", (e) => this.handleInside(e), !1);
	}
	get openMenu() {
		let e = this.menus.current;
		return e === null ? null : this.menus.popupOf(e);
	}
	handleContextMenu(e) {
		if (!(e instanceof MouseEvent) || !(e.target instanceof Element)) return;
		let t = !Ip() && !AF(e), n = (t ? eL() : null) ?? e.target;
		if (this.openMenu !== null && e.composedPath().includes(this.openMenu)) {
			e.preventDefault();
			return;
		}
		let r = XI(n);
		if (r === null) return;
		e.preventDefault();
		let i = cL(e) ? n : null, a = n.closest(WI), o = t ? tL(n) : null, s = () => this.open(r.owner, r.menu, e.clientX, e.clientY, i, a, o);
		qI.delete(r.menu) ? queueMicrotask(s) : s();
	}
	open(e, t, n, r, i, a, o) {
		this.menus.close(), t.querySelector(`:scope > .${UI}`)?.remove(), lL(t), i !== null && uL(e, t, i), a?.closest("[data-ui-action-bar]")?.hasAttribute("data-ui-action-bar-rest") === !0 && fL(t), this.closed !== null && (_h(this.closed), this.closed = null);
		let s = (document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null) ?? Fp(), c = a ?? o, l = {
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
			returnFocus: () => (s === null ? null : om(s, this.components)) ?? om(e, this.components)
		}) && (c === null && Og(t, n, r), mL(t));
	}
	handleInside(e) {
		this.openMenu !== null && e.composedPath().includes(this.openMenu) && e.target instanceof Element && EI(e.target) && this.menus.close();
	}
};
function XI(e) {
	for (let t of ZI(e)) {
		let n = rL(t, e).find((t) => oL(t, e, !1));
		if (n !== void 0) return {
			owner: t,
			menu: n
		};
	}
	return null;
}
function* ZI(e) {
	let t = e.closest(`[${ue}]`);
	for (let n = e.closest(`[${Ce}]`); n !== null; n = n.parentElement?.closest("[data-ui-context-menu-owner]") ?? null) {
		if (t !== null && n.contains(t)) return;
		if (iL(n, e) && !k(n)) {
			if (_L(n)) return;
			yield n;
		}
	}
}
function QI(e) {
	let t = ZI(e).next();
	if (t.done === !0) return null;
	let n = t.value, r = e.closest(Ud);
	return r !== null && r !== n && n.contains(r) ? L(r) ?? r : n;
}
var $I = `[${Ce}]`;
function eL() {
	let e = document.activeElement;
	if (e === null || e === document.body) return null;
	let t = Tf(e);
	if (t === null || t.row !== null && t.row !== e) return e;
	let n = t.row ?? Mf(t.root);
	return n === null ? t.root : nL(n);
}
function tL(e) {
	let t = e.closest(Ud);
	return t === null ? e : L(t) ?? t;
}
function nL(e) {
	if (e.matches($I)) return e;
	for (let t of e.querySelectorAll($I)) if (t.closest(Ud) === e) return t;
	return e;
}
function rL(e, t) {
	return aL(e, t).map((t) => gL(e, t)).filter((e) => e !== null);
}
function iL(e, t) {
	return aL(e, t).some((t) => gL(e, t, !1) !== null || t.length === 0 && e.hasAttribute("data-ui-context-menu-later"));
}
function aL(e, t) {
	let n = t.closest(`[${Ee}]`), r = n !== null && e.contains(n) ? n.getAttribute("data-ui-context-menu-use") ?? "" : "";
	return r.length > 0 ? [r, ""] : [""];
}
function oL(e, t, n) {
	let r = new CustomEvent(GI, {
		bubbles: !0,
		cancelable: !0,
		detail: {
			target: t,
			actionBar: n
		}
	});
	return e.dispatchEvent(r);
}
function sL(e, t) {
	let n = e.closest(`[${Ce}]`), r = e.closest(`[${ue}]`);
	return n === null || k(n) || _L(n) || r !== null && n.contains(r) ? null : rL(n, e).find((n) => oL(n, e, t)) ?? null;
}
function cL(e) {
	let t = e.pointerType;
	return AF(e) ? !0 : typeof t == "string" && t.length > 0 ? t === "touch" : Lp();
}
function lL(e) {
	for (let t of e.querySelectorAll(`[${Ae}]`)) t.removeAttribute(Ae);
}
function uL(e, t, n) {
	let r = n.closest(`[${De}]`);
	if (r === null || n.closest(".ui-action-bar") !== null || !e.contains(r) || !rL(e, r).includes(t)) return;
	let { entries: i } = hF(t);
	if (i.length === 0) return;
	let a = document.createElement("div");
	a.className = `${Me} ${UI}`, a.setAttribute("role", "group"), _F(a, {
		entries: i,
		more: !1,
		role: "menuitem",
		press: dL
	}), t.insertBefore(a, t.firstElementChild);
}
function dL(e) {
	k(e) || e.click();
}
function fL(e) {
	let { entries: t } = hF(e), n = e.querySelector(`.${Ln}`);
	if (t.length === 0 || n === null) return;
	for (let e of t) pL(e);
	let r = Rd(n, `.${Rn}`, `.${Ln}`).filter((t) => t.closest("[data-ui-menu-left-out]") === null && gF(t, e)), i = [];
	for (let [e, t] of r.entries()) {
		let n = r[e + 1];
		t.getAttribute("data-ui-menu-item-kind") === "header" && (n === void 0 || n.matches("[data-ui-menu-item-kind=\"header\"], [data-ui-menu-item-kind=\"separator\"]")) ? pL(t) : i.push(t);
	}
	let a = i.map((e) => {
		let t = e.getAttribute(In);
		return t === "separator" ? "rule" : t === "header" ? "hidden" : "shown";
	});
	zI(a).forEach((e, t) => {
		a[t] === "rule" && !e && pL(i[t]);
	});
}
function pL(e) {
	let t = e.parentElement;
	(t !== null && t.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t : e).setAttribute(Ae, "");
}
function mL(e) {
	let t = e.querySelector(`.${Ln}`);
	t !== null && am(e, DI(t));
}
function hL() {
	let e = (e) => {
		e.target instanceof Element && e.target.closest(`${yp}, [contenteditable='true']`) === null && e.preventDefault();
	};
	document.addEventListener("mousedown", e, {
		capture: !0,
		once: !0
	}), setTimeout(() => document.removeEventListener("mousedown", e, !0));
}
function gL(e, t, n = !0) {
	for (let n of e.querySelectorAll(`[${VI}]`)) if ((n.getAttribute(VI) ?? "") === t && n.closest("[data-ui-context-menu-owner]") === e) return n;
	if (!n || t.length > 0 || KI === null || !e.hasAttribute("data-ui-context-menu-later")) return null;
	let r = KI(e);
	return r !== null && qI.add(r), r;
}
function _L(e) {
	if (e.hasAttribute("data-ui-no-context-menu")) return !0;
	let t = e.closest(`[${x}]`);
	if (t === null) return !1;
	let n = e;
	for (; n.parentElement !== null && n.parentElement !== t;) n = n.parentElement;
	return Cl(n, "data-ui-no-context-menu") || t.closest("[data-ui-id]")?.hasAttribute("data-ui-no-context-menu") === !0;
}
//#endregion
//#region src/interactions/action-bar-engine.ts
var vL = `[${De}]`, yL = `.${Me}`, bL = `${Me}--out`, xL = `.ui-items-view__item, .${sr}`, SL = "ui-tree__node", CL = 6, wL = "--ui-action-bar-gap", TL = 400, EL = /* @__PURE__ */ new WeakMap(), DL = [
	"class",
	"style",
	"hidden",
	"aria-disabled",
	"aria-checked",
	je,
	...bi
], OL = class {
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
		}), this.root.addEventListener("contextmenu", (e) => this.handleContextMenu(e)), this.root.addEventListener("dragstart", () => this.choose(null)), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("scroll", () => this.markOut(), !0), __((e) => this.takesEscape(e, !0));
	}
	handlePointerDown(e) {
		let t = e, n = e.target instanceof Element ? e.target : null;
		if (n === null || n.closest(`${yL}, [data-ui-context-menu]`) !== null) return;
		let r = kL(n), i = r !== null && r !== this.chosen && AL(n, r) ? null : r;
		t.pointerType === "touch" ? this.pendingTap = {
			pointerId: t.pointerId ?? 0,
			host: i,
			identity: i === null ? null : IL(i)
		} : (t.button ?? 0) === 0 ? i !== null && i === this.chosen ? this.askAgain(i) : this.choose(i) : r !== this.chosen && this.choose(null);
	}
	handlePointerUp(e) {
		let t = this.pendingTap;
		if (this.pendingTap = null, t !== null && t.pointerId === (e.pointerId ?? 0)) {
			let e = t.host !== null && !t.host.isConnected && t.identity !== null ? LL(t.identity) : t.host;
			e !== null && e === this.chosen ? this.askAgain(e) : this.choose(e);
		}
		this.chosen !== null && (this.chosen.isConnected && !this.shown.has(this.chosen) || s_(this.chosen)) && this.sync();
	}
	handleContextMenu(e) {
		this.pendingTap = null, e instanceof MouseEvent && e.target instanceof Element && e.target.closest(yL) === null && cL(e) && this.choose(null);
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement ? e.target : null;
		if (t === null) return;
		let n = t.closest(yL);
		n === null ? Ip() || this.isInOpenMenu(t) || this.menuHost !== null && t.contains(this.menuHost) || this.choose(PL(t)) : this.isHostedBar(n) && P(GL(n), t);
	}
	handleFocusOut(e) {
		let t = e.relatedTarget, n = t instanceof Element ? t.closest(yL) : null;
		n !== null && this.isHostedBar(n) && e.target instanceof HTMLElement && !n.contains(e.target) && (this.cameFrom = e.target);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || !(e.target instanceof HTMLElement)) return;
		let t = e.target;
		if (e.defaultPrevented) {
			t.matches(I) && this.choose(PL(t));
			return;
		}
		let n = t.closest(yL);
		if (n !== null && t.classList.contains(cF)) this.handleBarKey(e, n, t);
		else if (e.key === "Escape") {
			if (Ku(e) || !this.takesEscape(t, !1)) return;
			this.chosen !== null && e.preventDefault(), this.choose(null);
		} else if (e.key === "Tab" && N(e) && t.matches(I)) {
			let n = this.chosen === null ? null : this.tabStopOf(this.chosen);
			n !== null && t.contains(n) && (e.preventDefault(), n.focus());
		} else t.matches(I) && this.choose(PL(t));
	}
	handleBarKey(e, t, n) {
		if (!N(e, { shift: !0 })) return;
		if (e.key === "Escape") {
			if (!this.isHostedBar(t)) return;
			let n = this.hostOfBar(t), r = this.cameFrom !== null && this.cameFrom.isConnected && YL(this.cameFrom) && n !== null && (n.contains(this.cameFrom) || this.cameFrom.contains(n)) ? this.cameFrom : om(n, this.components);
			e.preventDefault(), r?.focus();
			return;
		}
		let r = GL(t), i = gd({
			key: e.key,
			items: r,
			current: n,
			axis: "horizontal"
		});
		i !== null && (e.preventDefault(), yd(r, i));
	}
	takesEscape(e, t) {
		let n = e instanceof Element ? e.closest(r_) : null, r = this.chosen;
		if (n !== null && (r === null || !n.contains(r))) return !1;
		if (!t) return !0;
		let i = r === null ? void 0 : this.shown.get(r)?.bar;
		return r !== null && i !== void 0 && !i.classList.contains(bL) && Kg(r) && !s_(r);
	}
	choose(e) {
		(e === null ? this.chosen === null && this.identity === null : e === this.chosen) || (this.chosen = e, this.identity = e === null ? null : IL(e), this.watchScope(), this.sync(), e !== null && this.makeRoomAbove(e));
	}
	makeRoomAbove(e) {
		let t = this.shown.get(e), n = Jg(e);
		if (t === void 0 || n === null || !Wg(n, !0)) return;
		let r = Math.max(0, n.getBoundingClientRect().top + n.clientTop), i = Math.ceil(t.bar.getBoundingClientRect().height + zL(e) - (e.getBoundingClientRect().top - r));
		i <= 0 || i > n.scrollTop || (n.scrollTop -= i, eg(t.bar), this.markOut());
	}
	askAgain(e) {
		let t = this.shown.get(e);
		t === void 0 ? this.sync() : sL(e, !0) === null && this.hide(e, t);
	}
	watchScope() {
		this.scopeObserver?.disconnect(), this.scopeObserver = null, this.identity !== null && (this.scopeObserver = new MutationObserver((e) => {
			Fg(e) || this.scopeChanged();
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
				this.chosen = LL(e), this.sync();
			}
			for (let e of this.shown.values()) eg(e.bar);
			this.markOut();
		}
	}
	sync() {
		this.chosen !== null && s_(this.chosen) && (this.chosen = null, this.identity = null, this.watchScope());
		for (let [e, t] of this.shown) (e !== this.chosen && e !== this.menuHost || !e.isConnected) && this.hide(e, t);
		for (let e of [this.chosen, this.menuHost]) e !== null && e.isConnected && !this.shown.has(e) && this.show(e);
	}
	show(e) {
		let t = sL(e, !0);
		if (t === null) return;
		let n = document.createElement("div");
		if (n.className = Me, n.setAttribute("role", "toolbar"), O.write(n, "aria-label", "ui.actionbar.label"), n.setAttribute($e, ""), n.setAttribute(fe, ""), !VL(n, t, (t) => this.openMore(e, t), !1)) return;
		e.insertBefore(n, WL(e)), Uh(e, n, {
			placement: RL(e),
			gap: zL(e),
			boundary: Jg(e) ?? void 0
		}), n.classList.toggle(bL, qg(e));
		let r = new MutationObserver((t) => {
			Fg(t) || this.redraw(e);
		});
		r.observe(t, {
			subtree: !0,
			childList: !0,
			characterData: !0,
			attributes: !0,
			attributeFilter: DL
		});
		let i = BL(e);
		i?.setAttribute(Lr, ""), this.shown.set(e, {
			bar: n,
			menu: t,
			observer: r,
			row: i
		}), EL.set(n, Date.now());
	}
	redraw(e) {
		let t = this.shown.get(e);
		if (t === void 0) return;
		let n = document.activeElement, r = n instanceof HTMLElement && t.bar.contains(n) ? n : null, i = r === null ? null : SF(r);
		if (!VL(t.bar, t.menu, (t) => this.openMore(e, t), e === this.menuHost)) {
			this.hide(e, t);
			return;
		}
		if (r === null) return;
		let a = GL(t.bar);
		yd(a, a.find((e) => SF(e) === i) ?? a.find(F) ?? null);
	}
	openMore(e, t) {
		let n = this.shown.get(e);
		if (n === void 0 || qL(t)) return;
		if (this.menuHost = e, JL(t), !n.menu.classList.contains("ui-context-menu--open")) {
			this.menuHost = null;
			return;
		}
		HL(n.bar, !0);
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
		HL(t.bar, !1);
		let n = document.activeElement;
		!Ip() && (n === null || n === document.body || e.contains(n) || n.contains(e)) && UL(t.bar)?.focus();
	}
	hide(e, t) {
		t.observer.disconnect(), tg(t.bar), t.bar.remove(), this.shown.delete(e), t.row !== null && ![...this.shown.values()].some((e) => e.row === t.row) && t.row.removeAttribute(Lr);
	}
	markOut() {
		for (let [e, t] of this.shown) t.bar.classList.toggle(bL, qg(e));
	}
	isInOpenMenu(e) {
		for (let t of this.shown.values()) if (t.menu.classList.contains("ui-context-menu--open") && t.menu.contains(e)) return !0;
		return !1;
	}
	tabStopOf(e) {
		let t = this.shown.get(e);
		return t === void 0 ? null : GL(t.bar).find((e) => e.tabIndex === 0) ?? null;
	}
	isHostedBar(e) {
		return this.hostOfBar(e) !== null;
	}
	hostOfBar(e) {
		for (let [t, n] of this.shown) if (n.bar === e) return t;
		return null;
	}
};
function kL(e) {
	let t = e.closest(vL);
	if (t !== null) return t;
	let n = e.closest(`[${b}]`), r = e.closest(S);
	return n === null || r !== null && !r.contains(n) ? null : FL(n)[0] ?? null;
}
function AL(e, t) {
	let n = hd(e, t.closest("[data-ui-key]") ?? t);
	return n !== null && !ML(n, t);
}
var jL = `[${Se}], .${Me}, ${Mi}`;
function ML(e, t) {
	if (e.contains(t)) return !0;
	for (let n = e; n !== t;) {
		let e = n.parentElement;
		if (e === null) return !1;
		let t = NL(e) - NL(n);
		for (let r of e.children) if (r !== n) {
			if (!r.matches(jL)) return !1;
			t -= NL(r);
		}
		if (t > 0) return !1;
		n = e;
	}
	return !0;
}
function NL(e) {
	return (e.textContent ?? "").replace(/s+/g, "").length;
}
function PL(e) {
	if (e instanceof HTMLElement && e.matches(I)) {
		let t = Mf(e), n = t === null ? void 0 : FL(t)[0];
		if (n !== void 0) return n;
	}
	return e.closest(vL);
}
function FL(e) {
	let t = [...e.querySelectorAll(vL)];
	return e.matches(vL) ? [e, ...t] : t;
}
function IL(e) {
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
		index: FL(n).indexOf(e)
	};
}
function LL(e) {
	for (let t of e.scope.children) if (t.getAttribute(e.attribute) === e.key) return FL(t)[e.index] ?? null;
	return null;
}
function RL(e) {
	let t = e.getAttribute(De);
	if (t === "center") return "top";
	let n = getComputedStyle(e).direction === "rtl";
	return t === "start" === n ? "top-end" : "top-start";
}
function zL(e) {
	let t = Number.parseFloat(getComputedStyle(e).getPropertyValue(wL));
	return Number.isFinite(t) ? t : CL;
}
function BL(e) {
	if (e.classList.contains("ui-table__row")) return e;
	let t = e.parentElement;
	if (t === null) return null;
	if (t.matches(xL)) return t;
	let n = t.parentElement;
	return t.classList.contains(SL) && n !== null && n.classList.contains("ui-tree__row") ? n : null;
}
function VL(e, t, n, r) {
	let { entries: i, more: a } = hF(t);
	if (i.length === 0 && !a) return !1;
	let o = _F(e, {
		entries: i,
		more: a,
		role: "button",
		press: KL,
		openMore: n
	});
	return P(o, o.find((e) => !k(e)) ?? o[0] ?? null), HL(e, r), !0;
}
function HL(e, t) {
	UL(e)?.setAttribute("aria-expanded", t ? "true" : "false");
}
function UL(e) {
	return GL(e).find((e) => SF(e) === null) ?? null;
}
function WL(e) {
	for (let t of e.children) if (t.hasAttribute("data-ui-context-menu")) return t;
	return null;
}
function GL(e) {
	return [...e.querySelectorAll(`:scope > .${cF}`)];
}
function KL(e, t) {
	if (k(t) || qL(t)) return;
	let n = sL(t, !1);
	n !== null && n.contains(e) && !k(e) && gF(e, n) && e.click();
}
function qL(e) {
	let t = e.closest(yL), n = t === null ? void 0 : EL.get(t);
	return n !== void 0 && Lp() && Date.now() - n < TL;
}
function JL(e) {
	let t = e.getBoundingClientRect();
	e.dispatchEvent(new MouseEvent("contextmenu", {
		bubbles: !0,
		cancelable: !0,
		button: 2,
		clientX: t.left,
		clientY: t.bottom
	}));
}
function YL(e) {
	return e.matches(yp) || e.hasAttribute("tabindex");
}
//#endregion
//#region src/interactions/tooltip-engine.ts
var XL = "ui-tooltip", ZL = "ui-tooltip", QL = "ui-tooltip--visible", $L = "ui-tooltip--linked", eR = "[aria-haspopup][aria-expanded=\"true\"]", tR = "a[href], button, input, select, textarea, label, [role='button'], [role='link'], [tabindex]", nR = "top", rR = 250, iR = 200, aR = 300, oR = 7, sR = null, J = null, cR = null, lR = null, uR = null, dR = 0, fR = null, pR = 0, mR = 0, hR = !1, gR = /* @__PURE__ */ new Set();
function _R(e) {
	gR.add(e);
}
function vR(e = document) {
	if (hR) return;
	hR = !0;
	let t = e instanceof Document ? e : document;
	t.addEventListener("pointerover", yR, !0), t.addEventListener("pointerout", SR, !0), t.addEventListener("focusin", wR, !0), t.addEventListener("focusout", TR, !0), t.addEventListener("scroll", xR, !0), t.addEventListener("pointerdown", DR, !0), t.addEventListener("click", jR, !0), new jF({
		root: t,
		first: window,
		holds: kR,
		answer: AR
	}), window.addEventListener("keydown", ER, !0), window.addEventListener("blur", rz), Th(bR);
}
function yR(e) {
	if (bR(!1), NR(e.target)) {
		window.clearTimeout(pR);
		return;
	}
	let t = PR(e.target);
	t !== null && t !== J && zR(t);
}
function bR(e = !0) {
	J === null || J.isConnected && (!e || Kg(J)) || rz();
}
function xR(e) {
	if (bR(), J === null) return;
	let t = e.target;
	t instanceof Node && !(t instanceof Document) && !t.contains(J) || qg(J) && rz();
}
function SR(e) {
	if (lR !== null || uR !== null) return;
	let t = e.relatedTarget, n = J ?? fR?.target ?? null, r = n === null ? null : CR(n);
	t instanceof Node && (r !== null && r.contains(t) || NR(t)) || (NR(e.target) || r !== null && e.target instanceof Node && r.contains(e.target)) && iz(!1);
}
function CR(e) {
	let t = e.parentElement?.closest("[data-ui-tooltip-mark]") ?? null;
	return t !== null && FR(t) === e ? t : e;
}
function wR(e) {
	if (e.target instanceof Element && e.target.hasAttribute("data-ui-pointer-focus")) return;
	let t = PR(e.target);
	t !== null && (lR = e.target instanceof Element && e.target.closest("[data-ui-tooltip-mark]") !== null ? t : null, BR(t));
}
function TR(e) {
	PR(e.target) === J && rz();
}
function ER(e) {
	e.key !== "Escape" || J === null || e.defaultPrevented || (Ku(e) || e.preventDefault(), rz());
}
function DR(e) {
	if (NR(e.target)) return;
	let t = MR(e.target);
	if (t !== null) {
		if (uR === t) {
			iz(!0);
			return;
		}
		rz(), BR(t), uR = J;
	} else lR === null && iz(!0);
}
var OR = `[${Ce}]`;
function kR(e) {
	let t = e.closest(OR) === null && !nd(e) ? PR(e) : null;
	return t !== null && !t.hasAttribute("data-ui-tooltip-press");
}
function AR(e) {
	let t = PR(e);
	return t !== null && (rz(), BR(t), uR = J, !0);
}
function jR(e) {
	MR(e.target) !== null && e.preventDefault();
}
function MR(e) {
	let t = PR(e);
	if (t === null || !t.hasAttribute("data-ui-tooltip-press") || !(e instanceof Element)) return null;
	let n = e.closest(tR);
	return n === null || n.contains(t) ? t : null;
}
function NR(e) {
	return sR !== null && e instanceof Node && sR.contains(e);
}
function PR(e) {
	if (!(e instanceof Element)) return null;
	let t = FR(e);
	for (let n of gR) {
		let r = n.anchor(e);
		if (r !== null && (t === null || t !== r && t.contains(r)) && RR(r).length > 0) return r;
	}
	return t;
}
function FR(e) {
	let t = e.closest(`[${Re}], [${Ve}]`);
	if (t === null) return null;
	let n = t.hasAttribute("data-ui-tooltip") ? t : t.querySelector("[data-ui-tooltip][data-ui-tooltip-severity]") ?? t.querySelector("[data-ui-tooltip]");
	return n === null ? null : (n.getAttribute("data-ui-tooltip") ?? "").trim().length > 0 ? n : null;
}
function IR(e) {
	let t = (e.getAttribute("data-ui-tooltip") ?? "").trim();
	return t.length === 0 ? RR(e) : (e.hasAttribute("data-ui-tooltip-plain") ? Jo(t) : t) + LR(e);
}
function LR(e) {
	let t = "";
	for (let n of gR) {
		let r = n.anchor(e) === e ? n.after?.(e)?.trim() ?? "" : "";
		r.length > 0 && (t += ` ${r}`);
	}
	return t;
}
function RR(e) {
	for (let t of gR) {
		if (t.anchor(e) !== e) continue;
		let n = t.words(e)?.trim() ?? "";
		if (n.length > 0) return n;
	}
	return "";
}
function zR(e, t) {
	lR === null && uR === null && (window.clearTimeout(pR), fR !== null && fR.target === e ? fR.words = t : (window.clearTimeout(dR), fR = null, J === null ? Date.now() - mR < aR ? BR(e, t) : (fR = {
		target: e,
		words: t
	}, dR = window.setTimeout(() => {
		let e = fR;
		fR = null, e !== null && BR(e.target, e.words);
	}, rR)) : (iz(!0), BR(e, t))));
}
function BR(e, t) {
	let n = (t ?? IR(e)).trim();
	if (n.length === 0 || !e.isConnected || !Gg(e) || GR(e) || qg(e)) return;
	window.clearTimeout(dR), window.clearTimeout(pR), fR = null;
	let r = az();
	Yo(r, n, { staticFolds: !0 }), r.classList.toggle($L, r.querySelector("a[href]") !== null), r.classList.add(QL), J = e, qR(KR(e)), r.setAttribute("data-ui-tooltip-text", qo(n)), XR(r, e.getAttribute(He)), Hh(e, r), Uh(e, r, {
		placement: nz(e),
		gap: oR,
		arrow: !0
	}), UR();
}
var VR = null, HR = [...Vg];
function UR() {
	typeof MutationObserver < "u" && J !== null && (VR ??= new MutationObserver((e) => WR(e)), VR.disconnect(), VR.observe(document.documentElement, {
		childList: !0,
		subtree: !0
	}), Hg(VR, J, HR));
}
function WR(e) {
	let t = J !== null && Ug(e, [J]).size > 0;
	bR(t || e.some((e) => e.type === "attributes")), t && J !== null && VR !== null && Hg(VR, J, HR);
}
function GR(e) {
	return e.matches(eR) || e.querySelector(eR) !== null || e.querySelector(":scope > .ui-action-bar") !== null;
}
function KR(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t) ? t : e;
}
function qR(e) {
	cR !== null && cR !== e && JR();
	let t = YR(e);
	t.includes(ZL) || e.setAttribute("aria-describedby", [...t, ZL].join(" ")), cR = e;
}
function JR() {
	if (cR === null) return;
	let e = YR(cR).filter((e) => e !== ZL);
	e.length === 0 ? cR.removeAttribute("aria-describedby") : cR.setAttribute("aria-describedby", e.join(" ")), cR = null;
}
function YR(e) {
	return (e.getAttribute("aria-describedby") ?? "").split(" ").filter((e) => e.length > 0);
}
function XR(e, t) {
	t === null ? e.removeAttribute(He) : e.setAttribute(He, t);
}
function ZR(e, t, n) {
	let r = n?.plain === !0 ? Jo(t) : t;
	n?.delay === !0 && J !== e ? zR(e, r) : BR(e, r);
}
function QR() {
	iz(!0);
}
var $R = {
	show: ZR,
	hide: QR,
	escape: Jo
};
function ez(e) {
	lR = e, BR(e);
}
function tz(e) {
	J === e && ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0 ? rz() : BR(e));
}
function nz(e) {
	if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) for (let t of gR) {
		let n = t.anchor(e) === e ? t.placement?.(e) ?? null : null;
		if (n !== null) return n;
	}
	let t = e.getAttribute(ze);
	return t !== null && Mh(t) ? t : nR;
}
function rz() {
	lR = null, iz(!0);
}
function iz(e) {
	window.clearTimeout(dR), window.clearTimeout(pR), fR = null;
	let t = () => {
		J !== null && (JR(), J = null, uR = null, VR?.disconnect(), sR !== null && (sR.classList.remove(QL), tg(sR)), mR = Date.now());
	};
	e ? t() : pR = window.setTimeout(t, iR);
}
function az() {
	return sR !== null && sR.isConnected || (sR = document.createElement("div"), sR.id = ZL, sR.className = XL, sR.setAttribute("role", "tooltip"), sR.setAttribute("aria-hidden", "true"), document.body.append(sR)), sR;
}
//#endregion
//#region src/interactions/menu-engine.ts
var oz = "ui-orientation--horizontal", sz = `.${Vn} > .ui-menu__host > .ui-menu__item > .${Rn}`, cz = `${sz}, ${`.ui-menu[${dn}] > .ui-menu__host > .ui-menu__item > .${Rn}`}`, lz = ":scope > .ui-button__content > .ui-text__body > .ui-text__header > .ui-text__title", uz = "[role='menuitem'], [role='menuitemcheckbox']", dz = class {
	root;
	tabStopsScheduled = !1;
	touched = /* @__PURE__ */ new Set();
	space = new Au();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("keydown", (e) => this.handleEntryKeydown(e), !0), this.root.addEventListener("keyup", (e) => this.space.release(e, F), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), _R(hz), this.applyTabStops(this.root.querySelectorAll(`.${Ln}`)), this.root instanceof Node && new MutationObserver((e) => {
			for (let t of e) Ng(t) || gz(t, this.touched);
			this.touched.size > 0 && this.scheduleTabStops();
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [Sn, mn]
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
		for (let n of e) n.isConnected && t.add(OI(n));
		for (let e of t) {
			let t = DI(e);
			if (t.length === 0) continue;
			let n = t.filter((e) => e.tabIndex === 0 && F(e));
			P(t, t.find((e) => e === document.activeElement) ?? t.find((e) => e.classList.contains("ui-menu-item--selected") && F(e)) ?? (n.length === 1 ? n[0] : void 0) ?? t.find(F) ?? t[0]);
		}
	}
	handleEntryKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || rd(e) || M(e) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Rn}`), n = t?.closest(".ui-menu") ?? null;
		if (t === null) {
			this.enterFromContainer(e);
			return;
		}
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			this.pressEntry(e, t);
			return;
		}
		let r = OI(n), i = DI(r), a = kE(e);
		if (a !== null) {
			e.preventDefault(), yd(i, WP(i, t, a));
			return;
		}
		let o = r.classList.contains(oz) || wI(r) ? "horizontal" : "vertical";
		if (!N(e) || this.handleGroupKey(e, t, r, o)) return;
		let s = e.key === "ArrowUp" && t === i.find(F) ? mz(r) : null, c = s ?? gd({
			key: e.key,
			items: i,
			current: t,
			axis: o
		});
		c !== null && (e.preventDefault(), c !== s && P(i, c), c.focus());
	}
	handleGroupKey(e, t, n, r) {
		let i = r === "vertical" ? "ArrowRight" : CI(n) === "top" ? "ArrowUp" : "ArrowDown", a = t.matches("[data-ui-menu-group] > .ui-menu-item") ? t.parentElement : null;
		if (e.key === i && a !== null) return e.preventDefault(), a.hasAttribute("data-ui-menu-open") ? yd([], fz(a)) : t.click(), !0;
		if (e.key !== "ArrowLeft" || r !== "vertical") return !1;
		let o = a !== null && a.hasAttribute("data-ui-menu-open") && !AI(a) ? a : pz(t), s = o?.querySelector(":scope > .ui-menu-item") ?? null;
		return o === null || s === null ? !1 : (e.preventDefault(), AI(o) || s.focus(), s.click(), !0);
	}
	pressEntry(e, t) {
		e.target === t && N(e, { shift: !0 }) && !t.matches("[data-ui-menu-item-kind=\"header\"], [data-ui-menu-item-kind=\"separator\"]") && F(t) && (t.hasAttribute("href") && e.key === "Enter" || (e.preventDefault(), !e.repeat && (e.key === " " ? this.space.hold(t) : t.click())));
	}
	enterFromContainer(e) {
		let t = e.target instanceof HTMLElement && e.target.getAttribute("role") === "menu" ? e.target : null, n = t === null ? null : t.matches(".ui-menu") ? t : t.querySelector(`.${Ln}`);
		if (n === null) return;
		let r = DI(n), i = kE(e);
		if (i !== null) {
			e.preventDefault(), yd(r, WP(r, null, i));
			return;
		}
		let a = N(e) ? gd({
			key: e.key,
			items: r,
			current: null,
			axis: n.classList.contains(oz) ? "horizontal" : "vertical"
		}) : null;
		a !== null && (e.preventDefault(), yd(r, a));
	}
	handleFocusIn(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Rn}`), n = t?.closest(".ui-menu") ?? null;
		t !== null && n !== null && P(DI(OI(n)), t);
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${Rn}`) : null;
		if (t === null || t === document.activeElement || !t.matches(uz) || t.matches("[data-ui-menu-item-kind=\"header\"], [data-ui-menu-item-kind=\"separator\"]") || !F(t)) return;
		let n = document.activeElement;
		(n instanceof HTMLElement && n.getAttribute("role") === "menu" && n.contains(t) || t.closest(".ui-menu")?.contains(n) === !0) && Up(t);
	}
};
function fz(e) {
	let t = e.querySelector(`:scope > .ui-menu__submenu > .${Ln}`);
	return t === null ? null : DI(t).find(F) ?? null;
}
function pz(e) {
	let t = e.closest(`.${Ln}`), n = t === null ? null : kI(t);
	return n !== null && n.hasAttribute("data-ui-menu-open") ? n : null;
}
function mz(e) {
	return e.hasAttribute("data-ui-menu-search") ? e.querySelector(":scope > .ui-collapsible__bar input") : null;
}
var hz = {
	anchor: (e) => e.closest(cz),
	words: (e) => {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length > 0) return null;
		let t = e.querySelector(lz), n = t?.textContent?.trim() ?? "";
		return t === null || n.length === 0 || e.matches(sz) && t.scrollWidth <= t.clientWidth ? null : Jo(n);
	},
	placement: (e) => {
		let t = e.closest(`.${Ln}`);
		return t === null ? null : CI(t);
	}
};
function gz(e, t) {
	let n = (e.target instanceof Element ? e.target : e.target.parentElement)?.closest(".ui-menu") ?? null;
	n !== null && t.add(n);
	for (let n of e.addedNodes) if (n instanceof HTMLElement) {
		n.classList.contains("ui-menu") && t.add(n);
		for (let e of n.querySelectorAll(`.${Ln}`)) t.add(e);
	}
}
//#endregion
//#region src/interactions/shortcut-engine.ts
var _z = "shortcut:", vz = ":scope > .ui-menu-item__shortcut", yz = `[${Se}]`, bz = `[${Kn}]`, xz = ".ui-text__title", Sz = class {
	root;
	options;
	claims = /* @__PURE__ */ new Map();
	entryShortcuts = /* @__PURE__ */ new Map();
	stale = !0;
	laterVersion = -1;
	constructor(e = {}) {
		this.root = e.root ?? document, this.options = e, this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), _R(kz), Ez(this.root), this.root instanceof Node && new MutationObserver((e) => {
			if (!Fg(e)) {
				this.stale = !0;
				for (let t of e) Tz(t);
			}
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [Kn]
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || M(e) || ((this.stale || this.laterVersion !== (this.options.laterChords?.version ?? -1)) && this.rebuild(), this.claims.size === 0 && this.entryShortcuts.size === 0 || rd(e))) return;
		let t = o_(this.root);
		if (!this.pressContextEntry(e, t)) for (let n of this.claims.values()) {
			if (n === null || !_u(n.shortcut, e)) continue;
			let r = n.element ?? this.contentOf(n.view);
			if (r === null || !F(r) || t !== null && !t.contains(r)) return;
			e.preventDefault(), wz(e), n.view === null ? r.click() : r.dispatchEvent(new CustomEvent(n.view.name, { bubbles: !0 }));
			return;
		}
	}
	pressContextEntry(e, t) {
		let n = !1;
		for (let t of this.entryShortcuts.values()) n ||= _u(t, e);
		let r = n ? eL() : null;
		if (r === null || t !== null && !t.contains(r)) return !1;
		let i = XI(r);
		if (i === null) return !1;
		let a = [...i.menu.querySelectorAll(bz)].filter((t) => {
			let n = gu(t.getAttribute(Kn));
			return n !== null && _u(n, e) && !k(t) && gF(t, i.menu);
		});
		return a.length === 1 ? (e.preventDefault(), wz(e), a[0].click(), !0) : (a.length > 1 && s("context menu shortcut is claimed twice and will fire nothing.", { entries: a }), !1);
	}
	contentOf(e) {
		let t = e === null ? null : this.options.componentOf?.(e.componentId) ?? null;
		return t instanceof HTMLElement ? t : null;
	}
	rebuild() {
		this.claims.clear(), this.entryShortcuts.clear(), this.stale = !1;
		for (let e of this.root.querySelectorAll(bz)) {
			let t = e.getAttribute("data-ui-shortcut") ?? "", n = gu(t);
			n === null ? t.trim().length > 0 && s("shortcut could not be parsed.", {
				element: e,
				value: t
			}) : e.closest(yz) === null ? this.claim({
				shortcut: n,
				element: e,
				view: null
			}) : this.entryShortcuts.set(ju(n), n);
		}
		for (let e of this.options.laterChords?.chords() ?? []) {
			let t = gu(e);
			t !== null && this.entryShortcuts.set(ju(t), t);
		}
		this.laterVersion = this.options.laterChords?.version ?? -1;
		for (let e of this.options.viewShortcuts ?? []) {
			let t = gu(e.name.slice(9));
			t !== null && this.claim({
				shortcut: t,
				element: null,
				view: e
			});
		}
	}
	claim(e) {
		let t = ju(e.shortcut);
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
function Cz(e) {
	let t = /* @__PURE__ */ new Map(), n = [...e.events, ...e.interactions.map((e) => e.sourceEvent)];
	for (let e of n) e != null && e.eventName.startsWith(_z) && t.set(e.eventName, {
		name: e.eventName,
		componentId: e.componentId
	});
	return [...t.values()];
}
function wz(e) {
	td(e.target) && e.target.dispatchEvent(new Event(ZS, { bubbles: !0 }));
}
function Tz(e) {
	if (e.type === "attributes") e.target instanceof HTMLElement && Dz(e.target);
	else for (let t of e.addedNodes) t instanceof HTMLElement && Ez(t);
}
function Ez(e) {
	e instanceof HTMLElement && e.matches(bz) && Dz(e);
	for (let t of e.querySelectorAll(bz)) Dz(t);
}
function Dz(e) {
	let t = e.querySelector(vz);
	if (t === null) return;
	let n = Oz(e) ?? "";
	t.textContent !== n && (t.textContent = n), e.hasAttribute("data-ui-menu-item-shortcut") !== n.length > 0 && e.toggleAttribute(vn, n.length > 0);
}
function Oz(e) {
	let t = e.getAttribute(Kn), n = gu(t);
	return n === null ? t?.trim() || null : vu(n);
}
var kz = {
	anchor: (e) => {
		let t = e.closest(bz);
		return t === null || t.classList.contains("ui-menu-item") || t.closest(yz) !== null ? null : t;
	},
	words: (e) => {
		let t = Oz(e), n = (e.getAttribute("aria-label") ?? e.querySelector(xz)?.textContent ?? "").trim();
		return t === null ? null : Jo(n.length > 0 ? `${n} (${t})` : t);
	},
	after: (e) => {
		let t = Oz(e);
		return t === null ? null : Jo(`(${t})`);
	}
}, Az = 50, jz = 1, Mz = 7;
function Nz(e) {
	let t = 0;
	for (let n of e.children) n.hasAttribute("data-ui-key") && t++;
	let n = Fk(e, "data-ui-window-size") ?? 0;
	return {
		offset: Fk(e, "data-ui-window-offset") ?? 0,
		count: t,
		size: n > 0 ? n : t > 0 ? t : Az,
		total: Fk(e, nn),
		moreAfter: Ik(e, an)
	};
}
function Pz(e) {
	return Math.floor(e.offset / e.size) + 1;
}
function Fz(e) {
	return e.total === null ? null : Math.max(1, Math.ceil(e.total / e.size));
}
function Iz(e, t) {
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
			let n = Number(t), r = Fz(e);
			return !Number.isInteger(n) || n < 1 || r !== null && n > r || n === Pz(e) ? null : (n - 1) * e.size;
		}
	}
}
function Lz(e, t) {
	if (t <= Mz) return zz(1, t);
	let n = Math.max(Math.min(e - jz, t - 2 - 2), 3), r = Math.min(Math.max(e + jz, 5), t - 2);
	return [
		1,
		n > 3 ? "gap" : 2,
		...zz(n, r),
		r < t - 2 ? "gap" : t - 1,
		t
	];
}
function Rz(e, t) {
	let n = Lz(e, t ? e + 1 : e);
	return t ? [...n, "gap"] : n;
}
function zz(e, t) {
	let n = [];
	for (let r = e; r <= t; r++) n.push(r);
	return n;
}
//#endregion
//#region src/interactions/pager-engine.ts
var Bz = ".ui-pager", Vz = "ui-pager__button", Hz = "ui-pager__number", Uz = "ui-pager__pages", Wz = "ui-pager__gap", Gz = "ui-pager__range", Kz = "ui-pager__size", qz = "ui-pager__size--open", Jz = "ui-pager__size-trigger", Yz = "ui-pager__size-label", Xz = "ui-pager__sizes", Zz = "ui-pager__size-choice", Qz = [
	Vz,
	Hz,
	"ui-button",
	"ui-button--ghost",
	"ui-button--small"
], $z = "ui.pager.page", eB = "ui.pager.range", tB = "ui.pager.rows", nB = "ui.pager.size", rB = [
	tn,
	nn,
	an,
	en,
	$t
], iB = "page-size", aB = class {
	options;
	root;
	drawn = /* @__PURE__ */ new WeakMap();
	store = new qF();
	restored = /* @__PURE__ */ new WeakSet();
	turning = /* @__PURE__ */ new WeakMap();
	menus = new _v({
		show: ({ owner: e }) => e.classList.add(qz),
		hide: ({ owner: e }) => e.classList.remove(qz),
		closesWhenReadOnly: !1,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.syncAll(), this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e)), (e.pageKeys ?? window).addEventListener("keydown", (e) => this.handlePageKey(e), !0), V(this.root, `${Bz}, [${x}]`, {
			childList: !0,
			attributeFilter: rB,
			relevant: (e) => e.type === "attributes" || mB(e.target) || hB(e)
		}, (e) => this.syncFound(e)), O.onChange(() => {
			this.drawn = /* @__PURE__ */ new WeakMap(), this.syncAll();
		});
	}
	syncAll() {
		for (let e of this.root.querySelectorAll(Bz)) this.sync(e);
	}
	syncFound(e) {
		let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
		for (let r of e) {
			if (r.matches(Bz)) {
				t.add(r);
				continue;
			}
			let e = r.closest(S), i = e === null ? 0 : E(e);
			i > 0 && n.add(String(i));
		}
		if (n.size > 0) for (let e of this.root.querySelectorAll(Bz)) n.has(e.getAttribute("data-ui-pager-target") ?? "") && t.add(e);
		for (let e of t) this.sync(e);
	}
	hostOf(e) {
		return this.targetOf(e)?.host ?? null;
	}
	targetOf(e) {
		let t = Number(e.getAttribute(_t));
		if (!Number.isInteger(t) || t <= 0) return null;
		for (let e of this.options.dom.findEveryComponent(t)) {
			let t = pB(e);
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
		let i = Nz(n), a = this.turning.get(n), o = this.shownState(n, i), s = `${i.offset}|${i.count}|${i.size}|${i.total}|${i.moreAfter}|${a ?? ""}`;
		if (this.drawn.get(e) === s) return;
		this.drawn.set(e, s);
		let c = VO(e), l = (e) => HO(e, "N0", c);
		this.drawNumbers(e, o, c), sB(e, i, l), cB(e, i, l);
		for (let t of e.querySelectorAll(`:scope > .${Vz}[${vt}]`)) Dl.setDisabled(t, Iz(o, t.getAttribute("data-ui-pager-page") ?? "") === null);
		uB(e);
	}
	shownState(e, t = Nz(e)) {
		let n = this.turning.get(e);
		return n === void 0 ? t : {
			...t,
			offset: n,
			moreAfter: t.total === null ? t.moreAfter : n + t.size < t.total
		};
	}
	drawNumbers(e, t, n) {
		let r = e.querySelector(`:scope > .${Uz}`);
		if (r === null) return;
		let i = Pz(t), a = Fz(t), o = a === null ? Rz(i, t.moreAfter) : Lz(i, a), s = r.contains(document.activeElement);
		r.replaceChildren(...o.map((e) => oB(e, i, n))), s && !e.contains(document.activeElement) && r.querySelector("[aria-current='page']")?.focus({ preventScroll: !0 });
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(Bz);
		if (t === null || k(e.target)) return;
		let n = e.target.closest(`.${Zz}`);
		if (n !== null) {
			e.preventDefault(), this.chooseSize(t, Number(n.getAttribute(yt)));
			return;
		}
		let r = e.target.closest(`.${Jz}`);
		if (r !== null) {
			e.preventDefault(), this.toggleSizes(r);
			return;
		}
		let i = e.target.closest(`[${vt}]`), a = i === null ? null : this.hostOf(t);
		if (i === null || a === null) return;
		let o = Iz(this.shownState(a), i.getAttribute("data-ui-pager-page") ?? "");
		o !== null && (e.preventDefault(), this.turnAsync(a, o));
	}
	async turnAsync(e, t) {
		await this.requestPageAsync(e, t), wd(e).top > 0 && Td(e, 0);
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
		for (let t of this.root.querySelectorAll(Bz)) this.hostOf(t) === e && this.sync(t);
	}
	handleKeyDown(e) {
		if (e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(Bz);
		if (t === null) return;
		let n = e.target.closest(`.${Kz}`);
		if (n !== null && this.handleSizeKey(e, n)) return;
		let r = e.target.closest(`.${Vz}, .${Jz}`), i = lB(t);
		if (r === null || !i.includes(r) || !N(e)) return;
		let a = gd({
			key: e.key,
			items: i,
			current: r,
			axis: "horizontal"
		});
		a !== null && (e.preventDefault(), yd(i, a));
	}
	handleSizeKey(e, t) {
		let n = e.target instanceof Element ? e.target.closest(`.${Jz}`) : null;
		return n !== null && !this.menus.isOpen(t) && (e.key === "ArrowDown" || e.key === "ArrowUp") && N(e) ? (e.preventDefault(), this.openSizes(t, n, e.key === "ArrowUp"), !0) : this.menus.isOpen(t) && HP(e, fB(t));
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${Zz}`) : null, n = t?.closest(`.${Kz}`) ?? null;
		t !== null && n !== null && this.menus.isOpen(n) && GP(t, fB(n));
	}
	toggleSizes(e) {
		let t = e.closest(`.${Kz}`);
		t !== null && (this.menus.isOpen(t) ? this.menus.close(t) : this.openSizes(t, e, !1));
	}
	openSizes(e, t, n) {
		let r = e.querySelector(`:scope > .${Xz}`);
		if (r === null) return;
		let i = fB(e), a = i.find((e) => e.getAttribute("aria-checked") === "true") ?? null;
		VP(this.menus, {
			owner: e,
			popup: r,
			anchor: t,
			placement: { placement: "bottom-end" },
			openers: [t]
		}, i, a, n);
	}
	restoreSize(e, t, n) {
		let r = this.store.read(t, iB), i = r === null ? 0 : Number(r);
		if (!Number.isInteger(i) || i <= 0) return;
		if (!dB(e, i)) {
			this.store.write(t, iB, null);
			return;
		}
		let a = Nz(n);
		i !== a.size && (n.setAttribute(en, String(i)), a.count > 0 && this.turnAsync(n, Math.floor(a.offset / i) * i));
	}
	chooseSize(e, t) {
		let n = e.querySelector(`.${Kz}`);
		n !== null && this.menus.close(n);
		let r = this.targetOf(e);
		if (r === null || !Number.isInteger(t) || t <= 0) return;
		let i = Nz(r.host);
		t !== i.size && (this.store.write(r.component, iB, String(t)), r.host.setAttribute(en, String(t)), this.turnAsync(r.host, Math.floor(i.offset / t) * t));
	}
	handlePageKey(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "PageDown" && e.key !== "PageUp" || !N(e) || !(e.target instanceof Element)) return;
		let t = Ef(e);
		if (t === null || !t.root.matches(".ui-items-view, .ui-table") || k(t.root)) return;
		let n = pB(t.root);
		if (n === null || !n.hasAttribute("data-ui-window-paged")) return;
		let r = Iz(this.shownState(n), e.key === "PageDown" ? "next" : "previous");
		r !== null && (e.preventDefault(), this.turnFromKeyAsync(t.root, n, r));
	}
	async turnFromKeyAsync(e, t, n) {
		let r = mf(e), i = jf(r), a = i === null ? 0 : Math.max(0, r.indexOf(i));
		await this.requestPageAsync(t, n);
		let o = mf(e);
		o.length > 0 && Ff(e, o, o[Math.min(a, o.length - 1)]);
	}
};
function oB(e, t, n) {
	if (e === "gap") {
		let e = document.createElement("span");
		return e.className = Wz, e.setAttribute("aria-hidden", "true"), e.textContent = "…", e;
	}
	let r = document.createElement("button"), i = HO(e, "N0", n);
	return r.className = Qz.join(" "), r.setAttribute("type", "button"), r.setAttribute(vt, String(e)), r.textContent = i, O.write(r, "aria-label", $z, { page: i }), e === t && r.setAttribute("aria-current", "page"), r;
}
function sB(e, t, n) {
	let r = e.querySelector(`:scope > .${Gz}`);
	if (r === null) return;
	let i = n(t.count === 0 ? 0 : t.offset + 1), a = n(t.offset + t.count);
	t.total === null ? O.write(r, null, tB, {
		from: i,
		to: a
	}) : O.write(r, null, eB, {
		from: i,
		to: a,
		total: n(t.total)
	});
}
function cB(e, t, n) {
	let r = e.querySelector(`:scope > .${Kz}`), i = r?.querySelector(`.${Yz}`) ?? null;
	if (r !== null && i !== null) {
		O.write(i, null, nB, { size: n(t.size) });
		for (let e of fB(r)) e.setAttribute("aria-checked", Number(e.getAttribute("data-ui-pager-size")) === t.size ? "true" : "false");
	}
}
function lB(e) {
	return [...e.querySelectorAll(`.${Vz}, .${Jz}`)];
}
function uB(e) {
	let t = lB(e), n = t.find((e) => e === document.activeElement), r = t.filter((e) => e.getAttribute("data-ui-pager-page") === "previous" || e.getAttribute("data-ui-pager-page") === "next");
	P(t, n ?? r.find(F) ?? t.find((e) => e.getClientRects().length > 0) ?? null);
}
function dB(e, t) {
	let n = e.querySelector(`:scope > .${Kz}`);
	return n !== null && fB(n).some((e) => Number(e.getAttribute("data-ui-pager-size")) === t);
}
function fB(e) {
	return [...e.querySelectorAll(`:scope > .${Xz} > .${Zz}`)];
}
function pB(e) {
	for (let t of e.querySelectorAll(`[${x}][${Kt}="windowed"]`)) if (t.closest("[data-ui-id]") === e) return t;
	return null;
}
function mB(e) {
	return e instanceof Element && e.hasAttribute("data-ui-items-host");
}
function hB(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(Bz) || t.querySelector(Bz) !== null)) return !0;
	return !1;
}
//#endregion
//#region src/interactions/menu-search-engine.ts
var gB = `.${Ln}[${bn}]`, _B = ":scope > .ui-collapsible__bar", vB = ":scope > .ui-menu__host", yB = "ui-menu__item", bB = `:scope > .${Rn}`, xB = ":scope > .ui-menu__submenu > .ui-menu > .ui-menu__host", SB = class {
	active = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("input", (e) => this.handle(e), !0), t.addEventListener("change", (e) => this.handle(e), !0), t.addEventListener("keydown", (e) => this.handleKeydown(e)), V(t, gB, {
			childList: !0,
			addedOnly: !0,
			characterData: !0,
			attributeFilter: [dn, "class"]
		}, (e) => this.reconcile(e));
	}
	handle(e) {
		let t = e.target;
		if (!(t instanceof HTMLInputElement)) return;
		let n = CB(t);
		n !== null && this.search(n, t);
	}
	search(e, t) {
		let n = e.querySelector(vB);
		if (n === null) return;
		let r = T_(t.value, e);
		r.length === 0 ? this.clear(e, n) : (this.active.has(e) || this.active.set(e, {
			field: t,
			openBefore: wB(n)
		}), e.setAttribute(xn, ""), TE(e, n, !this.filter(n, r)));
	}
	filter(e, t) {
		let n = null, r = !1, i = !1;
		for (let a of TB(e)) {
			let e = EB(a);
			if (e === "header") {
				n !== null && OB(n, r), n = a, r = !1;
				continue;
			}
			let o = e !== "separator" && this.match(a, t);
			OB(a, o), r ||= o, i ||= o;
		}
		return n !== null && OB(n, r), i;
	}
	match(e, t) {
		let n = D_(DB(e), t), r = e.hasAttribute("data-ui-menu-group") ? e.querySelector(xB) : null;
		if (r === null) return n;
		if (n) return kB(r), e.removeAttribute(mn), !0;
		let i = this.filter(r, t);
		return e.toggleAttribute(mn, i), i;
	}
	clear(e, t) {
		kB(t), e.removeAttribute(xn), TB(t).length > 0 && TE(e, t, !1);
		let n = this.active.get(e);
		if (n === void 0) return;
		this.active.delete(e);
		let r = AB(e);
		for (let e of t.querySelectorAll(`[${fn}]:not([${pn}])`)) e.toggleAttribute(mn, !r && n.openBefore.has(e.getAttribute("data-ui-key") ?? e));
	}
	reconcile(e) {
		for (let t of e) {
			let e = this.active.get(t);
			e !== void 0 && (AB(t) && (e.field.value = "", e.field.blur()), this.search(t, e.field));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "ArrowDown" || e.defaultPrevented || !N(e) || !(e.target instanceof HTMLInputElement)) return;
		let t = CB(e.target), n = t === null ? void 0 : DI(t).find(F);
		n !== void 0 && (e.preventDefault(), n.focus());
	}
};
function CB(e) {
	let t = e.closest(gB), n = t?.querySelector(_B) ?? null;
	return t !== null && n !== null && n.contains(e) ? t : null;
}
function wB(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e.querySelectorAll(`[${fn}][${mn}]`)) t.add(n.getAttribute("data-ui-key") ?? n);
	return t;
}
function TB(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && e.classList.contains(yB));
}
function EB(e) {
	return e.querySelector(bB)?.getAttribute("data-ui-menu-item-kind") ?? "item";
}
function DB(e) {
	let t = e.querySelector(bB);
	return t === null ? "" : E_(A_(t), e);
}
function OB(e, t) {
	e.toggleAttribute(Sn, !t);
}
function kB(e) {
	for (let t of e.querySelectorAll(`[${Sn}]`)) t.removeAttribute(Sn);
}
function AB(e) {
	return e.hasAttribute("data-ui-collapsed") || e.classList.contains("ui-menu--rail");
}
//#endregion
//#region src/interactions/screen-keyboard.ts
var jB = 120;
function MB(e) {
	return e.typing && e.tallest - e.height > jB;
}
var NB = class {
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
		let t = MB({
			height: e.height,
			tallest: this.tallest,
			typing: nd(document.activeElement)
		});
		t !== document.documentElement.hasAttribute("data-ui-keyboard-up") && document.documentElement.toggleAttribute($r, t);
	}
}, PB = `[${Nn}], [${An}]`, FB = "--ui-window-foot", IB = "--ui-window-foot-ink", LB = 120, RB = /\s*\/\s*([\d.]+)(%?)\s*\)$/, zB = /^rgba\(([^,]+),([^,]+),([^,]+),\s*([\d.]+)(%?)\s*\)$/;
function BB(e) {
	if (e === "transparent") return 0;
	let t = zB.exec(e) ?? RB.exec(e);
	if (t === null) return 1;
	let n = Number(t[t.length - 2]);
	return t[t.length - 1] === "%" ? n / 100 : n;
}
function VB(e) {
	let t = zB.exec(e);
	return t === null ? e.replace(RB, ")") : `rgb(${t[1]},${t[2]},${t[3]})`;
}
function HB(e) {
	let t = [], n = null;
	for (let r of e) {
		let e = BB(r);
		if (e >= 1) {
			n = r;
			break;
		}
		e > 0 && t.push(r);
	}
	if (n === null) return null;
	for (let e = t.length - 1; e >= 0; e--) n = `color-mix(in srgb, ${VB(t[e])} ${Math.round(BB(t[e]) * 1e3) / 10}%, ${n})`;
	return n;
}
function UB(e) {
	let t = [];
	for (let n = e; n !== null; n = n.parentElement) t.push(getComputedStyle(n).backgroundColor);
	return HB(t);
}
var WB = class {
	scheduled = !1;
	covered = 0;
	probe = null;
	constructor(e = {}) {
		let t = e.root ?? document;
		if (!(t instanceof Node) || typeof MutationObserver > "u") return;
		let n = () => this.schedule();
		new MutationObserver(n).observe(t, {
			childList: !0,
			subtree: !0
		}), new MutationObserver(n).observe(document.documentElement, {
			attributes: !0,
			attributeFilter: [Wr]
		}), new MutationObserver(n).observe(document.head, {
			childList: !0,
			subtree: !0,
			characterData: !0
		}), matchMedia("(prefers-color-scheme: dark)").addEventListener("change", n), window.addEventListener("resize", n), document.addEventListener("transitionend", (e) => {
			e.target instanceof Element && e.target.closest(PB) !== null && n();
		}, !0), this.schedule();
	}
	schedule() {
		this.scheduled || (this.scheduled = !0, requestAnimationFrame(() => {
			this.scheduled = !1, this.update();
		}));
	}
	update() {
		let e = document.querySelectorAll(PB), t = e.length === 0 ? 0 : this.bottomInset(), n = e.length > 0 && KB(window.innerWidth / 2, window.innerHeight - t - 1);
		if (n && this.covered < LB) {
			this.covered++, this.schedule();
			return;
		}
		n || (this.covered = 0);
		for (let n of e) n.hasAttribute("data-ui-window-foot") && this.keepClear(n, t);
		let r = e.length === 0 ? null : GB(window.innerWidth / 2, window.innerHeight - t - 1, null), i = r === null ? null : UB(r);
		qB(document.documentElement, FB, i);
	}
	keepClear(e, t) {
		let n = e.getBoundingClientRect(), r = t > 0 && n.height > 0 && n.bottom >= window.innerHeight - 1, i = r ? GB(n.left + n.width / 2, Math.min(n.bottom, window.innerHeight - t) - 1, e) : null;
		r !== e.hasAttribute("data-ui-window-foot-edge") && e.toggleAttribute(ei, r), qB(e, IB, i === null ? null : UB(i));
	}
	bottomInset() {
		return this.probe === null && (this.probe = document.createElement("div"), this.probe.setAttribute("aria-hidden", "true"), this.probe.style.cssText = "position:fixed;visibility:hidden;pointer-events:none;height:0;padding-bottom:env(safe-area-inset-bottom,0px)", document.body.append(this.probe)), parseFloat(getComputedStyle(this.probe).paddingBottom) || 0;
	}
};
function GB(e, t, n) {
	for (let r of document.elementsFromPoint(e, t)) {
		let e = r.closest(PB);
		if (e !== null && (n === null || e === n)) return r;
	}
	return null;
}
function KB(e, t) {
	return document.elementsFromPoint(e, t).every((e) => e === document.documentElement);
}
function qB(e, t, n) {
	n === null ? e.style.getPropertyValue(t) !== "" && e.style.removeProperty(t) : e.style.getPropertyValue(t) !== n && e.style.setProperty(t, n);
}
//#endregion
//#region src/interactions/side-drawer-engine.ts
var JB = "[data-ui-root]", YB = "a[href]", XB = "ui-collapsible", ZB = "ui-collapsible__bar", QB = "right-side", $B = "ui-side--left", eV = "ui-side--right", tV = "pinned", nV = class {
	root;
	holders = /* @__PURE__ */ new Map();
	openers = /* @__PURE__ */ new WeakMap();
	switchNames = /* @__PURE__ */ new Map();
	store = new qF();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), Th(() => this.refit(), MF);
		for (let e of document.querySelectorAll(JB)) lV(e);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Cn}]`);
		if (t !== null) {
			let e = t.closest(JB), n = t.getAttribute(Cn);
			e !== null && n !== null && this.toggle(e, n, t);
			return;
		}
		let n = e.target.closest(`[${On}]`);
		if (n !== null) {
			let e = n.closest(JB), t = n.getAttribute(On);
			e !== null && t !== null && this.pin(e, t, !e.hasAttribute(kn(t)), n);
			return;
		}
		if (e.target.closest("[data-ui-drawer-backdrop]") !== null) {
			this.closeAll();
			return;
		}
		let r = e.target.closest(`[${qn}]`);
		if (r !== null && !e.defaultPrevented && oV(r)) {
			this.closeAll();
			return;
		}
		let i = e.target.closest(`${YB}, .${Rn}`), a = i?.closest(`[${Fn}]`), o = a?.parentElement ?? null;
		i !== null && a != null && o?.getAttribute("data-ui-drawer-open") === a.getAttribute("data-ui-region") && sV(i) && this.close(o);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || M(e)) return;
		if (e.key === "Tab") {
			this.trapTab(e);
			return;
		}
		if (e.key !== "Escape" || Ku(e) || v_(e.target)) return;
		let t = !1;
		for (let { shell: e, drawer: n, modal: r } of this.openDrawers()) (r || n.contains(document.activeElement)) && (this.close(e), t = !0);
		t && e.preventDefault();
	}
	trapTab(e) {
		for (let { drawer: t, modal: n } of this.openDrawers()) n && Yp(t, e);
	}
	openDrawers() {
		let e = [];
		for (let t of document.querySelectorAll(`${JB}[${wn}]`)) {
			let n = t.getAttribute("data-ui-drawer-open") ?? "", r = uV(t, n);
			r !== null && !s_(r) && e.push({
				shell: t,
				drawer: r,
				modal: cV(t, n)
			});
		}
		return e;
	}
	refit() {
		for (let e of document.querySelectorAll(`${JB}[${wn}]`)) {
			let t = e.getAttribute("data-ui-drawer-open") ?? "", n = uV(e, t), r = this.openers.get(e);
			n === null || !FF(e, t) ? this.close(e) : r?.isConnected === !0 && this.placeSwitch(n, r);
		}
	}
	toggle(e, t, n) {
		if (e.getAttribute("data-ui-drawer-open") === t) {
			this.close(e);
			return;
		}
		let r = uV(e, t);
		r !== null && !r.hasAttribute("data-ui-bottom-bar") && FF(e, t) && (e.hasAttribute("data-ui-drawer-open") && this.close(e), e.setAttribute(wn, t), this.openers.set(e, n), this.markToggles(e), this.hold(r, cV(e, t)), this.placeSwitch(r, n), this.focusInto(e, t, r, document.activeElement, Ip(), performance.now() + B.normal));
	}
	hold(e, t) {
		if (this.holders.has(e) || e.hasAttribute("data-ui-focus-holder")) return;
		let n = !e.hasAttribute("tabindex"), r = t && !e.hasAttribute("aria-label") && !e.hasAttribute("aria-labelledby");
		this.holders.set(e, {
			modal: t,
			addsTabIndex: n,
			addsName: r,
			role: e.getAttribute("role")
		}), n && (e.tabIndex = -1), t && (e.setAttribute(Ai, ""), e.setAttribute("role", "dialog"), e.setAttribute("aria-modal", "true"), r && e.setAttribute("aria-label", O.text("ui.side.panel")));
	}
	placeSwitch(e, t) {
		let n = rV(e), r = t.getBoundingClientRect();
		if (n === null) return;
		this.switchNames.has(n) || this.switchNames.set(n, n.getAttribute("aria-label")), n.setAttribute("aria-label", O.text("ui.side.close"));
		let i = n.parentElement?.classList.contains(ZB) === !0 ? n.parentElement : n;
		if (r.width === 0 || r.height === 0) {
			n.removeAttribute(Tn), i.removeAttribute(En);
			return;
		}
		n.style.setProperty("--ui-drawer-switch-width", `${r.width}px`), n.style.setProperty("--ui-drawer-switch-height", `${r.height}px`), n.style.setProperty("--ui-drawer-switch-x", "0px"), i.style.setProperty("--ui-drawer-switch-y", "0px"), n.setAttribute(Tn, ""), i.setAttribute(En, "");
		let a = n.getBoundingClientRect(), o = e.getBoundingClientRect(), s = aV(r.left - e.offsetLeft, e.clientWidth - a.width), c = aV(r.top - o.top, e.clientHeight - a.height);
		n.style.setProperty("--ui-drawer-switch-x", `${s - (a.left - o.left)}px`), i.style.setProperty("--ui-drawer-switch-y", `${c - (a.top - o.top)}px`);
	}
	focusInto(e, t, n, r, i, a) {
		e.getAttribute("data-ui-drawer-open") !== t || document.activeElement !== r || n.contains(r) || (tm(n, i ? n : null), performance.now() < a && document.activeElement === r && requestAnimationFrame(() => this.focusInto(e, t, n, r, i, a)));
	}
	pin(e, t, n, r) {
		let i = uV(e, t);
		if (i === null || RF(e, t)) return;
		let a = i.contains(r);
		if (n && e.getAttribute("data-ui-drawer-open") === t && this.close(e, !a), e.toggleAttribute(kn(t), n), lV(e), !n && a && i.contains(document.activeElement)) {
			let n = this.returnTarget(e, t);
			n !== null && z(n);
		}
		let o = i.querySelector(`[${Je}]`);
		o !== null && this.store.write(o, tV, n ? "true" : null, n ? {
			root: !0,
			attributes: { [kn(t)]: "" }
		} : null);
	}
	closeAll() {
		for (let e of document.querySelectorAll(`${JB}[${wn}]`)) this.close(e);
	}
	close(e, t = !0) {
		let n = e.getAttribute(wn);
		if (e.removeAttribute(wn), this.markToggles(e), n === null) return;
		let r = uV(e, n), i = document.activeElement;
		if (t && (i === null || i === document.body || r?.contains(i) === !0)) {
			let t = this.returnTarget(e, n);
			t !== null && r !== null && r.contains(i) ? um(t, r) : t !== null && z(t);
		}
		this.release(r), this.renameSwitch(r);
	}
	returnTarget(e, t) {
		let n = this.openers.get(e);
		if (this.openers.delete(e), n?.isConnected === !0 && n.getAttribute("data-ui-drawer-toggle") === t && n.checkVisibility()) return n;
		let r = [...e.querySelectorAll(`[${Cn}="${C(t)}"]`)];
		return r.find((e) => e.checkVisibility()) ?? r[0] ?? null;
	}
	markToggles(e) {
		let t = e.getAttribute(wn);
		for (let n of e.querySelectorAll(`[${Cn}]`)) n.setAttribute("aria-expanded", String(n.getAttribute(Cn) === t));
	}
	release(e) {
		let t = e === null ? void 0 : this.holders.get(e);
		e !== null && t !== void 0 && (this.holders.delete(e), t.addsTabIndex && e.removeAttribute("tabindex"), t.modal && (e.removeAttribute(Ai), e.removeAttribute("aria-modal"), t.role === null ? e.removeAttribute("role") : e.setAttribute("role", t.role), t.addsName && e.removeAttribute("aria-label")));
	}
	renameSwitch(e) {
		for (let [t, n] of this.switchNames) e?.contains(t) !== !0 && t.isConnected || (this.switchNames.delete(t), n === null ? t.removeAttribute("aria-label") : t.setAttribute("aria-label", n));
	}
};
function rV(e) {
	for (let t of e.querySelectorAll(`[${qn}]`)) if (oV(t) && t.checkVisibility() && iV(t.closest(`.${XB}`), e)) return t;
	return null;
}
function iV(e, t) {
	let n = e;
	for (; n !== null && n !== t;) {
		let e = n.parentElement;
		if (e === null || e.firstElementChild !== n) return !1;
		n = e;
	}
	return n === t;
}
function aV(e, t) {
	return Math.max(0, Math.min(e, t));
}
function oV(e) {
	let t = e.closest(`.${XB}`), n = t?.closest(`[${Fn}]`), r = n?.getAttribute(Fn), i = n?.parentElement;
	return t == null || t.hasAttribute("data-ui-collapsed") || r == null || i == null ? !1 : i.matches(JB) && i.getAttribute("data-ui-drawer-open") === r && t.classList.contains(r === QB ? eV : $B);
}
function sV(e) {
	return !e.classList.contains("ui-menu-item") || EI(e) && e.closest(".ui-context-menu, .ui-split-button__menu, .ui-flyout__content") === null;
}
function cV(e, t) {
	return !(e.getAttribute("data-ui-drawer-modeless") ?? "").split(" ").includes(t);
}
function lV(e) {
	for (let t of e.querySelectorAll(`[${On}]`)) {
		let n = String(e.hasAttribute(kn(t.getAttribute("data-ui-drawer-pin") ?? "")));
		t.getAttribute("aria-pressed") !== n && (t.setAttribute("aria-pressed", n), t.getAttribute("data-ui-value-kind") === "pressed" && t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}
function uV(e, t) {
	return e.querySelector(`:scope > [${Fn}="${C(t)}"]`);
}
//#endregion
//#region src/interactions/collapsible-engine.ts
var dV = "ui-collapsible", fV = "ui-collapsible__content", pV = "ui-collapsible__bar", mV = "ui-collapsible__bar-content", hV = "collapsed", gV = class {
	root;
	store = new qF();
	restored = /* @__PURE__ */ new WeakSet();
	folds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.restoreEach(this.root.querySelectorAll(`.${dV}`)), V(this.root, `.${dV}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [dn]
		}, (e) => this.restoreEach(e));
	}
	restoreEach(e) {
		for (let t of e) this.restored.has(t) ? this.apply(t, t.hasAttribute(dn)) : (this.restored.add(t), this.restore(t));
	}
	restore(e) {
		if (this.toggleOf(e) === null) return;
		let t = this.store.read(e, hV);
		t !== null && this.apply(e, t === "true");
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${qn}]`), n = t?.closest(`.${dV}`) ?? null;
		if (t === null || n === null || oV(t)) return;
		e.preventDefault();
		let r = !n.hasAttribute(dn), i = this.partsOf(n, t);
		this.cancelFold(n);
		let a = vV(n, i);
		this.apply(n, r), this.playFold(n, i, a, r), this.store.write(n, hV, r ? "true" : "false", r ? { attributes: { [dn]: "" } } : null);
	}
	apply(e, t) {
		e.toggleAttribute(dn, t), this.toggleOf(e)?.setAttribute("aria-expanded", t ? "false" : "true");
	}
	partsOf(e, t) {
		return {
			content: e.querySelector(`:scope > .${fV}`),
			bar: e.querySelector(`:scope > .${pV} > .${mV}`),
			toggle: t
		};
	}
	toggleOf(e) {
		return e.querySelector(`:scope > [${qn}], :scope > .${pV} > [${qn}]`);
	}
	playFold(e, t, n, r) {
		if (typeof e.animate != "function" || gh()) return;
		let i = bV(_V(e), n, vV(e, t), r);
		if (i === null) return;
		e.setAttribute(Jn, ""), e.offsetWidth;
		let a = {
			duration: B.normal,
			easing: B.ease
		}, o = [e.animate(i.component, a)];
		t.content !== null && o.push(t.content.animate(i.content, a)), t.bar !== null && o.push(t.bar.animate(i.bar, a)), i.toggle !== null && o.push(t.toggle.animate(i.toggle, a)), this.folds.set(e, o), Promise.allSettled(o.map((e) => e.finished)).then(() => {
			this.folds.get(e) === o && (this.folds.delete(e), e.removeAttribute(Jn));
		});
	}
	cancelFold(e) {
		let t = this.folds.get(e);
		if (t !== void 0) {
			this.folds.delete(e), e.removeAttribute(Jn);
			for (let e of t) e.cancel();
		}
	}
};
function _V(e) {
	return e.classList.contains("ui-side--top") || e.classList.contains("ui-side--bottom") ? "height" : "width";
}
function vV(e, t) {
	let n = _V(e), r = yV(n), i = e.getBoundingClientRect(), a = t.content?.getBoundingClientRect(), o = t.toggle.getBoundingClientRect();
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
function yV(e) {
	return e === "width" ? "height" : "width";
}
function bV(e, t, n, r) {
	let i = yV(e), a = t.component !== n.component, o = Math.abs(t.componentAcross - n.componentAcross) >= .5;
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
function xV(e, t) {
	if (typeof ResizeObserver == "function") {
		let n = new ResizeObserver(() => t(e));
		return n.observe(e), () => n.disconnect();
	}
	let n = () => t(e);
	return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
}
//#endregion
//#region src/interactions/grid-splitter-engine.ts
var SV = "ui-grid-splitter", CV = "ui-container", wV = "ui-orientation--vertical", TV = 16, EV = {
	sliver: 0,
	passFloors: !0
}, DV = {
	sliver: 48,
	passFloors: !0
}, OV = {
	slot: "columns",
	authored: "--ui-columns",
	split: "--ui-split-columns",
	limits: Yn,
	computed: "gridTemplateColumns",
	lineStart: "gridColumnStart",
	lineEnd: "gridColumnEnd",
	coordinate: "clientX",
	decrease: "ArrowLeft",
	increase: "ArrowRight"
}, kV = {
	slot: "rows",
	authored: "--ui-rows",
	split: "--ui-split-rows",
	limits: Xn,
	computed: "gridTemplateRows",
	lineStart: "gridRowStart",
	lineEnd: "gridRowEnd",
	coordinate: "clientY",
	decrease: "ArrowUp",
	increase: "ArrowDown"
}, AV = class {
	root;
	store = new qF();
	restored = /* @__PURE__ */ new WeakMap();
	warner = new p();
	drag;
	placedTiers = /* @__PURE__ */ new WeakMap();
	waiting = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new j_({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${SV}`),
			begin: (e) => this.resolveContext(e),
			coordinate: (e) => e.axis.coordinate,
			move: (e, t) => {
				this.apply(e, t, EV) && this.reportPosition(e.splitter, e.tracks);
			},
			end: (e, t) => {
				this.settle(e), this.remember(t), this.reportPosition(e), this.writeBack(e, t);
			},
			cancel: (e, t) => this.putBack(e, t)
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.prepareEach(this.root.querySelectorAll(`.${SV}`)), V(this.root, `.${SV}`, { childList: !0 }, (e) => this.prepareEach(e)), V(this.root, `.${SV}`, { attributeFilter: [Qn] }, (e) => this.takeEach(e)), window.addEventListener("resize", () => this.reportEach());
	}
	prepareEach(e) {
		for (let t of e) {
			let e = NV(t);
			e !== null && (this.restore(e, PV(t)), this.place(t), this.reportPosition(t));
		}
	}
	restore(e, t) {
		let n = this.restored.get(e);
		if (n === void 0 && (n = /* @__PURE__ */ new Set(), this.restored.set(e, n)), n.has(t.slot)) return;
		n.add(t.slot);
		let r = this.store.readJson(e, t.slot);
		if (r !== null) for (let n of yh) {
			let i = r[n], a = Dh(t.split, n);
			i !== void 0 && e.style.getPropertyValue(a).length === 0 && e.style.setProperty(a, i);
		}
	}
	place(e) {
		let t = VV(e);
		if (t === null) return;
		if (e.getClientRects().length === 0) {
			this.waitForBox(e);
			return;
		}
		this.stopWaiting(e);
		let n = this.resolveContext(e);
		if (n === null || (this.placedTiers.set(e, n.tier), !e.hasAttribute("data-ui-bind-position") && IV(n.container, n.axis, n.tier) !== void 0)) return;
		let r = Ql(n.sizes, n.runs, t);
		Math.abs(r) >= 1 && this.apply(n, r) && this.remember(n);
	}
	waitForBox(e) {
		this.waiting.has(e) || this.waiting.set(e, xV(e, () => {
			!e.isConnected || VV(e) === null ? this.stopWaiting(e) : e.getClientRects().length > 0 && (this.place(e), this.reportPosition(e));
		}));
	}
	stopWaiting(e) {
		this.waiting.get(e)?.(), this.waiting.delete(e);
	}
	takeEach(e) {
		for (let t of e) VV(t) === null && t.hasAttribute("data-ui-bind-position") ? this.reset(t, !1) : this.place(t), this.reportPosition(t);
	}
	reportEach() {
		let e = Eh();
		for (let t of this.root.querySelectorAll(`.${SV}`)) this.placedTiers.has(t) && this.placedTiers.get(t) !== e && this.place(t), this.reportPosition(t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || !N(e)) return;
		let t = e.target.closest(`.${SV}`);
		if (t === null || this.drag.active || k(t)) return;
		if (e.key === "Enter") {
			e.preventDefault(), this.reset(t);
			return;
		}
		let n = this.resolveContext(t);
		if (n === null) return;
		let r = UV(t), i = n.sizes.reduce((e, t) => e + t, 0), a;
		switch (e.key) {
			case n.axis.decrease:
				a = -r;
				break;
			case n.axis.increase:
				a = r;
				break;
			case "PageUp":
			case "PageDown":
				a = Ol(r, i) * BV(e.key, n.axis);
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
		let n = NV(e);
		if (n === null) return;
		let r = PV(e);
		for (let e of yh) n.style.removeProperty(Dh(r.split, e));
		this.store.write(n, r.slot, null), this.placedTiers.delete(e), e.hasAttribute("data-ui-bind-position") || this.place(e), this.reportPosition(e), t && e.hasAttribute("data-ui-bind-position") && e.hasAttribute("data-ui-splitter-position") && (e.removeAttribute(Qn), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	writeBack(e, t) {
		if (!e.hasAttribute("data-ui-bind-position")) return;
		let n = HV(Zl(LV(t.container, t.axis), t.runs));
		e.getAttribute("data-ui-splitter-position") !== n && (e.setAttribute(Qn, n), this.placedTiers.set(e, t.tier), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	handleDoubleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${SV}`) : null;
		t !== null && this.reset(t);
	}
	settle(e) {
		let t = this.resolveContext(e), n = t === null ? 0 : nu(t.tracks, t.sizes, t.runs, 48);
		t !== null && n !== 0 && this.apply(t, n, EV);
	}
	putBack(e, t) {
		let n = Dh(t.axis.split, t.tier);
		t.before.length === 0 ? t.container.style.removeProperty(n) : t.container.style.setProperty(n, t.before), this.reportPosition(e);
	}
	apply(e, t, n = DV) {
		let r = Vl(e.tracks, e.sizes, e.runs, t, n);
		return r !== null && (e.container.style.setProperty(Dh(e.axis.split, e.tier), Nl(r)), !0);
	}
	remember(e) {
		let { container: t, axis: n } = e, r = {}, i = {};
		for (let e of yh) {
			let a = Dh(n.split, e), o = t.style.getPropertyValue(a).trim();
			o.length > 0 && (r[e] = o, i[a] = o);
		}
		let a = { styles: i };
		this.store.write(t, n.slot, Object.keys(r).length === 0 ? null : JSON.stringify(r), a);
	}
	resolveContext(e) {
		let t = NV(e);
		if (t === null) return this.warner.warn(e, "a grid splitter must be a direct child of a container."), null;
		let n = PV(e), r = Eh(), i = FV(t, n, r), a = i === null ? null : kl(i);
		if (a === null) return this.warner.warn(e, "the container's track list could not be read.", { template: i }), null;
		let o = Ll(a, Il(t.getAttribute(n.limits))), s = LV(t, n), c = RV(e, n);
		if (c === null || c >= o.length || s.length < o.length) return this.warner.warn(e, "the splitter's track could not be found in its container.", {
			index: c,
			tracks: o.length,
			sizes: s.length
		}), null;
		o[c].kind === "star" && this.warner.warn(e, "a grid splitter sits in a star track and shares the room it divides; give it an Auto or Absolute track.");
		let l = Rl(c, zV(t, n).map((e) => RV(e, n)).filter((e) => e !== null && e !== c), o.length);
		return l === null ? (this.warner.warn(e, "a grid splitter at the container's edge has nothing on one side to move."), null) : {
			splitter: e,
			container: t,
			axis: n,
			tracks: o,
			sizes: s,
			runs: l,
			tier: r,
			before: t.style.getPropertyValue(Dh(n.split, r))
		};
	}
	reportPosition(e, t) {
		let n = NV(e);
		if (n === null) return;
		let r = PV(e), i = RV(e, r), a = LV(n, r), o = zV(n, r).map((e) => RV(e, r)).filter((e) => e !== null && e !== i), s = i === null ? null : Rl(i, o, a.length);
		s !== null && (e.setAttribute("aria-valuemin", "0"), e.setAttribute("aria-valuemax", "100"), e.setAttribute("aria-valuenow", String(Xl(a, s))), w(e, ii, jV(a, s.before) ? "before" : jV(a, s.after) ? "after" : null), MV(n, t === void 0 ? null : {
			axis: r,
			tracks: ru(t, a, s, 48)
		}));
	}
};
function jV(e, t) {
	return t.every((t) => (e[t] ?? 0) < 1);
}
function MV(e, t) {
	let n = [OV, kV].filter((t) => zV(e, t).length > 0).map((t) => ({
		axis: t,
		sizes: LV(e, t)
	}));
	for (let r of e.children) {
		if (!(r instanceof HTMLElement)) continue;
		let e = getComputedStyle(r), i = r.classList.contains(SV) ? PV(r) : null, a = n.some(({ axis: n, sizes: r }) => n !== i && au(e[n.lineStart], e[n.lineEnd], r, t?.axis === n ? t.tracks : void 0));
		a !== r.hasAttribute("data-ui-split-folded") && r.toggleAttribute(ri, a);
	}
}
function NV(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(CV) ? t : null;
}
function PV(e) {
	return e.classList.contains(wV) ? OV : kV;
}
function FV(e, t, n) {
	let r = IV(e, t, n);
	if (r !== void 0) return r;
	let i = e.style.getPropertyValue(t.authored).trim();
	return i.length > 0 ? i : null;
}
function IV(e, t, n) {
	return Ah(n, (n) => e.style.getPropertyValue(Dh(t.split, n)).trim() || void 0);
}
function LV(e, t) {
	return getComputedStyle(e)[t.computed].split(" ").map(parseFloat).filter((e) => Number.isFinite(e));
}
function RV(e, t) {
	let n = Number(getComputedStyle(e)[t.lineStart]);
	return Number.isInteger(n) && n >= 1 ? n - 1 : null;
}
function zV(e, t) {
	let n = [];
	for (let r of e.children) r instanceof HTMLElement && r.classList.contains(SV) && PV(r) === t && n.push(r);
	return n;
}
function BV(e, t) {
	return t.increase === "ArrowDown" ? e === "PageDown" ? 1 : -1 : e === "PageUp" ? 1 : -1;
}
function VV(e) {
	return $l(e.getAttribute(Qn));
}
function HV(e) {
	return String(Math.round(e * 1e4) / 1e4);
}
function UV(e) {
	let t = Number(e.getAttribute(Zn));
	return Number.isFinite(t) && t > 0 ? t : TV;
}
//#endregion
//#region src/interactions/pane-container-engine.ts
var WV = "ui-pane-container", GV = "ui-pane-container__place", KV = "ui-pane-container__pane", qV = "ui-pane-container__grip", JV = "data-ui-pane-lifted", YV = "data-ui-pane-target", XV = "data-ui-pane-moving", ZV = "data-ui-pane-near", QV = "data-ui-pane-raised", $V = ".ui-text-type--display, .ui-text-type--title, .ui-text-type--subtitle", eH = "panes", tH = ",", nH = 32, rH = class {
	root;
	store = new qF();
	drag;
	restored = /* @__PURE__ */ new WeakSet();
	held = null;
	raised = null;
	near = null;
	nearTop = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new j_({
			root: this.root,
			resolveHandle: (e) => aH(e),
			begin: (e, t) => this.lift(e, t),
			move: (e, t, n) => this.follow(e, n),
			end: (e, t) => this.put(t),
			cancel: (e, t) => this.putBack(t),
			takenBack: (e, t) => this.putBack(t)
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), { passive: !0 }), this.root.addEventListener("pointerout", (e) => this.handlePointerOut(e), { passive: !0 }), this.root.addEventListener("pointerover", () => this.forgetNearTop(), { passive: !0 }), this.root.addEventListener("scroll", () => this.handleScroll(), {
			capture: !0,
			passive: !0
		}), window.addEventListener("resize", () => this.forgetNearTop()), this.arrangeEach(this.root.querySelectorAll(`.${WV}`), !1), V(this.root, `.${WV}`, {
			childList: !0,
			attributeFilter: [$n],
			relevant: uH
		}, (e) => this.arrangeEach(dH(e), !0));
	}
	arrangeEach(e, t) {
		for (let n of e) {
			let e = !this.restored.has(n);
			if (e) {
				this.restored.add(n), this.restore(n);
				for (let e of fH(n)) {
					let t = e.querySelector(`:scope > .${KV} > .${qV}`);
					t !== null && sH(t);
				}
			}
			n.hasAttribute(XV) || gH(n, mH(n), t && !e);
		}
	}
	restore(e) {
		if (e.hasAttribute("data-ui-bind-layout")) return;
		let t = this.store.read(e, eH);
		t !== null && e.setAttribute($n, t);
	}
	lift(e, t) {
		this.dropStaleHold();
		let n = e.parentElement, r = n?.parentElement, i = r?.parentElement;
		if (this.held !== null || n === null || r == null || i == null || pH(i).length < 2) return null;
		if (typeof n.getAnimations == "function") for (let e of n.getAnimations()) e.cancel();
		n.setAttribute(JV, ""), i.setAttribute(XV, "");
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
		n.style.minWidth = `${r.width}px`, n.style.minHeight = `${r.height}px`, t.style.left = `${r.left}px`, t.style.top = `${r.top}px`, t.style.width = `${r.width}px`, t.style.height = `${r.height}px`, t.setAttribute("popover", "manual"), t.setAttribute(QV, ""), t.showPopover(), this.raised = e;
	}
	follow(e, t) {
		e.pane.style.transform = `translate(${t.x - e.start.x}px, ${t.y - e.start.y}px)`, this.mark(e, NH(e.container, e.origin, t));
	}
	mark(e, t) {
		e.target !== t && (e.target?.removeAttribute(YV), t?.setAttribute(YV, ""), e.target = t);
	}
	put(e) {
		let t = e.target, n = e.pane.parentElement, r = t?.querySelector(`:scope > .${KV}`) ?? null;
		if (t === null || n === null || r === e.pane || !e.container.isConnected) return this.putBack(e), null;
		this.settle(e);
		let i = /* @__PURE__ */ new Map([[e.pane, t]]);
		return r !== null && i.set(r, n), _H(e.container, i, !0), this.keep(e.container), t;
	}
	putBack(e) {
		this.settle(e), vH(e.pane), e.container.isConnected && gH(e.container, mH(e.container), !0);
	}
	settle(e) {
		this.lower(e), e.target?.removeAttribute(YV), e.pane.removeAttribute(JV), e.container.removeAttribute(XV), e.grip.setAttribute("aria-pressed", "false"), e.grip.removeAttribute(ji);
	}
	lower(e) {
		let { pane: t, origin: n } = e;
		if (this.raised === e && (this.raised = null), t.hasAttribute(QV)) {
			t.matches(":popover-open") && t.hidePopover(), t.removeAttribute("popover"), t.removeAttribute(QV);
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
		let t = hH(e);
		e.setAttribute($n, t), e.hasAttribute("data-ui-bind-layout") ? e.dispatchEvent(new Event("change", { bubbles: !0 })) : this.store.write(e, eH, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || !N(e)) return;
		this.dropStaleHold();
		let t = aH(e.target);
		if (t === null || this.drag.active) return;
		let n = this.held;
		if (n === null) {
			if (e.key !== " " && e.key !== "Enter") return;
			e.preventDefault(), this.hold(t);
			return;
		}
		if (n.pane !== t.parentElement) return;
		let r = iH[e.key];
		if (r !== void 0) {
			e.preventDefault();
			let t = PH(n.container, n.origin, n.target ?? n.origin, r) ?? n.target;
			t !== null && t !== n.target && KA({
				key: "ui.pane.target",
				args: lH(n.container, t)
			}), this.mark(n, t);
		} else if (e.key === " " || e.key === "Enter") {
			e.preventDefault(), this.held = null;
			let r = this.put(n);
			if (r === null) KA({ key: "ui.pane.back" });
			else {
				let { index: e, count: t } = lH(n.container, r);
				JA(e, t);
			}
			t.focus({ preventScroll: !0 });
		} else e.key === "Escape" && (e.preventDefault(), this.held = null, this.putBack(n), KA({ key: "ui.pane.back" }));
	}
	hold(e) {
		this.held = this.lift(e, {
			x: 0,
			y: 0
		}), this.held !== null && (e.setAttribute("aria-pressed", "true"), e.setAttribute(ji, ""), KA({ key: "ui.pane.lifted" }));
	}
	handleFocusOut(e) {
		let t = this.held;
		t !== null && e.target instanceof Element && e.target.parentElement === t.pane && (this.held = null, this.putBack(t));
	}
	handleFocusIn(e) {
		let t = e.target instanceof Element ? aH(e.target) : null;
		t !== null && sH(t);
	}
	handlePointerMove(e) {
		if (!(e instanceof PointerEvent) || e.pointerType === "touch") return;
		let t = e.target instanceof Element ? oH(e.target) : null;
		if (t === null) {
			this.markNear(null);
			return;
		}
		let n = this.nearTop;
		n?.pane !== t && (n = {
			pane: t,
			top: t.getBoundingClientRect().top
		}, this.nearTop = n), this.markNear(e.clientY - n.top < nH ? t : null);
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
		e !== this.near && (this.near?.removeAttribute(ZV), e?.setAttribute(ZV, ""), this.near = e);
	}
	handlePointerOut(e) {
		e instanceof PointerEvent && e.relatedTarget === null && this.markNear(null);
	}
}, iH = {
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
function aH(e) {
	let t = e.closest(`.${qV}`);
	return t?.parentElement?.parentElement?.parentElement?.classList.contains(WV) === !0 ? t : null;
}
function oH(e) {
	let t = e.closest(`.${KV}`);
	return t?.parentElement?.parentElement?.classList.contains(WV) === !0 ? t : null;
}
function sH(e) {
	let t = e.parentElement, n = t === null ? null : cH(t), r = n === null ? "ui.pane.move" : "ui.pane.grip", i = n === null ? null : { name: n };
	e.getAttribute("aria-label") !== O.translate(r, i) && O.write(e, "aria-label", r, i);
}
function cH(e) {
	for (let t of e.querySelectorAll($V)) {
		let n = oH(t) === e ? t.textContent?.trim() ?? "" : "";
		if (n.length > 0) return n;
	}
	return null;
}
function lH(e, t) {
	let n = pH(e);
	return {
		index: n.indexOf(t) + 1,
		count: n.length
	};
}
function uH(e) {
	if (e.type === "attributes") return e.target instanceof Element && e.target.classList.contains(WV);
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains(WV) || t.querySelector(`.${WV}`) !== null)) return !0;
	return !1;
}
function dH(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) {
		t.add(n);
		for (let e of n.querySelectorAll(`.${WV}`)) t.add(e);
	}
	return t;
}
function fH(e) {
	return Array.from(e.querySelectorAll(`:scope > .${GV}`));
}
function pH(e) {
	return fH(e).filter((e) => e.getClientRects().length > 0);
}
function mH(e) {
	return e.getAttribute($n);
}
function hH(e) {
	return fH(e).map((e) => e.querySelector(`:scope > .${KV}`)?.getAttribute("data-ui-pane") ?? "").join(tH);
}
function gH(e, t, n) {
	let r = fH(e), i = bH(r.map((e) => e.getAttribute("data-ui-pane-place") ?? ""), t), a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
	for (let e of r) {
		let t = e.querySelector(`:scope > .${KV}`), n = t?.getAttribute(er);
		t != null && n != null && a.set(n, t);
	}
	r.forEach((e, t) => {
		let n = a.get(i[t]);
		n !== void 0 && n.parentElement !== e && o.set(n, e);
	}), o.size > 0 && _H(e, o, n);
}
function _H(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let e of t.keys()) r.set(e, e.getBoundingClientRect());
	for (let [e, n] of t) e.style.transform = "", n.append(e);
	if (kH(e), !n || gh()) return;
	let i = t.size + 1;
	for (let [e, t] of r) {
		let n = typeof e.animate == "function" ? yH(t, e.getBoundingClientRect()) : null, r = String(i--);
		n !== null && e.animate(n.map((e) => ({
			...e,
			zIndex: r
		})), {
			duration: B.normal + 60,
			easing: B.ease
		});
	}
}
function vH(e) {
	let t = e.style.transform;
	e.style.transform = "", !(t.length === 0 || t === "translate(0px, 0px)" || gh() || typeof e.animate != "function") && e.animate([{ transform: t }, { transform: "none" }], {
		duration: B.normal,
		easing: B.ease
	});
}
function yH(e, t) {
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
function bH(e, t) {
	let n = new Set(e), r = /* @__PURE__ */ new Set(), i = e.map(() => null), a = t === null || t.length === 0 ? [] : t.split(tH).map((e) => e.trim());
	for (let e = 0; e < i.length && e < a.length; e++) n.has(a[e]) && !r.has(a[e]) && (i[e] = a[e], r.add(a[e]));
	let o = e.filter((e) => !r.has(e));
	return i.map((e) => e ?? o.shift() ?? "");
}
function xH(e, t, n, r, i, a, o) {
	let s = e.map((e) => SH(e.cells, n));
	return {
		cells: s,
		columnOrder: a ? CH(e, t, s, r, !0) : null,
		rowOrder: o ? CH(e, t, s, i, !1) : null
	};
}
function SH(e, t) {
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
function CH(e, t, n, r, i) {
	let a = [...n], o = new Map(e.map((e, t) => [e.name, t])), s = a.map(() => !1), c = null;
	for (let l = 0; l < a.length; l++) {
		if (s[l]) continue;
		let u = [];
		for (let e = l; e < a.length; e++) !s[e] && DH(a[e], a[l], i) && (s[e] = !0, u.push(e));
		u.sort((e, t) => EH(a[e], i).start - EH(a[t], i).start);
		let d = 0;
		for (let s = 1; s <= u.length; s++) s < u.length && EH(a[u[s]], i).start === OH(a[u[s - 1]], i) || (s - d > 1 && (c = wH(u.slice(d, s), e, t, o, a, n, r, i, c)), d = s);
	}
	return c;
}
function wH(e, t, n, r, i, a, o, s, c) {
	let l = [], u = !1, d = !1;
	for (let i of e) {
		let a = r.get(n[i]);
		if (a === void 0 || !e.includes(a)) return c;
		l.push(a), u ||= t[a].keepsSize, d ||= a !== i;
	}
	let f = EH(i[e[0]], s).start, p = OH(i[e[e.length - 1]], s);
	if (!u || !d || p - 1 > o || TH(e, i, s, f, p)) return c;
	let m = c ?? Array.from({ length: o }, (e, t) => t), h = f;
	return e.forEach((e, t) => {
		let { start: n, span: r } = EH(i[l[t]], s);
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
function TH(e, t, n, r, i) {
	return t.some((t, a) => {
		let o = EH(t, n).start, s = OH(t, n);
		return !e.includes(a) && o < i && s > r && (o > r || s < i);
	});
}
function EH(e, t) {
	return t ? {
		start: e.column,
		span: e.columnSpan
	} : {
		start: e.row,
		span: e.rowSpan
	};
}
function DH(e, t, n) {
	return n ? e.row === t.row && e.rowSpan === t.rowSpan : e.column === t.column && e.columnSpan === t.columnSpan;
}
function OH(e, t) {
	let { start: n, span: r } = EH(e, t);
	return n + r;
}
function kH(e) {
	let t = jH(e.getAttribute(tr)), n = jH(e.getAttribute(nr));
	if (t === null && n === null) return;
	let r = fH(e), i = new Set(r.flatMap((e) => {
		let t = e.querySelector(`:scope > .${KV}`);
		return t?.hasAttribute("data-ui-pane-keeps-size") === !0 ? [t.getAttribute("data-ui-pane") ?? ""] : [];
	})), a = r.map((e) => {
		let t = e.getAttribute("data-ui-pane-place") ?? "";
		return {
			name: t,
			cells: jH(e.getAttribute("data-ui-pane-cells"), MH) ?? [],
			keepsSize: i.has(t)
		};
	}), o = r.map((e) => e.querySelector(`:scope > .${KV}`)?.getAttribute("data-ui-pane") ?? ""), s = [], c = [];
	yh.forEach((e, i) => {
		let l = xH(a, o, i, t?.length ?? 0, n?.length ?? 0, t !== null, n !== null);
		r.forEach((t, n) => {
			let r = l.cells[n];
			t.style.setProperty(Dh("--ui-placement-column", e), String(r.column)), t.style.setProperty(Dh("--ui-placement-row", e), String(r.row)), t.style.setProperty(Dh("--ui-placement-column-span", e), String(r.columnSpan)), t.style.setProperty(Dh("--ui-placement-row-span", e), String(r.rowSpan));
		}), s.push(l.columnOrder), c.push(l.rowOrder);
	}), AH(e, "--ui-pane-columns", t, s), AH(e, "--ui-pane-rows", n, c);
}
function AH(e, t, n, r) {
	let i = n !== null && r.some((e) => e !== null);
	yh.forEach((a, o) => {
		i ? e.style.setProperty(Dh(t, a), (r[o] ?? n.map((e, t) => t)).map((e) => n[e]).join(" ")) : e.style.removeProperty(Dh(t, a));
	});
}
function jH(e, t = (e) => e) {
	if (e === null) return null;
	try {
		let n = JSON.parse(e);
		return Array.isArray(n) ? n.map(t) : null;
	} catch {
		return null;
	}
}
function MH(e) {
	return Array.isArray(e) && e.length === 4 ? {
		column: Number(e[0]),
		row: Number(e[1]),
		columnSpan: Number(e[2]),
		rowSpan: Number(e[3])
	} : null;
}
function NH(e, t, n) {
	for (let r of pH(e)) {
		if (r === t) continue;
		let e = r.getBoundingClientRect();
		if (n.x >= e.left && n.x <= e.right && n.y >= e.top && n.y <= e.bottom) return r;
	}
	return null;
}
function PH(e, t, n, r) {
	let i = pH(e).map((e) => ({
		place: e,
		box: e.getBoundingClientRect()
	})), a = i.find((e) => e.place === n)?.box;
	if (a === void 0) return null;
	let o = IH(FH(a), i.map((e) => e.place === t || e.place === n ? null : FH(e.box)), r);
	return o === null ? null : i[o].place;
}
function FH(e) {
	return {
		x: e.left + e.width / 2,
		y: e.top + e.height / 2
	};
}
function IH(e, t, n) {
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
var LH = "ui-split-button", RH = "ui-split-button__main", zH = "ui-split-button__toggle", BH = "ui-split-button__menu", VH = "ui-split-button--open", HH = class {
	root;
	menus = new _v({
		show: ({ owner: e }) => e.classList.add(VH),
		hide: ({ owner: e }) => e.classList.remove(VH),
		closesWhenReadOnly: !1,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), document.addEventListener("click", (e) => this.handleChoice(e), !1);
	}
	handleClick(e) {
		let t = UH(e.target);
		if (t !== null) {
			e.preventDefault(), this.menus.isOpen(t) ? this.menus.close(t) : this.openMenu(t);
			return;
		}
		let n = this.menus.current;
		n !== null && e.target instanceof Element && e.target.closest(`.${RH}`)?.closest(`.${LH}`) === n && this.menus.close(n);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "ArrowDown" && e.key !== "ArrowUp" || !N(e)) return;
		let t = UH(e.target);
		t === null || this.menus.isOpen(t) || (e.preventDefault(), this.openMenu(t, e.key === "ArrowUp"));
	}
	handleChoice(e) {
		let t = this.menus.current;
		if (t === null || !(e.target instanceof Element)) return;
		let n = WH(t), r = e.target.closest(`.${Rn}`);
		n !== null && r !== null && n.contains(r) && EI(r) && this.menus.close(t);
	}
	openMenu(e, t = !1) {
		let n = WH(e), r = n?.querySelector(".ui-menu") ?? null;
		if (n === null || r === null) return;
		let i = e.getAttribute("data-ui-split-placement") ?? "";
		this.menus.open({
			owner: e,
			popup: n,
			anchor: e,
			placement: { placement: Mh(i) ? i : "bottom-end" },
			openers: GH(e)
		}) && am(r, DI(r), t);
	}
};
function UH(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${zH}, .${RH}`), n = t?.closest(`.${LH}`) ?? null;
	return t === null || n === null || t.classList.contains(RH) && n.getAttribute("data-ui-split-mode") !== "menu" ? null : n;
}
function WH(e) {
	return e.querySelector(`:scope > .${BH}`);
}
function GH(e) {
	return [...e.querySelectorAll(":scope > [aria-haspopup]")];
}
//#endregion
//#region src/interactions/button-group-engine.ts
var KH = "ui-button-group", qH = "ui-button-group__item", JH = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${KH}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), V(this.root, `.${KH}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [di]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-selected-key") ?? "", n = [], r = null;
		for (let i of this.ownItems(e)) {
			let e = t.length > 0 && i.getAttribute("data-ui-key") === t, a = YH(i);
			i.toggleAttribute(ui, e), a !== null && (a.setAttribute("aria-pressed", e ? "true" : "false"), n.push(a), e && (r = a));
		}
		P(n, r ?? n.find(F) ?? null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${qH}`), n = t?.closest(`.${KH}`) ?? null;
		if (t === null || n === null || t.closest(`.${KH}`) !== n || k(n)) return;
		let r = YH(t);
		r !== null && k(r) || this.choose(n, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${qH} > .${Fi}`), n = t?.closest(`.${KH}`) ?? null;
		if (t === null || n === null || !N(e)) return;
		let r = this.ownItems(n).map(YH).filter((e) => e !== null), i = gd({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault(), i.focus({ preventScroll: !0 });
		let a = i.closest(`.${qH}`);
		a !== null && this.choose(n, a);
	}
	choose(e, t) {
		Bd(e, t.getAttribute("data-ui-key") ?? "", {
			attribute: di,
			bindingAttribute: pi,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return Rd(e, `.${qH}`, `.${KH}`);
	}
};
function YH(e) {
	return e.querySelector(`:scope > .${Fi}`);
}
//#endregion
//#region src/interactions/accordion-engine.ts
var XH = "ui-accordion", ZH = "details", QH = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleSummaryClick(e), !0), this.root.addEventListener("toggle", (e) => this.handleToggle(e), !0), this.normalizeAll(this.root.querySelectorAll(`.${XH}`)), V(this.root, `.${XH}`, {
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
		if (t !== null && t.classList.contains(XH)) for (let n of this.sectionsOf(t)) n !== e && n.open && (n.open = !1);
	}
	sectionsOf(e) {
		return [...e.querySelectorAll(`:scope > ${ZH}`)];
	}
}, $H = "ui-tab-overflow", eU = "ui-tab-overflow__menu", tU = "ui-tab-overflow__menu--open", nU = "ui-tab-overflow__entry", rU = "ui-tab-overflow__entry--current", iU = class {
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
		this.options = e, this.list = new cU(e.pick);
	}
	fit(e, t) {
		this.resizes?.observe(t.room), this.switches?.observe(e, { attributeFilter: ["class", "style"] });
		let n = this.options.wraps(e), r = t.captions[0]?.parentElement ?? null;
		if (this.wraps.set(e, n), this.spacings.set(e, {
			host: r,
			spacing: aU(r)
		}), n) {
			for (let e of t.captions) e.classList.remove(this.options.hiddenClass);
			e.classList.remove(this.options.overflowingClass), this.closeListOf(e);
			return;
		}
		e.classList.remove(this.options.overflowingClass);
		let i = () => e.classList.add(this.options.overflowingClass), a = this.options.trailing === !0 ? this.fitTrailing(t, i) : oU({
			...t,
			hiddenClass: this.options.hiddenClass,
			showButton: i
		});
		e.classList.toggle(this.options.overflowingClass, a), a || this.closeListOf(e);
	}
	spacingChanged(e) {
		let t = this.spacings.get(e);
		return t !== void 0 && aU(t.host) !== t.spacing;
	}
	fitTrailing(e, t) {
		for (let t of e.captions) this.resizes?.observe(t);
		return sU(e, this.options.hiddenClass, t);
	}
	closeListOf(e) {
		this.list.isOpenFor(e) && this.list.close();
	}
	toggleList(e, t, n) {
		this.list.isOpenFor(e) ? this.list.close() : this.list.open(t, e, n());
	}
};
function aU(e) {
	return e === null ? "" : getComputedStyle(e).columnGap ?? "";
}
function oU(e) {
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
function sU(e, t, n) {
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
var cU = class {
	menu;
	button = null;
	list = new _v({
		show: ({ popup: e }) => e.classList.add(tU),
		hide: ({ popup: e }) => {
			e.classList.remove(tU), this.button = null;
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e) || this.button !== null && t.includes(this.button),
		onWindowBlur: !0,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	pick;
	constructor(e) {
		this.pick = e, this.menu = document.createElement("div"), this.menu.className = eU, this.menu.setAttribute("role", "menu"), this.menu.addEventListener("click", (e) => this.handleClick(e)), this.menu.addEventListener("keydown", (e) => this.handleKeydown(e)), this.menu.addEventListener("pointermove", (e) => this.handlePointerMove(e));
	}
	isOpenFor(e) {
		return this.list.isOpen(e);
	}
	open(e, t, n) {
		this.close(), this.menu.replaceChildren(...n.map(lU)), this.menu.parentElement === null && document.body.appendChild(this.menu);
		let r = this.menu.querySelector(`.${rU}`);
		this.button = e, Hh(e, this.menu);
		let i = {
			owner: t,
			popup: this.menu,
			anchor: e,
			placement: { placement: "bottom-end" },
			openers: [e],
			returnFocus: () => e
		};
		VP(this.list, i, this.entries(), r) || (this.button = null);
	}
	close() {
		this.list.close();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${nU}`), n = t?.getAttribute("data-ui-key") ?? null, r = this.list.current;
		t === null || n === null || r === null || k(t) || (this.close(), this.pick(r, n));
	}
	handleKeydown(e) {
		e.defaultPrevented || HP(e, this.entries());
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${nU}`) : null;
		t !== null && GP(t, this.entries());
	}
	entries() {
		return Array.from(this.menu.querySelectorAll(`.${nU}`));
	}
};
function lU(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${nU} ${Ri}`, t.classList.toggle(rU, e.current), t.setAttribute("role", "menuitem"), t.setAttribute(b, e.key), t.textContent = e.title, e.current && t.setAttribute("aria-current", "true"), e.disabled && (t.classList.add(Ci), t.setAttribute("aria-disabled", "true")), t;
}
//#endregion
//#region src/interactions/tab-switch.ts
var uU = "data-ui-caption-text", dU = ".ui-text__title";
function fU(e) {
	for (let t of e.querySelectorAll(dU)) {
		let e = t.textContent ?? "";
		t.getAttribute(uU) !== e && t.setAttribute(uU, e);
	}
}
function pU(e, t) {
	if (e === null || t === null || e === t || typeof t.animate != "function" || gh()) return;
	let n = e.getBoundingClientRect(), r = t.getBoundingClientRect();
	n.width !== 0 && r.width !== 0 && t.animate([{ transform: `translateX(${n.left - r.left}px) scaleX(${n.width / r.width})` }, { transform: "none" }], {
		duration: B.normal,
		easing: B.ease,
		pseudoElement: "::after"
	});
}
function mU(e) {
	if (!(e === null || gh())) for (let t of e.children) typeof t.animate == "function" && t.animate([{ opacity: 0 }, { opacity: 1 }], {
		duration: B.fast,
		easing: B.enter
	});
}
//#endregion
//#region src/interactions/tabs-engine.ts
var hU = "ui-tabs", gU = "ui-tab-caption", _U = "ui-tab-caption--selected", vU = "ui-tab-caption--overflowed", yU = "ui-tabs--overflowing", bU = "ui-tabs--no-overflow", xU = "ui-tabs__strip", SU = "ui-tabs__band", CU = class {
	root;
	fitter;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new iU({
			rootClass: hU,
			overflowingClass: yU,
			wraps: (e) => e.classList.contains(bU),
			hiddenClass: vU,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${hU}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), V(this.root, `.${hU}`, {
			childList: !0,
			attributeFilter: [mi, ...bi],
			relevant: (e) => !Bg(e, `[${_i}]`, `.${hU}`)
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-tabs-selected") ?? "", n = this.ownHeaders(e), r = n.filter(wU), i = Vd(r, t, (e) => e.getAttribute("data-ui-tab-key") ?? "");
		if (i !== null && i !== t) {
			this.select(e, i);
			return;
		}
		let a = n.find((e) => e.classList.contains(_U)) ?? null, o = null;
		for (let n of Rd(e, `[${vi}]`, `.${hU}`)) n.hidden = (n.getAttribute("data-ui-tab-actions") ?? "") !== t;
		for (let e of n) {
			let n = (e.getAttribute("data-ui-tab-key") ?? "") === t;
			e.classList.toggle(_U, n), e.setAttribute("aria-selected", n ? "true" : "false"), fU(e), n && (o = e);
		}
		this.fitHeaders(e, r, o), pU(a, o), P(n.filter((e) => !e.classList.contains(vU)), o);
		for (let n of this.ownPages(e)) n.hidden = (n.getAttribute("data-ui-tab-page") ?? "") !== t, !n.hidden && a !== null && a !== o && mU(n);
	}
	fitHeaders(e, t, n) {
		let r = e.querySelector(`:scope > .${xU}, :scope > .${SU} > .${xU}`), i = r?.querySelector(":scope > .ui-tab-overflow") ?? null;
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
			return this.ownHeaders(e).filter(wU).map((e) => {
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
		let t = e.target.closest(`.${$H}`), n = t?.closest(`.${hU}`) ?? null;
		if (t !== null && n !== null && t.closest(`.${hU}`) === n) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = e.target.closest(`.${gU}`);
		if (r === null || k(r)) return;
		let i = r.closest(`.${hU}`), a = r.getAttribute(gi);
		i !== null && a !== null && r.closest(`.${hU}`) === i && (e.preventDefault(), this.select(i, a));
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || rd(e) || !N(e)) return;
		let t = e.target.closest(`.${gU}`), n = t?.closest(`.${hU}`) ?? null;
		if (t === null || n === null) return;
		let r = gd({
			key: e.key,
			items: this.ownHeaders(n),
			current: t,
			axis: "horizontal"
		});
		r !== null && (e.preventDefault(), this.select(n, r.getAttribute("data-ui-tab-key") ?? ""), r.focus());
	}
	select(e, t) {
		Bd(e, t, {
			attribute: mi,
			bindingAttribute: pi,
			apply: (e) => this.apply(e)
		});
	}
	ownHeaders(e) {
		return Rd(e, `.${gU}`, `.${hU}`);
	}
	ownPages(e) {
		return Rd(e, `[${_i}]`, `.${hU}`);
	}
};
function wU(e) {
	return e.classList.contains(vU) || Gg(e);
}
//#endregion
//#region src/interactions/tab-out.ts
function TU(e) {
	e.hasAttribute("data-ui-tab-out") || (e.setAttribute(Fe, e.getAttribute("tabindex") ?? ""), e.setAttribute("tabindex", "-1"));
}
function EU(e) {
	let t = e.getAttribute(Fe);
	t !== null && (e.removeAttribute(Fe), t.length === 0 ? e.removeAttribute("tabindex") : e.setAttribute("tabindex", t));
}
function DU(e) {
	return e.tabIndex >= 0 || e.hasAttribute("data-ui-tab-out");
}
//#endregion
//#region src/interactions/command-bar-engine.ts
var OU = "ui-command-bar", kU = "ui-command-bar__host", AU = "ui-command-bar__item", jU = "ui-command-bar__overflow", MU = "ui-command-bar--overflowing", NU = "ui-command-bar__overflowed", PU = "ui-orientation--vertical", FU = "ui-text__title", IU = `${yp}, [${Fe}]`, LU = class {
	root;
	fitter;
	listed = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new iU({
			rootClass: OU,
			overflowingClass: MU,
			wraps: (e) => !HU(e),
			hiddenClass: NU,
			trailing: !0,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pick(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${OU}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), V(this.root, `.${OU}`, {
			childList: !0,
			addedOnly: !0,
			relevant: RU
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = zU(e), n = e.querySelector(`:scope > .${jU}`);
		if (t === null || n === null) return;
		let r = UU(t);
		this.fitter.fit(e, {
			room: e,
			button: n,
			captions: r,
			selected: null
		}), e.classList.contains(MU) && WU(r);
		for (let e of r) Bh(e, e.classList.contains(NU) ? n : null);
		e.classList.contains(PU) ? e.setAttribute("aria-orientation", "vertical") : e.removeAttribute("aria-orientation"), BU(e, null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${jU}`), n = t?.parentElement ?? null;
		t !== null && n !== null && n.classList.contains(OU) && (e.preventDefault(), this.fitter.toggleList(n, t, () => this.entriesOf(n)));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof HTMLElement) || !N(e) || rd(e)) return;
		let t = e.target.closest(`.${OU}`), n = t === null ? [] : VU(t);
		if (t === null || !n.includes(e.target)) return;
		let r = gd({
			key: e.key,
			items: n,
			current: e.target,
			axis: t.classList.contains(PU) ? "vertical" : "horizontal"
		});
		r !== null && (e.preventDefault(), BU(t, r), r.focus());
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement ? e.target : null, n = t?.closest(`.${OU}`) ?? null;
		t !== null && n !== null && VU(n).includes(t) && BU(n, t);
	}
	entriesOf(e) {
		let t = zU(e), n = t === null ? [] : UU(t).filter((e) => e.classList.contains(AU) && e.classList.contains(NU)).map((e) => e.querySelector("[data-ui-id]") ?? e);
		return this.listed.set(e, n), n.map((e, t) => ({
			key: String(t),
			title: GU(e),
			current: !1,
			disabled: k(e)
		}));
	}
	pick(e, t) {
		let n = this.listed.get(e)?.[Number(t)];
		n?.isConnected === !0 && !k(n) && KU(n).click();
	}
};
function RU(e) {
	let t = e.target;
	if (t instanceof Element && (t.classList.contains(OU) || t.classList.contains(kU) || t.classList.contains(AU))) return !0;
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains(OU) || t.querySelector(`.${OU}`) !== null)) return !0;
	return !1;
}
function zU(e) {
	return e.querySelector(`:scope > .${kU}`);
}
function BU(e, t) {
	let n = VU(e), r = n.find((e) => e.tabIndex >= 0 && F(e)), i = t ?? n.find((e) => e === document.activeElement) ?? r ?? n.find(F) ?? null;
	for (let e of n) e === i ? EU(e) : TU(e);
}
function VU(e) {
	let t = zU(e), n = [];
	for (let e of t === null ? [] : UU(t)) if (e.classList.contains(AU) && !e.classList.contains(NU)) for (let t of e.querySelectorAll(IU)) DU(t) && md(e, t) && n.push(t);
	let r = e.querySelector(`:scope > .${jU}`);
	return r !== null && e.classList.contains(MU) && n.push(r), n;
}
function HU(e) {
	let t = zU(e);
	if (t === null) return !1;
	let n = getComputedStyle(t);
	return n.flexDirection.startsWith("row") && n.flexWrap === "nowrap";
}
function UU(e) {
	let t = [];
	for (let n of Array.from(e.children)) {
		if (n.classList.contains("ui-hidden")) continue;
		if (n.hasAttribute("data-ui-group-header")) {
			t.push(n);
			continue;
		}
		let e = n.classList.contains(AU) ? n.querySelector(S) : null;
		e !== null && Gg(e) && t.push(n);
	}
	return t;
}
function WU(e) {
	let t = !1;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.classList.contains(AU) ? t ||= !r.classList.contains(NU) : t || r.classList.add(NU);
	}
}
function GU(e) {
	let t = KU(e), n = t.querySelector(`.${FU}`)?.textContent?.trim() ?? "";
	return n.length > 0 ? n : e.getAttribute("aria-label")?.trim() || t.getAttribute("aria-label")?.trim() || t.textContent?.trim() || "";
}
function KU(e) {
	return e.matches(yp) ? e : e.querySelector(yp) ?? e;
}
//#endregion
//#region src/interactions/breadcrumbs-engine.ts
var qU = "ui-breadcrumbs", JU = "ui-breadcrumbs__item", YU = "ui-breadcrumb", XU = "ui-breadcrumb--current", ZU = "ui-hidden", QU = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), V(this.root, `.${qU}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: ["class", ...bi]
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${qU}`)) this.apply(e);
	}
	apply(e) {
		let t = Rd(e, `.${JU}`, `.${qU}`);
		$U(t);
		let n = t.filter((e) => !e.classList.contains(ZU)).map((e) => e.querySelector(`.${YU}`)).filter((e) => e !== null && !e.classList.contains(ZU)), r = n.length === 0 ? null : n[n.length - 1];
		for (let e of n) {
			let t = e === r;
			e.classList.toggle(XU, t), t ? (e.setAttribute("aria-current", "page"), e.setAttribute("tabindex", "-1")) : (e.removeAttribute("aria-current"), e.removeAttribute("tabindex"));
		}
	}
};
function $U(e) {
	let t = yh.map(() => !1);
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n], i = yh.map((e, t) => eW(r, t));
		if (tW(r, Fr, yh.filter((e, t) => i[t])), tW(r, Ir, yh.filter((e, n) => !t[n])), !r.classList.contains(ZU)) for (let e = 0; e < yh.length; e++) t[e] ||= !i[e];
	}
}
function eW(e, t) {
	for (let n of e.children) if (n.getAttribute(bi[t]) === "collapsed") return !0;
	return !1;
}
function tW(e, t, n) {
	let r = n.join(" ");
	w(e, t, r.length === 0 ? null : r);
}
//#endregion
//#region src/interactions/color-input-engine.ts
var nW = "ui-color-input", rW = "ui-color-input--open", iW = "ui-color-input__popup", aW = "ui-color-input__text", oW = "ui-color-input__row", sW = "ui-color-input__swatch--button", cW = "ui-color-input__value-input", lW = "ui-color-input__square-thumb", uW = "ui-color-input__hue-thumb", dW = "data-ui-color-toggle", fW = "data-ui-color-tab", pW = "data-ui-color-tab-selected", mW = "data-ui-color-pane", hW = "data-ui-color-pane-selected", gW = "data-ui-color-square", _W = "data-ui-color-hue", vW = "data-ui-color-hex", yW = "data-ui-color-channel", bW = "data-ui-color-factor", xW = "data-ui-color-opacity", SW = "data-ui-color-name", CW = "data-ui-color-name-selected", wW = "data-ui-color-format", TW = "data-ui-color-variant", EW = "data-ui-color-no-picker", DW = "data-ui-color-no-palette", OW = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	popups = new _v({
		show: ({ owner: e }) => e.classList.add(rW),
		hide: ({ owner: e }) => e.classList.remove(rW)
	});
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${nW}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(Ga(e.components, `.${nW}`));
		}), V(this.root, `.${nW}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [
				wW,
				TW,
				EW,
				DW
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), new j_({
			root: this.root,
			resolveHandle: (e) => e.closest(`[${gW}], [${_W}]`),
			begin: (e, t) => {
				let n = e.closest(`.${nW}`);
				if (n === null) return null;
				let r = {
					input: n,
					element: e,
					surface: e.hasAttribute(gW) ? "square" : "hue",
					stateBefore: this.states.get(n),
					valueBefore: n.querySelector(`.${cW}`)?.value ?? null
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
		let t = NW(e), n = this.states.get(e), r = n?.paneChosen === !0 ? kW(e, n.pane) : AW(e);
		if (t.length === 0 || t.startsWith("@")) return {
			...n ?? jW(r),
			pane: r,
			held: !1
		};
		if (t.startsWith("#")) {
			let i = VW(t);
			if (i === null) return n ?? jW(r);
			let [a, o, s, c] = i;
			if (n !== void 0 && n.name === null && MW(this.resolveRgb(e, n), [
				a,
				o,
				s
			])) return {
				...n,
				pane: r,
				opacity: c,
				held: !0
			};
			let [l, u, d] = WW(a, o, s);
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
			...n ?? jW(r),
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
			let [e, a, o] = WW(n, r, i);
			t = {
				...t,
				hue: e,
				saturation: a,
				value: o
			};
		}
		let a = this.states.get(e);
		this.states.set(e, t), LW(e, "--ui-color-input-color", t.held ? UW(n, r, i, t.opacity) : "transparent"), LW(e, "--ui-color-input-solid", UW(n, r, i, 255)), LW(e, "--ui-color-input-on-color", t.held ? YC(n, r, i, t.opacity) : "inherit"), IW(e, t.held ? FW(e, n, r, i, t.opacity) : ""), this.applyPicker(e, t, n, r, i), (a === void 0 || a.name !== t.name || a.pane !== t.pane || a.held !== t.held) && (this.applyPalette(e, t), this.applyPanes(e, t));
	}
	applyPicker(e, t, n, r, i) {
		let a = e.querySelector(`[${gW}]`), o = e.querySelector(`[${_W}]`), [s, c, l] = GW(t.hue, 1, 1);
		if (LW(e, "--ui-color-input-hue", UW(s, c, l, 255)), a !== null) {
			let e = a.querySelector(`.${lW}`);
			e !== null && (LW(e, "left", `${t.saturation * 100}%`), LW(e, "top", `${(1 - t.value) * 100}%`));
		}
		if (o !== null) {
			let e = o.querySelector(`.${uW}`);
			e !== null && LW(e, "top", `${t.hue / 360 * 100}%`);
		}
		RW(e, `[${vW}]`, HW(n, r, i)), RW(e, `[${yW}="r"]`, String(n)), RW(e, `[${yW}="g"]`, String(r)), RW(e, `[${yW}="b"]`, String(i)), LW(e, "--ui-color-input-opacity-fill", `${t.opacity / 255 * 100}%`), zW(e, `[${xW}]`, t.opacity);
	}
	applyPalette(e, t) {
		for (let n of e.querySelectorAll(`[${SW}]`)) n.getAttribute(SW) === t.name ? n.setAttribute(CW, "") : n.removeAttribute(CW);
		let n = t.name === null ? null : e.querySelector(`[${SW}="${C(t.name)}"]`), r = n === null ? null : VW(n.style.getPropertyValue("--ui-color-input-chip").trim());
		LW(e, "--ui-color-input-base", r === null ? "transparent" : UW(r[0], r[1], r[2], 255)), zW(e, `[${bW}]`, t.factor);
	}
	applyPanes(e, t) {
		for (let n of e.querySelectorAll(`[${mW}]`)) n.getAttribute(mW) === t.pane ? n.setAttribute(hW, "") : n.removeAttribute(hW);
		for (let n of e.querySelectorAll(`[${fW}]`)) n.getAttribute(fW) === t.pane ? n.setAttribute(pW, "") : n.removeAttribute(pW);
	}
	resolveRgb(e, t) {
		if (t.name === null) return GW(t.hue, t.saturation, t.value);
		let n = e.querySelector(`[${SW}="${C(t.name)}"]`), r = n === null ? null : VW(n.style.getPropertyValue("--ui-color-input-chip").trim());
		return r === null ? GW(t.hue, t.saturation, t.value) : BW([
			r[0],
			r[1],
			r[2]
		], t.factor);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${dW}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${nW}`));
			return;
		}
		let n = e.target.closest(`[${fW}]`), r = e.target.closest(`.${nW}`);
		if (r === null) return;
		if (n !== null) {
			e.preventDefault();
			let t = n.getAttribute(fW), i = this.states.get(r);
			i !== void 0 && (t === "picker" || t === "palette") && this.applyState(r, {
				...i,
				pane: t,
				paneChosen: !0
			});
			return;
		}
		let i = e.target.closest(`[${SW}]`);
		if (i !== null) {
			e.preventDefault(), this.commit(r, (e) => ({
				...e,
				name: i.getAttribute(SW)
			}));
			return;
		}
		let a = r.querySelector(`.${iW}`);
		(a === null || !e.composedPath().includes(a)) && (e.preventDefault(), this.toggle(r));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target.closest(`.${nW}`);
		t !== null && (e.target.hasAttribute(bW) ? this.commit(t, (t) => ({
			...t,
			factor: Number(e.target instanceof HTMLInputElement ? e.target.value : 0)
		}), !1) : e.target.hasAttribute(xW) && this.commit(t, (t) => ({
			...t,
			opacity: qC(Number(e.target instanceof HTMLInputElement ? e.target.value : 255))
		}), !1));
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target, n = t.closest(`.${nW}`);
		if (n === null) return;
		if (t.hasAttribute(bW) || t.hasAttribute(xW)) {
			this.send(n);
			return;
		}
		if (t.hasAttribute(vW)) {
			let e = VW(t.value);
			if (e === null) {
				this.applyAll([n]);
				return;
			}
			let [r, i, a] = WW(e[0], e[1], e[2]);
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
		let r = t.getAttribute(yW);
		if (r === null) return;
		let i = this.states.get(n);
		if (i === void 0) return;
		let [a, o, s] = this.resolveRgb(n, i), c = {
			r: a,
			g: o,
			b: s
		};
		c[r] = qC(Number(t.value));
		let [l, u, d] = WW(c.r, c.g, c.b);
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
		let t = e.input.querySelector(`.${cW}`);
		t !== null && e.valueBefore !== null && (t.value = e.valueBefore);
	}
	applyPoint(e, t) {
		let { input: n, element: r, surface: i } = e, a = r.getBoundingClientRect();
		if (i === "hue") {
			let e = KW((t.y - a.top) / a.height);
			this.commit(n, (t) => ({
				...t,
				hue: e * 360,
				name: null
			}), !1);
			return;
		}
		let o = KW((t.x - a.left) / a.width), s = 1 - KW((t.y - a.top) / a.height);
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
		let a = e.querySelector(`.${cW}`);
		a !== null && (a.value = PW(i, this.resolveRgb(e, i)), n && this.send(e));
	}
	send(e) {
		j(e) || e.querySelector(`.${cW}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	toggle(e) {
		if (e === null || e.hasAttribute(EW) && e.hasAttribute(DW)) return;
		if (this.popups.isOpen(e)) {
			this.popups.close(e);
			return;
		}
		let t = e.querySelector(`.${iW}`);
		if (t === null) return;
		let n = e.getAttribute(TW) === "swatch", r = n ? e.querySelector(`.${sW}`) : e.querySelector(`.${oW}`), i = n ? r : r?.querySelector(`[${dW}]`) ?? null;
		this.popups.open({
			owner: e,
			popup: t,
			anchor: r ?? e,
			placement: { placement: "bottom-end" },
			openers: i === null ? [] : [i],
			focus: t.querySelector(`[${pW}]`) ?? !0
		});
	}
};
function kW(e, t) {
	return ((t) => !e.hasAttribute(t === "picker" ? EW : DW))(t) ? t : t === "picker" ? "palette" : "picker";
}
function AW(e) {
	return kW(e, "picker");
}
function jW(e) {
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
function MW(e, t) {
	return e[0] === t[0] && e[1] === t[1] && e[2] === t[2];
}
function NW(e) {
	return e.querySelector(`.${cW}`)?.value.trim() ?? "";
}
function PW(e, t) {
	if (e.name !== null) {
		let t = e.factor === 0 ? "None" : e.factor < 0 ? "Shade" : "Tint";
		return `${e.name}/${t}/${Math.abs(e.factor)}/${e.opacity}`;
	}
	let n = HW(t[0], t[1], t[2]);
	return e.opacity === 255 ? n : `${n}${JC(e.opacity)}`;
}
function FW(e, t, n, r, i) {
	if (e.getAttribute(wW) === "rgb") return i === 255 ? `rgb(${t}, ${n}, ${r})` : `rgba(${t}, ${n}, ${r}, ${(i / 255).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")})`;
	let a = HW(t, n, r);
	return i === 255 ? a : `${a}${JC(i)}`;
}
function IW(e, t) {
	for (let n of e.querySelectorAll(`.${aW}`)) n.textContent !== t && (n.textContent = t);
}
function LW(e, t, n) {
	e !== null && e.style.getPropertyValue(t) !== n && e.style.setProperty(t, n);
}
function RW(e, t, n) {
	let r = e.querySelector(t);
	r !== null && r !== document.activeElement && r.value !== n && (r.value = n);
}
function zW(e, t, n) {
	for (let r of e.querySelectorAll(t)) r !== document.activeElement && r.value !== String(n) && (r.value = String(n));
}
function BW(e, t) {
	if (t === 0) return e;
	let n = Math.abs(t) / 10;
	return t < 0 ? [
		qC(e[0] * (1 - n)),
		qC(e[1] * (1 - n)),
		qC(e[2] * (1 - n))
	] : [
		qC(e[0] + (255 - e[0]) * n),
		qC(e[1] + (255 - e[1]) * n),
		qC(e[2] + (255 - e[2]) * n)
	];
}
function VW(e) {
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
function HW(e, t, n) {
	return `#${JC(e)}${JC(t)}${JC(n)}`;
}
function UW(e, t, n, r) {
	return `rgba(${e}, ${t}, ${n}, ${(r / 255).toFixed(3)})`;
}
function WW(e, t, n) {
	let r = e / 255, i = t / 255, a = n / 255, o = Math.max(r, i, a), s = o - Math.min(r, i, a), c = 0;
	return s !== 0 && (c = o === r ? (i - a) / s % 6 : o === i ? (a - r) / s + 2 : (r - i) / s + 4, c *= 60, c < 0 && (c += 360)), [
		c,
		o === 0 ? 0 : s / o,
		o
	];
}
function GW(e, t, n) {
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
		qC((o + a) * 255),
		qC((s + a) * 255),
		qC((c + a) * 255)
	];
}
function KW(e) {
	return Math.min(1, Math.max(0, e));
}
//#endregion
//#region src/interactions/surface-press-engine.ts
var qW = `:is(.ui-surface, .ui-card, .${Et})[${y}]`, JW = "ui-surface--clickable", YW = class {
	pressable = /* @__PURE__ */ new WeakSet();
	space = new Au();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("keydown", (e) => this.handleKeyDown(e)), t.addEventListener("keyup", (e) => this.space.release(e)), tG(t, ["hover", "press"], (e) => eG(e.closest(ld))), V(t, qW, {
			childList: !0,
			attributeFilter: ["class"]
		}, (e) => this.syncEach(e)), this.syncEach(t.querySelectorAll(qW));
	}
	syncEach(e) {
		for (let t of e) {
			this.sync(t);
			let e = t.parentElement?.closest(qW) ?? null;
			e !== null && this.sync(e);
		}
	}
	sync(e) {
		!e.classList.contains(JW) || ZW(e) ? this.pressable.delete(e) && (e.removeAttribute("tabindex"), e.removeAttribute("role")) : (this.pressable.add(e), w(e, "role", $W(e) ? "group" : "button"), w(e, "tabindex", e.matches(".ui-disabled, .ui-loading") ? null : QW(e) ? "-1" : "0"));
	}
	handleKeyDown(e) {
		let t = XW(e);
		if (t === null) return;
		let n = e.key;
		n === "Enter" ? (e.preventDefault(), e.repeat || t.click()) : n === " " && (e.preventDefault(), this.space.hold(t));
	}
};
function XW(e) {
	if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !N(e, { shift: !0 })) return null;
	let t = e.target;
	return t instanceof HTMLElement && t.classList.contains(JW) && t.hasAttribute("tabindex") && !ZW(t) ? t : null;
}
function ZW(e) {
	return e.matches("a");
}
function QW(e) {
	let t = e.closest(Ud);
	return t !== null && t.closest(I)?.matches(".ui-items-view, .ui-table") === !0 && dd(t) === e;
}
function $W(e) {
	for (let t of e.querySelectorAll(ld)) if (md(e, t)) return !0;
	return !1;
}
function eG(e) {
	let t = [];
	for (let n = e?.parentElement?.closest(`.${JW}`) ?? null; n !== null; n = n.parentElement?.closest(`.${JW}`) ?? null) t.push(n);
	return t;
}
function tG(e, t, n) {
	let r = {
		hover: [],
		press: []
	}, i = !1, a = (e, t) => {
		let a = t instanceof Element ? n(t) : [];
		e === "press" && (i = !1);
		for (let t of r[e]) a.includes(t) || nG(t, e, !1);
		for (let t of a) nG(t, e, !0);
		r[e] = a;
	};
	t.includes("hover") && (e.addEventListener("pointerover", (e) => a("hover", e.target)), e.addEventListener("pointerout", (e) => a("hover", e.relatedTarget))), t.includes("press") && (e.addEventListener("pointerdown", (e) => a("press", e.button === 0 ? e.target : null), !0), e.addEventListener("pointerup", () => a("press", null), !0), e.addEventListener("dragend", () => a("press", null), !0), e.addEventListener("dragstart", () => {
		i = r.press.length > 0;
	}, !0), e.addEventListener("pointercancel", () => {
		i || a("press", null);
	}, !0));
}
function nG(e, t, n) {
	let r = (e.getAttribute("data-ui-inner-pointer") ?? "").split(" ").filter((e) => e !== "" && e !== t);
	n && r.push(t), w(e, ci, r.length === 0 ? null : r.sort().join(" "));
}
//#endregion
//#region src/interactions/table-columns-engine.ts
var rG = "ui-table", iG = "ui-table--reorderable", aG = "ui-scroll-x--auto", oG = "ui-scroll-x--always", sG = `:scope > .${cr}`, cG = `.${ur}`, lG = "ui-table__header-cell", uG = `${lG}--pinned`, dG = `${sG} > .${lr} > .${lG}`, fG = `${dG}--pinned`, pG = "ui-table__host", mG = `${sG} > .${pG}`, hG = `.${rG}, .${sr}, [${rr}]`, gG = "--ui-table-columns", _G = "--ui-table-sticky-top", vG = "--ui-table-sticky-bottom", yG = "--ui-table-sized-columns", bG = "--ui-table-pin-", xG = 64, SG = "data-ui-table-cell-hidden", CG = "data-ui-table-cell-last", wG = "columns", TG = "hidden", EG = "order", DG = "layout", OG = 32, kG = 16, AG = class {
	root;
	store = new qF();
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
		this.root = e.root ?? document, this.drag = new j_({
			root: this.root,
			resolveHandle: (e) => e.closest(cG),
			begin: (e) => this.resolveContext(e),
			coordinate: () => "clientX",
			move: (e, t) => this.apply(e, t),
			end: (e, t) => this.remember(t.table),
			cancel: (e, t) => this.putBack(t)
		}), this.reorder = new j_({
			root: this.root,
			resolveHandle: (e) => this.resolveCaption(e),
			begin: (e, t) => this.beginReorder(e, t.x),
			coordinate: () => "clientX",
			move: (e, t) => this.aimDrop(e, t),
			end: (e, t) => this.endReorder(e, t)
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), tG(this.root, ["hover", "press"], (e) => {
			let t = e.closest(cG)?.parentElement ?? null;
			return t === null ? [] : [t];
		}), Th(() => this.layoutAll()), this.restoreEach(this.root.querySelectorAll(`.${rG}`)), V(this.root, `.${rG}`, {
			childList: !0,
			relevant: FG
		}, (e) => {
			for (let t of e) this.restored.has(t) && (this.stampUnstyledColumns(t, !0), this.indexColumns(t, !0));
			this.restoreEach(e);
		}), V(this.root, `.${rG}`, {
			attributeFilter: ["class"],
			relevant: (e) => e.target instanceof Element && e.target.classList.contains(rG)
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.layout(t);
		}), V(this.root, `.${rG}`, {
			childList: !0,
			attributeFilter: ["class", "hidden"],
			relevant: IG
		}, (e) => {
			for (let t of e) {
				let e = t.querySelector(mG);
				e !== null && t.hasAttribute("data-ui-table-scrollbar") && this.markScrollbar(t, e);
			}
		});
	}
	restoreEach(e) {
		for (let t of e) {
			if (this.restored.has(t)) continue;
			this.restored.add(t), this.restore(t), this.layout(t), xV(t, () => this.pin(t));
			let e = t.querySelector(sG);
			e !== null && xV(e, () => jG(t, e));
			let n = t.querySelector(mG);
			n !== null && (this.markScrollbar(t, n), xV(n, () => this.markScrollbar(t, n)));
		}
	}
	restore(e) {
		let t = this.columnsOf(e), n = this.store.read(e, wG), r = n === null ? null : kl(n);
		r !== null && r.length !== t.length ? (this.store.write(e, wG, null), this.store.writeBoot(e, DG, null), this.widths.set(e, null)) : this.widths.set(e, r);
		let i = this.store.readJson(e, EG);
		i !== null && !RG(i, t) ? (this.store.write(e, EG, null), this.orders.set(e, null)) : this.orders.set(e, i);
	}
	markScrollbar(e, t) {
		let n = getComputedStyle(t).overflowY;
		e.toggleAttribute(xr, n === "scroll" || n === "auto" && t.scrollHeight > t.clientHeight);
	}
	layoutAll() {
		for (let e of this.root.querySelectorAll(`.${rG}`)) this.layout(e);
	}
	layout(e) {
		let t = this.columnsOf(e), n = this.hiddenOf(e, t), r = this.placesOf(e, t), i = LG(r), a = this.widths.get(e) ?? null, o = r.some((e, t) => e !== t), s = e.classList.contains(aG) || e.classList.contains(oG);
		if (a === null && n.size === 0 && !o && !s) e.style.removeProperty(yG);
		else {
			let t = a ?? this.authoredTracks(e);
			if (t !== null) {
				let r = iu(t, n);
				e.style.setProperty(yG, Nl(i.map((e) => r[e]), s ? "max-content" : "auto"));
			}
		}
		for (let t = 0; t < r.length; t++) o ? e.style.setProperty(`${hf}${t}`, String(r[t])) : e.style.removeProperty(`${hf}${t}`);
		let c = [...n].sort((e, t) => e - t).join(" ");
		w(e, or, c.length === 0 ? null : c);
		let l = [...i].reverse().find((e) => !n.has(e));
		if (l === void 0 ? e.removeAttribute(gr) : e.getAttribute("data-ui-table-last") !== String(l) && e.setAttribute(gr, String(l)), this.columnStates.set(e, {
			places: r,
			hidden: n,
			last: l ?? -1
		}), this.stampUnstyledColumns(e, !1), this.indexColumns(e, !1), e.classList.contains(iG)) for (let e of t) !e.anchored && !e.cell.hasAttribute("tabindex") && e.cell.setAttribute("tabindex", "-1");
		this.pin(e);
	}
	stampUnstyledColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0 || n.places.length <= xG) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}|${n.last}`;
		if (t || this.stampedStates.get(e) !== r) {
			this.stampedStates.set(e, r);
			for (let t of e.querySelectorAll(`[${rr}]`)) {
				let r = Number(t.getAttribute(rr));
				r >= xG && t.closest(`.${rG}`) === e && (t.style.order = String(n.places[r] ?? r), t.toggleAttribute(SG, n.hidden.has(r)), t.toggleAttribute(CG, r === n.last));
			}
		}
	}
	indexColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}`, i = this.indexedStates.get(e) === r;
		(!i || t) && (this.indexedStates.set(e, r), bf(e, LG(n.places), n.hidden, i));
	}
	columnsOf(e) {
		let t = [];
		for (let n of e.querySelectorAll(dG)) {
			let e = Number(n.getAttribute(rr)), r = n.getAttribute(ir), i = n.classList.contains(uG) || n.hasAttribute("data-ui-table-fixed");
			Number.isInteger(e) && t.push({
				index: e,
				key: n.getAttribute("data-ui-table-column-key") ?? String(e),
				hideBelow: HG(r) ? r : null,
				startsHidden: n.hasAttribute(ar),
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
		for (let e of t) (n[e.key] ?? VG(e)) && r.add(e.index);
		return r;
	}
	choicesOf(e) {
		let t = this.hiddenChoices.get(e);
		return t === void 0 && (t = this.store.readJson(e, TG) ?? {}, this.hiddenChoices.set(e, t)), t;
	}
	authoredTracks(e) {
		let t = e.style.getPropertyValue(gG).trim(), n = t.length === 0 ? null : kl(t);
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
		n === null || i !== void 0 && n === VG(i) ? delete r[t] : r[t] = n, this.hiddenChoices.set(e, r), this.store.writeJson(e, TG, Object.keys(r).length === 0 ? null : r), this.layout(e), this.rememberBoot(e);
	}
	columnOrder(e) {
		if (!(e instanceof HTMLElement)) return [];
		let t = this.columnsOf(e), n = new Map(t.map((e) => [e.index, e]));
		return LG(this.placesOf(e, t)).map((e) => n.get(e)?.key ?? "").filter((e) => e.length > 0);
	}
	pin(e) {
		let t = e.querySelectorAll(fG).length;
		if (t < 2) return;
		let n = eu(this.trackSizes(e), t);
		for (let t = 1; t < n.length; t++) e.style.setProperty(`${bG}${t}`, `${n[t]}px`);
	}
	handleScroll(e) {
		let t = e.target;
		t instanceof HTMLElement && t.classList.contains("ui-table__scroll") && t.closest(`.${rG}`)?.toggleAttribute(br, t.scrollLeft > 0);
	}
	trackSizes(e) {
		let t = e.querySelector(sG), n = t === null ? [] : getComputedStyle(t).gridTemplateColumns.split(" ").map(parseFloat);
		return NG(e) ? n.slice(1) : n;
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
		let t = e.target.closest(cG), n = t ?? (e.shiftKey ? MG(e.target) : null);
		if (n === null || this.drag.active || !N(e, { shift: t === null })) return;
		if (t !== null && e.key === "Enter" || t === null && e.key === "Backspace") {
			e.preventDefault(), this.reset(n);
			return;
		}
		let r = e.key === "PageUp" || e.key === "PageDown";
		if (!r && e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
		let i = this.resolveContext(n);
		if (i === null) return;
		let a = r ? Ol(kG, i.sizes.reduce((e, t) => e + t, 0)) : kG;
		e.preventDefault(), this.apply(i, e.key === "ArrowRight" || e.key === "PageUp" ? a : -a) && this.remember(i.table);
	}
	stepColumn(e, t) {
		let n = e.target instanceof Element ? this.resolveCaption(e.target) : null, r = n?.closest(`.${rG}`) ?? null;
		if (n === null || r === null || this.reorder.active) return;
		let i = this.movableColumns(r), a = Number(n.getAttribute(rr)), o = i.findIndex((e) => e.index === a), s = o + t;
		if (o < 0 || (e.preventDefault(), s < 0 || s >= i.length)) return;
		this.moveColumn(r, a, t < 0 ? i[s].index : i[s + 1]?.index ?? null), n.focus({ preventScroll: !0 });
		let c = this.columnStates.get(r);
		if (c !== void 0) {
			let e = LG(c.places).filter((e) => !c.hidden.has(e));
			JA(e.indexOf(a) + 1, e.length);
		}
	}
	handleDoubleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(cG) : null;
		t !== null && this.reset(t);
	}
	reset(e) {
		let t = e.closest(`.${rG}`);
		t !== null && (this.widths.set(t, null), this.layout(t), this.remember(t));
	}
	apply(e, t) {
		let n = Vl(e.tracks.map((t, n) => n === e.index || n === e.after ? {
			...t,
			min: Math.max(OG, e.floors.get(n) ?? 0)
		} : t), e.sizes, {
			before: [e.index],
			after: [e.after]
		}, t);
		return n !== null && (this.widths.set(e.table, PG(e.tracks, n, [e.index, e.after])), this.layout(e.table), !0);
	}
	putBack(e) {
		this.widths.set(e.table, e.before), this.layout(e.table);
	}
	remember(e) {
		let t = this.widths.get(e) ?? null;
		this.store.write(e, wG, t === null ? null : Nl(t), null), this.rememberBoot(e);
	}
	rememberBoot(e) {
		let t = e.style.getPropertyValue(yG).trim(), n = e.getAttribute(or), r = {};
		t.length > 0 && (r[yG] = t);
		for (let t of e.style) t.startsWith("--ui-table-order-") && (r[t] = e.style.getPropertyValue(t));
		Object.keys(r).length === 0 && n === null ? this.store.writeBoot(e, DG, null) : this.store.writeBoot(e, DG, {
			styles: r,
			attributes: {
				[or]: n,
				[gr]: e.getAttribute(gr)
			}
		});
	}
	resolveContext(e) {
		let t = e.closest(`.${rG}`);
		if (t === null) return null;
		let n = this.widths.get(t) ?? null, r = n ?? this.authoredTracks(t);
		if (r === null) return null;
		let i = Il(t.getAttribute(Yn)), a = Ll(r, i), o = /* @__PURE__ */ new Map(), s = this.columnsOf(t), c = this.placesOf(t, s), l = this.columnSizes(t, c).filter((e) => Number.isFinite(e));
		for (let e of i) e.min !== void 0 && o.set(e.index, e.min);
		let u = Number(e.getAttribute(rr)), d = this.hiddenOf(t, s), f = LG(c), p = (c[u] ?? -1) + 1;
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
		let t = e.closest(`.${lG}`), n = t?.closest(`.${rG}`) ?? null;
		return t === null || n === null || !n.classList.contains(iG) || e.closest(cG) !== null || t.classList.contains(uG) || t.hasAttribute("data-ui-table-fixed") ? null : t;
	}
	beginReorder(e, t) {
		let n = e.closest(`.${rG}`), r = Number(e.getAttribute(rr));
		if (n === null || !Number.isInteger(r)) return null;
		let i = this.movableColumns(n), a = i.findIndex((e) => e.index === r);
		if (a < 0 || i.length < 2) return null;
		let o = i.map(zG), s = n.querySelector(sG), c = getComputedStyle(n).direction === "rtl";
		return n.setAttribute(_r, ""), e.setAttribute(vr, ""), {
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
		for (let a of LG(this.placesOf(e, t))) {
			let e = r.get(a);
			e !== void 0 && !e.anchored && !n.has(a) && i.push(e);
		}
		return i;
	}
	aimDrop(e, t) {
		let n = e.origin + t + ((e.scroll?.scrollLeft ?? 0) - e.scrolledAt), r = 0;
		for (; r < e.middles.length && (e.rightToLeft ? n < e.middles[r] : n > e.middles[r]);) r++;
		let i = Math.min(Math.max(r > e.from ? r - 1 : r, 0), e.places.length - 1);
		if (i === e.target || (e.target = i, BG(e.table), i === e.from)) return;
		let a = e.places.filter((t, n) => n !== e.from), o = a[e.target];
		o === void 0 ? a[a.length - 1].cell.setAttribute(yr, "after") : o.cell.setAttribute(yr, "before");
	}
	endReorder(e, t) {
		if (e.removeAttribute(vr), t.table.removeAttribute(_r), BG(t.table), t.target === t.from) return;
		let n = t.places.filter((e, n) => n !== t.from);
		N_(), this.moveColumn(t.table, t.index, n[t.target]?.index ?? null);
	}
	moveColumn(e, t, n) {
		let r = this.columnsOf(e), i = new Map(r.map((e) => [e.index, e])), a = LG(this.placesOf(e, r)).filter((e) => i.get(e)?.anchored === !1), o = a.indexOf(t);
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
		this.orders.set(e, u ? null : c), this.store.write(e, EG, u ? null : JSON.stringify(c)), this.layout(e), this.rememberBoot(e);
	}
};
function jG(e, t) {
	let n = 0, r = 0, i = !1;
	for (let e of t.children) if (e.matches(`.${pG}`)) i = !0;
	else if (!(e instanceof HTMLElement) || e.getAttribute("role") !== "row") continue;
	else i ? r += e.offsetHeight : n += e.offsetHeight;
	e.style.setProperty(_G, `${n}px`), e.style.setProperty(vG, `${r}px`);
}
function MG(e) {
	let t = e.matches(`.${lG}`) ? e.querySelector(`:scope > ${cG}`) : null;
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function NG(e) {
	return e.hasAttribute("data-ui-rows-draggable") && e.hasAttribute("data-ui-rows-drag-handle") && e.classList.contains("ui-drag-handle--start");
}
function PG(e, t, n) {
	for (let r of n) e[r].kind === "star" && e[r].min === e[r].value && t[r].kind === "star" && (t[r] = {
		...t[r],
		min: t[r].value
	});
	return t;
}
function FG(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(hG) || t.querySelector(hG) !== null)) return !0;
	return !1;
}
function IG(e) {
	let t = e.type === "childList" ? e.target : e.target.parentElement;
	return t instanceof Element && t.classList.contains(pG);
}
function LG(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) t[e[n]] = n;
	return t;
}
function RG(e, t) {
	if (e.length !== t.length) return !1;
	let n = new Set(t.map((e) => e.key));
	return e.every((e) => n.delete(e)) && n.size === 0;
}
function zG(e) {
	let t = e.cell.getBoundingClientRect();
	return t.left + t.width / 2;
}
function BG(e) {
	for (let t of e.querySelectorAll(`[${yr}]`)) t.removeAttribute(yr);
}
function VG(e) {
	return e.startsHidden || e.hideBelow !== null && yh.indexOf(Eh()) < yh.indexOf(e.hideBelow);
}
function HG(e) {
	return e !== null && yh.includes(e);
}
//#endregion
//#region src/items/items-group-runs.ts
var UG = /* @__PURE__ */ new WeakMap();
function WG(e, t) {
	let n = /* @__PURE__ */ new Set(), r = e.getAttribute(on);
	for (let i of G(e)) {
		let a = i.getAttribute("data-ui-group") ?? "";
		if (a !== "" && a !== r) {
			let r = GG(i, a) ?? KG(e, i, a, t);
			r !== null && n.add(r);
		}
		r = a;
	}
	for (let t of e.querySelectorAll(`:scope > [${Lt}]`)) n.has(t) || t.remove();
}
function GG(e, t) {
	let n = e.previousElementSibling, r = n === null ? void 0 : UG.get(n);
	return r !== void 0 && r.row === e && r.group === t ? n : null;
}
function KG(e, t, n, r) {
	let i = r(t);
	return i === null ? null : (XG(i, t.getAttribute(b)), UG.set(i, {
		row: t,
		group: n
	}), e.insertBefore(i, t), i);
}
function qG(e, t) {
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
function JG(e) {
	return e.find((e) => !e.classList.contains(Ei));
}
function YG(e, t, n, r, i) {
	let a = t.renderFromTemplate(e, n, i);
	if (a === null) return null;
	let o = document.createElement("div");
	return XG(o, r), o.appendChild(a), o;
}
function XG(e, t) {
	e.setAttribute(Lt, ""), t === null ? e.removeAttribute(Rt) : e.setAttribute(Rt, t);
}
var ZG = "bottom", QG = "pending", $G = "focus";
function eK(e, t, n) {
	let r = tK(e, t);
	n <= 0 ? r?.remove() : (r ??= nK(t), t === "top" ? e.firstElementChild !== r && e.insertBefore(r, e.firstElementChild) : e.lastElementChild !== r && e.appendChild(r), r.style.height = `${n}px`);
}
function tK(e, t) {
	for (let n of e.children) if (n.getAttribute("data-ui-window-spacer") === t) return n;
	return null;
}
function nK(e) {
	let t = document.createElement("div");
	return t.setAttribute(Zt, e), t.style.flexShrink = "0", t;
}
function rK(e, t) {
	let n = tK(e, $G);
	if (t <= 0) return n?.remove(), null;
	let r = n ?? nK($G);
	return r.style.height = `${t}px`, r;
}
function iK(e, t, n) {
	t === null ? (e.sum += n, e.count++) : e.sum += n - t;
}
//#endregion
//#region src/items/items-dom-order.ts
function aK(e, t) {
	let n = e.firstElementChild;
	n !== null && n.getAttribute("data-ui-window-spacer") === "top" && (n = n.nextElementSibling);
	for (let r of t) r !== n && e.insertBefore(r, n), n = r.nextElementSibling;
}
//#endregion
//#region src/items/items-group-renderer.ts
var oK = /* @__PURE__ */ new WeakMap();
function sK(e) {
	for (let t of e.querySelectorAll(`:scope > [${Lt}]`)) t.remove();
}
function cK(e, t, n, r, i, a) {
	let o = PA(e, G(e)), s = n.getGroupTemplate(t), c = s !== void 0, l = c && o.some((e) => e.hasAttribute("data-ui-group")), u = TA(i.getItemsFilterSortMetadata(t), a, yA(e));
	if (c && !l && (sK(e), oK.delete(e)), o.length === 0) return;
	let d = Zk(e);
	if (!l) {
		aK(e, [...EA(o, u, r), ...Xk(d)]);
		return;
	}
	let { buckets: f, order: p } = qG(o, (e) => e.getAttribute("data-ui-group") ?? ""), m = r.getAncestorStack(e), h = oK.get(e), g = /* @__PURE__ */ new Map(), _ = [];
	for (let t of p) {
		let n = f.get(t);
		u.length > 0 && (n = EA(n, u, r));
		let i = t === "" ? void 0 : JG(n);
		if (i !== void 0) {
			let n = lK(e, h?.get(t), i) ?? YG(s, r, r.getItemValue(i), i.getAttribute("data-ui-key"), m);
			n !== null && (g.set(t, n), _.push(n));
		}
		_.push(...n);
	}
	let v = new Set(g.values());
	for (let t of e.querySelectorAll(`:scope > [${Lt}]`)) v.has(t) || t.remove();
	oK.set(e, g), aK(e, [..._, ...Xk(d)]);
}
function lK(e, t, n) {
	if (t !== void 0 && t.parentElement === e) return XG(t, n.getAttribute(b)), t;
}
//#endregion
//#region src/items/items-host-sync.ts
var uK = "ui-tree-rules", dK = `:scope > .${fr}:not(.${hr})`, fK = null;
function pK(e, t, n) {
	fK === null ? mK(e, t, n) : (fK.hosts.set(e, {
		componentId: t,
		context: n
	}), Nk(e) === "virtualized" && fK.drawing.add(e));
}
function mK(e, t, n) {
	if (e.parentElement?.classList.contains("ui-tree") === !0) e.dispatchEvent(new Event(uK, { bubbles: !0 })), Qk(e, t, n.templates, n.renderer, e.querySelector(dK) !== null);
	else switch (Nk(e)) {
		case "windowed":
			Qk(e, t, n.templates, n.renderer), gK(e, t, n);
			return;
		case "virtualized":
			n.virtualization.sync(e);
			return;
		default:
			SA(e, t, n.metadata, n.renderer, n.state), hK(e), Qk(e, t, n.templates, n.renderer), cK(e, t, n.templates, n.renderer, n.metadata, n.state);
			return;
	}
}
function hK(e) {
	let t = fp(e);
	t !== null && dp(t, G(e).filter((e) => e instanceof HTMLElement));
}
function gK(e, t, n) {
	let r = n.templates.getGroupTemplate(t);
	if (r === void 0) return;
	let i = n.renderer.getAncestorStack(e);
	WG(e, (e) => YG(r, n.renderer, n.renderer.getItemValue(e), e.getAttribute(b), i));
}
function _K(e) {
	if (fK !== null) {
		e();
		return;
	}
	let t = {
		hosts: /* @__PURE__ */ new Map(),
		drawing: /* @__PURE__ */ new Set()
	};
	fK = t;
	try {
		e();
	} finally {
		fK = null;
		for (let [e, n] of t.hosts) vK(e, n);
	}
}
function vK(e, t) {
	try {
		e.isConnected && mK(e, t.componentId, t.context);
	} catch (t) {
		c("bringing an items host in step failed.", {
			host: e,
			error: t
		});
	}
}
function yK(e) {
	if (fK !== null && fK.drawing.size !== 0) for (let t of fK.drawing) {
		let n = fK.hosts.get(t);
		n !== void 0 && e(t) && (fK.drawing.delete(t), fK.hosts.delete(t), vK(t, n));
	}
}
//#endregion
//#region src/rendering/tree-boot-fold.ts
var bK = "fold", xK = ["fold-hidden", "fold-shown"], SK = ".ui-table", CK = `:scope > .${cr} > .${lr} > [role='columnheader']`, wK = `:scope > .${ur}`, TK = "input:not([type='hidden']), button, select, textarea, a[href]", EK = /* @__PURE__ */ new WeakMap();
function DK(e) {
	for (let t of e.querySelectorAll(CK)) {
		let e = OK(t);
		e !== null && e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
	}
}
function OK(e) {
	let t = e.querySelector(TK);
	if (t !== null) return t;
	if (e.hasAttribute("tabindex")) return e;
	let n = e.querySelector(wK);
	return n !== null && n.getClientRects().length > 0 ? e : null;
}
function kK(e, t = null) {
	let n = AK(e), r = EK.get(e), i = n.find((e) => t !== null && MK(e) === t) ?? (r !== void 0 && n.includes(r) ? r : n[0]);
	return i !== void 0 && (jK(e, i), !0);
}
function AK(e) {
	let t = gf(e), n = [];
	for (let r of e.querySelectorAll(CK)) {
		let e = OK(r), i = Number(r.getAttribute("data-ui-table-column") ?? NaN);
		e !== null && Number.isInteger(i) && F(e) && n.push({
			stop: e,
			place: t.place(i)
		});
	}
	return n.sort((e, t) => e.place - t.place).map((e) => e.stop);
}
function jK(e, t) {
	t.hasAttribute("tabindex") || t.setAttribute("tabindex", "-1"), EK.set(e, t), t.focus();
}
function MK(e) {
	return e.closest("[role='columnheader']")?.getAttribute("data-ui-table-column") ?? null;
}
function NK(e) {
	let t = e.closest("[role='columnheader']"), n = t?.parentElement?.parentElement?.parentElement ?? null;
	return t !== null && n instanceof HTMLElement && n.matches(SK) && OK(t) === e ? n : null;
}
function PK(e, t, n) {
	if (!N(e) || !(e.target instanceof HTMLElement)) return !1;
	switch (e.key) {
		case "ArrowDown": return n(MK(e.target)), !0;
		case "ArrowUp": return !0;
	}
	if (!_d(e.key, "horizontal")) return !1;
	let r = gd({
		key: e.key,
		items: AK(t),
		current: e.target,
		axis: "horizontal",
		loop: !1
	});
	return r !== null && r !== e.target && jK(t, r), !0;
}
//#endregion
//#region src/interactions/items-selection-engine.ts
var FK = /* @__PURE__ */ new Set([
	" ",
	"Enter",
	"Delete"
]), IK = ".ui-table", LK = /* @__PURE__ */ new Set([
	"ArrowLeft",
	"ArrowRight",
	"ArrowUp",
	"ArrowDown",
	"Home",
	"End",
	"Enter",
	"F2",
	" "
]), RK = `:scope > [${x}], :scope > .${cr}, :scope > .${cr} > [${x}]`, zK = class {
	root;
	rows;
	pressedBoxes = [];
	windowEnds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.rows = e.rows, this.applyAll(this.root.querySelectorAll(I)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("mouseup", () => this.restoreBoxes(), !0), this.root.addEventListener("pointercancel", () => this.restoreBoxes(), !0), this.root.addEventListener("contextmenu", () => this.restoreBoxes(), !0), V(this.root, I, { childList: !0 }, (e) => this.applyAll(e)), V(this.root, I, { attributeFilter: [
			li,
			di,
			fi,
			Qt
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
		let t = mf(e);
		$d(e, t);
		for (let t of e.querySelectorAll(RK)) VK(t);
		if (e.matches(".ui-items-view, .ui-table")) {
			e.matches(IK) && DK(e);
			for (let n of t) {
				let t = dd(n);
				t !== null && VK(t);
				for (let e of fd(n)) VK(e);
				BK(e, n, n.hasAttribute(Ne));
			}
			this.settleWindowEnd(e, t);
		}
	}
	settleWindowEnd(e, t) {
		let n = this.windowEnds.get(e), r = n === void 0 ? null : lf(e);
		if (n === void 0 || r === null || r.hasAttribute("data-ui-window-pending")) return;
		let i = Fk(r, nn) !== null, a = n === "first" ? Pk(r) === 0 && !Ik(r, "data-ui-window-more-before") : !Ik(r, an);
		if (i && !a) return;
		this.windowEnds.delete(e);
		let o = np(n === "first" ? "Home" : "End", t, null, YK(e));
		o !== null && (Ff(e, t, o), e.getAttribute("data-ui-selection") === "one" && tf(e, t, o, Gd));
	}
	remark(e) {
		let t = mf(e);
		$d(e, t), this.settleWindowEnd(e, t);
	}
	handleClick(e) {
		let t = this.resolveRow(e, I);
		if (t === null || !(e instanceof MouseEvent)) return;
		let { root: n, item: r } = t, i = mf(n);
		Ff(n, i, r, e.target instanceof Element ? Zf(r, e.target) : null), z(n), n.hasAttribute("data-ui-no-row-select") ? Jd(n, r) : tf(n, i, r, Yd(e), this.heldRange(n)) && e.preventDefault();
	}
	resolveRow(e, t) {
		if (!(e.target instanceof Element)) return null;
		let n = e.target.closest(Ud), r = n?.closest(I) ?? null;
		return n === null || r === null || n.closest(I) !== r || !r.matches(t) || k(r) ? null : hd(e.target, n) === null && !A(n) ? {
			root: r,
			item: n
		} : null;
	}
	heldRange(e) {
		let t = this.rows, n = lf(e);
		return t === void 0 || n === null ? void 0 : (e, r) => t.rangeKeysOf(n, e, r);
	}
	handleDoubleClick(e) {
		let t = this.resolveRow(e, Wd);
		t === null || e.target instanceof Element && t.item.contains(e.target.closest("[data-ui-no-row-open]")) || (e.preventDefault(), sp(t.item, "open"));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.altKey || !(e.target instanceof Element) || rd(e)) return;
		let t = NK(e.target);
		if (t !== null && !k(t)) {
			PK(e, t, (e) => this.enterRows(t, e)) && e.preventDefault();
			return;
		}
		let n = Ef(e);
		if (n === null) return;
		let { root: r } = n;
		if (!r.matches(".ui-items-view, .ui-table") || k(r) || Lf(r) && HK(e) && this.handleCellKey(r, e)) return;
		let i = YK(r);
		if (!FK.has(e.key) && !ep(e.key, i)) return;
		if (this.windowEnds.delete(r), this.reachWindowEnd(r, e)) {
			e.preventDefault();
			return;
		}
		this.bringRowsIn(r, e.key);
		let a = mf(r), o = Af(a), s = np(e.key, a, jf(a), i);
		if (s !== null) {
			e.preventDefault(), Ff(r, a, s, e.key === "ArrowUp" && !e.shiftKey && Lf(r) ? Xf(s) : null), WK(r, a, o, s, Xd(r, e), this.heldRange(r));
			return;
		}
		if (e.key === "ArrowUp" && N(e, { alt: !0 }) && r.matches(IK) && kK(r, Gf(r))) {
			e.preventDefault();
			return;
		}
		if (o === null || A(o)) return;
		let c = dd(o);
		switch (e.key) {
			case " ":
				GK(r, a, o, c);
				break;
			case "Enter":
				qK(r, a, o, c);
				break;
			case "Delete":
				if (!KK(r, a, o)) return;
				break;
			default: return;
		}
		e.preventDefault();
	}
	handleCellKey(e, t) {
		this.bringCursorRowIn(e);
		let n = mf(e), r = jf(n);
		if (r === null || A(r)) return !1;
		let i = Wf(r), a = N(t, { alt: !0 });
		switch (t.key) {
			case "ArrowLeft":
			case "ArrowRight":
			case "Home":
			case "End": {
				if (!a) return !1;
				let o = Kf(e, r, i, t.key);
				return o !== null && Ff(e, n, r, o), t.preventDefault(), !0;
			}
			case "ArrowDown":
			case "ArrowUp": {
				let o = a ? qf(e, r, i, t.key === "ArrowDown") : null;
				return o !== null && (t.preventDefault(), Ff(e, n, r, o), !0);
			}
			default: return i !== null && UK(i, t);
		}
	}
	reachWindowEnd(e, t) {
		let n = t.key === "Home" || t.key === "End" ? lf(e) : null;
		if (n === null || Nk(n) !== "windowed" || n.hasAttribute("data-ui-window-paged")) return !1;
		let r = t.key === "Home";
		return !(r ? Pk(n) === 0 && !Ik(n, "data-ui-window-more-before") : !Ik(n, "data-ui-window-more-after")) && (this.windowEnds.set(e, r ? "first" : "last"), Td(n, r ? 0 : wd(n).contentHeight), !0);
	}
	bringRowsIn(e, t) {
		let n = this.rows, r = n === void 0 ? null : lf(e);
		if (n === void 0 || r === null) return;
		let i = gp(e);
		switch (t) {
			case "Home":
			case "End": {
				let e = n.shownKeysOf(r);
				e !== null && e.length > 0 && n.reveal(r, t === "Home" ? e[0] : e[e.length - 1], "nearest");
				return;
			}
			case "PageDown":
			case "PageUp": {
				let a = i === null ? jf(mf(e)) : null, o = i ?? (a === null ? null : R(a));
				o !== null && n.reveal(r, o, t === "PageDown" ? "start" : "end");
				return;
			}
			default: this.bringCursorRowIn(e);
		}
	}
	bringCursorRowIn(e) {
		let t = this.rows === void 0 ? null : lf(e), n = gp(e);
		t !== null && n !== null && this.rows?.reveal(t, n, "nearest");
	}
	enterRows(e, t) {
		let n = mf(e), r = jf(n) ?? np("ArrowDown", n, null, "vertical");
		e.focus({ preventScroll: !0 }), r !== null && (Ff(e, n, r, zf(r, t)), e.getAttribute("data-ui-selection") === "one" && tf(e, n, r, Gd));
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement && e.target.matches("[data-ui-items-host], .ui-table__scroll") ? e.target : null, n = t?.closest(I) ?? null;
		if (t !== null && n !== null && [...n.querySelectorAll(RK)].includes(t)) {
			z(n);
			return;
		}
		if (e.target instanceof HTMLElement && e.target.matches(I) && e.target.matches(".ui-items-view, .ui-table") && !k(e.target) && !Ip()) {
			Nf(e.target, mf(e.target));
			return;
		}
		let r = e.target instanceof Element ? e.target.closest(Ud) : null, i = r?.closest(I) ?? null;
		r !== null && i !== null && !r.hasAttribute("data-ui-row-focus") && i.matches(".ui-items-view, .ui-table") && hd(e.target, r) !== null && Ff(i, mf(i), r, e.target instanceof Element ? Zf(r, e.target) : null, !1);
	}
	handlePointerDown(e) {
		this.restoreBoxes();
		let t = e.target instanceof Element ? e.target : null, n = t?.closest(I) ?? null;
		if (t !== null && n !== null) {
			document.activeElement !== n && Rp(n, !0);
			for (let e of n.querySelectorAll(RK)) e.contains(t) && e.getAttribute("tabindex") === "-1" && (e.removeAttribute("tabindex"), this.pressedBoxes.push(e));
		}
	}
	restoreBoxes() {
		for (let e of this.pressedBoxes) VK(e);
		this.pressedBoxes = [];
	}
	followCursor(e) {
		for (let t of e) {
			let e = t.target;
			if (!(e instanceof HTMLElement) || !e.matches(Ud)) continue;
			let n = e.closest(I);
			n !== null && n.matches(".ui-items-view, .ui-table") && BK(n, e, e.hasAttribute(Ne));
		}
	}
};
function BK(e, t, n) {
	if (n) for (let n of t.querySelectorAll(`[${Fe}]`)) n.parentElement?.closest(I) === e && EU(n);
	else for (let n of t.querySelectorAll(yp)) n.tabIndex >= 0 && n.parentElement?.closest(I) === e && md(t, n) && TU(n);
}
function VK(e) {
	e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
}
function HK(e) {
	return LK.has(e.key) || kE(e) !== null;
}
function UK(e, t) {
	let n = t.key, r = kE(t) !== null, i = N(t, { shift: !0 });
	if (!r && (!i || n !== "Enter" && n !== "F2" && n !== " ")) return !1;
	if (n !== " " && $f(e, t)) return !0;
	let a = dd(e);
	if (a !== null && (n === "Enter" || n === " ")) return t.preventDefault(), a.click(), !0;
	if (n !== "F2" && (n !== "Enter" || !Yf(e))) return !1;
	let o = Wp(e);
	return o !== null && (t.preventDefault(), o.focus(), !0);
}
function WK(e, t, n, r, i, a) {
	(e.getAttribute("data-ui-selection") === "one" || i.shift) && (i.shift && qd(e, n), tf(e, t, r, i, a));
}
function GK(e, t, n, r) {
	tf(e, t, n, {
		shift: !1,
		ctrl: !0
	}) || JK(n, r);
}
function KK(e, t, n) {
	if (!e.hasAttribute("data-ui-rows-remove")) return !1;
	let r = XK(t, n);
	for (let e of r) sp(e, "remove");
	return r.length > 0;
}
function qK(e, t, n, r) {
	Zd(e) && !ef(t).includes(n) && tf(e, t, n, Gd), JK(n, r), r === null && sp(n, "open");
}
function JK(e, t) {
	t === null ? sp(e, op) : t.click();
}
function YK(e) {
	return e.matches(".ui-items-view--wrap") ? "grid" : e.matches(".ui-orientation--horizontal") ? "both" : "vertical";
}
function XK(e, t) {
	let n = ef(e);
	return (n.includes(t) ? n.filter((e) => e === t || L(e) !== null) : [t]).filter((e) => !Cl(e, "data-ui-unremovable") && !A(e));
}
//#endregion
//#region src/interactions/tree-engine.ts
var ZK = "ui-tree__row--folded", QK = "ui-tree__row--dragging", $K = "ui-tree__loading", eq = "ui-tree__loading-ring", tq = "ui-tree-node__text", nq = "ui-tree-node__toggle", rq = "ui-tree-node__rename", iq = ".ui-text__title", aq = mr, oq = "--ui-tree-depth", sq = "expanded", cq = 200, lq = 600, uq = .25, dq = {
	ArrowUp: "up",
	ArrowDown: "down",
	ArrowLeft: "out",
	ArrowRight: "in"
}, fq = /* @__PURE__ */ new Set([
	" ",
	"ArrowRight",
	"ArrowLeft",
	"Enter",
	"F2",
	"Delete"
]), pq = "ui-tree-unfold-settled", mq = {
	name: "unfold",
	registration: { completed: (e) => {
		e.domEvent.target?.dispatchEvent(new Event(pq, { bubbles: !0 }));
	} }
}, hq = class {
	root;
	store = new qF();
	rules;
	folds = /* @__PURE__ */ new WeakMap();
	requested = /* @__PURE__ */ new WeakSet();
	inFlight = /* @__PURE__ */ new WeakSet();
	writtenBoot = /* @__PURE__ */ new WeakMap();
	springTarget = null;
	springTimer = 0;
	dropPlace = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.rules = e.rules, this.root.addEventListener(uK, (e) => {
			let t = e.target instanceof Element ? e.target.closest(`.${dr}`) : null;
			t !== null && (this.layout(t), dp(t, this.rowsOf(t)));
		}, !0), this.root.addEventListener(pq, (e) => this.handleUnfoldSettled(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), e.effects?.register("RenameNode", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename node effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(T(n.id), n.dynamicParameters ?? []), i = r === null ? null : this.rowsOf(r).find((e) => R(e) === t.key) ?? null;
			i === null ? s("rename node effect names no node on the page.", t) : this.startRename(i);
		}), this.layoutAll(this.root.querySelectorAll(`.${dr}`)), V(this.root, `.${dr}`, {
			childList: !0,
			attributeFilter: [
				Cr,
				wr,
				Er,
				jr
			],
			relevant: bq
		}, (e) => this.layoutAll(e));
	}
	layoutAll(e) {
		for (let t of e) this.layout(t);
	}
	layout(e) {
		let t = this.foldOf(e), n = this.resolveRules(e), r = n === null ? this.rowsOf(e) : this.orderRows(e, n), i = e.hasAttribute("data-ui-tree-draggable") || e.hasAttribute("data-ui-drag-kind"), a = /* @__PURE__ */ new Set();
		for (let e of r) {
			let t = kj(e)?.getAttribute(Cr);
			t != null && t.length > 0 && a.add(t);
		}
		let o = n?.filtering === !0 ? this.matchingRows(r, n) : null, s = /* @__PURE__ */ new Map();
		for (let e of r) {
			let n = R(e), r = kj(e), c = r?.getAttribute("data-ui-tree-parent") ?? "", l = c.length > 0 ? s.get(c) : void 0, u = l === void 0 ? 0 : l.depth + 1, d = l === void 0 || l.shown && l.expanded, f = r?.hasAttribute(wr) === !0, p = f || a.has(n), m = p && r?.hasAttribute("data-ui-tree-expanded") === !0, h = l === void 0 || l.authoredShown && this.authoredExpandedOf(l), g = p && (o === null ? t.get(n) ?? m : o.has(n)), _ = o !== null && !o.has(n);
			e.style.setProperty(oq, String(u)), e.setAttribute("aria-level", String(u + 1)), Pf(e, r?.querySelector(`:scope > .${tq}`) ?? null), e.classList.toggle(ZK, !d), e.classList.toggle(hr, _), e.removeAttribute(Ar), e.draggable = i && Hk(e), p ? e.setAttribute("aria-expanded", g ? "true" : "false") : e.removeAttribute("aria-expanded"), (a.has(n) || !f) && (e.removeAttribute(Or), this.inFlight.delete(e)), g && d && f && !a.has(n) && !this.requested.has(e) && (this.requested.add(e), this.inFlight.add(e), e.setAttribute(Or, ""), e.dispatchEvent(new Event("unfold", { bubbles: !0 }))), !g && !this.inFlight.has(e) && this.requested.delete(e), this.placeLoadingRow(e, u + 1, e.hasAttribute(Or), d && g && !_), s.set(n, {
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
		return kj(e.row)?.hasAttribute(Er) === !0;
	}
	writeBootFold(e, t, n) {
		if (t.size === 0) return;
		let r = [], i = [];
		for (let [e, a] of t) {
			let t = n.get(e);
			(t === void 0 || this.authoredExpandedOf(t) !== a) && (a ? r : i).push(e);
		}
		let a = JSON.stringify([r, i]), o = this.writtenBoot.get(e);
		if (o !== a && (this.writtenBoot.set(e, a), this.store.writeBoot(e, bK, r.length + i.length === 0 ? null : { fold: {
			version: 1,
			open: r,
			closed: i
		} }), o === void 0)) for (let t of xK) this.store.writeBoot(e, t, null);
	}
	resolveRules(e) {
		let t = this.hostOf(e), n = qa(e);
		if (this.rules === void 0 || t === null || n === null) return null;
		let r = this.rules.metadata.getItemsFilterSortMetadata(n), i = yA(t);
		if (r === void 0 && i === null) return null;
		let a = TA(r, this.rules.state, i), o = wA(r, this.rules.state, i);
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
			let t = kj(e)?.getAttribute("data-ui-tree-parent") ?? "", n = i.has(t) ? t : "", r = a.get(n);
			r === void 0 ? a.set(n, [e]) : r.push(e);
		}
		let o = [], s = (e) => {
			let n = a.get(e);
			if (n !== void 0) {
				n.sort((e, n) => DA(r.getItemValue(e), r.getItemValue(n), t.sorts));
				for (let e of n) o.push(e), s(R(e));
			}
		};
		if (s(""), o.length !== n.length || o.every((e, t) => e === n[t])) return o.length === n.length ? o : n;
		let c = this.hostOf(e);
		if (c === null) return n;
		for (let e of c.querySelectorAll(`:scope > .${$K}`)) e.remove();
		for (let e of o) c.appendChild(e);
		return o;
	}
	matchingRows(e, t) {
		let n = /* @__PURE__ */ new Set();
		if (this.rules === void 0) return n;
		let r = this.rules.state, i = this.rules.renderer;
		for (let a = e.length - 1; a >= 0; a--) {
			let o = e[a], s = R(o), c = i.getItemValue(o);
			if (c === void 0 || CA(t.config, c, r, t.query) || n.has(s)) {
				n.add(s);
				let e = kj(o)?.getAttribute("data-ui-tree-parent") ?? "";
				e.length > 0 && n.add(e);
			}
		}
		return n;
	}
	placeLoadingRow(e, t, n, r) {
		let i = e.nextElementSibling, a = i instanceof HTMLElement && i.classList.contains($K) ? i : null;
		if (!n) {
			a?.remove();
			return;
		}
		let o = a ?? xq();
		o.style.setProperty(oq, String(t)), o.classList.toggle(ZK, !r), a === null && e.after(o);
	}
	handleUnfoldSettled(e) {
		e.target instanceof Element && this.inFlight.delete(e.target);
	}
	handleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null) return;
		let { tree: n, row: r, target: i } = t;
		(i.closest(`.${nq}`) !== null || Cl(r, "data-ui-unselectable") && hd(i, r) === null) && (e.preventDefault(), this.setFocus(n, r, null), this.toggle(n, r));
	}
	handleDoubleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null || hd(t.target, t.row) !== null) return;
		let { tree: n, row: r } = t;
		e.preventDefault(), n.hasAttribute("data-ui-tree-rename-dblclick") && this.canRename(n, r) ? this.startRename(r) : sp(r, "open");
	}
	rowOfEvent(e) {
		if (!(e.target instanceof Element)) return null;
		let t = e.target.closest(`.${fr}`), n = t?.closest(".ui-tree") ?? null;
		return t === null || n === null || t.closest(".ui-tree") !== n || A(t) ? null : {
			tree: n,
			row: t,
			target: e.target
		};
	}
	handleFocusIn(e) {
		let t = e.target;
		t instanceof HTMLElement && t.classList.contains("ui-tree") && !k(t) && !Ip() && Nf(t, this.rowsOf(t));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || M(e) || !(e.target instanceof Element)) return;
		let t = Ef(e);
		if (t === null) return;
		let n = t.root;
		if (!n.classList.contains("ui-tree") || k(n)) return;
		let r = e.altKey && N(e, { alt: !0 }) ? dq[e.key] : void 0;
		if (r !== void 0 && n.hasAttribute("data-ui-tree-draggable")) {
			e.preventDefault(), this.moveByKey(n, r);
			return;
		}
		if (e.altKey || !fq.has(e.key) && !ep(e.key, "vertical")) return;
		let i = this.rowsOf(n), a = Af(i), o = np(e.key, i, jf(i), "vertical");
		if (o !== null) e.preventDefault(), this.setFocus(n, o, Xd(n, e));
		else if (!(a === null || A(a))) {
			switch (e.key) {
				case " ":
					GK(n, i, a, null);
					break;
				case "ArrowRight":
					a.getAttribute("aria-expanded") === "false" ? this.toggle(n, a) : a.getAttribute("aria-expanded") === "true" && this.setFocus(n, np("ArrowDown", i, a, "vertical"), Gd);
					break;
				case "ArrowLeft":
					a.getAttribute("aria-expanded") === "true" ? this.toggle(n, a) : this.setFocus(n, this.parentOf(n, a), Gd);
					break;
				case "Enter":
					qK(n, i, a, null);
					break;
				case "F2":
					if (!this.canRename(n, a)) return;
					this.startRename(a);
					break;
				case "Delete":
					if (n.hasAttribute("data-ui-tree-unremovable") || !KK(n, i, a)) return;
					break;
				default: return;
			}
			e.preventDefault();
		}
	}
	moveByKey(e, t) {
		let n = this.rowsOf(e), r = Af(n);
		if (r === null || !r.draggable || (t === "up" || t === "down") && this.isSorted(e)) return;
		let i = Cq(n), a = R(r), o = Fj(i, a, t);
		if (o === null) return;
		let [s] = this.moveRows(e, [r], o, t === "in" ? n.find((e) => R(e) === o.parent) ?? null : null), c = i.filter((e) => e.parent === o.parent && e.key !== a).length + 1;
		JA(s + 1, c);
	}
	isSorted(e) {
		return (this.resolveRules(e)?.sorts.length ?? 0) > 0;
	}
	canRename(e, t) {
		return e.hasAttribute("data-ui-tree-renamable") && !Cl(t, "data-ui-unrenamable");
	}
	handleDragStart(e) {
		let t = Sq(e), n = t?.closest(".ui-tree") ?? null, r = n?.hasAttribute(jr) === !0, i = n === null ? null : this.hostOf(n);
		if (t === null || n === null || i === null || !r && !n.hasAttribute("data-ui-drag-kind")) return;
		if (A(t)) {
			e.preventDefault();
			return;
		}
		let a = Vk(t, this.rowsOf(n)), o = Bk(n, i, a);
		r ? Cy(e, n, t, QK, R(t), a.filter((e) => e !== t), Wk(o, !0)) : Ty(e, R(t), Wk(o, !1)), Gk(e, o);
	}
	draggingRows(e) {
		return this.rowsOf(e).filter((e) => e.classList.contains(QK));
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${dr}`), n = t === null ? [] : this.draggingRows(t), r = t === null ? null : this.hostOf(t);
		if (t === null || n.length === 0 || r === null) return;
		let i = e.target.closest(`.${fr}`), a = i !== null && i.closest(".ui-tree") === t ? i : null, o = a === null ? {
			mark: "",
			place: {
				parent: "",
				before: null
			}
		} : this.dropAt(t, a, n, e.clientY);
		o === null ? (this.markDrop(t, null), this.springOpen(t, null)) : (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), this.markDrop(t, a ?? r, o.mark, o.depth), this.dropPlace = o.place, this.springOpen(t, a !== null && o.mark === "" ? a : null));
	}
	dropAt(e, t, n, r) {
		let i = this.parentKeysOf(e), a = R(t), o = (e) => n.some((t) => R(t) === e || yq(i, e, R(t))), s = Aj(t, kj(t)), c = t.getBoundingClientRect(), l = c.height > 0 ? (r - c.top) / c.height : .5, u = s ? uq : .5, d = this.isSorted(e) ? null : l < u ? "before" : l >= 1 - u ? "after" : null;
		if (d === null) return s && !o(a) ? {
			mark: "",
			place: {
				parent: a,
				before: null
			}
		} : null;
		if (n.includes(t)) return null;
		let f = this.rowsOf(e), p = Cq(f), m = Number(t.style.getPropertyValue(oq)) || 0, h = new Set(n.map(R)), g = d === "after" && t.getAttribute("aria-expanded") === "true" ? p.find((e) => e.parent === a && e.shown !== !1 && !h.has(e.key)) : void 0, _ = i.get(a) ?? "", v = g === void 0 ? {
			parent: _,
			before: d === "before" ? a : zj(p, _, a, !1, h)
		} : {
			parent: a,
			before: g.key
		};
		return !jj(v.parent, (e) => f.find((t) => R(t) === e) ?? null) || o(v.parent) ? null : {
			mark: d,
			place: v,
			depth: g === void 0 ? m : m + 1
		};
	}
	springOpen(e, t) {
		let n = t !== null && t.getAttribute("aria-expanded") === "false" ? t : null;
		n !== this.springTarget && (window.clearTimeout(this.springTimer), this.springTarget = n, n !== null && (this.springTimer = window.setTimeout(() => this.expand(e, n), lq)));
	}
	handleDragLeave(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${dr}`);
		t !== null && Ey(e, t) && (this.markDrop(t, null), this.springOpen(t, null));
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${dr}`), n = t === null ? [] : this.draggingRows(t), r = t?.querySelector(`[${aq}]`) ?? null, i = this.dropPlace;
		if (t === null || n.length === 0 || r === null || i === null) return;
		e.preventDefault();
		let a = this.parentKeysOf(t), o = n.filter((e) => !n.some((t) => t !== e && yq(a, R(e), R(t)))), s = r.getAttribute(aq) === "" && r.classList.contains("ui-tree__row") ? r : null;
		this.markDrop(t, null), this.springOpen(t, null), wy(t, QK), this.moveRows(t, o, i, s);
	}
	moveRows(e, t, n, r) {
		let i = Bj(Cq(this.rowsOf(e)), t.map(R), n);
		return r !== null && this.expand(e, r), t.forEach((e, t) => {
			let r = kj(e)?.querySelector(`.${tq}`) ?? null;
			r !== null && (r.setAttribute(kr, n.parent), r.dispatchEvent(new Event("change", { bubbles: !0 })), oj(e, i[t]));
		}), i;
	}
	handleDragEnd(e) {
		let t = Sq(e)?.closest(".ui-tree") ?? null;
		t !== null && (wy(t, QK), this.markDrop(t, null), this.springOpen(t, null));
	}
	markDrop(e, t, n = "", r) {
		Nj(e, t, n, r), t === null && (this.dropPlace = null);
	}
	parentKeysOf(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of this.rowsOf(e)) t.set(R(n), kj(n)?.getAttribute("data-ui-tree-parent") ?? "");
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
		i.delete(r), i.set(r, n), gq(i, a);
		let o = n ? a.filter((e) => e.classList.contains(ZK)) : [];
		this.store.writeJson(e, sq, [...i]), this.layout(e), vq(o.filter((e) => !e.classList.contains(ZK)));
	}
	foldOf(e) {
		let t = this.folds.get(e);
		return t === void 0 && (t = _q(this.store.readJson(e, sq)), this.folds.set(e, t)), t;
	}
	setFocus(e, t, n) {
		if (t === null) return;
		let r = this.rowsOf(e), i = Af(r);
		Ff(e, r, t), n !== null && WK(e, r, i, t, n);
	}
	parentOf(e, t) {
		let n = kj(t)?.getAttribute("data-ui-tree-parent") ?? "";
		return n.length === 0 ? null : this.rowsOf(e).find((e) => R(e) === n) ?? null;
	}
	startRename(e) {
		let t = e.closest(`.${dr}`), n = kj(e), r = n?.querySelector(iq) ?? null;
		t === null || n === null || r === null || Cl(e, "data-ui-unrenamable") || (this.setFocus(t, e, null), Iu({
			container: n,
			title: r,
			className: rq,
			value: n.getAttribute("data-ui-tree-title") ?? r.textContent?.trim() ?? "",
			commit: (t) => {
				n.setAttribute(Dr, t), n.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
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
function gq(e, t) {
	if (e.size <= cq) return;
	let n = new Set(t.map(R)), r = 0;
	for (let t of e.keys()) n.has(t) || r++;
	for (let t of [...e.keys()]) {
		if (r <= cq) return;
		n.has(t) || (e.delete(t), r--);
	}
}
function _q(e) {
	let t = Array.isArray(e) ? e : typeof e == "object" && e ? Object.entries(e) : [], n = /* @__PURE__ */ new Map();
	for (let e of t) Array.isArray(e) && typeof e[0] == "string" && typeof e[1] == "boolean" && n.set(e[0], e[1]);
	return n;
}
function vq(e) {
	if (!(e.length === 0 || gh())) for (let t of e) t.animate([{
		opacity: 0,
		offset: 0
	}], {
		duration: B.fast,
		easing: B.enter
	});
}
function yq(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let i = e.get(t) ?? ""; i.length > 0 && !r.has(i); i = e.get(i) ?? "") {
		if (i === n) return !0;
		r.add(i);
	}
	return !1;
}
function bq(e) {
	if (e.type !== "childList") return !0;
	let t = e.target;
	return t instanceof HTMLElement && (t.classList.contains("ui-tree__row") || t.hasAttribute("data-ui-items-host") && t.parentElement?.classList.contains("ui-tree") === !0);
}
function xq() {
	let e = document.createElement("div"), t = document.createElement("span");
	return e.className = $K, e.setAttribute(Jk, ""), e.setAttribute("aria-hidden", "true"), t.className = eq, e.append(t, O.text("ui.tree.loading")), e;
}
function Sq(e) {
	return e.target instanceof Element ? e.target.closest(`.${fr}`) : null;
}
function Cq(e) {
	return e.map((e) => ({
		key: R(e),
		parent: kj(e)?.getAttribute("data-ui-tree-parent") ?? "",
		takesDrop: Aj(e, kj(e)),
		shown: !e.classList.contains(hr)
	}));
}
//#endregion
//#region src/runtime/client-state.ts
var wq = {
	visibilityState: () => document.visibilityState,
	notificationPermission: Eq
};
function Tq(e) {
	return e !== "hidden";
}
function Eq() {
	return typeof Notification > "u" || !window.isSecureContext ? void 0 : Notification.permission;
}
var Dq = 200;
function Oq(e = wq) {
	return {
		visible: Tq(e.visibilityState()),
		notificationPermission: e.notificationPermission() ?? "unsupported"
	};
}
var kq = class {
	report;
	source;
	settleMilliseconds;
	held = null;
	timer;
	constructor(e) {
		this.report = e.report, this.source = e.source ?? wq, this.settleMilliseconds = e.settleMilliseconds ?? Dq;
	}
	forAttach() {
		return clearTimeout(this.timer), this.held = Oq(this.source), this.held;
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
		let t = Oq(this.source);
		(t.visible !== e.visible || t.notificationPermission !== e.notificationPermission) && (this.held = t, this.report(t).catch(() => void 0));
	}
};
//#endregion
//#region src/interactions/system-notifications.ts
function Aq(e) {
	return {
		permission: Eq,
		registration: e ?? (() => Promise.resolve(void 0)),
		create: (e, t) => new Notification(e, t),
		focus: () => window.focus()
	};
}
async function jq(e, t, n = Aq()) {
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
function Mq(e, t, n, r = window.location) {
	e.bringTo !== void 0 && Nq(e.bringTo, r) ? t(e.bringTo) : e.action !== void 0 && n(e.action);
}
function Nq(e, t = window.location) {
	let n = new URL(e, t.origin);
	return n.pathname !== t.pathname || n.search !== t.search || n.hash !== "" && n.hash !== t.hash;
}
//#endregion
//#region src/interactions/tab-order.ts
function Pq(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) e[n].pinned && (t = n + 1);
	return t;
}
//#endregion
//#region src/interactions/tabs-view-engine.ts
var Y = "ui-tabs-view", Fq = "ui-tab-item__label", Iq = "ui-tab-item__close", Lq = "ui-tab-item__rename", Rq = "ui-tab-item__caption", zq = "ui-tab-item__pin", Bq = ".ui-text__title", Vq = "ui-tab-item--dragging", Hq = "ui-tab-item__caption--overflowed", Uq = "ui-tabs-view--overflowing", Wq = "ui-tabs-view--no-overflow", Gq = "ui-tab-item__page", Kq = "ui-tab-item--selected", qq = `.${Rn}`, Jq = "tab-menu-entry", Yq = {
	name: Jq,
	registration: { dynamicParameters: (e) => BI(e.domEvent.detail?.entry, e.dynamicParameters) }
}, Xq = "tab-pin";
function Zq(e) {
	return {
		name: Xq,
		registration: Mk((e) => QA(e.target), e)
	};
}
var Qq = "--ui-tabs-view-strip", $q = class {
	root;
	fitter;
	dragStart = null;
	menuTab = null;
	closed = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new iU({
			rootClass: Y,
			overflowingClass: Uq,
			wraps: (e) => e.classList.contains(Wq),
			hiddenClass: Hq,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(), e.effects?.register("RenameTab", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename tab effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(T(n.id), n.dynamicParameters ?? []), i = (r === null ? void 0 : this.ownItems(r).find((e) => uJ(e) === t.key))?.querySelector(`.${Fq}`) ?? null;
			i === null ? s("rename tab effect names no tab on the page.", t) : this.startRename(i);
		}), this.root.addEventListener(GI, (e) => this.prepareMenu(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), tG(this.root, ["press"], (e) => {
			let t = e.closest(`.${Iq}`)?.closest(`.${Rq}`) ?? null;
			return t === null ? [] : [t];
		}), V(this.root, `.${Y}`, {
			childList: !0,
			attributeFilter: [
				mi,
				be,
				ce,
				...bi
			],
			relevant: (e) => !Bg(e, `.${Gq}`, `.${Y}`)
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${Y}`)) this.apply(e);
	}
	apply(e) {
		let t = this.ownItems(e);
		tJ(e, t);
		let n = t.filter(Gg), r = e.getAttribute("data-ui-tabs-selected") ?? "", i = Vd(n, r, uJ);
		if (i === null) return;
		if (i !== r) {
			this.select(e, i);
			return;
		}
		let a = e.hasAttribute(be), o = t.find((e) => e.classList.contains(Kq))?.querySelector(`.${Rq}`) ?? null, s = [], c = null, l = null;
		for (let e of t) {
			let t = uJ(e) === r;
			e.classList.toggle(Kq, t);
			let i = e.querySelector(`.${Rq}`);
			i !== null && (i.draggable = a, fU(i), n.includes(e) && (s.push(i), t && (c = i))), e.querySelector(`.${Fq}`)?.setAttribute("aria-selected", t ? "true" : "false");
			for (let n of e.querySelectorAll(`.${Gq}`)) n.hidden = !t;
			t && (l = e.querySelector(`.${Gq}`));
		}
		this.fitCaptions(e, s, c), this.writeStripHeight(e, l), pU(o, c), o !== null && o !== c && mU(l);
		let u = [], d = null;
		for (let e of s) {
			let t = e.querySelector(`.${Fq}`);
			t === null || e.classList.contains(Hq) || (u.push(t), e === c && (d = t));
		}
		P(u, d), this.focusAfterClose(e, d);
	}
	focusAfterClose(e, t) {
		let n = this.closed;
		n === null || n.root !== e || n.item.isConnected || (this.closed = null, t !== null && (document.activeElement === null || document.activeElement === document.body) && z(t));
	}
	writeStripHeight(e, t) {
		let n = this.hostOf(e);
		if (n === null || t === null || !Gg(t)) return;
		let r = Math.max(0, Math.round(t.getBoundingClientRect().top - n.getBoundingClientRect().top));
		n.style.setProperty(Qq, `${r}px`);
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${x}]`);
	}
	fitCaptions(e, t, n) {
		let r = this.hostOf(e), i = e.querySelector(`:scope > .${$H}`);
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownItems(e).find((e) => uJ(e) === t)?.querySelector(`.${Fq}`)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownItems(e).filter(Gg).map((e) => ({
				key: uJ(e),
				title: e.querySelector(`.${Fq}`)?.textContent?.trim() ?? uJ(e),
				current: uJ(e) === t,
				disabled: k(e.querySelector(`.${Fq}`) ?? e)
			}));
		});
	}
	prepareMenu(e) {
		let t = e.target;
		if (!(e instanceof CustomEvent) || !(t instanceof HTMLElement) || t.getAttribute("data-ui-context-menu") !== "tab") return;
		let n = t.parentElement, r = e.detail.target.closest(`.${XA}`);
		if (n === null || !n.classList.contains(Y) || r === null || r.closest(`.${Y}`) !== n) {
			e.preventDefault();
			return;
		}
		let i = iJ(n, r), a = oJ(t), o = a.map((e) => {
			if (aJ(e)) return "rule";
			let t = i.get(e.getAttribute("data-ui-key") ?? "");
			return t !== void 0 && (e.style.display = t ? "" : "none"), t ?? Gg(e) ? "shown" : "hidden";
		});
		zI(o).forEach((e, t) => {
			o[t] === "rule" && (a[t].style.display = e ? "" : "none");
		}), o.includes("shown") ? this.menuTab = {
			root: n,
			key: uJ(r)
		} : e.preventDefault();
	}
	handleMenuEntry(e) {
		let t = e.closest(`[${Se}="tab"]`), n = t?.parentElement ?? null, r = e.closest(qq);
		if (t === null || n === null || !n.classList.contains(Y) || r === null || !t.contains(r)) return !1;
		let i = r.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "", a = this.menuTab, o = a === null || a.root !== n ? void 0 : this.ownItems(n).find((e) => uJ(e) === a.key);
		if (i.length === 0 || r.matches("[data-ui-menu-group] > .ui-menu-item, [data-ui-menu-item-kind=\"header\"], [data-ui-menu-item-kind=\"separator\"]") || o === void 0) return !0;
		if (!i.startsWith("tabs:")) return o.dispatchEvent(new CustomEvent(Jq, {
			bubbles: !0,
			detail: { entry: i }
		})), !0;
		if (iJ(n, o).get(i) !== !0) return !0;
		switch (i) {
			case MI: {
				let e = o.querySelector(`.${Fq}`);
				e !== null && this.startRename(e);
				break;
			}
			case NI:
			case PI:
				this.setPinned(n, o, i === NI);
				break;
			default: o.dispatchEvent(new Event("remove", { bubbles: !0 }));
		}
		return !0;
	}
	setPinned(e, t, n) {
		if (t.hasAttribute("data-ui-tab-pinned") === n) return;
		let r = t.querySelector(`:scope > .${Rq} > .${zq}`);
		t.toggleAttribute(yi, n), r !== null && (r.toggleAttribute(yi, n), r.dispatchEvent(new Event("change", { bubbles: !0 })));
		let i = this.ownItems(e), a = i.filter((e) => e !== t), o = Pq(a.map(lJ));
		if (i.indexOf(t) === o) return;
		let s = a[o];
		s === void 0 ? ZA(a[a.length - 1]).after(ZA(t)) : ZA(s).before(ZA(t)), t.dispatchEvent(new Event(Xq, { bubbles: !0 }));
	}
	handleClick(e) {
		if (!(e.target instanceof Element) || this.handleMenuEntry(e.target) || this.handleClose(e, e.target)) return;
		let t = e.target.closest(`.${$H}`), n = t?.parentElement ?? null;
		if (t !== null && n !== null && n.classList.contains(Y)) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = sJ(e.target), i = r?.closest(`.${Y}`) ?? null;
		if (r === null || i === null || k(r)) return;
		let a = r.closest(`.${XA}`);
		a !== null && a.closest(`.${Y}`) === i && (e.preventDefault(), this.select(i, uJ(a)), document.activeElement !== r && z(r));
	}
	handleClose(e, t) {
		let n = t.closest(`.${Iq}`), r = n?.closest(".ui-tab-item") ?? null, i = r?.closest(`.${Y}`) ?? null;
		return n === null || r === null || i === null ? !1 : (e.preventDefault(), e.stopPropagation(), nJ(i, r) && r.dispatchEvent(new Event("remove", { bubbles: !0 })), !0);
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = sJ(e.target), n = t?.closest(`.${Y}`) ?? null;
		t !== null && n !== null && n.hasAttribute("data-ui-tabs-renamable") && (e.preventDefault(), this.startRename(t));
	}
	startRename(e) {
		let t = e.parentElement, n = e.querySelector(Bq) ?? e, r = e.closest(`.${XA}`);
		t === null || r === null || $A(r, "data-ui-unrenamable") || Iu({
			container: t,
			title: n,
			className: Lq,
			value: e.getAttribute("data-ui-tab-caption") ?? n.textContent?.trim() ?? "",
			commit: (t) => {
				e.setAttribute(hi, t), e.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			refocus: () => z(e)
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || rd(e)) return;
		let t = e.target.closest(`.${Fq}`), n = t?.closest(`.${Y}`) ?? null;
		if (t === null || n === null) return;
		if (e.key === "F2" && N(e)) {
			if (!n.hasAttribute("data-ui-tabs-renamable")) return;
			e.preventDefault(), this.startRename(t);
			return;
		}
		let r = t.closest(`.${XA}`);
		if (r === null || r.closest(`.${Y}`) !== n) return;
		if (e.key === "Delete" && N(e)) {
			if (!rJ(n, r)) return;
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
		let i = this.ownItems(n).map((e) => e.querySelector(`.${Fq}`)).filter((e) => e !== null), a = gd({
			key: e.key,
			items: i,
			current: t,
			axis: "horizontal"
		});
		if (a === null) return;
		e.preventDefault();
		let o = a.closest(`.${XA}`);
		o !== null && this.select(n, uJ(o)), a.focus();
	}
	moveByKey(e, t, n) {
		if (!e.hasAttribute("data-ui-tabs-draggable") || $A(t, "data-ui-undraggable") || k(t) || t.hasAttribute("data-ui-tab-pinned")) return;
		n.preventDefault();
		let r = this.ownItems(e), i = r[r.indexOf(t) + (n.key === "ArrowLeft" ? -1 : 1)];
		i === void 0 || i.hasAttribute("data-ui-tab-pinned") || (n.key === "ArrowLeft" ? ZA(t).after(ZA(i)) : ZA(t).before(ZA(i)), oj(t, this.ownItems(e).indexOf(t)));
	}
	handleDragStart(e) {
		let t = cJ(e);
		if (t === null) return;
		if ($A(t, "data-ui-undraggable") || k(t) || t.hasAttribute("data-ui-tab-pinned")) {
			e.preventDefault();
			return;
		}
		Cy(e, t.closest(`.${Y}`) ?? t, t, Vq, uJ(t));
		let n = ZA(t);
		this.dragStart = n.parentNode === null ? null : {
			parent: n.parentNode,
			next: n.nextSibling
		};
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Rq}`)?.closest(".ui-tab-item") ?? null, n = t?.closest(`.${Y}`) ?? null;
		if (t === null || n === null) return;
		let r = n.querySelector(`.${Vq}`);
		if (r === null || (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), r === t)) return;
		let i = t.querySelector(`.${Rq}`)?.getBoundingClientRect();
		if (i === void 0) return;
		let a = ZA(r), o = t.hasAttribute("data-ui-tab-pinned") ? eJ(n, a) : null, s = o ?? ZA(t), c = o === null && e.clientX < i.left + i.width / 2 ? s : s.nextElementSibling;
		c !== a && s.parentElement?.insertBefore(a, c);
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Y}`);
		t !== null && t.querySelector(`.${Vq}`) !== null && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"));
	}
	handleDragEnd(e) {
		let t = cJ(e);
		if (t === null) return;
		t.classList.remove(Vq);
		let n = this.dragStart;
		if (this.dragStart = null, e instanceof DragEvent && e.dataTransfer?.dropEffect === "none" && n !== null) {
			n.parent.insertBefore(ZA(t), n.next);
			return;
		}
		let r = ZA(t);
		if (n !== null && r.parentNode === n.parent && r.nextSibling === n.next) return;
		let i = t.closest(`.${Y}`);
		i !== null && oj(t, this.ownItems(i).indexOf(t));
	}
	select(e, t) {
		Bd(e, t, {
			attribute: mi,
			bindingAttribute: pi,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return Rd(e, `.${XA}`, `.${Y}`);
	}
};
function eJ(e, t) {
	let n = null;
	for (let r of Rd(e, `.${XA}`, `.${Y}`)) {
		let e = ZA(r);
		e !== t && r.hasAttribute("data-ui-tab-pinned") && (n = e);
	}
	return n;
}
function tJ(e, t) {
	let n = !t.some((e) => !$A(e, ce));
	e.hasAttribute("data-ui-tabs-none-removable") !== n && e.toggleAttribute(ye, n);
}
function nJ(e, t) {
	return !e.hasAttribute("data-ui-tabs-unremovable") && !$A(t, "data-ui-unremovable");
}
function rJ(e, t) {
	return e.hasAttribute("data-ui-tabs-removes") && nJ(e, t) && !t.hasAttribute("data-ui-tab-pinned") && !k(t);
}
function iJ(e, t) {
	return RI(LI(e.getAttribute(xe)), {
		pinned: t.hasAttribute(yi),
		renamable: !$A(t, le),
		removable: e.hasAttribute("data-ui-tabs-removes") && nJ(e, t)
	});
}
function aJ(e) {
	let t = e.getAttribute(b);
	return t === "tabs:separator" || t === "tabs:separator-remove" || e.querySelector(":scope > [data-ui-menu-item-kind=\"separator\"]") !== null;
}
function oJ(e) {
	let t = e.querySelector(`[${x}]`);
	return t === null ? [] : Array.from(t.children).filter((e) => e instanceof HTMLElement && e.hasAttribute("data-ui-key"));
}
function sJ(e) {
	return e.closest(`.${Iq}`) !== null || Fu(e) ? null : e.closest(`.${Rq}`)?.querySelector(`:scope > .${Fq}`) ?? null;
}
function cJ(e) {
	return e.target instanceof Element ? e.target.closest(`.${Rq}`)?.closest(".ui-tab-item") ?? null : null;
}
function lJ(e) {
	return { pinned: e.hasAttribute(yi) };
}
function uJ(e) {
	return e.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "";
}
//#endregion
//#region src/interactions/text-fold-engine.ts
var dJ = "button.ui-text__fold-toggle", fJ = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(dJ);
		t !== null && (e.preventDefault(), t.setAttribute("aria-expanded", t.getAttribute("aria-expanded") === "true" ? "false" : "true"));
	}
}, pJ = "ui-temporal-input__segments", mJ = "ui-temporal-input__segment", hJ = "ui-temporal-input__segment-literal", gJ = "ui-temporal-input__segment--empty", _J = "data-ui-temporal-segment", vJ = "data-ui-temporal-step-direction", yJ = "data-ui-temporal-segments-of", bJ = "--", xJ = /* @__PURE__ */ new Map([
	["ArrowUp", 1],
	["ArrowDown", -1],
	["PageUp", 10],
	["PageDown", -10]
]), SJ = class {
	options;
	root;
	edits = /* @__PURE__ */ new WeakMap();
	wheelTurn = 0;
	onWheel = (e) => this.handleWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${K}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(Ga(e.components, `.${K}`));
		}), V(this.root, `.${K}`, { attributeFilter: [...MM] }, (e) => this.applyAll(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("mousedown", (e) => this.handleStepperPress(e), !0);
	}
	applyAll(e) {
		for (let t of e) PM(t) === "time" && this.applySegments(t);
	}
	applySegments(e) {
		for (let t of e.querySelectorAll(`.${pJ}`)) this.applyContainer(e, t);
	}
	applyContainer(e, t) {
		let n = FM(e), r = BM(e), i = q(e, qM(t));
		t.getAttribute(yJ) !== n && (t.replaceChildren(...CJ(n).map((e) => TJ(e))), t.setAttribute(yJ, n));
		for (let n of t.children) {
			if (!(n instanceof HTMLElement)) continue;
			let t = n.getAttribute(_J);
			t === null ? n.textContent = DJ(n.dataset.token ?? "", n.dataset.formatted !== void 0, i, r) : (n.textContent = OJ(t, Number(n.dataset.width ?? "2"), i, r), n.classList.toggle(gJ, i === null), n.tabIndex = 0, kJ(n, t, i, j(e)));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !N(e, { shift: !0 })) return;
		let t = jJ(e.target);
		if (t === null) return;
		let n = t.closest(`.${K}`), r = t.getAttribute(_J), i = AJ(t), a = xJ.get(e.key);
		if (a !== void 0) e.preventDefault(), this.resetBuffer(n), this.applyStep(n, r, a, i);
		else if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") e.preventDefault(), this.resetBuffer(n), NJ(n, t, e.key);
		else if (e.key === "Backspace" || e.key === "Delete") e.preventDefault(), this.resetBuffer(n), nN(n, null, i), this.applySegments(n);
		else if (r === "meridiem") {
			let t = PJ(e.key, BM(n));
			t !== null && (e.preventDefault(), this.applyMeridiem(n, t, i));
		} else e.key.length === 1 && e.key >= "0" && e.key <= "9" && (e.preventDefault(), this.applyDigit(n, t, r, e.key, i));
	}
	handleFocusIn(e) {
		let t = jJ(e.target);
		t !== null && (this.wheelTurn = 0, t.addEventListener("wheel", this.onWheel, { passive: !1 }));
	}
	handleWheel(e) {
		let t = jJ(e.currentTarget);
		if (t === null || t !== document.activeElement || e.deltaY === 0) return;
		e.preventDefault();
		let { steps: n, carried: r } = hx(this.wheelTurn, mx(e).y);
		if (this.wheelTurn = r, n === 0) return;
		let i = t.closest(`.${K}`);
		this.resetBuffer(i);
		for (let e = 0; e < Math.abs(n); e++) this.applyStep(i, t.getAttribute(_J), n < 0 ? 1 : -1, AJ(t));
	}
	handleStepperPress(e) {
		e.target instanceof Element && e.target.closest(`[${vJ}]`) !== null && e.preventDefault();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${vJ}]`);
		if (t === null) return;
		let n = t.closest(`.${K}`);
		if (n === null || j(n)) return;
		e.preventDefault();
		let r = MJ(n) ?? n.querySelector(`.${mJ}`);
		r !== null && (r.focus(), this.resetBuffer(n), this.applyStep(n, r.getAttribute(_J), t.getAttribute(vJ) === "up" ? 1 : -1, AJ(r)));
	}
	handleFocusOut(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${mJ}`) : null;
		if (t === null) return;
		t.removeEventListener("wheel", this.onWheel);
		let n = t.closest(`.${K}`);
		n !== null && this.resetBuffer(n);
	}
	applyStep(e, t, n, r) {
		if (t === "meridiem") {
			let t = q(e, r), n = t !== null && t.getHours() >= 12 ? "am" : "pm";
			this.write(e, pN(e, IJ(this.baseValue(e, r), n)), r);
			return;
		}
		let i = this.baseValue(e, r), a = FJ(t), o = LM(IM(e), a) * n, s = a === "hour" ? 24 : 60, c = ((RM(i, a) + o) % s + s) % s;
		this.write(e, pN(e, zM(i, a, c)), r);
	}
	applyDigit(e, t, n, r, i) {
		let a = this.editState(e), o = n === "hour" ? 23 : n === "hour12" ? 12 : 59, s = +(n === "hour12"), c = (a.unit === n ? a.buffer : "") + r;
		Number(c) > o && (c = r);
		let l = Number(c), u = c.length >= 2 || l * 10 > o;
		if (a.unit = n, a.buffer = u ? "" : c, l >= s) {
			let t = this.baseValue(e, i);
			this.write(e, n === "hour12" ? zM(t, "hour", LJ(l, t.getHours() >= 12)) : zM(t, FJ(n), l), i);
		}
		u && NJ(e, t, "ArrowRight");
	}
	applyMeridiem(e, t, n) {
		this.write(e, IJ(this.baseValue(e, n), t), n);
	}
	baseValue(e, t) {
		return q(e, t) ?? fN(e);
	}
	write(e, t, n) {
		nN(e, t, n), uN(e), this.applySegments(e);
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
function CJ(e) {
	let t = [];
	for (let n = 0; n < e.length;) {
		let r = Vs(e, n);
		r === null ? (t.push({
			kind: "literal",
			token: e[n],
			formatted: !1
		}), n++) : (t.push(wJ(r)), n += r.length);
	}
	return t;
}
function wJ(e) {
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
function TJ(e) {
	if (e.kind === "literal") {
		let t = document.createElement("span");
		return t.className = hJ, t.dataset.token = e.token, e.formatted && (t.dataset.formatted = ""), t;
	}
	let t = document.createElement("span");
	return t.className = mJ, t.tabIndex = 0, t.setAttribute("role", "spinbutton"), t.setAttribute(_J, e.unit), t.dataset.width = String(e.width), EJ(t, e.unit), t;
}
function EJ(e, t) {
	if (t === "meridiem") {
		O.write(e, "aria-label", "ui.picker.meridiem");
		return;
	}
	let n = FJ(t);
	O.write(e, "aria-label", n === "hour" ? "ui.picker.hours" : n === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"), e.setAttribute("aria-valuemin", t === "hour12" ? "1" : "0"), e.setAttribute("aria-valuemax", t === "hour12" ? "12" : t === "hour" ? "23" : "59");
}
function DJ(e, t, n, r) {
	return t && n !== null ? Is(n, e, r) : e;
}
function OJ(e, t, n, r) {
	if (n === null) return bJ;
	if (e === "meridiem") return n.getHours() < 12 ? r.amDesignator : r.pmDesignator;
	let i = e === "hour12" ? cc(n.getHours()) : RM(n, FJ(e));
	return String(i).padStart(t, "0");
}
function kJ(e, t, n, r) {
	r !== e.hasAttribute("aria-readonly") && (r ? e.setAttribute("aria-readonly", "true") : e.removeAttribute("aria-readonly")), t === "meridiem" || n === null ? e.removeAttribute("aria-valuenow") : e.setAttribute("aria-valuenow", String(t === "hour12" ? cc(n.getHours()) : RM(n, FJ(t))));
}
function AJ(e) {
	return qM(e.closest(`.${pJ}`));
}
function jJ(e) {
	let t = e instanceof Element ? e.closest(`.${mJ}`) : null;
	if (t === null) return null;
	let n = t.closest(`.${K}`);
	return n === null || j(n) ? null : t;
}
function MJ(e) {
	return document.activeElement instanceof HTMLElement && document.activeElement.closest(".ui-temporal-input") === e ? document.activeElement.closest(`.${mJ}`) : null;
}
function NJ(e, t, n) {
	gd({
		key: n,
		items: [...e.querySelectorAll(`.${mJ}`)],
		current: t,
		axis: "horizontal",
		loop: !1
	})?.focus();
}
function PJ(e, t) {
	let n = e.toLowerCase();
	return n.length === 1 ? n === "a" || n === t.amDesignator.charAt(0).toLowerCase() ? "am" : n === "p" || n === t.pmDesignator.charAt(0).toLowerCase() ? "pm" : null : null;
}
function FJ(e) {
	return e === "hour12" || e === "meridiem" ? "hour" : e;
}
function IJ(e, t) {
	return zM(e, "hour", LJ(cc(e.getHours()), t === "pm"));
}
function LJ(e, t) {
	let n = e % 12;
	return t ? n + 12 : n;
}
//#endregion
//#region src/interactions/timestamp-engine.ts
var RJ = "datetime", zJ = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.apply(this.root.querySelectorAll(`.${Ct}`), O.temporal === null), O.onTable(() => this.apply(this.root.querySelectorAll(`.${Ct}`))), e.propertyPatchEngine?.addValueChangeHandler((e) => this.apply(Ga(e.components, `.${Ct}`))), V(this.root, `.${Ct}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [RJ],
			relevant: (e) => e.type === "attributes" || !(e.target instanceof Element && e.target.closest(".ui-timestamp") !== null)
		}, (e) => this.apply(e));
	}
	apply(e, t = !1) {
		let n = {
			temporal: O.temporal,
			language: O.language || document.documentElement.lang
		}, r = Date.now(), i = !1;
		for (let a of e) {
			let e = fc(a.getAttribute(Tt)), o = dc(a.getAttribute(RJ)), s = a.querySelector(`.${wt}`);
			if (s === null || t && !BJ(e, o, r)) continue;
			let c = o === null ? "" : gc(o, e, n, r);
			s.textContent !== c && (s.textContent = c), i ||= pc(e) && o !== null;
		}
		i && Zc(this.refreshRelative);
	}
	refreshRelative = () => {
		let e = [...this.root.querySelectorAll(`.${Ct}:is([${Tt}="relative"], [${Tt}="relative-date"])`)];
		return e.length !== 0 && (this.apply(e), !0);
	};
};
function BJ(e, t, n) {
	return e === "relative" || e === "relative-date" && t !== null && _c(t, n) !== null;
}
//#endregion
//#region src/interactions/file-tile-engine.ts
var VJ = `.${Et}`, HJ = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), O.onChange(() => this.applyAll()), e.propertyPatchEngine?.addValueChangeHandler((e) => UJ(Ga(e.components, VJ))), V(this.root, VJ, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [
				At,
				jt,
				Mt,
				Nt
			],
			relevant: (e) => e.type === "attributes" || !(e.target instanceof Element && e.target.closest(VJ) !== null)
		}, UJ);
	}
	applyAll() {
		UJ(this.root.querySelectorAll(VJ));
	}
};
function UJ(e) {
	let t = O.language || document.documentElement.lang;
	for (let n of e) qb(n, t);
}
//#endregion
//#region src/items/item-reveal.ts
var WJ = /* @__PURE__ */ new Map();
function GJ(e) {
	if (e.hasAttribute("data-ui-items-host")) return e;
	for (let t of e.querySelectorAll(`[${x}]`)) if (t.closest("[data-ui-id]") === e) return t;
	return null;
}
function KJ(e, t, n, r) {
	let i = qJ(e, t);
	return i !== null && (WJ.set(e, {
		key: t,
		block: n
	}), JJ(e, i, n, r), !0);
}
function qJ(e, t) {
	for (let n of e.children) if (n.getAttribute("data-ui-key") === t) return n;
	return null;
}
function JJ(e, t, n, r) {
	let i = t.previousElementSibling, a = i !== null && i.hasAttribute("data-ui-group-header") && i.getAttribute("data-ui-group-anchor") === t.getAttribute("data-ui-key") ? i : null, o = Sd(e);
	if (o.scrollHeight <= o.clientHeight) {
		(a ?? t).scrollIntoView({
			behavior: r,
			block: n === "Start" ? "start" : n === "End" ? "end" : n === "Center" ? "center" : "nearest"
		});
		return;
	}
	let s = o.getBoundingClientRect().top + o.clientTop, c = o.clientHeight, l = (a ?? t).getBoundingClientRect().top, u = t.getBoundingClientRect().bottom, d = YJ(n, l - s, u - s, c);
	d !== 0 && (r === "smooth" ? o.scrollTo({
		top: o.scrollTop + d,
		behavior: r
	}) : o.scrollTop += d);
}
function YJ(e, t, n, r) {
	switch (e) {
		case "Center": return (t + n - r) / 2;
		case "End": return n - r;
		case "Nearest": return t >= 0 && n <= r ? 0 : t < 0 || n - t > r ? t : n - r;
		default: return t;
	}
}
function XJ(e) {
	let t = WJ.get(e);
	if (t === void 0) return;
	let n = qJ(e, t.key);
	n === null ? WJ.delete(e) : JJ(e, n, t.block, "auto");
}
function ZJ(e) {
	if (WJ.size !== 0 && e instanceof Node) for (let t of [...WJ.keys()]) (!t.isConnected || Sd(t).contains(e)) && WJ.delete(t);
}
//#endregion
//#region src/interactions/scroll-anchor-engine.ts
var QJ = "data-ui-scroll-anchor", $J = "End", eY = `[${QJ}="${$J}"]`, tY = 4, nY = [
	"wheel",
	"touchstart",
	"pointerdown",
	"keydown"
], rY = /* @__PURE__ */ new WeakSet();
function iY(e) {
	rY.add(e);
}
function aY(e) {
	ZJ(e);
	for (let t = e.closest(eY); t !== null; t = t.parentElement?.closest(eY) ?? null) rY.delete(t);
}
var oY = class {
	root;
	pinned = /* @__PURE__ */ new WeakMap();
	resizes = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null;
	watched = /* @__PURE__ */ new WeakMap();
	watchedContainers = /* @__PURE__ */ new WeakSet();
	heights = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0);
		for (let e of nY) this.root.addEventListener(e, (e) => sY(e), {
			capture: !0,
			passive: !0
		});
		V(this.root, `[${QJ}="${$J}"]`, {
			childList: !0,
			characterData: !0,
			attributeFilter: [un]
		}, (e) => this.followEach(e)), this.followContent();
	}
	handleScroll(e) {
		let t = e.target;
		t instanceof Element && lY(t) && this.pinned.set(t, rY.has(t) || dY(t) && !uY(t));
	}
	followContent() {
		this.followEach(this.root.querySelectorAll(`[${QJ}="${$J}"]`));
	}
	followEach(e) {
		for (let t of e) this.watchRows(t), rY.has(t) ? (this.pinned.set(t, !0), cY(t)) : this.pinned.get(t) !== !1 && (uY(t) ? this.pinned.set(t, !1) : (this.pinned.set(t, !0), cY(t)));
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
			if (!e.isConnected || r === null || !lY(r)) {
				this.forget(e);
				continue;
			}
			let i = e.getBoundingClientRect(), a = this.heights.get(e);
			if (this.heights.set(e, i.height), a === i.height) continue;
			let o = a !== void 0 && i.top + a <= r.getBoundingClientRect().top ? i.height - a : 0;
			t.set(r, (t.get(r) ?? 0) + o);
		}
		for (let [e, n] of t) this.followsEnd(e) ? cY(e) : n !== 0 && e.getAttribute("data-ui-host-mode") !== "virtualized" && getComputedStyle(e).overflowAnchor === "none" && (e.scrollTop += n);
	}
	followOwnBox(e) {
		!e.isConnected || !lY(e) ? (this.watchedContainers.delete(e), this.resizes?.unobserve(e)) : this.followsEnd(e) && cY(e);
	}
	followsEnd(e) {
		return rY.has(e) || this.pinned.get(e) !== !1 && !uY(e);
	}
	forget(e) {
		this.resizes?.unobserve(e), this.heights.delete(e);
	}
};
function sY(e) {
	ZJ(e.target);
	let t = e.target instanceof Element ? e.target.closest(eY) : null;
	t !== null && rY.delete(t);
}
function cY(e) {
	e.scrollTop = e.scrollHeight;
}
function lY(e) {
	return e.getAttribute(QJ) === $J;
}
function uY(e) {
	return Ik(e, an);
}
function dY(e) {
	return e.scrollHeight - e.scrollTop - e.clientHeight <= tY;
}
//#endregion
//#region src/interactions/text-selection-engine.ts
var fY = `${cd}, [role='menu'], [role='tab']`, pY = class {
	selection;
	selects;
	constructor(e = {}) {
		let t = e.root ?? document;
		this.selection = e.selection ?? (() => document.getSelection()), this.selects = e.selects ?? mY, t.addEventListener("pointerdown", (e) => this.handlePointerDown(e), { capture: !0 });
	}
	handlePointerDown(e) {
		if (e.button !== 0 || e.pointerType === "touch" || !(e.target instanceof Element)) return;
		let t = this.selection();
		t === null || t.isCollapsed || e.target.closest(fY) !== null || this.selects(e.target) || t.removeAllRanges();
	}
};
function mY(e) {
	let t = getComputedStyle(e);
	return (t.getPropertyValue("user-select") || t.getPropertyValue("-webkit-user-select")) !== "none";
}
//#endregion
//#region src/interactions/scroll-group-mapping.ts
function hY(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.top(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = _Y(e, a, n), s = _Y(e, a + 1, n);
	return vY(t, o.top, s.top, o.line, s.line);
}
function gY(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.line(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = _Y(e, a, n), s = _Y(e, a + 1, n);
	return vY(t, o.line, s.line, o.top, s.top);
}
function _Y(e, t, n) {
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
function vY(e, t, n, r, i) {
	return n <= t ? r : r + Math.min(1, Math.max(0, (e - t) / (n - t))) * (i - r);
}
//#endregion
//#region src/interactions/scroll-group-engine.ts
var yY = 250, bY = class {
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
		let r = this.memberScrolledBy(t), i = r?.getAttribute(Jt);
		if (r != null && i != null && i.length !== 0) for (let e of this.membersOf(i)) e !== r && e.isConnected && this.follow(t, this.viewportOf(e));
	}
	membersOf(e) {
		let t = performance.now(), n = this.members.get(e);
		if (n !== void 0 && t - n.at < yY && n.found.every((e) => e.isConnected)) return n.found;
		let r = [...this.root.querySelectorAll(`[${Jt}="${C(e)}"]`)];
		return this.members.set(e, {
			found: r,
			at: t
		}), r;
	}
	memberScrolledBy(e) {
		for (let t = e.closest(`[${Jt}]`); t !== null; t = t.parentElement?.closest("[data-ui-scroll-group]") ?? null) if (this.viewportOf(t) === e) return t;
		return null;
	}
	viewportOf(e) {
		let t = this.viewports.get(e);
		if (t !== void 0 && t.isConnected && e.contains(t)) return t;
		let n = xY(e, "data-ui-scroll-viewport") ?? SY(e) ?? e;
		return this.viewports.set(e, n), n;
	}
	follow(e, t) {
		let n = e.scrollHeight - e.clientHeight, r = t.scrollHeight - t.clientHeight;
		if (r <= 0 && t.scrollWidth <= t.clientWidth) return;
		let i = n > 0 ? wY(e) : null, a = i === null ? null : wY(t), o;
		if (n <= 0 || e.scrollTop <= 0) o = 0;
		else if (e.scrollTop >= n - 1) o = r;
		else if (i !== null && a !== null) {
			let t = Math.max(i.endLine, a.endLine);
			o = gY(a, hY(i, e.scrollTop, t), t);
		} else o = e.scrollTop / n * r;
		let s = i === null && a === null ? CY(e.scrollLeft, e.scrollWidth - e.clientWidth) * Math.max(0, t.scrollWidth - t.clientWidth) : t.scrollLeft;
		o = Math.round(Math.min(Math.max(0, o), Math.max(0, r))), !(Math.abs(t.scrollTop - o) < 1 && Math.abs(t.scrollLeft - s) < 1) && (t.scrollTo({
			top: o,
			left: s,
			behavior: "instant"
		}), this.driven.set(t, t.scrollTop));
	}
};
function xY(e, t) {
	for (let n of e.querySelectorAll(`[${t}]`)) if (n.closest("[data-ui-id]") === e) return n;
	return null;
}
function SY(e) {
	let t = e.hasAttribute("data-ui-items-host") ? e : xY(e, x);
	return t === null ? null : Sd(t);
}
function CY(e, t) {
	return t > 0 ? e / t : 0;
}
function wY(e) {
	let t = e.getBoundingClientRect().top + e.clientTop - e.scrollTop, n = (e) => e.getBoundingClientRect().top - t, r = e.querySelector(`[${Yt}]`);
	if (r !== null && r.children.length > 0) return {
		count: r.children.length,
		line: (e) => e + 1,
		top: (e) => n(r.children[e]),
		endLine: r.children.length + 1,
		scrollHeight: e.scrollHeight
	};
	let i = e.querySelectorAll(`[${Xt}]`);
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
var TY = ".ui-tab-item__caption, .ui-split-button:not([data-ui-split-mode='menu']) > :is(.ui-split-button__main, .ui-split-button__toggle)", EY = `.${Fi}, .ui-action, .${Rn}, .ui-select__option, .ui-language-switcher__choice, .ui-pager__size-choice, .ui-color-input__swatch--button, .ui-expander__header, ${TY}`, DY = ".ui-expander__header", OY = "ui-key-value-action__row", kY = `${EY}, ${`${Ud}, .${OY}`}`, AY = "ui-pressing", jY = "ui-press-held", MY = "ui-press-placed", NY = class {
	clicks;
	waves;
	presses = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		let t = e.root ?? document;
		this.clicks = e.clicks ?? (() => !1), this.waves = e.waves ?? !0, t.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), t.addEventListener("pointerup", (e) => this.release(e, !1), !0), t.addEventListener("pointercancel", (e) => this.release(e, !0), !0), t.addEventListener("dragstart", () => this.finishAll(), !0), t.addEventListener(OF, (e) => this.handleHold(e)), t.addEventListener(kF, (e) => this.handleHoldEnd(e));
	}
	handlePointerDown(e) {
		if (!(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		this.end(e.pointerId, !0);
		let t = this.pressedElement(e.target);
		t !== null && this.moves(t) && (this.start(e.pointerId, t, e.clientX, e.clientY, B.ripple, !1), t.classList.add(jY));
	}
	moves(e) {
		return this.waves && typeof e.animate == "function" && !gh();
	}
	start(e, t, n, r, i, a) {
		for (let [e, n] of this.presses) n.element === t && this.finish(e, n);
		let o = t.getBoundingClientRect(), s = n - o.left, c = r - o.top, l = Math.hypot(Math.max(s, o.width - s), Math.max(c, o.height - c)), { wave: u, ink: d } = PY(s - t.clientLeft, c - t.clientTop, l);
		t.classList.add(AY), t.append(u);
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
		if (t === null || !(n instanceof HTMLElement) || k(n) || t.target.closest(DY) !== null) return;
		let r = this.presses.get(t.pointerId);
		if (r !== void 0 && r.fade === null) {
			this.retime(r, performance.now() + t.duration);
			return;
		}
		let i = this.moves(n);
		(i || this.pressedElement(t.target) === null) && (this.start(t.pointerId, n, t.clientX, t.clientY, i ? t.duration : null, !0), getComputedStyle(n).position === "static" && n.classList.add(MY));
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
		let t = e.closest(TY) ?? e.closest(kY);
		if (t === null || k(t) || t.matches(DY)) return null;
		let n = e.closest(Mi);
		return n !== null && n !== t && t.contains(n) ? null : t.matches(EY) ? t : this.pressedRow(t, e);
	}
	pressedRow(e, t) {
		if (hd(t, e) !== null || A(e) || e.hasAttribute("data-ui-row-editing")) return null;
		let n = e.closest(I), r = n !== null && !e.classList.contains(OY) && !n.hasAttribute("data-ui-no-row-select") && (n.getAttribute("data-ui-selection") === "one" || n.getAttribute("data-ui-selection") === "many"), i = e.classList.contains("ui-tree__row") && Cl(e, "data-ui-unselectable");
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
		n.element.classList.remove(jY);
		let r = performance.now(), i = Math.max(0, n.fills - r), a = t ? 0 : Math.min(i, B.fast);
		a > 0 && this.retime(n, r + a), n.fade = n.wave.animate([{ opacity: 1 }, { opacity: 0 }], {
			duration: B.normal,
			delay: a,
			easing: B.exit,
			fill: "forwards"
		}), n.fade.addEventListener("finish", () => this.finish(e, n));
	}
	finish(e, t) {
		t.grow?.cancel(), t.fade?.cancel(), t.wave.remove(), t.element.classList.remove(AY, jY, MY), this.presses.get(e) === t && this.presses.delete(e);
	}
};
function PY(e, t, n) {
	let r = document.createElement("span"), i = document.createElement("span");
	return r.className = jg, r.setAttribute("aria-hidden", "true"), i.className = Mg, i.style.setProperty("left", `${e - n}px`), i.style.setProperty("top", `${t - n}px`), i.style.setProperty("width", `${n * 2}px`), i.style.setProperty("height", `${n * 2}px`), r.append(i), {
		wave: r,
		ink: i
	};
}
//#endregion
//#region src/interactions/overlay-scrollbar-engine.ts
var FY = "ui-overlay-scrollbar", IY = "ui-overlay-scrollbar__box", LY = "ui-overlay-scrollbar__thumb", RY = "ui-overlay-scrollbar--shown", zY = "ui-overlay-scrollbar__thumb--held", BY = "ui-overlay-scrollbar__arrow", VY = "ui-overlay-scrollbar--near", HY = "(hover: hover) and (forced-colors: none)", UY = "--ui-overlay-thumb", WY = "--ui-scroll-hung", GY = 12, KY = 2, qY = 24, JY = 12, YY = 80, XY = 40, ZY = 400, QY = 50, $Y = 900, eX = 400, tX = 16, nX = class {
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
		this.doc = e, this.layer = e.createElement("div"), this.layer.className = FY, this.layer.setAttribute("aria-hidden", "true"), this.layer.setAttribute("popover", "manual"), this.bars = {
			y: this.createBar(e, "y"),
			x: this.createBar(e, "x")
		}, this.layer.addEventListener("mousedown", (e) => e.preventDefault()), this.layer.addEventListener("contextmenu", (e) => e.preventDefault()), e.body.append(this.layer), u_((e) => e.includes(this.bars.y.box) ? this.bars.y.scroller : e.includes(this.bars.x.box) ? this.bars.x.scroller : null), this.media = window.matchMedia(HY), this.active = this.media.matches, this.media.addEventListener("change", () => this.follow()), this.active && this.raise(), e.addEventListener("pointermove", (e) => this.handlePointerMove(e), {
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
		return n.className = `${IY} ${IY}--${t}`, r.className = `${LY} ${LY}--${t}`, n.append(i, r, a), this.layer.append(n), r.addEventListener("pointerdown", (e) => this.grab(e, t)), r.addEventListener("pointermove", (e) => this.pull(e)), r.addEventListener("pointerup", (e) => this.release(e)), r.addEventListener("pointercancel", (e) => this.release(e)), r.addEventListener("lostpointercapture", (e) => this.lose(e)), r.addEventListener("wheel", (e) => this.forwardWheel(e, t), { passive: !1 }), {
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
		return r.className = `${BY} ${BY}--${n < 0 ? "back" : "forward"}`, r.addEventListener("pointerdown", (e) => this.step(e, t, n)), r.addEventListener("pointerup", () => this.stopStepping()), r.addEventListener("pointercancel", () => this.stopStepping()), r.addEventListener("lostpointercapture", () => this.stopStepping()), r.addEventListener("wheel", (e) => this.forwardWheel(e, t), { passive: !1 }), r;
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
		t !== null && (t === this.bars.y.scroller || t === this.bars.x.scroller ? ((this.scrolling || this.drag !== null || this.readerScrolled(e)) && this.flash(), this.schedule(), !this.hovered && this.drag === null && this.settleLater()) : this.hovered || this.drag !== null ? (this.repick = this.hovered && this.drag === null, this.schedule()) : this.readerScrolled(e) && (this.pick(cX(t, "y") ? t : null, cX(t, "x") ? t : null, !1), this.flash(), this.settleLater(), this.schedule()));
	}
	noteInput(e) {
		this.inputAt = e.timeStamp;
	}
	readerScrolled(e) {
		return e.timeStamp - this.inputAt < eX;
	}
	flash() {
		this.scrolling = !0, window.clearTimeout(this.fade), this.fade = window.setTimeout(() => {
			this.fade = 0, this.scrolling = !1, this.paint();
		}, $Y), this.paint();
	}
	approach() {
		let e = !1;
		for (let t of [this.bars.y, this.bars.x]) {
			let n = this.point !== null && t.view !== null && rX(this.point, t.view, t.axis, t.rtl);
			e ||= n !== t.near, t.near = n;
		}
		e && this.paint();
	}
	paint() {
		for (let e of [this.bars.y, this.bars.x]) {
			let t = this.drag?.axis === e.axis || this.stepping === e.axis;
			e.box.classList.toggle(RY, e.view !== null && (this.scrolling || e.near || t)), e.box.classList.toggle(VY, e.view !== null && (e.near || t));
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
		}, $Y);
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
		e !== null && this.layer.contains(e) || (this.target = e, this.pick(iX(e, "y"), iX(e, "x"), !0));
	}
	measure(e) {
		let t = this.bars[e].scroller;
		if (t === null || !t.isConnected || !cX(t, e)) return null;
		let n = fX(t);
		if (n === null) return null;
		let r = this.bars[e === "y" ? "x" : "y"].scroller === t, i = e === "y" ? dX(t) : lX(t);
		return {
			view: n,
			thumb: mX(t, e, i, r),
			arrows: hX(t, e, i, r),
			rtl: xX(t)
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
		}), SX(e.thumb, r, n), e.back.hidden = i === null, e.forward.hidden = i === null, i !== null && (SX(e.back, i.back, n), SX(e.forward, i.forward, n));
	}
	step(e, t, n) {
		let r = this.bars[t].scroller;
		if (e.button !== 0 || r === null || this.drag !== null) return;
		aY(r), e.currentTarget.setPointerCapture(e.pointerId), this.stopStepping(), this.stepping = t;
		let i = () => {
			r.isConnected ? (r.scrollBy(t === "y" ? { top: n * XY } : { left: n * XY }), this.flash()) : this.stopStepping();
		};
		i(), this.repeat = window.setTimeout(() => {
			this.repeat = window.setInterval(i, QY);
		}, ZY);
	}
	stopStepping() {
		window.clearTimeout(this.repeat), window.clearInterval(this.repeat), this.repeat = 0, this.stepping !== null && (this.stepping = null, this.paint());
	}
	grab(e, t) {
		let n = this.bars[t].scroller;
		if (e.button !== 0 || n === null) return;
		let r = t === "x" && xX(n), i = _X(n, t, lX(n), this.bars[t === "y" ? "x" : "y"].scroller === n, r), a = i.length - i.thumb;
		aY(n), this.bars[t].thumb.setPointerCapture(e.pointerId), this.bars[t].thumb.classList.add(zY), this.drag = {
			axis: t,
			scroller: n,
			pointerId: e.pointerId,
			from: t === "y" ? e.clientY : e.clientX,
			scroll: bX(n, t),
			ratio: a > 0 ? i.max / a : 0,
			rtl: r
		};
	}
	pull(e) {
		let t = this.drag;
		if (t === null || e.pointerId !== t.pointerId || !t.scroller.isConnected) return;
		let n = (t.axis === "y" ? e.clientY : e.clientX) - t.from;
		t.axis === "y" ? t.scroller.scrollTop = yX(t.scroll, n, t.ratio, !1) : t.scroller.scrollLeft = yX(t.scroll, n, t.ratio, t.rtl);
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
			e.preventDefault(), t.axis === "y" ? t.scroller.scrollTop = yX(t.scroll, 0, t.ratio, !1) : t.scroller.scrollLeft = yX(t.scroll, 0, t.ratio, t.rtl), this.endDrag();
			try {
				this.bars[t.axis].thumb.releasePointerCapture(t.pointerId);
			} catch {}
		}
	}
	endDrag() {
		this.drag !== null && this.bars[this.drag.axis].thumb.classList.remove(zY), this.drag = null, this.paint();
	}
	forwardWheel(e, t) {
		let n = this.bars[t].scroller;
		if (n === null || e.ctrlKey) return;
		let r = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? "y" : "x", i = e.deltaX * sX(e, n, "x"), a = e.deltaY * sX(e, n, "y"), o = aX(n, r, r === "y" ? a : i);
		e.preventDefault(), o !== null && (aY(o), o.scrollBy({
			left: i,
			top: a
		}));
	}
};
function rX(e, t, n, r) {
	return n === "x" ? e.x >= t.left && e.x <= t.right && e.y <= t.bottom && e.y > t.bottom - 28 : e.y < t.top || e.y > t.bottom ? !1 : r ? e.x >= t.left && e.x < t.left + 28 : e.x <= t.right && e.x > t.right - 28;
}
function iX(e, t) {
	for (let n = e; n !== null; n = n.parentElement) if (cX(n, t)) return n;
	return null;
}
function aX(e, t, n) {
	for (let r = e; r !== null; r = iX(r.parentElement, t)) if (cX(r, t) && oX(r, t, n)) return r;
	return null;
}
function oX(e, t, n) {
	let r = t === "y" ? e.scrollHeight - e.clientHeight : e.scrollWidth - e.clientWidth, i = bX(e, t), a = t === "x" && xX(e) ? n < 0 : n > 0;
	return n !== 0 && (a ? i < r - 1 : i > 0);
}
function sX(e, t, n) {
	return e.deltaMode === WheelEvent.DOM_DELTA_LINE ? tX : e.deltaMode === WheelEvent.DOM_DELTA_PAGE ? n === "y" ? t.clientHeight : t.clientWidth : 1;
}
function cX(e, t) {
	if ((t === "y" ? e.scrollHeight - e.clientHeight : e.scrollWidth - e.clientWidth) <= 1) return !1;
	let n = e === document.scrollingElement, r = getComputedStyle(n ? document.documentElement : e), i = t === "y" ? r.overflowY : r.overflowX;
	return n ? i !== "hidden" && i !== "clip" : (i === "auto" || i === "scroll") && r.getPropertyValue(UY).trim() !== "none";
}
function lX(e) {
	if (e === document.scrollingElement) return CX(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
	let t = e.getBoundingClientRect(), n = e instanceof HTMLElement ? e : null, r = uX(t.width, n?.offsetWidth), i = uX(t.height, n?.offsetHeight), a = t.left + e.clientLeft * r, o = t.top + e.clientTop * i;
	return CX(a, o, a + e.clientWidth * r, o + e.clientHeight * i);
}
function uX(e, t) {
	return t === void 0 || t <= 0 || e <= 0 ? 1 : e / t;
}
function dX(e) {
	let t = lX(e);
	if (e === document.scrollingElement) return t;
	let n = Number.parseFloat(getComputedStyle(e).getPropertyValue(WY));
	return n > 0 ? xX(e) ? CX(t.left - n, t.top, t.right, t.bottom) : CX(t.left, t.top, t.right + n, t.bottom) : t;
}
function fX(e) {
	let t = dX(e);
	for (let n = e; n !== null && n !== document.documentElement; n = n.parentElement) {
		let r = getComputedStyle(n);
		if (n !== e && (r.overflowX !== "visible" || r.overflowY !== "visible") && (t = wX(t, pX(n, r))), r.position === "fixed" || n.matches(":popover-open, dialog:modal")) break;
	}
	return t = wX(t, CX(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight)), t.width > 0 && t.height > 0 ? t : null;
}
function pX(e, t) {
	let n = lX(e), r = Number.parseFloat((t.overflowClipMargin ?? "").split(" ").at(-1) ?? "") || 0, i = t.overflowX === "visible" ? Infinity : t.overflowX === "clip" ? r : 0, a = t.overflowY === "visible" ? Infinity : t.overflowY === "clip" ? r : 0;
	return CX(n.left - i, n.top - a, n.right + i, n.bottom + a);
}
function mX(e, t, n, r) {
	let i = xX(e), a = _X(e, t, n, r, i), o = a.max > 0 ? bX(e, t) / a.max * (a.length - a.thumb) : 0;
	return t === "y" ? {
		left: i ? n.left : n.right - GY,
		top: a.start + o,
		width: GY,
		height: a.thumb
	} : {
		left: i ? a.start + a.length - a.thumb - o : a.start + o,
		top: n.bottom - GY,
		width: a.thumb,
		height: GY
	};
}
function hX(e, t, n, r) {
	let i = xX(e), a = _X(e, t, n, r, i);
	if (a.arrow === 0) return null;
	if (t === "y") {
		let e = i ? n.left : n.right - GY;
		return {
			back: {
				left: e,
				top: a.start - JY,
				width: GY,
				height: JY
			},
			forward: {
				left: e,
				top: a.start + a.length,
				width: GY,
				height: JY
			}
		};
	}
	let o = n.bottom - GY;
	return {
		back: {
			left: a.start - JY,
			top: o,
			width: JY,
			height: GY
		},
		forward: {
			left: a.start + a.length,
			top: o,
			width: JY,
			height: GY
		}
	};
}
function gX(e, t, n, r) {
	return (t === "y" ? e.height : e.width) - r - 4 - (n ? GY : 0) >= YY ? JY : 0;
}
function _X(e, t, n, r, i) {
	let a = t === "y" ? vX(e) : {
		top: 0,
		bottom: 0
	}, o = gX(n, t, r, a.top + a.bottom), s = (t === "y" ? n.top + a.top : n.left) + KY + o + (r && i && t === "x" ? GY : 0), c = (t === "y" ? n.height - a.top - a.bottom : n.width) - 4 - 2 * o - (r ? GY : 0), l = t === "y" ? e.clientHeight : e.clientWidth, u = t === "y" ? e.scrollHeight : e.scrollWidth;
	return {
		start: s,
		length: c,
		thumb: Math.min(c, Math.max(qY, c * l / u)),
		max: u - l,
		arrow: o
	};
}
function vX(e) {
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
function yX(e, t, n, r) {
	return r ? -(e - t * n) : e + t * n;
}
function bX(e, t) {
	return t === "y" ? e.scrollTop : Math.abs(e.scrollLeft);
}
function xX(e) {
	return getComputedStyle(e).direction === "rtl";
}
function SX(e, t, n) {
	Object.assign(e.style, {
		left: `${t.left - n.left}px`,
		top: `${t.top - n.top}px`,
		width: `${t.width}px`,
		height: `${t.height}px`
	});
}
function CX(e, t, n, r) {
	return {
		left: e,
		top: t,
		right: n,
		bottom: r,
		width: Math.max(0, n - e),
		height: Math.max(0, r - t)
	};
}
function wX(e, t) {
	return CX(Math.max(e.left, t.left), Math.max(e.top, t.top), Math.min(e.right, t.right), Math.min(e.bottom, t.bottom));
}
//#endregion
//#region src/interactions/refusal-engine.ts
var TX = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"Home",
	"End",
	"PageUp",
	"PageDown"
]), EX = [
	"click",
	"dblclick",
	"auxclick",
	"dragstart"
], DX = `.${Ci}, .${wi}`, OX = RegExp(`(^|\\s)(${Ci}|${wi})(\\s|$)`), kX = RegExp(`(^|\\s)${Ti}(\\s|$)`), AX = "[type='range']", jX = /* @__PURE__ */ new WeakSet(), MX = /* @__PURE__ */ new WeakSet();
function NX(e = document) {
	let t = e === document ? window : e;
	for (let e of EX) t.addEventListener(e, VX, !0);
	t.addEventListener("keydown", UX, !0), t.addEventListener("change", WX, !0), t.addEventListener("pointerdown", GX, !0), t.addEventListener("mousedown", GX, !0), RX(e.querySelectorAll(DX)), IX(e.querySelectorAll(`[${Si}]`)), FX(e.querySelectorAll(AX)), new MutationObserver((e) => {
		for (let t of e) PX(t);
	}).observe(e, {
		subtree: !0,
		childList: !0,
		attributes: !0,
		attributeFilter: ["class", Si],
		attributeOldValue: !0
	});
}
function PX(e) {
	if (e.type === "attributes") {
		let t = e.target;
		if (e.attributeName === "data-ui-href") {
			LX(t, e.oldValue !== null);
			return;
		}
		let n = OX.test(e.oldValue ?? ""), r = t.matches(DX);
		n !== r && (zX(t, r), LX(t)), kX.test(e.oldValue ?? "") !== t.matches(".ui-readonly") && FX(t.querySelectorAll(AX));
		return;
	}
	let t = (e.target instanceof Element ? e.target : null)?.matches(DX) === !0;
	for (let n of e.addedNodes) n instanceof Element && (t && BX(n), n.matches(DX) && zX(n, !0), RX(n.querySelectorAll(DX)), LX(n), IX(n.querySelectorAll(`[${Si}]`)), FX([n, ...n.querySelectorAll(AX)]));
}
function FX(e) {
	for (let t of e) {
		if (!(t instanceof HTMLInputElement) || t.type !== "range") continue;
		let e = j(t);
		e !== jX.has(t) && (e ? (jX.add(t), t.addEventListener("touchstart", GX, { passive: !1 })) : (jX.delete(t), t.removeEventListener("touchstart", GX)));
	}
}
function IX(e) {
	for (let t of e) LX(t);
}
function LX(e, t = !1) {
	let n = e.getAttribute(Si);
	(n !== null || t) && (e.matches(DX) ? (e.removeAttribute("href"), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0")) : n === null || !uo(n) ? e.removeAttribute("href") : e.getAttribute("href") !== n && (e.setAttribute("href", n), e.getAttribute("tabindex") === "0" && e.removeAttribute("tabindex")));
}
function RX(e) {
	for (let t of e) zX(t, !0);
}
function zX(e, t) {
	for (let n of e.children) t ? BX(n) : MX.has(n) && (MX.delete(n), n.removeAttribute("inert"));
}
function BX(e) {
	e.hasAttribute("inert") || (MX.add(e), e.setAttribute("inert", ""));
}
function VX(e) {
	e.target instanceof Element && (k(e.target) ? (e.type === "click" && y_(e), KX(e)) : e.type === "click" && HX(e.target) && e.preventDefault());
}
function HX(e) {
	return e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio") && j(e);
}
function UX(e) {
	e instanceof KeyboardEvent && e.target instanceof Element && ((e.key === "Enter" || e.key === " ") && k(e.target) ? KX(e) : TX.has(e.key) && e.target instanceof HTMLInputElement && (e.target.type === "range" || e.target.type === "radio") && j(e.target) && e.preventDefault());
}
function WX(e) {
	e.target instanceof HTMLInputElement && e.target.type === "range" && j(e.target) && e.stopImmediatePropagation();
}
function GX(e) {
	e.target instanceof HTMLInputElement && e.target.type === "range" && j(e.target) && (e.preventDefault(), e.target.focus({ preventScroll: !0 }));
}
function KX(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region src/interactions/popup-service.ts
var qX = /* @__PURE__ */ new WeakMap(), JX = /* @__PURE__ */ new WeakSet(), YX = /* @__PURE__ */ new WeakSet(), XX = new _v({
	show: () => void 0,
	hide: ({ popup: e }, t) => {
		let n = qX.get(e);
		qX.delete(e), t !== void 0 && n?.(t);
	},
	single: !1,
	isInside: ({ popup: e, anchor: t }, n) => n.includes(e) || t !== void 0 && n.includes(t),
	onPress: !0,
	closesOnTab: ({ popup: e }) => JX.has(e),
	sheetOnPhone: ({ popup: e }) => YX.has(e)
});
function ZX(e) {
	return {
		open: (e, t, n) => QX(e, t, n, (e) => XX.open(e)),
		openList: $X,
		listKey: HP,
		followPointer: GP,
		focusReturn: (t) => om(t, e)
	};
}
function QX(e, t, n, r) {
	let i = n.owner ?? (e instanceof HTMLElement ? e : t), a = () => XX.popupOf(i) === t;
	return qX.set(t, n.onDismiss), n.closesOnTab === !0 ? JX.add(t) : JX.delete(t), n.sheetOnPhone === !0 ? YX.add(t) : YX.delete(t), r({
		owner: i,
		popup: t,
		anchor: e,
		placement: n
	}) || (qX.delete(t), queueMicrotask(() => n.onDismiss("owner"))), {
		reposition: () => {
			a() && XX.reposition(i);
		},
		close: () => {
			a() && XX.close(i);
		}
	};
}
function $X(e, t, n) {
	return QX(e, t, {
		...n,
		closesOnTab: !0
	}, (e) => VP(XX, e, n.entries, n.checked, n.fromEnd, n.focus));
}
//#endregion
//#region src/rendering/series-colors.ts
var eZ = "--ui-color-series-count", tZ = "--ui-color-series-", nZ = 8;
function rZ(e) {
	let t = Number(getComputedStyle(e).getPropertyValue(eZ));
	return Number.isFinite(t) && t >= 1 ? Math.floor(t) : nZ;
}
function iZ(e, t) {
	return `var(${tZ}${e % t + 1})`;
}
var aZ = {
	count: rZ,
	color: iZ
}, oZ = ".ui-items-view", sZ = `:scope > [${x}]`, cZ = `:scope > [${Lt}]`, lZ = "ui-orientation--horizontal", uZ = 1, dZ = [{
	edge: "first",
	holder: `:scope > [${Ht}="${Wt}"]`,
	bound: `${Ye}first-visible-key`,
	attribute: pt
}, {
	edge: "last",
	holder: `:scope > [${Ht}="${Gt}"]`,
	bound: `${Ye}last-visible-key`,
	attribute: mt
}], fZ = class {
	root;
	views = /* @__PURE__ */ new Set();
	waiting = /* @__PURE__ */ new Map();
	sized = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, V(this.root, oZ, { childList: !0 }, (e) => this.findEach(e));
		let t = this.root.querySelectorAll(`[${Ht}="${Wt}"], [${Ht}="${Gt}"]`);
		this.findEach(new Set(Array.from(t, (e) => e.parentElement).filter((e) => e !== null))), this.root.addEventListener("scroll", (e) => this.handleScroll(e), {
			capture: !0,
			passive: !0
		});
	}
	findEach(e) {
		for (let t of e) pZ(t) ? (this.views.add(t), this.watchHost(t), this.schedule(t)) : this.views.has(t) && this.forget(t);
	}
	watchHost(e) {
		let t = e.querySelector(sZ), n = this.sized.get(e);
		if (n?.host === t) return;
		if (n?.stop(), t === null) {
			this.sized.delete(e);
			return;
		}
		let r = xV(t, () => this.schedule(e)), i = new MutationObserver((n) => {
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
		let t = e.isConnected ? mZ(e) : [];
		if (t.length === 0) {
			this.forget(e);
			return;
		}
		let n = e.querySelector(sZ);
		if (n === null || k(t[0].holder)) return;
		let r = gZ(e, n);
		for (let { holder: e, edge: n, attribute: i } of t) {
			let t = hZ(r, n);
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
function pZ(e) {
	return mZ(e).length > 0;
}
function mZ(e) {
	let t = [];
	for (let { holder: n, bound: r, edge: i, attribute: a } of dZ) {
		let o = e.querySelector(n);
		o?.hasAttribute(r) === !0 && t.push({
			holder: o,
			edge: i,
			attribute: a
		});
	}
	return t;
}
function hZ(e, t) {
	if (e === null) return null;
	let { rows: n, band: r } = e;
	if (!(r.end - r.start <= uZ)) return (t === "first" ? CZ(n, r) : wZ(n, r)) ?? void 0;
}
function gZ(e, t) {
	let n = e.classList.contains(lZ), r = n && getComputedStyle(t).direction === "rtl", i = [], a = !1;
	for (let e of t.children) {
		let t = e.getAttribute(b);
		if (t === null || e.hasAttribute("data-ui-group-header")) continue;
		a = !0;
		let o = Dd(e);
		!e.classList.contains("ui-hidden") && (o.width > 0 || o.height > 0) && i.push({
			key: t,
			..._Z(o, n, r)
		});
	}
	return a ? {
		rows: i,
		band: vZ(t, n, r)
	} : null;
}
function _Z(e, t, n) {
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
function vZ(e, t, n) {
	let r = Sd(e), i = _Z(yZ(r, getComputedStyle(r)), t, n);
	for (let e = r.parentElement; e !== null; e = e.parentElement) {
		let r = getComputedStyle(e);
		(t ? r.overflowX : r.overflowY) !== "visible" && (i = xZ(i, _Z(yZ(e, null), t, n)));
	}
	return i = xZ(i, _Z({
		left: 0,
		top: 0,
		right: window.innerWidth,
		bottom: window.innerHeight
	}, t, n)), SZ(e, i, t, n);
}
function yZ(e, t) {
	let n = e.getBoundingClientRect(), r = n.left + e.clientLeft, i = n.top + e.clientTop;
	return {
		left: r + bZ(t?.paddingLeft),
		top: i + bZ(t?.paddingTop),
		right: r + e.clientWidth - bZ(t?.paddingRight),
		bottom: i + e.clientHeight - bZ(t?.paddingBottom)
	};
}
function bZ(e) {
	let t = e === void 0 ? NaN : parseFloat(e);
	return Number.isFinite(t) ? t : 0;
}
function xZ(e, t) {
	return {
		start: Math.max(e.start, t.start),
		end: Math.min(e.end, t.end)
	};
}
function SZ(e, t, n, r) {
	let i = t.start;
	for (let t of e.querySelectorAll(cZ)) {
		let e = _Z(t.getBoundingClientRect(), n, r);
		e.start <= i + uZ && e.end > i && getComputedStyle(t).position === "sticky" && (i = e.end);
	}
	return {
		start: i,
		end: t.end
	};
}
function CZ(e, t) {
	for (let n of e) if (TZ(n, t)) return n.key;
	return null;
}
function wZ(e, t) {
	for (let n = e.length - 1; n >= 0; n--) if (TZ(e[n], t)) return e[n].key;
	return null;
}
function TZ(e, t) {
	return e.key.length > 0 && e.end > t.start + uZ && e.start < t.end - uZ;
}
//#endregion
//#region src/items/item-rows.ts
function EZ(e, t, n) {
	return {
		itemOf: (e) => t.getItemValue(e),
		itemsOf: (e) => n.itemsOf(e),
		itemsVersion: (e) => n.itemsVersion(e),
		readPath: lA,
		renderVariant: (n, r, i) => {
			let a = e.getVariantTemplate(r, i), o = t.getItemScope(n);
			return a === void 0 || o === void 0 ? null : t.renderFromTemplate(a, o.item, t.getAncestorStack(n));
		},
		isKeyTarget: (e) => Df(e) !== null,
		cellsOf: (e) => {
			let t = e.closest(I);
			return t !== null && Lf(t) ? Bf(t, e) : [];
		},
		moveCursor: (e, t) => Qf(e, t ?? null)
	};
}
//#endregion
//#region src/updates/shown-words.ts
function DZ(e, t) {
	let n = ga(e.kind);
	return n === "Markup" ? !t.hasAttribute(Ui) : n === "Attribute" && e.name === "data-ui-tooltip" ? !t.hasAttribute(Be) : e.converter === QC;
}
var OZ = class {
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
function kZ(e, t) {
	return D(e) ? new OZ(e, t) : null;
}
//#endregion
//#region src/items/items-template-renderer.ts
var AZ = class {
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
		let c = this.metadata.getItemsTemplateMetadata(e), l = c?.itemWrapperElementName ? PZ(o, c.itemWrapperElementName, c.itemWrapperClassName ?? null, c.itemWrapperRole ?? null) : o;
		l !== o && this.moveItemScope(o, l), FZ(l, n, t);
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
		let i = NZ(r.item, t, n);
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
	writePushedValues(e) {
		this.populateBoundElements(e, [], !0);
	}
	setRowFiller(e) {
		this.fillRow = e;
	}
	rewriteRowWords(e, t) {
		this.translatableRowBindings ??= this.findTranslatableRowBindings();
		for (let [n, r] of this.translatableRowBindings) for (let i of e.querySelectorAll(r)) {
			let e = this.stackOf(i);
			MZ(n, e) && this.applyBoundAttribute(i, n, e, t);
		}
	}
	findTranslatableRowBindings() {
		let e = [];
		for (let t of this.metadata.metadata.bindings) {
			let n = this.metadata.getPropertyDefinition(t.propertyId);
			if (n === void 0 || typeof t.itemTemplate != "string" || !this.metadata.isTranslatable(t)) continue;
			let r = T(t.bindingId);
			e.push([t, `[${Ye}${$i(n.propertyName)}="${C(r)}"]`]);
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
		let r = BZ(t, n.templateKeyPropertyName);
		return r !== null && this.templates.getVariantTemplate(e, r) !== void 0 ? r : n.fallbackTemplateKey ?? null;
	}
	populateBoundElements(e, t, n = !1) {
		let r = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT);
		for (let i = e; i !== null; i = r.nextNode()) {
			if (!(i instanceof Element)) continue;
			let e = i.attributes;
			for (let r = 0; r < e.length; r++) {
				let a = e[r];
				a.name.startsWith("data-ui-bind-") && this.populateBoundAttribute(i, a.value, t, n);
			}
		}
	}
	populateBoundAttribute(e, t, n, r) {
		let i = Number(t), a = Number.isInteger(i) && i > 0 ? this.metadata.getBindingById(i) : void 0;
		a === void 0 || r && (jZ(a) || !this.state.has(a, [])) || aA(e, a.itemTemplateParameters, n) || this.applyBoundAttribute(e, a, n);
	}
	applyBoundAttribute(e, t, n, r) {
		let i = T(t.bindingId), a = this.metadata.getPropertyDefinition(t.propertyId);
		if (a === void 0) return;
		let o = jZ(t) ? iA(n, t.itemTemplate, t.itemTemplateParameters) : this.state.has(t, []) ? {
			ok: !0,
			value: this.state.get(t, [])
		} : { ok: !1 };
		if (!o.ok) {
			t.optional !== !0 && !this.unresolved.has(i) && (this.unresolved.add(i), s("item binding value could not be resolved; the item's path stops short of the property.", {
				binding: t,
				stack: n
			}));
			return;
		}
		let c = "scope" in o ? o.scope : void 0, l = o.value ?? t.fallbackValue;
		if (r !== void 0 && !r(l)) return;
		let u = fl(l, () => this.metadata.isTranslatable(t) && !oA(c)), d = kZ(l, this.extensions.converters), f = T(t.componentId), p = e.closest(this.componentSelector(f));
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
			let n = na(p, t, () => [e])[0] ?? null;
			n !== null && (d !== null && DZ(t, n) ? this.operations.apply({
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
function jZ(e) {
	return e.itemTemplate !== null && e.itemTemplate !== void 0;
}
function MZ(e, t) {
	for (let n of e.itemTemplateParameters ?? []) {
		let e = T(n.componentId);
		if (e > 0 && !t.some((t) => t.scopeComponentId === e)) return !1;
	}
	return !0;
}
function NZ(e, t, n) {
	if (t.length === 0) return n;
	let r = e;
	for (let n = 0; n < t.length - 1; n++) {
		let i = t[n], a = i.kind === "property" ? uA(r, i.name) : hA(r, i.key);
		if (!a.ok) return e;
		r = a.value;
	}
	if (typeof r != "object" || !r) return e;
	let i = t[t.length - 1];
	if (i.kind === "element") return gA(r, i.key, n), e;
	let a = r;
	return a[fA(a, i.name)] = n, e;
}
function PZ(e, t, n, r) {
	let i = document.createElement(t);
	return n !== null && (i.className = n), r !== null && r.length > 0 && i.setAttribute("role", r), i.appendChild(e), i;
}
function FZ(e, t, n) {
	e.setAttribute(b, t), zZ(e, n), LZ(e, n);
}
var IZ = [
	["CanSelect", oe],
	["CanDrag", se],
	["CanRemove", ce],
	["CanRename", le],
	["CanShowContextMenu", ue]
];
function LZ(e, t) {
	for (let [n, r] of IZ) {
		let i = uA(t, n);
		e.toggleAttribute(r, i.ok && i.value === !1);
	}
}
function RZ(e, t) {
	let n = e.getAttribute(b), r = e.closest(`[${x}]`);
	if (LZ(e, t), n !== null) for (let i of e.querySelectorAll(`[${b}="${C(n)}"]`)) i.closest("[data-ui-items-host]") === r && LZ(i, t);
}
function zZ(e, t) {
	let n = uA(t, "Group");
	n.ok && typeof n.value == "string" ? e.setAttribute(zt, n.value) : e.removeAttribute(zt);
}
function BZ(e, t) {
	if (t == null || t.trim().length === 0) return null;
	let n = uA(e, t);
	return !n.ok || n.value === null || n.value === void 0 ? null : typeof n.value == "string" ? n.value : String(n.value);
}
//#endregion
//#region src/items/items-rule-watcher.ts
var VZ = "Group", HZ = class {
	options;
	dragged = null;
	deferred = /* @__PURE__ */ new Map();
	readerHeld = /* @__PURE__ */ new Map();
	answering = [];
	drawnByHost = /* @__PURE__ */ new Map();
	readElsewhereByEdit = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, e.propertyPatchEngine.addValueChangeHandler((e) => this.handleItemValueChange(e));
		for (let t of e.metadata.metadata.itemsFilterSort) {
			let n = T(t.componentId), r = [...t.filters, ...t.sorts], i = () => this.syncComponentHosts(n);
			for (let t of r) t.source !== null && t.source !== void 0 && e.reactiveSources.watch(t.source, i);
		}
		e.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), e.root.addEventListener("dragend", () => this.land(), !0), e.root.addEventListener("focusout", () => this.handleFocusOut(), !0), V(e.root, `[${Ht}="${Ut}"]`, { attributeFilter: [ft] }, (e) => {
			for (let t of e) {
				let e = qa(t);
				e !== null && this.syncComponentHosts(e);
			}
		}), V(e.root, `[${Kt}="windowed"]`, { attributeFilter: [on] }, (e) => {
			for (let t of e) {
				let e = qa(t);
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
			for (let [t, n] of e) t.isConnected && pK(t, n, this.options);
		});
	}
	handleFocusOut() {
		this.readerHeld.size !== 0 && window.setTimeout(() => {
			for (let [e, t] of [...this.readerHeld]) UZ(t.row) || (this.readerHeld.delete(e), e.isConnected && this.sync(e, t.componentId));
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
		for (let e of t) !n.some((t) => WZ(t, e)) && !this.readElsewhere(e) && this.handleItemValueChange(e);
	}
	readElsewhere(e) {
		let t = T(e.reference.componentId), n = `${t}:${e.reference.propertyId}`, r = this.readElsewhereByEdit.get(n);
		if (r !== void 0) return r;
		let i = this.options.metadata.getBindingByComponentAndPropertyId(t, e.reference.propertyId), a = i === void 0 ? null : mA(i), o = a === null ? void 0 : this.findItemRootsAbove(e, a)[0] ?? this.findAddressedItemRoots(e.dynamicParameters).find((t) => e.components.some((e) => t.contains(e)));
		if (a === null || o === void 0) return !1;
		let s = this.readsPathElsewhere(o, t, e.reference.propertyId, a);
		return this.readElsewhereByEdit.set(n, s), s;
	}
	readsPathElsewhere(e, t, n, r) {
		for (let i of [e, ...e.querySelectorAll("*")]) for (let a of i.getAttributeNames()) {
			if (!a.startsWith("data-ui-bind-")) continue;
			let o = this.options.metadata.getBindingById(Number(i.getAttribute(a))), s = o === void 0 ? null : mA(o);
			if (!(o === void 0 || s === null || T(o.componentId) === t && o.propertyId === n) && (s.scopeComponentId <= 0 || s.scopeComponentId === r.scopeComponentId) && GZ(s.steps, r.steps) && this.findItemRoot(i, 0) === e) return !0;
		}
		return !1;
	}
	handleItemValueChange(e) {
		if (e.dynamicParameters.length === 0) return;
		let t = this.options.metadata.getBindingByComponentAndPropertyId(T(e.reference.componentId), e.reference.propertyId), n = t === void 0 ? null : mA(t);
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
			let a = i.closest(S);
			a !== null && this.drawsPatchedComponent(a, T(e.reference.componentId), t) && KZ(a, e.dynamicParameters) && (r = this.applyVirtualizedValue(i, E(a), n, t, e.value) || r);
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
		let r = this.readerHeld.get(e)?.row ?? null, i = n !== null && UZ(n) ? n : r !== null && UZ(r) ? r : null;
		i === null ? (this.readerHeld.delete(e), pK(e, t, this.options)) : this.readerHeld.set(e, {
			componentId: t,
			row: i
		});
	}
	findAddressedItemRoots(e) {
		let t = e[e.length - 1];
		return typeof t == "string" ? [...this.options.root.querySelectorAll(`[${b}="${C(t)}"]`)].filter((t) => this.isItemRoot(t) && La(t, e)) : [];
	}
	applyItemValue(e, t, n) {
		let r = e.closest(`[${x}]`), i = r === null ? null : qa(r);
		if (r !== null && i !== null && Nk(r) === "virtualized") {
			let a = e.getAttribute(b);
			a !== null && this.applyVirtualizedValue(r, i, a, t, n);
			return;
		}
		this.options.renderer.updateItemValue(e, t.steps, n);
		let a = qZ(VZ, t);
		a && zZ(e, this.options.renderer.getItemValue(e)), this.restampAbilities(e, t), r !== null && i !== null && (a || this.feedsRule(r, i, t)) && this.sync(r, i, e);
	}
	restampAbilities(e, t) {
		IZ.some(([e]) => qZ(e, t)) && RZ(e, this.options.renderer.getItemValue(e));
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
		if (this.options.templates.getGroupTemplate(t) !== void 0 && qZ(VZ, n)) return !0;
		let r = this.options.metadata.getItemsFilterSortMetadata(t);
		if (r !== void 0 && (r.filters.some((e) => qZ(e.itemProperty, n)) || r.sorts.some((e) => qZ(e.itemProperty, n)))) return !0;
		let i = yA(e);
		return (i?.filters ?? []).some((e) => qZ(e.itemProperty, n)) || (i?.sorts ?? []).some((e) => qZ(e.itemProperty, n));
	}
	syncComponentHosts(e) {
		for (let t of this.options.root.querySelectorAll(`[${x}]`)) {
			let n = qa(t);
			n === e && this.sync(t, n);
		}
	}
};
function UZ(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t);
}
function WZ(e, t) {
	let n = xa(e), r = n === "Value" ? !fm(e.value ?? null, t.value) : n === "Validation" && (e.message ?? null) !== null, i = e.address, a = i?.component?.dynamicParameters ?? [];
	return r && T(i?.component?.id) === T(t.reference.componentId) && ba(i?.property) === t.propertyName && a.length <= t.dynamicParameters.length && a.every((e, n) => String(e ?? "") === String(t.dynamicParameters[n] ?? ""));
}
function GZ(e, t) {
	let n = Math.min(e.length, t.length);
	for (let r = 0; r < n; r++) {
		let n = e[r], i = t[r];
		if (n.kind === "property" ? i.kind !== "property" || n.name !== i.name : i.kind !== "element" || !fm(n.key, i.key)) return !1;
	}
	return !0;
}
function KZ(e, t) {
	let n = Ia(e, Fa(e));
	return t.length === n.length + 1 && n.every((e, n) => String(e ?? "") === String(t[n] ?? ""));
}
function qZ(e, t) {
	let n = t.ruleSegments.join(".");
	return n.length === 0 || e === n || e.startsWith(`${n}.`);
}
//#endregion
//#region src/items/table-row-indices.ts
var JZ = "ui-table", YZ = "ui-table--no-header";
function XZ(e, t, n) {
	let r = e.parentElement, i = r?.parentElement ?? null;
	if (r === null || i === null || !r.classList.contains("ui-table__scroll") || !i.classList.contains(JZ)) return;
	let a = [], o = [], s = !1;
	for (let t of r.children) t === e ? s = !0 : t.getAttribute("role") === "row" && !(t === r.firstElementChild && i.classList.contains(YZ)) && (s ? o : a).push(t);
	a.forEach((e, t) => ZZ(e, t));
	for (let [e, n] of t) ZZ(e, a.length + n);
	n !== null && o.forEach((e, t) => ZZ(e, a.length + n + t)), w(i, "aria-rowcount", n === null ? "-1" : String(a.length + n + o.length));
}
function ZZ(e, t) {
	w(e, "aria-rowindex", String(t + 1));
}
//#endregion
//#region src/items/items-window-engine.ts
var QZ = 50, $Z = 1, eQ = .5, tQ = 60, nQ = "--ui-window-look", rQ = "--ui-window-row", iQ = "--ui-window-tile", aQ = 3, oQ = "page", sQ = class {
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
			this.noteShownRow(t), this.layout(t), bQ(t) === 0 ? this.getState(t).pending || this.requestAsync(t, xQ(t), 0, null, !1) : n ? this.revealWindow(t) : (this.realign(t), this.considerRequest(t));
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
		t !== null && (Td(e, t), this.noteShownRow(e));
	}
	windowTop(e) {
		if (e.hasAttribute("data-ui-window-paged")) return null;
		let t = Fk(e, tn);
		return t !== null && lY(e) && Ik(e, "data-ui-window-more-after") ? Math.max(0, this.windowBottom(e, t) - wd(e).height) : t === null || t === 0 ? null : Ik(e, "data-ui-window-more-after") ? t * this.getState(e).itemSize : e.scrollHeight;
	}
	windowBottom(e, t) {
		let n = yQ(e), r = this.getState(e).itemSize, i = n.length === 0 ? 0 : Dd(n[n.length - 1]).bottom - Dd(n[0]).top;
		return t * r + (i > 0 ? i : n.length * r);
	}
	noteShownRow(e) {
		this.getState(e).shown = _Q(e, yQ(e));
	}
	noteShownRows() {
		for (let e of this.held) e.isConnected ? e.hasAttribute("data-ui-window-paged") || this.noteShownRow(e) : this.held.delete(e);
	}
	sync(e) {
		if (e.length !== 0) for (let t of this.hosts()) e.some((e) => e.contains(t) || t.contains(e)) && (this.layout(t), !this.getState(t).pending && (bQ(t) === 0 && e.some((e) => t.contains(e)) ? this.requestAsync(t, xQ(t), 0, null, !1) : this.realign(t)));
	}
	realign(e) {
		let t = Fk(e, tn), n = yQ(e);
		if (t === null || n.length === 0 || e.hasAttribute("data-ui-window-paged")) return;
		let r = this.getState(e), i = wd(e), a = Math.floor(i.top / r.itemSize);
		Math.ceil((i.top + i.height) / r.itemSize) >= t && a <= t + n.length || this.revealWindow(e);
	}
	refilled(e) {
		let t = this.states.get(e);
		t !== void 0 && !t.pending && uQ(t);
	}
	reconsider() {
		for (let e of this.hosts()) this.noteShownRow(e), this.considerRequest(e);
	}
	async requestOffsetAsync(e, t) {
		Nk(e) === "windowed" && await this.requestAsync(e, "Offset", Math.max(0, Math.floor(t)), null, !1);
	}
	hosts() {
		return [...this.root.querySelectorAll(`[${x}][${Kt}="windowed"]`)];
	}
	handleScroll(e) {
		let t = Cd(e.target);
		if (t === null || Nk(t) !== "windowed" || t.hasAttribute("data-ui-window-paged")) return;
		let n = this.getState(t);
		n.scheduled === 0 && (this.considerRequest(t), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.considerRequest(t);
		}, tQ));
	}
	considerRequest(e) {
		let t = this.getState(e);
		if (t.pending) {
			t.restless = !0;
			return;
		}
		if (e.hasAttribute("data-ui-window-paged") && bQ(e) > 0) return;
		let n = yQ(e);
		if (n.length === 0) {
			this.requestAsync(e, xQ(e), 0, null, !1);
			return;
		}
		let r = Fk(e, tn), i = Ik(e, rn), a = Ik(e, an);
		if (r !== null) {
			let o = this.windowSize(e), s = wd(e), c = Math.max(1, Math.round(s.height * $Z / t.itemSize), Math.floor(o * eQ)), l = Math.floor(s.top / t.itemSize), u = Math.ceil((s.top + s.height) / t.itemSize);
			if (u < r || l > r + n.length) {
				this.requestAsync(e, "Offset", this.landingOffset(e, l, o), null, !1);
				return;
			}
			if (l - c <= r && i) {
				this.requestAsync(e, "Before", 0, SQ(n[0]), !0);
				return;
			}
			if (u + c >= r + n.length && a) {
				this.requestAsync(e, "After", 0, SQ(n[n.length - 1]), !0);
				return;
			}
			return;
		}
		let o = wd(e), s = Math.max(1, o.height * $Z), c = o.contentHeight - o.top - o.height;
		o.top <= s && i ? this.requestAsync(e, "Before", 0, SQ(n[0]), !0) : c <= s && a && this.requestAsync(e, "After", 0, SQ(n[n.length - 1]), !0);
	}
	landingOffset(e, t, n) {
		let r = Math.max(0, t - Math.floor(n / 4)), i = Fk(e, nn);
		return i === null ? r : Math.min(r, Math.max(0, i - n));
	}
	async requestAsync(e, t, n, r, i) {
		let a = qa(e);
		if (a === null) {
			s("a windowed items host is not inside an addressable component.", e);
			return;
		}
		if (r === null && (t === "Before" || t === "After")) return;
		let o = this.getState(e);
		o.pending = !0, o.readingBefore = t === "Before", (t === "Start" || t === "End") && uQ(o);
		let c = e.closest(S), l = t.toLowerCase();
		e.setAttribute(Qt, l), c?.setAttribute(Qt, e.hasAttribute("data-ui-window-paged") ? oQ : l), e.setAttribute("aria-busy", "true"), t === "After" && Fk(e, "data-ui-window-total") === null && dQ(e) && (eK(e, QG, aQ * this.rowSize(e)), fQ(e, o));
		let u = Fk(e, tn) === null;
		try {
			await this.options.requestWindow({
				componentId: a,
				dynamicParameters: CQ(e),
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
			o.pending = !1, e.removeAttribute(Qt), c?.removeAttribute(Qt), e.removeAttribute("aria-busy"), eK(e, QG, 0), this.noteShownRow(e), this.layout(e), o.readingBefore = !1;
			let n = o.restless;
			o.restless = !1, (n || u && mQ(e, t, r)) && bQ(e) > 0 ? this.considerRequest(e) : this.realign(e);
		}
	}
	layout(e) {
		let t = this.getState(e), n = yQ(e), r = Fk(e, nn), i = Fk(e, tn);
		if (XZ(e, n.map((e, t) => [e, (i ?? 0) + t]), r), e.hasAttribute("data-ui-window-paged")) {
			eK(e, "top", 0), eK(e, ZG, 0);
			return;
		}
		if (n.length > 0) {
			let r = Dd(n[n.length - 1]).bottom - Dd(n[0]).top;
			if (r > 0) {
				let i = cQ(n), a = Math.ceil(n.length / i);
				e.clientWidth !== t.measuredWidth && (uQ(t), t.measuredWidth = e.clientWidth), lQ(t, n, i), t.skeletonRow = a > 1 ? (Dd(n[n.length - 1]).top - Dd(n[0]).top) / (a - 1) : r, t.skeletonTile = i > 1 ? Dd(n[1]).left - Dd(n[0]).left : null;
			}
		}
		let a = r === null || i === null ? 0 : i * t.itemSize, o = r === null || i === null ? 0 : Math.max(0, r - i - n.length) * t.itemSize;
		eK(e, "top", a), eK(e, ZG, o), fQ(e, t), (t.readingBefore || !hQ(e)) && gQ(e, n, t.shown), XJ(e);
	}
	rowSize(e) {
		let t = this.getState(e);
		return t.skeletonRow > 0 ? pQ(t.skeletonRow) : t.itemSize;
	}
	windowSize(e) {
		let t = Fk(e, en);
		return t !== null && t > 0 ? t : QZ;
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
function cQ(e) {
	let t = Dd(e[0]).top, n = 1;
	for (; n < e.length && Dd(e[n]).top === t;) n++;
	return n;
}
function lQ(e, t, n) {
	for (let r = 0; r < t.length; r++) {
		let i = t[r + n], a = i === void 0 ? t.length <= n ? Dd(t[r]).height : 0 : Dd(i).top - Dd(t[r]).top;
		if (a <= 0) continue;
		let o = a / n;
		iK(e.sizes, e.shares.get(t[r]) ?? null, o), e.shares.set(t[r], o);
	}
	e.sizes.count > 0 && (e.itemSize = Math.max(1, e.sizes.sum / e.sizes.count));
}
function uQ(e) {
	e.shares = /* @__PURE__ */ new WeakMap(), e.sizes = {
		sum: 0,
		count: 0
	};
}
function dQ(e) {
	return getComputedStyle(e).getPropertyValue(nQ).trim() === "skeleton";
}
function fQ(e, t) {
	if (t.skeletonRow <= 0) return;
	let n = `${pQ(t.skeletonRow)}px`, r = t.skeletonTile !== null && t.skeletonTile > 0 ? `${pQ(t.skeletonTile)}px` : "";
	for (let t of e.querySelectorAll(`:scope > [${Zt}]`)) {
		let e = t.style;
		e.getPropertyValue(rQ) !== n && e.setProperty(rQ, n), e.getPropertyValue(iQ) !== r && (r.length === 0 ? e.removeProperty(iQ) : e.setProperty(iQ, r));
	}
}
function pQ(e) {
	return Math.round(e * 100) / 100;
}
function mQ(e, t, n) {
	let r = yQ(e), i = t === "Before" ? r[0] : t === "After" ? r[r.length - 1] : void 0;
	return i !== void 0 && SQ(i) !== n;
}
function hQ(e) {
	let t = Fk(e, tn);
	return wd(e).top <= 0 && (t === null ? !Ik(e, "data-ui-window-more-before") : t === 0);
}
function gQ(e, t, n) {
	let r = n === null ? void 0 : t.find((e) => SQ(e) === n.key);
	if (n === null || r === void 0) return;
	let i = Dd(r);
	if (i.height <= 0) return;
	let a = wd(e).top, o = i.top - vQ(e) + a - n.at;
	Math.abs(o) >= .5 && Td(e, a + o);
}
function _Q(e, t) {
	let n = vQ(e), r = 0, i = t.length;
	for (; r < i;) {
		let e = Math.floor((r + i) / 2);
		Dd(t[e]).bottom > n ? i = e : r = e + 1;
	}
	let a = t.at(r), o = a === void 0 ? null : SQ(a);
	if (a === void 0 || o === null) return null;
	let s = Dd(a), c = wd(e);
	return s.height <= 0 || s.top >= n + c.height ? null : {
		key: o,
		at: s.top - n + c.top
	};
}
function vQ(e) {
	let t = Sd(e);
	return t.getBoundingClientRect().top + t.clientTop;
}
function yQ(e) {
	return [...e.children].filter((e) => e.hasAttribute(b));
}
function bQ(e) {
	return yQ(e).length;
}
function xQ(e) {
	return lY(e) ? "End" : "Start";
}
function SQ(e) {
	return e.getAttribute(b);
}
function CQ(e) {
	let t = e.closest(S);
	return t === null ? [] : Ia(t, Fa(t));
}
//#endregion
//#region src/items/items-composite-renderer.ts
var wQ = [
	y,
	ie,
	ae
];
function TQ(e, t, n, r, i, a, o) {
	let c = document.createElement(e.itemElementName);
	c.className = e.itemClassName, EQ(c, e.itemRole);
	let l = OQ(c, e, t, a);
	l !== 0 && o.populateElement(c, n, l, i);
	for (let l of e.slots) {
		let e = DQ(l, t, n, a);
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
		d.className = l.wrapperClassName, EQ(d, l.wrapperRole);
		for (let [e, t] of Object.entries(l.wrapperAttributes ?? {})) d.setAttribute(e, t);
		d.appendChild(u), FZ(d, r, n), c.appendChild(d);
	}
	return FZ(c, r, n), o.registerItemScope(c, l, n), c;
}
function EQ(e, t) {
	t != null && t.length > 0 && e.setAttribute("role", t);
}
function DQ(e, t, n, r) {
	let i = BZ(n, e.variantKeyPropertyName);
	if (i !== null && i.length > 0) {
		let n = r.getVariantTemplate(t, `${e.variantKey}:${i}`);
		if (n !== void 0) return n;
	}
	return r.getVariantTemplate(t, e.variantKey);
}
function OQ(e, t, n, r) {
	let i = t.hostSlotVariantKey;
	if (i == null || i.length === 0) return 0;
	let a = r.getVariantTemplate(n, i)?.content.firstElementChild ?? null;
	if (a === null) return s("composite item host slot template was not found.", {
		componentId: n,
		hostSlotVariantKey: i
	}), 0;
	for (let t of wQ) {
		let n = a.getAttribute(t);
		n !== null && e.setAttribute(t, n);
	}
	for (let t of Array.from(a.attributes)) t.name.startsWith("data-ui-bind-") && e.setAttribute(t.name, t.value);
	return e instanceof HTMLElement && (e.style.alignSelf = "stretch", e.style.justifySelf = "stretch"), E(a);
}
//#endregion
//#region src/items/items-row-renderer.ts
function kQ(e, t, n, r, i) {
	let a = i.metadata.getItemsTemplateMetadata(e), o = a?.composite;
	if (o == null) return AQ(i.renderer.renderItem(e, t, n, r), a);
	let s = TQ(o, e, t, n, r, i.templates, i.renderer);
	return s !== null && a?.rowDecorator && i.renderer.decorateRow(a.rowDecorator, s, t, n, e, r), AQ(s, a);
}
function AQ(e, t) {
	return e === null ? null : (t?.announcesSelection === !0 && !e.hasAttribute("aria-selected") && e.setAttribute("aria-selected", "false"), hl(e), e);
}
//#endregion
//#region src/items/items-virtualization-engine.ts
var jQ = 6, MQ = 60, NQ = class {
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
		return r === void 0 || i < 0 || a < 0 ? null : r.slice(Math.min(i, a), Math.max(i, a) + 1).filter((e) => LQ(e.entry) === !1).map((e) => e.entry.key);
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
		if (!VQ(e) && !zQ(e)) return a.element;
		let o = getComputedStyle(e), s = WQ(o), c = r.projected.map((e) => this.pitchOf(r, e) + s), l = VQ(e) ? HQ(r.projected, c, r.across) : null, u = l === null ? i : BQ(l.starts, i), d = l?.pitches ?? c, f = GQ(o.paddingTop) + KQ(d, 0, u), p = f + d[u] - s, m = wd(e), h = n === "start" || n === "nearest" && f < m.top ? f : n === "end" || p > m.top + m.height ? p - m.height : null;
		return h !== null && Td(e, Math.max(0, h)), this.layout(e, r), a.element;
	}
	sync(e) {
		let t = this.getState(e);
		if (t === null) return;
		let n = lY(e) && dY(e), r = t.projected;
		this.project(e, t), this.keepCursorShown(e, t, r), this.layout(e, t), n && !dY(e) && (Td(e, e.scrollHeight), this.layout(e, t));
	}
	refill(e, t) {
		let n = this.getState(e);
		if (n === null) return [];
		let r = new Map(n.byKey), i = [], a = /* @__PURE__ */ new Map(), o = [];
		for (let { key: n, item: s } of t) {
			let t = r.get(n);
			if (r.delete(n), t !== void 0 && fm(t.item, s)) {
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
		return t === null ? null : PQ(t) ? (this.keptAsDrawn.add(t), t) : (this.dropRow(e, t), null);
	}
	dropRow(e, t) {
		if (t === null) return;
		let n = pp(t);
		t.remove(), mp(e, null, n);
	}
	keepCursorShown(e, t, n) {
		let r = fp(e), i = t.entries.find((e) => e.element?.hasAttribute("data-ui-row-focus") === !0) ?? null, a = i?.key ?? (r === null ? null : gp(r));
		if (r === null || a === null) return;
		let o = /* @__PURE__ */ new Set();
		for (let e of t.projected) e.header || o.add(e.entry.key);
		if (o.has(a)) return;
		let s = n.filter((e) => !e.header).map((e) => e.entry), c = s.findIndex((e) => e.key === a), l = c < 0 ? void 0 : s.slice(c + 1).find((e) => o.has(e.key)) ?? s.slice(0, c).reverse().find((e) => o.has(e.key));
		i?.element?.removeAttribute(Ne), l === void 0 ? (r.removeAttribute(Pe), r.removeAttribute("aria-activedescendant")) : l.element instanceof HTMLElement ? Ff(r, G(e).filter((e) => e instanceof HTMLElement), l.element, null, !1) : (r.setAttribute(Pe, l.key), r.removeAttribute("aria-activedescendant"));
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
		let a = fp(e), o = a === null || i.size === 0 ? null : cp(a, G(e), i);
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
		return i === null || a === void 0 ? !1 : (a.item = NZ(a.item, n, r), i.version++, n.length === 0 && (a.element = this.renewRow(e, a.element)), !0);
	}
	project(e, t) {
		let n = this.options.metadata.getItemsFilterSortMetadata(t.componentId), r = yA(e), i = this.options.templates.getGroupTemplate(t.componentId), a = TA(n, this.options.state, r), o = t.entries;
		if (t.version++, (n !== void 0 && n.filters.length > 0 || (r?.filters ?? []).length > 0) && (o = o.filter((e) => CA(n, e.item, this.options.state, r))), !(i !== void 0 && o.some((e) => RQ(e) !== ""))) {
			a.length > 0 && (o = [...o].sort((e, t) => DA(e.item, t.item, a))), t.projected = o.map((e) => ({
				entry: e,
				header: !1
			}));
			return;
		}
		let { buckets: s, order: c } = qG(o, RQ), l = [];
		for (let e of c) {
			let t = s.get(e);
			a.length > 0 && (t = [...t].sort((e, t) => DA(e.item, t.item, a))), e !== "" && l.push({
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
		let t = Cd(e.target);
		t !== null && Nk(t) === "virtualized" && this.relayout(t);
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
			e.isConnected && Nk(e) === "virtualized" ? window.requestAnimationFrame(() => this.relayout(e)) : this.resizes?.unobserve(e);
		}
	}
	relayout(e) {
		let t = this.getState(e);
		t !== null && t.scheduled === 0 && (this.layout(e, t), t.scheduled = window.setTimeout(() => {
			t.scheduled = 0, this.layout(e, t);
		}, MQ));
	}
	layout(e, t) {
		let n = t.projected, r = getComputedStyle(e), i = WQ(r), a = n.map((e) => this.pitchOf(t, e) + i), o = n.length, s = t.across, c = VQ(e) ? HQ(n, a, s) : null, l = c?.pitches ?? a, u = l.length, d = 0, f = u;
		if ((c !== null || zQ(e)) && u > 0) {
			let i = GQ(r.paddingTop), a = wd(e), o = FQ(e, t, n, l, s, a.top - i, i), c = o + a.height, p = 0;
			d = u;
			for (let e = 0; e < u; e++) {
				let t = p + l[e];
				if (d === u && t > o && (d = e), p >= c) {
					f = e;
					break;
				}
				p = t;
			}
			d === u && (d = Math.max(0, u - 1)), d = Math.max(0, d - jQ), f = Math.min(u, f + jQ);
		}
		let p = c === null ? d : c.starts[d] ?? o, m = c === null ? f : f < u ? c.starts[f] : o, h = this.options.renderer.getAncestorStack(e), g = [], _ = [], v = -1, ee = !1, te = document.activeElement, ne = null;
		for (let r = 0; r < o; r++) {
			let i = n[r];
			i.header || v++;
			let a = r >= p && r < m, o = (i.header ? t.headers.get(RQ(i.entry)) ?? null : i.entry)?.element ?? null, s = o !== null && te !== null && o.contains(te);
			if (o !== null && !s && this.keptAsDrawn.has(o) && (this.keptAsDrawn.delete(o), this.dropRow(e, o), IQ(t, i, null), o = null, ee = !0), !a) {
				if (o !== null && !i.header && s) {
					ne = {
						element: o,
						line: c === null ? r : BQ(c.starts, r)
					}, _.push([o, v]);
					continue;
				}
				o !== null && (this.dropRow(e, o), IQ(t, i, null), ee = !0);
				continue;
			}
			if (o !== null) {
				i.header && XG(o, i.entry.key), g.push(o), i.header || _.push([o, v]);
				continue;
			}
			let l = i.header ? this.renderHeader(t, i.entry, h) : this.renderRow(t, i.entry, h);
			l !== null && (i.header || hp(e, l), IQ(t, i, l), g.push(l), i.header || _.push([l, v]), ee = !0);
		}
		let re = new Set(g);
		ne !== null && re.add(ne.element);
		for (let n of t.entries) n.element !== null && !re.has(n.element) && (this.dropRow(e, n.element), n.element = null, ee = !0);
		for (let t of G(e)) re.has(t) || (this.dropRow(e, t), ee = !0);
		for (let t of e.querySelectorAll(`:scope > [${Lt}]`)) re.has(t) || (t.remove(), ee = !0);
		for (let e of t.headers.values()) e.element !== null && !re.has(e.element) && (e.element = null);
		let y = ne !== null && ne.line < d ? ne : null, ie = ne !== null && ne.line >= f ? ne : null, ae = KQ(l, 0, y?.line ?? d), b = KQ(l, ie === null ? f : ie.line + 1, u), oe = ne === null ? 0 : y === null ? KQ(l, f, ne.line) : KQ(l, y.line + 1, d), se = rK(e, oe > 0 ? oe - i : 0);
		aK(e, [...y === null ? ie === null ? g : [
			...g,
			...Xk(se),
			ie.element
		] : [
			y.element,
			...Xk(se),
			...g
		], ...Xk(Zk(e))]), eK(e, "top", ae > 0 ? ae - i : 0), eK(e, ZG, b > 0 ? b - i : 0), Qk(e, t.componentId, this.options.templates, this.options.renderer, o > 0), XZ(e, _, v + 1), (ee || t.first !== p || t.last !== m) && (t.first = p, t.last = m, this.options.dom.invalidate(e)), t.laidOut = n, t.pitches = l, t.laidAcross = s, t.keptOutOfRange = ne?.element ?? null, t.firstLine = d, t.lastLine = f, this.measure(t, n, p, m), c !== null && (t.across = UQ(e, r, t.tileWidth) ?? t.across, t.across !== s && this.layout(e, t));
	}
	renderRow(e, t, n) {
		return kQ(e.componentId, t.item, t.key, n, this.options);
	}
	renderHeader(e, t, n) {
		let r = this.options.templates.getGroupTemplate(e.componentId);
		return r === void 0 ? null : YG(r, this.options.renderer, t.item, t.key, n);
	}
	measure(e, t, n, r) {
		let i = 0;
		for (let a = n; a < r && a < t.length; a++) {
			let n = t[a], r = n.header ? e.headers.get(RQ(n.entry)) : n.entry, o = r?.element;
			if (r == null || o == null) continue;
			let s = Dd(o);
			s.height <= 0 || (iK(n.header ? e.headerHeights : e.itemHeights, r.height, s.height), r.height = s.height, n.header || (i = Math.max(i, s.width)));
		}
		i > 0 && (e.tileWidth = i), e.itemHeights.count > 0 && (e.itemEstimate = e.itemHeights.sum / e.itemHeights.count), e.headerHeights.count > 0 && (e.headerEstimate = e.headerHeights.sum / e.headerHeights.count);
	}
	pitchOf(e, t) {
		return t.header ? e.headers.get(RQ(t.entry))?.height ?? e.headerEstimate : t.entry.height ?? e.itemEstimate;
	}
	getState(e) {
		let t = this.states.get(e);
		if (t !== void 0) return this.held.add(e), t;
		let n = Ja(e);
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
function PQ(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t);
}
function FQ(e, t, n, r, i, a, o) {
	if (t.laidOut !== n || t.laidAcross !== i || t.pitches.length !== r.length || a <= 0) return a;
	let s = 0, c = 0;
	for (let e = 0; e < r.length; e++) {
		let n = e >= t.firstLine && e < t.lastLine ? r[e] : t.pitches[e];
		if (s + n > a) break;
		s += n, c += r[e];
	}
	let l = c - s;
	return Math.abs(l) < .5 ? a : (Td(e, a + l + o), a + l);
}
function IQ(e, t, n) {
	if (!t.header) {
		t.entry.element = n;
		return;
	}
	let r = RQ(t.entry), i = e.headers.get(r);
	i === void 0 ? e.headers.set(r, {
		element: n,
		height: null
	}) : i.element = n;
}
function LQ(e) {
	let t = uA(e.item, "CanSelect");
	return t.ok && t.value === !1;
}
function RQ(e) {
	let t = uA(e.item, "Group");
	return t.ok && typeof t.value == "string" ? t.value : "";
}
function zQ(e) {
	let t = e.parentElement;
	return t !== null && (t.classList.contains("ui-table__scroll") || t.classList.contains("ui-items-view--stack") && t.classList.contains("ui-orientation--vertical"));
}
function BQ(e, t) {
	let n = 0;
	for (; n + 1 < e.length && e[n + 1] <= t;) n++;
	return n;
}
function VQ(e) {
	return e.parentElement?.classList.contains("ui-items-view--wrap") === !0;
}
function HQ(e, t, n) {
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
function UQ(e, t, n) {
	let r = e.clientWidth - GQ(t.paddingLeft) - GQ(t.paddingRight);
	if (n === null || n <= 0 || r <= 0) return null;
	let i = GQ(t.columnGap);
	return Math.max(1, Math.floor((r + i + .5) / (n + i)));
}
function WQ(e) {
	return GQ(e.rowGap);
}
function GQ(e) {
	let t = Number.parseFloat(e);
	return Number.isFinite(t) ? t : 0;
}
function KQ(e, t, n) {
	let r = 0;
	for (let i = t; i < n; i++) r += e[i];
	return r;
}
//#endregion
//#region src/items/items-template-registry.ts
var qQ = "data-ui-template", JQ = "default", YQ = class {
	dom;
	templateComponentIds = null;
	constructor(e) {
		this.dom = e;
	}
	getTemplate(e, t) {
		let n = t ?? JQ, r = this.findTemplate(e, n);
		return r === void 0 ? n === JQ ? void 0 : this.getTemplate(e, null) : r;
	}
	getVariantTemplate(e, t) {
		return this.findTemplate(e, t);
	}
	findTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		return n === null ? void 0 : XQ(n, qQ, t);
	}
	isTemplateComponent(e) {
		return this.templateComponentIds ??= ZQ(this.dom.root), this.templateComponentIds.has(e);
	}
	getEmptyTemplate(e) {
		return this.getMarkedTemplate(e, Pt);
	}
	getGroupTemplate(e) {
		return this.getMarkedTemplate(e, Ft);
	}
	getMarkedTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		return n === null ? void 0 : XQ(n, t, null);
	}
};
function XQ(e, t, n) {
	for (let r of e.children) if (r.localName === "template" && (n === null ? r.hasAttribute(t) : r.getAttribute(t) === n)) return r;
}
function ZQ(e) {
	let t = /* @__PURE__ */ new Set();
	return dl(e, (n) => {
		if (n !== e) for (let e of n.querySelectorAll(S)) {
			let n = E(e);
			n > 0 && t.add(n);
		}
	}), t;
}
//#endregion
//#region src/items/row-menus.ts
var QQ = `:scope > ${`template[${Te}]`}`, $Q = class {
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
	menuComponentsOf(e) {
		this.scan();
		let t = this.menuOf.get(e), n = [];
		if (t === void 0) return n;
		for (let [e, r] of this.menuOf) r === t && n.push(e);
		return n;
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
			this.components.has(e) && t$(t.item, this.chordSet);
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
		let t = e.querySelector(QQ);
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
			let e = [...t, ...e$(r)];
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
		this.taken.add(e), this.declared.add(r), dl(e.content, (e) => {
			if (i) for (let n of e.querySelectorAll(S)) this.components.set(E(n), t), this.menuOf.set(E(n), r);
			for (let t of e.querySelectorAll(`[${Kn}]`)) {
				let e = t.getAttribute("data-ui-shortcut")?.trim() ?? "";
				e.length > 0 && this.writtenChords.add(e);
			}
		}), (e.parentElement?.hasAttribute("data-ui-context-menu-later") !== !0 || n !== null) && (n !== null && n.after(e), Number.isInteger(r) && r > 0 && this.shared.set(r, e));
	}
};
function e$(e) {
	let t = [];
	for (let n = e.parentElement?.closest("[data-ui-items-host]") ?? null; n !== null; n = n.parentElement?.closest("[data-ui-items-host]") ?? null) {
		let e = qa(n);
		e !== null && t.unshift(e);
	}
	return t;
}
function t$(e, t) {
	let n = uA(e, "Shortcut");
	n.ok && typeof n.value == "string" && n.value.trim().length > 0 && t.add(n.value.trim());
	let r = uA(e, "Items");
	if (r.ok && Array.isArray(r.value)) for (let e of r.value) t$(e, t);
}
//#endregion
//#region src/rendering/theme-colors.ts
function n$(e, t) {
	let n = e.querySelector(`style[${Gr}]`);
	if (t.length === 0) {
		n?.remove();
		return;
	}
	if (n !== null) {
		n.textContent !== t && (n.textContent = t);
		return;
	}
	let r = document.createElement("style");
	r.setAttribute(Gr, ""), r.textContent = t, e.insertBefore(r, e.querySelector("style")?.nextElementSibling ?? null);
}
//#endregion
//#region src/metadata/metadata-reader.ts
var r$ = "script[type='application/json'][data-ui-metadata]";
function i$(e = document) {
	let t = e.querySelector(r$);
	if (t === null) return a$();
	let n = t.textContent?.trim() ?? "";
	if (n.length === 0) return a$();
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
		words: r.words ?? [],
		compileWarnings: r.compileWarnings ?? []
	};
}
function a$() {
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
var o$ = "script[type='application/json'][data-ui-hydration]";
function s$(e) {
	return e !== null && (Pc(e.title) || Pc(e.changes));
}
function c$(e = document) {
	let t = e.querySelector(o$)?.textContent?.trim() ?? "";
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
var l$ = "reconnecting";
async function u$(e, t, n, r) {
	for (let i = 0;; i++) try {
		return await e();
	} catch (e) {
		if (t()) return s("attaching the runtime failed as the connection dropped again; the reconnect attaches.", e), l$;
		if (i >= n.length) return c("attaching the runtime failed after retrying; giving up.", e), null;
		s("attaching the runtime failed; retrying.", {
			attempt: i + 1,
			error: e
		}), await r(n[i]);
	}
}
//#endregion
//#region src/transport/reader-time-zone.ts
function d$(e = () => Intl.DateTimeFormat().resolvedOptions().timeZone) {
	try {
		let t = e();
		return typeof t == "string" && t.length > 0 ? t : null;
	} catch {
		return null;
	}
}
function f$(e, t, n) {
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
var p$ = "/_ne/", m$ = 3e3;
function h$(e, t, n) {
	let r = e.getAttribute(Ur);
	if (r === null || !("serviceWorker" in navigator)) return;
	let i = navigator.serviceWorker;
	if (f$(i, t, n), e.hasAttribute("data-ui-service-worker-imported")) return () => _$(i.ready);
	let a = i.register(r, { scope: p$ }).then(g$).catch((e) => {
		s("registering the notification service worker failed; notifications are the page's own.", e);
	});
	return () => a;
}
function g$(e) {
	let t = e.installing ?? e.waiting;
	return e.active !== null || t === null ? Promise.resolve(e) : new Promise((n) => {
		t.addEventListener("statechange", () => {
			t.state === "activated" && n(e);
		});
	});
}
function _$(e) {
	return Promise.race([e, new Promise((e) => setTimeout(() => e(void 0), m$))]);
}
//#endregion
//#region src/runtime/reload-guard.ts
var v$ = "ne-standard-ui:reloaded-view";
function y$(e, t, n) {
	if (!t) return "no-cookie";
	if (S$(n) === e) return "asked-again";
	try {
		n?.setItem(v$, e);
	} catch {}
	return "reload";
}
function b$(e) {
	try {
		e?.removeItem(v$);
	} catch {}
}
function x$() {
	try {
		return window.sessionStorage;
	} catch {
		return null;
	}
}
function S$(e) {
	try {
		return e?.getItem(v$) ?? null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/runtime/window-id.ts
function C$(e, t) {
	let n = null;
	try {
		n = window.sessionStorage;
	} catch (e) {
		s("session storage is unavailable, so this tab is new on every load.", e);
	}
	return w$(e, {
		memory: n,
		lifecycle: window,
		openChannel: typeof BroadcastChannel == "function" ? (e) => new BroadcastChannel(e) : null,
		rekeyed: t
	});
}
function w$(e, t) {
	let n = t.create ?? A$, r = t.now ?? Date.now, i = t.memory, a = `${e}:claimed`, o = D$(i, e), s = n(), c = o !== null && o.length > 0 && D$(i, a) !== o ? o : n(), l = null, u = 0, d = () => {
		O$(i, e, c), O$(i, a, c);
	}, f = (e) => {
		e?.kind === "ask" && e.id === c && e.from !== s ? T$(l, {
			kind: "held",
			id: c,
			to: e.from,
			by: s,
			at: u
		}) : e?.kind === "held" && e.id === c && e.to === s && (e.at < u || e.at === u && e.by < s) && (c = n(), d(), t.rekeyed(c));
	}, p = () => {
		l = E$(t, e), l?.addEventListener("message", (e) => f(e.data)), u = r(), T$(l, {
			kind: "ask",
			id: c,
			from: s,
			at: u
		});
	};
	return d(), p(), t.lifecycle.addEventListener("pagehide", () => {
		k$(i, a), l?.close(), l = null;
	}), t.lifecycle.addEventListener("pageshow", (e) => {
		e.persisted && (d(), p());
	}), c;
}
function T$(e, t) {
	e?.postMessage(t);
}
function E$(e, t) {
	try {
		return e.openChannel?.(t) ?? null;
	} catch (e) {
		return s("the channel tabs ask for their ids on could not be opened.", e), null;
	}
}
function D$(e, t) {
	try {
		return e?.getItem(t) ?? null;
	} catch (e) {
		return s("reading the tab id failed.", e), null;
	}
}
function O$(e, t, n) {
	try {
		e?.setItem(t, n);
	} catch (e) {
		s("storing the tab id failed.", e);
	}
}
function k$(e, t) {
	try {
		e?.removeItem(t);
	} catch {}
}
function A$() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `tab-${typeof crypto < "u" && typeof crypto.getRandomValues == "function" ? [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16))].map((e) => e.toString(16).padStart(2, "0")).join("") : Math.random().toString(16).slice(2).padEnd(16, "0")}-${performance.now().toString(36).replace(".", "")}`;
}
//#endregion
//#region src/runtime/connection-watch.ts
var j$ = 2e3, M$ = class {
	root;
	notifications;
	graceMilliseconds;
	grace = null;
	notice = null;
	given = !1;
	constructor(e) {
		this.root = e.root, this.notifications = e.notifications, this.graceMilliseconds = e.graceMilliseconds ?? j$, e.connection.onReconnecting(() => this.reconnecting()), e.connection.onReconnected(() => this.reconnected());
	}
	reconnecting() {
		this.given || this.grace !== null || this.notice !== null || (this.grace = window.setTimeout(() => this.showReconnecting(), this.graceMilliseconds));
	}
	showReconnecting() {
		this.grace = null, this.root.setAttribute(ti, "reconnecting"), this.notice = this.notifications.show({
			message: O.text("ui.connection.reconnecting"),
			sticky: !0,
			connection: !0
		});
	}
	reconnected() {
		this.given || (this.clear(), this.root.removeAttribute(ti));
	}
	clear() {
		this.grace !== null && (window.clearTimeout(this.grace), this.grace = null), this.notice !== null && (this.notifications.dismiss(this.notice), this.notice = null);
	}
	lost() {
		this.given = !0, this.clear(), this.root.setAttribute(ti, "lost");
	}
}, N$ = "/_ne/values", P$ = 32768;
P$ / 4;
var F$ = 3e4;
function I$(e) {
	let t = JSON.stringify(e);
	if (t === void 0 || t.length * 3 <= 8192) return null;
	let n = new TextEncoder().encode(t);
	return n.byteLength > 8192 ? n : null;
}
function L$(e) {
	return e?.updates?.some((e) => typeof e.valueToken == "string") === !0;
}
async function R$(e, t = null, n = F$) {
	if (e === void 0 || !L$(e)) return e;
	await qy.settled();
	let r = await Promise.all((e.updates ?? []).map(async (e) => {
		let r = e.valueToken;
		if (typeof r != "string") return e;
		let i = t === null ? "" : `?instance=${encodeURIComponent(t)}`, a = await fetch(`${N$}/${encodeURIComponent(r)}${i}`, {
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
async function z$(e) {
	await qy.settled();
	let t = await fetch(N$, {
		method: "POST",
		body: e,
		headers: { "Content-Type": "application/json" },
		credentials: "same-origin",
		signal: AbortSignal.timeout(F$)
	});
	if (!t.ok) throw Error(`Staging a large value failed with status ${t.status}.`);
	let n = (await t.json())?.token;
	if (n === void 0 || n.length === 0) throw Error("Staging a large value answered with no token.");
	return n;
}
//#endregion
//#region src/transport/command-dispatcher.ts
var B$ = class {
	transport;
	pendingKeys = /* @__PURE__ */ new Set();
	nextRequestId = 1;
	awaited = /* @__PURE__ */ new Map();
	staging = null;
	constructor(e) {
		this.transport = e;
	}
	isPending(e) {
		return this.pendingKeys.has(V$(H$(e)));
	}
	async dispatchAsync(e) {
		let t = H$(e), n = V$(t);
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
		let t = I$(e.dynamicParameters);
		if (t === null && this.staging === null) return this.transport.processEventAsync(e);
		let n = this.staging, r = t === null ? null : z$(t), i = () => {}, a = new Promise((e) => {
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
function V$(e) {
	return e.action === void 0 ? `${JSON.stringify(e.eventId)}:${JSON.stringify(e.dynamicParameters ?? [])}` : `action:${e.action}`;
}
function H$(e) {
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
var U$ = class {
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
async function W$(e, t) {
	try {
		await e();
	} finally {
		t();
	}
}
//#endregion
//#region src/state/property-state-store.ts
var G$ = class {
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
		let i = this.createKey(e, t), a = this.values.get(i), o = a !== void 0 && fm(a.value, n);
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
		let r = K$(e, t);
		for (let e of n) this.forgetRow(r, e), this.forgetUnplaced(ya([...t, e]));
	}
	forgetHost(e, t) {
		this.forgetScope(K$(e, t));
		let n = this.unplaced.get(ya(t));
		for (let e of [...n?.children ?? []]) this.forgetUnplaced(e);
	}
	clear() {
		this.values.clear(), this.scopes.clear(), this.unplaced.clear(), this.unplacedPathByEntry.clear();
	}
	recordRows(e, t) {
		let n = null;
		for (let [r, i] of t.entries()) {
			let t = K$(i.host, i.hostParameters), a = this.rowState(t, i.key);
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
		let n = this.unplacedNode(ya([]), null), r = "";
		for (let e = 1; e <= t.length; e++) r = ya(t.slice(0, e)), n.children.add(r), n = this.unplacedNode(r, ya(t.slice(0, e - 1)));
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
		return `${T(e.componentId)}:${e.propertyId}:${ya(t)}`;
	}
};
function K$(e, t) {
	return `${e}:${ya(t)}`;
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Errors.js
var q$ = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(`${e}: Status code '${t}'`), this.statusCode = t, this.__proto__ = n;
	}
}, J$ = class extends Error {
	constructor(e = "A timeout occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, Y$ = class extends Error {
	constructor(e = "An abort occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, X$ = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "UnsupportedTransportError", this.__proto__ = n;
	}
}, Z$ = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "DisabledTransportError", this.__proto__ = n;
	}
}, Q$ = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "FailedToStartTransportError", this.__proto__ = n;
	}
}, $$ = class extends Error {
	constructor(e) {
		let t = new.target.prototype;
		super(e), this.errorType = "FailedToNegotiateWithServerError", this.__proto__ = t;
	}
}, e1 = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.innerErrors = t, this.__proto__ = n;
	}
}, t1 = class {
	constructor(e, t, n) {
		this.statusCode = e, this.statusText = t, this.content = n;
	}
}, n1 = class {
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
var r1 = class {
	constructor() {}
	log(e, t) {}
};
r1.instance = new r1();
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/pkg-version.js
var i1 = "10.0.11", Z = class {
	static isRequired(e, t) {
		if (e == null) throw Error(`The '${t}' argument is required.`);
	}
	static isNotEmpty(e, t) {
		if (!e || e.match(/^\s*$/)) throw Error(`The '${t}' argument should not be empty.`);
	}
	static isIn(e, t, n) {
		if (!(e in t)) throw Error(`Unknown ${n} value: ${e}.`);
	}
}, a1 = class e {
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
function o1(e, t) {
	let n = "";
	return c1(e) ? (n = `Binary data of length ${e.byteLength}`, t && (n += `. Content: '${s1(e)}'`)) : typeof e == "string" && (n = `String data of length ${e.length}`, t && (n += `. Content: '${e}'`)), n;
}
function s1(e) {
	let t = new Uint8Array(e), n = "";
	return t.forEach((e) => {
		n += `0x${e < 16 ? "0" : ""}${e.toString(16)} `;
	}), n.substring(0, n.length - 1);
}
function c1(e) {
	return e && typeof ArrayBuffer < "u" && (e instanceof ArrayBuffer || e.constructor && e.constructor.name === "ArrayBuffer");
}
async function l1(e, t, n, r, i, a) {
	let o = {}, [s, c] = p1();
	o[s] = c, e.log(X.Trace, `(${t} transport) sending data. ${o1(i, a.logMessageContent)}.`);
	let l = c1(i) ? "arraybuffer" : "text", u = await n.post(r, {
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
function u1(e) {
	return e === void 0 ? new f1(X.Information) : e === null ? r1.instance : e.log === void 0 ? new f1(e) : e;
}
var d1 = class {
	constructor(e, t) {
		this._subject = e, this._observer = t;
	}
	dispose() {
		let e = this._subject.observers.indexOf(this._observer);
		e > -1 && this._subject.observers.splice(e, 1), this._subject.observers.length === 0 && this._subject.cancelCallback && this._subject.cancelCallback().catch((e) => {});
	}
}, f1 = class {
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
function p1() {
	let e = "X-SignalR-User-Agent";
	return a1.isNode && (e = "User-Agent"), [e, m1(i1, h1(), _1(), g1())];
}
function m1(e, t, n, r) {
	let i = "Microsoft SignalR/", a = e.split(".");
	return i += `${a[0]}.${a[1]}`, i += ` (${e}; `, i += t && t !== "" ? `${t}; ` : "Unknown OS; ", i += `${n}`, i += r ? `; ${r}` : "; Unknown Runtime Version", i += ")", i;
}
/*#__PURE__*/ function h1() {
	if (a1.isNode) switch (process.platform) {
		case "win32": return "Windows NT";
		case "darwin": return "macOS";
		case "linux": return "Linux";
		default: return process.platform;
	}
	else return "";
}
/*#__PURE__*/ function g1() {
	if (a1.isNode) return process.versions.node;
}
function _1() {
	return a1.isNode ? "NodeJS" : "Browser";
}
function v1(e) {
	return e.stack ? e.stack : e.message ? e.message : `${e}`;
}
function y1() {
	if (typeof globalThis < "u") return globalThis;
	if (typeof self < "u") return self;
	if (typeof window < "u") return window;
	if (typeof global < "u") return global;
	throw Error("could not find global");
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js
var b1 = class extends n1 {
	constructor(t) {
		if (super(), this._logger = t, typeof fetch > "u" || a1.isNode) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._jar = new (t("tough-cookie")).CookieJar(), this._fetchType = typeof fetch > "u" ? t("node-fetch") : fetch, this._fetchType = t("fetch-cookie")(this._fetchType, this._jar);
		} else this._fetchType = fetch.bind(y1());
		if (typeof AbortController > "u") {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._abortControllerType = t("abort-controller");
		} else this._abortControllerType = AbortController;
	}
	async send(e) {
		if (e.abortSignal && e.abortSignal.aborted) throw new Y$();
		if (!e.method) throw Error("No method defined.");
		if (!e.url) throw Error("No url defined.");
		let t = new this._abortControllerType(), n;
		e.abortSignal && (e.abortSignal.onabort = () => {
			t.abort(), n = new Y$();
		});
		let r = null;
		if (e.timeout) {
			let i = e.timeout;
			r = setTimeout(() => {
				t.abort(), this._logger.log(X.Warning, "Timeout from HTTP request."), n = new J$();
			}, i);
		}
		e.content === "" && (e.content = void 0), e.content && (e.headers = e.headers || {}, c1(e.content) ? e.headers["Content-Type"] = "application/octet-stream" : e.headers["Content-Type"] = "text/plain;charset=UTF-8");
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
		if (!i.ok) throw new q$(await x1(i, "text") || i.statusText, i.status);
		let a = await x1(i, e.responseType);
		return new t1(i.status, i.statusText, a);
	}
	getCookieString(e) {
		let t = "";
		return a1.isNode && this._jar && this._jar.getCookies(e, (e, n) => t = n.join("; ")), t;
	}
};
function x1(e, t) {
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
var S1 = class extends n1 {
	constructor(e) {
		super(), this._logger = e;
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new Y$()) : e.method ? e.url ? new Promise((t, n) => {
			let r = new XMLHttpRequest();
			r.open(e.method, e.url, !0), r.withCredentials = e.withCredentials === void 0 || e.withCredentials, r.setRequestHeader("X-Requested-With", "XMLHttpRequest"), e.content === "" && (e.content = void 0), e.content && (c1(e.content) ? r.setRequestHeader("Content-Type", "application/octet-stream") : r.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"));
			let i = e.headers;
			i && Object.keys(i).forEach((e) => {
				r.setRequestHeader(e, i[e]);
			}), e.responseType && (r.responseType = e.responseType), e.abortSignal && (e.abortSignal.onabort = () => {
				r.abort(), n(new Y$());
			}), e.timeout && (r.timeout = e.timeout), r.onload = () => {
				e.abortSignal && (e.abortSignal.onabort = null), r.status >= 200 && r.status < 300 ? t(new t1(r.status, r.statusText, r.response || r.responseText)) : n(new q$(r.response || r.responseText || r.statusText, r.status));
			}, r.onerror = () => {
				this._logger.log(X.Warning, `Error from HTTP request. ${r.status}: ${r.statusText}.`), n(new q$(r.statusText, r.status));
			}, r.ontimeout = () => {
				this._logger.log(X.Warning, "Timeout from HTTP request."), n(new J$());
			}, r.send(e.content);
		}) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
}, C1 = class extends n1 {
	constructor(e) {
		if (super(), typeof fetch < "u" || a1.isNode) this._httpClient = new b1(e);
		else if (typeof XMLHttpRequest < "u") this._httpClient = new S1(e);
		else throw Error("No usable HttpClient found.");
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new Y$()) : e.method ? e.url ? this._httpClient.send(e) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
	getCookieString(e) {
		return this._httpClient.getCookieString(e);
	}
}, w1 = class e {
	static write(t) {
		return `${t}${e.RecordSeparator}`;
	}
	static parse(t) {
		if (t[t.length - 1] !== e.RecordSeparator) throw Error("Message is incomplete.");
		let n = t.split(e.RecordSeparator);
		return n.pop(), n;
	}
};
w1.RecordSeparatorCode = 30, w1.RecordSeparator = String.fromCharCode(w1.RecordSeparatorCode);
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js
var T1 = class {
	writeHandshakeRequest(e) {
		return w1.write(JSON.stringify(e));
	}
	parseHandshakeResponse(e) {
		let t, n;
		if (c1(e)) {
			let r = new Uint8Array(e), i = r.indexOf(w1.RecordSeparatorCode);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = String.fromCharCode.apply(null, Array.prototype.slice.call(r.slice(0, a))), n = r.byteLength > a ? r.slice(a).buffer : null;
		} else {
			let r = e, i = r.indexOf(w1.RecordSeparator);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = r.substring(0, a), n = r.length > a ? r.substring(a) : null;
		}
		let r = w1.parse(t), i = JSON.parse(r[0]);
		if (i.type) throw Error("Expected a handshake response from the server.");
		return [n, i];
	}
}, Q;
(function(e) {
	e[e.Invocation = 1] = "Invocation", e[e.StreamItem = 2] = "StreamItem", e[e.Completion = 3] = "Completion", e[e.StreamInvocation = 4] = "StreamInvocation", e[e.CancelInvocation = 5] = "CancelInvocation", e[e.Ping = 6] = "Ping", e[e.Close = 7] = "Close", e[e.Ack = 8] = "Ack", e[e.Sequence = 9] = "Sequence";
})(Q ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Subject.js
var E1 = class {
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
		return this.observers.push(e), new d1(this, e);
	}
}, D1 = class {
	constructor(e, t, n) {
		this._bufferSize = 1e5, this._messages = [], this._totalMessageCount = 0, this._waitForSequenceMessage = !1, this._nextReceivingSequenceId = 1, this._latestReceivedSequenceId = 0, this._bufferedByteCount = 0, this._reconnectInProgress = !1, this._protocol = e, this._connection = t, this._bufferSize = n;
	}
	async _send(e) {
		let t = this._protocol.writeMessage(e), n = Promise.resolve();
		if (this._isInvocationMessage(e)) {
			this._totalMessageCount++;
			let e = () => {}, r = () => {};
			c1(t) ? this._bufferedByteCount += t.byteLength : this._bufferedByteCount += t.length, this._bufferedByteCount >= this._bufferSize && (n = new Promise((t, n) => {
				e = t, r = n;
			})), this._messages.push(new O1(t, this._totalMessageCount, e, r));
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
			if (r._id <= e.sequenceId) t = n, c1(r._message) ? this._bufferedByteCount -= r._message.byteLength : this._bufferedByteCount -= r._message.length, r._resolver();
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
}, O1 = class {
	constructor(e, t, n, r) {
		this._message = e, this._id = t, this._resolver = n, this._rejector = r;
	}
}, k1 = 3e4, A1 = 15e3, j1 = 1e5, $;
(function(e) {
	e.Disconnected = "Disconnected", e.Connecting = "Connecting", e.Connected = "Connected", e.Disconnecting = "Disconnecting", e.Reconnecting = "Reconnecting";
})($ ||= {});
var M1 = class e {
	static create(t, n, r, i, a, o, s) {
		return new e(t, n, r, i, a, o, s);
	}
	constructor(e, t, n, r, i, a, o) {
		this._nextKeepAlive = 0, this._freezeEventListener = () => {
			this._logger.log(X.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
		}, Z.isRequired(e, "connection"), Z.isRequired(t, "logger"), Z.isRequired(n, "protocol"), this.serverTimeoutInMilliseconds = i ?? k1, this.keepAliveIntervalInMilliseconds = a ?? A1, this._statefulReconnectBufferSize = o ?? j1, this._logger = t, this._protocol = n, this.connection = e, this._reconnectPolicy = r, this._handshakeProtocol = new T1(), this.connection.onreceive = (e) => this._processIncomingData(e), this.connection.onclose = (e) => this._connectionClosed(e), this._callbacks = {}, this._methods = {}, this._closedCallbacks = [], this._reconnectingCallbacks = [], this._reconnectedCallbacks = [], this._invocationId = 0, this._receivedHandshakeResponse = !1, this._connectionState = $.Disconnected, this._connectionStarted = !1, this._cachedPingMessage = this._protocol.writeMessage({ type: Q.Ping });
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
			await this._startInternal(), a1.isBrowser && window.document.addEventListener("freeze", this._freezeEventListener), this._connectionState = $.Connected, this._connectionStarted = !0, this._logger.log(X.Debug, "HubConnection connected successfully.");
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
			this.connection.features.reconnect && (this._messageBuffer = new D1(this._protocol, this.connection, this._statefulReconnectBufferSize), this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer), this.connection.features.resend = () => {
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
		return this._connectionState = $.Disconnecting, this._logger.log(X.Debug, "Stopping HubConnection."), this._reconnectDelayHandle ? (this._logger.log(X.Debug, "Connection stopped during reconnect delay. Done reconnecting."), clearTimeout(this._reconnectDelayHandle), this._reconnectDelayHandle = void 0, this._completeClose(), Promise.resolve()) : (t === $.Connected && this._sendCloseMessage(), this._cleanupTimeout(), this._cleanupPingTimer(), this._stopDuringStartError = e || new Y$("The connection was stopped before the hub handshake could complete."), this.connection.stop(e));
	}
	async _sendCloseMessage() {
		try {
			await this._sendWithProtocol(this._createCloseMessage());
		} catch {}
	}
	stream(e, ...t) {
		let [n, r] = this._replaceStreamingParams(t), i = this._createStreamInvocation(e, t, r), a, o = new E1();
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
						this._logger.log(X.Error, `Invoke client method threw error: ${v1(e)}`);
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
							this._logger.log(X.Error, `Stream callback threw error: ${v1(e)}`);
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
		this._logger.log(X.Debug, `HubConnection.connectionClosed(${e}) called while in state ${this._connectionState}.`), this._stopDuringStartError = this._stopDuringStartError || e || new Y$("The underlying connection was closed before the hub handshake could complete."), this._handshakeResolver && this._handshakeResolver(), this._cancelCallbacksWithError(e || /* @__PURE__ */ Error("Invocation canceled due to the underlying connection being closed.")), this._cleanupTimeout(), this._cleanupPingTimer(), this._connectionState === $.Disconnecting ? this._completeClose(e) : this._connectionState === $.Connected && this._reconnectPolicy ? this._reconnect(e) : this._connectionState === $.Connected && this._completeClose(e);
	}
	_completeClose(e) {
		if (this._connectionStarted) {
			this._connectionState = $.Disconnected, this._connectionStarted = !1, this._messageBuffer &&= (this._messageBuffer._dispose(e ?? /* @__PURE__ */ Error("Connection closed.")), void 0), a1.isBrowser && window.document.removeEventListener("freeze", this._freezeEventListener);
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
				this._logger.log(X.Error, `Stream 'error' callback called with '${e}' threw error: ${v1(t)}`);
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
}, N1 = [
	0,
	2e3,
	1e4,
	3e4,
	null
], P1 = class {
	constructor(e) {
		this._retryDelays = e === void 0 ? N1 : [...e, null];
	}
	nextRetryDelayInMilliseconds(e) {
		return this._retryDelays[e.previousRetryCount];
	}
}, F1 = class {};
F1.Authorization = "Authorization", F1.Cookie = "Cookie";
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js
var I1 = class extends n1 {
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
		e.headers ||= {}, this._accessToken ? e.headers[F1.Authorization] = `Bearer ${this._accessToken}` : this._accessTokenFactory && e.headers[F1.Authorization] && delete e.headers[F1.Authorization];
	}
	getCookieString(e) {
		return this._innerClient.getCookieString(e);
	}
}, L1;
(function(e) {
	e[e.None = 0] = "None", e[e.WebSockets = 1] = "WebSockets", e[e.ServerSentEvents = 2] = "ServerSentEvents", e[e.LongPolling = 4] = "LongPolling";
})(L1 ||= {});
var R1;
(function(e) {
	e[e.Text = 1] = "Text", e[e.Binary = 2] = "Binary";
})(R1 ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AbortController.js
var z1 = class {
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
}, B1 = class {
	get pollAborted() {
		return this._pollAbort.aborted;
	}
	constructor(e, t, n) {
		this._httpClient = e, this._logger = t, this._pollAbort = new z1(), this._options = n, this._running = !1, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		if (Z.isRequired(e, "url"), Z.isRequired(t, "transferFormat"), Z.isIn(t, R1, "transferFormat"), this._url = e, this._logger.log(X.Trace, "(LongPolling transport) Connecting."), t === R1.Binary && typeof XMLHttpRequest < "u" && typeof new XMLHttpRequest().responseType != "string") throw Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
		let [n, r] = p1(), i = {
			[n]: r,
			...this._options.headers
		}, a = {
			abortSignal: this._pollAbort.signal,
			headers: i,
			timeout: 1e5,
			withCredentials: this._options.withCredentials
		};
		t === R1.Binary && (a.responseType = "arraybuffer");
		let o = `${e}&_=${Date.now()}`;
		this._logger.log(X.Trace, `(LongPolling transport) polling: ${o}.`);
		let s = await this._httpClient.get(o, a);
		s.statusCode === 200 ? this._running = !0 : (this._logger.log(X.Error, `(LongPolling transport) Unexpected response code: ${s.statusCode}.`), this._closeError = new q$(s.statusText || "", s.statusCode), this._running = !1), this._receiving = this._poll(this._url, a);
	}
	async _poll(e, t) {
		try {
			for (; this._running;) try {
				let n = `${e}&_=${Date.now()}`;
				this._logger.log(X.Trace, `(LongPolling transport) polling: ${n}.`);
				let r = await this._httpClient.get(n, t);
				r.statusCode === 204 ? (this._logger.log(X.Information, "(LongPolling transport) Poll terminated by server."), this._running = !1) : r.statusCode === 200 ? r.content ? (this._logger.log(X.Trace, `(LongPolling transport) data received. ${o1(r.content, this._options.logMessageContent)}.`), this.onreceive && this.onreceive(r.content)) : this._logger.log(X.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._logger.log(X.Error, `(LongPolling transport) Unexpected response code: ${r.statusCode}.`), this._closeError = new q$(r.statusText || "", r.statusCode), this._running = !1);
			} catch (e) {
				this._running ? e instanceof J$ ? this._logger.log(X.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._closeError = e, this._running = !1) : this._logger.log(X.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
			}
		} finally {
			this._logger.log(X.Trace, "(LongPolling transport) Polling complete."), this.pollAborted || this._raiseOnClose();
		}
	}
	async send(e) {
		return this._running ? l1(this._logger, "LongPolling", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	async stop() {
		this._logger.log(X.Trace, "(LongPolling transport) Stopping polling."), this._running = !1, this._pollAbort.abort();
		try {
			await this._receiving, this._logger.log(X.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
			let e = {}, [t, n] = p1();
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
			i ? i instanceof q$ && (i.statusCode === 404 ? this._logger.log(X.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.") : this._logger.log(X.Trace, `(LongPolling transport) Error sending a DELETE request: ${i}`)) : this._logger.log(X.Trace, "(LongPolling transport) DELETE request accepted.");
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
}, V1 = class {
	constructor(e, t, n, r) {
		this._httpClient = e, this._accessToken = t, this._logger = n, this._options = r, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		return Z.isRequired(e, "url"), Z.isRequired(t, "transferFormat"), Z.isIn(t, R1, "transferFormat"), this._logger.log(X.Trace, "(SSE transport) Connecting."), this._url = e, this._accessToken && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(this._accessToken)}`), new Promise((n, r) => {
			let i = !1;
			if (t !== R1.Text) {
				r(/* @__PURE__ */ Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
				return;
			}
			let a;
			if (a1.isBrowser || a1.isWebWorker) a = new this._options.EventSource(e, { withCredentials: this._options.withCredentials });
			else {
				let t = this._httpClient.getCookieString(e), n = {};
				n.Cookie = t;
				let [r, i] = p1();
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
						this._logger.log(X.Trace, `(SSE transport) data received. ${o1(e.data, this._options.logMessageContent)}.`), this.onreceive(e.data);
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
		return this._eventSource ? l1(this._logger, "SSE", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	stop() {
		return this._close(), Promise.resolve();
	}
	_close(e) {
		this._eventSource && (this._eventSource.close(), this._eventSource = void 0, this.onclose && this.onclose(e));
	}
}, H1 = class {
	constructor(e, t, n, r, i, a) {
		this._logger = n, this._accessTokenFactory = t, this._logMessageContent = r, this._webSocketConstructor = i, this._httpClient = e, this.onreceive = null, this.onclose = null, this._headers = a;
	}
	async connect(e, t) {
		Z.isRequired(e, "url"), Z.isRequired(t, "transferFormat"), Z.isIn(t, R1, "transferFormat"), this._logger.log(X.Trace, "(WebSockets transport) Connecting.");
		let n;
		return this._accessTokenFactory && (n = await this._accessTokenFactory()), new Promise((r, i) => {
			e = e.replace(/^http/, "ws");
			let a, o = this._httpClient.getCookieString(e), s = !1;
			if (a1.isNode || a1.isReactNative) {
				let t = {}, [r, i] = p1();
				t[r] = i, n && (t[F1.Authorization] = `Bearer ${n}`), o && (t[F1.Cookie] = o), a = new this._webSocketConstructor(e, void 0, { headers: {
					...t,
					...this._headers
				} });
			} else n && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(n)}`);
			a ||= new this._webSocketConstructor(e), t === R1.Binary && (a.binaryType = "arraybuffer"), a.onopen = (t) => {
				this._logger.log(X.Information, `WebSocket connected to ${e}.`), this._webSocket = a, s = !0, r();
			}, a.onerror = (e) => {
				let t = null;
				t = typeof ErrorEvent < "u" && e instanceof ErrorEvent ? e.error : "There was an error with the transport", this._logger.log(X.Information, `(WebSockets transport) ${t}.`);
			}, a.onmessage = (e) => {
				if (this._logger.log(X.Trace, `(WebSockets transport) data received. ${o1(e.data, this._logMessageContent)}.`), this.onreceive) try {
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
		return this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN ? (this._logger.log(X.Trace, `(WebSockets transport) sending data. ${o1(e, this._logMessageContent)}.`), this._webSocket.send(e), Promise.resolve()) : Promise.reject("WebSocket is not in the OPEN state");
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
}, U1 = 100, W1 = class {
	constructor(t, n = {}) {
		if (this._stopPromiseResolver = () => {}, this.features = {}, this._negotiateVersion = 1, Z.isRequired(t, "url"), this._logger = u1(n.logger), this.baseUrl = this._resolveUrl(t), n ||= {}, n.logMessageContent = n.logMessageContent !== void 0 && n.logMessageContent, typeof n.withCredentials == "boolean" || n.withCredentials === void 0) n.withCredentials = n.withCredentials === void 0 || n.withCredentials;
		else throw Error("withCredentials option was not a 'boolean' or 'undefined' value");
		n.timeout = n.timeout === void 0 ? 1e5 : n.timeout;
		let r = null, i = null;
		if (a1.isNode && e !== void 0) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			r = t("ws"), i = t("eventsource");
		}
		!a1.isNode && typeof WebSocket < "u" && !n.WebSocket ? n.WebSocket = WebSocket : a1.isNode && !n.WebSocket && r && (n.WebSocket = r), !a1.isNode && typeof EventSource < "u" && !n.EventSource ? n.EventSource = EventSource : a1.isNode && !n.EventSource && i !== void 0 && (n.EventSource = i), this._httpClient = new I1(n.httpClient || new C1(this._logger), n.accessTokenFactory), this._connectionState = "Disconnected", this._connectionStarted = !1, this._options = n, this.onreceive = null, this.onclose = null;
	}
	async start(e) {
		if (e ||= R1.Binary, Z.isIn(e, R1, "transferFormat"), this._logger.log(X.Debug, `Starting connection with transfer format '${R1[e]}'.`), this._connectionState !== "Disconnected") return Promise.reject(/* @__PURE__ */ Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
		if (this._connectionState = "Connecting", this._startInternalPromise = this._startInternal(e), await this._startInternalPromise, this._connectionState === "Disconnecting") {
			let e = "Failed to start the HttpConnection before stop() was called.";
			return this._logger.log(X.Error, e), await this._stopPromise, Promise.reject(new Y$(e));
		}
		if (this._connectionState !== "Connected") {
			let e = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
			return this._logger.log(X.Error, e), Promise.reject(new Y$(e));
		}
		this._connectionStarted = !0;
	}
	send(e) {
		return this._connectionState === "Connected" ? (this._sendQueue ||= new K1(this.transport), this._sendQueue.send(e)) : Promise.reject(/* @__PURE__ */ Error("Cannot send data if the connection is not in the 'Connected' State."));
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
				if (this._options.transport === L1.WebSockets) this.transport = this._constructTransport(L1.WebSockets), await this._startTransport(t, e);
				else throw Error("Negotiation can only be skipped when using the WebSocket transport directly.");
			} else {
				let n = null, r = 0;
				do {
					if (n = await this._getNegotiationResponse(t), this._connectionState === "Disconnecting" || this._connectionState === "Disconnected") throw new Y$("The connection was stopped during negotiation.");
					if (n.error) throw Error(n.error);
					if (n.ProtocolVersion) throw Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
					if (n.url && (t = n.url), n.accessToken) {
						let e = n.accessToken;
						this._accessTokenFactory = () => e, this._httpClient._accessToken = e, this._httpClient._accessTokenFactory = void 0;
					}
					r++;
				} while (n.url && r < U1);
				if (r === U1 && n.url) throw Error("Negotiate redirection limit exceeded.");
				await this._createTransport(t, this._options.transport, n, e);
			}
			this.transport instanceof B1 && (this.features.inherentKeepAlive = !0), this._connectionState === "Connecting" && (this._logger.log(X.Debug, "The HttpConnection connected successfully."), this._connectionState = "Connected");
		} catch (e) {
			return this._logger.log(X.Error, "Failed to start the connection: " + e), this._connectionState = "Disconnected", this.transport = void 0, this._stopPromiseResolver(), Promise.reject(e);
		}
	}
	async _getNegotiationResponse(e) {
		let t = {}, [n, r] = p1();
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
			return (!n.negotiateVersion || n.negotiateVersion < 1) && (n.connectionToken = n.connectionId), n.useStatefulReconnect && this._options._useStatefulReconnect !== !0 ? Promise.reject(new $$("Client didn't negotiate Stateful Reconnect but the server did.")) : n;
		} catch (e) {
			let t = "Failed to complete negotiation with the server: " + e;
			return e instanceof q$ && e.statusCode === 404 && (t += " Either this is not a SignalR endpoint or there is a proxy blocking the connection."), this._logger.log(X.Error, t), Promise.reject(new $$(t));
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
					if (this._logger.log(X.Error, `Failed to start the transport '${n.transport}': ${e}`), s = void 0, a.push(new Q$(`${n.transport} failed: ${e}`, L1[n.transport])), this._connectionState !== "Connecting") {
						let e = "Failed to select transport before stop() was called.";
						return this._logger.log(X.Debug, e), Promise.reject(new Y$(e));
					}
				}
			}
		}
		return a.length > 0 ? Promise.reject(new e1(`Unable to connect to the server with any of the available transports. ${a.join(" ")}`, a)) : Promise.reject(/* @__PURE__ */ Error("None of the transports supported by the client are supported by the server."));
	}
	_constructTransport(e) {
		switch (e) {
			case L1.WebSockets:
				if (!this._options.WebSocket) throw Error("'WebSocket' is not supported in your environment.");
				return new H1(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
			case L1.ServerSentEvents:
				if (!this._options.EventSource) throw Error("'EventSource' is not supported in your environment.");
				return new V1(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
			case L1.LongPolling: return new B1(this._httpClient, this._logger, this._options);
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
		let i = L1[e.transport];
		if (i == null) return this._logger.log(X.Debug, `Skipping transport '${e.transport}' because it is not supported by this client.`), /* @__PURE__ */ Error(`Skipping transport '${e.transport}' because it is not supported by this client.`);
		if (G1(t, i)) {
			if (e.transferFormats.map((e) => R1[e]).indexOf(n) >= 0) {
				if (i === L1.WebSockets && !this._options.WebSocket || i === L1.ServerSentEvents && !this._options.EventSource) return this._logger.log(X.Debug, `Skipping transport '${L1[i]}' because it is not supported in your environment.'`), new X$(`'${L1[i]}' is not supported in your environment.`, i);
				this._logger.log(X.Debug, `Selecting transport '${L1[i]}'.`);
				try {
					return this.features.reconnect = i === L1.WebSockets ? r : void 0, this._constructTransport(i);
				} catch (e) {
					return e;
				}
			}
			return this._logger.log(X.Debug, `Skipping transport '${L1[i]}' because it does not support the requested transfer format '${R1[n]}'.`), /* @__PURE__ */ Error(`'${L1[i]}' does not support ${R1[n]}.`);
		}
		return this._logger.log(X.Debug, `Skipping transport '${L1[i]}' because it was disabled by the client.`), new Z$(`'${L1[i]}' is disabled by the client.`, i);
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
		if (!a1.isBrowser) throw Error(`Cannot resolve '${e}'.`);
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
function G1(e, t) {
	return !e || (t & e) !== 0;
}
var K1 = class e {
	constructor(e) {
		this._transport = e, this._buffer = [], this._executing = !0, this._sendBufferedData = new q1(), this._transportResult = new q1(), this._sendLoopPromise = this._sendLoop();
	}
	send(e) {
		return this._bufferData(e), this._transportResult ||= new q1(), this._transportResult.promise;
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
			this._sendBufferedData = new q1();
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
}, q1 = class {
	constructor() {
		this.promise = new Promise((e, t) => [this._resolver, this._rejecter] = [e, t]);
	}
	resolve() {
		this._resolver();
	}
	reject(e) {
		this._rejecter(e);
	}
}, J1 = "json", Y1 = class {
	constructor() {
		this.name = J1, this.version = 2, this.transferFormat = R1.Text;
	}
	parseMessages(e, t) {
		if (typeof e != "string") throw Error("Invalid input for JSON hub protocol. Expected a string.");
		if (!e) return [];
		t === null && (t = r1.instance);
		let n = w1.parse(e), r = [];
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
		return w1.write(JSON.stringify(e));
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
}, X1 = {
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
function Z1(e) {
	let t = X1[e.toLowerCase()];
	if (t !== void 0) return t;
	throw Error(`Unknown log level: ${e}`);
}
var Q1 = class {
	configureLogging(e) {
		if (Z.isRequired(e, "logging"), $1(e)) this.logger = e;
		else if (typeof e == "string") {
			let t = Z1(e);
			this.logger = new f1(t);
		} else this.logger = new f1(e);
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
		return this.reconnectPolicy = e ? Array.isArray(e) ? new P1(e) : e : new P1(), this;
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
		let t = new W1(this.url, e);
		return M1.create(t, this.logger || r1.instance, this.protocol || new Y1(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
	}
};
function $1(e) {
	return e.log !== void 0;
}
//#endregion
//#region src/transport/attach-gate.ts
var e0 = class extends Error {
	byServerError;
	constructor(e) {
		super("the connection to the server dropped under the call; it is reconnecting.", { cause: e }), this.name = "ConnectionDropped", this.byServerError = e instanceof Error && e.message.startsWith("Server returned an error on close");
	}
}, t0 = class {
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
}, n0 = 500;
function r0(e) {
	let { changes: t, ...n } = e;
	return n;
}
function i0() {
	return {};
}
function a0(e) {
	return typeof e == "string" ? e : null;
}
var o0 = class {
	windowId;
	connection;
	started = !1;
	gate = new t0();
	inbound;
	constructor(e, t, n = {}) {
		this.windowId = e, this.inbound = new U$(t), this.connection = new Q1().withUrl(n.hubUrl ?? "/_ne/hub").withAutomaticReconnect([...n.reconnectDelays ?? [
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
		this.connection.on("ui.changes", this.inbound.pushed((t, n) => e(t, a0(n))));
	}
	onCommandResult(e) {
		this.connection.on("ui.commandResult", this.inbound.pushed((t, n) => e(t, a0(n))));
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
		return await this.invokeAsync("ProcessEventAsync", [e], (e) => this.inbound.answered(e, (e) => e.changes, r0));
	}
	async requestLeaveAsync(e) {
		return await this.invokeAsync("RequestLeaveAsync", [{ target: e }], (e) => this.inbound.answered(e, (e) => e.changes, r0));
	}
	async navigateInPlaceAsync(e) {
		return await this.invokeAsync("NavigateInPlaceAsync", [{ parameters: e }], (e) => this.inbound.answered(e, (e) => e.changes, r0));
	}
	async processChangeSetAsync(e, t) {
		try {
			await this.invokeAsync("ProcessChangeSetAsync", [e], (e) => this.inbound.answered(e, (e) => e, i0, t));
		} catch (e) {
			throw this.isReconnecting && this.gate.failure === null ? new e0(e) : e;
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
		await this.invokeAsync("RequestItemWindowAsync", [e], (e) => this.inbound.answered(e, (e) => e, i0));
	}
	async invokeAsync(e, t, n) {
		let r = window.setTimeout(() => s("call waiting behind the attach.", { methodName: e }), n0);
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
}, s0 = Promise.resolve(), c0 = () => {}, l0 = P$ * 3 / 4, u0 = 128, d0 = class {
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
		if (this.handed >= this.given) return s0;
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
		for (; this.flight !== null;) await this.flight.catch(c0);
	}
	dispatchAsync(e, t) {
		let n = ++this.given, r = I$(e.value), i = r === null ? null : z$(r);
		return i?.catch(c0), new Promise((a, o) => {
			let s = p0(e), c = this.queue.findIndex((e) => e.field === s), l = [{
				resolve: a,
				reject: o
			}], u = n;
			c >= 0 && (l = [...this.queue[c].settles, ...l], u = this.queue[c].sequence, this.queue.splice(c, 1));
			let d = r === null ? f0(e) : f0({
				...e,
				value: void 0
			}) + u0;
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
		let i = n.length === 0 ? null : this.transport.processChangeSetAsync({ updates: n }, m0(r));
		if (this.markHanded(t), i !== null) try {
			await i;
			for (let e of r) for (let t of e.settles) t.resolve();
		} catch (e) {
			if (e instanceof e0) {
				this.requeue(r, e);
				return;
			}
			for (let t of r) for (let n of t.settles) n.reject(e);
		}
	}
	takeBatch() {
		let e = 0, t = 0;
		for (; e < this.queue.length && (e === 0 || t + this.queue[e].bytes <= l0);) t += this.queue[e].bytes, e++;
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
		let t = this.transport.whenAttached().then(() => z$(e));
		return t.catch(c0), t;
	}
	markHanded(e) {
		this.handed = Math.max(this.handed, e);
		for (let e = this.sentWaiters.length - 1; e >= 0; e--) {
			let t = this.sentWaiters[e];
			t.through <= this.handed && (this.sentWaiters.splice(e, 1), t.resolve());
		}
	}
};
function f0(e) {
	return new TextEncoder().encode(JSON.stringify(e)).byteLength;
}
function p0(e) {
	return `${e.componentId}:${e.propertyName}:${JSON.stringify(e.dynamicParameters)}`;
}
function m0(e) {
	let t = e.map((e) => e.before).filter((e) => e !== void 0);
	if (t.length !== 0) return () => {
		for (let e of t) e();
	};
}
//#endregion
//#region src/updates/content-fills.ts
var h0 = "content-fills", g0 = "content", _0 = "data-ui-root", v0 = "--ui-height", y0 = "var(--ui-fill-height";
function b0(e) {
	let t = e.parentElement;
	if (t === null || t.getAttribute("data-ui-region") !== "content") return;
	let n = t.parentElement;
	if (n === null || !n.hasAttribute(_0)) return;
	let r = e.style.getPropertyValue(v0).trimStart().startsWith(y0);
	n.hasAttribute("data-ui-content-fills") !== r && n.toggleAttribute(Pn, r);
}
//#endregion
//#region src/updates/form-owner.ts
var x0 = "form-owner", S0 = "ui-form-";
function C0(e) {
	return S0 + e.replace(/[ \t\n\f\r]/g, "_");
}
function w0(e, t) {
	if (typeof t != "string" || t.trim().length === 0) {
		e.hasAttribute("form") && e.removeAttribute("form");
		return;
	}
	let n = C0(t);
	E0(n), e.getAttribute("form") !== n && e.setAttribute("form", n);
}
function T0(e) {
	for (let t of e.querySelectorAll("[form]")) {
		let e = t.getAttribute("form");
		e !== null && e.startsWith(S0) && E0(e);
	}
}
function E0(e) {
	let t = D0();
	if (t.querySelector(`form[id="${C(e)}"]`) !== null) return;
	let n = document.createElement("form");
	n.setAttribute("id", e), n.setAttribute("method", "dialog"), n.setAttribute("novalidate", ""), t.appendChild(n);
}
function D0() {
	let e = document.body.querySelector(`[${ln}]`);
	if (e !== null) return e;
	let t = document.createElement("div");
	return t.setAttribute(ln, ""), t.setAttribute("hidden", ""), document.body.appendChild(t);
}
//#endregion
//#region src/interactions/legacy-commands.ts
var O0 = document;
function k0() {
	try {
		return O0.execCommand("copy");
	} catch {
		return !1;
	}
}
function A0(e) {
	try {
		return typeof O0.execCommand == "function" && O0.execCommand("insertText", !1, e);
	} catch {
		return !1;
	}
}
//#endregion
//#region src/interactions/lightbox.ts
var j0 = "ui-lightbox", M0 = "ui-lightbox-title", N0 = new ux("data-ui-lightbox-part"), P0 = "data-ui-lightbox-set", F0 = "data-ui-lightbox-slot", I0 = "data-ui-lightbox-still", L0 = "--ui-lightbox-shift", R0 = 16, z0 = 1 / 5, B0 = null, V0 = null, H0 = null;
function U0(e, t, n) {
	let r = t.filter((e) => bo(e.source) !== null);
	if (r.length === 0) return s("show image effect carries no picture the page may fetch.", t), !1;
	B0 ??= J0(e), (B0.dialog.hasAttribute("hidden") || !B0.dialog.isConnected) && document.body.append(B0.dialog);
	let i = t.slice(0, Math.max(0, n)).filter((e) => bo(e.source) === null).length;
	H0 = null, V0 = {
		pictures: r,
		index: q0(n - i, r.length)
	}, B0.dialog.toggleAttribute(P0, r.length > 1);
	for (let e of B0.neighbours) e.hidden = r.length < 2;
	return n2(B0), r2(B0, V0), e.open(j0);
}
function W0(e, t, n) {
	let r = G0(e);
	if (r === null) return null;
	let i = e.closest(`[${x}]`);
	if (!t || i === null) return {
		pictures: [r],
		start: 0
	};
	let a = [], o = 0;
	for (let t of [...n(e)].filter((e) => e.closest(`[${x}]`) === i).sort(K0)) {
		let n = t === e ? r : G0(t);
		n !== null && (t === e && (o = a.length), a.push(n));
	}
	return {
		pictures: a,
		start: o
	};
}
function G0(e) {
	let t = e.matches("img") ? e : e.querySelector("img");
	if (t === null || t.closest("[data-ui-image-failed]") !== null) return null;
	let n = t.currentSrc, r = bo(typeof n == "string" && n.length > 0 ? n : t.getAttribute("src") ?? "");
	return r === null ? null : {
		source: r,
		altText: t.getAttribute("alt") ?? ""
	};
}
function K0(e, t) {
	return e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}
function q0(e, t) {
	return Math.min(Math.max(0, Math.trunc(Number.isFinite(e) ? e : 0)), t - 1);
}
function J0(e) {
	let { dialog: t, surface: n } = lx({
		key: j0,
		className: "ui-lightbox",
		surfaceClassName: "ui-lightbox__surface",
		role: "dialog",
		labelledBy: M0,
		closesOnEscapeAndBackdrop: !0
	}), r = N0.element("h2", "ui-lightbox__title"), i = X0("ui-lightbox__close", "close"), a = N0.element("div", "ui-lightbox__stage"), [o, s] = Y0("previous"), [c, l] = Y0("current"), [u, d] = Y0("next"), f = N0.element("div", "ui-lightbox__nav"), p = X0("ui-lightbox__step ui-lightbox__step--previous", "previous"), m = X0("ui-lightbox__step ui-lightbox__step--next", "next"), h = N0.element("span", "ui-lightbox__counter ui-text-type--caption"), g = N0.element("span", "ui-lightbox__count-room"), _ = N0.element("span", "ui-lightbox__count"), v = N0.element("p", "ui-lightbox__caption ui-text-type--body", "caption");
	return r.id = M0, _.setAttribute("aria-live", "polite"), g.setAttribute("aria-hidden", "true"), O.write(r, null, "ui.lightbox.label"), O.write(i, "aria-label", "ui.action.close"), O.write(p, "aria-label", "ui.lightbox.previous"), O.write(m, "aria-label", "ui.lightbox.next"), h.append(g, _), f.append(p, h, m), c.append(f), a.append(o, c, u), n.append(r, i, a, v), t.addEventListener("click", (t) => {
		switch (N0.pressed(t)) {
			case "close":
				e.dismiss(j0);
				break;
			case "previous":
				Z0(-1);
				break;
			case "next": Z0(1);
		}
	}), t.addEventListener("keydown", (e) => {
		if (e.defaultPrevented || !N(e) || V0 === null || V0.pictures.length < 2) return;
		let n = e.key === "ArrowLeft" ? -1 : +(e.key === "ArrowRight");
		n !== 0 && (e.preventDefault(), Z0(a2(t) ? -n : n));
	}), o2(t, a), {
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
function Y0(e) {
	let t = N0.element("div", "ui-lightbox__figure"), n = N0.element("img", "ui-lightbox__picture", e === "current" ? "picture" : void 0);
	return t.setAttribute(F0, e), n.decoding = "async", n.draggable = !1, n.addEventListener("error", () => n.setAttribute(ct, "")), e !== "current" && t.setAttribute("aria-hidden", "true"), t.append(n), [t, n];
}
function X0(e, t) {
	let n = N0.element("button", e, t);
	return n.type = "button", n;
}
function Z0(e) {
	if (B0 === null || V0 === null || V0.pictures.length < 2) return;
	let t = B0;
	if (e2(t), gh()) {
		t2(t, e), n2(t), r2(t, V0);
		return;
	}
	let n = {
		by: e,
		landed: !1
	}, r = a2(t.dialog) ? -1 : 1;
	H0 = n, t.stage.removeAttribute(I0), t.stage.style.setProperty(L0, `${-e * r * Q0(t.stage)}px`), vh(t.current, B.normal + 100, () => $0(t, n));
}
function Q0(e) {
	return e.getBoundingClientRect().width + R0;
}
function $0(e, t) {
	if (H0 !== t || t.landed) return;
	t2(e, t.by), t.landed = !0;
	let n = typeof e.picture.decode == "function" ? e.picture.decode().catch(() => void 0) : null;
	n === null ? e2(e) : n.then(() => {
		H0 === t && e2(e);
	});
}
function e2(e) {
	let t = H0;
	t !== null && V0 !== null && (H0 = null, t.landed || t2(e, t.by), n2(e), r2(e, V0));
}
function t2(e, t) {
	if (V0 === null) return;
	let n = V0.pictures.length;
	V0.index = ((V0.index + t) % n + n) % n, i2(e.picture, V0.pictures[V0.index].source);
}
function n2(e) {
	e.stage.setAttribute(I0, ""), e.stage.style.setProperty(L0, "0px"), e.stage.getBoundingClientRect();
}
function r2(e, t) {
	let n = t.pictures.length, r = t.pictures[t.index];
	i2(e.picture, r.source), i2(e.previousPicture, t.pictures[(t.index + n - 1) % n].source), i2(e.nextPicture, t.pictures[(t.index + 1) % n].source), O.writeValue(e.picture, "alt", r.altText ?? r.caption ?? ""), O.writeValue(e.caption, null, r.caption ?? ""), e.caption.hidden = r.caption === void 0, O.write(e.count, null, "ui.lightbox.counter", {
		index: t.index + 1,
		count: n
	}), O.write(e.countRoom, null, "ui.lightbox.counter", {
		index: n,
		count: n
	});
}
function i2(e, t) {
	e.getAttribute("src") !== t && (e.removeAttribute(ct), e.src = t);
}
function a2(e) {
	return getComputedStyle(e).direction === "rtl";
}
function o2(e, t) {
	P_(e, {
		axis: "x",
		begins: (e) => e.pointerType !== "touch" || B0 === null || V0 === null || V0.pictures.length < 2 ? !1 : (e2(B0), !0),
		start: () => t.setAttribute(I0, ""),
		follow: (e) => t.style.setProperty(L0, `${e}px`),
		end: (n, r, i) => {
			i && s2(n, window.innerWidth, r) ? Z0((a2(e) ? n > 0 : n < 0) ? 1 : -1) : (t.removeAttribute(I0), t.style.setProperty(L0, "0px"));
		}
	});
}
function s2(e, t, n) {
	return Math.abs(e) > t * z0 || Math.abs(n) > .5 && Math.abs(e) > 6;
}
//#endregion
//#region src/interactions/notification-engine.ts
var c2 = "ui-notification-host", l2 = "ui-notification", u2 = "ui-notification--leaving", d2 = "ui-notification__message", f2 = "ui-notification__title", p2 = "ui-notification__action", m2 = "ui-notification__close", h2 = 5e3, g2 = 8e3, _2 = "ui-notification--connection", v2 = "--ui-notification-lift", y2 = /* @__PURE__ */ new Set([
	"info",
	"success",
	"warning",
	"danger",
	"primary",
	"accent"
]), b2 = class {
	root;
	components;
	durationMs;
	host = null;
	announcer;
	focusOrigins = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, this.durationMs = e.durationMs ?? h2, this.ensureHost(), this.announcer = qA(this.root instanceof Document ? this.root.body : this.root), __((e) => e instanceof Element && e.closest(`.${l2}`) !== null);
	}
	announce(e, t) {
		return this.announcer.announce(e, t);
	}
	show(e) {
		let t = tw(e.severity), n = document.createElement("div");
		n.className = y2.has(t) ? `${l2} ${l2}--${t}` : l2, n.classList.toggle(_2, e.connection === !0), t === "danger" && n.setAttribute("role", "alert");
		let r = document.createElement("span");
		if (r.className = d2, e.title !== void 0) {
			let t = document.createElement("span");
			t.className = f2, O.writeValue(t, null, e.title), n.append(t);
		}
		typeof e.message == "string" ? r.textContent = e.message : O.writeValue(r, null, e.message), n.append(r);
		let i = document.createElement("button");
		return i.type = "button", i.className = `${m2} ${Ri}`, O.write(i, "aria-label", "ui.action.close"), O.write(i, Re, "ui.action.close"), i.addEventListener("click", () => this.dismiss(n)), n.append(i), e.action !== void 0 && n.append(w2(e.action, e.sticky === !0 ? null : () => this.dismiss(n))), n.addEventListener("keydown", (e) => {
			e.key !== "Escape" || e.defaultPrevented || M(e) || (e.preventDefault(), this.dismiss(n));
		}), n.addEventListener("focusin", (e) => {
			let t = e.relatedTarget;
			t instanceof HTMLElement && !n.contains(t) && this.focusOrigins.set(n, t);
		}), x2(() => {
			if (n.classList.contains(u2)) return;
			let t = this.ensureHost();
			S2(t), t.append(n), e.sticky !== !0 && this.standFor(n, e);
		}), n;
	}
	standFor(e, t) {
		let n = t.durationMs !== void 0 && t.durationMs > 0 ? t.durationMs : t.action === void 0 ? this.durationMs : g2, r = !1, i = !1, a = window.setTimeout(() => this.dismiss(e), n), o = () => window.clearTimeout(a), s = () => {
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
		e.classList.contains(u2) || (e.classList.add(u2), e.isConnected && (this.returnFocus(e), gh() || typeof e.animate != "function" ? e.remove() : window.setTimeout(() => C2(e), B.fast)));
	}
	returnFocus(e) {
		if (!e.contains(document.activeElement)) return;
		let t = [...e.parentElement?.children ?? []].find((t) => t !== e && !t.classList.contains(u2));
		um(om(this.focusOrigins.get(e), this.components) ?? t?.querySelector(`.${m2}`) ?? null, e);
	}
	ensureHost() {
		if (this.host !== null && this.host.isConnected) return this.host;
		let e = this.root instanceof Document ? this.root.body : this.root, t = e.querySelector(`.${c2}`), n = t ?? document.createElement("div");
		return n.classList.add(c2), n.setAttribute("role", "status"), n.setAttribute("aria-live", "polite"), t === null && e.append(n), this.host = n, n;
	}
};
function x2(e) {
	if (Tq(document.visibilityState)) {
		e();
		return;
	}
	let t = () => {
		Tq(document.visibilityState) && (document.removeEventListener("visibilitychange", t), e());
	};
	document.addEventListener("visibilitychange", t);
}
function S2(e) {
	let t = window.innerHeight - Dg(window.innerHeight);
	t > 0 ? e.style.setProperty(v2, `${Math.round(t)}px`) : e.style.removeProperty(v2);
}
function C2(e) {
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
function w2(e, t) {
	let n = document.createElement("button"), r = !1;
	return n.type = "button", n.className = `${p2} ui-button ui-button--primary ui-button--small`, typeof e.label == "string" ? n.textContent = e.label : O.writeValue(n, null, e.label), n.addEventListener("click", () => {
		if (r) return;
		let n = e.run();
		t !== null && (r = !0, n === void 0 ? t() : n.then((e) => {
			e ? t() : r = !1;
		}, (e) => {
			r = !1, s("a notification's action failed.", e);
		}));
	}), n;
}
function T2(e, t) {
	let n = E2(e), r = e?.label;
	if (n !== void 0) {
		if (!D(r) && !Oc(r)) s("a notification's action carries no words.", e);
		else return {
			label: r,
			run: () => t(n)
		};
	}
}
function E2(e) {
	return e != null && typeof e.id == "string" && e.id.length > 0 ? e.id : void 0;
}
//#endregion
//#region src/effects/development-report.ts
function D2(e) {
	let t = e.message;
	c(typeof t == "string" && t.length > 0 ? t : "the server reported a mistake with no words.", e);
}
//#endregion
//#region src/effects/insert-text.ts
function O2(e, t, n) {
	let r = e.itemKey === !0 ? k2(n) : e.text;
	if (typeof r != "string") {
		s(e.itemKey === !0 ? "insert text effect reads the row's key but ran for no row." : "insert text effect carries no text.", e);
		return;
	}
	let i = A2(t);
	i === null ? s("insert text effect target holds no text field.", e) : j2(i, r);
}
function k2(e) {
	let t = e.length === 0 ? null : e[e.length - 1];
	return t == null ? null : String(t);
}
function A2(e) {
	if (td(e)) return e;
	for (let t of e.querySelectorAll("input, textarea")) if (td(t)) return t;
	return null;
}
function j2(e, t) {
	if (t.length === 0 || e.readOnly || e.disabled || k(e) || j(e)) return !1;
	let n = e.value, r = e.selectionStart !== null, i = e.selectionStart ?? n.length, a = e.selectionEnd ?? i;
	return e.maxLength >= 0 && n.length - (a - i) + t.length > e.maxLength ? !1 : (document.activeElement !== e && e.focus({ preventScroll: !0 }), r && e.setSelectionRange(i, a), document.activeElement === e && A0(t) && e.value !== n || (r ? e.setRangeText(t, i, a, "end") : e.value = n + t, e.dispatchEvent(new Event("input", { bubbles: !0 }))), !0);
}
//#endregion
//#region src/effects/navigation-url.ts
function M2(e) {
	let t = e.request?.route;
	return t == null || t.length === 0 ? null : N2(t, e.request?.parameters ?? null);
}
function N2(e, t) {
	let n = P2(t);
	if (n.length === 0) return e;
	let r = e.indexOf("#"), i = r < 0 ? e : e.slice(0, r), a = r < 0 ? "" : e.slice(r);
	return `${i}${i.includes("?") ? i.endsWith("?") || i.endsWith("&") ? "" : "&" : "?"}${n}${a}`;
}
function P2(e) {
	if (e === null) return "";
	let t = new URLSearchParams();
	for (let [n, r] of Object.entries(e)) if (r != null) for (let e of Array.isArray(r) ? r : [r]) e != null && t.append(n, F2(e));
	return t.toString();
}
function F2(e) {
	return typeof e == "object" ? JSON.stringify(e) : String(e);
}
//#endregion
//#region src/effects/scroller.ts
function I2(e, t) {
	let n = R2([e, ...e.querySelectorAll("*")], t);
	if (n !== null) return n;
	let r = [];
	for (let t = e.parentElement; t !== null; t = t.parentElement) r.push(t);
	return R2(r, t) ?? L2(t);
}
function L2(e) {
	let t = typeof document > "u" ? null : document.scrollingElement ?? null;
	return t !== null && z2(t, e) ? t : null;
}
function R2(e, t) {
	let n = null;
	for (let r of e) if (Wg(r, t)) {
		if (z2(r, t)) return r;
		n ??= r;
	}
	return n;
}
function z2(e, t) {
	return t ? e.scrollHeight > e.clientHeight : e.scrollWidth > e.clientWidth;
}
//#endregion
//#region src/effects/shown-text.ts
var B2 = `.${Hi}`;
function V2(e) {
	let t = (e.hasAttribute("data-ui-text-description") ? H2(e) : null) ?? e;
	return (("innerText" in t && typeof t.innerText == "string" ? t.innerText : t.textContent) ?? "").trim();
}
function H2(e) {
	for (let t of e.querySelectorAll(B2)) if (t.closest("[data-ui-id]") === e) return t;
	return null;
}
//#endregion
//#region src/effects/effect-registry.ts
var U2 = class {
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
		this.handlers.set(Sa(e), t);
	}
	applyAll(e, t) {
		if (e != null) for (let n of e) this.apply({
			effect: n,
			dom: t
		});
	}
	apply(e) {
		let t = Sa(e.effect?.kind), n = t.length === 0 ? void 0 : this.handlers.get(t);
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
			let t = M2(e.effect);
			t === null ? s("navigate effect carries no route.", e.effect) : ho(t) ? this.leaveFor(t) : s("navigate effect names no route of this site; not followed.", e.effect);
		}), this.register("NavigateBack", (e) => {
			if (this.address?.back() === !0) return;
			let t = e.effect.fallback;
			typeof t != "string" || !ho(t) ? s("navigate back effect has nothing to go back to and names no route of this site; not followed.", e.effect) : this.leaveFor(t);
		}), this.register("ReplaceAddress", (e) => {
			this.writeAddress(e, (e, t) => e.replace(t));
		}), this.register("PushAddress", (e) => {
			this.writeAddress(e, (e, t) => e.push(t));
		}), this.register("SetTheme", (e) => {
			let t = e.effect, n = Ea(t.mode), r = n === "Unknown" ? "auto" : n.toLowerCase();
			document.documentElement.getAttribute("data-ui-theme") !== r && document.documentElement.setAttribute(Wr, r), t.stored !== !0 && this.reportTheme?.(r);
		}), this.register("Focus", (e) => {
			let t = Y2(e);
			t !== null && (aY(t), Z2(t));
		}), this.register("ScrollTo", (e) => {
			let t = Y2(e);
			if (t === null) return;
			let n = e.effect, r = Ca(n.behavior), i = wa(n.block);
			aY(t), t.scrollIntoView({
				behavior: X2(r),
				block: i === "Unknown" ? "nearest" : i.toLowerCase()
			});
		}), this.register("ScrollToItem", (e) => {
			let t = Y2(e);
			if (t === null) return;
			let n = e.effect, r = GJ(t);
			if (r === null || typeof n.key != "string" || n.key.length === 0) {
				s("scroll to item effect names no items host or no key.", e.effect);
				return;
			}
			let i = wa(n.block);
			aY(Sd(r)), KJ(r, n.key, i === "Unknown" ? "Start" : i, X2(Ca(n.behavior))) || s("scroll to item effect names a row the host has not drawn.", e.effect);
		}), this.register("Scroll", (e) => {
			let t = Y2(e);
			if (t === null) return;
			let n = e.effect, r = Da(n.axis) !== "Horizontal", i = I2(t, r);
			if (i === null) {
				s("scroll effect target has no scrollable element.", e.effect);
				return;
			}
			let a = r ? i.clientHeight : i.clientWidth, o = (r ? i.scrollHeight : i.scrollWidth) - a, c = r ? i.scrollTop : i.scrollLeft, l = Ta(n.position), u;
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
			let d = X2(Ca(n.behavior));
			aY(i), r && l === "End" && lY(i) && iY(i), i.scrollTo(r ? {
				top: u,
				behavior: d
			} : {
				left: u,
				behavior: d
			});
		}), this.register("Show", (e) => {
			J2(Y2(e), null);
		}), this.register("Hide", (e) => {
			J2(Y2(e), "hidden");
		}), this.register("Collapse", (e) => {
			J2(Y2(e), "collapsed");
		}), this.register("CopyToClipboard", (e) => {
			let t = Q2(e, this.valueReaders);
			t !== null && $2(t).catch((e) => s("copy to clipboard failed.", e));
		}), this.register("InsertText", (e) => {
			let t = Y2(e);
			t !== null && O2(e.effect, t, e.row ?? []);
		}), this.register("OpenPicker", (e) => {
			let t = Y2(e);
			t !== null && !gb(t) && s("open picker effect names no file or image input.", e.effect);
		}), this.register("OpenDialog", (e) => {
			this.applyDialogEffect(e, "OpenDialog", (e, t) => e.open(t));
		}), this.register("ShowImage", (e) => {
			let t = e.effect;
			if (this.dialogs === void 0) {
				s("show image effect arrived but no dialog engine is wired up.", t);
				return;
			}
			if (t.target === void 0 || t.target === null) {
				U0(this.dialogs, G2(t.images), t.startIndex ?? 0);
				return;
			}
			let n = Y2(e), r = n === null ? null : W0(n, t.rows === !0, (t) => e.dom.findEveryComponent(E(t)));
			r === null ? s("show image effect names a component that shows no picture.", t) : U0(this.dialogs, r.pictures, r.start);
		}), this.register("CloseDialog", (e) => {
			let t = e.effect.raisesClose === !0;
			this.applyDialogEffect(e, "CloseDialog", (e, n) => t ? e.dismiss(n) : e.close(n));
		}), this.register("DownloadFile", (e) => {
			let t = e.effect;
			if (t.requestPath === void 0 || t.requestPath.length === 0) {
				s("download effect carries no path.", e.effect);
				return;
			}
			if (!uo(t.requestPath)) {
				s("download effect refused: the path's scheme is not one a link may carry.", e.effect);
				return;
			}
			let n = t.requestPath;
			qy.load(() => {
				let e = document.createElement("a");
				e.href = n, e.download = t.fileName ?? "", e.style.display = "none", document.body.appendChild(e), e.click(), e.remove();
			});
		}), this.register("ShowNotification", (e) => {
			let t = e.effect;
			!D(t.message) && !Oc(t.message) ? s("show notification effect carries no message.", e.effect) : this.notifications === void 0 ? s("show notification effect arrived but no notification engine is wired up.", t.message) : this.notifications.show({
				message: t.message,
				severity: t.severity,
				durationMs: typeof t.durationMs == "number" ? t.durationMs : void 0,
				action: this.runAction === void 0 ? void 0 : T2(t.action, this.runAction)
			});
		}), this.register("RequestNotificationPermission", () => {
			Eq() !== void 0 && Notification.requestPermission().then(() => this.clientStateChanged?.()).catch((e) => s("asking for the notification permission failed.", e));
		}), this.register("ShowSystemNotification", (e) => this.showSystemNotification(e.effect)), this.register("Announce", (e) => {
			let t = e.effect;
			!D(t.message) && !Oc(t.message) ? s("announce effect carries no message.", e.effect) : this.notifications === void 0 ? s("announce effect arrived but no notification engine is wired up.", t.message) : this.notifications.announce(t.message, Oa(t.politeness) === "Assertive" ? "assertive" : "polite");
		}), this.register("DevelopmentReport", (e) => D2(e.effect));
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
		if (!D(t) && !Oc(t)) {
			s("system notification effect carries no title.", e);
			return;
		}
		let n = D(e.body) || Oc(e.body) ? e.body : void 0, r = typeof e.address == "string" && ho(e.address) ? e.address : void 0, i = () => {
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
		if (e.when !== "Always" && Tq(document.visibilityState)) {
			i();
			return;
		}
		let a = E2(e.action);
		jq({
			title: W2(t),
			body: n === void 0 ? void 0 : W2(n),
			tag: e.tag ?? "",
			icon: typeof e.icon == "string" && ho(e.icon) ? e.icon : K2(),
			silent: e.silent === !0,
			requireInteraction: e.requireInteraction === !0,
			address: r ?? q2(),
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
		return t !== void 0 && n !== void 0 && Nq(t) ? {
			label: D(e.addressLabel) || Oc(e.addressLabel) ? e.addressLabel : { key: "ui.notification.open" },
			run: () => n(t)
		} : this.runAction === void 0 ? void 0 : T2(e.action, this.runAction);
	}
};
function W2(e) {
	return D(e) ? O.translate(e.key, e.args) : Oc(e) ? O.resolveText(e.text) : "";
}
function G2(e) {
	let t = [];
	for (let n of e ?? []) typeof n?.source == "string" && t.push({
		source: n.source,
		caption: D(n.caption) || Oc(n.caption) ? n.caption : void 0,
		altText: D(n.altText) || Oc(n.altText) ? n.altText : void 0
	});
	return t;
}
function K2() {
	let e = document.querySelector("link[rel~='icon']")?.href;
	return e === void 0 || e.startsWith("data:") ? void 0 : e;
}
function q2() {
	return window.location.pathname + window.location.search + window.location.hash;
}
function J2(e, t) {
	if (e === null) return;
	let n = zm();
	for (let n of bi) t === null ? e.removeAttribute(n) : e.setAttribute(n, t);
	n !== null && Bm(n);
}
function Y2(e) {
	let t = e.effect.target;
	if (t === void 0 || t.id === void 0) return s("targeted client effect carries no resolved component address.", e.effect), null;
	let n = e.dom.findComponent(T(t.id), t.dynamicParameters ?? []);
	return n === null && s("client effect target was not found in the DOM.", e.effect), n;
}
function X2(e) {
	return e === "Smooth" && !gh() ? "smooth" : "auto";
}
function Z2(e) {
	if (e instanceof HTMLElement && (e.tabIndex >= 0 || e.matches(yp))) {
		e.focus();
		return;
	}
	let t = Wp(e);
	t === null ? s("focus effect target has nothing focusable.", e) : t.focus();
}
function Q2(e, t) {
	let n = e.effect;
	if (typeof n.text == "string") return n.text;
	let r = Y2(e);
	if (r === null) return null;
	if (fu(r) === null) {
		let t = V2(r);
		return t.length === 0 && s("copy to clipboard effect target holds no value and shows no words.", e.effect), t.length === 0 ? null : t;
	}
	return t === void 0 ? (s("copy to clipboard effect names a component but no value reader is wired up.", e.effect), null) : ou(t.readHeld(r));
}
async function $2(e) {
	if (navigator.clipboard !== void 0) try {
		await navigator.clipboard.writeText(e);
		return;
	} catch {}
	if (!e4(e)) throw Error("neither the clipboard API nor the selection command took the text.");
}
function e4(e) {
	let t = document.createElement("textarea");
	t.value = e, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.opacity = "0", document.body.appendChild(t), t.select();
	try {
		return k0();
	} finally {
		t.remove();
	}
}
//#endregion
//#region src/interactions/dialog-engine.ts
var t4 = class {
	root;
	components;
	discardForm;
	returnFocusByKey = /* @__PURE__ */ new Map();
	swipes = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, this.discardForm = e.discardForm ?? null, this.root.addEventListener("mousedown", (e) => n4(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0);
	}
	open(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (!t.hasAttribute("hidden")) return !0;
		r4(t), t.removeAttribute("hidden");
		let n = t.querySelector(".ui-dialog__surface") ?? t, r = Wp(t), i = Lp() && td(r);
		i && !n.hasAttribute("tabindex") && (n.tabIndex = -1);
		let a = rm(n, i ? n : r);
		return a !== null && this.returnFocusByKey.set(e, a), i4(t) && this.swipes.set(e, B_(n, n, () => this.dismiss(e))), !0;
	}
	close(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (t.hasAttribute("hidden")) return !0;
		let n = this.returnFocusByKey.get(e);
		this.returnFocusByKey.delete(e), this.swipes.get(e)?.(), this.swipes.delete(e);
		let r = document.activeElement, i = Bv(r), a = t.contains(r) ? t : i !== null && t.contains(i.owner) ? i.popup : null;
		return a !== null && um(om(n, this.components), a), t.setAttribute("hidden", ""), !0;
	}
	closeAll() {
		for (let e of this.root.querySelectorAll(`[${Qg}]:not([hidden])`)) {
			let t = e.getAttribute(Qg);
			t !== null && this.close(t);
		}
	}
	find(e) {
		return this.root.querySelector(`[${Qg}="${C(e)}"]`);
	}
	handleClick(e) {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest(`[${e_}]`);
		if (n === null) return;
		let r = n.closest(`[${Qg}]`);
		if (!(r instanceof HTMLElement) || r.hasAttribute("hidden") || !r.hasAttribute("data-ui-dialog-close-backdrop")) return;
		let i = r.getAttribute(Qg);
		i !== null && this.dismiss(i);
	}
	handleKeydown(e) {
		if (e.defaultPrevented || M(e)) return;
		let t = this.getTopmostOpen();
		if (t === null || s_(t)) return;
		let n = e.target instanceof Element ? e.target.closest(`[${Qg}]:not([hidden])`) : null, r = t.hasAttribute("data-ui-dialog-modal") || n === t ? t : n;
		if (e.key === "Escape" && r !== null && r.hasAttribute("data-ui-dialog-close-escape") && !v_(e.target) && !Ku(e)) {
			let t = r.getAttribute(Qg);
			t !== null && (e.preventDefault(), this.dismiss(t));
		} else e.key === "Tab" && t.hasAttribute("data-ui-dialog-modal") && Yp(t, e);
	}
	dismiss(e) {
		let t = this.find(e), n = t !== null && !t.hasAttribute("hidden");
		return n && t.querySelector(`[data-ui-form-id="${C(e)}"]`) !== null && this.discardForm?.(e), !this.close(e) || !n || t === null ? !1 : (t.querySelector(S)?.dispatchEvent(new Event("close", { bubbles: !0 })), !0);
	}
	getTopmostOpen() {
		return a_(this.root);
	}
};
function n4(e) {
	let t = e.target instanceof Element ? e.target.closest(`[${e_}]`) : null;
	t !== null && t.closest("[data-ui-dialog]:not([hidden])") !== null && e.preventDefault();
}
function r4(e) {
	let t = null;
	for (let n of e.parentElement?.children ?? []) n !== e && n.matches("[data-ui-dialog]:not([hidden])") && (t = n);
	t !== null && (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0 && t.after(e);
}
function i4(e) {
	return e.getAttribute("data-ui-dialog-placement") === "bottom" && (e.hasAttribute("data-ui-dialog-close-backdrop") || e.hasAttribute("data-ui-dialog-close-escape"));
}
//#endregion
//#region src/interactions/leave-dialog.ts
var a4 = "ui-leave", o4 = new ux("data-ui-leave-part"), s4 = "560px", c4 = null, l4 = null;
function u4(e, t) {
	c4 ??= d4();
	let n = c4;
	n.isConnected || document.body.append(n), f4(n, "title", O.text("ui.leave.title")), f4(n, "message", O.text("ui.leave.message")), f4(n, "stay", O.text("ui.leave.stay")), f4(n, "leave", O.text("ui.leave.confirm")), l4 = {
		dialogs: e,
		leave: t
	}, e.open(a4);
}
function d4() {
	let { dialog: e, surface: t } = lx({
		key: a4,
		className: "ui-leave-dialog",
		role: "alertdialog",
		labelledBy: "ui-leave-title",
		describedBy: "ui-leave-message",
		closesOnEscapeAndBackdrop: !0
	});
	t.style.setProperty("--ui-max-width-sm", s4);
	let n = o4.element("h2", "ui-leave-dialog__title ui-text-type--subtitle", "title"), r = o4.element("p", "ui-leave-dialog__message ui-text-type--body", "message");
	return n.id = "ui-leave-title", r.id = "ui-leave-message", t.append(n, r, o4.actions(o4.button("ui-button--ghost", "stay"), o4.button("ui-button--danger", "leave"))), e.addEventListener("click", (e) => {
		let t = o4.pressed(e);
		if (t !== "stay" && t !== "leave") return;
		let n = l4;
		l4 = null, n?.dialogs.close(a4), t === "leave" && n?.leave();
	}), e;
}
function f4(e, t, n) {
	let r = o4.find(e, t);
	r !== null && r.textContent !== n && (r.textContent = n);
}
//#endregion
//#region src/interactions/leave-guard.ts
var p4 = class {
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
		if (h4(e)) {
			e.preventDefault();
			return;
		}
		if (this.released) return;
		let t = m4(e, this.options.window.location.href);
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
function m4(e, t) {
	if (e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return null;
	let n = e.target, r = typeof n?.closest == "function" ? n.closest("a[href]") : null;
	if (r === null || r.hasAttribute("download") || h4(e)) return null;
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
	return ho(s) ? s : null;
}
function h4(e) {
	let t = e.target;
	if (typeof t?.closest != "function") return !1;
	let n = t.closest("a[href]"), r = t.closest(`[${$e}]`);
	return n !== null && r !== null && r !== n && n.contains(r);
}
//#endregion
//#region src/interactions/navigation-progress.ts
var g4 = 200, _4 = 1e4, v4 = "ui-navigation-progress", y4 = class {
	window;
	shownAfter;
	givenUpAfter;
	bar = null;
	timer = null;
	wait = null;
	constructor(e) {
		this.window = e.window, this.shownAfter = e.shownAfterMilliseconds ?? g4, this.givenUpAfter = e.givenUpAfterMilliseconds ?? _4, this.window.addEventListener("click", (e) => this.handlePress(e)), this.window.addEventListener("pageshow", (e) => {
			e.persisted === !0 && this.stop();
		}), this.window.addEventListener("pageswap", () => this.stop()), this.window.navigation?.addEventListener("navigateerror", () => this.stop());
	}
	handlePress(e) {
		m4(e, this.window.location.href) !== null && this.start(e);
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
		this.timer = null, e?.defaultPrevented === !0 ? this.stop() : (this.bar ??= b4(), document.body.append(this.bar), this.giveUpLater());
	}
	stop() {
		this.wait = null, this.clearTimer(), this.bar?.remove();
	}
};
function b4() {
	let e = document.createElement("div"), t = document.createElement("span"), n = document.createElement("span");
	return e.className = `${v4} ui-progress ui-progress--linear`, e.setAttribute("aria-hidden", "true"), t.className = "ui-progress__track", n.className = "ui-progress__fill", t.append(n), e.append(t), e;
}
//#endregion
//#region src/effects/address-history.ts
var x4 = "neEntry", S4 = class {
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
		this.window = e.window, this.revisit = e.revisit, this.switchRuntime = e.switchRuntime, this.load = e.load, this.route = e.window.location.pathname, this.search = e.window.location.search, this.entry = C4(e.window.history.state) ?? 0, C4(e.window.history.state) === null && e.window.history.replaceState({ [x4]: this.entry }, ""), e.window.addEventListener("popstate", () => this.onPopState());
	}
	replace(e) {
		this.write(N2(this.route, e), !1);
	}
	push(e) {
		let t = N2(this.route, e), n = this.window.location;
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
		t ? (this.entry++, this.window.history.pushState({ [x4]: this.entry }, "", e)) : this.window.history.replaceState({ [x4]: this.entry }, "", e), this.search = this.window.location.search;
	}
	onPopState() {
		let e = this.window.location, t = C4(this.window.history.state), n = t === null ? null : t - this.entry;
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
		}, this.switchRuntime(e.search, r) || this.revisit(E4(e.search));
	}
};
function C4(e) {
	if (typeof e != "object" || !e) return null;
	let t = e[x4];
	return typeof t == "number" ? t : null;
}
function w4(e, t, n) {
	if (n.length === 0) return !1;
	let r = new URLSearchParams(e), i = new URLSearchParams(t);
	return n.some((e) => T4(r, e) !== T4(i, e));
}
function T4(e, t) {
	return e.getAll(t).map(encodeURIComponent).join(",");
}
function E4(e) {
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
var D4 = {
	isHeld: () => !1,
	holdsPush: () => !1
}, O4 = class {
	addressResolver;
	operations;
	extensions;
	state;
	valueChangeHandlers = /* @__PURE__ */ new Set();
	held = D4;
	restoring = !1;
	constructor(e, t, n, r) {
		this.addressResolver = e, this.operations = t, this.extensions = n, this.state = r;
	}
	setHeldTargets(e) {
		this.held = e;
	}
	isHeldTarget(e) {
		return this.held.isHeld(e);
	}
	addValueChangeHandler(e) {
		return this.valueChangeHandlers.add(e), () => this.valueChangeHandlers.delete(e);
	}
	applyPropertyValue(e, t, n, r) {
		let i = this.addressResolver.resolveProperties(e, t), a = this.shownValue(e, n), o = kZ(n, this.extensions.converters), c = !1;
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
			let l = this.extensions.converters.convert(t.converter, a);
			for (let u of i) {
				let i = this.addressResolver.resolveOperationTargets(u, t);
				if (i.length === 0) t.optional !== !0 && s("property operation target was not found.", {
					reference: e,
					operation: t
				});
				else for (let s of i) !r && !this.restoring && this.holdsProperty(s, e.propertyId, n) ? c = !0 : this.applyOperation(u, t, s, a, l, o, r);
			}
		}
		!this.state.set(e, t, n, () => A4(i[0]?.component)) && !this.restoring || c || this.notifyValueChanged({
			reference: e,
			propertyName: i[0]?.propertyName ?? this.addressResolver.getPropertyName(e.propertyId) ?? "",
			dynamicParameters: t,
			value: a,
			local: r,
			components: i.map((e) => e.component)
		});
	}
	shownValue(e, t) {
		return fl(t, () => this.addressResolver.isTranslatable(e));
	}
	holdsProperty(e, t, n) {
		let r = e.getAttribute(Ze);
		if (r === null) return this.held.isHeld(e);
		let i = this.addressResolver.getBindingById(Number(r));
		return i !== void 0 && i.propertyId !== t ? !1 : this.held.holdsPush(e, n);
	}
	applyOperation(e, t, n, r, i, a, o) {
		a !== null && DZ(t, n) ? this.operations.apply({
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
		return this.state.set(e, t, n, () => A4(r[0]?.component)) ? {
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
			(typeof n == "string" || Oc(n) ? this.addressResolver.isTranslatable(t.reference) : D(n)) && (e === void 0 || e(n)) && this.applyPropertyValue(t.reference, t.dynamicParameters, n, !1);
		}
	}
	rewriteStatic(e, t, n) {
		let r = this.addressResolver.resolvePropertyOn(e, t);
		if (r === null) return;
		let i = `[${Xe}${$i(r.propertyName)}]`;
		this.applyOperations(r, n, this.shownValue(t, n), (t) => na(e, t, () => k4(e, i)));
	}
	applyOperations(e, t, n, r) {
		let i = kZ(t, this.extensions.converters);
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
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(Ze))), r = e.closest(S);
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
		if (!this.state.has(r, t)) hu(e);
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
function k4(e, t) {
	if (e.matches(t)) return [e];
	for (let n of e.querySelectorAll(t)) if (n.closest("[data-ui-id]") === e) return [n];
	return [e];
}
function A4(e) {
	let t = [], n = e?.closest("[data-ui-key]") ?? null;
	for (; n !== null;) {
		let e = n.parentElement?.closest("[data-ui-id]") ?? null, r = e === null ? 0 : E(e), i = n.getAttribute(b);
		e !== null && r > 0 && i !== null && t.push({
			host: r,
			hostParameters: Ia(e, Fa(e)),
			key: i
		}), n = n.parentElement?.closest("[data-ui-key]") ?? null;
	}
	return t;
}
//#endregion
//#region src/updates/reactive-source-registry.ts
var j4 = "EndValue", M4 = class {
	watchers = /* @__PURE__ */ new Map();
	sourcesByComponent = /* @__PURE__ */ new Map();
	propertyPatchEngine;
	edits;
	constructor(e, t) {
		if (this.propertyPatchEngine = e, this.edits = t, e.addValueChangeHandler((e) => this.notify(e)), t !== void 0) for (let e of _m) t.root.addEventListener(e, (e) => this.applyEditedValue(e, t), !0);
	}
	watch(e, t) {
		let n = T(e.componentId), r = P4(n, e.propertyId), i = this.watchers.get(r);
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
		let t = this.edits?.root.querySelector(`[data-ui-id="${T(e.componentId)}"]`) ?? null, n = t === null ? null : N4(e, this.edits?.metadata) ? t.querySelector(`[${Vt}]`) : fu(t);
		this.edits !== void 0 && n !== null && this.propertyPatchEngine.recordValue(e, [], this.edits.valueReaders.readBound(n));
	}
	applyEditedValue(e, t) {
		if (!(e.target instanceof Element)) return;
		let n = qa(e.target), r = n === null ? void 0 : this.sourcesByComponent.get(n);
		if (r === void 0) return;
		let i = t.valueReaders.readBound(e.target), a = e.target.hasAttribute(Vt);
		for (let e of r) {
			if (t.metadata !== void 0 && N4(e, t.metadata) !== a) continue;
			let n = this.propertyPatchEngine.recordValue(e, [], i);
			n !== null && this.notify(n);
		}
	}
	notify(e) {
		let t = P4(T(e.reference.componentId), e.reference.propertyId), n = this.watchers.get(t);
		if (n !== void 0) for (let t of n) t(e);
	}
};
function N4(e, t) {
	return t?.getPropertyDefinition(e.propertyId)?.propertyName === j4;
}
function P4(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/items/composite-slots.ts
function F4(e) {
	let t = [];
	for (let n of e.children) {
		let e = n.hasAttribute("data-ui-key") ? n.firstElementChild : null, r = e === null ? 0 : E(e);
		e !== null && r > 0 && t.push([e, r]);
	}
	return t;
}
//#endregion
//#region src/items/held-collections.ts
var I4 = class {
	collections = /* @__PURE__ */ new Map();
	rowCollections = /* @__PURE__ */ new Map();
	waiting = /* @__PURE__ */ new WeakMap();
	hold(e, t) {
		this.collections.set(e, B4(t));
	}
	apply(e) {
		let t = T(e.component?.id), n = this.collections.get(t);
		n === void 0 && (n = [], this.collections.set(t, n)), L4(n, e);
	}
	get(e) {
		return this.collections.get(e);
	}
	holdRow(e, t, n) {
		this.rowCollections.set(R4(e, t), {
			componentId: e,
			dynamicParameters: t,
			rows: B4(n)
		});
	}
	applyRow(e) {
		let t = T(e.component?.id), n = e.component?.dynamicParameters ?? [], r = R4(t, n), i = this.rowCollections.get(r);
		i === void 0 && (i = {
			componentId: t,
			dynamicParameters: n,
			rows: []
		}, this.rowCollections.set(r, i)), L4(i.rows, e);
	}
	getRow(e, t) {
		return this.rowCollections.get(R4(e, t))?.rows;
	}
	forgetRows(e, t) {
		for (let [n, r] of this.rowCollections) t(r.componentId) && z4(r.dynamicParameters, e) && this.rowCollections.delete(n);
	}
	writeItem(e, t, n, r) {
		let i = t.length === 0 ? this.collections.get(e) : this.rowCollections.get(R4(e, t))?.rows, a = i === void 0 ? -1 : i.findIndex((e) => e.key === n);
		return i === void 0 || a < 0 ? !1 : (i[a] = {
			key: n,
			item: r(i[a].item)
		}, !0);
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
function L4(e, t) {
	switch (va(t.action)) {
		case "Insert":
			for (let n of t.items ?? []) V4(e, n);
			break;
		case "Remove":
			for (let n of t.items ?? []) H4(e, n.key);
			break;
		case "Replace":
			for (let n of t.items ?? []) U4(e, n);
			break;
		case "Move":
			for (let n of t.moves ?? []) W4(e, n.key, n.newIndex);
			break;
		case "Reset": e.length = 0;
	}
}
function R4(e, t) {
	return `${e}:${ya(t)}`;
}
function z4(e, t) {
	if (e.length < t.length) return !1;
	for (let n = 0; n < t.length; n++) if (String(e[n] ?? "") !== String(t[n] ?? "")) return !1;
	return !0;
}
function B4(e) {
	let t = [];
	for (let n of e) typeof n.key == "string" && t.push({
		key: n.key,
		item: n.item
	});
	return t;
}
function V4(e, t) {
	typeof t.key == "string" && (H4(e, t.key), e.splice(G4(t.index, e.length), 0, {
		key: t.key,
		item: t.item
	}));
}
function H4(e, t) {
	let n = e.findIndex((e) => e.key === t);
	n >= 0 && e.splice(n, 1);
}
function U4(e, t) {
	if (typeof t.key != "string") return;
	let n = e.findIndex((e) => e.key === (t.oldKey ?? t.key));
	n < 0 ? V4(e, t) : e[n] = {
		key: t.key,
		item: t.item
	};
}
function W4(e, t, n) {
	let r = e.findIndex((e) => e.key === t);
	if (r < 0) return;
	let [i] = e.splice(r, 1);
	e.splice(G4(n, e.length), 0, i);
}
function G4(e, t) {
	return typeof e == "number" && e >= 0 && e < t ? e : t;
}
//#endregion
//#region src/items/item-projections.ts
var K4 = class {
	byHost = /* @__PURE__ */ new Map();
	records = /* @__PURE__ */ new WeakMap();
	reported = /* @__PURE__ */ new Set();
	get isEmpty() {
		return this.byHost.size === 0;
	}
	describe(e, t) {
		this.byHost.set(e, q4(e, "", t.map((e) => e.split("."))));
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
function q4(e, t, n) {
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
	for (let [n, a] of r) i.set(n, a.whole || a.rest.length === 0 ? null : q4(e, `${t}${a.name}.`, a.rest));
	return {
		host: e,
		prefix: t,
		members: i
	};
}
function J4(e) {
	let t = new K4();
	for (let n of e.metadata.items) n.itemPaths !== null && n.itemPaths !== void 0 && t.describe(T(n.componentId), n.itemPaths);
	return t;
}
//#endregion
//#region src/items/pending-moves.ts
var Y4 = class {
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
}, X4 = class {
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
function Z4(e, t) {
	let n = Q4(e[t], "Reset");
	if (n === null) return null;
	let r = T(n.component?.id), i = n.component?.dynamicParameters ?? [];
	if (r <= 0) return null;
	let a = null, o = null, s = t + 1;
	for (; s < e.length; s++) {
		let t = Q4(e[s], "Insert");
		if (t === null || T(t.component?.id) !== r || !fm(i, t.component?.dynamicParameters ?? [])) break;
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
function Q4(e, t) {
	if (e === void 0 || xa(e) !== "CollectionChange") return null;
	let n = e;
	return va(n.action) === t ? n : null;
}
//#endregion
//#region src/updates/collection-sinks.ts
var $4 = class {
	handlers = /* @__PURE__ */ new Map();
	register(e) {
		this.handlers.set(e.kind, e.handler);
	}
	dispatch(e, t) {
		let n = this.handlers.get(e);
		return n !== void 0 && (n(t), !0);
	}
};
function e3(e, t, n, r) {
	return {
		action: va(e.action),
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
var t3 = [], n3 = class {
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
	held = new I4();
	projections;
	touched = null;
	changedHosts = null;
	moves = new Y4({
		indexOf: (e, t) => this.indexOfRow(e, t),
		move: (e, t, n) => this.moveRow(e, t, n)
	});
	transfers = new X4({
		take: (e, t) => this.takeRow(e, t),
		restore: (e, t) => this.restoreRow(e, t),
		place: (e, t, n, r) => this.placeRow(e, t, n, r),
		remove: (e, t) => this.removeRow(e, t),
		holds: (e, t) => d3(G(e), t) !== null,
		itemOf: (e) => this.readItemValue(e)
	});
	constructor(e, t, n, r, i, a, o, s, c) {
		this.metadata = e, this.propertyPatchEngine = t, this.state = n, this.itemsRenderer = r, this.itemsTemplates = i, this.dom = a, this.virtualization = o, this.sinks = s, this.rowMenus = c, r.setRowFiller((e) => this.fillHeldCollections(e)), t.addValueChangeHandler((e) => this.writeHeldItemValue(e)), t.addValueChangeHandler((e) => this.touch(e.components)), this.projections = J4(e), this.projections.isEmpty || rA((e, t) => this.projections.check(e, t));
	}
	fillHeldCollections(e) {
		let t = [];
		for (let n of e.querySelectorAll(`[${x}]`)) {
			let e = qa(n);
			e !== null && this.held.get(e) !== void 0 && (n.replaceChildren(), n.removeAttribute(ut), this.held.markWaiting(n, e), t.push([n, e]));
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
		return t.length === 0 && (this.itemsTemplates.isTemplateComponent(e) || this.rowMenus.holds(e));
	}
	holdsRowCollection(e, t) {
		return t.length > 0 && this.rowMenus.holds(e);
	}
	forEachHeldRow(e) {
		this.held.forEachRow(e);
	}
	fillDrawnPart(e) {
		this.dom.invalidate(e), this.registerRenderedRows(e), this.itemsRenderer.writePushedValues(e);
		let t = /* @__PURE__ */ new Set();
		for (let n = l3(e, t); n !== null; n = l3(e, t)) {
			t.add(n);
			let e = Ja(n);
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
		if (n.length < 1 || !this.rowMenus.holds(t)) return;
		let r = this.metadata.getBindingByComponentAndPropertyId(t, e.reference.propertyId), i = r === void 0 ? null : mA(r);
		if (i === null || i.scopeComponentId > 0 && !this.rowMenus.inOneMenu(i.scopeComponentId, t)) return;
		let a = this.state.get(e.reference, n), o = n.slice(0, -1), s = String(n[n.length - 1] ?? ""), c = !1;
		for (let e of this.rowMenus.menuComponentsOf(t)) this.heldList(e, o) === void 0 && this.metadata.getItemValues(e, o).some((e) => e.key === s) && this.holdFromRender(e, o), c = this.held.writeItem(e, o, s, (e) => NZ(e, i.steps, a)) || c;
		c && this.rowMenus.heldChanged();
	}
	holdFromRender(e, t) {
		if (!this.rowMenus.holds(e) || this.heldList(e, t) !== void 0) return;
		let n = this.metadata.getItemValues(e, t);
		t.length === 0 ? this.held.hold(e, n) : this.held.holdRow(e, t, n);
	}
	heldList(e, t) {
		return t.length === 0 ? this.held.get(e) : this.held.getRow(e, t);
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
			return n === void 0 && (n = f3(e), t.set(e, n)), n;
		};
		this.registerRenderedRows(this.dom.root, n);
		for (let t of e?.updates ?? []) {
			if (xa(t) !== "CollectionChange") continue;
			let e = t;
			if (va(e.action) !== "Insert") continue;
			let r = T(e.component?.id);
			for (let t of this.findItemsHosts(r, e.component?.dynamicParameters ?? [])) {
				let i = n(t);
				for (let t of e.items ?? []) this.registerItemValue(r, i, t.key, t.item);
			}
		}
	}
	registerRenderedRows(e, t = (e) => f3(e)) {
		for (let n of e.querySelectorAll(`[${x}]`)) {
			let e = Ja(n);
			if (e === null) continue;
			let r = this.metadata.getItemValues(e.componentId, e.dynamicParameters);
			this.projections.isEmpty || this.projections.mark(e.componentId, r);
			for (let i of r) this.registerItemValue(e.componentId, t(n), i.key, i.item);
		}
	}
	registerItemValue(e, t, n, r) {
		if (n == null) return;
		let i = t.get(n) ?? null;
		if (i !== null && this.readItemScope(i) === void 0 && (this.itemsRenderer.registerItemScope(i, u3(i), r), this.metadata.getItemsTemplateMetadata(e)?.composite != null)) for (let [e, t] of F4(i)) this.itemsRenderer.registerItemScope(e, t, r);
	}
	readItemScope(e) {
		let t = this.itemsRenderer.getItemScope(e);
		if (t !== void 0) return t;
		let n = e.firstElementChild;
		return n === null ? void 0 : this.itemsRenderer.getItemScope(n);
	}
	initializeItemsHosts() {
		for (let e of this.dom.root.querySelectorAll(`[${x}]`)) {
			let t = qa(e);
			t !== null && this.syncItemsHost(e, t);
		}
	}
	resortHost(e) {
		let t = qa(e);
		t !== null && this.syncItemsHost(e, t);
	}
	syncItemsHost(e, t) {
		pK(e, t, {
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
		let n = u() ? performance.now() : -1, r = zm(), i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set();
		this.touched = i, this.changedHosts = a;
		try {
			_K(() => this.applyUpdates(t));
		} finally {
			this.touched = null, this.changedHosts = null;
		}
		for (let e of a) this.dom.invalidate(e);
		return r !== null && Bm(r), n >= 0 && d(`applied ${t.length} server update(s)`, n), [...i];
	}
	applyUpdates(e) {
		for (let t = 0; t < e.length; t++) {
			let n = e[t];
			try {
				xa(n) !== "Value" && yK((e) => !r3(n, e));
				let r = Z4(e, t);
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
		return this.dom.findComponent(e.componentId, e.dynamicParameters)?.hasAttribute(dt) === !0;
	}
	applyCollectionRefill(e) {
		let t = this.holdsCollection(e.componentId, e.dynamicParameters), n = this.holdsRowCollection(e.componentId, e.dynamicParameters);
		t && this.held.hold(e.componentId, e.items), n && (this.held.holdRow(e.componentId, e.dynamicParameters, e.items), this.rowMenus.heldChanged());
		let r = this.findItemsHosts(e.componentId, e.dynamicParameters);
		if (r.length === 0) t || n ? l("a collection for a host inside an item template is held until a row draws it.", { componentId: e.componentId }) : s("items host was not found for a collection refill.", e.items);
		else for (let n of r) t && this.held.isWaiting(n) || this.refillHost(n, e);
	}
	refillHost(e, t) {
		this.transfers.around(e, () => this.moves.around(e, t3, () => this.refillHostRows(e, t)));
	}
	refillHostRows(e, t) {
		let n = Nk(e) === "virtualized";
		try {
			if (n) {
				let n = this.virtualization.refill(e, t.items.filter((e) => e.key !== null && e.key !== void 0).map((e) => ({
					key: e.key,
					item: e.item
				})));
				this.state.forgetRows(t.componentId, t.dynamicParameters, n);
			} else if (this.reconcileRows(e, t), Nk(e) === "windowed") for (let t of this.windowRefillHandlers) t(e);
		} finally {
			this.afterRowsChanged(e, t.componentId, !n);
		}
	}
	reconcileRows(e, t) {
		let n = this.itemsRenderer.getAncestorStack(e), r = f3(e), i = [], a = [], o = null;
		for (let e of t.items) {
			let c = e.key ?? null;
			if (c === null) {
				s("collection insert carried no item key.", e);
				continue;
			}
			let l = r.get(c) ?? null;
			if (r.delete(c), l !== null && fm(this.readItemValue(l), e.item)) {
				i.push(l);
				continue;
			}
			let u = this.renderItemElement(t.componentId, e.item, c, n);
			if (l !== null) {
				let e = pp(l);
				e !== null && u !== null && (o = {
					row: u,
					held: e
				}), l.remove(), a.push(c);
			}
			u !== null && i.push(u);
		}
		let c = Nk(e) === "windowed";
		for (let [t, n] of r) {
			let r = c ? pp(n) : null;
			n.remove(), mp(e, null, r), a.push(t);
		}
		if (this.state.forgetRows(t.componentId, t.dynamicParameters, a), this.forgetHeldRows(t.componentId, t.dynamicParameters, a), c3(e, i), VA(e, i), o !== null && mp(e, o.row, o.held), c) for (let t of i) hp(e, t);
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
		switch (xa(e)) {
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
		let t = T(e.address?.component?.id), n = ba(e.address?.property), r = e.address?.component?.dynamicParameters ?? [];
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
			this.sinks.dispatch(i, e3(e, r, t, n)) || s("no collection sink is registered for the kind the component names.", {
				kind: i,
				update: e
			});
			return;
		}
		this.forgetRowState(t, n, e);
		let a = this.holdsCollection(t, n), o = this.holdsRowCollection(t, n);
		a && (this.holdFromRender(t, n), this.held.apply(e)), o && (this.holdFromRender(t, n), this.held.applyRow(e), this.rowMenus.heldChanged());
		let c = this.findItemsHosts(t, n);
		if (c.length === 0) {
			a || o ? l("a collection change for a host inside an item template is held until a row draws it.", { componentId: t }) : (va(e.action) !== "Reset" || (e.items ?? []).length > 0) && s("items host was not found for a collection change update.", e);
			return;
		}
		let u = va(e.action) === "Move" ? o3(e.moves ?? []) : t3;
		for (let n of c) a && this.held.isWaiting(n) || this.transfers.around(n, () => this.moves.around(n, u, () => this.applyCollectionChangeToHost(n, t, e)));
	}
	applyCollectionChangeToHost(e, t, n) {
		let r = Nk(e) === "virtualized", i = va(n.action);
		try {
			r ? this.applyVirtualizedCollectionChange(e, n) : this.applyRowsChange(e, t, n);
		} finally {
			this.afterRowsChanged(e, t, !r && (i === "Insert" || i === "Replace"));
		}
	}
	applyRowsChange(e, t, n) {
		switch (va(n.action)) {
			case "Insert":
				this.applyCollectionInsert(e, t, n.items ?? []);
				break;
			case "Remove":
				i3(e, n.items ?? [], n.trimmed === !0);
				break;
			case "Replace":
				this.applyCollectionReplace(e, t, n.items ?? []);
				break;
			case "Move":
				s3(e, n.moves ?? []);
				break;
			case "Reset":
				e.replaceChildren(), HA(e);
				break;
			default: s("collection update action is not supported.", n);
		}
	}
	afterRowsChanged(e, t, n) {
		this.touched?.add(e), t !== null && this.syncItemsHost(e, t), this.changedHosts?.add(e), (n || this.changedHosts === null) && this.dom.invalidate(e);
	}
	indexOfRow(e, t) {
		let n = Nk(e) === "virtualized" ? this.virtualization.keysOf(e)?.indexOf(t) ?? -1 : PA(e, G(e)).findIndex((e) => e.getAttribute(b) === t);
		return n < 0 ? null : n + Pk(e);
	}
	moveRow(e, t, n) {
		let r = qa(e);
		if (r === null) return;
		let i = Math.max(0, n - Pk(e));
		Nk(e) === "virtualized" ? this.virtualization.move(e, t, i) : s3(e, [{
			key: t,
			newIndex: i
		}]), this.afterRowsChanged(e, r, !1);
	}
	takeRow(e, t) {
		let n = G(e), r = d3(n, t);
		if (r === null) return null;
		let i = PA(e, n), a = i.indexOf(r);
		return LA(i, r), r.remove(), this.afterRowsChanged(e, qa(e), !1), {
			element: r,
			index: a
		};
	}
	restoreRow(e, t) {
		let n = PA(e, G(e));
		Dj(t.element), e.insertBefore(t.element, IA(n, t.element, t.index)), this.afterRowsChanged(e, qa(e), !0);
	}
	placeRow(e, t, n, r) {
		let i = qa(e), a = i === null ? null : this.renderItemElement(i, n, t, this.itemsRenderer.getAncestorStack(e));
		return a === null ? null : (e.insertBefore(a, IA(PA(e, G(e)), a, r)), this.afterRowsChanged(e, i, !0), a);
	}
	removeRow(e, t) {
		LA(PA(e, G(e)), t), t.remove(), this.afterRowsChanged(e, qa(e), !1);
	}
	forgetRowState(e, t, n) {
		switch (va(n.action)) {
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
		switch (va(t.action)) {
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
			let e = GJ(r);
			e !== null && n.push(e);
		}
		return n;
	}
	applyCollectionInsert(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = PA(e, G(e));
		for (let a of n) {
			let n = a.key ?? null;
			if (n === null) {
				s("collection insert carried no item key.", a);
				continue;
			}
			let o = this.renderItemElement(t, a.item, n, r);
			o !== null && (e.insertBefore(o, IA(i, o, a.index ?? null)), hp(e, o));
		}
	}
	renderItemElement(e, t, n, r) {
		try {
			return kQ(e, t, n, r, {
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
		let r = this.itemsRenderer.getAncestorStack(e), i = G(e), a = PA(e, i), o = f3(e, i);
		for (let i of n) {
			let n = i.key ?? null;
			if (n === null) {
				s("collection replace carried no item key.", i);
				continue;
			}
			let c = o.get(i.oldKey ?? n) ?? null, l = this.renderItemElement(t, i.item, n, r);
			if (l !== null) {
				if (o.delete(i.oldKey ?? n), o.set(n, l), c !== null) {
					let t = pp(c);
					BA(a, c, l), c.replaceWith(l), mp(e, l, t);
				} else e.insertBefore(l, IA(a, l, i.index ?? null));
			}
		}
	}
};
function r3(e, t) {
	if (xa(e) !== "CollectionChange") return !1;
	let n = e.component, r = t.closest(S);
	return r !== null && E(r) === T(n?.id) && La(r, n?.dynamicParameters ?? []);
}
function i3(e, t, n) {
	let r = G(e), i = f3(e, r), a = /* @__PURE__ */ new Set();
	for (let e of t) {
		let t = e.key ?? null, n = t === null ? null : i.get(t) ?? null;
		t === null || n === null ? s("collection remove did not resolve an item.", e) : (i.delete(t), a.add(n));
	}
	if (a.size === 0) return;
	let o = fp(e), c = o === null ? null : n ? a3(e, a) : cp(o, r, a);
	RA(PA(e, r), a);
	for (let e of a) e.remove();
	c?.();
}
function a3(e, t) {
	let n = [];
	for (let e of t) {
		let t = pp(e);
		t !== null && n.push(t);
	}
	return n.length === 0 ? null : () => {
		for (let t of n) mp(e, null, t);
	};
}
function o3(e) {
	return e.map((e) => e.key).filter((e) => typeof e == "string");
}
function s3(e, t) {
	let n = G(e), r = PA(e, n), i = f3(e, n);
	for (let n of t) {
		let t = n.key === null || n.key === void 0 ? null : i.get(n.key) ?? null;
		if (t === null) {
			s("collection move did not resolve an item.", n);
			continue;
		}
		let a = zA(r, t, n.newIndex ?? null);
		e.insertBefore(t, a ?? r[r.length - 2]?.nextSibling ?? null);
	}
}
function c3(e, t) {
	let n = null;
	for (let r of t) {
		let t = n === null ? G(e)[0] ?? null : n.nextElementSibling;
		r !== t && e.insertBefore(r, t), n = r;
	}
}
function l3(e, t) {
	for (let n of e.querySelectorAll(`[${x}]`)) if (!t.has(n)) return n;
	return null;
}
function u3(e) {
	let t = E(e);
	if (t > 0) return t;
	let n = e.firstElementChild;
	return n === null ? 0 : E(n);
}
function d3(e, t) {
	return e.find((e) => e.getAttribute("data-ui-key") === t) ?? null;
}
function f3(e, t = G(e)) {
	let n = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.getAttribute(b);
		t !== null && !n.has(t) && n.set(t, e);
	}
	return n;
}
//#endregion
//#region src/interactions/validation-words.ts
function p3(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = t.message;
	return D(n) || Oc(n) || typeof n == "string" && n.length > 0 ? {
		message: n,
		severity: h3(t.severity)
	} : void 0;
}
function m3(e) {
	let t = e.message;
	if (e.content === !0) return String(t ?? "");
	let n = O.resolve(D(t) || Oc(t) ? t : String(t ?? ""), !0);
	return typeof n == "string" ? n : "";
}
function h3(e) {
	let t = ha(e);
	return t === "Unknown" ? "Error" : t;
}
//#endregion
//#region src/interactions/validation-engine.ts
var g3 = "ui-validation--warning", _3 = "ui-validation--info", v3 = "ui-validation-message--marker", y3 = "top-end", b3 = "right", x3 = "--ui-validation-marker-host", S3 = "ui-validation-mark", C3 = "--ui-validation-presentation", w3 = "--ui-validation-color", T3 = "Validation", E3 = "Value", D3 = /* @__PURE__ */ new Set(["Value", "EndValue"]), O3 = /* @__PURE__ */ new Set(["Min", "Max"]), k3 = `input:not([type='hidden']), textarea, select, .${Ni}[role='combobox'], [role='spinbutton']`, A3 = {
	Error: 0,
	Warning: 1,
	Info: 2
}, j3 = {
	Error: Xi,
	Warning: g3,
	Info: _3
}, M3 = `.${Xi}, .${g3}, .${_3}`, N3 = {
	Error: "danger",
	Warning: "warning",
	Info: "info"
}, P3 = {
	Error: "error",
	Warning: "warning",
	Info: "info"
}, F3 = {
	Error: `${S3}--error`,
	Warning: `${S3}--warning`,
	Info: `${S3}--info`
}, I3 = {
	error: "Error",
	warning: "Warning",
	info: "Info"
}, L3 = class {
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
		}, !0), this.applyRenderedMessages(this.root.querySelectorAll(M3)), V(this.root, M3, {
			childList: !0,
			addedOnly: !0
		}, (e) => this.applyRenderedMessages(e)), O.onChange(() => {
			this.applyRenderedMessages(this.root.querySelectorAll(M3)), this.rewriteMessageLines(), this.rejudgeBounds();
		}), O.onTable(() => this.rewriteShownMessages());
	}
	rewriteShownMessages() {
		for (let e of this.root.querySelectorAll(M3)) {
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
			W3(t, H3(t) === "Error");
			let e = t.querySelector(`:scope > [${Zi}]`), n = e?.textContent ?? "";
			e !== null && n.length !== 0 && (this.recordRenderedMessage(t, e), G3(this.markerMirrors, t, e, {
				message: n,
				severity: H3(t)
			}));
		}
	}
	recordRenderedMessage(e, t) {
		if (this.renderedRead.has(e) || (this.renderedRead.add(e), this.resolveDisplay(E(e), e) !== void 0)) return;
		let n = ol(t), r = H3(e);
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
		if (e.propertyName === T3) this.applyBoundMessage(e);
		else if (this.applyGivenValue(e), this.applyChangeTrigger(e), e.propertyName === E3) for (let t of e.components) this.rejudgeAgainst(E(t), t, !0);
	}
	applyGivenValue(e) {
		let t = D3.has(e.propertyName), n = O3.has(e.propertyName);
		for (let r of e.components) {
			let i = this.refusalByElement.get(r)?.property === e.propertyName, a = this.boundRefusalByElement.has(r);
			a && n ? this.judgeBounds(E(r), r) : (i || a && t) && (i && this.refusalByElement.delete(r), t && this.forgetBoundRefusal(r), this.applyCurrentState(E(r), r));
		}
	}
	applyBoundMessage(e) {
		let t = T(e.reference.componentId), n = p3(e.value);
		for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) n === void 0 ? this.boundMessageByElement.delete(r) : this.boundMessageByElement.set(r, n), this.touchedElements.add(r), this.applyCurrentState(t, r);
	}
	applyChangeTrigger(e) {
		let t = T(e.reference.componentId), n = this.options.metadata.getValidationsForComponent(t);
		if (n.length === 0) return;
		let r = n.filter((t) => ma(t.trigger) === "Change" && t.target.propertyId === e.reference.propertyId);
		if (r.length !== 0) for (let n of this.options.dom.findAllComponents(t, e.dynamicParameters)) this.evaluateAndApply(t, n, r, e.value);
	}
	rejudgeAgainst(e, t, n) {
		let r = this.options.metadata.getValidationsAgainst(e);
		for (let i of r) {
			let r = ma(i.trigger);
			if (r === "Submit" || r === "Blur" && !n) continue;
			let a = T(i.target.componentId);
			for (let n of this.options.dom.findEveryComponent(a)) this.findValueSource(e, n) === t && this.evaluateAndApply(a, n, [i], this.readRuleValue(n));
		}
	}
	findValueSource(e, t) {
		let n = t === null ? [] : Ja(t)?.dynamicParameters ?? [];
		for (let t = n.length; t >= 0; t--) {
			let r = n.slice(0, t), i = this.options.dom.findComponent(e, r);
			if (i !== null && La(i, r)) return i;
		}
		return null;
	}
	applyServerRefusal(e) {
		let t = T(e.address?.component?.id), n = e.address?.component?.dynamicParameters ?? [], r = e.message ?? "", i = D(r) || typeof r == "string" && r.length > 0;
		for (let a of this.options.dom.findAllComponents(t, n)) i ? (this.refusalByElement.set(a, {
			message: r,
			severity: h3(e.severity),
			content: e.content === !0,
			property: ba(e.address?.property)
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
		let n = j(t) || k(t) ? null : B3(t, (e) => this.readValue(e)), r = this.boundRefusalByElement.get(t)?.message;
		return V3(r, n) || (n === null ? this.forgetBoundRefusal(t) : (this.boundRefusalByElement.set(t, {
			message: n,
			severity: "Error"
		}), this.boundRefused.add(t), this.touchedElements.add(t), this.refusalByElement.delete(t)), this.applyCurrentState(e, t)), n !== null;
	}
	readValue(e) {
		return this.options.readValue?.(e) ?? this.options.valueReaders.readBound(e);
	}
	readRuleValue(e) {
		let t = fu(e);
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
			severity: I3[t]
		}), this.applyCurrentState(E(e), e);
	}
	entryRefusal(e, t, n) {
		for (let r of this.options.metadata.getValidationsForComponent(E(e))) {
			if (h3(r.severity) !== "Error") continue;
			let i = this.comparand(r, e);
			if (R3(t, r, i) && !R3(n, r, i)) return r.message;
		}
		return null;
	}
	comparand(e, t) {
		let n = T(e.valueSource?.componentId);
		if (n <= 0) return e.value;
		let r = this.findValueSource(n, t);
		return r === null ? null : this.readRuleValue(r);
	}
	judge(e, t) {
		let n = null;
		for (let r of this.options.metadata.getValidationsForComponent(e)) !R3(t, r, this.comparand(r, null)) && (n === null || A3[h3(r.severity)] < A3[h3(n.severity)]) && (n = r);
		return n === null ? null : {
			severity: P3[h3(n.severity)],
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
		U3(this.markerMirrors, t, n), this.writeMessageElsewhere(e, t, n);
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
		}, [], [...e.lines.values()].map(m3).join("\n"), !0);
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
			severity: h3(t.severity)
		});
		let c;
		for (let e of n) (c === void 0 || A3[e.severity] < A3[c.severity]) && (c = e);
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
		this.rejudgeAgainst(n.componentId, n.element, e.type !== "input");
		let r = this.options.metadata.getValidationsForComponent(n.componentId);
		if (r.length === 0) return;
		let i = r.filter((e) => ma(e.trigger) === t);
		i.length !== 0 && this.evaluateAndApply(n.componentId, n.element, i, this.readRuleValue(n.element));
	}
	runSubmitValidation(e) {
		let t = !0, n = /* @__PURE__ */ new Set();
		for (let { component: r } of this.formFields(e)) {
			if (n.has(r.element)) continue;
			n.add(r.element);
			let e = this.options.metadata.getValidationsForComponent(r.componentId).filter((e) => ma(e.trigger) === "Submit");
			e.length > 0 && (this.touchedElements.add(r.element), this.evaluateAndApply(r.componentId, r.element, e, this.readRuleValue(r.element))), this.hasError(r.componentId, r.element) && (t = !1, this.touchedElements.has(r.element) || (this.touchedElements.add(r.element), this.applyCurrentState(r.componentId, r.element)));
		}
		return t;
	}
	*formFields(e) {
		for (let t of this.root.querySelectorAll(`[${cn}="${C(e)}"]`)) {
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
			let e = [...t.element.querySelectorAll(k3)].find((e) => e.closest("[role='listbox'], [role='menu'], [role='dialog']") === null) ?? null;
			if (e !== null) return e.focus({ preventScroll: !0 }), e.scrollIntoView({
				block: "center",
				behavior: gh() ? "auto" : "smooth"
			}), !0;
		}
		return !1;
	}
	hasError(e, t) {
		if (this.boundRefusalByElement.has(t) || this.refusalByElement.get(t)?.severity === "Error") return !0;
		let n = this.failingRulesByElement.get(t);
		if (n === void 0) return !1;
		for (let t of this.options.metadata.getValidationsForComponent(e)) if (n.has(t) && h3(t.severity) === "Error") return !0;
		return !1;
	}
	evaluateAndApply(e, t, n, r) {
		let i = this.failingRulesByElement.get(t);
		i === void 0 && (i = /* @__PURE__ */ new Set(), this.failingRulesByElement.set(t, i));
		for (let e of n) R3(r, e, this.comparand(e, t)) ? i.delete(e) : i.add(e);
		this.touchedElements.has(t) && this.applyCurrentState(e, t);
	}
};
function R3(e, t, n) {
	return fa(t.operator) !== "Required" && z3(e) ? !0 : nh(e, t.operator, n);
}
function z3(e) {
	return e !== !1 && !nh(e, "Required", null);
}
function B3(e, t) {
	return Tk(e, t) ?? (e.matches(".ui-temporal-input, .ui-calendar") ? dN(e) : null);
}
function V3(e, t) {
	return e === void 0 || t === null ? e === void 0 && t === null : D(e) && e.key === t.key && JSON.stringify(e.args) === JSON.stringify(t.args);
}
function H3(e) {
	return e.classList.contains(g3) ? "Warning" : e.classList.contains(_3) ? "Info" : "Error";
}
function U3(e, t, n) {
	for (let e of Object.values(j3)) t.classList.toggle(e, n !== void 0 && j3[n.severity] === e);
	W3(t, n?.severity === "Error");
	let r = t;
	n === void 0 ? r.style.removeProperty(w3) : r.style.setProperty(w3, `var(--ui-color-${N3[n.severity]}-ink)`);
	let i = t.querySelector(":scope > [data-ui-validation-message]") ?? t.querySelector("[data-ui-validation-message]");
	i !== null && (n?.content === !0 ? (il(i, null), i.textContent = String(n.message ?? "")) : O.writeValue(i, null, n?.message ?? null), G3(e, r, i, n));
}
function W3(e, t) {
	for (let n of e.querySelectorAll(k3)) {
		let r = n.closest(Mi);
		r !== null && e.contains(r) || (t ? n.setAttribute("aria-invalid", "true") : n.removeAttribute("aria-invalid"));
	}
}
function G3(e, t, n, r) {
	let i = getComputedStyle(n), a = i.getPropertyValue(C3).trim(), o = r !== void 0 && a === "marker";
	n.classList.toggle(v3, o), K3(e, t, a === "elsewhere" ? void 0 : r, n.textContent ?? "", i.getPropertyValue(x3).trim()), r !== void 0 && o ? (n.setAttribute(Re, Jo(n.textContent ?? "")), n.setAttribute(ze, y3), n.setAttribute(He, P3[r.severity]), t.setAttribute(Ve, ""), t.contains(document.activeElement) ? ez(n) : tz(n)) : (n.removeAttribute(Re), n.removeAttribute(ze), n.removeAttribute(He), t.removeAttribute(Ve), tz(n));
}
function K3(e, t, n, r, i) {
	let a = e.get(t), o = n === void 0 || i.length === 0 ? null : J3(t, i);
	if (n === void 0 || o === null) {
		a !== void 0 && q3(a), e.delete(t);
		return;
	}
	let s = a ?? document.createElement("span");
	s.className = `${S3} ${F3[n.severity]}`, s.textContent = r, s.setAttribute(Re, Jo(r)), s.setAttribute(ze, b3), s.setAttribute(He, P3[n.severity]), s.setAttribute(Ue, ""), s.parentElement !== o && (q3(s), o.append(s)), o.setAttribute(Ve, ""), e.set(t, s), tz(s);
}
function q3(e) {
	let t = e.parentElement;
	e.remove(), t !== null && t.querySelector(`:scope > .${S3}`) === null && t.removeAttribute(Ve);
}
function J3(e, t) {
	for (let n = e.parentElement; n !== null; n = n.parentElement) {
		let e = n.querySelector(`:scope > .${t}`);
		if (e !== null) return e;
	}
	return null;
}
//#endregion
//#region src/items/row-decorators.ts
var Y3 = class {
	decorators = /* @__PURE__ */ new Map();
	register(e) {
		this.decorators.set(e.kind, e.decorate);
	}
	get(e) {
		return this.decorators.get(e);
	}
}, X3 = "card-header-shown", Z3 = `[${Bi}], [${Vi}], [${Gi}], [${Ki}], [${qi}]`;
function Q3(e) {
	let t = e.parentElement?.parentElement;
	if (t == null || !t.classList.contains("ui-card__header")) return;
	let n = !e.matches(Z3);
	t.classList.contains("ui-card__header--empty") !== n && t.classList.toggle(Ji, n);
}
//#endregion
//#region src/updates/menu-surface.ts
var $3 = "menu-surface";
function e6(e) {
	let t = e.parentElement;
	t !== null && t.matches(".ui-context-menu, .ui-split-button__menu") && w(t, yn, Zw(e));
}
//#endregion
//#region src/updates/tooltip-name.ts
var t6 = "tooltip-name";
function n6(e, t, n) {
	let r = qo(e.getAttribute(Re));
	il(t, n), r.trim().length === 0 ? t.hasAttribute(n) && t.removeAttribute(n) : t.getAttribute(n) !== r && t.setAttribute(n, r);
}
//#endregion
//#region src/updates/dom-operation-registry.ts
var r6 = /* @__PURE__ */ new WeakMap(), i6 = /* @__PURE__ */ new WeakMap(), a6 = class {
	handlers = /* @__PURE__ */ new Map();
	constructor() {
		this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(ga(e), t);
	}
	apply(e) {
		let t = ga(e.operation.kind), n = this.handlers.get(t);
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
		this.register("Text", (e) => o6(e)), this.register("Markup", (e) => {
			e.target.hasAttribute("data-ui-plain-text") ? o6(e) : (Yo(e.target, su(e.convertedValue) ? "" : ou(e.convertedValue), {
				autolinks: e.target.hasAttribute(Wi),
				insideLink: e.target.closest("a") !== null
			}), il(e.target, null));
		}), this.register("Attribute", (e) => {
			let t = f6(e.operation);
			il(e.target, t), e.operation.convertsNull !== !0 && su(e.value) || su(e.convertedValue) ? w(e.target, t, null) : w(e.target, t, ou(e.convertedValue));
		}), this.register("RemoveAttribute", (e) => {
			let t = f6(e.operation);
			il(e.target, t), w(e.target, t, null);
		}), this.register("ToggleAttribute", (e) => {
			let t = f6(e.operation), n = e.operation.condition ?? "HasValue", r = !su(e.value) && s6(e.value, n), i = e.operation.value ?? (su(e.convertedValue) || c6(n) ? "" : ou(e.convertedValue));
			l6(e.target, d6(e), t, r, i);
		}), this.register("Class", (e) => {
			let t = !su(e.value) && s6(e.value, e.operation.condition ?? "None") ? ou(e.convertedValue).trim() : "";
			u6(e.target, d6(e), t, Gw(e.operation.converter ?? ""));
		}), this.register("ToggleClass", (e) => {
			let t = f6(e.operation), n = !su(e.value) && s6(e.value, e.operation.condition ?? "IsTrue");
			if (e.target.classList.toggle(t, n), e.operation.converter !== null && e.operation.converter !== void 0 && e.operation.converter.trim().length > 0) {
				let t = n ? ou(e.convertedValue).trim() : "";
				u6(e.target, d6(e), t, Gw(e.operation.converter));
			}
		}), this.register("Style", (e) => {
			let t = f6(e.operation), n = e.target;
			if (su(e.value) || su(e.convertedValue) || e.convertedValue === "") {
				n.style.getPropertyValue(t).length > 0 && n.style.removeProperty(t);
				return;
			}
			let r = ou(e.convertedValue);
			n.style.getPropertyValue(t) !== r && n.style.setProperty(t, r);
		}), this.register("Data", () => {}), this.register(t6, (e) => n6(e.resolved.component, e.target, f6(e.operation))), this.register(x0, (e) => w0(e.target, e.value)), this.register(X3, (e) => Q3(e.resolved.component)), this.register(pl, (e) => ml(e.target)), this.register(h0, (e) => b0(e.target)), this.register(YF, (e) => ZF(e.target)), this.register(eI, (e) => rI(e.resolved.component)), this.register(nC, (e) => {
			let t = gC(e.target);
			t !== "keep" && l6(e.resolved.component, nC, f6(e.operation), t === "show", "");
		}), this.register($3, (e) => e6(e.target)), this.register("Property", (e) => {
			let t = f6(e.operation), n = e.target, r = su(e.convertedValue) ? "" : e.convertedValue;
			n[t] !== r && (n[t] = r);
		});
	}
};
function o6(e) {
	let t = ou(e.convertedValue);
	e.target.textContent !== t && (e.target.textContent = t), il(e.target, null);
}
function s6(e, t) {
	switch (_a(t)) {
		case "None": return !0;
		case "HasValue": return !su(e);
		case "HasText": return typeof e == "string" ? e.trim().length > 0 : !su(e) && String(e).trim().length > 0;
		case "IsTrue": return e === !0;
		case "IsFalse": return e === !1;
		case "DrawsIcon": return Po(e).length > 0;
		default: return !su(e);
	}
}
function c6(e) {
	let t = _a(e);
	return t === "IsTrue" || t === "IsFalse";
}
function l6(e, t, n, r, i) {
	let a = i6.get(e);
	a === void 0 && (a = /* @__PURE__ */ new Map(), i6.set(e, a));
	let o = a.get(n);
	o === void 0 && (o = /* @__PURE__ */ new Set(), a.set(n, o)), r ? (o.add(t), w(e, n, i)) : (o.delete(t), o.size === 0 && w(e, n, null));
}
function u6(e, t, n, r) {
	let i = r6.get(e);
	i === void 0 && (i = /* @__PURE__ */ new Map(), r6.set(e, i));
	let a = i.get(t);
	if (a === void 0 && r !== void 0) for (let t of Array.from(e.classList)) t !== n && r(t) && e.classList.remove(t);
	a === n ? n.length > 0 && !e.classList.contains(n) && e.classList.add(n) : (a !== void 0 && a.length > 0 && e.classList.remove(a), n.length === 0 ? i.delete(t) : (e.classList.add(n), i.set(t, n)));
}
function d6(e) {
	return `${e.resolved.componentId}:${e.resolved.propertyId}:${e.operation.kind}:${e.operation.name ?? ""}:${e.operation.converter ?? ""}`;
}
function f6(e) {
	let t = e.name;
	if (t == null || t.trim().length === 0) throw Error(`Operation '${e.kind}' requires a name.`);
	return t;
}
//#endregion
//#region src/extensions/converters.ts
var p6 = class {
	converters = /* @__PURE__ */ new Map();
	constructor() {
		this.register({
			name: "*",
			canConvert: (e) => Xw.has(e.name),
			convert: (e) => Xw.get(e.name)(e.value)
		});
	}
	register(e) {
		let t = m6(e.name), n = {
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
function m6(e) {
	let t = e.trim();
	if (t.length === 0) throw Error("Converter name is required.");
	return t;
}
//#endregion
//#region src/extensions/events.ts
var h6 = class {
	definitions = /* @__PURE__ */ new Map();
	register(e) {
		let t = ka(e.name);
		if (t.length === 0) throw Error("Event name is required.");
		let n = ka(e.domEventName) || t;
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
		return this.definitions.get(ka(e));
	}
};
function g6(e, t) {
	e.root.addEventListener("toggle", (n) => {
		n.target instanceof HTMLDetailsElement && n.target.open === t && e.dispatch(n);
	}, !0);
}
function _6(e) {
	e.register({
		name: "click",
		attach: (e) => {
			e.root.addEventListener("click", e.dispatch, !0), e.root.addEventListener(op, e.dispatch, !0);
		}
	}), e.registerNative("change"), e.registerNative("focus"), e.registerNative("blur"), e.registerNative("mouse-enter", "mouseenter"), e.registerNative("mouse-leave", "mouseleave"), e.registerNative("toggle"), e.register({
		name: "expand",
		domEventName: "toggle",
		attach: (e) => g6(e, !0)
	}), e.register({
		name: "collapse",
		domEventName: "toggle",
		attach: (e) => g6(e, !1)
	}), e.registerNative("open"), e.registerNative("close"), e.registerNative("search"), e.registerNative("enter"), e.registerNative("escape"), e.registerNative("rename"), e.registerNative("unfold"), e.registerNative("move"), e.registerNative("remove");
}
//#endregion
//#region src/extensions/extension-registry.ts
var v6 = class {
	converters = new p6();
	events = new h6();
	operations = new a6();
	valueReaders;
	collectionSinks = new $4();
	rowDecorators = new Y3();
	constructor(e, t, n, r) {
		_6(this.events), this.valueReaders = new lu(r);
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
}, y6 = "Submenu", b6 = "ui-menu__submenu", x6 = "Select", S6 = ["Header", "Separator"], C6 = {
	kind: "menu",
	decorate: w6
};
function w6(e) {
	if (S6.includes(E6(e.item, "Kind")) && e.row.setAttribute(_n, ""), !T6(e.item)) return;
	let t = e.templates.getVariantTemplate(e.componentId, y6);
	if (t === void 0) {
		s("menu submenu template was not found.", { componentId: e.componentId });
		return;
	}
	let n = e.renderer.renderFromTemplate(t, e.item, e.ancestors);
	if (n === null) return;
	e.row.setAttribute(fn, ""), E6(e.item, "Kind") === x6 && e.row.setAttribute(pn, ""), E6(e.item, "Expanded") === !0 && e.row.setAttribute(mn, "");
	let r = document.createElement("div");
	r.className = b6, r.appendChild(n), FZ(r, e.key, e.item), e.row.appendChild(r);
}
function T6(e) {
	let t = E6(e, "Items");
	return Array.isArray(t) && t.length > 0;
}
function E6(e, t) {
	let n = uA(e, t);
	return n.ok ? n.value : void 0;
}
//#endregion
//#region src/items/row-grip.ts
var D6 = {
	kind: "grip",
	decorate: O6
};
function O6(e) {
	e.row.append(k6());
}
function k6() {
	let e = document.createElement("span");
	return e.className = _e, e.setAttribute("role", "button"), O.write(e, "aria-label", "ui.row.drag"), e;
}
//#endregion
//#region src/rendering/page-culture.ts
function A6(e, t, n) {
	let r = t === null ? null : JSON.stringify(t), i = n === null ? null : JSON.stringify(M6(n));
	for (let t of e.querySelectorAll(`[${gt}]`)) j6(t, ht, r), j6(t, bt, i);
}
function j6(e, t, n) {
	n !== null && e.hasAttribute(t) && e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function M6(e) {
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
var N6 = `[${St}]`;
function P6(e) {
	for (let t of e.querySelectorAll(N6)) t.removeAttribute(St);
}
//#endregion
//#region src/runtime/engine-start.ts
var F6 = 2;
function I6(e, t, n) {
	let r = u() ? performance.now() : -1;
	try {
		t(n);
	} catch (t) {
		c(`the ${e} engine failed to start; the page goes on without it.`, t);
	}
	if (r >= 0) {
		let t = performance.now() - r;
		t >= F6 && l(`the ${e} engine took ${f(t)} to start.`);
	}
}
function L6(e) {
	return e.name.length > 0 ? `"${e.name}" package` : "package";
}
//#endregion
//#region src/runtime/web-ui-runtime.ts
var R6 = "ne.standard.ui.windowId", z6 = [
	500,
	1e3,
	2e3
], B6 = 3, V6 = [
	["refusal", ({ root: e }) => NX(e)],
	["file input", ({ root: e, validation: t }) => new Db({
		root: e,
		validation: t
	})],
	["image input", ({ root: e, validation: t, propertyPatchEngine: n, dialogs: r }) => new oS({
		root: e,
		validation: t,
		propertyPatchEngine: n,
		dialogs: r
	})],
	["key value action", ({ root: e, dom: t, propertyPatchEngine: n, validation: r }) => new ES({
		root: e,
		dom: t,
		propertyPatchEngine: n,
		validation: r
	})],
	["field keys", ({ root: e, propertyPatchEngine: t }) => new QS({
		root: e,
		propertyPatchEngine: t
	})],
	["field box press", ({ root: e }) => new IS({ root: e })],
	["image fallback", ({ root: e }) => new DC({ root: e })],
	["radio group sync", ({ root: e }) => new WC({ root: e })],
	["select interaction", ({ root: e, validation: t }) => new OD({
		root: e,
		validation: t
	})],
	["search input", ({ root: e }) => new yE({ root: e })],
	["debounced commit", ({ root: e }) => new GS({ root: e })],
	["commit gate", ({ root: e, propertyPatchEngine: t }) => new qD({
		root: e,
		propertyPatchEngine: t
	})],
	["text area grow", ({ root: e, propertyPatchEngine: t }) => XD() ? void 0 : new ZD({
		root: e,
		propertyPatchEngine: t
	})],
	["items selection", ({ root: e, heldRows: t }) => new zK({
		root: e,
		rows: t
	})],
	["range value", ({ root: e, propertyPatchEngine: t }) => new wO({
		root: e,
		propertyPatchEngine: t
	})],
	["color input", ({ root: e, propertyPatchEngine: t }) => new OW({
		root: e,
		propertyPatchEngine: t
	})],
	["temporal picker", ({ root: e, propertyPatchEngine: t }) => new dP({
		root: e,
		propertyPatchEngine: t
	})],
	["theme switcher", ({ root: e, effects: t, dom: n }) => new YP({
		root: e,
		effects: t,
		dom: n
	})],
	["language switcher", ({ root: e, effects: t, dom: n }) => new iF({
		root: e,
		effects: t,
		dom: n
	})],
	["time segment", ({ root: e, propertyPatchEngine: t }) => new SJ({
		root: e,
		propertyPatchEngine: t
	})],
	["timestamp", ({ root: e, propertyPatchEngine: t }) => new zJ({
		root: e,
		propertyPatchEngine: t
	})],
	["file tile", ({ root: e, propertyPatchEngine: t }) => new HJ({
		root: e,
		propertyPatchEngine: t
	})],
	["context menu", ({ root: e, dom: t }) => new YI({
		root: e,
		dom: t
	})],
	["split button", ({ root: e }) => new HH({ root: e })],
	["toggle button", ({ root: e }) => new NS({ root: e })],
	["button group", ({ root: e }) => new JH({ root: e })],
	["menu", ({ root: e }) => new dz({ root: e })],
	["action bar", ({ root: e, dom: t }) => new OL({
		root: e,
		dom: t
	})],
	["collapsible", ({ root: e }) => new gV({ root: e })],
	["menu group", ({ root: e }) => new bI({ root: e })],
	["menu search", ({ root: e }) => new SB({ root: e })],
	["side drawer", ({ root: e }) => new nV({ root: e })],
	["screen keyboard", () => new NB()],
	["window foot", ({ root: e }) => new WB({ root: e })],
	["grid splitter", ({ root: e }) => new AV({ root: e })],
	["pane container", ({ root: e }) => new rH({ root: e })],
	["accordion", ({ root: e }) => new QH({ root: e })],
	["tabs", ({ root: e }) => new CU({ root: e })],
	["tabs view", ({ root: e, effects: t }) => new $q({
		root: e,
		effects: t
	})],
	["command bar", ({ root: e }) => new LU({ root: e })],
	["breadcrumbs", ({ root: e }) => new QU({ root: e })],
	["scroll anchor", ({ root: e }) => new oY({ root: e })],
	["visible keys", ({ root: e }) => new fZ({ root: e })],
	["surface press", ({ root: e }) => new YW({ root: e })],
	["text selection", ({ root: e }) => new pY({ root: e })],
	["scroll group", ({ root: e }) => new bY({ root: e })],
	["flyout interaction", ({ root: e }) => new ey({ root: e })],
	["text fold", ({ root: e }) => new fJ({ root: e })],
	["tooltip", ({ root: e }) => vR(e)]
], H6 = class {
	windowId;
	options;
	root;
	culturesLanguage = document.documentElement.lang;
	metadata = new aa(i$());
	hydration = c$();
	renderSequence = this.hydration?.sequence ?? null;
	rewriteMoments;
	rewritePageWritten;
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
	navigationProgress = new y4({ window });
	sessionKey = qy;
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
		this.options = e, this.root = e.root ?? document, this.windowId = C$(e.windowIdStorageKey ?? R6, (e) => this.reloadAsOwnTab(e)), this.dom = new Ka(this.root), O.load(this.root), O.setLanguage(document.documentElement.lang), e.strings !== void 0 && O.register(e.strings), this.gateInbound(this.hydration?.words === null || this.hydration?.words === void 0 ? null : O.loadTableAsync(this.hydration.words.href)), this.extensions = new v6(e.converters, e.eventDefinitions, e.domOperations, e.valueReaders), this.extensions.registerRowDecorator(C6), this.extensions.registerRowDecorator(D6), this.extensions.registerRowDecorator(LC);
		let t = new Pa(this.dom, this.metadata), n = this.extensions.operations, r = new G$(), i = new O4(t, n, this.extensions, r);
		this.reactiveSources = new M4(i, {
			root: this.root,
			valueReaders: this.extensions.valueReaders,
			metadata: this.metadata
		}), this.dialogs = new t4({
			root: this.root,
			dom: this.dom,
			discardForm: (e) => this.effects.apply({
				effect: {
					kind: ra.DiscardForm,
					formId: e
				},
				dom: this.dom
			})
		}), gv(this.dom), this.notifications = new b2({
			root: this.root,
			dom: this.dom
		}), this.address = new S4({
			window,
			revisit: (e) => void this.navigateInPlaceAsync(e),
			switchRuntime: (e, t) => this.revisitRuntime(e, t),
			load: () => this.reload()
		});
		let a = (e) => this.eventPipeline.dispatchCommandAsync({
			eventId: 0,
			action: e,
			dynamicParameters: []
		}).catch((e) => (s("running a notification's action failed.", e), !1)), o = (e) => Mq(e, (e) => this.leaveGuard.navigate(e), (e) => void a(e)), u = h$(document.documentElement, this.windowId, o);
		this.effects = new U2({
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
			systemNotifications: Aq(u)
		});
		let d = new uh(this.metadata), f, p = new Jm(d, i, new th(), {
			root: this.root,
			effects: this.effects,
			dom: this.dom,
			metadata: this.metadata,
			valueReaders: this.extensions.valueReaders,
			writeBack: (e, t, n) => {
				f?.syncPropertyAsync(T(e.componentId), e.propertyId, t, n).catch((e) => s("writing an interaction's value back failed.", e));
			}
		}), m = new YQ(this.dom), h = new AZ(this.metadata, m, this.extensions, n, r), g = new $Q({
			root: this.root,
			render: (e, t) => h.renderPart(e, t),
			drawn: (e) => this.updateProcessor.fillDrawnPart(e),
			heldRows: (e) => this.updateProcessor.forEachHeldRow(e)
		});
		g.scan(), JI((e) => g.draw(e)), this.rowMenus = g, this.virtualization = new NQ({
			root: this.root,
			metadata: this.metadata,
			templates: m,
			renderer: h,
			state: r,
			dom: this.dom
		}), this.updateProcessor = new n3(this.metadata, i, r, h, m, this.dom, this.virtualization, this.extensions.collectionSinks, g), O.onChange(() => this.rewriteWords(i, h)), this.rewriteMoments = () => this.rewriteWords(i, h, Mc), O.onMomentTick(this.rewriteMoments), this.rewritePageWritten = () => this.rewriteWords(i, h, Pc), this.ruleWatcher = new HZ({
			root: this.root,
			metadata: this.metadata,
			templates: m,
			renderer: h,
			state: r,
			propertyPatchEngine: i,
			reactiveSources: this.reactiveSources,
			virtualization: this.virtualization
		}), this.transport = new o0(this.windowId, (e, t) => this.applyChanges(e, t, this.heldRuntime), e.signalR), this.clientState = new kq({ report: (e) => this.transport.reportClientStateAsync(e) }), this.dispatcher = new B$(this.transport), O.setAsker((e, t) => this.transport.translateAsync(e, t)), this.effects.register(ra.SetLanguage, (e) => {
			let t = e.effect, n = t.language;
			if (typeof n != "string" || n.trim().length === 0) {
				s("set language effect carries no language.", e.effect);
				return;
			}
			let r = typeof t.href == "string" && t.href.length > 0 ? t.href : null;
			this.switchLanguageAsync(n, r).catch((e) => s("switching the page's language failed.", e));
		}), this.effects.register(ra.SetThemeColors, (e) => {
			let t = e.effect, n = ++this.themeColorChanges;
			typeof t.css == "string" ? n$(document.head, t.css) : this.transport.setThemeColorsAsync(t.colors ?? null).then((e) => {
				n === this.themeColorChanges && n$(document.head, e);
			}).catch((e) => s("applying the reader's colours failed.", e));
		});
		let _ = new d0(this.transport);
		f = new Sm({
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
		}), i.setHeldTargets(f), this.settleValues = async () => {
			HS(), await _.whenAnsweredAsync();
		}, this.effects.register(ra.DiscardForm, (e) => {
			let t = e.effect.formId;
			if (typeof t == "string" && t.length !== 0) {
				for (let n of f?.releaseForm(t) ?? []) i.restoreBoundValue(n, e.dom.resolveNearestComponent(n, () => !0)?.dynamicParameters ?? []);
				v.discardForm(t);
			}
		}), this.leaveGuard = new p4({
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
			confirm: (e, t) => u4(this.dialogs, t),
			pending: () => VS() || _.isBusy,
			settle: () => this.settleValues(),
			follow: (e) => this.followInPlace(e)
		}), this.updateProcessor.addPageHandler((e) => this.leaveGuard.set(e.holdsUnsavedWork === !0)), this.effects.register(Wy, (e) => this.sessionKey.start(e.effect.token)), this.effects.register(ra.ConfirmLeave, (e) => {
			let t = e.effect.target;
			ho(t) ? this.leaveGuard.confirm(t) : s("confirm leave effect names no address of this site; nothing asked.", e.effect);
		});
		let v = new L3({
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
		for (let [e, t] of V6) I6(e, t, this.engineContext);
		I6("number input", ({ root: e, propertyPatchEngine: t }) => {
			this.numberInputs = new Ck({
				root: e,
				propertyPatchEngine: t
			});
		}, this.engineContext), I6("tree", ({ root: e, effects: t }) => new hq({
			root: e,
			effects: t,
			rules: {
				metadata: this.metadata,
				state: r,
				renderer: h
			}
		}), this.engineContext), I6("items reorder", ({ root: e }) => new uj({
			root: e,
			services: {
				metadata: this.metadata,
				state: r,
				keysOf: (e) => this.virtualization.keysOf(e)
			}
		}), this.engineContext), I6("press ripple", ({ root: e }) => new NY({
			root: e,
			clicks: (e) => this.metadata.hasServerEventForComponent("click", E(e)) || p.hasEventForComponent("click", E(e)),
			waves: document.documentElement.hasAttribute(Hr)
		}), this.engineContext), I6("overlay scrollbars", () => document.documentElement.hasAttribute("data-ui-overlay-scrollbars") ? new nX() : void 0, this.engineContext), this.eventPipeline = new Pm({
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
			uploads: bb,
			isReattaching: () => this.transport.isReattaching
		});
		for (let e of /* @__PURE__ */ new Set([...this.metadata.getEventNames(), ...d.getSourceEventNames()])) this.eventPipeline.addEvent(e);
		this.eventPipeline.addEvent(Yq.name, Yq.registration);
		let ee = (e) => this.updateProcessor.resortHost(e), te = sj({
			ahead: (e, t, n) => this.updateProcessor.moves.ahead(e, t, n),
			settle: (e) => this.updateProcessor.moves.settle(e),
			resort: ee
		});
		this.eventPipeline.addEvent(te.name, te.registration);
		let ne = Zq(ee);
		this.eventPipeline.addEvent(ne.name, ne.registration), this.eventPipeline.addEvent(mq.name, mq.registration);
		let re = Kj(this.updateProcessor.transfers);
		for (let e of this.metadata.getEventNames()) e.startsWith("drop:") && this.eventPipeline.addEvent(e, re);
		this.eventPipeline.addEvent(XS.name, XS.registration), this.eventPipeline.addEvent(hE.name, hE.registration), I6("shortcuts", ({ root: e, dom: t }) => new Sz({
			root: e,
			viewShortcuts: Cz(this.metadata.metadata),
			componentOf: (e) => t.findComponent(e, []),
			laterChords: this.rowMenus
		}), this.engineContext), I6("item drag", ({ root: e, dom: t }) => new Yj({
			root: e,
			targetOf: (e, n) => {
				let r = t.resolveNearestComponent(e, (e) => this.metadata.hasServerEventForComponent("drop:" + n, e))?.element ?? null;
				return r instanceof HTMLElement ? r : null;
			},
			keysOf: (e) => this.virtualization.keysOf(e)
		}), this.engineContext), this.tables = new AG({ root: this.root }), this.windows = new sQ({
			root: this.root,
			requestWindow: (e) => this.transport.requestItemWindowAsync(e)
		}), this.updateProcessor.addWindowRefillHandler((e) => this.windows.refilled(e)), I6("pager", ({ root: e, dom: t }) => new aB({
			root: e,
			dom: t,
			windows: this.windows
		}), this.engineContext), this.pluginContext = {
			...this.engineContext,
			strings: O,
			observeComponents: V,
			observeSize: xV,
			store: new qF(),
			numbers: ek,
			temporal: sc,
			icons: { apply: jo },
			badges: { writeCount: UT },
			urls: {
				isImageSource: yo,
				asBrowserReads: vo,
				isSafeLink: uo,
				isExternalLink: mo
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
				let r = e.closest(S), a = r === null ? void 0 : this.metadata.getExposedProperty(E(r), t);
				return r === null || a === void 0 ? (s("a package set a property its component's renderer did not expose.", { propertyName: t }), !1) : i.applyToComponent(r, a, n);
			} },
			windows: this.windows,
			tooltips: $R,
			renames: { open: Iu },
			tables: this.tables,
			rows: EZ(m, h, this.virtualization),
			uploads: pb(v, bb),
			selection: uf,
			popups: ZX(this.dom),
			roving: vd,
			typeAhead: UP,
			focus: Gp,
			states: Dl,
			validation: v,
			wheel: gx,
			colors: aZ,
			shortcuts: id,
			names: Qi
		}, this.transport.onChanges((e, t) => void this.applyChanges(e, void 0, t)), this.transport.onCommandResult((e, t) => {
			Jy(this.sessionKey, e.command?.effects);
			let { changes: n, ...r } = e;
			W$(() => this.applyChanges(n, void 0, t), () => {
				this.holdsRuntime(t) && !this.dispatcher.settle(r) && (this.effects.applyAll(e.command?.effects, this.dom), this.windows.reconsider());
			}).catch((e) => c("a pushed command result could not be applied.", e));
		}), this.updateProcessor.addFullResyncHandler(() => {
			this.attachAsync().catch((e) => c("re-attaching after a full resync failed.", e));
		}), this.transport.onReconnecting((e) => {
			s("SignalR reconnecting.", e), this.dispatcher.release(Error("the connection to the server dropped before the command answered.", { cause: e }));
		}), this.transport.onReconnected(async () => {
			l("SignalR reconnected. Reattaching runtime."), await this.attachAsync();
		}), this.transport.onClosed((e) => this.loseConnection(e ?? /* @__PURE__ */ Error("the connection to the server closed."))), this.connection = new M$({
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
		let t = fu(e);
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
		return r.length > 0 && this.heldRuntime !== null && !this.connectionLost && e === window.location.pathname && J6() === null && w4(t, n, r);
	}
	async switchRuntimeAsync() {
		this.endSwitchProgress = this.navigationProgress.start();
		try {
			await this.settleValues();
		} catch (e) {
			s("the values still on their way did not settle before the page went to another runtime.", e);
		}
		this.dialogs.closeAll(), this.dispatcher.release(/* @__PURE__ */ Error("the page went to another runtime of its route before the command answered.")), this.transport.holdCalls();
		let e = W6();
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
	rewriteWords(e, t, n) {
		let r = performance.now();
		this.dom.invalidate(), O.language !== this.culturesLanguage && (this.culturesLanguage = O.language, dl(this.root, (e) => A6(e, O.number, O.temporal))), O.rewriteMarks(this.root, n), this.rewriteStaticWords(e, n), e.rewriteWords(n), t.rewriteRowWords(this.root, n);
		let i = this.hydration?.title ?? null;
		if (i !== null && (n === void 0 || n(i))) {
			let e = String(O.resolve(i, !0));
			document.title !== e && (document.title = e);
		}
		O.language.length > 0 && document.documentElement.lang !== O.language && (document.documentElement.lang = O.language), d(n === void 0 ? "page's words written again" : "page's written values written again", r, { language: O.language });
	}
	rewriteStaticWords(e, t) {
		let n = t === void 0 ? this.metadata.getWords() : this.metadata.getWords().filter((e) => t(e.key));
		if (n.length === 0) return;
		let r = [];
		dl(this.root, (e) => {
			e !== this.root && r.push(e);
		});
		for (let t of n) {
			let n = T(t.componentId), i = {
				componentId: n,
				propertyId: t.propertyId
			}, a = t.dynamicParameters ?? [];
			for (let r of this.findWordInstances(n, a)) e.rewriteStatic(r, i, t.key);
			for (let o of r) for (let r of o.querySelectorAll(`[${y}="${C(n)}"]`)) Ra(r, a) && e.rewriteStatic(r, i, t.key);
		}
	}
	findWordInstances(e, t) {
		if (t.length === 0) return this.dom.findEveryComponent(e);
		let n = this.dom.findAllComponents(e, t);
		return n.length > 0 ? n : this.dom.findAllComponents(e, []).filter((e) => Ra(e, t));
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
		let t = y$(e, navigator.cookieEnabled, x$());
		t === "no-cookie" ? this.loseConnection(/* @__PURE__ */ Error(`the server asked for a reload of view '${e}', and this browser keeps no cookie the reload could write.`)) : t === "asked-again" ? this.loseConnection(/* @__PURE__ */ Error(`the server asked for a reload of view '${e}' again after one (another compile of the view, or a session cookie the browser does not keep).`)) : (s("the server asked for a reload (another compile of the view, or a session it no longer holds); reloading.", { view: e }), this.leaveGuard.release(), this.reload());
	}
	reloadAsOwnTab(e) {
		s("another live tab holds this tab's id; reloading under one of its own.", { id: e }), this.leaveGuard.release(), this.reload();
	}
	reloadForFreshRuntime(e) {
		y$(e, navigator.cookieEnabled, x$()) === "reload" ? (s("the page's runtime is gone and the server built a new one; reloading.", { view: e }), this.leaveGuard.release(), this.reload()) : this.loseConnection(/* @__PURE__ */ Error("the server holds a new runtime for this page again after a reload for one."));
	}
	reload() {
		this.sessionKey.load(() => window.location.reload());
	}
	get instanceId() {
		return this.transport.instanceId;
	}
	async startAsync() {
		v(this, this.options.handlerGlobalKey);
		for (let e of this.metadata.metadata.compileWarnings ?? []) s(`the view compiled with a warning: ${e}`);
		T0(this.root), await q6();
		let e = this.connectAsync();
		await this.hydrateAsync(), this.startEnginesAwaitingHydration(), P6(this.root), this.clientState.start(), await e && (await this.attachAsync(), this.connectionLost || l(`page live ${f(performance.now())} after the navigation started.`));
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
		this.dom.rebuild(), this.updateProcessor.registerServerRenderedItems(t), await this.applyChanges(t), this.updateProcessor.initializeItemsHosts(), this.holdsPaintedPageWritten() && this.rewritePageWritten(), d("runtime hydrated from the page", e, {
			pageId: this.hydration.pageId,
			updates: t?.updates?.length ?? 0
		});
	}
	holdsPaintedPageWritten() {
		return rl(this.root) || s$(this.hydration) || this.metadata.getWords().some((e) => Pc(e.key)) || Pc(this.metadata.metadata.itemValues);
	}
	startEnginesAwaitingHydration() {
		let e = this.enginesAwaitingHydration ?? [];
		this.enginesAwaitingHydration = null;
		for (let t of e) I6(L6(t), t, this.pluginContext);
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
		this.enginesAwaitingHydration === null ? I6(L6(e), e, this.pluginContext) : this.enginesAwaitingHydration.push(e);
	}
	applyChanges(e, t, n) {
		if (this.inbound === null && !L$(e)) {
			t?.(), this.applyAnswered(this.holdsRuntime(n) ? e : null);
			return;
		}
		let r = this.transport.instanceId, i = (this.inbound ?? Promise.resolve()).then(async () => {
			t?.(), this.applyAnswered(this.holdsRuntime(n) ? await R$(e, r) : null);
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
			if (e >= B6) {
				this.loseConnection(/* @__PURE__ */ Error("the page fell behind the server on every attach."));
				return;
			}
		}
	}
	async attachCoreAsync() {
		if (this.connectionLost) return !1;
		let e = window.location.search, t = this.createAttachRequest(e), n = this.holdInbound(), r = performance.now();
		try {
			let i = await u$(() => this.transport.attachAsync(t), () => this.transport.isReconnecting, z6, K6), a = performance.now();
			if (i === null) return this.loseConnection(/* @__PURE__ */ Error("attaching the runtime failed after retrying.")), !1;
			if (i === "reconnecting") return !1;
			if (i.reload === !0) return this.reloadForView(this.hydration?.view ?? ""), !1;
			if (i.fresh === !0) return this.reloadForFreshRuntime(this.hydration?.view ?? ""), !1;
			b$(x$()), this.heldRuntime = i.runtime ?? null, this.runtimeSearch = e, this.dom.rebuild(), this.updateProcessor.registerServerRenderedItems(i.initialChanges), await n.previous;
			let o = W6();
			return t.switchRuntime && (this.pageId = null, o !== null && this.windows.forget(o)), this.leaveGuard.set(!1), await this.applyAttachChangesAsync(i.initialChanges), this.updateProcessor.initializeItemsHosts(), t.switchRuntime && G6(o), this.releaseInertContent(), this.windows.start(), d("runtime attached", r, {
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
		let t = J6(), n = t === null && this.heldRuntime !== null && w4(e, this.runtimeSearch, this.hydration?.identity ?? []), r = {
			clientWindowId: this.windowId,
			route: t?.route ?? window.location.pathname,
			pageId: n ? null : this.pageId,
			view: this.hydration?.view ?? null,
			since: this.renderSequence,
			runtime: this.heldRuntime,
			parameters: t === null ? E4(e) : t.parameters,
			timeZone: d$(),
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
			let t = L$(e) ? await R$(e, this.transport.instanceId) : e;
			this.releaseInertContent(), this.applyNow(t);
		} catch (e) {
			c("a staged value of the attach could not be fetched; the page attaches again.", e), this.reattachRequested = !0;
		}
	}
	releaseInertContent() {
		this.inertContent?.removeAttribute("inert"), this.inertContent = null, this.endSwitchProgress?.(), this.endSwitchProgress = null;
	}
};
async function U6(e = {}) {
	let t = performance.now(), n = new H6(e);
	return d("runtime built", t), await n.startAsync(), n;
}
function W6() {
	return document.querySelector(`[${Fn}="${g0}"]`);
}
function G6(e) {
	if (document.scrollingElement?.scrollTo({
		top: 0,
		left: 0,
		behavior: "instant"
	}), e !== null) for (let t of [e, ...e.querySelectorAll("*")]) lY(t) && !(Nk(t) === "windowed" && uY(t)) ? (iY(t), t.scrollTo({
		top: t.scrollHeight,
		left: 0,
		behavior: "instant"
	})) : (t.scrollTop !== 0 || t.scrollLeft !== 0) && t.scrollTo({
		top: 0,
		left: 0,
		behavior: "instant"
	});
}
function K6(e) {
	return new Promise((t) => window.setTimeout(t, e));
}
function q6() {
	let e = performance.getEntriesByType("navigation")[0];
	return document.readyState === "complete" || e !== void 0 && e.domContentLoadedEventStart > 0 ? Promise.resolve() : new Promise((e) => document.addEventListener("DOMContentLoaded", () => e(), { once: !0 }));
}
function J6() {
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
_(), U6().catch((e) => {
	c("Web client failed to start.", e);
});
//#endregion
