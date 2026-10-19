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
var y = "data-ui-id", ie = "data-ui-context", ae = "data-ui-pc", b = "data-ui-key", oe = "data-ui-unselectable", se = "data-ui-undraggable", ce = "data-ui-unremovable", le = "data-ui-unrenamable", ue = "data-ui-no-context-menu", de = "data-ui-no-row-open", fe = "data-ui-no-row-drag", pe = "data-ui-drag-kind", me = "data-ui-drag-source", he = "data-ui-item-drop-over", ge = "data-ui-drop-boxed", _e = "ui-row__grip", ve = "data-ui-row-drop", ye = "data-ui-tabs-none-removable", be = "data-ui-tabs-draggable", xe = "data-ui-tabs-menu", Se = "data-ui-context-menu", Ce = "data-ui-context-menu-owner", we = "data-ui-context-menu-later", Te = "data-ui-context-menu-template", Ee = "data-ui-context-menu-use", De = "data-ui-action-bar", Oe = "data-ui-action-bar-key", ke = "data-ui-action-bar-rest", Ae = "data-ui-menu-left-out", je = "data-ui-in-action-bar", Me = "ui-action-bar", Ne = "data-ui-row-focus", Pe = "data-ui-row-cursor-waits", Fe = "data-ui-tab-out", Ie = "data-ui-cell-focus", Le = "ui-cell-key", Re = "data-ui-tooltip", ze = "data-ui-tooltip-placement", Be = "data-ui-tooltip-mark", Ve = "data-ui-tooltip-severity", He = "data-ui-tooltip-press", Ue = "data-ui-badge-text", We = "data-ui-badge-set", Ge = "data-ui-badge-icon", Ke = "data-ui-folds", qe = "data-ui-name", Je = "data-ui-bind-", Ye = "data-ui-into-", Xe = "data-ui-bind-value", Ze = (e) => `data-ui-no-${e}`, Qe = "data-ui-event-boundary", $e = "data-ui-image-caption", et = "data-ui-image-crop", tt = "data-ui-image-crop-size", nt = "ui-image", rt = "ui-image__picture", it = "ui-image--circle", at = "data-ui-fallback-src", ot = "data-ui-fallback-icon", st = "data-ui-image-failed", ct = "data-ui-icon-failed", x = "data-ui-items-host", lt = "data-ui-items-empty", ut = "data-ui-collection-sink", dt = "data-ui-items-query", ft = "data-ui-first-visible-key", pt = "data-ui-last-visible-key", mt = "data-ui-number-culture", ht = "data-ui-page-culture", gt = "data-ui-pager-target", _t = "data-ui-pager-page", vt = "data-ui-pager-size", yt = "data-ui-temporal-culture", bt = "data-ui-temporal", xt = "data-ui-awaits-draw", St = "ui-timestamp", Ct = "ui-timestamp__text", wt = "data-ui-timestamp-format", Tt = "ui-file-tile", Et = "ui-file-tile__glyph", Dt = "ui-file-tile__name", Ot = "ui-file-tile__size", kt = "data-ui-file-name", At = "data-ui-file-type", jt = "data-ui-file-size", Mt = "data-ui-file-icon", Nt = "data-ui-empty-template", Pt = "data-ui-group-template", Ft = "data-ui-empty-placeholder", It = "data-ui-group-header", Lt = "data-ui-group-anchor", Rt = "data-ui-group", zt = "data-ui-value-holder", Bt = "data-ui-value-end", Vt = "data-ui-value-kind", Ht = "items-query", Ut = "first-visible-key", Wt = "last-visible-key", Gt = "data-ui-host-mode", Kt = "data-ui-host-viewport", qt = "data-ui-scroll-group", Jt = "data-ui-scroll-lines", Yt = "data-ui-source-line", Xt = "data-ui-window-spacer", Zt = "data-ui-window-pending", Qt = "data-ui-window-paged", $t = "data-ui-window-size", en = "data-ui-window-offset", tn = "data-ui-window-total", nn = "data-ui-window-more-before", rn = "data-ui-window-more-after", an = "data-ui-window-group-before", on = "data-ui-window-aggregates", sn = "data-ui-form-id", cn = "data-ui-forms", ln = "data-ui-visibility", un = "data-ui-collapsed", dn = "data-ui-menu-group", fn = "data-ui-menu-select", pn = "data-ui-menu-open", mn = "data-ui-menu-holds-current", hn = "data-ui-menu-icons", gn = "data-ui-menu-passive", _n = "data-ui-menu-item-shortcut", vn = "data-ui-menu-surface", yn = "data-ui-menu-search", bn = "data-ui-menu-searching", xn = "data-ui-menu-unmatched", Sn = "data-ui-drawer-toggle", Cn = "data-ui-drawer-open", wn = "data-ui-drawer-switch", Tn = "data-ui-drawer-switch-row", En = "data-ui-side-drawers", Dn = "data-ui-drawer-pin";
function On(e) {
	return e === "right-side" ? "data-ui-pinned-right-side" : "data-ui-pinned-left-side";
}
var kn = "data-ui-bottom-bar", An = "data-ui-rail-drawer", jn = "data-ui-menu-rail-tiers", Mn = "data-ui-window-foot", Nn = "data-ui-content-fills", Pn = "data-ui-region", Fn = "data-ui-menu-item-kind", S = "ui-menu", C = "ui-menu-item", In = "ui-menu-item--checked", Ln = "ui-menu-item--selected", Rn = "ui-menu--rail", zn = "ui-menu--nested", Bn = `[${Fn}="header"], [${Fn}="separator"]`, Vn = `[${dn}] > .${C}`, Hn = `.${C}:not(${Bn})`;
`${Vn}${C}${Fn}`;
var Un = "data-ui-shortcut", Wn = "data-ui-collapse-toggle", Gn = "data-ui-folding", Kn = "data-ui-column-limits", qn = "data-ui-row-limits", Jn = "data-ui-splitter-step", Yn = "data-ui-splitter-position", Xn = "data-ui-pane-layout", Zn = "data-ui-pane", Qn = "data-ui-pane-columns", $n = "data-ui-pane-rows", er = "data-ui-table-column", tr = "data-ui-table-hide-below", nr = "data-ui-table-starts-hidden", rr = "data-ui-table-hidden", ir = "ui-table__row", ar = "ui-table__scroll", or = "ui-table__header", sr = "ui-table__resizer", cr = "ui-tree", lr = "ui-tree__row", ur = "ui-tree-node", dr = "data-ui-tree-drop", fr = "ui-tree__row--filtered", pr = "data-ui-table-last", mr = "data-ui-table-reordering", hr = "data-ui-table-dragging", gr = "data-ui-table-drop", _r = "data-ui-table-scrolled", vr = "data-ui-table-scrollbar", yr = "data-ui-no-row-select", br = "data-ui-tree-parent", xr = "data-ui-tree-children", Sr = "data-ui-tree-folder", Cr = "data-ui-tree-expanded", wr = "data-ui-tree-title", Tr = "data-ui-tree-loading", Er = "data-ui-tree-drop-target", Dr = "data-ui-tree-boot", Or = "data-ui-tree-draggable", kr = "data-ui-row-editing", Ar = "data-ui-boxed-editor", jr = "data-ui-row-idle", Mr = "data-ui-step-collapsed", Nr = "data-ui-step-end", Pr = "data-ui-row-bar", Fr = "data-ui-image-source", Ir = "data-ui-file-max-size", Lr = "data-ui-file-pick", Rr = "data-ui-file-drop-target-id", zr = "data-ui-press-ripple", Br = "data-ui-service-worker", Vr = "data-ui-theme", Hr = "data-ui-theme-colors", Ur = "data-ui-words", Wr = "data-ui-language-switcher", Gr = "data-ui-theme-switcher", Kr = "data-ui-theme-choice", qr = "field", Jr = "data-ui-language", Yr = "data-ui-splitting", Xr = "data-ui-keyboard-up", Zr = "data-ui-window-foot-edge", Qr = "data-ui-connection", $r = "data-ui-pending", ei = "data-ui-split-folded", ti = "data-ui-split-edge", ni = "data-ui-pointer-focus", ri = "data-ui-focus-within", ii = "data-ui-popup-hover", ai = "data-ui-inner-pointer", oi = "data-ui-selection", si = "data-ui-selected", ci = "data-ui-selected-key", li = "data-ui-selected-keys", ui = "data-ui-bind-selected-key", di = "data-ui-tabs-selected", fi = "data-ui-tab-caption", pi = "data-ui-tab-key", mi = "data-ui-tab-page", hi = "data-ui-tab-actions", gi = "data-ui-tab-pinned", _i = [
	ln,
	"data-ui-visibility-sm",
	"data-ui-visibility-md",
	"data-ui-visibility-xl",
	"data-ui-visibility-xxl"
], vi = "data-ui-submit-form-id", w = `[${y}]`, yi = "data-ui-href", bi = "ui-disabled", xi = "ui-loading", Si = "ui-readonly", Ci = "ui-hidden", wi = "ui-dialog__surface", Ti = "ui-flyout__content", Ei = `.ui-context-menu, .ui-split-button__menu, .${Ti}`, Di = "data-ui-focus-holder", Oi = "data-ui-owns-keys", ki = "[role='listbox'], [role='menu'], [role='dialog']", Ai = "ui-select__trigger", ji = `.${Ai}`, Mi = "ui-button", Ni = "ui-button--ghost", Pi = "ui-button--small", Fi = `${Mi} ${Ni} ${Pi}`, Ii = "ui-select", Li = "data-ui-text-title", Ri = "data-ui-text-description", zi = "data-ui-plain-text", Bi = "data-ui-autolinks", Vi = "data-ui-text-icon", Hi = "data-ui-text-badge-icon", Ui = "data-ui-text-badge-text", Wi = "ui-card__header--empty", Gi = "ui-text-input", Ki = "ui-invalid", qi = "data-ui-validation-message", Ji = {
	componentId: y,
	key: b,
	selected: si,
	selectedKey: ci,
	selectedKeys: li,
	unselectable: oe,
	rowFocus: Ne,
	cellFocus: Ie,
	cellKey: Le,
	itemsHost: x,
	valueHolder: zt,
	bindValue: Xe,
	noRowOpen: de,
	noRowDrag: fe,
	eventBoundary: Qe,
	focusHolder: Di,
	ownsKeys: Oi,
	tooltip: Re,
	tooltipPlacement: ze,
	contextMenu: Se,
	contextMenuUse: Ee,
	actionBar: De,
	actionBarKey: Oe,
	actionBarRest: ke,
	disabledClass: bi,
	loadingClass: xi,
	readOnlyClass: Si,
	hiddenClass: Ci,
	buttonClass: Mi,
	ghostButtonClass: Ni,
	smallButtonClass: Pi,
	selectClass: Ii,
	textInputClass: Gi,
	invalidClass: Ki,
	validationMessage: qi,
	sourceLine: Yt,
	textDescription: Ri,
	popupSelector: ki,
	listTriggerSelector: ji,
	tableRowClass: ir,
	tableScrollClass: ar,
	tableHeaderClass: or,
	tableResizerClass: sr,
	tableHidden: rr,
	hostMode: Gt,
	windowOffset: en,
	windowTotal: tn,
	windowSize: $t,
	windowMoreAfter: rn,
	windowAggregates: on,
	itemsQuery: dt,
	valueKind: Vt,
	itemsQueryKind: Ht,
	menuItemClass: C,
	menuItemKind: Fn,
	menuItemCheckedClass: In
};
function Yi(e) {
	return String(e).replace(/[\\"]/g, "\\$&").replace(/[\u0000-\u001f\u007f]/g, (e) => `\\${e.charCodeAt(0).toString(16)} `);
}
function Xi(e) {
	return e.replace(/(\p{Ll})(\p{Lu})/gu, "$1-$2").replace(/([\p{L}\p{Nd}])(\p{Lu}\p{Ll})/gu, "$1-$2").replace(/_/g, "-").toLowerCase();
}
var Zi = 0;
function Qi(e, t) {
	return e.id.length === 0 && (Zi++, e.id = `${t}-${Zi}`), e.id;
}
function T(e, t, n) {
	n === null ? e.removeAttribute(t) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/addressing/operation-targets.ts
function $i(e, t, n) {
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
var ea = {
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
}, ta = class {
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
		return this.bindingsByComponentAndPropertyId.get(Ea(e, t));
	}
	getBindingByComponentAndPropertyName(e, t) {
		return this.bindingsByComponentAndPropertyName.get(Ea(e, Ta(t)));
	}
	getEvent(e, t) {
		return this.eventsByComponentAndName.get(Da(e, t));
	}
	hasServerEvent(e) {
		return this.eventNames.has(wa(e));
	}
	getEventNames() {
		return this.eventNames;
	}
	hasServerEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(wa(e))?.has(t) === !0;
	}
	getItemsTemplateMetadata(e) {
		return this.itemsTemplatesByComponentId.get(e);
	}
	getItemsFilterSortMetadata(e) {
		return this.itemsFilterSortByComponentId.get(e);
	}
	getItemValues(e, t = []) {
		return this.itemValuesByAddress.get(Oa(e, t))?.items ?? [];
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
		r > 0 && this.bindingsById.set(r, e), this.bindingsByComponentAndPropertyId.set(Ea(t, e.propertyId), e), this.bindingsByComponentAndPropertyName.set(Ea(t, n.propertyName), e);
	}
	addEvent(e) {
		let t = wa(e.eventName), n = E(e.componentId);
		if (t.length === 0 || n <= 0) return;
		this.eventsByComponentAndName.set(Da(n, t), e), this.eventNames.add(t);
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
		t > 0 && this.itemValuesByAddress.set(Oa(t, e.dynamicParameters ?? []), e);
	}
	addValidation(e) {
		let t = E(e.target?.componentId);
		if (t <= 0) return;
		let n = this.validationsByComponentId.get(t);
		n === void 0 && (n = [], this.validationsByComponentId.set(t, n)), n.push(e);
	}
};
function na(e, t) {
	return typeof e == "number" ? t[e] ?? "Unknown" : e != null && t.includes(e) ? e : "Unknown";
}
function ra(e) {
	return na(e, [
		"Dynamic",
		"Fixed",
		"Scope"
	]);
}
function ia(e) {
	return e == null ? "OneWay" : na(e, [
		"OneWay",
		"TwoWay",
		"OneWayToSource",
		"OnSubmit"
	]);
}
function aa(e) {
	return na(e, ["Property", "Event"]);
}
function oa(e) {
	return e == null ? "SetProperty" : na(e, [
		"SetProperty",
		"Effect",
		"CopyValue"
	]);
}
function sa(e) {
	return na(e, [
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
function ca(e) {
	return na(e, ["Ascending", "Descending"]);
}
function la(e) {
	return na(e, [
		"Change",
		"Blur",
		"Submit"
	]);
}
function ua(e) {
	return na(e, [
		"Error",
		"Warning",
		"Info"
	]);
}
function da(e) {
	return typeof e == "string" ? e : na(e, [
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
function fa(e) {
	return na(e, [
		"None",
		"HasValue",
		"HasText",
		"IsTrue",
		"IsFalse",
		"DrawsIcon"
	]);
}
function pa(e) {
	return na(e, [
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
function ma(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function ha(e) {
	return typeof e == "string" ? e : "";
}
function ga(e) {
	return na(e.kind, [
		"Value",
		"CollectionChange",
		"FullResync",
		"Validation",
		"Page"
	]);
}
function _a(e) {
	return typeof e == "string" ? e.trim() : "";
}
function va(e) {
	return na(e, ["Auto", "Smooth"]);
}
function ya(e) {
	return na(e, [
		"Start",
		"Center",
		"End",
		"Nearest"
	]);
}
function ba(e) {
	return na(e, [
		"Start",
		"End",
		"Offset",
		"PageBack",
		"PageForward"
	]);
}
function xa(e) {
	return na(e, ["Light", "Dark"]);
}
function Sa(e) {
	return na(e, ["Horizontal", "Vertical"]);
}
function Ca(e) {
	return na(e, ["Polite", "Assertive"]);
}
function wa(e) {
	return e?.trim().toLowerCase() ?? "";
}
function Ta(e) {
	return e?.trim() ?? "";
}
function Ea(e, t) {
	return `${e}:${Ta(t)}`;
}
function Da(e, t) {
	return `${e}:${wa(t)}`;
}
function Oa(e, t) {
	return `${e}:${ma(t)}`;
}
//#endregion
//#region src/addressing/address-resolver.ts
var ka = class {
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
		return n === void 0 && (n = `[${Je}${Xi(t)}="${Yi(e)}"]`, this.bindingSelectors.set(e, n)), n;
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
		return $i(e.component, t, () => {
			if (e.bindingSelector === null) return [e.component.querySelector(this.intoSelector(e.propertyName)) ?? e.component];
			let t = Array.from(e.component.querySelectorAll(e.bindingSelector));
			return e.component.matches(e.bindingSelector) && t.unshift(e.component), t;
		});
	}
	intoSelector(e) {
		let t = this.intoSelectors.get(e);
		return t === void 0 && (t = `[${Ye}${Xi(e)}]`, this.intoSelectors.set(e, t)), t;
	}
};
//#endregion
//#region src/addressing/dynamic-parameters.ts
function Aa(e) {
	return Pa(e, ae);
}
function ja(e, t) {
	if (t <= 0) return [];
	let n = [], r = e, i = null;
	for (; r !== null && n.length < t;) {
		let e = Ia(r);
		if (e !== void 0) {
			let t = r.closest(Fa);
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
function Ma(e, t) {
	let n = Aa(e);
	if (n !== t.length) return !1;
	if (n === 0) return !0;
	let r = ja(e, n);
	if (r.length !== t.length) return !1;
	for (let e = 0; e < t.length; e++) if (String(r[e] ?? "") !== String(t[e] ?? "")) return !1;
	return !0;
}
function Na(e, t) {
	let n = t.length - 1, r = e, i = null;
	for (; r !== null && n >= 0;) {
		let e = Ia(r);
		if (e !== void 0) {
			let a = r.closest(Fa);
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
function Pa(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.trim().length === 0) return 0;
	let r = Number(n);
	return Number.isInteger(r) ? r : 0;
}
var Fa = `[${x}]`;
function Ia(e) {
	return e.getAttribute("data-ui-key") ?? e.getAttribute("data-ui-group-anchor") ?? void 0;
}
//#endregion
//#region src/addressing/dom-registry.ts
var La = `[${It}]`, Ra = 64, za = 256;
function Ba(e, t) {
	let n = [];
	for (let r of e) r instanceof HTMLElement && r.matches(t) ? n.push(r) : n.push(...r.querySelectorAll(t));
	return n;
}
var Va = class {
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
		this.stale || (e === void 0 || this.changedScopes.size >= Ra ? (this.stale = !0, this.changedScopes.clear()) : this.changedScopes.add(e));
	}
	rebuild() {
		this.stale = !1, this.componentsById.clear(), this.staticComponentsById.clear(), this.keyedComponentsById.clear(), this.indexed.clear(), this.changedScopes.clear(), this.unsettledIds.clear();
		let e = this.root.querySelectorAll(w), t = this.root.querySelector(La) !== null;
		for (let n of e) {
			let e = D(n);
			if (e <= 0 || t && n.closest(La) !== null) continue;
			let r = this.componentsById.get(e);
			r === void 0 && (r = [], this.componentsById.set(e, r)), r.push(n), this.indexed.add(n), !this.staticComponentsById.has(e) && Wa(n) && this.staticComponentsById.set(e, n);
		}
		this.patchedSincePrune = 0, this.prunedSize = this.indexed.size;
	}
	findComponent(e, t) {
		return this.findAllComponents(e, t)[0] ?? null;
	}
	ensureId(e, t) {
		return Qi(e, t);
	}
	findComponentParts(e, t, n) {
		return Ba(this.findAllComponents(e, t), n);
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
		let n = this.keyedComponents(e).get(ma(t)) ?? [];
		if (n.length > 0 && n.every((e) => this.holds(e) && Ma(e, t))) return [...n];
		let r = this.liveComponents(e).filter((e) => Ma(e, t));
		return (n.length > 0 || r.length > 0) && this.keyedComponentsById.delete(e), r;
	}
	sync() {
		if (this.stale) this.rebuild();
		else if (this.changedScopes.size !== 0) {
			for (let e of this.changedScopes) this.holds(e) && this.addComponentsIn(e);
			this.changedScopes.clear(), this.patchedSincePrune > Math.max(this.prunedSize, za) && this.prune();
		}
	}
	addComponentsIn(e) {
		if (e.closest(La) !== null) return;
		let t = e.querySelector(La) !== null;
		e.matches("[data-ui-id]") && this.addComponent(e, !1);
		for (let n of e.querySelectorAll(w)) this.addComponent(n, t);
	}
	addComponent(e, t) {
		let n = D(e);
		if (n <= 0) return;
		if (this.indexed.has(e)) {
			this.unsettledIds.add(n);
			return;
		}
		if (t && e.closest(La) !== null) return;
		this.indexed.add(e), this.patchedSincePrune++, this.keyedComponentsById.delete(n);
		let r = this.componentsById.get(n);
		r === void 0 ? (this.componentsById.set(n, [e]), Wa(e) && this.staticComponentsById.set(n, e)) : (r.push(e), this.unsettledIds.add(n));
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
		r && (t.length = n, this.keyedComponentsById.delete(e)), i && !qa(t) && t.sort(Ka), t.length === 0 ? (this.componentsById.delete(e), this.staticComponentsById.delete(e)) : (r || i) && this.settleStatic(e, t);
	}
	settleStatic(e, t) {
		for (let n of t) if (Wa(n)) {
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
			let e = Aa(n);
			if (e === 0) continue;
			let r = ja(n, e);
			if (r.length !== e) continue;
			let i = ma(r), a = t.get(i);
			a === void 0 ? t.set(i, [n]) : a.push(n);
		}
		return this.keyedComponentsById.set(e, t), t;
	}
	holds(e) {
		return Ja(this.root, e);
	}
	resolveNearestComponent(e, t) {
		this.sync();
		let n = e;
		for (; n !== null;) {
			let e = n.closest(w);
			if (e === null || !Ja(this.root, e)) return null;
			let r = D(e);
			if (r > 0 && t(r, e)) return {
				element: e,
				componentId: r,
				dynamicParameters: ja(e, Aa(e))
			};
			n = e.parentElement;
		}
		return null;
	}
};
function D(e) {
	return Pa(e, y);
}
function Ha(e) {
	let t = e.closest(w), n = t === null ? 0 : D(t);
	return n > 0 ? n : null;
}
function Ua(e) {
	let t = e.closest(w), n = t === null ? 0 : D(t);
	return t === null || n <= 0 ? null : {
		componentId: n,
		dynamicParameters: ja(t, Aa(t))
	};
}
function Wa(e) {
	return Aa(e) === 0;
}
function Ga(e, t) {
	return (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
}
function Ka(e, t) {
	return e === t ? 0 : Ga(e, t) ? -1 : 1;
}
function qa(e) {
	for (let t = 1; t < e.length; t++) if (!Ga(e[t - 1], e[t])) return !1;
	return !0;
}
function Ja(e, t) {
	return e === t || e instanceof Node && e.contains(t);
}
//#endregion
//#region src/rendering/url-safety.ts
var Ya = [
	"http",
	"https",
	"mailto",
	"tel"
];
function Xa(e) {
	let t = String(e ?? "");
	if (t.trim().length === 0) return !1;
	for (let e of t) {
		let t = e.codePointAt(0) ?? 0;
		if (t <= 32 || t >= 127 && t <= 159) return !1;
	}
	if ("/#?.".includes(t[0])) return !0;
	let n = t.indexOf(":");
	return n < 0 || Ya.includes(t.slice(0, n).toLowerCase());
}
function Za(e) {
	return Xa(e) ? String(e) : void 0;
}
var Qa = [
	"http:",
	"https:",
	"mailto:",
	"tel:"
];
function $a(e) {
	let t = ro(e), n = t.toLowerCase();
	return /^[\\/]{2}/.test(t) || Qa.some((e) => n.startsWith(e));
}
function eo(e) {
	return typeof e != "string" || /[\x00-\x1f\x7f-\x9f]/.test(e) ? !1 : e === "/" || to(e);
}
function to(e) {
	return e.length > 1 && e[0] === "/" && e[1] !== "/" && e[1] !== "\\";
}
function no(e) {
	return e.length > 0 && e[0] !== "/" && e[0] !== "\\" && !/^[A-Za-z][A-Za-z\d+.-]*:/.test(e);
}
function ro(e) {
	let t = 0, n = e.length;
	for (; t < n && e.charCodeAt(t) <= 32;) t++;
	for (; n > t && e.charCodeAt(n - 1) <= 32;) n--;
	return e.slice(t, n).replace(/[\t\n\r]/g, "");
}
function io(e) {
	return ao(e) !== null;
}
function ao(e) {
	let t = ro(e), n = t.toLowerCase();
	return to(t) || no(t) || n.startsWith("https://") || n.startsWith("http://") || n.startsWith("data:image/") ? t : null;
}
function oo(e) {
	return ao(String(e ?? "").trim()) ?? void 0;
}
//#endregion
//#region src/rendering/icon-value.ts
var so = "mask:", co = "ui-icon--image", lo = "ui-icon--mask";
function uo(e) {
	let t = String(e ?? "").trim(), n = !1;
	t.startsWith(so) && (n = !0, t = t.slice(5).trim());
	let r = t.includes("/") ? ao(t) : null;
	return r === null ? null : {
		source: r,
		tinted: n
	};
}
function fo(e) {
	let t = uo(e);
	return t === null ? "" : po(t.source);
}
function po(e) {
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
var mo = "ui-icon", ho = "data-ui-icon", go = "--ui-icon-url";
function _o(e, t) {
	e.classList.add(mo);
	for (let t of Array.from(e.classList)) yo(t) && e.classList.remove(t);
	(e instanceof HTMLElement || e instanceof SVGElement) && e.style.removeProperty(go);
	let n = bo(t);
	if (n.length === 0) {
		e.removeAttribute(ho);
		return;
	}
	e.setAttribute(ho, ""), e.classList.add(n);
	let r = uo(t);
	r !== null && (e instanceof HTMLElement || e instanceof SVGElement) && e.style.setProperty(go, po(r.source));
}
var vo = "ui-icon-glyph--";
function yo(e) {
	return e === co || e === lo || e.startsWith(vo);
}
function bo(e) {
	let t = uo(e);
	return t === null ? xo(e) : t.tinted ? lo : co;
}
function xo(e) {
	let t = String(e ?? "").trim();
	if (t.length === 0) return "";
	let n = vo;
	for (let e of t) {
		let t = e.charCodeAt(0);
		t >= 48 && t <= 57 || t >= 65 && t <= 90 || t >= 97 && t <= 122 ? n += e.toLowerCase() : (e === "-" || e === "_" || e === "." || e === " ") && (n.endsWith("-") || (n += "-"));
	}
	return n.length === 15 ? "" : n;
}
//#endregion
//#region src/rendering/inline-markup.ts
var So = {
	None: 0,
	Bold: 1,
	Italic: 2,
	Underline: 4,
	Strikethrough: 8,
	Code: 16
}, Co = "\\", wo = "`", To = "!", Eo = "{", Do = "}", Oo = "ui-text__fold", ko = "ui-text__fold-toggle", Ao = "ui-text__fold-content", jo = 8;
function Mo(e, t = {}) {
	if (e == null || e.length === 0) return [];
	let n = [], r = { value: "" };
	return Wo(new as(e, t.autolinks === !0), 0, e.length, So.None, null, n, r), Go(n, r, So.None, null), n;
}
function No(e, t = {}) {
	return Mo(e, t).map((e) => Ro(e) ? `${e.fold} ${No(e.text, t)}` : e.text).join("");
}
function Po(e) {
	let t = "";
	for (let n of e) t += cs(n) ? Co + n : n;
	return t;
}
function Fo(e, t, n = {}) {
	let r = Mo(t, n), i = r.some(Ro);
	e.hasAttribute("data-ui-folds") !== i && e.toggleAttribute(Ke, i), r.length === 0 ? e.textContent = "" : r.length === 1 && Io(r[0]) ? e.textContent = r[0].text : e.replaceChildren(zo(r, n));
}
function Io(e) {
	return e.styles === So.None && e.url === null && !Lo(e) && !Ro(e);
}
function Lo(e) {
	return e.icon !== null && e.icon !== void 0 && e.icon.length > 0;
}
function Ro(e) {
	return e.fold !== null && e.fold !== void 0;
}
function zo(e, t) {
	let n = document.createDocumentFragment();
	for (let r of e) n.append(Bo(r, t));
	return n;
}
function Bo(e, t) {
	if (Lo(e)) return Ho(e.icon);
	let n = Ro(e) ? Vo(e, t) : document.createTextNode(e.text);
	if ((e.styles & So.Code) !== 0) {
		let e = document.createElement("code");
		e.className = "ui-text__code", e.append(n), n = e;
	}
	if ((e.styles & So.Strikethrough) !== 0 && (n = Uo("s", n)), (e.styles & So.Underline) !== 0 && (n = Uo("u", n)), (e.styles & So.Italic) !== 0 && (n = Uo("em", n)), (e.styles & So.Bold) !== 0 && (n = Uo("strong", n)), e.url !== null) {
		let t = document.createElement("a");
		t.setAttribute("href", e.url), t.className = "ui-text__link", $a(e.url) && (t.setAttribute("target", "_blank"), t.setAttribute("rel", "noopener noreferrer")), t.append(n), n = t;
	}
	return n;
}
function Vo(e, t) {
	let n = document.createElement("span"), r = document.createElement(t.staticFolds === !0 ? "span" : "button"), i = document.createElement("span");
	return n.className = t.staticFolds === !0 ? `${Oo} ${Oo}--static` : Oo, r.className = ko, r.textContent = e.fold ?? "", i.className = Ao, i.append(zo(Mo(e.text, t), t)), t.staticFolds === !0 ? (n.append(r, " ", i), n) : (r.setAttribute("type", "button"), r.setAttribute("aria-expanded", "false"), r.setAttribute(Qe, ""), n.append(r, i), n);
}
function Ho(e) {
	let t = document.createElement("i");
	return t.className = "ui-text__icon-inline", _o(t, e), t.setAttribute("aria-hidden", "true"), t;
}
function Uo(e, t) {
	let n = document.createElement(e);
	return n.append(t), n;
}
function Wo(e, t, n, r, i, a, o) {
	let s = e.text, c = t;
	for (; c < n;) {
		let t = s[c];
		if (t === Co && c + 1 < n && cs(s[c + 1])) {
			o.value += s[c + 1], c += 2;
			continue;
		}
		let l = Ko(e, c, n);
		if (l !== null) {
			Go(a, o, r, i), qo(s, c + 1, l, o), Go(a, o, r | So.Code, i), c = l + 1;
			continue;
		}
		let u = Xo(e, c, n);
		if (u !== null) {
			Go(a, o, r, i), Wo(e, c + u.markerLength, u.contentEnd, r | u.style, i, a, o), Go(a, o, r | u.style, i), c = u.contentEnd + u.markerLength;
			continue;
		}
		let d = Jo(e, c, n);
		if (d !== null) {
			Go(a, o, r, i), a.push({
				text: "",
				styles: r,
				url: i,
				icon: d.name
			}), c = d.iconEnd;
			continue;
		}
		let f = i === null && e.autolinks ? Zo(e, c, n) : null;
		if (f !== null) {
			Go(a, o, r, i), a.push({
				text: f.address,
				styles: r,
				url: f.address
			}), c = f.addressEnd;
			continue;
		}
		let p = i === null ? rs(e, c, n) : null;
		if (p !== null) {
			Go(a, o, r, i), Wo(e, p.labelStart, p.labelEnd, r, p.url, a, o), Go(a, o, r, p.url), c = p.linkEnd;
			continue;
		}
		let m = is(e, c, n);
		m === null ? (o.value += t, c++) : (Go(a, o, r, i), a.push({
			text: s.slice(m.contentStart, m.contentEnd),
			styles: r,
			url: i,
			fold: m.caption
		}), c = m.contentEnd + 1);
	}
}
function Go(e, t, n, r) {
	t.value.length !== 0 && (e.push({
		text: t.value,
		styles: n,
		url: r
	}), t.value = "");
}
function Ko(e, t, n) {
	let r = e.text;
	if (r[t] !== wo) return null;
	let i = t + 1;
	if (i >= n || ls(r[i])) return null;
	let a = e.findClosingMarker(i, n, wo, 1);
	return a > i ? a : null;
}
function qo(e, t, n, r) {
	for (let i = t; i < n; i++) e[i] === Co && i + 1 < n && cs(e[i + 1]) ? (r.value += e[i + 1], i++) : r.value += e[i];
}
function Jo(e, t, n) {
	let r = e.text;
	if (r[t] !== To || t + 1 >= n || r[t + 1] !== "[") return null;
	let i = t + 2, a = e.findClosingBracket(i, n);
	if (a <= i) return null;
	let o = r.slice(i, a);
	return Yo(o) ? {
		name: o,
		iconEnd: a + 1
	} : null;
}
function Yo(e) {
	return e.length > 0 && /^[A-Za-z0-9._-]+$/.test(e);
}
function Xo(e, t, n) {
	let r = e.text, i = r[t];
	if (i !== "*" && i !== "_" && i !== "~") return null;
	let a = t + 1 < n && r[t + 1] === i, o, s;
	if (i === "*" && a) o = So.Bold, s = 2;
	else if (i === "*") o = So.Italic, s = 1;
	else if (i === "_" && a) o = So.Underline, s = 2;
	else if (i === "~" && a) o = So.Strikethrough, s = 2;
	else return null;
	let c = t + s;
	if (c >= n || ls(r[c])) return null;
	let l = e.findClosingMarker(c, n, i, s);
	return l > c ? {
		style: o,
		markerLength: s,
		contentEnd: l
	} : null;
}
function Zo(e, t, n) {
	let r = e.text;
	if (r[t] !== "h" && r[t] !== "H" || t > 0 && !Qo(r[t - 1])) return null;
	let i = r.slice(t, Math.min(t + 8, n)).toLowerCase(), a = i.startsWith("https://") ? t + 8 : i.startsWith("http://") ? t + 7 : -1;
	if (a < 0) return null;
	let o = $o(r, a, n);
	if (!ns(r.slice(a, ts(e, a, o, 0, 0)))) return null;
	let s = o, c = 0, l = 0;
	for (; s < n && !us(r[s]) && !ds(r[s]) && r[s] !== "<";) r[s] === "(" ? c-- : r[s] === ")" ? c++ : r[s] === "[" ? l-- : r[s] === "]" && l++, s++;
	if (s = ts(e, a, s, c, l), !ns(r.slice(a, Math.min(o, s)))) return null;
	let u = { value: "" };
	return qo(r, t, s, u), Xa(u.value) ? {
		address: u.value,
		addressEnd: s
	} : null;
}
function Qo(e) {
	return !/^[\p{L}\p{Nd}]$/u.test(e);
}
function $o(e, t, n) {
	let r = t;
	for (; r < n;) if (es(e[r])) r++;
	else if (e[r] === Co && r + 1 < n && e[r + 1] === "_") r += 2;
	else break;
	return r;
}
function es(e) {
	return /^[\p{L}\p{Nd}_.-]$/u.test(e);
}
function ts(e, t, n, r, i) {
	let a = e.text;
	for (; n > t;) {
		let t = n - 1, o = a[t];
		if (o === ")" && r > 0) r--;
		else if (o === "]" && i > 0) i--;
		else if (!"?!.,:;*_~'\"»”’".includes(o)) break;
		n = e.isEscaped(t) && cs(o) ? t - 1 : t;
	}
	return n;
}
function ns(e) {
	let t = (e.endsWith(".") ? e.slice(0, -1) : e).split(".");
	return t.length >= 2 && t.every((e) => e.length > 0) && !t.slice(-2).some((e) => e.includes("_"));
}
function rs(e, t, n) {
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
function is(e, t, n) {
	let r = e.text;
	if (r[t] !== "[") return null;
	let i = e.findClosingBracket(t + 1, n);
	if (i <= t + 1 || i + 1 >= n || r[i + 1] !== Eo || e.hasOpeningBracket(t + 1, i)) return null;
	let a = i + 1, o = a + 1, s = e.findMatchingBrace(a, n);
	if (s <= o || e.braceDepth(a) > jo) return null;
	let c = { value: "" };
	return qo(r, t + 1, i, c), {
		caption: c.value,
		contentStart: o,
		contentEnd: s
	};
}
var as = class {
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
		return this.closeBrackets ??= this.next("]", !0), os(this.closeBrackets[e], t);
	}
	hasOpeningBracket(e, t) {
		return this.openBrackets ??= this.next("[", !0), os(this.openBrackets[e], t) >= 0;
	}
	findClosingParen(e, t) {
		return this.closeParens ??= this.next(")", !1), os(this.closeParens[e], t);
	}
	findMatchingBrace(e, t) {
		return os(this.braces()[e], t);
	}
	braceDepth(e) {
		return this.braces(), this.braceDepths[e];
	}
	findClosingMarker(e, t, n, r) {
		let i = ss(n, r), a = this.closers[i] ?? this.buildClosers(n, r);
		this.closers[i] = a;
		let o = a[e + 1];
		if (r === 2) return o >= 0 && o + 1 < t ? o : -1;
		if (o >= 0 && o < t - 1) return o;
		let s = t - 1;
		return s > e && this.text[s] === n && !this.isEscaped(s) && !ls(this.text[s - 1]) ? s : -1;
	}
	readLinkUrl(e, t) {
		if (this.linkLabel !== e) {
			let n = this.text.slice(e + 2, t).trim();
			this.linkLabel = e, this.linkUrl = Xa(n) ? n : null;
		}
		return this.linkUrl;
	}
	isEscaped(e) {
		if (this.escaped === null) {
			let e = new Uint8Array(this.text.length);
			for (let t = 1; t < this.text.length; t++) e[t] = +(this.text[t - 1] === Co && e[t - 1] === 0);
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
			if (this.text[r] === Eo) n.push(r);
			else if (this.text[r] === Do && n.length > 0) {
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
		if (e === 0 || this.text[e] !== t || this.isEscaped(e) || ls(this.text[e - 1])) return !1;
		let r = e + 1 < this.text.length && this.text[e + 1] === t;
		return n === 2 ? r : !r;
	}
};
function os(e, t) {
	return e >= 0 && e < t ? e : -1;
}
function ss(e, t) {
	switch (e) {
		case "*": return t === 2 ? 0 : 1;
		case "_": return 2;
		case "~": return 3;
		default: return 4;
	}
}
function cs(e) {
	return e === "*" || e === "_" || e === "~" || e === "[" || e === "]" || e === "(" || e === ")" || e === Eo || e === Do || e === wo || e === Co;
}
function ls(e) {
	return e === " " || e === "	" || e === "\r" || e === "\n";
}
function us(e) {
	return /^\p{White_Space}$/u.test(e);
}
function ds(e) {
	let t = e.charCodeAt(0);
	return t < 32 || t >= 127 && t <= 159;
}
//#endregion
//#region src/runtime/plural-rules.ts
function fs(e, t) {
	if (!Number.isFinite(t)) return "other";
	let n = Math.abs(t), r = Math.trunc(n), i = ps(n);
	switch (ms(e)) {
		case "en":
		case "de": return r === 1 && i === 0 ? "one" : "other";
		case "es": return n === 1 ? "one" : hs(r, i) ? "many" : "other";
		case "fr": return r === 0 || r === 1 ? "one" : hs(r, i) ? "many" : "other";
		case "ru":
		case "uk": return gs(r, i);
		case "pl": return _s(r, i);
		default: return "other";
	}
}
function ps(e) {
	if (Number.isInteger(e)) return 0;
	let t = String(e), n = t.indexOf("e"), r = n < 0 ? t : t.slice(0, n), i = n < 0 ? 0 : Number(t.slice(n + 1)), a = r.indexOf("."), o = a < 0 ? 0 : r.length - a - 1;
	return Math.max(0, o - i);
}
function ms(e) {
	return e == null || e.trim().length === 0 ? "" : e.split(/[-_]/, 1)[0].toLowerCase();
}
function hs(e, t) {
	return t === 0 && e !== 0 && e % 1e6 == 0;
}
function gs(e, t) {
	if (t !== 0) return "other";
	let n = e % 10, r = e % 100;
	return n === 1 && r !== 11 ? "one" : n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
function _s(e, t) {
	if (t !== 0) return "other";
	if (e === 1) return "one";
	let n = e % 10, r = e % 100;
	return n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
//#endregion
//#region src/rendering/temporal-format.ts
function vs(e, t) {
	return `${e.date} ${t ? e.longTime : e.shortTime}`;
}
var ys = {
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
function bs(e) {
	let t = e.closest("[data-ui-temporal-culture]")?.getAttribute("data-ui-temporal-culture") ?? null;
	if (t === null) return ys;
	try {
		return {
			...ys,
			...JSON.parse(t)
		};
	} catch {
		return ys;
	}
}
var xs = [
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
function Ss(e, t, n) {
	if (t == null || t.trim().length === 0) return `${ks(e.getFullYear(), 4)}-${ks(e.getMonth() + 1, 2)}-${ks(e.getDate(), 2)} ${ks(e.getHours(), 2)}:${ks(e.getMinutes(), 2)}:${ks(e.getSeconds(), 2)}`;
	let r = "", i = Cs(t);
	for (let a = 0; a < t.length;) {
		let o = Ds(t, a);
		o === null ? (r += t[a], a++) : (r += Os(o, e, n, i), a += o.length);
	}
	return r;
}
function Cs(e) {
	for (let t = 0; t < e.length;) {
		let n = Ds(e, t);
		if (n === null) t++;
		else {
			if (n === "d" || n === "dd") return !0;
			t += n.length;
		}
	}
	return !1;
}
var ws = /^[-./:,]$/, Ts = /* @__PURE__ */ new Set([
	"MMMM",
	"MMM",
	"dddd",
	"ddd",
	"tt"
]);
function Es(e) {
	for (let t = 0; t < e.length;) {
		let n = Ds(e, t);
		if (n !== null && Ts.has(n) || n === null && !ws.test(e[t]) && !/\s/.test(e[t])) return !1;
		t += n?.length ?? 1;
	}
	return e.trim().length > 0;
}
function Ds(e, t) {
	for (let n of xs) if (e.startsWith(n, t)) return n;
	return null;
}
function Os(e, t, n, r) {
	let i = t.getHours(), a = Js(i);
	switch (e) {
		case "yyyy": return ks(t.getFullYear(), 4);
		case "yy": return ks(t.getFullYear() % 100, 2);
		case "MMMM": return r ? n.monthGenitiveNames[t.getMonth()] : n.monthNames[t.getMonth()];
		case "MMM": return n.abbreviatedMonthNames[t.getMonth()];
		case "MM": return ks(t.getMonth() + 1, 2);
		case "M": return String(t.getMonth() + 1);
		case "dddd": return n.dayNames[t.getDay()];
		case "ddd": return n.abbreviatedDayNames[t.getDay()];
		case "dd": return ks(t.getDate(), 2);
		case "d": return String(t.getDate());
		case "HH": return ks(i, 2);
		case "H": return String(i);
		case "hh": return ks(a, 2);
		case "h": return String(a);
		case "mm": return ks(t.getMinutes(), 2);
		case "m": return String(t.getMinutes());
		case "ss": return ks(t.getSeconds(), 2);
		case "s": return String(t.getSeconds());
		case "tt": return i < 12 ? n.amDesignator : n.pmDesignator;
		default: return e;
	}
}
function ks(e, t) {
	return String(e).padStart(t, "0");
}
var As = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function js(e) {
	let t = As.exec(e.trim());
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
function Ms(e) {
	return Ns(e.year, e.month - 1, e.day, e.hour, e.minute, e.second, e.millisecond);
}
function Ns(e, t, n, r = 0, i = 0, a = 0, o = 0) {
	let s = new Date(2e3, 0, 1, r, i, a, o);
	return s.setFullYear(e, t, n), s;
}
var Ps = {
	year: "y",
	month: "M",
	day: "d",
	hour: "H",
	minute: "m",
	second: "s"
};
function Fs(e, t) {
	let n = "";
	for (let r = 0; r < e.length;) {
		let i = Ds(e, r);
		i === null ? (n += e[r], r++) : (n += Is(i, t).repeat(i.length), r += i.length);
	}
	return n;
}
function Is(e, t) {
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
function Ls(e, t, n) {
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
		let a = Ds(t, e);
		if (a === null) {
			if (!Rs(r, i, t[e])) return null;
			e++;
		} else {
			if (!zs(r, i, a, n)) return null;
			e += a.length;
		}
	}
	return r.length > 0 && i.position === r.length ? Ks(i) : null;
}
function Rs(e, t, n) {
	if (/\s/.test(n)) {
		for (; t.position < e.length && /\s/.test(e[t.position]);) t.position++;
		return !0;
	}
	return ws.test(n) ? t.position >= e.length || !ws.test(e[t.position]) ? !1 : (t.position++, !0) : t.position >= e.length || e[t.position].toLowerCase() !== n.toLowerCase() ? !1 : (t.position++, !0);
}
function zs(e, t, n, r) {
	switch (n) {
		case "yyyy": return Bs(t, "year", Us(e, t, 4, 4));
		case "yy": return Bs(t, "year", Vs(Us(e, t, 2, 2)));
		case "MMMM":
		case "MMM": return Bs(t, "month", Hs(Ws(e, t, [
			r.monthNames,
			r.monthGenitiveNames,
			r.abbreviatedMonthNames
		])));
		case "MM":
		case "M": return Bs(t, "month", Us(e, t, 1, 2));
		case "dddd":
		case "ddd": return Ws(e, t, [r.dayNames, r.abbreviatedDayNames]) !== null;
		case "dd":
		case "d": return Bs(t, "day", Us(e, t, 1, 2));
		case "HH":
		case "H": return Bs(t, "hour", Us(e, t, 1, 2));
		case "hh":
		case "h": return Bs(t, "hour12", Us(e, t, 1, 2));
		case "mm":
		case "m": return Bs(t, "minute", Us(e, t, 1, 2));
		case "ss":
		case "s": return Bs(t, "second", Us(e, t, 1, 2));
		case "tt": return Gs(e, t, r);
		default: return !1;
	}
}
function Bs(e, t, n) {
	return n !== null && (e[t] = n, !0);
}
function Vs(e) {
	return e === null ? null : e + (e < 50 ? 2e3 : 1900);
}
function Hs(e) {
	return e === null ? null : e + 1;
}
function Us(e, t, n, r) {
	let i = t.position;
	for (; i < e.length && i - t.position < r && e[i] >= "0" && e[i] <= "9";) i++;
	if (i - t.position < n) return null;
	let a = Number(e.slice(t.position, i));
	return t.position = i, a;
}
function Ws(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = null, a = 0;
	for (let e of n) for (let t = 0; t < e.length; t++) {
		let n = e[t].toLowerCase();
		n.length > a && r.startsWith(n) && (i = t, a = n.length);
	}
	return t.position += a, i;
}
function Gs(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = n.amDesignator.toLowerCase(), a = n.pmDesignator.toLowerCase();
	for (let [e, n] of i.length >= a.length ? [[i, !1], [a, !0]] : [[a, !0], [i, !1]]) if (e.length > 0 && r.startsWith(e)) return t.position += e.length, t.afternoon = n, !0;
	return i.length === 0 && a.length === 0;
}
function Ks(e) {
	let t = e.hour ?? 0;
	if (e.hour12 !== null) {
		if (e.hour12 < 1 || e.hour12 > 12) return null;
		t = e.hour12 % 12 + (e.afternoon === !0 ? 12 : 0);
	}
	return e.year === null || e.month === null || e.day === null || e.year < 1 || e.month < 1 || e.month > 12 || e.day < 1 || e.day > Ns(e.year, e.month, 0).getDate() || t > 23 || e.minute > 59 || e.second > 59 ? null : {
		year: e.year,
		month: e.month,
		day: e.day,
		hour: t,
		minute: e.minute,
		second: e.second,
		millisecond: 0
	};
}
var qs = {
	readCulture: bs,
	format: Ss,
	parse: js,
	toDate: Ms
};
function Js(e) {
	return e % 12 == 0 ? 12 : e % 12;
}
//#endregion
//#region src/rendering/timestamp-format.ts
var Ys = /(?:Z|[+-]\d{2}(?::?\d{2})?)$/i, Xs = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function Zs(e) {
	let t = e?.trim() ?? "";
	if (!Xs.test(t)) return null;
	let n = Date.parse(Ys.test(t) ? t : `${t}Z`);
	return Number.isNaN(n) ? null : n;
}
function Qs(e) {
	return e === "date" || e === "time" || e === "relative" || e === "relative-date" ? e : "date-time";
}
function $s(e) {
	return e === "relative" || e === "relative-date";
}
var ec = {
	...ys,
	date: "yyyy-MM-dd",
	shortTime: "HH:mm",
	longTime: "HH:mm:ss"
};
function tc(e, t, n, r) {
	if (t === "relative") return fc(e - r, n.language);
	if (t === "relative-date") {
		let t = rc(e, r);
		if (t !== null) return oc(n.language).format(t, "day");
	}
	let i = n.temporal ?? ec, a = t === "date" || t === "relative-date" ? i.date : t === "time" ? i.shortTime : vs(i, !1);
	return Ss(new Date(e), a, i);
}
function nc(e, t, n, r) {
	let i = tc(e, t, n, r);
	return t === "relative-date" ? ic(i, n.language) : i;
}
function rc(e, t) {
	let n = new Date(e), r = new Date(t), i = Math.round((Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) - Date.UTC(r.getFullYear(), r.getMonth(), r.getDate())) / dc);
	return Math.abs(i) <= 1 ? i : null;
}
function ic(e, t) {
	return e.length === 0 ? e : e.charAt(0).toLocaleUpperCase(sc(t)) + e.slice(1);
}
var ac = /* @__PURE__ */ new Map();
function oc(e) {
	let t = ac.get(e);
	return t === void 0 && (t = new Intl.RelativeTimeFormat(sc(e), { numeric: "auto" }), ac.set(e, t)), t;
}
function sc(e) {
	if (e.length !== 0) try {
		return Intl.DateTimeFormat.supportedLocalesOf(e).length > 0 ? e : void 0;
	} catch {
		return;
	}
}
var cc = 1e3, lc = 60 * cc, uc = 60 * lc, dc = 24 * uc;
function fc(e, t) {
	let n = oc(t), r = Math.abs(e);
	return r < 45 * cc ? n.format(0, "second") : r < 45 * lc ? n.format(Math.round(e / lc), "minute") : r < 22 * uc ? n.format(Math.round(e / uc), "hour") : r < 26 * dc ? n.format(Math.round(e / dc), "day") : r < 320 * dc ? n.format(Math.round(e / (30.4375 * dc)), "month") : n.format(Math.round(e / (365.25 * dc)), "year");
}
//#endregion
//#region src/runtime/words.ts
var pc = "count";
function O(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	if (typeof t.key != "string" || t.key.trim().length === 0) return !1;
	for (let e of Object.keys(t)) if (e !== "key" && e !== "args") return !1;
	return t.args === void 0 || t.args === null || typeof t.args == "object" && !Array.isArray(t.args);
}
function mc(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.text == "string" && t.text.trim().length > 0 && Object.keys(t).length === 1;
}
var hc = /* @__PURE__ */ new Set([
	"date-time",
	"date",
	"time",
	"relative",
	"relative-date"
]);
function gc(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	for (let e of Object.keys(t)) if (e !== "moment" && e !== "format") return !1;
	return typeof t.moment == "string" && Zs(t.moment) !== null && (t.format === void 0 || typeof t.format == "string" && hc.has(t.format));
}
function _c(e) {
	if (typeof e != "object" || !e) return !1;
	if (gc(e)) return !0;
	for (let t of Array.isArray(e) ? e : Object.values(e)) if (_c(t)) return !0;
	return !1;
}
function vc(e, t) {
	let n = new Date(e).toISOString(), r = n.slice(0, 10), i = n.slice(11, 16);
	return t === "date" || t === "relative-date" ? r : t === "time" ? `${i} UTC` : `${r} ${i} UTC`;
}
function yc(e, t, n) {
	return O(e) ? Sc(n, e.key, e.args) : mc(e) ? bc(n, e.text) : t && typeof e == "string" ? bc(n, e) : e;
}
function bc(e, t) {
	return t.trim().length === 0 || !xc(e.prefixes, t) ? t : e.lookup(t) ?? t;
}
function xc(e, t) {
	if (e.length === 0) return !0;
	for (let n of e) if (t.startsWith(n)) return !0;
	return !1;
}
function Sc(e, t, n, r = !1) {
	let i = n?.[pc];
	return Cc(typeof i == "number" ? e.lookup(`${t}.${fs(e.language, i)}`) ?? e.lookup(`${t}.other`) ?? e.lookup(t) ?? t : e.lookup(t) ?? t, n, (t) => mc(t) ? bc(e, t.text) : Sc(e, t.key, t.args, r), e.writeMoment, r);
}
function Cc(e, t, n, r = vc, i = !1) {
	if (t == null || !e.includes("{")) return e;
	let a = "", o = 0;
	for (; o < e.length;) {
		if (e[o] === "{") {
			let s = wc(e, o);
			if (s > 0) {
				let c = e.slice(o + 1, s);
				if (Object.hasOwn(t, c)) {
					a += Ec(t[c], n, r, i), o = s + 1;
					continue;
				}
			}
		}
		a += e[o], o++;
	}
	return a;
}
function wc(e, t) {
	let n = t + 1;
	for (; n < e.length && Tc(e.charCodeAt(n));) n++;
	return n > t + 1 && n < e.length && e[n] === "}" ? n : -1;
}
function Tc(e) {
	return e >= 48 && e <= 57 || e >= 65 && e <= 90 || e >= 97 && e <= 122 || e === 95;
}
function Ec(e, t, n, r) {
	if (e == null) return "";
	if (typeof e == "string") return r ? Po(e) : e;
	if (typeof e == "boolean") return e ? "true" : "false";
	if (O(e)) return t === void 0 ? Cc(e.key, e.args, void 0, n, r) : t(e);
	if (mc(e)) {
		let n = t === void 0 ? e.text : t(e);
		return r ? Po(n) : n;
	}
	return gc(e) ? n(Zs(e.moment) ?? 0, e.format ?? "date-time") : String(e);
}
//#endregion
//#region src/rendering/moment-first-paint.ts
var Dc = `script[type='application/json'][${bt}]`;
function Oc(e) {
	let t = e.querySelector(Dc)?.textContent?.trim() ?? "";
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
var kc = 15e3, Ac = /* @__PURE__ */ new Set(), jc = null;
function Mc(e) {
	Ac.add(e), jc === null && (jc = setInterval(Nc, kc));
}
function Nc() {
	for (let e of [...Ac]) {
		let t = !1;
		try {
			t = e();
		} catch (e) {
			s("a relative tick failed; it is ticked no more.", e);
		}
		t || Ac.delete(e);
	}
	Ac.size === 0 && jc !== null && (clearInterval(jc), jc = null);
}
//#endregion
//#region src/runtime/client-strings.ts
var Pc = 256, Fc = 512, Ic = "script[type='application/json'][data-ui-strings]", Lc = `[${Ur}*='"moment"']`, Rc = class {
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
		this.tableLoaded || (this.currentTemporal = Oc(e) ?? this.currentTemporal);
		let t = e.querySelector(Ic)?.textContent?.trim() ?? "";
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
		return this.lookup(e) === void 0 && this.text(e), Sc(this, e, t, n);
	}
	translate(e, t, n = !1) {
		return Sc(this, e, t, n);
	}
	writeMoment = (e, t) => ($s(t) && this.noteRelative(), tc(e, t, {
		temporal: this.currentTemporal,
		language: this.currentLanguage
	}, Date.now()));
	noteRelative() {
		this.relativeWritten = !0, this.momentHandlers.size > 0 && Mc(this.tickMoments);
	}
	tickMoments = () => this.relativeWritten ? (this.relativeWritten = !1, this.notify(this.momentHandlers, "a moment tick handler failed."), !0) : !1;
	resolve(e, t) {
		return yc(e, t, this);
	}
	resolveText(e) {
		return yc(e, !0, this);
	}
	write(e, t, n, r) {
		Kc(e, t, this.translate(n, r, Gc(t))), this.mark(e, t, r == null || Object.keys(r).length === 0 ? [n] : [n, r]);
	}
	writeText(e, t, n) {
		Kc(e, t, yc(n, !0, this)), this.mark(e, t, n);
	}
	writeValue(e, t, n) {
		if (O(n)) {
			this.write(e, t, n.key, n.args);
			return;
		}
		let r = mc(n) ? n.text : typeof n == "string" ? n : "";
		r.trim().length > 0 ? this.writeText(e, t, r) : (Kc(e, t, ""), this.mark(e, t, null));
	}
	mark(e, t, n) {
		Vc(e, t, n);
	}
	rewriteMarks(e, t = !1) {
		qc(e, (e) => {
			for (let n of e.querySelectorAll(t ? Lc : `[${Ur}]`)) for (let [e, r] of Object.entries(Wc(n))) {
				if (t && !_c(r)) continue;
				let i = e === "#text" ? null : e, a = this.wordsOfMark(r, Gc(i));
				a !== null && Kc(n, i, a);
			}
		});
	}
	wordsOfMark(e, t) {
		if (typeof e == "string") return yc(e, !0, this);
		if (!Array.isArray(e)) return null;
		let [n, r] = e;
		return typeof n == "string" ? this.translate(n, typeof r == "object" && r ? r : null, t) : null;
	}
	askLater(e) {
		this.asker === null || !this.tableLoaded || e.length > Fc || e.trim().length === 0 || (!this.complete || this.report && this.currentPrefixes.length > 0 && xc(this.currentPrefixes, e)) && (this.askedIn(this.currentLanguage).has(e) || (this.pending.add(e), !this.flushQueued && (this.flushQueued = !0, setTimeout(() => void this.flushAsync(), 0))));
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
		for (let r = 0; r < n.length; r += Pc) try {
			let a = await e(t, n.slice(r, r + Pc));
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
function zc(e) {
	let t = !1;
	return qc(e, (e) => {
		t ||= e.querySelector(Lc) !== null;
	}), t;
}
function Bc(e, t) {
	e.hasAttribute("data-ui-words") && Vc(e, t, null);
}
function Vc(e, t, n) {
	let r = Wc(e), i = t ?? "#text";
	if (n === null) {
		if (!(i in r)) return;
		delete r[i];
	} else r[i] = n;
	let a = JSON.stringify(r);
	T(e, Ur, Object.keys(r).length === 0 ? null : a);
}
function Hc(e) {
	return Uc(e, null);
}
function Uc(e, t) {
	let n = Wc(e)[t ?? "#text"];
	if (typeof n == "string") return n;
	if (!Array.isArray(n) || typeof n[0] != "string") return null;
	let r = n[1];
	return {
		key: n[0],
		args: typeof r == "object" && r ? r : null
	};
}
function Wc(e) {
	let t = e.getAttribute(Ur);
	if (t === null || t.length === 0) return {};
	try {
		let e = JSON.parse(t);
		return typeof e == "object" && e && !Array.isArray(e) ? e : {};
	} catch {
		return {};
	}
}
function Gc(e) {
	return e === Re;
}
function Kc(e, t, n) {
	t === null ? e.textContent !== n && (e.textContent = n) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function qc(e, t) {
	t(e);
	for (let n of e.querySelectorAll("template")) qc(n.content, t);
}
var k = new Rc();
function Jc(e, t) {
	let n = mc(e) ? e.text : e;
	return k.resolve(n, typeof n == "string" && n.length > 0 && t());
}
//#endregion
//#region src/updates/row-idle.ts
var Yc = "row-idle";
function Xc(e) {
	let t = e.parentElement;
	t !== null && (el(t) ? Zc(t) : !t.hasAttribute("data-ui-id") && t.parentElement !== null && el(t.parentElement) && Zc(t.parentElement));
}
function Zc(e) {
	let t = Qc(e);
	e.hasAttribute("data-ui-row-idle") !== t && e.toggleAttribute(jr, t);
}
function Qc(e) {
	for (let t of e.children) if (t.hasAttribute("data-ui-id")) {
		if ($c(t)) return !0;
	} else for (let e of t.children) if (e.hasAttribute("data-ui-id") && $c(e)) return !0;
	return !1;
}
function $c(e) {
	return e.classList.contains("ui-disabled") || e.classList.contains("ui-loading");
}
function el(e) {
	return e.hasAttribute("data-ui-key") && e.parentElement?.hasAttribute("data-ui-items-host") === !0;
}
//#endregion
//#region src/interactions/interactive-state.ts
var tl = `.${bi}, .${xi}, [inert]`;
function nl(e) {
	return `:scope > [${y}]:is(${e}), :scope > :not([${y}]) > [${y}]:is(${e})`;
}
var rl = nl(tl), il = /* @__PURE__ */ new Map();
function A(e) {
	return e.closest(tl) !== null || e.matches(":disabled, [aria-disabled='true']");
}
function j(e) {
	return e.matches(tl) || e.querySelector(rl) !== null;
}
function al(e, t) {
	if (e.hasAttribute(t)) return !0;
	let n = il.get(t);
	return n === void 0 && (n = nl(`[${t}]`), il.set(t, n)), e.querySelector(n) !== null;
}
function ol(e) {
	return e.getClientRects().length > 0 && !e.matches(":disabled") && e.closest("[inert]") === null;
}
var sl = `[${y}], .${Si}`;
function M(e) {
	return e.closest(sl)?.matches(`.${Si}`) === !0;
}
function cl(e, t) {
	e.classList.contains("ui-disabled") !== t && (e.classList.toggle(bi, t), Xc(e)), t ? e.setAttribute("aria-disabled", "true") : e.removeAttribute("aria-disabled");
}
var ll = {
	isInert: A,
	isReadOnly: M,
	setDisabled: cl
};
//#endregion
//#region src/interactions/grid-tracks.ts
function ul(e, t) {
	return Math.max(e, Math.round(t / 10));
}
function dl(e) {
	let t = [];
	for (let n of ml(e.trim())) {
		let e = /^repeat\(\s*(\d+)\s*,(.+)\)$/s.exec(n);
		if (e !== null) {
			let n = dl(e[2]);
			if (n === null) return null;
			for (let r = Number(e[1]); r > 0; r--) t.push(...n);
			continue;
		}
		let r = fl(n);
		if (r === null) return null;
		t.push(r);
	}
	return t.length === 0 ? null : t;
}
function fl(e) {
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
	if (n !== null) return pl({
		kind: "auto",
		value: 0
	}, Number(n[1]));
	let r = /^minmax\(\s*([\d.]+)(?:px)?\s*,\s*([\d.]+)(fr|px)\s*\)$/.exec(e);
	if (r !== null) return pl(r[3] === "fr" ? {
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
function pl(e, t) {
	return t > 0 ? {
		...e,
		min: t
	} : e;
}
function ml(e) {
	let t = [], n = 0, r = 0;
	for (let i = 0; i < e.length; i++) {
		let a = e[i];
		a === "(" ? n++ : a === ")" ? n-- : a === " " && n === 0 && (i > r && t.push(e.slice(r, i)), r = i + 1);
	}
	return r < e.length && t.push(e.slice(r)), t;
}
function hl(e, t = "auto") {
	return e.map((e) => gl(e, t)).join(" ");
}
function gl(e, t) {
	switch (e.kind) {
		case "px": return `${_l(e.value)}px`;
		case "star": return `minmax(${e.min === void 0 ? "0" : `${_l(e.min)}px`}, ${_l(e.value)}fr)`;
		case "auto": return e.min === void 0 ? e.max === void 0 ? t : `fit-content(${_l(e.max)}px)` : `minmax(${_l(e.min)}px, auto)`;
	}
}
function _l(e) {
	return String(Math.round(e * 1e3) / 1e3);
}
function vl(e) {
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
function yl(e, t) {
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
function bl(e, t, n) {
	let r = 0, i = n;
	for (let n of t) n < e && n + 1 > r ? r = n + 1 : n > e && n < i && (i = n);
	let a = xl(r, e), o = xl(e + 1, i);
	return a.length === 0 || o.length === 0 ? null : {
		before: a,
		after: o
	};
}
function xl(e, t) {
	let n = [];
	for (let r = e; r < t; r++) n.push(r);
	return n;
}
var Sl = {
	sliver: 120,
	passFloors: !1
};
function Cl(e, t, n, r, i = Sl) {
	let a = El(e, t, n.before), o = El(e, t, n.after);
	if (a.total + o.total <= 0) return null;
	let s = Math.max((i.passFloors ? 0 : a.min) - a.total, o.total - o.max), c = Math.min(a.max - a.total, o.total - (i.passFloors ? 0 : o.min));
	if (s > c) return null;
	let l = (e) => i.sliver > 0 && i.passFloors ? Math.max(i.sliver, e.min) : i.sliver, u = Tl(Math.min(Math.max(r, s), c), r, a.total, o.total, s, c, l(a), l(o));
	if (u === 0) return null;
	let d = [...e], f = n.before.every((t) => e[t].kind === "star"), p = n.after.every((t) => e[t].kind === "star");
	if (f && p) {
		let t = jl(n.before, e) + jl(n.after, e), r = a.total + o.total;
		Dl(d, e, a, t * (a.total + u) / r), Dl(d, e, o, t * (o.total - u) / r);
	} else f || Ol(d, a, a.total + u), p || Ol(d, o, o.total - u);
	return i.passFloors && (wl(d, a, a.total + u), wl(d, o, o.total - u)), d;
}
function wl(e, t, n) {
	if (!(n >= t.min - .5)) for (let n of t.indices) {
		let { min: t, ...r } = e[n];
		e[n] = r;
	}
}
function Tl(e, t, n, r, i, a, o, s) {
	let c = e, l = n + c, u = r - c;
	return l > 0 && l < o ? c = t < 0 ? -n : o - n : u > 0 && u < s && (c = t > 0 ? r : r - s), Math.min(Math.max(c, i), a);
}
function El(e, t, n) {
	let r = Al(n, t), i = n.map((e) => r > 0 ? t[e] / r : 1 / n.length), a = 0, o = Infinity;
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
function Dl(e, t, n, r) {
	let i = jl(n.indices, t);
	for (let a = 0; a < n.indices.length; a++) {
		let o = n.indices[a], s = i > 0 && n.total > 0 ? n.shares[a] : 1 / n.indices.length;
		e[o] = {
			...t[o],
			value: r * s
		};
	}
}
function Ol(e, t, n) {
	for (let r = 0; r < t.indices.length; r++) {
		let i = t.indices[r];
		e[i] = {
			kind: "px",
			value: n * t.shares[r],
			...kl(e[i])
		};
	}
}
function kl(e) {
	return {
		...e.min === void 0 ? {} : { min: e.min },
		...e.max === void 0 ? {} : { max: e.max }
	};
}
function Al(e, t) {
	let n = 0;
	for (let r of e) n += t[r];
	return n;
}
function jl(e, t) {
	let n = 0;
	for (let r of e) n += t[r].value;
	return n;
}
function Ml(e, t) {
	return Math.round(Nl(e, t) * 100);
}
function Nl(e, t) {
	let n = Al(t.before, e), r = n + Al(t.after, e);
	return r <= 0 ? 0 : n / r;
}
function Pl(e, t, n) {
	let r = Al(t.before, e);
	return (r + Al(t.after, e)) * Math.min(Math.max(n, 0), 1) - r;
}
function Fl(e) {
	let t = e === null || e.length === 0 ? NaN : Number(e);
	return t >= 0 && t <= 1 ? t : null;
}
function Il(e, t) {
	let n = [];
	for (let r = 0, i = 0; r < t; r++) n.push(i), i += Number.isFinite(e[r]) ? e[r] : 0;
	return n;
}
var Ll = /* @__PURE__ */ new Set();
function Rl(e, t, n, r) {
	let i = El(e, t, n.before), a = El(e, t, n.after);
	return i.total >= 1 && i.total < r ? -i.total : a.total >= 1 && a.total < r ? a.total : i.total >= 1 && i.total < i.min - .5 ? i.min - i.total : a.total >= 1 && a.total < a.min - .5 ? a.total - a.min : 0;
}
function zl(e, t, n, r) {
	let i = /* @__PURE__ */ new Set();
	for (let a of [n.before, n.after]) {
		let n = El(e, t, a);
		n.total < Math.max(r, n.min - .5) && a.forEach((e) => i.add(e));
	}
	return i;
}
function Bl(e, t) {
	return e.map((e, n) => t.has(n) ? {
		kind: "px",
		value: 0
	} : e);
}
function Vl(e, t, n, r = Ll) {
	let i = Number(e);
	if (!Number.isInteger(i) || i < 1) return !1;
	let a = /^span\s+(\d+)$/.exec(t.trim()), o = Number(t), s = a === null ? Number.isInteger(o) && o > i ? o : i + 1 : i + Number(a[1]);
	return s - 1 <= n.length && n.slice(i - 1, s - 1).every((e, t) => e < 1 || r.has(i - 1 + t));
}
//#endregion
//#region src/extensions/value-readers.ts
function Hl(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" ? String(e) : JSON.stringify(e);
}
function Ul(e) {
	return e == null;
}
var Wl = "data-ui-trim-input", Gl = class {
	readers = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let e of Yl) this.register(e);
		for (let t of e ?? []) this.register(t);
	}
	register(e) {
		this.readers.set(e.kind, e.read);
	}
	read(e) {
		let t = e.getAttribute(Vt);
		if (t === null) return Kl(e);
		let n = this.readers.get(t);
		return n === void 0 ? (s("value reader: no reader registered for this kind.", { kind: t }), null) : n(e);
	}
	readBound(e) {
		let t = this.read(e);
		return typeof t == "string" && e.hasAttribute(Wl) ? t.trim() : t;
	}
	readHeld(e) {
		let t = Jl(e);
		return t === null ? null : this.read(t);
	}
};
function Kl(e) {
	if (e instanceof HTMLInputElement) switch (e.type) {
		case "checkbox": return e.checked;
		case "number":
		case "range": return e.value.trim().length === 0 ? null : Number(e.value);
		default: return e.value;
	}
	return e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement ? e.value : e instanceof HTMLDetailsElement ? e.open : null;
}
var ql = "input, textarea, select";
function Jl(e) {
	return e.hasAttribute("data-ui-value-kind") || e.matches(ql) ? e : e.querySelector("[data-ui-value-holder]") ?? e.querySelector(`[data-ui-value-kind], ${ql}`);
}
var Yl = [
	{
		kind: "flyout-open",
		read: (e) => e.classList.contains("ui-flyout--open")
	},
	{
		kind: "splitter-position",
		read: (e) => Fl(e.getAttribute(Yn))
	},
	{
		kind: "pane-layout",
		read: (e) => e.getAttribute(Xn)
	},
	{
		kind: "tabs-selected",
		read: (e) => e.getAttribute(di)
	},
	{
		kind: "tab-caption",
		read: (e) => e.getAttribute(fi)
	},
	{
		kind: "tab-pinned",
		read: (e) => e.hasAttribute(gi)
	},
	{
		kind: "tree-title",
		read: (e) => e.getAttribute(wr)
	},
	{
		kind: "tree-drop-target",
		read: (e) => e.getAttribute("data-ui-tree-drop-target") ?? ""
	},
	{
		kind: "selected-key",
		read: (e) => e.getAttribute(ci)
	},
	{
		kind: "selected-keys",
		read: (e) => Xl(e, li)
	},
	{
		kind: Ht,
		read: (e) => Xl(e, dt)
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
function Xl(e, t) {
	let n = e.getAttribute(t);
	return n === null ? null : JSON.parse(n);
}
function Zl(e) {
	e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio") ? e.checked = !1 : (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement) && (e.value = "");
}
//#endregion
//#region src/interactions/keyboard-shortcut.ts
function Ql(e) {
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
		default: o = mu(e);
	}
	return o === null ? null : {
		code: o,
		ctrl: n,
		shift: r,
		alt: i,
		meta: a
	};
}
function $l(e, t, n = cu()) {
	return t.code !== e.code || t.shiftKey !== e.shift || t.altKey !== e.alt ? !1 : e.ctrl && !e.meta && n ? t.ctrlKey !== t.metaKey : t.ctrlKey === e.ctrl && t.metaKey === e.meta;
}
function eu(e, t = cu()) {
	let n = iu(e.code, t);
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
function tu(e, t = cu()) {
	let n = nu(e.code), r = (t, r) => [
		t ? "Control" : "",
		e.alt ? "Alt" : "",
		e.shift ? "Shift" : "",
		r ? "Meta" : "",
		n
	].filter((e) => e.length > 0).join("+");
	return e.ctrl && !e.meta && t ? `${r(!0, !1)} ${r(!1, !0)}` : r(e.ctrl, e.meta);
}
function nu(e) {
	return /^Key[A-Z]$/.test(e) ? e.slice(3) : /^Digit[0-9]$/.test(e) ? e.slice(5) : ru[e] ?? e;
}
var ru = {
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
function iu(e, t) {
	return /^Key[A-Z]$/.test(e) ? e.slice(3) : /^Digit[0-9]$/.test(e) ? e.slice(5) : (t ? ou[e] : void 0) ?? au[e] ?? e;
}
var au = {
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
}, ou = {
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
}, su = null;
function cu() {
	return su === null && (su = lu()), su;
}
function lu() {
	if (typeof navigator > "u") return !1;
	let e = navigator.userAgentData?.platform;
	return /mac/i.test(e ?? navigator.platform ?? "");
}
var uu = {
	words(e) {
		let t = Ql(e);
		return t === null ? null : eu(t);
	},
	aria(e) {
		let t = Ql(e);
		return t === null ? null : tu(t);
	},
	matches(e, t) {
		let n = Ql(t);
		return n !== null && $l(n, e);
	},
	isComposing: N
}, du = 229;
function N(e) {
	return e.isComposing || e.keyCode === du;
}
function P(e, t = {}) {
	return !e.ctrlKey && !e.metaKey && (t.alt === !0 || !e.altKey) && (t.shift === !0 || !e.shiftKey) && !N(e);
}
var fu = class {
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
function pu(e) {
	return [
		e.ctrl ? "ctrl" : "",
		e.shift ? "shift" : "",
		e.alt ? "alt" : "",
		e.meta ? "meta" : "",
		e.code
	].filter((e) => e.length > 0).join("+");
}
function mu(e) {
	if (e.length === 1) {
		let t = e.toUpperCase();
		return t >= "A" && t <= "Z" ? `Key${t}` : t >= "0" && t <= "9" ? `Digit${t}` : hu[t] ?? null;
	}
	let t = e.length === 0 ? "" : e[0].toUpperCase() + e.slice(1).toLowerCase();
	return /^F([1-9]|1[0-9]|2[0-4])$/.test(t.toUpperCase()) ? t.toUpperCase() : hu[t] ?? null;
}
var hu = {
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
}, gu = "data-ui-rename-field";
function _u(e) {
	return e instanceof Element && e.closest(`[${gu}]`) !== null;
}
function vu(e) {
	let { container: t, title: n } = e;
	if (t.querySelector(`.${e.className}`) !== null) return !1;
	let r = document.createElement("input");
	r.type = "text", r.className = e.className, r.setAttribute(gu, ""), r.setAttribute(Qe, ""), r.value = e.value, xu(r, n, t);
	let i = !1, a = null, o = (t, o) => {
		if (i) return;
		i = !0, a?.();
		let s = r.value.trim();
		r.remove(), n.style.visibility = "", t && (s.length > 0 || e.allowEmpty === !0) && s !== e.value && e.commit(s), e.done?.(), o && e.refocus?.();
	};
	return r.addEventListener("keydown", (e) => {
		if (!N(e)) {
			if (e.key === "Enter") o(!0, !0);
			else if (e.key === "Escape") o(!1, !0);
			else return;
			e.preventDefault(), e.stopPropagation();
		}
	}), r.addEventListener("blur", () => o(!0, !1)), n.style.visibility = "hidden", t.appendChild(r), t.getClientRects().length > 0 ? yu(r) : a = bu(t, () => {
		xu(r, n, t), yu(r);
	}), !0;
}
function yu(e) {
	e.focus(), e.setSelectionRange(0, e.value.length, "backward"), e.scrollLeft = 0;
}
function bu(e, t) {
	let n = new ResizeObserver(() => {
		e.getClientRects().length !== 0 && (n.disconnect(), t());
	});
	return n.observe(e), () => n.disconnect();
}
function xu(e, t, n) {
	let r = t.getBoundingClientRect(), i = n.getBoundingClientRect(), a = getComputedStyle(t), o = Su(n), s = o > 0 && i.width > 0 ? i.width / o : 1;
	e.style.left = Cu((r.left - i.left) / s - n.clientLeft), e.style.top = Cu((r.top - i.top) / s - n.clientTop), e.style.width = Cu(r.width / s), e.style.height = Cu(r.height / s), e.style.fontFamily = a.fontFamily, e.style.fontSize = a.fontSize, e.style.fontWeight = a.fontWeight, e.style.fontStyle = a.fontStyle, e.style.lineHeight = a.lineHeight, e.style.letterSpacing = a.letterSpacing, e.style.textAlign = a.textAlign;
}
function Su(e) {
	let t = getComputedStyle(e), n = parseFloat(t.width);
	return Number.isFinite(n) ? t.boxSizing === "border-box" ? n : n + parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth) : e.offsetWidth;
}
function Cu(e) {
	return `${Math.round(e * 64) / 64}px`;
}
//#endregion
//#region src/interactions/field-escape.ts
var wu = "data-ui-runs-on-escape", Tu = "ui-key-value-action__row", Eu = "ui-key-value-action__value-input", Du = "ui-key-value-action__edit-action";
function Ou(e) {
	return N(e) || ku(e.target) !== null;
}
function ku(e) {
	return e instanceof Element ? _u(e) || Au(e) ? e : e.closest("[data-ui-owns-keys]") ?? ju(e)?.cell ?? null : null;
}
function Au(e) {
	return e instanceof Element && e.hasAttribute(wu) && (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && !e.readOnly && !A(e);
}
function ju(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${Eu}, .${Du}`), n = t?.closest(".ui-key-value-action__row") ?? null;
	return t === null || n === null || !n.hasAttribute("data-ui-row-editing") ? null : {
		cell: t,
		row: n
	};
}
//#endregion
//#region src/interactions/caret-fields.ts
var Mu = /* @__PURE__ */ new Set([
	"text",
	"search",
	"number",
	"password",
	"email",
	"url",
	"tel"
]), Nu = /* @__PURE__ */ new Set([
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
]), Pu = /* @__PURE__ */ new Set([
	"KeyA",
	"KeyC",
	"KeyV",
	"KeyX",
	"KeyZ",
	"KeyY",
	"Insert"
]), Fu = /^F\d{1,2}$/;
function Iu(e) {
	return e instanceof HTMLInputElement && Mu.has(e.type);
}
function Lu(e) {
	return Iu(e) || e instanceof HTMLTextAreaElement;
}
function Ru(e) {
	return Lu(e) || e instanceof HTMLElement && e.isContentEditable;
}
function zu(e) {
	let t = e.target;
	if (!Ru(t)) return !1;
	if (N(e)) return !0;
	let n = e.key;
	return n === "Tab" || n === "Escape" || Fu.test(n) || e.altKey ? !1 : n === "Enter" ? !Iu(t) : e.ctrlKey || e.metaKey ? Nu.has(n) || Pu.has(e.code) : !0;
}
var Bu = {
	...uu,
	isFieldKey: zu,
	isPlainKey: P,
	isEscapeClaimed: Ou
}, Vu = "ui-draft-dropped";
function Hu(e) {
	e.dispatchEvent(new Event(Vu, { bubbles: !0 }));
}
//#endregion
//#region src/interactions/own-control.ts
var Uu = `.ui-text-input__row, .ui-number-input__row, .ui-temporal-input__row, .ui-file-input__row, .ui-color-input__row, .${Ai}, .ui-field-box`, Wu = "button, a, input, select, textarea, label, summary, [role='button'], [contenteditable=''], [contenteditable='true']", Gu = `${Wu}, ${Uu}, ${ki}, .${_e}`, Ku = "button, a, summary, [role='button']";
function qu(e) {
	let t = [];
	for (let n of e.querySelectorAll(Gu)) if (!(n.classList.contains("ui-row__grip") || !Xu(e, n) || Yu(e, n) || t.some((e) => e.contains(n))) && (t.push(n), t.length > 1)) return null;
	let n = t[0];
	return n instanceof HTMLElement && n.matches(Ku) ? n : null;
}
function Ju(e) {
	let t = [];
	for (let n of e.querySelectorAll(Wu)) Yu(e, n) && Xu(e, n) && t.push(n);
	return t;
}
function Yu(e, t) {
	let n = t.closest(`[${de}]`);
	return n !== null && n !== e && e.contains(n);
}
function Xu(e, t) {
	let n = t.closest(ki);
	return (n === null || !e.contains(n)) && t.closest(".ui-action-bar") === null;
}
function Zu(e, t) {
	if (!(e instanceof Element)) return null;
	let n = e.closest(Gu);
	return n !== null && n !== t && t.contains(n) ? n : null;
}
//#endregion
//#region src/interactions/roving-focus.ts
function Qu(e) {
	let t = nd(e.key), n = rd(e.key, e.axis);
	if (t === null && n === 0) return null;
	let r = e.items.filter(I);
	if (r.length === 0) return null;
	if (t !== null) return t === "first" ? r[0] : r[r.length - 1];
	let i = e.current === null ? -1 : r.indexOf(e.current);
	if (i === -1) return n > 0 ? r[0] : r[r.length - 1];
	let a = i + n;
	return a >= 0 && a < r.length ? r[a] : e.loop ?? !0 ? r[(a + r.length) % r.length] : null;
}
function $u(e, t) {
	return nd(e) !== null || rd(e, t) !== 0;
}
var ed = {
	target: Qu,
	applyTabIndex: F
};
function F(e, t) {
	for (let n of e) n.tabIndex = n === t ? 0 : -1;
}
function td(e, t) {
	t !== null && (F(e, t), t.focus());
}
function I(e) {
	return e.getClientRects().length > 0 && !A(e);
}
function nd(e) {
	return e === "Home" ? "first" : e === "End" ? "last" : null;
}
function rd(e, t) {
	return t !== "horizontal" && (e === "ArrowDown" || e === "ArrowUp") ? e === "ArrowDown" ? 1 : -1 : t !== "vertical" && (e === "ArrowRight" || e === "ArrowLeft") ? e === "ArrowRight" ? 1 : -1 : 0;
}
//#endregion
//#region src/items/items-viewport.ts
function id(e) {
	return e.hasAttribute("data-ui-host-viewport") ? e.parentElement ?? e : e;
}
function ad(e) {
	return e instanceof Element ? e.hasAttribute("data-ui-items-host") ? e : e.querySelector(`:scope > [${x}][${Kt}]`) : null;
}
function od(e) {
	let t = id(e);
	return t === e ? {
		top: e.scrollTop,
		height: e.clientHeight,
		contentHeight: e.scrollHeight
	} : {
		top: t.scrollTop - cd(e, t),
		height: t.clientHeight,
		contentHeight: e.scrollHeight
	};
}
function sd(e, t) {
	let n = id(e);
	n.scrollTop = n === e ? t : t + cd(e, n);
}
function cd(e, t) {
	return e.getBoundingClientRect().top - t.getBoundingClientRect().top - t.clientTop + t.scrollTop;
}
function ld(e) {
	let t = e.getBoundingClientRect();
	return t.height > 0 || e.firstElementChild === null ? t : e.firstElementChild.getBoundingClientRect();
}
//#endregion
//#region src/interactions/multi-select-keys.ts
function ud(e) {
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
function dd(e) {
	if (e === null) return null;
	let t = Number(e);
	return Number.isInteger(t) && t > 0 ? t : null;
}
function fd(e, t) {
	return t !== null && e.length >= t;
}
function pd(e, t, n) {
	return e.includes(t) ? e.filter((e) => e !== t) : fd(e, n) ? null : [...e, t];
}
function md(e, t) {
	return e.includes(t) ? e.filter((e) => e !== t) : null;
}
var hd = /[,\uFF0C\r\n]/;
function gd(e) {
	return hd.test(e);
}
function _d(e) {
	return e.split(hd).map((e) => e.trim()).filter((e) => e.length > 0);
}
function vd(e) {
	let t = e.split(hd), n = t.pop() ?? "";
	return {
		tags: t.map((e) => e.trim()).filter((e) => e.length > 0),
		rest: n
	};
}
function yd(e, t, n, r, i) {
	let a = [...e], o = [], s = null;
	for (let e of t) {
		if (a.includes(e.key)) continue;
		let t = [...a, e.key], c = fd(a, n) ? r : i(a, t);
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
function bd(e, t, n) {
	let r = [];
	for (let i of e.querySelectorAll(t)) i.closest(n) === e && r.push(i);
	return r;
}
function xd(e) {
	return bd(e, Hn, `.${S}`);
}
//#endregion
//#region src/interactions/selected-key.ts
function Sd(e, t, n) {
	t.length !== 0 && e.getAttribute(n.attribute) !== t && (e.setAttribute(n.attribute, t), n.apply(e), e.hasAttribute(n.bindingAttribute) && e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function Cd(e, t, n) {
	return e.length === 0 ? null : e.some((e) => n(e) === t) ? t : n(e[0]);
}
//#endregion
//#region src/interactions/row-selection.ts
var wd = "data-ui-bind-selected-keys", L = `.ui-items-view, .ui-table, .${cr}`, Td = `.ui-items-view__item, .${ir}, .${lr}`, Ed = ".ui-items-view, .ui-table", Dd = {
	shift: !1,
	ctrl: !1
}, Od = /* @__PURE__ */ new WeakMap();
function kd(e, t) {
	t !== null && !Od.has(e) && Ad(e, t);
}
function Ad(e, t) {
	let n = z(t);
	n.length > 0 && Od.set(e, n);
}
function jd(e) {
	return {
		shift: e.shiftKey,
		ctrl: e.ctrlKey || e.metaKey
	};
}
function Md(e, t) {
	let n = jd(t);
	return n.shift && e.hasAttribute("data-ui-no-row-select") ? {
		shift: !0,
		ctrl: !0
	} : n;
}
function Nd(e) {
	return !e.hasAttribute(yr);
}
function R(e) {
	if (e.getClientRects().length > 0) return e;
	let t = e.querySelector(`:scope > [${y}]`);
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function Pd(e) {
	switch (e.getAttribute(oi)) {
		case "one": {
			let t = e.getAttribute(ci);
			return new Set(t === null || t.length === 0 ? [] : [t]);
		}
		case "many": return new Set(Ud(Wd(e)));
		default: return /* @__PURE__ */ new Set();
	}
}
function Fd(e, t) {
	let n = Pd(e), r = e.getAttribute(oi), i = r === "one" || r === "many";
	for (let e of t) {
		let t = n.has(z(e));
		e.toggleAttribute(si, t);
		let r = i ? t ? "true" : "false" : null;
		e.getAttribute("aria-selected") !== r && (r === null ? e.removeAttribute("aria-selected") : e.setAttribute("aria-selected", r));
	}
}
function Id(e) {
	return e.filter((e) => e.hasAttribute(si));
}
function Ld(e, t, n, r, i) {
	let a = z(n);
	if (!Bd(n)) return !1;
	switch (e.getAttribute(oi)) {
		case "one": return Sd(e, a, {
			attribute: ci,
			bindingAttribute: ui,
			apply: (e) => Fd(e, t)
		}), !0;
		case "many": return Rd(e, t, n, a, r, i), !0;
		default: return !1;
	}
}
function Rd(e, t, n, r, i, a) {
	let o = Wd(e);
	if (o === null) return;
	let s = Ud(o), c;
	if (i.shift) {
		let o = Od.get(e), l = o === void 0 ? null : a?.(o, r) ?? null, u = t.find((e) => z(e) === o) ?? n, d = l === null ? Hd(t, u, n).map(z) : Vd(l, t);
		c = i.ctrl ? [...s.filter((e) => !d.includes(e)), ...d] : d;
	} else i.ctrl ? (c = s.includes(r) ? s.filter((e) => e !== r) : [...s, r], Od.set(e, r)) : (c = [r], Od.set(e, r));
	zd(e, t, c);
}
function zd(e, t, n) {
	let r = Wd(e);
	if (r === null) return;
	let i = JSON.stringify(n);
	r.getAttribute("data-ui-selected-keys") !== i && (r.setAttribute(li, i), Fd(e, t), r.hasAttribute(wd) && r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function Bd(e) {
	return z(e).length > 0 && !al(e, "data-ui-unselectable") && !j(e);
}
function Vd(e, t) {
	let n = new Map(t.map((e) => [z(e), e]));
	return e.filter((e) => {
		let t = n.get(e);
		return t === void 0 || R(t) !== null && Bd(t);
	});
}
function Hd(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	return r < 0 || i < 0 ? [n] : e.slice(Math.min(r, i), Math.max(r, i) + 1).filter((e) => R(e) !== null && Bd(e));
}
function Ud(e) {
	return ud(e?.getAttribute("data-ui-selected-keys") ?? null);
}
function Wd(e) {
	let t = e.closest(w);
	for (let n of e.querySelectorAll(`[${x}]`)) if (n.closest(L) === e && n.closest("[data-ui-id]") === t) return n;
	return null;
}
function z(e) {
	return e.getAttribute("data-ui-key") ?? "";
}
var Gd = {
	isSelected: (e) => e.hasAttribute(si),
	toggle: Kd,
	setSelected: qd,
	setSelectedKeys: Jd
};
function Kd(e) {
	let t = e.closest(L);
	t !== null && e instanceof HTMLElement && Ld(t, Yd(t), e, {
		shift: !1,
		ctrl: !0
	});
}
function qd(e, t, n) {
	let r = [];
	for (let e of t) e.classList.contains("ui-hidden") || r.push(z(e));
	Jd(e, r, n);
}
function Jd(e, t, n) {
	if (!(e instanceof HTMLElement)) return;
	let r = Yd(e), i = new Set(r.filter((e) => !Bd(e)).map(z)), a = /* @__PURE__ */ new Set();
	for (let e of t) e.length > 0 && !i.has(e) && a.add(e);
	let o = [...Pd(e)].filter((e) => !a.has(e));
	zd(e, r, n ? [...o, ...a] : o);
}
function Yd(e) {
	return bd(e, Td, L);
}
//#endregion
//#region src/interactions/table-column-layout.ts
var Xd = "--ui-table-order-";
function Zd(e) {
	let t = new Set((e.getAttribute("data-ui-table-hidden") ?? "").split(" ").filter((e) => e.length > 0)), n = e instanceof HTMLElement ? e.style : null;
	return {
		place: (e) => {
			let t = n?.getPropertyValue(`--ui-table-order-${e}`).trim() ?? "";
			return t.length === 0 ? e : Number(t);
		},
		isHidden: (e) => t.has(String(e))
	};
}
var Qd = "ui-table", $d = `[${er}]:not(.${sr})`, ef = `.${ir} > [aria-colspan]:not([${er}])`;
function tf(e, t, n, r) {
	let i = /* @__PURE__ */ new Map();
	for (let e of t) n.has(e) || i.set(e, String(i.size + 1));
	let a = String(i.size), o = r ? ":not([aria-colindex])" : "";
	T(e, "aria-colcount", a);
	for (let t of e.querySelectorAll(`${$d}${o}, ${ef}${o}`)) {
		if (t.closest(`.${Qd}`) !== e) continue;
		if (!t.hasAttribute("data-ui-table-column")) {
			T(t, "aria-colindex", "1"), T(t, "aria-colspan", a);
			continue;
		}
		let n = i.get(Number(t.getAttribute(er)));
		n === void 0 ? t.removeAttribute("aria-colindex") : T(t, "aria-colindex", n);
	}
}
//#endregion
//#region src/interactions/row-cursor.ts
var nf = ".ui-table[role='grid']", rf = "gridcell", af = "aria-colspan", of = /* @__PURE__ */ new WeakMap();
function sf(e) {
	let t = e.closest(L);
	if (t === null) return null;
	if (e === t) return {
		root: t,
		row: null
	};
	let n = e.closest(Td);
	return n !== null && n.closest(L) === t ? {
		root: t,
		row: n
	} : null;
}
function cf(e) {
	return e.target instanceof Element && !zu(e) ? lf(e.target) : null;
}
function lf(e) {
	let t = sf(e);
	if (t === null || t.row !== null && Zu(e, t.row) !== null) return null;
	let n = e.closest(`[${Oi}]`);
	return n !== null && n !== t.root && t.root.contains(n) ? null : t;
}
function uf(e) {
	return e.filter(df);
}
function df(e) {
	return R(e) !== null && !j(e);
}
function ff(e) {
	return pf(e) ?? uf(e)[0] ?? null;
}
function pf(e) {
	return e.find((e) => e.hasAttribute("data-ui-row-focus")) ?? e.find((e) => e.hasAttribute("data-ui-selected") && !j(e)) ?? null;
}
function mf(e) {
	return pf(Yd(e));
}
function hf(e, t) {
	if (e.hasAttribute("data-ui-row-cursor-waits") || t.some((e) => e.hasAttribute("data-ui-row-focus"))) return;
	let n = ff(t);
	n !== null && _f(e, t, n);
}
function gf(e, t) {
	t === null ? e.removeAttribute("aria-labelledby") : e.setAttribute("aria-labelledby", Qi(t, "ui-row-name"));
}
function _f(e, t, n, r = null, i = !0) {
	for (let e of t) e !== n && e.hasAttribute("data-ui-row-focus") && e.removeAttribute(Ne);
	n.hasAttribute("data-ui-row-focus") || n.setAttribute(Ne, ""), e.removeAttribute(Pe);
	let a = vf(e, n, r);
	i && ((R(n) ?? n).scrollIntoView({ block: "nearest" }), a !== null && wf(e, n, a));
}
function vf(e, t, n) {
	let r = yf(e) ? bf(e, t, n) : null;
	for (let t of e.querySelectorAll(`[${Ie}]`)) t !== r && t.closest(L) === e && t.removeAttribute(Ie);
	if (r === null) return e.setAttribute("aria-activedescendant", Qi(t, "ui-row")), null;
	r.hasAttribute("data-ui-cell-focus") || r.setAttribute(Ie, "");
	let i = r.getAttribute(er);
	return i !== null && of.set(e, i), e.setAttribute("aria-activedescendant", Qi(r, "ui-cell")), r;
}
function yf(e) {
	return e.matches(nf);
}
function bf(e, t, n) {
	if (n instanceof HTMLElement && n.parentElement === t && n.getAttribute("role") === rf) {
		if (!n.hasAttribute("data-ui-owns-keys")) return n;
		let e = xf(t, n.getAttribute(er));
		if (e !== null) return e;
	}
	let r = Sf(e, t), i = of.get(e);
	if (i === void 0) return r[0] ?? null;
	let a = r.find((e) => e.getAttribute(er) === i);
	if (a !== void 0) return a;
	let o = Zd(e), s = o.place(Number(i)), c = (e) => Math.abs(o.place(Number(e.getAttribute(er))) - s);
	return r.reduce((e, t) => e === null || c(t) < c(e) ? t : e, null);
}
function xf(e, t) {
	for (let n of e.children) if (t !== null && n instanceof HTMLElement && n.getAttribute("data-ui-table-column") === t && Cf(n)) return n;
	return null;
}
function Sf(e, t) {
	let n = Zd(e), r = [];
	for (let e of t.children) {
		let t = Number(e.getAttribute("data-ui-table-column") ?? NaN);
		e instanceof HTMLElement && Number.isInteger(t) && Cf(e) && !n.isHidden(t) && r.push({
			cell: e,
			place: n.place(t)
		});
	}
	return r.sort((e, t) => e.place - t.place).map((e) => e.cell);
}
function Cf(e) {
	return e.getAttribute("role") === rf && !e.hasAttribute("data-ui-owns-keys");
}
function wf(e, t, n) {
	let r = e.querySelector(`:scope > .${ar}`);
	if (r === null || !(r.scrollWidth > r.clientWidth) || !n.hasAttribute("data-ui-table-column")) return;
	let i = r.getBoundingClientRect(), a = i.left + i.width / 2, o = i.left + r.clientLeft, s = o + r.clientWidth;
	for (let e of t.children) {
		if (e === n || !(e instanceof HTMLElement) || getComputedStyle(e).position !== "sticky") continue;
		let t = e.getBoundingClientRect();
		t.left + t.width / 2 < a ? o = Math.max(o, t.right) : s = Math.min(s, t.left);
	}
	let c = n.getBoundingClientRect();
	r.scrollLeft += Tf(c.left, c.right, o, s);
}
function Tf(e, t, n, r) {
	return e < n ? e - n : t > r ? Math.min(t - r, e - n) : 0;
}
function Ef(e) {
	for (let t of e.children) if (t instanceof HTMLElement && t.hasAttribute("data-ui-cell-focus")) return t;
	return null;
}
function Df(e) {
	return of.get(e) ?? null;
}
function Of(e, t, n, r) {
	if (n !== null && jf(n)) return null;
	let i = Sf(e, t), a = n?.getAttribute("data-ui-table-column") ?? null, o = i.findIndex((e) => e.getAttribute(er) === a);
	switch (r) {
		case "Home": return i[0] ?? null;
		case "End": return i[i.length - 1] ?? null;
		case "ArrowLeft": return o > 0 ? i[o - 1] : null;
		case "ArrowRight": return o < 0 ? i[0] ?? null : i[o + 1] ?? null;
		default: return null;
	}
}
function kf(e, t, n, r) {
	let i = Af(t), a = (n === null ? -1 : i.indexOf(n)) + (r ? 1 : -1);
	return i.length === 0 || a < -1 || a >= i.length ? null : a === -1 ? bf(e, t, null) : i[a];
}
function Af(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && jf(e));
}
function jf(e) {
	return Cf(e) && e.hasAttribute(af) && !e.hasAttribute("data-ui-table-column");
}
function Mf(e) {
	let t = Af(e);
	return t[t.length - 1] ?? null;
}
function Nf(e, t) {
	let n = t;
	for (; n !== null && n.parentElement !== e;) n = n.parentElement;
	return n?.getAttribute("role") === rf ? n : null;
}
function Pf(e, t = null) {
	let n = e.closest(L);
	n !== null && e instanceof HTMLElement && _f(n, Yd(n), e, t);
}
function Ff(e, t) {
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
function If(e, t) {
	return $u(e, t === "grid" ? "both" : t) || t !== "horizontal" && Lf(e);
}
function Lf(e) {
	return e === "PageDown" || e === "PageUp";
}
function Rf(e, t, n, r) {
	if (!If(e, r)) return null;
	let i = uf(t);
	if (Lf(e)) return zf(i, n, e === "PageDown");
	if (r === "grid" && (e === "ArrowUp" || e === "ArrowDown")) return Bf(i, n, e === "ArrowDown");
	let a = i.map((e) => R(e) ?? e), o = Qu({
		key: e,
		items: a,
		current: n === null ? null : R(n),
		axis: r === "grid" ? "horizontal" : r,
		loop: !1
	});
	return o === null ? null : i[a.indexOf(o)] ?? null;
}
function zf(e, t, n) {
	let r = t === null ? -1 : e.indexOf(t), i = r < 0 ? null : e[r].parentElement;
	if (i === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let a = (R(e[r]) ?? e[r]).getBoundingClientRect(), o = Math.min(od(i).height, window.innerHeight), s = n ? 1 : -1, c = null;
	for (let t = r + s; t >= 0 && t < e.length; t += s) {
		let r = (R(e[t]) ?? e[t]).getBoundingClientRect();
		if (c !== null && (n ? r.bottom > a.top + o + .5 : r.top < a.bottom - o - .5)) break;
		c = e[t];
	}
	return c;
}
function Bf(e, t, n) {
	let r = t === null ? null : R(t);
	if (r === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let i = r.getBoundingClientRect(), a = Vf(i), o = e.map((e) => ({
		row: e,
		rect: (R(e) ?? e).getBoundingClientRect()
	})).filter(({ rect: e }) => n ? e.top >= i.bottom - .5 : e.bottom <= i.top + .5);
	if (o.length === 0) return null;
	let s = o.reduce((e, t) => (n ? t.rect.top < e.rect.top : t.rect.bottom > e.rect.bottom) ? t : e);
	return o.filter(({ rect: e }) => n ? e.top < s.rect.bottom - .5 : e.bottom > s.rect.top + .5).reduce((e, t) => Math.abs(Vf(t.rect) - a) < Math.abs(Vf(e.rect) - a) ? t : e).row;
}
function Vf(e) {
	return e.left + e.width / 2;
}
var Hf = "ui-row-press";
function Uf(e, t, n) {
	(e.hasAttribute("data-ui-id") ? e : e.querySelector(":scope > [data-ui-id]") ?? e).dispatchEvent(n === void 0 ? new Event(t, { bubbles: !0 }) : new CustomEvent(t, {
		bubbles: !0,
		detail: n
	}));
}
function Wf(e, t, n) {
	let r = null, i = !1;
	for (let e of n) e instanceof HTMLElement && e.hasAttribute("data-ui-row-focus") && (r = e), i ||= e.contains(document.activeElement);
	if (r === null && !i) return null;
	let a = [], o = -1;
	if (r !== null) for (let e of t) e === r && (o = a.length), e instanceof HTMLElement && !n.has(e) && a.push(e);
	let s = r !== null && Gf(r);
	return () => {
		i && e.focus({ preventScroll: !0 });
		let t = Kf(a, o);
		t === null ? r !== null && e.removeAttribute("aria-activedescendant") : _f(e, a, t, null, s);
	};
}
function Gf(e) {
	let t = R(e), n = e.parentElement;
	if (t === null || n === null) return !1;
	let r = t.getBoundingClientRect(), i = id(n).getBoundingClientRect();
	return r.bottom > Math.max(i.top, 0) && r.top < Math.min(i.bottom, window.innerHeight) && r.right > Math.max(i.left, 0) && r.left < Math.min(i.right, window.innerWidth);
}
function Kf(e, t) {
	if (t < 0) return null;
	for (let n = t; n < e.length; n++) if (df(e[n])) return e[n];
	for (let n = Math.min(t, e.length) - 1; n >= 0; n--) if (df(e[n])) return e[n];
	return null;
}
function qf(e, t) {
	let n = t.find((e) => e.hasAttribute(Ne));
	if (n === void 0 || R(n) !== null) return;
	let r = Kf(t, t.indexOf(n));
	r === null ? (n.removeAttribute(Ne), Ef(n)?.removeAttribute(Ie), e.removeAttribute("aria-activedescendant")) : _f(e, t, r, null, !1);
}
function Jf(e) {
	let t = e.parentElement, n = t?.closest(L) ?? null;
	return n !== null && (n === t || n === t?.parentElement) ? n : t;
}
function Yf(e) {
	let t = e.hasAttribute(Ne), n = e.contains(document.activeElement);
	return t || n ? {
		cursor: t,
		focus: n,
		key: e.getAttribute(b)
	} : null;
}
function Xf(e, t, n) {
	let r = Jf(e);
	n !== null && r !== null && (n.focus && !r.contains(document.activeElement) && r.focus({ preventScroll: !0 }), n.cursor && (t === null ? (typeof n.key == "string" && r.setAttribute(Pe, n.key), r.removeAttribute("aria-activedescendant")) : [...e.children].some((e) => e !== t && e.hasAttribute("data-ui-row-focus")) || $f(r, t)));
}
function Zf(e, t) {
	let n = Jf(e), r = n?.getAttribute("data-ui-row-cursor-waits") ?? null;
	n !== null && r !== null && r === t.getAttribute("data-ui-key") && (n.removeAttribute(Pe), [...e.children].some((e) => e !== t && e.hasAttribute("data-ui-row-focus")) || $f(n, t));
}
function Qf(e) {
	return e.getAttribute(Pe);
}
function $f(e, t) {
	t.setAttribute(Ne, ""), vf(e, t, null);
}
//#endregion
//#region src/interactions/popup-focus.ts
var ep = "data-ui-active", tp = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(","), np = /* @__PURE__ */ new Set([
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
]), rp = /* @__PURE__ */ new Set([
	"ArrowDown",
	"ArrowUp",
	"PageDown",
	"PageUp"
]), ip = !1, ap = !1, op = null, sp = /* @__PURE__ */ new Set(), cp = [], lp = /* @__PURE__ */ new WeakSet();
typeof window < "u" && (window.addEventListener("pointerdown", (e) => up(e.target, e.pointerType), !0), window.addEventListener("keydown", (e) => dp(e), !0), window.addEventListener("focus", (e) => mp(e.target), !0), window.addEventListener("focusin", (e) => mp(e.target), !0), window.addEventListener("focusout", (e) => hp(e), !0), window.addEventListener("keydown", (e) => pp(e)));
function up(e, t = "") {
	ip = !0, ap = t === "touch";
	let n = document.activeElement;
	op = n, n instanceof Element && n !== document.body && e instanceof Node && n.contains(e) && bp(n, !gp(n)), xp(n);
}
function dp(e) {
	if (!(e instanceof KeyboardEvent && (np.has(e.key) || ip && fp(e)))) {
		ip = !1;
		for (let e of [...sp]) bp(e, !1);
		xp(document.activeElement);
	}
}
function fp(e) {
	return !gp(e.target) || e.key === "Tab" || e.altKey || e.ctrlKey || e.metaKey ? !1 : !(rp.has(e.key) && e.target instanceof Element && e.target.getAttribute("role") === "combobox");
}
function pp(e) {
	if (!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || !P(e)) return;
	let t = document.activeElement;
	t instanceof Element && t !== document.body && !gp(t) && bp(t, !0);
}
function mp(e) {
	ip && !gp(e) && bp(e, !0), e === document.activeElement && xp(document.activeElement);
}
function hp(e) {
	e.target instanceof Element && e.target.hasAttribute(ep) || bp(e.target, !1), e.relatedTarget === null && queueMicrotask(() => xp(document.activeElement));
}
function gp(e) {
	return Lu(e) ? !e.readOnly && !e.disabled : e instanceof HTMLElement && (e.isContentEditable || e.getAttribute("role") === "spinbutton" && e.getAttribute("aria-readonly") !== "true");
}
function _p() {
	return ip && op instanceof HTMLElement && op !== document.body ? op : null;
}
function vp() {
	return ip;
}
function yp() {
	return ip && ap;
}
function bp(e, t) {
	if (e instanceof Element) {
		if (t) {
			for (let e of sp) e.isConnected || sp.delete(e);
			sp.add(e);
		} else sp.delete(e);
		e.hasAttribute("data-ui-pointer-focus") !== t && e.toggleAttribute(ni, t), e === document.activeElement && xp(e);
	}
}
function xp(e) {
	let t = e === null || e === document.body || gp(e) ? null : e.hasAttribute("data-ui-pointer-focus") ? "pointer" : "keyboard", n = e === null || t === null ? [] : Sp(e);
	for (let e of cp) n.includes(e) || e.removeAttribute(ri);
	for (let e of n) t !== null && e.getAttribute("data-ui-focus-within") !== t && e.setAttribute(ri, t);
	cp = n;
}
function Sp(e) {
	let t = [];
	for (let n = e.parentElement; n !== null && n !== document.body && !n.hasAttribute("data-ui-region") && (t.push(n), !n.hasAttribute("data-ui-id") || Cp(n)); n = n.parentElement);
	return t;
}
function Cp(e) {
	return e.classList.contains("ui-menu--nested") || (e.parentElement?.closest(Uu) ?? null) !== null;
}
function B(e) {
	mp(e), wp(e);
}
function wp(e) {
	xp(e), e.focus({ preventScroll: !0 }), xp(document.activeElement);
}
function Tp(e) {
	bp(e, !0), wp(e);
}
function Ep(e) {
	for (let t of e.querySelectorAll(tp)) if (ol(t)) return t;
	return null;
}
var Dp = {
	first: Ep,
	stops: (e) => Op(e, document.activeElement),
	giveBack: (e) => Ip(e),
	trapTab: jp
};
function Op(e, t) {
	let n = [...e.querySelectorAll(tp)].filter((e) => e === t || e.tabIndex >= 0 && ol(e)), r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let t = kp(e);
		if (t === null) continue;
		let n = r.get(t);
		(n === void 0 || !Ap(n) && Ap(e)) && r.set(t, e);
	}
	return n.filter((e) => {
		let t = kp(e);
		return t === null || r.get(t) === e;
	});
}
function kp(e) {
	return e instanceof HTMLInputElement && e.type === "radio" && e.name !== "" ? e.name : null;
}
function Ap(e) {
	return e instanceof HTMLInputElement && e.checked;
}
function jp(e, t) {
	let n = Op(e, document.activeElement);
	if (n.length === 0) {
		t.preventDefault();
		return;
	}
	let r = Mp(e, n, document.activeElement, t.shiftKey);
	r !== null && (t.preventDefault(), r.focus());
}
function Mp(e, t, n, r) {
	let i = t[0], a = t[t.length - 1];
	return n === null || !e.contains(n) ? r ? a : i : !r && Np(n, a) ? i : r && Np(n, i) ? a : null;
}
function Np(e, t) {
	return e === t || kp(e) !== null && kp(e) === kp(t);
}
var Pp = `.${wi}, .${Ti}, [${Di}]`;
function Fp(e) {
	let t = sf(e)?.root ?? null;
	for (let n = e.parentElement; n !== null; n = n.parentElement) if ((n === t || n.matches(Pp)) && n.hasAttribute("tabindex") && ol(n)) return n;
	return null;
}
function Ip(e, t = Fp(e)) {
	let n = document.activeElement;
	if (t?.isConnected !== !0 || n !== null && n !== document.body) return;
	let r = sf(e);
	r?.root === t && r.row !== null && _f(t, Yd(t), r.row, Nf(r.row, e)), B(t);
}
function Lp(e, t) {
	if (e.contains(document.activeElement)) return null;
	let n = document.activeElement instanceof HTMLElement ? document.activeElement : null, r = t ?? Ep(e);
	return Rp(e), (r === null || r === e) && !e.hasAttribute("tabindex") && (e.tabIndex = -1), B(r ?? e), n;
}
function Rp(e) {
	ip ? lp.add(e) : lp.delete(e);
}
function zp(e, t) {
	e.scrollTop = 0, e.scrollLeft = 0;
	let n = t ?? Ep(e);
	return n !== null && Bp(e, n), Lp(e, n);
}
function Bp(e, t) {
	let n = e.getBoundingClientRect().top + e.clientTop, r = n + e.clientHeight, i = t.getBoundingClientRect();
	i.bottom > r && (e.scrollTop += Math.min(i.bottom - r, i.top - n));
}
function Vp(e, t, n = !1) {
	if (Rp(e), ip) {
		F(t, null), e.hasAttribute("tabindex") || (e.tabIndex = -1), B(e);
		return;
	}
	let r = t.filter(I), i = (n ? r[r.length - 1] : r[0]) ?? null;
	i !== null && (F(t, i), B(i));
}
function Hp(e, t = null) {
	let n = e == null ? null : e.isConnected ? e : Up(e, t);
	for (let e = n; e !== null; e = e.parentElement) if (e.matches(`${tp}, [tabindex]`) && ol(e)) return e;
	return n === null ? null : Wp(n);
}
function Up(e, t) {
	if (t === null) return null;
	for (let n = e.closest(w); n !== null; n = n.parentElement?.closest("[data-ui-id]") ?? null) {
		let e = t.findEveryComponent(D(n)).filter((e) => e.isConnected);
		if (e.length === 1 && e[0] instanceof HTMLElement) return e[0];
	}
	return null;
}
function Wp(e) {
	for (let t = e.closest(w); t !== null; t = t.parentElement?.closest("[data-ui-id]") ?? null) if (ol(t)) return Gp(t), t;
	return null;
}
function Gp(e) {
	if (e.hasAttribute("tabindex") || e.tabIndex >= 0) return;
	e.tabIndex = -1;
	let t = (n) => {
		n.target === e && (e.removeAttribute("tabindex"), e.removeEventListener("focusout", t));
	};
	e.addEventListener("focusout", t);
}
function Kp(e, t) {
	let n = document.activeElement;
	e != null && t.contains(n) && (qp(n, t) && bp(e, !gp(e)), B(e));
}
function qp(e, t) {
	for (let n = e; n !== null; n = n === t ? null : n.parentElement ?? null) if (lp.has(n)) return !0;
	return !1;
}
//#endregion
//#region src/state/value-equality.ts
function Jp(e, t) {
	return Object.is(e, t) ? !0 : e === null || t === null || e === void 0 || t === void 0 ? !1 : e instanceof Date || t instanceof Date ? e instanceof Date && t instanceof Date && e.getTime() === t.getTime() : typeof e != "object" || typeof t != "object" ? !1 : Array.isArray(e) || Array.isArray(t) ? Array.isArray(e) && Array.isArray(t) && Yp(e, t) : Xp(e, t);
}
function Yp(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!Jp(e[n], t[n])) return !1;
	return !0;
}
function Xp(e, t) {
	for (let n in e) if (Object.hasOwn(e, n) && (Object.hasOwn(t, n) ? !Jp(e[n], t[n]) : !Zp(e[n]))) return !1;
	for (let n in t) if (Object.hasOwn(t, n) && !Object.hasOwn(e, n) && !Zp(t[n])) return !1;
	return !0;
}
function Zp(e) {
	return e == null;
}
//#endregion
//#region src/updates/value-binding-engine.ts
var Qp = "data-ui-clear", $p = ["change", "toggle"], em = [
	...$p,
	"expand",
	"collapse",
	"open",
	"close"
];
function tm(e) {
	let t = ia(e);
	return t === "TwoWay" || t === "OneWayToSource" || t === "OnSubmit";
}
function nm(e) {
	return ia(e) === "OnSubmit";
}
function rm(e, t) {
	let n = e.getAttribute(Xe);
	if (n !== null) {
		let e = t.getBindingById(Number(n));
		return {
			bindingId: n,
			binding: e,
			buffered: e !== void 0 && nm(e.mode)
		};
	}
	for (let n of e.getAttributeNames()) {
		if (!n.startsWith("data-ui-bind-")) continue;
		let r = e.getAttribute(n) ?? "", i = t.getBindingById(Number(r));
		if (i !== void 0 && tm(i.mode)) return {
			bindingId: r,
			binding: i,
			buffered: nm(i.mode)
		};
	}
	return null;
}
var im = class {
	options;
	root;
	pendingSyncByComponent = /* @__PURE__ */ new WeakMap();
	bufferedElements = /* @__PURE__ */ new Set();
	unanswered = /* @__PURE__ */ new Map();
	sends = 0;
	pressedText = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, this.root = e.root ?? document;
		for (let e of $p) this.root.addEventListener(e, (e) => {
			this.handleValueEventAsync(e).catch((e) => {
				c("value binding engine failed.", e);
			});
		}, !0);
		this.root.addEventListener("input", (e) => this.holdEdited(e), !0), this.root.addEventListener(Vu, (e) => this.releaseDropped(e)), this.root.addEventListener("click", (e) => this.handleClear(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && e.target.closest(`[${Qp}]`) !== null && e.preventDefault();
		}, !0);
	}
	holdEdited(e) {
		e.target instanceof Element && !this.bufferedElements.has(e.target) && e.target.hasAttribute("data-ui-form-id") && rm(e.target, this.options.metadata)?.buffered === !0 && this.bufferValue(e.target);
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
		if (n === void 0 || !Lu(e)) return this.isHeld(e);
		let r = this.options.valueReaders.readBound(e);
		if (r === n.text || typeof r != "string") return this.isHeld(e);
		if (r.startsWith(n.text) && (typeof t == "string" || t == null)) {
			let i = t ?? "";
			am(e, i + r.slice(n.text.length)), this.pressedText.set(e, {
				text: i,
				press: n.press
			}), e.dispatchEvent(new Event("input", { bubbles: !0 }));
		}
		return this.commitTyped(e), !0;
	}
	commitTyped(e) {
		let t = rm(e, this.options.metadata);
		t !== null && (t.buffered ? this.bufferValue(e) : this.syncValueAsync(e, t.bindingId).catch((e) => c("value binding engine failed.", e)));
	}
	handleClear(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Qp}]`);
		if (t === null) return;
		let n = t.closest(w), r = n?.querySelector("[data-ui-bind-value]") ?? n?.querySelector("input, textarea, select");
		r == null || om(r) || (Zl(r), r.dispatchEvent(new Event("input", { bubbles: !0 })), r.dispatchEvent(new Event("change", { bubbles: !0 })), Lu(r) && document.activeElement !== r && B(r));
	}
	async handleValueEventAsync(e) {
		if (!(e.target instanceof Element) || e.type === "change" && (M(e.target) || A(e.target))) return;
		let t = rm(e.target, this.options.metadata);
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
		for (let t of this.root.querySelectorAll(`[${sn}="${Yi(e)}"]`)) {
			let e = Lu(t) && t.hasAttribute("data-ui-bind-value") ? this.options.valueReaders.readBound(t) : null;
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
			if ((a || !i.isConnected || Jp(o, this.options.valueReaders.readBound(i))) && this.bufferedElements.delete(i), !i.isConnected) continue;
			let s = rm(i, this.options.metadata);
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
		if (i === void 0 || !tm(i.mode) || nm(i.mode)) return;
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
function am(e, t) {
	let n = document.activeElement === e && typeof e.selectionEnd == "number" ? e.value.length - e.selectionEnd : null;
	if (e.value = t, n !== null) {
		let r = Math.max(0, t.length - n);
		e.setSelectionRange(r, r);
	}
}
function om(e) {
	return e.matches(":disabled") || (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.readOnly;
}
//#endregion
//#region src/events/event-boundary.ts
function sm(e, t) {
	let n = e.closest(`[${Qe}]`);
	return n !== null && n !== t && t.contains(n);
}
//#endregion
//#region src/events/command-turns.ts
var cm = class {
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
}, lm = class {
	catalog;
	registrations = /* @__PURE__ */ new Map();
	attachments = /* @__PURE__ */ new Map();
	constructor(e) {
		this.catalog = e;
	}
	add(e, t = {}) {
		let n = wa(e);
		if (n.length === 0) throw Error("Event name is required.");
		let r = wa(t.domEventName) || this.catalog.get(n)?.domEventName || n, i = {
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
		return this.registrations.get(wa(e));
	}
	isAttached(e) {
		return this.attachments.has(wa(e));
	}
	attach(e) {
		let t = {};
		return this.attachments.set(wa(e), t), t;
	}
	isCurrent(e, t) {
		return this.attachments.get(e) === t;
	}
}, um = class {
	create(e, t) {
		return e.createRequest === void 0 ? t.metadata === void 0 ? null : {
			eventId: E(t.metadata.eventId),
			dynamicParameters: [...t.dynamicParameters]
		} : e.createRequest(t);
	}
}, dm = "aria-busy";
function fm(e, t) {
	let n = null, r = !1, i = !1, a = () => {
		n = null, !(!e.isConnected || e.classList.contains("ui-loading") || e.hasAttribute("data-ui-pending")) && (e.setAttribute($r, ""), r = !0, e.hasAttribute(dm) || (e.setAttribute(dm, "true"), i = !0));
	};
	return t <= 0 ? a() : n = setTimeout(a, t), () => {
		n !== null && (clearTimeout(n), n = null), r && (r = !1, e.removeAttribute($r), i && !e.classList.contains("ui-loading") && e.removeAttribute(dm));
	};
}
//#endregion
//#region src/events/event-pipeline.ts
var pm = {
	dispatched: !1,
	success: !1
}, mm = () => void 0, hm = class extends Error {
	reason;
	constructor(e) {
		super(String(e)), this.reason = e;
	}
}, gm = class {
	options;
	root;
	registry;
	requestFactory = new um();
	turns = new cm();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.registry = new lm(e.eventCatalog), this.addEvent("click");
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
		if (r === null || vm(t, r.element) || sm(t.target, r.element)) return;
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
			let t = e instanceof hm, r = t ? e.reason : e;
			throw n.completed?.({
				...a,
				dispatched: t,
				success: !1,
				error: String(r)
			}), r;
		}
	}
	async runAsync(e, t, n, r) {
		if (r.domEvent.target instanceof Element && A(r.domEvent.target)) return pm;
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
		if (this.options.dispatcher.isPending(i)) return r.domEvent.preventDefault(), pm;
		let a = this.startPendingMark(e, n, r), o = n.getAttribute("data-ui-submit-form-id") ?? (t.submitsForm === !0 ? bm(r) : null), s = null;
		try {
			if (s = o === null ? null : await this.waitForUploadsAsync(o, n, r), s === void 0) return pm;
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
		return e !== "click" || n.metadata?.showsPending === !1 ? mm : fm(t, this.options.isReattaching?.() === !0 ? 0 : 300);
	}
	async waitForUploadsAsync(e, t, n) {
		let r = this.options.valueBinding?.pressForm(e), i = await this.options.uploads?.whenUploadedAsync(e) ?? /* @__PURE__ */ new Set();
		if (i.size === 0) return r?.close(), {
			formId: e,
			waited: i
		};
		let a = n.domEvent.target;
		if (!t.isConnected || a instanceof Element && (!a.isConnected || A(a))) r?.close();
		else return {
			formId: e,
			pressed: r,
			waited: i
		};
	}
	async sendInTurnAsync(e, t, n, r, i, a, o) {
		if (a !== null) {
			if (this.options.validationEngine?.runSubmitValidation(a.formId) === !1) return r.domEvent.preventDefault(), this.options.validationEngine.focusFirstInvalid(a.formId), pm;
			await this.options.valueBinding?.submitFormAsync(a.formId, a.pressed?.values, (e) => ym(a.waited, e));
		}
		if (await this.isRefusedValueEventAsync(t, n) || (await o.ahead, await this.options.valueBinding?.whenSent(), this.options.dispatcher.isPending(i))) return pm;
		this.options.interactionEngine.applyEvent({
			name: `before-${e}`,
			componentId: r.componentId,
			dynamicParameters: r.dynamicParameters,
			domEvent: r.domEvent
		});
		let s = this.options.dispatcher.dispatchAsync(i);
		o.done();
		let c = await s.catch((t) => {
			throw this.applyAfterEvent(e, r), new hm(t);
		});
		return this.options.effects.applyAll(c.command?.effects, this.options.dom), this.options.afterEffects?.(), this.applyAfterEvent(e, r), a !== null && this.options.validationEngine?.focusFirstInvalid(a.formId), {
			dispatched: !0,
			success: c.command?.success !== !1,
			error: c.command?.error ?? null
		};
	}
	async isRefusedValueEventAsync(e, t) {
		return !em.includes(e.name) && e.settlesValue !== !0 ? !1 : (await this.options.valueBinding?.whenSettled(t), this.options.validationEngine?.isRefused(t) === !0);
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
		_m(e.preventDefault, t) && t.domEvent.preventDefault(), _m(e.stopPropagation, t) && t.domEvent.stopPropagation();
	}
};
function _m(e, t) {
	return e === void 0 ? !1 : typeof e == "function" ? e(t) : e;
}
function vm(e, t) {
	if (e.type !== "mouseenter" && e.type !== "mouseleave") return !1;
	let n = e.relatedTarget;
	return n instanceof Node && t.contains(n);
}
function ym(e, t) {
	for (let n of e) if (n.contains(t)) return !0;
	return !1;
}
function bm(e) {
	let t = e.domEvent.target;
	return ((t instanceof Element ? t.closest("[data-ui-form-id]") : null) ?? e.component.querySelector("[data-ui-form-id]"))?.getAttribute("data-ui-form-id") ?? null;
}
//#endregion
//#region src/interactions/focus-handoff.ts
function xm() {
	let e = document.activeElement;
	return e === null || e === document.body ? null : e;
}
function Sm(e) {
	let t = document.activeElement;
	if (!e.isConnected || t !== e && t !== document.body) return null;
	if (Cm(e)) return wm(e, () => Sm(e)), null;
	let n = e;
	for (; n.parentElement !== null && !Cm(n.parentElement);) n = n.parentElement;
	let r = Dm(n) ?? Om(n) ?? km();
	return r !== null && B(r), r;
}
function Cm(e) {
	return e.checkVisibility({ visibilityProperty: !0 });
}
function wm(e, t) {
	if (typeof document.getAnimations != "function") return;
	let n = document.getAnimations().filter((t) => Tm(t) && Em(t)?.contains(e) === !0);
	n.length > 0 && Promise.all(n.map((e) => e.finished)).then(t, () => void 0);
}
function Tm(e) {
	return e.transitionProperty === "visibility";
}
function Em(e) {
	return e.effect?.target ?? null;
}
function Dm(e) {
	let t = (e.closest(".ui-key-value-action__value-input, .ui-key-value-action__edit-action")?.closest(".ui-key-value-action__row") ?? null)?.querySelector(".ui-key-value-action__action")?.querySelector(tp) ?? null;
	return t !== null && Cm(t) ? t : null;
}
function Om(e) {
	let t = Op(e.closest(Pp) ?? document, null).filter((t) => !e.contains(t)), n = t.find((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0), r = t.filter((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_PRECEDING) !== 0);
	return n ?? r[r.length - 1] ?? null;
}
function km() {
	let e = document.querySelector(`[${Pn}="content"]`);
	return e === null ? null : (Gp(e), e);
}
//#endregion
//#region src/interactions/interaction-engine.ts
var Am = class {
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
		for (let e of $p) i.addEventListener(e, (e) => this.applyEditedValue(e), !0);
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
		let n = this.options.valueReaders.readBound(e.target), r = Nm(t.interactions[0].source, t.dynamicParameters);
		if (!(this.heard.has(r) && Jp(this.heard.get(r), n))) {
			this.heard.set(r, n);
			for (let e of t.interactions) this.applyInteraction(e, t.dynamicParameters, !0, n);
		}
	}
	resolveEdited(e) {
		let t = this.options.dom.resolveNearestComponent(e, () => !0);
		if (t === null) return null;
		let n = rm(e, this.options.metadata), r;
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
			for (let e of t.interactions) oa(e.actionKind) === "CopyValue" && Pm(e.target) && this.writeTarget(e.target, t.dynamicParameters, jm(e, n), !0);
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
		let t = this.index.getPropertyInteractions(E(e.reference.componentId), e.reference.propertyId), n = t.length > 0 ? Nm(e.reference, e.dynamicParameters) : null;
		n !== null && this.heard.has(n) && this.heard.set(n, e.value);
		for (let n of t) this.applyInteraction(n, e.dynamicParameters, !1, e.value);
	}
	applyInteraction(e, t, n, r = !0) {
		let i = oa(e.actionKind);
		if (i === "Effect") {
			this.applyEffectInteraction(e, t, r);
			return;
		}
		let a = e.target;
		if (!Pm(a)) return;
		let o = i === "CopyValue" ? jm(e, r) : this.evaluator.evaluate(e, r);
		this.writeTarget(a, t, o, n), n && this.options.writeBack?.(a, t, o);
	}
	writeTarget(e, t, n, r) {
		let i = xm();
		this.applyDepth++;
		try {
			this.propertyPatchEngine.applyPropertyValue(e, t, n, r);
		} finally {
			this.applyDepth--;
		}
		i !== null && Sm(i);
	}
	applyEffectInteraction(e, t, n) {
		let r = e.effect;
		r == null ? s("effect interaction carries no effect.", e) : this.evaluator.matches(e, n) && this.options.effects.apply({
			effect: Mm(r, t, this.options.dom),
			dom: this.options.dom,
			row: t
		});
	}
};
function jm(e, t) {
	return (t == null || typeof t == "string" && t.trim().length === 0) && e.falseValue !== void 0 ? e.falseValue : t;
}
function Mm(e, t, n) {
	if (t.length === 0) return e;
	let r = e.target;
	if (r === void 0 || (r.dynamicParameters?.length ?? 0) > 0) return e;
	let i = E(r.id);
	for (let a = t.length; a >= 0; a--) {
		let o = t.slice(0, a), s = n.findComponent(i, o);
		if (s !== null && Ma(s, o)) return a === 0 ? e : {
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
function Nm(e, t) {
	return JSON.stringify([E(e?.componentId), e?.propertyId ?? ""]) + ma(t);
}
function Pm(e) {
	return e != null && e.propertyId.length > 0;
}
//#endregion
//#region src/interactions/interaction-evaluator.ts
var Fm = class {
	evaluate(e, t) {
		return this.matches(e, t) ? e.trueValue : e.falseValue;
	}
	matches(e, t) {
		return Im(t, e.operator, e.value);
	}
};
function Im(e, t, n) {
	let r = Lm(e), i = Lm(n);
	switch (sa(t)) {
		case "Required": return r != null && r !== !1 && String(r).trim().length > 0;
		case "Equal": return String(r ?? "") === String(i ?? "");
		case "NotEqual": return String(r ?? "") !== String(i ?? "");
		case "Greater": return Rm(r, i, (e) => e > 0);
		case "GreaterOrEqual": return Rm(r, i, (e) => e >= 0);
		case "Less": return Rm(r, i, (e) => e < 0);
		case "LessOrEqual": return Rm(r, i, (e) => e <= 0);
		case "Like": return String(r ?? "").includes(String(i ?? ""));
		case "LikeIgnoreCase": return String(r ?? "").toLocaleLowerCase().includes(String(i ?? "").toLocaleLowerCase());
		case "In": return Array.isArray(i) && i.some((e) => String(e ?? "") === String(r ?? ""));
		case "Regex": return Bm(r, i);
		case "RegexEach": return zm(r, i);
		default: return !1;
	}
}
function Lm(e) {
	return O(e) ? e.key : mc(e) ? e.text : e;
}
function Rm(e, t, n) {
	let r = Number(e), i = Number(t);
	return !Number.isNaN(r) && !Number.isNaN(i) ? n(r < i ? -1 : +(r > i)) : !Number.isNaN(r) || !Number.isNaN(i) || typeof e != "string" || typeof t != "string" ? !1 : n(e < t ? -1 : +(e > t));
}
function zm(e, t) {
	return e == null ? !0 : Array.isArray(e) ? e.every((e) => Bm(Lm(e), t)) : Bm(e, t);
}
function Bm(e, t) {
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
var Vm = "Value", Hm = "EndValue", Um = "Pressed", Wm = class {
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
		return this.eventNames.has(wa(e));
	}
	getSourceEventNames() {
		let e = /* @__PURE__ */ new Set();
		for (let t of this.eventNames) qm(t) || e.add(t);
		return e;
	}
	hasEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(wa(e))?.has(t) === !0;
	}
	getEventInteractions(e, t) {
		return this.eventInteractions.get(Jm(e, t)) ?? [];
	}
	getPropertyInteractions(e, t) {
		return this.propertyInteractions.get(Ym(e, t)) ?? [];
	}
	getValueInteractions(e) {
		return this.valueInteractions.get(e) ?? [];
	}
	getEndValueInteractions(e) {
		return this.endValueInteractions.get(e) ?? [];
	}
	addInteraction(e) {
		if (Gm(e)) {
			let t = E(e.sourceEvent?.componentId), n = wa(e.sourceEvent?.eventName);
			if (t > 0 && n.length > 0) {
				let r = this.eventInteractions.get(Jm(t, n));
				r === void 0 && (r = [], this.eventInteractions.set(Jm(t, n), r)), r.push(e), this.eventNames.add(n);
				let i = this.eventComponentIdsByName.get(n);
				i === void 0 && (i = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(n, i)), i.add(t);
			}
		} else if (Km(e)) {
			let t = E(e.source?.componentId), n = e.source?.propertyId ?? "";
			if (t > 0 && n.length > 0) {
				let r = this.propertyInteractions.get(Ym(t, n));
				r === void 0 && (r = [], this.propertyInteractions.set(Ym(t, n), r)), r.push(e), oa(e.actionKind) === "CopyValue" && (this.copiesValues = !0);
				let i = this.metadata.getPropertyDefinition(n)?.propertyName, a = i === Vm || i === Um ? this.valueInteractions : i === Hm ? this.endValueInteractions : null;
				if (a !== null) {
					let n = a.get(t) ?? [];
					n.push(e), a.set(t, n);
				}
			}
		}
	}
};
function Gm(e) {
	return aa(e.sourceKind) === "Event";
}
function Km(e) {
	return aa(e.sourceKind) === "Property";
}
function qm(e) {
	return e.startsWith("before-") || e.startsWith("after-");
}
function Jm(e, t) {
	return `${e}:${wa(t)}`;
}
function Ym(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/rendering/motion.ts
var V = {
	fast: 120,
	normal: 200,
	ripple: 400,
	ease: "cubic-bezier(0.4, 0, 0.2, 1)",
	enter: "cubic-bezier(0, 0, 0.2, 1)",
	exit: "cubic-bezier(0.4, 0, 1, 1)",
	spring: "cubic-bezier(0.34, 1.56, 0.64, 1)"
};
function Xm() {
	return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function Zm(e) {
	if (typeof e.getAnimations == "function") for (let t of e.getAnimations()) typeof CSSTransition == "function" && t instanceof CSSTransition && t.finish();
}
function Qm(e, t, n) {
	let r = !1, i = () => {
		r || (r = !0, clearTimeout(a), n());
	}, a = setTimeout(i, t), o = typeof e.getAnimations == "function" ? e.getAnimations().filter((e) => typeof CSSTransition != "function" || e instanceof CSSTransition) : [];
	Promise.allSettled(o.map((e) => e.finished)).then(i);
}
//#endregion
//#region src/rendering/responsive-tier.ts
var $m = [
	"base",
	"sm",
	"md",
	"xl",
	"xxl"
], eh = {
	sm: 640,
	md: 768,
	xl: 1280,
	xxl: 1536
};
function th(e) {
	return `(min-width: ${eh[e]}px)`;
}
var nh = th("sm");
function rh(e = (e) => matchMedia(e).matches) {
	for (let t of [
		"xxl",
		"xl",
		"md",
		"sm"
	]) if (e(th(t))) return t;
	return "base";
}
function ih(e, t) {
	return t === "base" ? e : `${e}-${t}`;
}
function ah(e, t) {
	if (e == null) return;
	let n = typeof e == "object" ? e : void 0;
	return n === void 0 || !("base" in n) ? t === "base" ? e : void 0 : n[t];
}
function oh(e, t) {
	return sh(t, (t) => ah(e, t));
}
function sh(e, t) {
	for (let n = $m.indexOf(e); n >= 0; n--) {
		let e = t($m[n]);
		if (e != null) return e;
	}
}
//#endregion
//#region src/interactions/anchored-popup.ts
var ch = /* @__PURE__ */ new Set([
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
function lh(e) {
	return ch.has(e);
}
var uh = 4, dh = 12, fh = /* @__PURE__ */ new Map(), ph = !1, mh = null, hh = /* @__PURE__ */ new WeakMap(), gh = "data-ui-popup-stood-in";
function _h(e, t) {
	t === null ? hh.delete(e) : hh.set(e, t);
}
var vh = "--ui-popup-ground";
function yh(e, t) {
	let n = e.closest("[data-ui-theme]") === t.closest("[data-ui-theme]") ? getComputedStyle(e).getPropertyValue(vh).trim() : "";
	n.length === 0 ? t.style.removeProperty(vh) : t.style.setProperty(vh, n);
}
function bh(e, t, n) {
	fh.set(t, {
		anchor: e,
		options: n
	}), Nh(), mh?.observe(t), Eh(e, t), Fh(e, t, n);
}
var xh = "data-ui-popup-lifted", Sh = "data-ui-sheet";
function Ch() {
	return typeof matchMedia == "function" && !matchMedia(nh).matches;
}
function wh(e) {
	return e.hasAttribute(Sh);
}
function Th(e) {
	e.hasAttribute(xh) ? e.matches(":popover-open") || e.showPopover() : (e.setAttribute("popover", "manual"), e.setAttribute(xh, ""), Dh(e));
}
function Eh(e, t) {
	(t.hasAttribute(xh) || Oh(t) || e.closest(`[${xh}]`) !== null) && Th(t);
}
function Dh(e) {
	let t = getComputedStyle(e), n = t.transitionProperty.split(",").map((e) => e.trim()), r = n.indexOf("overlay");
	if (r === -1) {
		e.showPopover();
		return;
	}
	let i = t.transitionDuration.split(",").map((e) => e.trim());
	e.style.setProperty("transition-duration", n.map((e, t) => t === r ? "0s" : i[t % i.length]).join(", ")), e.showPopover(), getComputedStyle(e).getPropertyValue("overlay"), e.style.removeProperty("transition-duration");
}
function Oh(e) {
	for (let t = e.parentElement; t !== null; t = t.parentElement) {
		let e = getComputedStyle(t);
		if (e.transform !== "none" || e.filter !== "none" || e.perspective !== "none" || t.hasAttribute("data-ui-surface-image-blur") && e.isolation === "isolate") return !0;
	}
	return !1;
}
var kh = V.normal * 5;
function Ah(e, t) {
	e.hasAttribute(xh) && (e.matches(":popover-open") && e.hidePopover(), Qm(e, kh, () => {
		e.matches(":popover-open") || fh.has(e) || (e.removeAttribute("popover"), e.removeAttribute(xh), t?.());
	}));
}
function jh(e) {
	let t = fh.get(e);
	t !== void 0 && Fh(t.anchor, e, t.options);
}
function Mh(e) {
	e != null && (fh.delete(e), mh?.unobserve(e), Ah(e));
}
function Nh() {
	ph || (ph = !0, document.addEventListener("scroll", (e) => Ph(e.target), !0), window.addEventListener("resize", () => Ph(null)), window.visualViewport?.addEventListener("resize", () => Ph(null)), window.visualViewport?.addEventListener("scroll", () => Ph(null)), mh = new ResizeObserver((e) => {
		for (let t of e) {
			if (!(t.target instanceof HTMLElement)) continue;
			let e = fh.get(t.target);
			e !== void 0 && Fh(e.anchor, t.target, e.options, !0);
		}
	}));
}
function Ph(e) {
	for (let [t, n] of fh) t.isConnected ? e instanceof Node && t.contains(e) || Fh(n.anchor, t, n.options) : Mh(t);
}
function Fh(e, t, n, r = !1) {
	if (!e.isConnected) return;
	let i = zh(e), a = i !== e;
	t.hasAttribute(gh) !== a && t.toggleAttribute(gh, a), n.minAnchorWidth === !0 && (t.style.minWidth = `${i.getBoundingClientRect().width}px`);
	let o = t.hasAttribute(Ih) ? {
		top: t.scrollTop,
		left: t.scrollLeft
	} : null;
	Rh(t);
	let s = i.getBoundingClientRect(), c = (i === e ? n.crossAnchor ?? i : i).getBoundingClientRect(), l = i === e && n.surface !== void 0 ? n.surface.getBoundingClientRect() : s, u = n.gap ?? 4, d = t.getBoundingClientRect(), f = Hh(n.boundary), p = fh.get(t), m = r ? p?.side : void 0, h = m !== void 0 && Wh(l, d, m, u, f) ? m : Uh(l, d, n.placement, u, f);
	p !== void 0 && (p.side = h), Wh(l, d, h, u, f) || (Lh(t, h, Jh(l, h, f) - u - uh), d = t.getBoundingClientRect(), o !== null && (t.scrollTop = o.top, t.scrollLeft = o.left));
	let g = n.alignEntries === !0 ? Qh(t, h) : Zh, _ = eg(l, c, d, h, u, g), v = tg(l, c, d, h, u, g);
	n.arrow === !0 && (qh(h) ? v = Bh(v, c.left + c.width / 2, d.width) : _ = Bh(_, c.top + c.height / 2, d.height));
	let ee = rg();
	_ = ee.top + sg(_ - ee.top, d.height, ee.bottom - ee.top), v = sg(v, d.width, window.innerWidth), t.style.top = `${_}px`, t.style.left = `${v}px`, t.dataset.uiPlacement !== h && (t.dataset.uiPlacement = h), Vh(t, c, d, h, _, v);
}
var Ih = "data-ui-popup-capped";
function Lh(e, t, n) {
	let r = qh(t);
	e.setAttribute(Ih, ""), e.style.setProperty(r ? "max-height" : "max-width", `${Math.max(0, n)}px`), e.style.setProperty(r ? "overflow-y" : "overflow-x", "auto");
}
function Rh(e) {
	if (e.hasAttribute(Ih)) {
		e.removeAttribute(Ih);
		for (let t of [
			"max-height",
			"max-width",
			"overflow-y",
			"overflow-x"
		]) e.style.removeProperty(t);
	}
}
function zh(e) {
	for (let t = e; t !== null; t = t.parentElement) {
		if (t.hasAttribute(gh)) return e;
		let n = hh.get(t);
		if (n !== void 0) return n;
	}
	return e;
}
function Bh(e, t, n) {
	let r = t - e;
	return r < dh ? e - (dh - r) : r > n - dh ? e + (r - (n - dh)) : e;
}
function Vh(e, t, n, r, i, a) {
	let o = qh(r), s = o ? t.left + t.width / 2 - a : t.top + t.height / 2 - i, c = o ? n.width : n.height;
	e.style.setProperty("--ui-popup-arrow", `${Math.max(dh, Math.min(s, c - dh))}px`);
}
function Hh(e) {
	let t = rg(), n = {
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
function Uh(e, t, n, r, i) {
	let a = Yh(n);
	if (Wh(e, t, n, r, i)) return n;
	if (Wh(e, t, a, r, i)) return a;
	for (let a of Gh(n)) if (Wh(e, t, a, r, i)) return a;
	return Jh(e, a, i) > Jh(e, n, i) ? a : n;
}
function Wh(e, t, n, r, i) {
	return Jh(e, n, i) >= Kh(t, n) + r;
}
function Gh(e) {
	return e.startsWith("bottom") ? ["right-start", "left-start"] : e.startsWith("top") ? ["right-end", "left-end"] : e.startsWith("right") ? ["bottom-start", "top-start"] : ["bottom-end", "top-end"];
}
function Kh(e, t) {
	return qh(t) ? e.height : e.width;
}
function qh(e) {
	return e.startsWith("top") || e.startsWith("bottom");
}
function Jh(e, t, n) {
	return t.startsWith("top") ? e.top - n.top : t.startsWith("bottom") ? n.bottom - e.bottom : t.startsWith("left") ? e.left - n.left : n.right - e.right;
}
function Yh(e) {
	return e.startsWith("top") ? `bottom${Xh(e)}` : e.startsWith("bottom") ? `top${Xh(e)}` : e.startsWith("left") ? `right${Xh(e)}` : `left${Xh(e)}`;
}
function Xh(e) {
	let t = e.indexOf("-");
	return t === -1 ? "" : e.slice(t);
}
var Zh = {
	start: 0,
	end: 0
};
function Qh(e, t) {
	let n = getComputedStyle(e);
	return qh(t) ? {
		start: $h(n.paddingLeft) + $h(n.borderLeftWidth),
		end: $h(n.paddingRight) + $h(n.borderRightWidth)
	} : {
		start: $h(n.paddingTop) + $h(n.borderTopWidth),
		end: $h(n.paddingBottom) + $h(n.borderBottomWidth)
	};
}
function $h(e) {
	let t = Number.parseFloat(e ?? "");
	return Number.isFinite(t) ? t : 0;
}
function eg(e, t, n, r, i, a) {
	return r.startsWith("top") ? e.top - i - n.height : r.startsWith("bottom") ? e.bottom + i : ng(t.top, t.height, n.height, r, a);
}
function tg(e, t, n, r, i, a) {
	return r.startsWith("left") ? e.left - i - n.width : r.startsWith("right") ? e.right + i : ng(t.left, t.width, n.width, r, a);
}
function ng(e, t, n, r, i) {
	let a = Xh(r);
	return a === "-start" ? e - i.start : a === "-end" ? e + t - n + i.end : e + (t - n) / 2;
}
function rg() {
	let e = window.visualViewport, t = e == null || Math.abs(e.scale - 1) > .01, n = t ? 0 : Math.max(0, e.offsetTop), r = t ? window.innerHeight : Math.min(window.innerHeight, e.offsetTop + e.height);
	return {
		top: n,
		bottom: Math.min(r, ig(r))
	};
}
function ig(e) {
	let t = document.querySelector(`[${kn}]`);
	if (t === null) return e;
	let n = t.getBoundingClientRect();
	return n.height > 0 && n.width >= window.innerWidth - 1 && n.top > 0 ? n.top : e;
}
function ag(e, t, n) {
	if (wh(e)) return;
	let r = e.getBoundingClientRect(), i = rg();
	e.style.left = `${og(t, r.width, 0, window.innerWidth)}px`, e.style.top = `${og(n, r.height, i.top, i.bottom)}px`;
}
function og(e, t, n, r) {
	return e + t <= r - uh ? e : e - t >= n + uh ? e - t : n + sg(e - n, t, r - n);
}
function sg(e, t, n) {
	return Math.max(uh, Math.min(e, n - t - uh));
}
//#endregion
//#region src/interactions/press-wave.ts
var cg = "ui-press-wave", lg = "ui-press-wave__ink";
function ug(e) {
	if (e.type !== "childList" || e.addedNodes.length + e.removedNodes.length === 0) return !1;
	for (let t of e.addedNodes) if (!dg(t)) return !1;
	for (let t of e.removedNodes) if (!dg(t)) return !1;
	return !0;
}
function dg(e) {
	return e instanceof Element && e.classList.contains("ui-press-wave");
}
function fg(e) {
	return e.length > 0 && e.every(ug);
}
function pg(e) {
	for (let t of e.querySelectorAll(`.${cg}`)) t.remove();
}
//#endregion
//#region src/interactions/dom-mutations.ts
var mg = 32;
function H(e, t, n, r) {
	if (!(e instanceof Node)) return null;
	let i = new MutationObserver((i) => {
		let a = hg(e, i.filter((e) => !ug(e) && (n.relevant?.(e) ?? !0)), t, n.addedOnly ?? !1);
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
function hg(e, t, n, r = !1) {
	let i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set();
	for (let o of t) {
		let t = o.target instanceof Element ? o.target : o.target.parentElement;
		if (t === null) continue;
		if (r && o.type === "childList" && t.closest(n) === null) {
			gg(o.addedNodes, n, i);
			continue;
		}
		if (a.has(t)) continue;
		a.add(t);
		let s = t.closest(n);
		if (s !== null) i.add(s);
		else {
			for (let e of t.querySelectorAll(n)) i.add(e);
			if (i.size > mg) return new Set(e.querySelectorAll(n));
		}
	}
	return i.size === 0 ? null : i;
}
function gg(e, t, n) {
	for (let r of e) if (r instanceof Element && r.isConnected) {
		r instanceof HTMLElement && r.matches(t) && n.add(r);
		for (let e of r.querySelectorAll(t)) n.add(e);
	}
}
function _g(e, t, n) {
	return (e.target instanceof Element ? e.target : e.target.parentElement)?.closest(`${t}, ${n}`)?.matches(t) === !0;
}
//#endregion
//#region src/interactions/open-dialogs.ts
var vg = "data-ui-dialog", yg = "data-ui-dialog-modal", bg = "data-ui-dialog-backdrop", xg = "data-ui-dialog-close-backdrop", Sg = "data-ui-dialog-close-escape", Cg = `[${vg}]:not([hidden]), dialog[open]`, wg = "dialog:modal";
function Tg(e) {
	let t = e.querySelectorAll(`[${vg}]:not([hidden])`);
	return t.length === 0 ? null : t[t.length - 1];
}
function Eg(e) {
	let t = e.querySelectorAll(wg);
	if (t.length > 0) return t[t.length - 1];
	let n = Tg(e);
	return n !== null && n.hasAttribute("data-ui-dialog-modal") ? n : null;
}
function Dg(e) {
	let t = typeof document > "u" ? null : Eg(document);
	return t !== null && !t.contains(e);
}
//#endregion
//#region src/interactions/popup-dismissal.ts
var Og = /* @__PURE__ */ new Set(), kg = null;
function Ag(e) {
	kg = e;
}
function jg(e) {
	let t = e.composedPath(), n = kg?.(t) ?? null;
	if (n === null) return t;
	let r = [...t];
	for (let e = n; e !== null; e = e.parentElement) r.push(e);
	return r;
}
var Mg = /* @__PURE__ */ new Map(), Ng = 0, Pg = !1;
function Fg() {
	Pg || (Pg = !0, document.addEventListener("keydown", (e) => {
		!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || N(e) || Rg(ku(e.target)) && e.preventDefault();
	}, !0));
}
function Ig() {
	for (let e of Og) for (let t of e.openPopups()) if (t.isConnected && !e.isBehind(t)) return !0;
	return !1;
}
function Lg(e) {
	for (let t of Og) t.hearRefusedClick(e);
}
function Rg(e) {
	let t = [];
	for (let e of Og) for (let n of e.openPopups()) n.isConnected && t.push({
		instance: e,
		popup: n
	});
	let n = new Set(t.map((e) => e.popup));
	for (let e of [...Mg.keys()]) n.has(e) || Mg.delete(e);
	for (let { popup: e } of t) Mg.has(e) || Mg.set(e, ++Ng);
	let r = zg(t, (e) => Mg.get(e.popup) ?? 0, (e, t) => e.popup.contains(t.popup));
	for (let { instance: t, popup: n } of r) if ((e === null || e.contains(n)) && t.dismiss(n, "escape")) return !0;
	return !1;
}
function zg(e, t, n) {
	let r = [...e].sort((e, n) => t(n) - t(e)), i = [];
	for (; r.length > 0;) {
		let e = r.findIndex((e) => !r.some((t) => t !== e && n(e, t)));
		i.push(...r.splice(e, 1));
	}
	return i;
}
var Bg = class {
	options;
	pressedInside = /* @__PURE__ */ new Set();
	constructor(e) {
		this.options = e, document.addEventListener("pointerdown", (e) => this.handlePress(e), !0), document.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), e.onPress !== !0 && document.addEventListener("click", (e) => this.handleClick(e), !0), e.onWindowBlur === !0 && window.addEventListener("blur", () => this.dismissAll("blur")), Og.add(this), Fg();
	}
	openPopups() {
		return [...this.options.openPopups()];
	}
	handlePress(e) {
		let t = jg(e), n = this.options.onPress === !0 || e instanceof MouseEvent && e.button !== 0;
		this.pressedInside.clear();
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) ? this.pressedInside.add(e) : n && this.dismiss(e, "outside");
	}
	handleContextMenu(e) {
		let t = jg(e);
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) || this.dismiss(e, "outside");
	}
	hearRefusedClick(e) {
		this.options.onPress !== !0 && this.handleClick(e);
	}
	handleClick(e) {
		let t = jg(e);
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) || this.pressedInside.has(e) || this.dismiss(e, "outside");
		this.pressedInside.clear();
	}
	dismissAll(e) {
		let t = !1;
		for (let n of [...this.options.openPopups()]) t = this.dismiss(n, e) || t;
		return t;
	}
	isBehind(e) {
		return this.options.isBehind === void 0 ? Dg(e) : this.options.isBehind(e);
	}
	dismiss(e, t) {
		return this.isBehind(e) || this.options.canDismiss?.(e, t) === !1 ? !1 : (this.options.close(e, t), !0);
	}
	isInside(e, t) {
		return this.options.isInside === void 0 ? t.includes(e) : this.options.isInside(e, t);
	}
}, Vg = /\p{M}/gu, Hg = ".ui-text__title";
function Ug(e, t) {
	return Wg(e, t).split(/\s+/).filter((e) => e.length !== 0);
}
function Wg(e, t) {
	return qg(e, Kg(t));
}
function Gg(e, t) {
	return t.every((t) => e.includes(t));
}
function Kg(e) {
	return e.closest("[lang]")?.getAttribute("lang") || void 0;
}
function qg(e, t) {
	let n = e.normalize("NFD").replace(Vg, "");
	try {
		return n.toLocaleLowerCase(t);
	} catch {
		return n.toLowerCase();
	}
}
function Jg(e) {
	return e.querySelector(Hg)?.textContent ?? e.textContent ?? "";
}
//#endregion
//#region src/interactions/pointer-drag.ts
var Yg = class {
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
		if (t === null || A(t)) return;
		let n = this.options.begin(t, {
			x: e.clientX,
			y: e.clientY
		});
		if (n === null) return;
		e.preventDefault();
		try {
			t.setPointerCapture(e.pointerId);
		} catch {}
		t.setAttribute(Yr, ""), t.tabIndex >= 0 && t.focus({ preventScroll: !0 });
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
			e.pointerId === t.pointerId ? t.point = n : t.second.point = n, this.options.pinch?.(t.context, Xg(r, i, t.point, t.second.point));
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
		this.drag = null, n.removeAttribute(Yr), e.type === "pointercancel" && this.options.takenBack !== void 0 ? this.options.takenBack(n, r) : this.options.end(n, r);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || N(e) || this.drag === null) return;
		e.preventDefault();
		let { handle: t, context: n, pointerId: r, originPoint: i, second: a } = this.drag;
		this.drag = null, t.removeAttribute(Yr);
		for (let e of a === null ? [r] : [r, a.pointerId]) try {
			t.releasePointerCapture(e);
		} catch {}
		this.options.cancel === void 0 ? (this.options.move(n, 0, i), this.options.end(t, n)) : this.options.cancel(t, n);
	}
};
function Xg(e, t, n, r) {
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
function Zg() {
	let e = (e) => {
		e.preventDefault(), e.stopImmediatePropagation(), t();
	}, t = () => {
		window.removeEventListener("click", e, !0), window.removeEventListener("pointerdown", t, !0), window.removeEventListener("keydown", t, !0);
	};
	window.addEventListener("click", e, !0), window.addEventListener("pointerdown", t, !0), window.addEventListener("keydown", t, !0);
}
function Qg(e, t) {
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
		Zg();
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
var $g = "data-ui-sheet-dragging", e_ = "--ui-sheet-drag", t_ = 24, n_ = 1 / 3;
function r_(e, t, n) {
	return e > t * n_ || n > .5 && e > 6;
}
function i_(e, t, n) {
	e.style.removeProperty(e_), e.removeAttribute($g);
	let r = Qg(e, {
		axis: "y",
		oneWay: !0,
		holdsTouch: !0,
		begins: (n) => t.scrollTop <= 0 && (n.pointerType === "touch" || n.clientY - e.getBoundingClientRect().top <= t_),
		start: (t) => {
			e.setAttribute($g, ""), a_(e, t.pointerId);
		},
		follow: (t) => e.style.setProperty(e_, `${t}px`),
		end: (t, r, i) => {
			e.removeAttribute($g), i && r_(t, e.getBoundingClientRect().height, r) ? n() : e.style.setProperty(e_, "0px");
		}
	});
	return () => {
		r(), e.removeAttribute($g);
	};
}
function a_(e, t) {
	try {
		e.setPointerCapture(t);
	} catch {}
}
//#endregion
//#region src/interactions/popup-sheet.ts
var o_ = "data-ui-sheet-covered", s_ = "ui-sheet-scrim", c_ = "data-ui-sheet-scrim-leaving", l_ = 400, u_ = "ui-sheet__back", d_ = "ui.sheet.back", f_ = "ne-arrow-back", p_ = [], m_ = null, h_ = !1, g_ = !1;
function __(e, t) {
	if (v_(e) !== null) return;
	let n = t.anchor?.closest("[data-ui-sheet]") ?? null, r = n === null ? null : v_(n);
	e.style.removeProperty("top"), e.style.removeProperty("left"), e.style.removeProperty("min-width");
	let i = wh(e);
	e.setAttribute(Sh, r === null ? "root" : "nested"), i || (e.setAttribute("popover", "manual"), Zm(e));
	let a = null;
	e.querySelector(`:scope > .${u_}`)?.remove(), r !== null && (e.style.minHeight = `${r.popup.getBoundingClientRect().height}px`, r.popup.setAttribute(o_, ""), a = y_(t), e.prepend(a)), x_(), Th(e);
	let o = {
		popup: e,
		parent: r,
		opening: t,
		back: a,
		hidden: [],
		detachSwipe: i_(e, e, () => S_(e))
	};
	p_.push(o), C_(), queueMicrotask(() => T_(o));
}
function v_(e) {
	return p_.find((t) => t.popup === e) ?? null;
}
function y_(e) {
	let t = document.createElement("button"), n = e.anchor === void 0 ? "" : Jg(e.anchor).trim();
	return t.type = "button", t.className = u_, t.tabIndex = -1, t.textContent = n, t.prepend(b_()), k.write(t, "aria-label", d_, { entry: n }), t.addEventListener("click", (t) => {
		t.stopPropagation(), e.close();
	}), t;
}
function b_() {
	let e = document.createElement("span");
	return e.className = "ui-sheet__back-mark", e.setAttribute("aria-hidden", "true"), _o(e, f_), e;
}
function x_() {
	m_ === null && (m_ = document.createElement("div"), m_.className = s_, m_.setAttribute("aria-hidden", "true"), m_.addEventListener("mousedown", (e) => e.preventDefault())), m_.parentElement === null && document.body.appendChild(m_), m_.removeAttribute(c_), Th(m_);
}
function S_(e) {
	for (let t = v_(e); t !== null; t = t.parent) t.opening.close();
}
function C_() {
	h_ || (h_ = !0, window.addEventListener("pointerdown", () => {
		g_ = !0;
	}, !0), window.addEventListener("pointerup", w_, !0), window.addEventListener("pointercancel", w_, !0), window.addEventListener("keydown", (e) => {
		let t = p_.at(-1);
		e.key === "Tab" && !e.defaultPrevented && t !== void 0 && t.opening.trapsTab && e.target instanceof Node && t.popup.contains(e.target) && jp(t.popup, e);
	}, !0), matchMedia(nh).addEventListener("change", () => {
		for (let e of p_.filter((e) => e.parent === null)) e.opening.close();
	}));
}
function w_() {
	if (g_ = !1, m_?.hasAttribute(c_) !== !0) return;
	let e = () => {
		m_?.hasAttribute(c_) === !0 && p_.length === 0 && (m_.removeAttribute(c_), m_.hidePopover());
	};
	window.addEventListener("click", () => window.setTimeout(e), { once: !0 }), window.setTimeout(e, l_);
}
function T_(e) {
	if (!p_.includes(e)) return;
	let { popup: t } = e;
	t.contains(document.activeElement) || (t.hasAttribute("tabindex") || (t.tabIndex = -1), B(t)), e.hidden = E_(t);
}
function E_(e) {
	let t = [];
	for (let n = e; n.parentElement !== null && n !== document.body; n = n.parentElement) for (let e of n.parentElement.children) e !== n && e !== m_ && e instanceof HTMLElement && e.getAttribute("aria-hidden") !== "true" && (e.setAttribute("aria-hidden", "true"), t.push(e));
	return t;
}
function D_(e) {
	let t = v_(e);
	if (t !== null) {
		for (let e of [...p_].reverse()) if (e === t || O_(e, t)) {
			for (let t of e.hidden) t.removeAttribute("aria-hidden");
			e.hidden = [];
		}
	}
}
function O_(e, t) {
	for (let n = e.parent; n !== null; n = n.parent) if (n === t) return !0;
	return !1;
}
function k_(e) {
	let t = v_(e);
	if (t !== null) {
		for (let e of p_.filter((e) => e.parent === t)) e.opening.close(), k_(e.popup);
		D_(e), p_.splice(p_.indexOf(t), 1), t.detachSwipe(), t.parent?.popup.removeAttribute(o_), p_.length === 0 && A_(), Ah(e, () => {
			v_(e) === null && (e.removeAttribute(Sh), e.removeAttribute(o_), e.style.removeProperty("min-height"), e.style.removeProperty("--ui-sheet-drag"), t.back?.remove());
		});
	}
}
function A_() {
	m_?.matches(":popover-open") === !0 && (g_ ? m_.setAttribute(c_, "") : m_.hidePopover());
}
//#endregion
//#region src/interactions/owned-popup.ts
function j_(e, t) {
	return e.isConnected && !A(e) && !(t && M(e));
}
var M_ = class {
	options;
	entries = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, new Bg({
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
			isBehind: (e) => Dg(this.entryOf(e)?.opening.owner ?? e),
			onPress: e.onPress,
			onWindowBlur: e.onWindowBlur
		}), (e.closesOnFocusLeave ?? !0) && document.addEventListener("focusout", (e) => this.handleFocusLeave(e), !0), e.closesOnTab !== void 0 && e.closesOnTab !== !1 && P_(this);
	}
	listsAround(e) {
		return [...this.entries.values()].filter(({ opening: t }) => t.popup.contains(e) && B_(this.options.closesOnTab, t)).map(({ opening: e }) => ({
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
		if (!(e.target instanceof Node) || vp() || t instanceof Element && t.hasAttribute("data-ui-pointer-focus")) return;
		if (t instanceof Element) {
			this.leaveFocus(e.target, t);
			return;
		}
		let n = e.target;
		I_(n) && queueMicrotask(() => this.letGo(n));
	}
	leaveFocus(e, t) {
		for (let { opening: n } of [...this.entries.values()]) (n.popup.contains(e) || n.owner.contains(e)) && !this.isInside(n, z_(t)) && !Dg(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
	}
	letGo(e) {
		if (!I_(e)) return;
		let t = Fp(e);
		for (let { opening: n } of [...this.entries.values()]) {
			let r = n.popup.contains(e) || n.owner.contains(e), i = t !== null && n.popup.contains(t) || n.popup.contains(document.activeElement);
			r && !i && j_(n.owner, this.closesWhenReadOnly) && !Dg(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
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
		if (this.close(e.owner), !j_(e.owner, this.closesWhenReadOnly)) return !1;
		(this.options.single ?? !0) && this.closeAll();
		let t = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		return this.entries.set(e.owner, {
			opening: e,
			returnFocus: t
		}), this.options.show(e), this.place(e), V_(e, !0), Z_(this), K_(e), e.focus !== void 0 && e.focus !== !1 && Lp(e.popup, e.focus === !0 ? null : e.focus), !0;
	}
	get closesWhenReadOnly() {
		return this.options.closesWhenReadOnly ?? !0;
	}
	closeAll() {
		for (let e of [...this.entries.keys()]) this.close(e);
	}
	place(e) {
		wh(e.popup) || B_(this.options.sheetOnPhone, e) && Ch() ? __(e.popup, {
			anchor: e.anchor,
			close: () => this.close(e.owner, "escape"),
			trapsTab: !B_(this.options.closesOnTab, e)
		}) : e.anchor !== void 0 && e.placement !== void 0 && bh(e.anchor, e.popup, e.placement);
	}
	reposition(e) {
		let t = this.entries.get(e);
		t !== void 0 && this.place(t.opening);
	}
	close(e = this.current, t) {
		let n = e === null ? void 0 : this.entries.get(e);
		if (e === null || n === void 0) return;
		let { opening: r } = n;
		this.entries.delete(e), q_(r.popup), D_(r.popup), r.popup.contains(document.activeElement) && Kp(r.returnFocus === void 0 ? n.returnFocus : r.returnFocus(), r.popup), this.options.hide(r, t), V_(r, !1), wh(r.popup) ? k_(r.popup) : Mh(r.popup), this.entries.size === 0 && Q_(this);
	}
	closeStranded() {
		for (let [e, { opening: t }] of [...this.entries]) {
			if (j_(e, this.closesWhenReadOnly)) continue;
			let n = document.activeElement, r = n === null || n === document.body || t.popup.contains(n) || e.contains(n);
			this.close(e, "owner"), r && e.isConnected && !L_() && R_(e);
		}
	}
}, N_ = /* @__PURE__ */ new Set();
function P_(e) {
	N_.size === 0 && window.addEventListener("keydown", (e) => {
		e instanceof KeyboardEvent && e.key === "Tab" && !e.defaultPrevented && !N(e) && e.target instanceof Node && F_(e.target);
	}, !0), N_.add(e);
}
function F_(e) {
	let t = [...N_].flatMap((t) => t.listsAround(e).map((e) => ({
		popups: t,
		...e
	})));
	for (let { popups: e, owner: n } of zg(t, () => 0, (e, t) => e.popup.contains(t.popup))) e.close(n, "focus");
}
function I_(e) {
	return e instanceof Element && e.isConnected && ol(e) && typeof document.hasFocus == "function" && document.hasFocus();
}
function L_() {
	let e = document.activeElement;
	return e instanceof Element && e !== document.body && ol(e);
}
function R_(e) {
	Gp(e), B(e);
}
function z_(e) {
	let t = [];
	for (let n = e; n !== null; n = n.parentNode) t.push(n);
	return t;
}
function B_(e, t) {
	return e === !0 || typeof e == "function" && e(t);
}
function V_(e, t) {
	for (let n of e.openers ?? []) n.setAttribute("aria-expanded", t ? "true" : "false");
}
var H_ = /* @__PURE__ */ new Map(), U_ = /* @__PURE__ */ new Set(), W_ = /* @__PURE__ */ new WeakSet(), G_ = [];
function K_(e) {
	let { popup: t } = e;
	H_.set(t, e.owner), !W_.has(t) && (W_.add(t), t.addEventListener("pointerenter", () => {
		H_.has(t) && (U_.add(t), J_());
	}), t.addEventListener("pointerleave", () => {
		U_.delete(t) && J_();
	}));
}
function q_(e) {
	H_.delete(e), U_.delete(e) && J_();
}
function J_() {
	let e = /* @__PURE__ */ new Set();
	for (let t of U_) {
		let n = H_.get(t);
		if (n !== void 0 && n.contains(t)) for (let r = t.parentElement; r !== null && (e.add(r), r !== n); r = r.parentElement);
	}
	for (let t of G_) e.has(t) || t.removeAttribute(ii);
	for (let t of e) t.hasAttribute("data-ui-popup-hover") || t.setAttribute(ii, "");
	G_ = [...e];
}
var Y_ = /* @__PURE__ */ new Set(), X_ = null;
function Z_(e) {
	Y_.add(e), X_ === null && typeof MutationObserver == "function" && (X_ = new MutationObserver(() => {
		for (let e of [...Y_]) e.closeStranded();
	}), X_.observe(document, {
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
function Q_(e) {
	Y_.delete(e), !(Y_.size > 0 || X_ === null) && (X_.disconnect(), X_ = null);
}
//#endregion
//#region src/interactions/flyout-interaction-engine.ts
var $_ = "ui-flyout", ev = "ui-flyout--open", tv = "ui-flyout__anchor", nv = "data-ui-flyout-no-backdrop-close", rv = "data-ui-flyout-no-escape-close", iv = `${$_}--`, av = "bottom-start", ov = class {
	root;
	flyouts = new M_({
		show: ({ owner: e }) => e.classList.add(ev),
		hide: ({ owner: e }, t) => this.markClosed(e, t !== "owner"),
		single: !1,
		closesWhenReadOnly: !1,
		canDismiss: ({ owner: e }, t) => !e.hasAttribute(t === "escape" ? rv : nv)
	});
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${$_}`)) this.place(e);
		H(this.root, `.${$_}`, { attributeFilter: ["class"] }, (e) => {
			for (let t of e) this.place(t);
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	place(e) {
		let t = e.querySelector(`:scope > .${Ti}`), n = e.querySelector(`:scope > .${tv}`);
		if (t === null) return;
		let r = sv(n, t);
		e.classList.contains(ev) ? this.flyouts.open({
			owner: e,
			popup: t,
			anchor: lv(n) ?? e,
			placement: { placement: uv(e) },
			openers: r === null ? [] : [r],
			focus: !vp() || t
		}) || this.markClosed(e) : (this.flyouts.close(e), r?.setAttribute("aria-expanded", "false"));
	}
	markClosed(e, t = !0) {
		e.classList.contains(ev) && (e.classList.remove(ev), cv(e, !1, t));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${tv}`)?.closest(`.${$_}`) ?? null;
		t !== null && (this.flyouts.isOpen(t) ? this.flyouts.close(t) : (t.classList.add(ev), this.place(t), this.flyouts.isOpen(t) && cv(t, !0)));
	}
};
function sv(e, t) {
	if (e === null) return null;
	let n = e.querySelector(tp) ?? e;
	return n.setAttribute("aria-haspopup", "dialog"), n.setAttribute("aria-controls", Qi(t, "ui-flyout-content")), n;
}
function cv(e, t, n = !0) {
	e.dispatchEvent(new Event("toggle", { bubbles: !0 })), n && e.dispatchEvent(new Event(t ? "open" : "close", { bubbles: !0 }));
}
function lv(e) {
	if (e === null) return null;
	let t = e.firstElementChild;
	return t instanceof HTMLElement ? t : e;
}
function uv(e) {
	for (let t of e.classList) {
		if (!t.startsWith(iv)) continue;
		let e = t.slice(iv.length);
		if (lh(e)) return e;
	}
	return av;
}
//#endregion
//#region src/interactions/drag-picture.ts
var dv = "ui-drag-picture", fv = "data-ui-drag-part", pv = ["::before", "::after"], mv = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", hv = /* @__PURE__ */ new Set(/* @__PURE__ */ "src.srcset.sizes.alt.width.height.type.viewbox.preserveaspectratio.href.xlink:href.d.points.cx.cy.r.rx.ry.x.y.x1.y1.x2.y2.fill.stroke.stroke-width.transform".split(".")), gv = null, _v = null;
typeof Image == "function" && yv();
function vv(e, t, n) {
	let r = n.getBoundingClientRect(), i = e.clientX - r.left, a = e.clientY - r.top, o = yv();
	_v?.(), o === null || typeof n.showPopover != "function" ? t.setDragImage(n, i, a) : (t.setDragImage(o, 0, 0), bv(n, r, i, a), setTimeout(() => {
		e.defaultPrevented && _v?.();
	}, 0));
}
function yv() {
	return gv === null && typeof Image == "function" && (gv = new Image(1, 1), gv.src = mv), gv;
}
function bv(e, t, n, r) {
	let i = document.createElement("div"), a = e.cloneNode(!0), o = [];
	i.className = dv, i.setAttribute("popover", "manual"), i.setAttribute("aria-hidden", "true"), i.inert = !0, i.style.width = `${t.width}px`, i.style.height = `${t.height}px`, Sv(e, a, o);
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
	let s = (e) => xv(i, e.clientX - n, e.clientY - r), c = (e) => {
		e.relatedTarget === null && (i.style.visibility = "hidden");
	}, l = () => {
		i.style.visibility = "";
	}, u = () => {
		document.removeEventListener("dragover", s, !0), document.removeEventListener("dragleave", c, !0), document.removeEventListener("dragenter", l, !0), document.removeEventListener("drop", u, !0), document.removeEventListener("dragend", u, !0), e.removeEventListener("dragend", u), i.remove(), _v === u && (_v = null);
	};
	document.addEventListener("dragover", s, !0), document.addEventListener("dragleave", c, !0), document.addEventListener("dragenter", l, !0), document.addEventListener("drop", u, !0), document.addEventListener("dragend", u, !0), e.addEventListener("dragend", u), _v = u, xv(i, t.left, t.top), document.body.append(i), i.showPopover();
}
function xv(e, t, n) {
	e.style.transform = `translate(${t}px, ${n}px)`;
}
function Sv(e, t, n) {
	let r = t.style;
	r !== void 0 && (Ev(getComputedStyle(e), (e, t) => r.setProperty(e, t)), Cv(e, r, "columns"), Cv(e, r, "rows"));
	for (let e of t.getAttributeNames()) e !== "style" && !hv.has(e.toLowerCase()) && t.removeAttribute(e);
	Tv(e, t, n), e instanceof HTMLInputElement && t instanceof HTMLInputElement && (t.value = e.value, t.checked = e.checked);
	for (let r = e.children.length - 1; r >= 0; r--) {
		let i = e.children[r], a = t.children[r];
		i.classList.contains("ui-press-wave") ? a.remove() : Sv(i, a, n);
	}
}
function Cv(e, t, n) {
	t.getPropertyValue(`grid-template-${n}`).startsWith("subgrid") && t.setProperty(`grid-template-${n}`, wv(e, n).join(" "));
}
function wv(e, t) {
	let n = getComputedStyle(e), r = n.getPropertyValue(`grid-template-${t}`);
	if (!r.startsWith("subgrid")) return r.split(/\s+/).filter((e) => /^-?[\d.]+px$/.test(e));
	if (e.parentElement === null) return [];
	let i = wv(e.parentElement, t), a = t === "columns" ? "column" : "row", o = Number.parseInt(n.getPropertyValue(`grid-${a}-start`), 10), s = Number.parseInt(n.getPropertyValue(`grid-${a}-end`), 10), c = Number.isNaN(o) ? 0 : o > 0 ? o - 1 : i.length + o + 1, l = Number.isNaN(s) ? i.length : s > 0 ? s - 1 : i.length + s + 1;
	return i.slice(c, l);
}
function Tv(e, t, n) {
	for (let r of pv) {
		let i = getComputedStyle(e, r);
		if (i.content === void 0 || i.content === "none" || i.content === "normal") continue;
		t.hasAttribute(fv) || t.setAttribute(fv, String(n.length));
		let a = [];
		Ev(i, (e, t) => a.push(`${e}: ${t};`)), n.push(`.${dv} [${fv}="${t.getAttribute(fv)}"]${r} { ${a.join(" ")} }`);
	}
}
function Ev(e, t) {
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		r.startsWith("--") || t(r, e.getPropertyValue(r));
	}
}
//#endregion
//#region src/interactions/drag-marks.ts
var Dv = `:scope > :is(${Uu}, .ui-image-input__surface)`;
function Ov(e, t, n, r, i, a = [], o = "move") {
	kv(t, r), Av(e, i, o), n.classList.add(r);
	for (let e of a) e.classList.add(r);
}
function kv(e, t) {
	for (let n of e.querySelectorAll(`.${t}`)) n.classList.remove(t);
}
function Av(e, t, n) {
	e instanceof DragEvent && e.dataTransfer !== null && (e.dataTransfer.effectAllowed = n, e.dataTransfer.setData("text/plain", t), e.target instanceof HTMLElement && vv(e, e.dataTransfer, e.target));
}
function jv(e, t) {
	return !(e.relatedTarget instanceof Node && t.contains(e.relatedTarget));
}
function Mv(e, t) {
	let n = t && e.querySelector(Dv) !== null;
	e.hasAttribute("data-ui-drop-boxed") !== n && e.toggleAttribute(ge, n);
}
//#endregion
//#region src/interactions/file-drop.ts
var Nv = "data-ui-file-drop-over", Pv = 120, Fv = "refused", Iv = !1;
function Lv(e) {
	let t = {
		marked: /* @__PURE__ */ new Map(),
		leaving: 0
	};
	Vv();
	for (let n of [
		"dragenter",
		"dragover",
		"dragleave",
		"drop"
	]) e.root.addEventListener(n, (n) => Rv(e, t, n), !0);
	e.root.addEventListener("dragend", () => qv(t.marked), !0), window.addEventListener("blur", () => qv(t.marked)), e.root.addEventListener("paste", (t) => zv(e, t), !0);
}
function Rv(e, t, n) {
	if (!(n instanceof DragEvent) || !(n.target instanceof Element)) return;
	let r = t.marked;
	n.type !== "dragleave" && t.leaving !== 0 && (window.clearTimeout(t.leaving), t.leaving = 0);
	let i = e.resolveTarget(n.target);
	if (i === null || !(n.dataTransfer?.types.includes("Files") ?? !1)) {
		i === null && n.type === "dragover" && qv(r);
		return;
	}
	let a = i.mark ?? i.host;
	if (i.refused === !0) {
		Hv(n), n.type !== "dragleave" && qv(r);
		return;
	}
	if (n.type === "dragleave") {
		n.relatedTarget instanceof Node ? a.contains(n.relatedTarget) || Kv(r, a) : t.leaving = window.setTimeout(() => qv(r), Pv);
		return;
	}
	if (n.preventDefault(), n.type !== "drop") {
		let t = Uv(i.accept, n.dataTransfer);
		n.dataTransfer !== null && (n.dataTransfer.dropEffect = t ? "none" : "copy");
		for (let e of r.keys()) e !== a && Kv(r, e);
		let o = i.mark === void 0 ? e.draggingAttribute : Nv;
		r.set(a, o), a.setAttribute(o, t ? Fv : ""), Mv(a, o === Nv);
		return;
	}
	qv(r);
	let o = [...n.dataTransfer?.files ?? []].filter((e) => Jv(i.accept, e));
	o.length !== 0 && e.onFiles(i.host, i.multiple ? o : [o[0]]);
}
function zv(e, t) {
	if (!(t instanceof ClipboardEvent) || !(t.target instanceof Element)) return;
	let n = t.clipboardData;
	if (n === null || n.files.length === 0 || n.getData("text/plain").trim().length > 0) return;
	let r = e.resolveTarget(t.target);
	if (r === null || r.refused === !0) return;
	let i = [...n.files].filter((e) => Jv(r.accept, e));
	i.length !== 0 && (t.preventDefault(), e.onFiles(r.host, r.multiple ? i : [i[0]]));
}
function Bv(e, t, n) {
	for (let r = t.closest(`[${y}]`); r !== null; r = r.parentElement?.closest("[data-ui-id]") ?? null) {
		let t = r.getAttribute("data-ui-id") ?? "", i = [...e.querySelectorAll(`${n}[${Rr}="${Yi(t)}"]`)];
		if (i.length > 0) return {
			field: i.find((e) => r.contains(e)) ?? i[0],
			component: r
		};
	}
	return null;
}
function Vv() {
	if (!Iv) {
		Iv = !0;
		for (let e of ["dragover", "drop"]) window.addEventListener(e, (e) => {
			e instanceof DragEvent && !e.defaultPrevented && (e.dataTransfer?.types.includes("Files") ?? !1) && Hv(e);
		});
	}
}
function Hv(e) {
	e.type !== "dragleave" && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "none"));
}
function Uv(e, t) {
	let n = Wv(e);
	if (t === null || n.length === 0 || n.some((e) => e.startsWith("."))) return !1;
	let r = [...t.items].filter((e) => e.kind === "file").map((e) => e.type.toLowerCase());
	return r.length !== 0 && !r.some((e) => n.some((t) => Gv(t, e)));
}
function Wv(e) {
	return e.split(",").map((e) => e.trim().toLowerCase()).filter((e) => e.length > 0);
}
function Gv(e, t) {
	return e.endsWith("/*") ? t.startsWith(e.slice(0, -1)) : t === e;
}
function Kv(e, t) {
	let n = e.get(t);
	e.delete(t), n !== void 0 && t.removeAttribute(n), Mv(t, !1);
}
function qv(e) {
	for (let t of [...e.keys()]) Kv(e, t);
}
function Jv(e, t) {
	let n = Wv(e);
	if (n.length === 0) return !0;
	let r = t.name.toLowerCase(), i = t.type.toLowerCase();
	return n.some((e) => e.startsWith(".") ? r.endsWith(e) : Gv(e, i));
}
//#endregion
//#region src/rendering/file-glyphs.ts
var Yv = "ne-picture-as-pdf", Xv = "ne-text-snippet", Zv = "ne-description", Qv = "ne-table-chart", $v = "ne-slideshow", ey = "ne-folder-zip", ty = "ne-audio-file", ny = "ne-video-file", ry = "ne-image", iy = "ne-code", ay = "ne-draft", oy = new Map([
	...uy(Yv, "pdf"),
	...uy(Xv, "txt", "md", "log"),
	...uy(Zv, "doc", "docx", "odt", "rtf"),
	...uy(Qv, "xls", "xlsx", "ods", "csv", "tsv"),
	...uy($v, "ppt", "pptx", "odp", "key"),
	...uy(ey, "zip", "rar", "7z", "tar", "gz", "tgz", "bz2", "xz"),
	...uy(ty, "mp3", "wav", "ogg", "oga", "opus", "flac", "m4a", "aac"),
	...uy(ny, "mp4", "m4v", "mov", "avi", "mkv", "webm"),
	...uy(ry, "png", "jpg", "jpeg", "gif", "webp", "avif", "bmp", "svg", "ico", "tif", "tiff", "heic", "heif"),
	...uy(iy, "json", "xml", "yml", "yaml", "html", "htm", "css", "less", "scss", "js", "mjs", "ts", "tsx", "jsx", "cs", "csproj", "sln", "java", "kt", "py", "rb", "php", "go", "rs", "c", "h", "cpp", "hpp", "swift", "sql", "sh", "ps1")
]), sy = /* @__PURE__ */ new Map([
	["application/pdf", Yv],
	["text/csv", Qv],
	["application/msword", Zv],
	["application/rtf", Zv],
	["application/vnd.openxmlformats-officedocument.wordprocessingml.document", Zv],
	["application/vnd.oasis.opendocument.text", Zv],
	["application/vnd.ms-excel", Qv],
	["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", Qv],
	["application/vnd.oasis.opendocument.spreadsheet", Qv],
	["application/vnd.ms-powerpoint", $v],
	["application/vnd.openxmlformats-officedocument.presentationml.presentation", $v],
	["application/vnd.oasis.opendocument.presentation", $v],
	["application/zip", ey],
	["application/x-zip-compressed", ey],
	["application/x-7z-compressed", ey],
	["application/vnd.rar", ey],
	["application/x-rar-compressed", ey],
	["application/x-tar", ey],
	["application/gzip", ey],
	["application/json", iy],
	["application/xml", iy],
	["text/xml", iy],
	["text/html", iy]
]), cy = /* @__PURE__ */ new Map([
	["image", ry],
	["audio", ty],
	["video", ny],
	["text", Xv]
]);
function ly(e, t) {
	let n = e.lastIndexOf("."), r = n < 0 ? void 0 : oy.get(e.slice(n + 1).toLowerCase());
	if (r !== void 0) return r;
	let i = t.split(";", 1)[0].trim().toLowerCase(), a = i.indexOf("/");
	return sy.get(i) ?? (a < 0 ? void 0 : cy.get(i.slice(0, a))) ?? ay;
}
function uy(e, ...t) {
	return t.map((t) => [t, e]);
}
//#endregion
//#region src/rendering/file-tile.ts
var dy = [
	"kilobyte",
	"megabyte",
	"gigabyte"
];
function fy(e, t, n) {
	let r = document.createElement("span"), i = document.createElement("span"), a = document.createElement("span");
	return e.classList.add(Tt), e.setAttribute("title", t.name), e.setAttribute(kt, t.name), py(e, At, t.type.length > 0 ? t.type : null), py(e, jt, t.size === null ? null : String(t.size)), r.className = Et, r.setAttribute("aria-hidden", "true"), i.className = Dt, i.textContent = t.name, a.className = Ot, hy(e, r, a, n), [
		r,
		i,
		a
	];
}
function py(e, t, n) {
	n === null ? e.removeAttribute(t) : e.setAttribute(t, n);
}
function my(e, t) {
	let n = e.querySelector(`:scope > .${Et}`), r = e.querySelector(`:scope > .${Ot}`);
	n !== null && r !== null && hy(e, n, r, t);
}
function hy(e, t, n, r) {
	let i = e.getAttribute(Mt), a = i !== null && bo(i).length > 0 ? i : ly(e.getAttribute("data-ui-file-name") ?? "", e.getAttribute("data-ui-file-type") ?? "");
	(!t.classList.contains(bo(a)) || i !== null) && _o(t, a);
	let o = Number(e.getAttribute("data-ui-file-size") ?? NaN), s = Number.isFinite(o) && o >= 0 ? gy(o, r) : "";
	n.textContent !== s && (n.textContent = s);
}
function gy(e, t) {
	let n = e, r = "byte";
	for (let e of dy) {
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
var _y = "SessionKey", vy = "/_ne/session/key", yy = 1e4, by = new class {
	trade;
	pending = null;
	lastToken = null;
	constructor(e = Sy) {
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
function xy(e, t) {
	for (let n of t ?? []) n.kind === "SessionKey" && e.start(n.token);
}
async function Sy(e) {
	let t = await fetch(vy, {
		method: "POST",
		credentials: "same-origin",
		keepalive: !0,
		cache: "no-store",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ token: e }),
		signal: AbortSignal.timeout(yy)
	});
	if (!t.ok) throw Error(`the session key trade failed with status ${t.status}.`);
}
//#endregion
//#region src/interactions/file-upload.ts
var Cy = "/_ne/files/upload", wy = "/_ne/files/selection/", Ty = "/_ne/files/upload/", Ey = /* @__PURE__ */ new Map(), Dy = !1;
function Oy(e, t, n, r) {
	let i = Number(e.getAttribute(Ir)), a = [], o = [];
	for (let e of t) !Number.isFinite(i) || i <= 0 || e.size <= i ? a.push(e) : o.push(e);
	if (o.length === 0) return Ey.delete(e) && r?.mark(e, null), a;
	if (r === void 0) return s("a chosen file exceeds the input's size limit and was refused.", {
		names: o.map((e) => e.name),
		limit: i
	}), a;
	let c = n ? o.map((e) => e.name).join(", ") : null;
	return Ay(e, {
		validation: r,
		size: () => ky(i, c),
		failed: []
	}), a;
}
function ky(e, t) {
	let n = gy(e, k.language);
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
function Ay(e, t) {
	for (let e of Ey.keys()) e.isConnected || Ey.delete(e);
	Ey.set(e, t), jy(e, t), Ny();
}
function jy(e, t) {
	t.validation.mark(e, "error", My(t));
}
function My(e) {
	let t = e.size?.() ?? null, n = e.failed.length === 0 ? null : {
		key: "ui.file.notuploaded",
		args: { names: e.failed.join(", ") }
	};
	return t === null || n === null ? t ?? n ?? { text: "" } : { text: `${k.translate(t.key, t.args)}\n${k.translate(n.key, n.args)}` };
}
function Ny() {
	Dy || (Dy = !0, k.onChange(() => {
		for (let [e, t] of Ey) e.isConnected ? jy(e, t) : Ey.delete(e);
	}));
}
function Py(e, t, n) {
	if (n === void 0) return;
	let r = Ey.get(e);
	Ay(e, {
		validation: n,
		size: r?.size ?? null,
		failed: [...r?.failed ?? [], t]
	});
}
async function Fy(e, t) {
	let n = [...e];
	return await by.settled(), await Iy(n, t);
}
function Iy(e, t) {
	return new Promise((n, r) => {
		let i = new FormData(), a = performance.now(), o = 0, s = 0;
		for (let t of e) i.append("files", t, t.name), o += t.size, s++;
		let c = new XMLHttpRequest();
		c.open("POST", Cy), c.responseType = "json", c.withCredentials = !0, c.upload.addEventListener("progress", (e) => {
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
async function Ly(e) {
	await by.settled();
	let t = await fetch(`${wy}${encodeURIComponent(e)}`, {
		credentials: "same-origin",
		cache: "no-store"
	});
	if (!t.ok) throw Error(`Reading selection failed with status ${t.status}.`);
	let n = (await t.json())?.files ?? [];
	return n.length === 0 ? null : n;
}
function Ry(e) {
	return `${Ty}${encodeURIComponent(e)}`;
}
var zy = () => {};
function By(e, t) {
	return {
		uploadAsync: (e, n, r) => {
			let i = Fy(e, n ?? zy);
			if (r !== void 0) {
				let e = t.hold(r, {}), n = () => void setTimeout(e, 0);
				i.then(n, n);
			}
			return i;
		},
		accepts: Jv,
		takeWithinSizeLimit: (t, n, r) => Oy(t, n, r, e)
	};
}
function Vy(e, t) {
	e !== null && e.value !== t && (e.value = t, e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/picker-events.ts
var Hy = "ui-open-picker";
function Uy(e) {
	return !e.dispatchEvent(new Event(Hy, {
		bubbles: !0,
		cancelable: !0
	}));
}
function Wy(e, t) {
	if (!(e.target instanceof Element)) return;
	let n = e.target.closest(t.rootSelector);
	if (n === null) return;
	e.preventDefault();
	let r = n.querySelector(t.nativeSelector), i = t.pressed(n);
	r === null || r.disabled || i === null || M(n) || A(i) || r.click();
}
//#endregion
//#region src/interactions/uploads-in-flight.ts
var Gy = class {
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
		for (let r of this.slots.keys()) r.isConnected ? Ky(r) === e && (t.add(r), n = !0) : this.slots.delete(r);
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
function Ky(e) {
	return (e.hasAttribute("data-ui-form-id") ? e : e.querySelector("[data-ui-form-id]"))?.getAttribute("data-ui-form-id") ?? null;
}
var qy = new Gy(), Jy = "ui-file-input", Yy = "ui-file-input__row", Xy = "ui-file-input__native", Zy = "ui-file-input__field", Qy = "ui-file-input__selection", $y = "data-ui-file-dragging", eb = class {
	root;
	validation;
	uploads;
	picks = /* @__PURE__ */ new WeakMap();
	shownWords = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation, this.uploads = e.uploads ?? qy, k.onChange(() => this.rewriteShownWords()), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener(Hy, (e) => Wy(e, {
			rootSelector: `.${Jy}`,
			nativeSelector: `.${Xy}`,
			pressed: (e) => e
		})), this.root.addEventListener("change", (e) => void this.handleSelectionAsync(e), !0), Lv({
			root: this.root,
			draggingAttribute: $y,
			resolveTarget: (e) => {
				let t = e.closest(`.${Yy}`)?.closest(`.${Jy}`) ?? null, n = t === null ? Bv(this.root, e, `.${Jy}`) : null, r = t ?? n?.field ?? null, i = r?.querySelector(`.${Xy}`) ?? null;
				return r === null || i === null ? null : {
					host: r,
					mark: n?.component,
					accept: i.getAttribute("accept") ?? "",
					multiple: i.multiple,
					refused: i.disabled || M(r) || A(r)
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
		let t = e.target.closest(`[${Lr}], .${Yy}`);
		if (t === null || A(t) || M(t) || !t.hasAttribute("data-ui-file-pick") && e.target.closest("button, a") !== null) return;
		let n = t.closest(`.${Jy}`)?.querySelector(`.${Xy}`);
		n == null || n.disabled || n.click();
	}
	async handleSelectionAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Xy)) return;
		let t = e.target.closest(`.${Jy}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && await this.takeFilesAsync(t, n);
	}
	async takeFilesAsync(e, t) {
		let n = e.querySelector(`.${Zy}`);
		if (n === null) return;
		if (t.length === 0) {
			this.show(n, ""), this.publishSelection(e, "");
			return;
		}
		let r = Oy(e, t, e.querySelector(`.${Xy}`)?.multiple === !0, this.validation);
		if (r.length === 0) return;
		let i = (this.picks.get(e) ?? 0) + 1;
		this.picks.set(e, i);
		let a = this.uploads.hold(e);
		try {
			let t = await Fy(r, (t) => {
				this.picks.get(e) === i && this.show(n, () => k.format("ui.file.uploading", { percent: t }));
			});
			if (this.picks.get(e) !== i) return;
			this.show(n, tb(r)), this.publishSelection(e, t.selectionId);
		} catch (t) {
			if (s("file upload failed.", t), this.picks.get(e) !== i) return;
			this.show(n, () => k.text("ui.file.failed")), this.publishSelection(e, "");
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
		Vy(e.querySelector(`.${Qy}`), t);
	}
};
function tb(e) {
	return e.length === 1 ? e[0].name : () => k.format("ui.file.count", { count: e.length });
}
var nb = 1024, rb = 16777216;
function ib(e) {
	return {
		x: e.width / 2,
		y: e.height / 2,
		zoom: 1
	};
}
function ab(e, t) {
	let n = hb(t.zoom, 1, 4), r = mb(e) / n / 2;
	return {
		x: hb(t.x, r, e.width - r),
		y: hb(t.y, r, e.height - r),
		zoom: n
	};
}
function ob(e, t) {
	let n = mb(e) / t.zoom;
	return {
		x: t.x - n / 2,
		y: t.y - n / 2,
		side: n
	};
}
function sb(e, t, n) {
	return t.zoom * n / mb(e);
}
function cb(e, t, n, r, i) {
	let a = sb(e, t, n);
	return a > 0 ? ab(e, {
		x: t.x - r / a,
		y: t.y - i / a,
		zoom: t.zoom
	}) : t;
}
function lb(e, t, n, r, i = {
	x: 0,
	y: 0
}) {
	let a = hb(t.zoom * r, 1, 4), o = sb(e, t, n), s = sb(e, {
		...t,
		zoom: a
	}, n);
	return !(o > 0) || !(s > 0) ? ab(e, {
		...t,
		zoom: a
	}) : ab(e, {
		x: t.x + i.x / o - i.x / s,
		y: t.y + i.y / o - i.y / s,
		zoom: a
	});
}
function ub(e, t) {
	return Math.max(1, Math.min(t, Math.round(e.side)));
}
function db(e, t) {
	return Math.min(1, t * 4 / mb(e), Math.sqrt(rb / (e.width * e.height)));
}
function fb(e) {
	return e === "image/jpeg" || e === "image/png" || e === "image/webp" ? e : "image/png";
}
function pb(e, t, n) {
	if (n === t) return e;
	let r = e.lastIndexOf(".");
	return `${r > 0 ? e.slice(0, r) : e}.${n === "image/jpeg" ? "jpg" : n.slice(n.indexOf("/") + 1)}`;
}
function mb(e) {
	return Math.min(e.width, e.height);
}
function hb(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
//#endregion
//#region src/interactions/page-dialog.ts
function gb(e) {
	let t = document.createElement("div");
	t.className = `ui-dialog ${e.className}`, t.setAttribute(vg, e.key), t.setAttribute(yg, ""), e.closesOnEscapeAndBackdrop && (t.setAttribute(Sg, ""), t.setAttribute(xg, "")), t.setAttribute("hidden", "");
	let n = document.createElement("div");
	n.className = "ui-dialog__backdrop", n.setAttribute(bg, "");
	let r = document.createElement("div");
	return r.className = e.surfaceClassName === void 0 ? wi : `${wi} ${e.surfaceClassName}`, r.setAttribute("role", e.role), r.setAttribute("tabindex", "-1"), r.setAttribute("aria-modal", "true"), r.setAttribute("aria-labelledby", e.labelledBy), e.describedBy !== void 0 && r.setAttribute("aria-describedby", e.describedBy), t.append(n, r), {
		dialog: t,
		surface: r
	};
}
var _b = class {
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
}, vb = 100 / 3, yb = 1, bb = 2;
function xb(e, t = vb) {
	let n = e.deltaMode === yb ? vb : e.deltaMode === bb ? t : 1;
	return {
		x: e.deltaX * n,
		y: e.deltaY * n
	};
}
function Sb(e, t) {
	let n = (Math.sign(e) === Math.sign(t) ? e : 0) + t, r = Math.trunc(n / 100) || 0;
	return {
		steps: r,
		carried: n - r * 100
	};
}
var Cb = {
	notch: 100,
	pixels: xb
}, wb = "ui-image-crop", Tb = "ui-image-crop-title", Eb = new _b("data-ui-image-crop-part"), Db = "data-ui-image-crop-frame", Ob = 10, kb = 1.2, Ab = 380, jb = 100, Mb = .92, U = null, Nb = !1, Pb = null, Fb = !1;
async function Ib(e, t, n, r = Jb) {
	if (U !== null || Nb) return "cancelled";
	Nb = !0;
	let i;
	try {
		i = await r.decodeAsync(t, n.size);
	} finally {
		Nb = !1;
	}
	if (i === null) return "unreadable";
	let a = i;
	return new Promise((i) => {
		Pb ??= Lb();
		let o = Pb;
		o.dialog.isConnected || document.body.append(o.dialog), U = {
			file: t,
			source: a,
			request: n,
			imaging: r,
			view: ib(a),
			finish: (t) => {
				U = null, e.close(wb), a.release(), i(t);
			}
		}, k.write(o.title, null, "ui.crop.title"), k.write(o.stage, "aria-label", "ui.crop.frame"), k.write(o.zoom, "aria-label", "ui.crop.zoom"), k.write(o.cancel, null, "ui.crop.cancel"), k.write(o.apply, null, "ui.crop.apply"), o.stage.setAttribute(Db, n.frame), e.open(wb), Kb(o);
	});
}
function Lb() {
	let { dialog: e, surface: t } = gb({
		key: wb,
		className: "ui-image-crop",
		surfaceClassName: "ui-image-crop__surface",
		role: "dialog",
		labelledBy: Tb,
		closesOnEscapeAndBackdrop: !1
	}), n = Eb.element("h2", "ui-image-crop__title ui-text-type--subtitle");
	n.id = Tb;
	let r = Eb.element("div", "ui-image-crop__stage", "stage");
	r.setAttribute("tabindex", "0"), r.setAttribute("role", "group");
	let i = Eb.element("canvas", "ui-image-crop__canvas"), a = Eb.element("span", "ui-image-crop__frame");
	i.setAttribute("aria-hidden", "true"), a.setAttribute("aria-hidden", "true"), r.append(i, a);
	let o = Eb.element("input", "ui-image-crop__zoom", "zoom");
	o.type = "range", o.min = "1", o.max = "4", o.step = "0.01";
	let s = Eb.button("ui-button--ghost", "cancel"), c = Eb.button("ui-button--primary", "apply");
	t.append(n, r, o, Eb.actions(s, c));
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
		let t = Eb.pressed(e);
		t === "cancel" ? U?.finish("cancelled") : t === "apply" && Rb();
	}), new MutationObserver(() => {
		U !== null && e.hasAttribute("hidden") && U.finish("cancelled");
	}).observe(e, {
		attributes: !0,
		attributeFilter: ["hidden"]
	}), e.addEventListener("keydown", (e) => zb(l, e)), o.addEventListener("input", () => Wb(l, Number(o.value))), r.addEventListener("wheel", (e) => Bb(l, e), { passive: !1 }), window.addEventListener("resize", () => qb(l)), new Yg({
		root: e,
		resolveHandle: (e) => r.contains(e) ? r : null,
		begin: (e, t) => U === null ? null : {
			last: t,
			start: U.view
		},
		move: (e, t, n) => {
			e.last !== null && Vb(l, n.x - e.last.x, n.y - e.last.y), e.last = n;
		},
		end: () => void 0,
		cancel: (e, t) => {
			U !== null && (U.view = t.start, Kb(l));
		},
		pinch: (e, t) => {
			e.last = null, Hb(l, t);
		}
	}), l;
}
async function Rb() {
	let e = U;
	if (e === null) return;
	let { file: t, source: n, request: r, imaging: i, view: a } = e, o = ob(n, a), s = fb(t.type), c = i.encodeAsync(n, o, ub(o, r.size), s);
	U = null;
	let l;
	try {
		l = await c;
	} catch {
		l = null;
	}
	e.finish(l === null ? "unreadable" : new File([l], pb(t.name, t.type, l.type), {
		type: l.type,
		lastModified: t.lastModified
	}));
}
function zb(e, t) {
	if (t.defaultPrevented || N(t) || U === null) return;
	if (t.key === "Escape") {
		t.preventDefault(), U.finish("cancelled");
		return;
	}
	if (t.target !== e.stage || !P(t, { shift: !0 })) return;
	let n = t.shiftKey ? 50 : Ob;
	switch (t.key) {
		case "ArrowLeft":
			Vb(e, -n, 0);
			break;
		case "ArrowRight":
			Vb(e, n, 0);
			break;
		case "ArrowUp":
			Vb(e, 0, -n);
			break;
		case "ArrowDown":
			Vb(e, 0, n);
			break;
		case "+":
		case "=":
			Ub(e, kb);
			break;
		case "-":
		case "_":
			Ub(e, 1 / kb);
			break;
		case "Enter":
			Rb();
			break;
		default: return;
	}
	t.preventDefault();
}
function Bb(e, t) {
	if (U === null) return;
	t.preventDefault();
	let n = xb(t, e.stage.clientHeight), r = t.ctrlKey ? jb : Ab;
	Ub(e, 2 ** (-n.y / r), Gb(e, t.clientX, t.clientY));
}
function Vb(e, t, n) {
	U !== null && (U.view = cb(U.source, U.view, e.frame.clientWidth, t, n), Kb(e));
}
function Hb(e, t) {
	if (U === null) return;
	let n = cb(U.source, U.view, e.frame.clientWidth, t.shift.x, t.shift.y);
	U.view = lb(U.source, n, e.frame.clientWidth, t.factor, Gb(e, t.center.x, t.center.y)), Kb(e);
}
function Ub(e, t, n) {
	U !== null && (U.view = lb(U.source, U.view, e.frame.clientWidth, t, n), Kb(e));
}
function Wb(e, t) {
	U !== null && Number.isFinite(t) && t > 0 && Ub(e, t / U.view.zoom);
}
function Gb(e, t, n) {
	let r = e.stage.getBoundingClientRect();
	return {
		x: t - (r.left + r.width / 2),
		y: n - (r.top + r.height / 2)
	};
}
function Kb(e) {
	if (U === null) return;
	let t = U.view.zoom;
	e.zoom.value = String(t), e.zoom.setAttribute("aria-valuetext", `${Math.round(t * 100)}%`), e.zoom.style.setProperty("--ui-slider-fraction", String((t - 1) / 3)), qb(e);
}
function qb(e) {
	Fb || U === null || (Fb = !0, requestAnimationFrame(() => {
		if (Fb = !1, U === null) return;
		let t = e.frame.clientWidth, n = e.stage.clientWidth, r = e.stage.clientHeight, i = U.view, a = sb(U.source, i, t);
		U.imaging.paint(e.canvas, U.source, {
			left: n / 2 - i.x * a,
			top: r / 2 - i.y * a,
			width: U.source.width * a,
			height: U.source.height * a,
			stageWidth: n,
			stageHeight: r
		});
	}));
}
var Jb = {
	decodeAsync: async (e, t) => {
		let n = await Yb(e);
		if (n === null) return null;
		let r = n, i = db(r, t);
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
		}, r, Mb));
	})
};
async function Yb(e) {
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
var Xb = "ui-image-input", Zb = "ui-image-input--multiple", Qb = "ui-image-input__surface", $b = "ui-image-input__native", ex = "ui-image-input__picture", tx = "ui-image-input__text", nx = "ui-image-input__selection", rx = "ui-image-input__selections", ix = "ui-image-input__tiles", ax = "ui-image-input__tile", ox = "ui-image-input__remove", sx = "ui-image-input__progress", cx = "SelectionId", lx = "--ui-image-progress", ux = "data-ui-image-preview", dx = "data-ui-image-dragging", fx = "data-ui-image-tiles", px = class {
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
		this.root = e.root ?? document, this.validation = e.validation, this.uploads = e.uploads ?? qy, this.propertyPatchEngine = e.propertyPatchEngine, this.dialogs = e.dialogs, this.cropImaging = e.cropImaging, this.applyAll(this.root.querySelectorAll(`.${Xb}`)), H(this.root, `.${Xb}`, {
			childList: !0,
			attributeFilter: [
				Fr,
				$e,
				li
			]
		}, (e) => {
			this.applyAll(e), this.releaseDetached();
		}), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			e.propertyName === cx && (e.value === null || e.value === void 0 || e.value === "") && this.clearAll(Ba(e.components, `.${Xb}`));
		}), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("click", (e) => this.handleRemoveClick(e), !0), this.root.addEventListener("change", (e) => void this.handleNativeChangeAsync(e), !0), this.root.addEventListener(Hy, (e) => Wy(e, {
			rootSelector: `.${Xb}`,
			nativeSelector: `.${$b}`,
			pressed: (e) => e.querySelector(`.${Qb}`)
		})), this.root.addEventListener(Vu, (e) => this.handleDraftDropped(e)), Lv({
			root: this.root,
			draggingAttribute: dx,
			resolveTarget: (e) => {
				let t = e.closest(`.${Qb}`), n = t?.closest(`.${Xb}`) ?? null, r = n === null ? Bv(this.root, e, `.${Xb}`) : null, i = n ?? r?.field ?? null, a = t ?? i?.querySelector(`.${Qb}`) ?? null;
				return i === null || a === null ? null : {
					host: i,
					mark: r?.component,
					accept: i.querySelector(`.${$b}`)?.getAttribute("accept") ?? "",
					multiple: mx(i),
					refused: M(i) || A(a)
				};
			},
			onFiles: (e, t) => void (mx(e) ? this.takeManyAsync(e, t) : this.takeFileAsync(e, t[0]))
		});
	}
	applyAll(e) {
		for (let t of e) mx(t) ? this.reconcileShelf(t) : this.apply(t);
	}
	apply(e) {
		let t = e.querySelector(`.${ex}`);
		if (t === null) return;
		let n = e.getAttribute("data-ui-image-source") ?? "", r = this.previews.has(e);
		if (r && e.dataset.previewFor === n) return;
		let i = r && n.length > 0;
		this.dropPreview(e, i), n.length === 0 ? t.removeAttribute("src") : t.getAttribute("src") !== n && t.setAttribute("src", n), i || Cx(e, e.getAttribute("data-ui-image-caption") ?? Ex(n)), Tx(e, n.length > 0);
	}
	reconcileShelf(e) {
		let t = e.getAttribute(li);
		if (this.seenKeys.get(e) === t) return;
		this.seenKeys.set(e, t);
		let n = this.published.get(e) ?? [], r = e.querySelector(`.${rx}`);
		(r === null || this.propertyPatchEngine?.isHeldTarget(r) !== !0) && (n.length = 0);
		let i = t === null ? -1 : n.indexOf(t);
		if (i >= 0) {
			n.splice(0, i + 1);
			return;
		}
		n.length = 0;
		let a = vx(t);
		if (a === null) return;
		let o = this.shelves.get(e) ?? [];
		for (let t of [...o]) t.selectionId !== null && !a.has(t.selectionId) && this.dropTile(e, t);
		this.restoreTiles(e, o, a);
	}
	restoreTiles(e, t, n) {
		let r = e.querySelector(`.${ix}`);
		if (r === null || n.size === 0) return;
		let i = /* @__PURE__ */ new Map();
		for (let e of t) e.selectionId !== null && i.set(e.selectionId, e);
		let a = [];
		for (let t of n) {
			let n = i.get(t);
			n === void 0 && (n = bx(t), this.fillStoredTileAsync(e, n, t)), a.push(n);
		}
		for (let e of t) e.selectionId === null && a.push(e);
		a.length === t.length && a.every((e, n) => t[n] === e) || (t.splice(0, t.length, ...a), this.shelves.set(e, t), r.replaceChildren(...t.map((e) => e.element)), hx(e, t));
	}
	async fillStoredTileAsync(e, t, n) {
		let r;
		try {
			r = await Ly(n);
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
		xx(t.element, a, i === void 0 ? "" : Ry(i.fileId)), t.element.classList.remove(xi);
	}
	releaseDetached() {
		for (let e of this.holding) if (!e.isConnected) {
			this.holding.delete(e), this.dropPreview(e);
			for (let t of [...this.shelves.get(e) ?? []]) this.dropTile(e, t);
		}
	}
	clearAll(e) {
		for (let t of e) mx(t) || this.previews.get(t)?.landed !== !0 || (t.dataset.previewFor === (t.getAttribute("data-ui-image-source") ?? "") && this.dropPreview(t), this.apply(t));
	}
	handlePickClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Lr}]`), n = t?.closest(`.${Xb}`) ?? null;
		t === null || n === null || M(n) || A(t) || n.querySelector(`.${$b}`)?.click();
	}
	handleRemoveClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${ox}`), n = t?.closest(`.${Xb}`) ?? null;
		if (t === null || n === null || M(n) || A(n)) return;
		e.preventDefault(), e.stopPropagation();
		let r = this.shelves.get(n)?.find((e) => e.element === t.parentElement);
		r !== void 0 && (this.dropTile(n, r), this.publishShelf(n));
	}
	async handleNativeChangeAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains($b)) return;
		let t = e.target.closest(`.${Xb}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && n.length !== 0 && (mx(t) ? await this.takeManyAsync(t, n) : await this.takeFileAsync(t, n[0]));
	}
	handleDraftDropped(e) {
		if (e.target instanceof Element) for (let t of e.target.querySelectorAll(`.${Xb}`)) this.previews.has(t) && (this.dropPreview(t), this.apply(t), Vy(t.querySelector(`.${nx}`), ""));
	}
	async takeFileAsync(e, t) {
		this.releaseDetached();
		let n = e.querySelector(`.${Qb}`), r = e.querySelector(`.${ex}`), i = e.querySelector(`.${nx}`);
		if (n === null || r === null) return;
		let a = await this.cropAsync(e, t);
		if (a === null || Oy(e, [a], !1, this.validation).length === 0) return;
		this.dropPreview(e);
		let o = {
			url: URL.createObjectURL(a),
			landed: !1
		};
		this.previews.set(e, o), this.holding.add(e), e.dataset.previewFor = e.getAttribute("data-ui-image-source") ?? "", e.setAttribute(ux, ""), r.setAttribute("src", o.url), Cx(e, a.name), Tx(e, !0), n.classList.add(xi);
		let c = this.uploads.hold(e);
		try {
			let t = await Fy([a], () => void 0);
			this.previews.get(e) === o && (o.landed = !0, Vy(i, t.selectionId));
		} catch (t) {
			s("picture upload failed.", t), this.previews.get(e) === o && (wx(e), Vy(i, ""));
		} finally {
			c(), (this.previews.get(e) === o || !this.previews.has(e)) && n.classList.remove(xi);
		}
	}
	async cropAsync(e, t) {
		let n = gx(e);
		if (n === null || this.dialogs === void 0) return t;
		if (this.cropping.has(e)) return null;
		this.cropping.add(e);
		try {
			let r = await Ib(this.dialogs, t, {
				frame: n,
				size: _x(e)
			}, this.cropImaging);
			return r === "cancelled" || !e.isConnected ? null : r === "unreadable" ? (this.unreadable.add(e), this.validation?.mark(e, "error", { key: "ui.image.unreadable" }), null) : (this.unreadable.delete(e) && this.validation?.mark(e, null), r);
		} finally {
			this.cropping.delete(e);
		}
	}
	async takeManyAsync(e, t) {
		this.releaseDetached();
		let n = e.querySelector(`.${ix}`), r = Oy(e, t, !0, this.validation);
		if (n === null || r.length === 0) return;
		let i = this.shelves.get(e) ?? [];
		this.shelves.set(e, i), this.holding.add(e);
		let a = r.map(async (t) => {
			let r = yx(t), a = this.uploads.hold(e, r);
			i.push(r), n.appendChild(r.element);
			try {
				let n = await Fy([t], (e) => r.element.style.setProperty(lx, `${e}%`));
				if (!i.includes(r)) return;
				r.selectionId = n.selectionId, r.element.classList.remove(xi), this.publishShelf(e);
			} catch (n) {
				if (s("picture upload failed.", n), !i.includes(r)) return;
				this.dropTile(e, r), Py(e, t.name, this.validation);
			} finally {
				a();
			}
		});
		hx(e, i), await Promise.all(a);
	}
	dropTile(e, t) {
		let n = this.shelves.get(e), r = n?.indexOf(t) ?? -1;
		n !== void 0 && r >= 0 && n.splice(r, 1), this.uploads.forget(e, t), t.url !== null && URL.revokeObjectURL(t.url), t.element.remove(), hx(e, n ?? []);
	}
	publishShelf(e) {
		let t = e.querySelector(`.${rx}`), n = (this.shelves.get(e) ?? []).map((e) => e.selectionId).filter((e) => e !== null), r = JSON.stringify(n);
		if (t === null || t.getAttribute("data-ui-selected-keys") === r) return;
		let i = this.published.get(e) ?? [];
		i.push(r), this.published.set(e, i), t.setAttribute(li, r), this.seenKeys.set(e, r), e.setAttribute(li, r), t.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	dropPreview(e, t = !1) {
		let n = this.previews.get(e);
		n !== void 0 && (this.uploads.forget(e), URL.revokeObjectURL(n.url), this.previews.delete(e), delete e.dataset.previewFor, e.removeAttribute(ux), t || Cx(e, ""));
	}
};
function mx(e) {
	return e.classList.contains(Zb);
}
function hx(e, t) {
	e.hasAttribute(fx) !== t.length > 0 && e.toggleAttribute(fx, t.length > 0);
}
function gx(e) {
	let t = e.getAttribute(et);
	return t === "square" || t === "circle" ? t : null;
}
function _x(e) {
	let t = Number(e.getAttribute(tt));
	return Number.isInteger(t) && t > 0 ? t : nb;
}
function vx(e) {
	if (e === null) return /* @__PURE__ */ new Set();
	let t;
	try {
		t = JSON.parse(e);
	} catch {
		return null;
	}
	return Array.isArray(t) ? new Set(t.filter((e) => typeof e == "string")) : null;
}
function yx(e) {
	let t = document.createElement("span"), n = URL.createObjectURL(e);
	return t.className = `${ax} ${xi}`, xx(t, e, n), {
		element: t,
		url: n,
		selectionId: null
	};
}
function bx(e) {
	let t = document.createElement("span"), n = document.createElement("button"), r = document.createElement("span");
	return t.className = `${ax} ${xi}`, n.type = "button", n.className = ox, r.className = sx, k.write(n, "aria-label", "ui.file.remove"), t.append(n, r), {
		element: t,
		url: null,
		selectionId: e
	};
}
function xx(e, t, n) {
	let r = document.createElement("button"), i = document.createElement("span");
	if (r.type = "button", r.className = ox, i.className = sx, t.type.startsWith("image/")) {
		let a = document.createElement("img");
		a.src = n, a.alt = t.name, k.write(r, "aria-label", "ui.image.remove"), a.addEventListener("error", () => e.replaceChildren(...Sx(e, r, t), r, i), { once: !0 }), e.replaceChildren(a, r, i);
	} else e.replaceChildren(...Sx(e, r, t), r, i);
}
function Sx(e, t, n) {
	return k.write(t, "aria-label", "ui.file.remove"), fy(e, n, k.language);
}
function Cx(e, t) {
	let n = e.querySelector(`.${tx}`);
	n !== null && (Bc(n, null), n.textContent !== t && (n.textContent = t));
}
function wx(e) {
	let t = e.querySelector(`.${tx}`);
	t !== null && k.write(t, null, "ui.file.failed");
}
function Tx(e, t) {
	let n = e.querySelector(`.${Qb}`);
	n !== null && k.write(n, "aria-label", t ? "ui.image.change" : "ui.image.choose");
}
function Ex(e) {
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
var Dx = "ui-key-value-action__value", Ox = "ui-key-value-action--editable", kx = "ui-text__title", Ax = "ui-row-form-", jx = ":scope > :is(.ui-input--filled, .ui-input--tonal, .ui-input--outline, .ui-input--ghost, .ui-input--underline)", Mx = class {
	options;
	root;
	openRows = /* @__PURE__ */ new WeakSet();
	closedRows = /* @__PURE__ */ new WeakSet();
	rowForms = /* @__PURE__ */ new WeakMap();
	formCount = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.handleRows(this.root.querySelectorAll(`.${Tu}`), !1), H(this.root, `.${Tu}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [kr]
		}, (e) => this.handleRows(e, !0)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && Lx(e.target) && e.preventDefault();
		}, !0), (this.root === document ? window : this.root).addEventListener("change", (e) => Ix(e), !0);
	}
	handleRows(e, t) {
		for (let n of e) n.hasAttribute("data-ui-row-editing") ? (this.closedRows.delete(n), this.joinForm(n), Nx(n), this.openRows.has(n) || (this.openRows.add(n), this.open(n, t), this.judge(n))) : this.closedRows.has(n) || (this.openRows.delete(n), this.closedRows.add(n), this.close(n));
	}
	joinForm(e) {
		let t = e.querySelector(`.${Du} button`);
		if (t === null) return;
		let n = this.rowForms.get(e);
		n === void 0 && (n = `${Ax}${++this.formCount}`, this.rowForms.set(e, n));
		for (let t of e.querySelectorAll(`.${Eu} [${Xe}]:not([${sn}])`)) t.setAttribute(sn, n);
		t.setAttribute(vi, n);
	}
	leaveForm(e) {
		let t = this.rowForms.get(e);
		if (t !== void 0) for (let n of e.querySelectorAll(`[${sn}="${t}"], [${vi}="${t}"]`)) n.removeAttribute(sn), n.removeAttribute(vi);
	}
	close(e) {
		this.leaveForm(e);
		for (let t of e.querySelectorAll(`.${Eu} [${Xe}]`)) {
			if (Lu(t)) {
				t.value = "";
				continue;
			}
			let e = this.options.dom.resolveNearestComponent(t, () => !0);
			this.options.propertyPatchEngine.restoreBoundValue(t, e?.dynamicParameters ?? []);
		}
		Hu(e), this.judge(e);
	}
	judge(e) {
		let t = Fx(e);
		for (let n of e.querySelectorAll(`.${Eu} [${Xe}]`)) this.options.validation.judgeShown(n, Lu(n) && n.value.length === 0 ? t : null);
	}
	open(e, t) {
		let n = e.querySelector(`.${Eu} :is(input, textarea, select)`);
		if (n !== null) {
			if (Lu(n) && n.value.length === 0 && n.hasAttribute("data-ui-bind-value")) {
				let t = Fx(e);
				t.length > 0 && (n.value = t, n.dispatchEvent(new Event("change", { bubbles: !0 })));
			}
			t && (n.focus({ preventScroll: !0 }), Iu(n) && n.select());
		}
	}
	handleKeydown(e) {
		if (e.key === "F2" && !e.defaultPrevented && P(e)) {
			Px(e);
			return;
		}
		if (e.defaultPrevented || N(e) || !(e.target instanceof Element) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = ju(e.target);
		if (t === null || e.key === "Enter" && t.cell.classList.contains("ui-key-value-action__edit-action")) return;
		let { cell: n, row: r } = t, i = e.target.closest(ki), a = n.querySelector("[role='listbox']");
		if (i !== null && n.contains(i) || a !== null && a.getClientRects().length > 0 || e.key === "Enter" && e.target instanceof HTMLTextAreaElement) return;
		let o = r.querySelectorAll(`.${Du} button`), s = e.key === "Enter" ? o[0] : o[o.length - 1];
		s !== void 0 && (e.preventDefault(), !A(s) && (e.key === "Enter" && e.target instanceof HTMLInputElement && (e.target.dispatchEvent(new Event("change", { bubbles: !0 })), s.focus({ preventScroll: !0 })), s.click()));
	}
};
function Nx(e) {
	for (let t of e.querySelectorAll(`:scope > .${Eu}`)) {
		let e = t.querySelector(jx) !== null;
		t.hasAttribute("data-ui-boxed-editor") !== e && t.toggleAttribute(Ar, e);
	}
}
function Px(e) {
	let t = e.target instanceof Element ? e.target.closest(`.${Tu}`) : null, n = t === null || t.hasAttribute("data-ui-row-editing") || t.closest(`.${Ox}`) === null ? null : t.querySelector(".ui-key-value-action__action")?.querySelector(tp) ?? null;
	n === null || A(n) || (e.preventDefault(), n.click());
}
function Fx(e) {
	return e.querySelector(`.${Dx} .${kx}`)?.textContent?.trim() ?? "";
}
function Ix(e) {
	if (!e.isTrusted || !(e.target instanceof Element)) return;
	let t = e.target.closest(".ui-key-value-action__value-input")?.closest(".ui-key-value-action__row") ?? null;
	t !== null && !t.hasAttribute("data-ui-row-editing") && e.stopImmediatePropagation();
}
function Lx(e) {
	let t = e.closest(`.${Du} button`), n = t?.closest(`.${Du}`)?.querySelectorAll("button");
	return t !== null && n !== void 0 && n[n.length - 1] === t;
}
var Rx = `.ui-button[${Vt}="pressed"]`, zx = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(Rx);
		t === null || A(t) || t.hasAttribute("data-ui-drawer-pin") || (t.setAttribute("aria-pressed", t.getAttribute("aria-pressed") === "true" ? "false" : "true"), t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, Bx = `${Wu}, [tabindex], [contenteditable], ${ki}, [${Qe}]`, Vx = ":scope > input.ui-field, :scope > textarea.ui-field", Hx = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("pointerdown", (e) => this.handlePointerDown(e));
	}
	handlePointerDown(e) {
		if (e.defaultPrevented || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(Uu);
		if (t === null || e.target !== t && e.target.closest(Bx) !== null) return;
		let n = t.querySelector(Vx);
		if (!Lu(n) || n.readOnly || A(n) || M(n) || (e.preventDefault(), n.focus({ preventScroll: !0 }), n.selectionStart === null)) return;
		let r = n.value.length;
		n.setSelectionRange(r, r);
	}
}, Ux = "data-ui-input-debounce", Wx = `input[${Ux}], textarea[${Ux}]`;
function Gx(e) {
	return (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.matches(Wx);
}
var Kx = /* @__PURE__ */ new Set();
function qx() {
	for (let e of Kx) if (e.waiting) return !0;
	return !1;
}
function Jx() {
	for (let e of Kx) e.commitAll();
}
function Yx(e) {
	for (let t of Kx) t.drop(e);
}
var Xx = class {
	waits = /* @__PURE__ */ new Map();
	composing = /* @__PURE__ */ new WeakSet();
	constructor(e) {
		e.addEventListener("compositionstart", (e) => this.mark(e, !0), !0), e.addEventListener("compositionend", (e) => this.mark(e, !1), !0), Kx.add(this);
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
}, Zx = class {
	root;
	pauses;
	constructor(e = {}) {
		this.root = e.root ?? document, this.pauses = new Xx(this.root), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("compositionend", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleChange(e), !0);
	}
	handleInput(e) {
		let t = e.target;
		if (!Gx(t) || e.isComposing === !0) return;
		let n = Number(t.getAttribute(Ux));
		this.pauses.wait(t, Number.isFinite(n) && n >= 0 ? n : 0, () => t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	handleChange(e) {
		Gx(e.target) && this.pauses.drop(e.target);
	}
}, Qx = "data-ui-submit-on-enter", $x = "data-ui-runs-on-enter", eS = "enter", tS = "escape", nS = {
	name: eS,
	registration: { settlesValue: !0 }
}, rS = "ui-commit-in-place", iS = class {
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
		}, !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), this.root.addEventListener(rS, (e) => {
			(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) && this.commitInPlace(e.target);
		}), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = this.focusedField;
			t !== null && !(e.local && this.edited.has(t)) && e.components.some((e) => e.contains(t)) && (this.lastCommitted = t.value);
		});
	}
	handleKeydown(e) {
		if (e.defaultPrevented || N(e) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = e.target;
		t instanceof HTMLTextAreaElement ? e.key === "Escape" ? (e.preventDefault(), Au(t) ? this.runEscape(t, e) : this.leave(t)) : aS(t, e) ? (e.preventDefault(), this.runEnter(t, e)) : oS(t, e) && (e.preventDefault(), this.commitInPlace(t), this.submitForm(t)) : Iu(t) && (e.preventDefault(), aS(t, e) ? this.runEnter(t, e) : e.key === "Escape" && Au(t) ? this.runEscape(t, e) : (this.leave(t), e.key === "Enter" && this.submitForm(t)));
	}
	runEnter(e, t) {
		t.repeat || e.readOnly || A(e) || (this.commitInPlace(e), e.dispatchEvent(new Event(eS, { bubbles: !0 })));
	}
	runEscape(e, t) {
		if (t.repeat) return;
		Yx(e), this.edited.delete(e), e === this.focusedField && e.value !== this.lastCommitted && this.putBack(e, this.lastCommitted);
		let n = Fp(e);
		e.blur(), Ip(e, n), e.dispatchEvent(new Event(tS, { bubbles: !0 }));
	}
	putBack(e, t) {
		this.propertyPatchEngine?.writeBoundValue(e, t), e.value !== t && (e.value = t);
	}
	submitForm(e) {
		let t = e.getAttribute(sn);
		if (t === null || t.length === 0) return;
		let n = this.root.querySelector(`[${vi}="${Yi(t)}"]`);
		n !== null && !A(n) && n.click();
	}
	leave(e) {
		let t = this.changes, n = Fp(e);
		e.blur(), this.changes === t && this.commit(e), Ip(e, n);
	}
	commit(e) {
		e.value !== this.committedValue && e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	commitInPlace(e) {
		this.edited.has(e) ? e.dispatchEvent(new Event("change", { bubbles: !0 })) : this.commit(e);
	}
};
function aS(e, t) {
	return sS(t) && e.hasAttribute($x);
}
function oS(e, t) {
	return sS(t) && e.hasAttribute(Qx) && !e.readOnly && !A(e);
}
function sS(e) {
	return e.key === "Enter" && P(e);
}
//#endregion
//#region src/updates/icon-stand-in.ts
var cS = "icon-stand-in", lS = ".ui-icon.ui-icon--circle", uS = "ne-person", dS = "ui-icon--circle", fS = "ui-icon--image", pS = "ui-icon-stand-in", mS = `:scope > .${pS}`, hS = "missing", gS = "failed", _S = 512, vS = /* @__PURE__ */ new Map(), yS = /* @__PURE__ */ new Map();
function bS(e) {
	let t = e.getAttribute(ct), n = xS(e);
	return n === null ? e.removeAttribute(ct) : t !== n && e.setAttribute(ct, n), TS(e, n !== null), n === hS ? "show" : t === hS ? "release" : "keep";
}
function xS(e) {
	if (!e.classList.contains(dS)) return null;
	if (!e.className.split(" ").some(yo)) return hS;
	let t = e.classList.contains(fS) ? SS(e) : null;
	if (t === null) return null;
	let n = vS.get(t);
	return n === void 0 || !n.loaded && Date.now() - n.at >= 3e4 ? (CS(t, e), n === void 0 ? null : gS) : n.loaded ? null : gS;
}
function SS(e) {
	let t = e.style.getPropertyValue(go).trim();
	return t.startsWith("url(\"") && t.endsWith("\")") ? t.slice(5, -2) : null;
}
function CS(e, t) {
	let n = yS.get(e);
	if (n !== void 0) {
		n.add(t);
		return;
	}
	yS.set(e, /* @__PURE__ */ new Set([t]));
	let r = new Image();
	r.addEventListener("load", () => wS(e, !0)), r.addEventListener("error", () => wS(e, !1)), r.src = e;
}
function wS(e, t) {
	let n = yS.get(e);
	vS.delete(e), vS.set(e, {
		loaded: t,
		at: Date.now()
	}), yS.delete(e), vS.size > _S && vS.delete(vS.keys().next().value);
	for (let e of n ?? []) bS(e);
}
function TS(e, t) {
	let n = e.querySelector(mS);
	if (!t) {
		n?.remove();
		return;
	}
	let r = e.getAttribute(ot), i = r !== null && bo(r).length > 0 ? r : uS;
	if (n === null) n = document.createElement("span"), n.setAttribute("aria-hidden", "true"), e.appendChild(n);
	else if (n.classList.contains(bo(i))) return;
	_o(n, i), n.classList.add(pS);
}
//#endregion
//#region src/interactions/image-fallback-engine.ts
var ES = `.${nt}`, DS = `img.${rt}`, OS = `:scope > ${DS}`, kS = "%238c8c8c", AS = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='-12 -12 48 48'%3E%3Crect x='3' y='3' width='18' height='18' rx='3' fill='none' stroke='${kS}' stroke-width='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.75' fill='${kS}'/%3E%3Cpath d='M4 18l5-6 4 4.5 3-3 4 4.5' fill='none' stroke='${kS}' stroke-width='2' stroke-linejoin='round'/%3E%3C/svg%3E`, jS = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'/%3E", MS = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("error", (e) => this.handleError(e), !0);
		for (let e of this.root.querySelectorAll(DS)) (FS(e) || e.complete && e.naturalWidth === 0) && LS(e);
		for (let e of this.root.querySelectorAll(lS)) bS(e);
		H(this.root, `${ES}, ${lS}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: ["src", "class"],
			relevant: NS
		}, (e) => {
			for (let t of e) t.classList.contains("ui-image") ? PS(t) : bS(t);
		});
	}
	handleError(e) {
		let t = e.target;
		t instanceof HTMLImageElement && t.matches(DS) && LS(t);
	}
};
function NS(e) {
	if (e.type === "childList") return !0;
	let t = e.target;
	return t instanceof Element && (e.attributeName === "src" ? t.matches(DS) : t.matches(ES));
}
function PS(e) {
	let t = e.querySelector(OS);
	t !== null && (e.hasAttribute("data-ui-image-failed") && (IS(t) ? t.getAttribute("src") !== zS(e) && RS(e, t) : (e.removeAttribute(st), TS(e, !1))), FS(t) && LS(t));
}
function FS(e) {
	let t = e.getAttribute("src");
	return t === null || t.trim().length === 0;
}
function IS(e) {
	let t = e.getAttribute("src");
	return t === AS || t === jS;
}
function LS(e) {
	if (IS(e)) return;
	let t = e.getAttribute(at);
	if (t !== null && t.length > 0 && e.getAttribute("src") !== t) {
		e.setAttribute("src", t);
		return;
	}
	let n = e.parentElement;
	n !== null && n.classList.contains("ui-image") && (n.setAttribute(st, ""), RS(n, e));
}
function RS(e, t) {
	t.setAttribute("src", zS(e)), TS(e, e.classList.contains(it));
}
function zS(e) {
	return e.classList.contains("ui-image--circle") ? jS : AS;
}
//#endregion
//#region src/items/radio-row-decorator.ts
var BS = "ui-radio-group__input", VS = "ui-radio-group__dot", HS = {
	kind: "radio",
	decorate: US
};
function US(e) {
	let t = document.createElement("input");
	t.className = BS, t.type = "radio", t.value = e.key;
	let n = document.createElement("span");
	n.className = VS, e.row.prepend(t, n);
}
//#endregion
//#region src/interactions/radio-group-sync-engine.ts
var WS = "data-ui-radio-value", GS = "ui-radio-group", KS = "ui-radio-group__item", qS = "data-ui-radio-group-name", JS = "data-ui-radio-bind-value-id", YS = class {
	root;
	renamed = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.claimGroupNames([...this.root.querySelectorAll(`.${GS}`)]);
		for (let e of this.root.querySelectorAll(`.${GS}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = [];
			for (let n of e) if (n.type === "attributes" && n.target instanceof HTMLElement) this.sync(n.target.closest(`.${GS}`));
			else if (!ug(n)) for (let e of n.addedNodes) e instanceof HTMLElement && t.push(e);
			this.claimGroupNames(t.flatMap(XS));
			for (let e of new Set(t.map((e) => e.closest(`.${GS}`)))) this.sync(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: [WS, "class"],
			childList: !0,
			subtree: !0
		});
	}
	claimGroupNames(e) {
		if (e.length === 0) return;
		let t = /* @__PURE__ */ new Map();
		for (let e of this.root.querySelectorAll(`.${GS}`)) {
			let n = e.getAttribute(qS);
			n !== null && t.set(n, (t.get(n) ?? 0) + 1);
		}
		let n = /* @__PURE__ */ new Set();
		for (let r of e) {
			let e = r.getAttribute(qS), i = e === null ? 0 : t.get(e) ?? 0;
			if (e === null || i < 2) continue;
			t.set(e, i - 1), n.add(e);
			let a = `${e}-${++this.renamed}`;
			r.setAttribute(qS, a);
			for (let e of bd(r, `.${BS}`, `.${GS}`)) e.name = a;
			this.sync(r);
		}
		if (n.size !== 0) for (let e of this.root.querySelectorAll(`.${GS}`)) n.has(e.getAttribute(qS) ?? "") && this.sync(e);
	}
	sync(e) {
		if (e === null) return;
		let t = e.getAttribute(WS), n = e.getAttribute(qS), r = e.getAttribute(JS);
		for (let i of bd(e, `.${BS}`, `.${GS}`)) {
			n !== null && i.name !== n && (i.name = n), r !== null && i.getAttribute("data-ui-bind-value") !== r && i.setAttribute(Xe, r), i.checked = i.value === t;
			let e = ZS(i);
			i.disabled !== e && (i.disabled = e);
		}
	}
};
function XS(e) {
	return e.classList.contains(GS) ? [e] : [...e.querySelectorAll(`.${GS}`)];
}
function ZS(e) {
	let t = e.closest(`.${KS}`);
	return t !== null && j(t);
}
//#endregion
//#region src/rendering/color-bytes.ts
function QS(e) {
	return Number.isFinite(e) ? Math.min(255, Math.max(0, Math.round(e))) : 0;
}
function $S(e) {
	return QS(e).toString(16).padStart(2, "0").toUpperCase();
}
function eC(e, t, n, r) {
	let i = r / 255, a = (e) => Math.round(e * i + 255 * (1 - i));
	return (tC(a(e), a(t), a(n)) + .05) ** 2 > 1.05 * .05 ? "var(--ui-color-on-light)" : "var(--ui-color-on-dark)";
}
function tC(e, t, n) {
	return .2126 * nC(e) + .7152 * nC(t) + .0722 * nC(n);
}
function nC(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
//#endregion
//#region src/rendering/web-dom-converters.ts
var rC = "inlineMarkupPlainText", iC = /* @__PURE__ */ new Map([
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
]), aC = [
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
function oC(e) {
	return G(e, aC);
}
var sC = [
	"small",
	"medium",
	"large"
], cC = ["default", "circle"], lC = [
	"display",
	"title",
	"subtitle",
	"body",
	"caption",
	"overline"
], uC = [
	"start",
	"center",
	"end",
	"justify"
], dC = ["nowrap", "wrap"], fC = /* @__PURE__ */ new Map([
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
]), pC = /* @__PURE__ */ new Map([
	["primary", "--ui-color-primary-ink"],
	["accent", "--ui-color-accent-ink"],
	["info", "--ui-color-info-ink"],
	["warning", "--ui-color-warning-ink"],
	["success", "--ui-color-success-ink"],
	["danger", "--ui-color-danger-ink"]
]), mC = /* @__PURE__ */ new Map([
	["primary", "--ui-color-on-primary"],
	["accent", "--ui-color-on-accent"],
	["info", "--ui-color-on-info"],
	["warning", "--ui-color-on-warning"],
	["success", "--ui-color-on-success"],
	["danger", "--ui-color-on-danger"],
	["muted", "--ui-color-surface"]
]), hC = ["inline", "trailing"], gC = [
	"none",
	"left",
	"top",
	"right",
	"bottom"
], _C = [
	"filled",
	"outline",
	"underline",
	"ghost",
	"tonal"
], vC = [
	"small",
	"medium",
	"large"
], yC = [
	"small",
	"medium",
	"large"
], bC = [
	"primary",
	"accent",
	"danger",
	"outline",
	"ghost",
	"link",
	"surface"
], xC = [
	"primary",
	"accent",
	"info",
	"warning",
	"success",
	"danger",
	"surface",
	"plain"
], SC = [
	"filled",
	"tinted",
	"outline"
], CC = ["light", "dark"], wC = [
	"start",
	"center",
	"end",
	"stretch"
], TC = ["clip", "visible"], EC = [
	"visible",
	"hidden",
	"collapsed"
], DC = [
	"background",
	"raised",
	"tinted",
	"flat"
], OC = ["horizontal", "vertical"], kC = [
	"none",
	"gap",
	"rule"
], AC = [
	"none",
	"one",
	"many"
], jC = [
	"none",
	"left",
	"right",
	"top",
	"bottom"
], MC = ["stack", "wrap"], NC = ["end", "start"], PC = [
	"disabled",
	"auto",
	"always"
], FC = [
	"disabled",
	"proximity",
	"mandatory"
], IC = [
	"text",
	"email",
	"password",
	"search",
	"tel",
	"url"
], LC = [
	"text",
	"numeric",
	"decimal",
	"tel",
	"email",
	"url",
	"search"
], RC = ["hex", "rgb"], zC = ["field", "swatch"], BC = [
	"fill",
	"contain",
	"cover",
	"none"
], VC = [
	"100% 100%",
	"contain",
	"cover",
	"auto"
], HC = ["default", "circle"], UC = ["card", "quiet"], WC = ["uniform", "vignette"], GC = ["linear", "circular"], KC = [
	"none",
	"vertical",
	"horizontal",
	"both"
], qC = [
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
], JC = [
	"None",
	"Shade",
	"Tint"
], YC = /* @__PURE__ */ new Map();
function XC(e) {
	return YC.get(e);
}
function W(e, t, n) {
	return $C(e, ZC(t, n), (e) => `${t}${G(e, n)}`);
}
function ZC(e, t) {
	return QC(t.map((t) => `${e}${t}`));
}
function QC(e) {
	let t = new Set(e);
	return (e) => t.has(e);
}
function $C(e, t, n) {
	return YC.set(e, t), [e, n];
}
function ew(e, t, n) {
	return $m.map((r) => [`${e}${r[0].toUpperCase()}${r.slice(1)}${t}`, (e) => n(e, r)]);
}
var tw = new Map([
	W("colorClass", "ui-color--", aC),
	$C("themeColorClass", ZC("ui-color--", aC), (e) => Bw(e)),
	$C("iconClass", yo, (e) => bo(e)),
	["iconUrlCss", (e) => fo(e)],
	["safeUrl", (e) => Za(e)],
	["safeImageSource", (e) => oo(e)],
	[rC, (e) => e == null ? void 0 : No(String(e))],
	["ariaBooleanAttribute", (e) => e === !0 ? "true" : "false"],
	["placeholderText", (e) => typeof e == "string" && e.length > 0 ? e : " "],
	W("iconSizeClass", "ui-icon-size--", sC),
	$C("iconShapeClass", QC(["ui-icon--circle"]), (e) => G(e, cC) === "circle" ? "ui-icon--circle" : ""),
	W("textTypeClass", "ui-text-type--", lC),
	$C("textAppearanceClass", ZC("ui-text-type--", lC), (e) => Xw(e, "ui-text-type--")),
	$C("textDescriptionTypeClass", ZC("ui-text--description-", lC), (e) => Xw(e, "ui-text--description-")),
	W("textAlignmentClass", "ui-text--align-", uC),
	W("textWrapClass", "ui-text--", dC),
	W("buttonAlignmentClass", "ui-button--align-", uC),
	W("textBadgePlacementHostClass", "ui-text--badge-", hC),
	W("badgeStyleClass", "ui-badge-style--", xC),
	W("badgeFillClass", "ui-badge-fill--", SC),
	$C("badgeColoredClass", QC(["ui-badge--colored"]), (e) => jw(e).length > 0 ? "ui-badge--colored" : ""),
	["badgeTextFit", (e) => Vw(e)],
	W("buttonClass", "ui-button--", bC),
	W("surfaceStyleClass", "ui-surface--", DC),
	W("orientationClass", "ui-orientation--", OC),
	W("groupSeparatorClass", "ui-command-bar--separator-", kC),
	["selectionModeAttribute", (e) => G(e, AC)],
	["selectionBackgroundCss", (e) => jw(Ow(e, "background"))],
	["selectionForegroundCss", (e) => jw(Ow(e, "foreground"))],
	["selectionMarkColorCss", (e) => jw(Ow(e, "markColor"))],
	["selectionMarkCss", (e) => Aw(Ow(e, "mark"))],
	["selectionFontWeightCss", (e) => kw(Ow(e, "bold"))],
	["selectionActionBarBackgroundCss", (e) => jw(Ow(e, "actionBarBackground"))],
	W("itemsViewLayoutClass", "ui-items-view--", MC),
	W("dragHandlePlacementClass", "ui-drag-handle--", NC),
	W("scrollXClass", "ui-scroll-x--", PC),
	W("scrollYClass", "ui-scroll-y--", PC),
	["hostViewport", (e) => gw(e)],
	W("scrollSnapClass", "ui-scroll-snap--", FC),
	W("inputAppearanceClass", "ui-input--", _C),
	W("inputSizeClass", "ui-input--", yC),
	W("buttonSizeClass", "ui-button--", vC),
	W("buttonGroupSizeClass", "ui-button-group--", vC),
	["textInputTypeAttribute", (e) => G(e, IC)],
	["inputModeAttribute", (e) => G(e, LC)],
	["colorTextFormatAttribute", (e) => G(e, RC)],
	["colorInputVariantAttribute", (e) => G(e, zC)],
	["themeNameCss", (e) => G(e, CC)],
	["alignmentCss", (e) => G(e, wC)],
	["alignmentStretchFallbackCss", (e) => G(e, wC) === "stretch" ? "start" : ""],
	["overflowCss", (e) => G(e, TC)],
	["layoutLengthCss", (e) => _w(e)],
	["thicknessCss", (e) => bw(e)],
	$C("borderEdgeClass", ZC("ui-border--", gC), (e) => {
		let t = Cw(e);
		return t === void 0 ? "" : `ui-border--${t}`;
	}),
	["radiusCss", (e) => ww(e)],
	["gridUnitCss", (e) => Tw(e)],
	["pixelsCss", (e) => oT(e)],
	["gridTemplateCss", (e) => Ew(e)],
	["colorVariantCss", (e) => eT(e)],
	["themeColorCss", (e) => jw(e)],
	["themeInkCss", (e) => Nw(e)],
	["roleInkCss", (e) => Pw(e)],
	["themeOnColorCss", (e) => Iw(e)],
	["themeGroundCss", (e) => Lw(e)],
	["themeColorInlineCss", (e) => Mw(e) ? "" : jw(e)],
	["themeColorCanonical", (e) => Qw(e)],
	["textAppearanceFontSizeCss", (e) => Zw(e, "size")],
	["textAppearanceFontWeightCss", (e) => Zw(e, "weight")],
	["textAppearanceLineHeightCss", (e) => Zw(e, "lineHeight")],
	["textAppearanceLetterSpacingCss", (e) => Zw(e, "letterSpacing")],
	...ew("responsiveLayoutLength", "Css", (e, t) => _w(ah(e, t))),
	...ew("responsiveWidth", "Css", (e, t) => vw(ah(e, t), "horizontal")),
	...ew("responsiveHeight", "Css", (e, t) => vw(ah(e, t), "vertical")),
	...ew("responsiveThickness", "Css", (e, t) => bw(ah(e, t))),
	...ew("responsivePadding", "Css", (e, t) => xw(ah(e, t))),
	...ew("responsiveThicknessHorizontal", "Css", (e, t) => Sw(ah(e, t), "horizontal")),
	...ew("responsiveThicknessVertical", "Css", (e, t) => Sw(ah(e, t), "vertical")),
	...ew("responsiveRadius", "Css", (e, t) => ww(ah(e, t))),
	...ew("responsivePixels", "Css", (e, t) => sT(ah(e, t))),
	...ew("visibility", "Attribute", (e, t) => cT(e, t)),
	...ew("gridPlacement", "ColumnCss", (e, t) => Dw(ah(e, t), "column")),
	...ew("gridPlacement", "RowCss", (e, t) => Dw(ah(e, t), "row")),
	...ew("gridPlacement", "ColumnSpanCss", (e, t) => Dw(ah(e, t), "columnSpan")),
	...ew("gridPlacement", "RowSpanCss", (e, t) => Dw(ah(e, t), "rowSpan")),
	W("imageFitClass", "ui-image-fit--", BC),
	$C("expanderVariantClass", QC(["ui-expander--quiet"]), (e) => G(e, UC) === "quiet" ? "ui-expander--quiet" : ""),
	$C("imageShapeClass", QC(["ui-image--circle"]), (e) => G(e, HC) === "circle" ? "ui-image--circle" : ""),
	["backgroundImageCss", (e) => ow(e)],
	["backgroundImageAttribute", (e) => ow(e).length === 0 ? void 0 : ""],
	["imageFitSizeCss", (e) => G(e, VC)],
	["backgroundImageDimCss", (e) => sw(e)],
	["backgroundImageDimModeAttribute", (e) => G(e, WC) === "vignette" ? "vignette" : void 0],
	["backgroundImageBlurCss", (e) => dw(e) ? `${Number(e)}px` : ""],
	["backgroundImageBlurAttribute", (e) => dw(e) ? "" : void 0],
	["positiveCount", (e) => cw(e)?.toString()],
	["nonNegativeCount", (e) => lw(e, (e) => e >= 0)?.toString()],
	["nonZeroCount", (e) => lw(e, (e) => e !== 0)?.toString()],
	["positiveNumber", (e) => uw(e, (e) => e > 0)?.toString()],
	["nonNegativeNumber", (e) => uw(e, (e) => e >= 0)?.toString()],
	["share", (e) => uw(e, (e) => e >= 0 && e <= 1)?.toString()],
	["positiveFlagAttribute", (e) => cw(e) === void 0 ? void 0 : ""],
	$C("maxLinesClass", QC(["ui-text--max-lines"]), (e) => cw(e) === void 0 ? "" : "ui-text--max-lines"),
	$C("textAreaGrowClass", QC(["ui-text-area--grow"]), (e) => cw(e) === void 0 ? "" : "ui-text-area--grow"),
	W("progressVariantClass", "ui-progress--", GC),
	["progressValueText", (e) => aT(e)],
	["textAreaResizeCss", (e) => G(e, KC)],
	W("flyoutPlacementClass", "ui-flyout--", qC),
	["popupPlacementAttribute", (e) => G(e, qC)],
	["tabMenuEntriesAttribute", (e) => iw(e)],
	["markedDaysAttribute", (e) => aw(e)]
]);
function nw(e) {
	let t = tw.get("surfaceStyleClass");
	return DC.find((n, r) => e.classList.contains(t?.(r) ?? "")) ?? null;
}
var rw = [
	["rename", 1],
	["pin", 2],
	["close", 4],
	["delete", 8]
];
function iw(e) {
	let t = typeof e == "string" ? e.split(",").map((e) => e.trim().toLowerCase()) : null, n = typeof e == "number" ? e : 0, r = rw.filter(([e, r]) => t === null ? (n & r) !== 0 : t.includes(e)).map(([e]) => e);
	return r.length === 0 ? void 0 : r.join(" ");
}
function aw(e) {
	let t = Array.isArray(e) ? e.filter((e) => typeof e == "string" && e.length > 0).map((e) => e.slice(0, 10)) : [];
	return t.length === 0 ? void 0 : [...new Set(t)].sort().join(" ");
}
function ow(e) {
	return fo(e);
}
function sw(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isNaN(t) ? "" : String(Math.min(1, Math.max(0, t)));
}
function cw(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isInteger(t) && t > 0 ? t : void 0;
}
function lw(e, t) {
	let n = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isInteger(n) && t(n) ? n : void 0;
}
function uw(e, t) {
	let n = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isFinite(n) && t(n) ? n : void 0;
}
function dw(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isFinite(t) && t > 0;
}
var fw = [
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
], pw = new Map(fw.map(([, e, t, n, r]) => [e, [
	t,
	n,
	r
]])), mw = new Map(fw.map(([e, t]) => [e, t])), hw = /* @__PURE__ */ new Map([[TC, /* @__PURE__ */ new Map([["Hidden", "clip"]])], [VC, /* @__PURE__ */ new Map([["Fill", "100% 100%"], ["None", "auto"]])]]);
function G(e, t) {
	return typeof e == "string" ? (t === void 0 ? void 0 : hw.get(t)?.get(e)) ?? iC.get(e) ?? Xi(e) : typeof e == "number" && t !== void 0 ? t[e] ?? String(e) : String(e ?? "");
}
function gw(e) {
	return e == null || G(e, PC) === "disabled" ? void 0 : "parent";
}
function _w(e) {
	if (e == null) return "";
	if (typeof e == "number") return oT(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.kind, r = t.value ?? 0;
	return n === "Auto" || n === 0 ? "" : n === "Absolute" || n === 1 ? oT(r) : n === "Fill" || n === 2 ? "100%" : "";
}
function vw(e, t) {
	if (typeof e != "object" || !e) return _w(e);
	let n = e.kind;
	return n !== "Fill" && n !== 2 ? _w(e) : t === "horizontal" ? "var(--ui-fill-width, 100%)" : "var(--ui-fill-height, 100%)";
}
function yw(e) {
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
function bw(e) {
	if (e == null) return "";
	let t = yw(e);
	return t === void 0 ? String(e) : `${t.top}px ${t.right}px ${t.bottom}px ${t.left}px`;
}
function xw(e) {
	let t = e == null ? void 0 : yw(e);
	return t === void 0 ? "" : `${t.top}px max(${t.right}px, var(--ui-scroll-room-right), var(--ui-scroll-cap)) max(${t.bottom}px, var(--ui-scroll-room-x)) max(${t.left}px, var(--ui-scroll-room-left), var(--ui-scroll-cap))`;
}
function Sw(e, t) {
	let n = yw(e);
	return n === void 0 ? "" : oT(t === "horizontal" ? n.left + n.right : n.top + n.bottom);
}
function Cw(e) {
	if (e == null) return;
	if (typeof e == "object" && "base" in e) {
		let t = $m.map((t) => ah(e, t)).filter((e) => e != null), n = new Set(t.map((e) => Cw(e)));
		return n.size === 0 ? "none" : n.size === 1 ? [...n][0] : void 0;
	}
	let t = yw(e);
	if (t === void 0) return;
	let { top: n, right: r, bottom: i, left: a } = t;
	return n === 0 && r === 0 && i === 0 && a === 0 ? "none" : n === 0 && r === 0 && i === 0 ? "left" : a === 0 && r === 0 && i === 0 ? "top" : a === 0 && n === 0 && i === 0 ? "right" : a === 0 && n === 0 && r === 0 ? "bottom" : void 0;
}
function ww(e) {
	if (e == null) return "";
	if (typeof e == "number") return oT(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.topLeft ?? 0, r = t.topRight ?? 0, i = t.bottomRight ?? 0, a = t.bottomLeft ?? 0;
	return n === r && n === i && n === a ? oT(n) : `${n}px ${r}px ${i}px ${a}px`;
}
function Tw(e) {
	if (e == null) return "";
	if (typeof e == "number") return e <= 0 ? "minmax(0, 1fr)" : `minmax(0, ${e}fr)`;
	if (typeof e != "object") return String(e);
	let t = e, n = t.unit, r = t.value ?? 1, i = t.minValue, a = t.maxValue;
	if (n === "Absolute" || n === 1) return oT(r);
	if (n === "Star" || n === 0) {
		let e = i != null && i > 0 ? `${i}px` : "0";
		return r <= 0 ? `minmax(${e}, 1fr)` : `minmax(${e}, ${r}fr)`;
	}
	return n === "Auto" || n === 2 ? i == null ? a == null ? "auto" : `fit-content(${a}px)` : `minmax(${i}px, auto)` : "";
}
function Ew(e) {
	if (e == null) return "";
	if (!Array.isArray(e)) return Tw(e);
	if (e.length === 0) return "none";
	if (e.length === 1) return Tw(e[0]);
	let t = JSON.stringify(e[0]);
	return e.every((e) => JSON.stringify(e) === t) ? `repeat(${e.length}, ${Tw(e[0])})` : e.map((e) => Tw(e)).join(" ");
}
function Dw(e, t) {
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
function Ow(e, t) {
	return typeof e != "object" || !e ? null : e[t] ?? null;
}
function kw(e) {
	return e == null ? "" : e === !0 ? "600" : "400";
}
function Aw(e) {
	if (e == null) return "";
	switch (G(e, jC)) {
		case "left": return "inset 2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "right": return "inset -2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "top": return "inset 0 2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "bottom": return "inset 0 -2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		default: return "none";
	}
}
function jw(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	if ($w(e)) return eT(e);
	let t = e, n = eT(t.light), r = eT(t.dark), i = n.length > 0 ? n : r, a = r.length > 0 ? r : n;
	if (i.length > 0 && a.length > 0) return i === a ? i : `light-dark(${i}, ${a})`;
	let o = t.style;
	if (o == null) return "";
	let s = fC.get(G(o, aC));
	return s ? `var(${s})` : "";
}
function Mw(e) {
	if (typeof e != "object" || !e || $w(e)) return !1;
	let t = e;
	return t.light == null && t.dark == null && t.style != null;
}
function Nw(e) {
	if (Mw(e)) {
		let t = pC.get(G(e.style, aC));
		if (t !== void 0) return `var(${t})`;
	}
	return jw(e);
}
function Pw(e) {
	if (typeof e != "object" || !e || $w(e)) return "";
	let t = e;
	return t.light == null && t.dark == null ? Nw(e) : "";
}
var Fw = /* @__PURE__ */ new Set(["background", "surface"]);
function Iw(e) {
	if (typeof e != "object" || !e) return "";
	if ($w(e)) return Rw(e) ? "initial" : zw(e);
	let t = e, n = zw(t.light ?? t.dark), r = zw(t.dark ?? t.light);
	if (n.length > 0 && r.length > 0 && Rw(t.light ?? t.dark) && Rw(t.dark ?? t.light)) return "initial";
	if (n.length > 0 && r.length > 0) return n === r ? n : `light-dark(${n}, ${r})`;
	if (t.style === null || t.style === void 0) return "";
	let i = G(t.style, aC);
	if (Fw.has(i)) return "initial";
	let a = mC.get(i);
	return a ? `var(${a})` : "";
}
function Lw(e) {
	if (typeof e == "object" && e) {
		let t = e;
		if ($w(e) ? Rw(e) : Rw(t.light ?? t.dark) && Rw(t.dark ?? t.light)) return "inherit";
	}
	return jw(e);
}
function Rw(e) {
	return tT(e)?.[3] === 0;
}
function zw(e) {
	let t = tT(e);
	return t === void 0 ? "" : eC(t[0], t[1], t[2], t[3]);
}
function Bw(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.light != null || t.dark != null) return "";
	let n = t.style;
	return n == null ? "" : `ui-color--${G(n, aC)}`;
}
function Vw(e) {
	let t = Gw(e == null ? "" : String(e).trim(), Hw + 1);
	return t > 0 && t <= Hw ? "compact" : "";
}
var Hw = 2, Uw = /[\u0300-\uFFFF]/, Ww = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function Gw(e, t) {
	if (!Uw.test(e)) return e.length;
	let n = 0;
	for (let { segment: r } of Ww.segment(e)) {
		if (n >= t) break;
		n += Kw(r) ? 2 : 1;
	}
	return n;
}
function Kw(e) {
	if (e.includes("️")) return !0;
	let t = e.codePointAt(0) ?? 0;
	for (let e = 0; e < qw.length; e += 2) if (t >= qw[e] && t <= qw[e + 1]) return !0;
	return !1;
}
var qw = [
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
function Jw(e, t) {
	Yw(e, String(t));
}
function Yw(e, t) {
	let n = e.querySelector(".ui-badge__text");
	n !== null && (n.textContent = t), e.setAttribute(Ue, Vw(t)), e.setAttribute(We, "");
}
function Xw(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size != null) return "";
	let r = n.role;
	return r == null ? "" : `${t}${G(r, lC)}`;
}
function Zw(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size == null) return "";
	switch (t) {
		case "size": return oT(n.size);
		case "weight": {
			let e = n.weight;
			return e == null ? "" : String(e);
		}
		case "lineHeight": {
			let e = n.lineHeight;
			return e == null ? "" : oT(e);
		}
		case "letterSpacing": {
			let e = n.letterSpacing;
			return e == null ? "" : oT(e);
		}
		default: return "";
	}
}
function Qw(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return "";
	let t = e, n = nT(t.style);
	if (n !== null) return `@${n}`;
	let r = t.light ?? t.dark;
	if (r == null) return "";
	if (typeof r.rgb == "number") {
		let e = r.opacity ?? 255, t = `#${$S(r.rgb >> 16 & 255)}${$S(r.rgb >> 8 & 255)}${$S(r.rgb & 255)}`;
		return e === 255 ? t : `${t}${$S(e)}`;
	}
	let i = rT(r.name);
	return i === null ? "" : `${i}/${iT(r.adjustment) ?? "None"}/${r.factor ?? 0}/${r.opacity ?? 255}`;
}
function $w(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.name !== void 0 || t.rgb !== void 0;
}
function eT(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	let t = tT(e);
	return t === void 0 ? "" : `#${$S(t[0])}${$S(t[1])}${$S(t[2])}${$S(t[3])}`;
}
function tT(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = typeof t.rgb == "number" ? [
		t.rgb >> 16 & 255,
		t.rgb >> 8 & 255,
		t.rgb & 255
	] : void 0, r = rT(t.name), i = n ?? (r === null ? void 0 : pw.get(r));
	if (!i) return;
	let a = iT(t.adjustment), o = (t.factor ?? 0) / 10, s = t.opacity ?? 255, [c, l, u] = i;
	return a === "Shade" ? (c = QS(c * (1 - o)), l = QS(l * (1 - o)), u = QS(u * (1 - o))) : a === "Tint" && (c = QS(c + (255 - c) * o), l = QS(l + (255 - l) * o), u = QS(u + (255 - u) * o)), [
		c,
		l,
		u,
		s
	];
}
function nT(e) {
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	if (typeof e != "number") return null;
	let t = aC[e];
	return t === void 0 ? null : t.split("-").map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join("");
}
function rT(e) {
	if (typeof e == "number") return mw.get(e) ?? null;
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	return null;
}
function iT(e) {
	if (typeof e == "number") return JC[e] ?? "None";
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? "None" : t;
	}
	return "None";
}
function aT(e) {
	if (e == null || e === "") return "";
	let t = typeof e == "number" ? e : Number(e);
	return Number.isFinite(t) ? String(t) : "";
}
function oT(e) {
	return `${typeof e == "number" ? e : Number(e ?? 0)}px`;
}
function sT(e) {
	return e == null ? "" : oT(e);
}
function cT(e, t) {
	let n = oh(e, t);
	if (n == null) return;
	let r = G(n, EC);
	return r === "visible" ? void 0 : r;
}
//#endregion
//#region src/interactions/search-input-engine.ts
var lT = "data-ui-search-debounce", uT = "data-ui-search-min-length", dT = "data-ui-search-manual", fT = "data-ui-search-answered", pT = "ui-search__input", mT = "ui-select__list", hT = "ui-select__option", gT = 300, _T = "data-ui-search-waiting", vT = "ui-search__field", yT = /* @__PURE__ */ new WeakMap(), bT = {
	name: "search",
	registration: {
		started: (e) => xT(e.domEvent.target),
		completed: (e) => ST(e.domEvent.target)
	}
};
function xT(e) {
	if (!(e instanceof Element)) return;
	let t = yT.get(e) ?? {
		asked: 0,
		timer: null
	};
	yT.set(e, t), !(t.asked++ > 0) && (CT(e)?.setAttribute("aria-busy", "true"), t.timer = window.setTimeout(() => {
		t.timer = null, e.closest(`.${vT}`)?.setAttribute(_T, "");
	}, 300));
}
function ST(e) {
	if (!(e instanceof Element)) return;
	let t = yT.get(e);
	t === void 0 || --t.asked > 0 || (yT.delete(e), t.timer !== null && window.clearTimeout(t.timer), CT(e)?.removeAttribute("aria-busy"), e.closest(`.${vT}`)?.removeAttribute(_T));
}
function CT(e) {
	return e.closest(".ui-select")?.querySelector(`.${mT}`) ?? null;
}
var wT = class {
	root;
	pauses;
	constructor(e = {}) {
		this.root = e.root ?? document, this.pauses = new Xx(this.root), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("compositionend", (e) => this.handleInput(e), !0), this.root.addEventListener("keydown", (e) => this.handleEnter(e), !0);
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(pT) || e.isComposing === !0) return;
		let t = e.target;
		ET(t);
		let n = t.getAttribute(lT), r = n === null ? gT : Number(n);
		this.pauses.wait(t, Number.isFinite(r) && r >= 0 ? r : gT, () => this.commit(t));
	}
	handleEnter(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Enter" || e.defaultPrevented || N(e) || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(pT)) return;
		let t = e.target;
		e.preventDefault(), this.pauses.drop(t), this.commit(t, !0);
	}
	commit(e, t = !1) {
		e.dispatchEvent(new Event("change", { bubbles: !0 })), (t || !e.hasAttribute(dT)) && TT(e) && e.dispatchEvent(new Event("search", { bubbles: !0 }));
	}
};
function TT(e) {
	let t = Number(e.getAttribute(uT) ?? 0);
	return !Number.isFinite(t) || e.value.trim().length >= t;
}
function ET(e) {
	if (e.hasAttribute(fT)) return;
	let t = e.closest(`.${Ii}`), n = t?.querySelector(`.${mT}`);
	if (t == null || n == null) return;
	let r = TT(e) ? Ug(e.value, e) : [], i = DT(n, (e) => r.length === 0 || Gg(Wg(Jg(e), e), r));
	AT(t, n, r.length > 0 && i === 0);
}
function DT(e, t) {
	let n = null, r = !1, i = 0;
	for (let a of e.children) {
		if (!(a instanceof HTMLElement)) continue;
		if (a.hasAttribute("data-ui-group-header")) {
			n !== null && OT(n, r), n = a, r = !1;
			continue;
		}
		if (!a.classList.contains(hT)) continue;
		let e = t(a);
		OT(a, e), r ||= e, e && i++;
	}
	return n !== null && OT(n, r), i;
}
function OT(e, t) {
	let n = t ? "" : "none";
	e.style.display !== n && (e.style.display = n);
}
function kT(e) {
	let t = e.querySelector(`.${mT}`);
	t !== null && AT(e, t, DT(t, (e) => e.style.display !== "none") === 0);
}
function AT(e, t, n) {
	let r = t.querySelector(`:scope > [${Ft}]`);
	n ? t.toggleAttribute(lt, r !== null || jT(e, t)) : (r?.remove(), t.toggleAttribute(lt, !1));
}
function jT(e, t) {
	let n = e.querySelector(`:scope > template[${Nt}]`);
	if (n === null) return !1;
	let r = n.content.cloneNode(!0).firstElementChild;
	return r !== null && (r.setAttribute(Ft, ""), t.appendChild(r), !0);
}
//#endregion
//#region src/interactions/type-ahead.ts
var MT = 500, NT = class {
	owner = null;
	typed = "";
	last = -Infinity;
	now;
	constructor(e = () => performance.now()) {
		this.now = e;
	}
	next(e) {
		let t = this.now();
		(e.owner !== this.owner || t - this.last > MT) && (this.typed = ""), this.owner = e.owner, this.last = t, this.typed += Wg(e.character, e.context);
		let n = Array.from(this.typed), r = n.every((e) => e === n[0]), i = r ? n[0] : this.typed, a = e.entries.length, o = e.current === null ? -1 : e.entries.indexOf(e.current), s = r ? o + 1 : Math.max(o, 0);
		for (let t = 0; t < a; t++) {
			let n = e.entries[(s + t) % a];
			if (Wg(e.words(n), e.context).trimStart().startsWith(i)) return n;
		}
		return null;
	}
};
function PT(e) {
	return N(e) || e.metaKey || Array.from(e.key).length !== 1 || !/\S/u.test(e.key) || (e.ctrlKey || e.altKey) && !e.getModifierState("AltGraph") ? null : e.key;
}
//#endregion
//#region src/interactions/select-interaction-engine.ts
var FT = "data-ui-select-value", IT = "data-ui-select-placement", LT = "ui-select--open", RT = "ui-select__trigger-content", zT = "data-ui-select-content", BT = "ui-select__placeholder", VT = "ui-input__affix-icon--prefix", HT = "ui-select__popup", UT = "ui-select__list", WT = "ui-select__option", GT = "ui-select__value-input", KT = "data-ui-select-clear", qT = "ui-select--clearable", JT = "ui-search", YT = "ui-search__input", XT = "data-ui-active", ZT = "data-ui-list-keyboard", QT = /* @__PURE__ */ new Set([
	"ArrowDown",
	"ArrowUp",
	"Home",
	"End",
	"PageDown",
	"PageUp"
]), $T = "ui-multi-select", eE = "ui-multi-select__chips", tE = "ui-multi-select__chip", nE = "ui-multi-select__chip-label", rE = "ui-multi-select__chip-remove", iE = "ui-badge-select", aE = "ui-text__badge", oE = "ui-badge", sE = "ui-badge__icon", cE = "ui-badge__text", lE = "ui-badge-style--info ui-text-type--overline", uE = "ui-text-type--overline", dE = "data-ui-select-chip", fE = "data-ui-select-chips", pE = "data-ui-select-max", mE = "data-ui-select-free-text", hE = "ui-multi-select__entry", gE = "data-ui-select-tag-entry", _E = [
	FT,
	li,
	pE
], vE = ["class", b], yE = [...vE, "style"];
function bE(e) {
	return e === null || M(e) || A(e);
}
function xE(e) {
	return e.classList.contains($T);
}
function SE(e) {
	return e.classList.contains(JT);
}
function CE(e) {
	return SE(e) ? e.querySelector(`.${YT}`) : null;
}
function wE(e) {
	return e.hasAttribute(mE) ? e.querySelector(`:scope > .${Ai} .${hE}`) : null;
}
function TE(e) {
	return CE(e) ?? wE(e);
}
function EE(e) {
	return wE(e) ?? e.querySelector(".ui-select__trigger");
}
function DE(e) {
	let t = e.target instanceof HTMLInputElement && e.target.classList.contains(hE) ? e.target : null, n = t?.closest(".ui-select") ?? null;
	return t === null || n === null ? null : {
		entry: t,
		select: n
	};
}
function OE(e) {
	return bd(e, `.${HT} .${WT}`, `.${Ii}`);
}
function kE(e) {
	let t = OE(e).filter((e) => !j(e));
	return t.find((e) => e === document.activeElement) ?? t.find((e) => e.hasAttribute(XT)) ?? null;
}
function AE(e) {
	for (let t of bd(e, `.${UT}`, `.${Ii}`)) {
		let e = t.querySelector(`:scope > .${WT}[${XT}]:not([${ni}])`) !== null;
		t.hasAttribute(ZT) !== e && t.toggleAttribute(ZT, e);
	}
}
function jE(e) {
	return e === null ? null : Jg(e);
}
function ME(e) {
	for (let t of [e, ...e.querySelectorAll("*")]) {
		t.removeAttribute(y), t.removeAttribute(b), t.removeAttribute(ae), t.removeAttribute(ie);
		for (let e of t.getAttributeNames()) e.startsWith("data-ui-bind-") && t.removeAttribute(e);
	}
}
var NE = class {
	root;
	popups = new M_({
		show: ({ owner: e }) => e.classList.add(LT),
		hide: ({ owner: e }) => {
			e.classList.remove(LT), this.markActive(e, null);
			let t = e.querySelector(`.${HT}`);
			t !== null && (t.style.minHeight = "");
		},
		closesOnTab: !0,
		sheetOnPhone: ({ owner: e }) => TE(e) === null
	});
	typeAhead = new NT();
	drawnKeys = /* @__PURE__ */ new WeakMap();
	validation;
	refusedEntries = /* @__PURE__ */ new WeakSet();
	optionWatch;
	watched = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation;
		let t = (e) => {
			let t = /* @__PURE__ */ new Set();
			for (let n of e) ug(n) || XE(n, t);
			for (let e of t) this.sync(e);
		};
		this.optionWatch = this.root instanceof Node ? new MutationObserver(t) : null, this.root instanceof Node && new MutationObserver(t).observe(this.root, {
			attributes: !0,
			attributeFilter: _E,
			childList: !0,
			subtree: !0
		});
		for (let e of this.root.querySelectorAll(`.${Ii}`)) this.sync(e);
		this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && (e.target.closest(`[${KT}], .${rE}`) !== null || zE(e.target)) && e.preventDefault();
		}, !0), window.addEventListener("input", (e) => this.handleEntryEdit(e), !0), window.addEventListener("compositionend", (e) => this.handleEntryEdit(e), !0), window.addEventListener("change", (e) => this.holdEntryDraft(e), !0), window.addEventListener("keydown", (e) => this.handleEntryEscape(e), !0), this.root.addEventListener("paste", (e) => this.handleEntryPaste(e), !0);
	}
	handleEntryEdit(e) {
		let t = this.holdEntryDraft(e);
		if (t === null || e.isComposing === !0) return;
		let { entry: n, select: r } = t;
		if (bE(r)) return;
		this.releaseRefusal(r);
		let i = vd(n.value);
		i.tags.length > 0 ? this.enterTyped(r, n, i.tags, i.rest) : this.suggest(r, n);
	}
	holdEntryDraft(e) {
		let t = DE(e);
		return t === null || this.root instanceof Node && !this.root.contains(t.select) ? null : (e.stopImmediatePropagation(), t);
	}
	handleEntryEscape(e) {
		let t = e instanceof KeyboardEvent && e.key === "Escape" && !e.defaultPrevented && !N(e) ? DE(e) : null;
		t !== null && this.openSelect === t.select && t.select.getAttribute(gE) === "first-suggestion" && OE(t.select).some((e) => e.hasAttribute(XT)) && (e.preventDefault(), this.markActive(t.select, null));
	}
	handleEntryPaste(e) {
		let t = DE(e), n = e.clipboardData?.getData("text") ?? "";
		if (t === null || bE(t.select) || !gd(n)) return;
		let { entry: r, select: i } = t, a = r.selectionStart ?? r.value.length, o = r.selectionEnd ?? a;
		e.preventDefault(), this.releaseRefusal(i), this.enterTyped(i, r, _d(r.value.slice(0, a) + n + r.value.slice(o)), "");
	}
	enterTyped(e, t, n, r) {
		let i = ud(e.getAttribute(li)), a = dd(e.getAttribute(pE)), o = yd(i, n.map((t) => ({
			text: t,
			key: BE(e, t) ?? t
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
		ET(t);
		let n = t.value.trim().length > 0, r = n ? FE(e) : [], i = r.find((e) => e.getAttribute("aria-selected") !== "true") ?? null;
		this.openSelect === e ? r.length > 0 || !n ? this.popups.reposition(e) : this.close() : r.length > 0 && this.toggle(e, !0), this.openSelect === e && e.getAttribute(gE) === "first-suggestion" && (this.markActive(e, i), i !== null && LE(e, i));
	}
	get openSelect() {
		return this.popups.current;
	}
	sync(e) {
		if (this.watchOptions(e), AE(e), xE(e)) {
			this.syncMultiple(e);
			return;
		}
		let t = e.getAttribute(FT);
		this.decorateOptions(e);
		let n = t === null ? null : OE(e).find((e) => e.getAttribute("data-ui-key") === t) ?? null, r = this.renderTriggerContent(e, n, t), i = e.querySelector(`.${BT}`);
		i !== null && (i.style.display = r ? "none" : "");
		for (let n of OE(e)) n.setAttribute("aria-selected", t !== null && n.dataset.uiKey === t ? "true" : "false");
		let a = e.querySelector(`.${GT}`);
		a !== null && a.value !== (t ?? "") && (a.value = t ?? ""), kT(e);
	}
	watchOptions(e) {
		if (this.optionWatch === null || this.watched.has(e)) return;
		this.watched.add(e);
		let t = e.classList.contains(iE) ? yE : vE;
		this.optionWatch.observe(e, {
			attributes: !0,
			attributeFilter: t,
			characterData: !0,
			subtree: !0
		});
	}
	syncMultiple(e) {
		let t = ud(e.getAttribute(li)), n = new Set(t), r = fd(t, dd(e.getAttribute(pE)));
		this.decorateOptions(e, (e) => r && !n.has(e.dataset.uiKey ?? ""));
		let i = OE(e), a = new Map(i.map((e) => [e.dataset.uiKey ?? "", e])), o = wE(e), s = o === null ? t.filter((e) => a.has(e)) : t, c = e.classList.contains(iE);
		UE(e, s.map((e) => {
			let t = a.get(e) ?? null, n = c ? VE(t) : void 0;
			return {
				key: e,
				label: HE(t, e, n ?? null),
				badge: n
			};
		})), o !== null && o.readOnly !== bE(e) && (o.readOnly = bE(e));
		let l = e.querySelector(`.${BT}`);
		l !== null && (l.style.display = s.length > 0 ? "none" : "");
		for (let e of i) e.setAttribute("aria-selected", n.has(e.dataset.uiKey ?? "") ? "true" : "false");
		let u = e.querySelector(`.${GT}`), d = JSON.stringify(t);
		u !== null && u.getAttribute("data-ui-selected-keys") !== d && u.setAttribute(li, d), kT(e);
	}
	renderTriggerContent(e, t, n) {
		let r = e.querySelector(`.${Ai}`);
		if (r === null) return t !== null;
		let i = r.querySelector(`:scope > .${RT}`), a = i?.getAttribute(zT) ?? null;
		if (i !== null && a !== null && (i.removeAttribute(zT), this.drawnKeys.set(e, a)), t === null) return i !== null && n !== null && SE(e) && this.drawnKeys.get(e) === n ? !0 : (i?.remove(), this.drawnKeys.delete(e), !1);
		let o = t.getAttribute(b);
		if (o === null ? this.drawnKeys.delete(e) : this.drawnKeys.set(e, o), i !== null && o !== null && a === o) return !0;
		if (i === null) {
			i = document.createElement("span"), i.className = RT;
			let e = r.querySelector(`:scope > .${VT}`);
			e === null ? r.prepend(i) : e.after(i);
		}
		i.style.display = "inline-flex";
		let s = t.cloneNode(!0);
		return ME(s), pg(s), i.replaceChildren(...s.childNodes), !0;
	}
	decorateOptions(e, t = () => !1) {
		for (let n of OE(e)) {
			n.hasAttribute("role") || n.setAttribute("role", "option");
			let e = j(n), r = e || t(n) ? "true" : "false";
			n.getAttribute("aria-disabled") !== r && n.setAttribute("aria-disabled", r), (e ? n.tabIndex !== -1 : !n.hasAttribute("tabindex")) && (n.tabIndex = -1);
		}
	}
	handlePointerMove(e) {
		let t = this.openSelect, n = t === null || !(e.target instanceof Element) ? null : e.target.closest(`.${WT}`);
		t === null || n === null || n.hasAttribute(XT) || j(n) || A(n) || n.closest(".ui-select") !== t || (TE(t) === null && (F(OE(t).filter((e) => !j(e)), n), Tp(n)), this.markActive(t, n, !0));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${rE}`);
		if (t !== null) {
			let n = t.closest(`.${Ii}`);
			n !== null && (e.preventDefault(), e.stopPropagation(), bE(n) || this.removeChosen(n, t.closest(`.${tE}`)?.getAttribute(dE) ?? null));
			return;
		}
		let n = e.target.closest(`[${KT}]`);
		if (n !== null) {
			let t = n.closest(`.${Ii}`);
			t !== null && (e.preventDefault(), e.stopPropagation(), bE(t) || (this.clearValue(t), PE(t)));
			return;
		}
		let r = e.target.closest(`.${Ai}`);
		if (r !== null) {
			let t = r.closest(`.${Ii}`);
			if (bE(t)) return;
			e.preventDefault();
			let n = t === null ? null : wE(t);
			t !== null && n !== null ? this.pressEntryBox(t, n, e.target === n) : this.toggle(t);
			return;
		}
		let i = e.target.closest(`.${WT}`);
		if (i === null) return;
		let a = i.closest(`.${Ii}`);
		a !== null && this.choose(a, i);
	}
	pressEntryBox(e, t, n) {
		document.activeElement !== t && t.focus(), !(OE(e).length === 0 || n && this.openSelect === e) && this.toggle(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || N(e) || (this.openSelect !== null && AE(this.openSelect), this.handleEntryKey(e) || this.handleChipKey(e)) || this.openSelect !== null && e.target instanceof Node && this.openSelect.contains(e.target) && this.handleOpenListKey(e, this.openSelect) || this.handleClearKey(e) || (e.key === "ArrowDown" || e.key === "ArrowUp") && P(e, { alt: e.key === "ArrowDown" }) && this.handleClosedArrow(e) || this.handleTypeAhead(e) || this.handleMultipleTriggerKey(e) || e.key !== "Enter" && e.key !== " " || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${WT}`) ?? this.markedOption(e);
		if (t === null) return;
		let n = t.closest(`.${Ii}`);
		n !== null && (e.preventDefault(), this.choose(n, t));
	}
	handleOpenListKey(e, t) {
		if (e.key === "ArrowUp" && e.altKey && P(e, { alt: !0 })) {
			e.preventDefault();
			let n = kE(t);
			return n !== null && !xE(t) ? this.choose(t, n) : this.close(), !0;
		}
		return !QT.has(e.key) || !P(e) || (e.key === "Home" || e.key === "End") && Lu(e.target) ? !1 : (e.preventDefault(), this.moveCurrent(t, e.key), !0);
	}
	handleEntryKey(e) {
		let t = DE(e);
		if (t === null) return !1;
		let { entry: n, select: r } = t;
		if (bE(r)) return !1;
		switch (e.key) {
			case "ArrowLeft": return n.selectionStart === 0 && n.selectionEnd === 0 && this.focusChip(e, r, -1);
			case "ArrowDown":
			case "ArrowUp": return e.preventDefault(), this.openSelect === r ? this.moveCurrent(r, e.key) : this.openSuggestions(r, n, e.key === "ArrowDown"), !0;
			case "Enter": {
				let t = this.openSelect === r ? FE(r).find((e) => e.hasAttribute(XT)) : void 0;
				return t === void 0 ? (e.preventDefault(), n.value.trim().length === 0 ? (this.pressEntryBox(r, n, !1), !0) : (this.releaseRefusal(r), this.enterTyped(r, n, _d(n.value), ""), !0)) : (e.preventDefault(), this.choose(r, t), !0);
			}
			case ",": return e.preventDefault(), this.releaseRefusal(r), this.enterTyped(r, n, _d(n.value), ""), !0;
			case "Backspace": {
				if (n.value.length > 0) return !1;
				let t = r.querySelectorAll(`.${eE} > .${tE}`);
				return t.length !== 0 && (e.preventDefault(), this.removeChosen(r, t[t.length - 1].getAttribute(dE)), !0);
			}
			default: return !1;
		}
	}
	focusChip(e, t, n, r = null) {
		let i = RE(t);
		if (i.length === 0) return !1;
		let a = i[(r === null ? i.length : i.findIndex((e) => e.contains(r))) + n]?.querySelector(`.${rE}`) ?? (n === 1 ? EE(t) : null);
		return e.preventDefault(), a === null || (a.focus(), a instanceof HTMLInputElement && a.setSelectionRange(0, 0)), !0;
	}
	openSuggestions(e, t, n) {
		ET(t);
		let r = FE(e), i = (n ? r[0] : r[r.length - 1]) ?? null;
		i !== null && this.toggle(e, !0, i);
	}
	handleChipKey(e) {
		let t = e.target instanceof HTMLElement && e.target.classList.contains(rE) ? e.target : null, n = t?.closest(".ui-select") ?? null;
		if (t === null || n === null || !xE(n)) return !1;
		switch (e.key) {
			case "ArrowLeft": return this.focusChip(e, n, -1, t);
			case "ArrowRight": return this.focusChip(e, n, 1, t);
			case "Backspace":
			case "Delete": {
				if (e.preventDefault(), bE(n)) return !0;
				let r = RE(n), i = r.findIndex((e) => e.contains(t)), a = (r[i + 1] ?? r[i - 1])?.getAttribute(dE) ?? null;
				this.removeChosen(n, r[i]?.getAttribute(dE) ?? null);
				let o = a === null ? null : RE(n).find((e) => e.getAttribute(dE) === a) ?? null;
				return o !== null && o.querySelector(`.${rE}`)?.focus(), !0;
			}
			default: return !1;
		}
	}
	handleClosedArrow(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || t === this.openSelect || bE(t)) return !1;
		e.preventDefault();
		let n = CE(t);
		n !== null && ET(n);
		let r = FE(t), i = r.find((e) => e.getAttribute("aria-selected") === "true") ?? (e.key === "ArrowDown" ? r[0] : r[r.length - 1]) ?? null;
		return this.toggle(t, !1, i), !0;
	}
	handleTypeAhead(e) {
		let t = PT(e), n = e.target instanceof HTMLElement ? e.target : null;
		if (t === null || n === null || !(n.classList.contains("ui-select__trigger") || n.classList.contains(WT))) return !1;
		let r = n.closest(`.${Ii}`), i = r !== null && r === this.openSelect;
		if (r === null || bE(r) || !i && !n.classList.contains("ui-select__trigger")) return !1;
		let a = CE(r);
		if (a !== null) return !i && (e.preventDefault(), this.typeIntoSearch(r, a, t), !0);
		e.preventDefault();
		let o = FE(r), s = i ? o.find((e) => e === document.activeElement) ?? o.find((e) => e.hasAttribute(XT)) ?? null : o.find((e) => e.getAttribute("aria-selected") === "true") ?? null, c = this.typeAhead.next({
			owner: r,
			character: t,
			entries: o,
			current: s,
			words: (e) => jE(e) ?? "",
			context: r
		});
		return c === null ? !0 : i ? (F(OE(r).filter((e) => !j(e)), c), LE(r, c), B(c), this.markActive(r, c), !0) : (this.toggle(r, !1, c), !0);
	}
	typeIntoSearch(e, t, n) {
		this.toggle(e, !0), this.openSelect === e && (t.value = n, t.setSelectionRange(n.length, n.length), t.dispatchEvent(new Event("input", { bubbles: !0 })));
	}
	handleClearKey(e) {
		if (e.key !== "Delete" && e.key !== "Backspace" || !P(e) || !(e.target instanceof HTMLElement)) return !1;
		let t = e.target.closest(`.${Ii}`);
		return t === null || t === this.openSelect || !t.classList.contains(qT) || bE(t) || e.target !== EE(t) || e.key === "Backspace" && xE(t) || (wE(t)?.value ?? "") !== "" ? !1 : (e.preventDefault(), this.clearValue(t), !0);
	}
	handleMultipleTriggerKey(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || !xE(t) || bE(t)) return !1;
		switch (e.key) {
			case "Enter":
			case " ": return e.preventDefault(), this.toggle(t), !0;
			case "ArrowLeft": return this.focusChip(e, t, -1);
			case "Backspace": {
				let n = t.querySelectorAll(`.${eE} > .${tE}`);
				return n.length !== 0 && (e.preventDefault(), this.removeChosen(t, n[n.length - 1].getAttribute(dE)), !0);
			}
			default: return !1;
		}
	}
	markedOption(e) {
		let t = this.openSelect;
		return e.key !== "Enter" || t === null || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(YT) || !t.contains(e.target) ? null : FE(t).find((e) => e.hasAttribute(XT)) ?? null;
	}
	toggle(e, t = !1, n = null) {
		if (e === null) return;
		if (this.openSelect === e) {
			this.close();
			return;
		}
		this.close();
		let r = TE(e), i = wE(e);
		r !== null && !t && ET(r), kT(e);
		let a = e.querySelector(`.${Ai}`), o = e.querySelector(`.${HT}`), s = e.querySelector(`.${UT}`) ?? o, c = e.getAttribute(IT);
		if (a === null || o === null || s === null) return;
		let l = Qi(s, "ui-select-list");
		i === null && a.setAttribute("aria-controls", l), r?.setAttribute("aria-controls", l), this.popups.open({
			owner: e,
			popup: o,
			anchor: a,
			placement: {
				placement: c !== null && lh(c) ? c : "bottom-start",
				minAnchorWidth: !0
			},
			openers: i === null ? r === null ? [a] : [a, r] : [i],
			returnFocus: () => i ?? a
		}) && (r === null ? this.initializeFocus(e, n) : (i === null ? this.initializeSearch(e, r, n, t) : this.initializeEntry(e, n), ZE(o)));
	}
	close() {
		this.popups.close();
	}
	initializeFocus(e, t) {
		let n = FE(e);
		if (n.length === 0) return;
		let r = t ?? n.find((e) => e.getAttribute("aria-selected") === "true");
		if (r === void 0 && vp()) {
			F(n, null), this.markActive(e, null), PE(e);
			return;
		}
		let i = r ?? n[0];
		F(n, i), this.markActive(e, i, vp()), LE(e, i), B(i);
	}
	initializeSearch(e, t, n, r) {
		let i = OE(e), a = FE(e), o = (r ? void 0 : n ?? a.find((e) => e.getAttribute("aria-selected") === "true")) ?? (r || vp() ? null : a[0] ?? null);
		F(i, null), this.markActive(e, o, vp()), o !== null && LE(e, o), !yp() && (B(t), t.select());
	}
	initializeEntry(e, t) {
		F(OE(e), null), this.markActive(e, t), t !== null && LE(e, t);
	}
	moveCurrent(e, t) {
		let n = OE(e).filter((e) => !j(e)), r = Rf(t, n, kE(e), "vertical");
		r !== null && (TE(e) === null ? td(n, r) : LE(e, r), this.markActive(e, r));
	}
	markActive(e, t, n = !1) {
		for (let r of OE(e)) r === t ? r.setAttribute(XT, "") : r.hasAttribute(XT) && r.removeAttribute(XT), bp(r, r === t && n);
		AE(e);
		let r = TE(e);
		r !== null && (t === null ? r.removeAttribute("aria-activedescendant") : r.setAttribute("aria-activedescendant", Qi(t, "ui-select-option")));
	}
	choose(e, t) {
		let n = t.dataset.uiKey;
		if (n === void 0 || j(t) || bE(e)) return;
		if (xE(e)) {
			let r = pd(ud(e.getAttribute(li)), n, dd(e.getAttribute(pE)));
			this.markActive(e, t, vp()), r !== null && this.writeChosen(e, r);
			let i = wE(e);
			i !== null && i.value.length > 0 && (i.value = "", this.releaseRefusal(e), this.suggest(e, i));
			return;
		}
		if (e.getAttribute(FT) === n) {
			this.close();
			return;
		}
		e.setAttribute(FT, n), this.sync(e);
		let r = e.querySelector(`.${GT}`);
		r !== null && (r.value = n, r.dispatchEvent(new Event("change", { bubbles: !0 }))), this.close();
	}
	removeChosen(e, t) {
		let n = t === null ? null : md(ud(e.getAttribute(li)), t);
		if (n === null) return;
		let r = document.activeElement instanceof HTMLElement && document.activeElement.closest(`.${tE}`) !== null;
		this.writeChosen(e, n), (r || document.activeElement === document.body) && EE(e)?.focus();
	}
	writeChosen(e, t) {
		t.length === 0 ? e.removeAttribute(li) : e.setAttribute(li, JSON.stringify(t)), this.sync(e), this.popups.reposition(e), e.querySelector(`.${GT}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	clearValue(e) {
		if (xE(e)) {
			e.hasAttribute("data-ui-selected-keys") && this.writeChosen(e, []);
			return;
		}
		if (!e.hasAttribute(FT)) return;
		e.removeAttribute(FT), this.sync(e);
		let t = e.querySelector(`.${GT}`);
		t !== null && (t.value = "", t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
};
function PE(e) {
	let t = e.querySelector(`.${Ai}`), n = EE(e);
	t !== null && n !== null && !t.contains(document.activeElement) && B(n);
}
function FE(e) {
	return OE(e).filter((e) => IE(e) && !j(e) && !A(e));
}
function IE(e) {
	return e.style.display !== "none" && !e.classList.contains("ui-hidden");
}
function LE(e, t) {
	let n = e.querySelector(`.${UT}`);
	if (n === null) return;
	let r = n.getBoundingClientRect(), i = t.getBoundingClientRect(), a = getComputedStyle(n), o = r.top + (Number.parseFloat(a.borderTopWidth) || 0), s = o + (Number.parseFloat(a.paddingTop) || 0), c = o + n.clientHeight - (Number.parseFloat(a.paddingBottom) || 0);
	i.top < s ? n.scrollTop -= s - i.top : i.bottom > c && (n.scrollTop += i.bottom - c);
}
function RE(e) {
	return [...e.querySelectorAll(`.${eE} > .${tE}`)];
}
function zE(e) {
	let t = e.closest(".ui-select__trigger")?.closest(".ui-select") ?? null;
	return t !== null && wE(t) !== null && !e.classList.contains(hE);
}
function BE(e, t) {
	let n = t.trim().toLocaleLowerCase();
	for (let t of OE(e)) {
		let e = t.dataset.uiKey;
		if (e !== void 0 && !j(t) && (e.toLocaleLowerCase() === n || jE(t)?.trim().toLocaleLowerCase() === n)) return e;
	}
	return null;
}
function VE(e) {
	return e?.querySelector(`.${aE}`) ?? null;
}
function HE(e, t, n = null) {
	let r = ((n?.hasAttribute("data-ui-badge-text") === !0 ? n.querySelector(`.${cE}`)?.textContent ?? null : null) ?? jE(e))?.trim() ?? "";
	return r.length > 0 ? r : t;
}
function UE(e, t) {
	let n = e.querySelector(`.${eE}`);
	if (n === null) return;
	n.hasAttribute(fE) !== t.length > 0 && n.toggleAttribute(fE, t.length > 0);
	let r = [...n.querySelectorAll(`:scope > .${tE}`)];
	if (!(r.length === t.length && r.every((e, n) => e.getAttribute(dE) === t[n].key && e.querySelector(`.${nE}`)?.textContent === t[n].label && (t[n].badge === void 0 || JE(e) === JE(t[n].badge ?? qE()))))) {
		for (let e of r) e.remove();
		n.prepend(...t.map(WE));
	}
}
function WE(e) {
	let t = document.createElement("button"), n = e.badge === void 0 ? GE(e.label) : KE(e.label, e.badge);
	return n.classList.add(tE), n.setAttribute(dE, e.key), t.className = rE, t.type = "button", t.tabIndex = -1, k.write(t, "aria-label", "ui.select.remove", { label: e.label }), n.append(t), n;
}
function GE(e) {
	let t = document.createElement("span"), n = document.createElement("span");
	return n.className = nE, n.textContent = e, t.append(n), t;
}
function KE(e, t) {
	let n = t === null ? qE() : t.cloneNode(!0);
	ME(n), n.classList.remove(aE);
	let r = n.querySelector(`:scope > .${cE}`);
	return r?.classList.add(nE), r !== null && !n.hasAttribute("data-ui-badge-text") && Yw(n, e), n;
}
function qE() {
	let e = document.createElement("span"), t = document.createElement("span"), n = document.createElement("span");
	return e.className = `${oE} ${lE}`, t.className = `${sE} ui-icon`, n.className = `${cE} ${uE}`, e.append(t, n), e;
}
function JE(e) {
	let t = e.querySelector(`:scope > .${sE}`);
	return `${YE(e)}|${t === null ? "" : YE(t)}`;
}
function YE(e) {
	return `${[...e.classList].filter((e) => e !== tE && e !== aE).sort().join(" ")};${e.getAttribute("style") ?? ""};${e.hasAttribute(Ge)}`;
}
function XE(e, t) {
	if (e.type === "childList") {
		for (let n of e.addedNodes) if (n instanceof HTMLElement) {
			n.classList.contains("ui-select") && t.add(n);
			for (let e of n.querySelectorAll(`.${Ii}`)) t.add(e);
		}
	}
	if (e.type === "attributes" && (e.attributeName === FT || e.attributeName === "data-ui-selected-keys" || e.attributeName === pE)) {
		e.target instanceof HTMLElement && e.target.classList.contains("ui-select") && t.add(e.target);
		return;
	}
	let n = e.target instanceof HTMLElement ? e.target : e.target.parentElement;
	if (e.attributeName === "style" && n?.classList.contains(oE) !== !0) return;
	let r = n?.closest(`.${HT}`)?.closest(`.${Ii}`);
	r != null && t.add(r);
}
function ZE(e) {
	e.dataset.uiPlacement?.startsWith("top") === !0 && (e.style.minHeight = `${e.offsetHeight}px`);
}
//#endregion
//#region src/interactions/commit-gate.ts
var QE = class {
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
		Lu(t) && this.root.contains(t) && (this.field = t, this.committed = t.value);
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
}, $E = "textarea.ui-text-area__field", eD = "data-ui-text-area-grow";
function tD() {
	return typeof CSS < "u" && CSS.supports("field-sizing", "content");
}
var nD = class {
	root;
	widths = /* @__PURE__ */ new WeakMap();
	observer;
	constructor(e = {}) {
		this.root = e.root ?? document, this.observer = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null, this.root.addEventListener("input", (e) => {
			e.target instanceof HTMLTextAreaElement && e.target.matches($E) && this.fit(e.target);
		}, !0), this.fitAll(this.root.querySelectorAll($E)), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.fitAll(Ba(e.components, $E));
		}), H(this.root, $E, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [eD]
		}, (e) => {
			this.fitAll(Ba(e, $E));
		});
	}
	fitAll(e) {
		for (let t of e) this.fit(t);
	}
	fit(e) {
		if (!e.hasAttribute(eD)) {
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
function rD(e) {
	let t = iD(e.getAttribute("min"), 0), n = iD(e.getAttribute("max"), 100), r = e.getAttribute("step");
	return {
		min: t,
		max: Math.max(t, n),
		step: r === "any" ? 0 : Math.max(0, iD(r, 1))
	};
}
function iD(e, t) {
	let n = e === null || e.trim().length === 0 ? NaN : Number(e);
	return Number.isFinite(n) ? n : t;
}
function aD(e, t, n, r) {
	let i = (n ? e.height : e.width) - r;
	if (i <= 0) return 0;
	let a = n ? e.top + e.height - t.y : t.x - e.left;
	return Math.min(1, Math.max(0, (a - r / 2) / i));
}
function oD(e, t) {
	return sD(t.min + e * (t.max - t.min), t);
}
function sD(e, t) {
	let n = Math.min(t.max, Math.max(t.min, e));
	if (t.step <= 0) return n;
	let r = Math.round((n - t.min) / t.step);
	return t.min + r * t.step > t.max && r--, cD(t.min + r * t.step, t);
}
function cD(e, t) {
	return Number(e.toFixed(Math.min(20, Math.max(lD(t.step), lD(t.min)))));
}
function lD(e) {
	let t = String(e), n = t.indexOf("e-");
	if (n >= 0) return Number(t.slice(n + 2));
	let r = t.indexOf(".");
	return r < 0 ? 0 : t.length - r - 1;
}
function uD(e, t, n) {
	return t === n ? e < t ? "start" : e > t ? "end" : null : Math.abs(e - t) < Math.abs(e - n) ? "start" : "end";
}
function dD(e, t, n, r, i) {
	let a = Math.max(0, r);
	if (t === "start" ? e <= n - a : e >= n + a) return e;
	let o = t === "start" ? n - a : n + a;
	if (i.step <= 0) return fD(o, i);
	let s = (o - i.min) / i.step;
	return fD(cD(i.min + (t === "start" ? Math.floor(s + 1e-9) : Math.ceil(s - 1e-9)) * i.step, i), i);
}
function fD(e, t) {
	return Math.min(t.max, Math.max(t.min, e));
}
//#endregion
//#region src/interactions/range-value-engine.ts
var pD = "ui-slider__input", mD = "ui-slider__input--end", hD = "ui-slider__input--held", gD = "ui-slider__value", _D = "ui-slider__bubble", vD = "ui-slider__track", yD = "ui-slider__thumb-anchor", bD = "ui-slider", xD = "ui-slider--range", SD = "ui-orientation--vertical", CD = "--ui-slider-fraction", wD = "--ui-slider-end-fraction", TD = 6, ED = "Value", DD = "EndValue", OD = /* @__PURE__ */ new Set([
	"Value",
	"EndValue",
	"Min",
	"Max"
]), kD = class {
	options;
	root;
	settled = /* @__PURE__ */ new WeakMap();
	pressedFrom = /* @__PURE__ */ new WeakMap();
	cancelled = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("pointerdown", (e) => {
			this.notePress(e.target), this.placeBubble(e.target);
		}, !0), this.root.addEventListener("pointercancel", (e) => this.takeBackPress(e.target), !0), (this.root === document ? window : this.root).addEventListener("change", (e) => this.refuseCancelledChange(e), !0), this.root.addEventListener("focusin", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusout", (e) => this.releaseBubble(e.target), !0), new Yg({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${xD} .${vD}`),
			begin: (e, t) => this.beginBandDrag(e, t),
			move: (e, t, n) => this.moveBandDrag(e, n),
			end: (e, t) => this.endBandDrag(t),
			cancel: (e, t) => this.putBandBack(t),
			takenBack: (e, t) => this.putBandBack(t)
		}), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			if (OD.has(e.propertyName)) for (let t of Ba(e.components, `.${pD}`)) this.settled.set(t, t.value), this.writeReadings(t), e.propertyName === (jD(t) ? DD : ED) && this.reportClamped(t, e.value);
		});
	}
	notePress(e) {
		let t = AD(e);
		t !== null && (this.cancelled.delete(t), this.pressedFrom.set(t, t.value));
	}
	takeBackPress(e) {
		let t = AD(e), n = t === null ? void 0 : this.pressedFrom.get(t);
		t !== null && n !== void 0 && (this.pressedFrom.delete(t), t.value !== n && (t.value = n, this.cancelled.add(t), this.settled.set(t, n), this.writeReadings(t)));
	}
	refuseCancelledChange(e) {
		let t = AD(e.target);
		t !== null && this.cancelled.has(t) && (this.cancelled.delete(t), e.stopImmediatePropagation());
	}
	reportClamped(e, t) {
		t == null || e.value === String(t) || PD(e) || e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(pD)) return;
		let t = e.target;
		if (this.cancelled.delete(t), PD(t)) {
			t.value = this.settled.get(t) ?? t.defaultValue;
			return;
		}
		let n = MD(t);
		if (n !== null) {
			let e = ND(t, Number(t.value), n);
			e !== t.value && (t.value = e, e === (this.settled.get(t) ?? t.defaultValue) && this.cancelled.add(t));
		}
		this.settled.set(t, t.value), this.writeReadings(t);
	}
	beginBandDrag(e, t) {
		let n = e.querySelector(`.${pD}:not(.${mD})`), r = e.querySelector(`.${mD}`);
		if (n === null || r === null) return null;
		let i = oD(aD(e.getBoundingClientRect(), t, FD(e), ID(e)), rD(n)), a = uD(i, Number(n.value), Number(r.value));
		if (PD(n)) return B(a === "end" ? r : n), null;
		let o = {
			start: n,
			end: r,
			from: [n.value, r.value],
			pressed: i,
			held: null
		};
		return a === null ? B(n) : this.holdHandle(o, a, i), o;
	}
	moveBandDrag(e, t) {
		let n = e.start.closest(`.${vD}`);
		if (n === null) return;
		let r = oD(aD(n.getBoundingClientRect(), t, FD(n), ID(n)), rD(e.start));
		if (e.held === null) {
			if (r === e.pressed) return;
			this.holdHandle(e, r < e.pressed ? "start" : "end", r);
		} else this.moveHandle(e.held, r);
	}
	holdHandle(e, t, n) {
		let r = t === "start" ? e.start : e.end;
		e.held = r, r.classList.add(hD), B(r), this.moveHandle(r, n), this.placeBubble(r);
	}
	moveHandle(e, t) {
		let n = MD(e), r = n === null ? String(t) : ND(e, t, n);
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
		e.held?.classList.remove(hD), e.held !== null && this.writeReadings(e.held);
	}
	placeBubble(e) {
		let t = LD(e);
		t !== null && bh(t.anchor, t.bubble, {
			placement: t.vertical ? "left" : "top",
			gap: TD
		});
	}
	releaseBubble(e) {
		Mh(LD(e)?.bubble);
	}
	writeReadings(e) {
		let t = jD(e), n = e.closest(`.${vD}`)?.parentElement ?? e.parentElement, r = t ? `.${gD}--end, .${_D}--end` : `.${gD}:not(.${gD}--end), .${_D}:not(.${_D}--end)`;
		for (let t of n?.querySelectorAll(r) ?? []) t.textContent = e.value;
		e.closest(`.${vD}`)?.style.setProperty(t ? wD : CD, String(RD(e))), e.matches(`:active, :focus-visible, .${hD}`) ? this.placeBubble(e) : this.releaseBubble(e);
	}
};
function AD(e) {
	return e instanceof HTMLInputElement && e.classList.contains(pD) ? e : null;
}
function jD(e) {
	return e.classList.contains(mD);
}
function MD(e) {
	return e.closest(`.${xD} .${vD}`)?.querySelector(jD(e) ? `.${pD}:not(.${mD})` : `.${mD}`) ?? null;
}
function ND(e, t, n) {
	let r = Number(e.closest(`.${bD}`)?.getAttribute("data-ui-slider-min-distance") ?? 0);
	return String(dD(t, jD(e) ? "end" : "start", Number(n.value), Number.isFinite(r) ? r : 0, rD(e)));
}
function PD(e) {
	return M(e) || A(e);
}
function FD(e) {
	return e.closest(`.${bD}`)?.classList.contains(SD) === !0;
}
function ID(e) {
	let t = e.querySelector(`.${yD}`)?.getBoundingClientRect();
	return t === void 0 ? 0 : FD(e) ? t.height : t.width;
}
function LD(e) {
	if (!(e instanceof Element) || !e.classList.contains(pD)) return null;
	let t = e.closest(`.${vD}`), n = jD(e), r = t?.querySelector(n ? `.${_D}--end` : `.${_D}:not(.${_D}--end)`) ?? null, i = t?.querySelector(n ? `.${yD}--end` : `.${yD}:not(.${yD}--end)`) ?? null;
	return r === null || i === null ? null : {
		bubble: r,
		anchor: i,
		vertical: FD(e)
	};
}
function RD(e) {
	let { min: t, max: n } = rD(e), r = Number(e.value);
	return !Number.isFinite(r) || n <= t ? 0 : Math.min(1, Math.max(0, (r - t) / (n - t)));
}
//#endregion
//#region src/rendering/number-format.ts
var zD = {
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
}, BD = [
	"(n)",
	"-n",
	"- n",
	"n-",
	"n -"
], VD = [
	"$n",
	"n$",
	"$ n",
	"n $"
], HD = [
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
], UD = [
	"n %",
	"n%",
	"%n",
	"% n"
], WD = [
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
], GD = /[1-9]/;
function KD(e) {
	let t = e.closest("[data-ui-number-culture]")?.getAttribute("data-ui-number-culture") ?? null;
	if (t === null) return zD;
	try {
		return {
			...zD,
			...JSON.parse(t)
		};
	} catch {
		return zD;
	}
}
function qD(e, t, n) {
	if (!Number.isFinite(e)) return String(e);
	let r = YD(t);
	if (r === null) return XD(e, n);
	let i = Math.abs(e);
	switch (r.kind) {
		case "N": {
			let t = ZD(i, 0, r.precision ?? n.decimalDigits, n.groupSizes, n.groupSeparator, n.decimalSeparator);
			return JD(e, t) ? nO(BD[n.negativePattern] ?? "-n", t, "", n.negativeSign) : t;
		}
		case "F": {
			let t = ZD(i, 0, r.precision ?? n.decimalDigits, [], "", n.decimalSeparator);
			return JD(e, t) ? n.negativeSign + t : t;
		}
		case "D": {
			let t = QD(i, 0, 0).integer.padStart(r.precision ?? 1, "0");
			return JD(e, t) ? n.negativeSign + t : t;
		}
		case "C": {
			let t = ZD(i, 0, r.precision ?? n.currencyDecimalDigits, n.currencyGroupSizes, n.currencyGroupSeparator, n.currencyDecimalSeparator);
			return nO(JD(e, t) ? HD[n.currencyNegativePattern] ?? "-$n" : VD[n.currencyPositivePattern] ?? "$n", t, n.currencySymbol, n.negativeSign);
		}
		case "P": {
			let t = ZD(i, 2, r.precision ?? n.percentDecimalDigits, n.percentGroupSizes, n.percentGroupSeparator, n.percentDecimalSeparator);
			return nO(JD(e, t) ? WD[n.percentNegativePattern] ?? "-n %" : UD[n.percentPositivePattern] ?? "n %", t, n.percentSymbol, n.negativeSign);
		}
		default: return XD(e, n);
	}
}
function JD(e, t) {
	return e < 0 && GD.test(t);
}
function YD(e) {
	if (e == null || e.trim().length === 0) return null;
	let t = /^([NFCPDnfcpd])(\d{0,2})$/.exec(e.trim());
	if (t === null) throw Error(`Number format '${e}' is outside the shared subset (N, F, C, P, D, with an optional precision).`);
	return {
		kind: t[1].toUpperCase(),
		precision: t[2].length === 0 ? null : Number(t[2])
	};
}
function XD(e, t) {
	let { integer: n, fraction: r } = $D(Math.abs(e), 0), i = r.length === 0 ? n : `${n}${t.decimalSeparator}${r}`;
	return e < 0 ? t.negativeSign + i : i;
}
function ZD(e, t, n, r, i, a) {
	let { integer: o, fraction: s } = QD(e, t, n);
	return n === 0 ? tO(o, r, i) : `${tO(o, r, i)}${a}${s}`;
}
function QD(e, t, n) {
	let { integer: r, fraction: i } = $D(e, t), a = r + i.slice(0, n).padEnd(n, "0"), o = i.length > n && i[n] >= "5" ? eO(a) : a, s = o.length - n;
	return {
		integer: o.slice(0, s),
		fraction: o.slice(s)
	};
}
function $D(e, t) {
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
function eO(e) {
	let t = e.length - 1;
	for (; t >= 0 && e[t] === "9";) t--;
	let n = "0".repeat(e.length - 1 - t);
	return t < 0 ? `1${n}` : `${e.slice(0, t)}${String(Number(e[t]) + 1)}${n}`;
}
function tO(e, t, n) {
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
function nO(e, t, n, r) {
	let i = "";
	for (let a of e) i += a === "n" ? t : a === "$" || a === "%" ? n : a === "-" ? r : a;
	return i;
}
var rO = /^[\t\n\v\f\r ]*[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?[\t\n\v\f\r ]*$/;
function iO(e) {
	if (!rO.test(e)) return null;
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}
var aO = {
	readCulture: KD,
	format: qD,
	parseInvariant: iO
}, oO = /^-?(\d+(\.\d*)?|\.\d+)$/;
function sO(e, t, n) {
	if (!oO.test(e)) return e;
	let r = n.thousands === !1 ? mO(t) : t, i = Number(e), a = n.format?.trim() ?? "";
	if (a.length > 0) try {
		return qD(i, n.thousands === !0 ? cO(a) : a, r);
	} catch {}
	let o = e.includes(".") ? e.length - e.indexOf(".") - 1 : 0;
	return qD(i, `${n.thousands === !0 ? "N" : "F"}${Math.min(o, 99)}`, r);
}
function cO(e) {
	return /^[fF]\d{0,2}$/.test(e) ? `N${e.slice(1)}` : e;
}
function lO(e, t, n) {
	return oO.test(e) ? (pO(n) ? hO(e, 2) : e).replace(".", t.decimalSeparator) : e;
}
function uO(e, t, n) {
	let r = e.trim();
	if (r.length === 0) return "";
	let i = !1;
	r.startsWith("(") && r.endsWith(")") && (i = !0, r = r.slice(1, -1));
	let a = pO(n) || t.percentSymbol.length > 0 && r.includes(t.percentSymbol);
	for (let e of [t.currencySymbol, t.percentSymbol]) r = e.length === 0 ? r : r.split(e).join("");
	for (let e of /* @__PURE__ */ new Set([
		t.negativeSign,
		"-",
		"−"
	])) e.length > 0 && r.includes(e) && (i = !0, r = r.split(e).join(""));
	let o = t.decimalSeparator, [s, ...c] = o.length === 0 ? [r] : r.split(o);
	if (c.length > 1) return null;
	let l = s.replace(/[\s  ]/g, "").split(t.groupSeparator).join("").split(t.currencyGroupSeparator).join(""), u = c.length === 0 ? null : c[0].replace(/[\s  ]/g, ""), d = u === null ? l : `${l}.${u}`;
	if (!oO.test(d)) return null;
	let f = a ? hO(d, -2) : d;
	return i && Number(f) !== 0 ? `-${f}` : f;
}
function dO(e, t, n, r, i) {
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
function fO(e) {
	return e.includes(".") ? e.replace(/0+$/, "").replace(/\.$/, "") : e;
}
function pO(e) {
	return /^\s*[pP]\d{0,2}\s*$/.test(e ?? "");
}
function mO(e) {
	return {
		...e,
		groupSeparator: "",
		currencyGroupSeparator: "",
		percentGroupSeparator: ""
	};
}
function hO(e, t) {
	let n = e.startsWith("-"), r = n ? e.slice(1) : e, i = r.indexOf("."), a = r.replace(".", ""), o = (i < 0 ? r.length : i) + t, s = a;
	o <= 0 && (s = "0".repeat(1 - o) + s, o = 1), o > s.length && (s += "0".repeat(o - s.length));
	let c = s.slice(0, o).replace(/^0+(?=\d)/, ""), l = s.slice(o).replace(/0+$/, ""), u = l.length === 0 ? c : `${c}.${l}`;
	return n ? `-${u}` : u;
}
//#endregion
//#region src/interactions/number-input-engine.ts
var gO = "ui-number-input", _O = "ui-number-input__field", vO = "data-ui-number-no-decimals", yO = "data-ui-number-no-negative", bO = "data-ui-number-thousands", xO = "data-ui-number-no-thousands", SO = "data-ui-number-trim-zeros", CO = "data-ui-number-step", wO = "data-ui-number-min", TO = "data-ui-number-max", EO = "data-ui-number-step-direction", DO = /* @__PURE__ */ new Map([
	["ArrowUp", 1],
	["ArrowDown", -1],
	["PageUp", 10],
	["PageDown", -10]
]), OO = class {
	options;
	root;
	values = /* @__PURE__ */ new WeakMap();
	shown = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("focus", (e) => this.handleFocus(e), !0), this.root.addEventListener("blur", (e) => this.handleBlur(e), !0), this.root.addEventListener("click", (e) => this.handleStepClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleStepKey(e), !0), window.addEventListener("change", (e) => this.handleChangeCapture(e), !0), window.addEventListener("change", (e) => this.handleChangeDone(e)), this.showAtRest(this.root.querySelectorAll(`.${_O}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.showAtRest(Ba(e.components, `.${_O}`));
		}), k.onChange(() => this.showAtRest(this.root.querySelectorAll(`.${_O}`)));
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
		let t = kO(e);
		if (t !== null) return this.keptValue(t) ?? PO(t) ?? t.value.trim();
	}
	show(e) {
		let t = this.values.get(e) ?? e.value, n = e.hasAttribute(SO) ? fO(t) : t, r = KD(e), i = e === document.activeElement ? lO(n, r, FO(e)) : MO(e, n, r);
		e.value = i, this.shown.set(e, i);
	}
	handleInput(e) {
		let t = kO(e.target);
		if (t === null) return;
		let n = !t.hasAttribute(vO), r = !t.hasAttribute(yO), i = t.selectionStart ?? t.value.length, a = dO(t.value, i, KD(t), n, r);
		a.value !== t.value && (t.value = a.value, t.setSelectionRange(a.cursor, a.cursor));
	}
	handleFocus(e) {
		let t = kO(e.target);
		t !== null && (this.values.set(t, this.valueOf(t)), this.show(t));
	}
	handleBlur(e) {
		let t = kO(e.target);
		if (t === null) return;
		let n = this.showsOwnText(t) ? null : PO(t);
		if (n !== null && this.values.set(t, n), t.hasAttribute(SO) && !M(t) && !A(t)) {
			let e = this.values.get(t) ?? "", n = fO(e);
			n !== e && this.commit(t, n);
		}
		this.show(t);
	}
	handleChangeCapture(e) {
		let t = kO(e.target);
		if (t === null) return;
		let n = PO(t);
		n !== null && (this.values.set(t, n), t.value = n, this.shown.set(t, n));
	}
	handleChangeDone(e) {
		let t = kO(e.target);
		t !== null && t === document.activeElement && this.show(t);
	}
	commit(e, t) {
		this.values.set(e, t), e.value = lO(t, KD(e), FO(e)), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleStepClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[" + EO + "]");
		if (t === null) return;
		let n = t.closest(".ui-number-input__row")?.querySelector(`.${_O}`) ?? null;
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t.getAttribute(EO) === "down" ? -1 : 1));
	}
	handleStepKey(e) {
		let t = DO.get(e.key);
		if (t === void 0 || !P(e, { shift: !0 }) || e.defaultPrevented) return;
		let n = kO(e.target);
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t));
	}
	step(e, t) {
		let n = Number(e.getAttribute(CO) ?? "1"), r = (Number(this.showsOwnText(e) ? this.valueOf(e) : PO(e) ?? "0") || 0) + n * t, i = e.getAttribute(wO), a = e.getAttribute(TO);
		i !== null && (r = Math.max(r, Number(i))), a !== null && (r = Math.min(r, Number(a))), this.commit(e, IO(r)), this.show(e);
	}
};
function kO(e) {
	return e instanceof HTMLInputElement && e.classList.contains(_O) ? e : null;
}
function AO(e, t) {
	let n = e.classList.contains(gO) ? e.querySelector(`.${_O}`) : null, r = n === null ? null : t(n);
	if (n === null || typeof r != "string" || r.trim().length === 0 || !Number.isFinite(Number(r))) return null;
	let i = jO(n, wO), a = jO(n, TO);
	return i !== null && Number(r) < Number(i) ? {
		key: "ui.value.min",
		args: { min: MO(n, i, KD(n)) }
	} : a !== null && Number(r) > Number(a) ? {
		key: "ui.value.max",
		args: { max: MO(n, a, KD(n)) }
	} : null;
}
function jO(e, t) {
	let n = e.getAttribute(t)?.trim() ?? "";
	return n.length > 0 && Number.isFinite(Number(n)) ? n : null;
}
function MO(e, t, n) {
	return sO(t, n, {
		format: FO(e),
		thousands: NO(e)
	});
}
function NO(e) {
	return e.hasAttribute(bO) ? !0 : !e.hasAttribute(xO) && null;
}
function PO(e) {
	return uO(e.value, KD(e), FO(e));
}
function FO(e) {
	return e.closest(`.${gO}`)?.getAttribute("data-ui-number-format") ?? null;
}
function IO(e) {
	return Number(e.toFixed(10)).toString();
}
//#endregion
//#region src/events/ahead-of-answer.ts
function LO(e, t) {
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
function RO(e) {
	switch (e.getAttribute(Gt)) {
		case "windowed": return "windowed";
		case "virtualized": return "virtualized";
		default: return "plain";
	}
}
function zO(e) {
	let t = RO(e) === "windowed" ? BO(e, "data-ui-window-offset") ?? 0 : 0;
	return Number.isInteger(t) && t > 0 ? t : 0;
}
function BO(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.length === 0) return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
function VO(e, t) {
	return e.getAttribute(t)?.toLowerCase() === "true";
}
//#endregion
//#region src/interactions/item-drags.ts
var HO = "application/x-ne-items", UO = null, WO = null;
function GO(e, t, n) {
	let r = e.getAttribute(pe), i = new Set((e.getAttribute("data-ui-drag-effects") ?? "").split(" ").filter((e) => e === "move" || e === "copy"));
	return r === null || r.length === 0 || i.size === 0 || n.length === 0 ? null : {
		kind: r,
		root: e,
		host: t,
		rows: n,
		keys: n.map(z),
		effects: i,
		source: e.getAttribute(me)
	};
}
function KO(e, t) {
	let n = Id(t);
	return n.includes(e) ? n.filter((t) => t === e || JO(t)) : [e];
}
function qO(e) {
	return !al(e, "data-ui-undraggable") && !j(e);
}
function JO(e) {
	return qO(e) && R(e) !== null;
}
function YO(e, t) {
	let n = e?.effects.has("copy") === !0, r = t || e?.effects.has("move") === !0;
	return n && r ? "copyMove" : n ? "copy" : "move";
}
function XO(e, t, n = null) {
	UO = t, WO = t === null ? null : n, t !== null && e instanceof DragEvent && e.dataTransfer !== null && e.dataTransfer.setData(HO, t.kind);
}
function ZO(e) {
	return UO !== null && e.dataTransfer?.types.includes(HO) === !0 ? UO : null;
}
function QO() {
	let e = WO;
	UO = null, WO = null, e?.();
}
//#endregion
//#region src/items/items-empty-renderer.ts
var $O = "data-ui-non-item";
function K(e) {
	let t = [];
	for (let n of e.children) ek(n) || t.push(n);
	return t;
}
function ek(e) {
	return e.hasAttribute("data-ui-non-item") || e.hasAttribute("data-ui-empty-placeholder") || e.hasAttribute("data-ui-group-header") || e.hasAttribute("data-ui-window-spacer");
}
function tk(e) {
	return e === null ? [] : [e];
}
function nk(e) {
	return e.querySelector(`:scope > [${Ft}]`);
}
function rk(e, t, n, r, i) {
	i ??= K(e).some((e) => !e.classList.contains(Ci));
	let a = nk(e);
	i ? (a?.remove(), e.toggleAttribute(lt, !1)) : e.toggleAttribute(lt, a !== null || ik(e, t, n, r));
}
function ik(e, t, n, r) {
	let i = n.getEmptyTemplate(t);
	if (i === void 0) return !1;
	let a = r.renderFromTemplate(i, null, r.getAncestorStack(e));
	if (a === null) return !1;
	let o = document.createElement("div");
	return o.setAttribute(Ft, ""), o.appendChild(a), e.appendChild(o), !0;
}
//#endregion
//#region src/items/binding-template-evaluator.ts
var ak = { ok: !1 }, ok = {
	ok: !0,
	value: null
}, sk = null;
function ck(e) {
	sk = e;
}
function lk(e, t, n) {
	let r = e.length === 0 ? void 0 : e[e.length - 1].item, i = t ?? "";
	if (i.length === 0 || i === ".") return {
		ok: !0,
		value: r,
		scope: r
	};
	let a = (n ?? []).filter((e) => ra(e.kind) !== "Scope"), o = -1;
	for (let e = 0; e < a.length; e++) ra(a[e].kind) === "Dynamic" && (o = e);
	let s = r, c = r, l = !0, u = 0, d = 0, f = !0;
	for (; d < i.length;) {
		let t = i[d];
		if (t === ".") {
			if (f) return ak;
			f = !0, d++;
			continue;
		}
		if (t === "[") {
			if (d + 1 >= i.length || i[d + 1] !== "]" || u >= a.length) return ak;
			let t = a[u];
			if (u++, ra(t.kind) === "Dynamic") {
				let n = pk(e, t.componentId);
				if (!n.ok) return ak;
				s = n.value, c = n.value, l = !0;
			} else {
				if (!l) return ak;
				let e = bk(s, t.value);
				if (!e.ok) return ak;
				s = e.value;
			}
			d += 2, f = !1;
			continue;
		}
		let n = d;
		for (; d < i.length && i[d] !== "." && i[d] !== "[";) d++;
		if (d === n) return ak;
		if (l) {
			let e = gk(s, i.slice(n, d), u > o);
			e.ok ? s = e.value : l = !1;
		}
		f = !1;
	}
	return f || u !== a.length || !l ? ak : {
		ok: !0,
		value: s,
		scope: c
	};
}
function uk(e, t, n) {
	for (let r of t ?? []) {
		if (ra(r.kind) !== "Dynamic") continue;
		let t = E(r.componentId);
		if (t > 0 && !n.some((e) => e.scopeComponentId === t) && e.closest(`[data-ui-id="${t}"][data-ui-key]`) !== null) return !0;
	}
	return !1;
}
function dk(e) {
	let t = hk(e, "IsContent");
	return t.ok && t.value === !0;
}
var fk = /* @__PURE__ */ new Set();
function pk(e, t) {
	let n = E(t);
	if (n > 0) {
		for (let t = e.length - 1; t >= 0; t--) if (e[t].scopeComponentId === n) return {
			ok: !0,
			value: e[t].item
		};
	}
	return fk.has(n) || (fk.add(n), s("an item scope a binding parameter names is not on the stack; the binding resolves to nothing.", {
		targetId: n,
		stack: e
	})), ak;
}
function mk(e, t) {
	let n = e;
	for (let e of t.split(".")) {
		let t = hk(n, e);
		if (!t.ok) return;
		n = t.value;
	}
	return n;
}
function hk(e, t) {
	return gk(e, t, !0);
}
function gk(e, t, n) {
	if (e == null) return ak;
	if (t === ".") return {
		ok: !0,
		value: e
	};
	if (typeof e != "object") return ak;
	let r = e, i = _k(r, t);
	return Object.hasOwn(r, i) ? {
		ok: !0,
		value: r[i]
	} : Array.isArray(e) ? ak : (n && sk?.(r, t), ok);
}
function _k(e, t) {
	if (Object.hasOwn(e, t)) return t;
	let n = vk(t);
	if (Object.hasOwn(e, n)) return n;
	let r = null;
	for (let n in e) if (n.length === t.length && Object.hasOwn(e, n) && (r ??= t.toLowerCase(), n.toLowerCase() === r)) return n;
	return n;
}
function vk(e) {
	let t = e.charAt(0);
	return t === t.toLowerCase() ? e : t.toLowerCase() + e.slice(1);
}
function yk(e) {
	let t = e.itemTemplate;
	if (t == null) return null;
	let n = (e.itemTemplateParameters ?? []).filter((e) => ra(e.kind) !== "Scope"), r = [], i = [], a = !1, o = 0, s = 0, c = 0;
	for (; c < t.length;) {
		let e = t[c];
		if (e === ".") {
			c++;
			continue;
		}
		if (e === "[") {
			if (c + 1 >= t.length || t[c + 1] !== "]" || s >= n.length) return null;
			let e = n[s];
			if (s++, c += 2, ra(e.kind) !== "Dynamic") {
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
function bk(e, t) {
	if (e == null || t == null) return ak;
	if (typeof t == "number") return Array.isArray(e) && t >= 0 && t < e.length ? {
		ok: !0,
		value: e[t]
	} : ak;
	if (typeof t != "string") return ak;
	if (!Array.isArray(e) && typeof e == "object") {
		let n = e;
		if (Object.hasOwn(n, t)) return {
			ok: !0,
			value: n[t]
		};
	}
	if (Array.isArray(e)) {
		for (let n of e) if (Sk(n, t)) return {
			ok: !0,
			value: n
		};
	}
	return ak;
}
function xk(e, t, n) {
	if (e == null || t == null) return !1;
	if (Array.isArray(e)) {
		if (typeof t == "number") return t < 0 || t >= e.length ? !1 : (e[t] = n, !0);
		if (typeof t != "string") return !1;
		for (let r = 0; r < e.length; r++) if (Sk(e[r], t)) return e[r] = n, !0;
		return !1;
	}
	if (typeof t != "string" || typeof e != "object") return !1;
	let r = e;
	return Object.hasOwn(r, t) ? (r[t] = n, !0) : !1;
}
function Sk(e, t) {
	return typeof e == "object" && !!e && e.id === t;
}
//#endregion
//#region src/items/items-filter-sort.ts
var Ck = /* @__PURE__ */ new WeakMap();
function wk(e) {
	let t = Tk(e), n = t?.getAttribute("data-ui-items-query") ?? null;
	if (t === null || n === null || n.length === 0) return null;
	let r = Ck.get(t);
	if (r !== void 0 && r.text === n) return r.query;
	let i = Ek(e, n);
	return Ck.set(t, {
		text: n,
		query: i
	}), i;
}
function Tk(e) {
	let t = e.closest(w);
	if (t === null) return null;
	for (let e of t.children) if (e.hasAttribute("data-ui-items-query")) return e;
	return null;
}
function Ek(e, t) {
	try {
		return JSON.parse(t);
	} catch {
		return s("the items query on the page does not parse; the authored rules alone apply.", {
			host: e,
			text: t
		}), null;
	}
}
function Dk(e, t, n, r, i) {
	let a = n.getItemsFilterSortMetadata(t), o = wk(e);
	if (a === void 0 && o === null) for (let t of K(e)) t.classList.remove(Ci);
	else for (let n of K(e)) {
		let e = r.getItemValue(n);
		e === void 0 ? (s("item value is unknown, leaving the item visible.", {
			componentId: t,
			item: n
		}), n.classList.remove(Ci)) : n.classList.toggle(Ci, !Ok(a, e, i, o));
	}
}
function Ok(e, t, n, r = null) {
	return (e?.filters ?? []).every((e) => Nk(e, t, n)) && (r?.filters ?? []).every((e) => Im(mk(t, e.itemProperty), e.operator, e.value));
}
function kk(e, t, n = null) {
	return (e?.filters ?? []).some((e) => Pk(e.source, e.activeOperator, e.activeValue, t)) || (n?.filters?.length ?? 0) > 0;
}
function Ak(e, t, n = null) {
	let r = (e?.sorts ?? []).filter((e) => Pk(e.source, e.activeOperator, e.activeValue, t)).sort((e, t) => e.priority - t.priority);
	return [...n?.sorts ?? [], ...r];
}
function jk(e, t, n) {
	return t.length === 0 ? [...e] : [...e].sort((e, r) => Mk(n.getItemValue(e), n.getItemValue(r), t));
}
function Mk(e, t, n) {
	for (let r of n) {
		let n = Fk(Lm(mk(e, r.itemProperty)), Lm(mk(t, r.itemProperty)));
		if (n !== 0) return ca(r.direction) === "Descending" ? -n : n;
	}
	return 0;
}
function Nk(e, t, n) {
	if (!Pk(e.source, e.activeOperator, e.activeValue, n)) return !0;
	let r = e.source !== null && e.source !== void 0 ? n.get(e.source, []) : e.value;
	return Im(mk(t, e.itemProperty), e.operator, r);
}
function Pk(e, t, n, r) {
	return e == null || Im(r.get(e, []), t, n);
}
function Fk(e, t) {
	if (e === t) return 0;
	let n = Lk(e), r = Lk(t);
	if (n !== r) return n - r;
	if (n === Ik.Nothing) return 0;
	if (n === Ik.Number) {
		let n = Number(e) - Number(t);
		return Number.isNaN(n) ? 0 : Math.sign(n);
	}
	return String(e).localeCompare(String(t));
}
var Ik = {
	Nothing: 0,
	Number: 1,
	Text: 2
};
function Lk(e) {
	return e == null ? Ik.Nothing : typeof e == "number" ? Number.isNaN(e) ? Ik.Nothing : Ik.Number : typeof e == "string" && e.trim().length === 0 ? Ik.Nothing : Number.isNaN(Number(e)) ? Ik.Text : Ik.Number;
}
//#endregion
//#region src/items/items-source-order.ts
var Rk = /* @__PURE__ */ new WeakMap();
function zk(e, t) {
	let n = Rk.get(e), r = n === void 0 ? [...t] : Bk(n, t);
	return Rk.set(e, r), r;
}
function Bk(e, t) {
	let n = new Set(t), r = e.filter((e) => n.has(e));
	return r.length === t.length ? r : [...t];
}
function Vk(e, t, n) {
	let r = n === null || n > e.length ? e.length : n;
	return e.splice(r, 0, t), e[r + 1] ?? null;
}
function Hk(e, t) {
	let n = e.indexOf(t);
	n >= 0 && e.splice(n, 1);
}
function Uk(e, t) {
	let n = 0;
	for (let r of e) t.has(r) || (e[n++] = r);
	e.length = n;
}
function Wk(e, t, n) {
	return Hk(e, t), Vk(e, t, n);
}
function Gk(e, t, n) {
	let r = e.indexOf(t);
	r >= 0 && (e[r] = n);
}
function Kk(e, t) {
	Rk.set(e, [...t]);
}
function qk(e) {
	Rk.delete(e);
}
//#endregion
//#region src/interactions/live-announcer.ts
var Jk = "ui-announcer", Yk = 7e3, Xk = null;
function Zk(e, t = "polite") {
	(Xk ?? Qk(document.body)).announce(e, t);
}
function Qk(e) {
	return Xk = new eA(e), Xk;
}
function $k(e, t) {
	Zk({
		key: "ui.move.done",
		args: {
			index: e,
			count: t
		}
	});
}
var eA = class {
	container;
	regions = /* @__PURE__ */ new Map();
	constructor(e) {
		this.container = e, this.ensureRegion("polite"), this.ensureRegion("assertive");
	}
	announce(e, t = "polite") {
		let n = document.createElement("div");
		return typeof e == "string" ? n.textContent = e : k.writeValue(n, null, e), this.ensureRegion(t).append(n), setTimeout(() => n.remove(), Yk), n;
	}
	ensureRegion(e) {
		let t = this.regions.get(e);
		if (t !== void 0 && t.isConnected) return t;
		let n = `.${Jk}[aria-live="${e}"]`, r = this.container.querySelector(n), i = r ?? document.createElement("div");
		return r === null && (i.className = Jk, i.setAttribute("aria-live", e), this.container.append(i)), this.regions.set(e, i), i;
	}
}, tA = "ui-tab-item";
function nA(e) {
	let t = e.parentElement;
	return t !== null && !t.hasAttribute("data-ui-items-host") && t.closest("[data-ui-items-host]") === t.parentElement ? t : e;
}
function rA(e) {
	return e instanceof HTMLElement && e.classList.contains("ui-tab-item") ? nA(e).parentElement : null;
}
function iA(e, t) {
	return al(nA(e), t);
}
//#endregion
//#region src/interactions/items-reorder-engine.ts
var aA = ".ui-items-view__item, .ui-table__row", oA = "ui-row--dragging", sA = "--ui-row-drop-offset", cA = "move", lA = ".ui-items-view--wrap", uA = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight"
]);
function dA(e, t) {
	Uf(e, cA, { index: t });
}
function fA(e) {
	return {
		name: cA,
		registration: {
			dynamicParameters: (e) => {
				let t = pA(e.domEvent);
				return t === null ? null : [...e.dynamicParameters, t];
			},
			...LO((t) => e === void 0 ? null : mA(e, t), (t) => "pending" in t ? e?.settle(t.pending) : e?.resort(t.strip))
		}
	};
}
function pA(e) {
	let t = e instanceof CustomEvent ? e.detail?.index : void 0;
	return typeof t == "number" ? t : null;
}
function mA(e, t) {
	let n = pA(t);
	if (n === null || !(t.target instanceof Element)) return null;
	let r = rA(t.target);
	if (r !== null) return { strip: r };
	let i = t.target.closest(aA), a = i?.parentElement ?? null, o = i === null || a === null || !a.hasAttribute("data-ui-items-host") ? null : e.ahead(a, z(i), n);
	return o === null ? null : { pending: o };
}
var hA = class {
	root;
	services;
	drag = null;
	views;
	marked = null;
	lifted = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.services = e.services, this.views = new gA(this.root, e.services?.keysOf), this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("pointerup", () => this.release(), !0), this.root.addEventListener("pointercancel", () => this.release(), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", () => this.endDrag(), !0);
	}
	handlePointerDown(e) {
		if (this.release(), !(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = this.liftableRow(e.target), n = t === null ? null : R(t.row);
		if (t === null || n === null) return;
		let r = SA(t.root, t.row);
		if (r === null ? !CA(e.target, t.row) : !r.contains(e.target)) return;
		r !== null && (_f(t.root, AA(t.row.parentElement ?? t.root), t.row), t.root.focus({ preventScroll: !0 }));
		let i = document.getSelection();
		i !== null && !i.isCollapsed && i.removeAllRanges(), n.draggable || (n.draggable = !0, this.lifted = n);
	}
	release() {
		this.lifted !== null && this.drag === null && (this.lifted.draggable = !1, this.lifted = null);
	}
	liftableRow(e) {
		let t = e.closest(Td), n = t?.parentElement ?? null, r = n?.closest(L) ?? null;
		if (t === null || n === null || r === null || !t.matches(aA) || !n.hasAttribute("data-ui-items-host") || A(r) || !JO(t)) return null;
		let i = r.hasAttribute("data-ui-rows-draggable") && !this.isSorted(r, n);
		return i || r.hasAttribute("data-ui-drag-kind") ? {
			root: r,
			row: t,
			moves: i
		} : null;
	}
	isSorted(e, t) {
		let n = Ha(e);
		return this.services === void 0 || n === null ? !1 : Ak(this.services.metadata.getItemsFilterSortMetadata(n), this.services.state, wk(t)).length > 0;
	}
	handleDragStart(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.liftableRow(e.target), n = t?.row.parentElement ?? null, r = t === null ? null : R(t.row);
		if (t === null || n === null || r === null || e.target !== r) return;
		this.drag = {
			...t,
			host: n
		};
		let i = GO(t.root, n, KO(t.row, AA(n))), a = (i?.rows ?? []).filter((e) => e !== t.row).map((e) => R(e) ?? e);
		Ov(e, t.root, r, oA, z(t.row), a, YO(i, t.moves)), XO(e, i, () => this.endDrag()), this.dropView();
	}
	handleDragOver(e) {
		let t = this.ownDrag(e);
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let n = this.views.read(t.root, t.host), r = bA(t.host, e.target, e, n.flow, n.rows, n.boxes), i = r === null || this.indexOf(t, r.anchor, r.side, n.order) === null ? null : r, a = i === null ? 0 : OA(n.rows, i, n.flow);
		e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), !(this.marked !== null && this.marked.view === n && EA(this.marked.place, i) && this.marked.offset === a) && (jA(t.root, i, a), this.marked = {
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
		if (wA(t) !== wA(e.row)) return null;
		let i = vA(r ?? xA(e.host, this.services?.keysOf), z(e.row), z(t), n);
		return i === null ? null : i + zO(e.host);
	}
	handleDragLeave(e) {
		let t = this.drag;
		t !== null && e instanceof DragEvent && jv(e, t.host) && (jA(t.root, null), this.dropView());
	}
	handleDrop(e) {
		let t = this.ownDrag(e);
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		e.preventDefault();
		let n = bA(t.host, e.target, e, TA(t.root, t.host), AA(t.host)), r = n === null ? null : this.indexOf(t, n.anchor, n.side);
		this.endDrag(), r !== null && dA(t.row, r);
	}
	endDrag() {
		let e = this.drag;
		this.drag = null, this.dropView(), this.release(), e !== null && (kv(e.root, oA), jA(e.root, null));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !e.altKey || !P(e, { alt: !0 }) || !uA.has(e.key) || !(e.target instanceof Element)) return;
		let t = cf(e);
		if (t === null || !t.root.matches(".ui-items-view, .ui-table")) return;
		let n = Wd(t.root), r = n === null ? null : TA(t.root, n), i = e.key === "ArrowLeft" || e.key === "ArrowRight";
		if (n === null || r === null || i && !r.across) return;
		let a = AA(n), o = ff(a);
		if (o === null || this.liftableRow(o)?.moves !== !0) return;
		e.preventDefault();
		let s = e.key === "ArrowDown" || e.key === "ArrowRight", c = !i && t.root.matches(lA) ? Bf(a, o, s) : a[a.indexOf(o) + (s ? 1 : -1)] ?? null, l = c === null ? null : this.indexOf({
			host: n,
			row: o
		}, c, s ? "after" : "before");
		l !== null && (dA(o, l), $k(l + 1, BO(n, "data-ui-window-total") ?? zO(n) + xA(n, this.services?.keysOf).length));
	}
}, gA = class {
	keysOf;
	view = null;
	changes = typeof MutationObserver == "function" ? new MutationObserver((e) => this.hear(e)) : null;
	constructor(e, t) {
		this.keysOf = t, e.addEventListener("scroll", () => this.drop(), !0);
	}
	read(e, t) {
		if (this.view !== null && this.view.host === t) return this.view;
		this.drop();
		let n = AA(t);
		return this.view = {
			host: t,
			flow: TA(e, t),
			rows: n,
			boxes: n.map((e) => (R(e) ?? e).getBoundingClientRect()),
			order: xA(t, this.keysOf)
		}, this.changes?.observe(t, {
			childList: !0,
			subtree: !0,
			attributes: !0,
			attributeFilter: [
				"class",
				"hidden",
				Rt,
				"style"
			]
		}), this.view;
	}
	drop() {
		this.view = null, this.changes?.disconnect();
	}
	hear(e) {
		e.some(_A) && this.drop();
	}
};
function _A(e) {
	return e.attributeName !== "style" || e.target instanceof Element && e.target.hasAttribute("data-ui-window-spacer");
}
function vA(e, t, n, r) {
	let i = e.indexOf(t);
	if (i < 0 || t === n) return null;
	let a = yA(e.filter((e) => e !== t), n, r);
	return a === i ? null : a;
}
function yA(e, t, n) {
	let r = e.indexOf(t);
	return r < 0 ? null : n === "before" ? r : r + 1;
}
function bA(e, t, n, r, i, a) {
	if (t.closest("[data-ui-group-header]")?.parentElement === e) return null;
	let o = t.closest(Td);
	for (; o !== null && o.parentElement !== e;) o = o.parentElement?.closest(Td) ?? null;
	if (o ??= kA(i, n, a), o === null) return null;
	let s = (R(o) ?? o).getBoundingClientRect();
	if ((r.across ? n.clientX < s.left + s.width / 2 : n.clientY < s.top + s.height / 2) === r.rightToLeft) return {
		anchor: o,
		side: "after"
	};
	let c = i[i.indexOf(o) - 1];
	return c !== void 0 && DA(c, o, r) ? {
		anchor: c,
		side: "after"
	} : {
		anchor: o,
		side: "before"
	};
}
function xA(e, t) {
	switch (RO(e)) {
		case "virtualized": return [...t?.(e) ?? K(e).map(z)];
		case "windowed": return K(e).map(z);
		default: return zk(e, K(e)).map(z);
	}
}
function SA(e, t) {
	let n = e.hasAttribute("data-ui-rows-drag-handle") ? t.querySelector(`:scope > .${_e}`) : null;
	return n !== null && n.getClientRects().length > 0 ? n : null;
}
function CA(e, t) {
	return Zu(e, t) === null && e.closest("[data-ui-no-row-drag]") === null;
}
function wA(e) {
	return e.getAttribute("data-ui-group") ?? "";
}
function TA(e, t) {
	let n = e.matches(".ui-orientation--horizontal, .ui-items-view--wrap");
	return {
		across: n,
		rightToLeft: n && getComputedStyle(t).direction === "rtl"
	};
}
function EA(e, t) {
	return e === t || e !== null && t !== null && e.anchor === t.anchor && e.side === t.side;
}
function DA(e, t, n) {
	if (wA(e) !== wA(t)) return !1;
	if (!n.across) return !0;
	let r = (R(e) ?? e).getBoundingClientRect(), i = (R(t) ?? t).getBoundingClientRect();
	return r.top < i.bottom && i.top < r.bottom;
}
function OA(e, t, n) {
	let r = t.side === "after" ? e[e.indexOf(t.anchor) + 1] : void 0;
	if (r === void 0 || !DA(t.anchor, r, n)) return -1;
	let i = (R(t.anchor) ?? t.anchor).getBoundingClientRect(), a = (R(r) ?? r).getBoundingClientRect(), o = n.across ? n.rightToLeft ? i.left - a.right : a.left - i.right : a.top - i.bottom;
	return Math.max(o, 0) / 2;
}
function kA(e, t, n) {
	let r = null, i = Infinity;
	for (let a = 0; a < e.length; a++) {
		let o = e[a], s = n?.[a] ?? (R(o) ?? o).getBoundingClientRect(), c = Math.max(s.left - t.clientX, 0, t.clientX - s.right), l = Math.max(s.top - t.clientY, 0, t.clientY - s.bottom), u = c * c + l * l;
		u < i && (r = o, i = u);
	}
	return r;
}
function AA(e) {
	return K(e).filter((e) => e instanceof HTMLElement && e.matches(Td) && R(e) !== null);
}
function jA(e, t, n = 0) {
	let r = t === null ? null : R(t.anchor);
	for (let t of e.querySelectorAll(`[${ve}]`)) t !== r && (t.removeAttribute(ve), t.style.removeProperty(sA));
	if (r === null || t === null) return;
	r.getAttribute("data-ui-row-drop") !== t.side && r.setAttribute(ve, t.side);
	let i = `${n}px`;
	r.style.getPropertyValue(sA) !== i && r.style.setProperty(sA, i);
}
function MA(e) {
	e.classList.remove(oA), e.querySelector(`:scope > [${y}]`)?.classList.remove(oA);
}
//#endregion
//#region src/interactions/tree-drop.ts
var NA = "--ui-tree-drop-depth";
function PA(e) {
	return e.querySelector(`.${ur}`);
}
function FA(e, t) {
	if (j(e)) return !1;
	let n = t?.getAttribute(Sr);
	return n === "true" || n !== "false" && e.hasAttribute("aria-expanded");
}
function IA(e, t) {
	let n = e.length === 0 ? null : t(e);
	return n === null || FA(n, PA(n));
}
function LA(e, t) {
	let n = PA(e);
	if (FA(e, n)) return z(e);
	let r = n?.getAttribute("data-ui-tree-parent") ?? "";
	return IA(r, t) ? r : null;
}
function RA(e, t, n = "", r) {
	for (let n of e.querySelectorAll(`[${dr}]`)) n !== t && (n.removeAttribute(dr), n.style.removeProperty(NA));
	t !== null && (t.setAttribute(dr, n), r === void 0 ? t.style.removeProperty(NA) : t.style.setProperty(NA, String(r)));
}
function zA(e, t, n) {
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
function BA(e, t, n) {
	let r = e.find((e) => e.key === t);
	if (r === void 0) return null;
	let i = VA(e, r, n);
	return i === null || !HA(e, i.parent) ? null : i;
}
function VA(e, t, n) {
	if (n === "in") {
		let n = zA(e, t.key, !0);
		return n === null ? null : {
			parent: n,
			before: null
		};
	}
	if (n === "out") {
		let n = zA(e, t.key, !1);
		return n === null ? null : {
			parent: n,
			before: WA(e, n, t.parent, !1)
		};
	}
	let r = UA(e, t.parent), i = r.findIndex((e) => e.key === t.key), a = n === "up" ? -1 : 1, o = i + a;
	for (; o >= 0 && o < r.length && r[o].shown === !1;) o += a;
	return o < 0 || o >= r.length ? null : {
		parent: t.parent,
		before: n === "up" ? r[o].key : r[o + 1]?.key ?? null
	};
}
function HA(e, t) {
	return t.length === 0 || e.find((e) => e.key === t)?.takesDrop === !0;
}
function UA(e, t) {
	return e.filter((e) => e.parent === t);
}
function WA(e, t, n, r, i = /* @__PURE__ */ new Set()) {
	let a = UA(e, t);
	for (let e = a.findIndex((e) => e.key === n) + 1; e > 0 && e < a.length; e++) if (!i.has(a[e].key) && (!r || a[e].shown !== !1)) return a[e].key;
	return null;
}
function GA(e, t, n) {
	let r = UA(e, n.parent).map((e) => e.key), i = new Set(t), a = n.before !== null && i.has(n.before) ? WA(e, n.parent, n.before, !1, i) : n.before, o = [], s = null;
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
var KA = "drop:", qA = "ui-row--cut", JA = {
	code: "KeyX",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
}, YA = {
	code: "KeyC",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
}, XA = {
	code: "KeyV",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
};
function ZA(e) {
	return {
		dynamicParameters: (e) => {
			let t = QA(e.domEvent);
			return t === null ? null : [...e.dynamicParameters, JSON.stringify(t.drop)];
		},
		...LO((t) => $A(e, t), (t) => e?.settle(t))
	};
}
function QA(e) {
	let t = e instanceof CustomEvent ? e.detail : null;
	return t?.drop === void 0 ? null : t;
}
function $A(e, t) {
	let n = QA(t)?.transfer ?? null;
	return n === null || e === void 0 ? null : e.ahead(n.source, n.target, n.keys, n.index);
}
var ej = class {
	root;
	options;
	marked = null;
	clipboard = null;
	views;
	constructor(e) {
		this.root = e.root ?? document, this.options = e, this.views = new gA(this.root, e.keysOf), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", () => this.endDrag(), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e));
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent)) return;
		let t = this.dropOf(e);
		this.unmark(), t !== null && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = t.effect), t.landing.mark(), this.marked = t.target);
	}
	dropOf(e) {
		let t = ZO(e), n = e.target instanceof Element ? e.target : null, r = t === null || n === null ? null : this.targetOf(t, n);
		if (t === null || n === null || r === null) return null;
		let i = tj(t, r, nj(e)), a = i === null ? null : this.landingOf(r, n, e);
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
		return n === null || A(n) ? null : n;
	}
	landingOf(e, t, n) {
		let r = e.matches(".ui-items-view, .ui-table") ? Wd(e) : null;
		if (r !== null) {
			let i = this.views.read(e, r), a = t !== null && n !== null ? bA(r, t, n, i.flow, i.rows, i.boxes) : rj(i.rows);
			return {
				index: ((a === null ? null : yA(i.order, z(a.anchor), a.side)) ?? i.order.length) + zO(r),
				folder: null,
				list: r,
				mark: () => a === null ? e.setAttribute(he, "") : jA(e, a, OA(i.rows, a, i.flow))
			};
		}
		if (e.classList.contains("ui-tree")) {
			let n = ij(e, t ?? document.activeElement);
			if (n === null) return null;
			let r = n.length === 0 ? Wd(e) : aj(e, n);
			return {
				index: null,
				folder: n,
				list: null,
				mark: () => RA(e, r)
			};
		}
		return {
			index: null,
			folder: null,
			list: null,
			mark: () => {
				e.setAttribute(he, ""), Mv(e, !0);
			}
		};
	}
	unmark() {
		let e = this.marked;
		this.marked = null, e !== null && (e.removeAttribute(he), Mv(e, !1), e.matches(".ui-items-view, .ui-table") ? jA(e, null) : e.classList.contains("ui-tree") && RA(e, null));
	}
	handleDragLeave(e) {
		this.marked !== null && e instanceof DragEvent && jv(e, this.marked) && this.unmark();
	}
	handleDrop(e) {
		this.views.drop();
		let t = e instanceof DragEvent ? this.dropOf(e) : null;
		t !== null && (e.preventDefault(), this.unmark(), QO(), this.drop(t.drag, t.target, t.effect, t.landing));
	}
	drop(e, t, n, r) {
		let i = n === "move" && r.list !== null && r.index !== null && e.host.isConnected && e.root.matches(".ui-items-view, .ui-table") && t.getAttribute("data-ui-drag-kind") === e.kind && RO(e.host) === "plain" && RO(r.list) === "plain", a = {
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
		t.dispatchEvent(new CustomEvent(KA + e.kind, {
			bubbles: !0,
			detail: a
		}));
	}
	endDrag() {
		this.unmark(), this.views.drop(), QO();
	}
	handleKeyDown(e) {
		e instanceof KeyboardEvent && !e.defaultPrevented && e.target instanceof Element && (e.key === "Escape" ? this.clipboard !== null && !N(e) && (this.clipboard.items.root.isConnected && e.preventDefault(), this.letGo()) : Ru(e.target) || ($l(XA, e) ? this.paste(e, e.target) : $l(JA, e) ? this.take(e, e.target, !0) : $l(YA, e) && this.take(e, e.target, !1)));
	}
	letGo() {
		for (let e of this.clipboard?.items.rows ?? []) (R(e) ?? e).classList.remove(qA);
		this.clipboard = null;
	}
	paste(e, t) {
		let n = this.clipboard, r = n === null ? null : this.targetOf(n.items, t), i = n === null || r === null ? null : tj(n.items, r, !n.cut);
		this.views.drop();
		let a = r === null || i === null ? null : this.landingOf(r, null, null);
		n !== null && r !== null && i !== null && a !== null && (e.preventDefault(), this.drop(n.items, r, i, a), n.cut && this.letGo());
	}
	take(e, t, n) {
		let r = document.getSelection();
		if (r !== null && !r.isCollapsed) return;
		let i = sf(t), a = i === null ? null : Wd(i.root);
		if (i === null || a === null || A(i.root) || !i.root.hasAttribute("data-ui-drag-kind")) return;
		let o = AA(a), s = i.row ?? ff(o), c = s === null || !JO(s) ? null : GO(i.root, a, KO(s, o));
		if (c !== null && c.effects.has(n ? "move" : "copy") && (e.preventDefault(), this.letGo(), this.clipboard = {
			items: c,
			cut: n
		}, n)) for (let e of c.rows) (R(e) ?? e).classList.add(qA);
	}
};
function tj(e, t, n) {
	let r = n || t.getAttribute("data-ui-drag-kind") !== e.kind ? "copy" : "move";
	return e.effects.has(r) ? r : n ? null : r === "move" ? "copy" : "move";
}
function nj(e) {
	return cu() ? e.altKey : e.ctrlKey;
}
function rj(e) {
	let t = pf(e);
	return t === null ? null : {
		anchor: t,
		side: "after"
	};
}
function ij(e, t) {
	let n = t?.closest(".ui-tree__row") ?? null;
	return n === null || n.closest(".ui-tree") !== e ? "" : LA(n, (t) => aj(e, t));
}
function aj(e, t) {
	return e.querySelector(`.${lr}[${b}="${Yi(t)}"]`);
}
//#endregion
//#region src/interactions/temporal-range.ts
function oj(e, t, n) {
	if (t === "start" || e.start === null) {
		let t = dj(n, e.start ?? n);
		return {
			start: t,
			end: e.end !== null && e.end.getTime() < t.getTime() ? null : e.end,
			active: "end",
			complete: !1
		};
	}
	return n.getTime() < fj(e.start).getTime() ? {
		start: dj(n, e.start),
		end: null,
		active: "end",
		complete: !1
	} : {
		start: e.start,
		end: dj(n, e.end ?? e.start),
		active: "end",
		complete: !0
	};
}
function sj(e, t, n) {
	if (t === null || n === null) return !1;
	let r = fj(e).getTime();
	return r > fj(t).getTime() && r < fj(n).getTime();
}
function cj(e, t) {
	return !t && e.start !== null && e.end !== null && fj(e.start).getTime() < fj(e.end).getTime();
}
function lj(e, t, n) {
	return !n && sj(e, t.start, t.end);
}
function uj(e) {
	return e.start !== null && e.end !== null && e.end.getTime() < e.start.getTime() ? {
		start: e.end,
		end: e.start
	} : e;
}
function dj(e, t) {
	return Ns(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function fj(e) {
	return Ns(e.getFullYear(), e.getMonth(), e.getDate());
}
//#endregion
//#region src/interactions/temporal-dom.ts
var q = "ui-temporal-input", pj = "ui-calendar", mj = `.${q}, .${pj}`, hj = "ui-temporal-input__value-input", gj = "ui-temporal-input__end-value-input", _j = "data-ui-temporal-range", vj = "data-ui-temporal-end", yj = "data-ui-temporal-mode", bj = "data-ui-temporal-format", xj = "data-ui-temporal-default-format", Sj = "data-ui-temporal-min", Cj = "data-ui-temporal-max", wj = "data-ui-temporal-step", Tj = "data-ui-temporal-step-unit", Ej = "data-ui-temporal-marked-days", Dj = "data-ui-temporal-marked-only", Oj = "data-ui-temporal-page-culture", kj = "data-ui-temporal-months", Aj = "data-ui-temporal-months-genitive", jj = "data-ui-temporal-months-short", Mj = "data-ui-temporal-daynames", Nj = "data-ui-temporal-weekdays", Pj = "data-ui-temporal-first-day", Fj = "data-ui-temporal-am", Ij = "data-ui-temporal-pm", Lj = /* @__PURE__ */ new Set([
	bj,
	xj,
	Sj,
	Cj,
	kj,
	Fj,
	Ij,
	Ej,
	Dj
]), Rj = 2e3;
function zj(e) {
	let t = e.getAttribute(yj);
	return t === "time" || t === "date-time" ? t : "date";
}
function Bj(e) {
	let t = e.getAttribute(bj);
	return t === null || t.trim().length === 0 ? e.getAttribute(xj) ?? "" : t;
}
function Vj(e) {
	let t = e.getAttribute(Tj), n = Math.max(1, Math.trunc(Number(e.getAttribute(wj))) || 1);
	return {
		unit: t === "hour" || t === "minute" || t === "second" ? t : "day",
		hour: t === "hour" ? n : 1,
		minute: t === "minute" ? n : 1,
		second: t === "second" ? n : 1
	};
}
function Hj(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function Uj(e, t) {
	return t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function Wj(e, t, n) {
	let r = new Date(e);
	return t === "hour" ? r.setHours(n) : t === "minute" ? r.setMinutes(n) : r.setSeconds(n), r;
}
function Gj(e) {
	return {
		monthNames: Kj(e, kj),
		monthGenitiveNames: Kj(e, Aj),
		abbreviatedMonthNames: Kj(e, jj),
		dayNames: Kj(e, Mj),
		abbreviatedDayNames: Kj(e, Nj),
		amDesignator: e.getAttribute(Fj) ?? "AM",
		pmDesignator: e.getAttribute(Ij) ?? "PM"
	};
}
function Kj(e, t) {
	return (e.getAttribute(t) ?? "").split("|");
}
function qj(e, t) {
	e.hasAttribute(Oj) && (T(e, Aj, t.monthGenitiveNames.join("|")), T(e, jj, t.abbreviatedMonthNames.join("|")), T(e, Mj, t.dayNames.join("|")), T(e, Nj, t.abbreviatedDayNames.join("|")), T(e, kj, t.monthNames.join("|")), T(e, Fj, t.amDesignator), T(e, Ij, t.pmDesignator), T(e, xj, Xj(zj(e), Vj(e), t)));
}
function Jj(e) {
	for (let t = 0; t < e.length;) {
		let n = Ds(e, t);
		if (n === "h" || n === "hh") return !0;
		t += n?.length ?? 1;
	}
	return !1;
}
function Yj(e, t, n) {
	if (!t) return String(e).padStart(2, "0");
	let r = e < 12 ? n.amDesignator : n.pmDesignator, i = String(Js(e));
	return r.length === 0 ? i : `${i} ${r}`;
}
function Xj(e, t, n) {
	let r = t.unit === "second";
	return e === "date" ? n.date : e === "time" ? r ? n.longTime : n.shortTime : vs(n, r);
}
function Zj(e) {
	return e.hasAttribute(_j);
}
function Qj(e) {
	return e !== null && e.hasAttribute(vj);
}
function $j(e) {
	return J(e, !1);
}
function J(e, t) {
	let n = eM(e, t);
	return n === null ? null : xM(n.value, zj(e));
}
function eM(e, t) {
	return e.querySelector(`.${t ? gj : hj}`);
}
function tM(e, t) {
	let n = e.getAttribute(t) ?? "", r = xM(n, zj(e)), i = dM(n);
	if (r === null || i === null) return r;
	let a = uM(e, !1), o = /* @__PURE__ */ new Date(nM(r) - rM(i) * 6e4);
	if (a !== null) {
		let e = new Date(o.getTime() + rM(a) * 6e4);
		return Ns(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate(), e.getUTCHours(), e.getUTCMinutes(), e.getUTCSeconds(), e.getUTCMilliseconds());
	}
	return iM(e) ? r : o;
}
function nM(e) {
	let t = /* @__PURE__ */ new Date(0);
	return t.setUTCFullYear(e.getFullYear(), e.getMonth(), e.getDate()), t.setUTCHours(e.getHours(), e.getMinutes(), e.getSeconds(), e.getMilliseconds()), t.getTime();
}
function rM(e) {
	let t = /^([+-])(\d{2}):?(\d{2})?$/.exec(e);
	return t === null ? 0 : (t[1] === "-" ? -1 : 1) * (Number(t[2]) * 60 + Number(t[3] ?? "0"));
}
function iM(e) {
	return (eM(e, !1)?.value.trim() ?? "").length > 0 || (eM(e, !0)?.value.trim() ?? "").length > 0;
}
function aM(e) {
	let t = tM(e, Sj), n = tM(e, Cj), r = (e.getAttribute(Ej) ?? "").split(" ").filter((e) => e.length > 0);
	return {
		min: t === null ? null : SM(t, "date"),
		max: n === null ? null : SM(n, "date"),
		marked: new Set(r),
		markedOnly: e.hasAttribute(Dj)
	};
}
function oM(e, t) {
	return (e.min === null || t >= e.min) && (e.max === null || t <= e.max) && (!e.markedOnly || e.marked.has(t));
}
function sM(e, t, n) {
	pM(e, t === null ? "" : cM(e, t, n), n);
}
function cM(e, t, n) {
	let r = zj(e), i = SM(t, r);
	return r === "date-time" ? i + (uM(e, n) ?? fM(t)) : i;
}
var lM = /T\d{1,2}:\d{1,2}(?::\d{1,2}(?:\.\d+)?)?(Z|[+-]\d{2}(?::?\d{2})?)$/i;
function uM(e, t) {
	return dM(eM(e, t)?.value ?? "") ?? dM(eM(e, !t)?.value ?? "");
}
function dM(e) {
	return lM.exec(e.trim())?.[1] ?? null;
}
function fM(e) {
	let t = -e.getTimezoneOffset(), n = Math.abs(t);
	return `${t < 0 ? "-" : "+"}${CM(Math.floor(n / 60))}:${CM(n % 60)}`;
}
function pM(e, t, n) {
	let r = eM(e, n);
	r !== null && r.value !== t && (r.value = t, r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function mM(e, t) {
	let n = t.trim(), r = n.length === 0 ? null : Ls(n, Bj(e), Gj(e));
	return r === null ? n : SM(Ms(r), zj(e));
}
function hM(e) {
	if (!Zj(e)) return;
	let t = {
		start: J(e, !1),
		end: J(e, !0)
	};
	if (uj(t) === t) return;
	let n = eM(e, !1)?.value ?? "";
	pM(e, eM(e, !0)?.value ?? "", !1), pM(e, n, !0);
}
function gM(e) {
	let t = tM(e, Sj), n = tM(e, Cj);
	if (t === null && n === null) return null;
	for (let r of Zj(e) ? [!1, !0] : [!1]) {
		let i = J(e, r);
		if (i !== null && t !== null && i.getTime() < t.getTime()) return {
			key: "ui.value.before",
			args: { min: Ss(t, Bj(e), Gj(e)) }
		};
		if (i !== null && n !== null && i.getTime() > n.getTime()) return {
			key: "ui.value.after",
			args: { max: Ss(n, Bj(e), Gj(e)) }
		};
	}
	return null;
}
function _M(e) {
	return yM(e, vM(e, /* @__PURE__ */ new Date()));
}
function vM(e, t) {
	let n = tM(e, Sj), r = tM(e, Cj);
	return n !== null && t.getTime() < n.getTime() ? n : r !== null && t.getTime() > r.getTime() ? r : t;
}
function yM(e, t) {
	let n = Vj(e), r = new Date(t);
	return r.setMilliseconds(0), r.setSeconds(n.unit === "second" ? Math.floor(r.getSeconds() / n.second) * n.second : 0), n.unit === "hour" ? r.setMinutes(0) : r.setMinutes(Math.floor(r.getMinutes() / n.minute) * n.minute), r.setHours(Math.floor(r.getHours() / n.hour) * n.hour), r;
}
var bM = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/;
function xM(e, t) {
	let n = e.trim();
	if (n.length === 0) return null;
	if (t === "time") {
		let e = bM.exec(n);
		return e === null ? null : new Date(Rj, 0, 1, Number(e[1]), Number(e[2]), Number(e[3] ?? "0"));
	}
	let r = js(n);
	return r === null ? null : Ms(r);
}
function SM(e, t) {
	let n = `${CM(e.getHours())}:${CM(e.getMinutes())}:${CM(e.getSeconds())}`;
	if (t === "time") return n;
	let r = `${String(e.getFullYear()).padStart(4, "0")}-${CM(e.getMonth() + 1)}-${CM(e.getDate())}`;
	return t === "date" ? r : `${r}T${n}`;
}
function CM(e) {
	return String(e).padStart(2, "0");
}
//#endregion
//#region src/interactions/temporal-calendar.ts
var wM = "ui-temporal-input__day", TM = "ui-temporal-input__month", EM = 3, DM = "data-ui-temporal-nav", OM = "data-ui-temporal-day", kM = 366;
function AM(e) {
	let t = $j(e);
	return {
		view: eN(t ?? vM(e, /* @__PURE__ */ new Date())),
		pane: "days",
		focusedDay: t,
		activeEnd: "start",
		hoverDay: null,
		choosingEnd: !1
	};
}
function jM(e, t, n, r) {
	let i = $M("div", `${q}__calendar`), a = $M("div", `${q}__calendar-header`), o = aM(e), s = QM("previous", "‹", k.text("ui.picker.previous"));
	s.disabled = MM(o, t, -1) === null, a.append(s);
	let c = QM("pane", t.pane === "days" ? `${n.monthNames[t.view.getMonth()]} ${t.view.getFullYear()}` : String(t.view.getFullYear()));
	c.classList.add(`${q}__calendar-label`), a.append(c);
	let l = QM("next", "›", k.text("ui.picker.next"));
	return l.disabled = MM(o, t, 1) === null, a.append(l), i.append(a), i.append(t.pane === "days" ? IM(e, t, n, r, o) : LM(t, n, o)), i;
}
function MM(e, t, n) {
	let r = t.pane === "months", i = rN(t.view, n * (r ? 12 : 1));
	return PM(e, NM(i, r ? 4 : 7)) ? FM(e, i) : null;
}
function NM(e, t) {
	return SM(e, "date").slice(0, t);
}
function PM(e, t) {
	return (e.min === null || t >= e.min.slice(0, t.length)) && (e.max === null || t <= e.max.slice(0, t.length));
}
function FM(e, t) {
	let n = NM(t, 7), r = e.min !== null && n < e.min.slice(0, 7) ? e.min : e.max !== null && n > e.max.slice(0, 7) ? e.max : null, i = r === null ? null : xM(r, "date");
	return i === null ? t : eN(i);
}
function IM(e, t, n, r, i) {
	let a = YM(e), o = $M("div", `${q}__weekdays`);
	for (let e = 0; e < 7; e++) {
		let t = $M("span", `${q}__weekday`);
		t.textContent = n.abbreviatedDayNames[(a + e) % 7], o.append(t);
	}
	let s = $M("div", `${q}__days`), c = fj(/* @__PURE__ */ new Date()), l = Zj(e), u = l ? J(e, !1) : r, d = l ? J(e, !0) : null, f = l && cj({
		start: u,
		end: d
	}, t.choosingEnd), p = tN(t.view, a);
	for (let e = 0; e < 42; e++) {
		let n = nN(p, e), r = SM(n, "date"), a = $M("button", wM);
		a.type = "button", a.tabIndex = -1, a.textContent = String(n.getDate()), a.setAttribute(OM, r), n.getMonth() !== t.view.getMonth() && a.classList.add(`${wM}--outside`), iN(n, c) && (a.classList.add(`${wM}--today`), a.setAttribute("aria-current", "date")), i.marked.has(r) && a.classList.add(`${wM}--marked`);
		let o = u !== null && iN(n, u), m = d !== null && iN(n, d);
		a.setAttribute("aria-pressed", o || m ? "true" : "false"), (o || m) && a.classList.add(`${wM}--selected`), f && o && a.classList.add(`${wM}--period-start`), f && m && a.classList.add(`${wM}--period-end`), l && (o || m) && a.setAttribute("aria-description", k.text(o ? "ui.picker.start" : "ui.picker.end")), lj(n, {
			start: u,
			end: d
		}, t.choosingEnd) && a.classList.add(`${wM}--within`), oM(i, r) || (a.disabled = !0), s.append(a);
	}
	let m = $M("div", `${q}__calendar-pane`);
	return m.append(o, s), m;
}
function LM(e, t, n) {
	let r = $M("div", `${q}__months`);
	for (let i = 0; i < 12; i++) {
		let a = $M("button", TM);
		a.type = "button", a.textContent = t.abbreviatedMonthNames[i], a.setAttribute(DM, `month:${i}`), i === e.view.getMonth() && (a.classList.add(`${TM}--selected`), a.setAttribute("aria-current", "true")), PM(n, NM(Ns(e.view.getFullYear(), i, 1), 7)) || (a.disabled = !0), r.append(a);
	}
	let i = [...r.children];
	return F(i, i.find((e) => e.getAttribute("aria-current") === "true" && !e.disabled) ?? i.find((e) => !e.disabled) ?? null), r;
}
function RM(e, t) {
	let n = [...e.parentElement?.querySelectorAll(".ui-temporal-input__month") ?? []], r = n.indexOf(e), i = r === -1 ? null : zM(t, r % EM);
	if (i === null) return null;
	for (let e = r + i.offset; e >= 0 && e < n.length; e += i.step) if (!n[e].disabled) return n[e];
	return null;
}
function zM(e, t) {
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
			offset: EM,
			step: EM
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
function BM(e) {
	let t = $M("div", `${q}__period-caption`);
	return t.textContent = k.text(e.activeEnd === "end" ? "ui.picker.end" : "ui.picker.start"), t;
}
function VM(e, t, n) {
	let r = aM(e);
	if (n.startsWith("month:")) {
		let i = Ns(t.view.getFullYear(), Number(n.slice(6)), 1);
		return PM(r, NM(i, 7)) && (t.view = i, t.pane = "days", t.focusedDay = KM(r, GM(i, t.focusedDay ?? $j(e) ?? vM(e, /* @__PURE__ */ new Date())))), !0;
	}
	switch (n) {
		case "previous": return t.view = MM(r, t, -1) ?? t.view, !0;
		case "next": return t.view = MM(r, t, 1) ?? t.view, !0;
		case "pane": return t.pane = t.pane === "days" ? "months" : "days", !0;
		default: return !1;
	}
}
function HM(e, t, n) {
	if (Zj(e)) {
		UM(e, t, n);
		return;
	}
	let r = dj(n, $j(e) ?? _M(e));
	t.focusedDay = r, t.view = eN(r), sM(e, r, !1);
}
function UM(e, t, n) {
	let r = oj({
		start: J(e, !1),
		end: J(e, !0)
	}, t.activeEnd, dj(n, _M(e)));
	t.focusedDay = r.end ?? r.start, t.view = eN(n), t.activeEnd = r.active, t.choosingEnd = !r.complete, t.hoverDay = null, sM(e, r.end, !0), sM(e, r.start, !1);
}
function WM(e, t, n, r = !1) {
	let i = qM(n), a = JM(t, n, YM(e), r);
	if (a === null) return null;
	let o = aM(e);
	if (i === 0) return KM(o, a);
	let s = a;
	for (let e = 0; e < kM; e++) {
		if (oM(o, SM(s, "date"))) return s;
		s = nN(s, i);
	}
	return t;
}
function GM(e, t) {
	let n = Ns(e.getFullYear(), e.getMonth() + 1, 0).getDate();
	return Ns(e.getFullYear(), e.getMonth(), Math.min(t.getDate(), n), t.getHours(), t.getMinutes(), t.getSeconds());
}
function KM(e, t) {
	let n = SM(t, "date"), r = e.min !== null && n < e.min ? e.min : e.max !== null && n > e.max ? e.max : null, i = r === null ? null : xM(r, "date");
	return i === null ? t : dj(i, t);
}
function qM(e) {
	switch (e) {
		case "ArrowLeft": return -1;
		case "ArrowRight": return 1;
		case "ArrowUp": return -7;
		case "ArrowDown": return 7;
		default: return 0;
	}
}
function JM(e, t, n, r) {
	let i = (e.getDay() - n + 7) % 7;
	switch (t) {
		case "ArrowLeft": return nN(e, -1);
		case "ArrowRight": return nN(e, 1);
		case "ArrowUp": return nN(e, -7);
		case "ArrowDown": return nN(e, 7);
		case "PageUp": return rN(e, r ? -12 : -1);
		case "PageDown": return rN(e, r ? 12 : 1);
		case "Home": return nN(e, -i);
		case "End": return nN(e, 6 - i);
		default: return null;
	}
}
function YM(e) {
	let t = Number(e.getAttribute(Pj));
	return Number.isInteger(t) && t >= 0 && t <= 6 ? t : 1;
}
function XM(e, t, n, r) {
	let i = [...e.querySelectorAll(`.${wM}`)];
	if (i.length === 0) return;
	let a = SM(fj(t.focusedDay ?? n ?? /* @__PURE__ */ new Date()), "date"), o = i.find((e) => e.getAttribute("data-ui-temporal-day") === a && !e.disabled) ?? i.find((e) => !e.disabled);
	o !== void 0 && (F(i, o), r && B(o));
}
function ZM(e, t) {
	let n = t.activeEnd === "end" && t.hoverDay !== null ? J(e, !1) : null, r = t.hoverDay, i = n !== null && r !== null && fj(r).getTime() > fj(n).getTime();
	for (let t of e.querySelectorAll(`.${wM}`)) {
		let e = xM(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		t.classList.toggle(`${wM}--preview`, i && e !== null && sj(e, n, nN(r, 1))), t.classList.toggle(`${wM}--preview-start`, i && e !== null && iN(e, n)), t.classList.toggle(`${wM}--preview-end`, i && e !== null && iN(e, r));
	}
}
function QM(e, t, n) {
	let r = $M("button", `${q}__nav`);
	return r.type = "button", r.textContent = t, r.setAttribute(DM, e), n !== void 0 && r.setAttribute("aria-label", n), r;
}
function $M(e, t) {
	let n = document.createElement(e);
	return n.className = t, n;
}
function eN(e) {
	return Ns(e.getFullYear(), e.getMonth(), 1);
}
function tN(e, t) {
	let n = eN(e);
	return nN(n, -((n.getDay() - t + 7) % 7));
}
function nN(e, t) {
	return Ns(e.getFullYear(), e.getMonth(), e.getDate() + t, e.getHours(), e.getMinutes(), e.getSeconds());
}
function rN(e, t) {
	let n = Ns(e.getFullYear(), e.getMonth() + t, 1), r = Ns(n.getFullYear(), n.getMonth() + 1, 0).getDate();
	return Ns(n.getFullYear(), n.getMonth(), Math.min(e.getDate(), r), e.getHours(), e.getMinutes(), e.getSeconds());
}
function iN(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
//#endregion
//#region src/interactions/temporal-picker-engine.ts
var aN = "ui-temporal-input__field", oN = "ui-temporal-input__popup", sN = "ui-temporal-input--open", cN = "ui-calendar__body", lN = "ui-temporal-input__time-cell", uN = "ui-temporal-input__time-column", dN = 140, fN = "data-ui-temporal-toggle", pN = "data-ui-temporal-unit", mN = "data-ui-temporal-cell", hN = "data-ui-temporal-centred", gN = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	written = /* @__PURE__ */ new WeakSet();
	drawnLanguage = document.documentElement.lang;
	popups = new M_({
		show: ({ owner: e, popup: t }) => {
			e.classList.add(sN), t.addEventListener("wheel", this.onColumnWheel, { passive: !1 }), this.renderSurface(e, !0);
		},
		hide: ({ owner: e, popup: t }) => {
			for (let [t, n] of [...this.columnSettles]) window.clearTimeout(n), this.chooseCentredTime(e, t);
			this.columnSettles.clear(), this.wheelTurns.clear(), t.removeEventListener("wheel", this.onColumnWheel), e.classList.remove(sN);
		}
	});
	columnSettles = /* @__PURE__ */ new Map();
	wheelTurns = /* @__PURE__ */ new Map();
	onColumnWheel = (e) => this.handleColumnWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.arrive(this.root.querySelectorAll(mj)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = Ba(e.components, mj), n = e.propertyName === "Value" || e.propertyName === "EndValue";
			this.applyDisplay(t);
			for (let e of t) n && _N(e) && this.states.set(e, AM(e)), this.isShowing(e) && this.renderSurface(e);
		}), H(this.root, mj, { attributeFilter: [...Lj] }, (e) => {
			for (let t of e) this.applyDisplay([t]), this.isShowing(t) && this.renderSurface(t);
		}), H(this.root, mj, {
			childList: !0,
			addedOnly: !0
		}, (e) => this.arrive(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), this.root.addEventListener("focusin", (e) => this.handleFieldFocus(e), !0), this.root.addEventListener("mouseover", (e) => this.handleDayHover(e), !0), this.root.addEventListener("mouseout", (e) => this.handleDayHover(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("scroll", (e) => this.handleColumnScroll(e), !0), this.root.addEventListener("blur", (e) => this.handleFieldBlur(e), !0), k.onChange(() => this.applyWords());
	}
	arrive(e) {
		let t = [...e];
		this.applyDisplay(t);
		for (let e of t) _N(e) && vN(e)?.firstElementChild === null && this.renderSurface(e);
	}
	applyWords() {
		let e = [...this.root.querySelectorAll(mj)], t = k.temporal;
		if (t !== null && k.language !== this.drawnLanguage) {
			this.drawnLanguage = k.language;
			for (let n of e) qj(n, t);
		}
		this.applyDisplay(e);
		for (let t of e) this.isShowing(t) && this.renderSurface(t);
	}
	get openPicker() {
		return this.popups.current;
	}
	isShowing(e) {
		return e === this.openPicker || _N(e);
	}
	calendarFor(e) {
		if (!(e instanceof Element)) return null;
		let t = e.closest(`.${cN}`)?.closest(".ui-calendar") ?? null;
		if (t !== null) return t;
		let n = this.openPicker;
		return n !== null && vN(n)?.contains(e) === !0 ? n : null;
	}
	applyDisplay(e) {
		for (let t of e) {
			let e = Fs(Bj(t), jN()), n = Es(Bj(t)) ? "numeric" : "text";
			for (let r of t.querySelectorAll(`.${aN}`)) {
				if (r.placeholder !== e && (r.placeholder = e), r.inputMode !== n && (r.inputMode = n), r === document.activeElement && this.written.has(r)) continue;
				this.written.add(r);
				let i = eM(t, Qj(r))?.value ?? "", a = xM(i, zj(t));
				a === null ? i.length === 0 && (r.value = "") : r.value = Ss(a, Bj(t), Gj(t));
			}
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(aN)) return;
		let t = e.target.closest(`.${q}`), n = t === null ? null : eM(t, Qj(e.target));
		if (t === null || n === null) return;
		let r = mM(t, e.target.value), i = xM(r, zj(t)), a = i === null ? r : cM(t, i, Qj(e.target));
		if (yN(t, a)) {
			let n = J(t, Qj(e.target));
			e.target.value = n === null ? "" : Ss(n, Bj(t), Gj(t));
		} else Qj(e.target) && (this.getState(t).choosingEnd = !1), n.value = a, n.dispatchEvent(new Event("change", { bubbles: !0 })), hM(t), this.applyDisplay([t]);
	}
	handleFieldFocus(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(aN)) return;
		let t = e.target.closest(`.${q}`);
		t !== null && Zj(t) && (this.getState(t).activeEnd = Qj(e.target) ? "end" : "start");
	}
	handleDayHover(e) {
		let t = this.calendarFor(e.target);
		if (t === null || !(e.target instanceof Element) || !Zj(t)) return;
		let n = e.type === "mouseover" ? e.target.closest(`[${OM}]`) : null, r = this.getState(t), i = n === null ? null : xM(n.getAttribute("data-ui-temporal-day") ?? "", "date");
		(r.hoverDay?.getTime() ?? null) !== (i?.getTime() ?? null) && (r.hoverDay = i, ZM(t, r));
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`[${OM}], .${lN}`) : null, n = this.calendarFor(t);
		n === null || t === null || t === document.activeElement || t.matches(":disabled") || (t.classList.contains(lN) ? PN(t) : this.followPointer(n, t));
	}
	followPointer(e, t) {
		let n = vN(e), r = xM(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		n !== null && r !== null && n.contains(document.activeElement) && (this.getState(e).focusedDay = r, F([...n.querySelectorAll(`.${wM}`)], t), Tp(t));
	}
	handleFieldBlur(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(aN)) return;
		let t = e.target.closest(`.${q}`);
		t !== null && this.applyDisplay([t]);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${fN}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${q}`));
			return;
		}
		let n = this.calendarFor(e.target);
		if (n === null) return;
		let r = e.target.closest(`[${DM}]`);
		if (r !== null) {
			e.preventDefault(), this.applyNavigation(n, r.getAttribute("data-ui-temporal-nav") ?? "");
			return;
		}
		let i = e.target.closest(`[${OM}]`);
		if (i !== null) {
			e.preventDefault(), this.chooseDay(n, i.getAttribute("data-ui-temporal-day") ?? "");
			return;
		}
		let a = e.target.closest(`[${mN}]`);
		if (a !== null) {
			e.preventDefault();
			let t = a.closest(`[${pN}]`)?.getAttribute(pN);
			t != null && this.chooseTime(n, t, Number(a.getAttribute(mN)));
		}
	}
	applyNavigation(e, t) {
		let n = this.getState(e);
		if (VM(e, n, t)) this.renderSurface(e);
		else switch (t) {
			case "now":
				n.choosingEnd = !1, this.commit(e, _M(e), n.activeEnd === "end");
				return;
			case "clear":
				this.commit(e, null), Zj(e) && this.commit(e, null, !0), n.activeEnd = "start", n.choosingEnd = !1, this.close();
				return;
			case "done":
				this.close();
				return;
			default: return;
		}
	}
	chooseDay(e, t) {
		let n = xM(t, "date");
		if (n === null || M(e) || A(e) || !oM(aM(e), t)) return;
		let r = this.getState(e);
		_N(e) && Zj(e) && !r.choosingEnd && J(e, !1) !== null && J(e, !0) !== null && (r.activeEnd = "start");
		let i = eM(e, !1), a = `${i?.value ?? ""}|${eM(e, !0)?.value ?? ""}`;
		HM(e, r, n), _N(e) && `${i?.value ?? ""}|${eM(e, !0)?.value ?? ""}` === a && i?.dispatchEvent(new Event("change", { bubbles: !0 })), this.applyDisplay([e]), this.renderSurface(e);
	}
	chooseTime(e, t, n) {
		if (!Number.isFinite(n)) return;
		let r = Zj(e) && this.getState(e).activeEnd === "end", i = Wj(J(e, r) ?? _M(e), t, n);
		this.commit(e, i, r);
	}
	commit(e, t, n = !1) {
		sM(e, t, n), hM(e), this.applyDisplay([e]), this.isShowing(e) && this.renderSurface(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || N(e)) return;
		if (e.key === "ArrowDown" && P(e, { alt: !0 }) && e.target instanceof HTMLElement && e.target.classList.contains(aN)) {
			e.preventDefault(), this.toggle(e.target.closest(`.${q}`), Qj(e.target) ? "end" : "start");
			return;
		}
		let t = this.calendarFor(e.target);
		if (t === null) return;
		if (e.target instanceof HTMLElement && e.target.classList.contains(lN)) {
			P(e) && IN(e);
			return;
		}
		if (e.target instanceof HTMLElement && e.target.classList.contains("ui-temporal-input__month")) {
			P(e) && FN(e, e.target);
			return;
		}
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains("ui-temporal-input__day") || !P(e, { shift: e.key === "PageUp" || e.key === "PageDown" })) return;
		let n = xM(e.target.getAttribute("data-ui-temporal-day") ?? "", "date");
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault(), this.chooseDay(t, SM(n, "date"));
			return;
		}
		let r = WM(t, n, e.key, e.shiftKey);
		if (r === null) return;
		e.preventDefault();
		let i = this.getState(t);
		i.focusedDay = r, i.view = eN(r), this.renderSurface(t, !0);
	}
	handleColumnScroll(e) {
		let t = this.openPicker;
		if (t === null || !(e.target instanceof Element)) return;
		let n = e.target.closest(`.${uN}`);
		n !== null && t.contains(n) && (window.clearTimeout(this.columnSettles.get(n)), this.columnSettles.set(n, window.setTimeout(() => {
			this.columnSettles.delete(n), this.chooseCentredTime(t, n);
		}, dN)));
	}
	handleColumnWheel(e) {
		if (this.openPicker === null || e.deltaY === 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${uN}`), n = t?.getAttribute(pN) ?? null;
		if (t === null || n === null || !this.openPicker.contains(t)) return;
		e.preventDefault();
		let { steps: r, carried: i } = Sb(this.wheelTurns.get(n) ?? 0, xb(e).y);
		if (this.wheelTurns.set(n, i), r === 0) return;
		let a = [...t.querySelectorAll(`.${lN}`)].filter((e) => !e.disabled), o = a.findIndex((e) => e.classList.contains(`${lN}--selected`)), s = a[Math.min(a.length - 1, Math.max(0, Math.max(0, o) + r))];
		s !== void 0 && !s.classList.contains(`${lN}--selected`) && this.chooseTime(this.openPicker, n, Number(s.getAttribute(mN)));
	}
	chooseCentredTime(e, t) {
		if (!e.isConnected || !e.contains(t) || M(e) || A(e)) return;
		let n = Number(t.getAttribute(hN));
		if (Number.isFinite(n) && Math.abs(t.scrollTop - n) <= 1) return;
		let r = t.getAttribute(pN), i = EN(t);
		r === null || i === null || i.classList.contains(`${lN}--selected`) || (i.matches(":disabled") ? wN(e) : this.chooseTime(e, r, Number(i.getAttribute(mN))));
	}
	toggle(e, t) {
		let n = e?.querySelector(`.${oN}`) ?? null;
		if (e === null || n === null) return;
		if (this.openPicker === e) {
			this.close();
			return;
		}
		this.close();
		let r = this.getState(e);
		r.activeEnd = Zj(e) ? t ?? (J(e, !1) === null ? "start" : J(e, !0) === null ? "end" : r.activeEnd) : "start", r.hoverDay = null, r.choosingEnd = !1;
		let i = J(e, r.activeEnd === "end") ?? $j(e);
		r.pane = "days", r.view = eN(i ?? vM(e, /* @__PURE__ */ new Date())), r.focusedDay = i;
		let a = e.querySelector(`[${fN}]`);
		this.popups.open({
			owner: e,
			popup: n,
			anchor: e.querySelector(".ui-temporal-input__row") ?? e,
			placement: { placement: "bottom-end" },
			openers: a === null ? [] : [a],
			returnFocus: () => NN(e, this.getState(e).activeEnd === "end")
		});
	}
	close() {
		this.popups.close();
	}
	getState(e) {
		let t = this.states.get(e);
		return t === void 0 && (t = AM(e), this.states.set(e, t)), t;
	}
	renderSurface(e, t = !1) {
		let n = vN(e);
		if (n === null) return;
		let r = _N(e), i = zj(e), a = this.getState(e), o = Gj(e), s = Zj(e), c = J(e, s && a.activeEnd === "end"), l = DN(n), u = ON(n), d = n.contains(document.activeElement);
		if (n.replaceChildren(), s && n.append(BM(a)), r) n.append(jM(e, a, o, c));
		else {
			let t = $M("div", `${q}__panes`);
			t.append(jM(e, a, o, c)), i === "date-time" && t.append(bN(e, c)), n.append(t, AN(i));
		}
		let f = u === null ? null : n.querySelector(`[${DM}="${Yi(u)}"]:not(:disabled)`);
		XM(n, a, c, t || d && l === null && f === null), ZM(e, a), r || (CN(n), wN(n), kN(n, l)), f !== null && B(f), r || this.popups.reposition(e);
	}
};
function _N(e) {
	return e.classList.contains(pj);
}
function vN(e) {
	return e.querySelector(`.${_N(e) ? cN : oN}`);
}
function yN(e, t) {
	let n = aM(e), r = n.markedOnly ? xM(t, zj(e)) : null;
	return r !== null && !n.marked.has(SM(r, "date"));
}
function bN(e, t) {
	let n = Vj(e), r = $M("div", `${q}__time`), i = $M("div", `${q}__time-columns`);
	for (let r of xN(n)) i.append(SN(e, r, Hj(n, r), t));
	return r.append(i), r;
}
function xN(e) {
	return e.unit === "second" ? [
		"hour",
		"minute",
		"second"
	] : e.unit === "hour" ? ["hour"] : ["hour", "minute"];
}
function SN(e, t, n, r) {
	let i = $M("div", uN);
	i.setAttribute(pN, t), i.setAttribute("role", "listbox"), i.setAttribute("aria-label", k.text(t === "hour" ? "ui.picker.hours" : t === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"));
	let a = t === "hour" ? 24 : 60, o = r === null ? null : Uj(r, t), s = t === "hour" && Jj(Bj(e)), c = Gj(e), l = null;
	for (let u = 0; u < a; u += n) {
		let n = $M("button", lN);
		n.type = "button", n.tabIndex = -1, n.textContent = t === "hour" ? Yj(u, s, c) : String(u).padStart(2, "0"), n.setAttribute(mN, String(u)), n.setAttribute("role", "option"), n.setAttribute("aria-selected", u === o ? "true" : "false"), u === o && n.classList.add(`${lN}--selected`), BN(e, t, u, r) ? n.disabled = !0 : (l === null || u === o) && (l = n), i.append(n);
	}
	return l !== null && (l.tabIndex = 0), i;
}
function CN(e) {
	let t = e.querySelector(`.${q}__calendar`), n = e.querySelector(`.${q}__time-columns`);
	t !== null && n !== null && (n.style.maxHeight = `${t.clientHeight}px`);
}
function wN(e) {
	for (let t of e.querySelectorAll(`.${uN}`)) {
		let e = t.querySelector(`.${lN}--selected`) ?? t.firstElementChild;
		if (!(e instanceof HTMLElement)) continue;
		let n = Math.max(0, (t.clientHeight - e.getBoundingClientRect().height) / 2);
		t.style.paddingTop = `${n}px`, t.style.paddingBottom = `${n}px`, TN(t, e), t.setAttribute(hN, String(t.scrollTop));
	}
}
function TN(e, t) {
	let n = t.getBoundingClientRect();
	e.scrollTop += n.top - e.getBoundingClientRect().top - (e.clientHeight - n.height) / 2;
}
function EN(e) {
	let t = e.getBoundingClientRect().top + e.clientHeight / 2, n = null, r = Infinity;
	for (let i of e.querySelectorAll(`.${lN}`)) {
		let e = i.getBoundingClientRect(), a = Math.abs(e.top + e.height / 2 - t);
		a < r && (r = a, n = i);
	}
	return n;
}
function DN(e) {
	let t = document.activeElement;
	return !(t instanceof HTMLElement) || !e.contains(t) || !t.classList.contains(lN) ? null : t.closest(`.${uN}`)?.getAttribute(pN) ?? null;
}
function ON(e) {
	let t = document.activeElement;
	return t instanceof HTMLElement && e.contains(t) ? t.getAttribute(DM) : null;
}
function kN(e, t) {
	if (t === null) return;
	let n = e.querySelector(`.${uN}[${pN}="${t}"]`)?.querySelector(`.${lN}--selected`) ?? null;
	n !== null && B(n);
}
function AN(e) {
	let t = $M("div", `${q}__popup-footer`);
	return t.append(QM("now", k.text(e === "date" ? "ui.picker.today" : "ui.picker.now"))), t.append(QM("clear", k.text("ui.picker.clear"))), t.append(QM("done", k.text("ui.picker.done"))), t;
}
function jN() {
	return {
		year: MN("ui.picker.letter.year", Ps.year),
		month: MN("ui.picker.letter.month", Ps.month),
		day: MN("ui.picker.letter.day", Ps.day),
		hour: MN("ui.picker.letter.hour", Ps.hour),
		minute: MN("ui.picker.letter.minute", Ps.minute),
		second: MN("ui.picker.letter.second", Ps.second)
	};
}
function MN(e, t) {
	let n = k.lookup(e);
	return n === void 0 || n.trim().length === 0 ? t : n;
}
function NN(e, t) {
	for (let n of e.querySelectorAll(`.${aN}`)) if (Qj(n) === t) return n;
	return e.querySelector(`.${aN}`);
}
function PN(e) {
	let t = document.activeElement;
	t instanceof HTMLElement && t.classList.contains(lN) && Tp(e);
}
function FN(e, t) {
	if (!$u(e.key, "both")) return;
	e.preventDefault();
	let n = RM(t, e.key);
	td([...n?.parentElement?.children ?? []], n);
}
function IN(e) {
	let t = e.target, n = t.closest(`.${uN}`);
	if (n === null) return;
	let r = e.key === "ArrowLeft" || e.key === "ArrowRight" ? RN(n, e.key === "ArrowRight" ? 1 : -1) : LN(n, t, e.key);
	r !== null && (e.preventDefault(), r.focus({ preventScroll: !0 }), zN(r));
}
function LN(e, t, n) {
	let r = [...e.querySelectorAll(`.${lN}`)];
	return n === "PageUp" || n === "PageDown" ? Rf(n, r.filter(I), t, "vertical") ?? t : Qu({
		key: n,
		items: r,
		current: t,
		axis: "vertical",
		loop: !1
	});
}
function RN(e, t) {
	let n = [...e.parentElement?.querySelectorAll(`.${uN}`) ?? []], r = n[n.indexOf(e) + t];
	return r === void 0 ? null : r.querySelector(`.${lN}--selected`) ?? r.querySelector(`.${lN}:not(:disabled)`);
}
function zN(e) {
	let t = e.closest(`.${uN}`);
	t !== null && (TN(t, e), t.setAttribute(hN, String(t.scrollTop)));
}
function BN(e, t, n, r) {
	let i = tM(e, Sj), a = tM(e, Cj);
	if (i === null && a === null) return !1;
	let o = Wj(r ?? _M(e), t, n), s = new Date(o), c = new Date(o);
	return t === "hour" ? (s.setMinutes(0, 0, 0), c.setMinutes(59, 59, 999)) : t === "minute" && (s.setSeconds(0, 0), c.setSeconds(59, 999)), i !== null && c.getTime() < i.getTime() || a !== null && s.getTime() > a.getTime();
}
//#endregion
//#region src/rendering/theme-choice.ts
var VN = `[${Gr}="${qr}"] [${Kr}]`, HN = "ui-theme-switcher__label-text--current";
function UN() {
	let e = document.documentElement.getAttribute(Vr);
	return e === "light" || e === "dark" ? e : "auto";
}
function WN(e, t) {
	let n = e.getAttribute(Kr) === t;
	if (e.getAttribute("role") === "option") {
		let t = n ? "true" : "false";
		e.getAttribute("aria-selected") !== t && e.setAttribute("aria-selected", t);
	} else e.classList.toggle(HN, n);
}
//#endregion
//#region src/interactions/popup-list.ts
var GN = new NT();
function KN(e, t, n, r, i = !1, a = !0) {
	let o = r ?? (a ? null : n.find(I) ?? null);
	o !== null && F(n, o);
	let s = e.open({
		...t,
		focus: a && r !== null ? r : !1
	});
	return s && a && r === null && Vp(t.popup, n, i), s;
}
function qN(e, t) {
	let n = e.target instanceof HTMLElement && t.includes(e.target) ? e.target : null, r = PT(e);
	if (r !== null) return e.preventDefault(), td(t, YN(t, n, r)), !0;
	if (!$u(e.key, "vertical") || !P(e)) return !1;
	let i = Qu({
		key: e.key,
		items: t,
		current: n,
		axis: "vertical"
	});
	return i !== null && e.preventDefault(), td(t, i), !0;
}
var JN = {
	character: PT,
	entry: YN
};
function YN(e, t, n) {
	let r = e.filter(I), i = r[0]?.parentElement;
	return i == null ? null : GN.next({
		owner: i,
		character: n,
		entries: r,
		current: t,
		words: Jg,
		context: i
	});
}
function XN(e, t) {
	e !== document.activeElement && I(e) && (F(t, e), Tp(e));
}
//#endregion
//#region src/interactions/switcher-list.ts
var ZN = class {
	parts;
	selector;
	menus;
	constructor(e) {
		this.parts = e, this.selector = `[${e.attribute}]`, this.menus = new M_({
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
		return e.getAttribute(this.parts.attribute) === qr;
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
		KN(this.menus, {
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
		i !== null && t(n, r) && !this.menus.isOpen(n) && (e.key === "ArrowDown" || e.key === "ArrowUp") && P(e) ? (e.preventDefault(), this.open(n, i, e.key === "ArrowUp")) : this.menus.isOpen(n) && qN(e, r);
	}
	handlePointerMove(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${this.parts.choiceClass}`), n = t === null ? null : this.switcherOf(t);
		t !== null && n !== null && this.menus.isOpen(n) && XN(t, this.choicesOf(n));
	}
}, QN = `[${Gr}="${qr}"]`, $N = "ui-theme-switcher__choice", eP = class {
	options;
	root;
	list = new ZN({
		attribute: Gr,
		menuClass: "ui-theme-switcher__menu",
		choiceClass: $N,
		openClass: "ui-theme-switcher--open",
		triggerSelector: `.${Ai}`
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.list.handleKeyDown(e, (e) => this.list.isField(e))), this.root.addEventListener("pointermove", (e) => this.list.handlePointerMove(e)), new MutationObserver(() => this.showTheme()).observe(document.documentElement, {
			attributes: !0,
			attributeFilter: [Vr]
		}), H(this.root, QN, {
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
			e.preventDefault(), this.apply(tP() === "dark" ? "Light" : "Dark");
			return;
		}
		let n = e.target.closest(`.${$N}`);
		if (n !== null) {
			e.preventDefault(), this.choose(t, n.getAttribute(Kr));
			return;
		}
		let r = e.target.closest(`.${Ai}`);
		r === null || A(r) || (e.preventDefault(), this.list.toggle(t, r));
	}
	choose(e, t) {
		this.list.close(e), t !== null && this.apply(t === "light" ? "Light" : t === "dark" ? "Dark" : null);
	}
	apply(e) {
		this.options.effects.apply({
			effect: {
				kind: ea.SetTheme,
				mode: e
			},
			dom: this.options.dom
		});
	}
	showTheme(e) {
		let t = UN();
		if (e === void 0) for (let e of this.root.querySelectorAll(VN)) WN(e, t);
		else for (let n of e) for (let e of n.querySelectorAll(`[${Kr}]`)) WN(e, t);
	}
};
function tP() {
	let e = UN();
	return e === "light" || e === "dark" ? e : window.matchMedia?.("(prefers-color-scheme: dark)").matches === !0 ? "dark" : "light";
}
//#endregion
//#region src/interactions/language-switcher-engine.ts
var nP = `.ui-language-switcher__trigger, .${Ai}`, rP = "ui-language-switcher__label-text", iP = "ui-language-switcher__label-text--current", aP = "ui-language-switcher__label-text--page", oP = "ui-language-switcher__choice", sP = "ui.language.switch", cP = "ui.language.current", lP = class {
	options;
	root;
	list = new ZN({
		attribute: Wr,
		menuClass: "ui-language-switcher__menu",
		choiceClass: oP,
		openClass: "ui-language-switcher--open",
		triggerSelector: nP
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.list.handleKeyDown(e, (e, t) => this.opensList(e, t))), this.root.addEventListener("pointermove", (e) => this.list.handlePointerMove(e)), k.onChange(() => this.showLanguage(k.language));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${oP}`), n = this.list.switcherOf(e.target);
		if (n === null) return;
		if (t !== null) {
			e.preventDefault(), this.choose(n, t.getAttribute(Jr));
			return;
		}
		let r = e.target.closest(nP);
		if (r === null || A(r)) return;
		e.preventDefault();
		let i = this.list.choicesOf(n);
		if (i.length === 2 && !this.list.isField(n)) {
			let e = k.requestedLanguage;
			this.choose(n, i.map((e) => e.getAttribute("data-ui-language")).find((t) => t !== e) ?? null);
		} else this.list.isOpen(n) ? this.list.close(n) : this.opensList(n, i) && this.list.open(n, r);
	}
	opensList(e, t) {
		return this.list.isField(e) ? t.length > 1 : t.length > 2;
	}
	choose(e, t) {
		this.list.close(e), t !== null && t.length !== 0 && this.options.effects.apply({
			effect: {
				kind: ea.SetLanguage,
				language: t
			},
			dom: this.options.dom
		});
	}
	showLanguage(e) {
		for (let t of this.root.querySelectorAll(`[${Wr}]`)) {
			let n = t.querySelector(`:scope > :is(${nP})`);
			if (n === null) continue;
			let r = this.list.choicesOf(t), i = this.list.chosenAttribute(t);
			for (let t of r) t.setAttribute(i, t.getAttribute("data-ui-language") === e ? "true" : "false");
			for (let t of n.querySelectorAll(`.${rP}`)) {
				let n = t.getAttribute(Jr) === e;
				t.classList.toggle(iP, n), t.classList.contains(aP) && t.toggleAttribute("hidden", !n);
			}
			if (this.list.isField(t)) continue;
			let a = uP(Uc(t, Re)), o = (r.find((t) => t.getAttribute("data-ui-language") !== e) ?? r[0]).getAttribute("data-ui-language") ?? "", [s, c] = r.length === 2 ? [sP, {
				language: dP(r, e),
				code: fP(e),
				other: dP(r, o),
				otherCode: fP(o)
			}] : [cP, {
				language: dP(r, e),
				code: fP(e)
			}];
			k.write(n, "aria-label", s, c), a && k.write(t, Re, s, c);
		}
	}
};
function uP(e) {
	return O(e) && (e.key === sP || e.key === cP);
}
function dP(e, t) {
	let n = e.find((e) => e.getAttribute(Jr) === t)?.textContent;
	if (n != null && n.length > 0) return n;
	try {
		let e = new Intl.DisplayNames([t], { type: "language" }).of(t) ?? t;
		return e.charAt(0).toLocaleUpperCase(t) + e.slice(1);
	} catch {
		return fP(t);
	}
}
function fP(e) {
	return e.split("-")[0].toUpperCase();
}
//#endregion
//#region src/interactions/action-bar.ts
var pP = `${Me}__button`, mP = `${Me}__more`, hP = `${pP}--icon`, gP = "ui-text__icon", _P = `.ui-button__content .${gP}`, vP = ".ui-button__content .ui-text__title", yP = /* @__PURE__ */ new WeakMap();
function bP(e) {
	let t = [], n = !1;
	for (let r of e.querySelectorAll(Hn)) xP(r, e) && (r.hasAttribute("data-ui-in-action-bar") && !r.matches("[data-ui-menu-group] > .ui-menu-item") ? t.push(r) : n = !0);
	return {
		entries: t,
		more: n
	};
}
function xP(e, t) {
	for (let n = e; n !== null && n !== t; n = n.parentElement) if (!n.hasAttribute("data-ui-menu-left-out") && getComputedStyle(n).display === "none") return !1;
	return getComputedStyle(e).visibility !== "hidden";
}
function SP(e, t) {
	let n = t.entries.map((e) => CP(e, t));
	return t.more && t.openMore !== void 0 && n.push(TP(t.openMore)), e.replaceChildren(...n), n;
}
function CP(e, t) {
	let n = EP(pP), r = OP(e), i = wP(e);
	return i === null ? n.textContent = r : (n.classList.add(hP), n.append(i), n.setAttribute("aria-label", r)), t.role === "menuitem" && n.setAttribute("role", "menuitem"), A(e) && (n.classList.add(bi), n.setAttribute("aria-disabled", "true")), e.getAttribute("data-ui-menu-item-kind") === "check" && n.setAttribute("aria-pressed", e.getAttribute("aria-checked") === "true" ? "true" : "false"), yP.set(n, e), n.addEventListener("click", () => t.press(e, n)), n;
}
function wP(e) {
	let t = e.querySelector(_P);
	if (t === null || !t.className.split(" ").some(yo)) return null;
	let n = document.createElement("span");
	n.className = t.className, n.classList.remove(gP), n.setAttribute(ho, ""), n.setAttribute("aria-hidden", "true");
	let r = t.style.getPropertyValue(go);
	return r.length > 0 && n.style.setProperty(go, r), n;
}
function TP(e) {
	let t = EP(`${pP} ${mP}`);
	return t.setAttribute("aria-haspopup", "menu"), k.write(t, "aria-label", "ui.actionbar.more"), t.addEventListener("click", () => e(t)), t;
}
function EP(e) {
	let t = document.createElement("button");
	return t.setAttribute("type", "button"), t.className = `${e} ${Fi}`, t.tabIndex = -1, t;
}
function DP(e) {
	return yP.get(e) ?? null;
}
function OP(e) {
	return e.querySelector(vP)?.textContent?.trim() ?? "";
}
//#endregion
//#region src/interactions/long-press.ts
var kP = 500, AP = 150, jP = 10, MP = /* @__PURE__ */ new WeakSet(), NP = "ui-long-press-hold", PP = "ui-long-press-hold-end";
function FP(e) {
	return MP.has(e);
}
var IP = class {
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
		let n = e.target, r = t.clientX ?? 0, i = t.clientY ?? 0, a = this.shows === void 0 ? null : setTimeout(() => this.showHold(), AP);
		this.press = {
			pointerId: t.pointerId ?? 0,
			x: r,
			y: i,
			target: n,
			timer: setTimeout(() => this.fireHeld(), kP),
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
		}, t.dispatchEvent(new CustomEvent(NP, {
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
		(t.part.isConnected ? t.part : this.root).dispatchEvent(new CustomEvent(PP, {
			bubbles: !0,
			detail: n
		}));
	}
	handleMove(e) {
		let t = e, n = this.press, r = this.openedAt;
		r !== null && t.pointerId === r.pointerId && Math.hypot((t.clientX ?? r.x) - r.x, (t.clientY ?? r.y) - r.y) > jP && (this.slid = !0, (this.answered?.closest("[data-ui-splitting]") ?? null) !== null && this.leaveMenuToDrag()), n !== null && t.pointerId === n.pointerId && Math.hypot((t.clientX ?? n.x) - n.x, (t.clientY ?? n.y) - n.y) > jP && this.cancel();
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
		MP.add(t), e.target.dispatchEvent(t), this.answered = t.defaultPrevented ? e.target : null, this.openedAt = this.answered === null ? null : {
			pointerId: e.pointerId,
			x: e.x,
			y: e.y
		}, this.endHold(this.answered !== null);
	}
	handleContextMenu(e) {
		if (MP.has(e)) return;
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
		this.dragging && n !== null && t.clientX !== void 0 && t.clientY !== void 0 && Math.hypot(t.clientX - n.x, t.clientY - n.y) > jP && this.leaveMenuToDrag();
	}
	endDrag() {
		this.dragging = !1;
	}
	handleClick(e) {
		let t = e.target instanceof Element ? e.target : null;
		this.answered === null || t === null || this.slid && t.closest("[data-ui-context-menu]") !== null || (this.answered = null, e.preventDefault(), e.stopImmediatePropagation());
	}
}, LP = [
	th("md"),
	th("xl"),
	th("xxl")
], RP = {
	md: th("md"),
	xl: th("xl"),
	xxl: th("xxl")
}, zP = th("md");
function BP(e, t) {
	return VP(e) && !(e.hasAttribute(On(t)) && !UP(e, t) && HP(zP));
}
function VP(e) {
	let t = e.getAttribute(En);
	if (t === null) return !1;
	let n = RP[t];
	return n === void 0 || !HP(n);
}
function HP(e) {
	return typeof matchMedia == "function" && matchMedia(e).matches;
}
function UP(e, t) {
	return e.querySelector(`:scope > [${Pn}="${Yi(t)}"][${kn}]`) !== null;
}
//#endregion
//#region src/rendering/menu-shape.ts
var WP = "data-ui-menu-rail-list", GP = ["left-side", "right-side"];
function KP(e) {
	let t = e.getAttribute(jn), n = e.classList.contains(Rn);
	if (t === null && !n && !e.hasAttribute(WP)) return !1;
	let r = qP(e, t);
	return e.classList.toggle(Rn, r), e.toggleAttribute(WP, t === null && !r), r !== n;
}
function qP(e, t) {
	let n = JP(e);
	if (n !== null) return !n.hasAttribute("data-ui-rail-drawer") && (t === null || t.split(" ").includes("base"));
	if (t === null) return !0;
	let r = typeof matchMedia == "function" ? rh() : "base";
	return t.split(" ").includes(r);
}
function JP(e) {
	let t = e.closest(`[${Pn}]`), n = t?.getAttribute(Pn), r = t?.parentElement;
	return t === null || n == null || !GP.includes(n) || r == null ? null : BP(r, n) ? t : null;
}
//#endregion
//#region src/state/client-store.ts
var YP = "ne.ui", XP = "boot", ZP = /* @__PURE__ */ new Set(), QP = class {
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
		let r = this.resolveKey(e, XP);
		if (r !== null) try {
			let e = $P(window.localStorage.getItem(r));
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
			return ZP.has(n) || (ZP.add(n), l("client state is not kept for a component with no authored id.", {
				slot: t,
				component: e
			})), null;
		}
		return `${YP}:${n}:${t}`;
	}
};
function $P(e) {
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
var eF = "menu-current", tF = `[${dn}]`;
function nF(e) {
	for (let t = e.closest(tF); t !== null; t = t.parentElement?.closest(tF) ?? null) iF(t);
}
function rF(e) {
	for (let t of e.querySelectorAll(tF)) iF(t);
	nF(e);
}
function iF(e) {
	let t = e.querySelector(`.${Ln}`) !== null;
	e.hasAttribute("data-ui-menu-holds-current") !== t && e.toggleAttribute(mn, t);
}
//#endregion
//#region src/updates/menu-icons.ts
var aF = "menu-icons", oF = "ui-menu__host", sF = `:scope > :not([${gn}]) > .${C}[${Vi}]`;
function cF(e) {
	let t = e.closest(`.${oF}`);
	t !== null && uF(t);
}
function lF(e) {
	for (let t of e.querySelectorAll(`.${oF}`)) uF(t);
}
function uF(e) {
	let t = e.querySelector(sF) !== null;
	e.hasAttribute("data-ui-menu-icons") !== t && e.toggleAttribute(hn, t);
}
//#endregion
//#region src/interactions/menu-group-engine.ts
var dF = "ui-menu__submenu", fF = dn, pF = pn, mF = "data-ui-menu-flyout", hF = `[${mF}], ${Ei}`, gF = "data-ui-menu-unfolded", _F = fn, vF = "left-side", yF = "right-side", bF = "[data-ui-root]", xF = `[${An}] .${S}, .${S}[${jn}]`, SF = [
	th("sm"),
	th("md"),
	th("xl"),
	th("xxl")
], CF = "menu-open-group", wF = V.normal * 5, TF = Ze("click"), EF = class {
	root;
	store = new QP();
	seenCollapsed = /* @__PURE__ */ new WeakMap();
	flyouts = new M_({
		show: ({ owner: e, popup: t }) => {
			e.setAttribute(pF, ""), t.setAttribute(mF, "");
		},
		hide: ({ owner: e, popup: t }) => {
			e.removeAttribute(pF), queueMicrotask(() => Qm(t, wF, () => {
				this.flyouts.isOpen(e) || t.removeAttribute(mF);
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
		let t = this.root.querySelectorAll(`.${S}`);
		jF(t), this.reconcileEach(t);
		for (let e of t) rF(e), lF(e);
		H(this.root, `.${S}`, {
			childList: !0,
			attributeFilter: [un]
		}, (e) => {
			jF(e), this.reconcileEach(e);
			for (let t of e) rF(t), lF(t);
		});
		for (let e of this.root.querySelectorAll(`[${fF}]`)) DF(e);
		if (H(this.root, `[${fF}]`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [pF]
		}, (e) => {
			for (let t of e) DF(t);
		}), typeof matchMedia == "function") {
			for (let e of LP) matchMedia(e).addEventListener("change", () => this.closeBarFlyout());
			for (let e of SF) matchMedia(e).addEventListener("change", () => this.refitShapes());
		}
		H(this.root, bF, { attributeFilter: [On(vF), On(yF)] }, () => this.refitShapes());
	}
	refitShapes() {
		let e = this.root.querySelectorAll(xF);
		jF(e), this.reconcileEach(e);
	}
	closeBarFlyout() {
		let e = this.flyouts.current;
		e !== null && e.closest("[data-ui-bottom-bar]") !== null && this.flyouts.close(e);
	}
	reconcileEach(e) {
		for (let t of e) {
			let e = LF(t), n = this.seenCollapsed.get(t);
			n !== e && (this.seenCollapsed.set(t, e), n === void 0 ? this.restore(t, e) : this.handleCollapsedChange(t, e));
		}
	}
	restore(e, t) {
		t ? this.closeGroups(e) : this.openResolvedGroup(e);
	}
	handleCollapsedChange(e, t) {
		this.flyouts.close(), OF(e), this.closeGroups(e), e.hasAttribute("data-ui-folding") && e.setAttribute(gF, ""), t || this.openResolvedGroup(e);
		for (let t of e.querySelectorAll(`[${fF}]`)) DF(t);
	}
	openResolvedGroup(e) {
		let t = this.groupOf(e.querySelector(`.${Ln}`), e);
		if (t !== null && !t.hasAttribute(_F)) {
			this.openInline(t);
			return;
		}
		let n = e.classList.contains("ui-menu--nested") ? null : this.store.read(e, CF), r = n === null ? null : this.findGroup(e, n);
		r !== null && this.openInline(r);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${C}`), n = this.flyouts.current, r = n === null ? null : this.submenuOf(n);
		if (r !== null && r.contains(e.target)) {
			t !== null && r.contains(t) && MF(t) && this.flyouts.close();
			return;
		}
		let i = t === null ? null : this.ownGroupOf(t);
		if (t === null || i === null) {
			this.flyouts.close();
			return;
		}
		e.preventDefault();
		let a = i.closest(`.${S}`);
		a !== null && (IF(i) ? this.toggleFlyout(a, i, t) : this.toggleInline(a, i));
	}
	toggleInline(e, t) {
		let n = e.classList.contains(zn);
		e.setAttribute(gF, ""), t.closest("[data-ui-menu-searching]") === null ? t.hasAttribute(pF) ? (t.removeAttribute(pF), n || this.store.write(e, CF, null)) : (this.closeGroups(e), this.openInline(t), n || this.store.write(e, CF, t.getAttribute(b))) : t.toggleAttribute(pF);
	}
	openInline(e) {
		e.setAttribute(pF, "");
	}
	closeGroups(e) {
		for (let t of e.querySelectorAll(`[${fF}][${pF}]`)) t.hasAttribute(_F) || t.removeAttribute(pF);
	}
	toggleFlyout(e, t, n) {
		let r = this.submenuOf(t);
		if (r === null) return;
		let i = this.flyouts.isOpen(t);
		if (this.flyouts.close(), i) return;
		OF(e), this.closeGroups(e);
		let a = n.closest(hF) ?? void 0;
		if (!this.flyouts.open({
			owner: t,
			popup: r,
			anchor: n,
			placement: {
				placement: `${kF(e)}-start`,
				surface: a,
				alignEntries: !0
			}
		})) return;
		let o = r.querySelector(`:scope > .${S}`);
		o !== null && !vp() && Vp(o, NF(o));
	}
	findGroup(e, t) {
		for (let n of e.querySelectorAll(`[${fF}]`)) if (n.getAttribute("data-ui-key") === t) return n;
		return null;
	}
	ownGroupOf(e) {
		return e.matches("[data-ui-menu-group] > .ui-menu-item") ? e.parentElement : null;
	}
	groupOf(e, t) {
		let n = e?.closest(`[${fF}]`) ?? null;
		return n !== null && t.contains(n) ? n : null;
	}
	submenuOf(e) {
		return e.querySelector(`:scope > .${dF}`);
	}
};
function DF(e) {
	let t = e.querySelector(`:scope > .${C}`);
	t !== null && (t.setAttribute(TF, ""), t.setAttribute(Qe, ""), t.setAttribute("aria-expanded", e.hasAttribute(pF) ? "true" : "false"), IF(e) ? t.setAttribute("aria-haspopup", "menu") : t.removeAttribute("aria-haspopup"));
}
function OF(e) {
	for (let t of e.querySelectorAll(`[${mF}]`)) t.removeAttribute(mF);
}
function kF(e) {
	return AF(e) ? "top" : e.classList.contains("ui-side--right") ? "left" : e.classList.contains("ui-side--top") ? "bottom" : e.classList.contains("ui-side--bottom") ? "top" : "right";
}
function AF(e) {
	let t = e.closest(`[${kn}]`);
	return e.classList.contains("ui-menu--rail") && t?.parentElement !== null && t?.parentElement !== void 0 && typeof matchMedia == "function" && BP(t.parentElement, vF);
}
function jF(e) {
	for (let t of e) KP(t);
}
function MF(e) {
	let t = e.closest(`.${C}`);
	return t !== null && t.matches(".ui-menu-item:not([data-ui-menu-item-kind=\"header\"], [data-ui-menu-item-kind=\"separator\"])") && !t.matches("[data-ui-menu-group] > .ui-menu-item, .ui-menu-item[data-ui-menu-item-kind=\"check\"]") && !A(t);
}
function NF(e) {
	let t = [];
	for (let n of xd(e)) {
		t.push(n);
		let e = n.matches("[data-ui-menu-group] > .ui-menu-item") ? n.parentElement : null, r = e === null || !e.hasAttribute(pF) || IF(e) ? null : e.querySelector(`:scope > .${dF} > .${S}`);
		r !== null && t.push(...NF(r));
	}
	return t;
}
function PF(e) {
	let t = FF(e), n = t?.closest(".ui-menu") ?? null;
	return t === null || n === null || IF(t) ? e : PF(n);
}
function FF(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(dF) && t.parentElement?.hasAttribute(fF) === !0 ? t.parentElement : null;
}
function IF(e) {
	let t = e.closest(`.${S}`);
	return e.hasAttribute(_F) || t !== null && LF(t);
}
function LF(e) {
	return e.hasAttribute("data-ui-collapsed") || e.classList.contains("ui-menu--rail");
}
var RF = "tabs:rename", zF = "tabs:pin", BF = "tabs:unpin", VF = "tabs:close", HF = "tabs:delete";
function UF(e) {
	let t = (e ?? "").split(/\s+/);
	return {
		rename: t.includes("rename"),
		pin: t.includes("pin"),
		close: t.includes("close"),
		delete: t.includes("delete")
	};
}
function WF(e, t) {
	let n = !t.pinned && t.removable;
	return /* @__PURE__ */ new Map([
		[RF, e.rename && t.renamable],
		[zF, e.pin && !t.pinned],
		[BF, e.pin && t.pinned],
		[VF, e.close && !e.delete && n],
		[HF, e.delete && n]
	]);
}
function GF(e) {
	let t = e.map(() => !1), n = !1, r = -1;
	for (let i = 0; i < e.length; i++) e[i] === "rule" ? n && r === -1 && (r = i) : e[i] === "shown" && (r !== -1 && (t[r] = !0), r = -1, n = !0);
	return t;
}
function KF(e, t) {
	return typeof e == "string" ? [...t, e] : null;
}
//#endregion
//#region src/interactions/context-menu-engine.ts
var qF = Se, JF = "ui-context-menu--open", YF = `${Me}--strip`, XF = `.${Me}:not(.${YF}) > .${mP}`, ZF = "ui-context-menu-opening", QF = null, $F = /* @__PURE__ */ new WeakSet();
function eI(e) {
	QF = e;
}
var tI = class {
	root;
	components;
	closed = null;
	menus = new M_({
		show: ({ popup: e }) => e.classList.add(JF),
		hide: ({ popup: e }, t) => {
			e.classList.remove(JF), this.closed = e, t === "outside" && xI();
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e),
		onPress: !0,
		onWindowBlur: !0,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, new IP({
			root: this.root,
			first: typeof window > "u" ? void 0 : window,
			holds: (e) => e.closest("[data-ui-context-menu-owner]") !== null && !Ru(e),
			closeMenu: () => this.menus.close(this.menus.current, "outside"),
			shows: iI
		}), this.root.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), this.root.addEventListener("click", (e) => this.handleInside(e), !1);
	}
	get openMenu() {
		let e = this.menus.current;
		return e === null ? null : this.menus.popupOf(e);
	}
	handleContextMenu(e) {
		if (!(e instanceof MouseEvent) || !(e.target instanceof Element)) return;
		let t = !vp() && !FP(e), n = (t ? oI() : null) ?? e.target;
		if (this.openMenu !== null && e.composedPath().includes(this.openMenu)) {
			e.preventDefault();
			return;
		}
		let r = nI(n);
		if (r === null) return;
		e.preventDefault();
		let i = mI(e) ? n : null, a = n.closest(XF), o = t ? sI(n) : null, s = () => this.open(r.owner, r.menu, e.clientX, e.clientY, i, a, o);
		$F.delete(r.menu) ? queueMicrotask(s) : s();
	}
	open(e, t, n, r, i, a, o) {
		this.menus.close(), t.querySelector(`:scope > .${YF}`)?.remove(), hI(t), i !== null && gI(e, t, i), a?.closest("[data-ui-action-bar]")?.hasAttribute("data-ui-action-bar-rest") === !0 && vI(t), this.closed !== null && (Zm(this.closed), this.closed = null);
		let s = (document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null) ?? _p(), c = a ?? o, l = {
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
			returnFocus: () => (s === null ? null : Hp(s, this.components)) ?? Hp(e, this.components)
		}) && (c === null && ag(t, n, r), bI(t));
	}
	handleInside(e) {
		this.openMenu !== null && e.composedPath().includes(this.openMenu) && e.target instanceof Element && MF(e.target) && this.menus.close();
	}
};
function nI(e) {
	for (let t of rI(e)) {
		let n = lI(t, e).find((t) => fI(t, e, !1));
		if (n !== void 0) return {
			owner: t,
			menu: n
		};
	}
	return null;
}
function* rI(e) {
	let t = e.closest(`[${ue}]`);
	for (let n = e.closest(`[${Ce}]`); n !== null; n = n.parentElement?.closest("[data-ui-context-menu-owner]") ?? null) {
		if (t !== null && n.contains(t)) return;
		if (uI(n, e) && !A(n)) {
			if (CI(n)) return;
			yield n;
		}
	}
}
function iI(e) {
	let t = rI(e).next();
	if (t.done === !0) return null;
	let n = t.value, r = e.closest(Td);
	return r !== null && r !== n && n.contains(r) ? R(r) ?? r : n;
}
var aI = `[${Ce}]`;
function oI() {
	let e = document.activeElement;
	if (e === null || e === document.body) return null;
	let t = sf(e);
	if (t === null || t.row !== null && t.row !== e) return e;
	let n = t.row ?? mf(t.root);
	return n === null ? t.root : cI(n);
}
function sI(e) {
	let t = e.closest(Td);
	return t === null ? e : R(t) ?? t;
}
function cI(e) {
	if (e.matches(aI)) return e;
	for (let t of e.querySelectorAll(aI)) if (t.closest(Td) === e) return t;
	return e;
}
function lI(e, t) {
	return dI(e, t).map((t) => SI(e, t)).filter((e) => e !== null);
}
function uI(e, t) {
	return dI(e, t).some((t) => SI(e, t, !1) !== null || t.length === 0 && e.hasAttribute("data-ui-context-menu-later"));
}
function dI(e, t) {
	let n = t.closest(`[${Ee}]`), r = n !== null && e.contains(n) ? n.getAttribute("data-ui-context-menu-use") ?? "" : "";
	return r.length > 0 ? [r, ""] : [""];
}
function fI(e, t, n) {
	let r = new CustomEvent(ZF, {
		bubbles: !0,
		cancelable: !0,
		detail: {
			target: t,
			actionBar: n
		}
	});
	return e.dispatchEvent(r);
}
function pI(e, t) {
	let n = e.closest(`[${Ce}]`), r = e.closest(`[${ue}]`);
	return n === null || A(n) || CI(n) || r !== null && n.contains(r) ? null : lI(n, e).find((n) => fI(n, e, t)) ?? null;
}
function mI(e) {
	let t = e.pointerType;
	return FP(e) ? !0 : typeof t == "string" && t.length > 0 ? t === "touch" : yp();
}
function hI(e) {
	for (let t of e.querySelectorAll(`[${Ae}]`)) t.removeAttribute(Ae);
}
function gI(e, t, n) {
	let r = n.closest(`[${De}]`);
	if (r === null || n.closest(".ui-action-bar") !== null || !e.contains(r) || !lI(e, r).includes(t)) return;
	let { entries: i } = bP(t);
	if (i.length === 0) return;
	let a = document.createElement("div");
	a.className = `${Me} ${YF}`, a.setAttribute("role", "group"), SP(a, {
		entries: i,
		more: !1,
		role: "menuitem",
		press: _I
	}), t.insertBefore(a, t.firstElementChild);
}
function _I(e) {
	A(e) || e.click();
}
function vI(e) {
	let { entries: t } = bP(e), n = e.querySelector(`.${S}`);
	if (t.length === 0 || n === null) return;
	for (let e of t) yI(e);
	let r = bd(n, `.${C}`, `.${S}`).filter((t) => t.closest("[data-ui-menu-left-out]") === null && xP(t, e)), i = [];
	for (let [e, t] of r.entries()) {
		let n = r[e + 1];
		t.getAttribute("data-ui-menu-item-kind") === "header" && (n === void 0 || n.matches("[data-ui-menu-item-kind=\"header\"], [data-ui-menu-item-kind=\"separator\"]")) ? yI(t) : i.push(t);
	}
	let a = i.map((e) => {
		let t = e.getAttribute(Fn);
		return t === "separator" ? "rule" : t === "header" ? "hidden" : "shown";
	});
	GF(a).forEach((e, t) => {
		a[t] === "rule" && !e && yI(i[t]);
	});
}
function yI(e) {
	let t = e.parentElement;
	(t !== null && t.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t : e).setAttribute(Ae, "");
}
function bI(e) {
	let t = e.querySelector(`.${S}`);
	t !== null && Vp(e, NF(t));
}
function xI() {
	let e = (e) => {
		e.target instanceof Element && e.target.closest(`${tp}, [contenteditable='true']`) === null && e.preventDefault();
	};
	document.addEventListener("mousedown", e, {
		capture: !0,
		once: !0
	}), setTimeout(() => document.removeEventListener("mousedown", e, !0));
}
function SI(e, t, n = !0) {
	for (let n of e.querySelectorAll(`[${qF}]`)) if ((n.getAttribute(qF) ?? "") === t && n.closest("[data-ui-context-menu-owner]") === e) return n;
	if (!n || t.length > 0 || QF === null || !e.hasAttribute("data-ui-context-menu-later")) return null;
	let r = QF(e);
	return r !== null && $F.add(r), r;
}
function CI(e) {
	if (e.hasAttribute("data-ui-no-context-menu")) return !0;
	let t = e.closest(`[${x}]`);
	if (t === null) return !1;
	let n = e;
	for (; n.parentElement !== null && n.parentElement !== t;) n = n.parentElement;
	return al(n, "data-ui-no-context-menu") || t.closest("[data-ui-id]")?.hasAttribute("data-ui-no-context-menu") === !0;
}
//#endregion
//#region src/interactions/element-visibility.ts
function wI(e, t) {
	let n = getComputedStyle(e), r = t ? n.overflowY : n.overflowX;
	return r === "auto" || r === "scroll";
}
function TI(e) {
	return getComputedStyle(e).display !== "none";
}
function EI(e) {
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
				if (e.overflowX !== "visible" && kI(n, i, i + t.clientWidth, !0), e.overflowY !== "visible" && kI(n, a, a + t.clientHeight, !1), AI(n)) return !0;
			}
			r = e.position;
		}
	}
	return kI(n, 0, window.innerWidth, !0), kI(n, 0, window.innerHeight, !1), AI(n);
}
function DI(e) {
	let t = getComputedStyle(e).position;
	for (let n = e.parentElement; n !== null && t !== "fixed"; n = n.parentElement) {
		let e = getComputedStyle(n);
		if (t !== "absolute" || e.position !== "static" || e.transform !== "none") {
			if ((!n.classList.contains("ui-scroll-y--disabled") || wI(n, !1)) && (OI(e.overflowX) || OI(e.overflowY))) return n;
			t = e.position;
		}
	}
	return null;
}
function OI(e) {
	return e === "hidden" || e === "auto" || e === "scroll";
}
function kI(e, t, n, r) {
	r ? (e.left = Math.max(e.left, t), e.right = Math.min(e.right, n)) : (e.top = Math.max(e.top, t), e.bottom = Math.min(e.bottom, n));
}
function AI(e) {
	return e.left > e.right || e.top > e.bottom;
}
//#endregion
//#region src/interactions/action-bar-engine.ts
var jI = `[${De}]`, MI = `.${Me}`, NI = `${Me}--out`, PI = `.ui-items-view__item, .${ir}`, FI = "ui-tree__node", II = 6, LI = "--ui-action-bar-gap", RI = 400, zI = /* @__PURE__ */ new WeakMap(), BI = [
	"class",
	"style",
	"hidden",
	"aria-disabled",
	"aria-checked",
	je,
	..._i
], VI = class {
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
		if (n === null || n.closest(`${MI}, [data-ui-context-menu]`) !== null) return;
		let r = HI(n), i = r !== null && r !== this.chosen && UI(n, r) ? null : r;
		t.pointerType === "touch" ? this.pendingTap = {
			pointerId: t.pointerId ?? 0,
			host: i,
			identity: i === null ? null : YI(i)
		} : (t.button ?? 0) === 0 ? i !== null && i === this.chosen ? this.askAgain(i) : this.choose(i) : r !== this.chosen && this.choose(null);
	}
	handlePointerUp(e) {
		let t = this.pendingTap;
		if (this.pendingTap = null, t !== null && t.pointerId === (e.pointerId ?? 0)) {
			let e = t.host !== null && !t.host.isConnected && t.identity !== null ? XI(t.identity) : t.host;
			e !== null && e === this.chosen ? this.askAgain(e) : this.choose(e);
		}
		this.chosen !== null && (this.chosen.isConnected && !this.shown.has(this.chosen) || Dg(this.chosen)) && this.sync();
	}
	handleContextMenu(e) {
		this.pendingTap = null, e instanceof MouseEvent && e.target instanceof Element && e.target.closest(MI) === null && mI(e) && this.choose(null);
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement ? e.target : null;
		if (t === null) return;
		let n = t.closest(MI);
		n === null ? vp() || this.isInOpenMenu(t) || this.menuHost !== null && t.contains(this.menuHost) || this.choose(qI(t)) : this.isHostedBar(n) && F(iL(n), t);
	}
	handleFocusOut(e) {
		let t = e.relatedTarget, n = t instanceof Element ? t.closest(MI) : null;
		n !== null && this.isHostedBar(n) && e.target instanceof HTMLElement && !n.contains(e.target) && (this.cameFrom = e.target);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || !(e.target instanceof HTMLElement)) return;
		let t = e.target;
		if (e.defaultPrevented) {
			t.matches(L) && this.choose(qI(t));
			return;
		}
		let n = t.closest(MI);
		if (n !== null && t.classList.contains(pP)) this.handleBarKey(e, n, t);
		else if (e.key === "Escape") {
			if (Ou(e)) return;
			let n = t.closest(Cg);
			(n === null || this.chosen !== null && n.contains(this.chosen)) && (this.chosen !== null && e.preventDefault(), this.choose(null));
		} else if (e.key === "Tab" && P(e) && t.matches(L)) {
			let n = this.chosen === null ? null : this.tabStopOf(this.chosen);
			n !== null && t.contains(n) && (e.preventDefault(), n.focus());
		} else t.matches(L) && this.choose(qI(t));
	}
	handleBarKey(e, t, n) {
		if (!P(e, { shift: !0 })) return;
		if (e.key === "Escape") {
			if (!this.isHostedBar(t)) return;
			let n = this.hostOfBar(t), r = this.cameFrom !== null && this.cameFrom.isConnected && cL(this.cameFrom) && n !== null && (n.contains(this.cameFrom) || this.cameFrom.contains(n)) ? this.cameFrom : Hp(n, this.components);
			e.preventDefault(), r?.focus();
			return;
		}
		let r = iL(t), i = Qu({
			key: e.key,
			items: r,
			current: n,
			axis: "horizontal"
		});
		i !== null && (e.preventDefault(), td(r, i));
	}
	choose(e) {
		(e === null ? this.chosen === null && this.identity === null : e === this.chosen) || (this.chosen = e, this.identity = e === null ? null : YI(e), this.watchScope(), this.sync(), e !== null && this.makeRoomAbove(e));
	}
	makeRoomAbove(e) {
		let t = this.shown.get(e), n = DI(e);
		if (t === void 0 || n === null || !wI(n, !0)) return;
		let r = Math.max(0, n.getBoundingClientRect().top + n.clientTop), i = Math.ceil(t.bar.getBoundingClientRect().height + QI(e) - (e.getBoundingClientRect().top - r));
		i <= 0 || i > n.scrollTop || (n.scrollTop -= i, jh(t.bar), this.markOut());
	}
	askAgain(e) {
		let t = this.shown.get(e);
		t === void 0 ? this.sync() : pI(e, !0) === null && this.hide(e, t);
	}
	watchScope() {
		this.scopeObserver?.disconnect(), this.scopeObserver = null, this.identity !== null && (this.scopeObserver = new MutationObserver((e) => {
			fg(e) || this.scopeChanged();
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
				this.chosen = XI(e), this.sync();
			}
			for (let e of this.shown.values()) jh(e.bar);
			this.markOut();
		}
	}
	sync() {
		this.chosen !== null && Dg(this.chosen) && (this.chosen = null, this.identity = null, this.watchScope());
		for (let [e, t] of this.shown) (e !== this.chosen && e !== this.menuHost || !e.isConnected) && this.hide(e, t);
		for (let e of [this.chosen, this.menuHost]) e !== null && e.isConnected && !this.shown.has(e) && this.show(e);
	}
	show(e) {
		let t = pI(e, !0);
		if (t === null) return;
		let n = document.createElement("div");
		if (n.className = Me, n.setAttribute("role", "toolbar"), k.write(n, "aria-label", "ui.actionbar.label"), n.setAttribute(Qe, ""), n.setAttribute(fe, ""), !eL(n, t, (t) => this.openMore(e, t), !1)) return;
		e.insertBefore(n, rL(e)), bh(e, n, {
			placement: ZI(e),
			gap: QI(e),
			boundary: DI(e) ?? void 0
		}), n.classList.toggle(NI, EI(e));
		let r = new MutationObserver((t) => {
			fg(t) || this.redraw(e);
		});
		r.observe(t, {
			subtree: !0,
			childList: !0,
			characterData: !0,
			attributes: !0,
			attributeFilter: BI
		});
		let i = $I(e);
		i?.setAttribute(Pr, ""), this.shown.set(e, {
			bar: n,
			menu: t,
			observer: r,
			row: i
		}), zI.set(n, Date.now());
	}
	redraw(e) {
		let t = this.shown.get(e);
		if (t === void 0) return;
		let n = document.activeElement, r = n instanceof HTMLElement && t.bar.contains(n) ? n : null, i = r === null ? null : DP(r);
		if (!eL(t.bar, t.menu, (t) => this.openMore(e, t), e === this.menuHost)) {
			this.hide(e, t);
			return;
		}
		if (r === null) return;
		let a = iL(t.bar);
		td(a, a.find((e) => DP(e) === i) ?? a.find(I) ?? null);
	}
	openMore(e, t) {
		let n = this.shown.get(e);
		if (n === void 0 || oL(t)) return;
		if (this.menuHost = e, sL(t), !n.menu.classList.contains("ui-context-menu--open")) {
			this.menuHost = null;
			return;
		}
		tL(n.bar, !0);
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
		tL(t.bar, !1);
		let n = document.activeElement;
		!vp() && (n === null || n === document.body || e.contains(n) || n.contains(e)) && nL(t.bar)?.focus();
	}
	hide(e, t) {
		t.observer.disconnect(), Mh(t.bar), t.bar.remove(), this.shown.delete(e), t.row !== null && ![...this.shown.values()].some((e) => e.row === t.row) && t.row.removeAttribute(Pr);
	}
	markOut() {
		for (let [e, t] of this.shown) t.bar.classList.toggle(NI, EI(e));
	}
	isInOpenMenu(e) {
		for (let t of this.shown.values()) if (t.menu.classList.contains("ui-context-menu--open") && t.menu.contains(e)) return !0;
		return !1;
	}
	tabStopOf(e) {
		let t = this.shown.get(e);
		return t === void 0 ? null : iL(t.bar).find((e) => e.tabIndex === 0) ?? null;
	}
	isHostedBar(e) {
		return this.hostOfBar(e) !== null;
	}
	hostOfBar(e) {
		for (let [t, n] of this.shown) if (n.bar === e) return t;
		return null;
	}
};
function HI(e) {
	let t = e.closest(jI);
	if (t !== null) return t;
	let n = e.closest(`[${b}]`), r = e.closest(w);
	return n === null || r !== null && !r.contains(n) ? null : JI(n)[0] ?? null;
}
function UI(e, t) {
	let n = Zu(e, t.closest("[data-ui-key]") ?? t);
	return n !== null && !GI(n, t);
}
var WI = `[${Se}], .${Me}, ${ki}`;
function GI(e, t) {
	if (e.contains(t)) return !0;
	for (let n = e; n !== t;) {
		let e = n.parentElement;
		if (e === null) return !1;
		let t = KI(e) - KI(n);
		for (let r of e.children) if (r !== n) {
			if (!r.matches(WI)) return !1;
			t -= KI(r);
		}
		if (t > 0) return !1;
		n = e;
	}
	return !0;
}
function KI(e) {
	return (e.textContent ?? "").replace(/s+/g, "").length;
}
function qI(e) {
	if (e instanceof HTMLElement && e.matches(L)) {
		let t = mf(e), n = t === null ? void 0 : JI(t)[0];
		if (n !== void 0) return n;
	}
	return e.closest(jI);
}
function JI(e) {
	let t = [...e.querySelectorAll(jI)];
	return e.matches(jI) ? [e, ...t] : t;
}
function YI(e) {
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
		index: JI(n).indexOf(e)
	};
}
function XI(e) {
	for (let t of e.scope.children) if (t.getAttribute(e.attribute) === e.key) return JI(t)[e.index] ?? null;
	return null;
}
function ZI(e) {
	let t = e.getAttribute(De);
	if (t === "center") return "top";
	let n = getComputedStyle(e).direction === "rtl";
	return t === "start" === n ? "top-end" : "top-start";
}
function QI(e) {
	let t = Number.parseFloat(getComputedStyle(e).getPropertyValue(LI));
	return Number.isFinite(t) ? t : II;
}
function $I(e) {
	if (e.classList.contains("ui-table__row")) return e;
	let t = e.parentElement;
	if (t === null) return null;
	if (t.matches(PI)) return t;
	let n = t.parentElement;
	return t.classList.contains(FI) && n !== null && n.classList.contains("ui-tree__row") ? n : null;
}
function eL(e, t, n, r) {
	let { entries: i, more: a } = bP(t);
	if (i.length === 0 && !a) return !1;
	let o = SP(e, {
		entries: i,
		more: a,
		role: "button",
		press: aL,
		openMore: n
	});
	return F(o, o.find((e) => !A(e)) ?? o[0] ?? null), tL(e, r), !0;
}
function tL(e, t) {
	nL(e)?.setAttribute("aria-expanded", t ? "true" : "false");
}
function nL(e) {
	return iL(e).find((e) => DP(e) === null) ?? null;
}
function rL(e) {
	for (let t of e.children) if (t.hasAttribute("data-ui-context-menu")) return t;
	return null;
}
function iL(e) {
	return [...e.querySelectorAll(`:scope > .${pP}`)];
}
function aL(e, t) {
	if (A(t) || oL(t)) return;
	let n = pI(t, !1);
	n !== null && n.contains(e) && !A(e) && xP(e, n) && e.click();
}
function oL(e) {
	let t = e.closest(MI), n = t === null ? void 0 : zI.get(t);
	return n !== void 0 && yp() && Date.now() - n < RI;
}
function sL(e) {
	let t = e.getBoundingClientRect();
	e.dispatchEvent(new MouseEvent("contextmenu", {
		bubbles: !0,
		cancelable: !0,
		button: 2,
		clientX: t.left,
		clientY: t.bottom
	}));
}
function cL(e) {
	return e.matches(tp) || e.hasAttribute("tabindex");
}
//#endregion
//#region src/interactions/tooltip-engine.ts
var lL = "ui-tooltip", uL = "ui-tooltip", dL = "ui-tooltip--visible", fL = "ui-tooltip--linked", pL = "[aria-haspopup][aria-expanded=\"true\"]", mL = "a[href], button, input, select, textarea, label, [role='button'], [role='link'], [tabindex]", hL = "top", gL = 250, _L = 200, vL = 300, yL = 7, bL = null, xL = null, SL = null, CL = null, wL = null, TL = 0, EL = null, DL = 0, OL = 0, kL = !1, AL = /* @__PURE__ */ new Set();
function jL(e) {
	AL.add(e);
}
function ML(e = document) {
	if (kL) return;
	kL = !0;
	let t = e instanceof Document ? e : document;
	t.addEventListener("pointerover", NL, !0), t.addEventListener("pointerout", IL, !0), t.addEventListener("focusin", RL, !0), t.addEventListener("focusout", zL, !0), t.addEventListener("scroll", FL, !0), t.addEventListener("pointerdown", VL, !0), t.addEventListener("click", GL, !0), new IP({
		root: t,
		first: window,
		holds: UL,
		answer: WL
	}), window.addEventListener("keydown", BL, !0), window.addEventListener("blur", hR);
}
function NL(e) {
	if (PL(), qL(e.target)) {
		window.clearTimeout(DL);
		return;
	}
	let t = JL(e.target);
	t !== null && t !== xL && $L(t);
}
function PL() {
	xL === null || xL.isConnected || hR();
}
function FL(e) {
	if (PL(), xL === null) return;
	let t = e.target;
	t instanceof Node && !(t instanceof Document) && !t.contains(xL) || EI(xL) && hR();
}
function IL(e) {
	if (CL !== null || wL !== null) return;
	let t = e.relatedTarget, n = xL ?? EL?.target ?? null, r = n === null ? null : LL(n);
	t instanceof Node && (r !== null && r.contains(t) || qL(t)) || (qL(e.target) || r !== null && e.target instanceof Node && r.contains(e.target)) && gR(!1);
}
function LL(e) {
	let t = e.parentElement?.closest("[data-ui-tooltip-mark]") ?? null;
	return t !== null && YL(t) === e ? t : e;
}
function RL(e) {
	if (e.target instanceof Element && e.target.hasAttribute("data-ui-pointer-focus")) return;
	let t = JL(e.target);
	t !== null && (CL = e.target instanceof Element && e.target.closest("[data-ui-tooltip-mark]") !== null ? t : null, eR(t));
}
function zL(e) {
	JL(e.target) === xL && hR();
}
function BL(e) {
	e.key !== "Escape" || xL === null || e.defaultPrevented || (Ou(e) || e.preventDefault(), hR());
}
function VL(e) {
	if (qL(e.target)) return;
	let t = KL(e.target);
	if (t !== null) {
		if (wL === t) {
			gR(!0);
			return;
		}
		hR(), eR(t), wL = xL;
	} else CL === null && gR(!0);
}
var HL = `[${Ce}]`;
function UL(e) {
	let t = e.closest(HL) === null && !Ru(e) ? JL(e) : null;
	return t !== null && !t.hasAttribute("data-ui-tooltip-press");
}
function WL(e) {
	let t = JL(e);
	return t !== null && (hR(), eR(t), wL = xL, !0);
}
function GL(e) {
	KL(e.target) !== null && e.preventDefault();
}
function KL(e) {
	let t = JL(e);
	if (t === null || !t.hasAttribute("data-ui-tooltip-press") || !(e instanceof Element)) return null;
	let n = e.closest(mL);
	return n === null || n.contains(t) ? t : null;
}
function qL(e) {
	return bL !== null && e instanceof Node && bL.contains(e);
}
function JL(e) {
	if (!(e instanceof Element)) return null;
	let t = YL(e);
	for (let n of AL) {
		let r = n.anchor(e);
		if (r !== null && (t === null || t !== r && t.contains(r)) && QL(r).length > 0) return r;
	}
	return t;
}
function YL(e) {
	let t = e.closest(`[${Re}], [${Be}]`);
	if (t === null) return null;
	let n = t.hasAttribute("data-ui-tooltip") ? t : t.querySelector("[data-ui-tooltip][data-ui-tooltip-severity]") ?? t.querySelector("[data-ui-tooltip]");
	return n === null ? null : (n.getAttribute("data-ui-tooltip") ?? "").trim().length > 0 ? n : null;
}
function XL(e) {
	let t = (e.getAttribute("data-ui-tooltip") ?? "").trim();
	return t.length > 0 ? t + ZL(e) : QL(e);
}
function ZL(e) {
	let t = "";
	for (let n of AL) {
		let r = n.anchor(e) === e ? n.after?.(e)?.trim() ?? "" : "";
		r.length > 0 && (t += ` ${r}`);
	}
	return t;
}
function QL(e) {
	for (let t of AL) {
		if (t.anchor(e) !== e) continue;
		let n = t.words(e)?.trim() ?? "";
		if (n.length > 0) return n;
	}
	return "";
}
function $L(e, t) {
	CL === null && wL === null && (window.clearTimeout(DL), EL !== null && EL.target === e ? EL.words = t : (window.clearTimeout(TL), EL = null, xL === null ? Date.now() - OL < vL ? eR(e, t) : (EL = {
		target: e,
		words: t
	}, TL = window.setTimeout(() => {
		let e = EL;
		EL = null, e !== null && eR(e.target, e.words);
	}, gL)) : (gR(!0), eR(e, t))));
}
function eR(e, t) {
	let n = (t ?? XL(e)).trim();
	if (n.length === 0 || !e.isConnected || !TI(e) || rR(e) || EI(e)) return;
	window.clearTimeout(TL), window.clearTimeout(DL), EL = null;
	let r = _R();
	Fo(r, n, { staticFolds: !0 }), r.classList.toggle(fL, r.querySelector("a[href]") !== null), r.classList.add(dL), xL = e, aR(iR(e)), r.setAttribute("data-ui-tooltip-text", No(n)), cR(r, e.getAttribute(Ve)), yh(e, r), bh(e, r, {
		placement: mR(e),
		gap: yL,
		arrow: !0
	}), nR();
}
var tR = null;
function nR() {
	typeof MutationObserver < "u" && (tR ??= new MutationObserver(PL), tR.observe(document.documentElement, {
		childList: !0,
		subtree: !0
	}));
}
function rR(e) {
	return e.matches(pL) || e.querySelector(pL) !== null || e.querySelector(":scope > .ui-action-bar") !== null;
}
function iR(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t) ? t : e;
}
function aR(e) {
	SL !== null && SL !== e && oR();
	let t = sR(e);
	t.includes(uL) || e.setAttribute("aria-describedby", [...t, uL].join(" ")), SL = e;
}
function oR() {
	if (SL === null) return;
	let e = sR(SL).filter((e) => e !== uL);
	e.length === 0 ? SL.removeAttribute("aria-describedby") : SL.setAttribute("aria-describedby", e.join(" ")), SL = null;
}
function sR(e) {
	return (e.getAttribute("aria-describedby") ?? "").split(" ").filter((e) => e.length > 0);
}
function cR(e, t) {
	t === null ? e.removeAttribute(Ve) : e.setAttribute(Ve, t);
}
function lR(e, t, n) {
	let r = n?.plain === !0 ? Po(t) : t;
	n?.delay === !0 && xL !== e ? $L(e, r) : eR(e, r);
}
function uR() {
	gR(!0);
}
var dR = {
	show: lR,
	hide: uR,
	escape: Po
};
function fR(e) {
	CL = e, eR(e);
}
function pR(e) {
	xL === e && ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0 ? hR() : eR(e));
}
function mR(e) {
	if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) for (let t of AL) {
		let n = t.anchor(e) === e ? t.placement?.(e) ?? null : null;
		if (n !== null) return n;
	}
	let t = e.getAttribute(ze);
	return t !== null && lh(t) ? t : hL;
}
function hR() {
	CL = null, gR(!0);
}
function gR(e) {
	window.clearTimeout(TL), window.clearTimeout(DL), EL = null;
	let t = () => {
		xL !== null && (oR(), xL = null, wL = null, tR?.disconnect(), bL !== null && (bL.classList.remove(dL), Mh(bL)), OL = Date.now());
	};
	e ? t() : DL = window.setTimeout(t, _L);
}
function _R() {
	return bL !== null && bL.isConnected || (bL = document.createElement("div"), bL.id = uL, bL.className = lL, bL.setAttribute("role", "tooltip"), bL.setAttribute("aria-hidden", "true"), document.body.append(bL)), bL;
}
//#endregion
//#region src/interactions/menu-engine.ts
var vR = "ui-orientation--horizontal", yR = `.${Rn} > .ui-menu__host > .ui-menu__item > .${C}`, bR = `${yR}, ${`.ui-menu[${un}] > .ui-menu__host > .ui-menu__item > .${C}`}`, xR = ":scope > .ui-button__content > .ui-text__body > .ui-text__header > .ui-text__title", SR = "[role='menuitem'], [role='menuitemcheckbox']", CR = class {
	root;
	tabStopsScheduled = !1;
	touched = /* @__PURE__ */ new Set();
	space = new fu();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("keydown", (e) => this.handleEntryKeydown(e), !0), this.root.addEventListener("keyup", (e) => this.space.release(e, I), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), jL(DR), this.applyTabStops(this.root.querySelectorAll(`.${S}`)), this.root instanceof Node && new MutationObserver((e) => {
			for (let t of e) ug(t) || OR(t, this.touched);
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
		for (let n of e) n.isConnected && t.add(PF(n));
		for (let e of t) {
			let t = NF(e);
			if (t.length === 0) continue;
			let n = t.filter((e) => e.tabIndex === 0 && I(e));
			F(t, t.find((e) => e === document.activeElement) ?? t.find((e) => e.classList.contains("ui-menu-item--selected") && I(e)) ?? (n.length === 1 ? n[0] : void 0) ?? t.find(I) ?? t[0]);
		}
	}
	handleEntryKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || zu(e) || N(e) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${C}`), n = t?.closest(".ui-menu") ?? null;
		if (t === null) {
			this.enterFromContainer(e);
			return;
		}
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			this.pressEntry(e, t);
			return;
		}
		let r = PF(n), i = NF(r), a = PT(e);
		if (a !== null) {
			e.preventDefault(), td(i, YN(i, t, a));
			return;
		}
		let o = r.classList.contains(vR) || AF(r) ? "horizontal" : "vertical";
		if (!P(e) || this.handleGroupKey(e, t, r, o)) return;
		let s = e.key === "ArrowUp" && t === i.find(I) ? ER(r) : null, c = s ?? Qu({
			key: e.key,
			items: i,
			current: t,
			axis: o
		});
		c !== null && (e.preventDefault(), c !== s && F(i, c), c.focus());
	}
	handleGroupKey(e, t, n, r) {
		let i = r === "vertical" ? "ArrowRight" : kF(n) === "top" ? "ArrowUp" : "ArrowDown", a = t.matches("[data-ui-menu-group] > .ui-menu-item") ? t.parentElement : null;
		if (e.key === i && a !== null) return e.preventDefault(), a.hasAttribute("data-ui-menu-open") ? td([], wR(a)) : t.click(), !0;
		if (e.key !== "ArrowLeft" || r !== "vertical") return !1;
		let o = a !== null && a.hasAttribute("data-ui-menu-open") && !IF(a) ? a : TR(t), s = o?.querySelector(":scope > .ui-menu-item") ?? null;
		return o === null || s === null ? !1 : (e.preventDefault(), IF(o) || s.focus(), s.click(), !0);
	}
	pressEntry(e, t) {
		e.target === t && P(e, { shift: !0 }) && !t.matches("[data-ui-menu-item-kind=\"header\"], [data-ui-menu-item-kind=\"separator\"]") && I(t) && (t.hasAttribute("href") && e.key === "Enter" || (e.preventDefault(), !e.repeat && (e.key === " " ? this.space.hold(t) : t.click())));
	}
	enterFromContainer(e) {
		let t = e.target instanceof HTMLElement && e.target.getAttribute("role") === "menu" ? e.target : null, n = t === null ? null : t.matches(".ui-menu") ? t : t.querySelector(`.${S}`);
		if (n === null) return;
		let r = NF(n), i = PT(e);
		if (i !== null) {
			e.preventDefault(), td(r, YN(r, null, i));
			return;
		}
		let a = P(e) ? Qu({
			key: e.key,
			items: r,
			current: null,
			axis: n.classList.contains(vR) ? "horizontal" : "vertical"
		}) : null;
		a !== null && (e.preventDefault(), td(r, a));
	}
	handleFocusIn(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${C}`), n = t?.closest(".ui-menu") ?? null;
		t !== null && n !== null && F(NF(PF(n)), t);
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${C}`) : null;
		if (t === null || t === document.activeElement || !t.matches(SR) || t.matches("[data-ui-menu-item-kind=\"header\"], [data-ui-menu-item-kind=\"separator\"]") || !I(t)) return;
		let n = document.activeElement;
		(n instanceof HTMLElement && n.getAttribute("role") === "menu" && n.contains(t) || t.closest(".ui-menu")?.contains(n) === !0) && Tp(t);
	}
};
function wR(e) {
	let t = e.querySelector(`:scope > .ui-menu__submenu > .${S}`);
	return t === null ? null : NF(t).find(I) ?? null;
}
function TR(e) {
	let t = e.closest(`.${S}`), n = t === null ? null : FF(t);
	return n !== null && n.hasAttribute("data-ui-menu-open") ? n : null;
}
function ER(e) {
	return e.hasAttribute("data-ui-menu-search") ? e.querySelector(":scope > .ui-collapsible__bar input") : null;
}
var DR = {
	anchor: (e) => e.closest(bR),
	words: (e) => {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length > 0) return null;
		let t = e.querySelector(xR), n = t?.textContent?.trim() ?? "";
		return t === null || n.length === 0 || e.matches(yR) && t.scrollWidth <= t.clientWidth ? null : Po(n);
	},
	placement: (e) => {
		let t = e.closest(`.${S}`);
		return t === null ? null : kF(t);
	}
};
function OR(e, t) {
	let n = (e.target instanceof Element ? e.target : e.target.parentElement)?.closest(".ui-menu") ?? null;
	n !== null && t.add(n);
	for (let n of e.addedNodes) if (n instanceof HTMLElement) {
		n.classList.contains("ui-menu") && t.add(n);
		for (let e of n.querySelectorAll(`.${S}`)) t.add(e);
	}
}
//#endregion
//#region src/interactions/shortcut-engine.ts
var kR = "shortcut:", AR = ":scope > .ui-menu-item__shortcut", jR = `[${Se}]`, MR = `[${Un}]`, NR = ".ui-text__title", PR = class {
	root;
	options;
	claims = /* @__PURE__ */ new Map();
	entryShortcuts = /* @__PURE__ */ new Map();
	stale = !0;
	laterVersion = -1;
	constructor(e = {}) {
		this.root = e.root ?? document, this.options = e, this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), jL(VR), RR(this.root), this.root instanceof Node && new MutationObserver((e) => {
			if (!fg(e)) {
				this.stale = !0;
				for (let t of e) LR(t);
			}
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [Un]
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || N(e) || ((this.stale || this.laterVersion !== (this.options.laterChords?.version ?? -1)) && this.rebuild(), this.claims.size === 0 && this.entryShortcuts.size === 0 || zu(e))) return;
		let t = Eg(this.root);
		if (!this.pressContextEntry(e, t)) for (let n of this.claims.values()) {
			if (n === null || !$l(n.shortcut, e)) continue;
			let r = n.element ?? this.contentOf(n.view);
			if (r === null || !I(r) || t !== null && !t.contains(r)) return;
			e.preventDefault(), IR(e), n.view === null ? r.click() : r.dispatchEvent(new CustomEvent(n.view.name, { bubbles: !0 }));
			return;
		}
	}
	pressContextEntry(e, t) {
		let n = !1;
		for (let t of this.entryShortcuts.values()) n ||= $l(t, e);
		let r = n ? oI() : null;
		if (r === null || t !== null && !t.contains(r)) return !1;
		let i = nI(r);
		if (i === null) return !1;
		let a = [...i.menu.querySelectorAll(MR)].filter((t) => {
			let n = Ql(t.getAttribute(Un));
			return n !== null && $l(n, e) && !A(t) && xP(t, i.menu);
		});
		return a.length === 1 ? (e.preventDefault(), IR(e), a[0].click(), !0) : (a.length > 1 && s("context menu shortcut is claimed twice and will fire nothing.", { entries: a }), !1);
	}
	contentOf(e) {
		let t = e === null ? null : this.options.componentOf?.(e.componentId) ?? null;
		return t instanceof HTMLElement ? t : null;
	}
	rebuild() {
		this.claims.clear(), this.entryShortcuts.clear(), this.stale = !1;
		for (let e of this.root.querySelectorAll(MR)) {
			let t = e.getAttribute("data-ui-shortcut") ?? "", n = Ql(t);
			n === null ? t.trim().length > 0 && s("shortcut could not be parsed.", {
				element: e,
				value: t
			}) : e.closest(jR) === null ? this.claim({
				shortcut: n,
				element: e,
				view: null
			}) : this.entryShortcuts.set(pu(n), n);
		}
		for (let e of this.options.laterChords?.chords() ?? []) {
			let t = Ql(e);
			t !== null && this.entryShortcuts.set(pu(t), t);
		}
		this.laterVersion = this.options.laterChords?.version ?? -1;
		for (let e of this.options.viewShortcuts ?? []) {
			let t = Ql(e.name.slice(9));
			t !== null && this.claim({
				shortcut: t,
				element: null,
				view: e
			});
		}
	}
	claim(e) {
		let t = pu(e.shortcut);
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
function FR(e) {
	let t = /* @__PURE__ */ new Map(), n = [...e.events, ...e.interactions.map((e) => e.sourceEvent)];
	for (let e of n) e != null && e.eventName.startsWith(kR) && t.set(e.eventName, {
		name: e.eventName,
		componentId: e.componentId
	});
	return [...t.values()];
}
function IR(e) {
	Lu(e.target) && e.target.dispatchEvent(new Event(rS, { bubbles: !0 }));
}
function LR(e) {
	if (e.type === "attributes") e.target instanceof HTMLElement && zR(e.target);
	else for (let t of e.addedNodes) t instanceof HTMLElement && RR(t);
}
function RR(e) {
	e instanceof HTMLElement && e.matches(MR) && zR(e);
	for (let t of e.querySelectorAll(MR)) zR(t);
}
function zR(e) {
	let t = e.querySelector(AR);
	if (t === null) return;
	let n = BR(e) ?? "";
	t.textContent !== n && (t.textContent = n), e.hasAttribute("data-ui-menu-item-shortcut") !== n.length > 0 && e.toggleAttribute(_n, n.length > 0);
}
function BR(e) {
	let t = e.getAttribute(Un), n = Ql(t);
	return n === null ? t?.trim() || null : eu(n);
}
var VR = {
	anchor: (e) => {
		let t = e.closest(MR);
		return t === null || t.classList.contains("ui-menu-item") || t.closest(jR) !== null ? null : t;
	},
	words: (e) => {
		let t = BR(e), n = (e.getAttribute("aria-label") ?? e.querySelector(NR)?.textContent ?? "").trim();
		return t === null ? null : Po(n.length > 0 ? `${n} (${t})` : t);
	},
	after: (e) => {
		let t = BR(e);
		return t === null ? null : Po(`(${t})`);
	}
}, HR = 50, UR = 1, WR = 7;
function GR(e) {
	let t = 0;
	for (let n of e.children) n.hasAttribute("data-ui-key") && t++;
	let n = BO(e, "data-ui-window-size") ?? 0;
	return {
		offset: BO(e, "data-ui-window-offset") ?? 0,
		count: t,
		size: n > 0 ? n : t > 0 ? t : HR,
		total: BO(e, tn),
		moreAfter: VO(e, rn)
	};
}
function KR(e) {
	return Math.floor(e.offset / e.size) + 1;
}
function qR(e) {
	return e.total === null ? null : Math.max(1, Math.ceil(e.total / e.size));
}
function JR(e, t) {
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
			let n = Number(t), r = qR(e);
			return !Number.isInteger(n) || n < 1 || r !== null && n > r || n === KR(e) ? null : (n - 1) * e.size;
		}
	}
}
function YR(e, t) {
	if (t <= WR) return ZR(1, t);
	let n = Math.max(Math.min(e - UR, t - 2 - 2), 3), r = Math.min(Math.max(e + UR, 5), t - 2);
	return [
		1,
		n > 3 ? "gap" : 2,
		...ZR(n, r),
		r < t - 2 ? "gap" : t - 1,
		t
	];
}
function XR(e, t) {
	let n = YR(e, t ? e + 1 : e);
	return t ? [...n, "gap"] : n;
}
function ZR(e, t) {
	let n = [];
	for (let r = e; r <= t; r++) n.push(r);
	return n;
}
//#endregion
//#region src/interactions/pager-engine.ts
var QR = ".ui-pager", $R = "ui-pager__button", ez = "ui-pager__number", tz = "ui-pager__pages", nz = "ui-pager__gap", rz = "ui-pager__range", iz = "ui-pager__size", az = "ui-pager__size--open", oz = "ui-pager__size-trigger", sz = "ui-pager__size-label", cz = "ui-pager__sizes", lz = "ui-pager__size-choice", uz = [
	$R,
	ez,
	"ui-button",
	"ui-button--ghost",
	"ui-button--small"
], dz = "ui.pager.page", fz = "ui.pager.range", pz = "ui.pager.rows", mz = "ui.pager.size", hz = [
	en,
	tn,
	rn,
	$t,
	Qt
], gz = "page-size", _z = class {
	options;
	root;
	drawn = /* @__PURE__ */ new WeakMap();
	store = new QP();
	restored = /* @__PURE__ */ new WeakSet();
	turning = /* @__PURE__ */ new WeakMap();
	menus = new M_({
		show: ({ owner: e }) => e.classList.add(az),
		hide: ({ owner: e }) => e.classList.remove(az),
		closesWhenReadOnly: !1,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.syncAll(), this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e)), (e.pageKeys ?? window).addEventListener("keydown", (e) => this.handlePageKey(e), !0), H(this.root, `${QR}, [${x}]`, {
			childList: !0,
			attributeFilter: hz,
			relevant: (e) => e.type === "attributes" || Ez(e.target) || Dz(e)
		}, (e) => this.syncFound(e)), k.onChange(() => {
			this.drawn = /* @__PURE__ */ new WeakMap(), this.syncAll();
		});
	}
	syncAll() {
		for (let e of this.root.querySelectorAll(QR)) this.sync(e);
	}
	syncFound(e) {
		let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
		for (let r of e) {
			if (r.matches(QR)) {
				t.add(r);
				continue;
			}
			let e = r.closest(w), i = e === null ? 0 : D(e);
			i > 0 && n.add(String(i));
		}
		if (n.size > 0) for (let e of this.root.querySelectorAll(QR)) n.has(e.getAttribute("data-ui-pager-target") ?? "") && t.add(e);
		for (let e of t) this.sync(e);
	}
	hostOf(e) {
		return this.targetOf(e)?.host ?? null;
	}
	targetOf(e) {
		let t = Number(e.getAttribute(gt));
		if (!Number.isInteger(t) || t <= 0) return null;
		for (let e of this.options.dom.findEveryComponent(t)) {
			let t = Tz(e);
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
		let i = GR(n), a = this.turning.get(n), o = this.shownState(n, i), s = `${i.offset}|${i.count}|${i.size}|${i.total}|${i.moreAfter}|${a ?? ""}`;
		if (this.drawn.get(e) === s) return;
		this.drawn.set(e, s);
		let c = KD(e), l = (e) => qD(e, "N0", c);
		this.drawNumbers(e, o, c), yz(e, i, l), bz(e, i, l);
		for (let t of e.querySelectorAll(`:scope > .${$R}[${_t}]`)) ll.setDisabled(t, JR(o, t.getAttribute("data-ui-pager-page") ?? "") === null);
		Sz(e);
	}
	shownState(e, t = GR(e)) {
		let n = this.turning.get(e);
		return n === void 0 ? t : {
			...t,
			offset: n,
			moreAfter: t.total === null ? t.moreAfter : n + t.size < t.total
		};
	}
	drawNumbers(e, t, n) {
		let r = e.querySelector(`:scope > .${tz}`);
		if (r === null) return;
		let i = KR(t), a = qR(t), o = a === null ? XR(i, t.moreAfter) : YR(i, a), s = r.contains(document.activeElement);
		r.replaceChildren(...o.map((e) => vz(e, i, n))), s && !e.contains(document.activeElement) && r.querySelector("[aria-current='page']")?.focus({ preventScroll: !0 });
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(QR);
		if (t === null || A(e.target)) return;
		let n = e.target.closest(`.${lz}`);
		if (n !== null) {
			e.preventDefault(), this.chooseSize(t, Number(n.getAttribute(vt)));
			return;
		}
		let r = e.target.closest(`.${oz}`);
		if (r !== null) {
			e.preventDefault(), this.toggleSizes(r);
			return;
		}
		let i = e.target.closest(`[${_t}]`), a = i === null ? null : this.hostOf(t);
		if (i === null || a === null) return;
		let o = JR(this.shownState(a), i.getAttribute("data-ui-pager-page") ?? "");
		o !== null && (e.preventDefault(), this.turnAsync(a, o));
	}
	async turnAsync(e, t) {
		await this.requestPageAsync(e, t), od(e).top > 0 && sd(e, 0);
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
		for (let t of this.root.querySelectorAll(QR)) this.hostOf(t) === e && this.sync(t);
	}
	handleKeyDown(e) {
		if (e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(QR);
		if (t === null) return;
		let n = e.target.closest(`.${iz}`);
		if (n !== null && this.handleSizeKey(e, n)) return;
		let r = e.target.closest(`.${$R}, .${oz}`), i = xz(t);
		if (r === null || !i.includes(r) || !P(e)) return;
		let a = Qu({
			key: e.key,
			items: i,
			current: r,
			axis: "horizontal"
		});
		a !== null && (e.preventDefault(), td(i, a));
	}
	handleSizeKey(e, t) {
		let n = e.target instanceof Element ? e.target.closest(`.${oz}`) : null;
		return n !== null && !this.menus.isOpen(t) && (e.key === "ArrowDown" || e.key === "ArrowUp") && P(e) ? (e.preventDefault(), this.openSizes(t, n, e.key === "ArrowUp"), !0) : this.menus.isOpen(t) && qN(e, wz(t));
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${lz}`) : null, n = t?.closest(`.${iz}`) ?? null;
		t !== null && n !== null && this.menus.isOpen(n) && XN(t, wz(n));
	}
	toggleSizes(e) {
		let t = e.closest(`.${iz}`);
		t !== null && (this.menus.isOpen(t) ? this.menus.close(t) : this.openSizes(t, e, !1));
	}
	openSizes(e, t, n) {
		let r = e.querySelector(`:scope > .${cz}`);
		if (r === null) return;
		let i = wz(e), a = i.find((e) => e.getAttribute("aria-checked") === "true") ?? null;
		KN(this.menus, {
			owner: e,
			popup: r,
			anchor: t,
			placement: { placement: "bottom-end" },
			openers: [t]
		}, i, a, n);
	}
	restoreSize(e, t, n) {
		let r = this.store.read(t, gz), i = r === null ? 0 : Number(r);
		if (!Number.isInteger(i) || i <= 0) return;
		if (!Cz(e, i)) {
			this.store.write(t, gz, null);
			return;
		}
		let a = GR(n);
		i !== a.size && (n.setAttribute($t, String(i)), a.count > 0 && this.turnAsync(n, Math.floor(a.offset / i) * i));
	}
	chooseSize(e, t) {
		let n = e.querySelector(`.${iz}`);
		n !== null && this.menus.close(n);
		let r = this.targetOf(e);
		if (r === null || !Number.isInteger(t) || t <= 0) return;
		let i = GR(r.host);
		t !== i.size && (this.store.write(r.component, gz, String(t)), r.host.setAttribute($t, String(t)), this.turnAsync(r.host, Math.floor(i.offset / t) * t));
	}
	handlePageKey(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "PageDown" && e.key !== "PageUp" || !P(e) || !(e.target instanceof Element)) return;
		let t = cf(e);
		if (t === null || !t.root.matches(".ui-items-view, .ui-table") || A(t.root)) return;
		let n = Tz(t.root);
		if (n === null || !n.hasAttribute("data-ui-window-paged")) return;
		let r = JR(this.shownState(n), e.key === "PageDown" ? "next" : "previous");
		r !== null && (e.preventDefault(), this.turnFromKeyAsync(t.root, n, r));
	}
	async turnFromKeyAsync(e, t, n) {
		let r = Yd(e), i = pf(r), a = i === null ? 0 : Math.max(0, r.indexOf(i));
		await this.requestPageAsync(t, n);
		let o = Yd(e);
		o.length > 0 && _f(e, o, o[Math.min(a, o.length - 1)]);
	}
};
function vz(e, t, n) {
	if (e === "gap") {
		let e = document.createElement("span");
		return e.className = nz, e.setAttribute("aria-hidden", "true"), e.textContent = "…", e;
	}
	let r = document.createElement("button"), i = qD(e, "N0", n);
	return r.className = uz.join(" "), r.setAttribute("type", "button"), r.setAttribute(_t, String(e)), r.textContent = i, k.write(r, "aria-label", dz, { page: i }), e === t && r.setAttribute("aria-current", "page"), r;
}
function yz(e, t, n) {
	let r = e.querySelector(`:scope > .${rz}`);
	if (r === null) return;
	let i = n(t.count === 0 ? 0 : t.offset + 1), a = n(t.offset + t.count);
	t.total === null ? k.write(r, null, pz, {
		from: i,
		to: a
	}) : k.write(r, null, fz, {
		from: i,
		to: a,
		total: n(t.total)
	});
}
function bz(e, t, n) {
	let r = e.querySelector(`:scope > .${iz}`), i = r?.querySelector(`.${sz}`) ?? null;
	if (r !== null && i !== null) {
		k.write(i, null, mz, { size: n(t.size) });
		for (let e of wz(r)) e.setAttribute("aria-checked", Number(e.getAttribute("data-ui-pager-size")) === t.size ? "true" : "false");
	}
}
function xz(e) {
	return [...e.querySelectorAll(`.${$R}, .${oz}`)];
}
function Sz(e) {
	let t = xz(e), n = t.find((e) => e === document.activeElement), r = t.filter((e) => e.getAttribute("data-ui-pager-page") === "previous" || e.getAttribute("data-ui-pager-page") === "next");
	F(t, n ?? r.find(I) ?? t.find((e) => e.getClientRects().length > 0) ?? null);
}
function Cz(e, t) {
	let n = e.querySelector(`:scope > .${iz}`);
	return n !== null && wz(n).some((e) => Number(e.getAttribute("data-ui-pager-size")) === t);
}
function wz(e) {
	return [...e.querySelectorAll(`:scope > .${cz} > .${lz}`)];
}
function Tz(e) {
	for (let t of e.querySelectorAll(`[${x}][${Gt}="windowed"]`)) if (t.closest("[data-ui-id]") === e) return t;
	return null;
}
function Ez(e) {
	return e instanceof Element && e.hasAttribute("data-ui-items-host");
}
function Dz(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(QR) || t.querySelector(QR) !== null)) return !0;
	return !1;
}
//#endregion
//#region src/interactions/menu-search-engine.ts
var Oz = `.${S}[${yn}]`, kz = ":scope > .ui-collapsible__bar", Az = ":scope > .ui-menu__host", jz = "ui-menu__item", Mz = `:scope > .${C}`, Nz = ":scope > .ui-menu__submenu > .ui-menu > .ui-menu__host", Pz = class {
	active = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("input", (e) => this.handle(e), !0), t.addEventListener("change", (e) => this.handle(e), !0), t.addEventListener("keydown", (e) => this.handleKeydown(e)), H(t, Oz, {
			childList: !0,
			addedOnly: !0,
			characterData: !0,
			attributeFilter: [un, "class"]
		}, (e) => this.reconcile(e));
	}
	handle(e) {
		let t = e.target;
		if (!(t instanceof HTMLInputElement)) return;
		let n = Fz(t);
		n !== null && this.search(n, t);
	}
	search(e, t) {
		let n = e.querySelector(Az);
		if (n === null) return;
		let r = Ug(t.value, e);
		r.length === 0 ? this.clear(e, n) : (this.active.has(e) || this.active.set(e, {
			field: t,
			openBefore: Iz(n)
		}), e.setAttribute(bn, ""), AT(e, n, !this.filter(n, r)));
	}
	filter(e, t) {
		let n = null, r = !1, i = !1;
		for (let a of Lz(e)) {
			let e = Rz(a);
			if (e === "header") {
				n !== null && Bz(n, r), n = a, r = !1;
				continue;
			}
			let o = e !== "separator" && this.match(a, t);
			Bz(a, o), r ||= o, i ||= o;
		}
		return n !== null && Bz(n, r), i;
	}
	match(e, t) {
		let n = Gg(zz(e), t), r = e.hasAttribute("data-ui-menu-group") ? e.querySelector(Nz) : null;
		if (r === null) return n;
		if (n) return Vz(r), e.removeAttribute(pn), !0;
		let i = this.filter(r, t);
		return e.toggleAttribute(pn, i), i;
	}
	clear(e, t) {
		Vz(t), e.removeAttribute(bn), Lz(t).length > 0 && AT(e, t, !1);
		let n = this.active.get(e);
		if (n === void 0) return;
		this.active.delete(e);
		let r = Hz(e);
		for (let e of t.querySelectorAll(`[${dn}]:not([${fn}])`)) e.toggleAttribute(pn, !r && n.openBefore.has(e.getAttribute("data-ui-key") ?? e));
	}
	reconcile(e) {
		for (let t of e) {
			let e = this.active.get(t);
			e !== void 0 && (Hz(t) && (e.field.value = "", e.field.blur()), this.search(t, e.field));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "ArrowDown" || e.defaultPrevented || !P(e) || !(e.target instanceof HTMLInputElement)) return;
		let t = Fz(e.target), n = t === null ? void 0 : NF(t).find(I);
		n !== void 0 && (e.preventDefault(), n.focus());
	}
};
function Fz(e) {
	let t = e.closest(Oz), n = t?.querySelector(kz) ?? null;
	return t !== null && n !== null && n.contains(e) ? t : null;
}
function Iz(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e.querySelectorAll(`[${dn}][${pn}]`)) t.add(n.getAttribute("data-ui-key") ?? n);
	return t;
}
function Lz(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && e.classList.contains(jz));
}
function Rz(e) {
	return e.querySelector(Mz)?.getAttribute("data-ui-menu-item-kind") ?? "item";
}
function zz(e) {
	let t = e.querySelector(Mz);
	return t === null ? "" : Wg(Jg(t), e);
}
function Bz(e, t) {
	e.toggleAttribute(xn, !t);
}
function Vz(e) {
	for (let t of e.querySelectorAll(`[${xn}]`)) t.removeAttribute(xn);
}
function Hz(e) {
	return e.hasAttribute("data-ui-collapsed") || e.classList.contains("ui-menu--rail");
}
//#endregion
//#region src/interactions/screen-keyboard.ts
var Uz = 120;
function Wz(e) {
	return e.typing && e.tallest - e.height > Uz;
}
var Gz = class {
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
		let t = Wz({
			height: e.height,
			tallest: this.tallest,
			typing: Ru(document.activeElement)
		});
		t !== document.documentElement.hasAttribute("data-ui-keyboard-up") && document.documentElement.toggleAttribute(Xr, t);
	}
}, Kz = `[${Mn}], [${kn}]`, qz = "--ui-window-foot", Jz = "--ui-window-foot-ink", Yz = 120, Xz = /\s*\/\s*([\d.]+)(%?)\s*\)$/, Zz = /^rgba\(([^,]+),([^,]+),([^,]+),\s*([\d.]+)(%?)\s*\)$/;
function Qz(e) {
	if (e === "transparent") return 0;
	let t = Zz.exec(e) ?? Xz.exec(e);
	if (t === null) return 1;
	let n = Number(t[t.length - 2]);
	return t[t.length - 1] === "%" ? n / 100 : n;
}
function $z(e) {
	let t = Zz.exec(e);
	return t === null ? e.replace(Xz, ")") : `rgb(${t[1]},${t[2]},${t[3]})`;
}
function eB(e) {
	let t = [], n = null;
	for (let r of e) {
		let e = Qz(r);
		if (e >= 1) {
			n = r;
			break;
		}
		e > 0 && t.push(r);
	}
	if (n === null) return null;
	for (let e = t.length - 1; e >= 0; e--) n = `color-mix(in srgb, ${$z(t[e])} ${Math.round(Qz(t[e]) * 1e3) / 10}%, ${n})`;
	return n;
}
function tB(e) {
	let t = [];
	for (let n = e; n !== null; n = n.parentElement) t.push(getComputedStyle(n).backgroundColor);
	return eB(t);
}
var nB = class {
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
			attributeFilter: [Vr]
		}), new MutationObserver(n).observe(document.head, {
			childList: !0,
			subtree: !0,
			characterData: !0
		}), matchMedia("(prefers-color-scheme: dark)").addEventListener("change", n), window.addEventListener("resize", n), document.addEventListener("transitionend", (e) => {
			e.target instanceof Element && e.target.closest(Kz) !== null && n();
		}, !0), this.schedule();
	}
	schedule() {
		this.scheduled || (this.scheduled = !0, requestAnimationFrame(() => {
			this.scheduled = !1, this.update();
		}));
	}
	update() {
		let e = document.querySelectorAll(Kz), t = e.length === 0 ? 0 : this.bottomInset(), n = e.length > 0 && iB(window.innerWidth / 2, window.innerHeight - t - 1);
		if (n && this.covered < Yz) {
			this.covered++, this.schedule();
			return;
		}
		n || (this.covered = 0);
		for (let n of e) n.hasAttribute("data-ui-window-foot") && this.keepClear(n, t);
		let r = e.length === 0 ? null : rB(window.innerWidth / 2, window.innerHeight - t - 1, null), i = r === null ? null : tB(r);
		aB(document.documentElement, qz, i);
	}
	keepClear(e, t) {
		let n = e.getBoundingClientRect(), r = t > 0 && n.height > 0 && n.bottom >= window.innerHeight - 1, i = r ? rB(n.left + n.width / 2, Math.min(n.bottom, window.innerHeight - t) - 1, e) : null;
		r !== e.hasAttribute("data-ui-window-foot-edge") && e.toggleAttribute(Zr, r), aB(e, Jz, i === null ? null : tB(i));
	}
	bottomInset() {
		return this.probe === null && (this.probe = document.createElement("div"), this.probe.setAttribute("aria-hidden", "true"), this.probe.style.cssText = "position:fixed;visibility:hidden;pointer-events:none;height:0;padding-bottom:env(safe-area-inset-bottom,0px)", document.body.append(this.probe)), parseFloat(getComputedStyle(this.probe).paddingBottom) || 0;
	}
};
function rB(e, t, n) {
	for (let r of document.elementsFromPoint(e, t)) {
		let e = r.closest(Kz);
		if (e !== null && (n === null || e === n)) return r;
	}
	return null;
}
function iB(e, t) {
	return document.elementsFromPoint(e, t).every((e) => e === document.documentElement);
}
function aB(e, t, n) {
	n === null ? e.style.getPropertyValue(t) !== "" && e.style.removeProperty(t) : e.style.getPropertyValue(t) !== n && e.style.setProperty(t, n);
}
//#endregion
//#region src/interactions/side-drawer-engine.ts
var oB = "[data-ui-root]", sB = "a[href]", cB = "ui-collapsible", lB = "ui-collapsible__bar", uB = "right-side", dB = "ui-side--left", fB = "ui-side--right", pB = "pinned", mB = class {
	root;
	holders = /* @__PURE__ */ new Map();
	openers = /* @__PURE__ */ new WeakMap();
	switchNames = /* @__PURE__ */ new Map();
	store = new QP();
	constructor(e = {}) {
		if (this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), typeof matchMedia == "function") for (let e of LP) matchMedia(e).addEventListener("change", () => this.refit());
		for (let e of document.querySelectorAll(oB)) xB(e);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Sn}]`);
		if (t !== null) {
			let e = t.closest(oB), n = t.getAttribute(Sn);
			e !== null && n !== null && this.toggle(e, n, t);
			return;
		}
		let n = e.target.closest(`[${Dn}]`);
		if (n !== null) {
			let e = n.closest(oB), t = n.getAttribute(Dn);
			e !== null && t !== null && this.pin(e, t, !e.hasAttribute(On(t)), n);
			return;
		}
		if (e.target.closest("[data-ui-drawer-backdrop]") !== null) {
			this.closeAll();
			return;
		}
		let r = e.target.closest(`[${Wn}]`);
		if (r !== null && !e.defaultPrevented && vB(r)) {
			this.closeAll();
			return;
		}
		let i = e.target.closest(`${sB}, .${C}`), a = i?.closest(`[${Pn}]`), o = a?.parentElement ?? null;
		i !== null && a != null && o?.getAttribute("data-ui-drawer-open") === a.getAttribute("data-ui-region") && yB(i) && this.close(o);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || N(e)) return;
		if (e.key === "Tab") {
			this.trapTab(e);
			return;
		}
		if (e.key !== "Escape" || Ou(e) || Ig()) return;
		let t = !1;
		for (let { shell: e, drawer: n, modal: r } of this.openDrawers()) (r || n.contains(document.activeElement)) && (this.close(e), t = !0);
		t && e.preventDefault();
	}
	trapTab(e) {
		for (let { drawer: t, modal: n } of this.openDrawers()) n && jp(t, e);
	}
	openDrawers() {
		let e = [];
		for (let t of document.querySelectorAll(`${oB}[${Cn}]`)) {
			let n = t.getAttribute("data-ui-drawer-open") ?? "", r = SB(t, n);
			r !== null && !Dg(r) && e.push({
				shell: t,
				drawer: r,
				modal: bB(t, n)
			});
		}
		return e;
	}
	refit() {
		for (let e of document.querySelectorAll(`${oB}[${Cn}]`)) {
			let t = e.getAttribute("data-ui-drawer-open") ?? "", n = SB(e, t), r = this.openers.get(e);
			n === null || !BP(e, t) ? this.close(e) : r?.isConnected === !0 && this.placeSwitch(n, r);
		}
	}
	toggle(e, t, n) {
		if (e.getAttribute("data-ui-drawer-open") === t) {
			this.close(e);
			return;
		}
		let r = SB(e, t);
		r !== null && !r.hasAttribute("data-ui-bottom-bar") && BP(e, t) && (e.hasAttribute("data-ui-drawer-open") && this.close(e), e.setAttribute(Cn, t), this.openers.set(e, n), this.markToggles(e), this.hold(r, bB(e, t)), this.placeSwitch(r, n), this.focusInto(e, t, r, document.activeElement, vp(), performance.now() + V.normal));
	}
	hold(e, t) {
		if (this.holders.has(e) || e.hasAttribute("data-ui-focus-holder")) return;
		let n = !e.hasAttribute("tabindex"), r = t && !e.hasAttribute("aria-label") && !e.hasAttribute("aria-labelledby");
		this.holders.set(e, {
			modal: t,
			addsTabIndex: n,
			addsName: r,
			role: e.getAttribute("role")
		}), n && (e.tabIndex = -1), t && (e.setAttribute(Di, ""), e.setAttribute("role", "dialog"), e.setAttribute("aria-modal", "true"), r && e.setAttribute("aria-label", k.text("ui.side.panel")));
	}
	placeSwitch(e, t) {
		let n = hB(e), r = t.getBoundingClientRect();
		if (n === null) return;
		this.switchNames.has(n) || this.switchNames.set(n, n.getAttribute("aria-label")), n.setAttribute("aria-label", k.text("ui.side.close"));
		let i = n.parentElement?.classList.contains(lB) === !0 ? n.parentElement : n;
		if (r.width === 0 || r.height === 0) {
			n.removeAttribute(wn), i.removeAttribute(Tn);
			return;
		}
		n.style.setProperty("--ui-drawer-switch-width", `${r.width}px`), n.style.setProperty("--ui-drawer-switch-height", `${r.height}px`), n.style.setProperty("--ui-drawer-switch-x", "0px"), i.style.setProperty("--ui-drawer-switch-y", "0px"), n.setAttribute(wn, ""), i.setAttribute(Tn, "");
		let a = n.getBoundingClientRect(), o = e.getBoundingClientRect(), s = _B(r.left - e.offsetLeft, e.clientWidth - a.width), c = _B(r.top - o.top, e.clientHeight - a.height);
		n.style.setProperty("--ui-drawer-switch-x", `${s - (a.left - o.left)}px`), i.style.setProperty("--ui-drawer-switch-y", `${c - (a.top - o.top)}px`);
	}
	focusInto(e, t, n, r, i, a) {
		e.getAttribute("data-ui-drawer-open") !== t || document.activeElement !== r || n.contains(r) || (Lp(n, i ? n : null), performance.now() < a && document.activeElement === r && requestAnimationFrame(() => this.focusInto(e, t, n, r, i, a)));
	}
	pin(e, t, n, r) {
		let i = SB(e, t);
		if (i === null || UP(e, t)) return;
		let a = i.contains(r);
		if (n && e.getAttribute("data-ui-drawer-open") === t && this.close(e, !a), e.toggleAttribute(On(t), n), xB(e), !n && a && i.contains(document.activeElement)) {
			let n = this.returnTarget(e, t);
			n !== null && B(n);
		}
		let o = i.querySelector(`[${qe}]`);
		o !== null && this.store.write(o, pB, n ? "true" : null, n ? {
			root: !0,
			attributes: { [On(t)]: "" }
		} : null);
	}
	closeAll() {
		for (let e of document.querySelectorAll(`${oB}[${Cn}]`)) this.close(e);
	}
	close(e, t = !0) {
		let n = e.getAttribute(Cn);
		if (e.removeAttribute(Cn), this.markToggles(e), n === null) return;
		let r = SB(e, n), i = document.activeElement;
		if (t && (i === null || i === document.body || r?.contains(i) === !0)) {
			let t = this.returnTarget(e, n);
			t !== null && r !== null && r.contains(i) ? Kp(t, r) : t !== null && B(t);
		}
		this.release(r), this.renameSwitch(r);
	}
	returnTarget(e, t) {
		let n = this.openers.get(e);
		if (this.openers.delete(e), n?.isConnected === !0 && n.getAttribute("data-ui-drawer-toggle") === t && n.checkVisibility()) return n;
		let r = [...e.querySelectorAll(`[${Sn}="${Yi(t)}"]`)];
		return r.find((e) => e.checkVisibility()) ?? r[0] ?? null;
	}
	markToggles(e) {
		let t = e.getAttribute(Cn);
		for (let n of e.querySelectorAll(`[${Sn}]`)) n.setAttribute("aria-expanded", String(n.getAttribute(Sn) === t));
	}
	release(e) {
		let t = e === null ? void 0 : this.holders.get(e);
		e !== null && t !== void 0 && (this.holders.delete(e), t.addsTabIndex && e.removeAttribute("tabindex"), t.modal && (e.removeAttribute(Di), e.removeAttribute("aria-modal"), t.role === null ? e.removeAttribute("role") : e.setAttribute("role", t.role), t.addsName && e.removeAttribute("aria-label")));
	}
	renameSwitch(e) {
		for (let [t, n] of this.switchNames) e?.contains(t) !== !0 && t.isConnected || (this.switchNames.delete(t), n === null ? t.removeAttribute("aria-label") : t.setAttribute("aria-label", n));
	}
};
function hB(e) {
	for (let t of e.querySelectorAll(`[${Wn}]`)) if (vB(t) && t.checkVisibility() && gB(t.closest(`.${cB}`), e)) return t;
	return null;
}
function gB(e, t) {
	let n = e;
	for (; n !== null && n !== t;) {
		let e = n.parentElement;
		if (e === null || e.firstElementChild !== n) return !1;
		n = e;
	}
	return n === t;
}
function _B(e, t) {
	return Math.max(0, Math.min(e, t));
}
function vB(e) {
	let t = e.closest(`.${cB}`), n = t?.closest(`[${Pn}]`), r = n?.getAttribute(Pn), i = n?.parentElement;
	return t == null || t.hasAttribute("data-ui-collapsed") || r == null || i == null ? !1 : i.matches(oB) && i.getAttribute("data-ui-drawer-open") === r && t.classList.contains(r === uB ? fB : dB);
}
function yB(e) {
	return !e.classList.contains("ui-menu-item") || MF(e) && e.closest(".ui-context-menu, .ui-split-button__menu, .ui-flyout__content") === null;
}
function bB(e, t) {
	return !(e.getAttribute("data-ui-drawer-modeless") ?? "").split(" ").includes(t);
}
function xB(e) {
	for (let t of e.querySelectorAll(`[${Dn}]`)) {
		let n = String(e.hasAttribute(On(t.getAttribute("data-ui-drawer-pin") ?? "")));
		t.getAttribute("aria-pressed") !== n && (t.setAttribute("aria-pressed", n), t.getAttribute("data-ui-value-kind") === "pressed" && t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}
function SB(e, t) {
	return e.querySelector(`:scope > [${Pn}="${Yi(t)}"]`);
}
//#endregion
//#region src/interactions/collapsible-engine.ts
var CB = "ui-collapsible", wB = "ui-collapsible__content", TB = "ui-collapsible__bar", EB = "ui-collapsible__bar-content", DB = "collapsed", OB = class {
	root;
	store = new QP();
	restored = /* @__PURE__ */ new WeakSet();
	folds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.restoreEach(this.root.querySelectorAll(`.${CB}`)), H(this.root, `.${CB}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [un]
		}, (e) => this.restoreEach(e));
	}
	restoreEach(e) {
		for (let t of e) this.restored.has(t) ? this.apply(t, t.hasAttribute(un)) : (this.restored.add(t), this.restore(t));
	}
	restore(e) {
		if (this.toggleOf(e) === null) return;
		let t = this.store.read(e, DB);
		t !== null && this.apply(e, t === "true");
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Wn}]`), n = t?.closest(`.${CB}`) ?? null;
		if (t === null || n === null || vB(t)) return;
		e.preventDefault();
		let r = !n.hasAttribute(un), i = this.partsOf(n, t);
		this.cancelFold(n);
		let a = AB(n, i);
		this.apply(n, r), this.playFold(n, i, a, r), this.store.write(n, DB, r ? "true" : "false", r ? { attributes: { [un]: "" } } : null);
	}
	apply(e, t) {
		e.toggleAttribute(un, t), this.toggleOf(e)?.setAttribute("aria-expanded", t ? "false" : "true");
	}
	partsOf(e, t) {
		return {
			content: e.querySelector(`:scope > .${wB}`),
			bar: e.querySelector(`:scope > .${TB} > .${EB}`),
			toggle: t
		};
	}
	toggleOf(e) {
		return e.querySelector(`:scope > [${Wn}], :scope > .${TB} > [${Wn}]`);
	}
	playFold(e, t, n, r) {
		if (typeof e.animate != "function" || Xm()) return;
		let i = MB(kB(e), n, AB(e, t), r);
		if (i === null) return;
		e.setAttribute(Gn, ""), e.offsetWidth;
		let a = {
			duration: V.normal,
			easing: V.ease
		}, o = [e.animate(i.component, a)];
		t.content !== null && o.push(t.content.animate(i.content, a)), t.bar !== null && o.push(t.bar.animate(i.bar, a)), i.toggle !== null && o.push(t.toggle.animate(i.toggle, a)), this.folds.set(e, o), Promise.allSettled(o.map((e) => e.finished)).then(() => {
			this.folds.get(e) === o && (this.folds.delete(e), e.removeAttribute(Gn));
		});
	}
	cancelFold(e) {
		let t = this.folds.get(e);
		if (t !== void 0) {
			this.folds.delete(e), e.removeAttribute(Gn);
			for (let e of t) e.cancel();
		}
	}
};
function kB(e) {
	return e.classList.contains("ui-side--top") || e.classList.contains("ui-side--bottom") ? "height" : "width";
}
function AB(e, t) {
	let n = kB(e), r = jB(n), i = e.getBoundingClientRect(), a = t.content?.getBoundingClientRect(), o = t.toggle.getBoundingClientRect();
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
function jB(e) {
	return e === "width" ? "height" : "width";
}
function MB(e, t, n, r) {
	let i = jB(e), a = t.component !== n.component, o = Math.abs(t.componentAcross - n.componentAcross) >= .5;
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
function NB(e, t) {
	if (typeof ResizeObserver == "function") {
		let n = new ResizeObserver(() => t(e));
		return n.observe(e), () => n.disconnect();
	}
	let n = () => t(e);
	return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
}
//#endregion
//#region src/interactions/grid-splitter-engine.ts
var PB = "ui-grid-splitter", FB = "ui-container", IB = "ui-orientation--vertical", LB = 16, RB = {
	sliver: 0,
	passFloors: !0
}, zB = {
	sliver: 48,
	passFloors: !0
}, BB = {
	slot: "columns",
	authored: "--ui-columns",
	split: "--ui-split-columns",
	limits: Kn,
	computed: "gridTemplateColumns",
	lineStart: "gridColumnStart",
	lineEnd: "gridColumnEnd",
	coordinate: "clientX",
	decrease: "ArrowLeft",
	increase: "ArrowRight"
}, VB = {
	slot: "rows",
	authored: "--ui-rows",
	split: "--ui-split-rows",
	limits: qn,
	computed: "gridTemplateRows",
	lineStart: "gridRowStart",
	lineEnd: "gridRowEnd",
	coordinate: "clientY",
	decrease: "ArrowUp",
	increase: "ArrowDown"
}, HB = class {
	root;
	store = new QP();
	restored = /* @__PURE__ */ new WeakMap();
	warner = new p();
	drag;
	placedTiers = /* @__PURE__ */ new WeakMap();
	waiting = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new Yg({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${PB}`),
			begin: (e) => this.resolveContext(e),
			coordinate: (e) => e.axis.coordinate,
			move: (e, t) => {
				this.apply(e, t, RB) && this.reportPosition(e.splitter, e.tracks);
			},
			end: (e, t) => {
				this.settle(e), this.remember(t), this.reportPosition(e), this.writeBack(e, t);
			},
			cancel: (e, t) => this.putBack(e, t)
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.prepareEach(this.root.querySelectorAll(`.${PB}`)), H(this.root, `.${PB}`, { childList: !0 }, (e) => this.prepareEach(e)), H(this.root, `.${PB}`, { attributeFilter: [Yn] }, (e) => this.takeEach(e)), window.addEventListener("resize", () => this.reportEach());
	}
	prepareEach(e) {
		for (let t of e) {
			let e = GB(t);
			e !== null && (this.restore(e, KB(t)), this.place(t), this.reportPosition(t));
		}
	}
	restore(e, t) {
		let n = this.restored.get(e);
		if (n === void 0 && (n = /* @__PURE__ */ new Set(), this.restored.set(e, n)), n.has(t.slot)) return;
		n.add(t.slot);
		let r = this.store.readJson(e, t.slot);
		if (r !== null) for (let n of $m) {
			let i = r[n], a = ih(t.split, n);
			i !== void 0 && e.style.getPropertyValue(a).length === 0 && e.style.setProperty(a, i);
		}
	}
	place(e) {
		let t = $B(e);
		if (t === null) return;
		if (e.getClientRects().length === 0) {
			this.waitForBox(e);
			return;
		}
		this.stopWaiting(e);
		let n = this.resolveContext(e);
		if (n === null || (this.placedTiers.set(e, n.tier), !e.hasAttribute("data-ui-bind-position") && JB(n.container, n.axis, n.tier) !== void 0)) return;
		let r = Pl(n.sizes, n.runs, t);
		Math.abs(r) >= 1 && this.apply(n, r) && this.remember(n);
	}
	waitForBox(e) {
		this.waiting.has(e) || this.waiting.set(e, NB(e, () => {
			!e.isConnected || $B(e) === null ? this.stopWaiting(e) : e.getClientRects().length > 0 && (this.place(e), this.reportPosition(e));
		}));
	}
	stopWaiting(e) {
		this.waiting.get(e)?.(), this.waiting.delete(e);
	}
	takeEach(e) {
		for (let t of e) $B(t) === null && t.hasAttribute("data-ui-bind-position") ? this.reset(t, !1) : this.place(t), this.reportPosition(t);
	}
	reportEach() {
		let e = rh();
		for (let t of this.root.querySelectorAll(`.${PB}`)) this.placedTiers.has(t) && this.placedTiers.get(t) !== e && this.place(t), this.reportPosition(t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || !P(e)) return;
		let t = e.target.closest(`.${PB}`);
		if (t === null || this.drag.active || A(t)) return;
		if (e.key === "Enter") {
			e.preventDefault(), this.reset(t);
			return;
		}
		let n = this.resolveContext(t);
		if (n === null) return;
		let r = tV(t), i = n.sizes.reduce((e, t) => e + t, 0), a;
		switch (e.key) {
			case n.axis.decrease:
				a = -r;
				break;
			case n.axis.increase:
				a = r;
				break;
			case "PageUp":
			case "PageDown":
				a = ul(r, i) * QB(e.key, n.axis);
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
		let n = GB(e);
		if (n === null) return;
		let r = KB(e);
		for (let e of $m) n.style.removeProperty(ih(r.split, e));
		this.store.write(n, r.slot, null), this.placedTiers.delete(e), e.hasAttribute("data-ui-bind-position") || this.place(e), this.reportPosition(e), t && e.hasAttribute("data-ui-bind-position") && e.hasAttribute("data-ui-splitter-position") && (e.removeAttribute(Yn), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	writeBack(e, t) {
		if (!e.hasAttribute("data-ui-bind-position")) return;
		let n = eV(Nl(YB(t.container, t.axis), t.runs));
		e.getAttribute("data-ui-splitter-position") !== n && (e.setAttribute(Yn, n), this.placedTiers.set(e, t.tier), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	handleDoubleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${PB}`) : null;
		t !== null && this.reset(t);
	}
	settle(e) {
		let t = this.resolveContext(e), n = t === null ? 0 : Rl(t.tracks, t.sizes, t.runs, 48);
		t !== null && n !== 0 && this.apply(t, n, RB);
	}
	putBack(e, t) {
		let n = ih(t.axis.split, t.tier);
		t.before.length === 0 ? t.container.style.removeProperty(n) : t.container.style.setProperty(n, t.before), this.reportPosition(e);
	}
	apply(e, t, n = zB) {
		let r = Cl(e.tracks, e.sizes, e.runs, t, n);
		return r !== null && (e.container.style.setProperty(ih(e.axis.split, e.tier), hl(r)), !0);
	}
	remember(e) {
		let { container: t, axis: n } = e, r = {}, i = {};
		for (let e of $m) {
			let a = ih(n.split, e), o = t.style.getPropertyValue(a).trim();
			o.length > 0 && (r[e] = o, i[a] = o);
		}
		let a = { styles: i };
		this.store.write(t, n.slot, Object.keys(r).length === 0 ? null : JSON.stringify(r), a);
	}
	resolveContext(e) {
		let t = GB(e);
		if (t === null) return this.warner.warn(e, "a grid splitter must be a direct child of a container."), null;
		let n = KB(e), r = rh(), i = qB(t, n, r), a = i === null ? null : dl(i);
		if (a === null) return this.warner.warn(e, "the container's track list could not be read.", { template: i }), null;
		let o = yl(a, vl(t.getAttribute(n.limits))), s = YB(t, n), c = XB(e, n);
		if (c === null || c >= o.length || s.length < o.length) return this.warner.warn(e, "the splitter's track could not be found in its container.", {
			index: c,
			tracks: o.length,
			sizes: s.length
		}), null;
		o[c].kind === "star" && this.warner.warn(e, "a grid splitter sits in a star track and shares the room it divides; give it an Auto or Absolute track.");
		let l = bl(c, ZB(t, n).map((e) => XB(e, n)).filter((e) => e !== null && e !== c), o.length);
		return l === null ? (this.warner.warn(e, "a grid splitter at the container's edge has nothing on one side to move."), null) : {
			splitter: e,
			container: t,
			axis: n,
			tracks: o,
			sizes: s,
			runs: l,
			tier: r,
			before: t.style.getPropertyValue(ih(n.split, r))
		};
	}
	reportPosition(e, t) {
		let n = GB(e);
		if (n === null) return;
		let r = KB(e), i = XB(e, r), a = YB(n, r), o = ZB(n, r).map((e) => XB(e, r)).filter((e) => e !== null && e !== i), s = i === null ? null : bl(i, o, a.length);
		s !== null && (e.setAttribute("aria-valuemin", "0"), e.setAttribute("aria-valuemax", "100"), e.setAttribute("aria-valuenow", String(Ml(a, s))), T(e, ti, UB(a, s.before) ? "before" : UB(a, s.after) ? "after" : null), WB(n, t === void 0 ? null : {
			axis: r,
			tracks: zl(t, a, s, 48)
		}));
	}
};
function UB(e, t) {
	return t.every((t) => (e[t] ?? 0) < 1);
}
function WB(e, t) {
	let n = [BB, VB].filter((t) => ZB(e, t).length > 0).map((t) => ({
		axis: t,
		sizes: YB(e, t)
	}));
	for (let r of e.children) {
		if (!(r instanceof HTMLElement)) continue;
		let e = getComputedStyle(r), i = r.classList.contains(PB) ? KB(r) : null, a = n.some(({ axis: n, sizes: r }) => n !== i && Vl(e[n.lineStart], e[n.lineEnd], r, t?.axis === n ? t.tracks : void 0));
		a !== r.hasAttribute("data-ui-split-folded") && r.toggleAttribute(ei, a);
	}
}
function GB(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(FB) ? t : null;
}
function KB(e) {
	return e.classList.contains(IB) ? BB : VB;
}
function qB(e, t, n) {
	let r = JB(e, t, n);
	if (r !== void 0) return r;
	let i = e.style.getPropertyValue(t.authored).trim();
	return i.length > 0 ? i : null;
}
function JB(e, t, n) {
	return sh(n, (n) => e.style.getPropertyValue(ih(t.split, n)).trim() || void 0);
}
function YB(e, t) {
	return getComputedStyle(e)[t.computed].split(" ").map(parseFloat).filter((e) => Number.isFinite(e));
}
function XB(e, t) {
	let n = Number(getComputedStyle(e)[t.lineStart]);
	return Number.isInteger(n) && n >= 1 ? n - 1 : null;
}
function ZB(e, t) {
	let n = [];
	for (let r of e.children) r instanceof HTMLElement && r.classList.contains(PB) && KB(r) === t && n.push(r);
	return n;
}
function QB(e, t) {
	return t.increase === "ArrowDown" ? e === "PageDown" ? 1 : -1 : e === "PageUp" ? 1 : -1;
}
function $B(e) {
	return Fl(e.getAttribute(Yn));
}
function eV(e) {
	return String(Math.round(e * 1e4) / 1e4);
}
function tV(e) {
	let t = Number(e.getAttribute(Jn));
	return Number.isFinite(t) && t > 0 ? t : LB;
}
//#endregion
//#region src/interactions/pane-container-engine.ts
var nV = "ui-pane-container", rV = "ui-pane-container__place", iV = "ui-pane-container__pane", aV = "ui-pane-container__grip", oV = "data-ui-pane-lifted", sV = "data-ui-pane-target", cV = "data-ui-pane-moving", lV = "data-ui-pane-near", uV = "data-ui-pane-raised", dV = ".ui-text-type--display, .ui-text-type--title, .ui-text-type--subtitle", fV = "panes", pV = ",", mV = 32, hV = class {
	root;
	store = new QP();
	drag;
	restored = /* @__PURE__ */ new WeakSet();
	held = null;
	raised = null;
	near = null;
	nearTop = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new Yg({
			root: this.root,
			resolveHandle: (e) => _V(e),
			begin: (e, t) => this.lift(e, t),
			move: (e, t, n) => this.follow(e, n),
			end: (e, t) => this.put(t),
			cancel: (e, t) => this.putBack(t),
			takenBack: (e, t) => this.putBack(t)
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), { passive: !0 }), this.root.addEventListener("pointerout", (e) => this.handlePointerOut(e), { passive: !0 }), this.root.addEventListener("pointerover", () => this.forgetNearTop(), { passive: !0 }), this.root.addEventListener("scroll", () => this.handleScroll(), {
			capture: !0,
			passive: !0
		}), window.addEventListener("resize", () => this.forgetNearTop()), this.arrangeEach(this.root.querySelectorAll(`.${nV}`), !1), H(this.root, `.${nV}`, {
			childList: !0,
			attributeFilter: [Xn],
			relevant: SV
		}, (e) => this.arrangeEach(CV(e), !0));
	}
	arrangeEach(e, t) {
		for (let n of e) {
			let e = !this.restored.has(n);
			if (e) {
				this.restored.add(n), this.restore(n);
				for (let e of wV(n)) {
					let t = e.querySelector(`:scope > .${iV} > .${aV}`);
					t !== null && yV(t);
				}
			}
			n.hasAttribute(cV) || OV(n, EV(n), t && !e);
		}
	}
	restore(e) {
		if (e.hasAttribute("data-ui-bind-layout")) return;
		let t = this.store.read(e, fV);
		t !== null && e.setAttribute(Xn, t);
	}
	lift(e, t) {
		this.dropStaleHold();
		let n = e.parentElement, r = n?.parentElement, i = r?.parentElement;
		if (this.held !== null || n === null || r == null || i == null || TV(i).length < 2) return null;
		if (typeof n.getAnimations == "function") for (let e of n.getAnimations()) e.cancel();
		n.setAttribute(oV, ""), i.setAttribute(cV, "");
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
		n.style.minWidth = `${r.width}px`, n.style.minHeight = `${r.height}px`, t.style.left = `${r.left}px`, t.style.top = `${r.top}px`, t.style.width = `${r.width}px`, t.style.height = `${r.height}px`, t.setAttribute("popover", "manual"), t.setAttribute(uV, ""), t.showPopover(), this.raised = e;
	}
	follow(e, t) {
		e.pane.style.transform = `translate(${t.x - e.start.x}px, ${t.y - e.start.y}px)`, this.mark(e, GV(e.container, e.origin, t));
	}
	mark(e, t) {
		e.target !== t && (e.target?.removeAttribute(sV), t?.setAttribute(sV, ""), e.target = t);
	}
	put(e) {
		let t = e.target, n = e.pane.parentElement, r = t?.querySelector(`:scope > .${iV}`) ?? null;
		if (t === null || n === null || r === e.pane || !e.container.isConnected) return this.putBack(e), null;
		this.settle(e);
		let i = /* @__PURE__ */ new Map([[e.pane, t]]);
		return r !== null && i.set(r, n), kV(e.container, i, !0), this.keep(e.container), t;
	}
	putBack(e) {
		this.settle(e), AV(e.pane), e.container.isConnected && OV(e.container, EV(e.container), !0);
	}
	settle(e) {
		this.lower(e), e.target?.removeAttribute(sV), e.pane.removeAttribute(oV), e.container.removeAttribute(cV), e.grip.setAttribute("aria-pressed", "false"), e.grip.removeAttribute(Oi);
	}
	lower(e) {
		let { pane: t, origin: n } = e;
		if (this.raised === e && (this.raised = null), t.hasAttribute(uV)) {
			t.matches(":popover-open") && t.hidePopover(), t.removeAttribute("popover"), t.removeAttribute(uV);
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
		let t = DV(e);
		e.setAttribute(Xn, t), e.hasAttribute("data-ui-bind-layout") ? e.dispatchEvent(new Event("change", { bubbles: !0 })) : this.store.write(e, fV, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || !P(e)) return;
		this.dropStaleHold();
		let t = _V(e.target);
		if (t === null || this.drag.active) return;
		let n = this.held;
		if (n === null) {
			if (e.key !== " " && e.key !== "Enter") return;
			e.preventDefault(), this.hold(t);
			return;
		}
		if (n.pane !== t.parentElement) return;
		let r = gV[e.key];
		if (r !== void 0) {
			e.preventDefault();
			let t = KV(n.container, n.origin, n.target ?? n.origin, r) ?? n.target;
			t !== null && t !== n.target && Zk({
				key: "ui.pane.target",
				args: xV(n.container, t)
			}), this.mark(n, t);
		} else if (e.key === " " || e.key === "Enter") {
			e.preventDefault(), this.held = null;
			let r = this.put(n);
			if (r === null) Zk({ key: "ui.pane.back" });
			else {
				let { index: e, count: t } = xV(n.container, r);
				$k(e, t);
			}
			t.focus({ preventScroll: !0 });
		} else e.key === "Escape" && (e.preventDefault(), this.held = null, this.putBack(n), Zk({ key: "ui.pane.back" }));
	}
	hold(e) {
		this.held = this.lift(e, {
			x: 0,
			y: 0
		}), this.held !== null && (e.setAttribute("aria-pressed", "true"), e.setAttribute(Oi, ""), Zk({ key: "ui.pane.lifted" }));
	}
	handleFocusOut(e) {
		let t = this.held;
		t !== null && e.target instanceof Element && e.target.parentElement === t.pane && (this.held = null, this.putBack(t));
	}
	handleFocusIn(e) {
		let t = e.target instanceof Element ? _V(e.target) : null;
		t !== null && yV(t);
	}
	handlePointerMove(e) {
		if (!(e instanceof PointerEvent) || e.pointerType === "touch") return;
		let t = e.target instanceof Element ? vV(e.target) : null;
		if (t === null) {
			this.markNear(null);
			return;
		}
		let n = this.nearTop;
		n?.pane !== t && (n = {
			pane: t,
			top: t.getBoundingClientRect().top
		}, this.nearTop = n), this.markNear(e.clientY - n.top < mV ? t : null);
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
		e !== this.near && (this.near?.removeAttribute(lV), e?.setAttribute(lV, ""), this.near = e);
	}
	handlePointerOut(e) {
		e instanceof PointerEvent && e.relatedTarget === null && this.markNear(null);
	}
}, gV = {
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
function _V(e) {
	let t = e.closest(`.${aV}`);
	return t?.parentElement?.parentElement?.parentElement?.classList.contains(nV) === !0 ? t : null;
}
function vV(e) {
	let t = e.closest(`.${iV}`);
	return t?.parentElement?.parentElement?.classList.contains(nV) === !0 ? t : null;
}
function yV(e) {
	let t = e.parentElement, n = t === null ? null : bV(t), r = n === null ? "ui.pane.move" : "ui.pane.grip", i = n === null ? null : { name: n };
	e.getAttribute("aria-label") !== k.translate(r, i) && k.write(e, "aria-label", r, i);
}
function bV(e) {
	for (let t of e.querySelectorAll(dV)) {
		let n = vV(t) === e ? t.textContent?.trim() ?? "" : "";
		if (n.length > 0) return n;
	}
	return null;
}
function xV(e, t) {
	let n = TV(e);
	return {
		index: n.indexOf(t) + 1,
		count: n.length
	};
}
function SV(e) {
	if (e.type === "attributes") return e.target instanceof Element && e.target.classList.contains(nV);
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains(nV) || t.querySelector(`.${nV}`) !== null)) return !0;
	return !1;
}
function CV(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) {
		t.add(n);
		for (let e of n.querySelectorAll(`.${nV}`)) t.add(e);
	}
	return t;
}
function wV(e) {
	return Array.from(e.querySelectorAll(`:scope > .${rV}`));
}
function TV(e) {
	return wV(e).filter((e) => e.getClientRects().length > 0);
}
function EV(e) {
	return e.getAttribute(Xn);
}
function DV(e) {
	return wV(e).map((e) => e.querySelector(`:scope > .${iV}`)?.getAttribute("data-ui-pane") ?? "").join(pV);
}
function OV(e, t, n) {
	let r = wV(e), i = MV(r.map((e) => e.getAttribute("data-ui-pane-place") ?? ""), t), a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
	for (let e of r) {
		let t = e.querySelector(`:scope > .${iV}`), n = t?.getAttribute(Zn);
		t != null && n != null && a.set(n, t);
	}
	r.forEach((e, t) => {
		let n = a.get(i[t]);
		n !== void 0 && n.parentElement !== e && o.set(n, e);
	}), o.size > 0 && kV(e, o, n);
}
function kV(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let e of t.keys()) r.set(e, e.getBoundingClientRect());
	for (let [e, n] of t) e.style.transform = "", n.append(e);
	if (VV(e), !n || Xm()) return;
	let i = t.size + 1;
	for (let [e, t] of r) {
		let n = typeof e.animate == "function" ? jV(t, e.getBoundingClientRect()) : null, r = String(i--);
		n !== null && e.animate(n.map((e) => ({
			...e,
			zIndex: r
		})), {
			duration: V.normal + 60,
			easing: V.ease
		});
	}
}
function AV(e) {
	let t = e.style.transform;
	e.style.transform = "", !(t.length === 0 || t === "translate(0px, 0px)" || Xm() || typeof e.animate != "function") && e.animate([{ transform: t }, { transform: "none" }], {
		duration: V.normal,
		easing: V.ease
	});
}
function jV(e, t) {
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
function MV(e, t) {
	let n = new Set(e), r = /* @__PURE__ */ new Set(), i = e.map(() => null), a = t === null || t.length === 0 ? [] : t.split(pV).map((e) => e.trim());
	for (let e = 0; e < i.length && e < a.length; e++) n.has(a[e]) && !r.has(a[e]) && (i[e] = a[e], r.add(a[e]));
	let o = e.filter((e) => !r.has(e));
	return i.map((e) => e ?? o.shift() ?? "");
}
function NV(e, t, n, r, i, a, o) {
	let s = e.map((e) => PV(e.cells, n));
	return {
		cells: s,
		columnOrder: a ? FV(e, t, s, r, !0) : null,
		rowOrder: o ? FV(e, t, s, i, !1) : null
	};
}
function PV(e, t) {
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
function FV(e, t, n, r, i) {
	let a = [...n], o = new Map(e.map((e, t) => [e.name, t])), s = a.map(() => !1), c = null;
	for (let l = 0; l < a.length; l++) {
		if (s[l]) continue;
		let u = [];
		for (let e = l; e < a.length; e++) !s[e] && zV(a[e], a[l], i) && (s[e] = !0, u.push(e));
		u.sort((e, t) => RV(a[e], i).start - RV(a[t], i).start);
		let d = 0;
		for (let s = 1; s <= u.length; s++) s < u.length && RV(a[u[s]], i).start === BV(a[u[s - 1]], i) || (s - d > 1 && (c = IV(u.slice(d, s), e, t, o, a, n, r, i, c)), d = s);
	}
	return c;
}
function IV(e, t, n, r, i, a, o, s, c) {
	let l = [], u = !1, d = !1;
	for (let i of e) {
		let a = r.get(n[i]);
		if (a === void 0 || !e.includes(a)) return c;
		l.push(a), u ||= t[a].keepsSize, d ||= a !== i;
	}
	let f = RV(i[e[0]], s).start, p = BV(i[e[e.length - 1]], s);
	if (!u || !d || p - 1 > o || LV(e, i, s, f, p)) return c;
	let m = c ?? Array.from({ length: o }, (e, t) => t), h = f;
	return e.forEach((e, t) => {
		let { start: n, span: r } = RV(i[l[t]], s);
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
function LV(e, t, n, r, i) {
	return t.some((t, a) => {
		let o = RV(t, n).start, s = BV(t, n);
		return !e.includes(a) && o < i && s > r && (o > r || s < i);
	});
}
function RV(e, t) {
	return t ? {
		start: e.column,
		span: e.columnSpan
	} : {
		start: e.row,
		span: e.rowSpan
	};
}
function zV(e, t, n) {
	return n ? e.row === t.row && e.rowSpan === t.rowSpan : e.column === t.column && e.columnSpan === t.columnSpan;
}
function BV(e, t) {
	let { start: n, span: r } = RV(e, t);
	return n + r;
}
function VV(e) {
	let t = UV(e.getAttribute(Qn)), n = UV(e.getAttribute($n));
	if (t === null && n === null) return;
	let r = wV(e), i = new Set(r.flatMap((e) => {
		let t = e.querySelector(`:scope > .${iV}`);
		return t?.hasAttribute("data-ui-pane-keeps-size") === !0 ? [t.getAttribute("data-ui-pane") ?? ""] : [];
	})), a = r.map((e) => {
		let t = e.getAttribute("data-ui-pane-place") ?? "";
		return {
			name: t,
			cells: UV(e.getAttribute("data-ui-pane-cells"), WV) ?? [],
			keepsSize: i.has(t)
		};
	}), o = r.map((e) => e.querySelector(`:scope > .${iV}`)?.getAttribute("data-ui-pane") ?? ""), s = [], c = [];
	$m.forEach((e, i) => {
		let l = NV(a, o, i, t?.length ?? 0, n?.length ?? 0, t !== null, n !== null);
		r.forEach((t, n) => {
			let r = l.cells[n];
			t.style.setProperty(ih("--ui-placement-column", e), String(r.column)), t.style.setProperty(ih("--ui-placement-row", e), String(r.row)), t.style.setProperty(ih("--ui-placement-column-span", e), String(r.columnSpan)), t.style.setProperty(ih("--ui-placement-row-span", e), String(r.rowSpan));
		}), s.push(l.columnOrder), c.push(l.rowOrder);
	}), HV(e, "--ui-pane-columns", t, s), HV(e, "--ui-pane-rows", n, c);
}
function HV(e, t, n, r) {
	let i = n !== null && r.some((e) => e !== null);
	$m.forEach((a, o) => {
		i ? e.style.setProperty(ih(t, a), (r[o] ?? n.map((e, t) => t)).map((e) => n[e]).join(" ")) : e.style.removeProperty(ih(t, a));
	});
}
function UV(e, t = (e) => e) {
	if (e === null) return null;
	try {
		let n = JSON.parse(e);
		return Array.isArray(n) ? n.map(t) : null;
	} catch {
		return null;
	}
}
function WV(e) {
	return Array.isArray(e) && e.length === 4 ? {
		column: Number(e[0]),
		row: Number(e[1]),
		columnSpan: Number(e[2]),
		rowSpan: Number(e[3])
	} : null;
}
function GV(e, t, n) {
	for (let r of TV(e)) {
		if (r === t) continue;
		let e = r.getBoundingClientRect();
		if (n.x >= e.left && n.x <= e.right && n.y >= e.top && n.y <= e.bottom) return r;
	}
	return null;
}
function KV(e, t, n, r) {
	let i = TV(e).map((e) => ({
		place: e,
		box: e.getBoundingClientRect()
	})), a = i.find((e) => e.place === n)?.box;
	if (a === void 0) return null;
	let o = JV(qV(a), i.map((e) => e.place === t || e.place === n ? null : qV(e.box)), r);
	return o === null ? null : i[o].place;
}
function qV(e) {
	return {
		x: e.left + e.width / 2,
		y: e.top + e.height / 2
	};
}
function JV(e, t, n) {
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
var YV = "ui-split-button", XV = "ui-split-button__main", ZV = "ui-split-button__toggle", QV = "ui-split-button__menu", $V = "ui-split-button--open", eH = class {
	root;
	menus = new M_({
		show: ({ owner: e }) => e.classList.add($V),
		hide: ({ owner: e }) => e.classList.remove($V),
		closesWhenReadOnly: !1,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), document.addEventListener("click", (e) => this.handleChoice(e), !1);
	}
	handleClick(e) {
		let t = tH(e.target);
		if (t !== null) {
			e.preventDefault(), this.menus.isOpen(t) ? this.menus.close(t) : this.openMenu(t);
			return;
		}
		let n = this.menus.current;
		n !== null && e.target instanceof Element && e.target.closest(`.${XV}`)?.closest(`.${YV}`) === n && this.menus.close(n);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "ArrowDown" && e.key !== "ArrowUp" || !P(e)) return;
		let t = tH(e.target);
		t === null || this.menus.isOpen(t) || (e.preventDefault(), this.openMenu(t, e.key === "ArrowUp"));
	}
	handleChoice(e) {
		let t = this.menus.current;
		if (t === null || !(e.target instanceof Element)) return;
		let n = nH(t), r = e.target.closest(`.${C}`);
		n !== null && r !== null && n.contains(r) && MF(r) && this.menus.close(t);
	}
	openMenu(e, t = !1) {
		let n = nH(e), r = n?.querySelector(".ui-menu") ?? null;
		if (n === null || r === null) return;
		let i = e.getAttribute("data-ui-split-placement") ?? "";
		this.menus.open({
			owner: e,
			popup: n,
			anchor: e,
			placement: { placement: lh(i) ? i : "bottom-end" },
			openers: rH(e)
		}) && Vp(r, NF(r), t);
	}
};
function tH(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${ZV}, .${XV}`), n = t?.closest(`.${YV}`) ?? null;
	return t === null || n === null || t.classList.contains(XV) && n.getAttribute("data-ui-split-mode") !== "menu" ? null : n;
}
function nH(e) {
	return e.querySelector(`:scope > .${QV}`);
}
function rH(e) {
	return [...e.querySelectorAll(":scope > [aria-haspopup]")];
}
//#endregion
//#region src/interactions/button-group-engine.ts
var iH = "ui-button-group", aH = "ui-button-group__item", oH = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${iH}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), H(this.root, `.${iH}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [ci]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-selected-key") ?? "", n = [], r = null;
		for (let i of this.ownItems(e)) {
			let e = t.length > 0 && i.getAttribute("data-ui-key") === t, a = sH(i);
			i.toggleAttribute(si, e), a !== null && (a.setAttribute("aria-pressed", e ? "true" : "false"), n.push(a), e && (r = a));
		}
		F(n, r ?? n.find(I) ?? null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${aH}`), n = t?.closest(`.${iH}`) ?? null;
		if (t === null || n === null || t.closest(`.${iH}`) !== n || A(n)) return;
		let r = sH(t);
		r !== null && A(r) || this.choose(n, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${aH} > .${Mi}`), n = t?.closest(`.${iH}`) ?? null;
		if (t === null || n === null || !P(e)) return;
		let r = this.ownItems(n).map(sH).filter((e) => e !== null), i = Qu({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault(), i.focus({ preventScroll: !0 });
		let a = i.closest(`.${aH}`);
		a !== null && this.choose(n, a);
	}
	choose(e, t) {
		Sd(e, t.getAttribute("data-ui-key") ?? "", {
			attribute: ci,
			bindingAttribute: ui,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return bd(e, `.${aH}`, `.${iH}`);
	}
};
function sH(e) {
	return e.querySelector(`:scope > .${Mi}`);
}
//#endregion
//#region src/interactions/accordion-engine.ts
var cH = "ui-accordion", lH = "details", uH = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleSummaryClick(e), !0), this.root.addEventListener("toggle", (e) => this.handleToggle(e), !0), this.normalizeAll(this.root.querySelectorAll(`.${cH}`)), H(this.root, `.${cH}`, {
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
		if (t !== null && t.classList.contains(cH)) for (let n of this.sectionsOf(t)) n !== e && n.open && (n.open = !1);
	}
	sectionsOf(e) {
		return [...e.querySelectorAll(`:scope > ${lH}`)];
	}
}, dH = "ui-tab-overflow", fH = "ui-tab-overflow__menu", pH = "ui-tab-overflow__menu--open", mH = "ui-tab-overflow__entry", hH = "ui-tab-overflow__entry--current", gH = class {
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
		this.options = e, this.list = new bH(e.pick);
	}
	fit(e, t) {
		this.resizes?.observe(t.room), this.switches?.observe(e, { attributeFilter: ["class", "style"] });
		let n = this.options.wraps(e), r = t.captions[0]?.parentElement ?? null;
		if (this.wraps.set(e, n), this.spacings.set(e, {
			host: r,
			spacing: _H(r)
		}), n) {
			for (let e of t.captions) e.classList.remove(this.options.hiddenClass);
			e.classList.remove(this.options.overflowingClass), this.closeListOf(e);
			return;
		}
		e.classList.remove(this.options.overflowingClass);
		let i = () => e.classList.add(this.options.overflowingClass), a = this.options.trailing === !0 ? this.fitTrailing(t, i) : vH({
			...t,
			hiddenClass: this.options.hiddenClass,
			showButton: i
		});
		e.classList.toggle(this.options.overflowingClass, a), a || this.closeListOf(e);
	}
	spacingChanged(e) {
		let t = this.spacings.get(e);
		return t !== void 0 && _H(t.host) !== t.spacing;
	}
	fitTrailing(e, t) {
		for (let t of e.captions) this.resizes?.observe(t);
		return yH(e, this.options.hiddenClass, t);
	}
	closeListOf(e) {
		this.list.isOpenFor(e) && this.list.close();
	}
	toggleList(e, t, n) {
		this.list.isOpenFor(e) ? this.list.close() : this.list.open(t, e, n());
	}
};
function _H(e) {
	return e === null ? "" : getComputedStyle(e).columnGap ?? "";
}
function vH(e) {
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
function yH(e, t, n) {
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
var bH = class {
	menu;
	button = null;
	list = new M_({
		show: ({ popup: e }) => e.classList.add(pH),
		hide: ({ popup: e }) => {
			e.classList.remove(pH), this.button = null;
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e) || this.button !== null && t.includes(this.button),
		onWindowBlur: !0,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	pick;
	constructor(e) {
		this.pick = e, this.menu = document.createElement("div"), this.menu.className = fH, this.menu.setAttribute("role", "menu"), this.menu.addEventListener("click", (e) => this.handleClick(e)), this.menu.addEventListener("keydown", (e) => this.handleKeydown(e)), this.menu.addEventListener("pointermove", (e) => this.handlePointerMove(e));
	}
	isOpenFor(e) {
		return this.list.isOpen(e);
	}
	open(e, t, n) {
		this.close(), this.menu.replaceChildren(...n.map(xH)), this.menu.parentElement === null && document.body.appendChild(this.menu);
		let r = this.menu.querySelector(`.${hH}`);
		this.button = e, yh(e, this.menu);
		let i = {
			owner: t,
			popup: this.menu,
			anchor: e,
			placement: { placement: "bottom-end" },
			openers: [e],
			returnFocus: () => e
		};
		KN(this.list, i, this.entries(), r) || (this.button = null);
	}
	close() {
		this.list.close();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${mH}`), n = t?.getAttribute("data-ui-key") ?? null, r = this.list.current;
		t === null || n === null || r === null || A(t) || (this.close(), this.pick(r, n));
	}
	handleKeydown(e) {
		e.defaultPrevented || qN(e, this.entries());
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${mH}`) : null;
		t !== null && XN(t, this.entries());
	}
	entries() {
		return Array.from(this.menu.querySelectorAll(`.${mH}`));
	}
};
function xH(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${mH} ${Fi}`, t.classList.toggle(hH, e.current), t.setAttribute("role", "menuitem"), t.setAttribute(b, e.key), t.textContent = e.title, e.current && t.setAttribute("aria-current", "true"), e.disabled && (t.classList.add(bi), t.setAttribute("aria-disabled", "true")), t;
}
//#endregion
//#region src/interactions/tab-switch.ts
var SH = "data-ui-caption-text", CH = ".ui-text__title";
function wH(e) {
	for (let t of e.querySelectorAll(CH)) {
		let e = t.textContent ?? "";
		t.getAttribute(SH) !== e && t.setAttribute(SH, e);
	}
}
function TH(e, t) {
	if (e === null || t === null || e === t || typeof t.animate != "function" || Xm()) return;
	let n = e.getBoundingClientRect(), r = t.getBoundingClientRect();
	n.width !== 0 && r.width !== 0 && t.animate([{ transform: `translateX(${n.left - r.left}px) scaleX(${n.width / r.width})` }, { transform: "none" }], {
		duration: V.normal,
		easing: V.ease,
		pseudoElement: "::after"
	});
}
function EH(e) {
	if (!(e === null || Xm())) for (let t of e.children) typeof t.animate == "function" && t.animate([{ opacity: 0 }, { opacity: 1 }], {
		duration: V.fast,
		easing: V.enter
	});
}
//#endregion
//#region src/interactions/tabs-engine.ts
var DH = "ui-tabs", OH = "ui-tab-caption", kH = "ui-tab-caption--selected", AH = "ui-tab-caption--overflowed", jH = "ui-tabs--overflowing", MH = "ui-tabs--no-overflow", NH = "ui-tabs__strip", PH = "ui-tabs__band", FH = class {
	root;
	fitter;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new gH({
			rootClass: DH,
			overflowingClass: jH,
			wraps: (e) => e.classList.contains(MH),
			hiddenClass: AH,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${DH}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), H(this.root, `.${DH}`, {
			childList: !0,
			attributeFilter: [di, ..._i],
			relevant: (e) => !_g(e, `[${mi}]`, `.${DH}`)
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-tabs-selected") ?? "", n = this.ownHeaders(e), r = n.filter(IH), i = Cd(r, t, (e) => e.getAttribute("data-ui-tab-key") ?? "");
		if (i !== null && i !== t) {
			this.select(e, i);
			return;
		}
		let a = n.find((e) => e.classList.contains(kH)) ?? null, o = null;
		for (let n of bd(e, `[${hi}]`, `.${DH}`)) n.hidden = (n.getAttribute("data-ui-tab-actions") ?? "") !== t;
		for (let e of n) {
			let n = (e.getAttribute("data-ui-tab-key") ?? "") === t;
			e.classList.toggle(kH, n), e.setAttribute("aria-selected", n ? "true" : "false"), wH(e), n && (o = e);
		}
		this.fitHeaders(e, r, o), TH(a, o), F(n.filter((e) => !e.classList.contains(AH)), o);
		for (let n of this.ownPages(e)) n.hidden = (n.getAttribute("data-ui-tab-page") ?? "") !== t, !n.hidden && a !== null && a !== o && EH(n);
	}
	fitHeaders(e, t, n) {
		let r = e.querySelector(`:scope > .${NH}, :scope > .${PH} > .${NH}`), i = r?.querySelector(":scope > .ui-tab-overflow") ?? null;
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
			return this.ownHeaders(e).filter(IH).map((e) => {
				let n = e.getAttribute("data-ui-tab-key") ?? "";
				return {
					key: n,
					title: e.textContent?.trim() ?? n,
					current: n === t,
					disabled: A(e)
				};
			});
		});
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${dH}`), n = t?.closest(`.${DH}`) ?? null;
		if (t !== null && n !== null && t.closest(`.${DH}`) === n) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = e.target.closest(`.${OH}`);
		if (r === null || A(r)) return;
		let i = r.closest(`.${DH}`), a = r.getAttribute(pi);
		i !== null && a !== null && r.closest(`.${DH}`) === i && (e.preventDefault(), this.select(i, a));
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || zu(e) || !P(e)) return;
		let t = e.target.closest(`.${OH}`), n = t?.closest(`.${DH}`) ?? null;
		if (t === null || n === null) return;
		let r = Qu({
			key: e.key,
			items: this.ownHeaders(n),
			current: t,
			axis: "horizontal"
		});
		r !== null && (e.preventDefault(), this.select(n, r.getAttribute("data-ui-tab-key") ?? ""), r.focus());
	}
	select(e, t) {
		Sd(e, t, {
			attribute: di,
			bindingAttribute: ui,
			apply: (e) => this.apply(e)
		});
	}
	ownHeaders(e) {
		return bd(e, `.${OH}`, `.${DH}`);
	}
	ownPages(e) {
		return bd(e, `[${mi}]`, `.${DH}`);
	}
};
function IH(e) {
	return e.classList.contains(AH) || TI(e);
}
//#endregion
//#region src/interactions/tab-out.ts
function LH(e) {
	e.hasAttribute("data-ui-tab-out") || (e.setAttribute(Fe, e.getAttribute("tabindex") ?? ""), e.setAttribute("tabindex", "-1"));
}
function RH(e) {
	let t = e.getAttribute(Fe);
	t !== null && (e.removeAttribute(Fe), t.length === 0 ? e.removeAttribute("tabindex") : e.setAttribute("tabindex", t));
}
function zH(e) {
	return e.tabIndex >= 0 || e.hasAttribute("data-ui-tab-out");
}
//#endregion
//#region src/interactions/command-bar-engine.ts
var BH = "ui-command-bar", VH = "ui-command-bar__host", HH = "ui-command-bar__item", UH = "ui-command-bar__overflow", WH = "ui-command-bar--overflowing", GH = "ui-command-bar__overflowed", KH = "ui-orientation--vertical", qH = "ui-text__title", JH = `${tp}, [${Fe}]`, YH = class {
	root;
	fitter;
	listed = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new gH({
			rootClass: BH,
			overflowingClass: WH,
			wraps: (e) => !eU(e),
			hiddenClass: GH,
			trailing: !0,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pick(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${BH}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), H(this.root, `.${BH}`, {
			childList: !0,
			addedOnly: !0,
			relevant: XH
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = ZH(e), n = e.querySelector(`:scope > .${UH}`);
		if (t === null || n === null) return;
		let r = tU(t);
		this.fitter.fit(e, {
			room: e,
			button: n,
			captions: r,
			selected: null
		}), e.classList.contains(WH) && nU(r);
		for (let e of r) _h(e, e.classList.contains(GH) ? n : null);
		e.classList.contains(KH) ? e.setAttribute("aria-orientation", "vertical") : e.removeAttribute("aria-orientation"), QH(e, null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${UH}`), n = t?.parentElement ?? null;
		t !== null && n !== null && n.classList.contains(BH) && (e.preventDefault(), this.fitter.toggleList(n, t, () => this.entriesOf(n)));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof HTMLElement) || !P(e) || zu(e)) return;
		let t = e.target.closest(`.${BH}`), n = t === null ? [] : $H(t);
		if (t === null || !n.includes(e.target)) return;
		let r = Qu({
			key: e.key,
			items: n,
			current: e.target,
			axis: t.classList.contains(KH) ? "vertical" : "horizontal"
		});
		r !== null && (e.preventDefault(), QH(t, r), r.focus());
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement ? e.target : null, n = t?.closest(`.${BH}`) ?? null;
		t !== null && n !== null && $H(n).includes(t) && QH(n, t);
	}
	entriesOf(e) {
		let t = ZH(e), n = t === null ? [] : tU(t).filter((e) => e.classList.contains(HH) && e.classList.contains(GH)).map((e) => e.querySelector("[data-ui-id]") ?? e);
		return this.listed.set(e, n), n.map((e, t) => ({
			key: String(t),
			title: rU(e),
			current: !1,
			disabled: A(e)
		}));
	}
	pick(e, t) {
		let n = this.listed.get(e)?.[Number(t)];
		n?.isConnected === !0 && !A(n) && iU(n).click();
	}
};
function XH(e) {
	let t = e.target;
	if (t instanceof Element && (t.classList.contains(BH) || t.classList.contains(VH) || t.classList.contains(HH))) return !0;
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains(BH) || t.querySelector(`.${BH}`) !== null)) return !0;
	return !1;
}
function ZH(e) {
	return e.querySelector(`:scope > .${VH}`);
}
function QH(e, t) {
	let n = $H(e), r = n.find((e) => e.tabIndex >= 0 && I(e)), i = t ?? n.find((e) => e === document.activeElement) ?? r ?? n.find(I) ?? null;
	for (let e of n) e === i ? RH(e) : LH(e);
}
function $H(e) {
	let t = ZH(e), n = [];
	for (let e of t === null ? [] : tU(t)) if (e.classList.contains(HH) && !e.classList.contains(GH)) for (let t of e.querySelectorAll(JH)) zH(t) && Xu(e, t) && n.push(t);
	let r = e.querySelector(`:scope > .${UH}`);
	return r !== null && e.classList.contains(WH) && n.push(r), n;
}
function eU(e) {
	let t = ZH(e);
	if (t === null) return !1;
	let n = getComputedStyle(t);
	return n.flexDirection.startsWith("row") && n.flexWrap === "nowrap";
}
function tU(e) {
	let t = [];
	for (let n of Array.from(e.children)) {
		if (n.classList.contains("ui-hidden")) continue;
		if (n.hasAttribute("data-ui-group-header")) {
			t.push(n);
			continue;
		}
		let e = n.classList.contains(HH) ? n.querySelector(w) : null;
		e !== null && TI(e) && t.push(n);
	}
	return t;
}
function nU(e) {
	let t = !1;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.classList.contains(HH) ? t ||= !r.classList.contains(GH) : t || r.classList.add(GH);
	}
}
function rU(e) {
	let t = iU(e), n = t.querySelector(`.${qH}`)?.textContent?.trim() ?? "";
	return n.length > 0 ? n : e.getAttribute("aria-label")?.trim() || t.getAttribute("aria-label")?.trim() || t.textContent?.trim() || "";
}
function iU(e) {
	return e.matches(tp) ? e : e.querySelector(tp) ?? e;
}
//#endregion
//#region src/interactions/breadcrumbs-engine.ts
var aU = "ui-breadcrumbs", oU = "ui-breadcrumbs__item", sU = "ui-breadcrumb", cU = "ui-breadcrumb--current", lU = "ui-hidden", uU = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), H(this.root, `.${aU}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: ["class", ..._i]
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${aU}`)) this.apply(e);
	}
	apply(e) {
		let t = bd(e, `.${oU}`, `.${aU}`);
		dU(t);
		let n = t.filter((e) => !e.classList.contains(lU)).map((e) => e.querySelector(`.${sU}`)).filter((e) => e !== null && !e.classList.contains(lU)), r = n.length === 0 ? null : n[n.length - 1];
		for (let e of n) {
			let t = e === r;
			e.classList.toggle(cU, t), t ? (e.setAttribute("aria-current", "page"), e.setAttribute("tabindex", "-1")) : (e.removeAttribute("aria-current"), e.removeAttribute("tabindex"));
		}
	}
};
function dU(e) {
	let t = $m.map(() => !1);
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n], i = $m.map((e, t) => fU(r, t));
		if (pU(r, Mr, $m.filter((e, t) => i[t])), pU(r, Nr, $m.filter((e, n) => !t[n])), !r.classList.contains(lU)) for (let e = 0; e < $m.length; e++) t[e] ||= !i[e];
	}
}
function fU(e, t) {
	for (let n of e.children) if (n.getAttribute(_i[t]) === "collapsed") return !0;
	return !1;
}
function pU(e, t, n) {
	let r = n.join(" ");
	T(e, t, r.length === 0 ? null : r);
}
//#endregion
//#region src/interactions/color-input-engine.ts
var mU = "ui-color-input", hU = "ui-color-input--open", gU = "ui-color-input__popup", _U = "ui-color-input__text", vU = "ui-color-input__row", yU = "ui-color-input__swatch--button", bU = "ui-color-input__value-input", xU = "ui-color-input__square-thumb", SU = "ui-color-input__hue-thumb", CU = "data-ui-color-toggle", wU = "data-ui-color-tab", TU = "data-ui-color-tab-selected", EU = "data-ui-color-pane", DU = "data-ui-color-pane-selected", OU = "data-ui-color-square", kU = "data-ui-color-hue", AU = "data-ui-color-hex", jU = "data-ui-color-channel", MU = "data-ui-color-factor", NU = "data-ui-color-opacity", PU = "data-ui-color-name", FU = "data-ui-color-name-selected", IU = "data-ui-color-format", LU = "data-ui-color-variant", RU = "data-ui-color-no-picker", zU = "data-ui-color-no-palette", BU = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	popups = new M_({
		show: ({ owner: e }) => e.classList.add(hU),
		hide: ({ owner: e }) => e.classList.remove(hU)
	});
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${mU}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(Ba(e.components, `.${mU}`));
		}), H(this.root, `.${mU}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [
				IU,
				LU,
				RU,
				zU
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), new Yg({
			root: this.root,
			resolveHandle: (e) => e.closest(`[${OU}], [${kU}]`),
			begin: (e, t) => {
				let n = e.closest(`.${mU}`);
				if (n === null) return null;
				let r = {
					input: n,
					element: e,
					surface: e.hasAttribute(OU) ? "square" : "hue",
					stateBefore: this.states.get(n),
					valueBefore: n.querySelector(`.${bU}`)?.value ?? null
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
		let t = GU(e), n = this.states.get(e), r = n?.paneChosen === !0 ? VU(e, n.pane) : HU(e);
		if (t.length === 0 || t.startsWith("@")) return {
			...n ?? UU(r),
			pane: r,
			held: !1
		};
		if (t.startsWith("#")) {
			let i = $U(t);
			if (i === null) return n ?? UU(r);
			let [a, o, s, c] = i;
			if (n !== void 0 && n.name === null && WU(this.resolveRgb(e, n), [
				a,
				o,
				s
			])) return {
				...n,
				pane: r,
				opacity: c,
				held: !0
			};
			let [l, u, d] = nW(a, o, s);
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
			...n ?? UU(r),
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
			let [e, a, o] = nW(n, r, i);
			t = {
				...t,
				hue: e,
				saturation: a,
				value: o
			};
		}
		let a = this.states.get(e);
		this.states.set(e, t), YU(e, "--ui-color-input-color", t.held ? tW(n, r, i, t.opacity) : "transparent"), YU(e, "--ui-color-input-solid", tW(n, r, i, 255)), YU(e, "--ui-color-input-on-color", t.held ? eC(n, r, i, t.opacity) : "inherit"), JU(e, t.held ? qU(e, n, r, i, t.opacity) : ""), this.applyPicker(e, t, n, r, i), (a === void 0 || a.name !== t.name || a.pane !== t.pane || a.held !== t.held) && (this.applyPalette(e, t), this.applyPanes(e, t));
	}
	applyPicker(e, t, n, r, i) {
		let a = e.querySelector(`[${OU}]`), o = e.querySelector(`[${kU}]`), [s, c, l] = rW(t.hue, 1, 1);
		if (YU(e, "--ui-color-input-hue", tW(s, c, l, 255)), a !== null) {
			let e = a.querySelector(`.${xU}`);
			e !== null && (YU(e, "left", `${t.saturation * 100}%`), YU(e, "top", `${(1 - t.value) * 100}%`));
		}
		if (o !== null) {
			let e = o.querySelector(`.${SU}`);
			e !== null && YU(e, "top", `${t.hue / 360 * 100}%`);
		}
		XU(e, `[${AU}]`, eW(n, r, i)), XU(e, `[${jU}="r"]`, String(n)), XU(e, `[${jU}="g"]`, String(r)), XU(e, `[${jU}="b"]`, String(i)), YU(e, "--ui-color-input-opacity-fill", `${t.opacity / 255 * 100}%`), ZU(e, `[${NU}]`, t.opacity);
	}
	applyPalette(e, t) {
		for (let n of e.querySelectorAll(`[${PU}]`)) n.getAttribute(PU) === t.name ? n.setAttribute(FU, "") : n.removeAttribute(FU);
		let n = t.name === null ? null : e.querySelector(`[${PU}="${Yi(t.name)}"]`), r = n === null ? null : $U(n.style.getPropertyValue("--ui-color-input-chip").trim());
		YU(e, "--ui-color-input-base", r === null ? "transparent" : tW(r[0], r[1], r[2], 255)), ZU(e, `[${MU}]`, t.factor);
	}
	applyPanes(e, t) {
		for (let n of e.querySelectorAll(`[${EU}]`)) n.getAttribute(EU) === t.pane ? n.setAttribute(DU, "") : n.removeAttribute(DU);
		for (let n of e.querySelectorAll(`[${wU}]`)) n.getAttribute(wU) === t.pane ? n.setAttribute(TU, "") : n.removeAttribute(TU);
	}
	resolveRgb(e, t) {
		if (t.name === null) return rW(t.hue, t.saturation, t.value);
		let n = e.querySelector(`[${PU}="${Yi(t.name)}"]`), r = n === null ? null : $U(n.style.getPropertyValue("--ui-color-input-chip").trim());
		return r === null ? rW(t.hue, t.saturation, t.value) : QU([
			r[0],
			r[1],
			r[2]
		], t.factor);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${CU}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${mU}`));
			return;
		}
		let n = e.target.closest(`[${wU}]`), r = e.target.closest(`.${mU}`);
		if (r === null) return;
		if (n !== null) {
			e.preventDefault();
			let t = n.getAttribute(wU), i = this.states.get(r);
			i !== void 0 && (t === "picker" || t === "palette") && this.applyState(r, {
				...i,
				pane: t,
				paneChosen: !0
			});
			return;
		}
		let i = e.target.closest(`[${PU}]`);
		if (i !== null) {
			e.preventDefault(), this.commit(r, (e) => ({
				...e,
				name: i.getAttribute(PU)
			}));
			return;
		}
		let a = r.querySelector(`.${gU}`);
		(a === null || !e.composedPath().includes(a)) && (e.preventDefault(), this.toggle(r));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target.closest(`.${mU}`);
		t !== null && (e.target.hasAttribute(MU) ? this.commit(t, (t) => ({
			...t,
			factor: Number(e.target instanceof HTMLInputElement ? e.target.value : 0)
		}), !1) : e.target.hasAttribute(NU) && this.commit(t, (t) => ({
			...t,
			opacity: QS(Number(e.target instanceof HTMLInputElement ? e.target.value : 255))
		}), !1));
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target, n = t.closest(`.${mU}`);
		if (n === null) return;
		if (t.hasAttribute(MU) || t.hasAttribute(NU)) {
			this.send(n);
			return;
		}
		if (t.hasAttribute(AU)) {
			let e = $U(t.value);
			if (e === null) {
				this.applyAll([n]);
				return;
			}
			let [r, i, a] = nW(e[0], e[1], e[2]);
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
		let r = t.getAttribute(jU);
		if (r === null) return;
		let i = this.states.get(n);
		if (i === void 0) return;
		let [a, o, s] = this.resolveRgb(n, i), c = {
			r: a,
			g: o,
			b: s
		};
		c[r] = QS(Number(t.value));
		let [l, u, d] = nW(c.r, c.g, c.b);
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
		let t = e.input.querySelector(`.${bU}`);
		t !== null && e.valueBefore !== null && (t.value = e.valueBefore);
	}
	applyPoint(e, t) {
		let { input: n, element: r, surface: i } = e, a = r.getBoundingClientRect();
		if (i === "hue") {
			let e = iW((t.y - a.top) / a.height);
			this.commit(n, (t) => ({
				...t,
				hue: e * 360,
				name: null
			}), !1);
			return;
		}
		let o = iW((t.x - a.left) / a.width), s = 1 - iW((t.y - a.top) / a.height);
		this.commit(n, (e) => ({
			...e,
			saturation: o,
			value: s,
			name: null
		}), !1);
	}
	commit(e, t, n = !0) {
		let r = this.states.get(e);
		if (r === void 0 || M(e)) return;
		let i = {
			...t(r),
			held: !0
		};
		this.applyState(e, i);
		let a = e.querySelector(`.${bU}`);
		a !== null && (a.value = KU(i, this.resolveRgb(e, i)), n && this.send(e));
	}
	send(e) {
		M(e) || e.querySelector(`.${bU}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	toggle(e) {
		if (e === null || e.hasAttribute(RU) && e.hasAttribute(zU)) return;
		if (this.popups.isOpen(e)) {
			this.popups.close(e);
			return;
		}
		let t = e.querySelector(`.${gU}`);
		if (t === null) return;
		let n = e.getAttribute(LU) === "swatch", r = n ? e.querySelector(`.${yU}`) : e.querySelector(`.${vU}`), i = n ? r : r?.querySelector(`[${CU}]`) ?? null;
		this.popups.open({
			owner: e,
			popup: t,
			anchor: r ?? e,
			placement: { placement: "bottom-end" },
			openers: i === null ? [] : [i],
			focus: t.querySelector(`[${TU}]`) ?? !0
		});
	}
};
function VU(e, t) {
	return ((t) => !e.hasAttribute(t === "picker" ? RU : zU))(t) ? t : t === "picker" ? "palette" : "picker";
}
function HU(e) {
	return VU(e, "picker");
}
function UU(e) {
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
function WU(e, t) {
	return e[0] === t[0] && e[1] === t[1] && e[2] === t[2];
}
function GU(e) {
	return e.querySelector(`.${bU}`)?.value.trim() ?? "";
}
function KU(e, t) {
	if (e.name !== null) {
		let t = e.factor === 0 ? "None" : e.factor < 0 ? "Shade" : "Tint";
		return `${e.name}/${t}/${Math.abs(e.factor)}/${e.opacity}`;
	}
	let n = eW(t[0], t[1], t[2]);
	return e.opacity === 255 ? n : `${n}${$S(e.opacity)}`;
}
function qU(e, t, n, r, i) {
	if (e.getAttribute(IU) === "rgb") return i === 255 ? `rgb(${t}, ${n}, ${r})` : `rgba(${t}, ${n}, ${r}, ${(i / 255).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")})`;
	let a = eW(t, n, r);
	return i === 255 ? a : `${a}${$S(i)}`;
}
function JU(e, t) {
	for (let n of e.querySelectorAll(`.${_U}`)) n.textContent !== t && (n.textContent = t);
}
function YU(e, t, n) {
	e !== null && e.style.getPropertyValue(t) !== n && e.style.setProperty(t, n);
}
function XU(e, t, n) {
	let r = e.querySelector(t);
	r !== null && r !== document.activeElement && r.value !== n && (r.value = n);
}
function ZU(e, t, n) {
	for (let r of e.querySelectorAll(t)) r !== document.activeElement && r.value !== String(n) && (r.value = String(n));
}
function QU(e, t) {
	if (t === 0) return e;
	let n = Math.abs(t) / 10;
	return t < 0 ? [
		QS(e[0] * (1 - n)),
		QS(e[1] * (1 - n)),
		QS(e[2] * (1 - n))
	] : [
		QS(e[0] + (255 - e[0]) * n),
		QS(e[1] + (255 - e[1]) * n),
		QS(e[2] + (255 - e[2]) * n)
	];
}
function $U(e) {
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
function eW(e, t, n) {
	return `#${$S(e)}${$S(t)}${$S(n)}`;
}
function tW(e, t, n, r) {
	return `rgba(${e}, ${t}, ${n}, ${(r / 255).toFixed(3)})`;
}
function nW(e, t, n) {
	let r = e / 255, i = t / 255, a = n / 255, o = Math.max(r, i, a), s = o - Math.min(r, i, a), c = 0;
	return s !== 0 && (c = o === r ? (i - a) / s % 6 : o === i ? (a - r) / s + 2 : (r - i) / s + 4, c *= 60, c < 0 && (c += 360)), [
		c,
		o === 0 ? 0 : s / o,
		o
	];
}
function rW(e, t, n) {
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
		QS((o + a) * 255),
		QS((s + a) * 255),
		QS((c + a) * 255)
	];
}
function iW(e) {
	return Math.min(1, Math.max(0, e));
}
//#endregion
//#region src/interactions/surface-press-engine.ts
var aW = `:is(.ui-surface, .ui-card, .${Tt})[${y}]`, oW = "ui-surface--clickable", sW = class {
	pressable = /* @__PURE__ */ new WeakSet();
	space = new fu();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("keydown", (e) => this.handleKeyDown(e)), t.addEventListener("keyup", (e) => this.space.release(e)), fW(t, ["hover", "press"], (e) => dW(e.closest(Gu))), H(t, aW, {
			childList: !0,
			attributeFilter: ["class"]
		}, (e) => this.syncEach(e)), this.syncEach(t.querySelectorAll(aW));
	}
	syncEach(e) {
		for (let t of e) {
			this.sync(t);
			let e = t.parentElement?.closest(aW) ?? null;
			e !== null && this.sync(e);
		}
	}
	sync(e) {
		e.classList.contains(oW) ? (this.pressable.add(e), T(e, "role", uW(e) ? "group" : "button"), T(e, "tabindex", e.matches(".ui-disabled, .ui-loading") ? null : lW(e) ? "-1" : "0")) : this.pressable.delete(e) && (e.removeAttribute("tabindex"), e.removeAttribute("role"));
	}
	handleKeyDown(e) {
		let t = cW(e);
		if (t === null) return;
		let n = e.key;
		n === "Enter" ? (e.preventDefault(), e.repeat || t.click()) : n === " " && (e.preventDefault(), this.space.hold(t));
	}
};
function cW(e) {
	if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !P(e, { shift: !0 })) return null;
	let t = e.target;
	return t instanceof HTMLElement && t.classList.contains(oW) && t.hasAttribute("tabindex") ? t : null;
}
function lW(e) {
	let t = e.closest(Td);
	return t !== null && t.closest(L)?.matches(".ui-items-view, .ui-table") === !0 && qu(t) === e;
}
function uW(e) {
	for (let t of e.querySelectorAll(Gu)) if (Xu(e, t)) return !0;
	return !1;
}
function dW(e) {
	let t = [];
	for (let n = e?.parentElement?.closest(`.${oW}`) ?? null; n !== null; n = n.parentElement?.closest(`.${oW}`) ?? null) t.push(n);
	return t;
}
function fW(e, t, n) {
	let r = {
		hover: [],
		press: []
	}, i = !1, a = (e, t) => {
		let a = t instanceof Element ? n(t) : [];
		e === "press" && (i = !1);
		for (let t of r[e]) a.includes(t) || pW(t, e, !1);
		for (let t of a) pW(t, e, !0);
		r[e] = a;
	};
	t.includes("hover") && (e.addEventListener("pointerover", (e) => a("hover", e.target)), e.addEventListener("pointerout", (e) => a("hover", e.relatedTarget))), t.includes("press") && (e.addEventListener("pointerdown", (e) => a("press", e.button === 0 ? e.target : null), !0), e.addEventListener("pointerup", () => a("press", null), !0), e.addEventListener("dragend", () => a("press", null), !0), e.addEventListener("dragstart", () => {
		i = r.press.length > 0;
	}, !0), e.addEventListener("pointercancel", () => {
		i || a("press", null);
	}, !0));
}
function pW(e, t, n) {
	let r = (e.getAttribute("data-ui-inner-pointer") ?? "").split(" ").filter((e) => e !== "" && e !== t);
	n && r.push(t), T(e, ai, r.length === 0 ? null : r.sort().join(" "));
}
//#endregion
//#region src/interactions/table-columns-engine.ts
var mW = "ui-table", hW = "ui-table--reorderable", gW = "ui-scroll-x--auto", _W = "ui-scroll-x--always", vW = `:scope > .${ar}`, yW = `.${sr}`, bW = "ui-table__header-cell", xW = `${bW}--pinned`, SW = `${vW} > .${or} > .${bW}`, CW = `${SW}--pinned`, wW = "ui-table__host", TW = `${vW} > .${wW}`, EW = `.${mW}, .${ir}, [${er}]`, DW = "--ui-table-columns", OW = "--ui-table-sticky-top", kW = "--ui-table-sticky-bottom", AW = "--ui-table-sized-columns", jW = "--ui-table-pin-", MW = 64, NW = "data-ui-table-cell-hidden", PW = "data-ui-table-cell-last", FW = "columns", IW = "hidden", LW = "order", RW = "layout", zW = 32, BW = 16, VW = class {
	root;
	store = new QP();
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
		if (this.root = e.root ?? document, this.drag = new Yg({
			root: this.root,
			resolveHandle: (e) => e.closest(yW),
			begin: (e) => this.resolveContext(e),
			coordinate: () => "clientX",
			move: (e, t) => this.apply(e, t),
			end: (e, t) => this.remember(t.table),
			cancel: (e, t) => this.putBack(t)
		}), this.reorder = new Yg({
			root: this.root,
			resolveHandle: (e) => this.resolveCaption(e),
			begin: (e, t) => this.beginReorder(e, t.x),
			coordinate: () => "clientX",
			move: (e, t) => this.aimDrop(e, t),
			end: (e, t) => this.endReorder(e, t)
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), fW(this.root, ["hover", "press"], (e) => {
			let t = e.closest(yW)?.parentElement ?? null;
			return t === null ? [] : [t];
		}), typeof matchMedia == "function") for (let e of $m) e !== "base" && matchMedia(th(e)).addEventListener("change", () => this.layoutAll());
		this.restoreEach(this.root.querySelectorAll(`.${mW}`)), H(this.root, `.${mW}`, {
			childList: !0,
			relevant: KW
		}, (e) => {
			for (let t of e) this.restored.has(t) && (this.stampUnstyledColumns(t, !0), this.indexColumns(t, !0));
			this.restoreEach(e);
		}), H(this.root, `.${mW}`, {
			attributeFilter: ["class"],
			relevant: (e) => e.target instanceof Element && e.target.classList.contains(mW)
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.layout(t);
		}), H(this.root, `.${mW}`, {
			childList: !0,
			attributeFilter: ["class", "hidden"],
			relevant: qW
		}, (e) => {
			for (let t of e) {
				let e = t.querySelector(TW);
				e !== null && t.hasAttribute("data-ui-table-scrollbar") && this.markScrollbar(t, e);
			}
		});
	}
	restoreEach(e) {
		for (let t of e) {
			if (this.restored.has(t)) continue;
			this.restored.add(t), this.restore(t), this.layout(t), NB(t, () => this.pin(t));
			let e = t.querySelector(vW);
			e !== null && NB(e, () => HW(t, e));
			let n = t.querySelector(TW);
			n !== null && (this.markScrollbar(t, n), NB(n, () => this.markScrollbar(t, n)));
		}
	}
	restore(e) {
		let t = this.columnsOf(e), n = this.store.read(e, FW), r = n === null ? null : dl(n);
		r !== null && r.length !== t.length ? (this.store.write(e, FW, null), this.store.writeBoot(e, RW, null), this.widths.set(e, null)) : this.widths.set(e, r);
		let i = this.store.readJson(e, LW);
		i !== null && !YW(i, t) ? (this.store.write(e, LW, null), this.orders.set(e, null)) : this.orders.set(e, i);
	}
	markScrollbar(e, t) {
		let n = getComputedStyle(t).overflowY;
		e.toggleAttribute(vr, n === "scroll" || n === "auto" && t.scrollHeight > t.clientHeight);
	}
	layoutAll() {
		for (let e of this.root.querySelectorAll(`.${mW}`)) this.layout(e);
	}
	layout(e) {
		let t = this.columnsOf(e), n = this.hiddenOf(e, t), r = this.placesOf(e, t), i = JW(r), a = this.widths.get(e) ?? null, o = r.some((e, t) => e !== t), s = e.classList.contains(gW) || e.classList.contains(_W);
		if (a === null && n.size === 0 && !o && !s) e.style.removeProperty(AW);
		else {
			let t = a ?? this.authoredTracks(e);
			if (t !== null) {
				let r = Bl(t, n);
				e.style.setProperty(AW, hl(i.map((e) => r[e]), s ? "max-content" : "auto"));
			}
		}
		for (let t = 0; t < r.length; t++) o ? e.style.setProperty(`${Xd}${t}`, String(r[t])) : e.style.removeProperty(`${Xd}${t}`);
		let c = [...n].sort((e, t) => e - t).join(" ");
		T(e, rr, c.length === 0 ? null : c);
		let l = [...i].reverse().find((e) => !n.has(e));
		if (l === void 0 ? e.removeAttribute(pr) : e.getAttribute("data-ui-table-last") !== String(l) && e.setAttribute(pr, String(l)), this.columnStates.set(e, {
			places: r,
			hidden: n,
			last: l ?? -1
		}), this.stampUnstyledColumns(e, !1), this.indexColumns(e, !1), e.classList.contains(hW)) for (let e of t) !e.anchored && !e.cell.hasAttribute("tabindex") && e.cell.setAttribute("tabindex", "-1");
		this.pin(e);
	}
	stampUnstyledColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0 || n.places.length <= MW) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}|${n.last}`;
		if (t || this.stampedStates.get(e) !== r) {
			this.stampedStates.set(e, r);
			for (let t of e.querySelectorAll(`[${er}]`)) {
				let r = Number(t.getAttribute(er));
				r >= MW && t.closest(`.${mW}`) === e && (t.style.order = String(n.places[r] ?? r), t.toggleAttribute(NW, n.hidden.has(r)), t.toggleAttribute(PW, r === n.last));
			}
		}
	}
	indexColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}`, i = this.indexedStates.get(e) === r;
		(!i || t) && (this.indexedStates.set(e, r), tf(e, JW(n.places), n.hidden, i));
	}
	columnsOf(e) {
		let t = [];
		for (let n of e.querySelectorAll(SW)) {
			let e = Number(n.getAttribute(er)), r = n.getAttribute(tr), i = n.classList.contains(xW) || n.hasAttribute("data-ui-table-fixed");
			Number.isInteger(e) && t.push({
				index: e,
				key: n.getAttribute("data-ui-table-column-key") ?? String(e),
				hideBelow: $W(r) ? r : null,
				startsHidden: n.hasAttribute(nr),
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
		for (let e of t) (n[e.key] ?? QW(e)) && r.add(e.index);
		return r;
	}
	choicesOf(e) {
		let t = this.hiddenChoices.get(e);
		return t === void 0 && (t = this.store.readJson(e, IW) ?? {}, this.hiddenChoices.set(e, t)), t;
	}
	authoredTracks(e) {
		let t = e.style.getPropertyValue(DW).trim(), n = t.length === 0 ? null : dl(t);
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
		n === null || i !== void 0 && n === QW(i) ? delete r[t] : r[t] = n, this.hiddenChoices.set(e, r), this.store.writeJson(e, IW, Object.keys(r).length === 0 ? null : r), this.layout(e), this.rememberBoot(e);
	}
	columnOrder(e) {
		if (!(e instanceof HTMLElement)) return [];
		let t = this.columnsOf(e), n = new Map(t.map((e) => [e.index, e]));
		return JW(this.placesOf(e, t)).map((e) => n.get(e)?.key ?? "").filter((e) => e.length > 0);
	}
	pin(e) {
		let t = e.querySelectorAll(CW).length;
		if (t < 2) return;
		let n = Il(this.trackSizes(e), t);
		for (let t = 1; t < n.length; t++) e.style.setProperty(`${jW}${t}`, `${n[t]}px`);
	}
	handleScroll(e) {
		let t = e.target;
		t instanceof HTMLElement && t.classList.contains("ui-table__scroll") && t.closest(`.${mW}`)?.toggleAttribute(_r, t.scrollLeft > 0);
	}
	trackSizes(e) {
		let t = e.querySelector(vW), n = t === null ? [] : getComputedStyle(t).gridTemplateColumns.split(" ").map(parseFloat);
		return WW(e) ? n.slice(1) : n;
	}
	columnSizes(e, t) {
		let n = this.trackSizes(e);
		return t.map((e) => n[e]);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		if (e.altKey && P(e, { alt: !0 }) && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
			this.stepColumn(e, e.key === "ArrowLeft" ? -1 : 1);
			return;
		}
		let t = e.target.closest(yW), n = t ?? (e.shiftKey ? UW(e.target) : null);
		if (n === null || this.drag.active || !P(e, { shift: t === null })) return;
		if (t !== null && e.key === "Enter" || t === null && e.key === "Backspace") {
			e.preventDefault(), this.reset(n);
			return;
		}
		let r = e.key === "PageUp" || e.key === "PageDown";
		if (!r && e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
		let i = this.resolveContext(n);
		if (i === null) return;
		let a = r ? ul(BW, i.sizes.reduce((e, t) => e + t, 0)) : BW;
		e.preventDefault(), this.apply(i, e.key === "ArrowRight" || e.key === "PageUp" ? a : -a) && this.remember(i.table);
	}
	stepColumn(e, t) {
		let n = e.target instanceof Element ? this.resolveCaption(e.target) : null, r = n?.closest(`.${mW}`) ?? null;
		if (n === null || r === null || this.reorder.active) return;
		let i = this.movableColumns(r), a = Number(n.getAttribute(er)), o = i.findIndex((e) => e.index === a), s = o + t;
		if (o < 0 || (e.preventDefault(), s < 0 || s >= i.length)) return;
		this.moveColumn(r, a, t < 0 ? i[s].index : i[s + 1]?.index ?? null), n.focus({ preventScroll: !0 });
		let c = this.columnStates.get(r);
		if (c !== void 0) {
			let e = JW(c.places).filter((e) => !c.hidden.has(e));
			$k(e.indexOf(a) + 1, e.length);
		}
	}
	handleDoubleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(yW) : null;
		t !== null && this.reset(t);
	}
	reset(e) {
		let t = e.closest(`.${mW}`);
		t !== null && (this.widths.set(t, null), this.layout(t), this.remember(t));
	}
	apply(e, t) {
		let n = Cl(e.tracks.map((t, n) => n === e.index || n === e.after ? {
			...t,
			min: Math.max(zW, e.floors.get(n) ?? 0)
		} : t), e.sizes, {
			before: [e.index],
			after: [e.after]
		}, t);
		return n !== null && (this.widths.set(e.table, GW(e.tracks, n, [e.index, e.after])), this.layout(e.table), !0);
	}
	putBack(e) {
		this.widths.set(e.table, e.before), this.layout(e.table);
	}
	remember(e) {
		let t = this.widths.get(e) ?? null;
		this.store.write(e, FW, t === null ? null : hl(t), null), this.rememberBoot(e);
	}
	rememberBoot(e) {
		let t = e.style.getPropertyValue(AW).trim(), n = e.getAttribute(rr), r = {};
		t.length > 0 && (r[AW] = t);
		for (let t of e.style) t.startsWith("--ui-table-order-") && (r[t] = e.style.getPropertyValue(t));
		Object.keys(r).length === 0 && n === null ? this.store.writeBoot(e, RW, null) : this.store.writeBoot(e, RW, {
			styles: r,
			attributes: {
				[rr]: n,
				[pr]: e.getAttribute(pr)
			}
		});
	}
	resolveContext(e) {
		let t = e.closest(`.${mW}`);
		if (t === null) return null;
		let n = this.widths.get(t) ?? null, r = n ?? this.authoredTracks(t);
		if (r === null) return null;
		let i = vl(t.getAttribute(Kn)), a = yl(r, i), o = /* @__PURE__ */ new Map(), s = this.columnsOf(t), c = this.placesOf(t, s), l = this.columnSizes(t, c).filter((e) => Number.isFinite(e));
		for (let e of i) e.min !== void 0 && o.set(e.index, e.min);
		let u = Number(e.getAttribute(er)), d = this.hiddenOf(t, s), f = JW(c), p = (c[u] ?? -1) + 1;
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
		let t = e.closest(`.${bW}`), n = t?.closest(`.${mW}`) ?? null;
		return t === null || n === null || !n.classList.contains(hW) || e.closest(yW) !== null || t.classList.contains(xW) || t.hasAttribute("data-ui-table-fixed") ? null : t;
	}
	beginReorder(e, t) {
		let n = e.closest(`.${mW}`), r = Number(e.getAttribute(er));
		if (n === null || !Number.isInteger(r)) return null;
		let i = this.movableColumns(n), a = i.findIndex((e) => e.index === r);
		if (a < 0 || i.length < 2) return null;
		let o = i.map(XW), s = n.querySelector(vW), c = getComputedStyle(n).direction === "rtl";
		return n.setAttribute(mr, ""), e.setAttribute(hr, ""), {
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
		for (let a of JW(this.placesOf(e, t))) {
			let e = r.get(a);
			e !== void 0 && !e.anchored && !n.has(a) && i.push(e);
		}
		return i;
	}
	aimDrop(e, t) {
		let n = e.origin + t + ((e.scroll?.scrollLeft ?? 0) - e.scrolledAt), r = 0;
		for (; r < e.middles.length && (e.rightToLeft ? n < e.middles[r] : n > e.middles[r]);) r++;
		let i = Math.min(Math.max(r > e.from ? r - 1 : r, 0), e.places.length - 1);
		if (i === e.target || (e.target = i, ZW(e.table), i === e.from)) return;
		let a = e.places.filter((t, n) => n !== e.from), o = a[e.target];
		o === void 0 ? a[a.length - 1].cell.setAttribute(gr, "after") : o.cell.setAttribute(gr, "before");
	}
	endReorder(e, t) {
		if (e.removeAttribute(hr), t.table.removeAttribute(mr), ZW(t.table), t.target === t.from) return;
		let n = t.places.filter((e, n) => n !== t.from);
		Zg(), this.moveColumn(t.table, t.index, n[t.target]?.index ?? null);
	}
	moveColumn(e, t, n) {
		let r = this.columnsOf(e), i = new Map(r.map((e) => [e.index, e])), a = JW(this.placesOf(e, r)).filter((e) => i.get(e)?.anchored === !1), o = a.indexOf(t);
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
		this.orders.set(e, u ? null : c), this.store.write(e, LW, u ? null : JSON.stringify(c)), this.layout(e), this.rememberBoot(e);
	}
};
function HW(e, t) {
	let n = 0, r = 0, i = !1;
	for (let e of t.children) if (e.matches(`.${wW}`)) i = !0;
	else if (!(e instanceof HTMLElement) || e.getAttribute("role") !== "row") continue;
	else i ? r += e.offsetHeight : n += e.offsetHeight;
	e.style.setProperty(OW, `${n}px`), e.style.setProperty(kW, `${r}px`);
}
function UW(e) {
	let t = e.matches(`.${bW}`) ? e.querySelector(`:scope > ${yW}`) : null;
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function WW(e) {
	return e.hasAttribute("data-ui-rows-draggable") && e.hasAttribute("data-ui-rows-drag-handle") && e.classList.contains("ui-drag-handle--start");
}
function GW(e, t, n) {
	for (let r of n) e[r].kind === "star" && e[r].min === e[r].value && t[r].kind === "star" && (t[r] = {
		...t[r],
		min: t[r].value
	});
	return t;
}
function KW(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(EW) || t.querySelector(EW) !== null)) return !0;
	return !1;
}
function qW(e) {
	let t = e.type === "childList" ? e.target : e.target.parentElement;
	return t instanceof Element && t.classList.contains(wW);
}
function JW(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) t[e[n]] = n;
	return t;
}
function YW(e, t) {
	if (e.length !== t.length) return !1;
	let n = new Set(t.map((e) => e.key));
	return e.every((e) => n.delete(e)) && n.size === 0;
}
function XW(e) {
	let t = e.cell.getBoundingClientRect();
	return t.left + t.width / 2;
}
function ZW(e) {
	for (let t of e.querySelectorAll(`[${gr}]`)) t.removeAttribute(gr);
}
function QW(e) {
	return e.startsHidden || e.hideBelow !== null && $m.indexOf(rh()) < $m.indexOf(e.hideBelow);
}
function $W(e) {
	return e !== null && $m.includes(e);
}
//#endregion
//#region src/items/items-group-runs.ts
var eG = /* @__PURE__ */ new WeakMap();
function tG(e, t) {
	let n = /* @__PURE__ */ new Set(), r = e.getAttribute(an);
	for (let i of K(e)) {
		let a = i.getAttribute("data-ui-group") ?? "";
		if (a !== "" && a !== r) {
			let r = nG(i, a) ?? rG(e, i, a, t);
			r !== null && n.add(r);
		}
		r = a;
	}
	for (let t of e.querySelectorAll(`:scope > [${It}]`)) n.has(t) || t.remove();
}
function nG(e, t) {
	let n = e.previousElementSibling, r = n === null ? void 0 : eG.get(n);
	return r !== void 0 && r.row === e && r.group === t ? n : null;
}
function rG(e, t, n, r) {
	let i = r(t);
	return i === null ? null : (sG(i, t.getAttribute(b)), eG.set(i, {
		row: t,
		group: n
	}), e.insertBefore(i, t), i);
}
function iG(e, t) {
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
function aG(e) {
	return e.find((e) => !e.classList.contains(Ci));
}
function oG(e, t, n, r, i) {
	let a = t.renderFromTemplate(e, n, i);
	if (a === null) return null;
	let o = document.createElement("div");
	return sG(o, r), o.appendChild(a), o;
}
function sG(e, t) {
	e.setAttribute(It, ""), t === null ? e.removeAttribute(Lt) : e.setAttribute(Lt, t);
}
var cG = "bottom", lG = "pending", uG = "focus";
function dG(e, t, n) {
	let r = fG(e, t);
	n <= 0 ? r?.remove() : (r ??= pG(t), t === "top" ? e.firstElementChild !== r && e.insertBefore(r, e.firstElementChild) : e.lastElementChild !== r && e.appendChild(r), r.style.height = `${n}px`);
}
function fG(e, t) {
	for (let n of e.children) if (n.getAttribute("data-ui-window-spacer") === t) return n;
	return null;
}
function pG(e) {
	let t = document.createElement("div");
	return t.setAttribute(Xt, e), t.style.flexShrink = "0", t;
}
function mG(e, t) {
	let n = fG(e, uG);
	if (t <= 0) return n?.remove(), null;
	let r = n ?? pG(uG);
	return r.style.height = `${t}px`, r;
}
function hG(e, t, n) {
	t === null ? (e.sum += n, e.count++) : e.sum += n - t;
}
//#endregion
//#region src/items/items-dom-order.ts
function gG(e, t) {
	let n = e.firstElementChild;
	n !== null && n.getAttribute("data-ui-window-spacer") === "top" && (n = n.nextElementSibling);
	for (let r of t) r !== n && e.insertBefore(r, n), n = r.nextElementSibling;
}
//#endregion
//#region src/items/items-group-renderer.ts
var _G = /* @__PURE__ */ new WeakMap();
function vG(e) {
	for (let t of e.querySelectorAll(`:scope > [${It}]`)) t.remove();
}
function yG(e, t, n, r, i, a) {
	let o = zk(e, K(e)), s = n.getGroupTemplate(t), c = s !== void 0, l = c && o.some((e) => e.hasAttribute("data-ui-group")), u = Ak(i.getItemsFilterSortMetadata(t), a, wk(e));
	if (c && !l && (vG(e), _G.delete(e)), o.length === 0) return;
	let d = nk(e);
	if (!l) {
		gG(e, [...jk(o, u, r), ...tk(d)]);
		return;
	}
	let { buckets: f, order: p } = iG(o, (e) => e.getAttribute("data-ui-group") ?? ""), m = r.getAncestorStack(e), h = _G.get(e), g = /* @__PURE__ */ new Map(), _ = [];
	for (let t of p) {
		let n = f.get(t);
		u.length > 0 && (n = jk(n, u, r));
		let i = t === "" ? void 0 : aG(n);
		if (i !== void 0) {
			let n = bG(e, h?.get(t), i) ?? oG(s, r, r.getItemValue(i), i.getAttribute("data-ui-key"), m);
			n !== null && (g.set(t, n), _.push(n));
		}
		_.push(...n);
	}
	let v = new Set(g.values());
	for (let t of e.querySelectorAll(`:scope > [${It}]`)) v.has(t) || t.remove();
	_G.set(e, g), gG(e, [..._, ...tk(d)]);
}
function bG(e, t, n) {
	if (t !== void 0 && t.parentElement === e) return sG(t, n.getAttribute(b)), t;
}
//#endregion
//#region src/items/items-host-sync.ts
var xG = "ui-tree-rules", SG = `:scope > .${lr}:not(.${fr})`, CG = null;
function wG(e, t, n) {
	CG === null ? TG(e, t, n) : (CG.hosts.set(e, {
		componentId: t,
		context: n
	}), RO(e) === "virtualized" && CG.drawing.add(e));
}
function TG(e, t, n) {
	if (e.parentElement?.classList.contains("ui-tree") === !0) e.dispatchEvent(new Event(xG, { bubbles: !0 })), rk(e, t, n.templates, n.renderer, e.querySelector(SG) !== null);
	else switch (RO(e)) {
		case "windowed":
			rk(e, t, n.templates, n.renderer), DG(e, t, n);
			return;
		case "virtualized":
			n.virtualization.sync(e);
			return;
		default:
			Dk(e, t, n.metadata, n.renderer, n.state), EG(e), rk(e, t, n.templates, n.renderer), yG(e, t, n.templates, n.renderer, n.metadata, n.state);
			return;
	}
}
function EG(e) {
	let t = Jf(e);
	t !== null && qf(t, K(e).filter((e) => e instanceof HTMLElement));
}
function DG(e, t, n) {
	let r = n.templates.getGroupTemplate(t);
	if (r === void 0) return;
	let i = n.renderer.getAncestorStack(e);
	tG(e, (e) => oG(r, n.renderer, n.renderer.getItemValue(e), e.getAttribute(b), i));
}
function OG(e) {
	if (CG !== null) {
		e();
		return;
	}
	let t = {
		hosts: /* @__PURE__ */ new Map(),
		drawing: /* @__PURE__ */ new Set()
	};
	CG = t;
	try {
		e();
	} finally {
		CG = null;
		for (let [e, n] of t.hosts) kG(e, n);
	}
}
function kG(e, t) {
	try {
		e.isConnected && TG(e, t.componentId, t.context);
	} catch (t) {
		c("bringing an items host in step failed.", {
			host: e,
			error: t
		});
	}
}
function AG(e) {
	if (CG !== null && CG.drawing.size !== 0) for (let t of CG.drawing) {
		let n = CG.hosts.get(t);
		n !== void 0 && e(t) && (CG.drawing.delete(t), CG.hosts.delete(t), kG(t, n));
	}
}
//#endregion
//#region src/rendering/tree-boot-fold.ts
var jG = "fold", MG = ["fold-hidden", "fold-shown"], NG = ".ui-table", PG = `:scope > .${ar} > .${or} > [role='columnheader']`, FG = `:scope > .${sr}`, IG = "input:not([type='hidden']), button, select, textarea, a[href]", LG = /* @__PURE__ */ new WeakMap();
function RG(e) {
	for (let t of e.querySelectorAll(PG)) {
		let e = zG(t);
		e !== null && e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
	}
}
function zG(e) {
	let t = e.querySelector(IG);
	if (t !== null) return t;
	if (e.hasAttribute("tabindex")) return e;
	let n = e.querySelector(FG);
	return n !== null && n.getClientRects().length > 0 ? e : null;
}
function BG(e, t = null) {
	let n = VG(e), r = LG.get(e), i = n.find((e) => t !== null && UG(e) === t) ?? (r !== void 0 && n.includes(r) ? r : n[0]);
	return i !== void 0 && (HG(e, i), !0);
}
function VG(e) {
	let t = Zd(e), n = [];
	for (let r of e.querySelectorAll(PG)) {
		let e = zG(r), i = Number(r.getAttribute("data-ui-table-column") ?? NaN);
		e !== null && Number.isInteger(i) && I(e) && n.push({
			stop: e,
			place: t.place(i)
		});
	}
	return n.sort((e, t) => e.place - t.place).map((e) => e.stop);
}
function HG(e, t) {
	t.hasAttribute("tabindex") || t.setAttribute("tabindex", "-1"), LG.set(e, t), t.focus();
}
function UG(e) {
	return e.closest("[role='columnheader']")?.getAttribute("data-ui-table-column") ?? null;
}
function WG(e) {
	let t = e.closest("[role='columnheader']"), n = t?.parentElement?.parentElement?.parentElement ?? null;
	return t !== null && n instanceof HTMLElement && n.matches(NG) && zG(t) === e ? n : null;
}
function GG(e, t, n) {
	if (!P(e) || !(e.target instanceof HTMLElement)) return !1;
	switch (e.key) {
		case "ArrowDown": return n(UG(e.target)), !0;
		case "ArrowUp": return !0;
	}
	if (!$u(e.key, "horizontal")) return !1;
	let r = Qu({
		key: e.key,
		items: VG(t),
		current: e.target,
		axis: "horizontal",
		loop: !1
	});
	return r !== null && r !== e.target && HG(t, r), !0;
}
//#endregion
//#region src/interactions/items-selection-engine.ts
var KG = /* @__PURE__ */ new Set([
	" ",
	"Enter",
	"Delete"
]), qG = ".ui-table", JG = /* @__PURE__ */ new Set([
	"ArrowLeft",
	"ArrowRight",
	"ArrowUp",
	"ArrowDown",
	"Home",
	"End",
	"Enter",
	"F2",
	" "
]), YG = `:scope > [${x}], :scope > .${ar}, :scope > .${ar} > [${x}]`, XG = class {
	root;
	rows;
	pressedBoxes = [];
	windowEnds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.rows = e.rows, this.applyAll(this.root.querySelectorAll(L)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("mouseup", () => this.restoreBoxes(), !0), this.root.addEventListener("pointercancel", () => this.restoreBoxes(), !0), this.root.addEventListener("contextmenu", () => this.restoreBoxes(), !0), H(this.root, L, { childList: !0 }, (e) => this.applyAll(e)), H(this.root, L, { attributeFilter: [
			oi,
			ci,
			li,
			Zt
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
		let t = Yd(e);
		Fd(e, t);
		for (let t of e.querySelectorAll(YG)) QG(t);
		if (e.matches(".ui-items-view, .ui-table")) {
			e.matches(qG) && RG(e);
			for (let n of t) {
				let t = qu(n);
				t !== null && QG(t);
				for (let e of Ju(n)) QG(e);
				ZG(e, n, n.hasAttribute(Ne));
			}
			this.settleWindowEnd(e, t);
		}
	}
	settleWindowEnd(e, t) {
		let n = this.windowEnds.get(e), r = n === void 0 ? null : Wd(e);
		if (n === void 0 || r === null || r.hasAttribute("data-ui-window-pending")) return;
		let i = BO(r, tn) !== null, a = n === "first" ? zO(r) === 0 && !VO(r, "data-ui-window-more-before") : !VO(r, rn);
		if (i && !a) return;
		this.windowEnds.delete(e);
		let o = Rf(n === "first" ? "Home" : "End", t, null, oK(e));
		o !== null && (_f(e, t, o), e.getAttribute("data-ui-selection") === "one" && Ld(e, t, o, Dd));
	}
	remark(e) {
		let t = Yd(e);
		Fd(e, t), this.settleWindowEnd(e, t);
	}
	handleClick(e) {
		let t = this.resolveRow(e, L);
		if (t === null || !(e instanceof MouseEvent)) return;
		let { root: n, item: r } = t, i = Yd(n);
		_f(n, i, r, e.target instanceof Element ? Nf(r, e.target) : null), B(n), n.hasAttribute("data-ui-no-row-select") ? Ad(n, r) : Ld(n, i, r, jd(e), this.heldRange(n)) && e.preventDefault();
	}
	resolveRow(e, t) {
		if (!(e.target instanceof Element)) return null;
		let n = e.target.closest(Td), r = n?.closest(L) ?? null;
		return n === null || r === null || n.closest(L) !== r || !r.matches(t) || A(r) ? null : Zu(e.target, n) === null && !j(n) ? {
			root: r,
			item: n
		} : null;
	}
	heldRange(e) {
		let t = this.rows, n = Wd(e);
		return t === void 0 || n === null ? void 0 : (e, r) => t.rangeKeysOf(n, e, r);
	}
	handleDoubleClick(e) {
		let t = this.resolveRow(e, Ed);
		t === null || e.target instanceof Element && t.item.contains(e.target.closest("[data-ui-no-row-open]")) || (e.preventDefault(), Uf(t.item, "open"));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.altKey || !(e.target instanceof Element) || zu(e)) return;
		let t = WG(e.target);
		if (t !== null && !A(t)) {
			GG(e, t, (e) => this.enterRows(t, e)) && e.preventDefault();
			return;
		}
		let n = cf(e);
		if (n === null) return;
		let { root: r } = n;
		if (!r.matches(".ui-items-view, .ui-table") || A(r) || yf(r) && $G(e) && this.handleCellKey(r, e)) return;
		let i = oK(r);
		if (!KG.has(e.key) && !If(e.key, i)) return;
		if (this.windowEnds.delete(r), this.reachWindowEnd(r, e)) {
			e.preventDefault();
			return;
		}
		this.bringRowsIn(r, e.key);
		let a = Yd(r), o = ff(a), s = Rf(e.key, a, pf(a), i);
		if (s !== null) {
			e.preventDefault(), _f(r, a, s, e.key === "ArrowUp" && !e.shiftKey && yf(r) ? Mf(s) : null), tK(r, a, o, s, Md(r, e), this.heldRange(r));
			return;
		}
		if (e.key === "ArrowUp" && P(e, { alt: !0 }) && r.matches(qG) && BG(r, Df(r))) {
			e.preventDefault();
			return;
		}
		if (o === null || j(o)) return;
		let c = qu(o);
		switch (e.key) {
			case " ":
				nK(r, a, o, c);
				break;
			case "Enter":
				iK(r, a, o, c);
				break;
			case "Delete":
				if (!rK(r, a, o)) return;
				break;
			default: return;
		}
		e.preventDefault();
	}
	handleCellKey(e, t) {
		this.bringCursorRowIn(e);
		let n = Yd(e), r = pf(n);
		if (r === null || j(r)) return !1;
		let i = Ef(r), a = P(t, { alt: !0 });
		switch (t.key) {
			case "ArrowLeft":
			case "ArrowRight":
			case "Home":
			case "End": {
				if (!a) return !1;
				let o = Of(e, r, i, t.key);
				return o !== null && _f(e, n, r, o), t.preventDefault(), !0;
			}
			case "ArrowDown":
			case "ArrowUp": {
				let o = a ? kf(e, r, i, t.key === "ArrowDown") : null;
				return o !== null && (t.preventDefault(), _f(e, n, r, o), !0);
			}
			default: return i !== null && eK(i, t);
		}
	}
	reachWindowEnd(e, t) {
		let n = t.key === "Home" || t.key === "End" ? Wd(e) : null;
		if (n === null || RO(n) !== "windowed" || n.hasAttribute("data-ui-window-paged")) return !1;
		let r = t.key === "Home";
		return !(r ? zO(n) === 0 && !VO(n, "data-ui-window-more-before") : !VO(n, "data-ui-window-more-after")) && (this.windowEnds.set(e, r ? "first" : "last"), sd(n, r ? 0 : od(n).contentHeight), !0);
	}
	bringRowsIn(e, t) {
		let n = this.rows, r = n === void 0 ? null : Wd(e);
		if (n === void 0 || r === null) return;
		let i = Qf(e);
		switch (t) {
			case "Home":
			case "End": {
				let e = n.shownKeysOf(r);
				e !== null && e.length > 0 && n.reveal(r, t === "Home" ? e[0] : e[e.length - 1], "nearest");
				return;
			}
			case "PageDown":
			case "PageUp": {
				let a = i === null ? pf(Yd(e)) : null, o = i ?? (a === null ? null : z(a));
				o !== null && n.reveal(r, o, t === "PageDown" ? "start" : "end");
				return;
			}
			default: this.bringCursorRowIn(e);
		}
	}
	bringCursorRowIn(e) {
		let t = this.rows === void 0 ? null : Wd(e), n = Qf(e);
		t !== null && n !== null && this.rows?.reveal(t, n, "nearest");
	}
	enterRows(e, t) {
		let n = Yd(e), r = pf(n) ?? Rf("ArrowDown", n, null, "vertical");
		e.focus({ preventScroll: !0 }), r !== null && (_f(e, n, r, xf(r, t)), e.getAttribute("data-ui-selection") === "one" && Ld(e, n, r, Dd));
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement && e.target.matches("[data-ui-items-host], .ui-table__scroll") ? e.target : null, n = t?.closest(L) ?? null;
		if (t !== null && n !== null && [...n.querySelectorAll(YG)].includes(t)) {
			B(n);
			return;
		}
		if (e.target instanceof HTMLElement && e.target.matches(L) && e.target.matches(".ui-items-view, .ui-table") && !A(e.target) && !vp()) {
			hf(e.target, Yd(e.target));
			return;
		}
		let r = e.target instanceof Element ? e.target.closest(Td) : null, i = r?.closest(L) ?? null;
		r !== null && i !== null && !r.hasAttribute("data-ui-row-focus") && i.matches(".ui-items-view, .ui-table") && Zu(e.target, r) !== null && _f(i, Yd(i), r, e.target instanceof Element ? Nf(r, e.target) : null, !1);
	}
	handlePointerDown(e) {
		this.restoreBoxes();
		let t = e.target instanceof Element ? e.target : null, n = t?.closest(L) ?? null;
		if (t !== null && n !== null) {
			document.activeElement !== n && bp(n, !0);
			for (let e of n.querySelectorAll(YG)) e.contains(t) && e.getAttribute("tabindex") === "-1" && (e.removeAttribute("tabindex"), this.pressedBoxes.push(e));
		}
	}
	restoreBoxes() {
		for (let e of this.pressedBoxes) QG(e);
		this.pressedBoxes = [];
	}
	followCursor(e) {
		for (let t of e) {
			let e = t.target;
			if (!(e instanceof HTMLElement) || !e.matches(Td)) continue;
			let n = e.closest(L);
			n !== null && n.matches(".ui-items-view, .ui-table") && ZG(n, e, e.hasAttribute(Ne));
		}
	}
};
function ZG(e, t, n) {
	if (n) for (let n of t.querySelectorAll(`[${Fe}]`)) n.parentElement?.closest(L) === e && RH(n);
	else for (let n of t.querySelectorAll(tp)) n.tabIndex >= 0 && n.parentElement?.closest(L) === e && Xu(t, n) && LH(n);
}
function QG(e) {
	e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
}
function $G(e) {
	return JG.has(e.key) || PT(e) !== null;
}
function eK(e, t) {
	let n = t.key, r = PT(t) !== null, i = P(t, { shift: !0 });
	if (!r && (!i || n !== "Enter" && n !== "F2" && n !== " ")) return !1;
	if (n !== " " && Ff(e, t)) return !0;
	let a = qu(e);
	if (a !== null && (n === "Enter" || n === " ")) return t.preventDefault(), a.click(), !0;
	if (n !== "F2" && (n !== "Enter" || !jf(e))) return !1;
	let o = Ep(e);
	return o !== null && (t.preventDefault(), o.focus(), !0);
}
function tK(e, t, n, r, i, a) {
	(e.getAttribute("data-ui-selection") === "one" || i.shift) && (i.shift && kd(e, n), Ld(e, t, r, i, a));
}
function nK(e, t, n, r) {
	Ld(e, t, n, {
		shift: !1,
		ctrl: !0
	}) || aK(n, r);
}
function rK(e, t, n) {
	if (!e.hasAttribute("data-ui-rows-remove")) return !1;
	let r = sK(t, n);
	for (let e of r) Uf(e, "remove");
	return r.length > 0;
}
function iK(e, t, n, r) {
	Nd(e) && !Id(t).includes(n) && Ld(e, t, n, Dd), aK(n, r), r === null && Uf(n, "open");
}
function aK(e, t) {
	t === null ? Uf(e, Hf) : t.click();
}
function oK(e) {
	return e.matches(".ui-items-view--wrap") ? "grid" : e.matches(".ui-orientation--horizontal") ? "both" : "vertical";
}
function sK(e, t) {
	let n = Id(e);
	return (n.includes(t) ? n.filter((e) => e === t || R(e) !== null) : [t]).filter((e) => !al(e, "data-ui-unremovable") && !j(e));
}
//#endregion
//#region src/interactions/tree-engine.ts
var cK = "ui-tree__row--folded", lK = "ui-tree__row--dragging", uK = "ui-tree__loading", dK = "ui-tree__loading-ring", fK = "ui-tree-node__text", pK = "ui-tree-node__toggle", mK = "ui-tree-node__rename", hK = ".ui-text__title", gK = dr, _K = "--ui-tree-depth", vK = "expanded", yK = 200, bK = 600, xK = .25, SK = {
	ArrowUp: "up",
	ArrowDown: "down",
	ArrowLeft: "out",
	ArrowRight: "in"
}, CK = /* @__PURE__ */ new Set([
	" ",
	"ArrowRight",
	"ArrowLeft",
	"Enter",
	"F2",
	"Delete"
]), wK = "ui-tree-unfold-settled", TK = {
	name: "unfold",
	registration: { completed: (e) => {
		e.domEvent.target?.dispatchEvent(new Event(wK, { bubbles: !0 }));
	} }
}, EK = class {
	root;
	store = new QP();
	rules;
	folds = /* @__PURE__ */ new WeakMap();
	requested = /* @__PURE__ */ new WeakSet();
	inFlight = /* @__PURE__ */ new WeakSet();
	writtenBoot = /* @__PURE__ */ new WeakMap();
	springTarget = null;
	springTimer = 0;
	dropPlace = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.rules = e.rules, this.root.addEventListener(xG, (e) => {
			let t = e.target instanceof Element ? e.target.closest(`.${cr}`) : null;
			t !== null && (this.layout(t), qf(t, this.rowsOf(t)));
		}, !0), this.root.addEventListener(wK, (e) => this.handleUnfoldSettled(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), e.effects?.register("RenameNode", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename node effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(E(n.id), n.dynamicParameters ?? []), i = r === null ? null : this.rowsOf(r).find((e) => z(e) === t.key) ?? null;
			i === null ? s("rename node effect names no node on the page.", t) : this.startRename(i);
		}), this.layoutAll(this.root.querySelectorAll(`.${cr}`)), H(this.root, `.${cr}`, {
			childList: !0,
			attributeFilter: [
				br,
				xr,
				Cr,
				Or
			],
			relevant: jK
		}, (e) => this.layoutAll(e));
	}
	layoutAll(e) {
		for (let t of e) this.layout(t);
	}
	layout(e) {
		let t = this.foldOf(e), n = this.resolveRules(e), r = n === null ? this.rowsOf(e) : this.orderRows(e, n), i = e.hasAttribute("data-ui-tree-draggable") || e.hasAttribute("data-ui-drag-kind"), a = /* @__PURE__ */ new Set();
		for (let e of r) {
			let t = PA(e)?.getAttribute(br);
			t != null && t.length > 0 && a.add(t);
		}
		let o = n?.filtering === !0 ? this.matchingRows(r, n) : null, s = /* @__PURE__ */ new Map();
		for (let e of r) {
			let n = z(e), r = PA(e), c = r?.getAttribute("data-ui-tree-parent") ?? "", l = c.length > 0 ? s.get(c) : void 0, u = l === void 0 ? 0 : l.depth + 1, d = l === void 0 || l.shown && l.expanded, f = r?.hasAttribute(xr) === !0, p = f || a.has(n), m = p && r?.hasAttribute("data-ui-tree-expanded") === !0, h = l === void 0 || l.authoredShown && this.authoredExpandedOf(l), g = p && (o === null ? t.get(n) ?? m : o.has(n)), _ = o !== null && !o.has(n);
			e.style.setProperty(_K, String(u)), e.setAttribute("aria-level", String(u + 1)), gf(e, r?.querySelector(`:scope > .${fK}`) ?? null), e.classList.toggle(cK, !d), e.classList.toggle(fr, _), e.removeAttribute(Dr), e.draggable = i && qO(e), p ? e.setAttribute("aria-expanded", g ? "true" : "false") : e.removeAttribute("aria-expanded"), (a.has(n) || !f) && (e.removeAttribute(Tr), this.inFlight.delete(e)), g && d && f && !a.has(n) && !this.requested.has(e) && (this.requested.add(e), this.inFlight.add(e), e.setAttribute(Tr, ""), e.dispatchEvent(new Event("unfold", { bubbles: !0 }))), !g && !this.inFlight.has(e) && this.requested.delete(e), this.placeLoadingRow(e, u + 1, e.hasAttribute(Tr), d && g && !_), s.set(n, {
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
		return PA(e.row)?.hasAttribute(Cr) === !0;
	}
	writeBootFold(e, t, n) {
		if (t.size === 0) return;
		let r = [], i = [];
		for (let [e, a] of t) {
			let t = n.get(e);
			(t === void 0 || this.authoredExpandedOf(t) !== a) && (a ? r : i).push(e);
		}
		let a = JSON.stringify([r, i]), o = this.writtenBoot.get(e);
		if (o !== a && (this.writtenBoot.set(e, a), this.store.writeBoot(e, jG, r.length + i.length === 0 ? null : { fold: {
			version: 1,
			open: r,
			closed: i
		} }), o === void 0)) for (let t of MG) this.store.writeBoot(e, t, null);
	}
	resolveRules(e) {
		let t = this.hostOf(e), n = Ha(e);
		if (this.rules === void 0 || t === null || n === null) return null;
		let r = this.rules.metadata.getItemsFilterSortMetadata(n), i = wk(t);
		if (r === void 0 && i === null) return null;
		let a = Ak(r, this.rules.state, i), o = kk(r, this.rules.state, i);
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
			let t = PA(e)?.getAttribute("data-ui-tree-parent") ?? "", n = i.has(t) ? t : "", r = a.get(n);
			r === void 0 ? a.set(n, [e]) : r.push(e);
		}
		let o = [], s = (e) => {
			let n = a.get(e);
			if (n !== void 0) {
				n.sort((e, n) => Mk(r.getItemValue(e), r.getItemValue(n), t.sorts));
				for (let e of n) o.push(e), s(z(e));
			}
		};
		if (s(""), o.length !== n.length || o.every((e, t) => e === n[t])) return o.length === n.length ? o : n;
		let c = this.hostOf(e);
		if (c === null) return n;
		for (let e of c.querySelectorAll(`:scope > .${uK}`)) e.remove();
		for (let e of o) c.appendChild(e);
		return o;
	}
	matchingRows(e, t) {
		let n = /* @__PURE__ */ new Set();
		if (this.rules === void 0) return n;
		let r = this.rules.state, i = this.rules.renderer;
		for (let a = e.length - 1; a >= 0; a--) {
			let o = e[a], s = z(o), c = i.getItemValue(o);
			if (c === void 0 || Ok(t.config, c, r, t.query) || n.has(s)) {
				n.add(s);
				let e = PA(o)?.getAttribute("data-ui-tree-parent") ?? "";
				e.length > 0 && n.add(e);
			}
		}
		return n;
	}
	placeLoadingRow(e, t, n, r) {
		let i = e.nextElementSibling, a = i instanceof HTMLElement && i.classList.contains(uK) ? i : null;
		if (!n) {
			a?.remove();
			return;
		}
		let o = a ?? MK();
		o.style.setProperty(_K, String(t)), o.classList.toggle(cK, !r), a === null && e.after(o);
	}
	handleUnfoldSettled(e) {
		e.target instanceof Element && this.inFlight.delete(e.target);
	}
	handleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null) return;
		let { tree: n, row: r, target: i } = t;
		(i.closest(`.${pK}`) !== null || al(r, "data-ui-unselectable") && Zu(i, r) === null) && (e.preventDefault(), this.setFocus(n, r, null), this.toggle(n, r));
	}
	handleDoubleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null || Zu(t.target, t.row) !== null) return;
		let { tree: n, row: r } = t;
		e.preventDefault(), n.hasAttribute("data-ui-tree-rename-dblclick") && this.canRename(n, r) ? this.startRename(r) : Uf(r, "open");
	}
	rowOfEvent(e) {
		if (!(e.target instanceof Element)) return null;
		let t = e.target.closest(`.${lr}`), n = t?.closest(".ui-tree") ?? null;
		return t === null || n === null || t.closest(".ui-tree") !== n || j(t) ? null : {
			tree: n,
			row: t,
			target: e.target
		};
	}
	handleFocusIn(e) {
		let t = e.target;
		t instanceof HTMLElement && t.classList.contains("ui-tree") && !A(t) && !vp() && hf(t, this.rowsOf(t));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || N(e) || !(e.target instanceof Element)) return;
		let t = cf(e);
		if (t === null) return;
		let n = t.root;
		if (!n.classList.contains("ui-tree") || A(n)) return;
		let r = e.altKey && P(e, { alt: !0 }) ? SK[e.key] : void 0;
		if (r !== void 0 && n.hasAttribute("data-ui-tree-draggable")) {
			e.preventDefault(), this.moveByKey(n, r);
			return;
		}
		if (e.altKey || !CK.has(e.key) && !If(e.key, "vertical")) return;
		let i = this.rowsOf(n), a = ff(i), o = Rf(e.key, i, pf(i), "vertical");
		if (o !== null) e.preventDefault(), this.setFocus(n, o, Md(n, e));
		else if (!(a === null || j(a))) {
			switch (e.key) {
				case " ":
					nK(n, i, a, null);
					break;
				case "ArrowRight":
					a.getAttribute("aria-expanded") === "false" ? this.toggle(n, a) : a.getAttribute("aria-expanded") === "true" && this.setFocus(n, Rf("ArrowDown", i, a, "vertical"), Dd);
					break;
				case "ArrowLeft":
					a.getAttribute("aria-expanded") === "true" ? this.toggle(n, a) : this.setFocus(n, this.parentOf(n, a), Dd);
					break;
				case "Enter":
					iK(n, i, a, null);
					break;
				case "F2":
					if (!this.canRename(n, a)) return;
					this.startRename(a);
					break;
				case "Delete":
					if (n.hasAttribute("data-ui-tree-unremovable") || !rK(n, i, a)) return;
					break;
				default: return;
			}
			e.preventDefault();
		}
	}
	moveByKey(e, t) {
		let n = this.rowsOf(e), r = ff(n);
		if (r === null || !r.draggable || (t === "up" || t === "down") && this.isSorted(e)) return;
		let i = PK(n), a = z(r), o = BA(i, a, t);
		if (o === null) return;
		let [s] = this.moveRows(e, [r], o, t === "in" ? n.find((e) => z(e) === o.parent) ?? null : null), c = i.filter((e) => e.parent === o.parent && e.key !== a).length + 1;
		$k(s + 1, c);
	}
	isSorted(e) {
		return (this.resolveRules(e)?.sorts.length ?? 0) > 0;
	}
	canRename(e, t) {
		return e.hasAttribute("data-ui-tree-renamable") && !al(t, "data-ui-unrenamable");
	}
	handleDragStart(e) {
		let t = NK(e), n = t?.closest(".ui-tree") ?? null, r = n?.hasAttribute(Or) === !0, i = n === null ? null : this.hostOf(n);
		if (t === null || n === null || i === null || !r && !n.hasAttribute("data-ui-drag-kind")) return;
		if (j(t)) {
			e.preventDefault();
			return;
		}
		let a = KO(t, this.rowsOf(n)), o = GO(n, i, a);
		r ? Ov(e, n, t, lK, z(t), a.filter((e) => e !== t), YO(o, !0)) : Av(e, z(t), YO(o, !1)), XO(e, o);
	}
	draggingRows(e) {
		return this.rowsOf(e).filter((e) => e.classList.contains(lK));
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${cr}`), n = t === null ? [] : this.draggingRows(t), r = t === null ? null : this.hostOf(t);
		if (t === null || n.length === 0 || r === null) return;
		let i = e.target.closest(`.${lr}`), a = i !== null && i.closest(".ui-tree") === t ? i : null, o = a === null ? {
			mark: "",
			place: {
				parent: "",
				before: null
			}
		} : this.dropAt(t, a, n, e.clientY);
		o === null ? (this.markDrop(t, null), this.springOpen(t, null)) : (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), this.markDrop(t, a ?? r, o.mark, o.depth), this.dropPlace = o.place, this.springOpen(t, a !== null && o.mark === "" ? a : null));
	}
	dropAt(e, t, n, r) {
		let i = this.parentKeysOf(e), a = z(t), o = (e) => n.some((t) => z(t) === e || AK(i, e, z(t))), s = FA(t, PA(t)), c = t.getBoundingClientRect(), l = c.height > 0 ? (r - c.top) / c.height : .5, u = s ? xK : .5, d = this.isSorted(e) ? null : l < u ? "before" : l >= 1 - u ? "after" : null;
		if (d === null) return s && !o(a) ? {
			mark: "",
			place: {
				parent: a,
				before: null
			}
		} : null;
		if (n.includes(t)) return null;
		let f = this.rowsOf(e), p = PK(f), m = Number(t.style.getPropertyValue(_K)) || 0, h = new Set(n.map(z)), g = d === "after" && t.getAttribute("aria-expanded") === "true" ? p.find((e) => e.parent === a && e.shown !== !1 && !h.has(e.key)) : void 0, _ = i.get(a) ?? "", v = g === void 0 ? {
			parent: _,
			before: d === "before" ? a : WA(p, _, a, !1, h)
		} : {
			parent: a,
			before: g.key
		};
		return !IA(v.parent, (e) => f.find((t) => z(t) === e) ?? null) || o(v.parent) ? null : {
			mark: d,
			place: v,
			depth: g === void 0 ? m : m + 1
		};
	}
	springOpen(e, t) {
		let n = t !== null && t.getAttribute("aria-expanded") === "false" ? t : null;
		n !== this.springTarget && (window.clearTimeout(this.springTimer), this.springTarget = n, n !== null && (this.springTimer = window.setTimeout(() => this.expand(e, n), bK)));
	}
	handleDragLeave(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${cr}`);
		t !== null && jv(e, t) && (this.markDrop(t, null), this.springOpen(t, null));
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${cr}`), n = t === null ? [] : this.draggingRows(t), r = t?.querySelector(`[${gK}]`) ?? null, i = this.dropPlace;
		if (t === null || n.length === 0 || r === null || i === null) return;
		e.preventDefault();
		let a = this.parentKeysOf(t), o = n.filter((e) => !n.some((t) => t !== e && AK(a, z(e), z(t)))), s = r.getAttribute(gK) === "" && r.classList.contains("ui-tree__row") ? r : null;
		this.markDrop(t, null), this.springOpen(t, null), kv(t, lK), this.moveRows(t, o, i, s);
	}
	moveRows(e, t, n, r) {
		let i = GA(PK(this.rowsOf(e)), t.map(z), n);
		return r !== null && this.expand(e, r), t.forEach((e, t) => {
			let r = PA(e)?.querySelector(`.${fK}`) ?? null;
			r !== null && (r.setAttribute(Er, n.parent), r.dispatchEvent(new Event("change", { bubbles: !0 })), dA(e, i[t]));
		}), i;
	}
	handleDragEnd(e) {
		let t = NK(e)?.closest(".ui-tree") ?? null;
		t !== null && (kv(t, lK), this.markDrop(t, null), this.springOpen(t, null));
	}
	markDrop(e, t, n = "", r) {
		RA(e, t, n, r), t === null && (this.dropPlace = null);
	}
	parentKeysOf(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of this.rowsOf(e)) t.set(z(n), PA(n)?.getAttribute("data-ui-tree-parent") ?? "");
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
		let i = this.foldOf(e), a = this.rowsOf(e);
		i.delete(r), i.set(r, n), DK(i, a);
		let o = n ? a.filter((e) => e.classList.contains(cK)) : [];
		this.store.writeJson(e, vK, [...i]), this.layout(e), kK(o.filter((e) => !e.classList.contains(cK)));
	}
	foldOf(e) {
		let t = this.folds.get(e);
		return t === void 0 && (t = OK(this.store.readJson(e, vK)), this.folds.set(e, t)), t;
	}
	setFocus(e, t, n) {
		if (t === null) return;
		let r = this.rowsOf(e), i = ff(r);
		_f(e, r, t), n !== null && tK(e, r, i, t, n);
	}
	parentOf(e, t) {
		let n = PA(t)?.getAttribute("data-ui-tree-parent") ?? "";
		return n.length === 0 ? null : this.rowsOf(e).find((e) => z(e) === n) ?? null;
	}
	startRename(e) {
		let t = e.closest(`.${cr}`), n = PA(e), r = n?.querySelector(hK) ?? null;
		t === null || n === null || r === null || al(e, "data-ui-unrenamable") || (this.setFocus(t, e, null), vu({
			container: n,
			title: r,
			className: mK,
			value: n.getAttribute("data-ui-tree-title") ?? r.textContent?.trim() ?? "",
			commit: (t) => {
				n.setAttribute(wr, t), n.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
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
function DK(e, t) {
	if (e.size <= yK) return;
	let n = new Set(t.map(z)), r = 0;
	for (let t of e.keys()) n.has(t) || r++;
	for (let t of [...e.keys()]) {
		if (r <= yK) return;
		n.has(t) || (e.delete(t), r--);
	}
}
function OK(e) {
	let t = Array.isArray(e) ? e : typeof e == "object" && e ? Object.entries(e) : [], n = /* @__PURE__ */ new Map();
	for (let e of t) Array.isArray(e) && typeof e[0] == "string" && typeof e[1] == "boolean" && n.set(e[0], e[1]);
	return n;
}
function kK(e) {
	if (!(e.length === 0 || Xm())) for (let t of e) t.animate([{
		opacity: 0,
		offset: 0
	}], {
		duration: V.fast,
		easing: V.enter
	});
}
function AK(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let i = e.get(t) ?? ""; i.length > 0 && !r.has(i); i = e.get(i) ?? "") {
		if (i === n) return !0;
		r.add(i);
	}
	return !1;
}
function jK(e) {
	if (e.type !== "childList") return !0;
	let t = e.target;
	return t instanceof HTMLElement && (t.classList.contains("ui-tree__row") || t.hasAttribute("data-ui-items-host") && t.parentElement?.classList.contains("ui-tree") === !0);
}
function MK() {
	let e = document.createElement("div"), t = document.createElement("span");
	return e.className = uK, e.setAttribute($O, ""), e.setAttribute("aria-hidden", "true"), t.className = dK, e.append(t, k.text("ui.tree.loading")), e;
}
function NK(e) {
	return e.target instanceof Element ? e.target.closest(`.${lr}`) : null;
}
function PK(e) {
	return e.map((e) => ({
		key: z(e),
		parent: PA(e)?.getAttribute("data-ui-tree-parent") ?? "",
		takesDrop: FA(e, PA(e)),
		shown: !e.classList.contains(fr)
	}));
}
//#endregion
//#region src/runtime/client-state.ts
var FK = {
	visibilityState: () => document.visibilityState,
	notificationPermission: LK
};
function IK(e) {
	return e !== "hidden";
}
function LK() {
	return typeof Notification > "u" || !window.isSecureContext ? void 0 : Notification.permission;
}
var RK = 200;
function zK(e = FK) {
	return {
		visible: IK(e.visibilityState()),
		notificationPermission: e.notificationPermission() ?? "unsupported"
	};
}
var BK = class {
	report;
	source;
	settleMilliseconds;
	held = null;
	timer;
	constructor(e) {
		this.report = e.report, this.source = e.source ?? FK, this.settleMilliseconds = e.settleMilliseconds ?? RK;
	}
	forAttach() {
		return clearTimeout(this.timer), this.held = zK(this.source), this.held;
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
		let t = zK(this.source);
		(t.visible !== e.visible || t.notificationPermission !== e.notificationPermission) && (this.held = t, this.report(t).catch(() => void 0));
	}
};
//#endregion
//#region src/interactions/system-notifications.ts
function VK(e) {
	return {
		permission: LK,
		registration: e ?? (() => Promise.resolve(void 0)),
		create: (e, t) => new Notification(e, t),
		focus: () => window.focus()
	};
}
async function HK(e, t, n = VK()) {
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
function UK(e, t, n, r = window.location) {
	e.bringTo !== void 0 && WK(e.bringTo, r) ? t(e.bringTo) : e.action !== void 0 && n(e.action);
}
function WK(e, t = window.location) {
	let n = new URL(e, t.origin);
	return n.pathname !== t.pathname || n.search !== t.search || n.hash !== "" && n.hash !== t.hash;
}
//#endregion
//#region src/interactions/tab-order.ts
function GK(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) e[n].pinned && (t = n + 1);
	return t;
}
//#endregion
//#region src/interactions/tabs-view-engine.ts
var Y = "ui-tabs-view", KK = "ui-tab-item__label", qK = "ui-tab-item__close", JK = "ui-tab-item__rename", YK = "ui-tab-item__caption", XK = "ui-tab-item__pin", ZK = ".ui-text__title", QK = "ui-tab-item--dragging", $K = "ui-tab-item__caption--overflowed", eq = "ui-tabs-view--overflowing", tq = "ui-tabs-view--no-overflow", nq = "ui-tab-item__page", rq = "ui-tab-item--selected", iq = `.${C}`, aq = "tab-menu-entry", oq = {
	name: aq,
	registration: { dynamicParameters: (e) => KF(e.domEvent.detail?.entry, e.dynamicParameters) }
}, sq = "tab-pin";
function cq(e) {
	return {
		name: sq,
		registration: LO((e) => rA(e.target), e)
	};
}
var lq = "--ui-tabs-view-strip", uq = class {
	root;
	fitter;
	dragStart = null;
	menuTab = null;
	closed = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new gH({
			rootClass: Y,
			overflowingClass: eq,
			wraps: (e) => e.classList.contains(tq),
			hiddenClass: $K,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(), e.effects?.register("RenameTab", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename tab effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(E(n.id), n.dynamicParameters ?? []), i = (r === null ? void 0 : this.ownItems(r).find((e) => xq(e) === t.key))?.querySelector(`.${KK}`) ?? null;
			i === null ? s("rename tab effect names no tab on the page.", t) : this.startRename(i);
		}), this.root.addEventListener(ZF, (e) => this.prepareMenu(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), fW(this.root, ["press"], (e) => {
			let t = e.closest(`.${qK}`)?.closest(`.${YK}`) ?? null;
			return t === null ? [] : [t];
		}), H(this.root, `.${Y}`, {
			childList: !0,
			attributeFilter: [
				di,
				be,
				ce,
				..._i
			],
			relevant: (e) => !_g(e, `.${nq}`, `.${Y}`)
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${Y}`)) this.apply(e);
	}
	apply(e) {
		let t = this.ownItems(e);
		fq(e, t);
		let n = t.filter(TI), r = e.getAttribute("data-ui-tabs-selected") ?? "", i = Cd(n, r, xq);
		if (i === null) return;
		if (i !== r) {
			this.select(e, i);
			return;
		}
		let a = e.hasAttribute(be), o = t.find((e) => e.classList.contains(rq))?.querySelector(`.${YK}`) ?? null, s = [], c = null, l = null;
		for (let e of t) {
			let t = xq(e) === r;
			e.classList.toggle(rq, t);
			let i = e.querySelector(`.${YK}`);
			i !== null && (i.draggable = a, wH(i), n.includes(e) && (s.push(i), t && (c = i))), e.querySelector(`.${KK}`)?.setAttribute("aria-selected", t ? "true" : "false");
			for (let n of e.querySelectorAll(`.${nq}`)) n.hidden = !t;
			t && (l = e.querySelector(`.${nq}`));
		}
		this.fitCaptions(e, s, c), this.writeStripHeight(e, l), TH(o, c), o !== null && o !== c && EH(l);
		let u = [], d = null;
		for (let e of s) {
			let t = e.querySelector(`.${KK}`);
			t === null || e.classList.contains($K) || (u.push(t), e === c && (d = t));
		}
		F(u, d), this.focusAfterClose(e, d);
	}
	focusAfterClose(e, t) {
		let n = this.closed;
		n === null || n.root !== e || n.item.isConnected || (this.closed = null, t !== null && (document.activeElement === null || document.activeElement === document.body) && B(t));
	}
	writeStripHeight(e, t) {
		let n = this.hostOf(e);
		if (n === null || t === null || !TI(t)) return;
		let r = Math.max(0, Math.round(t.getBoundingClientRect().top - n.getBoundingClientRect().top));
		n.style.setProperty(lq, `${r}px`);
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${x}]`);
	}
	fitCaptions(e, t, n) {
		let r = this.hostOf(e), i = e.querySelector(`:scope > .${dH}`);
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownItems(e).find((e) => xq(e) === t)?.querySelector(`.${KK}`)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownItems(e).filter(TI).map((e) => ({
				key: xq(e),
				title: e.querySelector(`.${KK}`)?.textContent?.trim() ?? xq(e),
				current: xq(e) === t,
				disabled: A(e.querySelector(`.${KK}`) ?? e)
			}));
		});
	}
	prepareMenu(e) {
		let t = e.target;
		if (!(e instanceof CustomEvent) || !(t instanceof HTMLElement) || t.getAttribute("data-ui-context-menu") !== "tab") return;
		let n = t.parentElement, r = e.detail.target.closest(`.${tA}`);
		if (n === null || !n.classList.contains(Y) || r === null || r.closest(`.${Y}`) !== n) {
			e.preventDefault();
			return;
		}
		let i = hq(n, r), a = _q(t), o = a.map((e) => {
			if (gq(e)) return "rule";
			let t = i.get(e.getAttribute("data-ui-key") ?? "");
			return t !== void 0 && (e.style.display = t ? "" : "none"), t ?? TI(e) ? "shown" : "hidden";
		});
		GF(o).forEach((e, t) => {
			o[t] === "rule" && (a[t].style.display = e ? "" : "none");
		}), o.includes("shown") ? this.menuTab = {
			root: n,
			key: xq(r)
		} : e.preventDefault();
	}
	handleMenuEntry(e) {
		let t = e.closest(`[${Se}="tab"]`), n = t?.parentElement ?? null, r = e.closest(iq);
		if (t === null || n === null || !n.classList.contains(Y) || r === null || !t.contains(r)) return !1;
		let i = r.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "", a = this.menuTab, o = a === null || a.root !== n ? void 0 : this.ownItems(n).find((e) => xq(e) === a.key);
		if (i.length === 0 || r.matches("[data-ui-menu-group] > .ui-menu-item, [data-ui-menu-item-kind=\"header\"], [data-ui-menu-item-kind=\"separator\"]") || o === void 0) return !0;
		if (!i.startsWith("tabs:")) return o.dispatchEvent(new CustomEvent(aq, {
			bubbles: !0,
			detail: { entry: i }
		})), !0;
		if (hq(n, o).get(i) !== !0) return !0;
		switch (i) {
			case RF: {
				let e = o.querySelector(`.${KK}`);
				e !== null && this.startRename(e);
				break;
			}
			case zF:
			case BF:
				this.setPinned(n, o, i === zF);
				break;
			default: o.dispatchEvent(new Event("remove", { bubbles: !0 }));
		}
		return !0;
	}
	setPinned(e, t, n) {
		if (t.hasAttribute("data-ui-tab-pinned") === n) return;
		let r = t.querySelector(`:scope > .${YK} > .${XK}`);
		t.toggleAttribute(gi, n), r !== null && (r.toggleAttribute(gi, n), r.dispatchEvent(new Event("change", { bubbles: !0 })));
		let i = this.ownItems(e), a = i.filter((e) => e !== t), o = GK(a.map(bq));
		if (i.indexOf(t) === o) return;
		let s = a[o];
		s === void 0 ? nA(a[a.length - 1]).after(nA(t)) : nA(s).before(nA(t)), t.dispatchEvent(new Event(sq, { bubbles: !0 }));
	}
	handleClick(e) {
		if (!(e.target instanceof Element) || this.handleMenuEntry(e.target) || this.handleClose(e, e.target)) return;
		let t = e.target.closest(`.${dH}`), n = t?.parentElement ?? null;
		if (t !== null && n !== null && n.classList.contains(Y)) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = vq(e.target), i = r?.closest(`.${Y}`) ?? null;
		if (r === null || i === null || A(r)) return;
		let a = r.closest(`.${tA}`);
		a !== null && a.closest(`.${Y}`) === i && (e.preventDefault(), this.select(i, xq(a)), document.activeElement !== r && B(r));
	}
	handleClose(e, t) {
		let n = t.closest(`.${qK}`), r = n?.closest(".ui-tab-item") ?? null, i = r?.closest(`.${Y}`) ?? null;
		return n === null || r === null || i === null ? !1 : (e.preventDefault(), e.stopPropagation(), pq(i, r) && r.dispatchEvent(new Event("remove", { bubbles: !0 })), !0);
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = vq(e.target), n = t?.closest(`.${Y}`) ?? null;
		t !== null && n !== null && n.hasAttribute("data-ui-tabs-renamable") && (e.preventDefault(), this.startRename(t));
	}
	startRename(e) {
		let t = e.parentElement, n = e.querySelector(ZK) ?? e, r = e.closest(`.${tA}`);
		t === null || r === null || iA(r, "data-ui-unrenamable") || vu({
			container: t,
			title: n,
			className: JK,
			value: e.getAttribute("data-ui-tab-caption") ?? n.textContent?.trim() ?? "",
			commit: (t) => {
				e.setAttribute(fi, t), e.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			refocus: () => B(e)
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || zu(e)) return;
		let t = e.target.closest(`.${KK}`), n = t?.closest(`.${Y}`) ?? null;
		if (t === null || n === null) return;
		if (e.key === "F2" && P(e)) {
			if (!n.hasAttribute("data-ui-tabs-renamable")) return;
			e.preventDefault(), this.startRename(t);
			return;
		}
		let r = t.closest(`.${tA}`);
		if (r === null || r.closest(`.${Y}`) !== n) return;
		if (e.key === "Delete" && P(e)) {
			if (!mq(n, r)) return;
			e.preventDefault(), this.closed = {
				root: n,
				item: r
			}, r.dispatchEvent(new Event("remove", { bubbles: !0 }));
			return;
		}
		if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && e.altKey && P(e, { alt: !0 })) {
			this.moveByKey(n, r, e);
			return;
		}
		if (!P(e)) return;
		let i = this.ownItems(n).map((e) => e.querySelector(`.${KK}`)).filter((e) => e !== null), a = Qu({
			key: e.key,
			items: i,
			current: t,
			axis: "horizontal"
		});
		if (a === null) return;
		e.preventDefault();
		let o = a.closest(`.${tA}`);
		o !== null && this.select(n, xq(o)), a.focus();
	}
	moveByKey(e, t, n) {
		if (!e.hasAttribute("data-ui-tabs-draggable") || iA(t, "data-ui-undraggable") || A(t) || t.hasAttribute("data-ui-tab-pinned")) return;
		n.preventDefault();
		let r = this.ownItems(e), i = r[r.indexOf(t) + (n.key === "ArrowLeft" ? -1 : 1)];
		i === void 0 || i.hasAttribute("data-ui-tab-pinned") || (n.key === "ArrowLeft" ? nA(t).after(nA(i)) : nA(t).before(nA(i)), dA(t, this.ownItems(e).indexOf(t)));
	}
	handleDragStart(e) {
		let t = yq(e);
		if (t === null) return;
		if (iA(t, "data-ui-undraggable") || A(t) || t.hasAttribute("data-ui-tab-pinned")) {
			e.preventDefault();
			return;
		}
		Ov(e, t.closest(`.${Y}`) ?? t, t, QK, xq(t));
		let n = nA(t);
		this.dragStart = n.parentNode === null ? null : {
			parent: n.parentNode,
			next: n.nextSibling
		};
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${YK}`)?.closest(".ui-tab-item") ?? null, n = t?.closest(`.${Y}`) ?? null;
		if (t === null || n === null) return;
		let r = n.querySelector(`.${QK}`);
		if (r === null || (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), r === t)) return;
		let i = t.querySelector(`.${YK}`)?.getBoundingClientRect();
		if (i === void 0) return;
		let a = nA(r), o = t.hasAttribute("data-ui-tab-pinned") ? dq(n, a) : null, s = o ?? nA(t), c = o === null && e.clientX < i.left + i.width / 2 ? s : s.nextElementSibling;
		c !== a && s.parentElement?.insertBefore(a, c);
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Y}`);
		t !== null && t.querySelector(`.${QK}`) !== null && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"));
	}
	handleDragEnd(e) {
		let t = yq(e);
		if (t === null) return;
		t.classList.remove(QK);
		let n = this.dragStart;
		if (this.dragStart = null, e instanceof DragEvent && e.dataTransfer?.dropEffect === "none" && n !== null) {
			n.parent.insertBefore(nA(t), n.next);
			return;
		}
		let r = nA(t);
		if (n !== null && r.parentNode === n.parent && r.nextSibling === n.next) return;
		let i = t.closest(`.${Y}`);
		i !== null && dA(t, this.ownItems(i).indexOf(t));
	}
	select(e, t) {
		Sd(e, t, {
			attribute: di,
			bindingAttribute: ui,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return bd(e, `.${tA}`, `.${Y}`);
	}
};
function dq(e, t) {
	let n = null;
	for (let r of bd(e, `.${tA}`, `.${Y}`)) {
		let e = nA(r);
		e !== t && r.hasAttribute("data-ui-tab-pinned") && (n = e);
	}
	return n;
}
function fq(e, t) {
	let n = !t.some((e) => !iA(e, ce));
	e.hasAttribute("data-ui-tabs-none-removable") !== n && e.toggleAttribute(ye, n);
}
function pq(e, t) {
	return !e.hasAttribute("data-ui-tabs-unremovable") && !iA(t, "data-ui-unremovable");
}
function mq(e, t) {
	return e.hasAttribute("data-ui-tabs-removes") && pq(e, t) && !t.hasAttribute("data-ui-tab-pinned") && !A(t);
}
function hq(e, t) {
	return WF(UF(e.getAttribute(xe)), {
		pinned: t.hasAttribute(gi),
		renamable: !iA(t, le),
		removable: e.hasAttribute("data-ui-tabs-removes") && pq(e, t)
	});
}
function gq(e) {
	let t = e.getAttribute(b);
	return t === "tabs:separator" || t === "tabs:separator-remove" || e.querySelector(":scope > [data-ui-menu-item-kind=\"separator\"]") !== null;
}
function _q(e) {
	let t = e.querySelector(`[${x}]`);
	return t === null ? [] : Array.from(t.children).filter((e) => e instanceof HTMLElement && e.hasAttribute("data-ui-key"));
}
function vq(e) {
	return e.closest(`.${qK}`) !== null || _u(e) ? null : e.closest(`.${YK}`)?.querySelector(`:scope > .${KK}`) ?? null;
}
function yq(e) {
	return e.target instanceof Element ? e.target.closest(`.${YK}`)?.closest(".ui-tab-item") ?? null : null;
}
function bq(e) {
	return { pinned: e.hasAttribute(gi) };
}
function xq(e) {
	return e.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "";
}
//#endregion
//#region src/interactions/text-fold-engine.ts
var Sq = "button.ui-text__fold-toggle", Cq = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(Sq);
		t !== null && (e.preventDefault(), t.setAttribute("aria-expanded", t.getAttribute("aria-expanded") === "true" ? "false" : "true"));
	}
}, wq = "ui-temporal-input__segments", Tq = "ui-temporal-input__segment", Eq = "ui-temporal-input__segment-literal", Dq = "ui-temporal-input__segment--empty", Oq = "data-ui-temporal-segment", kq = "data-ui-temporal-step-direction", Aq = "data-ui-temporal-segments-of", jq = "--", Mq = /* @__PURE__ */ new Map([
	["ArrowUp", 1],
	["ArrowDown", -1],
	["PageUp", 10],
	["PageDown", -10]
]), Nq = class {
	options;
	root;
	edits = /* @__PURE__ */ new WeakMap();
	wheelTurn = 0;
	onWheel = (e) => this.handleWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${q}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(Ba(e.components, `.${q}`));
		}), H(this.root, `.${q}`, { attributeFilter: [...Lj] }, (e) => this.applyAll(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("mousedown", (e) => this.handleStepperPress(e), !0);
	}
	applyAll(e) {
		for (let t of e) zj(t) === "time" && this.applySegments(t);
	}
	applySegments(e) {
		for (let t of e.querySelectorAll(`.${wq}`)) this.applyContainer(e, t);
	}
	applyContainer(e, t) {
		let n = Bj(e), r = Gj(e), i = J(e, Qj(t));
		t.getAttribute(Aq) !== n && (t.replaceChildren(...Pq(n).map((e) => Iq(e))), t.setAttribute(Aq, n));
		for (let n of t.children) {
			if (!(n instanceof HTMLElement)) continue;
			let t = n.getAttribute(Oq);
			t === null ? n.textContent = Rq(n.dataset.token ?? "", n.dataset.formatted !== void 0, i, r) : (n.textContent = zq(t, Number(n.dataset.width ?? "2"), i, r), n.classList.toggle(Dq, i === null), n.tabIndex = 0, Bq(n, t, i, M(e)));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !P(e, { shift: !0 })) return;
		let t = Hq(e.target);
		if (t === null) return;
		let n = t.closest(`.${q}`), r = t.getAttribute(Oq), i = Vq(t), a = Mq.get(e.key);
		if (a !== void 0) e.preventDefault(), this.resetBuffer(n), this.applyStep(n, r, a, i);
		else if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") e.preventDefault(), this.resetBuffer(n), Wq(n, t, e.key);
		else if (e.key === "Backspace" || e.key === "Delete") e.preventDefault(), this.resetBuffer(n), sM(n, null, i), this.applySegments(n);
		else if (r === "meridiem") {
			let t = Gq(e.key, Gj(n));
			t !== null && (e.preventDefault(), this.applyMeridiem(n, t, i));
		} else e.key.length === 1 && e.key >= "0" && e.key <= "9" && (e.preventDefault(), this.applyDigit(n, t, r, e.key, i));
	}
	handleFocusIn(e) {
		let t = Hq(e.target);
		t !== null && (this.wheelTurn = 0, t.addEventListener("wheel", this.onWheel, { passive: !1 }));
	}
	handleWheel(e) {
		let t = Hq(e.currentTarget);
		if (t === null || t !== document.activeElement || e.deltaY === 0) return;
		e.preventDefault();
		let { steps: n, carried: r } = Sb(this.wheelTurn, xb(e).y);
		if (this.wheelTurn = r, n === 0) return;
		let i = t.closest(`.${q}`);
		this.resetBuffer(i);
		for (let e = 0; e < Math.abs(n); e++) this.applyStep(i, t.getAttribute(Oq), n < 0 ? 1 : -1, Vq(t));
	}
	handleStepperPress(e) {
		e.target instanceof Element && e.target.closest(`[${kq}]`) !== null && e.preventDefault();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${kq}]`);
		if (t === null) return;
		let n = t.closest(`.${q}`);
		if (n === null || M(n)) return;
		e.preventDefault();
		let r = Uq(n) ?? n.querySelector(`.${Tq}`);
		r !== null && (r.focus(), this.resetBuffer(n), this.applyStep(n, r.getAttribute(Oq), t.getAttribute(kq) === "up" ? 1 : -1, Vq(r)));
	}
	handleFocusOut(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${Tq}`) : null;
		if (t === null) return;
		t.removeEventListener("wheel", this.onWheel);
		let n = t.closest(`.${q}`);
		n !== null && this.resetBuffer(n);
	}
	applyStep(e, t, n, r) {
		if (t === "meridiem") {
			let t = J(e, r), n = t !== null && t.getHours() >= 12 ? "am" : "pm";
			this.write(e, vM(e, qq(this.baseValue(e, r), n)), r);
			return;
		}
		let i = this.baseValue(e, r), a = Kq(t), o = Hj(Vj(e), a) * n, s = a === "hour" ? 24 : 60, c = ((Uj(i, a) + o) % s + s) % s;
		this.write(e, vM(e, Wj(i, a, c)), r);
	}
	applyDigit(e, t, n, r, i) {
		let a = this.editState(e), o = n === "hour" ? 23 : n === "hour12" ? 12 : 59, s = +(n === "hour12"), c = (a.unit === n ? a.buffer : "") + r;
		Number(c) > o && (c = r);
		let l = Number(c), u = c.length >= 2 || l * 10 > o;
		if (a.unit = n, a.buffer = u ? "" : c, l >= s) {
			let t = this.baseValue(e, i);
			this.write(e, n === "hour12" ? Wj(t, "hour", Jq(l, t.getHours() >= 12)) : Wj(t, Kq(n), l), i);
		}
		u && Wq(e, t, "ArrowRight");
	}
	applyMeridiem(e, t, n) {
		this.write(e, qq(this.baseValue(e, n), t), n);
	}
	baseValue(e, t) {
		return J(e, t) ?? _M(e);
	}
	write(e, t, n) {
		sM(e, t, n), hM(e), this.applySegments(e);
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
function Pq(e) {
	let t = [];
	for (let n = 0; n < e.length;) {
		let r = Ds(e, n);
		r === null ? (t.push({
			kind: "literal",
			token: e[n],
			formatted: !1
		}), n++) : (t.push(Fq(r)), n += r.length);
	}
	return t;
}
function Fq(e) {
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
function Iq(e) {
	if (e.kind === "literal") {
		let t = document.createElement("span");
		return t.className = Eq, t.dataset.token = e.token, e.formatted && (t.dataset.formatted = ""), t;
	}
	let t = document.createElement("span");
	return t.className = Tq, t.tabIndex = 0, t.setAttribute("role", "spinbutton"), t.setAttribute(Oq, e.unit), t.dataset.width = String(e.width), Lq(t, e.unit), t;
}
function Lq(e, t) {
	if (t === "meridiem") {
		k.write(e, "aria-label", "ui.picker.meridiem");
		return;
	}
	let n = Kq(t);
	k.write(e, "aria-label", n === "hour" ? "ui.picker.hours" : n === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"), e.setAttribute("aria-valuemin", t === "hour12" ? "1" : "0"), e.setAttribute("aria-valuemax", t === "hour12" ? "12" : t === "hour" ? "23" : "59");
}
function Rq(e, t, n, r) {
	return t && n !== null ? Ss(n, e, r) : e;
}
function zq(e, t, n, r) {
	if (n === null) return jq;
	if (e === "meridiem") return n.getHours() < 12 ? r.amDesignator : r.pmDesignator;
	let i = e === "hour12" ? Js(n.getHours()) : Uj(n, Kq(e));
	return String(i).padStart(t, "0");
}
function Bq(e, t, n, r) {
	r !== e.hasAttribute("aria-readonly") && (r ? e.setAttribute("aria-readonly", "true") : e.removeAttribute("aria-readonly")), t === "meridiem" || n === null ? e.removeAttribute("aria-valuenow") : e.setAttribute("aria-valuenow", String(t === "hour12" ? Js(n.getHours()) : Uj(n, Kq(t))));
}
function Vq(e) {
	return Qj(e.closest(`.${wq}`));
}
function Hq(e) {
	let t = e instanceof Element ? e.closest(`.${Tq}`) : null;
	if (t === null) return null;
	let n = t.closest(`.${q}`);
	return n === null || M(n) ? null : t;
}
function Uq(e) {
	return document.activeElement instanceof HTMLElement && document.activeElement.closest(".ui-temporal-input") === e ? document.activeElement.closest(`.${Tq}`) : null;
}
function Wq(e, t, n) {
	Qu({
		key: n,
		items: [...e.querySelectorAll(`.${Tq}`)],
		current: t,
		axis: "horizontal",
		loop: !1
	})?.focus();
}
function Gq(e, t) {
	let n = e.toLowerCase();
	return n.length === 1 ? n === "a" || n === t.amDesignator.charAt(0).toLowerCase() ? "am" : n === "p" || n === t.pmDesignator.charAt(0).toLowerCase() ? "pm" : null : null;
}
function Kq(e) {
	return e === "hour12" || e === "meridiem" ? "hour" : e;
}
function qq(e, t) {
	return Wj(e, "hour", Jq(Js(e.getHours()), t === "pm"));
}
function Jq(e, t) {
	let n = e % 12;
	return t ? n + 12 : n;
}
//#endregion
//#region src/interactions/timestamp-engine.ts
var Yq = "datetime", Xq = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.apply(this.root.querySelectorAll(`.${St}`), k.temporal === null), k.onTable(() => this.apply(this.root.querySelectorAll(`.${St}`))), e.propertyPatchEngine?.addValueChangeHandler((e) => this.apply(Ba(e.components, `.${St}`))), H(this.root, `.${St}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [Yq],
			relevant: (e) => e.type === "attributes" || !(e.target instanceof Element && e.target.closest(".ui-timestamp") !== null)
		}, (e) => this.apply(e));
	}
	apply(e, t = !1) {
		let n = {
			temporal: k.temporal,
			language: k.language || document.documentElement.lang
		}, r = Date.now(), i = !1;
		for (let a of e) {
			let e = Qs(a.getAttribute(wt)), o = Zs(a.getAttribute(Yq)), s = a.querySelector(`.${Ct}`);
			if (s === null || t && !Zq(e, o, r)) continue;
			let c = o === null ? "" : nc(o, e, n, r);
			s.textContent !== c && (s.textContent = c), i ||= $s(e) && o !== null;
		}
		i && Mc(this.refreshRelative);
	}
	refreshRelative = () => {
		let e = [...this.root.querySelectorAll(`.${St}:is([${wt}="relative"], [${wt}="relative-date"])`)];
		return e.length !== 0 && (this.apply(e), !0);
	};
};
function Zq(e, t, n) {
	return e === "relative" || e === "relative-date" && t !== null && rc(t, n) !== null;
}
//#endregion
//#region src/interactions/file-tile-engine.ts
var Qq = `.${Tt}`, $q = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), k.onChange(() => this.applyAll()), e.propertyPatchEngine?.addValueChangeHandler((e) => eJ(Ba(e.components, Qq))), H(this.root, Qq, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [
				kt,
				At,
				jt,
				Mt
			],
			relevant: (e) => e.type === "attributes" || !(e.target instanceof Element && e.target.closest(Qq) !== null)
		}, eJ);
	}
	applyAll() {
		eJ(this.root.querySelectorAll(Qq));
	}
};
function eJ(e) {
	let t = k.language || document.documentElement.lang;
	for (let n of e) my(n, t);
}
//#endregion
//#region src/items/item-reveal.ts
var tJ = /* @__PURE__ */ new Map();
function nJ(e) {
	if (e.hasAttribute("data-ui-items-host")) return e;
	for (let t of e.querySelectorAll(`[${x}]`)) if (t.closest("[data-ui-id]") === e) return t;
	return null;
}
function rJ(e, t, n, r) {
	let i = iJ(e, t);
	return i !== null && (tJ.set(e, {
		key: t,
		block: n
	}), aJ(e, i, n, r), !0);
}
function iJ(e, t) {
	for (let n of e.children) if (n.getAttribute("data-ui-key") === t) return n;
	return null;
}
function aJ(e, t, n, r) {
	let i = t.previousElementSibling, a = i !== null && i.hasAttribute("data-ui-group-header") && i.getAttribute("data-ui-group-anchor") === t.getAttribute("data-ui-key") ? i : null, o = id(e);
	if (o.scrollHeight <= o.clientHeight) {
		(a ?? t).scrollIntoView({
			behavior: r,
			block: n === "Start" ? "start" : n === "End" ? "end" : n === "Center" ? "center" : "nearest"
		});
		return;
	}
	let s = o.getBoundingClientRect().top + o.clientTop, c = o.clientHeight, l = (a ?? t).getBoundingClientRect().top, u = t.getBoundingClientRect().bottom, d = oJ(n, l - s, u - s, c);
	d !== 0 && (r === "smooth" ? o.scrollTo({
		top: o.scrollTop + d,
		behavior: r
	}) : o.scrollTop += d);
}
function oJ(e, t, n, r) {
	switch (e) {
		case "Center": return (t + n - r) / 2;
		case "End": return n - r;
		case "Nearest": return t >= 0 && n <= r ? 0 : t < 0 || n - t > r ? t : n - r;
		default: return t;
	}
}
function sJ(e) {
	let t = tJ.get(e);
	if (t === void 0) return;
	let n = iJ(e, t.key);
	n === null ? tJ.delete(e) : aJ(e, n, t.block, "auto");
}
function cJ(e) {
	if (tJ.size !== 0 && e instanceof Node) for (let t of [...tJ.keys()]) (!t.isConnected || id(t).contains(e)) && tJ.delete(t);
}
//#endregion
//#region src/interactions/scroll-anchor-engine.ts
var lJ = "data-ui-scroll-anchor", uJ = "End", dJ = `[${lJ}="${uJ}"]`, fJ = 4, pJ = [
	"wheel",
	"touchstart",
	"pointerdown",
	"keydown"
], mJ = /* @__PURE__ */ new WeakSet();
function hJ(e) {
	mJ.add(e);
}
function gJ(e) {
	cJ(e);
	for (let t = e.closest(dJ); t !== null; t = t.parentElement?.closest(dJ) ?? null) mJ.delete(t);
}
var _J = class {
	root;
	pinned = /* @__PURE__ */ new WeakMap();
	resizes = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null;
	watched = /* @__PURE__ */ new WeakMap();
	watchedContainers = /* @__PURE__ */ new WeakSet();
	heights = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0);
		for (let e of pJ) this.root.addEventListener(e, (e) => vJ(e), {
			capture: !0,
			passive: !0
		});
		H(this.root, `[${lJ}="${uJ}"]`, {
			childList: !0,
			characterData: !0,
			attributeFilter: [ln]
		}, (e) => this.followEach(e)), this.followContent();
	}
	handleScroll(e) {
		let t = e.target;
		t instanceof Element && bJ(t) && this.pinned.set(t, mJ.has(t) || SJ(t) && !xJ(t));
	}
	followContent() {
		this.followEach(this.root.querySelectorAll(`[${lJ}="${uJ}"]`));
	}
	followEach(e) {
		for (let t of e) this.watchRows(t), mJ.has(t) ? (this.pinned.set(t, !0), yJ(t)) : this.pinned.get(t) !== !1 && (xJ(t) ? this.pinned.set(t, !1) : (this.pinned.set(t, !0), yJ(t)));
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
			if (!e.isConnected || r === null || !bJ(r)) {
				this.forget(e);
				continue;
			}
			let i = e.getBoundingClientRect(), a = this.heights.get(e);
			if (this.heights.set(e, i.height), a === i.height) continue;
			let o = a !== void 0 && i.top + a <= r.getBoundingClientRect().top ? i.height - a : 0;
			t.set(r, (t.get(r) ?? 0) + o);
		}
		for (let [e, n] of t) this.followsEnd(e) ? yJ(e) : n !== 0 && e.getAttribute("data-ui-host-mode") !== "virtualized" && getComputedStyle(e).overflowAnchor === "none" && (e.scrollTop += n);
	}
	followOwnBox(e) {
		!e.isConnected || !bJ(e) ? (this.watchedContainers.delete(e), this.resizes?.unobserve(e)) : this.followsEnd(e) && yJ(e);
	}
	followsEnd(e) {
		return mJ.has(e) || this.pinned.get(e) !== !1 && !xJ(e);
	}
	forget(e) {
		this.resizes?.unobserve(e), this.heights.delete(e);
	}
};
function vJ(e) {
	cJ(e.target);
	let t = e.target instanceof Element ? e.target.closest(dJ) : null;
	t !== null && mJ.delete(t);
}
function yJ(e) {
	e.scrollTop = e.scrollHeight;
}
function bJ(e) {
	return e.getAttribute(lJ) === uJ;
}
function xJ(e) {
	return VO(e, rn);
}
function SJ(e) {
	return e.scrollHeight - e.scrollTop - e.clientHeight <= fJ;
}
//#endregion
//#region src/interactions/text-selection-engine.ts
var CJ = `${Wu}, [role='menu'], [role='tab']`, wJ = class {
	selection;
	selects;
	constructor(e = {}) {
		let t = e.root ?? document;
		this.selection = e.selection ?? (() => document.getSelection()), this.selects = e.selects ?? TJ, t.addEventListener("pointerdown", (e) => this.handlePointerDown(e), { capture: !0 });
	}
	handlePointerDown(e) {
		if (e.button !== 0 || e.pointerType === "touch" || !(e.target instanceof Element)) return;
		let t = this.selection();
		t === null || t.isCollapsed || e.target.closest(CJ) !== null || this.selects(e.target) || t.removeAllRanges();
	}
};
function TJ(e) {
	let t = getComputedStyle(e);
	return (t.getPropertyValue("user-select") || t.getPropertyValue("-webkit-user-select")) !== "none";
}
//#endregion
//#region src/interactions/scroll-group-mapping.ts
function EJ(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.top(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = OJ(e, a, n), s = OJ(e, a + 1, n);
	return kJ(t, o.top, s.top, o.line, s.line);
}
function DJ(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.line(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = OJ(e, a, n), s = OJ(e, a + 1, n);
	return kJ(t, o.line, s.line, o.top, s.top);
}
function OJ(e, t, n) {
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
function kJ(e, t, n, r, i) {
	return n <= t ? r : r + Math.min(1, Math.max(0, (e - t) / (n - t))) * (i - r);
}
//#endregion
//#region src/interactions/scroll-group-engine.ts
var AJ = 250, jJ = class {
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
		if (n !== void 0 && t - n.at < AJ && n.found.every((e) => e.isConnected)) return n.found;
		let r = [...this.root.querySelectorAll(`[${qt}="${Yi(e)}"]`)];
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
		let n = MJ(e, "data-ui-scroll-viewport") ?? NJ(e) ?? e;
		return this.viewports.set(e, n), n;
	}
	follow(e, t) {
		let n = e.scrollHeight - e.clientHeight, r = t.scrollHeight - t.clientHeight;
		if (r <= 0 && t.scrollWidth <= t.clientWidth) return;
		let i = n > 0 ? FJ(e) : null, a = i === null ? null : FJ(t), o;
		if (n <= 0 || e.scrollTop <= 0) o = 0;
		else if (e.scrollTop >= n - 1) o = r;
		else if (i !== null && a !== null) {
			let t = Math.max(i.endLine, a.endLine);
			o = DJ(a, EJ(i, e.scrollTop, t), t);
		} else o = e.scrollTop / n * r;
		let s = i === null && a === null ? PJ(e.scrollLeft, e.scrollWidth - e.clientWidth) * Math.max(0, t.scrollWidth - t.clientWidth) : t.scrollLeft;
		o = Math.round(Math.min(Math.max(0, o), Math.max(0, r))), !(Math.abs(t.scrollTop - o) < 1 && Math.abs(t.scrollLeft - s) < 1) && (t.scrollTo({
			top: o,
			left: s,
			behavior: "instant"
		}), this.driven.set(t, t.scrollTop));
	}
};
function MJ(e, t) {
	for (let n of e.querySelectorAll(`[${t}]`)) if (n.closest("[data-ui-id]") === e) return n;
	return null;
}
function NJ(e) {
	let t = e.hasAttribute("data-ui-items-host") ? e : MJ(e, x);
	return t === null ? null : id(t);
}
function PJ(e, t) {
	return t > 0 ? e / t : 0;
}
function FJ(e) {
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
var IJ = ".ui-tab-item__caption, .ui-split-button:not([data-ui-split-mode='menu']) > :is(.ui-split-button__main, .ui-split-button__toggle)", LJ = `.${Mi}, .ui-action, .${C}, .ui-select__option, .ui-language-switcher__choice, .ui-pager__size-choice, .ui-color-input__swatch--button, .ui-expander__header, ${IJ}`, RJ = ".ui-expander__header", zJ = "ui-key-value-action__row", BJ = `${LJ}, ${`${Td}, .${zJ}`}`, VJ = "ui-pressing", HJ = "ui-press-held", UJ = "ui-press-placed", WJ = class {
	clicks;
	waves;
	presses = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		let t = e.root ?? document;
		this.clicks = e.clicks ?? (() => !1), this.waves = e.waves ?? !0, t.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), t.addEventListener("pointerup", (e) => this.release(e, !1), !0), t.addEventListener("pointercancel", (e) => this.release(e, !0), !0), t.addEventListener("dragstart", () => this.finishAll(), !0), t.addEventListener(NP, (e) => this.handleHold(e)), t.addEventListener(PP, (e) => this.handleHoldEnd(e));
	}
	handlePointerDown(e) {
		if (!(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		this.end(e.pointerId, !0);
		let t = this.pressedElement(e.target);
		t !== null && this.moves(t) && (this.start(e.pointerId, t, e.clientX, e.clientY, V.ripple, !1), t.classList.add(HJ));
	}
	moves(e) {
		return this.waves && typeof e.animate == "function" && !Xm();
	}
	start(e, t, n, r, i, a) {
		for (let [e, n] of this.presses) n.element === t && this.finish(e, n);
		let o = t.getBoundingClientRect(), s = n - o.left, c = r - o.top, l = Math.hypot(Math.max(s, o.width - s), Math.max(c, o.height - c)), { wave: u, ink: d } = GJ(s - t.clientLeft, c - t.clientTop, l);
		t.classList.add(VJ), t.append(u);
		let f = i === null ? null : d.animate([{ transform: "scale(0)" }, { transform: "scale(1)" }], {
			duration: i,
			easing: V.ease,
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
		if (t === null || !(n instanceof HTMLElement) || A(n) || t.target.closest(RJ) !== null) return;
		let r = this.presses.get(t.pointerId);
		if (r !== void 0 && r.fade === null) {
			this.retime(r, performance.now() + t.duration);
			return;
		}
		let i = this.moves(n);
		(i || this.pressedElement(t.target) === null) && (this.start(t.pointerId, n, t.clientX, t.clientY, i ? t.duration : null, !0), getComputedStyle(n).position === "static" && n.classList.add(UJ));
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
		let t = e.closest(IJ) ?? e.closest(BJ);
		if (t === null || A(t) || t.matches(RJ)) return null;
		let n = e.closest(ki);
		return n !== null && n !== t && t.contains(n) ? null : t.matches(LJ) ? t : this.pressedRow(t, e);
	}
	pressedRow(e, t) {
		if (Zu(t, e) !== null || j(e) || e.hasAttribute("data-ui-row-editing")) return null;
		let n = e.closest(L), r = n !== null && !e.classList.contains(zJ) && !n.hasAttribute("data-ui-no-row-select") && (n.getAttribute("data-ui-selection") === "one" || n.getAttribute("data-ui-selection") === "many"), i = e.classList.contains("ui-tree__row") && al(e, "data-ui-unselectable");
		return !r && !i && !this.raisesClick(e, t) ? null : R(e);
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
		n.element.classList.remove(HJ);
		let r = performance.now(), i = Math.max(0, n.fills - r), a = t ? 0 : Math.min(i, V.fast);
		a > 0 && this.retime(n, r + a), n.fade = n.wave.animate([{ opacity: 1 }, { opacity: 0 }], {
			duration: V.normal,
			delay: a,
			easing: V.exit,
			fill: "forwards"
		}), n.fade.addEventListener("finish", () => this.finish(e, n));
	}
	finish(e, t) {
		t.grow?.cancel(), t.fade?.cancel(), t.wave.remove(), t.element.classList.remove(VJ, HJ, UJ), this.presses.get(e) === t && this.presses.delete(e);
	}
};
function GJ(e, t, n) {
	let r = document.createElement("span"), i = document.createElement("span");
	return r.className = cg, r.setAttribute("aria-hidden", "true"), i.className = lg, i.style.setProperty("left", `${e - n}px`), i.style.setProperty("top", `${t - n}px`), i.style.setProperty("width", `${n * 2}px`), i.style.setProperty("height", `${n * 2}px`), r.append(i), {
		wave: r,
		ink: i
	};
}
//#endregion
//#region src/interactions/overlay-scrollbar-engine.ts
var KJ = "ui-overlay-scrollbar", qJ = "ui-overlay-scrollbar__box", JJ = "ui-overlay-scrollbar__thumb", YJ = "ui-overlay-scrollbar--shown", XJ = "ui-overlay-scrollbar__thumb--held", ZJ = "ui-overlay-scrollbar__arrow", QJ = "ui-overlay-scrollbar--near", $J = "(hover: hover) and (forced-colors: none)", eY = "--ui-overlay-thumb", tY = "--ui-scroll-hung", nY = 12, rY = 2, iY = 24, aY = 12, oY = 80, sY = 40, cY = 400, lY = 50, uY = 900, dY = 400, fY = 16, pY = class {
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
		this.doc = e, this.layer = e.createElement("div"), this.layer.className = KJ, this.layer.setAttribute("aria-hidden", "true"), this.layer.setAttribute("popover", "manual"), this.bars = {
			y: this.createBar(e, "y"),
			x: this.createBar(e, "x")
		}, this.layer.addEventListener("mousedown", (e) => e.preventDefault()), this.layer.addEventListener("contextmenu", (e) => e.preventDefault()), e.body.append(this.layer), Ag((e) => e.includes(this.bars.y.box) ? this.bars.y.scroller : e.includes(this.bars.x.box) ? this.bars.x.scroller : null), this.media = window.matchMedia($J), this.active = this.media.matches, this.media.addEventListener("change", () => this.follow()), this.active && this.raise(), e.addEventListener("pointermove", (e) => this.handlePointerMove(e), {
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
		return n.className = `${qJ} ${qJ}--${t}`, r.className = `${JJ} ${JJ}--${t}`, n.append(i, r, a), this.layer.append(n), r.addEventListener("pointerdown", (e) => this.grab(e, t)), r.addEventListener("pointermove", (e) => this.pull(e)), r.addEventListener("pointerup", (e) => this.release(e)), r.addEventListener("pointercancel", (e) => this.release(e)), r.addEventListener("lostpointercapture", (e) => this.lose(e)), r.addEventListener("wheel", (e) => this.forwardWheel(e, t), { passive: !1 }), {
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
		return r.className = `${ZJ} ${ZJ}--${n < 0 ? "back" : "forward"}`, r.addEventListener("pointerdown", (e) => this.step(e, t, n)), r.addEventListener("pointerup", () => this.stopStepping()), r.addEventListener("pointercancel", () => this.stopStepping()), r.addEventListener("lostpointercapture", () => this.stopStepping()), r.addEventListener("wheel", (e) => this.forwardWheel(e, t), { passive: !1 }), r;
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
		t !== null && (t === this.bars.y.scroller || t === this.bars.x.scroller ? ((this.scrolling || this.drag !== null || this.readerScrolled(e)) && this.flash(), this.schedule(), !this.hovered && this.drag === null && this.settleLater()) : this.hovered || this.drag !== null ? (this.repick = this.hovered && this.drag === null, this.schedule()) : this.readerScrolled(e) && (this.pick(yY(t, "y") ? t : null, yY(t, "x") ? t : null, !1), this.flash(), this.settleLater(), this.schedule()));
	}
	noteInput(e) {
		this.inputAt = e.timeStamp;
	}
	readerScrolled(e) {
		return e.timeStamp - this.inputAt < dY;
	}
	flash() {
		this.scrolling = !0, window.clearTimeout(this.fade), this.fade = window.setTimeout(() => {
			this.fade = 0, this.scrolling = !1, this.paint();
		}, uY), this.paint();
	}
	approach() {
		let e = !1;
		for (let t of [this.bars.y, this.bars.x]) {
			let n = this.point !== null && t.view !== null && mY(this.point, t.view, t.axis, t.rtl);
			e ||= n !== t.near, t.near = n;
		}
		e && this.paint();
	}
	paint() {
		for (let e of [this.bars.y, this.bars.x]) {
			let t = this.drag?.axis === e.axis || this.stepping === e.axis;
			e.box.classList.toggle(YJ, e.view !== null && (this.scrolling || e.near || t)), e.box.classList.toggle(QJ, e.view !== null && (e.near || t));
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
		}, uY);
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
		e !== null && this.layer.contains(e) || (this.target = e, this.pick(hY(e, "y"), hY(e, "x"), !0));
	}
	measure(e) {
		let t = this.bars[e].scroller;
		if (t === null || !t.isConnected || !yY(t, e)) return null;
		let n = CY(t);
		if (n === null) return null;
		let r = this.bars[e === "y" ? "x" : "y"].scroller === t, i = e === "y" ? SY(t) : bY(t);
		return {
			view: n,
			thumb: TY(t, e, i, r),
			arrows: EY(t, e, i, r),
			rtl: MY(t)
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
		}), NY(e.thumb, r, n), e.back.hidden = i === null, e.forward.hidden = i === null, i !== null && (NY(e.back, i.back, n), NY(e.forward, i.forward, n));
	}
	step(e, t, n) {
		let r = this.bars[t].scroller;
		if (e.button !== 0 || r === null || this.drag !== null) return;
		gJ(r), e.currentTarget.setPointerCapture(e.pointerId), this.stopStepping(), this.stepping = t;
		let i = () => {
			r.isConnected ? (r.scrollBy(t === "y" ? { top: n * sY } : { left: n * sY }), this.flash()) : this.stopStepping();
		};
		i(), this.repeat = window.setTimeout(() => {
			this.repeat = window.setInterval(i, lY);
		}, cY);
	}
	stopStepping() {
		window.clearTimeout(this.repeat), window.clearInterval(this.repeat), this.repeat = 0, this.stepping !== null && (this.stepping = null, this.paint());
	}
	grab(e, t) {
		let n = this.bars[t].scroller;
		if (e.button !== 0 || n === null) return;
		let r = t === "x" && MY(n), i = OY(n, t, bY(n), this.bars[t === "y" ? "x" : "y"].scroller === n, r), a = i.length - i.thumb;
		gJ(n), this.bars[t].thumb.setPointerCapture(e.pointerId), this.bars[t].thumb.classList.add(XJ), this.drag = {
			axis: t,
			scroller: n,
			pointerId: e.pointerId,
			from: t === "y" ? e.clientY : e.clientX,
			scroll: jY(n, t),
			ratio: a > 0 ? i.max / a : 0,
			rtl: r
		};
	}
	pull(e) {
		let t = this.drag;
		if (t === null || e.pointerId !== t.pointerId || !t.scroller.isConnected) return;
		let n = (t.axis === "y" ? e.clientY : e.clientX) - t.from;
		t.axis === "y" ? t.scroller.scrollTop = AY(t.scroll, n, t.ratio, !1) : t.scroller.scrollLeft = AY(t.scroll, n, t.ratio, t.rtl);
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
		if (!(t === null || e.key !== "Escape" || e.defaultPrevented || N(e))) {
			e.preventDefault(), t.axis === "y" ? t.scroller.scrollTop = AY(t.scroll, 0, t.ratio, !1) : t.scroller.scrollLeft = AY(t.scroll, 0, t.ratio, t.rtl), this.endDrag();
			try {
				this.bars[t.axis].thumb.releasePointerCapture(t.pointerId);
			} catch {}
		}
	}
	endDrag() {
		this.drag !== null && this.bars[this.drag.axis].thumb.classList.remove(XJ), this.drag = null, this.paint();
	}
	forwardWheel(e, t) {
		let n = this.bars[t].scroller;
		if (n === null || e.ctrlKey) return;
		let r = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? "y" : "x", i = e.deltaX * vY(e, n, "x"), a = e.deltaY * vY(e, n, "y"), o = gY(n, r, r === "y" ? a : i);
		e.preventDefault(), o !== null && (gJ(o), o.scrollBy({
			left: i,
			top: a
		}));
	}
};
function mY(e, t, n, r) {
	return n === "x" ? e.x >= t.left && e.x <= t.right && e.y <= t.bottom && e.y > t.bottom - 28 : e.y < t.top || e.y > t.bottom ? !1 : r ? e.x >= t.left && e.x < t.left + 28 : e.x <= t.right && e.x > t.right - 28;
}
function hY(e, t) {
	for (let n = e; n !== null; n = n.parentElement) if (yY(n, t)) return n;
	return null;
}
function gY(e, t, n) {
	for (let r = e; r !== null; r = hY(r.parentElement, t)) if (yY(r, t) && _Y(r, t, n)) return r;
	return null;
}
function _Y(e, t, n) {
	let r = t === "y" ? e.scrollHeight - e.clientHeight : e.scrollWidth - e.clientWidth, i = jY(e, t), a = t === "x" && MY(e) ? n < 0 : n > 0;
	return n !== 0 && (a ? i < r - 1 : i > 0);
}
function vY(e, t, n) {
	return e.deltaMode === WheelEvent.DOM_DELTA_LINE ? fY : e.deltaMode === WheelEvent.DOM_DELTA_PAGE ? n === "y" ? t.clientHeight : t.clientWidth : 1;
}
function yY(e, t) {
	if ((t === "y" ? e.scrollHeight - e.clientHeight : e.scrollWidth - e.clientWidth) <= 1) return !1;
	let n = e === document.scrollingElement, r = getComputedStyle(n ? document.documentElement : e), i = t === "y" ? r.overflowY : r.overflowX;
	return n ? i !== "hidden" && i !== "clip" : (i === "auto" || i === "scroll") && r.getPropertyValue(eY).trim() !== "none";
}
function bY(e) {
	if (e === document.scrollingElement) return PY(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
	let t = e.getBoundingClientRect(), n = e instanceof HTMLElement ? e : null, r = xY(t.width, n?.offsetWidth), i = xY(t.height, n?.offsetHeight), a = t.left + e.clientLeft * r, o = t.top + e.clientTop * i;
	return PY(a, o, a + e.clientWidth * r, o + e.clientHeight * i);
}
function xY(e, t) {
	return t === void 0 || t <= 0 || e <= 0 ? 1 : e / t;
}
function SY(e) {
	let t = bY(e);
	if (e === document.scrollingElement) return t;
	let n = Number.parseFloat(getComputedStyle(e).getPropertyValue(tY));
	return n > 0 ? MY(e) ? PY(t.left - n, t.top, t.right, t.bottom) : PY(t.left, t.top, t.right + n, t.bottom) : t;
}
function CY(e) {
	let t = SY(e);
	for (let n = e; n !== null && n !== document.documentElement; n = n.parentElement) {
		let r = getComputedStyle(n);
		if (n !== e && (r.overflowX !== "visible" || r.overflowY !== "visible") && (t = FY(t, wY(n, r))), r.position === "fixed" || n.matches(":popover-open, dialog:modal")) break;
	}
	return t = FY(t, PY(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight)), t.width > 0 && t.height > 0 ? t : null;
}
function wY(e, t) {
	let n = bY(e), r = Number.parseFloat((t.overflowClipMargin ?? "").split(" ").at(-1) ?? "") || 0, i = t.overflowX === "visible" ? Infinity : t.overflowX === "clip" ? r : 0, a = t.overflowY === "visible" ? Infinity : t.overflowY === "clip" ? r : 0;
	return PY(n.left - i, n.top - a, n.right + i, n.bottom + a);
}
function TY(e, t, n, r) {
	let i = MY(e), a = OY(e, t, n, r, i), o = a.max > 0 ? jY(e, t) / a.max * (a.length - a.thumb) : 0;
	return t === "y" ? {
		left: i ? n.left : n.right - nY,
		top: a.start + o,
		width: nY,
		height: a.thumb
	} : {
		left: i ? a.start + a.length - a.thumb - o : a.start + o,
		top: n.bottom - nY,
		width: a.thumb,
		height: nY
	};
}
function EY(e, t, n, r) {
	let i = MY(e), a = OY(e, t, n, r, i);
	if (a.arrow === 0) return null;
	if (t === "y") {
		let e = i ? n.left : n.right - nY;
		return {
			back: {
				left: e,
				top: a.start - aY,
				width: nY,
				height: aY
			},
			forward: {
				left: e,
				top: a.start + a.length,
				width: nY,
				height: aY
			}
		};
	}
	let o = n.bottom - nY;
	return {
		back: {
			left: a.start - aY,
			top: o,
			width: aY,
			height: nY
		},
		forward: {
			left: a.start + a.length,
			top: o,
			width: aY,
			height: nY
		}
	};
}
function DY(e, t, n, r) {
	return (t === "y" ? e.height : e.width) - r - 4 - (n ? nY : 0) >= oY ? aY : 0;
}
function OY(e, t, n, r, i) {
	let a = t === "y" ? kY(e) : {
		top: 0,
		bottom: 0
	}, o = DY(n, t, r, a.top + a.bottom), s = (t === "y" ? n.top + a.top : n.left) + rY + o + (r && i && t === "x" ? nY : 0), c = (t === "y" ? n.height - a.top - a.bottom : n.width) - 4 - 2 * o - (r ? nY : 0), l = t === "y" ? e.clientHeight : e.clientWidth, u = t === "y" ? e.scrollHeight : e.scrollWidth;
	return {
		start: s,
		length: c,
		thumb: Math.min(c, Math.max(iY, c * l / u)),
		max: u - l,
		arrow: o
	};
}
function kY(e) {
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
function AY(e, t, n, r) {
	return r ? -(e - t * n) : e + t * n;
}
function jY(e, t) {
	return t === "y" ? e.scrollTop : Math.abs(e.scrollLeft);
}
function MY(e) {
	return getComputedStyle(e).direction === "rtl";
}
function NY(e, t, n) {
	Object.assign(e.style, {
		left: `${t.left - n.left}px`,
		top: `${t.top - n.top}px`,
		width: `${t.width}px`,
		height: `${t.height}px`
	});
}
function PY(e, t, n, r) {
	return {
		left: e,
		top: t,
		right: n,
		bottom: r,
		width: Math.max(0, n - e),
		height: Math.max(0, r - t)
	};
}
function FY(e, t) {
	return PY(Math.max(e.left, t.left), Math.max(e.top, t.top), Math.min(e.right, t.right), Math.min(e.bottom, t.bottom));
}
//#endregion
//#region src/interactions/refusal-engine.ts
var IY = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"Home",
	"End",
	"PageUp",
	"PageDown"
]), LY = [
	"click",
	"dblclick",
	"auxclick",
	"dragstart"
], RY = `.${bi}, .${xi}`, zY = RegExp(`(^|\\s)(${bi}|${xi})(\\s|$)`), BY = RegExp(`(^|\\s)${Si}(\\s|$)`), VY = "[type='range']", HY = /* @__PURE__ */ new WeakSet(), UY = /* @__PURE__ */ new WeakSet();
function WY(e = document) {
	let t = e === document ? window : e;
	for (let e of LY) t.addEventListener(e, QY, !0);
	t.addEventListener("keydown", eX, !0), t.addEventListener("change", tX, !0), t.addEventListener("pointerdown", nX, !0), t.addEventListener("mousedown", nX, !0), YY(e.querySelectorAll(RY)), qY(e.querySelectorAll(`[${yi}]`)), KY(e.querySelectorAll(VY)), new MutationObserver((e) => {
		for (let t of e) GY(t);
	}).observe(e, {
		subtree: !0,
		childList: !0,
		attributes: !0,
		attributeFilter: ["class", yi],
		attributeOldValue: !0
	});
}
function GY(e) {
	if (e.type === "attributes") {
		let t = e.target;
		if (e.attributeName === "data-ui-href") {
			JY(t, e.oldValue !== null);
			return;
		}
		let n = zY.test(e.oldValue ?? ""), r = t.matches(RY);
		n !== r && (XY(t, r), JY(t)), BY.test(e.oldValue ?? "") !== t.matches(".ui-readonly") && KY(t.querySelectorAll(VY));
		return;
	}
	let t = (e.target instanceof Element ? e.target : null)?.matches(RY) === !0;
	for (let n of e.addedNodes) n instanceof Element && (t && ZY(n), n.matches(RY) && XY(n, !0), YY(n.querySelectorAll(RY)), JY(n), qY(n.querySelectorAll(`[${yi}]`)), KY([n, ...n.querySelectorAll(VY)]));
}
function KY(e) {
	for (let t of e) {
		if (!(t instanceof HTMLInputElement) || t.type !== "range") continue;
		let e = M(t);
		e !== HY.has(t) && (e ? (HY.add(t), t.addEventListener("touchstart", nX, { passive: !1 })) : (HY.delete(t), t.removeEventListener("touchstart", nX)));
	}
}
function qY(e) {
	for (let t of e) JY(t);
}
function JY(e, t = !1) {
	let n = e.getAttribute(yi);
	(n !== null || t) && (e.matches(RY) ? (e.removeAttribute("href"), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0")) : n === null || !Xa(n) ? e.removeAttribute("href") : e.getAttribute("href") !== n && (e.setAttribute("href", n), e.getAttribute("tabindex") === "0" && e.removeAttribute("tabindex")));
}
function YY(e) {
	for (let t of e) XY(t, !0);
}
function XY(e, t) {
	for (let n of e.children) t ? ZY(n) : UY.has(n) && (UY.delete(n), n.removeAttribute("inert"));
}
function ZY(e) {
	e.hasAttribute("inert") || (UY.add(e), e.setAttribute("inert", ""));
}
function QY(e) {
	e.target instanceof Element && (A(e.target) ? (e.type === "click" && Lg(e), rX(e)) : e.type === "click" && $Y(e.target) && e.preventDefault());
}
function $Y(e) {
	return e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio") && M(e);
}
function eX(e) {
	e instanceof KeyboardEvent && e.target instanceof Element && ((e.key === "Enter" || e.key === " ") && A(e.target) ? rX(e) : IY.has(e.key) && e.target instanceof HTMLInputElement && (e.target.type === "range" || e.target.type === "radio") && M(e.target) && e.preventDefault());
}
function tX(e) {
	e.target instanceof HTMLInputElement && e.target.type === "range" && M(e.target) && e.stopImmediatePropagation();
}
function nX(e) {
	e.target instanceof HTMLInputElement && e.target.type === "range" && M(e.target) && (e.preventDefault(), e.target.focus({ preventScroll: !0 }));
}
function rX(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region src/interactions/popup-service.ts
var iX = /* @__PURE__ */ new WeakMap(), aX = /* @__PURE__ */ new WeakSet(), oX = /* @__PURE__ */ new WeakSet(), sX = new M_({
	show: () => void 0,
	hide: ({ popup: e }, t) => {
		let n = iX.get(e);
		iX.delete(e), t !== void 0 && n?.(t);
	},
	single: !1,
	isInside: ({ popup: e, anchor: t }, n) => n.includes(e) || t !== void 0 && n.includes(t),
	onPress: !0,
	closesOnTab: ({ popup: e }) => aX.has(e),
	sheetOnPhone: ({ popup: e }) => oX.has(e)
});
function cX(e) {
	return {
		open: (e, t, n) => lX(e, t, n, (e) => sX.open(e)),
		openList: uX,
		listKey: qN,
		followPointer: XN,
		focusReturn: (t) => Hp(t, e)
	};
}
function lX(e, t, n, r) {
	let i = n.owner ?? (e instanceof HTMLElement ? e : t), a = () => sX.popupOf(i) === t;
	return iX.set(t, n.onDismiss), n.closesOnTab === !0 ? aX.add(t) : aX.delete(t), n.sheetOnPhone === !0 ? oX.add(t) : oX.delete(t), r({
		owner: i,
		popup: t,
		anchor: e,
		placement: n
	}) || (iX.delete(t), queueMicrotask(() => n.onDismiss("owner"))), {
		reposition: () => {
			a() && sX.reposition(i);
		},
		close: () => {
			a() && sX.close(i);
		}
	};
}
function uX(e, t, n) {
	return lX(e, t, {
		...n,
		closesOnTab: !0
	}, (e) => KN(sX, e, n.entries, n.checked, n.fromEnd, n.focus));
}
//#endregion
//#region src/rendering/series-colors.ts
var dX = "--ui-color-series-count", fX = "--ui-color-series-", pX = 8;
function mX(e) {
	let t = Number(getComputedStyle(e).getPropertyValue(dX));
	return Number.isFinite(t) && t >= 1 ? Math.floor(t) : pX;
}
function hX(e, t) {
	return `var(${fX}${e % t + 1})`;
}
var gX = {
	count: mX,
	color: hX
}, _X = ".ui-items-view", vX = `:scope > [${x}]`, yX = `:scope > [${It}]`, bX = "ui-orientation--horizontal", xX = 1, SX = [{
	edge: "first",
	holder: `:scope > [${Vt}="${Ut}"]`,
	bound: `${Je}first-visible-key`,
	attribute: ft
}, {
	edge: "last",
	holder: `:scope > [${Vt}="${Wt}"]`,
	bound: `${Je}last-visible-key`,
	attribute: pt
}], CX = class {
	root;
	views = /* @__PURE__ */ new Set();
	waiting = /* @__PURE__ */ new Map();
	sized = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, H(this.root, _X, { childList: !0 }, (e) => this.findEach(e));
		let t = this.root.querySelectorAll(`[${Vt}="${Ut}"], [${Vt}="${Wt}"]`);
		this.findEach(new Set(Array.from(t, (e) => e.parentElement).filter((e) => e !== null))), this.root.addEventListener("scroll", (e) => this.handleScroll(e), {
			capture: !0,
			passive: !0
		});
	}
	findEach(e) {
		for (let t of e) wX(t) ? (this.views.add(t), this.watchHost(t), this.schedule(t)) : this.views.has(t) && this.forget(t);
	}
	watchHost(e) {
		let t = e.querySelector(vX), n = this.sized.get(e);
		if (n?.host === t) return;
		if (n?.stop(), t === null) {
			this.sized.delete(e);
			return;
		}
		let r = NB(t, () => this.schedule(e)), i = new MutationObserver((n) => {
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
		let t = e.isConnected ? TX(e) : [];
		if (t.length === 0) {
			this.forget(e);
			return;
		}
		let n = e.querySelector(vX);
		if (n === null || A(t[0].holder)) return;
		let r = DX(e, n);
		for (let { holder: e, edge: n, attribute: i } of t) {
			let t = EX(r, n);
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
function wX(e) {
	return TX(e).length > 0;
}
function TX(e) {
	let t = [];
	for (let { holder: n, bound: r, edge: i, attribute: a } of SX) {
		let o = e.querySelector(n);
		o?.hasAttribute(r) === !0 && t.push({
			holder: o,
			edge: i,
			attribute: a
		});
	}
	return t;
}
function EX(e, t) {
	if (e === null) return null;
	let { rows: n, band: r } = e;
	if (!(r.end - r.start <= xX)) return (t === "first" ? PX(n, r) : FX(n, r)) ?? void 0;
}
function DX(e, t) {
	let n = e.classList.contains(bX), r = n && getComputedStyle(t).direction === "rtl", i = [], a = !1;
	for (let e of t.children) {
		let t = e.getAttribute(b);
		if (t === null || e.hasAttribute("data-ui-group-header")) continue;
		a = !0;
		let o = ld(e);
		!e.classList.contains("ui-hidden") && (o.width > 0 || o.height > 0) && i.push({
			key: t,
			...OX(o, n, r)
		});
	}
	return a ? {
		rows: i,
		band: kX(t, n, r)
	} : null;
}
function OX(e, t, n) {
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
function kX(e, t, n) {
	let r = id(e), i = OX(AX(r, getComputedStyle(r)), t, n);
	for (let e = r.parentElement; e !== null; e = e.parentElement) {
		let r = getComputedStyle(e);
		(t ? r.overflowX : r.overflowY) !== "visible" && (i = MX(i, OX(AX(e, null), t, n)));
	}
	return i = MX(i, OX({
		left: 0,
		top: 0,
		right: window.innerWidth,
		bottom: window.innerHeight
	}, t, n)), NX(e, i, t, n);
}
function AX(e, t) {
	let n = e.getBoundingClientRect(), r = n.left + e.clientLeft, i = n.top + e.clientTop;
	return {
		left: r + jX(t?.paddingLeft),
		top: i + jX(t?.paddingTop),
		right: r + e.clientWidth - jX(t?.paddingRight),
		bottom: i + e.clientHeight - jX(t?.paddingBottom)
	};
}
function jX(e) {
	let t = e === void 0 ? NaN : parseFloat(e);
	return Number.isFinite(t) ? t : 0;
}
function MX(e, t) {
	return {
		start: Math.max(e.start, t.start),
		end: Math.min(e.end, t.end)
	};
}
function NX(e, t, n, r) {
	let i = t.start;
	for (let t of e.querySelectorAll(yX)) {
		let e = OX(t.getBoundingClientRect(), n, r);
		e.start <= i + xX && e.end > i && getComputedStyle(t).position === "sticky" && (i = e.end);
	}
	return {
		start: i,
		end: t.end
	};
}
function PX(e, t) {
	for (let n of e) if (IX(n, t)) return n.key;
	return null;
}
function FX(e, t) {
	for (let n = e.length - 1; n >= 0; n--) if (IX(e[n], t)) return e[n].key;
	return null;
}
function IX(e, t) {
	return e.key.length > 0 && e.end > t.start + xX && e.start < t.end - xX;
}
//#endregion
//#region src/items/item-rows.ts
function LX(e, t, n) {
	return {
		itemOf: (e) => t.getItemValue(e),
		itemsOf: (e) => n.itemsOf(e),
		itemsVersion: (e) => n.itemsVersion(e),
		readPath: mk,
		renderVariant: (n, r, i) => {
			let a = e.getVariantTemplate(r, i), o = t.getItemScope(n);
			return a === void 0 || o === void 0 ? null : t.renderFromTemplate(a, o.item, t.getAncestorStack(n));
		},
		isKeyTarget: (e) => lf(e) !== null,
		cellsOf: (e) => {
			let t = e.closest(L);
			return t !== null && yf(t) ? Sf(t, e) : [];
		},
		moveCursor: (e, t) => Pf(e, t ?? null)
	};
}
//#endregion
//#region src/updates/shown-words.ts
function RX(e, t) {
	let n = da(e.kind);
	return n === "Markup" ? !t.hasAttribute(zi) : n === "Attribute" && e.name === "data-ui-tooltip" || e.converter === "inlineMarkupPlainText";
}
var zX = class {
	phrase;
	converters;
	words = null;
	operation = null;
	converted;
	constructor(e, t) {
		this.phrase = e, this.converters = t;
	}
	get value() {
		return this.words ??= k.translate(this.phrase.key, this.phrase.args, !0), this.words;
	}
	convertedFor(e) {
		return this.operation !== e && (this.operation = e, this.converted = this.converters.convert(e.converter, this.value)), this.converted;
	}
};
function BX(e, t) {
	return O(e) ? new zX(e, t) : null;
}
//#endregion
//#region src/items/items-template-renderer.ts
var VX = class {
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
		let c = this.metadata.getItemsTemplateMetadata(e), l = c?.itemWrapperElementName ? WX(o, c.itemWrapperElementName, c.itemWrapperClassName ?? null, c.itemWrapperRole ?? null) : o;
		l !== o && this.moveItemScope(o, l), GX(l, n, t);
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
		let i = UX(r.item, t, n);
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
			HX(n, e) && this.applyBoundAttribute(i, n, e, t);
		}
	}
	findTranslatableRowBindings() {
		let e = [];
		for (let t of this.metadata.metadata.bindings) {
			let n = this.metadata.getPropertyDefinition(t.propertyId);
			if (n === void 0 || typeof t.itemTemplate != "string" || !this.metadata.isTranslatable(t)) continue;
			let r = E(t.bindingId);
			e.push([t, `[${Je}${Xi(n.propertyName)}="${Yi(r)}"]`]);
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
		let r = XX(t, n.templateKeyPropertyName);
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
		i !== void 0 && !uk(e, i.itemTemplateParameters, n) && this.applyBoundAttribute(e, i, n);
	}
	applyBoundAttribute(e, t, n, r) {
		let i = E(t.bindingId), a = this.metadata.getPropertyDefinition(t.propertyId);
		if (a === void 0) return;
		let o = t.itemTemplate === null || t.itemTemplate === void 0 ? this.state.has(t, []) ? {
			ok: !0,
			value: this.state.get(t, [])
		} : { ok: !1 } : lk(n, t.itemTemplate, t.itemTemplateParameters);
		if (!o.ok) {
			t.optional !== !0 && !this.unresolved.has(i) && (this.unresolved.add(i), s("item binding value could not be resolved; the item's path stops short of the property.", {
				binding: t,
				stack: n
			}));
			return;
		}
		let c = "scope" in o ? o.scope : void 0, l = o.value ?? t.fallbackValue;
		if (r !== void 0 && !r(l)) return;
		let u = Jc(l, () => this.metadata.isTranslatable(t) && !dk(c)), d = BX(l, this.extensions.converters), f = E(t.componentId), p = e.closest(this.componentSelector(f));
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
			let n = $i(p, t, () => [e])[0] ?? null;
			n !== null && (d !== null && RX(t, n) ? this.operations.apply({
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
function HX(e, t) {
	for (let n of e.itemTemplateParameters ?? []) {
		let e = E(n.componentId);
		if (e > 0 && !t.some((t) => t.scopeComponentId === e)) return !1;
	}
	return !0;
}
function UX(e, t, n) {
	if (t.length === 0) return n;
	let r = e;
	for (let n = 0; n < t.length - 1; n++) {
		let i = t[n], a = i.kind === "property" ? hk(r, i.name) : bk(r, i.key);
		if (!a.ok) return e;
		r = a.value;
	}
	if (typeof r != "object" || !r) return e;
	let i = t[t.length - 1];
	if (i.kind === "element") return xk(r, i.key, n), e;
	let a = r;
	return a[_k(a, i.name)] = n, e;
}
function WX(e, t, n, r) {
	let i = document.createElement(t);
	return n !== null && (i.className = n), r !== null && r.length > 0 && i.setAttribute("role", r), i.appendChild(e), i;
}
function GX(e, t, n) {
	e.setAttribute(b, t), YX(e, n), qX(e, n);
}
var KX = [
	["CanSelect", oe],
	["CanDrag", se],
	["CanRemove", ce],
	["CanRename", le],
	["CanShowContextMenu", ue]
];
function qX(e, t) {
	for (let [n, r] of KX) {
		let i = hk(t, n);
		e.toggleAttribute(r, i.ok && i.value === !1);
	}
}
function JX(e, t) {
	let n = e.getAttribute(b), r = e.closest(`[${x}]`);
	if (qX(e, t), n !== null) for (let i of e.querySelectorAll(`[${b}="${Yi(n)}"]`)) i.closest("[data-ui-items-host]") === r && qX(i, t);
}
function YX(e, t) {
	let n = hk(t, "Group");
	n.ok && typeof n.value == "string" ? e.setAttribute(Rt, n.value) : e.removeAttribute(Rt);
}
function XX(e, t) {
	if (t == null || t.trim().length === 0) return null;
	let n = hk(e, t);
	return !n.ok || n.value === null || n.value === void 0 ? null : typeof n.value == "string" ? n.value : String(n.value);
}
//#endregion
//#region src/items/items-rule-watcher.ts
var ZX = "Group", QX = class {
	options;
	dragged = null;
	deferred = /* @__PURE__ */ new Map();
	readerHeld = /* @__PURE__ */ new Map();
	answering = [];
	drawnByHost = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, e.propertyPatchEngine.addValueChangeHandler((e) => this.handleItemValueChange(e));
		for (let t of e.metadata.metadata.itemsFilterSort) {
			let n = E(t.componentId), r = [...t.filters, ...t.sorts], i = () => this.syncComponentHosts(n);
			for (let t of r) t.source !== null && t.source !== void 0 && e.reactiveSources.watch(t.source, i);
		}
		e.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), e.root.addEventListener("dragend", () => this.land(), !0), e.root.addEventListener("focusout", () => this.handleFocusOut(), !0), H(e.root, `[${Vt}="${Ht}"]`, { attributeFilter: [dt] }, (e) => {
			for (let t of e) {
				let e = Ha(t);
				e !== null && this.syncComponentHosts(e);
			}
		}), H(e.root, `[${Gt}="windowed"]`, { attributeFilter: [an] }, (e) => {
			for (let t of e) {
				let e = Ha(t);
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
			for (let [t, n] of e) t.isConnected && wG(t, n, this.options);
		});
	}
	handleFocusOut() {
		this.readerHeld.size !== 0 && window.setTimeout(() => {
			for (let [e, t] of [...this.readerHeld]) $X(t.row) || (this.readerHeld.delete(e), e.isConnected && this.sync(e, t.componentId));
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
		for (let e of t) n.some((t) => eZ(t, e)) || this.handleItemValueChange(e);
	}
	handleItemValueChange(e) {
		if (e.dynamicParameters.length === 0) return;
		let t = this.options.metadata.getBindingByComponentAndPropertyId(E(e.reference.componentId), e.reference.propertyId), n = t === void 0 ? null : yk(t);
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
			let a = i.closest(w);
			a !== null && this.drawsPatchedComponent(a, E(e.reference.componentId), t) && tZ(a, e.dynamicParameters) && (r = this.applyVirtualizedValue(i, D(a), n, t, e.value) || r);
		}
		return r;
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
		let r = this.readerHeld.get(e)?.row ?? null, i = n !== null && $X(n) ? n : r !== null && $X(r) ? r : null;
		i === null ? (this.readerHeld.delete(e), wG(e, t, this.options)) : this.readerHeld.set(e, {
			componentId: t,
			row: i
		});
	}
	findAddressedItemRoots(e) {
		let t = e[e.length - 1];
		return typeof t == "string" ? [...this.options.root.querySelectorAll(`[${b}="${Yi(t)}"]`)].filter((t) => this.isItemRoot(t) && Ma(t, e)) : [];
	}
	applyItemValue(e, t, n) {
		let r = e.closest(`[${x}]`), i = r === null ? null : Ha(r);
		if (r !== null && i !== null && RO(r) === "virtualized") {
			let a = e.getAttribute(b);
			a !== null && this.applyVirtualizedValue(r, i, a, t, n);
			return;
		}
		this.options.renderer.updateItemValue(e, t.steps, n);
		let a = nZ(ZX, t);
		a && YX(e, this.options.renderer.getItemValue(e)), this.restampAbilities(e, t), r !== null && i !== null && (a || this.feedsRule(r, i, t)) && this.sync(r, i, e);
	}
	restampAbilities(e, t) {
		KX.some(([e]) => nZ(e, t)) && JX(e, this.options.renderer.getItemValue(e));
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
		if (this.options.templates.getGroupTemplate(t) !== void 0 && nZ(ZX, n)) return !0;
		let r = this.options.metadata.getItemsFilterSortMetadata(t);
		if (r !== void 0 && (r.filters.some((e) => nZ(e.itemProperty, n)) || r.sorts.some((e) => nZ(e.itemProperty, n)))) return !0;
		let i = wk(e);
		return (i?.filters ?? []).some((e) => nZ(e.itemProperty, n)) || (i?.sorts ?? []).some((e) => nZ(e.itemProperty, n));
	}
	syncComponentHosts(e) {
		for (let t of this.options.root.querySelectorAll(`[${x}]`)) {
			let n = Ha(t);
			n === e && this.sync(t, n);
		}
	}
};
function $X(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t);
}
function eZ(e, t) {
	let n = ga(e), r = n === "Value" ? !Jp(e.value ?? null, t.value) : n === "Validation" && (e.message ?? null) !== null, i = e.address, a = i?.component?.dynamicParameters ?? [];
	return r && E(i?.component?.id) === E(t.reference.componentId) && ha(i?.property) === t.propertyName && a.length <= t.dynamicParameters.length && a.every((e, n) => String(e ?? "") === String(t.dynamicParameters[n] ?? ""));
}
function tZ(e, t) {
	let n = ja(e, Aa(e));
	return t.length === n.length + 1 && n.every((e, n) => String(e ?? "") === String(t[n] ?? ""));
}
function nZ(e, t) {
	let n = t.ruleSegments.join(".");
	return n.length === 0 || e === n || e.startsWith(`${n}.`);
}
//#endregion
//#region src/items/table-row-indices.ts
var rZ = "ui-table", iZ = "ui-table--no-header";
function aZ(e, t, n) {
	let r = e.parentElement, i = r?.parentElement ?? null;
	if (r === null || i === null || !r.classList.contains("ui-table__scroll") || !i.classList.contains(rZ)) return;
	let a = [], o = [], s = !1;
	for (let t of r.children) t === e ? s = !0 : t.getAttribute("role") === "row" && !(t === r.firstElementChild && i.classList.contains(iZ)) && (s ? o : a).push(t);
	a.forEach((e, t) => oZ(e, t));
	for (let [e, n] of t) oZ(e, a.length + n);
	n !== null && o.forEach((e, t) => oZ(e, a.length + n + t)), T(i, "aria-rowcount", n === null ? "-1" : String(a.length + n + o.length));
}
function oZ(e, t) {
	T(e, "aria-rowindex", String(t + 1));
}
//#endregion
//#region src/items/items-window-engine.ts
var sZ = 50, cZ = 1, lZ = .5, uZ = 60, dZ = "--ui-window-look", fZ = "--ui-window-row", pZ = "--ui-window-tile", mZ = 3, hZ = "page", gZ = class {
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
			this.noteShownRow(t), this.layout(t), kZ(t) === 0 ? this.getState(t).pending || this.requestAsync(t, AZ(t), 0, null, !1) : n ? this.revealWindow(t) : (this.realign(t), this.considerRequest(t));
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
		t !== null && (sd(e, t), this.noteShownRow(e));
	}
	windowTop(e) {
		if (e.hasAttribute("data-ui-window-paged")) return null;
		let t = BO(e, en);
		return t !== null && bJ(e) && VO(e, "data-ui-window-more-after") ? Math.max(0, this.windowBottom(e, t) - od(e).height) : t === null || t === 0 ? null : VO(e, "data-ui-window-more-after") ? t * this.getState(e).itemSize : e.scrollHeight;
	}
	windowBottom(e, t) {
		let n = OZ(e), r = this.getState(e).itemSize, i = n.length === 0 ? 0 : ld(n[n.length - 1]).bottom - ld(n[0]).top;
		return t * r + (i > 0 ? i : n.length * r);
	}
	noteShownRow(e) {
		this.getState(e).shown = EZ(e, OZ(e));
	}
	noteShownRows() {
		for (let e of this.held) e.isConnected ? e.hasAttribute("data-ui-window-paged") || this.noteShownRow(e) : this.held.delete(e);
	}
	sync(e) {
		if (e.length !== 0) for (let t of this.hosts()) e.some((e) => e.contains(t) || t.contains(e)) && (this.layout(t), !this.getState(t).pending && (kZ(t) === 0 && e.some((e) => t.contains(e)) ? this.requestAsync(t, AZ(t), 0, null, !1) : this.realign(t)));
	}
	realign(e) {
		let t = BO(e, en), n = OZ(e);
		if (t === null || n.length === 0 || e.hasAttribute("data-ui-window-paged")) return;
		let r = this.getState(e), i = od(e), a = Math.floor(i.top / r.itemSize);
		Math.ceil((i.top + i.height) / r.itemSize) >= t && a <= t + n.length || this.revealWindow(e);
	}
	refilled(e) {
		let t = this.states.get(e);
		t !== void 0 && !t.pending && yZ(t);
	}
	reconsider() {
		for (let e of this.hosts()) this.noteShownRow(e), this.considerRequest(e);
	}
	async requestOffsetAsync(e, t) {
		RO(e) === "windowed" && await this.requestAsync(e, "Offset", Math.max(0, Math.floor(t)), null, !1);
	}
	hosts() {
		return [...this.root.querySelectorAll(`[${x}][${Gt}="windowed"]`)];
	}
	handleScroll(e) {
		let t = ad(e.target);
		if (t === null || RO(t) !== "windowed" || t.hasAttribute("data-ui-window-paged")) return;
		let n = this.getState(t);
		n.scheduled === 0 && (this.considerRequest(t), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.considerRequest(t);
		}, uZ));
	}
	considerRequest(e) {
		let t = this.getState(e);
		if (t.pending) {
			t.restless = !0;
			return;
		}
		if (e.hasAttribute("data-ui-window-paged") && kZ(e) > 0) return;
		let n = OZ(e);
		if (n.length === 0) {
			this.requestAsync(e, AZ(e), 0, null, !1);
			return;
		}
		let r = BO(e, en), i = VO(e, nn), a = VO(e, rn);
		if (r !== null) {
			let o = this.windowSize(e), s = od(e), c = Math.max(1, Math.round(s.height * cZ / t.itemSize), Math.floor(o * lZ)), l = Math.floor(s.top / t.itemSize), u = Math.ceil((s.top + s.height) / t.itemSize);
			if (u < r || l > r + n.length) {
				this.requestAsync(e, "Offset", this.landingOffset(e, l, o), null, !1);
				return;
			}
			if (l - c <= r && i) {
				this.requestAsync(e, "Before", 0, jZ(n[0]), !0);
				return;
			}
			if (u + c >= r + n.length && a) {
				this.requestAsync(e, "After", 0, jZ(n[n.length - 1]), !0);
				return;
			}
			return;
		}
		let o = od(e), s = Math.max(1, o.height * cZ), c = o.contentHeight - o.top - o.height;
		o.top <= s && i ? this.requestAsync(e, "Before", 0, jZ(n[0]), !0) : c <= s && a && this.requestAsync(e, "After", 0, jZ(n[n.length - 1]), !0);
	}
	landingOffset(e, t, n) {
		let r = Math.max(0, t - Math.floor(n / 4)), i = BO(e, tn);
		return i === null ? r : Math.min(r, Math.max(0, i - n));
	}
	async requestAsync(e, t, n, r, i) {
		let a = Ha(e);
		if (a === null) {
			s("a windowed items host is not inside an addressable component.", e);
			return;
		}
		if (r === null && (t === "Before" || t === "After")) return;
		let o = this.getState(e);
		o.pending = !0, o.readingBefore = t === "Before", (t === "Start" || t === "End") && yZ(o);
		let c = e.closest(w), l = t.toLowerCase();
		e.setAttribute(Zt, l), c?.setAttribute(Zt, e.hasAttribute("data-ui-window-paged") ? hZ : l), e.setAttribute("aria-busy", "true"), t === "After" && BO(e, "data-ui-window-total") === null && bZ(e) && (dG(e, lG, mZ * this.rowSize(e)), xZ(e, o));
		let u = BO(e, en) === null;
		try {
			await this.options.requestWindow({
				componentId: a,
				dynamicParameters: MZ(e),
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
			o.pending = !1, e.removeAttribute(Zt), c?.removeAttribute(Zt), e.removeAttribute("aria-busy"), dG(e, lG, 0), this.noteShownRow(e), this.layout(e), o.readingBefore = !1;
			let n = o.restless;
			o.restless = !1, (n || u && CZ(e, t, r)) && kZ(e) > 0 ? this.considerRequest(e) : this.realign(e);
		}
	}
	layout(e) {
		let t = this.getState(e), n = OZ(e), r = BO(e, tn), i = BO(e, en);
		if (aZ(e, n.map((e, t) => [e, (i ?? 0) + t]), r), e.hasAttribute("data-ui-window-paged")) {
			dG(e, "top", 0), dG(e, cG, 0);
			return;
		}
		if (n.length > 0) {
			let r = ld(n[n.length - 1]).bottom - ld(n[0]).top;
			if (r > 0) {
				let i = _Z(n), a = Math.ceil(n.length / i);
				e.clientWidth !== t.measuredWidth && (yZ(t), t.measuredWidth = e.clientWidth), vZ(t, n, i), t.skeletonRow = a > 1 ? (ld(n[n.length - 1]).top - ld(n[0]).top) / (a - 1) : r, t.skeletonTile = i > 1 ? ld(n[1]).left - ld(n[0]).left : null;
			}
		}
		let a = r === null || i === null ? 0 : i * t.itemSize, o = r === null || i === null ? 0 : Math.max(0, r - i - n.length) * t.itemSize;
		dG(e, "top", a), dG(e, cG, o), xZ(e, t), (t.readingBefore || !wZ(e)) && TZ(e, n, t.shown), sJ(e);
	}
	rowSize(e) {
		let t = this.getState(e);
		return t.skeletonRow > 0 ? SZ(t.skeletonRow) : t.itemSize;
	}
	windowSize(e) {
		let t = BO(e, $t);
		return t !== null && t > 0 ? t : sZ;
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
function _Z(e) {
	let t = ld(e[0]).top, n = 1;
	for (; n < e.length && ld(e[n]).top === t;) n++;
	return n;
}
function vZ(e, t, n) {
	for (let r = 0; r < t.length; r++) {
		let i = t[r + n], a = i === void 0 ? t.length <= n ? ld(t[r]).height : 0 : ld(i).top - ld(t[r]).top;
		if (a <= 0) continue;
		let o = a / n;
		hG(e.sizes, e.shares.get(t[r]) ?? null, o), e.shares.set(t[r], o);
	}
	e.sizes.count > 0 && (e.itemSize = Math.max(1, e.sizes.sum / e.sizes.count));
}
function yZ(e) {
	e.shares = /* @__PURE__ */ new WeakMap(), e.sizes = {
		sum: 0,
		count: 0
	};
}
function bZ(e) {
	return getComputedStyle(e).getPropertyValue(dZ).trim() === "skeleton";
}
function xZ(e, t) {
	if (t.skeletonRow <= 0) return;
	let n = `${SZ(t.skeletonRow)}px`, r = t.skeletonTile !== null && t.skeletonTile > 0 ? `${SZ(t.skeletonTile)}px` : "";
	for (let t of e.querySelectorAll(`:scope > [${Xt}]`)) {
		let e = t.style;
		e.getPropertyValue(fZ) !== n && e.setProperty(fZ, n), e.getPropertyValue(pZ) !== r && (r.length === 0 ? e.removeProperty(pZ) : e.setProperty(pZ, r));
	}
}
function SZ(e) {
	return Math.round(e * 100) / 100;
}
function CZ(e, t, n) {
	let r = OZ(e), i = t === "Before" ? r[0] : t === "After" ? r[r.length - 1] : void 0;
	return i !== void 0 && jZ(i) !== n;
}
function wZ(e) {
	let t = BO(e, en);
	return od(e).top <= 0 && (t === null ? !VO(e, "data-ui-window-more-before") : t === 0);
}
function TZ(e, t, n) {
	let r = n === null ? void 0 : t.find((e) => jZ(e) === n.key);
	if (n === null || r === void 0) return;
	let i = ld(r);
	if (i.height <= 0) return;
	let a = od(e).top, o = i.top - DZ(e) + a - n.at;
	Math.abs(o) >= .5 && sd(e, a + o);
}
function EZ(e, t) {
	let n = DZ(e), r = 0, i = t.length;
	for (; r < i;) {
		let e = Math.floor((r + i) / 2);
		ld(t[e]).bottom > n ? i = e : r = e + 1;
	}
	let a = t.at(r), o = a === void 0 ? null : jZ(a);
	if (a === void 0 || o === null) return null;
	let s = ld(a), c = od(e);
	return s.height <= 0 || s.top >= n + c.height ? null : {
		key: o,
		at: s.top - n + c.top
	};
}
function DZ(e) {
	let t = id(e);
	return t.getBoundingClientRect().top + t.clientTop;
}
function OZ(e) {
	return [...e.children].filter((e) => e.hasAttribute(b));
}
function kZ(e) {
	return OZ(e).length;
}
function AZ(e) {
	return bJ(e) ? "End" : "Start";
}
function jZ(e) {
	return e.getAttribute(b);
}
function MZ(e) {
	let t = e.closest(w);
	return t === null ? [] : ja(t, Aa(t));
}
//#endregion
//#region src/items/items-composite-renderer.ts
var NZ = [
	y,
	ie,
	ae
];
function PZ(e, t, n, r, i, a, o) {
	let c = document.createElement(e.itemElementName);
	c.className = e.itemClassName, FZ(c, e.itemRole);
	let l = LZ(c, e, t, a);
	l !== 0 && o.populateElement(c, n, l, i);
	for (let l of e.slots) {
		let e = IZ(l, t, n, a);
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
		d.className = l.wrapperClassName, FZ(d, l.wrapperRole);
		for (let [e, t] of Object.entries(l.wrapperAttributes ?? {})) d.setAttribute(e, t);
		d.appendChild(u), GX(d, r, n), c.appendChild(d);
	}
	return GX(c, r, n), o.registerItemScope(c, l, n), c;
}
function FZ(e, t) {
	t != null && t.length > 0 && e.setAttribute("role", t);
}
function IZ(e, t, n, r) {
	let i = XX(n, e.variantKeyPropertyName);
	if (i !== null && i.length > 0) {
		let n = r.getVariantTemplate(t, `${e.variantKey}:${i}`);
		if (n !== void 0) return n;
	}
	return r.getVariantTemplate(t, e.variantKey);
}
function LZ(e, t, n, r) {
	let i = t.hostSlotVariantKey;
	if (i == null || i.length === 0) return 0;
	let a = r.getVariantTemplate(n, i)?.content.firstElementChild ?? null;
	if (a === null) return s("composite item host slot template was not found.", {
		componentId: n,
		hostSlotVariantKey: i
	}), 0;
	for (let t of NZ) {
		let n = a.getAttribute(t);
		n !== null && e.setAttribute(t, n);
	}
	for (let t of Array.from(a.attributes)) t.name.startsWith("data-ui-bind-") && e.setAttribute(t.name, t.value);
	return e instanceof HTMLElement && (e.style.alignSelf = "stretch", e.style.justifySelf = "stretch"), D(a);
}
//#endregion
//#region src/items/items-row-renderer.ts
function RZ(e, t, n, r, i) {
	let a = i.metadata.getItemsTemplateMetadata(e), o = a?.composite;
	if (o == null) return zZ(i.renderer.renderItem(e, t, n, r), a);
	let s = PZ(o, e, t, n, r, i.templates, i.renderer);
	return s !== null && a?.rowDecorator && i.renderer.decorateRow(a.rowDecorator, s, t, n, e, r), zZ(s, a);
}
function zZ(e, t) {
	return e === null ? null : (t?.announcesSelection === !0 && !e.hasAttribute("aria-selected") && e.setAttribute("aria-selected", "false"), Zc(e), e);
}
//#endregion
//#region src/items/items-virtualization-engine.ts
var BZ = 6, VZ = 60, HZ = class {
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
		return r === void 0 || i < 0 || a < 0 ? null : r.slice(Math.min(i, a), Math.max(i, a) + 1).filter((e) => KZ(e.entry) === !1).map((e) => e.entry.key);
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
		if (!XZ(e) && !JZ(e)) return a.element;
		let o = getComputedStyle(e), s = $Z(o), c = r.projected.map((e) => this.pitchOf(r, e) + s), l = XZ(e) ? ZZ(r.projected, c, r.across) : null, u = l === null ? i : YZ(l.starts, i), d = l?.pitches ?? c, f = eQ(o.paddingTop) + tQ(d, 0, u), p = f + d[u] - s, m = od(e), h = n === "start" || n === "nearest" && f < m.top ? f : n === "end" || p > m.top + m.height ? p - m.height : null;
		return h !== null && sd(e, Math.max(0, h)), this.layout(e, r), a.element;
	}
	sync(e) {
		let t = this.getState(e);
		if (t === null) return;
		let n = bJ(e) && SJ(e), r = t.projected;
		this.project(e, t), this.keepCursorShown(e, t, r), this.layout(e, t), n && !SJ(e) && (sd(e, e.scrollHeight), this.layout(e, t));
	}
	refill(e, t) {
		let n = this.getState(e);
		if (n === null) return [];
		let r = new Map(n.byKey), i = [], a = /* @__PURE__ */ new Map(), o = [];
		for (let { key: n, item: s } of t) {
			let t = r.get(n);
			if (r.delete(n), t !== void 0 && Jp(t.item, s)) {
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
		return t === null ? null : UZ(t) ? (this.keptAsDrawn.add(t), t) : (this.dropRow(e, t), null);
	}
	dropRow(e, t) {
		if (t === null) return;
		let n = Yf(t);
		t.remove(), Xf(e, null, n);
	}
	keepCursorShown(e, t, n) {
		let r = Jf(e), i = t.entries.find((e) => e.element?.hasAttribute("data-ui-row-focus") === !0) ?? null, a = i?.key ?? (r === null ? null : Qf(r));
		if (r === null || a === null) return;
		let o = /* @__PURE__ */ new Set();
		for (let e of t.projected) e.header || o.add(e.entry.key);
		if (o.has(a)) return;
		let s = n.filter((e) => !e.header).map((e) => e.entry), c = s.findIndex((e) => e.key === a), l = c < 0 ? void 0 : s.slice(c + 1).find((e) => o.has(e.key)) ?? s.slice(0, c).reverse().find((e) => o.has(e.key));
		i?.element?.removeAttribute(Ne), l === void 0 ? (r.removeAttribute(Pe), r.removeAttribute("aria-activedescendant")) : l.element instanceof HTMLElement ? _f(r, K(e).filter((e) => e instanceof HTMLElement), l.element, null, !1) : (r.setAttribute(Pe, l.key), r.removeAttribute("aria-activedescendant"));
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
		let a = Jf(e), o = a === null || i.size === 0 ? null : Wf(a, K(e), i);
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
		return i === null || a === void 0 ? !1 : (a.item = UX(a.item, n, r), i.version++, n.length === 0 && (a.element = this.renewRow(e, a.element)), !0);
	}
	project(e, t) {
		let n = this.options.metadata.getItemsFilterSortMetadata(t.componentId), r = wk(e), i = this.options.templates.getGroupTemplate(t.componentId), a = Ak(n, this.options.state, r), o = t.entries;
		if (t.version++, (n !== void 0 && n.filters.length > 0 || (r?.filters ?? []).length > 0) && (o = o.filter((e) => Ok(n, e.item, this.options.state, r))), !(i !== void 0 && o.some((e) => qZ(e) !== ""))) {
			a.length > 0 && (o = [...o].sort((e, t) => Mk(e.item, t.item, a))), t.projected = o.map((e) => ({
				entry: e,
				header: !1
			}));
			return;
		}
		let { buckets: s, order: c } = iG(o, qZ), l = [];
		for (let e of c) {
			let t = s.get(e);
			a.length > 0 && (t = [...t].sort((e, t) => Mk(e.item, t.item, a))), e !== "" && l.push({
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
		let t = ad(e.target);
		t !== null && RO(t) === "virtualized" && this.relayout(t);
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
			e.isConnected && RO(e) === "virtualized" ? window.requestAnimationFrame(() => this.relayout(e)) : this.resizes?.unobserve(e);
		}
	}
	relayout(e) {
		let t = this.getState(e);
		t !== null && t.scheduled === 0 && (this.layout(e, t), t.scheduled = window.setTimeout(() => {
			t.scheduled = 0, this.layout(e, t);
		}, VZ));
	}
	layout(e, t) {
		let n = t.projected, r = getComputedStyle(e), i = $Z(r), a = n.map((e) => this.pitchOf(t, e) + i), o = n.length, s = t.across, c = XZ(e) ? ZZ(n, a, s) : null, l = c?.pitches ?? a, u = l.length, d = 0, f = u;
		if ((c !== null || JZ(e)) && u > 0) {
			let i = eQ(r.paddingTop), a = od(e), o = WZ(e, t, n, l, s, a.top - i, i), c = o + a.height, p = 0;
			d = u;
			for (let e = 0; e < u; e++) {
				let t = p + l[e];
				if (d === u && t > o && (d = e), p >= c) {
					f = e;
					break;
				}
				p = t;
			}
			d === u && (d = Math.max(0, u - 1)), d = Math.max(0, d - BZ), f = Math.min(u, f + BZ);
		}
		let p = c === null ? d : c.starts[d] ?? o, m = c === null ? f : f < u ? c.starts[f] : o, h = this.options.renderer.getAncestorStack(e), g = [], _ = [], v = -1, ee = !1, te = document.activeElement, ne = null;
		for (let r = 0; r < o; r++) {
			let i = n[r];
			i.header || v++;
			let a = r >= p && r < m, o = (i.header ? t.headers.get(qZ(i.entry)) ?? null : i.entry)?.element ?? null, s = o !== null && te !== null && o.contains(te);
			if (o !== null && !s && this.keptAsDrawn.has(o) && (this.keptAsDrawn.delete(o), this.dropRow(e, o), GZ(t, i, null), o = null, ee = !0), !a) {
				if (o !== null && !i.header && s) {
					ne = {
						element: o,
						line: c === null ? r : YZ(c.starts, r)
					}, _.push([o, v]);
					continue;
				}
				o !== null && (this.dropRow(e, o), GZ(t, i, null), ee = !0);
				continue;
			}
			if (o !== null) {
				i.header && sG(o, i.entry.key), g.push(o), i.header || _.push([o, v]);
				continue;
			}
			let l = i.header ? this.renderHeader(t, i.entry, h) : this.renderRow(t, i.entry, h);
			l !== null && (i.header || Zf(e, l), GZ(t, i, l), g.push(l), i.header || _.push([l, v]), ee = !0);
		}
		let re = new Set(g);
		ne !== null && re.add(ne.element);
		for (let n of t.entries) n.element !== null && !re.has(n.element) && (this.dropRow(e, n.element), n.element = null, ee = !0);
		for (let t of K(e)) re.has(t) || (this.dropRow(e, t), ee = !0);
		for (let t of e.querySelectorAll(`:scope > [${It}]`)) re.has(t) || (t.remove(), ee = !0);
		for (let e of t.headers.values()) e.element !== null && !re.has(e.element) && (e.element = null);
		let y = ne !== null && ne.line < d ? ne : null, ie = ne !== null && ne.line >= f ? ne : null, ae = tQ(l, 0, y?.line ?? d), b = tQ(l, ie === null ? f : ie.line + 1, u), oe = ne === null ? 0 : y === null ? tQ(l, f, ne.line) : tQ(l, y.line + 1, d), se = mG(e, oe > 0 ? oe - i : 0);
		gG(e, [...y === null ? ie === null ? g : [
			...g,
			...tk(se),
			ie.element
		] : [
			y.element,
			...tk(se),
			...g
		], ...tk(nk(e))]), dG(e, "top", ae > 0 ? ae - i : 0), dG(e, cG, b > 0 ? b - i : 0), rk(e, t.componentId, this.options.templates, this.options.renderer, o > 0), aZ(e, _, v + 1), (ee || t.first !== p || t.last !== m) && (t.first = p, t.last = m, this.options.dom.invalidate(e)), t.laidOut = n, t.pitches = l, t.laidAcross = s, t.keptOutOfRange = ne?.element ?? null, t.firstLine = d, t.lastLine = f, this.measure(t, n, p, m), c !== null && (t.across = QZ(e, r, t.tileWidth) ?? t.across, t.across !== s && this.layout(e, t));
	}
	renderRow(e, t, n) {
		return RZ(e.componentId, t.item, t.key, n, this.options);
	}
	renderHeader(e, t, n) {
		let r = this.options.templates.getGroupTemplate(e.componentId);
		return r === void 0 ? null : oG(r, this.options.renderer, t.item, t.key, n);
	}
	measure(e, t, n, r) {
		let i = 0;
		for (let a = n; a < r && a < t.length; a++) {
			let n = t[a], r = n.header ? e.headers.get(qZ(n.entry)) : n.entry, o = r?.element;
			if (r == null || o == null) continue;
			let s = ld(o);
			s.height <= 0 || (hG(n.header ? e.headerHeights : e.itemHeights, r.height, s.height), r.height = s.height, n.header || (i = Math.max(i, s.width)));
		}
		i > 0 && (e.tileWidth = i), e.itemHeights.count > 0 && (e.itemEstimate = e.itemHeights.sum / e.itemHeights.count), e.headerHeights.count > 0 && (e.headerEstimate = e.headerHeights.sum / e.headerHeights.count);
	}
	pitchOf(e, t) {
		return t.header ? e.headers.get(qZ(t.entry))?.height ?? e.headerEstimate : t.entry.height ?? e.itemEstimate;
	}
	getState(e) {
		let t = this.states.get(e);
		if (t !== void 0) return this.held.add(e), t;
		let n = Ua(e);
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
function UZ(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t);
}
function WZ(e, t, n, r, i, a, o) {
	if (t.laidOut !== n || t.laidAcross !== i || t.pitches.length !== r.length || a <= 0) return a;
	let s = 0, c = 0;
	for (let e = 0; e < r.length; e++) {
		let n = e >= t.firstLine && e < t.lastLine ? r[e] : t.pitches[e];
		if (s + n > a) break;
		s += n, c += r[e];
	}
	let l = c - s;
	return Math.abs(l) < .5 ? a : (sd(e, a + l + o), a + l);
}
function GZ(e, t, n) {
	if (!t.header) {
		t.entry.element = n;
		return;
	}
	let r = qZ(t.entry), i = e.headers.get(r);
	i === void 0 ? e.headers.set(r, {
		element: n,
		height: null
	}) : i.element = n;
}
function KZ(e) {
	let t = hk(e.item, "CanSelect");
	return t.ok && t.value === !1;
}
function qZ(e) {
	let t = hk(e.item, "Group");
	return t.ok && typeof t.value == "string" ? t.value : "";
}
function JZ(e) {
	let t = e.parentElement;
	return t !== null && (t.classList.contains("ui-table__scroll") || t.classList.contains("ui-items-view--stack") && t.classList.contains("ui-orientation--vertical"));
}
function YZ(e, t) {
	let n = 0;
	for (; n + 1 < e.length && e[n + 1] <= t;) n++;
	return n;
}
function XZ(e) {
	return e.parentElement?.classList.contains("ui-items-view--wrap") === !0;
}
function ZZ(e, t, n) {
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
function QZ(e, t, n) {
	let r = e.clientWidth - eQ(t.paddingLeft) - eQ(t.paddingRight);
	if (n === null || n <= 0 || r <= 0) return null;
	let i = eQ(t.columnGap);
	return Math.max(1, Math.floor((r + i + .5) / (n + i)));
}
function $Z(e) {
	return eQ(e.rowGap);
}
function eQ(e) {
	let t = Number.parseFloat(e);
	return Number.isFinite(t) ? t : 0;
}
function tQ(e, t, n) {
	let r = 0;
	for (let i = t; i < n; i++) r += e[i];
	return r;
}
//#endregion
//#region src/items/items-template-registry.ts
var nQ = "data-ui-template", rQ = "default", iQ = class {
	dom;
	templateComponentIds = null;
	constructor(e) {
		this.dom = e;
	}
	getTemplate(e, t) {
		let n = t ?? rQ, r = this.findTemplate(e, n);
		return r === void 0 ? n === rQ ? void 0 : this.getTemplate(e, null) : r;
	}
	getVariantTemplate(e, t) {
		return this.findTemplate(e, t);
	}
	findTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		return n === null ? void 0 : aQ(n, nQ, t);
	}
	isTemplateComponent(e) {
		return this.templateComponentIds ??= oQ(this.dom.root), this.templateComponentIds.has(e);
	}
	getEmptyTemplate(e) {
		return this.getMarkedTemplate(e, Nt);
	}
	getGroupTemplate(e) {
		return this.getMarkedTemplate(e, Pt);
	}
	getMarkedTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		return n === null ? void 0 : aQ(n, t, null);
	}
};
function aQ(e, t, n) {
	for (let r of e.children) if (r.localName === "template" && (n === null ? r.hasAttribute(t) : r.getAttribute(t) === n)) return r;
}
function oQ(e) {
	let t = /* @__PURE__ */ new Set();
	return qc(e, (n) => {
		if (n !== e) for (let e of n.querySelectorAll(w)) {
			let n = D(e);
			n > 0 && t.add(n);
		}
	}), t;
}
//#endregion
//#region src/items/row-menus.ts
var sQ = `:scope > ${`template[${Te}]`}`, cQ = class {
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
			this.components.has(e) && uQ(t.item, this.chordSet);
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
		let t = e.querySelector(sQ);
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
			let e = [...t, ...lQ(r)];
			if (r.hasAttribute("data-ui-context-menu-template")) {
				this.takeMenu(r, e, n);
				continue;
			}
			let i = r.parentElement === null ? 0 : D(r.parentElement);
			this.scanContainer(r.content, i > 0 ? [...e, i] : e, n ?? r);
		}
	}
	takeMenu(e, t, n) {
		let r = Number(e.getAttribute(Te)), i = !this.declared.has(r);
		this.taken.add(e), this.declared.add(r), qc(e.content, (e) => {
			if (i) for (let n of e.querySelectorAll(w)) this.components.set(D(n), t), this.menuOf.set(D(n), r);
			for (let t of e.querySelectorAll(`[${Un}]`)) {
				let e = t.getAttribute("data-ui-shortcut")?.trim() ?? "";
				e.length > 0 && this.writtenChords.add(e);
			}
		}), (e.parentElement?.hasAttribute("data-ui-context-menu-later") !== !0 || n !== null) && (n !== null && n.after(e), Number.isInteger(r) && r > 0 && this.shared.set(r, e));
	}
};
function lQ(e) {
	let t = [];
	for (let n = e.parentElement?.closest("[data-ui-items-host]") ?? null; n !== null; n = n.parentElement?.closest("[data-ui-items-host]") ?? null) {
		let e = Ha(n);
		e !== null && t.unshift(e);
	}
	return t;
}
function uQ(e, t) {
	let n = hk(e, "Shortcut");
	n.ok && typeof n.value == "string" && n.value.trim().length > 0 && t.add(n.value.trim());
	let r = hk(e, "Items");
	if (r.ok && Array.isArray(r.value)) for (let e of r.value) uQ(e, t);
}
//#endregion
//#region src/rendering/theme-colors.ts
function dQ(e, t) {
	let n = e.querySelector(`style[${Hr}]`);
	if (t.length === 0) {
		n?.remove();
		return;
	}
	if (n !== null) {
		n.textContent !== t && (n.textContent = t);
		return;
	}
	let r = document.createElement("style");
	r.setAttribute(Hr, ""), r.textContent = t, e.insertBefore(r, e.querySelector("style")?.nextElementSibling ?? null);
}
//#endregion
//#region src/metadata/metadata-reader.ts
var fQ = "script[type='application/json'][data-ui-metadata]";
function pQ(e = document) {
	let t = e.querySelector(fQ);
	if (t === null) return mQ();
	let n = t.textContent?.trim() ?? "";
	if (n.length === 0) return mQ();
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
function mQ() {
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
var hQ = "script[type='application/json'][data-ui-hydration]";
function gQ(e) {
	return e !== null && (_c(e.title) || _c(e.changes));
}
function _Q(e = document) {
	let t = e.querySelector(hQ)?.textContent?.trim() ?? "";
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
var vQ = "reconnecting";
async function yQ(e, t, n, r) {
	for (let i = 0;; i++) try {
		return await e();
	} catch (e) {
		if (t()) return s("attaching the runtime failed as the connection dropped again; the reconnect attaches.", e), vQ;
		if (i >= n.length) return c("attaching the runtime failed after retrying; giving up.", e), null;
		s("attaching the runtime failed; retrying.", {
			attempt: i + 1,
			error: e
		}), await r(n[i]);
	}
}
//#endregion
//#region src/transport/reader-time-zone.ts
function bQ(e = () => Intl.DateTimeFormat().resolvedOptions().timeZone) {
	try {
		let t = e();
		return typeof t == "string" && t.length > 0 ? t : null;
	} catch {
		return null;
	}
}
function xQ(e, t, n) {
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
var SQ = "/_ne/", CQ = 3e3;
function wQ(e, t, n) {
	let r = e.getAttribute(Br);
	if (r === null || !("serviceWorker" in navigator)) return;
	let i = navigator.serviceWorker;
	if (xQ(i, t, n), e.hasAttribute("data-ui-service-worker-imported")) return () => EQ(i.ready);
	let a = i.register(r, { scope: SQ }).then(TQ).catch((e) => {
		s("registering the notification service worker failed; notifications are the page's own.", e);
	});
	return () => a;
}
function TQ(e) {
	let t = e.installing ?? e.waiting;
	return e.active !== null || t === null ? Promise.resolve(e) : new Promise((n) => {
		t.addEventListener("statechange", () => {
			t.state === "activated" && n(e);
		});
	});
}
function EQ(e) {
	return Promise.race([e, new Promise((e) => setTimeout(() => e(void 0), CQ))]);
}
//#endregion
//#region src/runtime/reload-guard.ts
var DQ = "ne-standard-ui:reloaded-view";
function OQ(e, t, n) {
	if (!t) return "no-cookie";
	if (jQ(n) === e) return "asked-again";
	try {
		n?.setItem(DQ, e);
	} catch {}
	return "reload";
}
function kQ(e) {
	try {
		e?.removeItem(DQ);
	} catch {}
}
function AQ() {
	try {
		return window.sessionStorage;
	} catch {
		return null;
	}
}
function jQ(e) {
	try {
		return e?.getItem(DQ) ?? null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/runtime/window-id.ts
function MQ(e, t) {
	let n = null;
	try {
		n = window.sessionStorage;
	} catch (e) {
		s("session storage is unavailable, so this tab is new on every load.", e);
	}
	return NQ(e, {
		memory: n,
		lifecycle: window,
		openChannel: typeof BroadcastChannel == "function" ? (e) => new BroadcastChannel(e) : null,
		rekeyed: t
	});
}
function NQ(e, t) {
	let n = t.create ?? zQ, r = t.now ?? Date.now, i = t.memory, a = `${e}:claimed`, o = IQ(i, e), s = n(), c = o !== null && o.length > 0 && IQ(i, a) !== o ? o : n(), l = null, u = 0, d = () => {
		LQ(i, e, c), LQ(i, a, c);
	}, f = (e) => {
		e?.kind === "ask" && e.id === c && e.from !== s ? PQ(l, {
			kind: "held",
			id: c,
			to: e.from,
			by: s,
			at: u
		}) : e?.kind === "held" && e.id === c && e.to === s && (e.at < u || e.at === u && e.by < s) && (c = n(), d(), t.rekeyed(c));
	}, p = () => {
		l = FQ(t, e), l?.addEventListener("message", (e) => f(e.data)), u = r(), PQ(l, {
			kind: "ask",
			id: c,
			from: s,
			at: u
		});
	};
	return d(), p(), t.lifecycle.addEventListener("pagehide", () => {
		RQ(i, a), l?.close(), l = null;
	}), t.lifecycle.addEventListener("pageshow", (e) => {
		e.persisted && (d(), p());
	}), c;
}
function PQ(e, t) {
	e?.postMessage(t);
}
function FQ(e, t) {
	try {
		return e.openChannel?.(t) ?? null;
	} catch (e) {
		return s("the channel tabs ask for their ids on could not be opened.", e), null;
	}
}
function IQ(e, t) {
	try {
		return e?.getItem(t) ?? null;
	} catch (e) {
		return s("reading the tab id failed.", e), null;
	}
}
function LQ(e, t, n) {
	try {
		e?.setItem(t, n);
	} catch (e) {
		s("storing the tab id failed.", e);
	}
}
function RQ(e, t) {
	try {
		e?.removeItem(t);
	} catch {}
}
function zQ() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `tab-${typeof crypto < "u" && typeof crypto.getRandomValues == "function" ? [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16))].map((e) => e.toString(16).padStart(2, "0")).join("") : Math.random().toString(16).slice(2).padEnd(16, "0")}-${performance.now().toString(36).replace(".", "")}`;
}
//#endregion
//#region src/runtime/connection-watch.ts
var BQ = 2e3, VQ = class {
	root;
	notifications;
	graceMilliseconds;
	grace = null;
	notice = null;
	given = !1;
	constructor(e) {
		this.root = e.root, this.notifications = e.notifications, this.graceMilliseconds = e.graceMilliseconds ?? BQ, e.connection.onReconnecting(() => this.reconnecting()), e.connection.onReconnected(() => this.reconnected());
	}
	reconnecting() {
		this.given || this.grace !== null || this.notice !== null || (this.grace = window.setTimeout(() => this.showReconnecting(), this.graceMilliseconds));
	}
	showReconnecting() {
		this.grace = null, this.root.setAttribute(Qr, "reconnecting"), this.notice = this.notifications.show({
			message: k.text("ui.connection.reconnecting"),
			sticky: !0,
			connection: !0
		});
	}
	reconnected() {
		this.given || (this.clear(), this.root.removeAttribute(Qr));
	}
	clear() {
		this.grace !== null && (window.clearTimeout(this.grace), this.grace = null), this.notice !== null && (this.notifications.dismiss(this.notice), this.notice = null);
	}
	lost() {
		this.given = !0, this.clear(), this.root.setAttribute(Qr, "lost");
	}
}, HQ = "/_ne/values", UQ = 32768;
UQ / 4;
var WQ = 3e4;
function GQ(e) {
	let t = JSON.stringify(e);
	if (t === void 0 || t.length * 3 <= 8192) return null;
	let n = new TextEncoder().encode(t);
	return n.byteLength > 8192 ? n : null;
}
function KQ(e) {
	return e?.updates?.some((e) => typeof e.valueToken == "string") === !0;
}
async function qQ(e, t = null, n = WQ) {
	if (e === void 0 || !KQ(e)) return e;
	await by.settled();
	let r = await Promise.all((e.updates ?? []).map(async (e) => {
		let r = e.valueToken;
		if (typeof r != "string") return e;
		let i = t === null ? "" : `?instance=${encodeURIComponent(t)}`, a = await fetch(`${HQ}/${encodeURIComponent(r)}${i}`, {
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
async function JQ(e) {
	await by.settled();
	let t = await fetch(HQ, {
		method: "POST",
		body: e,
		headers: { "Content-Type": "application/json" },
		credentials: "same-origin",
		signal: AbortSignal.timeout(WQ)
	});
	if (!t.ok) throw Error(`Staging a large value failed with status ${t.status}.`);
	let n = (await t.json())?.token;
	if (n === void 0 || n.length === 0) throw Error("Staging a large value answered with no token.");
	return n;
}
//#endregion
//#region src/transport/command-dispatcher.ts
var YQ = class {
	transport;
	pendingKeys = /* @__PURE__ */ new Set();
	nextRequestId = 1;
	awaited = /* @__PURE__ */ new Map();
	staging = null;
	constructor(e) {
		this.transport = e;
	}
	isPending(e) {
		return this.pendingKeys.has(XQ(ZQ(e)));
	}
	async dispatchAsync(e) {
		let t = ZQ(e), n = XQ(t);
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
		let t = GQ(e.dynamicParameters);
		if (t === null && this.staging === null) return this.transport.processEventAsync(e);
		let n = this.staging, r = t === null ? null : JQ(t), i = () => {}, a = new Promise((e) => {
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
function XQ(e) {
	return e.action === void 0 ? `${JSON.stringify(e.eventId)}:${JSON.stringify(e.dynamicParameters ?? [])}` : `action:${e.action}`;
}
function ZQ(e) {
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
var QQ = class {
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
async function $Q(e, t) {
	try {
		await e();
	} finally {
		t();
	}
}
//#endregion
//#region src/state/property-state-store.ts
var e$ = class {
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
		let i = this.createKey(e, t), a = this.values.get(i), o = a !== void 0 && Jp(a.value, n);
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
		let r = t$(e, t);
		for (let e of n) this.forgetRow(r, e), this.forgetUnplaced(ma([...t, e]));
	}
	forgetHost(e, t) {
		this.forgetScope(t$(e, t));
		let n = this.unplaced.get(ma(t));
		for (let e of [...n?.children ?? []]) this.forgetUnplaced(e);
	}
	clear() {
		this.values.clear(), this.scopes.clear(), this.unplaced.clear(), this.unplacedPathByEntry.clear();
	}
	recordRows(e, t) {
		let n = null;
		for (let [r, i] of t.entries()) {
			let t = t$(i.host, i.hostParameters), a = this.rowState(t, i.key);
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
		let n = this.unplacedNode(ma([]), null), r = "";
		for (let e = 1; e <= t.length; e++) r = ma(t.slice(0, e)), n.children.add(r), n = this.unplacedNode(r, ma(t.slice(0, e - 1)));
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
		return `${E(e.componentId)}:${e.propertyId}:${ma(t)}`;
	}
};
function t$(e, t) {
	return `${e}:${ma(t)}`;
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Errors.js
var n$ = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(`${e}: Status code '${t}'`), this.statusCode = t, this.__proto__ = n;
	}
}, r$ = class extends Error {
	constructor(e = "A timeout occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, i$ = class extends Error {
	constructor(e = "An abort occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, a$ = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "UnsupportedTransportError", this.__proto__ = n;
	}
}, o$ = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "DisabledTransportError", this.__proto__ = n;
	}
}, s$ = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "FailedToStartTransportError", this.__proto__ = n;
	}
}, c$ = class extends Error {
	constructor(e) {
		let t = new.target.prototype;
		super(e), this.errorType = "FailedToNegotiateWithServerError", this.__proto__ = t;
	}
}, l$ = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.innerErrors = t, this.__proto__ = n;
	}
}, u$ = class {
	constructor(e, t, n) {
		this.statusCode = e, this.statusText = t, this.content = n;
	}
}, d$ = class {
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
var f$ = class {
	constructor() {}
	log(e, t) {}
};
f$.instance = new f$();
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/pkg-version.js
var p$ = "10.0.11", Z = class {
	static isRequired(e, t) {
		if (e == null) throw Error(`The '${t}' argument is required.`);
	}
	static isNotEmpty(e, t) {
		if (!e || e.match(/^\s*$/)) throw Error(`The '${t}' argument should not be empty.`);
	}
	static isIn(e, t, n) {
		if (!(e in t)) throw Error(`Unknown ${n} value: ${e}.`);
	}
}, m$ = class e {
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
function h$(e, t) {
	let n = "";
	return _$(e) ? (n = `Binary data of length ${e.byteLength}`, t && (n += `. Content: '${g$(e)}'`)) : typeof e == "string" && (n = `String data of length ${e.length}`, t && (n += `. Content: '${e}'`)), n;
}
function g$(e) {
	let t = new Uint8Array(e), n = "";
	return t.forEach((e) => {
		n += `0x${e < 16 ? "0" : ""}${e.toString(16)} `;
	}), n.substring(0, n.length - 1);
}
function _$(e) {
	return e && typeof ArrayBuffer < "u" && (e instanceof ArrayBuffer || e.constructor && e.constructor.name === "ArrayBuffer");
}
async function v$(e, t, n, r, i, a) {
	let o = {}, [s, c] = S$();
	o[s] = c, e.log(X.Trace, `(${t} transport) sending data. ${h$(i, a.logMessageContent)}.`);
	let l = _$(i) ? "arraybuffer" : "text", u = await n.post(r, {
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
function y$(e) {
	return e === void 0 ? new x$(X.Information) : e === null ? f$.instance : e.log === void 0 ? new x$(e) : e;
}
var b$ = class {
	constructor(e, t) {
		this._subject = e, this._observer = t;
	}
	dispose() {
		let e = this._subject.observers.indexOf(this._observer);
		e > -1 && this._subject.observers.splice(e, 1), this._subject.observers.length === 0 && this._subject.cancelCallback && this._subject.cancelCallback().catch((e) => {});
	}
}, x$ = class {
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
function S$() {
	let e = "X-SignalR-User-Agent";
	return m$.isNode && (e = "User-Agent"), [e, C$(p$, w$(), E$(), T$())];
}
function C$(e, t, n, r) {
	let i = "Microsoft SignalR/", a = e.split(".");
	return i += `${a[0]}.${a[1]}`, i += ` (${e}; `, i += t && t !== "" ? `${t}; ` : "Unknown OS; ", i += `${n}`, i += r ? `; ${r}` : "; Unknown Runtime Version", i += ")", i;
}
/*#__PURE__*/ function w$() {
	if (m$.isNode) switch (process.platform) {
		case "win32": return "Windows NT";
		case "darwin": return "macOS";
		case "linux": return "Linux";
		default: return process.platform;
	}
	else return "";
}
/*#__PURE__*/ function T$() {
	if (m$.isNode) return process.versions.node;
}
function E$() {
	return m$.isNode ? "NodeJS" : "Browser";
}
function D$(e) {
	return e.stack ? e.stack : e.message ? e.message : `${e}`;
}
function O$() {
	if (typeof globalThis < "u") return globalThis;
	if (typeof self < "u") return self;
	if (typeof window < "u") return window;
	if (typeof global < "u") return global;
	throw Error("could not find global");
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js
var k$ = class extends d$ {
	constructor(t) {
		if (super(), this._logger = t, typeof fetch > "u" || m$.isNode) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._jar = new (t("tough-cookie")).CookieJar(), this._fetchType = typeof fetch > "u" ? t("node-fetch") : fetch, this._fetchType = t("fetch-cookie")(this._fetchType, this._jar);
		} else this._fetchType = fetch.bind(O$());
		if (typeof AbortController > "u") {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._abortControllerType = t("abort-controller");
		} else this._abortControllerType = AbortController;
	}
	async send(e) {
		if (e.abortSignal && e.abortSignal.aborted) throw new i$();
		if (!e.method) throw Error("No method defined.");
		if (!e.url) throw Error("No url defined.");
		let t = new this._abortControllerType(), n;
		e.abortSignal && (e.abortSignal.onabort = () => {
			t.abort(), n = new i$();
		});
		let r = null;
		if (e.timeout) {
			let i = e.timeout;
			r = setTimeout(() => {
				t.abort(), this._logger.log(X.Warning, "Timeout from HTTP request."), n = new r$();
			}, i);
		}
		e.content === "" && (e.content = void 0), e.content && (e.headers = e.headers || {}, _$(e.content) ? e.headers["Content-Type"] = "application/octet-stream" : e.headers["Content-Type"] = "text/plain;charset=UTF-8");
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
		if (!i.ok) throw new n$(await A$(i, "text") || i.statusText, i.status);
		let a = await A$(i, e.responseType);
		return new u$(i.status, i.statusText, a);
	}
	getCookieString(e) {
		let t = "";
		return m$.isNode && this._jar && this._jar.getCookies(e, (e, n) => t = n.join("; ")), t;
	}
};
function A$(e, t) {
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
var j$ = class extends d$ {
	constructor(e) {
		super(), this._logger = e;
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new i$()) : e.method ? e.url ? new Promise((t, n) => {
			let r = new XMLHttpRequest();
			r.open(e.method, e.url, !0), r.withCredentials = e.withCredentials === void 0 || e.withCredentials, r.setRequestHeader("X-Requested-With", "XMLHttpRequest"), e.content === "" && (e.content = void 0), e.content && (_$(e.content) ? r.setRequestHeader("Content-Type", "application/octet-stream") : r.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"));
			let i = e.headers;
			i && Object.keys(i).forEach((e) => {
				r.setRequestHeader(e, i[e]);
			}), e.responseType && (r.responseType = e.responseType), e.abortSignal && (e.abortSignal.onabort = () => {
				r.abort(), n(new i$());
			}), e.timeout && (r.timeout = e.timeout), r.onload = () => {
				e.abortSignal && (e.abortSignal.onabort = null), r.status >= 200 && r.status < 300 ? t(new u$(r.status, r.statusText, r.response || r.responseText)) : n(new n$(r.response || r.responseText || r.statusText, r.status));
			}, r.onerror = () => {
				this._logger.log(X.Warning, `Error from HTTP request. ${r.status}: ${r.statusText}.`), n(new n$(r.statusText, r.status));
			}, r.ontimeout = () => {
				this._logger.log(X.Warning, "Timeout from HTTP request."), n(new r$());
			}, r.send(e.content);
		}) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
}, M$ = class extends d$ {
	constructor(e) {
		if (super(), typeof fetch < "u" || m$.isNode) this._httpClient = new k$(e);
		else if (typeof XMLHttpRequest < "u") this._httpClient = new j$(e);
		else throw Error("No usable HttpClient found.");
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new i$()) : e.method ? e.url ? this._httpClient.send(e) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
	getCookieString(e) {
		return this._httpClient.getCookieString(e);
	}
}, N$ = class e {
	static write(t) {
		return `${t}${e.RecordSeparator}`;
	}
	static parse(t) {
		if (t[t.length - 1] !== e.RecordSeparator) throw Error("Message is incomplete.");
		let n = t.split(e.RecordSeparator);
		return n.pop(), n;
	}
};
N$.RecordSeparatorCode = 30, N$.RecordSeparator = String.fromCharCode(N$.RecordSeparatorCode);
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js
var P$ = class {
	writeHandshakeRequest(e) {
		return N$.write(JSON.stringify(e));
	}
	parseHandshakeResponse(e) {
		let t, n;
		if (_$(e)) {
			let r = new Uint8Array(e), i = r.indexOf(N$.RecordSeparatorCode);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = String.fromCharCode.apply(null, Array.prototype.slice.call(r.slice(0, a))), n = r.byteLength > a ? r.slice(a).buffer : null;
		} else {
			let r = e, i = r.indexOf(N$.RecordSeparator);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = r.substring(0, a), n = r.length > a ? r.substring(a) : null;
		}
		let r = N$.parse(t), i = JSON.parse(r[0]);
		if (i.type) throw Error("Expected a handshake response from the server.");
		return [n, i];
	}
}, Q;
(function(e) {
	e[e.Invocation = 1] = "Invocation", e[e.StreamItem = 2] = "StreamItem", e[e.Completion = 3] = "Completion", e[e.StreamInvocation = 4] = "StreamInvocation", e[e.CancelInvocation = 5] = "CancelInvocation", e[e.Ping = 6] = "Ping", e[e.Close = 7] = "Close", e[e.Ack = 8] = "Ack", e[e.Sequence = 9] = "Sequence";
})(Q ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Subject.js
var F$ = class {
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
		return this.observers.push(e), new b$(this, e);
	}
}, I$ = class {
	constructor(e, t, n) {
		this._bufferSize = 1e5, this._messages = [], this._totalMessageCount = 0, this._waitForSequenceMessage = !1, this._nextReceivingSequenceId = 1, this._latestReceivedSequenceId = 0, this._bufferedByteCount = 0, this._reconnectInProgress = !1, this._protocol = e, this._connection = t, this._bufferSize = n;
	}
	async _send(e) {
		let t = this._protocol.writeMessage(e), n = Promise.resolve();
		if (this._isInvocationMessage(e)) {
			this._totalMessageCount++;
			let e = () => {}, r = () => {};
			_$(t) ? this._bufferedByteCount += t.byteLength : this._bufferedByteCount += t.length, this._bufferedByteCount >= this._bufferSize && (n = new Promise((t, n) => {
				e = t, r = n;
			})), this._messages.push(new L$(t, this._totalMessageCount, e, r));
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
			if (r._id <= e.sequenceId) t = n, _$(r._message) ? this._bufferedByteCount -= r._message.byteLength : this._bufferedByteCount -= r._message.length, r._resolver();
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
}, L$ = class {
	constructor(e, t, n, r) {
		this._message = e, this._id = t, this._resolver = n, this._rejector = r;
	}
}, R$ = 3e4, z$ = 15e3, B$ = 1e5, $;
(function(e) {
	e.Disconnected = "Disconnected", e.Connecting = "Connecting", e.Connected = "Connected", e.Disconnecting = "Disconnecting", e.Reconnecting = "Reconnecting";
})($ ||= {});
var V$ = class e {
	static create(t, n, r, i, a, o, s) {
		return new e(t, n, r, i, a, o, s);
	}
	constructor(e, t, n, r, i, a, o) {
		this._nextKeepAlive = 0, this._freezeEventListener = () => {
			this._logger.log(X.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
		}, Z.isRequired(e, "connection"), Z.isRequired(t, "logger"), Z.isRequired(n, "protocol"), this.serverTimeoutInMilliseconds = i ?? R$, this.keepAliveIntervalInMilliseconds = a ?? z$, this._statefulReconnectBufferSize = o ?? B$, this._logger = t, this._protocol = n, this.connection = e, this._reconnectPolicy = r, this._handshakeProtocol = new P$(), this.connection.onreceive = (e) => this._processIncomingData(e), this.connection.onclose = (e) => this._connectionClosed(e), this._callbacks = {}, this._methods = {}, this._closedCallbacks = [], this._reconnectingCallbacks = [], this._reconnectedCallbacks = [], this._invocationId = 0, this._receivedHandshakeResponse = !1, this._connectionState = $.Disconnected, this._connectionStarted = !1, this._cachedPingMessage = this._protocol.writeMessage({ type: Q.Ping });
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
			await this._startInternal(), m$.isBrowser && window.document.addEventListener("freeze", this._freezeEventListener), this._connectionState = $.Connected, this._connectionStarted = !0, this._logger.log(X.Debug, "HubConnection connected successfully.");
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
			this.connection.features.reconnect && (this._messageBuffer = new I$(this._protocol, this.connection, this._statefulReconnectBufferSize), this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer), this.connection.features.resend = () => {
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
		return this._connectionState = $.Disconnecting, this._logger.log(X.Debug, "Stopping HubConnection."), this._reconnectDelayHandle ? (this._logger.log(X.Debug, "Connection stopped during reconnect delay. Done reconnecting."), clearTimeout(this._reconnectDelayHandle), this._reconnectDelayHandle = void 0, this._completeClose(), Promise.resolve()) : (t === $.Connected && this._sendCloseMessage(), this._cleanupTimeout(), this._cleanupPingTimer(), this._stopDuringStartError = e || new i$("The connection was stopped before the hub handshake could complete."), this.connection.stop(e));
	}
	async _sendCloseMessage() {
		try {
			await this._sendWithProtocol(this._createCloseMessage());
		} catch {}
	}
	stream(e, ...t) {
		let [n, r] = this._replaceStreamingParams(t), i = this._createStreamInvocation(e, t, r), a, o = new F$();
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
						this._logger.log(X.Error, `Invoke client method threw error: ${D$(e)}`);
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
							this._logger.log(X.Error, `Stream callback threw error: ${D$(e)}`);
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
		this._logger.log(X.Debug, `HubConnection.connectionClosed(${e}) called while in state ${this._connectionState}.`), this._stopDuringStartError = this._stopDuringStartError || e || new i$("The underlying connection was closed before the hub handshake could complete."), this._handshakeResolver && this._handshakeResolver(), this._cancelCallbacksWithError(e || /* @__PURE__ */ Error("Invocation canceled due to the underlying connection being closed.")), this._cleanupTimeout(), this._cleanupPingTimer(), this._connectionState === $.Disconnecting ? this._completeClose(e) : this._connectionState === $.Connected && this._reconnectPolicy ? this._reconnect(e) : this._connectionState === $.Connected && this._completeClose(e);
	}
	_completeClose(e) {
		if (this._connectionStarted) {
			this._connectionState = $.Disconnected, this._connectionStarted = !1, this._messageBuffer &&= (this._messageBuffer._dispose(e ?? /* @__PURE__ */ Error("Connection closed.")), void 0), m$.isBrowser && window.document.removeEventListener("freeze", this._freezeEventListener);
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
				this._logger.log(X.Error, `Stream 'error' callback called with '${e}' threw error: ${D$(t)}`);
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
}, H$ = [
	0,
	2e3,
	1e4,
	3e4,
	null
], U$ = class {
	constructor(e) {
		this._retryDelays = e === void 0 ? H$ : [...e, null];
	}
	nextRetryDelayInMilliseconds(e) {
		return this._retryDelays[e.previousRetryCount];
	}
}, W$ = class {};
W$.Authorization = "Authorization", W$.Cookie = "Cookie";
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js
var G$ = class extends d$ {
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
		e.headers ||= {}, this._accessToken ? e.headers[W$.Authorization] = `Bearer ${this._accessToken}` : this._accessTokenFactory && e.headers[W$.Authorization] && delete e.headers[W$.Authorization];
	}
	getCookieString(e) {
		return this._innerClient.getCookieString(e);
	}
}, K$;
(function(e) {
	e[e.None = 0] = "None", e[e.WebSockets = 1] = "WebSockets", e[e.ServerSentEvents = 2] = "ServerSentEvents", e[e.LongPolling = 4] = "LongPolling";
})(K$ ||= {});
var q$;
(function(e) {
	e[e.Text = 1] = "Text", e[e.Binary = 2] = "Binary";
})(q$ ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AbortController.js
var J$ = class {
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
}, Y$ = class {
	get pollAborted() {
		return this._pollAbort.aborted;
	}
	constructor(e, t, n) {
		this._httpClient = e, this._logger = t, this._pollAbort = new J$(), this._options = n, this._running = !1, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		if (Z.isRequired(e, "url"), Z.isRequired(t, "transferFormat"), Z.isIn(t, q$, "transferFormat"), this._url = e, this._logger.log(X.Trace, "(LongPolling transport) Connecting."), t === q$.Binary && typeof XMLHttpRequest < "u" && typeof new XMLHttpRequest().responseType != "string") throw Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
		let [n, r] = S$(), i = {
			[n]: r,
			...this._options.headers
		}, a = {
			abortSignal: this._pollAbort.signal,
			headers: i,
			timeout: 1e5,
			withCredentials: this._options.withCredentials
		};
		t === q$.Binary && (a.responseType = "arraybuffer");
		let o = `${e}&_=${Date.now()}`;
		this._logger.log(X.Trace, `(LongPolling transport) polling: ${o}.`);
		let s = await this._httpClient.get(o, a);
		s.statusCode === 200 ? this._running = !0 : (this._logger.log(X.Error, `(LongPolling transport) Unexpected response code: ${s.statusCode}.`), this._closeError = new n$(s.statusText || "", s.statusCode), this._running = !1), this._receiving = this._poll(this._url, a);
	}
	async _poll(e, t) {
		try {
			for (; this._running;) try {
				let n = `${e}&_=${Date.now()}`;
				this._logger.log(X.Trace, `(LongPolling transport) polling: ${n}.`);
				let r = await this._httpClient.get(n, t);
				r.statusCode === 204 ? (this._logger.log(X.Information, "(LongPolling transport) Poll terminated by server."), this._running = !1) : r.statusCode === 200 ? r.content ? (this._logger.log(X.Trace, `(LongPolling transport) data received. ${h$(r.content, this._options.logMessageContent)}.`), this.onreceive && this.onreceive(r.content)) : this._logger.log(X.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._logger.log(X.Error, `(LongPolling transport) Unexpected response code: ${r.statusCode}.`), this._closeError = new n$(r.statusText || "", r.statusCode), this._running = !1);
			} catch (e) {
				this._running ? e instanceof r$ ? this._logger.log(X.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._closeError = e, this._running = !1) : this._logger.log(X.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
			}
		} finally {
			this._logger.log(X.Trace, "(LongPolling transport) Polling complete."), this.pollAborted || this._raiseOnClose();
		}
	}
	async send(e) {
		return this._running ? v$(this._logger, "LongPolling", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	async stop() {
		this._logger.log(X.Trace, "(LongPolling transport) Stopping polling."), this._running = !1, this._pollAbort.abort();
		try {
			await this._receiving, this._logger.log(X.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
			let e = {}, [t, n] = S$();
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
			i ? i instanceof n$ && (i.statusCode === 404 ? this._logger.log(X.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.") : this._logger.log(X.Trace, `(LongPolling transport) Error sending a DELETE request: ${i}`)) : this._logger.log(X.Trace, "(LongPolling transport) DELETE request accepted.");
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
}, X$ = class {
	constructor(e, t, n, r) {
		this._httpClient = e, this._accessToken = t, this._logger = n, this._options = r, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		return Z.isRequired(e, "url"), Z.isRequired(t, "transferFormat"), Z.isIn(t, q$, "transferFormat"), this._logger.log(X.Trace, "(SSE transport) Connecting."), this._url = e, this._accessToken && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(this._accessToken)}`), new Promise((n, r) => {
			let i = !1;
			if (t !== q$.Text) {
				r(/* @__PURE__ */ Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
				return;
			}
			let a;
			if (m$.isBrowser || m$.isWebWorker) a = new this._options.EventSource(e, { withCredentials: this._options.withCredentials });
			else {
				let t = this._httpClient.getCookieString(e), n = {};
				n.Cookie = t;
				let [r, i] = S$();
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
						this._logger.log(X.Trace, `(SSE transport) data received. ${h$(e.data, this._options.logMessageContent)}.`), this.onreceive(e.data);
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
		return this._eventSource ? v$(this._logger, "SSE", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	stop() {
		return this._close(), Promise.resolve();
	}
	_close(e) {
		this._eventSource && (this._eventSource.close(), this._eventSource = void 0, this.onclose && this.onclose(e));
	}
}, Z$ = class {
	constructor(e, t, n, r, i, a) {
		this._logger = n, this._accessTokenFactory = t, this._logMessageContent = r, this._webSocketConstructor = i, this._httpClient = e, this.onreceive = null, this.onclose = null, this._headers = a;
	}
	async connect(e, t) {
		Z.isRequired(e, "url"), Z.isRequired(t, "transferFormat"), Z.isIn(t, q$, "transferFormat"), this._logger.log(X.Trace, "(WebSockets transport) Connecting.");
		let n;
		return this._accessTokenFactory && (n = await this._accessTokenFactory()), new Promise((r, i) => {
			e = e.replace(/^http/, "ws");
			let a, o = this._httpClient.getCookieString(e), s = !1;
			if (m$.isNode || m$.isReactNative) {
				let t = {}, [r, i] = S$();
				t[r] = i, n && (t[W$.Authorization] = `Bearer ${n}`), o && (t[W$.Cookie] = o), a = new this._webSocketConstructor(e, void 0, { headers: {
					...t,
					...this._headers
				} });
			} else n && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(n)}`);
			a ||= new this._webSocketConstructor(e), t === q$.Binary && (a.binaryType = "arraybuffer"), a.onopen = (t) => {
				this._logger.log(X.Information, `WebSocket connected to ${e}.`), this._webSocket = a, s = !0, r();
			}, a.onerror = (e) => {
				let t = null;
				t = typeof ErrorEvent < "u" && e instanceof ErrorEvent ? e.error : "There was an error with the transport", this._logger.log(X.Information, `(WebSockets transport) ${t}.`);
			}, a.onmessage = (e) => {
				if (this._logger.log(X.Trace, `(WebSockets transport) data received. ${h$(e.data, this._logMessageContent)}.`), this.onreceive) try {
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
		return this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN ? (this._logger.log(X.Trace, `(WebSockets transport) sending data. ${h$(e, this._logMessageContent)}.`), this._webSocket.send(e), Promise.resolve()) : Promise.reject("WebSocket is not in the OPEN state");
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
}, Q$ = 100, $$ = class {
	constructor(t, n = {}) {
		if (this._stopPromiseResolver = () => {}, this.features = {}, this._negotiateVersion = 1, Z.isRequired(t, "url"), this._logger = y$(n.logger), this.baseUrl = this._resolveUrl(t), n ||= {}, n.logMessageContent = n.logMessageContent !== void 0 && n.logMessageContent, typeof n.withCredentials == "boolean" || n.withCredentials === void 0) n.withCredentials = n.withCredentials === void 0 || n.withCredentials;
		else throw Error("withCredentials option was not a 'boolean' or 'undefined' value");
		n.timeout = n.timeout === void 0 ? 1e5 : n.timeout;
		let r = null, i = null;
		if (m$.isNode && e !== void 0) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			r = t("ws"), i = t("eventsource");
		}
		!m$.isNode && typeof WebSocket < "u" && !n.WebSocket ? n.WebSocket = WebSocket : m$.isNode && !n.WebSocket && r && (n.WebSocket = r), !m$.isNode && typeof EventSource < "u" && !n.EventSource ? n.EventSource = EventSource : m$.isNode && !n.EventSource && i !== void 0 && (n.EventSource = i), this._httpClient = new G$(n.httpClient || new M$(this._logger), n.accessTokenFactory), this._connectionState = "Disconnected", this._connectionStarted = !1, this._options = n, this.onreceive = null, this.onclose = null;
	}
	async start(e) {
		if (e ||= q$.Binary, Z.isIn(e, q$, "transferFormat"), this._logger.log(X.Debug, `Starting connection with transfer format '${q$[e]}'.`), this._connectionState !== "Disconnected") return Promise.reject(/* @__PURE__ */ Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
		if (this._connectionState = "Connecting", this._startInternalPromise = this._startInternal(e), await this._startInternalPromise, this._connectionState === "Disconnecting") {
			let e = "Failed to start the HttpConnection before stop() was called.";
			return this._logger.log(X.Error, e), await this._stopPromise, Promise.reject(new i$(e));
		}
		if (this._connectionState !== "Connected") {
			let e = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
			return this._logger.log(X.Error, e), Promise.reject(new i$(e));
		}
		this._connectionStarted = !0;
	}
	send(e) {
		return this._connectionState === "Connected" ? (this._sendQueue ||= new t1(this.transport), this._sendQueue.send(e)) : Promise.reject(/* @__PURE__ */ Error("Cannot send data if the connection is not in the 'Connected' State."));
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
				if (this._options.transport === K$.WebSockets) this.transport = this._constructTransport(K$.WebSockets), await this._startTransport(t, e);
				else throw Error("Negotiation can only be skipped when using the WebSocket transport directly.");
			} else {
				let n = null, r = 0;
				do {
					if (n = await this._getNegotiationResponse(t), this._connectionState === "Disconnecting" || this._connectionState === "Disconnected") throw new i$("The connection was stopped during negotiation.");
					if (n.error) throw Error(n.error);
					if (n.ProtocolVersion) throw Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
					if (n.url && (t = n.url), n.accessToken) {
						let e = n.accessToken;
						this._accessTokenFactory = () => e, this._httpClient._accessToken = e, this._httpClient._accessTokenFactory = void 0;
					}
					r++;
				} while (n.url && r < Q$);
				if (r === Q$ && n.url) throw Error("Negotiate redirection limit exceeded.");
				await this._createTransport(t, this._options.transport, n, e);
			}
			this.transport instanceof Y$ && (this.features.inherentKeepAlive = !0), this._connectionState === "Connecting" && (this._logger.log(X.Debug, "The HttpConnection connected successfully."), this._connectionState = "Connected");
		} catch (e) {
			return this._logger.log(X.Error, "Failed to start the connection: " + e), this._connectionState = "Disconnected", this.transport = void 0, this._stopPromiseResolver(), Promise.reject(e);
		}
	}
	async _getNegotiationResponse(e) {
		let t = {}, [n, r] = S$();
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
			return (!n.negotiateVersion || n.negotiateVersion < 1) && (n.connectionToken = n.connectionId), n.useStatefulReconnect && this._options._useStatefulReconnect !== !0 ? Promise.reject(new c$("Client didn't negotiate Stateful Reconnect but the server did.")) : n;
		} catch (e) {
			let t = "Failed to complete negotiation with the server: " + e;
			return e instanceof n$ && e.statusCode === 404 && (t += " Either this is not a SignalR endpoint or there is a proxy blocking the connection."), this._logger.log(X.Error, t), Promise.reject(new c$(t));
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
					if (this._logger.log(X.Error, `Failed to start the transport '${n.transport}': ${e}`), s = void 0, a.push(new s$(`${n.transport} failed: ${e}`, K$[n.transport])), this._connectionState !== "Connecting") {
						let e = "Failed to select transport before stop() was called.";
						return this._logger.log(X.Debug, e), Promise.reject(new i$(e));
					}
				}
			}
		}
		return a.length > 0 ? Promise.reject(new l$(`Unable to connect to the server with any of the available transports. ${a.join(" ")}`, a)) : Promise.reject(/* @__PURE__ */ Error("None of the transports supported by the client are supported by the server."));
	}
	_constructTransport(e) {
		switch (e) {
			case K$.WebSockets:
				if (!this._options.WebSocket) throw Error("'WebSocket' is not supported in your environment.");
				return new Z$(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
			case K$.ServerSentEvents:
				if (!this._options.EventSource) throw Error("'EventSource' is not supported in your environment.");
				return new X$(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
			case K$.LongPolling: return new Y$(this._httpClient, this._logger, this._options);
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
		let i = K$[e.transport];
		if (i == null) return this._logger.log(X.Debug, `Skipping transport '${e.transport}' because it is not supported by this client.`), /* @__PURE__ */ Error(`Skipping transport '${e.transport}' because it is not supported by this client.`);
		if (e1(t, i)) {
			if (e.transferFormats.map((e) => q$[e]).indexOf(n) >= 0) {
				if (i === K$.WebSockets && !this._options.WebSocket || i === K$.ServerSentEvents && !this._options.EventSource) return this._logger.log(X.Debug, `Skipping transport '${K$[i]}' because it is not supported in your environment.'`), new a$(`'${K$[i]}' is not supported in your environment.`, i);
				this._logger.log(X.Debug, `Selecting transport '${K$[i]}'.`);
				try {
					return this.features.reconnect = i === K$.WebSockets ? r : void 0, this._constructTransport(i);
				} catch (e) {
					return e;
				}
			}
			return this._logger.log(X.Debug, `Skipping transport '${K$[i]}' because it does not support the requested transfer format '${q$[n]}'.`), /* @__PURE__ */ Error(`'${K$[i]}' does not support ${q$[n]}.`);
		}
		return this._logger.log(X.Debug, `Skipping transport '${K$[i]}' because it was disabled by the client.`), new o$(`'${K$[i]}' is disabled by the client.`, i);
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
		if (!m$.isBrowser) throw Error(`Cannot resolve '${e}'.`);
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
function e1(e, t) {
	return !e || (t & e) !== 0;
}
var t1 = class e {
	constructor(e) {
		this._transport = e, this._buffer = [], this._executing = !0, this._sendBufferedData = new n1(), this._transportResult = new n1(), this._sendLoopPromise = this._sendLoop();
	}
	send(e) {
		return this._bufferData(e), this._transportResult ||= new n1(), this._transportResult.promise;
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
			this._sendBufferedData = new n1();
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
}, n1 = class {
	constructor() {
		this.promise = new Promise((e, t) => [this._resolver, this._rejecter] = [e, t]);
	}
	resolve() {
		this._resolver();
	}
	reject(e) {
		this._rejecter(e);
	}
}, r1 = "json", i1 = class {
	constructor() {
		this.name = r1, this.version = 2, this.transferFormat = q$.Text;
	}
	parseMessages(e, t) {
		if (typeof e != "string") throw Error("Invalid input for JSON hub protocol. Expected a string.");
		if (!e) return [];
		t === null && (t = f$.instance);
		let n = N$.parse(e), r = [];
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
		return N$.write(JSON.stringify(e));
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
}, a1 = {
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
function o1(e) {
	let t = a1[e.toLowerCase()];
	if (t !== void 0) return t;
	throw Error(`Unknown log level: ${e}`);
}
var s1 = class {
	configureLogging(e) {
		if (Z.isRequired(e, "logging"), c1(e)) this.logger = e;
		else if (typeof e == "string") {
			let t = o1(e);
			this.logger = new x$(t);
		} else this.logger = new x$(e);
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
		return this.reconnectPolicy = e ? Array.isArray(e) ? new U$(e) : e : new U$(), this;
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
		let t = new $$(this.url, e);
		return V$.create(t, this.logger || f$.instance, this.protocol || new i1(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
	}
};
function c1(e) {
	return e.log !== void 0;
}
//#endregion
//#region src/transport/attach-gate.ts
var l1 = class extends Error {
	byServerError;
	constructor(e) {
		super("the connection to the server dropped under the call; it is reconnecting.", { cause: e }), this.name = "ConnectionDropped", this.byServerError = e instanceof Error && e.message.startsWith("Server returned an error on close");
	}
}, u1 = class {
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
}, d1 = 500;
function f1(e) {
	let { changes: t, ...n } = e;
	return n;
}
function p1() {
	return {};
}
function m1(e) {
	return typeof e == "string" ? e : null;
}
var h1 = class {
	windowId;
	connection;
	started = !1;
	gate = new u1();
	inbound;
	constructor(e, t, n = {}) {
		this.windowId = e, this.inbound = new QQ(t), this.connection = new s1().withUrl(n.hubUrl ?? "/_ne/hub").withAutomaticReconnect([...n.reconnectDelays ?? [
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
		this.connection.on("ui.changes", this.inbound.pushed((t, n) => e(t, m1(n))));
	}
	onCommandResult(e) {
		this.connection.on("ui.commandResult", this.inbound.pushed((t, n) => e(t, m1(n))));
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
		return await this.invokeAsync("ProcessEventAsync", [e], (e) => this.inbound.answered(e, (e) => e.changes, f1));
	}
	async requestLeaveAsync(e) {
		return await this.invokeAsync("RequestLeaveAsync", [{ target: e }], (e) => this.inbound.answered(e, (e) => e.changes, f1));
	}
	async navigateInPlaceAsync(e) {
		return await this.invokeAsync("NavigateInPlaceAsync", [{ parameters: e }], (e) => this.inbound.answered(e, (e) => e.changes, f1));
	}
	async processChangeSetAsync(e, t) {
		try {
			await this.invokeAsync("ProcessChangeSetAsync", [e], (e) => this.inbound.answered(e, (e) => e, p1, t));
		} catch (e) {
			throw this.isReconnecting && this.gate.failure === null ? new l1(e) : e;
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
		await this.invokeAsync("RequestItemWindowAsync", [e], (e) => this.inbound.answered(e, (e) => e, p1));
	}
	async invokeAsync(e, t, n) {
		let r = window.setTimeout(() => s("call waiting behind the attach.", { methodName: e }), d1);
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
}, g1 = Promise.resolve(), _1 = () => {}, v1 = UQ * 3 / 4, y1 = 128, b1 = class {
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
		if (this.handed >= this.given) return g1;
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
		for (; this.flight !== null;) await this.flight.catch(_1);
	}
	dispatchAsync(e, t) {
		let n = ++this.given, r = GQ(e.value), i = r === null ? null : JQ(r);
		return i?.catch(_1), new Promise((a, o) => {
			let s = S1(e), c = this.queue.findIndex((e) => e.field === s), l = [{
				resolve: a,
				reject: o
			}], u = n;
			c >= 0 && (l = [...this.queue[c].settles, ...l], u = this.queue[c].sequence, this.queue.splice(c, 1));
			let d = r === null ? x1(e) : x1({
				...e,
				value: void 0
			}) + y1;
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
		let i = n.length === 0 ? null : this.transport.processChangeSetAsync({ updates: n }, C1(r));
		if (this.markHanded(t), i !== null) try {
			await i;
			for (let e of r) for (let t of e.settles) t.resolve();
		} catch (e) {
			if (e instanceof l1) {
				this.requeue(r, e);
				return;
			}
			for (let t of r) for (let n of t.settles) n.reject(e);
		}
	}
	takeBatch() {
		let e = 0, t = 0;
		for (; e < this.queue.length && (e === 0 || t + this.queue[e].bytes <= v1);) t += this.queue[e].bytes, e++;
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
		let t = this.transport.whenAttached().then(() => JQ(e));
		return t.catch(_1), t;
	}
	markHanded(e) {
		this.handed = Math.max(this.handed, e);
		for (let e = this.sentWaiters.length - 1; e >= 0; e--) {
			let t = this.sentWaiters[e];
			t.through <= this.handed && (this.sentWaiters.splice(e, 1), t.resolve());
		}
	}
};
function x1(e) {
	return new TextEncoder().encode(JSON.stringify(e)).byteLength;
}
function S1(e) {
	return `${e.componentId}:${e.propertyName}:${JSON.stringify(e.dynamicParameters)}`;
}
function C1(e) {
	let t = e.map((e) => e.before).filter((e) => e !== void 0);
	if (t.length !== 0) return () => {
		for (let e of t) e();
	};
}
//#endregion
//#region src/updates/content-fills.ts
var w1 = "content-fills", T1 = "content", E1 = "data-ui-root", D1 = "--ui-height", O1 = "var(--ui-fill-height";
function k1(e) {
	let t = e.parentElement;
	if (t === null || t.getAttribute("data-ui-region") !== "content") return;
	let n = t.parentElement;
	if (n === null || !n.hasAttribute(E1)) return;
	let r = e.style.getPropertyValue(D1).trimStart().startsWith(O1);
	n.hasAttribute("data-ui-content-fills") !== r && n.toggleAttribute(Nn, r);
}
//#endregion
//#region src/updates/form-owner.ts
var A1 = "form-owner", j1 = "ui-form-";
function M1(e) {
	return j1 + e.replace(/[ \t\n\f\r]/g, "_");
}
function N1(e, t) {
	if (typeof t != "string" || t.trim().length === 0) {
		e.hasAttribute("form") && e.removeAttribute("form");
		return;
	}
	let n = M1(t);
	F1(n), e.getAttribute("form") !== n && e.setAttribute("form", n);
}
function P1(e) {
	for (let t of e.querySelectorAll("[form]")) {
		let e = t.getAttribute("form");
		e !== null && e.startsWith(j1) && F1(e);
	}
}
function F1(e) {
	let t = I1();
	if (t.querySelector(`form[id="${Yi(e)}"]`) !== null) return;
	let n = document.createElement("form");
	n.setAttribute("id", e), n.setAttribute("method", "dialog"), n.setAttribute("novalidate", ""), t.appendChild(n);
}
function I1() {
	let e = document.body.querySelector(`[${cn}]`);
	if (e !== null) return e;
	let t = document.createElement("div");
	return t.setAttribute(cn, ""), t.setAttribute("hidden", ""), document.body.appendChild(t);
}
//#endregion
//#region src/interactions/legacy-commands.ts
var L1 = document;
function R1() {
	try {
		return L1.execCommand("copy");
	} catch {
		return !1;
	}
}
function z1(e) {
	try {
		return typeof L1.execCommand == "function" && L1.execCommand("insertText", !1, e);
	} catch {
		return !1;
	}
}
//#endregion
//#region src/interactions/lightbox.ts
var B1 = "ui-lightbox", V1 = "ui-lightbox-title", H1 = new _b("data-ui-lightbox-part"), U1 = "data-ui-lightbox-set", W1 = "data-ui-lightbox-slot", G1 = "data-ui-lightbox-still", K1 = "--ui-lightbox-shift", q1 = 16, J1 = 1 / 5, Y1 = null, X1 = null, Z1 = null;
function Q1(e, t, n) {
	let r = t.filter((e) => ao(e.source) !== null);
	if (r.length === 0) return s("show image effect carries no picture the page may fetch.", t), !1;
	Y1 ??= r0(e), (Y1.dialog.hasAttribute("hidden") || !Y1.dialog.isConnected) && document.body.append(Y1.dialog);
	let i = t.slice(0, Math.max(0, n)).filter((e) => ao(e.source) === null).length;
	Z1 = null, X1 = {
		pictures: r,
		index: n0(n - i, r.length)
	}, Y1.dialog.toggleAttribute(U1, r.length > 1);
	for (let e of Y1.neighbours) e.hidden = r.length < 2;
	return d0(Y1), f0(Y1, X1), e.open(B1);
}
function $1(e, t, n) {
	let r = e0(e);
	if (r === null) return null;
	let i = e.closest(`[${x}]`);
	if (!t || i === null) return {
		pictures: [r],
		start: 0
	};
	let a = [], o = 0;
	for (let t of [...n(e)].filter((e) => e.closest(`[${x}]`) === i).sort(t0)) {
		let n = t === e ? r : e0(t);
		n !== null && (t === e && (o = a.length), a.push(n));
	}
	return {
		pictures: a,
		start: o
	};
}
function e0(e) {
	let t = e.matches("img") ? e : e.querySelector("img");
	if (t === null || t.closest("[data-ui-image-failed]") !== null) return null;
	let n = t.currentSrc, r = ao(typeof n == "string" && n.length > 0 ? n : t.getAttribute("src") ?? "");
	return r === null ? null : {
		source: r,
		altText: t.getAttribute("alt") ?? ""
	};
}
function t0(e, t) {
	return e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}
function n0(e, t) {
	return Math.min(Math.max(0, Math.trunc(Number.isFinite(e) ? e : 0)), t - 1);
}
function r0(e) {
	let { dialog: t, surface: n } = gb({
		key: B1,
		className: "ui-lightbox",
		surfaceClassName: "ui-lightbox__surface",
		role: "dialog",
		labelledBy: V1,
		closesOnEscapeAndBackdrop: !0
	}), r = H1.element("h2", "ui-lightbox__title"), i = a0("ui-lightbox__close", "close"), a = H1.element("div", "ui-lightbox__stage"), [o, s] = i0("previous"), [c, l] = i0("current"), [u, d] = i0("next"), f = H1.element("div", "ui-lightbox__nav"), p = a0("ui-lightbox__step ui-lightbox__step--previous", "previous"), m = a0("ui-lightbox__step ui-lightbox__step--next", "next"), h = H1.element("span", "ui-lightbox__counter ui-text-type--caption"), g = H1.element("span", "ui-lightbox__count-room"), _ = H1.element("span", "ui-lightbox__count"), v = H1.element("p", "ui-lightbox__caption ui-text-type--body", "caption");
	return r.id = V1, _.setAttribute("aria-live", "polite"), g.setAttribute("aria-hidden", "true"), k.write(r, null, "ui.lightbox.label"), k.write(i, "aria-label", "ui.action.close"), k.write(p, "aria-label", "ui.lightbox.previous"), k.write(m, "aria-label", "ui.lightbox.next"), h.append(g, _), f.append(p, h, m), c.append(f), a.append(o, c, u), n.append(r, i, a, v), t.addEventListener("click", (t) => {
		switch (H1.pressed(t)) {
			case "close":
				e.dismiss(B1);
				break;
			case "previous":
				o0(-1);
				break;
			case "next": o0(1);
		}
	}), t.addEventListener("keydown", (e) => {
		if (e.defaultPrevented || !P(e) || X1 === null || X1.pictures.length < 2) return;
		let n = e.key === "ArrowLeft" ? -1 : +(e.key === "ArrowRight");
		n !== 0 && (e.preventDefault(), o0(m0(t) ? -n : n));
	}), h0(t, a), {
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
function i0(e) {
	let t = H1.element("div", "ui-lightbox__figure"), n = H1.element("img", "ui-lightbox__picture", e === "current" ? "picture" : void 0);
	return t.setAttribute(W1, e), n.decoding = "async", n.draggable = !1, n.addEventListener("error", () => n.setAttribute(st, "")), e !== "current" && t.setAttribute("aria-hidden", "true"), t.append(n), [t, n];
}
function a0(e, t) {
	let n = H1.element("button", e, t);
	return n.type = "button", n;
}
function o0(e) {
	if (Y1 === null || X1 === null || X1.pictures.length < 2) return;
	let t = Y1;
	if (l0(t), Xm()) {
		u0(t, e), d0(t), f0(t, X1);
		return;
	}
	let n = {
		by: e,
		landed: !1
	}, r = m0(t.dialog) ? -1 : 1;
	Z1 = n, t.stage.removeAttribute(G1), t.stage.style.setProperty(K1, `${-e * r * s0(t.stage)}px`), Qm(t.current, V.normal + 100, () => c0(t, n));
}
function s0(e) {
	return e.getBoundingClientRect().width + q1;
}
function c0(e, t) {
	if (Z1 !== t || t.landed) return;
	u0(e, t.by), t.landed = !0;
	let n = typeof e.picture.decode == "function" ? e.picture.decode().catch(() => void 0) : null;
	n === null ? l0(e) : n.then(() => {
		Z1 === t && l0(e);
	});
}
function l0(e) {
	let t = Z1;
	t !== null && X1 !== null && (Z1 = null, t.landed || u0(e, t.by), d0(e), f0(e, X1));
}
function u0(e, t) {
	if (X1 === null) return;
	let n = X1.pictures.length;
	X1.index = ((X1.index + t) % n + n) % n, p0(e.picture, X1.pictures[X1.index].source);
}
function d0(e) {
	e.stage.setAttribute(G1, ""), e.stage.style.setProperty(K1, "0px"), e.stage.getBoundingClientRect();
}
function f0(e, t) {
	let n = t.pictures.length, r = t.pictures[t.index];
	p0(e.picture, r.source), p0(e.previousPicture, t.pictures[(t.index + n - 1) % n].source), p0(e.nextPicture, t.pictures[(t.index + 1) % n].source), k.writeValue(e.picture, "alt", r.altText ?? r.caption ?? ""), k.writeValue(e.caption, null, r.caption ?? ""), e.caption.hidden = r.caption === void 0, k.write(e.count, null, "ui.lightbox.counter", {
		index: t.index + 1,
		count: n
	}), k.write(e.countRoom, null, "ui.lightbox.counter", {
		index: n,
		count: n
	});
}
function p0(e, t) {
	e.getAttribute("src") !== t && (e.removeAttribute(st), e.src = t);
}
function m0(e) {
	return getComputedStyle(e).direction === "rtl";
}
function h0(e, t) {
	Qg(e, {
		axis: "x",
		begins: (e) => e.pointerType !== "touch" || Y1 === null || X1 === null || X1.pictures.length < 2 ? !1 : (l0(Y1), !0),
		start: () => t.setAttribute(G1, ""),
		follow: (e) => t.style.setProperty(K1, `${e}px`),
		end: (n, r, i) => {
			i && g0(n, window.innerWidth, r) ? o0((m0(e) ? n > 0 : n < 0) ? 1 : -1) : (t.removeAttribute(G1), t.style.setProperty(K1, "0px"));
		}
	});
}
function g0(e, t, n) {
	return Math.abs(e) > t * J1 || Math.abs(n) > .5 && Math.abs(e) > 6;
}
//#endregion
//#region src/interactions/notification-engine.ts
var _0 = "ui-notification-host", v0 = "ui-notification", y0 = "ui-notification--leaving", b0 = "ui-notification__message", x0 = "ui-notification__title", S0 = "ui-notification__action", C0 = "ui-notification__close", w0 = 5e3, T0 = 8e3, E0 = "ui-notification--connection", D0 = "--ui-notification-lift", O0 = /* @__PURE__ */ new Set([
	"info",
	"success",
	"warning",
	"danger",
	"primary",
	"accent"
]), k0 = class {
	root;
	components;
	durationMs;
	host = null;
	announcer;
	focusOrigins = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, this.durationMs = e.durationMs ?? w0, this.ensureHost(), this.announcer = Qk(this.root instanceof Document ? this.root.body : this.root);
	}
	announce(e, t) {
		return this.announcer.announce(e, t);
	}
	show(e) {
		let t = oC(e.severity), n = document.createElement("div");
		n.className = O0.has(t) ? `${v0} ${v0}--${t}` : v0, n.classList.toggle(E0, e.connection === !0), t === "danger" && n.setAttribute("role", "alert");
		let r = document.createElement("span");
		if (r.className = b0, e.title !== void 0) {
			let t = document.createElement("span");
			t.className = x0, k.writeValue(t, null, e.title), n.append(t);
		}
		typeof e.message == "string" ? r.textContent = e.message : k.writeValue(r, null, e.message), n.append(r);
		let i = document.createElement("button");
		return i.type = "button", i.className = `${C0} ${Fi}`, k.write(i, "aria-label", "ui.action.close"), k.write(i, Re, "ui.action.close"), i.addEventListener("click", () => this.dismiss(n)), n.append(i), e.action !== void 0 && n.append(N0(e.action, e.sticky === !0 ? null : () => this.dismiss(n))), n.addEventListener("keydown", (e) => {
			e.key !== "Escape" || e.defaultPrevented || N(e) || (e.preventDefault(), this.dismiss(n));
		}), n.addEventListener("focusin", (e) => {
			let t = e.relatedTarget;
			t instanceof HTMLElement && !n.contains(t) && this.focusOrigins.set(n, t);
		}), A0(() => {
			if (n.classList.contains(y0)) return;
			let t = this.ensureHost();
			j0(t), t.append(n), e.sticky !== !0 && this.standFor(n, e);
		}), n;
	}
	standFor(e, t) {
		let n = t.durationMs !== void 0 && t.durationMs > 0 ? t.durationMs : t.action === void 0 ? this.durationMs : T0, r = !1, i = !1, a = window.setTimeout(() => this.dismiss(e), n), o = () => window.clearTimeout(a), s = () => {
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
		e.classList.contains(y0) || (e.classList.add(y0), e.isConnected && (this.returnFocus(e), Xm() || typeof e.animate != "function" ? e.remove() : window.setTimeout(() => M0(e), V.fast)));
	}
	returnFocus(e) {
		if (!e.contains(document.activeElement)) return;
		let t = [...e.parentElement?.children ?? []].find((t) => t !== e && !t.classList.contains(y0));
		Kp(Hp(this.focusOrigins.get(e), this.components) ?? t?.querySelector(`.${C0}`) ?? null, e);
	}
	ensureHost() {
		if (this.host !== null && this.host.isConnected) return this.host;
		let e = this.root instanceof Document ? this.root.body : this.root, t = e.querySelector(`.${_0}`), n = t ?? document.createElement("div");
		return n.classList.add(_0), n.setAttribute("role", "status"), n.setAttribute("aria-live", "polite"), t === null && e.append(n), this.host = n, n;
	}
};
function A0(e) {
	if (IK(document.visibilityState)) {
		e();
		return;
	}
	let t = () => {
		IK(document.visibilityState) && (document.removeEventListener("visibilitychange", t), e());
	};
	document.addEventListener("visibilitychange", t);
}
function j0(e) {
	let t = window.innerHeight - ig(window.innerHeight);
	t > 0 ? e.style.setProperty(D0, `${Math.round(t)}px`) : e.style.removeProperty(D0);
}
function M0(e) {
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
		duration: V.fast,
		easing: V.exit,
		fill: "forwards"
	}), i = () => e.remove();
	r.finished.then(i, i);
}
function N0(e, t) {
	let n = document.createElement("button"), r = !1;
	return n.type = "button", n.className = `${S0} ui-button ui-button--primary ui-button--small`, typeof e.label == "string" ? n.textContent = e.label : k.writeValue(n, null, e.label), n.addEventListener("click", () => {
		if (r) return;
		let n = e.run();
		t !== null && (r = !0, n === void 0 ? t() : n.then((e) => {
			e ? t() : r = !1;
		}, (e) => {
			r = !1, s("a notification's action failed.", e);
		}));
	}), n;
}
function P0(e, t) {
	let n = F0(e), r = e?.label;
	if (n !== void 0) {
		if (!O(r) && !mc(r)) s("a notification's action carries no words.", e);
		else return {
			label: r,
			run: () => t(n)
		};
	}
}
function F0(e) {
	return e != null && typeof e.id == "string" && e.id.length > 0 ? e.id : void 0;
}
//#endregion
//#region src/effects/insert-text.ts
function I0(e, t, n) {
	let r = e.itemKey === !0 ? L0(n) : e.text;
	if (typeof r != "string") {
		s(e.itemKey === !0 ? "insert text effect reads the row's key but ran for no row." : "insert text effect carries no text.", e);
		return;
	}
	let i = R0(t);
	i === null ? s("insert text effect target holds no text field.", e) : z0(i, r);
}
function L0(e) {
	let t = e.length === 0 ? null : e[e.length - 1];
	return t == null ? null : String(t);
}
function R0(e) {
	if (Lu(e)) return e;
	for (let t of e.querySelectorAll("input, textarea")) if (Lu(t)) return t;
	return null;
}
function z0(e, t) {
	if (t.length === 0 || e.readOnly || e.disabled || A(e) || M(e)) return !1;
	let n = e.value, r = e.selectionStart !== null, i = e.selectionStart ?? n.length, a = e.selectionEnd ?? i;
	return e.maxLength >= 0 && n.length - (a - i) + t.length > e.maxLength ? !1 : (document.activeElement !== e && e.focus({ preventScroll: !0 }), r && e.setSelectionRange(i, a), document.activeElement === e && z1(t) && e.value !== n || (r ? e.setRangeText(t, i, a, "end") : e.value = n + t, e.dispatchEvent(new Event("input", { bubbles: !0 }))), !0);
}
//#endregion
//#region src/effects/navigation-url.ts
function B0(e) {
	let t = e.request?.route;
	return t == null || t.length === 0 ? null : V0(t, e.request?.parameters ?? null);
}
function V0(e, t) {
	let n = H0(t);
	if (n.length === 0) return e;
	let r = e.indexOf("#"), i = r < 0 ? e : e.slice(0, r), a = r < 0 ? "" : e.slice(r);
	return `${i}${i.includes("?") ? i.endsWith("?") || i.endsWith("&") ? "" : "&" : "?"}${n}${a}`;
}
function H0(e) {
	if (e === null) return "";
	let t = new URLSearchParams();
	for (let [n, r] of Object.entries(e)) if (r != null) for (let e of Array.isArray(r) ? r : [r]) e != null && t.append(n, U0(e));
	return t.toString();
}
function U0(e) {
	return typeof e == "object" ? JSON.stringify(e) : String(e);
}
//#endregion
//#region src/effects/scroller.ts
function W0(e, t) {
	let n = K0([e, ...e.querySelectorAll("*")], t);
	if (n !== null) return n;
	let r = [];
	for (let t = e.parentElement; t !== null; t = t.parentElement) r.push(t);
	return K0(r, t) ?? G0(t);
}
function G0(e) {
	let t = typeof document > "u" ? null : document.scrollingElement ?? null;
	return t !== null && q0(t, e) ? t : null;
}
function K0(e, t) {
	let n = null;
	for (let r of e) if (wI(r, t)) {
		if (q0(r, t)) return r;
		n ??= r;
	}
	return n;
}
function q0(e, t) {
	return t ? e.scrollHeight > e.clientHeight : e.scrollWidth > e.clientWidth;
}
//#endregion
//#region src/effects/effect-registry.ts
var J0 = class {
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
		this.handlers.set(_a(e), t);
	}
	applyAll(e, t) {
		if (e != null) for (let n of e) this.apply({
			effect: n,
			dom: t
		});
	}
	apply(e) {
		let t = _a(e.effect?.kind), n = t.length === 0 ? void 0 : this.handlers.get(t);
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
			let t = B0(e.effect);
			t === null ? s("navigate effect carries no route.", e.effect) : eo(t) ? this.leaveFor(t) : s("navigate effect names no route of this site; not followed.", e.effect);
		}), this.register("NavigateBack", (e) => {
			if (this.address?.back() === !0) return;
			let t = e.effect.fallback;
			typeof t != "string" || !eo(t) ? s("navigate back effect has nothing to go back to and names no route of this site; not followed.", e.effect) : this.leaveFor(t);
		}), this.register("ReplaceAddress", (e) => {
			this.writeAddress(e, (e, t) => e.replace(t));
		}), this.register("PushAddress", (e) => {
			this.writeAddress(e, (e, t) => e.push(t));
		}), this.register("SetTheme", (e) => {
			let t = e.effect, n = xa(t.mode), r = n === "Unknown" ? "auto" : n.toLowerCase();
			document.documentElement.getAttribute("data-ui-theme") !== r && document.documentElement.setAttribute(Vr, r), t.stored !== !0 && this.reportTheme?.(r);
		}), this.register("Focus", (e) => {
			let t = e2(e);
			t !== null && (gJ(t), n2(t));
		}), this.register("ScrollTo", (e) => {
			let t = e2(e);
			if (t === null) return;
			let n = e.effect, r = va(n.behavior), i = ya(n.block);
			gJ(t), t.scrollIntoView({
				behavior: t2(r),
				block: i === "Unknown" ? "nearest" : i.toLowerCase()
			});
		}), this.register("ScrollToItem", (e) => {
			let t = e2(e);
			if (t === null) return;
			let n = e.effect, r = nJ(t);
			if (r === null || typeof n.key != "string" || n.key.length === 0) {
				s("scroll to item effect names no items host or no key.", e.effect);
				return;
			}
			let i = ya(n.block);
			gJ(id(r)), rJ(r, n.key, i === "Unknown" ? "Start" : i, t2(va(n.behavior))) || s("scroll to item effect names a row the host has not drawn.", e.effect);
		}), this.register("Scroll", (e) => {
			let t = e2(e);
			if (t === null) return;
			let n = e.effect, r = Sa(n.axis) !== "Horizontal", i = W0(t, r);
			if (i === null) {
				s("scroll effect target has no scrollable element.", e.effect);
				return;
			}
			let a = r ? i.clientHeight : i.clientWidth, o = (r ? i.scrollHeight : i.scrollWidth) - a, c = r ? i.scrollTop : i.scrollLeft, l = ba(n.position), u;
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
			let d = t2(va(n.behavior));
			gJ(i), r && l === "End" && bJ(i) && hJ(i), i.scrollTo(r ? {
				top: u,
				behavior: d
			} : {
				left: u,
				behavior: d
			});
		}), this.register("Show", (e) => {
			$0(e2(e), null);
		}), this.register("Hide", (e) => {
			$0(e2(e), "hidden");
		}), this.register("Collapse", (e) => {
			$0(e2(e), "collapsed");
		}), this.register("CopyToClipboard", (e) => {
			let t = r2(e, this.valueReaders);
			t !== null && i2(t).catch((e) => s("copy to clipboard failed.", e));
		}), this.register("InsertText", (e) => {
			let t = e2(e);
			t !== null && I0(e.effect, t, e.row ?? []);
		}), this.register("OpenPicker", (e) => {
			let t = e2(e);
			t !== null && !Uy(t) && s("open picker effect names no file or image input.", e.effect);
		}), this.register("OpenDialog", (e) => {
			this.applyDialogEffect(e, "OpenDialog", (e, t) => e.open(t));
		}), this.register("ShowImage", (e) => {
			let t = e.effect;
			if (this.dialogs === void 0) {
				s("show image effect arrived but no dialog engine is wired up.", t);
				return;
			}
			if (t.target === void 0 || t.target === null) {
				Q1(this.dialogs, X0(t.images), t.startIndex ?? 0);
				return;
			}
			let n = e2(e), r = n === null ? null : $1(n, t.rows === !0, (t) => e.dom.findEveryComponent(D(t)));
			r === null ? s("show image effect names a component that shows no picture.", t) : Q1(this.dialogs, r.pictures, r.start);
		}), this.register("CloseDialog", (e) => {
			let t = e.effect.raisesClose === !0;
			this.applyDialogEffect(e, "CloseDialog", (e, n) => t ? e.dismiss(n) : e.close(n));
		}), this.register("DownloadFile", (e) => {
			let t = e.effect;
			if (t.requestPath === void 0 || t.requestPath.length === 0) {
				s("download effect carries no path.", e.effect);
				return;
			}
			if (!Xa(t.requestPath)) {
				s("download effect refused: the path's scheme is not one a link may carry.", e.effect);
				return;
			}
			let n = t.requestPath;
			by.load(() => {
				let e = document.createElement("a");
				e.href = n, e.download = t.fileName ?? "", e.style.display = "none", document.body.appendChild(e), e.click(), e.remove();
			});
		}), this.register("ShowNotification", (e) => {
			let t = e.effect;
			!O(t.message) && !mc(t.message) ? s("show notification effect carries no message.", e.effect) : this.notifications === void 0 ? s("show notification effect arrived but no notification engine is wired up.", t.message) : this.notifications.show({
				message: t.message,
				severity: t.severity,
				durationMs: typeof t.durationMs == "number" ? t.durationMs : void 0,
				action: this.runAction === void 0 ? void 0 : P0(t.action, this.runAction)
			});
		}), this.register("RequestNotificationPermission", () => {
			LK() !== void 0 && Notification.requestPermission().then(() => this.clientStateChanged?.()).catch((e) => s("asking for the notification permission failed.", e));
		}), this.register("ShowSystemNotification", (e) => this.showSystemNotification(e.effect)), this.register("Announce", (e) => {
			let t = e.effect;
			!O(t.message) && !mc(t.message) ? s("announce effect carries no message.", e.effect) : this.notifications === void 0 ? s("announce effect arrived but no notification engine is wired up.", t.message) : this.notifications.announce(t.message, Ca(t.politeness) === "Assertive" ? "assertive" : "polite");
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
		if (!O(t) && !mc(t)) {
			s("system notification effect carries no title.", e);
			return;
		}
		let n = O(e.body) || mc(e.body) ? e.body : void 0, r = typeof e.address == "string" && eo(e.address) ? e.address : void 0, i = () => {
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
		if (e.when !== "Always" && IK(document.visibilityState)) {
			i();
			return;
		}
		let a = F0(e.action);
		HK({
			title: Y0(t),
			body: n === void 0 ? void 0 : Y0(n),
			tag: e.tag ?? "",
			icon: typeof e.icon == "string" && eo(e.icon) ? e.icon : Z0(),
			silent: e.silent === !0,
			requireInteraction: e.requireInteraction === !0,
			address: r ?? Q0(),
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
		return t !== void 0 && n !== void 0 && WK(t) ? {
			label: O(e.addressLabel) || mc(e.addressLabel) ? e.addressLabel : { key: "ui.notification.open" },
			run: () => n(t)
		} : this.runAction === void 0 ? void 0 : P0(e.action, this.runAction);
	}
};
function Y0(e) {
	return O(e) ? k.translate(e.key, e.args) : mc(e) ? k.resolveText(e.text) : "";
}
function X0(e) {
	let t = [];
	for (let n of e ?? []) typeof n?.source == "string" && t.push({
		source: n.source,
		caption: O(n.caption) || mc(n.caption) ? n.caption : void 0,
		altText: O(n.altText) || mc(n.altText) ? n.altText : void 0
	});
	return t;
}
function Z0() {
	let e = document.querySelector("link[rel~='icon']")?.href;
	return e === void 0 || e.startsWith("data:") ? void 0 : e;
}
function Q0() {
	return window.location.pathname + window.location.search + window.location.hash;
}
function $0(e, t) {
	if (e === null) return;
	let n = xm();
	for (let n of _i) t === null ? e.removeAttribute(n) : e.setAttribute(n, t);
	n !== null && Sm(n);
}
function e2(e) {
	let t = e.effect.target;
	if (t === void 0 || t.id === void 0) return s("targeted client effect carries no resolved component address.", e.effect), null;
	let n = e.dom.findComponent(E(t.id), t.dynamicParameters ?? []);
	return n === null && s("client effect target was not found in the DOM.", e.effect), n;
}
function t2(e) {
	return e === "Smooth" && !Xm() ? "smooth" : "auto";
}
function n2(e) {
	if (e instanceof HTMLElement && (e.tabIndex >= 0 || e.matches(tp))) {
		e.focus();
		return;
	}
	let t = Ep(e);
	t === null ? s("focus effect target has nothing focusable.", e) : t.focus();
}
function r2(e, t) {
	let n = e.effect;
	if (typeof n.text == "string") return n.text;
	let r = e2(e);
	return r === null ? null : t === void 0 ? (s("copy to clipboard effect names a component but no value reader is wired up.", e.effect), null) : Jl(r) === null ? (s("copy to clipboard effect target holds no value.", e.effect), null) : Hl(t.readHeld(r));
}
async function i2(e) {
	if (navigator.clipboard !== void 0) try {
		await navigator.clipboard.writeText(e);
		return;
	} catch {}
	if (!a2(e)) throw Error("neither the clipboard API nor the selection command took the text.");
}
function a2(e) {
	let t = document.createElement("textarea");
	t.value = e, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.opacity = "0", document.body.appendChild(t), t.select();
	try {
		return R1();
	} finally {
		t.remove();
	}
}
//#endregion
//#region src/interactions/dialog-engine.ts
var o2 = class {
	root;
	components;
	returnFocusByKey = /* @__PURE__ */ new Map();
	swipes = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, this.root.addEventListener("mousedown", (e) => s2(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0);
	}
	open(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (!t.hasAttribute("hidden")) return !0;
		t.removeAttribute("hidden");
		let n = t.querySelector(".ui-dialog__surface") ?? t, r = Ep(t), i = yp() && Lu(r);
		i && !n.hasAttribute("tabindex") && (n.tabIndex = -1);
		let a = zp(n, i ? n : r);
		return a !== null && this.returnFocusByKey.set(e, a), c2(t) && this.swipes.set(e, i_(n, n, () => this.dismiss(e))), !0;
	}
	close(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (t.hasAttribute("hidden")) return !0;
		let n = this.returnFocusByKey.get(e);
		return this.returnFocusByKey.delete(e), this.swipes.get(e)?.(), this.swipes.delete(e), t.contains(document.activeElement) && Kp(Hp(n, this.components), t), t.setAttribute("hidden", ""), !0;
	}
	closeAll() {
		for (let e of this.root.querySelectorAll(`[${vg}]:not([hidden])`)) {
			let t = e.getAttribute(vg);
			t !== null && this.close(t);
		}
	}
	find(e) {
		return this.root.querySelector(`[${vg}="${Yi(e)}"]`);
	}
	handleClick(e) {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest(`[${bg}]`);
		if (n === null) return;
		let r = n.closest(`[${vg}]`);
		if (!(r instanceof HTMLElement) || r.hasAttribute("hidden") || !r.hasAttribute("data-ui-dialog-close-backdrop")) return;
		let i = r.getAttribute(vg);
		i !== null && this.dismiss(i);
	}
	handleKeydown(e) {
		if (e.defaultPrevented || N(e)) return;
		let t = this.getTopmostOpen();
		if (!(t === null || Dg(t))) {
			if (e.key === "Escape" && t.hasAttribute("data-ui-dialog-close-escape") && !Ig() && !Ou(e)) {
				let n = t.getAttribute(vg);
				n !== null && (e.preventDefault(), this.dismiss(n));
			} else e.key === "Tab" && t.hasAttribute("data-ui-dialog-modal") && jp(t, e);
		}
	}
	dismiss(e) {
		let t = this.find(e), n = t !== null && !t.hasAttribute("hidden");
		return !this.close(e) || !n || t === null ? !1 : (t.querySelector(w)?.dispatchEvent(new Event("close", { bubbles: !0 })), !0);
	}
	getTopmostOpen() {
		return Tg(this.root);
	}
};
function s2(e) {
	let t = e.target instanceof Element ? e.target.closest(`[${bg}]`) : null;
	t !== null && t.closest("[data-ui-dialog]:not([hidden])") !== null && e.preventDefault();
}
function c2(e) {
	return e.getAttribute("data-ui-dialog-placement") === "bottom" && (e.hasAttribute("data-ui-dialog-close-backdrop") || e.hasAttribute("data-ui-dialog-close-escape"));
}
//#endregion
//#region src/interactions/leave-dialog.ts
var l2 = "ui-leave", u2 = new _b("data-ui-leave-part"), d2 = "560px", f2 = null, p2 = null;
function m2(e, t) {
	f2 ??= h2();
	let n = f2;
	n.isConnected || document.body.append(n), g2(n, "title", k.text("ui.leave.title")), g2(n, "message", k.text("ui.leave.message")), g2(n, "stay", k.text("ui.leave.stay")), g2(n, "leave", k.text("ui.leave.confirm")), p2 = {
		dialogs: e,
		leave: t
	}, e.open(l2);
}
function h2() {
	let { dialog: e, surface: t } = gb({
		key: l2,
		className: "ui-leave-dialog",
		role: "alertdialog",
		labelledBy: "ui-leave-title",
		describedBy: "ui-leave-message",
		closesOnEscapeAndBackdrop: !0
	});
	t.style.setProperty("--ui-max-width-sm", d2);
	let n = u2.element("h2", "ui-leave-dialog__title ui-text-type--subtitle", "title"), r = u2.element("p", "ui-leave-dialog__message ui-text-type--body", "message");
	return n.id = "ui-leave-title", r.id = "ui-leave-message", t.append(n, r, u2.actions(u2.button("ui-button--ghost", "stay"), u2.button("ui-button--danger", "leave"))), e.addEventListener("click", (e) => {
		let t = u2.pressed(e);
		if (t !== "stay" && t !== "leave") return;
		let n = p2;
		p2 = null, n?.dialogs.close(l2), t === "leave" && n?.leave();
	}), e;
}
function g2(e, t, n) {
	let r = u2.find(e, t);
	r !== null && r.textContent !== n && (r.textContent = n);
}
//#endregion
//#region src/interactions/leave-guard.ts
var _2 = class {
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
		let t = v2(e, this.options.window.location.href);
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
function v2(e, t) {
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
	return eo(s) ? s : null;
}
//#endregion
//#region src/interactions/navigation-progress.ts
var y2 = 200, b2 = 1e4, x2 = "ui-navigation-progress", S2 = class {
	window;
	shownAfter;
	givenUpAfter;
	bar = null;
	timer = null;
	wait = null;
	constructor(e) {
		this.window = e.window, this.shownAfter = e.shownAfterMilliseconds ?? y2, this.givenUpAfter = e.givenUpAfterMilliseconds ?? b2, this.window.addEventListener("click", (e) => this.handlePress(e)), this.window.addEventListener("pageshow", (e) => {
			e.persisted === !0 && this.stop();
		}), this.window.addEventListener("pageswap", () => this.stop()), this.window.navigation?.addEventListener("navigateerror", () => this.stop());
	}
	handlePress(e) {
		v2(e, this.window.location.href) !== null && this.start(e);
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
		this.timer = null, e?.defaultPrevented === !0 ? this.stop() : (this.bar ??= C2(), document.body.append(this.bar), this.giveUpLater());
	}
	stop() {
		this.wait = null, this.clearTimer(), this.bar?.remove();
	}
};
function C2() {
	let e = document.createElement("div"), t = document.createElement("span"), n = document.createElement("span");
	return e.className = `${x2} ui-progress ui-progress--linear`, e.setAttribute("aria-hidden", "true"), t.className = "ui-progress__track", n.className = "ui-progress__fill", t.append(n), e.append(t), e;
}
//#endregion
//#region src/effects/address-history.ts
var w2 = "neEntry", T2 = class {
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
		this.window = e.window, this.revisit = e.revisit, this.switchRuntime = e.switchRuntime, this.load = e.load, this.route = e.window.location.pathname, this.search = e.window.location.search, this.entry = E2(e.window.history.state) ?? 0, E2(e.window.history.state) === null && e.window.history.replaceState({ [w2]: this.entry }, ""), e.window.addEventListener("popstate", () => this.onPopState());
	}
	replace(e) {
		this.write(V0(this.route, e), !1);
	}
	push(e) {
		let t = V0(this.route, e), n = this.window.location;
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
		t ? (this.entry++, this.window.history.pushState({ [w2]: this.entry }, "", e)) : this.window.history.replaceState({ [w2]: this.entry }, "", e), this.search = this.window.location.search;
	}
	onPopState() {
		let e = this.window.location, t = E2(this.window.history.state), n = t === null ? null : t - this.entry;
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
		}, this.switchRuntime(e.search, r) || this.revisit(k2(e.search));
	}
};
function E2(e) {
	if (typeof e != "object" || !e) return null;
	let t = e[w2];
	return typeof t == "number" ? t : null;
}
function D2(e, t, n) {
	if (n.length === 0) return !1;
	let r = new URLSearchParams(e), i = new URLSearchParams(t);
	return n.some((e) => O2(r, e) !== O2(i, e));
}
function O2(e, t) {
	return e.getAll(t).map(encodeURIComponent).join(",");
}
function k2(e) {
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
var A2 = {
	isHeld: () => !1,
	holdsPush: () => !1
}, j2 = class {
	addressResolver;
	operations;
	extensions;
	state;
	valueChangeHandlers = /* @__PURE__ */ new Set();
	held = A2;
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
		let i = this.addressResolver.resolveProperties(e, t), a = this.shownValue(e, n), o = BX(n, this.extensions.converters), c = !1;
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
		!this.state.set(e, t, n, () => N2(i[0]?.component)) && !this.restoring || c || this.notifyValueChanged({
			reference: e,
			propertyName: i[0]?.propertyName ?? this.addressResolver.getPropertyName(e.propertyId) ?? "",
			dynamicParameters: t,
			value: a,
			local: r,
			components: i.map((e) => e.component)
		});
	}
	shownValue(e, t) {
		return Jc(t, () => this.addressResolver.isTranslatable(e));
	}
	holdsProperty(e, t, n) {
		let r = e.getAttribute(Xe);
		if (r === null) return this.held.isHeld(e);
		let i = this.addressResolver.getBindingById(Number(r));
		return i !== void 0 && i.propertyId !== t ? !1 : this.held.holdsPush(e, n);
	}
	applyOperation(e, t, n, r, i, a, o) {
		a !== null && RX(t, n) ? this.operations.apply({
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
		return this.state.set(e, t, n, () => N2(r[0]?.component)) ? {
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
			(typeof n == "string" || mc(n) ? this.addressResolver.isTranslatable(t.reference) : O(n)) && (e === void 0 || e(n)) && this.applyPropertyValue(t.reference, t.dynamicParameters, n, !1);
		}
	}
	rewriteStatic(e, t, n) {
		let r = this.addressResolver.resolvePropertyOn(e, t);
		if (r === null) return;
		let i = `[${Ye}${Xi(r.propertyName)}]`;
		this.applyOperations(r, n, this.shownValue(t, n), (t) => $i(e, t, () => M2(e, i)));
	}
	applyOperations(e, t, n, r) {
		let i = BX(t, this.extensions.converters);
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
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(Xe))), r = e.closest(w);
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
		if (!this.state.has(r, t)) Zl(e);
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
function M2(e, t) {
	if (e.matches(t)) return [e];
	for (let n of e.querySelectorAll(t)) if (n.closest("[data-ui-id]") === e) return [n];
	return [e];
}
function N2(e) {
	let t = [], n = e?.closest("[data-ui-key]") ?? null;
	for (; n !== null;) {
		let e = n.parentElement?.closest("[data-ui-id]") ?? null, r = e === null ? 0 : D(e), i = n.getAttribute(b);
		e !== null && r > 0 && i !== null && t.push({
			host: r,
			hostParameters: ja(e, Aa(e)),
			key: i
		}), n = n.parentElement?.closest("[data-ui-key]") ?? null;
	}
	return t;
}
//#endregion
//#region src/updates/reactive-source-registry.ts
var P2 = "EndValue", F2 = class {
	watchers = /* @__PURE__ */ new Map();
	sourcesByComponent = /* @__PURE__ */ new Map();
	propertyPatchEngine;
	edits;
	constructor(e, t) {
		if (this.propertyPatchEngine = e, this.edits = t, e.addValueChangeHandler((e) => this.notify(e)), t !== void 0) for (let e of $p) t.root.addEventListener(e, (e) => this.applyEditedValue(e, t), !0);
	}
	watch(e, t) {
		let n = E(e.componentId), r = L2(n, e.propertyId), i = this.watchers.get(r);
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
		let t = this.edits?.root.querySelector(`[data-ui-id="${E(e.componentId)}"]`) ?? null, n = t === null ? null : I2(e, this.edits?.metadata) ? t.querySelector(`[${Bt}]`) : Jl(t);
		this.edits !== void 0 && n !== null && this.propertyPatchEngine.recordValue(e, [], this.edits.valueReaders.readBound(n));
	}
	applyEditedValue(e, t) {
		if (!(e.target instanceof Element)) return;
		let n = Ha(e.target), r = n === null ? void 0 : this.sourcesByComponent.get(n);
		if (r === void 0) return;
		let i = t.valueReaders.readBound(e.target), a = e.target.hasAttribute(Bt);
		for (let e of r) {
			if (t.metadata !== void 0 && I2(e, t.metadata) !== a) continue;
			let n = this.propertyPatchEngine.recordValue(e, [], i);
			n !== null && this.notify(n);
		}
	}
	notify(e) {
		let t = L2(E(e.reference.componentId), e.reference.propertyId), n = this.watchers.get(t);
		if (n !== void 0) for (let t of n) t(e);
	}
};
function I2(e, t) {
	return t?.getPropertyDefinition(e.propertyId)?.propertyName === P2;
}
function L2(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/items/composite-slots.ts
function R2(e) {
	let t = [];
	for (let n of e.children) {
		let e = n.hasAttribute("data-ui-key") ? n.firstElementChild : null, r = e === null ? 0 : D(e);
		e !== null && r > 0 && t.push([e, r]);
	}
	return t;
}
//#endregion
//#region src/items/held-collections.ts
var z2 = class {
	collections = /* @__PURE__ */ new Map();
	rowCollections = /* @__PURE__ */ new Map();
	waiting = /* @__PURE__ */ new WeakMap();
	hold(e, t) {
		this.collections.set(e, U2(t));
	}
	apply(e) {
		let t = E(e.component?.id), n = this.collections.get(t);
		n === void 0 && (n = [], this.collections.set(t, n)), B2(n, e);
	}
	get(e) {
		return this.collections.get(e);
	}
	holdRow(e, t, n) {
		this.rowCollections.set(V2(e, t), {
			componentId: e,
			dynamicParameters: t,
			rows: U2(n)
		});
	}
	applyRow(e) {
		let t = E(e.component?.id), n = e.component?.dynamicParameters ?? [], r = V2(t, n), i = this.rowCollections.get(r);
		i === void 0 && (i = {
			componentId: t,
			dynamicParameters: n,
			rows: []
		}, this.rowCollections.set(r, i)), B2(i.rows, e);
	}
	getRow(e, t) {
		return this.rowCollections.get(V2(e, t))?.rows;
	}
	forgetRows(e, t) {
		for (let [n, r] of this.rowCollections) t(r.componentId) && H2(r.dynamicParameters, e) && this.rowCollections.delete(n);
	}
	writeRowItem(e, t, n, r) {
		let i = !1;
		for (let a of this.rowCollections.values()) {
			if (!n(a.componentId) || a.dynamicParameters.length !== e.length || !H2(a.dynamicParameters, e)) continue;
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
function B2(e, t) {
	switch (pa(t.action)) {
		case "Insert":
			for (let n of t.items ?? []) W2(e, n);
			break;
		case "Remove":
			for (let n of t.items ?? []) G2(e, n.key);
			break;
		case "Replace":
			for (let n of t.items ?? []) K2(e, n);
			break;
		case "Move":
			for (let n of t.moves ?? []) q2(e, n.key, n.newIndex);
			break;
		case "Reset": e.length = 0;
	}
}
function V2(e, t) {
	return `${e}:${ma(t)}`;
}
function H2(e, t) {
	if (e.length < t.length) return !1;
	for (let n = 0; n < t.length; n++) if (String(e[n] ?? "") !== String(t[n] ?? "")) return !1;
	return !0;
}
function U2(e) {
	let t = [];
	for (let n of e) typeof n.key == "string" && t.push({
		key: n.key,
		item: n.item
	});
	return t;
}
function W2(e, t) {
	typeof t.key == "string" && (G2(e, t.key), e.splice(J2(t.index, e.length), 0, {
		key: t.key,
		item: t.item
	}));
}
function G2(e, t) {
	let n = e.findIndex((e) => e.key === t);
	n >= 0 && e.splice(n, 1);
}
function K2(e, t) {
	if (typeof t.key != "string") return;
	let n = e.findIndex((e) => e.key === (t.oldKey ?? t.key));
	n < 0 ? W2(e, t) : e[n] = {
		key: t.key,
		item: t.item
	};
}
function q2(e, t, n) {
	let r = e.findIndex((e) => e.key === t);
	if (r < 0) return;
	let [i] = e.splice(r, 1);
	e.splice(J2(n, e.length), 0, i);
}
function J2(e, t) {
	return typeof e == "number" && e >= 0 && e < t ? e : t;
}
//#endregion
//#region src/items/item-projections.ts
var Y2 = class {
	byHost = /* @__PURE__ */ new Map();
	records = /* @__PURE__ */ new WeakMap();
	reported = /* @__PURE__ */ new Set();
	get isEmpty() {
		return this.byHost.size === 0;
	}
	describe(e, t) {
		this.byHost.set(e, X2(e, "", t.map((e) => e.split("."))));
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
function X2(e, t, n) {
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
	for (let [n, a] of r) i.set(n, a.whole || a.rest.length === 0 ? null : X2(e, `${t}${a.name}.`, a.rest));
	return {
		host: e,
		prefix: t,
		members: i
	};
}
function Z2(e) {
	let t = new Y2();
	for (let n of e.metadata.items) n.itemPaths !== null && n.itemPaths !== void 0 && t.describe(E(n.componentId), n.itemPaths);
	return t;
}
//#endregion
//#region src/items/pending-moves.ts
var Q2 = class {
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
}, $2 = class {
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
function e4(e, t) {
	let n = t4(e[t], "Reset");
	if (n === null) return null;
	let r = E(n.component?.id), i = n.component?.dynamicParameters ?? [];
	if (r <= 0) return null;
	let a = null, o = null, s = t + 1;
	for (; s < e.length; s++) {
		let t = t4(e[s], "Insert");
		if (t === null || E(t.component?.id) !== r || !Jp(i, t.component?.dynamicParameters ?? [])) break;
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
function t4(e, t) {
	if (e === void 0 || ga(e) !== "CollectionChange") return null;
	let n = e;
	return pa(n.action) === t ? n : null;
}
//#endregion
//#region src/updates/collection-sinks.ts
var n4 = class {
	handlers = /* @__PURE__ */ new Map();
	register(e) {
		this.handlers.set(e.kind, e.handler);
	}
	dispatch(e, t) {
		let n = this.handlers.get(e);
		return n !== void 0 && (n(t), !0);
	}
};
function r4(e, t, n, r) {
	return {
		action: pa(e.action),
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
var i4 = [], a4 = class {
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
	held = new z2();
	projections;
	touched = null;
	changedHosts = null;
	moves = new Q2({
		indexOf: (e, t) => this.indexOfRow(e, t),
		move: (e, t, n) => this.moveRow(e, t, n)
	});
	transfers = new $2({
		take: (e, t) => this.takeRow(e, t),
		restore: (e, t) => this.restoreRow(e, t),
		place: (e, t, n, r) => this.placeRow(e, t, n, r),
		remove: (e, t) => this.removeRow(e, t),
		holds: (e, t) => m4(K(e), t) !== null,
		itemOf: (e) => this.readItemValue(e)
	});
	constructor(e, t, n, r, i, a, o, s, c) {
		this.metadata = e, this.propertyPatchEngine = t, this.state = n, this.itemsRenderer = r, this.itemsTemplates = i, this.dom = a, this.virtualization = o, this.sinks = s, this.rowMenus = c, r.setRowFiller((e) => this.fillHeldCollections(e)), t.addValueChangeHandler((e) => this.writeHeldItemValue(e)), t.addValueChangeHandler((e) => this.touch(e.components)), this.projections = Z2(e), this.projections.isEmpty || ck((e, t) => this.projections.check(e, t));
	}
	fillHeldCollections(e) {
		let t = [];
		for (let n of e.querySelectorAll(`[${x}]`)) {
			let e = Ha(n);
			e !== null && this.held.get(e) !== void 0 && (n.replaceChildren(), n.removeAttribute(lt), this.held.markWaiting(n, e), t.push([n, e]));
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
		for (let n = f4(e, t); n !== null; n = f4(e, t)) {
			t.add(n);
			let e = Ua(n);
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
		let r = this.metadata.getBindingByComponentAndPropertyId(t, e.reference.propertyId), i = r === void 0 ? null : yk(r);
		if (i === null || i.scopeComponentId > 0 && !this.rowMenus.inOneMenu(i.scopeComponentId, t)) return;
		let a = this.state.get(e.reference, n);
		this.held.writeRowItem(n.slice(0, -1), String(n[n.length - 1] ?? ""), (e) => this.rowMenus.inOneMenu(e, t), (e) => UX(e, i.steps, a)) && this.rowMenus.heldChanged();
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
			return n === void 0 && (n = h4(e), t.set(e, n)), n;
		};
		this.registerRenderedRows(this.dom.root, n);
		for (let t of e?.updates ?? []) {
			if (ga(t) !== "CollectionChange") continue;
			let e = t;
			if (pa(e.action) !== "Insert") continue;
			let r = E(e.component?.id);
			for (let t of this.findItemsHosts(r, e.component?.dynamicParameters ?? [])) {
				let i = n(t);
				for (let t of e.items ?? []) this.registerItemValue(r, i, t.key, t.item);
			}
		}
	}
	registerRenderedRows(e, t = (e) => h4(e)) {
		for (let n of e.querySelectorAll(`[${x}]`)) {
			let e = Ua(n);
			if (e === null) continue;
			let r = this.metadata.getItemValues(e.componentId, e.dynamicParameters);
			this.projections.isEmpty || this.projections.mark(e.componentId, r);
			for (let i of r) this.registerItemValue(e.componentId, t(n), i.key, i.item);
		}
	}
	registerItemValue(e, t, n, r) {
		if (n == null) return;
		let i = t.get(n) ?? null;
		if (i !== null && this.readItemScope(i) === void 0 && (this.itemsRenderer.registerItemScope(i, p4(i), r), this.metadata.getItemsTemplateMetadata(e)?.composite != null)) for (let [e, t] of R2(i)) this.itemsRenderer.registerItemScope(e, t, r);
	}
	readItemScope(e) {
		let t = this.itemsRenderer.getItemScope(e);
		if (t !== void 0) return t;
		let n = e.firstElementChild;
		return n === null ? void 0 : this.itemsRenderer.getItemScope(n);
	}
	initializeItemsHosts() {
		for (let e of this.dom.root.querySelectorAll(`[${x}]`)) {
			let t = Ha(e);
			t !== null && this.syncItemsHost(e, t);
		}
	}
	resortHost(e) {
		let t = Ha(e);
		t !== null && this.syncItemsHost(e, t);
	}
	syncItemsHost(e, t) {
		wG(e, t, {
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
		let n = u() ? performance.now() : -1, r = xm(), i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set();
		this.touched = i, this.changedHosts = a;
		try {
			OG(() => this.applyUpdates(t));
		} finally {
			this.touched = null, this.changedHosts = null;
		}
		for (let e of a) this.dom.invalidate(e);
		return r !== null && Sm(r), n >= 0 && d(`applied ${t.length} server update(s)`, n), [...i];
	}
	applyUpdates(e) {
		for (let t = 0; t < e.length; t++) {
			let n = e[t];
			try {
				ga(n) !== "Value" && AG((e) => !o4(n, e));
				let r = e4(e, t);
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
		if (r.length === 0) t || n ? l("a collection for a host inside an item template is held until a row draws it.", { componentId: e.componentId }) : s("items host was not found for a collection refill.", e.items);
		else for (let n of r) t && this.held.isWaiting(n) || this.refillHost(n, e);
	}
	refillHost(e, t) {
		this.transfers.around(e, () => this.moves.around(e, i4, () => this.refillHostRows(e, t)));
	}
	refillHostRows(e, t) {
		let n = RO(e) === "virtualized";
		try {
			if (n) {
				let n = this.virtualization.refill(e, t.items.filter((e) => e.key !== null && e.key !== void 0).map((e) => ({
					key: e.key,
					item: e.item
				})));
				this.state.forgetRows(t.componentId, t.dynamicParameters, n);
			} else if (this.reconcileRows(e, t), RO(e) === "windowed") for (let t of this.windowRefillHandlers) t(e);
		} finally {
			this.afterRowsChanged(e, t.componentId, !n);
		}
	}
	reconcileRows(e, t) {
		let n = this.itemsRenderer.getAncestorStack(e), r = h4(e), i = [], a = [], o = null;
		for (let e of t.items) {
			let c = e.key ?? null;
			if (c === null) {
				s("collection insert carried no item key.", e);
				continue;
			}
			let l = r.get(c) ?? null;
			if (r.delete(c), l !== null && Jp(this.readItemValue(l), e.item)) {
				i.push(l);
				continue;
			}
			let u = this.renderItemElement(t.componentId, e.item, c, n);
			if (l !== null) {
				let e = Yf(l);
				e !== null && u !== null && (o = {
					row: u,
					held: e
				}), l.remove(), a.push(c);
			}
			u !== null && i.push(u);
		}
		let c = RO(e) === "windowed";
		for (let [t, n] of r) {
			let r = c ? Yf(n) : null;
			n.remove(), Xf(e, null, r), a.push(t);
		}
		if (this.state.forgetRows(t.componentId, t.dynamicParameters, a), this.forgetHeldRows(t.componentId, t.dynamicParameters, a), d4(e, i), Kk(e, i), o !== null && Xf(e, o.row, o.held), c) for (let t of i) Zf(e, t);
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
		switch (ga(e)) {
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
		let t = E(e.address?.component?.id), n = ha(e.address?.property), r = e.address?.component?.dynamicParameters ?? [];
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
		if (E(e.address?.component?.id) <= 0) s("validation update has an invalid address.", e);
		else for (let t of this.validationHandlers) t(e);
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
			this.sinks.dispatch(i, r4(e, r, t, n)) || s("no collection sink is registered for the kind the component names.", {
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
			a || o ? l("a collection change for a host inside an item template is held until a row draws it.", { componentId: t }) : (pa(e.action) !== "Reset" || (e.items ?? []).length > 0) && s("items host was not found for a collection change update.", e);
			return;
		}
		let u = pa(e.action) === "Move" ? l4(e.moves ?? []) : i4;
		for (let n of c) a && this.held.isWaiting(n) || this.transfers.around(n, () => this.moves.around(n, u, () => this.applyCollectionChangeToHost(n, t, e)));
	}
	applyCollectionChangeToHost(e, t, n) {
		let r = RO(e) === "virtualized", i = pa(n.action);
		try {
			r ? this.applyVirtualizedCollectionChange(e, n) : this.applyRowsChange(e, t, n);
		} finally {
			this.afterRowsChanged(e, t, !r && (i === "Insert" || i === "Replace"));
		}
	}
	applyRowsChange(e, t, n) {
		switch (pa(n.action)) {
			case "Insert":
				this.applyCollectionInsert(e, t, n.items ?? []);
				break;
			case "Remove":
				s4(e, n.items ?? [], n.trimmed === !0);
				break;
			case "Replace":
				this.applyCollectionReplace(e, t, n.items ?? []);
				break;
			case "Move":
				u4(e, n.moves ?? []);
				break;
			case "Reset":
				e.replaceChildren(), qk(e);
				break;
			default: s("collection update action is not supported.", n);
		}
	}
	afterRowsChanged(e, t, n) {
		this.touched?.add(e), t !== null && this.syncItemsHost(e, t), this.changedHosts?.add(e), (n || this.changedHosts === null) && this.dom.invalidate(e);
	}
	indexOfRow(e, t) {
		let n = RO(e) === "virtualized" ? this.virtualization.keysOf(e)?.indexOf(t) ?? -1 : zk(e, K(e)).findIndex((e) => e.getAttribute(b) === t);
		return n < 0 ? null : n + zO(e);
	}
	moveRow(e, t, n) {
		let r = Ha(e);
		if (r === null) return;
		let i = Math.max(0, n - zO(e));
		RO(e) === "virtualized" ? this.virtualization.move(e, t, i) : u4(e, [{
			key: t,
			newIndex: i
		}]), this.afterRowsChanged(e, r, !1);
	}
	takeRow(e, t) {
		let n = K(e), r = m4(n, t);
		if (r === null) return null;
		let i = zk(e, n), a = i.indexOf(r);
		return Hk(i, r), r.remove(), this.afterRowsChanged(e, Ha(e), !1), {
			element: r,
			index: a
		};
	}
	restoreRow(e, t) {
		let n = zk(e, K(e));
		MA(t.element), e.insertBefore(t.element, Vk(n, t.element, t.index)), this.afterRowsChanged(e, Ha(e), !0);
	}
	placeRow(e, t, n, r) {
		let i = Ha(e), a = i === null ? null : this.renderItemElement(i, n, t, this.itemsRenderer.getAncestorStack(e));
		return a === null ? null : (e.insertBefore(a, Vk(zk(e, K(e)), a, r)), this.afterRowsChanged(e, i, !0), a);
	}
	removeRow(e, t) {
		Hk(zk(e, K(e)), t), t.remove(), this.afterRowsChanged(e, Ha(e), !1);
	}
	forgetRowState(e, t, n) {
		switch (pa(n.action)) {
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
		switch (pa(t.action)) {
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
			let e = nJ(r);
			e !== null && n.push(e);
		}
		return n;
	}
	applyCollectionInsert(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = zk(e, K(e));
		for (let a of n) {
			let n = a.key ?? null;
			if (n === null) {
				s("collection insert carried no item key.", a);
				continue;
			}
			let o = this.renderItemElement(t, a.item, n, r);
			o !== null && (e.insertBefore(o, Vk(i, o, a.index ?? null)), Zf(e, o));
		}
	}
	renderItemElement(e, t, n, r) {
		try {
			return RZ(e, t, n, r, {
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
		let r = this.itemsRenderer.getAncestorStack(e), i = K(e), a = zk(e, i), o = h4(e, i);
		for (let i of n) {
			let n = i.key ?? null;
			if (n === null) {
				s("collection replace carried no item key.", i);
				continue;
			}
			let c = o.get(i.oldKey ?? n) ?? null, l = this.renderItemElement(t, i.item, n, r);
			if (l !== null) {
				if (o.delete(i.oldKey ?? n), o.set(n, l), c !== null) {
					let t = Yf(c);
					Gk(a, c, l), c.replaceWith(l), Xf(e, l, t);
				} else e.insertBefore(l, Vk(a, l, i.index ?? null));
			}
		}
	}
};
function o4(e, t) {
	if (ga(e) !== "CollectionChange") return !1;
	let n = e.component, r = t.closest(w);
	return r !== null && D(r) === E(n?.id) && Ma(r, n?.dynamicParameters ?? []);
}
function s4(e, t, n) {
	let r = K(e), i = h4(e, r), a = /* @__PURE__ */ new Set();
	for (let e of t) {
		let t = e.key ?? null, n = t === null ? null : i.get(t) ?? null;
		t === null || n === null ? s("collection remove did not resolve an item.", e) : (i.delete(t), a.add(n));
	}
	if (a.size === 0) return;
	let o = Jf(e), c = o === null ? null : n ? c4(e, a) : Wf(o, r, a);
	Uk(zk(e, r), a);
	for (let e of a) e.remove();
	c?.();
}
function c4(e, t) {
	let n = [];
	for (let e of t) {
		let t = Yf(e);
		t !== null && n.push(t);
	}
	return n.length === 0 ? null : () => {
		for (let t of n) Xf(e, null, t);
	};
}
function l4(e) {
	return e.map((e) => e.key).filter((e) => typeof e == "string");
}
function u4(e, t) {
	let n = K(e), r = zk(e, n), i = h4(e, n);
	for (let n of t) {
		let t = n.key === null || n.key === void 0 ? null : i.get(n.key) ?? null;
		if (t === null) {
			s("collection move did not resolve an item.", n);
			continue;
		}
		let a = Wk(r, t, n.newIndex ?? null);
		e.insertBefore(t, a ?? r[r.length - 2]?.nextSibling ?? null);
	}
}
function d4(e, t) {
	let n = null;
	for (let r of t) {
		let t = n === null ? K(e)[0] ?? null : n.nextElementSibling;
		r !== t && e.insertBefore(r, t), n = r;
	}
}
function f4(e, t) {
	for (let n of e.querySelectorAll(`[${x}]`)) if (!t.has(n)) return n;
	return null;
}
function p4(e) {
	let t = D(e);
	if (t > 0) return t;
	let n = e.firstElementChild;
	return n === null ? 0 : D(n);
}
function m4(e, t) {
	return e.find((e) => e.getAttribute("data-ui-key") === t) ?? null;
}
function h4(e, t = K(e)) {
	let n = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.getAttribute(b);
		t !== null && !n.has(t) && n.set(t, e);
	}
	return n;
}
//#endregion
//#region src/interactions/validation-words.ts
function g4(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = t.message;
	return O(n) || mc(n) || typeof n == "string" && n.length > 0 ? {
		message: n,
		severity: v4(t.severity)
	} : void 0;
}
function _4(e) {
	let t = e.message;
	if (e.content === !0) return String(t ?? "");
	let n = k.resolve(O(t) || mc(t) ? t : String(t ?? ""), !0);
	return typeof n == "string" ? n : "";
}
function v4(e) {
	let t = ua(e);
	return t === "Unknown" ? "Error" : t;
}
//#endregion
//#region src/interactions/validation-engine.ts
var y4 = "ui-validation--warning", b4 = "ui-validation--info", x4 = "ui-validation-message--marker", S4 = "top-end", C4 = "right", w4 = "--ui-validation-marker-host", T4 = "ui-validation-mark", E4 = "--ui-validation-presentation", D4 = "--ui-validation-color", O4 = "Validation", k4 = /* @__PURE__ */ new Set(["Value", "EndValue"]), A4 = /* @__PURE__ */ new Set(["Min", "Max"]), j4 = `input:not([type='hidden']), textarea, select, .${Ai}[role='combobox'], [role='spinbutton']`, M4 = {
	Error: 0,
	Warning: 1,
	Info: 2
}, N4 = {
	Error: Ki,
	Warning: y4,
	Info: b4
}, P4 = `.${Ki}, .${y4}, .${b4}`, F4 = {
	Error: "danger",
	Warning: "warning",
	Info: "info"
}, I4 = {
	Error: "error",
	Warning: "warning",
	Info: "info"
}, L4 = {
	Error: `${T4}--error`,
	Warning: `${T4}--warning`,
	Info: `${T4}--info`
}, R4 = {
	error: "Error",
	warning: "Warning",
	info: "Info"
}, z4 = class {
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
		}, !0), this.applyRenderedMessages(this.root.querySelectorAll(P4)), H(this.root, P4, {
			childList: !0,
			addedOnly: !0
		}, (e) => this.applyRenderedMessages(e)), k.onChange(() => {
			this.applyRenderedMessages(this.root.querySelectorAll(P4)), this.rewriteMessageLines(), this.rejudgeBounds();
		}), k.onTable(() => this.rewriteShownMessages());
	}
	rewriteShownMessages() {
		for (let e of this.root.querySelectorAll(P4)) {
			let t = D(e);
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
			K4(t, W4(t) === "Error");
			let e = t.querySelector(`:scope > [${qi}]`), n = e?.textContent ?? "";
			e !== null && n.length !== 0 && (this.recordRenderedMessage(t, e), q4(this.markerMirrors, t, e, {
				message: n,
				severity: W4(t)
			}));
		}
	}
	recordRenderedMessage(e, t) {
		if (this.renderedRead.has(e) || (this.renderedRead.add(e), this.resolveDisplay(D(e), e) !== void 0)) return;
		let n = Hc(t), r = W4(e);
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
		e.propertyName === O4 ? this.applyBoundMessage(e) : (this.applyGivenValue(e), this.applyChangeTrigger(e));
	}
	applyGivenValue(e) {
		let t = k4.has(e.propertyName), n = A4.has(e.propertyName);
		for (let r of e.components) {
			let i = this.refusalByElement.get(r)?.property === e.propertyName, a = this.boundRefusalByElement.has(r);
			a && n ? this.judgeBounds(D(r), r) : (i || a && t) && (i && this.refusalByElement.delete(r), t && this.forgetBoundRefusal(r), this.applyCurrentState(D(r), r));
		}
	}
	applyBoundMessage(e) {
		let t = E(e.reference.componentId), n = g4(e.value);
		for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) n === void 0 ? this.boundMessageByElement.delete(r) : this.boundMessageByElement.set(r, n), this.touchedElements.add(r), this.applyCurrentState(t, r);
	}
	applyChangeTrigger(e) {
		let t = E(e.reference.componentId), n = this.options.metadata.getValidationsForComponent(t).filter((t) => la(t.trigger) === "Change" && t.target.propertyId === e.reference.propertyId);
		if (n.length !== 0) for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) this.evaluateAndApply(t, r, n, e.value);
	}
	applyServerRefusal(e) {
		let t = E(e.address?.component?.id), n = e.address?.component?.dynamicParameters ?? [], r = e.message ?? "", i = O(r) || typeof r == "string" && r.length > 0;
		for (let a of this.options.dom.findAllComponents(t, n)) i ? (this.refusalByElement.set(a, {
			message: r,
			severity: v4(e.severity),
			content: e.content === !0,
			property: ha(e.address?.property)
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
		let n = M(t) || A(t) ? null : H4(t, (e) => this.readValue(e)), r = this.boundRefusalByElement.get(t)?.message;
		return U4(r, n) || (n === null ? this.forgetBoundRefusal(t) : (this.boundRefusalByElement.set(t, {
			message: n,
			severity: "Error"
		}), this.boundRefused.add(t), this.touchedElements.add(t), this.refusalByElement.delete(t)), this.applyCurrentState(e, t)), n !== null;
	}
	readValue(e) {
		return this.options.readValue?.(e) ?? this.options.valueReaders.readBound(e);
	}
	readRuleValue(e) {
		let t = Jl(e);
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
			severity: R4[t]
		}), this.applyCurrentState(D(e), e);
	}
	entryRefusal(e, t, n) {
		for (let r of this.options.metadata.getValidationsForComponent(D(e))) if (v4(r.severity) === "Error" && B4(t, r) && !B4(n, r)) return r.message;
		return null;
	}
	judge(e, t) {
		let n = null;
		for (let r of this.options.metadata.getValidationsForComponent(e)) !B4(t, r) && (n === null || M4[v4(r.severity)] < M4[v4(n.severity)]) && (n = r);
		return n === null ? null : {
			severity: I4[v4(n.severity)],
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
		G4(this.markerMirrors, t, n), this.writeMessageElsewhere(e, t, n);
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
		}, [], [...e.lines.values()].map(_4).join("\n"), !0);
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
			severity: v4(t.severity)
		});
		let c;
		for (let e of n) (c === void 0 || M4[e.severity] < M4[c.severity]) && (c = e);
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
		let r = this.options.metadata.getValidationsForComponent(n.componentId).filter((e) => la(e.trigger) === t);
		r.length !== 0 && this.evaluateAndApply(n.componentId, n.element, r, this.readRuleValue(n.element));
	}
	runSubmitValidation(e) {
		let t = !0, n = /* @__PURE__ */ new Set();
		for (let { component: r } of this.formFields(e)) {
			if (n.has(r.element)) continue;
			n.add(r.element);
			let e = this.options.metadata.getValidationsForComponent(r.componentId).filter((e) => la(e.trigger) === "Submit");
			e.length > 0 && (this.touchedElements.add(r.element), this.evaluateAndApply(r.componentId, r.element, e, this.readRuleValue(r.element))), this.hasError(r.componentId, r.element) && (t = !1, this.touchedElements.has(r.element) || (this.touchedElements.add(r.element), this.applyCurrentState(r.componentId, r.element)));
		}
		return t;
	}
	*formFields(e) {
		for (let t of this.root.querySelectorAll(`[${sn}="${Yi(e)}"]`)) {
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
			let e = [...t.element.querySelectorAll(j4)].find((e) => e.closest("[role='listbox'], [role='menu'], [role='dialog']") === null) ?? null;
			if (e !== null) return e.focus({ preventScroll: !0 }), e.scrollIntoView({
				block: "center",
				behavior: Xm() ? "auto" : "smooth"
			}), !0;
		}
		return !1;
	}
	hasError(e, t) {
		if (this.boundRefusalByElement.has(t) || this.refusalByElement.get(t)?.severity === "Error") return !0;
		let n = this.failingRulesByElement.get(t);
		if (n === void 0) return !1;
		for (let t of this.options.metadata.getValidationsForComponent(e)) if (n.has(t) && v4(t.severity) === "Error") return !0;
		return !1;
	}
	evaluateAndApply(e, t, n, r) {
		let i = this.failingRulesByElement.get(t);
		i === void 0 && (i = /* @__PURE__ */ new Set(), this.failingRulesByElement.set(t, i));
		for (let e of n) B4(r, e) ? i.delete(e) : i.add(e);
		this.touchedElements.has(t) && this.applyCurrentState(e, t);
	}
};
function B4(e, t) {
	return sa(t.operator) !== "Required" && V4(e) ? !0 : Im(e, t.operator, t.value);
}
function V4(e) {
	return e !== !1 && !Im(e, "Required", null);
}
function H4(e, t) {
	return AO(e, t) ?? (e.matches(".ui-temporal-input, .ui-calendar") ? gM(e) : null);
}
function U4(e, t) {
	return e === void 0 || t === null ? e === void 0 && t === null : O(e) && e.key === t.key && JSON.stringify(e.args) === JSON.stringify(t.args);
}
function W4(e) {
	return e.classList.contains(y4) ? "Warning" : e.classList.contains(b4) ? "Info" : "Error";
}
function G4(e, t, n) {
	for (let e of Object.values(N4)) t.classList.toggle(e, n !== void 0 && N4[n.severity] === e);
	K4(t, n?.severity === "Error");
	let r = t;
	n === void 0 ? r.style.removeProperty(D4) : r.style.setProperty(D4, `var(--ui-color-${F4[n.severity]}-ink)`);
	let i = t.querySelector(":scope > [data-ui-validation-message]") ?? t.querySelector("[data-ui-validation-message]");
	i !== null && (n?.content === !0 ? (Bc(i, null), i.textContent = String(n.message ?? "")) : k.writeValue(i, null, n?.message ?? null), q4(e, r, i, n));
}
function K4(e, t) {
	for (let n of e.querySelectorAll(j4)) {
		let r = n.closest(ki);
		r !== null && e.contains(r) || (t ? n.setAttribute("aria-invalid", "true") : n.removeAttribute("aria-invalid"));
	}
}
function q4(e, t, n, r) {
	let i = getComputedStyle(n), a = i.getPropertyValue(E4).trim(), o = r !== void 0 && a === "marker";
	n.classList.toggle(x4, o), J4(e, t, a === "elsewhere" ? void 0 : r, n.textContent ?? "", i.getPropertyValue(w4).trim()), r !== void 0 && o ? (n.setAttribute(Re, Po(n.textContent ?? "")), n.setAttribute(ze, S4), n.setAttribute(Ve, I4[r.severity]), t.setAttribute(Be, ""), t.contains(document.activeElement) ? fR(n) : pR(n)) : (n.removeAttribute(Re), n.removeAttribute(ze), n.removeAttribute(Ve), t.removeAttribute(Be), pR(n));
}
function J4(e, t, n, r, i) {
	let a = e.get(t), o = n === void 0 || i.length === 0 ? null : X4(t, i);
	if (n === void 0 || o === null) {
		a !== void 0 && Y4(a), e.delete(t);
		return;
	}
	let s = a ?? document.createElement("span");
	s.className = `${T4} ${L4[n.severity]}`, s.textContent = r, s.setAttribute(Re, Po(r)), s.setAttribute(ze, C4), s.setAttribute(Ve, I4[n.severity]), s.setAttribute(He, ""), s.parentElement !== o && (Y4(s), o.append(s)), o.setAttribute(Be, ""), e.set(t, s), pR(s);
}
function Y4(e) {
	let t = e.parentElement;
	e.remove(), t !== null && t.querySelector(`:scope > .${T4}`) === null && t.removeAttribute(Be);
}
function X4(e, t) {
	for (let n = e.parentElement; n !== null; n = n.parentElement) {
		let e = n.querySelector(`:scope > .${t}`);
		if (e !== null) return e;
	}
	return null;
}
//#endregion
//#region src/items/row-decorators.ts
var Z4 = class {
	decorators = /* @__PURE__ */ new Map();
	register(e) {
		this.decorators.set(e.kind, e.decorate);
	}
	get(e) {
		return this.decorators.get(e);
	}
}, Q4 = "card-header-shown", $4 = `[${Li}], [${Ri}], [${Vi}], [${Hi}], [${Ui}]`;
function e3(e) {
	let t = e.parentElement?.parentElement;
	if (t == null || !t.classList.contains("ui-card__header")) return;
	let n = !e.matches($4);
	t.classList.contains("ui-card__header--empty") !== n && t.classList.toggle(Wi, n);
}
//#endregion
//#region src/updates/menu-surface.ts
var t3 = "menu-surface";
function n3(e) {
	let t = e.parentElement;
	t !== null && t.matches(".ui-context-menu, .ui-split-button__menu") && T(t, vn, nw(e));
}
//#endregion
//#region src/updates/tooltip-name.ts
var r3 = "tooltip-name";
function i3(e, t, n) {
	let r = No(e.getAttribute(Re));
	Bc(t, n), r.trim().length === 0 ? t.hasAttribute(n) && t.removeAttribute(n) : t.getAttribute(n) !== r && t.setAttribute(n, r);
}
//#endregion
//#region src/updates/dom-operation-registry.ts
var a3 = /* @__PURE__ */ new WeakMap(), o3 = /* @__PURE__ */ new WeakMap(), s3 = class {
	handlers = /* @__PURE__ */ new Map();
	constructor() {
		this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(da(e), t);
	}
	apply(e) {
		let t = da(e.operation.kind), n = this.handlers.get(t);
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
		this.register("Text", (e) => c3(e)), this.register("Markup", (e) => {
			e.target.hasAttribute("data-ui-plain-text") ? c3(e) : (Fo(e.target, Ul(e.convertedValue) ? "" : Hl(e.convertedValue), { autolinks: e.target.hasAttribute(Bi) }), Bc(e.target, null));
		}), this.register("Attribute", (e) => {
			let t = m3(e.operation);
			Bc(e.target, t), e.operation.convertsNull !== !0 && Ul(e.value) || Ul(e.convertedValue) ? T(e.target, t, null) : T(e.target, t, Hl(e.convertedValue));
		}), this.register("RemoveAttribute", (e) => {
			let t = m3(e.operation);
			Bc(e.target, t), T(e.target, t, null);
		}), this.register("ToggleAttribute", (e) => {
			let t = m3(e.operation), n = e.operation.condition ?? "HasValue", r = !Ul(e.value) && l3(e.value, n), i = e.operation.value ?? (Ul(e.convertedValue) || u3(n) ? "" : Hl(e.convertedValue));
			d3(e.target, p3(e), t, r, i);
		}), this.register("Class", (e) => {
			let t = !Ul(e.value) && l3(e.value, e.operation.condition ?? "None") ? Hl(e.convertedValue).trim() : "";
			f3(e.target, p3(e), t, XC(e.operation.converter ?? ""));
		}), this.register("ToggleClass", (e) => {
			let t = m3(e.operation), n = !Ul(e.value) && l3(e.value, e.operation.condition ?? "IsTrue");
			if (e.target.classList.toggle(t, n), e.operation.converter !== null && e.operation.converter !== void 0 && e.operation.converter.trim().length > 0) {
				let t = n ? Hl(e.convertedValue).trim() : "";
				f3(e.target, p3(e), t, XC(e.operation.converter));
			}
		}), this.register("Style", (e) => {
			let t = m3(e.operation), n = e.target;
			if (Ul(e.value) || Ul(e.convertedValue) || e.convertedValue === "") {
				n.style.getPropertyValue(t).length > 0 && n.style.removeProperty(t);
				return;
			}
			let r = Hl(e.convertedValue);
			n.style.getPropertyValue(t) !== r && n.style.setProperty(t, r);
		}), this.register("Data", () => {}), this.register(r3, (e) => i3(e.resolved.component, e.target, m3(e.operation))), this.register(A1, (e) => N1(e.target, e.value)), this.register(Q4, (e) => e3(e.resolved.component)), this.register(Yc, (e) => Xc(e.target)), this.register(w1, (e) => k1(e.target)), this.register(eF, (e) => nF(e.target)), this.register(aF, (e) => cF(e.resolved.component)), this.register(cS, (e) => {
			let t = bS(e.target);
			t !== "keep" && d3(e.resolved.component, cS, m3(e.operation), t === "show", "");
		}), this.register(t3, (e) => n3(e.target)), this.register("Property", (e) => {
			let t = m3(e.operation), n = e.target, r = Ul(e.convertedValue) ? "" : e.convertedValue;
			n[t] !== r && (n[t] = r);
		});
	}
};
function c3(e) {
	let t = Hl(e.convertedValue);
	e.target.textContent !== t && (e.target.textContent = t), Bc(e.target, null);
}
function l3(e, t) {
	switch (fa(t)) {
		case "None": return !0;
		case "HasValue": return !Ul(e);
		case "HasText": return typeof e == "string" ? e.trim().length > 0 : !Ul(e) && String(e).trim().length > 0;
		case "IsTrue": return e === !0;
		case "IsFalse": return e === !1;
		case "DrawsIcon": return bo(e).length > 0;
		default: return !Ul(e);
	}
}
function u3(e) {
	let t = fa(e);
	return t === "IsTrue" || t === "IsFalse";
}
function d3(e, t, n, r, i) {
	let a = o3.get(e);
	a === void 0 && (a = /* @__PURE__ */ new Map(), o3.set(e, a));
	let o = a.get(n);
	o === void 0 && (o = /* @__PURE__ */ new Set(), a.set(n, o)), r ? (o.add(t), T(e, n, i)) : (o.delete(t), o.size === 0 && T(e, n, null));
}
function f3(e, t, n, r) {
	let i = a3.get(e);
	i === void 0 && (i = /* @__PURE__ */ new Map(), a3.set(e, i));
	let a = i.get(t);
	if (a === void 0 && r !== void 0) for (let t of Array.from(e.classList)) t !== n && r(t) && e.classList.remove(t);
	a === n ? n.length > 0 && !e.classList.contains(n) && e.classList.add(n) : (a !== void 0 && a.length > 0 && e.classList.remove(a), n.length === 0 ? i.delete(t) : (e.classList.add(n), i.set(t, n)));
}
function p3(e) {
	return `${e.resolved.componentId}:${e.resolved.propertyId}:${e.operation.kind}:${e.operation.name ?? ""}:${e.operation.converter ?? ""}`;
}
function m3(e) {
	let t = e.name;
	if (t == null || t.trim().length === 0) throw Error(`Operation '${e.kind}' requires a name.`);
	return t;
}
//#endregion
//#region src/extensions/converters.ts
var h3 = class {
	converters = /* @__PURE__ */ new Map();
	constructor() {
		this.register({
			name: "*",
			canConvert: (e) => tw.has(e.name),
			convert: (e) => tw.get(e.name)(e.value)
		});
	}
	register(e) {
		let t = g3(e.name), n = {
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
function g3(e) {
	let t = e.trim();
	if (t.length === 0) throw Error("Converter name is required.");
	return t;
}
//#endregion
//#region src/extensions/events.ts
var _3 = class {
	definitions = /* @__PURE__ */ new Map();
	register(e) {
		let t = wa(e.name);
		if (t.length === 0) throw Error("Event name is required.");
		let n = wa(e.domEventName) || t;
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
		return this.definitions.get(wa(e));
	}
};
function v3(e, t) {
	e.root.addEventListener("toggle", (n) => {
		n.target instanceof HTMLDetailsElement && n.target.open === t && e.dispatch(n);
	}, !0);
}
function y3(e) {
	e.register({
		name: "click",
		attach: (e) => {
			e.root.addEventListener("click", e.dispatch, !0), e.root.addEventListener(Hf, e.dispatch, !0);
		}
	}), e.registerNative("change"), e.registerNative("focus"), e.registerNative("blur"), e.registerNative("mouse-enter", "mouseenter"), e.registerNative("mouse-leave", "mouseleave"), e.registerNative("toggle"), e.register({
		name: "expand",
		domEventName: "toggle",
		attach: (e) => v3(e, !0)
	}), e.register({
		name: "collapse",
		domEventName: "toggle",
		attach: (e) => v3(e, !1)
	}), e.registerNative("open"), e.registerNative("close"), e.registerNative("search"), e.registerNative("enter"), e.registerNative("escape"), e.registerNative("rename"), e.registerNative("unfold"), e.registerNative("move"), e.registerNative("remove");
}
//#endregion
//#region src/extensions/extension-registry.ts
var b3 = class {
	converters = new h3();
	events = new _3();
	operations = new s3();
	valueReaders;
	collectionSinks = new n4();
	rowDecorators = new Z4();
	constructor(e, t, n, r) {
		y3(this.events), this.valueReaders = new Gl(r);
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
}, x3 = "Submenu", S3 = "ui-menu__submenu", C3 = "Select", w3 = ["Header", "Separator"], T3 = {
	kind: "menu",
	decorate: E3
};
function E3(e) {
	if (w3.includes(O3(e.item, "Kind")) && e.row.setAttribute(gn, ""), !D3(e.item)) return;
	let t = e.templates.getVariantTemplate(e.componentId, x3);
	if (t === void 0) {
		s("menu submenu template was not found.", { componentId: e.componentId });
		return;
	}
	let n = e.renderer.renderFromTemplate(t, e.item, e.ancestors);
	if (n === null) return;
	e.row.setAttribute(dn, ""), O3(e.item, "Kind") === C3 && e.row.setAttribute(fn, ""), O3(e.item, "Expanded") === !0 && e.row.setAttribute(pn, "");
	let r = document.createElement("div");
	r.className = S3, r.appendChild(n), GX(r, e.key, e.item), e.row.appendChild(r);
}
function D3(e) {
	let t = O3(e, "Items");
	return Array.isArray(t) && t.length > 0;
}
function O3(e, t) {
	let n = hk(e, t);
	return n.ok ? n.value : void 0;
}
//#endregion
//#region src/items/row-grip.ts
var k3 = {
	kind: "grip",
	decorate: A3
};
function A3(e) {
	e.row.append(j3());
}
function j3() {
	let e = document.createElement("span");
	return e.className = _e, e.setAttribute("role", "button"), k.write(e, "aria-label", "ui.row.drag"), e;
}
//#endregion
//#region src/rendering/page-culture.ts
function M3(e, t, n) {
	let r = t === null ? null : JSON.stringify(t), i = n === null ? null : JSON.stringify(P3(n));
	for (let t of e.querySelectorAll(`[${ht}]`)) N3(t, mt, r), N3(t, yt, i);
}
function N3(e, t, n) {
	n !== null && e.hasAttribute(t) && e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function P3(e) {
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
var F3 = `[${xt}]`;
function I3(e) {
	for (let t of e.querySelectorAll(F3)) t.removeAttribute(xt);
}
//#endregion
//#region src/runtime/engine-start.ts
var L3 = 2;
function R3(e, t, n) {
	let r = u() ? performance.now() : -1;
	try {
		t(n);
	} catch (t) {
		c(`the ${e} engine failed to start; the page goes on without it.`, t);
	}
	if (r >= 0) {
		let t = performance.now() - r;
		t >= L3 && l(`the ${e} engine took ${f(t)} to start.`);
	}
}
function z3(e) {
	return e.name.length > 0 ? `"${e.name}" package` : "package";
}
//#endregion
//#region src/runtime/web-ui-runtime.ts
var B3 = "ne.standard.ui.windowId", V3 = [
	500,
	1e3,
	2e3
], H3 = 3, U3 = [
	["refusal", ({ root: e }) => WY(e)],
	["file input", ({ root: e, validation: t }) => new eb({
		root: e,
		validation: t
	})],
	["image input", ({ root: e, validation: t, propertyPatchEngine: n, dialogs: r }) => new px({
		root: e,
		validation: t,
		propertyPatchEngine: n,
		dialogs: r
	})],
	["key value action", ({ root: e, dom: t, propertyPatchEngine: n, validation: r }) => new Mx({
		root: e,
		dom: t,
		propertyPatchEngine: n,
		validation: r
	})],
	["field keys", ({ root: e, propertyPatchEngine: t }) => new iS({
		root: e,
		propertyPatchEngine: t
	})],
	["field box press", ({ root: e }) => new Hx({ root: e })],
	["image fallback", ({ root: e }) => new MS({ root: e })],
	["radio group sync", ({ root: e }) => new YS({ root: e })],
	["select interaction", ({ root: e, validation: t }) => new NE({
		root: e,
		validation: t
	})],
	["search input", ({ root: e }) => new wT({ root: e })],
	["debounced commit", ({ root: e }) => new Zx({ root: e })],
	["commit gate", ({ root: e, propertyPatchEngine: t }) => new QE({
		root: e,
		propertyPatchEngine: t
	})],
	["text area grow", ({ root: e, propertyPatchEngine: t }) => tD() ? void 0 : new nD({
		root: e,
		propertyPatchEngine: t
	})],
	["items selection", ({ root: e, heldRows: t }) => new XG({
		root: e,
		rows: t
	})],
	["range value", ({ root: e, propertyPatchEngine: t }) => new kD({
		root: e,
		propertyPatchEngine: t
	})],
	["color input", ({ root: e, propertyPatchEngine: t }) => new BU({
		root: e,
		propertyPatchEngine: t
	})],
	["temporal picker", ({ root: e, propertyPatchEngine: t }) => new gN({
		root: e,
		propertyPatchEngine: t
	})],
	["theme switcher", ({ root: e, effects: t, dom: n }) => new eP({
		root: e,
		effects: t,
		dom: n
	})],
	["language switcher", ({ root: e, effects: t, dom: n }) => new lP({
		root: e,
		effects: t,
		dom: n
	})],
	["time segment", ({ root: e, propertyPatchEngine: t }) => new Nq({
		root: e,
		propertyPatchEngine: t
	})],
	["timestamp", ({ root: e, propertyPatchEngine: t }) => new Xq({
		root: e,
		propertyPatchEngine: t
	})],
	["file tile", ({ root: e, propertyPatchEngine: t }) => new $q({
		root: e,
		propertyPatchEngine: t
	})],
	["context menu", ({ root: e, dom: t }) => new tI({
		root: e,
		dom: t
	})],
	["split button", ({ root: e }) => new eH({ root: e })],
	["toggle button", ({ root: e }) => new zx({ root: e })],
	["button group", ({ root: e }) => new oH({ root: e })],
	["menu", ({ root: e }) => new CR({ root: e })],
	["action bar", ({ root: e, dom: t }) => new VI({
		root: e,
		dom: t
	})],
	["collapsible", ({ root: e }) => new OB({ root: e })],
	["menu group", ({ root: e }) => new EF({ root: e })],
	["menu search", ({ root: e }) => new Pz({ root: e })],
	["side drawer", ({ root: e }) => new mB({ root: e })],
	["screen keyboard", () => new Gz()],
	["window foot", ({ root: e }) => new nB({ root: e })],
	["grid splitter", ({ root: e }) => new HB({ root: e })],
	["pane container", ({ root: e }) => new hV({ root: e })],
	["accordion", ({ root: e }) => new uH({ root: e })],
	["tabs", ({ root: e }) => new FH({ root: e })],
	["tabs view", ({ root: e, effects: t }) => new uq({
		root: e,
		effects: t
	})],
	["command bar", ({ root: e }) => new YH({ root: e })],
	["breadcrumbs", ({ root: e }) => new uU({ root: e })],
	["scroll anchor", ({ root: e }) => new _J({ root: e })],
	["visible keys", ({ root: e }) => new CX({ root: e })],
	["surface press", ({ root: e }) => new sW({ root: e })],
	["text selection", ({ root: e }) => new wJ({ root: e })],
	["scroll group", ({ root: e }) => new jJ({ root: e })],
	["flyout interaction", ({ root: e }) => new ov({ root: e })],
	["text fold", ({ root: e }) => new Cq({ root: e })],
	["tooltip", ({ root: e }) => ML(e)]
], W3 = class {
	windowId;
	options;
	root;
	culturesLanguage = document.documentElement.lang;
	metadata = new ta(pQ());
	hydration = _Q();
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
	navigationProgress = new S2({ window });
	sessionKey = by;
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
		this.options = e, this.root = e.root ?? document, this.windowId = MQ(e.windowIdStorageKey ?? B3, (e) => this.reloadAsOwnTab(e)), this.dom = new Va(this.root), k.load(this.root), k.setLanguage(document.documentElement.lang), e.strings !== void 0 && k.register(e.strings), this.gateInbound(this.hydration?.words === null || this.hydration?.words === void 0 ? null : k.loadTableAsync(this.hydration.words.href)), this.extensions = new b3(e.converters, e.eventDefinitions, e.domOperations, e.valueReaders), this.extensions.registerRowDecorator(T3), this.extensions.registerRowDecorator(k3), this.extensions.registerRowDecorator(HS);
		let t = new ka(this.dom, this.metadata), n = this.extensions.operations, r = new e$(), i = new j2(t, n, this.extensions, r);
		this.reactiveSources = new F2(i, {
			root: this.root,
			valueReaders: this.extensions.valueReaders,
			metadata: this.metadata
		}), this.dialogs = new o2({
			root: this.root,
			dom: this.dom
		}), this.notifications = new k0({
			root: this.root,
			dom: this.dom
		}), this.address = new T2({
			window,
			revisit: (e) => void this.navigateInPlaceAsync(e),
			switchRuntime: (e, t) => this.revisitRuntime(e, t),
			load: () => this.reload()
		});
		let a = (e) => this.eventPipeline.dispatchCommandAsync({
			eventId: 0,
			action: e,
			dynamicParameters: []
		}).catch((e) => (s("running a notification's action failed.", e), !1)), o = (e) => UK(e, (e) => this.leaveGuard.navigate(e), (e) => void a(e)), u = wQ(document.documentElement, this.windowId, o);
		this.effects = new J0({
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
			systemNotifications: VK(u)
		});
		let d = new Wm(this.metadata), f, p = new Am(d, i, new Fm(), {
			root: this.root,
			effects: this.effects,
			dom: this.dom,
			metadata: this.metadata,
			valueReaders: this.extensions.valueReaders,
			writeBack: (e, t, n) => {
				f?.syncPropertyAsync(E(e.componentId), e.propertyId, t, n).catch((e) => s("writing an interaction's value back failed.", e));
			}
		}), m = new iQ(this.dom), h = new VX(this.metadata, m, this.extensions, n, r), g = new cQ({
			root: this.root,
			render: (e, t) => h.renderPart(e, t),
			drawn: (e) => this.updateProcessor.fillDrawnPart(e),
			heldRows: (e) => this.updateProcessor.forEachHeldRow(e)
		});
		g.scan(), eI((e) => g.draw(e)), this.rowMenus = g, this.virtualization = new HZ({
			root: this.root,
			metadata: this.metadata,
			templates: m,
			renderer: h,
			state: r,
			dom: this.dom
		}), this.updateProcessor = new a4(this.metadata, i, r, h, m, this.dom, this.virtualization, this.extensions.collectionSinks, g), k.onChange(() => this.rewriteWords(i, h)), this.rewriteMoments = () => this.rewriteWords(i, h, !0), k.onMomentTick(this.rewriteMoments), this.ruleWatcher = new QX({
			root: this.root,
			metadata: this.metadata,
			templates: m,
			renderer: h,
			state: r,
			propertyPatchEngine: i,
			reactiveSources: this.reactiveSources,
			virtualization: this.virtualization
		}), this.transport = new h1(this.windowId, (e, t) => this.applyChanges(e, t, this.heldRuntime), e.signalR), this.clientState = new BK({ report: (e) => this.transport.reportClientStateAsync(e) }), this.dispatcher = new YQ(this.transport), k.setAsker((e, t) => this.transport.translateAsync(e, t)), this.effects.register(ea.SetLanguage, (e) => {
			let t = e.effect, n = t.language;
			if (typeof n != "string" || n.trim().length === 0) {
				s("set language effect carries no language.", e.effect);
				return;
			}
			let r = typeof t.href == "string" && t.href.length > 0 ? t.href : null;
			this.switchLanguageAsync(n, r).catch((e) => s("switching the page's language failed.", e));
		}), this.effects.register(ea.SetThemeColors, (e) => {
			let t = e.effect, n = ++this.themeColorChanges;
			typeof t.css == "string" ? dQ(document.head, t.css) : this.transport.setThemeColorsAsync(t.colors ?? null).then((e) => {
				n === this.themeColorChanges && dQ(document.head, e);
			}).catch((e) => s("applying the reader's colours failed.", e));
		});
		let _ = new b1(this.transport);
		f = new im({
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
			Jx(), await _.whenAnsweredAsync();
		}, this.effects.register(ea.DiscardForm, (e) => {
			let t = e.effect.formId;
			if (typeof t == "string" && t.length !== 0) {
				for (let n of f?.releaseForm(t) ?? []) i.restoreBoundValue(n, e.dom.resolveNearestComponent(n, () => !0)?.dynamicParameters ?? []);
				v.discardForm(t);
			}
		}), this.leaveGuard = new _2({
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
			confirm: (e, t) => m2(this.dialogs, t),
			pending: () => qx() || _.isBusy,
			settle: () => this.settleValues(),
			follow: (e) => this.followInPlace(e)
		}), this.updateProcessor.addPageHandler((e) => this.leaveGuard.set(e.holdsUnsavedWork === !0)), this.effects.register(_y, (e) => this.sessionKey.start(e.effect.token)), this.effects.register(ea.ConfirmLeave, (e) => {
			let t = e.effect.target;
			eo(t) ? this.leaveGuard.confirm(t) : s("confirm leave effect names no address of this site; nothing asked.", e.effect);
		});
		let v = new z4({
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
		for (let [e, t] of U3) R3(e, t, this.engineContext);
		R3("number input", ({ root: e, propertyPatchEngine: t }) => {
			this.numberInputs = new OO({
				root: e,
				propertyPatchEngine: t
			});
		}, this.engineContext), R3("tree", ({ root: e, effects: t }) => new EK({
			root: e,
			effects: t,
			rules: {
				metadata: this.metadata,
				state: r,
				renderer: h
			}
		}), this.engineContext), R3("items reorder", ({ root: e }) => new hA({
			root: e,
			services: {
				metadata: this.metadata,
				state: r,
				keysOf: (e) => this.virtualization.keysOf(e)
			}
		}), this.engineContext), R3("press ripple", ({ root: e }) => new WJ({
			root: e,
			clicks: (e) => this.metadata.hasServerEventForComponent("click", D(e)) || p.hasEventForComponent("click", D(e)),
			waves: document.documentElement.hasAttribute(zr)
		}), this.engineContext), R3("overlay scrollbars", () => document.documentElement.hasAttribute("data-ui-overlay-scrollbars") ? new pY() : void 0, this.engineContext), this.eventPipeline = new gm({
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
			uploads: qy,
			isReattaching: () => this.transport.isReattaching
		});
		for (let e of /* @__PURE__ */ new Set([...this.metadata.getEventNames(), ...d.getSourceEventNames()])) this.eventPipeline.addEvent(e);
		this.eventPipeline.addEvent(oq.name, oq.registration);
		let ee = (e) => this.updateProcessor.resortHost(e), te = fA({
			ahead: (e, t, n) => this.updateProcessor.moves.ahead(e, t, n),
			settle: (e) => this.updateProcessor.moves.settle(e),
			resort: ee
		});
		this.eventPipeline.addEvent(te.name, te.registration);
		let ne = cq(ee);
		this.eventPipeline.addEvent(ne.name, ne.registration), this.eventPipeline.addEvent(TK.name, TK.registration);
		let re = ZA(this.updateProcessor.transfers);
		for (let e of this.metadata.getEventNames()) e.startsWith("drop:") && this.eventPipeline.addEvent(e, re);
		this.eventPipeline.addEvent(nS.name, nS.registration), this.eventPipeline.addEvent(bT.name, bT.registration), R3("shortcuts", ({ root: e, dom: t }) => new PR({
			root: e,
			viewShortcuts: FR(this.metadata.metadata),
			componentOf: (e) => t.findComponent(e, []),
			laterChords: this.rowMenus
		}), this.engineContext), R3("item drag", ({ root: e, dom: t }) => new ej({
			root: e,
			targetOf: (e, n) => {
				let r = t.resolveNearestComponent(e, (e) => this.metadata.hasServerEventForComponent("drop:" + n, e))?.element ?? null;
				return r instanceof HTMLElement ? r : null;
			},
			keysOf: (e) => this.virtualization.keysOf(e)
		}), this.engineContext), this.tables = new VW({ root: this.root }), this.windows = new gZ({
			root: this.root,
			requestWindow: (e) => this.transport.requestItemWindowAsync(e)
		}), this.updateProcessor.addWindowRefillHandler((e) => this.windows.refilled(e)), R3("pager", ({ root: e, dom: t }) => new _z({
			root: e,
			dom: t,
			windows: this.windows
		}), this.engineContext), this.pluginContext = {
			...this.engineContext,
			strings: k,
			observeComponents: H,
			observeSize: NB,
			store: new QP(),
			numbers: aO,
			temporal: qs,
			icons: { apply: _o },
			badges: { writeCount: Jw },
			urls: {
				isImageSource: io,
				asBrowserReads: ro,
				isSafeLink: Xa,
				isExternalLink: $a
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
				let r = e.closest(w), a = r === null ? void 0 : this.metadata.getExposedProperty(D(r), t);
				return r === null || a === void 0 ? (s("a package set a property its component's renderer did not expose.", { propertyName: t }), !1) : i.applyToComponent(r, a, n);
			} },
			windows: this.windows,
			tooltips: dR,
			renames: { open: vu },
			tables: this.tables,
			rows: LX(m, h, this.virtualization),
			uploads: By(v, qy),
			selection: Gd,
			popups: cX(this.dom),
			roving: ed,
			typeAhead: JN,
			focus: Dp,
			states: ll,
			validation: v,
			wheel: Cb,
			colors: gX,
			shortcuts: Bu,
			names: Ji
		}, this.transport.onChanges((e, t) => void this.applyChanges(e, void 0, t)), this.transport.onCommandResult((e, t) => {
			xy(this.sessionKey, e.command?.effects);
			let { changes: n, ...r } = e;
			$Q(() => this.applyChanges(n, void 0, t), () => {
				this.holdsRuntime(t) && !this.dispatcher.settle(r) && (this.effects.applyAll(e.command?.effects, this.dom), this.windows.reconsider());
			}).catch((e) => c("a pushed command result could not be applied.", e));
		}), this.updateProcessor.addFullResyncHandler(() => {
			this.attachAsync().catch((e) => c("re-attaching after a full resync failed.", e));
		}), this.transport.onReconnecting((e) => {
			s("SignalR reconnecting.", e), this.dispatcher.release(Error("the connection to the server dropped before the command answered.", { cause: e }));
		}), this.transport.onReconnected(async () => {
			l("SignalR reconnected. Reattaching runtime."), await this.attachAsync();
		}), this.transport.onClosed((e) => this.loseConnection(e ?? /* @__PURE__ */ Error("the connection to the server closed."))), this.connection = new VQ({
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
		let t = Jl(e);
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
		return r.length > 0 && this.heldRuntime !== null && !this.connectionLost && e === window.location.pathname && X3() === null && D2(t, n, r);
	}
	async switchRuntimeAsync() {
		this.endSwitchProgress = this.navigationProgress.start();
		try {
			await this.settleValues();
		} catch (e) {
			s("the values still on their way did not settle before the page went to another runtime.", e);
		}
		this.dialogs.closeAll(), this.dispatcher.release(/* @__PURE__ */ Error("the page went to another runtime of its route before the command answered.")), this.transport.holdCalls();
		let e = K3();
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
		if (e === k.requestedLanguage) return;
		let n = ++this.languageSwitches, r = t, i = e;
		k.setRequested(e);
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
			if (n !== this.languageSwitches || i === k.language || !await k.switchToAsync(i, r)) return;
			k.notifyChanged();
		} finally {
			n === this.languageSwitches && k.setRequested(null);
		}
	}
	rewriteWords(e, t, n = !1) {
		let r = performance.now();
		this.dom.invalidate(), k.language !== this.culturesLanguage && (this.culturesLanguage = k.language, qc(this.root, (e) => M3(e, k.number, k.temporal)));
		let i = n ? _c : void 0;
		k.rewriteMarks(this.root, n), this.rewriteStaticWords(e, i), e.rewriteWords(i), t.rewriteRowWords(this.root, i);
		let a = this.hydration?.title ?? null;
		if (a !== null && (i === void 0 || i(a))) {
			let e = String(k.resolve(a, !0));
			document.title !== e && (document.title = e);
		}
		k.language.length > 0 && document.documentElement.lang !== k.language && (document.documentElement.lang = k.language), d(n ? "page's moments written again" : "page's words written again", r, { language: k.language });
	}
	rewriteStaticWords(e, t) {
		let n = t === void 0 ? this.metadata.getWords() : this.metadata.getWords().filter((e) => t(e.key));
		if (n.length === 0) return;
		let r = [];
		qc(this.root, (e) => {
			e !== this.root && r.push(e);
		});
		for (let t of n) {
			let n = E(t.componentId), i = {
				componentId: n,
				propertyId: t.propertyId
			}, a = t.dynamicParameters ?? [];
			for (let r of this.findWordInstances(n, a)) e.rewriteStatic(r, i, t.key);
			for (let o of r) for (let r of o.querySelectorAll(`[${y}="${Yi(n)}"]`)) Na(r, a) && e.rewriteStatic(r, i, t.key);
		}
	}
	findWordInstances(e, t) {
		if (t.length === 0) return this.dom.findEveryComponent(e);
		let n = this.dom.findAllComponents(e, t);
		return n.length > 0 ? n : this.dom.findAllComponents(e, []).filter((e) => Na(e, t));
	}
	loseConnection(e) {
		if (this.connectionLost) return;
		this.connectionLost = !0, c("the connection to the server is lost; the page offers a reload.", e), this.connection.lost(), this.endSwitchProgress?.(), this.endSwitchProgress = null;
		let t = Error("the connection to the server is lost; reload the page.", { cause: e });
		this.transport.close(t), this.dispatcher.release(t), this.notifications.show({
			message: k.text("ui.connection.lost"),
			severity: "danger",
			sticky: !0,
			connection: !0,
			action: {
				label: k.text("ui.connection.reload"),
				run: () => {
					this.leaveGuard.release(), this.reload();
				}
			}
		});
	}
	reloadForView(e) {
		let t = OQ(e, navigator.cookieEnabled, AQ());
		t === "no-cookie" ? this.loseConnection(/* @__PURE__ */ Error(`the server asked for a reload of view '${e}', and this browser keeps no cookie the reload could write.`)) : t === "asked-again" ? this.loseConnection(/* @__PURE__ */ Error(`the server asked for a reload of view '${e}' again after one (another compile of the view, or a session cookie the browser does not keep).`)) : (s("the server asked for a reload (another compile of the view, or a session it no longer holds); reloading.", { view: e }), this.leaveGuard.release(), this.reload());
	}
	reloadAsOwnTab(e) {
		s("another live tab holds this tab's id; reloading under one of its own.", { id: e }), this.leaveGuard.release(), this.reload();
	}
	reloadForFreshRuntime(e) {
		OQ(e, navigator.cookieEnabled, AQ()) === "reload" ? (s("the page's runtime is gone and the server built a new one; reloading.", { view: e }), this.leaveGuard.release(), this.reload()) : this.loseConnection(/* @__PURE__ */ Error("the server holds a new runtime for this page again after a reload for one."));
	}
	reload() {
		this.sessionKey.load(() => window.location.reload());
	}
	get instanceId() {
		return this.transport.instanceId;
	}
	async startAsync() {
		v(this, this.options.handlerGlobalKey), P1(this.root), await Y3();
		let e = this.connectAsync();
		await this.hydrateAsync(), this.startEnginesAwaitingHydration(), I3(this.root), this.clientState.start(), await e && (await this.attachAsync(), this.connectionLost || l(`page live ${f(performance.now())} after the navigation started.`));
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
		return zc(this.root) || gQ(this.hydration) || this.metadata.getWords().some((e) => _c(e.key)) || _c(this.metadata.metadata.itemValues);
	}
	startEnginesAwaitingHydration() {
		let e = this.enginesAwaitingHydration ?? [];
		this.enginesAwaitingHydration = null;
		for (let t of e) R3(z3(t), t, this.pluginContext);
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
		k.register(e);
	}
	addEngine(e) {
		this.enginesAwaitingHydration === null ? R3(z3(e), e, this.pluginContext) : this.enginesAwaitingHydration.push(e);
	}
	applyChanges(e, t, n) {
		if (this.inbound === null && !KQ(e)) {
			t?.(), this.applyAnswered(this.holdsRuntime(n) ? e : null);
			return;
		}
		let r = this.transport.instanceId, i = (this.inbound ?? Promise.resolve()).then(async () => {
			t?.(), this.applyAnswered(this.holdsRuntime(n) ? await qQ(e, r) : null);
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
			if (e >= H3) {
				this.loseConnection(/* @__PURE__ */ Error("the page fell behind the server on every attach."));
				return;
			}
		}
	}
	async attachCoreAsync() {
		if (this.connectionLost) return !1;
		let e = window.location.search, t = this.createAttachRequest(e), n = this.holdInbound(), r = performance.now();
		try {
			let i = await yQ(() => this.transport.attachAsync(t), () => this.transport.isReconnecting, V3, J3), a = performance.now();
			if (i === null) return this.loseConnection(/* @__PURE__ */ Error("attaching the runtime failed after retrying.")), !1;
			if (i === "reconnecting") return !1;
			if (i.reload === !0) return this.reloadForView(this.hydration?.view ?? ""), !1;
			if (i.fresh === !0) return this.reloadForFreshRuntime(this.hydration?.view ?? ""), !1;
			kQ(AQ()), this.heldRuntime = i.runtime ?? null, this.runtimeSearch = e, this.dom.rebuild(), this.updateProcessor.registerServerRenderedItems(i.initialChanges), await n.previous;
			let o = K3();
			return t.switchRuntime && (this.pageId = null, o !== null && this.windows.forget(o)), this.leaveGuard.set(!1), await this.applyAttachChangesAsync(i.initialChanges), this.updateProcessor.initializeItemsHosts(), t.switchRuntime && q3(o), this.releaseInertContent(), this.windows.start(), d("runtime attached", r, {
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
		let t = X3(), n = t === null && this.heldRuntime !== null && D2(e, this.runtimeSearch, this.hydration?.identity ?? []), r = {
			clientWindowId: this.windowId,
			route: t?.route ?? window.location.pathname,
			pageId: n ? null : this.pageId,
			view: this.hydration?.view ?? null,
			since: this.renderSequence,
			runtime: this.heldRuntime,
			parameters: t === null ? k2(e) : t.parameters,
			timeZone: bQ(),
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
			let t = KQ(e) ? await qQ(e, this.transport.instanceId) : e;
			this.releaseInertContent(), this.applyNow(t);
		} catch (e) {
			c("a staged value of the attach could not be fetched; the page attaches again.", e), this.reattachRequested = !0;
		}
	}
	releaseInertContent() {
		this.inertContent?.removeAttribute("inert"), this.inertContent = null, this.endSwitchProgress?.(), this.endSwitchProgress = null;
	}
};
async function G3(e = {}) {
	let t = performance.now(), n = new W3(e);
	return d("runtime built", t), await n.startAsync(), n;
}
function K3() {
	return document.querySelector(`[${Pn}="${T1}"]`);
}
function q3(e) {
	if (document.scrollingElement?.scrollTo({
		top: 0,
		left: 0,
		behavior: "instant"
	}), e !== null) for (let t of [e, ...e.querySelectorAll("*")]) bJ(t) && !(RO(t) === "windowed" && xJ(t)) ? (hJ(t), t.scrollTo({
		top: t.scrollHeight,
		left: 0,
		behavior: "instant"
	})) : (t.scrollTop !== 0 || t.scrollLeft !== 0) && t.scrollTo({
		top: 0,
		left: 0,
		behavior: "instant"
	});
}
function J3(e) {
	return new Promise((t) => window.setTimeout(t, e));
}
function Y3() {
	let e = performance.getEntriesByType("navigation")[0];
	return document.readyState === "complete" || e !== void 0 && e.domContentLoadedEventStart > 0 ? Promise.resolve() : new Promise((e) => document.addEventListener("DOMContentLoaded", () => e(), { once: !0 }));
}
function X3() {
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
_(), G3().catch((e) => {
	c("Web client failed to start.", e);
});
//#endregion
