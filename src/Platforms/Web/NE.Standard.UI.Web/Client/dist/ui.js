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
var On = "data-ui-bottom-bar", kn = "data-ui-rail-drawer", An = "data-ui-window-foot", jn = "data-ui-content-fills", Mn = "data-ui-region", Nn = "data-ui-menu-item-kind", Pn = "ui-menu", Fn = "ui-menu-item", In = "ui-menu-item--checked", Ln = "ui-menu-item--selected", Rn = "ui-menu--rail", zn = "ui-menu--nested", Bn = `[${Nn}="header"], [${Nn}="separator"]`, Vn = `[${un}] > .${Fn}`, Hn = `.${Fn}:not(${Bn})`;
`${Vn}${Fn}${Nn}`;
var Un = "data-ui-shortcut", Wn = "data-ui-collapse-toggle", Gn = "data-ui-folding", Kn = "data-ui-column-limits", qn = "data-ui-row-limits", Jn = "data-ui-splitter-step", Yn = "data-ui-splitter-position", Xn = "data-ui-pane-layout", Zn = "data-ui-pane", Qn = "data-ui-pane-columns", $n = "data-ui-pane-rows", er = "data-ui-table-column", tr = "data-ui-table-hide-below", nr = "data-ui-table-starts-hidden", rr = "data-ui-table-hidden", ir = "ui-table__row", ar = "ui-table__scroll", or = "ui-table__header", sr = "ui-table__resizer", cr = "ui-tree", lr = "ui-tree__row", ur = "ui-tree-node", dr = "data-ui-tree-drop", fr = "ui-tree__row--filtered", pr = "data-ui-table-last", mr = "data-ui-table-reordering", hr = "data-ui-table-dragging", gr = "data-ui-table-drop", _r = "data-ui-table-scrolled", vr = "data-ui-table-scrollbar", yr = "data-ui-no-row-select", br = "data-ui-tree-parent", xr = "data-ui-tree-children", Sr = "data-ui-tree-folder", Cr = "data-ui-tree-expanded", wr = "data-ui-tree-title", Tr = "data-ui-tree-loading", Er = "data-ui-tree-drop-target", Dr = "data-ui-tree-boot", Or = "data-ui-tree-draggable", kr = "data-ui-row-editing", Ar = "data-ui-boxed-editor", jr = "data-ui-row-idle", Mr = "data-ui-step-collapsed", Nr = "data-ui-step-end", Pr = "data-ui-row-bar", Fr = "data-ui-image-source", Ir = "data-ui-file-max-size", Lr = "data-ui-file-pick", Rr = "data-ui-file-drop-target-id", zr = "data-ui-press-ripple", Br = "data-ui-service-worker", Vr = "data-ui-theme", Hr = "data-ui-theme-colors", Ur = "data-ui-words", Wr = "data-ui-language-switcher", Gr = "data-ui-theme-switcher", Kr = "data-ui-theme-choice", qr = "field", Jr = "data-ui-language", Yr = "data-ui-splitting", Xr = "data-ui-keyboard-up", Zr = "data-ui-window-foot-edge", Qr = "data-ui-connection", $r = "data-ui-pending", ei = "data-ui-split-folded", ti = "data-ui-split-edge", ni = "data-ui-pointer-focus", ri = "data-ui-focus-within", ii = "data-ui-popup-hover", ai = "data-ui-inner-pointer", oi = "data-ui-selection", si = "data-ui-selected", ci = "data-ui-selected-key", li = "data-ui-selected-keys", ui = "data-ui-bind-selected-key", di = "data-ui-tabs-selected", fi = "data-ui-tab-caption", pi = "data-ui-tab-key", mi = "data-ui-tab-page", hi = "data-ui-tab-actions", gi = "data-ui-tab-pinned", _i = [
	cn,
	"data-ui-visibility-sm",
	"data-ui-visibility-md",
	"data-ui-visibility-xl",
	"data-ui-visibility-xxl"
], vi = "data-ui-submit-form-id", S = `[${y}]`, yi = "data-ui-href", bi = "ui-disabled", xi = "ui-loading", Si = "ui-readonly", Ci = "ui-hidden", wi = "ui-dialog__surface", Ti = "ui-flyout__content", Ei = `.ui-context-menu, .ui-split-button__menu, .${Ti}`, Di = "data-ui-focus-holder", Oi = "data-ui-owns-keys", ki = "[role='listbox'], [role='menu'], [role='dialog']", Ai = "ui-select__trigger", ji = `.${Ai}`, Mi = "ui-button", Ni = "ui-button--ghost", Pi = "ui-button--small", Fi = `${Mi} ${Ni} ${Pi}`, Ii = "ui-select", Li = "data-ui-text-title", Ri = "data-ui-text-description", zi = "data-ui-plain-text", Bi = "data-ui-text-icon", Vi = "data-ui-text-badge-icon", Hi = "data-ui-text-badge-text", Ui = "ui-card__header--empty", Wi = "ui-text-input", Gi = "ui-invalid", Ki = "data-ui-validation-message", qi = {
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
	valueHolder: Rt,
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
	textInputClass: Wi,
	invalidClass: Gi,
	validationMessage: Ki,
	sourceLine: Jt,
	textDescription: Ri,
	popupSelector: ki,
	listTriggerSelector: ji,
	tableRowClass: ir,
	tableScrollClass: ar,
	tableHeaderClass: or,
	tableResizerClass: sr,
	tableHidden: rr,
	hostMode: Wt,
	windowOffset: $t,
	windowTotal: en,
	windowSize: Qt,
	windowMoreAfter: nn,
	windowAggregates: an,
	itemsQuery: ut,
	valueKind: Bt,
	itemsQueryKind: Vt,
	menuItemClass: Fn,
	menuItemKind: Nn,
	menuItemCheckedClass: In
};
function Ji(e) {
	return String(e).replace(/[\\"]/g, "\\$&").replace(/[\u0000-\u001f\u007f]/g, (e) => `\\${e.charCodeAt(0).toString(16)} `);
}
function Yi(e) {
	return e.replace(/(\p{Ll})(\p{Lu})/gu, "$1-$2").replace(/([\p{L}\p{Nd}])(\p{Lu}\p{Ll})/gu, "$1-$2").replace(/_/g, "-").toLowerCase();
}
var Xi = 0;
function Zi(e, t) {
	return e.id.length === 0 && (Xi++, e.id = `${t}-${Xi}`), e.id;
}
function C(e, t, n) {
	n === null ? e.removeAttribute(t) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/addressing/operation-targets.ts
function Qi(e, t, n) {
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
var $i = {
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
}, ea = class {
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
		return this.bindingsByComponentAndPropertyId.get(Ta(e, t));
	}
	getBindingByComponentAndPropertyName(e, t) {
		return this.bindingsByComponentAndPropertyName.get(Ta(e, wa(t)));
	}
	getEvent(e, t) {
		return this.eventsByComponentAndName.get(Ea(e, t));
	}
	hasServerEvent(e) {
		return this.eventNames.has(Ca(e));
	}
	getEventNames() {
		return this.eventNames;
	}
	hasServerEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(Ca(e))?.has(t) === !0;
	}
	getItemsTemplateMetadata(e) {
		return this.itemsTemplatesByComponentId.get(e);
	}
	getItemsFilterSortMetadata(e) {
		return this.itemsFilterSortByComponentId.get(e);
	}
	getItemValues(e, t = []) {
		return this.itemValuesByAddress.get(Da(e, t))?.items ?? [];
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
		r > 0 && this.bindingsById.set(r, e), this.bindingsByComponentAndPropertyId.set(Ta(t, e.propertyId), e), this.bindingsByComponentAndPropertyName.set(Ta(t, n.propertyName), e);
	}
	addEvent(e) {
		let t = Ca(e.eventName), n = w(e.componentId);
		if (t.length === 0 || n <= 0) return;
		this.eventsByComponentAndName.set(Ea(n, t), e), this.eventNames.add(t);
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
		t > 0 && this.itemValuesByAddress.set(Da(t, e.dynamicParameters ?? []), e);
	}
	addValidation(e) {
		let t = w(e.target?.componentId);
		if (t <= 0) return;
		let n = this.validationsByComponentId.get(t);
		n === void 0 && (n = [], this.validationsByComponentId.set(t, n)), n.push(e);
	}
};
function ta(e, t) {
	return typeof e == "number" ? t[e] ?? "Unknown" : e != null && t.includes(e) ? e : "Unknown";
}
function na(e) {
	return ta(e, [
		"Dynamic",
		"Fixed",
		"Scope"
	]);
}
function ra(e) {
	return e == null ? "OneWay" : ta(e, [
		"OneWay",
		"TwoWay",
		"OneWayToSource",
		"OnSubmit"
	]);
}
function ia(e) {
	return ta(e, ["Property", "Event"]);
}
function aa(e) {
	return e == null ? "SetProperty" : ta(e, [
		"SetProperty",
		"Effect",
		"CopyValue"
	]);
}
function oa(e) {
	return ta(e, [
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
function sa(e) {
	return ta(e, ["Ascending", "Descending"]);
}
function ca(e) {
	return ta(e, [
		"Change",
		"Blur",
		"Submit"
	]);
}
function la(e) {
	return ta(e, [
		"Error",
		"Warning",
		"Info"
	]);
}
function ua(e) {
	return typeof e == "string" ? e : ta(e, [
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
function da(e) {
	return ta(e, [
		"None",
		"HasValue",
		"HasText",
		"IsTrue",
		"IsFalse",
		"DrawsIcon"
	]);
}
function fa(e) {
	return ta(e, [
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
function pa(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function ma(e) {
	return typeof e == "string" ? e : "";
}
function ha(e) {
	return ta(e.kind, [
		"Value",
		"CollectionChange",
		"FullResync",
		"Validation",
		"Page"
	]);
}
function ga(e) {
	return typeof e == "string" ? e.trim() : "";
}
function _a(e) {
	return ta(e, ["Auto", "Smooth"]);
}
function va(e) {
	return ta(e, [
		"Start",
		"Center",
		"End",
		"Nearest"
	]);
}
function ya(e) {
	return ta(e, [
		"Start",
		"End",
		"Offset",
		"PageBack",
		"PageForward"
	]);
}
function ba(e) {
	return ta(e, ["Light", "Dark"]);
}
function xa(e) {
	return ta(e, ["Horizontal", "Vertical"]);
}
function Sa(e) {
	return ta(e, ["Polite", "Assertive"]);
}
function Ca(e) {
	return e?.trim().toLowerCase() ?? "";
}
function wa(e) {
	return e?.trim() ?? "";
}
function Ta(e, t) {
	return `${e}:${wa(t)}`;
}
function Ea(e, t) {
	return `${e}:${Ca(t)}`;
}
function Da(e, t) {
	return `${e}:${pa(t)}`;
}
//#endregion
//#region src/addressing/address-resolver.ts
var Oa = class {
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
		return n === void 0 && (n = `[${Je}${Yi(t)}="${Ji(e)}"]`, this.bindingSelectors.set(e, n)), n;
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
		return Qi(e.component, t, () => {
			if (e.bindingSelector === null) return [e.component.querySelector(this.intoSelector(e.propertyName)) ?? e.component];
			let t = Array.from(e.component.querySelectorAll(e.bindingSelector));
			return e.component.matches(e.bindingSelector) && t.unshift(e.component), t;
		});
	}
	intoSelector(e) {
		let t = this.intoSelectors.get(e);
		return t === void 0 && (t = `[${Ye}${Yi(e)}]`, this.intoSelectors.set(e, t)), t;
	}
};
//#endregion
//#region src/addressing/dynamic-parameters.ts
function ka(e) {
	return Na(e, ae);
}
function Aa(e, t) {
	if (t <= 0) return [];
	let n = [], r = e, i = null;
	for (; r !== null && n.length < t;) {
		let e = Fa(r);
		if (e !== void 0) {
			let t = r.closest(Pa);
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
function ja(e, t) {
	let n = ka(e);
	if (n !== t.length) return !1;
	if (n === 0) return !0;
	let r = Aa(e, n);
	if (r.length !== t.length) return !1;
	for (let e = 0; e < t.length; e++) if (String(r[e] ?? "") !== String(t[e] ?? "")) return !1;
	return !0;
}
function Ma(e, t) {
	let n = t.length - 1, r = e, i = null;
	for (; r !== null && n >= 0;) {
		let e = Fa(r);
		if (e !== void 0) {
			let a = r.closest(Pa);
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
function Na(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.trim().length === 0) return 0;
	let r = Number(n);
	return Number.isInteger(r) ? r : 0;
}
var Pa = `[${x}]`;
function Fa(e) {
	return e.getAttribute("data-ui-key") ?? e.getAttribute("data-ui-group-anchor") ?? void 0;
}
//#endregion
//#region src/addressing/dom-registry.ts
var Ia = `[${Ft}]`, La = 64, Ra = 256;
function za(e, t) {
	let n = [];
	for (let r of e) r instanceof HTMLElement && r.matches(t) ? n.push(r) : n.push(...r.querySelectorAll(t));
	return n;
}
var Ba = class {
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
		this.stale || (e === void 0 || this.changedScopes.size >= La ? (this.stale = !0, this.changedScopes.clear()) : this.changedScopes.add(e));
	}
	rebuild() {
		this.stale = !1, this.componentsById.clear(), this.staticComponentsById.clear(), this.keyedComponentsById.clear(), this.indexed.clear(), this.changedScopes.clear(), this.unsettledIds.clear();
		let e = this.root.querySelectorAll(S), t = this.root.querySelector(Ia) !== null;
		for (let n of e) {
			let e = T(n);
			if (e <= 0 || t && n.closest(Ia) !== null) continue;
			let r = this.componentsById.get(e);
			r === void 0 && (r = [], this.componentsById.set(e, r)), r.push(n), this.indexed.add(n), !this.staticComponentsById.has(e) && Ua(n) && this.staticComponentsById.set(e, n);
		}
		this.patchedSincePrune = 0, this.prunedSize = this.indexed.size;
	}
	findComponent(e, t) {
		return this.findAllComponents(e, t)[0] ?? null;
	}
	ensureId(e, t) {
		return Zi(e, t);
	}
	findComponentParts(e, t, n) {
		return za(this.findAllComponents(e, t), n);
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
		let n = this.keyedComponents(e).get(pa(t)) ?? [];
		if (n.length > 0 && n.every((e) => this.holds(e) && ja(e, t))) return [...n];
		let r = this.liveComponents(e).filter((e) => ja(e, t));
		return (n.length > 0 || r.length > 0) && this.keyedComponentsById.delete(e), r;
	}
	sync() {
		if (this.stale) this.rebuild();
		else if (this.changedScopes.size !== 0) {
			for (let e of this.changedScopes) this.holds(e) && this.addComponentsIn(e);
			this.changedScopes.clear(), this.patchedSincePrune > Math.max(this.prunedSize, Ra) && this.prune();
		}
	}
	addComponentsIn(e) {
		if (e.closest(Ia) !== null) return;
		let t = e.querySelector(Ia) !== null;
		e.matches("[data-ui-id]") && this.addComponent(e, !1);
		for (let n of e.querySelectorAll(S)) this.addComponent(n, t);
	}
	addComponent(e, t) {
		let n = T(e);
		if (n <= 0) return;
		if (this.indexed.has(e)) {
			this.unsettledIds.add(n);
			return;
		}
		if (t && e.closest(Ia) !== null) return;
		this.indexed.add(e), this.patchedSincePrune++, this.keyedComponentsById.delete(n);
		let r = this.componentsById.get(n);
		r === void 0 ? (this.componentsById.set(n, [e]), Ua(e) && this.staticComponentsById.set(n, e)) : (r.push(e), this.unsettledIds.add(n));
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
		r && (t.length = n, this.keyedComponentsById.delete(e)), i && !Ka(t) && t.sort(Ga), t.length === 0 ? (this.componentsById.delete(e), this.staticComponentsById.delete(e)) : (r || i) && this.settleStatic(e, t);
	}
	settleStatic(e, t) {
		for (let n of t) if (Ua(n)) {
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
			let e = ka(n);
			if (e === 0) continue;
			let r = Aa(n, e);
			if (r.length !== e) continue;
			let i = pa(r), a = t.get(i);
			a === void 0 ? t.set(i, [n]) : a.push(n);
		}
		return this.keyedComponentsById.set(e, t), t;
	}
	holds(e) {
		return qa(this.root, e);
	}
	resolveNearestComponent(e, t) {
		this.sync();
		let n = e;
		for (; n !== null;) {
			let e = n.closest(S);
			if (e === null || !qa(this.root, e)) return null;
			let r = T(e);
			if (r > 0 && t(r, e)) return {
				element: e,
				componentId: r,
				dynamicParameters: Aa(e, ka(e))
			};
			n = e.parentElement;
		}
		return null;
	}
};
function T(e) {
	return Na(e, y);
}
function Va(e) {
	let t = e.closest(S), n = t === null ? 0 : T(t);
	return n > 0 ? n : null;
}
function Ha(e) {
	let t = e.closest(S), n = t === null ? 0 : T(t);
	return t === null || n <= 0 ? null : {
		componentId: n,
		dynamicParameters: Aa(t, ka(t))
	};
}
function Ua(e) {
	return ka(e) === 0;
}
function Wa(e, t) {
	return (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
}
function Ga(e, t) {
	return e === t ? 0 : Wa(e, t) ? -1 : 1;
}
function Ka(e) {
	for (let t = 1; t < e.length; t++) if (!Wa(e[t - 1], e[t])) return !1;
	return !0;
}
function qa(e, t) {
	return e === t || e instanceof Node && e.contains(t);
}
//#endregion
//#region src/rendering/url-safety.ts
var Ja = [
	"http",
	"https",
	"mailto",
	"tel"
];
function Ya(e) {
	let t = String(e ?? "");
	if (t.trim().length === 0) return !1;
	for (let e of t) {
		let t = e.codePointAt(0) ?? 0;
		if (t <= 32 || t >= 127 && t <= 159) return !1;
	}
	if ("/#?.".includes(t[0])) return !0;
	let n = t.indexOf(":");
	return n < 0 || Ja.includes(t.slice(0, n).toLowerCase());
}
function Xa(e) {
	return Ya(e) ? String(e) : void 0;
}
var Za = [
	"http:",
	"https:",
	"mailto:",
	"tel:"
];
function Qa(e) {
	let t = no(e), n = t.toLowerCase();
	return /^[\\/]{2}/.test(t) || Za.some((e) => n.startsWith(e));
}
function $a(e) {
	return typeof e != "string" || /[\x00-\x1f\x7f-\x9f]/.test(e) ? !1 : e === "/" || eo(e);
}
function eo(e) {
	return e.length > 1 && e[0] === "/" && e[1] !== "/" && e[1] !== "\\";
}
function to(e) {
	return e.length > 0 && e[0] !== "/" && e[0] !== "\\" && !/^[A-Za-z][A-Za-z\d+.-]*:/.test(e);
}
function no(e) {
	let t = 0, n = e.length;
	for (; t < n && e.charCodeAt(t) <= 32;) t++;
	for (; n > t && e.charCodeAt(n - 1) <= 32;) n--;
	return e.slice(t, n).replace(/[\t\n\r]/g, "");
}
function ro(e) {
	return io(e) !== null;
}
function io(e) {
	let t = no(e), n = t.toLowerCase();
	return eo(t) || to(t) || n.startsWith("https://") || n.startsWith("http://") || n.startsWith("data:image/") ? t : null;
}
function ao(e) {
	return io(String(e ?? "").trim()) ?? void 0;
}
//#endregion
//#region src/rendering/icon-value.ts
var oo = "mask:", so = "ui-icon--image", co = "ui-icon--mask";
function lo(e) {
	let t = String(e ?? "").trim(), n = !1;
	t.startsWith(oo) && (n = !0, t = t.slice(5).trim());
	let r = t.includes("/") ? io(t) : null;
	return r === null ? null : {
		source: r,
		tinted: n
	};
}
function uo(e) {
	let t = lo(e);
	return t === null ? "" : fo(t.source);
}
function fo(e) {
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
var po = "ui-icon", mo = "data-ui-icon", ho = "--ui-icon-url";
function go(e, t) {
	e.classList.add(po);
	for (let t of Array.from(e.classList)) vo(t) && e.classList.remove(t);
	(e instanceof HTMLElement || e instanceof SVGElement) && e.style.removeProperty(ho);
	let n = yo(t);
	if (n.length === 0) {
		e.removeAttribute(mo);
		return;
	}
	e.setAttribute(mo, ""), e.classList.add(n);
	let r = lo(t);
	r !== null && (e instanceof HTMLElement || e instanceof SVGElement) && e.style.setProperty(ho, fo(r.source));
}
var _o = "ui-icon-glyph--";
function vo(e) {
	return e === so || e === co || e.startsWith(_o);
}
function yo(e) {
	let t = lo(e);
	return t === null ? bo(e) : t.tinted ? co : so;
}
function bo(e) {
	let t = String(e ?? "").trim();
	if (t.length === 0) return "";
	let n = _o;
	for (let e of t) {
		let t = e.charCodeAt(0);
		t >= 48 && t <= 57 || t >= 65 && t <= 90 || t >= 97 && t <= 122 ? n += e.toLowerCase() : (e === "-" || e === "_" || e === "." || e === " ") && (n.endsWith("-") || (n += "-"));
	}
	return n.length === 15 ? "" : n;
}
//#endregion
//#region src/rendering/inline-markup.ts
var xo = {
	None: 0,
	Bold: 1,
	Italic: 2,
	Underline: 4,
	Strikethrough: 8,
	Code: 16
}, So = "\\", Co = "`", wo = "!", To = "{", Eo = "}", Do = "ui-text__fold", Oo = "ui-text__fold-toggle", ko = "ui-text__fold-content", Ao = 8;
function jo(e) {
	if (e == null || e.length === 0) return [];
	let t = [], n = { value: "" };
	return Uo(new Qo(e), 0, e.length, xo.None, null, t, n), Wo(t, n, xo.None, null), t;
}
function Mo(e) {
	return jo(e).map((e) => Lo(e) ? `${e.fold} ${Mo(e.text)}` : e.text).join("");
}
function No(e) {
	let t = "";
	for (let n of e) t += ts(n) ? So + n : n;
	return t;
}
function Po(e, t, n = {}) {
	let r = jo(t), i = r.some(Lo);
	e.hasAttribute("data-ui-folds") !== i && e.toggleAttribute(Ke, i), r.length === 0 ? e.textContent = "" : r.length === 1 && Fo(r[0]) ? e.textContent = r[0].text : e.replaceChildren(Ro(r, n));
}
function Fo(e) {
	return e.styles === xo.None && e.url === null && !Io(e) && !Lo(e);
}
function Io(e) {
	return e.icon !== null && e.icon !== void 0 && e.icon.length > 0;
}
function Lo(e) {
	return e.fold !== null && e.fold !== void 0;
}
function Ro(e, t) {
	let n = document.createDocumentFragment();
	for (let r of e) n.append(zo(r, t));
	return n;
}
function zo(e, t) {
	if (Io(e)) return Vo(e.icon);
	let n = Lo(e) ? Bo(e, t) : document.createTextNode(e.text);
	if ((e.styles & xo.Code) !== 0) {
		let e = document.createElement("code");
		e.className = "ui-text__code", e.append(n), n = e;
	}
	if ((e.styles & xo.Strikethrough) !== 0 && (n = Ho("s", n)), (e.styles & xo.Underline) !== 0 && (n = Ho("u", n)), (e.styles & xo.Italic) !== 0 && (n = Ho("em", n)), (e.styles & xo.Bold) !== 0 && (n = Ho("strong", n)), e.url !== null) {
		let t = document.createElement("a");
		t.setAttribute("href", e.url), t.className = "ui-text__link", Qa(e.url) && (t.setAttribute("target", "_blank"), t.setAttribute("rel", "noopener noreferrer")), t.append(n), n = t;
	}
	return n;
}
function Bo(e, t) {
	let n = document.createElement("span"), r = document.createElement(t.staticFolds === !0 ? "span" : "button"), i = document.createElement("span");
	return n.className = t.staticFolds === !0 ? `${Do} ${Do}--static` : Do, r.className = Oo, r.textContent = e.fold ?? "", i.className = ko, i.append(Ro(jo(e.text), t)), t.staticFolds === !0 ? (n.append(r, " ", i), n) : (r.setAttribute("type", "button"), r.setAttribute("aria-expanded", "false"), r.setAttribute(Qe, ""), n.append(r, i), n);
}
function Vo(e) {
	let t = document.createElement("i");
	return t.className = "ui-text__icon-inline", go(t, e), t.setAttribute("aria-hidden", "true"), t;
}
function Ho(e, t) {
	let n = document.createElement(e);
	return n.append(t), n;
}
function Uo(e, t, n, r, i, a, o) {
	let s = e.text, c = t;
	for (; c < n;) {
		let t = s[c];
		if (t === So && c + 1 < n && ts(s[c + 1])) {
			o.value += s[c + 1], c += 2;
			continue;
		}
		let l = Go(e, c, n);
		if (l !== null) {
			Wo(a, o, r, i), Ko(s, c + 1, l, o), Wo(a, o, r | xo.Code, i), c = l + 1;
			continue;
		}
		let u = Yo(e, c, n);
		if (u !== null) {
			Wo(a, o, r, i), Uo(e, c + u.markerLength, u.contentEnd, r | u.style, i, a, o), Wo(a, o, r | u.style, i), c = u.contentEnd + u.markerLength;
			continue;
		}
		let d = qo(e, c, n);
		if (d !== null) {
			Wo(a, o, r, i), a.push({
				text: "",
				styles: r,
				url: i,
				icon: d.name
			}), c = d.iconEnd;
			continue;
		}
		let f = i === null ? Xo(e, c, n) : null;
		if (f !== null) {
			Wo(a, o, r, i), Uo(e, f.labelStart, f.labelEnd, r, f.url, a, o), Wo(a, o, r, f.url), c = f.linkEnd;
			continue;
		}
		let p = Zo(e, c, n);
		p === null ? (o.value += t, c++) : (Wo(a, o, r, i), a.push({
			text: s.slice(p.contentStart, p.contentEnd),
			styles: r,
			url: i,
			fold: p.caption
		}), c = p.contentEnd + 1);
	}
}
function Wo(e, t, n, r) {
	t.value.length !== 0 && (e.push({
		text: t.value,
		styles: n,
		url: r
	}), t.value = "");
}
function Go(e, t, n) {
	let r = e.text;
	if (r[t] !== Co) return null;
	let i = t + 1;
	if (i >= n || ns(r[i])) return null;
	let a = e.findClosingMarker(i, n, Co, 1);
	return a > i ? a : null;
}
function Ko(e, t, n, r) {
	for (let i = t; i < n; i++) e[i] === So && i + 1 < n && ts(e[i + 1]) ? (r.value += e[i + 1], i++) : r.value += e[i];
}
function qo(e, t, n) {
	let r = e.text;
	if (r[t] !== wo || t + 1 >= n || r[t + 1] !== "[") return null;
	let i = t + 2, a = e.findClosingBracket(i, n);
	if (a <= i) return null;
	let o = r.slice(i, a);
	return Jo(o) ? {
		name: o,
		iconEnd: a + 1
	} : null;
}
function Jo(e) {
	return e.length > 0 && /^[A-Za-z0-9._-]+$/.test(e);
}
function Yo(e, t, n) {
	let r = e.text, i = r[t];
	if (i !== "*" && i !== "_" && i !== "~") return null;
	let a = t + 1 < n && r[t + 1] === i, o, s;
	if (i === "*" && a) o = xo.Bold, s = 2;
	else if (i === "*") o = xo.Italic, s = 1;
	else if (i === "_" && a) o = xo.Underline, s = 2;
	else if (i === "~" && a) o = xo.Strikethrough, s = 2;
	else return null;
	let c = t + s;
	if (c >= n || ns(r[c])) return null;
	let l = e.findClosingMarker(c, n, i, s);
	return l > c ? {
		style: o,
		markerLength: s,
		contentEnd: l
	} : null;
}
function Xo(e, t, n) {
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
function Zo(e, t, n) {
	let r = e.text;
	if (r[t] !== "[") return null;
	let i = e.findClosingBracket(t + 1, n);
	if (i <= t + 1 || i + 1 >= n || r[i + 1] !== To || e.hasOpeningBracket(t + 1, i)) return null;
	let a = i + 1, o = a + 1, s = e.findMatchingBrace(a, n);
	if (s <= o || e.braceDepth(a) > Ao) return null;
	let c = { value: "" };
	return Ko(r, t + 1, i, c), {
		caption: c.value,
		contentStart: o,
		contentEnd: s
	};
}
var Qo = class {
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
		return this.closeBrackets ??= this.next("]", !0), $o(this.closeBrackets[e], t);
	}
	hasOpeningBracket(e, t) {
		return this.openBrackets ??= this.next("[", !0), $o(this.openBrackets[e], t) >= 0;
	}
	findClosingParen(e, t) {
		return this.closeParens ??= this.next(")", !1), $o(this.closeParens[e], t);
	}
	findMatchingBrace(e, t) {
		return $o(this.braces()[e], t);
	}
	braceDepth(e) {
		return this.braces(), this.braceDepths[e];
	}
	findClosingMarker(e, t, n, r) {
		let i = es(n, r), a = this.closers[i] ?? this.buildClosers(n, r);
		this.closers[i] = a;
		let o = a[e + 1];
		if (r === 2) return o >= 0 && o + 1 < t ? o : -1;
		if (o >= 0 && o < t - 1) return o;
		let s = t - 1;
		return s > e && this.text[s] === n && !this.isEscaped(s) && !ns(this.text[s - 1]) ? s : -1;
	}
	readLinkUrl(e, t) {
		if (this.linkLabel !== e) {
			let n = this.text.slice(e + 2, t).trim();
			this.linkLabel = e, this.linkUrl = Ya(n) ? n : null;
		}
		return this.linkUrl;
	}
	isEscaped(e) {
		if (this.escaped === null) {
			let e = new Uint8Array(this.text.length);
			for (let t = 1; t < this.text.length; t++) e[t] = +(this.text[t - 1] === So && e[t - 1] === 0);
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
			if (this.text[r] === To) n.push(r);
			else if (this.text[r] === Eo && n.length > 0) {
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
		if (e === 0 || this.text[e] !== t || this.isEscaped(e) || ns(this.text[e - 1])) return !1;
		let r = e + 1 < this.text.length && this.text[e + 1] === t;
		return n === 2 ? r : !r;
	}
};
function $o(e, t) {
	return e >= 0 && e < t ? e : -1;
}
function es(e, t) {
	switch (e) {
		case "*": return t === 2 ? 0 : 1;
		case "_": return 2;
		case "~": return 3;
		default: return 4;
	}
}
function ts(e) {
	return e === "*" || e === "_" || e === "~" || e === "[" || e === "]" || e === "(" || e === ")" || e === To || e === Eo || e === Co || e === So;
}
function ns(e) {
	return e === " " || e === "	" || e === "\r" || e === "\n";
}
//#endregion
//#region src/runtime/plural-rules.ts
function rs(e, t) {
	if (!Number.isFinite(t)) return "other";
	let n = Math.abs(t), r = Math.trunc(n), i = is(n);
	switch (as(e)) {
		case "en":
		case "de": return r === 1 && i === 0 ? "one" : "other";
		case "es": return n === 1 ? "one" : os(r, i) ? "many" : "other";
		case "fr": return r === 0 || r === 1 ? "one" : os(r, i) ? "many" : "other";
		case "ru":
		case "uk": return ss(r, i);
		case "pl": return cs(r, i);
		default: return "other";
	}
}
function is(e) {
	if (Number.isInteger(e)) return 0;
	let t = String(e), n = t.indexOf("e"), r = n < 0 ? t : t.slice(0, n), i = n < 0 ? 0 : Number(t.slice(n + 1)), a = r.indexOf("."), o = a < 0 ? 0 : r.length - a - 1;
	return Math.max(0, o - i);
}
function as(e) {
	return e == null || e.trim().length === 0 ? "" : e.split(/[-_]/, 1)[0].toLowerCase();
}
function os(e, t) {
	return t === 0 && e !== 0 && e % 1e6 == 0;
}
function ss(e, t) {
	if (t !== 0) return "other";
	let n = e % 10, r = e % 100;
	return n === 1 && r !== 11 ? "one" : n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
function cs(e, t) {
	if (t !== 0) return "other";
	if (e === 1) return "one";
	let n = e % 10, r = e % 100;
	return n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
//#endregion
//#region src/rendering/temporal-format.ts
function ls(e, t) {
	return `${e.date} ${t ? e.longTime : e.shortTime}`;
}
var us = {
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
function ds(e) {
	let t = e.closest("[data-ui-temporal-culture]")?.getAttribute("data-ui-temporal-culture") ?? null;
	if (t === null) return us;
	try {
		return {
			...us,
			...JSON.parse(t)
		};
	} catch {
		return us;
	}
}
var fs = [
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
function ps(e, t, n) {
	if (t == null || t.trim().length === 0) return `${bs(e.getFullYear(), 4)}-${bs(e.getMonth() + 1, 2)}-${bs(e.getDate(), 2)} ${bs(e.getHours(), 2)}:${bs(e.getMinutes(), 2)}:${bs(e.getSeconds(), 2)}`;
	let r = "", i = ms(t);
	for (let a = 0; a < t.length;) {
		let o = vs(t, a);
		o === null ? (r += t[a], a++) : (r += ys(o, e, n, i), a += o.length);
	}
	return r;
}
function ms(e) {
	for (let t = 0; t < e.length;) {
		let n = vs(e, t);
		if (n === null) t++;
		else {
			if (n === "d" || n === "dd") return !0;
			t += n.length;
		}
	}
	return !1;
}
var hs = /^[-./:,]$/, gs = /* @__PURE__ */ new Set([
	"MMMM",
	"MMM",
	"dddd",
	"ddd",
	"tt"
]);
function _s(e) {
	for (let t = 0; t < e.length;) {
		let n = vs(e, t);
		if (n !== null && gs.has(n) || n === null && !hs.test(e[t]) && !/\s/.test(e[t])) return !1;
		t += n?.length ?? 1;
	}
	return e.trim().length > 0;
}
function vs(e, t) {
	for (let n of fs) if (e.startsWith(n, t)) return n;
	return null;
}
function ys(e, t, n, r) {
	let i = t.getHours(), a = zs(i);
	switch (e) {
		case "yyyy": return bs(t.getFullYear(), 4);
		case "yy": return bs(t.getFullYear() % 100, 2);
		case "MMMM": return r ? n.monthGenitiveNames[t.getMonth()] : n.monthNames[t.getMonth()];
		case "MMM": return n.abbreviatedMonthNames[t.getMonth()];
		case "MM": return bs(t.getMonth() + 1, 2);
		case "M": return String(t.getMonth() + 1);
		case "dddd": return n.dayNames[t.getDay()];
		case "ddd": return n.abbreviatedDayNames[t.getDay()];
		case "dd": return bs(t.getDate(), 2);
		case "d": return String(t.getDate());
		case "HH": return bs(i, 2);
		case "H": return String(i);
		case "hh": return bs(a, 2);
		case "h": return String(a);
		case "mm": return bs(t.getMinutes(), 2);
		case "m": return String(t.getMinutes());
		case "ss": return bs(t.getSeconds(), 2);
		case "s": return String(t.getSeconds());
		case "tt": return i < 12 ? n.amDesignator : n.pmDesignator;
		default: return e;
	}
}
function bs(e, t) {
	return String(e).padStart(t, "0");
}
var xs = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function Ss(e) {
	let t = xs.exec(e.trim());
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
function Cs(e) {
	return ws(e.year, e.month - 1, e.day, e.hour, e.minute, e.second, e.millisecond);
}
function ws(e, t, n, r = 0, i = 0, a = 0, o = 0) {
	let s = new Date(2e3, 0, 1, r, i, a, o);
	return s.setFullYear(e, t, n), s;
}
var Ts = {
	year: "y",
	month: "M",
	day: "d",
	hour: "H",
	minute: "m",
	second: "s"
};
function Es(e, t) {
	let n = "";
	for (let r = 0; r < e.length;) {
		let i = vs(e, r);
		i === null ? (n += e[r], r++) : (n += Ds(i, t).repeat(i.length), r += i.length);
	}
	return n;
}
function Ds(e, t) {
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
function Os(e, t, n) {
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
		let a = vs(t, e);
		if (a === null) {
			if (!ks(r, i, t[e])) return null;
			e++;
		} else {
			if (!As(r, i, a, n)) return null;
			e += a.length;
		}
	}
	return r.length > 0 && i.position === r.length ? Ls(i) : null;
}
function ks(e, t, n) {
	if (/\s/.test(n)) {
		for (; t.position < e.length && /\s/.test(e[t.position]);) t.position++;
		return !0;
	}
	return hs.test(n) ? t.position >= e.length || !hs.test(e[t.position]) ? !1 : (t.position++, !0) : t.position >= e.length || e[t.position].toLowerCase() !== n.toLowerCase() ? !1 : (t.position++, !0);
}
function As(e, t, n, r) {
	switch (n) {
		case "yyyy": return js(t, "year", Ps(e, t, 4, 4));
		case "yy": return js(t, "year", Ms(Ps(e, t, 2, 2)));
		case "MMMM":
		case "MMM": return js(t, "month", Ns(Fs(e, t, [
			r.monthNames,
			r.monthGenitiveNames,
			r.abbreviatedMonthNames
		])));
		case "MM":
		case "M": return js(t, "month", Ps(e, t, 1, 2));
		case "dddd":
		case "ddd": return Fs(e, t, [r.dayNames, r.abbreviatedDayNames]) !== null;
		case "dd":
		case "d": return js(t, "day", Ps(e, t, 1, 2));
		case "HH":
		case "H": return js(t, "hour", Ps(e, t, 1, 2));
		case "hh":
		case "h": return js(t, "hour12", Ps(e, t, 1, 2));
		case "mm":
		case "m": return js(t, "minute", Ps(e, t, 1, 2));
		case "ss":
		case "s": return js(t, "second", Ps(e, t, 1, 2));
		case "tt": return Is(e, t, r);
		default: return !1;
	}
}
function js(e, t, n) {
	return n !== null && (e[t] = n, !0);
}
function Ms(e) {
	return e === null ? null : e + (e < 50 ? 2e3 : 1900);
}
function Ns(e) {
	return e === null ? null : e + 1;
}
function Ps(e, t, n, r) {
	let i = t.position;
	for (; i < e.length && i - t.position < r && e[i] >= "0" && e[i] <= "9";) i++;
	if (i - t.position < n) return null;
	let a = Number(e.slice(t.position, i));
	return t.position = i, a;
}
function Fs(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = null, a = 0;
	for (let e of n) for (let t = 0; t < e.length; t++) {
		let n = e[t].toLowerCase();
		n.length > a && r.startsWith(n) && (i = t, a = n.length);
	}
	return t.position += a, i;
}
function Is(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = n.amDesignator.toLowerCase(), a = n.pmDesignator.toLowerCase();
	for (let [e, n] of i.length >= a.length ? [[i, !1], [a, !0]] : [[a, !0], [i, !1]]) if (e.length > 0 && r.startsWith(e)) return t.position += e.length, t.afternoon = n, !0;
	return i.length === 0 && a.length === 0;
}
function Ls(e) {
	let t = e.hour ?? 0;
	if (e.hour12 !== null) {
		if (e.hour12 < 1 || e.hour12 > 12) return null;
		t = e.hour12 % 12 + (e.afternoon === !0 ? 12 : 0);
	}
	return e.year === null || e.month === null || e.day === null || e.year < 1 || e.month < 1 || e.month > 12 || e.day < 1 || e.day > ws(e.year, e.month, 0).getDate() || t > 23 || e.minute > 59 || e.second > 59 ? null : {
		year: e.year,
		month: e.month,
		day: e.day,
		hour: t,
		minute: e.minute,
		second: e.second,
		millisecond: 0
	};
}
var Rs = {
	readCulture: ds,
	format: ps,
	parse: Ss,
	toDate: Cs
};
function zs(e) {
	return e % 12 == 0 ? 12 : e % 12;
}
//#endregion
//#region src/rendering/timestamp-format.ts
var Bs = /(?:Z|[+-]\d{2}(?::?\d{2})?)$/i, Vs = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function Hs(e) {
	let t = e?.trim() ?? "";
	if (!Vs.test(t)) return null;
	let n = Date.parse(Bs.test(t) ? t : `${t}Z`);
	return Number.isNaN(n) ? null : n;
}
function Us(e) {
	return e === "date" || e === "time" || e === "relative" || e === "relative-date" ? e : "date-time";
}
function Ws(e) {
	return e === "relative" || e === "relative-date";
}
var Gs = {
	...us,
	date: "yyyy-MM-dd",
	shortTime: "HH:mm",
	longTime: "HH:mm:ss"
};
function Ks(e, t, n, r) {
	if (t === "relative") return rc(e - r, n.language);
	if (t === "relative-date") {
		let t = Js(e, r);
		if (t !== null) return Zs(n.language).format(t, "day");
	}
	let i = n.temporal ?? Gs, a = t === "date" || t === "relative-date" ? i.date : t === "time" ? i.shortTime : ls(i, !1);
	return ps(new Date(e), a, i);
}
function qs(e, t, n, r) {
	let i = Ks(e, t, n, r);
	return t === "relative-date" ? Ys(i, n.language) : i;
}
function Js(e, t) {
	let n = new Date(e), r = new Date(t), i = Math.round((Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) - Date.UTC(r.getFullYear(), r.getMonth(), r.getDate())) / nc);
	return Math.abs(i) <= 1 ? i : null;
}
function Ys(e, t) {
	return e.length === 0 ? e : e.charAt(0).toLocaleUpperCase(Qs(t)) + e.slice(1);
}
var Xs = /* @__PURE__ */ new Map();
function Zs(e) {
	let t = Xs.get(e);
	return t === void 0 && (t = new Intl.RelativeTimeFormat(Qs(e), { numeric: "auto" }), Xs.set(e, t)), t;
}
function Qs(e) {
	if (e.length !== 0) try {
		return Intl.DateTimeFormat.supportedLocalesOf(e).length > 0 ? e : void 0;
	} catch {
		return;
	}
}
var $s = 1e3, ec = 60 * $s, tc = 60 * ec, nc = 24 * tc;
function rc(e, t) {
	let n = Zs(t), r = Math.abs(e);
	return r < 45 * $s ? n.format(0, "second") : r < 45 * ec ? n.format(Math.round(e / ec), "minute") : r < 22 * tc ? n.format(Math.round(e / tc), "hour") : r < 26 * nc ? n.format(Math.round(e / nc), "day") : r < 320 * nc ? n.format(Math.round(e / (30.4375 * nc)), "month") : n.format(Math.round(e / (365.25 * nc)), "year");
}
//#endregion
//#region src/runtime/words.ts
var ic = "count";
function E(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	if (typeof t.key != "string" || t.key.trim().length === 0) return !1;
	for (let e of Object.keys(t)) if (e !== "key" && e !== "args") return !1;
	return t.args === void 0 || t.args === null || typeof t.args == "object" && !Array.isArray(t.args);
}
function ac(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.text == "string" && t.text.trim().length > 0 && Object.keys(t).length === 1;
}
var oc = /* @__PURE__ */ new Set([
	"date-time",
	"date",
	"time",
	"relative",
	"relative-date"
]);
function sc(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	for (let e of Object.keys(t)) if (e !== "moment" && e !== "format") return !1;
	return typeof t.moment == "string" && Hs(t.moment) !== null && (t.format === void 0 || typeof t.format == "string" && oc.has(t.format));
}
function cc(e) {
	if (typeof e != "object" || !e) return !1;
	if (sc(e)) return !0;
	for (let t of Array.isArray(e) ? e : Object.values(e)) if (cc(t)) return !0;
	return !1;
}
function lc(e, t) {
	let n = new Date(e).toISOString(), r = n.slice(0, 10), i = n.slice(11, 16);
	return t === "date" || t === "relative-date" ? r : t === "time" ? `${i} UTC` : `${r} ${i} UTC`;
}
function uc(e, t, n) {
	return E(e) ? pc(n, e.key, e.args) : ac(e) ? dc(n, e.text) : t && typeof e == "string" ? dc(n, e) : e;
}
function dc(e, t) {
	return t.trim().length === 0 || !fc(e.prefixes, t) ? t : e.lookup(t) ?? t;
}
function fc(e, t) {
	if (e.length === 0) return !0;
	for (let n of e) if (t.startsWith(n)) return !0;
	return !1;
}
function pc(e, t, n, r = !1) {
	let i = n?.[ic];
	return mc(typeof i == "number" ? e.lookup(`${t}.${rs(e.language, i)}`) ?? e.lookup(`${t}.other`) ?? e.lookup(t) ?? t : e.lookup(t) ?? t, n, (t) => ac(t) ? dc(e, t.text) : pc(e, t.key, t.args, r), e.writeMoment, r);
}
function mc(e, t, n, r = lc, i = !1) {
	if (t == null || !e.includes("{")) return e;
	let a = "", o = 0;
	for (; o < e.length;) {
		if (e[o] === "{") {
			let s = hc(e, o);
			if (s > 0) {
				let c = e.slice(o + 1, s);
				if (Object.hasOwn(t, c)) {
					a += _c(t[c], n, r, i), o = s + 1;
					continue;
				}
			}
		}
		a += e[o], o++;
	}
	return a;
}
function hc(e, t) {
	let n = t + 1;
	for (; n < e.length && gc(e.charCodeAt(n));) n++;
	return n > t + 1 && n < e.length && e[n] === "}" ? n : -1;
}
function gc(e) {
	return e >= 48 && e <= 57 || e >= 65 && e <= 90 || e >= 97 && e <= 122 || e === 95;
}
function _c(e, t, n, r) {
	if (e == null) return "";
	if (typeof e == "string") return r ? No(e) : e;
	if (typeof e == "boolean") return e ? "true" : "false";
	if (E(e)) return t === void 0 ? mc(e.key, e.args, void 0, n, r) : t(e);
	if (ac(e)) {
		let n = t === void 0 ? e.text : t(e);
		return r ? No(n) : n;
	}
	return sc(e) ? n(Hs(e.moment) ?? 0, e.format ?? "date-time") : String(e);
}
//#endregion
//#region src/rendering/moment-first-paint.ts
var vc = `script[type='application/json'][${yt}]`;
function yc(e) {
	let t = e.querySelector(vc)?.textContent?.trim() ?? "";
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
var bc = 15e3, xc = /* @__PURE__ */ new Set(), Sc = null;
function Cc(e) {
	xc.add(e), Sc === null && (Sc = setInterval(wc, bc));
}
function wc() {
	for (let e of [...xc]) {
		let t = !1;
		try {
			t = e();
		} catch (e) {
			s("a relative tick failed; it is ticked no more.", e);
		}
		t || xc.delete(e);
	}
	xc.size === 0 && Sc !== null && (clearInterval(Sc), Sc = null);
}
//#endregion
//#region src/runtime/client-strings.ts
var Tc = 256, Ec = 512, Dc = "script[type='application/json'][data-ui-strings]", Oc = `[${Ur}*='"moment"']`, kc = class {
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
		this.tableLoaded || (this.currentTemporal = yc(e) ?? this.currentTemporal);
		let t = e.querySelector(Dc)?.textContent?.trim() ?? "";
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
		return this.lookup(e) === void 0 && this.text(e), pc(this, e, t, n);
	}
	translate(e, t, n = !1) {
		return pc(this, e, t, n);
	}
	writeMoment = (e, t) => (Ws(t) && this.noteRelative(), Ks(e, t, {
		temporal: this.currentTemporal,
		language: this.currentLanguage
	}, Date.now()));
	noteRelative() {
		this.relativeWritten = !0, this.momentHandlers.size > 0 && Cc(this.tickMoments);
	}
	tickMoments = () => this.relativeWritten ? (this.relativeWritten = !1, this.notify(this.momentHandlers, "a moment tick handler failed."), !0) : !1;
	resolve(e, t) {
		return uc(e, t, this);
	}
	resolveText(e) {
		return uc(e, !0, this);
	}
	write(e, t, n, r) {
		Lc(e, t, this.translate(n, r, Ic(t))), this.mark(e, t, r == null || Object.keys(r).length === 0 ? [n] : [n, r]);
	}
	writeText(e, t, n) {
		Lc(e, t, uc(n, !0, this)), this.mark(e, t, n);
	}
	writeValue(e, t, n) {
		if (E(n)) {
			this.write(e, t, n.key, n.args);
			return;
		}
		let r = ac(n) ? n.text : typeof n == "string" ? n : "";
		r.trim().length > 0 ? this.writeText(e, t, r) : (Lc(e, t, ""), this.mark(e, t, null));
	}
	mark(e, t, n) {
		Mc(e, t, n);
	}
	rewriteMarks(e, t = !1) {
		Rc(e, (e) => {
			for (let n of e.querySelectorAll(t ? Oc : `[${Ur}]`)) for (let [e, r] of Object.entries(Fc(n))) {
				if (t && !cc(r)) continue;
				let i = e === "#text" ? null : e, a = this.wordsOfMark(r, Ic(i));
				a !== null && Lc(n, i, a);
			}
		});
	}
	wordsOfMark(e, t) {
		if (typeof e == "string") return uc(e, !0, this);
		if (!Array.isArray(e)) return null;
		let [n, r] = e;
		return typeof n == "string" ? this.translate(n, typeof r == "object" && r ? r : null, t) : null;
	}
	askLater(e) {
		this.asker === null || !this.tableLoaded || e.length > Ec || e.trim().length === 0 || (!this.complete || this.report && this.currentPrefixes.length > 0 && fc(this.currentPrefixes, e)) && (this.askedIn(this.currentLanguage).has(e) || (this.pending.add(e), !this.flushQueued && (this.flushQueued = !0, setTimeout(() => void this.flushAsync(), 0))));
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
		for (let r = 0; r < n.length; r += Tc) try {
			let a = await e(t, n.slice(r, r + Tc));
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
function Ac(e) {
	let t = !1;
	return Rc(e, (e) => {
		t ||= e.querySelector(Oc) !== null;
	}), t;
}
function jc(e, t) {
	e.hasAttribute("data-ui-words") && Mc(e, t, null);
}
function Mc(e, t, n) {
	let r = Fc(e), i = t ?? "#text";
	if (n === null) {
		if (!(i in r)) return;
		delete r[i];
	} else r[i] = n;
	let a = JSON.stringify(r);
	C(e, Ur, Object.keys(r).length === 0 ? null : a);
}
function Nc(e) {
	return Pc(e, null);
}
function Pc(e, t) {
	let n = Fc(e)[t ?? "#text"];
	if (typeof n == "string") return n;
	if (!Array.isArray(n) || typeof n[0] != "string") return null;
	let r = n[1];
	return {
		key: n[0],
		args: typeof r == "object" && r ? r : null
	};
}
function Fc(e) {
	let t = e.getAttribute(Ur);
	if (t === null || t.length === 0) return {};
	try {
		let e = JSON.parse(t);
		return typeof e == "object" && e && !Array.isArray(e) ? e : {};
	} catch {
		return {};
	}
}
function Ic(e) {
	return e === Re;
}
function Lc(e, t, n) {
	t === null ? e.textContent !== n && (e.textContent = n) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function Rc(e, t) {
	t(e);
	for (let n of e.querySelectorAll("template")) Rc(n.content, t);
}
var D = new kc();
function zc(e, t) {
	let n = ac(e) ? e.text : e;
	return D.resolve(n, typeof n == "string" && n.length > 0 && t());
}
//#endregion
//#region src/updates/row-idle.ts
var Bc = "row-idle";
function Vc(e) {
	let t = e.parentElement;
	t !== null && (Gc(t) ? Hc(t) : !t.hasAttribute("data-ui-id") && t.parentElement !== null && Gc(t.parentElement) && Hc(t.parentElement));
}
function Hc(e) {
	let t = Uc(e);
	e.hasAttribute("data-ui-row-idle") !== t && e.toggleAttribute(jr, t);
}
function Uc(e) {
	for (let t of e.children) if (t.hasAttribute("data-ui-id")) {
		if (Wc(t)) return !0;
	} else for (let e of t.children) if (e.hasAttribute("data-ui-id") && Wc(e)) return !0;
	return !1;
}
function Wc(e) {
	return e.classList.contains("ui-disabled") || e.classList.contains("ui-loading");
}
function Gc(e) {
	return e.hasAttribute("data-ui-key") && e.parentElement?.hasAttribute("data-ui-items-host") === !0;
}
//#endregion
//#region src/interactions/interactive-state.ts
var Kc = `.${bi}, .${xi}, [inert]`;
function qc(e) {
	return `:scope > [${y}]:is(${e}), :scope > :not([${y}]) > [${y}]:is(${e})`;
}
var Jc = qc(Kc), Yc = /* @__PURE__ */ new Map();
function O(e) {
	return e.closest(Kc) !== null || e.matches(":disabled, [aria-disabled='true']");
}
function k(e) {
	return e.matches(Kc) || e.querySelector(Jc) !== null;
}
function Xc(e, t) {
	if (e.hasAttribute(t)) return !0;
	let n = Yc.get(t);
	return n === void 0 && (n = qc(`[${t}]`), Yc.set(t, n)), e.querySelector(n) !== null;
}
function Zc(e) {
	return e.getClientRects().length > 0 && !e.matches(":disabled") && e.closest("[inert]") === null;
}
var Qc = `[${y}], .${Si}`;
function A(e) {
	return e.closest(Qc)?.matches(`.${Si}`) === !0;
}
function $c(e, t) {
	e.classList.contains("ui-disabled") !== t && (e.classList.toggle(bi, t), Vc(e)), t ? e.setAttribute("aria-disabled", "true") : e.removeAttribute("aria-disabled");
}
var el = {
	isInert: O,
	isReadOnly: A,
	setDisabled: $c
};
//#endregion
//#region src/interactions/grid-tracks.ts
function tl(e, t) {
	return Math.max(e, Math.round(t / 10));
}
function nl(e) {
	let t = [];
	for (let n of al(e.trim())) {
		let e = /^repeat\(\s*(\d+)\s*,(.+)\)$/s.exec(n);
		if (e !== null) {
			let n = nl(e[2]);
			if (n === null) return null;
			for (let r = Number(e[1]); r > 0; r--) t.push(...n);
			continue;
		}
		let r = rl(n);
		if (r === null) return null;
		t.push(r);
	}
	return t.length === 0 ? null : t;
}
function rl(e) {
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
	if (n !== null) return il({
		kind: "auto",
		value: 0
	}, Number(n[1]));
	let r = /^minmax\(\s*([\d.]+)(?:px)?\s*,\s*([\d.]+)(fr|px)\s*\)$/.exec(e);
	if (r !== null) return il(r[3] === "fr" ? {
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
function il(e, t) {
	return t > 0 ? {
		...e,
		min: t
	} : e;
}
function al(e) {
	let t = [], n = 0, r = 0;
	for (let i = 0; i < e.length; i++) {
		let a = e[i];
		a === "(" ? n++ : a === ")" ? n-- : a === " " && n === 0 && (i > r && t.push(e.slice(r, i)), r = i + 1);
	}
	return r < e.length && t.push(e.slice(r)), t;
}
function ol(e, t = "auto") {
	return e.map((e) => sl(e, t)).join(" ");
}
function sl(e, t) {
	switch (e.kind) {
		case "px": return `${cl(e.value)}px`;
		case "star": return `minmax(${e.min === void 0 ? "0" : `${cl(e.min)}px`}, ${cl(e.value)}fr)`;
		case "auto": return e.min === void 0 ? e.max === void 0 ? t : `fit-content(${cl(e.max)}px)` : `minmax(${cl(e.min)}px, auto)`;
	}
}
function cl(e) {
	return String(Math.round(e * 1e3) / 1e3);
}
function ll(e) {
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
function ul(e, t) {
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
function dl(e, t, n) {
	let r = 0, i = n;
	for (let n of t) n < e && n + 1 > r ? r = n + 1 : n > e && n < i && (i = n);
	let a = fl(r, e), o = fl(e + 1, i);
	return a.length === 0 || o.length === 0 ? null : {
		before: a,
		after: o
	};
}
function fl(e, t) {
	let n = [];
	for (let r = e; r < t; r++) n.push(r);
	return n;
}
var pl = {
	sliver: 120,
	passFloors: !1
};
function ml(e, t, n, r, i = pl) {
	let a = _l(e, t, n.before), o = _l(e, t, n.after);
	if (a.total + o.total <= 0) return null;
	let s = Math.max((i.passFloors ? 0 : a.min) - a.total, o.total - o.max), c = Math.min(a.max - a.total, o.total - (i.passFloors ? 0 : o.min));
	if (s > c) return null;
	let l = (e) => i.sliver > 0 && i.passFloors ? Math.max(i.sliver, e.min) : i.sliver, u = gl(Math.min(Math.max(r, s), c), r, a.total, o.total, s, c, l(a), l(o));
	if (u === 0) return null;
	let d = [...e], f = n.before.every((t) => e[t].kind === "star"), p = n.after.every((t) => e[t].kind === "star");
	if (f && p) {
		let t = Sl(n.before, e) + Sl(n.after, e), r = a.total + o.total;
		vl(d, e, a, t * (a.total + u) / r), vl(d, e, o, t * (o.total - u) / r);
	} else f || yl(d, a, a.total + u), p || yl(d, o, o.total - u);
	return i.passFloors && (hl(d, a, a.total + u), hl(d, o, o.total - u)), d;
}
function hl(e, t, n) {
	if (!(n >= t.min - .5)) for (let n of t.indices) {
		let { min: t, ...r } = e[n];
		e[n] = r;
	}
}
function gl(e, t, n, r, i, a, o, s) {
	let c = e, l = n + c, u = r - c;
	return l > 0 && l < o ? c = t < 0 ? -n : o - n : u > 0 && u < s && (c = t > 0 ? r : r - s), Math.min(Math.max(c, i), a);
}
function _l(e, t, n) {
	let r = xl(n, t), i = n.map((e) => r > 0 ? t[e] / r : 1 / n.length), a = 0, o = Infinity;
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
function vl(e, t, n, r) {
	let i = Sl(n.indices, t);
	for (let a = 0; a < n.indices.length; a++) {
		let o = n.indices[a], s = i > 0 && n.total > 0 ? n.shares[a] : 1 / n.indices.length;
		e[o] = {
			...t[o],
			value: r * s
		};
	}
}
function yl(e, t, n) {
	for (let r = 0; r < t.indices.length; r++) {
		let i = t.indices[r];
		e[i] = {
			kind: "px",
			value: n * t.shares[r],
			...bl(e[i])
		};
	}
}
function bl(e) {
	return {
		...e.min === void 0 ? {} : { min: e.min },
		...e.max === void 0 ? {} : { max: e.max }
	};
}
function xl(e, t) {
	let n = 0;
	for (let r of e) n += t[r];
	return n;
}
function Sl(e, t) {
	let n = 0;
	for (let r of e) n += t[r].value;
	return n;
}
function Cl(e, t) {
	return Math.round(wl(e, t) * 100);
}
function wl(e, t) {
	let n = xl(t.before, e), r = n + xl(t.after, e);
	return r <= 0 ? 0 : n / r;
}
function Tl(e, t, n) {
	let r = xl(t.before, e);
	return (r + xl(t.after, e)) * Math.min(Math.max(n, 0), 1) - r;
}
function El(e) {
	let t = e === null || e.length === 0 ? NaN : Number(e);
	return t >= 0 && t <= 1 ? t : null;
}
function Dl(e, t) {
	let n = [];
	for (let r = 0, i = 0; r < t; r++) n.push(i), i += Number.isFinite(e[r]) ? e[r] : 0;
	return n;
}
var Ol = /* @__PURE__ */ new Set();
function kl(e, t, n, r) {
	let i = _l(e, t, n.before), a = _l(e, t, n.after);
	return i.total >= 1 && i.total < r ? -i.total : a.total >= 1 && a.total < r ? a.total : i.total >= 1 && i.total < i.min - .5 ? i.min - i.total : a.total >= 1 && a.total < a.min - .5 ? a.total - a.min : 0;
}
function Al(e, t, n, r) {
	let i = /* @__PURE__ */ new Set();
	for (let a of [n.before, n.after]) {
		let n = _l(e, t, a);
		n.total < Math.max(r, n.min - .5) && a.forEach((e) => i.add(e));
	}
	return i;
}
function jl(e, t) {
	return e.map((e, n) => t.has(n) ? {
		kind: "px",
		value: 0
	} : e);
}
function Ml(e, t, n, r = Ol) {
	let i = Number(e);
	if (!Number.isInteger(i) || i < 1) return !1;
	let a = /^span\s+(\d+)$/.exec(t.trim()), o = Number(t), s = a === null ? Number.isInteger(o) && o > i ? o : i + 1 : i + Number(a[1]);
	return s - 1 <= n.length && n.slice(i - 1, s - 1).every((e, t) => e < 1 || r.has(i - 1 + t));
}
//#endregion
//#region src/extensions/value-readers.ts
function Nl(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" ? String(e) : JSON.stringify(e);
}
function Pl(e) {
	return e == null;
}
var Fl = "data-ui-trim-input", Il = class {
	readers = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let e of Bl) this.register(e);
		for (let t of e ?? []) this.register(t);
	}
	register(e) {
		this.readers.set(e.kind, e.read);
	}
	read(e) {
		let t = e.getAttribute(Bt);
		if (t === null) return Ll(e);
		let n = this.readers.get(t);
		return n === void 0 ? (s("value reader: no reader registered for this kind.", { kind: t }), null) : n(e);
	}
	readBound(e) {
		let t = this.read(e);
		return typeof t == "string" && e.hasAttribute(Fl) ? t.trim() : t;
	}
	readHeld(e) {
		let t = zl(e);
		return t === null ? null : this.read(t);
	}
};
function Ll(e) {
	if (e instanceof HTMLInputElement) switch (e.type) {
		case "checkbox": return e.checked;
		case "number":
		case "range": return e.value.trim().length === 0 ? null : Number(e.value);
		default: return e.value;
	}
	return e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement ? e.value : e instanceof HTMLDetailsElement ? e.open : null;
}
var Rl = "input, textarea, select";
function zl(e) {
	return e.hasAttribute("data-ui-value-kind") || e.matches(Rl) ? e : e.querySelector("[data-ui-value-holder]") ?? e.querySelector(`[data-ui-value-kind], ${Rl}`);
}
var Bl = [
	{
		kind: "flyout-open",
		read: (e) => e.classList.contains("ui-flyout--open")
	},
	{
		kind: "splitter-position",
		read: (e) => El(e.getAttribute(Yn))
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
		read: (e) => Vl(e, li)
	},
	{
		kind: Vt,
		read: (e) => Vl(e, ut)
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
function Vl(e, t) {
	let n = e.getAttribute(t);
	return n === null ? null : JSON.parse(n);
}
function Hl(e) {
	e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio") ? e.checked = !1 : (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement) && (e.value = "");
}
//#endregion
//#region src/interactions/keyboard-shortcut.ts
function Ul(e) {
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
		default: o = au(e);
	}
	return o === null ? null : {
		code: o,
		ctrl: n,
		shift: r,
		alt: i,
		meta: a
	};
}
function Wl(e, t, n = $l()) {
	return t.code !== e.code || t.shiftKey !== e.shift || t.altKey !== e.alt ? !1 : e.ctrl && !e.meta && n ? t.ctrlKey !== t.metaKey : t.ctrlKey === e.ctrl && t.metaKey === e.meta;
}
function Gl(e, t = $l()) {
	let n = Yl(e.code, t);
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
function Kl(e, t = $l()) {
	let n = ql(e.code), r = (t, r) => [
		t ? "Control" : "",
		e.alt ? "Alt" : "",
		e.shift ? "Shift" : "",
		r ? "Meta" : "",
		n
	].filter((e) => e.length > 0).join("+");
	return e.ctrl && !e.meta && t ? `${r(!0, !1)} ${r(!1, !0)}` : r(e.ctrl, e.meta);
}
function ql(e) {
	return /^Key[A-Z]$/.test(e) ? e.slice(3) : /^Digit[0-9]$/.test(e) ? e.slice(5) : Jl[e] ?? e;
}
var Jl = {
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
function Yl(e, t) {
	return /^Key[A-Z]$/.test(e) ? e.slice(3) : /^Digit[0-9]$/.test(e) ? e.slice(5) : (t ? Zl[e] : void 0) ?? Xl[e] ?? e;
}
var Xl = {
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
}, Zl = {
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
}, Ql = null;
function $l() {
	return Ql === null && (Ql = eu()), Ql;
}
function eu() {
	if (typeof navigator > "u") return !1;
	let e = navigator.userAgentData?.platform;
	return /mac/i.test(e ?? navigator.platform ?? "");
}
var tu = {
	words(e) {
		let t = Ul(e);
		return t === null ? null : Gl(t);
	},
	aria(e) {
		let t = Ul(e);
		return t === null ? null : Kl(t);
	},
	matches(e, t) {
		let n = Ul(t);
		return n !== null && Wl(n, e);
	},
	isComposing: j
}, nu = 229;
function j(e) {
	return e.isComposing || e.keyCode === nu;
}
function M(e, t = {}) {
	return !e.ctrlKey && !e.metaKey && (t.alt === !0 || !e.altKey) && (t.shift === !0 || !e.shiftKey) && !j(e);
}
var ru = class {
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
function iu(e) {
	return [
		e.ctrl ? "ctrl" : "",
		e.shift ? "shift" : "",
		e.alt ? "alt" : "",
		e.meta ? "meta" : "",
		e.code
	].filter((e) => e.length > 0).join("+");
}
function au(e) {
	if (e.length === 1) {
		let t = e.toUpperCase();
		return t >= "A" && t <= "Z" ? `Key${t}` : t >= "0" && t <= "9" ? `Digit${t}` : ou[t] ?? null;
	}
	let t = e.length === 0 ? "" : e[0].toUpperCase() + e.slice(1).toLowerCase();
	return /^F([1-9]|1[0-9]|2[0-4])$/.test(t.toUpperCase()) ? t.toUpperCase() : ou[t] ?? null;
}
var ou = {
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
}, su = "data-ui-rename-field";
function cu(e) {
	return e instanceof Element && e.closest(`[${su}]`) !== null;
}
function lu(e) {
	let { container: t, title: n } = e;
	if (t.querySelector(`.${e.className}`) !== null) return !1;
	let r = document.createElement("input");
	r.type = "text", r.className = e.className, r.setAttribute(su, ""), r.setAttribute(Qe, ""), r.value = e.value, uu(r, n, t);
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
function uu(e, t, n) {
	let r = t.getBoundingClientRect(), i = n.getBoundingClientRect(), a = getComputedStyle(t), o = du(n), s = o > 0 && i.width > 0 ? i.width / o : 1;
	e.style.left = fu((r.left - i.left) / s - n.clientLeft), e.style.top = fu((r.top - i.top) / s - n.clientTop), e.style.width = fu(r.width / s), e.style.height = fu(r.height / s), e.style.fontFamily = a.fontFamily, e.style.fontSize = a.fontSize, e.style.fontWeight = a.fontWeight, e.style.fontStyle = a.fontStyle, e.style.lineHeight = a.lineHeight, e.style.letterSpacing = a.letterSpacing, e.style.textAlign = a.textAlign;
}
function du(e) {
	let t = getComputedStyle(e), n = parseFloat(t.width);
	return Number.isFinite(n) ? t.boxSizing === "border-box" ? n : n + parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth) : e.offsetWidth;
}
function fu(e) {
	return `${Math.round(e * 64) / 64}px`;
}
//#endregion
//#region src/interactions/field-escape.ts
var pu = "data-ui-runs-on-escape", mu = "ui-key-value-action__row", hu = "ui-key-value-action__value-input", gu = "ui-key-value-action__edit-action";
function _u(e) {
	return j(e) || vu(e.target) !== null;
}
function vu(e) {
	return e instanceof Element ? cu(e) || yu(e) ? e : e.closest("[data-ui-owns-keys]") ?? bu(e)?.cell ?? null : null;
}
function yu(e) {
	return e instanceof Element && e.hasAttribute(pu) && (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && !e.readOnly && !O(e);
}
function bu(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${hu}, .${gu}`), n = t?.closest(".ui-key-value-action__row") ?? null;
	return t === null || n === null || !n.hasAttribute("data-ui-row-editing") ? null : {
		cell: t,
		row: n
	};
}
//#endregion
//#region src/interactions/caret-fields.ts
var xu = /* @__PURE__ */ new Set([
	"text",
	"search",
	"number",
	"password",
	"email",
	"url",
	"tel"
]), Su = /* @__PURE__ */ new Set([
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
]), Cu = /* @__PURE__ */ new Set([
	"KeyA",
	"KeyC",
	"KeyV",
	"KeyX",
	"KeyZ",
	"KeyY",
	"Insert"
]), wu = /^F\d{1,2}$/;
function Tu(e) {
	return e instanceof HTMLInputElement && xu.has(e.type);
}
function Eu(e) {
	return Tu(e) || e instanceof HTMLTextAreaElement;
}
function Du(e) {
	return Eu(e) || e instanceof HTMLElement && e.isContentEditable;
}
function Ou(e) {
	let t = e.target;
	if (!Du(t)) return !1;
	if (j(e)) return !0;
	let n = e.key;
	return n === "Tab" || n === "Escape" || wu.test(n) || e.altKey ? !1 : n === "Enter" ? !Tu(t) : e.ctrlKey || e.metaKey ? Su.has(n) || Cu.has(e.code) : !0;
}
var ku = {
	...tu,
	isFieldKey: Ou,
	isPlainKey: M,
	isEscapeClaimed: _u
}, Au = "ui-draft-dropped";
function ju(e) {
	e.dispatchEvent(new Event(Au, { bubbles: !0 }));
}
//#endregion
//#region src/interactions/own-control.ts
var Mu = `.ui-text-input__row, .ui-number-input__row, .ui-temporal-input__row, .ui-file-input__row, .ui-color-input__row, .${Ai}, .ui-field-box`, Nu = "button, a, input, select, textarea, label, summary, [role='button'], [contenteditable=''], [contenteditable='true']", Pu = `${Nu}, ${Mu}, ${ki}, .${_e}`, Fu = "button, a, summary, [role='button']";
function Iu(e) {
	let t = [];
	for (let n of e.querySelectorAll(Pu)) if (!(n.classList.contains("ui-row__grip") || !zu(e, n) || Ru(e, n) || t.some((e) => e.contains(n))) && (t.push(n), t.length > 1)) return null;
	let n = t[0];
	return n instanceof HTMLElement && n.matches(Fu) ? n : null;
}
function Lu(e) {
	let t = [];
	for (let n of e.querySelectorAll(Nu)) Ru(e, n) && zu(e, n) && t.push(n);
	return t;
}
function Ru(e, t) {
	let n = t.closest(`[${de}]`);
	return n !== null && n !== e && e.contains(n);
}
function zu(e, t) {
	let n = t.closest(ki);
	return (n === null || !e.contains(n)) && t.closest(".ui-action-bar") === null;
}
function Bu(e, t) {
	if (!(e instanceof Element)) return null;
	let n = e.closest(Pu);
	return n !== null && n !== t && t.contains(n) ? n : null;
}
//#endregion
//#region src/interactions/roving-focus.ts
function Vu(e) {
	let t = Gu(e.key), n = Ku(e.key, e.axis);
	if (t === null && n === 0) return null;
	let r = e.items.filter(P);
	if (r.length === 0) return null;
	if (t !== null) return t === "first" ? r[0] : r[r.length - 1];
	let i = e.current === null ? -1 : r.indexOf(e.current);
	if (i === -1) return n > 0 ? r[0] : r[r.length - 1];
	let a = i + n;
	return a >= 0 && a < r.length ? r[a] : e.loop ?? !0 ? r[(a + r.length) % r.length] : null;
}
function Hu(e, t) {
	return Gu(e) !== null || Ku(e, t) !== 0;
}
var Uu = {
	target: Vu,
	applyTabIndex: N
};
function N(e, t) {
	for (let n of e) n.tabIndex = n === t ? 0 : -1;
}
function Wu(e, t) {
	t !== null && (N(e, t), t.focus());
}
function P(e) {
	return e.getClientRects().length > 0 && !O(e);
}
function Gu(e) {
	return e === "Home" ? "first" : e === "End" ? "last" : null;
}
function Ku(e, t) {
	return t !== "horizontal" && (e === "ArrowDown" || e === "ArrowUp") ? e === "ArrowDown" ? 1 : -1 : t !== "vertical" && (e === "ArrowRight" || e === "ArrowLeft") ? e === "ArrowRight" ? 1 : -1 : 0;
}
//#endregion
//#region src/items/items-viewport.ts
function qu(e) {
	return e.hasAttribute("data-ui-host-viewport") ? e.parentElement ?? e : e;
}
function Ju(e) {
	return e instanceof Element ? e.hasAttribute("data-ui-items-host") ? e : e.querySelector(`:scope > [${x}][${Gt}]`) : null;
}
function Yu(e) {
	let t = qu(e);
	return t === e ? {
		top: e.scrollTop,
		height: e.clientHeight,
		contentHeight: e.scrollHeight
	} : {
		top: t.scrollTop - Zu(e, t),
		height: t.clientHeight,
		contentHeight: e.scrollHeight
	};
}
function Xu(e, t) {
	let n = qu(e);
	n.scrollTop = n === e ? t : t + Zu(e, n);
}
function Zu(e, t) {
	return e.getBoundingClientRect().top - t.getBoundingClientRect().top - t.clientTop + t.scrollTop;
}
function Qu(e) {
	let t = e.getBoundingClientRect();
	return t.height > 0 || e.firstElementChild === null ? t : e.firstElementChild.getBoundingClientRect();
}
//#endregion
//#region src/interactions/multi-select-keys.ts
function $u(e) {
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
function ed(e) {
	if (e === null) return null;
	let t = Number(e);
	return Number.isInteger(t) && t > 0 ? t : null;
}
function td(e, t) {
	return t !== null && e.length >= t;
}
function nd(e, t, n) {
	return e.includes(t) ? e.filter((e) => e !== t) : td(e, n) ? null : [...e, t];
}
function rd(e, t) {
	return e.includes(t) ? e.filter((e) => e !== t) : null;
}
var id = /[,\uFF0C\r\n]/;
function ad(e) {
	return id.test(e);
}
function od(e) {
	return e.split(id).map((e) => e.trim()).filter((e) => e.length > 0);
}
function sd(e) {
	let t = e.split(id), n = t.pop() ?? "";
	return {
		tags: t.map((e) => e.trim()).filter((e) => e.length > 0),
		rest: n
	};
}
function cd(e, t, n, r, i) {
	let a = [...e], o = [], s = null;
	for (let e of t) {
		if (a.includes(e.key)) continue;
		let t = [...a, e.key], c = td(a, n) ? r : i(a, t);
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
function ld(e, t, n) {
	let r = [];
	for (let i of e.querySelectorAll(t)) i.closest(n) === e && r.push(i);
	return r;
}
function ud(e) {
	return ld(e, Hn, `.${Pn}`);
}
//#endregion
//#region src/interactions/selected-key.ts
function dd(e, t, n) {
	t.length !== 0 && e.getAttribute(n.attribute) !== t && (e.setAttribute(n.attribute, t), n.apply(e), e.hasAttribute(n.bindingAttribute) && e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function fd(e, t, n) {
	return e.length === 0 ? null : e.some((e) => n(e) === t) ? t : n(e[0]);
}
//#endregion
//#region src/interactions/row-selection.ts
var pd = "data-ui-bind-selected-keys", F = `.ui-items-view, .ui-table, .${cr}`, md = `.ui-items-view__item, .${ir}, .${lr}`, hd = ".ui-items-view, .ui-table", gd = {
	shift: !1,
	ctrl: !1
}, _d = /* @__PURE__ */ new WeakMap();
function vd(e, t) {
	t !== null && !_d.has(e) && yd(e, t);
}
function yd(e, t) {
	let n = L(t);
	n.length > 0 && _d.set(e, n);
}
function bd(e) {
	return {
		shift: e.shiftKey,
		ctrl: e.ctrlKey || e.metaKey
	};
}
function xd(e, t) {
	let n = bd(t);
	return n.shift && e.hasAttribute("data-ui-no-row-select") ? {
		shift: !0,
		ctrl: !0
	} : n;
}
function Sd(e) {
	return !e.hasAttribute(yr);
}
function I(e) {
	if (e.getClientRects().length > 0) return e;
	let t = e.querySelector(`:scope > [${y}]`);
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function Cd(e) {
	switch (e.getAttribute(oi)) {
		case "one": {
			let t = e.getAttribute(ci);
			return new Set(t === null || t.length === 0 ? [] : [t]);
		}
		case "many": return new Set(Md(Nd(e)));
		default: return /* @__PURE__ */ new Set();
	}
}
function wd(e, t) {
	let n = Cd(e), r = e.getAttribute(oi), i = r === "one" || r === "many";
	for (let e of t) {
		let t = n.has(L(e));
		e.toggleAttribute(si, t);
		let r = i ? t ? "true" : "false" : null;
		e.getAttribute("aria-selected") !== r && (r === null ? e.removeAttribute("aria-selected") : e.setAttribute("aria-selected", r));
	}
}
function Td(e) {
	return e.filter((e) => e.hasAttribute(si));
}
function Ed(e, t, n, r, i) {
	let a = L(n);
	if (!kd(n)) return !1;
	switch (e.getAttribute(oi)) {
		case "one": return dd(e, a, {
			attribute: ci,
			bindingAttribute: ui,
			apply: (e) => wd(e, t)
		}), !0;
		case "many": return Dd(e, t, n, a, r, i), !0;
		default: return !1;
	}
}
function Dd(e, t, n, r, i, a) {
	let o = Nd(e);
	if (o === null) return;
	let s = Md(o), c;
	if (i.shift) {
		let o = _d.get(e), l = o === void 0 ? null : a?.(o, r) ?? null, u = t.find((e) => L(e) === o) ?? n, d = l === null ? jd(t, u, n).map(L) : Ad(l, t);
		c = i.ctrl ? [...s.filter((e) => !d.includes(e)), ...d] : d;
	} else i.ctrl ? (c = s.includes(r) ? s.filter((e) => e !== r) : [...s, r], _d.set(e, r)) : (c = [r], _d.set(e, r));
	Od(e, t, c);
}
function Od(e, t, n) {
	let r = Nd(e);
	if (r === null) return;
	let i = JSON.stringify(n);
	r.getAttribute("data-ui-selected-keys") !== i && (r.setAttribute(li, i), wd(e, t), r.hasAttribute(pd) && r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function kd(e) {
	return L(e).length > 0 && !Xc(e, "data-ui-unselectable") && !k(e);
}
function Ad(e, t) {
	let n = new Map(t.map((e) => [L(e), e]));
	return e.filter((e) => {
		let t = n.get(e);
		return t === void 0 || I(t) !== null && kd(t);
	});
}
function jd(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	return r < 0 || i < 0 ? [n] : e.slice(Math.min(r, i), Math.max(r, i) + 1).filter((e) => I(e) !== null && kd(e));
}
function Md(e) {
	return $u(e?.getAttribute("data-ui-selected-keys") ?? null);
}
function Nd(e) {
	let t = e.closest(S);
	for (let n of e.querySelectorAll(`[${x}]`)) if (n.closest(F) === e && n.closest("[data-ui-id]") === t) return n;
	return null;
}
function L(e) {
	return e.getAttribute("data-ui-key") ?? "";
}
var Pd = {
	isSelected: (e) => e.hasAttribute(si),
	toggle: Fd,
	setSelected: Id,
	setSelectedKeys: Ld
};
function Fd(e) {
	let t = e.closest(F);
	t !== null && e instanceof HTMLElement && Ed(t, Rd(t), e, {
		shift: !1,
		ctrl: !0
	});
}
function Id(e, t, n) {
	let r = [];
	for (let e of t) e.classList.contains("ui-hidden") || r.push(L(e));
	Ld(e, r, n);
}
function Ld(e, t, n) {
	if (!(e instanceof HTMLElement)) return;
	let r = Rd(e), i = new Set(r.filter((e) => !kd(e)).map(L)), a = /* @__PURE__ */ new Set();
	for (let e of t) e.length > 0 && !i.has(e) && a.add(e);
	let o = [...Cd(e)].filter((e) => !a.has(e));
	Od(e, r, n ? [...o, ...a] : o);
}
function Rd(e) {
	return ld(e, md, F);
}
//#endregion
//#region src/interactions/table-column-layout.ts
var zd = "--ui-table-order-";
function Bd(e) {
	let t = new Set((e.getAttribute("data-ui-table-hidden") ?? "").split(" ").filter((e) => e.length > 0)), n = e instanceof HTMLElement ? e.style : null;
	return {
		place: (e) => {
			let t = n?.getPropertyValue(`--ui-table-order-${e}`).trim() ?? "";
			return t.length === 0 ? e : Number(t);
		},
		isHidden: (e) => t.has(String(e))
	};
}
var Vd = "ui-table", Hd = `[${er}]:not(.${sr})`, Ud = `.${ir} > [aria-colspan]:not([${er}])`;
function Wd(e, t, n, r) {
	let i = /* @__PURE__ */ new Map();
	for (let e of t) n.has(e) || i.set(e, String(i.size + 1));
	let a = String(i.size), o = r ? ":not([aria-colindex])" : "";
	C(e, "aria-colcount", a);
	for (let t of e.querySelectorAll(`${Hd}${o}, ${Ud}${o}`)) {
		if (t.closest(`.${Vd}`) !== e) continue;
		if (!t.hasAttribute("data-ui-table-column")) {
			C(t, "aria-colindex", "1"), C(t, "aria-colspan", a);
			continue;
		}
		let n = i.get(Number(t.getAttribute(er)));
		n === void 0 ? t.removeAttribute("aria-colindex") : C(t, "aria-colindex", n);
	}
}
//#endregion
//#region src/interactions/row-cursor.ts
var Gd = ".ui-table[role='grid']", Kd = "gridcell", qd = "aria-colspan", Jd = /* @__PURE__ */ new WeakMap();
function Yd(e) {
	let t = e.closest(F);
	if (t === null) return null;
	if (e === t) return {
		root: t,
		row: null
	};
	let n = e.closest(md);
	return n !== null && n.closest(F) === t ? {
		root: t,
		row: n
	} : null;
}
function Xd(e) {
	return e.target instanceof Element && !Ou(e) ? Zd(e.target) : null;
}
function Zd(e) {
	let t = Yd(e);
	if (t === null || t.row !== null && Bu(e, t.row) !== null) return null;
	let n = e.closest(`[${Oi}]`);
	return n !== null && n !== t.root && t.root.contains(n) ? null : t;
}
function Qd(e) {
	return e.filter($d);
}
function $d(e) {
	return I(e) !== null && !k(e);
}
function ef(e) {
	return tf(e) ?? Qd(e)[0] ?? null;
}
function tf(e) {
	return e.find((e) => e.hasAttribute("data-ui-row-focus")) ?? e.find((e) => e.hasAttribute("data-ui-selected") && !k(e)) ?? null;
}
function nf(e) {
	return tf(Rd(e));
}
function rf(e, t) {
	if (e.hasAttribute("data-ui-row-cursor-waits") || t.some((e) => e.hasAttribute("data-ui-row-focus"))) return;
	let n = ef(t);
	n !== null && of(e, t, n);
}
function af(e, t) {
	t === null ? e.removeAttribute("aria-labelledby") : e.setAttribute("aria-labelledby", Zi(t, "ui-row-name"));
}
function of(e, t, n, r = null, i = !0) {
	for (let e of t) e !== n && e.hasAttribute("data-ui-row-focus") && e.removeAttribute(Ne);
	n.hasAttribute("data-ui-row-focus") || n.setAttribute(Ne, ""), e.removeAttribute(Pe);
	let a = sf(e, n, r);
	i && ((I(n) ?? n).scrollIntoView({ block: "nearest" }), a !== null && pf(e, n, a));
}
function sf(e, t, n) {
	let r = cf(e) ? lf(e, t, n) : null;
	for (let t of e.querySelectorAll(`[${Ie}]`)) t !== r && t.closest(F) === e && t.removeAttribute(Ie);
	if (r === null) return e.setAttribute("aria-activedescendant", Zi(t, "ui-row")), null;
	r.hasAttribute("data-ui-cell-focus") || r.setAttribute(Ie, "");
	let i = r.getAttribute(er);
	return i !== null && Jd.set(e, i), e.setAttribute("aria-activedescendant", Zi(r, "ui-cell")), r;
}
function cf(e) {
	return e.matches(Gd);
}
function lf(e, t, n) {
	if (n instanceof HTMLElement && n.parentElement === t && n.getAttribute("role") === Kd) {
		if (!n.hasAttribute("data-ui-owns-keys")) return n;
		let e = uf(t, n.getAttribute(er));
		if (e !== null) return e;
	}
	let r = df(e, t), i = Jd.get(e);
	if (i === void 0) return r[0] ?? null;
	let a = r.find((e) => e.getAttribute(er) === i);
	if (a !== void 0) return a;
	let o = Bd(e), s = o.place(Number(i)), c = (e) => Math.abs(o.place(Number(e.getAttribute(er))) - s);
	return r.reduce((e, t) => e === null || c(t) < c(e) ? t : e, null);
}
function uf(e, t) {
	for (let n of e.children) if (t !== null && n instanceof HTMLElement && n.getAttribute("data-ui-table-column") === t && ff(n)) return n;
	return null;
}
function df(e, t) {
	let n = Bd(e), r = [];
	for (let e of t.children) {
		let t = Number(e.getAttribute("data-ui-table-column") ?? NaN);
		e instanceof HTMLElement && Number.isInteger(t) && ff(e) && !n.isHidden(t) && r.push({
			cell: e,
			place: n.place(t)
		});
	}
	return r.sort((e, t) => e.place - t.place).map((e) => e.cell);
}
function ff(e) {
	return e.getAttribute("role") === Kd && !e.hasAttribute("data-ui-owns-keys");
}
function pf(e, t, n) {
	let r = e.querySelector(`:scope > .${ar}`);
	if (r === null || !(r.scrollWidth > r.clientWidth) || !n.hasAttribute("data-ui-table-column")) return;
	let i = r.getBoundingClientRect(), a = i.left + i.width / 2, o = i.left + r.clientLeft, s = o + r.clientWidth;
	for (let e of t.children) {
		if (e === n || !(e instanceof HTMLElement) || getComputedStyle(e).position !== "sticky") continue;
		let t = e.getBoundingClientRect();
		t.left + t.width / 2 < a ? o = Math.max(o, t.right) : s = Math.min(s, t.left);
	}
	let c = n.getBoundingClientRect();
	r.scrollLeft += mf(c.left, c.right, o, s);
}
function mf(e, t, n, r) {
	return e < n ? e - n : t > r ? Math.min(t - r, e - n) : 0;
}
function hf(e) {
	for (let t of e.children) if (t instanceof HTMLElement && t.hasAttribute("data-ui-cell-focus")) return t;
	return null;
}
function gf(e) {
	return Jd.get(e) ?? null;
}
function _f(e, t, n, r) {
	if (n !== null && bf(n)) return null;
	let i = df(e, t), a = n?.getAttribute("data-ui-table-column") ?? null, o = i.findIndex((e) => e.getAttribute(er) === a);
	switch (r) {
		case "Home": return i[0] ?? null;
		case "End": return i[i.length - 1] ?? null;
		case "ArrowLeft": return o > 0 ? i[o - 1] : null;
		case "ArrowRight": return o < 0 ? i[0] ?? null : i[o + 1] ?? null;
		default: return null;
	}
}
function vf(e, t, n, r) {
	let i = yf(t), a = (n === null ? -1 : i.indexOf(n)) + (r ? 1 : -1);
	return i.length === 0 || a < -1 || a >= i.length ? null : a === -1 ? lf(e, t, null) : i[a];
}
function yf(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && bf(e));
}
function bf(e) {
	return ff(e) && e.hasAttribute(qd) && !e.hasAttribute("data-ui-table-column");
}
function xf(e) {
	let t = yf(e);
	return t[t.length - 1] ?? null;
}
function Sf(e, t) {
	let n = t;
	for (; n !== null && n.parentElement !== e;) n = n.parentElement;
	return n?.getAttribute("role") === Kd ? n : null;
}
function Cf(e, t = null) {
	let n = e.closest(F);
	n !== null && e instanceof HTMLElement && of(n, Rd(n), e, t);
}
function wf(e, t) {
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
function Tf(e, t) {
	return Hu(e, t === "grid" ? "both" : t) || t !== "horizontal" && Ef(e);
}
function Ef(e) {
	return e === "PageDown" || e === "PageUp";
}
function Df(e, t, n, r) {
	if (!Tf(e, r)) return null;
	let i = Qd(t);
	if (Ef(e)) return Of(i, n, e === "PageDown");
	if (r === "grid" && (e === "ArrowUp" || e === "ArrowDown")) return kf(i, n, e === "ArrowDown");
	let a = i.map((e) => I(e) ?? e), o = Vu({
		key: e,
		items: a,
		current: n === null ? null : I(n),
		axis: r === "grid" ? "horizontal" : r,
		loop: !1
	});
	return o === null ? null : i[a.indexOf(o)] ?? null;
}
function Of(e, t, n) {
	let r = t === null ? -1 : e.indexOf(t), i = r < 0 ? null : e[r].parentElement;
	if (i === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let a = (I(e[r]) ?? e[r]).getBoundingClientRect(), o = Math.min(Yu(i).height, window.innerHeight), s = n ? 1 : -1, c = null;
	for (let t = r + s; t >= 0 && t < e.length; t += s) {
		let r = (I(e[t]) ?? e[t]).getBoundingClientRect();
		if (c !== null && (n ? r.bottom > a.top + o + .5 : r.top < a.bottom - o - .5)) break;
		c = e[t];
	}
	return c;
}
function kf(e, t, n) {
	let r = t === null ? null : I(t);
	if (r === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let i = r.getBoundingClientRect(), a = Af(i), o = e.map((e) => ({
		row: e,
		rect: (I(e) ?? e).getBoundingClientRect()
	})).filter(({ rect: e }) => n ? e.top >= i.bottom - .5 : e.bottom <= i.top + .5);
	if (o.length === 0) return null;
	let s = o.reduce((e, t) => (n ? t.rect.top < e.rect.top : t.rect.bottom > e.rect.bottom) ? t : e);
	return o.filter(({ rect: e }) => n ? e.top < s.rect.bottom - .5 : e.bottom > s.rect.top + .5).reduce((e, t) => Math.abs(Af(t.rect) - a) < Math.abs(Af(e.rect) - a) ? t : e).row;
}
function Af(e) {
	return e.left + e.width / 2;
}
var jf = "ui-row-press";
function Mf(e, t, n) {
	(e.hasAttribute("data-ui-id") ? e : e.querySelector(":scope > [data-ui-id]") ?? e).dispatchEvent(n === void 0 ? new Event(t, { bubbles: !0 }) : new CustomEvent(t, {
		bubbles: !0,
		detail: n
	}));
}
function Nf(e, t, n) {
	let r = null, i = !1;
	for (let e of n) e instanceof HTMLElement && e.hasAttribute("data-ui-row-focus") && (r = e), i ||= e.contains(document.activeElement);
	if (r === null && !i) return null;
	let a = [], o = -1;
	if (r !== null) for (let e of t) e === r && (o = a.length), e instanceof HTMLElement && !n.has(e) && a.push(e);
	let s = r !== null && Pf(r);
	return () => {
		i && e.focus({ preventScroll: !0 });
		let t = Ff(a, o);
		t === null ? r !== null && e.removeAttribute("aria-activedescendant") : of(e, a, t, null, s);
	};
}
function Pf(e) {
	let t = I(e), n = e.parentElement;
	if (t === null || n === null) return !1;
	let r = t.getBoundingClientRect(), i = qu(n).getBoundingClientRect();
	return r.bottom > Math.max(i.top, 0) && r.top < Math.min(i.bottom, window.innerHeight) && r.right > Math.max(i.left, 0) && r.left < Math.min(i.right, window.innerWidth);
}
function Ff(e, t) {
	if (t < 0) return null;
	for (let n = t; n < e.length; n++) if ($d(e[n])) return e[n];
	for (let n = Math.min(t, e.length) - 1; n >= 0; n--) if ($d(e[n])) return e[n];
	return null;
}
function If(e, t) {
	let n = t.find((e) => e.hasAttribute(Ne));
	if (n === void 0 || I(n) !== null) return;
	let r = Ff(t, t.indexOf(n));
	r === null ? (n.removeAttribute(Ne), hf(n)?.removeAttribute(Ie), e.removeAttribute("aria-activedescendant")) : of(e, t, r, null, !1);
}
function Lf(e) {
	let t = e.parentElement, n = t?.closest(F) ?? null;
	return n !== null && (n === t || n === t?.parentElement) ? n : t;
}
function Rf(e) {
	let t = e.hasAttribute(Ne), n = e.contains(document.activeElement);
	return t || n ? {
		cursor: t,
		focus: n,
		key: e.getAttribute(b)
	} : null;
}
function zf(e, t, n) {
	let r = Lf(e);
	n !== null && r !== null && (n.focus && !r.contains(document.activeElement) && r.focus({ preventScroll: !0 }), n.cursor && (t === null ? (typeof n.key == "string" && r.setAttribute(Pe, n.key), r.removeAttribute("aria-activedescendant")) : [...e.children].some((e) => e !== t && e.hasAttribute("data-ui-row-focus")) || Hf(r, t)));
}
function Bf(e, t) {
	let n = Lf(e), r = n?.getAttribute("data-ui-row-cursor-waits") ?? null;
	n !== null && r !== null && r === t.getAttribute("data-ui-key") && (n.removeAttribute(Pe), [...e.children].some((e) => e !== t && e.hasAttribute("data-ui-row-focus")) || Hf(n, t));
}
function Vf(e) {
	return e.getAttribute(Pe);
}
function Hf(e, t) {
	t.setAttribute(Ne, ""), sf(e, t, null);
}
//#endregion
//#region src/interactions/popup-focus.ts
var Uf = "data-ui-active", Wf = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(","), Gf = /* @__PURE__ */ new Set([
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
]), Kf = /* @__PURE__ */ new Set([
	"ArrowDown",
	"ArrowUp",
	"PageDown",
	"PageUp"
]), qf = !1, Jf = !1, Yf = null, Xf = /* @__PURE__ */ new Set(), Zf = [], Qf = /* @__PURE__ */ new WeakSet();
typeof window < "u" && (window.addEventListener("pointerdown", (e) => $f(e.target, e.pointerType), !0), window.addEventListener("keydown", (e) => ep(e), !0), window.addEventListener("focus", (e) => rp(e.target), !0), window.addEventListener("focusin", (e) => rp(e.target), !0), window.addEventListener("focusout", (e) => ip(e), !0), window.addEventListener("keydown", (e) => np(e)));
function $f(e, t = "") {
	qf = !0, Jf = t === "touch";
	let n = document.activeElement;
	Yf = n, n instanceof Element && n !== document.body && e instanceof Node && n.contains(e) && lp(n, !ap(n)), up(n);
}
function ep(e) {
	if (!(e instanceof KeyboardEvent && (Gf.has(e.key) || qf && tp(e)))) {
		qf = !1;
		for (let e of [...Xf]) lp(e, !1);
		up(document.activeElement);
	}
}
function tp(e) {
	return !ap(e.target) || e.key === "Tab" || e.altKey || e.ctrlKey || e.metaKey ? !1 : !(Kf.has(e.key) && e.target instanceof Element && e.target.getAttribute("role") === "combobox");
}
function np(e) {
	if (!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || !M(e)) return;
	let t = document.activeElement;
	t instanceof Element && t !== document.body && !ap(t) && lp(t, !0);
}
function rp(e) {
	qf && !ap(e) && lp(e, !0), e === document.activeElement && up(document.activeElement);
}
function ip(e) {
	e.target instanceof Element && e.target.hasAttribute(Uf) || lp(e.target, !1), e.relatedTarget === null && queueMicrotask(() => up(document.activeElement));
}
function ap(e) {
	return Eu(e) ? !e.readOnly && !e.disabled : e instanceof HTMLElement && (e.isContentEditable || e.getAttribute("role") === "spinbutton" && e.getAttribute("aria-readonly") !== "true");
}
function op() {
	return qf && Yf instanceof HTMLElement && Yf !== document.body ? Yf : null;
}
function sp() {
	return qf;
}
function cp() {
	return qf && Jf;
}
function lp(e, t) {
	if (e instanceof Element) {
		if (t) {
			for (let e of Xf) e.isConnected || Xf.delete(e);
			Xf.add(e);
		} else Xf.delete(e);
		e.hasAttribute("data-ui-pointer-focus") !== t && e.toggleAttribute(ni, t), e === document.activeElement && up(e);
	}
}
function up(e) {
	let t = e === null || e === document.body || ap(e) ? null : e.hasAttribute("data-ui-pointer-focus") ? "pointer" : "keyboard", n = e === null || t === null ? [] : dp(e);
	for (let e of Zf) n.includes(e) || e.removeAttribute(ri);
	for (let e of n) t !== null && e.getAttribute("data-ui-focus-within") !== t && e.setAttribute(ri, t);
	Zf = n;
}
function dp(e) {
	let t = [];
	for (let n = e.parentElement; n !== null && n !== document.body && !n.hasAttribute("data-ui-region") && (t.push(n), !n.hasAttribute("data-ui-id") || fp(n)); n = n.parentElement);
	return t;
}
function fp(e) {
	return e.classList.contains("ui-menu--nested") || (e.parentElement?.closest(Mu) ?? null) !== null;
}
function R(e) {
	rp(e), pp(e);
}
function pp(e) {
	up(e), e.focus({ preventScroll: !0 }), up(document.activeElement);
}
function mp(e) {
	lp(e, !0), pp(e);
}
function hp(e) {
	for (let t of e.querySelectorAll(Wf)) if (Zc(t)) return t;
	return null;
}
var gp = {
	first: hp,
	stops: (e) => _p(e, document.activeElement),
	giveBack: (e) => Tp(e),
	trapTab: bp
};
function _p(e, t) {
	let n = [...e.querySelectorAll(Wf)].filter((e) => e === t || e.tabIndex >= 0 && Zc(e)), r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let t = vp(e);
		if (t === null) continue;
		let n = r.get(t);
		(n === void 0 || !yp(n) && yp(e)) && r.set(t, e);
	}
	return n.filter((e) => {
		let t = vp(e);
		return t === null || r.get(t) === e;
	});
}
function vp(e) {
	return e instanceof HTMLInputElement && e.type === "radio" && e.name !== "" ? e.name : null;
}
function yp(e) {
	return e instanceof HTMLInputElement && e.checked;
}
function bp(e, t) {
	let n = _p(e, document.activeElement);
	if (n.length === 0) {
		t.preventDefault();
		return;
	}
	let r = xp(e, n, document.activeElement, t.shiftKey);
	r !== null && (t.preventDefault(), r.focus());
}
function xp(e, t, n, r) {
	let i = t[0], a = t[t.length - 1];
	return n === null || !e.contains(n) ? r ? a : i : !r && Sp(n, a) ? i : r && Sp(n, i) ? a : null;
}
function Sp(e, t) {
	return e === t || vp(e) !== null && vp(e) === vp(t);
}
var Cp = `.${wi}, .${Ti}, [${Di}]`;
function wp(e) {
	let t = Yd(e)?.root ?? null;
	for (let n = e.parentElement; n !== null; n = n.parentElement) if ((n === t || n.matches(Cp)) && n.hasAttribute("tabindex") && Zc(n)) return n;
	return null;
}
function Tp(e, t = wp(e)) {
	let n = document.activeElement;
	if (t?.isConnected !== !0 || n !== null && n !== document.body) return;
	let r = Yd(e);
	r?.root === t && r.row !== null && of(t, Rd(t), r.row, Sf(r.row, e)), R(t);
}
function Ep(e, t) {
	if (e.contains(document.activeElement)) return null;
	let n = document.activeElement instanceof HTMLElement ? document.activeElement : null, r = t ?? hp(e);
	return Dp(e), (r === null || r === e) && !e.hasAttribute("tabindex") && (e.tabIndex = -1), R(r ?? e), n;
}
function Dp(e) {
	qf ? Qf.add(e) : Qf.delete(e);
}
function Op(e, t) {
	e.scrollTop = 0, e.scrollLeft = 0;
	let n = t ?? hp(e);
	return n !== null && kp(e, n), Ep(e, n);
}
function kp(e, t) {
	let n = e.getBoundingClientRect().top + e.clientTop, r = n + e.clientHeight, i = t.getBoundingClientRect();
	i.bottom > r && (e.scrollTop += Math.min(i.bottom - r, i.top - n));
}
function Ap(e, t, n = !1) {
	if (Dp(e), qf) {
		N(t, null), e.hasAttribute("tabindex") || (e.tabIndex = -1), R(e);
		return;
	}
	let r = t.filter(P), i = (n ? r[r.length - 1] : r[0]) ?? null;
	i !== null && (N(t, i), R(i));
}
function jp(e, t = null) {
	let n = e == null ? null : e.isConnected ? e : Mp(e, t);
	for (let e = n; e !== null; e = e.parentElement) if (e.matches(`${Wf}, [tabindex]`) && Zc(e)) return e;
	return n === null ? null : Np(n);
}
function Mp(e, t) {
	if (t === null) return null;
	for (let n = e.closest(S); n !== null; n = n.parentElement?.closest("[data-ui-id]") ?? null) {
		let e = t.findEveryComponent(T(n)).filter((e) => e.isConnected);
		if (e.length === 1 && e[0] instanceof HTMLElement) return e[0];
	}
	return null;
}
function Np(e) {
	for (let t = e.closest(S); t !== null; t = t.parentElement?.closest("[data-ui-id]") ?? null) if (Zc(t)) return Pp(t), t;
	return null;
}
function Pp(e) {
	if (e.hasAttribute("tabindex") || e.tabIndex >= 0) return;
	e.tabIndex = -1;
	let t = (n) => {
		n.target === e && (e.removeAttribute("tabindex"), e.removeEventListener("focusout", t));
	};
	e.addEventListener("focusout", t);
}
function Fp(e, t) {
	let n = document.activeElement;
	e != null && t.contains(n) && (Ip(n, t) && lp(e, !ap(e)), R(e));
}
function Ip(e, t) {
	for (let n = e; n !== null; n = n === t ? null : n.parentElement ?? null) if (Qf.has(n)) return !0;
	return !1;
}
//#endregion
//#region src/updates/value-binding-engine.ts
var Lp = "data-ui-clear", Rp = ["change", "toggle"], zp = [
	...Rp,
	"expand",
	"collapse",
	"open",
	"close"
];
function Bp(e) {
	let t = ra(e);
	return t === "TwoWay" || t === "OneWayToSource" || t === "OnSubmit";
}
function Vp(e) {
	return ra(e) === "OnSubmit";
}
function Hp(e, t) {
	let n = e.getAttribute(Xe);
	if (n !== null) {
		let e = t.getBindingById(Number(n));
		return {
			bindingId: n,
			binding: e,
			buffered: e !== void 0 && Vp(e.mode)
		};
	}
	for (let n of e.getAttributeNames()) {
		if (!n.startsWith("data-ui-bind-")) continue;
		let r = e.getAttribute(n) ?? "", i = t.getBindingById(Number(r));
		if (i !== void 0 && Bp(i.mode)) return {
			bindingId: r,
			binding: i,
			buffered: Vp(i.mode)
		};
	}
	return null;
}
var Up = class {
	options;
	root;
	pendingSyncByComponent = /* @__PURE__ */ new WeakMap();
	bufferedElements = /* @__PURE__ */ new Set();
	unanswered = /* @__PURE__ */ new Map();
	sends = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document;
		for (let e of Rp) this.root.addEventListener(e, (e) => {
			this.handleValueEventAsync(e).catch((e) => {
				c("value binding engine failed.", e);
			});
		}, !0);
		this.root.addEventListener("input", (e) => this.holdEdited(e), !0), this.root.addEventListener(Au, (e) => this.releaseDropped(e)), this.root.addEventListener("click", (e) => this.handleClear(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && e.target.closest(`[${Lp}]`) !== null && e.preventDefault();
		}, !0);
	}
	holdEdited(e) {
		e.target instanceof Element && !this.bufferedElements.has(e.target) && e.target.hasAttribute("data-ui-form-id") && Hp(e.target, this.options.metadata)?.buffered === !0 && this.bufferValue(e.target);
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
		let t = e.target.closest(`[${Lp}]`);
		if (t === null) return;
		let n = t.closest(S), r = n?.querySelector("[data-ui-bind-value]") ?? n?.querySelector("input, textarea, select");
		r == null || Wp(r) || (Hl(r), r.dispatchEvent(new Event("input", { bubbles: !0 })), r.dispatchEvent(new Event("change", { bubbles: !0 })), Eu(r) && document.activeElement !== r && R(r));
	}
	async handleValueEventAsync(e) {
		if (!(e.target instanceof Element) || e.type === "change" && (A(e.target) || O(e.target))) return;
		let t = Hp(e.target, this.options.metadata);
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
			let r = Hp(n, this.options.metadata);
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
		if (i === void 0 || !Bp(i.mode) || Vp(i.mode)) return;
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
function Wp(e) {
	return e.matches(":disabled") || (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.readOnly;
}
//#endregion
//#region src/events/event-boundary.ts
function Gp(e, t) {
	let n = e.closest(`[${Qe}]`);
	return n !== null && n !== t && t.contains(n);
}
//#endregion
//#region src/events/command-turns.ts
var Kp = class {
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
}, qp = class {
	catalog;
	registrations = /* @__PURE__ */ new Map();
	attachments = /* @__PURE__ */ new Map();
	constructor(e) {
		this.catalog = e;
	}
	add(e, t = {}) {
		let n = Ca(e);
		if (n.length === 0) throw Error("Event name is required.");
		let r = Ca(t.domEventName) || this.catalog.get(n)?.domEventName || n, i = {
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
		return this.registrations.get(Ca(e));
	}
	isAttached(e) {
		return this.attachments.has(Ca(e));
	}
	attach(e) {
		let t = {};
		return this.attachments.set(Ca(e), t), t;
	}
	isCurrent(e, t) {
		return this.attachments.get(e) === t;
	}
}, Jp = class {
	create(e, t) {
		return e.createRequest === void 0 ? t.metadata === void 0 ? null : {
			eventId: w(t.metadata.eventId),
			dynamicParameters: [...t.dynamicParameters]
		} : e.createRequest(t);
	}
}, Yp = "aria-busy";
function Xp(e, t) {
	let n = null, r = !1, i = !1, a = () => {
		n = null, !(!e.isConnected || e.classList.contains("ui-loading") || e.hasAttribute("data-ui-pending")) && (e.setAttribute($r, ""), r = !0, e.hasAttribute(Yp) || (e.setAttribute(Yp, "true"), i = !0));
	};
	return t <= 0 ? a() : n = setTimeout(a, t), () => {
		n !== null && (clearTimeout(n), n = null), r && (r = !1, e.removeAttribute($r), i && !e.classList.contains("ui-loading") && e.removeAttribute(Yp));
	};
}
//#endregion
//#region src/events/event-pipeline.ts
var Zp = {
	dispatched: !1,
	success: !1
}, Qp = () => void 0, $p = class extends Error {
	reason;
	constructor(e) {
		super(String(e)), this.reason = e;
	}
}, em = class {
	options;
	root;
	registry;
	requestFactory = new Jp();
	turns = new Kp();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.registry = new qp(e.eventCatalog), this.addEvent("click");
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
		if (r === null || nm(t, r.element) || Gp(t.target, r.element)) return;
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
			let t = e instanceof $p, r = t ? e.reason : e;
			throw n.completed?.({
				...a,
				dispatched: t,
				success: !1,
				error: String(r)
			}), r;
		}
	}
	async runAsync(e, t, n, r) {
		if (r.domEvent.target instanceof Element && O(r.domEvent.target)) return Zp;
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
		if (this.options.dispatcher.isPending(i)) return r.domEvent.preventDefault(), Zp;
		let a = this.startPendingMark(e, n, r), o = this.turns.take();
		try {
			return await this.sendInTurnAsync(e, t, n, r, i, o);
		} finally {
			o.done(), a();
		}
	}
	startPendingMark(e, t, n) {
		return e !== "click" || n.metadata?.showsPending === !1 ? Qp : Xp(t, this.options.isReattaching?.() === !0 ? 0 : 300);
	}
	async sendInTurnAsync(e, t, n, r, i, a) {
		let o = n.getAttribute("data-ui-submit-form-id") ?? (t.submitsForm === !0 ? rm(r) : null);
		if (o !== null) {
			if (this.options.validationEngine?.runSubmitValidation(o) === !1) return r.domEvent.preventDefault(), this.options.validationEngine.focusFirstInvalid(o), Zp;
			await this.options.valueBinding?.submitFormAsync(o);
		}
		if (await this.isRefusedValueEventAsync(t, n) || (await a.ahead, await this.options.valueBinding?.whenSent(), this.options.dispatcher.isPending(i))) return Zp;
		this.options.interactionEngine.applyEvent({
			name: `before-${e}`,
			componentId: r.componentId,
			dynamicParameters: r.dynamicParameters,
			domEvent: r.domEvent
		});
		let s = this.options.dispatcher.dispatchAsync(i);
		a.done();
		let c = await s.catch((t) => {
			throw this.applyAfterEvent(e, r), new $p(t);
		});
		return this.options.effects.applyAll(c.command?.effects, this.options.dom), this.options.afterEffects?.(), this.applyAfterEvent(e, r), o !== null && this.options.validationEngine?.focusFirstInvalid(o), {
			dispatched: !0,
			success: c.command?.success !== !1,
			error: c.command?.error ?? null
		};
	}
	async isRefusedValueEventAsync(e, t) {
		return !zp.includes(e.name) && e.settlesValue !== !0 ? !1 : (await this.options.valueBinding?.whenSettled(t), this.options.validationEngine?.isRefused(t) === !0);
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
		tm(e.preventDefault, t) && t.domEvent.preventDefault(), tm(e.stopPropagation, t) && t.domEvent.stopPropagation();
	}
};
function tm(e, t) {
	return e === void 0 ? !1 : typeof e == "function" ? e(t) : e;
}
function nm(e, t) {
	if (e.type !== "mouseenter" && e.type !== "mouseleave") return !1;
	let n = e.relatedTarget;
	return n instanceof Node && t.contains(n);
}
function rm(e) {
	let t = e.domEvent.target;
	return ((t instanceof Element ? t.closest("[data-ui-form-id]") : null) ?? e.component.querySelector("[data-ui-form-id]"))?.getAttribute("data-ui-form-id") ?? null;
}
//#endregion
//#region src/state/value-equality.ts
function im(e, t) {
	return Object.is(e, t) ? !0 : e === null || t === null || e === void 0 || t === void 0 ? !1 : e instanceof Date || t instanceof Date ? e instanceof Date && t instanceof Date && e.getTime() === t.getTime() : typeof e != "object" || typeof t != "object" ? !1 : Array.isArray(e) || Array.isArray(t) ? Array.isArray(e) && Array.isArray(t) && am(e, t) : om(e, t);
}
function am(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!im(e[n], t[n])) return !1;
	return !0;
}
function om(e, t) {
	for (let n in e) if (Object.hasOwn(e, n) && (Object.hasOwn(t, n) ? !im(e[n], t[n]) : !sm(e[n]))) return !1;
	for (let n in t) if (Object.hasOwn(t, n) && !Object.hasOwn(e, n) && !sm(t[n])) return !1;
	return !0;
}
function sm(e) {
	return e == null;
}
//#endregion
//#region src/interactions/focus-handoff.ts
function cm() {
	let e = document.activeElement;
	return e === null || e === document.body ? null : e;
}
function lm(e) {
	let t = document.activeElement;
	if (!e.isConnected || t !== e && t !== document.body) return null;
	if (um(e)) return dm(e, () => lm(e)), null;
	let n = e;
	for (; n.parentElement !== null && !um(n.parentElement);) n = n.parentElement;
	let r = mm(n) ?? hm(n) ?? gm();
	return r !== null && R(r), r;
}
function um(e) {
	return e.checkVisibility({ visibilityProperty: !0 });
}
function dm(e, t) {
	if (typeof document.getAnimations != "function") return;
	let n = document.getAnimations().filter((t) => fm(t) && pm(t)?.contains(e) === !0);
	n.length > 0 && Promise.all(n.map((e) => e.finished)).then(t, () => void 0);
}
function fm(e) {
	return e.transitionProperty === "visibility";
}
function pm(e) {
	return e.effect?.target ?? null;
}
function mm(e) {
	let t = (e.closest(".ui-key-value-action__value-input, .ui-key-value-action__edit-action")?.closest(".ui-key-value-action__row") ?? null)?.querySelector(".ui-key-value-action__action")?.querySelector(Wf) ?? null;
	return t !== null && um(t) ? t : null;
}
function hm(e) {
	let t = _p(e.closest(Cp) ?? document, null).filter((t) => !e.contains(t)), n = t.find((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0), r = t.filter((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_PRECEDING) !== 0);
	return n ?? r[r.length - 1] ?? null;
}
function gm() {
	let e = document.querySelector(`[${Mn}="content"]`);
	return e === null ? null : (Pp(e), e);
}
//#endregion
//#region src/interactions/interaction-engine.ts
var _m = class {
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
		for (let e of Rp) i.addEventListener(e, (e) => this.applyEditedValue(e), !0);
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
		let n = this.options.valueReaders.readBound(e.target), r = bm(t.interactions[0].source, t.dynamicParameters);
		if (!(this.heard.has(r) && im(this.heard.get(r), n))) {
			this.heard.set(r, n);
			for (let e of t.interactions) this.applyInteraction(e, t.dynamicParameters, !0, n);
		}
	}
	resolveEdited(e) {
		let t = this.options.dom.resolveNearestComponent(e, () => !0);
		if (t === null) return null;
		let n = Hp(e, this.options.metadata), r;
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
			for (let e of t.interactions) aa(e.actionKind) === "CopyValue" && xm(e.target) && this.writeTarget(e.target, t.dynamicParameters, vm(e, n), !0);
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
		let t = this.index.getPropertyInteractions(w(e.reference.componentId), e.reference.propertyId), n = t.length > 0 ? bm(e.reference, e.dynamicParameters) : null;
		n !== null && this.heard.has(n) && this.heard.set(n, e.value);
		for (let n of t) this.applyInteraction(n, e.dynamicParameters, !1, e.value);
	}
	applyInteraction(e, t, n, r = !0) {
		let i = aa(e.actionKind);
		if (i === "Effect") {
			this.applyEffectInteraction(e, t, r);
			return;
		}
		let a = e.target;
		if (!xm(a)) return;
		let o = i === "CopyValue" ? vm(e, r) : this.evaluator.evaluate(e, r);
		this.writeTarget(a, t, o, n), n && this.options.writeBack?.(a, t, o);
	}
	writeTarget(e, t, n, r) {
		let i = cm();
		this.applyDepth++;
		try {
			this.propertyPatchEngine.applyPropertyValue(e, t, n, r);
		} finally {
			this.applyDepth--;
		}
		i !== null && lm(i);
	}
	applyEffectInteraction(e, t, n) {
		let r = e.effect;
		r == null ? s("effect interaction carries no effect.", e) : this.evaluator.matches(e, n) && this.options.effects.apply({
			effect: ym(r, t, this.options.dom),
			dom: this.options.dom,
			row: t
		});
	}
};
function vm(e, t) {
	return (t == null || typeof t == "string" && t.trim().length === 0) && e.falseValue !== void 0 ? e.falseValue : t;
}
function ym(e, t, n) {
	if (t.length === 0) return e;
	let r = e.target;
	if (r === void 0 || (r.dynamicParameters?.length ?? 0) > 0) return e;
	let i = w(r.id);
	for (let a = t.length; a >= 0; a--) {
		let o = t.slice(0, a), s = n.findComponent(i, o);
		if (s !== null && ja(s, o)) return a === 0 ? e : {
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
function bm(e, t) {
	return JSON.stringify([w(e?.componentId), e?.propertyId ?? ""]) + pa(t);
}
function xm(e) {
	return e != null && e.propertyId.length > 0;
}
//#endregion
//#region src/interactions/interaction-evaluator.ts
var Sm = class {
	evaluate(e, t) {
		return this.matches(e, t) ? e.trueValue : e.falseValue;
	}
	matches(e, t) {
		return Cm(t, e.operator, e.value);
	}
};
function Cm(e, t, n) {
	let r = wm(e), i = wm(n);
	switch (oa(t)) {
		case "Required": return r != null && r !== !1 && String(r).trim().length > 0;
		case "Equal": return String(r ?? "") === String(i ?? "");
		case "NotEqual": return String(r ?? "") !== String(i ?? "");
		case "Greater": return Tm(r, i, (e) => e > 0);
		case "GreaterOrEqual": return Tm(r, i, (e) => e >= 0);
		case "Less": return Tm(r, i, (e) => e < 0);
		case "LessOrEqual": return Tm(r, i, (e) => e <= 0);
		case "Like": return String(r ?? "").includes(String(i ?? ""));
		case "LikeIgnoreCase": return String(r ?? "").toLocaleLowerCase().includes(String(i ?? "").toLocaleLowerCase());
		case "In": return Array.isArray(i) && i.some((e) => String(e ?? "") === String(r ?? ""));
		case "Regex": return Dm(r, i);
		case "RegexEach": return Em(r, i);
		default: return !1;
	}
}
function wm(e) {
	return E(e) ? e.key : ac(e) ? e.text : e;
}
function Tm(e, t, n) {
	let r = Number(e), i = Number(t);
	return !Number.isNaN(r) && !Number.isNaN(i) ? n(r < i ? -1 : +(r > i)) : !Number.isNaN(r) || !Number.isNaN(i) || typeof e != "string" || typeof t != "string" ? !1 : n(e < t ? -1 : +(e > t));
}
function Em(e, t) {
	return e == null ? !0 : Array.isArray(e) ? e.every((e) => Dm(wm(e), t)) : Dm(e, t);
}
function Dm(e, t) {
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
var Om = "Value", km = "EndValue", Am = "Pressed", jm = class {
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
		return this.eventNames.has(Ca(e));
	}
	getSourceEventNames() {
		let e = /* @__PURE__ */ new Set();
		for (let t of this.eventNames) Pm(t) || e.add(t);
		return e;
	}
	hasEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(Ca(e))?.has(t) === !0;
	}
	getEventInteractions(e, t) {
		return this.eventInteractions.get(Fm(e, t)) ?? [];
	}
	getPropertyInteractions(e, t) {
		return this.propertyInteractions.get(Im(e, t)) ?? [];
	}
	getValueInteractions(e) {
		return this.valueInteractions.get(e) ?? [];
	}
	getEndValueInteractions(e) {
		return this.endValueInteractions.get(e) ?? [];
	}
	addInteraction(e) {
		if (Mm(e)) {
			let t = w(e.sourceEvent?.componentId), n = Ca(e.sourceEvent?.eventName);
			if (t > 0 && n.length > 0) {
				let r = this.eventInteractions.get(Fm(t, n));
				r === void 0 && (r = [], this.eventInteractions.set(Fm(t, n), r)), r.push(e), this.eventNames.add(n);
				let i = this.eventComponentIdsByName.get(n);
				i === void 0 && (i = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(n, i)), i.add(t);
			}
		} else if (Nm(e)) {
			let t = w(e.source?.componentId), n = e.source?.propertyId ?? "";
			if (t > 0 && n.length > 0) {
				let r = this.propertyInteractions.get(Im(t, n));
				r === void 0 && (r = [], this.propertyInteractions.set(Im(t, n), r)), r.push(e), aa(e.actionKind) === "CopyValue" && (this.copiesValues = !0);
				let i = this.metadata.getPropertyDefinition(n)?.propertyName, a = i === Om || i === Am ? this.valueInteractions : i === km ? this.endValueInteractions : null;
				if (a !== null) {
					let n = a.get(t) ?? [];
					n.push(e), a.set(t, n);
				}
			}
		}
	}
};
function Mm(e) {
	return ia(e.sourceKind) === "Event";
}
function Nm(e) {
	return ia(e.sourceKind) === "Property";
}
function Pm(e) {
	return e.startsWith("before-") || e.startsWith("after-");
}
function Fm(e, t) {
	return `${e}:${Ca(t)}`;
}
function Im(e, t) {
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
function Lm() {
	return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function Rm(e) {
	if (typeof e.getAnimations == "function") for (let t of e.getAnimations()) typeof CSSTransition == "function" && t instanceof CSSTransition && t.finish();
}
function zm(e, t, n) {
	let r = !1, i = () => {
		r || (r = !0, clearTimeout(a), n());
	}, a = setTimeout(i, t), o = typeof e.getAnimations == "function" ? e.getAnimations().filter((e) => typeof CSSTransition != "function" || e instanceof CSSTransition) : [];
	Promise.allSettled(o.map((e) => e.finished)).then(i);
}
//#endregion
//#region src/rendering/responsive-tier.ts
var Bm = [
	"base",
	"sm",
	"md",
	"xl",
	"xxl"
], Vm = {
	sm: 640,
	md: 768,
	xl: 1280,
	xxl: 1536
};
function Hm(e) {
	return `(min-width: ${Vm[e]}px)`;
}
var Um = Hm("sm");
function Wm(e = (e) => matchMedia(e).matches) {
	for (let t of [
		"xxl",
		"xl",
		"md",
		"sm"
	]) if (e(Hm(t))) return t;
	return "base";
}
function Gm(e, t) {
	return t === "base" ? e : `${e}-${t}`;
}
function Km(e, t) {
	if (e == null) return;
	let n = typeof e == "object" ? e : void 0;
	return n === void 0 || !("base" in n) ? t === "base" ? e : void 0 : n[t];
}
function qm(e, t) {
	return Jm(t, (t) => Km(e, t));
}
function Jm(e, t) {
	for (let n = Bm.indexOf(e); n >= 0; n--) {
		let e = t(Bm[n]);
		if (e != null) return e;
	}
}
//#endregion
//#region src/interactions/anchored-popup.ts
var Ym = /* @__PURE__ */ new Set([
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
function Xm(e) {
	return Ym.has(e);
}
var Zm = 4, Qm = 12, $m = /* @__PURE__ */ new Map(), eh = !1, th = null, nh = /* @__PURE__ */ new WeakMap(), rh = "data-ui-popup-stood-in";
function ih(e, t) {
	t === null ? nh.delete(e) : nh.set(e, t);
}
var ah = "--ui-popup-ground";
function oh(e, t) {
	let n = e.closest("[data-ui-theme]") === t.closest("[data-ui-theme]") ? getComputedStyle(e).getPropertyValue(ah).trim() : "";
	n.length === 0 ? t.style.removeProperty(ah) : t.style.setProperty(ah, n);
}
function sh(e, t, n) {
	$m.set(t, {
		anchor: e,
		options: n
	}), bh(), th?.observe(t), ph(e, t), Sh(e, t, n);
}
var ch = "data-ui-popup-lifted", lh = "data-ui-sheet";
function uh() {
	return typeof matchMedia == "function" && !matchMedia(Um).matches;
}
function dh(e) {
	return e.hasAttribute(lh);
}
function fh(e) {
	e.hasAttribute(ch) ? e.matches(":popover-open") || e.showPopover() : (e.setAttribute("popover", "manual"), e.setAttribute(ch, ""), mh(e));
}
function ph(e, t) {
	(t.hasAttribute(ch) || hh(t) || e.closest(`[${ch}]`) !== null) && fh(t);
}
function mh(e) {
	let t = getComputedStyle(e), n = t.transitionProperty.split(",").map((e) => e.trim()), r = n.indexOf("overlay");
	if (r === -1) {
		e.showPopover();
		return;
	}
	let i = t.transitionDuration.split(",").map((e) => e.trim());
	e.style.setProperty("transition-duration", n.map((e, t) => t === r ? "0s" : i[t % i.length]).join(", ")), e.showPopover(), getComputedStyle(e).getPropertyValue("overlay"), e.style.removeProperty("transition-duration");
}
function hh(e) {
	for (let t = e.parentElement; t !== null; t = t.parentElement) {
		let e = getComputedStyle(t);
		if (e.transform !== "none" || e.filter !== "none" || e.perspective !== "none" || t.hasAttribute("data-ui-surface-image-blur") && e.isolation === "isolate") return !0;
	}
	return !1;
}
var gh = z.normal * 5;
function _h(e, t) {
	e.hasAttribute(ch) && (e.matches(":popover-open") && e.hidePopover(), zm(e, gh, () => {
		e.matches(":popover-open") || $m.has(e) || (e.removeAttribute("popover"), e.removeAttribute(ch), t?.());
	}));
}
function vh(e) {
	let t = $m.get(e);
	t !== void 0 && Sh(t.anchor, e, t.options);
}
function yh(e) {
	e != null && ($m.delete(e), th?.unobserve(e), _h(e));
}
function bh() {
	eh || (eh = !0, document.addEventListener("scroll", (e) => xh(e.target), !0), window.addEventListener("resize", () => xh(null)), window.visualViewport?.addEventListener("resize", () => xh(null)), window.visualViewport?.addEventListener("scroll", () => xh(null)), th = new ResizeObserver((e) => {
		for (let t of e) {
			if (!(t.target instanceof HTMLElement)) continue;
			let e = $m.get(t.target);
			e !== void 0 && Sh(e.anchor, t.target, e.options, !0);
		}
	}));
}
function xh(e) {
	for (let [t, n] of $m) t.isConnected ? e instanceof Node && t.contains(e) || Sh(n.anchor, t, n.options) : yh(t);
}
function Sh(e, t, n, r = !1) {
	if (!e.isConnected) return;
	let i = Eh(e), a = i !== e;
	t.hasAttribute(rh) !== a && t.toggleAttribute(rh, a), n.minAnchorWidth === !0 && (t.style.minWidth = `${i.getBoundingClientRect().width}px`);
	let o = t.hasAttribute(Ch) ? {
		top: t.scrollTop,
		left: t.scrollLeft
	} : null;
	Th(t);
	let s = i.getBoundingClientRect(), c = (i === e ? n.crossAnchor ?? i : i).getBoundingClientRect(), l = i === e && n.surface !== void 0 ? n.surface.getBoundingClientRect() : s, u = n.gap ?? 4, d = t.getBoundingClientRect(), f = kh(n.boundary), p = $m.get(t), m = r ? p?.side : void 0, h = m !== void 0 && jh(l, d, m, u, f) ? m : Ah(l, d, n.placement, u, f);
	p !== void 0 && (p.side = h), jh(l, d, h, u, f) || (wh(t, h, Fh(l, h, f) - u - Zm), d = t.getBoundingClientRect(), o !== null && (t.scrollTop = o.top, t.scrollLeft = o.left));
	let g = n.alignEntries === !0 ? zh(t, h) : Rh, _ = Vh(l, c, d, h, u, g), v = Hh(l, c, d, h, u, g);
	n.arrow === !0 && (Ph(h) ? v = Dh(v, c.left + c.width / 2, d.width) : _ = Dh(_, c.top + c.height / 2, d.height));
	let ee = Wh();
	_ = ee.top + Jh(_ - ee.top, d.height, ee.bottom - ee.top), v = Jh(v, d.width, window.innerWidth), t.style.top = `${_}px`, t.style.left = `${v}px`, t.dataset.uiPlacement !== h && (t.dataset.uiPlacement = h), Oh(t, c, d, h, _, v);
}
var Ch = "data-ui-popup-capped";
function wh(e, t, n) {
	let r = Ph(t);
	e.setAttribute(Ch, ""), e.style.setProperty(r ? "max-height" : "max-width", `${Math.max(0, n)}px`), e.style.setProperty(r ? "overflow-y" : "overflow-x", "auto");
}
function Th(e) {
	if (e.hasAttribute(Ch)) {
		e.removeAttribute(Ch);
		for (let t of [
			"max-height",
			"max-width",
			"overflow-y",
			"overflow-x"
		]) e.style.removeProperty(t);
	}
}
function Eh(e) {
	for (let t = e; t !== null; t = t.parentElement) {
		if (t.hasAttribute(rh)) return e;
		let n = nh.get(t);
		if (n !== void 0) return n;
	}
	return e;
}
function Dh(e, t, n) {
	let r = t - e;
	return r < Qm ? e - (Qm - r) : r > n - Qm ? e + (r - (n - Qm)) : e;
}
function Oh(e, t, n, r, i, a) {
	let o = Ph(r), s = o ? t.left + t.width / 2 - a : t.top + t.height / 2 - i, c = o ? n.width : n.height;
	e.style.setProperty("--ui-popup-arrow", `${Math.max(Qm, Math.min(s, c - Qm))}px`);
}
function kh(e) {
	let t = Wh(), n = {
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
function Ah(e, t, n, r, i) {
	let a = Ih(n);
	if (jh(e, t, n, r, i)) return n;
	if (jh(e, t, a, r, i)) return a;
	for (let a of Mh(n)) if (jh(e, t, a, r, i)) return a;
	return Fh(e, a, i) > Fh(e, n, i) ? a : n;
}
function jh(e, t, n, r, i) {
	return Fh(e, n, i) >= Nh(t, n) + r;
}
function Mh(e) {
	return e.startsWith("bottom") ? ["right-start", "left-start"] : e.startsWith("top") ? ["right-end", "left-end"] : e.startsWith("right") ? ["bottom-start", "top-start"] : ["bottom-end", "top-end"];
}
function Nh(e, t) {
	return Ph(t) ? e.height : e.width;
}
function Ph(e) {
	return e.startsWith("top") || e.startsWith("bottom");
}
function Fh(e, t, n) {
	return t.startsWith("top") ? e.top - n.top : t.startsWith("bottom") ? n.bottom - e.bottom : t.startsWith("left") ? e.left - n.left : n.right - e.right;
}
function Ih(e) {
	return e.startsWith("top") ? `bottom${Lh(e)}` : e.startsWith("bottom") ? `top${Lh(e)}` : e.startsWith("left") ? `right${Lh(e)}` : `left${Lh(e)}`;
}
function Lh(e) {
	let t = e.indexOf("-");
	return t === -1 ? "" : e.slice(t);
}
var Rh = {
	start: 0,
	end: 0
};
function zh(e, t) {
	let n = getComputedStyle(e);
	return Ph(t) ? {
		start: Bh(n.paddingLeft) + Bh(n.borderLeftWidth),
		end: Bh(n.paddingRight) + Bh(n.borderRightWidth)
	} : {
		start: Bh(n.paddingTop) + Bh(n.borderTopWidth),
		end: Bh(n.paddingBottom) + Bh(n.borderBottomWidth)
	};
}
function Bh(e) {
	let t = Number.parseFloat(e ?? "");
	return Number.isFinite(t) ? t : 0;
}
function Vh(e, t, n, r, i, a) {
	return r.startsWith("top") ? e.top - i - n.height : r.startsWith("bottom") ? e.bottom + i : Uh(t.top, t.height, n.height, r, a);
}
function Hh(e, t, n, r, i, a) {
	return r.startsWith("left") ? e.left - i - n.width : r.startsWith("right") ? e.right + i : Uh(t.left, t.width, n.width, r, a);
}
function Uh(e, t, n, r, i) {
	let a = Lh(r);
	return a === "-start" ? e - i.start : a === "-end" ? e + t - n + i.end : e + (t - n) / 2;
}
function Wh() {
	let e = window.visualViewport, t = e == null || Math.abs(e.scale - 1) > .01, n = t ? 0 : Math.max(0, e.offsetTop), r = t ? window.innerHeight : Math.min(window.innerHeight, e.offsetTop + e.height);
	return {
		top: n,
		bottom: Math.min(r, Gh(r))
	};
}
function Gh(e) {
	let t = document.querySelector(`[${On}]`);
	if (t === null) return e;
	let n = t.getBoundingClientRect();
	return n.height > 0 && n.width >= window.innerWidth - 1 && n.top > 0 ? n.top : e;
}
function Kh(e, t, n) {
	if (dh(e)) return;
	let r = e.getBoundingClientRect(), i = Wh();
	e.style.left = `${qh(t, r.width, 0, window.innerWidth)}px`, e.style.top = `${qh(n, r.height, i.top, i.bottom)}px`;
}
function qh(e, t, n, r) {
	return e + t <= r - Zm ? e : e - t >= n + Zm ? e - t : n + Jh(e - n, t, r - n);
}
function Jh(e, t, n) {
	return Math.max(Zm, Math.min(e, n - t - Zm));
}
//#endregion
//#region src/interactions/press-wave.ts
var Yh = "ui-press-wave", Xh = "ui-press-wave__ink";
function Zh(e) {
	if (e.type !== "childList" || e.addedNodes.length + e.removedNodes.length === 0) return !1;
	for (let t of e.addedNodes) if (!Qh(t)) return !1;
	for (let t of e.removedNodes) if (!Qh(t)) return !1;
	return !0;
}
function Qh(e) {
	return e instanceof Element && e.classList.contains("ui-press-wave");
}
function $h(e) {
	return e.length > 0 && e.every(Zh);
}
function eg(e) {
	for (let t of e.querySelectorAll(`.${Yh}`)) t.remove();
}
//#endregion
//#region src/interactions/dom-mutations.ts
var tg = 32;
function B(e, t, n, r) {
	if (!(e instanceof Node)) return null;
	let i = new MutationObserver((i) => {
		let a = ng(e, i.filter((e) => !Zh(e) && (n.relevant?.(e) ?? !0)), t, n.addedOnly ?? !1);
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
function ng(e, t, n, r = !1) {
	let i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set();
	for (let o of t) {
		let t = o.target instanceof Element ? o.target : o.target.parentElement;
		if (t === null) continue;
		if (r && o.type === "childList" && t.closest(n) === null) {
			rg(o.addedNodes, n, i);
			continue;
		}
		if (a.has(t)) continue;
		a.add(t);
		let s = t.closest(n);
		if (s !== null) i.add(s);
		else {
			for (let e of t.querySelectorAll(n)) i.add(e);
			if (i.size > tg) return new Set(e.querySelectorAll(n));
		}
	}
	return i.size === 0 ? null : i;
}
function rg(e, t, n) {
	for (let r of e) if (r instanceof Element && r.isConnected) {
		r instanceof HTMLElement && r.matches(t) && n.add(r);
		for (let e of r.querySelectorAll(t)) n.add(e);
	}
}
function ig(e, t, n) {
	return (e.target instanceof Element ? e.target : e.target.parentElement)?.closest(`${t}, ${n}`)?.matches(t) === !0;
}
//#endregion
//#region src/interactions/open-dialogs.ts
var ag = "data-ui-dialog", og = "data-ui-dialog-modal", sg = "data-ui-dialog-backdrop", cg = "data-ui-dialog-close-backdrop", lg = "data-ui-dialog-close-escape", ug = `[${ag}]:not([hidden]), dialog[open]`, dg = "dialog:modal";
function fg(e) {
	let t = e.querySelectorAll(`[${ag}]:not([hidden])`);
	return t.length === 0 ? null : t[t.length - 1];
}
function pg(e) {
	let t = e.querySelectorAll(dg);
	if (t.length > 0) return t[t.length - 1];
	let n = fg(e);
	return n !== null && n.hasAttribute("data-ui-dialog-modal") ? n : null;
}
function mg(e) {
	let t = typeof document > "u" ? null : pg(document);
	return t !== null && !t.contains(e);
}
//#endregion
//#region src/interactions/popup-dismissal.ts
var hg = /* @__PURE__ */ new Set(), gg = null;
function _g(e) {
	gg = e;
}
function vg(e) {
	let t = e.composedPath(), n = gg?.(t) ?? null;
	if (n === null) return t;
	let r = [...t];
	for (let e = n; e !== null; e = e.parentElement) r.push(e);
	return r;
}
var yg = /* @__PURE__ */ new Map(), bg = 0, xg = !1;
function Sg() {
	xg || (xg = !0, document.addEventListener("keydown", (e) => {
		!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || j(e) || Tg(vu(e.target)) && e.preventDefault();
	}, !0));
}
function Cg() {
	for (let e of hg) for (let t of e.openPopups()) if (t.isConnected && !e.isBehind(t)) return !0;
	return !1;
}
function wg(e) {
	for (let t of hg) t.hearRefusedClick(e);
}
function Tg(e) {
	let t = [];
	for (let e of hg) for (let n of e.openPopups()) n.isConnected && t.push({
		instance: e,
		popup: n
	});
	let n = new Set(t.map((e) => e.popup));
	for (let e of [...yg.keys()]) n.has(e) || yg.delete(e);
	for (let { popup: e } of t) yg.has(e) || yg.set(e, ++bg);
	let r = Eg(t, (e) => yg.get(e.popup) ?? 0, (e, t) => e.popup.contains(t.popup));
	for (let { instance: t, popup: n } of r) if ((e === null || e.contains(n)) && t.dismiss(n, "escape")) return !0;
	return !1;
}
function Eg(e, t, n) {
	let r = [...e].sort((e, n) => t(n) - t(e)), i = [];
	for (; r.length > 0;) {
		let e = r.findIndex((e) => !r.some((t) => t !== e && n(e, t)));
		i.push(...r.splice(e, 1));
	}
	return i;
}
var Dg = class {
	options;
	pressedInside = /* @__PURE__ */ new Set();
	constructor(e) {
		this.options = e, document.addEventListener("pointerdown", (e) => this.handlePress(e), !0), document.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), e.onPress !== !0 && document.addEventListener("click", (e) => this.handleClick(e), !0), e.onWindowBlur === !0 && window.addEventListener("blur", () => this.dismissAll("blur")), hg.add(this), Sg();
	}
	openPopups() {
		return [...this.options.openPopups()];
	}
	handlePress(e) {
		let t = vg(e), n = this.options.onPress === !0 || e instanceof MouseEvent && e.button !== 0;
		this.pressedInside.clear();
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) ? this.pressedInside.add(e) : n && this.dismiss(e, "outside");
	}
	handleContextMenu(e) {
		let t = vg(e);
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) || this.dismiss(e, "outside");
	}
	hearRefusedClick(e) {
		this.options.onPress !== !0 && this.handleClick(e);
	}
	handleClick(e) {
		let t = vg(e);
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) || this.pressedInside.has(e) || this.dismiss(e, "outside");
		this.pressedInside.clear();
	}
	dismissAll(e) {
		let t = !1;
		for (let n of [...this.options.openPopups()]) t = this.dismiss(n, e) || t;
		return t;
	}
	isBehind(e) {
		return this.options.isBehind === void 0 ? mg(e) : this.options.isBehind(e);
	}
	dismiss(e, t) {
		return this.isBehind(e) || this.options.canDismiss?.(e, t) === !1 ? !1 : (this.options.close(e, t), !0);
	}
	isInside(e, t) {
		return this.options.isInside === void 0 ? t.includes(e) : this.options.isInside(e, t);
	}
}, Og = /\p{M}/gu, kg = ".ui-text__title";
function Ag(e, t) {
	return jg(e, t).split(/\s+/).filter((e) => e.length !== 0);
}
function jg(e, t) {
	return Pg(e, Ng(t));
}
function Mg(e, t) {
	return t.every((t) => e.includes(t));
}
function Ng(e) {
	return e.closest("[lang]")?.getAttribute("lang") || void 0;
}
function Pg(e, t) {
	let n = e.normalize("NFD").replace(Og, "");
	try {
		return n.toLocaleLowerCase(t);
	} catch {
		return n.toLowerCase();
	}
}
function Fg(e) {
	return e.querySelector(kg)?.textContent ?? e.textContent ?? "";
}
//#endregion
//#region src/interactions/pointer-drag.ts
var Ig = class {
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
			e.pointerId === t.pointerId ? t.point = n : t.second.point = n, this.options.pinch?.(t.context, Lg(r, i, t.point, t.second.point));
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
		if (!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || j(e) || this.drag === null) return;
		e.preventDefault();
		let { handle: t, context: n, pointerId: r, originPoint: i, second: a } = this.drag;
		this.drag = null, t.removeAttribute(Yr);
		for (let e of a === null ? [r] : [r, a.pointerId]) try {
			t.releasePointerCapture(e);
		} catch {}
		this.options.cancel === void 0 ? (this.options.move(n, 0, i), this.options.end(t, n)) : this.options.cancel(t, n);
	}
};
function Lg(e, t, n, r) {
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
function Rg() {
	let e = (e) => {
		e.preventDefault(), e.stopImmediatePropagation(), t();
	}, t = () => {
		window.removeEventListener("click", e, !0), window.removeEventListener("pointerdown", t, !0), window.removeEventListener("keydown", t, !0);
	};
	window.addEventListener("click", e, !0), window.addEventListener("pointerdown", t, !0), window.addEventListener("keydown", t, !0);
}
function zg(e, t) {
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
		Rg();
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
var Bg = "data-ui-sheet-dragging", Vg = "--ui-sheet-drag", Hg = 24, Ug = 1 / 3;
function Wg(e, t, n) {
	return e > t * Ug || n > .5 && e > 6;
}
function Gg(e, t, n) {
	e.style.removeProperty(Vg), e.removeAttribute(Bg);
	let r = zg(e, {
		axis: "y",
		oneWay: !0,
		holdsTouch: !0,
		begins: (n) => t.scrollTop <= 0 && (n.pointerType === "touch" || n.clientY - e.getBoundingClientRect().top <= Hg),
		start: (t) => {
			e.setAttribute(Bg, ""), Kg(e, t.pointerId);
		},
		follow: (t) => e.style.setProperty(Vg, `${t}px`),
		end: (t, r, i) => {
			e.removeAttribute(Bg), i && Wg(t, e.getBoundingClientRect().height, r) ? n() : e.style.setProperty(Vg, "0px");
		}
	});
	return () => {
		r(), e.removeAttribute(Bg);
	};
}
function Kg(e, t) {
	try {
		e.setPointerCapture(t);
	} catch {}
}
//#endregion
//#region src/interactions/popup-sheet.ts
var qg = "data-ui-sheet-covered", Jg = "ui-sheet-scrim", Yg = "data-ui-sheet-scrim-leaving", Xg = 400, Zg = "ui-sheet__back", Qg = "ui.sheet.back", $g = "ne-arrow-back", e_ = [], t_ = null, n_ = !1, r_ = !1;
function i_(e, t) {
	if (a_(e) !== null) return;
	let n = t.anchor?.closest("[data-ui-sheet]") ?? null, r = n === null ? null : a_(n);
	e.style.removeProperty("top"), e.style.removeProperty("left"), e.style.removeProperty("min-width");
	let i = dh(e);
	e.setAttribute(lh, r === null ? "root" : "nested"), i || (e.setAttribute("popover", "manual"), Rm(e));
	let a = null;
	e.querySelector(`:scope > .${Zg}`)?.remove(), r !== null && (e.style.minHeight = `${r.popup.getBoundingClientRect().height}px`, r.popup.setAttribute(qg, ""), a = o_(t), e.prepend(a)), c_(), fh(e);
	let o = {
		popup: e,
		parent: r,
		opening: t,
		back: a,
		hidden: [],
		detachSwipe: Gg(e, e, () => l_(e))
	};
	e_.push(o), u_(), queueMicrotask(() => f_(o));
}
function a_(e) {
	return e_.find((t) => t.popup === e) ?? null;
}
function o_(e) {
	let t = document.createElement("button"), n = e.anchor === void 0 ? "" : Fg(e.anchor).trim();
	return t.type = "button", t.className = Zg, t.tabIndex = -1, t.textContent = n, t.prepend(s_()), D.write(t, "aria-label", Qg, { entry: n }), t.addEventListener("click", (t) => {
		t.stopPropagation(), e.close();
	}), t;
}
function s_() {
	let e = document.createElement("span");
	return e.className = "ui-sheet__back-mark", e.setAttribute("aria-hidden", "true"), go(e, $g), e;
}
function c_() {
	t_ === null && (t_ = document.createElement("div"), t_.className = Jg, t_.setAttribute("aria-hidden", "true"), t_.addEventListener("mousedown", (e) => e.preventDefault())), t_.parentElement === null && document.body.appendChild(t_), t_.removeAttribute(Yg), fh(t_);
}
function l_(e) {
	for (let t = a_(e); t !== null; t = t.parent) t.opening.close();
}
function u_() {
	n_ || (n_ = !0, window.addEventListener("pointerdown", () => {
		r_ = !0;
	}, !0), window.addEventListener("pointerup", d_, !0), window.addEventListener("pointercancel", d_, !0), window.addEventListener("keydown", (e) => {
		let t = e_.at(-1);
		e.key === "Tab" && !e.defaultPrevented && t !== void 0 && t.opening.trapsTab && e.target instanceof Node && t.popup.contains(e.target) && bp(t.popup, e);
	}, !0), matchMedia(Um).addEventListener("change", () => {
		for (let e of e_.filter((e) => e.parent === null)) e.opening.close();
	}));
}
function d_() {
	if (r_ = !1, t_?.hasAttribute(Yg) !== !0) return;
	let e = () => {
		t_?.hasAttribute(Yg) === !0 && e_.length === 0 && (t_.removeAttribute(Yg), t_.hidePopover());
	};
	window.addEventListener("click", () => window.setTimeout(e), { once: !0 }), window.setTimeout(e, Xg);
}
function f_(e) {
	if (!e_.includes(e)) return;
	let { popup: t } = e;
	t.contains(document.activeElement) || (t.hasAttribute("tabindex") || (t.tabIndex = -1), R(t)), e.hidden = p_(t);
}
function p_(e) {
	let t = [];
	for (let n = e; n.parentElement !== null && n !== document.body; n = n.parentElement) for (let e of n.parentElement.children) e !== n && e !== t_ && e instanceof HTMLElement && e.getAttribute("aria-hidden") !== "true" && (e.setAttribute("aria-hidden", "true"), t.push(e));
	return t;
}
function m_(e) {
	let t = a_(e);
	if (t !== null) {
		for (let e of [...e_].reverse()) if (e === t || h_(e, t)) {
			for (let t of e.hidden) t.removeAttribute("aria-hidden");
			e.hidden = [];
		}
	}
}
function h_(e, t) {
	for (let n = e.parent; n !== null; n = n.parent) if (n === t) return !0;
	return !1;
}
function g_(e) {
	let t = a_(e);
	if (t !== null) {
		for (let e of e_.filter((e) => e.parent === t)) e.opening.close(), g_(e.popup);
		m_(e), e_.splice(e_.indexOf(t), 1), t.detachSwipe(), t.parent?.popup.removeAttribute(qg), e_.length === 0 && __(), _h(e, () => {
			a_(e) === null && (e.removeAttribute(lh), e.removeAttribute(qg), e.style.removeProperty("min-height"), e.style.removeProperty("--ui-sheet-drag"), t.back?.remove());
		});
	}
}
function __() {
	t_?.matches(":popover-open") === !0 && (r_ ? t_.setAttribute(Yg, "") : t_.hidePopover());
}
//#endregion
//#region src/interactions/owned-popup.ts
function v_(e, t) {
	return e.isConnected && !O(e) && !(t && A(e));
}
var y_ = class {
	options;
	entries = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, new Dg({
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
			isBehind: (e) => mg(this.entryOf(e)?.opening.owner ?? e),
			onPress: e.onPress,
			onWindowBlur: e.onWindowBlur
		}), (e.closesOnFocusLeave ?? !0) && document.addEventListener("focusout", (e) => this.handleFocusLeave(e), !0), e.closesOnTab !== void 0 && e.closesOnTab !== !1 && x_(this);
	}
	listsAround(e) {
		return [...this.entries.values()].filter(({ opening: t }) => t.popup.contains(e) && D_(this.options.closesOnTab, t)).map(({ opening: e }) => ({
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
		if (!(e.target instanceof Node) || sp() || t instanceof Element && t.hasAttribute("data-ui-pointer-focus")) return;
		if (t instanceof Element) {
			this.leaveFocus(e.target, t);
			return;
		}
		let n = e.target;
		C_(n) && queueMicrotask(() => this.letGo(n));
	}
	leaveFocus(e, t) {
		for (let { opening: n } of [...this.entries.values()]) (n.popup.contains(e) || n.owner.contains(e)) && !this.isInside(n, E_(t)) && !mg(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
	}
	letGo(e) {
		if (!C_(e)) return;
		let t = wp(e);
		for (let { opening: n } of [...this.entries.values()]) {
			let r = n.popup.contains(e) || n.owner.contains(e), i = t !== null && n.popup.contains(t) || n.popup.contains(document.activeElement);
			r && !i && v_(n.owner, this.closesWhenReadOnly) && !mg(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
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
		if (this.close(e.owner), !v_(e.owner, this.closesWhenReadOnly)) return !1;
		(this.options.single ?? !0) && this.closeAll();
		let t = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		return this.entries.set(e.owner, {
			opening: e,
			returnFocus: t
		}), this.options.show(e), this.place(e), O_(e, !0), R_(this), N_(e), e.focus !== void 0 && e.focus !== !1 && Ep(e.popup, e.focus === !0 ? null : e.focus), !0;
	}
	get closesWhenReadOnly() {
		return this.options.closesWhenReadOnly ?? !0;
	}
	closeAll() {
		for (let e of [...this.entries.keys()]) this.close(e);
	}
	place(e) {
		dh(e.popup) || D_(this.options.sheetOnPhone, e) && uh() ? i_(e.popup, {
			anchor: e.anchor,
			close: () => this.close(e.owner, "escape"),
			trapsTab: !D_(this.options.closesOnTab, e)
		}) : e.anchor !== void 0 && e.placement !== void 0 && sh(e.anchor, e.popup, e.placement);
	}
	reposition(e) {
		let t = this.entries.get(e);
		t !== void 0 && this.place(t.opening);
	}
	close(e = this.current, t) {
		let n = e === null ? void 0 : this.entries.get(e);
		if (e === null || n === void 0) return;
		let { opening: r } = n;
		this.entries.delete(e), P_(r.popup), m_(r.popup), r.popup.contains(document.activeElement) && Fp(r.returnFocus === void 0 ? n.returnFocus : r.returnFocus(), r.popup), this.options.hide(r, t), O_(r, !1), dh(r.popup) ? g_(r.popup) : yh(r.popup), this.entries.size === 0 && z_(this);
	}
	closeStranded() {
		for (let [e, { opening: t }] of [...this.entries]) {
			if (v_(e, this.closesWhenReadOnly)) continue;
			let n = document.activeElement, r = n === null || n === document.body || t.popup.contains(n) || e.contains(n);
			this.close(e, "owner"), r && e.isConnected && !w_() && T_(e);
		}
	}
}, b_ = /* @__PURE__ */ new Set();
function x_(e) {
	b_.size === 0 && window.addEventListener("keydown", (e) => {
		e instanceof KeyboardEvent && e.key === "Tab" && !e.defaultPrevented && !j(e) && e.target instanceof Node && S_(e.target);
	}, !0), b_.add(e);
}
function S_(e) {
	let t = [...b_].flatMap((t) => t.listsAround(e).map((e) => ({
		popups: t,
		...e
	})));
	for (let { popups: e, owner: n } of Eg(t, () => 0, (e, t) => e.popup.contains(t.popup))) e.close(n, "focus");
}
function C_(e) {
	return e instanceof Element && e.isConnected && Zc(e) && typeof document.hasFocus == "function" && document.hasFocus();
}
function w_() {
	let e = document.activeElement;
	return e instanceof Element && e !== document.body && Zc(e);
}
function T_(e) {
	Pp(e), R(e);
}
function E_(e) {
	let t = [];
	for (let n = e; n !== null; n = n.parentNode) t.push(n);
	return t;
}
function D_(e, t) {
	return e === !0 || typeof e == "function" && e(t);
}
function O_(e, t) {
	for (let n of e.openers ?? []) n.setAttribute("aria-expanded", t ? "true" : "false");
}
var k_ = /* @__PURE__ */ new Map(), A_ = /* @__PURE__ */ new Set(), j_ = /* @__PURE__ */ new WeakSet(), M_ = [];
function N_(e) {
	let { popup: t } = e;
	k_.set(t, e.owner), !j_.has(t) && (j_.add(t), t.addEventListener("pointerenter", () => {
		k_.has(t) && (A_.add(t), F_());
	}), t.addEventListener("pointerleave", () => {
		A_.delete(t) && F_();
	}));
}
function P_(e) {
	k_.delete(e), A_.delete(e) && F_();
}
function F_() {
	let e = /* @__PURE__ */ new Set();
	for (let t of A_) {
		let n = k_.get(t);
		if (n !== void 0 && n.contains(t)) for (let r = t.parentElement; r !== null && (e.add(r), r !== n); r = r.parentElement);
	}
	for (let t of M_) e.has(t) || t.removeAttribute(ii);
	for (let t of e) t.hasAttribute("data-ui-popup-hover") || t.setAttribute(ii, "");
	M_ = [...e];
}
var I_ = /* @__PURE__ */ new Set(), L_ = null;
function R_(e) {
	I_.add(e), L_ === null && typeof MutationObserver == "function" && (L_ = new MutationObserver(() => {
		for (let e of [...I_]) e.closeStranded();
	}), L_.observe(document, {
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
function z_(e) {
	I_.delete(e), !(I_.size > 0 || L_ === null) && (L_.disconnect(), L_ = null);
}
//#endregion
//#region src/interactions/flyout-interaction-engine.ts
var B_ = "ui-flyout", V_ = "ui-flyout--open", H_ = "ui-flyout__anchor", U_ = "data-ui-flyout-no-backdrop-close", W_ = "data-ui-flyout-no-escape-close", G_ = `${B_}--`, K_ = "bottom-start", q_ = class {
	root;
	flyouts = new y_({
		show: ({ owner: e }) => e.classList.add(V_),
		hide: ({ owner: e }, t) => this.markClosed(e, t !== "owner"),
		single: !1,
		closesWhenReadOnly: !1,
		canDismiss: ({ owner: e }, t) => !e.hasAttribute(t === "escape" ? W_ : U_)
	});
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${B_}`)) this.place(e);
		B(this.root, `.${B_}`, { attributeFilter: ["class"] }, (e) => {
			for (let t of e) this.place(t);
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	place(e) {
		let t = e.querySelector(`:scope > .${Ti}`), n = e.querySelector(`:scope > .${H_}`);
		if (t === null) return;
		let r = J_(n, t);
		e.classList.contains(V_) ? this.flyouts.open({
			owner: e,
			popup: t,
			anchor: X_(n) ?? e,
			placement: { placement: Z_(e) },
			openers: r === null ? [] : [r],
			focus: !sp() || t
		}) || this.markClosed(e) : (this.flyouts.close(e), r?.setAttribute("aria-expanded", "false"));
	}
	markClosed(e, t = !0) {
		e.classList.contains(V_) && (e.classList.remove(V_), Y_(e, !1, t));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${H_}`)?.closest(`.${B_}`) ?? null;
		t !== null && (this.flyouts.isOpen(t) ? this.flyouts.close(t) : (t.classList.add(V_), this.place(t), this.flyouts.isOpen(t) && Y_(t, !0)));
	}
};
function J_(e, t) {
	if (e === null) return null;
	let n = e.querySelector(Wf) ?? e;
	return n.setAttribute("aria-haspopup", "dialog"), n.setAttribute("aria-controls", Zi(t, "ui-flyout-content")), n;
}
function Y_(e, t, n = !0) {
	e.dispatchEvent(new Event("toggle", { bubbles: !0 })), n && e.dispatchEvent(new Event(t ? "open" : "close", { bubbles: !0 }));
}
function X_(e) {
	if (e === null) return null;
	let t = e.firstElementChild;
	return t instanceof HTMLElement ? t : e;
}
function Z_(e) {
	for (let t of e.classList) {
		if (!t.startsWith(G_)) continue;
		let e = t.slice(G_.length);
		if (Xm(e)) return e;
	}
	return K_;
}
//#endregion
//#region src/interactions/drag-picture.ts
var Q_ = "ui-drag-picture", $_ = "data-ui-drag-part", ev = ["::before", "::after"], tv = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", nv = /* @__PURE__ */ new Set(/* @__PURE__ */ "src.srcset.sizes.alt.width.height.type.viewbox.preserveaspectratio.href.xlink:href.d.points.cx.cy.r.rx.ry.x.y.x1.y1.x2.y2.fill.stroke.stroke-width.transform".split(".")), rv = null, iv = null;
typeof Image == "function" && ov();
function av(e, t, n) {
	let r = n.getBoundingClientRect(), i = e.clientX - r.left, a = e.clientY - r.top, o = ov();
	iv?.(), o === null || typeof n.showPopover != "function" ? t.setDragImage(n, i, a) : (t.setDragImage(o, 0, 0), sv(n, r, i, a), setTimeout(() => {
		e.defaultPrevented && iv?.();
	}, 0));
}
function ov() {
	return rv === null && typeof Image == "function" && (rv = new Image(1, 1), rv.src = tv), rv;
}
function sv(e, t, n, r) {
	let i = document.createElement("div"), a = e.cloneNode(!0), o = [];
	i.className = Q_, i.setAttribute("popover", "manual"), i.setAttribute("aria-hidden", "true"), i.inert = !0, i.style.width = `${t.width}px`, i.style.height = `${t.height}px`, lv(e, a, o);
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
	let s = (e) => cv(i, e.clientX - n, e.clientY - r), c = (e) => {
		e.relatedTarget === null && (i.style.visibility = "hidden");
	}, l = () => {
		i.style.visibility = "";
	}, u = () => {
		document.removeEventListener("dragover", s, !0), document.removeEventListener("dragleave", c, !0), document.removeEventListener("dragenter", l, !0), document.removeEventListener("drop", u, !0), document.removeEventListener("dragend", u, !0), e.removeEventListener("dragend", u), i.remove(), iv === u && (iv = null);
	};
	document.addEventListener("dragover", s, !0), document.addEventListener("dragleave", c, !0), document.addEventListener("dragenter", l, !0), document.addEventListener("drop", u, !0), document.addEventListener("dragend", u, !0), e.addEventListener("dragend", u), iv = u, cv(i, t.left, t.top), document.body.append(i), i.showPopover();
}
function cv(e, t, n) {
	e.style.transform = `translate(${t}px, ${n}px)`;
}
function lv(e, t, n) {
	let r = t.style;
	r !== void 0 && (pv(getComputedStyle(e), (e, t) => r.setProperty(e, t)), uv(e, r, "columns"), uv(e, r, "rows"));
	for (let e of t.getAttributeNames()) e !== "style" && !nv.has(e.toLowerCase()) && t.removeAttribute(e);
	fv(e, t, n), e instanceof HTMLInputElement && t instanceof HTMLInputElement && (t.value = e.value, t.checked = e.checked);
	for (let r = e.children.length - 1; r >= 0; r--) {
		let i = e.children[r], a = t.children[r];
		i.classList.contains("ui-press-wave") ? a.remove() : lv(i, a, n);
	}
}
function uv(e, t, n) {
	t.getPropertyValue(`grid-template-${n}`).startsWith("subgrid") && t.setProperty(`grid-template-${n}`, dv(e, n).join(" "));
}
function dv(e, t) {
	let n = getComputedStyle(e), r = n.getPropertyValue(`grid-template-${t}`);
	if (!r.startsWith("subgrid")) return r.split(/\s+/).filter((e) => /^-?[\d.]+px$/.test(e));
	if (e.parentElement === null) return [];
	let i = dv(e.parentElement, t), a = t === "columns" ? "column" : "row", o = Number.parseInt(n.getPropertyValue(`grid-${a}-start`), 10), s = Number.parseInt(n.getPropertyValue(`grid-${a}-end`), 10), c = Number.isNaN(o) ? 0 : o > 0 ? o - 1 : i.length + o + 1, l = Number.isNaN(s) ? i.length : s > 0 ? s - 1 : i.length + s + 1;
	return i.slice(c, l);
}
function fv(e, t, n) {
	for (let r of ev) {
		let i = getComputedStyle(e, r);
		if (i.content === void 0 || i.content === "none" || i.content === "normal") continue;
		t.hasAttribute($_) || t.setAttribute($_, String(n.length));
		let a = [];
		pv(i, (e, t) => a.push(`${e}: ${t};`)), n.push(`.${Q_} [${$_}="${t.getAttribute($_)}"]${r} { ${a.join(" ")} }`);
	}
}
function pv(e, t) {
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		r.startsWith("--") || t(r, e.getPropertyValue(r));
	}
}
//#endregion
//#region src/interactions/drag-marks.ts
var mv = `:scope > :is(${Mu}, .ui-image-input__surface)`;
function hv(e, t, n, r, i, a = [], o = "move") {
	gv(t, r), _v(e, i, o), n.classList.add(r);
	for (let e of a) e.classList.add(r);
}
function gv(e, t) {
	for (let n of e.querySelectorAll(`.${t}`)) n.classList.remove(t);
}
function _v(e, t, n) {
	e instanceof DragEvent && e.dataTransfer !== null && (e.dataTransfer.effectAllowed = n, e.dataTransfer.setData("text/plain", t), e.target instanceof HTMLElement && av(e, e.dataTransfer, e.target));
}
function vv(e, t) {
	return !(e.relatedTarget instanceof Node && t.contains(e.relatedTarget));
}
function yv(e, t) {
	let n = t && e.querySelector(mv) !== null;
	e.hasAttribute("data-ui-drop-boxed") !== n && e.toggleAttribute(ge, n);
}
//#endregion
//#region src/interactions/file-drop.ts
var bv = "data-ui-file-drop-over", xv = 120, Sv = "refused", Cv = !1;
function wv(e) {
	let t = {
		marked: /* @__PURE__ */ new Map(),
		leaving: 0
	};
	Ov();
	for (let n of [
		"dragenter",
		"dragover",
		"dragleave",
		"drop"
	]) e.root.addEventListener(n, (n) => Tv(e, t, n), !0);
	e.root.addEventListener("dragend", () => Pv(t.marked), !0), window.addEventListener("blur", () => Pv(t.marked)), e.root.addEventListener("paste", (t) => Ev(e, t), !0);
}
function Tv(e, t, n) {
	if (!(n instanceof DragEvent) || !(n.target instanceof Element)) return;
	let r = t.marked;
	n.type !== "dragleave" && t.leaving !== 0 && (window.clearTimeout(t.leaving), t.leaving = 0);
	let i = e.resolveTarget(n.target);
	if (i === null || !(n.dataTransfer?.types.includes("Files") ?? !1)) {
		i === null && n.type === "dragover" && Pv(r);
		return;
	}
	let a = i.mark ?? i.host;
	if (i.refused === !0) {
		kv(n), n.type !== "dragleave" && Pv(r);
		return;
	}
	if (n.type === "dragleave") {
		n.relatedTarget instanceof Node ? a.contains(n.relatedTarget) || Nv(r, a) : t.leaving = window.setTimeout(() => Pv(r), xv);
		return;
	}
	if (n.preventDefault(), n.type !== "drop") {
		let t = Av(i.accept, n.dataTransfer);
		n.dataTransfer !== null && (n.dataTransfer.dropEffect = t ? "none" : "copy");
		for (let e of r.keys()) e !== a && Nv(r, e);
		let o = i.mark === void 0 ? e.draggingAttribute : bv;
		r.set(a, o), a.setAttribute(o, t ? Sv : ""), yv(a, o === bv);
		return;
	}
	Pv(r);
	let o = [...n.dataTransfer?.files ?? []].filter((e) => Fv(i.accept, e));
	o.length !== 0 && e.onFiles(i.host, i.multiple ? o : [o[0]]);
}
function Ev(e, t) {
	if (!(t instanceof ClipboardEvent) || !(t.target instanceof Element)) return;
	let n = t.clipboardData;
	if (n === null || n.files.length === 0 || n.getData("text/plain").trim().length > 0) return;
	let r = e.resolveTarget(t.target);
	if (r === null || r.refused === !0) return;
	let i = [...n.files].filter((e) => Fv(r.accept, e));
	i.length !== 0 && (t.preventDefault(), e.onFiles(r.host, r.multiple ? i : [i[0]]));
}
function Dv(e, t, n) {
	for (let r = t.closest(`[${y}]`); r !== null; r = r.parentElement?.closest("[data-ui-id]") ?? null) {
		let t = r.getAttribute("data-ui-id") ?? "", i = [...e.querySelectorAll(`${n}[${Rr}="${Ji(t)}"]`)];
		if (i.length > 0) return {
			field: i.find((e) => r.contains(e)) ?? i[0],
			component: r
		};
	}
	return null;
}
function Ov() {
	if (!Cv) {
		Cv = !0;
		for (let e of ["dragover", "drop"]) window.addEventListener(e, (e) => {
			e instanceof DragEvent && !e.defaultPrevented && (e.dataTransfer?.types.includes("Files") ?? !1) && kv(e);
		});
	}
}
function kv(e) {
	e.type !== "dragleave" && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "none"));
}
function Av(e, t) {
	let n = jv(e);
	if (t === null || n.length === 0 || n.some((e) => e.startsWith("."))) return !1;
	let r = [...t.items].filter((e) => e.kind === "file").map((e) => e.type.toLowerCase());
	return r.length !== 0 && !r.some((e) => n.some((t) => Mv(t, e)));
}
function jv(e) {
	return e.split(",").map((e) => e.trim().toLowerCase()).filter((e) => e.length > 0);
}
function Mv(e, t) {
	return e.endsWith("/*") ? t.startsWith(e.slice(0, -1)) : t === e;
}
function Nv(e, t) {
	let n = e.get(t);
	e.delete(t), n !== void 0 && t.removeAttribute(n), yv(t, !1);
}
function Pv(e) {
	for (let t of [...e.keys()]) Nv(e, t);
}
function Fv(e, t) {
	let n = jv(e);
	if (n.length === 0) return !0;
	let r = t.name.toLowerCase(), i = t.type.toLowerCase();
	return n.some((e) => e.startsWith(".") ? r.endsWith(e) : Mv(e, i));
}
//#endregion
//#region src/rendering/file-glyphs.ts
var Iv = "ne-picture-as-pdf", Lv = "ne-text-snippet", Rv = "ne-description", zv = "ne-table-chart", Bv = "ne-slideshow", Vv = "ne-folder-zip", Hv = "ne-audio-file", Uv = "ne-video-file", Wv = "ne-image", Gv = "ne-code", Kv = "ne-draft", qv = new Map([
	...Zv(Iv, "pdf"),
	...Zv(Lv, "txt", "md", "log"),
	...Zv(Rv, "doc", "docx", "odt", "rtf"),
	...Zv(zv, "xls", "xlsx", "ods", "csv", "tsv"),
	...Zv(Bv, "ppt", "pptx", "odp", "key"),
	...Zv(Vv, "zip", "rar", "7z", "tar", "gz", "tgz", "bz2", "xz"),
	...Zv(Hv, "mp3", "wav", "ogg", "oga", "opus", "flac", "m4a", "aac"),
	...Zv(Uv, "mp4", "m4v", "mov", "avi", "mkv", "webm"),
	...Zv(Wv, "png", "jpg", "jpeg", "gif", "webp", "avif", "bmp", "svg", "ico", "tif", "tiff", "heic", "heif"),
	...Zv(Gv, "json", "xml", "yml", "yaml", "html", "htm", "css", "less", "scss", "js", "mjs", "ts", "tsx", "jsx", "cs", "csproj", "sln", "java", "kt", "py", "rb", "php", "go", "rs", "c", "h", "cpp", "hpp", "swift", "sql", "sh", "ps1")
]), Jv = /* @__PURE__ */ new Map([
	["application/pdf", Iv],
	["text/csv", zv],
	["application/msword", Rv],
	["application/rtf", Rv],
	["application/vnd.openxmlformats-officedocument.wordprocessingml.document", Rv],
	["application/vnd.oasis.opendocument.text", Rv],
	["application/vnd.ms-excel", zv],
	["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", zv],
	["application/vnd.oasis.opendocument.spreadsheet", zv],
	["application/vnd.ms-powerpoint", Bv],
	["application/vnd.openxmlformats-officedocument.presentationml.presentation", Bv],
	["application/vnd.oasis.opendocument.presentation", Bv],
	["application/zip", Vv],
	["application/x-zip-compressed", Vv],
	["application/x-7z-compressed", Vv],
	["application/vnd.rar", Vv],
	["application/x-rar-compressed", Vv],
	["application/x-tar", Vv],
	["application/gzip", Vv],
	["application/json", Gv],
	["application/xml", Gv],
	["text/xml", Gv],
	["text/html", Gv]
]), Yv = /* @__PURE__ */ new Map([
	["image", Wv],
	["audio", Hv],
	["video", Uv],
	["text", Lv]
]);
function Xv(e, t) {
	let n = e.lastIndexOf("."), r = n < 0 ? void 0 : qv.get(e.slice(n + 1).toLowerCase());
	if (r !== void 0) return r;
	let i = t.split(";", 1)[0].trim().toLowerCase(), a = i.indexOf("/");
	return Jv.get(i) ?? (a < 0 ? void 0 : Yv.get(i.slice(0, a))) ?? Kv;
}
function Zv(e, ...t) {
	return t.map((t) => [t, e]);
}
//#endregion
//#region src/rendering/file-tile.ts
var Qv = [
	"kilobyte",
	"megabyte",
	"gigabyte"
];
function $v(e, t, n) {
	let r = document.createElement("span"), i = document.createElement("span"), a = document.createElement("span");
	return e.classList.add(wt), e.setAttribute("title", t.name), e.setAttribute(Ot, t.name), ey(e, kt, t.type.length > 0 ? t.type : null), ey(e, At, t.size === null ? null : String(t.size)), r.className = Tt, r.setAttribute("aria-hidden", "true"), i.className = Et, i.textContent = t.name, a.className = Dt, ny(e, r, a, n), [
		r,
		i,
		a
	];
}
function ey(e, t, n) {
	n === null ? e.removeAttribute(t) : e.setAttribute(t, n);
}
function ty(e, t) {
	let n = e.querySelector(`:scope > .${Tt}`), r = e.querySelector(`:scope > .${Dt}`);
	n !== null && r !== null && ny(e, n, r, t);
}
function ny(e, t, n, r) {
	let i = e.getAttribute(jt), a = i !== null && yo(i).length > 0 ? i : Xv(e.getAttribute("data-ui-file-name") ?? "", e.getAttribute("data-ui-file-type") ?? "");
	(!t.classList.contains(yo(a)) || i !== null) && go(t, a);
	let o = Number(e.getAttribute("data-ui-file-size") ?? NaN), s = Number.isFinite(o) && o >= 0 ? ry(o, r) : "";
	n.textContent !== s && (n.textContent = s);
}
function ry(e, t) {
	let n = e, r = "byte";
	for (let e of Qv) {
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
var iy = "SessionKey", ay = "/_ne/session/key", oy = 1e4, sy = new class {
	trade;
	pending = null;
	lastToken = null;
	constructor(e = ly) {
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
function cy(e, t) {
	for (let n of t ?? []) n.kind === "SessionKey" && e.start(n.token);
}
async function ly(e) {
	let t = await fetch(ay, {
		method: "POST",
		credentials: "same-origin",
		keepalive: !0,
		cache: "no-store",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ token: e }),
		signal: AbortSignal.timeout(oy)
	});
	if (!t.ok) throw Error(`the session key trade failed with status ${t.status}.`);
}
//#endregion
//#region src/interactions/file-upload.ts
var uy = "/_ne/files/upload", dy = "/_ne/files/selection/", fy = "/_ne/files/upload/", py = /* @__PURE__ */ new Map(), my = !1;
function hy(e, t, n, r) {
	let i = Number(e.getAttribute(Ir)), a = [], o = [];
	for (let e of t) !Number.isFinite(i) || i <= 0 || e.size <= i ? a.push(e) : o.push(e);
	if (o.length === 0) return py.delete(e) && r?.mark(e, null), a;
	if (r === void 0) return s("a chosen file exceeds the input's size limit and was refused.", {
		names: o.map((e) => e.name),
		limit: i
	}), a;
	let c = {
		validation: r,
		limit: i,
		names: n ? o.map((e) => e.name) : null
	};
	for (let e of py.keys()) e.isConnected || py.delete(e);
	return py.set(e, c), gy(e, c), _y(), a;
}
function gy(e, t) {
	let n = ry(t.limit, D.language);
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
function _y() {
	my || (my = !0, D.onChange(() => {
		for (let [e, t] of py) e.isConnected ? gy(e, t) : py.delete(e);
	}));
}
async function vy(e, t) {
	let n = [...e];
	return await sy.settled(), await yy(n, t);
}
function yy(e, t) {
	return new Promise((n, r) => {
		let i = new FormData(), a = performance.now(), o = 0, s = 0;
		for (let t of e) i.append("files", t, t.name), o += t.size, s++;
		let c = new XMLHttpRequest();
		c.open("POST", uy), c.responseType = "json", c.withCredentials = !0, c.upload.addEventListener("progress", (e) => {
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
async function by(e) {
	await sy.settled();
	let t = await fetch(`${dy}${encodeURIComponent(e)}`, {
		credentials: "same-origin",
		cache: "no-store"
	});
	if (!t.ok) throw Error(`Reading selection failed with status ${t.status}.`);
	let n = (await t.json())?.files ?? [];
	return n.length === 0 ? null : n;
}
function xy(e) {
	return `${fy}${encodeURIComponent(e)}`;
}
var Sy = () => {};
function Cy(e) {
	return {
		uploadAsync: (e, t) => vy(e, t ?? Sy),
		accepts: Fv,
		takeWithinSizeLimit: (t, n, r) => hy(t, n, r, e)
	};
}
function wy(e, t) {
	e !== null && e.value !== t && (e.value = t, e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/picker-events.ts
var Ty = "ui-open-picker";
function Ey(e) {
	return !e.dispatchEvent(new Event(Ty, {
		bubbles: !0,
		cancelable: !0
	}));
}
function Dy(e, t) {
	if (!(e.target instanceof Element)) return;
	let n = e.target.closest(t.rootSelector);
	if (n === null) return;
	e.preventDefault();
	let r = n.querySelector(t.nativeSelector), i = t.pressed(n);
	r === null || r.disabled || i === null || A(n) || O(i) || r.click();
}
//#endregion
//#region src/interactions/file-input-engine.ts
var Oy = "ui-file-input", ky = "ui-file-input__row", Ay = "ui-file-input__native", jy = "ui-file-input__field", My = "ui-file-input__selection", Ny = "data-ui-file-dragging", Py = class {
	root;
	validation;
	picks = /* @__PURE__ */ new WeakMap();
	shownWords = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation, D.onChange(() => this.rewriteShownWords()), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener(Ty, (e) => Dy(e, {
			rootSelector: `.${Oy}`,
			nativeSelector: `.${Ay}`,
			pressed: (e) => e
		})), this.root.addEventListener("change", (e) => void this.handleSelectionAsync(e), !0), wv({
			root: this.root,
			draggingAttribute: Ny,
			resolveTarget: (e) => {
				let t = e.closest(`.${ky}`)?.closest(`.${Oy}`) ?? null, n = t === null ? Dv(this.root, e, `.${Oy}`) : null, r = t ?? n?.field ?? null, i = r?.querySelector(`.${Ay}`) ?? null;
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
		let t = e.target.closest(`[${Lr}], .${ky}`);
		if (t === null || O(t) || A(t) || !t.hasAttribute("data-ui-file-pick") && e.target.closest("button, a") !== null) return;
		let n = t.closest(`.${Oy}`)?.querySelector(`.${Ay}`);
		n == null || n.disabled || n.click();
	}
	async handleSelectionAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Ay)) return;
		let t = e.target.closest(`.${Oy}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && await this.takeFilesAsync(t, n);
	}
	async takeFilesAsync(e, t) {
		let n = e.querySelector(`.${jy}`);
		if (n === null) return;
		if (t.length === 0) {
			this.show(n, ""), this.publishSelection(e, "");
			return;
		}
		let r = hy(e, t, e.querySelector(`.${Ay}`)?.multiple === !0, this.validation);
		if (r.length === 0) return;
		let i = (this.picks.get(e) ?? 0) + 1;
		this.picks.set(e, i);
		try {
			let t = await vy(r, (t) => {
				this.picks.get(e) === i && this.show(n, () => D.format("ui.file.uploading", { percent: t }));
			});
			if (this.picks.get(e) !== i) return;
			this.show(n, Fy(r)), this.publishSelection(e, t.selectionId);
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
		wy(e.querySelector(`.${My}`), t);
	}
};
function Fy(e) {
	return e.length === 1 ? e[0].name : () => D.format("ui.file.count", { count: e.length });
}
var Iy = 1024, Ly = 16777216;
function Ry(e) {
	return {
		x: e.width / 2,
		y: e.height / 2,
		zoom: 1
	};
}
function zy(e, t) {
	let n = Yy(t.zoom, 1, 4), r = Jy(e) / n / 2;
	return {
		x: Yy(t.x, r, e.width - r),
		y: Yy(t.y, r, e.height - r),
		zoom: n
	};
}
function By(e, t) {
	let n = Jy(e) / t.zoom;
	return {
		x: t.x - n / 2,
		y: t.y - n / 2,
		side: n
	};
}
function Vy(e, t, n) {
	return t.zoom * n / Jy(e);
}
function Hy(e, t, n, r, i) {
	let a = Vy(e, t, n);
	return a > 0 ? zy(e, {
		x: t.x - r / a,
		y: t.y - i / a,
		zoom: t.zoom
	}) : t;
}
function Uy(e, t, n, r, i = {
	x: 0,
	y: 0
}) {
	let a = Yy(t.zoom * r, 1, 4), o = Vy(e, t, n), s = Vy(e, {
		...t,
		zoom: a
	}, n);
	return !(o > 0) || !(s > 0) ? zy(e, {
		...t,
		zoom: a
	}) : zy(e, {
		x: t.x + i.x / o - i.x / s,
		y: t.y + i.y / o - i.y / s,
		zoom: a
	});
}
function Wy(e, t) {
	return Math.max(1, Math.min(t, Math.round(e.side)));
}
function Gy(e, t) {
	return Math.min(1, t * 4 / Jy(e), Math.sqrt(Ly / (e.width * e.height)));
}
function Ky(e) {
	return e === "image/jpeg" || e === "image/png" || e === "image/webp" ? e : "image/png";
}
function qy(e, t, n) {
	if (n === t) return e;
	let r = e.lastIndexOf(".");
	return `${r > 0 ? e.slice(0, r) : e}.${n === "image/jpeg" ? "jpg" : n.slice(n.indexOf("/") + 1)}`;
}
function Jy(e) {
	return Math.min(e.width, e.height);
}
function Yy(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
//#endregion
//#region src/interactions/page-dialog.ts
function Xy(e) {
	let t = document.createElement("div");
	t.className = `ui-dialog ${e.className}`, t.setAttribute(ag, e.key), t.setAttribute(og, ""), e.closesOnEscapeAndBackdrop && (t.setAttribute(lg, ""), t.setAttribute(cg, "")), t.setAttribute("hidden", "");
	let n = document.createElement("div");
	n.className = "ui-dialog__backdrop", n.setAttribute(sg, "");
	let r = document.createElement("div");
	return r.className = e.surfaceClassName === void 0 ? wi : `${wi} ${e.surfaceClassName}`, r.setAttribute("role", e.role), r.setAttribute("tabindex", "-1"), r.setAttribute("aria-modal", "true"), r.setAttribute("aria-labelledby", e.labelledBy), e.describedBy !== void 0 && r.setAttribute("aria-describedby", e.describedBy), t.append(n, r), {
		dialog: t,
		surface: r
	};
}
var Zy = class {
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
}, Qy = 100 / 3, $y = 1, eb = 2;
function tb(e, t = Qy) {
	let n = e.deltaMode === $y ? Qy : e.deltaMode === eb ? t : 1;
	return {
		x: e.deltaX * n,
		y: e.deltaY * n
	};
}
function nb(e, t) {
	let n = (Math.sign(e) === Math.sign(t) ? e : 0) + t, r = Math.trunc(n / 100) || 0;
	return {
		steps: r,
		carried: n - r * 100
	};
}
var rb = {
	notch: 100,
	pixels: tb
}, ib = "ui-image-crop", ab = "ui-image-crop-title", ob = new Zy("data-ui-image-crop-part"), sb = "data-ui-image-crop-frame", cb = 10, lb = 1.2, ub = 380, db = 100, fb = .92, V = null, pb = !1, mb = null, hb = !1;
async function gb(e, t, n, r = Ob) {
	if (V !== null || pb) return "cancelled";
	pb = !0;
	let i;
	try {
		i = await r.decodeAsync(t, n.size);
	} finally {
		pb = !1;
	}
	if (i === null) return "unreadable";
	let a = i;
	return new Promise((i) => {
		mb ??= _b();
		let o = mb;
		o.dialog.isConnected || document.body.append(o.dialog), V = {
			file: t,
			source: a,
			request: n,
			imaging: r,
			view: Ry(a),
			finish: (t) => {
				V = null, e.close(ib), a.release(), i(t);
			}
		}, D.write(o.title, null, "ui.crop.title"), D.write(o.stage, "aria-label", "ui.crop.frame"), D.write(o.zoom, "aria-label", "ui.crop.zoom"), D.write(o.cancel, null, "ui.crop.cancel"), D.write(o.apply, null, "ui.crop.apply"), o.stage.setAttribute(sb, n.frame), e.open(ib), Eb(o);
	});
}
function _b() {
	let { dialog: e, surface: t } = Xy({
		key: ib,
		className: "ui-image-crop",
		surfaceClassName: "ui-image-crop__surface",
		role: "dialog",
		labelledBy: ab,
		closesOnEscapeAndBackdrop: !1
	}), n = ob.element("h2", "ui-image-crop__title ui-text-type--subtitle");
	n.id = ab;
	let r = ob.element("div", "ui-image-crop__stage", "stage");
	r.setAttribute("tabindex", "0"), r.setAttribute("role", "group");
	let i = ob.element("canvas", "ui-image-crop__canvas"), a = ob.element("span", "ui-image-crop__frame");
	i.setAttribute("aria-hidden", "true"), a.setAttribute("aria-hidden", "true"), r.append(i, a);
	let o = ob.element("input", "ui-image-crop__zoom", "zoom");
	o.type = "range", o.min = "1", o.max = "4", o.step = "0.01";
	let s = ob.button("ui-button--ghost", "cancel"), c = ob.button("ui-button--primary", "apply");
	t.append(n, r, o, ob.actions(s, c));
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
		let t = ob.pressed(e);
		t === "cancel" ? V?.finish("cancelled") : t === "apply" && vb();
	}), new MutationObserver(() => {
		V !== null && e.hasAttribute("hidden") && V.finish("cancelled");
	}).observe(e, {
		attributes: !0,
		attributeFilter: ["hidden"]
	}), e.addEventListener("keydown", (e) => yb(l, e)), o.addEventListener("input", () => wb(l, Number(o.value))), r.addEventListener("wheel", (e) => bb(l, e), { passive: !1 }), window.addEventListener("resize", () => Db(l)), new Ig({
		root: e,
		resolveHandle: (e) => r.contains(e) ? r : null,
		begin: (e, t) => V === null ? null : {
			last: t,
			start: V.view
		},
		move: (e, t, n) => {
			e.last !== null && xb(l, n.x - e.last.x, n.y - e.last.y), e.last = n;
		},
		end: () => void 0,
		cancel: (e, t) => {
			V !== null && (V.view = t.start, Eb(l));
		},
		pinch: (e, t) => {
			e.last = null, Sb(l, t);
		}
	}), l;
}
async function vb() {
	let e = V;
	if (e === null) return;
	let { file: t, source: n, request: r, imaging: i, view: a } = e, o = By(n, a), s = Ky(t.type), c = i.encodeAsync(n, o, Wy(o, r.size), s);
	V = null;
	let l;
	try {
		l = await c;
	} catch {
		l = null;
	}
	e.finish(l === null ? "unreadable" : new File([l], qy(t.name, t.type, l.type), {
		type: l.type,
		lastModified: t.lastModified
	}));
}
function yb(e, t) {
	if (t.defaultPrevented || j(t) || V === null) return;
	if (t.key === "Escape") {
		t.preventDefault(), V.finish("cancelled");
		return;
	}
	if (t.target !== e.stage || !M(t, { shift: !0 })) return;
	let n = t.shiftKey ? 50 : cb;
	switch (t.key) {
		case "ArrowLeft":
			xb(e, -n, 0);
			break;
		case "ArrowRight":
			xb(e, n, 0);
			break;
		case "ArrowUp":
			xb(e, 0, -n);
			break;
		case "ArrowDown":
			xb(e, 0, n);
			break;
		case "+":
		case "=":
			Cb(e, lb);
			break;
		case "-":
		case "_":
			Cb(e, 1 / lb);
			break;
		case "Enter":
			vb();
			break;
		default: return;
	}
	t.preventDefault();
}
function bb(e, t) {
	if (V === null) return;
	t.preventDefault();
	let n = tb(t, e.stage.clientHeight), r = t.ctrlKey ? db : ub;
	Cb(e, 2 ** (-n.y / r), Tb(e, t.clientX, t.clientY));
}
function xb(e, t, n) {
	V !== null && (V.view = Hy(V.source, V.view, e.frame.clientWidth, t, n), Eb(e));
}
function Sb(e, t) {
	if (V === null) return;
	let n = Hy(V.source, V.view, e.frame.clientWidth, t.shift.x, t.shift.y);
	V.view = Uy(V.source, n, e.frame.clientWidth, t.factor, Tb(e, t.center.x, t.center.y)), Eb(e);
}
function Cb(e, t, n) {
	V !== null && (V.view = Uy(V.source, V.view, e.frame.clientWidth, t, n), Eb(e));
}
function wb(e, t) {
	V !== null && Number.isFinite(t) && t > 0 && Cb(e, t / V.view.zoom);
}
function Tb(e, t, n) {
	let r = e.stage.getBoundingClientRect();
	return {
		x: t - (r.left + r.width / 2),
		y: n - (r.top + r.height / 2)
	};
}
function Eb(e) {
	if (V === null) return;
	let t = V.view.zoom;
	e.zoom.value = String(t), e.zoom.setAttribute("aria-valuetext", `${Math.round(t * 100)}%`), e.zoom.style.setProperty("--ui-slider-fraction", String((t - 1) / 3)), Db(e);
}
function Db(e) {
	hb || V === null || (hb = !0, requestAnimationFrame(() => {
		if (hb = !1, V === null) return;
		let t = e.frame.clientWidth, n = e.stage.clientWidth, r = e.stage.clientHeight, i = V.view, a = Vy(V.source, i, t);
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
var Ob = {
	decodeAsync: async (e, t) => {
		let n = await kb(e);
		if (n === null) return null;
		let r = n, i = Gy(r, t);
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
		}, r, fb));
	})
};
async function kb(e) {
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
var Ab = "ui-image-input", jb = "ui-image-input--multiple", Mb = "ui-image-input__surface", Nb = "ui-image-input__native", Pb = "ui-image-input__picture", Fb = "ui-image-input__text", Ib = "ui-image-input__selection", Lb = "ui-image-input__selections", Rb = "ui-image-input__tiles", zb = "ui-image-input__tile", Bb = "ui-image-input__remove", Vb = "ui-image-input__progress", Hb = "SelectionId", Ub = "--ui-image-progress", Wb = "data-ui-image-preview", Gb = "data-ui-image-dragging", Kb = "data-ui-image-tiles", qb = class {
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
		this.root = e.root ?? document, this.validation = e.validation, this.dialogs = e.dialogs, this.cropImaging = e.cropImaging, this.applyAll(this.root.querySelectorAll(`.${Ab}`)), B(this.root, `.${Ab}`, {
			childList: !0,
			attributeFilter: [
				Fr,
				$e,
				li
			]
		}, (e) => {
			this.applyAll(e), this.releaseDetached();
		}), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			e.propertyName === Hb && (e.value === null || e.value === void 0 || e.value === "") && this.clearAll(za(e.components, `.${Ab}`));
		}), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("click", (e) => this.handleRemoveClick(e), !0), this.root.addEventListener("change", (e) => void this.handleNativeChangeAsync(e), !0), this.root.addEventListener(Ty, (e) => Dy(e, {
			rootSelector: `.${Ab}`,
			nativeSelector: `.${Nb}`,
			pressed: (e) => e.querySelector(`.${Mb}`)
		})), this.root.addEventListener(Au, (e) => this.handleDraftDropped(e)), wv({
			root: this.root,
			draggingAttribute: Gb,
			resolveTarget: (e) => {
				let t = e.closest(`.${Mb}`), n = t?.closest(`.${Ab}`) ?? null, r = n === null ? Dv(this.root, e, `.${Ab}`) : null, i = n ?? r?.field ?? null, a = t ?? i?.querySelector(`.${Mb}`) ?? null;
				return i === null || a === null ? null : {
					host: i,
					mark: r?.component,
					accept: i.querySelector(`.${Nb}`)?.getAttribute("accept") ?? "",
					multiple: Jb(i),
					refused: A(i) || O(a)
				};
			},
			onFiles: (e, t) => void (Jb(e) ? this.takeManyAsync(e, t) : this.takeFileAsync(e, t[0]))
		});
	}
	applyAll(e) {
		for (let t of e) Jb(t) ? this.reconcileShelf(t) : this.apply(t);
	}
	apply(e) {
		let t = e.querySelector(`.${Pb}`);
		if (t === null) return;
		let n = e.getAttribute("data-ui-image-source") ?? "", r = this.previews.has(e);
		if (r && e.dataset.previewFor === n) return;
		let i = r && n.length > 0;
		this.dropPreview(e, i), n.length === 0 ? t.removeAttribute("src") : t.getAttribute("src") !== n && t.setAttribute("src", n), i || rx(e, e.getAttribute("data-ui-image-caption") ?? ox(n)), ax(e, n.length > 0);
	}
	reconcileShelf(e) {
		let t = e.getAttribute(li);
		if (this.seenKeys.get(e) === t) return;
		this.seenKeys.set(e, t);
		let n = this.published.get(e) ?? [], r = t === null ? -1 : n.indexOf(t);
		if (r >= 0) {
			n.splice(0, r + 1);
			return;
		}
		let i = Qb(t);
		if (i === null) return;
		let a = this.shelves.get(e) ?? [];
		for (let t of [...a]) t.selectionId !== null && !i.has(t.selectionId) && this.dropTile(e, t);
		this.restoreTiles(e, a, i);
	}
	restoreTiles(e, t, n) {
		let r = e.querySelector(`.${Rb}`);
		if (r === null || n.size === 0) return;
		let i = /* @__PURE__ */ new Map();
		for (let e of t) e.selectionId !== null && i.set(e.selectionId, e);
		let a = [];
		for (let t of n) {
			let n = i.get(t);
			n === void 0 && (n = ex(t), this.fillStoredTileAsync(e, n, t)), a.push(n);
		}
		for (let e of t) e.selectionId === null && a.push(e);
		a.length === t.length && a.every((e, n) => t[n] === e) || (t.splice(0, t.length, ...a), this.shelves.set(e, t), r.replaceChildren(...t.map((e) => e.element)), Yb(e, t));
	}
	async fillStoredTileAsync(e, t, n) {
		let r;
		try {
			r = await by(n);
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
		tx(t.element, a, i === void 0 ? "" : xy(i.fileId)), t.element.classList.remove(xi);
	}
	releaseDetached() {
		for (let e of this.holding) if (!e.isConnected) {
			this.holding.delete(e), this.dropPreview(e);
			for (let t of [...this.shelves.get(e) ?? []]) this.dropTile(e, t);
		}
	}
	clearAll(e) {
		for (let t of e) Jb(t) || this.previews.get(t)?.landed !== !0 || (t.dataset.previewFor === (t.getAttribute("data-ui-image-source") ?? "") && this.dropPreview(t), this.apply(t));
	}
	handlePickClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Lr}]`), n = t?.closest(`.${Ab}`) ?? null;
		t === null || n === null || A(n) || O(t) || n.querySelector(`.${Nb}`)?.click();
	}
	handleRemoveClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Bb}`), n = t?.closest(`.${Ab}`) ?? null;
		if (t === null || n === null || A(n) || O(n)) return;
		e.preventDefault(), e.stopPropagation();
		let r = this.shelves.get(n)?.find((e) => e.element === t.parentElement);
		r !== void 0 && (this.dropTile(n, r), this.publishShelf(n));
	}
	async handleNativeChangeAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Nb)) return;
		let t = e.target.closest(`.${Ab}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && n.length !== 0 && (Jb(t) ? await this.takeManyAsync(t, n) : await this.takeFileAsync(t, n[0]));
	}
	handleDraftDropped(e) {
		if (e.target instanceof Element) for (let t of e.target.querySelectorAll(`.${Ab}`)) this.previews.has(t) && (this.dropPreview(t), this.apply(t), wy(t.querySelector(`.${Ib}`), ""));
	}
	async takeFileAsync(e, t) {
		this.releaseDetached();
		let n = e.querySelector(`.${Mb}`), r = e.querySelector(`.${Pb}`), i = e.querySelector(`.${Ib}`);
		if (n === null || r === null) return;
		let a = await this.cropAsync(e, t);
		if (a === null || hy(e, [a], !1, this.validation).length === 0) return;
		this.dropPreview(e);
		let o = {
			url: URL.createObjectURL(a),
			landed: !1
		};
		this.previews.set(e, o), this.holding.add(e), e.dataset.previewFor = e.getAttribute("data-ui-image-source") ?? "", e.setAttribute(Wb, ""), r.setAttribute("src", o.url), rx(e, a.name), ax(e, !0), n.classList.add(xi);
		try {
			let t = await vy([a], () => void 0);
			this.previews.get(e) === o && (o.landed = !0, wy(i, t.selectionId));
		} catch (t) {
			s("picture upload failed.", t), this.previews.get(e) === o && (ix(e), wy(i, ""));
		} finally {
			(this.previews.get(e) === o || !this.previews.has(e)) && n.classList.remove(xi);
		}
	}
	async cropAsync(e, t) {
		let n = Xb(e);
		if (n === null || this.dialogs === void 0) return t;
		if (this.cropping.has(e)) return null;
		this.cropping.add(e);
		try {
			let r = await gb(this.dialogs, t, {
				frame: n,
				size: Zb(e)
			}, this.cropImaging);
			return r === "cancelled" || !e.isConnected ? null : r === "unreadable" ? (this.unreadable.add(e), this.validation?.mark(e, "error", { key: "ui.image.unreadable" }), null) : (this.unreadable.delete(e) && this.validation?.mark(e, null), r);
		} finally {
			this.cropping.delete(e);
		}
	}
	async takeManyAsync(e, t) {
		this.releaseDetached();
		let n = e.querySelector(`.${Rb}`), r = hy(e, t, !0, this.validation);
		if (n === null || r.length === 0) return;
		let i = this.shelves.get(e) ?? [];
		this.shelves.set(e, i), this.holding.add(e);
		let a = r.map(async (t) => {
			let r = $b(t);
			i.push(r), n.appendChild(r.element);
			try {
				let n = await vy([t], (e) => r.element.style.setProperty(Ub, `${e}%`));
				if (!i.includes(r)) return;
				r.selectionId = n.selectionId, r.element.classList.remove(xi), this.publishShelf(e);
			} catch (t) {
				this.dropTile(e, r), s("picture upload failed.", t);
			}
		});
		Yb(e, i), await Promise.all(a);
	}
	dropTile(e, t) {
		let n = this.shelves.get(e), r = n?.indexOf(t) ?? -1;
		n !== void 0 && r >= 0 && n.splice(r, 1), t.url !== null && URL.revokeObjectURL(t.url), t.element.remove(), Yb(e, n ?? []);
	}
	publishShelf(e) {
		let t = e.querySelector(`.${Lb}`), n = (this.shelves.get(e) ?? []).map((e) => e.selectionId).filter((e) => e !== null), r = JSON.stringify(n);
		if (t === null || t.getAttribute("data-ui-selected-keys") === r) return;
		let i = this.published.get(e) ?? [];
		i.push(r), this.published.set(e, i), t.setAttribute(li, r), t.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	dropPreview(e, t = !1) {
		let n = this.previews.get(e);
		n !== void 0 && (URL.revokeObjectURL(n.url), this.previews.delete(e), delete e.dataset.previewFor, e.removeAttribute(Wb), t || rx(e, ""));
	}
};
function Jb(e) {
	return e.classList.contains(jb);
}
function Yb(e, t) {
	e.hasAttribute(Kb) !== t.length > 0 && e.toggleAttribute(Kb, t.length > 0);
}
function Xb(e) {
	let t = e.getAttribute(et);
	return t === "square" || t === "circle" ? t : null;
}
function Zb(e) {
	let t = Number(e.getAttribute(tt));
	return Number.isInteger(t) && t > 0 ? t : Iy;
}
function Qb(e) {
	if (e === null) return /* @__PURE__ */ new Set();
	let t;
	try {
		t = JSON.parse(e);
	} catch {
		return null;
	}
	return Array.isArray(t) ? new Set(t.filter((e) => typeof e == "string")) : null;
}
function $b(e) {
	let t = document.createElement("span"), n = URL.createObjectURL(e);
	return t.className = `${zb} ${xi}`, tx(t, e, n), {
		element: t,
		url: n,
		selectionId: null
	};
}
function ex(e) {
	let t = document.createElement("span"), n = document.createElement("button"), r = document.createElement("span");
	return t.className = `${zb} ${xi}`, n.type = "button", n.className = Bb, r.className = Vb, D.write(n, "aria-label", "ui.file.remove"), t.append(n, r), {
		element: t,
		url: null,
		selectionId: e
	};
}
function tx(e, t, n) {
	let r = document.createElement("button"), i = document.createElement("span");
	if (r.type = "button", r.className = Bb, i.className = Vb, t.type.startsWith("image/")) {
		let a = document.createElement("img");
		a.src = n, a.alt = t.name, D.write(r, "aria-label", "ui.image.remove"), a.addEventListener("error", () => e.replaceChildren(...nx(e, r, t), r, i), { once: !0 }), e.replaceChildren(a, r, i);
	} else e.replaceChildren(...nx(e, r, t), r, i);
}
function nx(e, t, n) {
	return D.write(t, "aria-label", "ui.file.remove"), $v(e, n, D.language);
}
function rx(e, t) {
	let n = e.querySelector(`.${Fb}`);
	n !== null && (jc(n, null), n.textContent !== t && (n.textContent = t));
}
function ix(e) {
	let t = e.querySelector(`.${Fb}`);
	t !== null && D.write(t, null, "ui.file.failed");
}
function ax(e, t) {
	let n = e.querySelector(`.${Mb}`);
	n !== null && D.write(n, "aria-label", t ? "ui.image.change" : "ui.image.choose");
}
function ox(e) {
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
var sx = "ui-key-value-action__value", cx = "ui-key-value-action--editable", lx = "ui-text__title", ux = "ui-row-form-", dx = ":scope > :is(.ui-input--filled, .ui-input--tonal, .ui-input--outline, .ui-input--ghost, .ui-input--underline)", fx = class {
	options;
	root;
	openRows = /* @__PURE__ */ new WeakSet();
	closedRows = /* @__PURE__ */ new WeakSet();
	rowForms = /* @__PURE__ */ new WeakMap();
	formCount = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.handleRows(this.root.querySelectorAll(`.${mu}`), !1), B(this.root, `.${mu}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [kr]
		}, (e) => this.handleRows(e, !0)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && _x(e.target) && e.preventDefault();
		}, !0), (this.root === document ? window : this.root).addEventListener("change", (e) => gx(e), !0);
	}
	handleRows(e, t) {
		for (let n of e) n.hasAttribute("data-ui-row-editing") ? (this.closedRows.delete(n), this.joinForm(n), px(n), this.openRows.has(n) || (this.openRows.add(n), this.open(n, t), this.judge(n))) : this.closedRows.has(n) || (this.openRows.delete(n), this.closedRows.add(n), this.close(n));
	}
	joinForm(e) {
		let t = e.querySelector(`.${gu} button`);
		if (t === null) return;
		let n = this.rowForms.get(e);
		n === void 0 && (n = `${ux}${++this.formCount}`, this.rowForms.set(e, n));
		for (let t of e.querySelectorAll(`.${hu} [${Xe}]:not([${on}])`)) t.setAttribute(on, n);
		t.setAttribute(vi, n);
	}
	leaveForm(e) {
		let t = this.rowForms.get(e);
		if (t !== void 0) for (let n of e.querySelectorAll(`[${on}="${t}"], [${vi}="${t}"]`)) n.removeAttribute(on), n.removeAttribute(vi);
	}
	close(e) {
		this.leaveForm(e);
		for (let t of e.querySelectorAll(`.${hu} [${Xe}]`)) {
			if (Eu(t)) {
				t.value = "";
				continue;
			}
			let e = this.options.dom.resolveNearestComponent(t, () => !0);
			this.options.propertyPatchEngine.restoreBoundValue(t, e?.dynamicParameters ?? []);
		}
		ju(e), this.judge(e);
	}
	judge(e) {
		let t = hx(e);
		for (let n of e.querySelectorAll(`.${hu} [${Xe}]`)) this.options.validation.judgeShown(n, Eu(n) && n.value.length === 0 ? t : null);
	}
	open(e, t) {
		let n = e.querySelector(`.${hu} :is(input, textarea, select)`);
		if (n !== null) {
			if (Eu(n) && n.value.length === 0 && n.hasAttribute("data-ui-bind-value")) {
				let t = hx(e);
				t.length > 0 && (n.value = t, n.dispatchEvent(new Event("change", { bubbles: !0 })));
			}
			t && (n.focus({ preventScroll: !0 }), Tu(n) && n.select());
		}
	}
	handleKeydown(e) {
		if (e.key === "F2" && !e.defaultPrevented && M(e)) {
			mx(e);
			return;
		}
		if (e.defaultPrevented || j(e) || !(e.target instanceof Element) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = bu(e.target);
		if (t === null || e.key === "Enter" && t.cell.classList.contains("ui-key-value-action__edit-action")) return;
		let { cell: n, row: r } = t, i = e.target.closest(ki), a = n.querySelector("[role='listbox']");
		if (i !== null && n.contains(i) || a !== null && a.getClientRects().length > 0 || e.key === "Enter" && e.target instanceof HTMLTextAreaElement) return;
		let o = r.querySelectorAll(`.${gu} button`), s = e.key === "Enter" ? o[0] : o[o.length - 1];
		s !== void 0 && (e.preventDefault(), !O(s) && (e.key === "Enter" && e.target instanceof HTMLInputElement && (e.target.dispatchEvent(new Event("change", { bubbles: !0 })), s.focus({ preventScroll: !0 })), s.click()));
	}
};
function px(e) {
	for (let t of e.querySelectorAll(`:scope > .${hu}`)) {
		let e = t.querySelector(dx) !== null;
		t.hasAttribute("data-ui-boxed-editor") !== e && t.toggleAttribute(Ar, e);
	}
}
function mx(e) {
	let t = e.target instanceof Element ? e.target.closest(`.${mu}`) : null, n = t === null || t.hasAttribute("data-ui-row-editing") || t.closest(`.${cx}`) === null ? null : t.querySelector(".ui-key-value-action__action")?.querySelector(Wf) ?? null;
	n === null || O(n) || (e.preventDefault(), n.click());
}
function hx(e) {
	return e.querySelector(`.${sx} .${lx}`)?.textContent?.trim() ?? "";
}
function gx(e) {
	if (!e.isTrusted || !(e.target instanceof Element)) return;
	let t = e.target.closest(".ui-key-value-action__value-input")?.closest(".ui-key-value-action__row") ?? null;
	t !== null && !t.hasAttribute("data-ui-row-editing") && e.stopImmediatePropagation();
}
function _x(e) {
	let t = e.closest(`.${gu} button`), n = t?.closest(`.${gu}`)?.querySelectorAll("button");
	return t !== null && n !== void 0 && n[n.length - 1] === t;
}
var vx = `.ui-button[${Bt}="pressed"]`, yx = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(vx);
		t === null || O(t) || t.hasAttribute("data-ui-drawer-pin") || (t.setAttribute("aria-pressed", t.getAttribute("aria-pressed") === "true" ? "false" : "true"), t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, bx = `${Nu}, [tabindex], [contenteditable], ${ki}, [${Qe}]`, xx = ":scope > input.ui-field, :scope > textarea.ui-field", Sx = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("pointerdown", (e) => this.handlePointerDown(e));
	}
	handlePointerDown(e) {
		if (e.defaultPrevented || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(Mu);
		if (t === null || e.target !== t && e.target.closest(bx) !== null) return;
		let n = t.querySelector(xx);
		if (!Eu(n) || n.readOnly || O(n) || A(n) || (e.preventDefault(), n.focus({ preventScroll: !0 }), n.selectionStart === null)) return;
		let r = n.value.length;
		n.setSelectionRange(r, r);
	}
}, Cx = "data-ui-input-debounce", wx = `input[${Cx}], textarea[${Cx}]`;
function Tx(e) {
	return (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.matches(wx);
}
var Ex = /* @__PURE__ */ new Set();
function Dx() {
	for (let e of Ex) if (e.waiting) return !0;
	return !1;
}
function Ox() {
	for (let e of Ex) e.commitAll();
}
function kx(e) {
	for (let t of Ex) t.drop(e);
}
var Ax = class {
	waits = /* @__PURE__ */ new Map();
	composing = /* @__PURE__ */ new WeakSet();
	constructor(e) {
		e.addEventListener("compositionstart", (e) => this.mark(e, !0), !0), e.addEventListener("compositionend", (e) => this.mark(e, !1), !0), Ex.add(this);
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
}, jx = class {
	root;
	pauses;
	constructor(e = {}) {
		this.root = e.root ?? document, this.pauses = new Ax(this.root), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("compositionend", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleChange(e), !0);
	}
	handleInput(e) {
		let t = e.target;
		if (!Tx(t) || e.isComposing === !0) return;
		let n = Number(t.getAttribute(Cx));
		this.pauses.wait(t, Number.isFinite(n) && n >= 0 ? n : 0, () => t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	handleChange(e) {
		Tx(e.target) && this.pauses.drop(e.target);
	}
}, Mx = "data-ui-submit-on-enter", Nx = "data-ui-runs-on-enter", Px = "enter", Fx = "escape", Ix = {
	name: Px,
	registration: { settlesValue: !0 }
}, Lx = "ui-commit-in-place", Rx = class {
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
		}, !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), this.root.addEventListener(Lx, (e) => {
			(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) && this.commitInPlace(e.target);
		}), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = this.focusedField;
			t !== null && !(e.local && this.edited.has(t)) && e.components.some((e) => e.contains(t)) && (this.lastCommitted = t.value);
		});
	}
	handleKeydown(e) {
		if (e.defaultPrevented || j(e) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = e.target;
		t instanceof HTMLTextAreaElement ? e.key === "Escape" ? (e.preventDefault(), yu(t) ? this.runEscape(t, e) : this.leave(t)) : zx(t, e) ? (e.preventDefault(), this.runEnter(t, e)) : Bx(t, e) && (e.preventDefault(), this.commitInPlace(t), this.submitForm(t)) : Tu(t) && (e.preventDefault(), zx(t, e) ? this.runEnter(t, e) : e.key === "Escape" && yu(t) ? this.runEscape(t, e) : (this.leave(t), e.key === "Enter" && this.submitForm(t)));
	}
	runEnter(e, t) {
		t.repeat || e.readOnly || O(e) || (this.commitInPlace(e), e.dispatchEvent(new Event(Px, { bubbles: !0 })));
	}
	runEscape(e, t) {
		if (t.repeat) return;
		kx(e), this.edited.delete(e), e === this.focusedField && e.value !== this.lastCommitted && this.putBack(e, this.lastCommitted);
		let n = wp(e);
		e.blur(), Tp(e, n), e.dispatchEvent(new Event(Fx, { bubbles: !0 }));
	}
	putBack(e, t) {
		this.propertyPatchEngine?.writeBoundValue(e, t), e.value !== t && (e.value = t);
	}
	submitForm(e) {
		let t = e.getAttribute(on);
		if (t === null || t.length === 0) return;
		let n = this.root.querySelector(`[${vi}="${Ji(t)}"]`);
		n !== null && !O(n) && n.click();
	}
	leave(e) {
		let t = this.changes, n = wp(e);
		e.blur(), this.changes === t && this.commit(e), Tp(e, n);
	}
	commit(e) {
		e.value !== this.committedValue && e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	commitInPlace(e) {
		this.edited.has(e) ? e.dispatchEvent(new Event("change", { bubbles: !0 })) : this.commit(e);
	}
};
function zx(e, t) {
	return Vx(t) && e.hasAttribute(Nx);
}
function Bx(e, t) {
	return Vx(t) && e.hasAttribute(Mx) && !e.readOnly && !O(e);
}
function Vx(e) {
	return e.key === "Enter" && M(e);
}
//#endregion
//#region src/updates/icon-stand-in.ts
var Hx = "icon-stand-in", Ux = ".ui-icon.ui-icon--circle", Wx = "ne-person", Gx = "ui-icon--circle", Kx = "ui-icon--image", qx = "ui-icon-stand-in", Jx = `:scope > .${qx}`, Yx = "missing", Xx = "failed", Zx = 512, Qx = /* @__PURE__ */ new Map(), $x = /* @__PURE__ */ new Map();
function eS(e) {
	let t = e.getAttribute(ct), n = tS(e);
	return n === null ? e.removeAttribute(ct) : t !== n && e.setAttribute(ct, n), aS(e, n !== null), n === Yx ? "show" : t === Yx ? "release" : "keep";
}
function tS(e) {
	if (!e.classList.contains(Gx)) return null;
	if (!e.className.split(" ").some(vo)) return Yx;
	let t = e.classList.contains(Kx) ? nS(e) : null;
	if (t === null) return null;
	let n = Qx.get(t);
	return n === void 0 || !n.loaded && Date.now() - n.at >= 3e4 ? (rS(t, e), n === void 0 ? null : Xx) : n.loaded ? null : Xx;
}
function nS(e) {
	let t = e.style.getPropertyValue(ho).trim();
	return t.startsWith("url(\"") && t.endsWith("\")") ? t.slice(5, -2) : null;
}
function rS(e, t) {
	let n = $x.get(e);
	if (n !== void 0) {
		n.add(t);
		return;
	}
	$x.set(e, /* @__PURE__ */ new Set([t]));
	let r = new Image();
	r.addEventListener("load", () => iS(e, !0)), r.addEventListener("error", () => iS(e, !1)), r.src = e;
}
function iS(e, t) {
	let n = $x.get(e);
	Qx.delete(e), Qx.set(e, {
		loaded: t,
		at: Date.now()
	}), $x.delete(e), Qx.size > Zx && Qx.delete(Qx.keys().next().value);
	for (let e of n ?? []) eS(e);
}
function aS(e, t) {
	let n = e.querySelector(Jx);
	if (!t) {
		n?.remove();
		return;
	}
	let r = e.getAttribute(ot), i = r !== null && yo(r).length > 0 ? r : Wx;
	if (n === null) n = document.createElement("span"), n.setAttribute("aria-hidden", "true"), e.appendChild(n);
	else if (n.classList.contains(yo(i))) return;
	go(n, i), n.classList.add(qx);
}
//#endregion
//#region src/interactions/image-fallback-engine.ts
var oS = `.${nt}`, sS = `img.${rt}`, cS = `:scope > ${sS}`, lS = "%238c8c8c", uS = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='-12 -12 48 48'%3E%3Crect x='3' y='3' width='18' height='18' rx='3' fill='none' stroke='${lS}' stroke-width='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.75' fill='${lS}'/%3E%3Cpath d='M4 18l5-6 4 4.5 3-3 4 4.5' fill='none' stroke='${lS}' stroke-width='2' stroke-linejoin='round'/%3E%3C/svg%3E`, dS = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'/%3E", fS = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("error", (e) => this.handleError(e), !0);
		for (let e of this.root.querySelectorAll(sS)) (hS(e) || e.complete && e.naturalWidth === 0) && _S(e);
		for (let e of this.root.querySelectorAll(Ux)) eS(e);
		B(this.root, `${oS}, ${Ux}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: ["src", "class"],
			relevant: pS
		}, (e) => {
			for (let t of e) t.classList.contains("ui-image") ? mS(t) : eS(t);
		});
	}
	handleError(e) {
		let t = e.target;
		t instanceof HTMLImageElement && t.matches(sS) && _S(t);
	}
};
function pS(e) {
	if (e.type === "childList") return !0;
	let t = e.target;
	return t instanceof Element && (e.attributeName === "src" ? t.matches(sS) : t.matches(oS));
}
function mS(e) {
	let t = e.querySelector(cS);
	t !== null && (e.hasAttribute("data-ui-image-failed") && (gS(t) ? t.getAttribute("src") !== yS(e) && vS(e, t) : (e.removeAttribute(st), aS(e, !1))), hS(t) && _S(t));
}
function hS(e) {
	let t = e.getAttribute("src");
	return t === null || t.trim().length === 0;
}
function gS(e) {
	let t = e.getAttribute("src");
	return t === uS || t === dS;
}
function _S(e) {
	if (gS(e)) return;
	let t = e.getAttribute(at);
	if (t !== null && t.length > 0 && e.getAttribute("src") !== t) {
		e.setAttribute("src", t);
		return;
	}
	let n = e.parentElement;
	n !== null && n.classList.contains("ui-image") && (n.setAttribute(st, ""), vS(n, e));
}
function vS(e, t) {
	t.setAttribute("src", yS(e)), aS(e, e.classList.contains(it));
}
function yS(e) {
	return e.classList.contains("ui-image--circle") ? dS : uS;
}
//#endregion
//#region src/items/radio-row-decorator.ts
var bS = "ui-radio-group__input", xS = "ui-radio-group__dot", SS = {
	kind: "radio",
	decorate: CS
};
function CS(e) {
	let t = document.createElement("input");
	t.className = bS, t.type = "radio", t.value = e.key;
	let n = document.createElement("span");
	n.className = xS, e.row.prepend(t, n);
}
//#endregion
//#region src/interactions/radio-group-sync-engine.ts
var wS = "data-ui-radio-value", TS = "ui-radio-group", ES = "ui-radio-group__item", DS = "data-ui-radio-group-name", OS = "data-ui-radio-bind-value-id", kS = class {
	root;
	renamed = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.claimGroupNames([...this.root.querySelectorAll(`.${TS}`)]);
		for (let e of this.root.querySelectorAll(`.${TS}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = [];
			for (let n of e) if (n.type === "attributes" && n.target instanceof HTMLElement) this.sync(n.target.closest(`.${TS}`));
			else if (!Zh(n)) for (let e of n.addedNodes) e instanceof HTMLElement && t.push(e);
			this.claimGroupNames(t.flatMap(AS));
			for (let e of new Set(t.map((e) => e.closest(`.${TS}`)))) this.sync(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: [wS, "class"],
			childList: !0,
			subtree: !0
		});
	}
	claimGroupNames(e) {
		if (e.length === 0) return;
		let t = /* @__PURE__ */ new Map();
		for (let e of this.root.querySelectorAll(`.${TS}`)) {
			let n = e.getAttribute(DS);
			n !== null && t.set(n, (t.get(n) ?? 0) + 1);
		}
		let n = /* @__PURE__ */ new Set();
		for (let r of e) {
			let e = r.getAttribute(DS), i = e === null ? 0 : t.get(e) ?? 0;
			if (e === null || i < 2) continue;
			t.set(e, i - 1), n.add(e);
			let a = `${e}-${++this.renamed}`;
			r.setAttribute(DS, a);
			for (let e of ld(r, `.${bS}`, `.${TS}`)) e.name = a;
			this.sync(r);
		}
		if (n.size !== 0) for (let e of this.root.querySelectorAll(`.${TS}`)) n.has(e.getAttribute(DS) ?? "") && this.sync(e);
	}
	sync(e) {
		if (e === null) return;
		let t = e.getAttribute(wS), n = e.getAttribute(DS), r = e.getAttribute(OS);
		for (let i of ld(e, `.${bS}`, `.${TS}`)) {
			n !== null && i.name !== n && (i.name = n), r !== null && i.getAttribute("data-ui-bind-value") !== r && i.setAttribute(Xe, r), i.checked = i.value === t;
			let e = jS(i);
			i.disabled !== e && (i.disabled = e);
		}
	}
};
function AS(e) {
	return e.classList.contains(TS) ? [e] : [...e.querySelectorAll(`.${TS}`)];
}
function jS(e) {
	let t = e.closest(`.${ES}`);
	return t !== null && k(t);
}
//#endregion
//#region src/rendering/color-bytes.ts
function MS(e) {
	return Number.isFinite(e) ? Math.min(255, Math.max(0, Math.round(e))) : 0;
}
function NS(e) {
	return MS(e).toString(16).padStart(2, "0").toUpperCase();
}
function PS(e, t, n, r) {
	let i = r / 255, a = (e) => Math.round(e * i + 255 * (1 - i));
	return (FS(a(e), a(t), a(n)) + .05) ** 2 > 1.05 * .05 ? "var(--ui-color-on-light)" : "var(--ui-color-on-dark)";
}
function FS(e, t, n) {
	return .2126 * IS(e) + .7152 * IS(t) + .0722 * IS(n);
}
function IS(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
//#endregion
//#region src/rendering/web-dom-converters.ts
var LS = "inlineMarkupPlainText", RS = /* @__PURE__ */ new Map([
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
]), zS = [
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
function BS(e) {
	return U(e, zS);
}
var VS = [
	"small",
	"medium",
	"large"
], HS = ["default", "circle"], US = [
	"display",
	"title",
	"subtitle",
	"body",
	"caption",
	"overline"
], WS = [
	"start",
	"center",
	"end",
	"justify"
], GS = ["nowrap", "wrap"], KS = /* @__PURE__ */ new Map([
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
]), qS = /* @__PURE__ */ new Map([
	["primary", "--ui-color-primary-ink"],
	["accent", "--ui-color-accent-ink"],
	["info", "--ui-color-info-ink"],
	["warning", "--ui-color-warning-ink"],
	["success", "--ui-color-success-ink"],
	["danger", "--ui-color-danger-ink"]
]), JS = /* @__PURE__ */ new Map([
	["primary", "--ui-color-on-primary"],
	["accent", "--ui-color-on-accent"],
	["info", "--ui-color-on-info"],
	["warning", "--ui-color-on-warning"],
	["success", "--ui-color-on-success"],
	["danger", "--ui-color-on-danger"],
	["muted", "--ui-color-surface"]
]), YS = ["inline", "trailing"], XS = [
	"none",
	"left",
	"top",
	"right",
	"bottom"
], ZS = [
	"filled",
	"outline",
	"underline",
	"ghost",
	"tonal"
], QS = [
	"small",
	"medium",
	"large"
], $S = [
	"small",
	"medium",
	"large"
], eC = [
	"primary",
	"accent",
	"danger",
	"outline",
	"ghost",
	"link",
	"surface"
], tC = [
	"primary",
	"accent",
	"info",
	"warning",
	"success",
	"danger",
	"surface",
	"plain"
], nC = [
	"filled",
	"tinted",
	"outline"
], rC = ["light", "dark"], iC = [
	"start",
	"center",
	"end",
	"stretch"
], aC = ["clip", "visible"], oC = [
	"visible",
	"hidden",
	"collapsed"
], sC = [
	"background",
	"raised",
	"tinted",
	"flat"
], cC = ["horizontal", "vertical"], lC = [
	"none",
	"gap",
	"rule"
], uC = [
	"none",
	"one",
	"many"
], dC = [
	"none",
	"left",
	"right",
	"top",
	"bottom"
], fC = ["stack", "wrap"], pC = ["end", "start"], mC = [
	"disabled",
	"auto",
	"always"
], hC = [
	"disabled",
	"proximity",
	"mandatory"
], gC = [
	"text",
	"email",
	"password",
	"search",
	"tel",
	"url"
], _C = [
	"text",
	"numeric",
	"decimal",
	"tel",
	"email",
	"url",
	"search"
], vC = ["hex", "rgb"], yC = ["field", "swatch"], bC = [
	"fill",
	"contain",
	"cover",
	"none"
], xC = [
	"100% 100%",
	"contain",
	"cover",
	"auto"
], SC = ["default", "circle"], CC = ["card", "quiet"], wC = ["uniform", "vignette"], TC = ["linear", "circular"], EC = [
	"none",
	"vertical",
	"horizontal",
	"both"
], DC = [
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
], OC = [
	"None",
	"Shade",
	"Tint"
], kC = /* @__PURE__ */ new Map();
function AC(e) {
	return kC.get(e);
}
function H(e, t, n) {
	return NC(e, jC(t, n), (e) => `${t}${U(e, n)}`);
}
function jC(e, t) {
	return MC(t.map((t) => `${e}${t}`));
}
function MC(e) {
	let t = new Set(e);
	return (e) => t.has(e);
}
function NC(e, t, n) {
	return kC.set(e, t), [e, n];
}
function PC(e, t, n) {
	return Bm.map((r) => [`${e}${r[0].toUpperCase()}${r.slice(1)}${t}`, (e) => n(e, r)]);
}
var FC = new Map([
	H("colorClass", "ui-color--", zS),
	NC("themeColorClass", jC("ui-color--", zS), (e) => bw(e)),
	NC("iconClass", vo, (e) => yo(e)),
	["iconUrlCss", (e) => uo(e)],
	["safeUrl", (e) => Xa(e)],
	["safeImageSource", (e) => ao(e)],
	[LS, (e) => e == null ? void 0 : Mo(String(e))],
	["ariaBooleanAttribute", (e) => e === !0 ? "true" : "false"],
	["placeholderText", (e) => typeof e == "string" && e.length > 0 ? e : " "],
	H("iconSizeClass", "ui-icon-size--", VS),
	NC("iconShapeClass", MC(["ui-icon--circle"]), (e) => U(e, HS) === "circle" ? "ui-icon--circle" : ""),
	H("textTypeClass", "ui-text-type--", US),
	NC("textAppearanceClass", jC("ui-text-type--", US), (e) => Aw(e, "ui-text-type--")),
	NC("textDescriptionTypeClass", jC("ui-text--description-", US), (e) => Aw(e, "ui-text--description-")),
	H("textAlignmentClass", "ui-text--align-", WS),
	H("textWrapClass", "ui-text--", GS),
	H("buttonAlignmentClass", "ui-button--align-", WS),
	H("textBadgePlacementHostClass", "ui-text--badge-", YS),
	H("badgeStyleClass", "ui-badge-style--", tC),
	H("badgeFillClass", "ui-badge-fill--", nC),
	NC("badgeColoredClass", MC(["ui-badge--colored"]), (e) => dw(e).length > 0 ? "ui-badge--colored" : ""),
	["badgeTextFit", (e) => xw(e)],
	H("buttonClass", "ui-button--", eC),
	H("surfaceStyleClass", "ui-surface--", sC),
	H("orientationClass", "ui-orientation--", cC),
	H("groupSeparatorClass", "ui-command-bar--separator-", lC),
	["selectionModeAttribute", (e) => U(e, uC)],
	["selectionBackgroundCss", (e) => dw(cw(e, "background"))],
	["selectionForegroundCss", (e) => dw(cw(e, "foreground"))],
	["selectionMarkColorCss", (e) => dw(cw(e, "markColor"))],
	["selectionMarkCss", (e) => uw(cw(e, "mark"))],
	["selectionFontWeightCss", (e) => lw(cw(e, "bold"))],
	["selectionActionBarBackgroundCss", (e) => dw(cw(e, "actionBarBackground"))],
	H("itemsViewLayoutClass", "ui-items-view--", fC),
	H("dragHandlePlacementClass", "ui-drag-handle--", pC),
	H("scrollXClass", "ui-scroll-x--", mC),
	H("scrollYClass", "ui-scroll-y--", mC),
	["hostViewport", (e) => XC(e)],
	H("scrollSnapClass", "ui-scroll-snap--", hC),
	H("inputAppearanceClass", "ui-input--", ZS),
	H("inputSizeClass", "ui-input--", $S),
	H("buttonSizeClass", "ui-button--", QS),
	H("buttonGroupSizeClass", "ui-button-group--", QS),
	["textInputTypeAttribute", (e) => U(e, gC)],
	["inputModeAttribute", (e) => U(e, _C)],
	["colorTextFormatAttribute", (e) => U(e, vC)],
	["colorInputVariantAttribute", (e) => U(e, yC)],
	["themeNameCss", (e) => U(e, rC)],
	["alignmentCss", (e) => U(e, iC)],
	["alignmentStretchFallbackCss", (e) => U(e, iC) === "stretch" ? "start" : ""],
	["overflowCss", (e) => U(e, aC)],
	["layoutLengthCss", (e) => ZC(e)],
	["thicknessCss", (e) => ew(e)],
	NC("borderEdgeClass", jC("ui-border--", XS), (e) => {
		let t = rw(e);
		return t === void 0 ? "" : `ui-border--${t}`;
	}),
	["radiusCss", (e) => iw(e)],
	["gridUnitCss", (e) => aw(e)],
	["pixelsCss", (e) => Bw(e)],
	["gridTemplateCss", (e) => ow(e)],
	["colorVariantCss", (e) => Pw(e)],
	["themeColorCss", (e) => dw(e)],
	["themeInkCss", (e) => pw(e)],
	["roleInkCss", (e) => mw(e)],
	["themeOnColorCss", (e) => gw(e)],
	["themeGroundCss", (e) => _w(e)],
	["themeColorInlineCss", (e) => fw(e) ? "" : dw(e)],
	["themeColorCanonical", (e) => Mw(e)],
	["textAppearanceFontSizeCss", (e) => jw(e, "size")],
	["textAppearanceFontWeightCss", (e) => jw(e, "weight")],
	["textAppearanceLineHeightCss", (e) => jw(e, "lineHeight")],
	["textAppearanceLetterSpacingCss", (e) => jw(e, "letterSpacing")],
	...PC("responsiveLayoutLength", "Css", (e, t) => ZC(Km(e, t))),
	...PC("responsiveWidth", "Css", (e, t) => QC(Km(e, t), "horizontal")),
	...PC("responsiveHeight", "Css", (e, t) => QC(Km(e, t), "vertical")),
	...PC("responsiveThickness", "Css", (e, t) => ew(Km(e, t))),
	...PC("responsivePadding", "Css", (e, t) => tw(Km(e, t))),
	...PC("responsiveThicknessHorizontal", "Css", (e, t) => nw(Km(e, t), "horizontal")),
	...PC("responsiveThicknessVertical", "Css", (e, t) => nw(Km(e, t), "vertical")),
	...PC("responsiveRadius", "Css", (e, t) => iw(Km(e, t))),
	...PC("responsivePixels", "Css", (e, t) => Vw(Km(e, t))),
	...PC("visibility", "Attribute", (e, t) => Hw(e, t)),
	...PC("gridPlacement", "ColumnCss", (e, t) => sw(Km(e, t), "column")),
	...PC("gridPlacement", "RowCss", (e, t) => sw(Km(e, t), "row")),
	...PC("gridPlacement", "ColumnSpanCss", (e, t) => sw(Km(e, t), "columnSpan")),
	...PC("gridPlacement", "RowSpanCss", (e, t) => sw(Km(e, t), "rowSpan")),
	H("imageFitClass", "ui-image-fit--", bC),
	NC("expanderVariantClass", MC(["ui-expander--quiet"]), (e) => U(e, CC) === "quiet" ? "ui-expander--quiet" : ""),
	NC("imageShapeClass", MC(["ui-image--circle"]), (e) => U(e, SC) === "circle" ? "ui-image--circle" : ""),
	["backgroundImageCss", (e) => BC(e)],
	["backgroundImageAttribute", (e) => BC(e).length === 0 ? void 0 : ""],
	["imageFitSizeCss", (e) => U(e, xC)],
	["backgroundImageDimCss", (e) => VC(e)],
	["backgroundImageDimModeAttribute", (e) => U(e, wC) === "vignette" ? "vignette" : void 0],
	["backgroundImageBlurCss", (e) => GC(e) ? `${Number(e)}px` : ""],
	["backgroundImageBlurAttribute", (e) => GC(e) ? "" : void 0],
	["positiveCount", (e) => HC(e)?.toString()],
	["nonNegativeCount", (e) => UC(e, (e) => e >= 0)?.toString()],
	["nonZeroCount", (e) => UC(e, (e) => e !== 0)?.toString()],
	["positiveNumber", (e) => WC(e, (e) => e > 0)?.toString()],
	["nonNegativeNumber", (e) => WC(e, (e) => e >= 0)?.toString()],
	["share", (e) => WC(e, (e) => e >= 0 && e <= 1)?.toString()],
	["positiveFlagAttribute", (e) => HC(e) === void 0 ? void 0 : ""],
	NC("maxLinesClass", MC(["ui-text--max-lines"]), (e) => HC(e) === void 0 ? "" : "ui-text--max-lines"),
	NC("textAreaGrowClass", MC(["ui-text-area--grow"]), (e) => HC(e) === void 0 ? "" : "ui-text-area--grow"),
	H("progressVariantClass", "ui-progress--", TC),
	["progressValueText", (e) => zw(e)],
	["textAreaResizeCss", (e) => U(e, EC)],
	H("flyoutPlacementClass", "ui-flyout--", DC),
	["popupPlacementAttribute", (e) => U(e, DC)],
	["tabMenuEntriesAttribute", (e) => RC(e)],
	["markedDaysAttribute", (e) => zC(e)]
]);
function IC(e) {
	let t = FC.get("surfaceStyleClass");
	return sC.find((n, r) => e.classList.contains(t?.(r) ?? "")) ?? null;
}
var LC = [
	["rename", 1],
	["pin", 2],
	["close", 4],
	["delete", 8]
];
function RC(e) {
	let t = typeof e == "string" ? e.split(",").map((e) => e.trim().toLowerCase()) : null, n = typeof e == "number" ? e : 0, r = LC.filter(([e, r]) => t === null ? (n & r) !== 0 : t.includes(e)).map(([e]) => e);
	return r.length === 0 ? void 0 : r.join(" ");
}
function zC(e) {
	let t = Array.isArray(e) ? e.filter((e) => typeof e == "string" && e.length > 0).map((e) => e.slice(0, 10)) : [];
	return t.length === 0 ? void 0 : [...new Set(t)].sort().join(" ");
}
function BC(e) {
	return uo(e);
}
function VC(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isNaN(t) ? "" : String(Math.min(1, Math.max(0, t)));
}
function HC(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isInteger(t) && t > 0 ? t : void 0;
}
function UC(e, t) {
	let n = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isInteger(n) && t(n) ? n : void 0;
}
function WC(e, t) {
	let n = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isFinite(n) && t(n) ? n : void 0;
}
function GC(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isFinite(t) && t > 0;
}
var KC = [
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
], qC = new Map(KC.map(([, e, t, n, r]) => [e, [
	t,
	n,
	r
]])), JC = new Map(KC.map(([e, t]) => [e, t])), YC = /* @__PURE__ */ new Map([[aC, /* @__PURE__ */ new Map([["Hidden", "clip"]])], [xC, /* @__PURE__ */ new Map([["Fill", "100% 100%"], ["None", "auto"]])]]);
function U(e, t) {
	return typeof e == "string" ? (t === void 0 ? void 0 : YC.get(t)?.get(e)) ?? RS.get(e) ?? Yi(e) : typeof e == "number" && t !== void 0 ? t[e] ?? String(e) : String(e ?? "");
}
function XC(e) {
	return e == null || U(e, mC) === "disabled" ? void 0 : "parent";
}
function ZC(e) {
	if (e == null) return "";
	if (typeof e == "number") return Bw(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.kind, r = t.value ?? 0;
	return n === "Auto" || n === 0 ? "" : n === "Absolute" || n === 1 ? Bw(r) : n === "Fill" || n === 2 ? "100%" : "";
}
function QC(e, t) {
	if (typeof e != "object" || !e) return ZC(e);
	let n = e.kind;
	return n !== "Fill" && n !== 2 ? ZC(e) : t === "horizontal" ? "var(--ui-fill-width, 100%)" : "var(--ui-fill-height, 100%)";
}
function $C(e) {
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
function ew(e) {
	if (e == null) return "";
	let t = $C(e);
	return t === void 0 ? String(e) : `${t.top}px ${t.right}px ${t.bottom}px ${t.left}px`;
}
function tw(e) {
	let t = e == null ? void 0 : $C(e);
	return t === void 0 ? "" : `${t.top}px max(${t.right}px, var(--ui-scroll-room-right), var(--ui-scroll-cap)) max(${t.bottom}px, var(--ui-scroll-room-x)) max(${t.left}px, var(--ui-scroll-room-left), var(--ui-scroll-cap))`;
}
function nw(e, t) {
	let n = $C(e);
	return n === void 0 ? "" : Bw(t === "horizontal" ? n.left + n.right : n.top + n.bottom);
}
function rw(e) {
	if (e == null) return;
	if (typeof e == "object" && "base" in e) {
		let t = Bm.map((t) => Km(e, t)).filter((e) => e != null), n = new Set(t.map((e) => rw(e)));
		return n.size === 0 ? "none" : n.size === 1 ? [...n][0] : void 0;
	}
	let t = $C(e);
	if (t === void 0) return;
	let { top: n, right: r, bottom: i, left: a } = t;
	return n === 0 && r === 0 && i === 0 && a === 0 ? "none" : n === 0 && r === 0 && i === 0 ? "left" : a === 0 && r === 0 && i === 0 ? "top" : a === 0 && n === 0 && i === 0 ? "right" : a === 0 && n === 0 && r === 0 ? "bottom" : void 0;
}
function iw(e) {
	if (e == null) return "";
	if (typeof e == "number") return Bw(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.topLeft ?? 0, r = t.topRight ?? 0, i = t.bottomRight ?? 0, a = t.bottomLeft ?? 0;
	return n === r && n === i && n === a ? Bw(n) : `${n}px ${r}px ${i}px ${a}px`;
}
function aw(e) {
	if (e == null) return "";
	if (typeof e == "number") return e <= 0 ? "minmax(0, 1fr)" : `minmax(0, ${e}fr)`;
	if (typeof e != "object") return String(e);
	let t = e, n = t.unit, r = t.value ?? 1, i = t.minValue, a = t.maxValue;
	if (n === "Absolute" || n === 1) return Bw(r);
	if (n === "Star" || n === 0) {
		let e = i != null && i > 0 ? `${i}px` : "0";
		return r <= 0 ? `minmax(${e}, 1fr)` : `minmax(${e}, ${r}fr)`;
	}
	return n === "Auto" || n === 2 ? i == null ? a == null ? "auto" : `fit-content(${a}px)` : `minmax(${i}px, auto)` : "";
}
function ow(e) {
	if (e == null) return "";
	if (!Array.isArray(e)) return aw(e);
	if (e.length === 0) return "none";
	if (e.length === 1) return aw(e[0]);
	let t = JSON.stringify(e[0]);
	return e.every((e) => JSON.stringify(e) === t) ? `repeat(${e.length}, ${aw(e[0])})` : e.map((e) => aw(e)).join(" ");
}
function sw(e, t) {
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
function cw(e, t) {
	return typeof e != "object" || !e ? null : e[t] ?? null;
}
function lw(e) {
	return e == null ? "" : e === !0 ? "600" : "400";
}
function uw(e) {
	if (e == null) return "";
	switch (U(e, dC)) {
		case "left": return "inset 2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "right": return "inset -2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "top": return "inset 0 2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "bottom": return "inset 0 -2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		default: return "none";
	}
}
function dw(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	if (Nw(e)) return Pw(e);
	let t = e, n = Pw(t.light), r = Pw(t.dark), i = n.length > 0 ? n : r, a = r.length > 0 ? r : n;
	if (i.length > 0 && a.length > 0) return i === a ? i : `light-dark(${i}, ${a})`;
	let o = t.style;
	if (o == null) return "";
	let s = KS.get(U(o, zS));
	return s ? `var(${s})` : "";
}
function fw(e) {
	if (typeof e != "object" || !e || Nw(e)) return !1;
	let t = e;
	return t.light == null && t.dark == null && t.style != null;
}
function pw(e) {
	if (fw(e)) {
		let t = qS.get(U(e.style, zS));
		if (t !== void 0) return `var(${t})`;
	}
	return dw(e);
}
function mw(e) {
	if (typeof e != "object" || !e || Nw(e)) return "";
	let t = e;
	return t.light == null && t.dark == null ? pw(e) : "";
}
var hw = /* @__PURE__ */ new Set(["background", "surface"]);
function gw(e) {
	if (typeof e != "object" || !e) return "";
	if (Nw(e)) return vw(e) ? "initial" : yw(e);
	let t = e, n = yw(t.light ?? t.dark), r = yw(t.dark ?? t.light);
	if (n.length > 0 && r.length > 0 && vw(t.light ?? t.dark) && vw(t.dark ?? t.light)) return "initial";
	if (n.length > 0 && r.length > 0) return n === r ? n : `light-dark(${n}, ${r})`;
	if (t.style === null || t.style === void 0) return "";
	let i = U(t.style, zS);
	if (hw.has(i)) return "initial";
	let a = JS.get(i);
	return a ? `var(${a})` : "";
}
function _w(e) {
	if (typeof e == "object" && e) {
		let t = e;
		if (Nw(e) ? vw(e) : vw(t.light ?? t.dark) && vw(t.dark ?? t.light)) return "inherit";
	}
	return dw(e);
}
function vw(e) {
	return Fw(e)?.[3] === 0;
}
function yw(e) {
	let t = Fw(e);
	return t === void 0 ? "" : PS(t[0], t[1], t[2], t[3]);
}
function bw(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.light != null || t.dark != null) return "";
	let n = t.style;
	return n == null ? "" : `ui-color--${U(n, zS)}`;
}
function xw(e) {
	let t = Tw(e == null ? "" : String(e).trim(), Sw + 1);
	return t > 0 && t <= Sw ? "compact" : "";
}
var Sw = 2, Cw = /[\u0300-\uFFFF]/, ww = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function Tw(e, t) {
	if (!Cw.test(e)) return e.length;
	let n = 0;
	for (let { segment: r } of ww.segment(e)) {
		if (n >= t) break;
		n += Ew(r) ? 2 : 1;
	}
	return n;
}
function Ew(e) {
	if (e.includes("️")) return !0;
	let t = e.codePointAt(0) ?? 0;
	for (let e = 0; e < Dw.length; e += 2) if (t >= Dw[e] && t <= Dw[e + 1]) return !0;
	return !1;
}
var Dw = [
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
function Ow(e, t) {
	kw(e, String(t));
}
function kw(e, t) {
	let n = e.querySelector(".ui-badge__text");
	n !== null && (n.textContent = t), e.setAttribute(Ue, xw(t)), e.setAttribute(We, "");
}
function Aw(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size != null) return "";
	let r = n.role;
	return r == null ? "" : `${t}${U(r, US)}`;
}
function jw(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size == null) return "";
	switch (t) {
		case "size": return Bw(n.size);
		case "weight": {
			let e = n.weight;
			return e == null ? "" : String(e);
		}
		case "lineHeight": {
			let e = n.lineHeight;
			return e == null ? "" : Bw(e);
		}
		case "letterSpacing": {
			let e = n.letterSpacing;
			return e == null ? "" : Bw(e);
		}
		default: return "";
	}
}
function Mw(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return "";
	let t = e, n = Iw(t.style);
	if (n !== null) return `@${n}`;
	let r = t.light ?? t.dark;
	if (r == null) return "";
	if (typeof r.rgb == "number") {
		let e = r.opacity ?? 255, t = `#${NS(r.rgb >> 16 & 255)}${NS(r.rgb >> 8 & 255)}${NS(r.rgb & 255)}`;
		return e === 255 ? t : `${t}${NS(e)}`;
	}
	let i = Lw(r.name);
	return i === null ? "" : `${i}/${Rw(r.adjustment) ?? "None"}/${r.factor ?? 0}/${r.opacity ?? 255}`;
}
function Nw(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.name !== void 0 || t.rgb !== void 0;
}
function Pw(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	let t = Fw(e);
	return t === void 0 ? "" : `#${NS(t[0])}${NS(t[1])}${NS(t[2])}${NS(t[3])}`;
}
function Fw(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = typeof t.rgb == "number" ? [
		t.rgb >> 16 & 255,
		t.rgb >> 8 & 255,
		t.rgb & 255
	] : void 0, r = Lw(t.name), i = n ?? (r === null ? void 0 : qC.get(r));
	if (!i) return;
	let a = Rw(t.adjustment), o = (t.factor ?? 0) / 10, s = t.opacity ?? 255, [c, l, u] = i;
	return a === "Shade" ? (c = MS(c * (1 - o)), l = MS(l * (1 - o)), u = MS(u * (1 - o))) : a === "Tint" && (c = MS(c + (255 - c) * o), l = MS(l + (255 - l) * o), u = MS(u + (255 - u) * o)), [
		c,
		l,
		u,
		s
	];
}
function Iw(e) {
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	if (typeof e != "number") return null;
	let t = zS[e];
	return t === void 0 ? null : t.split("-").map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join("");
}
function Lw(e) {
	if (typeof e == "number") return JC.get(e) ?? null;
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	return null;
}
function Rw(e) {
	if (typeof e == "number") return OC[e] ?? "None";
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? "None" : t;
	}
	return "None";
}
function zw(e) {
	if (e == null || e === "") return "";
	let t = typeof e == "number" ? e : Number(e);
	return Number.isFinite(t) ? String(t) : "";
}
function Bw(e) {
	return `${typeof e == "number" ? e : Number(e ?? 0)}px`;
}
function Vw(e) {
	return e == null ? "" : Bw(e);
}
function Hw(e, t) {
	let n = qm(e, t);
	if (n == null) return;
	let r = U(n, oC);
	return r === "visible" ? void 0 : r;
}
//#endregion
//#region src/interactions/search-input-engine.ts
var Uw = "data-ui-search-debounce", Ww = "data-ui-search-min-length", Gw = "data-ui-search-manual", Kw = "data-ui-search-answered", qw = "ui-search__input", Jw = "ui-select__list", Yw = "ui-select__option", Xw = 300, Zw = "data-ui-search-waiting", Qw = "ui-search__field", $w = /* @__PURE__ */ new WeakMap(), eT = {
	name: "search",
	registration: {
		started: (e) => tT(e.domEvent.target),
		completed: (e) => nT(e.domEvent.target)
	}
};
function tT(e) {
	if (!(e instanceof Element)) return;
	let t = $w.get(e) ?? {
		asked: 0,
		timer: null
	};
	$w.set(e, t), !(t.asked++ > 0) && (rT(e)?.setAttribute("aria-busy", "true"), t.timer = window.setTimeout(() => {
		t.timer = null, e.closest(`.${Qw}`)?.setAttribute(Zw, "");
	}, 300));
}
function nT(e) {
	if (!(e instanceof Element)) return;
	let t = $w.get(e);
	t === void 0 || --t.asked > 0 || ($w.delete(e), t.timer !== null && window.clearTimeout(t.timer), rT(e)?.removeAttribute("aria-busy"), e.closest(`.${Qw}`)?.removeAttribute(Zw));
}
function rT(e) {
	return e.closest(".ui-select")?.querySelector(`.${Jw}`) ?? null;
}
var iT = class {
	root;
	pauses;
	constructor(e = {}) {
		this.root = e.root ?? document, this.pauses = new Ax(this.root), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("compositionend", (e) => this.handleInput(e), !0), this.root.addEventListener("keydown", (e) => this.handleEnter(e), !0);
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(qw) || e.isComposing === !0) return;
		let t = e.target;
		oT(t);
		let n = t.getAttribute(Uw), r = n === null ? Xw : Number(n);
		this.pauses.wait(t, Number.isFinite(r) && r >= 0 ? r : Xw, () => this.commit(t));
	}
	handleEnter(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Enter" || e.defaultPrevented || j(e) || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(qw)) return;
		let t = e.target;
		e.preventDefault(), this.pauses.drop(t), this.commit(t, !0);
	}
	commit(e, t = !1) {
		e.dispatchEvent(new Event("change", { bubbles: !0 })), (t || !e.hasAttribute(Gw)) && aT(e) && e.dispatchEvent(new Event("search", { bubbles: !0 }));
	}
};
function aT(e) {
	let t = Number(e.getAttribute(Ww) ?? 0);
	return !Number.isFinite(t) || e.value.trim().length >= t;
}
function oT(e) {
	if (e.hasAttribute(Kw)) return;
	let t = e.closest(`.${Ii}`), n = t?.querySelector(`.${Jw}`);
	if (t == null || n == null) return;
	let r = aT(e) ? Ag(e.value, e) : [], i = sT(n, (e) => r.length === 0 || Mg(jg(Fg(e), e), r));
	uT(t, n, r.length > 0 && i === 0);
}
function sT(e, t) {
	let n = null, r = !1, i = 0;
	for (let a of e.children) {
		if (!(a instanceof HTMLElement)) continue;
		if (a.hasAttribute("data-ui-group-header")) {
			n !== null && cT(n, r), n = a, r = !1;
			continue;
		}
		if (!a.classList.contains(Yw)) continue;
		let e = t(a);
		cT(a, e), r ||= e, e && i++;
	}
	return n !== null && cT(n, r), i;
}
function cT(e, t) {
	let n = t ? "" : "none";
	e.style.display !== n && (e.style.display = n);
}
function lT(e) {
	let t = e.querySelector(`.${Jw}`);
	t !== null && uT(e, t, sT(t, (e) => e.style.display !== "none") === 0);
}
function uT(e, t, n) {
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
var dT = 500, fT = class {
	owner = null;
	typed = "";
	last = -Infinity;
	now;
	constructor(e = () => performance.now()) {
		this.now = e;
	}
	next(e) {
		let t = this.now();
		(e.owner !== this.owner || t - this.last > dT) && (this.typed = ""), this.owner = e.owner, this.last = t, this.typed += jg(e.character, e.context);
		let n = Array.from(this.typed), r = n.every((e) => e === n[0]), i = r ? n[0] : this.typed, a = e.entries.length, o = e.current === null ? -1 : e.entries.indexOf(e.current), s = r ? o + 1 : Math.max(o, 0);
		for (let t = 0; t < a; t++) {
			let n = e.entries[(s + t) % a];
			if (jg(e.words(n), e.context).trimStart().startsWith(i)) return n;
		}
		return null;
	}
};
function pT(e) {
	return j(e) || e.metaKey || Array.from(e.key).length !== 1 || !/\S/u.test(e.key) || (e.ctrlKey || e.altKey) && !e.getModifierState("AltGraph") ? null : e.key;
}
//#endregion
//#region src/interactions/select-interaction-engine.ts
var mT = "data-ui-select-value", hT = "data-ui-select-placement", gT = "ui-select--open", _T = "ui-select__trigger-content", vT = "data-ui-select-content", yT = "ui-select__placeholder", bT = "ui-input__affix-icon--prefix", xT = "ui-select__popup", ST = "ui-select__list", CT = "ui-select__option", wT = "ui-select__value-input", TT = "data-ui-select-clear", ET = "ui-select--clearable", DT = "ui-search", OT = "ui-search__input", kT = "data-ui-active", AT = "data-ui-list-keyboard", jT = /* @__PURE__ */ new Set([
	"ArrowDown",
	"ArrowUp",
	"Home",
	"End",
	"PageDown",
	"PageUp"
]), MT = "ui-multi-select", NT = "ui-multi-select__chips", PT = "ui-multi-select__chip", FT = "ui-multi-select__chip-label", IT = "ui-multi-select__chip-remove", LT = "ui-badge-select", RT = "ui-text__badge", zT = "ui-badge", BT = "ui-badge__icon", VT = "ui-badge__text", HT = "ui-badge-style--info ui-text-type--overline", UT = "ui-text-type--overline", WT = "data-ui-select-chip", GT = "data-ui-select-chips", KT = "data-ui-select-max", qT = "data-ui-select-free-text", JT = "ui-multi-select__entry", YT = "data-ui-select-tag-entry", XT = [
	mT,
	li,
	KT
], ZT = ["class", b], QT = [...ZT, "style"];
function $T(e) {
	return e === null || A(e) || O(e);
}
function eE(e) {
	return e.classList.contains(MT);
}
function tE(e) {
	return e.classList.contains(DT);
}
function nE(e) {
	return tE(e) ? e.querySelector(`.${OT}`) : null;
}
function rE(e) {
	return e.hasAttribute(qT) ? e.querySelector(`:scope > .${Ai} .${JT}`) : null;
}
function iE(e) {
	return nE(e) ?? rE(e);
}
function aE(e) {
	return rE(e) ?? e.querySelector(".ui-select__trigger");
}
function oE(e) {
	let t = e.target instanceof HTMLInputElement && e.target.classList.contains(JT) ? e.target : null, n = t?.closest(".ui-select") ?? null;
	return t === null || n === null ? null : {
		entry: t,
		select: n
	};
}
function sE(e) {
	return ld(e, `.${xT} .${CT}`, `.${Ii}`);
}
function cE(e) {
	let t = sE(e).filter((e) => !k(e));
	return t.find((e) => e === document.activeElement) ?? t.find((e) => e.hasAttribute(kT)) ?? null;
}
function lE(e) {
	for (let t of ld(e, `.${ST}`, `.${Ii}`)) {
		let e = t.querySelector(`:scope > .${CT}[${kT}]:not([${ni}])`) !== null;
		t.hasAttribute(AT) !== e && t.toggleAttribute(AT, e);
	}
}
function uE(e) {
	return e === null ? null : Fg(e);
}
function dE(e) {
	for (let t of [e, ...e.querySelectorAll("*")]) {
		t.removeAttribute(y), t.removeAttribute(b), t.removeAttribute(ae), t.removeAttribute(ie);
		for (let e of t.getAttributeNames()) e.startsWith("data-ui-bind-") && t.removeAttribute(e);
	}
}
var fE = class {
	root;
	popups = new y_({
		show: ({ owner: e }) => e.classList.add(gT),
		hide: ({ owner: e }) => {
			e.classList.remove(gT), this.markActive(e, null);
			let t = e.querySelector(`.${xT}`);
			t !== null && (t.style.minHeight = "");
		},
		closesOnTab: !0,
		sheetOnPhone: ({ owner: e }) => iE(e) === null
	});
	typeAhead = new fT();
	drawnKeys = /* @__PURE__ */ new WeakMap();
	validation;
	refusedEntries = /* @__PURE__ */ new WeakSet();
	optionWatch;
	watched = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation;
		let t = (e) => {
			let t = /* @__PURE__ */ new Set();
			for (let n of e) Zh(n) || kE(n, t);
			for (let e of t) this.sync(e);
		};
		this.optionWatch = this.root instanceof Node ? new MutationObserver(t) : null, this.root instanceof Node && new MutationObserver(t).observe(this.root, {
			attributes: !0,
			attributeFilter: XT,
			childList: !0,
			subtree: !0
		});
		for (let e of this.root.querySelectorAll(`.${Ii}`)) this.sync(e);
		this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && (e.target.closest(`[${TT}], .${IT}`) !== null || vE(e.target)) && e.preventDefault();
		}, !0), window.addEventListener("input", (e) => this.handleEntryEdit(e), !0), window.addEventListener("compositionend", (e) => this.handleEntryEdit(e), !0), window.addEventListener("change", (e) => this.holdEntryDraft(e), !0), window.addEventListener("keydown", (e) => this.handleEntryEscape(e), !0), this.root.addEventListener("paste", (e) => this.handleEntryPaste(e), !0);
	}
	handleEntryEdit(e) {
		let t = this.holdEntryDraft(e);
		if (t === null || e.isComposing === !0) return;
		let { entry: n, select: r } = t;
		if ($T(r)) return;
		this.releaseRefusal(r);
		let i = sd(n.value);
		i.tags.length > 0 ? this.enterTyped(r, n, i.tags, i.rest) : this.suggest(r, n);
	}
	holdEntryDraft(e) {
		let t = oE(e);
		return t === null || this.root instanceof Node && !this.root.contains(t.select) ? null : (e.stopImmediatePropagation(), t);
	}
	handleEntryEscape(e) {
		let t = e instanceof KeyboardEvent && e.key === "Escape" && !e.defaultPrevented && !j(e) ? oE(e) : null;
		t !== null && this.openSelect === t.select && t.select.getAttribute(YT) === "first-suggestion" && sE(t.select).some((e) => e.hasAttribute(kT)) && (e.preventDefault(), this.markActive(t.select, null));
	}
	handleEntryPaste(e) {
		let t = oE(e), n = e.clipboardData?.getData("text") ?? "";
		if (t === null || $T(t.select) || !ad(n)) return;
		let { entry: r, select: i } = t, a = r.selectionStart ?? r.value.length, o = r.selectionEnd ?? a;
		e.preventDefault(), this.releaseRefusal(i), this.enterTyped(i, r, od(r.value.slice(0, a) + n + r.value.slice(o)), "");
	}
	enterTyped(e, t, n, r) {
		let i = $u(e.getAttribute(li)), a = ed(e.getAttribute(KT)), o = cd(i, n.map((t) => ({
			text: t,
			key: yE(e, t) ?? t
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
		oT(t);
		let n = t.value.trim().length > 0, r = n ? mE(e) : [], i = r.find((e) => e.getAttribute("aria-selected") !== "true") ?? null;
		this.openSelect === e ? r.length > 0 || !n ? this.popups.reposition(e) : this.close() : r.length > 0 && this.toggle(e, !0), this.openSelect === e && e.getAttribute(YT) === "first-suggestion" && (this.markActive(e, i), i !== null && gE(e, i));
	}
	get openSelect() {
		return this.popups.current;
	}
	sync(e) {
		if (this.watchOptions(e), lE(e), eE(e)) {
			this.syncMultiple(e);
			return;
		}
		let t = e.getAttribute(mT);
		this.decorateOptions(e);
		let n = t === null ? null : sE(e).find((e) => e.getAttribute("data-ui-key") === t) ?? null, r = this.renderTriggerContent(e, n, t), i = e.querySelector(`.${yT}`);
		i !== null && (i.style.display = r ? "none" : "");
		for (let n of sE(e)) n.setAttribute("aria-selected", t !== null && n.dataset.uiKey === t ? "true" : "false");
		let a = e.querySelector(`.${wT}`);
		a !== null && a.value !== (t ?? "") && (a.value = t ?? ""), lT(e);
	}
	watchOptions(e) {
		if (this.optionWatch === null || this.watched.has(e)) return;
		this.watched.add(e);
		let t = e.classList.contains(LT) ? QT : ZT;
		this.optionWatch.observe(e, {
			attributes: !0,
			attributeFilter: t,
			characterData: !0,
			subtree: !0
		});
	}
	syncMultiple(e) {
		let t = $u(e.getAttribute(li)), n = new Set(t), r = td(t, ed(e.getAttribute(KT)));
		this.decorateOptions(e, (e) => r && !n.has(e.dataset.uiKey ?? ""));
		let i = sE(e), a = new Map(i.map((e) => [e.dataset.uiKey ?? "", e])), o = rE(e), s = o === null ? t.filter((e) => a.has(e)) : t, c = e.classList.contains(LT);
		SE(e, s.map((e) => {
			let t = a.get(e) ?? null, n = c ? bE(t) : void 0;
			return {
				key: e,
				label: xE(t, e, n ?? null),
				badge: n
			};
		})), o !== null && o.readOnly !== $T(e) && (o.readOnly = $T(e));
		let l = e.querySelector(`.${yT}`);
		l !== null && (l.style.display = s.length > 0 ? "none" : "");
		for (let e of i) e.setAttribute("aria-selected", n.has(e.dataset.uiKey ?? "") ? "true" : "false");
		let u = e.querySelector(`.${wT}`), d = JSON.stringify(t);
		u !== null && u.getAttribute("data-ui-selected-keys") !== d && u.setAttribute(li, d), lT(e);
	}
	renderTriggerContent(e, t, n) {
		let r = e.querySelector(`.${Ai}`);
		if (r === null) return t !== null;
		let i = r.querySelector(`:scope > .${_T}`), a = i?.getAttribute(vT) ?? null;
		if (i !== null && a !== null && (i.removeAttribute(vT), this.drawnKeys.set(e, a)), t === null) return i !== null && n !== null && tE(e) && this.drawnKeys.get(e) === n ? !0 : (i?.remove(), this.drawnKeys.delete(e), !1);
		let o = t.getAttribute(b);
		if (o === null ? this.drawnKeys.delete(e) : this.drawnKeys.set(e, o), i !== null && o !== null && a === o) return !0;
		if (i === null) {
			i = document.createElement("span"), i.className = _T;
			let e = r.querySelector(`:scope > .${bT}`);
			e === null ? r.prepend(i) : e.after(i);
		}
		i.style.display = "inline-flex";
		let s = t.cloneNode(!0);
		return dE(s), eg(s), i.replaceChildren(...s.childNodes), !0;
	}
	decorateOptions(e, t = () => !1) {
		for (let n of sE(e)) {
			n.hasAttribute("role") || n.setAttribute("role", "option");
			let e = k(n), r = e || t(n) ? "true" : "false";
			n.getAttribute("aria-disabled") !== r && n.setAttribute("aria-disabled", r), (e ? n.tabIndex !== -1 : !n.hasAttribute("tabindex")) && (n.tabIndex = -1);
		}
	}
	handlePointerMove(e) {
		let t = this.openSelect, n = t === null || !(e.target instanceof Element) ? null : e.target.closest(`.${CT}`);
		t === null || n === null || n.hasAttribute(kT) || k(n) || O(n) || n.closest(".ui-select") !== t || (iE(t) === null && (N(sE(t).filter((e) => !k(e)), n), mp(n)), this.markActive(t, n, !0));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${IT}`);
		if (t !== null) {
			let n = t.closest(`.${Ii}`);
			n !== null && (e.preventDefault(), e.stopPropagation(), $T(n) || this.removeChosen(n, t.closest(`.${PT}`)?.getAttribute(WT) ?? null));
			return;
		}
		let n = e.target.closest(`[${TT}]`);
		if (n !== null) {
			let t = n.closest(`.${Ii}`);
			t !== null && (e.preventDefault(), e.stopPropagation(), $T(t) || (this.clearValue(t), pE(t)));
			return;
		}
		let r = e.target.closest(`.${Ai}`);
		if (r !== null) {
			let t = r.closest(`.${Ii}`);
			if ($T(t)) return;
			e.preventDefault();
			let n = t === null ? null : rE(t);
			t !== null && n !== null ? this.pressEntryBox(t, n, e.target === n) : this.toggle(t);
			return;
		}
		let i = e.target.closest(`.${CT}`);
		if (i === null) return;
		let a = i.closest(`.${Ii}`);
		a !== null && this.choose(a, i);
	}
	pressEntryBox(e, t, n) {
		document.activeElement !== t && t.focus(), !(sE(e).length === 0 || n && this.openSelect === e) && this.toggle(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || j(e) || (this.openSelect !== null && lE(this.openSelect), this.handleEntryKey(e) || this.handleChipKey(e)) || this.openSelect !== null && e.target instanceof Node && this.openSelect.contains(e.target) && this.handleOpenListKey(e, this.openSelect) || this.handleClearKey(e) || (e.key === "ArrowDown" || e.key === "ArrowUp") && M(e, { alt: e.key === "ArrowDown" }) && this.handleClosedArrow(e) || this.handleTypeAhead(e) || this.handleMultipleTriggerKey(e) || e.key !== "Enter" && e.key !== " " || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${CT}`) ?? this.markedOption(e);
		if (t === null) return;
		let n = t.closest(`.${Ii}`);
		n !== null && (e.preventDefault(), this.choose(n, t));
	}
	handleOpenListKey(e, t) {
		if (e.key === "ArrowUp" && e.altKey && M(e, { alt: !0 })) {
			e.preventDefault();
			let n = cE(t);
			return n !== null && !eE(t) ? this.choose(t, n) : this.close(), !0;
		}
		return !jT.has(e.key) || !M(e) || (e.key === "Home" || e.key === "End") && Eu(e.target) ? !1 : (e.preventDefault(), this.moveCurrent(t, e.key), !0);
	}
	handleEntryKey(e) {
		let t = oE(e);
		if (t === null) return !1;
		let { entry: n, select: r } = t;
		if ($T(r)) return !1;
		switch (e.key) {
			case "ArrowLeft": return n.selectionStart === 0 && n.selectionEnd === 0 && this.focusChip(e, r, -1);
			case "ArrowDown":
			case "ArrowUp": return e.preventDefault(), this.openSelect === r ? this.moveCurrent(r, e.key) : this.openSuggestions(r, n, e.key === "ArrowDown"), !0;
			case "Enter": {
				let t = this.openSelect === r ? mE(r).find((e) => e.hasAttribute(kT)) : void 0;
				return t === void 0 ? (e.preventDefault(), n.value.trim().length === 0 ? (this.pressEntryBox(r, n, !1), !0) : (this.releaseRefusal(r), this.enterTyped(r, n, od(n.value), ""), !0)) : (e.preventDefault(), this.choose(r, t), !0);
			}
			case ",": return e.preventDefault(), this.releaseRefusal(r), this.enterTyped(r, n, od(n.value), ""), !0;
			case "Backspace": {
				if (n.value.length > 0) return !1;
				let t = r.querySelectorAll(`.${NT} > .${PT}`);
				return t.length !== 0 && (e.preventDefault(), this.removeChosen(r, t[t.length - 1].getAttribute(WT)), !0);
			}
			default: return !1;
		}
	}
	focusChip(e, t, n, r = null) {
		let i = _E(t);
		if (i.length === 0) return !1;
		let a = i[(r === null ? i.length : i.findIndex((e) => e.contains(r))) + n]?.querySelector(`.${IT}`) ?? (n === 1 ? aE(t) : null);
		return e.preventDefault(), a === null || (a.focus(), a instanceof HTMLInputElement && a.setSelectionRange(0, 0)), !0;
	}
	openSuggestions(e, t, n) {
		oT(t);
		let r = mE(e), i = (n ? r[0] : r[r.length - 1]) ?? null;
		i !== null && this.toggle(e, !0, i);
	}
	handleChipKey(e) {
		let t = e.target instanceof HTMLElement && e.target.classList.contains(IT) ? e.target : null, n = t?.closest(".ui-select") ?? null;
		if (t === null || n === null || !eE(n)) return !1;
		switch (e.key) {
			case "ArrowLeft": return this.focusChip(e, n, -1, t);
			case "ArrowRight": return this.focusChip(e, n, 1, t);
			case "Backspace":
			case "Delete": {
				if (e.preventDefault(), $T(n)) return !0;
				let r = _E(n), i = r.findIndex((e) => e.contains(t)), a = (r[i + 1] ?? r[i - 1])?.getAttribute(WT) ?? null;
				this.removeChosen(n, r[i]?.getAttribute(WT) ?? null);
				let o = a === null ? null : _E(n).find((e) => e.getAttribute(WT) === a) ?? null;
				return o !== null && o.querySelector(`.${IT}`)?.focus(), !0;
			}
			default: return !1;
		}
	}
	handleClosedArrow(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || t === this.openSelect || $T(t)) return !1;
		e.preventDefault();
		let n = nE(t);
		n !== null && oT(n);
		let r = mE(t), i = r.find((e) => e.getAttribute("aria-selected") === "true") ?? (e.key === "ArrowDown" ? r[0] : r[r.length - 1]) ?? null;
		return this.toggle(t, !1, i), !0;
	}
	handleTypeAhead(e) {
		let t = pT(e), n = e.target instanceof HTMLElement ? e.target : null;
		if (t === null || n === null || !(n.classList.contains("ui-select__trigger") || n.classList.contains(CT))) return !1;
		let r = n.closest(`.${Ii}`), i = r !== null && r === this.openSelect;
		if (r === null || $T(r) || !i && !n.classList.contains("ui-select__trigger")) return !1;
		let a = nE(r);
		if (a !== null) return !i && (e.preventDefault(), this.typeIntoSearch(r, a, t), !0);
		e.preventDefault();
		let o = mE(r), s = i ? o.find((e) => e === document.activeElement) ?? o.find((e) => e.hasAttribute(kT)) ?? null : o.find((e) => e.getAttribute("aria-selected") === "true") ?? null, c = this.typeAhead.next({
			owner: r,
			character: t,
			entries: o,
			current: s,
			words: (e) => uE(e) ?? "",
			context: r
		});
		return c === null ? !0 : i ? (N(sE(r).filter((e) => !k(e)), c), gE(r, c), R(c), this.markActive(r, c), !0) : (this.toggle(r, !1, c), !0);
	}
	typeIntoSearch(e, t, n) {
		this.toggle(e, !0), this.openSelect === e && (t.value = n, t.setSelectionRange(n.length, n.length), t.dispatchEvent(new Event("input", { bubbles: !0 })));
	}
	handleClearKey(e) {
		if (e.key !== "Delete" && e.key !== "Backspace" || !M(e) || !(e.target instanceof HTMLElement)) return !1;
		let t = e.target.closest(`.${Ii}`);
		return t === null || t === this.openSelect || !t.classList.contains(ET) || $T(t) || e.target !== aE(t) || e.key === "Backspace" && eE(t) || (rE(t)?.value ?? "") !== "" ? !1 : (e.preventDefault(), this.clearValue(t), !0);
	}
	handleMultipleTriggerKey(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || !eE(t) || $T(t)) return !1;
		switch (e.key) {
			case "Enter":
			case " ": return e.preventDefault(), this.toggle(t), !0;
			case "ArrowLeft": return this.focusChip(e, t, -1);
			case "Backspace": {
				let n = t.querySelectorAll(`.${NT} > .${PT}`);
				return n.length !== 0 && (e.preventDefault(), this.removeChosen(t, n[n.length - 1].getAttribute(WT)), !0);
			}
			default: return !1;
		}
	}
	markedOption(e) {
		let t = this.openSelect;
		return e.key !== "Enter" || t === null || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(OT) || !t.contains(e.target) ? null : mE(t).find((e) => e.hasAttribute(kT)) ?? null;
	}
	toggle(e, t = !1, n = null) {
		if (e === null) return;
		if (this.openSelect === e) {
			this.close();
			return;
		}
		this.close();
		let r = iE(e), i = rE(e);
		r !== null && !t && oT(r), lT(e);
		let a = e.querySelector(`.${Ai}`), o = e.querySelector(`.${xT}`), s = e.querySelector(`.${ST}`) ?? o, c = e.getAttribute(hT);
		if (a === null || o === null || s === null) return;
		let l = Zi(s, "ui-select-list");
		i === null && a.setAttribute("aria-controls", l), r?.setAttribute("aria-controls", l), this.popups.open({
			owner: e,
			popup: o,
			anchor: a,
			placement: {
				placement: c !== null && Xm(c) ? c : "bottom-start",
				minAnchorWidth: !0
			},
			openers: i === null ? r === null ? [a] : [a, r] : [i],
			returnFocus: () => i ?? a
		}) && (r === null ? this.initializeFocus(e, n) : (i === null ? this.initializeSearch(e, r, n, t) : this.initializeEntry(e, n), AE(o)));
	}
	close() {
		this.popups.close();
	}
	initializeFocus(e, t) {
		let n = mE(e);
		if (n.length === 0) return;
		let r = t ?? n.find((e) => e.getAttribute("aria-selected") === "true");
		if (r === void 0 && sp()) {
			N(n, null), this.markActive(e, null), pE(e);
			return;
		}
		let i = r ?? n[0];
		N(n, i), this.markActive(e, i, sp()), gE(e, i), R(i);
	}
	initializeSearch(e, t, n, r) {
		let i = sE(e), a = mE(e), o = (r ? void 0 : n ?? a.find((e) => e.getAttribute("aria-selected") === "true")) ?? (r || sp() ? null : a[0] ?? null);
		N(i, null), this.markActive(e, o, sp()), o !== null && gE(e, o), !cp() && (R(t), t.select());
	}
	initializeEntry(e, t) {
		N(sE(e), null), this.markActive(e, t), t !== null && gE(e, t);
	}
	moveCurrent(e, t) {
		let n = sE(e).filter((e) => !k(e)), r = Df(t, n, cE(e), "vertical");
		r !== null && (iE(e) === null ? Wu(n, r) : gE(e, r), this.markActive(e, r));
	}
	markActive(e, t, n = !1) {
		for (let r of sE(e)) r === t ? r.setAttribute(kT, "") : r.hasAttribute(kT) && r.removeAttribute(kT), lp(r, r === t && n);
		lE(e);
		let r = iE(e);
		r !== null && (t === null ? r.removeAttribute("aria-activedescendant") : r.setAttribute("aria-activedescendant", Zi(t, "ui-select-option")));
	}
	choose(e, t) {
		let n = t.dataset.uiKey;
		if (n === void 0 || k(t) || $T(e)) return;
		if (eE(e)) {
			let r = nd($u(e.getAttribute(li)), n, ed(e.getAttribute(KT)));
			this.markActive(e, t, sp()), r !== null && this.writeChosen(e, r);
			let i = rE(e);
			i !== null && i.value.length > 0 && (i.value = "", this.releaseRefusal(e), this.suggest(e, i));
			return;
		}
		if (e.getAttribute(mT) === n) {
			this.close();
			return;
		}
		e.setAttribute(mT, n), this.sync(e);
		let r = e.querySelector(`.${wT}`);
		r !== null && (r.value = n, r.dispatchEvent(new Event("change", { bubbles: !0 }))), this.close();
	}
	removeChosen(e, t) {
		let n = t === null ? null : rd($u(e.getAttribute(li)), t);
		if (n === null) return;
		let r = document.activeElement instanceof HTMLElement && document.activeElement.closest(`.${PT}`) !== null;
		this.writeChosen(e, n), (r || document.activeElement === document.body) && aE(e)?.focus();
	}
	writeChosen(e, t) {
		t.length === 0 ? e.removeAttribute(li) : e.setAttribute(li, JSON.stringify(t)), this.sync(e), this.popups.reposition(e), e.querySelector(`.${wT}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	clearValue(e) {
		if (eE(e)) {
			e.hasAttribute("data-ui-selected-keys") && this.writeChosen(e, []);
			return;
		}
		if (!e.hasAttribute(mT)) return;
		e.removeAttribute(mT), this.sync(e);
		let t = e.querySelector(`.${wT}`);
		t !== null && (t.value = "", t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
};
function pE(e) {
	let t = e.querySelector(`.${Ai}`), n = aE(e);
	t !== null && n !== null && !t.contains(document.activeElement) && R(n);
}
function mE(e) {
	return sE(e).filter((e) => hE(e) && !k(e) && !O(e));
}
function hE(e) {
	return e.style.display !== "none" && !e.classList.contains("ui-hidden");
}
function gE(e, t) {
	let n = e.querySelector(`.${ST}`);
	if (n === null) return;
	let r = n.getBoundingClientRect(), i = t.getBoundingClientRect(), a = getComputedStyle(n), o = r.top + (Number.parseFloat(a.borderTopWidth) || 0), s = o + (Number.parseFloat(a.paddingTop) || 0), c = o + n.clientHeight - (Number.parseFloat(a.paddingBottom) || 0);
	i.top < s ? n.scrollTop -= s - i.top : i.bottom > c && (n.scrollTop += i.bottom - c);
}
function _E(e) {
	return [...e.querySelectorAll(`.${NT} > .${PT}`)];
}
function vE(e) {
	let t = e.closest(".ui-select__trigger")?.closest(".ui-select") ?? null;
	return t !== null && rE(t) !== null && !e.classList.contains(JT);
}
function yE(e, t) {
	let n = t.trim().toLocaleLowerCase();
	for (let t of sE(e)) {
		let e = t.dataset.uiKey;
		if (e !== void 0 && !k(t) && (e.toLocaleLowerCase() === n || uE(t)?.trim().toLocaleLowerCase() === n)) return e;
	}
	return null;
}
function bE(e) {
	return e?.querySelector(`.${RT}`) ?? null;
}
function xE(e, t, n = null) {
	let r = ((n?.hasAttribute("data-ui-badge-text") === !0 ? n.querySelector(`.${VT}`)?.textContent ?? null : null) ?? uE(e))?.trim() ?? "";
	return r.length > 0 ? r : t;
}
function SE(e, t) {
	let n = e.querySelector(`.${NT}`);
	if (n === null) return;
	n.hasAttribute(GT) !== t.length > 0 && n.toggleAttribute(GT, t.length > 0);
	let r = [...n.querySelectorAll(`:scope > .${PT}`)];
	if (!(r.length === t.length && r.every((e, n) => e.getAttribute(WT) === t[n].key && e.querySelector(`.${FT}`)?.textContent === t[n].label && (t[n].badge === void 0 || DE(e) === DE(t[n].badge ?? EE()))))) {
		for (let e of r) e.remove();
		n.prepend(...t.map(CE));
	}
}
function CE(e) {
	let t = document.createElement("button"), n = e.badge === void 0 ? wE(e.label) : TE(e.label, e.badge);
	return n.classList.add(PT), n.setAttribute(WT, e.key), t.className = IT, t.type = "button", t.tabIndex = -1, D.write(t, "aria-label", "ui.select.remove", { label: e.label }), n.append(t), n;
}
function wE(e) {
	let t = document.createElement("span"), n = document.createElement("span");
	return n.className = FT, n.textContent = e, t.append(n), t;
}
function TE(e, t) {
	let n = t === null ? EE() : t.cloneNode(!0);
	dE(n), n.classList.remove(RT);
	let r = n.querySelector(`:scope > .${VT}`);
	return r?.classList.add(FT), r !== null && !n.hasAttribute("data-ui-badge-text") && kw(n, e), n;
}
function EE() {
	let e = document.createElement("span"), t = document.createElement("span"), n = document.createElement("span");
	return e.className = `${zT} ${HT}`, t.className = `${BT} ui-icon`, n.className = `${VT} ${UT}`, e.append(t, n), e;
}
function DE(e) {
	let t = e.querySelector(`:scope > .${BT}`);
	return `${OE(e)}|${t === null ? "" : OE(t)}`;
}
function OE(e) {
	return `${[...e.classList].filter((e) => e !== PT && e !== RT).sort().join(" ")};${e.getAttribute("style") ?? ""};${e.hasAttribute(Ge)}`;
}
function kE(e, t) {
	if (e.type === "childList") {
		for (let n of e.addedNodes) if (n instanceof HTMLElement) {
			n.classList.contains("ui-select") && t.add(n);
			for (let e of n.querySelectorAll(`.${Ii}`)) t.add(e);
		}
	}
	if (e.type === "attributes" && (e.attributeName === mT || e.attributeName === "data-ui-selected-keys" || e.attributeName === KT)) {
		e.target instanceof HTMLElement && e.target.classList.contains("ui-select") && t.add(e.target);
		return;
	}
	let n = e.target instanceof HTMLElement ? e.target : e.target.parentElement;
	if (e.attributeName === "style" && n?.classList.contains(zT) !== !0) return;
	let r = n?.closest(`.${xT}`)?.closest(`.${Ii}`);
	r != null && t.add(r);
}
function AE(e) {
	e.dataset.uiPlacement?.startsWith("top") === !0 && (e.style.minHeight = `${e.offsetHeight}px`);
}
//#endregion
//#region src/interactions/commit-gate.ts
var jE = class {
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
		Eu(t) && this.root.contains(t) && (this.field = t, this.committed = t.value);
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
}, ME = "textarea.ui-text-area__field", NE = "data-ui-text-area-grow";
function PE() {
	return typeof CSS < "u" && CSS.supports("field-sizing", "content");
}
var FE = class {
	root;
	widths = /* @__PURE__ */ new WeakMap();
	observer;
	constructor(e = {}) {
		this.root = e.root ?? document, this.observer = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null, this.root.addEventListener("input", (e) => {
			e.target instanceof HTMLTextAreaElement && e.target.matches(ME) && this.fit(e.target);
		}, !0), this.fitAll(this.root.querySelectorAll(ME)), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.fitAll(za(e.components, ME));
		}), B(this.root, ME, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [NE]
		}, (e) => {
			this.fitAll(za(e, ME));
		});
	}
	fitAll(e) {
		for (let t of e) this.fit(t);
	}
	fit(e) {
		if (!e.hasAttribute(NE)) {
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
function IE(e) {
	let t = LE(e.getAttribute("min"), 0), n = LE(e.getAttribute("max"), 100), r = e.getAttribute("step");
	return {
		min: t,
		max: Math.max(t, n),
		step: r === "any" ? 0 : Math.max(0, LE(r, 1))
	};
}
function LE(e, t) {
	let n = e === null || e.trim().length === 0 ? NaN : Number(e);
	return Number.isFinite(n) ? n : t;
}
function RE(e, t, n, r) {
	let i = (n ? e.height : e.width) - r;
	if (i <= 0) return 0;
	let a = n ? e.top + e.height - t.y : t.x - e.left;
	return Math.min(1, Math.max(0, (a - r / 2) / i));
}
function zE(e, t) {
	return BE(t.min + e * (t.max - t.min), t);
}
function BE(e, t) {
	let n = Math.min(t.max, Math.max(t.min, e));
	if (t.step <= 0) return n;
	let r = Math.round((n - t.min) / t.step);
	return t.min + r * t.step > t.max && r--, VE(t.min + r * t.step, t);
}
function VE(e, t) {
	return Number(e.toFixed(Math.min(20, Math.max(HE(t.step), HE(t.min)))));
}
function HE(e) {
	let t = String(e), n = t.indexOf("e-");
	if (n >= 0) return Number(t.slice(n + 2));
	let r = t.indexOf(".");
	return r < 0 ? 0 : t.length - r - 1;
}
function UE(e, t, n) {
	return t === n ? e < t ? "start" : e > t ? "end" : null : Math.abs(e - t) < Math.abs(e - n) ? "start" : "end";
}
function WE(e, t, n, r, i) {
	let a = Math.max(0, r);
	if (t === "start" ? e <= n - a : e >= n + a) return e;
	let o = t === "start" ? n - a : n + a;
	if (i.step <= 0) return GE(o, i);
	let s = (o - i.min) / i.step;
	return GE(VE(i.min + (t === "start" ? Math.floor(s + 1e-9) : Math.ceil(s - 1e-9)) * i.step, i), i);
}
function GE(e, t) {
	return Math.min(t.max, Math.max(t.min, e));
}
//#endregion
//#region src/interactions/range-value-engine.ts
var KE = "ui-slider__input", qE = "ui-slider__input--end", JE = "ui-slider__input--held", YE = "ui-slider__value", XE = "ui-slider__bubble", ZE = "ui-slider__track", QE = "ui-slider__thumb-anchor", $E = "ui-slider", eD = "ui-slider--range", tD = "ui-orientation--vertical", nD = "--ui-slider-fraction", rD = "--ui-slider-end-fraction", iD = 6, aD = "Value", oD = "EndValue", sD = /* @__PURE__ */ new Set([
	"Value",
	"EndValue",
	"Min",
	"Max"
]), cD = class {
	options;
	root;
	settled = /* @__PURE__ */ new WeakMap();
	pressedFrom = /* @__PURE__ */ new WeakMap();
	cancelled = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("pointerdown", (e) => {
			this.notePress(e.target), this.placeBubble(e.target);
		}, !0), this.root.addEventListener("pointercancel", (e) => this.takeBackPress(e.target), !0), (this.root === document ? window : this.root).addEventListener("change", (e) => this.refuseCancelledChange(e), !0), this.root.addEventListener("focusin", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusout", (e) => this.releaseBubble(e.target), !0), new Ig({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${eD} .${ZE}`),
			begin: (e, t) => this.beginBandDrag(e, t),
			move: (e, t, n) => this.moveBandDrag(e, n),
			end: (e, t) => this.endBandDrag(t),
			cancel: (e, t) => this.putBandBack(t),
			takenBack: (e, t) => this.putBandBack(t)
		}), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			if (sD.has(e.propertyName)) for (let t of za(e.components, `.${KE}`)) this.settled.set(t, t.value), this.writeReadings(t), e.propertyName === (uD(t) ? oD : aD) && this.reportClamped(t, e.value);
		});
	}
	notePress(e) {
		let t = lD(e);
		t !== null && (this.cancelled.delete(t), this.pressedFrom.set(t, t.value));
	}
	takeBackPress(e) {
		let t = lD(e), n = t === null ? void 0 : this.pressedFrom.get(t);
		t !== null && n !== void 0 && (this.pressedFrom.delete(t), t.value !== n && (t.value = n, this.cancelled.add(t), this.settled.set(t, n), this.writeReadings(t)));
	}
	refuseCancelledChange(e) {
		let t = lD(e.target);
		t !== null && this.cancelled.has(t) && (this.cancelled.delete(t), e.stopImmediatePropagation());
	}
	reportClamped(e, t) {
		t == null || e.value === String(t) || pD(e) || e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(KE)) return;
		let t = e.target;
		if (this.cancelled.delete(t), pD(t)) {
			t.value = this.settled.get(t) ?? t.defaultValue;
			return;
		}
		let n = dD(t);
		if (n !== null) {
			let e = fD(t, Number(t.value), n);
			e !== t.value && (t.value = e, e === (this.settled.get(t) ?? t.defaultValue) && this.cancelled.add(t));
		}
		this.settled.set(t, t.value), this.writeReadings(t);
	}
	beginBandDrag(e, t) {
		let n = e.querySelector(`.${KE}:not(.${qE})`), r = e.querySelector(`.${qE}`);
		if (n === null || r === null) return null;
		let i = zE(RE(e.getBoundingClientRect(), t, mD(e), hD(e)), IE(n)), a = UE(i, Number(n.value), Number(r.value));
		if (pD(n)) return R(a === "end" ? r : n), null;
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
		let n = e.start.closest(`.${ZE}`);
		if (n === null) return;
		let r = zE(RE(n.getBoundingClientRect(), t, mD(n), hD(n)), IE(e.start));
		if (e.held === null) {
			if (r === e.pressed) return;
			this.holdHandle(e, r < e.pressed ? "start" : "end", r);
		} else this.moveHandle(e.held, r);
	}
	holdHandle(e, t, n) {
		let r = t === "start" ? e.start : e.end;
		e.held = r, r.classList.add(JE), R(r), this.moveHandle(r, n), this.placeBubble(r);
	}
	moveHandle(e, t) {
		let n = dD(e), r = n === null ? String(t) : fD(e, t, n);
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
		e.held?.classList.remove(JE), e.held !== null && this.writeReadings(e.held);
	}
	placeBubble(e) {
		let t = gD(e);
		t !== null && sh(t.anchor, t.bubble, {
			placement: t.vertical ? "left" : "top",
			gap: iD
		});
	}
	releaseBubble(e) {
		yh(gD(e)?.bubble);
	}
	writeReadings(e) {
		let t = uD(e), n = e.closest(`.${ZE}`)?.parentElement ?? e.parentElement, r = t ? `.${YE}--end, .${XE}--end` : `.${YE}:not(.${YE}--end), .${XE}:not(.${XE}--end)`;
		for (let t of n?.querySelectorAll(r) ?? []) t.textContent = e.value;
		e.closest(`.${ZE}`)?.style.setProperty(t ? rD : nD, String(_D(e))), e.matches(`:active, :focus-visible, .${JE}`) ? this.placeBubble(e) : this.releaseBubble(e);
	}
};
function lD(e) {
	return e instanceof HTMLInputElement && e.classList.contains(KE) ? e : null;
}
function uD(e) {
	return e.classList.contains(qE);
}
function dD(e) {
	return e.closest(`.${eD} .${ZE}`)?.querySelector(uD(e) ? `.${KE}:not(.${qE})` : `.${qE}`) ?? null;
}
function fD(e, t, n) {
	let r = Number(e.closest(`.${$E}`)?.getAttribute("data-ui-slider-min-distance") ?? 0);
	return String(WE(t, uD(e) ? "end" : "start", Number(n.value), Number.isFinite(r) ? r : 0, IE(e)));
}
function pD(e) {
	return A(e) || O(e);
}
function mD(e) {
	return e.closest(`.${$E}`)?.classList.contains(tD) === !0;
}
function hD(e) {
	let t = e.querySelector(`.${QE}`)?.getBoundingClientRect();
	return t === void 0 ? 0 : mD(e) ? t.height : t.width;
}
function gD(e) {
	if (!(e instanceof Element) || !e.classList.contains(KE)) return null;
	let t = e.closest(`.${ZE}`), n = uD(e), r = t?.querySelector(n ? `.${XE}--end` : `.${XE}:not(.${XE}--end)`) ?? null, i = t?.querySelector(n ? `.${QE}--end` : `.${QE}:not(.${QE}--end)`) ?? null;
	return r === null || i === null ? null : {
		bubble: r,
		anchor: i,
		vertical: mD(e)
	};
}
function _D(e) {
	let { min: t, max: n } = IE(e), r = Number(e.value);
	return !Number.isFinite(r) || n <= t ? 0 : Math.min(1, Math.max(0, (r - t) / (n - t)));
}
//#endregion
//#region src/rendering/number-format.ts
var vD = {
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
}, yD = [
	"(n)",
	"-n",
	"- n",
	"n-",
	"n -"
], bD = [
	"$n",
	"n$",
	"$ n",
	"n $"
], xD = [
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
], SD = [
	"n %",
	"n%",
	"%n",
	"% n"
], CD = [
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
], wD = /[1-9]/;
function TD(e) {
	let t = e.closest("[data-ui-number-culture]")?.getAttribute("data-ui-number-culture") ?? null;
	if (t === null) return vD;
	try {
		return {
			...vD,
			...JSON.parse(t)
		};
	} catch {
		return vD;
	}
}
function ED(e, t, n) {
	if (!Number.isFinite(e)) return String(e);
	let r = OD(t);
	if (r === null) return kD(e, n);
	let i = Math.abs(e);
	switch (r.kind) {
		case "N": {
			let t = AD(i, 0, r.precision ?? n.decimalDigits, n.groupSizes, n.groupSeparator, n.decimalSeparator);
			return DD(e, t) ? FD(yD[n.negativePattern] ?? "-n", t, "", n.negativeSign) : t;
		}
		case "F": {
			let t = AD(i, 0, r.precision ?? n.decimalDigits, [], "", n.decimalSeparator);
			return DD(e, t) ? n.negativeSign + t : t;
		}
		case "D": {
			let t = jD(i, 0, 0).integer.padStart(r.precision ?? 1, "0");
			return DD(e, t) ? n.negativeSign + t : t;
		}
		case "C": {
			let t = AD(i, 0, r.precision ?? n.currencyDecimalDigits, n.currencyGroupSizes, n.currencyGroupSeparator, n.currencyDecimalSeparator);
			return FD(DD(e, t) ? xD[n.currencyNegativePattern] ?? "-$n" : bD[n.currencyPositivePattern] ?? "$n", t, n.currencySymbol, n.negativeSign);
		}
		case "P": {
			let t = AD(i, 2, r.precision ?? n.percentDecimalDigits, n.percentGroupSizes, n.percentGroupSeparator, n.percentDecimalSeparator);
			return FD(DD(e, t) ? CD[n.percentNegativePattern] ?? "-n %" : SD[n.percentPositivePattern] ?? "n %", t, n.percentSymbol, n.negativeSign);
		}
		default: return kD(e, n);
	}
}
function DD(e, t) {
	return e < 0 && wD.test(t);
}
function OD(e) {
	if (e == null || e.trim().length === 0) return null;
	let t = /^([NFCPDnfcpd])(\d{0,2})$/.exec(e.trim());
	if (t === null) throw Error(`Number format '${e}' is outside the shared subset (N, F, C, P, D, with an optional precision).`);
	return {
		kind: t[1].toUpperCase(),
		precision: t[2].length === 0 ? null : Number(t[2])
	};
}
function kD(e, t) {
	let { integer: n, fraction: r } = MD(Math.abs(e), 0), i = r.length === 0 ? n : `${n}${t.decimalSeparator}${r}`;
	return e < 0 ? t.negativeSign + i : i;
}
function AD(e, t, n, r, i, a) {
	let { integer: o, fraction: s } = jD(e, t, n);
	return n === 0 ? PD(o, r, i) : `${PD(o, r, i)}${a}${s}`;
}
function jD(e, t, n) {
	let { integer: r, fraction: i } = MD(e, t), a = r + i.slice(0, n).padEnd(n, "0"), o = i.length > n && i[n] >= "5" ? ND(a) : a, s = o.length - n;
	return {
		integer: o.slice(0, s),
		fraction: o.slice(s)
	};
}
function MD(e, t) {
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
function ND(e) {
	let t = e.length - 1;
	for (; t >= 0 && e[t] === "9";) t--;
	let n = "0".repeat(e.length - 1 - t);
	return t < 0 ? `1${n}` : `${e.slice(0, t)}${String(Number(e[t]) + 1)}${n}`;
}
function PD(e, t, n) {
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
function FD(e, t, n, r) {
	let i = "";
	for (let a of e) i += a === "n" ? t : a === "$" || a === "%" ? n : a === "-" ? r : a;
	return i;
}
var ID = /^[\t\n\v\f\r ]*[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?[\t\n\v\f\r ]*$/;
function LD(e) {
	if (!ID.test(e)) return null;
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}
var RD = {
	readCulture: TD,
	format: ED,
	parseInvariant: LD
}, zD = /^-?(\d+(\.\d*)?|\.\d+)$/;
function BD(e, t, n) {
	if (!zD.test(e)) return e;
	let r = n.thousands === !1 ? qD(t) : t, i = Number(e), a = n.format?.trim() ?? "";
	if (a.length > 0) try {
		return ED(i, n.thousands === !0 ? VD(a) : a, r);
	} catch {}
	let o = e.includes(".") ? e.length - e.indexOf(".") - 1 : 0;
	return ED(i, `${n.thousands === !0 ? "N" : "F"}${Math.min(o, 99)}`, r);
}
function VD(e) {
	return /^[fF]\d{0,2}$/.test(e) ? `N${e.slice(1)}` : e;
}
function HD(e, t, n) {
	return zD.test(e) ? (KD(n) ? JD(e, 2) : e).replace(".", t.decimalSeparator) : e;
}
function UD(e, t, n) {
	let r = e.trim();
	if (r.length === 0) return "";
	let i = !1;
	r.startsWith("(") && r.endsWith(")") && (i = !0, r = r.slice(1, -1));
	let a = KD(n) || t.percentSymbol.length > 0 && r.includes(t.percentSymbol);
	for (let e of [t.currencySymbol, t.percentSymbol]) r = e.length === 0 ? r : r.split(e).join("");
	for (let e of /* @__PURE__ */ new Set([
		t.negativeSign,
		"-",
		"−"
	])) e.length > 0 && r.includes(e) && (i = !0, r = r.split(e).join(""));
	let o = t.decimalSeparator, [s, ...c] = o.length === 0 ? [r] : r.split(o);
	if (c.length > 1) return null;
	let l = s.replace(/[\s  ]/g, "").split(t.groupSeparator).join("").split(t.currencyGroupSeparator).join(""), u = c.length === 0 ? null : c[0].replace(/[\s  ]/g, ""), d = u === null ? l : `${l}.${u}`;
	if (!zD.test(d)) return null;
	let f = a ? JD(d, -2) : d;
	return i && Number(f) !== 0 ? `-${f}` : f;
}
function WD(e, t, n, r, i) {
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
function GD(e) {
	return e.includes(".") ? e.replace(/0+$/, "").replace(/\.$/, "") : e;
}
function KD(e) {
	return /^\s*[pP]\d{0,2}\s*$/.test(e ?? "");
}
function qD(e) {
	return {
		...e,
		groupSeparator: "",
		currencyGroupSeparator: "",
		percentGroupSeparator: ""
	};
}
function JD(e, t) {
	let n = e.startsWith("-"), r = n ? e.slice(1) : e, i = r.indexOf("."), a = r.replace(".", ""), o = (i < 0 ? r.length : i) + t, s = a;
	o <= 0 && (s = "0".repeat(1 - o) + s, o = 1), o > s.length && (s += "0".repeat(o - s.length));
	let c = s.slice(0, o).replace(/^0+(?=\d)/, ""), l = s.slice(o).replace(/0+$/, ""), u = l.length === 0 ? c : `${c}.${l}`;
	return n ? `-${u}` : u;
}
//#endregion
//#region src/interactions/number-input-engine.ts
var YD = "ui-number-input", XD = "ui-number-input__field", ZD = "data-ui-number-no-decimals", QD = "data-ui-number-no-negative", $D = "data-ui-number-thousands", eO = "data-ui-number-no-thousands", tO = "data-ui-number-trim-zeros", nO = "data-ui-number-step", rO = "data-ui-number-min", iO = "data-ui-number-max", aO = "data-ui-number-step-direction", oO = /* @__PURE__ */ new Map([
	["ArrowUp", 1],
	["ArrowDown", -1],
	["PageUp", 10],
	["PageDown", -10]
]), sO = class {
	options;
	root;
	values = /* @__PURE__ */ new WeakMap();
	shown = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("focus", (e) => this.handleFocus(e), !0), this.root.addEventListener("blur", (e) => this.handleBlur(e), !0), this.root.addEventListener("click", (e) => this.handleStepClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleStepKey(e), !0), window.addEventListener("change", (e) => this.handleChangeCapture(e), !0), window.addEventListener("change", (e) => this.handleChangeDone(e)), this.showAtRest(this.root.querySelectorAll(`.${XD}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.showAtRest(za(e.components, `.${XD}`));
		}), D.onChange(() => this.showAtRest(this.root.querySelectorAll(`.${XD}`)));
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
		let t = cO(e);
		if (t !== null) return this.keptValue(t) ?? pO(t) ?? t.value.trim();
	}
	show(e) {
		let t = this.values.get(e) ?? e.value, n = e.hasAttribute(tO) ? GD(t) : t, r = TD(e), i = e === document.activeElement ? HD(n, r, mO(e)) : dO(e, n, r);
		e.value = i, this.shown.set(e, i);
	}
	handleInput(e) {
		let t = cO(e.target);
		if (t === null) return;
		let n = !t.hasAttribute(ZD), r = !t.hasAttribute(QD), i = t.selectionStart ?? t.value.length, a = WD(t.value, i, TD(t), n, r);
		a.value !== t.value && (t.value = a.value, t.setSelectionRange(a.cursor, a.cursor));
	}
	handleFocus(e) {
		let t = cO(e.target);
		t !== null && (this.values.set(t, this.valueOf(t)), this.show(t));
	}
	handleBlur(e) {
		let t = cO(e.target);
		if (t === null) return;
		let n = this.showsOwnText(t) ? null : pO(t);
		if (n !== null && this.values.set(t, n), t.hasAttribute(tO) && !A(t) && !O(t)) {
			let e = this.values.get(t) ?? "", n = GD(e);
			n !== e && this.commit(t, n);
		}
		this.show(t);
	}
	handleChangeCapture(e) {
		let t = cO(e.target);
		if (t === null) return;
		let n = pO(t);
		n !== null && (this.values.set(t, n), t.value = n, this.shown.set(t, n));
	}
	handleChangeDone(e) {
		let t = cO(e.target);
		t !== null && t === document.activeElement && this.show(t);
	}
	commit(e, t) {
		this.values.set(e, t), e.value = HD(t, TD(e), mO(e)), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleStepClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[" + aO + "]");
		if (t === null) return;
		let n = t.closest(".ui-number-input__row")?.querySelector(`.${XD}`) ?? null;
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t.getAttribute(aO) === "down" ? -1 : 1));
	}
	handleStepKey(e) {
		let t = oO.get(e.key);
		if (t === void 0 || !M(e, { shift: !0 }) || e.defaultPrevented) return;
		let n = cO(e.target);
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t));
	}
	step(e, t) {
		let n = Number(e.getAttribute(nO) ?? "1"), r = (Number(this.showsOwnText(e) ? this.valueOf(e) : pO(e) ?? "0") || 0) + n * t, i = e.getAttribute(rO), a = e.getAttribute(iO);
		i !== null && (r = Math.max(r, Number(i))), a !== null && (r = Math.min(r, Number(a))), this.commit(e, hO(r)), this.show(e);
	}
};
function cO(e) {
	return e instanceof HTMLInputElement && e.classList.contains(XD) ? e : null;
}
function lO(e, t) {
	let n = e.classList.contains(YD) ? e.querySelector(`.${XD}`) : null, r = n === null ? null : t(n);
	if (n === null || typeof r != "string" || r.trim().length === 0 || !Number.isFinite(Number(r))) return null;
	let i = uO(n, rO), a = uO(n, iO);
	return i !== null && Number(r) < Number(i) ? {
		key: "ui.value.min",
		args: { min: dO(n, i, TD(n)) }
	} : a !== null && Number(r) > Number(a) ? {
		key: "ui.value.max",
		args: { max: dO(n, a, TD(n)) }
	} : null;
}
function uO(e, t) {
	let n = e.getAttribute(t)?.trim() ?? "";
	return n.length > 0 && Number.isFinite(Number(n)) ? n : null;
}
function dO(e, t, n) {
	return BD(t, n, {
		format: mO(e),
		thousands: fO(e)
	});
}
function fO(e) {
	return e.hasAttribute($D) ? !0 : !e.hasAttribute(eO) && null;
}
function pO(e) {
	return UD(e.value, TD(e), mO(e));
}
function mO(e) {
	return e.closest(`.${YD}`)?.getAttribute("data-ui-number-format") ?? null;
}
function hO(e) {
	return Number(e.toFixed(10)).toString();
}
//#endregion
//#region src/events/ahead-of-answer.ts
function gO(e, t) {
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
function _O(e) {
	let t = W(e) === "windowed" ? vO(e, "data-ui-window-offset") ?? 0 : 0;
	return Number.isInteger(t) && t > 0 ? t : 0;
}
function vO(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.length === 0) return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
function yO(e, t) {
	return e.getAttribute(t)?.toLowerCase() === "true";
}
//#endregion
//#region src/interactions/item-drags.ts
var bO = "application/x-ne-items", xO = null, SO = null;
function CO(e, t, n) {
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
function wO(e, t) {
	let n = Td(t);
	return n.includes(e) ? n.filter((t) => t === e || EO(t)) : [e];
}
function TO(e) {
	return !Xc(e, "data-ui-undraggable") && !k(e);
}
function EO(e) {
	return TO(e) && I(e) !== null;
}
function DO(e, t) {
	let n = e?.effects.has("copy") === !0, r = t || e?.effects.has("move") === !0;
	return n && r ? "copyMove" : n ? "copy" : "move";
}
function OO(e, t, n = null) {
	xO = t, SO = t === null ? null : n, t !== null && e instanceof DragEvent && e.dataTransfer !== null && e.dataTransfer.setData(bO, t.kind);
}
function kO(e) {
	return xO !== null && e.dataTransfer?.types.includes(bO) === !0 ? xO : null;
}
function AO() {
	let e = SO;
	xO = null, SO = null, e?.();
}
//#endregion
//#region src/items/items-empty-renderer.ts
var jO = "data-ui-non-item";
function G(e) {
	let t = [];
	for (let n of e.children) MO(n) || t.push(n);
	return t;
}
function MO(e) {
	return e.hasAttribute("data-ui-non-item") || e.hasAttribute("data-ui-empty-placeholder") || e.hasAttribute("data-ui-group-header") || e.hasAttribute("data-ui-window-spacer");
}
function NO(e) {
	return e === null ? [] : [e];
}
function PO(e) {
	return e.querySelector(`:scope > [${Pt}]`);
}
function FO(e, t, n, r, i) {
	i ??= G(e).some((e) => !e.classList.contains(Ci));
	let a = PO(e);
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
var IO = { ok: !1 }, LO = {
	ok: !0,
	value: null
}, RO = null;
function zO(e) {
	RO = e;
}
function BO(e, t, n) {
	let r = e.length === 0 ? void 0 : e[e.length - 1].item, i = t ?? "";
	if (i.length === 0 || i === ".") return {
		ok: !0,
		value: r,
		scope: r
	};
	let a = (n ?? []).filter((e) => na(e.kind) !== "Scope"), o = -1;
	for (let e = 0; e < a.length; e++) na(a[e].kind) === "Dynamic" && (o = e);
	let s = r, c = r, l = !0, u = 0, d = 0, f = !0;
	for (; d < i.length;) {
		let t = i[d];
		if (t === ".") {
			if (f) return IO;
			f = !0, d++;
			continue;
		}
		if (t === "[") {
			if (d + 1 >= i.length || i[d + 1] !== "]" || u >= a.length) return IO;
			let t = a[u];
			if (u++, na(t.kind) === "Dynamic") {
				let n = WO(e, t.componentId);
				if (!n.ok) return IO;
				s = n.value, c = n.value, l = !0;
			} else {
				if (!l) return IO;
				let e = ZO(s, t.value);
				if (!e.ok) return IO;
				s = e.value;
			}
			d += 2, f = !1;
			continue;
		}
		let n = d;
		for (; d < i.length && i[d] !== "." && i[d] !== "[";) d++;
		if (d === n) return IO;
		if (l) {
			let e = qO(s, i.slice(n, d), u > o);
			e.ok ? s = e.value : l = !1;
		}
		f = !1;
	}
	return f || u !== a.length || !l ? IO : {
		ok: !0,
		value: s,
		scope: c
	};
}
function VO(e, t, n) {
	for (let r of t ?? []) {
		if (na(r.kind) !== "Dynamic") continue;
		let t = w(r.componentId);
		if (t > 0 && !n.some((e) => e.scopeComponentId === t) && e.closest(`[data-ui-id="${t}"][data-ui-key]`) !== null) return !0;
	}
	return !1;
}
function HO(e) {
	let t = KO(e, "IsContent");
	return t.ok && t.value === !0;
}
var UO = /* @__PURE__ */ new Set();
function WO(e, t) {
	let n = w(t);
	if (n > 0) {
		for (let t = e.length - 1; t >= 0; t--) if (e[t].scopeComponentId === n) return {
			ok: !0,
			value: e[t].item
		};
	}
	return UO.has(n) || (UO.add(n), s("an item scope a binding parameter names is not on the stack; the binding resolves to nothing.", {
		targetId: n,
		stack: e
	})), IO;
}
function GO(e, t) {
	let n = e;
	for (let e of t.split(".")) {
		let t = KO(n, e);
		if (!t.ok) return;
		n = t.value;
	}
	return n;
}
function KO(e, t) {
	return qO(e, t, !0);
}
function qO(e, t, n) {
	if (e == null) return IO;
	if (t === ".") return {
		ok: !0,
		value: e
	};
	if (typeof e != "object") return IO;
	let r = e, i = JO(r, t);
	return Object.hasOwn(r, i) ? {
		ok: !0,
		value: r[i]
	} : Array.isArray(e) ? IO : (n && RO?.(r, t), LO);
}
function JO(e, t) {
	if (Object.hasOwn(e, t)) return t;
	let n = YO(t);
	if (Object.hasOwn(e, n)) return n;
	let r = null;
	for (let n in e) if (n.length === t.length && Object.hasOwn(e, n) && (r ??= t.toLowerCase(), n.toLowerCase() === r)) return n;
	return n;
}
function YO(e) {
	let t = e.charAt(0);
	return t === t.toLowerCase() ? e : t.toLowerCase() + e.slice(1);
}
function XO(e) {
	let t = e.itemTemplate;
	if (t == null) return null;
	let n = (e.itemTemplateParameters ?? []).filter((e) => na(e.kind) !== "Scope"), r = [], i = [], a = !1, o = 0, s = 0, c = 0;
	for (; c < t.length;) {
		let e = t[c];
		if (e === ".") {
			c++;
			continue;
		}
		if (e === "[") {
			if (c + 1 >= t.length || t[c + 1] !== "]" || s >= n.length) return null;
			let e = n[s];
			if (s++, c += 2, na(e.kind) !== "Dynamic") {
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
function ZO(e, t) {
	if (e == null || t == null) return IO;
	if (typeof t == "number") return Array.isArray(e) && t >= 0 && t < e.length ? {
		ok: !0,
		value: e[t]
	} : IO;
	if (typeof t != "string") return IO;
	if (!Array.isArray(e) && typeof e == "object") {
		let n = e;
		if (Object.hasOwn(n, t)) return {
			ok: !0,
			value: n[t]
		};
	}
	if (Array.isArray(e)) {
		for (let n of e) if ($O(n, t)) return {
			ok: !0,
			value: n
		};
	}
	return IO;
}
function QO(e, t, n) {
	if (e == null || t == null) return !1;
	if (Array.isArray(e)) {
		if (typeof t == "number") return t < 0 || t >= e.length ? !1 : (e[t] = n, !0);
		if (typeof t != "string") return !1;
		for (let r = 0; r < e.length; r++) if ($O(e[r], t)) return e[r] = n, !0;
		return !1;
	}
	if (typeof t != "string" || typeof e != "object") return !1;
	let r = e;
	return Object.hasOwn(r, t) ? (r[t] = n, !0) : !1;
}
function $O(e, t) {
	return typeof e == "object" && !!e && e.id === t;
}
//#endregion
//#region src/items/items-filter-sort.ts
var ek = /* @__PURE__ */ new WeakMap();
function tk(e) {
	let t = nk(e), n = t?.getAttribute("data-ui-items-query") ?? null;
	if (t === null || n === null || n.length === 0) return null;
	let r = ek.get(t);
	if (r !== void 0 && r.text === n) return r.query;
	let i = rk(e, n);
	return ek.set(t, {
		text: n,
		query: i
	}), i;
}
function nk(e) {
	let t = e.closest(S);
	if (t === null) return null;
	for (let e of t.children) if (e.hasAttribute("data-ui-items-query")) return e;
	return null;
}
function rk(e, t) {
	try {
		return JSON.parse(t);
	} catch {
		return s("the items query on the page does not parse; the authored rules alone apply.", {
			host: e,
			text: t
		}), null;
	}
}
function ik(e, t, n, r, i) {
	let a = n.getItemsFilterSortMetadata(t), o = tk(e);
	if (a === void 0 && o === null) for (let t of G(e)) t.classList.remove(Ci);
	else for (let n of G(e)) {
		let e = r.getItemValue(n);
		e === void 0 ? (s("item value is unknown, leaving the item visible.", {
			componentId: t,
			item: n
		}), n.classList.remove(Ci)) : n.classList.toggle(Ci, !ak(a, e, i, o));
	}
}
function ak(e, t, n, r = null) {
	return (e?.filters ?? []).every((e) => uk(e, t, n)) && (r?.filters ?? []).every((e) => Cm(GO(t, e.itemProperty), e.operator, e.value));
}
function ok(e, t, n = null) {
	return (e?.filters ?? []).some((e) => dk(e.source, e.activeOperator, e.activeValue, t)) || (n?.filters?.length ?? 0) > 0;
}
function sk(e, t, n = null) {
	let r = (e?.sorts ?? []).filter((e) => dk(e.source, e.activeOperator, e.activeValue, t)).sort((e, t) => e.priority - t.priority);
	return [...n?.sorts ?? [], ...r];
}
function ck(e, t, n) {
	return t.length === 0 ? [...e] : [...e].sort((e, r) => lk(n.getItemValue(e), n.getItemValue(r), t));
}
function lk(e, t, n) {
	for (let r of n) {
		let n = fk(wm(GO(e, r.itemProperty)), wm(GO(t, r.itemProperty)));
		if (n !== 0) return sa(r.direction) === "Descending" ? -n : n;
	}
	return 0;
}
function uk(e, t, n) {
	if (!dk(e.source, e.activeOperator, e.activeValue, n)) return !0;
	let r = e.source !== null && e.source !== void 0 ? n.get(e.source, []) : e.value;
	return Cm(GO(t, e.itemProperty), e.operator, r);
}
function dk(e, t, n, r) {
	return e == null || Cm(r.get(e, []), t, n);
}
function fk(e, t) {
	if (e === t) return 0;
	let n = mk(e), r = mk(t);
	if (n !== r) return n - r;
	if (n === pk.Nothing) return 0;
	if (n === pk.Number) {
		let n = Number(e) - Number(t);
		return Number.isNaN(n) ? 0 : Math.sign(n);
	}
	return String(e).localeCompare(String(t));
}
var pk = {
	Nothing: 0,
	Number: 1,
	Text: 2
};
function mk(e) {
	return e == null ? pk.Nothing : typeof e == "number" ? Number.isNaN(e) ? pk.Nothing : pk.Number : typeof e == "string" && e.trim().length === 0 ? pk.Nothing : Number.isNaN(Number(e)) ? pk.Text : pk.Number;
}
//#endregion
//#region src/items/items-source-order.ts
var hk = /* @__PURE__ */ new WeakMap();
function gk(e, t) {
	let n = hk.get(e), r = n === void 0 ? [...t] : _k(n, t);
	return hk.set(e, r), r;
}
function _k(e, t) {
	let n = new Set(t), r = e.filter((e) => n.has(e));
	return r.length === t.length ? r : [...t];
}
function vk(e, t, n) {
	let r = n === null || n > e.length ? e.length : n;
	return e.splice(r, 0, t), e[r + 1] ?? null;
}
function yk(e, t) {
	let n = e.indexOf(t);
	n >= 0 && e.splice(n, 1);
}
function bk(e, t) {
	let n = 0;
	for (let r of e) t.has(r) || (e[n++] = r);
	e.length = n;
}
function xk(e, t, n) {
	return yk(e, t), vk(e, t, n);
}
function Sk(e, t, n) {
	let r = e.indexOf(t);
	r >= 0 && (e[r] = n);
}
function Ck(e, t) {
	hk.set(e, [...t]);
}
function wk(e) {
	hk.delete(e);
}
//#endregion
//#region src/interactions/live-announcer.ts
var Tk = "ui-announcer", Ek = 7e3, Dk = null;
function Ok(e, t = "polite") {
	(Dk ?? kk(document.body)).announce(e, t);
}
function kk(e) {
	return Dk = new jk(e), Dk;
}
function Ak(e, t) {
	Ok({
		key: "ui.move.done",
		args: {
			index: e,
			count: t
		}
	});
}
var jk = class {
	container;
	regions = /* @__PURE__ */ new Map();
	constructor(e) {
		this.container = e, this.ensureRegion("polite"), this.ensureRegion("assertive");
	}
	announce(e, t = "polite") {
		let n = document.createElement("div");
		return typeof e == "string" ? n.textContent = e : D.writeValue(n, null, e), this.ensureRegion(t).append(n), setTimeout(() => n.remove(), Ek), n;
	}
	ensureRegion(e) {
		let t = this.regions.get(e);
		if (t !== void 0 && t.isConnected) return t;
		let n = `.${Tk}[aria-live="${e}"]`, r = this.container.querySelector(n), i = r ?? document.createElement("div");
		return r === null && (i.className = Tk, i.setAttribute("aria-live", e), this.container.append(i)), this.regions.set(e, i), i;
	}
}, Mk = "ui-tab-item";
function Nk(e) {
	let t = e.parentElement;
	return t !== null && !t.hasAttribute("data-ui-items-host") && t.closest("[data-ui-items-host]") === t.parentElement ? t : e;
}
function Pk(e) {
	return e instanceof HTMLElement && e.classList.contains("ui-tab-item") ? Nk(e).parentElement : null;
}
function Fk(e, t) {
	return Xc(Nk(e), t);
}
//#endregion
//#region src/interactions/items-reorder-engine.ts
var Ik = ".ui-items-view__item, .ui-table__row", Lk = "ui-row--dragging", Rk = "--ui-row-drop-offset", zk = "move", Bk = ".ui-items-view--wrap", Vk = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight"
]);
function Hk(e, t) {
	Mf(e, zk, { index: t });
}
function Uk(e) {
	return {
		name: zk,
		registration: {
			dynamicParameters: (e) => {
				let t = Wk(e.domEvent);
				return t === null ? null : [...e.dynamicParameters, t];
			},
			...gO((t) => e === void 0 ? null : Gk(e, t), (t) => "pending" in t ? e?.settle(t.pending) : e?.resort(t.strip))
		}
	};
}
function Wk(e) {
	let t = e instanceof CustomEvent ? e.detail?.index : void 0;
	return typeof t == "number" ? t : null;
}
function Gk(e, t) {
	let n = Wk(t);
	if (n === null || !(t.target instanceof Element)) return null;
	let r = Pk(t.target);
	if (r !== null) return { strip: r };
	let i = t.target.closest(Ik), a = i?.parentElement ?? null, o = i === null || a === null || !a.hasAttribute("data-ui-items-host") ? null : e.ahead(a, L(i), n);
	return o === null ? null : { pending: o };
}
var Kk = class {
	root;
	services;
	drag = null;
	views;
	marked = null;
	lifted = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.services = e.services, this.views = new qk(this.root, e.services?.keysOf), this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("pointerup", () => this.release(), !0), this.root.addEventListener("pointercancel", () => this.release(), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", () => this.endDrag(), !0);
	}
	handlePointerDown(e) {
		if (this.release(), !(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = this.liftableRow(e.target), n = t === null ? null : I(t.row);
		if (t === null || n === null) return;
		let r = $k(t.root, t.row);
		if (r === null ? !eA(e.target, t.row) : !r.contains(e.target)) return;
		r !== null && (of(t.root, sA(t.row.parentElement ?? t.root), t.row), t.root.focus({ preventScroll: !0 }));
		let i = document.getSelection();
		i !== null && !i.isCollapsed && i.removeAllRanges(), n.draggable || (n.draggable = !0, this.lifted = n);
	}
	release() {
		this.lifted !== null && this.drag === null && (this.lifted.draggable = !1, this.lifted = null);
	}
	liftableRow(e) {
		let t = e.closest(md), n = t?.parentElement ?? null, r = n?.closest(F) ?? null;
		if (t === null || n === null || r === null || !t.matches(Ik) || !n.hasAttribute("data-ui-items-host") || O(r) || !EO(t)) return null;
		let i = r.hasAttribute("data-ui-rows-draggable") && !this.isSorted(r, n);
		return i || r.hasAttribute("data-ui-drag-kind") ? {
			root: r,
			row: t,
			moves: i
		} : null;
	}
	isSorted(e, t) {
		let n = Va(e);
		return this.services === void 0 || n === null ? !1 : sk(this.services.metadata.getItemsFilterSortMetadata(n), this.services.state, tk(t)).length > 0;
	}
	handleDragStart(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.liftableRow(e.target), n = t?.row.parentElement ?? null, r = t === null ? null : I(t.row);
		if (t === null || n === null || r === null || e.target !== r) return;
		this.drag = {
			...t,
			host: n
		};
		let i = CO(t.root, n, wO(t.row, sA(n))), a = (i?.rows ?? []).filter((e) => e !== t.row).map((e) => I(e) ?? e);
		hv(e, t.root, r, Lk, L(t.row), a, DO(i, t.moves)), OO(e, i, () => this.endDrag()), this.dropView();
	}
	handleDragOver(e) {
		let t = this.ownDrag(e);
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let n = this.views.read(t.root, t.host), r = Zk(t.host, e.target, e, n.flow, n.rows, n.boxes), i = r === null || this.indexOf(t, r.anchor, r.side, n.order) === null ? null : r, a = i === null ? 0 : aA(n.rows, i, n.flow);
		e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), !(this.marked !== null && this.marked.view === n && rA(this.marked.place, i) && this.marked.offset === a) && (cA(t.root, i, a), this.marked = {
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
		if (tA(t) !== tA(e.row)) return null;
		let i = Yk(r ?? Qk(e.host, this.services?.keysOf), L(e.row), L(t), n);
		return i === null ? null : i + _O(e.host);
	}
	handleDragLeave(e) {
		let t = this.drag;
		t !== null && e instanceof DragEvent && vv(e, t.host) && (cA(t.root, null), this.dropView());
	}
	handleDrop(e) {
		let t = this.ownDrag(e);
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		e.preventDefault();
		let n = Zk(t.host, e.target, e, nA(t.root, t.host), sA(t.host)), r = n === null ? null : this.indexOf(t, n.anchor, n.side);
		this.endDrag(), r !== null && Hk(t.row, r);
	}
	endDrag() {
		let e = this.drag;
		this.drag = null, this.dropView(), this.release(), e !== null && (gv(e.root, Lk), cA(e.root, null));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !e.altKey || !M(e, { alt: !0 }) || !Vk.has(e.key) || !(e.target instanceof Element)) return;
		let t = Xd(e);
		if (t === null || !t.root.matches(".ui-items-view, .ui-table")) return;
		let n = Nd(t.root), r = n === null ? null : nA(t.root, n), i = e.key === "ArrowLeft" || e.key === "ArrowRight";
		if (n === null || r === null || i && !r.across) return;
		let a = sA(n), o = ef(a);
		if (o === null || this.liftableRow(o)?.moves !== !0) return;
		e.preventDefault();
		let s = e.key === "ArrowDown" || e.key === "ArrowRight", c = !i && t.root.matches(Bk) ? kf(a, o, s) : a[a.indexOf(o) + (s ? 1 : -1)] ?? null, l = c === null ? null : this.indexOf({
			host: n,
			row: o
		}, c, s ? "after" : "before");
		l !== null && (Hk(o, l), Ak(l + 1, vO(n, "data-ui-window-total") ?? _O(n) + Qk(n, this.services?.keysOf).length));
	}
}, qk = class {
	keysOf;
	view = null;
	changes = typeof MutationObserver == "function" ? new MutationObserver((e) => this.hear(e)) : null;
	constructor(e, t) {
		this.keysOf = t, e.addEventListener("scroll", () => this.drop(), !0);
	}
	read(e, t) {
		if (this.view !== null && this.view.host === t) return this.view;
		this.drop();
		let n = sA(t);
		return this.view = {
			host: t,
			flow: nA(e, t),
			rows: n,
			boxes: n.map((e) => (I(e) ?? e).getBoundingClientRect()),
			order: Qk(t, this.keysOf)
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
		e.some(Jk) && this.drop();
	}
};
function Jk(e) {
	return e.attributeName !== "style" || e.target instanceof Element && e.target.hasAttribute("data-ui-window-spacer");
}
function Yk(e, t, n, r) {
	let i = e.indexOf(t);
	if (i < 0 || t === n) return null;
	let a = Xk(e.filter((e) => e !== t), n, r);
	return a === i ? null : a;
}
function Xk(e, t, n) {
	let r = e.indexOf(t);
	return r < 0 ? null : n === "before" ? r : r + 1;
}
function Zk(e, t, n, r, i, a) {
	if (t.closest("[data-ui-group-header]")?.parentElement === e) return null;
	let o = t.closest(md);
	for (; o !== null && o.parentElement !== e;) o = o.parentElement?.closest(md) ?? null;
	if (o ??= oA(i, n, a), o === null) return null;
	let s = (I(o) ?? o).getBoundingClientRect();
	if ((r.across ? n.clientX < s.left + s.width / 2 : n.clientY < s.top + s.height / 2) === r.rightToLeft) return {
		anchor: o,
		side: "after"
	};
	let c = i[i.indexOf(o) - 1];
	return c !== void 0 && iA(c, o, r) ? {
		anchor: c,
		side: "after"
	} : {
		anchor: o,
		side: "before"
	};
}
function Qk(e, t) {
	switch (W(e)) {
		case "virtualized": return [...t?.(e) ?? G(e).map(L)];
		case "windowed": return G(e).map(L);
		default: return gk(e, G(e)).map(L);
	}
}
function $k(e, t) {
	let n = e.hasAttribute("data-ui-rows-drag-handle") ? t.querySelector(`:scope > .${_e}`) : null;
	return n !== null && n.getClientRects().length > 0 ? n : null;
}
function eA(e, t) {
	return Bu(e, t) === null && e.closest("[data-ui-no-row-drag]") === null;
}
function tA(e) {
	return e.getAttribute("data-ui-group") ?? "";
}
function nA(e, t) {
	let n = e.matches(".ui-orientation--horizontal, .ui-items-view--wrap");
	return {
		across: n,
		rightToLeft: n && getComputedStyle(t).direction === "rtl"
	};
}
function rA(e, t) {
	return e === t || e !== null && t !== null && e.anchor === t.anchor && e.side === t.side;
}
function iA(e, t, n) {
	if (tA(e) !== tA(t)) return !1;
	if (!n.across) return !0;
	let r = (I(e) ?? e).getBoundingClientRect(), i = (I(t) ?? t).getBoundingClientRect();
	return r.top < i.bottom && i.top < r.bottom;
}
function aA(e, t, n) {
	let r = t.side === "after" ? e[e.indexOf(t.anchor) + 1] : void 0;
	if (r === void 0 || !iA(t.anchor, r, n)) return -1;
	let i = (I(t.anchor) ?? t.anchor).getBoundingClientRect(), a = (I(r) ?? r).getBoundingClientRect(), o = n.across ? n.rightToLeft ? i.left - a.right : a.left - i.right : a.top - i.bottom;
	return Math.max(o, 0) / 2;
}
function oA(e, t, n) {
	let r = null, i = Infinity;
	for (let a = 0; a < e.length; a++) {
		let o = e[a], s = n?.[a] ?? (I(o) ?? o).getBoundingClientRect(), c = Math.max(s.left - t.clientX, 0, t.clientX - s.right), l = Math.max(s.top - t.clientY, 0, t.clientY - s.bottom), u = c * c + l * l;
		u < i && (r = o, i = u);
	}
	return r;
}
function sA(e) {
	return G(e).filter((e) => e instanceof HTMLElement && e.matches(md) && I(e) !== null);
}
function cA(e, t, n = 0) {
	let r = t === null ? null : I(t.anchor);
	for (let t of e.querySelectorAll(`[${ve}]`)) t !== r && (t.removeAttribute(ve), t.style.removeProperty(Rk));
	if (r === null || t === null) return;
	r.getAttribute("data-ui-row-drop") !== t.side && r.setAttribute(ve, t.side);
	let i = `${n}px`;
	r.style.getPropertyValue(Rk) !== i && r.style.setProperty(Rk, i);
}
function lA(e) {
	e.classList.remove(Lk), e.querySelector(`:scope > [${y}]`)?.classList.remove(Lk);
}
//#endregion
//#region src/interactions/tree-drop.ts
var uA = "--ui-tree-drop-depth";
function dA(e) {
	return e.querySelector(`.${ur}`);
}
function fA(e, t) {
	if (k(e)) return !1;
	let n = t?.getAttribute(Sr);
	return n === "true" || n !== "false" && e.hasAttribute("aria-expanded");
}
function pA(e, t) {
	let n = e.length === 0 ? null : t(e);
	return n === null || fA(n, dA(n));
}
function mA(e, t) {
	let n = dA(e);
	if (fA(e, n)) return L(e);
	let r = n?.getAttribute("data-ui-tree-parent") ?? "";
	return pA(r, t) ? r : null;
}
function hA(e, t, n = "", r) {
	for (let n of e.querySelectorAll(`[${dr}]`)) n !== t && (n.removeAttribute(dr), n.style.removeProperty(uA));
	t !== null && (t.setAttribute(dr, n), r === void 0 ? t.style.removeProperty(uA) : t.style.setProperty(uA, String(r)));
}
function gA(e, t, n) {
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
function _A(e, t, n) {
	let r = e.find((e) => e.key === t);
	if (r === void 0) return null;
	let i = vA(e, r, n);
	return i === null || !yA(e, i.parent) ? null : i;
}
function vA(e, t, n) {
	if (n === "in") {
		let n = gA(e, t.key, !0);
		return n === null ? null : {
			parent: n,
			before: null
		};
	}
	if (n === "out") {
		let n = gA(e, t.key, !1);
		return n === null ? null : {
			parent: n,
			before: xA(e, n, t.parent, !1)
		};
	}
	let r = bA(e, t.parent), i = r.findIndex((e) => e.key === t.key), a = n === "up" ? -1 : 1, o = i + a;
	for (; o >= 0 && o < r.length && r[o].shown === !1;) o += a;
	return o < 0 || o >= r.length ? null : {
		parent: t.parent,
		before: n === "up" ? r[o].key : r[o + 1]?.key ?? null
	};
}
function yA(e, t) {
	return t.length === 0 || e.find((e) => e.key === t)?.takesDrop === !0;
}
function bA(e, t) {
	return e.filter((e) => e.parent === t);
}
function xA(e, t, n, r, i = /* @__PURE__ */ new Set()) {
	let a = bA(e, t);
	for (let e = a.findIndex((e) => e.key === n) + 1; e > 0 && e < a.length; e++) if (!i.has(a[e].key) && (!r || a[e].shown !== !1)) return a[e].key;
	return null;
}
function SA(e, t, n) {
	let r = bA(e, n.parent).map((e) => e.key), i = new Set(t), a = n.before !== null && i.has(n.before) ? xA(e, n.parent, n.before, !1, i) : n.before, o = [], s = null;
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
var CA = "drop:", wA = "ui-row--cut", TA = {
	code: "KeyX",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
}, EA = {
	code: "KeyC",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
}, DA = {
	code: "KeyV",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
};
function OA(e) {
	return {
		dynamicParameters: (e) => {
			let t = kA(e.domEvent);
			return t === null ? null : [...e.dynamicParameters, JSON.stringify(t.drop)];
		},
		...gO((t) => AA(e, t), (t) => e?.settle(t))
	};
}
function kA(e) {
	let t = e instanceof CustomEvent ? e.detail : null;
	return t?.drop === void 0 ? null : t;
}
function AA(e, t) {
	let n = kA(t)?.transfer ?? null;
	return n === null || e === void 0 ? null : e.ahead(n.source, n.target, n.keys, n.index);
}
var jA = class {
	root;
	options;
	marked = null;
	clipboard = null;
	views;
	constructor(e) {
		this.root = e.root ?? document, this.options = e, this.views = new qk(this.root, e.keysOf), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", () => this.endDrag(), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e));
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent)) return;
		let t = this.dropOf(e);
		this.unmark(), t !== null && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = t.effect), t.landing.mark(), this.marked = t.target);
	}
	dropOf(e) {
		let t = kO(e), n = e.target instanceof Element ? e.target : null, r = t === null || n === null ? null : this.targetOf(t, n);
		if (t === null || n === null || r === null) return null;
		let i = MA(t, r, NA(e)), a = i === null ? null : this.landingOf(r, n, e);
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
		let r = e.matches(".ui-items-view, .ui-table") ? Nd(e) : null;
		if (r !== null) {
			let i = this.views.read(e, r), a = t !== null && n !== null ? Zk(r, t, n, i.flow, i.rows, i.boxes) : PA(i.rows);
			return {
				index: ((a === null ? null : Xk(i.order, L(a.anchor), a.side)) ?? i.order.length) + _O(r),
				folder: null,
				list: r,
				mark: () => a === null ? e.setAttribute(he, "") : cA(e, a, aA(i.rows, a, i.flow))
			};
		}
		if (e.classList.contains("ui-tree")) {
			let n = FA(e, t ?? document.activeElement);
			if (n === null) return null;
			let r = n.length === 0 ? Nd(e) : IA(e, n);
			return {
				index: null,
				folder: n,
				list: null,
				mark: () => hA(e, r)
			};
		}
		return {
			index: null,
			folder: null,
			list: null,
			mark: () => {
				e.setAttribute(he, ""), yv(e, !0);
			}
		};
	}
	unmark() {
		let e = this.marked;
		this.marked = null, e !== null && (e.removeAttribute(he), yv(e, !1), e.matches(".ui-items-view, .ui-table") ? cA(e, null) : e.classList.contains("ui-tree") && hA(e, null));
	}
	handleDragLeave(e) {
		this.marked !== null && e instanceof DragEvent && vv(e, this.marked) && this.unmark();
	}
	handleDrop(e) {
		this.views.drop();
		let t = e instanceof DragEvent ? this.dropOf(e) : null;
		t !== null && (e.preventDefault(), this.unmark(), AO(), this.drop(t.drag, t.target, t.effect, t.landing));
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
		t.dispatchEvent(new CustomEvent(CA + e.kind, {
			bubbles: !0,
			detail: a
		}));
	}
	endDrag() {
		this.unmark(), this.views.drop(), AO();
	}
	handleKeyDown(e) {
		e instanceof KeyboardEvent && !e.defaultPrevented && e.target instanceof Element && (e.key === "Escape" ? this.clipboard !== null && !j(e) && (this.clipboard.items.root.isConnected && e.preventDefault(), this.letGo()) : Du(e.target) || (Wl(DA, e) ? this.paste(e, e.target) : Wl(TA, e) ? this.take(e, e.target, !0) : Wl(EA, e) && this.take(e, e.target, !1)));
	}
	letGo() {
		for (let e of this.clipboard?.items.rows ?? []) (I(e) ?? e).classList.remove(wA);
		this.clipboard = null;
	}
	paste(e, t) {
		let n = this.clipboard, r = n === null ? null : this.targetOf(n.items, t), i = n === null || r === null ? null : MA(n.items, r, !n.cut);
		this.views.drop();
		let a = r === null || i === null ? null : this.landingOf(r, null, null);
		n !== null && r !== null && i !== null && a !== null && (e.preventDefault(), this.drop(n.items, r, i, a), n.cut && this.letGo());
	}
	take(e, t, n) {
		let r = document.getSelection();
		if (r !== null && !r.isCollapsed) return;
		let i = Yd(t), a = i === null ? null : Nd(i.root);
		if (i === null || a === null || O(i.root) || !i.root.hasAttribute("data-ui-drag-kind")) return;
		let o = sA(a), s = i.row ?? ef(o), c = s === null || !EO(s) ? null : CO(i.root, a, wO(s, o));
		if (c !== null && c.effects.has(n ? "move" : "copy") && (e.preventDefault(), this.letGo(), this.clipboard = {
			items: c,
			cut: n
		}, n)) for (let e of c.rows) (I(e) ?? e).classList.add(wA);
	}
};
function MA(e, t, n) {
	let r = n || t.getAttribute("data-ui-drag-kind") !== e.kind ? "copy" : "move";
	return e.effects.has(r) ? r : n ? null : r === "move" ? "copy" : "move";
}
function NA(e) {
	return $l() ? e.altKey : e.ctrlKey;
}
function PA(e) {
	let t = tf(e);
	return t === null ? null : {
		anchor: t,
		side: "after"
	};
}
function FA(e, t) {
	let n = t?.closest(".ui-tree__row") ?? null;
	return n === null || n.closest(".ui-tree") !== e ? "" : mA(n, (t) => IA(e, t));
}
function IA(e, t) {
	return e.querySelector(`.${lr}[${b}="${Ji(t)}"]`);
}
//#endregion
//#region src/interactions/temporal-range.ts
function LA(e, t, n) {
	if (t === "start" || e.start === null) {
		let t = HA(n, e.start ?? n);
		return {
			start: t,
			end: e.end !== null && e.end.getTime() < t.getTime() ? null : e.end,
			active: "end",
			complete: !1
		};
	}
	return n.getTime() < UA(e.start).getTime() ? {
		start: HA(n, e.start),
		end: null,
		active: "end",
		complete: !1
	} : {
		start: e.start,
		end: HA(n, e.end ?? e.start),
		active: "end",
		complete: !0
	};
}
function RA(e, t, n) {
	if (t === null || n === null) return !1;
	let r = UA(e).getTime();
	return r > UA(t).getTime() && r < UA(n).getTime();
}
function zA(e, t) {
	return !t && e.start !== null && e.end !== null && UA(e.start).getTime() < UA(e.end).getTime();
}
function BA(e, t, n) {
	return !n && RA(e, t.start, t.end);
}
function VA(e) {
	return e.start !== null && e.end !== null && e.end.getTime() < e.start.getTime() ? {
		start: e.end,
		end: e.start
	} : e;
}
function HA(e, t) {
	return ws(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function UA(e) {
	return ws(e.getFullYear(), e.getMonth(), e.getDate());
}
//#endregion
//#region src/interactions/temporal-dom.ts
var K = "ui-temporal-input", WA = "ui-calendar", GA = `.${K}, .${WA}`, KA = "ui-temporal-input__value-input", qA = "ui-temporal-input__end-value-input", JA = "data-ui-temporal-range", YA = "data-ui-temporal-end", XA = "data-ui-temporal-mode", ZA = "data-ui-temporal-format", QA = "data-ui-temporal-default-format", $A = "data-ui-temporal-min", ej = "data-ui-temporal-max", tj = "data-ui-temporal-step", nj = "data-ui-temporal-step-unit", rj = "data-ui-temporal-marked-days", ij = "data-ui-temporal-marked-only", aj = "data-ui-temporal-page-culture", oj = "data-ui-temporal-months", sj = "data-ui-temporal-months-genitive", cj = "data-ui-temporal-months-short", lj = "data-ui-temporal-daynames", uj = "data-ui-temporal-weekdays", dj = "data-ui-temporal-first-day", fj = "data-ui-temporal-am", pj = "data-ui-temporal-pm", mj = /* @__PURE__ */ new Set([
	ZA,
	QA,
	$A,
	ej,
	oj,
	fj,
	pj,
	rj,
	ij
]), hj = 2e3;
function gj(e) {
	let t = e.getAttribute(XA);
	return t === "time" || t === "date-time" ? t : "date";
}
function _j(e) {
	let t = e.getAttribute(ZA);
	return t === null || t.trim().length === 0 ? e.getAttribute(QA) ?? "" : t;
}
function vj(e) {
	let t = e.getAttribute(nj), n = Math.max(1, Math.trunc(Number(e.getAttribute(tj))) || 1);
	return {
		unit: t === "hour" || t === "minute" || t === "second" ? t : "day",
		hour: t === "hour" ? n : 1,
		minute: t === "minute" ? n : 1,
		second: t === "second" ? n : 1
	};
}
function yj(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function bj(e, t) {
	return t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function xj(e, t, n) {
	let r = new Date(e);
	return t === "hour" ? r.setHours(n) : t === "minute" ? r.setMinutes(n) : r.setSeconds(n), r;
}
function Sj(e) {
	return {
		monthNames: Cj(e, oj),
		monthGenitiveNames: Cj(e, sj),
		abbreviatedMonthNames: Cj(e, cj),
		dayNames: Cj(e, lj),
		abbreviatedDayNames: Cj(e, uj),
		amDesignator: e.getAttribute(fj) ?? "AM",
		pmDesignator: e.getAttribute(pj) ?? "PM"
	};
}
function Cj(e, t) {
	return (e.getAttribute(t) ?? "").split("|");
}
function wj(e, t) {
	e.hasAttribute(aj) && (C(e, sj, t.monthGenitiveNames.join("|")), C(e, cj, t.abbreviatedMonthNames.join("|")), C(e, lj, t.dayNames.join("|")), C(e, uj, t.abbreviatedDayNames.join("|")), C(e, oj, t.monthNames.join("|")), C(e, fj, t.amDesignator), C(e, pj, t.pmDesignator), C(e, QA, Dj(gj(e), vj(e), t)));
}
function Tj(e) {
	for (let t = 0; t < e.length;) {
		let n = vs(e, t);
		if (n === "h" || n === "hh") return !0;
		t += n?.length ?? 1;
	}
	return !1;
}
function Ej(e, t, n) {
	if (!t) return String(e).padStart(2, "0");
	let r = e < 12 ? n.amDesignator : n.pmDesignator, i = String(zs(e));
	return r.length === 0 ? i : `${i} ${r}`;
}
function Dj(e, t, n) {
	let r = t.unit === "second";
	return e === "date" ? n.date : e === "time" ? r ? n.longTime : n.shortTime : ls(n, r);
}
function Oj(e) {
	return e.hasAttribute(JA);
}
function kj(e) {
	return e !== null && e.hasAttribute(YA);
}
function Aj(e) {
	return q(e, !1);
}
function q(e, t) {
	let n = jj(e, t);
	return n === null ? null : Qj(n.value, gj(e));
}
function jj(e, t) {
	return e.querySelector(`.${t ? qA : KA}`);
}
function Mj(e, t) {
	let n = e.getAttribute(t) ?? "", r = Qj(n, gj(e)), i = Hj(n);
	if (r === null || i === null) return r;
	let a = Vj(e, !1), o = /* @__PURE__ */ new Date(Nj(r) - Pj(i) * 6e4);
	if (a !== null) {
		let e = new Date(o.getTime() + Pj(a) * 6e4);
		return ws(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate(), e.getUTCHours(), e.getUTCMinutes(), e.getUTCSeconds(), e.getUTCMilliseconds());
	}
	return Fj(e) ? r : o;
}
function Nj(e) {
	let t = /* @__PURE__ */ new Date(0);
	return t.setUTCFullYear(e.getFullYear(), e.getMonth(), e.getDate()), t.setUTCHours(e.getHours(), e.getMinutes(), e.getSeconds(), e.getMilliseconds()), t.getTime();
}
function Pj(e) {
	let t = /^([+-])(\d{2}):?(\d{2})?$/.exec(e);
	return t === null ? 0 : (t[1] === "-" ? -1 : 1) * (Number(t[2]) * 60 + Number(t[3] ?? "0"));
}
function Fj(e) {
	return (jj(e, !1)?.value.trim() ?? "").length > 0 || (jj(e, !0)?.value.trim() ?? "").length > 0;
}
function Ij(e) {
	let t = Mj(e, $A), n = Mj(e, ej), r = (e.getAttribute(rj) ?? "").split(" ").filter((e) => e.length > 0);
	return {
		min: t === null ? null : $j(t, "date"),
		max: n === null ? null : $j(n, "date"),
		marked: new Set(r),
		markedOnly: e.hasAttribute(ij)
	};
}
function Lj(e, t) {
	return (e.min === null || t >= e.min) && (e.max === null || t <= e.max) && (!e.markedOnly || e.marked.has(t));
}
function Rj(e, t, n) {
	Wj(e, t === null ? "" : zj(e, t, n), n);
}
function zj(e, t, n) {
	let r = gj(e), i = $j(t, r);
	return r === "date-time" ? i + (Vj(e, n) ?? Uj(t)) : i;
}
var Bj = /T\d{1,2}:\d{1,2}(?::\d{1,2}(?:\.\d+)?)?(Z|[+-]\d{2}(?::?\d{2})?)$/i;
function Vj(e, t) {
	return Hj(jj(e, t)?.value ?? "") ?? Hj(jj(e, !t)?.value ?? "");
}
function Hj(e) {
	return Bj.exec(e.trim())?.[1] ?? null;
}
function Uj(e) {
	let t = -e.getTimezoneOffset(), n = Math.abs(t);
	return `${t < 0 ? "-" : "+"}${eM(Math.floor(n / 60))}:${eM(n % 60)}`;
}
function Wj(e, t, n) {
	let r = jj(e, n);
	r !== null && r.value !== t && (r.value = t, r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function Gj(e, t) {
	let n = t.trim(), r = n.length === 0 ? null : Os(n, _j(e), Sj(e));
	return r === null ? n : $j(Cs(r), gj(e));
}
function Kj(e) {
	if (!Oj(e)) return;
	let t = {
		start: q(e, !1),
		end: q(e, !0)
	};
	if (VA(t) === t) return;
	let n = jj(e, !1)?.value ?? "";
	Wj(e, jj(e, !0)?.value ?? "", !1), Wj(e, n, !0);
}
function qj(e) {
	let t = Mj(e, $A), n = Mj(e, ej);
	if (t === null && n === null) return null;
	for (let r of Oj(e) ? [!1, !0] : [!1]) {
		let i = q(e, r);
		if (i !== null && t !== null && i.getTime() < t.getTime()) return {
			key: "ui.value.before",
			args: { min: ps(t, _j(e), Sj(e)) }
		};
		if (i !== null && n !== null && i.getTime() > n.getTime()) return {
			key: "ui.value.after",
			args: { max: ps(n, _j(e), Sj(e)) }
		};
	}
	return null;
}
function Jj(e) {
	return Xj(e, Yj(e, /* @__PURE__ */ new Date()));
}
function Yj(e, t) {
	let n = Mj(e, $A), r = Mj(e, ej);
	return n !== null && t.getTime() < n.getTime() ? n : r !== null && t.getTime() > r.getTime() ? r : t;
}
function Xj(e, t) {
	let n = vj(e), r = new Date(t);
	return r.setMilliseconds(0), r.setSeconds(n.unit === "second" ? Math.floor(r.getSeconds() / n.second) * n.second : 0), n.unit === "hour" ? r.setMinutes(0) : r.setMinutes(Math.floor(r.getMinutes() / n.minute) * n.minute), r.setHours(Math.floor(r.getHours() / n.hour) * n.hour), r;
}
var Zj = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/;
function Qj(e, t) {
	let n = e.trim();
	if (n.length === 0) return null;
	if (t === "time") {
		let e = Zj.exec(n);
		return e === null ? null : new Date(hj, 0, 1, Number(e[1]), Number(e[2]), Number(e[3] ?? "0"));
	}
	let r = Ss(n);
	return r === null ? null : Cs(r);
}
function $j(e, t) {
	let n = `${eM(e.getHours())}:${eM(e.getMinutes())}:${eM(e.getSeconds())}`;
	if (t === "time") return n;
	let r = `${String(e.getFullYear()).padStart(4, "0")}-${eM(e.getMonth() + 1)}-${eM(e.getDate())}`;
	return t === "date" ? r : `${r}T${n}`;
}
function eM(e) {
	return String(e).padStart(2, "0");
}
//#endregion
//#region src/interactions/temporal-calendar.ts
var tM = "ui-temporal-input__day", nM = "ui-temporal-input__month", rM = 3, iM = "data-ui-temporal-nav", aM = "data-ui-temporal-day", oM = 366;
function sM(e) {
	let t = Aj(e);
	return {
		view: jM(t ?? Yj(e, /* @__PURE__ */ new Date())),
		pane: "days",
		focusedDay: t,
		activeEnd: "start",
		hoverDay: null,
		choosingEnd: !1
	};
}
function cM(e, t, n, r) {
	let i = AM("div", `${K}__calendar`), a = AM("div", `${K}__calendar-header`), o = Ij(e), s = kM("previous", "‹", D.text("ui.picker.previous"));
	s.disabled = lM(o, t, -1) === null, a.append(s);
	let c = kM("pane", t.pane === "days" ? `${n.monthNames[t.view.getMonth()]} ${t.view.getFullYear()}` : String(t.view.getFullYear()));
	c.classList.add(`${K}__calendar-label`), a.append(c);
	let l = kM("next", "›", D.text("ui.picker.next"));
	return l.disabled = lM(o, t, 1) === null, a.append(l), i.append(a), i.append(t.pane === "days" ? pM(e, t, n, r, o) : mM(t, n, o)), i;
}
function lM(e, t, n) {
	let r = t.pane === "months", i = PM(t.view, n * (r ? 12 : 1));
	return dM(e, uM(i, r ? 4 : 7)) ? fM(e, i) : null;
}
function uM(e, t) {
	return $j(e, "date").slice(0, t);
}
function dM(e, t) {
	return (e.min === null || t >= e.min.slice(0, t.length)) && (e.max === null || t <= e.max.slice(0, t.length));
}
function fM(e, t) {
	let n = uM(t, 7), r = e.min !== null && n < e.min.slice(0, 7) ? e.min : e.max !== null && n > e.max.slice(0, 7) ? e.max : null, i = r === null ? null : Qj(r, "date");
	return i === null ? t : jM(i);
}
function pM(e, t, n, r, i) {
	let a = EM(e), o = AM("div", `${K}__weekdays`);
	for (let e = 0; e < 7; e++) {
		let t = AM("span", `${K}__weekday`);
		t.textContent = n.abbreviatedDayNames[(a + e) % 7], o.append(t);
	}
	let s = AM("div", `${K}__days`), c = UA(/* @__PURE__ */ new Date()), l = Oj(e), u = l ? q(e, !1) : r, d = l ? q(e, !0) : null, f = l && zA({
		start: u,
		end: d
	}, t.choosingEnd), p = MM(t.view, a);
	for (let e = 0; e < 42; e++) {
		let n = NM(p, e), r = $j(n, "date"), a = AM("button", tM);
		a.type = "button", a.tabIndex = -1, a.textContent = String(n.getDate()), a.setAttribute(aM, r), n.getMonth() !== t.view.getMonth() && a.classList.add(`${tM}--outside`), FM(n, c) && (a.classList.add(`${tM}--today`), a.setAttribute("aria-current", "date")), i.marked.has(r) && a.classList.add(`${tM}--marked`);
		let o = u !== null && FM(n, u), m = d !== null && FM(n, d);
		a.setAttribute("aria-pressed", o || m ? "true" : "false"), (o || m) && a.classList.add(`${tM}--selected`), f && o && a.classList.add(`${tM}--period-start`), f && m && a.classList.add(`${tM}--period-end`), l && (o || m) && a.setAttribute("aria-description", D.text(o ? "ui.picker.start" : "ui.picker.end")), BA(n, {
			start: u,
			end: d
		}, t.choosingEnd) && a.classList.add(`${tM}--within`), Lj(i, r) || (a.disabled = !0), s.append(a);
	}
	let m = AM("div", `${K}__calendar-pane`);
	return m.append(o, s), m;
}
function mM(e, t, n) {
	let r = AM("div", `${K}__months`);
	for (let i = 0; i < 12; i++) {
		let a = AM("button", nM);
		a.type = "button", a.textContent = t.abbreviatedMonthNames[i], a.setAttribute(iM, `month:${i}`), i === e.view.getMonth() && (a.classList.add(`${nM}--selected`), a.setAttribute("aria-current", "true")), dM(n, uM(ws(e.view.getFullYear(), i, 1), 7)) || (a.disabled = !0), r.append(a);
	}
	let i = [...r.children];
	return N(i, i.find((e) => e.getAttribute("aria-current") === "true" && !e.disabled) ?? i.find((e) => !e.disabled) ?? null), r;
}
function hM(e, t) {
	let n = [...e.parentElement?.querySelectorAll(".ui-temporal-input__month") ?? []], r = n.indexOf(e), i = r === -1 ? null : gM(t, r % rM);
	if (i === null) return null;
	for (let e = r + i.offset; e >= 0 && e < n.length; e += i.step) if (!n[e].disabled) return n[e];
	return null;
}
function gM(e, t) {
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
			offset: rM,
			step: rM
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
function _M(e) {
	let t = AM("div", `${K}__period-caption`);
	return t.textContent = D.text(e.activeEnd === "end" ? "ui.picker.end" : "ui.picker.start"), t;
}
function vM(e, t, n) {
	let r = Ij(e);
	if (n.startsWith("month:")) {
		let i = ws(t.view.getFullYear(), Number(n.slice(6)), 1);
		return dM(r, uM(i, 7)) && (t.view = i, t.pane = "days", t.focusedDay = CM(r, SM(i, t.focusedDay ?? Aj(e) ?? Yj(e, /* @__PURE__ */ new Date())))), !0;
	}
	switch (n) {
		case "previous": return t.view = lM(r, t, -1) ?? t.view, !0;
		case "next": return t.view = lM(r, t, 1) ?? t.view, !0;
		case "pane": return t.pane = t.pane === "days" ? "months" : "days", !0;
		default: return !1;
	}
}
function yM(e, t, n) {
	if (Oj(e)) {
		bM(e, t, n);
		return;
	}
	let r = HA(n, Aj(e) ?? Jj(e));
	t.focusedDay = r, t.view = jM(r), Rj(e, r, !1);
}
function bM(e, t, n) {
	let r = LA({
		start: q(e, !1),
		end: q(e, !0)
	}, t.activeEnd, HA(n, Jj(e)));
	t.focusedDay = r.end ?? r.start, t.view = jM(n), t.activeEnd = r.active, t.choosingEnd = !r.complete, t.hoverDay = null, Rj(e, r.end, !0), Rj(e, r.start, !1);
}
function xM(e, t, n, r = !1) {
	let i = wM(n), a = TM(t, n, EM(e), r);
	if (a === null) return null;
	let o = Ij(e);
	if (i === 0) return CM(o, a);
	let s = a;
	for (let e = 0; e < oM; e++) {
		if (Lj(o, $j(s, "date"))) return s;
		s = NM(s, i);
	}
	return t;
}
function SM(e, t) {
	let n = ws(e.getFullYear(), e.getMonth() + 1, 0).getDate();
	return ws(e.getFullYear(), e.getMonth(), Math.min(t.getDate(), n), t.getHours(), t.getMinutes(), t.getSeconds());
}
function CM(e, t) {
	let n = $j(t, "date"), r = e.min !== null && n < e.min ? e.min : e.max !== null && n > e.max ? e.max : null, i = r === null ? null : Qj(r, "date");
	return i === null ? t : HA(i, t);
}
function wM(e) {
	switch (e) {
		case "ArrowLeft": return -1;
		case "ArrowRight": return 1;
		case "ArrowUp": return -7;
		case "ArrowDown": return 7;
		default: return 0;
	}
}
function TM(e, t, n, r) {
	let i = (e.getDay() - n + 7) % 7;
	switch (t) {
		case "ArrowLeft": return NM(e, -1);
		case "ArrowRight": return NM(e, 1);
		case "ArrowUp": return NM(e, -7);
		case "ArrowDown": return NM(e, 7);
		case "PageUp": return PM(e, r ? -12 : -1);
		case "PageDown": return PM(e, r ? 12 : 1);
		case "Home": return NM(e, -i);
		case "End": return NM(e, 6 - i);
		default: return null;
	}
}
function EM(e) {
	let t = Number(e.getAttribute(dj));
	return Number.isInteger(t) && t >= 0 && t <= 6 ? t : 1;
}
function DM(e, t, n, r) {
	let i = [...e.querySelectorAll(`.${tM}`)];
	if (i.length === 0) return;
	let a = $j(UA(t.focusedDay ?? n ?? /* @__PURE__ */ new Date()), "date"), o = i.find((e) => e.getAttribute("data-ui-temporal-day") === a && !e.disabled) ?? i.find((e) => !e.disabled);
	o !== void 0 && (N(i, o), r && R(o));
}
function OM(e, t) {
	let n = t.activeEnd === "end" && t.hoverDay !== null ? q(e, !1) : null, r = t.hoverDay, i = n !== null && r !== null && UA(r).getTime() > UA(n).getTime();
	for (let t of e.querySelectorAll(`.${tM}`)) {
		let e = Qj(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		t.classList.toggle(`${tM}--preview`, i && e !== null && RA(e, n, NM(r, 1))), t.classList.toggle(`${tM}--preview-start`, i && e !== null && FM(e, n)), t.classList.toggle(`${tM}--preview-end`, i && e !== null && FM(e, r));
	}
}
function kM(e, t, n) {
	let r = AM("button", `${K}__nav`);
	return r.type = "button", r.textContent = t, r.setAttribute(iM, e), n !== void 0 && r.setAttribute("aria-label", n), r;
}
function AM(e, t) {
	let n = document.createElement(e);
	return n.className = t, n;
}
function jM(e) {
	return ws(e.getFullYear(), e.getMonth(), 1);
}
function MM(e, t) {
	let n = jM(e);
	return NM(n, -((n.getDay() - t + 7) % 7));
}
function NM(e, t) {
	return ws(e.getFullYear(), e.getMonth(), e.getDate() + t, e.getHours(), e.getMinutes(), e.getSeconds());
}
function PM(e, t) {
	let n = ws(e.getFullYear(), e.getMonth() + t, 1), r = ws(n.getFullYear(), n.getMonth() + 1, 0).getDate();
	return ws(n.getFullYear(), n.getMonth(), Math.min(e.getDate(), r), e.getHours(), e.getMinutes(), e.getSeconds());
}
function FM(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
//#endregion
//#region src/interactions/temporal-picker-engine.ts
var IM = "ui-temporal-input__field", LM = "ui-temporal-input__popup", RM = "ui-temporal-input--open", zM = "ui-calendar__body", BM = "ui-temporal-input__time-cell", VM = "ui-temporal-input__time-column", HM = 140, UM = "data-ui-temporal-toggle", WM = "data-ui-temporal-unit", GM = "data-ui-temporal-cell", KM = "data-ui-temporal-centred", qM = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	written = /* @__PURE__ */ new WeakSet();
	drawnLanguage = document.documentElement.lang;
	popups = new y_({
		show: ({ owner: e, popup: t }) => {
			e.classList.add(RM), t.addEventListener("wheel", this.onColumnWheel, { passive: !1 }), this.renderSurface(e, !0);
		},
		hide: ({ owner: e, popup: t }) => {
			for (let [t, n] of [...this.columnSettles]) window.clearTimeout(n), this.chooseCentredTime(e, t);
			this.columnSettles.clear(), this.wheelTurns.clear(), t.removeEventListener("wheel", this.onColumnWheel), e.classList.remove(RM);
		}
	});
	columnSettles = /* @__PURE__ */ new Map();
	wheelTurns = /* @__PURE__ */ new Map();
	onColumnWheel = (e) => this.handleColumnWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.arrive(this.root.querySelectorAll(GA)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = za(e.components, GA), n = e.propertyName === "Value" || e.propertyName === "EndValue";
			this.applyDisplay(t);
			for (let e of t) n && JM(e) && this.states.set(e, sM(e)), this.isShowing(e) && this.renderSurface(e);
		}), B(this.root, GA, { attributeFilter: [...mj] }, (e) => {
			for (let t of e) this.applyDisplay([t]), this.isShowing(t) && this.renderSurface(t);
		}), B(this.root, GA, {
			childList: !0,
			addedOnly: !0
		}, (e) => this.arrive(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), this.root.addEventListener("focusin", (e) => this.handleFieldFocus(e), !0), this.root.addEventListener("mouseover", (e) => this.handleDayHover(e), !0), this.root.addEventListener("mouseout", (e) => this.handleDayHover(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("scroll", (e) => this.handleColumnScroll(e), !0), this.root.addEventListener("blur", (e) => this.handleFieldBlur(e), !0), D.onChange(() => this.applyWords());
	}
	arrive(e) {
		let t = [...e];
		this.applyDisplay(t);
		for (let e of t) JM(e) && YM(e)?.firstElementChild === null && this.renderSurface(e);
	}
	applyWords() {
		let e = [...this.root.querySelectorAll(GA)], t = D.temporal;
		if (t !== null && D.language !== this.drawnLanguage) {
			this.drawnLanguage = D.language;
			for (let n of e) wj(n, t);
		}
		this.applyDisplay(e);
		for (let t of e) this.isShowing(t) && this.renderSurface(t);
	}
	get openPicker() {
		return this.popups.current;
	}
	isShowing(e) {
		return e === this.openPicker || JM(e);
	}
	calendarFor(e) {
		if (!(e instanceof Element)) return null;
		let t = e.closest(`.${zM}`)?.closest(".ui-calendar") ?? null;
		if (t !== null) return t;
		let n = this.openPicker;
		return n !== null && YM(n)?.contains(e) === !0 ? n : null;
	}
	applyDisplay(e) {
		for (let t of e) {
			let e = Es(_j(t), cN()), n = _s(_j(t)) ? "numeric" : "text";
			for (let r of t.querySelectorAll(`.${IM}`)) {
				if (r.placeholder !== e && (r.placeholder = e), r.inputMode !== n && (r.inputMode = n), r === document.activeElement && this.written.has(r)) continue;
				this.written.add(r);
				let i = jj(t, kj(r))?.value ?? "", a = Qj(i, gj(t));
				a === null ? i.length === 0 && (r.value = "") : r.value = ps(a, _j(t), Sj(t));
			}
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(IM)) return;
		let t = e.target.closest(`.${K}`), n = t === null ? null : jj(t, kj(e.target));
		if (t === null || n === null) return;
		let r = Gj(t, e.target.value), i = Qj(r, gj(t)), a = i === null ? r : zj(t, i, kj(e.target));
		if (XM(t, a)) {
			let n = q(t, kj(e.target));
			e.target.value = n === null ? "" : ps(n, _j(t), Sj(t));
		} else kj(e.target) && (this.getState(t).choosingEnd = !1), n.value = a, n.dispatchEvent(new Event("change", { bubbles: !0 })), Kj(t), this.applyDisplay([t]);
	}
	handleFieldFocus(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(IM)) return;
		let t = e.target.closest(`.${K}`);
		t !== null && Oj(t) && (this.getState(t).activeEnd = kj(e.target) ? "end" : "start");
	}
	handleDayHover(e) {
		let t = this.calendarFor(e.target);
		if (t === null || !(e.target instanceof Element) || !Oj(t)) return;
		let n = e.type === "mouseover" ? e.target.closest(`[${aM}]`) : null, r = this.getState(t), i = n === null ? null : Qj(n.getAttribute("data-ui-temporal-day") ?? "", "date");
		(r.hoverDay?.getTime() ?? null) !== (i?.getTime() ?? null) && (r.hoverDay = i, OM(t, r));
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`[${aM}], .${BM}`) : null, n = this.calendarFor(t);
		n === null || t === null || t === document.activeElement || t.matches(":disabled") || (t.classList.contains(BM) ? dN(t) : this.followPointer(n, t));
	}
	followPointer(e, t) {
		let n = YM(e), r = Qj(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		n !== null && r !== null && n.contains(document.activeElement) && (this.getState(e).focusedDay = r, N([...n.querySelectorAll(`.${tM}`)], t), mp(t));
	}
	handleFieldBlur(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(IM)) return;
		let t = e.target.closest(`.${K}`);
		t !== null && this.applyDisplay([t]);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${UM}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${K}`));
			return;
		}
		let n = this.calendarFor(e.target);
		if (n === null) return;
		let r = e.target.closest(`[${iM}]`);
		if (r !== null) {
			e.preventDefault(), this.applyNavigation(n, r.getAttribute("data-ui-temporal-nav") ?? "");
			return;
		}
		let i = e.target.closest(`[${aM}]`);
		if (i !== null) {
			e.preventDefault(), this.chooseDay(n, i.getAttribute("data-ui-temporal-day") ?? "");
			return;
		}
		let a = e.target.closest(`[${GM}]`);
		if (a !== null) {
			e.preventDefault();
			let t = a.closest(`[${WM}]`)?.getAttribute(WM);
			t != null && this.chooseTime(n, t, Number(a.getAttribute(GM)));
		}
	}
	applyNavigation(e, t) {
		let n = this.getState(e);
		if (vM(e, n, t)) this.renderSurface(e);
		else switch (t) {
			case "now":
				n.choosingEnd = !1, this.commit(e, Jj(e), n.activeEnd === "end");
				return;
			case "clear":
				this.commit(e, null), Oj(e) && this.commit(e, null, !0), n.activeEnd = "start", n.choosingEnd = !1, this.close();
				return;
			case "done":
				this.close();
				return;
			default: return;
		}
	}
	chooseDay(e, t) {
		let n = Qj(t, "date");
		if (n === null || A(e) || O(e) || !Lj(Ij(e), t)) return;
		let r = this.getState(e);
		JM(e) && Oj(e) && !r.choosingEnd && q(e, !1) !== null && q(e, !0) !== null && (r.activeEnd = "start");
		let i = jj(e, !1), a = `${i?.value ?? ""}|${jj(e, !0)?.value ?? ""}`;
		yM(e, r, n), JM(e) && `${i?.value ?? ""}|${jj(e, !0)?.value ?? ""}` === a && i?.dispatchEvent(new Event("change", { bubbles: !0 })), this.applyDisplay([e]), this.renderSurface(e);
	}
	chooseTime(e, t, n) {
		if (!Number.isFinite(n)) return;
		let r = Oj(e) && this.getState(e).activeEnd === "end", i = xj(q(e, r) ?? Jj(e), t, n);
		this.commit(e, i, r);
	}
	commit(e, t, n = !1) {
		Rj(e, t, n), Kj(e), this.applyDisplay([e]), this.isShowing(e) && this.renderSurface(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || j(e)) return;
		if (e.key === "ArrowDown" && M(e, { alt: !0 }) && e.target instanceof HTMLElement && e.target.classList.contains(IM)) {
			e.preventDefault(), this.toggle(e.target.closest(`.${K}`), kj(e.target) ? "end" : "start");
			return;
		}
		let t = this.calendarFor(e.target);
		if (t === null) return;
		if (e.target instanceof HTMLElement && e.target.classList.contains(BM)) {
			M(e) && pN(e);
			return;
		}
		if (e.target instanceof HTMLElement && e.target.classList.contains("ui-temporal-input__month")) {
			M(e) && fN(e, e.target);
			return;
		}
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains("ui-temporal-input__day") || !M(e, { shift: e.key === "PageUp" || e.key === "PageDown" })) return;
		let n = Qj(e.target.getAttribute("data-ui-temporal-day") ?? "", "date");
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault(), this.chooseDay(t, $j(n, "date"));
			return;
		}
		let r = xM(t, n, e.key, e.shiftKey);
		if (r === null) return;
		e.preventDefault();
		let i = this.getState(t);
		i.focusedDay = r, i.view = jM(r), this.renderSurface(t, !0);
	}
	handleColumnScroll(e) {
		let t = this.openPicker;
		if (t === null || !(e.target instanceof Element)) return;
		let n = e.target.closest(`.${VM}`);
		n !== null && t.contains(n) && (window.clearTimeout(this.columnSettles.get(n)), this.columnSettles.set(n, window.setTimeout(() => {
			this.columnSettles.delete(n), this.chooseCentredTime(t, n);
		}, HM)));
	}
	handleColumnWheel(e) {
		if (this.openPicker === null || e.deltaY === 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${VM}`), n = t?.getAttribute(WM) ?? null;
		if (t === null || n === null || !this.openPicker.contains(t)) return;
		e.preventDefault();
		let { steps: r, carried: i } = nb(this.wheelTurns.get(n) ?? 0, tb(e).y);
		if (this.wheelTurns.set(n, i), r === 0) return;
		let a = [...t.querySelectorAll(`.${BM}`)].filter((e) => !e.disabled), o = a.findIndex((e) => e.classList.contains(`${BM}--selected`)), s = a[Math.min(a.length - 1, Math.max(0, Math.max(0, o) + r))];
		s !== void 0 && !s.classList.contains(`${BM}--selected`) && this.chooseTime(this.openPicker, n, Number(s.getAttribute(GM)));
	}
	chooseCentredTime(e, t) {
		if (!e.isConnected || !e.contains(t) || A(e) || O(e)) return;
		let n = Number(t.getAttribute(KM));
		if (Number.isFinite(n) && Math.abs(t.scrollTop - n) <= 1) return;
		let r = t.getAttribute(WM), i = rN(t);
		r === null || i === null || i.classList.contains(`${BM}--selected`) || (i.matches(":disabled") ? tN(e) : this.chooseTime(e, r, Number(i.getAttribute(GM))));
	}
	toggle(e, t) {
		let n = e?.querySelector(`.${LM}`) ?? null;
		if (e === null || n === null) return;
		if (this.openPicker === e) {
			this.close();
			return;
		}
		this.close();
		let r = this.getState(e);
		r.activeEnd = Oj(e) ? t ?? (q(e, !1) === null ? "start" : q(e, !0) === null ? "end" : r.activeEnd) : "start", r.hoverDay = null, r.choosingEnd = !1;
		let i = q(e, r.activeEnd === "end") ?? Aj(e);
		r.pane = "days", r.view = jM(i ?? Yj(e, /* @__PURE__ */ new Date())), r.focusedDay = i;
		let a = e.querySelector(`[${UM}]`);
		this.popups.open({
			owner: e,
			popup: n,
			anchor: e.querySelector(".ui-temporal-input__row") ?? e,
			placement: { placement: "bottom-end" },
			openers: a === null ? [] : [a],
			returnFocus: () => uN(e, this.getState(e).activeEnd === "end")
		});
	}
	close() {
		this.popups.close();
	}
	getState(e) {
		let t = this.states.get(e);
		return t === void 0 && (t = sM(e), this.states.set(e, t)), t;
	}
	renderSurface(e, t = !1) {
		let n = YM(e);
		if (n === null) return;
		let r = JM(e), i = gj(e), a = this.getState(e), o = Sj(e), s = Oj(e), c = q(e, s && a.activeEnd === "end"), l = iN(n), u = aN(n), d = n.contains(document.activeElement);
		if (n.replaceChildren(), s && n.append(_M(a)), r) n.append(cM(e, a, o, c));
		else {
			let t = AM("div", `${K}__panes`);
			t.append(cM(e, a, o, c)), i === "date-time" && t.append(ZM(e, c)), n.append(t, sN(i));
		}
		let f = u === null ? null : n.querySelector(`[${iM}="${Ji(u)}"]:not(:disabled)`);
		DM(n, a, c, t || d && l === null && f === null), OM(e, a), r || (eN(n), tN(n), oN(n, l)), f !== null && R(f), r || this.popups.reposition(e);
	}
};
function JM(e) {
	return e.classList.contains(WA);
}
function YM(e) {
	return e.querySelector(`.${JM(e) ? zM : LM}`);
}
function XM(e, t) {
	let n = Ij(e), r = n.markedOnly ? Qj(t, gj(e)) : null;
	return r !== null && !n.marked.has($j(r, "date"));
}
function ZM(e, t) {
	let n = vj(e), r = AM("div", `${K}__time`), i = AM("div", `${K}__time-columns`);
	for (let r of QM(n)) i.append($M(e, r, yj(n, r), t));
	return r.append(i), r;
}
function QM(e) {
	return e.unit === "second" ? [
		"hour",
		"minute",
		"second"
	] : e.unit === "hour" ? ["hour"] : ["hour", "minute"];
}
function $M(e, t, n, r) {
	let i = AM("div", VM);
	i.setAttribute(WM, t), i.setAttribute("role", "listbox"), i.setAttribute("aria-label", D.text(t === "hour" ? "ui.picker.hours" : t === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"));
	let a = t === "hour" ? 24 : 60, o = r === null ? null : bj(r, t), s = t === "hour" && Tj(_j(e)), c = Sj(e), l = null;
	for (let u = 0; u < a; u += n) {
		let n = AM("button", BM);
		n.type = "button", n.tabIndex = -1, n.textContent = t === "hour" ? Ej(u, s, c) : String(u).padStart(2, "0"), n.setAttribute(GM, String(u)), n.setAttribute("role", "option"), n.setAttribute("aria-selected", u === o ? "true" : "false"), u === o && n.classList.add(`${BM}--selected`), _N(e, t, u, r) ? n.disabled = !0 : (l === null || u === o) && (l = n), i.append(n);
	}
	return l !== null && (l.tabIndex = 0), i;
}
function eN(e) {
	let t = e.querySelector(`.${K}__calendar`), n = e.querySelector(`.${K}__time-columns`);
	t !== null && n !== null && (n.style.maxHeight = `${t.clientHeight}px`);
}
function tN(e) {
	for (let t of e.querySelectorAll(`.${VM}`)) {
		let e = t.querySelector(`.${BM}--selected`) ?? t.firstElementChild;
		if (!(e instanceof HTMLElement)) continue;
		let n = Math.max(0, (t.clientHeight - e.getBoundingClientRect().height) / 2);
		t.style.paddingTop = `${n}px`, t.style.paddingBottom = `${n}px`, nN(t, e), t.setAttribute(KM, String(t.scrollTop));
	}
}
function nN(e, t) {
	let n = t.getBoundingClientRect();
	e.scrollTop += n.top - e.getBoundingClientRect().top - (e.clientHeight - n.height) / 2;
}
function rN(e) {
	let t = e.getBoundingClientRect().top + e.clientHeight / 2, n = null, r = Infinity;
	for (let i of e.querySelectorAll(`.${BM}`)) {
		let e = i.getBoundingClientRect(), a = Math.abs(e.top + e.height / 2 - t);
		a < r && (r = a, n = i);
	}
	return n;
}
function iN(e) {
	let t = document.activeElement;
	return !(t instanceof HTMLElement) || !e.contains(t) || !t.classList.contains(BM) ? null : t.closest(`.${VM}`)?.getAttribute(WM) ?? null;
}
function aN(e) {
	let t = document.activeElement;
	return t instanceof HTMLElement && e.contains(t) ? t.getAttribute(iM) : null;
}
function oN(e, t) {
	if (t === null) return;
	let n = e.querySelector(`.${VM}[${WM}="${t}"]`)?.querySelector(`.${BM}--selected`) ?? null;
	n !== null && R(n);
}
function sN(e) {
	let t = AM("div", `${K}__popup-footer`);
	return t.append(kM("now", D.text(e === "date" ? "ui.picker.today" : "ui.picker.now"))), t.append(kM("clear", D.text("ui.picker.clear"))), t.append(kM("done", D.text("ui.picker.done"))), t;
}
function cN() {
	return {
		year: lN("ui.picker.letter.year", Ts.year),
		month: lN("ui.picker.letter.month", Ts.month),
		day: lN("ui.picker.letter.day", Ts.day),
		hour: lN("ui.picker.letter.hour", Ts.hour),
		minute: lN("ui.picker.letter.minute", Ts.minute),
		second: lN("ui.picker.letter.second", Ts.second)
	};
}
function lN(e, t) {
	let n = D.lookup(e);
	return n === void 0 || n.trim().length === 0 ? t : n;
}
function uN(e, t) {
	for (let n of e.querySelectorAll(`.${IM}`)) if (kj(n) === t) return n;
	return e.querySelector(`.${IM}`);
}
function dN(e) {
	let t = document.activeElement;
	t instanceof HTMLElement && t.classList.contains(BM) && mp(e);
}
function fN(e, t) {
	if (!Hu(e.key, "both")) return;
	e.preventDefault();
	let n = hM(t, e.key);
	Wu([...n?.parentElement?.children ?? []], n);
}
function pN(e) {
	let t = e.target, n = t.closest(`.${VM}`);
	if (n === null) return;
	let r = e.key === "ArrowLeft" || e.key === "ArrowRight" ? hN(n, e.key === "ArrowRight" ? 1 : -1) : mN(n, t, e.key);
	r !== null && (e.preventDefault(), r.focus({ preventScroll: !0 }), gN(r));
}
function mN(e, t, n) {
	let r = [...e.querySelectorAll(`.${BM}`)];
	return n === "PageUp" || n === "PageDown" ? Df(n, r.filter(P), t, "vertical") ?? t : Vu({
		key: n,
		items: r,
		current: t,
		axis: "vertical",
		loop: !1
	});
}
function hN(e, t) {
	let n = [...e.parentElement?.querySelectorAll(`.${VM}`) ?? []], r = n[n.indexOf(e) + t];
	return r === void 0 ? null : r.querySelector(`.${BM}--selected`) ?? r.querySelector(`.${BM}:not(:disabled)`);
}
function gN(e) {
	let t = e.closest(`.${VM}`);
	t !== null && (nN(t, e), t.setAttribute(KM, String(t.scrollTop)));
}
function _N(e, t, n, r) {
	let i = Mj(e, $A), a = Mj(e, ej);
	if (i === null && a === null) return !1;
	let o = xj(r ?? Jj(e), t, n), s = new Date(o), c = new Date(o);
	return t === "hour" ? (s.setMinutes(0, 0, 0), c.setMinutes(59, 59, 999)) : t === "minute" && (s.setSeconds(0, 0), c.setSeconds(59, 999)), i !== null && c.getTime() < i.getTime() || a !== null && s.getTime() > a.getTime();
}
//#endregion
//#region src/rendering/theme-choice.ts
var vN = `[${Gr}="${qr}"] [${Kr}]`, yN = "ui-theme-switcher__label-text--current";
function bN() {
	let e = document.documentElement.getAttribute(Vr);
	return e === "light" || e === "dark" ? e : "auto";
}
function xN(e, t) {
	let n = e.getAttribute(Kr) === t;
	if (e.getAttribute("role") === "option") {
		let t = n ? "true" : "false";
		e.getAttribute("aria-selected") !== t && e.setAttribute("aria-selected", t);
	} else e.classList.toggle(yN, n);
}
//#endregion
//#region src/interactions/popup-list.ts
var SN = new fT();
function CN(e, t, n, r, i = !1, a = !0) {
	let o = r ?? (a ? null : n.find(P) ?? null);
	o !== null && N(n, o);
	let s = e.open({
		...t,
		focus: a && r !== null ? r : !1
	});
	return s && a && r === null && Ap(t.popup, n, i), s;
}
function wN(e, t) {
	let n = e.target instanceof HTMLElement && t.includes(e.target) ? e.target : null, r = pT(e);
	if (r !== null) return e.preventDefault(), Wu(t, EN(t, n, r)), !0;
	if (!Hu(e.key, "vertical") || !M(e)) return !1;
	let i = Vu({
		key: e.key,
		items: t,
		current: n,
		axis: "vertical"
	});
	return i !== null && e.preventDefault(), Wu(t, i), !0;
}
var TN = {
	character: pT,
	entry: EN
};
function EN(e, t, n) {
	let r = e.filter(P), i = r[0]?.parentElement;
	return i == null ? null : SN.next({
		owner: i,
		character: n,
		entries: r,
		current: t,
		words: Fg,
		context: i
	});
}
function DN(e, t) {
	e !== document.activeElement && P(e) && (N(t, e), mp(e));
}
//#endregion
//#region src/interactions/switcher-list.ts
var ON = class {
	parts;
	selector;
	menus;
	constructor(e) {
		this.parts = e, this.selector = `[${e.attribute}]`, this.menus = new y_({
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
		CN(this.menus, {
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
		i !== null && t(n, r) && !this.menus.isOpen(n) && (e.key === "ArrowDown" || e.key === "ArrowUp") && M(e) ? (e.preventDefault(), this.open(n, i, e.key === "ArrowUp")) : this.menus.isOpen(n) && wN(e, r);
	}
	handlePointerMove(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${this.parts.choiceClass}`), n = t === null ? null : this.switcherOf(t);
		t !== null && n !== null && this.menus.isOpen(n) && DN(t, this.choicesOf(n));
	}
}, kN = `[${Gr}="${qr}"]`, AN = "ui-theme-switcher__choice", jN = class {
	options;
	root;
	list = new ON({
		attribute: Gr,
		menuClass: "ui-theme-switcher__menu",
		choiceClass: AN,
		openClass: "ui-theme-switcher--open",
		triggerSelector: `.${Ai}`
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.list.handleKeyDown(e, (e) => this.list.isField(e))), this.root.addEventListener("pointermove", (e) => this.list.handlePointerMove(e)), new MutationObserver(() => this.showTheme()).observe(document.documentElement, {
			attributes: !0,
			attributeFilter: [Vr]
		}), B(this.root, kN, {
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
			e.preventDefault(), this.apply(MN() === "dark" ? "Light" : "Dark");
			return;
		}
		let n = e.target.closest(`.${AN}`);
		if (n !== null) {
			e.preventDefault(), this.choose(t, n.getAttribute(Kr));
			return;
		}
		let r = e.target.closest(`.${Ai}`);
		r === null || O(r) || (e.preventDefault(), this.list.toggle(t, r));
	}
	choose(e, t) {
		this.list.close(e), t !== null && this.apply(t === "light" ? "Light" : t === "dark" ? "Dark" : null);
	}
	apply(e) {
		this.options.effects.apply({
			effect: {
				kind: $i.SetTheme,
				mode: e
			},
			dom: this.options.dom
		});
	}
	showTheme(e) {
		let t = bN();
		if (e === void 0) for (let e of this.root.querySelectorAll(vN)) xN(e, t);
		else for (let n of e) for (let e of n.querySelectorAll(`[${Kr}]`)) xN(e, t);
	}
};
function MN() {
	let e = bN();
	return e === "light" || e === "dark" ? e : window.matchMedia?.("(prefers-color-scheme: dark)").matches === !0 ? "dark" : "light";
}
//#endregion
//#region src/interactions/language-switcher-engine.ts
var NN = `.ui-language-switcher__trigger, .${Ai}`, PN = "ui-language-switcher__label-text", FN = "ui-language-switcher__label-text--current", IN = "ui-language-switcher__label-text--page", LN = "ui-language-switcher__choice", RN = "ui.language.switch", zN = "ui.language.current", BN = class {
	options;
	root;
	list = new ON({
		attribute: Wr,
		menuClass: "ui-language-switcher__menu",
		choiceClass: LN,
		openClass: "ui-language-switcher--open",
		triggerSelector: NN
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.list.handleKeyDown(e, (e, t) => this.opensList(e, t))), this.root.addEventListener("pointermove", (e) => this.list.handlePointerMove(e)), D.onChange(() => this.showLanguage(D.language));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${LN}`), n = this.list.switcherOf(e.target);
		if (n === null) return;
		if (t !== null) {
			e.preventDefault(), this.choose(n, t.getAttribute(Jr));
			return;
		}
		let r = e.target.closest(NN);
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
				kind: $i.SetLanguage,
				language: t
			},
			dom: this.options.dom
		});
	}
	showLanguage(e) {
		for (let t of this.root.querySelectorAll(`[${Wr}]`)) {
			let n = t.querySelector(`:scope > :is(${NN})`);
			if (n === null) continue;
			let r = this.list.choicesOf(t), i = this.list.chosenAttribute(t);
			for (let t of r) t.setAttribute(i, t.getAttribute("data-ui-language") === e ? "true" : "false");
			for (let t of n.querySelectorAll(`.${PN}`)) {
				let n = t.getAttribute(Jr) === e;
				t.classList.toggle(FN, n), t.classList.contains(IN) && t.toggleAttribute("hidden", !n);
			}
			if (this.list.isField(t)) continue;
			let a = VN(Pc(t, Re)), o = (r.find((t) => t.getAttribute("data-ui-language") !== e) ?? r[0]).getAttribute("data-ui-language") ?? "", [s, c] = r.length === 2 ? [RN, {
				language: HN(r, e),
				code: UN(e),
				other: HN(r, o),
				otherCode: UN(o)
			}] : [zN, {
				language: HN(r, e),
				code: UN(e)
			}];
			D.write(n, "aria-label", s, c), a && D.write(t, Re, s, c);
		}
	}
};
function VN(e) {
	return E(e) && (e.key === RN || e.key === zN);
}
function HN(e, t) {
	let n = e.find((e) => e.getAttribute(Jr) === t)?.textContent;
	if (n != null && n.length > 0) return n;
	try {
		let e = new Intl.DisplayNames([t], { type: "language" }).of(t) ?? t;
		return e.charAt(0).toLocaleUpperCase(t) + e.slice(1);
	} catch {
		return UN(t);
	}
}
function UN(e) {
	return e.split("-")[0].toUpperCase();
}
//#endregion
//#region src/interactions/action-bar.ts
var WN = `${Me}__button`, GN = `${Me}__more`, KN = `${WN}--icon`, qN = "ui-text__icon", JN = `.ui-button__content .${qN}`, YN = ".ui-button__content .ui-text__title", XN = /* @__PURE__ */ new WeakMap();
function ZN(e) {
	let t = [], n = !1;
	for (let r of e.querySelectorAll(Hn)) QN(r, e) && (r.hasAttribute("data-ui-in-action-bar") && !r.matches("[data-ui-menu-group] > .ui-menu-item") ? t.push(r) : n = !0);
	return {
		entries: t,
		more: n
	};
}
function QN(e, t) {
	for (let n = e; n !== null && n !== t; n = n.parentElement) if (!n.hasAttribute("data-ui-menu-left-out") && getComputedStyle(n).display === "none") return !1;
	return getComputedStyle(e).visibility !== "hidden";
}
function $N(e, t) {
	let n = t.entries.map((e) => eP(e, t));
	return t.more && t.openMore !== void 0 && n.push(nP(t.openMore)), e.replaceChildren(...n), n;
}
function eP(e, t) {
	let n = rP(WN), r = aP(e), i = tP(e);
	return i === null ? n.textContent = r : (n.classList.add(KN), n.append(i), n.setAttribute("aria-label", r)), t.role === "menuitem" && n.setAttribute("role", "menuitem"), O(e) && (n.classList.add(bi), n.setAttribute("aria-disabled", "true")), e.getAttribute("data-ui-menu-item-kind") === "check" && n.setAttribute("aria-pressed", e.getAttribute("aria-checked") === "true" ? "true" : "false"), XN.set(n, e), n.addEventListener("click", () => t.press(e, n)), n;
}
function tP(e) {
	let t = e.querySelector(JN);
	if (t === null || !t.className.split(" ").some(vo)) return null;
	let n = document.createElement("span");
	n.className = t.className, n.classList.remove(qN), n.setAttribute(mo, ""), n.setAttribute("aria-hidden", "true");
	let r = t.style.getPropertyValue(ho);
	return r.length > 0 && n.style.setProperty(ho, r), n;
}
function nP(e) {
	let t = rP(`${WN} ${GN}`);
	return t.setAttribute("aria-haspopup", "menu"), D.write(t, "aria-label", "ui.actionbar.more"), t.addEventListener("click", () => e(t)), t;
}
function rP(e) {
	let t = document.createElement("button");
	return t.setAttribute("type", "button"), t.className = `${e} ${Fi}`, t.tabIndex = -1, t;
}
function iP(e) {
	return XN.get(e) ?? null;
}
function aP(e) {
	return e.querySelector(YN)?.textContent?.trim() ?? "";
}
//#endregion
//#region src/interactions/long-press.ts
var oP = 500, sP = 150, cP = 10, lP = /* @__PURE__ */ new WeakSet(), uP = "ui-long-press-hold", dP = "ui-long-press-hold-end";
function fP(e) {
	return lP.has(e);
}
var pP = class {
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
		let n = e.target, r = t.clientX ?? 0, i = t.clientY ?? 0, a = this.shows === void 0 ? null : setTimeout(() => this.showHold(), sP);
		this.press = {
			pointerId: t.pointerId ?? 0,
			x: r,
			y: i,
			target: n,
			timer: setTimeout(() => this.fireHeld(), oP),
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
		}, t.dispatchEvent(new CustomEvent(uP, {
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
		(t.part.isConnected ? t.part : this.root).dispatchEvent(new CustomEvent(dP, {
			bubbles: !0,
			detail: n
		}));
	}
	handleMove(e) {
		let t = e, n = this.press, r = this.openedAt;
		r !== null && t.pointerId === r.pointerId && Math.hypot((t.clientX ?? r.x) - r.x, (t.clientY ?? r.y) - r.y) > cP && (this.slid = !0, (this.answered?.closest("[data-ui-splitting]") ?? null) !== null && this.leaveMenuToDrag()), n !== null && t.pointerId === n.pointerId && Math.hypot((t.clientX ?? n.x) - n.x, (t.clientY ?? n.y) - n.y) > cP && this.cancel();
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
		lP.add(t), e.target.dispatchEvent(t), this.answered = t.defaultPrevented ? e.target : null, this.openedAt = this.answered === null ? null : {
			pointerId: e.pointerId,
			x: e.x,
			y: e.y
		}, this.endHold(this.answered !== null);
	}
	handleContextMenu(e) {
		if (lP.has(e)) return;
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
		this.dragging && n !== null && t.clientX !== void 0 && t.clientY !== void 0 && Math.hypot(t.clientX - n.x, t.clientY - n.y) > cP && this.leaveMenuToDrag();
	}
	endDrag() {
		this.dragging = !1;
	}
	handleClick(e) {
		let t = e.target instanceof Element ? e.target : null;
		this.answered === null || t === null || this.slid && t.closest("[data-ui-context-menu]") !== null || (this.answered = null, e.preventDefault(), e.stopImmediatePropagation());
	}
}, mP = [
	Hm("md"),
	Hm("xl"),
	Hm("xxl")
], hP = {
	md: Hm("md"),
	xl: Hm("xl"),
	xxl: Hm("xxl")
}, gP = Hm("md");
function _P(e, t) {
	return vP(e) && !(e.hasAttribute(Dn(t)) && !bP(e, t) && yP(gP));
}
function vP(e) {
	let t = e.getAttribute(Tn);
	if (t === null) return !1;
	let n = hP[t];
	return n === void 0 || !yP(n);
}
function yP(e) {
	return typeof matchMedia == "function" && matchMedia(e).matches;
}
function bP(e, t) {
	return e.querySelector(`:scope > [${Mn}="${Ji(t)}"][${On}]`) !== null;
}
//#endregion
//#region src/state/client-store.ts
var xP = "ne.ui", SP = "boot", CP = /* @__PURE__ */ new Set(), wP = class {
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
		let r = this.resolveKey(e, SP);
		if (r !== null) try {
			let e = TP(window.localStorage.getItem(r));
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
			return CP.has(n) || (CP.add(n), l("client state is not kept for a component with no authored id.", {
				slot: t,
				component: e
			})), null;
		}
		return `${xP}:${n}:${t}`;
	}
};
function TP(e) {
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
var EP = "menu-current", DP = `[${un}]`;
function OP(e) {
	for (let t = e.closest(DP); t !== null; t = t.parentElement?.closest(DP) ?? null) AP(t);
}
function kP(e) {
	for (let t of e.querySelectorAll(DP)) AP(t);
	OP(e);
}
function AP(e) {
	let t = e.querySelector(`.${Ln}`) !== null;
	e.hasAttribute("data-ui-menu-holds-current") !== t && e.toggleAttribute(pn, t);
}
//#endregion
//#region src/updates/menu-icons.ts
var jP = "menu-icons", MP = "ui-menu__host", NP = `:scope > :not([${hn}]) > .${Fn}[${Bi}]`;
function PP(e) {
	let t = e.closest(`.${MP}`);
	t !== null && IP(t);
}
function FP(e) {
	for (let t of e.querySelectorAll(`.${MP}`)) IP(t);
}
function IP(e) {
	let t = e.querySelector(NP) !== null;
	e.hasAttribute("data-ui-menu-icons") !== t && e.toggleAttribute(mn, t);
}
//#endregion
//#region src/interactions/menu-group-engine.ts
var LP = "ui-menu__submenu", RP = un, zP = fn, BP = "data-ui-menu-flyout", VP = `[${BP}], ${Ei}`, HP = "data-ui-menu-unfolded", UP = dn, WP = "data-ui-menu-rail-list", GP = "left-side", KP = "[data-ui-root]", qP = "menu-open-group", JP = z.normal * 5, YP = Ze("click"), XP = class {
	root;
	store = new wP();
	seenCollapsed = /* @__PURE__ */ new WeakMap();
	flyouts = new y_({
		show: ({ owner: e, popup: t }) => {
			e.setAttribute(zP, ""), t.setAttribute(BP, "");
		},
		hide: ({ owner: e, popup: t }) => {
			e.removeAttribute(zP), queueMicrotask(() => zm(t, JP, () => {
				this.flyouts.isOpen(e) || t.removeAttribute(BP);
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
		let t = this.root.querySelectorAll(`.${Pn}`);
		tF(t), this.reconcileEach(t);
		for (let e of t) kP(e), FP(e);
		B(this.root, `.${Pn}`, {
			childList: !0,
			attributeFilter: [ln]
		}, (e) => {
			tF(e), this.reconcileEach(e);
			for (let t of e) kP(t), FP(t);
		});
		for (let e of this.root.querySelectorAll(`[${RP}]`)) ZP(e);
		if (B(this.root, `[${RP}]`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [zP]
		}, (e) => {
			for (let t of e) ZP(t);
		}), typeof matchMedia == "function") for (let e of mP) matchMedia(e).addEventListener("change", () => {
			this.closeBarFlyout(), this.refitDrawerRails();
		});
		B(this.root, KP, { attributeFilter: [Dn(GP)] }, () => this.refitDrawerRails());
	}
	refitDrawerRails() {
		let e = this.root.querySelectorAll(`[${kn}] .${Pn}`);
		tF(e), this.reconcileEach(e);
	}
	closeBarFlyout() {
		let e = this.flyouts.current;
		e !== null && e.closest("[data-ui-bottom-bar]") !== null && this.flyouts.close(e);
	}
	reconcileEach(e) {
		for (let t of e) {
			let e = sF(t), n = this.seenCollapsed.get(t);
			n !== e && (this.seenCollapsed.set(t, e), n === void 0 ? this.restore(t, e) : this.handleCollapsedChange(t, e));
		}
	}
	restore(e, t) {
		t ? this.closeGroups(e) : this.openResolvedGroup(e);
	}
	handleCollapsedChange(e, t) {
		this.flyouts.close(), QP(e), this.closeGroups(e), e.hasAttribute("data-ui-folding") && e.setAttribute(HP, ""), t || this.openResolvedGroup(e);
		for (let t of e.querySelectorAll(`[${RP}]`)) ZP(t);
	}
	openResolvedGroup(e) {
		let t = this.groupOf(e.querySelector(`.${Ln}`), e);
		if (t !== null && !t.hasAttribute(UP)) {
			this.openInline(t);
			return;
		}
		let n = e.classList.contains("ui-menu--nested") ? null : this.store.read(e, qP), r = n === null ? null : this.findGroup(e, n);
		r !== null && this.openInline(r);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Fn}`), n = this.flyouts.current, r = n === null ? null : this.submenuOf(n);
		if (r !== null && r.contains(e.target)) {
			t !== null && r.contains(t) && nF(t) && this.flyouts.close();
			return;
		}
		let i = t === null ? null : this.ownGroupOf(t);
		if (t === null || i === null) {
			this.flyouts.close();
			return;
		}
		e.preventDefault();
		let a = i.closest(`.${Pn}`);
		a !== null && (oF(i) ? this.toggleFlyout(a, i, t) : this.toggleInline(a, i));
	}
	toggleInline(e, t) {
		let n = e.classList.contains(zn);
		e.setAttribute(HP, ""), t.closest("[data-ui-menu-searching]") === null ? t.hasAttribute(zP) ? (t.removeAttribute(zP), n || this.store.write(e, qP, null)) : (this.closeGroups(e), this.openInline(t), n || this.store.write(e, qP, t.getAttribute(b))) : t.toggleAttribute(zP);
	}
	openInline(e) {
		e.setAttribute(zP, "");
	}
	closeGroups(e) {
		for (let t of e.querySelectorAll(`[${RP}][${zP}]`)) t.hasAttribute(UP) || t.removeAttribute(zP);
	}
	toggleFlyout(e, t, n) {
		let r = this.submenuOf(t);
		if (r === null) return;
		let i = this.flyouts.isOpen(t);
		if (this.flyouts.close(), i) return;
		QP(e), this.closeGroups(e);
		let a = n.closest(VP) ?? void 0;
		if (!this.flyouts.open({
			owner: t,
			popup: r,
			anchor: n,
			placement: {
				placement: `${$P(e)}-start`,
				surface: a,
				alignEntries: !0
			}
		})) return;
		let o = r.querySelector(`:scope > .${Pn}`);
		o !== null && !sp() && Ap(o, rF(o));
	}
	findGroup(e, t) {
		for (let n of e.querySelectorAll(`[${RP}]`)) if (n.getAttribute("data-ui-key") === t) return n;
		return null;
	}
	ownGroupOf(e) {
		return e.matches("[data-ui-menu-group] > .ui-menu-item") ? e.parentElement : null;
	}
	groupOf(e, t) {
		let n = e?.closest(`[${RP}]`) ?? null;
		return n !== null && t.contains(n) ? n : null;
	}
	submenuOf(e) {
		return e.querySelector(`:scope > .${LP}`);
	}
};
function ZP(e) {
	let t = e.querySelector(`:scope > .${Fn}`);
	t !== null && (t.setAttribute(YP, ""), t.setAttribute(Qe, ""), t.setAttribute("aria-expanded", e.hasAttribute(zP) ? "true" : "false"), oF(e) ? t.setAttribute("aria-haspopup", "menu") : t.removeAttribute("aria-haspopup"));
}
function QP(e) {
	for (let t of e.querySelectorAll(`[${BP}]`)) t.removeAttribute(BP);
}
function $P(e) {
	return eF(e) ? "top" : e.classList.contains("ui-side--right") ? "left" : e.classList.contains("ui-side--top") ? "bottom" : e.classList.contains("ui-side--bottom") ? "top" : "right";
}
function eF(e) {
	let t = e.closest(`[${On}]`);
	return e.classList.contains("ui-menu--rail") && t?.parentElement !== null && t?.parentElement !== void 0 && typeof matchMedia == "function" && _P(t.parentElement, GP);
}
function tF(e) {
	for (let t of e) {
		let e = t.closest(`[${kn}]`);
		if (!t.classList.contains("ui-menu--rail") && !t.hasAttribute(WP) || e?.parentElement === null || e?.parentElement === void 0) continue;
		let n = typeof matchMedia == "function" && _P(e.parentElement, GP);
		t.classList.toggle(Rn, !n), t.toggleAttribute(WP, n);
	}
}
function nF(e) {
	let t = e.closest(`.${Fn}`);
	return t !== null && t.matches(".ui-menu-item:not([data-ui-menu-item-kind=\"header\"], [data-ui-menu-item-kind=\"separator\"])") && !t.matches("[data-ui-menu-group] > .ui-menu-item, .ui-menu-item[data-ui-menu-item-kind=\"check\"]") && !O(t);
}
function rF(e) {
	let t = [];
	for (let n of ud(e)) {
		t.push(n);
		let e = n.matches("[data-ui-menu-group] > .ui-menu-item") ? n.parentElement : null, r = e === null || !e.hasAttribute(zP) || oF(e) ? null : e.querySelector(`:scope > .${LP} > .${Pn}`);
		r !== null && t.push(...rF(r));
	}
	return t;
}
function iF(e) {
	let t = aF(e), n = t?.closest(".ui-menu") ?? null;
	return t === null || n === null || oF(t) ? e : iF(n);
}
function aF(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(LP) && t.parentElement?.hasAttribute(RP) === !0 ? t.parentElement : null;
}
function oF(e) {
	let t = e.closest(`.${Pn}`);
	return e.hasAttribute(UP) || t !== null && sF(t);
}
function sF(e) {
	return e.hasAttribute("data-ui-collapsed") || e.classList.contains("ui-menu--rail");
}
var cF = "tabs:rename", lF = "tabs:pin", uF = "tabs:unpin", dF = "tabs:close", fF = "tabs:delete";
function pF(e) {
	let t = (e ?? "").split(/\s+/);
	return {
		rename: t.includes("rename"),
		pin: t.includes("pin"),
		close: t.includes("close"),
		delete: t.includes("delete")
	};
}
function mF(e, t) {
	let n = !t.pinned && t.removable;
	return /* @__PURE__ */ new Map([
		[cF, e.rename && t.renamable],
		[lF, e.pin && !t.pinned],
		[uF, e.pin && t.pinned],
		[dF, e.close && !e.delete && n],
		[fF, e.delete && n]
	]);
}
function hF(e) {
	let t = e.map(() => !1), n = !1, r = -1;
	for (let i = 0; i < e.length; i++) e[i] === "rule" ? n && r === -1 && (r = i) : e[i] === "shown" && (r !== -1 && (t[r] = !0), r = -1, n = !0);
	return t;
}
function gF(e, t) {
	return typeof e == "string" ? [...t, e] : null;
}
//#endregion
//#region src/interactions/context-menu-engine.ts
var _F = Se, vF = "ui-context-menu--open", yF = `${Me}--strip`, bF = `.${Me}:not(.${yF}) > .${GN}`, xF = "ui-context-menu-opening", SF = null, CF = /* @__PURE__ */ new WeakSet();
function wF(e) {
	SF = e;
}
var TF = class {
	root;
	components;
	closed = null;
	menus = new y_({
		show: ({ popup: e }) => e.classList.add(vF),
		hide: ({ popup: e }, t) => {
			e.classList.remove(vF), this.closed = e, t === "outside" && GF();
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e),
		onPress: !0,
		onWindowBlur: !0,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, new pP({
			root: this.root,
			first: typeof window > "u" ? void 0 : window,
			holds: (e) => e.closest("[data-ui-context-menu-owner]") !== null && !Du(e),
			closeMenu: () => this.menus.close(this.menus.current, "outside"),
			shows: OF
		}), this.root.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), this.root.addEventListener("click", (e) => this.handleInside(e), !1);
	}
	get openMenu() {
		let e = this.menus.current;
		return e === null ? null : this.menus.popupOf(e);
	}
	handleContextMenu(e) {
		if (!(e instanceof MouseEvent) || !(e.target instanceof Element)) return;
		let t = !sp() && !fP(e), n = (t ? AF() : null) ?? e.target;
		if (this.openMenu !== null && e.composedPath().includes(this.openMenu)) {
			e.preventDefault();
			return;
		}
		let r = EF(n);
		if (r === null) return;
		e.preventDefault();
		let i = RF(e) ? n : null, a = n.closest(bF), o = t ? jF(n) : null, s = () => this.open(r.owner, r.menu, e.clientX, e.clientY, i, a, o);
		CF.delete(r.menu) ? queueMicrotask(s) : s();
	}
	open(e, t, n, r, i, a, o) {
		this.menus.close(), t.querySelector(`:scope > .${yF}`)?.remove(), zF(t), i !== null && BF(e, t, i), a?.closest("[data-ui-action-bar]")?.hasAttribute("data-ui-action-bar-rest") === !0 && HF(t), this.closed !== null && (Rm(this.closed), this.closed = null);
		let s = (document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null) ?? op(), c = a ?? o, l = {
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
			returnFocus: () => (s === null ? null : jp(s, this.components)) ?? jp(e, this.components)
		}) && (c === null && Kh(t, n, r), WF(t));
	}
	handleInside(e) {
		this.openMenu !== null && e.composedPath().includes(this.openMenu) && e.target instanceof Element && nF(e.target) && this.menus.close();
	}
};
function EF(e) {
	for (let t of DF(e)) {
		let n = NF(t, e).find((t) => IF(t, e, !1));
		if (n !== void 0) return {
			owner: t,
			menu: n
		};
	}
	return null;
}
function* DF(e) {
	let t = e.closest(`[${ue}]`);
	for (let n = e.closest(`[${Ce}]`); n !== null; n = n.parentElement?.closest("[data-ui-context-menu-owner]") ?? null) {
		if (t !== null && n.contains(t)) return;
		if (PF(n, e) && !O(n)) {
			if (qF(n)) return;
			yield n;
		}
	}
}
function OF(e) {
	let t = DF(e).next();
	if (t.done === !0) return null;
	let n = t.value, r = e.closest(md);
	return r !== null && r !== n && n.contains(r) ? I(r) ?? r : n;
}
var kF = `[${Ce}]`;
function AF() {
	let e = document.activeElement;
	if (e === null || e === document.body) return null;
	let t = Yd(e);
	if (t === null || t.row !== null && t.row !== e) return e;
	let n = t.row ?? nf(t.root);
	return n === null ? t.root : MF(n);
}
function jF(e) {
	let t = e.closest(md);
	return t === null ? e : I(t) ?? t;
}
function MF(e) {
	if (e.matches(kF)) return e;
	for (let t of e.querySelectorAll(kF)) if (t.closest(md) === e) return t;
	return e;
}
function NF(e, t) {
	return FF(e, t).map((t) => KF(e, t)).filter((e) => e !== null);
}
function PF(e, t) {
	return FF(e, t).some((t) => KF(e, t, !1) !== null || t.length === 0 && e.hasAttribute("data-ui-context-menu-later"));
}
function FF(e, t) {
	let n = t.closest(`[${Ee}]`), r = n !== null && e.contains(n) ? n.getAttribute("data-ui-context-menu-use") ?? "" : "";
	return r.length > 0 ? [r, ""] : [""];
}
function IF(e, t, n) {
	let r = new CustomEvent(xF, {
		bubbles: !0,
		cancelable: !0,
		detail: {
			target: t,
			actionBar: n
		}
	});
	return e.dispatchEvent(r);
}
function LF(e, t) {
	let n = e.closest(`[${Ce}]`), r = e.closest(`[${ue}]`);
	return n === null || O(n) || qF(n) || r !== null && n.contains(r) ? null : NF(n, e).find((n) => IF(n, e, t)) ?? null;
}
function RF(e) {
	let t = e.pointerType;
	return fP(e) ? !0 : typeof t == "string" && t.length > 0 ? t === "touch" : cp();
}
function zF(e) {
	for (let t of e.querySelectorAll(`[${Ae}]`)) t.removeAttribute(Ae);
}
function BF(e, t, n) {
	let r = n.closest(`[${De}]`);
	if (r === null || n.closest(".ui-action-bar") !== null || !e.contains(r) || !NF(e, r).includes(t)) return;
	let { entries: i } = ZN(t);
	if (i.length === 0) return;
	let a = document.createElement("div");
	a.className = `${Me} ${yF}`, a.setAttribute("role", "group"), $N(a, {
		entries: i,
		more: !1,
		role: "menuitem",
		press: VF
	}), t.insertBefore(a, t.firstElementChild);
}
function VF(e) {
	O(e) || e.click();
}
function HF(e) {
	let { entries: t } = ZN(e), n = e.querySelector(`.${Pn}`);
	if (t.length === 0 || n === null) return;
	for (let e of t) UF(e);
	let r = ld(n, `.${Fn}`, `.${Pn}`).filter((t) => t.closest("[data-ui-menu-left-out]") === null && QN(t, e)), i = [];
	for (let [e, t] of r.entries()) {
		let n = r[e + 1];
		t.getAttribute("data-ui-menu-item-kind") === "header" && (n === void 0 || n.matches("[data-ui-menu-item-kind=\"header\"], [data-ui-menu-item-kind=\"separator\"]")) ? UF(t) : i.push(t);
	}
	let a = i.map((e) => {
		let t = e.getAttribute(Nn);
		return t === "separator" ? "rule" : t === "header" ? "hidden" : "shown";
	});
	hF(a).forEach((e, t) => {
		a[t] === "rule" && !e && UF(i[t]);
	});
}
function UF(e) {
	let t = e.parentElement;
	(t !== null && t.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t : e).setAttribute(Ae, "");
}
function WF(e) {
	let t = e.querySelector(`.${Pn}`);
	t !== null && Ap(e, rF(t));
}
function GF() {
	let e = (e) => {
		e.target instanceof Element && e.target.closest(`${Wf}, [contenteditable='true']`) === null && e.preventDefault();
	};
	document.addEventListener("mousedown", e, {
		capture: !0,
		once: !0
	}), setTimeout(() => document.removeEventListener("mousedown", e, !0));
}
function KF(e, t, n = !0) {
	for (let n of e.querySelectorAll(`[${_F}]`)) if ((n.getAttribute(_F) ?? "") === t && n.closest("[data-ui-context-menu-owner]") === e) return n;
	if (!n || t.length > 0 || SF === null || !e.hasAttribute("data-ui-context-menu-later")) return null;
	let r = SF(e);
	return r !== null && CF.add(r), r;
}
function qF(e) {
	if (e.hasAttribute("data-ui-no-context-menu")) return !0;
	let t = e.closest(`[${x}]`);
	if (t === null) return !1;
	let n = e;
	for (; n.parentElement !== null && n.parentElement !== t;) n = n.parentElement;
	return Xc(n, "data-ui-no-context-menu") || t.closest("[data-ui-id]")?.hasAttribute("data-ui-no-context-menu") === !0;
}
//#endregion
//#region src/interactions/element-visibility.ts
function JF(e, t) {
	let n = getComputedStyle(e), r = t ? n.overflowY : n.overflowX;
	return r === "auto" || r === "scroll";
}
function YF(e) {
	return getComputedStyle(e).display !== "none";
}
function XF(e) {
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
				if (e.overflowX !== "visible" && $F(n, i, i + t.clientWidth, !0), e.overflowY !== "visible" && $F(n, a, a + t.clientHeight, !1), eI(n)) return !0;
			}
			r = e.position;
		}
	}
	return $F(n, 0, window.innerWidth, !0), $F(n, 0, window.innerHeight, !1), eI(n);
}
function ZF(e) {
	let t = getComputedStyle(e).position;
	for (let n = e.parentElement; n !== null && t !== "fixed"; n = n.parentElement) {
		let e = getComputedStyle(n);
		if (t !== "absolute" || e.position !== "static" || e.transform !== "none") {
			if ((!n.classList.contains("ui-scroll-y--disabled") || JF(n, !1)) && (QF(e.overflowX) || QF(e.overflowY))) return n;
			t = e.position;
		}
	}
	return null;
}
function QF(e) {
	return e === "hidden" || e === "auto" || e === "scroll";
}
function $F(e, t, n, r) {
	r ? (e.left = Math.max(e.left, t), e.right = Math.min(e.right, n)) : (e.top = Math.max(e.top, t), e.bottom = Math.min(e.bottom, n));
}
function eI(e) {
	return e.left > e.right || e.top > e.bottom;
}
//#endregion
//#region src/interactions/action-bar-engine.ts
var tI = `[${De}]`, nI = `.${Me}`, rI = `${Me}--out`, iI = `.ui-items-view__item, .${ir}`, aI = "ui-tree__node", oI = 6, sI = "--ui-action-bar-gap", cI = 400, lI = /* @__PURE__ */ new WeakMap(), uI = [
	"class",
	"style",
	"hidden",
	"aria-disabled",
	"aria-checked",
	je,
	..._i
], dI = class {
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
		if (n === null || n.closest(`${nI}, [data-ui-context-menu]`) !== null) return;
		let r = fI(n), i = r !== null && r !== this.chosen && pI(n, r) ? null : r;
		t.pointerType === "touch" ? this.pendingTap = {
			pointerId: t.pointerId ?? 0,
			host: i,
			identity: i === null ? null : yI(i)
		} : (t.button ?? 0) === 0 ? i !== null && i === this.chosen ? this.askAgain(i) : this.choose(i) : r !== this.chosen && this.choose(null);
	}
	handlePointerUp(e) {
		let t = this.pendingTap;
		if (this.pendingTap = null, t !== null && t.pointerId === (e.pointerId ?? 0)) {
			let e = t.host !== null && !t.host.isConnected && t.identity !== null ? bI(t.identity) : t.host;
			e !== null && e === this.chosen ? this.askAgain(e) : this.choose(e);
		}
		this.chosen !== null && (this.chosen.isConnected && !this.shown.has(this.chosen) || mg(this.chosen)) && this.sync();
	}
	handleContextMenu(e) {
		this.pendingTap = null, e instanceof MouseEvent && e.target instanceof Element && e.target.closest(nI) === null && RF(e) && this.choose(null);
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement ? e.target : null;
		if (t === null) return;
		let n = t.closest(nI);
		n === null ? sp() || this.isInOpenMenu(t) || this.menuHost !== null && t.contains(this.menuHost) || this.choose(_I(t)) : this.isHostedBar(n) && N(OI(n), t);
	}
	handleFocusOut(e) {
		let t = e.relatedTarget, n = t instanceof Element ? t.closest(nI) : null;
		n !== null && this.isHostedBar(n) && e.target instanceof HTMLElement && !n.contains(e.target) && (this.cameFrom = e.target);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || !(e.target instanceof HTMLElement)) return;
		let t = e.target;
		if (e.defaultPrevented) {
			t.matches(F) && this.choose(_I(t));
			return;
		}
		let n = t.closest(nI);
		if (n !== null && t.classList.contains(WN)) this.handleBarKey(e, n, t);
		else if (e.key === "Escape") {
			if (_u(e)) return;
			let n = t.closest(ug);
			(n === null || this.chosen !== null && n.contains(this.chosen)) && (this.chosen !== null && e.preventDefault(), this.choose(null));
		} else if (e.key === "Tab" && M(e) && t.matches(F)) {
			let n = this.chosen === null ? null : this.tabStopOf(this.chosen);
			n !== null && t.contains(n) && (e.preventDefault(), n.focus());
		} else t.matches(F) && this.choose(_I(t));
	}
	handleBarKey(e, t, n) {
		if (!M(e, { shift: !0 })) return;
		if (e.key === "Escape") {
			if (!this.isHostedBar(t)) return;
			let n = this.hostOfBar(t), r = this.cameFrom !== null && this.cameFrom.isConnected && MI(this.cameFrom) && n !== null && (n.contains(this.cameFrom) || this.cameFrom.contains(n)) ? this.cameFrom : jp(n, this.components);
			e.preventDefault(), r?.focus();
			return;
		}
		let r = OI(t), i = Vu({
			key: e.key,
			items: r,
			current: n,
			axis: "horizontal"
		});
		i !== null && (e.preventDefault(), Wu(r, i));
	}
	choose(e) {
		(e === null ? this.chosen === null && this.identity === null : e === this.chosen) || (this.chosen = e, this.identity = e === null ? null : yI(e), this.watchScope(), this.sync(), e !== null && this.makeRoomAbove(e));
	}
	makeRoomAbove(e) {
		let t = this.shown.get(e), n = ZF(e);
		if (t === void 0 || n === null || !JF(n, !0)) return;
		let r = Math.max(0, n.getBoundingClientRect().top + n.clientTop), i = Math.ceil(t.bar.getBoundingClientRect().height + SI(e) - (e.getBoundingClientRect().top - r));
		i <= 0 || i > n.scrollTop || (n.scrollTop -= i, vh(t.bar), this.markOut());
	}
	askAgain(e) {
		let t = this.shown.get(e);
		t === void 0 ? this.sync() : LF(e, !0) === null && this.hide(e, t);
	}
	watchScope() {
		this.scopeObserver?.disconnect(), this.scopeObserver = null, this.identity !== null && (this.scopeObserver = new MutationObserver((e) => {
			$h(e) || this.scopeChanged();
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
				this.chosen = bI(e), this.sync();
			}
			for (let e of this.shown.values()) vh(e.bar);
			this.markOut();
		}
	}
	sync() {
		this.chosen !== null && mg(this.chosen) && (this.chosen = null, this.identity = null, this.watchScope());
		for (let [e, t] of this.shown) (e !== this.chosen && e !== this.menuHost || !e.isConnected) && this.hide(e, t);
		for (let e of [this.chosen, this.menuHost]) e !== null && e.isConnected && !this.shown.has(e) && this.show(e);
	}
	show(e) {
		let t = LF(e, !0);
		if (t === null) return;
		let n = document.createElement("div");
		if (n.className = Me, n.setAttribute("role", "toolbar"), D.write(n, "aria-label", "ui.actionbar.label"), n.setAttribute(Qe, ""), n.setAttribute(fe, ""), !wI(n, t, (t) => this.openMore(e, t), !1)) return;
		e.insertBefore(n, DI(e)), sh(e, n, {
			placement: xI(e),
			gap: SI(e),
			boundary: ZF(e) ?? void 0
		}), n.classList.toggle(rI, XF(e));
		let r = new MutationObserver((t) => {
			$h(t) || this.redraw(e);
		});
		r.observe(t, {
			subtree: !0,
			childList: !0,
			characterData: !0,
			attributes: !0,
			attributeFilter: uI
		});
		let i = CI(e);
		i?.setAttribute(Pr, ""), this.shown.set(e, {
			bar: n,
			menu: t,
			observer: r,
			row: i
		}), lI.set(n, Date.now());
	}
	redraw(e) {
		let t = this.shown.get(e);
		if (t === void 0) return;
		let n = document.activeElement, r = n instanceof HTMLElement && t.bar.contains(n) ? n : null, i = r === null ? null : iP(r);
		if (!wI(t.bar, t.menu, (t) => this.openMore(e, t), e === this.menuHost)) {
			this.hide(e, t);
			return;
		}
		if (r === null) return;
		let a = OI(t.bar);
		Wu(a, a.find((e) => iP(e) === i) ?? a.find(P) ?? null);
	}
	openMore(e, t) {
		let n = this.shown.get(e);
		if (n === void 0 || AI(t)) return;
		if (this.menuHost = e, jI(t), !n.menu.classList.contains("ui-context-menu--open")) {
			this.menuHost = null;
			return;
		}
		TI(n.bar, !0);
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
		TI(t.bar, !1);
		let n = document.activeElement;
		!sp() && (n === null || n === document.body || e.contains(n) || n.contains(e)) && EI(t.bar)?.focus();
	}
	hide(e, t) {
		t.observer.disconnect(), yh(t.bar), t.bar.remove(), this.shown.delete(e), t.row !== null && ![...this.shown.values()].some((e) => e.row === t.row) && t.row.removeAttribute(Pr);
	}
	markOut() {
		for (let [e, t] of this.shown) t.bar.classList.toggle(rI, XF(e));
	}
	isInOpenMenu(e) {
		for (let t of this.shown.values()) if (t.menu.classList.contains("ui-context-menu--open") && t.menu.contains(e)) return !0;
		return !1;
	}
	tabStopOf(e) {
		let t = this.shown.get(e);
		return t === void 0 ? null : OI(t.bar).find((e) => e.tabIndex === 0) ?? null;
	}
	isHostedBar(e) {
		return this.hostOfBar(e) !== null;
	}
	hostOfBar(e) {
		for (let [t, n] of this.shown) if (n.bar === e) return t;
		return null;
	}
};
function fI(e) {
	let t = e.closest(tI);
	if (t !== null) return t;
	let n = e.closest(`[${b}]`), r = e.closest(S);
	return n === null || r !== null && !r.contains(n) ? null : vI(n)[0] ?? null;
}
function pI(e, t) {
	let n = Bu(e, t.closest("[data-ui-key]") ?? t);
	return n !== null && !hI(n, t);
}
var mI = `[${Se}], .${Me}, ${ki}`;
function hI(e, t) {
	if (e.contains(t)) return !0;
	for (let n = e; n !== t;) {
		let e = n.parentElement;
		if (e === null) return !1;
		let t = gI(e) - gI(n);
		for (let r of e.children) if (r !== n) {
			if (!r.matches(mI)) return !1;
			t -= gI(r);
		}
		if (t > 0) return !1;
		n = e;
	}
	return !0;
}
function gI(e) {
	return (e.textContent ?? "").replace(/s+/g, "").length;
}
function _I(e) {
	if (e instanceof HTMLElement && e.matches(F)) {
		let t = nf(e), n = t === null ? void 0 : vI(t)[0];
		if (n !== void 0) return n;
	}
	return e.closest(tI);
}
function vI(e) {
	let t = [...e.querySelectorAll(tI)];
	return e.matches(tI) ? [e, ...t] : t;
}
function yI(e) {
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
		index: vI(n).indexOf(e)
	};
}
function bI(e) {
	for (let t of e.scope.children) if (t.getAttribute(e.attribute) === e.key) return vI(t)[e.index] ?? null;
	return null;
}
function xI(e) {
	let t = e.getAttribute(De);
	if (t === "center") return "top";
	let n = getComputedStyle(e).direction === "rtl";
	return t === "start" === n ? "top-end" : "top-start";
}
function SI(e) {
	let t = Number.parseFloat(getComputedStyle(e).getPropertyValue(sI));
	return Number.isFinite(t) ? t : oI;
}
function CI(e) {
	if (e.classList.contains("ui-table__row")) return e;
	let t = e.parentElement;
	if (t === null) return null;
	if (t.matches(iI)) return t;
	let n = t.parentElement;
	return t.classList.contains(aI) && n !== null && n.classList.contains("ui-tree__row") ? n : null;
}
function wI(e, t, n, r) {
	let { entries: i, more: a } = ZN(t);
	if (i.length === 0 && !a) return !1;
	let o = $N(e, {
		entries: i,
		more: a,
		role: "button",
		press: kI,
		openMore: n
	});
	return N(o, o.find((e) => !O(e)) ?? o[0] ?? null), TI(e, r), !0;
}
function TI(e, t) {
	EI(e)?.setAttribute("aria-expanded", t ? "true" : "false");
}
function EI(e) {
	return OI(e).find((e) => iP(e) === null) ?? null;
}
function DI(e) {
	for (let t of e.children) if (t.hasAttribute("data-ui-context-menu")) return t;
	return null;
}
function OI(e) {
	return [...e.querySelectorAll(`:scope > .${WN}`)];
}
function kI(e, t) {
	if (O(t) || AI(t)) return;
	let n = LF(t, !1);
	n !== null && n.contains(e) && !O(e) && QN(e, n) && e.click();
}
function AI(e) {
	let t = e.closest(nI), n = t === null ? void 0 : lI.get(t);
	return n !== void 0 && cp() && Date.now() - n < cI;
}
function jI(e) {
	let t = e.getBoundingClientRect();
	e.dispatchEvent(new MouseEvent("contextmenu", {
		bubbles: !0,
		cancelable: !0,
		button: 2,
		clientX: t.left,
		clientY: t.bottom
	}));
}
function MI(e) {
	return e.matches(Wf) || e.hasAttribute("tabindex");
}
//#endregion
//#region src/interactions/tooltip-engine.ts
var NI = "ui-tooltip", PI = "ui-tooltip", FI = "ui-tooltip--visible", II = "ui-tooltip--linked", LI = "[aria-haspopup][aria-expanded=\"true\"]", RI = "a[href], button, input, select, textarea, label, [role='button'], [role='link'], [tabindex]", zI = "top", BI = 250, VI = 200, HI = 300, UI = 7, WI = null, GI = null, KI = null, qI = null, JI = null, YI = 0, XI = null, ZI = 0, QI = 0, $I = !1, eL = /* @__PURE__ */ new Set();
function tL(e) {
	eL.add(e);
}
function nL(e = document) {
	if ($I) return;
	$I = !0;
	let t = e instanceof Document ? e : document;
	t.addEventListener("pointerover", rL, !0), t.addEventListener("pointerout", oL, !0), t.addEventListener("focusin", cL, !0), t.addEventListener("focusout", lL, !0), t.addEventListener("scroll", aL, !0), t.addEventListener("pointerdown", dL, !0), t.addEventListener("click", hL, !0), new pP({
		root: t,
		first: window,
		holds: pL,
		answer: mL
	}), window.addEventListener("keydown", uL, !0), window.addEventListener("blur", zL);
}
function rL(e) {
	if (iL(), _L(e.target)) {
		window.clearTimeout(ZI);
		return;
	}
	let t = vL(e.target);
	t !== null && t !== GI && CL(t);
}
function iL() {
	GI === null || GI.isConnected || zL();
}
function aL(e) {
	if (iL(), GI === null) return;
	let t = e.target;
	t instanceof Node && !(t instanceof Document) && !t.contains(GI) || XF(GI) && zL();
}
function oL(e) {
	if (qI !== null || JI !== null) return;
	let t = e.relatedTarget, n = GI ?? XI?.target ?? null, r = n === null ? null : sL(n);
	t instanceof Node && (r !== null && r.contains(t) || _L(t)) || (_L(e.target) || r !== null && e.target instanceof Node && r.contains(e.target)) && BL(!1);
}
function sL(e) {
	let t = e.parentElement?.closest("[data-ui-tooltip-mark]") ?? null;
	return t !== null && yL(t) === e ? t : e;
}
function cL(e) {
	if (e.target instanceof Element && e.target.hasAttribute("data-ui-pointer-focus")) return;
	let t = vL(e.target);
	t !== null && (qI = e.target instanceof Element && e.target.closest("[data-ui-tooltip-mark]") !== null ? t : null, wL(t));
}
function lL(e) {
	vL(e.target) === GI && zL();
}
function uL(e) {
	e.key !== "Escape" || GI === null || e.defaultPrevented || (_u(e) || e.preventDefault(), zL());
}
function dL(e) {
	if (_L(e.target)) return;
	let t = gL(e.target);
	if (t !== null) {
		if (JI === t) {
			BL(!0);
			return;
		}
		zL(), wL(t), JI = GI;
	} else qI === null && BL(!0);
}
var fL = `[${Ce}]`;
function pL(e) {
	let t = e.closest(fL) === null && !Du(e) ? vL(e) : null;
	return t !== null && !t.hasAttribute("data-ui-tooltip-press");
}
function mL(e) {
	let t = vL(e);
	return t !== null && (zL(), wL(t), JI = GI, !0);
}
function hL(e) {
	gL(e.target) !== null && e.preventDefault();
}
function gL(e) {
	let t = vL(e);
	if (t === null || !t.hasAttribute("data-ui-tooltip-press") || !(e instanceof Element)) return null;
	let n = e.closest(RI);
	return n === null || n.contains(t) ? t : null;
}
function _L(e) {
	return WI !== null && e instanceof Node && WI.contains(e);
}
function vL(e) {
	if (!(e instanceof Element)) return null;
	let t = yL(e);
	for (let n of eL) {
		let r = n.anchor(e);
		if (r !== null && (t === null || t !== r && t.contains(r)) && SL(r).length > 0) return r;
	}
	return t;
}
function yL(e) {
	let t = e.closest(`[${Re}], [${Be}]`);
	if (t === null) return null;
	let n = t.hasAttribute("data-ui-tooltip") ? t : t.querySelector("[data-ui-tooltip][data-ui-tooltip-severity]") ?? t.querySelector("[data-ui-tooltip]");
	return n === null ? null : (n.getAttribute("data-ui-tooltip") ?? "").trim().length > 0 ? n : null;
}
function bL(e) {
	let t = (e.getAttribute("data-ui-tooltip") ?? "").trim();
	return t.length > 0 ? t + xL(e) : SL(e);
}
function xL(e) {
	let t = "";
	for (let n of eL) {
		let r = n.anchor(e) === e ? n.after?.(e)?.trim() ?? "" : "";
		r.length > 0 && (t += ` ${r}`);
	}
	return t;
}
function SL(e) {
	for (let t of eL) {
		if (t.anchor(e) !== e) continue;
		let n = t.words(e)?.trim() ?? "";
		if (n.length > 0) return n;
	}
	return "";
}
function CL(e, t) {
	qI === null && JI === null && (window.clearTimeout(ZI), XI !== null && XI.target === e ? XI.words = t : (window.clearTimeout(YI), XI = null, GI === null ? Date.now() - QI < HI ? wL(e, t) : (XI = {
		target: e,
		words: t
	}, YI = window.setTimeout(() => {
		let e = XI;
		XI = null, e !== null && wL(e.target, e.words);
	}, BI)) : (BL(!0), wL(e, t))));
}
function wL(e, t) {
	let n = (t ?? bL(e)).trim();
	if (n.length === 0 || !e.isConnected || !YF(e) || DL(e) || XF(e)) return;
	window.clearTimeout(YI), window.clearTimeout(ZI), XI = null;
	let r = VL();
	Po(r, n, { staticFolds: !0 }), r.classList.toggle(II, r.querySelector("a[href]") !== null), r.classList.add(FI), GI = e, kL(OL(e)), r.setAttribute("data-ui-tooltip-text", Mo(n)), ML(r, e.getAttribute(Ve)), oh(e, r), sh(e, r, {
		placement: RL(e),
		gap: UI,
		arrow: !0
	}), EL();
}
var TL = null;
function EL() {
	typeof MutationObserver < "u" && (TL ??= new MutationObserver(iL), TL.observe(document.documentElement, {
		childList: !0,
		subtree: !0
	}));
}
function DL(e) {
	return e.matches(LI) || e.querySelector(LI) !== null || e.querySelector(":scope > .ui-action-bar") !== null;
}
function OL(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t) ? t : e;
}
function kL(e) {
	KI !== null && KI !== e && AL();
	let t = jL(e);
	t.includes(PI) || e.setAttribute("aria-describedby", [...t, PI].join(" ")), KI = e;
}
function AL() {
	if (KI === null) return;
	let e = jL(KI).filter((e) => e !== PI);
	e.length === 0 ? KI.removeAttribute("aria-describedby") : KI.setAttribute("aria-describedby", e.join(" ")), KI = null;
}
function jL(e) {
	return (e.getAttribute("aria-describedby") ?? "").split(" ").filter((e) => e.length > 0);
}
function ML(e, t) {
	t === null ? e.removeAttribute(Ve) : e.setAttribute(Ve, t);
}
function NL(e, t, n) {
	let r = n?.plain === !0 ? No(t) : t;
	n?.delay === !0 && GI !== e ? CL(e, r) : wL(e, r);
}
function PL() {
	BL(!0);
}
var FL = {
	show: NL,
	hide: PL,
	escape: No
};
function IL(e) {
	qI = e, wL(e);
}
function LL(e) {
	GI === e && ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0 ? zL() : wL(e));
}
function RL(e) {
	if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) for (let t of eL) {
		let n = t.anchor(e) === e ? t.placement?.(e) ?? null : null;
		if (n !== null) return n;
	}
	let t = e.getAttribute(ze);
	return t !== null && Xm(t) ? t : zI;
}
function zL() {
	qI = null, BL(!0);
}
function BL(e) {
	window.clearTimeout(YI), window.clearTimeout(ZI), XI = null;
	let t = () => {
		GI !== null && (AL(), GI = null, JI = null, TL?.disconnect(), WI !== null && (WI.classList.remove(FI), yh(WI)), QI = Date.now());
	};
	e ? t() : ZI = window.setTimeout(t, VI);
}
function VL() {
	return WI !== null && WI.isConnected || (WI = document.createElement("div"), WI.id = PI, WI.className = NI, WI.setAttribute("role", "tooltip"), WI.setAttribute("aria-hidden", "true"), document.body.append(WI)), WI;
}
//#endregion
//#region src/interactions/menu-engine.ts
var HL = "ui-orientation--horizontal", UL = `.${Rn} > .ui-menu__host > .ui-menu__item > .${Fn}`, WL = `${UL}, ${`.ui-menu[${ln}] > .ui-menu__host > .ui-menu__item > .${Fn}`}`, GL = ":scope > .ui-button__content > .ui-text__body > .ui-text__header > .ui-text__title", KL = "[role='menuitem'], [role='menuitemcheckbox']", qL = class {
	root;
	tabStopsScheduled = !1;
	touched = /* @__PURE__ */ new Set();
	space = new ru();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("keydown", (e) => this.handleEntryKeydown(e), !0), this.root.addEventListener("keyup", (e) => this.space.release(e, P), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), tL(ZL), this.applyTabStops(this.root.querySelectorAll(`.${Pn}`)), this.root instanceof Node && new MutationObserver((e) => {
			for (let t of e) Zh(t) || QL(t, this.touched);
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
		for (let n of e) n.isConnected && t.add(iF(n));
		for (let e of t) {
			let t = rF(e);
			if (t.length === 0) continue;
			let n = t.filter((e) => e.tabIndex === 0 && P(e));
			N(t, t.find((e) => e === document.activeElement) ?? t.find((e) => e.classList.contains("ui-menu-item--selected") && P(e)) ?? (n.length === 1 ? n[0] : void 0) ?? t.find(P) ?? t[0]);
		}
	}
	handleEntryKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || Ou(e) || j(e) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Fn}`), n = t?.closest(".ui-menu") ?? null;
		if (t === null) {
			this.enterFromContainer(e);
			return;
		}
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			this.pressEntry(e, t);
			return;
		}
		let r = iF(n), i = rF(r), a = pT(e);
		if (a !== null) {
			e.preventDefault(), Wu(i, EN(i, t, a));
			return;
		}
		let o = r.classList.contains(HL) || eF(r) ? "horizontal" : "vertical";
		if (!M(e) || this.handleGroupKey(e, t, r, o)) return;
		let s = e.key === "ArrowUp" && t === i.find(P) ? XL(r) : null, c = s ?? Vu({
			key: e.key,
			items: i,
			current: t,
			axis: o
		});
		c !== null && (e.preventDefault(), c !== s && N(i, c), c.focus());
	}
	handleGroupKey(e, t, n, r) {
		let i = r === "vertical" ? "ArrowRight" : $P(n) === "top" ? "ArrowUp" : "ArrowDown", a = t.matches("[data-ui-menu-group] > .ui-menu-item") ? t.parentElement : null;
		if (e.key === i && a !== null) return e.preventDefault(), a.hasAttribute("data-ui-menu-open") ? Wu([], JL(a)) : t.click(), !0;
		if (e.key !== "ArrowLeft" || r !== "vertical") return !1;
		let o = a !== null && a.hasAttribute("data-ui-menu-open") && !oF(a) ? a : YL(t), s = o?.querySelector(":scope > .ui-menu-item") ?? null;
		return o === null || s === null ? !1 : (e.preventDefault(), oF(o) || s.focus(), s.click(), !0);
	}
	pressEntry(e, t) {
		e.target === t && M(e, { shift: !0 }) && !t.matches("[data-ui-menu-item-kind=\"header\"], [data-ui-menu-item-kind=\"separator\"]") && P(t) && (t.hasAttribute("href") && e.key === "Enter" || (e.preventDefault(), !e.repeat && (e.key === " " ? this.space.hold(t) : t.click())));
	}
	enterFromContainer(e) {
		let t = e.target instanceof HTMLElement && e.target.getAttribute("role") === "menu" ? e.target : null, n = t === null ? null : t.matches(".ui-menu") ? t : t.querySelector(`.${Pn}`);
		if (n === null) return;
		let r = rF(n), i = pT(e);
		if (i !== null) {
			e.preventDefault(), Wu(r, EN(r, null, i));
			return;
		}
		let a = M(e) ? Vu({
			key: e.key,
			items: r,
			current: null,
			axis: n.classList.contains(HL) ? "horizontal" : "vertical"
		}) : null;
		a !== null && (e.preventDefault(), Wu(r, a));
	}
	handleFocusIn(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Fn}`), n = t?.closest(".ui-menu") ?? null;
		t !== null && n !== null && N(rF(iF(n)), t);
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${Fn}`) : null;
		if (t === null || t === document.activeElement || !t.matches(KL) || t.matches("[data-ui-menu-item-kind=\"header\"], [data-ui-menu-item-kind=\"separator\"]") || !P(t)) return;
		let n = document.activeElement;
		(n instanceof HTMLElement && n.getAttribute("role") === "menu" && n.contains(t) || t.closest(".ui-menu")?.contains(n) === !0) && mp(t);
	}
};
function JL(e) {
	let t = e.querySelector(`:scope > .ui-menu__submenu > .${Pn}`);
	return t === null ? null : rF(t).find(P) ?? null;
}
function YL(e) {
	let t = e.closest(`.${Pn}`), n = t === null ? null : aF(t);
	return n !== null && n.hasAttribute("data-ui-menu-open") ? n : null;
}
function XL(e) {
	return e.hasAttribute("data-ui-menu-search") ? e.querySelector(":scope > .ui-collapsible__bar input") : null;
}
var ZL = {
	anchor: (e) => e.closest(WL),
	words: (e) => {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length > 0) return null;
		let t = e.querySelector(GL), n = t?.textContent?.trim() ?? "";
		return t === null || n.length === 0 || e.matches(UL) && t.scrollWidth <= t.clientWidth ? null : No(n);
	},
	placement: (e) => {
		let t = e.closest(`.${Pn}`);
		return t === null ? null : $P(t);
	}
};
function QL(e, t) {
	let n = (e.target instanceof Element ? e.target : e.target.parentElement)?.closest(".ui-menu") ?? null;
	n !== null && t.add(n);
	for (let n of e.addedNodes) if (n instanceof HTMLElement) {
		n.classList.contains("ui-menu") && t.add(n);
		for (let e of n.querySelectorAll(`.${Pn}`)) t.add(e);
	}
}
//#endregion
//#region src/interactions/shortcut-engine.ts
var $L = "shortcut:", eR = ":scope > .ui-menu-item__shortcut", tR = `[${Se}]`, nR = `[${Un}]`, rR = ".ui-text__title", iR = class {
	root;
	options;
	claims = /* @__PURE__ */ new Map();
	entryShortcuts = /* @__PURE__ */ new Map();
	stale = !0;
	laterVersion = -1;
	constructor(e = {}) {
		this.root = e.root ?? document, this.options = e, this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), tL(dR), cR(this.root), this.root instanceof Node && new MutationObserver((e) => {
			if (!$h(e)) {
				this.stale = !0;
				for (let t of e) sR(t);
			}
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [Un]
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || j(e) || ((this.stale || this.laterVersion !== (this.options.laterChords?.version ?? -1)) && this.rebuild(), this.claims.size === 0 && this.entryShortcuts.size === 0 || Ou(e))) return;
		let t = pg(this.root);
		if (!this.pressContextEntry(e, t)) for (let n of this.claims.values()) {
			if (n === null || !Wl(n.shortcut, e)) continue;
			let r = n.element ?? this.contentOf(n.view);
			if (r === null || !P(r) || t !== null && !t.contains(r)) return;
			e.preventDefault(), oR(e), n.view === null ? r.click() : r.dispatchEvent(new CustomEvent(n.view.name, { bubbles: !0 }));
			return;
		}
	}
	pressContextEntry(e, t) {
		let n = !1;
		for (let t of this.entryShortcuts.values()) n ||= Wl(t, e);
		let r = n ? AF() : null;
		if (r === null || t !== null && !t.contains(r)) return !1;
		let i = EF(r);
		if (i === null) return !1;
		let a = [...i.menu.querySelectorAll(nR)].filter((t) => {
			let n = Ul(t.getAttribute(Un));
			return n !== null && Wl(n, e) && !O(t) && QN(t, i.menu);
		});
		return a.length === 1 ? (e.preventDefault(), oR(e), a[0].click(), !0) : (a.length > 1 && s("context menu shortcut is claimed twice and will fire nothing.", { entries: a }), !1);
	}
	contentOf(e) {
		let t = e === null ? null : this.options.componentOf?.(e.componentId) ?? null;
		return t instanceof HTMLElement ? t : null;
	}
	rebuild() {
		this.claims.clear(), this.entryShortcuts.clear(), this.stale = !1;
		for (let e of this.root.querySelectorAll(nR)) {
			let t = e.getAttribute("data-ui-shortcut") ?? "", n = Ul(t);
			n === null ? t.trim().length > 0 && s("shortcut could not be parsed.", {
				element: e,
				value: t
			}) : e.closest(tR) === null ? this.claim({
				shortcut: n,
				element: e,
				view: null
			}) : this.entryShortcuts.set(iu(n), n);
		}
		for (let e of this.options.laterChords?.chords() ?? []) {
			let t = Ul(e);
			t !== null && this.entryShortcuts.set(iu(t), t);
		}
		this.laterVersion = this.options.laterChords?.version ?? -1;
		for (let e of this.options.viewShortcuts ?? []) {
			let t = Ul(e.name.slice(9));
			t !== null && this.claim({
				shortcut: t,
				element: null,
				view: e
			});
		}
	}
	claim(e) {
		let t = iu(e.shortcut);
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
function aR(e) {
	let t = /* @__PURE__ */ new Map(), n = [...e.events, ...e.interactions.map((e) => e.sourceEvent)];
	for (let e of n) e != null && e.eventName.startsWith($L) && t.set(e.eventName, {
		name: e.eventName,
		componentId: e.componentId
	});
	return [...t.values()];
}
function oR(e) {
	Eu(e.target) && e.target.dispatchEvent(new Event(Lx, { bubbles: !0 }));
}
function sR(e) {
	if (e.type === "attributes") e.target instanceof HTMLElement && lR(e.target);
	else for (let t of e.addedNodes) t instanceof HTMLElement && cR(t);
}
function cR(e) {
	e instanceof HTMLElement && e.matches(nR) && lR(e);
	for (let t of e.querySelectorAll(nR)) lR(t);
}
function lR(e) {
	let t = e.querySelector(eR);
	if (t === null) return;
	let n = uR(e) ?? "";
	t.textContent !== n && (t.textContent = n), e.hasAttribute("data-ui-menu-item-shortcut") !== n.length > 0 && e.toggleAttribute(gn, n.length > 0);
}
function uR(e) {
	let t = e.getAttribute(Un), n = Ul(t);
	return n === null ? t?.trim() || null : Gl(n);
}
var dR = {
	anchor: (e) => {
		let t = e.closest(nR);
		return t === null || t.classList.contains("ui-menu-item") || t.closest(tR) !== null ? null : t;
	},
	words: (e) => {
		let t = uR(e), n = (e.getAttribute("aria-label") ?? e.querySelector(rR)?.textContent ?? "").trim();
		return t === null ? null : No(n.length > 0 ? `${n} (${t})` : t);
	},
	after: (e) => {
		let t = uR(e);
		return t === null ? null : No(`(${t})`);
	}
}, fR = 50, pR = 1, mR = 7;
function hR(e) {
	let t = 0;
	for (let n of e.children) n.hasAttribute("data-ui-key") && t++;
	let n = vO(e, "data-ui-window-size") ?? 0;
	return {
		offset: vO(e, "data-ui-window-offset") ?? 0,
		count: t,
		size: n > 0 ? n : t > 0 ? t : fR,
		total: vO(e, en),
		moreAfter: yO(e, nn)
	};
}
function gR(e) {
	return Math.floor(e.offset / e.size) + 1;
}
function _R(e) {
	return e.total === null ? null : Math.max(1, Math.ceil(e.total / e.size));
}
function vR(e, t) {
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
			let n = Number(t), r = _R(e);
			return !Number.isInteger(n) || n < 1 || r !== null && n > r || n === gR(e) ? null : (n - 1) * e.size;
		}
	}
}
function yR(e, t) {
	if (t <= mR) return xR(1, t);
	let n = Math.max(Math.min(e - pR, t - 2 - 2), 3), r = Math.min(Math.max(e + pR, 5), t - 2);
	return [
		1,
		n > 3 ? "gap" : 2,
		...xR(n, r),
		r < t - 2 ? "gap" : t - 1,
		t
	];
}
function bR(e, t) {
	let n = yR(e, t ? e + 1 : e);
	return t ? [...n, "gap"] : n;
}
function xR(e, t) {
	let n = [];
	for (let r = e; r <= t; r++) n.push(r);
	return n;
}
//#endregion
//#region src/interactions/pager-engine.ts
var SR = ".ui-pager", CR = "ui-pager__button", wR = "ui-pager__number", TR = "ui-pager__pages", ER = "ui-pager__gap", DR = "ui-pager__range", OR = "ui-pager__size", kR = "ui-pager__size--open", AR = "ui-pager__size-trigger", jR = "ui-pager__size-label", MR = "ui-pager__sizes", NR = "ui-pager__size-choice", PR = [
	CR,
	wR,
	"ui-button",
	"ui-button--ghost",
	"ui-button--small"
], FR = "ui.pager.page", IR = "ui.pager.range", LR = "ui.pager.rows", RR = "ui.pager.size", zR = [
	$t,
	en,
	nn,
	Qt,
	Zt
], BR = "page-size", VR = class {
	options;
	root;
	drawn = /* @__PURE__ */ new WeakMap();
	store = new wP();
	restored = /* @__PURE__ */ new WeakSet();
	turning = /* @__PURE__ */ new WeakMap();
	menus = new y_({
		show: ({ owner: e }) => e.classList.add(kR),
		hide: ({ owner: e }) => e.classList.remove(kR),
		closesWhenReadOnly: !1,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.syncAll(), this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e)), (e.pageKeys ?? window).addEventListener("keydown", (e) => this.handlePageKey(e), !0), B(this.root, `${SR}, [${x}]`, {
			childList: !0,
			attributeFilter: zR,
			relevant: (e) => e.type === "attributes" || XR(e.target) || ZR(e)
		}, (e) => this.syncFound(e)), D.onChange(() => {
			this.drawn = /* @__PURE__ */ new WeakMap(), this.syncAll();
		});
	}
	syncAll() {
		for (let e of this.root.querySelectorAll(SR)) this.sync(e);
	}
	syncFound(e) {
		let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
		for (let r of e) {
			if (r.matches(SR)) {
				t.add(r);
				continue;
			}
			let e = r.closest(S), i = e === null ? 0 : T(e);
			i > 0 && n.add(String(i));
		}
		if (n.size > 0) for (let e of this.root.querySelectorAll(SR)) n.has(e.getAttribute("data-ui-pager-target") ?? "") && t.add(e);
		for (let e of t) this.sync(e);
	}
	hostOf(e) {
		return this.targetOf(e)?.host ?? null;
	}
	targetOf(e) {
		let t = Number(e.getAttribute(ht));
		if (!Number.isInteger(t) || t <= 0) return null;
		for (let e of this.options.dom.findEveryComponent(t)) {
			let t = YR(e);
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
		let i = hR(n), a = this.turning.get(n), o = this.shownState(n, i), s = `${i.offset}|${i.count}|${i.size}|${i.total}|${i.moreAfter}|${a ?? ""}`;
		if (this.drawn.get(e) === s) return;
		this.drawn.set(e, s);
		let c = TD(e), l = (e) => ED(e, "N0", c);
		this.drawNumbers(e, o, c), UR(e, i, l), WR(e, i, l);
		for (let t of e.querySelectorAll(`:scope > .${CR}[${gt}]`)) el.setDisabled(t, vR(o, t.getAttribute("data-ui-pager-page") ?? "") === null);
		KR(e);
	}
	shownState(e, t = hR(e)) {
		let n = this.turning.get(e);
		return n === void 0 ? t : {
			...t,
			offset: n,
			moreAfter: t.total === null ? t.moreAfter : n + t.size < t.total
		};
	}
	drawNumbers(e, t, n) {
		let r = e.querySelector(`:scope > .${TR}`);
		if (r === null) return;
		let i = gR(t), a = _R(t), o = a === null ? bR(i, t.moreAfter) : yR(i, a), s = r.contains(document.activeElement);
		r.replaceChildren(...o.map((e) => HR(e, i, n))), s && !e.contains(document.activeElement) && r.querySelector("[aria-current='page']")?.focus({ preventScroll: !0 });
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(SR);
		if (t === null || O(e.target)) return;
		let n = e.target.closest(`.${NR}`);
		if (n !== null) {
			e.preventDefault(), this.chooseSize(t, Number(n.getAttribute(_t)));
			return;
		}
		let r = e.target.closest(`.${AR}`);
		if (r !== null) {
			e.preventDefault(), this.toggleSizes(r);
			return;
		}
		let i = e.target.closest(`[${gt}]`), a = i === null ? null : this.hostOf(t);
		if (i === null || a === null) return;
		let o = vR(this.shownState(a), i.getAttribute("data-ui-pager-page") ?? "");
		o !== null && (e.preventDefault(), this.turnAsync(a, o));
	}
	async turnAsync(e, t) {
		await this.requestPageAsync(e, t), Yu(e).top > 0 && Xu(e, 0);
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
		for (let t of this.root.querySelectorAll(SR)) this.hostOf(t) === e && this.sync(t);
	}
	handleKeyDown(e) {
		if (e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(SR);
		if (t === null) return;
		let n = e.target.closest(`.${OR}`);
		if (n !== null && this.handleSizeKey(e, n)) return;
		let r = e.target.closest(`.${CR}, .${AR}`), i = GR(t);
		if (r === null || !i.includes(r) || !M(e)) return;
		let a = Vu({
			key: e.key,
			items: i,
			current: r,
			axis: "horizontal"
		});
		a !== null && (e.preventDefault(), Wu(i, a));
	}
	handleSizeKey(e, t) {
		let n = e.target instanceof Element ? e.target.closest(`.${AR}`) : null;
		return n !== null && !this.menus.isOpen(t) && (e.key === "ArrowDown" || e.key === "ArrowUp") && M(e) ? (e.preventDefault(), this.openSizes(t, n, e.key === "ArrowUp"), !0) : this.menus.isOpen(t) && wN(e, JR(t));
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${NR}`) : null, n = t?.closest(`.${OR}`) ?? null;
		t !== null && n !== null && this.menus.isOpen(n) && DN(t, JR(n));
	}
	toggleSizes(e) {
		let t = e.closest(`.${OR}`);
		t !== null && (this.menus.isOpen(t) ? this.menus.close(t) : this.openSizes(t, e, !1));
	}
	openSizes(e, t, n) {
		let r = e.querySelector(`:scope > .${MR}`);
		if (r === null) return;
		let i = JR(e), a = i.find((e) => e.getAttribute("aria-checked") === "true") ?? null;
		CN(this.menus, {
			owner: e,
			popup: r,
			anchor: t,
			placement: { placement: "bottom-end" },
			openers: [t]
		}, i, a, n);
	}
	restoreSize(e, t, n) {
		let r = this.store.read(t, BR), i = r === null ? 0 : Number(r);
		if (!Number.isInteger(i) || i <= 0) return;
		if (!qR(e, i)) {
			this.store.write(t, BR, null);
			return;
		}
		let a = hR(n);
		i !== a.size && (n.setAttribute(Qt, String(i)), a.count > 0 && this.turnAsync(n, Math.floor(a.offset / i) * i));
	}
	chooseSize(e, t) {
		let n = e.querySelector(`.${OR}`);
		n !== null && this.menus.close(n);
		let r = this.targetOf(e);
		if (r === null || !Number.isInteger(t) || t <= 0) return;
		let i = hR(r.host);
		t !== i.size && (this.store.write(r.component, BR, String(t)), r.host.setAttribute(Qt, String(t)), this.turnAsync(r.host, Math.floor(i.offset / t) * t));
	}
	handlePageKey(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "PageDown" && e.key !== "PageUp" || !M(e) || !(e.target instanceof Element)) return;
		let t = Xd(e);
		if (t === null || !t.root.matches(".ui-items-view, .ui-table") || O(t.root)) return;
		let n = YR(t.root);
		if (n === null || !n.hasAttribute("data-ui-window-paged")) return;
		let r = vR(this.shownState(n), e.key === "PageDown" ? "next" : "previous");
		r !== null && (e.preventDefault(), this.turnFromKeyAsync(t.root, n, r));
	}
	async turnFromKeyAsync(e, t, n) {
		let r = Rd(e), i = tf(r), a = i === null ? 0 : Math.max(0, r.indexOf(i));
		await this.requestPageAsync(t, n);
		let o = Rd(e);
		o.length > 0 && of(e, o, o[Math.min(a, o.length - 1)]);
	}
};
function HR(e, t, n) {
	if (e === "gap") {
		let e = document.createElement("span");
		return e.className = ER, e.setAttribute("aria-hidden", "true"), e.textContent = "…", e;
	}
	let r = document.createElement("button"), i = ED(e, "N0", n);
	return r.className = PR.join(" "), r.setAttribute("type", "button"), r.setAttribute(gt, String(e)), r.textContent = i, D.write(r, "aria-label", FR, { page: i }), e === t && r.setAttribute("aria-current", "page"), r;
}
function UR(e, t, n) {
	let r = e.querySelector(`:scope > .${DR}`);
	if (r === null) return;
	let i = n(t.count === 0 ? 0 : t.offset + 1), a = n(t.offset + t.count);
	t.total === null ? D.write(r, null, LR, {
		from: i,
		to: a
	}) : D.write(r, null, IR, {
		from: i,
		to: a,
		total: n(t.total)
	});
}
function WR(e, t, n) {
	let r = e.querySelector(`:scope > .${OR}`), i = r?.querySelector(`.${jR}`) ?? null;
	if (r !== null && i !== null) {
		D.write(i, null, RR, { size: n(t.size) });
		for (let e of JR(r)) e.setAttribute("aria-checked", Number(e.getAttribute("data-ui-pager-size")) === t.size ? "true" : "false");
	}
}
function GR(e) {
	return [...e.querySelectorAll(`.${CR}, .${AR}`)];
}
function KR(e) {
	let t = GR(e), n = t.find((e) => e === document.activeElement), r = t.filter((e) => e.getAttribute("data-ui-pager-page") === "previous" || e.getAttribute("data-ui-pager-page") === "next");
	N(t, n ?? r.find(P) ?? t.find((e) => e.getClientRects().length > 0) ?? null);
}
function qR(e, t) {
	let n = e.querySelector(`:scope > .${OR}`);
	return n !== null && JR(n).some((e) => Number(e.getAttribute("data-ui-pager-size")) === t);
}
function JR(e) {
	return [...e.querySelectorAll(`:scope > .${MR} > .${NR}`)];
}
function YR(e) {
	for (let t of e.querySelectorAll(`[${x}][${Wt}="windowed"]`)) if (t.closest("[data-ui-id]") === e) return t;
	return null;
}
function XR(e) {
	return e instanceof Element && e.hasAttribute("data-ui-items-host");
}
function ZR(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(SR) || t.querySelector(SR) !== null)) return !0;
	return !1;
}
//#endregion
//#region src/interactions/menu-search-engine.ts
var QR = `.${Pn}[${vn}]`, $R = ":scope > .ui-collapsible__bar", ez = ":scope > .ui-menu__host", tz = "ui-menu__item", nz = `:scope > .${Fn}`, rz = ":scope > .ui-menu__submenu > .ui-menu > .ui-menu__host", iz = class {
	active = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("input", (e) => this.handle(e), !0), t.addEventListener("change", (e) => this.handle(e), !0), t.addEventListener("keydown", (e) => this.handleKeydown(e)), B(t, QR, {
			childList: !0,
			addedOnly: !0,
			characterData: !0,
			attributeFilter: [ln]
		}, (e) => this.reconcile(e));
	}
	handle(e) {
		let t = e.target;
		if (!(t instanceof HTMLInputElement)) return;
		let n = az(t);
		n !== null && this.search(n, t);
	}
	search(e, t) {
		let n = e.querySelector(ez);
		if (n === null) return;
		let r = Ag(t.value, e);
		r.length === 0 ? this.clear(e, n) : (this.active.has(e) || this.active.set(e, {
			field: t,
			openBefore: oz(n)
		}), e.setAttribute(yn, ""), uT(e, n, !this.filter(n, r)));
	}
	filter(e, t) {
		let n = null, r = !1, i = !1;
		for (let a of sz(e)) {
			let e = cz(a);
			if (e === "header") {
				n !== null && uz(n, r), n = a, r = !1;
				continue;
			}
			let o = e !== "separator" && this.match(a, t);
			uz(a, o), r ||= o, i ||= o;
		}
		return n !== null && uz(n, r), i;
	}
	match(e, t) {
		let n = Mg(lz(e), t), r = e.hasAttribute("data-ui-menu-group") ? e.querySelector(rz) : null;
		if (r === null) return n;
		if (n) return dz(r), e.removeAttribute(fn), !0;
		let i = this.filter(r, t);
		return e.toggleAttribute(fn, i), i;
	}
	clear(e, t) {
		dz(t), e.removeAttribute(yn), sz(t).length > 0 && uT(e, t, !1);
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
		let t = az(e.target), n = t === null ? void 0 : rF(t).find(P);
		n !== void 0 && (e.preventDefault(), n.focus());
	}
};
function az(e) {
	let t = e.closest(QR), n = t?.querySelector($R) ?? null;
	return t !== null && n !== null && n.contains(e) ? t : null;
}
function oz(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e.querySelectorAll(`[${un}][${fn}]`)) t.add(n.getAttribute("data-ui-key") ?? n);
	return t;
}
function sz(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && e.classList.contains(tz));
}
function cz(e) {
	return e.querySelector(nz)?.getAttribute("data-ui-menu-item-kind") ?? "item";
}
function lz(e) {
	let t = e.querySelector(nz);
	return t === null ? "" : jg(Fg(t), e);
}
function uz(e, t) {
	e.toggleAttribute(bn, !t);
}
function dz(e) {
	for (let t of e.querySelectorAll(`[${bn}]`)) t.removeAttribute(bn);
}
//#endregion
//#region src/interactions/screen-keyboard.ts
var fz = 120;
function pz(e) {
	return e.typing && e.tallest - e.height > fz;
}
var mz = class {
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
		let t = pz({
			height: e.height,
			tallest: this.tallest,
			typing: Du(document.activeElement)
		});
		t !== document.documentElement.hasAttribute("data-ui-keyboard-up") && document.documentElement.toggleAttribute(Xr, t);
	}
}, hz = `[${An}], [${On}]`, gz = "--ui-window-foot", _z = "--ui-window-foot-ink", vz = /\s*\/\s*([\d.]+)(%?)\s*\)$/, yz = /^rgba\(([^,]+),([^,]+),([^,]+),\s*([\d.]+)(%?)\s*\)$/;
function bz(e) {
	if (e === "transparent") return 0;
	let t = yz.exec(e) ?? vz.exec(e);
	if (t === null) return 1;
	let n = Number(t[t.length - 2]);
	return t[t.length - 1] === "%" ? n / 100 : n;
}
function xz(e) {
	let t = yz.exec(e);
	return t === null ? e.replace(vz, ")") : `rgb(${t[1]},${t[2]},${t[3]})`;
}
function Sz(e) {
	let t = [], n = null;
	for (let r of e) {
		let e = bz(r);
		if (e >= 1) {
			n = r;
			break;
		}
		e > 0 && t.push(r);
	}
	if (n === null) return null;
	for (let e = t.length - 1; e >= 0; e--) n = `color-mix(in srgb, ${xz(t[e])} ${Math.round(bz(t[e]) * 1e3) / 10}%, ${n})`;
	return n;
}
function Cz(e) {
	let t = [];
	for (let n = e; n !== null; n = n.parentElement) t.push(getComputedStyle(n).backgroundColor);
	return Sz(t);
}
var wz = class {
	scheduled = !1;
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
			e.target instanceof Element && e.target.closest(hz) !== null && n();
		}, !0), this.schedule();
	}
	schedule() {
		this.scheduled || (this.scheduled = !0, requestAnimationFrame(() => {
			this.scheduled = !1, this.update();
		}));
	}
	update() {
		let e = document.querySelectorAll(hz), t = e.length === 0 ? 0 : this.bottomInset();
		for (let n of e) n.hasAttribute("data-ui-window-foot") && this.keepClear(n, t);
		let n = e.length === 0 ? null : Tz(window.innerWidth / 2, window.innerHeight - t - 1, null), r = n === null ? null : Cz(n);
		Ez(document.documentElement, gz, r);
	}
	keepClear(e, t) {
		let n = e.getBoundingClientRect(), r = t > 0 && n.height > 0 && n.bottom >= window.innerHeight - 1, i = r ? Tz(n.left + n.width / 2, Math.min(n.bottom, window.innerHeight - t) - 1, e) : null;
		r !== e.hasAttribute("data-ui-window-foot-edge") && e.toggleAttribute(Zr, r), Ez(e, _z, i === null ? null : Cz(i));
	}
	bottomInset() {
		return this.probe === null && (this.probe = document.createElement("div"), this.probe.setAttribute("aria-hidden", "true"), this.probe.style.cssText = "position:fixed;visibility:hidden;pointer-events:none;height:0;padding-bottom:env(safe-area-inset-bottom,0px)", document.body.append(this.probe)), parseFloat(getComputedStyle(this.probe).paddingBottom) || 0;
	}
};
function Tz(e, t, n) {
	for (let r of document.elementsFromPoint(e, t)) {
		let e = r.closest(hz);
		if (e !== null && (n === null || e === n)) return r;
	}
	return null;
}
function Ez(e, t, n) {
	n === null ? e.style.getPropertyValue(t) !== "" && e.style.removeProperty(t) : e.style.getPropertyValue(t) !== n && e.style.setProperty(t, n);
}
//#endregion
//#region src/interactions/side-drawer-engine.ts
var Dz = "[data-ui-root]", Oz = "a[href]", kz = "ui-collapsible", Az = "ui-collapsible__bar", jz = "right-side", Mz = "ui-side--left", Nz = "ui-side--right", Pz = "pinned", Fz = class {
	root;
	holders = /* @__PURE__ */ new Map();
	openers = /* @__PURE__ */ new WeakMap();
	switchNames = /* @__PURE__ */ new Map();
	store = new wP();
	constructor(e = {}) {
		if (this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), typeof matchMedia == "function") for (let e of mP) matchMedia(e).addEventListener("change", () => this.refit());
		for (let e of document.querySelectorAll(Dz)) Hz(e);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${xn}]`);
		if (t !== null) {
			let e = t.closest(Dz), n = t.getAttribute(xn);
			e !== null && n !== null && this.toggle(e, n, t);
			return;
		}
		let n = e.target.closest(`[${En}]`);
		if (n !== null) {
			let e = n.closest(Dz), t = n.getAttribute(En);
			e !== null && t !== null && this.pin(e, t, !e.hasAttribute(Dn(t)), n);
			return;
		}
		if (e.target.closest("[data-ui-drawer-backdrop]") !== null) {
			this.closeAll();
			return;
		}
		let r = e.target.closest(`[${Wn}]`);
		if (r !== null && !e.defaultPrevented && zz(r)) {
			this.closeAll();
			return;
		}
		let i = e.target.closest(`${Oz}, .${Fn}`), a = i?.closest(`[${Mn}]`), o = a?.parentElement ?? null;
		i !== null && a != null && o?.getAttribute("data-ui-drawer-open") === a.getAttribute("data-ui-region") && Bz(i) && this.close(o);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || j(e)) return;
		if (e.key === "Tab") {
			this.trapTab(e);
			return;
		}
		if (e.key !== "Escape" || _u(e) || Cg()) return;
		let t = !1;
		for (let { shell: e, drawer: n, modal: r } of this.openDrawers()) (r || n.contains(document.activeElement)) && (this.close(e), t = !0);
		t && e.preventDefault();
	}
	trapTab(e) {
		for (let { drawer: t, modal: n } of this.openDrawers()) n && bp(t, e);
	}
	openDrawers() {
		let e = [];
		for (let t of document.querySelectorAll(`${Dz}[${Sn}]`)) {
			let n = t.getAttribute("data-ui-drawer-open") ?? "", r = Uz(t, n);
			r !== null && !mg(r) && e.push({
				shell: t,
				drawer: r,
				modal: Vz(t, n)
			});
		}
		return e;
	}
	refit() {
		for (let e of document.querySelectorAll(`${Dz}[${Sn}]`)) {
			let t = e.getAttribute("data-ui-drawer-open") ?? "", n = Uz(e, t), r = this.openers.get(e);
			n === null || !_P(e, t) ? this.close(e) : r?.isConnected === !0 && this.placeSwitch(n, r);
		}
	}
	toggle(e, t, n) {
		if (e.getAttribute("data-ui-drawer-open") === t) {
			this.close(e);
			return;
		}
		let r = Uz(e, t);
		r !== null && !r.hasAttribute("data-ui-bottom-bar") && _P(e, t) && (e.hasAttribute("data-ui-drawer-open") && this.close(e), e.setAttribute(Sn, t), this.openers.set(e, n), this.markToggles(e), this.hold(r, Vz(e, t)), this.placeSwitch(r, n), this.focusInto(e, t, r, document.activeElement, sp(), performance.now() + z.normal));
	}
	hold(e, t) {
		if (this.holders.has(e) || e.hasAttribute("data-ui-focus-holder")) return;
		let n = !e.hasAttribute("tabindex"), r = t && !e.hasAttribute("aria-label") && !e.hasAttribute("aria-labelledby");
		this.holders.set(e, {
			modal: t,
			addsTabIndex: n,
			addsName: r,
			role: e.getAttribute("role")
		}), n && (e.tabIndex = -1), t && (e.setAttribute(Di, ""), e.setAttribute("role", "dialog"), e.setAttribute("aria-modal", "true"), r && e.setAttribute("aria-label", D.text("ui.side.panel")));
	}
	placeSwitch(e, t) {
		let n = Iz(e), r = t.getBoundingClientRect();
		if (n === null) return;
		this.switchNames.has(n) || this.switchNames.set(n, n.getAttribute("aria-label")), n.setAttribute("aria-label", D.text("ui.side.close"));
		let i = n.parentElement?.classList.contains(Az) === !0 ? n.parentElement : n;
		if (r.width === 0 || r.height === 0) {
			n.removeAttribute(Cn), i.removeAttribute(wn);
			return;
		}
		n.style.setProperty("--ui-drawer-switch-width", `${r.width}px`), n.style.setProperty("--ui-drawer-switch-height", `${r.height}px`), n.style.setProperty("--ui-drawer-switch-x", "0px"), i.style.setProperty("--ui-drawer-switch-y", "0px"), n.setAttribute(Cn, ""), i.setAttribute(wn, "");
		let a = n.getBoundingClientRect(), o = e.getBoundingClientRect(), s = Rz(r.left - e.offsetLeft, e.clientWidth - a.width), c = Rz(r.top - o.top, e.clientHeight - a.height);
		n.style.setProperty("--ui-drawer-switch-x", `${s - (a.left - o.left)}px`), i.style.setProperty("--ui-drawer-switch-y", `${c - (a.top - o.top)}px`);
	}
	focusInto(e, t, n, r, i, a) {
		e.getAttribute("data-ui-drawer-open") !== t || document.activeElement !== r || n.contains(r) || (Ep(n, i ? n : null), performance.now() < a && document.activeElement === r && requestAnimationFrame(() => this.focusInto(e, t, n, r, i, a)));
	}
	pin(e, t, n, r) {
		let i = Uz(e, t);
		if (i === null || bP(e, t)) return;
		let a = i.contains(r);
		if (n && e.getAttribute("data-ui-drawer-open") === t && this.close(e, !a), e.toggleAttribute(Dn(t), n), Hz(e), !n && a && i.contains(document.activeElement)) {
			let n = this.returnTarget(e, t);
			n !== null && R(n);
		}
		let o = i.querySelector(`[${qe}]`);
		o !== null && this.store.write(o, Pz, n ? "true" : null, n ? {
			root: !0,
			attributes: { [Dn(t)]: "" }
		} : null);
	}
	closeAll() {
		for (let e of document.querySelectorAll(`${Dz}[${Sn}]`)) this.close(e);
	}
	close(e, t = !0) {
		let n = e.getAttribute(Sn);
		if (e.removeAttribute(Sn), this.markToggles(e), n === null) return;
		let r = Uz(e, n), i = document.activeElement;
		if (t && (i === null || i === document.body || r?.contains(i) === !0)) {
			let t = this.returnTarget(e, n);
			t !== null && r !== null && r.contains(i) ? Fp(t, r) : t !== null && R(t);
		}
		this.release(r), this.renameSwitch(r);
	}
	returnTarget(e, t) {
		let n = this.openers.get(e);
		if (this.openers.delete(e), n?.isConnected === !0 && n.getAttribute("data-ui-drawer-toggle") === t && n.checkVisibility()) return n;
		let r = [...e.querySelectorAll(`[${xn}="${Ji(t)}"]`)];
		return r.find((e) => e.checkVisibility()) ?? r[0] ?? null;
	}
	markToggles(e) {
		let t = e.getAttribute(Sn);
		for (let n of e.querySelectorAll(`[${xn}]`)) n.setAttribute("aria-expanded", String(n.getAttribute(xn) === t));
	}
	release(e) {
		let t = e === null ? void 0 : this.holders.get(e);
		e !== null && t !== void 0 && (this.holders.delete(e), t.addsTabIndex && e.removeAttribute("tabindex"), t.modal && (e.removeAttribute(Di), e.removeAttribute("aria-modal"), t.role === null ? e.removeAttribute("role") : e.setAttribute("role", t.role), t.addsName && e.removeAttribute("aria-label")));
	}
	renameSwitch(e) {
		for (let [t, n] of this.switchNames) e?.contains(t) !== !0 && t.isConnected || (this.switchNames.delete(t), n === null ? t.removeAttribute("aria-label") : t.setAttribute("aria-label", n));
	}
};
function Iz(e) {
	for (let t of e.querySelectorAll(`[${Wn}]`)) if (zz(t) && t.checkVisibility() && Lz(t.closest(`.${kz}`), e)) return t;
	return null;
}
function Lz(e, t) {
	let n = e;
	for (; n !== null && n !== t;) {
		let e = n.parentElement;
		if (e === null || e.firstElementChild !== n) return !1;
		n = e;
	}
	return n === t;
}
function Rz(e, t) {
	return Math.max(0, Math.min(e, t));
}
function zz(e) {
	let t = e.closest(`.${kz}`), n = t?.closest(`[${Mn}]`), r = n?.getAttribute(Mn), i = n?.parentElement;
	return t == null || t.hasAttribute("data-ui-collapsed") || r == null || i == null ? !1 : i.matches(Dz) && i.getAttribute("data-ui-drawer-open") === r && t.classList.contains(r === jz ? Nz : Mz);
}
function Bz(e) {
	return !e.classList.contains("ui-menu-item") || nF(e) && e.closest(".ui-context-menu, .ui-split-button__menu, .ui-flyout__content") === null;
}
function Vz(e, t) {
	return !(e.getAttribute("data-ui-drawer-modeless") ?? "").split(" ").includes(t);
}
function Hz(e) {
	for (let t of e.querySelectorAll(`[${En}]`)) {
		let n = String(e.hasAttribute(Dn(t.getAttribute("data-ui-drawer-pin") ?? "")));
		t.getAttribute("aria-pressed") !== n && (t.setAttribute("aria-pressed", n), t.getAttribute("data-ui-value-kind") === "pressed" && t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}
function Uz(e, t) {
	return e.querySelector(`:scope > [${Mn}="${Ji(t)}"]`);
}
//#endregion
//#region src/interactions/collapsible-engine.ts
var Wz = "ui-collapsible", Gz = "ui-collapsible__content", Kz = "ui-collapsible__bar", qz = "ui-collapsible__bar-content", Jz = "collapsed", Yz = class {
	root;
	store = new wP();
	restored = /* @__PURE__ */ new WeakSet();
	folds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.restoreEach(this.root.querySelectorAll(`.${Wz}`)), B(this.root, `.${Wz}`, {
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
		let t = this.store.read(e, Jz);
		t !== null && this.apply(e, t === "true");
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Wn}]`), n = t?.closest(`.${Wz}`) ?? null;
		if (t === null || n === null || zz(t)) return;
		e.preventDefault();
		let r = !n.hasAttribute(ln), i = this.partsOf(n, t);
		this.cancelFold(n);
		let a = Zz(n, i);
		this.apply(n, r), this.playFold(n, i, a, r), this.store.write(n, Jz, r ? "true" : "false", r ? { attributes: { [ln]: "" } } : null);
	}
	apply(e, t) {
		e.toggleAttribute(ln, t), this.toggleOf(e)?.setAttribute("aria-expanded", t ? "false" : "true");
	}
	partsOf(e, t) {
		return {
			content: e.querySelector(`:scope > .${Gz}`),
			bar: e.querySelector(`:scope > .${Kz} > .${qz}`),
			toggle: t
		};
	}
	toggleOf(e) {
		return e.querySelector(`:scope > [${Wn}], :scope > .${Kz} > [${Wn}]`);
	}
	playFold(e, t, n, r) {
		if (typeof e.animate != "function" || Lm()) return;
		let i = $z(Xz(e), n, Zz(e, t), r);
		if (i === null) return;
		e.setAttribute(Gn, ""), e.offsetWidth;
		let a = {
			duration: z.normal,
			easing: z.ease
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
function Xz(e) {
	return e.classList.contains("ui-side--top") || e.classList.contains("ui-side--bottom") ? "height" : "width";
}
function Zz(e, t) {
	let n = Xz(e), r = Qz(n), i = e.getBoundingClientRect(), a = t.content?.getBoundingClientRect(), o = t.toggle.getBoundingClientRect();
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
function Qz(e) {
	return e === "width" ? "height" : "width";
}
function $z(e, t, n, r) {
	let i = Qz(e), a = t.component !== n.component, o = Math.abs(t.componentAcross - n.componentAcross) >= .5;
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
function eB(e, t) {
	if (typeof ResizeObserver == "function") {
		let n = new ResizeObserver(() => t(e));
		return n.observe(e), () => n.disconnect();
	}
	let n = () => t(e);
	return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
}
//#endregion
//#region src/interactions/grid-splitter-engine.ts
var tB = "ui-grid-splitter", nB = "ui-container", rB = "ui-orientation--vertical", iB = 16, aB = {
	sliver: 0,
	passFloors: !0
}, oB = {
	sliver: 48,
	passFloors: !0
}, sB = {
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
}, cB = {
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
}, lB = class {
	root;
	store = new wP();
	restored = /* @__PURE__ */ new WeakMap();
	warner = new p();
	drag;
	placedTiers = /* @__PURE__ */ new WeakMap();
	waiting = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new Ig({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${tB}`),
			begin: (e) => this.resolveContext(e),
			coordinate: (e) => e.axis.coordinate,
			move: (e, t) => {
				this.apply(e, t, aB) && this.reportPosition(e.splitter, e.tracks);
			},
			end: (e, t) => {
				this.settle(e), this.remember(t), this.reportPosition(e), this.writeBack(e, t);
			},
			cancel: (e, t) => this.putBack(e, t)
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.prepareEach(this.root.querySelectorAll(`.${tB}`)), B(this.root, `.${tB}`, { childList: !0 }, (e) => this.prepareEach(e)), B(this.root, `.${tB}`, { attributeFilter: [Yn] }, (e) => this.takeEach(e)), window.addEventListener("resize", () => this.reportEach());
	}
	prepareEach(e) {
		for (let t of e) {
			let e = fB(t);
			e !== null && (this.restore(e, pB(t)), this.place(t), this.reportPosition(t));
		}
	}
	restore(e, t) {
		let n = this.restored.get(e);
		if (n === void 0 && (n = /* @__PURE__ */ new Set(), this.restored.set(e, n)), n.has(t.slot)) return;
		n.add(t.slot);
		let r = this.store.readJson(e, t.slot);
		if (r !== null) for (let n of Bm) {
			let i = r[n], a = Gm(t.split, n);
			i !== void 0 && e.style.getPropertyValue(a).length === 0 && e.style.setProperty(a, i);
		}
	}
	place(e) {
		let t = bB(e);
		if (t === null) return;
		if (e.getClientRects().length === 0) {
			this.waitForBox(e);
			return;
		}
		this.stopWaiting(e);
		let n = this.resolveContext(e);
		if (n === null || (this.placedTiers.set(e, n.tier), !e.hasAttribute("data-ui-bind-position") && hB(n.container, n.axis, n.tier) !== void 0)) return;
		let r = Tl(n.sizes, n.runs, t);
		Math.abs(r) >= 1 && this.apply(n, r) && this.remember(n);
	}
	waitForBox(e) {
		this.waiting.has(e) || this.waiting.set(e, eB(e, () => {
			!e.isConnected || bB(e) === null ? this.stopWaiting(e) : e.getClientRects().length > 0 && (this.place(e), this.reportPosition(e));
		}));
	}
	stopWaiting(e) {
		this.waiting.get(e)?.(), this.waiting.delete(e);
	}
	takeEach(e) {
		for (let t of e) bB(t) === null && t.hasAttribute("data-ui-bind-position") ? this.reset(t, !1) : this.place(t), this.reportPosition(t);
	}
	reportEach() {
		let e = Wm();
		for (let t of this.root.querySelectorAll(`.${tB}`)) this.placedTiers.has(t) && this.placedTiers.get(t) !== e && this.place(t), this.reportPosition(t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || !M(e)) return;
		let t = e.target.closest(`.${tB}`);
		if (t === null || this.drag.active || O(t)) return;
		if (e.key === "Enter") {
			e.preventDefault(), this.reset(t);
			return;
		}
		let n = this.resolveContext(t);
		if (n === null) return;
		let r = SB(t), i = n.sizes.reduce((e, t) => e + t, 0), a;
		switch (e.key) {
			case n.axis.decrease:
				a = -r;
				break;
			case n.axis.increase:
				a = r;
				break;
			case "PageUp":
			case "PageDown":
				a = tl(r, i) * yB(e.key, n.axis);
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
		let n = fB(e);
		if (n === null) return;
		let r = pB(e);
		for (let e of Bm) n.style.removeProperty(Gm(r.split, e));
		this.store.write(n, r.slot, null), this.placedTiers.delete(e), e.hasAttribute("data-ui-bind-position") || this.place(e), this.reportPosition(e), t && e.hasAttribute("data-ui-bind-position") && e.hasAttribute("data-ui-splitter-position") && (e.removeAttribute(Yn), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	writeBack(e, t) {
		if (!e.hasAttribute("data-ui-bind-position")) return;
		let n = xB(wl(gB(t.container, t.axis), t.runs));
		e.getAttribute("data-ui-splitter-position") !== n && (e.setAttribute(Yn, n), this.placedTiers.set(e, t.tier), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	handleDoubleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${tB}`) : null;
		t !== null && this.reset(t);
	}
	settle(e) {
		let t = this.resolveContext(e), n = t === null ? 0 : kl(t.tracks, t.sizes, t.runs, 48);
		t !== null && n !== 0 && this.apply(t, n, aB);
	}
	putBack(e, t) {
		let n = Gm(t.axis.split, t.tier);
		t.before.length === 0 ? t.container.style.removeProperty(n) : t.container.style.setProperty(n, t.before), this.reportPosition(e);
	}
	apply(e, t, n = oB) {
		let r = ml(e.tracks, e.sizes, e.runs, t, n);
		return r !== null && (e.container.style.setProperty(Gm(e.axis.split, e.tier), ol(r)), !0);
	}
	remember(e) {
		let { container: t, axis: n } = e, r = {}, i = {};
		for (let e of Bm) {
			let a = Gm(n.split, e), o = t.style.getPropertyValue(a).trim();
			o.length > 0 && (r[e] = o, i[a] = o);
		}
		let a = { styles: i };
		this.store.write(t, n.slot, Object.keys(r).length === 0 ? null : JSON.stringify(r), a);
	}
	resolveContext(e) {
		let t = fB(e);
		if (t === null) return this.warner.warn(e, "a grid splitter must be a direct child of a container."), null;
		let n = pB(e), r = Wm(), i = mB(t, n, r), a = i === null ? null : nl(i);
		if (a === null) return this.warner.warn(e, "the container's track list could not be read.", { template: i }), null;
		let o = ul(a, ll(t.getAttribute(n.limits))), s = gB(t, n), c = _B(e, n);
		if (c === null || c >= o.length || s.length < o.length) return this.warner.warn(e, "the splitter's track could not be found in its container.", {
			index: c,
			tracks: o.length,
			sizes: s.length
		}), null;
		o[c].kind === "star" && this.warner.warn(e, "a grid splitter sits in a star track and shares the room it divides; give it an Auto or Absolute track.");
		let l = dl(c, vB(t, n).map((e) => _B(e, n)).filter((e) => e !== null && e !== c), o.length);
		return l === null ? (this.warner.warn(e, "a grid splitter at the container's edge has nothing on one side to move."), null) : {
			splitter: e,
			container: t,
			axis: n,
			tracks: o,
			sizes: s,
			runs: l,
			tier: r,
			before: t.style.getPropertyValue(Gm(n.split, r))
		};
	}
	reportPosition(e, t) {
		let n = fB(e);
		if (n === null) return;
		let r = pB(e), i = _B(e, r), a = gB(n, r), o = vB(n, r).map((e) => _B(e, r)).filter((e) => e !== null && e !== i), s = i === null ? null : dl(i, o, a.length);
		s !== null && (e.setAttribute("aria-valuemin", "0"), e.setAttribute("aria-valuemax", "100"), e.setAttribute("aria-valuenow", String(Cl(a, s))), C(e, ti, uB(a, s.before) ? "before" : uB(a, s.after) ? "after" : null), dB(n, t === void 0 ? null : {
			axis: r,
			tracks: Al(t, a, s, 48)
		}));
	}
};
function uB(e, t) {
	return t.every((t) => (e[t] ?? 0) < 1);
}
function dB(e, t) {
	let n = [sB, cB].filter((t) => vB(e, t).length > 0).map((t) => ({
		axis: t,
		sizes: gB(e, t)
	}));
	for (let r of e.children) {
		if (!(r instanceof HTMLElement)) continue;
		let e = getComputedStyle(r), i = r.classList.contains(tB) ? pB(r) : null, a = n.some(({ axis: n, sizes: r }) => n !== i && Ml(e[n.lineStart], e[n.lineEnd], r, t?.axis === n ? t.tracks : void 0));
		a !== r.hasAttribute("data-ui-split-folded") && r.toggleAttribute(ei, a);
	}
}
function fB(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(nB) ? t : null;
}
function pB(e) {
	return e.classList.contains(rB) ? sB : cB;
}
function mB(e, t, n) {
	let r = hB(e, t, n);
	if (r !== void 0) return r;
	let i = e.style.getPropertyValue(t.authored).trim();
	return i.length > 0 ? i : null;
}
function hB(e, t, n) {
	return Jm(n, (n) => e.style.getPropertyValue(Gm(t.split, n)).trim() || void 0);
}
function gB(e, t) {
	return getComputedStyle(e)[t.computed].split(" ").map(parseFloat).filter((e) => Number.isFinite(e));
}
function _B(e, t) {
	let n = Number(getComputedStyle(e)[t.lineStart]);
	return Number.isInteger(n) && n >= 1 ? n - 1 : null;
}
function vB(e, t) {
	let n = [];
	for (let r of e.children) r instanceof HTMLElement && r.classList.contains(tB) && pB(r) === t && n.push(r);
	return n;
}
function yB(e, t) {
	return t.increase === "ArrowDown" ? e === "PageDown" ? 1 : -1 : e === "PageUp" ? 1 : -1;
}
function bB(e) {
	return El(e.getAttribute(Yn));
}
function xB(e) {
	return String(Math.round(e * 1e4) / 1e4);
}
function SB(e) {
	let t = Number(e.getAttribute(Jn));
	return Number.isFinite(t) && t > 0 ? t : iB;
}
//#endregion
//#region src/interactions/pane-container-engine.ts
var CB = "ui-pane-container", wB = "ui-pane-container__place", TB = "ui-pane-container__pane", EB = "ui-pane-container__grip", DB = "data-ui-pane-lifted", OB = "data-ui-pane-target", kB = "data-ui-pane-moving", AB = "data-ui-pane-near", jB = "data-ui-pane-raised", MB = ".ui-text-type--display, .ui-text-type--title, .ui-text-type--subtitle", NB = "panes", PB = ",", FB = 32, IB = class {
	root;
	store = new wP();
	drag;
	restored = /* @__PURE__ */ new WeakSet();
	held = null;
	raised = null;
	near = null;
	nearTop = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new Ig({
			root: this.root,
			resolveHandle: (e) => RB(e),
			begin: (e, t) => this.lift(e, t),
			move: (e, t, n) => this.follow(e, n),
			end: (e, t) => this.put(t),
			cancel: (e, t) => this.putBack(t),
			takenBack: (e, t) => this.putBack(t)
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), { passive: !0 }), this.root.addEventListener("pointerout", (e) => this.handlePointerOut(e), { passive: !0 }), this.root.addEventListener("pointerover", () => this.forgetNearTop(), { passive: !0 }), this.root.addEventListener("scroll", () => this.handleScroll(), {
			capture: !0,
			passive: !0
		}), window.addEventListener("resize", () => this.forgetNearTop()), this.arrangeEach(this.root.querySelectorAll(`.${CB}`), !1), B(this.root, `.${CB}`, {
			childList: !0,
			attributeFilter: [Xn],
			relevant: UB
		}, (e) => this.arrangeEach(WB(e), !0));
	}
	arrangeEach(e, t) {
		for (let n of e) {
			let e = !this.restored.has(n);
			if (e) {
				this.restored.add(n), this.restore(n);
				for (let e of GB(n)) {
					let t = e.querySelector(`:scope > .${TB} > .${EB}`);
					t !== null && BB(t);
				}
			}
			n.hasAttribute(kB) || YB(n, qB(n), t && !e);
		}
	}
	restore(e) {
		if (e.hasAttribute("data-ui-bind-layout")) return;
		let t = this.store.read(e, NB);
		t !== null && e.setAttribute(Xn, t);
	}
	lift(e, t) {
		this.dropStaleHold();
		let n = e.parentElement, r = n?.parentElement, i = r?.parentElement;
		if (this.held !== null || n === null || r == null || i == null || KB(i).length < 2) return null;
		if (typeof n.getAnimations == "function") for (let e of n.getAnimations()) e.cancel();
		n.setAttribute(DB, ""), i.setAttribute(kB, "");
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
		n.style.minWidth = `${r.width}px`, n.style.minHeight = `${r.height}px`, t.style.left = `${r.left}px`, t.style.top = `${r.top}px`, t.style.width = `${r.width}px`, t.style.height = `${r.height}px`, t.setAttribute("popover", "manual"), t.setAttribute(jB, ""), t.showPopover(), this.raised = e;
	}
	follow(e, t) {
		e.pane.style.transform = `translate(${t.x - e.start.x}px, ${t.y - e.start.y}px)`, this.mark(e, fV(e.container, e.origin, t));
	}
	mark(e, t) {
		e.target !== t && (e.target?.removeAttribute(OB), t?.setAttribute(OB, ""), e.target = t);
	}
	put(e) {
		let t = e.target, n = e.pane.parentElement, r = t?.querySelector(`:scope > .${TB}`) ?? null;
		if (t === null || n === null || r === e.pane || !e.container.isConnected) return this.putBack(e), null;
		this.settle(e);
		let i = /* @__PURE__ */ new Map([[e.pane, t]]);
		return r !== null && i.set(r, n), XB(e.container, i, !0), this.keep(e.container), t;
	}
	putBack(e) {
		this.settle(e), ZB(e.pane), e.container.isConnected && YB(e.container, qB(e.container), !0);
	}
	settle(e) {
		this.lower(e), e.target?.removeAttribute(OB), e.pane.removeAttribute(DB), e.container.removeAttribute(kB), e.grip.setAttribute("aria-pressed", "false"), e.grip.removeAttribute(Oi);
	}
	lower(e) {
		let { pane: t, origin: n } = e;
		if (this.raised === e && (this.raised = null), t.hasAttribute(jB)) {
			t.matches(":popover-open") && t.hidePopover(), t.removeAttribute("popover"), t.removeAttribute(jB);
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
		let t = JB(e);
		e.setAttribute(Xn, t), e.hasAttribute("data-ui-bind-layout") ? e.dispatchEvent(new Event("change", { bubbles: !0 })) : this.store.write(e, NB, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || !M(e)) return;
		this.dropStaleHold();
		let t = RB(e.target);
		if (t === null || this.drag.active) return;
		let n = this.held;
		if (n === null) {
			if (e.key !== " " && e.key !== "Enter") return;
			e.preventDefault(), this.hold(t);
			return;
		}
		if (n.pane !== t.parentElement) return;
		let r = LB[e.key];
		if (r !== void 0) {
			e.preventDefault();
			let t = pV(n.container, n.origin, n.target ?? n.origin, r) ?? n.target;
			t !== null && t !== n.target && Ok({
				key: "ui.pane.target",
				args: HB(n.container, t)
			}), this.mark(n, t);
		} else if (e.key === " " || e.key === "Enter") {
			e.preventDefault(), this.held = null;
			let r = this.put(n);
			if (r === null) Ok({ key: "ui.pane.back" });
			else {
				let { index: e, count: t } = HB(n.container, r);
				Ak(e, t);
			}
			t.focus({ preventScroll: !0 });
		} else e.key === "Escape" && (e.preventDefault(), this.held = null, this.putBack(n), Ok({ key: "ui.pane.back" }));
	}
	hold(e) {
		this.held = this.lift(e, {
			x: 0,
			y: 0
		}), this.held !== null && (e.setAttribute("aria-pressed", "true"), e.setAttribute(Oi, ""), Ok({ key: "ui.pane.lifted" }));
	}
	handleFocusOut(e) {
		let t = this.held;
		t !== null && e.target instanceof Element && e.target.parentElement === t.pane && (this.held = null, this.putBack(t));
	}
	handleFocusIn(e) {
		let t = e.target instanceof Element ? RB(e.target) : null;
		t !== null && BB(t);
	}
	handlePointerMove(e) {
		if (!(e instanceof PointerEvent) || e.pointerType === "touch") return;
		let t = e.target instanceof Element ? zB(e.target) : null;
		if (t === null) {
			this.markNear(null);
			return;
		}
		let n = this.nearTop;
		n?.pane !== t && (n = {
			pane: t,
			top: t.getBoundingClientRect().top
		}, this.nearTop = n), this.markNear(e.clientY - n.top < FB ? t : null);
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
		e !== this.near && (this.near?.removeAttribute(AB), e?.setAttribute(AB, ""), this.near = e);
	}
	handlePointerOut(e) {
		e instanceof PointerEvent && e.relatedTarget === null && this.markNear(null);
	}
}, LB = {
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
function RB(e) {
	let t = e.closest(`.${EB}`);
	return t?.parentElement?.parentElement?.parentElement?.classList.contains(CB) === !0 ? t : null;
}
function zB(e) {
	let t = e.closest(`.${TB}`);
	return t?.parentElement?.parentElement?.classList.contains(CB) === !0 ? t : null;
}
function BB(e) {
	let t = e.parentElement, n = t === null ? null : VB(t), r = n === null ? "ui.pane.move" : "ui.pane.grip", i = n === null ? null : { name: n };
	e.getAttribute("aria-label") !== D.translate(r, i) && D.write(e, "aria-label", r, i);
}
function VB(e) {
	for (let t of e.querySelectorAll(MB)) {
		let n = zB(t) === e ? t.textContent?.trim() ?? "" : "";
		if (n.length > 0) return n;
	}
	return null;
}
function HB(e, t) {
	let n = KB(e);
	return {
		index: n.indexOf(t) + 1,
		count: n.length
	};
}
function UB(e) {
	if (e.type === "attributes") return e.target instanceof Element && e.target.classList.contains(CB);
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains(CB) || t.querySelector(`.${CB}`) !== null)) return !0;
	return !1;
}
function WB(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) {
		t.add(n);
		for (let e of n.querySelectorAll(`.${CB}`)) t.add(e);
	}
	return t;
}
function GB(e) {
	return Array.from(e.querySelectorAll(`:scope > .${wB}`));
}
function KB(e) {
	return GB(e).filter((e) => e.getClientRects().length > 0);
}
function qB(e) {
	return e.getAttribute(Xn);
}
function JB(e) {
	return GB(e).map((e) => e.querySelector(`:scope > .${TB}`)?.getAttribute("data-ui-pane") ?? "").join(PB);
}
function YB(e, t, n) {
	let r = GB(e), i = $B(r.map((e) => e.getAttribute("data-ui-pane-place") ?? ""), t), a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
	for (let e of r) {
		let t = e.querySelector(`:scope > .${TB}`), n = t?.getAttribute(Zn);
		t != null && n != null && a.set(n, t);
	}
	r.forEach((e, t) => {
		let n = a.get(i[t]);
		n !== void 0 && n.parentElement !== e && o.set(n, e);
	}), o.size > 0 && XB(e, o, n);
}
function XB(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let e of t.keys()) r.set(e, e.getBoundingClientRect());
	for (let [e, n] of t) e.style.transform = "", n.append(e);
	if (cV(e), !n || Lm()) return;
	let i = t.size + 1;
	for (let [e, t] of r) {
		let n = typeof e.animate == "function" ? QB(t, e.getBoundingClientRect()) : null, r = String(i--);
		n !== null && e.animate(n.map((e) => ({
			...e,
			zIndex: r
		})), {
			duration: z.normal + 60,
			easing: z.ease
		});
	}
}
function ZB(e) {
	let t = e.style.transform;
	e.style.transform = "", !(t.length === 0 || t === "translate(0px, 0px)" || Lm() || typeof e.animate != "function") && e.animate([{ transform: t }, { transform: "none" }], {
		duration: z.normal,
		easing: z.ease
	});
}
function QB(e, t) {
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
function $B(e, t) {
	let n = new Set(e), r = /* @__PURE__ */ new Set(), i = e.map(() => null), a = t === null || t.length === 0 ? [] : t.split(PB).map((e) => e.trim());
	for (let e = 0; e < i.length && e < a.length; e++) n.has(a[e]) && !r.has(a[e]) && (i[e] = a[e], r.add(a[e]));
	let o = e.filter((e) => !r.has(e));
	return i.map((e) => e ?? o.shift() ?? "");
}
function eV(e, t, n, r, i, a, o) {
	let s = e.map((e) => tV(e.cells, n));
	return {
		cells: s,
		columnOrder: a ? nV(e, t, s, r, !0) : null,
		rowOrder: o ? nV(e, t, s, i, !1) : null
	};
}
function tV(e, t) {
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
function nV(e, t, n, r, i) {
	let a = [...n], o = new Map(e.map((e, t) => [e.name, t])), s = a.map(() => !1), c = null;
	for (let l = 0; l < a.length; l++) {
		if (s[l]) continue;
		let u = [];
		for (let e = l; e < a.length; e++) !s[e] && oV(a[e], a[l], i) && (s[e] = !0, u.push(e));
		u.sort((e, t) => aV(a[e], i).start - aV(a[t], i).start);
		let d = 0;
		for (let s = 1; s <= u.length; s++) s < u.length && aV(a[u[s]], i).start === sV(a[u[s - 1]], i) || (s - d > 1 && (c = rV(u.slice(d, s), e, t, o, a, n, r, i, c)), d = s);
	}
	return c;
}
function rV(e, t, n, r, i, a, o, s, c) {
	let l = [], u = !1, d = !1;
	for (let i of e) {
		let a = r.get(n[i]);
		if (a === void 0 || !e.includes(a)) return c;
		l.push(a), u ||= t[a].keepsSize, d ||= a !== i;
	}
	let f = aV(i[e[0]], s).start, p = sV(i[e[e.length - 1]], s);
	if (!u || !d || p - 1 > o || iV(e, i, s, f, p)) return c;
	let m = c ?? Array.from({ length: o }, (e, t) => t), h = f;
	return e.forEach((e, t) => {
		let { start: n, span: r } = aV(i[l[t]], s);
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
function iV(e, t, n, r, i) {
	return t.some((t, a) => {
		let o = aV(t, n).start, s = sV(t, n);
		return !e.includes(a) && o < i && s > r && (o > r || s < i);
	});
}
function aV(e, t) {
	return t ? {
		start: e.column,
		span: e.columnSpan
	} : {
		start: e.row,
		span: e.rowSpan
	};
}
function oV(e, t, n) {
	return n ? e.row === t.row && e.rowSpan === t.rowSpan : e.column === t.column && e.columnSpan === t.columnSpan;
}
function sV(e, t) {
	let { start: n, span: r } = aV(e, t);
	return n + r;
}
function cV(e) {
	let t = uV(e.getAttribute(Qn)), n = uV(e.getAttribute($n));
	if (t === null && n === null) return;
	let r = GB(e), i = new Set(r.flatMap((e) => {
		let t = e.querySelector(`:scope > .${TB}`);
		return t?.hasAttribute("data-ui-pane-keeps-size") === !0 ? [t.getAttribute("data-ui-pane") ?? ""] : [];
	})), a = r.map((e) => {
		let t = e.getAttribute("data-ui-pane-place") ?? "";
		return {
			name: t,
			cells: uV(e.getAttribute("data-ui-pane-cells"), dV) ?? [],
			keepsSize: i.has(t)
		};
	}), o = r.map((e) => e.querySelector(`:scope > .${TB}`)?.getAttribute("data-ui-pane") ?? ""), s = [], c = [];
	Bm.forEach((e, i) => {
		let l = eV(a, o, i, t?.length ?? 0, n?.length ?? 0, t !== null, n !== null);
		r.forEach((t, n) => {
			let r = l.cells[n];
			t.style.setProperty(Gm("--ui-placement-column", e), String(r.column)), t.style.setProperty(Gm("--ui-placement-row", e), String(r.row)), t.style.setProperty(Gm("--ui-placement-column-span", e), String(r.columnSpan)), t.style.setProperty(Gm("--ui-placement-row-span", e), String(r.rowSpan));
		}), s.push(l.columnOrder), c.push(l.rowOrder);
	}), lV(e, "--ui-pane-columns", t, s), lV(e, "--ui-pane-rows", n, c);
}
function lV(e, t, n, r) {
	let i = n !== null && r.some((e) => e !== null);
	Bm.forEach((a, o) => {
		i ? e.style.setProperty(Gm(t, a), (r[o] ?? n.map((e, t) => t)).map((e) => n[e]).join(" ")) : e.style.removeProperty(Gm(t, a));
	});
}
function uV(e, t = (e) => e) {
	if (e === null) return null;
	try {
		let n = JSON.parse(e);
		return Array.isArray(n) ? n.map(t) : null;
	} catch {
		return null;
	}
}
function dV(e) {
	return Array.isArray(e) && e.length === 4 ? {
		column: Number(e[0]),
		row: Number(e[1]),
		columnSpan: Number(e[2]),
		rowSpan: Number(e[3])
	} : null;
}
function fV(e, t, n) {
	for (let r of KB(e)) {
		if (r === t) continue;
		let e = r.getBoundingClientRect();
		if (n.x >= e.left && n.x <= e.right && n.y >= e.top && n.y <= e.bottom) return r;
	}
	return null;
}
function pV(e, t, n, r) {
	let i = KB(e).map((e) => ({
		place: e,
		box: e.getBoundingClientRect()
	})), a = i.find((e) => e.place === n)?.box;
	if (a === void 0) return null;
	let o = hV(mV(a), i.map((e) => e.place === t || e.place === n ? null : mV(e.box)), r);
	return o === null ? null : i[o].place;
}
function mV(e) {
	return {
		x: e.left + e.width / 2,
		y: e.top + e.height / 2
	};
}
function hV(e, t, n) {
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
var gV = "ui-split-button", _V = "ui-split-button__main", vV = "ui-split-button__toggle", yV = "ui-split-button__menu", bV = "ui-split-button--open", xV = class {
	root;
	menus = new y_({
		show: ({ owner: e }) => e.classList.add(bV),
		hide: ({ owner: e }) => e.classList.remove(bV),
		closesWhenReadOnly: !1,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), document.addEventListener("click", (e) => this.handleChoice(e), !1);
	}
	handleClick(e) {
		let t = SV(e.target);
		if (t !== null) {
			e.preventDefault(), this.menus.isOpen(t) ? this.menus.close(t) : this.openMenu(t);
			return;
		}
		let n = this.menus.current;
		n !== null && e.target instanceof Element && e.target.closest(`.${_V}`)?.closest(`.${gV}`) === n && this.menus.close(n);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "ArrowDown" && e.key !== "ArrowUp" || !M(e)) return;
		let t = SV(e.target);
		t === null || this.menus.isOpen(t) || (e.preventDefault(), this.openMenu(t, e.key === "ArrowUp"));
	}
	handleChoice(e) {
		let t = this.menus.current;
		if (t === null || !(e.target instanceof Element)) return;
		let n = CV(t), r = e.target.closest(`.${Fn}`);
		n !== null && r !== null && n.contains(r) && nF(r) && this.menus.close(t);
	}
	openMenu(e, t = !1) {
		let n = CV(e), r = n?.querySelector(".ui-menu") ?? null;
		if (n === null || r === null) return;
		let i = e.getAttribute("data-ui-split-placement") ?? "";
		this.menus.open({
			owner: e,
			popup: n,
			anchor: e,
			placement: { placement: Xm(i) ? i : "bottom-end" },
			openers: wV(e)
		}) && Ap(r, rF(r), t);
	}
};
function SV(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${vV}, .${_V}`), n = t?.closest(`.${gV}`) ?? null;
	return t === null || n === null || t.classList.contains(_V) && n.getAttribute("data-ui-split-mode") !== "menu" ? null : n;
}
function CV(e) {
	return e.querySelector(`:scope > .${yV}`);
}
function wV(e) {
	return [...e.querySelectorAll(":scope > [aria-haspopup]")];
}
//#endregion
//#region src/interactions/button-group-engine.ts
var TV = "ui-button-group", EV = "ui-button-group__item", DV = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${TV}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), B(this.root, `.${TV}`, {
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
			let e = t.length > 0 && i.getAttribute("data-ui-key") === t, a = OV(i);
			i.toggleAttribute(si, e), a !== null && (a.setAttribute("aria-pressed", e ? "true" : "false"), n.push(a), e && (r = a));
		}
		N(n, r ?? n.find(P) ?? null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${EV}`), n = t?.closest(`.${TV}`) ?? null;
		if (t === null || n === null || t.closest(`.${TV}`) !== n || O(n)) return;
		let r = OV(t);
		r !== null && O(r) || this.choose(n, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${EV} > .${Mi}`), n = t?.closest(`.${TV}`) ?? null;
		if (t === null || n === null || !M(e)) return;
		let r = this.ownItems(n).map(OV).filter((e) => e !== null), i = Vu({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault(), i.focus({ preventScroll: !0 });
		let a = i.closest(`.${EV}`);
		a !== null && this.choose(n, a);
	}
	choose(e, t) {
		dd(e, t.getAttribute("data-ui-key") ?? "", {
			attribute: ci,
			bindingAttribute: ui,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return ld(e, `.${EV}`, `.${TV}`);
	}
};
function OV(e) {
	return e.querySelector(`:scope > .${Mi}`);
}
//#endregion
//#region src/interactions/accordion-engine.ts
var kV = "ui-accordion", AV = "details", jV = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleSummaryClick(e), !0), this.root.addEventListener("toggle", (e) => this.handleToggle(e), !0), this.normalizeAll(this.root.querySelectorAll(`.${kV}`)), B(this.root, `.${kV}`, {
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
		if (t !== null && t.classList.contains(kV)) for (let n of this.sectionsOf(t)) n !== e && n.open && (n.open = !1);
	}
	sectionsOf(e) {
		return [...e.querySelectorAll(`:scope > ${AV}`)];
	}
}, MV = "ui-tab-overflow", NV = "ui-tab-overflow__menu", PV = "ui-tab-overflow__menu--open", FV = "ui-tab-overflow__entry", IV = "ui-tab-overflow__entry--current", LV = class {
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
		this.options = e, this.list = new VV(e.pick);
	}
	fit(e, t) {
		this.resizes?.observe(t.room), this.switches?.observe(e, { attributeFilter: ["class", "style"] });
		let n = this.options.wraps(e), r = t.captions[0]?.parentElement ?? null;
		if (this.wraps.set(e, n), this.spacings.set(e, {
			host: r,
			spacing: RV(r)
		}), n) {
			for (let e of t.captions) e.classList.remove(this.options.hiddenClass);
			e.classList.remove(this.options.overflowingClass), this.closeListOf(e);
			return;
		}
		e.classList.remove(this.options.overflowingClass);
		let i = () => e.classList.add(this.options.overflowingClass), a = this.options.trailing === !0 ? this.fitTrailing(t, i) : zV({
			...t,
			hiddenClass: this.options.hiddenClass,
			showButton: i
		});
		e.classList.toggle(this.options.overflowingClass, a), a || this.closeListOf(e);
	}
	spacingChanged(e) {
		let t = this.spacings.get(e);
		return t !== void 0 && RV(t.host) !== t.spacing;
	}
	fitTrailing(e, t) {
		for (let t of e.captions) this.resizes?.observe(t);
		return BV(e, this.options.hiddenClass, t);
	}
	closeListOf(e) {
		this.list.isOpenFor(e) && this.list.close();
	}
	toggleList(e, t, n) {
		this.list.isOpenFor(e) ? this.list.close() : this.list.open(t, e, n());
	}
};
function RV(e) {
	return e === null ? "" : getComputedStyle(e).columnGap ?? "";
}
function zV(e) {
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
function BV(e, t, n) {
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
var VV = class {
	menu;
	button = null;
	list = new y_({
		show: ({ popup: e }) => e.classList.add(PV),
		hide: ({ popup: e }) => {
			e.classList.remove(PV), this.button = null;
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e) || this.button !== null && t.includes(this.button),
		onWindowBlur: !0,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	pick;
	constructor(e) {
		this.pick = e, this.menu = document.createElement("div"), this.menu.className = NV, this.menu.setAttribute("role", "menu"), this.menu.addEventListener("click", (e) => this.handleClick(e)), this.menu.addEventListener("keydown", (e) => this.handleKeydown(e)), this.menu.addEventListener("pointermove", (e) => this.handlePointerMove(e));
	}
	isOpenFor(e) {
		return this.list.isOpen(e);
	}
	open(e, t, n) {
		this.close(), this.menu.replaceChildren(...n.map(HV)), this.menu.parentElement === null && document.body.appendChild(this.menu);
		let r = this.menu.querySelector(`.${IV}`);
		this.button = e, oh(e, this.menu);
		let i = {
			owner: t,
			popup: this.menu,
			anchor: e,
			placement: { placement: "bottom-end" },
			openers: [e],
			returnFocus: () => e
		};
		CN(this.list, i, this.entries(), r) || (this.button = null);
	}
	close() {
		this.list.close();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${FV}`), n = t?.getAttribute("data-ui-key") ?? null, r = this.list.current;
		t === null || n === null || r === null || O(t) || (this.close(), this.pick(r, n));
	}
	handleKeydown(e) {
		e.defaultPrevented || wN(e, this.entries());
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${FV}`) : null;
		t !== null && DN(t, this.entries());
	}
	entries() {
		return Array.from(this.menu.querySelectorAll(`.${FV}`));
	}
};
function HV(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${FV} ${Fi}`, t.classList.toggle(IV, e.current), t.setAttribute("role", "menuitem"), t.setAttribute(b, e.key), t.textContent = e.title, e.current && t.setAttribute("aria-current", "true"), e.disabled && (t.classList.add(bi), t.setAttribute("aria-disabled", "true")), t;
}
//#endregion
//#region src/interactions/tab-switch.ts
var UV = "data-ui-caption-text", WV = ".ui-text__title";
function GV(e) {
	for (let t of e.querySelectorAll(WV)) {
		let e = t.textContent ?? "";
		t.getAttribute(UV) !== e && t.setAttribute(UV, e);
	}
}
function KV(e, t) {
	if (e === null || t === null || e === t || typeof t.animate != "function" || Lm()) return;
	let n = e.getBoundingClientRect(), r = t.getBoundingClientRect();
	n.width !== 0 && r.width !== 0 && t.animate([{ transform: `translateX(${n.left - r.left}px) scaleX(${n.width / r.width})` }, { transform: "none" }], {
		duration: z.normal,
		easing: z.ease,
		pseudoElement: "::after"
	});
}
function qV(e) {
	if (!(e === null || Lm())) for (let t of e.children) typeof t.animate == "function" && t.animate([{ opacity: 0 }, { opacity: 1 }], {
		duration: z.fast,
		easing: z.enter
	});
}
//#endregion
//#region src/interactions/tabs-engine.ts
var JV = "ui-tabs", YV = "ui-tab-caption", XV = "ui-tab-caption--selected", ZV = "ui-tab-caption--overflowed", QV = "ui-tabs--overflowing", $V = "ui-tabs--no-overflow", eH = "ui-tabs__strip", tH = "ui-tabs__band", nH = class {
	root;
	fitter;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new LV({
			rootClass: JV,
			overflowingClass: QV,
			wraps: (e) => e.classList.contains($V),
			hiddenClass: ZV,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${JV}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), B(this.root, `.${JV}`, {
			childList: !0,
			attributeFilter: [di, ..._i],
			relevant: (e) => !ig(e, `[${mi}]`, `.${JV}`)
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-tabs-selected") ?? "", n = this.ownHeaders(e), r = n.filter(rH), i = fd(r, t, (e) => e.getAttribute("data-ui-tab-key") ?? "");
		if (i !== null && i !== t) {
			this.select(e, i);
			return;
		}
		let a = n.find((e) => e.classList.contains(XV)) ?? null, o = null;
		for (let n of ld(e, `[${hi}]`, `.${JV}`)) n.hidden = (n.getAttribute("data-ui-tab-actions") ?? "") !== t;
		for (let e of n) {
			let n = (e.getAttribute("data-ui-tab-key") ?? "") === t;
			e.classList.toggle(XV, n), e.setAttribute("aria-selected", n ? "true" : "false"), GV(e), n && (o = e);
		}
		this.fitHeaders(e, r, o), KV(a, o), N(n.filter((e) => !e.classList.contains(ZV)), o);
		for (let n of this.ownPages(e)) n.hidden = (n.getAttribute("data-ui-tab-page") ?? "") !== t, !n.hidden && a !== null && a !== o && qV(n);
	}
	fitHeaders(e, t, n) {
		let r = e.querySelector(`:scope > .${eH}, :scope > .${tH} > .${eH}`), i = r?.querySelector(":scope > .ui-tab-overflow") ?? null;
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
			return this.ownHeaders(e).filter(rH).map((e) => {
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
		let t = e.target.closest(`.${MV}`), n = t?.closest(`.${JV}`) ?? null;
		if (t !== null && n !== null && t.closest(`.${JV}`) === n) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = e.target.closest(`.${YV}`);
		if (r === null || O(r)) return;
		let i = r.closest(`.${JV}`), a = r.getAttribute(pi);
		i !== null && a !== null && r.closest(`.${JV}`) === i && (e.preventDefault(), this.select(i, a));
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || Ou(e) || !M(e)) return;
		let t = e.target.closest(`.${YV}`), n = t?.closest(`.${JV}`) ?? null;
		if (t === null || n === null) return;
		let r = Vu({
			key: e.key,
			items: this.ownHeaders(n),
			current: t,
			axis: "horizontal"
		});
		r !== null && (e.preventDefault(), this.select(n, r.getAttribute("data-ui-tab-key") ?? ""), r.focus());
	}
	select(e, t) {
		dd(e, t, {
			attribute: di,
			bindingAttribute: ui,
			apply: (e) => this.apply(e)
		});
	}
	ownHeaders(e) {
		return ld(e, `.${YV}`, `.${JV}`);
	}
	ownPages(e) {
		return ld(e, `[${mi}]`, `.${JV}`);
	}
};
function rH(e) {
	return e.classList.contains(ZV) || YF(e);
}
//#endregion
//#region src/interactions/tab-out.ts
function iH(e) {
	e.hasAttribute("data-ui-tab-out") || (e.setAttribute(Fe, e.getAttribute("tabindex") ?? ""), e.setAttribute("tabindex", "-1"));
}
function aH(e) {
	let t = e.getAttribute(Fe);
	t !== null && (e.removeAttribute(Fe), t.length === 0 ? e.removeAttribute("tabindex") : e.setAttribute("tabindex", t));
}
function oH(e) {
	return e.tabIndex >= 0 || e.hasAttribute("data-ui-tab-out");
}
//#endregion
//#region src/interactions/command-bar-engine.ts
var sH = "ui-command-bar", cH = "ui-command-bar__host", lH = "ui-command-bar__item", uH = "ui-command-bar__overflow", dH = "ui-command-bar--overflowing", fH = "ui-command-bar__overflowed", pH = "ui-orientation--vertical", mH = "ui-text__title", hH = `${Wf}, [${Fe}]`, gH = class {
	root;
	fitter;
	listed = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new LV({
			rootClass: sH,
			overflowingClass: dH,
			wraps: (e) => !xH(e),
			hiddenClass: fH,
			trailing: !0,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pick(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${sH}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), B(this.root, `.${sH}`, {
			childList: !0,
			addedOnly: !0,
			relevant: _H
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = vH(e), n = e.querySelector(`:scope > .${uH}`);
		if (t === null || n === null) return;
		let r = SH(t);
		this.fitter.fit(e, {
			room: e,
			button: n,
			captions: r,
			selected: null
		}), e.classList.contains(dH) && CH(r);
		for (let e of r) ih(e, e.classList.contains(fH) ? n : null);
		e.classList.contains(pH) ? e.setAttribute("aria-orientation", "vertical") : e.removeAttribute("aria-orientation"), yH(e, null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${uH}`), n = t?.parentElement ?? null;
		t !== null && n !== null && n.classList.contains(sH) && (e.preventDefault(), this.fitter.toggleList(n, t, () => this.entriesOf(n)));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof HTMLElement) || !M(e) || Ou(e)) return;
		let t = e.target.closest(`.${sH}`), n = t === null ? [] : bH(t);
		if (t === null || !n.includes(e.target)) return;
		let r = Vu({
			key: e.key,
			items: n,
			current: e.target,
			axis: t.classList.contains(pH) ? "vertical" : "horizontal"
		});
		r !== null && (e.preventDefault(), yH(t, r), r.focus());
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement ? e.target : null, n = t?.closest(`.${sH}`) ?? null;
		t !== null && n !== null && bH(n).includes(t) && yH(n, t);
	}
	entriesOf(e) {
		let t = vH(e), n = t === null ? [] : SH(t).filter((e) => e.classList.contains(lH) && e.classList.contains(fH)).map((e) => e.querySelector("[data-ui-id]") ?? e);
		return this.listed.set(e, n), n.map((e, t) => ({
			key: String(t),
			title: wH(e),
			current: !1,
			disabled: O(e)
		}));
	}
	pick(e, t) {
		let n = this.listed.get(e)?.[Number(t)];
		n?.isConnected === !0 && !O(n) && TH(n).click();
	}
};
function _H(e) {
	let t = e.target;
	if (t instanceof Element && (t.classList.contains(sH) || t.classList.contains(cH) || t.classList.contains(lH))) return !0;
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains(sH) || t.querySelector(`.${sH}`) !== null)) return !0;
	return !1;
}
function vH(e) {
	return e.querySelector(`:scope > .${cH}`);
}
function yH(e, t) {
	let n = bH(e), r = n.find((e) => e.tabIndex >= 0 && P(e)), i = t ?? n.find((e) => e === document.activeElement) ?? r ?? n.find(P) ?? null;
	for (let e of n) e === i ? aH(e) : iH(e);
}
function bH(e) {
	let t = vH(e), n = [];
	for (let e of t === null ? [] : SH(t)) if (e.classList.contains(lH) && !e.classList.contains(fH)) for (let t of e.querySelectorAll(hH)) oH(t) && zu(e, t) && n.push(t);
	let r = e.querySelector(`:scope > .${uH}`);
	return r !== null && e.classList.contains(dH) && n.push(r), n;
}
function xH(e) {
	let t = vH(e);
	if (t === null) return !1;
	let n = getComputedStyle(t);
	return n.flexDirection.startsWith("row") && n.flexWrap === "nowrap";
}
function SH(e) {
	let t = [];
	for (let n of Array.from(e.children)) {
		if (n.classList.contains("ui-hidden")) continue;
		if (n.hasAttribute("data-ui-group-header")) {
			t.push(n);
			continue;
		}
		let e = n.classList.contains(lH) ? n.querySelector(S) : null;
		e !== null && YF(e) && t.push(n);
	}
	return t;
}
function CH(e) {
	let t = !1;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.classList.contains(lH) ? t ||= !r.classList.contains(fH) : t || r.classList.add(fH);
	}
}
function wH(e) {
	let t = TH(e), n = t.querySelector(`.${mH}`)?.textContent?.trim() ?? "";
	return n.length > 0 ? n : e.getAttribute("aria-label")?.trim() || t.getAttribute("aria-label")?.trim() || t.textContent?.trim() || "";
}
function TH(e) {
	return e.matches(Wf) ? e : e.querySelector(Wf) ?? e;
}
//#endregion
//#region src/interactions/breadcrumbs-engine.ts
var EH = "ui-breadcrumbs", DH = "ui-breadcrumbs__item", OH = "ui-breadcrumb", kH = "ui-breadcrumb--current", AH = "ui-hidden", jH = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), B(this.root, `.${EH}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: ["class", ..._i]
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${EH}`)) this.apply(e);
	}
	apply(e) {
		let t = ld(e, `.${DH}`, `.${EH}`);
		MH(t);
		let n = t.filter((e) => !e.classList.contains(AH)).map((e) => e.querySelector(`.${OH}`)).filter((e) => e !== null && !e.classList.contains(AH)), r = n.length === 0 ? null : n[n.length - 1];
		for (let e of n) {
			let t = e === r;
			e.classList.toggle(kH, t), t ? (e.setAttribute("aria-current", "page"), e.setAttribute("tabindex", "-1")) : (e.removeAttribute("aria-current"), e.removeAttribute("tabindex"));
		}
	}
};
function MH(e) {
	let t = Bm.map(() => !1);
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n], i = Bm.map((e, t) => NH(r, t));
		if (PH(r, Mr, Bm.filter((e, t) => i[t])), PH(r, Nr, Bm.filter((e, n) => !t[n])), !r.classList.contains(AH)) for (let e = 0; e < Bm.length; e++) t[e] ||= !i[e];
	}
}
function NH(e, t) {
	for (let n of e.children) if (n.getAttribute(_i[t]) === "collapsed") return !0;
	return !1;
}
function PH(e, t, n) {
	let r = n.join(" ");
	C(e, t, r.length === 0 ? null : r);
}
//#endregion
//#region src/interactions/color-input-engine.ts
var FH = "ui-color-input", IH = "ui-color-input--open", LH = "ui-color-input__popup", RH = "ui-color-input__text", zH = "ui-color-input__row", BH = "ui-color-input__swatch--button", VH = "ui-color-input__value-input", HH = "ui-color-input__square-thumb", UH = "ui-color-input__hue-thumb", WH = "data-ui-color-toggle", GH = "data-ui-color-tab", KH = "data-ui-color-tab-selected", qH = "data-ui-color-pane", JH = "data-ui-color-pane-selected", YH = "data-ui-color-square", XH = "data-ui-color-hue", ZH = "data-ui-color-hex", QH = "data-ui-color-channel", $H = "data-ui-color-factor", eU = "data-ui-color-opacity", tU = "data-ui-color-name", nU = "data-ui-color-name-selected", rU = "data-ui-color-format", iU = "data-ui-color-variant", aU = "data-ui-color-no-picker", oU = "data-ui-color-no-palette", sU = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	popups = new y_({
		show: ({ owner: e }) => e.classList.add(IH),
		hide: ({ owner: e }) => e.classList.remove(IH)
	});
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${FH}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(za(e.components, `.${FH}`));
		}), B(this.root, `.${FH}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [
				rU,
				iU,
				aU,
				oU
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), new Ig({
			root: this.root,
			resolveHandle: (e) => e.closest(`[${YH}], [${XH}]`),
			begin: (e, t) => {
				let n = e.closest(`.${FH}`);
				if (n === null) return null;
				let r = {
					input: n,
					element: e,
					surface: e.hasAttribute(YH) ? "square" : "hue",
					stateBefore: this.states.get(n),
					valueBefore: n.querySelector(`.${VH}`)?.value ?? null
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
		let t = fU(e), n = this.states.get(e), r = n?.paneChosen === !0 ? cU(e, n.pane) : lU(e);
		if (t.length === 0 || t.startsWith("@")) return {
			...n ?? uU(r),
			pane: r,
			held: !1
		};
		if (t.startsWith("#")) {
			let i = bU(t);
			if (i === null) return n ?? uU(r);
			let [a, o, s, c] = i;
			if (n !== void 0 && n.name === null && dU(this.resolveRgb(e, n), [
				a,
				o,
				s
			])) return {
				...n,
				pane: r,
				opacity: c,
				held: !0
			};
			let [l, u, d] = CU(a, o, s);
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
			...n ?? uU(r),
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
			let [e, a, o] = CU(n, r, i);
			t = {
				...t,
				hue: e,
				saturation: a,
				value: o
			};
		}
		let a = this.states.get(e);
		this.states.set(e, t), gU(e, "--ui-color-input-color", t.held ? SU(n, r, i, t.opacity) : "transparent"), gU(e, "--ui-color-input-solid", SU(n, r, i, 255)), gU(e, "--ui-color-input-on-color", t.held ? PS(n, r, i, t.opacity) : "inherit"), hU(e, t.held ? mU(e, n, r, i, t.opacity) : ""), this.applyPicker(e, t, n, r, i), (a === void 0 || a.name !== t.name || a.pane !== t.pane || a.held !== t.held) && (this.applyPalette(e, t), this.applyPanes(e, t));
	}
	applyPicker(e, t, n, r, i) {
		let a = e.querySelector(`[${YH}]`), o = e.querySelector(`[${XH}]`), [s, c, l] = wU(t.hue, 1, 1);
		if (gU(e, "--ui-color-input-hue", SU(s, c, l, 255)), a !== null) {
			let e = a.querySelector(`.${HH}`);
			e !== null && (gU(e, "left", `${t.saturation * 100}%`), gU(e, "top", `${(1 - t.value) * 100}%`));
		}
		if (o !== null) {
			let e = o.querySelector(`.${UH}`);
			e !== null && gU(e, "top", `${t.hue / 360 * 100}%`);
		}
		_U(e, `[${ZH}]`, xU(n, r, i)), _U(e, `[${QH}="r"]`, String(n)), _U(e, `[${QH}="g"]`, String(r)), _U(e, `[${QH}="b"]`, String(i)), gU(e, "--ui-color-input-opacity-fill", `${t.opacity / 255 * 100}%`), vU(e, `[${eU}]`, t.opacity);
	}
	applyPalette(e, t) {
		for (let n of e.querySelectorAll(`[${tU}]`)) n.getAttribute(tU) === t.name ? n.setAttribute(nU, "") : n.removeAttribute(nU);
		let n = t.name === null ? null : e.querySelector(`[${tU}="${Ji(t.name)}"]`), r = n === null ? null : bU(n.style.getPropertyValue("--ui-color-input-chip").trim());
		gU(e, "--ui-color-input-base", r === null ? "transparent" : SU(r[0], r[1], r[2], 255)), vU(e, `[${$H}]`, t.factor);
	}
	applyPanes(e, t) {
		for (let n of e.querySelectorAll(`[${qH}]`)) n.getAttribute(qH) === t.pane ? n.setAttribute(JH, "") : n.removeAttribute(JH);
		for (let n of e.querySelectorAll(`[${GH}]`)) n.getAttribute(GH) === t.pane ? n.setAttribute(KH, "") : n.removeAttribute(KH);
	}
	resolveRgb(e, t) {
		if (t.name === null) return wU(t.hue, t.saturation, t.value);
		let n = e.querySelector(`[${tU}="${Ji(t.name)}"]`), r = n === null ? null : bU(n.style.getPropertyValue("--ui-color-input-chip").trim());
		return r === null ? wU(t.hue, t.saturation, t.value) : yU([
			r[0],
			r[1],
			r[2]
		], t.factor);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${WH}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${FH}`));
			return;
		}
		let n = e.target.closest(`[${GH}]`), r = e.target.closest(`.${FH}`);
		if (r === null) return;
		if (n !== null) {
			e.preventDefault();
			let t = n.getAttribute(GH), i = this.states.get(r);
			i !== void 0 && (t === "picker" || t === "palette") && this.applyState(r, {
				...i,
				pane: t,
				paneChosen: !0
			});
			return;
		}
		let i = e.target.closest(`[${tU}]`);
		if (i !== null) {
			e.preventDefault(), this.commit(r, (e) => ({
				...e,
				name: i.getAttribute(tU)
			}));
			return;
		}
		let a = r.querySelector(`.${LH}`);
		(a === null || !e.composedPath().includes(a)) && (e.preventDefault(), this.toggle(r));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target.closest(`.${FH}`);
		t !== null && (e.target.hasAttribute($H) ? this.commit(t, (t) => ({
			...t,
			factor: Number(e.target instanceof HTMLInputElement ? e.target.value : 0)
		}), !1) : e.target.hasAttribute(eU) && this.commit(t, (t) => ({
			...t,
			opacity: MS(Number(e.target instanceof HTMLInputElement ? e.target.value : 255))
		}), !1));
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target, n = t.closest(`.${FH}`);
		if (n === null) return;
		if (t.hasAttribute($H) || t.hasAttribute(eU)) {
			this.send(n);
			return;
		}
		if (t.hasAttribute(ZH)) {
			let e = bU(t.value);
			if (e === null) {
				this.applyAll([n]);
				return;
			}
			let [r, i, a] = CU(e[0], e[1], e[2]);
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
		let r = t.getAttribute(QH);
		if (r === null) return;
		let i = this.states.get(n);
		if (i === void 0) return;
		let [a, o, s] = this.resolveRgb(n, i), c = {
			r: a,
			g: o,
			b: s
		};
		c[r] = MS(Number(t.value));
		let [l, u, d] = CU(c.r, c.g, c.b);
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
		let t = e.input.querySelector(`.${VH}`);
		t !== null && e.valueBefore !== null && (t.value = e.valueBefore);
	}
	applyPoint(e, t) {
		let { input: n, element: r, surface: i } = e, a = r.getBoundingClientRect();
		if (i === "hue") {
			let e = TU((t.y - a.top) / a.height);
			this.commit(n, (t) => ({
				...t,
				hue: e * 360,
				name: null
			}), !1);
			return;
		}
		let o = TU((t.x - a.left) / a.width), s = 1 - TU((t.y - a.top) / a.height);
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
		let a = e.querySelector(`.${VH}`);
		a !== null && (a.value = pU(i, this.resolveRgb(e, i)), n && this.send(e));
	}
	send(e) {
		A(e) || e.querySelector(`.${VH}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	toggle(e) {
		if (e === null || e.hasAttribute(aU) && e.hasAttribute(oU)) return;
		if (this.popups.isOpen(e)) {
			this.popups.close(e);
			return;
		}
		let t = e.querySelector(`.${LH}`);
		if (t === null) return;
		let n = e.getAttribute(iU) === "swatch", r = n ? e.querySelector(`.${BH}`) : e.querySelector(`.${zH}`), i = n ? r : r?.querySelector(`[${WH}]`) ?? null;
		this.popups.open({
			owner: e,
			popup: t,
			anchor: r ?? e,
			placement: { placement: "bottom-end" },
			openers: i === null ? [] : [i],
			focus: t.querySelector(`[${KH}]`) ?? !0
		});
	}
};
function cU(e, t) {
	return ((t) => !e.hasAttribute(t === "picker" ? aU : oU))(t) ? t : t === "picker" ? "palette" : "picker";
}
function lU(e) {
	return cU(e, "picker");
}
function uU(e) {
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
function dU(e, t) {
	return e[0] === t[0] && e[1] === t[1] && e[2] === t[2];
}
function fU(e) {
	return e.querySelector(`.${VH}`)?.value.trim() ?? "";
}
function pU(e, t) {
	if (e.name !== null) {
		let t = e.factor === 0 ? "None" : e.factor < 0 ? "Shade" : "Tint";
		return `${e.name}/${t}/${Math.abs(e.factor)}/${e.opacity}`;
	}
	let n = xU(t[0], t[1], t[2]);
	return e.opacity === 255 ? n : `${n}${NS(e.opacity)}`;
}
function mU(e, t, n, r, i) {
	if (e.getAttribute(rU) === "rgb") return i === 255 ? `rgb(${t}, ${n}, ${r})` : `rgba(${t}, ${n}, ${r}, ${(i / 255).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")})`;
	let a = xU(t, n, r);
	return i === 255 ? a : `${a}${NS(i)}`;
}
function hU(e, t) {
	for (let n of e.querySelectorAll(`.${RH}`)) n.textContent !== t && (n.textContent = t);
}
function gU(e, t, n) {
	e !== null && e.style.getPropertyValue(t) !== n && e.style.setProperty(t, n);
}
function _U(e, t, n) {
	let r = e.querySelector(t);
	r !== null && r !== document.activeElement && r.value !== n && (r.value = n);
}
function vU(e, t, n) {
	for (let r of e.querySelectorAll(t)) r !== document.activeElement && r.value !== String(n) && (r.value = String(n));
}
function yU(e, t) {
	if (t === 0) return e;
	let n = Math.abs(t) / 10;
	return t < 0 ? [
		MS(e[0] * (1 - n)),
		MS(e[1] * (1 - n)),
		MS(e[2] * (1 - n))
	] : [
		MS(e[0] + (255 - e[0]) * n),
		MS(e[1] + (255 - e[1]) * n),
		MS(e[2] + (255 - e[2]) * n)
	];
}
function bU(e) {
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
function xU(e, t, n) {
	return `#${NS(e)}${NS(t)}${NS(n)}`;
}
function SU(e, t, n, r) {
	return `rgba(${e}, ${t}, ${n}, ${(r / 255).toFixed(3)})`;
}
function CU(e, t, n) {
	let r = e / 255, i = t / 255, a = n / 255, o = Math.max(r, i, a), s = o - Math.min(r, i, a), c = 0;
	return s !== 0 && (c = o === r ? (i - a) / s % 6 : o === i ? (a - r) / s + 2 : (r - i) / s + 4, c *= 60, c < 0 && (c += 360)), [
		c,
		o === 0 ? 0 : s / o,
		o
	];
}
function wU(e, t, n) {
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
		MS((o + a) * 255),
		MS((s + a) * 255),
		MS((c + a) * 255)
	];
}
function TU(e) {
	return Math.min(1, Math.max(0, e));
}
//#endregion
//#region src/interactions/surface-press-engine.ts
var EU = `:is(.ui-surface, .ui-card, .${wt})[${y}]`, DU = "ui-surface--clickable", OU = class {
	pressable = /* @__PURE__ */ new WeakSet();
	space = new ru();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("keydown", (e) => this.handleKeyDown(e)), t.addEventListener("keyup", (e) => this.space.release(e)), NU(t, ["hover", "press"], (e) => MU(e.closest(Pu))), B(t, EU, {
			childList: !0,
			attributeFilter: ["class"]
		}, (e) => this.syncEach(e)), this.syncEach(t.querySelectorAll(EU));
	}
	syncEach(e) {
		for (let t of e) {
			this.sync(t);
			let e = t.parentElement?.closest(EU) ?? null;
			e !== null && this.sync(e);
		}
	}
	sync(e) {
		e.classList.contains(DU) ? (this.pressable.add(e), C(e, "role", jU(e) ? "group" : "button"), C(e, "tabindex", e.matches(".ui-disabled, .ui-loading") ? null : AU(e) ? "-1" : "0")) : this.pressable.delete(e) && (e.removeAttribute("tabindex"), e.removeAttribute("role"));
	}
	handleKeyDown(e) {
		let t = kU(e);
		if (t === null) return;
		let n = e.key;
		n === "Enter" ? (e.preventDefault(), e.repeat || t.click()) : n === " " && (e.preventDefault(), this.space.hold(t));
	}
};
function kU(e) {
	if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !M(e, { shift: !0 })) return null;
	let t = e.target;
	return t instanceof HTMLElement && t.classList.contains(DU) && t.hasAttribute("tabindex") ? t : null;
}
function AU(e) {
	let t = e.closest(md);
	return t !== null && t.closest(F)?.matches(".ui-items-view, .ui-table") === !0 && Iu(t) === e;
}
function jU(e) {
	for (let t of e.querySelectorAll(Pu)) if (zu(e, t)) return !0;
	return !1;
}
function MU(e) {
	let t = [];
	for (let n = e?.parentElement?.closest(`.${DU}`) ?? null; n !== null; n = n.parentElement?.closest(`.${DU}`) ?? null) t.push(n);
	return t;
}
function NU(e, t, n) {
	let r = {
		hover: [],
		press: []
	}, i = !1, a = (e, t) => {
		let a = t instanceof Element ? n(t) : [];
		e === "press" && (i = !1);
		for (let t of r[e]) a.includes(t) || PU(t, e, !1);
		for (let t of a) PU(t, e, !0);
		r[e] = a;
	};
	t.includes("hover") && (e.addEventListener("pointerover", (e) => a("hover", e.target)), e.addEventListener("pointerout", (e) => a("hover", e.relatedTarget))), t.includes("press") && (e.addEventListener("pointerdown", (e) => a("press", e.button === 0 ? e.target : null), !0), e.addEventListener("pointerup", () => a("press", null), !0), e.addEventListener("dragend", () => a("press", null), !0), e.addEventListener("dragstart", () => {
		i = r.press.length > 0;
	}, !0), e.addEventListener("pointercancel", () => {
		i || a("press", null);
	}, !0));
}
function PU(e, t, n) {
	let r = (e.getAttribute("data-ui-inner-pointer") ?? "").split(" ").filter((e) => e !== "" && e !== t);
	n && r.push(t), C(e, ai, r.length === 0 ? null : r.sort().join(" "));
}
//#endregion
//#region src/interactions/table-columns-engine.ts
var FU = "ui-table", IU = "ui-table--reorderable", LU = "ui-scroll-x--auto", RU = "ui-scroll-x--always", zU = `:scope > .${ar}`, BU = `.${sr}`, VU = "ui-table__header-cell", HU = `${VU}--pinned`, UU = `${zU} > .${or} > .${VU}`, WU = `${UU}--pinned`, GU = "ui-table__host", KU = `${zU} > .${GU}`, qU = `.${FU}, .${ir}, [${er}]`, JU = "--ui-table-columns", YU = "--ui-table-sticky-top", XU = "--ui-table-sticky-bottom", ZU = "--ui-table-sized-columns", QU = "--ui-table-pin-", $U = 64, eW = "data-ui-table-cell-hidden", tW = "data-ui-table-cell-last", nW = "columns", rW = "hidden", iW = "order", aW = "layout", oW = 32, sW = 16, cW = class {
	root;
	store = new wP();
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
		if (this.root = e.root ?? document, this.drag = new Ig({
			root: this.root,
			resolveHandle: (e) => e.closest(BU),
			begin: (e) => this.resolveContext(e),
			coordinate: () => "clientX",
			move: (e, t) => this.apply(e, t),
			end: (e, t) => this.remember(t.table),
			cancel: (e, t) => this.putBack(t)
		}), this.reorder = new Ig({
			root: this.root,
			resolveHandle: (e) => this.resolveCaption(e),
			begin: (e, t) => this.beginReorder(e, t.x),
			coordinate: () => "clientX",
			move: (e, t) => this.aimDrop(e, t),
			end: (e, t) => this.endReorder(e, t)
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), NU(this.root, ["hover", "press"], (e) => {
			let t = e.closest(BU)?.parentElement ?? null;
			return t === null ? [] : [t];
		}), typeof matchMedia == "function") for (let e of Bm) e !== "base" && matchMedia(Hm(e)).addEventListener("change", () => this.layoutAll());
		this.restoreEach(this.root.querySelectorAll(`.${FU}`)), B(this.root, `.${FU}`, {
			childList: !0,
			relevant: pW
		}, (e) => {
			for (let t of e) this.restored.has(t) && (this.stampUnstyledColumns(t, !0), this.indexColumns(t, !0));
			this.restoreEach(e);
		}), B(this.root, `.${FU}`, {
			attributeFilter: ["class"],
			relevant: (e) => e.target instanceof Element && e.target.classList.contains(FU)
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.layout(t);
		}), B(this.root, `.${FU}`, {
			childList: !0,
			attributeFilter: ["class", "hidden"],
			relevant: mW
		}, (e) => {
			for (let t of e) {
				let e = t.querySelector(KU);
				e !== null && t.hasAttribute("data-ui-table-scrollbar") && this.markScrollbar(t, e);
			}
		});
	}
	restoreEach(e) {
		for (let t of e) {
			if (this.restored.has(t)) continue;
			this.restored.add(t), this.restore(t), this.layout(t), eB(t, () => this.pin(t));
			let e = t.querySelector(zU);
			e !== null && eB(e, () => lW(t, e));
			let n = t.querySelector(KU);
			n !== null && (this.markScrollbar(t, n), eB(n, () => this.markScrollbar(t, n)));
		}
	}
	restore(e) {
		let t = this.columnsOf(e), n = this.store.read(e, nW), r = n === null ? null : nl(n);
		r !== null && r.length !== t.length ? (this.store.write(e, nW, null), this.store.writeBoot(e, aW, null), this.widths.set(e, null)) : this.widths.set(e, r);
		let i = this.store.readJson(e, iW);
		i !== null && !gW(i, t) ? (this.store.write(e, iW, null), this.orders.set(e, null)) : this.orders.set(e, i);
	}
	markScrollbar(e, t) {
		let n = getComputedStyle(t).overflowY;
		e.toggleAttribute(vr, n === "scroll" || n === "auto" && t.scrollHeight > t.clientHeight);
	}
	layoutAll() {
		for (let e of this.root.querySelectorAll(`.${FU}`)) this.layout(e);
	}
	layout(e) {
		let t = this.columnsOf(e), n = this.hiddenOf(e, t), r = this.placesOf(e, t), i = hW(r), a = this.widths.get(e) ?? null, o = r.some((e, t) => e !== t), s = e.classList.contains(LU) || e.classList.contains(RU);
		if (a === null && n.size === 0 && !o && !s) e.style.removeProperty(ZU);
		else {
			let t = a ?? this.authoredTracks(e);
			if (t !== null) {
				let r = jl(t, n);
				e.style.setProperty(ZU, ol(i.map((e) => r[e]), s ? "max-content" : "auto"));
			}
		}
		for (let t = 0; t < r.length; t++) o ? e.style.setProperty(`${zd}${t}`, String(r[t])) : e.style.removeProperty(`${zd}${t}`);
		let c = [...n].sort((e, t) => e - t).join(" ");
		C(e, rr, c.length === 0 ? null : c);
		let l = [...i].reverse().find((e) => !n.has(e));
		if (l === void 0 ? e.removeAttribute(pr) : e.getAttribute("data-ui-table-last") !== String(l) && e.setAttribute(pr, String(l)), this.columnStates.set(e, {
			places: r,
			hidden: n,
			last: l ?? -1
		}), this.stampUnstyledColumns(e, !1), this.indexColumns(e, !1), e.classList.contains(IU)) for (let e of t) !e.anchored && !e.cell.hasAttribute("tabindex") && e.cell.setAttribute("tabindex", "-1");
		this.pin(e);
	}
	stampUnstyledColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0 || n.places.length <= $U) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}|${n.last}`;
		if (t || this.stampedStates.get(e) !== r) {
			this.stampedStates.set(e, r);
			for (let t of e.querySelectorAll(`[${er}]`)) {
				let r = Number(t.getAttribute(er));
				r >= $U && t.closest(`.${FU}`) === e && (t.style.order = String(n.places[r] ?? r), t.toggleAttribute(eW, n.hidden.has(r)), t.toggleAttribute(tW, r === n.last));
			}
		}
	}
	indexColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}`, i = this.indexedStates.get(e) === r;
		(!i || t) && (this.indexedStates.set(e, r), Wd(e, hW(n.places), n.hidden, i));
	}
	columnsOf(e) {
		let t = [];
		for (let n of e.querySelectorAll(UU)) {
			let e = Number(n.getAttribute(er)), r = n.getAttribute(tr), i = n.classList.contains(HU) || n.hasAttribute("data-ui-table-fixed");
			Number.isInteger(e) && t.push({
				index: e,
				key: n.getAttribute("data-ui-table-column-key") ?? String(e),
				hideBelow: bW(r) ? r : null,
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
		for (let e of t) (n[e.key] ?? yW(e)) && r.add(e.index);
		return r;
	}
	choicesOf(e) {
		let t = this.hiddenChoices.get(e);
		return t === void 0 && (t = this.store.readJson(e, rW) ?? {}, this.hiddenChoices.set(e, t)), t;
	}
	authoredTracks(e) {
		let t = e.style.getPropertyValue(JU).trim(), n = t.length === 0 ? null : nl(t);
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
		n === null || i !== void 0 && n === yW(i) ? delete r[t] : r[t] = n, this.hiddenChoices.set(e, r), this.store.writeJson(e, rW, Object.keys(r).length === 0 ? null : r), this.layout(e), this.rememberBoot(e);
	}
	columnOrder(e) {
		if (!(e instanceof HTMLElement)) return [];
		let t = this.columnsOf(e), n = new Map(t.map((e) => [e.index, e]));
		return hW(this.placesOf(e, t)).map((e) => n.get(e)?.key ?? "").filter((e) => e.length > 0);
	}
	pin(e) {
		let t = e.querySelectorAll(WU).length;
		if (t < 2) return;
		let n = Dl(this.trackSizes(e), t);
		for (let t = 1; t < n.length; t++) e.style.setProperty(`${QU}${t}`, `${n[t]}px`);
	}
	handleScroll(e) {
		let t = e.target;
		t instanceof HTMLElement && t.classList.contains("ui-table__scroll") && t.closest(`.${FU}`)?.toggleAttribute(_r, t.scrollLeft > 0);
	}
	trackSizes(e) {
		let t = e.querySelector(zU), n = t === null ? [] : getComputedStyle(t).gridTemplateColumns.split(" ").map(parseFloat);
		return dW(e) ? n.slice(1) : n;
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
		let t = e.target.closest(BU), n = t ?? (e.shiftKey ? uW(e.target) : null);
		if (n === null || this.drag.active || !M(e, { shift: t === null })) return;
		if (t !== null && e.key === "Enter" || t === null && e.key === "Backspace") {
			e.preventDefault(), this.reset(n);
			return;
		}
		let r = e.key === "PageUp" || e.key === "PageDown";
		if (!r && e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
		let i = this.resolveContext(n);
		if (i === null) return;
		let a = r ? tl(sW, i.sizes.reduce((e, t) => e + t, 0)) : sW;
		e.preventDefault(), this.apply(i, e.key === "ArrowRight" || e.key === "PageUp" ? a : -a) && this.remember(i.table);
	}
	stepColumn(e, t) {
		let n = e.target instanceof Element ? this.resolveCaption(e.target) : null, r = n?.closest(`.${FU}`) ?? null;
		if (n === null || r === null || this.reorder.active) return;
		let i = this.movableColumns(r), a = Number(n.getAttribute(er)), o = i.findIndex((e) => e.index === a), s = o + t;
		if (o < 0 || (e.preventDefault(), s < 0 || s >= i.length)) return;
		this.moveColumn(r, a, t < 0 ? i[s].index : i[s + 1]?.index ?? null), n.focus({ preventScroll: !0 });
		let c = this.columnStates.get(r);
		if (c !== void 0) {
			let e = hW(c.places).filter((e) => !c.hidden.has(e));
			Ak(e.indexOf(a) + 1, e.length);
		}
	}
	handleDoubleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(BU) : null;
		t !== null && this.reset(t);
	}
	reset(e) {
		let t = e.closest(`.${FU}`);
		t !== null && (this.widths.set(t, null), this.layout(t), this.remember(t));
	}
	apply(e, t) {
		let n = ml(e.tracks.map((t, n) => n === e.index || n === e.after ? {
			...t,
			min: Math.max(oW, e.floors.get(n) ?? 0)
		} : t), e.sizes, {
			before: [e.index],
			after: [e.after]
		}, t);
		return n !== null && (this.widths.set(e.table, fW(e.tracks, n, [e.index, e.after])), this.layout(e.table), !0);
	}
	putBack(e) {
		this.widths.set(e.table, e.before), this.layout(e.table);
	}
	remember(e) {
		let t = this.widths.get(e) ?? null;
		this.store.write(e, nW, t === null ? null : ol(t), null), this.rememberBoot(e);
	}
	rememberBoot(e) {
		let t = e.style.getPropertyValue(ZU).trim(), n = e.getAttribute(rr), r = {};
		t.length > 0 && (r[ZU] = t);
		for (let t of e.style) t.startsWith("--ui-table-order-") && (r[t] = e.style.getPropertyValue(t));
		Object.keys(r).length === 0 && n === null ? this.store.writeBoot(e, aW, null) : this.store.writeBoot(e, aW, {
			styles: r,
			attributes: {
				[rr]: n,
				[pr]: e.getAttribute(pr)
			}
		});
	}
	resolveContext(e) {
		let t = e.closest(`.${FU}`);
		if (t === null) return null;
		let n = this.widths.get(t) ?? null, r = n ?? this.authoredTracks(t);
		if (r === null) return null;
		let i = ll(t.getAttribute(Kn)), a = ul(r, i), o = /* @__PURE__ */ new Map(), s = this.columnsOf(t), c = this.placesOf(t, s), l = this.columnSizes(t, c).filter((e) => Number.isFinite(e));
		for (let e of i) e.min !== void 0 && o.set(e.index, e.min);
		let u = Number(e.getAttribute(er)), d = this.hiddenOf(t, s), f = hW(c), p = (c[u] ?? -1) + 1;
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
		let t = e.closest(`.${VU}`), n = t?.closest(`.${FU}`) ?? null;
		return t === null || n === null || !n.classList.contains(IU) || e.closest(BU) !== null || t.classList.contains(HU) || t.hasAttribute("data-ui-table-fixed") ? null : t;
	}
	beginReorder(e, t) {
		let n = e.closest(`.${FU}`), r = Number(e.getAttribute(er));
		if (n === null || !Number.isInteger(r)) return null;
		let i = this.movableColumns(n), a = i.findIndex((e) => e.index === r);
		if (a < 0 || i.length < 2) return null;
		let o = i.map(_W), s = n.querySelector(zU), c = getComputedStyle(n).direction === "rtl";
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
		for (let a of hW(this.placesOf(e, t))) {
			let e = r.get(a);
			e !== void 0 && !e.anchored && !n.has(a) && i.push(e);
		}
		return i;
	}
	aimDrop(e, t) {
		let n = e.origin + t + ((e.scroll?.scrollLeft ?? 0) - e.scrolledAt), r = 0;
		for (; r < e.middles.length && (e.rightToLeft ? n < e.middles[r] : n > e.middles[r]);) r++;
		let i = Math.min(Math.max(r > e.from ? r - 1 : r, 0), e.places.length - 1);
		if (i === e.target || (e.target = i, vW(e.table), i === e.from)) return;
		let a = e.places.filter((t, n) => n !== e.from), o = a[e.target];
		o === void 0 ? a[a.length - 1].cell.setAttribute(gr, "after") : o.cell.setAttribute(gr, "before");
	}
	endReorder(e, t) {
		if (e.removeAttribute(hr), t.table.removeAttribute(mr), vW(t.table), t.target === t.from) return;
		let n = t.places.filter((e, n) => n !== t.from);
		Rg(), this.moveColumn(t.table, t.index, n[t.target]?.index ?? null);
	}
	moveColumn(e, t, n) {
		let r = this.columnsOf(e), i = new Map(r.map((e) => [e.index, e])), a = hW(this.placesOf(e, r)).filter((e) => i.get(e)?.anchored === !1), o = a.indexOf(t);
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
		this.orders.set(e, u ? null : c), this.store.write(e, iW, u ? null : JSON.stringify(c)), this.layout(e), this.rememberBoot(e);
	}
};
function lW(e, t) {
	let n = 0, r = 0, i = !1;
	for (let e of t.children) if (e.matches(`.${GU}`)) i = !0;
	else if (!(e instanceof HTMLElement) || e.getAttribute("role") !== "row") continue;
	else i ? r += e.offsetHeight : n += e.offsetHeight;
	e.style.setProperty(YU, `${n}px`), e.style.setProperty(XU, `${r}px`);
}
function uW(e) {
	let t = e.matches(`.${VU}`) ? e.querySelector(`:scope > ${BU}`) : null;
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function dW(e) {
	return e.hasAttribute("data-ui-rows-draggable") && e.hasAttribute("data-ui-rows-drag-handle") && e.classList.contains("ui-drag-handle--start");
}
function fW(e, t, n) {
	for (let r of n) e[r].kind === "star" && e[r].min === e[r].value && t[r].kind === "star" && (t[r] = {
		...t[r],
		min: t[r].value
	});
	return t;
}
function pW(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(qU) || t.querySelector(qU) !== null)) return !0;
	return !1;
}
function mW(e) {
	let t = e.type === "childList" ? e.target : e.target.parentElement;
	return t instanceof Element && t.classList.contains(GU);
}
function hW(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) t[e[n]] = n;
	return t;
}
function gW(e, t) {
	if (e.length !== t.length) return !1;
	let n = new Set(t.map((e) => e.key));
	return e.every((e) => n.delete(e)) && n.size === 0;
}
function _W(e) {
	let t = e.cell.getBoundingClientRect();
	return t.left + t.width / 2;
}
function vW(e) {
	for (let t of e.querySelectorAll(`[${gr}]`)) t.removeAttribute(gr);
}
function yW(e) {
	return e.startsHidden || e.hideBelow !== null && Bm.indexOf(Wm()) < Bm.indexOf(e.hideBelow);
}
function bW(e) {
	return e !== null && Bm.includes(e);
}
//#endregion
//#region src/items/items-group-runs.ts
var xW = /* @__PURE__ */ new WeakMap();
function SW(e, t) {
	let n = /* @__PURE__ */ new Set(), r = e.getAttribute(rn);
	for (let i of G(e)) {
		let a = i.getAttribute("data-ui-group") ?? "";
		if (a !== "" && a !== r) {
			let r = CW(i, a) ?? wW(e, i, a, t);
			r !== null && n.add(r);
		}
		r = a;
	}
	for (let t of e.querySelectorAll(`:scope > [${Ft}]`)) n.has(t) || t.remove();
}
function CW(e, t) {
	let n = e.previousElementSibling, r = n === null ? void 0 : xW.get(n);
	return r !== void 0 && r.row === e && r.group === t ? n : null;
}
function wW(e, t, n, r) {
	let i = r(t);
	return i === null ? null : (OW(i, t.getAttribute(b)), xW.set(i, {
		row: t,
		group: n
	}), e.insertBefore(i, t), i);
}
function TW(e, t) {
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
function EW(e) {
	return e.find((e) => !e.classList.contains(Ci));
}
function DW(e, t, n, r, i) {
	let a = t.renderFromTemplate(e, n, i);
	if (a === null) return null;
	let o = document.createElement("div");
	return OW(o, r), o.appendChild(a), o;
}
function OW(e, t) {
	e.setAttribute(Ft, ""), t === null ? e.removeAttribute(It) : e.setAttribute(It, t);
}
var kW = "bottom", AW = "pending", jW = "focus";
function MW(e, t, n) {
	let r = NW(e, t);
	n <= 0 ? r?.remove() : (r ??= PW(t), t === "top" ? e.firstElementChild !== r && e.insertBefore(r, e.firstElementChild) : e.lastElementChild !== r && e.appendChild(r), r.style.height = `${n}px`);
}
function NW(e, t) {
	for (let n of e.children) if (n.getAttribute("data-ui-window-spacer") === t) return n;
	return null;
}
function PW(e) {
	let t = document.createElement("div");
	return t.setAttribute(Yt, e), t.style.flexShrink = "0", t;
}
function FW(e, t) {
	let n = NW(e, jW);
	if (t <= 0) return n?.remove(), null;
	let r = n ?? PW(jW);
	return r.style.height = `${t}px`, r;
}
function IW(e, t, n) {
	t === null ? (e.sum += n, e.count++) : e.sum += n - t;
}
//#endregion
//#region src/items/items-dom-order.ts
function LW(e, t) {
	let n = e.firstElementChild;
	n !== null && n.getAttribute("data-ui-window-spacer") === "top" && (n = n.nextElementSibling);
	for (let r of t) r !== n && e.insertBefore(r, n), n = r.nextElementSibling;
}
//#endregion
//#region src/items/items-group-renderer.ts
var RW = /* @__PURE__ */ new WeakMap();
function zW(e) {
	for (let t of e.querySelectorAll(`:scope > [${Ft}]`)) t.remove();
}
function BW(e, t, n, r, i, a) {
	let o = gk(e, G(e)), s = n.getGroupTemplate(t), c = s !== void 0, l = c && o.some((e) => e.hasAttribute("data-ui-group")), u = sk(i.getItemsFilterSortMetadata(t), a, tk(e));
	if (c && !l && (zW(e), RW.delete(e)), o.length === 0) return;
	let d = PO(e);
	if (!l) {
		LW(e, [...ck(o, u, r), ...NO(d)]);
		return;
	}
	let { buckets: f, order: p } = TW(o, (e) => e.getAttribute("data-ui-group") ?? ""), m = r.getAncestorStack(e), h = RW.get(e), g = /* @__PURE__ */ new Map(), _ = [];
	for (let t of p) {
		let n = f.get(t);
		u.length > 0 && (n = ck(n, u, r));
		let i = t === "" ? void 0 : EW(n);
		if (i !== void 0) {
			let n = VW(e, h?.get(t), i) ?? DW(s, r, r.getItemValue(i), i.getAttribute("data-ui-key"), m);
			n !== null && (g.set(t, n), _.push(n));
		}
		_.push(...n);
	}
	let v = new Set(g.values());
	for (let t of e.querySelectorAll(`:scope > [${Ft}]`)) v.has(t) || t.remove();
	RW.set(e, g), LW(e, [..._, ...NO(d)]);
}
function VW(e, t, n) {
	if (t !== void 0 && t.parentElement === e) return OW(t, n.getAttribute(b)), t;
}
//#endregion
//#region src/items/items-host-sync.ts
var HW = "ui-tree-rules", UW = `:scope > .${lr}:not(.${fr})`, WW = null;
function GW(e, t, n) {
	WW === null ? KW(e, t, n) : (WW.hosts.set(e, {
		componentId: t,
		context: n
	}), W(e) === "virtualized" && WW.drawing.add(e));
}
function KW(e, t, n) {
	if (e.parentElement?.classList.contains("ui-tree") === !0) e.dispatchEvent(new Event(HW, { bubbles: !0 })), FO(e, t, n.templates, n.renderer, e.querySelector(UW) !== null);
	else switch (W(e)) {
		case "windowed":
			FO(e, t, n.templates, n.renderer), JW(e, t, n);
			return;
		case "virtualized":
			n.virtualization.sync(e);
			return;
		default:
			ik(e, t, n.metadata, n.renderer, n.state), qW(e), FO(e, t, n.templates, n.renderer), BW(e, t, n.templates, n.renderer, n.metadata, n.state);
			return;
	}
}
function qW(e) {
	let t = Lf(e);
	t !== null && If(t, G(e).filter((e) => e instanceof HTMLElement));
}
function JW(e, t, n) {
	let r = n.templates.getGroupTemplate(t);
	if (r === void 0) return;
	let i = n.renderer.getAncestorStack(e);
	SW(e, (e) => DW(r, n.renderer, n.renderer.getItemValue(e), e.getAttribute(b), i));
}
function YW(e) {
	if (WW !== null) {
		e();
		return;
	}
	let t = {
		hosts: /* @__PURE__ */ new Map(),
		drawing: /* @__PURE__ */ new Set()
	};
	WW = t;
	try {
		e();
	} finally {
		WW = null;
		for (let [e, n] of t.hosts) XW(e, n);
	}
}
function XW(e, t) {
	try {
		e.isConnected && KW(e, t.componentId, t.context);
	} catch (t) {
		c("bringing an items host in step failed.", {
			host: e,
			error: t
		});
	}
}
function ZW(e) {
	if (WW !== null && WW.drawing.size !== 0) for (let t of WW.drawing) {
		let n = WW.hosts.get(t);
		n !== void 0 && e(t) && (WW.drawing.delete(t), WW.hosts.delete(t), XW(t, n));
	}
}
//#endregion
//#region src/rendering/tree-boot-fold.ts
var QW = "fold", $W = ["fold-hidden", "fold-shown"], eG = ".ui-table", tG = `:scope > .${ar} > .${or} > [role='columnheader']`, nG = `:scope > .${sr}`, rG = "input:not([type='hidden']), button, select, textarea, a[href]", iG = /* @__PURE__ */ new WeakMap();
function aG(e) {
	for (let t of e.querySelectorAll(tG)) {
		let e = oG(t);
		e !== null && e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
	}
}
function oG(e) {
	let t = e.querySelector(rG);
	if (t !== null) return t;
	if (e.hasAttribute("tabindex")) return e;
	let n = e.querySelector(nG);
	return n !== null && n.getClientRects().length > 0 ? e : null;
}
function sG(e, t = null) {
	let n = cG(e), r = iG.get(e), i = n.find((e) => t !== null && uG(e) === t) ?? (r !== void 0 && n.includes(r) ? r : n[0]);
	return i !== void 0 && (lG(e, i), !0);
}
function cG(e) {
	let t = Bd(e), n = [];
	for (let r of e.querySelectorAll(tG)) {
		let e = oG(r), i = Number(r.getAttribute("data-ui-table-column") ?? NaN);
		e !== null && Number.isInteger(i) && P(e) && n.push({
			stop: e,
			place: t.place(i)
		});
	}
	return n.sort((e, t) => e.place - t.place).map((e) => e.stop);
}
function lG(e, t) {
	t.hasAttribute("tabindex") || t.setAttribute("tabindex", "-1"), iG.set(e, t), t.focus();
}
function uG(e) {
	return e.closest("[role='columnheader']")?.getAttribute("data-ui-table-column") ?? null;
}
function dG(e) {
	let t = e.closest("[role='columnheader']"), n = t?.parentElement?.parentElement?.parentElement ?? null;
	return t !== null && n instanceof HTMLElement && n.matches(eG) && oG(t) === e ? n : null;
}
function fG(e, t, n) {
	if (!M(e) || !(e.target instanceof HTMLElement)) return !1;
	switch (e.key) {
		case "ArrowDown": return n(uG(e.target)), !0;
		case "ArrowUp": return !0;
	}
	if (!Hu(e.key, "horizontal")) return !1;
	let r = Vu({
		key: e.key,
		items: cG(t),
		current: e.target,
		axis: "horizontal",
		loop: !1
	});
	return r !== null && r !== e.target && lG(t, r), !0;
}
//#endregion
//#region src/interactions/items-selection-engine.ts
var pG = /* @__PURE__ */ new Set([
	" ",
	"Enter",
	"Delete"
]), mG = ".ui-table", hG = /* @__PURE__ */ new Set([
	"ArrowLeft",
	"ArrowRight",
	"ArrowUp",
	"ArrowDown",
	"Home",
	"End",
	"Enter",
	"F2",
	" "
]), gG = `:scope > [${x}], :scope > .${ar}, :scope > .${ar} > [${x}]`, _G = class {
	root;
	rows;
	pressedBoxes = [];
	windowEnds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.rows = e.rows, this.applyAll(this.root.querySelectorAll(F)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("mouseup", () => this.restoreBoxes(), !0), this.root.addEventListener("pointercancel", () => this.restoreBoxes(), !0), this.root.addEventListener("contextmenu", () => this.restoreBoxes(), !0), B(this.root, F, { childList: !0 }, (e) => this.applyAll(e)), B(this.root, F, { attributeFilter: [
			oi,
			ci,
			li,
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
		let t = Rd(e);
		wd(e, t);
		for (let t of e.querySelectorAll(gG)) yG(t);
		if (e.matches(".ui-items-view, .ui-table")) {
			e.matches(mG) && aG(e);
			for (let n of t) {
				let t = Iu(n);
				t !== null && yG(t);
				for (let e of Lu(n)) yG(e);
				vG(e, n, n.hasAttribute(Ne));
			}
			this.settleWindowEnd(e, t);
		}
	}
	settleWindowEnd(e, t) {
		let n = this.windowEnds.get(e), r = n === void 0 ? null : Nd(e);
		if (n === void 0 || r === null || r.hasAttribute("data-ui-window-pending")) return;
		let i = vO(r, en) !== null, a = n === "first" ? _O(r) === 0 && !yO(r, "data-ui-window-more-before") : !yO(r, nn);
		if (i && !a) return;
		this.windowEnds.delete(e);
		let o = Df(n === "first" ? "Home" : "End", t, null, DG(e));
		o !== null && (of(e, t, o), e.getAttribute("data-ui-selection") === "one" && Ed(e, t, o, gd));
	}
	remark(e) {
		let t = Rd(e);
		wd(e, t), this.settleWindowEnd(e, t);
	}
	handleClick(e) {
		let t = this.resolveRow(e, F);
		if (t === null || !(e instanceof MouseEvent)) return;
		let { root: n, item: r } = t, i = Rd(n);
		of(n, i, r, e.target instanceof Element ? Sf(r, e.target) : null), R(n), n.hasAttribute("data-ui-no-row-select") ? yd(n, r) : Ed(n, i, r, bd(e), this.heldRange(n)) && e.preventDefault();
	}
	resolveRow(e, t) {
		if (!(e.target instanceof Element)) return null;
		let n = e.target.closest(md), r = n?.closest(F) ?? null;
		return n === null || r === null || n.closest(F) !== r || !r.matches(t) || O(r) ? null : Bu(e.target, n) === null && !k(n) ? {
			root: r,
			item: n
		} : null;
	}
	heldRange(e) {
		let t = this.rows, n = Nd(e);
		return t === void 0 || n === null ? void 0 : (e, r) => t.rangeKeysOf(n, e, r);
	}
	handleDoubleClick(e) {
		let t = this.resolveRow(e, hd);
		t === null || e.target instanceof Element && t.item.contains(e.target.closest("[data-ui-no-row-open]")) || (e.preventDefault(), Mf(t.item, "open"));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.altKey || !(e.target instanceof Element) || Ou(e)) return;
		let t = dG(e.target);
		if (t !== null && !O(t)) {
			fG(e, t, (e) => this.enterRows(t, e)) && e.preventDefault();
			return;
		}
		let n = Xd(e);
		if (n === null) return;
		let { root: r } = n;
		if (!r.matches(".ui-items-view, .ui-table") || O(r) || cf(r) && bG(e) && this.handleCellKey(r, e)) return;
		let i = DG(r);
		if (!pG.has(e.key) && !Tf(e.key, i)) return;
		if (this.windowEnds.delete(r), this.reachWindowEnd(r, e)) {
			e.preventDefault();
			return;
		}
		this.bringRowsIn(r, e.key);
		let a = Rd(r), o = ef(a), s = Df(e.key, a, tf(a), i);
		if (s !== null) {
			e.preventDefault(), of(r, a, s, e.key === "ArrowUp" && !e.shiftKey && cf(r) ? xf(s) : null), SG(r, a, o, s, xd(r, e), this.heldRange(r));
			return;
		}
		if (e.key === "ArrowUp" && M(e, { alt: !0 }) && r.matches(mG) && sG(r, gf(r))) {
			e.preventDefault();
			return;
		}
		if (o === null || k(o)) return;
		let c = Iu(o);
		switch (e.key) {
			case " ":
				CG(r, a, o, c);
				break;
			case "Enter":
				TG(r, a, o, c);
				break;
			case "Delete":
				if (!wG(r, a, o)) return;
				break;
			default: return;
		}
		e.preventDefault();
	}
	handleCellKey(e, t) {
		this.bringCursorRowIn(e);
		let n = Rd(e), r = tf(n);
		if (r === null || k(r)) return !1;
		let i = hf(r), a = M(t, { alt: !0 });
		switch (t.key) {
			case "ArrowLeft":
			case "ArrowRight":
			case "Home":
			case "End": {
				if (!a) return !1;
				let o = _f(e, r, i, t.key);
				return o !== null && of(e, n, r, o), t.preventDefault(), !0;
			}
			case "ArrowDown":
			case "ArrowUp": {
				let o = a ? vf(e, r, i, t.key === "ArrowDown") : null;
				return o !== null && (t.preventDefault(), of(e, n, r, o), !0);
			}
			default: return i !== null && xG(i, t);
		}
	}
	reachWindowEnd(e, t) {
		let n = t.key === "Home" || t.key === "End" ? Nd(e) : null;
		if (n === null || W(n) !== "windowed" || n.hasAttribute("data-ui-window-paged")) return !1;
		let r = t.key === "Home";
		return !(r ? _O(n) === 0 && !yO(n, "data-ui-window-more-before") : !yO(n, "data-ui-window-more-after")) && (this.windowEnds.set(e, r ? "first" : "last"), Xu(n, r ? 0 : Yu(n).contentHeight), !0);
	}
	bringRowsIn(e, t) {
		let n = this.rows, r = n === void 0 ? null : Nd(e);
		if (n === void 0 || r === null) return;
		let i = Vf(e);
		switch (t) {
			case "Home":
			case "End": {
				let e = n.shownKeysOf(r);
				e !== null && e.length > 0 && n.reveal(r, t === "Home" ? e[0] : e[e.length - 1], "nearest");
				return;
			}
			case "PageDown":
			case "PageUp": {
				let a = i === null ? tf(Rd(e)) : null, o = i ?? (a === null ? null : L(a));
				o !== null && n.reveal(r, o, t === "PageDown" ? "start" : "end");
				return;
			}
			default: this.bringCursorRowIn(e);
		}
	}
	bringCursorRowIn(e) {
		let t = this.rows === void 0 ? null : Nd(e), n = Vf(e);
		t !== null && n !== null && this.rows?.reveal(t, n, "nearest");
	}
	enterRows(e, t) {
		let n = Rd(e), r = tf(n) ?? Df("ArrowDown", n, null, "vertical");
		e.focus({ preventScroll: !0 }), r !== null && (of(e, n, r, uf(r, t)), e.getAttribute("data-ui-selection") === "one" && Ed(e, n, r, gd));
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement && e.target.matches("[data-ui-items-host], .ui-table__scroll") ? e.target : null, n = t?.closest(F) ?? null;
		if (t !== null && n !== null && [...n.querySelectorAll(gG)].includes(t)) {
			R(n);
			return;
		}
		if (e.target instanceof HTMLElement && e.target.matches(F) && e.target.matches(".ui-items-view, .ui-table") && !O(e.target) && !sp()) {
			rf(e.target, Rd(e.target));
			return;
		}
		let r = e.target instanceof Element ? e.target.closest(md) : null, i = r?.closest(F) ?? null;
		r !== null && i !== null && !r.hasAttribute("data-ui-row-focus") && i.matches(".ui-items-view, .ui-table") && Bu(e.target, r) !== null && of(i, Rd(i), r, e.target instanceof Element ? Sf(r, e.target) : null, !1);
	}
	handlePointerDown(e) {
		this.restoreBoxes();
		let t = e.target instanceof Element ? e.target : null, n = t?.closest(F) ?? null;
		if (t !== null && n !== null) {
			document.activeElement !== n && lp(n, !0);
			for (let e of n.querySelectorAll(gG)) e.contains(t) && e.getAttribute("tabindex") === "-1" && (e.removeAttribute("tabindex"), this.pressedBoxes.push(e));
		}
	}
	restoreBoxes() {
		for (let e of this.pressedBoxes) yG(e);
		this.pressedBoxes = [];
	}
	followCursor(e) {
		for (let t of e) {
			let e = t.target;
			if (!(e instanceof HTMLElement) || !e.matches(md)) continue;
			let n = e.closest(F);
			n !== null && n.matches(".ui-items-view, .ui-table") && vG(n, e, e.hasAttribute(Ne));
		}
	}
};
function vG(e, t, n) {
	if (n) for (let n of t.querySelectorAll(`[${Fe}]`)) n.parentElement?.closest(F) === e && aH(n);
	else for (let n of t.querySelectorAll(Wf)) n.tabIndex >= 0 && n.parentElement?.closest(F) === e && zu(t, n) && iH(n);
}
function yG(e) {
	e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
}
function bG(e) {
	return hG.has(e.key) || pT(e) !== null;
}
function xG(e, t) {
	let n = t.key, r = pT(t) !== null, i = M(t, { shift: !0 });
	if (!r && (!i || n !== "Enter" && n !== "F2" && n !== " ")) return !1;
	if (n !== " " && wf(e, t)) return !0;
	let a = Iu(e);
	if (a !== null && (n === "Enter" || n === " ")) return t.preventDefault(), a.click(), !0;
	if (n !== "F2" && (n !== "Enter" || !bf(e))) return !1;
	let o = hp(e);
	return o !== null && (t.preventDefault(), o.focus(), !0);
}
function SG(e, t, n, r, i, a) {
	(e.getAttribute("data-ui-selection") === "one" || i.shift) && (i.shift && vd(e, n), Ed(e, t, r, i, a));
}
function CG(e, t, n, r) {
	Ed(e, t, n, {
		shift: !1,
		ctrl: !0
	}) || EG(n, r);
}
function wG(e, t, n) {
	if (!e.hasAttribute("data-ui-rows-remove")) return !1;
	let r = OG(t, n);
	for (let e of r) Mf(e, "remove");
	return r.length > 0;
}
function TG(e, t, n, r) {
	Sd(e) && !Td(t).includes(n) && Ed(e, t, n, gd), EG(n, r), r === null && Mf(n, "open");
}
function EG(e, t) {
	t === null ? Mf(e, jf) : t.click();
}
function DG(e) {
	return e.matches(".ui-items-view--wrap") ? "grid" : e.matches(".ui-orientation--horizontal") ? "both" : "vertical";
}
function OG(e, t) {
	let n = Td(e);
	return (n.includes(t) ? n.filter((e) => e === t || I(e) !== null) : [t]).filter((e) => !Xc(e, "data-ui-unremovable") && !k(e));
}
//#endregion
//#region src/interactions/tree-engine.ts
var kG = "ui-tree__row--folded", AG = "ui-tree__row--dragging", jG = "ui-tree__loading", MG = "ui-tree__loading-ring", NG = "ui-tree-node__text", PG = "ui-tree-node__toggle", FG = "ui-tree-node__rename", IG = ".ui-text__title", LG = dr, RG = "--ui-tree-depth", zG = "expanded", BG = 200, VG = 600, HG = .25, UG = {
	ArrowUp: "up",
	ArrowDown: "down",
	ArrowLeft: "out",
	ArrowRight: "in"
}, WG = /* @__PURE__ */ new Set([
	" ",
	"ArrowRight",
	"ArrowLeft",
	"Enter",
	"F2",
	"Delete"
]), GG = "ui-tree-unfold-settled", KG = {
	name: "unfold",
	registration: { completed: (e) => {
		e.domEvent.target?.dispatchEvent(new Event(GG, { bubbles: !0 }));
	} }
}, qG = class {
	root;
	store = new wP();
	rules;
	folds = /* @__PURE__ */ new WeakMap();
	requested = /* @__PURE__ */ new WeakSet();
	inFlight = /* @__PURE__ */ new WeakSet();
	writtenBoot = /* @__PURE__ */ new WeakMap();
	springTarget = null;
	springTimer = 0;
	dropPlace = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.rules = e.rules, this.root.addEventListener(HW, (e) => {
			let t = e.target instanceof Element ? e.target.closest(`.${cr}`) : null;
			t !== null && (this.layout(t), If(t, this.rowsOf(t)));
		}, !0), this.root.addEventListener(GG, (e) => this.handleUnfoldSettled(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), e.effects?.register("RenameNode", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename node effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(w(n.id), n.dynamicParameters ?? []), i = r === null ? null : this.rowsOf(r).find((e) => L(e) === t.key) ?? null;
			i === null ? s("rename node effect names no node on the page.", t) : this.startRename(i);
		}), this.layoutAll(this.root.querySelectorAll(`.${cr}`)), B(this.root, `.${cr}`, {
			childList: !0,
			attributeFilter: [
				br,
				xr,
				Cr,
				Or
			],
			relevant: QG
		}, (e) => this.layoutAll(e));
	}
	layoutAll(e) {
		for (let t of e) this.layout(t);
	}
	layout(e) {
		let t = this.foldOf(e), n = this.resolveRules(e), r = n === null ? this.rowsOf(e) : this.orderRows(e, n), i = e.hasAttribute("data-ui-tree-draggable") || e.hasAttribute("data-ui-drag-kind"), a = /* @__PURE__ */ new Set();
		for (let e of r) {
			let t = dA(e)?.getAttribute(br);
			t != null && t.length > 0 && a.add(t);
		}
		let o = n?.filtering === !0 ? this.matchingRows(r, n) : null, s = /* @__PURE__ */ new Map();
		for (let e of r) {
			let n = L(e), r = dA(e), c = r?.getAttribute("data-ui-tree-parent") ?? "", l = c.length > 0 ? s.get(c) : void 0, u = l === void 0 ? 0 : l.depth + 1, d = l === void 0 || l.shown && l.expanded, f = r?.hasAttribute(xr) === !0, p = f || a.has(n), m = p && r?.hasAttribute("data-ui-tree-expanded") === !0, h = l === void 0 || l.authoredShown && this.authoredExpandedOf(l), g = p && (o === null ? t.get(n) ?? m : o.has(n)), _ = o !== null && !o.has(n);
			e.style.setProperty(RG, String(u)), e.setAttribute("aria-level", String(u + 1)), af(e, r?.querySelector(`:scope > .${NG}`) ?? null), e.classList.toggle(kG, !d), e.classList.toggle(fr, _), e.removeAttribute(Dr), e.draggable = i && TO(e), p ? e.setAttribute("aria-expanded", g ? "true" : "false") : e.removeAttribute("aria-expanded"), (a.has(n) || !f) && (e.removeAttribute(Tr), this.inFlight.delete(e)), g && d && f && !a.has(n) && !this.requested.has(e) && (this.requested.add(e), this.inFlight.add(e), e.setAttribute(Tr, ""), e.dispatchEvent(new Event("unfold", { bubbles: !0 }))), !g && !this.inFlight.has(e) && this.requested.delete(e), this.placeLoadingRow(e, u + 1, e.hasAttribute(Tr), d && g && !_), s.set(n, {
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
		return dA(e.row)?.hasAttribute(Cr) === !0;
	}
	writeBootFold(e, t, n) {
		if (t.size === 0) return;
		let r = [], i = [];
		for (let [e, a] of t) {
			let t = n.get(e);
			(t === void 0 || this.authoredExpandedOf(t) !== a) && (a ? r : i).push(e);
		}
		let a = JSON.stringify([r, i]), o = this.writtenBoot.get(e);
		if (o !== a && (this.writtenBoot.set(e, a), this.store.writeBoot(e, QW, r.length + i.length === 0 ? null : { fold: {
			version: 1,
			open: r,
			closed: i
		} }), o === void 0)) for (let t of $W) this.store.writeBoot(e, t, null);
	}
	resolveRules(e) {
		let t = this.hostOf(e), n = Va(e);
		if (this.rules === void 0 || t === null || n === null) return null;
		let r = this.rules.metadata.getItemsFilterSortMetadata(n), i = tk(t);
		if (r === void 0 && i === null) return null;
		let a = sk(r, this.rules.state, i), o = ok(r, this.rules.state, i);
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
			let t = dA(e)?.getAttribute("data-ui-tree-parent") ?? "", n = i.has(t) ? t : "", r = a.get(n);
			r === void 0 ? a.set(n, [e]) : r.push(e);
		}
		let o = [], s = (e) => {
			let n = a.get(e);
			if (n !== void 0) {
				n.sort((e, n) => lk(r.getItemValue(e), r.getItemValue(n), t.sorts));
				for (let e of n) o.push(e), s(L(e));
			}
		};
		if (s(""), o.length !== n.length || o.every((e, t) => e === n[t])) return o.length === n.length ? o : n;
		let c = this.hostOf(e);
		if (c === null) return n;
		for (let e of c.querySelectorAll(`:scope > .${jG}`)) e.remove();
		for (let e of o) c.appendChild(e);
		return o;
	}
	matchingRows(e, t) {
		let n = /* @__PURE__ */ new Set();
		if (this.rules === void 0) return n;
		let r = this.rules.state, i = this.rules.renderer;
		for (let a = e.length - 1; a >= 0; a--) {
			let o = e[a], s = L(o), c = i.getItemValue(o);
			if (c === void 0 || ak(t.config, c, r, t.query) || n.has(s)) {
				n.add(s);
				let e = dA(o)?.getAttribute("data-ui-tree-parent") ?? "";
				e.length > 0 && n.add(e);
			}
		}
		return n;
	}
	placeLoadingRow(e, t, n, r) {
		let i = e.nextElementSibling, a = i instanceof HTMLElement && i.classList.contains(jG) ? i : null;
		if (!n) {
			a?.remove();
			return;
		}
		let o = a ?? $G();
		o.style.setProperty(RG, String(t)), o.classList.toggle(kG, !r), a === null && e.after(o);
	}
	handleUnfoldSettled(e) {
		e.target instanceof Element && this.inFlight.delete(e.target);
	}
	handleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null) return;
		let { tree: n, row: r, target: i } = t;
		(i.closest(`.${PG}`) !== null || Xc(r, "data-ui-unselectable") && Bu(i, r) === null) && (e.preventDefault(), this.setFocus(n, r, null), this.toggle(n, r));
	}
	handleDoubleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null || Bu(t.target, t.row) !== null) return;
		let { tree: n, row: r } = t;
		e.preventDefault(), n.hasAttribute("data-ui-tree-rename-dblclick") && this.canRename(n, r) ? this.startRename(r) : Mf(r, "open");
	}
	rowOfEvent(e) {
		if (!(e.target instanceof Element)) return null;
		let t = e.target.closest(`.${lr}`), n = t?.closest(".ui-tree") ?? null;
		return t === null || n === null || t.closest(".ui-tree") !== n || k(t) ? null : {
			tree: n,
			row: t,
			target: e.target
		};
	}
	handleFocusIn(e) {
		let t = e.target;
		t instanceof HTMLElement && t.classList.contains("ui-tree") && !O(t) && !sp() && rf(t, this.rowsOf(t));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || j(e) || !(e.target instanceof Element)) return;
		let t = Xd(e);
		if (t === null) return;
		let n = t.root;
		if (!n.classList.contains("ui-tree") || O(n)) return;
		let r = e.altKey && M(e, { alt: !0 }) ? UG[e.key] : void 0;
		if (r !== void 0 && n.hasAttribute("data-ui-tree-draggable")) {
			e.preventDefault(), this.moveByKey(n, r);
			return;
		}
		if (e.altKey || !WG.has(e.key) && !Tf(e.key, "vertical")) return;
		let i = this.rowsOf(n), a = ef(i), o = Df(e.key, i, tf(i), "vertical");
		if (o !== null) e.preventDefault(), this.setFocus(n, o, xd(n, e));
		else if (!(a === null || k(a))) {
			switch (e.key) {
				case " ":
					CG(n, i, a, null);
					break;
				case "ArrowRight":
					a.getAttribute("aria-expanded") === "false" ? this.toggle(n, a) : a.getAttribute("aria-expanded") === "true" && this.setFocus(n, Df("ArrowDown", i, a, "vertical"), gd);
					break;
				case "ArrowLeft":
					a.getAttribute("aria-expanded") === "true" ? this.toggle(n, a) : this.setFocus(n, this.parentOf(n, a), gd);
					break;
				case "Enter":
					TG(n, i, a, null);
					break;
				case "F2":
					if (!this.canRename(n, a)) return;
					this.startRename(a);
					break;
				case "Delete":
					if (n.hasAttribute("data-ui-tree-unremovable") || !wG(n, i, a)) return;
					break;
				default: return;
			}
			e.preventDefault();
		}
	}
	moveByKey(e, t) {
		let n = this.rowsOf(e), r = ef(n);
		if (r === null || !r.draggable || (t === "up" || t === "down") && this.isSorted(e)) return;
		let i = tK(n), a = L(r), o = _A(i, a, t);
		if (o === null) return;
		let [s] = this.moveRows(e, [r], o, t === "in" ? n.find((e) => L(e) === o.parent) ?? null : null), c = i.filter((e) => e.parent === o.parent && e.key !== a).length + 1;
		Ak(s + 1, c);
	}
	isSorted(e) {
		return (this.resolveRules(e)?.sorts.length ?? 0) > 0;
	}
	canRename(e, t) {
		return e.hasAttribute("data-ui-tree-renamable") && !Xc(t, "data-ui-unrenamable");
	}
	handleDragStart(e) {
		let t = eK(e), n = t?.closest(".ui-tree") ?? null, r = n?.hasAttribute(Or) === !0, i = n === null ? null : this.hostOf(n);
		if (t === null || n === null || i === null || !r && !n.hasAttribute("data-ui-drag-kind")) return;
		if (k(t)) {
			e.preventDefault();
			return;
		}
		let a = wO(t, this.rowsOf(n)), o = CO(n, i, a);
		r ? hv(e, n, t, AG, L(t), a.filter((e) => e !== t), DO(o, !0)) : _v(e, L(t), DO(o, !1)), OO(e, o);
	}
	draggingRows(e) {
		return this.rowsOf(e).filter((e) => e.classList.contains(AG));
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
		let i = this.parentKeysOf(e), a = L(t), o = (e) => n.some((t) => L(t) === e || ZG(i, e, L(t))), s = fA(t, dA(t)), c = t.getBoundingClientRect(), l = c.height > 0 ? (r - c.top) / c.height : .5, u = s ? HG : .5, d = this.isSorted(e) ? null : l < u ? "before" : l >= 1 - u ? "after" : null;
		if (d === null) return s && !o(a) ? {
			mark: "",
			place: {
				parent: a,
				before: null
			}
		} : null;
		if (n.includes(t)) return null;
		let f = this.rowsOf(e), p = tK(f), m = Number(t.style.getPropertyValue(RG)) || 0, h = new Set(n.map(L)), g = d === "after" && t.getAttribute("aria-expanded") === "true" ? p.find((e) => e.parent === a && e.shown !== !1 && !h.has(e.key)) : void 0, _ = i.get(a) ?? "", v = g === void 0 ? {
			parent: _,
			before: d === "before" ? a : xA(p, _, a, !1, h)
		} : {
			parent: a,
			before: g.key
		};
		return !pA(v.parent, (e) => f.find((t) => L(t) === e) ?? null) || o(v.parent) ? null : {
			mark: d,
			place: v,
			depth: g === void 0 ? m : m + 1
		};
	}
	springOpen(e, t) {
		let n = t !== null && t.getAttribute("aria-expanded") === "false" ? t : null;
		n !== this.springTarget && (window.clearTimeout(this.springTimer), this.springTarget = n, n !== null && (this.springTimer = window.setTimeout(() => this.expand(e, n), VG)));
	}
	handleDragLeave(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${cr}`);
		t !== null && vv(e, t) && (this.markDrop(t, null), this.springOpen(t, null));
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${cr}`), n = t === null ? [] : this.draggingRows(t), r = t?.querySelector(`[${LG}]`) ?? null, i = this.dropPlace;
		if (t === null || n.length === 0 || r === null || i === null) return;
		e.preventDefault();
		let a = this.parentKeysOf(t), o = n.filter((e) => !n.some((t) => t !== e && ZG(a, L(e), L(t)))), s = r.getAttribute(LG) === "" && r.classList.contains("ui-tree__row") ? r : null;
		this.markDrop(t, null), this.springOpen(t, null), gv(t, AG), this.moveRows(t, o, i, s);
	}
	moveRows(e, t, n, r) {
		let i = SA(tK(this.rowsOf(e)), t.map(L), n);
		return r !== null && this.expand(e, r), t.forEach((e, t) => {
			let r = dA(e)?.querySelector(`.${NG}`) ?? null;
			r !== null && (r.setAttribute(Er, n.parent), r.dispatchEvent(new Event("change", { bubbles: !0 })), Hk(e, i[t]));
		}), i;
	}
	handleDragEnd(e) {
		let t = eK(e)?.closest(".ui-tree") ?? null;
		t !== null && (gv(t, AG), this.markDrop(t, null), this.springOpen(t, null));
	}
	markDrop(e, t, n = "", r) {
		hA(e, t, n, r), t === null && (this.dropPlace = null);
	}
	parentKeysOf(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of this.rowsOf(e)) t.set(L(n), dA(n)?.getAttribute("data-ui-tree-parent") ?? "");
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
		i.delete(r), i.set(r, n), JG(i, a);
		let o = n ? a.filter((e) => e.classList.contains(kG)) : [];
		this.store.writeJson(e, zG, [...i]), this.layout(e), XG(o.filter((e) => !e.classList.contains(kG)));
	}
	foldOf(e) {
		let t = this.folds.get(e);
		return t === void 0 && (t = YG(this.store.readJson(e, zG)), this.folds.set(e, t)), t;
	}
	setFocus(e, t, n) {
		if (t === null) return;
		let r = this.rowsOf(e), i = ef(r);
		of(e, r, t), n !== null && SG(e, r, i, t, n);
	}
	parentOf(e, t) {
		let n = dA(t)?.getAttribute("data-ui-tree-parent") ?? "";
		return n.length === 0 ? null : this.rowsOf(e).find((e) => L(e) === n) ?? null;
	}
	startRename(e) {
		let t = e.closest(`.${cr}`), n = dA(e), r = n?.querySelector(IG) ?? null;
		t === null || n === null || r === null || Xc(e, "data-ui-unrenamable") || (this.setFocus(t, e, null), lu({
			container: n,
			title: r,
			className: FG,
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
function JG(e, t) {
	if (e.size <= BG) return;
	let n = new Set(t.map(L)), r = 0;
	for (let t of e.keys()) n.has(t) || r++;
	for (let t of [...e.keys()]) {
		if (r <= BG) return;
		n.has(t) || (e.delete(t), r--);
	}
}
function YG(e) {
	let t = Array.isArray(e) ? e : typeof e == "object" && e ? Object.entries(e) : [], n = /* @__PURE__ */ new Map();
	for (let e of t) Array.isArray(e) && typeof e[0] == "string" && typeof e[1] == "boolean" && n.set(e[0], e[1]);
	return n;
}
function XG(e) {
	if (!(e.length === 0 || Lm())) for (let t of e) t.animate([{
		opacity: 0,
		offset: 0
	}], {
		duration: z.fast,
		easing: z.enter
	});
}
function ZG(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let i = e.get(t) ?? ""; i.length > 0 && !r.has(i); i = e.get(i) ?? "") {
		if (i === n) return !0;
		r.add(i);
	}
	return !1;
}
function QG(e) {
	if (e.type !== "childList") return !0;
	let t = e.target;
	return t instanceof HTMLElement && (t.classList.contains("ui-tree__row") || t.hasAttribute("data-ui-items-host") && t.parentElement?.classList.contains("ui-tree") === !0);
}
function $G() {
	let e = document.createElement("div"), t = document.createElement("span");
	return e.className = jG, e.setAttribute(jO, ""), e.setAttribute("aria-hidden", "true"), t.className = MG, e.append(t, D.text("ui.tree.loading")), e;
}
function eK(e) {
	return e.target instanceof Element ? e.target.closest(`.${lr}`) : null;
}
function tK(e) {
	return e.map((e) => ({
		key: L(e),
		parent: dA(e)?.getAttribute("data-ui-tree-parent") ?? "",
		takesDrop: fA(e, dA(e)),
		shown: !e.classList.contains(fr)
	}));
}
//#endregion
//#region src/runtime/client-state.ts
var nK = {
	visibilityState: () => document.visibilityState,
	notificationPermission: iK
};
function rK(e) {
	return e !== "hidden";
}
function iK() {
	return typeof Notification > "u" || !window.isSecureContext ? void 0 : Notification.permission;
}
var aK = 200;
function oK(e = nK) {
	return {
		visible: rK(e.visibilityState()),
		notificationPermission: e.notificationPermission() ?? "unsupported"
	};
}
var sK = class {
	report;
	source;
	settleMilliseconds;
	held = null;
	timer;
	constructor(e) {
		this.report = e.report, this.source = e.source ?? nK, this.settleMilliseconds = e.settleMilliseconds ?? aK;
	}
	forAttach() {
		return clearTimeout(this.timer), this.held = oK(this.source), this.held;
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
		let t = oK(this.source);
		(t.visible !== e.visible || t.notificationPermission !== e.notificationPermission) && (this.held = t, this.report(t).catch(() => void 0));
	}
};
//#endregion
//#region src/interactions/system-notifications.ts
function cK(e) {
	return {
		permission: iK,
		registration: e ?? (() => Promise.resolve(void 0)),
		create: (e, t) => new Notification(e, t),
		focus: () => window.focus()
	};
}
async function lK(e, t, n = cK()) {
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
function uK(e, t, n, r = window.location) {
	e.bringTo !== void 0 && dK(e.bringTo, r) ? t(e.bringTo) : e.action !== void 0 && n(e.action);
}
function dK(e, t = window.location) {
	let n = new URL(e, t.origin);
	return n.pathname !== t.pathname || n.search !== t.search || n.hash !== "" && n.hash !== t.hash;
}
//#endregion
//#region src/interactions/tab-order.ts
function fK(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) e[n].pinned && (t = n + 1);
	return t;
}
//#endregion
//#region src/interactions/tabs-view-engine.ts
var J = "ui-tabs-view", pK = "ui-tab-item__label", mK = "ui-tab-item__close", hK = "ui-tab-item__rename", gK = "ui-tab-item__caption", _K = "ui-tab-item__pin", vK = ".ui-text__title", yK = "ui-tab-item--dragging", bK = "ui-tab-item__caption--overflowed", xK = "ui-tabs-view--overflowing", SK = "ui-tabs-view--no-overflow", CK = "ui-tab-item__page", wK = "ui-tab-item--selected", TK = `.${Fn}`, EK = "tab-menu-entry", DK = {
	name: EK,
	registration: { dynamicParameters: (e) => gF(e.domEvent.detail?.entry, e.dynamicParameters) }
}, OK = "tab-pin";
function kK(e) {
	return {
		name: OK,
		registration: gO((e) => Pk(e.target), e)
	};
}
var AK = "--ui-tabs-view-strip", jK = class {
	root;
	fitter;
	dragStart = null;
	menuTab = null;
	closed = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new LV({
			rootClass: J,
			overflowingClass: xK,
			wraps: (e) => e.classList.contains(SK),
			hiddenClass: bK,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(), e.effects?.register("RenameTab", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename tab effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(w(n.id), n.dynamicParameters ?? []), i = (r === null ? void 0 : this.ownItems(r).find((e) => HK(e) === t.key))?.querySelector(`.${pK}`) ?? null;
			i === null ? s("rename tab effect names no tab on the page.", t) : this.startRename(i);
		}), this.root.addEventListener(xF, (e) => this.prepareMenu(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), NU(this.root, ["press"], (e) => {
			let t = e.closest(`.${mK}`)?.closest(`.${gK}`) ?? null;
			return t === null ? [] : [t];
		}), B(this.root, `.${J}`, {
			childList: !0,
			attributeFilter: [
				di,
				be,
				ce,
				..._i
			],
			relevant: (e) => !ig(e, `.${CK}`, `.${J}`)
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${J}`)) this.apply(e);
	}
	apply(e) {
		let t = this.ownItems(e);
		NK(e, t);
		let n = t.filter(YF), r = e.getAttribute("data-ui-tabs-selected") ?? "", i = fd(n, r, HK);
		if (i === null) return;
		if (i !== r) {
			this.select(e, i);
			return;
		}
		let a = e.hasAttribute(be), o = t.find((e) => e.classList.contains(wK))?.querySelector(`.${gK}`) ?? null, s = [], c = null, l = null;
		for (let e of t) {
			let t = HK(e) === r;
			e.classList.toggle(wK, t);
			let i = e.querySelector(`.${gK}`);
			i !== null && (i.draggable = a, GV(i), n.includes(e) && (s.push(i), t && (c = i))), e.querySelector(`.${pK}`)?.setAttribute("aria-selected", t ? "true" : "false");
			for (let n of e.querySelectorAll(`.${CK}`)) n.hidden = !t;
			t && (l = e.querySelector(`.${CK}`));
		}
		this.fitCaptions(e, s, c), this.writeStripHeight(e, l), KV(o, c), o !== null && o !== c && qV(l);
		let u = [], d = null;
		for (let e of s) {
			let t = e.querySelector(`.${pK}`);
			t === null || e.classList.contains(bK) || (u.push(t), e === c && (d = t));
		}
		N(u, d), this.focusAfterClose(e, d);
	}
	focusAfterClose(e, t) {
		let n = this.closed;
		n === null || n.root !== e || n.item.isConnected || (this.closed = null, t !== null && (document.activeElement === null || document.activeElement === document.body) && R(t));
	}
	writeStripHeight(e, t) {
		let n = this.hostOf(e);
		if (n === null || t === null || !YF(t)) return;
		let r = Math.max(0, Math.round(t.getBoundingClientRect().top - n.getBoundingClientRect().top));
		n.style.setProperty(AK, `${r}px`);
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${x}]`);
	}
	fitCaptions(e, t, n) {
		let r = this.hostOf(e), i = e.querySelector(`:scope > .${MV}`);
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownItems(e).find((e) => HK(e) === t)?.querySelector(`.${pK}`)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownItems(e).filter(YF).map((e) => ({
				key: HK(e),
				title: e.querySelector(`.${pK}`)?.textContent?.trim() ?? HK(e),
				current: HK(e) === t,
				disabled: O(e.querySelector(`.${pK}`) ?? e)
			}));
		});
	}
	prepareMenu(e) {
		let t = e.target;
		if (!(e instanceof CustomEvent) || !(t instanceof HTMLElement) || t.getAttribute("data-ui-context-menu") !== "tab") return;
		let n = t.parentElement, r = e.detail.target.closest(`.${Mk}`);
		if (n === null || !n.classList.contains(J) || r === null || r.closest(`.${J}`) !== n) {
			e.preventDefault();
			return;
		}
		let i = IK(n, r), a = RK(t), o = a.map((e) => {
			if (LK(e)) return "rule";
			let t = i.get(e.getAttribute("data-ui-key") ?? "");
			return t !== void 0 && (e.style.display = t ? "" : "none"), t ?? YF(e) ? "shown" : "hidden";
		});
		hF(o).forEach((e, t) => {
			o[t] === "rule" && (a[t].style.display = e ? "" : "none");
		}), o.includes("shown") ? this.menuTab = {
			root: n,
			key: HK(r)
		} : e.preventDefault();
	}
	handleMenuEntry(e) {
		let t = e.closest(`[${Se}="tab"]`), n = t?.parentElement ?? null, r = e.closest(TK);
		if (t === null || n === null || !n.classList.contains(J) || r === null || !t.contains(r)) return !1;
		let i = r.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "", a = this.menuTab, o = a === null || a.root !== n ? void 0 : this.ownItems(n).find((e) => HK(e) === a.key);
		if (i.length === 0 || r.matches("[data-ui-menu-group] > .ui-menu-item, [data-ui-menu-item-kind=\"header\"], [data-ui-menu-item-kind=\"separator\"]") || o === void 0) return !0;
		if (!i.startsWith("tabs:")) return o.dispatchEvent(new CustomEvent(EK, {
			bubbles: !0,
			detail: { entry: i }
		})), !0;
		if (IK(n, o).get(i) !== !0) return !0;
		switch (i) {
			case cF: {
				let e = o.querySelector(`.${pK}`);
				e !== null && this.startRename(e);
				break;
			}
			case lF:
			case uF:
				this.setPinned(n, o, i === lF);
				break;
			default: o.dispatchEvent(new Event("remove", { bubbles: !0 }));
		}
		return !0;
	}
	setPinned(e, t, n) {
		if (t.hasAttribute("data-ui-tab-pinned") === n) return;
		let r = t.querySelector(`:scope > .${gK} > .${_K}`);
		t.toggleAttribute(gi, n), r !== null && (r.toggleAttribute(gi, n), r.dispatchEvent(new Event("change", { bubbles: !0 })));
		let i = this.ownItems(e), a = i.filter((e) => e !== t), o = fK(a.map(VK));
		if (i.indexOf(t) === o) return;
		let s = a[o];
		s === void 0 ? Nk(a[a.length - 1]).after(Nk(t)) : Nk(s).before(Nk(t)), t.dispatchEvent(new Event(OK, { bubbles: !0 }));
	}
	handleClick(e) {
		if (!(e.target instanceof Element) || this.handleMenuEntry(e.target) || this.handleClose(e, e.target)) return;
		let t = e.target.closest(`.${MV}`), n = t?.parentElement ?? null;
		if (t !== null && n !== null && n.classList.contains(J)) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = zK(e.target), i = r?.closest(`.${J}`) ?? null;
		if (r === null || i === null || O(r)) return;
		let a = r.closest(`.${Mk}`);
		a !== null && a.closest(`.${J}`) === i && (e.preventDefault(), this.select(i, HK(a)), document.activeElement !== r && R(r));
	}
	handleClose(e, t) {
		let n = t.closest(`.${mK}`), r = n?.closest(".ui-tab-item") ?? null, i = r?.closest(`.${J}`) ?? null;
		return n === null || r === null || i === null ? !1 : (e.preventDefault(), e.stopPropagation(), PK(i, r) && r.dispatchEvent(new Event("remove", { bubbles: !0 })), !0);
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = zK(e.target), n = t?.closest(`.${J}`) ?? null;
		t !== null && n !== null && n.hasAttribute("data-ui-tabs-renamable") && (e.preventDefault(), this.startRename(t));
	}
	startRename(e) {
		let t = e.parentElement, n = e.querySelector(vK) ?? e, r = e.closest(`.${Mk}`);
		t === null || r === null || Fk(r, "data-ui-unrenamable") || lu({
			container: t,
			title: n,
			className: hK,
			value: e.getAttribute("data-ui-tab-caption") ?? n.textContent?.trim() ?? "",
			commit: (t) => {
				e.setAttribute(fi, t), e.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			refocus: () => R(e)
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || Ou(e)) return;
		let t = e.target.closest(`.${pK}`), n = t?.closest(`.${J}`) ?? null;
		if (t === null || n === null) return;
		if (e.key === "F2" && M(e)) {
			if (!n.hasAttribute("data-ui-tabs-renamable")) return;
			e.preventDefault(), this.startRename(t);
			return;
		}
		let r = t.closest(`.${Mk}`);
		if (r === null || r.closest(`.${J}`) !== n) return;
		if (e.key === "Delete" && M(e)) {
			if (!FK(n, r)) return;
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
		let i = this.ownItems(n).map((e) => e.querySelector(`.${pK}`)).filter((e) => e !== null), a = Vu({
			key: e.key,
			items: i,
			current: t,
			axis: "horizontal"
		});
		if (a === null) return;
		e.preventDefault();
		let o = a.closest(`.${Mk}`);
		o !== null && this.select(n, HK(o)), a.focus();
	}
	moveByKey(e, t, n) {
		if (!e.hasAttribute("data-ui-tabs-draggable") || Fk(t, "data-ui-undraggable") || O(t) || t.hasAttribute("data-ui-tab-pinned")) return;
		n.preventDefault();
		let r = this.ownItems(e), i = r[r.indexOf(t) + (n.key === "ArrowLeft" ? -1 : 1)];
		i === void 0 || i.hasAttribute("data-ui-tab-pinned") || (n.key === "ArrowLeft" ? Nk(t).after(Nk(i)) : Nk(t).before(Nk(i)), Hk(t, this.ownItems(e).indexOf(t)));
	}
	handleDragStart(e) {
		let t = BK(e);
		if (t === null) return;
		if (Fk(t, "data-ui-undraggable") || O(t) || t.hasAttribute("data-ui-tab-pinned")) {
			e.preventDefault();
			return;
		}
		hv(e, t.closest(`.${J}`) ?? t, t, yK, HK(t));
		let n = Nk(t);
		this.dragStart = n.parentNode === null ? null : {
			parent: n.parentNode,
			next: n.nextSibling
		};
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${gK}`)?.closest(".ui-tab-item") ?? null, n = t?.closest(`.${J}`) ?? null;
		if (t === null || n === null) return;
		let r = n.querySelector(`.${yK}`);
		if (r === null || (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), r === t)) return;
		let i = t.querySelector(`.${gK}`)?.getBoundingClientRect();
		if (i === void 0) return;
		let a = Nk(r), o = t.hasAttribute("data-ui-tab-pinned") ? MK(n, a) : null, s = o ?? Nk(t), c = o === null && e.clientX < i.left + i.width / 2 ? s : s.nextElementSibling;
		c !== a && s.parentElement?.insertBefore(a, c);
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${J}`);
		t !== null && t.querySelector(`.${yK}`) !== null && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"));
	}
	handleDragEnd(e) {
		let t = BK(e);
		if (t === null) return;
		t.classList.remove(yK);
		let n = this.dragStart;
		if (this.dragStart = null, e instanceof DragEvent && e.dataTransfer?.dropEffect === "none" && n !== null) {
			n.parent.insertBefore(Nk(t), n.next);
			return;
		}
		let r = Nk(t);
		if (n !== null && r.parentNode === n.parent && r.nextSibling === n.next) return;
		let i = t.closest(`.${J}`);
		i !== null && Hk(t, this.ownItems(i).indexOf(t));
	}
	select(e, t) {
		dd(e, t, {
			attribute: di,
			bindingAttribute: ui,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return ld(e, `.${Mk}`, `.${J}`);
	}
};
function MK(e, t) {
	let n = null;
	for (let r of ld(e, `.${Mk}`, `.${J}`)) {
		let e = Nk(r);
		e !== t && r.hasAttribute("data-ui-tab-pinned") && (n = e);
	}
	return n;
}
function NK(e, t) {
	let n = !t.some((e) => !Fk(e, ce));
	e.hasAttribute("data-ui-tabs-none-removable") !== n && e.toggleAttribute(ye, n);
}
function PK(e, t) {
	return !e.hasAttribute("data-ui-tabs-unremovable") && !Fk(t, "data-ui-unremovable");
}
function FK(e, t) {
	return e.hasAttribute("data-ui-tabs-removes") && PK(e, t) && !t.hasAttribute("data-ui-tab-pinned") && !O(t);
}
function IK(e, t) {
	return mF(pF(e.getAttribute(xe)), {
		pinned: t.hasAttribute(gi),
		renamable: !Fk(t, le),
		removable: e.hasAttribute("data-ui-tabs-removes") && PK(e, t)
	});
}
function LK(e) {
	let t = e.getAttribute(b);
	return t === "tabs:separator" || t === "tabs:separator-remove" || e.querySelector(":scope > [data-ui-menu-item-kind=\"separator\"]") !== null;
}
function RK(e) {
	let t = e.querySelector(`[${x}]`);
	return t === null ? [] : Array.from(t.children).filter((e) => e instanceof HTMLElement && e.hasAttribute("data-ui-key"));
}
function zK(e) {
	return e.closest(`.${mK}`) !== null || cu(e) ? null : e.closest(`.${gK}`)?.querySelector(`:scope > .${pK}`) ?? null;
}
function BK(e) {
	return e.target instanceof Element ? e.target.closest(`.${gK}`)?.closest(".ui-tab-item") ?? null : null;
}
function VK(e) {
	return { pinned: e.hasAttribute(gi) };
}
function HK(e) {
	return e.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "";
}
//#endregion
//#region src/interactions/text-fold-engine.ts
var UK = "button.ui-text__fold-toggle", WK = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(UK);
		t !== null && (e.preventDefault(), t.setAttribute("aria-expanded", t.getAttribute("aria-expanded") === "true" ? "false" : "true"));
	}
}, GK = "ui-temporal-input__segments", KK = "ui-temporal-input__segment", qK = "ui-temporal-input__segment-literal", JK = "ui-temporal-input__segment--empty", YK = "data-ui-temporal-segment", XK = "data-ui-temporal-step-direction", ZK = "data-ui-temporal-segments-of", QK = "--", $K = /* @__PURE__ */ new Map([
	["ArrowUp", 1],
	["ArrowDown", -1],
	["PageUp", 10],
	["PageDown", -10]
]), eq = class {
	options;
	root;
	edits = /* @__PURE__ */ new WeakMap();
	wheelTurn = 0;
	onWheel = (e) => this.handleWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${K}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(za(e.components, `.${K}`));
		}), B(this.root, `.${K}`, { attributeFilter: [...mj] }, (e) => this.applyAll(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("mousedown", (e) => this.handleStepperPress(e), !0);
	}
	applyAll(e) {
		for (let t of e) gj(t) === "time" && this.applySegments(t);
	}
	applySegments(e) {
		for (let t of e.querySelectorAll(`.${GK}`)) this.applyContainer(e, t);
	}
	applyContainer(e, t) {
		let n = _j(e), r = Sj(e), i = q(e, kj(t));
		t.getAttribute(ZK) !== n && (t.replaceChildren(...tq(n).map((e) => rq(e))), t.setAttribute(ZK, n));
		for (let n of t.children) {
			if (!(n instanceof HTMLElement)) continue;
			let t = n.getAttribute(YK);
			t === null ? n.textContent = aq(n.dataset.token ?? "", n.dataset.formatted !== void 0, i, r) : (n.textContent = oq(t, Number(n.dataset.width ?? "2"), i, r), n.classList.toggle(JK, i === null), n.tabIndex = 0, sq(n, t, i, A(e)));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !M(e, { shift: !0 })) return;
		let t = lq(e.target);
		if (t === null) return;
		let n = t.closest(`.${K}`), r = t.getAttribute(YK), i = cq(t), a = $K.get(e.key);
		if (a !== void 0) e.preventDefault(), this.resetBuffer(n), this.applyStep(n, r, a, i);
		else if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") e.preventDefault(), this.resetBuffer(n), dq(n, t, e.key);
		else if (e.key === "Backspace" || e.key === "Delete") e.preventDefault(), this.resetBuffer(n), Rj(n, null, i), this.applySegments(n);
		else if (r === "meridiem") {
			let t = fq(e.key, Sj(n));
			t !== null && (e.preventDefault(), this.applyMeridiem(n, t, i));
		} else e.key.length === 1 && e.key >= "0" && e.key <= "9" && (e.preventDefault(), this.applyDigit(n, t, r, e.key, i));
	}
	handleFocusIn(e) {
		let t = lq(e.target);
		t !== null && (this.wheelTurn = 0, t.addEventListener("wheel", this.onWheel, { passive: !1 }));
	}
	handleWheel(e) {
		let t = lq(e.currentTarget);
		if (t === null || t !== document.activeElement || e.deltaY === 0) return;
		e.preventDefault();
		let { steps: n, carried: r } = nb(this.wheelTurn, tb(e).y);
		if (this.wheelTurn = r, n === 0) return;
		let i = t.closest(`.${K}`);
		this.resetBuffer(i);
		for (let e = 0; e < Math.abs(n); e++) this.applyStep(i, t.getAttribute(YK), n < 0 ? 1 : -1, cq(t));
	}
	handleStepperPress(e) {
		e.target instanceof Element && e.target.closest(`[${XK}]`) !== null && e.preventDefault();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${XK}]`);
		if (t === null) return;
		let n = t.closest(`.${K}`);
		if (n === null || A(n)) return;
		e.preventDefault();
		let r = uq(n) ?? n.querySelector(`.${KK}`);
		r !== null && (r.focus(), this.resetBuffer(n), this.applyStep(n, r.getAttribute(YK), t.getAttribute(XK) === "up" ? 1 : -1, cq(r)));
	}
	handleFocusOut(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${KK}`) : null;
		if (t === null) return;
		t.removeEventListener("wheel", this.onWheel);
		let n = t.closest(`.${K}`);
		n !== null && this.resetBuffer(n);
	}
	applyStep(e, t, n, r) {
		if (t === "meridiem") {
			let t = q(e, r), n = t !== null && t.getHours() >= 12 ? "am" : "pm";
			this.write(e, Yj(e, mq(this.baseValue(e, r), n)), r);
			return;
		}
		let i = this.baseValue(e, r), a = pq(t), o = yj(vj(e), a) * n, s = a === "hour" ? 24 : 60, c = ((bj(i, a) + o) % s + s) % s;
		this.write(e, Yj(e, xj(i, a, c)), r);
	}
	applyDigit(e, t, n, r, i) {
		let a = this.editState(e), o = n === "hour" ? 23 : n === "hour12" ? 12 : 59, s = +(n === "hour12"), c = (a.unit === n ? a.buffer : "") + r;
		Number(c) > o && (c = r);
		let l = Number(c), u = c.length >= 2 || l * 10 > o;
		if (a.unit = n, a.buffer = u ? "" : c, l >= s) {
			let t = this.baseValue(e, i);
			this.write(e, n === "hour12" ? xj(t, "hour", hq(l, t.getHours() >= 12)) : xj(t, pq(n), l), i);
		}
		u && dq(e, t, "ArrowRight");
	}
	applyMeridiem(e, t, n) {
		this.write(e, mq(this.baseValue(e, n), t), n);
	}
	baseValue(e, t) {
		return q(e, t) ?? Jj(e);
	}
	write(e, t, n) {
		Rj(e, t, n), Kj(e), this.applySegments(e);
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
function tq(e) {
	let t = [];
	for (let n = 0; n < e.length;) {
		let r = vs(e, n);
		r === null ? (t.push({
			kind: "literal",
			token: e[n],
			formatted: !1
		}), n++) : (t.push(nq(r)), n += r.length);
	}
	return t;
}
function nq(e) {
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
function rq(e) {
	if (e.kind === "literal") {
		let t = document.createElement("span");
		return t.className = qK, t.dataset.token = e.token, e.formatted && (t.dataset.formatted = ""), t;
	}
	let t = document.createElement("span");
	return t.className = KK, t.tabIndex = 0, t.setAttribute("role", "spinbutton"), t.setAttribute(YK, e.unit), t.dataset.width = String(e.width), iq(t, e.unit), t;
}
function iq(e, t) {
	if (t === "meridiem") {
		D.write(e, "aria-label", "ui.picker.meridiem");
		return;
	}
	let n = pq(t);
	D.write(e, "aria-label", n === "hour" ? "ui.picker.hours" : n === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"), e.setAttribute("aria-valuemin", t === "hour12" ? "1" : "0"), e.setAttribute("aria-valuemax", t === "hour12" ? "12" : t === "hour" ? "23" : "59");
}
function aq(e, t, n, r) {
	return t && n !== null ? ps(n, e, r) : e;
}
function oq(e, t, n, r) {
	if (n === null) return QK;
	if (e === "meridiem") return n.getHours() < 12 ? r.amDesignator : r.pmDesignator;
	let i = e === "hour12" ? zs(n.getHours()) : bj(n, pq(e));
	return String(i).padStart(t, "0");
}
function sq(e, t, n, r) {
	r !== e.hasAttribute("aria-readonly") && (r ? e.setAttribute("aria-readonly", "true") : e.removeAttribute("aria-readonly")), t === "meridiem" || n === null ? e.removeAttribute("aria-valuenow") : e.setAttribute("aria-valuenow", String(t === "hour12" ? zs(n.getHours()) : bj(n, pq(t))));
}
function cq(e) {
	return kj(e.closest(`.${GK}`));
}
function lq(e) {
	let t = e instanceof Element ? e.closest(`.${KK}`) : null;
	if (t === null) return null;
	let n = t.closest(`.${K}`);
	return n === null || A(n) ? null : t;
}
function uq(e) {
	return document.activeElement instanceof HTMLElement && document.activeElement.closest(".ui-temporal-input") === e ? document.activeElement.closest(`.${KK}`) : null;
}
function dq(e, t, n) {
	Vu({
		key: n,
		items: [...e.querySelectorAll(`.${KK}`)],
		current: t,
		axis: "horizontal",
		loop: !1
	})?.focus();
}
function fq(e, t) {
	let n = e.toLowerCase();
	return n.length === 1 ? n === "a" || n === t.amDesignator.charAt(0).toLowerCase() ? "am" : n === "p" || n === t.pmDesignator.charAt(0).toLowerCase() ? "pm" : null : null;
}
function pq(e) {
	return e === "hour12" || e === "meridiem" ? "hour" : e;
}
function mq(e, t) {
	return xj(e, "hour", hq(zs(e.getHours()), t === "pm"));
}
function hq(e, t) {
	let n = e % 12;
	return t ? n + 12 : n;
}
//#endregion
//#region src/interactions/timestamp-engine.ts
var gq = "datetime", _q = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.apply(this.root.querySelectorAll(`.${xt}`), D.temporal === null), D.onTable(() => this.apply(this.root.querySelectorAll(`.${xt}`))), e.propertyPatchEngine?.addValueChangeHandler((e) => this.apply(za(e.components, `.${xt}`))), B(this.root, `.${xt}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [gq],
			relevant: (e) => e.type === "attributes" || !(e.target instanceof Element && e.target.closest(".ui-timestamp") !== null)
		}, (e) => this.apply(e));
	}
	apply(e, t = !1) {
		let n = {
			temporal: D.temporal,
			language: D.language || document.documentElement.lang
		}, r = Date.now(), i = !1;
		for (let a of e) {
			let e = Us(a.getAttribute(Ct)), o = Hs(a.getAttribute(gq)), s = a.querySelector(`.${St}`);
			if (s === null || t && !vq(e, o, r)) continue;
			let c = o === null ? "" : qs(o, e, n, r);
			s.textContent !== c && (s.textContent = c), i ||= Ws(e) && o !== null;
		}
		i && Cc(this.refreshRelative);
	}
	refreshRelative = () => {
		let e = [...this.root.querySelectorAll(`.${xt}:is([${Ct}="relative"], [${Ct}="relative-date"])`)];
		return e.length !== 0 && (this.apply(e), !0);
	};
};
function vq(e, t, n) {
	return e === "relative" || e === "relative-date" && t !== null && Js(t, n) !== null;
}
//#endregion
//#region src/interactions/file-tile-engine.ts
var yq = `.${wt}`, bq = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), D.onChange(() => this.applyAll()), e.propertyPatchEngine?.addValueChangeHandler((e) => xq(za(e.components, yq))), B(this.root, yq, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [
				Ot,
				kt,
				At,
				jt
			],
			relevant: (e) => e.type === "attributes" || !(e.target instanceof Element && e.target.closest(yq) !== null)
		}, xq);
	}
	applyAll() {
		xq(this.root.querySelectorAll(yq));
	}
};
function xq(e) {
	let t = D.language || document.documentElement.lang;
	for (let n of e) ty(n, t);
}
//#endregion
//#region src/items/item-reveal.ts
var Sq = /* @__PURE__ */ new Map();
function Cq(e) {
	if (e.hasAttribute("data-ui-items-host")) return e;
	for (let t of e.querySelectorAll(`[${x}]`)) if (t.closest("[data-ui-id]") === e) return t;
	return null;
}
function wq(e, t, n, r) {
	let i = Tq(e, t);
	return i !== null && (Sq.set(e, {
		key: t,
		block: n
	}), Eq(e, i, n, r), !0);
}
function Tq(e, t) {
	for (let n of e.children) if (n.getAttribute("data-ui-key") === t) return n;
	return null;
}
function Eq(e, t, n, r) {
	let i = t.previousElementSibling, a = i !== null && i.hasAttribute("data-ui-group-header") && i.getAttribute("data-ui-group-anchor") === t.getAttribute("data-ui-key") ? i : null, o = qu(e);
	if (o.scrollHeight <= o.clientHeight) {
		(a ?? t).scrollIntoView({
			behavior: r,
			block: n === "Start" ? "start" : n === "End" ? "end" : n === "Center" ? "center" : "nearest"
		});
		return;
	}
	let s = o.getBoundingClientRect().top + o.clientTop, c = o.clientHeight, l = (a ?? t).getBoundingClientRect().top, u = t.getBoundingClientRect().bottom, d = Dq(n, l - s, u - s, c);
	d !== 0 && (r === "smooth" ? o.scrollTo({
		top: o.scrollTop + d,
		behavior: r
	}) : o.scrollTop += d);
}
function Dq(e, t, n, r) {
	switch (e) {
		case "Center": return (t + n - r) / 2;
		case "End": return n - r;
		case "Nearest": return t >= 0 && n <= r ? 0 : t < 0 || n - t > r ? t : n - r;
		default: return t;
	}
}
function Oq(e) {
	let t = Sq.get(e);
	if (t === void 0) return;
	let n = Tq(e, t.key);
	n === null ? Sq.delete(e) : Eq(e, n, t.block, "auto");
}
function kq(e) {
	if (Sq.size !== 0 && e instanceof Node) for (let t of [...Sq.keys()]) (!t.isConnected || qu(t).contains(e)) && Sq.delete(t);
}
//#endregion
//#region src/interactions/scroll-anchor-engine.ts
var Aq = "data-ui-scroll-anchor", jq = "End", Mq = `[${Aq}="${jq}"]`, Nq = 4, Pq = [
	"wheel",
	"touchstart",
	"pointerdown",
	"keydown"
], Fq = /* @__PURE__ */ new WeakSet();
function Iq(e) {
	Fq.add(e);
}
function Lq(e) {
	kq(e);
	for (let t = e.closest(Mq); t !== null; t = t.parentElement?.closest(Mq) ?? null) Fq.delete(t);
}
var Rq = class {
	root;
	pinned = /* @__PURE__ */ new WeakMap();
	resizes = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null;
	watched = /* @__PURE__ */ new WeakMap();
	watchedContainers = /* @__PURE__ */ new WeakSet();
	heights = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0);
		for (let e of Pq) this.root.addEventListener(e, (e) => zq(e), {
			capture: !0,
			passive: !0
		});
		B(this.root, `[${Aq}="${jq}"]`, {
			childList: !0,
			characterData: !0,
			attributeFilter: [cn]
		}, (e) => this.followEach(e)), this.followContent();
	}
	handleScroll(e) {
		let t = e.target;
		t instanceof Element && Vq(t) && this.pinned.set(t, Fq.has(t) || Uq(t) && !Hq(t));
	}
	followContent() {
		this.followEach(this.root.querySelectorAll(`[${Aq}="${jq}"]`));
	}
	followEach(e) {
		for (let t of e) this.watchRows(t), Fq.has(t) ? (this.pinned.set(t, !0), Bq(t)) : this.pinned.get(t) !== !1 && (Hq(t) ? this.pinned.set(t, !1) : (this.pinned.set(t, !0), Bq(t)));
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
			if (!e.isConnected || r === null || !Vq(r)) {
				this.forget(e);
				continue;
			}
			let i = e.getBoundingClientRect(), a = this.heights.get(e);
			if (this.heights.set(e, i.height), a === i.height) continue;
			let o = a !== void 0 && i.top + a <= r.getBoundingClientRect().top ? i.height - a : 0;
			t.set(r, (t.get(r) ?? 0) + o);
		}
		for (let [e, n] of t) this.followsEnd(e) ? Bq(e) : n !== 0 && e.getAttribute("data-ui-host-mode") !== "virtualized" && getComputedStyle(e).overflowAnchor === "none" && (e.scrollTop += n);
	}
	followOwnBox(e) {
		!e.isConnected || !Vq(e) ? (this.watchedContainers.delete(e), this.resizes?.unobserve(e)) : this.followsEnd(e) && Bq(e);
	}
	followsEnd(e) {
		return Fq.has(e) || this.pinned.get(e) !== !1 && !Hq(e);
	}
	forget(e) {
		this.resizes?.unobserve(e), this.heights.delete(e);
	}
};
function zq(e) {
	kq(e.target);
	let t = e.target instanceof Element ? e.target.closest(Mq) : null;
	t !== null && Fq.delete(t);
}
function Bq(e) {
	e.scrollTop = e.scrollHeight;
}
function Vq(e) {
	return e.getAttribute(Aq) === jq;
}
function Hq(e) {
	return yO(e, nn);
}
function Uq(e) {
	return e.scrollHeight - e.scrollTop - e.clientHeight <= Nq;
}
//#endregion
//#region src/interactions/text-selection-engine.ts
var Wq = `${Nu}, [role='menu'], [role='tab']`, Gq = class {
	selection;
	selects;
	constructor(e = {}) {
		let t = e.root ?? document;
		this.selection = e.selection ?? (() => document.getSelection()), this.selects = e.selects ?? Kq, t.addEventListener("pointerdown", (e) => this.handlePointerDown(e), { capture: !0 });
	}
	handlePointerDown(e) {
		if (e.button !== 0 || e.pointerType === "touch" || !(e.target instanceof Element)) return;
		let t = this.selection();
		t === null || t.isCollapsed || e.target.closest(Wq) !== null || this.selects(e.target) || t.removeAllRanges();
	}
};
function Kq(e) {
	let t = getComputedStyle(e);
	return (t.getPropertyValue("user-select") || t.getPropertyValue("-webkit-user-select")) !== "none";
}
//#endregion
//#region src/interactions/scroll-group-mapping.ts
function qq(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.top(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = Yq(e, a, n), s = Yq(e, a + 1, n);
	return Xq(t, o.top, s.top, o.line, s.line);
}
function Jq(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.line(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = Yq(e, a, n), s = Yq(e, a + 1, n);
	return Xq(t, o.line, s.line, o.top, s.top);
}
function Yq(e, t, n) {
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
function Xq(e, t, n, r, i) {
	return n <= t ? r : r + Math.min(1, Math.max(0, (e - t) / (n - t))) * (i - r);
}
//#endregion
//#region src/interactions/scroll-group-engine.ts
var Zq = 250, Qq = class {
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
		if (n !== void 0 && t - n.at < Zq && n.found.every((e) => e.isConnected)) return n.found;
		let r = [...this.root.querySelectorAll(`[${Kt}="${Ji(e)}"]`)];
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
		let n = $q(e, "data-ui-scroll-viewport") ?? eJ(e) ?? e;
		return this.viewports.set(e, n), n;
	}
	follow(e, t) {
		let n = e.scrollHeight - e.clientHeight, r = t.scrollHeight - t.clientHeight;
		if (r <= 0 && t.scrollWidth <= t.clientWidth) return;
		let i = n > 0 ? nJ(e) : null, a = i === null ? null : nJ(t), o;
		if (n <= 0 || e.scrollTop <= 0) o = 0;
		else if (e.scrollTop >= n - 1) o = r;
		else if (i !== null && a !== null) {
			let t = Math.max(i.endLine, a.endLine);
			o = Jq(a, qq(i, e.scrollTop, t), t);
		} else o = e.scrollTop / n * r;
		let s = i === null && a === null ? tJ(e.scrollLeft, e.scrollWidth - e.clientWidth) * Math.max(0, t.scrollWidth - t.clientWidth) : t.scrollLeft;
		o = Math.round(Math.min(Math.max(0, o), Math.max(0, r))), !(Math.abs(t.scrollTop - o) < 1 && Math.abs(t.scrollLeft - s) < 1) && (t.scrollTo({
			top: o,
			left: s,
			behavior: "instant"
		}), this.driven.set(t, t.scrollTop));
	}
};
function $q(e, t) {
	for (let n of e.querySelectorAll(`[${t}]`)) if (n.closest("[data-ui-id]") === e) return n;
	return null;
}
function eJ(e) {
	let t = e.hasAttribute("data-ui-items-host") ? e : $q(e, x);
	return t === null ? null : qu(t);
}
function tJ(e, t) {
	return t > 0 ? e / t : 0;
}
function nJ(e) {
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
var rJ = ".ui-tab-item__caption, .ui-split-button:not([data-ui-split-mode='menu']) > :is(.ui-split-button__main, .ui-split-button__toggle)", iJ = `.${Mi}, .ui-action, .${Fn}, .ui-select__option, .ui-language-switcher__choice, .ui-pager__size-choice, .ui-color-input__swatch--button, .ui-expander__header, ${rJ}`, aJ = ".ui-expander__header", oJ = "ui-key-value-action__row", sJ = `${iJ}, ${`${md}, .${oJ}`}`, cJ = "ui-pressing", lJ = "ui-press-held", uJ = "ui-press-placed", dJ = class {
	clicks;
	waves;
	presses = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		let t = e.root ?? document;
		this.clicks = e.clicks ?? (() => !1), this.waves = e.waves ?? !0, t.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), t.addEventListener("pointerup", (e) => this.release(e, !1), !0), t.addEventListener("pointercancel", (e) => this.release(e, !0), !0), t.addEventListener("dragstart", () => this.finishAll(), !0), t.addEventListener(uP, (e) => this.handleHold(e)), t.addEventListener(dP, (e) => this.handleHoldEnd(e));
	}
	handlePointerDown(e) {
		if (!(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		this.end(e.pointerId, !0);
		let t = this.pressedElement(e.target);
		t !== null && this.moves(t) && (this.start(e.pointerId, t, e.clientX, e.clientY, z.ripple, !1), t.classList.add(lJ));
	}
	moves(e) {
		return this.waves && typeof e.animate == "function" && !Lm();
	}
	start(e, t, n, r, i, a) {
		for (let [e, n] of this.presses) n.element === t && this.finish(e, n);
		let o = t.getBoundingClientRect(), s = n - o.left, c = r - o.top, l = Math.hypot(Math.max(s, o.width - s), Math.max(c, o.height - c)), { wave: u, ink: d } = fJ(s - t.clientLeft, c - t.clientTop, l);
		t.classList.add(cJ), t.append(u);
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
		if (t === null || !(n instanceof HTMLElement) || O(n) || t.target.closest(aJ) !== null) return;
		let r = this.presses.get(t.pointerId);
		if (r !== void 0 && r.fade === null) {
			this.retime(r, performance.now() + t.duration);
			return;
		}
		let i = this.moves(n);
		(i || this.pressedElement(t.target) === null) && (this.start(t.pointerId, n, t.clientX, t.clientY, i ? t.duration : null, !0), getComputedStyle(n).position === "static" && n.classList.add(uJ));
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
		let t = e.closest(rJ) ?? e.closest(sJ);
		if (t === null || O(t) || t.matches(aJ)) return null;
		let n = e.closest(ki);
		return n !== null && n !== t && t.contains(n) ? null : t.matches(iJ) ? t : this.pressedRow(t, e);
	}
	pressedRow(e, t) {
		if (Bu(t, e) !== null || k(e) || e.hasAttribute("data-ui-row-editing")) return null;
		let n = e.closest(F), r = n !== null && !e.classList.contains(oJ) && !n.hasAttribute("data-ui-no-row-select") && (n.getAttribute("data-ui-selection") === "one" || n.getAttribute("data-ui-selection") === "many"), i = e.classList.contains("ui-tree__row") && Xc(e, "data-ui-unselectable");
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
		n.element.classList.remove(lJ);
		let r = performance.now(), i = Math.max(0, n.fills - r), a = t ? 0 : Math.min(i, z.fast);
		a > 0 && this.retime(n, r + a), n.fade = n.wave.animate([{ opacity: 1 }, { opacity: 0 }], {
			duration: z.normal,
			delay: a,
			easing: z.exit,
			fill: "forwards"
		}), n.fade.addEventListener("finish", () => this.finish(e, n));
	}
	finish(e, t) {
		t.grow?.cancel(), t.fade?.cancel(), t.wave.remove(), t.element.classList.remove(cJ, lJ, uJ), this.presses.get(e) === t && this.presses.delete(e);
	}
};
function fJ(e, t, n) {
	let r = document.createElement("span"), i = document.createElement("span");
	return r.className = Yh, r.setAttribute("aria-hidden", "true"), i.className = Xh, i.style.setProperty("left", `${e - n}px`), i.style.setProperty("top", `${t - n}px`), i.style.setProperty("width", `${n * 2}px`), i.style.setProperty("height", `${n * 2}px`), r.append(i), {
		wave: r,
		ink: i
	};
}
//#endregion
//#region src/interactions/overlay-scrollbar-engine.ts
var pJ = "ui-overlay-scrollbar", mJ = "ui-overlay-scrollbar__box", hJ = "ui-overlay-scrollbar__thumb", gJ = "ui-overlay-scrollbar--shown", _J = "ui-overlay-scrollbar__thumb--held", vJ = "ui-overlay-scrollbar__arrow", yJ = "ui-overlay-scrollbar--near", bJ = "(hover: hover) and (forced-colors: none)", xJ = "--ui-overlay-thumb", SJ = "--ui-scroll-hung", CJ = 12, wJ = 2, TJ = 24, EJ = 12, DJ = 80, OJ = 40, kJ = 400, AJ = 50, jJ = 900, MJ = 400, NJ = 16, PJ = class {
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
		this.doc = e, this.layer = e.createElement("div"), this.layer.className = pJ, this.layer.setAttribute("aria-hidden", "true"), this.layer.setAttribute("popover", "manual"), this.bars = {
			y: this.createBar(e, "y"),
			x: this.createBar(e, "x")
		}, this.layer.addEventListener("mousedown", (e) => e.preventDefault()), this.layer.addEventListener("contextmenu", (e) => e.preventDefault()), e.body.append(this.layer), _g((e) => e.includes(this.bars.y.box) ? this.bars.y.scroller : e.includes(this.bars.x.box) ? this.bars.x.scroller : null), this.media = window.matchMedia(bJ), this.active = this.media.matches, this.media.addEventListener("change", () => this.follow()), this.active && this.raise(), e.addEventListener("pointermove", (e) => this.handlePointerMove(e), {
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
		return n.className = `${mJ} ${mJ}--${t}`, r.className = `${hJ} ${hJ}--${t}`, n.append(i, r, a), this.layer.append(n), r.addEventListener("pointerdown", (e) => this.grab(e, t)), r.addEventListener("pointermove", (e) => this.pull(e)), r.addEventListener("pointerup", (e) => this.release(e)), r.addEventListener("pointercancel", (e) => this.release(e)), r.addEventListener("lostpointercapture", (e) => this.lose(e)), r.addEventListener("wheel", (e) => this.forwardWheel(e, t), { passive: !1 }), {
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
		return r.className = `${vJ} ${vJ}--${n < 0 ? "back" : "forward"}`, r.addEventListener("pointerdown", (e) => this.step(e, t, n)), r.addEventListener("pointerup", () => this.stopStepping()), r.addEventListener("pointercancel", () => this.stopStepping()), r.addEventListener("lostpointercapture", () => this.stopStepping()), r.addEventListener("wheel", (e) => this.forwardWheel(e, t), { passive: !1 }), r;
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
		t !== null && (t === this.bars.y.scroller || t === this.bars.x.scroller ? ((this.scrolling || this.drag !== null || this.readerScrolled(e)) && this.flash(), this.schedule(), !this.hovered && this.drag === null && this.settleLater()) : this.hovered || this.drag !== null ? (this.repick = this.hovered && this.drag === null, this.schedule()) : this.readerScrolled(e) && (this.pick(BJ(t, "y") ? t : null, BJ(t, "x") ? t : null, !1), this.flash(), this.settleLater(), this.schedule()));
	}
	noteInput(e) {
		this.inputAt = e.timeStamp;
	}
	readerScrolled(e) {
		return e.timeStamp - this.inputAt < MJ;
	}
	flash() {
		this.scrolling = !0, window.clearTimeout(this.fade), this.fade = window.setTimeout(() => {
			this.fade = 0, this.scrolling = !1, this.paint();
		}, jJ), this.paint();
	}
	approach() {
		let e = !1;
		for (let t of [this.bars.y, this.bars.x]) {
			let n = this.point !== null && t.view !== null && FJ(this.point, t.view, t.axis, t.rtl);
			e ||= n !== t.near, t.near = n;
		}
		e && this.paint();
	}
	paint() {
		for (let e of [this.bars.y, this.bars.x]) {
			let t = this.drag?.axis === e.axis || this.stepping === e.axis;
			e.box.classList.toggle(gJ, e.view !== null && (this.scrolling || e.near || t)), e.box.classList.toggle(yJ, e.view !== null && (e.near || t));
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
		}, jJ);
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
		e !== null && this.layer.contains(e) || (this.target = e, this.pick(IJ(e, "y"), IJ(e, "x"), !0));
	}
	measure(e) {
		let t = this.bars[e].scroller;
		if (t === null || !t.isConnected || !BJ(t, e)) return null;
		let n = WJ(t);
		if (n === null) return null;
		let r = this.bars[e === "y" ? "x" : "y"].scroller === t, i = e === "y" ? UJ(t) : VJ(t);
		return {
			view: n,
			thumb: KJ(t, e, i, r),
			arrows: qJ(t, e, i, r),
			rtl: $J(t)
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
		}), eY(e.thumb, r, n), e.back.hidden = i === null, e.forward.hidden = i === null, i !== null && (eY(e.back, i.back, n), eY(e.forward, i.forward, n));
	}
	step(e, t, n) {
		let r = this.bars[t].scroller;
		if (e.button !== 0 || r === null || this.drag !== null) return;
		Lq(r), e.currentTarget.setPointerCapture(e.pointerId), this.stopStepping(), this.stepping = t;
		let i = () => {
			r.isConnected ? (r.scrollBy(t === "y" ? { top: n * OJ } : { left: n * OJ }), this.flash()) : this.stopStepping();
		};
		i(), this.repeat = window.setTimeout(() => {
			this.repeat = window.setInterval(i, AJ);
		}, kJ);
	}
	stopStepping() {
		window.clearTimeout(this.repeat), window.clearInterval(this.repeat), this.repeat = 0, this.stepping !== null && (this.stepping = null, this.paint());
	}
	grab(e, t) {
		let n = this.bars[t].scroller;
		if (e.button !== 0 || n === null) return;
		let r = t === "x" && $J(n), i = YJ(n, t, VJ(n), this.bars[t === "y" ? "x" : "y"].scroller === n, r), a = i.length - i.thumb;
		Lq(n), this.bars[t].thumb.setPointerCapture(e.pointerId), this.bars[t].thumb.classList.add(_J), this.drag = {
			axis: t,
			scroller: n,
			pointerId: e.pointerId,
			from: t === "y" ? e.clientY : e.clientX,
			scroll: QJ(n, t),
			ratio: a > 0 ? i.max / a : 0,
			rtl: r
		};
	}
	pull(e) {
		let t = this.drag;
		if (t === null || e.pointerId !== t.pointerId || !t.scroller.isConnected) return;
		let n = (t.axis === "y" ? e.clientY : e.clientX) - t.from;
		t.axis === "y" ? t.scroller.scrollTop = ZJ(t.scroll, n, t.ratio, !1) : t.scroller.scrollLeft = ZJ(t.scroll, n, t.ratio, t.rtl);
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
			e.preventDefault(), t.axis === "y" ? t.scroller.scrollTop = ZJ(t.scroll, 0, t.ratio, !1) : t.scroller.scrollLeft = ZJ(t.scroll, 0, t.ratio, t.rtl), this.endDrag();
			try {
				this.bars[t.axis].thumb.releasePointerCapture(t.pointerId);
			} catch {}
		}
	}
	endDrag() {
		this.drag !== null && this.bars[this.drag.axis].thumb.classList.remove(_J), this.drag = null, this.paint();
	}
	forwardWheel(e, t) {
		let n = this.bars[t].scroller;
		if (n === null || e.ctrlKey) return;
		let r = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? "y" : "x", i = e.deltaX * zJ(e, n, "x"), a = e.deltaY * zJ(e, n, "y"), o = LJ(n, r, r === "y" ? a : i);
		e.preventDefault(), o !== null && (Lq(o), o.scrollBy({
			left: i,
			top: a
		}));
	}
};
function FJ(e, t, n, r) {
	return n === "x" ? e.x >= t.left && e.x <= t.right && e.y <= t.bottom && e.y > t.bottom - 28 : e.y < t.top || e.y > t.bottom ? !1 : r ? e.x >= t.left && e.x < t.left + 28 : e.x <= t.right && e.x > t.right - 28;
}
function IJ(e, t) {
	for (let n = e; n !== null; n = n.parentElement) if (BJ(n, t)) return n;
	return null;
}
function LJ(e, t, n) {
	for (let r = e; r !== null; r = IJ(r.parentElement, t)) if (BJ(r, t) && RJ(r, t, n)) return r;
	return null;
}
function RJ(e, t, n) {
	let r = t === "y" ? e.scrollHeight - e.clientHeight : e.scrollWidth - e.clientWidth, i = QJ(e, t), a = t === "x" && $J(e) ? n < 0 : n > 0;
	return n !== 0 && (a ? i < r - 1 : i > 0);
}
function zJ(e, t, n) {
	return e.deltaMode === WheelEvent.DOM_DELTA_LINE ? NJ : e.deltaMode === WheelEvent.DOM_DELTA_PAGE ? n === "y" ? t.clientHeight : t.clientWidth : 1;
}
function BJ(e, t) {
	if ((t === "y" ? e.scrollHeight - e.clientHeight : e.scrollWidth - e.clientWidth) <= 1) return !1;
	let n = e === document.scrollingElement, r = getComputedStyle(n ? document.documentElement : e), i = t === "y" ? r.overflowY : r.overflowX;
	return n ? i !== "hidden" && i !== "clip" : (i === "auto" || i === "scroll") && r.getPropertyValue(xJ).trim() !== "none";
}
function VJ(e) {
	if (e === document.scrollingElement) return tY(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
	let t = e.getBoundingClientRect(), n = e instanceof HTMLElement ? e : null, r = HJ(t.width, n?.offsetWidth), i = HJ(t.height, n?.offsetHeight), a = t.left + e.clientLeft * r, o = t.top + e.clientTop * i;
	return tY(a, o, a + e.clientWidth * r, o + e.clientHeight * i);
}
function HJ(e, t) {
	return t === void 0 || t <= 0 || e <= 0 ? 1 : e / t;
}
function UJ(e) {
	let t = VJ(e);
	if (e === document.scrollingElement) return t;
	let n = Number.parseFloat(getComputedStyle(e).getPropertyValue(SJ));
	return n > 0 ? $J(e) ? tY(t.left - n, t.top, t.right, t.bottom) : tY(t.left, t.top, t.right + n, t.bottom) : t;
}
function WJ(e) {
	let t = UJ(e);
	for (let n = e; n !== null && n !== document.documentElement; n = n.parentElement) {
		let r = getComputedStyle(n);
		if (n !== e && (r.overflowX !== "visible" || r.overflowY !== "visible") && (t = nY(t, GJ(n, r))), r.position === "fixed" || n.matches(":popover-open, dialog:modal")) break;
	}
	return t = nY(t, tY(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight)), t.width > 0 && t.height > 0 ? t : null;
}
function GJ(e, t) {
	let n = VJ(e), r = Number.parseFloat((t.overflowClipMargin ?? "").split(" ").at(-1) ?? "") || 0, i = t.overflowX === "visible" ? Infinity : t.overflowX === "clip" ? r : 0, a = t.overflowY === "visible" ? Infinity : t.overflowY === "clip" ? r : 0;
	return tY(n.left - i, n.top - a, n.right + i, n.bottom + a);
}
function KJ(e, t, n, r) {
	let i = $J(e), a = YJ(e, t, n, r, i), o = a.max > 0 ? QJ(e, t) / a.max * (a.length - a.thumb) : 0;
	return t === "y" ? {
		left: i ? n.left : n.right - CJ,
		top: a.start + o,
		width: CJ,
		height: a.thumb
	} : {
		left: i ? a.start + a.length - a.thumb - o : a.start + o,
		top: n.bottom - CJ,
		width: a.thumb,
		height: CJ
	};
}
function qJ(e, t, n, r) {
	let i = $J(e), a = YJ(e, t, n, r, i);
	if (a.arrow === 0) return null;
	if (t === "y") {
		let e = i ? n.left : n.right - CJ;
		return {
			back: {
				left: e,
				top: a.start - EJ,
				width: CJ,
				height: EJ
			},
			forward: {
				left: e,
				top: a.start + a.length,
				width: CJ,
				height: EJ
			}
		};
	}
	let o = n.bottom - CJ;
	return {
		back: {
			left: a.start - EJ,
			top: o,
			width: EJ,
			height: CJ
		},
		forward: {
			left: a.start + a.length,
			top: o,
			width: EJ,
			height: CJ
		}
	};
}
function JJ(e, t, n, r) {
	return (t === "y" ? e.height : e.width) - r - 4 - (n ? CJ : 0) >= DJ ? EJ : 0;
}
function YJ(e, t, n, r, i) {
	let a = t === "y" ? XJ(e) : {
		top: 0,
		bottom: 0
	}, o = JJ(n, t, r, a.top + a.bottom), s = (t === "y" ? n.top + a.top : n.left) + wJ + o + (r && i && t === "x" ? CJ : 0), c = (t === "y" ? n.height - a.top - a.bottom : n.width) - 4 - 2 * o - (r ? CJ : 0), l = t === "y" ? e.clientHeight : e.clientWidth, u = t === "y" ? e.scrollHeight : e.scrollWidth;
	return {
		start: s,
		length: c,
		thumb: Math.min(c, Math.max(TJ, c * l / u)),
		max: u - l,
		arrow: o
	};
}
function XJ(e) {
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
function ZJ(e, t, n, r) {
	return r ? -(e - t * n) : e + t * n;
}
function QJ(e, t) {
	return t === "y" ? e.scrollTop : Math.abs(e.scrollLeft);
}
function $J(e) {
	return getComputedStyle(e).direction === "rtl";
}
function eY(e, t, n) {
	Object.assign(e.style, {
		left: `${t.left - n.left}px`,
		top: `${t.top - n.top}px`,
		width: `${t.width}px`,
		height: `${t.height}px`
	});
}
function tY(e, t, n, r) {
	return {
		left: e,
		top: t,
		right: n,
		bottom: r,
		width: Math.max(0, n - e),
		height: Math.max(0, r - t)
	};
}
function nY(e, t) {
	return tY(Math.max(e.left, t.left), Math.max(e.top, t.top), Math.min(e.right, t.right), Math.min(e.bottom, t.bottom));
}
//#endregion
//#region src/interactions/refusal-engine.ts
var rY = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"Home",
	"End",
	"PageUp",
	"PageDown"
]), iY = [
	"click",
	"dblclick",
	"auxclick",
	"dragstart"
], aY = `.${bi}, .${xi}`, oY = RegExp(`(^|\\s)(${bi}|${xi})(\\s|$)`), sY = RegExp(`(^|\\s)${Si}(\\s|$)`), cY = "[type='range']", lY = /* @__PURE__ */ new WeakSet(), uY = /* @__PURE__ */ new WeakSet();
function dY(e = document) {
	let t = e === document ? window : e;
	for (let e of iY) t.addEventListener(e, yY, !0);
	t.addEventListener("keydown", xY, !0), t.addEventListener("change", SY, !0), t.addEventListener("pointerdown", CY, !0), t.addEventListener("mousedown", CY, !0), gY(e.querySelectorAll(aY)), mY(e.querySelectorAll(`[${yi}]`)), pY(e.querySelectorAll(cY)), new MutationObserver((e) => {
		for (let t of e) fY(t);
	}).observe(e, {
		subtree: !0,
		childList: !0,
		attributes: !0,
		attributeFilter: ["class", yi],
		attributeOldValue: !0
	});
}
function fY(e) {
	if (e.type === "attributes") {
		let t = e.target;
		if (e.attributeName === "data-ui-href") {
			hY(t, e.oldValue !== null);
			return;
		}
		let n = oY.test(e.oldValue ?? ""), r = t.matches(aY);
		n !== r && (_Y(t, r), hY(t)), sY.test(e.oldValue ?? "") !== t.matches(".ui-readonly") && pY(t.querySelectorAll(cY));
		return;
	}
	let t = (e.target instanceof Element ? e.target : null)?.matches(aY) === !0;
	for (let n of e.addedNodes) n instanceof Element && (t && vY(n), n.matches(aY) && _Y(n, !0), gY(n.querySelectorAll(aY)), hY(n), mY(n.querySelectorAll(`[${yi}]`)), pY([n, ...n.querySelectorAll(cY)]));
}
function pY(e) {
	for (let t of e) {
		if (!(t instanceof HTMLInputElement) || t.type !== "range") continue;
		let e = A(t);
		e !== lY.has(t) && (e ? (lY.add(t), t.addEventListener("touchstart", CY, { passive: !1 })) : (lY.delete(t), t.removeEventListener("touchstart", CY)));
	}
}
function mY(e) {
	for (let t of e) hY(t);
}
function hY(e, t = !1) {
	let n = e.getAttribute(yi);
	(n !== null || t) && (e.matches(aY) ? (e.removeAttribute("href"), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0")) : n === null || !Ya(n) ? e.removeAttribute("href") : e.getAttribute("href") !== n && (e.setAttribute("href", n), e.getAttribute("tabindex") === "0" && e.removeAttribute("tabindex")));
}
function gY(e) {
	for (let t of e) _Y(t, !0);
}
function _Y(e, t) {
	for (let n of e.children) t ? vY(n) : uY.has(n) && (uY.delete(n), n.removeAttribute("inert"));
}
function vY(e) {
	e.hasAttribute("inert") || (uY.add(e), e.setAttribute("inert", ""));
}
function yY(e) {
	e.target instanceof Element && (O(e.target) ? (e.type === "click" && wg(e), wY(e)) : e.type === "click" && bY(e.target) && e.preventDefault());
}
function bY(e) {
	return e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio") && A(e);
}
function xY(e) {
	e instanceof KeyboardEvent && e.target instanceof Element && ((e.key === "Enter" || e.key === " ") && O(e.target) ? wY(e) : rY.has(e.key) && e.target instanceof HTMLInputElement && (e.target.type === "range" || e.target.type === "radio") && A(e.target) && e.preventDefault());
}
function SY(e) {
	e.target instanceof HTMLInputElement && e.target.type === "range" && A(e.target) && e.stopImmediatePropagation();
}
function CY(e) {
	e.target instanceof HTMLInputElement && e.target.type === "range" && A(e.target) && (e.preventDefault(), e.target.focus({ preventScroll: !0 }));
}
function wY(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region src/interactions/popup-service.ts
var TY = /* @__PURE__ */ new WeakMap(), EY = /* @__PURE__ */ new WeakSet(), DY = /* @__PURE__ */ new WeakSet(), OY = new y_({
	show: () => void 0,
	hide: ({ popup: e }, t) => {
		let n = TY.get(e);
		TY.delete(e), t !== void 0 && n?.(t);
	},
	single: !1,
	isInside: ({ popup: e, anchor: t }, n) => n.includes(e) || t !== void 0 && n.includes(t),
	onPress: !0,
	closesOnTab: ({ popup: e }) => EY.has(e),
	sheetOnPhone: ({ popup: e }) => DY.has(e)
});
function kY(e) {
	return {
		open: (e, t, n) => AY(e, t, n, (e) => OY.open(e)),
		openList: jY,
		listKey: wN,
		followPointer: DN,
		focusReturn: (t) => jp(t, e)
	};
}
function AY(e, t, n, r) {
	let i = n.owner ?? (e instanceof HTMLElement ? e : t), a = () => OY.popupOf(i) === t;
	return TY.set(t, n.onDismiss), n.closesOnTab === !0 ? EY.add(t) : EY.delete(t), n.sheetOnPhone === !0 ? DY.add(t) : DY.delete(t), r({
		owner: i,
		popup: t,
		anchor: e,
		placement: n
	}) || (TY.delete(t), queueMicrotask(() => n.onDismiss("owner"))), {
		reposition: () => {
			a() && OY.reposition(i);
		},
		close: () => {
			a() && OY.close(i);
		}
	};
}
function jY(e, t, n) {
	return AY(e, t, {
		...n,
		closesOnTab: !0
	}, (e) => CN(OY, e, n.entries, n.checked, n.fromEnd, n.focus));
}
//#endregion
//#region src/rendering/series-colors.ts
var MY = "--ui-color-series-count", NY = "--ui-color-series-", PY = 8;
function FY(e) {
	let t = Number(getComputedStyle(e).getPropertyValue(MY));
	return Number.isFinite(t) && t >= 1 ? Math.floor(t) : PY;
}
function IY(e, t) {
	return `var(${NY}${e % t + 1})`;
}
var LY = {
	count: FY,
	color: IY
}, RY = ".ui-items-view", zY = `:scope > [${x}]`, BY = `:scope > [${Ft}]`, VY = "ui-orientation--horizontal", HY = 1, UY = [{
	edge: "first",
	holder: `:scope > [${Bt}="${Ht}"]`,
	bound: `${Je}first-visible-key`,
	attribute: dt
}, {
	edge: "last",
	holder: `:scope > [${Bt}="${Ut}"]`,
	bound: `${Je}last-visible-key`,
	attribute: ft
}], WY = class {
	root;
	views = /* @__PURE__ */ new Set();
	waiting = /* @__PURE__ */ new Map();
	sized = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, B(this.root, RY, { childList: !0 }, (e) => this.findEach(e));
		let t = this.root.querySelectorAll(`[${Bt}="${Ht}"], [${Bt}="${Ut}"]`);
		this.findEach(new Set(Array.from(t, (e) => e.parentElement).filter((e) => e !== null))), this.root.addEventListener("scroll", (e) => this.handleScroll(e), {
			capture: !0,
			passive: !0
		});
	}
	findEach(e) {
		for (let t of e) GY(t) ? (this.views.add(t), this.watchHost(t), this.schedule(t)) : this.views.has(t) && this.forget(t);
	}
	watchHost(e) {
		let t = e.querySelector(zY), n = this.sized.get(e);
		if (n?.host === t) return;
		if (n?.stop(), t === null) {
			this.sized.delete(e);
			return;
		}
		let r = eB(t, () => this.schedule(e)), i = new MutationObserver((n) => {
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
		let t = e.isConnected ? KY(e) : [];
		if (t.length === 0) {
			this.forget(e);
			return;
		}
		let n = e.querySelector(zY);
		if (n === null || O(t[0].holder)) return;
		let r = JY(e, n);
		for (let { holder: e, edge: n, attribute: i } of t) {
			let t = qY(r, n);
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
function GY(e) {
	return KY(e).length > 0;
}
function KY(e) {
	let t = [];
	for (let { holder: n, bound: r, edge: i, attribute: a } of UY) {
		let o = e.querySelector(n);
		o?.hasAttribute(r) === !0 && t.push({
			holder: o,
			edge: i,
			attribute: a
		});
	}
	return t;
}
function qY(e, t) {
	if (e === null) return null;
	let { rows: n, band: r } = e;
	if (!(r.end - r.start <= HY)) return (t === "first" ? tX(n, r) : nX(n, r)) ?? void 0;
}
function JY(e, t) {
	let n = e.classList.contains(VY), r = n && getComputedStyle(t).direction === "rtl", i = [], a = !1;
	for (let e of t.children) {
		let t = e.getAttribute(b);
		if (t === null || e.hasAttribute("data-ui-group-header")) continue;
		a = !0;
		let o = Qu(e);
		!e.classList.contains("ui-hidden") && (o.width > 0 || o.height > 0) && i.push({
			key: t,
			...YY(o, n, r)
		});
	}
	return a ? {
		rows: i,
		band: XY(t, n, r)
	} : null;
}
function YY(e, t, n) {
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
function XY(e, t, n) {
	let r = qu(e), i = YY(ZY(r, getComputedStyle(r)), t, n);
	for (let e = r.parentElement; e !== null; e = e.parentElement) {
		let r = getComputedStyle(e);
		(t ? r.overflowX : r.overflowY) !== "visible" && (i = $Y(i, YY(ZY(e, null), t, n)));
	}
	return i = $Y(i, YY({
		left: 0,
		top: 0,
		right: window.innerWidth,
		bottom: window.innerHeight
	}, t, n)), eX(e, i, t, n);
}
function ZY(e, t) {
	let n = e.getBoundingClientRect(), r = n.left + e.clientLeft, i = n.top + e.clientTop;
	return {
		left: r + QY(t?.paddingLeft),
		top: i + QY(t?.paddingTop),
		right: r + e.clientWidth - QY(t?.paddingRight),
		bottom: i + e.clientHeight - QY(t?.paddingBottom)
	};
}
function QY(e) {
	let t = e === void 0 ? NaN : parseFloat(e);
	return Number.isFinite(t) ? t : 0;
}
function $Y(e, t) {
	return {
		start: Math.max(e.start, t.start),
		end: Math.min(e.end, t.end)
	};
}
function eX(e, t, n, r) {
	let i = t.start;
	for (let t of e.querySelectorAll(BY)) {
		let e = YY(t.getBoundingClientRect(), n, r);
		e.start <= i + HY && e.end > i && getComputedStyle(t).position === "sticky" && (i = e.end);
	}
	return {
		start: i,
		end: t.end
	};
}
function tX(e, t) {
	for (let n of e) if (rX(n, t)) return n.key;
	return null;
}
function nX(e, t) {
	for (let n = e.length - 1; n >= 0; n--) if (rX(e[n], t)) return e[n].key;
	return null;
}
function rX(e, t) {
	return e.key.length > 0 && e.end > t.start + HY && e.start < t.end - HY;
}
//#endregion
//#region src/items/item-rows.ts
function iX(e, t, n) {
	return {
		itemOf: (e) => t.getItemValue(e),
		itemsOf: (e) => n.itemsOf(e),
		itemsVersion: (e) => n.itemsVersion(e),
		readPath: GO,
		renderVariant: (n, r, i) => {
			let a = e.getVariantTemplate(r, i), o = t.getItemScope(n);
			return a === void 0 || o === void 0 ? null : t.renderFromTemplate(a, o.item, t.getAncestorStack(n));
		},
		isKeyTarget: (e) => Zd(e) !== null,
		cellsOf: (e) => {
			let t = e.closest(F);
			return t !== null && cf(t) ? df(t, e) : [];
		},
		moveCursor: (e, t) => Cf(e, t ?? null)
	};
}
//#endregion
//#region src/updates/shown-words.ts
function aX(e, t) {
	let n = ua(e.kind);
	return n === "Markup" ? !t.hasAttribute(zi) : n === "Attribute" && e.name === "data-ui-tooltip" || e.converter === "inlineMarkupPlainText";
}
var oX = class {
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
function sX(e, t) {
	return E(e) ? new oX(e, t) : null;
}
//#endregion
//#region src/items/items-template-renderer.ts
var cX = class {
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
		let c = this.metadata.getItemsTemplateMetadata(e), l = c?.itemWrapperElementName ? dX(o, c.itemWrapperElementName, c.itemWrapperClassName ?? null, c.itemWrapperRole ?? null) : o;
		l !== o && this.moveItemScope(o, l), fX(l, n, t);
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
		let i = uX(r.item, t, n);
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
			lX(n, e) && this.applyBoundAttribute(i, n, e, t);
		}
	}
	findTranslatableRowBindings() {
		let e = [];
		for (let t of this.metadata.metadata.bindings) {
			let n = this.metadata.getPropertyDefinition(t.propertyId);
			if (n === void 0 || typeof t.itemTemplate != "string" || !this.metadata.isTranslatable(t)) continue;
			let r = w(t.bindingId);
			e.push([t, `[${Je}${Yi(n.propertyName)}="${Ji(r)}"]`]);
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
		let r = _X(t, n.templateKeyPropertyName);
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
		i !== void 0 && !VO(e, i.itemTemplateParameters, n) && this.applyBoundAttribute(e, i, n);
	}
	applyBoundAttribute(e, t, n, r) {
		let i = w(t.bindingId), a = this.metadata.getPropertyDefinition(t.propertyId);
		if (a === void 0) return;
		let o = t.itemTemplate === null || t.itemTemplate === void 0 ? this.state.has(t, []) ? {
			ok: !0,
			value: this.state.get(t, [])
		} : { ok: !1 } : BO(n, t.itemTemplate, t.itemTemplateParameters);
		if (!o.ok) {
			t.optional !== !0 && !this.unresolved.has(i) && (this.unresolved.add(i), s("item binding value could not be resolved; the item's path stops short of the property.", {
				binding: t,
				stack: n
			}));
			return;
		}
		let c = "scope" in o ? o.scope : void 0, l = o.value ?? t.fallbackValue;
		if (r !== void 0 && !r(l)) return;
		let u = zc(l, () => this.metadata.isTranslatable(t) && !HO(c)), d = sX(l, this.extensions.converters), f = w(t.componentId), p = e.closest(this.componentSelector(f));
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
			let n = Qi(p, t, () => [e])[0] ?? null;
			n !== null && (d !== null && aX(t, n) ? this.operations.apply({
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
function lX(e, t) {
	for (let n of e.itemTemplateParameters ?? []) {
		let e = w(n.componentId);
		if (e > 0 && !t.some((t) => t.scopeComponentId === e)) return !1;
	}
	return !0;
}
function uX(e, t, n) {
	if (t.length === 0) return n;
	let r = e;
	for (let n = 0; n < t.length - 1; n++) {
		let i = t[n], a = i.kind === "property" ? KO(r, i.name) : ZO(r, i.key);
		if (!a.ok) return e;
		r = a.value;
	}
	if (typeof r != "object" || !r) return e;
	let i = t[t.length - 1];
	if (i.kind === "element") return QO(r, i.key, n), e;
	let a = r;
	return a[JO(a, i.name)] = n, e;
}
function dX(e, t, n, r) {
	let i = document.createElement(t);
	return n !== null && (i.className = n), r !== null && r.length > 0 && i.setAttribute("role", r), i.appendChild(e), i;
}
function fX(e, t, n) {
	e.setAttribute(b, t), gX(e, n), mX(e, n);
}
var pX = [
	["CanSelect", oe],
	["CanDrag", se],
	["CanRemove", ce],
	["CanRename", le],
	["CanShowContextMenu", ue]
];
function mX(e, t) {
	for (let [n, r] of pX) {
		let i = KO(t, n);
		e.toggleAttribute(r, i.ok && i.value === !1);
	}
}
function hX(e, t) {
	let n = e.getAttribute(b), r = e.closest(`[${x}]`);
	if (mX(e, t), n !== null) for (let i of e.querySelectorAll(`[${b}="${Ji(n)}"]`)) i.closest("[data-ui-items-host]") === r && mX(i, t);
}
function gX(e, t) {
	let n = KO(t, "Group");
	n.ok && typeof n.value == "string" ? e.setAttribute(Lt, n.value) : e.removeAttribute(Lt);
}
function _X(e, t) {
	if (t == null || t.trim().length === 0) return null;
	let n = KO(e, t);
	return !n.ok || n.value === null || n.value === void 0 ? null : typeof n.value == "string" ? n.value : String(n.value);
}
//#endregion
//#region src/items/items-rule-watcher.ts
var vX = "Group", yX = class {
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
				let e = Va(t);
				e !== null && this.syncComponentHosts(e);
			}
		}), B(e.root, `[${Wt}="windowed"]`, { attributeFilter: [rn] }, (e) => {
			for (let t of e) {
				let e = Va(t);
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
			for (let [t, n] of e) t.isConnected && GW(t, n, this.options);
		});
	}
	handleFocusOut() {
		this.readerHeld.size !== 0 && window.setTimeout(() => {
			for (let [e, t] of [...this.readerHeld]) bX(t.row) || (this.readerHeld.delete(e), e.isConnected && this.sync(e, t.componentId));
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
		for (let e of t) n.some((t) => xX(t, e)) || this.handleItemValueChange(e);
	}
	handleItemValueChange(e) {
		if (e.dynamicParameters.length === 0) return;
		let t = this.options.metadata.getBindingByComponentAndPropertyId(w(e.reference.componentId), e.reference.propertyId), n = t === void 0 ? null : XO(t);
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
			a !== null && this.drawsPatchedComponent(a, w(e.reference.componentId), t) && SX(a, e.dynamicParameters) && (r = this.applyVirtualizedValue(i, T(a), n, t, e.value) || r);
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
		let r = this.readerHeld.get(e)?.row ?? null, i = n !== null && bX(n) ? n : r !== null && bX(r) ? r : null;
		i === null ? (this.readerHeld.delete(e), GW(e, t, this.options)) : this.readerHeld.set(e, {
			componentId: t,
			row: i
		});
	}
	findAddressedItemRoots(e) {
		let t = e[e.length - 1];
		return typeof t == "string" ? [...this.options.root.querySelectorAll(`[${b}="${Ji(t)}"]`)].filter((t) => this.isItemRoot(t) && ja(t, e)) : [];
	}
	applyItemValue(e, t, n) {
		let r = e.closest(`[${x}]`), i = r === null ? null : Va(r);
		if (r !== null && i !== null && W(r) === "virtualized") {
			let a = e.getAttribute(b);
			a !== null && this.applyVirtualizedValue(r, i, a, t, n);
			return;
		}
		this.options.renderer.updateItemValue(e, t.steps, n);
		let a = CX(vX, t);
		a && gX(e, this.options.renderer.getItemValue(e)), this.restampAbilities(e, t), r !== null && i !== null && (a || this.feedsRule(r, i, t)) && this.sync(r, i, e);
	}
	restampAbilities(e, t) {
		pX.some(([e]) => CX(e, t)) && hX(e, this.options.renderer.getItemValue(e));
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
		if (this.options.templates.getGroupTemplate(t) !== void 0 && CX(vX, n)) return !0;
		let r = this.options.metadata.getItemsFilterSortMetadata(t);
		if (r !== void 0 && (r.filters.some((e) => CX(e.itemProperty, n)) || r.sorts.some((e) => CX(e.itemProperty, n)))) return !0;
		let i = tk(e);
		return (i?.filters ?? []).some((e) => CX(e.itemProperty, n)) || (i?.sorts ?? []).some((e) => CX(e.itemProperty, n));
	}
	syncComponentHosts(e) {
		for (let t of this.options.root.querySelectorAll(`[${x}]`)) {
			let n = Va(t);
			n === e && this.sync(t, n);
		}
	}
};
function bX(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t);
}
function xX(e, t) {
	let n = ha(e), r = n === "Value" ? !im(e.value ?? null, t.value) : n === "Validation" && (e.message ?? null) !== null, i = e.address, a = i?.component?.dynamicParameters ?? [];
	return r && w(i?.component?.id) === w(t.reference.componentId) && ma(i?.property) === t.propertyName && a.length <= t.dynamicParameters.length && a.every((e, n) => String(e ?? "") === String(t.dynamicParameters[n] ?? ""));
}
function SX(e, t) {
	let n = Aa(e, ka(e));
	return t.length === n.length + 1 && n.every((e, n) => String(e ?? "") === String(t[n] ?? ""));
}
function CX(e, t) {
	let n = t.ruleSegments.join(".");
	return n.length === 0 || e === n || e.startsWith(`${n}.`);
}
//#endregion
//#region src/items/table-row-indices.ts
var wX = "ui-table", TX = "ui-table--no-header";
function EX(e, t, n) {
	let r = e.parentElement, i = r?.parentElement ?? null;
	if (r === null || i === null || !r.classList.contains("ui-table__scroll") || !i.classList.contains(wX)) return;
	let a = [], o = [], s = !1;
	for (let t of r.children) t === e ? s = !0 : t.getAttribute("role") === "row" && !(t === r.firstElementChild && i.classList.contains(TX)) && (s ? o : a).push(t);
	a.forEach((e, t) => DX(e, t));
	for (let [e, n] of t) DX(e, a.length + n);
	n !== null && o.forEach((e, t) => DX(e, a.length + n + t)), C(i, "aria-rowcount", n === null ? "-1" : String(a.length + n + o.length));
}
function DX(e, t) {
	C(e, "aria-rowindex", String(t + 1));
}
//#endregion
//#region src/items/items-window-engine.ts
var OX = 50, kX = 1, AX = .5, jX = 60, MX = "--ui-window-look", NX = "--ui-window-row", PX = "--ui-window-tile", FX = 3, IX = "page", LX = class {
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
			this.noteShownRow(t), this.layout(t), XX(t) === 0 ? this.getState(t).pending || this.requestAsync(t, "Start", 0, null, !1) : n ? this.revealWindow(t) : (this.realign(t), this.considerRequest(t));
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
		t !== null && (Xu(e, t), this.noteShownRow(e));
	}
	windowTop(e) {
		if (e.hasAttribute("data-ui-window-paged")) return null;
		let t = vO(e, $t);
		return t !== null && Vq(e) && yO(e, "data-ui-window-more-after") ? Math.max(0, this.windowBottom(e, t) - Yu(e).height) : t === null || t === 0 ? null : yO(e, "data-ui-window-more-after") ? t * this.getState(e).itemSize : e.scrollHeight;
	}
	windowBottom(e, t) {
		let n = YX(e), r = this.getState(e).itemSize, i = n.length === 0 ? 0 : Qu(n[n.length - 1]).bottom - Qu(n[0]).top;
		return t * r + (i > 0 ? i : n.length * r);
	}
	noteShownRow(e) {
		this.getState(e).shown = qX(e, YX(e));
	}
	noteShownRows() {
		for (let e of this.held) e.isConnected ? e.hasAttribute("data-ui-window-paged") || this.noteShownRow(e) : this.held.delete(e);
	}
	sync(e) {
		if (e.length !== 0) for (let t of this.hosts()) e.some((e) => e.contains(t) || t.contains(e)) && (this.layout(t), this.getState(t).pending || this.realign(t));
	}
	realign(e) {
		let t = vO(e, $t), n = YX(e);
		if (t === null || n.length === 0 || e.hasAttribute("data-ui-window-paged")) return;
		let r = this.getState(e), i = Yu(e), a = Math.floor(i.top / r.itemSize);
		Math.ceil((i.top + i.height) / r.itemSize) >= t && a <= t + n.length || this.revealWindow(e);
	}
	refilled(e) {
		let t = this.states.get(e);
		t !== void 0 && !t.pending && BX(t);
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
		let t = Ju(e.target);
		if (t === null || W(t) !== "windowed" || t.hasAttribute("data-ui-window-paged")) return;
		let n = this.getState(t);
		n.scheduled === 0 && (this.considerRequest(t), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.considerRequest(t);
		}, jX));
	}
	considerRequest(e) {
		let t = this.getState(e);
		if (t.pending) {
			t.restless = !0;
			return;
		}
		if (e.hasAttribute("data-ui-window-paged") && XX(e) > 0) return;
		let n = YX(e);
		if (n.length === 0) {
			this.requestAsync(e, "Start", 0, null, !1);
			return;
		}
		let r = vO(e, $t), i = yO(e, tn), a = yO(e, nn);
		if (r !== null) {
			let o = this.windowSize(e), s = Yu(e), c = Math.max(1, Math.round(s.height * kX / t.itemSize), Math.floor(o * AX)), l = Math.floor(s.top / t.itemSize), u = Math.ceil((s.top + s.height) / t.itemSize);
			if (u < r || l > r + n.length) {
				this.requestAsync(e, "Offset", this.landingOffset(e, l, o), null, !1);
				return;
			}
			if (l - c <= r && i) {
				this.requestAsync(e, "Before", 0, ZX(n[0]), !0);
				return;
			}
			if (u + c >= r + n.length && a) {
				this.requestAsync(e, "After", 0, ZX(n[n.length - 1]), !0);
				return;
			}
			return;
		}
		let o = Yu(e), s = Math.max(1, o.height * kX), c = o.contentHeight - o.top - o.height;
		o.top <= s && i ? this.requestAsync(e, "Before", 0, ZX(n[0]), !0) : c <= s && a && this.requestAsync(e, "After", 0, ZX(n[n.length - 1]), !0);
	}
	landingOffset(e, t, n) {
		let r = Math.max(0, t - Math.floor(n / 4)), i = vO(e, en);
		return i === null ? r : Math.min(r, Math.max(0, i - n));
	}
	async requestAsync(e, t, n, r, i) {
		let a = Va(e);
		if (a === null) {
			s("a windowed items host is not inside an addressable component.", e);
			return;
		}
		if (r === null && (t === "Before" || t === "After")) return;
		let o = this.getState(e);
		o.pending = !0, o.readingBefore = t === "Before", t === "Start" && BX(o);
		let c = e.closest(S), l = t.toLowerCase();
		e.setAttribute(Xt, l), c?.setAttribute(Xt, e.hasAttribute("data-ui-window-paged") ? IX : l), e.setAttribute("aria-busy", "true"), t === "After" && vO(e, "data-ui-window-total") === null && VX(e) && (MW(e, AW, FX * this.rowSize(e)), HX(e, o));
		let u = vO(e, $t) === null;
		try {
			await this.options.requestWindow({
				componentId: a,
				dynamicParameters: QX(e),
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
			o.pending = !1, e.removeAttribute(Xt), c?.removeAttribute(Xt), e.removeAttribute("aria-busy"), MW(e, AW, 0), this.noteShownRow(e), this.layout(e), o.readingBefore = !1, o.restless || u && WX(e, t, r) ? (o.restless = !1, this.considerRequest(e)) : this.realign(e);
		}
	}
	layout(e) {
		let t = this.getState(e), n = YX(e), r = vO(e, en), i = vO(e, $t);
		if (EX(e, n.map((e, t) => [e, (i ?? 0) + t]), r), e.hasAttribute("data-ui-window-paged")) {
			MW(e, "top", 0), MW(e, kW, 0);
			return;
		}
		if (n.length > 0) {
			let r = Qu(n[n.length - 1]).bottom - Qu(n[0]).top;
			if (r > 0) {
				let i = RX(n), a = Math.ceil(n.length / i);
				e.clientWidth !== t.measuredWidth && (BX(t), t.measuredWidth = e.clientWidth), zX(t, n, i), t.skeletonRow = a > 1 ? (Qu(n[n.length - 1]).top - Qu(n[0]).top) / (a - 1) : r, t.skeletonTile = i > 1 ? Qu(n[1]).left - Qu(n[0]).left : null;
			}
		}
		let a = r === null || i === null ? 0 : i * t.itemSize, o = r === null || i === null ? 0 : Math.max(0, r - i - n.length) * t.itemSize;
		MW(e, "top", a), MW(e, kW, o), HX(e, t), (t.readingBefore || !GX(e)) && KX(e, n, t.shown), Oq(e);
	}
	rowSize(e) {
		let t = this.getState(e);
		return t.skeletonRow > 0 ? UX(t.skeletonRow) : t.itemSize;
	}
	windowSize(e) {
		let t = vO(e, Qt);
		return t !== null && t > 0 ? t : OX;
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
function RX(e) {
	let t = Qu(e[0]).top, n = 1;
	for (; n < e.length && Qu(e[n]).top === t;) n++;
	return n;
}
function zX(e, t, n) {
	for (let r = 0; r < t.length; r++) {
		let i = t[r + n], a = i === void 0 ? t.length <= n ? Qu(t[r]).height : 0 : Qu(i).top - Qu(t[r]).top;
		if (a <= 0) continue;
		let o = a / n;
		IW(e.sizes, e.shares.get(t[r]) ?? null, o), e.shares.set(t[r], o);
	}
	e.sizes.count > 0 && (e.itemSize = Math.max(1, e.sizes.sum / e.sizes.count));
}
function BX(e) {
	e.shares = /* @__PURE__ */ new WeakMap(), e.sizes = {
		sum: 0,
		count: 0
	};
}
function VX(e) {
	return getComputedStyle(e).getPropertyValue(MX).trim() === "skeleton";
}
function HX(e, t) {
	if (t.skeletonRow <= 0) return;
	let n = `${UX(t.skeletonRow)}px`, r = t.skeletonTile !== null && t.skeletonTile > 0 ? `${UX(t.skeletonTile)}px` : "";
	for (let t of e.querySelectorAll(`:scope > [${Yt}]`)) {
		let e = t.style;
		e.getPropertyValue(NX) !== n && e.setProperty(NX, n), e.getPropertyValue(PX) !== r && (r.length === 0 ? e.removeProperty(PX) : e.setProperty(PX, r));
	}
}
function UX(e) {
	return Math.round(e * 100) / 100;
}
function WX(e, t, n) {
	let r = YX(e), i = t === "Before" ? r[0] : t === "After" ? r[r.length - 1] : void 0;
	return i !== void 0 && ZX(i) !== n;
}
function GX(e) {
	let t = vO(e, $t);
	return Yu(e).top <= 0 && (t === null ? !yO(e, "data-ui-window-more-before") : t === 0);
}
function KX(e, t, n) {
	let r = n === null ? void 0 : t.find((e) => ZX(e) === n.key);
	if (n === null || r === void 0) return;
	let i = Qu(r);
	if (i.height <= 0) return;
	let a = Yu(e).top, o = i.top - JX(e) + a - n.at;
	Math.abs(o) >= .5 && Xu(e, a + o);
}
function qX(e, t) {
	let n = JX(e), r = 0, i = t.length;
	for (; r < i;) {
		let e = Math.floor((r + i) / 2);
		Qu(t[e]).bottom > n ? i = e : r = e + 1;
	}
	let a = t.at(r), o = a === void 0 ? null : ZX(a);
	if (a === void 0 || o === null) return null;
	let s = Qu(a), c = Yu(e);
	return s.height <= 0 || s.top >= n + c.height ? null : {
		key: o,
		at: s.top - n + c.top
	};
}
function JX(e) {
	let t = qu(e);
	return t.getBoundingClientRect().top + t.clientTop;
}
function YX(e) {
	return [...e.children].filter((e) => e.hasAttribute(b));
}
function XX(e) {
	return YX(e).length;
}
function ZX(e) {
	return e.getAttribute(b);
}
function QX(e) {
	let t = e.closest(S);
	return t === null ? [] : Aa(t, ka(t));
}
//#endregion
//#region src/items/items-composite-renderer.ts
var $X = [
	y,
	ie,
	ae
];
function eZ(e, t, n, r, i, a, o) {
	let c = document.createElement(e.itemElementName);
	c.className = e.itemClassName, tZ(c, e.itemRole);
	let l = rZ(c, e, t, a);
	l !== 0 && o.populateElement(c, n, l, i);
	for (let l of e.slots) {
		let e = nZ(l, t, n, a);
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
		d.className = l.wrapperClassName, tZ(d, l.wrapperRole);
		for (let [e, t] of Object.entries(l.wrapperAttributes ?? {})) d.setAttribute(e, t);
		d.appendChild(u), fX(d, r, n), c.appendChild(d);
	}
	return fX(c, r, n), o.registerItemScope(c, l, n), c;
}
function tZ(e, t) {
	t != null && t.length > 0 && e.setAttribute("role", t);
}
function nZ(e, t, n, r) {
	let i = _X(n, e.variantKeyPropertyName);
	if (i !== null && i.length > 0) {
		let n = r.getVariantTemplate(t, `${e.variantKey}:${i}`);
		if (n !== void 0) return n;
	}
	return r.getVariantTemplate(t, e.variantKey);
}
function rZ(e, t, n, r) {
	let i = t.hostSlotVariantKey;
	if (i == null || i.length === 0) return 0;
	let a = r.getVariantTemplate(n, i)?.content.firstElementChild ?? null;
	if (a === null) return s("composite item host slot template was not found.", {
		componentId: n,
		hostSlotVariantKey: i
	}), 0;
	for (let t of $X) {
		let n = a.getAttribute(t);
		n !== null && e.setAttribute(t, n);
	}
	for (let t of Array.from(a.attributes)) t.name.startsWith("data-ui-bind-") && e.setAttribute(t.name, t.value);
	return e instanceof HTMLElement && (e.style.alignSelf = "stretch", e.style.justifySelf = "stretch"), T(a);
}
//#endregion
//#region src/items/items-row-renderer.ts
function iZ(e, t, n, r, i) {
	let a = i.metadata.getItemsTemplateMetadata(e), o = a?.composite;
	if (o == null) return aZ(i.renderer.renderItem(e, t, n, r), a);
	let s = eZ(o, e, t, n, r, i.templates, i.renderer);
	return s !== null && a?.rowDecorator && i.renderer.decorateRow(a.rowDecorator, s, t, n, e, r), aZ(s, a);
}
function aZ(e, t) {
	return e === null ? null : (t?.announcesSelection === !0 && !e.hasAttribute("aria-selected") && e.setAttribute("aria-selected", "false"), Hc(e), e);
}
//#endregion
//#region src/items/items-virtualization-engine.ts
var oZ = 6, sZ = 60, cZ = class {
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
		return r === void 0 || i < 0 || a < 0 ? null : r.slice(Math.min(i, a), Math.max(i, a) + 1).filter((e) => fZ(e.entry) === !1).map((e) => e.entry.key);
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
		if (!gZ(e) && !mZ(e)) return a.element;
		let o = getComputedStyle(e), s = yZ(o), c = r.projected.map((e) => this.pitchOf(r, e) + s), l = gZ(e) ? _Z(r.projected, c, r.across) : null, u = l === null ? i : hZ(l.starts, i), d = l?.pitches ?? c, f = bZ(o.paddingTop) + xZ(d, 0, u), p = f + d[u] - s, m = Yu(e), h = n === "start" || n === "nearest" && f < m.top ? f : n === "end" || p > m.top + m.height ? p - m.height : null;
		return h !== null && Xu(e, Math.max(0, h)), this.layout(e, r), a.element;
	}
	sync(e) {
		let t = this.getState(e);
		if (t === null) return;
		let n = Vq(e) && Uq(e), r = t.projected;
		this.project(e, t), this.keepCursorShown(e, t, r), this.layout(e, t), n && !Uq(e) && (Xu(e, e.scrollHeight), this.layout(e, t));
	}
	refill(e, t) {
		let n = this.getState(e);
		if (n === null) return [];
		let r = new Map(n.byKey), i = [], a = /* @__PURE__ */ new Map(), o = [];
		for (let { key: n, item: s } of t) {
			let t = r.get(n);
			if (r.delete(n), t !== void 0 && im(t.item, s)) {
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
		return t === null ? null : lZ(t) ? (this.keptAsDrawn.add(t), t) : (this.dropRow(e, t), null);
	}
	dropRow(e, t) {
		if (t === null) return;
		let n = Rf(t);
		t.remove(), zf(e, null, n);
	}
	keepCursorShown(e, t, n) {
		let r = Lf(e), i = t.entries.find((e) => e.element?.hasAttribute("data-ui-row-focus") === !0) ?? null, a = i?.key ?? (r === null ? null : Vf(r));
		if (r === null || a === null) return;
		let o = /* @__PURE__ */ new Set();
		for (let e of t.projected) e.header || o.add(e.entry.key);
		if (o.has(a)) return;
		let s = n.filter((e) => !e.header).map((e) => e.entry), c = s.findIndex((e) => e.key === a), l = c < 0 ? void 0 : s.slice(c + 1).find((e) => o.has(e.key)) ?? s.slice(0, c).reverse().find((e) => o.has(e.key));
		i?.element?.removeAttribute(Ne), l === void 0 ? (r.removeAttribute(Pe), r.removeAttribute("aria-activedescendant")) : l.element instanceof HTMLElement ? of(r, G(e).filter((e) => e instanceof HTMLElement), l.element, null, !1) : (r.setAttribute(Pe, l.key), r.removeAttribute("aria-activedescendant"));
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
		let a = Lf(e), o = a === null || i.size === 0 ? null : Nf(a, G(e), i);
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
		return i === null || a === void 0 ? !1 : (a.item = uX(a.item, n, r), i.version++, n.length === 0 && (a.element = this.renewRow(e, a.element)), !0);
	}
	project(e, t) {
		let n = this.options.metadata.getItemsFilterSortMetadata(t.componentId), r = tk(e), i = this.options.templates.getGroupTemplate(t.componentId), a = sk(n, this.options.state, r), o = t.entries;
		if (t.version++, (n !== void 0 && n.filters.length > 0 || (r?.filters ?? []).length > 0) && (o = o.filter((e) => ak(n, e.item, this.options.state, r))), !(i !== void 0 && o.some((e) => pZ(e) !== ""))) {
			a.length > 0 && (o = [...o].sort((e, t) => lk(e.item, t.item, a))), t.projected = o.map((e) => ({
				entry: e,
				header: !1
			}));
			return;
		}
		let { buckets: s, order: c } = TW(o, pZ), l = [];
		for (let e of c) {
			let t = s.get(e);
			a.length > 0 && (t = [...t].sort((e, t) => lk(e.item, t.item, a))), e !== "" && l.push({
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
		let t = Ju(e.target);
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
		}, sZ));
	}
	layout(e, t) {
		let n = t.projected, r = getComputedStyle(e), i = yZ(r), a = n.map((e) => this.pitchOf(t, e) + i), o = n.length, s = t.across, c = gZ(e) ? _Z(n, a, s) : null, l = c?.pitches ?? a, u = l.length, d = 0, f = u;
		if ((c !== null || mZ(e)) && u > 0) {
			let i = bZ(r.paddingTop), a = Yu(e), o = uZ(e, t, n, l, s, a.top - i, i), c = o + a.height, p = 0;
			d = u;
			for (let e = 0; e < u; e++) {
				let t = p + l[e];
				if (d === u && t > o && (d = e), p >= c) {
					f = e;
					break;
				}
				p = t;
			}
			d === u && (d = Math.max(0, u - 1)), d = Math.max(0, d - oZ), f = Math.min(u, f + oZ);
		}
		let p = c === null ? d : c.starts[d] ?? o, m = c === null ? f : f < u ? c.starts[f] : o, h = this.options.renderer.getAncestorStack(e), g = [], _ = [], v = -1, ee = !1, te = document.activeElement, ne = null;
		for (let r = 0; r < o; r++) {
			let i = n[r];
			i.header || v++;
			let a = r >= p && r < m, o = (i.header ? t.headers.get(pZ(i.entry)) ?? null : i.entry)?.element ?? null, s = o !== null && te !== null && o.contains(te);
			if (o !== null && !s && this.keptAsDrawn.has(o) && (this.keptAsDrawn.delete(o), this.dropRow(e, o), dZ(t, i, null), o = null, ee = !0), !a) {
				if (o !== null && !i.header && s) {
					ne = {
						element: o,
						line: c === null ? r : hZ(c.starts, r)
					}, _.push([o, v]);
					continue;
				}
				o !== null && (this.dropRow(e, o), dZ(t, i, null), ee = !0);
				continue;
			}
			if (o !== null) {
				i.header && OW(o, i.entry.key), g.push(o), i.header || _.push([o, v]);
				continue;
			}
			let l = i.header ? this.renderHeader(t, i.entry, h) : this.renderRow(t, i.entry, h);
			l !== null && (i.header || Bf(e, l), dZ(t, i, l), g.push(l), i.header || _.push([l, v]), ee = !0);
		}
		let re = new Set(g);
		ne !== null && re.add(ne.element);
		for (let n of t.entries) n.element !== null && !re.has(n.element) && (this.dropRow(e, n.element), n.element = null, ee = !0);
		for (let t of G(e)) re.has(t) || (this.dropRow(e, t), ee = !0);
		for (let t of e.querySelectorAll(`:scope > [${Ft}]`)) re.has(t) || (t.remove(), ee = !0);
		for (let e of t.headers.values()) e.element !== null && !re.has(e.element) && (e.element = null);
		let y = ne !== null && ne.line < d ? ne : null, ie = ne !== null && ne.line >= f ? ne : null, ae = xZ(l, 0, y?.line ?? d), b = xZ(l, ie === null ? f : ie.line + 1, u), oe = ne === null ? 0 : y === null ? xZ(l, f, ne.line) : xZ(l, y.line + 1, d), se = FW(e, oe > 0 ? oe - i : 0);
		LW(e, [...y === null ? ie === null ? g : [
			...g,
			...NO(se),
			ie.element
		] : [
			y.element,
			...NO(se),
			...g
		], ...NO(PO(e))]), MW(e, "top", ae > 0 ? ae - i : 0), MW(e, kW, b > 0 ? b - i : 0), FO(e, t.componentId, this.options.templates, this.options.renderer, o > 0), EX(e, _, v + 1), (ee || t.first !== p || t.last !== m) && (t.first = p, t.last = m, this.options.dom.invalidate(e)), t.laidOut = n, t.pitches = l, t.laidAcross = s, t.keptOutOfRange = ne?.element ?? null, t.firstLine = d, t.lastLine = f, this.measure(t, n, p, m), c !== null && (t.across = vZ(e, r, t.tileWidth) ?? t.across, t.across !== s && this.layout(e, t));
	}
	renderRow(e, t, n) {
		return iZ(e.componentId, t.item, t.key, n, this.options);
	}
	renderHeader(e, t, n) {
		let r = this.options.templates.getGroupTemplate(e.componentId);
		return r === void 0 ? null : DW(r, this.options.renderer, t.item, t.key, n);
	}
	measure(e, t, n, r) {
		let i = 0;
		for (let a = n; a < r && a < t.length; a++) {
			let n = t[a], r = n.header ? e.headers.get(pZ(n.entry)) : n.entry, o = r?.element;
			if (r == null || o == null) continue;
			let s = Qu(o);
			s.height <= 0 || (IW(n.header ? e.headerHeights : e.itemHeights, r.height, s.height), r.height = s.height, n.header || (i = Math.max(i, s.width)));
		}
		i > 0 && (e.tileWidth = i), e.itemHeights.count > 0 && (e.itemEstimate = e.itemHeights.sum / e.itemHeights.count), e.headerHeights.count > 0 && (e.headerEstimate = e.headerHeights.sum / e.headerHeights.count);
	}
	pitchOf(e, t) {
		return t.header ? e.headers.get(pZ(t.entry))?.height ?? e.headerEstimate : t.entry.height ?? e.itemEstimate;
	}
	getState(e) {
		let t = this.states.get(e);
		if (t !== void 0) return this.held.add(e), t;
		let n = Ha(e);
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
function lZ(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t);
}
function uZ(e, t, n, r, i, a, o) {
	if (t.laidOut !== n || t.laidAcross !== i || t.pitches.length !== r.length || a <= 0) return a;
	let s = 0, c = 0;
	for (let e = 0; e < r.length; e++) {
		let n = e >= t.firstLine && e < t.lastLine ? r[e] : t.pitches[e];
		if (s + n > a) break;
		s += n, c += r[e];
	}
	let l = c - s;
	return Math.abs(l) < .5 ? a : (Xu(e, a + l + o), a + l);
}
function dZ(e, t, n) {
	if (!t.header) {
		t.entry.element = n;
		return;
	}
	let r = pZ(t.entry), i = e.headers.get(r);
	i === void 0 ? e.headers.set(r, {
		element: n,
		height: null
	}) : i.element = n;
}
function fZ(e) {
	let t = KO(e.item, "CanSelect");
	return t.ok && t.value === !1;
}
function pZ(e) {
	let t = KO(e.item, "Group");
	return t.ok && typeof t.value == "string" ? t.value : "";
}
function mZ(e) {
	let t = e.parentElement;
	return t !== null && (t.classList.contains("ui-table__scroll") || t.classList.contains("ui-items-view--stack") && t.classList.contains("ui-orientation--vertical"));
}
function hZ(e, t) {
	let n = 0;
	for (; n + 1 < e.length && e[n + 1] <= t;) n++;
	return n;
}
function gZ(e) {
	return e.parentElement?.classList.contains("ui-items-view--wrap") === !0;
}
function _Z(e, t, n) {
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
function vZ(e, t, n) {
	let r = e.clientWidth - bZ(t.paddingLeft) - bZ(t.paddingRight);
	if (n === null || n <= 0 || r <= 0) return null;
	let i = bZ(t.columnGap);
	return Math.max(1, Math.floor((r + i + .5) / (n + i)));
}
function yZ(e) {
	return bZ(e.rowGap);
}
function bZ(e) {
	let t = Number.parseFloat(e);
	return Number.isFinite(t) ? t : 0;
}
function xZ(e, t, n) {
	let r = 0;
	for (let i = t; i < n; i++) r += e[i];
	return r;
}
//#endregion
//#region src/items/items-template-registry.ts
var SZ = "data-ui-template", CZ = "default", wZ = class {
	dom;
	templateComponentIds = null;
	constructor(e) {
		this.dom = e;
	}
	getTemplate(e, t) {
		let n = t ?? CZ, r = this.findTemplate(e, n);
		return r === void 0 ? n === CZ ? void 0 : this.getTemplate(e, null) : r;
	}
	getVariantTemplate(e, t) {
		return this.findTemplate(e, t);
	}
	findTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		return n === null ? void 0 : TZ(n, SZ, t);
	}
	isTemplateComponent(e) {
		return this.templateComponentIds ??= EZ(this.dom.root), this.templateComponentIds.has(e);
	}
	getEmptyTemplate(e) {
		return this.getMarkedTemplate(e, Mt);
	}
	getGroupTemplate(e) {
		return this.getMarkedTemplate(e, Nt);
	}
	getMarkedTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		return n === null ? void 0 : TZ(n, t, null);
	}
};
function TZ(e, t, n) {
	for (let r of e.children) if (r.localName === "template" && (n === null ? r.hasAttribute(t) : r.getAttribute(t) === n)) return r;
}
function EZ(e) {
	let t = /* @__PURE__ */ new Set();
	return Rc(e, (n) => {
		if (n !== e) for (let e of n.querySelectorAll(S)) {
			let n = T(e);
			n > 0 && t.add(n);
		}
	}), t;
}
//#endregion
//#region src/items/row-menus.ts
var DZ = `:scope > ${`template[${Te}]`}`, OZ = class {
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
			this.components.has(e) && AZ(t.item, this.chordSet);
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
		let t = e.querySelector(DZ);
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
			let e = [...t, ...kZ(r)];
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
		this.taken.add(e), this.declared.add(r), Rc(e.content, (e) => {
			if (i) for (let n of e.querySelectorAll(S)) this.components.set(T(n), t), this.menuOf.set(T(n), r);
			for (let t of e.querySelectorAll(`[${Un}]`)) {
				let e = t.getAttribute("data-ui-shortcut")?.trim() ?? "";
				e.length > 0 && this.writtenChords.add(e);
			}
		}), (e.parentElement?.hasAttribute("data-ui-context-menu-later") !== !0 || n !== null) && (n !== null && n.after(e), Number.isInteger(r) && r > 0 && this.shared.set(r, e));
	}
};
function kZ(e) {
	let t = [];
	for (let n = e.parentElement?.closest("[data-ui-items-host]") ?? null; n !== null; n = n.parentElement?.closest("[data-ui-items-host]") ?? null) {
		let e = Va(n);
		e !== null && t.unshift(e);
	}
	return t;
}
function AZ(e, t) {
	let n = KO(e, "Shortcut");
	n.ok && typeof n.value == "string" && n.value.trim().length > 0 && t.add(n.value.trim());
	let r = KO(e, "Items");
	if (r.ok && Array.isArray(r.value)) for (let e of r.value) AZ(e, t);
}
//#endregion
//#region src/rendering/theme-colors.ts
function jZ(e, t) {
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
var MZ = "script[type='application/json'][data-ui-metadata]";
function NZ(e = document) {
	let t = e.querySelector(MZ);
	if (t === null) return PZ();
	let n = t.textContent?.trim() ?? "";
	if (n.length === 0) return PZ();
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
function PZ() {
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
var FZ = "script[type='application/json'][data-ui-hydration]";
function IZ(e) {
	return e !== null && (cc(e.title) || cc(e.changes));
}
function LZ(e = document) {
	let t = e.querySelector(FZ)?.textContent?.trim() ?? "";
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
var RZ = "reconnecting";
async function zZ(e, t, n, r) {
	for (let i = 0;; i++) try {
		return await e();
	} catch (e) {
		if (t()) return s("attaching the runtime failed as the connection dropped again; the reconnect attaches.", e), RZ;
		if (i >= n.length) return c("attaching the runtime failed after retrying; giving up.", e), null;
		s("attaching the runtime failed; retrying.", {
			attempt: i + 1,
			error: e
		}), await r(n[i]);
	}
}
//#endregion
//#region src/transport/reader-time-zone.ts
function BZ(e = () => Intl.DateTimeFormat().resolvedOptions().timeZone) {
	try {
		let t = e();
		return typeof t == "string" && t.length > 0 ? t : null;
	} catch {
		return null;
	}
}
function VZ(e, t, n) {
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
var HZ = "/_ne/", UZ = 3e3;
function WZ(e, t, n) {
	let r = e.getAttribute(Br);
	if (r === null || !("serviceWorker" in navigator)) return;
	let i = navigator.serviceWorker;
	if (VZ(i, t, n), e.hasAttribute("data-ui-service-worker-imported")) return () => KZ(i.ready);
	let a = i.register(r, { scope: HZ }).then(GZ).catch((e) => {
		s("registering the notification service worker failed; notifications are the page's own.", e);
	});
	return () => a;
}
function GZ(e) {
	let t = e.installing ?? e.waiting;
	return e.active !== null || t === null ? Promise.resolve(e) : new Promise((n) => {
		t.addEventListener("statechange", () => {
			t.state === "activated" && n(e);
		});
	});
}
function KZ(e) {
	return Promise.race([e, new Promise((e) => setTimeout(() => e(void 0), UZ))]);
}
//#endregion
//#region src/runtime/reload-guard.ts
var qZ = "ne-standard-ui:reloaded-view";
function JZ(e, t, n) {
	if (!t) return "no-cookie";
	if (ZZ(n) === e) return "asked-again";
	try {
		n?.setItem(qZ, e);
	} catch {}
	return "reload";
}
function YZ(e) {
	try {
		e?.removeItem(qZ);
	} catch {}
}
function XZ() {
	try {
		return window.sessionStorage;
	} catch {
		return null;
	}
}
function ZZ(e) {
	try {
		return e?.getItem(qZ) ?? null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/runtime/window-id.ts
function QZ(e, t) {
	let n = null;
	try {
		n = window.sessionStorage;
	} catch (e) {
		s("session storage is unavailable, so this tab is new on every load.", e);
	}
	return $Z(e, {
		memory: n,
		lifecycle: window,
		openChannel: typeof BroadcastChannel == "function" ? (e) => new BroadcastChannel(e) : null,
		rekeyed: t
	});
}
function $Z(e, t) {
	let n = t.create ?? aQ, r = t.now ?? Date.now, i = t.memory, a = `${e}:claimed`, o = nQ(i, e), s = n(), c = o !== null && o.length > 0 && nQ(i, a) !== o ? o : n(), l = null, u = 0, d = () => {
		rQ(i, e, c), rQ(i, a, c);
	}, f = (e) => {
		e?.kind === "ask" && e.id === c && e.from !== s ? eQ(l, {
			kind: "held",
			id: c,
			to: e.from,
			by: s,
			at: u
		}) : e?.kind === "held" && e.id === c && e.to === s && (e.at < u || e.at === u && e.by < s) && (c = n(), d(), t.rekeyed(c));
	}, p = () => {
		l = tQ(t, e), l?.addEventListener("message", (e) => f(e.data)), u = r(), eQ(l, {
			kind: "ask",
			id: c,
			from: s,
			at: u
		});
	};
	return d(), p(), t.lifecycle.addEventListener("pagehide", () => {
		iQ(i, a), l?.close(), l = null;
	}), t.lifecycle.addEventListener("pageshow", (e) => {
		e.persisted && (d(), p());
	}), c;
}
function eQ(e, t) {
	e?.postMessage(t);
}
function tQ(e, t) {
	try {
		return e.openChannel?.(t) ?? null;
	} catch (e) {
		return s("the channel tabs ask for their ids on could not be opened.", e), null;
	}
}
function nQ(e, t) {
	try {
		return e?.getItem(t) ?? null;
	} catch (e) {
		return s("reading the tab id failed.", e), null;
	}
}
function rQ(e, t, n) {
	try {
		e?.setItem(t, n);
	} catch (e) {
		s("storing the tab id failed.", e);
	}
}
function iQ(e, t) {
	try {
		e?.removeItem(t);
	} catch {}
}
function aQ() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `tab-${typeof crypto < "u" && typeof crypto.getRandomValues == "function" ? [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16))].map((e) => e.toString(16).padStart(2, "0")).join("") : Math.random().toString(16).slice(2).padEnd(16, "0")}-${performance.now().toString(36).replace(".", "")}`;
}
//#endregion
//#region src/runtime/connection-watch.ts
var oQ = 2e3, sQ = class {
	root;
	notifications;
	graceMilliseconds;
	grace = null;
	notice = null;
	given = !1;
	constructor(e) {
		this.root = e.root, this.notifications = e.notifications, this.graceMilliseconds = e.graceMilliseconds ?? oQ, e.connection.onReconnecting(() => this.reconnecting()), e.connection.onReconnected(() => this.reconnected());
	}
	reconnecting() {
		this.given || this.grace !== null || this.notice !== null || (this.grace = window.setTimeout(() => this.showReconnecting(), this.graceMilliseconds));
	}
	showReconnecting() {
		this.grace = null, this.root.setAttribute(Qr, "reconnecting"), this.notice = this.notifications.show({
			message: D.text("ui.connection.reconnecting"),
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
}, cQ = "/_ne/values", lQ = 32768;
lQ / 4;
var uQ = 3e4;
function dQ(e) {
	let t = JSON.stringify(e);
	if (t === void 0 || t.length * 3 <= 8192) return null;
	let n = new TextEncoder().encode(t);
	return n.byteLength > 8192 ? n : null;
}
function fQ(e) {
	return e?.updates?.some((e) => typeof e.valueToken == "string") === !0;
}
async function pQ(e, t = null, n = uQ) {
	if (e === void 0 || !fQ(e)) return e;
	await sy.settled();
	let r = await Promise.all((e.updates ?? []).map(async (e) => {
		let r = e.valueToken;
		if (typeof r != "string") return e;
		let i = t === null ? "" : `?instance=${encodeURIComponent(t)}`, a = await fetch(`${cQ}/${encodeURIComponent(r)}${i}`, {
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
async function mQ(e) {
	await sy.settled();
	let t = await fetch(cQ, {
		method: "POST",
		body: e,
		headers: { "Content-Type": "application/json" },
		credentials: "same-origin",
		signal: AbortSignal.timeout(uQ)
	});
	if (!t.ok) throw Error(`Staging a large value failed with status ${t.status}.`);
	let n = (await t.json())?.token;
	if (n === void 0 || n.length === 0) throw Error("Staging a large value answered with no token.");
	return n;
}
//#endregion
//#region src/transport/command-dispatcher.ts
var hQ = class {
	transport;
	pendingKeys = /* @__PURE__ */ new Set();
	nextRequestId = 1;
	awaited = /* @__PURE__ */ new Map();
	staging = null;
	constructor(e) {
		this.transport = e;
	}
	isPending(e) {
		return this.pendingKeys.has(gQ(_Q(e)));
	}
	async dispatchAsync(e) {
		let t = _Q(e), n = gQ(t);
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
		let t = dQ(e.dynamicParameters);
		if (t === null && this.staging === null) return this.transport.processEventAsync(e);
		let n = this.staging, r = t === null ? null : mQ(t), i = () => {}, a = new Promise((e) => {
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
function gQ(e) {
	return e.action === void 0 ? `${JSON.stringify(e.eventId)}:${JSON.stringify(e.dynamicParameters ?? [])}` : `action:${e.action}`;
}
function _Q(e) {
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
var vQ = class {
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
async function yQ(e, t) {
	try {
		await e();
	} finally {
		t();
	}
}
//#endregion
//#region src/state/property-state-store.ts
var bQ = class {
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
		let i = this.createKey(e, t), a = this.values.get(i), o = a !== void 0 && im(a.value, n);
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
		let r = xQ(e, t);
		for (let e of n) this.forgetRow(r, e), this.forgetUnplaced(pa([...t, e]));
	}
	forgetHost(e, t) {
		this.forgetScope(xQ(e, t));
		let n = this.unplaced.get(pa(t));
		for (let e of [...n?.children ?? []]) this.forgetUnplaced(e);
	}
	clear() {
		this.values.clear(), this.scopes.clear(), this.unplaced.clear(), this.unplacedPathByEntry.clear();
	}
	recordRows(e, t) {
		let n = null;
		for (let [r, i] of t.entries()) {
			let t = xQ(i.host, i.hostParameters), a = this.rowState(t, i.key);
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
		let n = this.unplacedNode(pa([]), null), r = "";
		for (let e = 1; e <= t.length; e++) r = pa(t.slice(0, e)), n.children.add(r), n = this.unplacedNode(r, pa(t.slice(0, e - 1)));
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
		return `${w(e.componentId)}:${e.propertyId}:${pa(t)}`;
	}
};
function xQ(e, t) {
	return `${e}:${pa(t)}`;
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Errors.js
var SQ = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(`${e}: Status code '${t}'`), this.statusCode = t, this.__proto__ = n;
	}
}, CQ = class extends Error {
	constructor(e = "A timeout occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, wQ = class extends Error {
	constructor(e = "An abort occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, TQ = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "UnsupportedTransportError", this.__proto__ = n;
	}
}, EQ = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "DisabledTransportError", this.__proto__ = n;
	}
}, DQ = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "FailedToStartTransportError", this.__proto__ = n;
	}
}, OQ = class extends Error {
	constructor(e) {
		let t = new.target.prototype;
		super(e), this.errorType = "FailedToNegotiateWithServerError", this.__proto__ = t;
	}
}, kQ = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.innerErrors = t, this.__proto__ = n;
	}
}, AQ = class {
	constructor(e, t, n) {
		this.statusCode = e, this.statusText = t, this.content = n;
	}
}, jQ = class {
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
var MQ = class {
	constructor() {}
	log(e, t) {}
};
MQ.instance = new MQ();
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/pkg-version.js
var NQ = "10.0.11", X = class {
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
function PQ(e, t) {
	let n = "";
	return IQ(e) ? (n = `Binary data of length ${e.byteLength}`, t && (n += `. Content: '${FQ(e)}'`)) : typeof e == "string" && (n = `String data of length ${e.length}`, t && (n += `. Content: '${e}'`)), n;
}
function FQ(e) {
	let t = new Uint8Array(e), n = "";
	return t.forEach((e) => {
		n += `0x${e < 16 ? "0" : ""}${e.toString(16)} `;
	}), n.substring(0, n.length - 1);
}
function IQ(e) {
	return e && typeof ArrayBuffer < "u" && (e instanceof ArrayBuffer || e.constructor && e.constructor.name === "ArrayBuffer");
}
async function LQ(e, t, n, r, i, a) {
	let o = {}, [s, c] = VQ();
	o[s] = c, e.log(Y.Trace, `(${t} transport) sending data. ${PQ(i, a.logMessageContent)}.`);
	let l = IQ(i) ? "arraybuffer" : "text", u = await n.post(r, {
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
function RQ(e) {
	return e === void 0 ? new BQ(Y.Information) : e === null ? MQ.instance : e.log === void 0 ? new BQ(e) : e;
}
var zQ = class {
	constructor(e, t) {
		this._subject = e, this._observer = t;
	}
	dispose() {
		let e = this._subject.observers.indexOf(this._observer);
		e > -1 && this._subject.observers.splice(e, 1), this._subject.observers.length === 0 && this._subject.cancelCallback && this._subject.cancelCallback().catch((e) => {});
	}
}, BQ = class {
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
function VQ() {
	let e = "X-SignalR-User-Agent";
	return Z.isNode && (e = "User-Agent"), [e, HQ(NQ, UQ(), GQ(), WQ())];
}
function HQ(e, t, n, r) {
	let i = "Microsoft SignalR/", a = e.split(".");
	return i += `${a[0]}.${a[1]}`, i += ` (${e}; `, i += t && t !== "" ? `${t}; ` : "Unknown OS; ", i += `${n}`, i += r ? `; ${r}` : "; Unknown Runtime Version", i += ")", i;
}
/*#__PURE__*/ function UQ() {
	if (Z.isNode) switch (process.platform) {
		case "win32": return "Windows NT";
		case "darwin": return "macOS";
		case "linux": return "Linux";
		default: return process.platform;
	}
	else return "";
}
/*#__PURE__*/ function WQ() {
	if (Z.isNode) return process.versions.node;
}
function GQ() {
	return Z.isNode ? "NodeJS" : "Browser";
}
function KQ(e) {
	return e.stack ? e.stack : e.message ? e.message : `${e}`;
}
function qQ() {
	if (typeof globalThis < "u") return globalThis;
	if (typeof self < "u") return self;
	if (typeof window < "u") return window;
	if (typeof global < "u") return global;
	throw Error("could not find global");
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js
var JQ = class extends jQ {
	constructor(t) {
		if (super(), this._logger = t, typeof fetch > "u" || Z.isNode) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._jar = new (t("tough-cookie")).CookieJar(), this._fetchType = typeof fetch > "u" ? t("node-fetch") : fetch, this._fetchType = t("fetch-cookie")(this._fetchType, this._jar);
		} else this._fetchType = fetch.bind(qQ());
		if (typeof AbortController > "u") {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._abortControllerType = t("abort-controller");
		} else this._abortControllerType = AbortController;
	}
	async send(e) {
		if (e.abortSignal && e.abortSignal.aborted) throw new wQ();
		if (!e.method) throw Error("No method defined.");
		if (!e.url) throw Error("No url defined.");
		let t = new this._abortControllerType(), n;
		e.abortSignal && (e.abortSignal.onabort = () => {
			t.abort(), n = new wQ();
		});
		let r = null;
		if (e.timeout) {
			let i = e.timeout;
			r = setTimeout(() => {
				t.abort(), this._logger.log(Y.Warning, "Timeout from HTTP request."), n = new CQ();
			}, i);
		}
		e.content === "" && (e.content = void 0), e.content && (e.headers = e.headers || {}, IQ(e.content) ? e.headers["Content-Type"] = "application/octet-stream" : e.headers["Content-Type"] = "text/plain;charset=UTF-8");
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
		if (!i.ok) throw new SQ(await YQ(i, "text") || i.statusText, i.status);
		let a = await YQ(i, e.responseType);
		return new AQ(i.status, i.statusText, a);
	}
	getCookieString(e) {
		let t = "";
		return Z.isNode && this._jar && this._jar.getCookies(e, (e, n) => t = n.join("; ")), t;
	}
};
function YQ(e, t) {
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
var XQ = class extends jQ {
	constructor(e) {
		super(), this._logger = e;
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new wQ()) : e.method ? e.url ? new Promise((t, n) => {
			let r = new XMLHttpRequest();
			r.open(e.method, e.url, !0), r.withCredentials = e.withCredentials === void 0 || e.withCredentials, r.setRequestHeader("X-Requested-With", "XMLHttpRequest"), e.content === "" && (e.content = void 0), e.content && (IQ(e.content) ? r.setRequestHeader("Content-Type", "application/octet-stream") : r.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"));
			let i = e.headers;
			i && Object.keys(i).forEach((e) => {
				r.setRequestHeader(e, i[e]);
			}), e.responseType && (r.responseType = e.responseType), e.abortSignal && (e.abortSignal.onabort = () => {
				r.abort(), n(new wQ());
			}), e.timeout && (r.timeout = e.timeout), r.onload = () => {
				e.abortSignal && (e.abortSignal.onabort = null), r.status >= 200 && r.status < 300 ? t(new AQ(r.status, r.statusText, r.response || r.responseText)) : n(new SQ(r.response || r.responseText || r.statusText, r.status));
			}, r.onerror = () => {
				this._logger.log(Y.Warning, `Error from HTTP request. ${r.status}: ${r.statusText}.`), n(new SQ(r.statusText, r.status));
			}, r.ontimeout = () => {
				this._logger.log(Y.Warning, "Timeout from HTTP request."), n(new CQ());
			}, r.send(e.content);
		}) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
}, ZQ = class extends jQ {
	constructor(e) {
		if (super(), typeof fetch < "u" || Z.isNode) this._httpClient = new JQ(e);
		else if (typeof XMLHttpRequest < "u") this._httpClient = new XQ(e);
		else throw Error("No usable HttpClient found.");
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new wQ()) : e.method ? e.url ? this._httpClient.send(e) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
	getCookieString(e) {
		return this._httpClient.getCookieString(e);
	}
}, QQ = class e {
	static write(t) {
		return `${t}${e.RecordSeparator}`;
	}
	static parse(t) {
		if (t[t.length - 1] !== e.RecordSeparator) throw Error("Message is incomplete.");
		let n = t.split(e.RecordSeparator);
		return n.pop(), n;
	}
};
QQ.RecordSeparatorCode = 30, QQ.RecordSeparator = String.fromCharCode(QQ.RecordSeparatorCode);
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js
var $Q = class {
	writeHandshakeRequest(e) {
		return QQ.write(JSON.stringify(e));
	}
	parseHandshakeResponse(e) {
		let t, n;
		if (IQ(e)) {
			let r = new Uint8Array(e), i = r.indexOf(QQ.RecordSeparatorCode);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = String.fromCharCode.apply(null, Array.prototype.slice.call(r.slice(0, a))), n = r.byteLength > a ? r.slice(a).buffer : null;
		} else {
			let r = e, i = r.indexOf(QQ.RecordSeparator);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = r.substring(0, a), n = r.length > a ? r.substring(a) : null;
		}
		let r = QQ.parse(t), i = JSON.parse(r[0]);
		if (i.type) throw Error("Expected a handshake response from the server.");
		return [n, i];
	}
}, Q;
(function(e) {
	e[e.Invocation = 1] = "Invocation", e[e.StreamItem = 2] = "StreamItem", e[e.Completion = 3] = "Completion", e[e.StreamInvocation = 4] = "StreamInvocation", e[e.CancelInvocation = 5] = "CancelInvocation", e[e.Ping = 6] = "Ping", e[e.Close = 7] = "Close", e[e.Ack = 8] = "Ack", e[e.Sequence = 9] = "Sequence";
})(Q ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Subject.js
var e$ = class {
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
		return this.observers.push(e), new zQ(this, e);
	}
}, t$ = class {
	constructor(e, t, n) {
		this._bufferSize = 1e5, this._messages = [], this._totalMessageCount = 0, this._waitForSequenceMessage = !1, this._nextReceivingSequenceId = 1, this._latestReceivedSequenceId = 0, this._bufferedByteCount = 0, this._reconnectInProgress = !1, this._protocol = e, this._connection = t, this._bufferSize = n;
	}
	async _send(e) {
		let t = this._protocol.writeMessage(e), n = Promise.resolve();
		if (this._isInvocationMessage(e)) {
			this._totalMessageCount++;
			let e = () => {}, r = () => {};
			IQ(t) ? this._bufferedByteCount += t.byteLength : this._bufferedByteCount += t.length, this._bufferedByteCount >= this._bufferSize && (n = new Promise((t, n) => {
				e = t, r = n;
			})), this._messages.push(new n$(t, this._totalMessageCount, e, r));
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
			if (r._id <= e.sequenceId) t = n, IQ(r._message) ? this._bufferedByteCount -= r._message.byteLength : this._bufferedByteCount -= r._message.length, r._resolver();
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
}, n$ = class {
	constructor(e, t, n, r) {
		this._message = e, this._id = t, this._resolver = n, this._rejector = r;
	}
}, r$ = 3e4, i$ = 15e3, a$ = 1e5, $;
(function(e) {
	e.Disconnected = "Disconnected", e.Connecting = "Connecting", e.Connected = "Connected", e.Disconnecting = "Disconnecting", e.Reconnecting = "Reconnecting";
})($ ||= {});
var o$ = class e {
	static create(t, n, r, i, a, o, s) {
		return new e(t, n, r, i, a, o, s);
	}
	constructor(e, t, n, r, i, a, o) {
		this._nextKeepAlive = 0, this._freezeEventListener = () => {
			this._logger.log(Y.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
		}, X.isRequired(e, "connection"), X.isRequired(t, "logger"), X.isRequired(n, "protocol"), this.serverTimeoutInMilliseconds = i ?? r$, this.keepAliveIntervalInMilliseconds = a ?? i$, this._statefulReconnectBufferSize = o ?? a$, this._logger = t, this._protocol = n, this.connection = e, this._reconnectPolicy = r, this._handshakeProtocol = new $Q(), this.connection.onreceive = (e) => this._processIncomingData(e), this.connection.onclose = (e) => this._connectionClosed(e), this._callbacks = {}, this._methods = {}, this._closedCallbacks = [], this._reconnectingCallbacks = [], this._reconnectedCallbacks = [], this._invocationId = 0, this._receivedHandshakeResponse = !1, this._connectionState = $.Disconnected, this._connectionStarted = !1, this._cachedPingMessage = this._protocol.writeMessage({ type: Q.Ping });
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
			this.connection.features.reconnect && (this._messageBuffer = new t$(this._protocol, this.connection, this._statefulReconnectBufferSize), this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer), this.connection.features.resend = () => {
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
		return this._connectionState = $.Disconnecting, this._logger.log(Y.Debug, "Stopping HubConnection."), this._reconnectDelayHandle ? (this._logger.log(Y.Debug, "Connection stopped during reconnect delay. Done reconnecting."), clearTimeout(this._reconnectDelayHandle), this._reconnectDelayHandle = void 0, this._completeClose(), Promise.resolve()) : (t === $.Connected && this._sendCloseMessage(), this._cleanupTimeout(), this._cleanupPingTimer(), this._stopDuringStartError = e || new wQ("The connection was stopped before the hub handshake could complete."), this.connection.stop(e));
	}
	async _sendCloseMessage() {
		try {
			await this._sendWithProtocol(this._createCloseMessage());
		} catch {}
	}
	stream(e, ...t) {
		let [n, r] = this._replaceStreamingParams(t), i = this._createStreamInvocation(e, t, r), a, o = new e$();
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
						this._logger.log(Y.Error, `Invoke client method threw error: ${KQ(e)}`);
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
							this._logger.log(Y.Error, `Stream callback threw error: ${KQ(e)}`);
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
		this._logger.log(Y.Debug, `HubConnection.connectionClosed(${e}) called while in state ${this._connectionState}.`), this._stopDuringStartError = this._stopDuringStartError || e || new wQ("The underlying connection was closed before the hub handshake could complete."), this._handshakeResolver && this._handshakeResolver(), this._cancelCallbacksWithError(e || /* @__PURE__ */ Error("Invocation canceled due to the underlying connection being closed.")), this._cleanupTimeout(), this._cleanupPingTimer(), this._connectionState === $.Disconnecting ? this._completeClose(e) : this._connectionState === $.Connected && this._reconnectPolicy ? this._reconnect(e) : this._connectionState === $.Connected && this._completeClose(e);
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
				this._logger.log(Y.Error, `Stream 'error' callback called with '${e}' threw error: ${KQ(t)}`);
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
}, s$ = [
	0,
	2e3,
	1e4,
	3e4,
	null
], c$ = class {
	constructor(e) {
		this._retryDelays = e === void 0 ? s$ : [...e, null];
	}
	nextRetryDelayInMilliseconds(e) {
		return this._retryDelays[e.previousRetryCount];
	}
}, l$ = class {};
l$.Authorization = "Authorization", l$.Cookie = "Cookie";
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js
var u$ = class extends jQ {
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
		e.headers ||= {}, this._accessToken ? e.headers[l$.Authorization] = `Bearer ${this._accessToken}` : this._accessTokenFactory && e.headers[l$.Authorization] && delete e.headers[l$.Authorization];
	}
	getCookieString(e) {
		return this._innerClient.getCookieString(e);
	}
}, d$;
(function(e) {
	e[e.None = 0] = "None", e[e.WebSockets = 1] = "WebSockets", e[e.ServerSentEvents = 2] = "ServerSentEvents", e[e.LongPolling = 4] = "LongPolling";
})(d$ ||= {});
var f$;
(function(e) {
	e[e.Text = 1] = "Text", e[e.Binary = 2] = "Binary";
})(f$ ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AbortController.js
var p$ = class {
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
}, m$ = class {
	get pollAborted() {
		return this._pollAbort.aborted;
	}
	constructor(e, t, n) {
		this._httpClient = e, this._logger = t, this._pollAbort = new p$(), this._options = n, this._running = !1, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		if (X.isRequired(e, "url"), X.isRequired(t, "transferFormat"), X.isIn(t, f$, "transferFormat"), this._url = e, this._logger.log(Y.Trace, "(LongPolling transport) Connecting."), t === f$.Binary && typeof XMLHttpRequest < "u" && typeof new XMLHttpRequest().responseType != "string") throw Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
		let [n, r] = VQ(), i = {
			[n]: r,
			...this._options.headers
		}, a = {
			abortSignal: this._pollAbort.signal,
			headers: i,
			timeout: 1e5,
			withCredentials: this._options.withCredentials
		};
		t === f$.Binary && (a.responseType = "arraybuffer");
		let o = `${e}&_=${Date.now()}`;
		this._logger.log(Y.Trace, `(LongPolling transport) polling: ${o}.`);
		let s = await this._httpClient.get(o, a);
		s.statusCode === 200 ? this._running = !0 : (this._logger.log(Y.Error, `(LongPolling transport) Unexpected response code: ${s.statusCode}.`), this._closeError = new SQ(s.statusText || "", s.statusCode), this._running = !1), this._receiving = this._poll(this._url, a);
	}
	async _poll(e, t) {
		try {
			for (; this._running;) try {
				let n = `${e}&_=${Date.now()}`;
				this._logger.log(Y.Trace, `(LongPolling transport) polling: ${n}.`);
				let r = await this._httpClient.get(n, t);
				r.statusCode === 204 ? (this._logger.log(Y.Information, "(LongPolling transport) Poll terminated by server."), this._running = !1) : r.statusCode === 200 ? r.content ? (this._logger.log(Y.Trace, `(LongPolling transport) data received. ${PQ(r.content, this._options.logMessageContent)}.`), this.onreceive && this.onreceive(r.content)) : this._logger.log(Y.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._logger.log(Y.Error, `(LongPolling transport) Unexpected response code: ${r.statusCode}.`), this._closeError = new SQ(r.statusText || "", r.statusCode), this._running = !1);
			} catch (e) {
				this._running ? e instanceof CQ ? this._logger.log(Y.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._closeError = e, this._running = !1) : this._logger.log(Y.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
			}
		} finally {
			this._logger.log(Y.Trace, "(LongPolling transport) Polling complete."), this.pollAborted || this._raiseOnClose();
		}
	}
	async send(e) {
		return this._running ? LQ(this._logger, "LongPolling", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	async stop() {
		this._logger.log(Y.Trace, "(LongPolling transport) Stopping polling."), this._running = !1, this._pollAbort.abort();
		try {
			await this._receiving, this._logger.log(Y.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
			let e = {}, [t, n] = VQ();
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
			i ? i instanceof SQ && (i.statusCode === 404 ? this._logger.log(Y.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.") : this._logger.log(Y.Trace, `(LongPolling transport) Error sending a DELETE request: ${i}`)) : this._logger.log(Y.Trace, "(LongPolling transport) DELETE request accepted.");
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
}, h$ = class {
	constructor(e, t, n, r) {
		this._httpClient = e, this._accessToken = t, this._logger = n, this._options = r, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		return X.isRequired(e, "url"), X.isRequired(t, "transferFormat"), X.isIn(t, f$, "transferFormat"), this._logger.log(Y.Trace, "(SSE transport) Connecting."), this._url = e, this._accessToken && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(this._accessToken)}`), new Promise((n, r) => {
			let i = !1;
			if (t !== f$.Text) {
				r(/* @__PURE__ */ Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
				return;
			}
			let a;
			if (Z.isBrowser || Z.isWebWorker) a = new this._options.EventSource(e, { withCredentials: this._options.withCredentials });
			else {
				let t = this._httpClient.getCookieString(e), n = {};
				n.Cookie = t;
				let [r, i] = VQ();
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
						this._logger.log(Y.Trace, `(SSE transport) data received. ${PQ(e.data, this._options.logMessageContent)}.`), this.onreceive(e.data);
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
		return this._eventSource ? LQ(this._logger, "SSE", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	stop() {
		return this._close(), Promise.resolve();
	}
	_close(e) {
		this._eventSource && (this._eventSource.close(), this._eventSource = void 0, this.onclose && this.onclose(e));
	}
}, g$ = class {
	constructor(e, t, n, r, i, a) {
		this._logger = n, this._accessTokenFactory = t, this._logMessageContent = r, this._webSocketConstructor = i, this._httpClient = e, this.onreceive = null, this.onclose = null, this._headers = a;
	}
	async connect(e, t) {
		X.isRequired(e, "url"), X.isRequired(t, "transferFormat"), X.isIn(t, f$, "transferFormat"), this._logger.log(Y.Trace, "(WebSockets transport) Connecting.");
		let n;
		return this._accessTokenFactory && (n = await this._accessTokenFactory()), new Promise((r, i) => {
			e = e.replace(/^http/, "ws");
			let a, o = this._httpClient.getCookieString(e), s = !1;
			if (Z.isNode || Z.isReactNative) {
				let t = {}, [r, i] = VQ();
				t[r] = i, n && (t[l$.Authorization] = `Bearer ${n}`), o && (t[l$.Cookie] = o), a = new this._webSocketConstructor(e, void 0, { headers: {
					...t,
					...this._headers
				} });
			} else n && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(n)}`);
			a ||= new this._webSocketConstructor(e), t === f$.Binary && (a.binaryType = "arraybuffer"), a.onopen = (t) => {
				this._logger.log(Y.Information, `WebSocket connected to ${e}.`), this._webSocket = a, s = !0, r();
			}, a.onerror = (e) => {
				let t = null;
				t = typeof ErrorEvent < "u" && e instanceof ErrorEvent ? e.error : "There was an error with the transport", this._logger.log(Y.Information, `(WebSockets transport) ${t}.`);
			}, a.onmessage = (e) => {
				if (this._logger.log(Y.Trace, `(WebSockets transport) data received. ${PQ(e.data, this._logMessageContent)}.`), this.onreceive) try {
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
		return this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN ? (this._logger.log(Y.Trace, `(WebSockets transport) sending data. ${PQ(e, this._logMessageContent)}.`), this._webSocket.send(e), Promise.resolve()) : Promise.reject("WebSocket is not in the OPEN state");
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
}, _$ = 100, v$ = class {
	constructor(t, n = {}) {
		if (this._stopPromiseResolver = () => {}, this.features = {}, this._negotiateVersion = 1, X.isRequired(t, "url"), this._logger = RQ(n.logger), this.baseUrl = this._resolveUrl(t), n ||= {}, n.logMessageContent = n.logMessageContent !== void 0 && n.logMessageContent, typeof n.withCredentials == "boolean" || n.withCredentials === void 0) n.withCredentials = n.withCredentials === void 0 || n.withCredentials;
		else throw Error("withCredentials option was not a 'boolean' or 'undefined' value");
		n.timeout = n.timeout === void 0 ? 1e5 : n.timeout;
		let r = null, i = null;
		if (Z.isNode && e !== void 0) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			r = t("ws"), i = t("eventsource");
		}
		!Z.isNode && typeof WebSocket < "u" && !n.WebSocket ? n.WebSocket = WebSocket : Z.isNode && !n.WebSocket && r && (n.WebSocket = r), !Z.isNode && typeof EventSource < "u" && !n.EventSource ? n.EventSource = EventSource : Z.isNode && !n.EventSource && i !== void 0 && (n.EventSource = i), this._httpClient = new u$(n.httpClient || new ZQ(this._logger), n.accessTokenFactory), this._connectionState = "Disconnected", this._connectionStarted = !1, this._options = n, this.onreceive = null, this.onclose = null;
	}
	async start(e) {
		if (e ||= f$.Binary, X.isIn(e, f$, "transferFormat"), this._logger.log(Y.Debug, `Starting connection with transfer format '${f$[e]}'.`), this._connectionState !== "Disconnected") return Promise.reject(/* @__PURE__ */ Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
		if (this._connectionState = "Connecting", this._startInternalPromise = this._startInternal(e), await this._startInternalPromise, this._connectionState === "Disconnecting") {
			let e = "Failed to start the HttpConnection before stop() was called.";
			return this._logger.log(Y.Error, e), await this._stopPromise, Promise.reject(new wQ(e));
		}
		if (this._connectionState !== "Connected") {
			let e = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
			return this._logger.log(Y.Error, e), Promise.reject(new wQ(e));
		}
		this._connectionStarted = !0;
	}
	send(e) {
		return this._connectionState === "Connected" ? (this._sendQueue ||= new b$(this.transport), this._sendQueue.send(e)) : Promise.reject(/* @__PURE__ */ Error("Cannot send data if the connection is not in the 'Connected' State."));
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
				if (this._options.transport === d$.WebSockets) this.transport = this._constructTransport(d$.WebSockets), await this._startTransport(t, e);
				else throw Error("Negotiation can only be skipped when using the WebSocket transport directly.");
			} else {
				let n = null, r = 0;
				do {
					if (n = await this._getNegotiationResponse(t), this._connectionState === "Disconnecting" || this._connectionState === "Disconnected") throw new wQ("The connection was stopped during negotiation.");
					if (n.error) throw Error(n.error);
					if (n.ProtocolVersion) throw Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
					if (n.url && (t = n.url), n.accessToken) {
						let e = n.accessToken;
						this._accessTokenFactory = () => e, this._httpClient._accessToken = e, this._httpClient._accessTokenFactory = void 0;
					}
					r++;
				} while (n.url && r < _$);
				if (r === _$ && n.url) throw Error("Negotiate redirection limit exceeded.");
				await this._createTransport(t, this._options.transport, n, e);
			}
			this.transport instanceof m$ && (this.features.inherentKeepAlive = !0), this._connectionState === "Connecting" && (this._logger.log(Y.Debug, "The HttpConnection connected successfully."), this._connectionState = "Connected");
		} catch (e) {
			return this._logger.log(Y.Error, "Failed to start the connection: " + e), this._connectionState = "Disconnected", this.transport = void 0, this._stopPromiseResolver(), Promise.reject(e);
		}
	}
	async _getNegotiationResponse(e) {
		let t = {}, [n, r] = VQ();
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
			return (!n.negotiateVersion || n.negotiateVersion < 1) && (n.connectionToken = n.connectionId), n.useStatefulReconnect && this._options._useStatefulReconnect !== !0 ? Promise.reject(new OQ("Client didn't negotiate Stateful Reconnect but the server did.")) : n;
		} catch (e) {
			let t = "Failed to complete negotiation with the server: " + e;
			return e instanceof SQ && e.statusCode === 404 && (t += " Either this is not a SignalR endpoint or there is a proxy blocking the connection."), this._logger.log(Y.Error, t), Promise.reject(new OQ(t));
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
					if (this._logger.log(Y.Error, `Failed to start the transport '${n.transport}': ${e}`), s = void 0, a.push(new DQ(`${n.transport} failed: ${e}`, d$[n.transport])), this._connectionState !== "Connecting") {
						let e = "Failed to select transport before stop() was called.";
						return this._logger.log(Y.Debug, e), Promise.reject(new wQ(e));
					}
				}
			}
		}
		return a.length > 0 ? Promise.reject(new kQ(`Unable to connect to the server with any of the available transports. ${a.join(" ")}`, a)) : Promise.reject(/* @__PURE__ */ Error("None of the transports supported by the client are supported by the server."));
	}
	_constructTransport(e) {
		switch (e) {
			case d$.WebSockets:
				if (!this._options.WebSocket) throw Error("'WebSocket' is not supported in your environment.");
				return new g$(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
			case d$.ServerSentEvents:
				if (!this._options.EventSource) throw Error("'EventSource' is not supported in your environment.");
				return new h$(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
			case d$.LongPolling: return new m$(this._httpClient, this._logger, this._options);
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
		let i = d$[e.transport];
		if (i == null) return this._logger.log(Y.Debug, `Skipping transport '${e.transport}' because it is not supported by this client.`), /* @__PURE__ */ Error(`Skipping transport '${e.transport}' because it is not supported by this client.`);
		if (y$(t, i)) {
			if (e.transferFormats.map((e) => f$[e]).indexOf(n) >= 0) {
				if (i === d$.WebSockets && !this._options.WebSocket || i === d$.ServerSentEvents && !this._options.EventSource) return this._logger.log(Y.Debug, `Skipping transport '${d$[i]}' because it is not supported in your environment.'`), new TQ(`'${d$[i]}' is not supported in your environment.`, i);
				this._logger.log(Y.Debug, `Selecting transport '${d$[i]}'.`);
				try {
					return this.features.reconnect = i === d$.WebSockets ? r : void 0, this._constructTransport(i);
				} catch (e) {
					return e;
				}
			}
			return this._logger.log(Y.Debug, `Skipping transport '${d$[i]}' because it does not support the requested transfer format '${f$[n]}'.`), /* @__PURE__ */ Error(`'${d$[i]}' does not support ${f$[n]}.`);
		}
		return this._logger.log(Y.Debug, `Skipping transport '${d$[i]}' because it was disabled by the client.`), new EQ(`'${d$[i]}' is disabled by the client.`, i);
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
function y$(e, t) {
	return !e || (t & e) !== 0;
}
var b$ = class e {
	constructor(e) {
		this._transport = e, this._buffer = [], this._executing = !0, this._sendBufferedData = new x$(), this._transportResult = new x$(), this._sendLoopPromise = this._sendLoop();
	}
	send(e) {
		return this._bufferData(e), this._transportResult ||= new x$(), this._transportResult.promise;
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
			this._sendBufferedData = new x$();
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
}, x$ = class {
	constructor() {
		this.promise = new Promise((e, t) => [this._resolver, this._rejecter] = [e, t]);
	}
	resolve() {
		this._resolver();
	}
	reject(e) {
		this._rejecter(e);
	}
}, S$ = "json", C$ = class {
	constructor() {
		this.name = S$, this.version = 2, this.transferFormat = f$.Text;
	}
	parseMessages(e, t) {
		if (typeof e != "string") throw Error("Invalid input for JSON hub protocol. Expected a string.");
		if (!e) return [];
		t === null && (t = MQ.instance);
		let n = QQ.parse(e), r = [];
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
		return QQ.write(JSON.stringify(e));
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
}, w$ = {
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
function T$(e) {
	let t = w$[e.toLowerCase()];
	if (t !== void 0) return t;
	throw Error(`Unknown log level: ${e}`);
}
var E$ = class {
	configureLogging(e) {
		if (X.isRequired(e, "logging"), D$(e)) this.logger = e;
		else if (typeof e == "string") {
			let t = T$(e);
			this.logger = new BQ(t);
		} else this.logger = new BQ(e);
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
		return this.reconnectPolicy = e ? Array.isArray(e) ? new c$(e) : e : new c$(), this;
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
		let t = new v$(this.url, e);
		return o$.create(t, this.logger || MQ.instance, this.protocol || new C$(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
	}
};
function D$(e) {
	return e.log !== void 0;
}
//#endregion
//#region src/transport/attach-gate.ts
var O$ = class extends Error {
	byServerError;
	constructor(e) {
		super("the connection to the server dropped under the call; it is reconnecting.", { cause: e }), this.name = "ConnectionDropped", this.byServerError = e instanceof Error && e.message.startsWith("Server returned an error on close");
	}
}, k$ = class {
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
}, A$ = 500;
function j$(e) {
	let { changes: t, ...n } = e;
	return n;
}
function M$() {
	return {};
}
function N$(e) {
	return typeof e == "string" ? e : null;
}
var P$ = class {
	windowId;
	connection;
	started = !1;
	gate = new k$();
	inbound;
	constructor(e, t, n = {}) {
		this.windowId = e, this.inbound = new vQ(t), this.connection = new E$().withUrl(n.hubUrl ?? "/_ne/hub").withAutomaticReconnect([...n.reconnectDelays ?? [
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
		this.connection.on("ui.changes", this.inbound.pushed((t, n) => e(t, N$(n))));
	}
	onCommandResult(e) {
		this.connection.on("ui.commandResult", this.inbound.pushed((t, n) => e(t, N$(n))));
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
		return await this.invokeAsync("ProcessEventAsync", [e], (e) => this.inbound.answered(e, (e) => e.changes, j$));
	}
	async requestLeaveAsync(e) {
		return await this.invokeAsync("RequestLeaveAsync", [{ target: e }], (e) => this.inbound.answered(e, (e) => e.changes, j$));
	}
	async navigateInPlaceAsync(e) {
		return await this.invokeAsync("NavigateInPlaceAsync", [{ parameters: e }], (e) => this.inbound.answered(e, (e) => e.changes, j$));
	}
	async processChangeSetAsync(e, t) {
		try {
			await this.invokeAsync("ProcessChangeSetAsync", [e], (e) => this.inbound.answered(e, (e) => e, M$, t));
		} catch (e) {
			throw this.isReconnecting && this.gate.failure === null ? new O$(e) : e;
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
		await this.invokeAsync("RequestItemWindowAsync", [e], (e) => this.inbound.answered(e, (e) => e, M$));
	}
	async invokeAsync(e, t, n) {
		let r = window.setTimeout(() => s("call waiting behind the attach.", { methodName: e }), A$);
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
}, F$ = Promise.resolve(), I$ = () => {}, L$ = lQ * 3 / 4, R$ = 128, z$ = class {
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
		if (this.handed >= this.given) return F$;
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
		for (; this.flight !== null;) await this.flight.catch(I$);
	}
	dispatchAsync(e, t) {
		let n = ++this.given, r = dQ(e.value), i = r === null ? null : mQ(r);
		return i?.catch(I$), new Promise((a, o) => {
			let s = V$(e), c = this.queue.findIndex((e) => e.field === s), l = [{
				resolve: a,
				reject: o
			}], u = n;
			c >= 0 && (l = [...this.queue[c].settles, ...l], u = this.queue[c].sequence, this.queue.splice(c, 1));
			let d = r === null ? B$(e) : B$({
				...e,
				value: void 0
			}) + R$;
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
		let i = n.length === 0 ? null : this.transport.processChangeSetAsync({ updates: n }, H$(r));
		if (this.markHanded(t), i !== null) try {
			await i;
			for (let e of r) for (let t of e.settles) t.resolve();
		} catch (e) {
			if (e instanceof O$) {
				this.requeue(r, e);
				return;
			}
			for (let t of r) for (let n of t.settles) n.reject(e);
		}
	}
	takeBatch() {
		let e = 0, t = 0;
		for (; e < this.queue.length && (e === 0 || t + this.queue[e].bytes <= L$);) t += this.queue[e].bytes, e++;
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
		let t = this.transport.whenAttached().then(() => mQ(e));
		return t.catch(I$), t;
	}
	markHanded(e) {
		this.handed = Math.max(this.handed, e);
		for (let e = this.sentWaiters.length - 1; e >= 0; e--) {
			let t = this.sentWaiters[e];
			t.through <= this.handed && (this.sentWaiters.splice(e, 1), t.resolve());
		}
	}
};
function B$(e) {
	return new TextEncoder().encode(JSON.stringify(e)).byteLength;
}
function V$(e) {
	return `${e.componentId}:${e.propertyName}:${JSON.stringify(e.dynamicParameters)}`;
}
function H$(e) {
	let t = e.map((e) => e.before).filter((e) => e !== void 0);
	if (t.length !== 0) return () => {
		for (let e of t) e();
	};
}
//#endregion
//#region src/updates/content-fills.ts
var U$ = "content-fills", W$ = "content", G$ = "data-ui-root", K$ = "--ui-height", q$ = "var(--ui-fill-height";
function J$(e) {
	let t = e.parentElement;
	if (t === null || t.getAttribute("data-ui-region") !== "content") return;
	let n = t.parentElement;
	if (n === null || !n.hasAttribute(G$)) return;
	let r = e.style.getPropertyValue(K$).trimStart().startsWith(q$);
	n.hasAttribute("data-ui-content-fills") !== r && n.toggleAttribute(jn, r);
}
//#endregion
//#region src/updates/form-owner.ts
var Y$ = "form-owner", X$ = "ui-form-";
function Z$(e) {
	return X$ + e.replace(/[ \t\n\f\r]/g, "_");
}
function Q$(e, t) {
	if (typeof t != "string" || t.trim().length === 0) {
		e.hasAttribute("form") && e.removeAttribute("form");
		return;
	}
	let n = Z$(t);
	e1(n), e.getAttribute("form") !== n && e.setAttribute("form", n);
}
function $$(e) {
	for (let t of e.querySelectorAll("[form]")) {
		let e = t.getAttribute("form");
		e !== null && e.startsWith(X$) && e1(e);
	}
}
function e1(e) {
	let t = t1();
	if (t.querySelector(`form[id="${Ji(e)}"]`) !== null) return;
	let n = document.createElement("form");
	n.setAttribute("id", e), n.setAttribute("method", "dialog"), n.setAttribute("novalidate", ""), t.appendChild(n);
}
function t1() {
	let e = document.body.querySelector(`[${sn}]`);
	if (e !== null) return e;
	let t = document.createElement("div");
	return t.setAttribute(sn, ""), t.setAttribute("hidden", ""), document.body.appendChild(t);
}
//#endregion
//#region src/interactions/legacy-commands.ts
var n1 = document;
function r1() {
	try {
		return n1.execCommand("copy");
	} catch {
		return !1;
	}
}
function i1(e) {
	try {
		return typeof n1.execCommand == "function" && n1.execCommand("insertText", !1, e);
	} catch {
		return !1;
	}
}
//#endregion
//#region src/interactions/lightbox.ts
var a1 = "ui-lightbox", o1 = "ui-lightbox-title", s1 = new Zy("data-ui-lightbox-part"), c1 = "data-ui-lightbox-set", l1 = "data-ui-lightbox-slot", u1 = "data-ui-lightbox-still", d1 = "--ui-lightbox-shift", f1 = 16, p1 = 1 / 5, m1 = null, h1 = null, g1 = null;
function _1(e, t, n) {
	let r = t.filter((e) => io(e.source) !== null);
	if (r.length === 0) return s("show image effect carries no picture the page may fetch.", t), !1;
	m1 ??= S1(e), (m1.dialog.hasAttribute("hidden") || !m1.dialog.isConnected) && document.body.append(m1.dialog);
	let i = t.slice(0, Math.max(0, n)).filter((e) => io(e.source) === null).length;
	g1 = null, h1 = {
		pictures: r,
		index: x1(n - i, r.length)
	}, m1.dialog.toggleAttribute(c1, r.length > 1);
	for (let e of m1.neighbours) e.hidden = r.length < 2;
	return A1(m1), j1(m1, h1), e.open(a1);
}
function v1(e, t, n) {
	let r = y1(e);
	if (r === null) return null;
	let i = e.closest(`[${x}]`);
	if (!t || i === null) return {
		pictures: [r],
		start: 0
	};
	let a = [], o = 0;
	for (let t of [...n(e)].filter((e) => e.closest(`[${x}]`) === i).sort(b1)) {
		let n = t === e ? r : y1(t);
		n !== null && (t === e && (o = a.length), a.push(n));
	}
	return {
		pictures: a,
		start: o
	};
}
function y1(e) {
	let t = e.matches("img") ? e : e.querySelector("img");
	if (t === null || t.closest("[data-ui-image-failed]") !== null) return null;
	let n = t.currentSrc, r = io(typeof n == "string" && n.length > 0 ? n : t.getAttribute("src") ?? "");
	return r === null ? null : {
		source: r,
		altText: t.getAttribute("alt") ?? ""
	};
}
function b1(e, t) {
	return e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}
function x1(e, t) {
	return Math.min(Math.max(0, Math.trunc(Number.isFinite(e) ? e : 0)), t - 1);
}
function S1(e) {
	let { dialog: t, surface: n } = Xy({
		key: a1,
		className: "ui-lightbox",
		surfaceClassName: "ui-lightbox__surface",
		role: "dialog",
		labelledBy: o1,
		closesOnEscapeAndBackdrop: !0
	}), r = s1.element("h2", "ui-lightbox__title"), i = w1("ui-lightbox__close", "close"), a = s1.element("div", "ui-lightbox__stage"), [o, s] = C1("previous"), [c, l] = C1("current"), [u, d] = C1("next"), f = s1.element("div", "ui-lightbox__nav"), p = w1("ui-lightbox__step ui-lightbox__step--previous", "previous"), m = w1("ui-lightbox__step ui-lightbox__step--next", "next"), h = s1.element("span", "ui-lightbox__counter ui-text-type--caption"), g = s1.element("span", "ui-lightbox__count-room"), _ = s1.element("span", "ui-lightbox__count"), v = s1.element("p", "ui-lightbox__caption ui-text-type--body", "caption");
	return r.id = o1, _.setAttribute("aria-live", "polite"), g.setAttribute("aria-hidden", "true"), D.write(r, null, "ui.lightbox.label"), D.write(i, "aria-label", "ui.action.close"), D.write(p, "aria-label", "ui.lightbox.previous"), D.write(m, "aria-label", "ui.lightbox.next"), h.append(g, _), f.append(p, h, m), c.append(f), a.append(o, c, u), n.append(r, i, a, v), t.addEventListener("click", (t) => {
		switch (s1.pressed(t)) {
			case "close":
				e.dismiss(a1);
				break;
			case "previous":
				T1(-1);
				break;
			case "next": T1(1);
		}
	}), t.addEventListener("keydown", (e) => {
		if (e.defaultPrevented || !M(e) || h1 === null || h1.pictures.length < 2) return;
		let n = e.key === "ArrowLeft" ? -1 : +(e.key === "ArrowRight");
		n !== 0 && (e.preventDefault(), T1(N1(t) ? -n : n));
	}), P1(t, a), {
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
function C1(e) {
	let t = s1.element("div", "ui-lightbox__figure"), n = s1.element("img", "ui-lightbox__picture", e === "current" ? "picture" : void 0);
	return t.setAttribute(l1, e), n.decoding = "async", n.draggable = !1, n.addEventListener("error", () => n.setAttribute(st, "")), e !== "current" && t.setAttribute("aria-hidden", "true"), t.append(n), [t, n];
}
function w1(e, t) {
	let n = s1.element("button", e, t);
	return n.type = "button", n;
}
function T1(e) {
	if (m1 === null || h1 === null || h1.pictures.length < 2) return;
	let t = m1;
	if (O1(t), Lm()) {
		k1(t, e), A1(t), j1(t, h1);
		return;
	}
	let n = {
		by: e,
		landed: !1
	}, r = N1(t.dialog) ? -1 : 1;
	g1 = n, t.stage.removeAttribute(u1), t.stage.style.setProperty(d1, `${-e * r * E1(t.stage)}px`), zm(t.current, z.normal + 100, () => D1(t, n));
}
function E1(e) {
	return e.getBoundingClientRect().width + f1;
}
function D1(e, t) {
	if (g1 !== t || t.landed) return;
	k1(e, t.by), t.landed = !0;
	let n = typeof e.picture.decode == "function" ? e.picture.decode().catch(() => void 0) : null;
	n === null ? O1(e) : n.then(() => {
		g1 === t && O1(e);
	});
}
function O1(e) {
	let t = g1;
	t !== null && h1 !== null && (g1 = null, t.landed || k1(e, t.by), A1(e), j1(e, h1));
}
function k1(e, t) {
	if (h1 === null) return;
	let n = h1.pictures.length;
	h1.index = ((h1.index + t) % n + n) % n, M1(e.picture, h1.pictures[h1.index].source);
}
function A1(e) {
	e.stage.setAttribute(u1, ""), e.stage.style.setProperty(d1, "0px"), e.stage.getBoundingClientRect();
}
function j1(e, t) {
	let n = t.pictures.length, r = t.pictures[t.index];
	M1(e.picture, r.source), M1(e.previousPicture, t.pictures[(t.index + n - 1) % n].source), M1(e.nextPicture, t.pictures[(t.index + 1) % n].source), D.writeValue(e.picture, "alt", r.altText ?? r.caption ?? ""), D.writeValue(e.caption, null, r.caption ?? ""), e.caption.hidden = r.caption === void 0, D.write(e.count, null, "ui.lightbox.counter", {
		index: t.index + 1,
		count: n
	}), D.write(e.countRoom, null, "ui.lightbox.counter", {
		index: n,
		count: n
	});
}
function M1(e, t) {
	e.getAttribute("src") !== t && (e.removeAttribute(st), e.src = t);
}
function N1(e) {
	return getComputedStyle(e).direction === "rtl";
}
function P1(e, t) {
	zg(e, {
		axis: "x",
		begins: (e) => e.pointerType !== "touch" || m1 === null || h1 === null || h1.pictures.length < 2 ? !1 : (O1(m1), !0),
		start: () => t.setAttribute(u1, ""),
		follow: (e) => t.style.setProperty(d1, `${e}px`),
		end: (n, r, i) => {
			i && F1(n, window.innerWidth, r) ? T1((N1(e) ? n > 0 : n < 0) ? 1 : -1) : (t.removeAttribute(u1), t.style.setProperty(d1, "0px"));
		}
	});
}
function F1(e, t, n) {
	return Math.abs(e) > t * p1 || Math.abs(n) > .5 && Math.abs(e) > 6;
}
//#endregion
//#region src/interactions/notification-engine.ts
var I1 = "ui-notification-host", L1 = "ui-notification", R1 = "ui-notification--leaving", z1 = "ui-notification__message", B1 = "ui-notification__title", V1 = "ui-notification__action", H1 = "ui-notification__close", U1 = 5e3, W1 = 8e3, G1 = "ui-notification--connection", K1 = "--ui-notification-lift", q1 = /* @__PURE__ */ new Set([
	"info",
	"success",
	"warning",
	"danger",
	"primary",
	"accent"
]), J1 = class {
	root;
	components;
	durationMs;
	host = null;
	announcer;
	focusOrigins = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, this.durationMs = e.durationMs ?? U1, this.ensureHost(), this.announcer = kk(this.root instanceof Document ? this.root.body : this.root);
	}
	announce(e, t) {
		return this.announcer.announce(e, t);
	}
	show(e) {
		let t = BS(e.severity), n = document.createElement("div");
		n.className = q1.has(t) ? `${L1} ${L1}--${t}` : L1, n.classList.toggle(G1, e.connection === !0), t === "danger" && n.setAttribute("role", "alert");
		let r = document.createElement("span");
		if (r.className = z1, e.title !== void 0) {
			let t = document.createElement("span");
			t.className = B1, D.writeValue(t, null, e.title), n.append(t);
		}
		typeof e.message == "string" ? r.textContent = e.message : D.writeValue(r, null, e.message), n.append(r);
		let i = document.createElement("button");
		return i.type = "button", i.className = `${H1} ${Fi}`, D.write(i, "aria-label", "ui.action.close"), D.write(i, Re, "ui.action.close"), i.addEventListener("click", () => this.dismiss(n)), n.append(i), e.action !== void 0 && n.append(Q1(e.action, e.sticky === !0 ? null : () => this.dismiss(n))), n.addEventListener("keydown", (e) => {
			e.key !== "Escape" || e.defaultPrevented || j(e) || (e.preventDefault(), this.dismiss(n));
		}), n.addEventListener("focusin", (e) => {
			let t = e.relatedTarget;
			t instanceof HTMLElement && !n.contains(t) && this.focusOrigins.set(n, t);
		}), Y1(() => {
			if (n.classList.contains(R1)) return;
			let t = this.ensureHost();
			X1(t), t.append(n), e.sticky !== !0 && this.standFor(n, e);
		}), n;
	}
	standFor(e, t) {
		let n = t.durationMs !== void 0 && t.durationMs > 0 ? t.durationMs : t.action === void 0 ? this.durationMs : W1, r = !1, i = !1, a = window.setTimeout(() => this.dismiss(e), n), o = () => window.clearTimeout(a), s = () => {
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
		e.classList.contains(R1) || (e.classList.add(R1), e.isConnected && (this.returnFocus(e), Lm() || typeof e.animate != "function" ? e.remove() : window.setTimeout(() => Z1(e), z.fast)));
	}
	returnFocus(e) {
		if (!e.contains(document.activeElement)) return;
		let t = [...e.parentElement?.children ?? []].find((t) => t !== e && !t.classList.contains(R1));
		Fp(jp(this.focusOrigins.get(e), this.components) ?? t?.querySelector(`.${H1}`) ?? null, e);
	}
	ensureHost() {
		if (this.host !== null && this.host.isConnected) return this.host;
		let e = this.root instanceof Document ? this.root.body : this.root, t = e.querySelector(`.${I1}`), n = t ?? document.createElement("div");
		return n.classList.add(I1), n.setAttribute("role", "status"), n.setAttribute("aria-live", "polite"), t === null && e.append(n), this.host = n, n;
	}
};
function Y1(e) {
	if (rK(document.visibilityState)) {
		e();
		return;
	}
	let t = () => {
		rK(document.visibilityState) && (document.removeEventListener("visibilitychange", t), e());
	};
	document.addEventListener("visibilitychange", t);
}
function X1(e) {
	let t = window.innerHeight - Gh(window.innerHeight);
	t > 0 ? e.style.setProperty(K1, `${Math.round(t)}px`) : e.style.removeProperty(K1);
}
function Z1(e) {
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
function Q1(e, t) {
	let n = document.createElement("button"), r = !1;
	return n.type = "button", n.className = `${V1} ui-button ui-button--primary ui-button--small`, typeof e.label == "string" ? n.textContent = e.label : D.writeValue(n, null, e.label), n.addEventListener("click", () => {
		if (r) return;
		let n = e.run();
		t !== null && (r = !0, n === void 0 ? t() : n.then((e) => {
			e ? t() : r = !1;
		}, (e) => {
			r = !1, s("a notification's action failed.", e);
		}));
	}), n;
}
function $1(e, t) {
	let n = e0(e), r = e?.label;
	if (n !== void 0) {
		if (!E(r) && !ac(r)) s("a notification's action carries no words.", e);
		else return {
			label: r,
			run: () => t(n)
		};
	}
}
function e0(e) {
	return e != null && typeof e.id == "string" && e.id.length > 0 ? e.id : void 0;
}
//#endregion
//#region src/effects/insert-text.ts
function t0(e, t, n) {
	let r = e.itemKey === !0 ? n0(n) : e.text;
	if (typeof r != "string") {
		s(e.itemKey === !0 ? "insert text effect reads the row's key but ran for no row." : "insert text effect carries no text.", e);
		return;
	}
	let i = r0(t);
	i === null ? s("insert text effect target holds no text field.", e) : i0(i, r);
}
function n0(e) {
	let t = e.length === 0 ? null : e[e.length - 1];
	return t == null ? null : String(t);
}
function r0(e) {
	if (Eu(e)) return e;
	for (let t of e.querySelectorAll("input, textarea")) if (Eu(t)) return t;
	return null;
}
function i0(e, t) {
	if (t.length === 0 || e.readOnly || e.disabled || O(e) || A(e)) return !1;
	let n = e.value, r = e.selectionStart !== null, i = e.selectionStart ?? n.length, a = e.selectionEnd ?? i;
	return e.maxLength >= 0 && n.length - (a - i) + t.length > e.maxLength ? !1 : (document.activeElement !== e && e.focus({ preventScroll: !0 }), r && e.setSelectionRange(i, a), document.activeElement === e && i1(t) && e.value !== n || (r ? e.setRangeText(t, i, a, "end") : e.value = n + t, e.dispatchEvent(new Event("input", { bubbles: !0 }))), !0);
}
//#endregion
//#region src/effects/navigation-url.ts
function a0(e) {
	let t = e.request?.route;
	return t == null || t.length === 0 ? null : o0(t, e.request?.parameters ?? null);
}
function o0(e, t) {
	let n = s0(t);
	if (n.length === 0) return e;
	let r = e.indexOf("#"), i = r < 0 ? e : e.slice(0, r), a = r < 0 ? "" : e.slice(r);
	return `${i}${i.includes("?") ? i.endsWith("?") || i.endsWith("&") ? "" : "&" : "?"}${n}${a}`;
}
function s0(e) {
	if (e === null) return "";
	let t = new URLSearchParams();
	for (let [n, r] of Object.entries(e)) if (r != null) for (let e of Array.isArray(r) ? r : [r]) e != null && t.append(n, c0(e));
	return t.toString();
}
function c0(e) {
	return typeof e == "object" ? JSON.stringify(e) : String(e);
}
//#endregion
//#region src/effects/scroller.ts
function l0(e, t) {
	let n = d0([e, ...e.querySelectorAll("*")], t);
	if (n !== null) return n;
	let r = [];
	for (let t = e.parentElement; t !== null; t = t.parentElement) r.push(t);
	return d0(r, t) ?? u0(t);
}
function u0(e) {
	let t = typeof document > "u" ? null : document.scrollingElement ?? null;
	return t !== null && f0(t, e) ? t : null;
}
function d0(e, t) {
	let n = null;
	for (let r of e) if (JF(r, t)) {
		if (f0(r, t)) return r;
		n ??= r;
	}
	return n;
}
function f0(e, t) {
	return t ? e.scrollHeight > e.clientHeight : e.scrollWidth > e.clientWidth;
}
//#endregion
//#region src/effects/effect-registry.ts
var p0 = class {
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
		this.handlers.set(ga(e), t);
	}
	applyAll(e, t) {
		if (e != null) for (let n of e) this.apply({
			effect: n,
			dom: t
		});
	}
	apply(e) {
		let t = ga(e.effect?.kind), n = t.length === 0 ? void 0 : this.handlers.get(t);
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
			let t = a0(e.effect);
			t === null ? s("navigate effect carries no route.", e.effect) : $a(t) ? this.leaveFor(t) : s("navigate effect names no route of this site; not followed.", e.effect);
		}), this.register("NavigateBack", (e) => {
			if (this.address?.back() === !0) return;
			let t = e.effect.fallback;
			typeof t != "string" || !$a(t) ? s("navigate back effect has nothing to go back to and names no route of this site; not followed.", e.effect) : this.leaveFor(t);
		}), this.register("ReplaceAddress", (e) => {
			this.writeAddress(e, (e, t) => e.replace(t));
		}), this.register("PushAddress", (e) => {
			this.writeAddress(e, (e, t) => e.push(t));
		}), this.register("SetTheme", (e) => {
			let t = e.effect, n = ba(t.mode), r = n === "Unknown" ? "auto" : n.toLowerCase();
			document.documentElement.getAttribute("data-ui-theme") !== r && document.documentElement.setAttribute(Vr, r), t.stored !== !0 && this.reportTheme?.(r);
		}), this.register("Focus", (e) => {
			let t = y0(e);
			t !== null && (Lq(t), x0(t));
		}), this.register("ScrollTo", (e) => {
			let t = y0(e);
			if (t === null) return;
			let n = e.effect, r = _a(n.behavior), i = va(n.block);
			Lq(t), t.scrollIntoView({
				behavior: b0(r),
				block: i === "Unknown" ? "nearest" : i.toLowerCase()
			});
		}), this.register("ScrollToItem", (e) => {
			let t = y0(e);
			if (t === null) return;
			let n = e.effect, r = Cq(t);
			if (r === null || typeof n.key != "string" || n.key.length === 0) {
				s("scroll to item effect names no items host or no key.", e.effect);
				return;
			}
			let i = va(n.block);
			Lq(qu(r)), wq(r, n.key, i === "Unknown" ? "Start" : i, b0(_a(n.behavior))) || s("scroll to item effect names a row the host has not drawn.", e.effect);
		}), this.register("Scroll", (e) => {
			let t = y0(e);
			if (t === null) return;
			let n = e.effect, r = xa(n.axis) !== "Horizontal", i = l0(t, r);
			if (i === null) {
				s("scroll effect target has no scrollable element.", e.effect);
				return;
			}
			let a = r ? i.clientHeight : i.clientWidth, o = (r ? i.scrollHeight : i.scrollWidth) - a, c = r ? i.scrollTop : i.scrollLeft, l = ya(n.position), u;
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
			let d = b0(_a(n.behavior));
			Lq(i), r && l === "End" && Vq(i) && Iq(i), i.scrollTo(r ? {
				top: u,
				behavior: d
			} : {
				left: u,
				behavior: d
			});
		}), this.register("Show", (e) => {
			v0(y0(e), null);
		}), this.register("Hide", (e) => {
			v0(y0(e), "hidden");
		}), this.register("Collapse", (e) => {
			v0(y0(e), "collapsed");
		}), this.register("CopyToClipboard", (e) => {
			let t = S0(e, this.valueReaders);
			t !== null && C0(t).catch((e) => s("copy to clipboard failed.", e));
		}), this.register("InsertText", (e) => {
			let t = y0(e);
			t !== null && t0(e.effect, t, e.row ?? []);
		}), this.register("OpenPicker", (e) => {
			let t = y0(e);
			t !== null && !Ey(t) && s("open picker effect names no file or image input.", e.effect);
		}), this.register("OpenDialog", (e) => {
			this.applyDialogEffect(e, "OpenDialog", (e, t) => e.open(t));
		}), this.register("ShowImage", (e) => {
			let t = e.effect;
			if (this.dialogs === void 0) {
				s("show image effect arrived but no dialog engine is wired up.", t);
				return;
			}
			if (t.target === void 0 || t.target === null) {
				_1(this.dialogs, h0(t.images), t.startIndex ?? 0);
				return;
			}
			let n = y0(e), r = n === null ? null : v1(n, t.rows === !0, (t) => e.dom.findEveryComponent(T(t)));
			r === null ? s("show image effect names a component that shows no picture.", t) : _1(this.dialogs, r.pictures, r.start);
		}), this.register("CloseDialog", (e) => {
			let t = e.effect.raisesClose === !0;
			this.applyDialogEffect(e, "CloseDialog", (e, n) => t ? e.dismiss(n) : e.close(n));
		}), this.register("DownloadFile", (e) => {
			let t = e.effect;
			if (t.requestPath === void 0 || t.requestPath.length === 0) {
				s("download effect carries no path.", e.effect);
				return;
			}
			if (!Ya(t.requestPath)) {
				s("download effect refused: the path's scheme is not one a link may carry.", e.effect);
				return;
			}
			let n = t.requestPath;
			sy.load(() => {
				let e = document.createElement("a");
				e.href = n, e.download = t.fileName ?? "", e.style.display = "none", document.body.appendChild(e), e.click(), e.remove();
			});
		}), this.register("ShowNotification", (e) => {
			let t = e.effect;
			!E(t.message) && !ac(t.message) ? s("show notification effect carries no message.", e.effect) : this.notifications === void 0 ? s("show notification effect arrived but no notification engine is wired up.", t.message) : this.notifications.show({
				message: t.message,
				severity: t.severity,
				durationMs: typeof t.durationMs == "number" ? t.durationMs : void 0,
				action: this.runAction === void 0 ? void 0 : $1(t.action, this.runAction)
			});
		}), this.register("RequestNotificationPermission", () => {
			iK() !== void 0 && Notification.requestPermission().then(() => this.clientStateChanged?.()).catch((e) => s("asking for the notification permission failed.", e));
		}), this.register("ShowSystemNotification", (e) => this.showSystemNotification(e.effect)), this.register("Announce", (e) => {
			let t = e.effect;
			!E(t.message) && !ac(t.message) ? s("announce effect carries no message.", e.effect) : this.notifications === void 0 ? s("announce effect arrived but no notification engine is wired up.", t.message) : this.notifications.announce(t.message, Sa(t.politeness) === "Assertive" ? "assertive" : "polite");
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
		if (!E(t) && !ac(t)) {
			s("system notification effect carries no title.", e);
			return;
		}
		let n = E(e.body) || ac(e.body) ? e.body : void 0, r = typeof e.address == "string" && $a(e.address) ? e.address : void 0, i = () => {
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
		if (e.when !== "Always" && rK(document.visibilityState)) {
			i();
			return;
		}
		let a = e0(e.action);
		lK({
			title: m0(t),
			body: n === void 0 ? void 0 : m0(n),
			tag: e.tag ?? "",
			icon: typeof e.icon == "string" && $a(e.icon) ? e.icon : g0(),
			silent: e.silent === !0,
			requireInteraction: e.requireInteraction === !0,
			address: r ?? _0(),
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
		return t !== void 0 && n !== void 0 && dK(t) ? {
			label: E(e.addressLabel) || ac(e.addressLabel) ? e.addressLabel : { key: "ui.notification.open" },
			run: () => n(t)
		} : this.runAction === void 0 ? void 0 : $1(e.action, this.runAction);
	}
};
function m0(e) {
	return E(e) ? D.translate(e.key, e.args) : ac(e) ? D.resolveText(e.text) : "";
}
function h0(e) {
	let t = [];
	for (let n of e ?? []) typeof n?.source == "string" && t.push({
		source: n.source,
		caption: E(n.caption) || ac(n.caption) ? n.caption : void 0,
		altText: E(n.altText) || ac(n.altText) ? n.altText : void 0
	});
	return t;
}
function g0() {
	let e = document.querySelector("link[rel~='icon']")?.href;
	return e === void 0 || e.startsWith("data:") ? void 0 : e;
}
function _0() {
	return window.location.pathname + window.location.search + window.location.hash;
}
function v0(e, t) {
	if (e === null) return;
	let n = cm();
	for (let n of _i) t === null ? e.removeAttribute(n) : e.setAttribute(n, t);
	n !== null && lm(n);
}
function y0(e) {
	let t = e.effect.target;
	if (t === void 0 || t.id === void 0) return s("targeted client effect carries no resolved component address.", e.effect), null;
	let n = e.dom.findComponent(w(t.id), t.dynamicParameters ?? []);
	return n === null && s("client effect target was not found in the DOM.", e.effect), n;
}
function b0(e) {
	return e === "Smooth" && !Lm() ? "smooth" : "auto";
}
function x0(e) {
	if (e instanceof HTMLElement && (e.tabIndex >= 0 || e.matches(Wf))) {
		e.focus();
		return;
	}
	let t = hp(e);
	t === null ? s("focus effect target has nothing focusable.", e) : t.focus();
}
function S0(e, t) {
	let n = e.effect;
	if (typeof n.text == "string") return n.text;
	let r = y0(e);
	return r === null ? null : t === void 0 ? (s("copy to clipboard effect names a component but no value reader is wired up.", e.effect), null) : zl(r) === null ? (s("copy to clipboard effect target holds no value.", e.effect), null) : Nl(t.readHeld(r));
}
async function C0(e) {
	if (navigator.clipboard !== void 0) try {
		await navigator.clipboard.writeText(e);
		return;
	} catch {}
	if (!w0(e)) throw Error("neither the clipboard API nor the selection command took the text.");
}
function w0(e) {
	let t = document.createElement("textarea");
	t.value = e, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.opacity = "0", document.body.appendChild(t), t.select();
	try {
		return r1();
	} finally {
		t.remove();
	}
}
//#endregion
//#region src/interactions/dialog-engine.ts
var T0 = class {
	root;
	components;
	returnFocusByKey = /* @__PURE__ */ new Map();
	swipes = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, this.root.addEventListener("mousedown", (e) => E0(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0);
	}
	open(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (!t.hasAttribute("hidden")) return !0;
		t.removeAttribute("hidden");
		let n = t.querySelector(".ui-dialog__surface") ?? t, r = hp(t), i = cp() && Eu(r);
		i && !n.hasAttribute("tabindex") && (n.tabIndex = -1);
		let a = Op(n, i ? n : r);
		return a !== null && this.returnFocusByKey.set(e, a), D0(t) && this.swipes.set(e, Gg(n, n, () => this.dismiss(e))), !0;
	}
	close(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (t.hasAttribute("hidden")) return !0;
		let n = this.returnFocusByKey.get(e);
		return this.returnFocusByKey.delete(e), this.swipes.get(e)?.(), this.swipes.delete(e), t.contains(document.activeElement) && Fp(jp(n, this.components), t), t.setAttribute("hidden", ""), !0;
	}
	closeAll() {
		for (let e of this.root.querySelectorAll(`[${ag}]:not([hidden])`)) {
			let t = e.getAttribute(ag);
			t !== null && this.close(t);
		}
	}
	find(e) {
		return this.root.querySelector(`[${ag}="${Ji(e)}"]`);
	}
	handleClick(e) {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest(`[${sg}]`);
		if (n === null) return;
		let r = n.closest(`[${ag}]`);
		if (!(r instanceof HTMLElement) || r.hasAttribute("hidden") || !r.hasAttribute("data-ui-dialog-close-backdrop")) return;
		let i = r.getAttribute(ag);
		i !== null && this.dismiss(i);
	}
	handleKeydown(e) {
		if (e.defaultPrevented || j(e)) return;
		let t = this.getTopmostOpen();
		if (!(t === null || mg(t))) {
			if (e.key === "Escape" && t.hasAttribute("data-ui-dialog-close-escape") && !Cg() && !_u(e)) {
				let n = t.getAttribute(ag);
				n !== null && (e.preventDefault(), this.dismiss(n));
			} else e.key === "Tab" && t.hasAttribute("data-ui-dialog-modal") && bp(t, e);
		}
	}
	dismiss(e) {
		let t = this.find(e), n = t !== null && !t.hasAttribute("hidden");
		return !this.close(e) || !n || t === null ? !1 : (t.querySelector(S)?.dispatchEvent(new Event("close", { bubbles: !0 })), !0);
	}
	getTopmostOpen() {
		return fg(this.root);
	}
};
function E0(e) {
	let t = e.target instanceof Element ? e.target.closest(`[${sg}]`) : null;
	t !== null && t.closest("[data-ui-dialog]:not([hidden])") !== null && e.preventDefault();
}
function D0(e) {
	return e.getAttribute("data-ui-dialog-placement") === "bottom" && (e.hasAttribute("data-ui-dialog-close-backdrop") || e.hasAttribute("data-ui-dialog-close-escape"));
}
//#endregion
//#region src/interactions/leave-dialog.ts
var O0 = "ui-leave", k0 = new Zy("data-ui-leave-part"), A0 = "560px", j0 = null, M0 = null;
function N0(e, t) {
	j0 ??= P0();
	let n = j0;
	n.isConnected || document.body.append(n), F0(n, "title", D.text("ui.leave.title")), F0(n, "message", D.text("ui.leave.message")), F0(n, "stay", D.text("ui.leave.stay")), F0(n, "leave", D.text("ui.leave.confirm")), M0 = {
		dialogs: e,
		leave: t
	}, e.open(O0);
}
function P0() {
	let { dialog: e, surface: t } = Xy({
		key: O0,
		className: "ui-leave-dialog",
		role: "alertdialog",
		labelledBy: "ui-leave-title",
		describedBy: "ui-leave-message",
		closesOnEscapeAndBackdrop: !0
	});
	t.style.setProperty("--ui-max-width-sm", A0);
	let n = k0.element("h2", "ui-leave-dialog__title ui-text-type--subtitle", "title"), r = k0.element("p", "ui-leave-dialog__message ui-text-type--body", "message");
	return n.id = "ui-leave-title", r.id = "ui-leave-message", t.append(n, r, k0.actions(k0.button("ui-button--ghost", "stay"), k0.button("ui-button--danger", "leave"))), e.addEventListener("click", (e) => {
		let t = k0.pressed(e);
		if (t !== "stay" && t !== "leave") return;
		let n = M0;
		M0 = null, n?.dialogs.close(O0), t === "leave" && n?.leave();
	}), e;
}
function F0(e, t, n) {
	let r = k0.find(e, t);
	r !== null && r.textContent !== n && (r.textContent = n);
}
//#endregion
//#region src/interactions/leave-guard.ts
var I0 = class {
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
		let t = L0(e, this.options.window.location.href);
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
function L0(e, t) {
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
	return $a(s) ? s : null;
}
//#endregion
//#region src/interactions/navigation-progress.ts
var R0 = 200, z0 = 1e4, B0 = "ui-navigation-progress", V0 = class {
	window;
	shownAfter;
	givenUpAfter;
	bar = null;
	timer = null;
	wait = null;
	constructor(e) {
		this.window = e.window, this.shownAfter = e.shownAfterMilliseconds ?? R0, this.givenUpAfter = e.givenUpAfterMilliseconds ?? z0, this.window.addEventListener("click", (e) => this.handlePress(e)), this.window.addEventListener("pageshow", (e) => {
			e.persisted === !0 && this.stop();
		}), this.window.addEventListener("pageswap", () => this.stop()), this.window.navigation?.addEventListener("navigateerror", () => this.stop());
	}
	handlePress(e) {
		L0(e, this.window.location.href) !== null && this.start(e);
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
		this.timer = null, e?.defaultPrevented === !0 ? this.stop() : (this.bar ??= H0(), document.body.append(this.bar), this.giveUpLater());
	}
	stop() {
		this.wait = null, this.clearTimer(), this.bar?.remove();
	}
};
function H0() {
	let e = document.createElement("div"), t = document.createElement("span"), n = document.createElement("span");
	return e.className = `${B0} ui-progress ui-progress--linear`, e.setAttribute("aria-hidden", "true"), t.className = "ui-progress__track", n.className = "ui-progress__fill", t.append(n), e.append(t), e;
}
//#endregion
//#region src/effects/address-history.ts
var U0 = "neEntry", W0 = class {
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
		this.window = e.window, this.revisit = e.revisit, this.switchRuntime = e.switchRuntime, this.load = e.load, this.route = e.window.location.pathname, this.search = e.window.location.search, this.entry = G0(e.window.history.state) ?? 0, G0(e.window.history.state) === null && e.window.history.replaceState({ [U0]: this.entry }, ""), e.window.addEventListener("popstate", () => this.onPopState());
	}
	replace(e) {
		this.write(o0(this.route, e), !1);
	}
	push(e) {
		let t = o0(this.route, e), n = this.window.location;
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
		t ? (this.entry++, this.window.history.pushState({ [U0]: this.entry }, "", e)) : this.window.history.replaceState({ [U0]: this.entry }, "", e), this.search = this.window.location.search;
	}
	onPopState() {
		let e = this.window.location, t = G0(this.window.history.state), n = t === null ? null : t - this.entry;
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
		}, this.switchRuntime(e.search, r) || this.revisit(J0(e.search));
	}
};
function G0(e) {
	if (typeof e != "object" || !e) return null;
	let t = e[U0];
	return typeof t == "number" ? t : null;
}
function K0(e, t, n) {
	if (n.length === 0) return !1;
	let r = new URLSearchParams(e), i = new URLSearchParams(t);
	return n.some((e) => q0(r, e) !== q0(i, e));
}
function q0(e, t) {
	return e.getAll(t).map(encodeURIComponent).join(",");
}
function J0(e) {
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
var Y0 = class {
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
		let i = this.addressResolver.resolveProperties(e, t), a = this.shownValue(e, n), o = sX(n, this.extensions.converters), c = !1;
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
		!this.state.set(e, t, n, () => Z0(i[0]?.component)) && !this.restoring || c || this.notifyValueChanged({
			reference: e,
			propertyName: i[0]?.propertyName ?? this.addressResolver.getPropertyName(e.propertyId) ?? "",
			dynamicParameters: t,
			value: a,
			local: r,
			components: i.map((e) => e.component)
		});
	}
	shownValue(e, t) {
		return zc(t, () => this.addressResolver.isTranslatable(e));
	}
	holdsProperty(e, t) {
		if (!this.isHeld(e)) return !1;
		let n = e.getAttribute(Xe), r = n === null ? void 0 : this.addressResolver.getBindingById(Number(n));
		return r === void 0 || r.propertyId === t;
	}
	applyOperation(e, t, n, r, i, a, o) {
		a !== null && aX(t, n) ? this.operations.apply({
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
		return this.state.set(e, t, n, () => Z0(r[0]?.component)) ? {
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
			(typeof n == "string" || ac(n) ? this.addressResolver.isTranslatable(t.reference) : E(n)) && (e === void 0 || e(n)) && this.applyPropertyValue(t.reference, t.dynamicParameters, n, !1);
		}
	}
	rewriteStatic(e, t, n) {
		let r = this.addressResolver.resolvePropertyOn(e, t);
		if (r === null) return;
		let i = `[${Ye}${Yi(r.propertyName)}]`;
		this.applyOperations(r, n, this.shownValue(t, n), (t) => Qi(e, t, () => X0(e, i)));
	}
	applyOperations(e, t, n, r) {
		let i = sX(t, this.extensions.converters);
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
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(Xe))), r = e.closest(S);
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
		if (!this.state.has(r, t)) Hl(e);
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
function X0(e, t) {
	if (e.matches(t)) return [e];
	for (let n of e.querySelectorAll(t)) if (n.closest("[data-ui-id]") === e) return [n];
	return [e];
}
function Z0(e) {
	let t = [], n = e?.closest("[data-ui-key]") ?? null;
	for (; n !== null;) {
		let e = n.parentElement?.closest("[data-ui-id]") ?? null, r = e === null ? 0 : T(e), i = n.getAttribute(b);
		e !== null && r > 0 && i !== null && t.push({
			host: r,
			hostParameters: Aa(e, ka(e)),
			key: i
		}), n = n.parentElement?.closest("[data-ui-key]") ?? null;
	}
	return t;
}
//#endregion
//#region src/updates/reactive-source-registry.ts
var Q0 = "EndValue", $0 = class {
	watchers = /* @__PURE__ */ new Map();
	sourcesByComponent = /* @__PURE__ */ new Map();
	propertyPatchEngine;
	edits;
	constructor(e, t) {
		if (this.propertyPatchEngine = e, this.edits = t, e.addValueChangeHandler((e) => this.notify(e)), t !== void 0) for (let e of Rp) t.root.addEventListener(e, (e) => this.applyEditedValue(e, t), !0);
	}
	watch(e, t) {
		let n = w(e.componentId), r = t2(n, e.propertyId), i = this.watchers.get(r);
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
		let t = this.edits?.root.querySelector(`[data-ui-id="${w(e.componentId)}"]`) ?? null, n = t === null ? null : e2(e, this.edits?.metadata) ? t.querySelector(`[${zt}]`) : zl(t);
		this.edits !== void 0 && n !== null && this.propertyPatchEngine.recordValue(e, [], this.edits.valueReaders.readBound(n));
	}
	applyEditedValue(e, t) {
		if (!(e.target instanceof Element)) return;
		let n = Va(e.target), r = n === null ? void 0 : this.sourcesByComponent.get(n);
		if (r === void 0) return;
		let i = t.valueReaders.readBound(e.target), a = e.target.hasAttribute(zt);
		for (let e of r) {
			if (t.metadata !== void 0 && e2(e, t.metadata) !== a) continue;
			let n = this.propertyPatchEngine.recordValue(e, [], i);
			n !== null && this.notify(n);
		}
	}
	notify(e) {
		let t = t2(w(e.reference.componentId), e.reference.propertyId), n = this.watchers.get(t);
		if (n !== void 0) for (let t of n) t(e);
	}
};
function e2(e, t) {
	return t?.getPropertyDefinition(e.propertyId)?.propertyName === Q0;
}
function t2(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/items/composite-slots.ts
function n2(e) {
	let t = [];
	for (let n of e.children) {
		let e = n.hasAttribute("data-ui-key") ? n.firstElementChild : null, r = e === null ? 0 : T(e);
		e !== null && r > 0 && t.push([e, r]);
	}
	return t;
}
//#endregion
//#region src/items/held-collections.ts
var r2 = class {
	collections = /* @__PURE__ */ new Map();
	rowCollections = /* @__PURE__ */ new Map();
	waiting = /* @__PURE__ */ new WeakMap();
	hold(e, t) {
		this.collections.set(e, s2(t));
	}
	apply(e) {
		let t = w(e.component?.id), n = this.collections.get(t);
		n === void 0 && (n = [], this.collections.set(t, n)), i2(n, e);
	}
	get(e) {
		return this.collections.get(e);
	}
	holdRow(e, t, n) {
		this.rowCollections.set(a2(e, t), {
			componentId: e,
			dynamicParameters: t,
			rows: s2(n)
		});
	}
	applyRow(e) {
		let t = w(e.component?.id), n = e.component?.dynamicParameters ?? [], r = a2(t, n), i = this.rowCollections.get(r);
		i === void 0 && (i = {
			componentId: t,
			dynamicParameters: n,
			rows: []
		}, this.rowCollections.set(r, i)), i2(i.rows, e);
	}
	getRow(e, t) {
		return this.rowCollections.get(a2(e, t))?.rows;
	}
	forgetRows(e, t) {
		for (let [n, r] of this.rowCollections) t(r.componentId) && o2(r.dynamicParameters, e) && this.rowCollections.delete(n);
	}
	writeRowItem(e, t, n, r) {
		let i = !1;
		for (let a of this.rowCollections.values()) {
			if (!n(a.componentId) || a.dynamicParameters.length !== e.length || !o2(a.dynamicParameters, e)) continue;
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
function i2(e, t) {
	switch (fa(t.action)) {
		case "Insert":
			for (let n of t.items ?? []) c2(e, n);
			break;
		case "Remove":
			for (let n of t.items ?? []) l2(e, n.key);
			break;
		case "Replace":
			for (let n of t.items ?? []) u2(e, n);
			break;
		case "Move":
			for (let n of t.moves ?? []) d2(e, n.key, n.newIndex);
			break;
		case "Reset": e.length = 0;
	}
}
function a2(e, t) {
	return `${e}:${pa(t)}`;
}
function o2(e, t) {
	if (e.length < t.length) return !1;
	for (let n = 0; n < t.length; n++) if (String(e[n] ?? "") !== String(t[n] ?? "")) return !1;
	return !0;
}
function s2(e) {
	let t = [];
	for (let n of e) typeof n.key == "string" && t.push({
		key: n.key,
		item: n.item
	});
	return t;
}
function c2(e, t) {
	typeof t.key == "string" && (l2(e, t.key), e.splice(f2(t.index, e.length), 0, {
		key: t.key,
		item: t.item
	}));
}
function l2(e, t) {
	let n = e.findIndex((e) => e.key === t);
	n >= 0 && e.splice(n, 1);
}
function u2(e, t) {
	if (typeof t.key != "string") return;
	let n = e.findIndex((e) => e.key === (t.oldKey ?? t.key));
	n < 0 ? c2(e, t) : e[n] = {
		key: t.key,
		item: t.item
	};
}
function d2(e, t, n) {
	let r = e.findIndex((e) => e.key === t);
	if (r < 0) return;
	let [i] = e.splice(r, 1);
	e.splice(f2(n, e.length), 0, i);
}
function f2(e, t) {
	return typeof e == "number" && e >= 0 && e < t ? e : t;
}
//#endregion
//#region src/items/item-projections.ts
var p2 = class {
	byHost = /* @__PURE__ */ new Map();
	records = /* @__PURE__ */ new WeakMap();
	reported = /* @__PURE__ */ new Set();
	get isEmpty() {
		return this.byHost.size === 0;
	}
	describe(e, t) {
		this.byHost.set(e, m2(e, "", t.map((e) => e.split("."))));
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
function m2(e, t, n) {
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
	for (let [n, a] of r) i.set(n, a.whole || a.rest.length === 0 ? null : m2(e, `${t}${a.name}.`, a.rest));
	return {
		host: e,
		prefix: t,
		members: i
	};
}
function h2(e) {
	let t = new p2();
	for (let n of e.metadata.items) n.itemPaths !== null && n.itemPaths !== void 0 && t.describe(w(n.componentId), n.itemPaths);
	return t;
}
//#endregion
//#region src/items/pending-moves.ts
var g2 = class {
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
}, _2 = class {
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
function v2(e, t) {
	let n = y2(e[t], "Reset");
	if (n === null) return null;
	let r = w(n.component?.id), i = n.component?.dynamicParameters ?? [];
	if (r <= 0) return null;
	let a = null, o = null, s = t + 1;
	for (; s < e.length; s++) {
		let t = y2(e[s], "Insert");
		if (t === null || w(t.component?.id) !== r || !im(i, t.component?.dynamicParameters ?? [])) break;
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
function y2(e, t) {
	if (e === void 0 || ha(e) !== "CollectionChange") return null;
	let n = e;
	return fa(n.action) === t ? n : null;
}
//#endregion
//#region src/updates/collection-sinks.ts
var b2 = class {
	handlers = /* @__PURE__ */ new Map();
	register(e) {
		this.handlers.set(e.kind, e.handler);
	}
	dispatch(e, t) {
		let n = this.handlers.get(e);
		return n !== void 0 && (n(t), !0);
	}
};
function x2(e, t, n, r) {
	return {
		action: fa(e.action),
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
var S2 = [], C2 = class {
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
	held = new r2();
	projections;
	touched = null;
	changedHosts = null;
	moves = new g2({
		indexOf: (e, t) => this.indexOfRow(e, t),
		move: (e, t, n) => this.moveRow(e, t, n)
	});
	transfers = new _2({
		take: (e, t) => this.takeRow(e, t),
		restore: (e, t) => this.restoreRow(e, t),
		place: (e, t, n, r) => this.placeRow(e, t, n, r),
		remove: (e, t) => this.removeRow(e, t),
		holds: (e, t) => M2(G(e), t) !== null,
		itemOf: (e) => this.readItemValue(e)
	});
	constructor(e, t, n, r, i, a, o, s, c) {
		this.metadata = e, this.propertyPatchEngine = t, this.state = n, this.itemsRenderer = r, this.itemsTemplates = i, this.dom = a, this.virtualization = o, this.sinks = s, this.rowMenus = c, r.setRowFiller((e) => this.fillHeldCollections(e)), t.addValueChangeHandler((e) => this.writeHeldItemValue(e)), t.addValueChangeHandler((e) => this.touch(e.components)), this.projections = h2(e), this.projections.isEmpty || zO((e, t) => this.projections.check(e, t));
	}
	fillHeldCollections(e) {
		let t = [];
		for (let n of e.querySelectorAll(`[${x}]`)) {
			let e = Va(n);
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
		for (let n = A2(e, t); n !== null; n = A2(e, t)) {
			t.add(n);
			let e = Ha(n);
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
		let r = this.metadata.getBindingByComponentAndPropertyId(t, e.reference.propertyId), i = r === void 0 ? null : XO(r);
		if (i === null || i.scopeComponentId > 0 && !this.rowMenus.inOneMenu(i.scopeComponentId, t)) return;
		let a = this.state.get(e.reference, n);
		this.held.writeRowItem(n.slice(0, -1), String(n[n.length - 1] ?? ""), (e) => this.rowMenus.inOneMenu(e, t), (e) => uX(e, i.steps, a)) && this.rowMenus.heldChanged();
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
			return n === void 0 && (n = N2(e), t.set(e, n)), n;
		};
		this.registerRenderedRows(this.dom.root, n);
		for (let t of e?.updates ?? []) {
			if (ha(t) !== "CollectionChange") continue;
			let e = t;
			if (fa(e.action) !== "Insert") continue;
			let r = w(e.component?.id);
			for (let t of this.findItemsHosts(r, e.component?.dynamicParameters ?? [])) {
				let i = n(t);
				for (let t of e.items ?? []) this.registerItemValue(r, i, t.key, t.item);
			}
		}
	}
	registerRenderedRows(e, t = (e) => N2(e)) {
		for (let n of e.querySelectorAll(`[${x}]`)) {
			let e = Ha(n);
			if (e === null) continue;
			let r = this.metadata.getItemValues(e.componentId, e.dynamicParameters);
			this.projections.isEmpty || this.projections.mark(e.componentId, r);
			for (let i of r) this.registerItemValue(e.componentId, t(n), i.key, i.item);
		}
	}
	registerItemValue(e, t, n, r) {
		if (n == null) return;
		let i = t.get(n) ?? null;
		if (i !== null && this.readItemScope(i) === void 0 && (this.itemsRenderer.registerItemScope(i, j2(i), r), this.metadata.getItemsTemplateMetadata(e)?.composite != null)) for (let [e, t] of n2(i)) this.itemsRenderer.registerItemScope(e, t, r);
	}
	readItemScope(e) {
		let t = this.itemsRenderer.getItemScope(e);
		if (t !== void 0) return t;
		let n = e.firstElementChild;
		return n === null ? void 0 : this.itemsRenderer.getItemScope(n);
	}
	initializeItemsHosts() {
		for (let e of this.dom.root.querySelectorAll(`[${x}]`)) {
			let t = Va(e);
			t !== null && this.syncItemsHost(e, t);
		}
	}
	resortHost(e) {
		let t = Va(e);
		t !== null && this.syncItemsHost(e, t);
	}
	syncItemsHost(e, t) {
		GW(e, t, {
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
		let n = u() ? performance.now() : -1, r = cm(), i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set();
		this.touched = i, this.changedHosts = a;
		try {
			YW(() => this.applyUpdates(t));
		} finally {
			this.touched = null, this.changedHosts = null;
		}
		for (let e of a) this.dom.invalidate(e);
		return r !== null && lm(r), n >= 0 && d(`applied ${t.length} server update(s)`, n), [...i];
	}
	applyUpdates(e) {
		for (let t = 0; t < e.length; t++) {
			let n = e[t];
			try {
				ha(n) !== "Value" && ZW((e) => !w2(n, e));
				let r = v2(e, t);
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
		this.transfers.around(e, () => this.moves.around(e, S2, () => this.refillHostRows(e, t)));
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
		let n = this.itemsRenderer.getAncestorStack(e), r = N2(e), i = [], a = [], o = null;
		for (let e of t.items) {
			let c = e.key ?? null;
			if (c === null) {
				s("collection insert carried no item key.", e);
				continue;
			}
			let l = r.get(c) ?? null;
			if (r.delete(c), l !== null && im(this.readItemValue(l), e.item)) {
				i.push(l);
				continue;
			}
			let u = this.renderItemElement(t.componentId, e.item, c, n);
			if (l !== null) {
				let e = Rf(l);
				e !== null && u !== null && (o = {
					row: u,
					held: e
				}), l.remove(), a.push(c);
			}
			u !== null && i.push(u);
		}
		let c = W(e) === "windowed";
		for (let [t, n] of r) {
			let r = c ? Rf(n) : null;
			n.remove(), zf(e, null, r), a.push(t);
		}
		if (this.state.forgetRows(t.componentId, t.dynamicParameters, a), this.forgetHeldRows(t.componentId, t.dynamicParameters, a), k2(e, i), Ck(e, i), o !== null && zf(e, o.row, o.held), c) for (let t of i) Bf(e, t);
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
		switch (ha(e)) {
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
		let t = w(e.address?.component?.id), n = ma(e.address?.property), r = e.address?.component?.dynamicParameters ?? [];
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
			this.sinks.dispatch(i, x2(e, r, t, n)) || s("no collection sink is registered for the kind the component names.", {
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
			a || o ? l("a collection change for a host inside an item template is held until a row draws it.", { componentId: t }) : (fa(e.action) !== "Reset" || (e.items ?? []).length > 0) && s("items host was not found for a collection change update.", e);
			return;
		}
		let u = fa(e.action) === "Move" ? D2(e.moves ?? []) : S2;
		for (let n of c) a && this.held.isWaiting(n) || this.transfers.around(n, () => this.moves.around(n, u, () => this.applyCollectionChangeToHost(n, t, e)));
	}
	applyCollectionChangeToHost(e, t, n) {
		let r = W(e) === "virtualized", i = fa(n.action);
		try {
			r ? this.applyVirtualizedCollectionChange(e, n) : this.applyRowsChange(e, t, n);
		} finally {
			this.afterRowsChanged(e, t, !r && (i === "Insert" || i === "Replace"));
		}
	}
	applyRowsChange(e, t, n) {
		switch (fa(n.action)) {
			case "Insert":
				this.applyCollectionInsert(e, t, n.items ?? []);
				break;
			case "Remove":
				T2(e, n.items ?? [], n.trimmed === !0);
				break;
			case "Replace":
				this.applyCollectionReplace(e, t, n.items ?? []);
				break;
			case "Move":
				O2(e, n.moves ?? []);
				break;
			case "Reset":
				e.replaceChildren(), wk(e);
				break;
			default: s("collection update action is not supported.", n);
		}
	}
	afterRowsChanged(e, t, n) {
		this.touched?.add(e), t !== null && this.syncItemsHost(e, t), this.changedHosts?.add(e), (n || this.changedHosts === null) && this.dom.invalidate(e);
	}
	indexOfRow(e, t) {
		let n = W(e) === "virtualized" ? this.virtualization.keysOf(e)?.indexOf(t) ?? -1 : gk(e, G(e)).findIndex((e) => e.getAttribute(b) === t);
		return n < 0 ? null : n + _O(e);
	}
	moveRow(e, t, n) {
		let r = Va(e);
		if (r === null) return;
		let i = Math.max(0, n - _O(e));
		W(e) === "virtualized" ? this.virtualization.move(e, t, i) : O2(e, [{
			key: t,
			newIndex: i
		}]), this.afterRowsChanged(e, r, !1);
	}
	takeRow(e, t) {
		let n = G(e), r = M2(n, t);
		if (r === null) return null;
		let i = gk(e, n), a = i.indexOf(r);
		return yk(i, r), r.remove(), this.afterRowsChanged(e, Va(e), !1), {
			element: r,
			index: a
		};
	}
	restoreRow(e, t) {
		let n = gk(e, G(e));
		lA(t.element), e.insertBefore(t.element, vk(n, t.element, t.index)), this.afterRowsChanged(e, Va(e), !0);
	}
	placeRow(e, t, n, r) {
		let i = Va(e), a = i === null ? null : this.renderItemElement(i, n, t, this.itemsRenderer.getAncestorStack(e));
		return a === null ? null : (e.insertBefore(a, vk(gk(e, G(e)), a, r)), this.afterRowsChanged(e, i, !0), a);
	}
	removeRow(e, t) {
		yk(gk(e, G(e)), t), t.remove(), this.afterRowsChanged(e, Va(e), !1);
	}
	forgetRowState(e, t, n) {
		switch (fa(n.action)) {
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
		switch (fa(t.action)) {
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
			let e = Cq(r);
			e !== null && n.push(e);
		}
		return n;
	}
	applyCollectionInsert(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = gk(e, G(e));
		for (let a of n) {
			let n = a.key ?? null;
			if (n === null) {
				s("collection insert carried no item key.", a);
				continue;
			}
			let o = this.renderItemElement(t, a.item, n, r);
			o !== null && (e.insertBefore(o, vk(i, o, a.index ?? null)), Bf(e, o));
		}
	}
	renderItemElement(e, t, n, r) {
		try {
			return iZ(e, t, n, r, {
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
		let r = this.itemsRenderer.getAncestorStack(e), i = G(e), a = gk(e, i), o = N2(e, i);
		for (let i of n) {
			let n = i.key ?? null;
			if (n === null) {
				s("collection replace carried no item key.", i);
				continue;
			}
			let c = o.get(i.oldKey ?? n) ?? null, l = this.renderItemElement(t, i.item, n, r);
			if (l !== null) {
				if (o.delete(i.oldKey ?? n), o.set(n, l), c !== null) {
					let t = Rf(c);
					Sk(a, c, l), c.replaceWith(l), zf(e, l, t);
				} else e.insertBefore(l, vk(a, l, i.index ?? null));
			}
		}
	}
};
function w2(e, t) {
	if (ha(e) !== "CollectionChange") return !1;
	let n = e.component, r = t.closest(S);
	return r !== null && T(r) === w(n?.id) && ja(r, n?.dynamicParameters ?? []);
}
function T2(e, t, n) {
	let r = G(e), i = N2(e, r), a = /* @__PURE__ */ new Set();
	for (let e of t) {
		let t = e.key ?? null, n = t === null ? null : i.get(t) ?? null;
		t === null || n === null ? s("collection remove did not resolve an item.", e) : (i.delete(t), a.add(n));
	}
	if (a.size === 0) return;
	let o = Lf(e), c = o === null ? null : n ? E2(e, a) : Nf(o, r, a);
	bk(gk(e, r), a);
	for (let e of a) e.remove();
	c?.();
}
function E2(e, t) {
	let n = [];
	for (let e of t) {
		let t = Rf(e);
		t !== null && n.push(t);
	}
	return n.length === 0 ? null : () => {
		for (let t of n) zf(e, null, t);
	};
}
function D2(e) {
	return e.map((e) => e.key).filter((e) => typeof e == "string");
}
function O2(e, t) {
	let n = G(e), r = gk(e, n), i = N2(e, n);
	for (let n of t) {
		let t = n.key === null || n.key === void 0 ? null : i.get(n.key) ?? null;
		if (t === null) {
			s("collection move did not resolve an item.", n);
			continue;
		}
		let a = xk(r, t, n.newIndex ?? null);
		e.insertBefore(t, a ?? r[r.length - 2]?.nextSibling ?? null);
	}
}
function k2(e, t) {
	let n = null;
	for (let r of t) {
		let t = n === null ? G(e)[0] ?? null : n.nextElementSibling;
		r !== t && e.insertBefore(r, t), n = r;
	}
}
function A2(e, t) {
	for (let n of e.querySelectorAll(`[${x}]`)) if (!t.has(n)) return n;
	return null;
}
function j2(e) {
	let t = T(e);
	if (t > 0) return t;
	let n = e.firstElementChild;
	return n === null ? 0 : T(n);
}
function M2(e, t) {
	return e.find((e) => e.getAttribute("data-ui-key") === t) ?? null;
}
function N2(e, t = G(e)) {
	let n = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.getAttribute(b);
		t !== null && !n.has(t) && n.set(t, e);
	}
	return n;
}
//#endregion
//#region src/interactions/validation-words.ts
function P2(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = t.message;
	return E(n) || ac(n) || typeof n == "string" && n.length > 0 ? {
		message: n,
		severity: I2(t.severity)
	} : void 0;
}
function F2(e) {
	let t = e.message;
	if (e.content === !0) return String(t ?? "");
	let n = D.resolve(E(t) || ac(t) ? t : String(t ?? ""), !0);
	return typeof n == "string" ? n : "";
}
function I2(e) {
	let t = la(e);
	return t === "Unknown" ? "Error" : t;
}
//#endregion
//#region src/interactions/validation-engine.ts
var L2 = "ui-validation--warning", R2 = "ui-validation--info", z2 = "ui-validation-message--marker", B2 = "top-end", V2 = "right", H2 = "--ui-validation-marker-host", U2 = "ui-validation-mark", W2 = "--ui-validation-presentation", G2 = "--ui-validation-color", K2 = "Validation", q2 = /* @__PURE__ */ new Set(["Value", "EndValue"]), J2 = /* @__PURE__ */ new Set(["Min", "Max"]), Y2 = `input:not([type='hidden']), textarea, select, .${Ai}[role='combobox'], [role='spinbutton']`, X2 = {
	Error: 0,
	Warning: 1,
	Info: 2
}, Z2 = {
	Error: Gi,
	Warning: L2,
	Info: R2
}, Q2 = `.${Gi}, .${L2}, .${R2}`, $2 = {
	Error: "danger",
	Warning: "warning",
	Info: "info"
}, e4 = {
	Error: "error",
	Warning: "warning",
	Info: "info"
}, t4 = {
	Error: `${U2}--error`,
	Warning: `${U2}--warning`,
	Info: `${U2}--info`
}, n4 = {
	error: "Error",
	warning: "Warning",
	info: "Info"
}, r4 = class {
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
		}, !0), this.applyRenderedMessages(this.root.querySelectorAll(Q2)), B(this.root, Q2, {
			childList: !0,
			addedOnly: !0
		}, (e) => this.applyRenderedMessages(e)), D.onChange(() => {
			this.applyRenderedMessages(this.root.querySelectorAll(Q2)), this.rewriteMessageLines(), this.rejudgeBounds();
		}), D.onTable(() => this.rewriteShownMessages());
	}
	rewriteShownMessages() {
		for (let e of this.root.querySelectorAll(Q2)) {
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
			u4(t, c4(t) === "Error");
			let e = t.querySelector(`:scope > [${Ki}]`), n = e?.textContent ?? "";
			e !== null && n.length !== 0 && (this.recordRenderedMessage(t, e), d4(this.markerMirrors, t, e, {
				message: n,
				severity: c4(t)
			}));
		}
	}
	recordRenderedMessage(e, t) {
		if (this.renderedRead.has(e) || (this.renderedRead.add(e), this.resolveDisplay(T(e), e) !== void 0)) return;
		let n = Nc(t), r = c4(e);
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
		e.propertyName === K2 ? this.applyBoundMessage(e) : (this.applyGivenValue(e), this.applyChangeTrigger(e));
	}
	applyGivenValue(e) {
		let t = q2.has(e.propertyName), n = J2.has(e.propertyName);
		for (let r of e.components) {
			let i = this.refusalByElement.get(r)?.property === e.propertyName, a = this.boundRefusalByElement.has(r);
			a && n ? this.judgeBounds(T(r), r) : (i || a && t) && (i && this.refusalByElement.delete(r), t && this.forgetBoundRefusal(r), this.applyCurrentState(T(r), r));
		}
	}
	applyBoundMessage(e) {
		let t = w(e.reference.componentId), n = P2(e.value);
		for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) n === void 0 ? this.boundMessageByElement.delete(r) : this.boundMessageByElement.set(r, n), this.touchedElements.add(r), this.applyCurrentState(t, r);
	}
	applyChangeTrigger(e) {
		let t = w(e.reference.componentId), n = this.options.metadata.getValidationsForComponent(t).filter((t) => ca(t.trigger) === "Change" && t.target.propertyId === e.reference.propertyId);
		if (n.length !== 0) for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) this.evaluateAndApply(t, r, n, e.value);
	}
	applyServerRefusal(e) {
		let t = w(e.address?.component?.id), n = e.address?.component?.dynamicParameters ?? [], r = e.message ?? "", i = E(r) || typeof r == "string" && r.length > 0;
		for (let a of this.options.dom.findAllComponents(t, n)) i ? (this.refusalByElement.set(a, {
			message: r,
			severity: I2(e.severity),
			content: e.content === !0,
			property: ma(e.address?.property)
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
		let n = A(t) || O(t) ? null : o4(t, (e) => this.readValue(e)), r = this.boundRefusalByElement.get(t)?.message;
		return s4(r, n) || (n === null ? this.forgetBoundRefusal(t) : (this.boundRefusalByElement.set(t, {
			message: n,
			severity: "Error"
		}), this.boundRefused.add(t), this.touchedElements.add(t), this.refusalByElement.delete(t)), this.applyCurrentState(e, t)), n !== null;
	}
	readValue(e) {
		return this.options.readValue?.(e) ?? this.options.valueReaders.readBound(e);
	}
	readRuleValue(e) {
		let t = zl(e);
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
			severity: n4[t]
		}), this.applyCurrentState(T(e), e);
	}
	entryRefusal(e, t, n) {
		for (let r of this.options.metadata.getValidationsForComponent(T(e))) if (I2(r.severity) === "Error" && i4(t, r) && !i4(n, r)) return r.message;
		return null;
	}
	judge(e, t) {
		let n = null;
		for (let r of this.options.metadata.getValidationsForComponent(e)) !i4(t, r) && (n === null || X2[I2(r.severity)] < X2[I2(n.severity)]) && (n = r);
		return n === null ? null : {
			severity: e4[I2(n.severity)],
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
		l4(this.markerMirrors, t, n), this.writeMessageElsewhere(e, t, n);
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
		}, [], [...e.lines.values()].map(F2).join("\n"), !0);
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
			severity: I2(t.severity)
		});
		let c;
		for (let e of n) (c === void 0 || X2[e.severity] < X2[c.severity]) && (c = e);
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
		let r = this.options.metadata.getValidationsForComponent(n.componentId).filter((e) => ca(e.trigger) === t);
		r.length !== 0 && this.evaluateAndApply(n.componentId, n.element, r, this.readRuleValue(n.element));
	}
	runSubmitValidation(e) {
		let t = !0, n = /* @__PURE__ */ new Set();
		for (let { component: r } of this.formFields(e)) {
			if (n.has(r.element)) continue;
			n.add(r.element);
			let e = this.options.metadata.getValidationsForComponent(r.componentId).filter((e) => ca(e.trigger) === "Submit");
			e.length > 0 && (this.touchedElements.add(r.element), this.evaluateAndApply(r.componentId, r.element, e, this.readRuleValue(r.element))), this.hasError(r.componentId, r.element) && (t = !1, this.touchedElements.has(r.element) || (this.touchedElements.add(r.element), this.applyCurrentState(r.componentId, r.element)));
		}
		return t;
	}
	*formFields(e) {
		for (let t of this.root.querySelectorAll(`[${on}="${Ji(e)}"]`)) {
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
			let e = [...t.element.querySelectorAll(Y2)].find((e) => e.closest("[role='listbox'], [role='menu'], [role='dialog']") === null) ?? null;
			if (e !== null) return e.focus({ preventScroll: !0 }), e.scrollIntoView({
				block: "center",
				behavior: Lm() ? "auto" : "smooth"
			}), !0;
		}
		return !1;
	}
	hasError(e, t) {
		if (this.boundRefusalByElement.has(t) || this.refusalByElement.get(t)?.severity === "Error") return !0;
		let n = this.failingRulesByElement.get(t);
		if (n === void 0) return !1;
		for (let t of this.options.metadata.getValidationsForComponent(e)) if (n.has(t) && I2(t.severity) === "Error") return !0;
		return !1;
	}
	evaluateAndApply(e, t, n, r) {
		let i = this.failingRulesByElement.get(t);
		i === void 0 && (i = /* @__PURE__ */ new Set(), this.failingRulesByElement.set(t, i));
		for (let e of n) i4(r, e) ? i.delete(e) : i.add(e);
		this.touchedElements.has(t) && this.applyCurrentState(e, t);
	}
};
function i4(e, t) {
	return oa(t.operator) !== "Required" && a4(e) ? !0 : Cm(e, t.operator, t.value);
}
function a4(e) {
	return e !== !1 && !Cm(e, "Required", null);
}
function o4(e, t) {
	return lO(e, t) ?? (e.matches(".ui-temporal-input, .ui-calendar") ? qj(e) : null);
}
function s4(e, t) {
	return e === void 0 || t === null ? e === void 0 && t === null : E(e) && e.key === t.key && JSON.stringify(e.args) === JSON.stringify(t.args);
}
function c4(e) {
	return e.classList.contains(L2) ? "Warning" : e.classList.contains(R2) ? "Info" : "Error";
}
function l4(e, t, n) {
	for (let e of Object.values(Z2)) t.classList.toggle(e, n !== void 0 && Z2[n.severity] === e);
	u4(t, n?.severity === "Error");
	let r = t;
	n === void 0 ? r.style.removeProperty(G2) : r.style.setProperty(G2, `var(--ui-color-${$2[n.severity]}-ink)`);
	let i = t.querySelector(":scope > [data-ui-validation-message]") ?? t.querySelector("[data-ui-validation-message]");
	i !== null && (n?.content === !0 ? (jc(i, null), i.textContent = String(n.message ?? "")) : D.writeValue(i, null, n?.message ?? null), d4(e, r, i, n));
}
function u4(e, t) {
	for (let n of e.querySelectorAll(Y2)) {
		let r = n.closest(ki);
		r !== null && e.contains(r) || (t ? n.setAttribute("aria-invalid", "true") : n.removeAttribute("aria-invalid"));
	}
}
function d4(e, t, n, r) {
	let i = getComputedStyle(n), a = i.getPropertyValue(W2).trim(), o = r !== void 0 && a === "marker";
	n.classList.toggle(z2, o), f4(e, t, a === "elsewhere" ? void 0 : r, n.textContent ?? "", i.getPropertyValue(H2).trim()), r !== void 0 && o ? (n.setAttribute(Re, No(n.textContent ?? "")), n.setAttribute(ze, B2), n.setAttribute(Ve, e4[r.severity]), t.setAttribute(Be, ""), t.contains(document.activeElement) ? IL(n) : LL(n)) : (n.removeAttribute(Re), n.removeAttribute(ze), n.removeAttribute(Ve), t.removeAttribute(Be), LL(n));
}
function f4(e, t, n, r, i) {
	let a = e.get(t), o = n === void 0 || i.length === 0 ? null : m4(t, i);
	if (n === void 0 || o === null) {
		a !== void 0 && p4(a), e.delete(t);
		return;
	}
	let s = a ?? document.createElement("span");
	s.className = `${U2} ${t4[n.severity]}`, s.textContent = r, s.setAttribute(Re, No(r)), s.setAttribute(ze, V2), s.setAttribute(Ve, e4[n.severity]), s.setAttribute(He, ""), s.parentElement !== o && (p4(s), o.append(s)), o.setAttribute(Be, ""), e.set(t, s), LL(s);
}
function p4(e) {
	let t = e.parentElement;
	e.remove(), t !== null && t.querySelector(`:scope > .${U2}`) === null && t.removeAttribute(Be);
}
function m4(e, t) {
	for (let n = e.parentElement; n !== null; n = n.parentElement) {
		let e = n.querySelector(`:scope > .${t}`);
		if (e !== null) return e;
	}
	return null;
}
//#endregion
//#region src/items/row-decorators.ts
var h4 = class {
	decorators = /* @__PURE__ */ new Map();
	register(e) {
		this.decorators.set(e.kind, e.decorate);
	}
	get(e) {
		return this.decorators.get(e);
	}
}, g4 = "card-header-shown", _4 = `[${Li}], [${Ri}], [${Bi}], [${Vi}], [${Hi}]`;
function v4(e) {
	let t = e.parentElement?.parentElement;
	if (t == null || !t.classList.contains("ui-card__header")) return;
	let n = !e.matches(_4);
	t.classList.contains("ui-card__header--empty") !== n && t.classList.toggle(Ui, n);
}
//#endregion
//#region src/updates/menu-surface.ts
var y4 = "menu-surface";
function b4(e) {
	let t = e.parentElement;
	t !== null && t.matches(".ui-context-menu, .ui-split-button__menu") && C(t, _n, IC(e));
}
//#endregion
//#region src/updates/tooltip-name.ts
var x4 = "tooltip-name";
function S4(e, t, n) {
	let r = Mo(e.getAttribute(Re));
	jc(t, n), r.trim().length === 0 ? t.hasAttribute(n) && t.removeAttribute(n) : t.getAttribute(n) !== r && t.setAttribute(n, r);
}
//#endregion
//#region src/updates/dom-operation-registry.ts
var C4 = /* @__PURE__ */ new WeakMap(), w4 = /* @__PURE__ */ new WeakMap(), T4 = class {
	handlers = /* @__PURE__ */ new Map();
	constructor() {
		this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(ua(e), t);
	}
	apply(e) {
		let t = ua(e.operation.kind), n = this.handlers.get(t);
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
		this.register("Text", (e) => E4(e)), this.register("Markup", (e) => {
			e.target.hasAttribute("data-ui-plain-text") ? E4(e) : (Po(e.target, Pl(e.convertedValue) ? "" : Nl(e.convertedValue)), jc(e.target, null));
		}), this.register("Attribute", (e) => {
			let t = M4(e.operation);
			jc(e.target, t), e.operation.convertsNull !== !0 && Pl(e.value) || Pl(e.convertedValue) ? C(e.target, t, null) : C(e.target, t, Nl(e.convertedValue));
		}), this.register("RemoveAttribute", (e) => {
			let t = M4(e.operation);
			jc(e.target, t), C(e.target, t, null);
		}), this.register("ToggleAttribute", (e) => {
			let t = M4(e.operation), n = e.operation.condition ?? "HasValue", r = !Pl(e.value) && D4(e.value, n), i = e.operation.value ?? (Pl(e.convertedValue) || O4(n) ? "" : Nl(e.convertedValue));
			k4(e.target, j4(e), t, r, i);
		}), this.register("Class", (e) => {
			let t = !Pl(e.value) && D4(e.value, e.operation.condition ?? "None") ? Nl(e.convertedValue).trim() : "";
			A4(e.target, j4(e), t, AC(e.operation.converter ?? ""));
		}), this.register("ToggleClass", (e) => {
			let t = M4(e.operation), n = !Pl(e.value) && D4(e.value, e.operation.condition ?? "IsTrue");
			if (e.target.classList.toggle(t, n), e.operation.converter !== null && e.operation.converter !== void 0 && e.operation.converter.trim().length > 0) {
				let t = n ? Nl(e.convertedValue).trim() : "";
				A4(e.target, j4(e), t, AC(e.operation.converter));
			}
		}), this.register("Style", (e) => {
			let t = M4(e.operation), n = e.target;
			if (Pl(e.value) || Pl(e.convertedValue) || e.convertedValue === "") {
				n.style.getPropertyValue(t).length > 0 && n.style.removeProperty(t);
				return;
			}
			let r = Nl(e.convertedValue);
			n.style.getPropertyValue(t) !== r && n.style.setProperty(t, r);
		}), this.register("Data", () => {}), this.register(x4, (e) => S4(e.resolved.component, e.target, M4(e.operation))), this.register(Y$, (e) => Q$(e.target, e.value)), this.register(g4, (e) => v4(e.resolved.component)), this.register(Bc, (e) => Vc(e.target)), this.register(U$, (e) => J$(e.target)), this.register(EP, (e) => OP(e.target)), this.register(jP, (e) => PP(e.resolved.component)), this.register(Hx, (e) => {
			let t = eS(e.target);
			t !== "keep" && k4(e.resolved.component, Hx, M4(e.operation), t === "show", "");
		}), this.register(y4, (e) => b4(e.target)), this.register("Property", (e) => {
			let t = M4(e.operation), n = e.target, r = Pl(e.convertedValue) ? "" : e.convertedValue;
			n[t] !== r && (n[t] = r);
		});
	}
};
function E4(e) {
	let t = Nl(e.convertedValue);
	e.target.textContent !== t && (e.target.textContent = t), jc(e.target, null);
}
function D4(e, t) {
	switch (da(t)) {
		case "None": return !0;
		case "HasValue": return !Pl(e);
		case "HasText": return typeof e == "string" ? e.trim().length > 0 : !Pl(e) && String(e).trim().length > 0;
		case "IsTrue": return e === !0;
		case "IsFalse": return e === !1;
		case "DrawsIcon": return yo(e).length > 0;
		default: return !Pl(e);
	}
}
function O4(e) {
	let t = da(e);
	return t === "IsTrue" || t === "IsFalse";
}
function k4(e, t, n, r, i) {
	let a = w4.get(e);
	a === void 0 && (a = /* @__PURE__ */ new Map(), w4.set(e, a));
	let o = a.get(n);
	o === void 0 && (o = /* @__PURE__ */ new Set(), a.set(n, o)), r ? (o.add(t), C(e, n, i)) : (o.delete(t), o.size === 0 && C(e, n, null));
}
function A4(e, t, n, r) {
	let i = C4.get(e);
	i === void 0 && (i = /* @__PURE__ */ new Map(), C4.set(e, i));
	let a = i.get(t);
	if (a === void 0 && r !== void 0) for (let t of Array.from(e.classList)) t !== n && r(t) && e.classList.remove(t);
	a === n ? n.length > 0 && !e.classList.contains(n) && e.classList.add(n) : (a !== void 0 && a.length > 0 && e.classList.remove(a), n.length === 0 ? i.delete(t) : (e.classList.add(n), i.set(t, n)));
}
function j4(e) {
	return `${e.resolved.componentId}:${e.resolved.propertyId}:${e.operation.kind}:${e.operation.name ?? ""}:${e.operation.converter ?? ""}`;
}
function M4(e) {
	let t = e.name;
	if (t == null || t.trim().length === 0) throw Error(`Operation '${e.kind}' requires a name.`);
	return t;
}
//#endregion
//#region src/extensions/converters.ts
var N4 = class {
	converters = /* @__PURE__ */ new Map();
	constructor() {
		this.register({
			name: "*",
			canConvert: (e) => FC.has(e.name),
			convert: (e) => FC.get(e.name)(e.value)
		});
	}
	register(e) {
		let t = P4(e.name), n = {
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
function P4(e) {
	let t = e.trim();
	if (t.length === 0) throw Error("Converter name is required.");
	return t;
}
//#endregion
//#region src/extensions/events.ts
var F4 = class {
	definitions = /* @__PURE__ */ new Map();
	register(e) {
		let t = Ca(e.name);
		if (t.length === 0) throw Error("Event name is required.");
		let n = Ca(e.domEventName) || t;
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
		return this.definitions.get(Ca(e));
	}
};
function I4(e, t) {
	e.root.addEventListener("toggle", (n) => {
		n.target instanceof HTMLDetailsElement && n.target.open === t && e.dispatch(n);
	}, !0);
}
function L4(e) {
	e.register({
		name: "click",
		attach: (e) => {
			e.root.addEventListener("click", e.dispatch, !0), e.root.addEventListener(jf, e.dispatch, !0);
		}
	}), e.registerNative("change"), e.registerNative("focus"), e.registerNative("blur"), e.registerNative("mouse-enter", "mouseenter"), e.registerNative("mouse-leave", "mouseleave"), e.registerNative("toggle"), e.register({
		name: "expand",
		domEventName: "toggle",
		attach: (e) => I4(e, !0)
	}), e.register({
		name: "collapse",
		domEventName: "toggle",
		attach: (e) => I4(e, !1)
	}), e.registerNative("open"), e.registerNative("close"), e.registerNative("search"), e.registerNative("enter"), e.registerNative("escape"), e.registerNative("rename"), e.registerNative("unfold"), e.registerNative("move"), e.registerNative("remove");
}
//#endregion
//#region src/extensions/extension-registry.ts
var R4 = class {
	converters = new N4();
	events = new F4();
	operations = new T4();
	valueReaders;
	collectionSinks = new b2();
	rowDecorators = new h4();
	constructor(e, t, n, r) {
		L4(this.events), this.valueReaders = new Il(r);
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
}, z4 = "Submenu", B4 = "ui-menu__submenu", V4 = "Select", H4 = ["Header", "Separator"], U4 = {
	kind: "menu",
	decorate: W4
};
function W4(e) {
	if (H4.includes(K4(e.item, "Kind")) && e.row.setAttribute(hn, ""), !G4(e.item)) return;
	let t = e.templates.getVariantTemplate(e.componentId, z4);
	if (t === void 0) {
		s("menu submenu template was not found.", { componentId: e.componentId });
		return;
	}
	let n = e.renderer.renderFromTemplate(t, e.item, e.ancestors);
	if (n === null) return;
	e.row.setAttribute(un, ""), K4(e.item, "Kind") === V4 && e.row.setAttribute(dn, ""), K4(e.item, "Expanded") === !0 && e.row.setAttribute(fn, "");
	let r = document.createElement("div");
	r.className = B4, r.appendChild(n), fX(r, e.key, e.item), e.row.appendChild(r);
}
function G4(e) {
	let t = K4(e, "Items");
	return Array.isArray(t) && t.length > 0;
}
function K4(e, t) {
	let n = KO(e, t);
	return n.ok ? n.value : void 0;
}
//#endregion
//#region src/items/row-grip.ts
var q4 = {
	kind: "grip",
	decorate: J4
};
function J4(e) {
	e.row.append(Y4());
}
function Y4() {
	let e = document.createElement("span");
	return e.className = _e, e.setAttribute("role", "button"), D.write(e, "aria-label", "ui.row.drag"), e;
}
//#endregion
//#region src/rendering/page-culture.ts
function X4(e, t, n) {
	let r = t === null ? null : JSON.stringify(t), i = n === null ? null : JSON.stringify(Q4(n));
	for (let t of e.querySelectorAll(`[${mt}]`)) Z4(t, pt, r), Z4(t, vt, i);
}
function Z4(e, t, n) {
	n !== null && e.hasAttribute(t) && e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function Q4(e) {
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
var $4 = `[${bt}]`;
function e3(e) {
	for (let t of e.querySelectorAll($4)) t.removeAttribute(bt);
}
//#endregion
//#region src/runtime/engine-start.ts
var t3 = 2;
function n3(e, t, n) {
	let r = u() ? performance.now() : -1;
	try {
		t(n);
	} catch (t) {
		c(`the ${e} engine failed to start; the page goes on without it.`, t);
	}
	if (r >= 0) {
		let t = performance.now() - r;
		t >= t3 && l(`the ${e} engine took ${f(t)} to start.`);
	}
}
function r3(e) {
	return e.name.length > 0 ? `"${e.name}" package` : "package";
}
//#endregion
//#region src/runtime/web-ui-runtime.ts
var i3 = "ne.standard.ui.windowId", a3 = [
	500,
	1e3,
	2e3
], o3 = 3, s3 = [
	["refusal", ({ root: e }) => dY(e)],
	["file input", ({ root: e, validation: t }) => new Py({
		root: e,
		validation: t
	})],
	["image input", ({ root: e, validation: t, propertyPatchEngine: n, dialogs: r }) => new qb({
		root: e,
		validation: t,
		propertyPatchEngine: n,
		dialogs: r
	})],
	["key value action", ({ root: e, dom: t, propertyPatchEngine: n, validation: r }) => new fx({
		root: e,
		dom: t,
		propertyPatchEngine: n,
		validation: r
	})],
	["field keys", ({ root: e, propertyPatchEngine: t }) => new Rx({
		root: e,
		propertyPatchEngine: t
	})],
	["field box press", ({ root: e }) => new Sx({ root: e })],
	["image fallback", ({ root: e }) => new fS({ root: e })],
	["radio group sync", ({ root: e }) => new kS({ root: e })],
	["select interaction", ({ root: e, validation: t }) => new fE({
		root: e,
		validation: t
	})],
	["search input", ({ root: e }) => new iT({ root: e })],
	["debounced commit", ({ root: e }) => new jx({ root: e })],
	["commit gate", ({ root: e, propertyPatchEngine: t }) => new jE({
		root: e,
		propertyPatchEngine: t
	})],
	["text area grow", ({ root: e, propertyPatchEngine: t }) => PE() ? void 0 : new FE({
		root: e,
		propertyPatchEngine: t
	})],
	["items selection", ({ root: e, heldRows: t }) => new _G({
		root: e,
		rows: t
	})],
	["range value", ({ root: e, propertyPatchEngine: t }) => new cD({
		root: e,
		propertyPatchEngine: t
	})],
	["color input", ({ root: e, propertyPatchEngine: t }) => new sU({
		root: e,
		propertyPatchEngine: t
	})],
	["temporal picker", ({ root: e, propertyPatchEngine: t }) => new qM({
		root: e,
		propertyPatchEngine: t
	})],
	["theme switcher", ({ root: e, effects: t, dom: n }) => new jN({
		root: e,
		effects: t,
		dom: n
	})],
	["language switcher", ({ root: e, effects: t, dom: n }) => new BN({
		root: e,
		effects: t,
		dom: n
	})],
	["time segment", ({ root: e, propertyPatchEngine: t }) => new eq({
		root: e,
		propertyPatchEngine: t
	})],
	["timestamp", ({ root: e, propertyPatchEngine: t }) => new _q({
		root: e,
		propertyPatchEngine: t
	})],
	["file tile", ({ root: e, propertyPatchEngine: t }) => new bq({
		root: e,
		propertyPatchEngine: t
	})],
	["context menu", ({ root: e, dom: t }) => new TF({
		root: e,
		dom: t
	})],
	["split button", ({ root: e }) => new xV({ root: e })],
	["toggle button", ({ root: e }) => new yx({ root: e })],
	["button group", ({ root: e }) => new DV({ root: e })],
	["menu", ({ root: e }) => new qL({ root: e })],
	["action bar", ({ root: e, dom: t }) => new dI({
		root: e,
		dom: t
	})],
	["collapsible", ({ root: e }) => new Yz({ root: e })],
	["menu group", ({ root: e }) => new XP({ root: e })],
	["menu search", ({ root: e }) => new iz({ root: e })],
	["side drawer", ({ root: e }) => new Fz({ root: e })],
	["screen keyboard", () => new mz()],
	["window foot", ({ root: e }) => new wz({ root: e })],
	["grid splitter", ({ root: e }) => new lB({ root: e })],
	["pane container", ({ root: e }) => new IB({ root: e })],
	["accordion", ({ root: e }) => new jV({ root: e })],
	["tabs", ({ root: e }) => new nH({ root: e })],
	["tabs view", ({ root: e, effects: t }) => new jK({
		root: e,
		effects: t
	})],
	["command bar", ({ root: e }) => new gH({ root: e })],
	["breadcrumbs", ({ root: e }) => new jH({ root: e })],
	["scroll anchor", ({ root: e }) => new Rq({ root: e })],
	["visible keys", ({ root: e }) => new WY({ root: e })],
	["surface press", ({ root: e }) => new OU({ root: e })],
	["text selection", ({ root: e }) => new Gq({ root: e })],
	["scroll group", ({ root: e }) => new Qq({ root: e })],
	["flyout interaction", ({ root: e }) => new q_({ root: e })],
	["text fold", ({ root: e }) => new WK({ root: e })],
	["tooltip", ({ root: e }) => nL(e)]
], c3 = class {
	windowId;
	options;
	root;
	culturesLanguage = document.documentElement.lang;
	metadata = new ea(NZ());
	hydration = LZ();
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
	navigationProgress = new V0({ window });
	sessionKey = sy;
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
		this.options = e, this.root = e.root ?? document, this.windowId = QZ(e.windowIdStorageKey ?? i3, (e) => this.reloadAsOwnTab(e)), this.dom = new Ba(this.root), D.load(this.root), D.setLanguage(document.documentElement.lang), e.strings !== void 0 && D.register(e.strings), this.gateInbound(this.hydration?.words === null || this.hydration?.words === void 0 ? null : D.loadTableAsync(this.hydration.words.href)), this.extensions = new R4(e.converters, e.eventDefinitions, e.domOperations, e.valueReaders), this.extensions.registerRowDecorator(U4), this.extensions.registerRowDecorator(q4), this.extensions.registerRowDecorator(SS);
		let t = new Oa(this.dom, this.metadata), n = this.extensions.operations, r = new bQ(), i = new Y0(t, n, this.extensions, r);
		this.reactiveSources = new $0(i, {
			root: this.root,
			valueReaders: this.extensions.valueReaders,
			metadata: this.metadata
		}), this.dialogs = new T0({
			root: this.root,
			dom: this.dom
		}), this.notifications = new J1({
			root: this.root,
			dom: this.dom
		}), this.address = new W0({
			window,
			revisit: (e) => void this.navigateInPlaceAsync(e),
			switchRuntime: (e, t) => this.revisitRuntime(e, t),
			load: () => this.reload()
		});
		let a = (e) => this.eventPipeline.dispatchCommandAsync({
			eventId: 0,
			action: e,
			dynamicParameters: []
		}).catch((e) => (s("running a notification's action failed.", e), !1)), o = (e) => uK(e, (e) => this.leaveGuard.navigate(e), (e) => void a(e)), u = WZ(document.documentElement, this.windowId, o);
		this.effects = new p0({
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
			systemNotifications: cK(u)
		});
		let d = new jm(this.metadata), f, p = new _m(d, i, new Sm(), {
			root: this.root,
			effects: this.effects,
			dom: this.dom,
			metadata: this.metadata,
			valueReaders: this.extensions.valueReaders,
			writeBack: (e, t, n) => {
				f?.syncPropertyAsync(w(e.componentId), e.propertyId, t, n).catch((e) => s("writing an interaction's value back failed.", e));
			}
		}), m = new wZ(this.dom), h = new cX(this.metadata, m, this.extensions, n, r), g = new OZ({
			root: this.root,
			render: (e, t) => h.renderPart(e, t),
			drawn: (e) => this.updateProcessor.fillDrawnPart(e),
			heldRows: (e) => this.updateProcessor.forEachHeldRow(e)
		});
		g.scan(), wF((e) => g.draw(e)), this.rowMenus = g, this.virtualization = new cZ({
			root: this.root,
			metadata: this.metadata,
			templates: m,
			renderer: h,
			state: r,
			dom: this.dom
		}), this.updateProcessor = new C2(this.metadata, i, r, h, m, this.dom, this.virtualization, this.extensions.collectionSinks, g), D.onChange(() => this.rewriteWords(i, h)), this.rewriteMoments = () => this.rewriteWords(i, h, !0), D.onMomentTick(this.rewriteMoments), this.ruleWatcher = new yX({
			root: this.root,
			metadata: this.metadata,
			templates: m,
			renderer: h,
			state: r,
			propertyPatchEngine: i,
			reactiveSources: this.reactiveSources,
			virtualization: this.virtualization
		}), this.transport = new P$(this.windowId, (e, t) => this.applyChanges(e, t, this.heldRuntime), e.signalR), this.clientState = new sK({ report: (e) => this.transport.reportClientStateAsync(e) }), this.dispatcher = new hQ(this.transport), D.setAsker((e, t) => this.transport.translateAsync(e, t)), this.effects.register($i.SetLanguage, (e) => {
			let t = e.effect, n = t.language;
			if (typeof n != "string" || n.trim().length === 0) {
				s("set language effect carries no language.", e.effect);
				return;
			}
			let r = typeof t.href == "string" && t.href.length > 0 ? t.href : null;
			this.switchLanguageAsync(n, r).catch((e) => s("switching the page's language failed.", e));
		}), this.effects.register($i.SetThemeColors, (e) => {
			let t = e.effect, n = ++this.themeColorChanges;
			typeof t.css == "string" ? jZ(document.head, t.css) : this.transport.setThemeColorsAsync(t.colors ?? null).then((e) => {
				n === this.themeColorChanges && jZ(document.head, e);
			}).catch((e) => s("applying the reader's colours failed.", e));
		});
		let _ = new z$(this.transport);
		f = new Up({
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
			Ox(), await _.whenAnsweredAsync();
		}, this.effects.register($i.DiscardForm, (e) => {
			let t = e.effect.formId;
			if (typeof t == "string" && t.length !== 0) {
				for (let n of f?.releaseForm(t) ?? []) i.restoreBoundValue(n, e.dom.resolveNearestComponent(n, () => !0)?.dynamicParameters ?? []);
				v.discardForm(t);
			}
		}), this.leaveGuard = new I0({
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
			confirm: (e, t) => N0(this.dialogs, t),
			pending: () => Dx() || _.isBusy,
			settle: () => this.settleValues(),
			follow: (e) => this.followInPlace(e)
		}), this.updateProcessor.addPageHandler((e) => this.leaveGuard.set(e.holdsUnsavedWork === !0)), this.effects.register(iy, (e) => this.sessionKey.start(e.effect.token)), this.effects.register($i.ConfirmLeave, (e) => {
			let t = e.effect.target;
			$a(t) ? this.leaveGuard.confirm(t) : s("confirm leave effect names no address of this site; nothing asked.", e.effect);
		});
		let v = new r4({
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
		for (let [e, t] of s3) n3(e, t, this.engineContext);
		n3("number input", ({ root: e, propertyPatchEngine: t }) => {
			this.numberInputs = new sO({
				root: e,
				propertyPatchEngine: t
			});
		}, this.engineContext), n3("tree", ({ root: e, effects: t }) => new qG({
			root: e,
			effects: t,
			rules: {
				metadata: this.metadata,
				state: r,
				renderer: h
			}
		}), this.engineContext), n3("items reorder", ({ root: e }) => new Kk({
			root: e,
			services: {
				metadata: this.metadata,
				state: r,
				keysOf: (e) => this.virtualization.keysOf(e)
			}
		}), this.engineContext), n3("press ripple", ({ root: e }) => new dJ({
			root: e,
			clicks: (e) => this.metadata.hasServerEventForComponent("click", T(e)) || p.hasEventForComponent("click", T(e)),
			waves: document.documentElement.hasAttribute(zr)
		}), this.engineContext), n3("overlay scrollbars", () => document.documentElement.hasAttribute("data-ui-overlay-scrollbars") ? new PJ() : void 0, this.engineContext), this.eventPipeline = new em({
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
		this.eventPipeline.addEvent(DK.name, DK.registration);
		let ee = (e) => this.updateProcessor.resortHost(e), te = Uk({
			ahead: (e, t, n) => this.updateProcessor.moves.ahead(e, t, n),
			settle: (e) => this.updateProcessor.moves.settle(e),
			resort: ee
		});
		this.eventPipeline.addEvent(te.name, te.registration);
		let ne = kK(ee);
		this.eventPipeline.addEvent(ne.name, ne.registration), this.eventPipeline.addEvent(KG.name, KG.registration);
		let re = OA(this.updateProcessor.transfers);
		for (let e of this.metadata.getEventNames()) e.startsWith("drop:") && this.eventPipeline.addEvent(e, re);
		this.eventPipeline.addEvent(Ix.name, Ix.registration), this.eventPipeline.addEvent(eT.name, eT.registration), n3("shortcuts", ({ root: e, dom: t }) => new iR({
			root: e,
			viewShortcuts: aR(this.metadata.metadata),
			componentOf: (e) => t.findComponent(e, []),
			laterChords: this.rowMenus
		}), this.engineContext), n3("item drag", ({ root: e, dom: t }) => new jA({
			root: e,
			targetOf: (e, n) => {
				let r = t.resolveNearestComponent(e, (e) => this.metadata.hasServerEventForComponent("drop:" + n, e))?.element ?? null;
				return r instanceof HTMLElement ? r : null;
			},
			keysOf: (e) => this.virtualization.keysOf(e)
		}), this.engineContext), this.tables = new cW({ root: this.root }), this.windows = new LX({
			root: this.root,
			requestWindow: (e) => this.transport.requestItemWindowAsync(e)
		}), this.updateProcessor.addWindowRefillHandler((e) => this.windows.refilled(e)), n3("pager", ({ root: e, dom: t }) => new VR({
			root: e,
			dom: t,
			windows: this.windows
		}), this.engineContext), this.pluginContext = {
			...this.engineContext,
			strings: D,
			observeComponents: B,
			observeSize: eB,
			store: new wP(),
			numbers: RD,
			temporal: Rs,
			icons: { apply: go },
			badges: { writeCount: Ow },
			urls: {
				isImageSource: ro,
				asBrowserReads: no,
				isSafeLink: Ya,
				isExternalLink: Qa
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
				let r = e.closest(S), a = r === null ? void 0 : this.metadata.getExposedProperty(T(r), t);
				return r === null || a === void 0 ? (s("a package set a property its component's renderer did not expose.", { propertyName: t }), !1) : i.applyToComponent(r, a, n);
			} },
			windows: this.windows,
			tooltips: FL,
			renames: { open: lu },
			tables: this.tables,
			rows: iX(m, h, this.virtualization),
			uploads: Cy(v),
			selection: Pd,
			popups: kY(this.dom),
			roving: Uu,
			typeAhead: TN,
			focus: gp,
			states: el,
			validation: v,
			wheel: rb,
			colors: LY,
			shortcuts: ku,
			names: qi
		}, this.transport.onChanges((e, t) => void this.applyChanges(e, void 0, t)), this.transport.onCommandResult((e, t) => {
			cy(this.sessionKey, e.command?.effects);
			let { changes: n, ...r } = e;
			yQ(() => this.applyChanges(n, void 0, t), () => {
				this.holdsRuntime(t) && !this.dispatcher.settle(r) && (this.effects.applyAll(e.command?.effects, this.dom), this.windows.reconsider());
			}).catch((e) => c("a pushed command result could not be applied.", e));
		}), this.updateProcessor.addFullResyncHandler(() => {
			this.attachAsync().catch((e) => c("re-attaching after a full resync failed.", e));
		}), this.transport.onReconnecting((e) => {
			s("SignalR reconnecting.", e), this.dispatcher.release(Error("the connection to the server dropped before the command answered.", { cause: e }));
		}), this.transport.onReconnected(async () => {
			l("SignalR reconnected. Reattaching runtime."), await this.attachAsync();
		}), this.transport.onClosed((e) => this.loseConnection(e ?? /* @__PURE__ */ Error("the connection to the server closed."))), this.connection = new sQ({
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
		let t = zl(e);
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
		return r.length > 0 && this.heldRuntime !== null && !this.connectionLost && e === window.location.pathname && m3() === null && K0(t, n, r);
	}
	async switchRuntimeAsync() {
		this.endSwitchProgress = this.navigationProgress.start();
		try {
			await this.settleValues();
		} catch (e) {
			s("the values still on their way did not settle before the page went to another runtime.", e);
		}
		this.dialogs.closeAll(), this.dispatcher.release(/* @__PURE__ */ Error("the page went to another runtime of its route before the command answered.")), this.transport.holdCalls();
		let e = u3();
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
		this.dom.invalidate(), D.language !== this.culturesLanguage && (this.culturesLanguage = D.language, Rc(this.root, (e) => X4(e, D.number, D.temporal)));
		let i = n ? cc : void 0;
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
		Rc(this.root, (e) => {
			e !== this.root && r.push(e);
		});
		for (let t of n) {
			let n = w(t.componentId), i = {
				componentId: n,
				propertyId: t.propertyId
			}, a = t.dynamicParameters ?? [];
			for (let r of this.findWordInstances(n, a)) e.rewriteStatic(r, i, t.key);
			for (let o of r) for (let r of o.querySelectorAll(`[${y}="${Ji(n)}"]`)) Ma(r, a) && e.rewriteStatic(r, i, t.key);
		}
	}
	findWordInstances(e, t) {
		if (t.length === 0) return this.dom.findEveryComponent(e);
		let n = this.dom.findAllComponents(e, t);
		return n.length > 0 ? n : this.dom.findAllComponents(e, []).filter((e) => Ma(e, t));
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
		let t = JZ(e, navigator.cookieEnabled, XZ());
		t === "no-cookie" ? this.loseConnection(/* @__PURE__ */ Error(`the server asked for a reload of view '${e}', and this browser keeps no cookie the reload could write.`)) : t === "asked-again" ? this.loseConnection(/* @__PURE__ */ Error(`the server asked for a reload of view '${e}' again after one (another compile of the view, or a session cookie the browser does not keep).`)) : (s("the server asked for a reload (another compile of the view, or a session it no longer holds); reloading.", { view: e }), this.leaveGuard.release(), this.reload());
	}
	reloadAsOwnTab(e) {
		s("another live tab holds this tab's id; reloading under one of its own.", { id: e }), this.leaveGuard.release(), this.reload();
	}
	reloadForFreshRuntime(e) {
		JZ(e, navigator.cookieEnabled, XZ()) === "reload" ? (s("the page's runtime is gone and the server built a new one; reloading.", { view: e }), this.leaveGuard.release(), this.reload()) : this.loseConnection(/* @__PURE__ */ Error("the server holds a new runtime for this page again after a reload for one."));
	}
	reload() {
		this.sessionKey.load(() => window.location.reload());
	}
	get instanceId() {
		return this.transport.instanceId;
	}
	async startAsync() {
		v(this, this.options.handlerGlobalKey), $$(this.root), await p3();
		let e = this.connectAsync();
		await this.hydrateAsync(), this.startEnginesAwaitingHydration(), e3(this.root), this.clientState.start(), await e && (await this.attachAsync(), this.connectionLost || l(`page live ${f(performance.now())} after the navigation started.`));
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
		return Ac(this.root) || IZ(this.hydration) || this.metadata.getWords().some((e) => cc(e.key)) || cc(this.metadata.metadata.itemValues);
	}
	startEnginesAwaitingHydration() {
		let e = this.enginesAwaitingHydration ?? [];
		this.enginesAwaitingHydration = null;
		for (let t of e) n3(r3(t), t, this.pluginContext);
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
		this.enginesAwaitingHydration === null ? n3(r3(e), e, this.pluginContext) : this.enginesAwaitingHydration.push(e);
	}
	applyChanges(e, t, n) {
		if (this.inbound === null && !fQ(e)) {
			t?.(), this.applyAnswered(this.holdsRuntime(n) ? e : null);
			return;
		}
		let r = this.transport.instanceId, i = (this.inbound ?? Promise.resolve()).then(async () => {
			t?.(), this.applyAnswered(this.holdsRuntime(n) ? await pQ(e, r) : null);
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
			if (e >= o3) {
				this.loseConnection(/* @__PURE__ */ Error("the page fell behind the server on every attach."));
				return;
			}
		}
	}
	async attachCoreAsync() {
		if (this.connectionLost) return !1;
		let e = window.location.search, t = this.createAttachRequest(e), n = this.holdInbound(), r = performance.now();
		try {
			let i = await zZ(() => this.transport.attachAsync(t), () => this.transport.isReconnecting, a3, f3), a = performance.now();
			if (i === null) return this.loseConnection(/* @__PURE__ */ Error("attaching the runtime failed after retrying.")), !1;
			if (i === "reconnecting") return !1;
			if (i.reload === !0) return this.reloadForView(this.hydration?.view ?? ""), !1;
			if (i.fresh === !0) return this.reloadForFreshRuntime(this.hydration?.view ?? ""), !1;
			YZ(XZ()), this.heldRuntime = i.runtime ?? null, this.runtimeSearch = e, this.dom.rebuild(), this.updateProcessor.registerServerRenderedItems(i.initialChanges), await n.previous;
			let o = u3();
			return t.switchRuntime && (this.pageId = null, o !== null && this.windows.forget(o)), this.leaveGuard.set(!1), await this.applyAttachChangesAsync(i.initialChanges), this.updateProcessor.initializeItemsHosts(), t.switchRuntime && d3(o), this.releaseInertContent(), this.windows.start(), d("runtime attached", r, {
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
		let t = m3(), n = t === null && this.heldRuntime !== null && K0(e, this.runtimeSearch, this.hydration?.identity ?? []), r = {
			clientWindowId: this.windowId,
			route: t?.route ?? window.location.pathname,
			pageId: n ? null : this.pageId,
			view: this.hydration?.view ?? null,
			since: this.renderSequence,
			runtime: this.heldRuntime,
			parameters: t === null ? J0(e) : t.parameters,
			timeZone: BZ(),
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
			let t = fQ(e) ? await pQ(e, this.transport.instanceId) : e;
			this.releaseInertContent(), this.applyNow(t);
		} catch (e) {
			c("a staged value of the attach could not be fetched; the page attaches again.", e), this.reattachRequested = !0;
		}
	}
	releaseInertContent() {
		this.inertContent?.removeAttribute("inert"), this.inertContent = null, this.endSwitchProgress?.(), this.endSwitchProgress = null;
	}
};
async function l3(e = {}) {
	let t = performance.now(), n = new c3(e);
	return d("runtime built", t), await n.startAsync(), n;
}
function u3() {
	return document.querySelector(`[${Mn}="${W$}"]`);
}
function d3(e) {
	if (document.scrollingElement?.scrollTo({
		top: 0,
		left: 0,
		behavior: "instant"
	}), e !== null) for (let t of [e, ...e.querySelectorAll("*")]) Vq(t) && !(W(t) === "windowed" && Hq(t)) ? (Iq(t), t.scrollTo({
		top: t.scrollHeight,
		left: 0,
		behavior: "instant"
	})) : (t.scrollTop !== 0 || t.scrollLeft !== 0) && t.scrollTo({
		top: 0,
		left: 0,
		behavior: "instant"
	});
}
function f3(e) {
	return new Promise((t) => window.setTimeout(t, e));
}
function p3() {
	let e = performance.getEntriesByType("navigation")[0];
	return document.readyState === "complete" || e !== void 0 && e.domContentLoadedEventStart > 0 ? Promise.resolve() : new Promise((e) => document.addEventListener("DOMContentLoaded", () => e(), { once: !0 }));
}
function m3() {
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
_(), l3().catch((e) => {
	c("Web client failed to start.", e);
});
//#endregion
