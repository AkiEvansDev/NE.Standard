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
var ie = "data-ui-id", ae = "data-ui-context", oe = "data-ui-pc", y = "data-ui-key", se = "data-ui-unselectable", ce = "data-ui-undraggable", le = "data-ui-unremovable", ue = "data-ui-unrenamable", de = "data-ui-no-context-menu", fe = "data-ui-no-row-open", pe = "data-ui-no-row-drag", me = "data-ui-drag-kind", he = "data-ui-drag-source", ge = "data-ui-item-drop-over", _e = "data-ui-drop-boxed", ve = "ui-row__grip", ye = "data-ui-row-drop", be = "data-ui-tabs-none-removable", xe = "data-ui-tabs-draggable", Se = "data-ui-tabs-menu", Ce = "data-ui-context-menu", we = "data-ui-context-menu-owner", Te = "data-ui-context-menu-later", Ee = "data-ui-context-menu-template", De = "data-ui-context-menu-use", Oe = "data-ui-action-bar", ke = "data-ui-action-bar-key", Ae = "data-ui-action-bar-rest", je = "data-ui-menu-left-out", Me = "data-ui-in-action-bar", Ne = "ui-action-bar", Pe = "data-ui-row-focus", Fe = "data-ui-row-cursor-waits", Ie = "data-ui-tab-out", Le = "data-ui-cell-focus", Re = "ui-cell-key", ze = "data-ui-tooltip", Be = "data-ui-tooltip-placement", Ve = "data-ui-tooltip-plain", He = "data-ui-tooltip-mark", Ue = "data-ui-tooltip-severity", We = "data-ui-tooltip-press", Ge = "data-ui-badge-text", Ke = "data-ui-badge-set", qe = "data-ui-badge-icon", Je = "data-ui-folds", Ye = "data-ui-name", Xe = "data-ui-bind-", Ze = "data-ui-into-", Qe = "data-ui-bind-value", $e = (e) => `data-ui-no-${e}`, et = "data-ui-event-boundary", tt = "data-ui-image-caption", nt = "data-ui-image-crop", rt = "data-ui-image-crop-size", it = "ui-image", at = "ui-image__picture", ot = "ui-image--circle", st = "data-ui-fallback-src", ct = "data-ui-fallback-icon", lt = "data-ui-image-failed", ut = "data-ui-icon-failed", b = "data-ui-items-host", dt = "data-ui-items-empty", ft = "data-ui-collection-sink", pt = "data-ui-items-query", mt = "data-ui-first-visible-key", ht = "data-ui-last-visible-key", gt = "data-ui-number-culture", _t = "data-ui-page-culture", vt = "data-ui-pager-target", yt = "data-ui-pager-page", bt = "data-ui-pager-size", xt = "data-ui-temporal-culture", St = "data-ui-temporal", Ct = "data-ui-awaits-draw", wt = "ui-timestamp", Tt = "ui-timestamp__text", Et = "data-ui-timestamp-format", Dt = "ui-file-tile", Ot = "ui-file-tile__glyph", kt = "ui-file-tile__name", At = "ui-file-tile__size", jt = "data-ui-file-name", Mt = "data-ui-file-type", Nt = "data-ui-file-size", Pt = "data-ui-file-icon", Ft = "data-ui-empty-template", It = "data-ui-group-template", Lt = "data-ui-empty-placeholder", Rt = "data-ui-group-header", zt = "data-ui-group-anchor", Bt = "data-ui-group", Vt = "data-ui-value-holder", Ht = "data-ui-value-end", Ut = "data-ui-value-kind", Wt = "items-query", Gt = "first-visible-key", Kt = "last-visible-key", qt = "data-ui-host-mode", Jt = "data-ui-host-viewport", Yt = "data-ui-scroll-group", Xt = "data-ui-scroll-lines", Zt = "data-ui-source-line", Qt = "data-ui-window-spacer", $t = "data-ui-window-pending", en = "data-ui-window-paged", tn = "data-ui-window-size", nn = "data-ui-window-offset", rn = "data-ui-window-total", an = "data-ui-window-more-before", on = "data-ui-window-more-after", sn = "data-ui-window-group-before", cn = "data-ui-window-aggregates", ln = "data-ui-form-id", un = "data-ui-forms", dn = "data-ui-visibility", fn = "data-ui-collapsed", pn = "data-ui-menu-group", mn = "data-ui-menu-select", hn = "data-ui-menu-open", gn = "data-ui-menu-holds-current", _n = "data-ui-menu-icons", vn = "data-ui-menu-passive", yn = "data-ui-menu-item-shortcut", bn = "data-ui-menu-surface", xn = "data-ui-menu-search", Sn = "data-ui-menu-searching", Cn = "data-ui-menu-unmatched", wn = "data-ui-drawer-toggle", Tn = "data-ui-drawer-open", En = "data-ui-drawer-switch", Dn = "data-ui-drawer-switch-row", On = "data-ui-side-drawers", kn = "data-ui-drawer-pin";
function An(e) {
	return e === "right-side" ? "data-ui-pinned-right-side" : "data-ui-pinned-left-side";
}
var jn = "data-ui-bottom-bar", Mn = "data-ui-rail-drawer", Nn = "data-ui-menu-rail-tiers", Pn = "data-ui-tier-orientation", Fn = "data-ui-tier-size", In = "data-ui-tier-layout", Ln = "data-ui-window-foot", Rn = "data-ui-content-fills", zn = "data-ui-region", Bn = "data-ui-menu-item-kind", Vn = "ui-menu", Hn = "ui-menu-item", Un = "ui-menu-item--checked", Wn = "ui-menu-item--selected", Gn = "ui-menu--rail", Kn = "ui-menu--nested", qn = `[${Bn}="header"], [${Bn}="separator"]`, Jn = `[${pn}] > .${Hn}`, Yn = `.${Hn}:not(${qn})`;
`${Jn}${Hn}${Bn}`;
var Xn = "data-ui-shortcut", Zn = "data-ui-collapse-toggle", Qn = "data-ui-folding", $n = "data-ui-column-limits", er = "data-ui-row-limits", tr = "data-ui-splitter-step", nr = "data-ui-splitter-position", rr = "data-ui-pane-layout", ir = "data-ui-pane", ar = "data-ui-pane-columns", or = "data-ui-pane-rows", sr = "data-ui-table-column", cr = "data-ui-table-hide-below", lr = "data-ui-table-starts-hidden", ur = "data-ui-table-hidden", dr = "ui-table__row", fr = "ui-table__scroll", pr = "ui-table__header", mr = "ui-table__resizer", hr = "ui-tree", gr = "ui-tree__row", _r = "ui-tree-node", vr = "data-ui-tree-drop", yr = "ui-tree__row--filtered", br = "data-ui-table-last", xr = "data-ui-table-reordering", Sr = "data-ui-table-dragging", Cr = "data-ui-table-drop", wr = "data-ui-table-scrolled", Tr = "data-ui-table-scrollbar", Er = "data-ui-no-row-select", Dr = "data-ui-tree-parent", Or = "data-ui-tree-children", kr = "data-ui-tree-folder", Ar = "data-ui-tree-expanded", jr = "data-ui-tree-title", Mr = "data-ui-tree-loading", Nr = "data-ui-tree-drop-target", Pr = "data-ui-tree-boot", Fr = "data-ui-tree-draggable", Ir = "data-ui-row-editing", Lr = "data-ui-boxed-editor", Rr = "data-ui-row-idle", zr = "data-ui-step-collapsed", Br = "data-ui-step-end", Vr = "data-ui-row-bar", Hr = "data-ui-image-source", Ur = "data-ui-file-max-size", Wr = "data-ui-file-pick", Gr = "data-ui-file-drop-target-id", Kr = "data-ui-press-ripple", qr = "data-ui-service-worker", Jr = "data-ui-theme", Yr = "data-ui-theme-colors", Xr = "data-ui-words", Zr = "data-ui-language-switcher", Qr = "data-ui-theme-switcher", $r = "data-ui-theme-choice", ei = "field", ti = "data-ui-language", ni = "data-ui-splitting", ri = "data-ui-keyboard-up", ii = "data-ui-window-foot-edge", ai = "data-ui-connection", oi = "data-ui-pending", si = "data-ui-split-folded", ci = "data-ui-split-edge", li = "data-ui-pointer-focus", ui = "data-ui-focus-within", di = "data-ui-popup-hover", fi = "data-ui-inner-pointer", pi = "data-ui-selection", mi = "data-ui-selected", hi = "data-ui-selected-key", gi = "data-ui-selected-keys", _i = "data-ui-bind-selected-key", vi = "data-ui-tabs-selected", yi = "data-ui-tab-caption", bi = "data-ui-tab-key", xi = "data-ui-tab-page", Si = "data-ui-tab-actions", Ci = "data-ui-tab-pinned", wi = [
	dn,
	"data-ui-visibility-sm",
	"data-ui-visibility-md",
	"data-ui-visibility-xl",
	"data-ui-visibility-xxl"
], Ti = "data-ui-submit-form-id", x = `[${ie}]`, Ei = "data-ui-href", Di = "ui-disabled", Oi = "ui-loading", ki = "ui-readonly", Ai = "ui-hidden", ji = "ui-dialog__surface", Mi = "ui-flyout__content", Ni = `.ui-context-menu, .ui-split-button__menu, .${Mi}`, Pi = "data-ui-focus-holder", Fi = "data-ui-owns-keys", Ii = "[role='listbox'], [role='menu'], [role='dialog']", Li = "ui-select__trigger", Ri = `.${Li}`, zi = "ui-button", Bi = "ui-button--ghost", Vi = "ui-button--small", Hi = `${zi} ${Bi} ${Vi}`, Ui = "ui-select", Wi = "data-ui-text-title", Gi = "data-ui-text-description", Ki = "ui-text__description", qi = "data-ui-plain-text", Ji = "data-ui-autolinks", Yi = "data-ui-text-icon", Xi = "data-ui-text-badge-icon", Zi = "data-ui-text-badge-text", Qi = "ui-card__header--empty", $i = "ui-text-input", ea = "ui-invalid", ta = "data-ui-validation-message", na = {
	componentId: ie,
	key: y,
	selected: mi,
	selectedKey: hi,
	selectedKeys: gi,
	unselectable: se,
	rowFocus: Pe,
	cellFocus: Le,
	cellKey: Re,
	itemsHost: b,
	valueHolder: Vt,
	bindValue: Qe,
	noRowOpen: fe,
	noRowDrag: pe,
	eventBoundary: et,
	focusHolder: Pi,
	ownsKeys: Fi,
	tooltip: ze,
	tooltipPlacement: Be,
	contextMenu: Ce,
	contextMenuUse: De,
	actionBar: Oe,
	actionBarKey: ke,
	actionBarRest: Ae,
	disabledClass: Di,
	loadingClass: Oi,
	readOnlyClass: ki,
	hiddenClass: Ai,
	buttonClass: zi,
	ghostButtonClass: Bi,
	smallButtonClass: Vi,
	selectClass: Ui,
	textInputClass: $i,
	invalidClass: ea,
	validationMessage: ta,
	sourceLine: Zt,
	textDescription: Gi,
	popupSelector: Ii,
	listTriggerSelector: Ri,
	tableRowClass: dr,
	tableScrollClass: fr,
	tableHeaderClass: pr,
	tableResizerClass: mr,
	tableHidden: ur,
	hostMode: qt,
	windowOffset: nn,
	windowTotal: rn,
	windowSize: tn,
	windowMoreAfter: on,
	windowAggregates: cn,
	itemsQuery: pt,
	valueKind: Ut,
	itemsQueryKind: Wt,
	menuItemClass: Hn,
	menuItemKind: Bn,
	menuItemCheckedClass: Un
};
function S(e) {
	return String(e).replace(/[\\"]/g, "\\$&").replace(/[\u0000-\u001f\u007f]/g, (e) => `\\${e.charCodeAt(0).toString(16)} `);
}
function ra(e) {
	return e.replace(/(\p{Ll})(\p{Lu})/gu, "$1-$2").replace(/([\p{L}\p{Nd}])(\p{Lu}\p{Ll})/gu, "$1-$2").replace(/_/g, "-").toLowerCase();
}
var ia = 0;
function aa(e, t) {
	return e.id.length === 0 && (ia++, e.id = `${t}-${ia}`), e.id;
}
function C(e, t, n) {
	n === null ? e.removeAttribute(t) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/addressing/operation-targets.ts
function oa(e, t, n) {
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
var sa = {
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
}, ca = Object.freeze([]), la = class {
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
		return this.bindingsByComponentAndPropertyId.get(Fa(e, t));
	}
	getBindingByComponentAndPropertyName(e, t) {
		return this.bindingsByComponentAndPropertyName.get(Fa(e, Pa(t)));
	}
	getEvent(e, t) {
		return this.eventsByComponentAndName.get(Ia(e, t));
	}
	hasServerEvent(e) {
		return this.eventNames.has(Na(e));
	}
	getEventNames() {
		return this.eventNames;
	}
	hasServerEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(Na(e))?.has(t) === !0;
	}
	getItemsTemplateMetadata(e) {
		return this.itemsTemplatesByComponentId.get(e);
	}
	getItemsFilterSortMetadata(e) {
		return this.itemsFilterSortByComponentId.get(e);
	}
	getItemValues(e, t = []) {
		return this.itemValuesByAddress.get(La(e, t))?.items ?? [];
	}
	getValidationsForComponent(e) {
		return this.validationsByComponentId.get(e) ?? ca;
	}
	getValidationsAgainst(e) {
		return this.validationsAgainstComponentId.get(e) ?? ca;
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
		r > 0 && this.bindingsById.set(r, e), this.bindingsByComponentAndPropertyId.set(Fa(t, e.propertyId), e), this.bindingsByComponentAndPropertyName.set(Fa(t, n.propertyName), e);
	}
	addEvent(e) {
		let t = Na(e.eventName), n = w(e.componentId);
		if (t.length === 0 || n <= 0) return;
		this.eventsByComponentAndName.set(Ia(n, t), e), this.eventNames.add(t);
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
		t > 0 && this.itemValuesByAddress.set(La(t, e.dynamicParameters ?? []), e);
	}
	addValidation(e) {
		let t = w(e.target?.componentId);
		if (t <= 0) return;
		ua(this.validationsByComponentId, t, e);
		let n = w(e.valueSource?.componentId);
		n > 0 && ua(this.validationsAgainstComponentId, n, e);
	}
};
function ua(e, t, n) {
	let r = e.get(t);
	r === void 0 ? e.set(t, [n]) : r.push(n);
}
function da(e, t) {
	return typeof e == "number" ? t[e] ?? "Unknown" : e != null && t.includes(e) ? e : "Unknown";
}
function fa(e) {
	return da(e, [
		"Dynamic",
		"Fixed",
		"Scope"
	]);
}
function pa(e) {
	return e == null ? "OneWay" : da(e, [
		"OneWay",
		"TwoWay",
		"OneWayToSource",
		"OnSubmit"
	]);
}
function ma(e) {
	return da(e, ["Property", "Event"]);
}
function ha(e) {
	return e == null ? "SetProperty" : da(e, [
		"SetProperty",
		"Effect",
		"CopyValue"
	]);
}
function ga(e) {
	return da(e, [
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
function _a(e) {
	return da(e, ["Ascending", "Descending"]);
}
function va(e) {
	return da(e, [
		"Change",
		"Blur",
		"Submit"
	]);
}
function ya(e) {
	return da(e, [
		"Error",
		"Warning",
		"Info"
	]);
}
function ba(e) {
	return typeof e == "string" ? e : da(e, [
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
function xa(e) {
	return da(e, [
		"None",
		"HasValue",
		"HasText",
		"IsTrue",
		"IsFalse",
		"DrawsIcon"
	]);
}
function Sa(e) {
	return da(e, [
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
function Ca(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function wa(e) {
	return typeof e == "string" ? e : "";
}
function Ta(e) {
	return da(e.kind, [
		"Value",
		"CollectionChange",
		"FullResync",
		"Validation",
		"Page"
	]);
}
function Ea(e) {
	return typeof e == "string" ? e.trim() : "";
}
function Da(e) {
	return da(e, ["Auto", "Smooth"]);
}
function Oa(e) {
	return da(e, [
		"Start",
		"Center",
		"End",
		"Nearest"
	]);
}
function ka(e) {
	return da(e, [
		"Start",
		"End",
		"Offset",
		"PageBack",
		"PageForward"
	]);
}
function Aa(e) {
	return da(e, ["Light", "Dark"]);
}
function ja(e) {
	return da(e, ["Horizontal", "Vertical"]);
}
function Ma(e) {
	return da(e, ["Polite", "Assertive"]);
}
function Na(e) {
	return e?.trim().toLowerCase() ?? "";
}
function Pa(e) {
	return e?.trim() ?? "";
}
function Fa(e, t) {
	return `${e}:${Pa(t)}`;
}
function Ia(e, t) {
	return `${e}:${Na(t)}`;
}
function La(e, t) {
	return `${e}:${Ca(t)}`;
}
//#endregion
//#region src/addressing/address-resolver.ts
var Ra = class {
	bindingSelectors = /* @__PURE__ */ new Map();
	intoSelectors = /* @__PURE__ */ new Map();
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
		return n === void 0 && (n = `[${Xe}${ra(t)}="${S(e)}"]`, this.bindingSelectors.set(e, n)), n;
	}
	resolvePropertyOn(e, t, n) {
		let r = w(t.componentId), i = this.metadata.getPropertyDefinition(t.propertyId);
		return r <= 0 || i === void 0 ? null : {
			componentId: r,
			propertyId: t.propertyId,
			propertyName: i.propertyName,
			dynamicParameters: [],
			component: e,
			definition: i,
			bindingId: n?.bindingId ?? 0,
			bindingSelector: n === void 0 ? null : this.bindingSelector(n.bindingId, i.propertyName),
			boundElement: n?.element,
			address: {
				component: {
					id: r,
					dynamicParameters: []
				},
				property: i.propertyName
			}
		};
	}
	resolveOperationTargets(e, t) {
		return oa(e.component, t, () => {
			if (e.bindingSelector === null) return [e.component.querySelector(this.intoSelector(e.propertyName)) ?? e.component];
			let t = Array.from(e.component.querySelectorAll(e.bindingSelector));
			return e.component.matches(e.bindingSelector) && t.unshift(e.component), e.boundElement !== void 0 && !t.includes(e.boundElement) && t.unshift(e.boundElement), t;
		});
	}
	intoSelector(e) {
		let t = this.intoSelectors.get(e);
		return t === void 0 && (t = `[${Ze}${ra(e)}]`, this.intoSelectors.set(e, t)), t;
	}
};
//#endregion
//#region src/addressing/dynamic-parameters.ts
function za(e) {
	return Ua(e, oe);
}
function Ba(e, t) {
	if (t <= 0) return [];
	let n = [], r = e, i = null;
	for (; r !== null && n.length < t;) {
		let e = Ga(r);
		if (e !== void 0) {
			let t = r.closest(Wa);
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
function Va(e, t) {
	let n = za(e);
	if (n !== t.length) return !1;
	if (n === 0) return !0;
	let r = Ba(e, n);
	if (r.length !== t.length) return !1;
	for (let e = 0; e < t.length; e++) if (String(r[e] ?? "") !== String(t[e] ?? "")) return !1;
	return !0;
}
function Ha(e, t) {
	let n = t.length - 1, r = e, i = null;
	for (; r !== null && n >= 0;) {
		let e = Ga(r);
		if (e !== void 0) {
			let a = r.closest(Wa);
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
function Ua(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.trim().length === 0) return 0;
	let r = Number(n);
	return Number.isInteger(r) ? r : 0;
}
var Wa = `[${b}]`;
function Ga(e) {
	return e.getAttribute("data-ui-key") ?? e.getAttribute("data-ui-group-anchor") ?? void 0;
}
//#endregion
//#region src/addressing/dom-registry.ts
var Ka = `[${Rt}]`, qa = 64, Ja = 256;
function Ya(e, t) {
	let n = [];
	for (let r of e) r instanceof HTMLElement && r.matches(t) ? n.push(r) : n.push(...r.querySelectorAll(t));
	return n;
}
var Xa = class {
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
		this.stale || (e === void 0 || this.changedScopes.size >= qa ? (this.stale = !0, this.changedScopes.clear()) : this.changedScopes.add(e));
	}
	rebuild() {
		this.stale = !1, this.componentsById.clear(), this.staticComponentsById.clear(), this.keyedComponentsById.clear(), this.indexed.clear(), this.changedScopes.clear(), this.unsettledIds.clear();
		let e = this.root.querySelectorAll(x), t = this.root.querySelector(Ka) !== null;
		for (let n of e) {
			let e = T(n);
			if (e <= 0 || t && n.closest(Ka) !== null) continue;
			let r = this.componentsById.get(e);
			r === void 0 && (r = [], this.componentsById.set(e, r)), r.push(n), this.indexed.add(n), !this.staticComponentsById.has(e) && $a(n) && this.staticComponentsById.set(e, n);
		}
		this.patchedSincePrune = 0, this.prunedSize = this.indexed.size;
	}
	findComponent(e, t) {
		return this.findAllComponents(e, t)[0] ?? null;
	}
	ensureId(e, t) {
		return aa(e, t);
	}
	findComponentParts(e, t, n) {
		return Ya(this.findAllComponents(e, t), n);
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
		let n = this.keyedComponents(e).get(Ca(t)) ?? [];
		if (n.length > 0 && n.every((e) => this.holds(e) && Va(e, t))) return [...n];
		let r = this.liveComponents(e).filter((e) => Va(e, t));
		return (n.length > 0 || r.length > 0) && this.keyedComponentsById.delete(e), r;
	}
	sync() {
		if (this.stale) this.rebuild();
		else if (this.changedScopes.size !== 0) {
			for (let e of this.changedScopes) this.holds(e) && this.addComponentsIn(e);
			this.changedScopes.clear(), this.patchedSincePrune > Math.max(this.prunedSize, Ja) && this.prune();
		}
	}
	addComponentsIn(e) {
		if (e.closest(Ka) !== null) return;
		let t = e.querySelector(Ka) !== null;
		e.matches("[data-ui-id]") && this.addComponent(e, !1);
		for (let n of e.querySelectorAll(x)) this.addComponent(n, t);
	}
	addComponent(e, t) {
		let n = T(e);
		if (n <= 0) return;
		if (this.indexed.has(e)) {
			this.unsettledIds.add(n);
			return;
		}
		if (t && e.closest(Ka) !== null) return;
		this.indexed.add(e), this.patchedSincePrune++, this.keyedComponentsById.delete(n);
		let r = this.componentsById.get(n);
		r === void 0 ? (this.componentsById.set(n, [e]), $a(e) && this.staticComponentsById.set(n, e)) : (r.push(e), this.unsettledIds.add(n));
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
		r && (t.length = n, this.keyedComponentsById.delete(e)), i && !no(t) && t.sort(to), t.length === 0 ? (this.componentsById.delete(e), this.staticComponentsById.delete(e)) : (r || i) && this.settleStatic(e, t);
	}
	settleStatic(e, t) {
		for (let n of t) if ($a(n)) {
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
			let e = za(n);
			if (e === 0) continue;
			let r = Ba(n, e);
			if (r.length !== e) continue;
			let i = Ca(r), a = t.get(i);
			a === void 0 ? t.set(i, [n]) : a.push(n);
		}
		return this.keyedComponentsById.set(e, t), t;
	}
	holds(e) {
		return ro(this.root, e);
	}
	resolveNearestComponent(e, t) {
		this.sync();
		let n = e;
		for (; n !== null;) {
			let e = n.closest(x);
			if (e === null || !ro(this.root, e)) return null;
			let r = T(e);
			if (r > 0 && t(r, e)) return {
				element: e,
				componentId: r,
				dynamicParameters: Ba(e, za(e))
			};
			n = e.parentElement;
		}
		return null;
	}
};
function T(e) {
	return Ua(e, ie);
}
function Za(e) {
	let t = e.closest(x), n = t === null ? 0 : T(t);
	return n > 0 ? n : null;
}
function Qa(e) {
	let t = e.closest(x), n = t === null ? 0 : T(t);
	return t === null || n <= 0 ? null : {
		componentId: n,
		dynamicParameters: Ba(t, za(t))
	};
}
function $a(e) {
	return za(e) === 0;
}
function eo(e, t) {
	return (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
}
function to(e, t) {
	return e === t ? 0 : eo(e, t) ? -1 : 1;
}
function no(e) {
	for (let t = 1; t < e.length; t++) if (!eo(e[t - 1], e[t])) return !1;
	return !0;
}
function ro(e, t) {
	return e === t || e instanceof Node && e.contains(t);
}
//#endregion
//#region src/rendering/file-size.ts
var io = [
	"kilobyte",
	"megabyte",
	"gigabyte"
], ao = [
	"kB",
	"MB",
	"GB"
];
function oo(e, t) {
	let n = e, r = "byte";
	for (let e of io) {
		if (n < 1024) break;
		n /= 1024, r = e;
	}
	return co(t, r).format(n);
}
var so = /* @__PURE__ */ new Map();
function co(e, t) {
	let n = `${e}|${t}`, r = so.get(n);
	return r === void 0 && (r = lo(e, t), so.set(n, r)), r;
}
function lo(e, t) {
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
function uo(e, t) {
	let n = Number(e ?? NaN);
	return Number.isFinite(n) && n >= 0 ? oo(n, t) : "";
}
function fo(e) {
	if (e < 1024) return e === 1 ? "1 byte" : `${po(e)} bytes`;
	let t = e, n = -1;
	for (; n < ao.length - 1 && t >= 1024;) t /= 1024, n++;
	let r = Math.round(t * 10), i = Math.floor(r / 10), a = r % 10;
	return `${po(i)}${a === 0 ? "" : `.${a}`} ${ao[n]}`;
}
function po(e) {
	return String(e).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//#endregion
//#region src/rendering/url-safety.ts
var mo = [
	"http",
	"https",
	"mailto",
	"tel"
];
function ho(e) {
	let t = String(e ?? "");
	if (t.trim().length === 0) return !1;
	for (let e of t) {
		let t = e.codePointAt(0) ?? 0;
		if (t <= 32 || t >= 127 && t <= 159) return !1;
	}
	if ("/#?.".includes(t[0])) return !0;
	let n = t.indexOf(":");
	return n < 0 || mo.includes(t.slice(0, n).toLowerCase());
}
function go(e) {
	return ho(e) ? String(e) : void 0;
}
var _o = [
	"http:",
	"https:",
	"mailto:",
	"tel:"
];
function vo(e) {
	let t = So(e), n = t.toLowerCase();
	return /^[\\/]{2}/.test(t) || _o.some((e) => n.startsWith(e));
}
function yo(e) {
	return typeof e != "string" || /[\x00-\x1f\x7f-\x9f]/.test(e) ? !1 : e === "/" || bo(e);
}
function bo(e) {
	return e.length > 1 && e[0] === "/" && e[1] !== "/" && e[1] !== "\\";
}
function xo(e) {
	return e.length > 0 && e[0] !== "/" && e[0] !== "\\" && !/^[A-Za-z][A-Za-z\d+.-]*:/.test(e);
}
function So(e) {
	let t = 0, n = e.length;
	for (; t < n && e.charCodeAt(t) <= 32;) t++;
	for (; n > t && e.charCodeAt(n - 1) <= 32;) n--;
	return e.slice(t, n).replace(/[\t\n\r]/g, "");
}
function Co(e) {
	return wo(e) !== null;
}
function wo(e) {
	let t = So(e), n = t.toLowerCase();
	return bo(t) || xo(t) || n.startsWith("https://") || n.startsWith("http://") || n.startsWith("data:image/") ? t : null;
}
function To(e) {
	return wo(String(e ?? "").trim()) ?? void 0;
}
//#endregion
//#region src/rendering/icon-value.ts
var Eo = "mask:", Do = "ui-icon--image", Oo = "ui-icon--mask";
function ko(e) {
	let t = String(e ?? "").trim(), n = !1;
	t.startsWith(Eo) && (n = !0, t = t.slice(5).trim());
	let r = t.includes("/") ? wo(t) : null;
	return r === null ? null : {
		source: r,
		tinted: n
	};
}
function Ao(e) {
	let t = ko(e);
	return t === null ? "" : jo(t.source);
}
function jo(e) {
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
var Mo = "ui-icon", No = "data-ui-icon", Po = "--ui-icon-url";
function Fo(e, t) {
	e.classList.add(Mo);
	for (let t of Array.from(e.classList)) Lo(t) && e.classList.remove(t);
	(e instanceof HTMLElement || e instanceof SVGElement) && e.style.removeProperty(Po);
	let n = Ro(t);
	if (n.length === 0) {
		e.removeAttribute(No);
		return;
	}
	e.setAttribute(No, ""), e.classList.add(n);
	let r = ko(t);
	r !== null && (e instanceof HTMLElement || e instanceof SVGElement) && e.style.setProperty(Po, jo(r.source));
}
var Io = "ui-icon-glyph--";
function Lo(e) {
	return e === Do || e === Oo || e.startsWith(Io);
}
function Ro(e) {
	let t = ko(e);
	return t === null ? zo(e) : t.tinted ? Oo : Do;
}
function zo(e) {
	let t = String(e ?? "").trim();
	if (t.length === 0) return "";
	let n = Io;
	for (let e of t) {
		let t = e.charCodeAt(0);
		t >= 48 && t <= 57 || t >= 65 && t <= 90 || t >= 97 && t <= 122 ? n += e.toLowerCase() : (e === "-" || e === "_" || e === "." || e === " ") && (n.endsWith("-") || (n += "-"));
	}
	return n.length === 15 ? "" : n;
}
//#endregion
//#region src/rendering/inline-markup.ts
var Bo = {
	None: 0,
	Bold: 1,
	Italic: 2,
	Underline: 4,
	Strikethrough: 8,
	Code: 16
}, Vo = "\\", Ho = "`", Uo = "!", Wo = "{", Go = "}", Ko = "ui-text__fold", qo = "ui-text__fold-toggle", Jo = "ui-text__fold-content", Yo = 8;
function Xo(e, t = {}) {
	if (e == null || e.length === 0) return [];
	let n = [], r = { value: "" };
	return cs(new Cs(e, t.autolinks === !0), 0, e.length, Bo.None, null, n, r), ls(n, r, Bo.None, null), n;
}
function Zo(e, t = {}) {
	return Xo(e, t).map((e) => ns(e) ? `${e.fold} ${Zo(e.text, t)}` : e.text).join("");
}
function Qo(e) {
	let t = "";
	for (let n of e) t += Es(n) ? Vo + n : n;
	return t;
}
function $o(e, t, n = {}) {
	let r = Xo(t, n), i = r.some(ns);
	e.hasAttribute("data-ui-folds") !== i && e.toggleAttribute(Je, i), r.length === 0 ? e.textContent = "" : r.length === 1 && es(r[0]) ? e.textContent = r[0].text : e.replaceChildren(rs(r, n));
}
function es(e) {
	return e.styles === Bo.None && e.url === null && !ts(e) && !ns(e);
}
function ts(e) {
	return e.icon !== null && e.icon !== void 0 && e.icon.length > 0;
}
function ns(e) {
	return e.fold !== null && e.fold !== void 0;
}
function rs(e, t) {
	let n = document.createDocumentFragment();
	for (let r of e) n.append(is(r, t));
	return n;
}
function is(e, t) {
	if (ts(e)) return os(e.icon);
	let n = ns(e) ? as(e, t) : document.createTextNode(e.text);
	if ((e.styles & Bo.Code) !== 0) {
		let e = document.createElement("code");
		e.className = "ui-text__code", e.append(n), n = e;
	}
	if ((e.styles & Bo.Strikethrough) !== 0 && (n = ss("s", n)), (e.styles & Bo.Underline) !== 0 && (n = ss("u", n)), (e.styles & Bo.Italic) !== 0 && (n = ss("em", n)), (e.styles & Bo.Bold) !== 0 && (n = ss("strong", n)), e.url !== null && t.insideLink !== !0) {
		let t = document.createElement("a");
		t.setAttribute("href", e.url), t.className = "ui-text__link", vo(e.url) && (t.setAttribute("target", "_blank"), t.setAttribute("rel", "noopener noreferrer")), t.append(n), n = t;
	}
	return n;
}
function as(e, t) {
	let n = document.createElement("span"), r = document.createElement(t.staticFolds === !0 ? "span" : "button"), i = document.createElement("span");
	return n.className = t.staticFolds === !0 ? `${Ko} ${Ko}--static` : Ko, r.className = qo, r.textContent = e.fold ?? "", i.className = Jo, i.append(rs(Xo(e.text, t), t)), t.staticFolds === !0 ? (n.append(r, " ", i), n) : (r.setAttribute("type", "button"), r.setAttribute("aria-expanded", "false"), r.setAttribute(et, ""), n.append(r, i), n);
}
function os(e) {
	let t = document.createElement("i");
	return t.className = "ui-text__icon-inline", Fo(t, e), t.setAttribute("aria-hidden", "true"), t;
}
function ss(e, t) {
	let n = document.createElement(e);
	return n.append(t), n;
}
function cs(e, t, n, r, i, a, o) {
	let s = e.text, c = t;
	for (; c < n;) {
		let t = s[c];
		if (t === Vo && c + 1 < n && Es(s[c + 1])) {
			o.value += s[c + 1], c += 2;
			continue;
		}
		let l = us(e, c, n);
		if (l !== null) {
			ls(a, o, r, i), ds(s, c + 1, l, o), ls(a, o, r | Bo.Code, i), c = l + 1;
			continue;
		}
		let u = ms(e, c, n);
		if (u !== null) {
			ls(a, o, r, i), cs(e, c + u.markerLength, u.contentEnd, r | u.style, i, a, o), ls(a, o, r | u.style, i), c = u.contentEnd + u.markerLength;
			continue;
		}
		let d = fs(e, c, n);
		if (d !== null) {
			ls(a, o, r, i), a.push({
				text: "",
				styles: r,
				url: i,
				icon: d.name
			}), c = d.iconEnd;
			continue;
		}
		let f = i === null && e.autolinks ? hs(e, c, n) : null;
		if (f !== null) {
			ls(a, o, r, i), a.push({
				text: f.address,
				styles: r,
				url: f.address
			}), c = f.addressEnd;
			continue;
		}
		let p = i === null ? xs(e, c, n) : null;
		if (p !== null) {
			ls(a, o, r, i), cs(e, p.labelStart, p.labelEnd, r, p.url, a, o), ls(a, o, r, p.url), c = p.linkEnd;
			continue;
		}
		let m = Ss(e, c, n);
		m === null ? (o.value += t, c++) : (ls(a, o, r, i), a.push({
			text: s.slice(m.contentStart, m.contentEnd),
			styles: r,
			url: i,
			fold: m.caption
		}), c = m.contentEnd + 1);
	}
}
function ls(e, t, n, r) {
	t.value.length !== 0 && (e.push({
		text: t.value,
		styles: n,
		url: r
	}), t.value = "");
}
function us(e, t, n) {
	let r = e.text;
	if (r[t] !== Ho) return null;
	let i = t + 1;
	if (i >= n || Ds(r[i])) return null;
	let a = e.findClosingMarker(i, n, Ho, 1);
	return a > i ? a : null;
}
function ds(e, t, n, r) {
	for (let i = t; i < n; i++) e[i] === Vo && i + 1 < n && Es(e[i + 1]) ? (r.value += e[i + 1], i++) : r.value += e[i];
}
function fs(e, t, n) {
	let r = e.text;
	if (r[t] !== Uo || t + 1 >= n || r[t + 1] !== "[") return null;
	let i = t + 2, a = e.findClosingBracket(i, n);
	if (a <= i) return null;
	let o = r.slice(i, a);
	return ps(o) ? {
		name: o,
		iconEnd: a + 1
	} : null;
}
function ps(e) {
	return e.length > 0 && /^[A-Za-z0-9._-]+$/.test(e);
}
function ms(e, t, n) {
	let r = e.text, i = r[t];
	if (i !== "*" && i !== "_" && i !== "~") return null;
	let a = t + 1 < n && r[t + 1] === i, o, s;
	if (i === "*" && a) o = Bo.Bold, s = 2;
	else if (i === "*") o = Bo.Italic, s = 1;
	else if (i === "_" && a) o = Bo.Underline, s = 2;
	else if (i === "~" && a) o = Bo.Strikethrough, s = 2;
	else return null;
	let c = t + s;
	if (c >= n || Ds(r[c])) return null;
	let l = e.findClosingMarker(c, n, i, s);
	return l > c ? {
		style: o,
		markerLength: s,
		contentEnd: l
	} : null;
}
function hs(e, t, n) {
	let r = e.text;
	if (r[t] !== "h" && r[t] !== "H" || t > 0 && !gs(r[t - 1])) return null;
	let i = r.slice(t, Math.min(t + 8, n)).toLowerCase(), a = i.startsWith("https://") ? t + 8 : i.startsWith("http://") ? t + 7 : -1;
	if (a < 0) return null;
	let o = _s(r, a, n);
	if (!bs(r.slice(a, ys(e, a, o, 0, 0)))) return null;
	let s = o, c = 0, l = 0;
	for (; s < n && !Os(r[s]) && !ks(r[s]) && r[s] !== "<";) r[s] === "(" ? c-- : r[s] === ")" ? c++ : r[s] === "[" ? l-- : r[s] === "]" && l++, s++;
	if (s = ys(e, a, s, c, l), !bs(r.slice(a, Math.min(o, s)))) return null;
	let u = { value: "" };
	return ds(r, t, s, u), ho(u.value) ? {
		address: u.value,
		addressEnd: s
	} : null;
}
function gs(e) {
	return !/^[\p{L}\p{Nd}]$/u.test(e);
}
function _s(e, t, n) {
	let r = t;
	for (; r < n;) if (vs(e[r])) r++;
	else if (e[r] === Vo && r + 1 < n && e[r + 1] === "_") r += 2;
	else break;
	return r;
}
function vs(e) {
	return /^[\p{L}\p{Nd}_.-]$/u.test(e);
}
function ys(e, t, n, r, i) {
	let a = e.text;
	for (; n > t;) {
		let t = n - 1, o = a[t];
		if (o === ")" && r > 0) r--;
		else if (o === "]" && i > 0) i--;
		else if (!"?!.,:;*_~'\"»”’".includes(o)) break;
		n = e.isEscaped(t) && Es(o) ? t - 1 : t;
	}
	return n;
}
function bs(e) {
	let t = (e.endsWith(".") ? e.slice(0, -1) : e).split(".");
	return t.length >= 2 && t.every((e) => e.length > 0) && !t.slice(-2).some((e) => e.includes("_"));
}
function xs(e, t, n) {
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
function Ss(e, t, n) {
	let r = e.text;
	if (r[t] !== "[") return null;
	let i = e.findClosingBracket(t + 1, n);
	if (i <= t + 1 || i + 1 >= n || r[i + 1] !== Wo || e.hasOpeningBracket(t + 1, i)) return null;
	let a = i + 1, o = a + 1, s = e.findMatchingBrace(a, n);
	if (s <= o || e.braceDepth(a) > Yo) return null;
	let c = { value: "" };
	return ds(r, t + 1, i, c), {
		caption: c.value,
		contentStart: o,
		contentEnd: s
	};
}
var Cs = class {
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
		return this.closeBrackets ??= this.next("]", !0), ws(this.closeBrackets[e], t);
	}
	hasOpeningBracket(e, t) {
		return this.openBrackets ??= this.next("[", !0), ws(this.openBrackets[e], t) >= 0;
	}
	findClosingParen(e, t) {
		return this.closeParens ??= this.next(")", !1), ws(this.closeParens[e], t);
	}
	findMatchingBrace(e, t) {
		return ws(this.braces()[e], t);
	}
	braceDepth(e) {
		return this.braces(), this.braceDepths[e];
	}
	findClosingMarker(e, t, n, r) {
		let i = Ts(n, r), a = this.closers[i] ?? this.buildClosers(n, r);
		this.closers[i] = a;
		let o = a[e + 1];
		if (r === 2) return o >= 0 && o + 1 < t ? o : -1;
		if (o >= 0 && o < t - 1) return o;
		let s = t - 1;
		return s > e && this.text[s] === n && !this.isEscaped(s) && !Ds(this.text[s - 1]) ? s : -1;
	}
	readLinkUrl(e, t) {
		if (this.linkLabel !== e) {
			let n = this.text.slice(e + 2, t).trim();
			this.linkLabel = e, this.linkUrl = ho(n) ? n : null;
		}
		return this.linkUrl;
	}
	isEscaped(e) {
		if (this.escaped === null) {
			let e = new Uint8Array(this.text.length);
			for (let t = 1; t < this.text.length; t++) e[t] = +(this.text[t - 1] === Vo && e[t - 1] === 0);
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
			if (this.text[r] === Wo) n.push(r);
			else if (this.text[r] === Go && n.length > 0) {
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
		if (e === 0 || this.text[e] !== t || this.isEscaped(e) || Ds(this.text[e - 1])) return !1;
		let r = e + 1 < this.text.length && this.text[e + 1] === t;
		return n === 2 ? r : !r;
	}
};
function ws(e, t) {
	return e >= 0 && e < t ? e : -1;
}
function Ts(e, t) {
	switch (e) {
		case "*": return t === 2 ? 0 : 1;
		case "_": return 2;
		case "~": return 3;
		default: return 4;
	}
}
function Es(e) {
	return e === "*" || e === "_" || e === "~" || e === "[" || e === "]" || e === "(" || e === ")" || e === Wo || e === Go || e === Ho || e === Vo;
}
function Ds(e) {
	return e === " " || e === "	" || e === "\r" || e === "\n";
}
function Os(e) {
	return /^\p{White_Space}$/u.test(e);
}
function ks(e) {
	let t = e.charCodeAt(0);
	return t < 32 || t >= 127 && t <= 159;
}
//#endregion
//#region src/runtime/plural-rules.ts
function As(e, t) {
	if (!Number.isFinite(t)) return "other";
	let n = Math.abs(t), r = Math.trunc(n), i = js(n);
	switch (Ms(e)) {
		case "en":
		case "de": return r === 1 && i === 0 ? "one" : "other";
		case "es": return n === 1 ? "one" : Ns(r, i) ? "many" : "other";
		case "fr": return r === 0 || r === 1 ? "one" : Ns(r, i) ? "many" : "other";
		case "ru":
		case "uk": return Ps(r, i);
		case "pl": return Fs(r, i);
		default: return "other";
	}
}
function js(e) {
	if (Number.isInteger(e)) return 0;
	let t = String(e), n = t.indexOf("e"), r = n < 0 ? t : t.slice(0, n), i = n < 0 ? 0 : Number(t.slice(n + 1)), a = r.indexOf("."), o = a < 0 ? 0 : r.length - a - 1;
	return Math.max(0, o - i);
}
function Ms(e) {
	return e == null || e.trim().length === 0 ? "" : e.split(/[-_]/, 1)[0].toLowerCase();
}
function Ns(e, t) {
	return t === 0 && e !== 0 && e % 1e6 == 0;
}
function Ps(e, t) {
	if (t !== 0) return "other";
	let n = e % 10, r = e % 100;
	return n === 1 && r !== 11 ? "one" : n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
function Fs(e, t) {
	if (t !== 0) return "other";
	if (e === 1) return "one";
	let n = e % 10, r = e % 100;
	return n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
//#endregion
//#region src/rendering/temporal-format.ts
function Is(e, t) {
	return `${e.date} ${t ? e.longTime : e.shortTime}`;
}
var Ls = {
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
function Rs(e) {
	let t = e.closest("[data-ui-temporal-culture]")?.getAttribute("data-ui-temporal-culture") ?? null;
	if (t === null) return Ls;
	try {
		return {
			...Ls,
			...JSON.parse(t)
		};
	} catch {
		return Ls;
	}
}
var zs = [
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
function Bs(e, t, n) {
	if (t == null || t.trim().length === 0) return `${qs(e.getFullYear(), 4)}-${qs(e.getMonth() + 1, 2)}-${qs(e.getDate(), 2)} ${qs(e.getHours(), 2)}:${qs(e.getMinutes(), 2)}:${qs(e.getSeconds(), 2)}`;
	let r = "", i = Vs(t);
	for (let a = 0; a < t.length;) {
		let o = Gs(t, a);
		o === null ? (r += t[a], a++) : (r += Ks(o, e, n, i), a += o.length);
	}
	return r;
}
function Vs(e) {
	for (let t = 0; t < e.length;) {
		let n = Gs(e, t);
		if (n === null) t++;
		else {
			if (n === "d" || n === "dd") return !0;
			t += n.length;
		}
	}
	return !1;
}
var Hs = /^[-./:,]$/, Us = /* @__PURE__ */ new Set([
	"MMMM",
	"MMM",
	"dddd",
	"ddd",
	"tt"
]);
function Ws(e) {
	for (let t = 0; t < e.length;) {
		let n = Gs(e, t);
		if (n !== null && Us.has(n) || n === null && !Hs.test(e[t]) && !/\s/.test(e[t])) return !1;
		t += n?.length ?? 1;
	}
	return e.trim().length > 0;
}
function Gs(e, t) {
	for (let n of zs) if (e.startsWith(n, t)) return n;
	return null;
}
function Ks(e, t, n, r) {
	let i = t.getHours(), a = fc(i);
	switch (e) {
		case "yyyy": return qs(t.getFullYear(), 4);
		case "yy": return qs(t.getFullYear() % 100, 2);
		case "MMMM": return r ? n.monthGenitiveNames[t.getMonth()] : n.monthNames[t.getMonth()];
		case "MMM": return n.abbreviatedMonthNames[t.getMonth()];
		case "MM": return qs(t.getMonth() + 1, 2);
		case "M": return String(t.getMonth() + 1);
		case "dddd": return n.dayNames[t.getDay()];
		case "ddd": return n.abbreviatedDayNames[t.getDay()];
		case "dd": return qs(t.getDate(), 2);
		case "d": return String(t.getDate());
		case "HH": return qs(i, 2);
		case "H": return String(i);
		case "hh": return qs(a, 2);
		case "h": return String(a);
		case "mm": return qs(t.getMinutes(), 2);
		case "m": return String(t.getMinutes());
		case "ss": return qs(t.getSeconds(), 2);
		case "s": return String(t.getSeconds());
		case "tt": return i < 12 ? n.amDesignator : n.pmDesignator;
		default: return e;
	}
}
function qs(e, t) {
	return String(e).padStart(t, "0");
}
var Js = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function Ys(e) {
	let t = Js.exec(e.trim());
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
function Xs(e) {
	return Zs(e.year, e.month - 1, e.day, e.hour, e.minute, e.second, e.millisecond);
}
function Zs(e, t, n, r = 0, i = 0, a = 0, o = 0) {
	let s = new Date(2e3, 0, 1, r, i, a, o);
	return s.setFullYear(e, t, n), s;
}
var Qs = {
	year: "y",
	month: "M",
	day: "d",
	hour: "H",
	minute: "m",
	second: "s"
};
function $s(e, t) {
	let n = "";
	for (let r = 0; r < e.length;) {
		let i = Gs(e, r);
		i === null ? (n += e[r], r++) : (n += ec(i, t).repeat(i.length), r += i.length);
	}
	return n;
}
function ec(e, t) {
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
function tc(e, t, n) {
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
		let a = Gs(t, e);
		if (a === null) {
			if (!nc(r, i, t[e])) return null;
			e++;
		} else {
			if (!rc(r, i, a, n)) return null;
			e += a.length;
		}
	}
	return r.length > 0 && i.position === r.length ? uc(i) : null;
}
function nc(e, t, n) {
	if (/\s/.test(n)) {
		for (; t.position < e.length && /\s/.test(e[t.position]);) t.position++;
		return !0;
	}
	return Hs.test(n) ? t.position >= e.length || !Hs.test(e[t.position]) ? !1 : (t.position++, !0) : t.position >= e.length || e[t.position].toLowerCase() !== n.toLowerCase() ? !1 : (t.position++, !0);
}
function rc(e, t, n, r) {
	switch (n) {
		case "yyyy": return ic(t, "year", sc(e, t, 4, 4));
		case "yy": return ic(t, "year", ac(sc(e, t, 2, 2)));
		case "MMMM":
		case "MMM": return ic(t, "month", oc(cc(e, t, [
			r.monthNames,
			r.monthGenitiveNames,
			r.abbreviatedMonthNames
		])));
		case "MM":
		case "M": return ic(t, "month", sc(e, t, 1, 2));
		case "dddd":
		case "ddd": return cc(e, t, [r.dayNames, r.abbreviatedDayNames]) !== null;
		case "dd":
		case "d": return ic(t, "day", sc(e, t, 1, 2));
		case "HH":
		case "H": return ic(t, "hour", sc(e, t, 1, 2));
		case "hh":
		case "h": return ic(t, "hour12", sc(e, t, 1, 2));
		case "mm":
		case "m": return ic(t, "minute", sc(e, t, 1, 2));
		case "ss":
		case "s": return ic(t, "second", sc(e, t, 1, 2));
		case "tt": return lc(e, t, r);
		default: return !1;
	}
}
function ic(e, t, n) {
	return n !== null && (e[t] = n, !0);
}
function ac(e) {
	return e === null ? null : e + (e < 50 ? 2e3 : 1900);
}
function oc(e) {
	return e === null ? null : e + 1;
}
function sc(e, t, n, r) {
	let i = t.position;
	for (; i < e.length && i - t.position < r && e[i] >= "0" && e[i] <= "9";) i++;
	if (i - t.position < n) return null;
	let a = Number(e.slice(t.position, i));
	return t.position = i, a;
}
function cc(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = null, a = 0;
	for (let e of n) for (let t = 0; t < e.length; t++) {
		let n = e[t].toLowerCase();
		n.length > a && r.startsWith(n) && (i = t, a = n.length);
	}
	return t.position += a, i;
}
function lc(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = n.amDesignator.toLowerCase(), a = n.pmDesignator.toLowerCase();
	for (let [e, n] of i.length >= a.length ? [[i, !1], [a, !0]] : [[a, !0], [i, !1]]) if (e.length > 0 && r.startsWith(e)) return t.position += e.length, t.afternoon = n, !0;
	return i.length === 0 && a.length === 0;
}
function uc(e) {
	let t = e.hour ?? 0;
	if (e.hour12 !== null) {
		if (e.hour12 < 1 || e.hour12 > 12) return null;
		t = e.hour12 % 12 + (e.afternoon === !0 ? 12 : 0);
	}
	return e.year === null || e.month === null || e.day === null || e.year < 1 || e.month < 1 || e.month > 12 || e.day < 1 || e.day > Zs(e.year, e.month, 0).getDate() || t > 23 || e.minute > 59 || e.second > 59 ? null : {
		year: e.year,
		month: e.month,
		day: e.day,
		hour: t,
		minute: e.minute,
		second: e.second,
		millisecond: 0
	};
}
var dc = {
	readCulture: Rs,
	format: Bs,
	parse: Ys,
	toDate: Xs
};
function fc(e) {
	return e % 12 == 0 ? 12 : e % 12;
}
//#endregion
//#region src/rendering/timestamp-format.ts
var pc = /(?:Z|[+-]\d{2}(?::?\d{2})?)$/i, mc = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function hc(e) {
	let t = e?.trim() ?? "";
	if (!mc.test(t)) return null;
	let n = Date.parse(pc.test(t) ? t : `${t}Z`);
	return Number.isNaN(n) ? null : n;
}
function gc(e) {
	return e === "date" || e === "time" || e === "relative" || e === "relative-date" ? e : "date-time";
}
function _c(e) {
	return e === "relative" || e === "relative-date";
}
var vc = {
	...Ls,
	date: "yyyy-MM-dd",
	shortTime: "HH:mm",
	longTime: "HH:mm:ss"
};
function yc(e, t, n, r) {
	if (t === "relative") return Ac(e - r, n.language);
	if (t === "relative-date") {
		let t = xc(e, r);
		if (t !== null) return wc(n.language).format(t, "day");
	}
	let i = n.temporal ?? vc, a = t === "date" || t === "relative-date" ? i.date : t === "time" ? i.shortTime : Is(i, !1);
	return Bs(new Date(e), a, i);
}
function bc(e, t, n, r) {
	let i = yc(e, t, n, r);
	return t === "relative-date" ? Sc(i, n.language) : i;
}
function xc(e, t) {
	let n = new Date(e), r = new Date(t), i = Math.round((Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) - Date.UTC(r.getFullYear(), r.getMonth(), r.getDate())) / kc);
	return Math.abs(i) <= 1 ? i : null;
}
function Sc(e, t) {
	return e.length === 0 ? e : e.charAt(0).toLocaleUpperCase(Tc(t)) + e.slice(1);
}
var Cc = /* @__PURE__ */ new Map();
function wc(e) {
	let t = Cc.get(e);
	return t === void 0 && (t = new Intl.RelativeTimeFormat(Tc(e), { numeric: "auto" }), Cc.set(e, t)), t;
}
function Tc(e) {
	if (e.length !== 0) try {
		return Intl.DateTimeFormat.supportedLocalesOf(e).length > 0 ? e : void 0;
	} catch {
		return;
	}
}
var Ec = 1e3, Dc = 60 * Ec, Oc = 60 * Dc, kc = 24 * Oc;
function Ac(e, t) {
	let n = wc(t), r = Math.abs(e);
	return r < 45 * Ec ? n.format(0, "second") : r < 45 * Dc ? n.format(Math.round(e / Dc), "minute") : r < 22 * Oc ? n.format(Math.round(e / Oc), "hour") : r < 26 * kc ? n.format(Math.round(e / kc), "day") : r < 320 * kc ? n.format(Math.round(e / (30.4375 * kc)), "month") : n.format(Math.round(e / (365.25 * kc)), "year");
}
//#endregion
//#region src/runtime/words.ts
var jc = "count";
function E(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	if (typeof t.key != "string" || t.key.trim().length === 0) return !1;
	for (let e of Object.keys(t)) if (e !== "key" && e !== "args") return !1;
	return t.args === void 0 || t.args === null || typeof t.args == "object" && !Array.isArray(t.args);
}
function Mc(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.text == "string" && t.text.trim().length > 0 && Object.keys(t).length === 1;
}
var Nc = /* @__PURE__ */ new Set([
	"date-time",
	"date",
	"time",
	"relative",
	"relative-date"
]);
function Pc(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	for (let e of Object.keys(t)) if (e !== "moment" && e !== "format") return !1;
	return typeof t.moment == "string" && hc(t.moment) !== null && (t.format === void 0 || typeof t.format == "string" && Nc.has(t.format));
}
function Fc(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	return Object.keys(t).length === 1 && typeof t.fileSize == "number" && Number.isSafeInteger(t.fileSize) && t.fileSize >= 0;
}
function Ic(e) {
	return Lc(e, Pc);
}
function Lc(e, t) {
	if (typeof e != "object" || !e) return !1;
	if (t(e)) return !0;
	for (let n of Array.isArray(e) ? e : Object.values(e)) if (Lc(n, t)) return !0;
	return !1;
}
function Rc(e) {
	return Lc(e, zc);
}
function zc(e) {
	return Pc(e) || Fc(e);
}
function Bc(e, t) {
	let n = new Date(e).toISOString(), r = n.slice(0, 10), i = n.slice(11, 16);
	return t === "date" || t === "relative-date" ? r : t === "time" ? `${i} UTC` : `${r} ${i} UTC`;
}
function Vc(e, t, n) {
	return E(e) ? Wc(n, e.key, e.args) : Mc(e) ? Hc(n, e.text) : t && typeof e == "string" ? Hc(n, e) : e;
}
function Hc(e, t) {
	return t.trim().length === 0 || !Uc(e.prefixes, t) ? t : e.lookup(t) ?? t;
}
function Uc(e, t) {
	if (e.length === 0) return !0;
	for (let n of e) if (t.startsWith(n)) return !0;
	return !1;
}
function Wc(e, t, n, r = !1) {
	let i = n?.[jc];
	return Gc(typeof i == "number" ? e.lookup(`${t}.${As(e.language, i)}`) ?? e.lookup(`${t}.other`) ?? e.lookup(t) ?? t : e.lookup(t) ?? t, n, (t) => Mc(t) ? Hc(e, t.text) : Wc(e, t.key, t.args, r), e, r);
}
function Gc(e, t, n, r = {}, i = !1) {
	if (t == null || !e.includes("{")) return e;
	let a = "", o = 0;
	for (; o < e.length;) {
		if (e[o] === "{") {
			let s = Kc(e, o);
			if (s > 0) {
				let c = e.slice(o + 1, s);
				if (Object.hasOwn(t, c)) {
					a += Jc(t[c], n, r, i), o = s + 1;
					continue;
				}
			}
		}
		a += e[o], o++;
	}
	return a;
}
function Kc(e, t) {
	let n = t + 1;
	for (; n < e.length && qc(e.charCodeAt(n));) n++;
	return n > t + 1 && n < e.length && e[n] === "}" ? n : -1;
}
function qc(e) {
	return e >= 48 && e <= 57 || e >= 65 && e <= 90 || e >= 97 && e <= 122 || e === 95;
}
function Jc(e, t, n, r) {
	if (e == null) return "";
	if (typeof e == "string") return r ? Qo(e) : e;
	if (typeof e == "boolean") return e ? "true" : "false";
	if (E(e)) return t === void 0 ? Gc(e.key, e.args, void 0, n, r) : t(e);
	if (Mc(e)) {
		let n = t === void 0 ? e.text : t(e);
		return r ? Qo(n) : n;
	}
	return Pc(e) ? (n.writeMoment ?? Bc)(hc(e.moment) ?? 0, e.format ?? "date-time") : Fc(e) ? (n.writeFileSize ?? fo)(e.fileSize) : String(e);
}
//#endregion
//#region src/rendering/first-paint-words.ts
var Yc = `script[type='application/json'][${St}]`, Xc = `[${Xr}*='"moment"'], [${Xr}*='"fileSize"']`;
function Zc(e) {
	let t = e.querySelector(Yc)?.textContent?.trim() ?? "";
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
var Qc = 15e3, $c = /* @__PURE__ */ new Set(), el = null;
function tl(e) {
	$c.add(e), el === null && (el = setInterval(nl, Qc));
}
function nl() {
	for (let e of [...$c]) {
		let t = !1;
		try {
			t = e();
		} catch (e) {
			s("a relative tick failed; it is ticked no more.", e);
		}
		t || $c.delete(e);
	}
	$c.size === 0 && el !== null && (clearInterval(el), el = null);
}
//#endregion
//#region src/runtime/client-strings.ts
var rl = 256, il = 512, al = "script[type='application/json'][data-ui-strings]", ol = class {
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
		this.tableLoaded || (this.currentTemporal = Zc(e) ?? this.currentTemporal);
		let t = e.querySelector(al)?.textContent?.trim() ?? "";
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
		return this.lookup(e) === void 0 && this.text(e), Wc(this, e, t, n);
	}
	translate(e, t, n = !1) {
		return Wc(this, e, t, n);
	}
	writeMoment = (e, t) => (_c(t) && this.noteRelative(), yc(e, t, {
		temporal: this.currentTemporal,
		language: this.currentLanguage
	}, Date.now()));
	noteRelative() {
		this.relativeWritten = !0, this.momentHandlers.size > 0 && tl(this.tickMoments);
	}
	tickMoments = () => this.relativeWritten ? (this.relativeWritten = !1, this.notify(this.momentHandlers, "a moment tick handler failed."), !0) : !1;
	writeFileSize = (e) => oo(e, this.currentLanguage);
	resolve(e, t = !0) {
		return Vc(e, t, this);
	}
	resolveText(e) {
		return Vc(e, !0, this);
	}
	write(e, t, n, r) {
		ml(e, t, this.translate(n, r, pl(e, t))), this.mark(e, t, r == null || Object.keys(r).length === 0 ? [n] : [n, r]);
	}
	writeText(e, t, n) {
		ml(e, t, Vc(n, !0, this)), this.mark(e, t, n);
	}
	writeValue(e, t, n) {
		if (E(n)) {
			this.write(e, t, n.key, n.args);
			return;
		}
		let r = Mc(n) ? n.text : typeof n == "string" ? n : "";
		r.trim().length > 0 ? this.writeText(e, t, r) : (ml(e, t, ""), this.mark(e, t, null));
	}
	mark(e, t, n) {
		ll(e, t, n);
	}
	rewriteMarks(e, t) {
		hl(e, (e) => {
			for (let n of e.querySelectorAll(t === void 0 ? `[${Xr}]` : Xc)) for (let [e, r] of Object.entries(fl(n))) {
				if (t !== void 0 && !t(r)) continue;
				let i = e === "#text" ? null : e, a = this.wordsOfMark(r, pl(n, i));
				a !== null && ml(n, i, a);
			}
		});
	}
	wordsOfMark(e, t) {
		if (typeof e == "string") return Vc(e, !0, this);
		if (!Array.isArray(e)) return null;
		let [n, r] = e;
		return typeof n == "string" ? this.translate(n, typeof r == "object" && r ? r : null, t) : null;
	}
	askLater(e) {
		this.asker === null || !this.tableLoaded || e.length > il || e.trim().length === 0 || (!this.complete || this.report && this.currentPrefixes.length > 0 && Uc(this.currentPrefixes, e)) && (this.askedIn(this.currentLanguage).has(e) || (this.pending.add(e), !this.flushQueued && (this.flushQueued = !0, setTimeout(() => void this.flushAsync(), 0))));
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
		for (let r = 0; r < n.length; r += rl) try {
			let a = await e(t, n.slice(r, r + rl));
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
function sl(e) {
	let t = !1;
	return hl(e, (e) => {
		t ||= e.querySelector(Xc) !== null;
	}), t;
}
function cl(e, t) {
	e.hasAttribute("data-ui-words") && ll(e, t, null);
}
function ll(e, t, n) {
	let r = fl(e), i = t ?? "#text";
	if (n === null) {
		if (!(i in r)) return;
		delete r[i];
	} else r[i] = n;
	let a = JSON.stringify(r);
	C(e, Xr, Object.keys(r).length === 0 ? null : a);
}
function ul(e) {
	return dl(e, null);
}
function dl(e, t) {
	let n = fl(e)[t ?? "#text"];
	if (typeof n == "string") return n;
	if (!Array.isArray(n) || typeof n[0] != "string") return null;
	let r = n[1];
	return {
		key: n[0],
		args: typeof r == "object" && r ? r : null
	};
}
function fl(e) {
	let t = e.getAttribute(Xr);
	if (t === null || t.length === 0) return {};
	try {
		let e = JSON.parse(t);
		return typeof e == "object" && e && !Array.isArray(e) ? e : {};
	} catch {
		return {};
	}
}
function pl(e, t) {
	return t === "data-ui-tooltip" && !e.hasAttribute("data-ui-tooltip-plain");
}
function ml(e, t, n) {
	t === null ? e.textContent !== n && (e.textContent = n) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function hl(e, t) {
	t(e);
	for (let n of e.querySelectorAll("template")) hl(n.content, t);
}
var D = new ol();
function gl(e, t) {
	let n = Mc(e) ? e.text : e;
	return D.resolve(n, typeof n == "string" && n.length > 0 && t());
}
//#endregion
//#region src/updates/row-idle.ts
var _l = "row-idle";
function vl(e) {
	let t = e.parentElement;
	t !== null && (Sl(t) ? yl(t) : !t.hasAttribute("data-ui-id") && t.parentElement !== null && Sl(t.parentElement) && yl(t.parentElement));
}
function yl(e) {
	let t = bl(e);
	e.hasAttribute("data-ui-row-idle") !== t && e.toggleAttribute(Rr, t);
}
function bl(e) {
	for (let t of e.children) if (t.hasAttribute("data-ui-id")) {
		if (xl(t)) return !0;
	} else for (let e of t.children) if (e.hasAttribute("data-ui-id") && xl(e)) return !0;
	return !1;
}
function xl(e) {
	return e.classList.contains("ui-disabled") || e.classList.contains("ui-loading");
}
function Sl(e) {
	return e.hasAttribute("data-ui-key") && e.parentElement?.hasAttribute("data-ui-items-host") === !0;
}
//#endregion
//#region src/interactions/interactive-state.ts
var Cl = `.${Di}, .${Oi}, [inert]`;
function wl(e) {
	return `:scope > [${ie}]:is(${e}), :scope > :not([${ie}]) > [${ie}]:is(${e})`;
}
var Tl = wl(Cl), El = /* @__PURE__ */ new Map();
function O(e) {
	return e.closest(Cl) !== null || e.matches(":disabled, [aria-disabled='true']");
}
function k(e) {
	return e.matches(Cl) || e.querySelector(Tl) !== null;
}
function Dl(e, t) {
	if (e.hasAttribute(t)) return !0;
	let n = El.get(t);
	return n === void 0 && (n = wl(`[${t}]`), El.set(t, n)), e.querySelector(n) !== null;
}
function Ol(e) {
	return e.getClientRects().length > 0 && !e.matches(":disabled") && e.closest("[inert]") === null;
}
var kl = `[${ie}], .${ki}`;
function A(e) {
	return e.closest(kl)?.matches(`.${ki}`) === !0;
}
function Al(e, t) {
	e.classList.contains("ui-disabled") !== t && (e.classList.toggle(Di, t), vl(e)), t ? e.setAttribute("aria-disabled", "true") : e.removeAttribute("aria-disabled");
}
var jl = {
	isInert: O,
	isReadOnly: A,
	setDisabled: Al
};
//#endregion
//#region src/interactions/grid-tracks.ts
function Ml(e, t) {
	return Math.max(e, Math.round(t / 10));
}
function Nl(e) {
	let t = [];
	for (let n of Il(e.trim())) {
		let e = /^repeat\(\s*(\d+)\s*,(.+)\)$/s.exec(n);
		if (e !== null) {
			let n = Nl(e[2]);
			if (n === null) return null;
			for (let r = Number(e[1]); r > 0; r--) t.push(...n);
			continue;
		}
		let r = Pl(n);
		if (r === null) return null;
		t.push(r);
	}
	return t.length === 0 ? null : t;
}
function Pl(e) {
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
	if (n !== null) return Fl({
		kind: "auto",
		value: 0
	}, Number(n[1]));
	let r = /^minmax\(\s*([\d.]+)(?:px)?\s*,\s*([\d.]+)(fr|px)\s*\)$/.exec(e);
	if (r !== null) return Fl(r[3] === "fr" ? {
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
function Fl(e, t) {
	return t > 0 ? {
		...e,
		min: t
	} : e;
}
function Il(e) {
	let t = [], n = 0, r = 0;
	for (let i = 0; i < e.length; i++) {
		let a = e[i];
		a === "(" ? n++ : a === ")" ? n-- : a === " " && n === 0 && (i > r && t.push(e.slice(r, i)), r = i + 1);
	}
	return r < e.length && t.push(e.slice(r)), t;
}
function Ll(e, t = "auto") {
	return e.map((e) => Rl(e, t)).join(" ");
}
function Rl(e, t) {
	switch (e.kind) {
		case "px": return `${zl(e.value)}px`;
		case "star": return `minmax(${e.min === void 0 ? "0" : `${zl(e.min)}px`}, ${zl(e.value)}fr)`;
		case "auto": return e.min === void 0 ? e.max === void 0 ? t : `fit-content(${zl(e.max)}px)` : `minmax(${zl(e.min)}px, auto)`;
	}
}
function zl(e) {
	return String(Math.round(e * 1e3) / 1e3);
}
function Bl(e) {
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
function Vl(e, t) {
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
function Hl(e, t, n) {
	let r = 0, i = n;
	for (let n of t) n < e && n + 1 > r ? r = n + 1 : n > e && n < i && (i = n);
	let a = Ul(r, e), o = Ul(e + 1, i);
	return a.length === 0 || o.length === 0 ? null : {
		before: a,
		after: o
	};
}
function Ul(e, t) {
	let n = [];
	for (let r = e; r < t; r++) n.push(r);
	return n;
}
var Wl = {
	sliver: 120,
	passFloors: !1
};
function Gl(e, t, n, r, i = Wl) {
	let a = Jl(e, t, n.before), o = Jl(e, t, n.after);
	if (a.total + o.total <= 0) return null;
	let s = Math.max((i.passFloors ? 0 : a.min) - a.total, o.total - o.max), c = Math.min(a.max - a.total, o.total - (i.passFloors ? 0 : o.min));
	if (s > c) return null;
	let l = (e) => i.sliver > 0 && i.passFloors ? Math.max(i.sliver, e.min) : i.sliver, u = ql(Math.min(Math.max(r, s), c), r, a.total, o.total, s, c, l(a), l(o));
	if (u === 0) return null;
	let d = [...e], f = n.before.every((t) => e[t].kind === "star"), p = n.after.every((t) => e[t].kind === "star");
	if (f && p) {
		let t = $l(n.before, e) + $l(n.after, e), r = a.total + o.total;
		Yl(d, e, a, t * (a.total + u) / r), Yl(d, e, o, t * (o.total - u) / r);
	} else f || Xl(d, a, a.total + u), p || Xl(d, o, o.total - u);
	return i.passFloors && (Kl(d, a, a.total + u), Kl(d, o, o.total - u)), d;
}
function Kl(e, t, n) {
	if (!(n >= t.min - .5)) for (let n of t.indices) {
		let { min: t, ...r } = e[n];
		e[n] = r;
	}
}
function ql(e, t, n, r, i, a, o, s) {
	let c = e, l = n + c, u = r - c;
	return l > 0 && l < o ? c = t < 0 ? -n : o - n : u > 0 && u < s && (c = t > 0 ? r : r - s), Math.min(Math.max(c, i), a);
}
function Jl(e, t, n) {
	let r = Ql(n, t), i = n.map((e) => r > 0 ? t[e] / r : 1 / n.length), a = 0, o = Infinity;
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
function Yl(e, t, n, r) {
	let i = $l(n.indices, t);
	for (let a = 0; a < n.indices.length; a++) {
		let o = n.indices[a], s = i > 0 && n.total > 0 ? n.shares[a] : 1 / n.indices.length;
		e[o] = {
			...t[o],
			value: r * s
		};
	}
}
function Xl(e, t, n) {
	for (let r = 0; r < t.indices.length; r++) {
		let i = t.indices[r];
		e[i] = {
			kind: "px",
			value: n * t.shares[r],
			...Zl(e[i])
		};
	}
}
function Zl(e) {
	return {
		...e.min === void 0 ? {} : { min: e.min },
		...e.max === void 0 ? {} : { max: e.max }
	};
}
function Ql(e, t) {
	let n = 0;
	for (let r of e) n += t[r];
	return n;
}
function $l(e, t) {
	let n = 0;
	for (let r of e) n += t[r].value;
	return n;
}
function eu(e, t) {
	return Math.round(tu(e, t) * 100);
}
function tu(e, t) {
	let n = Ql(t.before, e), r = n + Ql(t.after, e);
	return r <= 0 ? 0 : n / r;
}
function nu(e, t, n) {
	let r = Ql(t.before, e);
	return (r + Ql(t.after, e)) * Math.min(Math.max(n, 0), 1) - r;
}
function ru(e) {
	let t = e === null || e.length === 0 ? NaN : Number(e);
	return t >= 0 && t <= 1 ? t : null;
}
function iu(e, t) {
	let n = [];
	for (let r = 0, i = 0; r < t; r++) n.push(i), i += Number.isFinite(e[r]) ? e[r] : 0;
	return n;
}
var au = /* @__PURE__ */ new Set();
function ou(e, t, n, r) {
	let i = Jl(e, t, n.before), a = Jl(e, t, n.after);
	return i.total >= 1 && i.total < r ? -i.total : a.total >= 1 && a.total < r ? a.total : i.total >= 1 && i.total < i.min - .5 ? i.min - i.total : a.total >= 1 && a.total < a.min - .5 ? a.total - a.min : 0;
}
function su(e, t, n, r) {
	let i = /* @__PURE__ */ new Set();
	for (let a of [n.before, n.after]) {
		let n = Jl(e, t, a);
		n.total < Math.max(r, n.min - .5) && a.forEach((e) => i.add(e));
	}
	return i;
}
function cu(e, t) {
	return e.map((e, n) => t.has(n) ? {
		kind: "px",
		value: 0
	} : e);
}
function lu(e, t, n, r = au) {
	let i = Number(e);
	if (!Number.isInteger(i) || i < 1) return !1;
	let a = /^span\s+(\d+)$/.exec(t.trim()), o = Number(t), s = a === null ? Number.isInteger(o) && o > i ? o : i + 1 : i + Number(a[1]);
	return s - 1 <= n.length && n.slice(i - 1, s - 1).every((e, t) => e < 1 || r.has(i - 1 + t));
}
//#endregion
//#region src/extensions/value-readers.ts
function uu(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" ? String(e) : JSON.stringify(e);
}
function du(e) {
	return e == null;
}
var fu = "data-ui-trim-input", pu = class {
	readers = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let e of _u) this.register(e);
		for (let t of e ?? []) this.register(t);
	}
	register(e) {
		this.readers.set(e.kind, e.read);
	}
	read(e) {
		let t = e.getAttribute(Ut);
		if (t === null) return mu(e);
		let n = this.readers.get(t);
		return n === void 0 ? (s("value reader: no reader registered for this kind.", { kind: t }), null) : n(e);
	}
	readBound(e) {
		let t = this.read(e);
		return typeof t == "string" && e.hasAttribute(fu) ? t.trim() : t;
	}
	readHeld(e) {
		let t = gu(e);
		return t === null ? null : this.read(t);
	}
};
function mu(e) {
	if (e instanceof HTMLInputElement) switch (e.type) {
		case "checkbox": return e.checked;
		case "number":
		case "range": return e.value.trim().length === 0 ? null : Number(e.value);
		default: return e.value;
	}
	return e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement ? e.value : e instanceof HTMLDetailsElement ? e.open : null;
}
var hu = "input, textarea, select";
function gu(e) {
	return e.hasAttribute("data-ui-value-kind") || e.matches(hu) ? e : e.querySelector("[data-ui-value-holder]") ?? e.querySelector(`[data-ui-value-kind], ${hu}`);
}
var _u = [
	{
		kind: "flyout-open",
		read: (e) => e.classList.contains("ui-flyout--open")
	},
	{
		kind: "splitter-position",
		read: (e) => ru(e.getAttribute(nr))
	},
	{
		kind: "pane-layout",
		read: (e) => e.getAttribute(rr)
	},
	{
		kind: "tabs-selected",
		read: (e) => e.getAttribute(vi)
	},
	{
		kind: "tab-caption",
		read: (e) => e.getAttribute(yi)
	},
	{
		kind: "tab-pinned",
		read: (e) => e.hasAttribute(Ci)
	},
	{
		kind: "tree-title",
		read: (e) => e.getAttribute(jr)
	},
	{
		kind: "tree-drop-target",
		read: (e) => e.getAttribute("data-ui-tree-drop-target") ?? ""
	},
	{
		kind: "selected-key",
		read: (e) => e.getAttribute(hi)
	},
	{
		kind: "selected-keys",
		read: (e) => vu(e, gi)
	},
	{
		kind: Wt,
		read: (e) => vu(e, pt)
	},
	{
		kind: Gt,
		read: (e) => e.getAttribute(mt)
	},
	{
		kind: Kt,
		read: (e) => e.getAttribute(ht)
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
function vu(e, t) {
	let n = e.getAttribute(t);
	return n === null ? null : JSON.parse(n);
}
function yu(e) {
	e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio") ? e.checked = !1 : (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement) && (e.value = "");
}
//#endregion
//#region src/interactions/keyboard-shortcut.ts
function bu(e) {
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
		default: o = Iu(e);
	}
	return o === null ? null : {
		code: o,
		ctrl: n,
		shift: r,
		alt: i,
		meta: a
	};
}
function xu(e, t, n = Au()) {
	return t.code !== e.code || t.shiftKey !== e.shift || t.altKey !== e.alt ? !1 : e.ctrl && !e.meta && n ? t.ctrlKey !== t.metaKey : t.ctrlKey === e.ctrl && t.metaKey === e.meta;
}
function Su(e, t = Au()) {
	let n = Eu(e.code, t);
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
function Cu(e, t = Au()) {
	let n = wu(e.code), r = (t, r) => [
		t ? "Control" : "",
		e.alt ? "Alt" : "",
		e.shift ? "Shift" : "",
		r ? "Meta" : "",
		n
	].filter((e) => e.length > 0).join("+");
	return e.ctrl && !e.meta && t ? `${r(!0, !1)} ${r(!1, !0)}` : r(e.ctrl, e.meta);
}
function wu(e) {
	return /^Key[A-Z]$/.test(e) ? e.slice(3) : /^Digit[0-9]$/.test(e) ? e.slice(5) : Tu[e] ?? e;
}
var Tu = {
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
function Eu(e, t) {
	return /^Key[A-Z]$/.test(e) ? e.slice(3) : /^Digit[0-9]$/.test(e) ? e.slice(5) : (t ? Ou[e] : void 0) ?? Du[e] ?? e;
}
var Du = {
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
}, Ou = {
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
}, ku = null;
function Au() {
	return ku === null && (ku = ju()), ku;
}
function ju() {
	if (typeof navigator > "u") return !1;
	let e = navigator.userAgentData?.platform;
	return /mac/i.test(e ?? navigator.platform ?? "");
}
var Mu = {
	words(e) {
		let t = bu(e);
		return t === null ? null : Su(t);
	},
	aria(e) {
		let t = bu(e);
		return t === null ? null : Cu(t);
	},
	matches(e, t) {
		let n = bu(t);
		return n !== null && xu(n, e);
	},
	isComposing: j
}, Nu = 229;
function j(e) {
	return e.isComposing || e.keyCode === Nu;
}
function M(e, t = {}) {
	return !e.ctrlKey && !e.metaKey && (t.alt === !0 || !e.altKey) && (t.shift === !0 || !e.shiftKey) && !j(e);
}
var Pu = class {
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
function Fu(e) {
	return [
		e.ctrl ? "ctrl" : "",
		e.shift ? "shift" : "",
		e.alt ? "alt" : "",
		e.meta ? "meta" : "",
		e.code
	].filter((e) => e.length > 0).join("+");
}
function Iu(e) {
	if (e.length === 1) {
		let t = e.toUpperCase();
		return t >= "A" && t <= "Z" ? `Key${t}` : t >= "0" && t <= "9" ? `Digit${t}` : Lu[t] ?? null;
	}
	let t = e.length === 0 ? "" : e[0].toUpperCase() + e.slice(1).toLowerCase();
	return /^F([1-9]|1[0-9]|2[0-4])$/.test(t.toUpperCase()) ? t.toUpperCase() : Lu[t] ?? null;
}
var Lu = {
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
}, Ru = "data-ui-rename-field";
function zu(e) {
	return e instanceof Element && e.closest(`[${Ru}]`) !== null;
}
function Bu(e) {
	let { container: t, title: n } = e;
	if (t.querySelector(`.${e.className}`) !== null) return !1;
	let r = document.createElement("input");
	r.type = "text", r.className = e.className, r.setAttribute(Ru, ""), r.setAttribute(et, ""), r.value = e.value, Uu(r, n, t);
	let i = !1, a = null, o = (t, o) => {
		if (i) return;
		i = !0, a?.();
		let s = r.value.trim();
		r.remove(), n.style.visibility = "", t && (s.length > 0 || e.allowEmpty === !0) && s !== e.value && e.commit(s), e.done?.(), o && e.refocus?.();
	};
	return r.addEventListener("keydown", (e) => {
		if (!j(e)) {
			if (e.key === "Enter") o(!0, !0);
			else if (e.key === "Escape") o(!1, !0);
			else return;
			e.preventDefault(), e.stopPropagation();
		}
	}), r.addEventListener("blur", () => o(!0, !1)), n.style.visibility = "hidden", t.appendChild(r), t.getClientRects().length > 0 ? Vu(r) : a = Hu(t, () => {
		Uu(r, n, t), Vu(r);
	}), !0;
}
function Vu(e) {
	e.focus(), e.setSelectionRange(0, e.value.length, "backward"), e.scrollLeft = 0;
}
function Hu(e, t) {
	let n = new ResizeObserver(() => {
		e.getClientRects().length !== 0 && (n.disconnect(), t());
	});
	return n.observe(e), () => n.disconnect();
}
function Uu(e, t, n) {
	let r = t.getBoundingClientRect(), i = n.getBoundingClientRect(), a = getComputedStyle(t), o = Wu(n), s = o > 0 && i.width > 0 ? i.width / o : 1;
	e.style.left = Gu((r.left - i.left) / s - n.clientLeft), e.style.top = Gu((r.top - i.top) / s - n.clientTop), e.style.width = Gu(r.width / s), e.style.height = Gu(r.height / s), e.style.fontFamily = a.fontFamily, e.style.fontSize = a.fontSize, e.style.fontWeight = a.fontWeight, e.style.fontStyle = a.fontStyle, e.style.lineHeight = a.lineHeight, e.style.letterSpacing = a.letterSpacing, e.style.textAlign = a.textAlign;
}
function Wu(e) {
	let t = getComputedStyle(e), n = parseFloat(t.width);
	return Number.isFinite(n) ? t.boxSizing === "border-box" ? n : n + parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth) : e.offsetWidth;
}
function Gu(e) {
	return `${Math.round(e * 64) / 64}px`;
}
//#endregion
//#region src/interactions/field-escape.ts
var Ku = "data-ui-runs-on-escape", qu = "ui-key-value-action__row", Ju = "ui-key-value-action__value-input", Yu = "ui-key-value-action__edit-action";
function Xu(e) {
	return j(e) || Zu(e.target) !== null;
}
function Zu(e) {
	return e instanceof Element ? zu(e) || Qu(e) ? e : e.closest("[data-ui-owns-keys]") ?? $u(e)?.cell ?? null : null;
}
function Qu(e) {
	return e instanceof Element && e.hasAttribute(Ku) && (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && !e.readOnly && !O(e);
}
function $u(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${Ju}, .${Yu}`), n = t?.closest(".ui-key-value-action__row") ?? null;
	return t === null || n === null || !n.hasAttribute("data-ui-row-editing") ? null : {
		cell: t,
		row: n
	};
}
//#endregion
//#region src/interactions/caret-fields.ts
var ed = /* @__PURE__ */ new Set([
	"text",
	"search",
	"number",
	"password",
	"email",
	"url",
	"tel"
]), td = /* @__PURE__ */ new Set([
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
]), nd = /* @__PURE__ */ new Set([
	"KeyA",
	"KeyC",
	"KeyV",
	"KeyX",
	"KeyZ",
	"KeyY",
	"Insert"
]), rd = /^F\d{1,2}$/;
function id(e) {
	return e instanceof HTMLInputElement && ed.has(e.type);
}
function ad(e) {
	return id(e) || e instanceof HTMLTextAreaElement;
}
function od(e) {
	return ad(e) || e instanceof HTMLElement && e.isContentEditable;
}
function sd(e) {
	let t = e.target;
	if (!od(t)) return !1;
	if (j(e)) return !0;
	let n = e.key;
	return n === "Tab" || n === "Escape" || rd.test(n) || e.altKey ? !1 : n === "Enter" ? !id(t) : e.ctrlKey || e.metaKey ? td.has(n) || nd.has(e.code) : !0;
}
var cd = {
	...Mu,
	isFieldKey: sd,
	isPlainKey: M,
	isEscapeClaimed: Xu
}, ld = "ui-draft-dropped";
function ud(e) {
	e.dispatchEvent(new Event(ld, { bubbles: !0 }));
}
//#endregion
//#region src/interactions/own-control.ts
var dd = `.ui-text-input__row, .ui-number-input__row, .ui-temporal-input__row, .ui-file-input__row, .ui-color-input__row, .${Li}, .ui-field-box`, fd = "button, a, input, select, textarea, label, summary, [role='button'], [contenteditable=''], [contenteditable='true']", pd = `${fd}, ${dd}, ${Ii}, .${ve}`, md = "button, a, summary, [role='button']";
function hd(e) {
	let t = [];
	for (let n of e.querySelectorAll(pd)) if (!(n.classList.contains("ui-row__grip") || !vd(e, n) || _d(e, n) || t.some((e) => e.contains(n))) && (t.push(n), t.length > 1)) return null;
	let n = t[0];
	return n instanceof HTMLElement && n.matches(md) ? n : null;
}
function gd(e) {
	let t = [];
	for (let n of e.querySelectorAll(fd)) _d(e, n) && vd(e, n) && t.push(n);
	return t;
}
function _d(e, t) {
	let n = t.closest(`[${fe}]`);
	return n !== null && n !== e && e.contains(n);
}
function vd(e, t) {
	let n = t.closest(Ii);
	return (n === null || !e.contains(n)) && t.closest(".ui-action-bar") === null;
}
function yd(e, t) {
	if (!(e instanceof Element)) return null;
	let n = e.closest(pd);
	return n !== null && n !== t && t.contains(n) ? n : null;
}
//#endregion
//#region src/interactions/roving-focus.ts
function bd(e) {
	let t = wd(e.key), n = Td(e.key, e.axis);
	if (t === null && n === 0) return null;
	let r = e.items.filter(P);
	if (r.length === 0) return null;
	if (t !== null) return t === "first" ? r[0] : r[r.length - 1];
	let i = e.current === null ? -1 : r.indexOf(e.current);
	if (i === -1) return n > 0 ? r[0] : r[r.length - 1];
	let a = i + n;
	return a >= 0 && a < r.length ? r[a] : e.loop ?? !0 ? r[(a + r.length) % r.length] : null;
}
function xd(e, t) {
	return wd(e) !== null || Td(e, t) !== 0;
}
var Sd = {
	target: bd,
	applyTabIndex: N
};
function N(e, t) {
	for (let n of e) n.tabIndex = n === t ? 0 : -1;
}
function Cd(e, t) {
	t !== null && (N(e, t), t.focus());
}
function P(e) {
	return e.getClientRects().length > 0 && !O(e);
}
function wd(e) {
	return e === "Home" ? "first" : e === "End" ? "last" : null;
}
function Td(e, t) {
	return t !== "horizontal" && (e === "ArrowDown" || e === "ArrowUp") ? e === "ArrowDown" ? 1 : -1 : t !== "vertical" && (e === "ArrowRight" || e === "ArrowLeft") ? e === "ArrowRight" ? 1 : -1 : 0;
}
//#endregion
//#region src/items/items-viewport.ts
function Ed(e) {
	return e.hasAttribute("data-ui-host-viewport") ? e.parentElement ?? e : e;
}
function Dd(e) {
	return e instanceof Element ? e.hasAttribute("data-ui-items-host") ? e : e.querySelector(`:scope > [${b}][${Jt}]`) : null;
}
function Od(e) {
	let t = Ed(e);
	return t === e ? {
		top: e.scrollTop,
		height: e.clientHeight,
		contentHeight: e.scrollHeight
	} : {
		top: t.scrollTop - Ad(e, t),
		height: t.clientHeight,
		contentHeight: e.scrollHeight
	};
}
function kd(e, t) {
	let n = Ed(e);
	n.scrollTop = n === e ? t : t + Ad(e, n);
}
function Ad(e, t) {
	return e.getBoundingClientRect().top - t.getBoundingClientRect().top - t.clientTop + t.scrollTop;
}
function jd(e) {
	let t = e.getBoundingClientRect();
	return t.height > 0 || e.firstElementChild === null ? t : e.firstElementChild.getBoundingClientRect();
}
//#endregion
//#region src/interactions/multi-select-keys.ts
function Md(e) {
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
function Nd(e) {
	if (e === null) return null;
	let t = Number(e);
	return Number.isInteger(t) && t > 0 ? t : null;
}
function Pd(e, t) {
	return t !== null && e.length >= t;
}
function Fd(e, t, n) {
	return e.includes(t) ? e.filter((e) => e !== t) : Pd(e, n) ? null : [...e, t];
}
function Id(e, t) {
	return e.includes(t) ? e.filter((e) => e !== t) : null;
}
var Ld = /[,\uFF0C\r\n]/;
function Rd(e) {
	return Ld.test(e);
}
function zd(e) {
	return e.split(Ld).map((e) => e.trim()).filter((e) => e.length > 0);
}
function Bd(e) {
	let t = e.split(Ld), n = t.pop() ?? "";
	return {
		tags: t.map((e) => e.trim()).filter((e) => e.length > 0),
		rest: n
	};
}
function Vd(e, t, n, r, i) {
	let a = [...e], o = [], s = null;
	for (let e of t) {
		if (a.includes(e.key)) continue;
		let t = [...a, e.key], c = Pd(a, n) ? r : i(a, t);
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
function Hd(e, t, n) {
	let r = [];
	for (let i of e.querySelectorAll(t)) i.closest(n) === e && r.push(i);
	return r;
}
function Ud(e) {
	return Hd(e, Yn, `.${Vn}`);
}
//#endregion
//#region src/interactions/selected-key.ts
function Wd(e, t, n) {
	t.length !== 0 && e.getAttribute(n.attribute) !== t && (e.setAttribute(n.attribute, t), n.apply(e), e.hasAttribute(n.bindingAttribute) && e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function Gd(e, t, n) {
	return e.length === 0 ? null : e.some((e) => n(e) === t) ? t : n(e[0]);
}
//#endregion
//#region src/interactions/row-selection.ts
var Kd = "data-ui-bind-selected-keys", F = `.ui-items-view, .ui-table, .${hr}`, qd = `.ui-items-view__item, .${dr}, .${gr}`, Jd = ".ui-items-view, .ui-table", Yd = {
	shift: !1,
	ctrl: !1
}, Xd = /* @__PURE__ */ new WeakMap();
function Zd(e, t) {
	t !== null && !Xd.has(e) && Qd(e, t);
}
function Qd(e, t) {
	let n = L(t);
	n.length > 0 && Xd.set(e, n);
}
function $d(e) {
	return {
		shift: e.shiftKey,
		ctrl: e.ctrlKey || e.metaKey
	};
}
function ef(e, t) {
	let n = $d(t);
	return n.shift && e.hasAttribute("data-ui-no-row-select") ? {
		shift: !0,
		ctrl: !0
	} : n;
}
function tf(e) {
	return !e.hasAttribute(Er);
}
function I(e) {
	if (e.getClientRects().length > 0) return e;
	let t = e.querySelector(`:scope > [${ie}]`);
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function nf(e) {
	switch (e.getAttribute(pi)) {
		case "one": {
			let t = e.getAttribute(hi);
			return new Set(t === null || t.length === 0 ? [] : [t]);
		}
		case "many": return new Set(ff(pf(e)));
		default: return /* @__PURE__ */ new Set();
	}
}
function rf(e, t) {
	let n = nf(e), r = e.getAttribute(pi), i = r === "one" || r === "many";
	for (let e of t) {
		let t = n.has(L(e));
		e.toggleAttribute(mi, t);
		let r = i ? t ? "true" : "false" : null;
		e.getAttribute("aria-selected") !== r && (r === null ? e.removeAttribute("aria-selected") : e.setAttribute("aria-selected", r));
	}
}
function af(e) {
	return e.filter((e) => e.hasAttribute(mi));
}
function of(e, t, n, r, i) {
	let a = L(n);
	if (!lf(n)) return !1;
	switch (e.getAttribute(pi)) {
		case "one": return Wd(e, a, {
			attribute: hi,
			bindingAttribute: _i,
			apply: (e) => rf(e, t)
		}), !0;
		case "many": return sf(e, t, n, a, r, i), !0;
		default: return !1;
	}
}
function sf(e, t, n, r, i, a) {
	let o = pf(e);
	if (o === null) return;
	let s = ff(o), c;
	if (i.shift) {
		let o = Xd.get(e), l = o === void 0 ? null : a?.(o, r) ?? null, u = t.find((e) => L(e) === o) ?? n, d = l === null ? df(t, u, n).map(L) : uf(l, t);
		c = i.ctrl ? [...s.filter((e) => !d.includes(e)), ...d] : d;
	} else i.ctrl ? (c = s.includes(r) ? s.filter((e) => e !== r) : [...s, r], Xd.set(e, r)) : (c = [r], Xd.set(e, r));
	cf(e, t, c);
}
function cf(e, t, n) {
	let r = pf(e);
	if (r === null) return;
	let i = JSON.stringify(n);
	r.getAttribute("data-ui-selected-keys") !== i && (r.setAttribute(gi, i), rf(e, t), r.hasAttribute(Kd) && r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function lf(e) {
	return L(e).length > 0 && !Dl(e, "data-ui-unselectable") && !k(e);
}
function uf(e, t) {
	let n = new Map(t.map((e) => [L(e), e]));
	return e.filter((e) => {
		let t = n.get(e);
		return t === void 0 || I(t) !== null && lf(t);
	});
}
function df(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	return r < 0 || i < 0 ? [n] : e.slice(Math.min(r, i), Math.max(r, i) + 1).filter((e) => I(e) !== null && lf(e));
}
function ff(e) {
	return Md(e?.getAttribute("data-ui-selected-keys") ?? null);
}
function pf(e) {
	let t = e.closest(x);
	for (let n of e.querySelectorAll(`[${b}]`)) if (n.closest(F) === e && n.closest("[data-ui-id]") === t) return n;
	return null;
}
function L(e) {
	return e.getAttribute("data-ui-key") ?? "";
}
var mf = {
	isSelected: (e) => e.hasAttribute(mi),
	toggle: hf,
	setSelected: gf,
	setSelectedKeys: _f
};
function hf(e) {
	let t = e.closest(F);
	t !== null && e instanceof HTMLElement && of(t, vf(t), e, {
		shift: !1,
		ctrl: !0
	});
}
function gf(e, t, n) {
	let r = [];
	for (let e of t) e.classList.contains("ui-hidden") || r.push(L(e));
	_f(e, r, n);
}
function _f(e, t, n) {
	if (!(e instanceof HTMLElement)) return;
	let r = vf(e), i = new Set(r.filter((e) => !lf(e)).map(L)), a = /* @__PURE__ */ new Set();
	for (let e of t) e.length > 0 && !i.has(e) && a.add(e);
	let o = [...nf(e)].filter((e) => !a.has(e));
	cf(e, r, n ? [...o, ...a] : o);
}
function vf(e) {
	return Hd(e, qd, F);
}
//#endregion
//#region src/interactions/table-column-layout.ts
var yf = "--ui-table-order-";
function bf(e) {
	let t = new Set((e.getAttribute("data-ui-table-hidden") ?? "").split(" ").filter((e) => e.length > 0)), n = e instanceof HTMLElement ? e.style : null;
	return {
		place: (e) => {
			let t = n?.getPropertyValue(`--ui-table-order-${e}`).trim() ?? "";
			return t.length === 0 ? e : Number(t);
		},
		isHidden: (e) => t.has(String(e))
	};
}
var xf = "ui-table", Sf = `[${sr}]:not(.${mr})`, Cf = `.${dr} > [aria-colspan]:not([${sr}])`;
function wf(e, t, n, r) {
	let i = /* @__PURE__ */ new Map();
	for (let e of t) n.has(e) || i.set(e, String(i.size + 1));
	let a = String(i.size), o = r ? ":not([aria-colindex])" : "";
	C(e, "aria-colcount", a);
	for (let t of e.querySelectorAll(`${Sf}${o}, ${Cf}${o}`)) {
		if (t.closest(`.${xf}`) !== e) continue;
		if (!t.hasAttribute("data-ui-table-column")) {
			C(t, "aria-colindex", "1"), C(t, "aria-colspan", a);
			continue;
		}
		let n = i.get(Number(t.getAttribute(sr)));
		n === void 0 ? t.removeAttribute("aria-colindex") : C(t, "aria-colindex", n);
	}
}
//#endregion
//#region src/interactions/row-cursor.ts
var Tf = ".ui-table[role='grid']", Ef = "gridcell", Df = "aria-colspan", Of = /* @__PURE__ */ new WeakMap();
function kf(e) {
	let t = e.closest(F);
	if (t === null) return null;
	if (e === t) return {
		root: t,
		row: null
	};
	let n = e.closest(qd);
	return n !== null && n.closest(F) === t ? {
		root: t,
		row: n
	} : null;
}
function Af(e) {
	return e.target instanceof Element && !sd(e) ? jf(e.target) : null;
}
function jf(e) {
	let t = kf(e);
	if (t === null || t.row !== null && yd(e, t.row) !== null) return null;
	let n = e.closest(`[${Fi}]`);
	return n !== null && n !== t.root && t.root.contains(n) ? null : t;
}
function Mf(e) {
	return e.filter(Nf);
}
function Nf(e) {
	return I(e) !== null && !k(e);
}
function Pf(e) {
	return Ff(e) ?? Mf(e)[0] ?? null;
}
function Ff(e) {
	return e.find((e) => e.hasAttribute("data-ui-row-focus")) ?? e.find((e) => e.hasAttribute("data-ui-selected") && !k(e)) ?? null;
}
function If(e) {
	return Ff(vf(e));
}
function Lf(e, t) {
	if (e.hasAttribute("data-ui-row-cursor-waits") || t.some((e) => e.hasAttribute("data-ui-row-focus"))) return;
	let n = Pf(t);
	n !== null && zf(e, t, n);
}
function Rf(e, t) {
	t === null ? e.removeAttribute("aria-labelledby") : e.setAttribute("aria-labelledby", aa(t, "ui-row-name"));
}
function zf(e, t, n, r = null, i = !0) {
	for (let e of t) e !== n && e.hasAttribute("data-ui-row-focus") && e.removeAttribute(Pe);
	n.hasAttribute("data-ui-row-focus") || n.setAttribute(Pe, ""), e.removeAttribute(Fe);
	let a = Bf(e, n, r);
	i && ((I(n) ?? n).scrollIntoView({ block: "nearest" }), a !== null && Kf(e, n, a));
}
function Bf(e, t, n) {
	let r = Vf(e) ? Hf(e, t, n) : null;
	for (let t of e.querySelectorAll(`[${Le}]`)) t !== r && t.closest(F) === e && t.removeAttribute(Le);
	if (r === null) return e.setAttribute("aria-activedescendant", aa(t, "ui-row")), null;
	r.hasAttribute("data-ui-cell-focus") || r.setAttribute(Le, "");
	let i = r.getAttribute(sr);
	return i !== null && Of.set(e, i), e.setAttribute("aria-activedescendant", aa(r, "ui-cell")), r;
}
function Vf(e) {
	return e.matches(Tf);
}
function Hf(e, t, n) {
	if (n instanceof HTMLElement && n.parentElement === t && n.getAttribute("role") === Ef) {
		if (!n.hasAttribute("data-ui-owns-keys")) return n;
		let e = Uf(t, n.getAttribute(sr));
		if (e !== null) return e;
	}
	let r = Wf(e, t), i = Of.get(e);
	if (i === void 0) return r[0] ?? null;
	let a = r.find((e) => e.getAttribute(sr) === i);
	if (a !== void 0) return a;
	let o = bf(e), s = o.place(Number(i)), c = (e) => Math.abs(o.place(Number(e.getAttribute(sr))) - s);
	return r.reduce((e, t) => e === null || c(t) < c(e) ? t : e, null);
}
function Uf(e, t) {
	for (let n of e.children) if (t !== null && n instanceof HTMLElement && n.getAttribute("data-ui-table-column") === t && Gf(n)) return n;
	return null;
}
function Wf(e, t) {
	let n = bf(e), r = [];
	for (let e of t.children) {
		let t = Number(e.getAttribute("data-ui-table-column") ?? NaN);
		e instanceof HTMLElement && Number.isInteger(t) && Gf(e) && !n.isHidden(t) && r.push({
			cell: e,
			place: n.place(t)
		});
	}
	return r.sort((e, t) => e.place - t.place).map((e) => e.cell);
}
function Gf(e) {
	return e.getAttribute("role") === Ef && !e.hasAttribute("data-ui-owns-keys");
}
function Kf(e, t, n) {
	let r = e.querySelector(`:scope > .${fr}`);
	if (r === null || !(r.scrollWidth > r.clientWidth) || !n.hasAttribute("data-ui-table-column")) return;
	let i = r.getBoundingClientRect(), a = i.left + i.width / 2, o = i.left + r.clientLeft, s = o + r.clientWidth;
	for (let e of t.children) {
		if (e === n || !(e instanceof HTMLElement) || getComputedStyle(e).position !== "sticky") continue;
		let t = e.getBoundingClientRect();
		t.left + t.width / 2 < a ? o = Math.max(o, t.right) : s = Math.min(s, t.left);
	}
	let c = n.getBoundingClientRect();
	r.scrollLeft += qf(c.left, c.right, o, s);
}
function qf(e, t, n, r) {
	return e < n ? e - n : t > r ? Math.min(t - r, e - n) : 0;
}
function Jf(e) {
	for (let t of e.children) if (t instanceof HTMLElement && t.hasAttribute("data-ui-cell-focus")) return t;
	return null;
}
function Yf(e) {
	return Of.get(e) ?? null;
}
function Xf(e, t, n, r) {
	if (n !== null && $f(n)) return null;
	let i = Wf(e, t), a = n?.getAttribute("data-ui-table-column") ?? null, o = i.findIndex((e) => e.getAttribute(sr) === a);
	switch (r) {
		case "Home": return i[0] ?? null;
		case "End": return i[i.length - 1] ?? null;
		case "ArrowLeft": return o > 0 ? i[o - 1] : null;
		case "ArrowRight": return o < 0 ? i[0] ?? null : i[o + 1] ?? null;
		default: return null;
	}
}
function Zf(e, t, n, r) {
	let i = Qf(t), a = (n === null ? -1 : i.indexOf(n)) + (r ? 1 : -1);
	return i.length === 0 || a < -1 || a >= i.length ? null : a === -1 ? Hf(e, t, null) : i[a];
}
function Qf(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && $f(e));
}
function $f(e) {
	return Gf(e) && e.hasAttribute(Df) && !e.hasAttribute("data-ui-table-column");
}
function ep(e) {
	let t = Qf(e);
	return t[t.length - 1] ?? null;
}
function tp(e, t) {
	let n = t;
	for (; n !== null && n.parentElement !== e;) n = n.parentElement;
	return n?.getAttribute("role") === Ef ? n : null;
}
function np(e, t = null) {
	let n = e.closest(F);
	n !== null && e instanceof HTMLElement && zf(n, vf(n), e, t);
}
function rp(e, t) {
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
function ip(e, t) {
	return xd(e, t === "grid" ? "both" : t) || t !== "horizontal" && ap(e);
}
function ap(e) {
	return e === "PageDown" || e === "PageUp";
}
function op(e, t, n, r) {
	if (!ip(e, r)) return null;
	let i = Mf(t);
	if (ap(e)) return sp(i, n, e === "PageDown");
	if (r === "grid" && (e === "ArrowUp" || e === "ArrowDown")) return cp(i, n, e === "ArrowDown");
	let a = i.map((e) => I(e) ?? e), o = bd({
		key: e,
		items: a,
		current: n === null ? null : I(n),
		axis: r === "grid" ? "horizontal" : r,
		loop: !1
	});
	return o === null ? null : i[a.indexOf(o)] ?? null;
}
function sp(e, t, n) {
	let r = t === null ? -1 : e.indexOf(t), i = r < 0 ? null : e[r].parentElement;
	if (i === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let a = (I(e[r]) ?? e[r]).getBoundingClientRect(), o = Math.min(Od(i).height, window.innerHeight), s = n ? 1 : -1, c = null;
	for (let t = r + s; t >= 0 && t < e.length; t += s) {
		let r = (I(e[t]) ?? e[t]).getBoundingClientRect();
		if (c !== null && (n ? r.bottom > a.top + o + .5 : r.top < a.bottom - o - .5)) break;
		c = e[t];
	}
	return c;
}
function cp(e, t, n) {
	let r = t === null ? null : I(t);
	if (r === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let i = r.getBoundingClientRect(), a = lp(i), o = e.map((e) => ({
		row: e,
		rect: (I(e) ?? e).getBoundingClientRect()
	})).filter(({ rect: e }) => n ? e.top >= i.bottom - .5 : e.bottom <= i.top + .5);
	if (o.length === 0) return null;
	let s = o.reduce((e, t) => (n ? t.rect.top < e.rect.top : t.rect.bottom > e.rect.bottom) ? t : e);
	return o.filter(({ rect: e }) => n ? e.top < s.rect.bottom - .5 : e.bottom > s.rect.top + .5).reduce((e, t) => Math.abs(lp(t.rect) - a) < Math.abs(lp(e.rect) - a) ? t : e).row;
}
function lp(e) {
	return e.left + e.width / 2;
}
var up = "ui-row-press";
function dp(e, t, n) {
	(e.hasAttribute("data-ui-id") ? e : e.querySelector(":scope > [data-ui-id]") ?? e).dispatchEvent(n === void 0 ? new Event(t, { bubbles: !0 }) : new CustomEvent(t, {
		bubbles: !0,
		detail: n
	}));
}
function fp(e, t, n) {
	let r = null, i = !1;
	for (let e of n) e instanceof HTMLElement && e.hasAttribute("data-ui-row-focus") && (r = e), i ||= e.contains(document.activeElement);
	if (r === null && !i) return null;
	let a = [], o = -1;
	if (r !== null) for (let e of t) e === r && (o = a.length), e instanceof HTMLElement && !n.has(e) && a.push(e);
	let s = r !== null && pp(r);
	return () => {
		i && e.focus({ preventScroll: !0 });
		let t = mp(a, o);
		t === null ? r !== null && e.removeAttribute("aria-activedescendant") : zf(e, a, t, null, s);
	};
}
function pp(e) {
	let t = I(e), n = e.parentElement;
	if (t === null || n === null) return !1;
	let r = t.getBoundingClientRect(), i = Ed(n).getBoundingClientRect();
	return r.bottom > Math.max(i.top, 0) && r.top < Math.min(i.bottom, window.innerHeight) && r.right > Math.max(i.left, 0) && r.left < Math.min(i.right, window.innerWidth);
}
function mp(e, t) {
	if (t < 0) return null;
	for (let n = t; n < e.length; n++) if (Nf(e[n])) return e[n];
	for (let n = Math.min(t, e.length) - 1; n >= 0; n--) if (Nf(e[n])) return e[n];
	return null;
}
function hp(e, t) {
	let n = t.find((e) => e.hasAttribute(Pe));
	if (n === void 0 || I(n) !== null) return;
	let r = mp(t, t.indexOf(n));
	r === null ? (n.removeAttribute(Pe), Jf(n)?.removeAttribute(Le), e.removeAttribute("aria-activedescendant")) : zf(e, t, r, null, !1);
}
function gp(e) {
	let t = e.parentElement, n = t?.closest(F) ?? null;
	return n !== null && (n === t || n === t?.parentElement) ? n : t;
}
function _p(e) {
	let t = e.hasAttribute(Pe), n = e.contains(document.activeElement);
	return t || n ? {
		cursor: t,
		focus: n,
		key: e.getAttribute(y)
	} : null;
}
function vp(e, t, n) {
	let r = gp(e);
	n !== null && r !== null && (n.focus && !r.contains(document.activeElement) && r.focus({ preventScroll: !0 }), n.cursor && (t === null ? (typeof n.key == "string" && r.setAttribute(Fe, n.key), r.removeAttribute("aria-activedescendant")) : [...e.children].some((e) => e !== t && e.hasAttribute("data-ui-row-focus")) || xp(r, t)));
}
function yp(e, t) {
	let n = gp(e), r = n?.getAttribute("data-ui-row-cursor-waits") ?? null;
	n !== null && r !== null && r === t.getAttribute("data-ui-key") && (n.removeAttribute(Fe), [...e.children].some((e) => e !== t && e.hasAttribute("data-ui-row-focus")) || xp(n, t));
}
function bp(e) {
	return e.getAttribute(Fe);
}
function xp(e, t) {
	t.setAttribute(Pe, ""), Bf(e, t, null);
}
//#endregion
//#region src/interactions/popup-focus.ts
var Sp = "data-ui-active", Cp = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(","), wp = /* @__PURE__ */ new Set([
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
]), Tp = /* @__PURE__ */ new Set([
	"ArrowDown",
	"ArrowUp",
	"PageDown",
	"PageUp"
]), Ep = !1, Dp = !1, Op = null, kp = /* @__PURE__ */ new Set(), Ap = [], jp = /* @__PURE__ */ new WeakSet();
typeof window < "u" && (window.addEventListener("pointerdown", (e) => Mp(e.target, e.pointerType), !0), window.addEventListener("keydown", (e) => Np(e), !0), window.addEventListener("focus", (e) => Ip(e.target), !0), window.addEventListener("focusin", (e) => Ip(e.target), !0), window.addEventListener("focusout", (e) => Lp(e), !0), window.addEventListener("keydown", (e) => Fp(e)));
function Mp(e, t = "") {
	Ep = !0, Dp = t === "touch";
	let n = document.activeElement;
	Op = n, n instanceof Element && n !== document.body && e instanceof Node && n.contains(e) && Hp(n, !Rp(n)), Up(n);
}
function Np(e) {
	if (!(e instanceof KeyboardEvent && (wp.has(e.key) || Ep && Pp(e)))) {
		Ep = !1;
		for (let e of [...kp]) Hp(e, !1);
		Up(document.activeElement);
	}
}
function Pp(e) {
	return !Rp(e.target) || e.key === "Tab" || e.altKey || e.ctrlKey || e.metaKey ? !1 : !(Tp.has(e.key) && e.target instanceof Element && e.target.getAttribute("role") === "combobox");
}
function Fp(e) {
	if (!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || !M(e)) return;
	let t = document.activeElement;
	t instanceof Element && t !== document.body && !Rp(t) && Hp(t, !0);
}
function Ip(e) {
	Ep && !Rp(e) && Hp(e, !0), e === document.activeElement && Up(document.activeElement);
}
function Lp(e) {
	e.target instanceof Element && e.target.hasAttribute(Sp) || Hp(e.target, !1), e.relatedTarget === null && queueMicrotask(() => Up(document.activeElement));
}
function Rp(e) {
	return ad(e) ? !e.readOnly && !e.disabled : e instanceof HTMLElement && (e.isContentEditable || e.getAttribute("role") === "spinbutton" && e.getAttribute("aria-readonly") !== "true");
}
function zp() {
	return Ep && Op instanceof HTMLElement && Op !== document.body ? Op : null;
}
function Bp() {
	return Ep;
}
function Vp() {
	return Ep && Dp;
}
function Hp(e, t) {
	if (e instanceof Element) {
		if (t) {
			for (let e of kp) e.isConnected || kp.delete(e);
			kp.add(e);
		} else kp.delete(e);
		e.hasAttribute("data-ui-pointer-focus") !== t && e.toggleAttribute(li, t), e === document.activeElement && Up(e);
	}
}
function Up(e) {
	let t = e === null || e === document.body || Rp(e) ? null : e.hasAttribute("data-ui-pointer-focus") ? "pointer" : "keyboard", n = e === null || t === null ? [] : Wp(e);
	for (let e of Ap) n.includes(e) || e.removeAttribute(ui);
	for (let e of n) t !== null && e.getAttribute("data-ui-focus-within") !== t && e.setAttribute(ui, t);
	Ap = n;
}
function Wp(e) {
	let t = [];
	for (let n = e.parentElement; n !== null && n !== document.body && !n.hasAttribute("data-ui-region") && (t.push(n), !n.hasAttribute("data-ui-id") || Gp(n)); n = n.parentElement);
	return t;
}
function Gp(e) {
	return e.classList.contains("ui-menu--nested") || (e.parentElement?.closest(dd) ?? null) !== null;
}
function R(e) {
	Ip(e), Kp(e);
}
function Kp(e) {
	Up(e), e.focus({ preventScroll: !0 }), Up(document.activeElement);
}
function qp(e) {
	Hp(e, !0), Kp(e);
}
function Jp(e) {
	for (let t of e.querySelectorAll(Cp)) if (Ol(t)) return t;
	return null;
}
var Yp = {
	first: Jp,
	stops: (e) => Xp(e, document.activeElement),
	giveBack: (e) => im(e),
	trapTab: $p
};
function Xp(e, t) {
	let n = [...e.querySelectorAll(Cp)].filter((e) => e === t || e.tabIndex >= 0 && Ol(e)), r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let t = Zp(e);
		if (t === null) continue;
		let n = r.get(t);
		(n === void 0 || !Qp(n) && Qp(e)) && r.set(t, e);
	}
	return n.filter((e) => {
		let t = Zp(e);
		return t === null || r.get(t) === e;
	});
}
function Zp(e) {
	return e instanceof HTMLInputElement && e.type === "radio" && e.name !== "" ? e.name : null;
}
function Qp(e) {
	return e instanceof HTMLInputElement && e.checked;
}
function $p(e, t) {
	let n = Xp(e, document.activeElement);
	if (n.length === 0) {
		t.preventDefault();
		return;
	}
	let r = em(e, n, document.activeElement, t.shiftKey);
	r !== null && (t.preventDefault(), r.focus());
}
function em(e, t, n, r) {
	let i = t[0], a = t[t.length - 1];
	return n === null || !e.contains(n) ? r ? a : i : !r && tm(n, a) ? i : r && tm(n, i) ? a : null;
}
function tm(e, t) {
	return e === t || Zp(e) !== null && Zp(e) === Zp(t);
}
var nm = `.${ji}, .${Mi}, [${Pi}]`;
function rm(e) {
	let t = kf(e)?.root ?? null;
	for (let n = e.parentElement; n !== null; n = n.parentElement) if ((n === t || n.matches(nm)) && n.hasAttribute("tabindex") && Ol(n)) return n;
	return null;
}
function im(e, t = rm(e)) {
	let n = document.activeElement;
	if (t?.isConnected !== !0 || n !== null && n !== document.body) return;
	let r = kf(e);
	r?.root === t && r.row !== null && zf(t, vf(t), r.row, tp(r.row, e)), R(t);
}
function am(e, t) {
	if (e.contains(document.activeElement)) return null;
	let n = document.activeElement instanceof HTMLElement ? document.activeElement : null, r = t ?? Jp(e);
	return om(e), (r === null || r === e) && !e.hasAttribute("tabindex") && (e.tabIndex = -1), R(r ?? e), n;
}
function om(e) {
	Ep ? jp.add(e) : jp.delete(e);
}
function sm(e, t) {
	e.scrollTop = 0, e.scrollLeft = 0;
	let n = t ?? Jp(e);
	return n !== null && cm(e, n), am(e, n);
}
function cm(e, t) {
	let n = e.getBoundingClientRect().top + e.clientTop, r = n + e.clientHeight, i = t.getBoundingClientRect();
	i.bottom > r && (e.scrollTop += Math.min(i.bottom - r, i.top - n));
}
function lm(e, t, n = !1) {
	if (om(e), Ep) {
		N(t, null), e.hasAttribute("tabindex") || (e.tabIndex = -1), R(e);
		return;
	}
	let r = t.filter(P), i = (n ? r[r.length - 1] : r[0]) ?? null;
	i !== null && (N(t, i), R(i));
}
function um(e, t = null) {
	let n = e == null ? null : e.isConnected ? e : dm(e, t);
	for (let e = n; e !== null; e = e.parentElement) if (e.matches(`${Cp}, [tabindex]`) && Ol(e)) return e;
	return n === null ? null : fm(n);
}
function dm(e, t) {
	if (t === null) return null;
	for (let n = e.closest(x); n !== null; n = n.parentElement?.closest("[data-ui-id]") ?? null) {
		let e = t.findEveryComponent(T(n)).filter((e) => e.isConnected);
		if (e.length === 1 && e[0] instanceof HTMLElement) return e[0];
	}
	return null;
}
function fm(e) {
	for (let t = e.closest(x); t !== null; t = t.parentElement?.closest("[data-ui-id]") ?? null) if (Ol(t)) return pm(t), t;
	return null;
}
function pm(e) {
	if (e.hasAttribute("tabindex") || e.tabIndex >= 0) return;
	e.tabIndex = -1;
	let t = (n) => {
		n.target === e && (e.removeAttribute("tabindex"), e.removeEventListener("focusout", t));
	};
	e.addEventListener("focusout", t);
}
function mm(e, t) {
	let n = document.activeElement;
	e != null && t.contains(n) && (hm(n, t) && Hp(e, !Rp(e)), R(e));
}
function hm(e, t) {
	for (let n = e; n !== null; n = n === t ? null : n.parentElement ?? null) if (jp.has(n)) return !0;
	return !1;
}
//#endregion
//#region src/state/value-equality.ts
function gm(e, t) {
	return Object.is(e, t) ? !0 : e === null || t === null || e === void 0 || t === void 0 ? !1 : e instanceof Date || t instanceof Date ? e instanceof Date && t instanceof Date && e.getTime() === t.getTime() : typeof e != "object" || typeof t != "object" ? !1 : Array.isArray(e) || Array.isArray(t) ? Array.isArray(e) && Array.isArray(t) && _m(e, t) : vm(e, t);
}
function _m(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!gm(e[n], t[n])) return !1;
	return !0;
}
function vm(e, t) {
	for (let n in e) if (Object.hasOwn(e, n) && (Object.hasOwn(t, n) ? !gm(e[n], t[n]) : !ym(e[n]))) return !1;
	for (let n in t) if (Object.hasOwn(t, n) && !Object.hasOwn(e, n) && !ym(t[n])) return !1;
	return !0;
}
function ym(e) {
	return e == null;
}
//#endregion
//#region src/transport/attach-gate.ts
var bm = class extends Error {
	constructor(e, t) {
		super(`${e} waited ${t} ms for the page to attach again and was dropped unsent.`), this.name = "CommandExpired";
	}
};
function xm(e, t, n, r, i) {
	return !r && n < e ? null : i - (t - e);
}
var Sm = class extends Error {
	byServerError;
	constructor(e) {
		super("the connection to the server dropped under the call; it is reconnecting.", { cause: e }), this.name = "ConnectionDropped", this.byServerError = e instanceof Error && e.message.startsWith("Server returned an error on close");
	}
}, Cm = class {
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
	get isPending() {
		return this.pending;
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
}, wm = "SessionKey", Tm = "/_ne/session/key", Em = 1e4, Dm = new class {
	trade;
	pending = null;
	lastToken = null;
	constructor(e = km) {
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
function Om(e, t) {
	for (let n of t ?? []) n.kind === "SessionKey" && e.start(n.token);
}
async function km(e) {
	let t = await fetch(Tm, {
		method: "POST",
		credentials: "same-origin",
		keepalive: !0,
		cache: "no-store",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ token: e }),
		signal: AbortSignal.timeout(Em)
	});
	if (!t.ok) throw Error(`the session key trade failed with status ${t.status}.`);
}
//#endregion
//#region src/transport/value-staging.ts
var Am = "/_ne/values", jm = 32768;
jm / 4;
var Mm = 3e4;
function Nm(e) {
	let t = JSON.stringify(e);
	if (t === void 0 || t.length * 3 <= 8192) return null;
	let n = new TextEncoder().encode(t);
	return n.byteLength > 8192 ? n : null;
}
function Pm(e) {
	return e?.updates?.some((e) => typeof e.valueToken == "string") === !0;
}
async function Fm(e, t = null, n = Mm) {
	if (e === void 0 || !Pm(e)) return e;
	await Dm.settled();
	let r = await Promise.all((e.updates ?? []).map(async (e) => {
		let r = e.valueToken;
		if (typeof r != "string") return e;
		let i = t === null ? "" : `?instance=${encodeURIComponent(t)}`, a = await fetch(`${Am}/${encodeURIComponent(r)}${i}`, {
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
async function Im(e) {
	await Dm.settled();
	let t = await fetch(Am, {
		method: "POST",
		body: e,
		headers: { "Content-Type": "application/json" },
		credentials: "same-origin",
		signal: AbortSignal.timeout(Mm)
	});
	if (!t.ok) throw Error(`Staging a large value failed with status ${t.status}.`);
	let n = (await t.json())?.token;
	if (n === void 0 || n.length === 0) throw Error("Staging a large value answered with no token.");
	return n;
}
//#endregion
//#region src/transport/value-change-dispatcher.ts
var Lm = class extends Error {
	constructor() {
		super("the field was changed elsewhere while the connection was away; the reader's value was not sent over it."), this.name = "ValueConflict";
	}
}, Rm = Promise.resolve(), zm = () => {}, Bm = jm * 3 / 4, Vm = 128, Hm = class {
	transport;
	whenCurrent;
	queue = [];
	flight = null;
	given = 0;
	handed = 0;
	sentWaiters = [];
	outstanding = /* @__PURE__ */ new Map();
	constructor(e, t = {}) {
		this.transport = e, this.whenCurrent = t.whenCurrent ?? (() => Rm);
	}
	whenSent() {
		if (this.handed >= this.given) return Rm;
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
		for (; this.flight !== null;) await this.flight.catch(zm);
	}
	dispatchAsync(e, t, n) {
		let r = ++this.given, i = Nm(e.value), a = i === null ? null : Im(i);
		return a?.catch(zm), new Promise((o, s) => {
			let c = Wm(e), l = this.giveOutstanding(c, e.value), u = () => this.settleOutstanding(c), d = this.queue.findIndex((e) => e.field === c), f = [{
				resolve: () => {
					u(), o();
				},
				reject: (e) => {
					u(), s(e);
				}
			}], p = r, m = this.transport.isReattaching === !0, h = n;
			d >= 0 && (f = [...this.queue[d].settles, ...f], p = this.queue[d].sequence, m ||= this.queue[d].weighed, h = this.queue[d].unchanged ?? h, this.queue.splice(d, 1));
			let g = i === null ? Um(e) : Um({
				...e,
				value: void 0
			}) + Vm;
			this.queue.push({
				field: c,
				sequence: p,
				update: e,
				bytes: g,
				body: i,
				staged: a,
				before: t,
				settles: f,
				suspect: !1,
				unchanged: h,
				weighed: m,
				earlier: l
			}), this.pump();
		});
	}
	giveOutstanding(e, t) {
		let n = this.outstanding.get(e);
		n === void 0 && (n = {
			values: [],
			count: 0
		}, this.outstanding.set(e, n));
		let r = [...n.values];
		return n.values.push(t), n.count++, r;
	}
	settleOutstanding(e) {
		let t = this.outstanding.get(e);
		t !== void 0 && --t.count <= 0 && this.outstanding.delete(e);
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
		e.some((e) => e.weighed && e.unchanged !== void 0) && await this.whenCurrent();
		for (let t of e) if (t.weighed && t.unchanged?.([...t.earlier, t.update.value]) === !1) {
			let e = new Lm();
			for (let n of t.settles) n.reject(e);
		} else if (t.staged === null) n.push(t.update), r.push(t);
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
		let i = n.length === 0 ? null : this.transport.processChangeSetAsync({ updates: n }, Gm(r));
		if (this.markHanded(t), i !== null) try {
			await i;
			for (let e of r) for (let t of e.settles) t.resolve();
		} catch (e) {
			if (e instanceof Sm) {
				this.requeue(r, e);
				return;
			}
			for (let t of r) for (let n of t.settles) n.reject(e);
		}
	}
	takeBatch() {
		let e = 0, t = 0;
		for (; e < this.queue.length && (e === 0 || t + this.queue[e].bytes <= Bm);) t += this.queue[e].bytes, e++;
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
					settles: [...r.settles, ...t.settles],
					unchanged: r.unchanged ?? t.unchanged,
					weighed: !0
				};
			} else n.push({
				...r,
				staged: this.restage(r.body),
				suspect: r.suspect || t.byServerError,
				weighed: !0
			});
		}
		n.length !== 0 && (this.queue.unshift(...n), this.given++);
	}
	restage(e) {
		if (e === null) return null;
		let t = this.transport.whenAttached().then(() => Im(e));
		return t.catch(zm), t;
	}
	markHanded(e) {
		this.handed = Math.max(this.handed, e);
		for (let e = this.sentWaiters.length - 1; e >= 0; e--) {
			let t = this.sentWaiters[e];
			t.through <= this.handed && (this.sentWaiters.splice(e, 1), t.resolve());
		}
	}
};
function Um(e) {
	return new TextEncoder().encode(JSON.stringify(e)).byteLength;
}
function Wm(e) {
	return `${e.componentId}:${e.propertyName}:${JSON.stringify(e.dynamicParameters)}`;
}
function Gm(e) {
	let t = e.map((e) => e.before).filter((e) => e !== void 0);
	if (t.length !== 0) return () => {
		for (let e of t) e();
	};
}
//#endregion
//#region src/updates/value-binding-engine.ts
var Km = "data-ui-clear", qm = "data-ui-clear-target", Jm = ["change", "toggle"], Ym = [
	...Jm,
	"expand",
	"collapse",
	"open",
	"close"
];
function Xm(e) {
	let t = pa(e);
	return t === "TwoWay" || t === "OneWayToSource" || t === "OnSubmit";
}
function Zm(e) {
	return pa(e) === "OnSubmit";
}
function Qm(e, t) {
	let n = e.getAttribute(Qe);
	if (n !== null) {
		let e = t.getBindingById(Number(n));
		return {
			bindingId: n,
			binding: e,
			buffered: e !== void 0 && Zm(e.mode)
		};
	}
	for (let n of e.getAttributeNames()) {
		if (!n.startsWith("data-ui-bind-")) continue;
		let r = e.getAttribute(n) ?? "", i = t.getBindingById(Number(r));
		if (i !== void 0 && Xm(i.mode)) return {
			bindingId: r,
			binding: i,
			buffered: Zm(i.mode)
		};
	}
	return null;
}
var $m = class {
	options;
	root;
	pendingSyncByComponent = /* @__PURE__ */ new WeakMap();
	bufferedElements = /* @__PURE__ */ new Set();
	unanswered = /* @__PURE__ */ new Map();
	sends = 0;
	pressedText = /* @__PURE__ */ new Map();
	typed = /* @__PURE__ */ new Set();
	conflicted = /* @__PURE__ */ new Map();
	holdingTyped = !1;
	constructor(e) {
		this.options = e, this.root = e.root ?? document;
		for (let e of Jm) this.root.addEventListener(e, (e) => {
			this.handleValueEventAsync(e).catch((e) => {
				c("value binding engine failed.", e);
			});
		}, !0);
		this.root.addEventListener("input", (e) => this.holdEdited(e), !0), this.root.addEventListener(ld, (e) => this.releaseDropped(e)), this.root.addEventListener("click", (e) => this.handleClear(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && e.target.closest(`[${Km}]`) !== null && e.preventDefault();
		}, !0);
	}
	holdEdited(e) {
		if (e.target instanceof Element) {
			if (!this.typed.has(e.target) && Qm(e.target, this.options.metadata) !== null) {
				for (let e of this.typed) e.isConnected || this.typed.delete(e);
				this.typed.add(e.target);
			}
			!this.bufferedElements.has(e.target) && e.target.hasAttribute("data-ui-form-id") && Qm(e.target, this.options.metadata)?.buffered === !0 && this.bufferValue(e.target);
		}
	}
	releaseDropped(e) {
		if (e.target instanceof Element) for (let t of [...this.bufferedElements]) (e.target.contains(t) || !t.isConnected) && (this.bufferedElements.delete(t), this.endConflict(t));
	}
	releaseForm(e) {
		let t = [];
		for (let n of [...this.bufferedElements]) n.isConnected ? n.getAttribute("data-ui-form-id") === e && (this.bufferedElements.delete(n), this.endConflict(n), t.push(n)) : (this.bufferedElements.delete(n), this.endConflict(n));
		return t;
	}
	hold(e) {
		this.pruneDetached(), this.bufferedElements.add(e);
	}
	release(e) {
		return this.endConflict(e), this.bufferedElements.delete(e);
	}
	isHeld(e) {
		return this.bufferedElements.has(e) || this.unanswered.has(e) || this.holdingTyped && this.isBeingTyped(e);
	}
	isBeingTyped(e) {
		return this.typed.has(e) && e.isConnected && document.activeElement === e;
	}
	holdTypedDuring(e) {
		this.holdingTyped = !0;
		try {
			e();
		} finally {
			this.holdingTyped = !1;
		}
	}
	holdsPush(e, t) {
		let n = this.pressedText.get(e);
		if (n === void 0 || !ad(e)) return this.isHeld(e);
		let r = this.options.valueReaders.readBound(e);
		if (r === n.text || typeof r != "string") return this.isHeld(e);
		if (r.startsWith(n.text) && (typeof t == "string" || t == null)) {
			let i = t ?? "";
			rh(e, i + r.slice(n.text.length)), this.pressedText.set(e, {
				text: i,
				press: n.press
			}), e.dispatchEvent(new Event("input", { bubbles: !0 }));
		}
		return this.commitTyped(e), !0;
	}
	commitTyped(e) {
		let t = Qm(e, this.options.metadata);
		t !== null && (t.buffered ? (this.endConflict(e), this.bufferValue(e)) : this.syncValueAsync(e, t.bindingId).catch((e) => c("value binding engine failed.", e)));
	}
	handleClear(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Km}]`);
		if (t === null) return;
		let n = t.closest(x), r = n?.querySelector(`[${qm}]`) ?? n?.querySelector("[data-ui-bind-value]") ?? n?.querySelector("input, textarea, select");
		r == null || ih(r) || (yu(r), r.dispatchEvent(new Event("input", { bubbles: !0 })), r.dispatchEvent(new Event("change", { bubbles: !0 })), ad(r) && document.activeElement !== r && R(r));
	}
	async handleValueEventAsync(e) {
		if (!(e.target instanceof Element) || e.type === "change" && (A(e.target) || O(e.target))) return;
		let t = Qm(e.target, this.options.metadata);
		t !== null && (e.type !== "change" || this.options.refuses?.(e.target) !== !0) && (t.buffered ? (this.endConflict(e.target), this.bufferValue(e.target)) : (this.bufferedElements.delete(e.target), await this.syncValueAsync(e.target, t.bindingId)));
	}
	bufferValue(e) {
		e.getAttribute("data-ui-form-id") === null ? s("value binding engine: an OnSubmit value has no form to be submitted with.", { element: e.tagName }) : (this.bufferedElements.has(e) || this.pruneDetached(), this.bufferedElements.add(e));
	}
	pruneDetached() {
		for (let e of this.bufferedElements) e.isConnected || this.bufferedElements.delete(e);
		for (let e of this.conflicted.keys()) e.isConnected || this.conflicted.delete(e);
	}
	pressForm(e) {
		let t = /* @__PURE__ */ new Map(), n = {}, r = [];
		for (let n of this.bufferedElements) n.isConnected && n.getAttribute("data-ui-form-id") === e && !this.conflicted.has(n) && t.set(n, this.options.valueReaders.readBound(n));
		for (let t of this.root.querySelectorAll(`[${ln}="${S(e)}"]`)) {
			let e = ad(t) && t.hasAttribute("data-ui-bind-value") ? this.options.valueReaders.readBound(t) : null;
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
			if (i.getAttribute("data-ui-form-id") !== e || this.conflicted.has(i)) continue;
			let a = t === void 0 || n?.(i) === !0;
			if (t !== void 0 && !a && !t.has(i)) continue;
			let o = t === void 0 || a ? this.options.valueReaders.readBound(i) : t.get(i);
			if ((a || !i.isConnected || gm(o, this.options.valueReaders.readBound(i))) && this.bufferedElements.delete(i), !i.isConnected) continue;
			let s = Qm(i, this.options.metadata);
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
		this.typed.delete(e), this.endConflict(e);
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
			}, this.unchangedSince(r, n.dynamicParameters));
		} catch (t) {
			if (!(t instanceof Lm)) throw t;
			this.holdConflicted(e, n.element);
		} finally {
			o();
		}
	}
	holdConflicted(e, t) {
		this.bufferedElements.add(e), this.conflicted.set(e, t), this.options.markConflict?.(t, !0);
	}
	endConflict(e) {
		let t = this.conflicted.get(e);
		t !== void 0 && (this.conflicted.delete(e), this.options.markConflict?.(t, !1));
	}
	conflictedField(e) {
		for (let [t, n] of this.conflicted) if (t.isConnected && t.getAttribute("data-ui-form-id") === e) return n;
		return null;
	}
	unchangedSince(e, t) {
		let n = this.options.readRecorded, r = n?.(e, t);
		if (n !== void 0 && r !== void 0) return (i) => {
			let a = n(e, t);
			return a === void 0 || gm(a, r) || i.some((e) => gm(a, e));
		};
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
		if (i === void 0 || !Xm(i.mode) || Zm(i.mode)) return;
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
	unsavedValues() {
		let e = [], t = /* @__PURE__ */ new Set([
			...this.bufferedElements,
			...this.unanswered.keys(),
			...this.typed
		]);
		for (let n of t) {
			if (!n.isConnected || th(n)) continue;
			let t = Qm(n, this.options.metadata), r = this.options.dom.resolveNearestComponent(n, () => !0);
			if (t === null || t.binding === void 0 || r === null) continue;
			let i = this.options.valueReaders.readBound(n);
			if (!nh(i)) continue;
			let a = this.options.readRecorded?.(t.binding, r.dynamicParameters);
			(this.isHeld(n) || !gm(i, a)) && e.push({
				bindingId: t.bindingId,
				dynamicParameters: r.dynamicParameters,
				value: i,
				...a !== void 0 && nh(a) ? { start: a } : {},
				...this.conflicted.has(n) ? { conflicted: !0 } : {}
			});
		}
		return e;
	}
	restoreUnsaved(e, t) {
		let n = 0;
		for (let r of e) {
			let e = this.findField(r), i = this.options.metadata.getBindingById(Number(r.bindingId));
			e === null || i === void 0 || A(e.element) || O(e.element) || th(e.element) || !gm(this.options.valueReaders.readBound(e.element), r.value) && t(e.element, Number(r.bindingId), r.value) && (n++, r.conflicted === !0 || this.changedSince(r, i) ? this.holdConflicted(e.element, e.component) : (e.element.dispatchEvent(new Event("input", { bubbles: !0 })), e.element.dispatchEvent(new Event("change", { bubbles: !0 }))));
		}
		return n;
	}
	findField(e) {
		for (let t of this.root.querySelectorAll(`input, textarea, select, [${Qe}]`)) {
			if (Qm(t, this.options.metadata)?.bindingId !== e.bindingId) continue;
			let n = this.options.dom.resolveNearestComponent(t, () => !0);
			if (n !== null && gm(n.dynamicParameters, e.dynamicParameters)) return {
				element: t,
				component: n.element
			};
		}
		return null;
	}
	changedSince(e, t) {
		let n = this.options.readRecorded?.(t, e.dynamicParameters);
		return "start" in e && n !== void 0 && !gm(n, e.start) && !gm(n, e.value);
	}
}, eh = /password$|^one-time-code$|^cc-/;
function th(e) {
	return e.hasAttribute("data-ui-secret") || e.type === "password" ? !0 : (e.getAttribute("autocomplete") ?? "").toLowerCase().split(/\s+/).some((e) => eh.test(e));
}
function nh(e) {
	let t = (e) => e === null || typeof e == "string" || typeof e == "boolean" || typeof e == "number" && Number.isFinite(e);
	return t(e) || Array.isArray(e) && e.every(t);
}
function rh(e, t) {
	let n = document.activeElement === e && typeof e.selectionEnd == "number" ? e.value.length - e.selectionEnd : null;
	if (e.value = t, n !== null) {
		let r = Math.max(0, t.length - n);
		e.setSelectionRange(r, r);
	}
}
function ih(e) {
	return e.matches(":disabled") || (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.readOnly;
}
//#endregion
//#region src/events/event-boundary.ts
function ah(e, t) {
	let n = e.closest(`[${et}]`);
	return n !== null && n !== t && t.contains(n);
}
//#endregion
//#region src/events/command-turns.ts
var oh = class {
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
}, sh = class {
	catalog;
	registrations = /* @__PURE__ */ new Map();
	attachments = /* @__PURE__ */ new Map();
	constructor(e) {
		this.catalog = e;
	}
	add(e, t = {}) {
		let n = Na(e);
		if (n.length === 0) throw Error("Event name is required.");
		let r = Na(t.domEventName) || this.catalog.get(n)?.domEventName || n, i = {
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
		return this.registrations.get(Na(e));
	}
	isAttached(e) {
		return this.attachments.has(Na(e));
	}
	attach(e) {
		let t = {};
		return this.attachments.set(Na(e), t), t;
	}
	isCurrent(e, t) {
		return this.attachments.get(e) === t;
	}
}, ch = class {
	create(e, t) {
		return e.createRequest === void 0 ? t.metadata === void 0 ? null : {
			eventId: w(t.metadata.eventId),
			dynamicParameters: [...t.dynamicParameters]
		} : e.createRequest(t);
	}
}, lh = "aria-busy";
function uh(e, t) {
	let n = null, r = !1, i = !1, a = () => {
		n = null, !(!e.isConnected || e.classList.contains("ui-loading") || e.hasAttribute("data-ui-pending")) && (e.setAttribute(oi, ""), r = !0, e.hasAttribute(lh) || (e.setAttribute(lh, "true"), i = !0));
	};
	return t <= 0 ? a() : n = setTimeout(a, t), () => {
		n !== null && (clearTimeout(n), n = null), r && (r = !1, e.removeAttribute(oi), i && !e.classList.contains("ui-loading") && e.removeAttribute(lh));
	};
}
//#endregion
//#region src/events/event-pipeline.ts
var dh = {
	dispatched: !1,
	success: !1
}, fh = () => void 0, ph = class extends Error {
	reason;
	constructor(e) {
		super(String(e)), this.reason = e;
	}
}, mh = class {
	options;
	root;
	registry;
	requestFactory = new ch();
	turns = new oh();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.registry = new sh(e.eventCatalog), this.addEvent("click");
		for (let t of e.events ?? []) this.addEvent(t.name, t);
	}
	addEvent(e, t = {}) {
		let n = this.registry.add(e, t), r = t.attach !== void 0 || t.domEventName !== void 0 || t.options !== void 0;
		this.shouldAttach(n) && (r || !this.registry.isAttached(n.name)) && this.attachEvent(n);
	}
	async dispatchCommandAsync(e) {
		if (this.options.dispatcher.isPending(e)) return !1;
		let t = this.turns.take(), n = performance.now();
		try {
			if (await t.ahead, await this.options.valueBinding?.whenSent(), this.options.dispatcher.isPending(e)) return !1;
			let r = this.options.dispatcher.dispatchAsync(e, n);
			t.done();
			let i = await r;
			return this.options.effects.applyAll(i.command?.effects, this.options.dom), this.options.afterEffects?.(), i.refused !== !0;
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
				e instanceof bm ? l("a press waited past its bound for the page to attach again and was dropped.", e) : c("event pipeline failed.", e);
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
		if (r === null || gh(t, r.element) || ah(t.target, r.element)) return;
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
			let t = e instanceof ph, r = t ? e.reason : e;
			throw n.completed?.({
				...a,
				dispatched: t,
				success: !1,
				error: String(r)
			}), r;
		}
	}
	async runAsync(e, t, n, r) {
		if (r.domEvent.target instanceof Element && O(r.domEvent.target)) return dh;
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
		if (this.options.dispatcher.isPending(i)) return r.domEvent.preventDefault(), dh;
		let a = this.startPendingMark(e, n, r), o = n.getAttribute("data-ui-submit-form-id") ?? (t.submitsForm === !0 ? vh(r) : null), s = null;
		try {
			if (s = o === null ? null : await this.waitForUploadsAsync(o, n, r), s === void 0) return dh;
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
		return e !== "click" || n.metadata?.showsPending === !1 ? fh : uh(t, this.options.isReattaching?.() === !0 ? 0 : 300);
	}
	async waitForUploadsAsync(e, t, n) {
		let r = this.options.valueBinding?.pressForm(e), i = await this.options.uploads?.whenUploadedAsync(e) ?? /* @__PURE__ */ new Set();
		if (i.size === 0) return r?.close(), {
			formId: e,
			waited: i
		};
		let a = n.domEvent.target;
		if (!t.isConnected || a instanceof Element && (!a.isConnected || O(a))) r?.close();
		else return {
			formId: e,
			pressed: r,
			waited: i
		};
	}
	async sendInTurnAsync(e, t, n, r, i, a, o) {
		let s = performance.now();
		if (a !== null) {
			if (this.options.validationEngine?.runSubmitValidation(a.formId) === !1) return r.domEvent.preventDefault(), this.options.validationEngine.focusFirstInvalid(a.formId), dh;
			if (this.refusesConflicted(a.formId, r)) return dh;
			await this.options.valueBinding?.submitFormAsync(a.formId, a.pressed?.values, (e) => _h(a.waited, e));
		}
		if (await this.isRefusedValueEventAsync(t, n) || (await o.ahead, await this.options.valueBinding?.whenSent(), a !== null && this.refusesConflicted(a.formId, r)) || this.options.dispatcher.isPending(i)) return dh;
		this.options.interactionEngine.applyEvent({
			name: `before-${e}`,
			componentId: r.componentId,
			dynamicParameters: r.dynamicParameters,
			domEvent: r.domEvent
		});
		let c = this.options.dispatcher.dispatchAsync(i, s);
		o.done();
		let l = await c.catch((t) => {
			throw this.applyAfterEvent(e, r), new ph(t);
		});
		return this.options.effects.applyAll(l.command?.effects, this.options.dom), this.options.afterEffects?.(), this.applyAfterEvent(e, r), a !== null && this.options.validationEngine?.focusFirstInvalid(a.formId), {
			dispatched: !0,
			success: l.command?.success !== !1,
			error: l.command?.error ?? null
		};
	}
	refusesConflicted(e, t) {
		let n = this.options.valueBinding?.conflictedField(e) ?? null;
		return n !== null && (t.domEvent.preventDefault(), this.options.validationEngine?.focusField(n), !0);
	}
	async isRefusedValueEventAsync(e, t) {
		return !Ym.includes(e.name) && e.settlesValue !== !0 ? !1 : (await this.options.valueBinding?.whenSettled(t), this.options.validationEngine?.isRefused(t) === !0);
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
		return n.hasAttribute($e(e)) ? !1 : this.options.metadata.hasServerEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(`before-${e}`, t) || this.options.interactionEngine.hasEventForComponent(`after-${e}`, t);
	}
	applyDomPolicy(e, t) {
		hh(e.preventDefault, t) && t.domEvent.preventDefault(), hh(e.stopPropagation, t) && t.domEvent.stopPropagation();
	}
};
function hh(e, t) {
	return e === void 0 ? !1 : typeof e == "function" ? e(t) : e;
}
function gh(e, t) {
	if (e.type !== "mouseenter" && e.type !== "mouseleave") return !1;
	let n = e.relatedTarget;
	return n instanceof Node && t.contains(n);
}
function _h(e, t) {
	for (let n of e) if (n.contains(t)) return !0;
	return !1;
}
function vh(e) {
	let t = e.domEvent.target;
	return ((t instanceof Element ? t.closest("[data-ui-form-id]") : null) ?? e.component.querySelector("[data-ui-form-id]"))?.getAttribute("data-ui-form-id") ?? null;
}
//#endregion
//#region src/interactions/focus-handoff.ts
function yh() {
	let e = document.activeElement;
	return e === null || e === document.body ? null : e;
}
function bh(e) {
	let t = document.activeElement;
	if (!e.isConnected || t !== e && t !== document.body) return null;
	if (xh(e)) return Sh(e, () => bh(e)), null;
	let n = e;
	for (; n.parentElement !== null && !xh(n.parentElement);) n = n.parentElement;
	let r = Th(n) ?? Eh(n) ?? Dh();
	return r !== null && R(r), r;
}
function xh(e) {
	return e.checkVisibility({ visibilityProperty: !0 });
}
function Sh(e, t) {
	if (typeof document.getAnimations != "function") return;
	let n = document.getAnimations().filter((t) => Ch(t) && wh(t)?.contains(e) === !0);
	n.length > 0 && Promise.all(n.map((e) => e.finished)).then(t, () => void 0);
}
function Ch(e) {
	return e.transitionProperty === "visibility";
}
function wh(e) {
	return e.effect?.target ?? null;
}
function Th(e) {
	let t = (e.closest(".ui-key-value-action__value-input, .ui-key-value-action__edit-action")?.closest(".ui-key-value-action__row") ?? null)?.querySelector(".ui-key-value-action__action")?.querySelector(Cp) ?? null;
	return t !== null && xh(t) ? t : null;
}
function Eh(e) {
	let t = Xp(e.closest(nm) ?? document, null).filter((t) => !e.contains(t)), n = t.find((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0), r = t.filter((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_PRECEDING) !== 0);
	return n ?? r[r.length - 1] ?? null;
}
function Dh() {
	let e = document.querySelector(`[${zn}="content"]`);
	return e === null ? null : (pm(e), e);
}
//#endregion
//#region src/interactions/interaction-engine.ts
var Oh = class {
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
		for (let e of Jm) i.addEventListener(e, (e) => this.applyEditedValue(e), !0);
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
		for (let n of t) Ah(n, e.dynamicParameters) && this.applyInteraction(n, e.dynamicParameters, !0);
	}
	takesRowEvent(e, t, n) {
		for (let r of this.index.getEventInteractions(t, e)) if (kh(r) && Ah(r, n)) return !0;
		return !1;
	}
	applyEditedValue(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.resolveEdited(e.target);
		if (t === null) return;
		let n = this.options.valueReaders.readBound(e.target), r = Nh(t.interactions[0].source, t.dynamicParameters);
		if (!(this.heard.has(r) && gm(this.heard.get(r), n))) {
			this.heard.set(r, n);
			for (let e of t.interactions) this.applyInteraction(e, t.dynamicParameters, !0, n);
		}
	}
	resolveEdited(e) {
		let t = this.options.dom.resolveNearestComponent(e, () => !0);
		if (t === null) return null;
		let n = Qm(e, this.options.metadata), r;
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
			for (let e of t.interactions) ha(e.actionKind) === "CopyValue" && Ph(e.target) && this.writeTarget(e.target, t.dynamicParameters, jh(e, n), !0);
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
		let t = this.index.getPropertyInteractions(w(e.reference.componentId), e.reference.propertyId), n = t.length > 0 ? Nh(e.reference, e.dynamicParameters) : null;
		n !== null && this.heard.has(n) && this.heard.set(n, e.value);
		for (let n of t) this.applyInteraction(n, e.dynamicParameters, !1, e.value);
	}
	applyInteraction(e, t, n, r = !0) {
		let i = ha(e.actionKind);
		if (i === "Effect") {
			this.applyEffectInteraction(e, t, r);
			return;
		}
		let a = e.target;
		if (!Ph(a)) return;
		let o = i === "CopyValue" ? jh(e, r) : this.evaluator.evaluate(e, r);
		this.writeTarget(a, t, o, n), n && this.options.writeBack?.(a, t, o);
	}
	writeTarget(e, t, n, r) {
		let i = yh();
		this.applyDepth++;
		try {
			this.propertyPatchEngine.applyPropertyValue(e, t, n, r);
		} finally {
			this.applyDepth--;
		}
		i !== null && bh(i);
	}
	applyEffectInteraction(e, t, n) {
		let r = e.effect;
		r == null ? s("effect interaction carries no effect.", e) : this.evaluator.matches(e, n) && this.options.effects.apply({
			effect: Mh(r, t, this.options.dom),
			dom: this.options.dom,
			row: t
		});
	}
};
function kh(e) {
	return e.sourceEvent?.rowKey != null;
}
function Ah(e, t) {
	let n = e.sourceEvent?.rowKey;
	if (n == null) return !0;
	let r = t.length === 0 ? void 0 : t[t.length - 1];
	return r != null && String(r) === n;
}
function jh(e, t) {
	return (t == null || typeof t == "string" && t.trim().length === 0) && e.falseValue !== void 0 ? e.falseValue : t;
}
function Mh(e, t, n) {
	if (t.length === 0) return e;
	let r = e.target;
	if (r === void 0 || (r.dynamicParameters?.length ?? 0) > 0) return e;
	let i = w(r.id);
	for (let a = t.length; a >= 0; a--) {
		let o = t.slice(0, a), s = n.findComponent(i, o);
		if (s !== null && Va(s, o)) return a === 0 ? e : {
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
function Nh(e, t) {
	return JSON.stringify([w(e?.componentId), e?.propertyId ?? ""]) + Ca(t);
}
function Ph(e) {
	return e != null && e.propertyId.length > 0;
}
//#endregion
//#region src/interactions/interaction-evaluator.ts
var Fh = class {
	evaluate(e, t) {
		return this.matches(e, t) ? e.trueValue : e.falseValue;
	}
	matches(e, t) {
		return Ih(t, e.operator, e.value);
	}
};
function Ih(e, t, n) {
	let r = Lh(e), i = Lh(n);
	switch (ga(t)) {
		case "Required": return r != null && r !== !1 && String(r).trim().length > 0;
		case "Equal": return String(r ?? "") === String(i ?? "");
		case "NotEqual": return String(r ?? "") !== String(i ?? "");
		case "Greater": return Rh(r, i, (e) => e > 0);
		case "GreaterOrEqual": return Rh(r, i, (e) => e >= 0);
		case "Less": return Rh(r, i, (e) => e < 0);
		case "LessOrEqual": return Rh(r, i, (e) => e <= 0);
		case "Like": return String(r ?? "").includes(String(i ?? ""));
		case "LikeIgnoreCase": return String(r ?? "").toLocaleLowerCase().includes(String(i ?? "").toLocaleLowerCase());
		case "In": return Array.isArray(i) && i.some((e) => String(e ?? "") === String(r ?? ""));
		case "Regex": return Bh(r, i);
		case "RegexEach": return zh(r, i);
		default: return !1;
	}
}
function Lh(e) {
	return E(e) ? e.key : Mc(e) ? e.text : e;
}
function Rh(e, t, n) {
	let r = Number(e), i = Number(t);
	return !Number.isNaN(r) && !Number.isNaN(i) ? n(r < i ? -1 : +(r > i)) : !Number.isNaN(r) || !Number.isNaN(i) || typeof e != "string" || typeof t != "string" ? !1 : n(e < t ? -1 : +(e > t));
}
function zh(e, t) {
	return e == null ? !0 : Array.isArray(e) ? e.every((e) => Bh(Lh(e), t)) : Bh(e, t);
}
function Bh(e, t) {
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
var Vh = "Value", Hh = "EndValue", Uh = "Pressed", Wh = class {
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
		return this.eventNames.has(Na(e));
	}
	getSourceEventNames() {
		let e = /* @__PURE__ */ new Set();
		for (let t of this.eventNames) qh(t) || e.add(t);
		return e;
	}
	hasEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(Na(e))?.has(t) === !0;
	}
	getEventInteractions(e, t) {
		return this.eventInteractions.get(Jh(e, t)) ?? [];
	}
	getPropertyInteractions(e, t) {
		return this.propertyInteractions.get(Yh(e, t)) ?? [];
	}
	getValueInteractions(e) {
		return this.valueInteractions.get(e) ?? [];
	}
	getEndValueInteractions(e) {
		return this.endValueInteractions.get(e) ?? [];
	}
	addInteraction(e) {
		if (Gh(e)) {
			let t = w(e.sourceEvent?.componentId), n = Na(e.sourceEvent?.eventName);
			if (t > 0 && n.length > 0) {
				let r = this.eventInteractions.get(Jh(t, n));
				r === void 0 && (r = [], this.eventInteractions.set(Jh(t, n), r)), r.push(e), this.eventNames.add(n);
				let i = this.eventComponentIdsByName.get(n);
				i === void 0 && (i = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(n, i)), i.add(t);
			}
		} else if (Kh(e)) {
			let t = w(e.source?.componentId), n = e.source?.propertyId ?? "";
			if (t > 0 && n.length > 0) {
				let r = this.propertyInteractions.get(Yh(t, n));
				r === void 0 && (r = [], this.propertyInteractions.set(Yh(t, n), r)), r.push(e), ha(e.actionKind) === "CopyValue" && (this.copiesValues = !0);
				let i = this.metadata.getPropertyDefinition(n)?.propertyName, a = i === Vh || i === Uh ? this.valueInteractions : i === Hh ? this.endValueInteractions : null;
				if (a !== null) {
					let n = a.get(t) ?? [];
					n.push(e), a.set(t, n);
				}
			}
		}
	}
};
function Gh(e) {
	return ma(e.sourceKind) === "Event";
}
function Kh(e) {
	return ma(e.sourceKind) === "Property";
}
function qh(e) {
	return e.startsWith("before-") || e.startsWith("after-");
}
function Jh(e, t) {
	return `${e}:${Na(t)}`;
}
function Yh(e, t) {
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
function Xh() {
	return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function Zh(e) {
	if (typeof e.getAnimations == "function") for (let t of e.getAnimations()) typeof CSSTransition == "function" && t instanceof CSSTransition && t.finish();
}
function Qh(e, t, n) {
	let r = !1, i = () => {
		r || (r = !0, clearTimeout(a), n());
	}, a = setTimeout(i, t), o = typeof e.getAnimations == "function" ? e.getAnimations().filter((e) => typeof CSSTransition != "function" || e instanceof CSSTransition) : [];
	Promise.allSettled(o.map((e) => e.finished)).then(i);
}
//#endregion
//#region src/rendering/responsive-tier.ts
var B = [
	"base",
	"sm",
	"md",
	"xl",
	"xxl"
], $h = B.filter((e) => e !== "base"), eg = {
	sm: 640,
	md: 768,
	xl: 1280,
	xxl: 1536
};
function tg(e) {
	return `(min-width: ${eg[e]}px)`;
}
var ng = tg("sm"), rg = /* @__PURE__ */ new Map();
function ig(e, t = $h) {
	if (typeof matchMedia == "function") for (let n of t) ag(n).addEventListener("change", () => e());
}
function ag(e) {
	let t = rg.get(e);
	return t === void 0 && (t = matchMedia(tg(e)), rg.set(e, t)), t;
}
function og() {
	if (typeof matchMedia != "function") return "base";
	for (let e = $h.length - 1; e >= 0; e--) if (ag($h[e]).matches) return $h[e];
	return "base";
}
function sg(e, t) {
	return t === "base" ? e : `${e}-${t}`;
}
function cg(e, t) {
	if (e == null) return;
	let n = typeof e == "object" ? e : void 0;
	return n === void 0 || !("base" in n) ? t === "base" ? e : void 0 : n[t];
}
function lg(e, t) {
	return ug(t, (t) => cg(e, t));
}
function ug(e, t) {
	for (let n = B.indexOf(e); n >= 0; n--) {
		let e = t(B[n]);
		if (e != null) return e;
	}
}
//#endregion
//#region src/interactions/anchored-popup.ts
var dg = /* @__PURE__ */ new Set([
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
function fg(e) {
	return dg.has(e);
}
var pg = 4, mg = 12, hg = /* @__PURE__ */ new Map(), gg = !1, _g = null, vg = /* @__PURE__ */ new WeakMap(), yg = "data-ui-popup-stood-in";
function bg(e, t) {
	t === null ? vg.delete(e) : vg.set(e, t);
}
var xg = "--ui-popup-ground";
function Sg(e, t) {
	let n = e.closest("[data-ui-theme]") === t.closest("[data-ui-theme]") ? getComputedStyle(e).getPropertyValue(xg).trim() : "";
	n.length === 0 ? t.style.removeProperty(xg) : t.style.setProperty(xg, n);
}
function Cg(e, t, n) {
	hg.set(t, {
		anchor: e,
		options: n
	}), Lg(), _g?.observe(t), kg(e, t), zg(e, t, n);
}
var wg = "data-ui-popup-lifted", Tg = "data-ui-sheet";
function Eg() {
	return typeof matchMedia == "function" && !matchMedia(ng).matches;
}
function Dg(e) {
	return e.hasAttribute(Tg);
}
function Og(e) {
	e.hasAttribute(wg) ? e.matches(":popover-open") || e.showPopover() : (e.setAttribute("popover", "manual"), e.setAttribute(wg, ""), Ag(e));
}
function kg(e, t) {
	(t.hasAttribute(wg) || jg(t) || e.closest(`[${wg}]`) !== null) && Og(t);
}
function Ag(e) {
	let t = getComputedStyle(e), n = t.transitionProperty.split(",").map((e) => e.trim()), r = n.indexOf("overlay");
	if (r === -1) {
		e.showPopover();
		return;
	}
	let i = t.transitionDuration.split(",").map((e) => e.trim());
	e.style.setProperty("transition-duration", n.map((e, t) => t === r ? "0s" : i[t % i.length]).join(", ")), e.showPopover(), getComputedStyle(e).getPropertyValue("overlay"), e.style.removeProperty("transition-duration");
}
function jg(e) {
	for (let t = e.parentElement; t !== null; t = t.parentElement) {
		let e = getComputedStyle(t);
		if (e.transform !== "none" || e.filter !== "none" || e.perspective !== "none" || Mg(e.translate) || Mg(e.scale) || Mg(e.rotate) || t.hasAttribute("data-ui-surface-image-blur") && e.isolation === "isolate") return !0;
	}
	return !1;
}
function Mg(e) {
	return e !== void 0 && e !== "" && e !== "none";
}
var Ng = z.normal * 5;
function Pg(e, t) {
	e.hasAttribute(wg) && (e.matches(":popover-open") && e.hidePopover(), Qh(e, Ng, () => {
		e.matches(":popover-open") || hg.has(e) || (e.removeAttribute("popover"), e.removeAttribute(wg), t?.());
	}));
}
function Fg(e) {
	let t = hg.get(e);
	t !== void 0 && zg(t.anchor, e, t.options);
}
function Ig(e) {
	e != null && (hg.delete(e), _g?.unobserve(e), Pg(e));
}
function Lg() {
	gg || (gg = !0, document.addEventListener("scroll", (e) => Rg(e.target), !0), window.addEventListener("resize", () => Rg(null)), window.visualViewport?.addEventListener("resize", () => Rg(null)), window.visualViewport?.addEventListener("scroll", () => Rg(null)), _g = new ResizeObserver((e) => {
		for (let t of e) {
			if (!(t.target instanceof HTMLElement)) continue;
			let e = hg.get(t.target);
			e !== void 0 && zg(e.anchor, t.target, e.options, !0);
		}
	}));
}
function Rg(e) {
	for (let [t, n] of hg) t.isConnected ? e instanceof Node && t.contains(e) || zg(n.anchor, t, n.options) : Ig(t);
}
function zg(e, t, n, r = !1) {
	if (!e.isConnected) return;
	let i = Ug(e), a = i !== e;
	t.hasAttribute(yg) !== a && t.toggleAttribute(yg, a), n.minAnchorWidth === !0 && (t.style.minWidth = `${i.getBoundingClientRect().width}px`);
	let o = t.hasAttribute(Bg) ? {
		top: t.scrollTop,
		left: t.scrollLeft
	} : null;
	Hg(t);
	let s = i.getBoundingClientRect(), c = (i === e ? n.crossAnchor ?? i : i).getBoundingClientRect(), l = i === e && n.surface !== void 0 ? n.surface.getBoundingClientRect() : s, u = n.gap ?? 4, d = t.getBoundingClientRect(), f = Kg(n.boundary), p = hg.get(t), m = r ? p?.side : void 0, h = m !== void 0 && Jg(l, d, m, u, f) ? m : qg(l, d, n.placement, u, f);
	p !== void 0 && (p.side = h), Jg(l, d, h, u, f) || (Vg(t, h, Qg(l, h, f) - u - pg), d = t.getBoundingClientRect(), o !== null && (t.scrollTop = o.top, t.scrollLeft = o.left));
	let g = n.alignEntries === !0 ? n_(t, h) : t_, _ = i_(l, c, d, h, u, g), v = a_(l, c, d, h, u, g);
	n.arrow === !0 && (Zg(h) ? v = Wg(v, c.left + c.width / 2, d.width) : _ = Wg(_, c.top + c.height / 2, d.height));
	let ee = s_();
	_ = ee.top + d_(_ - ee.top, d.height, ee.bottom - ee.top), v = d_(v, d.width, window.innerWidth), t.style.top = `${_}px`, t.style.left = `${v}px`, t.dataset.uiPlacement !== h && (t.dataset.uiPlacement = h), Gg(t, c, d, h, _, v);
}
var Bg = "data-ui-popup-capped";
function Vg(e, t, n) {
	let r = Zg(t);
	e.setAttribute(Bg, ""), e.style.setProperty(r ? "max-height" : "max-width", `${Math.max(0, n)}px`), e.style.setProperty(r ? "overflow-y" : "overflow-x", "auto");
}
function Hg(e) {
	if (e.hasAttribute(Bg)) {
		e.removeAttribute(Bg);
		for (let t of [
			"max-height",
			"max-width",
			"overflow-y",
			"overflow-x"
		]) e.style.removeProperty(t);
	}
}
function Ug(e) {
	for (let t = e; t !== null; t = t.parentElement) {
		if (t.hasAttribute(yg)) return e;
		let n = vg.get(t);
		if (n !== void 0) return n;
	}
	return e;
}
function Wg(e, t, n) {
	let r = t - e;
	return r < mg ? e - (mg - r) : r > n - mg ? e + (r - (n - mg)) : e;
}
function Gg(e, t, n, r, i, a) {
	let o = Zg(r), s = o ? t.left + t.width / 2 - a : t.top + t.height / 2 - i, c = o ? n.width : n.height;
	e.style.setProperty("--ui-popup-arrow", `${Math.max(mg, Math.min(s, c - mg))}px`);
}
function Kg(e) {
	let t = s_(), n = {
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
function qg(e, t, n, r, i) {
	let a = $g(n);
	if (Jg(e, t, n, r, i)) return n;
	if (Jg(e, t, a, r, i)) return a;
	for (let a of Yg(n)) if (Jg(e, t, a, r, i)) return a;
	return Qg(e, a, i) > Qg(e, n, i) ? a : n;
}
function Jg(e, t, n, r, i) {
	return Qg(e, n, i) >= Xg(t, n) + r;
}
function Yg(e) {
	return e.startsWith("bottom") ? ["right-start", "left-start"] : e.startsWith("top") ? ["right-end", "left-end"] : e.startsWith("right") ? ["bottom-start", "top-start"] : ["bottom-end", "top-end"];
}
function Xg(e, t) {
	return Zg(t) ? e.height : e.width;
}
function Zg(e) {
	return e.startsWith("top") || e.startsWith("bottom");
}
function Qg(e, t, n) {
	return t.startsWith("top") ? e.top - n.top : t.startsWith("bottom") ? n.bottom - e.bottom : t.startsWith("left") ? e.left - n.left : n.right - e.right;
}
function $g(e) {
	return e.startsWith("top") ? `bottom${e_(e)}` : e.startsWith("bottom") ? `top${e_(e)}` : e.startsWith("left") ? `right${e_(e)}` : `left${e_(e)}`;
}
function e_(e) {
	let t = e.indexOf("-");
	return t === -1 ? "" : e.slice(t);
}
var t_ = {
	start: 0,
	end: 0
};
function n_(e, t) {
	let n = getComputedStyle(e);
	return Zg(t) ? {
		start: r_(n.paddingLeft) + r_(n.borderLeftWidth),
		end: r_(n.paddingRight) + r_(n.borderRightWidth)
	} : {
		start: r_(n.paddingTop) + r_(n.borderTopWidth),
		end: r_(n.paddingBottom) + r_(n.borderBottomWidth)
	};
}
function r_(e) {
	let t = Number.parseFloat(e ?? "");
	return Number.isFinite(t) ? t : 0;
}
function i_(e, t, n, r, i, a) {
	return r.startsWith("top") ? e.top - i - n.height : r.startsWith("bottom") ? e.bottom + i : o_(t.top, t.height, n.height, r, a);
}
function a_(e, t, n, r, i, a) {
	return r.startsWith("left") ? e.left - i - n.width : r.startsWith("right") ? e.right + i : o_(t.left, t.width, n.width, r, a);
}
function o_(e, t, n, r, i) {
	let a = e_(r);
	return a === "-start" ? e - i.start : a === "-end" ? e + t - n + i.end : e + (t - n) / 2;
}
function s_() {
	let e = window.visualViewport, t = e == null || Math.abs(e.scale - 1) > .01, n = t ? 0 : Math.max(0, e.offsetTop), r = t ? window.innerHeight : Math.min(window.innerHeight, e.offsetTop + e.height);
	return {
		top: n,
		bottom: Math.min(r, c_(r))
	};
}
function c_(e) {
	let t = document.querySelector(`[${jn}]`);
	if (t === null) return e;
	let n = t.getBoundingClientRect();
	return n.height > 0 && n.width >= window.innerWidth - 1 && n.top > 0 ? n.top : e;
}
function l_(e, t, n) {
	if (Dg(e)) return;
	let r = e.getBoundingClientRect(), i = s_();
	e.style.left = `${u_(t, r.width, 0, window.innerWidth)}px`, e.style.top = `${u_(n, r.height, i.top, i.bottom)}px`;
}
function u_(e, t, n, r) {
	return e + t <= r - pg ? e : e - t >= n + pg ? e - t : n + d_(e - n, t, r - n);
}
function d_(e, t, n) {
	return Math.max(pg, Math.min(e, n - t - pg));
}
//#endregion
//#region src/interactions/press-wave.ts
var f_ = "ui-press-wave", p_ = "ui-press-wave__ink";
function m_(e) {
	if (e.type !== "childList" || e.addedNodes.length + e.removedNodes.length === 0) return !1;
	for (let t of e.addedNodes) if (!h_(t)) return !1;
	for (let t of e.removedNodes) if (!h_(t)) return !1;
	return !0;
}
function h_(e) {
	return e instanceof Element && e.classList.contains("ui-press-wave");
}
function g_(e) {
	return e.length > 0 && e.every(m_);
}
function __(e) {
	for (let t of e.querySelectorAll(`.${f_}`)) t.remove();
}
//#endregion
//#region src/interactions/dom-mutations.ts
var v_ = 32;
function V(e, t, n, r) {
	if (!(e instanceof Node)) return null;
	let i = new MutationObserver((i) => {
		let a = y_(e, i.filter((e) => !m_(e) && (n.relevant?.(e) ?? !0)), t, n.addedOnly ?? !1);
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
function y_(e, t, n, r = !1) {
	let i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set();
	for (let o of t) {
		let t = o.target instanceof Element ? o.target : o.target.parentElement;
		if (t === null) continue;
		if (r && o.type === "childList" && t.closest(n) === null) {
			b_(o.addedNodes, n, i);
			continue;
		}
		if (a.has(t)) continue;
		a.add(t);
		let s = t.closest(n);
		if (s !== null) i.add(s);
		else {
			for (let e of t.querySelectorAll(n)) i.add(e);
			if (i.size > v_) return new Set(e.querySelectorAll(n));
		}
	}
	return i.size === 0 ? null : i;
}
function b_(e, t, n) {
	for (let r of e) if (r instanceof Element && r.isConnected) {
		r instanceof HTMLElement && r.matches(t) && n.add(r);
		for (let e of r.querySelectorAll(t)) n.add(e);
	}
}
function x_(e, t, n) {
	return (e.target instanceof Element ? e.target : e.target.parentElement)?.closest(`${t}, ${n}`)?.matches(t) === !0;
}
//#endregion
//#region src/interactions/element-visibility.ts
var S_ = [
	"hidden",
	"class",
	fn,
	...wi
];
function C_(e, t, n) {
	for (let r = t; r !== null; r = r.parentElement) e.observe(r, {
		attributes: !0,
		attributeFilter: n
	});
}
function w_(e, t) {
	let n = /* @__PURE__ */ new Set();
	for (let r of e) if (r.type === "childList") for (let e of r.addedNodes) for (let r of t) e.contains(r) && n.add(r);
	return n;
}
function T_(e, t) {
	let n = getComputedStyle(e), r = t ? n.overflowY : n.overflowX;
	return r === "auto" || r === "scroll";
}
function E_(e) {
	return getComputedStyle(e).display !== "none";
}
function D_(e) {
	for (let t = e; t !== null; t = t.parentElement) {
		if (t.checkVisibility()) return !0;
		if (getComputedStyle(t).display !== "contents") return !1;
	}
	return !1;
}
function O_(e) {
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
				if (e.overflowX !== "visible" && j_(n, i, i + t.clientWidth, !0), e.overflowY !== "visible" && j_(n, a, a + t.clientHeight, !1), M_(n)) return !0;
			}
			r = e.position;
		}
	}
	return j_(n, 0, window.innerWidth, !0), j_(n, 0, window.innerHeight, !1), M_(n);
}
function k_(e) {
	let t = getComputedStyle(e).position;
	for (let n = e.parentElement; n !== null && t !== "fixed"; n = n.parentElement) {
		let e = getComputedStyle(n);
		if (t !== "absolute" || e.position !== "static" || e.transform !== "none") {
			if ((!n.classList.contains("ui-scroll-y--disabled") || T_(n, !1)) && (A_(e.overflowX) || A_(e.overflowY))) return n;
			t = e.position;
		}
	}
	return null;
}
function A_(e) {
	return e === "hidden" || e === "auto" || e === "scroll";
}
function j_(e, t, n, r) {
	r ? (e.left = Math.max(e.left, t), e.right = Math.min(e.right, n)) : (e.top = Math.max(e.top, t), e.bottom = Math.min(e.bottom, n));
}
function M_(e) {
	return e.left > e.right || e.top > e.bottom;
}
//#endregion
//#region src/interactions/open-dialogs.ts
var N_ = "data-ui-dialog", P_ = "data-ui-dialog-modal", F_ = "data-ui-dialog-backdrop", I_ = "data-ui-dialog-close-backdrop", L_ = "data-ui-dialog-close-escape", R_ = `[${N_}]:not([hidden]), dialog[open]`, z_ = "dialog:modal";
function B_(e) {
	let t = e.querySelectorAll(`[${N_}]:not([hidden])`);
	return t.length === 0 ? null : t[t.length - 1];
}
function V_(e) {
	let t = e.querySelectorAll(z_);
	if (t.length > 0) return t[t.length - 1];
	let n = B_(e);
	return n !== null && n.hasAttribute("data-ui-dialog-modal") ? n : null;
}
function H_(e) {
	let t = typeof document > "u" ? null : V_(document);
	return t !== null && !t.contains(e);
}
//#endregion
//#region src/interactions/popup-dismissal.ts
var U_ = /* @__PURE__ */ new Set(), W_ = null;
function G_(e) {
	W_ = e;
}
function K_(e) {
	let t = e.composedPath(), n = W_?.(t) ?? null;
	if (n === null) return t;
	let r = [...t];
	for (let e = n; e !== null; e = e.parentElement) r.push(e);
	return r;
}
var q_ = /* @__PURE__ */ new Map(), J_ = 0, Y_ = !1;
function X_() {
	Y_ || (Y_ = !0, document.addEventListener("keydown", (e) => {
		!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || j(e) || tv(Zu(e.target)) && e.preventDefault();
	}, !0));
}
var Z_ = [];
function Q_(e) {
	Z_.push(e);
}
function $_(e = null) {
	for (let e of U_) for (let t of e.openPopups()) if (t.isConnected && !e.isBehind(t)) return !0;
	return Z_.some((t) => t(e));
}
function ev(e) {
	for (let t of U_) t.hearRefusedClick(e);
}
function tv(e) {
	let t = [];
	for (let e of U_) for (let n of e.openPopups()) n.isConnected && t.push({
		instance: e,
		popup: n
	});
	let n = new Set(t.map((e) => e.popup));
	for (let e of [...q_.keys()]) n.has(e) || q_.delete(e);
	for (let { popup: e } of t) q_.has(e) || q_.set(e, ++J_);
	let r = nv(t, (e) => q_.get(e.popup) ?? 0, (e, t) => e.popup.contains(t.popup));
	for (let { instance: t, popup: n } of r) if ((e === null || e.contains(n)) && t.dismiss(n, "escape")) return !0;
	return !1;
}
function nv(e, t, n) {
	let r = [...e].sort((e, n) => t(n) - t(e)), i = [];
	for (; r.length > 0;) {
		let e = r.findIndex((e) => !r.some((t) => t !== e && n(e, t)));
		i.push(...r.splice(e, 1));
	}
	return i;
}
var rv = class {
	options;
	pressedInside = /* @__PURE__ */ new Set();
	constructor(e) {
		this.options = e, document.addEventListener("pointerdown", (e) => this.handlePress(e), !0), document.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), e.onPress !== !0 && document.addEventListener("click", (e) => this.handleClick(e), !0), e.onWindowBlur === !0 && window.addEventListener("blur", () => this.dismissAll("blur")), U_.add(this), X_();
	}
	openPopups() {
		return [...this.options.openPopups()];
	}
	handlePress(e) {
		let t = K_(e), n = this.options.onPress === !0 || e instanceof MouseEvent && e.button !== 0;
		this.pressedInside.clear();
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) ? this.pressedInside.add(e) : n && this.dismiss(e, "outside");
	}
	handleContextMenu(e) {
		let t = K_(e);
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) || this.dismiss(e, "outside");
	}
	hearRefusedClick(e) {
		this.options.onPress !== !0 && this.handleClick(e);
	}
	handleClick(e) {
		let t = K_(e);
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) || this.pressedInside.has(e) || this.dismiss(e, "outside");
		this.pressedInside.clear();
	}
	dismissAll(e) {
		let t = !1;
		for (let n of [...this.options.openPopups()]) t = this.dismiss(n, e) || t;
		return t;
	}
	isBehind(e) {
		return this.options.isBehind === void 0 ? H_(e) : this.options.isBehind(e);
	}
	dismiss(e, t) {
		return this.isBehind(e) || this.options.canDismiss?.(e, t) === !1 ? !1 : (this.options.close(e, t), !0);
	}
	isInside(e, t) {
		return this.options.isInside === void 0 ? t.includes(e) : this.options.isInside(e, t);
	}
}, iv = /\p{M}/gu, av = ".ui-text__title";
function ov(e, t) {
	return sv(e, t).split(/\s+/).filter((e) => e.length !== 0);
}
function sv(e, t) {
	return uv(e, lv(t));
}
function cv(e, t) {
	return t.every((t) => e.includes(t));
}
function lv(e) {
	return e.closest("[lang]")?.getAttribute("lang") || void 0;
}
function uv(e, t) {
	let n = e.normalize("NFD").replace(iv, "");
	try {
		return n.toLocaleLowerCase(t);
	} catch {
		return n.toLowerCase();
	}
}
function dv(e) {
	return e.querySelector(av)?.textContent ?? e.textContent ?? "";
}
//#endregion
//#region src/interactions/pointer-drag.ts
var fv = class {
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
		t.setAttribute(ni, ""), t.tabIndex >= 0 && t.focus({ preventScroll: !0 });
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
			e.pointerId === t.pointerId ? t.point = n : t.second.point = n, this.options.pinch?.(t.context, pv(r, i, t.point, t.second.point));
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
		this.drag = null, n.removeAttribute(ni), e.type === "pointercancel" && this.options.takenBack !== void 0 ? this.options.takenBack(n, r) : this.options.end(n, r);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || j(e) || this.drag === null) return;
		e.preventDefault();
		let { handle: t, context: n, pointerId: r, originPoint: i, second: a } = this.drag;
		this.drag = null, t.removeAttribute(ni);
		for (let e of a === null ? [r] : [r, a.pointerId]) try {
			t.releasePointerCapture(e);
		} catch {}
		this.options.cancel === void 0 ? (this.options.move(n, 0, i), this.options.end(t, n)) : this.options.cancel(t, n);
	}
};
function pv(e, t, n, r) {
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
function mv() {
	let e = (e) => {
		e.preventDefault(), e.stopImmediatePropagation(), t();
	}, t = () => {
		window.removeEventListener("click", e, !0), window.removeEventListener("pointerdown", t, !0), window.removeEventListener("keydown", t, !0);
	};
	window.addEventListener("click", e, !0), window.addEventListener("pointerdown", t, !0), window.addEventListener("keydown", t, !0);
}
function hv(e, t) {
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
		mv();
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
var gv = "data-ui-sheet-dragging", _v = "--ui-sheet-drag", vv = 24, yv = 1 / 3;
function bv(e, t, n) {
	return e > t * yv || n > .5 && e > 6;
}
function xv(e, t, n) {
	e.style.removeProperty(_v), e.removeAttribute(gv);
	let r = hv(e, {
		axis: "y",
		oneWay: !0,
		holdsTouch: !0,
		begins: (n) => t.scrollTop <= 0 && (n.pointerType === "touch" || n.clientY - e.getBoundingClientRect().top <= vv),
		start: (t) => {
			e.setAttribute(gv, ""), Sv(e, t.pointerId);
		},
		follow: (t) => e.style.setProperty(_v, `${t}px`),
		end: (t, r, i) => {
			e.removeAttribute(gv), i && bv(t, e.getBoundingClientRect().height, r) ? n() : e.style.setProperty(_v, "0px");
		}
	});
	return () => {
		r(), e.removeAttribute(gv);
	};
}
function Sv(e, t) {
	try {
		e.setPointerCapture(t);
	} catch {}
}
//#endregion
//#region src/interactions/popup-sheet.ts
var Cv = "data-ui-sheet-covered", wv = "ui-sheet-scrim", Tv = "data-ui-sheet-scrim-leaving", Ev = 400, Dv = "ui-sheet__back", Ov = "ui.sheet.back", kv = "ne-arrow-back", Av = [], jv = null, Mv = !1, Nv = !1;
function Pv(e, t) {
	if (Fv(e) !== null) return;
	let n = t.anchor?.closest("[data-ui-sheet]") ?? null, r = n === null ? null : Fv(n);
	e.style.removeProperty("top"), e.style.removeProperty("left"), e.style.removeProperty("min-width");
	let i = Dg(e);
	e.setAttribute(Tg, r === null ? "root" : "nested"), i || (e.setAttribute("popover", "manual"), Zh(e)), e.querySelector(`:scope > .${Dv}`)?.remove(), r !== null && (e.style.minHeight = `${r.popup.getBoundingClientRect().height}px`, r.popup.setAttribute(Cv, ""), e.prepend(Iv(t))), Rv(), Og(e);
	let a = {
		popup: e,
		parent: r,
		opening: t,
		hidden: [],
		detachSwipe: xv(e, e, () => zv(e))
	};
	Av.push(a), Bv(), queueMicrotask(() => Hv(a));
}
function Fv(e) {
	return Av.find((t) => t.popup === e) ?? null;
}
function Iv(e) {
	let t = document.createElement("button"), n = e.anchor === void 0 ? "" : dv(e.anchor).trim();
	return t.type = "button", t.className = Dv, t.tabIndex = -1, t.textContent = n, t.prepend(Lv()), D.write(t, "aria-label", Ov, { entry: n }), t.addEventListener("click", (t) => {
		t.stopPropagation(), e.close();
	}), t;
}
function Lv() {
	let e = document.createElement("span");
	return e.className = "ui-sheet__back-mark", e.setAttribute("aria-hidden", "true"), Fo(e, kv), e;
}
function Rv() {
	jv === null && (jv = document.createElement("div"), jv.className = wv, jv.setAttribute("aria-hidden", "true"), jv.addEventListener("mousedown", (e) => e.preventDefault())), jv.parentElement === null && document.body.appendChild(jv), jv.removeAttribute(Tv), Og(jv);
}
function zv(e) {
	for (let t = Fv(e); t !== null; t = t.parent) t.opening.close();
}
function Bv() {
	Mv || (Mv = !0, window.addEventListener("pointerdown", () => {
		Nv = !0;
	}, !0), window.addEventListener("pointerup", Vv, !0), window.addEventListener("pointercancel", Vv, !0), window.addEventListener("keydown", (e) => {
		let t = Av.at(-1);
		e.key === "Tab" && !e.defaultPrevented && t !== void 0 && t.opening.trapsTab && e.target instanceof Node && t.popup.contains(e.target) && $p(t.popup, e);
	}, !0));
}
function Vv() {
	if (Nv = !1, jv?.hasAttribute(Tv) !== !0) return;
	let e = () => {
		jv?.hasAttribute(Tv) === !0 && Av.length === 0 && (jv.removeAttribute(Tv), jv.hidePopover());
	};
	window.addEventListener("click", () => window.setTimeout(e), { once: !0 }), window.setTimeout(e, Ev);
}
function Hv(e) {
	if (!Av.includes(e)) return;
	let { popup: t } = e;
	t.contains(document.activeElement) || (t.hasAttribute("tabindex") || (t.tabIndex = -1), R(t)), e.hidden = Uv(t);
}
function Uv(e) {
	let t = [];
	for (let n = e; n.parentElement !== null && n !== document.body; n = n.parentElement) for (let e of n.parentElement.children) e !== n && e !== jv && e instanceof HTMLElement && e.getAttribute("aria-hidden") !== "true" && (e.setAttribute("aria-hidden", "true"), t.push(e));
	return t;
}
function Wv(e) {
	let t = Fv(e);
	if (t !== null) {
		for (let e of [...Av].reverse()) if (e === t || Gv(e, t)) {
			for (let t of e.hidden) t.removeAttribute("aria-hidden");
			e.hidden = [];
		}
	}
}
function Gv(e, t) {
	for (let n = e.parent; n !== null; n = n.parent) if (n === t) return !0;
	return !1;
}
function Kv(e) {
	let t = Fv(e);
	if (t !== null) {
		for (let e of Av.filter((e) => e.parent === t)) e.opening.close(), Kv(e.popup);
		Wv(e), Av.splice(Av.indexOf(t), 1), t.detachSwipe(), t.parent?.popup.removeAttribute(Cv), Av.length === 0 && Jv(), Pg(e, () => {
			Fv(e) === null && qv(e);
		});
	}
}
function qv(e) {
	e.removeAttribute(Tg), e.removeAttribute(Cv), e.style.removeProperty("min-height"), e.style.removeProperty("--ui-sheet-drag"), e.querySelector(`:scope > .${Dv}`)?.remove();
}
function Jv() {
	jv?.matches(":popover-open") === !0 && (Nv ? jv.setAttribute(Tv, "") : jv.hidePopover());
}
//#endregion
//#region src/interactions/owned-popup.ts
function Yv(e, t) {
	let { owner: n } = e;
	return n.isConnected && (n === e.popup || D_(n)) && !O(n) && !(t && A(n));
}
var Xv = null;
function Zv(e) {
	Xv = e;
}
var Qv = class {
	options;
	entries = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, new rv({
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
			isBehind: (e) => H_(this.entryOf(e)?.opening.owner ?? e),
			onPress: e.onPress,
			onWindowBlur: e.onWindowBlur
		}), (e.closesOnFocusLeave ?? !0) && document.addEventListener("focusout", (e) => this.handleFocusLeave(e), !0), e.closesOnTab !== void 0 && e.closesOnTab !== !1 && ey(this);
	}
	listsAround(e) {
		return [...this.entries.values()].filter(({ opening: t }) => t.popup.contains(e) && sy(this.options.closesOnTab, t)).map(({ opening: e }) => ({
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
		if (!(e.target instanceof Node) || Bp() || t instanceof Element && t.hasAttribute("data-ui-pointer-focus")) return;
		if (t instanceof Element) {
			this.leaveFocus(e.target, t);
			return;
		}
		let n = e.target;
		ny(n) && queueMicrotask(() => this.letGo(n));
	}
	leaveFocus(e, t) {
		for (let { opening: n } of [...this.entries.values()]) (n.popup.contains(e) || n.owner.contains(e)) && !this.isInside(n, oy(t)) && !H_(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
	}
	letGo(e) {
		if (!ny(e)) return;
		let t = rm(e);
		for (let { opening: n } of [...this.entries.values()]) {
			let r = n.popup.contains(e) || n.owner.contains(e), i = t !== null && n.popup.contains(t) || n.popup.contains(document.activeElement);
			r && !i && Yv(n, this.closesWhenReadOnly) && !H_(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
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
		if (this.close(e.owner), !Yv(e, this.closesWhenReadOnly)) return !1;
		(this.options.single ?? !0) && this.closeAll();
		let t = document.activeElement instanceof HTMLElement ? document.activeElement : null, n = Eg(), r = {
			opening: e,
			returnFocus: t,
			phone: n,
			sheet: n && sy(this.options.sheetOnPhone, e)
		};
		return this.entries.set(e.owner, r), this.options.show(e), this.place(r), cy(e, !0), Sy(this, e.owner), py(e), e.focus !== void 0 && e.focus !== !1 && am(e.popup, e.focus === !0 ? null : e.focus), !0;
	}
	get closesWhenReadOnly() {
		return this.options.closesWhenReadOnly ?? !0;
	}
	closeAll() {
		for (let e of [...this.entries.keys()]) this.close(e);
	}
	place(e) {
		let { opening: t } = e;
		e.sheet ? Pv(t.popup, {
			anchor: t.anchor,
			close: () => this.close(t.owner, "escape"),
			trapsTab: !sy(this.options.closesOnTab, t)
		}) : (Dg(t.popup) && qv(t.popup), t.anchor !== void 0 && t.placement !== void 0 && Cg(t.anchor, t.popup, t.placement));
	}
	reposition(e) {
		let t = this.entries.get(e);
		t !== void 0 && this.place(t);
	}
	close(e = this.current, t) {
		let n = e === null ? void 0 : this.entries.get(e);
		if (e === null || n === void 0) return;
		let { opening: r } = n;
		this.entries.delete(e), my(r.popup), Wv(r.popup), r.popup.contains(document.activeElement) && mm(r.returnFocus === void 0 ? n.returnFocus : r.returnFocus(), r.popup), this.options.hide(r, t), cy(r, !1), n.sheet ? Kv(r.popup) : Ig(r.popup), this.entries.size === 0 && Ey(this);
	}
	closeStranded(e) {
		for (let [t, { opening: n }] of [...this.entries]) {
			if (e !== void 0 && !e.has(t) ? t.isConnected : Yv(n, this.closesWhenReadOnly)) continue;
			let r = document.activeElement, i = r === null || r === document.body || n.popup.contains(r) || t.contains(r);
			this.close(t, "owner"), i && !ry() && iy(t);
		}
	}
	closeReformed() {
		let e = Eg();
		for (let [t, n] of [...this.entries]) n.phone !== e && (n.opening.anchor === void 0 || sy(this.options.sheetOnPhone, n.opening)) && this.close(t, "owner");
	}
	closeOutOfSight(e) {
		for (let [t, { opening: n, sheet: r }] of [...this.entries]) {
			let i = n.anchor === void 0 ? t : Ug(n.anchor);
			!r && e.some((e) => !(e instanceof Node) || !n.popup.contains(e) && (e.contains(i) || e.contains(t))) && (ay(i) || i === n.anchor && ay(t)) && !H_(t) && this.close(t, "owner");
		}
	}
}, $v = /* @__PURE__ */ new Set();
function ey(e) {
	$v.size === 0 && window.addEventListener("keydown", (e) => {
		e instanceof KeyboardEvent && e.key === "Tab" && !e.defaultPrevented && !j(e) && e.target instanceof Node && ty(e.target);
	}, !0), $v.add(e);
}
function ty(e) {
	let t = [...$v].flatMap((t) => t.listsAround(e).map((e) => ({
		popups: t,
		...e
	})));
	for (let { popups: e, owner: n } of nv(t, () => 0, (e, t) => e.popup.contains(t.popup))) e.close(n, "focus");
}
function ny(e) {
	return e instanceof Element && e.isConnected && Ol(e) && typeof document.hasFocus == "function" && document.hasFocus();
}
function ry() {
	let e = document.activeElement;
	return e instanceof Element && e !== document.body && Ol(e);
}
function iy(e) {
	if (e.isConnected && D_(e)) {
		pm(e), R(e);
		return;
	}
	let t = um(e, Xv);
	t !== null && R(t);
}
function ay(e) {
	return e.getClientRects().length > 0 && O_(e);
}
function oy(e) {
	let t = [];
	for (let n = e; n !== null; n = n.parentNode) t.push(n);
	return t;
}
function sy(e, t) {
	return e === !0 || typeof e == "function" && e(t);
}
function cy(e, t) {
	for (let n of e.openers ?? []) n.setAttribute("aria-expanded", t ? "true" : "false");
}
var ly = /* @__PURE__ */ new Map(), uy = /* @__PURE__ */ new Set(), dy = /* @__PURE__ */ new WeakSet(), fy = [];
function py(e) {
	let { popup: t } = e;
	ly.set(t, e.owner), !dy.has(t) && (dy.add(t), t.addEventListener("pointerenter", () => {
		ly.has(t) && (uy.add(t), hy());
	}), t.addEventListener("pointerleave", () => {
		uy.delete(t) && hy();
	}));
}
function my(e) {
	ly.delete(e), uy.delete(e) && hy();
}
function hy() {
	let e = /* @__PURE__ */ new Set();
	for (let t of uy) {
		let n = ly.get(t);
		if (n !== void 0 && n.contains(t)) for (let r = t.parentElement; r !== null && (e.add(r), r !== n); r = r.parentElement);
	}
	for (let t of fy) e.has(t) || t.removeAttribute(di);
	for (let t of e) t.hasAttribute("data-ui-popup-hover") || t.setAttribute(di, "");
	fy = [...e];
}
var gy = /* @__PURE__ */ new Set(), _y = [
	"inert",
	"disabled",
	"aria-disabled",
	...S_
], vy = null, yy = !1, by = null;
function xy(e) {
	if (e === null) return null;
	for (let t of gy) {
		let n = t.holding(e);
		if (n !== null) return n;
	}
	return null;
}
function Sy(e, t) {
	gy.add(e), wy(), typeof MutationObserver == "function" && (vy === null && (vy = new MutationObserver((e) => Cy(e)), vy.observe(document, {
		subtree: !0,
		childList: !0
	})), C_(vy, t, _y));
}
function Cy(e) {
	let t = e.some((e) => e.type === "attributes"), n = w_(e, [...gy].flatMap((e) => [...e.owners()]));
	for (let e of [...gy]) e.closeStranded(t ? void 0 : n);
	for (let e of n) vy !== null && e.isConnected && C_(vy, e, _y);
}
function wy() {
	yy || (yy = !0, ig(() => {
		for (let e of [...gy]) e.closeReformed(), e.closeStranded();
	}), document.addEventListener("scroll", (e) => {
		gy.size !== 0 && (by === null ? (by = [e.target], Ty(() => {
			let e = by ?? [];
			by = null;
			for (let t of [...gy]) t.closeOutOfSight(e);
		})) : by.push(e.target));
	}, {
		capture: !0,
		passive: !0
	}));
}
function Ty(e) {
	typeof requestAnimationFrame == "function" ? requestAnimationFrame(e) : setTimeout(e, 0);
}
function Ey(e) {
	gy.delete(e), !(gy.size > 0 || vy === null) && (vy.disconnect(), vy = null);
}
//#endregion
//#region src/interactions/flyout-interaction-engine.ts
var Dy = "ui-flyout", Oy = "ui-flyout--open", ky = "ui-flyout__anchor", Ay = "data-ui-flyout-no-backdrop-close", jy = "data-ui-flyout-no-escape-close", My = `${Dy}--`, Ny = [...S_], Py = "bottom-start", Fy = class {
	root;
	waiting = /* @__PURE__ */ new Set();
	sightWatch = null;
	tiersWatched = !1;
	flyouts = new Qv({
		show: ({ owner: e }) => e.classList.add(Oy),
		hide: ({ owner: e }, t) => {
			t === "owner" && Iy(e) ? this.wait(e) : this.markClosed(e, t !== "owner" || !O(e));
		},
		single: !1,
		closesWhenReadOnly: !1,
		canDismiss: ({ owner: e }, t) => !e.hasAttribute(t === "escape" ? jy : Ay)
	});
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${Dy}`)) this.place(e);
		V(this.root, `.${Dy}`, { attributeFilter: ["class"] }, (e) => {
			for (let t of e) this.place(t);
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	place(e) {
		let t = e.querySelector(`:scope > .${Mi}`), n = e.querySelector(`:scope > .${ky}`);
		if (t === null) return;
		let r = Ly(n, t);
		e.classList.contains(Oy) ? this.flyouts.open({
			owner: e,
			popup: t,
			anchor: zy(n) ?? e,
			placement: { placement: By(e) },
			openers: r === null ? [] : [r],
			focus: !this.waiting.has(e) && (!Bp() || t)
		}) ? this.waiting.delete(e) : Iy(e) ? this.wait(e) : this.markClosed(e, !O(e)) : (this.waiting.delete(e), this.flyouts.close(e), r?.setAttribute("aria-expanded", "false"));
	}
	wait(e) {
		this.waiting.add(e), this.tiersWatched || (this.tiersWatched = !0, ig(() => this.placeWaiting())), typeof MutationObserver == "function" && (this.sightWatch === null && (this.sightWatch = new MutationObserver((e) => this.placeWaiting(e)), this.sightWatch.observe(document, {
			subtree: !0,
			childList: !0
		})), C_(this.sightWatch, e, Ny));
	}
	placeWaiting(e) {
		let t = e === void 0 || e.some((e) => e.type === "attributes") ? null : w_(e, [...this.waiting]);
		for (let e of [...this.waiting]) !e.isConnected || !e.classList.contains(Oy) ? this.waiting.delete(e) : (t?.has(e) === !0 && this.sightWatch !== null && C_(this.sightWatch, e, Ny), (t === null || t.has(e)) && D_(e) && this.place(e));
		this.waiting.size === 0 && (this.sightWatch?.disconnect(), this.sightWatch = null);
	}
	markClosed(e, t = !0) {
		e.classList.contains(Oy) && (e.classList.remove(Oy), Ry(e, !1, t));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${ky}`)?.closest(`.${Dy}`) ?? null;
		t !== null && (this.flyouts.isOpen(t) ? this.flyouts.close(t) : (t.classList.add(Oy), this.place(t), this.flyouts.isOpen(t) && Ry(t, !0)));
	}
};
function Iy(e) {
	return e.isConnected && !O(e) && !D_(e);
}
function Ly(e, t) {
	if (e === null) return null;
	let n = e.querySelector(Cp) ?? e;
	return n.setAttribute("aria-haspopup", "dialog"), n.setAttribute("aria-controls", aa(t, "ui-flyout-content")), n;
}
function Ry(e, t, n = !0) {
	e.dispatchEvent(new Event("toggle", { bubbles: !0 })), n && e.dispatchEvent(new Event(t ? "open" : "close", { bubbles: !0 }));
}
function zy(e) {
	if (e === null) return null;
	let t = e.firstElementChild;
	return t instanceof HTMLElement ? t : e;
}
function By(e) {
	for (let t of e.classList) {
		if (!t.startsWith(My)) continue;
		let e = t.slice(My.length);
		if (fg(e)) return e;
	}
	return Py;
}
//#endregion
//#region src/interactions/drag-picture.ts
var Vy = "ui-drag-picture", Hy = "data-ui-drag-part", Uy = ["::before", "::after"], Wy = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", Gy = /* @__PURE__ */ new Set(/* @__PURE__ */ "src.srcset.sizes.alt.width.height.type.viewbox.preserveaspectratio.href.xlink:href.d.points.cx.cy.r.rx.ry.x.y.x1.y1.x2.y2.fill.stroke.stroke-width.transform".split(".")), Ky = null, qy = null;
typeof Image == "function" && Yy();
function Jy(e, t, n) {
	let r = n.getBoundingClientRect(), i = e.clientX - r.left, a = e.clientY - r.top, o = Yy();
	qy?.(), o === null || typeof n.showPopover != "function" ? t.setDragImage(n, i, a) : (t.setDragImage(o, 0, 0), Xy(n, r, i, a), setTimeout(() => {
		e.defaultPrevented && qy?.();
	}, 0));
}
function Yy() {
	return Ky === null && typeof Image == "function" && (Ky = new Image(1, 1), Ky.src = Wy), Ky;
}
function Xy(e, t, n, r) {
	let i = document.createElement("div"), a = e.cloneNode(!0), o = [];
	i.className = Vy, i.setAttribute("popover", "manual"), i.setAttribute("aria-hidden", "true"), i.inert = !0, i.style.width = `${t.width}px`, i.style.height = `${t.height}px`, Qy(e, a, o);
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
	let s = (e) => Zy(i, e.clientX - n, e.clientY - r), c = (e) => {
		e.relatedTarget === null && (i.style.visibility = "hidden");
	}, l = () => {
		i.style.visibility = "";
	}, u = () => {
		document.removeEventListener("dragover", s, !0), document.removeEventListener("dragleave", c, !0), document.removeEventListener("dragenter", l, !0), document.removeEventListener("drop", u, !0), document.removeEventListener("dragend", u, !0), e.removeEventListener("dragend", u), i.remove(), qy === u && (qy = null);
	};
	document.addEventListener("dragover", s, !0), document.addEventListener("dragleave", c, !0), document.addEventListener("dragenter", l, !0), document.addEventListener("drop", u, !0), document.addEventListener("dragend", u, !0), e.addEventListener("dragend", u), qy = u, Zy(i, t.left, t.top), document.body.append(i), i.showPopover();
}
function Zy(e, t, n) {
	e.style.transform = `translate(${t}px, ${n}px)`;
}
function Qy(e, t, n) {
	let r = t.style;
	r !== void 0 && (nb(getComputedStyle(e), (e, t) => r.setProperty(e, t)), $y(e, r, "columns"), $y(e, r, "rows"));
	for (let e of t.getAttributeNames()) e !== "style" && !Gy.has(e.toLowerCase()) && t.removeAttribute(e);
	tb(e, t, n), e instanceof HTMLInputElement && t instanceof HTMLInputElement && (t.value = e.value, t.checked = e.checked);
	for (let r = e.children.length - 1; r >= 0; r--) {
		let i = e.children[r], a = t.children[r];
		i.classList.contains("ui-press-wave") ? a.remove() : Qy(i, a, n);
	}
}
function $y(e, t, n) {
	t.getPropertyValue(`grid-template-${n}`).startsWith("subgrid") && t.setProperty(`grid-template-${n}`, eb(e, n).join(" "));
}
function eb(e, t) {
	let n = getComputedStyle(e), r = n.getPropertyValue(`grid-template-${t}`);
	if (!r.startsWith("subgrid")) return r.split(/\s+/).filter((e) => /^-?[\d.]+px$/.test(e));
	if (e.parentElement === null) return [];
	let i = eb(e.parentElement, t), a = t === "columns" ? "column" : "row", o = Number.parseInt(n.getPropertyValue(`grid-${a}-start`), 10), s = Number.parseInt(n.getPropertyValue(`grid-${a}-end`), 10), c = Number.isNaN(o) ? 0 : o > 0 ? o - 1 : i.length + o + 1, l = Number.isNaN(s) ? i.length : s > 0 ? s - 1 : i.length + s + 1;
	return i.slice(c, l);
}
function tb(e, t, n) {
	for (let r of Uy) {
		let i = getComputedStyle(e, r);
		if (i.content === void 0 || i.content === "none" || i.content === "normal") continue;
		t.hasAttribute(Hy) || t.setAttribute(Hy, String(n.length));
		let a = [];
		nb(i, (e, t) => a.push(`${e}: ${t};`)), n.push(`.${Vy} [${Hy}="${t.getAttribute(Hy)}"]${r} { ${a.join(" ")} }`);
	}
}
function nb(e, t) {
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		r.startsWith("--") || t(r, e.getPropertyValue(r));
	}
}
//#endregion
//#region src/interactions/drag-marks.ts
var rb = `:scope > :is(${dd}, .ui-image-input__surface)`;
function ib(e, t, n, r, i, a = [], o = "move") {
	ab(t, r), ob(e, i, o), n.classList.add(r);
	for (let e of a) e.classList.add(r);
}
function ab(e, t) {
	for (let n of e.querySelectorAll(`.${t}`)) n.classList.remove(t);
}
function ob(e, t, n) {
	e instanceof DragEvent && e.dataTransfer !== null && (e.dataTransfer.effectAllowed = n, e.dataTransfer.setData("text/plain", t), e.target instanceof HTMLElement && Jy(e, e.dataTransfer, e.target));
}
function sb(e, t) {
	return !(e.relatedTarget instanceof Node && t.contains(e.relatedTarget));
}
function cb(e, t) {
	let n = t && e.querySelector(rb) !== null;
	e.hasAttribute("data-ui-drop-boxed") !== n && e.toggleAttribute(_e, n);
}
//#endregion
//#region src/interactions/file-drop.ts
var lb = "data-ui-file-drop-over", ub = 120, db = "refused", fb = !1;
function pb(e) {
	let t = {
		marked: /* @__PURE__ */ new Map(),
		leaving: 0
	};
	_b();
	for (let n of [
		"dragenter",
		"dragover",
		"dragleave",
		"drop"
	]) e.root.addEventListener(n, (n) => mb(e, t, n), !0);
	e.root.addEventListener("dragend", () => Cb(t.marked), !0), window.addEventListener("blur", () => Cb(t.marked)), e.root.addEventListener("paste", (t) => hb(e, t), !0);
}
function mb(e, t, n) {
	if (!(n instanceof DragEvent) || !(n.target instanceof Element)) return;
	let r = t.marked;
	n.type !== "dragleave" && t.leaving !== 0 && (window.clearTimeout(t.leaving), t.leaving = 0);
	let i = e.resolveTarget(n.target);
	if (i === null || !(n.dataTransfer?.types.includes("Files") ?? !1)) {
		i === null && n.type === "dragover" && Cb(r);
		return;
	}
	let a = i.mark ?? i.host;
	if (i.refused === !0) {
		vb(n), n.type !== "dragleave" && Cb(r);
		return;
	}
	if (n.type === "dragleave") {
		n.relatedTarget instanceof Node ? a.contains(n.relatedTarget) || Sb(r, a) : t.leaving = window.setTimeout(() => Cb(r), ub);
		return;
	}
	if (n.preventDefault(), n.type !== "drop") {
		let t = yb(i.accept, n.dataTransfer);
		n.dataTransfer !== null && (n.dataTransfer.dropEffect = t ? "none" : "copy");
		for (let e of r.keys()) e !== a && Sb(r, e);
		let o = i.mark === void 0 ? e.draggingAttribute : lb;
		r.set(a, o), a.setAttribute(o, t ? db : ""), cb(a, o === lb);
		return;
	}
	Cb(r);
	let o = [...n.dataTransfer?.files ?? []].filter((e) => wb(i.accept, e));
	o.length !== 0 && e.onFiles(i.host, i.multiple ? o : [o[0]]);
}
function hb(e, t) {
	if (!(t instanceof ClipboardEvent) || !(t.target instanceof Element)) return;
	let n = t.clipboardData;
	if (n === null || n.files.length === 0 || n.getData("text/plain").trim().length > 0) return;
	let r = e.resolveTarget(t.target);
	if (r === null || r.refused === !0) return;
	let i = [...n.files].filter((e) => wb(r.accept, e));
	i.length !== 0 && (t.preventDefault(), e.onFiles(r.host, r.multiple ? i : [i[0]]));
}
function gb(e, t, n) {
	for (let r = t.closest(`[${ie}]`); r !== null; r = r.parentElement?.closest("[data-ui-id]") ?? null) {
		let t = r.getAttribute("data-ui-id") ?? "", i = [...e.querySelectorAll(`${n}[${Gr}="${S(t)}"]`)];
		if (i.length > 0) return {
			field: i.find((e) => r.contains(e)) ?? i[0],
			component: r
		};
	}
	return null;
}
function _b() {
	if (!fb) {
		fb = !0;
		for (let e of ["dragover", "drop"]) window.addEventListener(e, (e) => {
			e instanceof DragEvent && !e.defaultPrevented && (e.dataTransfer?.types.includes("Files") ?? !1) && vb(e);
		});
	}
}
function vb(e) {
	e.type !== "dragleave" && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "none"));
}
function yb(e, t) {
	let n = bb(e);
	if (t === null || n.length === 0 || n.some((e) => e.startsWith("."))) return !1;
	let r = [...t.items].filter((e) => e.kind === "file").map((e) => e.type.toLowerCase());
	return r.length !== 0 && !r.some((e) => n.some((t) => xb(t, e)));
}
function bb(e) {
	return e.split(",").map((e) => e.trim().toLowerCase()).filter((e) => e.length > 0);
}
function xb(e, t) {
	return e.endsWith("/*") ? t.startsWith(e.slice(0, -1)) : t === e;
}
function Sb(e, t) {
	let n = e.get(t);
	e.delete(t), n !== void 0 && t.removeAttribute(n), cb(t, !1);
}
function Cb(e) {
	for (let t of [...e.keys()]) Sb(e, t);
}
function wb(e, t) {
	let n = bb(e);
	if (n.length === 0) return !0;
	let r = t.name.toLowerCase(), i = t.type.toLowerCase();
	return n.some((e) => e.startsWith(".") ? r.endsWith(e) : xb(e, i));
}
//#endregion
//#region src/interactions/file-upload.ts
var Tb = "/_ne/files/upload", Eb = "/_ne/files/selection/", Db = "/_ne/files/upload/", Ob = /* @__PURE__ */ new Map(), kb = !1;
function Ab(e, t, n, r) {
	let i = Number(e.getAttribute(Ur)), a = [], o = [];
	for (let e of t) !Number.isFinite(i) || i <= 0 || e.size <= i ? a.push(e) : o.push(e);
	return o.length === 0 ? (Ob.delete(e) && r?.mark(e, null), a) : r === void 0 ? (s("a chosen file exceeds the input's size limit and was refused.", {
		names: o.map((e) => e.name),
		limit: i
	}), a) : (Mb(e, {
		validation: r,
		size: jb(i, n ? o.map((e) => e.name).join(", ") : null),
		failed: []
	}), a);
}
function jb(e, t) {
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
function Mb(e, t) {
	for (let e of Ob.keys()) e.isConnected || Ob.delete(e);
	Ob.set(e, t), Nb(e, t), Fb();
}
function Nb(e, t) {
	t.validation.mark(e, "error", Pb(t));
}
function Pb(e) {
	let t = e.size, n = e.failed.length === 0 ? null : {
		key: "ui.file.notuploaded",
		args: { names: e.failed.join(", ") }
	};
	return t === null || n === null ? t ?? n ?? { text: "" } : { text: `${D.translate(t.key, t.args)}\n${D.translate(n.key, n.args)}` };
}
function Fb() {
	kb || (kb = !0, D.onChange(() => {
		for (let [e, t] of Ob) e.isConnected ? Nb(e, t) : Ob.delete(e);
	}));
}
function Ib(e, t, n) {
	if (n === void 0) return;
	let r = Ob.get(e);
	Mb(e, {
		validation: n,
		size: r?.size ?? null,
		failed: [...r?.failed ?? [], t]
	});
}
async function Lb(e, t) {
	let n = [...e];
	return await Dm.settled(), await Rb(n, t);
}
function Rb(e, t) {
	return new Promise((n, r) => {
		let i = new FormData(), a = performance.now(), o = 0, s = 0;
		for (let t of e) i.append("files", t, t.name), o += t.size, s++;
		let c = new XMLHttpRequest();
		c.open("POST", Tb), c.responseType = "json", c.withCredentials = !0, c.upload.addEventListener("progress", (e) => {
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
async function zb(e) {
	await Dm.settled();
	let t = await fetch(`${Eb}${encodeURIComponent(e)}`, {
		credentials: "same-origin",
		cache: "no-store"
	});
	if (!t.ok) throw Error(`Reading selection failed with status ${t.status}.`);
	let n = (await t.json())?.files ?? [];
	return n.length === 0 ? null : n;
}
function Bb(e) {
	return `${Db}${encodeURIComponent(e)}`;
}
var Vb = () => {};
function Hb(e, t) {
	return {
		uploadAsync: (e, n, r) => {
			let i = Lb(e, n ?? Vb);
			if (r !== void 0) {
				let e = t.hold(r, {}), n = () => void setTimeout(e, 0);
				i.then(n, n);
			}
			return i;
		},
		accepts: wb,
		takeWithinSizeLimit: (t, n, r) => Ab(t, n, r, e)
	};
}
function Ub(e, t) {
	e !== null && e.value !== t && (e.value = t, e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/picker-events.ts
var Wb = "ui-open-picker";
function Gb(e) {
	return !e.dispatchEvent(new Event(Wb, {
		bubbles: !0,
		cancelable: !0
	}));
}
function Kb(e, t) {
	if (!(e.target instanceof Element)) return;
	let n = e.target.closest(t.rootSelector);
	if (n === null) return;
	e.preventDefault();
	let r = n.querySelector(t.nativeSelector), i = t.pressed(n);
	r === null || r.disabled || i === null || A(n) || O(i) || r.click();
}
//#endregion
//#region src/interactions/uploads-in-flight.ts
var qb = class {
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
		for (let r of this.slots.keys()) r.isConnected ? Jb(r) === e && (t.add(r), n = !0) : this.slots.delete(r);
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
function Jb(e) {
	return (e.hasAttribute("data-ui-form-id") ? e : e.querySelector("[data-ui-form-id]"))?.getAttribute("data-ui-form-id") ?? null;
}
var Yb = new qb(), Xb = "ui-file-input", Zb = "ui-file-input__row", Qb = "ui-file-input__native", $b = "ui-file-input__field", ex = "ui-file-input__selection", tx = "data-ui-file-dragging", nx = class {
	root;
	validation;
	uploads;
	picks = /* @__PURE__ */ new WeakMap();
	shownWords = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation, this.uploads = e.uploads ?? Yb, D.onChange(() => this.rewriteShownWords()), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener(Wb, (e) => Kb(e, {
			rootSelector: `.${Xb}`,
			nativeSelector: `.${Qb}`,
			pressed: (e) => e
		})), this.root.addEventListener("change", (e) => void this.handleSelectionAsync(e), !0), pb({
			root: this.root,
			draggingAttribute: tx,
			resolveTarget: (e) => {
				let t = e.closest(`.${Zb}`)?.closest(`.${Xb}`) ?? null, n = t === null ? gb(this.root, e, `.${Xb}`) : null, r = t ?? n?.field ?? null, i = r?.querySelector(`.${Qb}`) ?? null;
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
		let t = e.target.closest(`[${Wr}], .${Zb}`);
		if (t === null || O(t) || A(t) || !t.hasAttribute("data-ui-file-pick") && e.target.closest("button, a") !== null) return;
		let n = t.closest(`.${Xb}`)?.querySelector(`.${Qb}`);
		n == null || n.disabled || n.click();
	}
	async handleSelectionAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Qb)) return;
		let t = e.target.closest(`.${Xb}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && await this.takeFilesAsync(t, n);
	}
	async takeFilesAsync(e, t) {
		let n = e.querySelector(`.${$b}`);
		if (n === null) return;
		if (t.length === 0) {
			this.show(n, ""), this.publishSelection(e, "");
			return;
		}
		let r = Ab(e, t, e.querySelector(`.${Qb}`)?.multiple === !0, this.validation);
		if (r.length === 0) return;
		let i = (this.picks.get(e) ?? 0) + 1;
		this.picks.set(e, i);
		let a = this.uploads.hold(e);
		try {
			let t = await Lb(r, (t) => {
				this.picks.get(e) === i && this.show(n, () => D.format("ui.file.uploading", { percent: t }));
			});
			if (this.picks.get(e) !== i) return;
			this.show(n, rx(r)), this.publishSelection(e, t.selectionId);
		} catch (t) {
			if (s("file upload failed.", t), this.picks.get(e) !== i) return;
			this.show(n, () => D.text("ui.file.failed")), this.publishSelection(e, "");
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
		Ub(e.querySelector(`.${ex}`), t);
	}
};
function rx(e) {
	return e.length === 1 ? e[0].name : () => D.format("ui.file.count", { count: e.length });
}
//#endregion
//#region src/rendering/file-glyphs.ts
var ix = "ne-picture-as-pdf", ax = "ne-text-snippet", ox = "ne-description", sx = "ne-table-chart", cx = "ne-slideshow", lx = "ne-folder-zip", ux = "ne-audio-file", dx = "ne-video-file", fx = "ne-image", px = "ne-code", mx = "ne-draft", hx = new Map([
	...yx(ix, "pdf"),
	...yx(ax, "txt", "md", "log"),
	...yx(ox, "doc", "docx", "odt", "rtf"),
	...yx(sx, "xls", "xlsx", "ods", "csv", "tsv"),
	...yx(cx, "ppt", "pptx", "odp", "key"),
	...yx(lx, "zip", "rar", "7z", "tar", "gz", "tgz", "bz2", "xz"),
	...yx(ux, "mp3", "wav", "ogg", "oga", "opus", "flac", "m4a", "aac"),
	...yx(dx, "mp4", "m4v", "mov", "avi", "mkv", "webm"),
	...yx(fx, "png", "jpg", "jpeg", "gif", "webp", "avif", "bmp", "svg", "ico", "tif", "tiff", "heic", "heif"),
	...yx(px, "json", "xml", "yml", "yaml", "html", "htm", "css", "less", "scss", "js", "mjs", "ts", "tsx", "jsx", "cs", "csproj", "sln", "java", "kt", "py", "rb", "php", "go", "rs", "c", "h", "cpp", "hpp", "swift", "sql", "sh", "ps1")
]), gx = /* @__PURE__ */ new Map([
	["application/pdf", ix],
	["text/csv", sx],
	["application/msword", ox],
	["application/rtf", ox],
	["application/vnd.openxmlformats-officedocument.wordprocessingml.document", ox],
	["application/vnd.oasis.opendocument.text", ox],
	["application/vnd.ms-excel", sx],
	["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", sx],
	["application/vnd.oasis.opendocument.spreadsheet", sx],
	["application/vnd.ms-powerpoint", cx],
	["application/vnd.openxmlformats-officedocument.presentationml.presentation", cx],
	["application/vnd.oasis.opendocument.presentation", cx],
	["application/zip", lx],
	["application/x-zip-compressed", lx],
	["application/x-7z-compressed", lx],
	["application/vnd.rar", lx],
	["application/x-rar-compressed", lx],
	["application/x-tar", lx],
	["application/gzip", lx],
	["application/json", px],
	["application/xml", px],
	["text/xml", px],
	["text/html", px]
]), _x = /* @__PURE__ */ new Map([
	["image", fx],
	["audio", ux],
	["video", dx],
	["text", ax]
]);
function vx(e, t) {
	let n = e.lastIndexOf("."), r = n < 0 ? void 0 : hx.get(e.slice(n + 1).toLowerCase());
	if (r !== void 0) return r;
	let i = t.split(";", 1)[0].trim().toLowerCase(), a = i.indexOf("/");
	return gx.get(i) ?? (a < 0 ? void 0 : _x.get(i.slice(0, a))) ?? mx;
}
function yx(e, ...t) {
	return t.map((t) => [t, e]);
}
//#endregion
//#region src/rendering/file-tile.ts
function bx(e, t, n) {
	let r = document.createElement("span"), i = document.createElement("span"), a = document.createElement("span");
	return e.classList.add(Dt), e.setAttribute("title", t.name), e.setAttribute(jt, t.name), xx(e, Mt, t.type.length > 0 ? t.type : null), xx(e, Nt, t.size === null ? null : String(t.size)), r.className = Ot, r.setAttribute("aria-hidden", "true"), i.className = kt, i.textContent = t.name, a.className = At, Cx(e, r, a, n), [
		r,
		i,
		a
	];
}
function xx(e, t, n) {
	n === null ? e.removeAttribute(t) : e.setAttribute(t, n);
}
function Sx(e, t) {
	let n = e.querySelector(`:scope > .${Ot}`), r = e.querySelector(`:scope > .${At}`);
	n !== null && r !== null && Cx(e, n, r, t);
}
function Cx(e, t, n, r) {
	let i = e.getAttribute(Pt), a = i !== null && Ro(i).length > 0 ? i : vx(e.getAttribute("data-ui-file-name") ?? "", e.getAttribute("data-ui-file-type") ?? "");
	(!t.classList.contains(Ro(a)) || i !== null) && Fo(t, a);
	let o = uo(e.getAttribute(Nt), r);
	n.textContent !== o && (n.textContent = o);
}
var wx = 1024, Tx = 16777216;
function Ex(e) {
	return {
		x: e.width / 2,
		y: e.height / 2,
		zoom: 1
	};
}
function Dx(e, t) {
	let n = Lx(t.zoom, 1, 4), r = Ix(e) / n / 2;
	return {
		x: Lx(t.x, r, e.width - r),
		y: Lx(t.y, r, e.height - r),
		zoom: n
	};
}
function Ox(e, t) {
	let n = Ix(e) / t.zoom;
	return {
		x: t.x - n / 2,
		y: t.y - n / 2,
		side: n
	};
}
function kx(e, t, n) {
	return t.zoom * n / Ix(e);
}
function Ax(e, t, n, r, i) {
	let a = kx(e, t, n);
	return a > 0 ? Dx(e, {
		x: t.x - r / a,
		y: t.y - i / a,
		zoom: t.zoom
	}) : t;
}
function jx(e, t, n, r, i = {
	x: 0,
	y: 0
}) {
	let a = Lx(t.zoom * r, 1, 4), o = kx(e, t, n), s = kx(e, {
		...t,
		zoom: a
	}, n);
	return !(o > 0) || !(s > 0) ? Dx(e, {
		...t,
		zoom: a
	}) : Dx(e, {
		x: t.x + i.x / o - i.x / s,
		y: t.y + i.y / o - i.y / s,
		zoom: a
	});
}
function Mx(e, t) {
	return Math.max(1, Math.min(t, Math.round(e.side)));
}
function Nx(e, t) {
	return Math.min(1, t * 4 / Ix(e), Math.sqrt(Tx / (e.width * e.height)));
}
function Px(e) {
	return e === "image/jpeg" || e === "image/png" || e === "image/webp" ? e : "image/png";
}
function Fx(e, t, n) {
	if (n === t) return e;
	let r = e.lastIndexOf(".");
	return `${r > 0 ? e.slice(0, r) : e}.${n === "image/jpeg" ? "jpg" : n.slice(n.indexOf("/") + 1)}`;
}
function Ix(e) {
	return Math.min(e.width, e.height);
}
function Lx(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
//#endregion
//#region src/interactions/page-dialog.ts
function Rx(e) {
	let t = document.createElement("div");
	t.className = `ui-dialog ${e.className}`, t.setAttribute(N_, e.key), t.setAttribute(P_, ""), e.closesOnEscapeAndBackdrop && (t.setAttribute(L_, ""), t.setAttribute(I_, "")), t.setAttribute("hidden", "");
	let n = document.createElement("div");
	n.className = "ui-dialog__backdrop", n.setAttribute(F_, "");
	let r = document.createElement("div");
	return r.className = e.surfaceClassName === void 0 ? ji : `${ji} ${e.surfaceClassName}`, r.setAttribute("role", e.role), r.setAttribute("tabindex", "-1"), r.setAttribute("aria-modal", "true"), r.setAttribute("aria-labelledby", e.labelledBy), e.describedBy !== void 0 && r.setAttribute("aria-describedby", e.describedBy), t.append(n, r), {
		dialog: t,
		surface: r
	};
}
var zx = class {
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
}, Bx = 100 / 3, Vx = 1, Hx = 2;
function Ux(e, t = Bx) {
	let n = e.deltaMode === Vx ? Bx : e.deltaMode === Hx ? t : 1;
	return {
		x: e.deltaX * n,
		y: e.deltaY * n
	};
}
function Wx(e, t) {
	let n = (Math.sign(e) === Math.sign(t) ? e : 0) + t, r = Math.trunc(n / 100) || 0;
	return {
		steps: r,
		carried: n - r * 100
	};
}
var Gx = {
	notch: 100,
	pixels: Ux
}, Kx = "ui-image-crop", qx = "ui-image-crop-title", Jx = new zx("data-ui-image-crop-part"), Yx = "data-ui-image-crop-frame", Xx = 10, Zx = 1.2, Qx = 380, $x = 100, eS = .92, H = null, tS = !1, nS = null, rS = !1;
async function iS(e, t, n, r = gS) {
	if (H !== null || tS) return "cancelled";
	tS = !0;
	let i;
	try {
		i = await r.decodeAsync(t, n.size);
	} finally {
		tS = !1;
	}
	if (i === null) return "unreadable";
	let a = i;
	return new Promise((i) => {
		nS ??= aS();
		let o = nS;
		o.dialog.isConnected || document.body.append(o.dialog), H = {
			file: t,
			source: a,
			request: n,
			imaging: r,
			view: Ex(a),
			finish: (t) => {
				H = null, e.close(Kx), a.release(), i(t);
			}
		}, D.write(o.title, null, "ui.crop.title"), D.write(o.stage, "aria-label", "ui.crop.frame"), D.write(o.zoom, "aria-label", "ui.crop.zoom"), D.write(o.cancel, null, "ui.crop.cancel"), D.write(o.apply, null, "ui.crop.apply"), o.stage.setAttribute(Yx, n.frame), e.open(Kx), mS(o);
	});
}
function aS() {
	let { dialog: e, surface: t } = Rx({
		key: Kx,
		className: "ui-image-crop",
		surfaceClassName: "ui-image-crop__surface",
		role: "dialog",
		labelledBy: qx,
		closesOnEscapeAndBackdrop: !1
	}), n = Jx.element("h2", "ui-image-crop__title ui-text-type--subtitle");
	n.id = qx;
	let r = Jx.element("div", "ui-image-crop__stage", "stage");
	r.setAttribute("tabindex", "0"), r.setAttribute("role", "group");
	let i = Jx.element("canvas", "ui-image-crop__canvas"), a = Jx.element("span", "ui-image-crop__frame");
	i.setAttribute("aria-hidden", "true"), a.setAttribute("aria-hidden", "true"), r.append(i, a);
	let o = Jx.element("input", "ui-image-crop__zoom", "zoom");
	o.type = "range", o.min = "1", o.max = "4", o.step = "0.01";
	let s = Jx.button("ui-button--ghost", "cancel"), c = Jx.button("ui-button--primary", "apply");
	t.append(n, r, o, Jx.actions(s, c));
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
		let t = Jx.pressed(e);
		t === "cancel" ? H?.finish("cancelled") : t === "apply" && oS();
	}), new MutationObserver(() => {
		H !== null && e.hasAttribute("hidden") && H.finish("cancelled");
	}).observe(e, {
		attributes: !0,
		attributeFilter: ["hidden"]
	}), e.addEventListener("keydown", (e) => sS(l, e)), o.addEventListener("input", () => fS(l, Number(o.value))), r.addEventListener("wheel", (e) => cS(l, e), { passive: !1 }), window.addEventListener("resize", () => hS(l)), new fv({
		root: e,
		resolveHandle: (e) => r.contains(e) ? r : null,
		begin: (e, t) => H === null ? null : {
			last: t,
			start: H.view
		},
		move: (e, t, n) => {
			e.last !== null && lS(l, n.x - e.last.x, n.y - e.last.y), e.last = n;
		},
		end: () => void 0,
		cancel: (e, t) => {
			H !== null && (H.view = t.start, mS(l));
		},
		pinch: (e, t) => {
			e.last = null, uS(l, t);
		}
	}), l;
}
async function oS() {
	let e = H;
	if (e === null) return;
	let { file: t, source: n, request: r, imaging: i, view: a } = e, o = Ox(n, a), s = Px(t.type), c = i.encodeAsync(n, o, Mx(o, r.size), s);
	H = null;
	let l;
	try {
		l = await c;
	} catch {
		l = null;
	}
	e.finish(l === null ? "unreadable" : new File([l], Fx(t.name, t.type, l.type), {
		type: l.type,
		lastModified: t.lastModified
	}));
}
function sS(e, t) {
	if (t.defaultPrevented || j(t) || H === null) return;
	if (t.key === "Escape") {
		t.preventDefault(), H.finish("cancelled");
		return;
	}
	if (t.target !== e.stage || !M(t, { shift: !0 })) return;
	let n = t.shiftKey ? 50 : Xx;
	switch (t.key) {
		case "ArrowLeft":
			lS(e, -n, 0);
			break;
		case "ArrowRight":
			lS(e, n, 0);
			break;
		case "ArrowUp":
			lS(e, 0, -n);
			break;
		case "ArrowDown":
			lS(e, 0, n);
			break;
		case "+":
		case "=":
			dS(e, Zx);
			break;
		case "-":
		case "_":
			dS(e, 1 / Zx);
			break;
		case "Enter":
			oS();
			break;
		default: return;
	}
	t.preventDefault();
}
function cS(e, t) {
	if (H === null) return;
	t.preventDefault();
	let n = Ux(t, e.stage.clientHeight), r = t.ctrlKey ? $x : Qx;
	dS(e, 2 ** (-n.y / r), pS(e, t.clientX, t.clientY));
}
function lS(e, t, n) {
	H !== null && (H.view = Ax(H.source, H.view, e.frame.clientWidth, t, n), mS(e));
}
function uS(e, t) {
	if (H === null) return;
	let n = Ax(H.source, H.view, e.frame.clientWidth, t.shift.x, t.shift.y);
	H.view = jx(H.source, n, e.frame.clientWidth, t.factor, pS(e, t.center.x, t.center.y)), mS(e);
}
function dS(e, t, n) {
	H !== null && (H.view = jx(H.source, H.view, e.frame.clientWidth, t, n), mS(e));
}
function fS(e, t) {
	H !== null && Number.isFinite(t) && t > 0 && dS(e, t / H.view.zoom);
}
function pS(e, t, n) {
	let r = e.stage.getBoundingClientRect();
	return {
		x: t - (r.left + r.width / 2),
		y: n - (r.top + r.height / 2)
	};
}
function mS(e) {
	if (H === null) return;
	let t = H.view.zoom;
	e.zoom.value = String(t), e.zoom.setAttribute("aria-valuetext", `${Math.round(t * 100)}%`), e.zoom.style.setProperty("--ui-slider-fraction", String((t - 1) / 3)), hS(e);
}
function hS(e) {
	rS || H === null || (rS = !0, requestAnimationFrame(() => {
		if (rS = !1, H === null) return;
		let t = e.frame.clientWidth, n = e.stage.clientWidth, r = e.stage.clientHeight, i = H.view, a = kx(H.source, i, t);
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
var gS = {
	decodeAsync: async (e, t) => {
		let n = await _S(e);
		if (n === null) return null;
		let r = n, i = Nx(r, t);
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
		}, r, eS));
	})
};
async function _S(e) {
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
var vS = "ui-image-input", yS = "ui-image-input--multiple", bS = "ui-image-input__surface", xS = "ui-image-input__native", SS = "ui-image-input__picture", CS = "ui-image-input__text", wS = "ui-image-input__selection", TS = "ui-image-input__selections", ES = "ui-image-input__tiles", DS = "ui-image-input__tile", OS = "ui-image-input__remove", kS = "ui-image-input__progress", AS = "SelectionId", jS = "--ui-image-progress", MS = "data-ui-image-preview", NS = "data-ui-image-dragging", PS = "data-ui-image-tiles", FS = class {
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
		this.root = e.root ?? document, this.validation = e.validation, this.uploads = e.uploads ?? Yb, this.propertyPatchEngine = e.propertyPatchEngine, this.dialogs = e.dialogs, this.cropImaging = e.cropImaging, this.applyAll(this.root.querySelectorAll(`.${vS}`)), V(this.root, `.${vS}`, {
			childList: !0,
			attributeFilter: [
				Hr,
				tt,
				gi
			]
		}, (e) => {
			this.applyAll(e), this.releaseDetached();
		}), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			e.propertyName === AS && (e.value === null || e.value === void 0 || e.value === "") && this.clearAll(Ya(e.components, `.${vS}`));
		}), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("click", (e) => this.handleRemoveClick(e), !0), this.root.addEventListener("error", (e) => LS(e.target), !0), this.root.addEventListener("change", (e) => void this.handleNativeChangeAsync(e), !0), this.root.addEventListener(Wb, (e) => Kb(e, {
			rootSelector: `.${vS}`,
			nativeSelector: `.${xS}`,
			pressed: (e) => e.querySelector(`.${bS}`)
		})), this.root.addEventListener(ld, (e) => this.handleDraftDropped(e)), pb({
			root: this.root,
			draggingAttribute: NS,
			resolveTarget: (e) => {
				let t = e.closest(`.${bS}`), n = t?.closest(`.${vS}`) ?? null, r = n === null ? gb(this.root, e, `.${vS}`) : null, i = n ?? r?.field ?? null, a = t ?? i?.querySelector(`.${bS}`) ?? null;
				return i === null || a === null ? null : {
					host: i,
					mark: r?.component,
					accept: i.querySelector(`.${xS}`)?.getAttribute("accept") ?? "",
					multiple: IS(i),
					refused: A(i) || O(a)
				};
			},
			onFiles: (e, t) => void (IS(e) ? this.takeManyAsync(e, t) : this.takeFileAsync(e, t[0]))
		});
	}
	applyAll(e) {
		for (let t of e) IS(t) ? this.reconcileShelf(t) : this.apply(t);
	}
	apply(e) {
		let t = e.querySelector(`.${SS}`);
		if (t === null) return;
		let n = e.getAttribute("data-ui-image-source") ?? "", r = this.previews.has(e);
		if (r && e.dataset.previewFor === n) return;
		let i = r && n.length > 0;
		this.dropPreview(e, i), t.getAttribute("src") !== (n.length === 0 ? null : n) && e.removeAttribute(lt), n.length === 0 ? t.removeAttribute("src") : t.getAttribute("src") !== n && t.setAttribute("src", n), t.hasAttribute("src") && t.complete && t.naturalWidth === 0 && e.setAttribute(lt, ""), i || KS(e, e.getAttribute("data-ui-image-caption") ?? YS(n)), JS(e, n.length > 0);
	}
	reconcileShelf(e) {
		let t = e.getAttribute(gi);
		if (this.seenKeys.get(e) === t) return;
		this.seenKeys.set(e, t);
		let n = this.published.get(e) ?? [], r = e.querySelector(`.${TS}`);
		(r === null || this.propertyPatchEngine?.isHeldTarget(r) !== !0) && (n.length = 0);
		let i = t === null ? -1 : n.indexOf(t);
		if (i >= 0) {
			n.splice(0, i + 1);
			return;
		}
		n.length = 0;
		let a = VS(t);
		if (a === null) return;
		let o = this.shelves.get(e) ?? [];
		for (let t of [...o]) t.selectionId !== null && !a.has(t.selectionId) && this.dropTile(e, t);
		this.restoreTiles(e, o, a);
	}
	restoreTiles(e, t, n) {
		let r = e.querySelector(`.${ES}`);
		if (r === null || n.size === 0) return;
		let i = /* @__PURE__ */ new Map();
		for (let e of t) e.selectionId !== null && i.set(e.selectionId, e);
		let a = [];
		for (let t of n) {
			let n = i.get(t);
			n === void 0 && (n = US(t), this.fillStoredTileAsync(e, n, t)), a.push(n);
		}
		for (let e of t) e.selectionId === null && a.push(e);
		a.length === t.length && a.every((e, n) => t[n] === e) || (t.splice(0, t.length, ...a), this.shelves.set(e, t), r.replaceChildren(...t.map((e) => e.element)), RS(e, t));
	}
	async fillStoredTileAsync(e, t, n) {
		let r;
		try {
			r = await zb(n);
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
		WS(t.element, a, i === void 0 ? "" : Bb(i.fileId)), t.element.classList.remove(Oi);
	}
	releaseDetached() {
		for (let e of this.holding) if (!e.isConnected) {
			this.holding.delete(e), this.dropPreview(e);
			for (let t of [...this.shelves.get(e) ?? []]) this.dropTile(e, t);
		}
	}
	clearAll(e) {
		for (let t of e) IS(t) || this.previews.get(t)?.landed !== !0 || (t.dataset.previewFor === (t.getAttribute("data-ui-image-source") ?? "") && this.dropPreview(t), this.apply(t));
	}
	handlePickClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Wr}]`), n = t?.closest(`.${vS}`) ?? null;
		t === null || n === null || A(n) || O(t) || n.querySelector(`.${xS}`)?.click();
	}
	handleRemoveClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${OS}`), n = t?.closest(`.${vS}`) ?? null;
		if (t === null || n === null || A(n) || O(n)) return;
		e.preventDefault(), e.stopPropagation();
		let r = this.shelves.get(n)?.find((e) => e.element === t.parentElement);
		r !== void 0 && (this.dropTile(n, r), this.publishShelf(n));
	}
	async handleNativeChangeAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(xS)) return;
		let t = e.target.closest(`.${vS}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && n.length !== 0 && (IS(t) ? await this.takeManyAsync(t, n) : await this.takeFileAsync(t, n[0]));
	}
	handleDraftDropped(e) {
		if (e.target instanceof Element) for (let t of e.target.querySelectorAll(`.${vS}`)) this.previews.has(t) && (this.dropPreview(t), this.apply(t), Ub(t.querySelector(`.${wS}`), ""));
	}
	async takeFileAsync(e, t) {
		this.releaseDetached();
		let n = e.querySelector(`.${bS}`), r = e.querySelector(`.${SS}`), i = e.querySelector(`.${wS}`);
		if (n === null || r === null) return;
		let a = await this.cropAsync(e, t);
		if (a === null || Ab(e, [a], !1, this.validation).length === 0) return;
		this.dropPreview(e);
		let o = {
			url: URL.createObjectURL(a),
			landed: !1
		};
		this.previews.set(e, o), this.holding.add(e), e.dataset.previewFor = e.getAttribute("data-ui-image-source") ?? "", e.setAttribute(MS, ""), e.removeAttribute(lt), r.setAttribute("src", o.url), KS(e, a.name), JS(e, !0), n.classList.add(Oi);
		let c = this.uploads.hold(e);
		try {
			let t = await Lb([a], () => void 0);
			this.previews.get(e) === o && (o.landed = !0, Ub(i, t.selectionId));
		} catch (t) {
			s("picture upload failed.", t), this.previews.get(e) === o && (qS(e), Ub(i, ""));
		} finally {
			c(), (this.previews.get(e) === o || !this.previews.has(e)) && n.classList.remove(Oi);
		}
	}
	async cropAsync(e, t) {
		let n = zS(e);
		if (n === null || this.dialogs === void 0) return t;
		if (this.cropping.has(e)) return null;
		this.cropping.add(e);
		try {
			let r = await iS(this.dialogs, t, {
				frame: n,
				size: BS(e)
			}, this.cropImaging);
			return r === "cancelled" || !e.isConnected ? null : r === "unreadable" ? (this.unreadable.add(e), this.validation?.mark(e, "error", { key: "ui.image.unreadable" }), null) : (this.unreadable.delete(e) && this.validation?.mark(e, null), r);
		} finally {
			this.cropping.delete(e);
		}
	}
	async takeManyAsync(e, t) {
		this.releaseDetached();
		let n = e.querySelector(`.${ES}`), r = Ab(e, t, !0, this.validation);
		if (n === null || r.length === 0) return;
		let i = this.shelves.get(e) ?? [];
		this.shelves.set(e, i), this.holding.add(e);
		let a = r.map(async (t) => {
			let r = HS(t), a = this.uploads.hold(e, r);
			i.push(r), n.appendChild(r.element);
			try {
				let n = await Lb([t], (e) => r.element.style.setProperty(jS, `${e}%`));
				if (!i.includes(r)) return;
				r.selectionId = n.selectionId, r.element.classList.remove(Oi), this.publishShelf(e);
			} catch (n) {
				if (s("picture upload failed.", n), !i.includes(r)) return;
				this.dropTile(e, r), Ib(e, t.name, this.validation);
			} finally {
				a();
			}
		});
		RS(e, i), await Promise.all(a);
	}
	dropTile(e, t) {
		let n = this.shelves.get(e), r = n?.indexOf(t) ?? -1;
		n !== void 0 && r >= 0 && n.splice(r, 1), this.uploads.forget(e, t), t.url !== null && URL.revokeObjectURL(t.url), t.element.remove(), RS(e, n ?? []);
	}
	publishShelf(e) {
		let t = e.querySelector(`.${TS}`), n = (this.shelves.get(e) ?? []).map((e) => e.selectionId).filter((e) => e !== null), r = JSON.stringify(n);
		if (t === null || t.getAttribute("data-ui-selected-keys") === r) return;
		let i = this.published.get(e) ?? [];
		i.push(r), this.published.set(e, i), t.setAttribute(gi, r), this.seenKeys.set(e, r), e.setAttribute(gi, r), t.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	dropPreview(e, t = !1) {
		let n = this.previews.get(e);
		n !== void 0 && (this.uploads.forget(e), URL.revokeObjectURL(n.url), this.previews.delete(e), delete e.dataset.previewFor, e.removeAttribute(MS), t || KS(e, ""));
	}
};
function IS(e) {
	return e.classList.contains(yS);
}
function LS(e) {
	e instanceof Element && e.classList.contains(SS) && e.closest(`.${vS}`)?.setAttribute(lt, "");
}
function RS(e, t) {
	e.hasAttribute(PS) !== t.length > 0 && e.toggleAttribute(PS, t.length > 0);
}
function zS(e) {
	let t = e.getAttribute(nt);
	return t === "square" || t === "circle" ? t : null;
}
function BS(e) {
	let t = Number(e.getAttribute(rt));
	return Number.isInteger(t) && t > 0 ? t : wx;
}
function VS(e) {
	if (e === null) return /* @__PURE__ */ new Set();
	let t;
	try {
		t = JSON.parse(e);
	} catch {
		return null;
	}
	return Array.isArray(t) ? new Set(t.filter((e) => typeof e == "string")) : null;
}
function HS(e) {
	let t = document.createElement("span"), n = URL.createObjectURL(e);
	return t.className = `${DS} ${Oi}`, WS(t, e, n), {
		element: t,
		url: n,
		selectionId: null
	};
}
function US(e) {
	let t = document.createElement("span"), n = document.createElement("button"), r = document.createElement("span");
	return t.className = `${DS} ${Oi}`, n.type = "button", n.className = OS, r.className = kS, D.write(n, "aria-label", "ui.file.remove"), t.append(n, r), {
		element: t,
		url: null,
		selectionId: e
	};
}
function WS(e, t, n) {
	let r = document.createElement("button"), i = document.createElement("span");
	if (r.type = "button", r.className = OS, i.className = kS, t.type.startsWith("image/")) {
		let a = document.createElement("img");
		a.src = n, a.alt = t.name, D.write(r, "aria-label", "ui.image.remove"), a.addEventListener("error", () => e.replaceChildren(...GS(e, r, t), r, i), { once: !0 }), e.replaceChildren(a, r, i);
	} else e.replaceChildren(...GS(e, r, t), r, i);
}
function GS(e, t, n) {
	return D.write(t, "aria-label", "ui.file.remove"), bx(e, n, D.language);
}
function KS(e, t) {
	let n = e.querySelector(`.${CS}`);
	n !== null && (cl(n, null), n.textContent !== t && (n.textContent = t));
}
function qS(e) {
	let t = e.querySelector(`.${CS}`);
	t !== null && D.write(t, null, "ui.file.failed");
}
function JS(e, t) {
	let n = e.querySelector(`.${bS}`);
	n === null || n.hasAttribute("aria-label") && dl(n, "aria-label") === null || D.write(n, "aria-label", t ? "ui.image.change" : "ui.image.choose");
}
function YS(e) {
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
var XS = "ui-key-value-action__value", ZS = "ui-key-value-action--editable", QS = "ui-text__title", $S = "ui-row-form-", eC = ":scope > :is(.ui-input--filled, .ui-input--tonal, .ui-input--outline, .ui-input--ghost, .ui-input--underline)", tC = class {
	options;
	root;
	openRows = /* @__PURE__ */ new WeakSet();
	closedRows = /* @__PURE__ */ new WeakSet();
	rowForms = /* @__PURE__ */ new WeakMap();
	formCount = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.handleRows(this.root.querySelectorAll(`.${qu}`), !1), V(this.root, `.${qu}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [Ir]
		}, (e) => this.handleRows(e, !0)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && oC(e.target) && e.preventDefault();
		}, !0), (this.root === document ? window : this.root).addEventListener("change", (e) => aC(e), !0);
	}
	handleRows(e, t) {
		for (let n of e) n.hasAttribute("data-ui-row-editing") ? (this.closedRows.delete(n), this.joinForm(n), nC(n), this.openRows.has(n) || (this.openRows.add(n), this.open(n, t), this.judge(n))) : this.closedRows.has(n) || (this.openRows.delete(n), this.closedRows.add(n), this.close(n));
	}
	joinForm(e) {
		let t = e.querySelector(`.${Yu} button`);
		if (t === null) return;
		let n = this.rowForms.get(e);
		n === void 0 && (n = `${$S}${++this.formCount}`, this.rowForms.set(e, n));
		for (let t of e.querySelectorAll(`.${Ju} [${Qe}]:not([${ln}])`)) t.setAttribute(ln, n);
		t.setAttribute(Ti, n);
	}
	leaveForm(e) {
		let t = this.rowForms.get(e);
		if (t !== void 0) for (let n of e.querySelectorAll(`[${ln}="${t}"], [${Ti}="${t}"]`)) n.removeAttribute(ln), n.removeAttribute(Ti);
	}
	close(e) {
		this.leaveForm(e);
		for (let t of e.querySelectorAll(`.${Ju} [${Qe}]`)) {
			if (ad(t)) {
				t.value = "";
				continue;
			}
			let e = this.options.dom.resolveNearestComponent(t, () => !0);
			this.options.propertyPatchEngine.restoreBoundValue(t, e?.dynamicParameters ?? []);
		}
		ud(e), this.judge(e);
	}
	judge(e) {
		let t = iC(e);
		for (let n of e.querySelectorAll(`.${Ju} [${Qe}]`)) this.options.validation.judgeShown(n, ad(n) && n.value.length === 0 ? t : null);
	}
	open(e, t) {
		let n = e.querySelector(`.${Ju} :is(input, textarea, select)`);
		if (n !== null) {
			if (ad(n) && n.value.length === 0 && n.hasAttribute("data-ui-bind-value")) {
				let t = iC(e);
				t.length > 0 && (n.value = t, n.dispatchEvent(new Event("change", { bubbles: !0 })));
			}
			t && (n.focus({ preventScroll: !0 }), id(n) && n.select());
		}
	}
	handleKeydown(e) {
		if (e.key === "F2" && !e.defaultPrevented && M(e)) {
			rC(e);
			return;
		}
		if (e.defaultPrevented || j(e) || !(e.target instanceof Element) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = $u(e.target);
		if (t === null || e.key === "Enter" && t.cell.classList.contains("ui-key-value-action__edit-action")) return;
		let { cell: n, row: r } = t, i = e.target.closest(Ii), a = n.querySelector("[role='listbox']");
		if (i !== null && n.contains(i) || a !== null && a.getClientRects().length > 0 || e.key === "Enter" && e.target instanceof HTMLTextAreaElement) return;
		let o = r.querySelectorAll(`.${Yu} button`), s = e.key === "Enter" ? o[0] : o[o.length - 1];
		s !== void 0 && (e.preventDefault(), !O(s) && (e.key === "Enter" && e.target instanceof HTMLInputElement && (e.target.dispatchEvent(new Event("change", { bubbles: !0 })), s.focus({ preventScroll: !0 })), s.click()));
	}
};
function nC(e) {
	for (let t of e.querySelectorAll(`:scope > .${Ju}`)) {
		let e = t.querySelector(eC) !== null;
		t.hasAttribute("data-ui-boxed-editor") !== e && t.toggleAttribute(Lr, e);
	}
}
function rC(e) {
	let t = e.target instanceof Element ? e.target.closest(`.${qu}`) : null, n = t === null || t.hasAttribute("data-ui-row-editing") || t.closest(`.${ZS}`) === null ? null : t.querySelector(".ui-key-value-action__action")?.querySelector(Cp) ?? null;
	n === null || O(n) || (e.preventDefault(), n.click());
}
function iC(e) {
	return e.querySelector(`.${XS} .${QS}`)?.textContent?.trim() ?? "";
}
function aC(e) {
	if (!e.isTrusted || !(e.target instanceof Element)) return;
	let t = e.target.closest(".ui-key-value-action__value-input")?.closest(".ui-key-value-action__row") ?? null;
	t !== null && !t.hasAttribute("data-ui-row-editing") && e.stopImmediatePropagation();
}
function oC(e) {
	let t = e.closest(`.${Yu} button`), n = t?.closest(`.${Yu}`)?.querySelectorAll("button");
	return t !== null && n !== void 0 && n[n.length - 1] === t;
}
var sC = `.ui-button[${Ut}="pressed"]`, cC = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(sC);
		t === null || O(t) || t.hasAttribute("data-ui-drawer-pin") || (t.setAttribute("aria-pressed", t.getAttribute("aria-pressed") === "true" ? "false" : "true"), t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, lC = `${fd}, [tabindex], [contenteditable], ${Ii}, [${et}]`, uC = ":scope > input.ui-field, :scope > textarea.ui-field", dC = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("pointerdown", (e) => this.handlePointerDown(e));
	}
	handlePointerDown(e) {
		if (e.defaultPrevented || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(dd);
		if (t === null || e.target !== t && e.target.closest(lC) !== null) return;
		let n = t.querySelector(uC);
		if (!ad(n) || n.readOnly || O(n) || A(n) || (e.preventDefault(), n.focus({ preventScroll: !0 }), n.selectionStart === null)) return;
		let r = n.value.length;
		n.setSelectionRange(r, r);
	}
}, fC = "data-ui-input-debounce", pC = `input[${fC}], textarea[${fC}]`;
function mC(e) {
	return (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.matches(pC);
}
var hC = /* @__PURE__ */ new Set();
function gC() {
	for (let e of hC) if (e.waiting) return !0;
	return !1;
}
function _C() {
	for (let e of hC) e.commitAll();
}
function vC(e) {
	for (let t of hC) t.drop(e);
}
var yC = class {
	waits = /* @__PURE__ */ new Map();
	composing = /* @__PURE__ */ new WeakSet();
	constructor(e) {
		e.addEventListener("compositionstart", (e) => this.mark(e, !0), !0), e.addEventListener("compositionend", (e) => this.mark(e, !1), !0), hC.add(this);
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
}, bC = class {
	root;
	pauses;
	constructor(e = {}) {
		this.root = e.root ?? document, this.pauses = new yC(this.root), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("compositionend", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleChange(e), !0);
	}
	handleInput(e) {
		let t = e.target;
		if (!mC(t) || e.isComposing === !0) return;
		let n = Number(t.getAttribute(fC));
		this.pauses.wait(t, Number.isFinite(n) && n >= 0 ? n : 0, () => t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	handleChange(e) {
		mC(e.target) && this.pauses.drop(e.target);
	}
}, xC = "data-ui-submit-on-enter", SC = "data-ui-runs-on-enter", CC = "enter", wC = "escape", TC = {
	name: CC,
	registration: { settlesValue: !0 }
}, EC = "ui-commit-in-place", DC = class {
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
		}, !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), this.root.addEventListener(EC, (e) => {
			(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) && this.commitInPlace(e.target);
		}), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = this.focusedField;
			t !== null && !(e.local && this.edited.has(t)) && e.components.some((e) => e.contains(t)) && (this.lastCommitted = t.value);
		});
	}
	handleKeydown(e) {
		if (e.defaultPrevented || j(e) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = e.target;
		t instanceof HTMLTextAreaElement ? e.key === "Escape" ? (e.preventDefault(), Qu(t) ? this.runEscape(t, e) : this.leave(t)) : OC(t, e) ? (e.preventDefault(), this.runEnter(t, e)) : kC(t, e) && (e.preventDefault(), this.commitInPlace(t), this.submitForm(t)) : id(t) && (e.preventDefault(), OC(t, e) ? this.runEnter(t, e) : e.key === "Escape" && Qu(t) ? this.runEscape(t, e) : (this.leave(t), e.key === "Enter" && this.submitForm(t)));
	}
	runEnter(e, t) {
		t.repeat || e.readOnly || O(e) || (this.commitInPlace(e), e.dispatchEvent(new Event(CC, { bubbles: !0 })));
	}
	runEscape(e, t) {
		if (t.repeat) return;
		vC(e), this.edited.delete(e), e === this.focusedField && e.value !== this.lastCommitted && this.putBack(e, this.lastCommitted);
		let n = rm(e);
		e.blur(), im(e, n), e.dispatchEvent(new Event(wC, { bubbles: !0 }));
	}
	putBack(e, t) {
		this.propertyPatchEngine?.writeBoundValue(e, t), e.value !== t && (e.value = t);
	}
	submitForm(e) {
		let t = e.getAttribute(ln);
		if (t === null || t.length === 0) return;
		let n = this.root.querySelector(`[${Ti}="${S(t)}"]`);
		n !== null && !O(n) && n.click();
	}
	leave(e) {
		let t = this.changes, n = rm(e);
		e.blur(), this.changes === t && this.commit(e), im(e, n);
	}
	commit(e) {
		e.value !== this.committedValue && e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	commitInPlace(e) {
		this.edited.has(e) ? e.dispatchEvent(new Event("change", { bubbles: !0 })) : this.commit(e);
	}
};
function OC(e, t) {
	return AC(t) && e.hasAttribute(SC);
}
function kC(e, t) {
	return AC(t) && e.hasAttribute(xC) && !e.readOnly && !O(e);
}
function AC(e) {
	return e.key === "Enter" && M(e);
}
//#endregion
//#region src/updates/icon-stand-in.ts
var jC = "icon-stand-in", MC = "ne-person", NC = "ne-image", PC = "ui-icon", FC = "ui-icon--circle", IC = "ui-icon--image", LC = "ui-icon-stand-in", RC = `:scope > .${LC}`, zC = `.${PC}.${FC}:not(.${LC}), .${PC}.${IC}:not(.${LC})`, BC = "missing", VC = "failed", HC = 512, UC = /* @__PURE__ */ new Map(), WC = /* @__PURE__ */ new Map();
function GC(e) {
	let t = e.getAttribute(ut), n = KC(e);
	return n === null ? e.removeAttribute(ut) : t !== n && e.setAttribute(ut, n), XC(e, n !== null, e.classList.contains(FC)), n === BC ? "show" : t === BC ? "release" : "keep";
}
function KC(e) {
	let t = e.classList.contains(FC);
	if (!e.className.split(" ").some(Lo)) return t ? BC : null;
	let n = e.classList.contains(IC) ? qC(e) : null;
	if (n === null) return null;
	let r = UC.get(n);
	return r === void 0 || !r.loaded && Date.now() - r.at >= 3e4 ? (JC(n, e), r === void 0 ? null : VC) : r.loaded ? null : VC;
}
function qC(e) {
	let t = e.style.getPropertyValue(Po).trim();
	return t.startsWith("url(\"") && t.endsWith("\")") ? t.slice(5, -2) : null;
}
function JC(e, t) {
	let n = WC.get(e);
	if (n !== void 0) {
		n.add(t);
		return;
	}
	WC.set(e, /* @__PURE__ */ new Set([t]));
	let r = new Image();
	r.addEventListener("load", () => YC(e, !0)), r.addEventListener("error", () => YC(e, !1)), r.src = e;
}
function YC(e, t) {
	let n = WC.get(e);
	UC.delete(e), UC.set(e, {
		loaded: t,
		at: Date.now()
	}), WC.delete(e), UC.size > HC && UC.delete(UC.keys().next().value);
	for (let e of n ?? []) GC(e);
}
function XC(e, t, n) {
	let r = e.querySelector(RC);
	if (!t) {
		r?.remove();
		return;
	}
	let i = e.getAttribute(ct), a = i !== null && Ro(i).length > 0 ? i : n ? MC : NC;
	if (r === null) r = document.createElement("span"), r.setAttribute("aria-hidden", "true"), e.appendChild(r);
	else if (r.classList.contains(Ro(a))) return;
	Fo(r, a), r.classList.add(LC);
}
//#endregion
//#region src/interactions/image-fallback-engine.ts
var ZC = `.${it}`, QC = `img.${at}`, $C = `:scope > ${QC}`, ew = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'/%3E", tw = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'/%3E", nw = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("error", (e) => this.handleError(e), !0);
		for (let e of this.root.querySelectorAll(QC)) (aw(e) || e.complete && e.naturalWidth === 0) && sw(e);
		for (let e of this.root.querySelectorAll(zC)) GC(e);
		V(this.root, `${ZC}, ${zC}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: ["src", "class"],
			relevant: rw
		}, (e) => {
			for (let t of e) t.classList.contains("ui-image") ? iw(t) : GC(t);
		});
	}
	handleError(e) {
		let t = e.target;
		t instanceof HTMLImageElement && t.matches(QC) && sw(t);
	}
};
function rw(e) {
	if (e.type === "childList") return !0;
	let t = e.target;
	return t instanceof Element && (e.attributeName === "src" ? t.matches(QC) : t.matches(ZC));
}
function iw(e) {
	let t = e.querySelector($C);
	t !== null && (e.hasAttribute("data-ui-image-failed") && (ow(t) ? t.getAttribute("src") !== lw(e) && cw(e, t) : (e.removeAttribute(lt), XC(e, !1, !1))), aw(t) && sw(t));
}
function aw(e) {
	let t = e.getAttribute("src");
	return t === null || t.trim().length === 0;
}
function ow(e) {
	let t = e.getAttribute("src");
	return t === tw || t === ew;
}
function sw(e) {
	if (ow(e)) return;
	let t = e.getAttribute(st);
	if (t !== null && t.length > 0 && e.getAttribute("src") !== t) {
		e.setAttribute("src", t);
		return;
	}
	let n = e.parentElement;
	n !== null && n.classList.contains("ui-image") && (n.setAttribute(lt, ""), cw(n, e));
}
function cw(e, t) {
	t.setAttribute("src", lw(e)), XC(e, !0, e.classList.contains(ot));
}
function lw(e) {
	return e.classList.contains("ui-image--circle") ? ew : tw;
}
//#endregion
//#region src/rendering/tier-class.ts
var uw = [
	Pn,
	Fn,
	In
], dw = uw.map((e) => `[${e}]`).join(", ");
function fw(e, t = og()) {
	let n = B.indexOf(t);
	for (let t of uw) {
		let r = e.getAttribute(t)?.split(" ").filter((e) => e.length > 0);
		if (r === void 0 || r.length !== B.length) continue;
		let i = r[n];
		for (let t of r) t !== i && e.classList.remove(t);
		e.classList.add(i);
	}
}
function pw(e, t = og()) {
	e instanceof Element && e.matches(dw) && fw(e, t);
	for (let n of e.querySelectorAll(dw)) fw(n, t);
}
var mw = class {
	root;
	constructor(e) {
		this.root = e.root, pw(this.root), ig(() => pw(this.root)), this.root instanceof Node && new MutationObserver((e) => {
			let t = og();
			for (let n of e) if (n.type === "attributes" && n.target instanceof Element) fw(n.target, t);
			else for (let e of n.addedNodes) e instanceof Element && pw(e, t);
		}).observe(this.root, {
			subtree: !0,
			childList: !0,
			attributeFilter: [...uw]
		});
	}
}, hw = "ui-radio-group__input", gw = "ui-radio-group__dot", _w = {
	kind: "radio",
	decorate: vw
};
function vw(e) {
	let t = document.createElement("input");
	t.className = hw, t.type = "radio", t.value = e.key;
	let n = document.createElement("span");
	n.className = gw, e.row.prepend(t, n);
}
//#endregion
//#region src/interactions/radio-group-sync-engine.ts
var yw = "data-ui-radio-value", bw = "ui-radio-group", xw = "ui-radio-group__item", Sw = "data-ui-radio-group-name", Cw = "data-ui-radio-bind-value-id", ww = class {
	root;
	renamed = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.claimGroupNames([...this.root.querySelectorAll(`.${bw}`)]);
		for (let e of this.root.querySelectorAll(`.${bw}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = [];
			for (let n of e) if (n.type === "attributes" && n.target instanceof HTMLElement) this.sync(n.target.closest(`.${bw}`));
			else if (!m_(n)) for (let e of n.addedNodes) e instanceof HTMLElement && t.push(e);
			this.claimGroupNames(t.flatMap(Tw));
			for (let e of new Set(t.map((e) => e.closest(`.${bw}`)))) this.sync(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: [yw, "class"],
			childList: !0,
			subtree: !0
		});
	}
	claimGroupNames(e) {
		if (e.length === 0) return;
		let t = /* @__PURE__ */ new Map();
		for (let e of this.root.querySelectorAll(`.${bw}`)) {
			let n = e.getAttribute(Sw);
			n !== null && t.set(n, (t.get(n) ?? 0) + 1);
		}
		let n = /* @__PURE__ */ new Set();
		for (let r of e) {
			let e = r.getAttribute(Sw), i = e === null ? 0 : t.get(e) ?? 0;
			if (e === null || i < 2) continue;
			t.set(e, i - 1), n.add(e);
			let a = `${e}-${++this.renamed}`;
			r.setAttribute(Sw, a);
			for (let e of Hd(r, `.${hw}`, `.${bw}`)) e.name = a;
			this.sync(r);
		}
		if (n.size !== 0) for (let e of this.root.querySelectorAll(`.${bw}`)) n.has(e.getAttribute(Sw) ?? "") && this.sync(e);
	}
	sync(e) {
		if (e === null) return;
		let t = e.getAttribute(yw), n = e.getAttribute(Sw), r = e.getAttribute(Cw);
		for (let i of Hd(e, `.${hw}`, `.${bw}`)) {
			n !== null && i.name !== n && (i.name = n), r !== null && i.getAttribute("data-ui-bind-value") !== r && i.setAttribute(Qe, r), i.checked = i.value === t;
			let e = Ew(i);
			i.disabled !== e && (i.disabled = e);
		}
	}
};
function Tw(e) {
	return e.classList.contains(bw) ? [e] : [...e.querySelectorAll(`.${bw}`)];
}
function Ew(e) {
	let t = e.closest(`.${xw}`);
	return t !== null && k(t);
}
//#endregion
//#region src/rendering/color-bytes.ts
function Dw(e) {
	return Number.isFinite(e) ? Math.min(255, Math.max(0, Math.round(e))) : 0;
}
function Ow(e) {
	return Dw(e).toString(16).padStart(2, "0").toUpperCase();
}
function kw(e, t, n, r) {
	let i = r / 255, a = (e) => Math.round(e * i + 255 * (1 - i));
	return (Aw(a(e), a(t), a(n)) + .05) ** 2 > 1.05 * .05 ? "var(--ui-color-on-light)" : "var(--ui-color-on-dark)";
}
function Aw(e, t, n) {
	return .2126 * jw(e) + .7152 * jw(t) + .0722 * jw(n);
}
function jw(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
//#endregion
//#region src/rendering/web-dom-converters.ts
var Mw = "inlineMarkupPlainText", Nw = /* @__PURE__ */ new Map([
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
]), Pw = [
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
function Fw(e) {
	return W(e, Pw);
}
var Iw = [
	"small",
	"medium",
	"large"
], Lw = ["default", "circle"], Rw = [
	"display",
	"title",
	"subtitle",
	"body",
	"caption",
	"overline"
], zw = [
	"start",
	"center",
	"end",
	"justify"
], Bw = ["nowrap", "wrap"], Vw = /* @__PURE__ */ new Map([
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
]), Hw = /* @__PURE__ */ new Map([
	["primary", "--ui-color-primary-ink"],
	["accent", "--ui-color-accent-ink"],
	["info", "--ui-color-info-ink"],
	["warning", "--ui-color-warning-ink"],
	["success", "--ui-color-success-ink"],
	["danger", "--ui-color-danger-ink"]
]), Uw = /* @__PURE__ */ new Map([
	["primary", "--ui-color-on-primary"],
	["accent", "--ui-color-on-accent"],
	["info", "--ui-color-on-info"],
	["warning", "--ui-color-on-warning"],
	["success", "--ui-color-on-success"],
	["danger", "--ui-color-on-danger"],
	["muted", "--ui-color-surface"]
]), Ww = ["inline", "trailing"], Gw = [
	"none",
	"left",
	"top",
	"right",
	"bottom"
], Kw = [
	"filled",
	"outline",
	"underline",
	"ghost",
	"tonal"
], qw = [
	"small",
	"medium",
	"large"
], Jw = [
	"small",
	"medium",
	"large"
], Yw = [
	"primary",
	"accent",
	"danger",
	"outline",
	"ghost",
	"link",
	"surface"
], Xw = [
	"primary",
	"accent",
	"info",
	"warning",
	"success",
	"danger",
	"surface",
	"plain"
], Zw = [
	"filled",
	"tinted",
	"outline"
], Qw = ["light", "dark"], $w = [
	"start",
	"center",
	"end",
	"stretch"
], eT = ["clip", "visible"], tT = [
	"visible",
	"hidden",
	"collapsed"
], nT = [
	"background",
	"raised",
	"tinted",
	"flat"
], rT = ["horizontal", "vertical"], iT = [
	"none",
	"gap",
	"rule"
], aT = [
	"none",
	"one",
	"many"
], oT = [
	"none",
	"left",
	"right",
	"top",
	"bottom"
], sT = ["stack", "wrap"], cT = ["end", "start"], lT = [
	"disabled",
	"auto",
	"always"
], uT = [
	"disabled",
	"proximity",
	"mandatory"
], dT = [
	"text",
	"email",
	"password",
	"search",
	"tel",
	"url"
], fT = [
	"text",
	"numeric",
	"decimal",
	"tel",
	"email",
	"url",
	"search"
], pT = ["hex", "rgb"], mT = ["field", "swatch"], hT = [
	"fill",
	"contain",
	"cover",
	"none"
], gT = [
	"100% 100%",
	"contain",
	"cover",
	"auto"
], _T = ["default", "circle"], vT = ["card", "quiet"], yT = ["uniform", "vignette"], bT = ["linear", "circular"], xT = [
	"none",
	"vertical",
	"horizontal",
	"both"
], ST = [
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
], CT = [
	"None",
	"Shade",
	"Tint"
], wT = /* @__PURE__ */ new Map();
function TT(e) {
	return wT.get(e);
}
function U(e, t, n) {
	return jT(e, kT(t, n), (e) => `${t}${W(e, n)}`);
}
function ET(e, t, n) {
	return jT(e, kT(t, n), (e) => `${t}${W(DT(e) ? lg(e, og()) : e, n)}`);
}
function DT(e) {
	return typeof e == "object" && !!e && "base" in e;
}
function OT(e, t, n) {
	return [e, (e) => {
		let r = B.map((r) => `${t}${W(lg(e, r), n)}`);
		return r.every((e) => e === r[0]) ? void 0 : r.join(" ");
	}];
}
function kT(e, t) {
	return AT(t.map((t) => `${e}${t}`));
}
function AT(e) {
	let t = new Set(e);
	return (e) => t.has(e);
}
function jT(e, t, n) {
	return wT.set(e, t), [e, n];
}
function MT(e, t, n) {
	return B.map((r) => [`${e}${r[0].toUpperCase()}${r.slice(1)}${t}`, (e) => n(e, r)]);
}
var NT = new Map([
	U("colorClass", "ui-color--", Pw),
	jT("themeColorClass", kT("ui-color--", Pw), (e) => vE(e)),
	jT("iconClass", Lo, (e) => Ro(e)),
	["iconUrlCss", (e) => Ao(e)],
	["safeUrl", (e) => go(e)],
	["safeImageSource", (e) => To(e)],
	[Mw, (e) => e == null ? void 0 : Zo(String(e))],
	["ariaBooleanAttribute", (e) => e === !0 ? "true" : "false"],
	["placeholderText", (e) => typeof e == "string" && e.length > 0 ? e : " "],
	U("iconSizeClass", "ui-icon-size--", Iw),
	["iconSizeAttribute", (e) => W(e, Iw)],
	jT("iconShapeClass", AT(["ui-icon--circle"]), (e) => W(e, Lw) === "circle" ? "ui-icon--circle" : ""),
	U("textTypeClass", "ui-text-type--", Rw),
	jT("textAppearanceClass", kT("ui-text-type--", Rw), (e) => OE(e, "ui-text-type--")),
	jT("textDescriptionTypeClass", kT("ui-text--description-", Rw), (e) => OE(e, "ui-text--description-")),
	U("textAlignmentClass", "ui-text--align-", zw),
	U("textWrapClass", "ui-text--", Bw),
	U("buttonAlignmentClass", "ui-button--align-", zw),
	U("textBadgePlacementHostClass", "ui-text--badge-", Ww),
	U("badgeStyleClass", "ui-badge-style--", Xw),
	U("badgeFillClass", "ui-badge-fill--", Zw),
	jT("badgeColoredClass", AT(["ui-badge--colored"]), (e) => lE(e).length > 0 ? "ui-badge--colored" : ""),
	["badgeTextFit", (e) => yE(e)],
	U("buttonClass", "ui-button--", Yw),
	U("surfaceStyleClass", "ui-surface--", nT),
	ET("orientationClass", "ui-orientation--", rT),
	OT("orientationTierClasses", "ui-orientation--", rT),
	U("groupSeparatorClass", "ui-command-bar--separator-", iT),
	["selectionModeAttribute", (e) => W(e, aT)],
	["selectionBackgroundCss", (e) => lE(oE(e, "background"))],
	["selectionForegroundCss", (e) => lE(oE(e, "foreground"))],
	["selectionMarkColorCss", (e) => lE(oE(e, "markColor"))],
	["selectionMarkCss", (e) => cE(oE(e, "mark"))],
	["selectionFontWeightCss", (e) => sE(oE(e, "bold"))],
	["selectionActionBarBackgroundCss", (e) => lE(oE(e, "actionBarBackground"))],
	ET("itemsViewLayoutClass", "ui-items-view--", sT),
	OT("itemsViewLayoutTierClasses", "ui-items-view--", sT),
	U("dragHandlePlacementClass", "ui-drag-handle--", cT),
	U("scrollXClass", "ui-scroll-x--", lT),
	U("scrollYClass", "ui-scroll-y--", lT),
	["hostViewport", (e) => JT(e)],
	U("scrollSnapClass", "ui-scroll-snap--", uT),
	U("inputAppearanceClass", "ui-input--", Kw),
	ET("inputSizeClass", "ui-input--", Jw),
	OT("inputSizeTierClasses", "ui-input--", Jw),
	ET("buttonSizeClass", "ui-button--", qw),
	OT("buttonSizeTierClasses", "ui-button--", qw),
	ET("buttonGroupSizeClass", "ui-button-group--", qw),
	OT("buttonGroupSizeTierClasses", "ui-button-group--", qw),
	["textInputTypeAttribute", (e) => W(e, dT)],
	["inputModeAttribute", (e) => W(e, fT)],
	["colorTextFormatAttribute", (e) => W(e, pT)],
	["colorInputVariantAttribute", (e) => W(e, mT)],
	["themeNameCss", (e) => W(e, Qw)],
	["alignmentCss", (e) => W(e, $w)],
	["overflowCss", (e) => W(e, eT)],
	["layoutLengthCss", (e) => YT(e)],
	["thicknessCss", (e) => QT(e)],
	jT("borderEdgeClass", kT("ui-border--", Gw), (e) => {
		let t = tE(e);
		return t === void 0 ? "" : `ui-border--${t}`;
	}),
	["radiusCss", (e) => nE(e)],
	["gridUnitCss", (e) => rE(e)],
	["pixelsCss", (e) => RE(e)],
	["gridTemplateCss", (e) => iE(e)],
	["colorVariantCss", (e) => ME(e)],
	["themeColorCss", (e) => lE(e)],
	["themeInkCss", (e) => dE(e)],
	["roleInkCss", (e) => fE(e)],
	["themeOnColorCss", (e) => mE(e)],
	["themeGroundCss", (e) => hE(e)],
	["themeColorInlineCss", (e) => uE(e) ? "" : lE(e)],
	["themeColorCanonical", (e) => AE(e)],
	["textAppearanceFontSizeCss", (e) => kE(e, "size")],
	["textAppearanceFontWeightCss", (e) => kE(e, "weight")],
	["textAppearanceLineHeightCss", (e) => kE(e, "lineHeight")],
	["textAppearanceLetterSpacingCss", (e) => kE(e, "letterSpacing")],
	...MT("responsiveLayoutLength", "Css", (e, t) => YT(cg(e, t))),
	...MT("responsiveWidth", "Css", (e, t) => XT(cg(e, t), "horizontal")),
	...MT("responsiveHeight", "Css", (e, t) => XT(cg(e, t), "vertical")),
	...MT("responsiveThickness", "Css", (e, t) => QT(cg(e, t))),
	...MT("responsivePadding", "Css", (e, t) => $T(cg(e, t))),
	...MT("responsiveThicknessHorizontal", "Css", (e, t) => eE(cg(e, t), "horizontal")),
	...MT("responsiveThicknessVertical", "Css", (e, t) => eE(cg(e, t), "vertical")),
	...MT("responsiveRadius", "Css", (e, t) => nE(cg(e, t))),
	...MT("responsivePixels", "Css", (e, t) => zE(cg(e, t))),
	...MT("responsiveAlignment", "Css", (e, t) => BE(cg(e, t), $w)),
	...MT("visibility", "Attribute", (e, t) => VE(e, t)),
	...MT("gridPlacement", "ColumnCss", (e, t) => aE(cg(e, t), "column")),
	...MT("gridPlacement", "RowCss", (e, t) => aE(cg(e, t), "row")),
	...MT("gridPlacement", "ColumnSpanCss", (e, t) => aE(cg(e, t), "columnSpan")),
	...MT("gridPlacement", "RowSpanCss", (e, t) => aE(cg(e, t), "rowSpan")),
	U("imageFitClass", "ui-image-fit--", hT),
	jT("expanderVariantClass", AT(["ui-expander--quiet"]), (e) => W(e, vT) === "quiet" ? "ui-expander--quiet" : ""),
	jT("imageShapeClass", AT(["ui-image--circle"]), (e) => W(e, _T) === "circle" ? "ui-image--circle" : ""),
	["backgroundImageCss", (e) => RT(e)],
	["backgroundImageAttribute", (e) => RT(e).length === 0 ? void 0 : ""],
	["imageFitSizeCss", (e) => W(e, gT)],
	["backgroundImageDimCss", (e) => zT(e)],
	["backgroundImageDimModeAttribute", (e) => W(e, yT) === "vignette" ? "vignette" : void 0],
	["backgroundImageBlurCss", (e) => UT(e) ? `${Number(e)}px` : ""],
	["backgroundImageBlurAttribute", (e) => UT(e) ? "" : void 0],
	["positiveCount", (e) => BT(e)?.toString()],
	["nonNegativeCount", (e) => VT(e, (e) => e >= 0)?.toString()],
	["nonZeroCount", (e) => VT(e, (e) => e !== 0)?.toString()],
	["positiveNumber", (e) => HT(e, (e) => e > 0)?.toString()],
	["nonNegativeNumber", (e) => HT(e, (e) => e >= 0)?.toString()],
	["share", (e) => HT(e, (e) => e >= 0 && e <= 1)?.toString()],
	["positiveFlagAttribute", (e) => BT(e) === void 0 ? void 0 : ""],
	jT("maxLinesClass", AT(["ui-text--max-lines"]), (e) => BT(e) === void 0 ? "" : "ui-text--max-lines"),
	jT("textAreaGrowClass", AT(["ui-text-area--grow"]), (e) => BT(e) === void 0 ? "" : "ui-text-area--grow"),
	U("progressVariantClass", "ui-progress--", bT),
	["progressValueText", (e) => LE(e)],
	["textAreaResizeCss", (e) => W(e, xT)],
	U("flyoutPlacementClass", "ui-flyout--", ST),
	["popupPlacementAttribute", (e) => W(e, ST)],
	["tabMenuEntriesAttribute", (e) => IT(e)],
	["markedDaysAttribute", (e) => LT(e)]
]);
function PT(e) {
	let t = NT.get("surfaceStyleClass");
	return nT.find((n, r) => e.classList.contains(t?.(r) ?? "")) ?? null;
}
var FT = [
	["rename", 1],
	["pin", 2],
	["close", 4],
	["delete", 8]
];
function IT(e) {
	let t = typeof e == "string" ? e.split(",").map((e) => e.trim().toLowerCase()) : null, n = typeof e == "number" ? e : 0, r = FT.filter(([e, r]) => t === null ? (n & r) !== 0 : t.includes(e)).map(([e]) => e);
	return r.length === 0 ? void 0 : r.join(" ");
}
function LT(e) {
	let t = Array.isArray(e) ? e.filter((e) => typeof e == "string" && e.length > 0).map((e) => e.slice(0, 10)) : [];
	return t.length === 0 ? void 0 : [...new Set(t)].sort().join(" ");
}
function RT(e) {
	return Ao(e);
}
function zT(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isNaN(t) ? "" : String(Math.min(1, Math.max(0, t)));
}
function BT(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isInteger(t) && t > 0 ? t : void 0;
}
function VT(e, t) {
	let n = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isInteger(n) && t(n) ? n : void 0;
}
function HT(e, t) {
	let n = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isFinite(n) && t(n) ? n : void 0;
}
function UT(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isFinite(t) && t > 0;
}
var WT = [
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
], GT = new Map(WT.map(([, e, t, n, r]) => [e, [
	t,
	n,
	r
]])), KT = new Map(WT.map(([e, t]) => [e, t])), qT = /* @__PURE__ */ new Map([[eT, /* @__PURE__ */ new Map([["Hidden", "clip"]])], [gT, /* @__PURE__ */ new Map([["Fill", "100% 100%"], ["None", "auto"]])]]);
function W(e, t) {
	return typeof e == "string" ? (t === void 0 ? void 0 : qT.get(t)?.get(e)) ?? Nw.get(e) ?? ra(e) : typeof e == "number" && t !== void 0 ? t[e] ?? String(e) : String(e ?? "");
}
function JT(e) {
	return e == null || W(e, lT) === "disabled" ? void 0 : "parent";
}
function YT(e) {
	if (e == null) return "";
	if (typeof e == "number") return RE(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.kind, r = t.value ?? 0;
	return n === "Auto" || n === 0 ? "" : n === "Absolute" || n === 1 ? RE(r) : n === "Fill" || n === 2 ? "100%" : "";
}
function XT(e, t) {
	if (typeof e != "object" || !e) return YT(e);
	let n = e.kind;
	return n !== "Fill" && n !== 2 ? YT(e) : t === "horizontal" ? "var(--ui-fill-width, 100%)" : "var(--ui-fill-height, 100%)";
}
function ZT(e) {
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
function QT(e) {
	if (e == null) return "";
	let t = ZT(e);
	return t === void 0 ? String(e) : `${t.top}px ${t.right}px ${t.bottom}px ${t.left}px`;
}
function $T(e) {
	let t = e == null ? void 0 : ZT(e);
	return t === void 0 ? "" : `${t.top}px max(${t.right}px, var(--ui-scroll-room-right), var(--ui-scroll-cap)) max(${t.bottom}px, var(--ui-scroll-room-x)) max(${t.left}px, var(--ui-scroll-room-left), var(--ui-scroll-cap))`;
}
function eE(e, t) {
	let n = ZT(e);
	return n === void 0 ? "" : RE(t === "horizontal" ? n.left + n.right : n.top + n.bottom);
}
function tE(e) {
	if (e == null) return;
	if (typeof e == "object" && "base" in e) {
		let t = B.map((t) => cg(e, t)).filter((e) => e != null), n = new Set(t.map((e) => tE(e)));
		return n.size === 0 ? "none" : n.size === 1 ? [...n][0] : void 0;
	}
	let t = ZT(e);
	if (t === void 0) return;
	let { top: n, right: r, bottom: i, left: a } = t;
	return n === 0 && r === 0 && i === 0 && a === 0 ? "none" : n === 0 && r === 0 && i === 0 ? "left" : a === 0 && r === 0 && i === 0 ? "top" : a === 0 && n === 0 && i === 0 ? "right" : a === 0 && n === 0 && r === 0 ? "bottom" : void 0;
}
function nE(e) {
	if (e == null) return "";
	if (typeof e == "number") return RE(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.topLeft ?? 0, r = t.topRight ?? 0, i = t.bottomRight ?? 0, a = t.bottomLeft ?? 0;
	return n === r && n === i && n === a ? RE(n) : `${n}px ${r}px ${i}px ${a}px`;
}
function rE(e) {
	if (e == null) return "";
	if (typeof e == "number") return e <= 0 ? "minmax(0, 1fr)" : `minmax(0, ${e}fr)`;
	if (typeof e != "object") return String(e);
	let t = e, n = t.unit, r = t.value ?? 1, i = t.minValue, a = t.maxValue;
	if (n === "Absolute" || n === 1) return RE(r);
	if (n === "Star" || n === 0) {
		let e = i != null && i > 0 ? `${i}px` : "0";
		return r <= 0 ? `minmax(${e}, 1fr)` : `minmax(${e}, ${r}fr)`;
	}
	return n === "Auto" || n === 2 ? i == null ? a == null ? "auto" : `fit-content(${a}px)` : `minmax(${i}px, auto)` : "";
}
function iE(e) {
	if (e == null) return "";
	if (!Array.isArray(e)) return rE(e);
	if (e.length === 0) return "none";
	if (e.length === 1) return rE(e[0]);
	let t = JSON.stringify(e[0]);
	return e.every((e) => JSON.stringify(e) === t) ? `repeat(${e.length}, ${rE(e[0])})` : e.map((e) => rE(e)).join(" ");
}
function aE(e, t) {
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
function oE(e, t) {
	return typeof e != "object" || !e ? null : e[t] ?? null;
}
function sE(e) {
	return e == null ? "" : e === !0 ? "600" : "400";
}
function cE(e) {
	if (e == null) return "";
	switch (W(e, oT)) {
		case "left": return "inset 2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "right": return "inset -2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "top": return "inset 0 2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "bottom": return "inset 0 -2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		default: return "none";
	}
}
function lE(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	if (jE(e)) return ME(e);
	let t = e, n = ME(t.light), r = ME(t.dark), i = n.length > 0 ? n : r, a = r.length > 0 ? r : n;
	if (i.length > 0 && a.length > 0) return i === a ? i : `light-dark(${i}, ${a})`;
	let o = t.style;
	if (o == null) return "";
	let s = Vw.get(W(o, Pw));
	return s ? `var(${s})` : "";
}
function uE(e) {
	if (typeof e != "object" || !e || jE(e)) return !1;
	let t = e;
	return t.light == null && t.dark == null && t.style != null;
}
function dE(e) {
	if (uE(e)) {
		let t = Hw.get(W(e.style, Pw));
		if (t !== void 0) return `var(${t})`;
	}
	return lE(e);
}
function fE(e) {
	if (typeof e != "object" || !e || jE(e)) return "";
	let t = e;
	return t.light == null && t.dark == null ? dE(e) : "";
}
var pE = /* @__PURE__ */ new Set(["background", "surface"]);
function mE(e) {
	if (typeof e != "object" || !e) return "";
	if (jE(e)) return gE(e) ? "initial" : _E(e);
	let t = e, n = _E(t.light ?? t.dark), r = _E(t.dark ?? t.light);
	if (n.length > 0 && r.length > 0 && gE(t.light ?? t.dark) && gE(t.dark ?? t.light)) return "initial";
	if (n.length > 0 && r.length > 0) return n === r ? n : `light-dark(${n}, ${r})`;
	if (t.style === null || t.style === void 0) return "";
	let i = W(t.style, Pw);
	if (pE.has(i)) return "initial";
	let a = Uw.get(i);
	return a ? `var(${a})` : "";
}
function hE(e) {
	if (typeof e == "object" && e) {
		let t = e;
		if (jE(e) ? gE(e) : gE(t.light ?? t.dark) && gE(t.dark ?? t.light)) return "inherit";
	}
	return lE(e);
}
function gE(e) {
	return NE(e)?.[3] === 0;
}
function _E(e) {
	let t = NE(e);
	return t === void 0 ? "" : kw(t[0], t[1], t[2], t[3]);
}
function vE(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.light != null || t.dark != null) return "";
	let n = t.style;
	return n == null ? "" : `ui-color--${W(n, Pw)}`;
}
function yE(e) {
	let t = CE(e == null ? "" : String(e).trim(), bE + 1);
	return t > 0 && t <= bE ? "compact" : "";
}
var bE = 2, xE = /[\u0300-\uFFFF]/, SE = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function CE(e, t) {
	if (!xE.test(e)) return e.length;
	let n = 0;
	for (let { segment: r } of SE.segment(e)) {
		if (n >= t) break;
		n += wE(r) ? 2 : 1;
	}
	return n;
}
function wE(e) {
	if (e.includes("️")) return !0;
	let t = e.codePointAt(0) ?? 0;
	for (let e = 0; e < TE.length; e += 2) if (t >= TE[e] && t <= TE[e + 1]) return !0;
	return !1;
}
var TE = [
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
function EE(e, t) {
	DE(e, String(t));
}
function DE(e, t) {
	let n = e.querySelector(".ui-badge__text");
	n !== null && (n.textContent = t), e.setAttribute(Ge, yE(t)), e.setAttribute(Ke, "");
}
function OE(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size != null) return "";
	let r = n.role;
	return r == null ? "" : `${t}${W(r, Rw)}`;
}
function kE(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size == null) return "";
	switch (t) {
		case "size": return RE(n.size);
		case "weight": {
			let e = n.weight;
			return e == null ? "" : String(e);
		}
		case "lineHeight": {
			let e = n.lineHeight;
			return e == null ? "" : RE(e);
		}
		case "letterSpacing": {
			let e = n.letterSpacing;
			return e == null ? "" : RE(e);
		}
		default: return "";
	}
}
function AE(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return "";
	let t = e, n = PE(t.style);
	if (n !== null) return `@${n}`;
	let r = t.light ?? t.dark;
	if (r == null) return "";
	if (typeof r.rgb == "number") {
		let e = r.opacity ?? 255, t = `#${Ow(r.rgb >> 16 & 255)}${Ow(r.rgb >> 8 & 255)}${Ow(r.rgb & 255)}`;
		return e === 255 ? t : `${t}${Ow(e)}`;
	}
	let i = FE(r.name);
	return i === null ? "" : `${i}/${IE(r.adjustment) ?? "None"}/${r.factor ?? 0}/${r.opacity ?? 255}`;
}
function jE(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.name !== void 0 || t.rgb !== void 0;
}
function ME(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	let t = NE(e);
	return t === void 0 ? "" : `#${Ow(t[0])}${Ow(t[1])}${Ow(t[2])}${Ow(t[3])}`;
}
function NE(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = typeof t.rgb == "number" ? [
		t.rgb >> 16 & 255,
		t.rgb >> 8 & 255,
		t.rgb & 255
	] : void 0, r = FE(t.name), i = n ?? (r === null ? void 0 : GT.get(r));
	if (!i) return;
	let a = IE(t.adjustment), o = (t.factor ?? 0) / 10, s = t.opacity ?? 255, [c, l, u] = i;
	return a === "Shade" ? (c = Dw(c * (1 - o)), l = Dw(l * (1 - o)), u = Dw(u * (1 - o))) : a === "Tint" && (c = Dw(c + (255 - c) * o), l = Dw(l + (255 - l) * o), u = Dw(u + (255 - u) * o)), [
		c,
		l,
		u,
		s
	];
}
function PE(e) {
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	if (typeof e != "number") return null;
	let t = Pw[e];
	return t === void 0 ? null : t.split("-").map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join("");
}
function FE(e) {
	if (typeof e == "number") return KT.get(e) ?? null;
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	return null;
}
function IE(e) {
	if (typeof e == "number") return CT[e] ?? "None";
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? "None" : t;
	}
	return "None";
}
function LE(e) {
	if (e == null || e === "") return "";
	let t = typeof e == "number" ? e : Number(e);
	return Number.isFinite(t) ? String(t) : "";
}
function RE(e) {
	return `${typeof e == "number" ? e : Number(e ?? 0)}px`;
}
function zE(e) {
	return e == null ? "" : RE(e);
}
function BE(e, t) {
	return e == null ? "" : W(e, t);
}
function VE(e, t) {
	let n = lg(e, t);
	if (n == null) return;
	let r = W(n, tT);
	return r === "visible" ? void 0 : r;
}
//#endregion
//#region src/interactions/search-input-engine.ts
var HE = "data-ui-search-debounce", UE = "data-ui-search-min-length", WE = "data-ui-search-manual", GE = "data-ui-search-answered", KE = "ui-search__input", qE = "ui-select__list", JE = "ui-select__option", YE = 300, XE = "data-ui-search-waiting", ZE = "ui-search__field", QE = /* @__PURE__ */ new WeakMap(), $E = {
	name: "search",
	registration: {
		started: (e) => eD(e.domEvent.target),
		completed: (e) => tD(e.domEvent.target)
	}
};
function eD(e) {
	if (!(e instanceof Element)) return;
	let t = QE.get(e) ?? {
		asked: 0,
		timer: null
	};
	QE.set(e, t), !(t.asked++ > 0) && (nD(e)?.setAttribute("aria-busy", "true"), t.timer = window.setTimeout(() => {
		t.timer = null, e.closest(`.${ZE}`)?.setAttribute(XE, "");
	}, 300));
}
function tD(e) {
	if (!(e instanceof Element)) return;
	let t = QE.get(e);
	t === void 0 || --t.asked > 0 || (QE.delete(e), t.timer !== null && window.clearTimeout(t.timer), nD(e)?.removeAttribute("aria-busy"), e.closest(`.${ZE}`)?.removeAttribute(XE));
}
function nD(e) {
	return e.closest(".ui-select")?.querySelector(`.${qE}`) ?? null;
}
var rD = class {
	root;
	pauses;
	constructor(e = {}) {
		this.root = e.root ?? document, this.pauses = new yC(this.root), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("compositionend", (e) => this.handleInput(e), !0), this.root.addEventListener("keydown", (e) => this.handleEnter(e), !0);
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(KE) || e.isComposing === !0) return;
		let t = e.target;
		aD(t);
		let n = t.getAttribute(HE), r = n === null ? YE : Number(n);
		this.pauses.wait(t, Number.isFinite(r) && r >= 0 ? r : YE, () => this.commit(t));
	}
	handleEnter(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Enter" || e.defaultPrevented || j(e) || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(KE)) return;
		let t = e.target;
		e.preventDefault(), this.pauses.drop(t), this.commit(t, !0);
	}
	commit(e, t = !1) {
		e.dispatchEvent(new Event("change", { bubbles: !0 })), (t || !e.hasAttribute(WE)) && iD(e) && e.dispatchEvent(new Event("search", { bubbles: !0 }));
	}
};
function iD(e) {
	let t = Number(e.getAttribute(UE) ?? 0);
	return !Number.isFinite(t) || e.value.trim().length >= t;
}
function aD(e) {
	if (e.hasAttribute(GE)) return;
	let t = e.closest(`.${Ui}`), n = t?.querySelector(`.${qE}`);
	if (t == null || n == null) return;
	let r = iD(e) ? ov(e.value, e) : [], i = oD(n, (e) => r.length === 0 || cv(sv(dv(e), e), r));
	lD(t, n, r.length > 0 && i === 0);
}
function oD(e, t) {
	let n = null, r = !1, i = 0;
	for (let a of e.children) {
		if (!(a instanceof HTMLElement)) continue;
		if (a.hasAttribute("data-ui-group-header")) {
			n !== null && sD(n, r), n = a, r = !1;
			continue;
		}
		if (!a.classList.contains(JE)) continue;
		let e = t(a);
		sD(a, e), r ||= e, e && i++;
	}
	return n !== null && sD(n, r), i;
}
function sD(e, t) {
	let n = t ? "" : "none";
	e.style.display !== n && (e.style.display = n);
}
function cD(e) {
	let t = e.querySelector(`.${qE}`);
	t !== null && lD(e, t, oD(t, (e) => e.style.display !== "none") === 0);
}
function lD(e, t, n) {
	let r = t.querySelector(`:scope > [${Lt}]`);
	n ? t.toggleAttribute(dt, r !== null || uD(e, t)) : (r?.remove(), t.toggleAttribute(dt, !1));
}
function uD(e, t) {
	let n = e.querySelector(`:scope > template[${Ft}]`);
	if (n === null) return !1;
	let r = n.content.cloneNode(!0).firstElementChild;
	return r !== null && (r.setAttribute(Lt, ""), t.appendChild(r), !0);
}
//#endregion
//#region src/interactions/type-ahead.ts
var dD = 500, fD = class {
	owner = null;
	typed = "";
	last = -Infinity;
	now;
	constructor(e = () => performance.now()) {
		this.now = e;
	}
	next(e) {
		let t = this.now();
		(e.owner !== this.owner || t - this.last > dD) && (this.typed = ""), this.owner = e.owner, this.last = t, this.typed += sv(e.character, e.context);
		let n = Array.from(this.typed), r = n.every((e) => e === n[0]), i = r ? n[0] : this.typed, a = e.entries.length, o = e.current === null ? -1 : e.entries.indexOf(e.current), s = r ? o + 1 : Math.max(o, 0);
		for (let t = 0; t < a; t++) {
			let n = e.entries[(s + t) % a];
			if (sv(e.words(n), e.context).trimStart().startsWith(i)) return n;
		}
		return null;
	}
};
function pD(e) {
	return j(e) || e.metaKey || Array.from(e.key).length !== 1 || !/\S/u.test(e.key) || (e.ctrlKey || e.altKey) && !e.getModifierState("AltGraph") ? null : e.key;
}
//#endregion
//#region src/interactions/select-interaction-engine.ts
var mD = "data-ui-select-value", hD = "data-ui-select-placement", gD = "ui-select--open", _D = "ui-select__trigger-content", vD = "data-ui-select-content", yD = "ui-select__placeholder", bD = "ui-input__affix-icon--prefix", xD = "ui-select__popup", SD = "ui-select__list", CD = "ui-select__option", wD = "ui-select__value-input", TD = "data-ui-select-clear", ED = "data-ui-clearable", DD = "ui-search", OD = "ui-search__input", kD = "data-ui-active", AD = "data-ui-list-keyboard", jD = /* @__PURE__ */ new Set([
	"ArrowDown",
	"ArrowUp",
	"Home",
	"End",
	"PageDown",
	"PageUp"
]), MD = "ui-multi-select", ND = "ui-multi-select__chips", PD = "ui-multi-select__chip", FD = "ui-multi-select__chip-label", ID = "ui-multi-select__chip-remove", LD = "ui-badge-select", RD = "ui-text__badge", zD = "ui-badge", BD = "ui-badge__icon", VD = "ui-badge__text", HD = "ui-badge-style--info ui-text-type--overline", UD = "ui-text-type--overline", WD = "data-ui-select-chip", GD = "data-ui-select-chips", KD = "data-ui-select-max", qD = "data-ui-select-free-text", JD = "ui-multi-select__entry", YD = "data-ui-select-tag-entry", XD = [
	mD,
	gi,
	KD
], ZD = ["class", y], QD = [...ZD, "style"];
function $D(e) {
	return e === null || A(e) || O(e);
}
function eO(e) {
	return e.classList.contains(MD);
}
function tO(e) {
	return e.classList.contains(DD);
}
function nO(e) {
	return tO(e) ? e.querySelector(`.${OD}`) : null;
}
function rO(e) {
	return e.hasAttribute(qD) ? e.querySelector(`:scope > .${Li} .${JD}`) : null;
}
function iO(e) {
	return nO(e) ?? rO(e);
}
function aO(e) {
	return rO(e) ?? e.querySelector(".ui-select__trigger");
}
function oO(e) {
	let t = e.target instanceof HTMLInputElement && e.target.classList.contains(JD) ? e.target : null, n = t?.closest(".ui-select") ?? null;
	return t === null || n === null ? null : {
		entry: t,
		select: n
	};
}
function sO(e) {
	return Hd(e, `.${xD} .${CD}`, `.${Ui}`);
}
function cO(e) {
	let t = sO(e).filter((e) => !k(e));
	return t.find((e) => e === document.activeElement) ?? t.find((e) => e.hasAttribute(kD)) ?? null;
}
function lO(e) {
	for (let t of Hd(e, `.${SD}`, `.${Ui}`)) {
		let e = t.querySelector(`:scope > .${CD}[${kD}]:not([${li}])`) !== null;
		t.hasAttribute(AD) !== e && t.toggleAttribute(AD, e);
	}
}
function uO(e) {
	return e === null ? null : dv(e);
}
function dO(e) {
	for (let t of [e, ...e.querySelectorAll("*")]) {
		t.removeAttribute(ie), t.removeAttribute(y), t.removeAttribute(oe), t.removeAttribute(ae);
		for (let e of t.getAttributeNames()) e.startsWith("data-ui-bind-") && t.removeAttribute(e);
	}
}
var fO = class {
	root;
	popups = new Qv({
		show: ({ owner: e }) => e.classList.add(gD),
		hide: ({ owner: e }) => {
			e.classList.remove(gD), this.markActive(e, null);
			let t = e.querySelector(`.${xD}`);
			t !== null && (t.style.minHeight = "");
		},
		closesOnTab: !0,
		sheetOnPhone: ({ owner: e }) => iO(e) === null
	});
	typeAhead = new fD();
	drawnKeys = /* @__PURE__ */ new WeakMap();
	validation;
	refusedEntries = /* @__PURE__ */ new WeakSet();
	optionWatch;
	watched = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation;
		let t = (e) => {
			let t = /* @__PURE__ */ new Set();
			for (let n of e) m_(n) || kO(n, t);
			for (let e of t) this.sync(e);
		};
		this.optionWatch = this.root instanceof Node ? new MutationObserver(t) : null, this.root instanceof Node && new MutationObserver(t).observe(this.root, {
			attributes: !0,
			attributeFilter: XD,
			childList: !0,
			subtree: !0
		});
		for (let e of this.root.querySelectorAll(`.${Ui}`)) this.sync(e);
		this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && (e.target.closest(`[${TD}], .${ID}`) !== null || vO(e.target)) && e.preventDefault();
		}, !0), window.addEventListener("input", (e) => this.handleEntryEdit(e), !0), window.addEventListener("compositionend", (e) => this.handleEntryEdit(e), !0), window.addEventListener("change", (e) => this.holdEntryDraft(e), !0), window.addEventListener("keydown", (e) => this.handleEntryEscape(e), !0), this.root.addEventListener("paste", (e) => this.handleEntryPaste(e), !0);
	}
	handleEntryEdit(e) {
		let t = this.holdEntryDraft(e);
		if (t === null || e.isComposing === !0) return;
		let { entry: n, select: r } = t;
		if ($D(r)) return;
		this.releaseRefusal(r);
		let i = Bd(n.value);
		i.tags.length > 0 ? this.enterTyped(r, n, i.tags, i.rest) : this.suggest(r, n);
	}
	holdEntryDraft(e) {
		let t = oO(e);
		return t === null || this.root instanceof Node && !this.root.contains(t.select) ? null : (e.stopImmediatePropagation(), t);
	}
	handleEntryEscape(e) {
		let t = e instanceof KeyboardEvent && e.key === "Escape" && !e.defaultPrevented && !j(e) ? oO(e) : null;
		t !== null && this.openSelect === t.select && t.select.getAttribute(YD) === "first-suggestion" && sO(t.select).some((e) => e.hasAttribute(kD)) && (e.preventDefault(), this.markActive(t.select, null));
	}
	handleEntryPaste(e) {
		let t = oO(e), n = e.clipboardData?.getData("text") ?? "";
		if (t === null || $D(t.select) || !Rd(n)) return;
		let { entry: r, select: i } = t, a = r.selectionStart ?? r.value.length, o = r.selectionEnd ?? a;
		e.preventDefault(), this.releaseRefusal(i), this.enterTyped(i, r, zd(r.value.slice(0, a) + n + r.value.slice(o)), "");
	}
	enterTyped(e, t, n, r) {
		let i = Md(e.getAttribute(gi)), a = Nd(e.getAttribute(KD)), o = Vd(i, n.map((t) => ({
			text: t,
			key: yO(e, t) ?? t
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
		aD(t);
		let n = t.value.trim().length > 0, r = n ? mO(e) : [], i = r.find((e) => e.getAttribute("aria-selected") !== "true") ?? null;
		this.openSelect === e ? r.length > 0 || !n ? this.popups.reposition(e) : this.close() : r.length > 0 && this.toggle(e, !0), this.openSelect === e && e.getAttribute(YD) === "first-suggestion" && (this.markActive(e, i), i !== null && gO(e, i));
	}
	get openSelect() {
		return this.popups.current;
	}
	sync(e) {
		if (this.watchOptions(e), lO(e), eO(e)) {
			this.syncMultiple(e);
			return;
		}
		let t = e.getAttribute(mD);
		this.decorateOptions(e);
		let n = t === null ? null : sO(e).find((e) => e.getAttribute("data-ui-key") === t) ?? null, r = this.renderTriggerContent(e, n, t), i = e.querySelector(`.${yD}`);
		i !== null && (i.style.display = r ? "none" : "");
		for (let n of sO(e)) n.setAttribute("aria-selected", t !== null && n.dataset.uiKey === t ? "true" : "false");
		let a = e.querySelector(`.${wD}`);
		a !== null && a.value !== (t ?? "") && (a.value = t ?? ""), cD(e);
	}
	watchOptions(e) {
		if (this.optionWatch === null || this.watched.has(e)) return;
		this.watched.add(e);
		let t = e.classList.contains(LD) ? QD : ZD;
		this.optionWatch.observe(e, {
			attributes: !0,
			attributeFilter: t,
			characterData: !0,
			subtree: !0
		});
	}
	syncMultiple(e) {
		let t = Md(e.getAttribute(gi)), n = new Set(t), r = Pd(t, Nd(e.getAttribute(KD)));
		this.decorateOptions(e, (e) => r && !n.has(e.dataset.uiKey ?? ""));
		let i = sO(e), a = new Map(i.map((e) => [e.dataset.uiKey ?? "", e])), o = rO(e), s = o === null ? t.filter((e) => a.has(e)) : t, c = e.classList.contains(LD);
		SO(e, s.map((e) => {
			let t = a.get(e) ?? null, n = c ? bO(t) : void 0;
			return {
				key: e,
				label: xO(t, e, n ?? null),
				badge: n
			};
		})), o !== null && o.readOnly !== $D(e) && (o.readOnly = $D(e));
		let l = e.querySelector(`.${yD}`);
		l !== null && (l.style.display = s.length > 0 ? "none" : "");
		for (let e of i) e.setAttribute("aria-selected", n.has(e.dataset.uiKey ?? "") ? "true" : "false");
		let u = e.querySelector(`.${wD}`), d = JSON.stringify(t);
		u !== null && u.getAttribute("data-ui-selected-keys") !== d && u.setAttribute(gi, d), cD(e);
	}
	renderTriggerContent(e, t, n) {
		let r = e.querySelector(`.${Li}`);
		if (r === null) return t !== null;
		let i = r.querySelector(`:scope > .${_D}`), a = i?.getAttribute(vD) ?? null;
		if (i !== null && a !== null && (i.removeAttribute(vD), this.drawnKeys.set(e, a)), t === null) return i !== null && n !== null && tO(e) && this.drawnKeys.get(e) === n ? !0 : (i?.remove(), this.drawnKeys.delete(e), !1);
		let o = t.getAttribute(y);
		if (o === null ? this.drawnKeys.delete(e) : this.drawnKeys.set(e, o), i !== null && o !== null && a === o) return !0;
		if (i === null) {
			i = document.createElement("span"), i.className = _D;
			let e = r.querySelector(`:scope > .${bD}`);
			e === null ? r.prepend(i) : e.after(i);
		}
		i.style.display = "inline-flex";
		let s = t.cloneNode(!0);
		return dO(s), __(s), i.replaceChildren(...s.childNodes), !0;
	}
	decorateOptions(e, t = () => !1) {
		for (let n of sO(e)) {
			n.hasAttribute("role") || n.setAttribute("role", "option");
			let e = k(n), r = e || t(n) ? "true" : "false";
			n.getAttribute("aria-disabled") !== r && n.setAttribute("aria-disabled", r), (e ? n.tabIndex !== -1 : !n.hasAttribute("tabindex")) && (n.tabIndex = -1);
		}
	}
	handlePointerMove(e) {
		let t = this.openSelect, n = t === null || !(e.target instanceof Element) ? null : e.target.closest(`.${CD}`);
		t === null || n === null || n.hasAttribute(kD) || k(n) || O(n) || n.closest(".ui-select") !== t || (iO(t) === null && (N(sO(t).filter((e) => !k(e)), n), qp(n)), this.markActive(t, n, !0));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${ID}`);
		if (t !== null) {
			let n = t.closest(`.${Ui}`);
			n !== null && (e.preventDefault(), e.stopPropagation(), $D(n) || this.removeChosen(n, t.closest(`.${PD}`)?.getAttribute(WD) ?? null));
			return;
		}
		let n = e.target.closest(`[${TD}]`);
		if (n !== null) {
			let t = n.closest(`.${Ui}`);
			t !== null && (e.preventDefault(), e.stopPropagation(), $D(t) || (this.clearValue(t), pO(t)));
			return;
		}
		let r = e.target.closest(`.${Li}`);
		if (r !== null) {
			let t = r.closest(`.${Ui}`);
			if ($D(t)) return;
			e.preventDefault();
			let n = t === null ? null : rO(t);
			t !== null && n !== null ? this.pressEntryBox(t, n, e.target === n) : this.toggle(t);
			return;
		}
		let i = e.target.closest(`.${CD}`);
		if (i === null) return;
		let a = i.closest(`.${Ui}`);
		a !== null && this.choose(a, i);
	}
	pressEntryBox(e, t, n) {
		document.activeElement !== t && t.focus(), !(sO(e).length === 0 || n && this.openSelect === e) && this.toggle(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || j(e) || (this.openSelect !== null && lO(this.openSelect), this.handleEntryKey(e) || this.handleChipKey(e)) || this.openSelect !== null && e.target instanceof Node && this.openSelect.contains(e.target) && this.handleOpenListKey(e, this.openSelect) || this.handleClearKey(e) || (e.key === "ArrowDown" || e.key === "ArrowUp") && M(e, { alt: e.key === "ArrowDown" }) && this.handleClosedArrow(e) || this.handleTypeAhead(e) || this.handleMultipleTriggerKey(e) || e.key !== "Enter" && e.key !== " " || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${CD}`) ?? this.markedOption(e);
		if (t === null) return;
		let n = t.closest(`.${Ui}`);
		n !== null && (e.preventDefault(), this.choose(n, t));
	}
	handleOpenListKey(e, t) {
		if (e.key === "ArrowUp" && e.altKey && M(e, { alt: !0 })) {
			e.preventDefault();
			let n = cO(t);
			return n !== null && !eO(t) ? this.choose(t, n) : this.close(), !0;
		}
		return !jD.has(e.key) || !M(e) || (e.key === "Home" || e.key === "End") && ad(e.target) ? !1 : (e.preventDefault(), this.moveCurrent(t, e.key), !0);
	}
	handleEntryKey(e) {
		let t = oO(e);
		if (t === null) return !1;
		let { entry: n, select: r } = t;
		if ($D(r)) return !1;
		switch (e.key) {
			case "ArrowLeft": return n.selectionStart === 0 && n.selectionEnd === 0 && this.focusChip(e, r, -1);
			case "ArrowDown":
			case "ArrowUp": return e.preventDefault(), this.openSelect === r ? this.moveCurrent(r, e.key) : this.openSuggestions(r, n, e.key === "ArrowDown"), !0;
			case "Enter": {
				let t = this.openSelect === r ? mO(r).find((e) => e.hasAttribute(kD)) : void 0;
				return t === void 0 ? (e.preventDefault(), n.value.trim().length === 0 ? (this.pressEntryBox(r, n, !1), !0) : (this.releaseRefusal(r), this.enterTyped(r, n, zd(n.value), ""), !0)) : (e.preventDefault(), this.choose(r, t), !0);
			}
			case ",": return e.preventDefault(), this.releaseRefusal(r), this.enterTyped(r, n, zd(n.value), ""), !0;
			case "Backspace": {
				if (n.value.length > 0) return !1;
				let t = r.querySelectorAll(`.${ND} > .${PD}`);
				return t.length !== 0 && (e.preventDefault(), this.removeChosen(r, t[t.length - 1].getAttribute(WD)), !0);
			}
			default: return !1;
		}
	}
	focusChip(e, t, n, r = null) {
		let i = _O(t);
		if (i.length === 0) return !1;
		let a = i[(r === null ? i.length : i.findIndex((e) => e.contains(r))) + n]?.querySelector(`.${ID}`) ?? (n === 1 ? aO(t) : null);
		return e.preventDefault(), a === null || (a.focus(), a instanceof HTMLInputElement && a.setSelectionRange(0, 0)), !0;
	}
	openSuggestions(e, t, n) {
		aD(t);
		let r = mO(e), i = (n ? r[0] : r[r.length - 1]) ?? null;
		i !== null && this.toggle(e, !0, i);
	}
	handleChipKey(e) {
		let t = e.target instanceof HTMLElement && e.target.classList.contains(ID) ? e.target : null, n = t?.closest(".ui-select") ?? null;
		if (t === null || n === null || !eO(n)) return !1;
		switch (e.key) {
			case "ArrowLeft": return this.focusChip(e, n, -1, t);
			case "ArrowRight": return this.focusChip(e, n, 1, t);
			case "Backspace":
			case "Delete": {
				if (e.preventDefault(), $D(n)) return !0;
				let r = _O(n), i = r.findIndex((e) => e.contains(t)), a = (r[i + 1] ?? r[i - 1])?.getAttribute(WD) ?? null;
				this.removeChosen(n, r[i]?.getAttribute(WD) ?? null);
				let o = a === null ? null : _O(n).find((e) => e.getAttribute(WD) === a) ?? null;
				return o !== null && o.querySelector(`.${ID}`)?.focus(), !0;
			}
			default: return !1;
		}
	}
	handleClosedArrow(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || t === this.openSelect || $D(t)) return !1;
		e.preventDefault();
		let n = nO(t);
		n !== null && aD(n);
		let r = mO(t), i = r.find((e) => e.getAttribute("aria-selected") === "true") ?? (e.key === "ArrowDown" ? r[0] : r[r.length - 1]) ?? null;
		return this.toggle(t, !1, i), !0;
	}
	handleTypeAhead(e) {
		let t = pD(e), n = e.target instanceof HTMLElement ? e.target : null;
		if (t === null || n === null || !(n.classList.contains("ui-select__trigger") || n.classList.contains(CD))) return !1;
		let r = n.closest(`.${Ui}`), i = r !== null && r === this.openSelect;
		if (r === null || $D(r) || !i && !n.classList.contains("ui-select__trigger")) return !1;
		let a = nO(r);
		if (a !== null) return !i && (e.preventDefault(), this.typeIntoSearch(r, a, t), !0);
		e.preventDefault();
		let o = mO(r), s = i ? o.find((e) => e === document.activeElement) ?? o.find((e) => e.hasAttribute(kD)) ?? null : o.find((e) => e.getAttribute("aria-selected") === "true") ?? null, c = this.typeAhead.next({
			owner: r,
			character: t,
			entries: o,
			current: s,
			words: (e) => uO(e) ?? "",
			context: r
		});
		return c === null ? !0 : i ? (N(sO(r).filter((e) => !k(e)), c), gO(r, c), R(c), this.markActive(r, c), !0) : (this.toggle(r, !1, c), !0);
	}
	typeIntoSearch(e, t, n) {
		this.toggle(e, !0), this.openSelect === e && (t.value = n, t.setSelectionRange(n.length, n.length), t.dispatchEvent(new Event("input", { bubbles: !0 })));
	}
	handleClearKey(e) {
		if (e.key !== "Delete" && e.key !== "Backspace" || !M(e) || !(e.target instanceof HTMLElement)) return !1;
		let t = e.target.closest(`.${Ui}`);
		return t === null || t === this.openSelect || !t.hasAttribute(ED) || $D(t) || e.target !== aO(t) || e.key === "Backspace" && eO(t) || (rO(t)?.value ?? "") !== "" ? !1 : (e.preventDefault(), this.clearValue(t), !0);
	}
	handleMultipleTriggerKey(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || !eO(t) || $D(t)) return !1;
		switch (e.key) {
			case "Enter":
			case " ": return e.preventDefault(), this.toggle(t), !0;
			case "ArrowLeft": return this.focusChip(e, t, -1);
			case "Backspace": {
				let n = t.querySelectorAll(`.${ND} > .${PD}`);
				return n.length !== 0 && (e.preventDefault(), this.removeChosen(t, n[n.length - 1].getAttribute(WD)), !0);
			}
			default: return !1;
		}
	}
	markedOption(e) {
		let t = this.openSelect;
		return e.key !== "Enter" || t === null || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(OD) || !t.contains(e.target) ? null : mO(t).find((e) => e.hasAttribute(kD)) ?? null;
	}
	toggle(e, t = !1, n = null) {
		if (e === null) return;
		if (this.openSelect === e) {
			this.close();
			return;
		}
		this.close();
		let r = iO(e), i = rO(e);
		r !== null && !t && aD(r), cD(e);
		let a = e.querySelector(`.${Li}`), o = e.querySelector(`.${xD}`), s = e.querySelector(`.${SD}`) ?? o, c = e.getAttribute(hD);
		if (a === null || o === null || s === null) return;
		let l = aa(s, "ui-select-list");
		i === null && a.setAttribute("aria-controls", l), r?.setAttribute("aria-controls", l), this.popups.open({
			owner: e,
			popup: o,
			anchor: a,
			placement: {
				placement: c !== null && fg(c) ? c : "bottom-start",
				minAnchorWidth: !0
			},
			openers: i === null ? r === null ? [a] : [a, r] : [i],
			returnFocus: () => i ?? a
		}) && (r === null ? this.initializeFocus(e, n) : (i === null ? this.initializeSearch(e, r, n, t) : this.initializeEntry(e, n), AO(o)));
	}
	close() {
		this.popups.close();
	}
	initializeFocus(e, t) {
		let n = mO(e);
		if (n.length === 0) return;
		let r = t ?? n.find((e) => e.getAttribute("aria-selected") === "true");
		if (r === void 0 && Bp()) {
			N(n, null), this.markActive(e, null), pO(e);
			return;
		}
		let i = r ?? n[0];
		N(n, i), this.markActive(e, i, Bp()), gO(e, i), R(i);
	}
	initializeSearch(e, t, n, r) {
		let i = sO(e), a = mO(e), o = (r ? void 0 : n ?? a.find((e) => e.getAttribute("aria-selected") === "true")) ?? (r || Bp() ? null : a[0] ?? null);
		N(i, null), this.markActive(e, o, Bp()), o !== null && gO(e, o), !Vp() && (R(t), t.select());
	}
	initializeEntry(e, t) {
		N(sO(e), null), this.markActive(e, t), t !== null && gO(e, t);
	}
	moveCurrent(e, t) {
		let n = sO(e).filter((e) => !k(e)), r = op(t, n, cO(e), "vertical");
		r !== null && (iO(e) === null ? Cd(n, r) : gO(e, r), this.markActive(e, r));
	}
	markActive(e, t, n = !1) {
		for (let r of sO(e)) r === t ? r.setAttribute(kD, "") : r.hasAttribute(kD) && r.removeAttribute(kD), Hp(r, r === t && n);
		lO(e);
		let r = iO(e);
		r !== null && (t === null ? r.removeAttribute("aria-activedescendant") : r.setAttribute("aria-activedescendant", aa(t, "ui-select-option")));
	}
	choose(e, t) {
		let n = t.dataset.uiKey;
		if (n === void 0 || k(t) || $D(e)) return;
		if (eO(e)) {
			let r = Fd(Md(e.getAttribute(gi)), n, Nd(e.getAttribute(KD)));
			this.markActive(e, t, Bp()), r !== null && this.writeChosen(e, r);
			let i = rO(e);
			i !== null && i.value.length > 0 && (i.value = "", this.releaseRefusal(e), this.suggest(e, i));
			return;
		}
		if (e.getAttribute(mD) === n) {
			this.close();
			return;
		}
		e.setAttribute(mD, n), this.sync(e);
		let r = e.querySelector(`.${wD}`);
		r !== null && (r.value = n, r.dispatchEvent(new Event("change", { bubbles: !0 }))), this.close();
	}
	removeChosen(e, t) {
		let n = t === null ? null : Id(Md(e.getAttribute(gi)), t);
		if (n === null) return;
		let r = document.activeElement instanceof HTMLElement && document.activeElement.closest(`.${PD}`) !== null;
		this.writeChosen(e, n), (r || document.activeElement === document.body) && aO(e)?.focus();
	}
	writeChosen(e, t) {
		t.length === 0 ? e.removeAttribute(gi) : e.setAttribute(gi, JSON.stringify(t)), this.sync(e), this.popups.reposition(e), e.querySelector(`.${wD}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	clearValue(e) {
		if (eO(e)) {
			e.hasAttribute("data-ui-selected-keys") && this.writeChosen(e, []);
			return;
		}
		if (!e.hasAttribute(mD)) return;
		e.removeAttribute(mD), this.sync(e);
		let t = e.querySelector(`.${wD}`);
		t !== null && (t.value = "", t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
};
function pO(e) {
	let t = e.querySelector(`.${Li}`), n = aO(e);
	t !== null && n !== null && !t.contains(document.activeElement) && R(n);
}
function mO(e) {
	return sO(e).filter((e) => hO(e) && !k(e) && !O(e));
}
function hO(e) {
	return e.style.display !== "none" && !e.classList.contains("ui-hidden");
}
function gO(e, t) {
	let n = e.querySelector(`.${SD}`);
	if (n === null) return;
	let r = n.getBoundingClientRect(), i = t.getBoundingClientRect(), a = getComputedStyle(n), o = r.top + (Number.parseFloat(a.borderTopWidth) || 0), s = o + (Number.parseFloat(a.paddingTop) || 0), c = o + n.clientHeight - (Number.parseFloat(a.paddingBottom) || 0);
	i.top < s ? n.scrollTop -= s - i.top : i.bottom > c && (n.scrollTop += i.bottom - c);
}
function _O(e) {
	return [...e.querySelectorAll(`.${ND} > .${PD}`)];
}
function vO(e) {
	let t = e.closest(".ui-select__trigger")?.closest(".ui-select") ?? null;
	return t !== null && rO(t) !== null && !e.classList.contains(JD);
}
function yO(e, t) {
	let n = t.trim().toLocaleLowerCase();
	for (let t of sO(e)) {
		let e = t.dataset.uiKey;
		if (e !== void 0 && !k(t) && (e.toLocaleLowerCase() === n || uO(t)?.trim().toLocaleLowerCase() === n)) return e;
	}
	return null;
}
function bO(e) {
	return e?.querySelector(`.${RD}`) ?? null;
}
function xO(e, t, n = null) {
	let r = ((n?.hasAttribute("data-ui-badge-text") === !0 ? n.querySelector(`.${VD}`)?.textContent ?? null : null) ?? uO(e))?.trim() ?? "";
	return r.length > 0 ? r : t;
}
function SO(e, t) {
	let n = e.querySelector(`.${ND}`);
	if (n === null) return;
	n.hasAttribute(GD) !== t.length > 0 && n.toggleAttribute(GD, t.length > 0);
	let r = [...n.querySelectorAll(`:scope > .${PD}`)];
	if (!(r.length === t.length && r.every((e, n) => e.getAttribute(WD) === t[n].key && e.querySelector(`.${FD}`)?.textContent === t[n].label && (t[n].badge === void 0 || DO(e) === DO(t[n].badge ?? EO()))))) {
		for (let e of r) e.remove();
		n.prepend(...t.map(CO));
	}
}
function CO(e) {
	let t = document.createElement("button"), n = e.badge === void 0 ? wO(e.label) : TO(e.label, e.badge);
	return n.classList.add(PD), n.setAttribute(WD, e.key), t.className = ID, t.type = "button", t.tabIndex = -1, D.write(t, "aria-label", "ui.select.remove", { label: e.label }), n.append(t), n;
}
function wO(e) {
	let t = document.createElement("span"), n = document.createElement("span");
	return n.className = FD, n.textContent = e, t.append(n), t;
}
function TO(e, t) {
	let n = t === null ? EO() : t.cloneNode(!0);
	dO(n), n.classList.remove(RD);
	let r = n.querySelector(`:scope > .${VD}`);
	return r?.classList.add(FD), r !== null && !n.hasAttribute("data-ui-badge-text") && DE(n, e), n;
}
function EO() {
	let e = document.createElement("span"), t = document.createElement("span"), n = document.createElement("span");
	return e.className = `${zD} ${HD}`, t.className = `${BD} ui-icon`, n.className = `${VD} ${UD}`, e.append(t, n), e;
}
function DO(e) {
	let t = e.querySelector(`:scope > .${BD}`);
	return `${OO(e)}|${t === null ? "" : OO(t)}`;
}
function OO(e) {
	return `${[...e.classList].filter((e) => e !== PD && e !== RD).sort().join(" ")};${e.getAttribute("style") ?? ""};${e.hasAttribute(qe)}`;
}
function kO(e, t) {
	if (e.type === "childList") {
		for (let n of e.addedNodes) if (n instanceof HTMLElement) {
			n.classList.contains("ui-select") && t.add(n);
			for (let e of n.querySelectorAll(`.${Ui}`)) t.add(e);
		}
	}
	if (e.type === "attributes" && (e.attributeName === mD || e.attributeName === "data-ui-selected-keys" || e.attributeName === KD)) {
		e.target instanceof HTMLElement && e.target.classList.contains("ui-select") && t.add(e.target);
		return;
	}
	let n = e.target instanceof HTMLElement ? e.target : e.target.parentElement;
	if (e.attributeName === "style" && n?.classList.contains(zD) !== !0) return;
	let r = n?.closest(`.${xD}`)?.closest(`.${Ui}`);
	r != null && t.add(r);
}
function AO(e) {
	e.dataset.uiPlacement?.startsWith("top") === !0 && (e.style.minHeight = `${e.offsetHeight}px`);
}
//#endregion
//#region src/interactions/commit-gate.ts
var jO = class {
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
		ad(t) && this.root.contains(t) && (this.field = t, this.committed = t.value);
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
}, MO = "textarea.ui-text-area__field", NO = "data-ui-text-area-grow";
function PO() {
	return typeof CSS < "u" && CSS.supports("field-sizing", "content");
}
var FO = class {
	root;
	widths = /* @__PURE__ */ new WeakMap();
	observer;
	constructor(e = {}) {
		this.root = e.root ?? document, this.observer = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null, this.root.addEventListener("input", (e) => {
			e.target instanceof HTMLTextAreaElement && e.target.matches(MO) && this.fit(e.target);
		}, !0), this.fitAll(this.root.querySelectorAll(MO)), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.fitAll(Ya(e.components, MO));
		}), V(this.root, MO, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [NO]
		}, (e) => {
			this.fitAll(Ya(e, MO));
		});
	}
	fitAll(e) {
		for (let t of e) this.fit(t);
	}
	fit(e) {
		if (!e.hasAttribute(NO)) {
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
function IO(e) {
	let t = LO(e.getAttribute("min"), 0), n = LO(e.getAttribute("max"), 100), r = e.getAttribute("step");
	return {
		min: t,
		max: Math.max(t, n),
		step: r === "any" ? 0 : Math.max(0, LO(r, 1))
	};
}
function LO(e, t) {
	let n = e === null || e.trim().length === 0 ? NaN : Number(e);
	return Number.isFinite(n) ? n : t;
}
function RO(e, t, n, r) {
	let i = (n ? e.height : e.width) - r;
	if (i <= 0) return 0;
	let a = n ? e.top + e.height - t.y : t.x - e.left;
	return Math.min(1, Math.max(0, (a - r / 2) / i));
}
function zO(e, t) {
	return BO(t.min + e * (t.max - t.min), t);
}
function BO(e, t) {
	let n = Math.min(t.max, Math.max(t.min, e));
	if (t.step <= 0) return n;
	let r = Math.round((n - t.min) / t.step);
	return t.min + r * t.step > t.max && r--, VO(t.min + r * t.step, t);
}
function VO(e, t) {
	return Number(e.toFixed(Math.min(20, Math.max(HO(t.step), HO(t.min)))));
}
function HO(e) {
	let t = String(e), n = t.indexOf("e-");
	if (n >= 0) return Number(t.slice(n + 2));
	let r = t.indexOf(".");
	return r < 0 ? 0 : t.length - r - 1;
}
function UO(e, t, n) {
	return t === n ? e < t ? "start" : e > t ? "end" : null : Math.abs(e - t) < Math.abs(e - n) ? "start" : "end";
}
function WO(e, t, n, r, i) {
	let a = Math.max(0, r);
	if (t === "start" ? e <= n - a : e >= n + a) return e;
	let o = t === "start" ? n - a : n + a;
	if (i.step <= 0) return GO(o, i);
	let s = (o - i.min) / i.step;
	return GO(VO(i.min + (t === "start" ? Math.floor(s + 1e-9) : Math.ceil(s - 1e-9)) * i.step, i), i);
}
function GO(e, t) {
	return Math.min(t.max, Math.max(t.min, e));
}
//#endregion
//#region src/interactions/range-value-engine.ts
var KO = "ui-slider__input", qO = "ui-slider__input--end", JO = "ui-slider__input--held", YO = "ui-slider__value", XO = "ui-slider__bubble", ZO = "ui-slider__track", QO = "ui-slider__thumb-anchor", $O = "ui-slider", ek = "ui-slider--range", tk = "ui-orientation--vertical", nk = "--ui-slider-fraction", rk = "--ui-slider-end-fraction", ik = 6, ak = "Value", ok = "EndValue", sk = /* @__PURE__ */ new Set([
	"Value",
	"EndValue",
	"Min",
	"Max"
]), ck = class {
	options;
	root;
	settled = /* @__PURE__ */ new WeakMap();
	pressedFrom = /* @__PURE__ */ new WeakMap();
	cancelled = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("pointerdown", (e) => {
			this.notePress(e.target), this.placeBubble(e.target);
		}, !0), this.root.addEventListener("pointercancel", (e) => this.takeBackPress(e.target), !0), (this.root === document ? window : this.root).addEventListener("change", (e) => this.refuseCancelledChange(e), !0), this.root.addEventListener("focusin", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusout", (e) => this.releaseBubble(e.target), !0), new fv({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${ek} .${ZO}`),
			begin: (e, t) => this.beginBandDrag(e, t),
			move: (e, t, n) => this.moveBandDrag(e, n),
			end: (e, t) => this.endBandDrag(t),
			cancel: (e, t) => this.putBandBack(t),
			takenBack: (e, t) => this.putBandBack(t)
		}), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			if (sk.has(e.propertyName)) for (let t of Ya(e.components, `.${KO}`)) this.settled.set(t, t.value), this.writeReadings(t), e.propertyName === (uk(t) ? ok : ak) && this.reportClamped(t, e.value);
		});
	}
	notePress(e) {
		let t = lk(e);
		t !== null && (this.cancelled.delete(t), this.pressedFrom.set(t, t.value));
	}
	takeBackPress(e) {
		let t = lk(e), n = t === null ? void 0 : this.pressedFrom.get(t);
		t !== null && n !== void 0 && (this.pressedFrom.delete(t), t.value !== n && (t.value = n, this.cancelled.add(t), this.settled.set(t, n), this.writeReadings(t)));
	}
	refuseCancelledChange(e) {
		let t = lk(e.target);
		t !== null && this.cancelled.has(t) && (this.cancelled.delete(t), e.stopImmediatePropagation());
	}
	reportClamped(e, t) {
		t == null || e.value === String(t) || pk(e) || e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(KO)) return;
		let t = e.target;
		if (this.cancelled.delete(t), pk(t)) {
			t.value = this.settled.get(t) ?? t.defaultValue;
			return;
		}
		let n = dk(t);
		if (n !== null) {
			let e = fk(t, Number(t.value), n);
			e !== t.value && (t.value = e, e === (this.settled.get(t) ?? t.defaultValue) && this.cancelled.add(t));
		}
		this.settled.set(t, t.value), this.writeReadings(t);
	}
	beginBandDrag(e, t) {
		let n = e.querySelector(`.${KO}:not(.${qO})`), r = e.querySelector(`.${qO}`);
		if (n === null || r === null) return null;
		let i = zO(RO(e.getBoundingClientRect(), t, mk(e), hk(e)), IO(n)), a = UO(i, Number(n.value), Number(r.value));
		if (pk(n)) return R(a === "end" ? r : n), null;
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
		let n = e.start.closest(`.${ZO}`);
		if (n === null) return;
		let r = zO(RO(n.getBoundingClientRect(), t, mk(n), hk(n)), IO(e.start));
		if (e.held === null) {
			if (r === e.pressed) return;
			this.holdHandle(e, r < e.pressed ? "start" : "end", r);
		} else this.moveHandle(e.held, r);
	}
	holdHandle(e, t, n) {
		let r = t === "start" ? e.start : e.end;
		e.held = r, r.classList.add(JO), R(r), this.moveHandle(r, n), this.placeBubble(r);
	}
	moveHandle(e, t) {
		let n = dk(e), r = n === null ? String(t) : fk(e, t, n);
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
		e.held?.classList.remove(JO), e.held !== null && this.writeReadings(e.held);
	}
	placeBubble(e) {
		let t = gk(e);
		t !== null && Cg(t.anchor, t.bubble, {
			placement: t.vertical ? "left" : "top",
			gap: ik
		});
	}
	releaseBubble(e) {
		Ig(gk(e)?.bubble);
	}
	writeReadings(e) {
		let t = uk(e), n = e.closest(`.${ZO}`)?.parentElement ?? e.parentElement, r = t ? `.${YO}--end, .${XO}--end` : `.${YO}:not(.${YO}--end), .${XO}:not(.${XO}--end)`;
		for (let t of n?.querySelectorAll(r) ?? []) t.textContent = e.value;
		e.closest(`.${ZO}`)?.style.setProperty(t ? rk : nk, String(_k(e))), e.matches(`:active, :focus-visible, .${JO}`) ? this.placeBubble(e) : this.releaseBubble(e);
	}
};
function lk(e) {
	return e instanceof HTMLInputElement && e.classList.contains(KO) ? e : null;
}
function uk(e) {
	return e.classList.contains(qO);
}
function dk(e) {
	return e.closest(`.${ek} .${ZO}`)?.querySelector(uk(e) ? `.${KO}:not(.${qO})` : `.${qO}`) ?? null;
}
function fk(e, t, n) {
	let r = Number(e.closest(`.${$O}`)?.getAttribute("data-ui-slider-min-distance") ?? 0);
	return String(WO(t, uk(e) ? "end" : "start", Number(n.value), Number.isFinite(r) ? r : 0, IO(e)));
}
function pk(e) {
	return A(e) || O(e);
}
function mk(e) {
	return e.closest(`.${$O}`)?.classList.contains(tk) === !0;
}
function hk(e) {
	let t = e.querySelector(`.${QO}`)?.getBoundingClientRect();
	return t === void 0 ? 0 : mk(e) ? t.height : t.width;
}
function gk(e) {
	if (!(e instanceof Element) || !e.classList.contains(KO)) return null;
	let t = e.closest(`.${ZO}`), n = uk(e), r = t?.querySelector(n ? `.${XO}--end` : `.${XO}:not(.${XO}--end)`) ?? null, i = t?.querySelector(n ? `.${QO}--end` : `.${QO}:not(.${QO}--end)`) ?? null;
	return r === null || i === null ? null : {
		bubble: r,
		anchor: i,
		vertical: mk(e)
	};
}
function _k(e) {
	let { min: t, max: n } = IO(e), r = Number(e.value);
	return !Number.isFinite(r) || n <= t ? 0 : Math.min(1, Math.max(0, (r - t) / (n - t)));
}
//#endregion
//#region src/rendering/number-format.ts
var vk = {
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
}, yk = [
	"(n)",
	"-n",
	"- n",
	"n-",
	"n -"
], bk = [
	"$n",
	"n$",
	"$ n",
	"n $"
], xk = [
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
], Sk = [
	"n %",
	"n%",
	"%n",
	"% n"
], Ck = [
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
], wk = /[1-9]/;
function Tk(e) {
	let t = e.closest("[data-ui-number-culture]")?.getAttribute("data-ui-number-culture") ?? null;
	if (t === null) return vk;
	try {
		return {
			...vk,
			...JSON.parse(t)
		};
	} catch {
		return vk;
	}
}
function Ek(e, t, n) {
	if (!Number.isFinite(e)) return String(e);
	let r = Ok(t);
	if (r === null) return kk(e, n);
	let i = Math.abs(e);
	switch (r.kind) {
		case "N": {
			let t = Ak(i, 0, r.precision ?? n.decimalDigits, n.groupSizes, n.groupSeparator, n.decimalSeparator);
			return Dk(e, t) ? Fk(yk[n.negativePattern] ?? "-n", t, "", n.negativeSign) : t;
		}
		case "F": {
			let t = Ak(i, 0, r.precision ?? n.decimalDigits, [], "", n.decimalSeparator);
			return Dk(e, t) ? n.negativeSign + t : t;
		}
		case "D": {
			let t = jk(i, 0, 0).integer.padStart(r.precision ?? 1, "0");
			return Dk(e, t) ? n.negativeSign + t : t;
		}
		case "C": {
			let t = Ak(i, 0, r.precision ?? n.currencyDecimalDigits, n.currencyGroupSizes, n.currencyGroupSeparator, n.currencyDecimalSeparator);
			return Fk(Dk(e, t) ? xk[n.currencyNegativePattern] ?? "-$n" : bk[n.currencyPositivePattern] ?? "$n", t, n.currencySymbol, n.negativeSign);
		}
		case "P": {
			let t = Ak(i, 2, r.precision ?? n.percentDecimalDigits, n.percentGroupSizes, n.percentGroupSeparator, n.percentDecimalSeparator);
			return Fk(Dk(e, t) ? Ck[n.percentNegativePattern] ?? "-n %" : Sk[n.percentPositivePattern] ?? "n %", t, n.percentSymbol, n.negativeSign);
		}
		default: return kk(e, n);
	}
}
function Dk(e, t) {
	return e < 0 && wk.test(t);
}
function Ok(e) {
	if (e == null || e.trim().length === 0) return null;
	let t = /^([NFCPDnfcpd])(\d{0,2})$/.exec(e.trim());
	if (t === null) throw Error(`Number format '${e}' is outside the shared subset (N, F, C, P, D, with an optional precision).`);
	return {
		kind: t[1].toUpperCase(),
		precision: t[2].length === 0 ? null : Number(t[2])
	};
}
function kk(e, t) {
	let { integer: n, fraction: r } = Mk(Math.abs(e), 0), i = r.length === 0 ? n : `${n}${t.decimalSeparator}${r}`;
	return e < 0 ? t.negativeSign + i : i;
}
function Ak(e, t, n, r, i, a) {
	let { integer: o, fraction: s } = jk(e, t, n);
	return n === 0 ? Pk(o, r, i) : `${Pk(o, r, i)}${a}${s}`;
}
function jk(e, t, n) {
	let { integer: r, fraction: i } = Mk(e, t), a = r + i.slice(0, n).padEnd(n, "0"), o = i.length > n && i[n] >= "5" ? Nk(a) : a, s = o.length - n;
	return {
		integer: o.slice(0, s),
		fraction: o.slice(s)
	};
}
function Mk(e, t) {
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
function Nk(e) {
	let t = e.length - 1;
	for (; t >= 0 && e[t] === "9";) t--;
	let n = "0".repeat(e.length - 1 - t);
	return t < 0 ? `1${n}` : `${e.slice(0, t)}${String(Number(e[t]) + 1)}${n}`;
}
function Pk(e, t, n) {
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
function Fk(e, t, n, r) {
	let i = "";
	for (let a of e) i += a === "n" ? t : a === "$" || a === "%" ? n : a === "-" ? r : a;
	return i;
}
var Ik = /^[\t\n\v\f\r ]*[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?[\t\n\v\f\r ]*$/;
function Lk(e) {
	if (!Ik.test(e)) return null;
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}
var Rk = {
	readCulture: Tk,
	format: Ek,
	parseInvariant: Lk
}, zk = /^-?(\d+(\.\d*)?|\.\d+)$/;
function Bk(e, t, n) {
	if (!zk.test(e)) return e;
	let r = n.thousands === !1 ? qk(t) : t, i = Number(e), a = n.format?.trim() ?? "";
	if (a.length > 0) try {
		return Ek(i, n.thousands === !0 ? Vk(a) : a, r);
	} catch {}
	let o = e.includes(".") ? e.length - e.indexOf(".") - 1 : 0;
	return Ek(i, `${n.thousands === !0 ? "N" : "F"}${Math.min(o, 99)}`, r);
}
function Vk(e) {
	return /^[fF]\d{0,2}$/.test(e) ? `N${e.slice(1)}` : e;
}
function Hk(e, t, n) {
	return zk.test(e) ? (Kk(n) ? Jk(e, 2) : e).replace(".", t.decimalSeparator) : e;
}
function Uk(e, t, n) {
	let r = e.trim();
	if (r.length === 0) return "";
	let i = !1;
	r.startsWith("(") && r.endsWith(")") && (i = !0, r = r.slice(1, -1));
	let a = Kk(n) || t.percentSymbol.length > 0 && r.includes(t.percentSymbol);
	for (let e of [t.currencySymbol, t.percentSymbol]) r = e.length === 0 ? r : r.split(e).join("");
	for (let e of /* @__PURE__ */ new Set([
		t.negativeSign,
		"-",
		"−"
	])) e.length > 0 && r.includes(e) && (i = !0, r = r.split(e).join(""));
	let o = t.decimalSeparator, [s, ...c] = o.length === 0 ? [r] : r.split(o);
	if (c.length > 1) return null;
	let l = s.replace(/[\s  ]/g, "").split(t.groupSeparator).join("").split(t.currencyGroupSeparator).join(""), u = c.length === 0 ? null : c[0].replace(/[\s  ]/g, ""), d = u === null ? l : `${l}.${u}`;
	if (!zk.test(d)) return null;
	let f = a ? Jk(d, -2) : d;
	return i && Number(f) !== 0 ? `-${f}` : f;
}
function Wk(e, t, n, r, i) {
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
function Gk(e) {
	return e.includes(".") ? e.replace(/0+$/, "").replace(/\.$/, "") : e;
}
function Kk(e) {
	return /^\s*[pP]\d{0,2}\s*$/.test(e ?? "");
}
function qk(e) {
	return {
		...e,
		groupSeparator: "",
		currencyGroupSeparator: "",
		percentGroupSeparator: ""
	};
}
function Jk(e, t) {
	let n = e.startsWith("-"), r = n ? e.slice(1) : e, i = r.indexOf("."), a = r.replace(".", ""), o = (i < 0 ? r.length : i) + t, s = a;
	o <= 0 && (s = "0".repeat(1 - o) + s, o = 1), o > s.length && (s += "0".repeat(o - s.length));
	let c = s.slice(0, o).replace(/^0+(?=\d)/, ""), l = s.slice(o).replace(/0+$/, ""), u = l.length === 0 ? c : `${c}.${l}`;
	return n ? `-${u}` : u;
}
//#endregion
//#region src/interactions/number-input-engine.ts
var Yk = "ui-number-input", Xk = "ui-number-input__field", Zk = "data-ui-number-no-decimals", Qk = "data-ui-number-no-negative", $k = "data-ui-number-thousands", eA = "data-ui-number-no-thousands", tA = "data-ui-number-trim-zeros", nA = "data-ui-number-step", rA = "data-ui-number-min", iA = "data-ui-number-max", aA = "data-ui-number-step-direction", oA = /* @__PURE__ */ new Map([
	["ArrowUp", 1],
	["ArrowDown", -1],
	["PageUp", 10],
	["PageDown", -10]
]), sA = class {
	options;
	root;
	values = /* @__PURE__ */ new WeakMap();
	shown = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("focus", (e) => this.handleFocus(e), !0), this.root.addEventListener("blur", (e) => this.handleBlur(e), !0), this.root.addEventListener("click", (e) => this.handleStepClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleStepKey(e), !0), window.addEventListener("change", (e) => this.handleChangeCapture(e), !0), window.addEventListener("change", (e) => this.handleChangeDone(e)), this.showAtRest(this.root.querySelectorAll(`.${Xk}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.showAtRest(Ya(e.components, `.${Xk}`));
		}), D.onChange(() => this.showAtRest(this.root.querySelectorAll(`.${Xk}`)));
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
		let t = cA(e);
		if (t !== null) return this.keptValue(t) ?? pA(t) ?? t.value.trim();
	}
	show(e) {
		let t = this.values.get(e) ?? e.value, n = e.hasAttribute(tA) ? Gk(t) : t, r = Tk(e), i = e === document.activeElement ? Hk(n, r, mA(e)) : dA(e, n, r);
		e.value = i, this.shown.set(e, i);
	}
	handleInput(e) {
		let t = cA(e.target);
		if (t === null) return;
		let n = !t.hasAttribute(Zk), r = !t.hasAttribute(Qk), i = t.selectionStart ?? t.value.length, a = Wk(t.value, i, Tk(t), n, r);
		a.value !== t.value && (t.value = a.value, t.setSelectionRange(a.cursor, a.cursor));
	}
	handleFocus(e) {
		let t = cA(e.target);
		t !== null && (this.values.set(t, this.valueOf(t)), this.show(t));
	}
	handleBlur(e) {
		let t = cA(e.target);
		if (t === null) return;
		let n = this.showsOwnText(t) ? null : pA(t);
		if (n !== null && this.values.set(t, n), t.hasAttribute(tA) && !A(t) && !O(t)) {
			let e = this.values.get(t) ?? "", n = Gk(e);
			n !== e && this.commit(t, n);
		}
		this.show(t);
	}
	handleChangeCapture(e) {
		let t = cA(e.target);
		if (t === null) return;
		let n = pA(t);
		n !== null && (this.values.set(t, n), t.value = n, this.shown.set(t, n));
	}
	handleChangeDone(e) {
		let t = cA(e.target);
		t !== null && t === document.activeElement && this.show(t);
	}
	commit(e, t) {
		this.values.set(e, t), e.value = Hk(t, Tk(e), mA(e)), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleStepClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[" + aA + "]");
		if (t === null) return;
		let n = t.closest(".ui-number-input__row")?.querySelector(`.${Xk}`) ?? null;
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t.getAttribute(aA) === "down" ? -1 : 1));
	}
	handleStepKey(e) {
		let t = oA.get(e.key);
		if (t === void 0 || !M(e, { shift: !0 }) || e.defaultPrevented) return;
		let n = cA(e.target);
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t));
	}
	step(e, t) {
		let n = Number(e.getAttribute(nA) ?? "1"), r = (Number(this.showsOwnText(e) ? this.valueOf(e) : pA(e) ?? "0") || 0) + n * t, i = e.getAttribute(rA), a = e.getAttribute(iA);
		i !== null && (r = Math.max(r, Number(i))), a !== null && (r = Math.min(r, Number(a))), this.commit(e, hA(r)), this.show(e);
	}
};
function cA(e) {
	return e instanceof HTMLInputElement && e.classList.contains(Xk) ? e : null;
}
function lA(e, t) {
	let n = e.classList.contains(Yk) ? e.querySelector(`.${Xk}`) : null, r = n === null ? null : t(n);
	if (n === null || typeof r != "string" || r.trim().length === 0 || !Number.isFinite(Number(r))) return null;
	let i = uA(n, rA), a = uA(n, iA);
	return i !== null && Number(r) < Number(i) ? {
		key: "ui.value.min",
		args: { min: dA(n, i, Tk(n)) }
	} : a !== null && Number(r) > Number(a) ? {
		key: "ui.value.max",
		args: { max: dA(n, a, Tk(n)) }
	} : null;
}
function uA(e, t) {
	let n = e.getAttribute(t)?.trim() ?? "";
	return n.length > 0 && Number.isFinite(Number(n)) ? n : null;
}
function dA(e, t, n) {
	return Bk(t, n, {
		format: mA(e),
		thousands: fA(e)
	});
}
function fA(e) {
	return e.hasAttribute($k) ? !0 : !e.hasAttribute(eA) && null;
}
function pA(e) {
	return Uk(e.value, Tk(e), mA(e));
}
function mA(e) {
	return e.closest(`.${Yk}`)?.getAttribute("data-ui-number-format") ?? null;
}
function hA(e) {
	return Number(e.toFixed(10)).toString();
}
//#endregion
//#region src/events/ahead-of-answer.ts
function gA(e, t) {
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
function _A(e) {
	switch (e.getAttribute(qt)) {
		case "windowed": return "windowed";
		case "virtualized": return "virtualized";
		default: return "plain";
	}
}
function vA(e) {
	let t = _A(e) === "windowed" ? yA(e, "data-ui-window-offset") ?? 0 : 0;
	return Number.isInteger(t) && t > 0 ? t : 0;
}
function yA(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.length === 0) return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
function bA(e, t) {
	return e.getAttribute(t)?.toLowerCase() === "true";
}
//#endregion
//#region src/interactions/item-drags.ts
var xA = "application/x-ne-items", SA = null, CA = null;
function wA(e, t, n) {
	let r = e.getAttribute(me), i = new Set((e.getAttribute("data-ui-drag-effects") ?? "").split(" ").filter((e) => e === "move" || e === "copy"));
	return r === null || r.length === 0 || i.size === 0 || n.length === 0 ? null : {
		kind: r,
		root: e,
		host: t,
		rows: n,
		keys: n.map(L),
		effects: i,
		source: e.getAttribute(he)
	};
}
function TA(e, t) {
	let n = af(t);
	return n.includes(e) ? n.filter((t) => t === e || DA(t)) : [e];
}
function EA(e) {
	return !Dl(e, "data-ui-undraggable") && !k(e);
}
function DA(e) {
	return EA(e) && I(e) !== null;
}
function OA(e, t) {
	let n = e?.effects.has("copy") === !0, r = t || e?.effects.has("move") === !0;
	return n && r ? "copyMove" : n ? "copy" : "move";
}
function kA(e, t, n = null) {
	SA = t, CA = t === null ? null : n, t !== null && e instanceof DragEvent && e.dataTransfer !== null && e.dataTransfer.setData(xA, t.kind);
}
function AA(e) {
	return SA !== null && e.dataTransfer?.types.includes(xA) === !0 ? SA : null;
}
function jA() {
	let e = CA;
	SA = null, CA = null, e?.();
}
//#endregion
//#region src/items/items-empty-renderer.ts
var MA = "data-ui-non-item";
function G(e) {
	let t = [];
	for (let n of e.children) NA(n) || t.push(n);
	return t;
}
function NA(e) {
	return e.hasAttribute("data-ui-non-item") || e.hasAttribute("data-ui-empty-placeholder") || e.hasAttribute("data-ui-group-header") || e.hasAttribute("data-ui-window-spacer");
}
function PA(e) {
	return e === null ? [] : [e];
}
function FA(e) {
	return e.querySelector(`:scope > [${Lt}]`);
}
function IA(e, t, n, r, i) {
	i ??= G(e).some((e) => !e.classList.contains(Ai));
	let a = FA(e);
	i ? (a?.remove(), e.toggleAttribute(dt, !1)) : e.toggleAttribute(dt, a !== null || LA(e, t, n, r));
}
function LA(e, t, n, r) {
	let i = n.getEmptyTemplate(t);
	if (i === void 0) return !1;
	let a = r.renderFromTemplate(i, null, r.getAncestorStack(e));
	if (a === null) return !1;
	let o = document.createElement("div");
	return o.setAttribute(Lt, ""), o.appendChild(a), e.appendChild(o), !0;
}
//#endregion
//#region src/items/binding-template-evaluator.ts
var RA = { ok: !1 }, zA = {
	ok: !0,
	value: null
}, BA = null;
function VA(e) {
	BA = e;
}
function HA(e, t, n) {
	let r = e.length === 0 ? void 0 : e[e.length - 1].item, i = t ?? "";
	if (i.length === 0 || i === ".") return {
		ok: !0,
		value: r,
		scope: r
	};
	let a = (n ?? []).filter((e) => fa(e.kind) !== "Scope"), o = -1;
	for (let e = 0; e < a.length; e++) fa(a[e].kind) === "Dynamic" && (o = e);
	let s = r, c = r, l = !0, u = 0, d = 0, f = !0;
	for (; d < i.length;) {
		let t = i[d];
		if (t === ".") {
			if (f) return RA;
			f = !0, d++;
			continue;
		}
		if (t === "[") {
			if (d + 1 >= i.length || i[d + 1] !== "]" || u >= a.length) return RA;
			let t = a[u];
			if (u++, fa(t.kind) === "Dynamic") {
				let n = KA(e, t.componentId);
				if (!n.ok) return RA;
				s = n.value, c = n.value, l = !0;
			} else {
				if (!l) return RA;
				let e = $A(s, t.value);
				if (!e.ok) return RA;
				s = e.value;
			}
			d += 2, f = !1;
			continue;
		}
		let n = d;
		for (; d < i.length && i[d] !== "." && i[d] !== "[";) d++;
		if (d === n) return RA;
		if (l) {
			let e = YA(s, i.slice(n, d), u > o);
			e.ok ? s = e.value : l = !1;
		}
		f = !1;
	}
	return f || u !== a.length || !l ? RA : {
		ok: !0,
		value: s,
		scope: c
	};
}
function UA(e, t, n) {
	for (let r of t ?? []) {
		if (fa(r.kind) !== "Dynamic") continue;
		let t = w(r.componentId);
		if (t > 0 && !n.some((e) => e.scopeComponentId === t) && e.closest(`[data-ui-id="${t}"][data-ui-key]`) !== null) return !0;
	}
	return !1;
}
function WA(e) {
	let t = JA(e, "IsContent");
	return t.ok && t.value === !0;
}
var GA = /* @__PURE__ */ new Set();
function KA(e, t) {
	let n = w(t);
	if (n > 0) {
		for (let t = e.length - 1; t >= 0; t--) if (e[t].scopeComponentId === n) return {
			ok: !0,
			value: e[t].item
		};
	}
	return GA.has(n) || (GA.add(n), s("an item scope a binding parameter names is not on the stack; the binding resolves to nothing.", {
		targetId: n,
		stack: e
	})), RA;
}
function qA(e, t) {
	let n = e;
	for (let e of t.split(".")) {
		let t = JA(n, e);
		if (!t.ok) return;
		n = t.value;
	}
	return n;
}
function JA(e, t) {
	return YA(e, t, !0);
}
function YA(e, t, n) {
	if (e == null) return RA;
	if (t === ".") return {
		ok: !0,
		value: e
	};
	if (typeof e != "object") return RA;
	let r = e, i = XA(r, t);
	return Object.hasOwn(r, i) ? {
		ok: !0,
		value: r[i]
	} : Array.isArray(e) ? RA : (n && BA?.(r, t), zA);
}
function XA(e, t) {
	if (Object.hasOwn(e, t)) return t;
	let n = ZA(t);
	if (Object.hasOwn(e, n)) return n;
	let r = null;
	for (let n in e) if (n.length === t.length && Object.hasOwn(e, n) && (r ??= t.toLowerCase(), n.toLowerCase() === r)) return n;
	return n;
}
function ZA(e) {
	let t = e.charAt(0);
	return t === t.toLowerCase() ? e : t.toLowerCase() + e.slice(1);
}
function QA(e) {
	let t = e.itemTemplate;
	if (t == null) return null;
	let n = (e.itemTemplateParameters ?? []).filter((e) => fa(e.kind) !== "Scope"), r = [], i = [], a = !1, o = 0, s = 0, c = 0;
	for (; c < t.length;) {
		let e = t[c];
		if (e === ".") {
			c++;
			continue;
		}
		if (e === "[") {
			if (c + 1 >= t.length || t[c + 1] !== "]" || s >= n.length) return null;
			let e = n[s];
			if (s++, c += 2, fa(e.kind) !== "Dynamic") {
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
function $A(e, t) {
	if (e == null || t == null) return RA;
	if (typeof t == "number") return Array.isArray(e) && t >= 0 && t < e.length ? {
		ok: !0,
		value: e[t]
	} : RA;
	if (typeof t != "string") return RA;
	if (!Array.isArray(e) && typeof e == "object") {
		let n = e;
		if (Object.hasOwn(n, t)) return {
			ok: !0,
			value: n[t]
		};
	}
	if (Array.isArray(e)) {
		for (let n of e) if (tj(n, t)) return {
			ok: !0,
			value: n
		};
	}
	return RA;
}
function ej(e, t, n) {
	if (e == null || t == null) return !1;
	if (Array.isArray(e)) {
		if (typeof t == "number") return t < 0 || t >= e.length ? !1 : (e[t] = n, !0);
		if (typeof t != "string") return !1;
		for (let r = 0; r < e.length; r++) if (tj(e[r], t)) return e[r] = n, !0;
		return !1;
	}
	if (typeof t != "string" || typeof e != "object") return !1;
	let r = e;
	return Object.hasOwn(r, t) ? (r[t] = n, !0) : !1;
}
function tj(e, t) {
	return typeof e == "object" && !!e && e.id === t;
}
//#endregion
//#region src/items/items-filter-sort.ts
var nj = /* @__PURE__ */ new WeakMap();
function rj(e) {
	let t = ij(e), n = t?.getAttribute("data-ui-items-query") ?? null;
	if (t === null || n === null || n.length === 0) return null;
	let r = nj.get(t);
	if (r !== void 0 && r.text === n) return r.query;
	let i = aj(e, n);
	return nj.set(t, {
		text: n,
		query: i
	}), i;
}
function ij(e) {
	let t = e.closest(x);
	if (t === null) return null;
	for (let e of t.children) if (e.hasAttribute("data-ui-items-query")) return e;
	return null;
}
function aj(e, t) {
	try {
		return JSON.parse(t);
	} catch {
		return s("the items query on the page does not parse; the authored rules alone apply.", {
			host: e,
			text: t
		}), null;
	}
}
function oj(e, t, n, r, i) {
	let a = n.getItemsFilterSortMetadata(t), o = rj(e);
	if (a === void 0 && o === null) for (let t of G(e)) t.classList.remove(Ai);
	else for (let n of G(e)) {
		let e = r.getItemValue(n);
		e === void 0 ? (s("item value is unknown, leaving the item visible.", {
			componentId: t,
			item: n
		}), n.classList.remove(Ai)) : n.classList.toggle(Ai, !sj(a, e, i, o));
	}
}
function sj(e, t, n, r = null) {
	return (e?.filters ?? []).every((e) => fj(e, t, n)) && (r?.filters ?? []).every((e) => Ih(qA(t, e.itemProperty), e.operator, e.value));
}
function cj(e, t, n = null) {
	return (e?.filters ?? []).some((e) => pj(e.source, e.activeOperator, e.activeValue, t)) || (n?.filters?.length ?? 0) > 0;
}
function lj(e, t, n = null) {
	let r = (e?.sorts ?? []).filter((e) => pj(e.source, e.activeOperator, e.activeValue, t)).sort((e, t) => e.priority - t.priority);
	return [...n?.sorts ?? [], ...r];
}
function uj(e, t, n) {
	return t.length === 0 ? [...e] : [...e].sort((e, r) => dj(n.getItemValue(e), n.getItemValue(r), t));
}
function dj(e, t, n) {
	for (let r of n) {
		let n = mj(Lh(qA(e, r.itemProperty)), Lh(qA(t, r.itemProperty)));
		if (n !== 0) return _a(r.direction) === "Descending" ? -n : n;
	}
	return 0;
}
function fj(e, t, n) {
	if (!pj(e.source, e.activeOperator, e.activeValue, n)) return !0;
	let r = e.source !== null && e.source !== void 0 ? n.get(e.source, []) : e.value;
	return Ih(qA(t, e.itemProperty), e.operator, r);
}
function pj(e, t, n, r) {
	return e == null || Ih(r.get(e, []), t, n);
}
function mj(e, t) {
	if (e === t) return 0;
	let n = gj(e), r = gj(t);
	if (n !== r) return n - r;
	if (n === hj.Nothing) return 0;
	if (n === hj.Number) {
		let n = Number(e) - Number(t);
		return Number.isNaN(n) ? 0 : Math.sign(n);
	}
	return String(e).localeCompare(String(t));
}
var hj = {
	Nothing: 0,
	Number: 1,
	Text: 2
};
function gj(e) {
	return e == null ? hj.Nothing : typeof e == "number" ? Number.isNaN(e) ? hj.Nothing : hj.Number : typeof e == "string" && e.trim().length === 0 ? hj.Nothing : Number.isNaN(Number(e)) ? hj.Text : hj.Number;
}
//#endregion
//#region src/items/items-source-order.ts
var _j = /* @__PURE__ */ new WeakMap();
function vj(e, t) {
	let n = _j.get(e), r = n === void 0 ? [...t] : yj(n, t);
	return _j.set(e, r), r;
}
function yj(e, t) {
	let n = new Set(t), r = e.filter((e) => n.has(e));
	return r.length === t.length ? r : [...t];
}
function bj(e, t, n) {
	let r = n === null || n > e.length ? e.length : n;
	return e.splice(r, 0, t), e[r + 1] ?? null;
}
function xj(e, t) {
	let n = e.indexOf(t);
	n >= 0 && e.splice(n, 1);
}
function Sj(e, t) {
	let n = 0;
	for (let r of e) t.has(r) || (e[n++] = r);
	e.length = n;
}
function Cj(e, t, n) {
	return xj(e, t), bj(e, t, n);
}
function wj(e, t, n) {
	let r = e.indexOf(t);
	r >= 0 && (e[r] = n);
}
function Tj(e, t) {
	_j.set(e, [...t]);
}
function Ej(e) {
	_j.delete(e);
}
//#endregion
//#region src/interactions/live-announcer.ts
var Dj = "ui-announcer", Oj = 7e3, kj = null;
function Aj(e, t = "polite") {
	(kj ?? jj(document.body)).announce(e, t);
}
function jj(e) {
	return kj = new Nj(e), kj;
}
function Mj(e, t) {
	Aj({
		key: "ui.move.done",
		args: {
			index: e,
			count: t
		}
	});
}
var Nj = class {
	container;
	regions = /* @__PURE__ */ new Map();
	constructor(e) {
		this.container = e, this.ensureRegion("polite"), this.ensureRegion("assertive");
	}
	announce(e, t = "polite") {
		let n = document.createElement("div");
		return typeof e == "string" ? n.textContent = e : D.writeValue(n, null, e), this.ensureRegion(t).append(n), setTimeout(() => n.remove(), Oj), n;
	}
	ensureRegion(e) {
		let t = this.regions.get(e);
		if (t !== void 0 && t.isConnected) return t;
		let n = `.${Dj}[aria-live="${e}"]`, r = this.container.querySelector(n), i = r ?? document.createElement("div");
		return r === null && (i.className = Dj, i.setAttribute("aria-live", e), this.container.append(i)), this.regions.set(e, i), i;
	}
}, Pj = "ui-tab-item";
function Fj(e) {
	let t = e.parentElement;
	return t !== null && !t.hasAttribute("data-ui-items-host") && t.closest("[data-ui-items-host]") === t.parentElement ? t : e;
}
function Ij(e) {
	return e instanceof HTMLElement && e.classList.contains("ui-tab-item") ? Fj(e).parentElement : null;
}
function Lj(e, t) {
	return Dl(Fj(e), t);
}
//#endregion
//#region src/interactions/items-reorder-engine.ts
var Rj = ".ui-items-view__item, .ui-table__row", zj = "ui-row--dragging", Bj = "--ui-row-drop-offset", Vj = "move", Hj = ".ui-items-view--wrap", Uj = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight"
]);
function Wj(e, t) {
	dp(e, Vj, { index: t });
}
function Gj(e) {
	return {
		name: Vj,
		registration: {
			dynamicParameters: (e) => {
				let t = Kj(e.domEvent);
				return t === null ? null : [...e.dynamicParameters, t];
			},
			...gA((t) => e === void 0 ? null : qj(e, t), (t) => "pending" in t ? e?.settle(t.pending) : e?.resort(t.strip))
		}
	};
}
function Kj(e) {
	let t = e instanceof CustomEvent ? e.detail?.index : void 0;
	return typeof t == "number" ? t : null;
}
function qj(e, t) {
	let n = Kj(t);
	if (n === null || !(t.target instanceof Element)) return null;
	let r = Ij(t.target);
	if (r !== null) return { strip: r };
	let i = t.target.closest(Rj), a = i?.parentElement ?? null, o = i === null || a === null || !a.hasAttribute("data-ui-items-host") ? null : e.ahead(a, L(i), n);
	return o === null ? null : { pending: o };
}
var Jj = class {
	root;
	services;
	drag = null;
	views;
	marked = null;
	lifted = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.services = e.services, this.views = new Yj(this.root, e.services?.keysOf), this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("pointerup", () => this.release(), !0), this.root.addEventListener("pointercancel", () => this.release(), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", () => this.endDrag(), !0);
	}
	handlePointerDown(e) {
		if (this.release(), !(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = this.liftableRow(e.target), n = t === null ? null : I(t.row);
		if (t === null || n === null) return;
		let r = tM(t.root, t.row);
		if (r === null ? !nM(e.target, t.row) : !r.contains(e.target)) return;
		r !== null && (zf(t.root, lM(t.row.parentElement ?? t.root), t.row), t.root.focus({ preventScroll: !0 }));
		let i = document.getSelection();
		i !== null && !i.isCollapsed && i.removeAllRanges(), n.draggable || (n.draggable = !0, this.lifted = n);
	}
	release() {
		this.lifted !== null && this.drag === null && (this.lifted.draggable = !1, this.lifted = null);
	}
	liftableRow(e) {
		let t = e.closest(qd), n = t?.parentElement ?? null, r = n?.closest(F) ?? null;
		if (t === null || n === null || r === null || !t.matches(Rj) || !n.hasAttribute("data-ui-items-host") || O(r) || !DA(t)) return null;
		let i = r.hasAttribute("data-ui-rows-draggable") && !this.isSorted(r, n);
		return i || r.hasAttribute("data-ui-drag-kind") ? {
			root: r,
			row: t,
			moves: i
		} : null;
	}
	isSorted(e, t) {
		let n = Za(e);
		return this.services === void 0 || n === null ? !1 : lj(this.services.metadata.getItemsFilterSortMetadata(n), this.services.state, rj(t)).length > 0;
	}
	handleDragStart(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.liftableRow(e.target), n = t?.row.parentElement ?? null, r = t === null ? null : I(t.row);
		if (t === null || n === null || r === null || e.target !== r) return;
		this.drag = {
			...t,
			host: n
		};
		let i = wA(t.root, n, TA(t.row, lM(n))), a = (i?.rows ?? []).filter((e) => e !== t.row).map((e) => I(e) ?? e);
		ib(e, t.root, r, zj, L(t.row), a, OA(i, t.moves)), kA(e, i, () => this.endDrag()), this.dropView();
	}
	handleDragOver(e) {
		let t = this.ownDrag(e);
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let n = this.views.read(t.root, t.host), r = $j(t.host, e.target, e, n.flow, n.rows, n.boxes), i = r === null || this.indexOf(t, r.anchor, r.side, n.order) === null ? null : r, a = i === null ? 0 : sM(n.rows, i, n.flow);
		e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), !(this.marked !== null && this.marked.view === n && aM(this.marked.place, i) && this.marked.offset === a) && (uM(t.root, i, a), this.marked = {
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
		if (rM(t) !== rM(e.row)) return null;
		let i = Zj(r ?? eM(e.host, this.services?.keysOf), L(e.row), L(t), n);
		return i === null ? null : i + vA(e.host);
	}
	handleDragLeave(e) {
		let t = this.drag;
		t !== null && e instanceof DragEvent && sb(e, t.host) && (uM(t.root, null), this.dropView());
	}
	handleDrop(e) {
		let t = this.ownDrag(e);
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		e.preventDefault();
		let n = $j(t.host, e.target, e, iM(t.root, t.host), lM(t.host)), r = n === null ? null : this.indexOf(t, n.anchor, n.side);
		this.endDrag(), r !== null && Wj(t.row, r);
	}
	endDrag() {
		let e = this.drag;
		this.drag = null, this.dropView(), this.release(), e !== null && (ab(e.root, zj), uM(e.root, null));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !e.altKey || !M(e, { alt: !0 }) || !Uj.has(e.key) || !(e.target instanceof Element)) return;
		let t = Af(e);
		if (t === null || !t.root.matches(".ui-items-view, .ui-table")) return;
		let n = pf(t.root), r = n === null ? null : iM(t.root, n), i = e.key === "ArrowLeft" || e.key === "ArrowRight";
		if (n === null || r === null || i && !r.across) return;
		let a = lM(n), o = Pf(a);
		if (o === null || this.liftableRow(o)?.moves !== !0) return;
		e.preventDefault();
		let s = e.key === "ArrowDown" || e.key === "ArrowRight", c = !i && t.root.matches(Hj) ? cp(a, o, s) : a[a.indexOf(o) + (s ? 1 : -1)] ?? null, l = c === null ? null : this.indexOf({
			host: n,
			row: o
		}, c, s ? "after" : "before");
		l !== null && (Wj(o, l), Mj(l + 1, yA(n, "data-ui-window-total") ?? vA(n) + eM(n, this.services?.keysOf).length));
	}
}, Yj = class {
	keysOf;
	view = null;
	changes = typeof MutationObserver == "function" ? new MutationObserver((e) => this.hear(e)) : null;
	constructor(e, t) {
		this.keysOf = t, e.addEventListener("scroll", () => this.drop(), !0);
	}
	read(e, t) {
		if (this.view !== null && this.view.host === t) return this.view;
		this.drop();
		let n = lM(t);
		return this.view = {
			host: t,
			flow: iM(e, t),
			rows: n,
			boxes: n.map((e) => (I(e) ?? e).getBoundingClientRect()),
			order: eM(t, this.keysOf)
		}, this.changes?.observe(t, {
			childList: !0,
			subtree: !0,
			attributes: !0,
			attributeFilter: [
				"class",
				"hidden",
				Bt,
				"style"
			]
		}), this.view;
	}
	drop() {
		this.view = null, this.changes?.disconnect();
	}
	hear(e) {
		e.some(Xj) && this.drop();
	}
};
function Xj(e) {
	return e.attributeName !== "style" || e.target instanceof Element && e.target.hasAttribute("data-ui-window-spacer");
}
function Zj(e, t, n, r) {
	let i = e.indexOf(t);
	if (i < 0 || t === n) return null;
	let a = Qj(e.filter((e) => e !== t), n, r);
	return a === i ? null : a;
}
function Qj(e, t, n) {
	let r = e.indexOf(t);
	return r < 0 ? null : n === "before" ? r : r + 1;
}
function $j(e, t, n, r, i, a) {
	if (t.closest("[data-ui-group-header]")?.parentElement === e) return null;
	let o = t.closest(qd);
	for (; o !== null && o.parentElement !== e;) o = o.parentElement?.closest(qd) ?? null;
	if (o ??= cM(i, n, a), o === null) return null;
	let s = (I(o) ?? o).getBoundingClientRect();
	if ((r.across ? n.clientX < s.left + s.width / 2 : n.clientY < s.top + s.height / 2) === r.rightToLeft) return {
		anchor: o,
		side: "after"
	};
	let c = i[i.indexOf(o) - 1];
	return c !== void 0 && oM(c, o, r) ? {
		anchor: c,
		side: "after"
	} : {
		anchor: o,
		side: "before"
	};
}
function eM(e, t) {
	switch (_A(e)) {
		case "virtualized": return [...t?.(e) ?? G(e).map(L)];
		case "windowed": return G(e).map(L);
		default: return vj(e, G(e)).map(L);
	}
}
function tM(e, t) {
	let n = e.hasAttribute("data-ui-rows-drag-handle") ? t.querySelector(`:scope > .${ve}`) : null;
	return n !== null && n.getClientRects().length > 0 ? n : null;
}
function nM(e, t) {
	return yd(e, t) === null && e.closest("[data-ui-no-row-drag]") === null;
}
function rM(e) {
	return e.getAttribute("data-ui-group") ?? "";
}
function iM(e, t) {
	let n = e.matches(".ui-orientation--horizontal, .ui-items-view--wrap");
	return {
		across: n,
		rightToLeft: n && getComputedStyle(t).direction === "rtl"
	};
}
function aM(e, t) {
	return e === t || e !== null && t !== null && e.anchor === t.anchor && e.side === t.side;
}
function oM(e, t, n) {
	if (rM(e) !== rM(t)) return !1;
	if (!n.across) return !0;
	let r = (I(e) ?? e).getBoundingClientRect(), i = (I(t) ?? t).getBoundingClientRect();
	return r.top < i.bottom && i.top < r.bottom;
}
function sM(e, t, n) {
	let r = t.side === "after" ? e[e.indexOf(t.anchor) + 1] : void 0;
	if (r === void 0 || !oM(t.anchor, r, n)) return -1;
	let i = (I(t.anchor) ?? t.anchor).getBoundingClientRect(), a = (I(r) ?? r).getBoundingClientRect(), o = n.across ? n.rightToLeft ? i.left - a.right : a.left - i.right : a.top - i.bottom;
	return Math.max(o, 0) / 2;
}
function cM(e, t, n) {
	let r = null, i = Infinity;
	for (let a = 0; a < e.length; a++) {
		let o = e[a], s = n?.[a] ?? (I(o) ?? o).getBoundingClientRect(), c = Math.max(s.left - t.clientX, 0, t.clientX - s.right), l = Math.max(s.top - t.clientY, 0, t.clientY - s.bottom), u = c * c + l * l;
		u < i && (r = o, i = u);
	}
	return r;
}
function lM(e) {
	return G(e).filter((e) => e instanceof HTMLElement && e.matches(qd) && I(e) !== null);
}
function uM(e, t, n = 0) {
	let r = t === null ? null : I(t.anchor);
	for (let t of e.querySelectorAll(`[${ye}]`)) t !== r && (t.removeAttribute(ye), t.style.removeProperty(Bj));
	if (r === null || t === null) return;
	r.getAttribute("data-ui-row-drop") !== t.side && r.setAttribute(ye, t.side);
	let i = `${n}px`;
	r.style.getPropertyValue(Bj) !== i && r.style.setProperty(Bj, i);
}
function dM(e) {
	e.classList.remove(zj), e.querySelector(`:scope > [${ie}]`)?.classList.remove(zj);
}
//#endregion
//#region src/interactions/tree-drop.ts
var fM = "--ui-tree-drop-depth";
function pM(e) {
	return e.querySelector(`.${_r}`);
}
function mM(e, t) {
	if (k(e)) return !1;
	let n = t?.getAttribute(kr);
	return n === "true" || n !== "false" && e.hasAttribute("aria-expanded");
}
function hM(e, t) {
	let n = e.length === 0 ? null : t(e);
	return n === null || mM(n, pM(n));
}
function gM(e, t) {
	let n = pM(e);
	if (mM(e, n)) return L(e);
	let r = n?.getAttribute("data-ui-tree-parent") ?? "";
	return hM(r, t) ? r : null;
}
function _M(e, t, n = "", r) {
	for (let n of e.querySelectorAll(`[${vr}]`)) n !== t && (n.removeAttribute(vr), n.style.removeProperty(fM));
	t !== null && (t.setAttribute(vr, n), r === void 0 ? t.style.removeProperty(fM) : t.style.setProperty(fM, String(r)));
}
function vM(e, t, n) {
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
function yM(e, t, n) {
	let r = e.find((e) => e.key === t);
	if (r === void 0) return null;
	let i = bM(e, r, n);
	return i === null || !xM(e, i.parent) ? null : i;
}
function bM(e, t, n) {
	if (n === "in") {
		let n = vM(e, t.key, !0);
		return n === null ? null : {
			parent: n,
			before: null
		};
	}
	if (n === "out") {
		let n = vM(e, t.key, !1);
		return n === null ? null : {
			parent: n,
			before: CM(e, n, t.parent, !1)
		};
	}
	let r = SM(e, t.parent), i = r.findIndex((e) => e.key === t.key), a = n === "up" ? -1 : 1, o = i + a;
	for (; o >= 0 && o < r.length && r[o].shown === !1;) o += a;
	return o < 0 || o >= r.length ? null : {
		parent: t.parent,
		before: n === "up" ? r[o].key : r[o + 1]?.key ?? null
	};
}
function xM(e, t) {
	return t.length === 0 || e.find((e) => e.key === t)?.takesDrop === !0;
}
function SM(e, t) {
	return e.filter((e) => e.parent === t);
}
function CM(e, t, n, r, i = /* @__PURE__ */ new Set()) {
	let a = SM(e, t);
	for (let e = a.findIndex((e) => e.key === n) + 1; e > 0 && e < a.length; e++) if (!i.has(a[e].key) && (!r || a[e].shown !== !1)) return a[e].key;
	return null;
}
function wM(e, t, n) {
	let r = SM(e, n.parent).map((e) => e.key), i = new Set(t), a = n.before !== null && i.has(n.before) ? CM(e, n.parent, n.before, !1, i) : n.before, o = [], s = null;
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
var TM = "drop:", EM = "ui-row--cut", DM = {
	code: "KeyX",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
}, OM = {
	code: "KeyC",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
}, kM = {
	code: "KeyV",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
};
function AM(e) {
	return {
		dynamicParameters: (e) => {
			let t = jM(e.domEvent);
			return t === null ? null : [...e.dynamicParameters, JSON.stringify(t.drop)];
		},
		...gA((t) => MM(e, t), (t) => e?.settle(t))
	};
}
function jM(e) {
	let t = e instanceof CustomEvent ? e.detail : null;
	return t?.drop === void 0 ? null : t;
}
function MM(e, t) {
	let n = jM(t)?.transfer ?? null;
	return n === null || e === void 0 ? null : e.ahead(n.source, n.target, n.keys, n.index);
}
var NM = class {
	root;
	options;
	marked = null;
	clipboard = null;
	views;
	constructor(e) {
		this.root = e.root ?? document, this.options = e, this.views = new Yj(this.root, e.keysOf), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", () => this.endDrag(), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e));
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent)) return;
		let t = this.dropOf(e);
		this.unmark(), t !== null && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = t.effect), t.landing.mark(), this.marked = t.target);
	}
	dropOf(e) {
		let t = AA(e), n = e.target instanceof Element ? e.target : null, r = t === null || n === null ? null : this.targetOf(t, n);
		if (t === null || n === null || r === null) return null;
		let i = PM(t, r, FM(e)), a = i === null ? null : this.landingOf(r, n, e);
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
		let r = e.matches(".ui-items-view, .ui-table") ? pf(e) : null;
		if (r !== null) {
			let i = this.views.read(e, r), a = t !== null && n !== null ? $j(r, t, n, i.flow, i.rows, i.boxes) : IM(i.rows);
			return {
				index: ((a === null ? null : Qj(i.order, L(a.anchor), a.side)) ?? i.order.length) + vA(r),
				folder: null,
				list: r,
				mark: () => a === null ? e.setAttribute(ge, "") : uM(e, a, sM(i.rows, a, i.flow))
			};
		}
		if (e.classList.contains("ui-tree")) {
			let n = LM(e, t ?? document.activeElement);
			if (n === null) return null;
			let r = n.length === 0 ? pf(e) : RM(e, n);
			return {
				index: null,
				folder: n,
				list: null,
				mark: () => _M(e, r)
			};
		}
		return {
			index: null,
			folder: null,
			list: null,
			mark: () => {
				e.setAttribute(ge, ""), cb(e, !0);
			}
		};
	}
	unmark() {
		let e = this.marked;
		this.marked = null, e !== null && (e.removeAttribute(ge), cb(e, !1), e.matches(".ui-items-view, .ui-table") ? uM(e, null) : e.classList.contains("ui-tree") && _M(e, null));
	}
	handleDragLeave(e) {
		this.marked !== null && e instanceof DragEvent && sb(e, this.marked) && this.unmark();
	}
	handleDrop(e) {
		this.views.drop();
		let t = e instanceof DragEvent ? this.dropOf(e) : null;
		t !== null && (e.preventDefault(), this.unmark(), jA(), this.drop(t.drag, t.target, t.effect, t.landing));
	}
	drop(e, t, n, r) {
		let i = n === "move" && r.list !== null && r.index !== null && e.host.isConnected && e.root.matches(".ui-items-view, .ui-table") && t.getAttribute("data-ui-drag-kind") === e.kind && _A(e.host) === "plain" && _A(r.list) === "plain", a = {
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
		t.dispatchEvent(new CustomEvent(TM + e.kind, {
			bubbles: !0,
			detail: a
		}));
	}
	endDrag() {
		this.unmark(), this.views.drop(), jA();
	}
	handleKeyDown(e) {
		e instanceof KeyboardEvent && !e.defaultPrevented && e.target instanceof Element && (e.key === "Escape" ? this.clipboard !== null && !j(e) && (this.clipboard.items.root.isConnected && e.preventDefault(), this.letGo()) : od(e.target) || (xu(kM, e) ? this.paste(e, e.target) : xu(DM, e) ? this.take(e, e.target, !0) : xu(OM, e) && this.take(e, e.target, !1)));
	}
	letGo() {
		for (let e of this.clipboard?.items.rows ?? []) (I(e) ?? e).classList.remove(EM);
		this.clipboard = null;
	}
	paste(e, t) {
		let n = this.clipboard, r = n === null ? null : this.targetOf(n.items, t), i = n === null || r === null ? null : PM(n.items, r, !n.cut);
		this.views.drop();
		let a = r === null || i === null ? null : this.landingOf(r, null, null);
		n !== null && r !== null && i !== null && a !== null && (e.preventDefault(), this.drop(n.items, r, i, a), n.cut && this.letGo());
	}
	take(e, t, n) {
		let r = document.getSelection();
		if (r !== null && !r.isCollapsed) return;
		let i = kf(t), a = i === null ? null : pf(i.root);
		if (i === null || a === null || O(i.root) || !i.root.hasAttribute("data-ui-drag-kind")) return;
		let o = lM(a), s = i.row ?? Pf(o), c = s === null || !DA(s) ? null : wA(i.root, a, TA(s, o));
		if (c !== null && c.effects.has(n ? "move" : "copy") && (e.preventDefault(), this.letGo(), this.clipboard = {
			items: c,
			cut: n
		}, n)) for (let e of c.rows) (I(e) ?? e).classList.add(EM);
	}
};
function PM(e, t, n) {
	let r = n || t.getAttribute("data-ui-drag-kind") !== e.kind ? "copy" : "move";
	return e.effects.has(r) ? r : n ? null : r === "move" ? "copy" : "move";
}
function FM(e) {
	return Au() ? e.altKey : e.ctrlKey;
}
function IM(e) {
	let t = Ff(e);
	return t === null ? null : {
		anchor: t,
		side: "after"
	};
}
function LM(e, t) {
	let n = t?.closest(".ui-tree__row") ?? null;
	return n === null || n.closest(".ui-tree") !== e ? "" : gM(n, (t) => RM(e, t));
}
function RM(e, t) {
	return e.querySelector(`.${gr}[${y}="${S(t)}"]`);
}
//#endregion
//#region src/interactions/temporal-range.ts
function zM(e, t, n) {
	if (t === "start" || e.start === null) {
		let t = WM(n, e.start ?? n);
		return {
			start: t,
			end: e.end !== null && e.end.getTime() < t.getTime() ? null : e.end,
			active: "end",
			complete: !1
		};
	}
	return n.getTime() < GM(e.start).getTime() ? {
		start: WM(n, e.start),
		end: null,
		active: "end",
		complete: !1
	} : {
		start: e.start,
		end: WM(n, e.end ?? e.start),
		active: "end",
		complete: !0
	};
}
function BM(e, t, n) {
	if (t === null || n === null) return !1;
	let r = GM(e).getTime();
	return r > GM(t).getTime() && r < GM(n).getTime();
}
function VM(e, t) {
	return !t && e.start !== null && e.end !== null && GM(e.start).getTime() < GM(e.end).getTime();
}
function HM(e, t, n) {
	return !n && BM(e, t.start, t.end);
}
function UM(e) {
	return e.start !== null && e.end !== null && e.end.getTime() < e.start.getTime() ? {
		start: e.end,
		end: e.start
	} : e;
}
function WM(e, t) {
	return Zs(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function GM(e) {
	return Zs(e.getFullYear(), e.getMonth(), e.getDate());
}
//#endregion
//#region src/interactions/temporal-dom.ts
var K = "ui-temporal-input", KM = "ui-calendar", qM = `.${K}, .${KM}`, JM = "ui-temporal-input__value-input", YM = "ui-temporal-input__end-value-input", XM = "data-ui-temporal-range", ZM = "data-ui-temporal-end", QM = "data-ui-temporal-mode", $M = "data-ui-temporal-format", eN = "data-ui-temporal-default-format", tN = "data-ui-temporal-min", nN = "data-ui-temporal-max", rN = "data-ui-temporal-step", iN = "data-ui-temporal-step-unit", aN = "data-ui-temporal-marked-days", oN = "data-ui-temporal-marked-only", sN = "data-ui-temporal-page-culture", cN = "data-ui-temporal-months", lN = "data-ui-temporal-months-genitive", uN = "data-ui-temporal-months-short", dN = "data-ui-temporal-daynames", fN = "data-ui-temporal-weekdays", pN = "data-ui-temporal-first-day", mN = "data-ui-temporal-am", hN = "data-ui-temporal-pm", gN = /* @__PURE__ */ new Set([
	$M,
	eN,
	tN,
	nN,
	cN,
	mN,
	hN,
	aN,
	oN
]), _N = 2e3;
function vN(e) {
	let t = e.getAttribute(QM);
	return t === "time" || t === "date-time" ? t : "date";
}
function yN(e) {
	let t = e.getAttribute($M);
	return t === null || t.trim().length === 0 ? e.getAttribute(eN) ?? "" : t;
}
function bN(e) {
	let t = e.getAttribute(iN), n = Math.max(1, Math.trunc(Number(e.getAttribute(rN))) || 1);
	return {
		unit: t === "hour" || t === "minute" || t === "second" ? t : "day",
		hour: t === "hour" ? n : 1,
		minute: t === "minute" ? n : 1,
		second: t === "second" ? n : 1
	};
}
function xN(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function SN(e, t) {
	return t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function CN(e, t, n) {
	let r = new Date(e);
	return t === "hour" ? r.setHours(n) : t === "minute" ? r.setMinutes(n) : r.setSeconds(n), r;
}
function wN(e) {
	return {
		monthNames: TN(e, cN),
		monthGenitiveNames: TN(e, lN),
		abbreviatedMonthNames: TN(e, uN),
		dayNames: TN(e, dN),
		abbreviatedDayNames: TN(e, fN),
		amDesignator: e.getAttribute(mN) ?? "AM",
		pmDesignator: e.getAttribute(hN) ?? "PM"
	};
}
function TN(e, t) {
	return (e.getAttribute(t) ?? "").split("|");
}
function EN(e, t) {
	e.hasAttribute(sN) && (C(e, lN, t.monthGenitiveNames.join("|")), C(e, uN, t.abbreviatedMonthNames.join("|")), C(e, dN, t.dayNames.join("|")), C(e, fN, t.abbreviatedDayNames.join("|")), C(e, cN, t.monthNames.join("|")), C(e, mN, t.amDesignator), C(e, hN, t.pmDesignator), C(e, eN, kN(vN(e), bN(e), t)));
}
function DN(e) {
	for (let t = 0; t < e.length;) {
		let n = Gs(e, t);
		if (n === "h" || n === "hh") return !0;
		t += n?.length ?? 1;
	}
	return !1;
}
function ON(e, t, n) {
	if (!t) return String(e).padStart(2, "0");
	let r = e < 12 ? n.amDesignator : n.pmDesignator, i = String(fc(e));
	return r.length === 0 ? i : `${i} ${r}`;
}
function kN(e, t, n) {
	let r = t.unit === "second";
	return e === "date" ? n.date : e === "time" ? r ? n.longTime : n.shortTime : Is(n, r);
}
function AN(e) {
	return e.hasAttribute(XM);
}
function jN(e) {
	return e !== null && e.hasAttribute(ZM);
}
function MN(e) {
	return q(e, !1);
}
function q(e, t) {
	let n = NN(e, t);
	return n === null ? null : eP(n.value, vN(e));
}
function NN(e, t) {
	return e.querySelector(`.${t ? YM : JM}`);
}
function PN(e, t) {
	let n = e.getAttribute(t) ?? "", r = eP(n, vN(e)), i = WN(n);
	if (r === null || i === null) return r;
	let a = UN(e, !1), o = /* @__PURE__ */ new Date(FN(r) - IN(i) * 6e4);
	if (a !== null) {
		let e = new Date(o.getTime() + IN(a) * 6e4);
		return Zs(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate(), e.getUTCHours(), e.getUTCMinutes(), e.getUTCSeconds(), e.getUTCMilliseconds());
	}
	return LN(e) ? r : o;
}
function FN(e) {
	let t = /* @__PURE__ */ new Date(0);
	return t.setUTCFullYear(e.getFullYear(), e.getMonth(), e.getDate()), t.setUTCHours(e.getHours(), e.getMinutes(), e.getSeconds(), e.getMilliseconds()), t.getTime();
}
function IN(e) {
	let t = /^([+-])(\d{2}):?(\d{2})?$/.exec(e);
	return t === null ? 0 : (t[1] === "-" ? -1 : 1) * (Number(t[2]) * 60 + Number(t[3] ?? "0"));
}
function LN(e) {
	return (NN(e, !1)?.value.trim() ?? "").length > 0 || (NN(e, !0)?.value.trim() ?? "").length > 0;
}
function RN(e) {
	let t = PN(e, tN), n = PN(e, nN), r = (e.getAttribute(aN) ?? "").split(" ").filter((e) => e.length > 0);
	return {
		min: t === null ? null : tP(t, "date"),
		max: n === null ? null : tP(n, "date"),
		marked: new Set(r),
		markedOnly: e.hasAttribute(oN)
	};
}
function zN(e, t) {
	return (e.min === null || t >= e.min) && (e.max === null || t <= e.max) && (!e.markedOnly || e.marked.has(t));
}
function BN(e, t, n) {
	KN(e, t === null ? "" : VN(e, t, n), n);
}
function VN(e, t, n) {
	let r = vN(e), i = tP(t, r);
	return r === "date-time" ? i + (UN(e, n) ?? GN(t)) : i;
}
var HN = /T\d{1,2}:\d{1,2}(?::\d{1,2}(?:\.\d+)?)?(Z|[+-]\d{2}(?::?\d{2})?)$/i;
function UN(e, t) {
	return WN(NN(e, t)?.value ?? "") ?? WN(NN(e, !t)?.value ?? "");
}
function WN(e) {
	return HN.exec(e.trim())?.[1] ?? null;
}
function GN(e) {
	let t = -e.getTimezoneOffset(), n = Math.abs(t);
	return `${t < 0 ? "-" : "+"}${nP(Math.floor(n / 60))}:${nP(n % 60)}`;
}
function KN(e, t, n) {
	let r = NN(e, n);
	r !== null && r.value !== t && (r.value = t, r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function qN(e, t) {
	let n = t.trim(), r = n.length === 0 ? null : tc(n, yN(e), wN(e));
	return r === null ? n : tP(Xs(r), vN(e));
}
function JN(e) {
	if (!AN(e)) return;
	let t = {
		start: q(e, !1),
		end: q(e, !0)
	};
	if (UM(t) === t) return;
	let n = NN(e, !1)?.value ?? "";
	KN(e, NN(e, !0)?.value ?? "", !1), KN(e, n, !0);
}
function YN(e) {
	let t = PN(e, tN), n = PN(e, nN);
	if (t === null && n === null) return null;
	for (let r of AN(e) ? [!1, !0] : [!1]) {
		let i = q(e, r);
		if (i !== null && t !== null && i.getTime() < t.getTime()) return {
			key: "ui.value.before",
			args: { min: Bs(t, yN(e), wN(e)) }
		};
		if (i !== null && n !== null && i.getTime() > n.getTime()) return {
			key: "ui.value.after",
			args: { max: Bs(n, yN(e), wN(e)) }
		};
	}
	return null;
}
function XN(e) {
	return QN(e, ZN(e, /* @__PURE__ */ new Date()));
}
function ZN(e, t) {
	let n = PN(e, tN), r = PN(e, nN);
	return n !== null && t.getTime() < n.getTime() ? n : r !== null && t.getTime() > r.getTime() ? r : t;
}
function QN(e, t) {
	let n = bN(e), r = new Date(t);
	return r.setMilliseconds(0), r.setSeconds(n.unit === "second" ? Math.floor(r.getSeconds() / n.second) * n.second : 0), n.unit === "hour" ? r.setMinutes(0) : r.setMinutes(Math.floor(r.getMinutes() / n.minute) * n.minute), r.setHours(Math.floor(r.getHours() / n.hour) * n.hour), r;
}
var $N = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/;
function eP(e, t) {
	let n = e.trim();
	if (n.length === 0) return null;
	if (t === "time") {
		let e = $N.exec(n);
		return e === null ? null : new Date(_N, 0, 1, Number(e[1]), Number(e[2]), Number(e[3] ?? "0"));
	}
	let r = Ys(n);
	return r === null ? null : Xs(r);
}
function tP(e, t) {
	let n = `${nP(e.getHours())}:${nP(e.getMinutes())}:${nP(e.getSeconds())}`;
	if (t === "time") return n;
	let r = `${String(e.getFullYear()).padStart(4, "0")}-${nP(e.getMonth() + 1)}-${nP(e.getDate())}`;
	return t === "date" ? r : `${r}T${n}`;
}
function nP(e) {
	return String(e).padStart(2, "0");
}
//#endregion
//#region src/interactions/temporal-calendar.ts
var rP = "ui-temporal-input__day", iP = "ui-temporal-input__month", aP = 3, oP = "data-ui-temporal-nav", sP = "data-ui-temporal-day", cP = 366;
function lP(e) {
	let t = MN(e);
	return {
		view: NP(t ?? ZN(e, /* @__PURE__ */ new Date())),
		pane: "days",
		focusedDay: t,
		activeEnd: "start",
		hoverDay: null,
		choosingEnd: !1
	};
}
function uP(e, t, n, r) {
	let i = MP("div", `${K}__calendar`), a = MP("div", `${K}__calendar-header`), o = RN(e), s = jP("previous", "‹", D.text("ui.picker.previous"));
	s.disabled = dP(o, t, -1) === null, a.append(s);
	let c = jP("pane", t.pane === "days" ? `${n.monthNames[t.view.getMonth()]} ${t.view.getFullYear()}` : String(t.view.getFullYear()));
	c.classList.add(`${K}__calendar-label`), a.append(c);
	let l = jP("next", "›", D.text("ui.picker.next"));
	return l.disabled = dP(o, t, 1) === null, a.append(l), i.append(a), i.append(t.pane === "days" ? hP(e, t, n, r, o) : gP(t, n, o)), i;
}
function dP(e, t, n) {
	let r = t.pane === "months", i = IP(t.view, n * (r ? 12 : 1));
	return pP(e, fP(i, r ? 4 : 7)) ? mP(e, i) : null;
}
function fP(e, t) {
	return tP(e, "date").slice(0, t);
}
function pP(e, t) {
	return (e.min === null || t >= e.min.slice(0, t.length)) && (e.max === null || t <= e.max.slice(0, t.length));
}
function mP(e, t) {
	let n = fP(t, 7), r = e.min !== null && n < e.min.slice(0, 7) ? e.min : e.max !== null && n > e.max.slice(0, 7) ? e.max : null, i = r === null ? null : eP(r, "date");
	return i === null ? t : NP(i);
}
function hP(e, t, n, r, i) {
	let a = OP(e), o = MP("div", `${K}__weekdays`);
	for (let e = 0; e < 7; e++) {
		let t = MP("span", `${K}__weekday`);
		t.textContent = n.abbreviatedDayNames[(a + e) % 7], o.append(t);
	}
	let s = MP("div", `${K}__days`), c = GM(/* @__PURE__ */ new Date()), l = AN(e), u = l ? q(e, !1) : r, d = l ? q(e, !0) : null, f = l && VM({
		start: u,
		end: d
	}, t.choosingEnd), p = PP(t.view, a);
	for (let e = 0; e < 42; e++) {
		let n = FP(p, e), r = tP(n, "date"), a = MP("button", rP);
		a.type = "button", a.tabIndex = -1, a.textContent = String(n.getDate()), a.setAttribute(sP, r), n.getMonth() !== t.view.getMonth() && a.classList.add(`${rP}--outside`), LP(n, c) && (a.classList.add(`${rP}--today`), a.setAttribute("aria-current", "date")), i.marked.has(r) && a.classList.add(`${rP}--marked`);
		let o = u !== null && LP(n, u), m = d !== null && LP(n, d);
		a.setAttribute("aria-pressed", o || m ? "true" : "false"), (o || m) && a.classList.add(`${rP}--selected`), f && o && a.classList.add(`${rP}--period-start`), f && m && a.classList.add(`${rP}--period-end`), l && (o || m) && a.setAttribute("aria-description", D.text(o ? "ui.picker.start" : "ui.picker.end")), HM(n, {
			start: u,
			end: d
		}, t.choosingEnd) && a.classList.add(`${rP}--within`), zN(i, r) || (a.disabled = !0), s.append(a);
	}
	let m = MP("div", `${K}__calendar-pane`);
	return m.append(o, s), m;
}
function gP(e, t, n) {
	let r = MP("div", `${K}__months`);
	for (let i = 0; i < 12; i++) {
		let a = MP("button", iP);
		a.type = "button", a.textContent = t.abbreviatedMonthNames[i], a.setAttribute(oP, `month:${i}`), i === e.view.getMonth() && (a.classList.add(`${iP}--selected`), a.setAttribute("aria-current", "true")), pP(n, fP(Zs(e.view.getFullYear(), i, 1), 7)) || (a.disabled = !0), r.append(a);
	}
	let i = [...r.children];
	return N(i, i.find((e) => e.getAttribute("aria-current") === "true" && !e.disabled) ?? i.find((e) => !e.disabled) ?? null), r;
}
function _P(e, t) {
	let n = [...e.parentElement?.querySelectorAll(".ui-temporal-input__month") ?? []], r = n.indexOf(e), i = r === -1 ? null : vP(t, r % aP);
	if (i === null) return null;
	for (let e = r + i.offset; e >= 0 && e < n.length; e += i.step) if (!n[e].disabled) return n[e];
	return null;
}
function vP(e, t) {
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
			offset: aP,
			step: aP
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
function yP(e) {
	let t = MP("div", `${K}__period-caption`);
	return t.textContent = D.text(e.activeEnd === "end" ? "ui.picker.end" : "ui.picker.start"), t;
}
function bP(e, t, n) {
	let r = RN(e);
	if (n.startsWith("month:")) {
		let i = Zs(t.view.getFullYear(), Number(n.slice(6)), 1);
		return pP(r, fP(i, 7)) && (t.view = i, t.pane = "days", t.focusedDay = TP(r, wP(i, t.focusedDay ?? MN(e) ?? ZN(e, /* @__PURE__ */ new Date())))), !0;
	}
	switch (n) {
		case "previous": return t.view = dP(r, t, -1) ?? t.view, !0;
		case "next": return t.view = dP(r, t, 1) ?? t.view, !0;
		case "pane": return t.pane = t.pane === "days" ? "months" : "days", !0;
		default: return !1;
	}
}
function xP(e, t, n) {
	if (AN(e)) {
		SP(e, t, n);
		return;
	}
	let r = WM(n, MN(e) ?? XN(e));
	t.focusedDay = r, t.view = NP(r), BN(e, r, !1);
}
function SP(e, t, n) {
	let r = zM({
		start: q(e, !1),
		end: q(e, !0)
	}, t.activeEnd, WM(n, XN(e)));
	t.focusedDay = r.end ?? r.start, t.view = NP(n), t.activeEnd = r.active, t.choosingEnd = !r.complete, t.hoverDay = null, BN(e, r.end, !0), BN(e, r.start, !1);
}
function CP(e, t, n, r = !1) {
	let i = EP(n), a = DP(t, n, OP(e), r);
	if (a === null) return null;
	let o = RN(e);
	if (i === 0) return TP(o, a);
	let s = a;
	for (let e = 0; e < cP; e++) {
		if (zN(o, tP(s, "date"))) return s;
		s = FP(s, i);
	}
	return t;
}
function wP(e, t) {
	let n = Zs(e.getFullYear(), e.getMonth() + 1, 0).getDate();
	return Zs(e.getFullYear(), e.getMonth(), Math.min(t.getDate(), n), t.getHours(), t.getMinutes(), t.getSeconds());
}
function TP(e, t) {
	let n = tP(t, "date"), r = e.min !== null && n < e.min ? e.min : e.max !== null && n > e.max ? e.max : null, i = r === null ? null : eP(r, "date");
	return i === null ? t : WM(i, t);
}
function EP(e) {
	switch (e) {
		case "ArrowLeft": return -1;
		case "ArrowRight": return 1;
		case "ArrowUp": return -7;
		case "ArrowDown": return 7;
		default: return 0;
	}
}
function DP(e, t, n, r) {
	let i = (e.getDay() - n + 7) % 7;
	switch (t) {
		case "ArrowLeft": return FP(e, -1);
		case "ArrowRight": return FP(e, 1);
		case "ArrowUp": return FP(e, -7);
		case "ArrowDown": return FP(e, 7);
		case "PageUp": return IP(e, r ? -12 : -1);
		case "PageDown": return IP(e, r ? 12 : 1);
		case "Home": return FP(e, -i);
		case "End": return FP(e, 6 - i);
		default: return null;
	}
}
function OP(e) {
	let t = Number(e.getAttribute(pN));
	return Number.isInteger(t) && t >= 0 && t <= 6 ? t : 1;
}
function kP(e, t, n, r) {
	let i = [...e.querySelectorAll(`.${rP}`)];
	if (i.length === 0) return;
	let a = tP(GM(t.focusedDay ?? n ?? /* @__PURE__ */ new Date()), "date"), o = i.find((e) => e.getAttribute("data-ui-temporal-day") === a && !e.disabled) ?? i.find((e) => !e.disabled);
	o !== void 0 && (N(i, o), r && R(o));
}
function AP(e, t) {
	let n = t.activeEnd === "end" && t.hoverDay !== null ? q(e, !1) : null, r = t.hoverDay, i = n !== null && r !== null && GM(r).getTime() > GM(n).getTime();
	for (let t of e.querySelectorAll(`.${rP}`)) {
		let e = eP(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		t.classList.toggle(`${rP}--preview`, i && e !== null && BM(e, n, FP(r, 1))), t.classList.toggle(`${rP}--preview-start`, i && e !== null && LP(e, n)), t.classList.toggle(`${rP}--preview-end`, i && e !== null && LP(e, r));
	}
}
function jP(e, t, n) {
	let r = MP("button", `${K}__nav`);
	return r.type = "button", r.textContent = t, r.setAttribute(oP, e), n !== void 0 && r.setAttribute("aria-label", n), r;
}
function MP(e, t) {
	let n = document.createElement(e);
	return n.className = t, n;
}
function NP(e) {
	return Zs(e.getFullYear(), e.getMonth(), 1);
}
function PP(e, t) {
	let n = NP(e);
	return FP(n, -((n.getDay() - t + 7) % 7));
}
function FP(e, t) {
	return Zs(e.getFullYear(), e.getMonth(), e.getDate() + t, e.getHours(), e.getMinutes(), e.getSeconds());
}
function IP(e, t) {
	let n = Zs(e.getFullYear(), e.getMonth() + t, 1), r = Zs(n.getFullYear(), n.getMonth() + 1, 0).getDate();
	return Zs(n.getFullYear(), n.getMonth(), Math.min(e.getDate(), r), e.getHours(), e.getMinutes(), e.getSeconds());
}
function LP(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
//#endregion
//#region src/interactions/temporal-picker-engine.ts
var RP = "ui-temporal-input__field", zP = "ui-temporal-input__popup", BP = "ui-temporal-input--open", VP = "ui-calendar__body", HP = "ui-temporal-input__time-cell", UP = "ui-temporal-input__time-column", WP = 140, GP = "data-ui-temporal-toggle", KP = "data-ui-temporal-unit", qP = "data-ui-temporal-cell", JP = "data-ui-temporal-centred", YP = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	written = /* @__PURE__ */ new WeakSet();
	drawnLanguage = document.documentElement.lang;
	popups = new Qv({
		show: ({ owner: e, popup: t }) => {
			e.classList.add(BP), t.addEventListener("wheel", this.onColumnWheel, { passive: !1 }), this.renderSurface(e, !0);
		},
		hide: ({ owner: e, popup: t }) => {
			for (let [t, n] of [...this.columnSettles]) window.clearTimeout(n), this.chooseCentredTime(e, t);
			this.columnSettles.clear(), this.wheelTurns.clear(), t.removeEventListener("wheel", this.onColumnWheel), e.classList.remove(BP);
		}
	});
	columnSettles = /* @__PURE__ */ new Map();
	wheelTurns = /* @__PURE__ */ new Map();
	onColumnWheel = (e) => this.handleColumnWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.arrive(this.root.querySelectorAll(qM)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = Ya(e.components, qM), n = e.propertyName === "Value" || e.propertyName === "EndValue";
			this.applyDisplay(t);
			for (let e of t) n && XP(e) && this.states.set(e, lP(e)), this.isShowing(e) && this.renderSurface(e);
		}), V(this.root, qM, { attributeFilter: [...gN] }, (e) => {
			for (let t of e) this.applyDisplay([t]), this.isShowing(t) && this.renderSurface(t);
		}), V(this.root, qM, {
			childList: !0,
			addedOnly: !0
		}, (e) => this.arrive(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), this.root.addEventListener("focusin", (e) => this.handleFieldFocus(e), !0), this.root.addEventListener("mouseover", (e) => this.handleDayHover(e), !0), this.root.addEventListener("mouseout", (e) => this.handleDayHover(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("scroll", (e) => this.handleColumnScroll(e), !0), this.root.addEventListener("blur", (e) => this.handleFieldBlur(e), !0), D.onChange(() => this.applyWords());
	}
	arrive(e) {
		let t = [...e];
		this.applyDisplay(t);
		for (let e of t) XP(e) && ZP(e)?.firstElementChild === null && this.renderSurface(e);
	}
	applyWords() {
		let e = [...this.root.querySelectorAll(qM)], t = D.temporal;
		if (t !== null && D.language !== this.drawnLanguage) {
			this.drawnLanguage = D.language;
			for (let n of e) EN(n, t);
		}
		this.applyDisplay(e);
		for (let t of e) this.isShowing(t) && this.renderSurface(t);
	}
	get openPicker() {
		return this.popups.current;
	}
	isShowing(e) {
		return e === this.openPicker || XP(e);
	}
	calendarFor(e) {
		if (!(e instanceof Element)) return null;
		let t = e.closest(`.${VP}`)?.closest(".ui-calendar") ?? null;
		if (t !== null) return t;
		let n = this.openPicker;
		return n !== null && ZP(n)?.contains(e) === !0 ? n : null;
	}
	applyDisplay(e) {
		for (let t of e) {
			let e = $s(yN(t), uF()), n = Ws(yN(t)) ? "numeric" : "text";
			for (let r of t.querySelectorAll(`.${RP}`)) {
				if (r.placeholder !== e && (r.placeholder = e), r.inputMode !== n && (r.inputMode = n), r === document.activeElement && this.written.has(r)) continue;
				this.written.add(r);
				let i = NN(t, jN(r))?.value ?? "", a = eP(i, vN(t));
				a === null ? i.length === 0 && (r.value = "") : r.value = Bs(a, yN(t), wN(t));
			}
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(RP)) return;
		let t = e.target.closest(`.${K}`), n = t === null ? null : NN(t, jN(e.target));
		if (t === null || n === null) return;
		let r = qN(t, e.target.value), i = eP(r, vN(t)), a = i === null ? r : VN(t, i, jN(e.target));
		if (QP(t, a)) {
			let n = q(t, jN(e.target));
			e.target.value = n === null ? "" : Bs(n, yN(t), wN(t));
		} else jN(e.target) && (this.getState(t).choosingEnd = !1), n.value = a, n.dispatchEvent(new Event("change", { bubbles: !0 })), JN(t), this.applyDisplay([t]);
	}
	handleFieldFocus(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(RP)) return;
		let t = e.target.closest(`.${K}`);
		t !== null && AN(t) && (this.getState(t).activeEnd = jN(e.target) ? "end" : "start");
	}
	handleDayHover(e) {
		let t = this.calendarFor(e.target);
		if (t === null || !(e.target instanceof Element) || !AN(t)) return;
		let n = e.type === "mouseover" ? e.target.closest(`[${sP}]`) : null, r = this.getState(t), i = n === null ? null : eP(n.getAttribute("data-ui-temporal-day") ?? "", "date");
		(r.hoverDay?.getTime() ?? null) !== (i?.getTime() ?? null) && (r.hoverDay = i, AP(t, r));
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`[${sP}], .${HP}`) : null, n = this.calendarFor(t);
		n === null || t === null || t === document.activeElement || t.matches(":disabled") || (t.classList.contains(HP) ? pF(t) : this.followPointer(n, t));
	}
	followPointer(e, t) {
		let n = ZP(e), r = eP(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		n !== null && r !== null && n.contains(document.activeElement) && (this.getState(e).focusedDay = r, N([...n.querySelectorAll(`.${rP}`)], t), qp(t));
	}
	handleFieldBlur(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(RP)) return;
		let t = e.target.closest(`.${K}`);
		t !== null && this.applyDisplay([t]);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${GP}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${K}`));
			return;
		}
		let n = this.calendarFor(e.target);
		if (n === null) return;
		let r = e.target.closest(`[${oP}]`);
		if (r !== null) {
			e.preventDefault(), this.applyNavigation(n, r.getAttribute("data-ui-temporal-nav") ?? "");
			return;
		}
		let i = e.target.closest(`[${sP}]`);
		if (i !== null) {
			e.preventDefault(), this.chooseDay(n, i.getAttribute("data-ui-temporal-day") ?? "");
			return;
		}
		let a = e.target.closest(`[${qP}]`);
		if (a !== null) {
			e.preventDefault();
			let t = a.closest(`[${KP}]`)?.getAttribute(KP);
			t != null && this.chooseTime(n, t, Number(a.getAttribute(qP)));
		}
	}
	applyNavigation(e, t) {
		let n = this.getState(e);
		if (bP(e, n, t)) this.renderSurface(e);
		else switch (t) {
			case "now":
				n.choosingEnd = !1, this.commit(e, XN(e), n.activeEnd === "end");
				return;
			case "clear":
				this.commit(e, null), AN(e) && this.commit(e, null, !0), n.activeEnd = "start", n.choosingEnd = !1, this.close();
				return;
			case "done":
				this.close();
				return;
			default: return;
		}
	}
	chooseDay(e, t) {
		let n = eP(t, "date");
		if (n === null || A(e) || O(e) || !zN(RN(e), t)) return;
		let r = this.getState(e);
		XP(e) && AN(e) && !r.choosingEnd && q(e, !1) !== null && q(e, !0) !== null && (r.activeEnd = "start");
		let i = NN(e, !1), a = `${i?.value ?? ""}|${NN(e, !0)?.value ?? ""}`;
		xP(e, r, n), XP(e) && `${i?.value ?? ""}|${NN(e, !0)?.value ?? ""}` === a && i?.dispatchEvent(new Event("change", { bubbles: !0 })), this.applyDisplay([e]), this.renderSurface(e);
	}
	chooseTime(e, t, n) {
		if (!Number.isFinite(n)) return;
		let r = AN(e) && this.getState(e).activeEnd === "end", i = CN(q(e, r) ?? XN(e), t, n);
		this.commit(e, i, r);
	}
	commit(e, t, n = !1) {
		BN(e, t, n), JN(e), this.applyDisplay([e]), this.isShowing(e) && this.renderSurface(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || j(e)) return;
		if (e.key === "ArrowDown" && M(e, { alt: !0 }) && e.target instanceof HTMLElement && e.target.classList.contains(RP)) {
			e.preventDefault(), this.toggle(e.target.closest(`.${K}`), jN(e.target) ? "end" : "start");
			return;
		}
		let t = this.calendarFor(e.target);
		if (t === null) return;
		if (e.target instanceof HTMLElement && e.target.classList.contains(HP)) {
			M(e) && hF(e);
			return;
		}
		if (e.target instanceof HTMLElement && e.target.classList.contains("ui-temporal-input__month")) {
			M(e) && mF(e, e.target);
			return;
		}
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains("ui-temporal-input__day") || !M(e, { shift: e.key === "PageUp" || e.key === "PageDown" })) return;
		let n = eP(e.target.getAttribute("data-ui-temporal-day") ?? "", "date");
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault(), this.chooseDay(t, tP(n, "date"));
			return;
		}
		let r = CP(t, n, e.key, e.shiftKey);
		if (r === null) return;
		e.preventDefault();
		let i = this.getState(t);
		i.focusedDay = r, i.view = NP(r), this.renderSurface(t, !0);
	}
	handleColumnScroll(e) {
		let t = this.openPicker;
		if (t === null || !(e.target instanceof Element)) return;
		let n = e.target.closest(`.${UP}`);
		n !== null && t.contains(n) && (window.clearTimeout(this.columnSettles.get(n)), this.columnSettles.set(n, window.setTimeout(() => {
			this.columnSettles.delete(n), this.chooseCentredTime(t, n);
		}, WP)));
	}
	handleColumnWheel(e) {
		if (this.openPicker === null || e.deltaY === 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${UP}`), n = t?.getAttribute(KP) ?? null;
		if (t === null || n === null || !this.openPicker.contains(t)) return;
		e.preventDefault();
		let { steps: r, carried: i } = Wx(this.wheelTurns.get(n) ?? 0, Ux(e).y);
		if (this.wheelTurns.set(n, i), r === 0) return;
		let a = [...t.querySelectorAll(`.${HP}`)].filter((e) => !e.disabled), o = a.findIndex((e) => e.classList.contains(`${HP}--selected`)), s = a[Math.min(a.length - 1, Math.max(0, Math.max(0, o) + r))];
		s !== void 0 && !s.classList.contains(`${HP}--selected`) && this.chooseTime(this.openPicker, n, Number(s.getAttribute(qP)));
	}
	chooseCentredTime(e, t) {
		if (!e.isConnected || !e.contains(t) || A(e) || O(e)) return;
		let n = Number(t.getAttribute(JP));
		if (Number.isFinite(n) && Math.abs(t.scrollTop - n) <= 1) return;
		let r = t.getAttribute(KP), i = aF(t);
		r === null || i === null || i.classList.contains(`${HP}--selected`) || (i.matches(":disabled") ? rF(e) : this.chooseTime(e, r, Number(i.getAttribute(qP))));
	}
	toggle(e, t) {
		let n = e?.querySelector(`.${zP}`) ?? null;
		if (e === null || n === null) return;
		if (this.openPicker === e) {
			this.close();
			return;
		}
		this.close();
		let r = this.getState(e);
		r.activeEnd = AN(e) ? t ?? (q(e, !1) === null ? "start" : q(e, !0) === null ? "end" : r.activeEnd) : "start", r.hoverDay = null, r.choosingEnd = !1;
		let i = q(e, r.activeEnd === "end") ?? MN(e);
		r.pane = "days", r.view = NP(i ?? ZN(e, /* @__PURE__ */ new Date())), r.focusedDay = i;
		let a = e.querySelector(`[${GP}]`);
		this.popups.open({
			owner: e,
			popup: n,
			anchor: e.querySelector(".ui-temporal-input__row") ?? e,
			placement: { placement: "bottom-end" },
			openers: a === null ? [] : [a],
			returnFocus: () => fF(e, this.getState(e).activeEnd === "end")
		});
	}
	close() {
		this.popups.close();
	}
	getState(e) {
		let t = this.states.get(e);
		return t === void 0 && (t = lP(e), this.states.set(e, t)), t;
	}
	renderSurface(e, t = !1) {
		let n = ZP(e);
		if (n === null) return;
		let r = XP(e), i = vN(e), a = this.getState(e), o = wN(e), s = AN(e), c = q(e, s && a.activeEnd === "end"), l = oF(n), u = sF(n), d = n.contains(document.activeElement);
		if (n.replaceChildren(), s && n.append(yP(a)), r) n.append(uP(e, a, o, c));
		else {
			let t = MP("div", `${K}__panes`);
			t.append(uP(e, a, o, c)), i === "date-time" && t.append($P(e, c)), n.append(t, lF(i));
		}
		let f = u === null ? null : n.querySelector(`[${oP}="${S(u)}"]:not(:disabled)`);
		kP(n, a, c, t || d && l === null && f === null), AP(e, a), r || (nF(n), rF(n), cF(n, l)), f !== null && R(f), r || this.popups.reposition(e);
	}
};
function XP(e) {
	return e.classList.contains(KM);
}
function ZP(e) {
	return e.querySelector(`.${XP(e) ? VP : zP}`);
}
function QP(e, t) {
	let n = RN(e), r = n.markedOnly ? eP(t, vN(e)) : null;
	return r !== null && !n.marked.has(tP(r, "date"));
}
function $P(e, t) {
	let n = bN(e), r = MP("div", `${K}__time`), i = MP("div", `${K}__time-columns`);
	for (let r of eF(n)) i.append(tF(e, r, xN(n, r), t));
	return r.append(i), r;
}
function eF(e) {
	return e.unit === "second" ? [
		"hour",
		"minute",
		"second"
	] : e.unit === "hour" ? ["hour"] : ["hour", "minute"];
}
function tF(e, t, n, r) {
	let i = MP("div", UP);
	i.setAttribute(KP, t), i.setAttribute("role", "listbox"), i.setAttribute("aria-label", D.text(t === "hour" ? "ui.picker.hours" : t === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"));
	let a = t === "hour" ? 24 : 60, o = r === null ? null : SN(r, t), s = t === "hour" && DN(yN(e)), c = wN(e), l = null;
	for (let u = 0; u < a; u += n) {
		let n = MP("button", HP);
		n.type = "button", n.tabIndex = -1, n.textContent = t === "hour" ? ON(u, s, c) : String(u).padStart(2, "0"), n.setAttribute(qP, String(u)), n.setAttribute("role", "option"), n.setAttribute("aria-selected", u === o ? "true" : "false"), u === o && n.classList.add(`${HP}--selected`), yF(e, t, u, r) ? n.disabled = !0 : (l === null || u === o) && (l = n), i.append(n);
	}
	return l !== null && (l.tabIndex = 0), i;
}
function nF(e) {
	let t = e.querySelector(`.${K}__calendar`), n = e.querySelector(`.${K}__time-columns`);
	t !== null && n !== null && (n.style.maxHeight = `${t.clientHeight}px`);
}
function rF(e) {
	for (let t of e.querySelectorAll(`.${UP}`)) {
		let e = t.querySelector(`.${HP}--selected`) ?? t.firstElementChild;
		if (!(e instanceof HTMLElement)) continue;
		let n = Math.max(0, (t.clientHeight - e.getBoundingClientRect().height) / 2);
		t.style.paddingTop = `${n}px`, t.style.paddingBottom = `${n}px`, iF(t, e), t.setAttribute(JP, String(t.scrollTop));
	}
}
function iF(e, t) {
	let n = t.getBoundingClientRect();
	e.scrollTop += n.top - e.getBoundingClientRect().top - (e.clientHeight - n.height) / 2;
}
function aF(e) {
	let t = e.getBoundingClientRect().top + e.clientHeight / 2, n = null, r = Infinity;
	for (let i of e.querySelectorAll(`.${HP}`)) {
		let e = i.getBoundingClientRect(), a = Math.abs(e.top + e.height / 2 - t);
		a < r && (r = a, n = i);
	}
	return n;
}
function oF(e) {
	let t = document.activeElement;
	return !(t instanceof HTMLElement) || !e.contains(t) || !t.classList.contains(HP) ? null : t.closest(`.${UP}`)?.getAttribute(KP) ?? null;
}
function sF(e) {
	let t = document.activeElement;
	return t instanceof HTMLElement && e.contains(t) ? t.getAttribute(oP) : null;
}
function cF(e, t) {
	if (t === null) return;
	let n = e.querySelector(`.${UP}[${KP}="${t}"]`)?.querySelector(`.${HP}--selected`) ?? null;
	n !== null && R(n);
}
function lF(e) {
	let t = MP("div", `${K}__popup-footer`);
	return t.append(jP("now", D.text(e === "date" ? "ui.picker.today" : "ui.picker.now"))), t.append(jP("clear", D.text("ui.picker.clear"))), t.append(jP("done", D.text("ui.picker.done"))), t;
}
function uF() {
	return {
		year: dF("ui.picker.letter.year", Qs.year),
		month: dF("ui.picker.letter.month", Qs.month),
		day: dF("ui.picker.letter.day", Qs.day),
		hour: dF("ui.picker.letter.hour", Qs.hour),
		minute: dF("ui.picker.letter.minute", Qs.minute),
		second: dF("ui.picker.letter.second", Qs.second)
	};
}
function dF(e, t) {
	let n = D.lookup(e);
	return n === void 0 || n.trim().length === 0 ? t : n;
}
function fF(e, t) {
	for (let n of e.querySelectorAll(`.${RP}`)) if (jN(n) === t) return n;
	return e.querySelector(`.${RP}`);
}
function pF(e) {
	let t = document.activeElement;
	t instanceof HTMLElement && t.classList.contains(HP) && qp(e);
}
function mF(e, t) {
	if (!xd(e.key, "both")) return;
	e.preventDefault();
	let n = _P(t, e.key);
	Cd([...n?.parentElement?.children ?? []], n);
}
function hF(e) {
	let t = e.target, n = t.closest(`.${UP}`);
	if (n === null) return;
	let r = e.key === "ArrowLeft" || e.key === "ArrowRight" ? _F(n, e.key === "ArrowRight" ? 1 : -1) : gF(n, t, e.key);
	r !== null && (e.preventDefault(), r.focus({ preventScroll: !0 }), vF(r));
}
function gF(e, t, n) {
	let r = [...e.querySelectorAll(`.${HP}`)];
	return n === "PageUp" || n === "PageDown" ? op(n, r.filter(P), t, "vertical") ?? t : bd({
		key: n,
		items: r,
		current: t,
		axis: "vertical",
		loop: !1
	});
}
function _F(e, t) {
	let n = [...e.parentElement?.querySelectorAll(`.${UP}`) ?? []], r = n[n.indexOf(e) + t];
	return r === void 0 ? null : r.querySelector(`.${HP}--selected`) ?? r.querySelector(`.${HP}:not(:disabled)`);
}
function vF(e) {
	let t = e.closest(`.${UP}`);
	t !== null && (iF(t, e), t.setAttribute(JP, String(t.scrollTop)));
}
function yF(e, t, n, r) {
	let i = PN(e, tN), a = PN(e, nN);
	if (i === null && a === null) return !1;
	let o = CN(r ?? XN(e), t, n), s = new Date(o), c = new Date(o);
	return t === "hour" ? (s.setMinutes(0, 0, 0), c.setMinutes(59, 59, 999)) : t === "minute" && (s.setSeconds(0, 0), c.setSeconds(59, 999)), i !== null && c.getTime() < i.getTime() || a !== null && s.getTime() > a.getTime();
}
//#endregion
//#region src/rendering/theme-choice.ts
var bF = `[${Qr}="${ei}"] [${$r}]`, xF = "ui-theme-switcher__label-text--current";
function SF() {
	let e = document.documentElement.getAttribute(Jr);
	return e === "light" || e === "dark" ? e : "auto";
}
function CF(e, t) {
	let n = e.getAttribute($r) === t;
	if (e.getAttribute("role") === "option") {
		let t = n ? "true" : "false";
		e.getAttribute("aria-selected") !== t && e.setAttribute("aria-selected", t);
	} else e.classList.toggle(xF, n);
}
//#endregion
//#region src/interactions/popup-list.ts
var wF = new fD();
function TF(e, t, n, r, i = !1, a = !0) {
	let o = r ?? (a ? null : n.find(P) ?? null);
	o !== null && N(n, o);
	let s = e.open({
		...t,
		focus: a && r !== null ? r : !1
	});
	return s && a && r === null && lm(t.popup, n, i), s;
}
function EF(e, t) {
	let n = e.target instanceof HTMLElement && t.includes(e.target) ? e.target : null, r = pD(e);
	if (r !== null) return e.preventDefault(), Cd(t, OF(t, n, r)), !0;
	if (!xd(e.key, "vertical") || !M(e)) return !1;
	let i = bd({
		key: e.key,
		items: t,
		current: n,
		axis: "vertical"
	});
	return i !== null && e.preventDefault(), Cd(t, i), !0;
}
var DF = {
	character: pD,
	entry: OF
};
function OF(e, t, n) {
	let r = e.filter(P), i = r[0]?.parentElement;
	return i == null ? null : wF.next({
		owner: i,
		character: n,
		entries: r,
		current: t,
		words: dv,
		context: i
	});
}
function kF(e, t) {
	e !== document.activeElement && P(e) && (N(t, e), qp(e));
}
//#endregion
//#region src/interactions/switcher-list.ts
var AF = class {
	parts;
	selector;
	menus;
	constructor(e) {
		this.parts = e, this.selector = `[${e.attribute}]`, this.menus = new Qv({
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
		return e.getAttribute(this.parts.attribute) === ei;
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
		TF(this.menus, {
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
		i !== null && t(n, r) && !this.menus.isOpen(n) && (e.key === "ArrowDown" || e.key === "ArrowUp") && M(e) ? (e.preventDefault(), this.open(n, i, e.key === "ArrowUp")) : this.menus.isOpen(n) && EF(e, r);
	}
	handlePointerMove(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${this.parts.choiceClass}`), n = t === null ? null : this.switcherOf(t);
		t !== null && n !== null && this.menus.isOpen(n) && kF(t, this.choicesOf(n));
	}
}, jF = `[${Qr}="${ei}"]`, MF = "ui-theme-switcher__choice", NF = class {
	options;
	root;
	list = new AF({
		attribute: Qr,
		menuClass: "ui-theme-switcher__menu",
		choiceClass: MF,
		openClass: "ui-theme-switcher--open",
		triggerSelector: `.${Li}`
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.list.handleKeyDown(e, (e) => this.list.isField(e))), this.root.addEventListener("pointermove", (e) => this.list.handlePointerMove(e)), new MutationObserver(() => this.showTheme()).observe(document.documentElement, {
			attributes: !0,
			attributeFilter: [Jr]
		}), V(this.root, jF, {
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
			e.preventDefault(), this.apply(PF() === "dark" ? "Light" : "Dark");
			return;
		}
		let n = e.target.closest(`.${MF}`);
		if (n !== null) {
			e.preventDefault(), this.choose(t, n.getAttribute($r));
			return;
		}
		let r = e.target.closest(`.${Li}`);
		r === null || O(r) || (e.preventDefault(), this.list.toggle(t, r));
	}
	choose(e, t) {
		this.list.close(e), t !== null && this.apply(t === "light" ? "Light" : t === "dark" ? "Dark" : null);
	}
	apply(e) {
		this.options.effects.apply({
			effect: {
				kind: sa.SetTheme,
				mode: e
			},
			dom: this.options.dom
		});
	}
	showTheme(e) {
		let t = SF();
		if (e === void 0) for (let e of this.root.querySelectorAll(bF)) CF(e, t);
		else for (let n of e) for (let e of n.querySelectorAll(`[${$r}]`)) CF(e, t);
	}
};
function PF() {
	let e = SF();
	return e === "light" || e === "dark" ? e : window.matchMedia?.("(prefers-color-scheme: dark)").matches === !0 ? "dark" : "light";
}
//#endregion
//#region src/interactions/language-switcher-engine.ts
var FF = `.ui-language-switcher__trigger, .${Li}`, IF = "ui-language-switcher__label-text", LF = "ui-language-switcher__label-text--current", RF = "ui-language-switcher__label-text--page", zF = "ui-language-switcher__choice", BF = "ui.language.switch", VF = "ui.language.current", HF = class {
	options;
	root;
	list = new AF({
		attribute: Zr,
		menuClass: "ui-language-switcher__menu",
		choiceClass: zF,
		openClass: "ui-language-switcher--open",
		triggerSelector: FF
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.list.handleKeyDown(e, (e, t) => this.opensList(e, t))), this.root.addEventListener("pointermove", (e) => this.list.handlePointerMove(e)), D.onChange(() => this.showLanguage(D.language));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${zF}`), n = this.list.switcherOf(e.target);
		if (n === null) return;
		if (t !== null) {
			e.preventDefault(), this.choose(n, t.getAttribute(ti));
			return;
		}
		let r = e.target.closest(FF);
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
				kind: sa.SetLanguage,
				language: t
			},
			dom: this.options.dom
		});
	}
	showLanguage(e) {
		for (let t of this.root.querySelectorAll(`[${Zr}]`)) {
			let n = t.querySelector(`:scope > :is(${FF})`);
			if (n === null) continue;
			let r = this.list.choicesOf(t), i = this.list.chosenAttribute(t);
			for (let t of r) t.setAttribute(i, t.getAttribute("data-ui-language") === e ? "true" : "false");
			for (let t of n.querySelectorAll(`.${IF}`)) {
				let n = t.getAttribute(ti) === e;
				t.classList.toggle(LF, n), t.classList.contains(RF) && t.toggleAttribute("hidden", !n);
			}
			if (this.list.isField(t)) continue;
			let a = UF(dl(t, ze)), o = (r.find((t) => t.getAttribute("data-ui-language") !== e) ?? r[0]).getAttribute("data-ui-language") ?? "", [s, c] = r.length === 2 ? [BF, {
				language: WF(r, e),
				code: GF(e),
				other: WF(r, o),
				otherCode: GF(o)
			}] : [VF, {
				language: WF(r, e),
				code: GF(e)
			}];
			D.write(n, "aria-label", s, c), a && D.write(t, ze, s, c);
		}
	}
};
function UF(e) {
	return E(e) && (e.key === BF || e.key === VF);
}
function WF(e, t) {
	let n = e.find((e) => e.getAttribute(ti) === t)?.textContent;
	if (n != null && n.length > 0) return n;
	try {
		let e = new Intl.DisplayNames([t], { type: "language" }).of(t) ?? t;
		return e.charAt(0).toLocaleUpperCase(t) + e.slice(1);
	} catch {
		return GF(t);
	}
}
function GF(e) {
	return e.split("-")[0].toUpperCase();
}
//#endregion
//#region src/interactions/action-bar.ts
var KF = `${Ne}__button`, qF = `${Ne}__more`, JF = `${KF}--icon`, YF = "ui-text__icon", XF = `.ui-button__content .${YF}`, ZF = ".ui-button__content .ui-text__title", QF = /* @__PURE__ */ new WeakMap();
function $F(e) {
	let t = [], n = !1;
	for (let r of e.querySelectorAll(Yn)) eI(r, e) && (r.hasAttribute("data-ui-in-action-bar") && !r.matches("[data-ui-menu-group] > .ui-menu-item") ? t.push(r) : n = !0);
	return {
		entries: t,
		more: n
	};
}
function eI(e, t) {
	for (let n = e; n !== null && n !== t; n = n.parentElement) if (!n.hasAttribute("data-ui-menu-left-out") && getComputedStyle(n).display === "none") return !1;
	return getComputedStyle(e).visibility !== "hidden";
}
function tI(e, t) {
	let n = t.entries.map((e) => nI(e, t));
	return t.more && t.openMore !== void 0 && n.push(iI(t.openMore)), e.replaceChildren(...n), n;
}
function nI(e, t) {
	let n = aI(KF), r = sI(e), i = rI(e);
	return i === null ? n.textContent = r : (n.classList.add(JF), n.append(i), n.setAttribute("aria-label", r)), t.role === "menuitem" && n.setAttribute("role", "menuitem"), O(e) && (n.classList.add(Di), n.setAttribute("aria-disabled", "true")), e.getAttribute("data-ui-menu-item-kind") === "check" && n.setAttribute("aria-pressed", e.getAttribute("aria-checked") === "true" ? "true" : "false"), QF.set(n, e), n.addEventListener("click", () => t.press(e, n)), n;
}
function rI(e) {
	let t = e.querySelector(XF);
	if (t === null || !t.className.split(" ").some(Lo)) return null;
	let n = document.createElement("span");
	n.className = t.className, n.classList.remove(YF), n.setAttribute(No, ""), n.setAttribute("aria-hidden", "true");
	let r = t.style.getPropertyValue(Po);
	return r.length > 0 && n.style.setProperty(Po, r), n;
}
function iI(e) {
	let t = aI(`${KF} ${qF}`);
	return t.setAttribute("aria-haspopup", "menu"), D.write(t, "aria-label", "ui.actionbar.more"), t.addEventListener("click", () => e(t)), t;
}
function aI(e) {
	let t = document.createElement("button");
	return t.setAttribute("type", "button"), t.className = `${e} ${Hi}`, t.tabIndex = -1, t;
}
function oI(e) {
	return QF.get(e) ?? null;
}
function sI(e) {
	return e.querySelector(ZF)?.textContent?.trim() ?? "";
}
//#endregion
//#region src/interactions/long-press.ts
var cI = 500, lI = 150, uI = 10, dI = /* @__PURE__ */ new WeakSet(), fI = "ui-long-press-hold", pI = "ui-long-press-hold-end";
function mI(e) {
	return dI.has(e);
}
var hI = class {
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
		let n = e.target, r = t.clientX ?? 0, i = t.clientY ?? 0, a = this.shows === void 0 ? null : setTimeout(() => this.showHold(), lI);
		this.press = {
			pointerId: t.pointerId ?? 0,
			x: r,
			y: i,
			target: n,
			timer: setTimeout(() => this.fireHeld(), cI),
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
		}, t.dispatchEvent(new CustomEvent(fI, {
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
		(t.part.isConnected ? t.part : this.root).dispatchEvent(new CustomEvent(pI, {
			bubbles: !0,
			detail: n
		}));
	}
	handleMove(e) {
		let t = e, n = this.press, r = this.openedAt;
		r !== null && t.pointerId === r.pointerId && Math.hypot((t.clientX ?? r.x) - r.x, (t.clientY ?? r.y) - r.y) > uI && (this.slid = !0, (this.answered?.closest("[data-ui-splitting]") ?? null) !== null && this.leaveMenuToDrag()), n !== null && t.pointerId === n.pointerId && Math.hypot((t.clientX ?? n.x) - n.x, (t.clientY ?? n.y) - n.y) > uI && this.cancel();
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
		dI.add(t), e.target.dispatchEvent(t), this.answered = t.defaultPrevented ? e.target : null, this.openedAt = this.answered === null ? null : {
			pointerId: e.pointerId,
			x: e.x,
			y: e.y
		}, this.endHold(this.answered !== null);
	}
	handleContextMenu(e) {
		if (dI.has(e)) return;
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
		this.dragging && n !== null && t.clientX !== void 0 && t.clientY !== void 0 && Math.hypot(t.clientX - n.x, t.clientY - n.y) > uI && this.leaveMenuToDrag();
	}
	endDrag() {
		this.dragging = !1;
	}
	handleClick(e) {
		let t = e.target instanceof Element ? e.target : null;
		this.answered === null || t === null || this.slid && t.closest("[data-ui-context-menu]") !== null || (this.answered = null, e.preventDefault(), e.stopImmediatePropagation());
	}
}, gI = [
	"md",
	"xl",
	"xxl"
], _I = {
	md: tg("md"),
	xl: tg("xl"),
	xxl: tg("xxl")
}, vI = tg("md");
function yI(e, t) {
	return bI(e) && !(e.hasAttribute(An(t)) && !SI(e, t) && xI(vI));
}
function bI(e) {
	let t = e.getAttribute(On);
	if (t === null) return !1;
	let n = _I[t];
	return n === void 0 || !xI(n);
}
function xI(e) {
	return typeof matchMedia == "function" && matchMedia(e).matches;
}
function SI(e, t) {
	return e.querySelector(`:scope > [${zn}="${S(t)}"][${jn}]`) !== null;
}
//#endregion
//#region src/rendering/menu-shape.ts
var CI = "data-ui-menu-rail-list", wI = ["left-side", "right-side"];
function TI(e) {
	let t = e.getAttribute(Nn), n = e.classList.contains(Gn);
	if (t === null && !n && !e.hasAttribute(CI)) return !1;
	let r = EI(e, t);
	return e.classList.toggle(Gn, r), e.toggleAttribute(CI, t === null && !r), r !== n;
}
function EI(e, t) {
	let n = DI(e);
	return n === null ? t === null || t.split(" ").includes(og()) : !n.hasAttribute("data-ui-rail-drawer") && (t === null || t.split(" ").includes("base"));
}
function DI(e) {
	let t = e.closest(`[${zn}]`), n = t?.getAttribute(zn), r = t?.parentElement;
	return t === null || n == null || !wI.includes(n) || r == null ? null : yI(r, n) ? t : null;
}
//#endregion
//#region src/state/client-store.ts
var OI = "ne.ui", kI = "boot", AI = /* @__PURE__ */ new Set(), jI = class {
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
		let r = this.resolveKey(e, kI);
		if (r !== null) try {
			let e = MI(window.localStorage.getItem(r));
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
		let n = e.getAttribute(Ye);
		if (n === null || n.length === 0) {
			let n = `${e.tagName}:${t}`;
			return AI.has(n) || (AI.add(n), l("client state is not kept for a component with no authored id.", {
				slot: t,
				component: e
			})), null;
		}
		return `${OI}:${n}:${t}`;
	}
};
function MI(e) {
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
var NI = "menu-current", PI = `[${pn}]`;
function FI(e) {
	for (let t = e.closest(PI); t !== null; t = t.parentElement?.closest(PI) ?? null) LI(t);
}
function II(e) {
	for (let t of e.querySelectorAll(PI)) LI(t);
	FI(e);
}
function LI(e) {
	let t = e.querySelector(`.${Wn}`) !== null;
	e.hasAttribute("data-ui-menu-holds-current") !== t && e.toggleAttribute(gn, t);
}
//#endregion
//#region src/updates/menu-icons.ts
var RI = "menu-icons", zI = "ui-menu__host", BI = `:scope > :not([${vn}]) > .${Hn}[${Yi}]`;
function VI(e) {
	let t = e.closest(`.${zI}`);
	t !== null && UI(t);
}
function HI(e) {
	for (let t of e.querySelectorAll(`.${zI}`)) UI(t);
}
function UI(e) {
	let t = e.querySelector(BI) !== null;
	e.hasAttribute("data-ui-menu-icons") !== t && e.toggleAttribute(_n, t);
}
//#endregion
//#region src/interactions/menu-group-engine.ts
var WI = "ui-menu__submenu", GI = pn, KI = hn, qI = "data-ui-menu-flyout", JI = `[${qI}], ${Ni}`, YI = "data-ui-menu-unfolded", XI = mn, ZI = "left-side", QI = "right-side", $I = "[data-ui-root]", eL = `[${Mn}] .${Vn}, .${Vn}[${Nn}]`, tL = "menu-open-group", nL = z.normal * 5, rL = $e("click"), iL = class {
	root;
	store = new jI();
	seenCollapsed = /* @__PURE__ */ new WeakMap();
	flyouts = new Qv({
		show: ({ owner: e, popup: t }) => {
			e.setAttribute(KI, ""), t.setAttribute(qI, "");
		},
		hide: ({ owner: e, popup: t }) => {
			e.removeAttribute(KI), queueMicrotask(() => Qh(t, nL, () => {
				this.flyouts.isOpen(e) || t.removeAttribute(qI);
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
		let t = this.root.querySelectorAll(`.${Vn}`);
		lL(t), this.reconcileEach(t);
		for (let e of t) II(e), HI(e);
		V(this.root, `.${Vn}`, {
			childList: !0,
			attributeFilter: [fn]
		}, (e) => {
			lL(e), this.reconcileEach(e);
			for (let t of e) II(t), HI(t);
		});
		for (let e of this.root.querySelectorAll(`[${GI}]`)) aL(e);
		V(this.root, `[${GI}]`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [KI]
		}, (e) => {
			for (let t of e) aL(t);
		}), ig(() => this.closeBarFlyout(), gI), ig(() => this.refitShapes()), V(this.root, $I, { attributeFilter: [An(ZI), An(QI)] }, () => this.refitShapes());
	}
	refitShapes() {
		let e = this.root.querySelectorAll(eL);
		lL(e), this.reconcileEach(e);
	}
	closeBarFlyout() {
		let e = this.flyouts.current;
		e !== null && e.closest("[data-ui-bottom-bar]") !== null && this.flyouts.close(e);
	}
	reconcileEach(e) {
		for (let t of e) {
			let e = hL(t), n = this.seenCollapsed.get(t);
			n !== e && (this.seenCollapsed.set(t, e), n === void 0 ? this.restore(t, e) : this.handleCollapsedChange(t, e));
		}
	}
	restore(e, t) {
		t ? this.closeGroups(e) : this.openResolvedGroup(e);
	}
	handleCollapsedChange(e, t) {
		this.flyouts.close(), oL(e), this.closeGroups(e), e.hasAttribute("data-ui-folding") && e.setAttribute(YI, ""), t || this.openResolvedGroup(e);
		for (let t of e.querySelectorAll(`[${GI}]`)) aL(t);
	}
	openResolvedGroup(e) {
		let t = this.groupOf(e.querySelector(`.${Wn}`), e);
		if (t !== null && !t.hasAttribute(XI)) {
			this.openInline(t);
			return;
		}
		let n = e.classList.contains("ui-menu--nested") ? null : this.store.read(e, tL), r = n === null ? null : this.findGroup(e, n);
		r !== null && this.openInline(r);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Hn}`), n = this.flyouts.current, r = n === null ? null : this.submenuOf(n);
		if (r !== null && r.contains(e.target)) {
			t !== null && r.contains(t) && uL(t) && this.flyouts.close();
			return;
		}
		let i = t === null ? null : this.ownGroupOf(t);
		if (t === null || i === null) {
			this.flyouts.close();
			return;
		}
		e.preventDefault();
		let a = i.closest(`.${Vn}`);
		a !== null && (mL(i) ? this.toggleFlyout(a, i, t) : this.toggleInline(a, i));
	}
	toggleInline(e, t) {
		let n = e.classList.contains(Kn);
		e.setAttribute(YI, ""), t.closest("[data-ui-menu-searching]") === null ? t.hasAttribute(KI) ? (t.removeAttribute(KI), n || this.store.write(e, tL, null)) : (this.closeGroups(e), this.openInline(t), n || this.store.write(e, tL, t.getAttribute(y))) : t.toggleAttribute(KI);
	}
	openInline(e) {
		e.setAttribute(KI, "");
	}
	closeGroups(e) {
		for (let t of e.querySelectorAll(`[${GI}][${KI}]`)) t.hasAttribute(XI) || t.removeAttribute(KI);
	}
	toggleFlyout(e, t, n) {
		let r = this.submenuOf(t);
		if (r === null) return;
		let i = this.flyouts.isOpen(t);
		if (this.flyouts.close(), i) return;
		oL(e), this.closeGroups(e);
		let a = n.closest(JI) ?? void 0;
		if (!this.flyouts.open({
			owner: t,
			popup: r,
			anchor: n,
			placement: {
				placement: `${sL(e)}-start`,
				surface: a,
				alignEntries: !0
			}
		})) return;
		let o = r.querySelector(`:scope > .${Vn}`);
		o !== null && !Bp() && lm(o, dL(o));
	}
	findGroup(e, t) {
		for (let n of e.querySelectorAll(`[${GI}]`)) if (n.getAttribute("data-ui-key") === t) return n;
		return null;
	}
	ownGroupOf(e) {
		return e.matches("[data-ui-menu-group] > .ui-menu-item") ? e.parentElement : null;
	}
	groupOf(e, t) {
		let n = e?.closest(`[${GI}]`) ?? null;
		return n !== null && t.contains(n) ? n : null;
	}
	submenuOf(e) {
		return e.querySelector(`:scope > .${WI}`);
	}
};
function aL(e) {
	let t = e.querySelector(`:scope > .${Hn}`);
	t !== null && (t.setAttribute(rL, ""), t.setAttribute(et, ""), t.setAttribute("aria-expanded", e.hasAttribute(KI) ? "true" : "false"), mL(e) ? t.setAttribute("aria-haspopup", "menu") : t.removeAttribute("aria-haspopup"));
}
function oL(e) {
	for (let t of e.querySelectorAll(`[${qI}]`)) t.removeAttribute(qI);
}
function sL(e) {
	return cL(e) ? "top" : e.classList.contains("ui-side--right") ? "left" : e.classList.contains("ui-side--top") ? "bottom" : e.classList.contains("ui-side--bottom") ? "top" : "right";
}
function cL(e) {
	let t = e.closest(`[${jn}]`);
	return e.classList.contains("ui-menu--rail") && t?.parentElement !== null && t?.parentElement !== void 0 && typeof matchMedia == "function" && yI(t.parentElement, ZI);
}
function lL(e) {
	for (let t of e) TI(t);
}
function uL(e) {
	let t = e.closest(`.${Hn}`);
	return t !== null && t.matches(".ui-menu-item:not([data-ui-menu-item-kind=\"header\"], [data-ui-menu-item-kind=\"separator\"])") && !t.matches("[data-ui-menu-group] > .ui-menu-item, .ui-menu-item[data-ui-menu-item-kind=\"check\"]") && !O(t);
}
function dL(e) {
	let t = [];
	for (let n of Ud(e)) {
		t.push(n);
		let e = n.matches("[data-ui-menu-group] > .ui-menu-item") ? n.parentElement : null, r = e === null || !e.hasAttribute(KI) || mL(e) ? null : e.querySelector(`:scope > .${WI} > .${Vn}`);
		r !== null && t.push(...dL(r));
	}
	return t;
}
function fL(e) {
	let t = pL(e), n = t?.closest(".ui-menu") ?? null;
	return t === null || n === null || mL(t) ? e : fL(n);
}
function pL(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(WI) && t.parentElement?.hasAttribute(GI) === !0 ? t.parentElement : null;
}
function mL(e) {
	let t = e.closest(`.${Vn}`);
	return e.hasAttribute(XI) || t !== null && hL(t);
}
function hL(e) {
	return e.hasAttribute("data-ui-collapsed") || e.classList.contains("ui-menu--rail");
}
var gL = "tabs:rename", _L = "tabs:pin", vL = "tabs:unpin", yL = "tabs:close", bL = "tabs:delete";
function xL(e) {
	let t = (e ?? "").split(/\s+/);
	return {
		rename: t.includes("rename"),
		pin: t.includes("pin"),
		close: t.includes("close"),
		delete: t.includes("delete")
	};
}
function SL(e, t) {
	let n = !t.pinned && t.removable;
	return /* @__PURE__ */ new Map([
		[gL, e.rename && t.renamable],
		[_L, e.pin && !t.pinned],
		[vL, e.pin && t.pinned],
		[yL, e.close && !e.delete && n],
		[bL, e.delete && n]
	]);
}
function CL(e) {
	let t = e.map(() => !1), n = !1, r = -1;
	for (let i = 0; i < e.length; i++) e[i] === "rule" ? n && r === -1 && (r = i) : e[i] === "shown" && (r !== -1 && (t[r] = !0), r = -1, n = !0);
	return t;
}
function wL(e, t) {
	return typeof e == "string" ? [...t, e] : null;
}
//#endregion
//#region src/interactions/context-menu-engine.ts
var TL = Ce, EL = "ui-context-menu--open", DL = `${Ne}--strip`, OL = `.${Ne}:not(.${DL}) > .${qF}`, kL = "ui-context-menu-opening", AL = null, jL = /* @__PURE__ */ new WeakSet();
function ML(e) {
	AL = e;
}
var NL = class {
	root;
	components;
	closed = null;
	menus = new Qv({
		show: ({ popup: e }) => e.classList.add(EL),
		hide: ({ popup: e }, t) => {
			e.classList.remove(EL), this.closed = e, t === "outside" && $L();
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e),
		onPress: !0,
		onWindowBlur: !0,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, new hI({
			root: this.root,
			first: typeof window > "u" ? void 0 : window,
			holds: (e) => e.closest("[data-ui-context-menu-owner]") !== null && !od(e),
			closeMenu: () => this.menus.close(this.menus.current, "outside"),
			shows: IL
		}), this.root.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), this.root.addEventListener("click", (e) => this.handleInside(e), !1);
	}
	get openMenu() {
		let e = this.menus.current;
		return e === null ? null : this.menus.popupOf(e);
	}
	handleContextMenu(e) {
		if (!(e instanceof MouseEvent) || !(e.target instanceof Element)) return;
		let t = !Bp() && !mI(e), n = (t ? RL() : null) ?? e.target;
		if (this.openMenu !== null && e.composedPath().includes(this.openMenu)) {
			e.preventDefault();
			return;
		}
		let r = PL(n);
		if (r === null) return;
		e.preventDefault();
		let i = KL(e) ? n : null, a = n.closest(OL), o = t ? zL(n) : null, s = () => this.open(r.owner, r.menu, e.clientX, e.clientY, i, a, o);
		jL.delete(r.menu) ? queueMicrotask(s) : s();
	}
	open(e, t, n, r, i, a, o) {
		this.menus.close(), t.querySelector(`:scope > .${DL}`)?.remove(), qL(t), i !== null && JL(e, t, i), a?.closest("[data-ui-action-bar]")?.hasAttribute("data-ui-action-bar-rest") === !0 && XL(t), this.closed !== null && (Zh(this.closed), this.closed = null);
		let s = (document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null) ?? zp(), c = a ?? o, l = {
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
			returnFocus: () => (s === null ? null : um(s, this.components)) ?? um(e, this.components)
		}) && (c === null && l_(t, n, r), QL(t));
	}
	handleInside(e) {
		this.openMenu !== null && e.composedPath().includes(this.openMenu) && e.target instanceof Element && uL(e.target) && this.menus.close();
	}
};
function PL(e) {
	for (let t of FL(e)) {
		let n = VL(t, e).find((t) => WL(t, e, !1));
		if (n !== void 0) return {
			owner: t,
			menu: n
		};
	}
	return null;
}
function* FL(e) {
	let t = e.closest(`[${de}]`);
	for (let n = e.closest(`[${we}]`); n !== null; n = n.parentElement?.closest("[data-ui-context-menu-owner]") ?? null) {
		if (t !== null && n.contains(t)) return;
		if (HL(n, e) && !O(n)) {
			if (tR(n)) return;
			yield n;
		}
	}
}
function IL(e) {
	let t = FL(e).next();
	if (t.done === !0) return null;
	let n = t.value, r = e.closest(qd);
	return r !== null && r !== n && n.contains(r) ? I(r) ?? r : n;
}
var LL = `[${we}]`;
function RL() {
	let e = document.activeElement;
	if (e === null || e === document.body) return null;
	let t = kf(e);
	if (t === null || t.row !== null && t.row !== e) return e;
	let n = t.row ?? If(t.root);
	return n === null ? t.root : BL(n);
}
function zL(e) {
	let t = e.closest(qd);
	return t === null ? e : I(t) ?? t;
}
function BL(e) {
	if (e.matches(LL)) return e;
	for (let t of e.querySelectorAll(LL)) if (t.closest(qd) === e) return t;
	return e;
}
function VL(e, t) {
	return UL(e, t).map((t) => eR(e, t)).filter((e) => e !== null);
}
function HL(e, t) {
	return UL(e, t).some((t) => eR(e, t, !1) !== null || t.length === 0 && e.hasAttribute("data-ui-context-menu-later"));
}
function UL(e, t) {
	let n = t.closest(`[${De}]`), r = n !== null && e.contains(n) ? n.getAttribute("data-ui-context-menu-use") ?? "" : "";
	return r.length > 0 ? [r, ""] : [""];
}
function WL(e, t, n) {
	let r = new CustomEvent(kL, {
		bubbles: !0,
		cancelable: !0,
		detail: {
			target: t,
			actionBar: n
		}
	});
	return e.dispatchEvent(r);
}
function GL(e, t) {
	let n = e.closest(`[${we}]`), r = e.closest(`[${de}]`);
	return n === null || O(n) || tR(n) || r !== null && n.contains(r) ? null : VL(n, e).find((n) => WL(n, e, t)) ?? null;
}
function KL(e) {
	let t = e.pointerType;
	return mI(e) ? !0 : typeof t == "string" && t.length > 0 ? t === "touch" : Vp();
}
function qL(e) {
	for (let t of e.querySelectorAll(`[${je}]`)) t.removeAttribute(je);
}
function JL(e, t, n) {
	let r = n.closest(`[${Oe}]`);
	if (r === null || n.closest(".ui-action-bar") !== null || !e.contains(r) || !VL(e, r).includes(t)) return;
	let { entries: i } = $F(t);
	if (i.length === 0) return;
	let a = document.createElement("div");
	a.className = `${Ne} ${DL}`, a.setAttribute("role", "group"), tI(a, {
		entries: i,
		more: !1,
		role: "menuitem",
		press: YL
	}), t.insertBefore(a, t.firstElementChild);
}
function YL(e) {
	O(e) || e.click();
}
function XL(e) {
	let { entries: t } = $F(e), n = e.querySelector(`.${Vn}`);
	if (t.length === 0 || n === null) return;
	for (let e of t) ZL(e);
	let r = Hd(n, `.${Hn}`, `.${Vn}`).filter((t) => t.closest("[data-ui-menu-left-out]") === null && eI(t, e)), i = [];
	for (let [e, t] of r.entries()) {
		let n = r[e + 1];
		t.getAttribute("data-ui-menu-item-kind") === "header" && (n === void 0 || n.matches("[data-ui-menu-item-kind=\"header\"], [data-ui-menu-item-kind=\"separator\"]")) ? ZL(t) : i.push(t);
	}
	let a = i.map((e) => {
		let t = e.getAttribute(Bn);
		return t === "separator" ? "rule" : t === "header" ? "hidden" : "shown";
	});
	CL(a).forEach((e, t) => {
		a[t] === "rule" && !e && ZL(i[t]);
	});
}
function ZL(e) {
	let t = e.parentElement;
	(t !== null && t.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t : e).setAttribute(je, "");
}
function QL(e) {
	let t = e.querySelector(`.${Vn}`);
	t !== null && lm(e, dL(t));
}
function $L() {
	let e = (e) => {
		e.target instanceof Element && e.target.closest(`${Cp}, [contenteditable='true']`) === null && e.preventDefault();
	};
	document.addEventListener("mousedown", e, {
		capture: !0,
		once: !0
	}), setTimeout(() => document.removeEventListener("mousedown", e, !0));
}
function eR(e, t, n = !0) {
	for (let n of e.querySelectorAll(`[${TL}]`)) if ((n.getAttribute(TL) ?? "") === t && n.closest("[data-ui-context-menu-owner]") === e) return n;
	if (!n || t.length > 0 || AL === null || !e.hasAttribute("data-ui-context-menu-later")) return null;
	let r = AL(e);
	return r !== null && jL.add(r), r;
}
function tR(e) {
	if (e.hasAttribute("data-ui-no-context-menu")) return !0;
	let t = e.closest(`[${b}]`);
	if (t === null) return !1;
	let n = e;
	for (; n.parentElement !== null && n.parentElement !== t;) n = n.parentElement;
	return Dl(n, "data-ui-no-context-menu") || t.closest("[data-ui-id]")?.hasAttribute("data-ui-no-context-menu") === !0;
}
//#endregion
//#region src/interactions/action-bar-engine.ts
var nR = `[${Oe}]`, rR = `.${Ne}`, iR = `${Ne}--out`, aR = `.ui-items-view__item, .${dr}`, oR = "ui-tree__node", sR = 6, cR = "--ui-action-bar-gap", lR = 400, uR = /* @__PURE__ */ new WeakMap(), dR = [
	"class",
	"style",
	"hidden",
	"aria-disabled",
	"aria-checked",
	Me,
	...wi
], fR = class {
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
		}), this.root.addEventListener("contextmenu", (e) => this.handleContextMenu(e)), this.root.addEventListener("dragstart", () => this.choose(null)), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("scroll", () => this.markOut(), !0), Q_((e) => this.takesEscape(e, !0));
	}
	handlePointerDown(e) {
		let t = e, n = e.target instanceof Element ? e.target : null;
		if (n === null || n.closest(`${rR}, [data-ui-context-menu]`) !== null) return;
		let r = pR(n), i = r !== null && r !== this.chosen && mR(n, r) ? null : r;
		t.pointerType === "touch" ? this.pendingTap = {
			pointerId: t.pointerId ?? 0,
			host: i,
			identity: i === null ? null : bR(i)
		} : (t.button ?? 0) === 0 ? i !== null && i === this.chosen ? this.askAgain(i) : this.choose(i) : r !== this.chosen && this.choose(null);
	}
	handlePointerUp(e) {
		let t = this.pendingTap;
		if (this.pendingTap = null, t !== null && t.pointerId === (e.pointerId ?? 0)) {
			let e = t.host !== null && !t.host.isConnected && t.identity !== null ? xR(t.identity) : t.host;
			e !== null && e === this.chosen ? this.askAgain(e) : this.choose(e);
		}
		this.chosen !== null && (this.chosen.isConnected && !this.shown.has(this.chosen) || H_(this.chosen)) && this.sync();
	}
	handleContextMenu(e) {
		this.pendingTap = null, e instanceof MouseEvent && e.target instanceof Element && e.target.closest(rR) === null && KL(e) && this.choose(null);
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement ? e.target : null;
		if (t === null) return;
		let n = t.closest(rR);
		n === null ? Bp() || this.isInOpenMenu(t) || this.menuHost !== null && t.contains(this.menuHost) || this.choose(vR(t)) : this.isHostedBar(n) && N(kR(n), t);
	}
	handleFocusOut(e) {
		let t = e.relatedTarget, n = t instanceof Element ? t.closest(rR) : null;
		n !== null && this.isHostedBar(n) && e.target instanceof HTMLElement && !n.contains(e.target) && (this.cameFrom = e.target);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || !(e.target instanceof HTMLElement)) return;
		let t = e.target;
		if (e.defaultPrevented) {
			t.matches(F) && this.choose(vR(t));
			return;
		}
		let n = t.closest(rR);
		if (n !== null && t.classList.contains(KF)) this.handleBarKey(e, n, t);
		else if (e.key === "Escape") {
			if (Xu(e) || !this.takesEscape(t, !1)) return;
			this.chosen !== null && e.preventDefault(), this.choose(null);
		} else if (e.key === "Tab" && M(e) && t.matches(F)) {
			let n = this.chosen === null ? null : this.tabStopOf(this.chosen);
			n !== null && t.contains(n) && (e.preventDefault(), n.focus());
		} else t.matches(F) && this.choose(vR(t));
	}
	handleBarKey(e, t, n) {
		if (!M(e, { shift: !0 })) return;
		if (e.key === "Escape") {
			if (!this.isHostedBar(t)) return;
			let n = this.hostOfBar(t), r = this.cameFrom !== null && this.cameFrom.isConnected && NR(this.cameFrom) && n !== null && (n.contains(this.cameFrom) || this.cameFrom.contains(n)) ? this.cameFrom : um(n, this.components);
			e.preventDefault(), r?.focus();
			return;
		}
		let r = kR(t), i = bd({
			key: e.key,
			items: r,
			current: n,
			axis: "horizontal"
		});
		i !== null && (e.preventDefault(), Cd(r, i));
	}
	takesEscape(e, t) {
		let n = e instanceof Element ? e.closest(R_) : null, r = this.chosen;
		if (n !== null && (r === null || !n.contains(r))) return !1;
		if (!t) return !0;
		let i = r === null ? void 0 : this.shown.get(r)?.bar;
		return r !== null && i !== void 0 && !i.classList.contains(iR) && D_(r) && !H_(r);
	}
	choose(e) {
		(e === null ? this.chosen === null && this.identity === null : e === this.chosen) || (this.chosen = e, this.identity = e === null ? null : bR(e), this.watchScope(), this.sync(), e !== null && this.makeRoomAbove(e));
	}
	makeRoomAbove(e) {
		let t = this.shown.get(e), n = k_(e);
		if (t === void 0 || n === null || !T_(n, !0)) return;
		let r = Math.max(0, n.getBoundingClientRect().top + n.clientTop), i = Math.ceil(t.bar.getBoundingClientRect().height + CR(e) - (e.getBoundingClientRect().top - r));
		i <= 0 || i > n.scrollTop || (n.scrollTop -= i, Fg(t.bar), this.markOut());
	}
	askAgain(e) {
		let t = this.shown.get(e);
		t === void 0 ? this.sync() : GL(e, !0) === null && this.hide(e, t);
	}
	watchScope() {
		this.scopeObserver?.disconnect(), this.scopeObserver = null, this.identity !== null && (this.scopeObserver = new MutationObserver((e) => {
			g_(e) || this.scopeChanged();
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
				this.chosen = xR(e), this.sync();
			}
			for (let e of this.shown.values()) Fg(e.bar);
			this.markOut();
		}
	}
	sync() {
		this.chosen !== null && H_(this.chosen) && (this.chosen = null, this.identity = null, this.watchScope());
		for (let [e, t] of this.shown) (e !== this.chosen && e !== this.menuHost || !e.isConnected) && this.hide(e, t);
		for (let e of [this.chosen, this.menuHost]) e !== null && e.isConnected && !this.shown.has(e) && this.show(e);
	}
	show(e) {
		let t = GL(e, !0);
		if (t === null) return;
		let n = document.createElement("div");
		if (n.className = Ne, n.setAttribute("role", "toolbar"), D.write(n, "aria-label", "ui.actionbar.label"), n.setAttribute(et, ""), n.setAttribute(pe, ""), !TR(n, t, (t) => this.openMore(e, t), !1)) return;
		e.insertBefore(n, OR(e)), Cg(e, n, {
			placement: SR(e),
			gap: CR(e),
			boundary: k_(e) ?? void 0
		}), n.classList.toggle(iR, O_(e));
		let r = new MutationObserver((t) => {
			g_(t) || this.redraw(e);
		});
		r.observe(t, {
			subtree: !0,
			childList: !0,
			characterData: !0,
			attributes: !0,
			attributeFilter: dR
		});
		let i = wR(e);
		i?.setAttribute(Vr, ""), this.shown.set(e, {
			bar: n,
			menu: t,
			observer: r,
			row: i
		}), uR.set(n, Date.now());
	}
	redraw(e) {
		let t = this.shown.get(e);
		if (t === void 0) return;
		let n = document.activeElement, r = n instanceof HTMLElement && t.bar.contains(n) ? n : null, i = r === null ? null : oI(r);
		if (!TR(t.bar, t.menu, (t) => this.openMore(e, t), e === this.menuHost)) {
			this.hide(e, t);
			return;
		}
		if (r === null) return;
		let a = kR(t.bar);
		Cd(a, a.find((e) => oI(e) === i) ?? a.find(P) ?? null);
	}
	openMore(e, t) {
		let n = this.shown.get(e);
		if (n === void 0 || jR(t)) return;
		if (this.menuHost = e, MR(t), !n.menu.classList.contains("ui-context-menu--open")) {
			this.menuHost = null;
			return;
		}
		ER(n.bar, !0);
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
		ER(t.bar, !1);
		let n = document.activeElement;
		!Bp() && (n === null || n === document.body || e.contains(n) || n.contains(e)) && DR(t.bar)?.focus();
	}
	hide(e, t) {
		t.observer.disconnect(), Ig(t.bar), t.bar.remove(), this.shown.delete(e), t.row !== null && ![...this.shown.values()].some((e) => e.row === t.row) && t.row.removeAttribute(Vr);
	}
	markOut() {
		for (let [e, t] of this.shown) t.bar.classList.toggle(iR, O_(e));
	}
	isInOpenMenu(e) {
		for (let t of this.shown.values()) if (t.menu.classList.contains("ui-context-menu--open") && t.menu.contains(e)) return !0;
		return !1;
	}
	tabStopOf(e) {
		let t = this.shown.get(e);
		return t === void 0 ? null : kR(t.bar).find((e) => e.tabIndex === 0) ?? null;
	}
	isHostedBar(e) {
		return this.hostOfBar(e) !== null;
	}
	hostOfBar(e) {
		for (let [t, n] of this.shown) if (n.bar === e) return t;
		return null;
	}
};
function pR(e) {
	let t = e.closest(nR);
	if (t !== null) return t;
	let n = e.closest(`[${y}]`), r = e.closest(x);
	return n === null || r !== null && !r.contains(n) ? null : yR(n)[0] ?? null;
}
function mR(e, t) {
	let n = yd(e, t.closest("[data-ui-key]") ?? t);
	return n !== null && !gR(n, t);
}
var hR = `[${Ce}], .${Ne}, ${Ii}`;
function gR(e, t) {
	if (e.contains(t)) return !0;
	for (let n = e; n !== t;) {
		let e = n.parentElement;
		if (e === null) return !1;
		let t = _R(e) - _R(n);
		for (let r of e.children) if (r !== n) {
			if (!r.matches(hR)) return !1;
			t -= _R(r);
		}
		if (t > 0) return !1;
		n = e;
	}
	return !0;
}
function _R(e) {
	return (e.textContent ?? "").replace(/s+/g, "").length;
}
function vR(e) {
	if (e instanceof HTMLElement && e.matches(F)) {
		let t = If(e), n = t === null ? void 0 : yR(t)[0];
		if (n !== void 0) return n;
	}
	return e.closest(nR);
}
function yR(e) {
	let t = [...e.querySelectorAll(nR)];
	return e.matches(nR) ? [e, ...t] : t;
}
function bR(e) {
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
		index: yR(n).indexOf(e)
	};
}
function xR(e) {
	for (let t of e.scope.children) if (t.getAttribute(e.attribute) === e.key) return yR(t)[e.index] ?? null;
	return null;
}
function SR(e) {
	let t = e.getAttribute(Oe);
	if (t === "center") return "top";
	let n = getComputedStyle(e).direction === "rtl";
	return t === "start" === n ? "top-end" : "top-start";
}
function CR(e) {
	let t = Number.parseFloat(getComputedStyle(e).getPropertyValue(cR));
	return Number.isFinite(t) ? t : sR;
}
function wR(e) {
	if (e.classList.contains("ui-table__row")) return e;
	let t = e.parentElement;
	if (t === null) return null;
	if (t.matches(aR)) return t;
	let n = t.parentElement;
	return t.classList.contains(oR) && n !== null && n.classList.contains("ui-tree__row") ? n : null;
}
function TR(e, t, n, r) {
	let { entries: i, more: a } = $F(t);
	if (i.length === 0 && !a) return !1;
	let o = tI(e, {
		entries: i,
		more: a,
		role: "button",
		press: AR,
		openMore: n
	});
	return N(o, o.find((e) => !O(e)) ?? o[0] ?? null), ER(e, r), !0;
}
function ER(e, t) {
	DR(e)?.setAttribute("aria-expanded", t ? "true" : "false");
}
function DR(e) {
	return kR(e).find((e) => oI(e) === null) ?? null;
}
function OR(e) {
	for (let t of e.children) if (t.hasAttribute("data-ui-context-menu")) return t;
	return null;
}
function kR(e) {
	return [...e.querySelectorAll(`:scope > .${KF}`)];
}
function AR(e, t) {
	if (O(t) || jR(t)) return;
	let n = GL(t, !1);
	n !== null && n.contains(e) && !O(e) && eI(e, n) && e.click();
}
function jR(e) {
	let t = e.closest(rR), n = t === null ? void 0 : uR.get(t);
	return n !== void 0 && Vp() && Date.now() - n < lR;
}
function MR(e) {
	let t = e.getBoundingClientRect();
	e.dispatchEvent(new MouseEvent("contextmenu", {
		bubbles: !0,
		cancelable: !0,
		button: 2,
		clientX: t.left,
		clientY: t.bottom
	}));
}
function NR(e) {
	return e.matches(Cp) || e.hasAttribute("tabindex");
}
//#endregion
//#region src/interactions/tooltip-engine.ts
var PR = "ui-tooltip", FR = "ui-tooltip", IR = "ui-tooltip--visible", LR = "ui-tooltip--linked", RR = "[aria-haspopup][aria-expanded=\"true\"]", zR = "a[href], button, input, select, textarea, label, [role='button'], [role='link'], [tabindex]", BR = "top", VR = 250, HR = 200, UR = 300, WR = 7, GR = null, J = null, KR = null, qR = null, JR = null, YR = 0, XR = null, ZR = 0, QR = 0, $R = !1, ez = /* @__PURE__ */ new Set();
function tz(e) {
	ez.add(e);
}
function nz(e = document) {
	if ($R) return;
	$R = !0;
	let t = e instanceof Document ? e : document;
	t.addEventListener("pointerover", rz, !0), t.addEventListener("pointerout", oz, !0), t.addEventListener("focusin", cz, !0), t.addEventListener("focusout", lz, !0), t.addEventListener("scroll", az, !0), t.addEventListener("pointerdown", dz, !0), t.addEventListener("click", hz, !0), new hI({
		root: t,
		first: window,
		holds: pz,
		answer: mz
	}), window.addEventListener("keydown", uz, !0), window.addEventListener("blur", Vz), ig(iz);
}
function rz(e) {
	if (iz(!1), _z(e.target)) {
		window.clearTimeout(ZR);
		return;
	}
	let t = vz(e.target);
	t !== null && t !== J && Cz(t);
}
function iz(e = !0) {
	J === null || J.isConnected && (!e || D_(J)) || Vz();
}
function az(e) {
	if (iz(), J === null) return;
	let t = e.target;
	t instanceof Node && !(t instanceof Document) && !t.contains(J) || O_(J) && Vz();
}
function oz(e) {
	if (qR !== null || JR !== null) return;
	let t = e.relatedTarget, n = J ?? XR?.target ?? null, r = n === null ? null : sz(n);
	t instanceof Node && (r !== null && r.contains(t) || _z(t)) || (_z(e.target) || r !== null && e.target instanceof Node && r.contains(e.target)) && Hz(!1);
}
function sz(e) {
	let t = e.parentElement?.closest("[data-ui-tooltip-mark]") ?? null;
	return t !== null && yz(t) === e ? t : e;
}
function cz(e) {
	if (e.target instanceof Element && e.target.hasAttribute("data-ui-pointer-focus")) return;
	let t = vz(e.target);
	t !== null && (qR = e.target instanceof Element && e.target.closest("[data-ui-tooltip-mark]") !== null ? t : null, wz(t));
}
function lz(e) {
	vz(e.target) === J && Vz();
}
function uz(e) {
	e.key !== "Escape" || J === null || e.defaultPrevented || (Xu(e) || e.preventDefault(), Vz());
}
function dz(e) {
	if (_z(e.target)) return;
	let t = gz(e.target);
	if (t !== null) {
		if (JR === t) {
			Hz(!0);
			return;
		}
		Vz(), wz(t), JR = J;
	} else qR === null && Hz(!0);
}
var fz = `[${we}]`;
function pz(e) {
	let t = e.closest(fz) === null && !od(e) ? vz(e) : null;
	return t !== null && !t.hasAttribute("data-ui-tooltip-press");
}
function mz(e) {
	let t = vz(e);
	return t !== null && (Vz(), wz(t), JR = J, !0);
}
function hz(e) {
	gz(e.target) !== null && e.preventDefault();
}
function gz(e) {
	let t = vz(e);
	if (t === null || !t.hasAttribute("data-ui-tooltip-press") || !(e instanceof Element)) return null;
	let n = e.closest(zR);
	return n === null || n.contains(t) ? t : null;
}
function _z(e) {
	return GR !== null && e instanceof Node && GR.contains(e);
}
function vz(e) {
	if (!(e instanceof Element)) return null;
	let t = yz(e);
	for (let n of ez) {
		let r = n.anchor(e);
		if (r !== null && (t === null || t !== r && t.contains(r)) && Sz(r).length > 0) return r;
	}
	return t;
}
function yz(e) {
	let t = e.closest(`[${ze}], [${He}]`);
	if (t === null) return null;
	let n = t.hasAttribute("data-ui-tooltip") ? t : t.querySelector("[data-ui-tooltip][data-ui-tooltip-severity]") ?? t.querySelector("[data-ui-tooltip]");
	return n === null ? null : (n.getAttribute("data-ui-tooltip") ?? "").trim().length > 0 ? n : null;
}
function bz(e) {
	let t = (e.getAttribute("data-ui-tooltip") ?? "").trim();
	return t.length === 0 ? Sz(e) : (e.hasAttribute("data-ui-tooltip-plain") ? Qo(t) : t) + xz(e);
}
function xz(e) {
	let t = "";
	for (let n of ez) {
		let r = n.anchor(e) === e ? n.after?.(e)?.trim() ?? "" : "";
		r.length > 0 && (t += ` ${r}`);
	}
	return t;
}
function Sz(e) {
	for (let t of ez) {
		if (t.anchor(e) !== e) continue;
		let n = t.words(e)?.trim() ?? "";
		if (n.length > 0) return n;
	}
	return "";
}
function Cz(e, t) {
	qR === null && JR === null && (window.clearTimeout(ZR), XR !== null && XR.target === e ? XR.words = t : (window.clearTimeout(YR), XR = null, J === null ? Date.now() - QR < UR ? wz(e, t) : (XR = {
		target: e,
		words: t
	}, YR = window.setTimeout(() => {
		let e = XR;
		XR = null, e !== null && wz(e.target, e.words);
	}, VR)) : (Hz(!0), wz(e, t))));
}
function wz(e, t) {
	let n = (t ?? bz(e)).trim();
	if (n.length === 0 || !e.isConnected || !E_(e) || kz(e) || O_(e)) return;
	window.clearTimeout(YR), window.clearTimeout(ZR), XR = null;
	let r = Uz();
	$o(r, n, { staticFolds: !0 }), r.classList.toggle(LR, r.querySelector("a[href]") !== null), r.classList.add(IR), J = e, jz(Az(e)), r.setAttribute("data-ui-tooltip-text", Zo(n)), Pz(r, e.getAttribute(Ue)), Sg(e, r), Cg(e, r, {
		placement: Bz(e),
		gap: WR,
		arrow: !0
	}), Dz();
}
var Tz = null, Ez = [...S_];
function Dz() {
	typeof MutationObserver < "u" && J !== null && (Tz ??= new MutationObserver((e) => Oz(e)), Tz.disconnect(), Tz.observe(document.documentElement, {
		childList: !0,
		subtree: !0
	}), C_(Tz, J, Ez));
}
function Oz(e) {
	let t = J !== null && w_(e, [J]).size > 0;
	iz(t || e.some((e) => e.type === "attributes")), t && J !== null && Tz !== null && C_(Tz, J, Ez);
}
function kz(e) {
	return e.matches(RR) || e.querySelector(RR) !== null || e.querySelector(":scope > .ui-action-bar") !== null;
}
function Az(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t) ? t : e;
}
function jz(e) {
	KR !== null && KR !== e && Mz();
	let t = Nz(e);
	t.includes(FR) || e.setAttribute("aria-describedby", [...t, FR].join(" ")), KR = e;
}
function Mz() {
	if (KR === null) return;
	let e = Nz(KR).filter((e) => e !== FR);
	e.length === 0 ? KR.removeAttribute("aria-describedby") : KR.setAttribute("aria-describedby", e.join(" ")), KR = null;
}
function Nz(e) {
	return (e.getAttribute("aria-describedby") ?? "").split(" ").filter((e) => e.length > 0);
}
function Pz(e, t) {
	t === null ? e.removeAttribute(Ue) : e.setAttribute(Ue, t);
}
function Fz(e, t, n) {
	let r = n?.plain === !0 ? Qo(t) : t;
	n?.delay === !0 && J !== e ? Cz(e, r) : wz(e, r);
}
function Iz() {
	Hz(!0);
}
var Lz = {
	show: Fz,
	hide: Iz,
	escape: Qo
};
function Rz(e) {
	qR = e, wz(e);
}
function zz(e) {
	J === e && ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0 ? Vz() : wz(e));
}
function Bz(e) {
	if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) for (let t of ez) {
		let n = t.anchor(e) === e ? t.placement?.(e) ?? null : null;
		if (n !== null) return n;
	}
	let t = e.getAttribute(Be);
	return t !== null && fg(t) ? t : BR;
}
function Vz() {
	qR = null, Hz(!0);
}
function Hz(e) {
	window.clearTimeout(YR), window.clearTimeout(ZR), XR = null;
	let t = () => {
		J !== null && (Mz(), J = null, JR = null, Tz?.disconnect(), GR !== null && (GR.classList.remove(IR), Ig(GR)), QR = Date.now());
	};
	e ? t() : ZR = window.setTimeout(t, HR);
}
function Uz() {
	return GR !== null && GR.isConnected || (GR = document.createElement("div"), GR.id = FR, GR.className = PR, GR.setAttribute("role", "tooltip"), GR.setAttribute("aria-hidden", "true"), document.body.append(GR)), GR;
}
//#endregion
//#region src/interactions/menu-engine.ts
var Wz = "ui-orientation--horizontal", Gz = `.${Gn} > .ui-menu__host > .ui-menu__item > .${Hn}`, Kz = `${Gz}, ${`.ui-menu[${fn}] > .ui-menu__host > .ui-menu__item > .${Hn}`}`, qz = ":scope > .ui-button__content > .ui-text__body > .ui-text__header > .ui-text__title", Jz = "[role='menuitem'], [role='menuitemcheckbox']", Yz = class {
	root;
	tabStopsScheduled = !1;
	touched = /* @__PURE__ */ new Set();
	space = new Pu();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("keydown", (e) => this.handleEntryKeydown(e), !0), this.root.addEventListener("keyup", (e) => this.space.release(e, P), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), tz($z), this.applyTabStops(this.root.querySelectorAll(`.${Vn}`)), this.root instanceof Node && new MutationObserver((e) => {
			for (let t of e) m_(t) || eB(t, this.touched);
			this.touched.size > 0 && this.scheduleTabStops();
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [Cn, hn]
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
		for (let n of e) n.isConnected && t.add(fL(n));
		for (let e of t) {
			let t = dL(e);
			if (t.length === 0) continue;
			let n = t.filter((e) => e.tabIndex === 0 && P(e));
			N(t, t.find((e) => e === document.activeElement) ?? t.find((e) => e.classList.contains("ui-menu-item--selected") && P(e)) ?? (n.length === 1 ? n[0] : void 0) ?? t.find(P) ?? t[0]);
		}
	}
	handleEntryKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || sd(e) || j(e) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Hn}`), n = t?.closest(".ui-menu") ?? null;
		if (t === null) {
			this.enterFromContainer(e);
			return;
		}
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			this.pressEntry(e, t);
			return;
		}
		let r = fL(n), i = dL(r), a = pD(e);
		if (a !== null) {
			e.preventDefault(), Cd(i, OF(i, t, a));
			return;
		}
		let o = r.classList.contains(Wz) || cL(r) ? "horizontal" : "vertical";
		if (!M(e) || this.handleGroupKey(e, t, r, o)) return;
		let s = e.key === "ArrowUp" && t === i.find(P) ? Qz(r) : null, c = s ?? bd({
			key: e.key,
			items: i,
			current: t,
			axis: o
		});
		c !== null && (e.preventDefault(), c !== s && N(i, c), c.focus());
	}
	handleGroupKey(e, t, n, r) {
		let i = r === "vertical" ? "ArrowRight" : sL(n) === "top" ? "ArrowUp" : "ArrowDown", a = t.matches("[data-ui-menu-group] > .ui-menu-item") ? t.parentElement : null;
		if (e.key === i && a !== null) return e.preventDefault(), a.hasAttribute("data-ui-menu-open") ? Cd([], Xz(a)) : t.click(), !0;
		if (e.key !== "ArrowLeft" || r !== "vertical") return !1;
		let o = a !== null && a.hasAttribute("data-ui-menu-open") && !mL(a) ? a : Zz(t), s = o?.querySelector(":scope > .ui-menu-item") ?? null;
		return o === null || s === null ? !1 : (e.preventDefault(), mL(o) || s.focus(), s.click(), !0);
	}
	pressEntry(e, t) {
		e.target === t && M(e, { shift: !0 }) && !t.matches("[data-ui-menu-item-kind=\"header\"], [data-ui-menu-item-kind=\"separator\"]") && P(t) && (t.hasAttribute("href") && e.key === "Enter" || (e.preventDefault(), !e.repeat && (e.key === " " ? this.space.hold(t) : t.click())));
	}
	enterFromContainer(e) {
		let t = e.target instanceof HTMLElement && e.target.getAttribute("role") === "menu" ? e.target : null, n = t === null ? null : t.matches(".ui-menu") ? t : t.querySelector(`.${Vn}`);
		if (n === null) return;
		let r = dL(n), i = pD(e);
		if (i !== null) {
			e.preventDefault(), Cd(r, OF(r, null, i));
			return;
		}
		let a = M(e) ? bd({
			key: e.key,
			items: r,
			current: null,
			axis: n.classList.contains(Wz) ? "horizontal" : "vertical"
		}) : null;
		a !== null && (e.preventDefault(), Cd(r, a));
	}
	handleFocusIn(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Hn}`), n = t?.closest(".ui-menu") ?? null;
		t !== null && n !== null && N(dL(fL(n)), t);
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${Hn}`) : null;
		if (t === null || t === document.activeElement || !t.matches(Jz) || t.matches("[data-ui-menu-item-kind=\"header\"], [data-ui-menu-item-kind=\"separator\"]") || !P(t)) return;
		let n = document.activeElement;
		(n instanceof HTMLElement && n.getAttribute("role") === "menu" && n.contains(t) || t.closest(".ui-menu")?.contains(n) === !0) && qp(t);
	}
};
function Xz(e) {
	let t = e.querySelector(`:scope > .ui-menu__submenu > .${Vn}`);
	return t === null ? null : dL(t).find(P) ?? null;
}
function Zz(e) {
	let t = e.closest(`.${Vn}`), n = t === null ? null : pL(t);
	return n !== null && n.hasAttribute("data-ui-menu-open") ? n : null;
}
function Qz(e) {
	return e.hasAttribute("data-ui-menu-search") ? e.querySelector(":scope > .ui-collapsible__bar input") : null;
}
var $z = {
	anchor: (e) => e.closest(Kz),
	words: (e) => {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length > 0) return null;
		let t = e.querySelector(qz), n = t?.textContent?.trim() ?? "";
		return t === null || n.length === 0 || e.matches(Gz) && t.scrollWidth <= t.clientWidth ? null : Qo(n);
	},
	placement: (e) => {
		let t = e.closest(`.${Vn}`);
		return t === null ? null : sL(t);
	}
};
function eB(e, t) {
	let n = (e.target instanceof Element ? e.target : e.target.parentElement)?.closest(".ui-menu") ?? null;
	n !== null && t.add(n);
	for (let n of e.addedNodes) if (n instanceof HTMLElement) {
		n.classList.contains("ui-menu") && t.add(n);
		for (let e of n.querySelectorAll(`.${Vn}`)) t.add(e);
	}
}
//#endregion
//#region src/interactions/shortcut-engine.ts
var tB = "shortcut:", nB = ":scope > .ui-menu-item__shortcut", rB = `[${Ce}]`, iB = `[${Xn}]`, aB = ".ui-text__title", oB = class {
	root;
	options;
	claims = /* @__PURE__ */ new Map();
	entryShortcuts = /* @__PURE__ */ new Map();
	stale = !0;
	laterVersion = -1;
	constructor(e = {}) {
		this.root = e.root ?? document, this.options = e, this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), tz(pB), uB(this.root), this.root instanceof Node && new MutationObserver((e) => {
			if (!g_(e)) {
				this.stale = !0;
				for (let t of e) lB(t);
			}
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [Xn]
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || j(e) || ((this.stale || this.laterVersion !== (this.options.laterChords?.version ?? -1)) && this.rebuild(), this.claims.size === 0 && this.entryShortcuts.size === 0 || sd(e))) return;
		let t = V_(this.root);
		if (!this.pressContextEntry(e, t)) for (let n of this.claims.values()) {
			if (n === null || !xu(n.shortcut, e)) continue;
			let r = n.element ?? this.contentOf(n.view);
			if (r === null || !P(r) || t !== null && !t.contains(r)) return;
			e.preventDefault(), cB(e), n.view === null ? r.click() : r.dispatchEvent(new CustomEvent(n.view.name, { bubbles: !0 }));
			return;
		}
	}
	pressContextEntry(e, t) {
		let n = !1;
		for (let t of this.entryShortcuts.values()) n ||= xu(t, e);
		let r = n ? RL() : null;
		if (r === null || t !== null && !t.contains(r)) return !1;
		let i = PL(r);
		if (i === null) return !1;
		let a = [...i.menu.querySelectorAll(iB)].filter((t) => {
			let n = bu(t.getAttribute(Xn));
			return n !== null && xu(n, e) && !O(t) && eI(t, i.menu);
		});
		return a.length === 1 ? (e.preventDefault(), cB(e), a[0].click(), !0) : (a.length > 1 && s("context menu shortcut is claimed twice and will fire nothing.", { entries: a }), !1);
	}
	contentOf(e) {
		let t = e === null ? null : this.options.componentOf?.(e.componentId) ?? null;
		return t instanceof HTMLElement ? t : null;
	}
	rebuild() {
		this.claims.clear(), this.entryShortcuts.clear(), this.stale = !1;
		for (let e of this.root.querySelectorAll(iB)) {
			let t = e.getAttribute("data-ui-shortcut") ?? "", n = bu(t);
			n === null ? t.trim().length > 0 && s("shortcut could not be parsed.", {
				element: e,
				value: t
			}) : e.closest(rB) === null ? this.claim({
				shortcut: n,
				element: e,
				view: null
			}) : this.entryShortcuts.set(Fu(n), n);
		}
		for (let e of this.options.laterChords?.chords() ?? []) {
			let t = bu(e);
			t !== null && this.entryShortcuts.set(Fu(t), t);
		}
		this.laterVersion = this.options.laterChords?.version ?? -1;
		for (let e of this.options.viewShortcuts ?? []) {
			let t = bu(e.name.slice(9));
			t !== null && this.claim({
				shortcut: t,
				element: null,
				view: e
			});
		}
	}
	claim(e) {
		let t = Fu(e.shortcut);
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
function sB(e) {
	let t = /* @__PURE__ */ new Map(), n = [...e.events, ...e.interactions.map((e) => e.sourceEvent)];
	for (let e of n) e != null && e.eventName.startsWith(tB) && t.set(e.eventName, {
		name: e.eventName,
		componentId: e.componentId
	});
	return [...t.values()];
}
function cB(e) {
	ad(e.target) && e.target.dispatchEvent(new Event(EC, { bubbles: !0 }));
}
function lB(e) {
	if (e.type === "attributes") e.target instanceof HTMLElement && dB(e.target);
	else for (let t of e.addedNodes) t instanceof HTMLElement && uB(t);
}
function uB(e) {
	e instanceof HTMLElement && e.matches(iB) && dB(e);
	for (let t of e.querySelectorAll(iB)) dB(t);
}
function dB(e) {
	let t = e.querySelector(nB);
	if (t === null) return;
	let n = fB(e) ?? "";
	t.textContent !== n && (t.textContent = n), e.hasAttribute("data-ui-menu-item-shortcut") !== n.length > 0 && e.toggleAttribute(yn, n.length > 0);
}
function fB(e) {
	let t = e.getAttribute(Xn), n = bu(t);
	return n === null ? t?.trim() || null : Su(n);
}
var pB = {
	anchor: (e) => {
		let t = e.closest(iB);
		return t === null || t.classList.contains("ui-menu-item") || t.closest(rB) !== null ? null : t;
	},
	words: (e) => {
		let t = fB(e), n = (e.getAttribute("aria-label") ?? e.querySelector(aB)?.textContent ?? "").trim();
		return t === null ? null : Qo(n.length > 0 ? `${n} (${t})` : t);
	},
	after: (e) => {
		let t = fB(e);
		return t === null ? null : Qo(`(${t})`);
	}
}, mB = 50, hB = 1, gB = 7;
function _B(e) {
	let t = 0;
	for (let n of e.children) n.hasAttribute("data-ui-key") && t++;
	let n = yA(e, "data-ui-window-size") ?? 0;
	return {
		offset: yA(e, "data-ui-window-offset") ?? 0,
		count: t,
		size: n > 0 ? n : t > 0 ? t : mB,
		total: yA(e, rn),
		moreAfter: bA(e, on)
	};
}
function vB(e) {
	return Math.floor(e.offset / e.size) + 1;
}
function yB(e) {
	return e.total === null ? null : Math.max(1, Math.ceil(e.total / e.size));
}
function bB(e, t) {
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
			let n = Number(t), r = yB(e);
			return !Number.isInteger(n) || n < 1 || r !== null && n > r || n === vB(e) ? null : (n - 1) * e.size;
		}
	}
}
function xB(e, t) {
	if (t <= gB) return CB(1, t);
	let n = Math.max(Math.min(e - hB, t - 2 - 2), 3), r = Math.min(Math.max(e + hB, 5), t - 2);
	return [
		1,
		n > 3 ? "gap" : 2,
		...CB(n, r),
		r < t - 2 ? "gap" : t - 1,
		t
	];
}
function SB(e, t) {
	let n = xB(e, t ? e + 1 : e);
	return t ? [...n, "gap"] : n;
}
function CB(e, t) {
	let n = [];
	for (let r = e; r <= t; r++) n.push(r);
	return n;
}
//#endregion
//#region src/interactions/pager-engine.ts
var wB = ".ui-pager", TB = "ui-pager__button", EB = "ui-pager__number", DB = "ui-pager__pages", OB = "ui-pager__gap", kB = "ui-pager__range", AB = "ui-pager__size", jB = "ui-pager__size--open", MB = "ui-pager__size-trigger", NB = "ui-pager__size-label", PB = "ui-pager__sizes", FB = "ui-pager__size-choice", IB = [
	TB,
	EB,
	"ui-button",
	"ui-button--ghost",
	"ui-button--small"
], LB = "ui.pager.page", RB = "ui.pager.range", zB = "ui.pager.rows", BB = "ui.pager.size", VB = [
	nn,
	rn,
	on,
	tn,
	en
], HB = "page-size", UB = class {
	options;
	root;
	drawn = /* @__PURE__ */ new WeakMap();
	store = new jI();
	restored = /* @__PURE__ */ new WeakSet();
	turning = /* @__PURE__ */ new WeakMap();
	menus = new Qv({
		show: ({ owner: e }) => e.classList.add(jB),
		hide: ({ owner: e }) => e.classList.remove(jB),
		closesWhenReadOnly: !1,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.syncAll(), this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e)), (e.pageKeys ?? window).addEventListener("keydown", (e) => this.handlePageKey(e), !0), V(this.root, `${wB}, [${b}]`, {
			childList: !0,
			attributeFilter: VB,
			relevant: (e) => e.type === "attributes" || QB(e.target) || $B(e)
		}, (e) => this.syncFound(e)), D.onChange(() => {
			this.drawn = /* @__PURE__ */ new WeakMap(), this.syncAll();
		});
	}
	syncAll() {
		for (let e of this.root.querySelectorAll(wB)) this.sync(e);
	}
	syncFound(e) {
		let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
		for (let r of e) {
			if (r.matches(wB)) {
				t.add(r);
				continue;
			}
			let e = r.closest(x), i = e === null ? 0 : T(e);
			i > 0 && n.add(String(i));
		}
		if (n.size > 0) for (let e of this.root.querySelectorAll(wB)) n.has(e.getAttribute("data-ui-pager-target") ?? "") && t.add(e);
		for (let e of t) this.sync(e);
	}
	hostOf(e) {
		return this.targetOf(e)?.host ?? null;
	}
	targetOf(e) {
		let t = Number(e.getAttribute(vt));
		if (!Number.isInteger(t) || t <= 0) return null;
		for (let e of this.options.dom.findEveryComponent(t)) {
			let t = ZB(e);
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
		let i = _B(n), a = this.turning.get(n), o = this.shownState(n, i), s = `${i.offset}|${i.count}|${i.size}|${i.total}|${i.moreAfter}|${a ?? ""}`;
		if (this.drawn.get(e) === s) return;
		this.drawn.set(e, s);
		let c = Tk(e), l = (e) => Ek(e, "N0", c);
		this.drawNumbers(e, o, c), GB(e, i, l), KB(e, i, l);
		for (let t of e.querySelectorAll(`:scope > .${TB}[${yt}]`)) jl.setDisabled(t, bB(o, t.getAttribute("data-ui-pager-page") ?? "") === null);
		JB(e);
	}
	shownState(e, t = _B(e)) {
		let n = this.turning.get(e);
		return n === void 0 ? t : {
			...t,
			offset: n,
			moreAfter: t.total === null ? t.moreAfter : n + t.size < t.total
		};
	}
	drawNumbers(e, t, n) {
		let r = e.querySelector(`:scope > .${DB}`);
		if (r === null) return;
		let i = vB(t), a = yB(t), o = a === null ? SB(i, t.moreAfter) : xB(i, a), s = r.contains(document.activeElement);
		r.replaceChildren(...o.map((e) => WB(e, i, n))), s && !e.contains(document.activeElement) && r.querySelector("[aria-current='page']")?.focus({ preventScroll: !0 });
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(wB);
		if (t === null || O(e.target)) return;
		let n = e.target.closest(`.${FB}`);
		if (n !== null) {
			e.preventDefault(), this.chooseSize(t, Number(n.getAttribute(bt)));
			return;
		}
		let r = e.target.closest(`.${MB}`);
		if (r !== null) {
			e.preventDefault(), this.toggleSizes(r);
			return;
		}
		let i = e.target.closest(`[${yt}]`), a = i === null ? null : this.hostOf(t);
		if (i === null || a === null) return;
		let o = bB(this.shownState(a), i.getAttribute("data-ui-pager-page") ?? "");
		o !== null && (e.preventDefault(), this.turnAsync(a, o));
	}
	async turnAsync(e, t) {
		await this.requestPageAsync(e, t), Od(e).top > 0 && kd(e, 0);
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
		for (let t of this.root.querySelectorAll(wB)) this.hostOf(t) === e && this.sync(t);
	}
	handleKeyDown(e) {
		if (e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(wB);
		if (t === null) return;
		let n = e.target.closest(`.${AB}`);
		if (n !== null && this.handleSizeKey(e, n)) return;
		let r = e.target.closest(`.${TB}, .${MB}`), i = qB(t);
		if (r === null || !i.includes(r) || !M(e)) return;
		let a = bd({
			key: e.key,
			items: i,
			current: r,
			axis: "horizontal"
		});
		a !== null && (e.preventDefault(), Cd(i, a));
	}
	handleSizeKey(e, t) {
		let n = e.target instanceof Element ? e.target.closest(`.${MB}`) : null;
		return n !== null && !this.menus.isOpen(t) && (e.key === "ArrowDown" || e.key === "ArrowUp") && M(e) ? (e.preventDefault(), this.openSizes(t, n, e.key === "ArrowUp"), !0) : this.menus.isOpen(t) && EF(e, XB(t));
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${FB}`) : null, n = t?.closest(`.${AB}`) ?? null;
		t !== null && n !== null && this.menus.isOpen(n) && kF(t, XB(n));
	}
	toggleSizes(e) {
		let t = e.closest(`.${AB}`);
		t !== null && (this.menus.isOpen(t) ? this.menus.close(t) : this.openSizes(t, e, !1));
	}
	openSizes(e, t, n) {
		let r = e.querySelector(`:scope > .${PB}`);
		if (r === null) return;
		let i = XB(e), a = i.find((e) => e.getAttribute("aria-checked") === "true") ?? null;
		TF(this.menus, {
			owner: e,
			popup: r,
			anchor: t,
			placement: { placement: "bottom-end" },
			openers: [t]
		}, i, a, n);
	}
	restoreSize(e, t, n) {
		let r = this.store.read(t, HB), i = r === null ? 0 : Number(r);
		if (!Number.isInteger(i) || i <= 0) return;
		if (!YB(e, i)) {
			this.store.write(t, HB, null);
			return;
		}
		let a = _B(n);
		i !== a.size && (n.setAttribute(tn, String(i)), a.count > 0 && this.turnAsync(n, Math.floor(a.offset / i) * i));
	}
	chooseSize(e, t) {
		let n = e.querySelector(`.${AB}`);
		n !== null && this.menus.close(n);
		let r = this.targetOf(e);
		if (r === null || !Number.isInteger(t) || t <= 0) return;
		let i = _B(r.host);
		t !== i.size && (this.store.write(r.component, HB, String(t)), r.host.setAttribute(tn, String(t)), this.turnAsync(r.host, Math.floor(i.offset / t) * t));
	}
	handlePageKey(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "PageDown" && e.key !== "PageUp" || !M(e) || !(e.target instanceof Element)) return;
		let t = Af(e);
		if (t === null || !t.root.matches(".ui-items-view, .ui-table") || O(t.root)) return;
		let n = ZB(t.root);
		if (n === null || !n.hasAttribute("data-ui-window-paged")) return;
		let r = bB(this.shownState(n), e.key === "PageDown" ? "next" : "previous");
		r !== null && (e.preventDefault(), this.turnFromKeyAsync(t.root, n, r));
	}
	async turnFromKeyAsync(e, t, n) {
		let r = vf(e), i = Ff(r), a = i === null ? 0 : Math.max(0, r.indexOf(i));
		await this.requestPageAsync(t, n);
		let o = vf(e);
		o.length > 0 && zf(e, o, o[Math.min(a, o.length - 1)]);
	}
};
function WB(e, t, n) {
	if (e === "gap") {
		let e = document.createElement("span");
		return e.className = OB, e.setAttribute("aria-hidden", "true"), e.textContent = "…", e;
	}
	let r = document.createElement("button"), i = Ek(e, "N0", n);
	return r.className = IB.join(" "), r.setAttribute("type", "button"), r.setAttribute(yt, String(e)), r.textContent = i, D.write(r, "aria-label", LB, { page: i }), e === t && r.setAttribute("aria-current", "page"), r;
}
function GB(e, t, n) {
	let r = e.querySelector(`:scope > .${kB}`);
	if (r === null) return;
	let i = n(t.count === 0 ? 0 : t.offset + 1), a = n(t.offset + t.count);
	t.total === null ? D.write(r, null, zB, {
		from: i,
		to: a
	}) : D.write(r, null, RB, {
		from: i,
		to: a,
		total: n(t.total)
	});
}
function KB(e, t, n) {
	let r = e.querySelector(`:scope > .${AB}`), i = r?.querySelector(`.${NB}`) ?? null;
	if (r !== null && i !== null) {
		D.write(i, null, BB, { size: n(t.size) });
		for (let e of XB(r)) e.setAttribute("aria-checked", Number(e.getAttribute("data-ui-pager-size")) === t.size ? "true" : "false");
	}
}
function qB(e) {
	return [...e.querySelectorAll(`.${TB}, .${MB}`)];
}
function JB(e) {
	let t = qB(e), n = t.find((e) => e === document.activeElement), r = t.filter((e) => e.getAttribute("data-ui-pager-page") === "previous" || e.getAttribute("data-ui-pager-page") === "next");
	N(t, n ?? r.find(P) ?? t.find((e) => e.getClientRects().length > 0) ?? null);
}
function YB(e, t) {
	let n = e.querySelector(`:scope > .${AB}`);
	return n !== null && XB(n).some((e) => Number(e.getAttribute("data-ui-pager-size")) === t);
}
function XB(e) {
	return [...e.querySelectorAll(`:scope > .${PB} > .${FB}`)];
}
function ZB(e) {
	for (let t of e.querySelectorAll(`[${b}][${qt}="windowed"]`)) if (t.closest("[data-ui-id]") === e) return t;
	return null;
}
function QB(e) {
	return e instanceof Element && e.hasAttribute("data-ui-items-host");
}
function $B(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(wB) || t.querySelector(wB) !== null)) return !0;
	return !1;
}
//#endregion
//#region src/interactions/menu-search-engine.ts
var eV = `.${Vn}[${xn}]`, tV = ":scope > .ui-collapsible__bar", nV = ":scope > .ui-menu__host", rV = "ui-menu__item", iV = `:scope > .${Hn}`, aV = ":scope > .ui-menu__submenu > .ui-menu > .ui-menu__host", oV = class {
	active = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("input", (e) => this.handle(e), !0), t.addEventListener("change", (e) => this.handle(e), !0), t.addEventListener("keydown", (e) => this.handleKeydown(e)), V(t, eV, {
			childList: !0,
			addedOnly: !0,
			characterData: !0,
			attributeFilter: [fn, "class"]
		}, (e) => this.reconcile(e));
	}
	handle(e) {
		let t = e.target;
		if (!(t instanceof HTMLInputElement)) return;
		let n = sV(t);
		n !== null && this.search(n, t);
	}
	search(e, t) {
		let n = e.querySelector(nV);
		if (n === null) return;
		let r = ov(t.value, e);
		r.length === 0 ? this.clear(e, n) : (this.active.has(e) || this.active.set(e, {
			field: t,
			openBefore: cV(n)
		}), e.setAttribute(Sn, ""), lD(e, n, !this.filter(n, r)));
	}
	filter(e, t) {
		let n = null, r = !1, i = !1;
		for (let a of lV(e)) {
			let e = uV(a);
			if (e === "header") {
				n !== null && fV(n, r), n = a, r = !1;
				continue;
			}
			let o = e !== "separator" && this.match(a, t);
			fV(a, o), r ||= o, i ||= o;
		}
		return n !== null && fV(n, r), i;
	}
	match(e, t) {
		let n = cv(dV(e), t), r = e.hasAttribute("data-ui-menu-group") ? e.querySelector(aV) : null;
		if (r === null) return n;
		if (n) return pV(r), e.removeAttribute(hn), !0;
		let i = this.filter(r, t);
		return e.toggleAttribute(hn, i), i;
	}
	clear(e, t) {
		pV(t), e.removeAttribute(Sn), lV(t).length > 0 && lD(e, t, !1);
		let n = this.active.get(e);
		if (n === void 0) return;
		this.active.delete(e);
		let r = mV(e);
		for (let e of t.querySelectorAll(`[${pn}]:not([${mn}])`)) e.toggleAttribute(hn, !r && n.openBefore.has(e.getAttribute("data-ui-key") ?? e));
	}
	reconcile(e) {
		for (let t of e) {
			let e = this.active.get(t);
			e !== void 0 && (mV(t) && (e.field.value = "", e.field.blur()), this.search(t, e.field));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "ArrowDown" || e.defaultPrevented || !M(e) || !(e.target instanceof HTMLInputElement)) return;
		let t = sV(e.target), n = t === null ? void 0 : dL(t).find(P);
		n !== void 0 && (e.preventDefault(), n.focus());
	}
};
function sV(e) {
	let t = e.closest(eV), n = t?.querySelector(tV) ?? null;
	return t !== null && n !== null && n.contains(e) ? t : null;
}
function cV(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e.querySelectorAll(`[${pn}][${hn}]`)) t.add(n.getAttribute("data-ui-key") ?? n);
	return t;
}
function lV(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && e.classList.contains(rV));
}
function uV(e) {
	return e.querySelector(iV)?.getAttribute("data-ui-menu-item-kind") ?? "item";
}
function dV(e) {
	let t = e.querySelector(iV);
	return t === null ? "" : sv(dv(t), e);
}
function fV(e, t) {
	e.toggleAttribute(Cn, !t);
}
function pV(e) {
	for (let t of e.querySelectorAll(`[${Cn}]`)) t.removeAttribute(Cn);
}
function mV(e) {
	return e.hasAttribute("data-ui-collapsed") || e.classList.contains("ui-menu--rail");
}
//#endregion
//#region src/interactions/screen-keyboard.ts
var hV = 120;
function gV(e) {
	return e.typing && e.tallest - e.height > hV;
}
var _V = class {
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
		let t = gV({
			height: e.height,
			tallest: this.tallest,
			typing: od(document.activeElement)
		});
		t !== document.documentElement.hasAttribute("data-ui-keyboard-up") && document.documentElement.toggleAttribute(ri, t);
	}
}, vV = `[${Ln}], [${jn}]`, yV = "--ui-window-foot", bV = "--ui-window-foot-ink", xV = 120, SV = /\s*\/\s*([\d.]+)(%?)\s*\)$/, CV = /^rgba\(([^,]+),([^,]+),([^,]+),\s*([\d.]+)(%?)\s*\)$/;
function wV(e) {
	if (e === "transparent") return 0;
	let t = CV.exec(e) ?? SV.exec(e);
	if (t === null) return 1;
	let n = Number(t[t.length - 2]);
	return t[t.length - 1] === "%" ? n / 100 : n;
}
function TV(e) {
	let t = CV.exec(e);
	return t === null ? e.replace(SV, ")") : `rgb(${t[1]},${t[2]},${t[3]})`;
}
function EV(e) {
	let t = [], n = null;
	for (let r of e) {
		let e = wV(r);
		if (e >= 1) {
			n = r;
			break;
		}
		e > 0 && t.push(r);
	}
	if (n === null) return null;
	for (let e = t.length - 1; e >= 0; e--) n = `color-mix(in srgb, ${TV(t[e])} ${Math.round(wV(t[e]) * 1e3) / 10}%, ${n})`;
	return n;
}
function DV(e) {
	let t = [];
	for (let n = e; n !== null; n = n.parentElement) t.push(getComputedStyle(n).backgroundColor);
	return EV(t);
}
var OV = class {
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
			attributeFilter: [Jr]
		}), new MutationObserver(n).observe(document.head, {
			childList: !0,
			subtree: !0,
			characterData: !0
		}), matchMedia("(prefers-color-scheme: dark)").addEventListener("change", n), window.addEventListener("resize", n), document.addEventListener("transitionend", (e) => {
			e.target instanceof Element && e.target.closest(vV) !== null && n();
		}, !0), this.schedule();
	}
	schedule() {
		this.scheduled || (this.scheduled = !0, requestAnimationFrame(() => {
			this.scheduled = !1, this.update();
		}));
	}
	update() {
		let e = document.querySelectorAll(vV), t = e.length === 0 ? 0 : this.bottomInset(), n = e.length > 0 && AV(window.innerWidth / 2, window.innerHeight - t - 1);
		if (n && this.covered < xV) {
			this.covered++, this.schedule();
			return;
		}
		n || (this.covered = 0);
		for (let n of e) n.hasAttribute("data-ui-window-foot") && this.keepClear(n, t);
		let r = e.length === 0 ? null : kV(window.innerWidth / 2, window.innerHeight - t - 1, null), i = r === null ? null : DV(r);
		jV(document.documentElement, yV, i);
	}
	keepClear(e, t) {
		let n = e.getBoundingClientRect(), r = t > 0 && n.height > 0 && n.bottom >= window.innerHeight - 1, i = r ? kV(n.left + n.width / 2, Math.min(n.bottom, window.innerHeight - t) - 1, e) : null;
		r !== e.hasAttribute("data-ui-window-foot-edge") && e.toggleAttribute(ii, r), jV(e, bV, i === null ? null : DV(i));
	}
	bottomInset() {
		return this.probe === null && (this.probe = document.createElement("div"), this.probe.setAttribute("aria-hidden", "true"), this.probe.style.cssText = "position:fixed;visibility:hidden;pointer-events:none;height:0;padding-bottom:env(safe-area-inset-bottom,0px)", document.body.append(this.probe)), parseFloat(getComputedStyle(this.probe).paddingBottom) || 0;
	}
};
function kV(e, t, n) {
	for (let r of document.elementsFromPoint(e, t)) {
		let e = r.closest(vV);
		if (e !== null && (n === null || e === n)) return r;
	}
	return null;
}
function AV(e, t) {
	return document.elementsFromPoint(e, t).every((e) => e === document.documentElement);
}
function jV(e, t, n) {
	n === null ? e.style.getPropertyValue(t) !== "" && e.style.removeProperty(t) : e.style.getPropertyValue(t) !== n && e.style.setProperty(t, n);
}
//#endregion
//#region src/interactions/side-drawer-engine.ts
var MV = "[data-ui-root]", NV = "a[href]", PV = "ui-collapsible", FV = "ui-collapsible__bar", IV = "right-side", LV = "ui-side--left", RV = "ui-side--right", zV = "pinned", BV = class {
	root;
	holders = /* @__PURE__ */ new Map();
	openers = /* @__PURE__ */ new WeakMap();
	switchNames = /* @__PURE__ */ new Map();
	store = new jI();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), ig(() => this.refit(), gI);
		for (let e of document.querySelectorAll(MV)) qV(e);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${wn}]`);
		if (t !== null) {
			let e = t.closest(MV), n = t.getAttribute(wn);
			e !== null && n !== null && this.toggle(e, n, t);
			return;
		}
		let n = e.target.closest(`[${kn}]`);
		if (n !== null) {
			let e = n.closest(MV), t = n.getAttribute(kn);
			e !== null && t !== null && this.pin(e, t, !e.hasAttribute(An(t)), n);
			return;
		}
		if (e.target.closest("[data-ui-drawer-backdrop]") !== null) {
			this.closeAll();
			return;
		}
		let r = e.target.closest(`[${Zn}]`);
		if (r !== null && !e.defaultPrevented && WV(r)) {
			this.closeAll();
			return;
		}
		let i = e.target.closest(`${NV}, .${Hn}`), a = i?.closest(`[${zn}]`), o = a?.parentElement ?? null;
		i !== null && a != null && o?.getAttribute("data-ui-drawer-open") === a.getAttribute("data-ui-region") && GV(i) && this.close(o);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || j(e)) return;
		if (e.key === "Tab") {
			this.trapTab(e);
			return;
		}
		if (e.key !== "Escape" || Xu(e) || $_(e.target)) return;
		let t = !1;
		for (let { shell: e, drawer: n, modal: r } of this.openDrawers()) (r || n.contains(document.activeElement)) && (this.close(e), t = !0);
		t && e.preventDefault();
	}
	trapTab(e) {
		for (let { drawer: t, modal: n } of this.openDrawers()) n && $p(t, e);
	}
	openDrawers() {
		let e = [];
		for (let t of document.querySelectorAll(`${MV}[${Tn}]`)) {
			let n = t.getAttribute("data-ui-drawer-open") ?? "", r = JV(t, n);
			r !== null && !H_(r) && e.push({
				shell: t,
				drawer: r,
				modal: KV(t, n)
			});
		}
		return e;
	}
	refit() {
		for (let e of document.querySelectorAll(`${MV}[${Tn}]`)) {
			let t = e.getAttribute("data-ui-drawer-open") ?? "", n = JV(e, t), r = this.openers.get(e);
			n === null || !yI(e, t) ? this.close(e) : r?.isConnected === !0 && this.placeSwitch(n, r);
		}
	}
	toggle(e, t, n) {
		if (e.getAttribute("data-ui-drawer-open") === t) {
			this.close(e);
			return;
		}
		let r = JV(e, t);
		r !== null && !r.hasAttribute("data-ui-bottom-bar") && yI(e, t) && (e.hasAttribute("data-ui-drawer-open") && this.close(e), e.setAttribute(Tn, t), this.openers.set(e, n), this.markToggles(e), this.hold(r, KV(e, t)), this.placeSwitch(r, n), this.focusInto(e, t, r, document.activeElement, Bp(), performance.now() + z.normal));
	}
	hold(e, t) {
		if (this.holders.has(e) || e.hasAttribute("data-ui-focus-holder")) return;
		let n = !e.hasAttribute("tabindex"), r = t && !e.hasAttribute("aria-label") && !e.hasAttribute("aria-labelledby");
		this.holders.set(e, {
			modal: t,
			addsTabIndex: n,
			addsName: r,
			role: e.getAttribute("role")
		}), n && (e.tabIndex = -1), t && (e.setAttribute(Pi, ""), e.setAttribute("role", "dialog"), e.setAttribute("aria-modal", "true"), r && e.setAttribute("aria-label", D.text("ui.side.panel")));
	}
	placeSwitch(e, t) {
		let n = VV(e), r = t.getBoundingClientRect();
		if (n === null) return;
		this.switchNames.has(n) || this.switchNames.set(n, n.getAttribute("aria-label")), n.setAttribute("aria-label", D.text("ui.side.close"));
		let i = n.parentElement?.classList.contains(FV) === !0 ? n.parentElement : n;
		if (r.width === 0 || r.height === 0) {
			n.removeAttribute(En), i.removeAttribute(Dn);
			return;
		}
		n.style.setProperty("--ui-drawer-switch-width", `${r.width}px`), n.style.setProperty("--ui-drawer-switch-height", `${r.height}px`), n.style.setProperty("--ui-drawer-switch-x", "0px"), i.style.setProperty("--ui-drawer-switch-y", "0px"), n.setAttribute(En, ""), i.setAttribute(Dn, "");
		let a = n.getBoundingClientRect(), o = e.getBoundingClientRect(), s = UV(r.left - e.offsetLeft, e.clientWidth - a.width), c = UV(r.top - o.top, e.clientHeight - a.height);
		n.style.setProperty("--ui-drawer-switch-x", `${s - (a.left - o.left)}px`), i.style.setProperty("--ui-drawer-switch-y", `${c - (a.top - o.top)}px`);
	}
	focusInto(e, t, n, r, i, a) {
		e.getAttribute("data-ui-drawer-open") !== t || document.activeElement !== r || n.contains(r) || (am(n, i ? n : null), performance.now() < a && document.activeElement === r && requestAnimationFrame(() => this.focusInto(e, t, n, r, i, a)));
	}
	pin(e, t, n, r) {
		let i = JV(e, t);
		if (i === null || SI(e, t)) return;
		let a = i.contains(r);
		if (n && e.getAttribute("data-ui-drawer-open") === t && this.close(e, !a), e.toggleAttribute(An(t), n), qV(e), !n && a && i.contains(document.activeElement)) {
			let n = this.returnTarget(e, t);
			n !== null && R(n);
		}
		let o = i.querySelector(`[${Ye}]`);
		o !== null && this.store.write(o, zV, n ? "true" : null, n ? {
			root: !0,
			attributes: { [An(t)]: "" }
		} : null);
	}
	closeAll() {
		for (let e of document.querySelectorAll(`${MV}[${Tn}]`)) this.close(e);
	}
	close(e, t = !0) {
		let n = e.getAttribute(Tn);
		if (e.removeAttribute(Tn), this.markToggles(e), n === null) return;
		let r = JV(e, n), i = document.activeElement;
		if (t && (i === null || i === document.body || r?.contains(i) === !0)) {
			let t = this.returnTarget(e, n);
			t !== null && r !== null && r.contains(i) ? mm(t, r) : t !== null && R(t);
		}
		this.release(r), this.renameSwitch(r);
	}
	returnTarget(e, t) {
		let n = this.openers.get(e);
		if (this.openers.delete(e), n?.isConnected === !0 && n.getAttribute("data-ui-drawer-toggle") === t && n.checkVisibility()) return n;
		let r = [...e.querySelectorAll(`[${wn}="${S(t)}"]`)];
		return r.find((e) => e.checkVisibility()) ?? r[0] ?? null;
	}
	markToggles(e) {
		let t = e.getAttribute(Tn);
		for (let n of e.querySelectorAll(`[${wn}]`)) n.setAttribute("aria-expanded", String(n.getAttribute(wn) === t));
	}
	release(e) {
		let t = e === null ? void 0 : this.holders.get(e);
		e !== null && t !== void 0 && (this.holders.delete(e), t.addsTabIndex && e.removeAttribute("tabindex"), t.modal && (e.removeAttribute(Pi), e.removeAttribute("aria-modal"), t.role === null ? e.removeAttribute("role") : e.setAttribute("role", t.role), t.addsName && e.removeAttribute("aria-label")));
	}
	renameSwitch(e) {
		for (let [t, n] of this.switchNames) e?.contains(t) !== !0 && t.isConnected || (this.switchNames.delete(t), n === null ? t.removeAttribute("aria-label") : t.setAttribute("aria-label", n));
	}
};
function VV(e) {
	for (let t of e.querySelectorAll(`[${Zn}]`)) if (WV(t) && t.checkVisibility() && HV(t.closest(`.${PV}`), e)) return t;
	return null;
}
function HV(e, t) {
	let n = e;
	for (; n !== null && n !== t;) {
		let e = n.parentElement;
		if (e === null || e.firstElementChild !== n) return !1;
		n = e;
	}
	return n === t;
}
function UV(e, t) {
	return Math.max(0, Math.min(e, t));
}
function WV(e) {
	let t = e.closest(`.${PV}`), n = t?.closest(`[${zn}]`), r = n?.getAttribute(zn), i = n?.parentElement;
	return t == null || t.hasAttribute("data-ui-collapsed") || r == null || i == null ? !1 : i.matches(MV) && i.getAttribute("data-ui-drawer-open") === r && t.classList.contains(r === IV ? RV : LV);
}
function GV(e) {
	return !e.classList.contains("ui-menu-item") || uL(e) && e.closest(".ui-context-menu, .ui-split-button__menu, .ui-flyout__content") === null;
}
function KV(e, t) {
	return !(e.getAttribute("data-ui-drawer-modeless") ?? "").split(" ").includes(t);
}
function qV(e) {
	for (let t of e.querySelectorAll(`[${kn}]`)) {
		let n = String(e.hasAttribute(An(t.getAttribute("data-ui-drawer-pin") ?? "")));
		t.getAttribute("aria-pressed") !== n && (t.setAttribute("aria-pressed", n), t.getAttribute("data-ui-value-kind") === "pressed" && t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}
function JV(e, t) {
	return e.querySelector(`:scope > [${zn}="${S(t)}"]`);
}
//#endregion
//#region src/interactions/collapsible-engine.ts
var YV = "ui-collapsible", XV = "ui-collapsible__content", ZV = "ui-collapsible__bar", QV = "ui-collapsible__bar-content", $V = "collapsed", eH = class {
	root;
	store = new jI();
	restored = /* @__PURE__ */ new WeakSet();
	folds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.restoreEach(this.root.querySelectorAll(`.${YV}`)), V(this.root, `.${YV}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [fn]
		}, (e) => this.restoreEach(e));
	}
	restoreEach(e) {
		for (let t of e) this.restored.has(t) ? this.apply(t, t.hasAttribute(fn)) : (this.restored.add(t), this.restore(t));
	}
	restore(e) {
		if (this.toggleOf(e) === null) return;
		let t = this.store.read(e, $V);
		t !== null && this.apply(e, t === "true");
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Zn}]`), n = t?.closest(`.${YV}`) ?? null;
		if (t === null || n === null || WV(t)) return;
		e.preventDefault();
		let r = !n.hasAttribute(fn), i = this.partsOf(n, t);
		this.cancelFold(n);
		let a = nH(n, i);
		this.apply(n, r), this.playFold(n, i, a, r), this.store.write(n, $V, r ? "true" : "false", r ? { attributes: { [fn]: "" } } : null);
	}
	apply(e, t) {
		e.toggleAttribute(fn, t), this.toggleOf(e)?.setAttribute("aria-expanded", t ? "false" : "true");
	}
	partsOf(e, t) {
		return {
			content: e.querySelector(`:scope > .${XV}`),
			bar: e.querySelector(`:scope > .${ZV} > .${QV}`),
			toggle: t
		};
	}
	toggleOf(e) {
		return e.querySelector(`:scope > [${Zn}], :scope > .${ZV} > [${Zn}]`);
	}
	playFold(e, t, n, r) {
		if (typeof e.animate != "function" || Xh()) return;
		let i = iH(tH(e), n, nH(e, t), r);
		if (i === null) return;
		e.setAttribute(Qn, ""), e.offsetWidth;
		let a = {
			duration: z.normal,
			easing: z.ease
		}, o = [e.animate(i.component, a)];
		t.content !== null && o.push(t.content.animate(i.content, a)), t.bar !== null && o.push(t.bar.animate(i.bar, a)), i.toggle !== null && o.push(t.toggle.animate(i.toggle, a)), this.folds.set(e, o), Promise.allSettled(o.map((e) => e.finished)).then(() => {
			this.folds.get(e) === o && (this.folds.delete(e), e.removeAttribute(Qn));
		});
	}
	cancelFold(e) {
		let t = this.folds.get(e);
		if (t !== void 0) {
			this.folds.delete(e), e.removeAttribute(Qn);
			for (let e of t) e.cancel();
		}
	}
};
function tH(e) {
	return e.classList.contains("ui-side--top") || e.classList.contains("ui-side--bottom") ? "height" : "width";
}
function nH(e, t) {
	let n = tH(e), r = rH(n), i = e.getBoundingClientRect(), a = t.content?.getBoundingClientRect(), o = t.toggle.getBoundingClientRect();
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
function rH(e) {
	return e === "width" ? "height" : "width";
}
function iH(e, t, n, r) {
	let i = rH(e), a = t.component !== n.component, o = Math.abs(t.componentAcross - n.componentAcross) >= .5;
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
function aH(e, t) {
	if (typeof ResizeObserver == "function") {
		let n = new ResizeObserver(() => t(e));
		return n.observe(e), () => n.disconnect();
	}
	let n = () => t(e);
	return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
}
//#endregion
//#region src/interactions/grid-splitter-engine.ts
var oH = "ui-grid-splitter", sH = "ui-container", cH = "ui-orientation--vertical", lH = 16, uH = {
	sliver: 0,
	passFloors: !0
}, dH = {
	sliver: 48,
	passFloors: !0
}, fH = {
	slot: "columns",
	authored: "--ui-columns",
	split: "--ui-split-columns",
	limits: $n,
	computed: "gridTemplateColumns",
	lineStart: "gridColumnStart",
	lineEnd: "gridColumnEnd",
	coordinate: "clientX",
	decrease: "ArrowLeft",
	increase: "ArrowRight"
}, pH = {
	slot: "rows",
	authored: "--ui-rows",
	split: "--ui-split-rows",
	limits: er,
	computed: "gridTemplateRows",
	lineStart: "gridRowStart",
	lineEnd: "gridRowEnd",
	coordinate: "clientY",
	decrease: "ArrowUp",
	increase: "ArrowDown"
}, mH = class {
	root;
	store = new jI();
	restored = /* @__PURE__ */ new WeakMap();
	warner = new p();
	drag;
	placedTiers = /* @__PURE__ */ new WeakMap();
	waiting = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new fv({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${oH}`),
			begin: (e) => this.resolveContext(e),
			coordinate: (e) => e.axis.coordinate,
			move: (e, t) => {
				this.apply(e, t, uH) && this.reportPosition(e.splitter, e.tracks);
			},
			end: (e, t) => {
				this.settle(e), this.remember(t), this.reportPosition(e), this.writeBack(e, t);
			},
			cancel: (e, t) => this.putBack(e, t)
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.prepareEach(this.root.querySelectorAll(`.${oH}`)), V(this.root, `.${oH}`, { childList: !0 }, (e) => this.prepareEach(e)), V(this.root, `.${oH}`, { attributeFilter: [nr] }, (e) => this.takeEach(e)), window.addEventListener("resize", () => this.reportEach());
	}
	prepareEach(e) {
		for (let t of e) {
			let e = _H(t);
			e !== null && (this.restore(e, vH(t)), this.place(t), this.reportPosition(t));
		}
	}
	restore(e, t) {
		let n = this.restored.get(e);
		if (n === void 0 && (n = /* @__PURE__ */ new Set(), this.restored.set(e, n)), n.has(t.slot)) return;
		n.add(t.slot);
		let r = this.store.readJson(e, t.slot);
		if (r !== null) for (let n of B) {
			let i = r[n], a = sg(t.split, n);
			i !== void 0 && e.style.getPropertyValue(a).length === 0 && e.style.setProperty(a, i);
		}
	}
	place(e) {
		let t = TH(e);
		if (t === null) return;
		if (e.getClientRects().length === 0) {
			this.waitForBox(e);
			return;
		}
		this.stopWaiting(e);
		let n = this.resolveContext(e);
		if (n === null || (this.placedTiers.set(e, n.tier), !e.hasAttribute("data-ui-bind-position") && bH(n.container, n.axis, n.tier) !== void 0)) return;
		let r = nu(n.sizes, n.runs, t);
		Math.abs(r) >= 1 && this.apply(n, r) && this.remember(n);
	}
	waitForBox(e) {
		this.waiting.has(e) || this.waiting.set(e, aH(e, () => {
			!e.isConnected || TH(e) === null ? this.stopWaiting(e) : e.getClientRects().length > 0 && (this.place(e), this.reportPosition(e));
		}));
	}
	stopWaiting(e) {
		this.waiting.get(e)?.(), this.waiting.delete(e);
	}
	takeEach(e) {
		for (let t of e) TH(t) === null && t.hasAttribute("data-ui-bind-position") ? this.reset(t, !1) : this.place(t), this.reportPosition(t);
	}
	reportEach() {
		let e = og();
		for (let t of this.root.querySelectorAll(`.${oH}`)) this.placedTiers.has(t) && this.placedTiers.get(t) !== e && this.place(t), this.reportPosition(t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || !M(e)) return;
		let t = e.target.closest(`.${oH}`);
		if (t === null || this.drag.active || O(t)) return;
		if (e.key === "Enter") {
			e.preventDefault(), this.reset(t);
			return;
		}
		let n = this.resolveContext(t);
		if (n === null) return;
		let r = DH(t), i = n.sizes.reduce((e, t) => e + t, 0), a;
		switch (e.key) {
			case n.axis.decrease:
				a = -r;
				break;
			case n.axis.increase:
				a = r;
				break;
			case "PageUp":
			case "PageDown":
				a = Ml(r, i) * wH(e.key, n.axis);
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
		let n = _H(e);
		if (n === null) return;
		let r = vH(e);
		for (let e of B) n.style.removeProperty(sg(r.split, e));
		this.store.write(n, r.slot, null), this.placedTiers.delete(e), e.hasAttribute("data-ui-bind-position") || this.place(e), this.reportPosition(e), t && e.hasAttribute("data-ui-bind-position") && e.hasAttribute("data-ui-splitter-position") && (e.removeAttribute(nr), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	writeBack(e, t) {
		if (!e.hasAttribute("data-ui-bind-position")) return;
		let n = EH(tu(xH(t.container, t.axis), t.runs));
		e.getAttribute("data-ui-splitter-position") !== n && (e.setAttribute(nr, n), this.placedTiers.set(e, t.tier), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	handleDoubleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${oH}`) : null;
		t !== null && this.reset(t);
	}
	settle(e) {
		let t = this.resolveContext(e), n = t === null ? 0 : ou(t.tracks, t.sizes, t.runs, 48);
		t !== null && n !== 0 && this.apply(t, n, uH);
	}
	putBack(e, t) {
		let n = sg(t.axis.split, t.tier);
		t.before.length === 0 ? t.container.style.removeProperty(n) : t.container.style.setProperty(n, t.before), this.reportPosition(e);
	}
	apply(e, t, n = dH) {
		let r = Gl(e.tracks, e.sizes, e.runs, t, n);
		return r !== null && (e.container.style.setProperty(sg(e.axis.split, e.tier), Ll(r)), !0);
	}
	remember(e) {
		let { container: t, axis: n } = e, r = {}, i = {};
		for (let e of B) {
			let a = sg(n.split, e), o = t.style.getPropertyValue(a).trim();
			o.length > 0 && (r[e] = o, i[a] = o);
		}
		let a = { styles: i };
		this.store.write(t, n.slot, Object.keys(r).length === 0 ? null : JSON.stringify(r), a);
	}
	resolveContext(e) {
		let t = _H(e);
		if (t === null) return this.warner.warn(e, "a grid splitter must be a direct child of a container."), null;
		let n = vH(e), r = og(), i = yH(t, n, r), a = i === null ? null : Nl(i);
		if (a === null) return this.warner.warn(e, "the container's track list could not be read.", { template: i }), null;
		let o = Vl(a, Bl(t.getAttribute(n.limits))), s = xH(t, n), c = SH(e, n);
		if (c === null || c >= o.length || s.length < o.length) return this.warner.warn(e, "the splitter's track could not be found in its container.", {
			index: c,
			tracks: o.length,
			sizes: s.length
		}), null;
		o[c].kind === "star" && this.warner.warn(e, "a grid splitter sits in a star track and shares the room it divides; give it an Auto or Absolute track.");
		let l = Hl(c, CH(t, n).map((e) => SH(e, n)).filter((e) => e !== null && e !== c), o.length);
		return l === null ? (this.warner.warn(e, "a grid splitter at the container's edge has nothing on one side to move."), null) : {
			splitter: e,
			container: t,
			axis: n,
			tracks: o,
			sizes: s,
			runs: l,
			tier: r,
			before: t.style.getPropertyValue(sg(n.split, r))
		};
	}
	reportPosition(e, t) {
		let n = _H(e);
		if (n === null) return;
		let r = vH(e), i = SH(e, r), a = xH(n, r), o = CH(n, r).map((e) => SH(e, r)).filter((e) => e !== null && e !== i), s = i === null ? null : Hl(i, o, a.length);
		s !== null && (e.setAttribute("aria-valuemin", "0"), e.setAttribute("aria-valuemax", "100"), e.setAttribute("aria-valuenow", String(eu(a, s))), C(e, ci, hH(a, s.before) ? "before" : hH(a, s.after) ? "after" : null), gH(n, t === void 0 ? null : {
			axis: r,
			tracks: su(t, a, s, 48)
		}));
	}
};
function hH(e, t) {
	return t.every((t) => (e[t] ?? 0) < 1);
}
function gH(e, t) {
	let n = [fH, pH].filter((t) => CH(e, t).length > 0).map((t) => ({
		axis: t,
		sizes: xH(e, t)
	}));
	for (let r of e.children) {
		if (!(r instanceof HTMLElement)) continue;
		let e = getComputedStyle(r), i = r.classList.contains(oH) ? vH(r) : null, a = n.some(({ axis: n, sizes: r }) => n !== i && lu(e[n.lineStart], e[n.lineEnd], r, t?.axis === n ? t.tracks : void 0));
		a !== r.hasAttribute("data-ui-split-folded") && r.toggleAttribute(si, a);
	}
}
function _H(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(sH) ? t : null;
}
function vH(e) {
	return e.classList.contains(cH) ? fH : pH;
}
function yH(e, t, n) {
	let r = bH(e, t, n);
	if (r !== void 0) return r;
	let i = e.style.getPropertyValue(t.authored).trim();
	return i.length > 0 ? i : null;
}
function bH(e, t, n) {
	return ug(n, (n) => e.style.getPropertyValue(sg(t.split, n)).trim() || void 0);
}
function xH(e, t) {
	return getComputedStyle(e)[t.computed].split(" ").map(parseFloat).filter((e) => Number.isFinite(e));
}
function SH(e, t) {
	let n = Number(getComputedStyle(e)[t.lineStart]);
	return Number.isInteger(n) && n >= 1 ? n - 1 : null;
}
function CH(e, t) {
	let n = [];
	for (let r of e.children) r instanceof HTMLElement && r.classList.contains(oH) && vH(r) === t && n.push(r);
	return n;
}
function wH(e, t) {
	return t.increase === "ArrowDown" ? e === "PageDown" ? 1 : -1 : e === "PageUp" ? 1 : -1;
}
function TH(e) {
	return ru(e.getAttribute(nr));
}
function EH(e) {
	return String(Math.round(e * 1e4) / 1e4);
}
function DH(e) {
	let t = Number(e.getAttribute(tr));
	return Number.isFinite(t) && t > 0 ? t : lH;
}
//#endregion
//#region src/interactions/pane-container-engine.ts
var OH = "ui-pane-container", kH = "ui-pane-container__place", AH = "ui-pane-container__pane", jH = "ui-pane-container__grip", MH = "data-ui-pane-lifted", NH = "data-ui-pane-target", PH = "data-ui-pane-moving", FH = "data-ui-pane-near", IH = "data-ui-pane-raised", LH = ".ui-text-type--display, .ui-text-type--title, .ui-text-type--subtitle", RH = "panes", zH = ",", BH = 32, VH = class {
	root;
	store = new jI();
	drag;
	restored = /* @__PURE__ */ new WeakSet();
	held = null;
	raised = null;
	near = null;
	nearTop = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new fv({
			root: this.root,
			resolveHandle: (e) => UH(e),
			begin: (e, t) => this.lift(e, t),
			move: (e, t, n) => this.follow(e, n),
			end: (e, t) => this.put(t),
			cancel: (e, t) => this.putBack(t),
			takenBack: (e, t) => this.putBack(t)
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), { passive: !0 }), this.root.addEventListener("pointerout", (e) => this.handlePointerOut(e), { passive: !0 }), this.root.addEventListener("pointerover", () => this.forgetNearTop(), { passive: !0 }), this.root.addEventListener("scroll", () => this.handleScroll(), {
			capture: !0,
			passive: !0
		}), window.addEventListener("resize", () => this.forgetNearTop()), this.arrangeEach(this.root.querySelectorAll(`.${OH}`), !1), V(this.root, `.${OH}`, {
			childList: !0,
			attributeFilter: [rr],
			relevant: JH
		}, (e) => this.arrangeEach(YH(e), !0));
	}
	arrangeEach(e, t) {
		for (let n of e) {
			let e = !this.restored.has(n);
			if (e) {
				this.restored.add(n), this.restore(n);
				for (let e of XH(n)) {
					let t = e.querySelector(`:scope > .${AH} > .${jH}`);
					t !== null && GH(t);
				}
			}
			n.hasAttribute(PH) || eU(n, QH(n), t && !e);
		}
	}
	restore(e) {
		if (e.hasAttribute("data-ui-bind-layout")) return;
		let t = this.store.read(e, RH);
		t !== null && e.setAttribute(rr, t);
	}
	lift(e, t) {
		this.dropStaleHold();
		let n = e.parentElement, r = n?.parentElement, i = r?.parentElement;
		if (this.held !== null || n === null || r == null || i == null || ZH(i).length < 2) return null;
		if (typeof n.getAnimations == "function") for (let e of n.getAnimations()) e.cancel();
		n.setAttribute(MH, ""), i.setAttribute(PH, "");
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
		n.style.minWidth = `${r.width}px`, n.style.minHeight = `${r.height}px`, t.style.left = `${r.left}px`, t.style.top = `${r.top}px`, t.style.width = `${r.width}px`, t.style.height = `${r.height}px`, t.setAttribute("popover", "manual"), t.setAttribute(IH, ""), t.showPopover(), this.raised = e;
	}
	follow(e, t) {
		e.pane.style.transform = `translate(${t.x - e.start.x}px, ${t.y - e.start.y}px)`, this.mark(e, _U(e.container, e.origin, t));
	}
	mark(e, t) {
		e.target !== t && (e.target?.removeAttribute(NH), t?.setAttribute(NH, ""), e.target = t);
	}
	put(e) {
		let t = e.target, n = e.pane.parentElement, r = t?.querySelector(`:scope > .${AH}`) ?? null;
		if (t === null || n === null || r === e.pane || !e.container.isConnected) return this.putBack(e), null;
		this.settle(e);
		let i = /* @__PURE__ */ new Map([[e.pane, t]]);
		return r !== null && i.set(r, n), tU(e.container, i, !0), this.keep(e.container), t;
	}
	putBack(e) {
		this.settle(e), nU(e.pane), e.container.isConnected && eU(e.container, QH(e.container), !0);
	}
	settle(e) {
		this.lower(e), e.target?.removeAttribute(NH), e.pane.removeAttribute(MH), e.container.removeAttribute(PH), e.grip.setAttribute("aria-pressed", "false"), e.grip.removeAttribute(Fi);
	}
	lower(e) {
		let { pane: t, origin: n } = e;
		if (this.raised === e && (this.raised = null), t.hasAttribute(IH)) {
			t.matches(":popover-open") && t.hidePopover(), t.removeAttribute("popover"), t.removeAttribute(IH);
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
		let t = $H(e);
		e.setAttribute(rr, t), e.hasAttribute("data-ui-bind-layout") ? e.dispatchEvent(new Event("change", { bubbles: !0 })) : this.store.write(e, RH, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || !M(e)) return;
		this.dropStaleHold();
		let t = UH(e.target);
		if (t === null || this.drag.active) return;
		let n = this.held;
		if (n === null) {
			if (e.key !== " " && e.key !== "Enter") return;
			e.preventDefault(), this.hold(t);
			return;
		}
		if (n.pane !== t.parentElement) return;
		let r = HH[e.key];
		if (r !== void 0) {
			e.preventDefault();
			let t = vU(n.container, n.origin, n.target ?? n.origin, r) ?? n.target;
			t !== null && t !== n.target && Aj({
				key: "ui.pane.target",
				args: qH(n.container, t)
			}), this.mark(n, t);
		} else if (e.key === " " || e.key === "Enter") {
			e.preventDefault(), this.held = null;
			let r = this.put(n);
			if (r === null) Aj({ key: "ui.pane.back" });
			else {
				let { index: e, count: t } = qH(n.container, r);
				Mj(e, t);
			}
			t.focus({ preventScroll: !0 });
		} else e.key === "Escape" && (e.preventDefault(), this.held = null, this.putBack(n), Aj({ key: "ui.pane.back" }));
	}
	hold(e) {
		this.held = this.lift(e, {
			x: 0,
			y: 0
		}), this.held !== null && (e.setAttribute("aria-pressed", "true"), e.setAttribute(Fi, ""), Aj({ key: "ui.pane.lifted" }));
	}
	handleFocusOut(e) {
		let t = this.held;
		t !== null && e.target instanceof Element && e.target.parentElement === t.pane && (this.held = null, this.putBack(t));
	}
	handleFocusIn(e) {
		let t = e.target instanceof Element ? UH(e.target) : null;
		t !== null && GH(t);
	}
	handlePointerMove(e) {
		if (!(e instanceof PointerEvent) || e.pointerType === "touch") return;
		let t = e.target instanceof Element ? WH(e.target) : null;
		if (t === null) {
			this.markNear(null);
			return;
		}
		let n = this.nearTop;
		n?.pane !== t && (n = {
			pane: t,
			top: t.getBoundingClientRect().top
		}, this.nearTop = n), this.markNear(e.clientY - n.top < BH ? t : null);
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
		e !== this.near && (this.near?.removeAttribute(FH), e?.setAttribute(FH, ""), this.near = e);
	}
	handlePointerOut(e) {
		e instanceof PointerEvent && e.relatedTarget === null && this.markNear(null);
	}
}, HH = {
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
function UH(e) {
	let t = e.closest(`.${jH}`);
	return t?.parentElement?.parentElement?.parentElement?.classList.contains(OH) === !0 ? t : null;
}
function WH(e) {
	let t = e.closest(`.${AH}`);
	return t?.parentElement?.parentElement?.classList.contains(OH) === !0 ? t : null;
}
function GH(e) {
	let t = e.parentElement, n = t === null ? null : KH(t), r = n === null ? "ui.pane.move" : "ui.pane.grip", i = n === null ? null : { name: n };
	e.getAttribute("aria-label") !== D.translate(r, i) && D.write(e, "aria-label", r, i);
}
function KH(e) {
	for (let t of e.querySelectorAll(LH)) {
		let n = WH(t) === e ? t.textContent?.trim() ?? "" : "";
		if (n.length > 0) return n;
	}
	return null;
}
function qH(e, t) {
	let n = ZH(e);
	return {
		index: n.indexOf(t) + 1,
		count: n.length
	};
}
function JH(e) {
	if (e.type === "attributes") return e.target instanceof Element && e.target.classList.contains(OH);
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains(OH) || t.querySelector(`.${OH}`) !== null)) return !0;
	return !1;
}
function YH(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) {
		t.add(n);
		for (let e of n.querySelectorAll(`.${OH}`)) t.add(e);
	}
	return t;
}
function XH(e) {
	return Array.from(e.querySelectorAll(`:scope > .${kH}`));
}
function ZH(e) {
	return XH(e).filter((e) => e.getClientRects().length > 0);
}
function QH(e) {
	return e.getAttribute(rr);
}
function $H(e) {
	return XH(e).map((e) => e.querySelector(`:scope > .${AH}`)?.getAttribute("data-ui-pane") ?? "").join(zH);
}
function eU(e, t, n) {
	let r = XH(e), i = iU(r.map((e) => e.getAttribute("data-ui-pane-place") ?? ""), t), a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
	for (let e of r) {
		let t = e.querySelector(`:scope > .${AH}`), n = t?.getAttribute(ir);
		t != null && n != null && a.set(n, t);
	}
	r.forEach((e, t) => {
		let n = a.get(i[t]);
		n !== void 0 && n.parentElement !== e && o.set(n, e);
	}), o.size > 0 && tU(e, o, n);
}
function tU(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let e of t.keys()) r.set(e, e.getBoundingClientRect());
	for (let [e, n] of t) e.style.transform = "", n.append(e);
	if (pU(e), !n || Xh()) return;
	let i = t.size + 1;
	for (let [e, t] of r) {
		let n = typeof e.animate == "function" ? rU(t, e.getBoundingClientRect()) : null, r = String(i--);
		n !== null && e.animate(n.map((e) => ({
			...e,
			zIndex: r
		})), {
			duration: z.normal + 60,
			easing: z.ease
		});
	}
}
function nU(e) {
	let t = e.style.transform;
	e.style.transform = "", !(t.length === 0 || t === "translate(0px, 0px)" || Xh() || typeof e.animate != "function") && e.animate([{ transform: t }, { transform: "none" }], {
		duration: z.normal,
		easing: z.ease
	});
}
function rU(e, t) {
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
function iU(e, t) {
	let n = new Set(e), r = /* @__PURE__ */ new Set(), i = e.map(() => null), a = t === null || t.length === 0 ? [] : t.split(zH).map((e) => e.trim());
	for (let e = 0; e < i.length && e < a.length; e++) n.has(a[e]) && !r.has(a[e]) && (i[e] = a[e], r.add(a[e]));
	let o = e.filter((e) => !r.has(e));
	return i.map((e) => e ?? o.shift() ?? "");
}
function aU(e, t, n, r, i, a, o) {
	let s = e.map((e) => oU(e.cells, n));
	return {
		cells: s,
		columnOrder: a ? sU(e, t, s, r, !0) : null,
		rowOrder: o ? sU(e, t, s, i, !1) : null
	};
}
function oU(e, t) {
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
function sU(e, t, n, r, i) {
	let a = [...n], o = new Map(e.map((e, t) => [e.name, t])), s = a.map(() => !1), c = null;
	for (let l = 0; l < a.length; l++) {
		if (s[l]) continue;
		let u = [];
		for (let e = l; e < a.length; e++) !s[e] && dU(a[e], a[l], i) && (s[e] = !0, u.push(e));
		u.sort((e, t) => uU(a[e], i).start - uU(a[t], i).start);
		let d = 0;
		for (let s = 1; s <= u.length; s++) s < u.length && uU(a[u[s]], i).start === fU(a[u[s - 1]], i) || (s - d > 1 && (c = cU(u.slice(d, s), e, t, o, a, n, r, i, c)), d = s);
	}
	return c;
}
function cU(e, t, n, r, i, a, o, s, c) {
	let l = [], u = !1, d = !1;
	for (let i of e) {
		let a = r.get(n[i]);
		if (a === void 0 || !e.includes(a)) return c;
		l.push(a), u ||= t[a].keepsSize, d ||= a !== i;
	}
	let f = uU(i[e[0]], s).start, p = fU(i[e[e.length - 1]], s);
	if (!u || !d || p - 1 > o || lU(e, i, s, f, p)) return c;
	let m = c ?? Array.from({ length: o }, (e, t) => t), h = f;
	return e.forEach((e, t) => {
		let { start: n, span: r } = uU(i[l[t]], s);
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
function lU(e, t, n, r, i) {
	return t.some((t, a) => {
		let o = uU(t, n).start, s = fU(t, n);
		return !e.includes(a) && o < i && s > r && (o > r || s < i);
	});
}
function uU(e, t) {
	return t ? {
		start: e.column,
		span: e.columnSpan
	} : {
		start: e.row,
		span: e.rowSpan
	};
}
function dU(e, t, n) {
	return n ? e.row === t.row && e.rowSpan === t.rowSpan : e.column === t.column && e.columnSpan === t.columnSpan;
}
function fU(e, t) {
	let { start: n, span: r } = uU(e, t);
	return n + r;
}
function pU(e) {
	let t = hU(e.getAttribute(ar)), n = hU(e.getAttribute(or));
	if (t === null && n === null) return;
	let r = XH(e), i = new Set(r.flatMap((e) => {
		let t = e.querySelector(`:scope > .${AH}`);
		return t?.hasAttribute("data-ui-pane-keeps-size") === !0 ? [t.getAttribute("data-ui-pane") ?? ""] : [];
	})), a = r.map((e) => {
		let t = e.getAttribute("data-ui-pane-place") ?? "";
		return {
			name: t,
			cells: hU(e.getAttribute("data-ui-pane-cells"), gU) ?? [],
			keepsSize: i.has(t)
		};
	}), o = r.map((e) => e.querySelector(`:scope > .${AH}`)?.getAttribute("data-ui-pane") ?? ""), s = [], c = [];
	B.forEach((e, i) => {
		let l = aU(a, o, i, t?.length ?? 0, n?.length ?? 0, t !== null, n !== null);
		r.forEach((t, n) => {
			let r = l.cells[n];
			t.style.setProperty(sg("--ui-placement-column", e), String(r.column)), t.style.setProperty(sg("--ui-placement-row", e), String(r.row)), t.style.setProperty(sg("--ui-placement-column-span", e), String(r.columnSpan)), t.style.setProperty(sg("--ui-placement-row-span", e), String(r.rowSpan));
		}), s.push(l.columnOrder), c.push(l.rowOrder);
	}), mU(e, "--ui-pane-columns", t, s), mU(e, "--ui-pane-rows", n, c);
}
function mU(e, t, n, r) {
	let i = n !== null && r.some((e) => e !== null);
	B.forEach((a, o) => {
		i ? e.style.setProperty(sg(t, a), (r[o] ?? n.map((e, t) => t)).map((e) => n[e]).join(" ")) : e.style.removeProperty(sg(t, a));
	});
}
function hU(e, t = (e) => e) {
	if (e === null) return null;
	try {
		let n = JSON.parse(e);
		return Array.isArray(n) ? n.map(t) : null;
	} catch {
		return null;
	}
}
function gU(e) {
	return Array.isArray(e) && e.length === 4 ? {
		column: Number(e[0]),
		row: Number(e[1]),
		columnSpan: Number(e[2]),
		rowSpan: Number(e[3])
	} : null;
}
function _U(e, t, n) {
	for (let r of ZH(e)) {
		if (r === t) continue;
		let e = r.getBoundingClientRect();
		if (n.x >= e.left && n.x <= e.right && n.y >= e.top && n.y <= e.bottom) return r;
	}
	return null;
}
function vU(e, t, n, r) {
	let i = ZH(e).map((e) => ({
		place: e,
		box: e.getBoundingClientRect()
	})), a = i.find((e) => e.place === n)?.box;
	if (a === void 0) return null;
	let o = bU(yU(a), i.map((e) => e.place === t || e.place === n ? null : yU(e.box)), r);
	return o === null ? null : i[o].place;
}
function yU(e) {
	return {
		x: e.left + e.width / 2,
		y: e.top + e.height / 2
	};
}
function bU(e, t, n) {
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
var xU = "ui-split-button", SU = "ui-split-button__main", CU = "ui-split-button__toggle", wU = "ui-split-button__menu", TU = "ui-split-button--open", EU = class {
	root;
	menus = new Qv({
		show: ({ owner: e }) => e.classList.add(TU),
		hide: ({ owner: e }) => e.classList.remove(TU),
		closesWhenReadOnly: !1,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), document.addEventListener("click", (e) => this.handleChoice(e), !1);
	}
	handleClick(e) {
		let t = DU(e.target);
		if (t !== null) {
			e.preventDefault(), this.menus.isOpen(t) ? this.menus.close(t) : this.openMenu(t);
			return;
		}
		let n = this.menus.current;
		n !== null && e.target instanceof Element && e.target.closest(`.${SU}`)?.closest(`.${xU}`) === n && this.menus.close(n);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "ArrowDown" && e.key !== "ArrowUp" || !M(e)) return;
		let t = DU(e.target);
		t === null || this.menus.isOpen(t) || (e.preventDefault(), this.openMenu(t, e.key === "ArrowUp"));
	}
	handleChoice(e) {
		let t = this.menus.current;
		if (t === null || !(e.target instanceof Element)) return;
		let n = OU(t), r = e.target.closest(`.${Hn}`);
		n !== null && r !== null && n.contains(r) && uL(r) && this.menus.close(t);
	}
	openMenu(e, t = !1) {
		let n = OU(e), r = n?.querySelector(".ui-menu") ?? null;
		if (n === null || r === null) return;
		let i = e.getAttribute("data-ui-split-placement") ?? "";
		this.menus.open({
			owner: e,
			popup: n,
			anchor: e,
			placement: { placement: fg(i) ? i : "bottom-end" },
			openers: kU(e)
		}) && lm(r, dL(r), t);
	}
};
function DU(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${CU}, .${SU}`), n = t?.closest(`.${xU}`) ?? null;
	return t === null || n === null || t.classList.contains(SU) && n.getAttribute("data-ui-split-mode") !== "menu" ? null : n;
}
function OU(e) {
	return e.querySelector(`:scope > .${wU}`);
}
function kU(e) {
	return [...e.querySelectorAll(":scope > [aria-haspopup]")];
}
//#endregion
//#region src/interactions/button-group-engine.ts
var AU = "ui-button-group", jU = "ui-button-group__item", MU = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${AU}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), V(this.root, `.${AU}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [hi]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-selected-key") ?? "", n = [], r = null;
		for (let i of this.ownItems(e)) {
			let e = t.length > 0 && i.getAttribute("data-ui-key") === t, a = NU(i);
			i.toggleAttribute(mi, e), a !== null && (a.setAttribute("aria-pressed", e ? "true" : "false"), n.push(a), e && (r = a));
		}
		N(n, r ?? n.find(P) ?? null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${jU}`), n = t?.closest(`.${AU}`) ?? null;
		if (t === null || n === null || t.closest(`.${AU}`) !== n || O(n)) return;
		let r = NU(t);
		r !== null && O(r) || this.choose(n, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${jU} > .${zi}`), n = t?.closest(`.${AU}`) ?? null;
		if (t === null || n === null || !M(e)) return;
		let r = this.ownItems(n).map(NU).filter((e) => e !== null), i = bd({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault(), i.focus({ preventScroll: !0 });
		let a = i.closest(`.${jU}`);
		a !== null && this.choose(n, a);
	}
	choose(e, t) {
		Wd(e, t.getAttribute("data-ui-key") ?? "", {
			attribute: hi,
			bindingAttribute: _i,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return Hd(e, `.${jU}`, `.${AU}`);
	}
};
function NU(e) {
	return e.querySelector(`:scope > .${zi}`);
}
//#endregion
//#region src/interactions/accordion-engine.ts
var PU = "ui-accordion", FU = "details", IU = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleSummaryClick(e), !0), this.root.addEventListener("toggle", (e) => this.handleToggle(e), !0), this.normalizeAll(this.root.querySelectorAll(`.${PU}`)), V(this.root, `.${PU}`, {
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
		if (t !== null && t.classList.contains(PU)) for (let n of this.sectionsOf(t)) n !== e && n.open && (n.open = !1);
	}
	sectionsOf(e) {
		return [...e.querySelectorAll(`:scope > ${FU}`)];
	}
}, LU = "ui-tab-overflow", RU = "ui-tab-overflow__menu", zU = "ui-tab-overflow__menu--open", BU = "ui-tab-overflow__entry", VU = "ui-tab-overflow__entry--current", HU = class {
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
		this.options = e, this.list = new KU(e.pick);
	}
	fit(e, t) {
		this.resizes?.observe(t.room), this.switches?.observe(e, { attributeFilter: ["class", "style"] });
		let n = this.options.wraps(e), r = t.captions[0]?.parentElement ?? null;
		if (this.wraps.set(e, n), this.spacings.set(e, {
			host: r,
			spacing: UU(r)
		}), n) {
			for (let e of t.captions) e.classList.remove(this.options.hiddenClass);
			e.classList.remove(this.options.overflowingClass), this.closeListOf(e);
			return;
		}
		e.classList.remove(this.options.overflowingClass);
		let i = () => e.classList.add(this.options.overflowingClass), a = this.options.trailing === !0 ? this.fitTrailing(t, i) : WU({
			...t,
			hiddenClass: this.options.hiddenClass,
			showButton: i
		});
		e.classList.toggle(this.options.overflowingClass, a), a || this.closeListOf(e);
	}
	spacingChanged(e) {
		let t = this.spacings.get(e);
		return t !== void 0 && UU(t.host) !== t.spacing;
	}
	fitTrailing(e, t) {
		for (let t of e.captions) this.resizes?.observe(t);
		return GU(e, this.options.hiddenClass, t);
	}
	closeListOf(e) {
		this.list.isOpenFor(e) && this.list.close();
	}
	toggleList(e, t, n) {
		this.list.isOpenFor(e) ? this.list.close() : this.list.open(t, e, n());
	}
};
function UU(e) {
	return e === null ? "" : getComputedStyle(e).columnGap ?? "";
}
function WU(e) {
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
function GU(e, t, n) {
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
var KU = class {
	menu;
	button = null;
	list = new Qv({
		show: ({ popup: e }) => e.classList.add(zU),
		hide: ({ popup: e }) => {
			e.classList.remove(zU), this.button = null;
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e) || this.button !== null && t.includes(this.button),
		onWindowBlur: !0,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	pick;
	constructor(e) {
		this.pick = e, this.menu = document.createElement("div"), this.menu.className = RU, this.menu.setAttribute("role", "menu"), this.menu.addEventListener("click", (e) => this.handleClick(e)), this.menu.addEventListener("keydown", (e) => this.handleKeydown(e)), this.menu.addEventListener("pointermove", (e) => this.handlePointerMove(e));
	}
	isOpenFor(e) {
		return this.list.isOpen(e);
	}
	open(e, t, n) {
		this.close(), this.menu.replaceChildren(...n.map(qU)), this.menu.parentElement === null && document.body.appendChild(this.menu);
		let r = this.menu.querySelector(`.${VU}`);
		this.button = e, Sg(e, this.menu);
		let i = {
			owner: t,
			popup: this.menu,
			anchor: e,
			placement: { placement: "bottom-end" },
			openers: [e],
			returnFocus: () => e
		};
		TF(this.list, i, this.entries(), r) || (this.button = null);
	}
	close() {
		this.list.close();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${BU}`), n = t?.getAttribute("data-ui-key") ?? null, r = this.list.current;
		t === null || n === null || r === null || O(t) || (this.close(), this.pick(r, n));
	}
	handleKeydown(e) {
		e.defaultPrevented || EF(e, this.entries());
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${BU}`) : null;
		t !== null && kF(t, this.entries());
	}
	entries() {
		return Array.from(this.menu.querySelectorAll(`.${BU}`));
	}
};
function qU(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${BU} ${Hi}`, t.classList.toggle(VU, e.current), t.setAttribute("role", "menuitem"), t.setAttribute(y, e.key), t.textContent = e.title, e.current && t.setAttribute("aria-current", "true"), e.disabled && (t.classList.add(Di), t.setAttribute("aria-disabled", "true")), t;
}
//#endregion
//#region src/interactions/tab-switch.ts
var JU = "data-ui-caption-text", YU = ".ui-text__title";
function XU(e) {
	for (let t of e.querySelectorAll(YU)) {
		let e = t.textContent ?? "";
		t.getAttribute(JU) !== e && t.setAttribute(JU, e);
	}
}
function ZU(e, t) {
	if (e === null || t === null || e === t || typeof t.animate != "function" || Xh()) return;
	let n = e.getBoundingClientRect(), r = t.getBoundingClientRect();
	n.width !== 0 && r.width !== 0 && t.animate([{ transform: `translateX(${n.left - r.left}px) scaleX(${n.width / r.width})` }, { transform: "none" }], {
		duration: z.normal,
		easing: z.ease,
		pseudoElement: "::after"
	});
}
function QU(e) {
	if (!(e === null || Xh())) for (let t of e.children) typeof t.animate == "function" && t.animate([{ opacity: 0 }, { opacity: 1 }], {
		duration: z.fast,
		easing: z.enter
	});
}
//#endregion
//#region src/interactions/tabs-engine.ts
var $U = "ui-tabs", eW = "ui-tab-caption", tW = "ui-tab-caption--selected", nW = "ui-tab-caption--overflowed", rW = "ui-tabs--overflowing", iW = "ui-tabs--no-overflow", aW = "ui-tabs__strip", oW = "ui-tabs__band", sW = class {
	root;
	fitter;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new HU({
			rootClass: $U,
			overflowingClass: rW,
			wraps: (e) => e.classList.contains(iW),
			hiddenClass: nW,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${$U}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), V(this.root, `.${$U}`, {
			childList: !0,
			attributeFilter: [vi, ...wi],
			relevant: (e) => !x_(e, `[${xi}]`, `.${$U}`)
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-tabs-selected") ?? "", n = this.ownHeaders(e), r = n.filter(cW), i = Gd(r, t, (e) => e.getAttribute("data-ui-tab-key") ?? "");
		if (i !== null && i !== t) {
			this.select(e, i);
			return;
		}
		let a = n.find((e) => e.classList.contains(tW)) ?? null, o = null;
		for (let n of Hd(e, `[${Si}]`, `.${$U}`)) n.hidden = (n.getAttribute("data-ui-tab-actions") ?? "") !== t;
		for (let e of n) {
			let n = (e.getAttribute("data-ui-tab-key") ?? "") === t;
			e.classList.toggle(tW, n), e.setAttribute("aria-selected", n ? "true" : "false"), XU(e), n && (o = e);
		}
		this.fitHeaders(e, r, o), ZU(a, o), N(n.filter((e) => !e.classList.contains(nW)), o);
		for (let n of this.ownPages(e)) n.hidden = (n.getAttribute("data-ui-tab-page") ?? "") !== t, !n.hidden && a !== null && a !== o && QU(n);
	}
	fitHeaders(e, t, n) {
		let r = e.querySelector(`:scope > .${aW}, :scope > .${oW} > .${aW}`), i = r?.querySelector(":scope > .ui-tab-overflow") ?? null;
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
			return this.ownHeaders(e).filter(cW).map((e) => {
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
		let t = e.target.closest(`.${LU}`), n = t?.closest(`.${$U}`) ?? null;
		if (t !== null && n !== null && t.closest(`.${$U}`) === n) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = e.target.closest(`.${eW}`);
		if (r === null || O(r)) return;
		let i = r.closest(`.${$U}`), a = r.getAttribute(bi);
		i !== null && a !== null && r.closest(`.${$U}`) === i && (e.preventDefault(), this.select(i, a));
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || sd(e) || !M(e)) return;
		let t = e.target.closest(`.${eW}`), n = t?.closest(`.${$U}`) ?? null;
		if (t === null || n === null) return;
		let r = bd({
			key: e.key,
			items: this.ownHeaders(n),
			current: t,
			axis: "horizontal"
		});
		r !== null && (e.preventDefault(), this.select(n, r.getAttribute("data-ui-tab-key") ?? ""), r.focus());
	}
	select(e, t) {
		Wd(e, t, {
			attribute: vi,
			bindingAttribute: _i,
			apply: (e) => this.apply(e)
		});
	}
	ownHeaders(e) {
		return Hd(e, `.${eW}`, `.${$U}`);
	}
	ownPages(e) {
		return Hd(e, `[${xi}]`, `.${$U}`);
	}
};
function cW(e) {
	return e.classList.contains(nW) || E_(e);
}
//#endregion
//#region src/interactions/tab-out.ts
function lW(e) {
	e.hasAttribute("data-ui-tab-out") || (e.setAttribute(Ie, e.getAttribute("tabindex") ?? ""), e.setAttribute("tabindex", "-1"));
}
function uW(e) {
	let t = e.getAttribute(Ie);
	t !== null && (e.removeAttribute(Ie), t.length === 0 ? e.removeAttribute("tabindex") : e.setAttribute("tabindex", t));
}
function dW(e) {
	return e.tabIndex >= 0 || e.hasAttribute("data-ui-tab-out");
}
//#endregion
//#region src/interactions/command-bar-engine.ts
var fW = "ui-command-bar", pW = "ui-command-bar__host", mW = "ui-command-bar__item", hW = "ui-command-bar__overflow", gW = "ui-command-bar--overflowing", _W = "ui-command-bar__overflowed", vW = "ui-orientation--vertical", yW = "ui-text__title", bW = `${Cp}, [${Ie}]`, xW = class {
	root;
	fitter;
	listed = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new HU({
			rootClass: fW,
			overflowingClass: gW,
			wraps: (e) => !EW(e),
			hiddenClass: _W,
			trailing: !0,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pick(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${fW}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), V(this.root, `.${fW}`, {
			childList: !0,
			addedOnly: !0,
			relevant: SW
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = CW(e), n = e.querySelector(`:scope > .${hW}`);
		if (t === null || n === null) return;
		let r = DW(t);
		this.fitter.fit(e, {
			room: e,
			button: n,
			captions: r,
			selected: null
		}), e.classList.contains(gW) && OW(r);
		for (let e of r) bg(e, e.classList.contains(_W) ? n : null);
		e.classList.contains(vW) ? e.setAttribute("aria-orientation", "vertical") : e.removeAttribute("aria-orientation"), wW(e, null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${hW}`), n = t?.parentElement ?? null;
		t !== null && n !== null && n.classList.contains(fW) && (e.preventDefault(), this.fitter.toggleList(n, t, () => this.entriesOf(n)));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof HTMLElement) || !M(e) || sd(e)) return;
		let t = e.target.closest(`.${fW}`), n = t === null ? [] : TW(t);
		if (t === null || !n.includes(e.target)) return;
		let r = bd({
			key: e.key,
			items: n,
			current: e.target,
			axis: t.classList.contains(vW) ? "vertical" : "horizontal"
		});
		r !== null && (e.preventDefault(), wW(t, r), r.focus());
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement ? e.target : null, n = t?.closest(`.${fW}`) ?? null;
		t !== null && n !== null && TW(n).includes(t) && wW(n, t);
	}
	entriesOf(e) {
		let t = CW(e), n = t === null ? [] : DW(t).filter((e) => e.classList.contains(mW) && e.classList.contains(_W)).map((e) => e.querySelector("[data-ui-id]") ?? e);
		return this.listed.set(e, n), n.map((e, t) => ({
			key: String(t),
			title: kW(e),
			current: !1,
			disabled: O(e)
		}));
	}
	pick(e, t) {
		let n = this.listed.get(e)?.[Number(t)];
		n?.isConnected === !0 && !O(n) && AW(n).click();
	}
};
function SW(e) {
	let t = e.target;
	if (t instanceof Element && (t.classList.contains(fW) || t.classList.contains(pW) || t.classList.contains(mW))) return !0;
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains(fW) || t.querySelector(`.${fW}`) !== null)) return !0;
	return !1;
}
function CW(e) {
	return e.querySelector(`:scope > .${pW}`);
}
function wW(e, t) {
	let n = TW(e), r = n.find((e) => e.tabIndex >= 0 && P(e)), i = t ?? n.find((e) => e === document.activeElement) ?? r ?? n.find(P) ?? null;
	for (let e of n) e === i ? uW(e) : lW(e);
}
function TW(e) {
	let t = CW(e), n = [];
	for (let e of t === null ? [] : DW(t)) if (e.classList.contains(mW) && !e.classList.contains(_W)) for (let t of e.querySelectorAll(bW)) dW(t) && vd(e, t) && n.push(t);
	let r = e.querySelector(`:scope > .${hW}`);
	return r !== null && e.classList.contains(gW) && n.push(r), n;
}
function EW(e) {
	let t = CW(e);
	if (t === null) return !1;
	let n = getComputedStyle(t);
	return n.flexDirection.startsWith("row") && n.flexWrap === "nowrap";
}
function DW(e) {
	let t = [];
	for (let n of Array.from(e.children)) {
		if (n.classList.contains("ui-hidden")) continue;
		if (n.hasAttribute("data-ui-group-header")) {
			t.push(n);
			continue;
		}
		let e = n.classList.contains(mW) ? n.querySelector(x) : null;
		e !== null && E_(e) && t.push(n);
	}
	return t;
}
function OW(e) {
	let t = !1;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.classList.contains(mW) ? t ||= !r.classList.contains(_W) : t || r.classList.add(_W);
	}
}
function kW(e) {
	let t = AW(e), n = t.querySelector(`.${yW}`)?.textContent?.trim() ?? "";
	return n.length > 0 ? n : e.getAttribute("aria-label")?.trim() || t.getAttribute("aria-label")?.trim() || t.textContent?.trim() || "";
}
function AW(e) {
	return e.matches(Cp) ? e : e.querySelector(Cp) ?? e;
}
//#endregion
//#region src/interactions/breadcrumbs-engine.ts
var jW = "ui-breadcrumbs", MW = "ui-breadcrumbs__item", NW = "ui-breadcrumb", PW = "ui-breadcrumb--current", FW = "ui-hidden", IW = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), V(this.root, `.${jW}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: ["class", ...wi]
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${jW}`)) this.apply(e);
	}
	apply(e) {
		let t = Hd(e, `.${MW}`, `.${jW}`);
		LW(t);
		let n = t.filter((e) => !e.classList.contains(FW)).map((e) => e.querySelector(`.${NW}`)).filter((e) => e !== null && !e.classList.contains(FW)), r = n.length === 0 ? null : n[n.length - 1];
		for (let e of n) {
			let t = e === r;
			e.classList.toggle(PW, t), t ? (e.setAttribute("aria-current", "page"), e.setAttribute("tabindex", "-1")) : (e.removeAttribute("aria-current"), e.removeAttribute("tabindex"));
		}
	}
};
function LW(e) {
	let t = B.map(() => !1);
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n], i = B.map((e, t) => RW(r, t));
		if (zW(r, zr, B.filter((e, t) => i[t])), zW(r, Br, B.filter((e, n) => !t[n])), !r.classList.contains(FW)) for (let e = 0; e < B.length; e++) t[e] ||= !i[e];
	}
}
function RW(e, t) {
	for (let n of e.children) if (n.getAttribute(wi[t]) === "collapsed") return !0;
	return !1;
}
function zW(e, t, n) {
	let r = n.join(" ");
	C(e, t, r.length === 0 ? null : r);
}
//#endregion
//#region src/interactions/color-input-engine.ts
var BW = "ui-color-input", VW = "ui-color-input--open", HW = "ui-color-input__popup", UW = "ui-color-input__text", WW = "ui-color-input__row", GW = "ui-color-input__swatch--button", KW = "ui-color-input__value-input", qW = "ui-color-input__square-thumb", JW = "ui-color-input__hue-thumb", YW = "data-ui-color-toggle", XW = "data-ui-color-tab", ZW = "data-ui-color-tab-selected", QW = "data-ui-color-pane", $W = "data-ui-color-pane-selected", eG = "data-ui-color-square", tG = "data-ui-color-hue", nG = "data-ui-color-hex", rG = "data-ui-color-channel", iG = "data-ui-color-factor", aG = "data-ui-color-opacity", oG = "data-ui-color-name", sG = "data-ui-color-name-selected", cG = "data-ui-color-format", lG = "data-ui-color-variant", uG = "data-ui-color-no-picker", dG = "data-ui-color-no-palette", fG = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	popups = new Qv({
		show: ({ owner: e }) => e.classList.add(VW),
		hide: ({ owner: e }) => e.classList.remove(VW)
	});
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${BW}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(Ya(e.components, `.${BW}`));
		}), V(this.root, `.${BW}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [
				cG,
				lG,
				uG,
				dG
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), new fv({
			root: this.root,
			resolveHandle: (e) => e.closest(`[${eG}], [${tG}]`),
			begin: (e, t) => {
				let n = e.closest(`.${BW}`);
				if (n === null) return null;
				let r = {
					input: n,
					element: e,
					surface: e.hasAttribute(eG) ? "square" : "hue",
					stateBefore: this.states.get(n),
					valueBefore: n.querySelector(`.${KW}`)?.value ?? null
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
		let t = _G(e), n = this.states.get(e), r = n?.paneChosen === !0 ? pG(e, n.pane) : mG(e);
		if (t.length === 0 || t.startsWith("@")) return {
			...n ?? hG(r),
			pane: r,
			held: !1
		};
		if (t.startsWith("#")) {
			let i = TG(t);
			if (i === null) return n ?? hG(r);
			let [a, o, s, c] = i;
			if (n !== void 0 && n.name === null && gG(this.resolveRgb(e, n), [
				a,
				o,
				s
			])) return {
				...n,
				pane: r,
				opacity: c,
				held: !0
			};
			let [l, u, d] = OG(a, o, s);
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
			...n ?? hG(r),
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
			let [e, a, o] = OG(n, r, i);
			t = {
				...t,
				hue: e,
				saturation: a,
				value: o
			};
		}
		let a = this.states.get(e);
		this.states.set(e, t), xG(e, "--ui-color-input-color", t.held ? DG(n, r, i, t.opacity) : "transparent"), xG(e, "--ui-color-input-solid", DG(n, r, i, 255)), xG(e, "--ui-color-input-on-color", t.held ? kw(n, r, i, t.opacity) : "inherit"), bG(e, t.held ? yG(e, n, r, i, t.opacity) : ""), this.applyPicker(e, t, n, r, i), (a === void 0 || a.name !== t.name || a.pane !== t.pane || a.held !== t.held) && (this.applyPalette(e, t), this.applyPanes(e, t));
	}
	applyPicker(e, t, n, r, i) {
		let a = e.querySelector(`[${eG}]`), o = e.querySelector(`[${tG}]`), [s, c, l] = kG(t.hue, 1, 1);
		if (xG(e, "--ui-color-input-hue", DG(s, c, l, 255)), a !== null) {
			let e = a.querySelector(`.${qW}`);
			e !== null && (xG(e, "left", `${t.saturation * 100}%`), xG(e, "top", `${(1 - t.value) * 100}%`));
		}
		if (o !== null) {
			let e = o.querySelector(`.${JW}`);
			e !== null && xG(e, "top", `${t.hue / 360 * 100}%`);
		}
		SG(e, `[${nG}]`, EG(n, r, i)), SG(e, `[${rG}="r"]`, String(n)), SG(e, `[${rG}="g"]`, String(r)), SG(e, `[${rG}="b"]`, String(i)), xG(e, "--ui-color-input-opacity-fill", `${t.opacity / 255 * 100}%`), CG(e, `[${aG}]`, t.opacity);
	}
	applyPalette(e, t) {
		for (let n of e.querySelectorAll(`[${oG}]`)) n.getAttribute(oG) === t.name ? n.setAttribute(sG, "") : n.removeAttribute(sG);
		let n = t.name === null ? null : e.querySelector(`[${oG}="${S(t.name)}"]`), r = n === null ? null : TG(n.style.getPropertyValue("--ui-color-input-chip").trim());
		xG(e, "--ui-color-input-base", r === null ? "transparent" : DG(r[0], r[1], r[2], 255)), CG(e, `[${iG}]`, t.factor);
	}
	applyPanes(e, t) {
		for (let n of e.querySelectorAll(`[${QW}]`)) n.getAttribute(QW) === t.pane ? n.setAttribute($W, "") : n.removeAttribute($W);
		for (let n of e.querySelectorAll(`[${XW}]`)) n.getAttribute(XW) === t.pane ? n.setAttribute(ZW, "") : n.removeAttribute(ZW);
	}
	resolveRgb(e, t) {
		if (t.name === null) return kG(t.hue, t.saturation, t.value);
		let n = e.querySelector(`[${oG}="${S(t.name)}"]`), r = n === null ? null : TG(n.style.getPropertyValue("--ui-color-input-chip").trim());
		return r === null ? kG(t.hue, t.saturation, t.value) : wG([
			r[0],
			r[1],
			r[2]
		], t.factor);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${YW}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${BW}`));
			return;
		}
		let n = e.target.closest(`[${XW}]`), r = e.target.closest(`.${BW}`);
		if (r === null) return;
		if (n !== null) {
			e.preventDefault();
			let t = n.getAttribute(XW), i = this.states.get(r);
			i !== void 0 && (t === "picker" || t === "palette") && this.applyState(r, {
				...i,
				pane: t,
				paneChosen: !0
			});
			return;
		}
		let i = e.target.closest(`[${oG}]`);
		if (i !== null) {
			e.preventDefault(), this.commit(r, (e) => ({
				...e,
				name: i.getAttribute(oG)
			}));
			return;
		}
		let a = r.querySelector(`.${HW}`);
		(a === null || !e.composedPath().includes(a)) && (e.preventDefault(), this.toggle(r));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target.closest(`.${BW}`);
		t !== null && (e.target.hasAttribute(iG) ? this.commit(t, (t) => ({
			...t,
			factor: Number(e.target instanceof HTMLInputElement ? e.target.value : 0)
		}), !1) : e.target.hasAttribute(aG) && this.commit(t, (t) => ({
			...t,
			opacity: Dw(Number(e.target instanceof HTMLInputElement ? e.target.value : 255))
		}), !1));
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target, n = t.closest(`.${BW}`);
		if (n === null) return;
		if (t.hasAttribute(iG) || t.hasAttribute(aG)) {
			this.send(n);
			return;
		}
		if (t.hasAttribute(nG)) {
			let e = TG(t.value);
			if (e === null) {
				this.applyAll([n]);
				return;
			}
			let [r, i, a] = OG(e[0], e[1], e[2]);
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
		let r = t.getAttribute(rG);
		if (r === null) return;
		let i = this.states.get(n);
		if (i === void 0) return;
		let [a, o, s] = this.resolveRgb(n, i), c = {
			r: a,
			g: o,
			b: s
		};
		c[r] = Dw(Number(t.value));
		let [l, u, d] = OG(c.r, c.g, c.b);
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
		let t = e.input.querySelector(`.${KW}`);
		t !== null && e.valueBefore !== null && (t.value = e.valueBefore);
	}
	applyPoint(e, t) {
		let { input: n, element: r, surface: i } = e, a = r.getBoundingClientRect();
		if (i === "hue") {
			let e = AG((t.y - a.top) / a.height);
			this.commit(n, (t) => ({
				...t,
				hue: e * 360,
				name: null
			}), !1);
			return;
		}
		let o = AG((t.x - a.left) / a.width), s = 1 - AG((t.y - a.top) / a.height);
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
		let a = e.querySelector(`.${KW}`);
		a !== null && (a.value = vG(i, this.resolveRgb(e, i)), n && this.send(e));
	}
	send(e) {
		A(e) || e.querySelector(`.${KW}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	toggle(e) {
		if (e === null || e.hasAttribute(uG) && e.hasAttribute(dG)) return;
		if (this.popups.isOpen(e)) {
			this.popups.close(e);
			return;
		}
		let t = e.querySelector(`.${HW}`);
		if (t === null) return;
		let n = e.getAttribute(lG) === "swatch", r = n ? e.querySelector(`.${GW}`) : e.querySelector(`.${WW}`), i = n ? r : r?.querySelector(`[${YW}]`) ?? null;
		this.popups.open({
			owner: e,
			popup: t,
			anchor: r ?? e,
			placement: { placement: "bottom-end" },
			openers: i === null ? [] : [i],
			focus: t.querySelector(`[${ZW}]`) ?? !0
		});
	}
};
function pG(e, t) {
	return ((t) => !e.hasAttribute(t === "picker" ? uG : dG))(t) ? t : t === "picker" ? "palette" : "picker";
}
function mG(e) {
	return pG(e, "picker");
}
function hG(e) {
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
function gG(e, t) {
	return e[0] === t[0] && e[1] === t[1] && e[2] === t[2];
}
function _G(e) {
	return e.querySelector(`.${KW}`)?.value.trim() ?? "";
}
function vG(e, t) {
	if (e.name !== null) {
		let t = e.factor === 0 ? "None" : e.factor < 0 ? "Shade" : "Tint";
		return `${e.name}/${t}/${Math.abs(e.factor)}/${e.opacity}`;
	}
	let n = EG(t[0], t[1], t[2]);
	return e.opacity === 255 ? n : `${n}${Ow(e.opacity)}`;
}
function yG(e, t, n, r, i) {
	if (e.getAttribute(cG) === "rgb") return i === 255 ? `rgb(${t}, ${n}, ${r})` : `rgba(${t}, ${n}, ${r}, ${(i / 255).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")})`;
	let a = EG(t, n, r);
	return i === 255 ? a : `${a}${Ow(i)}`;
}
function bG(e, t) {
	for (let n of e.querySelectorAll(`.${UW}`)) n.textContent !== t && (n.textContent = t);
}
function xG(e, t, n) {
	e !== null && e.style.getPropertyValue(t) !== n && e.style.setProperty(t, n);
}
function SG(e, t, n) {
	let r = e.querySelector(t);
	r !== null && r !== document.activeElement && r.value !== n && (r.value = n);
}
function CG(e, t, n) {
	for (let r of e.querySelectorAll(t)) r !== document.activeElement && r.value !== String(n) && (r.value = String(n));
}
function wG(e, t) {
	if (t === 0) return e;
	let n = Math.abs(t) / 10;
	return t < 0 ? [
		Dw(e[0] * (1 - n)),
		Dw(e[1] * (1 - n)),
		Dw(e[2] * (1 - n))
	] : [
		Dw(e[0] + (255 - e[0]) * n),
		Dw(e[1] + (255 - e[1]) * n),
		Dw(e[2] + (255 - e[2]) * n)
	];
}
function TG(e) {
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
function EG(e, t, n) {
	return `#${Ow(e)}${Ow(t)}${Ow(n)}`;
}
function DG(e, t, n, r) {
	return `rgba(${e}, ${t}, ${n}, ${(r / 255).toFixed(3)})`;
}
function OG(e, t, n) {
	let r = e / 255, i = t / 255, a = n / 255, o = Math.max(r, i, a), s = o - Math.min(r, i, a), c = 0;
	return s !== 0 && (c = o === r ? (i - a) / s % 6 : o === i ? (a - r) / s + 2 : (r - i) / s + 4, c *= 60, c < 0 && (c += 360)), [
		c,
		o === 0 ? 0 : s / o,
		o
	];
}
function kG(e, t, n) {
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
		Dw((o + a) * 255),
		Dw((s + a) * 255),
		Dw((c + a) * 255)
	];
}
function AG(e) {
	return Math.min(1, Math.max(0, e));
}
//#endregion
//#region src/interactions/surface-press-engine.ts
var jG = `:is(.ui-surface, .ui-card, .${Dt})[${ie}]`, MG = "ui-surface--clickable", NG = class {
	pressable = /* @__PURE__ */ new WeakSet();
	space = new Pu();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("keydown", (e) => this.handleKeyDown(e)), t.addEventListener("keyup", (e) => this.space.release(e)), zG(t, ["hover", "press"], (e) => RG(e.closest(pd))), V(t, jG, {
			childList: !0,
			attributeFilter: ["class"]
		}, (e) => this.syncEach(e)), this.syncEach(t.querySelectorAll(jG));
	}
	syncEach(e) {
		for (let t of e) {
			this.sync(t);
			let e = t.parentElement?.closest(jG) ?? null;
			e !== null && this.sync(e);
		}
	}
	sync(e) {
		!e.classList.contains(MG) || FG(e) ? this.pressable.delete(e) && (e.removeAttribute("tabindex"), e.removeAttribute("role")) : (this.pressable.add(e), C(e, "role", LG(e) ? "group" : "button"), C(e, "tabindex", e.matches(".ui-disabled, .ui-loading") ? null : IG(e) ? "-1" : "0"));
	}
	handleKeyDown(e) {
		let t = PG(e);
		if (t === null) return;
		let n = e.key;
		n === "Enter" ? (e.preventDefault(), e.repeat || t.click()) : n === " " && (e.preventDefault(), this.space.hold(t));
	}
};
function PG(e) {
	if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !M(e, { shift: !0 })) return null;
	let t = e.target;
	return t instanceof HTMLElement && t.classList.contains(MG) && t.hasAttribute("tabindex") && !FG(t) ? t : null;
}
function FG(e) {
	return e.matches("a");
}
function IG(e) {
	let t = e.closest(qd);
	return t !== null && t.closest(F)?.matches(".ui-items-view, .ui-table") === !0 && hd(t) === e;
}
function LG(e) {
	for (let t of e.querySelectorAll(pd)) if (vd(e, t)) return !0;
	return !1;
}
function RG(e) {
	let t = [];
	for (let n = e?.parentElement?.closest(`.${MG}`) ?? null; n !== null; n = n.parentElement?.closest(`.${MG}`) ?? null) t.push(n);
	return t;
}
function zG(e, t, n) {
	let r = {
		hover: [],
		press: []
	}, i = !1, a = (e, t) => {
		let a = t instanceof Element ? n(t) : [];
		e === "press" && (i = !1);
		for (let t of r[e]) a.includes(t) || BG(t, e, !1);
		for (let t of a) BG(t, e, !0);
		r[e] = a;
	};
	t.includes("hover") && (e.addEventListener("pointerover", (e) => a("hover", e.target)), e.addEventListener("pointerout", (e) => a("hover", e.relatedTarget))), t.includes("press") && (e.addEventListener("pointerdown", (e) => a("press", e.button === 0 ? e.target : null), !0), e.addEventListener("pointerup", () => a("press", null), !0), e.addEventListener("dragend", () => a("press", null), !0), e.addEventListener("dragstart", () => {
		i = r.press.length > 0;
	}, !0), e.addEventListener("pointercancel", () => {
		i || a("press", null);
	}, !0));
}
function BG(e, t, n) {
	let r = (e.getAttribute("data-ui-inner-pointer") ?? "").split(" ").filter((e) => e !== "" && e !== t);
	n && r.push(t), C(e, fi, r.length === 0 ? null : r.sort().join(" "));
}
//#endregion
//#region src/interactions/table-columns-engine.ts
var VG = "ui-table", HG = "ui-table--reorderable", UG = "ui-scroll-x--auto", WG = "ui-scroll-x--always", GG = `:scope > .${fr}`, KG = `.${mr}`, qG = "ui-table__header-cell", JG = `${qG}--pinned`, YG = `${GG} > .${pr} > .${qG}`, XG = `${YG}--pinned`, ZG = "ui-table__host", QG = `${GG} > .${ZG}`, $G = `.${VG}, .${dr}, [${sr}]`, eK = "--ui-table-columns", tK = "--ui-table-sticky-top", nK = "--ui-table-sticky-bottom", rK = "--ui-table-sized-columns", iK = "--ui-table-pin-", aK = 64, oK = "data-ui-table-cell-hidden", sK = "data-ui-table-cell-last", cK = "columns", lK = "hidden", uK = "order", dK = "layout", fK = 32, pK = 16, mK = class {
	root;
	store = new jI();
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
		this.root = e.root ?? document, this.drag = new fv({
			root: this.root,
			resolveHandle: (e) => e.closest(KG),
			begin: (e) => this.resolveContext(e),
			coordinate: () => "clientX",
			move: (e, t) => this.apply(e, t),
			end: (e, t) => this.remember(t.table),
			cancel: (e, t) => this.putBack(t)
		}), this.reorder = new fv({
			root: this.root,
			resolveHandle: (e) => this.resolveCaption(e),
			begin: (e, t) => this.beginReorder(e, t.x),
			coordinate: () => "clientX",
			move: (e, t) => this.aimDrop(e, t),
			end: (e, t) => this.endReorder(e, t)
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), zG(this.root, ["hover", "press"], (e) => {
			let t = e.closest(KG)?.parentElement ?? null;
			return t === null ? [] : [t];
		}), ig(() => this.layoutAll()), this.restoreEach(this.root.querySelectorAll(`.${VG}`)), V(this.root, `.${VG}`, {
			childList: !0,
			relevant: yK
		}, (e) => {
			for (let t of e) this.restored.has(t) && (this.stampUnstyledColumns(t, !0), this.indexColumns(t, !0));
			this.restoreEach(e);
		}), V(this.root, `.${VG}`, {
			attributeFilter: ["class"],
			relevant: (e) => e.target instanceof Element && e.target.classList.contains(VG)
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.layout(t);
		}), V(this.root, `.${VG}`, {
			childList: !0,
			attributeFilter: ["class", "hidden"],
			relevant: bK
		}, (e) => {
			for (let t of e) {
				let e = t.querySelector(QG);
				e !== null && t.hasAttribute("data-ui-table-scrollbar") && this.markScrollbar(t, e);
			}
		});
	}
	restoreEach(e) {
		for (let t of e) {
			if (this.restored.has(t)) continue;
			this.restored.add(t), this.restore(t), this.layout(t), aH(t, () => this.pin(t));
			let e = t.querySelector(GG);
			e !== null && aH(e, () => hK(t, e));
			let n = t.querySelector(QG);
			n !== null && (this.markScrollbar(t, n), aH(n, () => this.markScrollbar(t, n)));
		}
	}
	restore(e) {
		let t = this.columnsOf(e), n = this.store.read(e, cK), r = n === null ? null : Nl(n);
		r !== null && r.length !== t.length ? (this.store.write(e, cK, null), this.store.writeBoot(e, dK, null), this.widths.set(e, null)) : this.widths.set(e, r);
		let i = this.store.readJson(e, uK);
		i !== null && !SK(i, t) ? (this.store.write(e, uK, null), this.orders.set(e, null)) : this.orders.set(e, i);
	}
	markScrollbar(e, t) {
		let n = getComputedStyle(t).overflowY;
		e.toggleAttribute(Tr, n === "scroll" || n === "auto" && t.scrollHeight > t.clientHeight);
	}
	layoutAll() {
		for (let e of this.root.querySelectorAll(`.${VG}`)) this.layout(e);
	}
	layout(e) {
		let t = this.columnsOf(e), n = this.hiddenOf(e, t), r = this.placesOf(e, t), i = xK(r), a = this.widths.get(e) ?? null, o = r.some((e, t) => e !== t), s = e.classList.contains(UG) || e.classList.contains(WG);
		if (a === null && n.size === 0 && !o && !s) e.style.removeProperty(rK);
		else {
			let t = a ?? this.authoredTracks(e);
			if (t !== null) {
				let r = cu(t, n);
				e.style.setProperty(rK, Ll(i.map((e) => r[e]), s ? "max-content" : "auto"));
			}
		}
		for (let t = 0; t < r.length; t++) o ? e.style.setProperty(`${yf}${t}`, String(r[t])) : e.style.removeProperty(`${yf}${t}`);
		let c = [...n].sort((e, t) => e - t).join(" ");
		C(e, ur, c.length === 0 ? null : c);
		let l = [...i].reverse().find((e) => !n.has(e));
		if (l === void 0 ? e.removeAttribute(br) : e.getAttribute("data-ui-table-last") !== String(l) && e.setAttribute(br, String(l)), this.columnStates.set(e, {
			places: r,
			hidden: n,
			last: l ?? -1
		}), this.stampUnstyledColumns(e, !1), this.indexColumns(e, !1), e.classList.contains(HG)) for (let e of t) !e.anchored && !e.cell.hasAttribute("tabindex") && e.cell.setAttribute("tabindex", "-1");
		this.pin(e);
	}
	stampUnstyledColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0 || n.places.length <= aK) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}|${n.last}`;
		if (t || this.stampedStates.get(e) !== r) {
			this.stampedStates.set(e, r);
			for (let t of e.querySelectorAll(`[${sr}]`)) {
				let r = Number(t.getAttribute(sr));
				r >= aK && t.closest(`.${VG}`) === e && (t.style.order = String(n.places[r] ?? r), t.toggleAttribute(oK, n.hidden.has(r)), t.toggleAttribute(sK, r === n.last));
			}
		}
	}
	indexColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}`, i = this.indexedStates.get(e) === r;
		(!i || t) && (this.indexedStates.set(e, r), wf(e, xK(n.places), n.hidden, i));
	}
	columnsOf(e) {
		let t = [];
		for (let n of e.querySelectorAll(YG)) {
			let e = Number(n.getAttribute(sr)), r = n.getAttribute(cr), i = n.classList.contains(JG) || n.hasAttribute("data-ui-table-fixed");
			Number.isInteger(e) && t.push({
				index: e,
				key: n.getAttribute("data-ui-table-column-key") ?? String(e),
				hideBelow: EK(r) ? r : null,
				startsHidden: n.hasAttribute(lr),
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
		for (let e of t) (n[e.key] ?? TK(e)) && r.add(e.index);
		return r;
	}
	choicesOf(e) {
		let t = this.hiddenChoices.get(e);
		return t === void 0 && (t = this.store.readJson(e, lK) ?? {}, this.hiddenChoices.set(e, t)), t;
	}
	authoredTracks(e) {
		let t = e.style.getPropertyValue(eK).trim(), n = t.length === 0 ? null : Nl(t);
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
		n === null || i !== void 0 && n === TK(i) ? delete r[t] : r[t] = n, this.hiddenChoices.set(e, r), this.store.writeJson(e, lK, Object.keys(r).length === 0 ? null : r), this.layout(e), this.rememberBoot(e);
	}
	columnOrder(e) {
		if (!(e instanceof HTMLElement)) return [];
		let t = this.columnsOf(e), n = new Map(t.map((e) => [e.index, e]));
		return xK(this.placesOf(e, t)).map((e) => n.get(e)?.key ?? "").filter((e) => e.length > 0);
	}
	pin(e) {
		let t = e.querySelectorAll(XG).length;
		if (t < 2) return;
		let n = iu(this.trackSizes(e), t);
		for (let t = 1; t < n.length; t++) e.style.setProperty(`${iK}${t}`, `${n[t]}px`);
	}
	handleScroll(e) {
		let t = e.target;
		t instanceof HTMLElement && t.classList.contains("ui-table__scroll") && t.closest(`.${VG}`)?.toggleAttribute(wr, t.scrollLeft > 0);
	}
	trackSizes(e) {
		let t = e.querySelector(GG), n = t === null ? [] : getComputedStyle(t).gridTemplateColumns.split(" ").map(parseFloat);
		return _K(e) ? n.slice(1) : n;
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
		let t = e.target.closest(KG), n = t ?? (e.shiftKey ? gK(e.target) : null);
		if (n === null || this.drag.active || !M(e, { shift: t === null })) return;
		if (t !== null && e.key === "Enter" || t === null && e.key === "Backspace") {
			e.preventDefault(), this.reset(n);
			return;
		}
		let r = e.key === "PageUp" || e.key === "PageDown";
		if (!r && e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
		let i = this.resolveContext(n);
		if (i === null) return;
		let a = r ? Ml(pK, i.sizes.reduce((e, t) => e + t, 0)) : pK;
		e.preventDefault(), this.apply(i, e.key === "ArrowRight" || e.key === "PageUp" ? a : -a) && this.remember(i.table);
	}
	stepColumn(e, t) {
		let n = e.target instanceof Element ? this.resolveCaption(e.target) : null, r = n?.closest(`.${VG}`) ?? null;
		if (n === null || r === null || this.reorder.active) return;
		let i = this.movableColumns(r), a = Number(n.getAttribute(sr)), o = i.findIndex((e) => e.index === a), s = o + t;
		if (o < 0 || (e.preventDefault(), s < 0 || s >= i.length)) return;
		this.moveColumn(r, a, t < 0 ? i[s].index : i[s + 1]?.index ?? null), n.focus({ preventScroll: !0 });
		let c = this.columnStates.get(r);
		if (c !== void 0) {
			let e = xK(c.places).filter((e) => !c.hidden.has(e));
			Mj(e.indexOf(a) + 1, e.length);
		}
	}
	handleDoubleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(KG) : null;
		t !== null && this.reset(t);
	}
	reset(e) {
		let t = e.closest(`.${VG}`);
		t !== null && (this.widths.set(t, null), this.layout(t), this.remember(t));
	}
	apply(e, t) {
		let n = Gl(e.tracks.map((t, n) => n === e.index || n === e.after ? {
			...t,
			min: Math.max(fK, e.floors.get(n) ?? 0)
		} : t), e.sizes, {
			before: [e.index],
			after: [e.after]
		}, t);
		return n !== null && (this.widths.set(e.table, vK(e.tracks, n, [e.index, e.after])), this.layout(e.table), !0);
	}
	putBack(e) {
		this.widths.set(e.table, e.before), this.layout(e.table);
	}
	remember(e) {
		let t = this.widths.get(e) ?? null;
		this.store.write(e, cK, t === null ? null : Ll(t), null), this.rememberBoot(e);
	}
	rememberBoot(e) {
		let t = e.style.getPropertyValue(rK).trim(), n = e.getAttribute(ur), r = {};
		t.length > 0 && (r[rK] = t);
		for (let t of e.style) t.startsWith("--ui-table-order-") && (r[t] = e.style.getPropertyValue(t));
		Object.keys(r).length === 0 && n === null ? this.store.writeBoot(e, dK, null) : this.store.writeBoot(e, dK, {
			styles: r,
			attributes: {
				[ur]: n,
				[br]: e.getAttribute(br)
			}
		});
	}
	resolveContext(e) {
		let t = e.closest(`.${VG}`);
		if (t === null) return null;
		let n = this.widths.get(t) ?? null, r = n ?? this.authoredTracks(t);
		if (r === null) return null;
		let i = Bl(t.getAttribute($n)), a = Vl(r, i), o = /* @__PURE__ */ new Map(), s = this.columnsOf(t), c = this.placesOf(t, s), l = this.columnSizes(t, c).filter((e) => Number.isFinite(e));
		for (let e of i) e.min !== void 0 && o.set(e.index, e.min);
		let u = Number(e.getAttribute(sr)), d = this.hiddenOf(t, s), f = xK(c), p = (c[u] ?? -1) + 1;
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
		let t = e.closest(`.${qG}`), n = t?.closest(`.${VG}`) ?? null;
		return t === null || n === null || !n.classList.contains(HG) || e.closest(KG) !== null || t.classList.contains(JG) || t.hasAttribute("data-ui-table-fixed") ? null : t;
	}
	beginReorder(e, t) {
		let n = e.closest(`.${VG}`), r = Number(e.getAttribute(sr));
		if (n === null || !Number.isInteger(r)) return null;
		let i = this.movableColumns(n), a = i.findIndex((e) => e.index === r);
		if (a < 0 || i.length < 2) return null;
		let o = i.map(CK), s = n.querySelector(GG), c = getComputedStyle(n).direction === "rtl";
		return n.setAttribute(xr, ""), e.setAttribute(Sr, ""), {
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
		for (let a of xK(this.placesOf(e, t))) {
			let e = r.get(a);
			e !== void 0 && !e.anchored && !n.has(a) && i.push(e);
		}
		return i;
	}
	aimDrop(e, t) {
		let n = e.origin + t + ((e.scroll?.scrollLeft ?? 0) - e.scrolledAt), r = 0;
		for (; r < e.middles.length && (e.rightToLeft ? n < e.middles[r] : n > e.middles[r]);) r++;
		let i = Math.min(Math.max(r > e.from ? r - 1 : r, 0), e.places.length - 1);
		if (i === e.target || (e.target = i, wK(e.table), i === e.from)) return;
		let a = e.places.filter((t, n) => n !== e.from), o = a[e.target];
		o === void 0 ? a[a.length - 1].cell.setAttribute(Cr, "after") : o.cell.setAttribute(Cr, "before");
	}
	endReorder(e, t) {
		if (e.removeAttribute(Sr), t.table.removeAttribute(xr), wK(t.table), t.target === t.from) return;
		let n = t.places.filter((e, n) => n !== t.from);
		mv(), this.moveColumn(t.table, t.index, n[t.target]?.index ?? null);
	}
	moveColumn(e, t, n) {
		let r = this.columnsOf(e), i = new Map(r.map((e) => [e.index, e])), a = xK(this.placesOf(e, r)).filter((e) => i.get(e)?.anchored === !1), o = a.indexOf(t);
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
		this.orders.set(e, u ? null : c), this.store.write(e, uK, u ? null : JSON.stringify(c)), this.layout(e), this.rememberBoot(e);
	}
};
function hK(e, t) {
	let n = 0, r = 0, i = !1;
	for (let e of t.children) if (e.matches(`.${ZG}`)) i = !0;
	else if (!(e instanceof HTMLElement) || e.getAttribute("role") !== "row") continue;
	else i ? r += e.offsetHeight : n += e.offsetHeight;
	e.style.setProperty(tK, `${n}px`), e.style.setProperty(nK, `${r}px`);
}
function gK(e) {
	let t = e.matches(`.${qG}`) ? e.querySelector(`:scope > ${KG}`) : null;
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function _K(e) {
	return e.hasAttribute("data-ui-rows-draggable") && e.hasAttribute("data-ui-rows-drag-handle") && e.classList.contains("ui-drag-handle--start");
}
function vK(e, t, n) {
	for (let r of n) e[r].kind === "star" && e[r].min === e[r].value && t[r].kind === "star" && (t[r] = {
		...t[r],
		min: t[r].value
	});
	return t;
}
function yK(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches($G) || t.querySelector($G) !== null)) return !0;
	return !1;
}
function bK(e) {
	let t = e.type === "childList" ? e.target : e.target.parentElement;
	return t instanceof Element && t.classList.contains(ZG);
}
function xK(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) t[e[n]] = n;
	return t;
}
function SK(e, t) {
	if (e.length !== t.length) return !1;
	let n = new Set(t.map((e) => e.key));
	return e.every((e) => n.delete(e)) && n.size === 0;
}
function CK(e) {
	let t = e.cell.getBoundingClientRect();
	return t.left + t.width / 2;
}
function wK(e) {
	for (let t of e.querySelectorAll(`[${Cr}]`)) t.removeAttribute(Cr);
}
function TK(e) {
	return e.startsHidden || e.hideBelow !== null && B.indexOf(og()) < B.indexOf(e.hideBelow);
}
function EK(e) {
	return e !== null && B.includes(e);
}
//#endregion
//#region src/items/items-group-runs.ts
var DK = /* @__PURE__ */ new WeakMap();
function OK(e, t) {
	let n = /* @__PURE__ */ new Set(), r = e.getAttribute(sn);
	for (let i of G(e)) {
		let a = i.getAttribute("data-ui-group") ?? "";
		if (a !== "" && a !== r) {
			let r = kK(i, a) ?? AK(e, i, a, t);
			r !== null && n.add(r);
		}
		r = a;
	}
	for (let t of e.querySelectorAll(`:scope > [${Rt}]`)) n.has(t) || t.remove();
}
function kK(e, t) {
	let n = e.previousElementSibling, r = n === null ? void 0 : DK.get(n);
	return r !== void 0 && r.row === e && r.group === t ? n : null;
}
function AK(e, t, n, r) {
	let i = r(t);
	return i === null ? null : (PK(i, t.getAttribute(y)), DK.set(i, {
		row: t,
		group: n
	}), e.insertBefore(i, t), i);
}
function jK(e, t) {
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
function MK(e) {
	return e.find((e) => !e.classList.contains(Ai));
}
function NK(e, t, n, r, i) {
	let a = t.renderFromTemplate(e, n, i);
	if (a === null) return null;
	let o = document.createElement("div");
	return PK(o, r), o.appendChild(a), o;
}
function PK(e, t) {
	e.setAttribute(Rt, ""), t === null ? e.removeAttribute(zt) : e.setAttribute(zt, t);
}
var FK = "bottom", IK = "pending", LK = "focus";
function RK(e, t, n) {
	let r = zK(e, t);
	n <= 0 ? r?.remove() : (r ??= BK(t), t === "top" ? e.firstElementChild !== r && e.insertBefore(r, e.firstElementChild) : e.lastElementChild !== r && e.appendChild(r), r.style.height = `${n}px`);
}
function zK(e, t) {
	for (let n of e.children) if (n.getAttribute("data-ui-window-spacer") === t) return n;
	return null;
}
function BK(e) {
	let t = document.createElement("div");
	return t.setAttribute(Qt, e), t.style.flexShrink = "0", t;
}
function VK(e, t) {
	let n = zK(e, LK);
	if (t <= 0) return n?.remove(), null;
	let r = n ?? BK(LK);
	return r.style.height = `${t}px`, r;
}
function HK(e, t, n) {
	t === null ? (e.sum += n, e.count++) : e.sum += n - t;
}
//#endregion
//#region src/items/items-dom-order.ts
function UK(e, t) {
	let n = e.firstElementChild;
	n !== null && n.getAttribute("data-ui-window-spacer") === "top" && (n = n.nextElementSibling);
	for (let r of t) r !== n && e.insertBefore(r, n), n = r.nextElementSibling;
}
//#endregion
//#region src/items/items-group-renderer.ts
var WK = /* @__PURE__ */ new WeakMap();
function GK(e) {
	for (let t of e.querySelectorAll(`:scope > [${Rt}]`)) t.remove();
}
function KK(e, t, n, r, i, a) {
	let o = vj(e, G(e)), s = n.getGroupTemplate(t), c = s !== void 0, l = c && o.some((e) => e.hasAttribute("data-ui-group")), u = lj(i.getItemsFilterSortMetadata(t), a, rj(e));
	if (c && !l && (GK(e), WK.delete(e)), o.length === 0) return;
	let d = FA(e);
	if (!l) {
		UK(e, [...uj(o, u, r), ...PA(d)]);
		return;
	}
	let { buckets: f, order: p } = jK(o, (e) => e.getAttribute("data-ui-group") ?? ""), m = r.getAncestorStack(e), h = WK.get(e), g = /* @__PURE__ */ new Map(), _ = [];
	for (let t of p) {
		let n = f.get(t);
		u.length > 0 && (n = uj(n, u, r));
		let i = t === "" ? void 0 : MK(n);
		if (i !== void 0) {
			let n = qK(e, h?.get(t), i) ?? NK(s, r, r.getItemValue(i), i.getAttribute("data-ui-key"), m);
			n !== null && (g.set(t, n), _.push(n));
		}
		_.push(...n);
	}
	let v = new Set(g.values());
	for (let t of e.querySelectorAll(`:scope > [${Rt}]`)) v.has(t) || t.remove();
	WK.set(e, g), UK(e, [..._, ...PA(d)]);
}
function qK(e, t, n) {
	if (t !== void 0 && t.parentElement === e) return PK(t, n.getAttribute(y)), t;
}
//#endregion
//#region src/items/items-host-sync.ts
var JK = "ui-tree-rules", YK = `:scope > .${gr}:not(.${yr})`, XK = null;
function ZK(e, t, n) {
	XK === null ? QK(e, t, n) : (XK.hosts.set(e, {
		componentId: t,
		context: n
	}), _A(e) === "virtualized" && XK.drawing.add(e));
}
function QK(e, t, n) {
	if (e.parentElement?.classList.contains("ui-tree") === !0) e.dispatchEvent(new Event(JK, { bubbles: !0 })), IA(e, t, n.templates, n.renderer, e.querySelector(YK) !== null);
	else switch (_A(e)) {
		case "windowed":
			IA(e, t, n.templates, n.renderer), eq(e, t, n);
			return;
		case "virtualized":
			n.virtualization.sync(e);
			return;
		default:
			oj(e, t, n.metadata, n.renderer, n.state), $K(e), IA(e, t, n.templates, n.renderer), KK(e, t, n.templates, n.renderer, n.metadata, n.state);
			return;
	}
}
function $K(e) {
	let t = gp(e);
	t !== null && hp(t, G(e).filter((e) => e instanceof HTMLElement));
}
function eq(e, t, n) {
	let r = n.templates.getGroupTemplate(t);
	if (r === void 0) return;
	let i = n.renderer.getAncestorStack(e);
	OK(e, (e) => NK(r, n.renderer, n.renderer.getItemValue(e), e.getAttribute(y), i));
}
function tq(e) {
	if (XK !== null) {
		e();
		return;
	}
	let t = {
		hosts: /* @__PURE__ */ new Map(),
		drawing: /* @__PURE__ */ new Set()
	};
	XK = t;
	try {
		e();
	} finally {
		XK = null;
		for (let [e, n] of t.hosts) nq(e, n);
	}
}
function nq(e, t) {
	try {
		e.isConnected && QK(e, t.componentId, t.context);
	} catch (t) {
		c("bringing an items host in step failed.", {
			host: e,
			error: t
		});
	}
}
function rq(e) {
	if (XK !== null && XK.drawing.size !== 0) for (let t of XK.drawing) {
		let n = XK.hosts.get(t);
		n !== void 0 && e(t) && (XK.drawing.delete(t), XK.hosts.delete(t), nq(t, n));
	}
}
//#endregion
//#region src/rendering/tree-boot-fold.ts
var iq = "fold", aq = ["fold-hidden", "fold-shown"], oq = ".ui-table", sq = `:scope > .${fr} > .${pr} > [role='columnheader']`, cq = `:scope > .${mr}`, lq = "input:not([type='hidden']), button, select, textarea, a[href]", uq = /* @__PURE__ */ new WeakMap();
function dq(e) {
	for (let t of e.querySelectorAll(sq)) {
		let e = fq(t);
		e !== null && e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
	}
}
function fq(e) {
	let t = e.querySelector(lq);
	if (t !== null) return t;
	if (e.hasAttribute("tabindex")) return e;
	let n = e.querySelector(cq);
	return n !== null && n.getClientRects().length > 0 ? e : null;
}
function pq(e, t = null) {
	let n = mq(e), r = uq.get(e), i = n.find((e) => t !== null && gq(e) === t) ?? (r !== void 0 && n.includes(r) ? r : n[0]);
	return i !== void 0 && (hq(e, i), !0);
}
function mq(e) {
	let t = bf(e), n = [];
	for (let r of e.querySelectorAll(sq)) {
		let e = fq(r), i = Number(r.getAttribute("data-ui-table-column") ?? NaN);
		e !== null && Number.isInteger(i) && P(e) && n.push({
			stop: e,
			place: t.place(i)
		});
	}
	return n.sort((e, t) => e.place - t.place).map((e) => e.stop);
}
function hq(e, t) {
	t.hasAttribute("tabindex") || t.setAttribute("tabindex", "-1"), uq.set(e, t), t.focus();
}
function gq(e) {
	return e.closest("[role='columnheader']")?.getAttribute("data-ui-table-column") ?? null;
}
function _q(e) {
	let t = e.closest("[role='columnheader']"), n = t?.parentElement?.parentElement?.parentElement ?? null;
	return t !== null && n instanceof HTMLElement && n.matches(oq) && fq(t) === e ? n : null;
}
function vq(e, t, n) {
	if (!M(e) || !(e.target instanceof HTMLElement)) return !1;
	switch (e.key) {
		case "ArrowDown": return n(gq(e.target)), !0;
		case "ArrowUp": return !0;
	}
	if (!xd(e.key, "horizontal")) return !1;
	let r = bd({
		key: e.key,
		items: mq(t),
		current: e.target,
		axis: "horizontal",
		loop: !1
	});
	return r !== null && r !== e.target && hq(t, r), !0;
}
//#endregion
//#region src/interactions/items-selection-engine.ts
var yq = /* @__PURE__ */ new Set([
	" ",
	"Enter",
	"Delete"
]), bq = ".ui-table", xq = /* @__PURE__ */ new Set([
	"ArrowLeft",
	"ArrowRight",
	"ArrowUp",
	"ArrowDown",
	"Home",
	"End",
	"Enter",
	"F2",
	" "
]), Sq = `:scope > [${b}], :scope > .${fr}, :scope > .${fr} > [${b}]`, Cq = class {
	root;
	rows;
	pressedBoxes = [];
	windowEnds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.rows = e.rows, this.applyAll(this.root.querySelectorAll(F)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("mouseup", () => this.restoreBoxes(), !0), this.root.addEventListener("pointercancel", () => this.restoreBoxes(), !0), this.root.addEventListener("contextmenu", () => this.restoreBoxes(), !0), V(this.root, F, { childList: !0 }, (e) => this.applyAll(e)), V(this.root, F, { attributeFilter: [
			pi,
			hi,
			gi,
			$t
		] }, (e) => {
			for (let t of e) this.remark(t);
		}), this.root instanceof Node && new MutationObserver((e) => this.followCursor(e)).observe(this.root, {
			subtree: !0,
			attributes: !0,
			attributeFilter: [Pe]
		});
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = vf(e);
		rf(e, t);
		for (let t of e.querySelectorAll(Sq)) Tq(t);
		if (e.matches(".ui-items-view, .ui-table")) {
			e.matches(bq) && dq(e);
			for (let n of t) {
				let t = hd(n);
				t !== null && Tq(t);
				for (let e of gd(n)) Tq(e);
				wq(e, n, n.hasAttribute(Pe));
			}
			this.settleWindowEnd(e, t);
		}
	}
	settleWindowEnd(e, t) {
		let n = this.windowEnds.get(e), r = n === void 0 ? null : pf(e);
		if (n === void 0 || r === null || r.hasAttribute("data-ui-window-pending")) return;
		let i = yA(r, rn) !== null, a = n === "first" ? vA(r) === 0 && !bA(r, "data-ui-window-more-before") : !bA(r, on);
		if (i && !a) return;
		this.windowEnds.delete(e);
		let o = op(n === "first" ? "Home" : "End", t, null, Nq(e));
		o !== null && (zf(e, t, o), e.getAttribute("data-ui-selection") === "one" && of(e, t, o, Yd));
	}
	remark(e) {
		let t = vf(e);
		rf(e, t), this.settleWindowEnd(e, t);
	}
	handleClick(e) {
		let t = this.resolveRow(e, F);
		if (t === null || !(e instanceof MouseEvent)) return;
		let { root: n, item: r } = t, i = vf(n);
		zf(n, i, r, e.target instanceof Element ? tp(r, e.target) : null), R(n), n.hasAttribute("data-ui-no-row-select") ? Qd(n, r) : of(n, i, r, $d(e), this.heldRange(n)) && e.preventDefault();
	}
	resolveRow(e, t) {
		if (!(e.target instanceof Element)) return null;
		let n = e.target.closest(qd), r = n?.closest(F) ?? null;
		return n === null || r === null || n.closest(F) !== r || !r.matches(t) || O(r) ? null : yd(e.target, n) === null && !k(n) ? {
			root: r,
			item: n
		} : null;
	}
	heldRange(e) {
		let t = this.rows, n = pf(e);
		return t === void 0 || n === null ? void 0 : (e, r) => t.rangeKeysOf(n, e, r);
	}
	handleDoubleClick(e) {
		let t = this.resolveRow(e, Jd);
		t === null || e.target instanceof Element && t.item.contains(e.target.closest("[data-ui-no-row-open]")) || (e.preventDefault(), dp(t.item, "open"));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.altKey || !(e.target instanceof Element) || sd(e)) return;
		let t = _q(e.target);
		if (t !== null && !O(t)) {
			vq(e, t, (e) => this.enterRows(t, e)) && e.preventDefault();
			return;
		}
		let n = Af(e);
		if (n === null) return;
		let { root: r } = n;
		if (!r.matches(".ui-items-view, .ui-table") || O(r) || Vf(r) && Eq(e) && this.handleCellKey(r, e)) return;
		let i = Nq(r);
		if (!yq.has(e.key) && !ip(e.key, i)) return;
		if (this.windowEnds.delete(r), this.reachWindowEnd(r, e)) {
			e.preventDefault();
			return;
		}
		this.bringRowsIn(r, e.key);
		let a = vf(r), o = Pf(a), s = op(e.key, a, Ff(a), i);
		if (s !== null) {
			e.preventDefault(), zf(r, a, s, e.key === "ArrowUp" && !e.shiftKey && Vf(r) ? ep(s) : null), Oq(r, a, o, s, ef(r, e), this.heldRange(r));
			return;
		}
		if (e.key === "ArrowUp" && M(e, { alt: !0 }) && r.matches(bq) && pq(r, Yf(r))) {
			e.preventDefault();
			return;
		}
		if (o === null || k(o)) return;
		let c = hd(o);
		switch (e.key) {
			case " ":
				kq(r, a, o, c);
				break;
			case "Enter":
				jq(r, a, o, c);
				break;
			case "Delete":
				if (!Aq(r, a, o)) return;
				break;
			default: return;
		}
		e.preventDefault();
	}
	handleCellKey(e, t) {
		this.bringCursorRowIn(e);
		let n = vf(e), r = Ff(n);
		if (r === null || k(r)) return !1;
		let i = Jf(r), a = M(t, { alt: !0 });
		switch (t.key) {
			case "ArrowLeft":
			case "ArrowRight":
			case "Home":
			case "End": {
				if (!a) return !1;
				let o = Xf(e, r, i, t.key);
				return o !== null && zf(e, n, r, o), t.preventDefault(), !0;
			}
			case "ArrowDown":
			case "ArrowUp": {
				let o = a ? Zf(e, r, i, t.key === "ArrowDown") : null;
				return o !== null && (t.preventDefault(), zf(e, n, r, o), !0);
			}
			default: return i !== null && Dq(i, t);
		}
	}
	reachWindowEnd(e, t) {
		let n = t.key === "Home" || t.key === "End" ? pf(e) : null;
		if (n === null || _A(n) !== "windowed" || n.hasAttribute("data-ui-window-paged")) return !1;
		let r = t.key === "Home";
		return !(r ? vA(n) === 0 && !bA(n, "data-ui-window-more-before") : !bA(n, "data-ui-window-more-after")) && (this.windowEnds.set(e, r ? "first" : "last"), kd(n, r ? 0 : Od(n).contentHeight), !0);
	}
	bringRowsIn(e, t) {
		let n = this.rows, r = n === void 0 ? null : pf(e);
		if (n === void 0 || r === null) return;
		let i = bp(e);
		switch (t) {
			case "Home":
			case "End": {
				let e = n.shownKeysOf(r);
				e !== null && e.length > 0 && n.reveal(r, t === "Home" ? e[0] : e[e.length - 1], "nearest");
				return;
			}
			case "PageDown":
			case "PageUp": {
				let a = i === null ? Ff(vf(e)) : null, o = i ?? (a === null ? null : L(a));
				o !== null && n.reveal(r, o, t === "PageDown" ? "start" : "end");
				return;
			}
			default: this.bringCursorRowIn(e);
		}
	}
	bringCursorRowIn(e) {
		let t = this.rows === void 0 ? null : pf(e), n = bp(e);
		t !== null && n !== null && this.rows?.reveal(t, n, "nearest");
	}
	enterRows(e, t) {
		let n = vf(e), r = Ff(n) ?? op("ArrowDown", n, null, "vertical");
		e.focus({ preventScroll: !0 }), r !== null && (zf(e, n, r, Uf(r, t)), e.getAttribute("data-ui-selection") === "one" && of(e, n, r, Yd));
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement && e.target.matches("[data-ui-items-host], .ui-table__scroll") ? e.target : null, n = t?.closest(F) ?? null;
		if (t !== null && n !== null && [...n.querySelectorAll(Sq)].includes(t)) {
			R(n);
			return;
		}
		if (e.target instanceof HTMLElement && e.target.matches(F) && e.target.matches(".ui-items-view, .ui-table") && !O(e.target) && !Bp()) {
			Lf(e.target, vf(e.target));
			return;
		}
		let r = e.target instanceof Element ? e.target.closest(qd) : null, i = r?.closest(F) ?? null;
		r !== null && i !== null && !r.hasAttribute("data-ui-row-focus") && i.matches(".ui-items-view, .ui-table") && yd(e.target, r) !== null && zf(i, vf(i), r, e.target instanceof Element ? tp(r, e.target) : null, !1);
	}
	handlePointerDown(e) {
		this.restoreBoxes();
		let t = e.target instanceof Element ? e.target : null, n = t?.closest(F) ?? null;
		if (t !== null && n !== null) {
			document.activeElement !== n && Hp(n, !0);
			for (let e of n.querySelectorAll(Sq)) e.contains(t) && e.getAttribute("tabindex") === "-1" && (e.removeAttribute("tabindex"), this.pressedBoxes.push(e));
		}
	}
	restoreBoxes() {
		for (let e of this.pressedBoxes) Tq(e);
		this.pressedBoxes = [];
	}
	followCursor(e) {
		for (let t of e) {
			let e = t.target;
			if (!(e instanceof HTMLElement) || !e.matches(qd)) continue;
			let n = e.closest(F);
			n !== null && n.matches(".ui-items-view, .ui-table") && wq(n, e, e.hasAttribute(Pe));
		}
	}
};
function wq(e, t, n) {
	if (n) for (let n of t.querySelectorAll(`[${Ie}]`)) n.parentElement?.closest(F) === e && uW(n);
	else for (let n of t.querySelectorAll(Cp)) n.tabIndex >= 0 && n.parentElement?.closest(F) === e && vd(t, n) && lW(n);
}
function Tq(e) {
	e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
}
function Eq(e) {
	return xq.has(e.key) || pD(e) !== null;
}
function Dq(e, t) {
	let n = t.key, r = pD(t) !== null, i = M(t, { shift: !0 });
	if (!r && (!i || n !== "Enter" && n !== "F2" && n !== " ")) return !1;
	if (n !== " " && rp(e, t)) return !0;
	let a = hd(e);
	if (a !== null && (n === "Enter" || n === " ")) return t.preventDefault(), a.click(), !0;
	if (n !== "F2" && (n !== "Enter" || !$f(e))) return !1;
	let o = Jp(e);
	return o !== null && (t.preventDefault(), o.focus(), !0);
}
function Oq(e, t, n, r, i, a) {
	(e.getAttribute("data-ui-selection") === "one" || i.shift) && (i.shift && Zd(e, n), of(e, t, r, i, a));
}
function kq(e, t, n, r) {
	of(e, t, n, {
		shift: !1,
		ctrl: !0
	}) || Mq(n, r);
}
function Aq(e, t, n) {
	if (!e.hasAttribute("data-ui-rows-remove")) return !1;
	let r = Pq(t, n);
	for (let e of r) dp(e, "remove");
	return r.length > 0;
}
function jq(e, t, n, r) {
	tf(e) && !af(t).includes(n) && of(e, t, n, Yd), Mq(n, r), r === null && dp(n, "open");
}
function Mq(e, t) {
	t === null ? dp(e, up) : t.click();
}
function Nq(e) {
	return e.matches(".ui-items-view--wrap") ? "grid" : e.matches(".ui-orientation--horizontal") ? "both" : "vertical";
}
function Pq(e, t) {
	let n = af(e);
	return (n.includes(t) ? n.filter((e) => e === t || I(e) !== null) : [t]).filter((e) => !Dl(e, "data-ui-unremovable") && !k(e));
}
//#endregion
//#region src/interactions/tree-engine.ts
var Fq = "ui-tree__row--folded", Iq = "ui-tree__row--dragging", Lq = "ui-tree__loading", Rq = "ui-tree__loading-ring", zq = "ui-tree-node__text", Bq = "ui-tree-node__toggle", Vq = "ui-tree-node__rename", Hq = ".ui-text__title", Uq = vr, Wq = "--ui-tree-depth", Gq = "expanded", Kq = 200, qq = 600, Jq = .25, Yq = {
	ArrowUp: "up",
	ArrowDown: "down",
	ArrowLeft: "out",
	ArrowRight: "in"
}, Xq = /* @__PURE__ */ new Set([
	" ",
	"ArrowRight",
	"ArrowLeft",
	"Enter",
	"F2",
	"Delete"
]), Zq = "ui-tree-unfold-settled", Qq = {
	name: "unfold",
	registration: { completed: (e) => {
		e.domEvent.target?.dispatchEvent(new Event(Zq, { bubbles: !0 }));
	} }
}, $q = class {
	root;
	store = new jI();
	rules;
	folds = /* @__PURE__ */ new WeakMap();
	requested = /* @__PURE__ */ new WeakSet();
	inFlight = /* @__PURE__ */ new WeakSet();
	writtenBoot = /* @__PURE__ */ new WeakMap();
	springTarget = null;
	springTimer = 0;
	dropPlace = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.rules = e.rules, this.root.addEventListener(JK, (e) => {
			let t = e.target instanceof Element ? e.target.closest(`.${hr}`) : null;
			t !== null && (this.layout(t), hp(t, this.rowsOf(t)));
		}, !0), this.root.addEventListener(Zq, (e) => this.handleUnfoldSettled(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), e.effects?.register("RenameNode", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename node effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(w(n.id), n.dynamicParameters ?? []), i = r === null ? null : this.rowsOf(r).find((e) => L(e) === t.key) ?? null;
			i === null ? s("rename node effect names no node on the page.", t) : this.startRename(i);
		}), this.layoutAll(this.root.querySelectorAll(`.${hr}`)), V(this.root, `.${hr}`, {
			childList: !0,
			attributeFilter: [
				Dr,
				Or,
				Ar,
				Fr
			],
			relevant: iJ
		}, (e) => this.layoutAll(e));
	}
	layoutAll(e) {
		for (let t of e) this.layout(t);
	}
	layout(e) {
		let t = this.foldOf(e), n = this.resolveRules(e), r = n === null ? this.rowsOf(e) : this.orderRows(e, n), i = e.hasAttribute("data-ui-tree-draggable") || e.hasAttribute("data-ui-drag-kind"), a = /* @__PURE__ */ new Set();
		for (let e of r) {
			let t = pM(e)?.getAttribute(Dr);
			t != null && t.length > 0 && a.add(t);
		}
		let o = n?.filtering === !0 ? this.matchingRows(r, n) : null, s = /* @__PURE__ */ new Map();
		for (let e of r) {
			let n = L(e), r = pM(e), c = r?.getAttribute("data-ui-tree-parent") ?? "", l = c.length > 0 ? s.get(c) : void 0, u = l === void 0 ? 0 : l.depth + 1, d = l === void 0 || l.shown && l.expanded, f = r?.hasAttribute(Or) === !0, p = f || a.has(n), m = p && r?.hasAttribute("data-ui-tree-expanded") === !0, h = l === void 0 || l.authoredShown && this.authoredExpandedOf(l), g = p && (o === null ? t.get(n) ?? m : o.has(n)), _ = o !== null && !o.has(n);
			e.style.setProperty(Wq, String(u)), e.setAttribute("aria-level", String(u + 1)), Rf(e, r?.querySelector(`:scope > .${zq}`) ?? null), e.classList.toggle(Fq, !d), e.classList.toggle(yr, _), e.removeAttribute(Pr), e.draggable = i && EA(e), p ? e.setAttribute("aria-expanded", g ? "true" : "false") : e.removeAttribute("aria-expanded"), (a.has(n) || !f) && (e.removeAttribute(Mr), this.inFlight.delete(e)), g && d && f && !a.has(n) && !this.requested.has(e) && (this.requested.add(e), this.inFlight.add(e), e.setAttribute(Mr, ""), e.dispatchEvent(new Event("unfold", { bubbles: !0 }))), !g && !this.inFlight.has(e) && this.requested.delete(e), this.placeLoadingRow(e, u + 1, e.hasAttribute(Mr), d && g && !_), s.set(n, {
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
		return pM(e.row)?.hasAttribute(Ar) === !0;
	}
	writeBootFold(e, t, n) {
		if (t.size === 0) return;
		let r = [], i = [];
		for (let [e, a] of t) {
			let t = n.get(e);
			(t === void 0 || this.authoredExpandedOf(t) !== a) && (a ? r : i).push(e);
		}
		let a = JSON.stringify([r, i]), o = this.writtenBoot.get(e);
		if (o !== a && (this.writtenBoot.set(e, a), this.store.writeBoot(e, iq, r.length + i.length === 0 ? null : { fold: {
			version: 1,
			open: r,
			closed: i
		} }), o === void 0)) for (let t of aq) this.store.writeBoot(e, t, null);
	}
	resolveRules(e) {
		let t = this.hostOf(e), n = Za(e);
		if (this.rules === void 0 || t === null || n === null) return null;
		let r = this.rules.metadata.getItemsFilterSortMetadata(n), i = rj(t);
		if (r === void 0 && i === null) return null;
		let a = lj(r, this.rules.state, i), o = cj(r, this.rules.state, i);
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
			let t = pM(e)?.getAttribute("data-ui-tree-parent") ?? "", n = i.has(t) ? t : "", r = a.get(n);
			r === void 0 ? a.set(n, [e]) : r.push(e);
		}
		let o = [], s = (e) => {
			let n = a.get(e);
			if (n !== void 0) {
				n.sort((e, n) => dj(r.getItemValue(e), r.getItemValue(n), t.sorts));
				for (let e of n) o.push(e), s(L(e));
			}
		};
		if (s(""), o.length !== n.length || o.every((e, t) => e === n[t])) return o.length === n.length ? o : n;
		let c = this.hostOf(e);
		if (c === null) return n;
		for (let e of c.querySelectorAll(`:scope > .${Lq}`)) e.remove();
		for (let e of o) c.appendChild(e);
		return o;
	}
	matchingRows(e, t) {
		let n = /* @__PURE__ */ new Set();
		if (this.rules === void 0) return n;
		let r = this.rules.state, i = this.rules.renderer;
		for (let a = e.length - 1; a >= 0; a--) {
			let o = e[a], s = L(o), c = i.getItemValue(o);
			if (c === void 0 || sj(t.config, c, r, t.query) || n.has(s)) {
				n.add(s);
				let e = pM(o)?.getAttribute("data-ui-tree-parent") ?? "";
				e.length > 0 && n.add(e);
			}
		}
		return n;
	}
	placeLoadingRow(e, t, n, r) {
		let i = e.nextElementSibling, a = i instanceof HTMLElement && i.classList.contains(Lq) ? i : null;
		if (!n) {
			a?.remove();
			return;
		}
		let o = a ?? aJ();
		o.style.setProperty(Wq, String(t)), o.classList.toggle(Fq, !r), a === null && e.after(o);
	}
	handleUnfoldSettled(e) {
		e.target instanceof Element && this.inFlight.delete(e.target);
	}
	handleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null) return;
		let { tree: n, row: r, target: i } = t;
		(i.closest(`.${Bq}`) !== null || Dl(r, "data-ui-unselectable") && yd(i, r) === null) && (e.preventDefault(), this.setFocus(n, r, null), this.toggle(n, r));
	}
	handleDoubleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null || yd(t.target, t.row) !== null) return;
		let { tree: n, row: r } = t;
		e.preventDefault(), n.hasAttribute("data-ui-tree-rename-dblclick") && this.canRename(n, r) ? this.startRename(r) : dp(r, "open");
	}
	rowOfEvent(e) {
		if (!(e.target instanceof Element)) return null;
		let t = e.target.closest(`.${gr}`), n = t?.closest(".ui-tree") ?? null;
		return t === null || n === null || t.closest(".ui-tree") !== n || k(t) ? null : {
			tree: n,
			row: t,
			target: e.target
		};
	}
	handleFocusIn(e) {
		let t = e.target;
		t instanceof HTMLElement && t.classList.contains("ui-tree") && !O(t) && !Bp() && Lf(t, this.rowsOf(t));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || j(e) || !(e.target instanceof Element)) return;
		let t = Af(e);
		if (t === null) return;
		let n = t.root;
		if (!n.classList.contains("ui-tree") || O(n)) return;
		let r = e.altKey && M(e, { alt: !0 }) ? Yq[e.key] : void 0;
		if (r !== void 0 && n.hasAttribute("data-ui-tree-draggable")) {
			e.preventDefault(), this.moveByKey(n, r);
			return;
		}
		if (e.altKey || !Xq.has(e.key) && !ip(e.key, "vertical")) return;
		let i = this.rowsOf(n), a = Pf(i), o = op(e.key, i, Ff(i), "vertical");
		if (o !== null) e.preventDefault(), this.setFocus(n, o, ef(n, e));
		else if (!(a === null || k(a))) {
			switch (e.key) {
				case " ":
					kq(n, i, a, null);
					break;
				case "ArrowRight":
					a.getAttribute("aria-expanded") === "false" ? this.toggle(n, a) : a.getAttribute("aria-expanded") === "true" && this.setFocus(n, op("ArrowDown", i, a, "vertical"), Yd);
					break;
				case "ArrowLeft":
					a.getAttribute("aria-expanded") === "true" ? this.toggle(n, a) : this.setFocus(n, this.parentOf(n, a), Yd);
					break;
				case "Enter":
					jq(n, i, a, null);
					break;
				case "F2":
					if (!this.canRename(n, a)) return;
					this.startRename(a);
					break;
				case "Delete":
					if (n.hasAttribute("data-ui-tree-unremovable") || !Aq(n, i, a)) return;
					break;
				default: return;
			}
			e.preventDefault();
		}
	}
	moveByKey(e, t) {
		let n = this.rowsOf(e), r = Pf(n);
		if (r === null || !r.draggable || (t === "up" || t === "down") && this.isSorted(e)) return;
		let i = sJ(n), a = L(r), o = yM(i, a, t);
		if (o === null) return;
		let [s] = this.moveRows(e, [r], o, t === "in" ? n.find((e) => L(e) === o.parent) ?? null : null), c = i.filter((e) => e.parent === o.parent && e.key !== a).length + 1;
		Mj(s + 1, c);
	}
	isSorted(e) {
		return (this.resolveRules(e)?.sorts.length ?? 0) > 0;
	}
	canRename(e, t) {
		return e.hasAttribute("data-ui-tree-renamable") && !Dl(t, "data-ui-unrenamable");
	}
	handleDragStart(e) {
		let t = oJ(e), n = t?.closest(".ui-tree") ?? null, r = n?.hasAttribute(Fr) === !0, i = n === null ? null : this.hostOf(n);
		if (t === null || n === null || i === null || !r && !n.hasAttribute("data-ui-drag-kind")) return;
		if (k(t)) {
			e.preventDefault();
			return;
		}
		let a = TA(t, this.rowsOf(n)), o = wA(n, i, a);
		r ? ib(e, n, t, Iq, L(t), a.filter((e) => e !== t), OA(o, !0)) : ob(e, L(t), OA(o, !1)), kA(e, o);
	}
	draggingRows(e) {
		return this.rowsOf(e).filter((e) => e.classList.contains(Iq));
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${hr}`), n = t === null ? [] : this.draggingRows(t), r = t === null ? null : this.hostOf(t);
		if (t === null || n.length === 0 || r === null) return;
		let i = e.target.closest(`.${gr}`), a = i !== null && i.closest(".ui-tree") === t ? i : null, o = a === null ? {
			mark: "",
			place: {
				parent: "",
				before: null
			}
		} : this.dropAt(t, a, n, e.clientY);
		o === null ? (this.markDrop(t, null), this.springOpen(t, null)) : (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), this.markDrop(t, a ?? r, o.mark, o.depth), this.dropPlace = o.place, this.springOpen(t, a !== null && o.mark === "" ? a : null));
	}
	dropAt(e, t, n, r) {
		let i = this.parentKeysOf(e), a = L(t), o = (e) => n.some((t) => L(t) === e || rJ(i, e, L(t))), s = mM(t, pM(t)), c = t.getBoundingClientRect(), l = c.height > 0 ? (r - c.top) / c.height : .5, u = s ? Jq : .5, d = this.isSorted(e) ? null : l < u ? "before" : l >= 1 - u ? "after" : null;
		if (d === null) return s && !o(a) ? {
			mark: "",
			place: {
				parent: a,
				before: null
			}
		} : null;
		if (n.includes(t)) return null;
		let f = this.rowsOf(e), p = sJ(f), m = Number(t.style.getPropertyValue(Wq)) || 0, h = new Set(n.map(L)), g = d === "after" && t.getAttribute("aria-expanded") === "true" ? p.find((e) => e.parent === a && e.shown !== !1 && !h.has(e.key)) : void 0, _ = i.get(a) ?? "", v = g === void 0 ? {
			parent: _,
			before: d === "before" ? a : CM(p, _, a, !1, h)
		} : {
			parent: a,
			before: g.key
		};
		return !hM(v.parent, (e) => f.find((t) => L(t) === e) ?? null) || o(v.parent) ? null : {
			mark: d,
			place: v,
			depth: g === void 0 ? m : m + 1
		};
	}
	springOpen(e, t) {
		let n = t !== null && t.getAttribute("aria-expanded") === "false" ? t : null;
		n !== this.springTarget && (window.clearTimeout(this.springTimer), this.springTarget = n, n !== null && (this.springTimer = window.setTimeout(() => this.expand(e, n), qq)));
	}
	handleDragLeave(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${hr}`);
		t !== null && sb(e, t) && (this.markDrop(t, null), this.springOpen(t, null));
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${hr}`), n = t === null ? [] : this.draggingRows(t), r = t?.querySelector(`[${Uq}]`) ?? null, i = this.dropPlace;
		if (t === null || n.length === 0 || r === null || i === null) return;
		e.preventDefault();
		let a = this.parentKeysOf(t), o = n.filter((e) => !n.some((t) => t !== e && rJ(a, L(e), L(t)))), s = r.getAttribute(Uq) === "" && r.classList.contains("ui-tree__row") ? r : null;
		this.markDrop(t, null), this.springOpen(t, null), ab(t, Iq), this.moveRows(t, o, i, s);
	}
	moveRows(e, t, n, r) {
		let i = wM(sJ(this.rowsOf(e)), t.map(L), n);
		return r !== null && this.expand(e, r), t.forEach((e, t) => {
			let r = pM(e)?.querySelector(`.${zq}`) ?? null;
			r !== null && (r.setAttribute(Nr, n.parent), r.dispatchEvent(new Event("change", { bubbles: !0 })), Wj(e, i[t]));
		}), i;
	}
	handleDragEnd(e) {
		let t = oJ(e)?.closest(".ui-tree") ?? null;
		t !== null && (ab(t, Iq), this.markDrop(t, null), this.springOpen(t, null));
	}
	markDrop(e, t, n = "", r) {
		_M(e, t, n, r), t === null && (this.dropPlace = null);
	}
	parentKeysOf(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of this.rowsOf(e)) t.set(L(n), pM(n)?.getAttribute("data-ui-tree-parent") ?? "");
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
		i.delete(r), i.set(r, n), eJ(i, a);
		let o = n ? a.filter((e) => e.classList.contains(Fq)) : [];
		this.store.writeJson(e, Gq, [...i]), this.layout(e), nJ(o.filter((e) => !e.classList.contains(Fq)));
	}
	foldOf(e) {
		let t = this.folds.get(e);
		return t === void 0 && (t = tJ(this.store.readJson(e, Gq)), this.folds.set(e, t)), t;
	}
	setFocus(e, t, n) {
		if (t === null) return;
		let r = this.rowsOf(e), i = Pf(r);
		zf(e, r, t), n !== null && Oq(e, r, i, t, n);
	}
	parentOf(e, t) {
		let n = pM(t)?.getAttribute("data-ui-tree-parent") ?? "";
		return n.length === 0 ? null : this.rowsOf(e).find((e) => L(e) === n) ?? null;
	}
	startRename(e) {
		let t = e.closest(`.${hr}`), n = pM(e), r = n?.querySelector(Hq) ?? null;
		t === null || n === null || r === null || Dl(e, "data-ui-unrenamable") || (this.setFocus(t, e, null), Bu({
			container: n,
			title: r,
			className: Vq,
			value: n.getAttribute("data-ui-tree-title") ?? r.textContent?.trim() ?? "",
			commit: (t) => {
				n.setAttribute(jr, t), n.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
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
function eJ(e, t) {
	if (e.size <= Kq) return;
	let n = new Set(t.map(L)), r = 0;
	for (let t of e.keys()) n.has(t) || r++;
	for (let t of [...e.keys()]) {
		if (r <= Kq) return;
		n.has(t) || (e.delete(t), r--);
	}
}
function tJ(e) {
	let t = Array.isArray(e) ? e : typeof e == "object" && e ? Object.entries(e) : [], n = /* @__PURE__ */ new Map();
	for (let e of t) Array.isArray(e) && typeof e[0] == "string" && typeof e[1] == "boolean" && n.set(e[0], e[1]);
	return n;
}
function nJ(e) {
	if (!(e.length === 0 || Xh())) for (let t of e) t.animate([{
		opacity: 0,
		offset: 0
	}], {
		duration: z.fast,
		easing: z.enter
	});
}
function rJ(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let i = e.get(t) ?? ""; i.length > 0 && !r.has(i); i = e.get(i) ?? "") {
		if (i === n) return !0;
		r.add(i);
	}
	return !1;
}
function iJ(e) {
	if (e.type !== "childList") return !0;
	let t = e.target;
	return t instanceof HTMLElement && (t.classList.contains("ui-tree__row") || t.hasAttribute("data-ui-items-host") && t.parentElement?.classList.contains("ui-tree") === !0);
}
function aJ() {
	let e = document.createElement("div"), t = document.createElement("span");
	return e.className = Lq, e.setAttribute(MA, ""), e.setAttribute("aria-hidden", "true"), t.className = Rq, e.append(t, D.text("ui.tree.loading")), e;
}
function oJ(e) {
	return e.target instanceof Element ? e.target.closest(`.${gr}`) : null;
}
function sJ(e) {
	return e.map((e) => ({
		key: L(e),
		parent: pM(e)?.getAttribute("data-ui-tree-parent") ?? "",
		takesDrop: mM(e, pM(e)),
		shown: !e.classList.contains(yr)
	}));
}
//#endregion
//#region src/runtime/client-state.ts
var cJ = {
	visibilityState: () => document.visibilityState,
	notificationPermission: uJ
};
function lJ(e) {
	return e !== "hidden";
}
function uJ() {
	return typeof Notification > "u" || !window.isSecureContext ? void 0 : Notification.permission;
}
var dJ = 200;
function fJ(e = cJ) {
	return {
		visible: lJ(e.visibilityState()),
		notificationPermission: e.notificationPermission() ?? "unsupported"
	};
}
var pJ = class {
	report;
	source;
	settleMilliseconds;
	held = null;
	timer;
	constructor(e) {
		this.report = e.report, this.source = e.source ?? cJ, this.settleMilliseconds = e.settleMilliseconds ?? dJ;
	}
	forAttach() {
		return clearTimeout(this.timer), this.held = fJ(this.source), this.held;
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
		let t = fJ(this.source);
		(t.visible !== e.visible || t.notificationPermission !== e.notificationPermission) && (this.held = t, this.report(t).catch(() => void 0));
	}
};
//#endregion
//#region src/interactions/system-notifications.ts
function mJ(e) {
	return {
		permission: uJ,
		registration: e ?? (() => Promise.resolve(void 0)),
		create: (e, t) => new Notification(e, t),
		focus: () => window.focus()
	};
}
async function hJ(e, t, n = mJ()) {
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
function gJ(e, t, n, r = window.location) {
	e.bringTo !== void 0 && _J(e.bringTo, r) ? t(e.bringTo) : e.action !== void 0 && n(e.action);
}
function _J(e, t = window.location) {
	let n = new URL(e, t.origin);
	return n.pathname !== t.pathname || n.search !== t.search || n.hash !== "" && n.hash !== t.hash;
}
//#endregion
//#region src/interactions/tab-order.ts
function vJ(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) e[n].pinned && (t = n + 1);
	return t;
}
//#endregion
//#region src/interactions/tabs-view-engine.ts
var Y = "ui-tabs-view", yJ = "ui-tab-item__label", bJ = "ui-tab-item__close", xJ = "ui-tab-item__rename", SJ = "ui-tab-item__caption", CJ = "ui-tab-item__pin", wJ = ".ui-text__title", TJ = "ui-tab-item--dragging", EJ = "ui-tab-item__caption--overflowed", DJ = "ui-tabs-view--overflowing", OJ = "ui-tabs-view--no-overflow", kJ = "ui-tab-item__page", AJ = "ui-tab-item--selected", jJ = `.${Hn}`, MJ = "tab-menu-entry", NJ = {
	name: MJ,
	registration: { dynamicParameters: (e) => wL(e.domEvent.detail?.entry, e.dynamicParameters) }
}, PJ = "tab-pin";
function FJ(e) {
	return {
		name: PJ,
		registration: gA((e) => Ij(e.target), e)
	};
}
var IJ = "--ui-tabs-view-strip", LJ = class {
	root;
	fitter;
	dragStart = null;
	menuTab = null;
	closed = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new HU({
			rootClass: Y,
			overflowingClass: DJ,
			wraps: (e) => e.classList.contains(OJ),
			hiddenClass: EJ,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(), e.effects?.register("RenameTab", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename tab effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(w(n.id), n.dynamicParameters ?? []), i = (r === null ? void 0 : this.ownItems(r).find((e) => JJ(e) === t.key))?.querySelector(`.${yJ}`) ?? null;
			i === null ? s("rename tab effect names no tab on the page.", t) : this.startRename(i);
		}), this.root.addEventListener(kL, (e) => this.prepareMenu(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), zG(this.root, ["press"], (e) => {
			let t = e.closest(`.${bJ}`)?.closest(`.${SJ}`) ?? null;
			return t === null ? [] : [t];
		}), V(this.root, `.${Y}`, {
			childList: !0,
			attributeFilter: [
				vi,
				xe,
				le,
				...wi
			],
			relevant: (e) => !x_(e, `.${kJ}`, `.${Y}`)
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${Y}`)) this.apply(e);
	}
	apply(e) {
		let t = this.ownItems(e);
		zJ(e, t);
		let n = t.filter(E_), r = e.getAttribute("data-ui-tabs-selected") ?? "", i = Gd(n, r, JJ);
		if (i === null) return;
		if (i !== r) {
			this.select(e, i);
			return;
		}
		let a = e.hasAttribute(xe), o = t.find((e) => e.classList.contains(AJ))?.querySelector(`.${SJ}`) ?? null, s = [], c = null, l = null;
		for (let e of t) {
			let t = JJ(e) === r;
			e.classList.toggle(AJ, t);
			let i = e.querySelector(`.${SJ}`);
			i !== null && (i.draggable = a, XU(i), n.includes(e) && (s.push(i), t && (c = i))), e.querySelector(`.${yJ}`)?.setAttribute("aria-selected", t ? "true" : "false");
			for (let n of e.querySelectorAll(`.${kJ}`)) n.hidden = !t;
			t && (l = e.querySelector(`.${kJ}`));
		}
		this.fitCaptions(e, s, c), this.writeStripHeight(e, l), ZU(o, c), o !== null && o !== c && QU(l);
		let u = [], d = null;
		for (let e of s) {
			let t = e.querySelector(`.${yJ}`);
			t === null || e.classList.contains(EJ) || (u.push(t), e === c && (d = t));
		}
		N(u, d), this.focusAfterClose(e, d);
	}
	focusAfterClose(e, t) {
		let n = this.closed;
		n === null || n.root !== e || n.item.isConnected || (this.closed = null, t !== null && (document.activeElement === null || document.activeElement === document.body) && R(t));
	}
	writeStripHeight(e, t) {
		let n = this.hostOf(e);
		if (n === null || t === null || !E_(t)) return;
		let r = Math.max(0, Math.round(t.getBoundingClientRect().top - n.getBoundingClientRect().top));
		n.style.setProperty(IJ, `${r}px`);
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${b}]`);
	}
	fitCaptions(e, t, n) {
		let r = this.hostOf(e), i = e.querySelector(`:scope > .${LU}`);
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownItems(e).find((e) => JJ(e) === t)?.querySelector(`.${yJ}`)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownItems(e).filter(E_).map((e) => ({
				key: JJ(e),
				title: e.querySelector(`.${yJ}`)?.textContent?.trim() ?? JJ(e),
				current: JJ(e) === t,
				disabled: O(e.querySelector(`.${yJ}`) ?? e)
			}));
		});
	}
	prepareMenu(e) {
		let t = e.target;
		if (!(e instanceof CustomEvent) || !(t instanceof HTMLElement) || t.getAttribute("data-ui-context-menu") !== "tab") return;
		let n = t.parentElement, r = e.detail.target.closest(`.${Pj}`);
		if (n === null || !n.classList.contains(Y) || r === null || r.closest(`.${Y}`) !== n) {
			e.preventDefault();
			return;
		}
		let i = HJ(n, r), a = WJ(t), o = a.map((e) => {
			if (UJ(e)) return "rule";
			let t = i.get(e.getAttribute("data-ui-key") ?? "");
			return t !== void 0 && (e.style.display = t ? "" : "none"), t ?? E_(e) ? "shown" : "hidden";
		});
		CL(o).forEach((e, t) => {
			o[t] === "rule" && (a[t].style.display = e ? "" : "none");
		}), o.includes("shown") ? this.menuTab = {
			root: n,
			key: JJ(r)
		} : e.preventDefault();
	}
	handleMenuEntry(e) {
		let t = e.closest(`[${Ce}="tab"]`), n = t?.parentElement ?? null, r = e.closest(jJ);
		if (t === null || n === null || !n.classList.contains(Y) || r === null || !t.contains(r)) return !1;
		let i = r.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "", a = this.menuTab, o = a === null || a.root !== n ? void 0 : this.ownItems(n).find((e) => JJ(e) === a.key);
		if (i.length === 0 || r.matches("[data-ui-menu-group] > .ui-menu-item, [data-ui-menu-item-kind=\"header\"], [data-ui-menu-item-kind=\"separator\"]") || o === void 0) return !0;
		if (!i.startsWith("tabs:")) return o.dispatchEvent(new CustomEvent(MJ, {
			bubbles: !0,
			detail: { entry: i }
		})), !0;
		if (HJ(n, o).get(i) !== !0) return !0;
		switch (i) {
			case gL: {
				let e = o.querySelector(`.${yJ}`);
				e !== null && this.startRename(e);
				break;
			}
			case _L:
			case vL:
				this.setPinned(n, o, i === _L);
				break;
			default: o.dispatchEvent(new Event("remove", { bubbles: !0 }));
		}
		return !0;
	}
	setPinned(e, t, n) {
		if (t.hasAttribute("data-ui-tab-pinned") === n) return;
		let r = t.querySelector(`:scope > .${SJ} > .${CJ}`);
		t.toggleAttribute(Ci, n), r !== null && (r.toggleAttribute(Ci, n), r.dispatchEvent(new Event("change", { bubbles: !0 })));
		let i = this.ownItems(e), a = i.filter((e) => e !== t), o = vJ(a.map(qJ));
		if (i.indexOf(t) === o) return;
		let s = a[o];
		s === void 0 ? Fj(a[a.length - 1]).after(Fj(t)) : Fj(s).before(Fj(t)), t.dispatchEvent(new Event(PJ, { bubbles: !0 }));
	}
	handleClick(e) {
		if (!(e.target instanceof Element) || this.handleMenuEntry(e.target) || this.handleClose(e, e.target)) return;
		let t = e.target.closest(`.${LU}`), n = t?.parentElement ?? null;
		if (t !== null && n !== null && n.classList.contains(Y)) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = GJ(e.target), i = r?.closest(`.${Y}`) ?? null;
		if (r === null || i === null || O(r)) return;
		let a = r.closest(`.${Pj}`);
		a !== null && a.closest(`.${Y}`) === i && (e.preventDefault(), this.select(i, JJ(a)), document.activeElement !== r && R(r));
	}
	handleClose(e, t) {
		let n = t.closest(`.${bJ}`), r = n?.closest(".ui-tab-item") ?? null, i = r?.closest(`.${Y}`) ?? null;
		return n === null || r === null || i === null ? !1 : (e.preventDefault(), e.stopPropagation(), BJ(i, r) && r.dispatchEvent(new Event("remove", { bubbles: !0 })), !0);
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = GJ(e.target), n = t?.closest(`.${Y}`) ?? null;
		t !== null && n !== null && n.hasAttribute("data-ui-tabs-renamable") && (e.preventDefault(), this.startRename(t));
	}
	startRename(e) {
		let t = e.parentElement, n = e.querySelector(wJ) ?? e, r = e.closest(`.${Pj}`);
		t === null || r === null || Lj(r, "data-ui-unrenamable") || Bu({
			container: t,
			title: n,
			className: xJ,
			value: e.getAttribute("data-ui-tab-caption") ?? n.textContent?.trim() ?? "",
			commit: (t) => {
				e.setAttribute(yi, t), e.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			refocus: () => R(e)
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || sd(e)) return;
		let t = e.target.closest(`.${yJ}`), n = t?.closest(`.${Y}`) ?? null;
		if (t === null || n === null) return;
		if (e.key === "F2" && M(e)) {
			if (!n.hasAttribute("data-ui-tabs-renamable")) return;
			e.preventDefault(), this.startRename(t);
			return;
		}
		let r = t.closest(`.${Pj}`);
		if (r === null || r.closest(`.${Y}`) !== n) return;
		if (e.key === "Delete" && M(e)) {
			if (!VJ(n, r)) return;
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
		let i = this.ownItems(n).map((e) => e.querySelector(`.${yJ}`)).filter((e) => e !== null), a = bd({
			key: e.key,
			items: i,
			current: t,
			axis: "horizontal"
		});
		if (a === null) return;
		e.preventDefault();
		let o = a.closest(`.${Pj}`);
		o !== null && this.select(n, JJ(o)), a.focus();
	}
	moveByKey(e, t, n) {
		if (!e.hasAttribute("data-ui-tabs-draggable") || Lj(t, "data-ui-undraggable") || O(t) || t.hasAttribute("data-ui-tab-pinned")) return;
		n.preventDefault();
		let r = this.ownItems(e), i = r[r.indexOf(t) + (n.key === "ArrowLeft" ? -1 : 1)];
		i === void 0 || i.hasAttribute("data-ui-tab-pinned") || (n.key === "ArrowLeft" ? Fj(t).after(Fj(i)) : Fj(t).before(Fj(i)), Wj(t, this.ownItems(e).indexOf(t)));
	}
	handleDragStart(e) {
		let t = KJ(e);
		if (t === null) return;
		if (Lj(t, "data-ui-undraggable") || O(t) || t.hasAttribute("data-ui-tab-pinned")) {
			e.preventDefault();
			return;
		}
		ib(e, t.closest(`.${Y}`) ?? t, t, TJ, JJ(t));
		let n = Fj(t);
		this.dragStart = n.parentNode === null ? null : {
			parent: n.parentNode,
			next: n.nextSibling
		};
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${SJ}`)?.closest(".ui-tab-item") ?? null, n = t?.closest(`.${Y}`) ?? null;
		if (t === null || n === null) return;
		let r = n.querySelector(`.${TJ}`);
		if (r === null || (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), r === t)) return;
		let i = t.querySelector(`.${SJ}`)?.getBoundingClientRect();
		if (i === void 0) return;
		let a = Fj(r), o = t.hasAttribute("data-ui-tab-pinned") ? RJ(n, a) : null, s = o ?? Fj(t), c = o === null && e.clientX < i.left + i.width / 2 ? s : s.nextElementSibling;
		c !== a && s.parentElement?.insertBefore(a, c);
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Y}`);
		t !== null && t.querySelector(`.${TJ}`) !== null && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"));
	}
	handleDragEnd(e) {
		let t = KJ(e);
		if (t === null) return;
		t.classList.remove(TJ);
		let n = this.dragStart;
		if (this.dragStart = null, e instanceof DragEvent && e.dataTransfer?.dropEffect === "none" && n !== null) {
			n.parent.insertBefore(Fj(t), n.next);
			return;
		}
		let r = Fj(t);
		if (n !== null && r.parentNode === n.parent && r.nextSibling === n.next) return;
		let i = t.closest(`.${Y}`);
		i !== null && Wj(t, this.ownItems(i).indexOf(t));
	}
	select(e, t) {
		Wd(e, t, {
			attribute: vi,
			bindingAttribute: _i,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return Hd(e, `.${Pj}`, `.${Y}`);
	}
};
function RJ(e, t) {
	let n = null;
	for (let r of Hd(e, `.${Pj}`, `.${Y}`)) {
		let e = Fj(r);
		e !== t && r.hasAttribute("data-ui-tab-pinned") && (n = e);
	}
	return n;
}
function zJ(e, t) {
	let n = !t.some((e) => !Lj(e, le));
	e.hasAttribute("data-ui-tabs-none-removable") !== n && e.toggleAttribute(be, n);
}
function BJ(e, t) {
	return !e.hasAttribute("data-ui-tabs-unremovable") && !Lj(t, "data-ui-unremovable");
}
function VJ(e, t) {
	return e.hasAttribute("data-ui-tabs-removes") && BJ(e, t) && !t.hasAttribute("data-ui-tab-pinned") && !O(t);
}
function HJ(e, t) {
	return SL(xL(e.getAttribute(Se)), {
		pinned: t.hasAttribute(Ci),
		renamable: !Lj(t, ue),
		removable: e.hasAttribute("data-ui-tabs-removes") && BJ(e, t)
	});
}
function UJ(e) {
	let t = e.getAttribute(y);
	return t === "tabs:separator" || t === "tabs:separator-remove" || e.querySelector(":scope > [data-ui-menu-item-kind=\"separator\"]") !== null;
}
function WJ(e) {
	let t = e.querySelector(`[${b}]`);
	return t === null ? [] : Array.from(t.children).filter((e) => e instanceof HTMLElement && e.hasAttribute("data-ui-key"));
}
function GJ(e) {
	return e.closest(`.${bJ}`) !== null || zu(e) ? null : e.closest(`.${SJ}`)?.querySelector(`:scope > .${yJ}`) ?? null;
}
function KJ(e) {
	return e.target instanceof Element ? e.target.closest(`.${SJ}`)?.closest(".ui-tab-item") ?? null : null;
}
function qJ(e) {
	return { pinned: e.hasAttribute(Ci) };
}
function JJ(e) {
	return e.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "";
}
//#endregion
//#region src/interactions/text-fold-engine.ts
var YJ = "button.ui-text__fold-toggle", XJ = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(YJ);
		t !== null && (e.preventDefault(), t.setAttribute("aria-expanded", t.getAttribute("aria-expanded") === "true" ? "false" : "true"));
	}
}, ZJ = "ui-temporal-input__segments", QJ = "ui-temporal-input__segment", $J = "ui-temporal-input__segment-literal", eY = "ui-temporal-input__segment--empty", tY = "data-ui-temporal-segment", nY = "data-ui-temporal-step-direction", rY = "data-ui-temporal-segments-of", iY = "--", aY = /* @__PURE__ */ new Map([
	["ArrowUp", 1],
	["ArrowDown", -1],
	["PageUp", 10],
	["PageDown", -10]
]), oY = class {
	options;
	root;
	edits = /* @__PURE__ */ new WeakMap();
	wheelTurn = 0;
	onWheel = (e) => this.handleWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${K}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(Ya(e.components, `.${K}`));
		}), V(this.root, `.${K}`, { attributeFilter: [...gN] }, (e) => this.applyAll(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("mousedown", (e) => this.handleStepperPress(e), !0);
	}
	applyAll(e) {
		for (let t of e) vN(t) === "time" && this.applySegments(t);
	}
	applySegments(e) {
		for (let t of e.querySelectorAll(`.${ZJ}`)) this.applyContainer(e, t);
	}
	applyContainer(e, t) {
		let n = yN(e), r = wN(e), i = q(e, jN(t));
		t.getAttribute(rY) !== n && (t.replaceChildren(...sY(n).map((e) => lY(e))), t.setAttribute(rY, n));
		for (let n of t.children) {
			if (!(n instanceof HTMLElement)) continue;
			let t = n.getAttribute(tY);
			t === null ? n.textContent = dY(n.dataset.token ?? "", n.dataset.formatted !== void 0, i, r) : (n.textContent = fY(t, Number(n.dataset.width ?? "2"), i, r), n.classList.toggle(eY, i === null), n.tabIndex = 0, pY(n, t, i, A(e)));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !M(e, { shift: !0 })) return;
		let t = hY(e.target);
		if (t === null) return;
		let n = t.closest(`.${K}`), r = t.getAttribute(tY), i = mY(t), a = aY.get(e.key);
		if (a !== void 0) e.preventDefault(), this.resetBuffer(n), this.applyStep(n, r, a, i);
		else if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") e.preventDefault(), this.resetBuffer(n), _Y(n, t, e.key);
		else if (e.key === "Backspace" || e.key === "Delete") e.preventDefault(), this.resetBuffer(n), BN(n, null, i), this.applySegments(n);
		else if (r === "meridiem") {
			let t = vY(e.key, wN(n));
			t !== null && (e.preventDefault(), this.applyMeridiem(n, t, i));
		} else e.key.length === 1 && e.key >= "0" && e.key <= "9" && (e.preventDefault(), this.applyDigit(n, t, r, e.key, i));
	}
	handleFocusIn(e) {
		let t = hY(e.target);
		t !== null && (this.wheelTurn = 0, t.addEventListener("wheel", this.onWheel, { passive: !1 }));
	}
	handleWheel(e) {
		let t = hY(e.currentTarget);
		if (t === null || t !== document.activeElement || e.deltaY === 0) return;
		e.preventDefault();
		let { steps: n, carried: r } = Wx(this.wheelTurn, Ux(e).y);
		if (this.wheelTurn = r, n === 0) return;
		let i = t.closest(`.${K}`);
		this.resetBuffer(i);
		for (let e = 0; e < Math.abs(n); e++) this.applyStep(i, t.getAttribute(tY), n < 0 ? 1 : -1, mY(t));
	}
	handleStepperPress(e) {
		e.target instanceof Element && e.target.closest(`[${nY}]`) !== null && e.preventDefault();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${nY}]`);
		if (t === null) return;
		let n = t.closest(`.${K}`);
		if (n === null || A(n)) return;
		e.preventDefault();
		let r = gY(n) ?? n.querySelector(`.${QJ}`);
		r !== null && (r.focus(), this.resetBuffer(n), this.applyStep(n, r.getAttribute(tY), t.getAttribute(nY) === "up" ? 1 : -1, mY(r)));
	}
	handleFocusOut(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${QJ}`) : null;
		if (t === null) return;
		t.removeEventListener("wheel", this.onWheel);
		let n = t.closest(`.${K}`);
		n !== null && this.resetBuffer(n);
	}
	applyStep(e, t, n, r) {
		if (t === "meridiem") {
			let t = q(e, r), n = t !== null && t.getHours() >= 12 ? "am" : "pm";
			this.write(e, ZN(e, bY(this.baseValue(e, r), n)), r);
			return;
		}
		let i = this.baseValue(e, r), a = yY(t), o = xN(bN(e), a) * n, s = a === "hour" ? 24 : 60, c = ((SN(i, a) + o) % s + s) % s;
		this.write(e, ZN(e, CN(i, a, c)), r);
	}
	applyDigit(e, t, n, r, i) {
		let a = this.editState(e), o = n === "hour" ? 23 : n === "hour12" ? 12 : 59, s = +(n === "hour12"), c = (a.unit === n ? a.buffer : "") + r;
		Number(c) > o && (c = r);
		let l = Number(c), u = c.length >= 2 || l * 10 > o;
		if (a.unit = n, a.buffer = u ? "" : c, l >= s) {
			let t = this.baseValue(e, i);
			this.write(e, n === "hour12" ? CN(t, "hour", xY(l, t.getHours() >= 12)) : CN(t, yY(n), l), i);
		}
		u && _Y(e, t, "ArrowRight");
	}
	applyMeridiem(e, t, n) {
		this.write(e, bY(this.baseValue(e, n), t), n);
	}
	baseValue(e, t) {
		return q(e, t) ?? XN(e);
	}
	write(e, t, n) {
		BN(e, t, n), JN(e), this.applySegments(e);
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
function sY(e) {
	let t = [];
	for (let n = 0; n < e.length;) {
		let r = Gs(e, n);
		r === null ? (t.push({
			kind: "literal",
			token: e[n],
			formatted: !1
		}), n++) : (t.push(cY(r)), n += r.length);
	}
	return t;
}
function cY(e) {
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
function lY(e) {
	if (e.kind === "literal") {
		let t = document.createElement("span");
		return t.className = $J, t.dataset.token = e.token, e.formatted && (t.dataset.formatted = ""), t;
	}
	let t = document.createElement("span");
	return t.className = QJ, t.tabIndex = 0, t.setAttribute("role", "spinbutton"), t.setAttribute(tY, e.unit), t.dataset.width = String(e.width), uY(t, e.unit), t;
}
function uY(e, t) {
	if (t === "meridiem") {
		D.write(e, "aria-label", "ui.picker.meridiem");
		return;
	}
	let n = yY(t);
	D.write(e, "aria-label", n === "hour" ? "ui.picker.hours" : n === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"), e.setAttribute("aria-valuemin", t === "hour12" ? "1" : "0"), e.setAttribute("aria-valuemax", t === "hour12" ? "12" : t === "hour" ? "23" : "59");
}
function dY(e, t, n, r) {
	return t && n !== null ? Bs(n, e, r) : e;
}
function fY(e, t, n, r) {
	if (n === null) return iY;
	if (e === "meridiem") return n.getHours() < 12 ? r.amDesignator : r.pmDesignator;
	let i = e === "hour12" ? fc(n.getHours()) : SN(n, yY(e));
	return String(i).padStart(t, "0");
}
function pY(e, t, n, r) {
	r !== e.hasAttribute("aria-readonly") && (r ? e.setAttribute("aria-readonly", "true") : e.removeAttribute("aria-readonly")), t === "meridiem" || n === null ? e.removeAttribute("aria-valuenow") : e.setAttribute("aria-valuenow", String(t === "hour12" ? fc(n.getHours()) : SN(n, yY(t))));
}
function mY(e) {
	return jN(e.closest(`.${ZJ}`));
}
function hY(e) {
	let t = e instanceof Element ? e.closest(`.${QJ}`) : null;
	if (t === null) return null;
	let n = t.closest(`.${K}`);
	return n === null || A(n) ? null : t;
}
function gY(e) {
	return document.activeElement instanceof HTMLElement && document.activeElement.closest(".ui-temporal-input") === e ? document.activeElement.closest(`.${QJ}`) : null;
}
function _Y(e, t, n) {
	bd({
		key: n,
		items: [...e.querySelectorAll(`.${QJ}`)],
		current: t,
		axis: "horizontal",
		loop: !1
	})?.focus();
}
function vY(e, t) {
	let n = e.toLowerCase();
	return n.length === 1 ? n === "a" || n === t.amDesignator.charAt(0).toLowerCase() ? "am" : n === "p" || n === t.pmDesignator.charAt(0).toLowerCase() ? "pm" : null : null;
}
function yY(e) {
	return e === "hour12" || e === "meridiem" ? "hour" : e;
}
function bY(e, t) {
	return CN(e, "hour", xY(fc(e.getHours()), t === "pm"));
}
function xY(e, t) {
	let n = e % 12;
	return t ? n + 12 : n;
}
//#endregion
//#region src/interactions/timestamp-engine.ts
var SY = "datetime", CY = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.apply(this.root.querySelectorAll(`.${wt}`), D.temporal === null), D.onTable(() => this.apply(this.root.querySelectorAll(`.${wt}`))), e.propertyPatchEngine?.addValueChangeHandler((e) => this.apply(Ya(e.components, `.${wt}`))), V(this.root, `.${wt}`, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [SY],
			relevant: (e) => e.type === "attributes" || !(e.target instanceof Element && e.target.closest(".ui-timestamp") !== null)
		}, (e) => this.apply(e));
	}
	apply(e, t = !1) {
		let n = {
			temporal: D.temporal,
			language: D.language || document.documentElement.lang
		}, r = Date.now(), i = !1;
		for (let a of e) {
			let e = gc(a.getAttribute(Et)), o = hc(a.getAttribute(SY)), s = a.querySelector(`.${Tt}`);
			if (s === null || t && !wY(e, o, r)) continue;
			let c = o === null ? "" : bc(o, e, n, r);
			s.textContent !== c && (s.textContent = c), i ||= _c(e) && o !== null;
		}
		i && tl(this.refreshRelative);
	}
	refreshRelative = () => {
		let e = [...this.root.querySelectorAll(`.${wt}:is([${Et}="relative"], [${Et}="relative-date"])`)];
		return e.length !== 0 && (this.apply(e), !0);
	};
};
function wY(e, t, n) {
	return e === "relative" || e === "relative-date" && t !== null && xc(t, n) !== null;
}
//#endregion
//#region src/interactions/file-tile-engine.ts
var TY = `.${Dt}`, EY = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), D.onChange(() => this.applyAll()), e.propertyPatchEngine?.addValueChangeHandler((e) => DY(Ya(e.components, TY))), V(this.root, TY, {
			childList: !0,
			addedOnly: !0,
			attributeFilter: [
				jt,
				Mt,
				Nt,
				Pt
			],
			relevant: (e) => e.type === "attributes" || !(e.target instanceof Element && e.target.closest(TY) !== null)
		}, DY);
	}
	applyAll() {
		DY(this.root.querySelectorAll(TY));
	}
};
function DY(e) {
	let t = D.language || document.documentElement.lang;
	for (let n of e) Sx(n, t);
}
//#endregion
//#region src/items/item-reveal.ts
var OY = /* @__PURE__ */ new Map();
function kY(e) {
	if (e.hasAttribute("data-ui-items-host")) return e;
	for (let t of e.querySelectorAll(`[${b}]`)) if (t.closest("[data-ui-id]") === e) return t;
	return null;
}
function AY(e, t, n, r) {
	let i = jY(e, t);
	return i !== null && (OY.set(e, {
		key: t,
		block: n
	}), MY(e, i, n, r), !0);
}
function jY(e, t) {
	for (let n of e.children) if (n.getAttribute("data-ui-key") === t) return n;
	return null;
}
function MY(e, t, n, r) {
	let i = t.previousElementSibling, a = i !== null && i.hasAttribute("data-ui-group-header") && i.getAttribute("data-ui-group-anchor") === t.getAttribute("data-ui-key") ? i : null, o = Ed(e);
	if (o.scrollHeight <= o.clientHeight) {
		(a ?? t).scrollIntoView({
			behavior: r,
			block: n === "Start" ? "start" : n === "End" ? "end" : n === "Center" ? "center" : "nearest"
		});
		return;
	}
	let s = o.getBoundingClientRect().top + o.clientTop, c = o.clientHeight, l = (a ?? t).getBoundingClientRect().top, u = t.getBoundingClientRect().bottom, d = NY(n, l - s, u - s, c);
	d !== 0 && (r === "smooth" ? o.scrollTo({
		top: o.scrollTop + d,
		behavior: r
	}) : o.scrollTop += d);
}
function NY(e, t, n, r) {
	switch (e) {
		case "Center": return (t + n - r) / 2;
		case "End": return n - r;
		case "Nearest": return t >= 0 && n <= r ? 0 : t < 0 || n - t > r ? t : n - r;
		default: return t;
	}
}
function PY(e) {
	let t = OY.get(e);
	if (t === void 0) return;
	let n = jY(e, t.key);
	n === null ? OY.delete(e) : MY(e, n, t.block, "auto");
}
function FY(e) {
	if (OY.size !== 0 && e instanceof Node) for (let t of [...OY.keys()]) (!t.isConnected || Ed(t).contains(e)) && OY.delete(t);
}
//#endregion
//#region src/interactions/scroll-anchor-engine.ts
var IY = "data-ui-scroll-anchor", LY = "End", RY = `[${IY}="${LY}"]`, zY = 4, BY = [
	"wheel",
	"touchstart",
	"pointerdown",
	"keydown"
], VY = /* @__PURE__ */ new WeakSet();
function HY(e) {
	VY.add(e);
}
function UY(e) {
	FY(e);
	for (let t = e.closest(RY); t !== null; t = t.parentElement?.closest(RY) ?? null) VY.delete(t);
}
var WY = class {
	root;
	pinned = /* @__PURE__ */ new WeakMap();
	resizes = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null;
	watched = /* @__PURE__ */ new WeakMap();
	watchedContainers = /* @__PURE__ */ new WeakSet();
	heights = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0);
		for (let e of BY) this.root.addEventListener(e, (e) => GY(e), {
			capture: !0,
			passive: !0
		});
		V(this.root, `[${IY}="${LY}"]`, {
			childList: !0,
			characterData: !0,
			attributeFilter: [dn]
		}, (e) => this.followEach(e)), this.followContent();
	}
	handleScroll(e) {
		let t = e.target;
		t instanceof Element && qY(t) && this.pinned.set(t, VY.has(t) || YY(t) && !JY(t));
	}
	followContent() {
		this.followEach(this.root.querySelectorAll(`[${IY}="${LY}"]`));
	}
	followEach(e) {
		for (let t of e) this.watchRows(t), VY.has(t) ? (this.pinned.set(t, !0), KY(t)) : this.pinned.get(t) !== !1 && (JY(t) ? this.pinned.set(t, !1) : (this.pinned.set(t, !0), KY(t)));
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
			if (!e.isConnected || r === null || !qY(r)) {
				this.forget(e);
				continue;
			}
			let i = e.getBoundingClientRect(), a = this.heights.get(e);
			if (this.heights.set(e, i.height), a === i.height) continue;
			let o = a !== void 0 && i.top + a <= r.getBoundingClientRect().top ? i.height - a : 0;
			t.set(r, (t.get(r) ?? 0) + o);
		}
		for (let [e, n] of t) this.followsEnd(e) ? KY(e) : n !== 0 && e.getAttribute("data-ui-host-mode") !== "virtualized" && getComputedStyle(e).overflowAnchor === "none" && (e.scrollTop += n);
	}
	followOwnBox(e) {
		!e.isConnected || !qY(e) ? (this.watchedContainers.delete(e), this.resizes?.unobserve(e)) : this.followsEnd(e) && KY(e);
	}
	followsEnd(e) {
		return VY.has(e) || this.pinned.get(e) !== !1 && !JY(e);
	}
	forget(e) {
		this.resizes?.unobserve(e), this.heights.delete(e);
	}
};
function GY(e) {
	FY(e.target);
	let t = e.target instanceof Element ? e.target.closest(RY) : null;
	t !== null && VY.delete(t);
}
function KY(e) {
	e.scrollTop = e.scrollHeight;
}
function qY(e) {
	return e.getAttribute(IY) === LY;
}
function JY(e) {
	return bA(e, on);
}
function YY(e) {
	return e.scrollHeight - e.scrollTop - e.clientHeight <= zY;
}
//#endregion
//#region src/interactions/text-selection-engine.ts
var XY = `${fd}, [role='menu'], [role='tab']`, ZY = class {
	selection;
	selects;
	constructor(e = {}) {
		let t = e.root ?? document;
		this.selection = e.selection ?? (() => document.getSelection()), this.selects = e.selects ?? QY, t.addEventListener("pointerdown", (e) => this.handlePointerDown(e), { capture: !0 });
	}
	handlePointerDown(e) {
		if (e.button !== 0 || e.pointerType === "touch" || !(e.target instanceof Element)) return;
		let t = this.selection();
		t === null || t.isCollapsed || e.target.closest(XY) !== null || this.selects(e.target) || t.removeAllRanges();
	}
};
function QY(e) {
	let t = getComputedStyle(e);
	return (t.getPropertyValue("user-select") || t.getPropertyValue("-webkit-user-select")) !== "none";
}
//#endregion
//#region src/interactions/scroll-group-mapping.ts
function $Y(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.top(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = tX(e, a, n), s = tX(e, a + 1, n);
	return nX(t, o.top, s.top, o.line, s.line);
}
function eX(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.line(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = tX(e, a, n), s = tX(e, a + 1, n);
	return nX(t, o.line, s.line, o.top, s.top);
}
function tX(e, t, n) {
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
function nX(e, t, n, r, i) {
	return n <= t ? r : r + Math.min(1, Math.max(0, (e - t) / (n - t))) * (i - r);
}
//#endregion
//#region src/interactions/scroll-group-engine.ts
var rX = 250, iX = class {
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
		let r = this.memberScrolledBy(t), i = r?.getAttribute(Yt);
		if (r != null && i != null && i.length !== 0) for (let e of this.membersOf(i)) e !== r && e.isConnected && this.follow(t, this.viewportOf(e));
	}
	membersOf(e) {
		let t = performance.now(), n = this.members.get(e);
		if (n !== void 0 && t - n.at < rX && n.found.every((e) => e.isConnected)) return n.found;
		let r = [...this.root.querySelectorAll(`[${Yt}="${S(e)}"]`)];
		return this.members.set(e, {
			found: r,
			at: t
		}), r;
	}
	memberScrolledBy(e) {
		for (let t = e.closest(`[${Yt}]`); t !== null; t = t.parentElement?.closest("[data-ui-scroll-group]") ?? null) if (this.viewportOf(t) === e) return t;
		return null;
	}
	viewportOf(e) {
		let t = this.viewports.get(e);
		if (t !== void 0 && t.isConnected && e.contains(t)) return t;
		let n = aX(e, "data-ui-scroll-viewport") ?? oX(e) ?? e;
		return this.viewports.set(e, n), n;
	}
	follow(e, t) {
		let n = e.scrollHeight - e.clientHeight, r = t.scrollHeight - t.clientHeight;
		if (r <= 0 && t.scrollWidth <= t.clientWidth) return;
		let i = n > 0 ? cX(e) : null, a = i === null ? null : cX(t), o;
		if (n <= 0 || e.scrollTop <= 0) o = 0;
		else if (e.scrollTop >= n - 1) o = r;
		else if (i !== null && a !== null) {
			let t = Math.max(i.endLine, a.endLine);
			o = eX(a, $Y(i, e.scrollTop, t), t);
		} else o = e.scrollTop / n * r;
		let s = i === null && a === null ? sX(e.scrollLeft, e.scrollWidth - e.clientWidth) * Math.max(0, t.scrollWidth - t.clientWidth) : t.scrollLeft;
		o = Math.round(Math.min(Math.max(0, o), Math.max(0, r))), !(Math.abs(t.scrollTop - o) < 1 && Math.abs(t.scrollLeft - s) < 1) && (t.scrollTo({
			top: o,
			left: s,
			behavior: "instant"
		}), this.driven.set(t, t.scrollTop));
	}
};
function aX(e, t) {
	for (let n of e.querySelectorAll(`[${t}]`)) if (n.closest("[data-ui-id]") === e) return n;
	return null;
}
function oX(e) {
	let t = e.hasAttribute("data-ui-items-host") ? e : aX(e, b);
	return t === null ? null : Ed(t);
}
function sX(e, t) {
	return t > 0 ? e / t : 0;
}
function cX(e) {
	let t = e.getBoundingClientRect().top + e.clientTop - e.scrollTop, n = (e) => e.getBoundingClientRect().top - t, r = e.querySelector(`[${Xt}]`);
	if (r !== null && r.children.length > 0) return {
		count: r.children.length,
		line: (e) => e + 1,
		top: (e) => n(r.children[e]),
		endLine: r.children.length + 1,
		scrollHeight: e.scrollHeight
	};
	let i = e.querySelectorAll(`[${Zt}]`);
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
var lX = ".ui-tab-item__caption, .ui-split-button:not([data-ui-split-mode='menu']) > :is(.ui-split-button__main, .ui-split-button__toggle)", uX = `.${zi}, .ui-action, .${Hn}, .ui-select__option, .ui-language-switcher__choice, .ui-pager__size-choice, .ui-color-input__swatch--button, .ui-expander__header, ${lX}`, dX = ".ui-expander__header", fX = "ui-key-value-action__row", pX = `${uX}, ${`${qd}, .${fX}`}`, mX = "ui-pressing", hX = "ui-press-held", gX = "ui-press-placed", _X = class {
	clicks;
	waves;
	presses = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		let t = e.root ?? document;
		this.clicks = e.clicks ?? (() => !1), this.waves = e.waves ?? !0, t.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), t.addEventListener("pointerup", (e) => this.release(e, !1), !0), t.addEventListener("pointercancel", (e) => this.release(e, !0), !0), t.addEventListener("dragstart", () => this.finishAll(), !0), t.addEventListener(fI, (e) => this.handleHold(e)), t.addEventListener(pI, (e) => this.handleHoldEnd(e));
	}
	handlePointerDown(e) {
		if (!(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		this.end(e.pointerId, !0);
		let t = this.pressedElement(e.target);
		t !== null && this.moves(t) && (this.start(e.pointerId, t, e.clientX, e.clientY, z.ripple, !1), t.classList.add(hX));
	}
	moves(e) {
		return this.waves && typeof e.animate == "function" && !Xh();
	}
	start(e, t, n, r, i, a) {
		for (let [e, n] of this.presses) n.element === t && this.finish(e, n);
		let o = t.getBoundingClientRect(), s = n - o.left, c = r - o.top, l = Math.hypot(Math.max(s, o.width - s), Math.max(c, o.height - c)), { wave: u, ink: d } = vX(s - t.clientLeft, c - t.clientTop, l);
		t.classList.add(mX), t.append(u);
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
		if (t === null || !(n instanceof HTMLElement) || O(n) || t.target.closest(dX) !== null) return;
		let r = this.presses.get(t.pointerId);
		if (r !== void 0 && r.fade === null) {
			this.retime(r, performance.now() + t.duration);
			return;
		}
		let i = this.moves(n);
		(i || this.pressedElement(t.target) === null) && (this.start(t.pointerId, n, t.clientX, t.clientY, i ? t.duration : null, !0), getComputedStyle(n).position === "static" && n.classList.add(gX));
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
		let t = e.closest(lX) ?? e.closest(pX);
		if (t === null || O(t) || t.matches(dX)) return null;
		let n = e.closest(Ii);
		return n !== null && n !== t && t.contains(n) ? null : t.matches(uX) ? t : this.pressedRow(t, e);
	}
	pressedRow(e, t) {
		if (yd(t, e) !== null || k(e) || e.hasAttribute("data-ui-row-editing")) return null;
		let n = e.closest(F), r = n !== null && !e.classList.contains(fX) && !n.hasAttribute("data-ui-no-row-select") && (n.getAttribute("data-ui-selection") === "one" || n.getAttribute("data-ui-selection") === "many"), i = e.classList.contains("ui-tree__row") && Dl(e, "data-ui-unselectable");
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
		n.element.classList.remove(hX);
		let r = performance.now(), i = Math.max(0, n.fills - r), a = t ? 0 : Math.min(i, z.fast);
		a > 0 && this.retime(n, r + a), n.fade = n.wave.animate([{ opacity: 1 }, { opacity: 0 }], {
			duration: z.normal,
			delay: a,
			easing: z.exit,
			fill: "forwards"
		}), n.fade.addEventListener("finish", () => this.finish(e, n));
	}
	finish(e, t) {
		t.grow?.cancel(), t.fade?.cancel(), t.wave.remove(), t.element.classList.remove(mX, hX, gX), this.presses.get(e) === t && this.presses.delete(e);
	}
};
function vX(e, t, n) {
	let r = document.createElement("span"), i = document.createElement("span");
	return r.className = f_, r.setAttribute("aria-hidden", "true"), i.className = p_, i.style.setProperty("left", `${e - n}px`), i.style.setProperty("top", `${t - n}px`), i.style.setProperty("width", `${n * 2}px`), i.style.setProperty("height", `${n * 2}px`), r.append(i), {
		wave: r,
		ink: i
	};
}
//#endregion
//#region src/interactions/overlay-scrollbar-engine.ts
var yX = "ui-overlay-scrollbar", bX = "ui-overlay-scrollbar__box", xX = "ui-overlay-scrollbar__thumb", SX = "ui-overlay-scrollbar--shown", CX = "ui-overlay-scrollbar__thumb--held", wX = "ui-overlay-scrollbar__arrow", TX = "ui-overlay-scrollbar--near", EX = "(hover: hover) and (forced-colors: none)", DX = "--ui-overlay-thumb", OX = "--ui-scroll-hung", kX = 12, AX = 2, jX = 24, MX = 12, NX = 80, PX = 40, FX = 400, IX = 50, LX = 900, RX = 400, zX = 16, BX = class {
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
		this.doc = e, this.layer = e.createElement("div"), this.layer.className = yX, this.layer.setAttribute("aria-hidden", "true"), this.layer.setAttribute("popover", "manual"), this.bars = {
			y: this.createBar(e, "y"),
			x: this.createBar(e, "x")
		}, this.layer.addEventListener("mousedown", (e) => e.preventDefault()), this.layer.addEventListener("contextmenu", (e) => e.preventDefault()), e.body.append(this.layer), G_((e) => e.includes(this.bars.y.box) ? this.bars.y.scroller : e.includes(this.bars.x.box) ? this.bars.x.scroller : null), this.media = window.matchMedia(EX), this.active = this.media.matches, this.media.addEventListener("change", () => this.follow()), this.active && this.raise(), e.addEventListener("pointermove", (e) => this.handlePointerMove(e), {
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
		return n.className = `${bX} ${bX}--${t}`, r.className = `${xX} ${xX}--${t}`, n.append(i, r, a), this.layer.append(n), r.addEventListener("pointerdown", (e) => this.grab(e, t)), r.addEventListener("pointermove", (e) => this.pull(e)), r.addEventListener("pointerup", (e) => this.release(e)), r.addEventListener("pointercancel", (e) => this.release(e)), r.addEventListener("lostpointercapture", (e) => this.lose(e)), r.addEventListener("wheel", (e) => this.forwardWheel(e, t), { passive: !1 }), {
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
		return r.className = `${wX} ${wX}--${n < 0 ? "back" : "forward"}`, r.addEventListener("pointerdown", (e) => this.step(e, t, n)), r.addEventListener("pointerup", () => this.stopStepping()), r.addEventListener("pointercancel", () => this.stopStepping()), r.addEventListener("lostpointercapture", () => this.stopStepping()), r.addEventListener("wheel", (e) => this.forwardWheel(e, t), { passive: !1 }), r;
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
		t !== null && (t === this.bars.y.scroller || t === this.bars.x.scroller ? ((this.scrolling || this.drag !== null || this.readerScrolled(e)) && this.flash(), this.schedule(), !this.hovered && this.drag === null && this.settleLater()) : this.hovered || this.drag !== null ? (this.repick = this.hovered && this.drag === null, this.schedule()) : this.readerScrolled(e) && (this.pick(KX(t, "y") ? t : null, KX(t, "x") ? t : null, !1), this.flash(), this.settleLater(), this.schedule()));
	}
	noteInput(e) {
		this.inputAt = e.timeStamp;
	}
	readerScrolled(e) {
		return e.timeStamp - this.inputAt < RX;
	}
	flash() {
		this.scrolling = !0, window.clearTimeout(this.fade), this.fade = window.setTimeout(() => {
			this.fade = 0, this.scrolling = !1, this.paint();
		}, LX), this.paint();
	}
	approach() {
		let e = !1;
		for (let t of [this.bars.y, this.bars.x]) {
			let n = this.point !== null && t.view !== null && VX(this.point, t.view, t.axis, t.rtl);
			e ||= n !== t.near, t.near = n;
		}
		e && this.paint();
	}
	paint() {
		for (let e of [this.bars.y, this.bars.x]) {
			let t = this.drag?.axis === e.axis || this.stepping === e.axis;
			e.box.classList.toggle(SX, e.view !== null && (this.scrolling || e.near || t)), e.box.classList.toggle(TX, e.view !== null && (e.near || t));
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
		}, LX);
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
		e !== null && this.layer.contains(e) || (this.target = e, this.pick(HX(e, "y"), HX(e, "x"), !0));
	}
	measure(e) {
		let t = this.bars[e].scroller;
		if (t === null || !t.isConnected || !KX(t, e)) return null;
		let n = XX(t);
		if (n === null) return null;
		let r = this.bars[e === "y" ? "x" : "y"].scroller === t, i = e === "y" ? YX(t) : qX(t);
		return {
			view: n,
			thumb: QX(t, e, i, r),
			arrows: $X(t, e, i, r),
			rtl: aZ(t)
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
		}), oZ(e.thumb, r, n), e.back.hidden = i === null, e.forward.hidden = i === null, i !== null && (oZ(e.back, i.back, n), oZ(e.forward, i.forward, n));
	}
	step(e, t, n) {
		let r = this.bars[t].scroller;
		if (e.button !== 0 || r === null || this.drag !== null) return;
		UY(r), e.currentTarget.setPointerCapture(e.pointerId), this.stopStepping(), this.stepping = t;
		let i = () => {
			r.isConnected ? (r.scrollBy(t === "y" ? { top: n * PX } : { left: n * PX }), this.flash()) : this.stopStepping();
		};
		i(), this.repeat = window.setTimeout(() => {
			this.repeat = window.setInterval(i, IX);
		}, FX);
	}
	stopStepping() {
		window.clearTimeout(this.repeat), window.clearInterval(this.repeat), this.repeat = 0, this.stepping !== null && (this.stepping = null, this.paint());
	}
	grab(e, t) {
		let n = this.bars[t].scroller;
		if (e.button !== 0 || n === null) return;
		let r = t === "x" && aZ(n), i = tZ(n, t, qX(n), this.bars[t === "y" ? "x" : "y"].scroller === n, r), a = i.length - i.thumb;
		UY(n), this.bars[t].thumb.setPointerCapture(e.pointerId), this.bars[t].thumb.classList.add(CX), this.drag = {
			axis: t,
			scroller: n,
			pointerId: e.pointerId,
			from: t === "y" ? e.clientY : e.clientX,
			scroll: iZ(n, t),
			ratio: a > 0 ? i.max / a : 0,
			rtl: r
		};
	}
	pull(e) {
		let t = this.drag;
		if (t === null || e.pointerId !== t.pointerId || !t.scroller.isConnected) return;
		let n = (t.axis === "y" ? e.clientY : e.clientX) - t.from;
		t.axis === "y" ? t.scroller.scrollTop = rZ(t.scroll, n, t.ratio, !1) : t.scroller.scrollLeft = rZ(t.scroll, n, t.ratio, t.rtl);
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
			e.preventDefault(), t.axis === "y" ? t.scroller.scrollTop = rZ(t.scroll, 0, t.ratio, !1) : t.scroller.scrollLeft = rZ(t.scroll, 0, t.ratio, t.rtl), this.endDrag();
			try {
				this.bars[t.axis].thumb.releasePointerCapture(t.pointerId);
			} catch {}
		}
	}
	endDrag() {
		this.drag !== null && this.bars[this.drag.axis].thumb.classList.remove(CX), this.drag = null, this.paint();
	}
	forwardWheel(e, t) {
		let n = this.bars[t].scroller;
		if (n === null || e.ctrlKey) return;
		let r = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? "y" : "x", i = e.deltaX * GX(e, n, "x"), a = e.deltaY * GX(e, n, "y"), o = UX(n, r, r === "y" ? a : i);
		e.preventDefault(), o !== null && (UY(o), o.scrollBy({
			left: i,
			top: a
		}));
	}
};
function VX(e, t, n, r) {
	return n === "x" ? e.x >= t.left && e.x <= t.right && e.y <= t.bottom && e.y > t.bottom - 28 : e.y < t.top || e.y > t.bottom ? !1 : r ? e.x >= t.left && e.x < t.left + 28 : e.x <= t.right && e.x > t.right - 28;
}
function HX(e, t) {
	for (let n = e; n !== null; n = n.parentElement) if (KX(n, t)) return n;
	return null;
}
function UX(e, t, n) {
	for (let r = e; r !== null; r = HX(r.parentElement, t)) if (KX(r, t) && WX(r, t, n)) return r;
	return null;
}
function WX(e, t, n) {
	let r = t === "y" ? e.scrollHeight - e.clientHeight : e.scrollWidth - e.clientWidth, i = iZ(e, t), a = t === "x" && aZ(e) ? n < 0 : n > 0;
	return n !== 0 && (a ? i < r - 1 : i > 0);
}
function GX(e, t, n) {
	return e.deltaMode === WheelEvent.DOM_DELTA_LINE ? zX : e.deltaMode === WheelEvent.DOM_DELTA_PAGE ? n === "y" ? t.clientHeight : t.clientWidth : 1;
}
function KX(e, t) {
	if ((t === "y" ? e.scrollHeight - e.clientHeight : e.scrollWidth - e.clientWidth) <= 1) return !1;
	let n = e === document.scrollingElement, r = getComputedStyle(n ? document.documentElement : e), i = t === "y" ? r.overflowY : r.overflowX;
	return n ? i !== "hidden" && i !== "clip" : (i === "auto" || i === "scroll") && r.getPropertyValue(DX).trim() !== "none";
}
function qX(e) {
	if (e === document.scrollingElement) return sZ(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
	let t = e.getBoundingClientRect(), n = e instanceof HTMLElement ? e : null, r = JX(t.width, n?.offsetWidth), i = JX(t.height, n?.offsetHeight), a = t.left + e.clientLeft * r, o = t.top + e.clientTop * i;
	return sZ(a, o, a + e.clientWidth * r, o + e.clientHeight * i);
}
function JX(e, t) {
	return t === void 0 || t <= 0 || e <= 0 ? 1 : e / t;
}
function YX(e) {
	let t = qX(e);
	if (e === document.scrollingElement) return t;
	let n = Number.parseFloat(getComputedStyle(e).getPropertyValue(OX));
	return n > 0 ? aZ(e) ? sZ(t.left - n, t.top, t.right, t.bottom) : sZ(t.left, t.top, t.right + n, t.bottom) : t;
}
function XX(e) {
	let t = YX(e);
	for (let n = e; n !== null && n !== document.documentElement; n = n.parentElement) {
		let r = getComputedStyle(n);
		if (n !== e && (r.overflowX !== "visible" || r.overflowY !== "visible") && (t = cZ(t, ZX(n, r))), r.position === "fixed" || n.matches(":popover-open, dialog:modal")) break;
	}
	return t = cZ(t, sZ(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight)), t.width > 0 && t.height > 0 ? t : null;
}
function ZX(e, t) {
	let n = qX(e), r = Number.parseFloat((t.overflowClipMargin ?? "").split(" ").at(-1) ?? "") || 0, i = t.overflowX === "visible" ? Infinity : t.overflowX === "clip" ? r : 0, a = t.overflowY === "visible" ? Infinity : t.overflowY === "clip" ? r : 0;
	return sZ(n.left - i, n.top - a, n.right + i, n.bottom + a);
}
function QX(e, t, n, r) {
	let i = aZ(e), a = tZ(e, t, n, r, i), o = a.max > 0 ? iZ(e, t) / a.max * (a.length - a.thumb) : 0;
	return t === "y" ? {
		left: i ? n.left : n.right - kX,
		top: a.start + o,
		width: kX,
		height: a.thumb
	} : {
		left: i ? a.start + a.length - a.thumb - o : a.start + o,
		top: n.bottom - kX,
		width: a.thumb,
		height: kX
	};
}
function $X(e, t, n, r) {
	let i = aZ(e), a = tZ(e, t, n, r, i);
	if (a.arrow === 0) return null;
	if (t === "y") {
		let e = i ? n.left : n.right - kX;
		return {
			back: {
				left: e,
				top: a.start - MX,
				width: kX,
				height: MX
			},
			forward: {
				left: e,
				top: a.start + a.length,
				width: kX,
				height: MX
			}
		};
	}
	let o = n.bottom - kX;
	return {
		back: {
			left: a.start - MX,
			top: o,
			width: MX,
			height: kX
		},
		forward: {
			left: a.start + a.length,
			top: o,
			width: MX,
			height: kX
		}
	};
}
function eZ(e, t, n, r) {
	return (t === "y" ? e.height : e.width) - r - 4 - (n ? kX : 0) >= NX ? MX : 0;
}
function tZ(e, t, n, r, i) {
	let a = t === "y" ? nZ(e) : {
		top: 0,
		bottom: 0
	}, o = eZ(n, t, r, a.top + a.bottom), s = (t === "y" ? n.top + a.top : n.left) + AX + o + (r && i && t === "x" ? kX : 0), c = (t === "y" ? n.height - a.top - a.bottom : n.width) - 4 - 2 * o - (r ? kX : 0), l = t === "y" ? e.clientHeight : e.clientWidth, u = t === "y" ? e.scrollHeight : e.scrollWidth;
	return {
		start: s,
		length: c,
		thumb: Math.min(c, Math.max(jX, c * l / u)),
		max: u - l,
		arrow: o
	};
}
function nZ(e) {
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
function rZ(e, t, n, r) {
	return r ? -(e - t * n) : e + t * n;
}
function iZ(e, t) {
	return t === "y" ? e.scrollTop : Math.abs(e.scrollLeft);
}
function aZ(e) {
	return getComputedStyle(e).direction === "rtl";
}
function oZ(e, t, n) {
	Object.assign(e.style, {
		left: `${t.left - n.left}px`,
		top: `${t.top - n.top}px`,
		width: `${t.width}px`,
		height: `${t.height}px`
	});
}
function sZ(e, t, n, r) {
	return {
		left: e,
		top: t,
		right: n,
		bottom: r,
		width: Math.max(0, n - e),
		height: Math.max(0, r - t)
	};
}
function cZ(e, t) {
	return sZ(Math.max(e.left, t.left), Math.max(e.top, t.top), Math.min(e.right, t.right), Math.min(e.bottom, t.bottom));
}
//#endregion
//#region src/interactions/refusal-engine.ts
var lZ = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"Home",
	"End",
	"PageUp",
	"PageDown"
]), uZ = [
	"click",
	"dblclick",
	"auxclick",
	"dragstart"
], dZ = `.${Di}, .${Oi}`, fZ = RegExp(`(^|\\s)(${Di}|${Oi})(\\s|$)`), pZ = RegExp(`(^|\\s)${ki}(\\s|$)`), mZ = "[type='range']", hZ = /* @__PURE__ */ new WeakSet(), gZ = /* @__PURE__ */ new WeakSet();
function _Z(e = document) {
	let t = e === document ? window : e;
	for (let e of uZ) t.addEventListener(e, TZ, !0);
	t.addEventListener("keydown", DZ, !0), t.addEventListener("change", OZ, !0), t.addEventListener("pointerdown", kZ, !0), t.addEventListener("mousedown", kZ, !0), SZ(e.querySelectorAll(dZ)), bZ(e.querySelectorAll(`[${Ei}]`)), yZ(e.querySelectorAll(mZ)), new MutationObserver((e) => {
		for (let t of e) vZ(t);
	}).observe(e, {
		subtree: !0,
		childList: !0,
		attributes: !0,
		attributeFilter: ["class", Ei],
		attributeOldValue: !0
	});
}
function vZ(e) {
	if (e.type === "attributes") {
		let t = e.target;
		if (e.attributeName === "data-ui-href") {
			xZ(t, e.oldValue !== null);
			return;
		}
		let n = fZ.test(e.oldValue ?? ""), r = t.matches(dZ);
		n !== r && (CZ(t, r), xZ(t)), pZ.test(e.oldValue ?? "") !== t.matches(".ui-readonly") && yZ(t.querySelectorAll(mZ));
		return;
	}
	let t = (e.target instanceof Element ? e.target : null)?.matches(dZ) === !0;
	for (let n of e.addedNodes) n instanceof Element && (t && wZ(n), n.matches(dZ) && CZ(n, !0), SZ(n.querySelectorAll(dZ)), xZ(n), bZ(n.querySelectorAll(`[${Ei}]`)), yZ([n, ...n.querySelectorAll(mZ)]));
}
function yZ(e) {
	for (let t of e) {
		if (!(t instanceof HTMLInputElement) || t.type !== "range") continue;
		let e = A(t);
		e !== hZ.has(t) && (e ? (hZ.add(t), t.addEventListener("touchstart", kZ, { passive: !1 })) : (hZ.delete(t), t.removeEventListener("touchstart", kZ)));
	}
}
function bZ(e) {
	for (let t of e) xZ(t);
}
function xZ(e, t = !1) {
	let n = e.getAttribute(Ei);
	(n !== null || t) && (e.matches(dZ) ? (e.removeAttribute("href"), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0")) : n === null || !ho(n) ? e.removeAttribute("href") : e.getAttribute("href") !== n && (e.setAttribute("href", n), e.getAttribute("tabindex") === "0" && e.removeAttribute("tabindex")));
}
function SZ(e) {
	for (let t of e) CZ(t, !0);
}
function CZ(e, t) {
	for (let n of e.children) t ? wZ(n) : gZ.has(n) && (gZ.delete(n), n.removeAttribute("inert"));
}
function wZ(e) {
	e.hasAttribute("inert") || (gZ.add(e), e.setAttribute("inert", ""));
}
function TZ(e) {
	e.target instanceof Element && (O(e.target) ? (e.type === "click" && ev(e), AZ(e)) : e.type === "click" && EZ(e.target) && e.preventDefault());
}
function EZ(e) {
	return e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio") && A(e);
}
function DZ(e) {
	e instanceof KeyboardEvent && e.target instanceof Element && ((e.key === "Enter" || e.key === " ") && O(e.target) ? AZ(e) : lZ.has(e.key) && e.target instanceof HTMLInputElement && (e.target.type === "range" || e.target.type === "radio") && A(e.target) && e.preventDefault());
}
function OZ(e) {
	e.target instanceof HTMLInputElement && e.target.type === "range" && A(e.target) && e.stopImmediatePropagation();
}
function kZ(e) {
	e.target instanceof HTMLInputElement && e.target.type === "range" && A(e.target) && (e.preventDefault(), e.target.focus({ preventScroll: !0 }));
}
function AZ(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region src/interactions/popup-service.ts
var jZ = /* @__PURE__ */ new WeakMap(), MZ = /* @__PURE__ */ new WeakSet(), NZ = /* @__PURE__ */ new WeakSet(), PZ = new Qv({
	show: () => void 0,
	hide: ({ popup: e }, t) => {
		let n = jZ.get(e);
		jZ.delete(e), t !== void 0 && n?.(t);
	},
	single: !1,
	isInside: ({ popup: e, anchor: t }, n) => n.includes(e) || t !== void 0 && n.includes(t),
	onPress: !0,
	closesOnTab: ({ popup: e }) => MZ.has(e),
	sheetOnPhone: ({ popup: e }) => NZ.has(e)
});
function FZ(e) {
	return {
		open: (e, t, n) => IZ(e, t, n, (e) => PZ.open(e)),
		openList: LZ,
		listKey: EF,
		followPointer: kF,
		focusReturn: (t) => um(t, e)
	};
}
function IZ(e, t, n, r) {
	let i = n.owner ?? (e instanceof HTMLElement ? e : t), a = () => PZ.popupOf(i) === t;
	return jZ.set(t, n.onDismiss), n.closesOnTab === !0 ? MZ.add(t) : MZ.delete(t), n.sheetOnPhone === !0 ? NZ.add(t) : NZ.delete(t), r({
		owner: i,
		popup: t,
		anchor: e,
		placement: n
	}) || (jZ.delete(t), queueMicrotask(() => n.onDismiss("owner"))), {
		reposition: () => {
			a() && PZ.reposition(i);
		},
		close: () => {
			a() && PZ.close(i);
		}
	};
}
function LZ(e, t, n) {
	return IZ(e, t, {
		...n,
		closesOnTab: !0
	}, (e) => TF(PZ, e, n.entries, n.checked, n.fromEnd, n.focus));
}
//#endregion
//#region src/rendering/series-colors.ts
var RZ = "--ui-color-series-count", zZ = "--ui-color-series-", BZ = 8;
function VZ(e) {
	let t = Number(getComputedStyle(e).getPropertyValue(RZ));
	return Number.isFinite(t) && t >= 1 ? Math.floor(t) : BZ;
}
function HZ(e, t) {
	return `var(${zZ}${e % t + 1})`;
}
var UZ = {
	count: VZ,
	color: HZ
}, WZ = ".ui-items-view", GZ = `:scope > [${b}]`, KZ = `:scope > [${Rt}]`, qZ = "ui-orientation--horizontal", JZ = 1, YZ = [{
	edge: "first",
	holder: `:scope > [${Ut}="${Gt}"]`,
	bound: `${Xe}first-visible-key`,
	attribute: mt
}, {
	edge: "last",
	holder: `:scope > [${Ut}="${Kt}"]`,
	bound: `${Xe}last-visible-key`,
	attribute: ht
}], XZ = class {
	root;
	views = /* @__PURE__ */ new Set();
	waiting = /* @__PURE__ */ new Map();
	sized = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, V(this.root, WZ, { childList: !0 }, (e) => this.findEach(e));
		let t = this.root.querySelectorAll(`[${Ut}="${Gt}"], [${Ut}="${Kt}"]`);
		this.findEach(new Set(Array.from(t, (e) => e.parentElement).filter((e) => e !== null))), this.root.addEventListener("scroll", (e) => this.handleScroll(e), {
			capture: !0,
			passive: !0
		});
	}
	findEach(e) {
		for (let t of e) ZZ(t) ? (this.views.add(t), this.watchHost(t), this.schedule(t)) : this.views.has(t) && this.forget(t);
	}
	watchHost(e) {
		let t = e.querySelector(GZ), n = this.sized.get(e);
		if (n?.host === t) return;
		if (n?.stop(), t === null) {
			this.sized.delete(e);
			return;
		}
		let r = aH(t, () => this.schedule(e)), i = new MutationObserver((n) => {
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
		let t = e.isConnected ? QZ(e) : [];
		if (t.length === 0) {
			this.forget(e);
			return;
		}
		let n = e.querySelector(GZ);
		if (n === null || O(t[0].holder)) return;
		let r = eQ(e, n);
		for (let { holder: e, edge: n, attribute: i } of t) {
			let t = $Z(r, n);
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
function ZZ(e) {
	return QZ(e).length > 0;
}
function QZ(e) {
	let t = [];
	for (let { holder: n, bound: r, edge: i, attribute: a } of YZ) {
		let o = e.querySelector(n);
		o?.hasAttribute(r) === !0 && t.push({
			holder: o,
			edge: i,
			attribute: a
		});
	}
	return t;
}
function $Z(e, t) {
	if (e === null) return null;
	let { rows: n, band: r } = e;
	if (!(r.end - r.start <= JZ)) return (t === "first" ? sQ(n, r) : cQ(n, r)) ?? void 0;
}
function eQ(e, t) {
	let n = e.classList.contains(qZ), r = n && getComputedStyle(t).direction === "rtl", i = [], a = !1;
	for (let e of t.children) {
		let t = e.getAttribute(y);
		if (t === null || e.hasAttribute("data-ui-group-header")) continue;
		a = !0;
		let o = jd(e);
		!e.classList.contains("ui-hidden") && (o.width > 0 || o.height > 0) && i.push({
			key: t,
			...tQ(o, n, r)
		});
	}
	return a ? {
		rows: i,
		band: nQ(t, n, r)
	} : null;
}
function tQ(e, t, n) {
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
function nQ(e, t, n) {
	let r = Ed(e), i = tQ(rQ(r, getComputedStyle(r)), t, n);
	for (let e = r.parentElement; e !== null; e = e.parentElement) {
		let r = getComputedStyle(e);
		(t ? r.overflowX : r.overflowY) !== "visible" && (i = aQ(i, tQ(rQ(e, null), t, n)));
	}
	return i = aQ(i, tQ({
		left: 0,
		top: 0,
		right: window.innerWidth,
		bottom: window.innerHeight
	}, t, n)), oQ(e, i, t, n);
}
function rQ(e, t) {
	let n = e.getBoundingClientRect(), r = n.left + e.clientLeft, i = n.top + e.clientTop;
	return {
		left: r + iQ(t?.paddingLeft),
		top: i + iQ(t?.paddingTop),
		right: r + e.clientWidth - iQ(t?.paddingRight),
		bottom: i + e.clientHeight - iQ(t?.paddingBottom)
	};
}
function iQ(e) {
	let t = e === void 0 ? NaN : parseFloat(e);
	return Number.isFinite(t) ? t : 0;
}
function aQ(e, t) {
	return {
		start: Math.max(e.start, t.start),
		end: Math.min(e.end, t.end)
	};
}
function oQ(e, t, n, r) {
	let i = t.start;
	for (let t of e.querySelectorAll(KZ)) {
		let e = tQ(t.getBoundingClientRect(), n, r);
		e.start <= i + JZ && e.end > i && getComputedStyle(t).position === "sticky" && (i = e.end);
	}
	return {
		start: i,
		end: t.end
	};
}
function sQ(e, t) {
	for (let n of e) if (lQ(n, t)) return n.key;
	return null;
}
function cQ(e, t) {
	for (let n = e.length - 1; n >= 0; n--) if (lQ(e[n], t)) return e[n].key;
	return null;
}
function lQ(e, t) {
	return e.key.length > 0 && e.end > t.start + JZ && e.start < t.end - JZ;
}
//#endregion
//#region src/items/item-rows.ts
function uQ(e, t, n) {
	return {
		itemOf: (e) => t.getItemValue(e),
		itemsOf: (e) => n.itemsOf(e),
		itemsVersion: (e) => n.itemsVersion(e),
		readPath: qA,
		renderVariant: (n, r, i) => {
			let a = e.getVariantTemplate(r, i), o = t.getItemScope(n);
			return a === void 0 || o === void 0 ? null : t.renderFromTemplate(a, o.item, t.getAncestorStack(n));
		},
		isKeyTarget: (e) => jf(e) !== null,
		cellsOf: (e) => {
			let t = e.closest(F);
			return t !== null && Vf(t) ? Wf(t, e) : [];
		},
		moveCursor: (e, t) => np(e, t ?? null)
	};
}
//#endregion
//#region src/updates/shown-words.ts
function dQ(e, t) {
	let n = ba(e.kind);
	return n === "Markup" ? !t.hasAttribute(qi) : n === "Attribute" && e.name === "data-ui-tooltip" ? !t.hasAttribute(Ve) : e.converter === Mw;
}
var fQ = class {
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
function pQ(e, t) {
	return E(e) ? new fQ(e, t) : null;
}
//#endregion
//#region src/items/items-template-renderer.ts
var mQ = class {
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
		let c = this.metadata.getItemsTemplateMetadata(e), l = c?.itemWrapperElementName ? vQ(o, c.itemWrapperElementName, c.itemWrapperClassName ?? null, c.itemWrapperRole ?? null) : o;
		l !== o && this.moveItemScope(o, l), yQ(l, n, t);
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
		let i = _Q(r.item, t, n);
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
			gQ(n, e) && this.applyBoundAttribute(i, n, e, t);
		}
	}
	findTranslatableRowBindings() {
		let e = [];
		for (let t of this.metadata.metadata.bindings) {
			let n = this.metadata.getPropertyDefinition(t.propertyId);
			if (n === void 0 || typeof t.itemTemplate != "string" || !this.metadata.isTranslatable(t)) continue;
			let r = w(t.bindingId);
			e.push([t, `[${Xe}${ra(n.propertyName)}="${S(r)}"]`]);
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
		let r = wQ(t, n.templateKeyPropertyName);
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
		a === void 0 || r && (hQ(a) || !this.state.has(a, [])) || UA(e, a.itemTemplateParameters, n) || this.applyBoundAttribute(e, a, n);
	}
	applyBoundAttribute(e, t, n, r) {
		let i = w(t.bindingId), a = this.metadata.getPropertyDefinition(t.propertyId);
		if (a === void 0) return;
		let o = hQ(t) ? HA(n, t.itemTemplate, t.itemTemplateParameters) : this.state.has(t, []) ? {
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
		let u = gl(l, () => this.metadata.isTranslatable(t) && !WA(c)), d = pQ(l, this.extensions.converters), f = w(t.componentId), p = e.closest(this.componentSelector(f));
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
			let n = oa(p, t, () => [e])[0] ?? null;
			n !== null && (d !== null && dQ(t, n) ? this.operations.apply({
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
		return t === void 0 && (t = `[${ie}="${e}"]`, this.componentSelectors.set(e, t)), t;
	}
};
function hQ(e) {
	return e.itemTemplate !== null && e.itemTemplate !== void 0;
}
function gQ(e, t) {
	for (let n of e.itemTemplateParameters ?? []) {
		let e = w(n.componentId);
		if (e > 0 && !t.some((t) => t.scopeComponentId === e)) return !1;
	}
	return !0;
}
function _Q(e, t, n) {
	if (t.length === 0) return n;
	let r = e;
	for (let n = 0; n < t.length - 1; n++) {
		let i = t[n], a = i.kind === "property" ? JA(r, i.name) : $A(r, i.key);
		if (!a.ok) return e;
		r = a.value;
	}
	if (typeof r != "object" || !r) return e;
	let i = t[t.length - 1];
	if (i.kind === "element") return ej(r, i.key, n), e;
	let a = r;
	return a[XA(a, i.name)] = n, e;
}
function vQ(e, t, n, r) {
	let i = document.createElement(t);
	return n !== null && (i.className = n), r !== null && r.length > 0 && i.setAttribute("role", r), i.appendChild(e), i;
}
function yQ(e, t, n) {
	e.setAttribute(y, t), CQ(e, n), xQ(e, n);
}
var bQ = [
	["CanSelect", se],
	["CanDrag", ce],
	["CanRemove", le],
	["CanRename", ue],
	["CanShowContextMenu", de]
];
function xQ(e, t) {
	for (let [n, r] of bQ) {
		let i = JA(t, n);
		e.toggleAttribute(r, i.ok && i.value === !1);
	}
}
function SQ(e, t) {
	let n = e.getAttribute(y), r = e.closest(`[${b}]`);
	if (xQ(e, t), n !== null) for (let i of e.querySelectorAll(`[${y}="${S(n)}"]`)) i.closest("[data-ui-items-host]") === r && xQ(i, t);
}
function CQ(e, t) {
	let n = JA(t, "Group");
	n.ok && typeof n.value == "string" ? e.setAttribute(Bt, n.value) : e.removeAttribute(Bt);
}
function wQ(e, t) {
	if (t == null || t.trim().length === 0) return null;
	let n = JA(e, t);
	return !n.ok || n.value === null || n.value === void 0 ? null : typeof n.value == "string" ? n.value : String(n.value);
}
//#endregion
//#region src/items/items-rule-watcher.ts
var TQ = "Group", EQ = class {
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
			let n = w(t.componentId), r = [...t.filters, ...t.sorts], i = () => this.syncComponentHosts(n);
			for (let t of r) t.source !== null && t.source !== void 0 && e.reactiveSources.watch(t.source, i);
		}
		e.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), e.root.addEventListener("dragend", () => this.land(), !0), e.root.addEventListener("focusout", () => this.handleFocusOut(), !0), V(e.root, `[${Ut}="${Wt}"]`, { attributeFilter: [pt] }, (e) => {
			for (let t of e) {
				let e = Za(t);
				e !== null && this.syncComponentHosts(e);
			}
		}), V(e.root, `[${qt}="windowed"]`, { attributeFilter: [sn] }, (e) => {
			for (let t of e) {
				let e = Za(t);
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
			for (let [t, n] of e) t.isConnected && ZK(t, n, this.options);
		});
	}
	handleFocusOut() {
		this.readerHeld.size !== 0 && window.setTimeout(() => {
			for (let [e, t] of [...this.readerHeld]) DQ(t.row) || (this.readerHeld.delete(e), e.isConnected && this.sync(e, t.componentId));
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
		for (let e of t) !n.some((t) => OQ(t, e)) && !this.readElsewhere(e) && this.handleItemValueChange(e);
	}
	readElsewhere(e) {
		let t = w(e.reference.componentId), n = `${t}:${e.reference.propertyId}`, r = this.readElsewhereByEdit.get(n);
		if (r !== void 0) return r;
		let i = this.options.metadata.getBindingByComponentAndPropertyId(t, e.reference.propertyId), a = i === void 0 ? null : QA(i), o = a === null ? void 0 : this.findItemRootsAbove(e, a)[0] ?? this.findAddressedItemRoots(e.dynamicParameters).find((t) => e.components.some((e) => t.contains(e)));
		if (a === null || o === void 0) return !1;
		let s = this.readsPathElsewhere(o, t, e.reference.propertyId, a);
		return this.readElsewhereByEdit.set(n, s), s;
	}
	readsPathElsewhere(e, t, n, r) {
		for (let i of [e, ...e.querySelectorAll("*")]) for (let a of i.getAttributeNames()) {
			if (!a.startsWith("data-ui-bind-")) continue;
			let o = this.options.metadata.getBindingById(Number(i.getAttribute(a))), s = o === void 0 ? null : QA(o);
			if (!(o === void 0 || s === null || w(o.componentId) === t && o.propertyId === n) && (s.scopeComponentId <= 0 || s.scopeComponentId === r.scopeComponentId) && kQ(s.steps, r.steps) && this.findItemRoot(i, 0) === e) return !0;
		}
		return !1;
	}
	handleItemValueChange(e) {
		if (e.dynamicParameters.length === 0) return;
		let t = this.options.metadata.getBindingByComponentAndPropertyId(w(e.reference.componentId), e.reference.propertyId), n = t === void 0 ? null : QA(t);
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
			let a = i.closest(x);
			a !== null && this.drawsPatchedComponent(a, w(e.reference.componentId), t) && AQ(a, e.dynamicParameters) && (r = this.applyVirtualizedValue(i, T(a), n, t, e.value) || r);
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
		let r = this.readerHeld.get(e)?.row ?? null, i = n !== null && DQ(n) ? n : r !== null && DQ(r) ? r : null;
		i === null ? (this.readerHeld.delete(e), ZK(e, t, this.options)) : this.readerHeld.set(e, {
			componentId: t,
			row: i
		});
	}
	findAddressedItemRoots(e) {
		let t = e[e.length - 1];
		return typeof t == "string" ? [...this.options.root.querySelectorAll(`[${y}="${S(t)}"]`)].filter((t) => this.isItemRoot(t) && Va(t, e)) : [];
	}
	applyItemValue(e, t, n) {
		let r = e.closest(`[${b}]`), i = r === null ? null : Za(r);
		if (r !== null && i !== null && _A(r) === "virtualized") {
			let a = e.getAttribute(y);
			a !== null && this.applyVirtualizedValue(r, i, a, t, n);
			return;
		}
		this.options.renderer.updateItemValue(e, t.steps, n);
		let a = jQ(TQ, t);
		a && CQ(e, this.options.renderer.getItemValue(e)), this.restampAbilities(e, t), r !== null && i !== null && (a || this.feedsRule(r, i, t)) && this.sync(r, i, e);
	}
	restampAbilities(e, t) {
		bQ.some(([e]) => jQ(e, t)) && SQ(e, this.options.renderer.getItemValue(e));
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
		if (this.options.templates.getGroupTemplate(t) !== void 0 && jQ(TQ, n)) return !0;
		let r = this.options.metadata.getItemsFilterSortMetadata(t);
		if (r !== void 0 && (r.filters.some((e) => jQ(e.itemProperty, n)) || r.sorts.some((e) => jQ(e.itemProperty, n)))) return !0;
		let i = rj(e);
		return (i?.filters ?? []).some((e) => jQ(e.itemProperty, n)) || (i?.sorts ?? []).some((e) => jQ(e.itemProperty, n));
	}
	syncComponentHosts(e) {
		for (let t of this.options.root.querySelectorAll(`[${b}]`)) {
			let n = Za(t);
			n === e && this.sync(t, n);
		}
	}
};
function DQ(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t);
}
function OQ(e, t) {
	let n = Ta(e), r = n === "Value" ? !gm(e.value ?? null, t.value) : n === "Validation" && (e.message ?? null) !== null, i = e.address, a = i?.component?.dynamicParameters ?? [];
	return r && w(i?.component?.id) === w(t.reference.componentId) && wa(i?.property) === t.propertyName && a.length <= t.dynamicParameters.length && a.every((e, n) => String(e ?? "") === String(t.dynamicParameters[n] ?? ""));
}
function kQ(e, t) {
	let n = Math.min(e.length, t.length);
	for (let r = 0; r < n; r++) {
		let n = e[r], i = t[r];
		if (n.kind === "property" ? i.kind !== "property" || n.name !== i.name : i.kind !== "element" || !gm(n.key, i.key)) return !1;
	}
	return !0;
}
function AQ(e, t) {
	let n = Ba(e, za(e));
	return t.length === n.length + 1 && n.every((e, n) => String(e ?? "") === String(t[n] ?? ""));
}
function jQ(e, t) {
	let n = t.ruleSegments.join(".");
	return n.length === 0 || e === n || e.startsWith(`${n}.`);
}
//#endregion
//#region src/items/table-row-indices.ts
var MQ = "ui-table", NQ = "ui-table--no-header";
function PQ(e, t, n) {
	let r = e.parentElement, i = r?.parentElement ?? null;
	if (r === null || i === null || !r.classList.contains("ui-table__scroll") || !i.classList.contains(MQ)) return;
	let a = [], o = [], s = !1;
	for (let t of r.children) t === e ? s = !0 : t.getAttribute("role") === "row" && !(t === r.firstElementChild && i.classList.contains(NQ)) && (s ? o : a).push(t);
	a.forEach((e, t) => FQ(e, t));
	for (let [e, n] of t) FQ(e, a.length + n);
	n !== null && o.forEach((e, t) => FQ(e, a.length + n + t)), C(i, "aria-rowcount", n === null ? "-1" : String(a.length + n + o.length));
}
function FQ(e, t) {
	C(e, "aria-rowindex", String(t + 1));
}
//#endregion
//#region src/items/items-window-engine.ts
var IQ = 50, LQ = 1, RQ = .5, zQ = 60, BQ = "--ui-window-look", VQ = "--ui-window-row", HQ = "--ui-window-tile", UQ = 3, WQ = "page", GQ = class {
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
			this.noteShownRow(t), this.layout(t), i$(t) === 0 ? this.getState(t).pending || this.requestAsync(t, a$(t), 0, null, !1) : n ? this.revealWindow(t) : (this.realign(t), this.considerRequest(t));
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
		t !== null && (kd(e, t), this.noteShownRow(e));
	}
	windowTop(e) {
		if (e.hasAttribute("data-ui-window-paged")) return null;
		let t = yA(e, nn);
		return t !== null && qY(e) && bA(e, "data-ui-window-more-after") ? Math.max(0, this.windowBottom(e, t) - Od(e).height) : t === null || t === 0 ? null : bA(e, "data-ui-window-more-after") ? t * this.getState(e).itemSize : e.scrollHeight;
	}
	windowBottom(e, t) {
		let n = r$(e), r = this.getState(e).itemSize, i = n.length === 0 ? 0 : jd(n[n.length - 1]).bottom - jd(n[0]).top;
		return t * r + (i > 0 ? i : n.length * r);
	}
	noteShownRow(e) {
		this.getState(e).shown = t$(e, r$(e));
	}
	noteShownRows() {
		for (let e of this.held) e.isConnected ? e.hasAttribute("data-ui-window-paged") || this.noteShownRow(e) : this.held.delete(e);
	}
	sync(e) {
		if (e.length !== 0) for (let t of this.hosts()) e.some((e) => e.contains(t) || t.contains(e)) && (this.layout(t), !this.getState(t).pending && (i$(t) === 0 && e.some((e) => t.contains(e)) ? this.requestAsync(t, a$(t), 0, null, !1) : this.realign(t)));
	}
	realign(e) {
		let t = yA(e, nn), n = r$(e);
		if (t === null || n.length === 0 || e.hasAttribute("data-ui-window-paged")) return;
		let r = this.getState(e), i = Od(e), a = Math.floor(i.top / r.itemSize);
		Math.ceil((i.top + i.height) / r.itemSize) >= t && a <= t + n.length || this.revealWindow(e);
	}
	refilled(e) {
		let t = this.states.get(e);
		t !== void 0 && !t.pending && JQ(t);
	}
	reconsider() {
		for (let e of this.hosts()) this.noteShownRow(e), this.considerRequest(e);
	}
	async requestOffsetAsync(e, t) {
		_A(e) === "windowed" && await this.requestAsync(e, "Offset", Math.max(0, Math.floor(t)), null, !1);
	}
	hosts() {
		return [...this.root.querySelectorAll(`[${b}][${qt}="windowed"]`)];
	}
	handleScroll(e) {
		let t = Dd(e.target);
		if (t === null || _A(t) !== "windowed" || t.hasAttribute("data-ui-window-paged")) return;
		let n = this.getState(t);
		n.scheduled === 0 && (this.considerRequest(t), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.considerRequest(t);
		}, zQ));
	}
	considerRequest(e) {
		let t = this.getState(e);
		if (t.pending) {
			t.restless = !0;
			return;
		}
		if (e.hasAttribute("data-ui-window-paged") && i$(e) > 0) return;
		let n = r$(e);
		if (n.length === 0) {
			this.requestAsync(e, a$(e), 0, null, !1);
			return;
		}
		let r = yA(e, nn), i = bA(e, an), a = bA(e, on);
		if (r !== null) {
			let o = this.windowSize(e), s = Od(e), c = Math.max(1, Math.round(s.height * LQ / t.itemSize), Math.floor(o * RQ)), l = Math.floor(s.top / t.itemSize), u = Math.ceil((s.top + s.height) / t.itemSize);
			if (u < r || l > r + n.length) {
				this.requestAsync(e, "Offset", this.landingOffset(e, l, o), null, !1);
				return;
			}
			if (l - c <= r && i) {
				this.requestAsync(e, "Before", 0, o$(n[0]), !0);
				return;
			}
			if (u + c >= r + n.length && a) {
				this.requestAsync(e, "After", 0, o$(n[n.length - 1]), !0);
				return;
			}
			return;
		}
		let o = Od(e), s = Math.max(1, o.height * LQ), c = o.contentHeight - o.top - o.height;
		o.top <= s && i ? this.requestAsync(e, "Before", 0, o$(n[0]), !0) : c <= s && a && this.requestAsync(e, "After", 0, o$(n[n.length - 1]), !0);
	}
	landingOffset(e, t, n) {
		let r = Math.max(0, t - Math.floor(n / 4)), i = yA(e, rn);
		return i === null ? r : Math.min(r, Math.max(0, i - n));
	}
	async requestAsync(e, t, n, r, i) {
		let a = Za(e);
		if (a === null) {
			s("a windowed items host is not inside an addressable component.", e);
			return;
		}
		if (r === null && (t === "Before" || t === "After")) return;
		let o = this.getState(e);
		o.pending = !0, o.readingBefore = t === "Before", (t === "Start" || t === "End") && JQ(o);
		let c = e.closest(x), l = t.toLowerCase();
		e.setAttribute($t, l), c?.setAttribute($t, e.hasAttribute("data-ui-window-paged") ? WQ : l), e.setAttribute("aria-busy", "true"), t === "After" && yA(e, "data-ui-window-total") === null && YQ(e) && (RK(e, IK, UQ * this.rowSize(e)), XQ(e, o));
		let u = yA(e, nn) === null;
		try {
			await this.options.requestWindow({
				componentId: a,
				dynamicParameters: s$(e),
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
			o.pending = !1, e.removeAttribute($t), c?.removeAttribute($t), e.removeAttribute("aria-busy"), RK(e, IK, 0), this.noteShownRow(e), this.layout(e), o.readingBefore = !1;
			let n = o.restless;
			o.restless = !1, (n || u && QQ(e, t, r)) && i$(e) > 0 ? this.considerRequest(e) : this.realign(e);
		}
	}
	layout(e) {
		let t = this.getState(e), n = r$(e), r = yA(e, rn), i = yA(e, nn);
		if (PQ(e, n.map((e, t) => [e, (i ?? 0) + t]), r), e.hasAttribute("data-ui-window-paged")) {
			RK(e, "top", 0), RK(e, FK, 0);
			return;
		}
		if (n.length > 0) {
			let r = jd(n[n.length - 1]).bottom - jd(n[0]).top;
			if (r > 0) {
				let i = KQ(n), a = Math.ceil(n.length / i);
				e.clientWidth !== t.measuredWidth && (JQ(t), t.measuredWidth = e.clientWidth), qQ(t, n, i), t.skeletonRow = a > 1 ? (jd(n[n.length - 1]).top - jd(n[0]).top) / (a - 1) : r, t.skeletonTile = i > 1 ? jd(n[1]).left - jd(n[0]).left : null;
			}
		}
		let a = r === null || i === null ? 0 : i * t.itemSize, o = r === null || i === null ? 0 : Math.max(0, r - i - n.length) * t.itemSize;
		RK(e, "top", a), RK(e, FK, o), XQ(e, t), (t.readingBefore || !$Q(e)) && e$(e, n, t.shown), PY(e);
	}
	rowSize(e) {
		let t = this.getState(e);
		return t.skeletonRow > 0 ? ZQ(t.skeletonRow) : t.itemSize;
	}
	windowSize(e) {
		let t = yA(e, tn);
		return t !== null && t > 0 ? t : IQ;
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
function KQ(e) {
	let t = jd(e[0]).top, n = 1;
	for (; n < e.length && jd(e[n]).top === t;) n++;
	return n;
}
function qQ(e, t, n) {
	for (let r = 0; r < t.length; r++) {
		let i = t[r + n], a = i === void 0 ? t.length <= n ? jd(t[r]).height : 0 : jd(i).top - jd(t[r]).top;
		if (a <= 0) continue;
		let o = a / n;
		HK(e.sizes, e.shares.get(t[r]) ?? null, o), e.shares.set(t[r], o);
	}
	e.sizes.count > 0 && (e.itemSize = Math.max(1, e.sizes.sum / e.sizes.count));
}
function JQ(e) {
	e.shares = /* @__PURE__ */ new WeakMap(), e.sizes = {
		sum: 0,
		count: 0
	};
}
function YQ(e) {
	return getComputedStyle(e).getPropertyValue(BQ).trim() === "skeleton";
}
function XQ(e, t) {
	if (t.skeletonRow <= 0) return;
	let n = `${ZQ(t.skeletonRow)}px`, r = t.skeletonTile !== null && t.skeletonTile > 0 ? `${ZQ(t.skeletonTile)}px` : "";
	for (let t of e.querySelectorAll(`:scope > [${Qt}]`)) {
		let e = t.style;
		e.getPropertyValue(VQ) !== n && e.setProperty(VQ, n), e.getPropertyValue(HQ) !== r && (r.length === 0 ? e.removeProperty(HQ) : e.setProperty(HQ, r));
	}
}
function ZQ(e) {
	return Math.round(e * 100) / 100;
}
function QQ(e, t, n) {
	let r = r$(e), i = t === "Before" ? r[0] : t === "After" ? r[r.length - 1] : void 0;
	return i !== void 0 && o$(i) !== n;
}
function $Q(e) {
	let t = yA(e, nn);
	return Od(e).top <= 0 && (t === null ? !bA(e, "data-ui-window-more-before") : t === 0);
}
function e$(e, t, n) {
	let r = n === null ? void 0 : t.find((e) => o$(e) === n.key);
	if (n === null || r === void 0) return;
	let i = jd(r);
	if (i.height <= 0) return;
	let a = Od(e).top, o = i.top - n$(e) + a - n.at;
	Math.abs(o) >= .5 && kd(e, a + o);
}
function t$(e, t) {
	let n = n$(e), r = 0, i = t.length;
	for (; r < i;) {
		let e = Math.floor((r + i) / 2);
		jd(t[e]).bottom > n ? i = e : r = e + 1;
	}
	let a = t.at(r), o = a === void 0 ? null : o$(a);
	if (a === void 0 || o === null) return null;
	let s = jd(a), c = Od(e);
	return s.height <= 0 || s.top >= n + c.height ? null : {
		key: o,
		at: s.top - n + c.top
	};
}
function n$(e) {
	let t = Ed(e);
	return t.getBoundingClientRect().top + t.clientTop;
}
function r$(e) {
	return [...e.children].filter((e) => e.hasAttribute(y));
}
function i$(e) {
	return r$(e).length;
}
function a$(e) {
	return qY(e) ? "End" : "Start";
}
function o$(e) {
	return e.getAttribute(y);
}
function s$(e) {
	let t = e.closest(x);
	return t === null ? [] : Ba(t, za(t));
}
//#endregion
//#region src/items/items-composite-renderer.ts
var c$ = [
	ie,
	ae,
	oe
];
function l$(e, t, n, r, i, a, o) {
	let c = document.createElement(e.itemElementName);
	c.className = e.itemClassName, u$(c, e.itemRole);
	let l = f$(c, e, t, a);
	l !== 0 && o.populateElement(c, n, l, i);
	for (let l of e.slots) {
		let e = d$(l, t, n, a);
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
		d.className = l.wrapperClassName, u$(d, l.wrapperRole);
		for (let [e, t] of Object.entries(l.wrapperAttributes ?? {})) d.setAttribute(e, t);
		d.appendChild(u), yQ(d, r, n), c.appendChild(d);
	}
	return yQ(c, r, n), o.registerItemScope(c, l, n), c;
}
function u$(e, t) {
	t != null && t.length > 0 && e.setAttribute("role", t);
}
function d$(e, t, n, r) {
	let i = wQ(n, e.variantKeyPropertyName);
	if (i !== null && i.length > 0) {
		let n = r.getVariantTemplate(t, `${e.variantKey}:${i}`);
		if (n !== void 0) return n;
	}
	return r.getVariantTemplate(t, e.variantKey);
}
function f$(e, t, n, r) {
	let i = t.hostSlotVariantKey;
	if (i == null || i.length === 0) return 0;
	let a = r.getVariantTemplate(n, i)?.content.firstElementChild ?? null;
	if (a === null) return s("composite item host slot template was not found.", {
		componentId: n,
		hostSlotVariantKey: i
	}), 0;
	for (let t of c$) {
		let n = a.getAttribute(t);
		n !== null && e.setAttribute(t, n);
	}
	for (let t of Array.from(a.attributes)) t.name.startsWith("data-ui-bind-") && e.setAttribute(t.name, t.value);
	return e instanceof HTMLElement && (e.style.alignSelf = "stretch", e.style.justifySelf = "stretch"), T(a);
}
//#endregion
//#region src/items/items-row-renderer.ts
function p$(e, t, n, r, i) {
	let a = i.metadata.getItemsTemplateMetadata(e), o = a?.composite;
	if (o == null) return m$(i.renderer.renderItem(e, t, n, r), a);
	let s = l$(o, e, t, n, r, i.templates, i.renderer);
	return s !== null && a?.rowDecorator && i.renderer.decorateRow(a.rowDecorator, s, t, n, e, r), m$(s, a);
}
function m$(e, t) {
	return e === null ? null : (t?.announcesSelection === !0 && !e.hasAttribute("aria-selected") && e.setAttribute("aria-selected", "false"), yl(e), e);
}
//#endregion
//#region src/items/items-virtualization-engine.ts
var h$ = 6, g$ = 60, _$ = class {
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
		return r === void 0 || i < 0 || a < 0 ? null : r.slice(Math.min(i, a), Math.max(i, a) + 1).filter((e) => x$(e.entry) === !1).map((e) => e.entry.key);
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
		if (!T$(e) && !C$(e)) return a.element;
		let o = getComputedStyle(e), s = O$(o), c = r.projected.map((e) => this.pitchOf(r, e) + s), l = T$(e) ? E$(r.projected, c, r.across) : null, u = l === null ? i : w$(l.starts, i), d = l?.pitches ?? c, f = k$(o.paddingTop) + A$(d, 0, u), p = f + d[u] - s, m = Od(e), h = n === "start" || n === "nearest" && f < m.top ? f : n === "end" || p > m.top + m.height ? p - m.height : null;
		return h !== null && kd(e, Math.max(0, h)), this.layout(e, r), a.element;
	}
	sync(e) {
		let t = this.getState(e);
		if (t === null) return;
		let n = qY(e) && YY(e), r = t.projected;
		this.project(e, t), this.keepCursorShown(e, t, r), this.layout(e, t), n && !YY(e) && (kd(e, e.scrollHeight), this.layout(e, t));
	}
	refill(e, t) {
		let n = this.getState(e);
		if (n === null) return [];
		let r = new Map(n.byKey), i = [], a = /* @__PURE__ */ new Map(), o = [];
		for (let { key: n, item: s } of t) {
			let t = r.get(n);
			if (r.delete(n), t !== void 0 && gm(t.item, s)) {
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
		return t === null ? null : v$(t) ? (this.keptAsDrawn.add(t), t) : (this.dropRow(e, t), null);
	}
	dropRow(e, t) {
		if (t === null) return;
		let n = _p(t);
		t.remove(), vp(e, null, n);
	}
	keepCursorShown(e, t, n) {
		let r = gp(e), i = t.entries.find((e) => e.element?.hasAttribute("data-ui-row-focus") === !0) ?? null, a = i?.key ?? (r === null ? null : bp(r));
		if (r === null || a === null) return;
		let o = /* @__PURE__ */ new Set();
		for (let e of t.projected) e.header || o.add(e.entry.key);
		if (o.has(a)) return;
		let s = n.filter((e) => !e.header).map((e) => e.entry), c = s.findIndex((e) => e.key === a), l = c < 0 ? void 0 : s.slice(c + 1).find((e) => o.has(e.key)) ?? s.slice(0, c).reverse().find((e) => o.has(e.key));
		i?.element?.removeAttribute(Pe), l === void 0 ? (r.removeAttribute(Fe), r.removeAttribute("aria-activedescendant")) : l.element instanceof HTMLElement ? zf(r, G(e).filter((e) => e instanceof HTMLElement), l.element, null, !1) : (r.setAttribute(Fe, l.key), r.removeAttribute("aria-activedescendant"));
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
		let a = gp(e), o = a === null || i.size === 0 ? null : fp(a, G(e), i);
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
		return i === null || a === void 0 ? !1 : (a.item = _Q(a.item, n, r), i.version++, n.length === 0 && (a.element = this.renewRow(e, a.element)), !0);
	}
	project(e, t) {
		let n = this.options.metadata.getItemsFilterSortMetadata(t.componentId), r = rj(e), i = this.options.templates.getGroupTemplate(t.componentId), a = lj(n, this.options.state, r), o = t.entries;
		if (t.version++, (n !== void 0 && n.filters.length > 0 || (r?.filters ?? []).length > 0) && (o = o.filter((e) => sj(n, e.item, this.options.state, r))), !(i !== void 0 && o.some((e) => S$(e) !== ""))) {
			a.length > 0 && (o = [...o].sort((e, t) => dj(e.item, t.item, a))), t.projected = o.map((e) => ({
				entry: e,
				header: !1
			}));
			return;
		}
		let { buckets: s, order: c } = jK(o, S$), l = [];
		for (let e of c) {
			let t = s.get(e);
			a.length > 0 && (t = [...t].sort((e, t) => dj(e.item, t.item, a))), e !== "" && l.push({
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
		let t = Dd(e.target);
		t !== null && _A(t) === "virtualized" && this.relayout(t);
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
			e.isConnected && _A(e) === "virtualized" ? window.requestAnimationFrame(() => this.relayout(e)) : this.resizes?.unobserve(e);
		}
	}
	relayout(e) {
		let t = this.getState(e);
		t !== null && t.scheduled === 0 && (this.layout(e, t), t.scheduled = window.setTimeout(() => {
			t.scheduled = 0, this.layout(e, t);
		}, g$));
	}
	layout(e, t) {
		let n = t.projected, r = getComputedStyle(e), i = O$(r), a = n.map((e) => this.pitchOf(t, e) + i), o = n.length, s = t.across, c = T$(e) ? E$(n, a, s) : null, l = c?.pitches ?? a, u = l.length, d = 0, f = u;
		if ((c !== null || C$(e)) && u > 0) {
			let i = k$(r.paddingTop), a = Od(e), o = y$(e, t, n, l, s, a.top - i, i), c = o + a.height, p = 0;
			d = u;
			for (let e = 0; e < u; e++) {
				let t = p + l[e];
				if (d === u && t > o && (d = e), p >= c) {
					f = e;
					break;
				}
				p = t;
			}
			d === u && (d = Math.max(0, u - 1)), d = Math.max(0, d - h$), f = Math.min(u, f + h$);
		}
		let p = c === null ? d : c.starts[d] ?? o, m = c === null ? f : f < u ? c.starts[f] : o, h = this.options.renderer.getAncestorStack(e), g = [], _ = [], v = -1, ee = !1, te = document.activeElement, ne = null;
		for (let r = 0; r < o; r++) {
			let i = n[r];
			i.header || v++;
			let a = r >= p && r < m, o = (i.header ? t.headers.get(S$(i.entry)) ?? null : i.entry)?.element ?? null, s = o !== null && te !== null && o.contains(te);
			if (o !== null && !s && this.keptAsDrawn.has(o) && (this.keptAsDrawn.delete(o), this.dropRow(e, o), b$(t, i, null), o = null, ee = !0), !a) {
				if (o !== null && !i.header && s) {
					ne = {
						element: o,
						line: c === null ? r : w$(c.starts, r)
					}, _.push([o, v]);
					continue;
				}
				o !== null && (this.dropRow(e, o), b$(t, i, null), ee = !0);
				continue;
			}
			if (o !== null) {
				i.header && PK(o, i.entry.key), g.push(o), i.header || _.push([o, v]);
				continue;
			}
			let l = i.header ? this.renderHeader(t, i.entry, h) : this.renderRow(t, i.entry, h);
			l !== null && (i.header || yp(e, l), b$(t, i, l), g.push(l), i.header || _.push([l, v]), ee = !0);
		}
		let re = new Set(g);
		ne !== null && re.add(ne.element);
		for (let n of t.entries) n.element !== null && !re.has(n.element) && (this.dropRow(e, n.element), n.element = null, ee = !0);
		for (let t of G(e)) re.has(t) || (this.dropRow(e, t), ee = !0);
		for (let t of e.querySelectorAll(`:scope > [${Rt}]`)) re.has(t) || (t.remove(), ee = !0);
		for (let e of t.headers.values()) e.element !== null && !re.has(e.element) && (e.element = null);
		let ie = ne !== null && ne.line < d ? ne : null, ae = ne !== null && ne.line >= f ? ne : null, oe = A$(l, 0, ie?.line ?? d), y = A$(l, ae === null ? f : ae.line + 1, u), se = ne === null ? 0 : ie === null ? A$(l, f, ne.line) : A$(l, ie.line + 1, d), ce = VK(e, se > 0 ? se - i : 0);
		UK(e, [...ie === null ? ae === null ? g : [
			...g,
			...PA(ce),
			ae.element
		] : [
			ie.element,
			...PA(ce),
			...g
		], ...PA(FA(e))]), RK(e, "top", oe > 0 ? oe - i : 0), RK(e, FK, y > 0 ? y - i : 0), IA(e, t.componentId, this.options.templates, this.options.renderer, o > 0), PQ(e, _, v + 1), (ee || t.first !== p || t.last !== m) && (t.first = p, t.last = m, this.options.dom.invalidate(e)), t.laidOut = n, t.pitches = l, t.laidAcross = s, t.keptOutOfRange = ne?.element ?? null, t.firstLine = d, t.lastLine = f, this.measure(t, n, p, m), c !== null && (t.across = D$(e, r, t.tileWidth) ?? t.across, t.across !== s && this.layout(e, t));
	}
	renderRow(e, t, n) {
		return p$(e.componentId, t.item, t.key, n, this.options);
	}
	renderHeader(e, t, n) {
		let r = this.options.templates.getGroupTemplate(e.componentId);
		return r === void 0 ? null : NK(r, this.options.renderer, t.item, t.key, n);
	}
	measure(e, t, n, r) {
		let i = 0;
		for (let a = n; a < r && a < t.length; a++) {
			let n = t[a], r = n.header ? e.headers.get(S$(n.entry)) : n.entry, o = r?.element;
			if (r == null || o == null) continue;
			let s = jd(o);
			s.height <= 0 || (HK(n.header ? e.headerHeights : e.itemHeights, r.height, s.height), r.height = s.height, n.header || (i = Math.max(i, s.width)));
		}
		i > 0 && (e.tileWidth = i), e.itemHeights.count > 0 && (e.itemEstimate = e.itemHeights.sum / e.itemHeights.count), e.headerHeights.count > 0 && (e.headerEstimate = e.headerHeights.sum / e.headerHeights.count);
	}
	pitchOf(e, t) {
		return t.header ? e.headers.get(S$(t.entry))?.height ?? e.headerEstimate : t.entry.height ?? e.itemEstimate;
	}
	getState(e) {
		let t = this.states.get(e);
		if (t !== void 0) return this.held.add(e), t;
		let n = Qa(e);
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
function v$(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t);
}
function y$(e, t, n, r, i, a, o) {
	if (t.laidOut !== n || t.laidAcross !== i || t.pitches.length !== r.length || a <= 0) return a;
	let s = 0, c = 0;
	for (let e = 0; e < r.length; e++) {
		let n = e >= t.firstLine && e < t.lastLine ? r[e] : t.pitches[e];
		if (s + n > a) break;
		s += n, c += r[e];
	}
	let l = c - s;
	return Math.abs(l) < .5 ? a : (kd(e, a + l + o), a + l);
}
function b$(e, t, n) {
	if (!t.header) {
		t.entry.element = n;
		return;
	}
	let r = S$(t.entry), i = e.headers.get(r);
	i === void 0 ? e.headers.set(r, {
		element: n,
		height: null
	}) : i.element = n;
}
function x$(e) {
	let t = JA(e.item, "CanSelect");
	return t.ok && t.value === !1;
}
function S$(e) {
	let t = JA(e.item, "Group");
	return t.ok && typeof t.value == "string" ? t.value : "";
}
function C$(e) {
	let t = e.parentElement;
	return t !== null && (t.classList.contains("ui-table__scroll") || t.classList.contains("ui-items-view--stack") && t.classList.contains("ui-orientation--vertical"));
}
function w$(e, t) {
	let n = 0;
	for (; n + 1 < e.length && e[n + 1] <= t;) n++;
	return n;
}
function T$(e) {
	return e.parentElement?.classList.contains("ui-items-view--wrap") === !0;
}
function E$(e, t, n) {
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
function D$(e, t, n) {
	let r = e.clientWidth - k$(t.paddingLeft) - k$(t.paddingRight);
	if (n === null || n <= 0 || r <= 0) return null;
	let i = k$(t.columnGap);
	return Math.max(1, Math.floor((r + i + .5) / (n + i)));
}
function O$(e) {
	return k$(e.rowGap);
}
function k$(e) {
	let t = Number.parseFloat(e);
	return Number.isFinite(t) ? t : 0;
}
function A$(e, t, n) {
	let r = 0;
	for (let i = t; i < n; i++) r += e[i];
	return r;
}
//#endregion
//#region src/items/items-template-registry.ts
var j$ = "data-ui-template", M$ = "default", N$ = class {
	dom;
	templateComponentIds = null;
	constructor(e) {
		this.dom = e;
	}
	getTemplate(e, t) {
		let n = t ?? M$, r = this.findTemplate(e, n);
		return r === void 0 ? n === M$ ? void 0 : this.getTemplate(e, null) : r;
	}
	getVariantTemplate(e, t) {
		return this.findTemplate(e, t);
	}
	findTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		return n === null ? void 0 : P$(n, j$, t);
	}
	isTemplateComponent(e) {
		return this.templateComponentIds ??= F$(this.dom.root), this.templateComponentIds.has(e);
	}
	getEmptyTemplate(e) {
		return this.getMarkedTemplate(e, Ft);
	}
	getGroupTemplate(e) {
		return this.getMarkedTemplate(e, It);
	}
	getMarkedTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		return n === null ? void 0 : P$(n, t, null);
	}
};
function P$(e, t, n) {
	for (let r of e.children) if (r.localName === "template" && (n === null ? r.hasAttribute(t) : r.getAttribute(t) === n)) return r;
}
function F$(e) {
	let t = /* @__PURE__ */ new Set();
	return hl(e, (n) => {
		if (n !== e) for (let e of n.querySelectorAll(x)) {
			let n = T(e);
			n > 0 && t.add(n);
		}
	}), t;
}
//#endregion
//#region src/items/row-menus.ts
var I$ = `:scope > ${`template[${Ee}]`}`, L$ = class {
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
			this.components.has(e) && z$(t.item, this.chordSet);
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
		let t = e.querySelector(I$);
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
			let e = [...t, ...R$(r)];
			if (r.hasAttribute("data-ui-context-menu-template")) {
				this.takeMenu(r, e, n);
				continue;
			}
			let i = r.parentElement === null ? 0 : T(r.parentElement);
			this.scanContainer(r.content, i > 0 ? [...e, i] : e, n ?? r);
		}
	}
	takeMenu(e, t, n) {
		let r = Number(e.getAttribute(Ee)), i = !this.declared.has(r);
		this.taken.add(e), this.declared.add(r), hl(e.content, (e) => {
			if (i) for (let n of e.querySelectorAll(x)) this.components.set(T(n), t), this.menuOf.set(T(n), r);
			for (let t of e.querySelectorAll(`[${Xn}]`)) {
				let e = t.getAttribute("data-ui-shortcut")?.trim() ?? "";
				e.length > 0 && this.writtenChords.add(e);
			}
		}), (e.parentElement?.hasAttribute("data-ui-context-menu-later") !== !0 || n !== null) && (n !== null && n.after(e), Number.isInteger(r) && r > 0 && this.shared.set(r, e));
	}
};
function R$(e) {
	let t = [];
	for (let n = e.parentElement?.closest("[data-ui-items-host]") ?? null; n !== null; n = n.parentElement?.closest("[data-ui-items-host]") ?? null) {
		let e = Za(n);
		e !== null && t.unshift(e);
	}
	return t;
}
function z$(e, t) {
	let n = JA(e, "Shortcut");
	n.ok && typeof n.value == "string" && n.value.trim().length > 0 && t.add(n.value.trim());
	let r = JA(e, "Items");
	if (r.ok && Array.isArray(r.value)) for (let e of r.value) z$(e, t);
}
//#endregion
//#region src/rendering/theme-colors.ts
function B$(e, t) {
	let n = e.querySelector(`style[${Yr}]`);
	if (t.length === 0) {
		n?.remove();
		return;
	}
	if (n !== null) {
		n.textContent !== t && (n.textContent = t);
		return;
	}
	let r = document.createElement("style");
	r.setAttribute(Yr, ""), r.textContent = t, e.insertBefore(r, e.querySelector("link[data-ui-theme-sheet]")?.nextElementSibling ?? null);
}
//#endregion
//#region src/metadata/metadata-reader.ts
var V$ = "script[type='application/json'][data-ui-metadata]";
function H$(e = document) {
	let t = e.querySelector(V$);
	if (t === null) return U$();
	let n = t.textContent?.trim() ?? "";
	if (n.length === 0) return U$();
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
function U$() {
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
var W$ = "script[type='application/json'][data-ui-hydration]";
function G$(e) {
	return e !== null && (Rc(e.title) || Rc(e.changes));
}
function K$(e = document) {
	let t = e.querySelector(W$)?.textContent?.trim() ?? "";
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
var q$ = "reconnecting";
async function J$(e, t, n, r) {
	for (let i = 0;; i++) try {
		return await e();
	} catch (e) {
		if (t()) return s("attaching the runtime failed as the connection dropped again; the reconnect attaches.", e), q$;
		if (i >= n.length) return c("attaching the runtime failed after retrying; giving up.", e), null;
		s("attaching the runtime failed; retrying.", {
			attempt: i + 1,
			error: e
		}), await r(n[i]);
	}
}
//#endregion
//#region src/transport/reader-time-zone.ts
function Y$(e = () => Intl.DateTimeFormat().resolvedOptions().timeZone) {
	try {
		let t = e();
		return typeof t == "string" && t.length > 0 ? t : null;
	} catch {
		return null;
	}
}
function X$(e, t, n) {
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
var Z$ = "/_ne/", Q$ = 3e3;
function $$(e, t, n) {
	let r = e.getAttribute(qr);
	if (r === null || !("serviceWorker" in navigator)) return;
	let i = navigator.serviceWorker;
	if (X$(i, t, n), e.hasAttribute("data-ui-service-worker-imported")) return () => t1(i.ready);
	let a = i.register(r, { scope: Z$ }).then(e1).catch((e) => {
		s("registering the notification service worker failed; notifications are the page's own.", e);
	});
	return () => a;
}
function e1(e) {
	let t = e.installing ?? e.waiting;
	return e.active !== null || t === null ? Promise.resolve(e) : new Promise((n) => {
		t.addEventListener("statechange", () => {
			t.state === "activated" && n(e);
		});
	});
}
function t1(e) {
	return Promise.race([e, new Promise((e) => setTimeout(() => e(void 0), Q$))]);
}
//#endregion
//#region src/runtime/reload-guard.ts
var n1 = "ne-standard-ui:reloaded-view";
function r1(e, t, n) {
	if (!t) return "no-cookie";
	if (o1(n) === e) return "asked-again";
	try {
		n?.setItem(n1, e);
	} catch {}
	return "reload";
}
function i1(e) {
	try {
		e?.removeItem(n1);
	} catch {}
}
function a1() {
	try {
		return window.sessionStorage;
	} catch {
		return null;
	}
}
function o1(e) {
	try {
		return e?.getItem(n1) ?? null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/runtime/window-id.ts
function s1(e, t) {
	let n = null;
	try {
		n = window.sessionStorage;
	} catch (e) {
		s("session storage is unavailable, so this tab is new on every load.", e);
	}
	return c1(e, {
		memory: n,
		lifecycle: window,
		openChannel: typeof BroadcastChannel == "function" ? (e) => new BroadcastChannel(e) : null,
		rekeyed: t
	});
}
function c1(e, t) {
	let n = t.create ?? m1, r = t.now ?? Date.now, i = t.memory, a = `${e}:claimed`, o = d1(i, e), s = n(), c = o !== null && o.length > 0 && d1(i, a) !== o ? o : n(), l = null, u = 0, d = () => {
		f1(i, e, c), f1(i, a, c);
	}, f = (e) => {
		e?.kind === "ask" && e.id === c && e.from !== s ? l1(l, {
			kind: "held",
			id: c,
			to: e.from,
			by: s,
			at: u
		}) : e?.kind === "held" && e.id === c && e.to === s && (e.at < u || e.at === u && e.by < s) && (c = n(), d(), t.rekeyed(c));
	}, p = () => {
		l = u1(t, e), l?.addEventListener("message", (e) => f(e.data)), u = r(), l1(l, {
			kind: "ask",
			id: c,
			from: s,
			at: u
		});
	};
	return d(), p(), t.lifecycle.addEventListener("pagehide", () => {
		p1(i, a), l?.close(), l = null;
	}), t.lifecycle.addEventListener("pageshow", (e) => {
		e.persisted && (d(), p());
	}), c;
}
function l1(e, t) {
	e?.postMessage(t);
}
function u1(e, t) {
	try {
		return e.openChannel?.(t) ?? null;
	} catch (e) {
		return s("the channel tabs ask for their ids on could not be opened.", e), null;
	}
}
function d1(e, t) {
	try {
		return e?.getItem(t) ?? null;
	} catch (e) {
		return s("reading the tab id failed.", e), null;
	}
}
function f1(e, t, n) {
	try {
		e?.setItem(t, n);
	} catch (e) {
		s("storing the tab id failed.", e);
	}
}
function p1(e, t) {
	try {
		e?.removeItem(t);
	} catch {}
}
function m1() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `tab-${typeof crypto < "u" && typeof crypto.getRandomValues == "function" ? [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16))].map((e) => e.toString(16).padStart(2, "0")).join("") : Math.random().toString(16).slice(2).padEnd(16, "0")}-${performance.now().toString(36).replace(".", "")}`;
}
//#endregion
//#region src/runtime/connection-watch.ts
var h1 = 2e3, g1 = class {
	root;
	notifications;
	graceMilliseconds;
	grace = null;
	notice = null;
	given = !1;
	constructor(e) {
		this.root = e.root, this.notifications = e.notifications, this.graceMilliseconds = e.graceMilliseconds ?? h1, e.connection.onReconnecting(() => this.reconnecting()), e.connection.onReconnected(() => this.reconnected());
	}
	reconnecting() {
		this.given || this.grace !== null || this.notice !== null || (this.grace = window.setTimeout(() => this.showReconnecting(), this.graceMilliseconds));
	}
	showReconnecting() {
		this.grace = null, this.root.setAttribute(ai, "reconnecting"), this.notice = this.notifications.show({
			message: D.text("ui.connection.reconnecting"),
			sticky: !0,
			connection: !0
		});
	}
	reconnected() {
		this.given || (this.clear(), this.root.removeAttribute(ai));
	}
	clear() {
		this.grace !== null && (window.clearTimeout(this.grace), this.grace = null), this.notice !== null && (this.notifications.dismiss(this.notice), this.notice = null);
	}
	lost() {
		this.given = !0, this.clear(), this.root.setAttribute(ai, "lost");
	}
}, _1 = class {
	transport;
	pendingKeys = /* @__PURE__ */ new Set();
	nextRequestId = 1;
	awaited = /* @__PURE__ */ new Map();
	staging = null;
	constructor(e) {
		this.transport = e;
	}
	isPending(e) {
		return this.pendingKeys.has(v1(y1(e)));
	}
	async dispatchAsync(e, t) {
		let n = y1(e), r = v1(n);
		if (this.pendingKeys.has(r)) throw Error("Command is already pending.");
		this.pendingKeys.add(r);
		let i = this.nextRequestId++, a = this.expect(i);
		try {
			let e = await this.sendAsync({
				...n,
				requestId: i
			}, t);
			return e.accepted === !0 ? await a : e;
		} finally {
			this.awaited.delete(i), this.pendingKeys.delete(r);
		}
	}
	sendAsync(e, t) {
		let n = Nm(e.dynamicParameters);
		if (n === null && this.staging === null) return this.transport.processEventAsync(e, t);
		let r = this.staging, i = n === null ? null : Im(n), a = () => {}, o = new Promise((e) => {
			a = e;
		});
		return i?.catch(() => {}), this.staging = o, (async () => {
			try {
				await r;
				let n = i === null ? null : await i;
				return this.transport.processEventAsync(n === null ? e : {
					...e,
					dynamicParameters: [],
					dynamicParametersToken: n
				}, t);
			} finally {
				a(), this.staging === o && (this.staging = null);
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
function v1(e) {
	return e.action === void 0 ? `${JSON.stringify(e.eventId)}:${JSON.stringify(e.dynamicParameters ?? [])}` : `action:${e.action}`;
}
function y1(e) {
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
var b1 = class {
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
async function x1(e, t) {
	try {
		await e();
	} finally {
		t();
	}
}
//#endregion
//#region src/state/property-state-store.ts
var S1 = class {
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
		let i = this.createKey(e, t), a = this.values.get(i), o = a !== void 0 && gm(a.value, n);
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
		let r = C1(e, t);
		for (let e of n) this.forgetRow(r, e), this.forgetUnplaced(Ca([...t, e]));
	}
	forgetHost(e, t) {
		this.forgetScope(C1(e, t));
		let n = this.unplaced.get(Ca(t));
		for (let e of [...n?.children ?? []]) this.forgetUnplaced(e);
	}
	clear() {
		this.values.clear(), this.scopes.clear(), this.unplaced.clear(), this.unplacedPathByEntry.clear();
	}
	recordRows(e, t) {
		let n = null;
		for (let [r, i] of t.entries()) {
			let t = C1(i.host, i.hostParameters), a = this.rowState(t, i.key);
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
		let n = this.unplacedNode(Ca([]), null), r = "";
		for (let e = 1; e <= t.length; e++) r = Ca(t.slice(0, e)), n.children.add(r), n = this.unplacedNode(r, Ca(t.slice(0, e - 1)));
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
		return `${w(e.componentId)}:${e.propertyId}:${Ca(t)}`;
	}
};
function C1(e, t) {
	return `${e}:${Ca(t)}`;
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Errors.js
var w1 = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(`${e}: Status code '${t}'`), this.statusCode = t, this.__proto__ = n;
	}
}, T1 = class extends Error {
	constructor(e = "A timeout occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, E1 = class extends Error {
	constructor(e = "An abort occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, D1 = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "UnsupportedTransportError", this.__proto__ = n;
	}
}, O1 = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "DisabledTransportError", this.__proto__ = n;
	}
}, k1 = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "FailedToStartTransportError", this.__proto__ = n;
	}
}, A1 = class extends Error {
	constructor(e) {
		let t = new.target.prototype;
		super(e), this.errorType = "FailedToNegotiateWithServerError", this.__proto__ = t;
	}
}, j1 = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.innerErrors = t, this.__proto__ = n;
	}
}, M1 = class {
	constructor(e, t, n) {
		this.statusCode = e, this.statusText = t, this.content = n;
	}
}, N1 = class {
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
var P1 = class {
	constructor() {}
	log(e, t) {}
};
P1.instance = new P1();
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/pkg-version.js
var F1 = "10.0.11", Z = class {
	static isRequired(e, t) {
		if (e == null) throw Error(`The '${t}' argument is required.`);
	}
	static isNotEmpty(e, t) {
		if (!e || e.match(/^\s*$/)) throw Error(`The '${t}' argument should not be empty.`);
	}
	static isIn(e, t, n) {
		if (!(e in t)) throw Error(`Unknown ${n} value: ${e}.`);
	}
}, I1 = class e {
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
function L1(e, t) {
	let n = "";
	return z1(e) ? (n = `Binary data of length ${e.byteLength}`, t && (n += `. Content: '${R1(e)}'`)) : typeof e == "string" && (n = `String data of length ${e.length}`, t && (n += `. Content: '${e}'`)), n;
}
function R1(e) {
	let t = new Uint8Array(e), n = "";
	return t.forEach((e) => {
		n += `0x${e < 16 ? "0" : ""}${e.toString(16)} `;
	}), n.substring(0, n.length - 1);
}
function z1(e) {
	return e && typeof ArrayBuffer < "u" && (e instanceof ArrayBuffer || e.constructor && e.constructor.name === "ArrayBuffer");
}
async function B1(e, t, n, r, i, a) {
	let o = {}, [s, c] = W1();
	o[s] = c, e.log(X.Trace, `(${t} transport) sending data. ${L1(i, a.logMessageContent)}.`);
	let l = z1(i) ? "arraybuffer" : "text", u = await n.post(r, {
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
function V1(e) {
	return e === void 0 ? new U1(X.Information) : e === null ? P1.instance : e.log === void 0 ? new U1(e) : e;
}
var H1 = class {
	constructor(e, t) {
		this._subject = e, this._observer = t;
	}
	dispose() {
		let e = this._subject.observers.indexOf(this._observer);
		e > -1 && this._subject.observers.splice(e, 1), this._subject.observers.length === 0 && this._subject.cancelCallback && this._subject.cancelCallback().catch((e) => {});
	}
}, U1 = class {
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
function W1() {
	let e = "X-SignalR-User-Agent";
	return I1.isNode && (e = "User-Agent"), [e, G1(F1, K1(), J1(), q1())];
}
function G1(e, t, n, r) {
	let i = "Microsoft SignalR/", a = e.split(".");
	return i += `${a[0]}.${a[1]}`, i += ` (${e}; `, i += t && t !== "" ? `${t}; ` : "Unknown OS; ", i += `${n}`, i += r ? `; ${r}` : "; Unknown Runtime Version", i += ")", i;
}
/*#__PURE__*/ function K1() {
	if (I1.isNode) switch (process.platform) {
		case "win32": return "Windows NT";
		case "darwin": return "macOS";
		case "linux": return "Linux";
		default: return process.platform;
	}
	else return "";
}
/*#__PURE__*/ function q1() {
	if (I1.isNode) return process.versions.node;
}
function J1() {
	return I1.isNode ? "NodeJS" : "Browser";
}
function Y1(e) {
	return e.stack ? e.stack : e.message ? e.message : `${e}`;
}
function X1() {
	if (typeof globalThis < "u") return globalThis;
	if (typeof self < "u") return self;
	if (typeof window < "u") return window;
	if (typeof global < "u") return global;
	throw Error("could not find global");
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js
var Z1 = class extends N1 {
	constructor(t) {
		if (super(), this._logger = t, typeof fetch > "u" || I1.isNode) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._jar = new (t("tough-cookie")).CookieJar(), this._fetchType = typeof fetch > "u" ? t("node-fetch") : fetch, this._fetchType = t("fetch-cookie")(this._fetchType, this._jar);
		} else this._fetchType = fetch.bind(X1());
		if (typeof AbortController > "u") {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._abortControllerType = t("abort-controller");
		} else this._abortControllerType = AbortController;
	}
	async send(e) {
		if (e.abortSignal && e.abortSignal.aborted) throw new E1();
		if (!e.method) throw Error("No method defined.");
		if (!e.url) throw Error("No url defined.");
		let t = new this._abortControllerType(), n;
		e.abortSignal && (e.abortSignal.onabort = () => {
			t.abort(), n = new E1();
		});
		let r = null;
		if (e.timeout) {
			let i = e.timeout;
			r = setTimeout(() => {
				t.abort(), this._logger.log(X.Warning, "Timeout from HTTP request."), n = new T1();
			}, i);
		}
		e.content === "" && (e.content = void 0), e.content && (e.headers = e.headers || {}, z1(e.content) ? e.headers["Content-Type"] = "application/octet-stream" : e.headers["Content-Type"] = "text/plain;charset=UTF-8");
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
		if (!i.ok) throw new w1(await Q1(i, "text") || i.statusText, i.status);
		let a = await Q1(i, e.responseType);
		return new M1(i.status, i.statusText, a);
	}
	getCookieString(e) {
		let t = "";
		return I1.isNode && this._jar && this._jar.getCookies(e, (e, n) => t = n.join("; ")), t;
	}
};
function Q1(e, t) {
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
var $1 = class extends N1 {
	constructor(e) {
		super(), this._logger = e;
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new E1()) : e.method ? e.url ? new Promise((t, n) => {
			let r = new XMLHttpRequest();
			r.open(e.method, e.url, !0), r.withCredentials = e.withCredentials === void 0 || e.withCredentials, r.setRequestHeader("X-Requested-With", "XMLHttpRequest"), e.content === "" && (e.content = void 0), e.content && (z1(e.content) ? r.setRequestHeader("Content-Type", "application/octet-stream") : r.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"));
			let i = e.headers;
			i && Object.keys(i).forEach((e) => {
				r.setRequestHeader(e, i[e]);
			}), e.responseType && (r.responseType = e.responseType), e.abortSignal && (e.abortSignal.onabort = () => {
				r.abort(), n(new E1());
			}), e.timeout && (r.timeout = e.timeout), r.onload = () => {
				e.abortSignal && (e.abortSignal.onabort = null), r.status >= 200 && r.status < 300 ? t(new M1(r.status, r.statusText, r.response || r.responseText)) : n(new w1(r.response || r.responseText || r.statusText, r.status));
			}, r.onerror = () => {
				this._logger.log(X.Warning, `Error from HTTP request. ${r.status}: ${r.statusText}.`), n(new w1(r.statusText, r.status));
			}, r.ontimeout = () => {
				this._logger.log(X.Warning, "Timeout from HTTP request."), n(new T1());
			}, r.send(e.content);
		}) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
}, e0 = class extends N1 {
	constructor(e) {
		if (super(), typeof fetch < "u" || I1.isNode) this._httpClient = new Z1(e);
		else if (typeof XMLHttpRequest < "u") this._httpClient = new $1(e);
		else throw Error("No usable HttpClient found.");
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new E1()) : e.method ? e.url ? this._httpClient.send(e) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
	getCookieString(e) {
		return this._httpClient.getCookieString(e);
	}
}, t0 = class e {
	static write(t) {
		return `${t}${e.RecordSeparator}`;
	}
	static parse(t) {
		if (t[t.length - 1] !== e.RecordSeparator) throw Error("Message is incomplete.");
		let n = t.split(e.RecordSeparator);
		return n.pop(), n;
	}
};
t0.RecordSeparatorCode = 30, t0.RecordSeparator = String.fromCharCode(t0.RecordSeparatorCode);
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js
var n0 = class {
	writeHandshakeRequest(e) {
		return t0.write(JSON.stringify(e));
	}
	parseHandshakeResponse(e) {
		let t, n;
		if (z1(e)) {
			let r = new Uint8Array(e), i = r.indexOf(t0.RecordSeparatorCode);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = String.fromCharCode.apply(null, Array.prototype.slice.call(r.slice(0, a))), n = r.byteLength > a ? r.slice(a).buffer : null;
		} else {
			let r = e, i = r.indexOf(t0.RecordSeparator);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = r.substring(0, a), n = r.length > a ? r.substring(a) : null;
		}
		let r = t0.parse(t), i = JSON.parse(r[0]);
		if (i.type) throw Error("Expected a handshake response from the server.");
		return [n, i];
	}
}, Q;
(function(e) {
	e[e.Invocation = 1] = "Invocation", e[e.StreamItem = 2] = "StreamItem", e[e.Completion = 3] = "Completion", e[e.StreamInvocation = 4] = "StreamInvocation", e[e.CancelInvocation = 5] = "CancelInvocation", e[e.Ping = 6] = "Ping", e[e.Close = 7] = "Close", e[e.Ack = 8] = "Ack", e[e.Sequence = 9] = "Sequence";
})(Q ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Subject.js
var r0 = class {
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
		return this.observers.push(e), new H1(this, e);
	}
}, i0 = class {
	constructor(e, t, n) {
		this._bufferSize = 1e5, this._messages = [], this._totalMessageCount = 0, this._waitForSequenceMessage = !1, this._nextReceivingSequenceId = 1, this._latestReceivedSequenceId = 0, this._bufferedByteCount = 0, this._reconnectInProgress = !1, this._protocol = e, this._connection = t, this._bufferSize = n;
	}
	async _send(e) {
		let t = this._protocol.writeMessage(e), n = Promise.resolve();
		if (this._isInvocationMessage(e)) {
			this._totalMessageCount++;
			let e = () => {}, r = () => {};
			z1(t) ? this._bufferedByteCount += t.byteLength : this._bufferedByteCount += t.length, this._bufferedByteCount >= this._bufferSize && (n = new Promise((t, n) => {
				e = t, r = n;
			})), this._messages.push(new a0(t, this._totalMessageCount, e, r));
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
			if (r._id <= e.sequenceId) t = n, z1(r._message) ? this._bufferedByteCount -= r._message.byteLength : this._bufferedByteCount -= r._message.length, r._resolver();
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
}, a0 = class {
	constructor(e, t, n, r) {
		this._message = e, this._id = t, this._resolver = n, this._rejector = r;
	}
}, o0 = 3e4, s0 = 15e3, c0 = 1e5, $;
(function(e) {
	e.Disconnected = "Disconnected", e.Connecting = "Connecting", e.Connected = "Connected", e.Disconnecting = "Disconnecting", e.Reconnecting = "Reconnecting";
})($ ||= {});
var l0 = class e {
	static create(t, n, r, i, a, o, s) {
		return new e(t, n, r, i, a, o, s);
	}
	constructor(e, t, n, r, i, a, o) {
		this._nextKeepAlive = 0, this._freezeEventListener = () => {
			this._logger.log(X.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
		}, Z.isRequired(e, "connection"), Z.isRequired(t, "logger"), Z.isRequired(n, "protocol"), this.serverTimeoutInMilliseconds = i ?? o0, this.keepAliveIntervalInMilliseconds = a ?? s0, this._statefulReconnectBufferSize = o ?? c0, this._logger = t, this._protocol = n, this.connection = e, this._reconnectPolicy = r, this._handshakeProtocol = new n0(), this.connection.onreceive = (e) => this._processIncomingData(e), this.connection.onclose = (e) => this._connectionClosed(e), this._callbacks = {}, this._methods = {}, this._closedCallbacks = [], this._reconnectingCallbacks = [], this._reconnectedCallbacks = [], this._invocationId = 0, this._receivedHandshakeResponse = !1, this._connectionState = $.Disconnected, this._connectionStarted = !1, this._cachedPingMessage = this._protocol.writeMessage({ type: Q.Ping });
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
			await this._startInternal(), I1.isBrowser && window.document.addEventListener("freeze", this._freezeEventListener), this._connectionState = $.Connected, this._connectionStarted = !0, this._logger.log(X.Debug, "HubConnection connected successfully.");
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
			this.connection.features.reconnect && (this._messageBuffer = new i0(this._protocol, this.connection, this._statefulReconnectBufferSize), this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer), this.connection.features.resend = () => {
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
		return this._connectionState = $.Disconnecting, this._logger.log(X.Debug, "Stopping HubConnection."), this._reconnectDelayHandle ? (this._logger.log(X.Debug, "Connection stopped during reconnect delay. Done reconnecting."), clearTimeout(this._reconnectDelayHandle), this._reconnectDelayHandle = void 0, this._completeClose(), Promise.resolve()) : (t === $.Connected && this._sendCloseMessage(), this._cleanupTimeout(), this._cleanupPingTimer(), this._stopDuringStartError = e || new E1("The connection was stopped before the hub handshake could complete."), this.connection.stop(e));
	}
	async _sendCloseMessage() {
		try {
			await this._sendWithProtocol(this._createCloseMessage());
		} catch {}
	}
	stream(e, ...t) {
		let [n, r] = this._replaceStreamingParams(t), i = this._createStreamInvocation(e, t, r), a, o = new r0();
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
						this._logger.log(X.Error, `Invoke client method threw error: ${Y1(e)}`);
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
							this._logger.log(X.Error, `Stream callback threw error: ${Y1(e)}`);
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
		this._logger.log(X.Debug, `HubConnection.connectionClosed(${e}) called while in state ${this._connectionState}.`), this._stopDuringStartError = this._stopDuringStartError || e || new E1("The underlying connection was closed before the hub handshake could complete."), this._handshakeResolver && this._handshakeResolver(), this._cancelCallbacksWithError(e || /* @__PURE__ */ Error("Invocation canceled due to the underlying connection being closed.")), this._cleanupTimeout(), this._cleanupPingTimer(), this._connectionState === $.Disconnecting ? this._completeClose(e) : this._connectionState === $.Connected && this._reconnectPolicy ? this._reconnect(e) : this._connectionState === $.Connected && this._completeClose(e);
	}
	_completeClose(e) {
		if (this._connectionStarted) {
			this._connectionState = $.Disconnected, this._connectionStarted = !1, this._messageBuffer &&= (this._messageBuffer._dispose(e ?? /* @__PURE__ */ Error("Connection closed.")), void 0), I1.isBrowser && window.document.removeEventListener("freeze", this._freezeEventListener);
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
				this._logger.log(X.Error, `Stream 'error' callback called with '${e}' threw error: ${Y1(t)}`);
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
}, u0 = [
	0,
	2e3,
	1e4,
	3e4,
	null
], d0 = class {
	constructor(e) {
		this._retryDelays = e === void 0 ? u0 : [...e, null];
	}
	nextRetryDelayInMilliseconds(e) {
		return this._retryDelays[e.previousRetryCount];
	}
}, f0 = class {};
f0.Authorization = "Authorization", f0.Cookie = "Cookie";
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js
var p0 = class extends N1 {
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
		e.headers ||= {}, this._accessToken ? e.headers[f0.Authorization] = `Bearer ${this._accessToken}` : this._accessTokenFactory && e.headers[f0.Authorization] && delete e.headers[f0.Authorization];
	}
	getCookieString(e) {
		return this._innerClient.getCookieString(e);
	}
}, m0;
(function(e) {
	e[e.None = 0] = "None", e[e.WebSockets = 1] = "WebSockets", e[e.ServerSentEvents = 2] = "ServerSentEvents", e[e.LongPolling = 4] = "LongPolling";
})(m0 ||= {});
var h0;
(function(e) {
	e[e.Text = 1] = "Text", e[e.Binary = 2] = "Binary";
})(h0 ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AbortController.js
var g0 = class {
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
}, _0 = class {
	get pollAborted() {
		return this._pollAbort.aborted;
	}
	constructor(e, t, n) {
		this._httpClient = e, this._logger = t, this._pollAbort = new g0(), this._options = n, this._running = !1, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		if (Z.isRequired(e, "url"), Z.isRequired(t, "transferFormat"), Z.isIn(t, h0, "transferFormat"), this._url = e, this._logger.log(X.Trace, "(LongPolling transport) Connecting."), t === h0.Binary && typeof XMLHttpRequest < "u" && typeof new XMLHttpRequest().responseType != "string") throw Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
		let [n, r] = W1(), i = {
			[n]: r,
			...this._options.headers
		}, a = {
			abortSignal: this._pollAbort.signal,
			headers: i,
			timeout: 1e5,
			withCredentials: this._options.withCredentials
		};
		t === h0.Binary && (a.responseType = "arraybuffer");
		let o = `${e}&_=${Date.now()}`;
		this._logger.log(X.Trace, `(LongPolling transport) polling: ${o}.`);
		let s = await this._httpClient.get(o, a);
		s.statusCode === 200 ? this._running = !0 : (this._logger.log(X.Error, `(LongPolling transport) Unexpected response code: ${s.statusCode}.`), this._closeError = new w1(s.statusText || "", s.statusCode), this._running = !1), this._receiving = this._poll(this._url, a);
	}
	async _poll(e, t) {
		try {
			for (; this._running;) try {
				let n = `${e}&_=${Date.now()}`;
				this._logger.log(X.Trace, `(LongPolling transport) polling: ${n}.`);
				let r = await this._httpClient.get(n, t);
				r.statusCode === 204 ? (this._logger.log(X.Information, "(LongPolling transport) Poll terminated by server."), this._running = !1) : r.statusCode === 200 ? r.content ? (this._logger.log(X.Trace, `(LongPolling transport) data received. ${L1(r.content, this._options.logMessageContent)}.`), this.onreceive && this.onreceive(r.content)) : this._logger.log(X.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._logger.log(X.Error, `(LongPolling transport) Unexpected response code: ${r.statusCode}.`), this._closeError = new w1(r.statusText || "", r.statusCode), this._running = !1);
			} catch (e) {
				this._running ? e instanceof T1 ? this._logger.log(X.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._closeError = e, this._running = !1) : this._logger.log(X.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
			}
		} finally {
			this._logger.log(X.Trace, "(LongPolling transport) Polling complete."), this.pollAborted || this._raiseOnClose();
		}
	}
	async send(e) {
		return this._running ? B1(this._logger, "LongPolling", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	async stop() {
		this._logger.log(X.Trace, "(LongPolling transport) Stopping polling."), this._running = !1, this._pollAbort.abort();
		try {
			await this._receiving, this._logger.log(X.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
			let e = {}, [t, n] = W1();
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
			i ? i instanceof w1 && (i.statusCode === 404 ? this._logger.log(X.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.") : this._logger.log(X.Trace, `(LongPolling transport) Error sending a DELETE request: ${i}`)) : this._logger.log(X.Trace, "(LongPolling transport) DELETE request accepted.");
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
}, v0 = class {
	constructor(e, t, n, r) {
		this._httpClient = e, this._accessToken = t, this._logger = n, this._options = r, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		return Z.isRequired(e, "url"), Z.isRequired(t, "transferFormat"), Z.isIn(t, h0, "transferFormat"), this._logger.log(X.Trace, "(SSE transport) Connecting."), this._url = e, this._accessToken && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(this._accessToken)}`), new Promise((n, r) => {
			let i = !1;
			if (t !== h0.Text) {
				r(/* @__PURE__ */ Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
				return;
			}
			let a;
			if (I1.isBrowser || I1.isWebWorker) a = new this._options.EventSource(e, { withCredentials: this._options.withCredentials });
			else {
				let t = this._httpClient.getCookieString(e), n = {};
				n.Cookie = t;
				let [r, i] = W1();
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
						this._logger.log(X.Trace, `(SSE transport) data received. ${L1(e.data, this._options.logMessageContent)}.`), this.onreceive(e.data);
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
		return this._eventSource ? B1(this._logger, "SSE", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	stop() {
		return this._close(), Promise.resolve();
	}
	_close(e) {
		this._eventSource && (this._eventSource.close(), this._eventSource = void 0, this.onclose && this.onclose(e));
	}
}, y0 = class {
	constructor(e, t, n, r, i, a) {
		this._logger = n, this._accessTokenFactory = t, this._logMessageContent = r, this._webSocketConstructor = i, this._httpClient = e, this.onreceive = null, this.onclose = null, this._headers = a;
	}
	async connect(e, t) {
		Z.isRequired(e, "url"), Z.isRequired(t, "transferFormat"), Z.isIn(t, h0, "transferFormat"), this._logger.log(X.Trace, "(WebSockets transport) Connecting.");
		let n;
		return this._accessTokenFactory && (n = await this._accessTokenFactory()), new Promise((r, i) => {
			e = e.replace(/^http/, "ws");
			let a, o = this._httpClient.getCookieString(e), s = !1;
			if (I1.isNode || I1.isReactNative) {
				let t = {}, [r, i] = W1();
				t[r] = i, n && (t[f0.Authorization] = `Bearer ${n}`), o && (t[f0.Cookie] = o), a = new this._webSocketConstructor(e, void 0, { headers: {
					...t,
					...this._headers
				} });
			} else n && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(n)}`);
			a ||= new this._webSocketConstructor(e), t === h0.Binary && (a.binaryType = "arraybuffer"), a.onopen = (t) => {
				this._logger.log(X.Information, `WebSocket connected to ${e}.`), this._webSocket = a, s = !0, r();
			}, a.onerror = (e) => {
				let t = null;
				t = typeof ErrorEvent < "u" && e instanceof ErrorEvent ? e.error : "There was an error with the transport", this._logger.log(X.Information, `(WebSockets transport) ${t}.`);
			}, a.onmessage = (e) => {
				if (this._logger.log(X.Trace, `(WebSockets transport) data received. ${L1(e.data, this._logMessageContent)}.`), this.onreceive) try {
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
		return this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN ? (this._logger.log(X.Trace, `(WebSockets transport) sending data. ${L1(e, this._logMessageContent)}.`), this._webSocket.send(e), Promise.resolve()) : Promise.reject("WebSocket is not in the OPEN state");
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
}, b0 = 100, x0 = class {
	constructor(t, n = {}) {
		if (this._stopPromiseResolver = () => {}, this.features = {}, this._negotiateVersion = 1, Z.isRequired(t, "url"), this._logger = V1(n.logger), this.baseUrl = this._resolveUrl(t), n ||= {}, n.logMessageContent = n.logMessageContent !== void 0 && n.logMessageContent, typeof n.withCredentials == "boolean" || n.withCredentials === void 0) n.withCredentials = n.withCredentials === void 0 || n.withCredentials;
		else throw Error("withCredentials option was not a 'boolean' or 'undefined' value");
		n.timeout = n.timeout === void 0 ? 1e5 : n.timeout;
		let r = null, i = null;
		if (I1.isNode && e !== void 0) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			r = t("ws"), i = t("eventsource");
		}
		!I1.isNode && typeof WebSocket < "u" && !n.WebSocket ? n.WebSocket = WebSocket : I1.isNode && !n.WebSocket && r && (n.WebSocket = r), !I1.isNode && typeof EventSource < "u" && !n.EventSource ? n.EventSource = EventSource : I1.isNode && !n.EventSource && i !== void 0 && (n.EventSource = i), this._httpClient = new p0(n.httpClient || new e0(this._logger), n.accessTokenFactory), this._connectionState = "Disconnected", this._connectionStarted = !1, this._options = n, this.onreceive = null, this.onclose = null;
	}
	async start(e) {
		if (e ||= h0.Binary, Z.isIn(e, h0, "transferFormat"), this._logger.log(X.Debug, `Starting connection with transfer format '${h0[e]}'.`), this._connectionState !== "Disconnected") return Promise.reject(/* @__PURE__ */ Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
		if (this._connectionState = "Connecting", this._startInternalPromise = this._startInternal(e), await this._startInternalPromise, this._connectionState === "Disconnecting") {
			let e = "Failed to start the HttpConnection before stop() was called.";
			return this._logger.log(X.Error, e), await this._stopPromise, Promise.reject(new E1(e));
		}
		if (this._connectionState !== "Connected") {
			let e = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
			return this._logger.log(X.Error, e), Promise.reject(new E1(e));
		}
		this._connectionStarted = !0;
	}
	send(e) {
		return this._connectionState === "Connected" ? (this._sendQueue ||= new C0(this.transport), this._sendQueue.send(e)) : Promise.reject(/* @__PURE__ */ Error("Cannot send data if the connection is not in the 'Connected' State."));
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
				if (this._options.transport === m0.WebSockets) this.transport = this._constructTransport(m0.WebSockets), await this._startTransport(t, e);
				else throw Error("Negotiation can only be skipped when using the WebSocket transport directly.");
			} else {
				let n = null, r = 0;
				do {
					if (n = await this._getNegotiationResponse(t), this._connectionState === "Disconnecting" || this._connectionState === "Disconnected") throw new E1("The connection was stopped during negotiation.");
					if (n.error) throw Error(n.error);
					if (n.ProtocolVersion) throw Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
					if (n.url && (t = n.url), n.accessToken) {
						let e = n.accessToken;
						this._accessTokenFactory = () => e, this._httpClient._accessToken = e, this._httpClient._accessTokenFactory = void 0;
					}
					r++;
				} while (n.url && r < b0);
				if (r === b0 && n.url) throw Error("Negotiate redirection limit exceeded.");
				await this._createTransport(t, this._options.transport, n, e);
			}
			this.transport instanceof _0 && (this.features.inherentKeepAlive = !0), this._connectionState === "Connecting" && (this._logger.log(X.Debug, "The HttpConnection connected successfully."), this._connectionState = "Connected");
		} catch (e) {
			return this._logger.log(X.Error, "Failed to start the connection: " + e), this._connectionState = "Disconnected", this.transport = void 0, this._stopPromiseResolver(), Promise.reject(e);
		}
	}
	async _getNegotiationResponse(e) {
		let t = {}, [n, r] = W1();
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
			return (!n.negotiateVersion || n.negotiateVersion < 1) && (n.connectionToken = n.connectionId), n.useStatefulReconnect && this._options._useStatefulReconnect !== !0 ? Promise.reject(new A1("Client didn't negotiate Stateful Reconnect but the server did.")) : n;
		} catch (e) {
			let t = "Failed to complete negotiation with the server: " + e;
			return e instanceof w1 && e.statusCode === 404 && (t += " Either this is not a SignalR endpoint or there is a proxy blocking the connection."), this._logger.log(X.Error, t), Promise.reject(new A1(t));
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
					if (this._logger.log(X.Error, `Failed to start the transport '${n.transport}': ${e}`), s = void 0, a.push(new k1(`${n.transport} failed: ${e}`, m0[n.transport])), this._connectionState !== "Connecting") {
						let e = "Failed to select transport before stop() was called.";
						return this._logger.log(X.Debug, e), Promise.reject(new E1(e));
					}
				}
			}
		}
		return a.length > 0 ? Promise.reject(new j1(`Unable to connect to the server with any of the available transports. ${a.join(" ")}`, a)) : Promise.reject(/* @__PURE__ */ Error("None of the transports supported by the client are supported by the server."));
	}
	_constructTransport(e) {
		switch (e) {
			case m0.WebSockets:
				if (!this._options.WebSocket) throw Error("'WebSocket' is not supported in your environment.");
				return new y0(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
			case m0.ServerSentEvents:
				if (!this._options.EventSource) throw Error("'EventSource' is not supported in your environment.");
				return new v0(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
			case m0.LongPolling: return new _0(this._httpClient, this._logger, this._options);
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
		let i = m0[e.transport];
		if (i == null) return this._logger.log(X.Debug, `Skipping transport '${e.transport}' because it is not supported by this client.`), /* @__PURE__ */ Error(`Skipping transport '${e.transport}' because it is not supported by this client.`);
		if (S0(t, i)) {
			if (e.transferFormats.map((e) => h0[e]).indexOf(n) >= 0) {
				if (i === m0.WebSockets && !this._options.WebSocket || i === m0.ServerSentEvents && !this._options.EventSource) return this._logger.log(X.Debug, `Skipping transport '${m0[i]}' because it is not supported in your environment.'`), new D1(`'${m0[i]}' is not supported in your environment.`, i);
				this._logger.log(X.Debug, `Selecting transport '${m0[i]}'.`);
				try {
					return this.features.reconnect = i === m0.WebSockets ? r : void 0, this._constructTransport(i);
				} catch (e) {
					return e;
				}
			}
			return this._logger.log(X.Debug, `Skipping transport '${m0[i]}' because it does not support the requested transfer format '${h0[n]}'.`), /* @__PURE__ */ Error(`'${m0[i]}' does not support ${h0[n]}.`);
		}
		return this._logger.log(X.Debug, `Skipping transport '${m0[i]}' because it was disabled by the client.`), new O1(`'${m0[i]}' is disabled by the client.`, i);
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
		if (!I1.isBrowser) throw Error(`Cannot resolve '${e}'.`);
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
function S0(e, t) {
	return !e || (t & e) !== 0;
}
var C0 = class e {
	constructor(e) {
		this._transport = e, this._buffer = [], this._executing = !0, this._sendBufferedData = new w0(), this._transportResult = new w0(), this._sendLoopPromise = this._sendLoop();
	}
	send(e) {
		return this._bufferData(e), this._transportResult ||= new w0(), this._transportResult.promise;
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
			this._sendBufferedData = new w0();
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
}, w0 = class {
	constructor() {
		this.promise = new Promise((e, t) => [this._resolver, this._rejecter] = [e, t]);
	}
	resolve() {
		this._resolver();
	}
	reject(e) {
		this._rejecter(e);
	}
}, T0 = "json", E0 = class {
	constructor() {
		this.name = T0, this.version = 2, this.transferFormat = h0.Text;
	}
	parseMessages(e, t) {
		if (typeof e != "string") throw Error("Invalid input for JSON hub protocol. Expected a string.");
		if (!e) return [];
		t === null && (t = P1.instance);
		let n = t0.parse(e), r = [];
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
		return t0.write(JSON.stringify(e));
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
}, D0 = {
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
function O0(e) {
	let t = D0[e.toLowerCase()];
	if (t !== void 0) return t;
	throw Error(`Unknown log level: ${e}`);
}
var k0 = class {
	configureLogging(e) {
		if (Z.isRequired(e, "logging"), A0(e)) this.logger = e;
		else if (typeof e == "string") {
			let t = O0(e);
			this.logger = new U1(t);
		} else this.logger = new U1(e);
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
		return this.reconnectPolicy = e ? Array.isArray(e) ? new d0(e) : e : new d0(), this;
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
		let t = new x0(this.url, e);
		return l0.create(t, this.logger || P1.instance, this.protocol || new E0(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
	}
};
function A0(e) {
	return e.log !== void 0;
}
var j0 = 1e3, M0 = 3e4;
function N0(e, t, n = {}) {
	if (t >= (n.windowMilliseconds ?? 6e5)) return null;
	if (e === 0) return 0;
	let r = Math.min(n.maxMilliseconds ?? M0, (n.baseMilliseconds ?? j0) * 2 ** (e - 1));
	return Math.floor((n.random ?? Math.random)() * r);
}
var P0 = class {
	options;
	timer = null;
	resume = null;
	stopped = !1;
	attempts = 0;
	constructor(e) {
		this.options = e;
	}
	get nextAttempt() {
		return this.attempts;
	}
	async runAsync() {
		let e = this.options.now ?? Date.now, t = this.options.startedAt ?? e();
		for (let n = this.options.firstAttempt ?? 0;; n++) {
			let r = N0(n, e() - t, this.options);
			if (r === null || this.stopped || (await this.waitAsync(r), this.stopped)) return !1;
			this.attempts = n + 1;
			try {
				return await this.options.start(), !this.stopped;
			} catch {}
		}
	}
	waitAsync(e) {
		return e <= 0 ? Promise.resolve() : new Promise((t) => {
			this.resume = t, this.timer = (this.options.setTimer ?? ((e, t) => setTimeout(e, t)))(() => this.finishWait(), e);
		});
	}
	finishWait() {
		this.timer !== null && ((this.options.clearTimer ?? ((e) => clearTimeout(e)))(this.timer), this.timer = null);
		let e = this.resume;
		this.resume = null, e?.();
	}
	wake() {
		this.finishWait();
	}
	stop() {
		this.stopped = !0, this.finishWait();
	}
}, F0 = 500, I0 = 1e4;
function L0(e) {
	let { changes: t, ...n } = e;
	return n;
}
function R0() {
	return {};
}
function z0(e) {
	return typeof e == "string" ? e : null;
}
var B0 = class {
	windowId;
	connection;
	started = !1;
	connected = !1;
	stopping = !1;
	reconnect = null;
	reconnectWindow;
	reconnectSince = null;
	reconnectAttempt = 0;
	droppedAt = -Infinity;
	reconnectingHandlers = [];
	reconnectedHandlers = [];
	closedHandlers = [];
	expiredHandlers = [];
	dropWatchers = /* @__PURE__ */ new Set();
	gate = new Cm();
	inbound;
	constructor(e, t, n = {}) {
		this.windowId = e, this.inbound = new b1(t), this.reconnectWindow = n.reconnectWindowMilliseconds ?? 6e5, this.connection = new k0().withUrl(n.hubUrl ?? "/_ne/hub").withStatefulReconnect().configureLogging(X.Warning).build(), this.connection.onclose((e) => this.closed(e)), window.addEventListener("online", () => this.reconnect?.wake()), window.addEventListener("pageshow", () => this.reconnect?.wake()), document.addEventListener("visibilitychange", () => {
			document.visibilityState === "visible" && this.reconnect?.wake();
		});
	}
	closed(e) {
		if (this.started = !1, this.stopping || this.gate.failure !== null || !this.connected) for (let t of this.closedHandlers) t(e);
		else this.reconnectAsync(e);
	}
	async reconnectAsync(e) {
		this.reconnectSince ??= Date.now();
		let t = new P0({
			start: () => this.connection.start(),
			windowMilliseconds: this.reconnectWindow,
			startedAt: this.reconnectSince,
			firstAttempt: this.reconnectAttempt
		});
		this.reconnect = t, this.droppedAt = performance.now();
		for (let e of [...this.dropWatchers]) e();
		this.dropWatchers.clear(), this.gate.rearm();
		for (let t of this.reconnectingHandlers) t(e);
		let n = await t.runAsync();
		if (this.reconnect = null, this.reconnectAttempt = t.nextAttempt, n) {
			this.started = !0;
			for (let e of this.reconnectedHandlers) Promise.resolve(e()).catch((e) => {
				c("reattach after reconnect failed.", e);
			});
		} else if (this.gate.failure === null) {
			s("reconnecting gave up: the server would have let the page's runtime go by now.", e);
			for (let t of this.closedHandlers) t(e ?? /* @__PURE__ */ Error("the connection to the server did not come back."));
		}
	}
	get instanceId() {
		return this.connection.connectionId ?? null;
	}
	get isReconnecting() {
		return this.reconnect !== null;
	}
	get isReattaching() {
		return this.gate.reattaching;
	}
	onChanges(e) {
		this.connection.on("ui.changes", this.inbound.pushed((t, n) => e(t, z0(n))));
	}
	onCommandResult(e) {
		this.connection.on("ui.commandResult", this.inbound.pushed((t, n) => e(t, z0(n))));
	}
	onReconnecting(e) {
		this.reconnectingHandlers.push(e);
	}
	onReconnected(e) {
		this.reconnectedHandlers.push(e);
	}
	onClosed(e) {
		this.closedHandlers.push(e);
	}
	onCommandExpired(e) {
		this.expiredHandlers.push(e);
	}
	async startAsync() {
		if (!(this.started || this.connection.state !== $.Disconnected)) try {
			await this.connection.start(), this.started = !0, this.connected = !0, l("SignalR connected.", {
				connectionId: this.connection.connectionId,
				windowId: this.windowId
			});
		} catch (e) {
			throw this.started = !1, c("SignalR connection failed.", e), e;
		}
	}
	async stopAsync() {
		if (this.reconnect?.stop(), this.connection.state !== $.Disconnected) {
			this.stopping = !0;
			try {
				await this.connection.stop();
			} finally {
				this.stopping = !1;
			}
			this.started = !1;
		}
	}
	close(e) {
		this.gate.close(e), this.stopAsync().catch((e) => s("stopping the lost connection failed.", e));
	}
	async attachAsync(e) {
		try {
			let t = await this.invokeCoreAsync("AttachAsync", [e]);
			return this.gate.answered(t), this.reconnectSince = null, this.reconnectAttempt = 0, typeof t.retentionMilliseconds == "number" && t.retentionMilliseconds > 0 && (this.reconnectWindow = t.retentionMilliseconds), t;
		} catch (e) {
			throw this.gate.rearm(), e;
		}
	}
	async processEventAsync(e, t = performance.now()) {
		return await this.invokeAsync("ProcessEventAsync", [e], (e) => this.inbound.answered(e, (e) => e.changes, L0), t);
	}
	async requestLeaveAsync(e) {
		return await this.invokeAsync("RequestLeaveAsync", [{ target: e }], (e) => this.inbound.answered(e, (e) => e.changes, L0));
	}
	async navigateInPlaceAsync(e) {
		return await this.invokeAsync("NavigateInPlaceAsync", [{ parameters: e }], (e) => this.inbound.answered(e, (e) => e.changes, L0));
	}
	async processChangeSetAsync(e, t) {
		try {
			await this.invokeAsync("ProcessChangeSetAsync", [e], (e) => this.inbound.answered(e, (e) => e, R0, t));
		} catch (e) {
			throw this.isReconnecting && this.gate.failure === null ? new Sm(e) : e;
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
		await this.invokeAsync("RequestItemWindowAsync", [e], (e) => this.inbound.answered(e, (e) => e, R0));
	}
	async invokeAsync(e, t, n, r) {
		let i = window.setTimeout(() => s("call waiting behind the attach.", { methodName: e }), F0);
		try {
			let t = r === void 0 ? null : xm(r, performance.now(), this.droppedAt, this.gate.reattaching, I0);
			await (r === void 0 || t === null && !this.gate.isPending ? this.gate.wait() : this.waitBoundedAsync(e, t));
		} finally {
			window.clearTimeout(i);
		}
		return await this.invokeCoreAsync(e, t, n);
	}
	async waitBoundedAsync(e, t) {
		let n = 0, r = () => {}, i = new Promise((t, n) => {
			r = () => n(new bm(e, I0));
		}), a = () => {
			n = window.setTimeout(r, I0);
		};
		t === null ? this.dropWatchers.add(a) : t <= 0 ? r() : n = window.setTimeout(r, t);
		try {
			await Promise.race([i, this.gate.wait()]);
		} catch (e) {
			if (e instanceof bm) for (let e of this.expiredHandlers) e();
			throw e;
		} finally {
			window.clearTimeout(n), this.dropWatchers.delete(a);
		}
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
			if (this.reconnect !== null) throw Error("the connection to the server is reconnecting.");
			if (this.connection.state === $.Disconnected) this.started = !1, await this.startAsync();
			else throw Error(`SignalR connection is not ready. State: ${this.connection.state}.`);
		}
	}
}, V0 = "content-fills", H0 = "content", U0 = "data-ui-root", W0 = "--ui-height", G0 = "var(--ui-fill-height";
function K0(e) {
	let t = e.parentElement;
	if (t === null || t.getAttribute("data-ui-region") !== "content") return;
	let n = t.parentElement;
	if (n === null || !n.hasAttribute(U0)) return;
	let r = e.style.getPropertyValue(W0).trimStart().startsWith(G0);
	n.hasAttribute("data-ui-content-fills") !== r && n.toggleAttribute(Rn, r);
}
//#endregion
//#region src/updates/form-owner.ts
var q0 = "form-owner", J0 = "ui-form-";
function Y0(e) {
	return J0 + e.replace(/[ \t\n\f\r]/g, "_");
}
function X0(e, t) {
	if (typeof t != "string" || t.trim().length === 0) {
		e.hasAttribute("form") && e.removeAttribute("form");
		return;
	}
	let n = Y0(t);
	Q0(n), e.getAttribute("form") !== n && e.setAttribute("form", n);
}
function Z0(e) {
	for (let t of e.querySelectorAll("[form]")) {
		let e = t.getAttribute("form");
		e !== null && e.startsWith(J0) && Q0(e);
	}
}
function Q0(e) {
	let t = $0();
	if (t.querySelector(`form[id="${S(e)}"]`) !== null) return;
	let n = document.createElement("form");
	n.setAttribute("id", e), n.setAttribute("method", "dialog"), n.setAttribute("novalidate", ""), t.appendChild(n);
}
function $0() {
	let e = document.body.querySelector(`[${un}]`);
	if (e !== null) return e;
	let t = document.createElement("div");
	return t.setAttribute(un, ""), t.setAttribute("hidden", ""), document.body.appendChild(t);
}
//#endregion
//#region src/interactions/legacy-commands.ts
var e2 = document;
function t2() {
	try {
		return e2.execCommand("copy");
	} catch {
		return !1;
	}
}
function n2(e) {
	try {
		return typeof e2.execCommand == "function" && e2.execCommand("insertText", !1, e);
	} catch {
		return !1;
	}
}
//#endregion
//#region src/interactions/lightbox.ts
var r2 = "ui-lightbox", i2 = "ui-lightbox-title", a2 = new zx("data-ui-lightbox-part"), o2 = "data-ui-lightbox-set", s2 = "data-ui-lightbox-slot", c2 = "data-ui-lightbox-still", l2 = "--ui-lightbox-shift", u2 = 16, d2 = 1 / 5, f2 = null, p2 = null, m2 = null;
function h2(e, t, n) {
	let r = t.filter((e) => wo(e.source) !== null);
	if (r.length === 0) return s("show image effect carries no picture the page may fetch.", t), !1;
	f2 ??= b2(e), (f2.dialog.hasAttribute("hidden") || !f2.dialog.isConnected) && document.body.append(f2.dialog);
	let i = t.slice(0, Math.max(0, n)).filter((e) => wo(e.source) === null).length;
	m2 = null, p2 = {
		pictures: r,
		index: y2(n - i, r.length)
	}, f2.dialog.toggleAttribute(o2, r.length > 1);
	for (let e of f2.neighbours) e.hidden = r.length < 2;
	return O2(f2), k2(f2, p2), e.open(r2);
}
function g2(e, t, n) {
	let r = _2(e);
	if (r === null) return null;
	let i = e.closest(`[${b}]`);
	if (!t || i === null) return {
		pictures: [r],
		start: 0
	};
	let a = [], o = 0;
	for (let t of [...n(e)].filter((e) => e.closest(`[${b}]`) === i).sort(v2)) {
		let n = t === e ? r : _2(t);
		n !== null && (t === e && (o = a.length), a.push(n));
	}
	return {
		pictures: a,
		start: o
	};
}
function _2(e) {
	let t = e.matches("img") ? e : e.querySelector("img");
	if (t === null || t.closest("[data-ui-image-failed]") !== null) return null;
	let n = t.currentSrc, r = wo(typeof n == "string" && n.length > 0 ? n : t.getAttribute("src") ?? "");
	return r === null ? null : {
		source: r,
		altText: t.getAttribute("alt") ?? ""
	};
}
function v2(e, t) {
	return e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}
function y2(e, t) {
	return Math.min(Math.max(0, Math.trunc(Number.isFinite(e) ? e : 0)), t - 1);
}
function b2(e) {
	let { dialog: t, surface: n } = Rx({
		key: r2,
		className: "ui-lightbox",
		surfaceClassName: "ui-lightbox__surface",
		role: "dialog",
		labelledBy: i2,
		closesOnEscapeAndBackdrop: !0
	}), r = a2.element("h2", "ui-lightbox__title"), i = S2("ui-lightbox__close", "close"), a = a2.element("div", "ui-lightbox__stage"), [o, s] = x2("previous"), [c, l] = x2("current"), [u, d] = x2("next"), f = a2.element("div", "ui-lightbox__nav"), p = S2("ui-lightbox__step ui-lightbox__step--previous", "previous"), m = S2("ui-lightbox__step ui-lightbox__step--next", "next"), h = a2.element("span", "ui-lightbox__counter ui-text-type--caption"), g = a2.element("span", "ui-lightbox__count-room"), _ = a2.element("span", "ui-lightbox__count"), v = a2.element("p", "ui-lightbox__caption ui-text-type--body", "caption");
	return r.id = i2, _.setAttribute("aria-live", "polite"), g.setAttribute("aria-hidden", "true"), D.write(r, null, "ui.lightbox.label"), D.write(i, "aria-label", "ui.action.close"), D.write(p, "aria-label", "ui.lightbox.previous"), D.write(m, "aria-label", "ui.lightbox.next"), h.append(g, _), f.append(p, h, m), c.append(f), a.append(o, c, u), n.append(r, i, a, v), t.addEventListener("click", (t) => {
		switch (a2.pressed(t)) {
			case "close":
				e.dismiss(r2);
				break;
			case "previous":
				C2(-1);
				break;
			case "next": C2(1);
		}
	}), t.addEventListener("keydown", (e) => {
		if (e.defaultPrevented || !M(e) || p2 === null || p2.pictures.length < 2) return;
		let n = e.key === "ArrowLeft" ? -1 : +(e.key === "ArrowRight");
		n !== 0 && (e.preventDefault(), C2(j2(t) ? -n : n));
	}), M2(t, a), {
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
function x2(e) {
	let t = a2.element("div", "ui-lightbox__figure"), n = a2.element("img", "ui-lightbox__picture", e === "current" ? "picture" : void 0);
	return t.setAttribute(s2, e), n.decoding = "async", n.draggable = !1, n.addEventListener("error", () => n.setAttribute(lt, "")), e !== "current" && t.setAttribute("aria-hidden", "true"), t.append(n), [t, n];
}
function S2(e, t) {
	let n = a2.element("button", e, t);
	return n.type = "button", n;
}
function C2(e) {
	if (f2 === null || p2 === null || p2.pictures.length < 2) return;
	let t = f2;
	if (E2(t), Xh()) {
		D2(t, e), O2(t), k2(t, p2);
		return;
	}
	let n = {
		by: e,
		landed: !1
	}, r = j2(t.dialog) ? -1 : 1;
	m2 = n, t.stage.removeAttribute(c2), t.stage.style.setProperty(l2, `${-e * r * w2(t.stage)}px`), Qh(t.current, z.normal + 100, () => T2(t, n));
}
function w2(e) {
	return e.getBoundingClientRect().width + u2;
}
function T2(e, t) {
	if (m2 !== t || t.landed) return;
	D2(e, t.by), t.landed = !0;
	let n = typeof e.picture.decode == "function" ? e.picture.decode().catch(() => void 0) : null;
	n === null ? E2(e) : n.then(() => {
		m2 === t && E2(e);
	});
}
function E2(e) {
	let t = m2;
	t !== null && p2 !== null && (m2 = null, t.landed || D2(e, t.by), O2(e), k2(e, p2));
}
function D2(e, t) {
	if (p2 === null) return;
	let n = p2.pictures.length;
	p2.index = ((p2.index + t) % n + n) % n, A2(e.picture, p2.pictures[p2.index].source);
}
function O2(e) {
	e.stage.setAttribute(c2, ""), e.stage.style.setProperty(l2, "0px"), e.stage.getBoundingClientRect();
}
function k2(e, t) {
	let n = t.pictures.length, r = t.pictures[t.index];
	A2(e.picture, r.source), A2(e.previousPicture, t.pictures[(t.index + n - 1) % n].source), A2(e.nextPicture, t.pictures[(t.index + 1) % n].source), D.writeValue(e.picture, "alt", r.altText ?? r.caption ?? ""), D.writeValue(e.caption, null, r.caption ?? ""), e.caption.hidden = r.caption === void 0, D.write(e.count, null, "ui.lightbox.counter", {
		index: t.index + 1,
		count: n
	}), D.write(e.countRoom, null, "ui.lightbox.counter", {
		index: n,
		count: n
	});
}
function A2(e, t) {
	e.getAttribute("src") !== t && (e.removeAttribute(lt), e.src = t);
}
function j2(e) {
	return getComputedStyle(e).direction === "rtl";
}
function M2(e, t) {
	hv(e, {
		axis: "x",
		begins: (e) => e.pointerType !== "touch" || f2 === null || p2 === null || p2.pictures.length < 2 ? !1 : (E2(f2), !0),
		start: () => t.setAttribute(c2, ""),
		follow: (e) => t.style.setProperty(l2, `${e}px`),
		end: (n, r, i) => {
			i && N2(n, window.innerWidth, r) ? C2((j2(e) ? n > 0 : n < 0) ? 1 : -1) : (t.removeAttribute(c2), t.style.setProperty(l2, "0px"));
		}
	});
}
function N2(e, t, n) {
	return Math.abs(e) > t * d2 || Math.abs(n) > .5 && Math.abs(e) > 6;
}
//#endregion
//#region src/interactions/notification-engine.ts
var P2 = "ui-notification-host", F2 = "ui-notification", I2 = "ui-notification--leaving", L2 = "ui-notification__message", R2 = "ui-notification__title", z2 = "ui-notification__action", B2 = "ui-notification__close", V2 = 5e3, H2 = 8e3, U2 = "ui-notification--connection", W2 = "--ui-notification-lift", G2 = /* @__PURE__ */ new Set([
	"info",
	"success",
	"warning",
	"danger",
	"primary",
	"accent"
]), K2 = class {
	root;
	components;
	durationMs;
	host = null;
	announcer;
	focusOrigins = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, this.durationMs = e.durationMs ?? V2, this.ensureHost(), this.announcer = jj(this.root instanceof Document ? this.root.body : this.root), Q_((e) => e instanceof Element && e.closest(`.${F2}`) !== null);
	}
	announce(e, t) {
		return this.announcer.announce(e, t);
	}
	show(e) {
		let t = Fw(e.severity), n = document.createElement("div");
		n.className = G2.has(t) ? `${F2} ${F2}--${t}` : F2, n.classList.toggle(U2, e.connection === !0), t === "danger" && n.setAttribute("role", "alert");
		let r = document.createElement("span");
		if (r.className = L2, e.title !== void 0) {
			let t = document.createElement("span");
			t.className = R2, D.writeValue(t, null, e.title), n.append(t);
		}
		typeof e.message == "string" ? r.textContent = e.message : D.writeValue(r, null, e.message), n.append(r);
		let i = document.createElement("button");
		return i.type = "button", i.className = `${B2} ${Hi}`, D.write(i, "aria-label", "ui.action.close"), D.write(i, ze, "ui.action.close"), i.addEventListener("click", () => this.dismiss(n)), n.append(i), e.action !== void 0 && n.append(X2(e.action, e.sticky === !0 ? null : () => this.dismiss(n))), n.addEventListener("keydown", (e) => {
			e.key !== "Escape" || e.defaultPrevented || j(e) || (e.preventDefault(), this.dismiss(n));
		}), n.addEventListener("focusin", (e) => {
			let t = e.relatedTarget;
			t instanceof HTMLElement && !n.contains(t) && this.focusOrigins.set(n, t);
		}), q2(() => {
			if (n.classList.contains(I2)) return;
			let t = this.ensureHost();
			J2(t), t.append(n), e.sticky !== !0 && this.standFor(n, e);
		}), n;
	}
	standFor(e, t) {
		let n = t.durationMs !== void 0 && t.durationMs > 0 ? t.durationMs : t.action === void 0 ? this.durationMs : H2, r = !1, i = !1, a = window.setTimeout(() => this.dismiss(e), n), o = () => window.clearTimeout(a), s = () => {
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
		e.classList.contains(I2) || (e.classList.add(I2), e.isConnected && (this.returnFocus(e), Xh() || typeof e.animate != "function" ? e.remove() : window.setTimeout(() => Y2(e), z.fast)));
	}
	returnFocus(e) {
		if (!e.contains(document.activeElement)) return;
		let t = [...e.parentElement?.children ?? []].find((t) => t !== e && !t.classList.contains(I2));
		mm(um(this.focusOrigins.get(e), this.components) ?? t?.querySelector(`.${B2}`) ?? null, e);
	}
	ensureHost() {
		if (this.host !== null && this.host.isConnected) return this.host;
		let e = this.root instanceof Document ? this.root.body : this.root, t = e.querySelector(`.${P2}`), n = t ?? document.createElement("div");
		return n.classList.add(P2), n.setAttribute("role", "status"), n.setAttribute("aria-live", "polite"), t === null && e.append(n), this.host = n, n;
	}
};
function q2(e) {
	if (lJ(document.visibilityState)) {
		e();
		return;
	}
	let t = () => {
		lJ(document.visibilityState) && (document.removeEventListener("visibilitychange", t), e());
	};
	document.addEventListener("visibilitychange", t);
}
function J2(e) {
	let t = window.innerHeight - c_(window.innerHeight);
	t > 0 ? e.style.setProperty(W2, `${Math.round(t)}px`) : e.style.removeProperty(W2);
}
function Y2(e) {
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
function X2(e, t) {
	let n = document.createElement("button"), r = !1;
	return n.type = "button", n.className = `${z2} ui-button ui-button--primary ui-button--small`, typeof e.label == "string" ? n.textContent = e.label : D.writeValue(n, null, e.label), n.addEventListener("click", () => {
		if (r) return;
		let n = e.run();
		t !== null && (r = !0, n === void 0 ? t() : n.then((e) => {
			e ? t() : r = !1;
		}, (e) => {
			r = !1, s("a notification's action failed.", e);
		}));
	}), n;
}
function Z2(e, t) {
	let n = Q2(e), r = e?.label;
	if (n !== void 0) {
		if (!E(r) && !Mc(r)) s("a notification's action carries no words.", e);
		else return {
			label: r,
			run: () => t(n)
		};
	}
}
function Q2(e) {
	return e != null && typeof e.id == "string" && e.id.length > 0 ? e.id : void 0;
}
//#endregion
//#region src/effects/development-report.ts
function $2(e) {
	let t = e.message;
	c(typeof t == "string" && t.length > 0 ? t : "the server reported a mistake with no words.", e);
}
//#endregion
//#region src/effects/insert-text.ts
function e4(e, t, n) {
	let r = e.itemKey === !0 ? t4(n) : e.text;
	if (typeof r != "string") {
		s(e.itemKey === !0 ? "insert text effect reads the row's key but ran for no row." : "insert text effect carries no text.", e);
		return;
	}
	let i = n4(t);
	i === null ? s("insert text effect target holds no text field.", e) : r4(i, r);
}
function t4(e) {
	let t = e.length === 0 ? null : e[e.length - 1];
	return t == null ? null : String(t);
}
function n4(e) {
	if (ad(e)) return e;
	for (let t of e.querySelectorAll("input, textarea")) if (ad(t)) return t;
	return null;
}
function r4(e, t) {
	if (t.length === 0 || e.readOnly || e.disabled || O(e) || A(e)) return !1;
	let n = e.value, r = e.selectionStart !== null, i = e.selectionStart ?? n.length, a = e.selectionEnd ?? i;
	return e.maxLength >= 0 && n.length - (a - i) + t.length > e.maxLength ? !1 : (document.activeElement !== e && e.focus({ preventScroll: !0 }), r && e.setSelectionRange(i, a), document.activeElement === e && n2(t) && e.value !== n || (r ? e.setRangeText(t, i, a, "end") : e.value = n + t, e.dispatchEvent(new Event("input", { bubbles: !0 }))), !0);
}
//#endregion
//#region src/effects/navigation-url.ts
function i4(e) {
	let t = e.request?.route;
	return t == null || t.length === 0 ? null : a4(t, e.request?.parameters ?? null);
}
function a4(e, t) {
	let n = o4(t);
	if (n.length === 0) return e;
	let r = e.indexOf("#"), i = r < 0 ? e : e.slice(0, r), a = r < 0 ? "" : e.slice(r);
	return `${i}${i.includes("?") ? i.endsWith("?") || i.endsWith("&") ? "" : "&" : "?"}${n}${a}`;
}
function o4(e) {
	if (e === null) return "";
	let t = new URLSearchParams();
	for (let [n, r] of Object.entries(e)) if (r != null) for (let e of Array.isArray(r) ? r : [r]) e != null && t.append(n, s4(e));
	return t.toString();
}
function s4(e) {
	return typeof e == "object" ? JSON.stringify(e) : String(e);
}
//#endregion
//#region src/effects/scroller.ts
function c4(e, t) {
	let n = u4([e, ...e.querySelectorAll("*")], t);
	if (n !== null) return n;
	let r = [];
	for (let t = e.parentElement; t !== null; t = t.parentElement) r.push(t);
	return u4(r, t) ?? l4(t);
}
function l4(e) {
	let t = typeof document > "u" ? null : document.scrollingElement ?? null;
	return t !== null && d4(t, e) ? t : null;
}
function u4(e, t) {
	let n = null;
	for (let r of e) if (T_(r, t)) {
		if (d4(r, t)) return r;
		n ??= r;
	}
	return n;
}
function d4(e, t) {
	return t ? e.scrollHeight > e.clientHeight : e.scrollWidth > e.clientWidth;
}
//#endregion
//#region src/effects/shown-text.ts
var f4 = `.${Ki}`;
function p4(e) {
	let t = (e.hasAttribute("data-ui-text-description") ? m4(e) : null) ?? e;
	return (("innerText" in t && typeof t.innerText == "string" ? t.innerText : t.textContent) ?? "").trim();
}
function m4(e) {
	for (let t of e.querySelectorAll(f4)) if (t.closest("[data-ui-id]") === e) return t;
	return null;
}
//#endregion
//#region src/effects/effect-registry.ts
var h4 = class {
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
		this.handlers.set(Ea(e), t);
	}
	applyAll(e, t) {
		if (e != null) for (let n of e) this.apply({
			effect: n,
			dom: t
		});
	}
	apply(e) {
		let t = Ea(e.effect?.kind), n = t.length === 0 ? void 0 : this.handlers.get(t);
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
			let t = i4(e.effect);
			t === null ? s("navigate effect carries no route.", e.effect) : yo(t) ? this.leaveFor(t) : s("navigate effect names no route of this site; not followed.", e.effect);
		}), this.register("NavigateBack", (e) => {
			if (this.address?.back() === !0) return;
			let t = e.effect.fallback;
			typeof t != "string" || !yo(t) ? s("navigate back effect has nothing to go back to and names no route of this site; not followed.", e.effect) : this.leaveFor(t);
		}), this.register("ReplaceAddress", (e) => {
			this.writeAddress(e, (e, t) => e.replace(t));
		}), this.register("PushAddress", (e) => {
			this.writeAddress(e, (e, t) => e.push(t));
		}), this.register("SetTheme", (e) => {
			let t = e.effect, n = Aa(t.mode), r = n === "Unknown" ? "auto" : n.toLowerCase();
			document.documentElement.getAttribute("data-ui-theme") !== r && document.documentElement.setAttribute(Jr, r), t.stored !== !0 && this.reportTheme?.(r);
		}), this.register("Focus", (e) => {
			let t = x4(e);
			t !== null && (UY(t), C4(t));
		}), this.register("ScrollTo", (e) => {
			let t = x4(e);
			if (t === null) return;
			let n = e.effect, r = Da(n.behavior), i = Oa(n.block);
			UY(t), t.scrollIntoView({
				behavior: S4(r),
				block: i === "Unknown" ? "nearest" : i.toLowerCase()
			});
		}), this.register("ScrollToItem", (e) => {
			let t = x4(e);
			if (t === null) return;
			let n = e.effect, r = kY(t);
			if (r === null || typeof n.key != "string" || n.key.length === 0) {
				s("scroll to item effect names no items host or no key.", e.effect);
				return;
			}
			let i = Oa(n.block);
			UY(Ed(r)), AY(r, n.key, i === "Unknown" ? "Start" : i, S4(Da(n.behavior))) || s("scroll to item effect names a row the host has not drawn.", e.effect);
		}), this.register("Scroll", (e) => {
			let t = x4(e);
			if (t === null) return;
			let n = e.effect, r = ja(n.axis) !== "Horizontal", i = c4(t, r);
			if (i === null) {
				s("scroll effect target has no scrollable element.", e.effect);
				return;
			}
			let a = r ? i.clientHeight : i.clientWidth, o = (r ? i.scrollHeight : i.scrollWidth) - a, c = r ? i.scrollTop : i.scrollLeft, l = ka(n.position), u;
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
			let d = S4(Da(n.behavior));
			UY(i), r && l === "End" && qY(i) && HY(i), i.scrollTo(r ? {
				top: u,
				behavior: d
			} : {
				left: u,
				behavior: d
			});
		}), this.register("Show", (e) => {
			b4(x4(e), null);
		}), this.register("Hide", (e) => {
			b4(x4(e), "hidden");
		}), this.register("Collapse", (e) => {
			b4(x4(e), "collapsed");
		}), this.register("CopyToClipboard", (e) => {
			let t = w4(e, this.valueReaders);
			t !== null && T4(t).catch((e) => s("copy to clipboard failed.", e));
		}), this.register("InsertText", (e) => {
			let t = x4(e);
			t !== null && e4(e.effect, t, e.row ?? []);
		}), this.register("OpenPicker", (e) => {
			let t = x4(e);
			t !== null && !Gb(t) && s("open picker effect names no file or image input.", e.effect);
		}), this.register("OpenDialog", (e) => {
			this.applyDialogEffect(e, "OpenDialog", (e, t) => e.open(t));
		}), this.register("ShowImage", (e) => {
			let t = e.effect;
			if (this.dialogs === void 0) {
				s("show image effect arrived but no dialog engine is wired up.", t);
				return;
			}
			if (t.target === void 0 || t.target === null) {
				h2(this.dialogs, _4(t.images), t.startIndex ?? 0);
				return;
			}
			let n = x4(e), r = n === null ? null : g2(n, t.rows === !0, (t) => e.dom.findEveryComponent(T(t)));
			r === null ? s("show image effect names a component that shows no picture.", t) : h2(this.dialogs, r.pictures, r.start);
		}), this.register("CloseDialog", (e) => {
			let t = e.effect.raisesClose === !0;
			this.applyDialogEffect(e, "CloseDialog", (e, n) => t ? e.dismiss(n) : e.close(n));
		}), this.register("DownloadFile", (e) => {
			let t = e.effect;
			if (t.requestPath === void 0 || t.requestPath.length === 0) {
				s("download effect carries no path.", e.effect);
				return;
			}
			if (!ho(t.requestPath)) {
				s("download effect refused: the path's scheme is not one a link may carry.", e.effect);
				return;
			}
			let n = t.requestPath;
			Dm.load(() => {
				let e = document.createElement("a");
				e.href = n, e.download = t.fileName ?? "", e.style.display = "none", document.body.appendChild(e), e.click(), e.remove();
			});
		}), this.register("ShowNotification", (e) => {
			let t = e.effect;
			!E(t.message) && !Mc(t.message) ? s("show notification effect carries no message.", e.effect) : this.notifications === void 0 ? s("show notification effect arrived but no notification engine is wired up.", t.message) : this.notifications.show({
				message: t.message,
				severity: t.severity,
				durationMs: typeof t.durationMs == "number" ? t.durationMs : void 0,
				action: this.runAction === void 0 ? void 0 : Z2(t.action, this.runAction)
			});
		}), this.register("RequestNotificationPermission", () => {
			uJ() !== void 0 && Notification.requestPermission().then(() => this.clientStateChanged?.()).catch((e) => s("asking for the notification permission failed.", e));
		}), this.register("ShowSystemNotification", (e) => this.showSystemNotification(e.effect)), this.register("Announce", (e) => {
			let t = e.effect;
			!E(t.message) && !Mc(t.message) ? s("announce effect carries no message.", e.effect) : this.notifications === void 0 ? s("announce effect arrived but no notification engine is wired up.", t.message) : this.notifications.announce(t.message, Ma(t.politeness) === "Assertive" ? "assertive" : "polite");
		}), this.register("DevelopmentReport", (e) => $2(e.effect));
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
		if (!E(t) && !Mc(t)) {
			s("system notification effect carries no title.", e);
			return;
		}
		let n = E(e.body) || Mc(e.body) ? e.body : void 0, r = typeof e.address == "string" && yo(e.address) ? e.address : void 0, i = () => {
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
		if (e.when !== "Always" && lJ(document.visibilityState)) {
			i();
			return;
		}
		let a = Q2(e.action);
		hJ({
			title: g4(t),
			body: n === void 0 ? void 0 : g4(n),
			tag: e.tag ?? "",
			icon: typeof e.icon == "string" && yo(e.icon) ? e.icon : v4(),
			silent: e.silent === !0,
			requireInteraction: e.requireInteraction === !0,
			address: r ?? y4(),
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
		return t !== void 0 && n !== void 0 && _J(t) ? {
			label: E(e.addressLabel) || Mc(e.addressLabel) ? e.addressLabel : { key: "ui.notification.open" },
			run: () => n(t)
		} : this.runAction === void 0 ? void 0 : Z2(e.action, this.runAction);
	}
};
function g4(e) {
	return E(e) ? D.translate(e.key, e.args) : Mc(e) ? D.resolveText(e.text) : "";
}
function _4(e) {
	let t = [];
	for (let n of e ?? []) typeof n?.source == "string" && t.push({
		source: n.source,
		caption: E(n.caption) || Mc(n.caption) ? n.caption : void 0,
		altText: E(n.altText) || Mc(n.altText) ? n.altText : void 0
	});
	return t;
}
function v4() {
	let e = document.querySelector("link[rel~='icon']")?.href;
	return e === void 0 || e.startsWith("data:") ? void 0 : e;
}
function y4() {
	return window.location.pathname + window.location.search + window.location.hash;
}
function b4(e, t) {
	if (e === null) return;
	let n = yh();
	for (let n of wi) t === null ? e.removeAttribute(n) : e.setAttribute(n, t);
	n !== null && bh(n);
}
function x4(e) {
	let t = e.effect.target;
	if (t === void 0 || t.id === void 0) return s("targeted client effect carries no resolved component address.", e.effect), null;
	let n = e.dom.findComponent(w(t.id), t.dynamicParameters ?? []);
	return n === null && s("client effect target was not found in the DOM.", e.effect), n;
}
function S4(e) {
	return e === "Smooth" && !Xh() ? "smooth" : "auto";
}
function C4(e) {
	if (e instanceof HTMLElement && (e.tabIndex >= 0 || e.matches(Cp))) {
		e.focus();
		return;
	}
	let t = Jp(e);
	t === null ? s("focus effect target has nothing focusable.", e) : t.focus();
}
function w4(e, t) {
	let n = e.effect;
	if (typeof n.text == "string") return n.text;
	let r = x4(e);
	if (r === null) return null;
	if (gu(r) === null) {
		let t = p4(r);
		return t.length === 0 && s("copy to clipboard effect target holds no value and shows no words.", e.effect), t.length === 0 ? null : t;
	}
	return t === void 0 ? (s("copy to clipboard effect names a component but no value reader is wired up.", e.effect), null) : uu(t.readHeld(r));
}
async function T4(e) {
	if (navigator.clipboard !== void 0) try {
		await navigator.clipboard.writeText(e);
		return;
	} catch {}
	if (!E4(e)) throw Error("neither the clipboard API nor the selection command took the text.");
}
function E4(e) {
	let t = document.createElement("textarea");
	t.value = e, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.opacity = "0", document.body.appendChild(t), t.select();
	try {
		return t2();
	} finally {
		t.remove();
	}
}
//#endregion
//#region src/interactions/dialog-engine.ts
var D4 = class {
	root;
	components;
	discardForm;
	returnFocusByKey = /* @__PURE__ */ new Map();
	swipes = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, this.discardForm = e.discardForm ?? null, this.root.addEventListener("mousedown", (e) => O4(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0);
	}
	open(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (!t.hasAttribute("hidden")) return !0;
		k4(t), t.removeAttribute("hidden");
		let n = t.querySelector(".ui-dialog__surface") ?? t, r = Jp(t), i = Vp() && ad(r);
		i && !n.hasAttribute("tabindex") && (n.tabIndex = -1);
		let a = sm(n, i ? n : r);
		return a !== null && this.returnFocusByKey.set(e, a), A4(t) && this.swipes.set(e, xv(n, n, () => this.dismiss(e))), !0;
	}
	close(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (t.hasAttribute("hidden")) return !0;
		let n = this.returnFocusByKey.get(e);
		this.returnFocusByKey.delete(e), this.swipes.get(e)?.(), this.swipes.delete(e);
		let r = document.activeElement, i = xy(r), a = t.contains(r) ? t : i !== null && t.contains(i.owner) ? i.popup : null;
		return a !== null && mm(um(n, this.components), a), t.setAttribute("hidden", ""), !0;
	}
	closeAll() {
		for (let e of this.root.querySelectorAll(`[${N_}]:not([hidden])`)) {
			let t = e.getAttribute(N_);
			t !== null && this.close(t);
		}
	}
	find(e) {
		return this.root.querySelector(`[${N_}="${S(e)}"]`);
	}
	handleClick(e) {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest(`[${F_}]`);
		if (n === null) return;
		let r = n.closest(`[${N_}]`);
		if (!(r instanceof HTMLElement) || r.hasAttribute("hidden") || !r.hasAttribute("data-ui-dialog-close-backdrop")) return;
		let i = r.getAttribute(N_);
		i !== null && this.dismiss(i);
	}
	handleKeydown(e) {
		if (e.defaultPrevented || j(e)) return;
		let t = this.getTopmostOpen();
		if (t === null || H_(t)) return;
		let n = e.target instanceof Element ? e.target.closest(`[${N_}]:not([hidden])`) : null, r = t.hasAttribute("data-ui-dialog-modal") || n === t ? t : n;
		if (e.key === "Escape" && r !== null && r.hasAttribute("data-ui-dialog-close-escape") && !$_(e.target) && !Xu(e)) {
			let t = r.getAttribute(N_);
			t !== null && (e.preventDefault(), this.dismiss(t));
		} else e.key === "Tab" && t.hasAttribute("data-ui-dialog-modal") && $p(t, e);
	}
	dismiss(e) {
		let t = this.find(e), n = t !== null && !t.hasAttribute("hidden");
		return n && t.querySelector(`[data-ui-form-id="${S(e)}"]`) !== null && this.discardForm?.(e), !this.close(e) || !n || t === null ? !1 : (t.querySelector(x)?.dispatchEvent(new Event("close", { bubbles: !0 })), !0);
	}
	getTopmostOpen() {
		return B_(this.root);
	}
};
function O4(e) {
	let t = e.target instanceof Element ? e.target.closest(`[${F_}]`) : null;
	t !== null && t.closest("[data-ui-dialog]:not([hidden])") !== null && e.preventDefault();
}
function k4(e) {
	let t = null;
	for (let n of e.parentElement?.children ?? []) n !== e && n.matches("[data-ui-dialog]:not([hidden])") && (t = n);
	t !== null && (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0 && t.after(e);
}
function A4(e) {
	return e.getAttribute("data-ui-dialog-placement") === "bottom" && (e.hasAttribute("data-ui-dialog-close-backdrop") || e.hasAttribute("data-ui-dialog-close-escape"));
}
//#endregion
//#region src/interactions/leave-dialog.ts
var j4 = "ui-leave", M4 = new zx("data-ui-leave-part"), N4 = "560px", P4 = null, F4 = null;
function I4(e, t) {
	P4 ??= L4();
	let n = P4;
	n.isConnected || document.body.append(n), R4(n, "title", D.text("ui.leave.title")), R4(n, "message", D.text("ui.leave.message")), R4(n, "stay", D.text("ui.leave.stay")), R4(n, "leave", D.text("ui.leave.confirm")), F4 = {
		dialogs: e,
		leave: t
	}, e.open(j4);
}
function L4() {
	let { dialog: e, surface: t } = Rx({
		key: j4,
		className: "ui-leave-dialog",
		role: "alertdialog",
		labelledBy: "ui-leave-title",
		describedBy: "ui-leave-message",
		closesOnEscapeAndBackdrop: !0
	});
	t.style.setProperty("--ui-max-width-sm", N4);
	let n = M4.element("h2", "ui-leave-dialog__title ui-text-type--subtitle", "title"), r = M4.element("p", "ui-leave-dialog__message ui-text-type--body", "message");
	return n.id = "ui-leave-title", r.id = "ui-leave-message", t.append(n, r, M4.actions(M4.button("ui-button--ghost", "stay"), M4.button("ui-button--danger", "leave"))), e.addEventListener("click", (e) => {
		let t = M4.pressed(e);
		if (t !== "stay" && t !== "leave") return;
		let n = F4;
		F4 = null, n?.dialogs.close(j4), t === "leave" && n?.leave();
	}), e;
}
function R4(e, t, n) {
	let r = M4.find(e, t);
	r !== null && r.textContent !== n && (r.textContent = n);
}
//#endregion
//#region src/interactions/leave-guard.ts
var z4 = class {
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
		if (V4(e)) {
			e.preventDefault();
			return;
		}
		if (this.released) return;
		let t = B4(e, this.options.window.location.href);
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
function B4(e, t) {
	if (e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return null;
	let n = e.target, r = typeof n?.closest == "function" ? n.closest("a[href]") : null;
	if (r === null || r.hasAttribute("download") || V4(e)) return null;
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
	return yo(s) ? s : null;
}
function V4(e) {
	let t = e.target;
	if (typeof t?.closest != "function") return !1;
	let n = t.closest("a[href]"), r = t.closest(`[${et}]`);
	return n !== null && r !== null && r !== n && n.contains(r);
}
//#endregion
//#region src/interactions/navigation-progress.ts
var H4 = 200, U4 = 1e4, W4 = "ui-navigation-progress", G4 = class {
	window;
	shownAfter;
	givenUpAfter;
	bar = null;
	timer = null;
	wait = null;
	constructor(e) {
		this.window = e.window, this.shownAfter = e.shownAfterMilliseconds ?? H4, this.givenUpAfter = e.givenUpAfterMilliseconds ?? U4, this.window.addEventListener("click", (e) => this.handlePress(e)), this.window.addEventListener("pageshow", (e) => {
			e.persisted === !0 && this.stop();
		}), this.window.addEventListener("pageswap", () => this.stop()), this.window.navigation?.addEventListener("navigateerror", () => this.stop());
	}
	handlePress(e) {
		B4(e, this.window.location.href) !== null && this.start(e);
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
		this.timer = null, e?.defaultPrevented === !0 ? this.stop() : (this.bar ??= K4(), document.body.append(this.bar), this.giveUpLater());
	}
	stop() {
		this.wait = null, this.clearTimer(), this.bar?.remove();
	}
};
function K4() {
	let e = document.createElement("div"), t = document.createElement("span"), n = document.createElement("span");
	return e.className = `${W4} ui-progress ui-progress--linear`, e.setAttribute("aria-hidden", "true"), t.className = "ui-progress__track", n.className = "ui-progress__fill", t.append(n), e.append(t), e;
}
//#endregion
//#region src/effects/address-history.ts
var q4 = "neEntry", J4 = class {
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
		this.window = e.window, this.revisit = e.revisit, this.switchRuntime = e.switchRuntime, this.load = e.load, this.route = e.window.location.pathname, this.search = e.window.location.search, this.entry = Y4(e.window.history.state) ?? 0, Y4(e.window.history.state) === null && e.window.history.replaceState({ [q4]: this.entry }, ""), e.window.addEventListener("popstate", () => this.onPopState());
	}
	replace(e) {
		this.write(a4(this.route, e), !1);
	}
	push(e) {
		let t = a4(this.route, e), n = this.window.location;
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
		t ? (this.entry++, this.window.history.pushState({ [q4]: this.entry }, "", e)) : this.window.history.replaceState({ [q4]: this.entry }, "", e), this.search = this.window.location.search;
	}
	onPopState() {
		let e = this.window.location, t = Y4(this.window.history.state), n = t === null ? null : t - this.entry;
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
		}, this.switchRuntime(e.search, r) || this.revisit(Q4(e.search));
	}
};
function Y4(e) {
	if (typeof e != "object" || !e) return null;
	let t = e[q4];
	return typeof t == "number" ? t : null;
}
function X4(e, t, n) {
	if (n.length === 0) return !1;
	let r = new URLSearchParams(e), i = new URLSearchParams(t);
	return n.some((e) => Z4(r, e) !== Z4(i, e));
}
function Z4(e, t) {
	return e.getAll(t).map(encodeURIComponent).join(",");
}
function Q4(e) {
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
var $4 = {
	isHeld: () => !1,
	holdsPush: () => !1
}, e3 = class {
	addressResolver;
	operations;
	extensions;
	state;
	valueChangeHandlers = /* @__PURE__ */ new Set();
	held = $4;
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
		let i = this.addressResolver.resolveProperties(e, t), a = this.shownValue(e, n), o = pQ(n, this.extensions.converters), c = !1;
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
		!this.state.set(e, t, n, () => n3(i[0]?.component)) && !this.restoring || c || this.notifyValueChanged({
			reference: e,
			propertyName: i[0]?.propertyName ?? this.addressResolver.getPropertyName(e.propertyId) ?? "",
			dynamicParameters: t,
			value: a,
			local: r,
			components: i.map((e) => e.component)
		});
	}
	shownValue(e, t) {
		return gl(t, () => this.addressResolver.isTranslatable(e));
	}
	holdsProperty(e, t, n) {
		let r = e.getAttribute(Qe);
		if (r === null) return this.held.isHeld(e);
		let i = this.addressResolver.getBindingById(Number(r));
		return i !== void 0 && i.propertyId !== t ? !1 : this.held.holdsPush(e, n);
	}
	applyOperation(e, t, n, r, i, a, o) {
		a !== null && dQ(t, n) ? this.operations.apply({
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
		return this.state.set(e, t, n, () => n3(r[0]?.component)) ? {
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
			(typeof n == "string" || Mc(n) ? this.addressResolver.isTranslatable(t.reference) : E(n)) && (e === void 0 || e(n)) && this.applyPropertyValue(t.reference, t.dynamicParameters, n, !1);
		}
	}
	rewriteStatic(e, t, n) {
		let r = this.addressResolver.resolvePropertyOn(e, t);
		if (r === null) return;
		let i = `[${Ze}${ra(r.propertyName)}]`;
		this.applyOperations(r, n, this.shownValue(t, n), (t) => oa(e, t, () => t3(e, i)));
	}
	applyOperations(e, t, n, r) {
		let i = pQ(t, this.extensions.converters);
		for (let t of e.definition.operations) {
			let a = this.extensions.converters.convert(t.converter, n);
			for (let o of r(t)) this.applyOperation(e, t, o, n, a, i, !0);
		}
	}
	applyToComponent(e, t, n, r) {
		let i = this.addressResolver.resolvePropertyOn(e, t, r);
		if (i === null) return !1;
		let a = this.shownValue(t, n);
		return this.applyOperations(i, n, a, (e) => this.addressResolver.resolveOperationTargets(i, e)), this.notifyValueChanged({
			reference: t,
			propertyName: i.propertyName,
			dynamicParameters: [],
			value: a,
			local: !0,
			components: [e]
		}), !0;
	}
	writeBoundValue(e, t, n = Number(e.getAttribute(Qe))) {
		let r = this.addressResolver.getBindingById(n), i = e.closest(x);
		return r === void 0 || i === null ? !1 : this.applyToComponent(i, {
			componentId: r.componentId,
			propertyId: r.propertyId
		}, t, {
			bindingId: n,
			element: e
		});
	}
	restoreBoundValue(e, t) {
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(Qe)));
		if (n === void 0) return;
		let r = {
			componentId: n.componentId,
			propertyId: n.propertyId
		};
		if (!this.state.has(r, t)) yu(e);
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
function t3(e, t) {
	if (e.matches(t)) return [e];
	for (let n of e.querySelectorAll(t)) if (n.closest("[data-ui-id]") === e) return [n];
	return [e];
}
function n3(e) {
	let t = [], n = e?.closest("[data-ui-key]") ?? null;
	for (; n !== null;) {
		let e = n.parentElement?.closest("[data-ui-id]") ?? null, r = e === null ? 0 : T(e), i = n.getAttribute(y);
		e !== null && r > 0 && i !== null && t.push({
			host: r,
			hostParameters: Ba(e, za(e)),
			key: i
		}), n = n.parentElement?.closest("[data-ui-key]") ?? null;
	}
	return t;
}
//#endregion
//#region src/updates/reactive-source-registry.ts
var r3 = "EndValue", i3 = class {
	watchers = /* @__PURE__ */ new Map();
	sourcesByComponent = /* @__PURE__ */ new Map();
	propertyPatchEngine;
	edits;
	constructor(e, t) {
		if (this.propertyPatchEngine = e, this.edits = t, e.addValueChangeHandler((e) => this.notify(e)), t !== void 0) for (let e of Jm) t.root.addEventListener(e, (e) => this.applyEditedValue(e, t), !0);
	}
	watch(e, t) {
		let n = w(e.componentId), r = o3(n, e.propertyId), i = this.watchers.get(r);
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
		let t = this.edits?.root.querySelector(`[data-ui-id="${w(e.componentId)}"]`) ?? null, n = t === null ? null : a3(e, this.edits?.metadata) ? t.querySelector(`[${Ht}]`) : gu(t);
		this.edits !== void 0 && n !== null && this.propertyPatchEngine.recordValue(e, [], this.edits.valueReaders.readBound(n));
	}
	applyEditedValue(e, t) {
		if (!(e.target instanceof Element)) return;
		let n = Za(e.target), r = n === null ? void 0 : this.sourcesByComponent.get(n);
		if (r === void 0) return;
		let i = t.valueReaders.readBound(e.target), a = e.target.hasAttribute(Ht);
		for (let e of r) {
			if (t.metadata !== void 0 && a3(e, t.metadata) !== a) continue;
			let n = this.propertyPatchEngine.recordValue(e, [], i);
			n !== null && this.notify(n);
		}
	}
	notify(e) {
		let t = o3(w(e.reference.componentId), e.reference.propertyId), n = this.watchers.get(t);
		if (n !== void 0) for (let t of n) t(e);
	}
};
function a3(e, t) {
	return t?.getPropertyDefinition(e.propertyId)?.propertyName === r3;
}
function o3(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/items/composite-slots.ts
function s3(e) {
	let t = [];
	for (let n of e.children) {
		let e = n.hasAttribute("data-ui-key") ? n.firstElementChild : null, r = e === null ? 0 : T(e);
		e !== null && r > 0 && t.push([e, r]);
	}
	return t;
}
//#endregion
//#region src/items/held-collections.ts
var c3 = class {
	collections = /* @__PURE__ */ new Map();
	rowCollections = /* @__PURE__ */ new Map();
	waiting = /* @__PURE__ */ new WeakMap();
	hold(e, t) {
		this.collections.set(e, f3(t));
	}
	apply(e) {
		let t = w(e.component?.id), n = this.collections.get(t);
		n === void 0 && (n = [], this.collections.set(t, n)), l3(n, e);
	}
	get(e) {
		return this.collections.get(e);
	}
	holdRow(e, t, n) {
		this.rowCollections.set(u3(e, t), {
			componentId: e,
			dynamicParameters: t,
			rows: f3(n)
		});
	}
	applyRow(e) {
		let t = w(e.component?.id), n = e.component?.dynamicParameters ?? [], r = u3(t, n), i = this.rowCollections.get(r);
		i === void 0 && (i = {
			componentId: t,
			dynamicParameters: n,
			rows: []
		}, this.rowCollections.set(r, i)), l3(i.rows, e);
	}
	getRow(e, t) {
		return this.rowCollections.get(u3(e, t))?.rows;
	}
	forgetRows(e, t) {
		for (let [n, r] of this.rowCollections) t(r.componentId) && d3(r.dynamicParameters, e) && this.rowCollections.delete(n);
	}
	writeItem(e, t, n, r) {
		let i = t.length === 0 ? this.collections.get(e) : this.rowCollections.get(u3(e, t))?.rows, a = i === void 0 ? -1 : i.findIndex((e) => e.key === n);
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
function l3(e, t) {
	switch (Sa(t.action)) {
		case "Insert":
			for (let n of t.items ?? []) p3(e, n);
			break;
		case "Remove":
			for (let n of t.items ?? []) m3(e, n.key);
			break;
		case "Replace":
			for (let n of t.items ?? []) h3(e, n);
			break;
		case "Move":
			for (let n of t.moves ?? []) g3(e, n.key, n.newIndex);
			break;
		case "Reset": e.length = 0;
	}
}
function u3(e, t) {
	return `${e}:${Ca(t)}`;
}
function d3(e, t) {
	if (e.length < t.length) return !1;
	for (let n = 0; n < t.length; n++) if (String(e[n] ?? "") !== String(t[n] ?? "")) return !1;
	return !0;
}
function f3(e) {
	let t = [];
	for (let n of e) typeof n.key == "string" && t.push({
		key: n.key,
		item: n.item
	});
	return t;
}
function p3(e, t) {
	typeof t.key == "string" && (m3(e, t.key), e.splice(_3(t.index, e.length), 0, {
		key: t.key,
		item: t.item
	}));
}
function m3(e, t) {
	let n = e.findIndex((e) => e.key === t);
	n >= 0 && e.splice(n, 1);
}
function h3(e, t) {
	if (typeof t.key != "string") return;
	let n = e.findIndex((e) => e.key === (t.oldKey ?? t.key));
	n < 0 ? p3(e, t) : e[n] = {
		key: t.key,
		item: t.item
	};
}
function g3(e, t, n) {
	let r = e.findIndex((e) => e.key === t);
	if (r < 0) return;
	let [i] = e.splice(r, 1);
	e.splice(_3(n, e.length), 0, i);
}
function _3(e, t) {
	return typeof e == "number" && e >= 0 && e < t ? e : t;
}
//#endregion
//#region src/items/item-projections.ts
var v3 = class {
	byHost = /* @__PURE__ */ new Map();
	records = /* @__PURE__ */ new WeakMap();
	reported = /* @__PURE__ */ new Set();
	get isEmpty() {
		return this.byHost.size === 0;
	}
	describe(e, t) {
		this.byHost.set(e, y3(e, "", t.map((e) => e.split("."))));
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
function y3(e, t, n) {
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
	for (let [n, a] of r) i.set(n, a.whole || a.rest.length === 0 ? null : y3(e, `${t}${a.name}.`, a.rest));
	return {
		host: e,
		prefix: t,
		members: i
	};
}
function b3(e) {
	let t = new v3();
	for (let n of e.metadata.items) n.itemPaths !== null && n.itemPaths !== void 0 && t.describe(w(n.componentId), n.itemPaths);
	return t;
}
//#endregion
//#region src/items/pending-moves.ts
var x3 = class {
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
}, S3 = class {
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
function C3(e, t) {
	let n = w3(e[t], "Reset");
	if (n === null) return null;
	let r = w(n.component?.id), i = n.component?.dynamicParameters ?? [];
	if (r <= 0) return null;
	let a = null, o = null, s = t + 1;
	for (; s < e.length; s++) {
		let t = w3(e[s], "Insert");
		if (t === null || w(t.component?.id) !== r || !gm(i, t.component?.dynamicParameters ?? [])) break;
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
function w3(e, t) {
	if (e === void 0 || Ta(e) !== "CollectionChange") return null;
	let n = e;
	return Sa(n.action) === t ? n : null;
}
//#endregion
//#region src/updates/collection-sinks.ts
var T3 = class {
	handlers = /* @__PURE__ */ new Map();
	register(e) {
		this.handlers.set(e.kind, e.handler);
	}
	dispatch(e, t) {
		let n = this.handlers.get(e);
		return n !== void 0 && (n(t), !0);
	}
};
function E3(e, t, n, r) {
	return {
		action: Sa(e.action),
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
var D3 = [], O3 = class {
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
	held = new c3();
	projections;
	touched = null;
	changedHosts = null;
	moves = new x3({
		indexOf: (e, t) => this.indexOfRow(e, t),
		move: (e, t, n) => this.moveRow(e, t, n)
	});
	transfers = new S3({
		take: (e, t) => this.takeRow(e, t),
		restore: (e, t) => this.restoreRow(e, t),
		place: (e, t, n, r) => this.placeRow(e, t, n, r),
		remove: (e, t) => this.removeRow(e, t),
		holds: (e, t) => L3(G(e), t) !== null,
		itemOf: (e) => this.readItemValue(e)
	});
	constructor(e, t, n, r, i, a, o, s, c) {
		this.metadata = e, this.propertyPatchEngine = t, this.state = n, this.itemsRenderer = r, this.itemsTemplates = i, this.dom = a, this.virtualization = o, this.sinks = s, this.rowMenus = c, r.setRowFiller((e) => this.fillHeldCollections(e)), t.addValueChangeHandler((e) => this.writeHeldItemValue(e)), t.addValueChangeHandler((e) => this.touch(e.components)), this.projections = b3(e), this.projections.isEmpty || VA((e, t) => this.projections.check(e, t));
	}
	fillHeldCollections(e) {
		let t = [];
		for (let n of e.querySelectorAll(`[${b}]`)) {
			let e = Za(n);
			e !== null && this.held.get(e) !== void 0 && (n.replaceChildren(), n.removeAttribute(dt), this.held.markWaiting(n, e), t.push([n, e]));
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
		for (let n = F3(e, t); n !== null; n = F3(e, t)) {
			t.add(n);
			let e = Qa(n);
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
		if (n.length < 1 || !this.rowMenus.holds(t)) return;
		let r = this.metadata.getBindingByComponentAndPropertyId(t, e.reference.propertyId), i = r === void 0 ? null : QA(r);
		if (i === null || i.scopeComponentId > 0 && !this.rowMenus.inOneMenu(i.scopeComponentId, t)) return;
		let a = this.state.get(e.reference, n), o = n.slice(0, -1), s = String(n[n.length - 1] ?? ""), c = !1;
		for (let e of this.rowMenus.menuComponentsOf(t)) this.heldList(e, o) === void 0 && this.metadata.getItemValues(e, o).some((e) => e.key === s) && this.holdFromRender(e, o), c = this.held.writeItem(e, o, s, (e) => _Q(e, i.steps, a)) || c;
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
			return n === void 0 && (n = R3(e), t.set(e, n)), n;
		};
		this.registerRenderedRows(this.dom.root, n);
		for (let t of e?.updates ?? []) {
			if (Ta(t) !== "CollectionChange") continue;
			let e = t;
			if (Sa(e.action) !== "Insert") continue;
			let r = w(e.component?.id);
			for (let t of this.findItemsHosts(r, e.component?.dynamicParameters ?? [])) {
				let i = n(t);
				for (let t of e.items ?? []) this.registerItemValue(r, i, t.key, t.item);
			}
		}
	}
	registerRenderedRows(e, t = (e) => R3(e)) {
		for (let n of e.querySelectorAll(`[${b}]`)) {
			let e = Qa(n);
			if (e === null) continue;
			let r = this.metadata.getItemValues(e.componentId, e.dynamicParameters);
			this.projections.isEmpty || this.projections.mark(e.componentId, r);
			for (let i of r) this.registerItemValue(e.componentId, t(n), i.key, i.item);
		}
	}
	registerItemValue(e, t, n, r) {
		if (n == null) return;
		let i = t.get(n) ?? null;
		if (i !== null && this.readItemScope(i) === void 0 && (this.itemsRenderer.registerItemScope(i, I3(i), r), this.metadata.getItemsTemplateMetadata(e)?.composite != null)) for (let [e, t] of s3(i)) this.itemsRenderer.registerItemScope(e, t, r);
	}
	readItemScope(e) {
		let t = this.itemsRenderer.getItemScope(e);
		if (t !== void 0) return t;
		let n = e.firstElementChild;
		return n === null ? void 0 : this.itemsRenderer.getItemScope(n);
	}
	initializeItemsHosts() {
		for (let e of this.dom.root.querySelectorAll(`[${b}]`)) {
			let t = Za(e);
			t !== null && this.syncItemsHost(e, t);
		}
	}
	resortHost(e) {
		let t = Za(e);
		t !== null && this.syncItemsHost(e, t);
	}
	syncItemsHost(e, t) {
		ZK(e, t, {
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
		let n = u() ? performance.now() : -1, r = yh(), i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set();
		this.touched = i, this.changedHosts = a;
		try {
			tq(() => this.applyUpdates(t));
		} finally {
			this.touched = null, this.changedHosts = null;
		}
		for (let e of a) this.dom.invalidate(e);
		return r !== null && bh(r), n >= 0 && d(`applied ${t.length} server update(s)`, n), [...i];
	}
	applyUpdates(e) {
		for (let t = 0; t < e.length; t++) {
			let n = e[t];
			try {
				Ta(n) !== "Value" && rq((e) => !k3(n, e));
				let r = C3(e, t);
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
		return this.dom.findComponent(e.componentId, e.dynamicParameters)?.hasAttribute(ft) === !0;
	}
	applyCollectionRefill(e) {
		let t = this.holdsCollection(e.componentId, e.dynamicParameters), n = this.holdsRowCollection(e.componentId, e.dynamicParameters);
		t && this.held.hold(e.componentId, e.items), n && (this.held.holdRow(e.componentId, e.dynamicParameters, e.items), this.rowMenus.heldChanged());
		let r = this.findItemsHosts(e.componentId, e.dynamicParameters);
		if (r.length === 0) t || n ? l("a collection for a host inside an item template is held until a row draws it.", { componentId: e.componentId }) : s("items host was not found for a collection refill.", e.items);
		else for (let n of r) t && this.held.isWaiting(n) || this.refillHost(n, e);
	}
	refillHost(e, t) {
		this.transfers.around(e, () => this.moves.around(e, D3, () => this.refillHostRows(e, t)));
	}
	refillHostRows(e, t) {
		let n = _A(e) === "virtualized";
		try {
			if (n) {
				let n = this.virtualization.refill(e, t.items.filter((e) => e.key !== null && e.key !== void 0).map((e) => ({
					key: e.key,
					item: e.item
				})));
				this.state.forgetRows(t.componentId, t.dynamicParameters, n);
			} else if (this.reconcileRows(e, t), _A(e) === "windowed") for (let t of this.windowRefillHandlers) t(e);
		} finally {
			this.afterRowsChanged(e, t.componentId, !n);
		}
	}
	reconcileRows(e, t) {
		let n = this.itemsRenderer.getAncestorStack(e), r = R3(e), i = [], a = [], o = null;
		for (let e of t.items) {
			let c = e.key ?? null;
			if (c === null) {
				s("collection insert carried no item key.", e);
				continue;
			}
			let l = r.get(c) ?? null;
			if (r.delete(c), l !== null && gm(this.readItemValue(l), e.item)) {
				i.push(l);
				continue;
			}
			let u = this.renderItemElement(t.componentId, e.item, c, n);
			if (l !== null) {
				let e = _p(l);
				e !== null && u !== null && (o = {
					row: u,
					held: e
				}), l.remove(), a.push(c);
			}
			u !== null && i.push(u);
		}
		let c = _A(e) === "windowed";
		for (let [t, n] of r) {
			let r = c ? _p(n) : null;
			n.remove(), vp(e, null, r), a.push(t);
		}
		if (this.state.forgetRows(t.componentId, t.dynamicParameters, a), this.forgetHeldRows(t.componentId, t.dynamicParameters, a), P3(e, i), Tj(e, i), o !== null && vp(e, o.row, o.held), c) for (let t of i) yp(e, t);
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
		switch (Ta(e)) {
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
		let t = w(e.address?.component?.id), n = wa(e.address?.property), r = e.address?.component?.dynamicParameters ?? [];
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
			this.sinks.dispatch(i, E3(e, r, t, n)) || s("no collection sink is registered for the kind the component names.", {
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
			a || o ? l("a collection change for a host inside an item template is held until a row draws it.", { componentId: t }) : (Sa(e.action) !== "Reset" || (e.items ?? []).length > 0) && s("items host was not found for a collection change update.", e);
			return;
		}
		let u = Sa(e.action) === "Move" ? M3(e.moves ?? []) : D3;
		for (let n of c) a && this.held.isWaiting(n) || this.transfers.around(n, () => this.moves.around(n, u, () => this.applyCollectionChangeToHost(n, t, e)));
	}
	applyCollectionChangeToHost(e, t, n) {
		let r = _A(e) === "virtualized", i = Sa(n.action);
		try {
			r ? this.applyVirtualizedCollectionChange(e, n) : this.applyRowsChange(e, t, n);
		} finally {
			this.afterRowsChanged(e, t, !r && (i === "Insert" || i === "Replace"));
		}
	}
	applyRowsChange(e, t, n) {
		switch (Sa(n.action)) {
			case "Insert":
				this.applyCollectionInsert(e, t, n.items ?? []);
				break;
			case "Remove":
				A3(e, n.items ?? [], n.trimmed === !0);
				break;
			case "Replace":
				this.applyCollectionReplace(e, t, n.items ?? []);
				break;
			case "Move":
				N3(e, n.moves ?? []);
				break;
			case "Reset":
				e.replaceChildren(), Ej(e);
				break;
			default: s("collection update action is not supported.", n);
		}
	}
	afterRowsChanged(e, t, n) {
		this.touched?.add(e), t !== null && this.syncItemsHost(e, t), this.changedHosts?.add(e), (n || this.changedHosts === null) && this.dom.invalidate(e);
	}
	indexOfRow(e, t) {
		let n = _A(e) === "virtualized" ? this.virtualization.keysOf(e)?.indexOf(t) ?? -1 : vj(e, G(e)).findIndex((e) => e.getAttribute(y) === t);
		return n < 0 ? null : n + vA(e);
	}
	moveRow(e, t, n) {
		let r = Za(e);
		if (r === null) return;
		let i = Math.max(0, n - vA(e));
		_A(e) === "virtualized" ? this.virtualization.move(e, t, i) : N3(e, [{
			key: t,
			newIndex: i
		}]), this.afterRowsChanged(e, r, !1);
	}
	takeRow(e, t) {
		let n = G(e), r = L3(n, t);
		if (r === null) return null;
		let i = vj(e, n), a = i.indexOf(r);
		return xj(i, r), r.remove(), this.afterRowsChanged(e, Za(e), !1), {
			element: r,
			index: a
		};
	}
	restoreRow(e, t) {
		let n = vj(e, G(e));
		dM(t.element), e.insertBefore(t.element, bj(n, t.element, t.index)), this.afterRowsChanged(e, Za(e), !0);
	}
	placeRow(e, t, n, r) {
		let i = Za(e), a = i === null ? null : this.renderItemElement(i, n, t, this.itemsRenderer.getAncestorStack(e));
		return a === null ? null : (e.insertBefore(a, bj(vj(e, G(e)), a, r)), this.afterRowsChanged(e, i, !0), a);
	}
	removeRow(e, t) {
		xj(vj(e, G(e)), t), t.remove(), this.afterRowsChanged(e, Za(e), !1);
	}
	forgetRowState(e, t, n) {
		switch (Sa(n.action)) {
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
		switch (Sa(t.action)) {
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
			let e = kY(r);
			e !== null && n.push(e);
		}
		return n;
	}
	applyCollectionInsert(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = vj(e, G(e));
		for (let a of n) {
			let n = a.key ?? null;
			if (n === null) {
				s("collection insert carried no item key.", a);
				continue;
			}
			let o = this.renderItemElement(t, a.item, n, r);
			o !== null && (e.insertBefore(o, bj(i, o, a.index ?? null)), yp(e, o));
		}
	}
	renderItemElement(e, t, n, r) {
		try {
			return p$(e, t, n, r, {
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
		let r = this.itemsRenderer.getAncestorStack(e), i = G(e), a = vj(e, i), o = R3(e, i);
		for (let i of n) {
			let n = i.key ?? null;
			if (n === null) {
				s("collection replace carried no item key.", i);
				continue;
			}
			let c = o.get(i.oldKey ?? n) ?? null, l = this.renderItemElement(t, i.item, n, r);
			if (l !== null) {
				if (o.delete(i.oldKey ?? n), o.set(n, l), c !== null) {
					let t = _p(c);
					wj(a, c, l), c.replaceWith(l), vp(e, l, t);
				} else e.insertBefore(l, bj(a, l, i.index ?? null));
			}
		}
	}
};
function k3(e, t) {
	if (Ta(e) !== "CollectionChange") return !1;
	let n = e.component, r = t.closest(x);
	return r !== null && T(r) === w(n?.id) && Va(r, n?.dynamicParameters ?? []);
}
function A3(e, t, n) {
	let r = G(e), i = R3(e, r), a = /* @__PURE__ */ new Set();
	for (let e of t) {
		let t = e.key ?? null, n = t === null ? null : i.get(t) ?? null;
		t === null || n === null ? s("collection remove did not resolve an item.", e) : (i.delete(t), a.add(n));
	}
	if (a.size === 0) return;
	let o = gp(e), c = o === null ? null : n ? j3(e, a) : fp(o, r, a);
	Sj(vj(e, r), a);
	for (let e of a) e.remove();
	c?.();
}
function j3(e, t) {
	let n = [];
	for (let e of t) {
		let t = _p(e);
		t !== null && n.push(t);
	}
	return n.length === 0 ? null : () => {
		for (let t of n) vp(e, null, t);
	};
}
function M3(e) {
	return e.map((e) => e.key).filter((e) => typeof e == "string");
}
function N3(e, t) {
	let n = G(e), r = vj(e, n), i = R3(e, n);
	for (let n of t) {
		let t = n.key === null || n.key === void 0 ? null : i.get(n.key) ?? null;
		if (t === null) {
			s("collection move did not resolve an item.", n);
			continue;
		}
		let a = Cj(r, t, n.newIndex ?? null);
		e.insertBefore(t, a ?? r[r.length - 2]?.nextSibling ?? null);
	}
}
function P3(e, t) {
	let n = null;
	for (let r of t) {
		let t = n === null ? G(e)[0] ?? null : n.nextElementSibling;
		r !== t && e.insertBefore(r, t), n = r;
	}
}
function F3(e, t) {
	for (let n of e.querySelectorAll(`[${b}]`)) if (!t.has(n)) return n;
	return null;
}
function I3(e) {
	let t = T(e);
	if (t > 0) return t;
	let n = e.firstElementChild;
	return n === null ? 0 : T(n);
}
function L3(e, t) {
	return e.find((e) => e.getAttribute("data-ui-key") === t) ?? null;
}
function R3(e, t = G(e)) {
	let n = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.getAttribute(y);
		t !== null && !n.has(t) && n.set(t, e);
	}
	return n;
}
//#endregion
//#region src/interactions/validation-words.ts
function z3(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = t.message;
	return E(n) || Mc(n) || typeof n == "string" && n.length > 0 ? {
		message: n,
		severity: V3(t.severity)
	} : void 0;
}
function B3(e) {
	let t = e.message;
	if (e.content === !0) return String(t ?? "");
	let n = D.resolve(E(t) || Mc(t) ? t : String(t ?? ""), !0);
	return typeof n == "string" ? n : "";
}
function V3(e) {
	let t = ya(e);
	return t === "Unknown" ? "Error" : t;
}
//#endregion
//#region src/interactions/validation-engine.ts
var H3 = "ui-validation--warning", U3 = "ui-validation--info", W3 = "ui-validation-message--marker", G3 = "top-end", K3 = "right", q3 = "--ui-validation-marker-host", J3 = "ui-validation-mark", Y3 = "--ui-validation-presentation", X3 = "--ui-validation-color", Z3 = "Validation", Q3 = "Value", $3 = /* @__PURE__ */ new Set(["Value", "EndValue"]), e6 = /* @__PURE__ */ new Set(["Min", "Max"]), t6 = `input:not([type='hidden']), textarea, select, .${Li}[role='combobox'], [role='spinbutton']`, n6 = {
	Error: 0,
	Warning: 1,
	Info: 2
}, r6 = {
	Error: ea,
	Warning: H3,
	Info: U3
}, i6 = `.${ea}, .${H3}, .${U3}`, a6 = {
	Error: "danger",
	Warning: "warning",
	Info: "info"
}, o6 = {
	Error: "error",
	Warning: "warning",
	Info: "info"
}, s6 = {
	Error: `${J3}--error`,
	Warning: `${J3}--warning`,
	Info: `${J3}--info`
}, c6 = {
	error: "Error",
	warning: "Warning",
	info: "Info"
}, l6 = {
	message: { key: "ui.value.conflict" },
	severity: "Warning"
}, u6 = class {
	options;
	root;
	failingRulesByElement = /* @__PURE__ */ new WeakMap();
	refusalByElement = /* @__PURE__ */ new WeakMap();
	boundRefusalByElement = /* @__PURE__ */ new WeakMap();
	boundRefused = /* @__PURE__ */ new Set();
	boundMessageByElement = /* @__PURE__ */ new WeakMap();
	packageMarkByElement = /* @__PURE__ */ new WeakMap();
	conflictMarkByElement = /* @__PURE__ */ new WeakMap();
	renderedRead = /* @__PURE__ */ new WeakSet();
	touchedElements = /* @__PURE__ */ new WeakSet();
	markerMirrors = /* @__PURE__ */ new WeakMap();
	messageLines = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.options.propertyPatchEngine.addValueChangeHandler((e) => this.applyValueChange(e)), this.options.updateProcessor?.addValidationHandler((e) => this.applyServerRefusal(e)), this.root.addEventListener("focus", (e) => this.markTouched(e), !0), this.root.addEventListener("blur", (e) => this.applyBlurTrigger(e), !0), this.root.addEventListener("input", (e) => this.applyInputTrigger(e), !0), this.root.addEventListener("change", (e) => {
			e.target instanceof Element && (this.refusesBounds(e.target), this.applyEventTrigger(e, "Change"));
		}, !0), this.applyRenderedMessages(this.root.querySelectorAll(i6)), V(this.root, i6, {
			childList: !0,
			addedOnly: !0
		}, (e) => this.applyRenderedMessages(e)), D.onChange(() => {
			this.applyRenderedMessages(this.root.querySelectorAll(i6)), this.rewriteMessageLines(), this.rejudgeBounds();
		}), D.onTable(() => this.rewriteShownMessages());
	}
	rewriteShownMessages() {
		for (let e of this.root.querySelectorAll(i6)) {
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
			_6(t, h6(t) === "Error");
			let e = t.querySelector(`:scope > [${ta}]`), n = e?.textContent ?? "";
			e !== null && n.length !== 0 && (this.recordRenderedMessage(t, e), v6(this.markerMirrors, t, e, {
				message: n,
				severity: h6(t)
			}));
		}
	}
	recordRenderedMessage(e, t) {
		if (this.renderedRead.has(e) || (this.renderedRead.add(e), this.resolveDisplay(T(e), e) !== void 0)) return;
		let n = ul(t), r = h6(e);
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
		if (e.propertyName === Z3) this.applyBoundMessage(e);
		else if (this.applyGivenValue(e), this.applyChangeTrigger(e), e.propertyName === Q3) for (let t of e.components) this.rejudgeAgainst(T(t), t, !0);
	}
	applyGivenValue(e) {
		let t = $3.has(e.propertyName), n = e6.has(e.propertyName);
		for (let r of e.components) {
			let i = this.refusalByElement.get(r)?.property === e.propertyName, a = this.boundRefusalByElement.has(r);
			a && n ? this.judgeBounds(T(r), r) : (i || a && t) && (i && this.refusalByElement.delete(r), t && this.forgetBoundRefusal(r), this.applyCurrentState(T(r), r));
		}
	}
	applyBoundMessage(e) {
		let t = w(e.reference.componentId), n = z3(e.value);
		for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) n === void 0 ? this.boundMessageByElement.delete(r) : this.boundMessageByElement.set(r, n), this.touchedElements.add(r), this.applyCurrentState(t, r);
	}
	applyChangeTrigger(e) {
		let t = w(e.reference.componentId), n = this.options.metadata.getValidationsForComponent(t);
		if (n.length === 0) return;
		let r = n.filter((t) => va(t.trigger) === "Change" && t.target.propertyId === e.reference.propertyId);
		if (r.length !== 0) for (let n of this.options.dom.findAllComponents(t, e.dynamicParameters)) this.evaluateAndApply(t, n, r, e.value);
	}
	rejudgeAgainst(e, t, n) {
		let r = this.options.metadata.getValidationsAgainst(e);
		for (let i of r) {
			let r = va(i.trigger);
			if (r === "Submit" || r === "Blur" && !n) continue;
			let a = w(i.target.componentId);
			for (let n of this.options.dom.findEveryComponent(a)) this.findValueSource(e, n) === t && this.evaluateAndApply(a, n, [i], this.readRuleValue(n));
		}
	}
	findValueSource(e, t) {
		let n = t === null ? [] : Qa(t)?.dynamicParameters ?? [];
		for (let t = n.length; t >= 0; t--) {
			let r = n.slice(0, t), i = this.options.dom.findComponent(e, r);
			if (i !== null && Va(i, r)) return i;
		}
		return null;
	}
	applyServerRefusal(e) {
		let t = w(e.address?.component?.id), n = e.address?.component?.dynamicParameters ?? [], r = e.message ?? "", i = E(r) || typeof r == "string" && r.length > 0;
		for (let a of this.options.dom.findAllComponents(t, n)) i ? (this.refusalByElement.set(a, {
			message: r,
			severity: V3(e.severity),
			content: e.content === !0,
			property: wa(e.address?.property)
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
		let n = A(t) || O(t) ? null : p6(t, (e) => this.readValue(e)), r = this.boundRefusalByElement.get(t)?.message;
		return m6(r, n) || (n === null ? this.forgetBoundRefusal(t) : (this.boundRefusalByElement.set(t, {
			message: n,
			severity: "Error"
		}), this.boundRefused.add(t), this.touchedElements.add(t), this.refusalByElement.delete(t)), this.applyCurrentState(e, t)), n !== null;
	}
	readValue(e) {
		return this.options.readValue?.(e) ?? this.options.valueReaders.readBound(e);
	}
	readRuleValue(e) {
		let t = gu(e);
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
			severity: c6[t]
		}), this.applyCurrentState(T(e), e);
	}
	markConflict(e, t) {
		if (t) this.conflictMarkByElement.set(e, l6);
		else if (!this.conflictMarkByElement.delete(e)) return;
		this.applyCurrentState(T(e), e);
	}
	entryRefusal(e, t, n) {
		for (let r of this.options.metadata.getValidationsForComponent(T(e))) {
			if (V3(r.severity) !== "Error") continue;
			let i = this.comparand(r, e);
			if (d6(t, r, i) && !d6(n, r, i)) return r.message;
		}
		return null;
	}
	comparand(e, t) {
		let n = w(e.valueSource?.componentId);
		if (n <= 0) return e.value;
		let r = this.findValueSource(n, t);
		return r === null ? null : this.readRuleValue(r);
	}
	judge(e, t) {
		let n = null;
		for (let r of this.options.metadata.getValidationsForComponent(e)) !d6(t, r, this.comparand(r, null)) && (n === null || n6[V3(r.severity)] < n6[V3(n.severity)]) && (n = r);
		return n === null ? null : {
			severity: o6[V3(n.severity)],
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
		g6(this.markerMirrors, t, n), this.writeMessageElsewhere(e, t, n);
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
		}, [], [...e.lines.values()].map(B3).join("\n"), !0);
	}
	rewriteMessageLines() {
		for (let e of this.messageLines.values()) this.writeLines(e);
	}
	resolveDisplay(e, t) {
		let n = [], r = this.boundRefusalByElement.get(t), i = this.refusalByElement.get(t), a = this.boundMessageByElement.get(t), o = this.packageMarkByElement.get(t);
		r !== void 0 && n.push(r), i !== void 0 && n.push(i), a !== void 0 && n.push(a), o !== void 0 && n.push(o);
		let s = this.conflictMarkByElement.get(t);
		s !== void 0 && n.push(s);
		let c = this.failingRulesByElement.get(t);
		if (c !== void 0) for (let t of this.options.metadata.getValidationsForComponent(e)) c.has(t) && n.push({
			message: t.message,
			severity: V3(t.severity)
		});
		let l;
		for (let e of n) (l === void 0 || n6[e.severity] < n6[l.severity]) && (l = e);
		return l;
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
		let i = r.filter((e) => va(e.trigger) === t);
		i.length !== 0 && this.evaluateAndApply(n.componentId, n.element, i, this.readRuleValue(n.element));
	}
	runSubmitValidation(e) {
		let t = !0, n = /* @__PURE__ */ new Set();
		for (let { component: r } of this.formFields(e)) {
			if (n.has(r.element)) continue;
			n.add(r.element);
			let e = this.options.metadata.getValidationsForComponent(r.componentId).filter((e) => va(e.trigger) === "Submit");
			e.length > 0 && (this.touchedElements.add(r.element), this.evaluateAndApply(r.componentId, r.element, e, this.readRuleValue(r.element))), this.hasError(r.componentId, r.element) && (t = !1, this.touchedElements.has(r.element) || (this.touchedElements.add(r.element), this.applyCurrentState(r.componentId, r.element)));
		}
		return t;
	}
	*formFields(e) {
		for (let t of this.root.querySelectorAll(`[${ln}="${S(e)}"]`)) {
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
		for (let { component: t } of this.formFields(e)) if (t.element.classList.contains("ui-invalid") && this.focusField(t.element)) return !0;
		return !1;
	}
	focusField(e) {
		let t = [...e.querySelectorAll(t6)].find((e) => e.closest("[role='listbox'], [role='menu'], [role='dialog']") === null) ?? null;
		return t !== null && (t.focus({ preventScroll: !0 }), t.scrollIntoView({
			block: "center",
			behavior: Xh() ? "auto" : "smooth"
		}), !0);
	}
	hasError(e, t) {
		if (this.boundRefusalByElement.has(t) || this.refusalByElement.get(t)?.severity === "Error") return !0;
		let n = this.failingRulesByElement.get(t);
		if (n === void 0) return !1;
		for (let t of this.options.metadata.getValidationsForComponent(e)) if (n.has(t) && V3(t.severity) === "Error") return !0;
		return !1;
	}
	evaluateAndApply(e, t, n, r) {
		let i = this.failingRulesByElement.get(t);
		i === void 0 && (i = /* @__PURE__ */ new Set(), this.failingRulesByElement.set(t, i));
		for (let e of n) d6(r, e, this.comparand(e, t)) ? i.delete(e) : i.add(e);
		this.touchedElements.has(t) && this.applyCurrentState(e, t);
	}
};
function d6(e, t, n) {
	return ga(t.operator) !== "Required" && f6(e) ? !0 : Ih(e, t.operator, n);
}
function f6(e) {
	return e !== !1 && !Ih(e, "Required", null);
}
function p6(e, t) {
	return lA(e, t) ?? (e.matches(".ui-temporal-input, .ui-calendar") ? YN(e) : null);
}
function m6(e, t) {
	return e === void 0 || t === null ? e === void 0 && t === null : E(e) && e.key === t.key && JSON.stringify(e.args) === JSON.stringify(t.args);
}
function h6(e) {
	return e.classList.contains(H3) ? "Warning" : e.classList.contains(U3) ? "Info" : "Error";
}
function g6(e, t, n) {
	for (let e of Object.values(r6)) t.classList.toggle(e, n !== void 0 && r6[n.severity] === e);
	_6(t, n?.severity === "Error");
	let r = t;
	n === void 0 ? r.style.removeProperty(X3) : r.style.setProperty(X3, `var(--ui-color-${a6[n.severity]}-ink)`);
	let i = t.querySelector(":scope > [data-ui-validation-message]") ?? t.querySelector("[data-ui-validation-message]");
	i !== null && (n?.content === !0 ? (cl(i, null), i.textContent = String(n.message ?? "")) : D.writeValue(i, null, n?.message ?? null), v6(e, r, i, n));
}
function _6(e, t) {
	for (let n of e.querySelectorAll(t6)) {
		let r = n.closest(Ii);
		r !== null && e.contains(r) || (t ? n.setAttribute("aria-invalid", "true") : n.removeAttribute("aria-invalid"));
	}
}
function v6(e, t, n, r) {
	let i = getComputedStyle(n), a = i.getPropertyValue(Y3).trim(), o = r !== void 0 && a === "marker";
	n.classList.toggle(W3, o), y6(e, t, a === "elsewhere" ? void 0 : r, n.textContent ?? "", i.getPropertyValue(q3).trim()), r !== void 0 && o ? (n.setAttribute(ze, Qo(n.textContent ?? "")), n.setAttribute(Be, G3), n.setAttribute(Ue, o6[r.severity]), t.setAttribute(He, ""), t.contains(document.activeElement) ? Rz(n) : zz(n)) : (n.removeAttribute(ze), n.removeAttribute(Be), n.removeAttribute(Ue), t.removeAttribute(He), zz(n));
}
function y6(e, t, n, r, i) {
	let a = e.get(t), o = n === void 0 || i.length === 0 ? null : x6(t, i);
	if (n === void 0 || o === null) {
		a !== void 0 && b6(a), e.delete(t);
		return;
	}
	let s = a ?? document.createElement("span");
	s.className = `${J3} ${s6[n.severity]}`, s.textContent = r, s.setAttribute(ze, Qo(r)), s.setAttribute(Be, K3), s.setAttribute(Ue, o6[n.severity]), s.setAttribute(We, ""), s.parentElement !== o && (b6(s), o.append(s)), o.setAttribute(He, ""), e.set(t, s), zz(s);
}
function b6(e) {
	let t = e.parentElement;
	e.remove(), t !== null && t.querySelector(`:scope > .${J3}`) === null && t.removeAttribute(He);
}
function x6(e, t) {
	for (let n = e.parentElement; n !== null; n = n.parentElement) {
		let e = n.querySelector(`:scope > .${t}`);
		if (e !== null) return e;
	}
	return null;
}
//#endregion
//#region src/runtime/unsaved-stash.ts
var S6 = "ne.unsaved:", C6 = 18e5, w6 = class {
	storage;
	now;
	constructor(e = {}) {
		this.storage = e.storage ?? (() => window.sessionStorage), this.now = e.now ?? Date.now;
	}
	save(e, t) {
		if (t.length !== 0) try {
			let n = this.storage();
			if (n === null) return;
			let r = this.now(), i = D6(n.getItem(T6(e)) ?? "", r), a = new Set(t.map(E6)), o = [...i.filter((e) => !a.has(E6(e))), ...t];
			n.setItem(T6(e), JSON.stringify({
				saved: r,
				values: o
			}));
		} catch (e) {
			s("the unsaved values could not be kept for the reload.", e);
		}
	}
	take(e) {
		try {
			let t = this.storage();
			if (t === null) return [];
			this.dropExpired(t);
			let n = t.getItem(T6(e));
			return n === null ? [] : (t.removeItem(T6(e)), D6(n, this.now()));
		} catch (e) {
			return s("the unsaved values kept for the reload could not be read.", e), [];
		}
	}
	dropExpired(e) {
		let t = [];
		for (let n = 0; n < e.length; n++) {
			let r = e.key(n);
			r !== null && r.startsWith(S6) && D6(e.getItem(r) ?? "", this.now()).length === 0 && t.push(r);
		}
		for (let n of t) e.removeItem(n);
	}
};
function T6(e) {
	return `${S6}${e.windowId}:${e.view ?? ""}:${e.address}`;
}
function E6(e) {
	return `${e.bindingId}:${JSON.stringify(e.dynamicParameters)}`;
}
function D6(e, t) {
	let n;
	try {
		n = JSON.parse(e);
	} catch {
		return [];
	}
	if (typeof n != "object" || !n) return [];
	let { saved: r, values: i } = n;
	return typeof r != "number" || t - r > C6 || t < r || !Array.isArray(i) ? [] : i.filter(O6);
}
function O6(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return typeof t.bindingId == "string" && Array.isArray(t.dynamicParameters) && "value" in t;
}
//#endregion
//#region src/items/row-decorators.ts
var k6 = class {
	decorators = /* @__PURE__ */ new Map();
	register(e) {
		this.decorators.set(e.kind, e.decorate);
	}
	get(e) {
		return this.decorators.get(e);
	}
}, A6 = "card-header-shown", j6 = `[${Wi}], [${Gi}], [${Yi}], [${Xi}], [${Zi}]`;
function M6(e) {
	let t = e.parentElement?.parentElement;
	if (t == null || !t.classList.contains("ui-card__header")) return;
	let n = !e.matches(j6);
	t.classList.contains("ui-card__header--empty") !== n && t.classList.toggle(Qi, n);
}
//#endregion
//#region src/updates/menu-surface.ts
var N6 = "menu-surface";
function P6(e) {
	let t = e.parentElement;
	t !== null && t.matches(".ui-context-menu, .ui-split-button__menu") && C(t, bn, PT(e));
}
//#endregion
//#region src/updates/tooltip-name.ts
var F6 = "tooltip-name";
function I6(e, t, n) {
	let r = Zo(e.getAttribute(ze));
	cl(t, n), r.trim().length === 0 ? t.hasAttribute(n) && t.removeAttribute(n) : t.getAttribute(n) !== r && t.setAttribute(n, r);
}
//#endregion
//#region src/updates/dom-operation-registry.ts
var L6 = /* @__PURE__ */ new WeakMap(), R6 = /* @__PURE__ */ new WeakMap(), z6 = class {
	handlers = /* @__PURE__ */ new Map();
	constructor() {
		this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(ba(e), t);
	}
	apply(e) {
		let t = ba(e.operation.kind), n = this.handlers.get(t);
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
		this.register("Text", (e) => B6(e)), this.register("Markup", (e) => {
			e.target.hasAttribute("data-ui-plain-text") ? B6(e) : ($o(e.target, du(e.convertedValue) ? "" : uu(e.convertedValue), {
				autolinks: e.target.hasAttribute(Ji),
				insideLink: e.target.closest("a") !== null
			}), cl(e.target, null));
		}), this.register("Attribute", (e) => {
			let t = K6(e.operation);
			cl(e.target, t), e.operation.convertsNull !== !0 && du(e.value) || du(e.convertedValue) ? C(e.target, t, null) : C(e.target, t, uu(e.convertedValue));
		}), this.register("RemoveAttribute", (e) => {
			let t = K6(e.operation);
			cl(e.target, t), C(e.target, t, null);
		}), this.register("ToggleAttribute", (e) => {
			let t = K6(e.operation), n = e.operation.condition ?? "HasValue", r = !du(e.value) && V6(e.value, n), i = e.operation.value ?? (du(e.convertedValue) || H6(n) ? "" : uu(e.convertedValue));
			U6(e.target, G6(e), t, r, i);
		}), this.register("Class", (e) => {
			let t = !du(e.value) && V6(e.value, e.operation.condition ?? "None") ? uu(e.convertedValue).trim() : "";
			W6(e.target, G6(e), t, TT(e.operation.converter ?? ""));
		}), this.register("ToggleClass", (e) => {
			let t = K6(e.operation), n = !du(e.value) && V6(e.value, e.operation.condition ?? "IsTrue");
			if (e.target.classList.toggle(t, n), e.operation.converter !== null && e.operation.converter !== void 0 && e.operation.converter.trim().length > 0) {
				let t = n ? uu(e.convertedValue).trim() : "";
				W6(e.target, G6(e), t, TT(e.operation.converter));
			}
		}), this.register("Style", (e) => {
			let t = K6(e.operation), n = e.target;
			if (du(e.value) || du(e.convertedValue) || e.convertedValue === "") {
				n.style.getPropertyValue(t).length > 0 && n.style.removeProperty(t);
				return;
			}
			let r = uu(e.convertedValue);
			n.style.getPropertyValue(t) !== r && n.style.setProperty(t, r);
		}), this.register("Data", () => {}), this.register(F6, (e) => I6(e.resolved.component, e.target, K6(e.operation))), this.register(q0, (e) => X0(e.target, e.value)), this.register(A6, (e) => M6(e.resolved.component)), this.register(_l, (e) => vl(e.target)), this.register(V0, (e) => K0(e.target)), this.register(NI, (e) => FI(e.target)), this.register(RI, (e) => VI(e.resolved.component)), this.register(jC, (e) => {
			let t = GC(e.target);
			t !== "keep" && U6(e.resolved.component, jC, K6(e.operation), t === "show", "");
		}), this.register(N6, (e) => P6(e.target)), this.register("Property", (e) => {
			let t = K6(e.operation), n = e.target, r = du(e.convertedValue) ? "" : e.convertedValue;
			n[t] !== r && (n[t] = r);
		});
	}
};
function B6(e) {
	let t = uu(e.convertedValue);
	e.target.textContent !== t && (e.target.textContent = t), cl(e.target, null);
}
function V6(e, t) {
	switch (xa(t)) {
		case "None": return !0;
		case "HasValue": return !du(e);
		case "HasText": return typeof e == "string" ? e.trim().length > 0 : !du(e) && String(e).trim().length > 0;
		case "IsTrue": return e === !0;
		case "IsFalse": return e === !1;
		case "DrawsIcon": return Ro(e).length > 0;
		default: return !du(e);
	}
}
function H6(e) {
	let t = xa(e);
	return t === "IsTrue" || t === "IsFalse";
}
function U6(e, t, n, r, i) {
	let a = R6.get(e);
	a === void 0 && (a = /* @__PURE__ */ new Map(), R6.set(e, a));
	let o = a.get(n);
	o === void 0 && (o = /* @__PURE__ */ new Set(), a.set(n, o)), r ? (o.add(t), C(e, n, i)) : (o.delete(t), o.size === 0 && C(e, n, null));
}
function W6(e, t, n, r) {
	let i = L6.get(e);
	i === void 0 && (i = /* @__PURE__ */ new Map(), L6.set(e, i));
	let a = i.get(t);
	if (a === void 0 && r !== void 0) for (let t of Array.from(e.classList)) t !== n && r(t) && e.classList.remove(t);
	a === n ? n.length > 0 && !e.classList.contains(n) && e.classList.add(n) : (a !== void 0 && a.length > 0 && e.classList.remove(a), n.length === 0 ? i.delete(t) : (e.classList.add(n), i.set(t, n)));
}
function G6(e) {
	return `${e.resolved.componentId}:${e.resolved.propertyId}:${e.operation.kind}:${e.operation.name ?? ""}:${e.operation.converter ?? ""}`;
}
function K6(e) {
	let t = e.name;
	if (t == null || t.trim().length === 0) throw Error(`Operation '${e.kind}' requires a name.`);
	return t;
}
//#endregion
//#region src/extensions/converters.ts
var q6 = class {
	converters = /* @__PURE__ */ new Map();
	constructor() {
		this.register({
			name: "*",
			canConvert: (e) => NT.has(e.name),
			convert: (e) => NT.get(e.name)(e.value)
		});
	}
	register(e) {
		let t = J6(e.name), n = {
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
function J6(e) {
	let t = e.trim();
	if (t.length === 0) throw Error("Converter name is required.");
	return t;
}
//#endregion
//#region src/extensions/events.ts
var Y6 = class {
	definitions = /* @__PURE__ */ new Map();
	register(e) {
		let t = Na(e.name);
		if (t.length === 0) throw Error("Event name is required.");
		let n = Na(e.domEventName) || t;
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
		return this.definitions.get(Na(e));
	}
};
function X6(e, t) {
	e.root.addEventListener("toggle", (n) => {
		n.target instanceof HTMLDetailsElement && n.target.open === t && e.dispatch(n);
	}, !0);
}
function Z6(e) {
	e.register({
		name: "click",
		attach: (e) => {
			e.root.addEventListener("click", e.dispatch, !0), e.root.addEventListener(up, e.dispatch, !0);
		}
	}), e.registerNative("change"), e.registerNative("focus"), e.registerNative("blur"), e.registerNative("mouse-enter", "mouseenter"), e.registerNative("mouse-leave", "mouseleave"), e.registerNative("toggle"), e.register({
		name: "expand",
		domEventName: "toggle",
		attach: (e) => X6(e, !0)
	}), e.register({
		name: "collapse",
		domEventName: "toggle",
		attach: (e) => X6(e, !1)
	}), e.registerNative("open"), e.registerNative("close"), e.registerNative("search"), e.registerNative("enter"), e.registerNative("escape"), e.registerNative("rename"), e.registerNative("unfold"), e.registerNative("move"), e.registerNative("remove");
}
//#endregion
//#region src/extensions/extension-registry.ts
var Q6 = class {
	converters = new q6();
	events = new Y6();
	operations = new z6();
	valueReaders;
	collectionSinks = new T3();
	rowDecorators = new k6();
	constructor(e, t, n, r) {
		Z6(this.events), this.valueReaders = new pu(r);
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
}, $6 = "Submenu", e8 = "ui-menu__submenu", t8 = "Select", n8 = ["Header", "Separator"], r8 = {
	kind: "menu",
	decorate: i8
};
function i8(e) {
	if (n8.includes(o8(e.item, "Kind")) && e.row.setAttribute(vn, ""), !a8(e.item)) return;
	let t = e.templates.getVariantTemplate(e.componentId, $6);
	if (t === void 0) {
		s("menu submenu template was not found.", { componentId: e.componentId });
		return;
	}
	let n = e.renderer.renderFromTemplate(t, e.item, e.ancestors);
	if (n === null) return;
	e.row.setAttribute(pn, ""), o8(e.item, "Kind") === t8 && e.row.setAttribute(mn, ""), o8(e.item, "Expanded") === !0 && e.row.setAttribute(hn, "");
	let r = document.createElement("div");
	r.className = e8, r.appendChild(n), yQ(r, e.key, e.item), e.row.appendChild(r);
}
function a8(e) {
	let t = o8(e, "Items");
	return Array.isArray(t) && t.length > 0;
}
function o8(e, t) {
	let n = JA(e, t);
	return n.ok ? n.value : void 0;
}
//#endregion
//#region src/items/row-grip.ts
var s8 = {
	kind: "grip",
	decorate: c8
};
function c8(e) {
	e.row.append(l8());
}
function l8() {
	let e = document.createElement("span");
	return e.className = ve, e.setAttribute("role", "button"), D.write(e, "aria-label", "ui.row.drag"), e;
}
//#endregion
//#region src/rendering/page-culture.ts
function u8(e, t, n) {
	let r = t === null ? null : JSON.stringify(t), i = n === null ? null : JSON.stringify(f8(n));
	for (let t of e.querySelectorAll(`[${_t}]`)) d8(t, gt, r), d8(t, xt, i);
}
function d8(e, t, n) {
	n !== null && e.hasAttribute(t) && e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function f8(e) {
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
var p8 = `[${Ct}]`;
function m8(e) {
	for (let t of e.querySelectorAll(p8)) t.removeAttribute(Ct);
}
//#endregion
//#region src/runtime/engine-start.ts
var h8 = 2;
function g8(e, t, n) {
	let r = u() ? performance.now() : -1;
	try {
		t(n);
	} catch (t) {
		c(`the ${e} engine failed to start; the page goes on without it.`, t);
	}
	if (r >= 0) {
		let t = performance.now() - r;
		t >= h8 && l(`the ${e} engine took ${f(t)} to start.`);
	}
}
function _8(e) {
	return e.name.length > 0 ? `"${e.name}" package` : "package";
}
//#endregion
//#region src/runtime/web-ui-runtime.ts
var v8 = "ne.standard.ui.windowId", y8 = [
	500,
	1e3,
	2e3
], b8 = 3, x8 = [
	["refusal", ({ root: e }) => _Z(e)],
	["file input", ({ root: e, validation: t }) => new nx({
		root: e,
		validation: t
	})],
	["image input", ({ root: e, validation: t, propertyPatchEngine: n, dialogs: r }) => new FS({
		root: e,
		validation: t,
		propertyPatchEngine: n,
		dialogs: r
	})],
	["key value action", ({ root: e, dom: t, propertyPatchEngine: n, validation: r }) => new tC({
		root: e,
		dom: t,
		propertyPatchEngine: n,
		validation: r
	})],
	["field keys", ({ root: e, propertyPatchEngine: t }) => new DC({
		root: e,
		propertyPatchEngine: t
	})],
	["field box press", ({ root: e }) => new dC({ root: e })],
	["tier classes", ({ root: e }) => new mw({ root: e })],
	["image fallback", ({ root: e }) => new nw({ root: e })],
	["radio group sync", ({ root: e }) => new ww({ root: e })],
	["select interaction", ({ root: e, validation: t }) => new fO({
		root: e,
		validation: t
	})],
	["search input", ({ root: e }) => new rD({ root: e })],
	["debounced commit", ({ root: e }) => new bC({ root: e })],
	["commit gate", ({ root: e, propertyPatchEngine: t }) => new jO({
		root: e,
		propertyPatchEngine: t
	})],
	["text area grow", ({ root: e, propertyPatchEngine: t }) => PO() ? void 0 : new FO({
		root: e,
		propertyPatchEngine: t
	})],
	["items selection", ({ root: e, heldRows: t }) => new Cq({
		root: e,
		rows: t
	})],
	["range value", ({ root: e, propertyPatchEngine: t }) => new ck({
		root: e,
		propertyPatchEngine: t
	})],
	["color input", ({ root: e, propertyPatchEngine: t }) => new fG({
		root: e,
		propertyPatchEngine: t
	})],
	["temporal picker", ({ root: e, propertyPatchEngine: t }) => new YP({
		root: e,
		propertyPatchEngine: t
	})],
	["theme switcher", ({ root: e, effects: t, dom: n }) => new NF({
		root: e,
		effects: t,
		dom: n
	})],
	["language switcher", ({ root: e, effects: t, dom: n }) => new HF({
		root: e,
		effects: t,
		dom: n
	})],
	["time segment", ({ root: e, propertyPatchEngine: t }) => new oY({
		root: e,
		propertyPatchEngine: t
	})],
	["timestamp", ({ root: e, propertyPatchEngine: t }) => new CY({
		root: e,
		propertyPatchEngine: t
	})],
	["file tile", ({ root: e, propertyPatchEngine: t }) => new EY({
		root: e,
		propertyPatchEngine: t
	})],
	["context menu", ({ root: e, dom: t }) => new NL({
		root: e,
		dom: t
	})],
	["split button", ({ root: e }) => new EU({ root: e })],
	["toggle button", ({ root: e }) => new cC({ root: e })],
	["button group", ({ root: e }) => new MU({ root: e })],
	["menu", ({ root: e }) => new Yz({ root: e })],
	["action bar", ({ root: e, dom: t }) => new fR({
		root: e,
		dom: t
	})],
	["collapsible", ({ root: e }) => new eH({ root: e })],
	["menu group", ({ root: e }) => new iL({ root: e })],
	["menu search", ({ root: e }) => new oV({ root: e })],
	["side drawer", ({ root: e }) => new BV({ root: e })],
	["screen keyboard", () => new _V()],
	["window foot", ({ root: e }) => new OV({ root: e })],
	["grid splitter", ({ root: e }) => new mH({ root: e })],
	["pane container", ({ root: e }) => new VH({ root: e })],
	["accordion", ({ root: e }) => new IU({ root: e })],
	["tabs", ({ root: e }) => new sW({ root: e })],
	["tabs view", ({ root: e, effects: t }) => new LJ({
		root: e,
		effects: t
	})],
	["command bar", ({ root: e }) => new xW({ root: e })],
	["breadcrumbs", ({ root: e }) => new IW({ root: e })],
	["scroll anchor", ({ root: e }) => new WY({ root: e })],
	["visible keys", ({ root: e }) => new XZ({ root: e })],
	["surface press", ({ root: e }) => new NG({ root: e })],
	["text selection", ({ root: e }) => new ZY({ root: e })],
	["scroll group", ({ root: e }) => new iX({ root: e })],
	["flyout interaction", ({ root: e }) => new Fy({ root: e })],
	["text fold", ({ root: e }) => new XJ({ root: e })],
	["tooltip", ({ root: e }) => nz(e)]
], S8 = class {
	windowId;
	options;
	root;
	culturesLanguage = document.documentElement.lang;
	metadata = new la(H$());
	hydration = K$();
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
	navigationProgress = new G4({ window });
	sessionKey = Dm;
	address;
	clientState;
	reactiveSources;
	attachTask = null;
	reattachRequested = !1;
	connectionLost = !1;
	reloading = !1;
	connection;
	heldRuntime = null;
	pageId = this.hydration?.pageId ?? null;
	runtimeSearch = window.location.search;
	inertContent = null;
	endSwitchProgress = null;
	settleValues;
	unsaved = new w6();
	readUnsaved;
	restoreUnsaved;
	holdTypedDuring;
	current = Promise.resolve();
	currentPending = !1;
	markCurrent = () => {};
	inbound = null;
	enginesAwaitingHydration = [];
	languageSwitches = 0;
	themeColorChanges = 0;
	numberInputs = null;
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.windowId = s1(e.windowIdStorageKey ?? v8, (e) => this.reloadAsOwnTab(e)), this.dom = new Xa(this.root), D.load(this.root), D.setLanguage(document.documentElement.lang), e.strings !== void 0 && D.register(e.strings), this.gateInbound(this.hydration?.words === null || this.hydration?.words === void 0 ? null : D.loadTableAsync(this.hydration.words.href)), this.extensions = new Q6(e.converters, e.eventDefinitions, e.domOperations, e.valueReaders), this.extensions.registerRowDecorator(r8), this.extensions.registerRowDecorator(s8), this.extensions.registerRowDecorator(_w);
		let t = new Ra(this.dom, this.metadata), n = this.extensions.operations, r = new S1(), i = new e3(t, n, this.extensions, r);
		this.reactiveSources = new i3(i, {
			root: this.root,
			valueReaders: this.extensions.valueReaders,
			metadata: this.metadata
		}), this.dialogs = new D4({
			root: this.root,
			dom: this.dom,
			discardForm: (e) => this.effects.apply({
				effect: {
					kind: sa.DiscardForm,
					formId: e
				},
				dom: this.dom
			})
		}), Zv(this.dom), this.notifications = new K2({
			root: this.root,
			dom: this.dom
		}), this.address = new J4({
			window,
			revisit: (e) => void this.navigateInPlaceAsync(e),
			switchRuntime: (e, t) => this.revisitRuntime(e, t),
			load: () => this.reload()
		});
		let a = (e) => this.eventPipeline.dispatchCommandAsync({
			eventId: 0,
			action: e,
			dynamicParameters: []
		}).catch((e) => (s("running a notification's action failed.", e), !1)), o = (e) => gJ(e, (e) => this.leaveGuard.navigate(e), (e) => void a(e)), u = $$(document.documentElement, this.windowId, o);
		this.effects = new h4({
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
			systemNotifications: mJ(u)
		});
		let d = new Wh(this.metadata), f, p = new Oh(d, i, new Fh(), {
			root: this.root,
			effects: this.effects,
			dom: this.dom,
			metadata: this.metadata,
			valueReaders: this.extensions.valueReaders,
			writeBack: (e, t, n) => {
				f?.syncPropertyAsync(w(e.componentId), e.propertyId, t, n).catch((e) => s("writing an interaction's value back failed.", e));
			}
		}), m = new N$(this.dom), h = new mQ(this.metadata, m, this.extensions, n, r), g = new L$({
			root: this.root,
			render: (e, t) => h.renderPart(e, t),
			drawn: (e) => this.updateProcessor.fillDrawnPart(e),
			heldRows: (e) => this.updateProcessor.forEachHeldRow(e)
		});
		g.scan(), ML((e) => g.draw(e)), this.rowMenus = g, this.virtualization = new _$({
			root: this.root,
			metadata: this.metadata,
			templates: m,
			renderer: h,
			state: r,
			dom: this.dom
		}), this.updateProcessor = new O3(this.metadata, i, r, h, m, this.dom, this.virtualization, this.extensions.collectionSinks, g), D.onChange(() => this.rewriteWords(i, h)), this.rewriteMoments = () => this.rewriteWords(i, h, Ic), D.onMomentTick(this.rewriteMoments), this.rewritePageWritten = () => this.rewriteWords(i, h, Rc), this.ruleWatcher = new EQ({
			root: this.root,
			metadata: this.metadata,
			templates: m,
			renderer: h,
			state: r,
			propertyPatchEngine: i,
			reactiveSources: this.reactiveSources,
			virtualization: this.virtualization
		}), this.transport = new B0(this.windowId, (e, t) => this.applyChanges(e, t, this.heldRuntime), e.signalR), this.clientState = new pJ({ report: (e) => this.transport.reportClientStateAsync(e) }), this.dispatcher = new _1(this.transport), D.setAsker((e, t) => this.transport.translateAsync(e, t)), this.effects.register(sa.SetLanguage, (e) => {
			let t = e.effect, n = t.language;
			if (typeof n != "string" || n.trim().length === 0) {
				s("set language effect carries no language.", e.effect);
				return;
			}
			let r = typeof t.href == "string" && t.href.length > 0 ? t.href : null;
			this.switchLanguageAsync(n, r).catch((e) => s("switching the page's language failed.", e));
		}), this.effects.register(sa.SetThemeColors, (e) => {
			let t = e.effect, n = ++this.themeColorChanges;
			typeof t.css == "string" ? B$(document.head, t.css) : this.transport.setThemeColorsAsync(t.colors ?? null).then((e) => {
				n === this.themeColorChanges && B$(document.head, e);
			}).catch((e) => s("applying the reader's colours failed.", e));
		});
		let _ = new Hm(this.transport, { whenCurrent: () => this.current });
		f = new $m({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: _,
			valueReaders: this.extensions.valueReaders,
			recordSent: (e, t, n) => {
				let r = i.recordValue(e, t, n);
				r !== null && this.ruleWatcher.awaitAnswer(r);
			},
			refuses: (e) => v.refusesBounds(e),
			readRecorded: (e, t) => r.has(e, t) ? r.get(e, t) : void 0,
			markConflict: (e, t) => v.markConflict(e, t)
		}), i.setHeldTargets(f), this.settleValues = async () => {
			_C(), await _.whenAnsweredAsync();
		}, this.readUnsaved = () => f?.unsavedValues() ?? [], this.holdTypedDuring = (e) => f === void 0 ? e() : f.holdTypedDuring(e), this.restoreUnsaved = (e) => f?.restoreUnsaved(e, (e, t, n) => i.writeBoundValue(e, n, t)) ?? 0, this.effects.register(sa.DiscardForm, (e) => {
			let t = e.effect.formId;
			if (typeof t == "string" && t.length !== 0) {
				for (let n of f?.releaseForm(t) ?? []) i.restoreBoundValue(n, e.dom.resolveNearestComponent(n, () => !0)?.dynamicParameters ?? []);
				v.discardForm(t);
			}
		}), this.leaveGuard = new z4({
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
			confirm: (e, t) => I4(this.dialogs, t),
			pending: () => gC() || _.isBusy,
			settle: () => this.settleValues(),
			follow: (e) => this.followInPlace(e)
		}), this.updateProcessor.addPageHandler((e) => this.leaveGuard.set(e.holdsUnsavedWork === !0)), this.effects.register(wm, (e) => this.sessionKey.start(e.effect.token)), this.effects.register(sa.ConfirmLeave, (e) => {
			let t = e.effect.target;
			yo(t) ? this.leaveGuard.confirm(t) : s("confirm leave effect names no address of this site; nothing asked.", e.effect);
		});
		let v = new u6({
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
		for (let [e, t] of x8) g8(e, t, this.engineContext);
		g8("number input", ({ root: e, propertyPatchEngine: t }) => {
			this.numberInputs = new sA({
				root: e,
				propertyPatchEngine: t
			});
		}, this.engineContext), g8("tree", ({ root: e, effects: t }) => new $q({
			root: e,
			effects: t,
			rules: {
				metadata: this.metadata,
				state: r,
				renderer: h
			}
		}), this.engineContext), g8("items reorder", ({ root: e }) => new Jj({
			root: e,
			services: {
				metadata: this.metadata,
				state: r,
				keysOf: (e) => this.virtualization.keysOf(e)
			}
		}), this.engineContext), g8("press ripple", ({ root: e }) => new _X({
			root: e,
			clicks: (e) => this.metadata.hasServerEventForComponent("click", T(e)) || p.hasEventForComponent("click", T(e)),
			waves: document.documentElement.hasAttribute(Kr)
		}), this.engineContext), g8("overlay scrollbars", () => document.documentElement.hasAttribute("data-ui-overlay-scrollbars") ? new BX() : void 0, this.engineContext), this.eventPipeline = new mh({
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
			uploads: Yb,
			isReattaching: () => this.transport.isReattaching
		});
		for (let e of /* @__PURE__ */ new Set([...this.metadata.getEventNames(), ...d.getSourceEventNames()])) this.eventPipeline.addEvent(e);
		this.eventPipeline.addEvent(NJ.name, NJ.registration);
		let ee = (e) => this.updateProcessor.resortHost(e), te = Gj({
			ahead: (e, t, n) => this.updateProcessor.moves.ahead(e, t, n),
			settle: (e) => this.updateProcessor.moves.settle(e),
			resort: ee
		});
		this.eventPipeline.addEvent(te.name, te.registration);
		let ne = FJ(ee);
		this.eventPipeline.addEvent(ne.name, ne.registration), this.eventPipeline.addEvent(Qq.name, Qq.registration);
		let re = AM(this.updateProcessor.transfers);
		for (let e of this.metadata.getEventNames()) e.startsWith("drop:") && this.eventPipeline.addEvent(e, re);
		this.eventPipeline.addEvent(TC.name, TC.registration), this.eventPipeline.addEvent($E.name, $E.registration), g8("shortcuts", ({ root: e, dom: t }) => new oB({
			root: e,
			viewShortcuts: sB(this.metadata.metadata),
			componentOf: (e) => t.findComponent(e, []),
			laterChords: this.rowMenus
		}), this.engineContext), g8("item drag", ({ root: e, dom: t }) => new NM({
			root: e,
			targetOf: (e, n) => {
				let r = t.resolveNearestComponent(e, (e) => this.metadata.hasServerEventForComponent("drop:" + n, e))?.element ?? null;
				return r instanceof HTMLElement ? r : null;
			},
			keysOf: (e) => this.virtualization.keysOf(e)
		}), this.engineContext), this.tables = new mK({ root: this.root }), this.windows = new GQ({
			root: this.root,
			requestWindow: (e) => this.transport.requestItemWindowAsync(e)
		}), this.updateProcessor.addWindowRefillHandler((e) => this.windows.refilled(e)), g8("pager", ({ root: e, dom: t }) => new UB({
			root: e,
			dom: t,
			windows: this.windows
		}), this.engineContext), this.pluginContext = {
			...this.engineContext,
			strings: D,
			observeComponents: V,
			observeSize: aH,
			store: new jI(),
			numbers: Rk,
			temporal: dc,
			icons: { apply: Fo },
			badges: { writeCount: EE },
			urls: {
				isImageSource: Co,
				asBrowserReads: So,
				isSafeLink: ho,
				isExternalLink: vo
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
				let r = e.closest(x), a = r === null ? void 0 : this.metadata.getExposedProperty(T(r), t);
				return r === null || a === void 0 ? (s("a package set a property its component's renderer did not expose.", { propertyName: t }), !1) : i.applyToComponent(r, a, n);
			} },
			windows: this.windows,
			tooltips: Lz,
			renames: { open: Bu },
			tables: this.tables,
			rows: uQ(m, h, this.virtualization),
			uploads: Hb(v, Yb),
			selection: mf,
			popups: FZ(this.dom),
			roving: Sd,
			typeAhead: DF,
			focus: Yp,
			states: jl,
			validation: v,
			wheel: Gx,
			colors: UZ,
			shortcuts: cd,
			names: na
		}, this.transport.onChanges((e, t) => void this.applyChanges(e, void 0, t)), this.transport.onCommandResult((e, t) => {
			Om(this.sessionKey, e.command?.effects);
			let { changes: n, ...r } = e;
			x1(() => this.applyChanges(n, void 0, t), () => {
				this.holdsRuntime(t) && !this.dispatcher.settle(r) && (this.effects.applyAll(e.command?.effects, this.dom), this.windows.reconsider());
			}).catch((e) => c("a pushed command result could not be applied.", e));
		}), this.updateProcessor.addFullResyncHandler(() => {
			this.attachAsync().catch((e) => c("re-attaching after a full resync failed.", e));
		}), this.transport.onReconnecting((e) => {
			s("SignalR reconnecting.", e), this.awaitSnapshot(), this.dispatcher.release(Error("the connection to the server dropped before the command answered.", { cause: e }));
		}), this.transport.onReconnected(async () => {
			l("SignalR reconnected. Reattaching runtime."), await this.attachAsync();
		}), this.transport.onClosed((e) => this.loseConnection(e ?? /* @__PURE__ */ Error("the connection to the server closed."))), this.transport.onCommandExpired(() => this.notifications.show({
			message: D.text("ui.command.expired"),
			severity: "warning"
		})), this.connection = new g1({
			root: document.documentElement,
			connection: this.transport,
			notifications: this.notifications
		});
	}
	awaitSnapshot() {
		this.currentPending || (this.currentPending = !0, this.current = new Promise((e) => {
			this.markCurrent = () => {
				this.currentPending = !1, e();
			};
		}));
	}
	gateInbound(e) {
		if (e === null) return;
		let t = e.then(() => void 0, () => void 0);
		this.inbound = t, t.then(() => {
			this.inbound === t && (this.inbound = null);
		});
	}
	readPluginValue(e) {
		let t = gu(e);
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
		return r.length > 0 && this.heldRuntime !== null && !this.connectionLost && e === window.location.pathname && O8() === null && X4(t, n, r);
	}
	async switchRuntimeAsync() {
		this.endSwitchProgress = this.navigationProgress.start();
		try {
			await this.settleValues();
		} catch (e) {
			s("the values still on their way did not settle before the page went to another runtime.", e);
		}
		this.dialogs.closeAll(), this.dispatcher.release(/* @__PURE__ */ Error("the page went to another runtime of its route before the command answered.")), this.transport.holdCalls();
		let e = w8();
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
	rewriteWords(e, t, n) {
		let r = performance.now();
		this.dom.invalidate(), D.language !== this.culturesLanguage && (this.culturesLanguage = D.language, hl(this.root, (e) => u8(e, D.number, D.temporal))), D.rewriteMarks(this.root, n), this.rewriteStaticWords(e, n), e.rewriteWords(n), t.rewriteRowWords(this.root, n);
		let i = this.hydration?.title ?? null;
		if (i !== null && (n === void 0 || n(i))) {
			let e = String(D.resolve(i, !0));
			document.title !== e && (document.title = e);
		}
		D.language.length > 0 && document.documentElement.lang !== D.language && (document.documentElement.lang = D.language), d(n === void 0 ? "page's words written again" : "page's written values written again", r, { language: D.language });
	}
	rewriteStaticWords(e, t) {
		let n = t === void 0 ? this.metadata.getWords() : this.metadata.getWords().filter((e) => t(e.key));
		if (n.length === 0) return;
		let r = [];
		hl(this.root, (e) => {
			e !== this.root && r.push(e);
		});
		for (let t of n) {
			let n = w(t.componentId), i = {
				componentId: n,
				propertyId: t.propertyId
			}, a = t.dynamicParameters ?? [];
			for (let r of this.findWordInstances(n, a)) e.rewriteStatic(r, i, t.key);
			for (let o of r) for (let r of o.querySelectorAll(`[${ie}="${S(n)}"]`)) Ha(r, a) && e.rewriteStatic(r, i, t.key);
		}
	}
	findWordInstances(e, t) {
		if (t.length === 0) return this.dom.findEveryComponent(e);
		let n = this.dom.findAllComponents(e, t);
		return n.length > 0 ? n : this.dom.findAllComponents(e, []).filter((e) => Ha(e, t));
	}
	loseConnection(e) {
		if (this.connectionLost) return;
		this.connectionLost = !0, c("the connection to the server is lost; the page offers a reload.", e), this.connection.lost(), this.endSwitchProgress?.(), this.endSwitchProgress = null;
		let t = Error("the connection to the server is lost; reload the page.", { cause: e });
		this.transport.close(t), this.dispatcher.release(t), this.stashUnsaved(), this.markCurrent(), this.notifications.show({
			message: D.text("ui.connection.lost"),
			severity: "danger",
			sticky: !0,
			connection: !0,
			action: {
				label: D.text("ui.connection.reload"),
				run: () => {
					this.stashUnsaved(), this.leaveGuard.release(), this.reload();
				}
			}
		});
	}
	stashUnsaved() {
		this.unsaved.save(this.stashedPage(), this.readUnsaved());
	}
	stashedPage() {
		return {
			windowId: this.windowId,
			address: `${window.location.pathname}${window.location.search}`,
			view: this.hydration?.view ?? null
		};
	}
	reloadForView(e) {
		let t = r1(e, navigator.cookieEnabled, a1());
		t === "no-cookie" ? this.loseConnection(/* @__PURE__ */ Error(`the server asked for a reload of view '${e}', and this browser keeps no cookie the reload could write.`)) : t === "asked-again" ? this.loseConnection(/* @__PURE__ */ Error(`the server asked for a reload of view '${e}' again after one (another compile of the view, or a session cookie the browser does not keep).`)) : (s("the server asked for a reload (another compile of the view, or a session it no longer holds); reloading.", { view: e }), this.stashUnsaved(), this.leaveGuard.release(), this.reload());
	}
	reloadAsOwnTab(e) {
		s("another live tab holds this tab's id; reloading under one of its own.", { id: e }), this.leaveGuard.release(), this.reload();
	}
	reloadForFreshRuntime(e) {
		r1(e, navigator.cookieEnabled, a1()) === "reload" ? (s("the page's runtime is gone and the server built a new one; reloading.", { view: e }), this.stashUnsaved(), this.leaveGuard.release(), this.reload()) : this.loseConnection(/* @__PURE__ */ Error("the server holds a new runtime for this page again after a reload for one."));
	}
	reload() {
		this.reloading = !0, this.sessionKey.load(() => window.location.reload());
	}
	get instanceId() {
		return this.transport.instanceId;
	}
	async startAsync() {
		v(this, this.options.handlerGlobalKey);
		for (let e of this.metadata.metadata.compileWarnings ?? []) s(`the view compiled with a warning: ${e}`);
		Z0(this.root), await D8();
		let e = this.connectAsync();
		await this.hydrateAsync(), this.startEnginesAwaitingHydration(), m8(this.root), this.clientState.start(), await e && (await this.attachAsync(), !(this.connectionLost || this.reloading) && (l(`page live ${f(performance.now())} after the navigation started.`), this.putBackUnsaved()));
	}
	putBackUnsaved() {
		let e = this.restoreUnsaved(this.unsaved.take(this.stashedPage()));
		e > 0 && l(`${e} unsaved value(s) carried over the reload were put back.`);
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
		return sl(this.root) || G$(this.hydration) || this.metadata.getWords().some((e) => Rc(e.key)) || Rc(this.metadata.metadata.itemValues);
	}
	startEnginesAwaitingHydration() {
		let e = this.enginesAwaitingHydration ?? [];
		this.enginesAwaitingHydration = null;
		for (let t of e) g8(_8(t), t, this.pluginContext);
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
		this.enginesAwaitingHydration === null ? g8(_8(e), e, this.pluginContext) : this.enginesAwaitingHydration.push(e);
	}
	applyChanges(e, t, n) {
		if (this.inbound === null && !Pm(e)) {
			t?.(), this.applyAnswered(this.holdsRuntime(n) ? e : null);
			return;
		}
		let r = this.transport.instanceId, i = (this.inbound ?? Promise.resolve()).then(async () => {
			t?.(), this.applyAnswered(this.holdsRuntime(n) ? await Fm(e, r) : null);
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
			if (e >= b8) {
				this.loseConnection(/* @__PURE__ */ Error("the page fell behind the server on every attach."));
				return;
			}
		}
	}
	async attachCoreAsync() {
		if (this.connectionLost) return !1;
		let e = window.location.search, t = this.createAttachRequest(e), n = this.holdInbound(), r = performance.now();
		try {
			let i = await J$(() => this.transport.attachAsync(t), () => this.transport.isReconnecting, y8, E8), a = performance.now();
			if (i === null) return this.loseConnection(/* @__PURE__ */ Error("attaching the runtime failed after retrying.")), !1;
			if (i === "reconnecting") return !1;
			if (i.reload === !0) return this.reloadForView(this.hydration?.view ?? ""), !1;
			if (i.fresh === !0) return this.reloadForFreshRuntime(this.hydration?.view ?? ""), !1;
			i1(a1()), this.heldRuntime = i.runtime ?? null, this.runtimeSearch = e, this.dom.rebuild(), this.updateProcessor.registerServerRenderedItems(i.initialChanges), await n.previous;
			let o = w8();
			return t.switchRuntime && (this.pageId = null, o !== null && this.windows.forget(o)), this.leaveGuard.set(!1), await this.applyAttachChangesAsync(i.initialChanges), this.markCurrent(), this.updateProcessor.initializeItemsHosts(), t.switchRuntime && T8(o), this.releaseInertContent(), this.windows.start(), d("runtime attached", r, {
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
		let t = O8(), n = t === null && this.heldRuntime !== null && X4(e, this.runtimeSearch, this.hydration?.identity ?? []), r = {
			clientWindowId: this.windowId,
			route: t?.route ?? window.location.pathname,
			pageId: n ? null : this.pageId,
			view: this.hydration?.view ?? null,
			since: this.renderSequence,
			runtime: this.heldRuntime,
			parameters: t === null ? Q4(e) : t.parameters,
			timeZone: Y$(),
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
			let t = Pm(e) ? await Fm(e, this.transport.instanceId) : e;
			this.releaseInertContent(), this.holdTypedDuring(() => this.applyNow(t));
		} catch (e) {
			c("a staged value of the attach could not be fetched; the page attaches again.", e), this.reattachRequested = !0;
		}
	}
	releaseInertContent() {
		this.inertContent?.removeAttribute("inert"), this.inertContent = null, this.endSwitchProgress?.(), this.endSwitchProgress = null;
	}
};
async function C8(e = {}) {
	let t = performance.now(), n = new S8(e);
	return d("runtime built", t), await n.startAsync(), n;
}
function w8() {
	return document.querySelector(`[${zn}="${H0}"]`);
}
function T8(e) {
	if (document.scrollingElement?.scrollTo({
		top: 0,
		left: 0,
		behavior: "instant"
	}), e !== null) for (let t of [e, ...e.querySelectorAll("*")]) qY(t) && !(_A(t) === "windowed" && JY(t)) ? (HY(t), t.scrollTo({
		top: t.scrollHeight,
		left: 0,
		behavior: "instant"
	})) : (t.scrollTop !== 0 || t.scrollLeft !== 0) && t.scrollTo({
		top: 0,
		left: 0,
		behavior: "instant"
	});
}
function E8(e) {
	return new Promise((t) => window.setTimeout(t, e));
}
function D8() {
	let e = performance.getEntriesByType("navigation")[0];
	return document.readyState === "complete" || e !== void 0 && e.domContentLoadedEventStart > 0 ? Promise.resolve() : new Promise((e) => document.addEventListener("DOMContentLoaded", () => e(), { once: !0 }));
}
function O8() {
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
_(), C8().catch((e) => {
	c("Web client failed to start.", e);
});
//#endregion
