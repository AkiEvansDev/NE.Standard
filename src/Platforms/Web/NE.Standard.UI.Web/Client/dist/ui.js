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
			let r = ne(e, t);
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
	for (let t of n) t.engine || t.apply(e);
	for (let t of n) t.engine && t.apply(e);
}
function ne(e, t) {
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
var re = "data-ui-id", ie = "data-ui-context", ae = "data-ui-pc", y = "data-ui-key", oe = "data-ui-unselectable", se = "data-ui-undraggable", ce = "data-ui-unremovable", le = "data-ui-unrenamable", ue = "data-ui-no-context-menu", de = "data-ui-no-row-open", fe = "data-ui-no-row-drag", pe = "data-ui-drag-kind", me = "data-ui-drag-source", he = "data-ui-item-drop-over", ge = "data-ui-drop-boxed", _e = "ui-row__grip", ve = "data-ui-row-drop", ye = "data-ui-tabs-none-removable", be = "data-ui-tabs-draggable", xe = "data-ui-tabs-menu", Se = "data-ui-context-menu", Ce = "data-ui-context-menu-owner", we = "data-ui-context-menu-use", Te = "data-ui-action-bar", Ee = "data-ui-action-bar-key", De = "data-ui-action-bar-rest", Oe = "data-ui-menu-left-out", ke = "data-ui-in-action-bar", Ae = "ui-action-bar", je = "data-ui-row-focus", Me = "data-ui-row-cursor-waits", Ne = "data-ui-tab-out", Pe = "data-ui-cell-focus", Fe = "ui-cell-key", Ie = "data-ui-tooltip", Le = "data-ui-tooltip-placement", Re = "data-ui-tooltip-mark", ze = "data-ui-tooltip-severity", Be = "data-ui-tooltip-press", Ve = "data-ui-badge-text", He = "data-ui-badge-set", Ue = "data-ui-folds", We = "data-ui-name", Ge = "data-ui-bind-", Ke = "data-ui-into-", qe = "data-ui-bind-value", Je = (e) => `data-ui-no-${e}`, Ye = "data-ui-event-boundary", Xe = "data-ui-image-caption", Ze = "data-ui-image-crop", Qe = "data-ui-image-crop-size", $e = "ui-image", et = "ui-image__picture", tt = "ui-image--circle", nt = "data-ui-fallback-src", rt = "data-ui-fallback-icon", it = "data-ui-image-failed", at = "data-ui-icon-failed", b = "data-ui-items-host", ot = "data-ui-collection-sink", st = "data-ui-items-query", ct = "data-ui-first-visible-key", lt = "data-ui-number-culture", ut = "data-ui-page-culture", dt = "data-ui-pager-target", ft = "data-ui-pager-page", pt = "data-ui-pager-size", mt = "data-ui-temporal-culture", ht = "data-ui-temporal", gt = "data-ui-awaits-draw", _t = "ui-timestamp", vt = "ui-timestamp__text", yt = "data-ui-timestamp-format", bt = "data-ui-empty-template", xt = "data-ui-group-template", St = "data-ui-empty-placeholder", Ct = "data-ui-group-header", wt = "data-ui-group-anchor", Tt = "data-ui-group", Et = "data-ui-value-holder", Dt = "data-ui-value-end", Ot = "data-ui-value-kind", kt = "items-query", At = "first-visible-key", jt = "data-ui-host-mode", Mt = "data-ui-host-viewport", Nt = "data-ui-scroll-group", Pt = "data-ui-scroll-lines", Ft = "data-ui-source-line", It = "data-ui-window-spacer", Lt = "data-ui-window-pending", Rt = "data-ui-window-paged", zt = "data-ui-window-size", Bt = "data-ui-window-offset", Vt = "data-ui-window-total", Ht = "data-ui-window-more-before", Ut = "data-ui-window-more-after", Wt = "data-ui-window-group-before", Gt = "data-ui-window-aggregates", Kt = "data-ui-form-id", qt = "data-ui-forms", Jt = "data-ui-visibility", Yt = "data-ui-collapsed", Xt = "data-ui-menu-group", Zt = "data-ui-menu-select", Qt = "data-ui-menu-open", $t = "data-ui-menu-holds-current", en = "data-ui-menu-icons", tn = "data-ui-menu-passive", nn = "data-ui-menu-item-shortcut", rn = "data-ui-menu-surface", an = "data-ui-menu-search", on = "data-ui-menu-searching", sn = "data-ui-menu-unmatched", cn = "data-ui-drawer-toggle", ln = "data-ui-drawer-open", un = "data-ui-drawer-switch", dn = "data-ui-drawer-switch-row", fn = "data-ui-side-drawers", pn = "data-ui-drawer-pin";
function mn(e) {
	return e === "right-side" ? "data-ui-pinned-right-side" : "data-ui-pinned-left-side";
}
var hn = "data-ui-bottom-bar", gn = "data-ui-rail-drawer", _n = "data-ui-content-fills", vn = "data-ui-region", yn = "data-ui-menu-item-kind", bn = "ui-menu", x = "ui-menu-item", xn = "ui-menu-item--checked", Sn = "ui-menu-item--selected", Cn = "ui-menu--rail", wn = "ui-menu--nested", Tn = `[${yn}="header"], [${yn}="separator"]`, En = `[${Xt}] > .${x}`, Dn = `.${x}:not(${Tn})`, On = `${En}, .${x}[${yn}="check"]`, kn = "data-ui-shortcut", An = "data-ui-collapse-toggle", jn = "data-ui-folding", Mn = "data-ui-column-limits", Nn = "data-ui-row-limits", Pn = "data-ui-splitter-step", Fn = "data-ui-splitter-position", In = "data-ui-pane-layout", Ln = "data-ui-pane", Rn = "data-ui-table-column", zn = "data-ui-table-hide-below", Bn = "data-ui-table-starts-hidden", Vn = "data-ui-table-hidden", Hn = "ui-table__row", Un = "ui-table__scroll", Wn = "ui-table__header", Gn = "ui-table__resizer", Kn = "ui-tree", qn = "ui-tree__row", Jn = "ui-tree-node", Yn = "data-ui-tree-drop", Xn = "ui-tree__row--filtered", Zn = "data-ui-table-last", Qn = "data-ui-table-reordering", $n = "data-ui-table-dragging", er = "data-ui-table-drop", tr = "data-ui-table-scrolled", nr = "data-ui-table-scrollbar", rr = "data-ui-no-row-select", ir = "data-ui-tree-parent", ar = "data-ui-tree-children", or = "data-ui-tree-folder", sr = "data-ui-tree-expanded", cr = "data-ui-tree-title", lr = "data-ui-tree-loading", ur = "data-ui-tree-drop-target", dr = "data-ui-tree-boot", fr = "data-ui-tree-draggable", pr = "data-ui-row-editing", mr = "data-ui-boxed-editor", hr = "data-ui-row-idle", gr = "data-ui-step-collapsed", _r = "data-ui-step-end", vr = "data-ui-row-bar", yr = "data-ui-image-source", br = "data-ui-file-max-size", xr = "data-ui-file-pick", Sr = "data-ui-file-drop-target-id", Cr = "data-ui-service-worker", wr = "data-ui-theme", Tr = "data-ui-theme-colors", Er = "data-ui-words", Dr = "#text", Or = "data-ui-language-switcher", kr = "data-ui-theme-switcher", Ar = "data-ui-theme-choice", jr = "field", Mr = "data-ui-language", Nr = "data-ui-splitting", Pr = "data-ui-keyboard-up", Fr = "data-ui-connection", Ir = "data-ui-split-folded", Lr = "data-ui-split-edge", Rr = "data-ui-pointer-focus", zr = "data-ui-focus-within", Br = "data-ui-popup-hover", Vr = "data-ui-inner-pointer", Hr = "data-ui-selection", Ur = "data-ui-selected", Wr = "data-ui-selected-key", Gr = "data-ui-selected-keys", Kr = "data-ui-bind-selected-key", qr = "data-ui-tabs-selected", Jr = "data-ui-tab-caption", Yr = "data-ui-tab-pinned", Xr = [
	Jt,
	"data-ui-visibility-sm",
	"data-ui-visibility-md",
	"data-ui-visibility-xl",
	"data-ui-visibility-xxl"
], Zr = "data-ui-submit-form-id", S = `[${re}]`, Qr = "data-ui-href", $r = "ui-disabled", ei = "ui-loading", ti = "ui-readonly", ni = "ui-hidden", ri = "ui-dialog__surface", ii = "ui-flyout__content", ai = `.ui-context-menu, .ui-split-button__menu, .${ii}`, oi = "data-ui-focus-holder", si = "data-ui-owns-keys", ci = "[role='listbox'], [role='menu'], [role='dialog']", li = "ui-select__trigger", ui = `.${li}`, di = "ui-button", fi = `${di} ui-button--ghost ui-button--small`, pi = "ui-select", mi = "data-ui-text-title", hi = "data-ui-text-description", gi = "data-ui-text-icon", _i = "data-ui-text-badge-icon", vi = "data-ui-text-badge-text", yi = "ui-card__header--empty", bi = "ui-text-input", xi = "ui-invalid", Si = "data-ui-validation-message", Ci = {
	componentId: re,
	key: y,
	selected: Ur,
	selectedKey: Wr,
	selectedKeys: Gr,
	unselectable: oe,
	rowFocus: je,
	cellFocus: Pe,
	cellKey: Fe,
	itemsHost: b,
	valueHolder: Et,
	bindValue: qe,
	noRowOpen: de,
	noRowDrag: fe,
	eventBoundary: Ye,
	focusHolder: oi,
	ownsKeys: si,
	tooltip: Ie,
	tooltipPlacement: Le,
	contextMenu: Se,
	contextMenuUse: we,
	actionBar: Te,
	actionBarKey: Ee,
	actionBarRest: De,
	disabledClass: $r,
	loadingClass: ei,
	readOnlyClass: ti,
	hiddenClass: ni,
	buttonClass: di,
	selectClass: pi,
	textInputClass: bi,
	invalidClass: xi,
	validationMessage: Si,
	sourceLine: Ft,
	textDescription: hi,
	popupSelector: ci,
	listTriggerSelector: ui,
	tableRowClass: Hn,
	tableScrollClass: Un,
	tableHeaderClass: Wn,
	tableResizerClass: Gn,
	tableHidden: Vn,
	hostMode: jt,
	windowOffset: Bt,
	windowTotal: Vt,
	windowSize: zt,
	windowMoreAfter: Ut,
	windowAggregates: Gt,
	itemsQuery: st,
	valueKind: Ot,
	itemsQueryKind: kt,
	menuItemClass: x,
	menuItemKind: yn,
	menuItemCheckedClass: xn
};
function wi(e) {
	return String(e).replace(/[\\"]/g, "\\$&").replace(/[\u0000-\u001f\u007f]/g, (e) => `\\${e.charCodeAt(0).toString(16)} `);
}
function Ti(e) {
	return e.replace(/(\p{Ll})(\p{Lu})/gu, "$1-$2").replace(/([\p{L}\p{Nd}])(\p{Lu}\p{Ll})/gu, "$1-$2").replace(/_/g, "-").toLowerCase();
}
var Ei = 0;
function Di(e, t) {
	return e.id.length === 0 && (Ei++, e.id = `${t}-${Ei}`), e.id;
}
//#endregion
//#region src/addressing/operation-targets.ts
function Oi(e, t, n) {
	let r = t.target;
	if (r === "root") return [e];
	if (r != null && r.trim().length > 0) {
		if (e.matches(r)) return [e];
		for (let t of e.querySelectorAll(r)) if (t.closest(S) === e) return [t];
		return [];
	}
	return n();
}
//#endregion
//#region src/metadata/metadata-index.ts
var ki = {
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
}, Ai = class {
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
		return this.bindingsByComponentAndPropertyId.get($i(e, t));
	}
	getBindingByComponentAndPropertyName(e, t) {
		return this.bindingsByComponentAndPropertyName.get($i(e, Qi(t)));
	}
	getEvent(e, t) {
		return this.eventsByComponentAndName.get(ea(e, t));
	}
	hasServerEvent(e) {
		return this.eventNames.has(Zi(e));
	}
	getEventNames() {
		return this.eventNames;
	}
	hasServerEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(Zi(e))?.has(t) === !0;
	}
	getItemsTemplateMetadata(e) {
		return this.itemsTemplatesByComponentId.get(e);
	}
	getItemsFilterSortMetadata(e) {
		return this.itemsFilterSortByComponentId.get(e);
	}
	getItemValues(e, t = []) {
		return this.itemValuesByAddress.get(ta(e, t))?.items ?? [];
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
		r > 0 && this.bindingsById.set(r, e), this.bindingsByComponentAndPropertyId.set($i(t, e.propertyId), e), this.bindingsByComponentAndPropertyName.set($i(t, n.propertyName), e);
	}
	addEvent(e) {
		let t = Zi(e.eventName), n = w(e.componentId);
		if (t.length === 0 || n <= 0) return;
		this.eventsByComponentAndName.set(ea(n, t), e), this.eventNames.add(t);
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
		t > 0 && this.itemValuesByAddress.set(ta(t, e.dynamicParameters ?? []), e);
	}
	addValidation(e) {
		let t = w(e.target?.componentId);
		if (t <= 0) return;
		let n = this.validationsByComponentId.get(t);
		n === void 0 && (n = [], this.validationsByComponentId.set(t, n)), n.push(e);
	}
};
function C(e, t) {
	return typeof e == "number" ? t[e] ?? "Unknown" : e != null && t.includes(e) ? e : "Unknown";
}
function ji(e) {
	return C(e, [
		"Dynamic",
		"Fixed",
		"Scope"
	]);
}
function Mi(e) {
	return e == null ? "OneWay" : C(e, [
		"OneWay",
		"TwoWay",
		"OneWayToSource",
		"OnSubmit"
	]);
}
function Ni(e) {
	return C(e, ["Property", "Event"]);
}
function Pi(e) {
	return e == null ? "SetProperty" : C(e, [
		"SetProperty",
		"Effect",
		"CopyValue"
	]);
}
function Fi(e) {
	return C(e, [
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
function Ii(e) {
	return C(e, ["Ascending", "Descending"]);
}
function Li(e) {
	return C(e, [
		"Change",
		"Blur",
		"Submit"
	]);
}
function Ri(e) {
	return C(e, [
		"Error",
		"Warning",
		"Info"
	]);
}
function zi(e) {
	return typeof e == "string" ? e : C(e, [
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
function Bi(e) {
	return C(e, [
		"None",
		"HasValue",
		"HasText",
		"IsTrue",
		"IsFalse",
		"DrawsIcon"
	]);
}
function Vi(e) {
	return C(e, [
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
function Hi(e) {
	return typeof e == "string" ? e : "";
}
function Ui(e) {
	return C(e.kind, [
		"Value",
		"CollectionChange",
		"FullResync",
		"Validation",
		"Page"
	]);
}
function Wi(e) {
	return typeof e == "string" ? e.trim() : "";
}
function Gi(e) {
	return C(e, ["Auto", "Smooth"]);
}
function Ki(e) {
	return C(e, [
		"Start",
		"Center",
		"End",
		"Nearest"
	]);
}
function qi(e) {
	return C(e, [
		"Start",
		"End",
		"Offset",
		"PageBack",
		"PageForward"
	]);
}
function Ji(e) {
	return C(e, ["Light", "Dark"]);
}
function Yi(e) {
	return C(e, ["Horizontal", "Vertical"]);
}
function Xi(e) {
	return C(e, ["Polite", "Assertive"]);
}
function Zi(e) {
	return e?.trim().toLowerCase() ?? "";
}
function Qi(e) {
	return e?.trim() ?? "";
}
function $i(e, t) {
	return `${e}:${Qi(t)}`;
}
function ea(e, t) {
	return `${e}:${Zi(t)}`;
}
function ta(e, t) {
	return `${e}:${JSON.stringify(t.map((e) => String(e ?? "")))}`;
}
//#endregion
//#region src/addressing/address-resolver.ts
var na = class {
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
		let a = w(this.metadata.getBindingByComponentAndPropertyId(n, e.propertyId)?.bindingId), o = a > 0 ? `[${Ge}${Ti(r.propertyName)}="${wi(a)}"]` : null;
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
		return Oi(e.component, t, () => {
			if (e.bindingSelector === null) return [e.component.querySelector(`[data-ui-into-${Ti(e.propertyName)}]`) ?? e.component];
			let t = Array.from(e.component.querySelectorAll(e.bindingSelector));
			return e.component.matches(e.bindingSelector) && t.unshift(e.component), t;
		});
	}
};
//#endregion
//#region src/addressing/dynamic-parameters.ts
function ra(e) {
	return sa(e, ae);
}
function ia(e, t) {
	if (t <= 0) return [];
	let n = [], r = e, i = null;
	for (; r !== null && n.length < t;) {
		let e = la(r);
		if (e !== void 0) {
			let t = r.closest(ca);
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
function aa(e, t) {
	let n = ra(e);
	if (n !== t.length) return !1;
	if (n === 0) return !0;
	let r = ia(e, n);
	if (r.length !== t.length) return !1;
	for (let e = 0; e < t.length; e++) if (String(r[e] ?? "") !== String(t[e] ?? "")) return !1;
	return !0;
}
function oa(e, t) {
	let n = t.length - 1, r = e, i = null;
	for (; r !== null && n >= 0;) {
		let e = la(r);
		if (e !== void 0) {
			let a = r.closest(ca);
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
function sa(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.trim().length === 0) return 0;
	let r = Number(n);
	return Number.isInteger(r) ? r : 0;
}
var ca = `[${b}]`;
function la(e) {
	return e.getAttribute("data-ui-key") ?? e.getAttribute("data-ui-group-anchor") ?? void 0;
}
//#endregion
//#region src/addressing/dom-registry.ts
var ua = `[${Ct}]`, da = 64, fa = 256;
function pa(e, t) {
	let n = [];
	for (let r of e) r instanceof HTMLElement && r.matches(t) ? n.push(r) : n.push(...r.querySelectorAll(t));
	return n;
}
var ma = class {
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
			if (e === void 0 || this.changedScopes.size >= da) {
				this.stale = !0, this.changedScopes.clear();
				return;
			}
			this.changedScopes.add(e);
		}
	}
	rebuild() {
		this.stale = !1, this.componentsById.clear(), this.staticComponentsById.clear(), this.keyedComponentsById.clear(), this.indexed.clear(), this.changedScopes.clear(), this.unsettledIds.clear();
		let e = this.root.querySelectorAll(S), t = this.root.querySelector(ua) !== null;
		for (let n of e) {
			let e = T(n);
			if (e <= 0 || t && n.closest(ua) !== null) continue;
			let r = this.componentsById.get(e);
			r === void 0 && (r = [], this.componentsById.set(e, r)), r.push(n), this.indexed.add(n), !this.staticComponentsById.has(e) && va(n) && this.staticComponentsById.set(e, n);
		}
		this.patchedSincePrune = 0, this.prunedSize = this.indexed.size;
	}
	findComponent(e, t) {
		return this.findAllComponents(e, t)[0] ?? null;
	}
	ensureId(e, t) {
		return Di(e, t);
	}
	findComponentParts(e, t, n) {
		return pa(this.findAllComponents(e, t), n);
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
		let n = this.keyedComponents(e).get(_a(t)) ?? [];
		if (n.length > 0 && n.every((e) => this.holds(e) && aa(e, t))) return [...n];
		let r = this.liveComponents(e).filter((e) => aa(e, t));
		return (n.length > 0 || r.length > 0) && this.keyedComponentsById.delete(e), r;
	}
	sync() {
		if (this.stale) {
			this.rebuild();
			return;
		}
		if (this.changedScopes.size !== 0) {
			for (let e of this.changedScopes) this.holds(e) && this.addComponentsIn(e);
			this.changedScopes.clear(), this.patchedSincePrune > Math.max(this.prunedSize, fa) && this.prune();
		}
	}
	addComponentsIn(e) {
		if (e.closest(ua) !== null) return;
		let t = e.querySelector(ua) !== null;
		e.matches(S) && this.addComponent(e, !1);
		for (let n of e.querySelectorAll(S)) this.addComponent(n, t);
	}
	addComponent(e, t) {
		let n = T(e);
		if (n <= 0) return;
		if (this.indexed.has(e)) {
			this.unsettledIds.add(n);
			return;
		}
		if (t && e.closest(ua) !== null) return;
		this.indexed.add(e), this.patchedSincePrune++, this.keyedComponentsById.delete(n);
		let r = this.componentsById.get(n);
		r === void 0 ? (this.componentsById.set(n, [e]), va(e) && this.staticComponentsById.set(n, e)) : (r.push(e), this.unsettledIds.add(n));
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
		r && (t.length = n, this.keyedComponentsById.delete(e)), i && !xa(t) && t.sort(ba), t.length === 0 ? (this.componentsById.delete(e), this.staticComponentsById.delete(e)) : (r || i) && this.settleStatic(e, t);
	}
	settleStatic(e, t) {
		for (let n of t) if (va(n)) {
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
			let e = ra(n);
			if (e === 0) continue;
			let r = ia(n, e);
			if (r.length !== e) continue;
			let i = _a(r), a = t.get(i);
			a === void 0 ? t.set(i, [n]) : a.push(n);
		}
		return this.keyedComponentsById.set(e, t), t;
	}
	holds(e) {
		return Sa(this.root, e);
	}
	resolveNearestComponent(e, t) {
		this.sync();
		let n = e;
		for (; n !== null;) {
			let e = n.closest(S);
			if (e === null || !Sa(this.root, e)) return null;
			let r = T(e);
			if (r > 0 && t(r, e)) return {
				element: e,
				componentId: r,
				dynamicParameters: ia(e, ra(e))
			};
			n = e.parentElement;
		}
		return null;
	}
};
function T(e) {
	return sa(e, re);
}
function ha(e) {
	let t = e.closest(S), n = t === null ? 0 : T(t);
	return n > 0 ? n : null;
}
function ga(e) {
	let t = e.closest(S), n = t === null ? 0 : T(t);
	return t === null || n <= 0 ? null : {
		componentId: n,
		dynamicParameters: ia(t, ra(t))
	};
}
function _a(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function va(e) {
	return ra(e) === 0;
}
function ya(e, t) {
	return (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
}
function ba(e, t) {
	return e === t ? 0 : ya(e, t) ? -1 : 1;
}
function xa(e) {
	for (let t = 1; t < e.length; t++) if (!ya(e[t - 1], e[t])) return !1;
	return !0;
}
function Sa(e, t) {
	return e === t || e instanceof Node && e.contains(t);
}
//#endregion
//#region src/runtime/plural-rules.ts
function Ca(e, t) {
	if (!Number.isFinite(t)) return "other";
	let n = Math.abs(t), r = Math.trunc(n), i = wa(n);
	switch (Ta(e)) {
		case "en":
		case "de": return r === 1 && i === 0 ? "one" : "other";
		case "es": return n === 1 ? "one" : Ea(r, i) ? "many" : "other";
		case "fr": return r === 0 || r === 1 ? "one" : Ea(r, i) ? "many" : "other";
		case "ru":
		case "uk": return Da(r, i);
		case "pl": return Oa(r, i);
		default: return "other";
	}
}
function wa(e) {
	if (Number.isInteger(e)) return 0;
	let t = String(e), n = t.indexOf("e"), r = n < 0 ? t : t.slice(0, n), i = n < 0 ? 0 : Number(t.slice(n + 1)), a = r.indexOf("."), o = a < 0 ? 0 : r.length - a - 1;
	return Math.max(0, o - i);
}
function Ta(e) {
	return e == null || e.trim().length === 0 ? "" : e.split(/[-_]/, 1)[0].toLowerCase();
}
function Ea(e, t) {
	return t === 0 && e !== 0 && e % 1e6 == 0;
}
function Da(e, t) {
	if (t !== 0) return "other";
	let n = e % 10, r = e % 100;
	return n === 1 && r !== 11 ? "one" : n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
function Oa(e, t) {
	if (t !== 0) return "other";
	if (e === 1) return "one";
	let n = e % 10, r = e % 100;
	return n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
//#endregion
//#region src/rendering/temporal-format.ts
function ka(e, t) {
	return `${e.date} ${t ? e.longTime : e.shortTime}`;
}
var Aa = {
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
function ja(e) {
	let t = e.closest("[data-ui-temporal-culture]")?.getAttribute("data-ui-temporal-culture") ?? null;
	if (t === null) return Aa;
	try {
		return {
			...Aa,
			...JSON.parse(t)
		};
	} catch {
		return Aa;
	}
}
var Ma = [
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
function Na(e, t, n) {
	if (t == null || t.trim().length === 0) return `${Ba(e.getFullYear(), 4)}-${Ba(e.getMonth() + 1, 2)}-${Ba(e.getDate(), 2)} ${Ba(e.getHours(), 2)}:${Ba(e.getMinutes(), 2)}:${Ba(e.getSeconds(), 2)}`;
	let r = "", i = Pa(t);
	for (let a = 0; a < t.length;) {
		let o = Ra(t, a);
		if (o === null) {
			r += t[a], a++;
			continue;
		}
		r += za(o, e, n, i), a += o.length;
	}
	return r;
}
function Pa(e) {
	for (let t = 0; t < e.length;) {
		let n = Ra(e, t);
		if (n === null) {
			t++;
			continue;
		}
		if (n === "d" || n === "dd") return !0;
		t += n.length;
	}
	return !1;
}
var Fa = /^[-./:,]$/, Ia = /* @__PURE__ */ new Set([
	"MMMM",
	"MMM",
	"dddd",
	"ddd",
	"tt"
]);
function La(e) {
	for (let t = 0; t < e.length;) {
		let n = Ra(e, t);
		if (n !== null && Ia.has(n) || n === null && !Fa.test(e[t]) && !/\s/.test(e[t])) return !1;
		t += n?.length ?? 1;
	}
	return e.trim().length > 0;
}
function Ra(e, t) {
	for (let n of Ma) if (e.startsWith(n, t)) return n;
	return null;
}
function za(e, t, n, r) {
	let i = t.getHours(), a = ao(i);
	switch (e) {
		case "yyyy": return Ba(t.getFullYear(), 4);
		case "yy": return Ba(t.getFullYear() % 100, 2);
		case "MMMM": return r ? n.monthGenitiveNames[t.getMonth()] : n.monthNames[t.getMonth()];
		case "MMM": return n.abbreviatedMonthNames[t.getMonth()];
		case "MM": return Ba(t.getMonth() + 1, 2);
		case "M": return String(t.getMonth() + 1);
		case "dddd": return n.dayNames[t.getDay()];
		case "ddd": return n.abbreviatedDayNames[t.getDay()];
		case "dd": return Ba(t.getDate(), 2);
		case "d": return String(t.getDate());
		case "HH": return Ba(i, 2);
		case "H": return String(i);
		case "hh": return Ba(a, 2);
		case "h": return String(a);
		case "mm": return Ba(t.getMinutes(), 2);
		case "m": return String(t.getMinutes());
		case "ss": return Ba(t.getSeconds(), 2);
		case "s": return String(t.getSeconds());
		case "tt": return i < 12 ? n.amDesignator : n.pmDesignator;
		default: return e;
	}
}
function Ba(e, t) {
	return String(e).padStart(t, "0");
}
var Va = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function Ha(e) {
	let t = Va.exec(e.trim());
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
function Ua(e) {
	return Wa(e.year, e.month - 1, e.day, e.hour, e.minute, e.second, e.millisecond);
}
function Wa(e, t, n, r = 0, i = 0, a = 0, o = 0) {
	let s = new Date(2e3, 0, 1, r, i, a, o);
	return s.setFullYear(e, t, n), s;
}
var Ga = {
	year: "y",
	month: "M",
	day: "d",
	hour: "H",
	minute: "m",
	second: "s"
};
function Ka(e, t) {
	let n = "";
	for (let r = 0; r < e.length;) {
		let i = Ra(e, r);
		if (i === null) {
			n += e[r], r++;
			continue;
		}
		n += qa(i, t).repeat(i.length), r += i.length;
	}
	return n;
}
function qa(e, t) {
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
function Ja(e, t, n) {
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
		let a = Ra(t, e);
		if (a === null) {
			if (!Ya(r, i, t[e])) return null;
			e++;
			continue;
		}
		if (!Xa(r, i, a, n)) return null;
		e += a.length;
	}
	return r.length > 0 && i.position === r.length ? ro(i) : null;
}
function Ya(e, t, n) {
	if (/\s/.test(n)) {
		for (; t.position < e.length && /\s/.test(e[t.position]);) t.position++;
		return !0;
	}
	return Fa.test(n) ? t.position >= e.length || !Fa.test(e[t.position]) ? !1 : (t.position++, !0) : t.position >= e.length || e[t.position].toLowerCase() !== n.toLowerCase() ? !1 : (t.position++, !0);
}
function Xa(e, t, n, r) {
	switch (n) {
		case "yyyy": return Za(t, "year", eo(e, t, 4, 4));
		case "yy": return Za(t, "year", Qa(eo(e, t, 2, 2)));
		case "MMMM":
		case "MMM": return Za(t, "month", $a(to(e, t, [
			r.monthNames,
			r.monthGenitiveNames,
			r.abbreviatedMonthNames
		])));
		case "MM":
		case "M": return Za(t, "month", eo(e, t, 1, 2));
		case "dddd":
		case "ddd": return to(e, t, [r.dayNames, r.abbreviatedDayNames]) !== null;
		case "dd":
		case "d": return Za(t, "day", eo(e, t, 1, 2));
		case "HH":
		case "H": return Za(t, "hour", eo(e, t, 1, 2));
		case "hh":
		case "h": return Za(t, "hour12", eo(e, t, 1, 2));
		case "mm":
		case "m": return Za(t, "minute", eo(e, t, 1, 2));
		case "ss":
		case "s": return Za(t, "second", eo(e, t, 1, 2));
		case "tt": return no(e, t, r);
		default: return !1;
	}
}
function Za(e, t, n) {
	return n !== null && (e[t] = n, !0);
}
function Qa(e) {
	return e === null ? null : e + (e < 50 ? 2e3 : 1900);
}
function $a(e) {
	return e === null ? null : e + 1;
}
function eo(e, t, n, r) {
	let i = t.position;
	for (; i < e.length && i - t.position < r && e[i] >= "0" && e[i] <= "9";) i++;
	if (i - t.position < n) return null;
	let a = Number(e.slice(t.position, i));
	return t.position = i, a;
}
function to(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = null, a = 0;
	for (let e of n) for (let t = 0; t < e.length; t++) {
		let n = e[t].toLowerCase();
		n.length > a && r.startsWith(n) && (i = t, a = n.length);
	}
	return t.position += a, i;
}
function no(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = n.amDesignator.toLowerCase(), a = n.pmDesignator.toLowerCase();
	for (let [e, n] of i.length >= a.length ? [[i, !1], [a, !0]] : [[a, !0], [i, !1]]) if (e.length > 0 && r.startsWith(e)) return t.position += e.length, t.afternoon = n, !0;
	return i.length === 0 && a.length === 0;
}
function ro(e) {
	let t = e.hour ?? 0;
	if (e.hour12 !== null) {
		if (e.hour12 < 1 || e.hour12 > 12) return null;
		t = e.hour12 % 12 + (e.afternoon === !0 ? 12 : 0);
	}
	return e.year === null || e.month === null || e.day === null || e.year < 1 || e.month < 1 || e.month > 12 || e.day < 1 || e.day > Wa(e.year, e.month, 0).getDate() || t > 23 || e.minute > 59 || e.second > 59 ? null : {
		year: e.year,
		month: e.month,
		day: e.day,
		hour: t,
		minute: e.minute,
		second: e.second,
		millisecond: 0
	};
}
var io = {
	readCulture: ja,
	format: Na,
	parse: Ha,
	toDate: Ua
};
function ao(e) {
	return e % 12 == 0 ? 12 : e % 12;
}
//#endregion
//#region src/rendering/timestamp-format.ts
var oo = /(?:Z|[+-]\d{2}(?::?\d{2})?)$/i, so = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function co(e) {
	let t = e?.trim() ?? "";
	if (!so.test(t)) return null;
	let n = Date.parse(oo.test(t) ? t : `${t}Z`);
	return Number.isNaN(n) ? null : n;
}
function lo(e) {
	return e === "date" || e === "time" || e === "relative" || e === "relative-date" ? e : "date-time";
}
function uo(e) {
	return e === "relative" || e === "relative-date";
}
var fo = {
	...Aa,
	date: "yyyy-MM-dd",
	shortTime: "HH:mm",
	longTime: "HH:mm:ss"
};
function po(e, t, n, r) {
	if (t === "relative") return wo(e - r, n.language);
	if (t === "relative-date") {
		let t = ho(e, r);
		if (t !== null) return vo(n.language).format(t, "day");
	}
	let i = n.temporal ?? fo, a = t === "date" || t === "relative-date" ? i.date : t === "time" ? i.shortTime : ka(i, !1);
	return Na(new Date(e), a, i);
}
function mo(e, t, n, r) {
	let i = po(e, t, n, r);
	return t === "relative-date" ? go(i, n.language) : i;
}
function ho(e, t) {
	let n = new Date(e), r = new Date(t), i = Math.round((Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) - Date.UTC(r.getFullYear(), r.getMonth(), r.getDate())) / Co);
	return Math.abs(i) <= 1 ? i : null;
}
function go(e, t) {
	return e.length === 0 ? e : e.charAt(0).toLocaleUpperCase(yo(t)) + e.slice(1);
}
var _o = /* @__PURE__ */ new Map();
function vo(e) {
	let t = _o.get(e);
	return t === void 0 && (t = new Intl.RelativeTimeFormat(yo(e), { numeric: "auto" }), _o.set(e, t)), t;
}
function yo(e) {
	if (e.length !== 0) try {
		return Intl.DateTimeFormat.supportedLocalesOf(e).length > 0 ? e : void 0;
	} catch {
		return;
	}
}
var bo = 1e3, xo = 60 * bo, So = 60 * xo, Co = 24 * So;
function wo(e, t) {
	let n = vo(t), r = Math.abs(e);
	return r < 45 * bo ? n.format(0, "second") : r < 45 * xo ? n.format(Math.round(e / xo), "minute") : r < 22 * So ? n.format(Math.round(e / So), "hour") : r < 26 * Co ? n.format(Math.round(e / Co), "day") : r < 320 * Co ? n.format(Math.round(e / (30.4375 * Co)), "month") : n.format(Math.round(e / (365.25 * Co)), "year");
}
//#endregion
//#region src/runtime/words.ts
var To = "count";
function Eo(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	if (typeof t.key != "string" || t.key.trim().length === 0) return !1;
	for (let e of Object.keys(t)) if (e !== "key" && e !== "args") return !1;
	return t.args === void 0 || t.args === null || typeof t.args == "object" && !Array.isArray(t.args);
}
function Do(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.text == "string" && t.text.trim().length > 0 && Object.keys(t).length === 1;
}
var Oo = /* @__PURE__ */ new Set([
	"date-time",
	"date",
	"time",
	"relative",
	"relative-date"
]);
function ko(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	for (let e of Object.keys(t)) if (e !== "moment" && e !== "format") return !1;
	return typeof t.moment == "string" && co(t.moment) !== null && (t.format === void 0 || typeof t.format == "string" && Oo.has(t.format));
}
function Ao(e) {
	if (typeof e != "object" || !e) return !1;
	if (ko(e)) return !0;
	for (let t of Array.isArray(e) ? e : Object.values(e)) if (Ao(t)) return !0;
	return !1;
}
function jo(e, t) {
	let n = new Date(e).toISOString(), r = n.slice(0, 10), i = n.slice(11, 16);
	return t === "date" || t === "relative-date" ? r : t === "time" ? `${i} UTC` : `${r} ${i} UTC`;
}
function Mo(e, t, n) {
	return Eo(e) ? Fo(n, e.key, e.args) : Do(e) ? No(n, e.text) : t && typeof e == "string" ? No(n, e) : e;
}
function No(e, t) {
	return t.trim().length === 0 || !Po(e.prefixes, t) ? t : e.lookup(t) ?? t;
}
function Po(e, t) {
	if (e.length === 0) return !0;
	for (let n of e) if (t.startsWith(n)) return !0;
	return !1;
}
function Fo(e, t, n) {
	let r = n?.[To];
	return Io(typeof r == "number" ? e.lookup(`${t}.${Ca(e.language, r)}`) ?? e.lookup(`${t}.other`) ?? e.lookup(t) ?? t : e.lookup(t) ?? t, n, (t) => Do(t) ? No(e, t.text) : Fo(e, t.key, t.args), e.writeMoment);
}
function Io(e, t, n, r = jo) {
	if (t == null || !e.includes("{")) return e;
	let i = "", a = 0;
	for (; a < e.length;) {
		if (e[a] === "{") {
			let o = Lo(e, a);
			if (o > 0) {
				let s = e.slice(a + 1, o);
				if (Object.hasOwn(t, s)) {
					i += zo(t[s], n, r), a = o + 1;
					continue;
				}
			}
		}
		i += e[a], a++;
	}
	return i;
}
function Lo(e, t) {
	let n = t + 1;
	for (; n < e.length && Ro(e.charCodeAt(n));) n++;
	return n > t + 1 && n < e.length && e[n] === "}" ? n : -1;
}
function Ro(e) {
	return e >= 48 && e <= 57 || e >= 65 && e <= 90 || e >= 97 && e <= 122 || e === 95;
}
function zo(e, t, n) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "boolean" ? e ? "true" : "false" : Eo(e) ? t === void 0 ? Io(e.key, e.args, void 0, n) : t(e) : Do(e) ? t === void 0 ? e.text : t(e) : ko(e) ? n(co(e.moment) ?? 0, e.format ?? "date-time") : String(e);
}
//#endregion
//#region src/rendering/moment-first-paint.ts
var Bo = `script[type='application/json'][${ht}]`;
function Vo(e) {
	let t = e.querySelector(Bo)?.textContent?.trim() ?? "";
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
var Ho = 15e3, Uo = /* @__PURE__ */ new Set(), Wo = null;
function Go(e) {
	Uo.add(e), Wo === null && (Wo = setInterval(Ko, Ho));
}
function Ko() {
	for (let e of [...Uo]) {
		let t = !1;
		try {
			t = e();
		} catch (e) {
			s("a relative tick failed; it is ticked no more.", e);
		}
		t || Uo.delete(e);
	}
	Uo.size === 0 && Wo !== null && (clearInterval(Wo), Wo = null);
}
//#endregion
//#region src/runtime/client-strings.ts
var qo = 256, Jo = 512, Yo = "script[type='application/json'][data-ui-strings]", Xo = `[${Er}*='"moment"']`, Zo = class {
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
		this.tableLoaded || (this.currentTemporal = Vo(e) ?? this.currentTemporal);
		let t = e.querySelector(Yo)?.textContent?.trim() ?? "";
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
		return this.lookup(e) === void 0 && this.text(e), Fo(this, e, t);
	}
	translate(e, t) {
		return Fo(this, e, t);
	}
	writeMoment = (e, t) => (uo(t) && this.noteRelative(), po(e, t, {
		temporal: this.currentTemporal,
		language: this.currentLanguage
	}, Date.now()));
	noteRelative() {
		this.relativeWritten = !0, this.momentHandlers.size > 0 && Go(this.tickMoments);
	}
	tickMoments = () => this.relativeWritten ? (this.relativeWritten = !1, this.notify(this.momentHandlers, "a moment tick handler failed."), !0) : !1;
	resolve(e, t) {
		return Mo(e, t, this);
	}
	resolveText(e) {
		return Mo(e, !0, this);
	}
	write(e, t, n, r) {
		rs(e, t, this.translate(n, r)), this.mark(e, t, r == null || Object.keys(r).length === 0 ? [n] : [n, r]);
	}
	writeText(e, t, n) {
		rs(e, t, Mo(n, !0, this)), this.mark(e, t, n);
	}
	writeValue(e, t, n) {
		if (Eo(n)) {
			this.write(e, t, n.key, n.args);
			return;
		}
		let r = Do(n) ? n.text : typeof n == "string" ? n : "";
		if (r.trim().length > 0) {
			this.writeText(e, t, r);
			return;
		}
		rs(e, t, ""), this.mark(e, t, null);
	}
	mark(e, t, n) {
		es(e, t, n);
	}
	rewriteMarks(e, t = !1) {
		is(e, (e) => {
			for (let n of e.querySelectorAll(t ? Xo : `[${Er}]`)) for (let [e, r] of Object.entries(ns(n))) {
				if (t && !Ao(r)) continue;
				let i = this.wordsOfMark(r);
				i !== null && rs(n, e === "#text" ? null : e, i);
			}
		});
	}
	wordsOfMark(e) {
		if (typeof e == "string") return Mo(e, !0, this);
		if (!Array.isArray(e)) return null;
		let [t, n] = e;
		return typeof t == "string" ? this.translate(t, typeof n == "object" && n ? n : null) : null;
	}
	askLater(e) {
		this.asker === null || !this.tableLoaded || e.length > Jo || e.trim().length === 0 || this.complete && !(this.report && this.currentPrefixes.length > 0 && Po(this.currentPrefixes, e)) || this.askedIn(this.currentLanguage).has(e) || (this.pending.add(e), !this.flushQueued && (this.flushQueued = !0, setTimeout(() => void this.flushAsync(), 0)));
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
		for (let r = 0; r < n.length; r += qo) try {
			let a = await e(t, n.slice(r, r + qo));
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
function Qo(e) {
	let t = !1;
	return is(e, (e) => {
		t ||= e.querySelector(Xo) !== null;
	}), t;
}
function $o(e, t) {
	e.hasAttribute("data-ui-words") && es(e, t, null);
}
function es(e, t, n) {
	let r = ns(e), i = t ?? "#text";
	if (n === null) {
		if (!(i in r)) return;
		delete r[i];
	} else r[i] = n;
	let a = JSON.stringify(r);
	Object.keys(r).length === 0 ? e.removeAttribute(Er) : e.getAttribute("data-ui-words") !== a && e.setAttribute(Er, a);
}
function ts(e) {
	let t = ns(e)[Dr];
	if (typeof t == "string") return t;
	if (!Array.isArray(t) || typeof t[0] != "string") return null;
	let n = t[1];
	return {
		key: t[0],
		args: typeof n == "object" && n ? n : null
	};
}
function ns(e) {
	let t = e.getAttribute(Er);
	if (t === null || t.length === 0) return {};
	try {
		let e = JSON.parse(t);
		return typeof e == "object" && e && !Array.isArray(e) ? e : {};
	} catch {
		return {};
	}
}
function rs(e, t, n) {
	if (t === null) {
		e.textContent !== n && (e.textContent = n);
		return;
	}
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function is(e, t) {
	t(e);
	for (let n of e.querySelectorAll("template")) is(n.content, t);
}
var E = new Zo();
function as(e, t) {
	let n = Do(e) ? e.text : e;
	return E.resolve(n, typeof n == "string" && n.length > 0 && t());
}
//#endregion
//#region src/updates/row-idle.ts
var os = "row-idle";
function ss(e) {
	let t = e.parentElement;
	t !== null && (ds(t) ? cs(t) : !t.hasAttribute("data-ui-id") && t.parentElement !== null && ds(t.parentElement) && cs(t.parentElement));
}
function cs(e) {
	let t = ls(e);
	e.hasAttribute("data-ui-row-idle") !== t && e.toggleAttribute(hr, t);
}
function ls(e) {
	for (let t of e.children) {
		if (t.hasAttribute("data-ui-id")) {
			if (us(t)) return !0;
			continue;
		}
		for (let e of t.children) if (e.hasAttribute("data-ui-id") && us(e)) return !0;
	}
	return !1;
}
function us(e) {
	return e.classList.contains("ui-disabled") || e.classList.contains("ui-loading");
}
function ds(e) {
	return e.hasAttribute("data-ui-key") && e.parentElement?.hasAttribute("data-ui-items-host") === !0;
}
//#endregion
//#region src/interactions/interactive-state.ts
var fs = `.${$r}, .${ei}, [inert]`;
function ps(e) {
	return `:scope > [${re}]:is(${e}), :scope > :not([${re}]) > [${re}]:is(${e})`;
}
var ms = ps(fs), hs = /* @__PURE__ */ new Map();
function D(e) {
	return e.closest(fs) !== null || e.matches(":disabled, [aria-disabled='true']");
}
function O(e) {
	return e.matches(fs) || e.querySelector(ms) !== null;
}
function gs(e, t) {
	if (e.hasAttribute(t)) return !0;
	let n = hs.get(t);
	return n === void 0 && (n = ps(`[${t}]`), hs.set(t, n)), e.querySelector(n) !== null;
}
function _s(e) {
	return e.getClientRects().length > 0 && !e.matches(":disabled") && e.closest("[inert]") === null;
}
var vs = `[${re}], .${ti}`;
function k(e) {
	return e.closest(vs)?.matches(`.${ti}`) === !0;
}
function ys(e, t) {
	e.classList.contains("ui-disabled") !== t && (e.classList.toggle($r, t), ss(e)), t ? e.setAttribute("aria-disabled", "true") : e.removeAttribute("aria-disabled");
}
var bs = {
	isInert: D,
	isReadOnly: k,
	setDisabled: ys
};
//#endregion
//#region src/interactions/grid-tracks.ts
function xs(e, t) {
	return Math.max(e, Math.round(t / 10));
}
function Ss(e) {
	let t = [];
	for (let n of Ts(e.trim())) {
		let e = /^repeat\(\s*(\d+)\s*,(.+)\)$/s.exec(n);
		if (e !== null) {
			let n = Ss(e[2]);
			if (n === null) return null;
			for (let r = Number(e[1]); r > 0; r--) t.push(...n);
			continue;
		}
		let r = Cs(n);
		if (r === null) return null;
		t.push(r);
	}
	return t.length === 0 ? null : t;
}
function Cs(e) {
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
	if (n !== null) return ws({
		kind: "auto",
		value: 0
	}, Number(n[1]));
	let r = /^minmax\(\s*([\d.]+)(?:px)?\s*,\s*([\d.]+)(fr|px)\s*\)$/.exec(e);
	if (r !== null) return ws(r[3] === "fr" ? {
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
function ws(e, t) {
	return t > 0 ? {
		...e,
		min: t
	} : e;
}
function Ts(e) {
	let t = [], n = 0, r = 0;
	for (let i = 0; i < e.length; i++) {
		let a = e[i];
		a === "(" ? n++ : a === ")" ? n-- : a === " " && n === 0 && (i > r && t.push(e.slice(r, i)), r = i + 1);
	}
	return r < e.length && t.push(e.slice(r)), t;
}
function Es(e, t = "auto") {
	return e.map((e) => Ds(e, t)).join(" ");
}
function Ds(e, t) {
	switch (e.kind) {
		case "px": return `${Os(e.value)}px`;
		case "star": return `minmax(${e.min === void 0 ? "0" : `${Os(e.min)}px`}, ${Os(e.value)}fr)`;
		case "auto": return e.min === void 0 ? e.max === void 0 ? t : `fit-content(${Os(e.max)}px)` : `minmax(${Os(e.min)}px, auto)`;
	}
}
function Os(e) {
	return String(Math.round(e * 1e3) / 1e3);
}
function ks(e) {
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
function As(e, t) {
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
function js(e, t, n) {
	let r = 0, i = n;
	for (let n of t) n < e && n + 1 > r ? r = n + 1 : n > e && n < i && (i = n);
	let a = Ms(r, e), o = Ms(e + 1, i);
	return a.length === 0 || o.length === 0 ? null : {
		before: a,
		after: o
	};
}
function Ms(e, t) {
	let n = [];
	for (let r = e; r < t; r++) n.push(r);
	return n;
}
var Ns = {
	sliver: 120,
	passFloors: !1
};
function Ps(e, t, n, r, i = Ns) {
	let a = Ls(e, t, n.before), o = Ls(e, t, n.after);
	if (a.total + o.total <= 0) return null;
	let s = Math.max((i.passFloors ? 0 : a.min) - a.total, o.total - o.max), c = Math.min(a.max - a.total, o.total - (i.passFloors ? 0 : o.min));
	if (s > c) return null;
	let l = (e) => i.sliver > 0 && i.passFloors ? Math.max(i.sliver, e.min) : i.sliver, u = Is(Math.min(Math.max(r, s), c), r, a.total, o.total, s, c, l(a), l(o));
	if (u === 0) return null;
	let d = [...e], f = n.before.every((t) => e[t].kind === "star"), p = n.after.every((t) => e[t].kind === "star");
	if (f && p) {
		let t = Hs(n.before, e) + Hs(n.after, e), r = a.total + o.total;
		Rs(d, e, a, t * (a.total + u) / r), Rs(d, e, o, t * (o.total - u) / r);
	} else f || zs(d, a, a.total + u), p || zs(d, o, o.total - u);
	return i.passFloors && (Fs(d, a, a.total + u), Fs(d, o, o.total - u)), d;
}
function Fs(e, t, n) {
	if (!(n >= t.min - .5)) for (let n of t.indices) {
		let { min: t, ...r } = e[n];
		e[n] = r;
	}
}
function Is(e, t, n, r, i, a, o, s) {
	let c = e, l = n + c, u = r - c;
	return l > 0 && l < o ? c = t < 0 ? -n : o - n : u > 0 && u < s && (c = t > 0 ? r : r - s), Math.min(Math.max(c, i), a);
}
function Ls(e, t, n) {
	let r = Vs(n, t), i = n.map((e) => r > 0 ? t[e] / r : 1 / n.length), a = 0, o = Infinity;
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
function Rs(e, t, n, r) {
	let i = Hs(n.indices, t);
	for (let a = 0; a < n.indices.length; a++) {
		let o = n.indices[a], s = i > 0 && n.total > 0 ? n.shares[a] : 1 / n.indices.length;
		e[o] = {
			...t[o],
			value: r * s
		};
	}
}
function zs(e, t, n) {
	for (let r = 0; r < t.indices.length; r++) {
		let i = t.indices[r];
		e[i] = {
			kind: "px",
			value: n * t.shares[r],
			...Bs(e[i])
		};
	}
}
function Bs(e) {
	return {
		...e.min === void 0 ? {} : { min: e.min },
		...e.max === void 0 ? {} : { max: e.max }
	};
}
function Vs(e, t) {
	let n = 0;
	for (let r of e) n += t[r];
	return n;
}
function Hs(e, t) {
	let n = 0;
	for (let r of e) n += t[r].value;
	return n;
}
function Us(e, t) {
	return Math.round(Ws(e, t) * 100);
}
function Ws(e, t) {
	let n = Vs(t.before, e), r = n + Vs(t.after, e);
	return r <= 0 ? 0 : n / r;
}
function Gs(e, t, n) {
	let r = Vs(t.before, e);
	return (r + Vs(t.after, e)) * Math.min(Math.max(n, 0), 1) - r;
}
function Ks(e) {
	let t = e === null || e.length === 0 ? NaN : Number(e);
	return t >= 0 && t <= 1 ? t : null;
}
function qs(e, t) {
	let n = [];
	for (let r = 0, i = 0; r < t; r++) n.push(i), i += Number.isFinite(e[r]) ? e[r] : 0;
	return n;
}
var Js = /* @__PURE__ */ new Set();
function Ys(e, t, n, r) {
	let i = Ls(e, t, n.before), a = Ls(e, t, n.after);
	return i.total >= 1 && i.total < r ? -i.total : a.total >= 1 && a.total < r ? a.total : i.total >= 1 && i.total < i.min - .5 ? i.min - i.total : a.total >= 1 && a.total < a.min - .5 ? a.total - a.min : 0;
}
function Xs(e, t, n, r) {
	let i = /* @__PURE__ */ new Set();
	for (let a of [n.before, n.after]) {
		let n = Ls(e, t, a);
		n.total < Math.max(r, n.min - .5) && a.forEach((e) => i.add(e));
	}
	return i;
}
function Zs(e, t) {
	return e.map((e, n) => t.has(n) ? {
		kind: "px",
		value: 0
	} : e);
}
function Qs(e, t, n, r = Js) {
	let i = Number(e);
	if (!Number.isInteger(i) || i < 1) return !1;
	let a = /^span\s+(\d+)$/.exec(t.trim()), o = Number(t), s = a === null ? Number.isInteger(o) && o > i ? o : i + 1 : i + Number(a[1]);
	return s - 1 <= n.length && n.slice(i - 1, s - 1).every((e, t) => e < 1 || r.has(i - 1 + t));
}
//#endregion
//#region src/extensions/value-readers.ts
function $s(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" ? String(e) : JSON.stringify(e);
}
function ec(e) {
	return e == null;
}
var tc = "data-ui-trim-input", nc = class {
	readers = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let e of oc) this.register(e);
		for (let t of e ?? []) this.register(t);
	}
	register(e) {
		this.readers.set(e.kind, e.read);
	}
	read(e) {
		let t = e.getAttribute(Ot);
		if (t === null) return rc(e);
		let n = this.readers.get(t);
		return n === void 0 ? (s("value reader: no reader registered for this kind.", { kind: t }), null) : n(e);
	}
	readBound(e) {
		let t = this.read(e);
		return typeof t == "string" && e.hasAttribute(tc) ? t.trim() : t;
	}
	readHeld(e) {
		let t = ac(e);
		return t === null ? null : this.read(t);
	}
};
function rc(e) {
	if (e instanceof HTMLInputElement) switch (e.type) {
		case "checkbox": return e.checked;
		case "number":
		case "range": return e.value.trim().length === 0 ? null : Number(e.value);
		default: return e.value;
	}
	return e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement ? e.value : e instanceof HTMLDetailsElement ? e.open : null;
}
var ic = "input, textarea, select";
function ac(e) {
	return e.hasAttribute("data-ui-value-kind") || e.matches(ic) ? e : e.querySelector("[data-ui-value-holder]") ?? e.querySelector(`[data-ui-value-kind], ${ic}`);
}
var oc = [
	{
		kind: "flyout-open",
		read: (e) => e.classList.contains("ui-flyout--open")
	},
	{
		kind: "splitter-position",
		read: (e) => Ks(e.getAttribute(Fn))
	},
	{
		kind: "pane-layout",
		read: (e) => e.getAttribute(In)
	},
	{
		kind: "tabs-selected",
		read: (e) => e.getAttribute(qr)
	},
	{
		kind: "tab-caption",
		read: (e) => e.getAttribute(Jr)
	},
	{
		kind: "tab-pinned",
		read: (e) => e.hasAttribute(Yr)
	},
	{
		kind: "tree-title",
		read: (e) => e.getAttribute(cr)
	},
	{
		kind: "tree-drop-target",
		read: (e) => e.getAttribute("data-ui-tree-drop-target") ?? ""
	},
	{
		kind: "selected-key",
		read: (e) => e.getAttribute(Wr)
	},
	{
		kind: "selected-keys",
		read: (e) => sc(e, Gr)
	},
	{
		kind: kt,
		read: (e) => sc(e, st)
	},
	{
		kind: At,
		read: (e) => e.getAttribute(ct)
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
function sc(e, t) {
	let n = e.getAttribute(t);
	return n === null ? null : JSON.parse(n);
}
function cc(e) {
	if (e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio")) {
		e.checked = !1;
		return;
	}
	(e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement) && (e.value = "");
}
//#endregion
//#region src/interactions/keyboard-shortcut.ts
function lc(e) {
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
		default: o = Sc(e);
	}
	return o === null ? null : {
		code: o,
		ctrl: n,
		shift: r,
		alt: i,
		meta: a
	};
}
function uc(e, t, n = gc()) {
	return t.code !== e.code || t.shiftKey !== e.shift || t.altKey !== e.alt ? !1 : e.ctrl && !e.meta && n ? t.ctrlKey !== t.metaKey : t.ctrlKey === e.ctrl && t.metaKey === e.meta;
}
function dc(e, t = gc()) {
	let n = fc(e.code, t);
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
function fc(e, t) {
	return /^Key[A-Z]$/.test(e) ? e.slice(3) : /^Digit[0-9]$/.test(e) ? e.slice(5) : (t ? mc[e] : void 0) ?? pc[e] ?? e;
}
var pc = {
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
}, mc = {
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
}, hc = null;
function gc() {
	return hc === null && (hc = _c()), hc;
}
function _c() {
	if (typeof navigator > "u") return !1;
	let e = navigator.userAgentData?.platform;
	return /mac/i.test(e ?? navigator.platform ?? "");
}
var vc = {
	words(e) {
		let t = lc(e);
		return t === null ? null : dc(t);
	},
	matches(e, t) {
		let n = lc(t);
		return n !== null && uc(n, e);
	},
	isComposing: A
}, yc = 229;
function A(e) {
	return e.isComposing || e.keyCode === yc;
}
function j(e, t = {}) {
	return !e.ctrlKey && !e.metaKey && (t.alt === !0 || !e.altKey) && (t.shift === !0 || !e.shiftKey) && !A(e);
}
var bc = class {
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
function xc(e) {
	return [
		e.ctrl ? "ctrl" : "",
		e.shift ? "shift" : "",
		e.alt ? "alt" : "",
		e.meta ? "meta" : "",
		e.code
	].filter((e) => e.length > 0).join("+");
}
function Sc(e) {
	if (e.length === 1) {
		let t = e.toUpperCase();
		return t >= "A" && t <= "Z" ? `Key${t}` : t >= "0" && t <= "9" ? `Digit${t}` : Cc[t] ?? null;
	}
	let t = e.length === 0 ? "" : e[0].toUpperCase() + e.slice(1).toLowerCase();
	return /^F([1-9]|1[0-9]|2[0-4])$/.test(t.toUpperCase()) ? t.toUpperCase() : Cc[t] ?? null;
}
var Cc = {
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
}, wc = "data-ui-rename-field";
function Tc(e) {
	return e instanceof Element && e.closest(`[${wc}]`) !== null;
}
function Ec(e) {
	let { container: t, title: n } = e;
	if (t.querySelector(`.${e.className}`) !== null) return !1;
	let r = document.createElement("input");
	r.type = "text", r.className = e.className, r.setAttribute(wc, ""), r.setAttribute(Ye, ""), r.value = e.value, Dc(r, n, t);
	let i = !1, a = (t, a) => {
		if (i) return;
		i = !0;
		let o = r.value.trim();
		r.remove(), n.style.visibility = "", t && (o.length > 0 || e.allowEmpty === !0) && o !== e.value && e.commit(o), e.done?.(), a && e.refocus?.();
	};
	return r.addEventListener("keydown", (e) => {
		if (!A(e)) {
			if (e.key === "Enter") a(!0, !0);
			else if (e.key === "Escape") a(!1, !0);
			else return;
			e.preventDefault(), e.stopPropagation();
		}
	}), r.addEventListener("blur", () => a(!0, !1)), n.style.visibility = "hidden", t.appendChild(r), r.focus(), r.setSelectionRange(0, r.value.length, "backward"), r.scrollLeft = 0, !0;
}
function Dc(e, t, n) {
	let r = t.getBoundingClientRect(), i = n.getBoundingClientRect(), a = getComputedStyle(t), o = Oc(n), s = o > 0 && i.width > 0 ? i.width / o : 1;
	e.style.left = kc((r.left - i.left) / s - n.clientLeft), e.style.top = kc((r.top - i.top) / s - n.clientTop), e.style.width = kc(r.width / s), e.style.height = kc(r.height / s), e.style.fontFamily = a.fontFamily, e.style.fontSize = a.fontSize, e.style.fontWeight = a.fontWeight, e.style.fontStyle = a.fontStyle, e.style.lineHeight = a.lineHeight, e.style.letterSpacing = a.letterSpacing, e.style.textAlign = a.textAlign;
}
function Oc(e) {
	let t = getComputedStyle(e), n = parseFloat(t.width);
	return Number.isFinite(n) ? t.boxSizing === "border-box" ? n : n + parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth) : e.offsetWidth;
}
function kc(e) {
	return `${Math.round(e * 64) / 64}px`;
}
//#endregion
//#region src/interactions/field-escape.ts
var Ac = "data-ui-runs-on-escape", jc = "ui-key-value-action__row", Mc = "ui-key-value-action__value-input", Nc = "ui-key-value-action__edit-action";
function Pc(e) {
	return A(e) || Fc(e.target) !== null;
}
function Fc(e) {
	return e instanceof Element ? Tc(e) || Ic(e) ? e : e.closest("[data-ui-owns-keys]") ?? Lc(e)?.cell ?? null : null;
}
function Ic(e) {
	return e instanceof Element && e.hasAttribute(Ac) && (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && !e.readOnly && !D(e);
}
function Lc(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${Mc}, .${Nc}`), n = t?.closest(".ui-key-value-action__row") ?? null;
	return t === null || n === null || !n.hasAttribute("data-ui-row-editing") ? null : {
		cell: t,
		row: n
	};
}
//#endregion
//#region src/interactions/caret-fields.ts
var Rc = /* @__PURE__ */ new Set([
	"text",
	"search",
	"number",
	"password",
	"email",
	"url",
	"tel"
]), zc = /* @__PURE__ */ new Set([
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
]), Bc = /* @__PURE__ */ new Set([
	"KeyA",
	"KeyC",
	"KeyV",
	"KeyX",
	"KeyZ",
	"KeyY",
	"Insert"
]), Vc = /^F\d{1,2}$/;
function Hc(e) {
	return e instanceof HTMLInputElement && Rc.has(e.type);
}
function Uc(e) {
	return Hc(e) || e instanceof HTMLTextAreaElement;
}
function Wc(e) {
	return Uc(e) || e instanceof HTMLElement && e.isContentEditable;
}
function Gc(e) {
	let t = e.target;
	if (!Wc(t)) return !1;
	if (A(e)) return !0;
	let n = e.key;
	return n === "Tab" || n === "Escape" || Vc.test(n) || e.altKey ? !1 : n === "Enter" ? !Hc(t) : e.ctrlKey || e.metaKey ? zc.has(n) || Bc.has(e.code) : !0;
}
var Kc = {
	...vc,
	isFieldKey: Gc,
	isPlainKey: j,
	isEscapeClaimed: Pc
}, qc = "ui-draft-dropped";
function Jc(e) {
	e.dispatchEvent(new Event(qc, { bubbles: !0 }));
}
//#endregion
//#region src/interactions/own-control.ts
var Yc = `.ui-text-input__row, .ui-number-input__row, .ui-temporal-input__row, .ui-file-input__row, .ui-color-input__row, .${li}, .ui-field-box`, Xc = "button, a, input, select, textarea, label, summary, [role='button'], [contenteditable=''], [contenteditable='true']", Zc = `${Xc}, ${Yc}, ${ci}, .${_e}`, Qc = "button, a, summary, [role='button']";
function $c(e) {
	let t = [];
	for (let n of e.querySelectorAll(Zc)) if (!(n.classList.contains("ui-row__grip") || !nl(e, n) || tl(e, n) || t.some((e) => e.contains(n))) && (t.push(n), t.length > 1)) return null;
	let n = t[0];
	return n instanceof HTMLElement && n.matches(Qc) ? n : null;
}
function el(e) {
	let t = [];
	for (let n of e.querySelectorAll(Xc)) tl(e, n) && nl(e, n) && t.push(n);
	return t;
}
function tl(e, t) {
	let n = t.closest(`[${de}]`);
	return n !== null && n !== e && e.contains(n);
}
function nl(e, t) {
	let n = t.closest(ci);
	return (n === null || !e.contains(n)) && t.closest(".ui-action-bar") === null;
}
function rl(e, t) {
	if (!(e instanceof Element)) return null;
	let n = e.closest(Zc);
	return n !== null && n !== t && t.contains(n) ? n : null;
}
//#endregion
//#region src/interactions/roving-focus.ts
function il(e) {
	let t = cl(e.key), n = ll(e.key, e.axis);
	if (t === null && n === 0) return null;
	let r = e.items.filter(N);
	if (r.length === 0) return null;
	if (t !== null) return t === "first" ? r[0] : r[r.length - 1];
	let i = e.current === null ? -1 : r.indexOf(e.current);
	if (i === -1) return n > 0 ? r[0] : r[r.length - 1];
	let a = i + n;
	return a >= 0 && a < r.length ? r[a] : e.loop ?? !0 ? r[(a + r.length) % r.length] : null;
}
function al(e, t) {
	return cl(e) !== null || ll(e, t) !== 0;
}
var ol = {
	target: il,
	applyTabIndex: M
};
function M(e, t) {
	for (let n of e) n.tabIndex = n === t ? 0 : -1;
}
function sl(e, t) {
	t !== null && (M(e, t), t.focus());
}
function N(e) {
	return e.getClientRects().length > 0 && !D(e);
}
function cl(e) {
	return e === "Home" ? "first" : e === "End" ? "last" : null;
}
function ll(e, t) {
	return t !== "horizontal" && (e === "ArrowDown" || e === "ArrowUp") ? e === "ArrowDown" ? 1 : -1 : t !== "vertical" && (e === "ArrowRight" || e === "ArrowLeft") ? e === "ArrowRight" ? 1 : -1 : 0;
}
//#endregion
//#region src/items/items-viewport.ts
function ul(e) {
	return e.hasAttribute("data-ui-host-viewport") ? e.parentElement ?? e : e;
}
function dl(e) {
	return e instanceof Element ? e.hasAttribute("data-ui-items-host") ? e : e.querySelector(`:scope > [${b}][${Mt}]`) : null;
}
function fl(e) {
	let t = ul(e);
	return t === e ? {
		top: e.scrollTop,
		height: e.clientHeight,
		contentHeight: e.scrollHeight
	} : {
		top: t.scrollTop - ml(e, t),
		height: t.clientHeight,
		contentHeight: e.scrollHeight
	};
}
function pl(e, t) {
	let n = ul(e);
	n.scrollTop = n === e ? t : t + ml(e, n);
}
function ml(e, t) {
	return e.getBoundingClientRect().top - t.getBoundingClientRect().top - t.clientTop + t.scrollTop;
}
function hl(e) {
	let t = e.getBoundingClientRect();
	return t.height > 0 || e.firstElementChild === null ? t : e.firstElementChild.getBoundingClientRect();
}
//#endregion
//#region src/interactions/multi-select-keys.ts
function gl(e) {
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
function _l(e) {
	if (e === null) return null;
	let t = Number(e);
	return Number.isInteger(t) && t > 0 ? t : null;
}
function vl(e, t) {
	return t !== null && e.length >= t;
}
function yl(e, t, n) {
	return e.includes(t) ? e.filter((e) => e !== t) : vl(e, n) ? null : [...e, t];
}
function bl(e, t) {
	return e.includes(t) ? e.filter((e) => e !== t) : null;
}
var xl = /[,\uFF0C\r\n]/;
function Sl(e) {
	return xl.test(e);
}
function Cl(e) {
	return e.split(xl).map((e) => e.trim()).filter((e) => e.length > 0);
}
function wl(e) {
	let t = e.split(xl), n = t.pop() ?? "";
	return {
		tags: t.map((e) => e.trim()).filter((e) => e.length > 0),
		rest: n
	};
}
function Tl(e, t, n, r, i) {
	let a = [...e], o = [], s = null;
	for (let e of t) {
		if (a.includes(e.key)) continue;
		let t = [...a, e.key], c = vl(a, n) ? r : i(a, t);
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
function El(e, t, n) {
	let r = [];
	for (let i of e.querySelectorAll(t)) i.closest(n) === e && r.push(i);
	return r;
}
function Dl(e) {
	return El(e, Dn, `.${bn}`);
}
//#endregion
//#region src/interactions/selected-key.ts
function Ol(e, t, n) {
	t.length !== 0 && e.getAttribute(n.attribute) !== t && (e.setAttribute(n.attribute, t), n.apply(e), e.hasAttribute(n.bindingAttribute) && e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function kl(e, t, n) {
	return e.length === 0 ? null : e.some((e) => n(e) === t) ? t : n(e[0]);
}
//#endregion
//#region src/interactions/row-selection.ts
var Al = "data-ui-bind-selected-keys", P = `.ui-items-view, .ui-table, .${Kn}`, jl = `.ui-items-view__item, .${Hn}, .${qn}`, Ml = ".ui-items-view, .ui-table", Nl = {
	shift: !1,
	ctrl: !1
}, Pl = /* @__PURE__ */ new WeakMap();
function Fl(e, t) {
	t !== null && !Pl.has(e) && Il(e, t);
}
function Il(e, t) {
	let n = I(t);
	n.length > 0 && Pl.set(e, n);
}
function Ll(e) {
	return {
		shift: e.shiftKey,
		ctrl: e.ctrlKey || e.metaKey
	};
}
function Rl(e, t) {
	let n = Ll(t);
	return n.shift && e.hasAttribute("data-ui-no-row-select") ? {
		shift: !0,
		ctrl: !0
	} : n;
}
function zl(e) {
	return !e.hasAttribute(rr);
}
function F(e) {
	if (e.getClientRects().length > 0) return e;
	let t = e.querySelector(`:scope > [${re}]`);
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function Bl(e) {
	switch (e.getAttribute(Hr)) {
		case "one": {
			let t = e.getAttribute(Wr);
			return new Set(t === null || t.length === 0 ? [] : [t]);
		}
		case "many": return new Set(Yl(Xl(e)));
		default: return /* @__PURE__ */ new Set();
	}
}
function Vl(e, t) {
	let n = Bl(e), r = e.getAttribute(Hr), i = r === "one" || r === "many";
	for (let e of t) {
		let t = n.has(I(e));
		e.toggleAttribute(Ur, t), i ? e.setAttribute("aria-selected", t ? "true" : "false") : e.removeAttribute("aria-selected");
	}
}
function Hl(e) {
	return e.filter((e) => e.hasAttribute(Ur));
}
function Ul(e, t, n, r, i) {
	let a = I(n);
	if (!Kl(n)) return !1;
	switch (e.getAttribute(Hr)) {
		case "one": return Ol(e, a, {
			attribute: Wr,
			bindingAttribute: Kr,
			apply: (e) => Vl(e, t)
		}), !0;
		case "many": return Wl(e, t, n, a, r, i), !0;
		default: return !1;
	}
}
function Wl(e, t, n, r, i, a) {
	let o = Xl(e);
	if (o === null) return;
	let s = Yl(o), c;
	if (i.shift) {
		let o = Pl.get(e), l = o === void 0 ? null : a?.(o, r) ?? null, u = t.find((e) => I(e) === o) ?? n, d = l === null ? Jl(t, u, n).map(I) : ql(l, t);
		c = i.ctrl ? [...s.filter((e) => !d.includes(e)), ...d] : d;
	} else i.ctrl ? (c = s.includes(r) ? s.filter((e) => e !== r) : [...s, r], Pl.set(e, r)) : (c = [r], Pl.set(e, r));
	Gl(e, t, c);
}
function Gl(e, t, n) {
	let r = Xl(e);
	if (r === null) return;
	let i = JSON.stringify(n);
	r.getAttribute("data-ui-selected-keys") !== i && (r.setAttribute(Gr, i), Vl(e, t), r.hasAttribute(Al) && r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function Kl(e) {
	return I(e).length > 0 && !gs(e, "data-ui-unselectable") && !O(e);
}
function ql(e, t) {
	let n = new Map(t.map((e) => [I(e), e]));
	return e.filter((e) => {
		let t = n.get(e);
		return t === void 0 || F(t) !== null && Kl(t);
	});
}
function Jl(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	return r < 0 || i < 0 ? [n] : e.slice(Math.min(r, i), Math.max(r, i) + 1).filter((e) => F(e) !== null && Kl(e));
}
function Yl(e) {
	return gl(e?.getAttribute("data-ui-selected-keys") ?? null);
}
function Xl(e) {
	let t = e.closest(S);
	for (let n of e.querySelectorAll(`[${b}]`)) if (n.closest(P) === e && n.closest(S) === t) return n;
	return null;
}
function I(e) {
	return e.getAttribute("data-ui-key") ?? "";
}
var Zl = {
	isSelected: (e) => e.hasAttribute(Ur),
	toggle: Ql,
	setSelected: $l,
	setSelectedKeys: eu
};
function Ql(e) {
	let t = e.closest(P);
	t !== null && e instanceof HTMLElement && Ul(t, tu(t), e, {
		shift: !1,
		ctrl: !0
	});
}
function $l(e, t, n) {
	let r = [];
	for (let e of t) e.classList.contains("ui-hidden") || r.push(I(e));
	eu(e, r, n);
}
function eu(e, t, n) {
	if (!(e instanceof HTMLElement)) return;
	let r = tu(e), i = new Set(r.filter((e) => !Kl(e)).map(I)), a = /* @__PURE__ */ new Set();
	for (let e of t) e.length > 0 && !i.has(e) && a.add(e);
	let o = [...Bl(e)].filter((e) => !a.has(e));
	Gl(e, r, n ? [...o, ...a] : o);
}
function tu(e) {
	return El(e, jl, P);
}
//#endregion
//#region src/interactions/table-column-layout.ts
var nu = "--ui-table-order-";
function ru(e) {
	let t = new Set((e.getAttribute("data-ui-table-hidden") ?? "").split(" ").filter((e) => e.length > 0)), n = e instanceof HTMLElement ? e.style : null;
	return {
		place: (e) => {
			let t = n?.getPropertyValue(`--ui-table-order-${e}`).trim() ?? "";
			return t.length === 0 ? e : Number(t);
		},
		isHidden: (e) => t.has(String(e))
	};
}
var iu = "ui-table", au = `[${Rn}]:not(.${Gn})`, ou = `.${Hn} > [aria-colspan]:not([${Rn}])`;
function su(e, t, n, r) {
	let i = /* @__PURE__ */ new Map();
	for (let e of t) n.has(e) || i.set(e, String(i.size + 1));
	let a = String(i.size), o = r ? ":not([aria-colindex])" : "";
	cu(e, "aria-colcount", a);
	for (let t of e.querySelectorAll(`${au}${o}, ${ou}${o}`)) {
		if (t.closest(`.${iu}`) !== e) continue;
		if (!t.hasAttribute("data-ui-table-column")) {
			cu(t, "aria-colindex", "1"), cu(t, "aria-colspan", a);
			continue;
		}
		let n = i.get(Number(t.getAttribute(Rn)));
		n === void 0 ? t.removeAttribute("aria-colindex") : cu(t, "aria-colindex", n);
	}
}
function cu(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/interactions/row-cursor.ts
var lu = ".ui-table[role='grid']", uu = "gridcell", du = "aria-colspan", fu = /* @__PURE__ */ new WeakMap();
function pu(e) {
	let t = e.closest(P);
	if (t === null) return null;
	if (e === t) return {
		root: t,
		row: null
	};
	let n = e.closest(jl);
	return n !== null && n.closest(P) === t ? {
		root: t,
		row: n
	} : null;
}
function mu(e) {
	return e.target instanceof Element && !Gc(e) ? hu(e.target) : null;
}
function hu(e) {
	let t = pu(e);
	if (t === null || t.row !== null && rl(e, t.row) !== null) return null;
	let n = e.closest(`[${si}]`);
	return n !== null && n !== t.root && t.root.contains(n) ? null : t;
}
function gu(e) {
	return e.filter((e) => F(e) !== null && !O(e));
}
function _u(e) {
	return vu(e) ?? gu(e)[0] ?? null;
}
function vu(e) {
	return e.find((e) => e.hasAttribute("data-ui-row-focus")) ?? e.find((e) => e.hasAttribute("data-ui-selected") && !O(e)) ?? null;
}
function yu(e) {
	return vu(tu(e));
}
function bu(e, t) {
	if (e.hasAttribute("data-ui-row-cursor-waits") || t.some((e) => e.hasAttribute("data-ui-row-focus"))) return;
	let n = _u(t);
	n !== null && Su(e, t, n);
}
function xu(e, t) {
	t === null ? e.removeAttribute("aria-labelledby") : e.setAttribute("aria-labelledby", Di(t, "ui-row-name"));
}
function Su(e, t, n, r = null, i = !0) {
	for (let e of t) e !== n && e.hasAttribute("data-ui-row-focus") && e.removeAttribute(je);
	n.hasAttribute("data-ui-row-focus") || n.setAttribute(je, ""), e.removeAttribute(Me);
	let a = Cu(e, n, r);
	i && ((F(n) ?? n).scrollIntoView({ block: "nearest" }), a !== null && ku(e, n, a));
}
function Cu(e, t, n) {
	let r = wu(e) ? Tu(e, t, n) : null;
	for (let t of e.querySelectorAll(`[${Pe}]`)) t !== r && t.closest(P) === e && t.removeAttribute(Pe);
	if (r === null) return e.setAttribute("aria-activedescendant", Di(t, "ui-row")), null;
	r.hasAttribute("data-ui-cell-focus") || r.setAttribute(Pe, "");
	let i = r.getAttribute(Rn);
	return i !== null && fu.set(e, i), e.setAttribute("aria-activedescendant", Di(r, "ui-cell")), r;
}
function wu(e) {
	return e.matches(lu);
}
function Tu(e, t, n) {
	if (n instanceof HTMLElement && n.parentElement === t && n.getAttribute("role") === uu) {
		if (!n.hasAttribute("data-ui-owns-keys")) return n;
		let e = Eu(t, n.getAttribute(Rn));
		if (e !== null) return e;
	}
	let r = Du(e, t), i = fu.get(e);
	if (i === void 0) return r[0] ?? null;
	let a = r.find((e) => e.getAttribute(Rn) === i);
	if (a !== void 0) return a;
	let o = ru(e), s = o.place(Number(i)), c = (e) => Math.abs(o.place(Number(e.getAttribute(Rn))) - s);
	return r.reduce((e, t) => e === null || c(t) < c(e) ? t : e, null);
}
function Eu(e, t) {
	for (let n of e.children) if (t !== null && n instanceof HTMLElement && n.getAttribute("data-ui-table-column") === t && Ou(n)) return n;
	return null;
}
function Du(e, t) {
	let n = ru(e), r = [];
	for (let e of t.children) {
		let t = Number(e.getAttribute("data-ui-table-column") ?? NaN);
		e instanceof HTMLElement && Number.isInteger(t) && Ou(e) && !n.isHidden(t) && r.push({
			cell: e,
			place: n.place(t)
		});
	}
	return r.sort((e, t) => e.place - t.place).map((e) => e.cell);
}
function Ou(e) {
	return e.getAttribute("role") === uu && !e.hasAttribute("data-ui-owns-keys");
}
function ku(e, t, n) {
	let r = e.querySelector(`:scope > .${Un}`);
	if (r === null || !(r.scrollWidth > r.clientWidth) || !n.hasAttribute("data-ui-table-column")) return;
	let i = r.getBoundingClientRect(), a = i.left + i.width / 2, o = i.left + r.clientLeft, s = o + r.clientWidth;
	for (let e of t.children) {
		if (e === n || !(e instanceof HTMLElement) || getComputedStyle(e).position !== "sticky") continue;
		let t = e.getBoundingClientRect();
		t.left + t.width / 2 < a ? o = Math.max(o, t.right) : s = Math.min(s, t.left);
	}
	let c = n.getBoundingClientRect();
	r.scrollLeft += Au(c.left, c.right, o, s);
}
function Au(e, t, n, r) {
	return e < n ? e - n : t > r ? Math.min(t - r, e - n) : 0;
}
function ju(e) {
	for (let t of e.children) if (t instanceof HTMLElement && t.hasAttribute("data-ui-cell-focus")) return t;
	return null;
}
function Mu(e) {
	return fu.get(e) ?? null;
}
function Nu(e, t, n, r) {
	if (n !== null && Iu(n)) return null;
	let i = Du(e, t), a = n?.getAttribute("data-ui-table-column") ?? null, o = i.findIndex((e) => e.getAttribute(Rn) === a);
	switch (r) {
		case "Home": return i[0] ?? null;
		case "End": return i[i.length - 1] ?? null;
		case "ArrowLeft": return o > 0 ? i[o - 1] : null;
		case "ArrowRight": return o < 0 ? i[0] ?? null : i[o + 1] ?? null;
		default: return null;
	}
}
function Pu(e, t, n, r) {
	let i = Fu(t), a = (n === null ? -1 : i.indexOf(n)) + (r ? 1 : -1);
	return i.length === 0 || a < -1 || a >= i.length ? null : a === -1 ? Tu(e, t, null) : i[a];
}
function Fu(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && Iu(e));
}
function Iu(e) {
	return Ou(e) && e.hasAttribute(du) && !e.hasAttribute("data-ui-table-column");
}
function Lu(e) {
	let t = Fu(e);
	return t[t.length - 1] ?? null;
}
function Ru(e, t) {
	let n = t;
	for (; n !== null && n.parentElement !== e;) n = n.parentElement;
	return n?.getAttribute("role") === uu ? n : null;
}
function zu(e, t = null) {
	let n = e.closest(P);
	n !== null && e instanceof HTMLElement && Su(n, tu(n), e, t);
}
function Bu(e, t) {
	let n = new CustomEvent(Fe, {
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
function Vu(e, t) {
	return al(e, t === "grid" ? "both" : t) || t !== "horizontal" && Hu(e);
}
function Hu(e) {
	return e === "PageDown" || e === "PageUp";
}
function Uu(e, t, n, r) {
	if (!Vu(e, r)) return null;
	let i = gu(t);
	if (Hu(e)) return Wu(i, n, e === "PageDown");
	if (r === "grid" && (e === "ArrowUp" || e === "ArrowDown")) return Gu(i, n, e === "ArrowDown");
	let a = i.map((e) => F(e) ?? e), o = il({
		key: e,
		items: a,
		current: n === null ? null : F(n),
		axis: r === "grid" ? "horizontal" : r,
		loop: !1
	});
	return o === null ? null : i[a.indexOf(o)] ?? null;
}
function Wu(e, t, n) {
	let r = t === null ? -1 : e.indexOf(t), i = r < 0 ? null : e[r].parentElement;
	if (i === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let a = (F(e[r]) ?? e[r]).getBoundingClientRect(), o = Math.min(fl(i).height, window.innerHeight), s = n ? 1 : -1, c = null;
	for (let t = r + s; t >= 0 && t < e.length; t += s) {
		let r = (F(e[t]) ?? e[t]).getBoundingClientRect();
		if (c !== null && (n ? r.bottom > a.top + o + .5 : r.top < a.bottom - o - .5)) break;
		c = e[t];
	}
	return c;
}
function Gu(e, t, n) {
	let r = t === null ? null : F(t);
	if (r === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let i = r.getBoundingClientRect(), a = Ku(i), o = e.map((e) => ({
		row: e,
		rect: (F(e) ?? e).getBoundingClientRect()
	})).filter(({ rect: e }) => n ? e.top >= i.bottom - .5 : e.bottom <= i.top + .5);
	if (o.length === 0) return null;
	let s = o.reduce((e, t) => (n ? t.rect.top < e.rect.top : t.rect.bottom > e.rect.bottom) ? t : e);
	return o.filter(({ rect: e }) => n ? e.top < s.rect.bottom - .5 : e.bottom > s.rect.top + .5).reduce((e, t) => Math.abs(Ku(t.rect) - a) < Math.abs(Ku(e.rect) - a) ? t : e).row;
}
function Ku(e) {
	return e.left + e.width / 2;
}
var qu = "ui-row-press";
function Ju(e, t, n) {
	(e.hasAttribute("data-ui-id") ? e : e.querySelector(":scope > [data-ui-id]") ?? e).dispatchEvent(n === void 0 ? new Event(t, { bubbles: !0 }) : new CustomEvent(t, {
		bubbles: !0,
		detail: n
	}));
}
function Yu(e, t, n) {
	let r = n.hasAttribute(je), i = n.contains(document.activeElement);
	if (!r && !i) return null;
	let a = t.indexOf(n), o = t.filter((e) => e !== n);
	return () => {
		if (i && e.focus({ preventScroll: !0 }), !r) return;
		let n = Xu(t, o, a);
		n !== null && Su(e, o, n);
	};
}
function Xu(e, t, n) {
	let r = gu(t);
	return n < 0 || r.length === 0 ? null : r.find((t) => e.indexOf(t) > n) ?? r[r.length - 1];
}
function Zu(e, t) {
	let n = t.find((e) => e.hasAttribute(je));
	if (n === void 0 || F(n) !== null) return;
	let r = Xu(t, t, t.indexOf(n));
	if (r !== null) {
		Su(e, t, r, null, !1);
		return;
	}
	n.removeAttribute(je), ju(n)?.removeAttribute(Pe), e.removeAttribute("aria-activedescendant");
}
function Qu(e) {
	let t = e.parentElement, n = t?.closest(P) ?? null;
	return n !== null && (n === t || n === t?.parentElement) ? n : t;
}
function $u(e) {
	let t = e.hasAttribute(je), n = e.contains(document.activeElement);
	return t || n ? {
		cursor: t,
		focus: n,
		key: e.getAttribute(y)
	} : null;
}
function ed(e, t, n) {
	let r = Qu(e);
	if (n !== null && r !== null && (n.focus && !r.contains(document.activeElement) && r.focus({ preventScroll: !0 }), n.cursor)) {
		if (t === null) {
			typeof n.key == "string" && r.setAttribute(Me, n.key);
			return;
		}
		[...e.children].some((e) => e !== t && e.hasAttribute("data-ui-row-focus")) || rd(r, t);
	}
}
function td(e, t) {
	let n = Qu(e), r = n?.getAttribute("data-ui-row-cursor-waits") ?? null;
	n !== null && r !== null && r === t.getAttribute("data-ui-key") && (n.removeAttribute(Me), [...e.children].some((e) => e !== t && e.hasAttribute("data-ui-row-focus")) || rd(n, t));
}
function nd(e) {
	return e.getAttribute(Me);
}
function rd(e, t) {
	t.setAttribute(je, ""), Cu(e, t, null);
}
//#endregion
//#region src/interactions/popup-focus.ts
var id = "data-ui-active", ad = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(","), od = /* @__PURE__ */ new Set([
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
]), sd = !1, cd = !1, ld = null, ud = /* @__PURE__ */ new Set(), dd = [], fd = /* @__PURE__ */ new WeakSet();
typeof window < "u" && (window.addEventListener("pointerdown", (e) => pd(e.target, e.pointerType), !0), window.addEventListener("keydown", (e) => md(e), !0), window.addEventListener("focus", (e) => hd(e.target), !0), window.addEventListener("focusin", (e) => hd(e.target), !0), window.addEventListener("focusout", (e) => gd(e), !0));
function pd(e, t = "") {
	sd = !0, cd = t === "touch";
	let n = document.activeElement;
	ld = n, n instanceof Element && n !== document.body && e instanceof Node && n.contains(e) && xd(n, !_d(n)), Sd(n);
}
function md(e) {
	if (!(e instanceof KeyboardEvent && od.has(e.key))) {
		sd = !1;
		for (let e of [...ud]) xd(e, !1);
		Sd(document.activeElement);
	}
}
function hd(e) {
	sd && !_d(e) && xd(e, !0), e === document.activeElement && Sd(document.activeElement);
}
function gd(e) {
	e.target instanceof Element && e.target.hasAttribute(id) || xd(e.target, !1), e.relatedTarget === null && queueMicrotask(() => Sd(document.activeElement));
}
function _d(e) {
	return Uc(e) ? !e.readOnly && !e.disabled : e instanceof HTMLElement && (e.isContentEditable || e.getAttribute("role") === "spinbutton" && e.getAttribute("aria-readonly") !== "true");
}
function vd() {
	return sd && ld instanceof HTMLElement && ld !== document.body ? ld : null;
}
function yd() {
	return sd;
}
function bd() {
	return sd && cd;
}
function xd(e, t) {
	if (e instanceof Element) {
		if (t) {
			for (let e of ud) e.isConnected || ud.delete(e);
			ud.add(e);
		} else ud.delete(e);
		e.hasAttribute("data-ui-pointer-focus") !== t && e.toggleAttribute(Rr, t), e === document.activeElement && Sd(e);
	}
}
function Sd(e) {
	let t = e === null || e === document.body || _d(e) ? null : e.hasAttribute("data-ui-pointer-focus") ? "pointer" : "keyboard", n = e === null || t === null ? [] : Cd(e);
	for (let e of dd) n.includes(e) || e.removeAttribute(zr);
	for (let e of n) t !== null && e.getAttribute("data-ui-focus-within") !== t && e.setAttribute(zr, t);
	dd = n;
}
function Cd(e) {
	let t = [];
	for (let n = e.parentElement; n !== null && n !== document.body && !n.hasAttribute("data-ui-region") && (t.push(n), !(n.hasAttribute("data-ui-id") && !wd(n))); n = n.parentElement);
	return t;
}
function wd(e) {
	return e.classList.contains("ui-menu--nested") || (e.parentElement?.closest(Yc) ?? null) !== null;
}
function L(e) {
	hd(e), Td(e);
}
function Td(e) {
	Sd(e), e.focus({ preventScroll: !0 }), Sd(document.activeElement);
}
function Ed(e) {
	xd(e, !0), Td(e);
}
function Dd(e) {
	for (let t of e.querySelectorAll(ad)) if (_s(t)) return t;
	return null;
}
var Od = {
	first: Dd,
	stops: (e) => kd(e, document.activeElement),
	giveBack: (e) => Ld(e),
	trapTab: Md
};
function kd(e, t) {
	let n = [...e.querySelectorAll(ad)].filter((e) => e === t || e.tabIndex >= 0 && _s(e)), r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let t = Ad(e);
		if (t === null) continue;
		let n = r.get(t);
		(n === void 0 || !jd(n) && jd(e)) && r.set(t, e);
	}
	return n.filter((e) => {
		let t = Ad(e);
		return t === null || r.get(t) === e;
	});
}
function Ad(e) {
	return e instanceof HTMLInputElement && e.type === "radio" && e.name !== "" ? e.name : null;
}
function jd(e) {
	return e instanceof HTMLInputElement && e.checked;
}
function Md(e, t) {
	let n = kd(e, document.activeElement);
	if (n.length === 0) {
		t.preventDefault();
		return;
	}
	let r = Nd(e, n, document.activeElement, t.shiftKey);
	r !== null && (t.preventDefault(), r.focus());
}
function Nd(e, t, n, r) {
	let i = t[0], a = t[t.length - 1];
	return n === null || !e.contains(n) ? r ? a : i : !r && Pd(n, a) ? i : r && Pd(n, i) ? a : null;
}
function Pd(e, t) {
	return e === t || Ad(e) !== null && Ad(e) === Ad(t);
}
var Fd = `.${ri}, .${ii}, [${oi}]`;
function Id(e) {
	let t = pu(e)?.root ?? null;
	for (let n = e.parentElement; n !== null; n = n.parentElement) if ((n === t || n.matches(Fd)) && n.hasAttribute("tabindex") && _s(n)) return n;
	return null;
}
function Ld(e, t = Id(e)) {
	let n = document.activeElement;
	if (t?.isConnected !== !0 || n !== null && n !== document.body) return;
	let r = pu(e);
	r?.root === t && r.row !== null && Su(t, tu(t), r.row, Ru(r.row, e)), L(t);
}
function Rd(e, t) {
	if (e.contains(document.activeElement)) return null;
	let n = document.activeElement instanceof HTMLElement ? document.activeElement : null, r = t ?? Dd(e);
	return zd(e), (r === null || r === e) && !e.hasAttribute("tabindex") && (e.tabIndex = -1), L(r ?? e), n;
}
function zd(e) {
	sd ? fd.add(e) : fd.delete(e);
}
function Bd(e, t) {
	e.scrollTop = 0, e.scrollLeft = 0;
	let n = t ?? Dd(e);
	return n !== null && Vd(e, n), Rd(e, n);
}
function Vd(e, t) {
	let n = e.getBoundingClientRect().top + e.clientTop, r = n + e.clientHeight, i = t.getBoundingClientRect();
	i.bottom > r && (e.scrollTop += Math.min(i.bottom - r, i.top - n));
}
function Hd(e, t, n = !1) {
	if (zd(e), sd) {
		M(t, null), e.hasAttribute("tabindex") || (e.tabIndex = -1), L(e);
		return;
	}
	let r = t.filter(N), i = (n ? r[r.length - 1] : r[0]) ?? null;
	i !== null && (M(t, i), L(i));
}
function Ud(e, t = null) {
	let n = e == null ? null : e.isConnected ? e : Wd(e, t);
	for (let e = n; e !== null; e = e.parentElement) if (e.matches(`${ad}, [tabindex]`) && _s(e)) return e;
	return n === null ? null : Gd(n);
}
function Wd(e, t) {
	if (t === null) return null;
	for (let n = e.closest(S); n !== null; n = n.parentElement?.closest(S) ?? null) {
		let e = t.findEveryComponent(T(n)).filter((e) => e.isConnected);
		if (e.length === 1 && e[0] instanceof HTMLElement) return e[0];
	}
	return null;
}
function Gd(e) {
	for (let t = e.closest(S); t !== null; t = t.parentElement?.closest(S) ?? null) if (_s(t)) return Kd(t), t;
	return null;
}
function Kd(e) {
	if (e.hasAttribute("tabindex") || e.tabIndex >= 0) return;
	e.tabIndex = -1;
	let t = (n) => {
		n.target === e && (e.removeAttribute("tabindex"), e.removeEventListener("focusout", t));
	};
	e.addEventListener("focusout", t);
}
function qd(e, t) {
	let n = document.activeElement;
	e == null || !t.contains(n) || (Jd(n, t) && xd(e, !_d(e)), L(e));
}
function Jd(e, t) {
	for (let n = e; n !== null; n = n === t ? null : n.parentElement ?? null) if (fd.has(n)) return !0;
	return !1;
}
//#endregion
//#region src/updates/value-binding-engine.ts
var Yd = "data-ui-clear", Xd = ["change", "toggle"], Zd = [
	...Xd,
	"expand",
	"collapse",
	"open",
	"close"
];
function Qd(e) {
	let t = Mi(e);
	return t === "TwoWay" || t === "OneWayToSource" || t === "OnSubmit";
}
function $d(e) {
	return Mi(e) === "OnSubmit";
}
function ef(e, t) {
	let n = e.getAttribute(qe);
	if (n !== null) {
		let e = t.getBindingById(Number(n));
		return {
			bindingId: n,
			binding: e,
			buffered: e !== void 0 && $d(e.mode)
		};
	}
	for (let n of e.getAttributeNames()) {
		if (!n.startsWith("data-ui-bind-")) continue;
		let r = e.getAttribute(n) ?? "", i = t.getBindingById(Number(r));
		if (i !== void 0 && Qd(i.mode)) return {
			bindingId: r,
			binding: i,
			buffered: $d(i.mode)
		};
	}
	return null;
}
var tf = class {
	options;
	root;
	pendingSyncByComponent = /* @__PURE__ */ new WeakMap();
	bufferedElements = /* @__PURE__ */ new Set();
	unanswered = /* @__PURE__ */ new Map();
	sends = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document;
		for (let e of Xd) this.root.addEventListener(e, (e) => {
			this.handleValueEventAsync(e).catch((e) => {
				c("value binding engine failed.", e);
			});
		}, !0);
		this.root.addEventListener("input", (e) => this.holdEdited(e), !0), this.root.addEventListener(qc, (e) => this.releaseDropped(e)), this.root.addEventListener("click", (e) => this.handleClear(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && e.target.closest(`[${Yd}]`) !== null && e.preventDefault();
		}, !0);
	}
	holdEdited(e) {
		!(e.target instanceof Element) || this.bufferedElements.has(e.target) || !e.target.hasAttribute("data-ui-form-id") || ef(e.target, this.options.metadata)?.buffered === !0 && this.bufferValue(e.target);
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
		let t = e.target.closest(`[${Yd}]`);
		if (t === null) return;
		let n = t.closest(S), r = n?.querySelector("[data-ui-bind-value]") ?? n?.querySelector("input, textarea, select");
		r == null || nf(r) || (cc(r), r.dispatchEvent(new Event("input", { bubbles: !0 })), r.dispatchEvent(new Event("change", { bubbles: !0 })), Uc(r) && document.activeElement !== r && L(r));
	}
	async handleValueEventAsync(e) {
		if (!(e.target instanceof Element) || e.type === "change" && (k(e.target) || D(e.target))) return;
		let t = ef(e.target, this.options.metadata);
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
			let r = ef(n, this.options.metadata);
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
		if (i === void 0 || !Qd(i.mode) || $d(i.mode)) return;
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
function nf(e) {
	return e.matches(":disabled") || (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.readOnly;
}
//#endregion
//#region src/events/event-boundary.ts
function rf(e, t) {
	let n = e.closest(`[${Ye}]`);
	return n !== null && n !== t && t.contains(n);
}
//#endregion
//#region src/events/command-turns.ts
var af = class {
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
}, of = class {
	catalog;
	registrations = /* @__PURE__ */ new Map();
	attachments = /* @__PURE__ */ new Map();
	constructor(e) {
		this.catalog = e;
	}
	add(e, t = {}) {
		let n = Zi(e);
		if (n.length === 0) throw Error("Event name is required.");
		let r = Zi(t.domEventName) || this.catalog.get(n)?.domEventName || n, i = {
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
		return this.registrations.get(Zi(e));
	}
	isAttached(e) {
		return this.attachments.has(Zi(e));
	}
	attach(e) {
		let t = {};
		return this.attachments.set(Zi(e), t), t;
	}
	isCurrent(e, t) {
		return this.attachments.get(e) === t;
	}
}, sf = class {
	create(e, t) {
		return e.createRequest === void 0 ? t.metadata === void 0 ? null : {
			eventId: w(t.metadata.eventId),
			dynamicParameters: [...t.dynamicParameters]
		} : e.createRequest(t);
	}
}, cf = {
	dispatched: !1,
	success: !1
}, lf = class extends Error {
	reason;
	constructor(e) {
		super(String(e)), this.reason = e;
	}
}, uf = class {
	options;
	root;
	registry;
	requestFactory = new sf();
	turns = new af();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.registry = new of(e.eventCatalog), this.addEvent("click");
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
		if (r === null || ff(t, r.element) || rf(t.target, r.element)) return;
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
			let t = e instanceof lf, r = t ? e.reason : e;
			throw n.completed?.({
				...a,
				dispatched: t,
				success: !1,
				error: String(r)
			}), r;
		}
	}
	async runAsync(e, t, n, r) {
		if (r.domEvent.target instanceof Element && D(r.domEvent.target)) return cf;
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
		if (this.options.dispatcher.isPending(i)) return r.domEvent.preventDefault(), cf;
		let a = this.turns.take();
		try {
			return await this.sendInTurnAsync(e, t, n, r, i, a);
		} finally {
			a.done();
		}
	}
	async sendInTurnAsync(e, t, n, r, i, a) {
		let o = n.getAttribute("data-ui-submit-form-id") ?? (t.submitsForm === !0 ? pf(r) : null);
		if (o !== null) {
			if (this.options.validationEngine?.runSubmitValidation(o) === !1) return r.domEvent.preventDefault(), this.options.validationEngine.focusFirstInvalid(o), cf;
			await this.options.valueBinding?.submitFormAsync(o);
		}
		if (await this.isRefusedValueEventAsync(t, n) || (await a.ahead, await this.options.valueBinding?.whenSent(), this.options.dispatcher.isPending(i))) return cf;
		this.options.interactionEngine.applyEvent({
			name: `before-${e}`,
			componentId: r.componentId,
			dynamicParameters: r.dynamicParameters,
			domEvent: r.domEvent
		});
		let s = this.options.dispatcher.dispatchAsync(i);
		a.done();
		let c = await s.catch((t) => {
			throw this.applyAfterEvent(e, r), new lf(t);
		});
		return this.options.effects.applyAll(c.command?.effects, this.options.dom), this.options.afterEffects?.(), this.applyAfterEvent(e, r), o !== null && this.options.validationEngine?.focusFirstInvalid(o), {
			dispatched: !0,
			success: c.command?.success !== !1,
			error: c.command?.error ?? null
		};
	}
	async isRefusedValueEventAsync(e, t) {
		return !Zd.includes(e.name) && e.settlesValue !== !0 ? !1 : (await this.options.valueBinding?.whenSettled(t), this.options.validationEngine?.isRefused(t) === !0);
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
		return n.hasAttribute(Je(e)) ? !1 : this.options.metadata.hasServerEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(`before-${e}`, t) || this.options.interactionEngine.hasEventForComponent(`after-${e}`, t);
	}
	applyDomPolicy(e, t) {
		df(e.preventDefault, t) && t.domEvent.preventDefault(), df(e.stopPropagation, t) && t.domEvent.stopPropagation();
	}
};
function df(e, t) {
	return e === void 0 ? !1 : typeof e == "function" ? e(t) : e;
}
function ff(e, t) {
	if (e.type !== "mouseenter" && e.type !== "mouseleave") return !1;
	let n = e.relatedTarget;
	return n instanceof Node && t.contains(n);
}
function pf(e) {
	let t = e.domEvent.target;
	return ((t instanceof Element ? t.closest("[data-ui-form-id]") : null) ?? e.component.querySelector("[data-ui-form-id]"))?.getAttribute("data-ui-form-id") ?? null;
}
//#endregion
//#region src/state/value-equality.ts
function mf(e, t) {
	return Object.is(e, t) ? !0 : e === null || t === null || e === void 0 || t === void 0 ? !1 : e instanceof Date || t instanceof Date ? e instanceof Date && t instanceof Date && e.getTime() === t.getTime() : typeof e != "object" || typeof t != "object" ? !1 : Array.isArray(e) || Array.isArray(t) ? Array.isArray(e) && Array.isArray(t) && hf(e, t) : gf(e, t);
}
function hf(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!mf(e[n], t[n])) return !1;
	return !0;
}
function gf(e, t) {
	for (let n in e) if (Object.hasOwn(e, n) && (Object.hasOwn(t, n) ? !mf(e[n], t[n]) : !_f(e[n]))) return !1;
	for (let n in t) if (Object.hasOwn(t, n) && !Object.hasOwn(e, n) && !_f(t[n])) return !1;
	return !0;
}
function _f(e) {
	return e == null;
}
//#endregion
//#region src/interactions/focus-handoff.ts
function vf() {
	let e = document.activeElement;
	return e === null || e === document.body ? null : e;
}
function yf(e) {
	let t = document.activeElement;
	if (!e.isConnected || t !== e && t !== document.body) return null;
	if (bf(e)) return xf(e, () => yf(e)), null;
	let n = e;
	for (; n.parentElement !== null && !bf(n.parentElement);) n = n.parentElement;
	let r = wf(n) ?? Tf(n) ?? Ef();
	return r !== null && L(r), r;
}
function bf(e) {
	return e.checkVisibility({ visibilityProperty: !0 });
}
function xf(e, t) {
	if (typeof document.getAnimations != "function") return;
	let n = document.getAnimations().filter((t) => Sf(t) && Cf(t)?.contains(e) === !0);
	n.length > 0 && Promise.all(n.map((e) => e.finished)).then(t, () => void 0);
}
function Sf(e) {
	return e.transitionProperty === "visibility";
}
function Cf(e) {
	return e.effect?.target ?? null;
}
function wf(e) {
	let t = (e.closest(".ui-key-value-action__value-input, .ui-key-value-action__edit-action")?.closest(".ui-key-value-action__row") ?? null)?.querySelector(".ui-key-value-action__action")?.querySelector(ad) ?? null;
	return t !== null && bf(t) ? t : null;
}
function Tf(e) {
	let t = kd(e.closest(Fd) ?? document, null).filter((t) => !e.contains(t)), n = t.find((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0), r = t.filter((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_PRECEDING) !== 0);
	return n ?? r[r.length - 1] ?? null;
}
function Ef() {
	let e = document.querySelector(`[${vn}="content"]`);
	return e === null ? null : (Kd(e), e);
}
//#endregion
//#region src/interactions/interaction-engine.ts
var Df = class {
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
		for (let e of Xd) i.addEventListener(e, (e) => this.applyEditedValue(e), !0);
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
		let n = this.options.valueReaders.readBound(e.target), r = Af(t.interactions[0].source, t.dynamicParameters);
		if (!(this.heard.has(r) && mf(this.heard.get(r), n))) {
			this.heard.set(r, n);
			for (let e of t.interactions) this.applyInteraction(e, t.dynamicParameters, !0, n);
		}
	}
	resolveEdited(e) {
		let t = this.options.dom.resolveNearestComponent(e, () => !0);
		if (t === null) return null;
		let n = ef(e, this.options.metadata), r;
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
			for (let e of t.interactions) Pi(e.actionKind) === "CopyValue" && jf(e.target) && this.writeTarget(e.target, t.dynamicParameters, Of(e, n), !0);
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
		let t = this.index.getPropertyInteractions(w(e.reference.componentId), e.reference.propertyId), n = t.length > 0 ? Af(e.reference, e.dynamicParameters) : null;
		n !== null && this.heard.has(n) && this.heard.set(n, e.value);
		for (let n of t) this.applyInteraction(n, e.dynamicParameters, !1, e.value);
	}
	applyInteraction(e, t, n, r = !0) {
		let i = Pi(e.actionKind);
		if (i === "Effect") {
			this.applyEffectInteraction(e, t, r);
			return;
		}
		let a = e.target;
		if (!jf(a)) return;
		let o = i === "CopyValue" ? Of(e, r) : this.evaluator.evaluate(e, r);
		this.writeTarget(a, t, o, n), n && this.options.writeBack?.(a, t, o);
	}
	writeTarget(e, t, n, r) {
		let i = vf();
		this.applyDepth++;
		try {
			this.propertyPatchEngine.applyPropertyValue(e, t, n, r);
		} finally {
			this.applyDepth--;
		}
		i !== null && yf(i);
	}
	applyEffectInteraction(e, t, n) {
		let r = e.effect;
		if (r == null) {
			s("effect interaction carries no effect.", e);
			return;
		}
		this.evaluator.matches(e, n) && this.options.effects.apply({
			effect: kf(r, t, this.options.dom),
			dom: this.options.dom,
			row: t
		});
	}
};
function Of(e, t) {
	return (t == null || typeof t == "string" && t.trim().length === 0) && e.falseValue !== void 0 ? e.falseValue : t;
}
function kf(e, t, n) {
	if (t.length === 0) return e;
	let r = e.target;
	if (r === void 0 || (r.dynamicParameters?.length ?? 0) > 0) return e;
	let i = w(r.id);
	for (let a = t.length; a >= 0; a--) {
		let o = t.slice(0, a), s = n.findComponent(i, o);
		if (s !== null && aa(s, o)) return a === 0 ? e : {
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
function Af(e, t) {
	return JSON.stringify([
		w(e?.componentId),
		e?.propertyId ?? "",
		...t.map((e) => String(e ?? ""))
	]);
}
function jf(e) {
	return e != null && e.propertyId.length > 0;
}
//#endregion
//#region src/interactions/interaction-evaluator.ts
var Mf = class {
	evaluate(e, t) {
		return this.matches(e, t) ? e.trueValue : e.falseValue;
	}
	matches(e, t) {
		return Nf(t, e.operator, e.value);
	}
};
function Nf(e, t, n) {
	let r = Pf(e), i = Pf(n);
	switch (Fi(t)) {
		case "Required": return r != null && r !== !1 && String(r).trim().length > 0;
		case "Equal": return String(r ?? "") === String(i ?? "");
		case "NotEqual": return String(r ?? "") !== String(i ?? "");
		case "Greater": return Ff(r, i, (e) => e > 0);
		case "GreaterOrEqual": return Ff(r, i, (e) => e >= 0);
		case "Less": return Ff(r, i, (e) => e < 0);
		case "LessOrEqual": return Ff(r, i, (e) => e <= 0);
		case "Like": return String(r ?? "").includes(String(i ?? ""));
		case "LikeIgnoreCase": return String(r ?? "").toLocaleLowerCase().includes(String(i ?? "").toLocaleLowerCase());
		case "In": return Array.isArray(i) && i.some((e) => String(e ?? "") === String(r ?? ""));
		case "Regex": return Lf(r, i);
		case "RegexEach": return If(r, i);
		default: return !1;
	}
}
function Pf(e) {
	return Eo(e) ? e.key : Do(e) ? e.text : e;
}
function Ff(e, t, n) {
	let r = Number(e), i = Number(t);
	return !Number.isNaN(r) && !Number.isNaN(i) ? n(r < i ? -1 : +(r > i)) : !Number.isNaN(r) || !Number.isNaN(i) || typeof e != "string" || typeof t != "string" ? !1 : n(e < t ? -1 : +(e > t));
}
function If(e, t) {
	return e == null ? !0 : Array.isArray(e) ? e.every((e) => Lf(Pf(e), t)) : Lf(e, t);
}
function Lf(e, t) {
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
var Rf = "Value", zf = "EndValue", Bf = "Pressed", Vf = class {
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
		return this.eventNames.has(Zi(e));
	}
	getSourceEventNames() {
		let e = /* @__PURE__ */ new Set();
		for (let t of this.eventNames) Wf(t) || e.add(t);
		return e;
	}
	hasEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(Zi(e))?.has(t) === !0;
	}
	getEventInteractions(e, t) {
		return this.eventInteractions.get(Gf(e, t)) ?? [];
	}
	getPropertyInteractions(e, t) {
		return this.propertyInteractions.get(Kf(e, t)) ?? [];
	}
	getValueInteractions(e) {
		return this.valueInteractions.get(e) ?? [];
	}
	getEndValueInteractions(e) {
		return this.endValueInteractions.get(e) ?? [];
	}
	addInteraction(e) {
		if (Hf(e)) {
			let t = w(e.sourceEvent?.componentId), n = Zi(e.sourceEvent?.eventName);
			if (t > 0 && n.length > 0) {
				let r = this.eventInteractions.get(Gf(t, n));
				r === void 0 && (r = [], this.eventInteractions.set(Gf(t, n), r)), r.push(e), this.eventNames.add(n);
				let i = this.eventComponentIdsByName.get(n);
				i === void 0 && (i = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(n, i)), i.add(t);
			}
			return;
		}
		if (Uf(e)) {
			let t = w(e.source?.componentId), n = e.source?.propertyId ?? "";
			if (t > 0 && n.length > 0) {
				let r = this.propertyInteractions.get(Kf(t, n));
				r === void 0 && (r = [], this.propertyInteractions.set(Kf(t, n), r)), r.push(e), Pi(e.actionKind) === "CopyValue" && (this.copiesValues = !0);
				let i = this.metadata.getPropertyDefinition(n)?.propertyName, a = i === Rf || i === Bf ? this.valueInteractions : i === zf ? this.endValueInteractions : null;
				if (a !== null) {
					let n = a.get(t) ?? [];
					n.push(e), a.set(t, n);
				}
			}
		}
	}
};
function Hf(e) {
	return Ni(e.sourceKind) === "Event";
}
function Uf(e) {
	return Ni(e.sourceKind) === "Property";
}
function Wf(e) {
	return e.startsWith("before-") || e.startsWith("after-");
}
function Gf(e, t) {
	return `${e}:${Zi(t)}`;
}
function Kf(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/rendering/motion.ts
var R = {
	fast: 120,
	normal: 200,
	ripple: 400,
	ease: "cubic-bezier(0.4, 0, 0.2, 1)",
	enter: "cubic-bezier(0, 0, 0.2, 1)",
	exit: "cubic-bezier(0.4, 0, 1, 1)",
	spring: "cubic-bezier(0.34, 1.56, 0.64, 1)"
};
function qf() {
	return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function Jf(e) {
	if (typeof e.getAnimations == "function") for (let t of e.getAnimations()) typeof CSSTransition == "function" && t instanceof CSSTransition && t.finish();
}
function Yf(e, t, n) {
	let r = !1, i = () => {
		r || (r = !0, clearTimeout(a), n());
	}, a = setTimeout(i, t), o = typeof e.getAnimations == "function" ? e.getAnimations().filter((e) => typeof CSSTransition != "function" || e instanceof CSSTransition) : [];
	Promise.allSettled(o.map((e) => e.finished)).then(i);
}
//#endregion
//#region src/rendering/responsive-tier.ts
var Xf = [
	"base",
	"sm",
	"md",
	"xl",
	"xxl"
], Zf = {
	sm: 640,
	md: 768,
	xl: 1280,
	xxl: 1536
};
function Qf(e) {
	return `(min-width: ${Zf[e]}px)`;
}
var $f = Qf("sm");
function ep(e = (e) => matchMedia(e).matches) {
	for (let t of [
		"xxl",
		"xl",
		"md",
		"sm"
	]) if (e(Qf(t))) return t;
	return "base";
}
function tp(e, t) {
	return t === "base" ? e : `${e}-${t}`;
}
function np(e, t) {
	if (e == null) return;
	let n = typeof e == "object" ? e : void 0;
	return n === void 0 || !("base" in n) ? t === "base" ? e : void 0 : n[t];
}
function rp(e, t) {
	return ip(t, (t) => np(e, t));
}
function ip(e, t) {
	for (let n = Xf.indexOf(e); n >= 0; n--) {
		let e = t(Xf[n]);
		if (e != null) return e;
	}
}
//#endregion
//#region src/interactions/anchored-popup.ts
var ap = /* @__PURE__ */ new Set([
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
function op(e) {
	return ap.has(e);
}
var sp = 4, cp = 12, lp = /* @__PURE__ */ new Map(), up = !1, dp = null, fp = /* @__PURE__ */ new WeakMap(), pp = "data-ui-popup-stood-in";
function mp(e, t) {
	t === null ? fp.delete(e) : fp.set(e, t);
}
var hp = "--ui-popup-ground";
function gp(e, t) {
	let n = e.closest("[data-ui-theme]") === t.closest("[data-ui-theme]") ? getComputedStyle(e).getPropertyValue(hp).trim() : "";
	n.length === 0 ? t.style.removeProperty(hp) : t.style.setProperty(hp, n);
}
function _p(e, t, n) {
	lp.set(t, {
		anchor: e,
		options: n
	}), Ap(), dp?.observe(t), Cp(e, t), Mp(e, t, n);
}
var vp = "data-ui-popup-lifted", yp = "data-ui-sheet";
function bp() {
	return typeof matchMedia == "function" && !matchMedia($f).matches;
}
function xp(e) {
	return e.hasAttribute(yp);
}
function Sp(e) {
	if (e.hasAttribute(vp)) {
		e.matches(":popover-open") || e.showPopover();
		return;
	}
	e.setAttribute("popover", "manual"), e.setAttribute(vp, ""), wp(e);
}
function Cp(e, t) {
	(t.hasAttribute(vp) || Tp(t) || e.closest(`[${vp}]`) !== null) && Sp(t);
}
function wp(e) {
	let t = getComputedStyle(e), n = t.transitionProperty.split(",").map((e) => e.trim()), r = n.indexOf("overlay");
	if (r === -1) {
		e.showPopover();
		return;
	}
	let i = t.transitionDuration.split(",").map((e) => e.trim());
	e.style.setProperty("transition-duration", n.map((e, t) => t === r ? "0s" : i[t % i.length]).join(", ")), e.showPopover(), getComputedStyle(e).getPropertyValue("overlay"), e.style.removeProperty("transition-duration");
}
function Tp(e) {
	for (let t = e.parentElement; t !== null; t = t.parentElement) {
		let e = getComputedStyle(t);
		if (e.transform !== "none" || e.filter !== "none" || e.perspective !== "none" || t.hasAttribute("data-ui-surface-image-blur") && e.isolation === "isolate") return !0;
	}
	return !1;
}
var Ep = R.normal * 5;
function Dp(e, t) {
	e.hasAttribute(vp) && (e.matches(":popover-open") && e.hidePopover(), Yf(e, Ep, () => {
		e.matches(":popover-open") || lp.has(e) || (e.removeAttribute("popover"), e.removeAttribute(vp), t?.());
	}));
}
function Op(e) {
	let t = lp.get(e);
	t !== void 0 && Mp(t.anchor, e, t.options);
}
function kp(e) {
	e != null && (lp.delete(e), dp?.unobserve(e), Dp(e));
}
function Ap() {
	up || (up = !0, document.addEventListener("scroll", (e) => jp(e.target), !0), window.addEventListener("resize", () => jp(null)), window.visualViewport?.addEventListener("resize", () => jp(null)), window.visualViewport?.addEventListener("scroll", () => jp(null)), dp = new ResizeObserver((e) => {
		for (let t of e) {
			if (!(t.target instanceof HTMLElement)) continue;
			let e = lp.get(t.target);
			e !== void 0 && Mp(e.anchor, t.target, e.options, !0);
		}
	}));
}
function jp(e) {
	for (let [t, n] of lp) {
		if (!t.isConnected) {
			kp(t);
			continue;
		}
		e instanceof Node && t.contains(e) || Mp(n.anchor, t, n.options);
	}
}
function Mp(e, t, n, r = !1) {
	if (!e.isConnected) return;
	let i = Ip(e), a = i !== e;
	t.hasAttribute(pp) !== a && t.toggleAttribute(pp, a), n.minAnchorWidth === !0 && (t.style.minWidth = `${i.getBoundingClientRect().width}px`);
	let o = t.hasAttribute(Np) ? {
		top: t.scrollTop,
		left: t.scrollLeft
	} : null;
	Fp(t);
	let s = i.getBoundingClientRect(), c = (i === e ? n.crossAnchor ?? i : i).getBoundingClientRect(), l = i === e && n.surface !== void 0 ? n.surface.getBoundingClientRect() : s, u = n.gap ?? 4, d = t.getBoundingClientRect(), f = zp(n.boundary), p = lp.get(t), m = r ? p?.side : void 0, h = m !== void 0 && Vp(l, d, m, u, f) ? m : Bp(l, d, n.placement, u, f);
	p !== void 0 && (p.side = h), Vp(l, d, h, u, f) || (Pp(t, h, Gp(l, h, f) - u - sp), d = t.getBoundingClientRect(), o !== null && (t.scrollTop = o.top, t.scrollLeft = o.left));
	let g = n.alignEntries === !0 ? Yp(t, h) : Jp, _ = Zp(l, c, d, h, u, g), v = Qp(l, c, d, h, u, g);
	n.arrow === !0 && (Wp(h) ? v = Lp(v, c.left + c.width / 2, d.width) : _ = Lp(_, c.top + c.height / 2, d.height));
	let ee = em();
	_ = ee.top + im(_ - ee.top, d.height, ee.bottom - ee.top), v = im(v, d.width, window.innerWidth), t.style.top = `${_}px`, t.style.left = `${v}px`, t.dataset.uiPlacement !== h && (t.dataset.uiPlacement = h), Rp(t, c, d, h, _, v);
}
var Np = "data-ui-popup-capped";
function Pp(e, t, n) {
	let r = Wp(t);
	e.setAttribute(Np, ""), e.style.setProperty(r ? "max-height" : "max-width", `${Math.max(0, n)}px`), e.style.setProperty(r ? "overflow-y" : "overflow-x", "auto");
}
function Fp(e) {
	if (e.hasAttribute(Np)) {
		e.removeAttribute(Np);
		for (let t of [
			"max-height",
			"max-width",
			"overflow-y",
			"overflow-x"
		]) e.style.removeProperty(t);
	}
}
function Ip(e) {
	for (let t = e; t !== null; t = t.parentElement) {
		if (t.hasAttribute(pp)) return e;
		let n = fp.get(t);
		if (n !== void 0) return n;
	}
	return e;
}
function Lp(e, t, n) {
	let r = t - e;
	return r < cp ? e - (cp - r) : r > n - cp ? e + (r - (n - cp)) : e;
}
function Rp(e, t, n, r, i, a) {
	let o = Wp(r), s = o ? t.left + t.width / 2 - a : t.top + t.height / 2 - i, c = o ? n.width : n.height;
	e.style.setProperty("--ui-popup-arrow", `${Math.max(cp, Math.min(s, c - cp))}px`);
}
function zp(e) {
	let t = em(), n = {
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
function Bp(e, t, n, r, i) {
	let a = Kp(n);
	if (Vp(e, t, n, r, i)) return n;
	if (Vp(e, t, a, r, i)) return a;
	for (let a of Hp(n)) if (Vp(e, t, a, r, i)) return a;
	return Gp(e, a, i) > Gp(e, n, i) ? a : n;
}
function Vp(e, t, n, r, i) {
	return Gp(e, n, i) >= Up(t, n) + r;
}
function Hp(e) {
	return e.startsWith("bottom") ? ["right-start", "left-start"] : e.startsWith("top") ? ["right-end", "left-end"] : e.startsWith("right") ? ["bottom-start", "top-start"] : ["bottom-end", "top-end"];
}
function Up(e, t) {
	return Wp(t) ? e.height : e.width;
}
function Wp(e) {
	return e.startsWith("top") || e.startsWith("bottom");
}
function Gp(e, t, n) {
	return t.startsWith("top") ? e.top - n.top : t.startsWith("bottom") ? n.bottom - e.bottom : t.startsWith("left") ? e.left - n.left : n.right - e.right;
}
function Kp(e) {
	return e.startsWith("top") ? `bottom${qp(e)}` : e.startsWith("bottom") ? `top${qp(e)}` : e.startsWith("left") ? `right${qp(e)}` : `left${qp(e)}`;
}
function qp(e) {
	let t = e.indexOf("-");
	return t === -1 ? "" : e.slice(t);
}
var Jp = {
	start: 0,
	end: 0
};
function Yp(e, t) {
	let n = getComputedStyle(e);
	return Wp(t) ? {
		start: Xp(n.paddingLeft) + Xp(n.borderLeftWidth),
		end: Xp(n.paddingRight) + Xp(n.borderRightWidth)
	} : {
		start: Xp(n.paddingTop) + Xp(n.borderTopWidth),
		end: Xp(n.paddingBottom) + Xp(n.borderBottomWidth)
	};
}
function Xp(e) {
	let t = Number.parseFloat(e ?? "");
	return Number.isFinite(t) ? t : 0;
}
function Zp(e, t, n, r, i, a) {
	return r.startsWith("top") ? e.top - i - n.height : r.startsWith("bottom") ? e.bottom + i : $p(t.top, t.height, n.height, r, a);
}
function Qp(e, t, n, r, i, a) {
	return r.startsWith("left") ? e.left - i - n.width : r.startsWith("right") ? e.right + i : $p(t.left, t.width, n.width, r, a);
}
function $p(e, t, n, r, i) {
	let a = qp(r);
	return a === "-start" ? e - i.start : a === "-end" ? e + t - n + i.end : e + (t - n) / 2;
}
function em() {
	let e = window.visualViewport, t = e == null || Math.abs(e.scale - 1) > .01, n = t ? 0 : Math.max(0, e.offsetTop), r = t ? window.innerHeight : Math.min(window.innerHeight, e.offsetTop + e.height);
	return {
		top: n,
		bottom: Math.min(r, tm(r))
	};
}
function tm(e) {
	let t = document.querySelector(`[${hn}]`);
	if (t === null) return e;
	let n = t.getBoundingClientRect();
	return n.height > 0 && n.width >= window.innerWidth - 1 && n.top > 0 ? n.top : e;
}
function nm(e, t, n) {
	if (xp(e)) return;
	let r = e.getBoundingClientRect(), i = em();
	e.style.left = `${rm(t, r.width, 0, window.innerWidth)}px`, e.style.top = `${rm(n, r.height, i.top, i.bottom)}px`;
}
function rm(e, t, n, r) {
	return e + t <= r - sp ? e : e - t >= n + sp ? e - t : n + im(e - n, t, r - n);
}
function im(e, t, n) {
	return Math.max(sp, Math.min(e, n - t - sp));
}
//#endregion
//#region src/interactions/dom-mutations.ts
var am = 32;
function z(e, t, n, r) {
	if (!(e instanceof Node)) return null;
	let i = new MutationObserver((i) => {
		let a = om(e, n.relevant === void 0 ? i : i.filter(n.relevant), t);
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
function om(e, t, n) {
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
		if (r.size > am) return new Set(e.querySelectorAll(n));
	}
	return r.size === 0 ? null : r;
}
function sm(e, t, n) {
	return (e.target instanceof Element ? e.target : e.target.parentElement)?.closest(`${t}, ${n}`)?.matches(t) === !0;
}
//#endregion
//#region src/interactions/open-dialogs.ts
var cm = "data-ui-dialog", lm = "data-ui-dialog-modal", um = "data-ui-dialog-backdrop", dm = "data-ui-dialog-close-backdrop", fm = "data-ui-dialog-close-escape", pm = `[${cm}]:not([hidden]), dialog[open]`, mm = "dialog:modal";
function hm(e) {
	let t = e.querySelectorAll(`[${cm}]:not([hidden])`);
	return t.length === 0 ? null : t[t.length - 1];
}
function gm(e) {
	let t = e.querySelectorAll(mm);
	if (t.length > 0) return t[t.length - 1];
	let n = hm(e);
	return n !== null && n.hasAttribute("data-ui-dialog-modal") ? n : null;
}
function _m(e) {
	let t = typeof document > "u" ? null : gm(document);
	return t !== null && !t.contains(e);
}
//#endregion
//#region src/interactions/popup-dismissal.ts
var vm = /* @__PURE__ */ new Set(), ym = null;
function bm(e) {
	ym = e;
}
function xm(e) {
	let t = e.composedPath(), n = ym?.(t) ?? null;
	if (n === null) return t;
	let r = [...t];
	for (let e = n; e !== null; e = e.parentElement) r.push(e);
	return r;
}
var Sm = /* @__PURE__ */ new Map(), Cm = 0, wm = !1;
function Tm() {
	wm || (wm = !0, document.addEventListener("keydown", (e) => {
		!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || A(e) || Om(Fc(e.target)) && e.preventDefault();
	}, !0));
}
function Em() {
	for (let e of vm) for (let t of e.openPopups()) if (t.isConnected && !e.isBehind(t)) return !0;
	return !1;
}
function Dm(e) {
	for (let t of vm) t.hearRefusedClick(e);
}
function Om(e) {
	let t = [];
	for (let e of vm) for (let n of e.openPopups()) n.isConnected && t.push({
		instance: e,
		popup: n
	});
	let n = new Set(t.map((e) => e.popup));
	for (let e of [...Sm.keys()]) n.has(e) || Sm.delete(e);
	for (let { popup: e } of t) Sm.has(e) || Sm.set(e, ++Cm);
	let r = km(t, (e) => Sm.get(e.popup) ?? 0, (e, t) => e.popup.contains(t.popup));
	for (let { instance: t, popup: n } of r) if ((e === null || e.contains(n)) && t.dismiss(n, "escape")) return !0;
	return !1;
}
function km(e, t, n) {
	let r = [...e].sort((e, n) => t(n) - t(e)), i = [];
	for (; r.length > 0;) {
		let e = r.findIndex((e) => !r.some((t) => t !== e && n(e, t)));
		i.push(...r.splice(e, 1));
	}
	return i;
}
var Am = class {
	options;
	pressedInside = /* @__PURE__ */ new Set();
	constructor(e) {
		this.options = e, document.addEventListener("pointerdown", (e) => this.handlePress(e), !0), document.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), e.onPress !== !0 && document.addEventListener("click", (e) => this.handleClick(e), !0), e.onWindowBlur === !0 && window.addEventListener("blur", () => this.dismissAll("blur")), vm.add(this), Tm();
	}
	openPopups() {
		return [...this.options.openPopups()];
	}
	handlePress(e) {
		let t = xm(e), n = this.options.onPress === !0 || e instanceof MouseEvent && e.button !== 0;
		this.pressedInside.clear();
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) ? this.pressedInside.add(e) : n && this.dismiss(e, "outside");
	}
	handleContextMenu(e) {
		let t = xm(e);
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) || this.dismiss(e, "outside");
	}
	hearRefusedClick(e) {
		this.options.onPress !== !0 && this.handleClick(e);
	}
	handleClick(e) {
		let t = xm(e);
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) || this.pressedInside.has(e) || this.dismiss(e, "outside");
		this.pressedInside.clear();
	}
	dismissAll(e) {
		let t = !1;
		for (let n of [...this.options.openPopups()]) t = this.dismiss(n, e) || t;
		return t;
	}
	isBehind(e) {
		return this.options.isBehind === void 0 ? _m(e) : this.options.isBehind(e);
	}
	dismiss(e, t) {
		return this.isBehind(e) || this.options.canDismiss?.(e, t) === !1 ? !1 : (this.options.close(e, t), !0);
	}
	isInside(e, t) {
		return this.options.isInside === void 0 ? t.includes(e) : this.options.isInside(e, t);
	}
}, jm = /\p{M}/gu, Mm = ".ui-text__title";
function Nm(e, t) {
	return Pm(e, t).split(/\s+/).filter((e) => e.length !== 0);
}
function Pm(e, t) {
	return Lm(e, Im(t));
}
function Fm(e, t) {
	return t.every((t) => e.includes(t));
}
function Im(e) {
	return e.closest("[lang]")?.getAttribute("lang") || void 0;
}
function Lm(e, t) {
	let n = e.normalize("NFD").replace(jm, "");
	try {
		return n.toLocaleLowerCase(t);
	} catch {
		return n.toLowerCase();
	}
}
function Rm(e) {
	return e.querySelector(Mm)?.textContent ?? e.textContent ?? "";
}
//#endregion
//#region src/interactions/pointer-drag.ts
var zm = class {
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
		if (t === null || D(t)) return;
		let n = this.options.begin(t, {
			x: e.clientX,
			y: e.clientY
		});
		if (n === null) return;
		e.preventDefault();
		try {
			t.setPointerCapture(e.pointerId);
		} catch {}
		t.setAttribute(Nr, ""), t.tabIndex >= 0 && t.focus({ preventScroll: !0 });
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
			e.pointerId === t.pointerId ? t.point = n : t.second.point = n, this.options.pinch?.(t.context, Bm(r, i, t.point, t.second.point));
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
		this.drag = null, n.removeAttribute(Nr), e.type === "pointercancel" && this.options.takenBack !== void 0 ? this.options.takenBack(n, r) : this.options.end(n, r);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || A(e) || this.drag === null) return;
		e.preventDefault();
		let { handle: t, context: n, pointerId: r, originPoint: i, second: a } = this.drag;
		this.drag = null, t.removeAttribute(Nr);
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
function Bm(e, t, n, r) {
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
function Vm() {
	let e = (e) => {
		e.preventDefault(), e.stopImmediatePropagation(), t();
	}, t = () => {
		window.removeEventListener("click", e, !0), window.removeEventListener("pointerdown", t, !0), window.removeEventListener("keydown", t, !0);
	};
	window.addEventListener("click", e, !0), window.addEventListener("pointerdown", t, !0), window.addEventListener("keydown", t, !0);
}
function Hm(e, t) {
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
		Vm();
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
var Um = "data-ui-sheet-dragging", Wm = "--ui-sheet-drag", Gm = 24, Km = 1 / 3;
function qm(e, t, n) {
	return e > t * Km || n > .5 && e > 6;
}
function Jm(e, t, n) {
	e.style.removeProperty(Wm), e.removeAttribute(Um);
	let r = Hm(e, {
		axis: "y",
		oneWay: !0,
		holdsTouch: !0,
		begins: (n) => t.scrollTop <= 0 && (n.pointerType === "touch" || n.clientY - e.getBoundingClientRect().top <= Gm),
		start: (t) => {
			e.setAttribute(Um, ""), Ym(e, t.pointerId);
		},
		follow: (t) => e.style.setProperty(Wm, `${t}px`),
		end: (t, r, i) => {
			e.removeAttribute(Um), i && qm(t, e.getBoundingClientRect().height, r) ? n() : e.style.setProperty(Wm, "0px");
		}
	});
	return () => {
		r(), e.removeAttribute(Um);
	};
}
function Ym(e, t) {
	try {
		e.setPointerCapture(t);
	} catch {}
}
//#endregion
//#region src/rendering/url-safety.ts
var Xm = [
	"http",
	"https",
	"mailto",
	"tel"
];
function Zm(e) {
	let t = String(e ?? "");
	if (t.trim().length === 0) return !1;
	for (let e of t) {
		let t = e.codePointAt(0) ?? 0;
		if (t <= 32 || t >= 127 && t <= 159) return !1;
	}
	if ("/#?.".includes(t[0])) return !0;
	let n = t.indexOf(":");
	return n < 0 || Xm.includes(t.slice(0, n).toLowerCase());
}
function Qm(e) {
	return Zm(e) ? String(e) : void 0;
}
var $m = [
	"http:",
	"https:",
	"mailto:",
	"tel:"
];
function eh(e) {
	let t = ih(e), n = t.toLowerCase();
	return /^[\\/]{2}/.test(t) || $m.some((e) => n.startsWith(e));
}
function th(e) {
	return typeof e != "string" || /[\x00-\x1f\x7f-\x9f]/.test(e) ? !1 : e === "/" || nh(e);
}
function nh(e) {
	return e.length > 1 && e[0] === "/" && e[1] !== "/" && e[1] !== "\\";
}
function rh(e) {
	return e.length > 0 && e[0] !== "/" && e[0] !== "\\" && !/^[A-Za-z][A-Za-z\d+.-]*:/.test(e);
}
function ih(e) {
	let t = 0, n = e.length;
	for (; t < n && e.charCodeAt(t) <= 32;) t++;
	for (; n > t && e.charCodeAt(n - 1) <= 32;) n--;
	return e.slice(t, n).replace(/[\t\n\r]/g, "");
}
function ah(e) {
	return oh(e) !== null;
}
function oh(e) {
	let t = ih(e), n = t.toLowerCase();
	return nh(t) || rh(t) || n.startsWith("https://") || n.startsWith("http://") || n.startsWith("data:image/") ? t : null;
}
function sh(e) {
	return oh(String(e ?? "").trim()) ?? void 0;
}
//#endregion
//#region src/rendering/icon-value.ts
var ch = "mask:", lh = "ui-icon--image", uh = "ui-icon--mask";
function dh(e) {
	let t = String(e ?? "").trim(), n = !1;
	t.startsWith(ch) && (n = !0, t = t.slice(5).trim());
	let r = t.includes("/") ? oh(t) : null;
	return r === null ? null : {
		source: r,
		tinted: n
	};
}
function fh(e) {
	let t = dh(e);
	return t === null ? "" : ph(t.source);
}
function ph(e) {
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
var mh = "ui-icon", hh = "data-ui-icon", gh = "--ui-icon-url";
function _h(e, t) {
	e.classList.add(mh);
	for (let t of Array.from(e.classList)) yh(t) && e.classList.remove(t);
	(e instanceof HTMLElement || e instanceof SVGElement) && e.style.removeProperty(gh);
	let n = bh(t);
	if (n.length === 0) {
		e.removeAttribute(hh);
		return;
	}
	e.setAttribute(hh, ""), e.classList.add(n);
	let r = dh(t);
	r !== null && (e instanceof HTMLElement || e instanceof SVGElement) && e.style.setProperty(gh, ph(r.source));
}
var vh = "ui-icon-glyph--";
function yh(e) {
	return e === lh || e === uh || e.startsWith(vh);
}
function bh(e) {
	let t = dh(e);
	return t === null ? xh(e) : t.tinted ? uh : lh;
}
function xh(e) {
	let t = String(e ?? "").trim();
	if (t.length === 0) return "";
	let n = vh;
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
var Sh = "data-ui-sheet-covered", Ch = "ui-sheet-scrim", wh = "data-ui-sheet-scrim-leaving", Th = 400, Eh = "ui-sheet__back", Dh = "ui.sheet.back", Oh = "ne-arrow-back", kh = [], Ah = null, jh = !1, Mh = !1;
function Nh(e, t) {
	if (Ph(e) !== null) return;
	let n = t.anchor?.closest("[data-ui-sheet]") ?? null, r = n === null ? null : Ph(n);
	e.style.removeProperty("top"), e.style.removeProperty("left"), e.style.removeProperty("min-width");
	let i = xp(e);
	e.setAttribute(yp, r === null ? "root" : "nested"), i || (e.setAttribute("popover", "manual"), Jf(e));
	let a = null;
	e.querySelector(`:scope > .${Eh}`)?.remove(), r !== null && (e.style.minHeight = `${r.popup.getBoundingClientRect().height}px`, r.popup.setAttribute(Sh, ""), a = Fh(t), e.prepend(a)), Lh(), Sp(e);
	let o = {
		popup: e,
		parent: r,
		opening: t,
		back: a,
		hidden: [],
		detachSwipe: Jm(e, e, () => Rh(e))
	};
	kh.push(o), zh(), queueMicrotask(() => Vh(o));
}
function Ph(e) {
	return kh.find((t) => t.popup === e) ?? null;
}
function Fh(e) {
	let t = document.createElement("button"), n = e.anchor === void 0 ? "" : Rm(e.anchor).trim();
	return t.type = "button", t.className = Eh, t.tabIndex = -1, t.textContent = n, t.prepend(Ih()), E.write(t, "aria-label", Dh, { entry: n }), t.addEventListener("click", (t) => {
		t.stopPropagation(), e.close();
	}), t;
}
function Ih() {
	let e = document.createElement("span");
	return e.className = "ui-sheet__back-mark", e.setAttribute("aria-hidden", "true"), _h(e, Oh), e;
}
function Lh() {
	Ah === null && (Ah = document.createElement("div"), Ah.className = Ch, Ah.setAttribute("aria-hidden", "true"), Ah.addEventListener("mousedown", (e) => e.preventDefault())), Ah.parentElement === null && document.body.appendChild(Ah), Ah.removeAttribute(wh), Sp(Ah);
}
function Rh(e) {
	for (let t = Ph(e); t !== null; t = t.parent) t.opening.close();
}
function zh() {
	jh || (jh = !0, window.addEventListener("pointerdown", () => {
		Mh = !0;
	}, !0), window.addEventListener("pointerup", Bh, !0), window.addEventListener("pointercancel", Bh, !0), window.addEventListener("keydown", (e) => {
		let t = kh.at(-1);
		e.key === "Tab" && !e.defaultPrevented && t !== void 0 && t.opening.trapsTab && e.target instanceof Node && t.popup.contains(e.target) && Md(t.popup, e);
	}, !0), matchMedia($f).addEventListener("change", () => {
		for (let e of kh.filter((e) => e.parent === null)) e.opening.close();
	}));
}
function Bh() {
	if (Mh = !1, Ah?.hasAttribute(wh) !== !0) return;
	let e = () => {
		Ah?.hasAttribute(wh) === !0 && kh.length === 0 && (Ah.removeAttribute(wh), Ah.hidePopover());
	};
	window.addEventListener("click", () => window.setTimeout(e), { once: !0 }), window.setTimeout(e, Th);
}
function Vh(e) {
	if (!kh.includes(e)) return;
	let { popup: t } = e;
	t.contains(document.activeElement) || (t.hasAttribute("tabindex") || (t.tabIndex = -1), L(t)), e.hidden = Hh(t);
}
function Hh(e) {
	let t = [];
	for (let n = e; n.parentElement !== null && n !== document.body; n = n.parentElement) for (let e of n.parentElement.children) e === n || e === Ah || !(e instanceof HTMLElement) || e.getAttribute("aria-hidden") === "true" || (e.setAttribute("aria-hidden", "true"), t.push(e));
	return t;
}
function Uh(e) {
	let t = Ph(e);
	if (t !== null) {
		for (let e of [...kh].reverse()) if (e === t || Wh(e, t)) {
			for (let t of e.hidden) t.removeAttribute("aria-hidden");
			e.hidden = [];
		}
	}
}
function Wh(e, t) {
	for (let n = e.parent; n !== null; n = n.parent) if (n === t) return !0;
	return !1;
}
function Gh(e) {
	let t = Ph(e);
	if (t !== null) {
		for (let e of kh.filter((e) => e.parent === t)) e.opening.close(), Gh(e.popup);
		Uh(e), kh.splice(kh.indexOf(t), 1), t.detachSwipe(), t.parent?.popup.removeAttribute(Sh), kh.length === 0 && Kh(), Dp(e, () => {
			Ph(e) === null && (e.removeAttribute(yp), e.removeAttribute(Sh), e.style.removeProperty("min-height"), e.style.removeProperty("--ui-sheet-drag"), t.back?.remove());
		});
	}
}
function Kh() {
	Ah?.matches(":popover-open") === !0 && (Mh ? Ah.setAttribute(wh, "") : Ah.hidePopover());
}
//#endregion
//#region src/interactions/owned-popup.ts
function qh(e, t) {
	return e.isConnected && !D(e) && !(t && k(e));
}
var Jh = class {
	options;
	entries = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, new Am({
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
			isBehind: (e) => _m(this.entryOf(e)?.opening.owner ?? e),
			onPress: e.onPress,
			onWindowBlur: e.onWindowBlur
		}), (e.closesOnFocusLeave ?? !0) && document.addEventListener("focusout", (e) => this.handleFocusLeave(e), !0), e.closesOnTab !== void 0 && e.closesOnTab !== !1 && Xh(this);
	}
	listsAround(e) {
		return [...this.entries.values()].filter(({ opening: t }) => t.popup.contains(e) && ng(this.options.closesOnTab, t)).map(({ opening: e }) => ({
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
		if (!(e.target instanceof Node) || yd() || t instanceof Element && t.hasAttribute("data-ui-pointer-focus")) return;
		if (t instanceof Element) {
			this.leaveFocus(e.target, t);
			return;
		}
		let n = e.target;
		Qh(n) && queueMicrotask(() => this.letGo(n));
	}
	leaveFocus(e, t) {
		for (let { opening: n } of [...this.entries.values()]) (n.popup.contains(e) || n.owner.contains(e)) && !this.isInside(n, tg(t)) && !_m(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
	}
	letGo(e) {
		if (!Qh(e)) return;
		let t = Id(e);
		for (let { opening: n } of [...this.entries.values()]) {
			let r = n.popup.contains(e) || n.owner.contains(e), i = t !== null && n.popup.contains(t) || n.popup.contains(document.activeElement);
			r && !i && qh(n.owner, this.closesWhenReadOnly) && !_m(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
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
		if (this.close(e.owner), !qh(e.owner, this.closesWhenReadOnly)) return !1;
		(this.options.single ?? !0) && this.closeAll();
		let t = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		return this.entries.set(e.owner, {
			opening: e,
			returnFocus: t
		}), this.options.show(e), this.place(e), rg(e, !0), pg(this), cg(e), e.focus !== void 0 && e.focus !== !1 && Rd(e.popup, e.focus === !0 ? null : e.focus), !0;
	}
	get closesWhenReadOnly() {
		return this.options.closesWhenReadOnly ?? !0;
	}
	closeAll() {
		for (let e of [...this.entries.keys()]) this.close(e);
	}
	place(e) {
		if (xp(e.popup) || ng(this.options.sheetOnPhone, e) && bp()) {
			Nh(e.popup, {
				anchor: e.anchor,
				close: () => this.close(e.owner, "escape"),
				trapsTab: !ng(this.options.closesOnTab, e)
			});
			return;
		}
		e.anchor !== void 0 && e.placement !== void 0 && _p(e.anchor, e.popup, e.placement);
	}
	reposition(e) {
		let t = this.entries.get(e);
		t !== void 0 && this.place(t.opening);
	}
	close(e = this.current, t) {
		let n = e === null ? void 0 : this.entries.get(e);
		if (e === null || n === void 0) return;
		let { opening: r } = n;
		this.entries.delete(e), lg(r.popup), Uh(r.popup), r.popup.contains(document.activeElement) && qd(r.returnFocus === void 0 ? n.returnFocus : r.returnFocus(), r.popup), this.options.hide(r, t), rg(r, !1), xp(r.popup) ? Gh(r.popup) : kp(r.popup), this.entries.size === 0 && mg(this);
	}
	closeStranded() {
		for (let [e, { opening: t }] of [...this.entries]) {
			if (qh(e, this.closesWhenReadOnly)) continue;
			let n = document.activeElement, r = n === null || n === document.body || t.popup.contains(n) || e.contains(n);
			this.close(e, "owner"), r && e.isConnected && !$h() && eg(e);
		}
	}
}, Yh = /* @__PURE__ */ new Set();
function Xh(e) {
	Yh.size === 0 && window.addEventListener("keydown", (e) => {
		e instanceof KeyboardEvent && e.key === "Tab" && !e.defaultPrevented && !A(e) && e.target instanceof Node && Zh(e.target);
	}, !0), Yh.add(e);
}
function Zh(e) {
	let t = [...Yh].flatMap((t) => t.listsAround(e).map((e) => ({
		popups: t,
		...e
	})));
	for (let { popups: e, owner: n } of km(t, () => 0, (e, t) => e.popup.contains(t.popup))) e.close(n, "focus");
}
function Qh(e) {
	return e instanceof Element && e.isConnected && _s(e) && typeof document.hasFocus == "function" && document.hasFocus();
}
function $h() {
	let e = document.activeElement;
	return e instanceof Element && e !== document.body && _s(e);
}
function eg(e) {
	Kd(e), L(e);
}
function tg(e) {
	let t = [];
	for (let n = e; n !== null; n = n.parentNode) t.push(n);
	return t;
}
function ng(e, t) {
	return e === !0 || typeof e == "function" && e(t);
}
function rg(e, t) {
	for (let n of e.openers ?? []) n.setAttribute("aria-expanded", t ? "true" : "false");
}
var ig = /* @__PURE__ */ new Map(), ag = /* @__PURE__ */ new Set(), og = /* @__PURE__ */ new WeakSet(), sg = [];
function cg(e) {
	let { popup: t } = e;
	ig.set(t, e.owner), !og.has(t) && (og.add(t), t.addEventListener("pointerenter", () => {
		ig.has(t) && (ag.add(t), ug());
	}), t.addEventListener("pointerleave", () => {
		ag.delete(t) && ug();
	}));
}
function lg(e) {
	ig.delete(e), ag.delete(e) && ug();
}
function ug() {
	let e = /* @__PURE__ */ new Set();
	for (let t of ag) {
		let n = ig.get(t);
		if (!(n === void 0 || !n.contains(t))) for (let r = t.parentElement; r !== null && (e.add(r), r !== n); r = r.parentElement);
	}
	for (let t of sg) e.has(t) || t.removeAttribute(Br);
	for (let t of e) t.hasAttribute("data-ui-popup-hover") || t.setAttribute(Br, "");
	sg = [...e];
}
var dg = /* @__PURE__ */ new Set(), fg = null;
function pg(e) {
	dg.add(e), fg === null && typeof MutationObserver == "function" && (fg = new MutationObserver(() => {
		for (let e of [...dg]) e.closeStranded();
	}), fg.observe(document, {
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
function mg(e) {
	dg.delete(e), !(dg.size > 0 || fg === null) && (fg.disconnect(), fg = null);
}
//#endregion
//#region src/interactions/flyout-interaction-engine.ts
var hg = "ui-flyout", gg = "ui-flyout--open", _g = "ui-flyout__anchor", vg = "data-ui-flyout-no-backdrop-close", yg = "data-ui-flyout-no-escape-close", bg = `${hg}--`, xg = "bottom-start", Sg = class {
	root;
	flyouts = new Jh({
		show: ({ owner: e }) => e.classList.add(gg),
		hide: ({ owner: e }, t) => this.markClosed(e, t !== "owner"),
		single: !1,
		closesWhenReadOnly: !1,
		canDismiss: ({ owner: e }, t) => !e.hasAttribute(t === "escape" ? yg : vg)
	});
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${hg}`)) this.place(e);
		z(this.root, `.${hg}`, { attributeFilter: ["class"] }, (e) => {
			for (let t of e) this.place(t);
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	place(e) {
		let t = e.querySelector(`:scope > .${ii}`), n = e.querySelector(`:scope > .${_g}`);
		if (t === null) return;
		let r = Cg(n, t);
		if (!e.classList.contains(gg)) {
			this.flyouts.close(e), r?.setAttribute("aria-expanded", "false");
			return;
		}
		this.flyouts.open({
			owner: e,
			popup: t,
			anchor: Tg(n) ?? e,
			placement: { placement: Eg(e) },
			openers: r === null ? [] : [r],
			focus: !yd() || t
		}) || this.markClosed(e);
	}
	markClosed(e, t = !0) {
		e.classList.contains(gg) && (e.classList.remove(gg), wg(e, !1, t));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${_g}`)?.closest(`.${hg}`) ?? null;
		if (t !== null) {
			if (this.flyouts.isOpen(t)) {
				this.flyouts.close(t);
				return;
			}
			t.classList.add(gg), this.place(t), this.flyouts.isOpen(t) && wg(t, !0);
		}
	}
};
function Cg(e, t) {
	if (e === null) return null;
	let n = e.querySelector(ad) ?? e;
	return n.setAttribute("aria-haspopup", "dialog"), n.setAttribute("aria-controls", Di(t, "ui-flyout-content")), n;
}
function wg(e, t, n = !0) {
	e.dispatchEvent(new Event("toggle", { bubbles: !0 })), n && e.dispatchEvent(new Event(t ? "open" : "close", { bubbles: !0 }));
}
function Tg(e) {
	if (e === null) return null;
	let t = e.firstElementChild;
	return t instanceof HTMLElement ? t : e;
}
function Eg(e) {
	for (let t of e.classList) {
		if (!t.startsWith(bg)) continue;
		let e = t.slice(bg.length);
		if (op(e)) return e;
	}
	return xg;
}
//#endregion
//#region src/interactions/drag-marks.ts
var Dg = `:scope > :is(${Yc}, .ui-image-input__surface)`;
function Og(e, t, n, r, i, a = [], o = "move") {
	kg(t, r), n.classList.add(r);
	for (let e of a) e.classList.add(r);
	Ag(e, i, o);
}
function kg(e, t) {
	for (let n of e.querySelectorAll(`.${t}`)) n.classList.remove(t);
}
function Ag(e, t, n) {
	!(e instanceof DragEvent) || e.dataTransfer === null || (e.dataTransfer.effectAllowed = n, e.dataTransfer.setData("text/plain", t));
}
function jg(e, t) {
	return !(e.relatedTarget instanceof Node && t.contains(e.relatedTarget));
}
function Mg(e, t) {
	let n = t && e.querySelector(Dg) !== null;
	e.hasAttribute("data-ui-drop-boxed") !== n && e.toggleAttribute(ge, n);
}
//#endregion
//#region src/interactions/file-drop.ts
var Ng = "data-ui-file-drop-over", Pg = 120, Fg = "refused", Ig = !1;
function Lg(e) {
	let t = {
		marked: /* @__PURE__ */ new Map(),
		leaving: 0
	};
	Vg();
	for (let n of [
		"dragenter",
		"dragover",
		"dragleave",
		"drop"
	]) e.root.addEventListener(n, (n) => Rg(e, t, n), !0);
	e.root.addEventListener("dragend", () => qg(t.marked), !0), window.addEventListener("blur", () => qg(t.marked)), e.root.addEventListener("paste", (t) => zg(e, t), !0);
}
function Rg(e, t, n) {
	if (!(n instanceof DragEvent) || !(n.target instanceof Element)) return;
	let r = t.marked;
	n.type !== "dragleave" && t.leaving !== 0 && (window.clearTimeout(t.leaving), t.leaving = 0);
	let i = e.resolveTarget(n.target);
	if (i === null || !(n.dataTransfer?.types.includes("Files") ?? !1)) {
		i === null && n.type === "dragover" && qg(r);
		return;
	}
	let a = i.mark ?? i.host;
	if (i.refused === !0) {
		Hg(n), n.type !== "dragleave" && qg(r);
		return;
	}
	if (n.type === "dragleave") {
		n.relatedTarget instanceof Node ? a.contains(n.relatedTarget) || Kg(r, a) : t.leaving = window.setTimeout(() => qg(r), Pg);
		return;
	}
	if (n.preventDefault(), n.type !== "drop") {
		let t = Ug(i.accept, n.dataTransfer);
		n.dataTransfer !== null && (n.dataTransfer.dropEffect = t ? "none" : "copy");
		for (let e of r.keys()) e !== a && Kg(r, e);
		let o = i.mark === void 0 ? e.draggingAttribute : Ng;
		r.set(a, o), a.setAttribute(o, t ? Fg : ""), Mg(a, o === Ng);
		return;
	}
	qg(r);
	let o = [...n.dataTransfer?.files ?? []].filter((e) => Jg(i.accept, e));
	o.length !== 0 && e.onFiles(i.host, i.multiple ? o : [o[0]]);
}
function zg(e, t) {
	if (!(t instanceof ClipboardEvent) || !(t.target instanceof Element)) return;
	let n = t.clipboardData;
	if (n === null || n.files.length === 0 || n.getData("text/plain").trim().length > 0) return;
	let r = e.resolveTarget(t.target);
	if (r === null || r.refused === !0) return;
	let i = [...n.files].filter((e) => Jg(r.accept, e));
	i.length !== 0 && (t.preventDefault(), e.onFiles(r.host, r.multiple ? i : [i[0]]));
}
function Bg(e, t, n) {
	for (let r = t.closest(`[${re}]`); r !== null; r = r.parentElement?.closest("[data-ui-id]") ?? null) {
		let t = r.getAttribute("data-ui-id") ?? "", i = [...e.querySelectorAll(`${n}[${Sr}="${wi(t)}"]`)];
		if (i.length > 0) return {
			field: i.find((e) => r.contains(e)) ?? i[0],
			component: r
		};
	}
	return null;
}
function Vg() {
	if (!Ig) {
		Ig = !0;
		for (let e of ["dragover", "drop"]) window.addEventListener(e, (e) => {
			e instanceof DragEvent && !e.defaultPrevented && (e.dataTransfer?.types.includes("Files") ?? !1) && Hg(e);
		});
	}
}
function Hg(e) {
	e.type !== "dragleave" && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "none"));
}
function Ug(e, t) {
	let n = Wg(e);
	if (t === null || n.length === 0 || n.some((e) => e.startsWith("."))) return !1;
	let r = [...t.items].filter((e) => e.kind === "file").map((e) => e.type.toLowerCase());
	return r.length !== 0 && !r.some((e) => n.some((t) => Gg(t, e)));
}
function Wg(e) {
	return e.split(",").map((e) => e.trim().toLowerCase()).filter((e) => e.length > 0);
}
function Gg(e, t) {
	return e.endsWith("/*") ? t.startsWith(e.slice(0, -1)) : t === e;
}
function Kg(e, t) {
	let n = e.get(t);
	e.delete(t), n !== void 0 && t.removeAttribute(n), Mg(t, !1);
}
function qg(e) {
	for (let t of [...e.keys()]) Kg(e, t);
}
function Jg(e, t) {
	let n = Wg(e);
	if (n.length === 0) return !0;
	let r = t.name.toLowerCase(), i = t.type.toLowerCase();
	return n.some((e) => e.startsWith(".") ? r.endsWith(e) : Gg(e, i));
}
//#endregion
//#region src/interactions/file-upload.ts
var Yg = "/_ne/files/upload", Xg = "/_ne/files/selection/", Zg = "/_ne/files/upload/", Qg = [
	"kilobyte",
	"megabyte",
	"gigabyte"
], $g = /* @__PURE__ */ new Map(), e_ = !1;
function t_(e, t, n, r) {
	let i = Number(e.getAttribute(br)), a = [], o = [];
	for (let e of t) !Number.isFinite(i) || i <= 0 || e.size <= i ? a.push(e) : o.push(e);
	if (o.length === 0) return $g.delete(e) && r?.mark(e, null), a;
	if (r === void 0) return s("a chosen file exceeds the input's size limit and was refused.", {
		names: o.map((e) => e.name),
		limit: i
	}), a;
	let c = {
		validation: r,
		limit: i,
		names: n ? o.map((e) => e.name) : null
	};
	for (let e of $g.keys()) e.isConnected || $g.delete(e);
	return $g.set(e, c), n_(e, c), i_(), a;
}
function n_(e, t) {
	let n = r_(t.limit, E.language);
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
function r_(e, t) {
	let n = e, r = "byte";
	for (let e of Qg) {
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
function i_() {
	e_ || (e_ = !0, E.onChange(() => {
		for (let [e, t] of $g) e.isConnected ? n_(e, t) : $g.delete(e);
	}));
}
function a_(e, t) {
	return new Promise((n, r) => {
		let i = new FormData(), a = performance.now(), o = 0, s = 0;
		for (let t of e) i.append("files", t, t.name), o += t.size, s++;
		let c = new XMLHttpRequest();
		c.open("POST", Yg), c.responseType = "json", c.withCredentials = !0, c.upload.addEventListener("progress", (e) => {
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
async function o_(e) {
	let t = await fetch(`${Xg}${encodeURIComponent(e)}`, {
		credentials: "same-origin",
		cache: "no-store"
	});
	if (!t.ok) throw Error(`Reading selection failed with status ${t.status}.`);
	let n = (await t.json())?.files ?? [];
	return n.length === 0 ? null : n;
}
function s_(e) {
	return `${Zg}${encodeURIComponent(e)}`;
}
var c_ = () => {};
function l_(e) {
	return {
		uploadAsync: (e, t) => a_(e, t ?? c_),
		accepts: Jg,
		takeWithinSizeLimit: (t, n, r) => t_(t, n, r, e)
	};
}
function u_(e, t) {
	e !== null && e.value !== t && (e.value = t, e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/picker-events.ts
var d_ = "ui-open-picker";
function f_(e) {
	return !e.dispatchEvent(new Event(d_, {
		bubbles: !0,
		cancelable: !0
	}));
}
function p_(e, t) {
	if (!(e.target instanceof Element)) return;
	let n = e.target.closest(t.rootSelector);
	if (n === null) return;
	e.preventDefault();
	let r = n.querySelector(t.nativeSelector), i = t.pressed(n);
	r === null || r.disabled || i === null || k(n) || D(i) || r.click();
}
//#endregion
//#region src/interactions/file-input-engine.ts
var m_ = "ui-file-input", h_ = "ui-file-input__row", g_ = "ui-file-input__native", __ = "ui-file-input__field", v_ = "ui-file-input__selection", y_ = "data-ui-file-dragging", b_ = class {
	root;
	validation;
	picks = /* @__PURE__ */ new WeakMap();
	shownWords = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation, E.onChange(() => this.rewriteShownWords()), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener(d_, (e) => p_(e, {
			rootSelector: `.${m_}`,
			nativeSelector: `.${g_}`,
			pressed: (e) => e
		})), this.root.addEventListener("change", (e) => void this.handleSelectionAsync(e), !0), Lg({
			root: this.root,
			draggingAttribute: y_,
			resolveTarget: (e) => {
				let t = e.closest(`.${h_}`)?.closest(`.${m_}`) ?? null, n = t === null ? Bg(this.root, e, `.${m_}`) : null, r = t ?? n?.field ?? null, i = r?.querySelector(`.${g_}`) ?? null;
				return r === null || i === null ? null : {
					host: r,
					mark: n?.component,
					accept: i.getAttribute("accept") ?? "",
					multiple: i.multiple,
					refused: i.disabled || k(r) || D(r)
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
		let t = e.target.closest(`[${xr}], .${h_}`);
		if (t === null || D(t) || k(t) || !t.hasAttribute("data-ui-file-pick") && e.target.closest("button, a") !== null) return;
		let n = t.closest(`.${m_}`)?.querySelector(`.${g_}`);
		n == null || n.disabled || n.click();
	}
	async handleSelectionAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(g_)) return;
		let t = e.target.closest(`.${m_}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && await this.takeFilesAsync(t, n);
	}
	async takeFilesAsync(e, t) {
		let n = e.querySelector(`.${__}`);
		if (n === null) return;
		if (t.length === 0) {
			this.show(n, ""), this.publishSelection(e, "");
			return;
		}
		let r = t_(e, t, e.querySelector(`.${g_}`)?.multiple === !0, this.validation);
		if (r.length === 0) return;
		let i = (this.picks.get(e) ?? 0) + 1;
		this.picks.set(e, i);
		try {
			let t = await a_(r, (t) => {
				this.picks.get(e) === i && this.show(n, () => E.format("ui.file.uploading", { percent: t }));
			});
			if (this.picks.get(e) !== i) return;
			this.show(n, x_(r)), this.publishSelection(e, t.selectionId);
		} catch (t) {
			if (s("file upload failed.", t), this.picks.get(e) !== i) return;
			this.show(n, () => E.text("ui.file.failed")), this.publishSelection(e, "");
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
		u_(e.querySelector(`.${v_}`), t);
	}
};
function x_(e) {
	return e.length === 1 ? e[0].name : () => E.format("ui.file.count", { count: e.length });
}
//#endregion
//#region src/rendering/file-glyphs.ts
var S_ = "ne-picture-as-pdf", C_ = "ne-text-snippet", w_ = "ne-description", T_ = "ne-table-chart", E_ = "ne-slideshow", D_ = "ne-folder-zip", O_ = "ne-audio-file", k_ = "ne-video-file", A_ = "ne-image", j_ = "ne-code", M_ = "ne-draft", N_ = new Map([
	...L_(S_, "pdf"),
	...L_(C_, "txt", "md", "log"),
	...L_(w_, "doc", "docx", "odt", "rtf"),
	...L_(T_, "xls", "xlsx", "ods", "csv", "tsv"),
	...L_(E_, "ppt", "pptx", "odp", "key"),
	...L_(D_, "zip", "rar", "7z", "tar", "gz", "tgz", "bz2", "xz"),
	...L_(O_, "mp3", "wav", "ogg", "oga", "opus", "flac", "m4a", "aac"),
	...L_(k_, "mp4", "m4v", "mov", "avi", "mkv", "webm"),
	...L_(A_, "png", "jpg", "jpeg", "gif", "webp", "avif", "bmp", "svg", "ico", "tif", "tiff", "heic", "heif"),
	...L_(j_, "json", "xml", "yml", "yaml", "html", "htm", "css", "less", "scss", "js", "mjs", "ts", "tsx", "jsx", "cs", "csproj", "sln", "java", "kt", "py", "rb", "php", "go", "rs", "c", "h", "cpp", "hpp", "swift", "sql", "sh", "ps1")
]), P_ = /* @__PURE__ */ new Map([
	["application/pdf", S_],
	["text/csv", T_],
	["application/msword", w_],
	["application/rtf", w_],
	["application/vnd.openxmlformats-officedocument.wordprocessingml.document", w_],
	["application/vnd.oasis.opendocument.text", w_],
	["application/vnd.ms-excel", T_],
	["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", T_],
	["application/vnd.oasis.opendocument.spreadsheet", T_],
	["application/vnd.ms-powerpoint", E_],
	["application/vnd.openxmlformats-officedocument.presentationml.presentation", E_],
	["application/vnd.oasis.opendocument.presentation", E_],
	["application/zip", D_],
	["application/x-zip-compressed", D_],
	["application/x-7z-compressed", D_],
	["application/vnd.rar", D_],
	["application/x-rar-compressed", D_],
	["application/x-tar", D_],
	["application/gzip", D_],
	["application/json", j_],
	["application/xml", j_],
	["text/xml", j_],
	["text/html", j_]
]), F_ = /* @__PURE__ */ new Map([
	["image", A_],
	["audio", O_],
	["video", k_],
	["text", C_]
]);
function I_(e, t) {
	let n = e.lastIndexOf("."), r = n < 0 ? void 0 : N_.get(e.slice(n + 1).toLowerCase());
	if (r !== void 0) return r;
	let i = t.split(";", 1)[0].trim().toLowerCase(), a = i.indexOf("/");
	return P_.get(i) ?? (a < 0 ? void 0 : F_.get(i.slice(0, a))) ?? M_;
}
function L_(e, ...t) {
	return t.map((t) => [t, e]);
}
var R_ = 1024, z_ = 16777216;
function B_(e) {
	return {
		x: e.width / 2,
		y: e.height / 2,
		zoom: 1
	};
}
function V_(e, t) {
	let n = Z_(t.zoom, 1, 4), r = X_(e) / n / 2;
	return {
		x: Z_(t.x, r, e.width - r),
		y: Z_(t.y, r, e.height - r),
		zoom: n
	};
}
function H_(e, t) {
	let n = X_(e) / t.zoom;
	return {
		x: t.x - n / 2,
		y: t.y - n / 2,
		side: n
	};
}
function U_(e, t, n) {
	return t.zoom * n / X_(e);
}
function W_(e, t, n, r, i) {
	let a = U_(e, t, n);
	return a > 0 ? V_(e, {
		x: t.x - r / a,
		y: t.y - i / a,
		zoom: t.zoom
	}) : t;
}
function G_(e, t, n, r, i = {
	x: 0,
	y: 0
}) {
	let a = Z_(t.zoom * r, 1, 4), o = U_(e, t, n), s = U_(e, {
		...t,
		zoom: a
	}, n);
	return !(o > 0) || !(s > 0) ? V_(e, {
		...t,
		zoom: a
	}) : V_(e, {
		x: t.x + i.x / o - i.x / s,
		y: t.y + i.y / o - i.y / s,
		zoom: a
	});
}
function K_(e, t) {
	return Math.max(1, Math.min(t, Math.round(e.side)));
}
function q_(e, t) {
	return Math.min(1, t * 4 / X_(e), Math.sqrt(z_ / (e.width * e.height)));
}
function J_(e) {
	return e === "image/jpeg" || e === "image/png" || e === "image/webp" ? e : "image/png";
}
function Y_(e, t, n) {
	if (n === t) return e;
	let r = e.lastIndexOf(".");
	return `${r > 0 ? e.slice(0, r) : e}.${n === "image/jpeg" ? "jpg" : n.slice(n.indexOf("/") + 1)}`;
}
function X_(e) {
	return Math.min(e.width, e.height);
}
function Z_(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
//#endregion
//#region src/interactions/page-dialog.ts
function Q_(e) {
	let t = document.createElement("div");
	t.className = `ui-dialog ${e.className}`, t.setAttribute(cm, e.key), t.setAttribute(lm, ""), e.closesOnEscapeAndBackdrop && (t.setAttribute(fm, ""), t.setAttribute(dm, "")), t.setAttribute("hidden", "");
	let n = document.createElement("div");
	n.className = "ui-dialog__backdrop", n.setAttribute(um, "");
	let r = document.createElement("div");
	return r.className = e.surfaceClassName === void 0 ? ri : `${ri} ${e.surfaceClassName}`, r.setAttribute("role", e.role), r.setAttribute("tabindex", "-1"), r.setAttribute("aria-modal", "true"), r.setAttribute("aria-labelledby", e.labelledBy), e.describedBy !== void 0 && r.setAttribute("aria-describedby", e.describedBy), t.append(n, r), {
		dialog: t,
		surface: r
	};
}
var $_ = class {
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
}, ev = 100 / 3, tv = 1, nv = 2;
function rv(e, t = ev) {
	let n = e.deltaMode === tv ? ev : e.deltaMode === nv ? t : 1;
	return {
		x: e.deltaX * n,
		y: e.deltaY * n
	};
}
function iv(e, t) {
	let n = (Math.sign(e) === Math.sign(t) ? e : 0) + t, r = Math.trunc(n / 100) || 0;
	return {
		steps: r,
		carried: n - r * 100
	};
}
var av = {
	notch: 100,
	pixels: rv
}, ov = "ui-image-crop", sv = "ui-image-crop-title", cv = new $_("data-ui-image-crop-part"), lv = "data-ui-image-crop-frame", uv = 10, dv = 1.2, fv = 380, pv = 100, mv = .92, B = null, hv = !1, gv = null, _v = !1;
async function vv(e, t, n, r = Av) {
	if (B !== null || hv) return "cancelled";
	hv = !0;
	let i;
	try {
		i = await r.decodeAsync(t, n.size);
	} finally {
		hv = !1;
	}
	if (i === null) return "unreadable";
	let a = i;
	return new Promise((i) => {
		gv ??= yv();
		let o = gv;
		o.dialog.isConnected || document.body.append(o.dialog), B = {
			file: t,
			source: a,
			request: n,
			imaging: r,
			view: B_(a),
			finish: (t) => {
				B = null, e.close(ov), a.release(), i(t);
			}
		}, E.write(o.title, null, "ui.crop.title"), E.write(o.stage, "aria-label", "ui.crop.frame"), E.write(o.zoom, "aria-label", "ui.crop.zoom"), E.write(o.cancel, null, "ui.crop.cancel"), E.write(o.apply, null, "ui.crop.apply"), o.stage.setAttribute(lv, n.frame), e.open(ov), Ov(o);
	});
}
function yv() {
	let { dialog: e, surface: t } = Q_({
		key: ov,
		className: "ui-image-crop",
		surfaceClassName: "ui-image-crop__surface",
		role: "dialog",
		labelledBy: sv,
		closesOnEscapeAndBackdrop: !1
	}), n = cv.element("h2", "ui-image-crop__title ui-text-type--subtitle");
	n.id = sv;
	let r = cv.element("div", "ui-image-crop__stage", "stage");
	r.setAttribute("tabindex", "0"), r.setAttribute("role", "group");
	let i = cv.element("canvas", "ui-image-crop__canvas"), a = cv.element("span", "ui-image-crop__frame");
	i.setAttribute("aria-hidden", "true"), a.setAttribute("aria-hidden", "true"), r.append(i, a);
	let o = cv.element("input", "ui-image-crop__zoom", "zoom");
	o.type = "range", o.min = "1", o.max = "4", o.step = "0.01";
	let s = cv.button("ui-button--ghost", "cancel"), c = cv.button("ui-button--primary", "apply");
	t.append(n, r, o, cv.actions(s, c));
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
		let t = cv.pressed(e);
		t === "cancel" ? B?.finish("cancelled") : t === "apply" && bv();
	}), e.addEventListener("keydown", (e) => xv(l, e)), o.addEventListener("input", () => Ev(l, Number(o.value))), r.addEventListener("wheel", (e) => Sv(l, e), { passive: !1 }), window.addEventListener("resize", () => kv(l)), new zm({
		root: e,
		resolveHandle: (e) => r.contains(e) ? r : null,
		begin: (e, t) => B === null ? null : {
			last: t,
			start: B.view
		},
		move: (e, t, n) => {
			e.last !== null && Cv(l, n.x - e.last.x, n.y - e.last.y), e.last = n;
		},
		end: () => void 0,
		cancel: (e, t) => {
			B !== null && (B.view = t.start, Ov(l));
		},
		pinch: (e, t) => {
			e.last = null, wv(l, t);
		}
	}), l;
}
async function bv() {
	let e = B;
	if (e === null) return;
	let { file: t, source: n, request: r, imaging: i, view: a } = e, o = H_(n, a), s = J_(t.type), c = i.encodeAsync(n, o, K_(o, r.size), s);
	B = null;
	let l;
	try {
		l = await c;
	} catch {
		l = null;
	}
	e.finish(l === null ? "unreadable" : new File([l], Y_(t.name, t.type, l.type), {
		type: l.type,
		lastModified: t.lastModified
	}));
}
function xv(e, t) {
	if (t.defaultPrevented || A(t) || B === null) return;
	if (t.key === "Escape") {
		t.preventDefault(), B.finish("cancelled");
		return;
	}
	if (t.target !== e.stage || t.ctrlKey || t.altKey || t.metaKey) return;
	let n = t.shiftKey ? 50 : uv;
	switch (t.key) {
		case "ArrowLeft":
			Cv(e, -n, 0);
			break;
		case "ArrowRight":
			Cv(e, n, 0);
			break;
		case "ArrowUp":
			Cv(e, 0, -n);
			break;
		case "ArrowDown":
			Cv(e, 0, n);
			break;
		case "+":
		case "=":
			Tv(e, dv);
			break;
		case "-":
		case "_":
			Tv(e, 1 / dv);
			break;
		case "Enter":
			bv();
			break;
		default: return;
	}
	t.preventDefault();
}
function Sv(e, t) {
	if (B === null) return;
	t.preventDefault();
	let n = rv(t, e.stage.clientHeight), r = t.ctrlKey ? pv : fv;
	Tv(e, 2 ** (-n.y / r), Dv(e, t.clientX, t.clientY));
}
function Cv(e, t, n) {
	B !== null && (B.view = W_(B.source, B.view, e.frame.clientWidth, t, n), Ov(e));
}
function wv(e, t) {
	if (B === null) return;
	let n = W_(B.source, B.view, e.frame.clientWidth, t.shift.x, t.shift.y);
	B.view = G_(B.source, n, e.frame.clientWidth, t.factor, Dv(e, t.center.x, t.center.y)), Ov(e);
}
function Tv(e, t, n) {
	B !== null && (B.view = G_(B.source, B.view, e.frame.clientWidth, t, n), Ov(e));
}
function Ev(e, t) {
	B !== null && Number.isFinite(t) && t > 0 && Tv(e, t / B.view.zoom);
}
function Dv(e, t, n) {
	let r = e.stage.getBoundingClientRect();
	return {
		x: t - (r.left + r.width / 2),
		y: n - (r.top + r.height / 2)
	};
}
function Ov(e) {
	if (B === null) return;
	let t = B.view.zoom;
	e.zoom.value = String(t), e.zoom.setAttribute("aria-valuetext", `${Math.round(t * 100)}%`), e.zoom.style.setProperty("--ui-slider-fraction", String((t - 1) / 3)), kv(e);
}
function kv(e) {
	_v || B === null || (_v = !0, requestAnimationFrame(() => {
		if (_v = !1, B === null) return;
		let t = e.frame.clientWidth, n = e.stage.clientWidth, r = e.stage.clientHeight, i = B.view, a = U_(B.source, i, t);
		B.imaging.paint(e.canvas, B.source, {
			left: n / 2 - i.x * a,
			top: r / 2 - i.y * a,
			width: B.source.width * a,
			height: B.source.height * a,
			stageWidth: n,
			stageHeight: r
		});
	}));
}
var Av = {
	decodeAsync: async (e, t) => {
		let n = await jv(e);
		if (n === null) return null;
		let r = n, i = q_(r, t);
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
		}, r, mv);
	})
};
async function jv(e) {
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
var Mv = "ui-image-input", Nv = "ui-image-input--multiple", Pv = "ui-image-input__surface", Fv = "ui-image-input__native", Iv = "ui-image-input__picture", Lv = "ui-image-input__text", Rv = "ui-image-input__selection", zv = "ui-image-input__selections", Bv = "ui-image-input__tiles", Vv = "ui-image-input__tile", Hv = "ui-image-input__remove", Uv = "ui-image-input__progress", Wv = "ui-image-input__tile--file", Gv = "ui-image-input__file-glyph", Kv = "ui-image-input__file-name", qv = "ui-image-input__file-size", Jv = "SelectionId", Yv = "--ui-image-progress", Xv = "data-ui-image-preview", Zv = "data-ui-image-dragging", Qv = "data-ui-image-tiles", $v = class {
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
		this.root = e.root ?? document, this.validation = e.validation, this.dialogs = e.dialogs, this.cropImaging = e.cropImaging, this.applyAll(this.root.querySelectorAll(`.${Mv}`)), z(this.root, `.${Mv}`, {
			childList: !0,
			attributeFilter: [
				yr,
				Xe,
				Gr
			]
		}, (e) => {
			this.applyAll(e), this.releaseDetached();
		}), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			e.propertyName === Jv && (e.value === null || e.value === void 0 || e.value === "") && this.clearAll(pa(e.components, `.${Mv}`));
		}), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("click", (e) => this.handleRemoveClick(e), !0), this.root.addEventListener("change", (e) => void this.handleNativeChangeAsync(e), !0), this.root.addEventListener(d_, (e) => p_(e, {
			rootSelector: `.${Mv}`,
			nativeSelector: `.${Fv}`,
			pressed: (e) => e.querySelector(`.${Pv}`)
		})), this.root.addEventListener(qc, (e) => this.handleDraftDropped(e)), Lg({
			root: this.root,
			draggingAttribute: Zv,
			resolveTarget: (e) => {
				let t = e.closest(`.${Pv}`), n = t?.closest(`.${Mv}`) ?? null, r = n === null ? Bg(this.root, e, `.${Mv}`) : null, i = n ?? r?.field ?? null, a = t ?? i?.querySelector(`.${Pv}`) ?? null;
				return i === null || a === null ? null : {
					host: i,
					mark: r?.component,
					accept: i.querySelector(`.${Fv}`)?.getAttribute("accept") ?? "",
					multiple: ey(i),
					refused: k(i) || D(a)
				};
			},
			onFiles: (e, t) => void (ey(e) ? this.takeManyAsync(e, t) : this.takeFileAsync(e, t[0]))
		});
	}
	applyAll(e) {
		for (let t of e) ey(t) ? this.reconcileShelf(t) : this.apply(t);
	}
	apply(e) {
		let t = e.querySelector(`.${Iv}`);
		if (t === null) return;
		let n = e.getAttribute("data-ui-image-source") ?? "", r = this.previews.has(e);
		if (r && e.dataset.previewFor === n) return;
		let i = r && n.length > 0;
		this.dropPreview(e, i), n.length === 0 ? t.removeAttribute("src") : t.getAttribute("src") !== n && t.setAttribute("src", n), i || ly(e, e.getAttribute("data-ui-image-caption") ?? fy(n)), dy(e, n.length > 0);
	}
	reconcileShelf(e) {
		let t = e.getAttribute(Gr);
		if (this.seenKeys.get(e) === t) return;
		this.seenKeys.set(e, t);
		let n = this.published.get(e) ?? [], r = t === null ? -1 : n.indexOf(t);
		if (r >= 0) {
			n.splice(0, r + 1);
			return;
		}
		let i = iy(t);
		if (i === null) return;
		let a = this.shelves.get(e) ?? [];
		for (let t of [...a]) t.selectionId !== null && !i.has(t.selectionId) && this.dropTile(e, t);
		this.restoreTiles(e, a, i);
	}
	restoreTiles(e, t, n) {
		let r = e.querySelector(`.${Bv}`);
		if (r === null || n.size === 0) return;
		let i = /* @__PURE__ */ new Map();
		for (let e of t) e.selectionId !== null && i.set(e.selectionId, e);
		let a = [];
		for (let t of n) {
			let n = i.get(t);
			n === void 0 && (n = oy(t), this.fillStoredTileAsync(e, n, t)), a.push(n);
		}
		for (let e of t) e.selectionId === null && a.push(e);
		a.length === t.length && a.every((e, n) => t[n] === e) || (t.splice(0, t.length, ...a), this.shelves.set(e, t), r.replaceChildren(...t.map((e) => e.element)), ty(e, t));
	}
	async fillStoredTileAsync(e, t, n) {
		let r;
		try {
			r = await o_(n);
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
		sy(t.element, a, i === void 0 ? "" : s_(i.fileId)), t.element.classList.remove(ei);
	}
	releaseDetached() {
		for (let e of this.holding) if (!e.isConnected) {
			this.holding.delete(e), this.dropPreview(e);
			for (let t of [...this.shelves.get(e) ?? []]) this.dropTile(e, t);
		}
	}
	clearAll(e) {
		for (let t of e) ey(t) || this.previews.get(t)?.landed !== !0 || (t.dataset.previewFor === (t.getAttribute("data-ui-image-source") ?? "") && this.dropPreview(t), this.apply(t));
	}
	handlePickClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${xr}]`), n = t?.closest(`.${Mv}`) ?? null;
		t === null || n === null || k(n) || D(t) || n.querySelector(`.${Fv}`)?.click();
	}
	handleRemoveClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Hv}`), n = t?.closest(`.${Mv}`) ?? null;
		if (t === null || n === null || k(n) || D(n)) return;
		e.preventDefault(), e.stopPropagation();
		let r = this.shelves.get(n)?.find((e) => e.element === t.parentElement);
		r !== void 0 && (this.dropTile(n, r), this.publishShelf(n));
	}
	async handleNativeChangeAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Fv)) return;
		let t = e.target.closest(`.${Mv}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && n.length !== 0 && (ey(t) ? await this.takeManyAsync(t, n) : await this.takeFileAsync(t, n[0]));
	}
	handleDraftDropped(e) {
		if (e.target instanceof Element) for (let t of e.target.querySelectorAll(`.${Mv}`)) this.previews.has(t) && (this.dropPreview(t), this.apply(t), u_(t.querySelector(`.${Rv}`), ""));
	}
	async takeFileAsync(e, t) {
		this.releaseDetached();
		let n = e.querySelector(`.${Pv}`), r = e.querySelector(`.${Iv}`), i = e.querySelector(`.${Rv}`);
		if (n === null || r === null) return;
		let a = await this.cropAsync(e, t);
		if (a === null || t_(e, [a], !1, this.validation).length === 0) return;
		this.dropPreview(e);
		let o = {
			url: URL.createObjectURL(a),
			landed: !1
		};
		this.previews.set(e, o), this.holding.add(e), e.dataset.previewFor = e.getAttribute("data-ui-image-source") ?? "", e.setAttribute(Xv, ""), r.setAttribute("src", o.url), ly(e, a.name), dy(e, !0), n.classList.add(ei);
		try {
			let t = await a_([a], () => void 0);
			this.previews.get(e) === o && (o.landed = !0, u_(i, t.selectionId));
		} catch (t) {
			s("picture upload failed.", t), this.previews.get(e) === o && (uy(e), u_(i, ""));
		} finally {
			(this.previews.get(e) === o || !this.previews.has(e)) && n.classList.remove(ei);
		}
	}
	async cropAsync(e, t) {
		let n = ny(e);
		if (n === null || this.dialogs === void 0) return t;
		if (this.cropping.has(e)) return null;
		this.cropping.add(e);
		try {
			let r = await vv(this.dialogs, t, {
				frame: n,
				size: ry(e)
			}, this.cropImaging);
			return r === "cancelled" || !e.isConnected ? null : r === "unreadable" ? (this.unreadable.add(e), this.validation?.mark(e, "error", { key: "ui.image.unreadable" }), null) : (this.unreadable.delete(e) && this.validation?.mark(e, null), r);
		} finally {
			this.cropping.delete(e);
		}
	}
	async takeManyAsync(e, t) {
		this.releaseDetached();
		let n = e.querySelector(`.${Bv}`), r = t_(e, t, !0, this.validation);
		if (n === null || r.length === 0) return;
		let i = this.shelves.get(e) ?? [];
		this.shelves.set(e, i), this.holding.add(e);
		let a = r.map(async (t) => {
			let r = ay(t);
			i.push(r), n.appendChild(r.element);
			try {
				let n = await a_([t], (e) => r.element.style.setProperty(Yv, `${e}%`));
				if (!i.includes(r)) return;
				r.selectionId = n.selectionId, r.element.classList.remove(ei), this.publishShelf(e);
			} catch (t) {
				this.dropTile(e, r), s("picture upload failed.", t);
			}
		});
		ty(e, i), await Promise.all(a);
	}
	dropTile(e, t) {
		let n = this.shelves.get(e), r = n?.indexOf(t) ?? -1;
		n !== void 0 && r >= 0 && n.splice(r, 1), t.url !== null && URL.revokeObjectURL(t.url), t.element.remove(), ty(e, n ?? []);
	}
	publishShelf(e) {
		let t = e.querySelector(`.${zv}`), n = (this.shelves.get(e) ?? []).map((e) => e.selectionId).filter((e) => e !== null), r = JSON.stringify(n);
		if (t === null || t.getAttribute("data-ui-selected-keys") === r) return;
		let i = this.published.get(e) ?? [];
		i.push(r), this.published.set(e, i), t.setAttribute(Gr, r), t.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	dropPreview(e, t = !1) {
		let n = this.previews.get(e);
		n !== void 0 && (URL.revokeObjectURL(n.url), this.previews.delete(e), delete e.dataset.previewFor, e.removeAttribute(Xv), t || ly(e, ""));
	}
};
function ey(e) {
	return e.classList.contains(Nv);
}
function ty(e, t) {
	e.hasAttribute(Qv) !== t.length > 0 && e.toggleAttribute(Qv, t.length > 0);
}
function ny(e) {
	let t = e.getAttribute(Ze);
	return t === "square" || t === "circle" ? t : null;
}
function ry(e) {
	let t = Number(e.getAttribute(Qe));
	return Number.isInteger(t) && t > 0 ? t : R_;
}
function iy(e) {
	if (e === null) return /* @__PURE__ */ new Set();
	let t;
	try {
		t = JSON.parse(e);
	} catch {
		return null;
	}
	return Array.isArray(t) ? new Set(t.filter((e) => typeof e == "string")) : null;
}
function ay(e) {
	let t = document.createElement("span"), n = URL.createObjectURL(e);
	return t.className = `${Vv} ${ei}`, sy(t, e, n), {
		element: t,
		url: n,
		selectionId: null
	};
}
function oy(e) {
	let t = document.createElement("span"), n = document.createElement("button"), r = document.createElement("span");
	return t.className = `${Vv} ${ei}`, n.type = "button", n.className = Hv, r.className = Uv, E.write(n, "aria-label", "ui.file.remove"), t.append(n, r), {
		element: t,
		url: null,
		selectionId: e
	};
}
function sy(e, t, n) {
	let r = document.createElement("button"), i = document.createElement("span");
	if (r.type = "button", r.className = Hv, i.className = Uv, t.type.startsWith("image/")) {
		let a = document.createElement("img");
		a.src = n, a.alt = t.name, E.write(r, "aria-label", "ui.image.remove"), a.addEventListener("error", () => e.replaceChildren(...cy(e, r, t), r, i), { once: !0 }), e.replaceChildren(a, r, i);
	} else e.replaceChildren(...cy(e, r, t), r, i);
}
function cy(e, t, n) {
	let r = document.createElement("span"), i = document.createElement("span"), a = document.createElement("span");
	return e.classList.add(Wv), e.setAttribute("title", n.name), r.className = Gv, r.setAttribute("aria-hidden", "true"), _h(r, I_(n.name, n.type)), i.className = Kv, i.textContent = n.name, a.className = qv, a.textContent = n.size === null ? "" : r_(n.size, E.language), E.write(t, "aria-label", "ui.file.remove"), [
		r,
		i,
		a
	];
}
function ly(e, t) {
	let n = e.querySelector(`.${Lv}`);
	n !== null && ($o(n, null), n.textContent !== t && (n.textContent = t));
}
function uy(e) {
	let t = e.querySelector(`.${Lv}`);
	t !== null && E.write(t, null, "ui.file.failed");
}
function dy(e, t) {
	let n = e.querySelector(`.${Pv}`);
	n !== null && E.write(n, "aria-label", t ? "ui.image.change" : "ui.image.choose");
}
function fy(e) {
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
var py = "ui-key-value-action__value", my = "ui-key-value-action--editable", hy = "ui-text__title", gy = "ui-row-form-", _y = ":scope > :is(.ui-input--filled, .ui-input--tonal, .ui-input--outline, .ui-input--ghost, .ui-input--underline)", vy = class {
	options;
	root;
	openRows = /* @__PURE__ */ new WeakSet();
	closedRows = /* @__PURE__ */ new WeakSet();
	rowForms = /* @__PURE__ */ new WeakMap();
	formCount = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.handleRows(this.root.querySelectorAll(`.${jc}`), !1), z(this.root, `.${jc}`, {
			childList: !0,
			attributeFilter: [pr]
		}, (e) => this.handleRows(e, !0)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && Cy(e.target) && e.preventDefault();
		}, !0), (this.root === document ? window : this.root).addEventListener("change", (e) => Sy(e), !0);
	}
	handleRows(e, t) {
		for (let n of e) {
			if (!n.hasAttribute("data-ui-row-editing")) {
				this.closedRows.has(n) || (this.openRows.delete(n), this.closedRows.add(n), this.close(n));
				continue;
			}
			this.closedRows.delete(n), this.joinForm(n), yy(n), this.openRows.has(n) || (this.openRows.add(n), this.open(n, t), this.judge(n));
		}
	}
	joinForm(e) {
		let t = e.querySelector(`.${Nc} button`);
		if (t === null) return;
		let n = this.rowForms.get(e);
		n === void 0 && (n = `${gy}${++this.formCount}`, this.rowForms.set(e, n));
		for (let t of e.querySelectorAll(`.${Mc} [${qe}]:not([${Kt}])`)) t.setAttribute(Kt, n);
		t.setAttribute(Zr, n);
	}
	leaveForm(e) {
		let t = this.rowForms.get(e);
		if (t !== void 0) for (let n of e.querySelectorAll(`[${Kt}="${t}"], [${Zr}="${t}"]`)) n.removeAttribute(Kt), n.removeAttribute(Zr);
	}
	close(e) {
		this.leaveForm(e);
		for (let t of e.querySelectorAll(`.${Mc} [${qe}]`)) {
			if (Uc(t)) {
				t.value = "";
				continue;
			}
			let e = this.options.dom.resolveNearestComponent(t, () => !0);
			this.options.propertyPatchEngine.restoreBoundValue(t, e?.dynamicParameters ?? []);
		}
		Jc(e), this.judge(e);
	}
	judge(e) {
		let t = xy(e);
		for (let n of e.querySelectorAll(`.${Mc} [${qe}]`)) this.options.validation.judgeShown(n, Uc(n) && n.value.length === 0 ? t : null);
	}
	open(e, t) {
		let n = e.querySelector(`.${Mc} :is(input, textarea, select)`);
		if (n !== null) {
			if (Uc(n) && n.value.length === 0 && n.hasAttribute("data-ui-bind-value")) {
				let t = xy(e);
				t.length > 0 && (n.value = t, n.dispatchEvent(new Event("change", { bubbles: !0 })));
			}
			t && (n.focus({ preventScroll: !0 }), Hc(n) && n.select());
		}
	}
	handleKeydown(e) {
		if (e.key === "F2" && !e.defaultPrevented && j(e)) {
			by(e);
			return;
		}
		if (e.defaultPrevented || A(e) || !(e.target instanceof Element) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = Lc(e.target);
		if (t === null || e.key === "Enter" && t.cell.classList.contains("ui-key-value-action__edit-action")) return;
		let { cell: n, row: r } = t, i = e.target.closest(ci), a = n.querySelector("[role='listbox']");
		if (i !== null && n.contains(i) || a !== null && a.getClientRects().length > 0 || e.key === "Enter" && e.target instanceof HTMLTextAreaElement) return;
		let o = r.querySelectorAll(`.${Nc} button`), s = e.key === "Enter" ? o[0] : o[o.length - 1];
		s !== void 0 && (e.preventDefault(), !D(s) && (e.key === "Enter" && e.target instanceof HTMLInputElement && (e.target.dispatchEvent(new Event("change", { bubbles: !0 })), s.focus({ preventScroll: !0 })), s.click()));
	}
};
function yy(e) {
	for (let t of e.querySelectorAll(`:scope > .${Mc}`)) {
		let e = t.querySelector(_y) !== null;
		t.hasAttribute("data-ui-boxed-editor") !== e && t.toggleAttribute(mr, e);
	}
}
function by(e) {
	let t = e.target instanceof Element ? e.target.closest(`.${jc}`) : null, n = t === null || t.hasAttribute("data-ui-row-editing") || t.closest(`.${my}`) === null ? null : t.querySelector(".ui-key-value-action__action")?.querySelector(ad) ?? null;
	n === null || D(n) || (e.preventDefault(), n.click());
}
function xy(e) {
	return e.querySelector(`.${py} .${hy}`)?.textContent?.trim() ?? "";
}
function Sy(e) {
	if (!e.isTrusted || !(e.target instanceof Element)) return;
	let t = e.target.closest(".ui-key-value-action__value-input")?.closest(".ui-key-value-action__row") ?? null;
	t !== null && !t.hasAttribute("data-ui-row-editing") && e.stopImmediatePropagation();
}
function Cy(e) {
	let t = e.closest(`.${Nc} button`), n = t?.closest(`.${Nc}`)?.querySelectorAll("button");
	return t !== null && n !== void 0 && n[n.length - 1] === t;
}
var wy = `.ui-button[${Ot}="pressed"]`, Ty = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(wy);
		t === null || D(t) || t.hasAttribute("data-ui-drawer-pin") || (t.setAttribute("aria-pressed", t.getAttribute("aria-pressed") === "true" ? "false" : "true"), t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, Ey = `${Xc}, [tabindex], [contenteditable], ${ci}, [${Ye}]`, Dy = ":scope > input.ui-field, :scope > textarea.ui-field", Oy = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("pointerdown", (e) => this.handlePointerDown(e));
	}
	handlePointerDown(e) {
		if (e.defaultPrevented || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(Yc);
		if (t === null || e.target !== t && e.target.closest(Ey) !== null) return;
		let n = t.querySelector(Dy);
		if (!Uc(n) || n.readOnly || D(n) || k(n) || (e.preventDefault(), n.focus({ preventScroll: !0 }), n.selectionStart === null)) return;
		let r = n.value.length;
		n.setSelectionRange(r, r);
	}
}, ky = "data-ui-input-debounce", Ay = `input[${ky}], textarea[${ky}]`;
function jy(e) {
	return (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.matches(Ay);
}
var My = /* @__PURE__ */ new Set();
function Ny() {
	for (let e of My) if (e.waiting) return !0;
	return !1;
}
function Py() {
	for (let e of My) e.commitAll();
}
function Fy(e) {
	for (let t of My) t.drop(e);
}
var Iy = class {
	root;
	timers = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleChange(e), !0), My.add(this);
	}
	get waiting() {
		return this.timers.size > 0;
	}
	drop(e) {
		if (!jy(e)) return;
		let t = this.timers.get(e);
		t !== void 0 && (window.clearTimeout(t), this.timers.delete(e));
	}
	commitAll() {
		for (let [e, t] of [...this.timers]) window.clearTimeout(t), this.commit(e);
	}
	handleInput(e) {
		let t = e.target;
		if (!jy(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = Number(t.getAttribute(ky));
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(r) && r >= 0 ? r : 0));
	}
	handleChange(e) {
		let t = e.target;
		if (!jy(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && (window.clearTimeout(n), this.timers.delete(t));
	}
	commit(e) {
		this.timers.delete(e), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
}, Ly = "data-ui-submit-on-enter", Ry = "data-ui-runs-on-enter", zy = "enter", By = "escape", Vy = {
	name: zy,
	registration: { settlesValue: !0 }
}, Hy = "ui-commit-in-place", Uy = class {
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
		}, !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), this.root.addEventListener(Hy, (e) => {
			(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) && this.commitInPlace(e.target);
		}), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = this.focusedField;
			t !== null && !(e.local && this.edited.has(t)) && e.components.some((e) => e.contains(t)) && (this.lastCommitted = t.value);
		});
	}
	handleKeydown(e) {
		if (e.defaultPrevented || A(e) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = e.target;
		if (t instanceof HTMLTextAreaElement) {
			e.key === "Escape" ? (e.preventDefault(), Ic(t) ? this.runEscape(t, e) : this.leave(t)) : Wy(t, e) ? (e.preventDefault(), this.runEnter(t, e)) : Gy(t, e) && (e.preventDefault(), this.commitInPlace(t), this.submitForm(t));
			return;
		}
		if (Hc(t)) {
			if (e.preventDefault(), Wy(t, e)) {
				this.runEnter(t, e);
				return;
			}
			if (e.key === "Escape" && Ic(t)) {
				this.runEscape(t, e);
				return;
			}
			this.leave(t), e.key === "Enter" && this.submitForm(t);
		}
	}
	runEnter(e, t) {
		t.repeat || e.readOnly || D(e) || (this.commitInPlace(e), e.dispatchEvent(new Event(zy, { bubbles: !0 })));
	}
	runEscape(e, t) {
		if (t.repeat) return;
		Fy(e), this.edited.delete(e), e === this.focusedField && e.value !== this.lastCommitted && this.putBack(e, this.lastCommitted);
		let n = Id(e);
		e.blur(), Ld(e, n), e.dispatchEvent(new Event(By, { bubbles: !0 }));
	}
	putBack(e, t) {
		this.propertyPatchEngine?.writeBoundValue(e, t), e.value !== t && (e.value = t);
	}
	submitForm(e) {
		let t = e.getAttribute(Kt);
		if (t === null || t.length === 0) return;
		let n = this.root.querySelector(`[${Zr}="${wi(t)}"]`);
		n !== null && !D(n) && n.click();
	}
	leave(e) {
		let t = this.changes, n = Id(e);
		e.blur(), this.changes === t && this.commit(e), Ld(e, n);
	}
	commit(e) {
		e.value !== this.committedValue && e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	commitInPlace(e) {
		this.edited.has(e) ? e.dispatchEvent(new Event("change", { bubbles: !0 })) : this.commit(e);
	}
};
function Wy(e, t) {
	return Ky(t) && e.hasAttribute(Ry);
}
function Gy(e, t) {
	return Ky(t) && e.hasAttribute(Ly) && !e.readOnly && !D(e);
}
function Ky(e) {
	return e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey;
}
//#endregion
//#region src/updates/icon-stand-in.ts
var qy = "icon-stand-in", Jy = ".ui-icon.ui-icon--circle", Yy = "ne-person", Xy = "ui-icon--circle", Zy = "ui-icon--image", Qy = "ui-icon-stand-in", $y = `:scope > .${Qy}`, eb = "missing", tb = "failed", nb = 512, rb = /* @__PURE__ */ new Map(), ib = /* @__PURE__ */ new Map();
function ab(e) {
	let t = e.getAttribute(at), n = ob(e);
	return n === null ? e.removeAttribute(at) : t !== n && e.setAttribute(at, n), ub(e, n !== null), n === eb ? "show" : t === eb ? "release" : "keep";
}
function ob(e) {
	if (!e.classList.contains(Xy)) return null;
	if (!e.className.split(" ").some(yh)) return eb;
	let t = e.classList.contains(Zy) ? sb(e) : null;
	if (t === null) return null;
	let n = rb.get(t);
	return n === void 0 || !n.loaded && Date.now() - n.at >= 3e4 ? (cb(t, e), n === void 0 ? null : tb) : n.loaded ? null : tb;
}
function sb(e) {
	let t = e.style.getPropertyValue(gh).trim();
	return t.startsWith("url(\"") && t.endsWith("\")") ? t.slice(5, -2) : null;
}
function cb(e, t) {
	let n = ib.get(e);
	if (n !== void 0) {
		n.add(t);
		return;
	}
	ib.set(e, /* @__PURE__ */ new Set([t]));
	let r = new Image();
	r.addEventListener("load", () => lb(e, !0)), r.addEventListener("error", () => lb(e, !1)), r.src = e;
}
function lb(e, t) {
	let n = ib.get(e);
	rb.delete(e), rb.set(e, {
		loaded: t,
		at: Date.now()
	}), ib.delete(e), rb.size > nb && rb.delete(rb.keys().next().value);
	for (let e of n ?? []) ab(e);
}
function ub(e, t) {
	let n = e.querySelector($y);
	if (!t) {
		n?.remove();
		return;
	}
	let r = e.getAttribute(rt), i = r !== null && bh(r).length > 0 ? r : Yy;
	if (n === null) n = document.createElement("span"), n.setAttribute("aria-hidden", "true"), e.appendChild(n);
	else if (n.classList.contains(bh(i))) return;
	_h(n, i), n.classList.add(Qy);
}
//#endregion
//#region src/interactions/image-fallback-engine.ts
var db = `.${$e}`, fb = `img.${et}`, pb = `:scope > ${fb}`, mb = "%238c8c8c", hb = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='-12 -12 48 48'%3E%3Crect x='3' y='3' width='18' height='18' rx='3' fill='none' stroke='${mb}' stroke-width='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.75' fill='${mb}'/%3E%3Cpath d='M4 18l5-6 4 4.5 3-3 4 4.5' fill='none' stroke='${mb}' stroke-width='2' stroke-linejoin='round'/%3E%3C/svg%3E`, gb = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'/%3E", _b = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("error", (e) => this.handleError(e), !0);
		for (let e of this.root.querySelectorAll(fb)) (bb(e) || e.complete && e.naturalWidth === 0) && Sb(e);
		for (let e of this.root.querySelectorAll(Jy)) ab(e);
		z(this.root, `${db}, ${Jy}`, {
			childList: !0,
			attributeFilter: ["src", "class"],
			relevant: vb
		}, (e) => {
			for (let t of e) t.classList.contains("ui-image") ? yb(t) : ab(t);
		});
	}
	handleError(e) {
		let t = e.target;
		t instanceof HTMLImageElement && t.matches(fb) && Sb(t);
	}
};
function vb(e) {
	if (e.type === "childList") return !0;
	let t = e.target;
	return t instanceof Element && (e.attributeName === "src" ? t.matches(fb) : t.matches(db));
}
function yb(e) {
	let t = e.querySelector(pb);
	t !== null && (e.hasAttribute("data-ui-image-failed") && (xb(t) ? t.getAttribute("src") !== wb(e) && Cb(e, t) : (e.removeAttribute(it), ub(e, !1))), bb(t) && Sb(t));
}
function bb(e) {
	let t = e.getAttribute("src");
	return t === null || t.trim().length === 0;
}
function xb(e) {
	let t = e.getAttribute("src");
	return t === hb || t === gb;
}
function Sb(e) {
	if (xb(e)) return;
	let t = e.getAttribute(nt);
	if (t !== null && t.length > 0 && e.getAttribute("src") !== t) {
		e.setAttribute("src", t);
		return;
	}
	let n = e.parentElement;
	n === null || !n.classList.contains("ui-image") || (n.setAttribute(it, ""), Cb(n, e));
}
function Cb(e, t) {
	t.setAttribute("src", wb(e)), ub(e, e.classList.contains(tt));
}
function wb(e) {
	return e.classList.contains("ui-image--circle") ? gb : hb;
}
//#endregion
//#region src/items/radio-row-decorator.ts
var Tb = "ui-radio-group__input", Eb = "ui-radio-group__dot", Db = {
	kind: "radio",
	decorate: Ob
};
function Ob(e) {
	let t = document.createElement("input");
	t.className = Tb, t.type = "radio", t.value = e.key;
	let n = document.createElement("span");
	n.className = Eb, e.row.prepend(t, n);
}
//#endregion
//#region src/interactions/radio-group-sync-engine.ts
var kb = "data-ui-radio-value", Ab = "ui-radio-group", jb = "ui-radio-group__item", Mb = "data-ui-radio-group-name", Nb = "data-ui-radio-bind-value-id", Pb = class {
	root;
	renamed = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.claimGroupNames([...this.root.querySelectorAll(`.${Ab}`)]);
		for (let e of this.root.querySelectorAll(`.${Ab}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = [];
			for (let n of e) {
				if (n.type === "attributes" && n.target instanceof HTMLElement) {
					this.sync(n.target.closest(`.${Ab}`));
					continue;
				}
				for (let e of n.addedNodes) e instanceof HTMLElement && t.push(e);
			}
			this.claimGroupNames(t.flatMap(Fb));
			for (let e of new Set(t.map((e) => e.closest(`.${Ab}`)))) this.sync(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: [kb, "class"],
			childList: !0,
			subtree: !0
		});
	}
	claimGroupNames(e) {
		if (e.length === 0) return;
		let t = /* @__PURE__ */ new Map();
		for (let e of this.root.querySelectorAll(`.${Ab}`)) {
			let n = e.getAttribute(Mb);
			n !== null && t.set(n, (t.get(n) ?? 0) + 1);
		}
		let n = /* @__PURE__ */ new Set();
		for (let r of e) {
			let e = r.getAttribute(Mb), i = e === null ? 0 : t.get(e) ?? 0;
			if (e === null || i < 2) continue;
			t.set(e, i - 1), n.add(e);
			let a = `${e}-${++this.renamed}`;
			r.setAttribute(Mb, a);
			for (let e of El(r, `.${Tb}`, `.${Ab}`)) e.name = a;
			this.sync(r);
		}
		if (n.size !== 0) for (let e of this.root.querySelectorAll(`.${Ab}`)) n.has(e.getAttribute(Mb) ?? "") && this.sync(e);
	}
	sync(e) {
		if (e === null) return;
		let t = e.getAttribute(kb), n = e.getAttribute(Mb), r = e.getAttribute(Nb);
		for (let i of El(e, `.${Tb}`, `.${Ab}`)) {
			n !== null && i.name !== n && (i.name = n), r !== null && i.getAttribute("data-ui-bind-value") !== r && i.setAttribute(qe, r), i.checked = i.value === t;
			let e = Ib(i);
			i.disabled !== e && (i.disabled = e);
		}
	}
};
function Fb(e) {
	return e.classList.contains(Ab) ? [e] : [...e.querySelectorAll(`.${Ab}`)];
}
function Ib(e) {
	let t = e.closest(`.${jb}`);
	return t !== null && O(t);
}
//#endregion
//#region src/interactions/search-input-engine.ts
var Lb = "data-ui-search-debounce", Rb = "data-ui-search-min-length", zb = "data-ui-search-manual", Bb = "data-ui-search-answered", Vb = "ui-search__input", Hb = "ui-select__list", Ub = "ui-select__option", Wb = 300, Gb = class {
	root;
	timers = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("compositionend", (e) => this.handleInput(e), !0), this.root.addEventListener("keydown", (e) => this.handleEnter(e), !0);
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Vb) || e instanceof InputEvent && e.isComposing) return;
		let t = e.target;
		qb(t);
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = t.getAttribute(Lb), i = r === null ? Wb : Number(r);
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(i) && i >= 0 ? i : Wb));
	}
	handleEnter(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Enter" || e.defaultPrevented || A(e) || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Vb)) return;
		let t = e.target, n = this.timers.get(t);
		e.preventDefault(), n !== void 0 && (window.clearTimeout(n), this.timers.delete(t)), this.commit(t, !0);
	}
	commit(e, t = !1) {
		e.dispatchEvent(new Event("change", { bubbles: !0 })), !(!t && e.hasAttribute(zb)) && Kb(e) && e.dispatchEvent(new Event("search", { bubbles: !0 }));
	}
};
function Kb(e) {
	let t = Number(e.getAttribute(Rb) ?? 0);
	return !Number.isFinite(t) || e.value.trim().length >= t;
}
function qb(e) {
	if (e.hasAttribute(Bb)) return;
	let t = e.closest(`.${pi}`), n = t?.querySelector(`.${Hb}`);
	if (t == null || n == null) return;
	let r = Kb(e) ? Nm(e.value, e) : [], i = Jb(n, (e) => r.length === 0 || Fm(Pm(Rm(e), e), r));
	Zb(t, n, r.length > 0 && i === 0);
}
function Jb(e, t) {
	let n = null, r = !1, i = 0;
	for (let a of e.children) {
		if (!(a instanceof HTMLElement)) continue;
		if (a.hasAttribute("data-ui-group-header")) {
			n !== null && Yb(n, r), n = a, r = !1;
			continue;
		}
		if (!a.classList.contains(Ub)) continue;
		let e = t(a);
		Yb(a, e), r ||= e, e && i++;
	}
	return n !== null && Yb(n, r), i;
}
function Yb(e, t) {
	let n = t ? "" : "none";
	e.style.display !== n && (e.style.display = n);
}
function Xb(e) {
	let t = e.querySelector(`.${Hb}`);
	t !== null && Zb(e, t, Jb(t, (e) => e.style.display !== "none") === 0);
}
function Zb(e, t, n) {
	let r = t.querySelector(`:scope > [${St}]`);
	if (!n) {
		r?.remove();
		return;
	}
	if (r !== null) return;
	let i = e.querySelector(`:scope > template[${bt}]`);
	if (i === null) return;
	let a = i.content.cloneNode(!0).firstElementChild;
	a !== null && (a.setAttribute(St, ""), t.appendChild(a));
}
//#endregion
//#region src/interactions/type-ahead.ts
var Qb = 500, $b = class {
	owner = null;
	typed = "";
	last = -Infinity;
	now;
	constructor(e = () => performance.now()) {
		this.now = e;
	}
	next(e) {
		let t = this.now();
		(e.owner !== this.owner || t - this.last > Qb) && (this.typed = ""), this.owner = e.owner, this.last = t, this.typed += Pm(e.character, e.context);
		let n = Array.from(this.typed), r = n.every((e) => e === n[0]), i = r ? n[0] : this.typed, a = e.entries.length, o = e.current === null ? -1 : e.entries.indexOf(e.current), s = r ? o + 1 : Math.max(o, 0);
		for (let t = 0; t < a; t++) {
			let n = e.entries[(s + t) % a];
			if (Pm(e.words(n), e.context).trimStart().startsWith(i)) return n;
		}
		return null;
	}
};
function ex(e) {
	return A(e) || e.metaKey || Array.from(e.key).length !== 1 || !/\S/u.test(e.key) || (e.ctrlKey || e.altKey) && !e.getModifierState("AltGraph") ? null : e.key;
}
//#endregion
//#region src/interactions/select-interaction-engine.ts
var tx = "data-ui-select-value", nx = "data-ui-select-placement", rx = "ui-select--open", ix = "ui-select__trigger-content", ax = "data-ui-select-content", ox = "ui-select__placeholder", sx = "ui-input__affix-icon--prefix", cx = "ui-select__popup", lx = "ui-select__list", ux = "ui-select__option", dx = "ui-select__value-input", fx = "data-ui-select-clear", px = "ui-search", mx = "ui-search__input", hx = "data-ui-active", gx = "data-ui-list-keyboard", _x = /* @__PURE__ */ new Set([
	"ArrowDown",
	"ArrowUp",
	"Home",
	"End",
	"PageDown",
	"PageUp"
]), vx = "ui-multi-select", yx = "ui-multi-select__chips", bx = "ui-multi-select__chip", xx = "ui-multi-select__chip-label", Sx = "ui-multi-select__chip-remove", Cx = "data-ui-select-chip", wx = "data-ui-select-chips", Tx = "data-ui-select-max", Ex = "data-ui-select-free-text", Dx = "ui-multi-select__entry", Ox = "data-ui-select-tag-entry", kx = [
	tx,
	Gr,
	Tx,
	"class",
	y
];
function Ax(e) {
	return e === null || k(e) || D(e);
}
function jx(e) {
	return e.classList.contains(vx);
}
function Mx(e) {
	return e.classList.contains(px);
}
function Nx(e) {
	return Mx(e) ? e.querySelector(`.${mx}`) : null;
}
function Px(e) {
	return e.hasAttribute(Ex) ? e.querySelector(`:scope > .${li} .${Dx}`) : null;
}
function Fx(e) {
	return Nx(e) ?? Px(e);
}
function Ix(e) {
	return Px(e) ?? e.querySelector(".ui-select__trigger");
}
function Lx(e) {
	let t = e.target instanceof HTMLInputElement && e.target.classList.contains(Dx) ? e.target : null, n = t?.closest(".ui-select") ?? null;
	return t === null || n === null ? null : {
		entry: t,
		select: n
	};
}
function Rx(e) {
	return El(e, `.${cx} .${ux}`, `.${pi}`);
}
function zx(e) {
	let t = Rx(e).filter((e) => !O(e));
	return t.find((e) => e === document.activeElement) ?? t.find((e) => e.hasAttribute(hx)) ?? null;
}
function Bx(e) {
	for (let t of El(e, `.${lx}`, `.${pi}`)) {
		let e = t.querySelector(`:scope > .${ux}[${hx}]:not([${Rr}])`) !== null;
		t.hasAttribute(gx) !== e && t.toggleAttribute(gx, e);
	}
}
function Vx(e) {
	return e === null ? null : Rm(e);
}
function Hx(e) {
	for (let t of [e, ...e.querySelectorAll("*")]) {
		t.removeAttribute(re), t.removeAttribute(y), t.removeAttribute(ae), t.removeAttribute(ie);
		for (let e of [...t.attributes]) e.name.startsWith("data-ui-bind-") && t.removeAttribute(e.name);
	}
}
var Ux = class {
	root;
	popups = new Jh({
		show: ({ owner: e }) => e.classList.add(rx),
		hide: ({ owner: e }) => {
			e.classList.remove(rx), this.markActive(e, null);
			let t = e.querySelector(`.${cx}`);
			t !== null && (t.style.minHeight = "");
		},
		closesOnTab: !0,
		sheetOnPhone: ({ owner: e }) => Fx(e) === null
	});
	typeAhead = new $b();
	drawnKeys = /* @__PURE__ */ new WeakMap();
	validation;
	refusedEntries = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation;
		for (let e of this.root.querySelectorAll(`.${pi}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = /* @__PURE__ */ new Set();
			for (let n of e) eS(n, t);
			for (let e of t) this.sync(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: kx,
			childList: !0,
			characterData: !0,
			subtree: !0
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && (e.target.closest(`[${fx}], .${Sx}`) !== null || Yx(e.target)) && e.preventDefault();
		}, !0), window.addEventListener("input", (e) => this.handleEntryEdit(e), !0), window.addEventListener("compositionend", (e) => this.handleEntryEdit(e), !0), window.addEventListener("change", (e) => this.holdEntryDraft(e), !0), window.addEventListener("keydown", (e) => this.handleEntryEscape(e), !0), this.root.addEventListener("paste", (e) => this.handleEntryPaste(e), !0);
	}
	handleEntryEdit(e) {
		let t = this.holdEntryDraft(e);
		if (t === null || e.isComposing === !0) return;
		let { entry: n, select: r } = t;
		if (Ax(r)) return;
		this.releaseRefusal(r);
		let i = wl(n.value);
		i.tags.length > 0 ? this.enterTyped(r, n, i.tags, i.rest) : this.suggest(r, n);
	}
	holdEntryDraft(e) {
		let t = Lx(e);
		return t === null || this.root instanceof Node && !this.root.contains(t.select) ? null : (e.stopImmediatePropagation(), t);
	}
	handleEntryEscape(e) {
		let t = e instanceof KeyboardEvent && e.key === "Escape" && !e.defaultPrevented && !A(e) ? Lx(e) : null;
		t === null || this.openSelect !== t.select || t.select.getAttribute(Ox) !== "first-suggestion" || !Rx(t.select).some((e) => e.hasAttribute(hx)) || (e.preventDefault(), this.markActive(t.select, null));
	}
	handleEntryPaste(e) {
		let t = Lx(e), n = e.clipboardData?.getData("text") ?? "";
		if (t === null || Ax(t.select) || !Sl(n)) return;
		let { entry: r, select: i } = t, a = r.selectionStart ?? r.value.length, o = r.selectionEnd ?? a;
		e.preventDefault(), this.releaseRefusal(i), this.enterTyped(i, r, Cl(r.value.slice(0, a) + n + r.value.slice(o)), "");
	}
	enterTyped(e, t, n, r) {
		let i = gl(e.getAttribute(Gr)), a = _l(e.getAttribute(Tx)), o = Tl(i, n.map((t) => ({
			text: t,
			key: Xx(e, t) ?? t
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
		qb(t);
		let n = t.value.trim().length > 0, r = n ? Gx(e) : [], i = r.find((e) => e.getAttribute("aria-selected") !== "true") ?? null;
		this.openSelect === e ? r.length > 0 || !n ? this.popups.reposition(e) : this.close() : r.length > 0 && this.toggle(e, !0), this.openSelect === e && e.getAttribute(Ox) === "first-suggestion" && (this.markActive(e, i), i !== null && qx(e, i));
	}
	get openSelect() {
		return this.popups.current;
	}
	sync(e) {
		if (Bx(e), jx(e)) {
			this.syncMultiple(e);
			return;
		}
		let t = e.getAttribute(tx);
		this.decorateOptions(e);
		let n = t === null ? null : Rx(e).find((e) => e.getAttribute("data-ui-key") === t) ?? null, r = this.renderTriggerContent(e, n, t), i = e.querySelector(`.${ox}`);
		i !== null && (i.style.display = r ? "none" : "");
		for (let n of Rx(e)) n.setAttribute("aria-selected", t !== null && n.dataset.uiKey === t ? "true" : "false");
		let a = e.querySelector(`.${dx}`);
		a !== null && a.value !== (t ?? "") && (a.value = t ?? ""), Xb(e);
	}
	syncMultiple(e) {
		let t = gl(e.getAttribute(Gr)), n = new Set(t), r = vl(t, _l(e.getAttribute(Tx)));
		this.decorateOptions(e, (e) => r && !n.has(e.dataset.uiKey ?? ""));
		let i = Rx(e), a = new Map(i.map((e) => [e.dataset.uiKey ?? "", e])), o = Px(e), s = o === null ? t.filter((e) => a.has(e)) : t;
		Qx(e, s.map((e) => ({
			key: e,
			label: Zx(a.get(e) ?? null, e)
		}))), o !== null && o.readOnly !== Ax(e) && (o.readOnly = Ax(e));
		let c = e.querySelector(`.${ox}`);
		c !== null && (c.style.display = s.length > 0 ? "none" : "");
		for (let e of i) e.setAttribute("aria-selected", n.has(e.dataset.uiKey ?? "") ? "true" : "false");
		let l = e.querySelector(`.${dx}`), u = JSON.stringify(t);
		l !== null && l.getAttribute("data-ui-selected-keys") !== u && l.setAttribute(Gr, u), Xb(e);
	}
	renderTriggerContent(e, t, n) {
		let r = e.querySelector(`.${li}`);
		if (r === null) return t !== null;
		let i = r.querySelector(`:scope > .${ix}`), a = i?.getAttribute(ax) ?? null;
		if (i !== null && a !== null && (i.removeAttribute(ax), this.drawnKeys.set(e, a)), t === null) return i !== null && n !== null && Mx(e) && this.drawnKeys.get(e) === n ? !0 : (i?.remove(), this.drawnKeys.delete(e), !1);
		let o = t.getAttribute(y);
		if (o === null ? this.drawnKeys.delete(e) : this.drawnKeys.set(e, o), i !== null && o !== null && a === o) return !0;
		if (i === null) {
			i = document.createElement("span"), i.className = ix;
			let e = r.querySelector(`:scope > .${sx}`);
			e === null ? r.prepend(i) : e.after(i);
		}
		i.style.display = "inline-flex";
		let s = t.cloneNode(!0);
		return Hx(s), i.replaceChildren(...s.childNodes), !0;
	}
	decorateOptions(e, t = () => !1) {
		for (let n of Rx(e)) {
			n.hasAttribute("role") || n.setAttribute("role", "option");
			let e = O(n), r = e || t(n) ? "true" : "false";
			n.getAttribute("aria-disabled") !== r && n.setAttribute("aria-disabled", r), (e ? n.tabIndex !== -1 : !n.hasAttribute("tabindex")) && (n.tabIndex = -1);
		}
	}
	handlePointerMove(e) {
		let t = this.openSelect, n = t === null || !(e.target instanceof Element) ? null : e.target.closest(`.${ux}`);
		t === null || n === null || n.hasAttribute(hx) || O(n) || D(n) || n.closest(".ui-select") !== t || (Fx(t) === null && (M(Rx(t).filter((e) => !O(e)), n), Ed(n)), this.markActive(t, n, !0));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Sx}`);
		if (t !== null) {
			let n = t.closest(`.${pi}`);
			n !== null && (e.preventDefault(), e.stopPropagation(), Ax(n) || this.removeChosen(n, t.closest(`.${bx}`)?.getAttribute(Cx) ?? null));
			return;
		}
		let n = e.target.closest(`[${fx}]`);
		if (n !== null) {
			let t = n.closest(`.${pi}`);
			t !== null && (e.preventDefault(), e.stopPropagation(), Ax(t) || (this.clearValue(t), Wx(t)));
			return;
		}
		let r = e.target.closest(`.${li}`);
		if (r !== null) {
			let t = r.closest(`.${pi}`);
			if (Ax(t)) return;
			e.preventDefault();
			let n = t === null ? null : Px(t);
			t !== null && n !== null ? this.pressEntryBox(t, n, e.target === n) : this.toggle(t);
			return;
		}
		let i = e.target.closest(`.${ux}`);
		if (i === null) return;
		let a = i.closest(`.${pi}`);
		a !== null && this.choose(a, i);
	}
	pressEntryBox(e, t, n) {
		document.activeElement !== t && t.focus(), !(Rx(e).length === 0 || n && this.openSelect === e) && this.toggle(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || A(e) || (this.openSelect !== null && Bx(this.openSelect), this.handleEntryKey(e) || this.handleChipKey(e)) || this.openSelect !== null && e.target instanceof Node && this.openSelect.contains(e.target) && this.handleOpenListKey(e, this.openSelect) || (e.key === "ArrowDown" || e.key === "ArrowUp") && j(e, { alt: e.key === "ArrowDown" }) && this.handleClosedArrow(e) || this.handleTypeAhead(e) || this.handleMultipleTriggerKey(e) || e.key !== "Enter" && e.key !== " " || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${ux}`) ?? this.markedOption(e);
		if (t === null) return;
		let n = t.closest(`.${pi}`);
		n !== null && (e.preventDefault(), this.choose(n, t));
	}
	handleOpenListKey(e, t) {
		if (e.key === "ArrowUp" && e.altKey && j(e, { alt: !0 })) {
			e.preventDefault();
			let n = zx(t);
			return n !== null && !jx(t) ? this.choose(t, n) : this.close(), !0;
		}
		return !_x.has(e.key) || !j(e) || (e.key === "Home" || e.key === "End") && Uc(e.target) ? !1 : (e.preventDefault(), this.moveCurrent(t, e.key), !0);
	}
	handleEntryKey(e) {
		let t = Lx(e);
		if (t === null) return !1;
		let { entry: n, select: r } = t;
		if (Ax(r)) return !1;
		switch (e.key) {
			case "ArrowLeft": return n.selectionStart === 0 && n.selectionEnd === 0 && this.focusChip(e, r, -1);
			case "ArrowDown":
			case "ArrowUp": return e.preventDefault(), this.openSelect === r ? this.moveCurrent(r, e.key) : this.openSuggestions(r, n, e.key === "ArrowDown"), !0;
			case "Enter": {
				let t = this.openSelect === r ? Gx(r).find((e) => e.hasAttribute(hx)) : void 0;
				return t === void 0 ? (e.preventDefault(), n.value.trim().length === 0 ? (this.pressEntryBox(r, n, !1), !0) : (this.releaseRefusal(r), this.enterTyped(r, n, Cl(n.value), ""), !0)) : (e.preventDefault(), this.choose(r, t), !0);
			}
			case ",": return e.preventDefault(), this.releaseRefusal(r), this.enterTyped(r, n, Cl(n.value), ""), !0;
			case "Backspace": {
				if (n.value.length > 0) return !1;
				let t = r.querySelectorAll(`.${yx} > .${bx}`);
				return t.length !== 0 && (e.preventDefault(), this.removeChosen(r, t[t.length - 1].getAttribute(Cx)), !0);
			}
			default: return !1;
		}
	}
	focusChip(e, t, n, r = null) {
		let i = Jx(t);
		if (i.length === 0) return !1;
		let a = i[(r === null ? i.length : i.findIndex((e) => e.contains(r))) + n]?.querySelector(`.${Sx}`) ?? (n === 1 ? Ix(t) : null);
		return e.preventDefault(), a === null || (a.focus(), a instanceof HTMLInputElement && a.setSelectionRange(0, 0), !0);
	}
	openSuggestions(e, t, n) {
		qb(t);
		let r = Gx(e), i = (n ? r[0] : r[r.length - 1]) ?? null;
		i !== null && this.toggle(e, !0, i);
	}
	handleChipKey(e) {
		let t = e.target instanceof HTMLElement && e.target.classList.contains(Sx) ? e.target : null, n = t?.closest(".ui-select") ?? null;
		if (t === null || n === null || !jx(n)) return !1;
		switch (e.key) {
			case "ArrowLeft": return this.focusChip(e, n, -1, t);
			case "ArrowRight": return this.focusChip(e, n, 1, t);
			case "Backspace":
			case "Delete": {
				if (e.preventDefault(), Ax(n)) return !0;
				let r = Jx(n), i = r.findIndex((e) => e.contains(t)), a = (r[i + 1] ?? r[i - 1])?.getAttribute(Cx) ?? null;
				this.removeChosen(n, r[i]?.getAttribute(Cx) ?? null);
				let o = a === null ? null : Jx(n).find((e) => e.getAttribute(Cx) === a) ?? null;
				return o !== null && o.querySelector(`.${Sx}`)?.focus(), !0;
			}
			default: return !1;
		}
	}
	handleClosedArrow(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || t === this.openSelect || Ax(t)) return !1;
		e.preventDefault();
		let n = Nx(t);
		n !== null && qb(n);
		let r = Gx(t), i = r.find((e) => e.getAttribute("aria-selected") === "true") ?? (e.key === "ArrowDown" ? r[0] : r[r.length - 1]) ?? null;
		return this.toggle(t, !1, i), !0;
	}
	handleTypeAhead(e) {
		let t = ex(e), n = e.target instanceof HTMLElement ? e.target : null;
		if (t === null || n === null || !(n.classList.contains("ui-select__trigger") || n.classList.contains(ux))) return !1;
		let r = n.closest(`.${pi}`), i = r !== null && r === this.openSelect;
		if (r === null || Ax(r) || !i && !n.classList.contains("ui-select__trigger")) return !1;
		let a = Nx(r);
		if (a !== null) return !i && (e.preventDefault(), this.typeIntoSearch(r, a, t), !0);
		e.preventDefault();
		let o = Gx(r), s = i ? o.find((e) => e === document.activeElement) ?? o.find((e) => e.hasAttribute(hx)) ?? null : o.find((e) => e.getAttribute("aria-selected") === "true") ?? null, c = this.typeAhead.next({
			owner: r,
			character: t,
			entries: o,
			current: s,
			words: (e) => Vx(e) ?? "",
			context: r
		});
		return c === null ? !0 : i ? (M(Rx(r).filter((e) => !O(e)), c), qx(r, c), L(c), this.markActive(r, c), !0) : (this.toggle(r, !1, c), !0);
	}
	typeIntoSearch(e, t, n) {
		this.toggle(e, !0), this.openSelect === e && (t.value = n, t.setSelectionRange(n.length, n.length), t.dispatchEvent(new Event("input", { bubbles: !0 })));
	}
	handleMultipleTriggerKey(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || !jx(t) || Ax(t)) return !1;
		switch (e.key) {
			case "Enter":
			case " ": return e.preventDefault(), this.toggle(t), !0;
			case "ArrowLeft": return this.focusChip(e, t, -1);
			case "Backspace": {
				let n = t.querySelectorAll(`.${yx} > .${bx}`);
				return n.length !== 0 && (e.preventDefault(), this.removeChosen(t, n[n.length - 1].getAttribute(Cx)), !0);
			}
			default: return !1;
		}
	}
	markedOption(e) {
		let t = this.openSelect;
		return e.key !== "Enter" || t === null || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(mx) || !t.contains(e.target) ? null : Gx(t).find((e) => e.hasAttribute(hx)) ?? null;
	}
	toggle(e, t = !1, n = null) {
		if (e === null) return;
		if (this.openSelect === e) {
			this.close();
			return;
		}
		this.close();
		let r = Fx(e), i = Px(e);
		r !== null && !t && qb(r), Xb(e);
		let a = e.querySelector(`.${li}`), o = e.querySelector(`.${cx}`), s = e.querySelector(`.${lx}`) ?? o, c = e.getAttribute(nx);
		if (a === null || o === null || s === null) return;
		let l = Di(s, "ui-select-list");
		if (i === null && a.setAttribute("aria-controls", l), r?.setAttribute("aria-controls", l), this.popups.open({
			owner: e,
			popup: o,
			anchor: a,
			placement: {
				placement: c !== null && op(c) ? c : "bottom-start",
				minAnchorWidth: !0
			},
			openers: i === null ? r === null ? [a] : [a, r] : [i],
			returnFocus: () => i ?? a
		})) {
			if (r === null) {
				this.initializeFocus(e, n);
				return;
			}
			i === null ? this.initializeSearch(e, r, n, t) : this.initializeEntry(e, n), tS(o);
		}
	}
	close() {
		this.popups.close();
	}
	initializeFocus(e, t) {
		let n = Gx(e);
		if (n.length === 0) return;
		let r = t ?? n.find((e) => e.getAttribute("aria-selected") === "true");
		if (r === void 0 && yd()) {
			M(n, null), this.markActive(e, null), Wx(e);
			return;
		}
		let i = r ?? n[0];
		M(n, i), this.markActive(e, i, yd()), qx(e, i), L(i);
	}
	initializeSearch(e, t, n, r) {
		let i = Rx(e), a = Gx(e), o = (r ? void 0 : n ?? a.find((e) => e.getAttribute("aria-selected") === "true")) ?? (r || yd() ? null : a[0] ?? null);
		M(i, null), this.markActive(e, o, yd()), o !== null && qx(e, o), !bd() && (L(t), t.select());
	}
	initializeEntry(e, t) {
		M(Rx(e), null), this.markActive(e, t), t !== null && qx(e, t);
	}
	moveCurrent(e, t) {
		let n = Rx(e).filter((e) => !O(e)), r = Uu(t, n, zx(e), "vertical");
		r !== null && (Fx(e) === null ? sl(n, r) : qx(e, r), this.markActive(e, r));
	}
	markActive(e, t, n = !1) {
		for (let r of Rx(e)) r === t ? r.setAttribute(hx, "") : r.hasAttribute(hx) && r.removeAttribute(hx), xd(r, r === t && n);
		Bx(e);
		let r = Fx(e);
		r !== null && (t === null ? r.removeAttribute("aria-activedescendant") : r.setAttribute("aria-activedescendant", Di(t, "ui-select-option")));
	}
	choose(e, t) {
		let n = t.dataset.uiKey;
		if (n === void 0 || O(t) || Ax(e)) return;
		if (jx(e)) {
			let r = yl(gl(e.getAttribute(Gr)), n, _l(e.getAttribute(Tx)));
			this.markActive(e, t, yd()), r !== null && this.writeChosen(e, r);
			let i = Px(e);
			i !== null && i.value.length > 0 && (i.value = "", this.releaseRefusal(e), this.suggest(e, i));
			return;
		}
		if (e.getAttribute(tx) === n) {
			this.close();
			return;
		}
		e.setAttribute(tx, n), this.sync(e);
		let r = e.querySelector(`.${dx}`);
		r !== null && (r.value = n, r.dispatchEvent(new Event("change", { bubbles: !0 }))), this.close();
	}
	removeChosen(e, t) {
		let n = t === null ? null : bl(gl(e.getAttribute(Gr)), t);
		if (n === null) return;
		let r = document.activeElement instanceof HTMLElement && document.activeElement.closest(`.${bx}`) !== null;
		this.writeChosen(e, n), (r || document.activeElement === document.body) && Ix(e)?.focus();
	}
	writeChosen(e, t) {
		t.length === 0 ? e.removeAttribute(Gr) : e.setAttribute(Gr, JSON.stringify(t)), this.sync(e), this.popups.reposition(e), e.querySelector(`.${dx}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	clearValue(e) {
		if (jx(e)) {
			e.hasAttribute("data-ui-selected-keys") && this.writeChosen(e, []);
			return;
		}
		if (!e.hasAttribute(tx)) return;
		e.removeAttribute(tx), this.sync(e);
		let t = e.querySelector(`.${dx}`);
		t !== null && (t.value = "", t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
};
function Wx(e) {
	let t = e.querySelector(`.${li}`), n = Ix(e);
	t !== null && n !== null && !t.contains(document.activeElement) && L(n);
}
function Gx(e) {
	return Rx(e).filter((e) => Kx(e) && !O(e) && !D(e));
}
function Kx(e) {
	return e.style.display !== "none" && !e.classList.contains("ui-hidden");
}
function qx(e, t) {
	let n = e.querySelector(`.${lx}`);
	if (n === null) return;
	let r = n.getBoundingClientRect(), i = t.getBoundingClientRect(), a = getComputedStyle(n), o = r.top + (Number.parseFloat(a.borderTopWidth) || 0), s = o + (Number.parseFloat(a.paddingTop) || 0), c = o + n.clientHeight - (Number.parseFloat(a.paddingBottom) || 0);
	i.top < s ? n.scrollTop -= s - i.top : i.bottom > c && (n.scrollTop += i.bottom - c);
}
function Jx(e) {
	return [...e.querySelectorAll(`.${yx} > .${bx}`)];
}
function Yx(e) {
	let t = e.closest(".ui-select__trigger")?.closest(".ui-select") ?? null;
	return t !== null && Px(t) !== null && !e.classList.contains(Dx);
}
function Xx(e, t) {
	let n = t.trim().toLocaleLowerCase();
	for (let t of Rx(e)) {
		let e = t.dataset.uiKey;
		if (e !== void 0 && !O(t) && (e.toLocaleLowerCase() === n || Vx(t)?.trim().toLocaleLowerCase() === n)) return e;
	}
	return null;
}
function Zx(e, t) {
	let n = Vx(e)?.trim() ?? "";
	return n.length > 0 ? n : t;
}
function Qx(e, t) {
	let n = e.querySelector(`.${yx}`);
	if (n === null) return;
	n.hasAttribute(wx) !== t.length > 0 && n.toggleAttribute(wx, t.length > 0);
	let r = [...n.querySelectorAll(`:scope > .${bx}`)];
	if (!(r.length === t.length && r.every((e, n) => e.getAttribute(Cx) === t[n].key && e.querySelector(`.${xx}`)?.textContent === t[n].label))) {
		for (let e of r) e.remove();
		n.prepend(...t.map((e) => $x(e.key, e.label)));
	}
}
function $x(e, t) {
	let n = document.createElement("span"), r = document.createElement("span"), i = document.createElement("button");
	return n.className = bx, n.setAttribute(Cx, e), r.className = xx, r.textContent = t, i.className = Sx, i.type = "button", i.tabIndex = -1, E.write(i, "aria-label", "ui.select.remove", { label: t }), n.append(r, i), n;
}
function eS(e, t) {
	if (e.type === "childList") {
		for (let n of e.addedNodes) if (n instanceof HTMLElement) {
			n.classList.contains("ui-select") && t.add(n);
			for (let e of n.querySelectorAll(`.${pi}`)) t.add(e);
		}
	}
	if (e.type === "attributes" && (e.attributeName === tx || e.attributeName === "data-ui-selected-keys" || e.attributeName === Tx)) {
		e.target instanceof HTMLElement && e.target.classList.contains("ui-select") && t.add(e.target);
		return;
	}
	let n = (e.target instanceof HTMLElement ? e.target : e.target.parentElement)?.closest(`.${cx}`)?.closest(`.${pi}`);
	n != null && t.add(n);
}
function tS(e) {
	e.dataset.uiPlacement?.startsWith("top") === !0 && (e.style.minHeight = `${e.offsetHeight}px`);
}
//#endregion
//#region src/interactions/commit-gate.ts
var nS = class {
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
		!Uc(t) || !this.root.contains(t) || (this.field = t, this.committed = t.value);
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
}, rS = "textarea.ui-text-area__field", iS = "data-ui-text-area-grow";
function aS() {
	return typeof CSS < "u" && CSS.supports("field-sizing", "content");
}
var oS = class {
	root;
	widths = /* @__PURE__ */ new WeakMap();
	observer;
	constructor(e = {}) {
		this.root = e.root ?? document, this.observer = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null, this.root.addEventListener("input", (e) => {
			e.target instanceof HTMLTextAreaElement && e.target.matches(rS) && this.fit(e.target);
		}, !0), this.fitAll(this.root.querySelectorAll(rS)), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.fitAll(pa(e.components, rS));
		}), z(this.root, rS, {
			childList: !0,
			attributeFilter: [iS]
		}, (e) => {
			this.fitAll(pa(e, rS));
		});
	}
	fitAll(e) {
		for (let t of e) this.fit(t);
	}
	fit(e) {
		if (!e.hasAttribute(iS)) {
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
function sS(e) {
	let t = cS(e.getAttribute("min"), 0), n = cS(e.getAttribute("max"), 100), r = e.getAttribute("step");
	return {
		min: t,
		max: Math.max(t, n),
		step: r === "any" ? 0 : Math.max(0, cS(r, 1))
	};
}
function cS(e, t) {
	let n = e === null || e.trim().length === 0 ? NaN : Number(e);
	return Number.isFinite(n) ? n : t;
}
function lS(e, t, n, r) {
	let i = (n ? e.height : e.width) - r;
	if (i <= 0) return 0;
	let a = n ? e.top + e.height - t.y : t.x - e.left;
	return Math.min(1, Math.max(0, (a - r / 2) / i));
}
function uS(e, t) {
	return dS(t.min + e * (t.max - t.min), t);
}
function dS(e, t) {
	let n = Math.min(t.max, Math.max(t.min, e));
	if (t.step <= 0) return n;
	let r = Math.round((n - t.min) / t.step);
	return t.min + r * t.step > t.max && r--, fS(t.min + r * t.step, t);
}
function fS(e, t) {
	return Number(e.toFixed(Math.min(20, Math.max(pS(t.step), pS(t.min)))));
}
function pS(e) {
	let t = String(e), n = t.indexOf("e-");
	if (n >= 0) return Number(t.slice(n + 2));
	let r = t.indexOf(".");
	return r < 0 ? 0 : t.length - r - 1;
}
function mS(e, t, n) {
	return t === n ? e < t ? "start" : e > t ? "end" : null : Math.abs(e - t) < Math.abs(e - n) ? "start" : "end";
}
function hS(e, t, n, r, i) {
	let a = Math.max(0, r);
	if (t === "start" ? e <= n - a : e >= n + a) return e;
	let o = t === "start" ? n - a : n + a;
	if (i.step <= 0) return gS(o, i);
	let s = (o - i.min) / i.step;
	return gS(fS(i.min + (t === "start" ? Math.floor(s + 1e-9) : Math.ceil(s - 1e-9)) * i.step, i), i);
}
function gS(e, t) {
	return Math.min(t.max, Math.max(t.min, e));
}
//#endregion
//#region src/interactions/range-value-engine.ts
var _S = "ui-slider__input", vS = "ui-slider__input--end", yS = "ui-slider__input--held", bS = "ui-slider__value", xS = "ui-slider__bubble", SS = "ui-slider__track", CS = "ui-slider__thumb-anchor", wS = "ui-slider", TS = "ui-slider--range", ES = "ui-orientation--vertical", DS = "--ui-slider-fraction", OS = "--ui-slider-end-fraction", kS = 6, AS = "Value", jS = "EndValue", MS = /* @__PURE__ */ new Set([
	"Value",
	"EndValue",
	"Min",
	"Max"
]), NS = class {
	options;
	root;
	settled = /* @__PURE__ */ new WeakMap();
	pressedFrom = /* @__PURE__ */ new WeakMap();
	cancelled = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("pointerdown", (e) => {
			this.notePress(e.target), this.placeBubble(e.target);
		}, !0), this.root.addEventListener("pointercancel", (e) => this.takeBackPress(e.target), !0), (this.root === document ? window : this.root).addEventListener("change", (e) => this.refuseCancelledChange(e), !0), this.root.addEventListener("focusin", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusout", (e) => this.releaseBubble(e.target), !0), new zm({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${TS} .${SS}`),
			begin: (e, t) => this.beginBandDrag(e, t),
			move: (e, t, n) => this.moveBandDrag(e, n),
			end: (e, t) => this.endBandDrag(t),
			cancel: (e, t) => this.putBandBack(t),
			takenBack: (e, t) => this.putBandBack(t)
		}), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			if (MS.has(e.propertyName)) for (let t of pa(e.components, `.${_S}`)) this.settled.set(t, t.value), this.writeReadings(t), e.propertyName === (FS(t) ? jS : AS) && this.reportClamped(t, e.value);
		});
	}
	notePress(e) {
		let t = PS(e);
		t !== null && (this.cancelled.delete(t), this.pressedFrom.set(t, t.value));
	}
	takeBackPress(e) {
		let t = PS(e), n = t === null ? void 0 : this.pressedFrom.get(t);
		t !== null && n !== void 0 && (this.pressedFrom.delete(t), t.value !== n && (t.value = n, this.cancelled.add(t), this.settled.set(t, n), this.writeReadings(t)));
	}
	refuseCancelledChange(e) {
		let t = PS(e.target);
		t === null || !this.cancelled.has(t) || (this.cancelled.delete(t), e.stopImmediatePropagation());
	}
	reportClamped(e, t) {
		t == null || e.value === String(t) || RS(e) || e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(_S)) return;
		let t = e.target;
		if (this.cancelled.delete(t), RS(t)) {
			t.value = this.settled.get(t) ?? t.defaultValue;
			return;
		}
		let n = IS(t);
		if (n !== null) {
			let e = LS(t, Number(t.value), n);
			e !== t.value && (t.value = e, e === (this.settled.get(t) ?? t.defaultValue) && this.cancelled.add(t));
		}
		this.settled.set(t, t.value), this.writeReadings(t);
	}
	beginBandDrag(e, t) {
		let n = e.querySelector(`.${_S}:not(.${vS})`), r = e.querySelector(`.${vS}`);
		if (n === null || r === null) return null;
		let i = uS(lS(e.getBoundingClientRect(), t, zS(e), BS(e)), sS(n)), a = mS(i, Number(n.value), Number(r.value));
		if (RS(n)) return L(a === "end" ? r : n), null;
		let o = {
			start: n,
			end: r,
			from: [n.value, r.value],
			pressed: i,
			held: null
		};
		return a === null ? L(n) : this.holdHandle(o, a, i), o;
	}
	moveBandDrag(e, t) {
		let n = e.start.closest(`.${SS}`);
		if (n === null) return;
		let r = uS(lS(n.getBoundingClientRect(), t, zS(n), BS(n)), sS(e.start));
		if (e.held === null) {
			if (r === e.pressed) return;
			this.holdHandle(e, r < e.pressed ? "start" : "end", r);
			return;
		}
		this.moveHandle(e.held, r);
	}
	holdHandle(e, t, n) {
		let r = t === "start" ? e.start : e.end;
		e.held = r, r.classList.add(yS), L(r), this.moveHandle(r, n), this.placeBubble(r);
	}
	moveHandle(e, t) {
		let n = IS(e), r = n === null ? String(t) : LS(e, t, n);
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
		e.held?.classList.remove(yS), e.held !== null && this.writeReadings(e.held);
	}
	placeBubble(e) {
		let t = VS(e);
		t !== null && _p(t.anchor, t.bubble, {
			placement: t.vertical ? "left" : "top",
			gap: kS
		});
	}
	releaseBubble(e) {
		kp(VS(e)?.bubble);
	}
	writeReadings(e) {
		let t = FS(e), n = e.closest(`.${SS}`)?.parentElement ?? e.parentElement, r = t ? `.${bS}--end, .${xS}--end` : `.${bS}:not(.${bS}--end), .${xS}:not(.${xS}--end)`;
		for (let t of n?.querySelectorAll(r) ?? []) t.textContent = e.value;
		e.closest(`.${SS}`)?.style.setProperty(t ? OS : DS, String(HS(e))), e.matches(`:active, :focus-visible, .${yS}`) ? this.placeBubble(e) : this.releaseBubble(e);
	}
};
function PS(e) {
	return e instanceof HTMLInputElement && e.classList.contains(_S) ? e : null;
}
function FS(e) {
	return e.classList.contains(vS);
}
function IS(e) {
	return e.closest(`.${TS} .${SS}`)?.querySelector(FS(e) ? `.${_S}:not(.${vS})` : `.${vS}`) ?? null;
}
function LS(e, t, n) {
	let r = Number(e.closest(`.${wS}`)?.getAttribute("data-ui-slider-min-distance") ?? 0);
	return String(hS(t, FS(e) ? "end" : "start", Number(n.value), Number.isFinite(r) ? r : 0, sS(e)));
}
function RS(e) {
	return k(e) || D(e);
}
function zS(e) {
	return e.closest(`.${wS}`)?.classList.contains(ES) === !0;
}
function BS(e) {
	let t = e.querySelector(`.${CS}`)?.getBoundingClientRect();
	return t === void 0 ? 0 : zS(e) ? t.height : t.width;
}
function VS(e) {
	if (!(e instanceof Element) || !e.classList.contains(_S)) return null;
	let t = e.closest(`.${SS}`), n = FS(e), r = t?.querySelector(n ? `.${xS}--end` : `.${xS}:not(.${xS}--end)`) ?? null, i = t?.querySelector(n ? `.${CS}--end` : `.${CS}:not(.${CS}--end)`) ?? null;
	return r === null || i === null ? null : {
		bubble: r,
		anchor: i,
		vertical: zS(e)
	};
}
function HS(e) {
	let { min: t, max: n } = sS(e), r = Number(e.value);
	return !Number.isFinite(r) || n <= t ? 0 : Math.min(1, Math.max(0, (r - t) / (n - t)));
}
//#endregion
//#region src/rendering/number-format.ts
var US = {
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
}, WS = [
	"(n)",
	"-n",
	"- n",
	"n-",
	"n -"
], GS = [
	"$n",
	"n$",
	"$ n",
	"n $"
], KS = [
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
], qS = [
	"n %",
	"n%",
	"%n",
	"% n"
], JS = [
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
], YS = /[1-9]/;
function XS(e) {
	let t = e.closest("[data-ui-number-culture]")?.getAttribute("data-ui-number-culture") ?? null;
	if (t === null) return US;
	try {
		return {
			...US,
			...JSON.parse(t)
		};
	} catch {
		return US;
	}
}
function ZS(e, t, n) {
	if (!Number.isFinite(e)) return String(e);
	let r = $S(t);
	if (r === null) return eC(e, n);
	let i = Math.abs(e);
	switch (r.kind) {
		case "N": {
			let t = tC(i, 0, r.precision ?? n.decimalDigits, n.groupSizes, n.groupSeparator, n.decimalSeparator);
			return QS(e, t) ? oC(WS[n.negativePattern] ?? "-n", t, "", n.negativeSign) : t;
		}
		case "F": {
			let t = tC(i, 0, r.precision ?? n.decimalDigits, [], "", n.decimalSeparator);
			return QS(e, t) ? n.negativeSign + t : t;
		}
		case "D": {
			let t = nC(i, 0, 0).integer.padStart(r.precision ?? 1, "0");
			return QS(e, t) ? n.negativeSign + t : t;
		}
		case "C": {
			let t = tC(i, 0, r.precision ?? n.currencyDecimalDigits, n.currencyGroupSizes, n.currencyGroupSeparator, n.currencyDecimalSeparator);
			return oC(QS(e, t) ? KS[n.currencyNegativePattern] ?? "-$n" : GS[n.currencyPositivePattern] ?? "$n", t, n.currencySymbol, n.negativeSign);
		}
		case "P": {
			let t = tC(i, 2, r.precision ?? n.percentDecimalDigits, n.percentGroupSizes, n.percentGroupSeparator, n.percentDecimalSeparator);
			return oC(QS(e, t) ? JS[n.percentNegativePattern] ?? "-n %" : qS[n.percentPositivePattern] ?? "n %", t, n.percentSymbol, n.negativeSign);
		}
		default: return eC(e, n);
	}
}
function QS(e, t) {
	return e < 0 && YS.test(t);
}
function $S(e) {
	if (e == null || e.trim().length === 0) return null;
	let t = /^([NFCPDnfcpd])(\d{0,2})$/.exec(e.trim());
	if (t === null) throw Error(`Number format '${e}' is outside the shared subset (N, F, C, P, D, with an optional precision).`);
	return {
		kind: t[1].toUpperCase(),
		precision: t[2].length === 0 ? null : Number(t[2])
	};
}
function eC(e, t) {
	let { integer: n, fraction: r } = rC(Math.abs(e), 0), i = r.length === 0 ? n : `${n}${t.decimalSeparator}${r}`;
	return e < 0 ? t.negativeSign + i : i;
}
function tC(e, t, n, r, i, a) {
	let { integer: o, fraction: s } = nC(e, t, n);
	return n === 0 ? aC(o, r, i) : `${aC(o, r, i)}${a}${s}`;
}
function nC(e, t, n) {
	let { integer: r, fraction: i } = rC(e, t), a = r + i.slice(0, n).padEnd(n, "0"), o = i.length > n && i[n] >= "5" ? iC(a) : a, s = o.length - n;
	return {
		integer: o.slice(0, s),
		fraction: o.slice(s)
	};
}
function rC(e, t) {
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
function iC(e) {
	let t = e.length - 1;
	for (; t >= 0 && e[t] === "9";) t--;
	let n = "0".repeat(e.length - 1 - t);
	return t < 0 ? `1${n}` : `${e.slice(0, t)}${String(Number(e[t]) + 1)}${n}`;
}
function aC(e, t, n) {
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
function oC(e, t, n, r) {
	let i = "";
	for (let a of e) i += a === "n" ? t : a === "$" || a === "%" ? n : a === "-" ? r : a;
	return i;
}
var sC = /^[\t\n\v\f\r ]*[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?[\t\n\v\f\r ]*$/;
function cC(e) {
	if (!sC.test(e)) return null;
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}
var lC = {
	readCulture: XS,
	format: ZS,
	parseInvariant: cC
}, uC = /^-?(\d+(\.\d*)?|\.\d+)$/;
function dC(e, t, n) {
	if (!uC.test(e)) return e;
	let r = n.thousands === !1 ? vC(t) : t, i = Number(e), a = n.format?.trim() ?? "";
	if (a.length > 0) try {
		return ZS(i, n.thousands === !0 ? fC(a) : a, r);
	} catch {}
	let o = e.includes(".") ? e.length - e.indexOf(".") - 1 : 0;
	return ZS(i, `${n.thousands === !0 ? "N" : "F"}${Math.min(o, 99)}`, r);
}
function fC(e) {
	return /^[fF]\d{0,2}$/.test(e) ? `N${e.slice(1)}` : e;
}
function pC(e, t, n) {
	return uC.test(e) ? (_C(n) ? yC(e, 2) : e).replace(".", t.decimalSeparator) : e;
}
function mC(e, t, n) {
	let r = e.trim();
	if (r.length === 0) return "";
	let i = !1;
	r.startsWith("(") && r.endsWith(")") && (i = !0, r = r.slice(1, -1));
	let a = _C(n) || t.percentSymbol.length > 0 && r.includes(t.percentSymbol);
	for (let e of [t.currencySymbol, t.percentSymbol]) r = e.length === 0 ? r : r.split(e).join("");
	for (let e of /* @__PURE__ */ new Set([
		t.negativeSign,
		"-",
		"−"
	])) e.length > 0 && r.includes(e) && (i = !0, r = r.split(e).join(""));
	let o = t.decimalSeparator, [s, ...c] = o.length === 0 ? [r] : r.split(o);
	if (c.length > 1) return null;
	let l = s.replace(/[\s  ]/g, "").split(t.groupSeparator).join("").split(t.currencyGroupSeparator).join(""), u = c.length === 0 ? null : c[0].replace(/[\s  ]/g, ""), d = u === null ? l : `${l}.${u}`;
	if (!uC.test(d)) return null;
	let f = a ? yC(d, -2) : d;
	return i && Number(f) !== 0 ? `-${f}` : f;
}
function hC(e, t, n, r, i) {
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
function gC(e) {
	return e.includes(".") ? e.replace(/0+$/, "").replace(/\.$/, "") : e;
}
function _C(e) {
	return /^\s*[pP]\d{0,2}\s*$/.test(e ?? "");
}
function vC(e) {
	return {
		...e,
		groupSeparator: "",
		currencyGroupSeparator: "",
		percentGroupSeparator: ""
	};
}
function yC(e, t) {
	let n = e.startsWith("-"), r = n ? e.slice(1) : e, i = r.indexOf("."), a = r.replace(".", ""), o = (i < 0 ? r.length : i) + t, s = a;
	o <= 0 && (s = "0".repeat(1 - o) + s, o = 1), o > s.length && (s += "0".repeat(o - s.length));
	let c = s.slice(0, o).replace(/^0+(?=\d)/, ""), l = s.slice(o).replace(/0+$/, ""), u = l.length === 0 ? c : `${c}.${l}`;
	return n ? `-${u}` : u;
}
//#endregion
//#region src/interactions/number-input-engine.ts
var bC = "ui-number-input", xC = "ui-number-input__field", SC = "data-ui-number-no-decimals", CC = "data-ui-number-no-negative", wC = "data-ui-number-thousands", TC = "data-ui-number-no-thousands", EC = "data-ui-number-trim-zeros", DC = "data-ui-number-step", OC = "data-ui-number-min", kC = "data-ui-number-max", AC = "data-ui-number-step-direction", jC = /* @__PURE__ */ new Map([
	["ArrowUp", 1],
	["ArrowDown", -1],
	["PageUp", 10],
	["PageDown", -10]
]), MC = class {
	options;
	root;
	values = /* @__PURE__ */ new WeakMap();
	shown = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("focus", (e) => this.handleFocus(e), !0), this.root.addEventListener("blur", (e) => this.handleBlur(e), !0), this.root.addEventListener("click", (e) => this.handleStepClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleStepKey(e), !0), window.addEventListener("change", (e) => this.handleChangeCapture(e), !0), window.addEventListener("change", (e) => this.handleChangeDone(e)), this.showAtRest(this.root.querySelectorAll(`.${xC}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.showAtRest(pa(e.components, `.${xC}`));
		}), E.onChange(() => this.showAtRest(this.root.querySelectorAll(`.${xC}`)));
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
		let t = NC(e);
		if (t !== null) return this.keptValue(t) ?? RC(t) ?? t.value.trim();
	}
	show(e) {
		let t = this.values.get(e) ?? e.value, n = e.hasAttribute(EC) ? gC(t) : t, r = XS(e), i = e === document.activeElement ? pC(n, r, zC(e)) : IC(e, n, r);
		e.value = i, this.shown.set(e, i);
	}
	handleInput(e) {
		let t = NC(e.target);
		if (t === null) return;
		let n = !t.hasAttribute(SC), r = !t.hasAttribute(CC), i = t.selectionStart ?? t.value.length, a = hC(t.value, i, XS(t), n, r);
		a.value !== t.value && (t.value = a.value, t.setSelectionRange(a.cursor, a.cursor));
	}
	handleFocus(e) {
		let t = NC(e.target);
		t !== null && (this.values.set(t, this.valueOf(t)), this.show(t));
	}
	handleBlur(e) {
		let t = NC(e.target);
		if (t === null) return;
		let n = this.showsOwnText(t) ? null : RC(t);
		if (n !== null && this.values.set(t, n), t.hasAttribute(EC) && !k(t) && !D(t)) {
			let e = this.values.get(t) ?? "", n = gC(e);
			n !== e && this.commit(t, n);
		}
		this.show(t);
	}
	handleChangeCapture(e) {
		let t = NC(e.target);
		if (t === null) return;
		let n = RC(t);
		n !== null && (this.values.set(t, n), t.value = n, this.shown.set(t, n));
	}
	handleChangeDone(e) {
		let t = NC(e.target);
		t !== null && t === document.activeElement && this.show(t);
	}
	commit(e, t) {
		this.values.set(e, t), e.value = pC(t, XS(e), zC(e)), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleStepClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[" + AC + "]");
		if (t === null) return;
		let n = t.closest(".ui-number-input__row")?.querySelector(`.${xC}`) ?? null;
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t.getAttribute(AC) === "down" ? -1 : 1));
	}
	handleStepKey(e) {
		let t = jC.get(e.key);
		if (t === void 0 || !j(e, { shift: !0 }) || e.defaultPrevented) return;
		let n = NC(e.target);
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t));
	}
	step(e, t) {
		let n = Number(e.getAttribute(DC) ?? "1"), r = (Number(this.showsOwnText(e) ? this.valueOf(e) : RC(e) ?? "0") || 0) + n * t, i = e.getAttribute(OC), a = e.getAttribute(kC);
		i !== null && (r = Math.max(r, Number(i))), a !== null && (r = Math.min(r, Number(a))), this.commit(e, BC(r)), this.show(e);
	}
};
function NC(e) {
	return e instanceof HTMLInputElement && e.classList.contains(xC) ? e : null;
}
function PC(e, t) {
	let n = e.classList.contains(bC) ? e.querySelector(`.${xC}`) : null, r = n === null ? null : t(n);
	if (n === null || typeof r != "string" || r.trim().length === 0 || !Number.isFinite(Number(r))) return null;
	let i = FC(n, OC), a = FC(n, kC);
	return i !== null && Number(r) < Number(i) ? {
		key: "ui.value.min",
		args: { min: IC(n, i, XS(n)) }
	} : a !== null && Number(r) > Number(a) ? {
		key: "ui.value.max",
		args: { max: IC(n, a, XS(n)) }
	} : null;
}
function FC(e, t) {
	let n = e.getAttribute(t)?.trim() ?? "";
	return n.length > 0 && Number.isFinite(Number(n)) ? n : null;
}
function IC(e, t, n) {
	return dC(t, n, {
		format: zC(e),
		thousands: LC(e)
	});
}
function LC(e) {
	return e.hasAttribute(wC) ? !0 : !e.hasAttribute(TC) && null;
}
function RC(e) {
	return mC(e.value, XS(e), zC(e));
}
function zC(e) {
	return e.closest(`.${bC}`)?.getAttribute("data-ui-number-format") ?? null;
}
function BC(e) {
	return Number(e.toFixed(10)).toString();
}
//#endregion
//#region src/events/ahead-of-answer.ts
function VC(e, t) {
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
function V(e) {
	switch (e.getAttribute(jt)) {
		case "windowed": return "windowed";
		case "virtualized": return "virtualized";
		default: return "plain";
	}
}
function HC(e) {
	let t = V(e) === "windowed" ? UC(e, "data-ui-window-offset") ?? 0 : 0;
	return Number.isInteger(t) && t > 0 ? t : 0;
}
function UC(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.length === 0) return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
function WC(e, t) {
	return e.getAttribute(t)?.toLowerCase() === "true";
}
//#endregion
//#region src/interactions/item-drags.ts
var GC = "application/x-ne-items", KC = null, qC = null;
function JC(e, t, n) {
	let r = e.getAttribute(pe), i = new Set((e.getAttribute("data-ui-drag-effects") ?? "").split(" ").filter((e) => e === "move" || e === "copy"));
	return r === null || r.length === 0 || i.size === 0 || n.length === 0 ? null : {
		kind: r,
		root: e,
		host: t,
		rows: n,
		keys: n.map(I),
		effects: i,
		source: e.getAttribute(me)
	};
}
function YC(e, t) {
	let n = Hl(t);
	return n.includes(e) ? n.filter((t) => t === e || ZC(t)) : [e];
}
function XC(e) {
	return !gs(e, "data-ui-undraggable") && !O(e);
}
function ZC(e) {
	return XC(e) && F(e) !== null;
}
function QC(e, t) {
	let n = e?.effects.has("copy") === !0, r = t || e?.effects.has("move") === !0;
	return n && r ? "copyMove" : n ? "copy" : "move";
}
function $C(e, t, n = null) {
	KC = t, qC = t === null ? null : n, t !== null && e instanceof DragEvent && e.dataTransfer !== null && e.dataTransfer.setData(GC, t.kind);
}
function ew(e) {
	return KC !== null && e.dataTransfer?.types.includes(GC) === !0 ? KC : null;
}
function tw() {
	let e = qC;
	KC = null, qC = null, e?.();
}
//#endregion
//#region src/items/items-empty-renderer.ts
var nw = `:scope > [${St}], :scope > [${Ct}], :scope > [${It}]`;
function H(e) {
	let t = new Set(e.querySelectorAll(nw));
	return [...e.children].filter((e) => !t.has(e));
}
function rw(e) {
	return e === null ? [] : [e];
}
function iw(e) {
	return e.querySelector(`:scope > [${St}]`);
}
function aw(e, t, n, r, i) {
	i ??= H(e).some((e) => !e.classList.contains(ni));
	let a = iw(e);
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
	c.setAttribute(St, ""), c.appendChild(s), e.appendChild(c);
}
//#endregion
//#region src/items/binding-template-evaluator.ts
var ow = { ok: !1 }, sw = {
	ok: !0,
	value: null
}, cw = null;
function lw(e) {
	cw = e;
}
function uw(e, t, n) {
	let r = e.length === 0 ? void 0 : e[e.length - 1].item, i = t ?? "";
	if (i.length === 0 || i === ".") return {
		ok: !0,
		value: r,
		scope: r
	};
	let a = (n ?? []).filter((e) => ji(e.kind) !== "Scope"), o = -1;
	for (let e = 0; e < a.length; e++) ji(a[e].kind) === "Dynamic" && (o = e);
	let s = r, c = r, l = !0, u = 0, d = 0, f = !0;
	for (; d < i.length;) {
		let t = i[d];
		if (t === ".") {
			if (f) return ow;
			f = !0, d++;
			continue;
		}
		if (t === "[") {
			if (d + 1 >= i.length || i[d + 1] !== "]" || u >= a.length) return ow;
			let t = a[u];
			if (u++, ji(t.kind) === "Dynamic") {
				let n = mw(e, t.componentId);
				if (!n.ok) return ow;
				s = n.value, c = n.value, l = !0;
			} else {
				if (!l) return ow;
				let e = xw(s, t.value);
				if (!e.ok) return ow;
				s = e.value;
			}
			d += 2, f = !1;
			continue;
		}
		let n = d;
		for (; d < i.length && i[d] !== "." && i[d] !== "[";) d++;
		if (d === n) return ow;
		if (l) {
			let e = _w(s, i.slice(n, d), u > o);
			e.ok ? s = e.value : l = !1;
		}
		f = !1;
	}
	return f || u !== a.length || !l ? ow : {
		ok: !0,
		value: s,
		scope: c
	};
}
function dw(e, t, n) {
	for (let r of t ?? []) {
		if (ji(r.kind) !== "Dynamic") continue;
		let t = w(r.componentId);
		if (t > 0 && !n.some((e) => e.scopeComponentId === t) && e.closest(`[data-ui-id="${t}"][data-ui-key]`) !== null) return !0;
	}
	return !1;
}
function fw(e) {
	let t = gw(e, "IsContent");
	return t.ok && t.value === !0;
}
var pw = /* @__PURE__ */ new Set();
function mw(e, t) {
	let n = w(t);
	if (n > 0) {
		for (let t = e.length - 1; t >= 0; t--) if (e[t].scopeComponentId === n) return {
			ok: !0,
			value: e[t].item
		};
	}
	return pw.has(n) || (pw.add(n), s("an item scope a binding parameter names is not on the stack; the binding resolves to nothing.", {
		targetId: n,
		stack: e
	})), ow;
}
function hw(e, t) {
	let n = e;
	for (let e of t.split(".")) {
		let t = gw(n, e);
		if (!t.ok) return;
		n = t.value;
	}
	return n;
}
function gw(e, t) {
	return _w(e, t, !0);
}
function _w(e, t, n) {
	if (e == null) return ow;
	if (t === ".") return {
		ok: !0,
		value: e
	};
	if (typeof e != "object") return ow;
	let r = e, i = vw(r, t);
	return Object.hasOwn(r, i) ? {
		ok: !0,
		value: r[i]
	} : Array.isArray(e) ? ow : (n && cw?.(r, t), sw);
}
function vw(e, t) {
	if (Object.hasOwn(e, t)) return t;
	let n = yw(t);
	if (Object.hasOwn(e, n)) return n;
	let r = null;
	for (let n in e) if (!(n.length !== t.length || !Object.hasOwn(e, n)) && (r ??= t.toLowerCase(), n.toLowerCase() === r)) return n;
	return n;
}
function yw(e) {
	let t = e.charAt(0);
	return t === t.toLowerCase() ? e : t.toLowerCase() + e.slice(1);
}
function bw(e) {
	let t = e.itemTemplate;
	if (t == null) return null;
	let n = (e.itemTemplateParameters ?? []).filter((e) => ji(e.kind) !== "Scope"), r = [], i = [], a = !1, o = 0, s = 0, c = 0;
	for (; c < t.length;) {
		let e = t[c];
		if (e === ".") {
			c++;
			continue;
		}
		if (e === "[") {
			if (c + 1 >= t.length || t[c + 1] !== "]" || s >= n.length) return null;
			let e = n[s];
			if (s++, c += 2, ji(e.kind) !== "Dynamic") {
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
function xw(e, t) {
	if (e == null || t == null) return ow;
	if (typeof t == "number") return Array.isArray(e) && t >= 0 && t < e.length ? {
		ok: !0,
		value: e[t]
	} : ow;
	if (typeof t != "string") return ow;
	if (!Array.isArray(e) && typeof e == "object") {
		let n = e;
		if (Object.hasOwn(n, t)) return {
			ok: !0,
			value: n[t]
		};
	}
	if (Array.isArray(e)) {
		for (let n of e) if (Cw(n, t)) return {
			ok: !0,
			value: n
		};
	}
	return ow;
}
function Sw(e, t, n) {
	if (e == null || t == null) return !1;
	if (Array.isArray(e)) {
		if (typeof t == "number") return t < 0 || t >= e.length ? !1 : (e[t] = n, !0);
		if (typeof t != "string") return !1;
		for (let r = 0; r < e.length; r++) if (Cw(e[r], t)) return e[r] = n, !0;
		return !1;
	}
	if (typeof t != "string" || typeof e != "object") return !1;
	let r = e;
	return Object.hasOwn(r, t) ? (r[t] = n, !0) : !1;
}
function Cw(e, t) {
	return typeof e == "object" && !!e && e.id === t;
}
//#endregion
//#region src/items/items-filter-sort.ts
function ww(e) {
	let t = e.closest(S)?.querySelector(":scope > [data-ui-items-query]")?.getAttribute("data-ui-items-query") ?? null;
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
function Tw(e, t, n, r, i) {
	let a = n.getItemsFilterSortMetadata(t), o = ww(e);
	if (a === void 0 && o === null) {
		for (let t of H(e)) t.classList.remove(ni);
		return;
	}
	for (let n of H(e)) {
		let e = r.getItemValue(n);
		if (e === void 0) {
			s("item value is unknown, leaving the item visible.", {
				componentId: t,
				item: n
			}), n.classList.remove(ni);
			continue;
		}
		n.classList.toggle(ni, !Ew(a, e, i, o));
	}
}
function Ew(e, t, n, r = null) {
	return (e?.filters ?? []).every((e) => jw(e, t, n)) && (r?.filters ?? []).every((e) => Nf(hw(t, e.itemProperty), e.operator, e.value));
}
function Dw(e, t, n = null) {
	return (e?.filters ?? []).some((e) => Mw(e.source, e.activeOperator, e.activeValue, t)) || (n?.filters?.length ?? 0) > 0;
}
function Ow(e, t, n = null) {
	let r = (e?.sorts ?? []).filter((e) => Mw(e.source, e.activeOperator, e.activeValue, t)).sort((e, t) => e.priority - t.priority);
	return [...n?.sorts ?? [], ...r];
}
function kw(e, t, n) {
	return t.length === 0 ? [...e] : [...e].sort((e, r) => Aw(n.getItemValue(e), n.getItemValue(r), t));
}
function Aw(e, t, n) {
	for (let r of n) {
		let n = Nw(Pf(hw(e, r.itemProperty)), Pf(hw(t, r.itemProperty)));
		if (n !== 0) return Ii(r.direction) === "Descending" ? -n : n;
	}
	return 0;
}
function jw(e, t, n) {
	if (!Mw(e.source, e.activeOperator, e.activeValue, n)) return !0;
	let r = e.source !== null && e.source !== void 0 ? n.get(e.source, []) : e.value;
	return Nf(hw(t, e.itemProperty), e.operator, r);
}
function Mw(e, t, n, r) {
	return e == null || Nf(r.get(e, []), t, n);
}
function Nw(e, t) {
	if (e === t) return 0;
	let n = Fw(e), r = Fw(t);
	if (n !== r) return n - r;
	if (n === Pw.Nothing) return 0;
	if (n === Pw.Number) {
		let n = Number(e) - Number(t);
		return Number.isNaN(n) ? 0 : Math.sign(n);
	}
	return String(e).localeCompare(String(t));
}
var Pw = {
	Nothing: 0,
	Number: 1,
	Text: 2
};
function Fw(e) {
	return e == null ? Pw.Nothing : typeof e == "number" ? Number.isNaN(e) ? Pw.Nothing : Pw.Number : typeof e == "string" && e.trim().length === 0 ? Pw.Nothing : Number.isNaN(Number(e)) ? Pw.Text : Pw.Number;
}
//#endregion
//#region src/items/items-source-order.ts
var Iw = /* @__PURE__ */ new WeakMap();
function Lw(e, t) {
	let n = Iw.get(e), r = n === void 0 ? [...t] : Rw(n, t);
	return Iw.set(e, r), r;
}
function Rw(e, t) {
	let n = new Set(t), r = e.filter((e) => n.has(e));
	return r.length === t.length ? r : [...t];
}
function zw(e, t, n) {
	let r = n === null || n > e.length ? e.length : n;
	return e.splice(r, 0, t), e[r + 1] ?? null;
}
function Bw(e, t) {
	let n = e.indexOf(t);
	n >= 0 && e.splice(n, 1);
}
function Vw(e, t, n) {
	return Bw(e, t), zw(e, t, n);
}
function Hw(e, t, n) {
	let r = e.indexOf(t);
	r >= 0 && (e[r] = n);
}
function Uw(e) {
	Iw.delete(e);
}
//#endregion
//#region src/interactions/tab-rows.ts
var Ww = "ui-tab-item";
function Gw(e) {
	let t = e.parentElement;
	return t !== null && !t.hasAttribute("data-ui-items-host") && t.closest("[data-ui-items-host]") === t.parentElement ? t : e;
}
function Kw(e) {
	return e instanceof HTMLElement && e.classList.contains("ui-tab-item") ? Gw(e).parentElement : null;
}
function qw(e, t) {
	return gs(Gw(e), t);
}
//#endregion
//#region src/interactions/items-reorder-engine.ts
var Jw = ".ui-items-view__item, .ui-table__row", Yw = "ui-row--dragging", Xw = "--ui-row-drop-offset", Zw = "move", Qw = ".ui-items-view--wrap", $w = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight"
]);
function eT(e, t) {
	Ju(e, Zw, { index: t });
}
function tT(e) {
	return {
		name: Zw,
		registration: {
			dynamicParameters: (e) => {
				let t = nT(e.domEvent);
				return t === null ? null : [...e.dynamicParameters, t];
			},
			...VC((t) => e === void 0 ? null : rT(e, t), (t) => "pending" in t ? e?.settle(t.pending) : e?.resort(t.strip))
		}
	};
}
function nT(e) {
	let t = e instanceof CustomEvent ? e.detail?.index : void 0;
	return typeof t == "number" ? t : null;
}
function rT(e, t) {
	let n = nT(t);
	if (n === null || !(t.target instanceof Element)) return null;
	let r = Kw(t.target);
	if (r !== null) return { strip: r };
	let i = t.target.closest(Jw), a = i?.parentElement ?? null, o = i === null || a === null || !a.hasAttribute("data-ui-items-host") ? null : e.ahead(a, I(i), n);
	return o === null ? null : { pending: o };
}
var iT = class {
	root;
	services;
	drag = null;
	lifted = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.services = e.services, this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("pointerup", () => this.release(), !0), this.root.addEventListener("pointercancel", () => this.release(), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", () => this.endDrag(), !0);
	}
	handlePointerDown(e) {
		if (this.release(), !(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = this.liftableRow(e.target), n = t === null ? null : F(t.row);
		if (t === null || n === null) return;
		let r = lT(t.root, t.row);
		if (r === null ? !uT(e.target, t.row) : !r.contains(e.target)) return;
		r !== null && (Su(t.root, gT(t.row.parentElement ?? t.root), t.row), t.root.focus({ preventScroll: !0 }));
		let i = document.getSelection();
		i !== null && !i.isCollapsed && i.removeAllRanges(), n.draggable || (n.draggable = !0, this.lifted = n);
	}
	release() {
		this.lifted !== null && this.drag === null && (this.lifted.draggable = !1, this.lifted = null);
	}
	liftableRow(e) {
		let t = e.closest(jl), n = t?.parentElement ?? null, r = n?.closest(P) ?? null;
		if (t === null || n === null || r === null || !t.matches(Jw) || !n.hasAttribute("data-ui-items-host") || D(r) || !ZC(t)) return null;
		let i = r.hasAttribute("data-ui-rows-draggable") && !this.isSorted(r, n);
		return i || r.hasAttribute("data-ui-drag-kind") ? {
			root: r,
			row: t,
			moves: i
		} : null;
	}
	isSorted(e, t) {
		let n = ha(e);
		return this.services === void 0 || n === null ? !1 : Ow(this.services.metadata.getItemsFilterSortMetadata(n), this.services.state, ww(t)).length > 0;
	}
	handleDragStart(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.liftableRow(e.target), n = t?.row.parentElement ?? null, r = t === null ? null : F(t.row);
		if (t === null || n === null || r === null || e.target !== r) return;
		this.drag = {
			...t,
			host: n
		};
		let i = JC(t.root, n, YC(t.row, gT(n))), a = (i?.rows ?? []).filter((e) => e !== t.row).map((e) => F(e) ?? e);
		Og(e, t.root, r, Yw, I(t.row), a, QC(i, t.moves)), $C(e, i, () => this.endDrag());
	}
	handleDragOver(e) {
		let t = this.ownDrag(e);
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let n = fT(t.root, t.host), r = gT(t.host), i = sT(t.host, e.target, e, n, r);
		e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), i === null || this.indexOf(t, i.anchor, i.side) === null ? _T(t.root, null) : _T(t.root, i, mT(r, i, n));
	}
	ownDrag(e) {
		let t = this.drag;
		return t !== null && t.moves && e.target instanceof Element && t.host.contains(e.target) ? t : null;
	}
	indexOf(e, t, n) {
		if (dT(t) !== dT(e.row)) return null;
		let r = aT(cT(e.host, this.services?.keysOf), I(e.row), I(t), n);
		return r === null ? null : r + HC(e.host);
	}
	handleDragLeave(e) {
		let t = this.drag;
		t !== null && e instanceof DragEvent && jg(e, t.host) && _T(t.root, null);
	}
	handleDrop(e) {
		let t = this.ownDrag(e);
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		e.preventDefault();
		let n = sT(t.host, e.target, e, fT(t.root, t.host), gT(t.host)), r = n === null ? null : this.indexOf(t, n.anchor, n.side);
		this.endDrag(), r !== null && eT(t.row, r);
	}
	endDrag() {
		let e = this.drag;
		this.drag = null, this.release(), e !== null && (kg(e.root, Yw), _T(e.root, null));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !e.altKey || !j(e, { alt: !0 }) || !$w.has(e.key) || !(e.target instanceof Element)) return;
		let t = mu(e);
		if (t === null || !t.root.matches(".ui-items-view, .ui-table")) return;
		let n = Xl(t.root), r = n === null ? null : fT(t.root, n), i = e.key === "ArrowLeft" || e.key === "ArrowRight";
		if (n === null || r === null || i && !r.across) return;
		let a = gT(n), o = _u(a);
		if (o === null || this.liftableRow(o)?.moves !== !0) return;
		e.preventDefault();
		let s = e.key === "ArrowDown" || e.key === "ArrowRight", c = !i && t.root.matches(Qw) ? Gu(a, o, s) : a[a.indexOf(o) + (s ? 1 : -1)] ?? null, l = c === null ? null : this.indexOf({
			host: n,
			row: o
		}, c, s ? "after" : "before");
		l !== null && eT(o, l);
	}
};
function aT(e, t, n, r) {
	let i = e.indexOf(t);
	if (i < 0 || t === n) return null;
	let a = oT(e.filter((e) => e !== t), n, r);
	return a === i ? null : a;
}
function oT(e, t, n) {
	let r = e.indexOf(t);
	return r < 0 ? null : n === "before" ? r : r + 1;
}
function sT(e, t, n, r, i) {
	if (t.closest("[data-ui-group-header]")?.parentElement === e) return null;
	let a = t.closest(jl);
	for (; a !== null && a.parentElement !== e;) a = a.parentElement?.closest(jl) ?? null;
	if (a ??= hT(i, n), a === null) return null;
	let o = (F(a) ?? a).getBoundingClientRect();
	if ((r.across ? n.clientX < o.left + o.width / 2 : n.clientY < o.top + o.height / 2) === r.rightToLeft) return {
		anchor: a,
		side: "after"
	};
	let s = i[i.indexOf(a) - 1];
	return s !== void 0 && pT(s, a, r) ? {
		anchor: s,
		side: "after"
	} : {
		anchor: a,
		side: "before"
	};
}
function cT(e, t) {
	switch (V(e)) {
		case "virtualized": return [...t?.(e) ?? H(e).map(I)];
		case "windowed": return H(e).map(I);
		default: return Lw(e, H(e)).map(I);
	}
}
function lT(e, t) {
	let n = e.hasAttribute("data-ui-rows-drag-handle") ? t.querySelector(`:scope > .${_e}`) : null;
	return n !== null && n.getClientRects().length > 0 ? n : null;
}
function uT(e, t) {
	return rl(e, t) === null && e.closest("[data-ui-no-row-drag]") === null;
}
function dT(e) {
	return e.getAttribute("data-ui-group") ?? "";
}
function fT(e, t) {
	let n = e.matches(".ui-orientation--horizontal, .ui-items-view--wrap");
	return {
		across: n,
		rightToLeft: n && getComputedStyle(t).direction === "rtl"
	};
}
function pT(e, t, n) {
	if (dT(e) !== dT(t)) return !1;
	if (!n.across) return !0;
	let r = (F(e) ?? e).getBoundingClientRect(), i = (F(t) ?? t).getBoundingClientRect();
	return r.top < i.bottom && i.top < r.bottom;
}
function mT(e, t, n) {
	let r = t.side === "after" ? e[e.indexOf(t.anchor) + 1] : void 0;
	if (r === void 0 || !pT(t.anchor, r, n)) return -1;
	let i = (F(t.anchor) ?? t.anchor).getBoundingClientRect(), a = (F(r) ?? r).getBoundingClientRect(), o = n.across ? n.rightToLeft ? i.left - a.right : a.left - i.right : a.top - i.bottom;
	return Math.max(o, 0) / 2;
}
function hT(e, t) {
	let n = null, r = Infinity;
	for (let i of e) {
		let e = (F(i) ?? i).getBoundingClientRect(), a = Math.max(e.left - t.clientX, 0, t.clientX - e.right), o = Math.max(e.top - t.clientY, 0, t.clientY - e.bottom), s = a * a + o * o;
		s < r && (n = i, r = s);
	}
	return n;
}
function gT(e) {
	return H(e).filter((e) => e instanceof HTMLElement && e.matches(jl) && F(e) !== null);
}
function _T(e, t, n = 0) {
	let r = t === null ? null : F(t.anchor);
	for (let t of e.querySelectorAll(`[${ve}]`)) t !== r && (t.removeAttribute(ve), t.style.removeProperty(Xw));
	if (r === null || t === null) return;
	r.getAttribute("data-ui-row-drop") !== t.side && r.setAttribute(ve, t.side);
	let i = `${n}px`;
	r.style.getPropertyValue(Xw) !== i && r.style.setProperty(Xw, i);
}
function vT(e) {
	e.classList.remove(Yw), e.querySelector(`:scope > [${re}]`)?.classList.remove(Yw);
}
//#endregion
//#region src/interactions/tree-drop.ts
var yT = "--ui-tree-drop-depth";
function bT(e) {
	return e.querySelector(`.${Jn}`);
}
function xT(e, t) {
	if (O(e)) return !1;
	let n = t?.getAttribute(or);
	return n === "true" || n !== "false" && e.hasAttribute("aria-expanded");
}
function ST(e, t) {
	let n = e.length === 0 ? null : t(e);
	return n === null || xT(n, bT(n));
}
function CT(e, t) {
	let n = bT(e);
	if (xT(e, n)) return I(e);
	let r = n?.getAttribute("data-ui-tree-parent") ?? "";
	return ST(r, t) ? r : null;
}
function wT(e, t, n = "", r) {
	for (let n of e.querySelectorAll(`[${Yn}]`)) n !== t && (n.removeAttribute(Yn), n.style.removeProperty(yT));
	t !== null && (t.setAttribute(Yn, n), r === void 0 ? t.style.removeProperty(yT) : t.style.setProperty(yT, String(r)));
}
function TT(e, t, n) {
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
function ET(e, t, n) {
	let r = e.find((e) => e.key === t);
	if (r === void 0) return null;
	let i = DT(e, r, n);
	return i === null || !OT(e, i.parent) ? null : i;
}
function DT(e, t, n) {
	if (n === "in") {
		let n = TT(e, t.key, !0);
		return n === null ? null : {
			parent: n,
			before: null
		};
	}
	if (n === "out") {
		let n = TT(e, t.key, !1);
		return n === null ? null : {
			parent: n,
			before: AT(e, n, t.parent, !1)
		};
	}
	let r = kT(e, t.parent), i = r.findIndex((e) => e.key === t.key), a = n === "up" ? -1 : 1, o = i + a;
	for (; o >= 0 && o < r.length && r[o].shown === !1;) o += a;
	return o < 0 || o >= r.length ? null : {
		parent: t.parent,
		before: n === "up" ? r[o].key : r[o + 1]?.key ?? null
	};
}
function OT(e, t) {
	return t.length === 0 || e.find((e) => e.key === t)?.takesDrop === !0;
}
function kT(e, t) {
	return e.filter((e) => e.parent === t);
}
function AT(e, t, n, r, i = /* @__PURE__ */ new Set()) {
	let a = kT(e, t);
	for (let e = a.findIndex((e) => e.key === n) + 1; e > 0 && e < a.length; e++) if (!i.has(a[e].key) && (!r || a[e].shown !== !1)) return a[e].key;
	return null;
}
function jT(e, t, n) {
	let r = kT(e, n.parent).map((e) => e.key), i = new Set(t), a = n.before !== null && i.has(n.before) ? AT(e, n.parent, n.before, !1, i) : n.before, o = [], s = null;
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
var MT = "drop:", NT = "ui-row--cut", PT = {
	code: "KeyX",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
}, FT = {
	code: "KeyC",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
}, IT = {
	code: "KeyV",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
};
function LT(e) {
	return {
		dynamicParameters: (e) => {
			let t = RT(e.domEvent);
			return t === null ? null : [...e.dynamicParameters, JSON.stringify(t.drop)];
		},
		...VC((t) => zT(e, t), (t) => e?.settle(t))
	};
}
function RT(e) {
	let t = e instanceof CustomEvent ? e.detail : null;
	return t?.drop === void 0 ? null : t;
}
function zT(e, t) {
	let n = RT(t)?.transfer ?? null;
	return n === null || e === void 0 ? null : e.ahead(n.source, n.target, n.keys, n.index);
}
var BT = class {
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
		let t = ew(e), n = e.target instanceof Element ? e.target : null, r = t === null || n === null ? null : this.targetOf(t, n);
		if (t === null || n === null || r === null) return null;
		let i = VT(t, r, HT(e)), a = i === null ? null : this.landingOf(r, n, e);
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
		return n === null || D(n) ? null : n;
	}
	landingOf(e, t, n) {
		let r = e.matches(".ui-items-view, .ui-table") ? Xl(e) : null;
		if (r !== null) {
			let i = gT(r), a = fT(e, r), o = cT(r, this.options.keysOf), s = t !== null && n !== null ? sT(r, t, n, a, i) : UT(i);
			return {
				index: ((s === null ? null : oT(o, I(s.anchor), s.side)) ?? o.length) + HC(r),
				folder: null,
				list: r,
				mark: () => s === null ? e.setAttribute(he, "") : _T(e, s, mT(i, s, a))
			};
		}
		if (e.classList.contains("ui-tree")) {
			let n = WT(e, t ?? document.activeElement);
			if (n === null) return null;
			let r = n.length === 0 ? Xl(e) : GT(e, n);
			return {
				index: null,
				folder: n,
				list: null,
				mark: () => wT(e, r)
			};
		}
		return {
			index: null,
			folder: null,
			list: null,
			mark: () => {
				e.setAttribute(he, ""), Mg(e, !0);
			}
		};
	}
	unmark() {
		let e = this.marked;
		this.marked = null, e !== null && (e.removeAttribute(he), Mg(e, !1), e.matches(".ui-items-view, .ui-table") ? _T(e, null) : e.classList.contains("ui-tree") && wT(e, null));
	}
	handleDragLeave(e) {
		this.marked !== null && e instanceof DragEvent && jg(e, this.marked) && this.unmark();
	}
	handleDrop(e) {
		let t = e instanceof DragEvent ? this.dropOf(e) : null;
		t !== null && (e.preventDefault(), this.unmark(), tw(), this.drop(t.drag, t.target, t.effect, t.landing));
	}
	drop(e, t, n, r) {
		let i = n === "move" && r.list !== null && r.index !== null && e.root.matches(".ui-items-view, .ui-table") && t.getAttribute("data-ui-drag-kind") === e.kind && V(e.host) === "plain" && V(r.list) === "plain", a = {
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
		t.dispatchEvent(new CustomEvent(MT + e.kind, {
			bubbles: !0,
			detail: a
		}));
	}
	endDrag() {
		this.unmark(), tw();
	}
	handleKeyDown(e) {
		if (!(!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element))) {
			if (e.key === "Escape") {
				this.clipboard !== null && !A(e) && (e.preventDefault(), this.letGo());
				return;
			}
			Wc(e.target) || (uc(IT, e) ? this.paste(e, e.target) : uc(PT, e) ? this.take(e, e.target, !0) : uc(FT, e) && this.take(e, e.target, !1));
		}
	}
	letGo() {
		for (let e of this.clipboard?.items.rows ?? []) (F(e) ?? e).classList.remove(NT);
		this.clipboard = null;
	}
	paste(e, t) {
		let n = this.clipboard, r = n === null ? null : this.targetOf(n.items, t), i = n === null || r === null ? null : VT(n.items, r, !n.cut), a = r === null || i === null ? null : this.landingOf(r, null, null);
		n !== null && r !== null && i !== null && a !== null && (e.preventDefault(), this.drop(n.items, r, i, a), n.cut && this.letGo());
	}
	take(e, t, n) {
		let r = document.getSelection();
		if (r !== null && !r.isCollapsed) return;
		let i = pu(t), a = i === null ? null : Xl(i.root);
		if (i === null || a === null || D(i.root) || !i.root.hasAttribute("data-ui-drag-kind")) return;
		let o = gT(a), s = i.row ?? _u(o), c = s === null || !ZC(s) ? null : JC(i.root, a, YC(s, o));
		if (!(c === null || !c.effects.has(n ? "move" : "copy")) && (e.preventDefault(), this.letGo(), this.clipboard = {
			items: c,
			cut: n
		}, n)) for (let e of c.rows) (F(e) ?? e).classList.add(NT);
	}
};
function VT(e, t, n) {
	let r = n || t.getAttribute("data-ui-drag-kind") !== e.kind ? "copy" : "move";
	return e.effects.has(r) ? r : n ? null : r === "move" ? "copy" : "move";
}
function HT(e) {
	return gc() ? e.altKey : e.ctrlKey;
}
function UT(e) {
	let t = vu(e);
	return t === null ? null : {
		anchor: t,
		side: "after"
	};
}
function WT(e, t) {
	let n = t?.closest(".ui-tree__row") ?? null;
	return n === null || n.closest(".ui-tree") !== e ? "" : CT(n, (t) => GT(e, t));
}
function GT(e, t) {
	return e.querySelector(`.${qn}[${y}="${wi(t)}"]`);
}
//#endregion
//#region src/interactions/temporal-range.ts
function KT(e, t, n) {
	if (t === "start" || e.start === null) {
		let t = XT(n, e.start ?? n);
		return {
			start: t,
			end: e.end !== null && e.end.getTime() < t.getTime() ? null : e.end,
			active: "end",
			complete: !1
		};
	}
	return n.getTime() < ZT(e.start).getTime() ? {
		start: XT(n, e.start),
		end: null,
		active: "end",
		complete: !1
	} : {
		start: e.start,
		end: XT(n, e.end ?? e.start),
		active: "end",
		complete: !0
	};
}
function qT(e, t, n) {
	if (t === null || n === null) return !1;
	let r = ZT(e).getTime();
	return r > ZT(t).getTime() && r < ZT(n).getTime();
}
function JT(e, t, n) {
	return !n && qT(e, t.start, t.end);
}
function YT(e) {
	return e.start !== null && e.end !== null && e.end.getTime() < e.start.getTime() ? {
		start: e.end,
		end: e.start
	} : e;
}
function XT(e, t) {
	return Wa(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function ZT(e) {
	return Wa(e.getFullYear(), e.getMonth(), e.getDate());
}
//#endregion
//#region src/interactions/temporal-dom.ts
var U = "ui-temporal-input", QT = "ui-calendar", $T = `.${U}, .${QT}`, eE = "ui-temporal-input__value-input", tE = "ui-temporal-input__end-value-input", nE = "data-ui-temporal-range", rE = "data-ui-temporal-end", iE = "data-ui-temporal-mode", aE = "data-ui-temporal-format", oE = "data-ui-temporal-default-format", sE = "data-ui-temporal-min", cE = "data-ui-temporal-max", lE = "data-ui-temporal-step", uE = "data-ui-temporal-step-unit", dE = "data-ui-temporal-marked-days", fE = "data-ui-temporal-marked-only", pE = "data-ui-temporal-page-culture", mE = "data-ui-temporal-months", hE = "data-ui-temporal-months-genitive", gE = "data-ui-temporal-months-short", _E = "data-ui-temporal-daynames", vE = "data-ui-temporal-weekdays", yE = "data-ui-temporal-first-day", bE = "data-ui-temporal-am", xE = "data-ui-temporal-pm", SE = /* @__PURE__ */ new Set([
	aE,
	oE,
	sE,
	cE,
	mE,
	bE,
	xE,
	dE,
	fE
]), CE = 2e3;
function wE(e) {
	let t = e.getAttribute(iE);
	return t === "time" || t === "date-time" ? t : "date";
}
function TE(e) {
	let t = e.getAttribute(aE);
	return t === null || t.trim().length === 0 ? e.getAttribute(oE) ?? "" : t;
}
function EE(e) {
	let t = e.getAttribute(uE), n = Math.max(1, Math.trunc(Number(e.getAttribute(lE))) || 1);
	return {
		unit: t === "hour" || t === "minute" || t === "second" ? t : "day",
		hour: t === "hour" ? n : 1,
		minute: t === "minute" ? n : 1,
		second: t === "second" ? n : 1
	};
}
function DE(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function OE(e, t) {
	return t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function kE(e, t, n) {
	let r = new Date(e);
	return t === "hour" ? r.setHours(n) : t === "minute" ? r.setMinutes(n) : r.setSeconds(n), r;
}
function AE(e) {
	return {
		monthNames: jE(e, mE),
		monthGenitiveNames: jE(e, hE),
		abbreviatedMonthNames: jE(e, gE),
		dayNames: jE(e, _E),
		abbreviatedDayNames: jE(e, vE),
		amDesignator: e.getAttribute(bE) ?? "AM",
		pmDesignator: e.getAttribute(xE) ?? "PM"
	};
}
function jE(e, t) {
	return (e.getAttribute(t) ?? "").split("|");
}
function ME(e, t) {
	e.hasAttribute(pE) && (IE(e, hE, t.monthGenitiveNames.join("|")), IE(e, gE, t.abbreviatedMonthNames.join("|")), IE(e, _E, t.dayNames.join("|")), IE(e, vE, t.abbreviatedDayNames.join("|")), IE(e, mE, t.monthNames.join("|")), IE(e, bE, t.amDesignator), IE(e, xE, t.pmDesignator), IE(e, oE, FE(wE(e), EE(e), t)));
}
function NE(e) {
	for (let t = 0; t < e.length;) {
		let n = Ra(e, t);
		if (n === "h" || n === "hh") return !0;
		t += n?.length ?? 1;
	}
	return !1;
}
function PE(e, t, n) {
	if (!t) return String(e).padStart(2, "0");
	let r = e < 12 ? n.amDesignator : n.pmDesignator, i = String(ao(e));
	return r.length === 0 ? i : `${i} ${r}`;
}
function FE(e, t, n) {
	let r = t.unit === "second";
	return e === "date" ? n.date : e === "time" ? r ? n.longTime : n.shortTime : ka(n, r);
}
function IE(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function LE(e) {
	return e.hasAttribute(nE);
}
function RE(e) {
	return e !== null && e.hasAttribute(rE);
}
function zE(e) {
	return W(e, !1);
}
function W(e, t) {
	let n = BE(e, t);
	return n === null ? null : QE(n.value, wE(e));
}
function BE(e, t) {
	return e.querySelector(`.${t ? tE : eE}`);
}
function VE(e, t) {
	return QE(e.getAttribute(t) ?? "", wE(e));
}
function HE(e) {
	let t = VE(e, sE), n = VE(e, cE), r = (e.getAttribute(dE) ?? "").split(" ").filter((e) => e.length > 0);
	return {
		min: t === null ? null : $E(t, "date"),
		max: n === null ? null : $E(n, "date"),
		marked: new Set(r),
		markedOnly: e.hasAttribute(fE)
	};
}
function UE(e, t) {
	return (e.min === null || t >= e.min) && (e.max === null || t <= e.max) && (!e.markedOnly || e.marked.has(t));
}
function WE(e, t, n) {
	let r = BE(e, n);
	if (r === null) return;
	let i = t === null ? "" : $E(t, wE(e));
	r.value !== i && (r.value = i, r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function GE(e, t) {
	let n = t.trim(), r = n.length === 0 ? null : Ja(n, TE(e), AE(e));
	return r === null ? n : $E(Ua(r), wE(e));
}
function KE(e) {
	if (!LE(e)) return;
	let t = {
		start: W(e, !1),
		end: W(e, !0)
	}, n = YT(t);
	n !== t && (WE(e, n.start, !1), WE(e, n.end, !0));
}
function qE(e) {
	let t = VE(e, sE), n = VE(e, cE);
	if (t === null && n === null) return null;
	for (let r of LE(e) ? [!1, !0] : [!1]) {
		let i = W(e, r);
		if (i !== null && t !== null && i.getTime() < t.getTime()) return {
			key: "ui.value.before",
			args: { min: Na(t, TE(e), AE(e)) }
		};
		if (i !== null && n !== null && i.getTime() > n.getTime()) return {
			key: "ui.value.after",
			args: { max: Na(n, TE(e), AE(e)) }
		};
	}
	return null;
}
function JE(e) {
	return XE(e, YE(e, /* @__PURE__ */ new Date()));
}
function YE(e, t) {
	let n = VE(e, sE), r = VE(e, cE);
	return n !== null && t.getTime() < n.getTime() ? n : r !== null && t.getTime() > r.getTime() ? r : t;
}
function XE(e, t) {
	let n = EE(e), r = new Date(t);
	return r.setMilliseconds(0), r.setSeconds(n.unit === "second" ? Math.floor(r.getSeconds() / n.second) * n.second : 0), n.unit === "hour" ? r.setMinutes(0) : r.setMinutes(Math.floor(r.getMinutes() / n.minute) * n.minute), r.setHours(Math.floor(r.getHours() / n.hour) * n.hour), r;
}
var ZE = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/;
function QE(e, t) {
	let n = e.trim();
	if (n.length === 0) return null;
	if (t === "time") {
		let e = ZE.exec(n);
		return e === null ? null : new Date(CE, 0, 1, Number(e[1]), Number(e[2]), Number(e[3] ?? "0"));
	}
	let r = Ha(n);
	return r === null ? null : Ua(r);
}
function $E(e, t) {
	let n = `${eD(e.getHours())}:${eD(e.getMinutes())}:${eD(e.getSeconds())}`;
	if (t === "time") return n;
	let r = `${String(e.getFullYear()).padStart(4, "0")}-${eD(e.getMonth() + 1)}-${eD(e.getDate())}`;
	return t === "date" ? r : `${r}T${n}`;
}
function eD(e) {
	return String(e).padStart(2, "0");
}
//#endregion
//#region src/interactions/temporal-calendar.ts
var tD = "ui-temporal-input__day", nD = "ui-temporal-input__month", rD = 3, iD = "data-ui-temporal-nav", aD = "data-ui-temporal-day", oD = 366;
function sD(e) {
	let t = zE(e);
	return {
		view: jD(t ?? YE(e, /* @__PURE__ */ new Date())),
		pane: "days",
		focusedDay: t,
		activeEnd: "start",
		hoverDay: null,
		choosingEnd: !1
	};
}
function cD(e, t, n, r) {
	let i = AD("div", `${U}__calendar`), a = AD("div", `${U}__calendar-header`), o = HE(e), s = kD("previous", "‹", E.text("ui.picker.previous"));
	s.disabled = lD(o, t, -1) === null, a.append(s);
	let c = kD("pane", t.pane === "days" ? `${n.monthNames[t.view.getMonth()]} ${t.view.getFullYear()}` : String(t.view.getFullYear()));
	c.classList.add(`${U}__calendar-label`), a.append(c);
	let l = kD("next", "›", E.text("ui.picker.next"));
	return l.disabled = lD(o, t, 1) === null, a.append(l), i.append(a), i.append(t.pane === "days" ? pD(e, t, n, r, o) : mD(t, n, o)), i;
}
function lD(e, t, n) {
	let r = t.pane === "months", i = PD(t.view, n * (r ? 12 : 1));
	return dD(e, uD(i, r ? 4 : 7)) ? fD(e, i) : null;
}
function uD(e, t) {
	return $E(e, "date").slice(0, t);
}
function dD(e, t) {
	return (e.min === null || t >= e.min.slice(0, t.length)) && (e.max === null || t <= e.max.slice(0, t.length));
}
function fD(e, t) {
	let n = uD(t, 7), r = e.min !== null && n < e.min.slice(0, 7) ? e.min : e.max !== null && n > e.max.slice(0, 7) ? e.max : null, i = r === null ? null : QE(r, "date");
	return i === null ? t : jD(i);
}
function pD(e, t, n, r, i) {
	let a = ED(e), o = AD("div", `${U}__weekdays`);
	for (let e = 0; e < 7; e++) {
		let t = AD("span", `${U}__weekday`);
		t.textContent = n.abbreviatedDayNames[(a + e) % 7], o.append(t);
	}
	let s = AD("div", `${U}__days`), c = ZT(/* @__PURE__ */ new Date()), l = LE(e), u = l ? W(e, !1) : r, d = l ? W(e, !0) : null, f = MD(t.view, a);
	for (let e = 0; e < 42; e++) {
		let n = ND(f, e), r = $E(n, "date"), a = AD("button", tD);
		a.type = "button", a.tabIndex = -1, a.textContent = String(n.getDate()), a.setAttribute(aD, r), n.getMonth() !== t.view.getMonth() && a.classList.add(`${tD}--outside`), FD(n, c) && (a.classList.add(`${tD}--today`), a.setAttribute("aria-current", "date")), i.marked.has(r) && a.classList.add(`${tD}--marked`);
		let o = u !== null && FD(n, u), p = d !== null && FD(n, d);
		a.setAttribute("aria-pressed", o || p ? "true" : "false"), (o || p) && a.classList.add(`${tD}--selected`), l && (o || p) && a.setAttribute("aria-description", E.text(o ? "ui.picker.start" : "ui.picker.end")), JT(n, {
			start: u,
			end: d
		}, t.choosingEnd) && a.classList.add(`${tD}--within`), UE(i, r) || (a.disabled = !0), s.append(a);
	}
	let p = AD("div", `${U}__calendar-pane`);
	return p.append(o, s), p;
}
function mD(e, t, n) {
	let r = AD("div", `${U}__months`);
	for (let i = 0; i < 12; i++) {
		let a = AD("button", nD);
		a.type = "button", a.textContent = t.abbreviatedMonthNames[i], a.setAttribute(iD, `month:${i}`), i === e.view.getMonth() && (a.classList.add(`${nD}--selected`), a.setAttribute("aria-current", "true")), dD(n, uD(Wa(e.view.getFullYear(), i, 1), 7)) || (a.disabled = !0), r.append(a);
	}
	let i = [...r.children];
	return M(i, i.find((e) => e.getAttribute("aria-current") === "true" && !e.disabled) ?? i.find((e) => !e.disabled) ?? null), r;
}
function hD(e, t) {
	let n = [...e.parentElement?.querySelectorAll(".ui-temporal-input__month") ?? []], r = n.indexOf(e), i = r === -1 ? null : gD(t, r % rD);
	if (i === null) return null;
	for (let e = r + i.offset; e >= 0 && e < n.length; e += i.step) if (!n[e].disabled) return n[e];
	return null;
}
function gD(e, t) {
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
			offset: rD,
			step: rD
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
function _D(e) {
	let t = AD("div", `${U}__period-caption`);
	return t.textContent = E.text(e.activeEnd === "end" ? "ui.picker.end" : "ui.picker.start"), t;
}
function vD(e, t, n) {
	let r = HE(e);
	if (n.startsWith("month:")) {
		let i = Wa(t.view.getFullYear(), Number(n.slice(6)), 1);
		return dD(r, uD(i, 7)) && (t.view = i, t.pane = "days", t.focusedDay = CD(r, SD(i, t.focusedDay ?? zE(e) ?? YE(e, /* @__PURE__ */ new Date())))), !0;
	}
	switch (n) {
		case "previous": return t.view = lD(r, t, -1) ?? t.view, !0;
		case "next": return t.view = lD(r, t, 1) ?? t.view, !0;
		case "pane": return t.pane = t.pane === "days" ? "months" : "days", !0;
		default: return !1;
	}
}
function yD(e, t, n) {
	if (LE(e)) {
		bD(e, t, n);
		return;
	}
	let r = XT(n, zE(e) ?? JE(e));
	t.focusedDay = r, t.view = jD(r), WE(e, r, !1);
}
function bD(e, t, n) {
	let r = KT({
		start: W(e, !1),
		end: W(e, !0)
	}, t.activeEnd, XT(n, JE(e)));
	t.focusedDay = r.end ?? r.start, t.view = jD(n), t.activeEnd = r.active, t.choosingEnd = !r.complete, t.hoverDay = null, WE(e, r.end, !0), WE(e, r.start, !1);
}
function xD(e, t, n, r = !1) {
	let i = wD(n), a = TD(t, n, ED(e), r);
	if (a === null) return null;
	let o = HE(e);
	if (i === 0) return CD(o, a);
	let s = a;
	for (let e = 0; e < oD; e++) {
		if (UE(o, $E(s, "date"))) return s;
		s = ND(s, i);
	}
	return t;
}
function SD(e, t) {
	let n = Wa(e.getFullYear(), e.getMonth() + 1, 0).getDate();
	return Wa(e.getFullYear(), e.getMonth(), Math.min(t.getDate(), n), t.getHours(), t.getMinutes(), t.getSeconds());
}
function CD(e, t) {
	let n = $E(t, "date"), r = e.min !== null && n < e.min ? e.min : e.max !== null && n > e.max ? e.max : null, i = r === null ? null : QE(r, "date");
	return i === null ? t : XT(i, t);
}
function wD(e) {
	switch (e) {
		case "ArrowLeft": return -1;
		case "ArrowRight": return 1;
		case "ArrowUp": return -7;
		case "ArrowDown": return 7;
		default: return 0;
	}
}
function TD(e, t, n, r) {
	let i = (e.getDay() - n + 7) % 7;
	switch (t) {
		case "ArrowLeft": return ND(e, -1);
		case "ArrowRight": return ND(e, 1);
		case "ArrowUp": return ND(e, -7);
		case "ArrowDown": return ND(e, 7);
		case "PageUp": return PD(e, r ? -12 : -1);
		case "PageDown": return PD(e, r ? 12 : 1);
		case "Home": return ND(e, -i);
		case "End": return ND(e, 6 - i);
		default: return null;
	}
}
function ED(e) {
	let t = Number(e.getAttribute(yE));
	return Number.isInteger(t) && t >= 0 && t <= 6 ? t : 1;
}
function DD(e, t, n, r) {
	let i = [...e.querySelectorAll(`.${tD}`)];
	if (i.length === 0) return;
	let a = $E(ZT(t.focusedDay ?? n ?? /* @__PURE__ */ new Date()), "date"), o = i.find((e) => e.getAttribute("data-ui-temporal-day") === a && !e.disabled) ?? i.find((e) => !e.disabled);
	o !== void 0 && (M(i, o), r && L(o));
}
function OD(e, t) {
	let n = t.activeEnd === "end" && t.hoverDay !== null ? W(e, !1) : null, r = t.hoverDay;
	for (let t of e.querySelectorAll(`.${tD}`)) {
		let e = QE(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		t.classList.toggle(`${tD}--preview`, e !== null && n !== null && r !== null && qT(e, n, ND(r, 1)));
	}
}
function kD(e, t, n) {
	let r = AD("button", `${U}__nav`);
	return r.type = "button", r.textContent = t, r.setAttribute(iD, e), n !== void 0 && r.setAttribute("aria-label", n), r;
}
function AD(e, t) {
	let n = document.createElement(e);
	return n.className = t, n;
}
function jD(e) {
	return Wa(e.getFullYear(), e.getMonth(), 1);
}
function MD(e, t) {
	let n = jD(e);
	return ND(n, -((n.getDay() - t + 7) % 7));
}
function ND(e, t) {
	return Wa(e.getFullYear(), e.getMonth(), e.getDate() + t, e.getHours(), e.getMinutes(), e.getSeconds());
}
function PD(e, t) {
	let n = Wa(e.getFullYear(), e.getMonth() + t, 1), r = Wa(n.getFullYear(), n.getMonth() + 1, 0).getDate();
	return Wa(n.getFullYear(), n.getMonth(), Math.min(e.getDate(), r), e.getHours(), e.getMinutes(), e.getSeconds());
}
function FD(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
//#endregion
//#region src/interactions/temporal-picker-engine.ts
var ID = "ui-temporal-input__field", LD = "ui-temporal-input__popup", RD = "ui-temporal-input--open", zD = "ui-calendar__body", BD = "ui-temporal-input__time-cell", VD = "ui-temporal-input__time-column", HD = 140, UD = "data-ui-temporal-toggle", WD = "data-ui-temporal-unit", GD = "data-ui-temporal-cell", KD = "data-ui-temporal-centred", qD = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	written = /* @__PURE__ */ new WeakSet();
	drawnLanguage = document.documentElement.lang;
	popups = new Jh({
		show: ({ owner: e, popup: t }) => {
			e.classList.add(RD), t.addEventListener("wheel", this.onColumnWheel, { passive: !1 }), this.renderSurface(e, !0);
		},
		hide: ({ owner: e, popup: t }) => {
			for (let e of this.columnSettles.values()) window.clearTimeout(e);
			this.columnSettles.clear(), this.wheelTurns.clear(), t.removeEventListener("wheel", this.onColumnWheel), e.classList.remove(RD);
		}
	});
	columnSettles = /* @__PURE__ */ new Map();
	wheelTurns = /* @__PURE__ */ new Map();
	onColumnWheel = (e) => this.handleColumnWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.arrive(this.root.querySelectorAll($T)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = pa(e.components, $T), n = e.propertyName === "Value" || e.propertyName === "EndValue";
			this.applyDisplay(t);
			for (let e of t) n && JD(e) && this.states.set(e, sD(e)), this.isShowing(e) && this.renderSurface(e);
		}), z(this.root, $T, { attributeFilter: [...SE] }, (e) => {
			for (let t of e) this.applyDisplay([t]), this.isShowing(t) && this.renderSurface(t);
		}), z(this.root, $T, { childList: !0 }, (e) => this.arrive(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), this.root.addEventListener("focusin", (e) => this.handleFieldFocus(e), !0), this.root.addEventListener("mouseover", (e) => this.handleDayHover(e), !0), this.root.addEventListener("mouseout", (e) => this.handleDayHover(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("scroll", (e) => this.handleColumnScroll(e), !0), this.root.addEventListener("blur", (e) => this.handleFieldBlur(e), !0), E.onChange(() => this.applyWords());
	}
	arrive(e) {
		let t = [...e];
		this.applyDisplay(t);
		for (let e of t) JD(e) && YD(e)?.firstElementChild === null && this.renderSurface(e);
	}
	applyWords() {
		let e = [...this.root.querySelectorAll($T)], t = E.temporal;
		if (t !== null && E.language !== this.drawnLanguage) {
			this.drawnLanguage = E.language;
			for (let n of e) ME(n, t);
		}
		this.applyDisplay(e);
		for (let t of e) this.isShowing(t) && this.renderSurface(t);
	}
	get openPicker() {
		return this.popups.current;
	}
	isShowing(e) {
		return e === this.openPicker || JD(e);
	}
	calendarFor(e) {
		if (!(e instanceof Element)) return null;
		let t = e.closest(`.${zD}`)?.closest(".ui-calendar") ?? null;
		if (t !== null) return t;
		let n = this.openPicker;
		return n !== null && YD(n)?.contains(e) === !0 ? n : null;
	}
	applyDisplay(e) {
		for (let t of e) {
			let e = Ka(TE(t), cO()), n = La(TE(t)) ? "numeric" : "text";
			for (let r of t.querySelectorAll(`.${ID}`)) {
				if (r.placeholder !== e && (r.placeholder = e), r.inputMode !== n && (r.inputMode = n), r === document.activeElement && this.written.has(r)) continue;
				this.written.add(r);
				let i = BE(t, RE(r))?.value ?? "", a = QE(i, wE(t));
				if (a !== null) {
					r.value = Na(a, TE(t), AE(t));
					continue;
				}
				i.length === 0 && (r.value = "");
			}
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(ID)) return;
		let t = e.target.closest(`.${U}`), n = t === null ? null : BE(t, RE(e.target));
		if (t === null || n === null) return;
		let r = GE(t, e.target.value), i = QE(r, wE(t)), a = i === null ? r : $E(i, wE(t));
		if (XD(t, a)) {
			let n = W(t, RE(e.target));
			e.target.value = n === null ? "" : Na(n, TE(t), AE(t));
			return;
		}
		RE(e.target) && (this.getState(t).choosingEnd = !1), n.value = a, n.dispatchEvent(new Event("change", { bubbles: !0 })), KE(t), this.applyDisplay([t]);
	}
	handleFieldFocus(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(ID)) return;
		let t = e.target.closest(`.${U}`);
		t !== null && LE(t) && (this.getState(t).activeEnd = RE(e.target) ? "end" : "start");
	}
	handleDayHover(e) {
		let t = this.calendarFor(e.target);
		if (t === null || !(e.target instanceof Element) || !LE(t)) return;
		let n = e.type === "mouseover" ? e.target.closest(`[${aD}]`) : null, r = this.getState(t), i = n === null ? null : QE(n.getAttribute("data-ui-temporal-day") ?? "", "date");
		(r.hoverDay?.getTime() ?? null) !== (i?.getTime() ?? null) && (r.hoverDay = i, OD(t, r));
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`[${aD}], .${BD}`) : null, n = this.calendarFor(t);
		n === null || t === null || t === document.activeElement || t.matches(":disabled") || (t.classList.contains(BD) ? dO(t) : this.followPointer(n, t));
	}
	followPointer(e, t) {
		let n = YD(e), r = QE(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		n === null || r === null || !n.contains(document.activeElement) || (this.getState(e).focusedDay = r, M([...n.querySelectorAll(`.${tD}`)], t), Ed(t));
	}
	handleFieldBlur(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(ID)) return;
		let t = e.target.closest(`.${U}`);
		t !== null && this.applyDisplay([t]);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${UD}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${U}`));
			return;
		}
		let n = this.calendarFor(e.target);
		if (n === null) return;
		let r = e.target.closest(`[${iD}]`);
		if (r !== null) {
			e.preventDefault(), this.applyNavigation(n, r.getAttribute("data-ui-temporal-nav") ?? "");
			return;
		}
		let i = e.target.closest(`[${aD}]`);
		if (i !== null) {
			e.preventDefault(), this.chooseDay(n, i.getAttribute("data-ui-temporal-day") ?? "");
			return;
		}
		let a = e.target.closest(`[${GD}]`);
		if (a !== null) {
			e.preventDefault();
			let t = a.closest(`[${WD}]`)?.getAttribute(WD);
			t != null && this.chooseTime(n, t, Number(a.getAttribute(GD)));
		}
	}
	applyNavigation(e, t) {
		let n = this.getState(e);
		if (vD(e, n, t)) {
			this.renderSurface(e);
			return;
		}
		switch (t) {
			case "now":
				n.choosingEnd = !1, this.commit(e, JE(e), n.activeEnd === "end");
				return;
			case "clear":
				this.commit(e, null), LE(e) && this.commit(e, null, !0), n.activeEnd = "start", n.choosingEnd = !1, this.close();
				return;
			case "done":
				this.close();
				return;
			default: return;
		}
	}
	chooseDay(e, t) {
		let n = QE(t, "date");
		if (n === null || k(e) || D(e) || !UE(HE(e), t)) return;
		let r = this.getState(e);
		JD(e) && LE(e) && !r.choosingEnd && W(e, !1) !== null && W(e, !0) !== null && (r.activeEnd = "start");
		let i = BE(e, !1), a = `${i?.value ?? ""}|${BE(e, !0)?.value ?? ""}`;
		yD(e, r, n), JD(e) && `${i?.value ?? ""}|${BE(e, !0)?.value ?? ""}` === a && i?.dispatchEvent(new Event("change", { bubbles: !0 })), this.applyDisplay([e]), this.renderSurface(e);
	}
	chooseTime(e, t, n) {
		if (!Number.isFinite(n)) return;
		let r = LE(e) && this.getState(e).activeEnd === "end", i = kE(W(e, r) ?? JE(e), t, n);
		this.commit(e, i, r);
	}
	commit(e, t, n = !1) {
		WE(e, t, n), KE(e), this.applyDisplay([e]), this.isShowing(e) && this.renderSurface(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || A(e)) return;
		if (e.key === "ArrowDown" && j(e, { alt: !0 }) && e.target instanceof HTMLElement && e.target.classList.contains(ID)) {
			e.preventDefault(), this.toggle(e.target.closest(`.${U}`), RE(e.target) ? "end" : "start");
			return;
		}
		let t = this.calendarFor(e.target);
		if (t === null) return;
		if (e.target instanceof HTMLElement && e.target.classList.contains(BD)) {
			j(e) && pO(e);
			return;
		}
		if (e.target instanceof HTMLElement && e.target.classList.contains("ui-temporal-input__month")) {
			j(e) && fO(e, e.target);
			return;
		}
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains("ui-temporal-input__day") || !j(e, { shift: e.key === "PageUp" || e.key === "PageDown" })) return;
		let n = QE(e.target.getAttribute("data-ui-temporal-day") ?? "", "date");
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault(), this.chooseDay(t, $E(n, "date"));
			return;
		}
		let r = xD(t, n, e.key, e.shiftKey);
		if (r === null) return;
		e.preventDefault();
		let i = this.getState(t);
		i.focusedDay = r, i.view = jD(r), this.renderSurface(t, !0);
	}
	handleColumnScroll(e) {
		if (this.openPicker === null || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${VD}`);
		t === null || !this.openPicker.contains(t) || (window.clearTimeout(this.columnSettles.get(t)), this.columnSettles.set(t, window.setTimeout(() => {
			this.columnSettles.delete(t), this.chooseCentredTime(t);
		}, HD)));
	}
	handleColumnWheel(e) {
		if (this.openPicker === null || e.deltaY === 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${VD}`), n = t?.getAttribute(WD) ?? null;
		if (t === null || n === null || !this.openPicker.contains(t)) return;
		e.preventDefault();
		let { steps: r, carried: i } = iv(this.wheelTurns.get(n) ?? 0, rv(e).y);
		if (this.wheelTurns.set(n, i), r === 0) return;
		let a = [...t.querySelectorAll(`.${BD}`)].filter((e) => !e.disabled), o = a.findIndex((e) => e.classList.contains(`${BD}--selected`)), s = a[Math.min(a.length - 1, Math.max(0, Math.max(0, o) + r))];
		s !== void 0 && !s.classList.contains(`${BD}--selected`) && this.chooseTime(this.openPicker, n, Number(s.getAttribute(GD)));
	}
	chooseCentredTime(e) {
		let t = this.openPicker;
		if (t === null || !t.contains(e)) return;
		let n = Number(e.getAttribute(KD));
		if (Number.isFinite(n) && Math.abs(e.scrollTop - n) <= 1) return;
		let r = e.getAttribute(WD), i = rO(e);
		if (!(r === null || i === null || i.classList.contains(`${BD}--selected`))) {
			if (i.matches(":disabled")) {
				tO(t);
				return;
			}
			this.chooseTime(t, r, Number(i.getAttribute(GD)));
		}
	}
	toggle(e, t) {
		let n = e?.querySelector(`.${LD}`) ?? null;
		if (e === null || n === null) return;
		if (this.openPicker === e) {
			this.close();
			return;
		}
		this.close();
		let r = this.getState(e);
		r.activeEnd = LE(e) ? t ?? (W(e, !1) === null ? "start" : W(e, !0) === null ? "end" : r.activeEnd) : "start", r.hoverDay = null, r.choosingEnd = !1;
		let i = W(e, r.activeEnd === "end") ?? zE(e);
		r.pane = "days", r.view = jD(i ?? YE(e, /* @__PURE__ */ new Date())), r.focusedDay = i;
		let a = e.querySelector(`[${UD}]`);
		this.popups.open({
			owner: e,
			popup: n,
			anchor: e.querySelector(".ui-temporal-input__row") ?? e,
			placement: { placement: "bottom-end" },
			openers: a === null ? [] : [a],
			returnFocus: () => uO(e, this.getState(e).activeEnd === "end")
		});
	}
	close() {
		this.popups.close();
	}
	getState(e) {
		let t = this.states.get(e);
		return t === void 0 && (t = sD(e), this.states.set(e, t)), t;
	}
	renderSurface(e, t = !1) {
		let n = YD(e);
		if (n === null) return;
		let r = JD(e), i = wE(e), a = this.getState(e), o = AE(e), s = LE(e), c = W(e, s && a.activeEnd === "end"), l = iO(n), u = aO(n), d = n.contains(document.activeElement);
		if (n.replaceChildren(), s && n.append(_D(a)), r) n.append(cD(e, a, o, c));
		else {
			let t = AD("div", `${U}__panes`);
			t.append(cD(e, a, o, c)), i === "date-time" && t.append(ZD(e, c)), n.append(t, sO(i));
		}
		let f = u === null ? null : n.querySelector(`[${iD}="${wi(u)}"]:not(:disabled)`);
		DD(n, a, c, t || d && l === null && f === null), OD(e, a), r || (eO(n), tO(n), oO(n, l)), f !== null && L(f), r || this.popups.reposition(e);
	}
};
function JD(e) {
	return e.classList.contains(QT);
}
function YD(e) {
	return e.querySelector(`.${JD(e) ? zD : LD}`);
}
function XD(e, t) {
	let n = HE(e), r = n.markedOnly ? QE(t, wE(e)) : null;
	return r !== null && !n.marked.has($E(r, "date"));
}
function ZD(e, t) {
	let n = EE(e), r = AD("div", `${U}__time`), i = AD("div", `${U}__time-columns`);
	for (let r of QD(n)) i.append($D(e, r, DE(n, r), t));
	return r.append(i), r;
}
function QD(e) {
	return e.unit === "second" ? [
		"hour",
		"minute",
		"second"
	] : e.unit === "hour" ? ["hour"] : ["hour", "minute"];
}
function $D(e, t, n, r) {
	let i = AD("div", VD);
	i.setAttribute(WD, t), i.setAttribute("role", "listbox"), i.setAttribute("aria-label", E.text(t === "hour" ? "ui.picker.hours" : t === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"));
	let a = t === "hour" ? 24 : 60, o = r === null ? null : OE(r, t), s = t === "hour" && NE(TE(e)), c = AE(e), l = null;
	for (let u = 0; u < a; u += n) {
		let n = AD("button", BD);
		n.type = "button", n.tabIndex = -1, n.textContent = t === "hour" ? PE(u, s, c) : String(u).padStart(2, "0"), n.setAttribute(GD, String(u)), n.setAttribute("role", "option"), n.setAttribute("aria-selected", u === o ? "true" : "false"), u === o && n.classList.add(`${BD}--selected`), _O(e, t, u, r) ? n.disabled = !0 : (l === null || u === o) && (l = n), i.append(n);
	}
	return l !== null && (l.tabIndex = 0), i;
}
function eO(e) {
	let t = e.querySelector(`.${U}__calendar`), n = e.querySelector(`.${U}__time-columns`);
	t !== null && n !== null && (n.style.maxHeight = `${t.clientHeight}px`);
}
function tO(e) {
	for (let t of e.querySelectorAll(`.${VD}`)) {
		let e = t.querySelector(`.${BD}--selected`) ?? t.firstElementChild;
		if (!(e instanceof HTMLElement)) continue;
		let n = Math.max(0, (t.clientHeight - e.getBoundingClientRect().height) / 2);
		t.style.paddingTop = `${n}px`, t.style.paddingBottom = `${n}px`, nO(t, e), t.setAttribute(KD, String(t.scrollTop));
	}
}
function nO(e, t) {
	let n = t.getBoundingClientRect();
	e.scrollTop += n.top - e.getBoundingClientRect().top - (e.clientHeight - n.height) / 2;
}
function rO(e) {
	let t = e.getBoundingClientRect().top + e.clientHeight / 2, n = null, r = Infinity;
	for (let i of e.querySelectorAll(`.${BD}`)) {
		let e = i.getBoundingClientRect(), a = Math.abs(e.top + e.height / 2 - t);
		a < r && (r = a, n = i);
	}
	return n;
}
function iO(e) {
	let t = document.activeElement;
	return !(t instanceof HTMLElement) || !e.contains(t) || !t.classList.contains(BD) ? null : t.closest(`.${VD}`)?.getAttribute(WD) ?? null;
}
function aO(e) {
	let t = document.activeElement;
	return t instanceof HTMLElement && e.contains(t) ? t.getAttribute(iD) : null;
}
function oO(e, t) {
	if (t === null) return;
	let n = e.querySelector(`.${VD}[${WD}="${t}"]`)?.querySelector(`.${BD}--selected`) ?? null;
	n !== null && L(n);
}
function sO(e) {
	let t = AD("div", `${U}__popup-footer`);
	return t.append(kD("now", E.text(e === "date" ? "ui.picker.today" : "ui.picker.now"))), t.append(kD("clear", E.text("ui.picker.clear"))), t.append(kD("done", E.text("ui.picker.done"))), t;
}
function cO() {
	return {
		year: lO("ui.picker.letter.year", Ga.year),
		month: lO("ui.picker.letter.month", Ga.month),
		day: lO("ui.picker.letter.day", Ga.day),
		hour: lO("ui.picker.letter.hour", Ga.hour),
		minute: lO("ui.picker.letter.minute", Ga.minute),
		second: lO("ui.picker.letter.second", Ga.second)
	};
}
function lO(e, t) {
	let n = E.lookup(e);
	return n === void 0 || n.trim().length === 0 ? t : n;
}
function uO(e, t) {
	for (let n of e.querySelectorAll(`.${ID}`)) if (RE(n) === t) return n;
	return e.querySelector(`.${ID}`);
}
function dO(e) {
	let t = document.activeElement;
	t instanceof HTMLElement && t.classList.contains(BD) && Ed(e);
}
function fO(e, t) {
	if (!al(e.key, "both")) return;
	e.preventDefault();
	let n = hD(t, e.key);
	sl([...n?.parentElement?.children ?? []], n);
}
function pO(e) {
	let t = e.target, n = t.closest(`.${VD}`);
	if (n === null) return;
	let r = e.key === "ArrowLeft" || e.key === "ArrowRight" ? hO(n, e.key === "ArrowRight" ? 1 : -1) : mO(n, t, e.key);
	r !== null && (e.preventDefault(), r.focus({ preventScroll: !0 }), gO(r));
}
function mO(e, t, n) {
	let r = [...e.querySelectorAll(`.${BD}`)];
	return n === "PageUp" || n === "PageDown" ? Uu(n, r.filter(N), t, "vertical") ?? t : il({
		key: n,
		items: r,
		current: t,
		axis: "vertical",
		loop: !1
	});
}
function hO(e, t) {
	let n = [...e.parentElement?.querySelectorAll(`.${VD}`) ?? []], r = n[n.indexOf(e) + t];
	return r === void 0 ? null : r.querySelector(`.${BD}--selected`) ?? r.querySelector(`.${BD}:not(:disabled)`);
}
function gO(e) {
	let t = e.closest(`.${VD}`);
	t !== null && nO(t, e);
}
function _O(e, t, n, r) {
	let i = VE(e, sE), a = VE(e, cE);
	if (i === null && a === null) return !1;
	let o = kE(r ?? JE(e), t, n), s = new Date(o), c = new Date(o);
	return t === "hour" ? (s.setMinutes(0, 0, 0), c.setMinutes(59, 59, 999)) : t === "minute" && (s.setSeconds(0, 0), c.setSeconds(59, 999)), i !== null && c.getTime() < i.getTime() || a !== null && s.getTime() > a.getTime();
}
//#endregion
//#region src/rendering/theme-choice.ts
var vO = `[${kr}="${jr}"] [${Ar}]`, yO = "ui-theme-switcher__label-text--current";
function bO() {
	let e = document.documentElement.getAttribute(wr);
	return e === "light" || e === "dark" ? e : "auto";
}
function xO(e, t) {
	let n = e.getAttribute(Ar) === t;
	if (e.getAttribute("role") === "option") {
		let t = n ? "true" : "false";
		e.getAttribute("aria-selected") !== t && e.setAttribute("aria-selected", t);
	} else e.classList.toggle(yO, n);
}
//#endregion
//#region src/interactions/popup-list.ts
var SO = new $b();
function CO(e, t, n, r, i = !1, a = !0) {
	let o = r ?? (a ? null : n.find(N) ?? null);
	o !== null && M(n, o);
	let s = e.open({
		...t,
		focus: a && r !== null ? r : !1
	});
	return s && a && r === null && Hd(t.popup, n, i), s;
}
function wO(e, t) {
	let n = e.target instanceof HTMLElement && t.includes(e.target) ? e.target : null, r = ex(e);
	if (r !== null) return e.preventDefault(), sl(t, EO(t, n, r)), !0;
	if (!al(e.key, "vertical") || !j(e)) return !1;
	let i = il({
		key: e.key,
		items: t,
		current: n,
		axis: "vertical"
	});
	return i !== null && e.preventDefault(), sl(t, i), !0;
}
var TO = {
	character: ex,
	entry: EO
};
function EO(e, t, n) {
	let r = e.filter(N), i = r[0]?.parentElement;
	return i == null ? null : SO.next({
		owner: i,
		character: n,
		entries: r,
		current: t,
		words: Rm,
		context: i
	});
}
function DO(e, t) {
	e === document.activeElement || !N(e) || (M(t, e), Ed(e));
}
//#endregion
//#region src/interactions/switcher-list.ts
var OO = class {
	parts;
	selector;
	menus;
	constructor(e) {
		this.parts = e, this.selector = `[${e.attribute}]`, this.menus = new Jh({
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
		return e.getAttribute(this.parts.attribute) === jr;
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
		CO(this.menus, {
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
		if (i !== null && t(n, r) && !this.menus.isOpen(n) && (e.key === "ArrowDown" || e.key === "ArrowUp") && j(e)) {
			e.preventDefault(), this.open(n, i, e.key === "ArrowUp");
			return;
		}
		this.menus.isOpen(n) && wO(e, r);
	}
	handlePointerMove(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${this.parts.choiceClass}`), n = t === null ? null : this.switcherOf(t);
		t !== null && n !== null && this.menus.isOpen(n) && DO(t, this.choicesOf(n));
	}
}, kO = `[${kr}="${jr}"]`, AO = "ui-theme-switcher__choice", jO = class {
	options;
	root;
	list = new OO({
		attribute: kr,
		menuClass: "ui-theme-switcher__menu",
		choiceClass: AO,
		openClass: "ui-theme-switcher--open",
		triggerSelector: `.${li}`
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.list.handleKeyDown(e, (e) => this.list.isField(e))), this.root.addEventListener("pointermove", (e) => this.list.handlePointerMove(e)), new MutationObserver(() => this.showTheme()).observe(document.documentElement, {
			attributes: !0,
			attributeFilter: [wr]
		}), z(this.root, kO, { childList: !0 }, (e) => this.showTheme(e)), this.showTheme();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.list.switcherOf(e.target);
		if (t === null) return;
		if (!this.list.isField(t)) {
			if (t.hasAttribute("disabled")) return;
			e.preventDefault(), this.apply(MO() === "dark" ? "Light" : "Dark");
			return;
		}
		let n = e.target.closest(`.${AO}`);
		if (n !== null) {
			e.preventDefault(), this.choose(t, n.getAttribute(Ar));
			return;
		}
		let r = e.target.closest(`.${li}`);
		r === null || D(r) || (e.preventDefault(), this.list.toggle(t, r));
	}
	choose(e, t) {
		this.list.close(e), t !== null && this.apply(t === "light" ? "Light" : t === "dark" ? "Dark" : null);
	}
	apply(e) {
		this.options.effects.apply({
			effect: {
				kind: ki.SetTheme,
				mode: e
			},
			dom: this.options.dom
		});
	}
	showTheme(e) {
		let t = bO();
		if (e === void 0) {
			for (let e of this.root.querySelectorAll(vO)) xO(e, t);
			return;
		}
		for (let n of e) for (let e of n.querySelectorAll(`[${Ar}]`)) xO(e, t);
	}
};
function MO() {
	let e = bO();
	return e === "light" || e === "dark" ? e : window.matchMedia?.("(prefers-color-scheme: dark)").matches === !0 ? "dark" : "light";
}
//#endregion
//#region src/interactions/language-switcher-engine.ts
var NO = `.ui-language-switcher__trigger, .${li}`, PO = "ui-language-switcher__label-text", FO = "ui-language-switcher__label-text--current", IO = "ui-language-switcher__label-text--page", LO = "ui-language-switcher__choice", RO = "ui.language.switch", zO = "ui.language.current", BO = class {
	options;
	root;
	list = new OO({
		attribute: Or,
		menuClass: "ui-language-switcher__menu",
		choiceClass: LO,
		openClass: "ui-language-switcher--open",
		triggerSelector: NO
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.list.handleKeyDown(e, (e, t) => this.opensList(e, t))), this.root.addEventListener("pointermove", (e) => this.list.handlePointerMove(e)), E.onChange(() => this.showLanguage(E.language));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${LO}`), n = this.list.switcherOf(e.target);
		if (n === null) return;
		if (t !== null) {
			e.preventDefault(), this.choose(n, t.getAttribute(Mr));
			return;
		}
		let r = e.target.closest(NO);
		if (r === null || D(r)) return;
		e.preventDefault();
		let i = this.list.choicesOf(n);
		if (i.length === 2 && !this.list.isField(n)) {
			let e = E.requestedLanguage;
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
				kind: ki.SetLanguage,
				language: t
			},
			dom: this.options.dom
		});
	}
	showLanguage(e) {
		for (let t of this.root.querySelectorAll(`[${Or}]`)) {
			let n = t.querySelector(`:scope > :is(${NO})`);
			if (n === null) continue;
			let r = this.list.choicesOf(t), i = this.list.chosenAttribute(t);
			for (let t of r) t.setAttribute(i, t.getAttribute("data-ui-language") === e ? "true" : "false");
			for (let t of n.querySelectorAll(`.${PO}`)) {
				let n = t.getAttribute(Mr) === e;
				t.classList.toggle(FO, n), t.classList.contains(IO) && t.toggleAttribute("hidden", !n);
			}
			if (this.list.isField(t)) continue;
			let a = t.getAttribute(Ie) === n.getAttribute("aria-label"), o = (r.find((t) => t.getAttribute("data-ui-language") !== e) ?? r[0]).getAttribute("data-ui-language") ?? "", [s, c] = r.length === 2 ? [RO, {
				language: VO(r, e),
				code: HO(e),
				other: VO(r, o),
				otherCode: HO(o)
			}] : [zO, {
				language: VO(r, e),
				code: HO(e)
			}];
			E.write(n, "aria-label", s, c), a && E.write(t, Ie, s, c);
		}
	}
};
function VO(e, t) {
	let n = e.find((e) => e.getAttribute(Mr) === t)?.textContent;
	if (n != null && n.length > 0) return n;
	try {
		let e = new Intl.DisplayNames([t], { type: "language" }).of(t) ?? t;
		return e.charAt(0).toLocaleUpperCase(t) + e.slice(1);
	} catch {
		return HO(t);
	}
}
function HO(e) {
	return e.split("-")[0].toUpperCase();
}
//#endregion
//#region src/interactions/action-bar.ts
var UO = `${Ae}__button`, WO = `${Ae}__more`, GO = `${UO}--icon`, KO = "ui-text__icon", qO = `.ui-button__content .${KO}`, JO = ".ui-button__content .ui-text__title", YO = /* @__PURE__ */ new WeakMap();
function XO(e) {
	let t = [], n = !1;
	for (let r of e.querySelectorAll(Dn)) ZO(r, e) && (r.hasAttribute("data-ui-in-action-bar") && !r.matches(En) ? t.push(r) : n = !0);
	return {
		entries: t,
		more: n
	};
}
function ZO(e, t) {
	for (let n = e; n !== null && n !== t; n = n.parentElement) if (!n.hasAttribute("data-ui-menu-left-out") && getComputedStyle(n).display === "none") return !1;
	return getComputedStyle(e).visibility !== "hidden";
}
function QO(e, t) {
	let n = t.entries.map((e) => $O(e, t));
	return t.more && t.openMore !== void 0 && n.push(tk(t.openMore)), e.replaceChildren(...n), n;
}
function $O(e, t) {
	let n = nk(UO), r = ik(e), i = ek(e);
	return i === null ? n.textContent = r : (n.classList.add(GO), n.append(i), n.setAttribute("aria-label", r)), t.role === "menuitem" && n.setAttribute("role", "menuitem"), D(e) && (n.classList.add($r), n.setAttribute("aria-disabled", "true")), e.getAttribute("data-ui-menu-item-kind") === "check" && n.setAttribute("aria-pressed", e.getAttribute("aria-checked") === "true" ? "true" : "false"), YO.set(n, e), n.addEventListener("click", () => t.press(e, n)), n;
}
function ek(e) {
	let t = e.querySelector(qO);
	if (t === null || !t.className.split(" ").some(yh)) return null;
	let n = document.createElement("span");
	n.className = t.className, n.classList.remove(KO), n.setAttribute(hh, ""), n.setAttribute("aria-hidden", "true");
	let r = t.style.getPropertyValue(gh);
	return r.length > 0 && n.style.setProperty(gh, r), n;
}
function tk(e) {
	let t = nk(`${UO} ${WO}`);
	return t.setAttribute("aria-haspopup", "menu"), E.write(t, "aria-label", "ui.actionbar.more"), t.addEventListener("click", () => e(t)), t;
}
function nk(e) {
	let t = document.createElement("button");
	return t.setAttribute("type", "button"), t.className = `${e} ${fi}`, t.tabIndex = -1, t;
}
function rk(e) {
	return YO.get(e) ?? null;
}
function ik(e) {
	return e.querySelector(JO)?.textContent?.trim() ?? "";
}
//#endregion
//#region src/interactions/long-press.ts
var ak = 500, ok = 10, sk = /* @__PURE__ */ new WeakSet();
function ck(e) {
	return sk.has(e);
}
var lk = class {
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
			timer: setTimeout(() => this.fireHeld(), ak)
		};
	}
	handleMove(e) {
		let t = e, n = this.press, r = this.openedAt;
		r !== null && t.pointerId === r.pointerId && Math.hypot((t.clientX ?? r.x) - r.x, (t.clientY ?? r.y) - r.y) > ok && (this.slid = !0, (this.answered?.closest("[data-ui-splitting]") ?? null) !== null && this.leaveMenuToDrag()), n !== null && t.pointerId === n.pointerId && Math.hypot((t.clientX ?? n.x) - n.x, (t.clientY ?? n.y) - n.y) > ok && this.cancel();
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
		sk.add(t), e.target.dispatchEvent(t), this.answered = t.defaultPrevented ? e.target : null, this.openedAt = this.answered === null ? null : {
			pointerId: e.pointerId,
			x: e.x,
			y: e.y
		};
	}
	handleContextMenu(e) {
		if (!sk.has(e)) {
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
		!this.dragging || n === null || t.clientX === void 0 || t.clientY === void 0 || Math.hypot(t.clientX - n.x, t.clientY - n.y) > ok && this.leaveMenuToDrag();
	}
	endDrag() {
		this.dragging = !1;
	}
	handleClick(e) {
		let t = e.target instanceof Element ? e.target : null;
		this.answered === null || t === null || this.slid && t.closest("[data-ui-context-menu]") !== null || (this.answered = null, e.preventDefault(), e.stopImmediatePropagation());
	}
}, uk = [
	Qf("md"),
	Qf("xl"),
	Qf("xxl")
], dk = {
	md: Qf("md"),
	xl: Qf("xl"),
	xxl: Qf("xxl")
}, fk = Qf("md");
function pk(e, t) {
	return mk(e) && !(e.hasAttribute(mn(t)) && !gk(e, t) && hk(fk));
}
function mk(e) {
	let t = e.getAttribute(fn);
	if (t === null) return !1;
	let n = dk[t];
	return n === void 0 || !hk(n);
}
function hk(e) {
	return typeof matchMedia == "function" && matchMedia(e).matches;
}
function gk(e, t) {
	return e.querySelector(`:scope > [${vn}="${wi(t)}"][${hn}]`) !== null;
}
//#endregion
//#region src/state/client-store.ts
var _k = "ne.ui", vk = "boot", yk = /* @__PURE__ */ new Set(), bk = class {
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
		let r = this.resolveKey(e, vk);
		if (r !== null) try {
			let e = xk(window.localStorage.getItem(r));
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
		let n = e.getAttribute(We);
		if (n === null || n.length === 0) {
			let n = `${e.tagName}:${t}`;
			return yk.has(n) || (yk.add(n), l("client state is not kept for a component with no authored id.", {
				slot: t,
				component: e
			})), null;
		}
		return `${_k}:${n}:${t}`;
	}
};
function xk(e) {
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
var Sk = "menu-current", Ck = `[${Xt}]`;
function wk(e) {
	for (let t = e.closest(Ck); t !== null; t = t.parentElement?.closest(Ck) ?? null) Ek(t);
}
function Tk(e) {
	for (let t of e.querySelectorAll(Ck)) Ek(t);
	wk(e);
}
function Ek(e) {
	let t = e.querySelector(`.${Sn}`) !== null;
	e.hasAttribute("data-ui-menu-holds-current") !== t && e.toggleAttribute($t, t);
}
//#endregion
//#region src/updates/menu-icons.ts
var Dk = "menu-icons", Ok = "ui-menu__host", kk = `:scope > :not([${tn}]) > .${x}[${gi}]`;
function Ak(e) {
	let t = e.closest(`.${Ok}`);
	t !== null && Mk(t);
}
function jk(e) {
	for (let t of e.querySelectorAll(`.${Ok}`)) Mk(t);
}
function Mk(e) {
	let t = e.querySelector(kk) !== null;
	e.hasAttribute("data-ui-menu-icons") !== t && e.toggleAttribute(en, t);
}
//#endregion
//#region src/interactions/menu-group-engine.ts
var Nk = "ui-menu__submenu", Pk = Xt, Fk = Qt, Ik = "data-ui-menu-flyout", Lk = `[${Ik}], ${ai}`, Rk = "data-ui-menu-unfolded", zk = Zt, Bk = "data-ui-menu-rail-list", Vk = "left-side", Hk = "[data-ui-root]", Uk = "menu-open-group", Wk = R.normal * 5, Gk = Je("click"), Kk = class {
	root;
	store = new bk();
	seenCollapsed = /* @__PURE__ */ new WeakMap();
	flyouts = new Jh({
		show: ({ owner: e, popup: t }) => {
			e.setAttribute(Fk, ""), t.setAttribute(Ik, "");
		},
		hide: ({ owner: e, popup: t }) => {
			e.removeAttribute(Fk), queueMicrotask(() => Yf(t, Wk, () => {
				this.flyouts.isOpen(e) || t.removeAttribute(Ik);
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
		let t = this.root.querySelectorAll(`.${bn}`);
		Zk(t), this.reconcileEach(t);
		for (let e of t) Tk(e), jk(e);
		z(this.root, `.${bn}`, {
			childList: !0,
			attributeFilter: [Yt]
		}, (e) => {
			Zk(e), this.reconcileEach(e);
			for (let t of e) Tk(t), jk(t);
		});
		for (let e of this.root.querySelectorAll(`[${Pk}]`)) qk(e);
		if (z(this.root, `[${Pk}]`, {
			childList: !0,
			attributeFilter: [Fk]
		}, (e) => {
			for (let t of e) qk(t);
		}), typeof matchMedia == "function") for (let e of uk) matchMedia(e).addEventListener("change", () => {
			this.closeBarFlyout(), this.refitDrawerRails();
		});
		z(this.root, Hk, { attributeFilter: [mn(Vk)] }, () => this.refitDrawerRails());
	}
	refitDrawerRails() {
		let e = this.root.querySelectorAll(`[${gn}] .${bn}`);
		Zk(e), this.reconcileEach(e);
	}
	closeBarFlyout() {
		let e = this.flyouts.current;
		e !== null && e.closest("[data-ui-bottom-bar]") !== null && this.flyouts.close(e);
	}
	reconcileEach(e) {
		for (let t of e) {
			let e = rA(t), n = this.seenCollapsed.get(t);
			n !== e && (this.seenCollapsed.set(t, e), n === void 0 ? this.restore(t, e) : this.handleCollapsedChange(t, e));
		}
	}
	restore(e, t) {
		t ? this.closeGroups(e) : this.openResolvedGroup(e);
	}
	handleCollapsedChange(e, t) {
		this.flyouts.close(), Jk(e), this.closeGroups(e), e.hasAttribute("data-ui-folding") && e.setAttribute(Rk, ""), t || this.openResolvedGroup(e);
		for (let t of e.querySelectorAll(`[${Pk}]`)) qk(t);
	}
	openResolvedGroup(e) {
		let t = this.groupOf(e.querySelector(`.${Sn}`), e);
		if (t !== null && !t.hasAttribute(zk)) {
			this.openInline(t);
			return;
		}
		let n = e.classList.contains("ui-menu--nested") ? null : this.store.read(e, Uk), r = n === null ? null : this.findGroup(e, n);
		r !== null && this.openInline(r);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${x}`), n = this.flyouts.current, r = n === null ? null : this.submenuOf(n);
		if (t !== null && r !== null && r.contains(t)) {
			Qk(t) && this.flyouts.close();
			return;
		}
		let i = t === null ? null : this.ownGroupOf(t);
		if (t === null || i === null) {
			this.flyouts.close();
			return;
		}
		e.preventDefault();
		let a = i.closest(`.${bn}`);
		a !== null && (nA(i) ? this.toggleFlyout(a, i, t) : this.toggleInline(a, i));
	}
	toggleInline(e, t) {
		let n = e.classList.contains(wn);
		if (e.setAttribute(Rk, ""), t.closest("[data-ui-menu-searching]") !== null) {
			t.toggleAttribute(Fk);
			return;
		}
		if (t.hasAttribute(Fk)) {
			t.removeAttribute(Fk), n || this.store.write(e, Uk, null);
			return;
		}
		this.closeGroups(e), this.openInline(t), n || this.store.write(e, Uk, t.getAttribute(y));
	}
	openInline(e) {
		e.setAttribute(Fk, "");
	}
	closeGroups(e) {
		for (let t of e.querySelectorAll(`[${Pk}][${Fk}]`)) t.hasAttribute(zk) || t.removeAttribute(Fk);
	}
	toggleFlyout(e, t, n) {
		let r = this.submenuOf(t);
		if (r === null) return;
		let i = this.flyouts.isOpen(t);
		if (this.flyouts.close(), i) return;
		Jk(e), this.closeGroups(e);
		let a = n.closest(Lk) ?? void 0;
		if (!this.flyouts.open({
			owner: t,
			popup: r,
			anchor: n,
			placement: {
				placement: `${Yk(e)}-start`,
				surface: a,
				alignEntries: !0
			}
		})) return;
		let o = r.querySelector(`:scope > .${bn}`);
		o !== null && !yd() && Hd(o, $k(o));
	}
	findGroup(e, t) {
		for (let n of e.querySelectorAll(`[${Pk}]`)) if (n.getAttribute("data-ui-key") === t) return n;
		return null;
	}
	ownGroupOf(e) {
		return e.matches(En) ? e.parentElement : null;
	}
	groupOf(e, t) {
		let n = e?.closest(`[${Pk}]`) ?? null;
		return n !== null && t.contains(n) ? n : null;
	}
	submenuOf(e) {
		return e.querySelector(`:scope > .${Nk}`);
	}
};
function qk(e) {
	let t = e.querySelector(`:scope > .${x}`);
	t !== null && (t.setAttribute(Gk, ""), t.setAttribute(Ye, ""), t.setAttribute("aria-expanded", e.hasAttribute(Fk) ? "true" : "false"), nA(e) ? t.setAttribute("aria-haspopup", "menu") : t.removeAttribute("aria-haspopup"));
}
function Jk(e) {
	for (let t of e.querySelectorAll(`[${Ik}]`)) t.removeAttribute(Ik);
}
function Yk(e) {
	return Xk(e) ? "top" : e.classList.contains("ui-side--right") ? "left" : e.classList.contains("ui-side--top") ? "bottom" : e.classList.contains("ui-side--bottom") ? "top" : "right";
}
function Xk(e) {
	let t = e.closest(`[${hn}]`);
	return e.classList.contains("ui-menu--rail") && t?.parentElement !== null && t?.parentElement !== void 0 && typeof matchMedia == "function" && pk(t.parentElement, Vk);
}
function Zk(e) {
	for (let t of e) {
		let e = t.closest(`[${gn}]`);
		if (!t.classList.contains("ui-menu--rail") && !t.hasAttribute(Bk) || e?.parentElement === null || e?.parentElement === void 0) continue;
		let n = typeof matchMedia == "function" && pk(e.parentElement, Vk);
		t.classList.toggle(Cn, !n), t.toggleAttribute(Bk, n);
	}
}
function Qk(e) {
	let t = e.closest(`.${x}`);
	return t !== null && t.matches(Dn) && !t.matches(On) && !D(t);
}
function $k(e) {
	let t = [];
	for (let n of Dl(e)) {
		t.push(n);
		let e = n.matches(En) ? n.parentElement : null, r = e === null || !e.hasAttribute(Fk) || nA(e) ? null : e.querySelector(`:scope > .${Nk} > .${bn}`);
		r !== null && t.push(...$k(r));
	}
	return t;
}
function eA(e) {
	let t = tA(e), n = t?.closest(".ui-menu") ?? null;
	return t === null || n === null || nA(t) ? e : eA(n);
}
function tA(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(Nk) && t.parentElement?.hasAttribute(Pk) === !0 ? t.parentElement : null;
}
function nA(e) {
	let t = e.closest(`.${bn}`);
	return e.hasAttribute(zk) || t !== null && rA(t);
}
function rA(e) {
	return e.hasAttribute("data-ui-collapsed") || e.classList.contains("ui-menu--rail");
}
var iA = "tabs:rename", aA = "tabs:pin", oA = "tabs:unpin", sA = "tabs:close", cA = "tabs:delete";
function lA(e) {
	let t = (e ?? "").split(/\s+/);
	return {
		rename: t.includes("rename"),
		pin: t.includes("pin"),
		close: t.includes("close"),
		delete: t.includes("delete")
	};
}
function uA(e, t) {
	let n = !t.pinned && t.removable;
	return /* @__PURE__ */ new Map([
		[iA, e.rename && t.renamable],
		[aA, e.pin && !t.pinned],
		[oA, e.pin && t.pinned],
		[sA, e.close && !e.delete && n],
		[cA, e.delete && n]
	]);
}
function dA(e) {
	let t = e.map(() => !1), n = !1, r = -1;
	for (let i = 0; i < e.length; i++) e[i] === "rule" ? n && r === -1 && (r = i) : e[i] === "shown" && (r !== -1 && (t[r] = !0), r = -1, n = !0);
	return t;
}
//#endregion
//#region src/interactions/context-menu-engine.ts
var fA = Se, pA = "ui-context-menu--open", mA = `${Ae}--strip`, hA = `.${Ae}:not(.${mA}) > .${WO}`, gA = "ui-context-menu-opening", _A = class {
	root;
	components;
	closed = null;
	menus = new Jh({
		show: ({ popup: e }) => e.classList.add(pA),
		hide: ({ popup: e }, t) => {
			e.classList.remove(pA), this.closed = e, t === "outside" && NA();
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e),
		onPress: !0,
		onWindowBlur: !0,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, new lk({
			root: this.root,
			first: typeof window > "u" ? void 0 : window,
			opensMenu: (e) => e.closest("[data-ui-context-menu-owner]") !== null && !Wc(e),
			closeMenu: () => this.menus.close(this.menus.current, "outside")
		}), this.root.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), this.root.addEventListener("click", (e) => this.handleInside(e), !1);
	}
	get openMenu() {
		let e = this.menus.current;
		return e === null ? null : this.menus.popupOf(e);
	}
	handleContextMenu(e) {
		if (!(e instanceof MouseEvent) || !(e.target instanceof Element)) return;
		let t = !yd() && !ck(e), n = (t ? bA() : null) ?? e.target;
		if (this.openMenu !== null && e.composedPath().includes(this.openMenu)) {
			e.preventDefault();
			return;
		}
		let r = vA(n);
		r !== null && (e.preventDefault(), this.open(r.owner, r.menu, e.clientX, e.clientY, EA(e) ? n : null, n.closest(hA), t ? xA(n) : null));
	}
	open(e, t, n, r, i, a, o) {
		this.menus.close(), t.querySelector(`:scope > .${mA}`)?.remove(), DA(t), i !== null && OA(e, t, i), a?.closest("[data-ui-action-bar]")?.hasAttribute("data-ui-action-bar-rest") === !0 && AA(t), this.closed !== null && (Jf(this.closed), this.closed = null);
		let s = (document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null) ?? vd(), c = a ?? o, l = {
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
			returnFocus: () => (s === null ? null : Ud(s, this.components)) ?? Ud(e, this.components)
		}) && (c === null && nm(t, n, r), MA(t));
	}
	handleInside(e) {
		this.openMenu === null || !e.composedPath().includes(this.openMenu) || e.target instanceof Element && Qk(e.target) && this.menus.close();
	}
};
function vA(e) {
	let t = e.closest(`[${ue}]`);
	for (let n = e.closest(`[${Ce}]`); n !== null; n = n.parentElement?.closest("[data-ui-context-menu-owner]") ?? null) {
		if (t !== null && n.contains(t)) return null;
		let r = CA(n, e);
		if (r.length === 0 || D(n)) continue;
		if (FA(n)) return null;
		let i = r.find((t) => wA(t, e, !1));
		if (i !== void 0) return {
			owner: n,
			menu: i
		};
	}
	return null;
}
var yA = `[${Ce}]`;
function bA() {
	let e = document.activeElement;
	if (e === null || e === document.body) return null;
	let t = pu(e);
	if (t === null || t.row !== null && t.row !== e) return e;
	let n = t.row ?? yu(t.root);
	return n === null ? t.root : SA(n);
}
function xA(e) {
	let t = e.closest(jl);
	return t === null ? e : F(t) ?? t;
}
function SA(e) {
	if (e.matches(yA)) return e;
	for (let t of e.querySelectorAll(yA)) if (t.closest(jl) === e) return t;
	return e;
}
function CA(e, t) {
	let n = t.closest(`[${we}]`), r = n !== null && e.contains(n) ? n.getAttribute("data-ui-context-menu-use") ?? "" : "";
	return [r.length > 0 ? PA(e, r) : null, PA(e, "")].filter((e) => e !== null);
}
function wA(e, t, n) {
	let r = new CustomEvent(gA, {
		bubbles: !0,
		cancelable: !0,
		detail: {
			target: t,
			actionBar: n
		}
	});
	return e.dispatchEvent(r);
}
function TA(e, t) {
	let n = e.closest(`[${Ce}]`), r = e.closest(`[${ue}]`);
	return n === null || D(n) || FA(n) || r !== null && n.contains(r) ? null : CA(n, e).find((n) => wA(n, e, t)) ?? null;
}
function EA(e) {
	let t = e.pointerType;
	return ck(e) ? !0 : typeof t == "string" && t.length > 0 ? t === "touch" : bd();
}
function DA(e) {
	for (let t of e.querySelectorAll(`[${Oe}]`)) t.removeAttribute(Oe);
}
function OA(e, t, n) {
	let r = n.closest(`[${Te}]`);
	if (r === null || n.closest(".ui-action-bar") !== null || !e.contains(r) || !CA(e, r).includes(t)) return;
	let { entries: i } = XO(t);
	if (i.length === 0) return;
	let a = document.createElement("div");
	a.className = `${Ae} ${mA}`, a.setAttribute("role", "group"), QO(a, {
		entries: i,
		more: !1,
		role: "menuitem",
		press: kA
	}), t.insertBefore(a, t.firstElementChild);
}
function kA(e) {
	D(e) || e.click();
}
function AA(e) {
	let { entries: t } = XO(e), n = e.querySelector(`.${bn}`);
	if (t.length === 0 || n === null) return;
	for (let e of t) jA(e);
	let r = El(n, `.${x}`, `.${bn}`).filter((t) => t.closest("[data-ui-menu-left-out]") === null && ZO(t, e)), i = [];
	for (let [e, t] of r.entries()) {
		let n = r[e + 1];
		t.getAttribute("data-ui-menu-item-kind") === "header" && (n === void 0 || n.matches(Tn)) ? jA(t) : i.push(t);
	}
	let a = i.map((e) => {
		let t = e.getAttribute(yn);
		return t === "separator" ? "rule" : t === "header" ? "hidden" : "shown";
	});
	dA(a).forEach((e, t) => {
		a[t] === "rule" && !e && jA(i[t]);
	});
}
function jA(e) {
	let t = e.parentElement;
	(t !== null && t.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t : e).setAttribute(Oe, "");
}
function MA(e) {
	let t = e.querySelector(`.${bn}`);
	t !== null && Hd(e, $k(t));
}
function NA() {
	let e = (e) => {
		e.target instanceof Element && e.target.closest(`${ad}, [contenteditable='true']`) === null && e.preventDefault();
	};
	document.addEventListener("mousedown", e, {
		capture: !0,
		once: !0
	}), setTimeout(() => document.removeEventListener("mousedown", e, !0));
}
function PA(e, t) {
	for (let n of e.querySelectorAll(`[${fA}]`)) if ((n.getAttribute(fA) ?? "") === t && n.closest("[data-ui-context-menu-owner]") === e) return n;
	return null;
}
function FA(e) {
	if (e.hasAttribute("data-ui-no-context-menu")) return !0;
	let t = e.closest(`[${b}]`);
	if (t === null) return !1;
	let n = e;
	for (; n.parentElement !== null && n.parentElement !== t;) n = n.parentElement;
	return gs(n, "data-ui-no-context-menu") || t.closest(S)?.hasAttribute("data-ui-no-context-menu") === !0;
}
//#endregion
//#region src/interactions/element-visibility.ts
function IA(e, t) {
	let n = getComputedStyle(e), r = t ? n.overflowY : n.overflowX;
	return r === "auto" || r === "scroll";
}
function LA(e) {
	return getComputedStyle(e).display !== "none";
}
function RA(e) {
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
				if (e.overflowX !== "visible" && VA(n, i, i + t.clientWidth, !0), e.overflowY !== "visible" && VA(n, a, a + t.clientHeight, !1), HA(n)) return !0;
			}
			r = e.position;
		}
	}
	return VA(n, 0, window.innerWidth, !0), VA(n, 0, window.innerHeight, !1), HA(n);
}
function zA(e) {
	let t = getComputedStyle(e).position;
	for (let n = e.parentElement; n !== null && t !== "fixed"; n = n.parentElement) {
		let e = getComputedStyle(n);
		if (t !== "absolute" || e.position !== "static" || e.transform !== "none") {
			if (!(n.classList.contains("ui-scroll-y--disabled") && !IA(n, !1)) && (BA(e.overflowX) || BA(e.overflowY))) return n;
			t = e.position;
		}
	}
	return null;
}
function BA(e) {
	return e === "hidden" || e === "auto" || e === "scroll";
}
function VA(e, t, n, r) {
	r ? (e.left = Math.max(e.left, t), e.right = Math.min(e.right, n)) : (e.top = Math.max(e.top, t), e.bottom = Math.min(e.bottom, n));
}
function HA(e) {
	return e.left > e.right || e.top > e.bottom;
}
//#endregion
//#region src/interactions/action-bar-engine.ts
var UA = `[${Te}]`, WA = `.${Ae}`, GA = `${Ae}--out`, KA = `.ui-items-view__item, .${Hn}`, qA = "ui-tree__node", JA = 6, YA = "--ui-action-bar-gap", XA = 400, ZA = /* @__PURE__ */ new WeakMap(), QA = [
	"class",
	"style",
	"hidden",
	"aria-disabled",
	"aria-checked",
	ke,
	...Xr
], $A = class {
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
		if (n === null || n.closest(`${WA}, [data-ui-context-menu]`) !== null) return;
		let r = ej(n), i = r !== null && r !== this.chosen && tj(n, r) ? null : r;
		if (t.pointerType === "touch") {
			this.pendingTap = {
				pointerId: t.pointerId ?? 0,
				host: i,
				identity: i === null ? null : sj(i)
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
			let e = t.host !== null && !t.host.isConnected && t.identity !== null ? cj(t.identity) : t.host;
			e !== null && e === this.chosen ? this.askAgain(e) : this.choose(e);
		}
		this.chosen !== null && this.chosen.isConnected && !this.shown.has(this.chosen) && this.sync();
	}
	handleContextMenu(e) {
		this.pendingTap = null, e instanceof MouseEvent && e.target instanceof Element && e.target.closest(WA) === null && EA(e) && this.choose(null);
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement ? e.target : null;
		if (t === null) return;
		let n = t.closest(WA);
		if (n !== null) {
			this.isHostedBar(n) && M(gj(n), t);
			return;
		}
		yd() || this.isInOpenMenu(t) || this.menuHost !== null && t.contains(this.menuHost) || this.choose(aj(t));
	}
	handleFocusOut(e) {
		let t = e.relatedTarget, n = t instanceof Element ? t.closest(WA) : null;
		n !== null && this.isHostedBar(n) && e.target instanceof HTMLElement && !n.contains(e.target) && (this.cameFrom = e.target);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || !(e.target instanceof HTMLElement)) return;
		let t = e.target;
		if (e.defaultPrevented) {
			t.matches(P) && this.choose(aj(t));
			return;
		}
		let n = t.closest(WA);
		if (n !== null && t.classList.contains(UO)) {
			this.handleBarKey(e, n, t);
			return;
		}
		if (e.key === "Escape") {
			if (Pc(e)) return;
			let n = t.closest(pm);
			(n === null || this.chosen !== null && n.contains(this.chosen)) && (this.chosen !== null && e.preventDefault(), this.choose(null));
			return;
		}
		if (e.key === "Tab" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey && t.matches(P)) {
			let n = this.chosen === null ? null : this.tabStopOf(this.chosen);
			n !== null && t.contains(n) && (e.preventDefault(), n.focus());
			return;
		}
		t.matches(P) && this.choose(aj(t));
	}
	handleBarKey(e, t, n) {
		if (e.ctrlKey || e.altKey || e.metaKey) return;
		if (e.key === "Escape") {
			if (!this.isHostedBar(t)) return;
			let n = this.hostOfBar(t), r = this.cameFrom !== null && this.cameFrom.isConnected && bj(this.cameFrom) && n !== null && (n.contains(this.cameFrom) || this.cameFrom.contains(n)) ? this.cameFrom : Ud(n, this.components);
			e.preventDefault(), r?.focus();
			return;
		}
		let r = gj(t), i = il({
			key: e.key,
			items: r,
			current: n,
			axis: "horizontal"
		});
		i !== null && (e.preventDefault(), sl(r, i));
	}
	choose(e) {
		(e === null ? this.chosen === null && this.identity === null : e === this.chosen) || (this.chosen = e, this.identity = e === null ? null : sj(e), this.watchScope(), this.sync(), e !== null && this.makeRoomAbove(e));
	}
	makeRoomAbove(e) {
		let t = this.shown.get(e), n = zA(e);
		if (t === void 0 || n === null || !IA(n, !0)) return;
		let r = Math.max(0, n.getBoundingClientRect().top + n.clientTop), i = Math.ceil(t.bar.getBoundingClientRect().height + uj(e) - (e.getBoundingClientRect().top - r));
		i <= 0 || i > n.scrollTop || (n.scrollTop -= i, Op(t.bar), this.markOut());
	}
	askAgain(e) {
		let t = this.shown.get(e);
		if (t === void 0) {
			this.sync();
			return;
		}
		TA(e, !0) === null && this.hide(e, t);
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
				this.chosen = cj(e), this.sync();
			}
			for (let e of this.shown.values()) Op(e.bar);
			this.markOut();
		}
	}
	sync() {
		for (let [e, t] of this.shown) (e !== this.chosen && e !== this.menuHost || !e.isConnected) && this.hide(e, t);
		for (let e of [this.chosen, this.menuHost]) e !== null && e.isConnected && !this.shown.has(e) && this.show(e);
	}
	show(e) {
		let t = TA(e, !0);
		if (t === null) return;
		let n = document.createElement("div");
		if (n.className = Ae, n.setAttribute("role", "toolbar"), E.write(n, "aria-label", "ui.actionbar.label"), n.setAttribute(Ye, ""), n.setAttribute(fe, ""), !fj(n, t, (t) => this.openMore(e, t), !1)) return;
		e.insertBefore(n, hj(e)), _p(e, n, {
			placement: lj(e),
			gap: uj(e),
			boundary: zA(e) ?? void 0
		}), n.classList.toggle(GA, RA(e));
		let r = new MutationObserver(() => this.redraw(e));
		r.observe(t, {
			subtree: !0,
			childList: !0,
			characterData: !0,
			attributes: !0,
			attributeFilter: QA
		});
		let i = dj(e);
		i?.setAttribute(vr, ""), this.shown.set(e, {
			bar: n,
			menu: t,
			observer: r,
			row: i
		}), ZA.set(n, Date.now());
	}
	redraw(e) {
		let t = this.shown.get(e);
		if (t === void 0) return;
		let n = document.activeElement, r = n instanceof HTMLElement && t.bar.contains(n) ? n : null, i = r === null ? null : rk(r);
		if (!fj(t.bar, t.menu, (t) => this.openMore(e, t), e === this.menuHost)) {
			this.hide(e, t);
			return;
		}
		if (r === null) return;
		let a = gj(t.bar);
		sl(a, a.find((e) => rk(e) === i) ?? a.find(N) ?? null);
	}
	openMore(e, t) {
		let n = this.shown.get(e);
		if (n === void 0 || vj(t)) return;
		if (this.menuHost = e, yj(t), !n.menu.classList.contains("ui-context-menu--open")) {
			this.menuHost = null;
			return;
		}
		pj(n.bar, !0);
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
		pj(t.bar, !1);
		let n = document.activeElement;
		!yd() && (n === null || n === document.body || e.contains(n) || n.contains(e)) && mj(t.bar)?.focus();
	}
	hide(e, t) {
		t.observer.disconnect(), kp(t.bar), t.bar.remove(), this.shown.delete(e), t.row !== null && ![...this.shown.values()].some((e) => e.row === t.row) && t.row.removeAttribute(vr);
	}
	markOut() {
		for (let [e, t] of this.shown) t.bar.classList.toggle(GA, RA(e));
	}
	isInOpenMenu(e) {
		for (let t of this.shown.values()) if (t.menu.classList.contains("ui-context-menu--open") && t.menu.contains(e)) return !0;
		return !1;
	}
	tabStopOf(e) {
		let t = this.shown.get(e);
		return t === void 0 ? null : gj(t.bar).find((e) => e.tabIndex === 0) ?? null;
	}
	isHostedBar(e) {
		return this.hostOfBar(e) !== null;
	}
	hostOfBar(e) {
		for (let [t, n] of this.shown) if (n.bar === e) return t;
		return null;
	}
};
function ej(e) {
	let t = e.closest(UA);
	if (t !== null) return t;
	let n = e.closest(`[${y}]`), r = e.closest(S);
	return n === null || r !== null && !r.contains(n) ? null : oj(n)[0] ?? null;
}
function tj(e, t) {
	let n = rl(e, t.closest("[data-ui-key]") ?? t);
	return n !== null && !rj(n, t);
}
var nj = `[${Se}], .${Ae}, ${ci}`;
function rj(e, t) {
	if (e.contains(t)) return !0;
	for (let n = e; n !== t;) {
		let e = n.parentElement;
		if (e === null) return !1;
		let t = ij(e) - ij(n);
		for (let r of e.children) if (r !== n) {
			if (!r.matches(nj)) return !1;
			t -= ij(r);
		}
		if (t > 0) return !1;
		n = e;
	}
	return !0;
}
function ij(e) {
	return (e.textContent ?? "").replace(/s+/g, "").length;
}
function aj(e) {
	if (e instanceof HTMLElement && e.matches(P)) {
		let t = yu(e), n = t === null ? void 0 : oj(t)[0];
		if (n !== void 0) return n;
	}
	return e.closest(UA);
}
function oj(e) {
	let t = [...e.querySelectorAll(UA)];
	return e.matches(UA) ? [e, ...t] : t;
}
function sj(e) {
	let t = e.getAttribute(Ee);
	if (t !== null && e.parentElement !== null) return {
		scope: e.parentElement,
		attribute: Ee,
		key: t,
		index: 0
	};
	let n = e.closest(`[${y}]`), r = n?.getAttribute("data-ui-key") ?? null;
	return n === null || r === null || n.parentElement === null ? null : {
		scope: n.parentElement,
		attribute: y,
		key: r,
		index: oj(n).indexOf(e)
	};
}
function cj(e) {
	for (let t of e.scope.children) if (t.getAttribute(e.attribute) === e.key) return oj(t)[e.index] ?? null;
	return null;
}
function lj(e) {
	let t = e.getAttribute(Te);
	if (t === "center") return "top";
	let n = getComputedStyle(e).direction === "rtl";
	return t === "start" === n ? "top-end" : "top-start";
}
function uj(e) {
	let t = Number.parseFloat(getComputedStyle(e).getPropertyValue(YA));
	return Number.isFinite(t) ? t : JA;
}
function dj(e) {
	if (e.classList.contains("ui-table__row")) return e;
	let t = e.parentElement;
	if (t === null) return null;
	if (t.matches(KA)) return t;
	let n = t.parentElement;
	return t.classList.contains(qA) && n !== null && n.classList.contains("ui-tree__row") ? n : null;
}
function fj(e, t, n, r) {
	let { entries: i, more: a } = XO(t);
	if (i.length === 0 && !a) return !1;
	let o = QO(e, {
		entries: i,
		more: a,
		role: "button",
		press: _j,
		openMore: n
	});
	return M(o, o.find((e) => !D(e)) ?? o[0] ?? null), pj(e, r), !0;
}
function pj(e, t) {
	mj(e)?.setAttribute("aria-expanded", t ? "true" : "false");
}
function mj(e) {
	return gj(e).find((e) => rk(e) === null) ?? null;
}
function hj(e) {
	for (let t of e.children) if (t.hasAttribute("data-ui-context-menu")) return t;
	return null;
}
function gj(e) {
	return [...e.querySelectorAll(`:scope > .${UO}`)];
}
function _j(e, t) {
	if (D(t) || vj(t)) return;
	let n = TA(t, !1);
	n === null || !n.contains(e) || D(e) || !ZO(e, n) || e.click();
}
function vj(e) {
	let t = e.closest(WA), n = t === null ? void 0 : ZA.get(t);
	return n !== void 0 && bd() && Date.now() - n < XA;
}
function yj(e) {
	let t = e.getBoundingClientRect();
	e.dispatchEvent(new MouseEvent("contextmenu", {
		bubbles: !0,
		cancelable: !0,
		button: 2,
		clientX: t.left,
		clientY: t.bottom
	}));
}
function bj(e) {
	return e.matches(ad) || e.hasAttribute("tabindex");
}
//#endregion
//#region src/rendering/inline-markup.ts
var xj = {
	None: 0,
	Bold: 1,
	Italic: 2,
	Underline: 4,
	Strikethrough: 8,
	Code: 16
}, Sj = "\\", Cj = "`", wj = "!", Tj = "{", Ej = "}", Dj = "ui-text__fold", Oj = "ui-text__fold-toggle", kj = "ui-text__fold-content", Aj = 8;
function jj(e) {
	if (e == null || e.length === 0) return [];
	let t = [], n = { value: "" };
	return Uj(new Qj(e), 0, e.length, xj.None, null, t, n), Wj(t, n, xj.None, null), t;
}
function Mj(e) {
	return jj(e).map((e) => Lj(e) ? `${e.fold} ${Mj(e.text)}` : e.text).join("");
}
function Nj(e) {
	let t = "";
	for (let n of e) t += tM(n) ? Sj + n : n;
	return t;
}
function Pj(e, t, n = {}) {
	let r = jj(t), i = r.some(Lj);
	if (e.hasAttribute("data-ui-folds") !== i && e.toggleAttribute(Ue, i), r.length === 0) {
		e.textContent = "";
		return;
	}
	if (r.length === 1 && Fj(r[0])) {
		e.textContent = r[0].text;
		return;
	}
	e.replaceChildren(Rj(r, n));
}
function Fj(e) {
	return e.styles === xj.None && e.url === null && !Ij(e) && !Lj(e);
}
function Ij(e) {
	return e.icon !== null && e.icon !== void 0 && e.icon.length > 0;
}
function Lj(e) {
	return e.fold !== null && e.fold !== void 0;
}
function Rj(e, t) {
	let n = document.createDocumentFragment();
	for (let r of e) n.append(zj(r, t));
	return n;
}
function zj(e, t) {
	if (Ij(e)) return Vj(e.icon);
	let n = Lj(e) ? Bj(e, t) : document.createTextNode(e.text);
	if ((e.styles & xj.Code) !== 0) {
		let e = document.createElement("code");
		e.className = "ui-text__code", e.append(n), n = e;
	}
	if ((e.styles & xj.Strikethrough) !== 0 && (n = Hj("s", n)), (e.styles & xj.Underline) !== 0 && (n = Hj("u", n)), (e.styles & xj.Italic) !== 0 && (n = Hj("em", n)), (e.styles & xj.Bold) !== 0 && (n = Hj("strong", n)), e.url !== null) {
		let t = document.createElement("a");
		t.setAttribute("href", e.url), t.className = "ui-text__link", eh(e.url) && (t.setAttribute("target", "_blank"), t.setAttribute("rel", "noopener noreferrer")), t.append(n), n = t;
	}
	return n;
}
function Bj(e, t) {
	let n = document.createElement("span"), r = document.createElement(t.staticFolds === !0 ? "span" : "button"), i = document.createElement("span");
	return n.className = t.staticFolds === !0 ? `${Dj} ${Dj}--static` : Dj, r.className = Oj, r.textContent = e.fold ?? "", i.className = kj, i.append(Rj(jj(e.text), t)), t.staticFolds === !0 ? (n.append(r, " ", i), n) : (r.setAttribute("type", "button"), r.setAttribute("aria-expanded", "false"), r.setAttribute(Ye, ""), n.append(r, i), n);
}
function Vj(e) {
	let t = document.createElement("i");
	return t.className = "ui-text__icon-inline", _h(t, e), t.setAttribute("aria-hidden", "true"), t;
}
function Hj(e, t) {
	let n = document.createElement(e);
	return n.append(t), n;
}
function Uj(e, t, n, r, i, a, o) {
	let s = e.text, c = t;
	for (; c < n;) {
		let t = s[c];
		if (t === Sj && c + 1 < n && tM(s[c + 1])) {
			o.value += s[c + 1], c += 2;
			continue;
		}
		let l = Gj(e, c, n);
		if (l !== null) {
			Wj(a, o, r, i), Kj(s, c + 1, l, o), Wj(a, o, r | xj.Code, i), c = l + 1;
			continue;
		}
		let u = Yj(e, c, n);
		if (u !== null) {
			Wj(a, o, r, i), Uj(e, c + u.markerLength, u.contentEnd, r | u.style, i, a, o), Wj(a, o, r | u.style, i), c = u.contentEnd + u.markerLength;
			continue;
		}
		let d = qj(e, c, n);
		if (d !== null) {
			Wj(a, o, r, i), a.push({
				text: "",
				styles: r,
				url: i,
				icon: d.name
			}), c = d.iconEnd;
			continue;
		}
		let f = i === null ? Xj(e, c, n) : null;
		if (f !== null) {
			Wj(a, o, r, i), Uj(e, f.labelStart, f.labelEnd, r, f.url, a, o), Wj(a, o, r, f.url), c = f.linkEnd;
			continue;
		}
		let p = Zj(e, c, n);
		if (p !== null) {
			Wj(a, o, r, i), a.push({
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
function Wj(e, t, n, r) {
	t.value.length !== 0 && (e.push({
		text: t.value,
		styles: n,
		url: r
	}), t.value = "");
}
function Gj(e, t, n) {
	let r = e.text;
	if (r[t] !== Cj) return null;
	let i = t + 1;
	if (i >= n || nM(r[i])) return null;
	let a = e.findClosingMarker(i, n, Cj, 1);
	return a > i ? a : null;
}
function Kj(e, t, n, r) {
	for (let i = t; i < n; i++) {
		if (e[i] === Sj && i + 1 < n && tM(e[i + 1])) {
			r.value += e[i + 1], i++;
			continue;
		}
		r.value += e[i];
	}
}
function qj(e, t, n) {
	let r = e.text;
	if (r[t] !== wj || t + 1 >= n || r[t + 1] !== "[") return null;
	let i = t + 2, a = e.findClosingBracket(i, n);
	if (a <= i) return null;
	let o = r.slice(i, a);
	return Jj(o) ? {
		name: o,
		iconEnd: a + 1
	} : null;
}
function Jj(e) {
	return e.length > 0 && /^[A-Za-z0-9._-]+$/.test(e);
}
function Yj(e, t, n) {
	let r = e.text, i = r[t];
	if (i !== "*" && i !== "_" && i !== "~") return null;
	let a = t + 1 < n && r[t + 1] === i, o, s;
	if (i === "*" && a) o = xj.Bold, s = 2;
	else if (i === "*") o = xj.Italic, s = 1;
	else if (i === "_" && a) o = xj.Underline, s = 2;
	else if (i === "~" && a) o = xj.Strikethrough, s = 2;
	else return null;
	let c = t + s;
	if (c >= n || nM(r[c])) return null;
	let l = e.findClosingMarker(c, n, i, s);
	return l > c ? {
		style: o,
		markerLength: s,
		contentEnd: l
	} : null;
}
function Xj(e, t, n) {
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
function Zj(e, t, n) {
	let r = e.text;
	if (r[t] !== "[") return null;
	let i = e.findClosingBracket(t + 1, n);
	if (i <= t + 1 || i + 1 >= n || r[i + 1] !== Tj || e.hasOpeningBracket(t + 1, i)) return null;
	let a = i + 1, o = a + 1, s = e.findMatchingBrace(a, n);
	if (s <= o || e.braceDepth(a) > Aj) return null;
	let c = { value: "" };
	return Kj(r, t + 1, i, c), {
		caption: c.value,
		contentStart: o,
		contentEnd: s
	};
}
var Qj = class {
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
		return this.closeBrackets ??= this.next("]", !0), $j(this.closeBrackets[e], t);
	}
	hasOpeningBracket(e, t) {
		return this.openBrackets ??= this.next("[", !0), $j(this.openBrackets[e], t) >= 0;
	}
	findClosingParen(e, t) {
		return this.closeParens ??= this.next(")", !1), $j(this.closeParens[e], t);
	}
	findMatchingBrace(e, t) {
		return $j(this.braces()[e], t);
	}
	braceDepth(e) {
		return this.braces(), this.braceDepths[e];
	}
	findClosingMarker(e, t, n, r) {
		let i = eM(n, r), a = this.closers[i] ?? this.buildClosers(n, r);
		this.closers[i] = a;
		let o = a[e + 1];
		if (r === 2) return o >= 0 && o + 1 < t ? o : -1;
		if (o >= 0 && o < t - 1) return o;
		let s = t - 1;
		return s > e && this.text[s] === n && !this.isEscaped(s) && !nM(this.text[s - 1]) ? s : -1;
	}
	readLinkUrl(e, t) {
		if (this.linkLabel !== e) {
			let n = this.text.slice(e + 2, t).trim();
			this.linkLabel = e, this.linkUrl = Zm(n) ? n : null;
		}
		return this.linkUrl;
	}
	isEscaped(e) {
		if (this.escaped === null) {
			let e = new Uint8Array(this.text.length);
			for (let t = 1; t < this.text.length; t++) e[t] = +(this.text[t - 1] === Sj && e[t - 1] === 0);
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
			if (this.text[r] === Tj) n.push(r);
			else if (this.text[r] === Ej && n.length > 0) {
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
		if (e === 0 || this.text[e] !== t || this.isEscaped(e) || nM(this.text[e - 1])) return !1;
		let r = e + 1 < this.text.length && this.text[e + 1] === t;
		return n === 2 ? r : !r;
	}
};
function $j(e, t) {
	return e >= 0 && e < t ? e : -1;
}
function eM(e, t) {
	switch (e) {
		case "*": return t === 2 ? 0 : 1;
		case "_": return 2;
		case "~": return 3;
		default: return 4;
	}
}
function tM(e) {
	return e === "*" || e === "_" || e === "~" || e === "[" || e === "]" || e === "(" || e === ")" || e === Tj || e === Ej || e === Cj || e === Sj;
}
function nM(e) {
	return e === " " || e === "	" || e === "\r" || e === "\n";
}
//#endregion
//#region src/interactions/tooltip-engine.ts
var rM = "ui-tooltip", iM = "ui-tooltip", aM = "ui-tooltip--visible", oM = "ui-tooltip--linked", sM = "[aria-haspopup][aria-expanded=\"true\"]", cM = "a[href], button, input, select, textarea, label, [role='button'], [role='link'], [tabindex]", lM = "top", uM = 250, dM = 200, fM = 300, pM = 7, mM = null, hM = null, gM = null, _M = null, vM = null, yM = 0, bM = null, xM = 0, SM = 0, CM = !1, wM = /* @__PURE__ */ new Set();
function TM(e) {
	wM.add(e);
}
function EM(e = document) {
	if (CM) return;
	CM = !0;
	let t = e instanceof Document ? e : document;
	t.addEventListener("pointerover", DM, !0), t.addEventListener("pointerout", AM, !0), t.addEventListener("focusin", MM, !0), t.addEventListener("focusout", NM, !0), t.addEventListener("scroll", kM, !0), t.addEventListener("pointerdown", FM, !0), t.addEventListener("pointermove", UM, !0), t.addEventListener("pointerup", HM, !0), t.addEventListener("pointercancel", HM, !0), t.addEventListener("contextmenu", GM, !0), t.addEventListener("click", qM, !0), window.addEventListener("click", KM, !0), window.addEventListener("keydown", PM, !0), window.addEventListener("blur", () => {
		_M = null, _N(!0);
	});
}
function DM(e) {
	if (OM(), YM(e.target)) {
		window.clearTimeout(xM);
		return;
	}
	let t = XM(e.target);
	t !== null && t !== hM && tN(t);
}
function OM() {
	hM === null || hM.isConnected || (_M = null, _N(!0));
}
function kM(e) {
	if (OM(), hM === null) return;
	let t = e.target;
	t instanceof Node && !(t instanceof Document) && !t.contains(hM) || RA(hM) && (_M = null, _N(!0));
}
function AM(e) {
	if (_M !== null || vM !== null) return;
	let t = e.relatedTarget, n = hM ?? bM?.target ?? null, r = n === null ? null : jM(n);
	t instanceof Node && (r !== null && r.contains(t) || YM(t)) || (YM(e.target) || r !== null && e.target instanceof Node && r.contains(e.target)) && _N(!1);
}
function jM(e) {
	let t = e.parentElement?.closest("[data-ui-tooltip-mark]") ?? null;
	return t !== null && ZM(t) === e ? t : e;
}
function MM(e) {
	if (e.target instanceof Element && e.target.hasAttribute("data-ui-pointer-focus")) return;
	let t = XM(e.target);
	t !== null && (_M = e.target instanceof Element && e.target.closest("[data-ui-tooltip-mark]") !== null ? t : null, nN(t));
}
function NM(e) {
	XM(e.target) === hM && (_M = null, _N(!0));
}
function PM(e) {
	e.key !== "Escape" || hM === null || e.defaultPrevented || (Pc(e) || e.preventDefault(), _M = null, _N(!0));
}
function FM(e) {
	if (HM(), BM = null, YM(e.target)) return;
	VM(e);
	let t = JM(e.target);
	if (t !== null) {
		if (vM === t) {
			_N(!0);
			return;
		}
		_M = null, _N(!0), nN(t), vM = hM;
		return;
	}
	_M === null && _N(!0);
}
var IM = 500, LM = 10, RM = `[${Ce}]`, zM = null, BM = null;
function VM(e) {
	let t = e;
	if (t.pointerType !== "touch" || !(e.target instanceof Element) || e.target.closest(RM) !== null || Wc(e.target)) return;
	let n = XM(e.target);
	n === null || n.hasAttribute("data-ui-tooltip-press") || (zM = {
		pointerId: t.pointerId ?? 0,
		x: t.clientX ?? 0,
		y: t.clientY ?? 0,
		target: n,
		timer: window.setTimeout(WM, IM)
	});
}
function HM() {
	zM !== null && (window.clearTimeout(zM.timer), zM = null);
}
function UM(e) {
	let t = e;
	zM !== null && t.pointerId === zM.pointerId && Math.hypot((t.clientX ?? zM.x) - zM.x, (t.clientY ?? zM.y) - zM.y) > LM && HM();
}
function WM() {
	let e = zM?.target ?? null;
	zM = null, e !== null && (_M = null, _N(!0), nN(e), vM = hM, BM = hM);
}
function GM(e) {
	if (zM !== null && e.target instanceof Node && zM.target.contains(e.target)) {
		e.preventDefault(), window.clearTimeout(zM.timer), WM();
		return;
	}
	BM !== null && e.target instanceof Node && BM.contains(e.target) && e.preventDefault();
}
function KM(e) {
	BM === null || !(e.target instanceof Node) || !BM.contains(e.target) || (BM = null, e.preventDefault(), e.stopImmediatePropagation());
}
function qM(e) {
	JM(e.target) !== null && e.preventDefault();
}
function JM(e) {
	let t = XM(e);
	if (t === null || !t.hasAttribute("data-ui-tooltip-press") || !(e instanceof Element)) return null;
	let n = e.closest(cM);
	return n === null || n.contains(t) ? t : null;
}
function YM(e) {
	return mM !== null && e instanceof Node && mM.contains(e);
}
function XM(e) {
	if (!(e instanceof Element)) return null;
	let t = ZM(e);
	for (let n of wM) {
		let r = n.anchor(e);
		if (r !== null && (t === null || t !== r && t.contains(r)) && eN(r).length > 0) return r;
	}
	return t;
}
function ZM(e) {
	let t = e.closest(`[${Ie}], [${Re}]`);
	if (t === null) return null;
	let n = t.hasAttribute("data-ui-tooltip") ? t : t.querySelector("[data-ui-tooltip][data-ui-tooltip-severity]") ?? t.querySelector("[data-ui-tooltip]");
	return n === null ? null : (n.getAttribute("data-ui-tooltip") ?? "").trim().length > 0 ? n : null;
}
function QM(e) {
	let t = (e.getAttribute("data-ui-tooltip") ?? "").trim();
	return t.length > 0 ? t + $M(e) : eN(e);
}
function $M(e) {
	let t = "";
	for (let n of wM) {
		let r = n.anchor(e) === e ? n.after?.(e)?.trim() ?? "" : "";
		r.length > 0 && (t += ` ${r}`);
	}
	return t;
}
function eN(e) {
	for (let t of wM) {
		if (t.anchor(e) !== e) continue;
		let n = t.words(e)?.trim() ?? "";
		if (n.length > 0) return n;
	}
	return "";
}
function tN(e, t) {
	if (_M === null && vM === null) {
		if (window.clearTimeout(xM), bM !== null && bM.target === e) {
			bM.words = t;
			return;
		}
		if (window.clearTimeout(yM), bM = null, hM !== null) {
			_N(!0), nN(e, t);
			return;
		}
		if (Date.now() - SM < fM) {
			nN(e, t);
			return;
		}
		bM = {
			target: e,
			words: t
		}, yM = window.setTimeout(() => {
			let e = bM;
			bM = null, e !== null && nN(e.target, e.words);
		}, uM);
	}
}
function nN(e, t) {
	let n = (t ?? QM(e)).trim();
	if (n.length === 0 || !e.isConnected || !LA(e) || aN(e) || RA(e)) return;
	window.clearTimeout(yM), window.clearTimeout(xM), bM = null;
	let r = vN();
	Pj(r, n, { staticFolds: !0 }), r.classList.toggle(oM, r.querySelector("a[href]") !== null), r.classList.add(aM), hM = e, sN(oN(e)), r.setAttribute("data-ui-tooltip-text", Mj(n)), uN(r, e.getAttribute(ze)), gp(e, r), _p(e, r, {
		placement: gN(e),
		gap: pM,
		arrow: !0
	}), iN();
}
var rN = null;
function iN() {
	typeof MutationObserver > "u" || (rN ??= new MutationObserver(OM), rN.observe(document.documentElement, {
		childList: !0,
		subtree: !0
	}));
}
function aN(e) {
	return e.matches(sM) || e.querySelector(sM) !== null || e.querySelector(":scope > .ui-action-bar") !== null;
}
function oN(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t) ? t : e;
}
function sN(e) {
	gM !== null && gM !== e && cN();
	let t = lN(e);
	t.includes(iM) || e.setAttribute("aria-describedby", [...t, iM].join(" ")), gM = e;
}
function cN() {
	if (gM === null) return;
	let e = lN(gM).filter((e) => e !== iM);
	e.length === 0 ? gM.removeAttribute("aria-describedby") : gM.setAttribute("aria-describedby", e.join(" ")), gM = null;
}
function lN(e) {
	return (e.getAttribute("aria-describedby") ?? "").split(" ").filter((e) => e.length > 0);
}
function uN(e, t) {
	t === null ? e.removeAttribute(ze) : e.setAttribute(ze, t);
}
function dN(e, t, n) {
	let r = n?.plain === !0 ? Nj(t) : t;
	n?.delay === !0 && hM !== e ? tN(e, r) : nN(e, r);
}
function fN() {
	_N(!0);
}
var pN = {
	show: dN,
	hide: fN,
	escape: Nj
};
function mN(e) {
	_M = e, nN(e);
}
function hN(e) {
	if (hM === e) {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) {
			_M = null, _N(!0);
			return;
		}
		nN(e);
	}
}
function gN(e) {
	if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) for (let t of wM) {
		let n = t.anchor(e) === e ? t.placement?.(e) ?? null : null;
		if (n !== null) return n;
	}
	let t = e.getAttribute(Le);
	return t !== null && op(t) ? t : lM;
}
function _N(e) {
	window.clearTimeout(yM), window.clearTimeout(xM), bM = null;
	let t = () => {
		hM !== null && (cN(), hM = null, vM = null, rN?.disconnect(), mM !== null && (mM.classList.remove(aM), kp(mM)), SM = Date.now());
	};
	e ? t() : xM = window.setTimeout(t, dM);
}
function vN() {
	return mM !== null && mM.isConnected ? mM : (mM = document.createElement("div"), mM.id = iM, mM.className = rM, mM.setAttribute("role", "tooltip"), mM.setAttribute("aria-hidden", "true"), document.body.append(mM), mM);
}
//#endregion
//#region src/interactions/menu-engine.ts
var yN = "ui-orientation--horizontal", bN = `.${Cn} > .ui-menu__host > .ui-menu__item > .${x}`, xN = `${bN}, ${`.ui-menu[${Yt}] > .ui-menu__host > .ui-menu__item > .${x}`}`, SN = ":scope > .ui-button__content > .ui-text__body > .ui-text__header > .ui-text__title", CN = "[role='menuitem'], [role='menuitemcheckbox']", wN = class {
	root;
	tabStopsScheduled = !1;
	space = new bc();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("keydown", (e) => this.handleEntryKeydown(e), !0), this.root.addEventListener("keyup", (e) => this.space.release(e, N), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), TM(ON), this.applyTabStops(), this.root instanceof Node && new MutationObserver((e) => {
			e.some(kN) && this.scheduleTabStops();
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [sn, Qt]
		});
	}
	scheduleTabStops() {
		this.tabStopsScheduled || (this.tabStopsScheduled = !0, setTimeout(() => {
			this.tabStopsScheduled = !1, this.applyTabStops();
		}, 0));
	}
	applyTabStops() {
		for (let e of this.root.querySelectorAll(`.${bn}`)) {
			if (eA(e) !== e) continue;
			let t = $k(e);
			if (t.length === 0) continue;
			let n = t.filter((e) => e.tabIndex === 0 && N(e));
			M(t, t.find((e) => e === document.activeElement) ?? t.find((e) => e.classList.contains("ui-menu-item--selected") && N(e)) ?? (n.length === 1 ? n[0] : void 0) ?? t.find(N) ?? t[0]);
		}
	}
	handleEntryKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || Gc(e) || A(e) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${x}`), n = t?.closest(".ui-menu") ?? null;
		if (t === null) {
			this.enterFromContainer(e);
			return;
		}
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			this.pressEntry(e, t);
			return;
		}
		let r = eA(n), i = $k(r), a = ex(e);
		if (a !== null) {
			e.preventDefault(), sl(i, EO(i, t, a));
			return;
		}
		let o = r.classList.contains(yN) || Xk(r) ? "horizontal" : "vertical";
		if (!j(e) || this.handleGroupKey(e, t, r, o)) return;
		let s = e.key === "ArrowUp" && t === i.find(N) ? DN(r) : null, c = s ?? il({
			key: e.key,
			items: i,
			current: t,
			axis: o
		});
		c !== null && (e.preventDefault(), c !== s && M(i, c), c.focus());
	}
	handleGroupKey(e, t, n, r) {
		let i = r === "vertical" ? "ArrowRight" : Yk(n) === "top" ? "ArrowUp" : "ArrowDown", a = t.matches(En) ? t.parentElement : null;
		if (e.key === i && a !== null) return e.preventDefault(), a.hasAttribute("data-ui-menu-open") ? sl([], TN(a)) : t.click(), !0;
		if (e.key !== "ArrowLeft" || r !== "vertical") return !1;
		let o = a !== null && a.hasAttribute("data-ui-menu-open") && !nA(a) ? a : EN(t), s = o?.querySelector(":scope > .ui-menu-item") ?? null;
		return o === null || s === null ? !1 : (e.preventDefault(), nA(o) || s.focus(), s.click(), !0);
	}
	pressEntry(e, t) {
		e.target !== t || !j(e, { shift: !0 }) || t.matches(Tn) || !N(t) || t.hasAttribute("href") && e.key === "Enter" || (e.preventDefault(), !e.repeat && (e.key === " " ? this.space.hold(t) : t.click()));
	}
	enterFromContainer(e) {
		let t = e.target instanceof HTMLElement && e.target.getAttribute("role") === "menu" ? e.target : null, n = t === null ? null : t.matches(".ui-menu") ? t : t.querySelector(`.${bn}`);
		if (n === null) return;
		let r = $k(n), i = ex(e);
		if (i !== null) {
			e.preventDefault(), sl(r, EO(r, null, i));
			return;
		}
		let a = j(e) ? il({
			key: e.key,
			items: r,
			current: null,
			axis: n.classList.contains(yN) ? "horizontal" : "vertical"
		}) : null;
		a !== null && (e.preventDefault(), sl(r, a));
	}
	handleFocusIn(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${x}`), n = t?.closest(".ui-menu") ?? null;
		t !== null && n !== null && M($k(eA(n)), t);
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${x}`) : null;
		if (t === null || t === document.activeElement || !t.matches(CN) || t.matches(Tn) || !N(t)) return;
		let n = document.activeElement;
		(n instanceof HTMLElement && n.getAttribute("role") === "menu" && n.contains(t) || t.closest(".ui-menu")?.contains(n) === !0) && Ed(t);
	}
};
function TN(e) {
	let t = e.querySelector(`:scope > .ui-menu__submenu > .${bn}`);
	return t === null ? null : $k(t).find(N) ?? null;
}
function EN(e) {
	let t = e.closest(`.${bn}`), n = t === null ? null : tA(t);
	return n !== null && n.hasAttribute("data-ui-menu-open") ? n : null;
}
function DN(e) {
	return e.hasAttribute("data-ui-menu-search") ? e.querySelector(":scope > .ui-collapsible__bar input") : null;
}
var ON = {
	anchor: (e) => e.closest(xN),
	words: (e) => {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length > 0) return null;
		let t = e.querySelector(SN), n = t?.textContent?.trim() ?? "";
		return t === null || n.length === 0 || e.matches(bN) && t.scrollWidth <= t.clientWidth ? null : Nj(n);
	},
	placement: (e) => {
		let t = e.closest(`.${bn}`);
		return t === null ? null : Yk(t);
	}
};
function kN(e) {
	let t = e.target instanceof Element ? e.target : e.target.parentElement;
	if (t !== null && t.closest(".ui-menu") !== null) return !0;
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains("ui-menu") || t.querySelector(".ui-menu") !== null)) return !0;
	return !1;
}
//#endregion
//#region src/interactions/shortcut-engine.ts
var AN = "shortcut:", jN = ":scope > .ui-menu-item__shortcut", MN = `[${Se}]`, NN = `[${kn}]`, PN = ".ui-text__title", FN = class {
	root;
	options;
	claims = /* @__PURE__ */ new Map();
	entryShortcuts = /* @__PURE__ */ new Map();
	stale = !0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.options = e, this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), TM(HN), zN(this.root), this.root instanceof Node && new MutationObserver((e) => {
			this.stale = !0;
			for (let t of e) RN(t);
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [kn]
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || A(e) || (this.stale && this.rebuild(), this.claims.size === 0 && this.entryShortcuts.size === 0 || Gc(e))) return;
		let t = gm(this.root);
		if (!this.pressContextEntry(e, t)) for (let n of this.claims.values()) {
			if (n === null || !uc(n.shortcut, e)) continue;
			let r = n.element ?? this.contentOf(n.view);
			if (r === null || !N(r) || t !== null && !t.contains(r)) return;
			e.preventDefault(), LN(e), n.view === null ? r.click() : r.dispatchEvent(new CustomEvent(n.view.name, { bubbles: !0 }));
			return;
		}
	}
	pressContextEntry(e, t) {
		let n = !1;
		for (let t of this.entryShortcuts.values()) n ||= uc(t, e);
		let r = n ? bA() : null;
		if (r === null || t !== null && !t.contains(r)) return !1;
		let i = vA(r);
		if (i === null) return !1;
		let a = [...i.menu.querySelectorAll(NN)].filter((t) => {
			let n = lc(t.getAttribute(kn));
			return n !== null && uc(n, e) && !D(t) && ZO(t, i.menu);
		});
		return a.length === 1 ? (e.preventDefault(), LN(e), a[0].click(), !0) : (a.length > 1 && s("context menu shortcut is claimed twice and will fire nothing.", { entries: a }), !1);
	}
	contentOf(e) {
		let t = e === null ? null : this.options.componentOf?.(e.componentId) ?? null;
		return t instanceof HTMLElement ? t : null;
	}
	rebuild() {
		this.claims.clear(), this.entryShortcuts.clear(), this.stale = !1;
		for (let e of this.root.querySelectorAll(NN)) {
			let t = e.getAttribute("data-ui-shortcut") ?? "", n = lc(t);
			if (n === null) {
				t.trim().length > 0 && s("shortcut could not be parsed.", {
					element: e,
					value: t
				});
				continue;
			}
			e.closest(MN) === null ? this.claim({
				shortcut: n,
				element: e,
				view: null
			}) : this.entryShortcuts.set(xc(n), n);
		}
		for (let e of this.options.viewShortcuts ?? []) {
			let t = lc(e.name.slice(9));
			t !== null && this.claim({
				shortcut: t,
				element: null,
				view: e
			});
		}
	}
	claim(e) {
		let t = xc(e.shortcut);
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
function IN(e) {
	let t = /* @__PURE__ */ new Map(), n = [...e.events, ...e.interactions.map((e) => e.sourceEvent)];
	for (let e of n) e != null && e.eventName.startsWith(AN) && t.set(e.eventName, {
		name: e.eventName,
		componentId: e.componentId
	});
	return [...t.values()];
}
function LN(e) {
	Uc(e.target) && e.target.dispatchEvent(new Event(Hy, { bubbles: !0 }));
}
function RN(e) {
	if (e.type === "attributes") {
		e.target instanceof HTMLElement && BN(e.target);
		return;
	}
	for (let t of e.addedNodes) t instanceof HTMLElement && zN(t);
}
function zN(e) {
	e instanceof HTMLElement && e.matches(NN) && BN(e);
	for (let t of e.querySelectorAll(NN)) BN(t);
}
function BN(e) {
	let t = e.querySelector(jN);
	if (t === null) return;
	let n = VN(e) ?? "";
	t.textContent !== n && (t.textContent = n), e.hasAttribute("data-ui-menu-item-shortcut") !== n.length > 0 && e.toggleAttribute(nn, n.length > 0);
}
function VN(e) {
	let t = e.getAttribute(kn), n = lc(t);
	return n === null ? t?.trim() || null : dc(n);
}
var HN = {
	anchor: (e) => {
		let t = e.closest(NN);
		return t === null || t.classList.contains("ui-menu-item") || t.closest(MN) !== null ? null : t;
	},
	words: (e) => {
		let t = VN(e), n = (e.getAttribute("aria-label") ?? e.querySelector(PN)?.textContent ?? "").trim();
		return t === null ? null : Nj(n.length > 0 ? `${n} (${t})` : t);
	},
	after: (e) => {
		let t = VN(e);
		return t === null ? null : Nj(`(${t})`);
	}
}, UN = 50, WN = 1, GN = 7;
function KN(e) {
	let t = 0;
	for (let n of e.children) n.hasAttribute("data-ui-key") && t++;
	let n = UC(e, "data-ui-window-size") ?? 0;
	return {
		offset: UC(e, "data-ui-window-offset") ?? 0,
		count: t,
		size: n > 0 ? n : t > 0 ? t : UN,
		total: UC(e, Vt),
		moreAfter: WC(e, Ut)
	};
}
function qN(e) {
	return Math.floor(e.offset / e.size) + 1;
}
function JN(e) {
	return e.total === null ? null : Math.max(1, Math.ceil(e.total / e.size));
}
function YN(e, t) {
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
			let n = Number(t), r = JN(e);
			return !Number.isInteger(n) || n < 1 || r !== null && n > r || n === qN(e) ? null : (n - 1) * e.size;
		}
	}
}
function XN(e, t) {
	if (t <= GN) return QN(1, t);
	let n = Math.max(Math.min(e - WN, t - 2 - 2), 3), r = Math.min(Math.max(e + WN, 5), t - 2);
	return [
		1,
		n > 3 ? "gap" : 2,
		...QN(n, r),
		r < t - 2 ? "gap" : t - 1,
		t
	];
}
function ZN(e, t) {
	let n = XN(e, t ? e + 1 : e);
	return t ? [...n, "gap"] : n;
}
function QN(e, t) {
	let n = [];
	for (let r = e; r <= t; r++) n.push(r);
	return n;
}
//#endregion
//#region src/interactions/pager-engine.ts
var $N = ".ui-pager", eP = "ui-pager__button", tP = "ui-pager__number", nP = "ui-pager__pages", rP = "ui-pager__gap", iP = "ui-pager__range", aP = "ui-pager__size", oP = "ui-pager__size--open", sP = "ui-pager__size-trigger", cP = "ui-pager__size-label", lP = "ui-pager__sizes", uP = "ui-pager__size-choice", dP = [
	eP,
	tP,
	"ui-button",
	"ui-button--ghost",
	"ui-button--small"
], fP = "ui.pager.page", pP = "ui.pager.range", mP = "ui.pager.rows", hP = "ui.pager.size", gP = [
	Bt,
	Vt,
	Ut,
	zt,
	Rt
], _P = "page-size", vP = class {
	options;
	root;
	drawn = /* @__PURE__ */ new WeakMap();
	store = new bk();
	restored = /* @__PURE__ */ new WeakSet();
	menus = new Jh({
		show: ({ owner: e }) => e.classList.add(oP),
		hide: ({ owner: e }) => e.classList.remove(oP),
		closesWhenReadOnly: !1,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.syncAll(), this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e)), (e.pageKeys ?? window).addEventListener("keydown", (e) => this.handlePageKey(e), !0), z(this.root, `${$N}, [${b}]`, {
			childList: !0,
			attributeFilter: gP,
			relevant: (e) => e.type === "attributes" || DP(e.target) || OP(e)
		}, (e) => this.syncFound(e)), E.onChange(() => {
			this.drawn = /* @__PURE__ */ new WeakMap(), this.syncAll();
		});
	}
	syncAll() {
		for (let e of this.root.querySelectorAll($N)) this.sync(e);
	}
	syncFound(e) {
		for (let t of e) {
			if (t.matches($N)) {
				this.sync(t);
				continue;
			}
			for (let e of this.pagersOf(t)) this.sync(e);
		}
	}
	pagersOf(e) {
		let t = e.closest(S), n = t === null ? 0 : T(t);
		return n > 0 ? [...this.root.querySelectorAll(`${$N}[${dt}="${wi(n)}"]`)] : [];
	}
	hostOf(e) {
		return this.targetOf(e)?.host ?? null;
	}
	targetOf(e) {
		let t = Number(e.getAttribute(dt));
		if (!Number.isInteger(t) || t <= 0) return null;
		for (let e of this.options.dom.findEveryComponent(t)) {
			let t = EP(e);
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
		let i = KN(n), a = `${i.offset}|${i.count}|${i.size}|${i.total}|${i.moreAfter}`;
		if (this.drawn.get(e) === a) return;
		this.drawn.set(e, a);
		let o = XS(e), s = (e) => ZS(e, "N0", o);
		this.drawNumbers(e, i, o), bP(e, i, s), xP(e, i, s);
		for (let t of e.querySelectorAll(`:scope > .${eP}[${ft}]`)) bs.setDisabled(t, YN(i, t.getAttribute("data-ui-pager-page") ?? "") === null);
		CP(e);
	}
	drawNumbers(e, t, n) {
		let r = e.querySelector(`:scope > .${nP}`);
		if (r === null) return;
		let i = qN(t), a = JN(t), o = a === null ? ZN(i, t.moreAfter) : XN(i, a), s = r.contains(document.activeElement);
		r.replaceChildren(...o.map((e) => yP(e, i, n))), s && !e.contains(document.activeElement) && r.querySelector("[aria-current='page']")?.focus({ preventScroll: !0 });
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest($N);
		if (t === null || D(e.target)) return;
		let n = e.target.closest(`.${uP}`);
		if (n !== null) {
			e.preventDefault(), this.chooseSize(t, Number(n.getAttribute(pt)));
			return;
		}
		let r = e.target.closest(`.${sP}`);
		if (r !== null) {
			e.preventDefault(), this.toggleSizes(r);
			return;
		}
		let i = e.target.closest(`[${ft}]`), a = i === null ? null : this.hostOf(t);
		if (i === null || a === null) return;
		let o = YN(KN(a), i.getAttribute("data-ui-pager-page") ?? "");
		o !== null && (e.preventDefault(), this.turnAsync(a, o));
	}
	async turnAsync(e, t) {
		await this.options.windows.requestOffsetAsync(e, t), fl(e).top > 0 && pl(e, 0);
	}
	handleKeyDown(e) {
		if (e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest($N);
		if (t === null) return;
		let n = e.target.closest(`.${aP}`);
		if (n !== null && this.handleSizeKey(e, n)) return;
		let r = e.target.closest(`.${eP}, .${sP}`), i = SP(t);
		if (r === null || !i.includes(r) || !j(e)) return;
		let a = il({
			key: e.key,
			items: i,
			current: r,
			axis: "horizontal"
		});
		a !== null && (e.preventDefault(), sl(i, a));
	}
	handleSizeKey(e, t) {
		let n = e.target instanceof Element ? e.target.closest(`.${sP}`) : null;
		return n !== null && !this.menus.isOpen(t) && (e.key === "ArrowDown" || e.key === "ArrowUp") && j(e) ? (e.preventDefault(), this.openSizes(t, n, e.key === "ArrowUp"), !0) : this.menus.isOpen(t) && wO(e, TP(t));
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${uP}`) : null, n = t?.closest(`.${aP}`) ?? null;
		t !== null && n !== null && this.menus.isOpen(n) && DO(t, TP(n));
	}
	toggleSizes(e) {
		let t = e.closest(`.${aP}`);
		t !== null && (this.menus.isOpen(t) ? this.menus.close(t) : this.openSizes(t, e, !1));
	}
	openSizes(e, t, n) {
		let r = e.querySelector(`:scope > .${lP}`);
		if (r === null) return;
		let i = TP(e), a = i.find((e) => e.getAttribute("aria-checked") === "true") ?? null;
		CO(this.menus, {
			owner: e,
			popup: r,
			anchor: t,
			placement: { placement: "bottom-end" },
			openers: [t]
		}, i, a, n);
	}
	restoreSize(e, t, n) {
		let r = this.store.read(t, _P), i = r === null ? 0 : Number(r);
		if (!Number.isInteger(i) || i <= 0) return;
		if (!wP(e, i)) {
			this.store.write(t, _P, null);
			return;
		}
		let a = KN(n);
		i !== a.size && (n.setAttribute(zt, String(i)), a.count > 0 && this.turnAsync(n, Math.floor(a.offset / i) * i));
	}
	chooseSize(e, t) {
		let n = e.querySelector(`.${aP}`);
		n !== null && this.menus.close(n);
		let r = this.targetOf(e);
		if (r === null || !Number.isInteger(t) || t <= 0) return;
		let i = KN(r.host);
		t !== i.size && (this.store.write(r.component, _P, String(t)), r.host.setAttribute(zt, String(t)), this.turnAsync(r.host, Math.floor(i.offset / t) * t));
	}
	handlePageKey(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "PageDown" && e.key !== "PageUp" || !j(e) || !(e.target instanceof Element)) return;
		let t = mu(e);
		if (t === null || !t.root.matches(".ui-items-view, .ui-table") || D(t.root)) return;
		let n = EP(t.root);
		if (n === null || !n.hasAttribute("data-ui-window-paged")) return;
		let r = YN(KN(n), e.key === "PageDown" ? "next" : "previous");
		r !== null && (e.preventDefault(), this.turnFromKeyAsync(t.root, n, r));
	}
	async turnFromKeyAsync(e, t, n) {
		let r = tu(e), i = vu(r), a = i === null ? 0 : Math.max(0, r.indexOf(i));
		await this.options.windows.requestOffsetAsync(t, n);
		let o = tu(e);
		o.length > 0 && Su(e, o, o[Math.min(a, o.length - 1)]);
	}
};
function yP(e, t, n) {
	if (e === "gap") {
		let e = document.createElement("span");
		return e.className = rP, e.setAttribute("aria-hidden", "true"), e.textContent = "…", e;
	}
	let r = document.createElement("button"), i = ZS(e, "N0", n);
	return r.className = dP.join(" "), r.setAttribute("type", "button"), r.setAttribute(ft, String(e)), r.textContent = i, E.write(r, "aria-label", fP, { page: i }), e === t && r.setAttribute("aria-current", "page"), r;
}
function bP(e, t, n) {
	let r = e.querySelector(`:scope > .${iP}`);
	if (r === null) return;
	let i = n(t.count === 0 ? 0 : t.offset + 1), a = n(t.offset + t.count);
	t.total === null ? E.write(r, null, mP, {
		from: i,
		to: a
	}) : E.write(r, null, pP, {
		from: i,
		to: a,
		total: n(t.total)
	});
}
function xP(e, t, n) {
	let r = e.querySelector(`:scope > .${aP}`), i = r?.querySelector(`.${cP}`) ?? null;
	if (r !== null && i !== null) {
		E.write(i, null, hP, { size: n(t.size) });
		for (let e of TP(r)) e.setAttribute("aria-checked", Number(e.getAttribute("data-ui-pager-size")) === t.size ? "true" : "false");
	}
}
function SP(e) {
	return [...e.querySelectorAll(`.${eP}, .${sP}`)];
}
function CP(e) {
	let t = SP(e), n = t.find((e) => e === document.activeElement), r = t.filter((e) => e.getAttribute("data-ui-pager-page") === "previous" || e.getAttribute("data-ui-pager-page") === "next");
	M(t, n ?? r.find(N) ?? t.find((e) => e.getClientRects().length > 0) ?? null);
}
function wP(e, t) {
	let n = e.querySelector(`:scope > .${aP}`);
	return n !== null && TP(n).some((e) => Number(e.getAttribute("data-ui-pager-size")) === t);
}
function TP(e) {
	return [...e.querySelectorAll(`:scope > .${lP} > .${uP}`)];
}
function EP(e) {
	for (let t of e.querySelectorAll(`[${b}][${jt}="windowed"]`)) if (t.closest(S) === e) return t;
	return null;
}
function DP(e) {
	return e instanceof Element && e.hasAttribute("data-ui-items-host");
}
function OP(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches($N) || t.querySelector($N) !== null)) return !0;
	return !1;
}
//#endregion
//#region src/interactions/menu-search-engine.ts
var kP = `.${bn}[${an}]`, AP = ":scope > .ui-collapsible__bar", jP = ":scope > .ui-menu__host", MP = "ui-menu__item", NP = `:scope > .${x}`, PP = ":scope > .ui-menu__submenu > .ui-menu > .ui-menu__host", FP = class {
	active = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("input", (e) => this.handle(e), !0), t.addEventListener("change", (e) => this.handle(e), !0), t.addEventListener("keydown", (e) => this.handleKeydown(e)), z(t, kP, {
			childList: !0,
			characterData: !0,
			attributeFilter: [Yt]
		}, (e) => this.reconcile(e));
	}
	handle(e) {
		let t = e.target;
		if (!(t instanceof HTMLInputElement)) return;
		let n = IP(t);
		n !== null && this.search(n, t);
	}
	search(e, t) {
		let n = e.querySelector(jP);
		if (n === null) return;
		let r = Nm(t.value, e);
		if (r.length === 0) {
			this.clear(e, n);
			return;
		}
		this.active.has(e) || this.active.set(e, {
			field: t,
			openBefore: LP(n)
		}), e.setAttribute(on, ""), Zb(e, n, !this.filter(n, r));
	}
	filter(e, t) {
		let n = null, r = !1, i = !1;
		for (let a of RP(e)) {
			let e = zP(a);
			if (e === "header") {
				n !== null && VP(n, r), n = a, r = !1;
				continue;
			}
			let o = e !== "separator" && this.match(a, t);
			VP(a, o), r ||= o, i ||= o;
		}
		return n !== null && VP(n, r), i;
	}
	match(e, t) {
		let n = Fm(BP(e), t), r = e.hasAttribute("data-ui-menu-group") ? e.querySelector(PP) : null;
		if (r === null) return n;
		if (n) return HP(r), e.removeAttribute(Qt), !0;
		let i = this.filter(r, t);
		return e.toggleAttribute(Qt, i), i;
	}
	clear(e, t) {
		HP(t), e.removeAttribute(on), RP(t).length > 0 && Zb(e, t, !1);
		let n = this.active.get(e);
		if (n === void 0) return;
		this.active.delete(e);
		let r = e.hasAttribute(Yt);
		for (let e of t.querySelectorAll(`[${Xt}]:not([${Zt}])`)) e.toggleAttribute(Qt, !r && n.openBefore.has(e.getAttribute("data-ui-key") ?? e));
	}
	reconcile(e) {
		for (let t of e) {
			let e = this.active.get(t);
			e !== void 0 && (t.hasAttribute("data-ui-collapsed") && (e.field.value = "", e.field.blur()), this.search(t, e.field));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "ArrowDown" || e.defaultPrevented || !j(e) || !(e.target instanceof HTMLInputElement)) return;
		let t = IP(e.target), n = t === null ? void 0 : $k(t).find(N);
		n !== void 0 && (e.preventDefault(), n.focus());
	}
};
function IP(e) {
	let t = e.closest(kP), n = t?.querySelector(AP) ?? null;
	return t !== null && n !== null && n.contains(e) ? t : null;
}
function LP(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e.querySelectorAll(`[${Xt}][${Qt}]`)) t.add(n.getAttribute("data-ui-key") ?? n);
	return t;
}
function RP(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && e.classList.contains(MP));
}
function zP(e) {
	return e.querySelector(NP)?.getAttribute("data-ui-menu-item-kind") ?? "item";
}
function BP(e) {
	let t = e.querySelector(NP);
	return t === null ? "" : Pm(Rm(t), e);
}
function VP(e, t) {
	e.toggleAttribute(sn, !t);
}
function HP(e) {
	for (let t of e.querySelectorAll(`[${sn}]`)) t.removeAttribute(sn);
}
//#endregion
//#region src/interactions/screen-keyboard.ts
var UP = 120;
function WP(e) {
	return e.typing && e.tallest - e.height > UP;
}
var GP = class {
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
		let t = WP({
			height: e.height,
			tallest: this.tallest,
			typing: Wc(document.activeElement)
		});
		t !== document.documentElement.hasAttribute("data-ui-keyboard-up") && document.documentElement.toggleAttribute(Pr, t);
	}
}, KP = "[data-ui-root]", qP = "a[href]", JP = "ui-collapsible", YP = "ui-collapsible__bar", XP = "right-side", ZP = "ui-side--left", QP = "ui-side--right", $P = "pinned", eF = class {
	root;
	holders = /* @__PURE__ */ new Map();
	openers = /* @__PURE__ */ new WeakMap();
	switchNames = /* @__PURE__ */ new Map();
	store = new bk();
	constructor(e = {}) {
		if (this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), typeof matchMedia == "function") for (let e of uk) matchMedia(e).addEventListener("change", () => this.refit());
		for (let e of document.querySelectorAll(KP)) sF(e);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${cn}]`);
		if (t !== null) {
			let e = t.closest(KP), n = t.getAttribute(cn);
			e !== null && n !== null && this.toggle(e, n, t);
			return;
		}
		let n = e.target.closest(`[${pn}]`);
		if (n !== null) {
			let e = n.closest(KP), t = n.getAttribute(pn);
			e !== null && t !== null && this.pin(e, t, !e.hasAttribute(mn(t)), n);
			return;
		}
		if (e.target.closest("[data-ui-drawer-backdrop]") !== null) {
			this.closeAll();
			return;
		}
		let r = e.target.closest(`[${An}]`);
		if (r !== null && !e.defaultPrevented && iF(r)) {
			this.closeAll();
			return;
		}
		let i = e.target.closest(`${qP}, .${x}`), a = i?.closest(`[${vn}]`), o = a?.parentElement ?? null;
		i !== null && a != null && o?.getAttribute("data-ui-drawer-open") === a.getAttribute("data-ui-region") && aF(i) && this.close(o);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || A(e)) return;
		if (e.key === "Tab") {
			this.trapTab(e);
			return;
		}
		if (e.key !== "Escape" || Pc(e) || Em()) return;
		let t = !1;
		for (let { shell: e, drawer: n, modal: r } of this.openDrawers()) !r && !n.contains(document.activeElement) || (this.close(e), t = !0);
		t && e.preventDefault();
	}
	trapTab(e) {
		for (let { drawer: t, modal: n } of this.openDrawers()) n && Md(t, e);
	}
	openDrawers() {
		let e = [];
		for (let t of document.querySelectorAll(`${KP}[${ln}]`)) {
			let n = t.getAttribute("data-ui-drawer-open") ?? "", r = cF(t, n);
			r !== null && !_m(r) && e.push({
				shell: t,
				drawer: r,
				modal: oF(t, n)
			});
		}
		return e;
	}
	refit() {
		for (let e of document.querySelectorAll(`${KP}[${ln}]`)) {
			let t = e.getAttribute("data-ui-drawer-open") ?? "", n = cF(e, t), r = this.openers.get(e);
			n === null || !pk(e, t) ? this.close(e) : r?.isConnected === !0 && this.placeSwitch(n, r);
		}
	}
	toggle(e, t, n) {
		if (e.getAttribute("data-ui-drawer-open") === t) {
			this.close(e);
			return;
		}
		let r = cF(e, t);
		r === null || r.hasAttribute("data-ui-bottom-bar") || !pk(e, t) || (e.hasAttribute("data-ui-drawer-open") && this.close(e), e.setAttribute(ln, t), this.openers.set(e, n), this.markToggles(e), this.hold(r, oF(e, t)), this.placeSwitch(r, n), this.focusInto(e, t, r, document.activeElement, yd(), performance.now() + R.normal));
	}
	hold(e, t) {
		if (this.holders.has(e) || e.hasAttribute("data-ui-focus-holder")) return;
		let n = !e.hasAttribute("tabindex"), r = t && !e.hasAttribute("aria-label") && !e.hasAttribute("aria-labelledby");
		this.holders.set(e, {
			modal: t,
			addsTabIndex: n,
			addsName: r,
			role: e.getAttribute("role")
		}), n && (e.tabIndex = -1), t && (e.setAttribute(oi, ""), e.setAttribute("role", "dialog"), e.setAttribute("aria-modal", "true"), r && e.setAttribute("aria-label", E.text("ui.side.panel")));
	}
	placeSwitch(e, t) {
		let n = tF(e), r = t.getBoundingClientRect();
		if (n === null) return;
		this.switchNames.has(n) || this.switchNames.set(n, n.getAttribute("aria-label")), n.setAttribute("aria-label", E.text("ui.side.close"));
		let i = n.parentElement?.classList.contains(YP) === !0 ? n.parentElement : n;
		if (r.width === 0 || r.height === 0) {
			n.removeAttribute(un), i.removeAttribute(dn);
			return;
		}
		n.style.setProperty("--ui-drawer-switch-width", `${r.width}px`), n.style.setProperty("--ui-drawer-switch-height", `${r.height}px`), n.style.setProperty("--ui-drawer-switch-x", "0px"), i.style.setProperty("--ui-drawer-switch-y", "0px"), n.setAttribute(un, ""), i.setAttribute(dn, "");
		let a = n.getBoundingClientRect(), o = e.getBoundingClientRect(), s = rF(r.left - e.offsetLeft, e.clientWidth - a.width), c = rF(r.top - o.top, e.clientHeight - a.height);
		n.style.setProperty("--ui-drawer-switch-x", `${s - (a.left - o.left)}px`), i.style.setProperty("--ui-drawer-switch-y", `${c - (a.top - o.top)}px`);
	}
	focusInto(e, t, n, r, i, a) {
		e.getAttribute("data-ui-drawer-open") !== t || document.activeElement !== r || n.contains(r) || (Rd(n, i ? n : null), performance.now() < a && document.activeElement === r && requestAnimationFrame(() => this.focusInto(e, t, n, r, i, a)));
	}
	pin(e, t, n, r) {
		let i = cF(e, t);
		if (i === null || gk(e, t)) return;
		let a = i.contains(r);
		if (n && e.getAttribute("data-ui-drawer-open") === t && this.close(e, !a), e.toggleAttribute(mn(t), n), sF(e), !n && a && i.contains(document.activeElement)) {
			let n = this.returnTarget(e, t);
			n !== null && L(n);
		}
		let o = i.querySelector(`[${We}]`);
		o !== null && this.store.write(o, $P, n ? "true" : null, n ? {
			root: !0,
			attributes: { [mn(t)]: "" }
		} : null);
	}
	closeAll() {
		for (let e of document.querySelectorAll(`${KP}[${ln}]`)) this.close(e);
	}
	close(e, t = !0) {
		let n = e.getAttribute(ln);
		if (e.removeAttribute(ln), this.markToggles(e), n === null) return;
		let r = cF(e, n), i = document.activeElement;
		if (t && (i === null || i === document.body || r?.contains(i) === !0)) {
			let t = this.returnTarget(e, n);
			t !== null && r !== null && r.contains(i) ? qd(t, r) : t !== null && L(t);
		}
		this.release(r), this.renameSwitch(r);
	}
	returnTarget(e, t) {
		let n = this.openers.get(e);
		if (this.openers.delete(e), n?.isConnected === !0 && n.getAttribute("data-ui-drawer-toggle") === t && n.checkVisibility()) return n;
		let r = [...e.querySelectorAll(`[${cn}="${wi(t)}"]`)];
		return r.find((e) => e.checkVisibility()) ?? r[0] ?? null;
	}
	markToggles(e) {
		let t = e.getAttribute(ln);
		for (let n of e.querySelectorAll(`[${cn}]`)) n.setAttribute("aria-expanded", String(n.getAttribute(cn) === t));
	}
	release(e) {
		let t = e === null ? void 0 : this.holders.get(e);
		e !== null && t !== void 0 && (this.holders.delete(e), t.addsTabIndex && e.removeAttribute("tabindex"), t.modal && (e.removeAttribute(oi), e.removeAttribute("aria-modal"), t.role === null ? e.removeAttribute("role") : e.setAttribute("role", t.role), t.addsName && e.removeAttribute("aria-label")));
	}
	renameSwitch(e) {
		for (let [t, n] of this.switchNames) e?.contains(t) !== !0 && t.isConnected || (this.switchNames.delete(t), n === null ? t.removeAttribute("aria-label") : t.setAttribute("aria-label", n));
	}
};
function tF(e) {
	for (let t of e.querySelectorAll(`[${An}]`)) if (iF(t) && t.checkVisibility() && nF(t.closest(`.${JP}`), e)) return t;
	return null;
}
function nF(e, t) {
	let n = e;
	for (; n !== null && n !== t;) {
		let e = n.parentElement;
		if (e === null || e.firstElementChild !== n) return !1;
		n = e;
	}
	return n === t;
}
function rF(e, t) {
	return Math.max(0, Math.min(e, t));
}
function iF(e) {
	let t = e.closest(`.${JP}`), n = t?.closest(`[${vn}]`), r = n?.getAttribute(vn), i = n?.parentElement;
	return t == null || t.hasAttribute("data-ui-collapsed") || r == null || i == null ? !1 : i.matches(KP) && i.getAttribute("data-ui-drawer-open") === r && t.classList.contains(r === XP ? QP : ZP);
}
function aF(e) {
	return !e.classList.contains("ui-menu-item") || Qk(e) && e.closest(ai) === null;
}
function oF(e, t) {
	return !(e.getAttribute("data-ui-drawer-modeless") ?? "").split(" ").includes(t);
}
function sF(e) {
	for (let t of e.querySelectorAll(`[${pn}]`)) {
		let n = String(e.hasAttribute(mn(t.getAttribute("data-ui-drawer-pin") ?? "")));
		t.getAttribute("aria-pressed") !== n && (t.setAttribute("aria-pressed", n), t.getAttribute("data-ui-value-kind") === "pressed" && t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}
function cF(e, t) {
	return e.querySelector(`:scope > [${vn}="${wi(t)}"]`);
}
//#endregion
//#region src/interactions/collapsible-engine.ts
var lF = "ui-collapsible", uF = "ui-collapsible__content", dF = "ui-collapsible__bar", fF = "ui-collapsible__bar-content", pF = "collapsed", mF = class {
	root;
	store = new bk();
	restored = /* @__PURE__ */ new WeakSet();
	folds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.restoreEach(this.root.querySelectorAll(`.${lF}`)), z(this.root, `.${lF}`, {
			childList: !0,
			attributeFilter: [Yt]
		}, (e) => this.restoreEach(e));
	}
	restoreEach(e) {
		for (let t of e) {
			if (this.restored.has(t)) {
				this.apply(t, t.hasAttribute(Yt));
				continue;
			}
			this.restored.add(t), this.restore(t);
		}
	}
	restore(e) {
		if (this.toggleOf(e) === null) return;
		let t = this.store.read(e, pF);
		t !== null && this.apply(e, t === "true");
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${An}]`), n = t?.closest(`.${lF}`) ?? null;
		if (t === null || n === null || iF(t)) return;
		e.preventDefault();
		let r = !n.hasAttribute(Yt), i = this.partsOf(n, t);
		this.cancelFold(n);
		let a = gF(n, i);
		this.apply(n, r), this.playFold(n, i, a, r), this.store.write(n, pF, r ? "true" : "false", r ? { attributes: { [Yt]: "" } } : null);
	}
	apply(e, t) {
		e.toggleAttribute(Yt, t), this.toggleOf(e)?.setAttribute("aria-expanded", t ? "false" : "true");
	}
	partsOf(e, t) {
		return {
			content: e.querySelector(`:scope > .${uF}`),
			bar: e.querySelector(`:scope > .${dF} > .${fF}`),
			toggle: t
		};
	}
	toggleOf(e) {
		return e.querySelector(`:scope > [${An}], :scope > .${dF} > [${An}]`);
	}
	playFold(e, t, n, r) {
		if (typeof e.animate != "function" || qf()) return;
		let i = vF(hF(e), n, gF(e, t), r);
		if (i === null) return;
		e.setAttribute(jn, ""), e.offsetWidth;
		let a = {
			duration: R.normal,
			easing: R.ease
		}, o = [e.animate(i.component, a)];
		t.content !== null && o.push(t.content.animate(i.content, a)), t.bar !== null && o.push(t.bar.animate(i.bar, a)), i.toggle !== null && o.push(t.toggle.animate(i.toggle, a)), this.folds.set(e, o), Promise.allSettled(o.map((e) => e.finished)).then(() => {
			this.folds.get(e) === o && (this.folds.delete(e), e.removeAttribute(jn));
		});
	}
	cancelFold(e) {
		let t = this.folds.get(e);
		if (t !== void 0) {
			this.folds.delete(e), e.removeAttribute(jn);
			for (let e of t) e.cancel();
		}
	}
};
function hF(e) {
	return e.classList.contains("ui-side--top") || e.classList.contains("ui-side--bottom") ? "height" : "width";
}
function gF(e, t) {
	let n = hF(e), r = _F(n), i = e.getBoundingClientRect(), a = t.content?.getBoundingClientRect(), o = t.toggle.getBoundingClientRect();
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
function _F(e) {
	return e === "width" ? "height" : "width";
}
function vF(e, t, n, r) {
	let i = _F(e), a = t.component !== n.component, o = Math.abs(t.componentAcross - n.componentAcross) >= .5;
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
function yF(e, t) {
	if (typeof ResizeObserver == "function") {
		let n = new ResizeObserver(() => t(e));
		return n.observe(e), () => n.disconnect();
	}
	let n = () => t(e);
	return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
}
//#endregion
//#region src/interactions/grid-splitter-engine.ts
var bF = "ui-grid-splitter", xF = "ui-container", SF = "ui-orientation--vertical", CF = 16, wF = {
	sliver: 0,
	passFloors: !0
}, TF = {
	sliver: 48,
	passFloors: !0
}, EF = {
	slot: "columns",
	authored: "--ui-columns",
	split: "--ui-split-columns",
	limits: Mn,
	computed: "gridTemplateColumns",
	lineStart: "gridColumnStart",
	lineEnd: "gridColumnEnd",
	coordinate: "clientX",
	decrease: "ArrowLeft",
	increase: "ArrowRight"
}, DF = {
	slot: "rows",
	authored: "--ui-rows",
	split: "--ui-split-rows",
	limits: Nn,
	computed: "gridTemplateRows",
	lineStart: "gridRowStart",
	lineEnd: "gridRowEnd",
	coordinate: "clientY",
	decrease: "ArrowUp",
	increase: "ArrowDown"
}, OF = class {
	root;
	store = new bk();
	restored = /* @__PURE__ */ new WeakMap();
	warner = new p();
	drag;
	placedTiers = /* @__PURE__ */ new WeakMap();
	waiting = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new zm({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${bF}`),
			begin: (e) => this.resolveContext(e),
			coordinate: (e) => e.axis.coordinate,
			move: (e, t) => {
				this.apply(e, t, wF) && this.reportPosition(e.splitter, e.tracks);
			},
			end: (e, t) => {
				this.settle(e), this.remember(t), this.reportPosition(e), this.writeBack(e, t);
			}
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.prepareEach(this.root.querySelectorAll(`.${bF}`)), z(this.root, `.${bF}`, { childList: !0 }, (e) => this.prepareEach(e)), z(this.root, `.${bF}`, { attributeFilter: [Fn] }, (e) => this.takeEach(e)), window.addEventListener("resize", () => this.reportEach());
	}
	prepareEach(e) {
		for (let t of e) {
			let e = jF(t);
			e !== null && (this.restore(e, MF(t)), this.place(t), this.reportPosition(t));
		}
	}
	restore(e, t) {
		let n = this.restored.get(e);
		if (n === void 0 && (n = /* @__PURE__ */ new Set(), this.restored.set(e, n)), n.has(t.slot)) return;
		n.add(t.slot);
		let r = this.store.readJson(e, t.slot);
		if (r !== null) for (let n of Xf) {
			let i = r[n], a = tp(t.split, n);
			i !== void 0 && e.style.getPropertyValue(a).length === 0 && e.style.setProperty(a, i);
		}
	}
	place(e) {
		let t = zF(e);
		if (t === null) return;
		if (e.getClientRects().length === 0) {
			this.waitForBox(e);
			return;
		}
		this.stopWaiting(e);
		let n = this.resolveContext(e);
		if (n === null || (this.placedTiers.set(e, n.tier), !e.hasAttribute("data-ui-bind-position") && PF(n.container, n.axis, n.tier) !== void 0)) return;
		let r = Gs(n.sizes, n.runs, t);
		Math.abs(r) >= 1 && this.apply(n, r) && this.remember(n);
	}
	waitForBox(e) {
		this.waiting.has(e) || this.waiting.set(e, yF(e, () => {
			!e.isConnected || zF(e) === null ? this.stopWaiting(e) : e.getClientRects().length > 0 && (this.place(e), this.reportPosition(e));
		}));
	}
	stopWaiting(e) {
		this.waiting.get(e)?.(), this.waiting.delete(e);
	}
	takeEach(e) {
		for (let t of e) zF(t) === null && t.hasAttribute("data-ui-bind-position") ? this.reset(t, !1) : this.place(t), this.reportPosition(t);
	}
	reportEach() {
		let e = ep();
		for (let t of this.root.querySelectorAll(`.${bF}`)) this.placedTiers.has(t) && this.placedTiers.get(t) !== e && this.place(t), this.reportPosition(t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || !j(e)) return;
		let t = e.target.closest(`.${bF}`);
		if (t === null || this.drag.active || D(t)) return;
		if (e.key === "Enter") {
			e.preventDefault(), this.reset(t);
			return;
		}
		let n = this.resolveContext(t);
		if (n === null) return;
		let r = VF(t), i = n.sizes.reduce((e, t) => e + t, 0), a;
		switch (e.key) {
			case n.axis.decrease:
				a = -r;
				break;
			case n.axis.increase:
				a = r;
				break;
			case "PageUp":
			case "PageDown":
				a = xs(r, i) * RF(e.key, n.axis);
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
		let n = jF(e);
		if (n === null) return;
		let r = MF(e);
		for (let e of Xf) n.style.removeProperty(tp(r.split, e));
		this.store.write(n, r.slot, null), this.placedTiers.delete(e), e.hasAttribute("data-ui-bind-position") || this.place(e), this.reportPosition(e), t && e.hasAttribute("data-ui-bind-position") && e.hasAttribute("data-ui-splitter-position") && (e.removeAttribute(Fn), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	writeBack(e, t) {
		if (!e.hasAttribute("data-ui-bind-position")) return;
		let n = BF(Ws(FF(t.container, t.axis), t.runs));
		e.getAttribute("data-ui-splitter-position") !== n && (e.setAttribute(Fn, n), this.placedTiers.set(e, t.tier), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	handleDoubleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${bF}`) : null;
		t !== null && this.reset(t);
	}
	settle(e) {
		let t = this.resolveContext(e), n = t === null ? 0 : Ys(t.tracks, t.sizes, t.runs, 48);
		t !== null && n !== 0 && this.apply(t, n, wF);
	}
	apply(e, t, n = TF) {
		let r = Ps(e.tracks, e.sizes, e.runs, t, n);
		return r !== null && (e.container.style.setProperty(tp(e.axis.split, e.tier), Es(r)), !0);
	}
	remember(e) {
		let { container: t, axis: n } = e, r = {}, i = {};
		for (let e of Xf) {
			let a = tp(n.split, e), o = t.style.getPropertyValue(a).trim();
			o.length > 0 && (r[e] = o, i[a] = o);
		}
		let a = { styles: i };
		this.store.write(t, n.slot, Object.keys(r).length === 0 ? null : JSON.stringify(r), a);
	}
	resolveContext(e) {
		let t = jF(e);
		if (t === null) return this.warner.warn(e, "a grid splitter must be a direct child of a container."), null;
		let n = MF(e), r = ep(), i = NF(t, n, r), a = i === null ? null : Ss(i);
		if (a === null) return this.warner.warn(e, "the container's track list could not be read.", { template: i }), null;
		let o = As(a, ks(t.getAttribute(n.limits))), s = FF(t, n), c = IF(e, n);
		if (c === null || c >= o.length || s.length < o.length) return this.warner.warn(e, "the splitter's track could not be found in its container.", {
			index: c,
			tracks: o.length,
			sizes: s.length
		}), null;
		o[c].kind === "star" && this.warner.warn(e, "a grid splitter sits in a star track and shares the room it divides; give it an Auto or Absolute track.");
		let l = js(c, LF(t, n).map((e) => IF(e, n)).filter((e) => e !== null && e !== c), o.length);
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
		let n = jF(e);
		if (n === null) return;
		let r = MF(e), i = IF(e, r), a = FF(n, r), o = LF(n, r).map((e) => IF(e, r)).filter((e) => e !== null && e !== i), s = i === null ? null : js(i, o, a.length);
		if (s === null) return;
		e.setAttribute("aria-valuemin", "0"), e.setAttribute("aria-valuemax", "100"), e.setAttribute("aria-valuenow", String(Us(a, s)));
		let c = kF(a, s.before) ? "before" : kF(a, s.after) ? "after" : null;
		c === null ? e.removeAttribute(Lr) : e.getAttribute("data-ui-split-edge") !== c && e.setAttribute(Lr, c), AF(n, t === void 0 ? null : {
			axis: r,
			tracks: Xs(t, a, s, 48)
		});
	}
};
function kF(e, t) {
	return t.every((t) => (e[t] ?? 0) < 1);
}
function AF(e, t) {
	let n = [EF, DF].filter((t) => LF(e, t).length > 0).map((t) => ({
		axis: t,
		sizes: FF(e, t)
	}));
	for (let r of e.children) {
		if (!(r instanceof HTMLElement)) continue;
		let e = getComputedStyle(r), i = r.classList.contains(bF) ? MF(r) : null, a = n.some(({ axis: n, sizes: r }) => n !== i && Qs(e[n.lineStart], e[n.lineEnd], r, t?.axis === n ? t.tracks : void 0));
		a !== r.hasAttribute("data-ui-split-folded") && r.toggleAttribute(Ir, a);
	}
}
function jF(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(xF) ? t : null;
}
function MF(e) {
	return e.classList.contains(SF) ? EF : DF;
}
function NF(e, t, n) {
	let r = PF(e, t, n);
	if (r !== void 0) return r;
	let i = e.style.getPropertyValue(t.authored).trim();
	return i.length > 0 ? i : null;
}
function PF(e, t, n) {
	return ip(n, (n) => e.style.getPropertyValue(tp(t.split, n)).trim() || void 0);
}
function FF(e, t) {
	return getComputedStyle(e)[t.computed].split(" ").map(parseFloat).filter((e) => Number.isFinite(e));
}
function IF(e, t) {
	let n = Number(getComputedStyle(e)[t.lineStart]);
	return Number.isInteger(n) && n >= 1 ? n - 1 : null;
}
function LF(e, t) {
	let n = [];
	for (let r of e.children) r instanceof HTMLElement && r.classList.contains(bF) && MF(r) === t && n.push(r);
	return n;
}
function RF(e, t) {
	return t.increase === "ArrowDown" ? e === "PageDown" ? 1 : -1 : e === "PageUp" ? 1 : -1;
}
function zF(e) {
	return Ks(e.getAttribute(Fn));
}
function BF(e) {
	return String(Math.round(e * 1e4) / 1e4);
}
function VF(e) {
	let t = Number(e.getAttribute(Pn));
	return Number.isFinite(t) && t > 0 ? t : CF;
}
//#endregion
//#region src/interactions/pane-container-engine.ts
var HF = "ui-pane-container", UF = "ui-pane-container__place", WF = "ui-pane-container__pane", GF = "ui-pane-container__grip", KF = "data-ui-pane-lifted", qF = "data-ui-pane-target", JF = "data-ui-pane-moving", YF = "data-ui-pane-near", XF = "panes", ZF = ",", QF = 32, $F = class {
	root;
	store = new bk();
	drag;
	restored = /* @__PURE__ */ new WeakSet();
	held = null;
	near = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new zm({
			root: this.root,
			resolveHandle: (e) => tI(e),
			begin: (e, t) => this.lift(e, t),
			move: (e, t, n) => this.follow(e, n),
			end: (e, t) => this.put(t),
			cancel: (e, t) => this.putBack(t),
			takenBack: (e, t) => this.putBack(t)
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), { passive: !0 }), this.root.addEventListener("pointerout", (e) => this.handlePointerOut(e), { passive: !0 }), this.arrangeEach(this.root.querySelectorAll(`.${HF}`), !1), z(this.root, `.${HF}`, {
			childList: !0,
			attributeFilter: [In],
			relevant: rI
		}, (e) => this.arrangeEach(iI(e), !0));
	}
	arrangeEach(e, t) {
		for (let n of e) {
			let e = !this.restored.has(n);
			e && (this.restored.add(n), this.restore(n)), n.hasAttribute(JF) || lI(n, sI(n), t && !e);
		}
	}
	restore(e) {
		if (e.hasAttribute("data-ui-bind-layout")) return;
		let t = this.store.read(e, XF);
		t !== null && e.setAttribute(In, t);
	}
	lift(e, t) {
		this.dropStaleHold();
		let n = e.parentElement, r = n?.parentElement, i = r?.parentElement;
		if (this.held !== null || n === null || r == null || i == null || oI(i).length < 2) return null;
		if (typeof n.getAnimations == "function") for (let e of n.getAnimations()) e.cancel();
		return n.setAttribute(KF, ""), i.setAttribute(JF, ""), {
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
		e.pane.style.transform = `translate(${t.x - e.start.x}px, ${t.y - e.start.y}px)`, this.mark(e, mI(e.container, e.origin, t));
	}
	mark(e, t) {
		e.target !== t && (e.target?.removeAttribute(qF), t?.setAttribute(qF, ""), e.target = t);
	}
	put(e) {
		let t = e.target, n = e.pane.parentElement, r = t?.querySelector(`:scope > .${WF}`) ?? null;
		if (t === null || n === null || r === e.pane || !e.container.isConnected) {
			this.putBack(e);
			return;
		}
		this.settle(e);
		let i = /* @__PURE__ */ new Map([[e.pane, t]]);
		r !== null && i.set(r, n), uI(i, !0), this.keep(e.container);
	}
	putBack(e) {
		this.settle(e), dI(e.pane), e.container.isConnected && lI(e.container, sI(e.container), !0);
	}
	settle(e) {
		e.target?.removeAttribute(qF), e.pane.removeAttribute(KF), e.container.removeAttribute(JF);
	}
	keep(e) {
		let t = cI(e);
		e.setAttribute(In, t), e.hasAttribute("data-ui-bind-layout") ? e.dispatchEvent(new Event("change", { bubbles: !0 })) : this.store.write(e, XF, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || !j(e)) return;
		this.dropStaleHold();
		let t = tI(e.target);
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
		let r = eI[e.key];
		if (r !== void 0) {
			e.preventDefault(), this.mark(n, hI(n.container, n.origin, n.target ?? n.origin, r) ?? n.target);
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
		let t = e.target instanceof Element ? nI(e.target) : null;
		this.markNear(t !== null && e.clientY - t.getBoundingClientRect().top < QF ? t : null);
	}
	markNear(e) {
		e !== this.near && (this.near?.removeAttribute(YF), e?.setAttribute(YF, ""), this.near = e);
	}
	handlePointerOut(e) {
		e instanceof PointerEvent && e.relatedTarget === null && this.markNear(null);
	}
}, eI = {
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
function tI(e) {
	let t = e.closest(`.${GF}`);
	return t?.parentElement?.parentElement?.parentElement?.classList.contains(HF) === !0 ? t : null;
}
function nI(e) {
	let t = e.closest(`.${WF}`);
	return t?.parentElement?.parentElement?.classList.contains(HF) === !0 ? t : null;
}
function rI(e) {
	if (e.type === "attributes") return e.target instanceof Element && e.target.classList.contains(HF);
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains(HF) || t.querySelector(`.${HF}`) !== null)) return !0;
	return !1;
}
function iI(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) {
		t.add(n);
		for (let e of n.querySelectorAll(`.${HF}`)) t.add(e);
	}
	return t;
}
function aI(e) {
	return Array.from(e.querySelectorAll(`:scope > .${UF}`));
}
function oI(e) {
	return aI(e).filter((e) => e.getClientRects().length > 0);
}
function sI(e) {
	return e.getAttribute(In);
}
function cI(e) {
	return aI(e).map((e) => e.querySelector(`:scope > .${WF}`)?.getAttribute("data-ui-pane") ?? "").join(ZF);
}
function lI(e, t, n) {
	let r = aI(e), i = pI(r.map((e) => e.getAttribute("data-ui-pane-place") ?? ""), t), a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
	for (let e of r) {
		let t = e.querySelector(`:scope > .${WF}`), n = t?.getAttribute(Ln);
		t != null && n != null && a.set(n, t);
	}
	r.forEach((e, t) => {
		let n = a.get(i[t]);
		n !== void 0 && n.parentElement !== e && o.set(n, e);
	}), o.size > 0 && uI(o, n);
}
function uI(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let t of e.keys()) n.set(t, t.getBoundingClientRect());
	for (let [t, n] of e) t.style.transform = "", n.append(t);
	if (!t || qf()) return;
	let r = e.size + 1;
	for (let [e, t] of n) {
		let n = typeof e.animate == "function" ? fI(t, e.getBoundingClientRect()) : null, i = String(r--);
		n !== null && e.animate(n.map((e) => ({
			...e,
			zIndex: i
		})), {
			duration: R.normal + 60,
			easing: R.ease
		});
	}
}
function dI(e) {
	let t = e.style.transform;
	e.style.transform = "", !(t.length === 0 || t === "translate(0px, 0px)" || qf() || typeof e.animate != "function") && e.animate([{ transform: t }, { transform: "none" }], {
		duration: R.normal,
		easing: R.ease
	});
}
function fI(e, t) {
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
function pI(e, t) {
	let n = new Set(e), r = /* @__PURE__ */ new Set(), i = e.map(() => null), a = t === null || t.length === 0 ? [] : t.split(ZF).map((e) => e.trim());
	for (let e = 0; e < i.length && e < a.length; e++) n.has(a[e]) && !r.has(a[e]) && (i[e] = a[e], r.add(a[e]));
	let o = e.filter((e) => !r.has(e));
	return i.map((e) => e ?? o.shift() ?? "");
}
function mI(e, t, n) {
	for (let r of oI(e)) {
		if (r === t) continue;
		let e = r.getBoundingClientRect();
		if (n.x >= e.left && n.x <= e.right && n.y >= e.top && n.y <= e.bottom) return r;
	}
	return null;
}
function hI(e, t, n, r) {
	let i = oI(e).map((e) => ({
		place: e,
		box: e.getBoundingClientRect()
	})), a = i.find((e) => e.place === n)?.box;
	if (a === void 0) return null;
	let o = _I(gI(a), i.map((e) => e.place === t || e.place === n ? null : gI(e.box)), r);
	return o === null ? null : i[o].place;
}
function gI(e) {
	return {
		x: e.left + e.width / 2,
		y: e.top + e.height / 2
	};
}
function _I(e, t, n) {
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
var vI = "ui-split-button", yI = "ui-split-button__main", bI = "ui-split-button__toggle", xI = "ui-split-button__menu", SI = "ui-split-button--open", CI = class {
	root;
	menus = new Jh({
		show: ({ owner: e }) => e.classList.add(SI),
		hide: ({ owner: e }) => e.classList.remove(SI),
		closesWhenReadOnly: !1,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), document.addEventListener("click", (e) => this.handleChoice(e), !1);
	}
	handleClick(e) {
		let t = wI(e.target);
		if (t !== null) {
			e.preventDefault(), this.menus.isOpen(t) ? this.menus.close(t) : this.openMenu(t);
			return;
		}
		let n = this.menus.current;
		n !== null && e.target instanceof Element && e.target.closest(`.${yI}`)?.closest(`.${vI}`) === n && this.menus.close(n);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "ArrowDown" && e.key !== "ArrowUp" || !j(e)) return;
		let t = wI(e.target);
		t === null || this.menus.isOpen(t) || (e.preventDefault(), this.openMenu(t, e.key === "ArrowUp"));
	}
	handleChoice(e) {
		let t = this.menus.current;
		if (t === null || !(e.target instanceof Element)) return;
		let n = TI(t), r = e.target.closest(`.${x}`);
		n !== null && r !== null && n.contains(r) && Qk(r) && this.menus.close(t);
	}
	openMenu(e, t = !1) {
		let n = TI(e), r = n?.querySelector(".ui-menu") ?? null;
		if (n === null || r === null) return;
		let i = e.getAttribute("data-ui-split-placement") ?? "";
		this.menus.open({
			owner: e,
			popup: n,
			anchor: e,
			placement: { placement: op(i) ? i : "bottom-end" },
			openers: EI(e)
		}) && Hd(r, $k(r), t);
	}
};
function wI(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${bI}, .${yI}`), n = t?.closest(`.${vI}`) ?? null;
	return t === null || n === null || t.classList.contains(yI) && n.getAttribute("data-ui-split-mode") !== "menu" ? null : n;
}
function TI(e) {
	return e.querySelector(`:scope > .${xI}`);
}
function EI(e) {
	return [...e.querySelectorAll(":scope > [aria-haspopup]")];
}
//#endregion
//#region src/interactions/button-group-engine.ts
var DI = "ui-button-group", OI = "ui-button-group__item", kI = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${DI}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), z(this.root, `.${DI}`, {
			childList: !0,
			attributeFilter: [Wr]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-selected-key") ?? "", n = [], r = null;
		for (let i of this.ownItems(e)) {
			let e = t.length > 0 && i.getAttribute("data-ui-key") === t, a = AI(i);
			i.toggleAttribute(Ur, e), a !== null && (a.setAttribute("aria-pressed", e ? "true" : "false"), n.push(a), e && (r = a));
		}
		M(n, r ?? n.find(N) ?? null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${OI}`), n = t?.closest(`.${DI}`) ?? null;
		if (t === null || n === null || t.closest(`.${DI}`) !== n || D(n)) return;
		let r = AI(t);
		r !== null && D(r) || this.choose(n, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${OI} > .${di}`), n = t?.closest(`.${DI}`) ?? null;
		if (t === null || n === null || !j(e)) return;
		let r = this.ownItems(n).map(AI).filter((e) => e !== null), i = il({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault(), i.focus({ preventScroll: !0 });
		let a = i.closest(`.${OI}`);
		a !== null && this.choose(n, a);
	}
	choose(e, t) {
		Ol(e, t.getAttribute("data-ui-key") ?? "", {
			attribute: Wr,
			bindingAttribute: Kr,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return El(e, `.${OI}`, `.${DI}`);
	}
};
function AI(e) {
	return e.querySelector(`:scope > .${di}`);
}
//#endregion
//#region src/interactions/accordion-engine.ts
var jI = "ui-accordion", MI = "details", NI = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleSummaryClick(e), !0), this.root.addEventListener("toggle", (e) => this.handleToggle(e), !0), this.normalizeAll(this.root.querySelectorAll(`.${jI}`)), z(this.root, `.${jI}`, { childList: !0 }, (e) => this.normalizeAll(e));
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
		if (!(t === null || !t.classList.contains(jI))) for (let n of this.sectionsOf(t)) n !== e && n.open && (n.open = !1);
	}
	sectionsOf(e) {
		return [...e.querySelectorAll(`:scope > ${MI}`)];
	}
}, PI = "ui-tab-overflow", FI = "ui-tab-overflow__menu", II = "ui-tab-overflow__menu--open", LI = "ui-tab-overflow__entry", RI = "ui-tab-overflow__entry--current", zI = class {
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
		this.options = e, this.list = new HI(e.pick);
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
		let r = () => e.classList.add(this.options.overflowingClass), i = this.options.trailing === !0 ? this.fitTrailing(t, r) : BI({
			...t,
			hiddenClass: this.options.hiddenClass,
			showButton: r
		});
		e.classList.toggle(this.options.overflowingClass, i), i || this.closeListOf(e);
	}
	fitTrailing(e, t) {
		for (let t of e.captions) this.resizes?.observe(t);
		return VI(e, this.options.hiddenClass, t);
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
function BI(e) {
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
function VI(e, t, n) {
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
var HI = class {
	menu;
	button = null;
	list = new Jh({
		show: ({ popup: e }) => e.classList.add(II),
		hide: ({ popup: e }) => {
			e.classList.remove(II), this.button = null;
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e) || this.button !== null && t.includes(this.button),
		onWindowBlur: !0,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	pick;
	constructor(e) {
		this.pick = e, this.menu = document.createElement("div"), this.menu.className = FI, this.menu.setAttribute("role", "menu"), this.menu.addEventListener("click", (e) => this.handleClick(e)), this.menu.addEventListener("keydown", (e) => this.handleKeydown(e)), this.menu.addEventListener("pointermove", (e) => this.handlePointerMove(e));
	}
	isOpenFor(e) {
		return this.list.isOpen(e);
	}
	open(e, t, n) {
		this.close(), this.menu.replaceChildren(...n.map(UI)), this.menu.parentElement === null && document.body.appendChild(this.menu);
		let r = this.menu.querySelector(`.${RI}`);
		this.button = e, gp(e, this.menu);
		let i = {
			owner: t,
			popup: this.menu,
			anchor: e,
			placement: { placement: "bottom-end" },
			openers: [e],
			returnFocus: () => e
		};
		CO(this.list, i, this.entries(), r) || (this.button = null);
	}
	close() {
		this.list.close();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${LI}`), n = t?.getAttribute("data-ui-key") ?? null, r = this.list.current;
		t === null || n === null || r === null || D(t) || (this.close(), this.pick(r, n));
	}
	handleKeydown(e) {
		e.defaultPrevented || wO(e, this.entries());
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${LI}`) : null;
		t !== null && DO(t, this.entries());
	}
	entries() {
		return Array.from(this.menu.querySelectorAll(`.${LI}`));
	}
};
function UI(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${LI} ${fi}`, t.classList.toggle(RI, e.current), t.setAttribute("role", "menuitem"), t.setAttribute(y, e.key), t.textContent = e.title, e.current && t.setAttribute("aria-current", "true"), e.disabled && (t.classList.add($r), t.setAttribute("aria-disabled", "true")), t;
}
//#endregion
//#region src/interactions/tab-switch.ts
var WI = "data-ui-caption-text", GI = ".ui-text__title";
function KI(e) {
	for (let t of e.querySelectorAll(GI)) {
		let e = t.textContent ?? "";
		t.getAttribute(WI) !== e && t.setAttribute(WI, e);
	}
}
function qI(e, t) {
	if (e === null || t === null || e === t || typeof t.animate != "function" || qf()) return;
	let n = e.getBoundingClientRect(), r = t.getBoundingClientRect();
	n.width !== 0 && r.width !== 0 && t.animate([{ transform: `translateX(${n.left - r.left}px) scaleX(${n.width / r.width})` }, { transform: "none" }], {
		duration: R.normal,
		easing: R.ease,
		pseudoElement: "::after"
	});
}
function JI(e) {
	if (!(e === null || qf())) for (let t of e.children) typeof t.animate == "function" && t.animate([{ opacity: 0 }, { opacity: 1 }], {
		duration: R.fast,
		easing: R.enter
	});
}
//#endregion
//#region src/interactions/tabs-engine.ts
var YI = "ui-tabs", XI = "ui-tab-header", ZI = "ui-tab-header--selected", QI = "ui-tab-header--overflowed", $I = "ui-tabs--overflowing", eL = "ui-tabs--no-overflow", tL = "ui-tabs__strip", nL = "data-ui-tab-key", rL = "data-ui-tab-page", iL = class {
	root;
	fitter;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new zI({
			rootClass: YI,
			overflowingClass: $I,
			wraps: (e) => e.classList.contains(eL),
			hiddenClass: QI,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${YI}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), z(this.root, `.${YI}`, {
			childList: !0,
			attributeFilter: [qr, ...Xr],
			relevant: (e) => !sm(e, `[${rL}]`, `.${YI}`)
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-tabs-selected") ?? "", n = this.ownHeaders(e), r = n.filter(aL), i = kl(r, t, (e) => e.getAttribute(nL) ?? "");
		if (i !== null && i !== t) {
			this.select(e, i);
			return;
		}
		let a = n.find((e) => e.classList.contains(ZI)) ?? null, o = null;
		for (let e of n) {
			let n = (e.getAttribute(nL) ?? "") === t;
			e.classList.toggle(ZI, n), e.setAttribute("aria-selected", n ? "true" : "false"), KI(e), n && (o = e);
		}
		this.fitHeaders(e, r, o), qI(a, o), M(n.filter((e) => !e.classList.contains(QI)), o);
		for (let n of this.ownPages(e)) n.hidden = (n.getAttribute(rL) ?? "") !== t, !n.hidden && a !== null && a !== o && JI(n);
	}
	fitHeaders(e, t, n) {
		let r = e.querySelector(`:scope > .${tL}`), i = r?.querySelector(":scope > .ui-tab-overflow") ?? null;
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownHeaders(e).find((e) => (e.getAttribute(nL) ?? "") === t)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownHeaders(e).filter(aL).map((e) => {
				let n = e.getAttribute(nL) ?? "";
				return {
					key: n,
					title: e.textContent?.trim() ?? n,
					current: n === t,
					disabled: D(e)
				};
			});
		});
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${PI}`), n = t?.closest(`.${YI}`) ?? null;
		if (t !== null && n !== null && t.closest(`.${YI}`) === n) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = e.target.closest(`.${XI}`);
		if (r === null || D(r)) return;
		let i = r.closest(`.${YI}`), a = r.getAttribute(nL);
		i !== null && a !== null && r.closest(`.${YI}`) === i && (e.preventDefault(), this.select(i, a));
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || Gc(e) || !j(e)) return;
		let t = e.target.closest(`.${XI}`), n = t?.closest(`.${YI}`) ?? null;
		if (t === null || n === null) return;
		let r = il({
			key: e.key,
			items: this.ownHeaders(n),
			current: t,
			axis: "horizontal"
		});
		r !== null && (e.preventDefault(), this.select(n, r.getAttribute(nL) ?? ""), r.focus());
	}
	select(e, t) {
		Ol(e, t, {
			attribute: qr,
			bindingAttribute: Kr,
			apply: (e) => this.apply(e)
		});
	}
	ownHeaders(e) {
		return El(e, `.${XI}`, `.${YI}`);
	}
	ownPages(e) {
		return El(e, `[${rL}]`, `.${YI}`);
	}
};
function aL(e) {
	return e.classList.contains(QI) || LA(e);
}
//#endregion
//#region src/interactions/tab-out.ts
function oL(e) {
	e.hasAttribute("data-ui-tab-out") || (e.setAttribute(Ne, e.getAttribute("tabindex") ?? ""), e.setAttribute("tabindex", "-1"));
}
function sL(e) {
	let t = e.getAttribute(Ne);
	t !== null && (e.removeAttribute(Ne), t.length === 0 ? e.removeAttribute("tabindex") : e.setAttribute("tabindex", t));
}
function cL(e) {
	return e.tabIndex >= 0 || e.hasAttribute("data-ui-tab-out");
}
//#endregion
//#region src/interactions/command-bar-engine.ts
var lL = "ui-command-bar", uL = "ui-command-bar__host", dL = "ui-command-bar__item", fL = "ui-command-bar__overflow", pL = "ui-command-bar--overflowing", mL = "ui-command-bar__overflowed", hL = "ui-orientation--vertical", gL = "ui-text__title", _L = `${ad}, [${Ne}]`, vL = class {
	root;
	fitter;
	listed = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new zI({
			rootClass: lL,
			overflowingClass: pL,
			wraps: (e) => !SL(e),
			hiddenClass: mL,
			trailing: !0,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pick(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${lL}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), z(this.root, `.${lL}`, { childList: !0 }, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = yL(e), n = e.querySelector(`:scope > .${fL}`);
		if (t === null || n === null) return;
		let r = CL(t);
		this.fitter.fit(e, {
			room: e,
			button: n,
			captions: r,
			selected: null
		}), e.classList.contains(pL) && wL(r);
		for (let e of r) mp(e, e.classList.contains(mL) ? n : null);
		e.classList.contains(hL) ? e.setAttribute("aria-orientation", "vertical") : e.removeAttribute("aria-orientation"), bL(e, null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${fL}`), n = t?.parentElement ?? null;
		t === null || n === null || !n.classList.contains(lL) || (e.preventDefault(), this.fitter.toggleList(n, t, () => this.entriesOf(n)));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof HTMLElement) || !j(e) || Gc(e)) return;
		let t = e.target.closest(`.${lL}`), n = t === null ? [] : xL(t);
		if (t === null || !n.includes(e.target)) return;
		let r = il({
			key: e.key,
			items: n,
			current: e.target,
			axis: t.classList.contains(hL) ? "vertical" : "horizontal"
		});
		r !== null && (e.preventDefault(), bL(t, r), r.focus());
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement ? e.target : null, n = t?.closest(`.${lL}`) ?? null;
		t !== null && n !== null && xL(n).includes(t) && bL(n, t);
	}
	entriesOf(e) {
		let t = yL(e), n = t === null ? [] : CL(t).filter((e) => e.classList.contains(dL) && e.classList.contains(mL)).map((e) => e.querySelector(S) ?? e);
		return this.listed.set(e, n), n.map((e, t) => ({
			key: String(t),
			title: TL(e),
			current: !1,
			disabled: D(e)
		}));
	}
	pick(e, t) {
		let n = this.listed.get(e)?.[Number(t)];
		n?.isConnected === !0 && !D(n) && EL(n).click();
	}
};
function yL(e) {
	return e.querySelector(`:scope > .${uL}`);
}
function bL(e, t) {
	let n = xL(e), r = n.find((e) => e.tabIndex >= 0 && N(e)), i = t ?? n.find((e) => e === document.activeElement) ?? r ?? n.find(N) ?? null;
	for (let e of n) e === i ? sL(e) : oL(e);
}
function xL(e) {
	let t = yL(e), n = [];
	for (let e of t === null ? [] : CL(t)) if (!(!e.classList.contains(dL) || e.classList.contains(mL))) for (let t of e.querySelectorAll(_L)) cL(t) && nl(e, t) && n.push(t);
	let r = e.querySelector(`:scope > .${fL}`);
	return r !== null && e.classList.contains(pL) && n.push(r), n;
}
function SL(e) {
	let t = yL(e);
	if (t === null) return !1;
	let n = getComputedStyle(t);
	return n.flexDirection.startsWith("row") && n.flexWrap === "nowrap";
}
function CL(e) {
	let t = [];
	for (let n of Array.from(e.children)) {
		if (n.classList.contains("ui-hidden")) continue;
		if (n.hasAttribute("data-ui-group-header")) {
			t.push(n);
			continue;
		}
		let e = n.classList.contains(dL) ? n.querySelector(S) : null;
		e !== null && LA(e) && t.push(n);
	}
	return t;
}
function wL(e) {
	let t = !1;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.classList.contains(dL) ? t ||= !r.classList.contains(mL) : t || r.classList.add(mL);
	}
}
function TL(e) {
	let t = EL(e), n = t.querySelector(`.${gL}`)?.textContent?.trim() ?? "";
	return n.length > 0 ? n : e.getAttribute("aria-label")?.trim() || t.getAttribute("aria-label")?.trim() || t.textContent?.trim() || "";
}
function EL(e) {
	return e.matches(ad) ? e : e.querySelector(ad) ?? e;
}
//#endregion
//#region src/interactions/breadcrumbs-engine.ts
var DL = "ui-breadcrumbs", OL = "ui-breadcrumbs__item", kL = "ui-breadcrumb", AL = "ui-breadcrumb--current", jL = "ui-hidden", ML = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), z(this.root, `.${DL}`, {
			childList: !0,
			attributeFilter: ["class", ...Xr]
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${DL}`)) this.apply(e);
	}
	apply(e) {
		let t = El(e, `.${OL}`, `.${DL}`);
		NL(t);
		let n = t.filter((e) => !e.classList.contains(jL)).map((e) => e.querySelector(`.${kL}`)).filter((e) => e !== null && !e.classList.contains(jL)), r = n.length === 0 ? null : n[n.length - 1];
		for (let e of n) {
			let t = e === r;
			e.classList.toggle(AL, t), t ? (e.setAttribute("aria-current", "page"), e.setAttribute("tabindex", "-1")) : (e.removeAttribute("aria-current"), e.removeAttribute("tabindex"));
		}
	}
};
function NL(e) {
	let t = Xf.map(() => !1);
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n], i = Xf.map((e, t) => PL(r, t));
		if (FL(r, gr, Xf.filter((e, t) => i[t])), FL(r, _r, Xf.filter((e, n) => !t[n])), !r.classList.contains(jL)) for (let e = 0; e < Xf.length; e++) t[e] ||= !i[e];
	}
}
function PL(e, t) {
	for (let n of e.children) if (n.getAttribute(Xr[t]) === "collapsed") return !0;
	return !1;
}
function FL(e, t, n) {
	let r = n.join(" ");
	r.length === 0 ? e.removeAttribute(t) : e.getAttribute(t) !== r && e.setAttribute(t, r);
}
//#endregion
//#region src/rendering/color-bytes.ts
function G(e) {
	return Number.isFinite(e) ? Math.min(255, Math.max(0, Math.round(e))) : 0;
}
function IL(e) {
	return G(e).toString(16).padStart(2, "0").toUpperCase();
}
function LL(e, t, n, r) {
	let i = r / 255, a = (e) => Math.round(e * i + 255 * (1 - i));
	return (RL(a(e), a(t), a(n)) + .05) ** 2 > 1.05 * .05 ? "var(--ui-color-on-light)" : "var(--ui-color-on-dark)";
}
function RL(e, t, n) {
	return .2126 * zL(e) + .7152 * zL(t) + .0722 * zL(n);
}
function zL(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
//#endregion
//#region src/interactions/color-input-engine.ts
var BL = "ui-color-input", VL = "ui-color-input--open", HL = "ui-color-input__popup", UL = "ui-color-input__text", WL = "ui-color-input__row", GL = "ui-color-input__swatch--button", KL = "ui-color-input__value-input", qL = "ui-color-input__square-thumb", JL = "ui-color-input__hue-thumb", YL = "data-ui-color-toggle", XL = "data-ui-color-tab", ZL = "data-ui-color-tab-selected", QL = "data-ui-color-pane", $L = "data-ui-color-pane-selected", eR = "data-ui-color-square", tR = "data-ui-color-hue", nR = "data-ui-color-hex", rR = "data-ui-color-channel", iR = "data-ui-color-factor", aR = "data-ui-color-opacity", oR = "data-ui-color-name", sR = "data-ui-color-name-selected", cR = "data-ui-color-format", lR = "data-ui-color-variant", uR = "data-ui-color-no-picker", dR = "data-ui-color-no-palette", fR = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	popups = new Jh({
		show: ({ owner: e }) => e.classList.add(VL),
		hide: ({ owner: e }) => e.classList.remove(VL)
	});
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${BL}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(pa(e.components, `.${BL}`));
		}), z(this.root, `.${BL}`, {
			childList: !0,
			attributeFilter: [
				cR,
				lR,
				uR,
				dR
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), new zm({
			root: this.root,
			resolveHandle: (e) => e.closest(`[${eR}], [${tR}]`),
			begin: (e, t) => {
				let n = e.closest(`.${BL}`);
				if (n === null) return null;
				let r = {
					input: n,
					element: e,
					surface: e.hasAttribute(eR) ? "square" : "hue",
					stateBefore: this.states.get(n),
					valueBefore: n.querySelector(`.${KL}`)?.value ?? null
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
		let t = _R(e), n = this.states.get(e), r = n?.paneChosen === !0 ? pR(e, n.pane) : mR(e);
		if (t.length === 0 || t.startsWith("@")) return {
			...n ?? hR(r),
			pane: r,
			held: !1
		};
		if (t.startsWith("#")) {
			let i = TR(t);
			if (i === null) return n ?? hR(r);
			let [a, o, s, c] = i;
			if (n !== void 0 && n.name === null && gR(this.resolveRgb(e, n), [
				a,
				o,
				s
			])) return {
				...n,
				pane: r,
				opacity: c,
				held: !0
			};
			let [l, u, d] = OR(a, o, s);
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
			...n ?? hR(r),
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
			let [e, a, o] = OR(n, r, i);
			t = {
				...t,
				hue: e,
				saturation: a,
				value: o
			};
		}
		let a = this.states.get(e);
		this.states.set(e, t), xR(e, "--ui-color-input-color", t.held ? DR(n, r, i, t.opacity) : "transparent"), xR(e, "--ui-color-input-solid", DR(n, r, i, 255)), xR(e, "--ui-color-input-on-color", t.held ? LL(n, r, i, t.opacity) : "inherit"), bR(e, t.held ? yR(e, n, r, i, t.opacity) : ""), this.applyPicker(e, t, n, r, i), (a === void 0 || a.name !== t.name || a.pane !== t.pane || a.held !== t.held) && (this.applyPalette(e, t), this.applyPanes(e, t));
	}
	applyPicker(e, t, n, r, i) {
		let a = e.querySelector(`[${eR}]`), o = e.querySelector(`[${tR}]`), [s, c, l] = kR(t.hue, 1, 1);
		if (xR(e, "--ui-color-input-hue", DR(s, c, l, 255)), a !== null) {
			let e = a.querySelector(`.${qL}`);
			e !== null && (xR(e, "left", `${t.saturation * 100}%`), xR(e, "top", `${(1 - t.value) * 100}%`));
		}
		if (o !== null) {
			let e = o.querySelector(`.${JL}`);
			e !== null && xR(e, "top", `${t.hue / 360 * 100}%`);
		}
		SR(e, `[${nR}]`, ER(n, r, i)), SR(e, `[${rR}="r"]`, String(n)), SR(e, `[${rR}="g"]`, String(r)), SR(e, `[${rR}="b"]`, String(i)), xR(e, "--ui-color-input-opacity-fill", `${t.opacity / 255 * 100}%`), CR(e, `[${aR}]`, t.opacity);
	}
	applyPalette(e, t) {
		for (let n of e.querySelectorAll(`[${oR}]`)) n.getAttribute(oR) === t.name ? n.setAttribute(sR, "") : n.removeAttribute(sR);
		let n = t.name === null ? null : e.querySelector(`[${oR}="${t.name}"]`), r = n === null ? null : TR(n.style.getPropertyValue("--ui-color-input-chip").trim());
		xR(e, "--ui-color-input-base", r === null ? "transparent" : DR(r[0], r[1], r[2], 255)), CR(e, `[${iR}]`, t.factor);
	}
	applyPanes(e, t) {
		for (let n of e.querySelectorAll(`[${QL}]`)) n.getAttribute(QL) === t.pane ? n.setAttribute($L, "") : n.removeAttribute($L);
		for (let n of e.querySelectorAll(`[${XL}]`)) n.getAttribute(XL) === t.pane ? n.setAttribute(ZL, "") : n.removeAttribute(ZL);
	}
	resolveRgb(e, t) {
		if (t.name === null) return kR(t.hue, t.saturation, t.value);
		let n = e.querySelector(`[${oR}="${t.name}"]`), r = n === null ? null : TR(n.style.getPropertyValue("--ui-color-input-chip").trim());
		return r === null ? kR(t.hue, t.saturation, t.value) : wR([
			r[0],
			r[1],
			r[2]
		], t.factor);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${YL}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${BL}`));
			return;
		}
		let n = e.target.closest(`[${XL}]`), r = e.target.closest(`.${BL}`);
		if (r === null) return;
		if (n !== null) {
			e.preventDefault();
			let t = n.getAttribute(XL), i = this.states.get(r);
			i !== void 0 && (t === "picker" || t === "palette") && this.applyState(r, {
				...i,
				pane: t,
				paneChosen: !0
			});
			return;
		}
		let i = e.target.closest(`[${oR}]`);
		if (i !== null) {
			e.preventDefault(), this.commit(r, (e) => ({
				...e,
				name: i.getAttribute(oR)
			}));
			return;
		}
		let a = r.querySelector(`.${HL}`);
		(a === null || !e.composedPath().includes(a)) && (e.preventDefault(), this.toggle(r));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target.closest(`.${BL}`);
		if (t !== null) {
			if (e.target.hasAttribute(iR)) {
				this.commit(t, (t) => ({
					...t,
					factor: Number(e.target instanceof HTMLInputElement ? e.target.value : 0)
				}), !1);
				return;
			}
			e.target.hasAttribute(aR) && this.commit(t, (t) => ({
				...t,
				opacity: G(Number(e.target instanceof HTMLInputElement ? e.target.value : 255))
			}), !1);
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target, n = t.closest(`.${BL}`);
		if (n === null) return;
		if (t.hasAttribute(iR) || t.hasAttribute(aR)) {
			this.send(n);
			return;
		}
		if (t.hasAttribute(nR)) {
			let e = TR(t.value);
			if (e === null) {
				this.applyAll([n]);
				return;
			}
			let [r, i, a] = OR(e[0], e[1], e[2]);
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
		let r = t.getAttribute(rR);
		if (r === null) return;
		let i = this.states.get(n);
		if (i === void 0) return;
		let [a, o, s] = this.resolveRgb(n, i), c = {
			r: a,
			g: o,
			b: s
		};
		c[r] = G(Number(t.value));
		let [l, u, d] = OR(c.r, c.g, c.b);
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
		let t = e.input.querySelector(`.${KL}`);
		t !== null && e.valueBefore !== null && (t.value = e.valueBefore);
	}
	applyPoint(e, t) {
		let { input: n, element: r, surface: i } = e, a = r.getBoundingClientRect();
		if (i === "hue") {
			let e = AR((t.y - a.top) / a.height);
			this.commit(n, (t) => ({
				...t,
				hue: e * 360,
				name: null
			}), !1);
			return;
		}
		let o = AR((t.x - a.left) / a.width), s = 1 - AR((t.y - a.top) / a.height);
		this.commit(n, (e) => ({
			...e,
			saturation: o,
			value: s,
			name: null
		}), !1);
	}
	commit(e, t, n = !0) {
		let r = this.states.get(e);
		if (r === void 0 || k(e)) return;
		let i = {
			...t(r),
			held: !0
		};
		this.applyState(e, i);
		let a = e.querySelector(`.${KL}`);
		a !== null && (a.value = vR(i, this.resolveRgb(e, i)), n && this.send(e));
	}
	send(e) {
		k(e) || e.querySelector(`.${KL}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	toggle(e) {
		if (e === null || e.hasAttribute(uR) && e.hasAttribute(dR)) return;
		if (this.popups.isOpen(e)) {
			this.popups.close(e);
			return;
		}
		let t = e.querySelector(`.${HL}`);
		if (t === null) return;
		let n = e.getAttribute(lR) === "swatch", r = n ? e.querySelector(`.${GL}`) : e.querySelector(`.${WL}`), i = n ? r : r?.querySelector(`[${YL}]`) ?? null;
		this.popups.open({
			owner: e,
			popup: t,
			anchor: r ?? e,
			placement: { placement: "bottom-end" },
			openers: i === null ? [] : [i],
			focus: t.querySelector(`[${ZL}]`) ?? !0
		});
	}
};
function pR(e, t) {
	return ((t) => !e.hasAttribute(t === "picker" ? uR : dR))(t) ? t : t === "picker" ? "palette" : "picker";
}
function mR(e) {
	return pR(e, "picker");
}
function hR(e) {
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
function gR(e, t) {
	return e[0] === t[0] && e[1] === t[1] && e[2] === t[2];
}
function _R(e) {
	return e.querySelector(`.${KL}`)?.value.trim() ?? "";
}
function vR(e, t) {
	if (e.name !== null) {
		let t = e.factor === 0 ? "None" : e.factor < 0 ? "Shade" : "Tint";
		return `${e.name}/${t}/${Math.abs(e.factor)}/${e.opacity}`;
	}
	let n = ER(t[0], t[1], t[2]);
	return e.opacity === 255 ? n : `${n}${IL(e.opacity)}`;
}
function yR(e, t, n, r, i) {
	if (e.getAttribute(cR) === "rgb") return i === 255 ? `rgb(${t}, ${n}, ${r})` : `rgba(${t}, ${n}, ${r}, ${(i / 255).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")})`;
	let a = ER(t, n, r);
	return i === 255 ? a : `${a}${IL(i)}`;
}
function bR(e, t) {
	for (let n of e.querySelectorAll(`.${UL}`)) n.textContent !== t && (n.textContent = t);
}
function xR(e, t, n) {
	e !== null && e.style.getPropertyValue(t) !== n && e.style.setProperty(t, n);
}
function SR(e, t, n) {
	let r = e.querySelector(t);
	r !== null && r !== document.activeElement && r.value !== n && (r.value = n);
}
function CR(e, t, n) {
	for (let r of e.querySelectorAll(t)) r !== document.activeElement && r.value !== String(n) && (r.value = String(n));
}
function wR(e, t) {
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
function TR(e) {
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
function ER(e, t, n) {
	return `#${IL(e)}${IL(t)}${IL(n)}`;
}
function DR(e, t, n, r) {
	return `rgba(${e}, ${t}, ${n}, ${(r / 255).toFixed(3)})`;
}
function OR(e, t, n) {
	let r = e / 255, i = t / 255, a = n / 255, o = Math.max(r, i, a), s = o - Math.min(r, i, a), c = 0;
	return s !== 0 && (c = o === r ? (i - a) / s % 6 : o === i ? (a - r) / s + 2 : (r - i) / s + 4, c *= 60, c < 0 && (c += 360)), [
		c,
		o === 0 ? 0 : s / o,
		o
	];
}
function kR(e, t, n) {
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
function AR(e) {
	return Math.min(1, Math.max(0, e));
}
//#endregion
//#region src/interactions/surface-press-engine.ts
var jR = `:is(.ui-surface, .ui-card)[${re}]`, MR = "ui-surface--clickable", NR = class {
	pressable = /* @__PURE__ */ new WeakSet();
	space = new bc();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("keydown", (e) => this.handleKeyDown(e)), t.addEventListener("keyup", (e) => this.space.release(e)), RR(t, ["hover", "press"], (e) => LR(e.closest(Zc))), z(t, jR, {
			childList: !0,
			attributeFilter: ["class"]
		}, (e) => this.syncEach(e)), this.syncEach(t.querySelectorAll(jR));
	}
	syncEach(e) {
		for (let t of e) {
			this.sync(t);
			let e = t.parentElement?.closest(jR) ?? null;
			e !== null && this.sync(e);
		}
	}
	sync(e) {
		if (!e.classList.contains(MR)) {
			this.pressable.delete(e) && (e.removeAttribute("tabindex"), e.removeAttribute("role"));
			return;
		}
		this.pressable.add(e), BR(e, "role", IR(e) ? "group" : "button"), BR(e, "tabindex", e.matches(".ui-disabled, .ui-loading") ? null : FR(e) ? "-1" : "0");
	}
	handleKeyDown(e) {
		let t = PR(e);
		if (t === null) return;
		let n = e.key;
		n === "Enter" ? (e.preventDefault(), e.repeat || t.click()) : n === " " && (e.preventDefault(), this.space.hold(t));
	}
};
function PR(e) {
	if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !j(e, { shift: !0 })) return null;
	let t = e.target;
	return t instanceof HTMLElement && t.classList.contains(MR) && t.hasAttribute("tabindex") ? t : null;
}
function FR(e) {
	let t = e.closest(jl);
	return t !== null && t.closest(P)?.matches(".ui-items-view, .ui-table") === !0 && $c(t) === e;
}
function IR(e) {
	for (let t of e.querySelectorAll(Zc)) if (nl(e, t)) return !0;
	return !1;
}
function LR(e) {
	let t = [];
	for (let n = e?.parentElement?.closest(`.${MR}`) ?? null; n !== null; n = n.parentElement?.closest(`.${MR}`) ?? null) t.push(n);
	return t;
}
function RR(e, t, n) {
	let r = {
		hover: [],
		press: []
	}, i = !1, a = (e, t) => {
		let a = t instanceof Element ? n(t) : [];
		e === "press" && (i = !1);
		for (let t of r[e]) a.includes(t) || zR(t, e, !1);
		for (let t of a) zR(t, e, !0);
		r[e] = a;
	};
	t.includes("hover") && (e.addEventListener("pointerover", (e) => a("hover", e.target)), e.addEventListener("pointerout", (e) => a("hover", e.relatedTarget))), t.includes("press") && (e.addEventListener("pointerdown", (e) => a("press", e.button === 0 ? e.target : null), !0), e.addEventListener("pointerup", () => a("press", null), !0), e.addEventListener("dragend", () => a("press", null), !0), e.addEventListener("dragstart", () => {
		i = r.press.length > 0;
	}, !0), e.addEventListener("pointercancel", () => {
		i || a("press", null);
	}, !0));
}
function zR(e, t, n) {
	let r = (e.getAttribute("data-ui-inner-pointer") ?? "").split(" ").filter((e) => e !== "" && e !== t);
	n && r.push(t), BR(e, Vr, r.length === 0 ? null : r.sort().join(" "));
}
function BR(e, t, n) {
	n === null ? e.removeAttribute(t) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/interactions/table-columns-engine.ts
var VR = "ui-table", HR = "ui-table--reorderable", UR = "ui-scroll-x--auto", WR = "ui-scroll-x--always", GR = `:scope > .${Un}`, KR = `.${Gn}`, qR = "ui-table__header-cell", JR = `${qR}--pinned`, YR = `${GR} > .${Wn} > .${qR}`, XR = `${YR}--pinned`, ZR = "ui-table__host", QR = `${GR} > .${ZR}`, $R = `.${VR}, .${Hn}, [${Rn}]`, ez = "--ui-table-columns", tz = "--ui-table-sticky-top", nz = "--ui-table-sticky-bottom", rz = "--ui-table-sized-columns", iz = "--ui-table-pin-", az = 64, oz = "data-ui-table-cell-hidden", sz = "data-ui-table-cell-last", cz = "columns", lz = "hidden", uz = "order", dz = "layout", fz = 32, pz = 16, mz = class {
	root;
	store = new bk();
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
		if (this.root = e.root ?? document, this.drag = new zm({
			root: this.root,
			resolveHandle: (e) => e.closest(KR),
			begin: (e) => this.resolveContext(e),
			coordinate: () => "clientX",
			move: (e, t) => this.apply(e, t),
			end: (e, t) => this.remember(t.table)
		}), this.reorder = new zm({
			root: this.root,
			resolveHandle: (e) => this.resolveCaption(e),
			begin: (e, t) => this.beginReorder(e, t.x),
			coordinate: () => "clientX",
			move: (e, t) => this.aimDrop(e, t),
			end: (e, t) => this.endReorder(e, t)
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), RR(this.root, ["hover", "press"], (e) => {
			let t = e.closest(KR)?.parentElement ?? null;
			return t === null ? [] : [t];
		}), typeof matchMedia == "function") for (let e of Xf) e !== "base" && matchMedia(Qf(e)).addEventListener("change", () => this.layoutAll());
		this.restoreEach(this.root.querySelectorAll(`.${VR}`)), z(this.root, `.${VR}`, {
			childList: !0,
			relevant: yz
		}, (e) => {
			for (let t of e) this.restored.has(t) && (this.stampUnstyledColumns(t, !0), this.indexColumns(t, !0));
			this.restoreEach(e);
		}), z(this.root, `.${VR}`, {
			attributeFilter: ["class"],
			relevant: (e) => e.target instanceof Element && e.target.classList.contains(VR)
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.layout(t);
		}), z(this.root, `.${VR}`, {
			childList: !0,
			attributeFilter: ["class", "hidden"],
			relevant: bz
		}, (e) => {
			for (let t of e) {
				let e = t.querySelector(QR);
				e !== null && t.hasAttribute("data-ui-table-scrollbar") && this.markScrollbar(t, e);
			}
		});
	}
	restoreEach(e) {
		for (let t of e) {
			if (this.restored.has(t)) continue;
			this.restored.add(t), this.restore(t), this.layout(t), yF(t, () => this.pin(t));
			let e = t.querySelector(GR);
			e !== null && yF(e, () => hz(t, e));
			let n = t.querySelector(QR);
			n !== null && (this.markScrollbar(t, n), yF(n, () => this.markScrollbar(t, n)));
		}
	}
	restore(e) {
		let t = this.columnsOf(e), n = this.store.read(e, cz), r = n === null ? null : Ss(n);
		r !== null && r.length !== t.length ? (this.store.write(e, cz, null), this.store.writeBoot(e, dz, null), this.widths.set(e, null)) : this.widths.set(e, r);
		let i = this.store.readJson(e, uz);
		if (i !== null && !Sz(i, t)) {
			this.store.write(e, uz, null), this.orders.set(e, null);
			return;
		}
		this.orders.set(e, i);
	}
	markScrollbar(e, t) {
		let n = getComputedStyle(t).overflowY;
		e.toggleAttribute(nr, n === "scroll" || n === "auto" && t.scrollHeight > t.clientHeight);
	}
	layoutAll() {
		for (let e of this.root.querySelectorAll(`.${VR}`)) this.layout(e);
	}
	layout(e) {
		let t = this.columnsOf(e), n = this.hiddenOf(e, t), r = this.placesOf(e, t), i = xz(r), a = this.widths.get(e) ?? null, o = r.some((e, t) => e !== t), s = e.classList.contains(UR) || e.classList.contains(WR);
		if (a === null && n.size === 0 && !o && !s) e.style.removeProperty(rz);
		else {
			let t = a ?? this.authoredTracks(e);
			if (t !== null) {
				let r = Zs(t, n);
				e.style.setProperty(rz, Es(i.map((e) => r[e]), s ? "max-content" : "auto"));
			}
		}
		for (let t = 0; t < r.length; t++) o ? e.style.setProperty(`${nu}${t}`, String(r[t])) : e.style.removeProperty(`${nu}${t}`);
		let c = [...n].sort((e, t) => e - t).join(" ");
		c.length === 0 ? e.removeAttribute(Vn) : e.getAttribute("data-ui-table-hidden") !== c && e.setAttribute(Vn, c);
		let l = [...i].reverse().find((e) => !n.has(e));
		if (l === void 0 ? e.removeAttribute(Zn) : e.getAttribute("data-ui-table-last") !== String(l) && e.setAttribute(Zn, String(l)), this.columnStates.set(e, {
			places: r,
			hidden: n,
			last: l ?? -1
		}), this.stampUnstyledColumns(e, !1), this.indexColumns(e, !1), e.classList.contains(HR)) for (let e of t) !e.anchored && !e.cell.hasAttribute("tabindex") && e.cell.setAttribute("tabindex", "-1");
		this.pin(e);
	}
	stampUnstyledColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0 || n.places.length <= az) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}|${n.last}`;
		if (!(!t && this.stampedStates.get(e) === r)) {
			this.stampedStates.set(e, r);
			for (let t of e.querySelectorAll(`[${Rn}]`)) {
				let r = Number(t.getAttribute(Rn));
				!(r >= az) || t.closest(`.${VR}`) !== e || (t.style.order = String(n.places[r] ?? r), t.toggleAttribute(oz, n.hidden.has(r)), t.toggleAttribute(sz, r === n.last));
			}
		}
	}
	indexColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}`, i = this.indexedStates.get(e) === r;
		i && !t || (this.indexedStates.set(e, r), su(e, xz(n.places), n.hidden, i));
	}
	columnsOf(e) {
		let t = [];
		for (let n of e.querySelectorAll(YR)) {
			let e = Number(n.getAttribute(Rn)), r = n.getAttribute(zn), i = n.classList.contains(JR) || n.hasAttribute("data-ui-table-fixed");
			Number.isInteger(e) && t.push({
				index: e,
				key: n.getAttribute("data-ui-table-column-key") ?? String(e),
				hideBelow: Ez(r) ? r : null,
				startsHidden: n.hasAttribute(Bn),
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
		for (let e of t) (n[e.key] ?? Tz(e)) && r.add(e.index);
		return r;
	}
	choicesOf(e) {
		let t = this.hiddenChoices.get(e);
		return t === void 0 && (t = this.store.readJson(e, lz) ?? {}, this.hiddenChoices.set(e, t)), t;
	}
	authoredTracks(e) {
		let t = e.style.getPropertyValue(ez).trim(), n = t.length === 0 ? null : Ss(t);
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
		n === null || i !== void 0 && n === Tz(i) ? delete r[t] : r[t] = n, this.hiddenChoices.set(e, r), this.store.writeJson(e, lz, Object.keys(r).length === 0 ? null : r), this.layout(e), this.rememberBoot(e);
	}
	columnOrder(e) {
		if (!(e instanceof HTMLElement)) return [];
		let t = this.columnsOf(e), n = new Map(t.map((e) => [e.index, e]));
		return xz(this.placesOf(e, t)).map((e) => n.get(e)?.key ?? "").filter((e) => e.length > 0);
	}
	pin(e) {
		let t = e.querySelectorAll(XR).length;
		if (t < 2) return;
		let n = qs(this.trackSizes(e), t);
		for (let t = 1; t < n.length; t++) e.style.setProperty(`${iz}${t}`, `${n[t]}px`);
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof HTMLElement) || !t.classList.contains("ui-table__scroll") || t.closest(`.${VR}`)?.toggleAttribute(tr, t.scrollLeft > 0);
	}
	trackSizes(e) {
		let t = e.querySelector(GR), n = t === null ? [] : getComputedStyle(t).gridTemplateColumns.split(" ").map(parseFloat);
		return _z(e) ? n.slice(1) : n;
	}
	columnSizes(e, t) {
		let n = this.trackSizes(e);
		return t.map((e) => n[e]);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		if (e.altKey && j(e, { alt: !0 }) && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
			this.stepColumn(e, e.key === "ArrowLeft" ? -1 : 1);
			return;
		}
		let t = e.target.closest(KR), n = t ?? (e.shiftKey ? gz(e.target) : null);
		if (n === null || this.drag.active || !j(e, { shift: t === null })) return;
		if (t !== null && e.key === "Enter" || t === null && e.key === "Backspace") {
			e.preventDefault(), this.reset(n);
			return;
		}
		let r = e.key === "PageUp" || e.key === "PageDown";
		if (!r && e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
		let i = this.resolveContext(n);
		if (i === null) return;
		let a = r ? xs(pz, i.sizes.reduce((e, t) => e + t, 0)) : pz;
		e.preventDefault(), this.apply(i, e.key === "ArrowRight" || e.key === "PageUp" ? a : -a) && this.remember(i.table);
	}
	stepColumn(e, t) {
		let n = e.target instanceof Element ? this.resolveCaption(e.target) : null, r = n?.closest(`.${VR}`) ?? null;
		if (n === null || r === null || this.reorder.active) return;
		let i = this.movableColumns(r), a = Number(n.getAttribute(Rn)), o = i.findIndex((e) => e.index === a), s = o + t;
		o < 0 || (e.preventDefault(), !(s < 0 || s >= i.length) && (this.moveColumn(r, a, t < 0 ? i[s].index : i[s + 1]?.index ?? null), n.focus({ preventScroll: !0 })));
	}
	handleDoubleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(KR) : null;
		t !== null && this.reset(t);
	}
	reset(e) {
		let t = e.closest(`.${VR}`);
		t !== null && (this.widths.set(t, null), this.layout(t), this.remember(t));
	}
	apply(e, t) {
		let n = Ps(e.tracks.map((t, n) => n === e.index || n === e.after ? {
			...t,
			min: Math.max(fz, e.floors.get(n) ?? 0)
		} : t), e.sizes, {
			before: [e.index],
			after: [e.after]
		}, t);
		return n !== null && (this.widths.set(e.table, vz(e.tracks, n, [e.index, e.after])), this.layout(e.table), !0);
	}
	remember(e) {
		let t = this.widths.get(e) ?? null;
		this.store.write(e, cz, t === null ? null : Es(t), null), this.rememberBoot(e);
	}
	rememberBoot(e) {
		let t = e.style.getPropertyValue(rz).trim(), n = e.getAttribute(Vn), r = {};
		t.length > 0 && (r[rz] = t);
		for (let t of e.style) t.startsWith("--ui-table-order-") && (r[t] = e.style.getPropertyValue(t));
		if (Object.keys(r).length === 0 && n === null) {
			this.store.writeBoot(e, dz, null);
			return;
		}
		this.store.writeBoot(e, dz, {
			styles: r,
			attributes: {
				[Vn]: n,
				[Zn]: e.getAttribute(Zn)
			}
		});
	}
	resolveContext(e) {
		let t = e.closest(`.${VR}`);
		if (t === null) return null;
		let n = this.widths.get(t) ?? this.authoredTracks(t);
		if (n === null) return null;
		let r = ks(t.getAttribute(Mn)), i = As(n, r), a = /* @__PURE__ */ new Map(), o = this.columnsOf(t), s = this.placesOf(t, o), c = this.columnSizes(t, s).filter((e) => Number.isFinite(e));
		for (let e of r) e.min !== void 0 && a.set(e.index, e.min);
		let l = Number(e.getAttribute(Rn)), u = this.hiddenOf(t, o), d = xz(s), f = (s[l] ?? -1) + 1;
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
		let t = e.closest(`.${qR}`), n = t?.closest(`.${VR}`) ?? null;
		return t === null || n === null || !n.classList.contains(HR) || e.closest(KR) !== null || t.classList.contains(JR) || t.hasAttribute("data-ui-table-fixed") ? null : t;
	}
	beginReorder(e, t) {
		let n = e.closest(`.${VR}`), r = Number(e.getAttribute(Rn));
		if (n === null || !Number.isInteger(r)) return null;
		let i = this.movableColumns(n), a = i.findIndex((e) => e.index === r);
		return a < 0 || i.length < 2 ? null : (n.setAttribute(Qn, ""), e.setAttribute($n, ""), {
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
		for (let a of xz(this.placesOf(e, t))) {
			let e = r.get(a);
			e !== void 0 && !e.anchored && !n.has(a) && i.push(e);
		}
		return i;
	}
	aimDrop(e, t) {
		let n = e.origin + t, r = 0;
		for (; r < e.places.length && n > Cz(e.places[r]);) r++;
		if (e.target = Math.min(Math.max(r > e.from ? r - 1 : r, 0), e.places.length - 1), wz(e.table), e.target === e.from) return;
		let i = e.places.filter((t, n) => n !== e.from), a = i[e.target];
		a === void 0 ? i[i.length - 1].cell.setAttribute(er, "after") : a.cell.setAttribute(er, "before");
	}
	endReorder(e, t) {
		if (e.removeAttribute($n), t.table.removeAttribute(Qn), wz(t.table), t.target === t.from) return;
		let n = t.places.filter((e, n) => n !== t.from);
		Vm(), this.moveColumn(t.table, t.index, n[t.target]?.index ?? null);
	}
	moveColumn(e, t, n) {
		let r = this.columnsOf(e), i = new Map(r.map((e) => [e.index, e])), a = xz(this.placesOf(e, r)).filter((e) => i.get(e)?.anchored === !1), o = a.indexOf(t);
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
		this.orders.set(e, u ? null : c), this.store.write(e, uz, u ? null : JSON.stringify(c)), this.layout(e), this.rememberBoot(e);
	}
};
function hz(e, t) {
	let n = 0, r = 0, i = !1;
	for (let e of t.children) if (e.matches(`.${ZR}`)) i = !0;
	else if (!(e instanceof HTMLElement) || e.getAttribute("role") !== "row") continue;
	else i ? r += e.offsetHeight : n += e.offsetHeight;
	e.style.setProperty(tz, `${n}px`), e.style.setProperty(nz, `${r}px`);
}
function gz(e) {
	let t = e.matches(`.${qR}`) ? e.querySelector(`:scope > ${KR}`) : null;
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function _z(e) {
	return e.hasAttribute("data-ui-rows-draggable") && e.hasAttribute("data-ui-rows-drag-handle") && e.classList.contains("ui-drag-handle--start");
}
function vz(e, t, n) {
	for (let r of n) e[r].kind === "star" && e[r].min === e[r].value && t[r].kind === "star" && (t[r] = {
		...t[r],
		min: t[r].value
	});
	return t;
}
function yz(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches($R) || t.querySelector($R) !== null)) return !0;
	return !1;
}
function bz(e) {
	let t = e.type === "childList" ? e.target : e.target.parentElement;
	return t instanceof Element && t.classList.contains(ZR);
}
function xz(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) t[e[n]] = n;
	return t;
}
function Sz(e, t) {
	if (e.length !== t.length) return !1;
	let n = new Set(t.map((e) => e.key));
	return e.every((e) => n.delete(e)) && n.size === 0;
}
function Cz(e) {
	let t = e.cell.getBoundingClientRect();
	return t.left + t.width / 2;
}
function wz(e) {
	for (let t of e.querySelectorAll(`[${er}]`)) t.removeAttribute(er);
}
function Tz(e) {
	return e.startsHidden || e.hideBelow !== null && Xf.indexOf(ep()) < Xf.indexOf(e.hideBelow);
}
function Ez(e) {
	return e !== null && Xf.includes(e);
}
//#endregion
//#region src/items/items-group-runs.ts
var Dz = /* @__PURE__ */ new WeakMap();
function Oz(e, t) {
	let n = /* @__PURE__ */ new Set(), r = e.getAttribute(Wt);
	for (let i of H(e)) {
		let a = i.getAttribute("data-ui-group") ?? "";
		if (a !== "" && a !== r) {
			let r = kz(i, a) ?? Az(e, i, a, t);
			r !== null && n.add(r);
		}
		r = a;
	}
	for (let t of e.querySelectorAll(`:scope > [${Ct}]`)) n.has(t) || t.remove();
}
function kz(e, t) {
	let n = e.previousElementSibling, r = n === null ? void 0 : Dz.get(n);
	return r !== void 0 && r.row === e && r.group === t ? n : null;
}
function Az(e, t, n, r) {
	let i = r(t);
	return i === null ? null : (Pz(i, t.getAttribute(y)), Dz.set(i, {
		row: t,
		group: n
	}), e.insertBefore(i, t), i);
}
function jz(e, t, n) {
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
function Mz(e) {
	return e.find((e) => !e.classList.contains(ni));
}
function Nz(e, t, n, r, i) {
	let a = t.renderFromTemplate(e, n, i);
	if (a === null) return null;
	let o = document.createElement("div");
	return Pz(o, r), o.appendChild(a), o;
}
function Pz(e, t) {
	e.setAttribute(Ct, ""), t === null ? e.removeAttribute(wt) : e.setAttribute(wt, t);
}
var Fz = "bottom", Iz = "pending";
function Lz(e, t, n) {
	let r = e.querySelector(`:scope > [${It}="${t}"]`);
	if (n <= 0) {
		r?.remove();
		return;
	}
	r === null && (r = document.createElement("div"), r.setAttribute(It, t), r.style.flexShrink = "0"), t === "top" ? e.firstElementChild !== r && e.insertBefore(r, e.firstElementChild) : e.lastElementChild !== r && e.appendChild(r), r.style.height = `${n}px`;
}
//#endregion
//#region src/items/items-dom-order.ts
function Rz(e, t) {
	let n = e.firstElementChild;
	n !== null && n.getAttribute("data-ui-window-spacer") === "top" && (n = n.nextElementSibling);
	for (let r of t) r !== n && e.insertBefore(r, n), n = r.nextElementSibling;
}
//#endregion
//#region src/items/items-group-renderer.ts
var zz = /* @__PURE__ */ new WeakMap();
function Bz(e) {
	for (let t of e.querySelectorAll(`:scope > [${Ct}]`)) t.remove();
}
function Vz(e, t, n, r, i, a) {
	let o = Lw(e, H(e)), s = n.getGroupTemplate(t), c = s !== void 0, l = c && o.some((e) => e.hasAttribute("data-ui-group")), u = Ow(i.getItemsFilterSortMetadata(t), a, ww(e));
	if (c && !l && Bz(e), o.length === 0) {
		zz.set(e, []);
		return;
	}
	let d = iw(e);
	if (!l) {
		Rz(e, [...kw(o, u, r), ...rw(d)]);
		return;
	}
	Bz(e);
	let { buckets: f, order: p } = jz(o, (e) => e.getAttribute("data-ui-group") ?? "", zz.get(e) ?? []), m = r.getAncestorStack(e);
	zz.set(e, p);
	let h = [];
	for (let e of p) {
		let t = f.get(e);
		u.length > 0 && (t = kw(t, u, r));
		let n = e === "" ? void 0 : Mz(t);
		if (n !== void 0) {
			let e = Nz(s, r, r.getItemValue(n), n.getAttribute(y), m);
			e !== null && h.push(e);
		}
		h.push(...t);
	}
	Rz(e, [...h, ...rw(d)]);
}
//#endregion
//#region src/items/items-host-sync.ts
var Hz = "ui-tree-rules", Uz = `:scope > .${qn}:not(.${Xn})`;
function Wz(e, t, n) {
	if (e.parentElement?.classList.contains("ui-tree") === !0) {
		e.dispatchEvent(new Event(Hz, { bubbles: !0 })), aw(e, t, n.templates, n.renderer, e.querySelector(Uz) !== null);
		return;
	}
	switch (V(e)) {
		case "windowed":
			aw(e, t, n.templates, n.renderer), Kz(e, t, n);
			return;
		case "virtualized":
			n.virtualization.sync(e);
			return;
		default:
			Tw(e, t, n.metadata, n.renderer, n.state), Gz(e), aw(e, t, n.templates, n.renderer), Vz(e, t, n.templates, n.renderer, n.metadata, n.state);
			return;
	}
}
function Gz(e) {
	let t = Qu(e);
	t !== null && Zu(t, H(e).filter((e) => e instanceof HTMLElement));
}
function Kz(e, t, n) {
	let r = n.templates.getGroupTemplate(t);
	if (r === void 0) return;
	let i = n.renderer.getAncestorStack(e);
	Oz(e, (e) => Nz(r, n.renderer, n.renderer.getItemValue(e), e.getAttribute(y), i));
}
//#endregion
//#region src/interactions/table-header-group.ts
var qz = ".ui-table", Jz = `:scope > .${Un} > .${Wn} > [role='columnheader']`, Yz = `:scope > .${Gn}`, Xz = "input:not([type='hidden']), button, select, textarea, a[href]", Zz = /* @__PURE__ */ new WeakMap();
function Qz(e) {
	for (let t of e.querySelectorAll(Jz)) {
		let e = $z(t);
		e !== null && e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
	}
}
function $z(e) {
	let t = e.querySelector(Xz);
	if (t !== null) return t;
	if (e.hasAttribute("tabindex")) return e;
	let n = e.querySelector(Yz);
	return n !== null && n.getClientRects().length > 0 ? e : null;
}
function eB(e, t = null) {
	let n = tB(e), r = Zz.get(e), i = n.find((e) => t !== null && rB(e) === t) ?? (r !== void 0 && n.includes(r) ? r : n[0]);
	return i !== void 0 && (nB(e, i), !0);
}
function tB(e) {
	let t = ru(e), n = [];
	for (let r of e.querySelectorAll(Jz)) {
		let e = $z(r), i = Number(r.getAttribute("data-ui-table-column") ?? NaN);
		e !== null && Number.isInteger(i) && N(e) && n.push({
			stop: e,
			place: t.place(i)
		});
	}
	return n.sort((e, t) => e.place - t.place).map((e) => e.stop);
}
function nB(e, t) {
	t.hasAttribute("tabindex") || t.setAttribute("tabindex", "-1"), Zz.set(e, t), t.focus();
}
function rB(e) {
	return e.closest("[role='columnheader']")?.getAttribute("data-ui-table-column") ?? null;
}
function iB(e) {
	let t = e.closest("[role='columnheader']"), n = t?.parentElement?.parentElement?.parentElement ?? null;
	return t !== null && n instanceof HTMLElement && n.matches(qz) && $z(t) === e ? n : null;
}
function aB(e, t, n) {
	if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || !(e.target instanceof HTMLElement)) return !1;
	switch (e.key) {
		case "ArrowDown": return n(rB(e.target)), !0;
		case "ArrowUp": return !0;
	}
	if (!al(e.key, "horizontal")) return !1;
	let r = il({
		key: e.key,
		items: tB(t),
		current: e.target,
		axis: "horizontal",
		loop: !1
	});
	return r !== null && r !== e.target && nB(t, r), !0;
}
//#endregion
//#region src/interactions/items-selection-engine.ts
var oB = /* @__PURE__ */ new Set([
	" ",
	"Enter",
	"Delete"
]), sB = ".ui-table", cB = /* @__PURE__ */ new Set([
	"ArrowLeft",
	"ArrowRight",
	"ArrowUp",
	"ArrowDown",
	"Home",
	"End",
	"Enter",
	"F2",
	" "
]), lB = `:scope > [${b}], :scope > .${Un}, :scope > .${Un} > [${b}]`, uB = class {
	root;
	rows;
	pressedBoxes = [];
	windowEnds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.rows = e.rows, this.applyAll(this.root.querySelectorAll(P)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("mouseup", () => this.restoreBoxes(), !0), this.root.addEventListener("pointercancel", () => this.restoreBoxes(), !0), this.root.addEventListener("contextmenu", () => this.restoreBoxes(), !0), z(this.root, P, {
			childList: !0,
			attributeFilter: [
				Hr,
				Wr,
				Gr,
				Lt
			]
		}, (e) => this.applyAll(e)), this.root instanceof Node && new MutationObserver((e) => this.followCursor(e)).observe(this.root, {
			subtree: !0,
			attributes: !0,
			attributeFilter: [je]
		});
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = tu(e);
		Vl(e, t);
		for (let t of e.querySelectorAll(lB)) fB(t);
		if (!e.matches(".ui-items-view, .ui-table")) return;
		e.matches(sB) && Qz(e);
		for (let n of t) {
			let t = $c(n);
			t !== null && fB(t);
			for (let e of el(n)) fB(e);
			dB(e, n, n.hasAttribute(je));
		}
		let n = this.windowEnds.get(e);
		n !== void 0 && this.settleWindowEnd(e, t, n);
	}
	settleWindowEnd(e, t, n) {
		let r = Xl(e);
		if (r === null || r.hasAttribute("data-ui-window-pending")) return;
		let i = UC(r, Vt) !== null, a = n === "first" ? HC(r) === 0 && !WC(r, "data-ui-window-more-before") : !WC(r, Ut);
		if (i && !a) return;
		this.windowEnds.delete(e);
		let o = Uu(n === "first" ? "Home" : "End", t, null, bB(e));
		o !== null && (Su(e, t, o), e.getAttribute("data-ui-selection") === "one" && Ul(e, t, o, Nl));
	}
	handleClick(e) {
		let t = this.resolveRow(e, P);
		if (t === null || !(e instanceof MouseEvent)) return;
		let { root: n, item: r } = t, i = tu(n);
		if (Su(n, i, r, e.target instanceof Element ? Ru(r, e.target) : null), L(n), n.hasAttribute("data-ui-no-row-select")) {
			Il(n, r);
			return;
		}
		Ul(n, i, r, Ll(e), this.heldRange(n)) && e.preventDefault();
	}
	resolveRow(e, t) {
		if (!(e.target instanceof Element)) return null;
		let n = e.target.closest(jl), r = n?.closest(P) ?? null;
		return n === null || r === null || n.closest(P) !== r || !r.matches(t) || D(r) ? null : rl(e.target, n) === null && !O(n) ? {
			root: r,
			item: n
		} : null;
	}
	heldRange(e) {
		let t = this.rows, n = Xl(e);
		return t === void 0 || n === null ? void 0 : (e, r) => t.rangeKeysOf(n, e, r);
	}
	handleDoubleClick(e) {
		let t = this.resolveRow(e, Ml);
		t === null || e.target instanceof Element && t.item.contains(e.target.closest("[data-ui-no-row-open]")) || (e.preventDefault(), Ju(t.item, "open"));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.altKey || !(e.target instanceof Element) || Gc(e)) return;
		let t = iB(e.target);
		if (t !== null && !D(t)) {
			aB(e, t, (e) => this.enterRows(t, e)) && e.preventDefault();
			return;
		}
		let n = mu(e);
		if (n === null) return;
		let { root: r } = n;
		if (!r.matches(".ui-items-view, .ui-table") || D(r) || wu(r) && pB(e) && this.handleCellKey(r, e)) return;
		let i = bB(r);
		if (!oB.has(e.key) && !Vu(e.key, i)) return;
		if (this.windowEnds.delete(r), this.reachWindowEnd(r, e)) {
			e.preventDefault();
			return;
		}
		this.bringRowsIn(r, e.key);
		let a = tu(r), o = _u(a), s = Uu(e.key, a, vu(a), i);
		if (s !== null) {
			e.preventDefault(), Su(r, a, s, e.key === "ArrowUp" && !e.shiftKey && wu(r) ? Lu(s) : null), hB(r, a, o, s, Rl(r, e), this.heldRange(r));
			return;
		}
		if (e.key === "ArrowUp" && !e.shiftKey && !e.ctrlKey && !e.metaKey && r.matches(sB) && eB(r, Mu(r))) {
			e.preventDefault();
			return;
		}
		if (o === null || O(o)) return;
		let c = $c(o);
		switch (e.key) {
			case " ":
				gB(r, a, o, c);
				break;
			case "Enter":
				vB(r, a, o, c);
				break;
			case "Delete":
				if (!_B(r, a, o)) return;
				break;
			default: return;
		}
		e.preventDefault();
	}
	handleCellKey(e, t) {
		this.bringCursorRowIn(e);
		let n = tu(e), r = vu(n);
		if (r === null || O(r)) return !1;
		let i = ju(r), a = !t.ctrlKey && !t.metaKey && !t.shiftKey;
		switch (t.key) {
			case "ArrowLeft":
			case "ArrowRight":
			case "Home":
			case "End": {
				if (!a) return !1;
				let o = Nu(e, r, i, t.key);
				return o !== null && Su(e, n, r, o), t.preventDefault(), !0;
			}
			case "ArrowDown":
			case "ArrowUp": {
				let o = a ? Pu(e, r, i, t.key === "ArrowDown") : null;
				return o !== null && (t.preventDefault(), Su(e, n, r, o), !0);
			}
			default: return i !== null && mB(i, t);
		}
	}
	reachWindowEnd(e, t) {
		let n = t.key === "Home" || t.key === "End" ? Xl(e) : null;
		if (n === null || V(n) !== "windowed" || n.hasAttribute("data-ui-window-paged")) return !1;
		let r = t.key === "Home";
		return !(r ? HC(n) === 0 && !WC(n, "data-ui-window-more-before") : !WC(n, "data-ui-window-more-after")) && (this.windowEnds.set(e, r ? "first" : "last"), pl(n, r ? 0 : fl(n).contentHeight), !0);
	}
	bringRowsIn(e, t) {
		let n = this.rows, r = n === void 0 ? null : Xl(e);
		if (n === void 0 || r === null) return;
		let i = nd(e);
		switch (t) {
			case "Home":
			case "End": {
				let e = n.shownKeysOf(r);
				e !== null && e.length > 0 && n.reveal(r, t === "Home" ? e[0] : e[e.length - 1], "nearest");
				return;
			}
			case "PageDown":
			case "PageUp": {
				let a = i === null ? vu(tu(e)) : null, o = i ?? (a === null ? null : I(a));
				o !== null && n.reveal(r, o, t === "PageDown" ? "start" : "end");
				return;
			}
			default: this.bringCursorRowIn(e);
		}
	}
	bringCursorRowIn(e) {
		let t = this.rows === void 0 ? null : Xl(e), n = nd(e);
		t !== null && n !== null && this.rows?.reveal(t, n, "nearest");
	}
	enterRows(e, t) {
		let n = tu(e), r = vu(n) ?? Uu("ArrowDown", n, null, "vertical");
		e.focus({ preventScroll: !0 }), r !== null && (Su(e, n, r, Eu(r, t)), e.getAttribute("data-ui-selection") === "one" && Ul(e, n, r, Nl));
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement && e.target.matches("[data-ui-items-host], .ui-table__scroll") ? e.target : null, n = t?.closest(P) ?? null;
		if (t !== null && n !== null && [...n.querySelectorAll(lB)].includes(t)) {
			L(n);
			return;
		}
		if (e.target instanceof HTMLElement && e.target.matches(P) && e.target.matches(".ui-items-view, .ui-table") && !D(e.target) && !yd()) {
			bu(e.target, tu(e.target));
			return;
		}
		let r = e.target instanceof Element ? e.target.closest(jl) : null, i = r?.closest(P) ?? null;
		r === null || i === null || r.hasAttribute("data-ui-row-focus") || !i.matches(".ui-items-view, .ui-table") || rl(e.target, r) === null || Su(i, tu(i), r, e.target instanceof Element ? Ru(r, e.target) : null, !1);
	}
	handlePointerDown(e) {
		this.restoreBoxes();
		let t = e.target instanceof Element ? e.target : null, n = t?.closest(P) ?? null;
		if (t !== null && n !== null) {
			document.activeElement !== n && xd(n, !0);
			for (let e of n.querySelectorAll(lB)) e.contains(t) && e.getAttribute("tabindex") === "-1" && (e.removeAttribute("tabindex"), this.pressedBoxes.push(e));
		}
	}
	restoreBoxes() {
		for (let e of this.pressedBoxes) fB(e);
		this.pressedBoxes = [];
	}
	followCursor(e) {
		for (let t of e) {
			let e = t.target;
			if (!(e instanceof HTMLElement) || !e.matches(jl)) continue;
			let n = e.closest(P);
			n !== null && n.matches(".ui-items-view, .ui-table") && dB(n, e, e.hasAttribute(je));
		}
	}
};
function dB(e, t, n) {
	if (n) {
		for (let n of t.querySelectorAll(`[${Ne}]`)) n.parentElement?.closest(P) === e && sL(n);
		return;
	}
	for (let n of t.querySelectorAll(ad)) n.tabIndex >= 0 && n.parentElement?.closest(P) === e && nl(t, n) && oL(n);
}
function fB(e) {
	e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
}
function pB(e) {
	return cB.has(e.key) || ex(e) !== null;
}
function mB(e, t) {
	let n = t.key, r = ex(t) !== null, i = !t.ctrlKey && !t.metaKey && !t.altKey;
	if (!r && (!i || n !== "Enter" && n !== "F2" && n !== " ")) return !1;
	if (n !== " " && Bu(e, t)) return !0;
	let a = $c(e);
	if (a !== null && (n === "Enter" || n === " ")) return t.preventDefault(), a.click(), !0;
	if (n !== "F2" && (n !== "Enter" || !Iu(e))) return !1;
	let o = Dd(e);
	return o !== null && (t.preventDefault(), o.focus(), !0);
}
function hB(e, t, n, r, i, a) {
	e.getAttribute("data-ui-selection") !== "one" && !i.shift || (i.shift && Fl(e, n), Ul(e, t, r, i, a));
}
function gB(e, t, n, r) {
	Ul(e, t, n, {
		shift: !1,
		ctrl: !0
	}) || yB(n, r);
}
function _B(e, t, n) {
	if (!e.hasAttribute("data-ui-rows-remove")) return !1;
	let r = xB(t, n);
	for (let e of r) Ju(e, "remove");
	return r.length > 0;
}
function vB(e, t, n, r) {
	zl(e) && !Hl(t).includes(n) && Ul(e, t, n, Nl), yB(n, r), r === null && Ju(n, "open");
}
function yB(e, t) {
	t === null ? Ju(e, qu) : t.click();
}
function bB(e) {
	return e.matches(".ui-items-view--wrap") ? "grid" : e.matches(".ui-orientation--horizontal") ? "both" : "vertical";
}
function xB(e, t) {
	let n = Hl(e);
	return (n.includes(t) ? n : [t]).filter((e) => !gs(e, "data-ui-unremovable") && !O(e));
}
//#endregion
//#region src/interactions/tree-engine.ts
var SB = "ui-tree__row--folded", CB = "fold-hidden", wB = "fold-shown", TB = "ui-tree__row--dragging", EB = "ui-tree__loading", DB = "ui-tree__loading-ring", OB = "ui-tree-node__text", kB = "ui-tree-node__toggle", AB = "ui-tree-node__rename", jB = ".ui-text__title", MB = Yn, NB = "--ui-tree-depth", PB = "expanded", FB = 600, IB = .25, LB = {
	ArrowUp: "up",
	ArrowDown: "down",
	ArrowLeft: "out",
	ArrowRight: "in"
}, RB = /* @__PURE__ */ new Set([
	" ",
	"ArrowRight",
	"ArrowLeft",
	"Enter",
	"F2",
	"Delete"
]), zB = class {
	root;
	store = new bk();
	rules;
	folds = /* @__PURE__ */ new WeakMap();
	requested = /* @__PURE__ */ new WeakSet();
	writtenBoot = /* @__PURE__ */ new WeakMap();
	springTarget = null;
	springTimer = 0;
	dropPlace = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.rules = e.rules, this.root.addEventListener(Hz, (e) => {
			let t = e.target instanceof Element ? e.target.closest(`.${Kn}`) : null;
			t !== null && (this.layout(t), Zu(t, this.rowsOf(t)));
		}, !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), e.effects?.register("RenameNode", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename node effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(w(n.id), n.dynamicParameters ?? []), i = r === null ? null : this.rowsOf(r).find((e) => I(e) === t.key) ?? null;
			if (i === null) {
				s("rename node effect names no node on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.layoutAll(this.root.querySelectorAll(`.${Kn}`)), z(this.root, `.${Kn}`, {
			childList: !0,
			attributeFilter: [
				ir,
				ar,
				sr,
				fr
			],
			relevant: HB
		}, (e) => this.layoutAll(e));
	}
	layoutAll(e) {
		for (let t of e) this.layout(t);
	}
	layout(e) {
		let t = this.foldOf(e), n = this.resolveRules(e), r = n === null ? this.rowsOf(e) : this.orderRows(e, n), i = e.hasAttribute("data-ui-tree-draggable") || e.hasAttribute("data-ui-drag-kind"), a = /* @__PURE__ */ new Set();
		for (let e of r) {
			let t = bT(e)?.getAttribute(ir);
			t != null && t.length > 0 && a.add(t);
		}
		let o = n?.filtering === !0 ? this.matchingRows(r, n) : null, s = /* @__PURE__ */ new Map();
		for (let e of r) {
			let n = I(e), r = bT(e), c = r?.getAttribute("data-ui-tree-parent") ?? "", l = c.length > 0 ? s.get(c) : void 0, u = l === void 0 ? 0 : l.depth + 1, d = l === void 0 || l.shown && l.expanded, f = r?.hasAttribute(ar) === !0, p = f || a.has(n), m = p && r?.hasAttribute("data-ui-tree-expanded") === !0, h = l === void 0 || l.authoredShown && this.authoredExpandedOf(l), g = p && (o === null ? t[n] ?? m : o.has(n)), _ = o !== null && !o.has(n);
			e.style.setProperty(NB, String(u)), e.setAttribute("aria-level", String(u + 1)), xu(e, r?.querySelector(`:scope > .${OB}`) ?? null), e.classList.toggle(SB, !d), e.classList.toggle(Xn, _), e.removeAttribute(dr), e.draggable = i && XC(e), p ? e.setAttribute("aria-expanded", g ? "true" : "false") : e.removeAttribute("aria-expanded"), (a.has(n) || !f) && e.removeAttribute(lr), g && d && f && !a.has(n) && !this.requested.has(e) && (this.requested.add(e), e.setAttribute(lr, ""), e.dispatchEvent(new Event("unfold", { bubbles: !0 }))), g || this.requested.delete(e), this.placeLoadingRow(e, u + 1, e.hasAttribute(lr), d && g && !_), s.set(n, {
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
		return bT(e.row)?.hasAttribute(sr) === !0;
	}
	writeBootFold(e, t, n) {
		if (Object.keys(t).length === 0) return;
		let r = [], i = [];
		for (let [e, t] of n) t.shown !== t.authoredShown && (t.shown ? i : r).push(`.${qn}[${y}="${wi(e)}"]`);
		let a = `${r.join(",")}|${i.join(",")}`;
		this.writtenBoot.get(e) !== a && (this.writtenBoot.set(e, a), this.store.writeBoot(e, CB, r.length === 0 ? null : this.bootPatch(r, "hidden")), this.store.writeBoot(e, wB, i.length === 0 ? null : this.bootPatch(i, "shown")));
	}
	bootPatch(e, t) {
		return {
			selector: e.join(","),
			attributes: { [dr]: t }
		};
	}
	resolveRules(e) {
		let t = this.hostOf(e), n = ha(e);
		if (this.rules === void 0 || t === null || n === null) return null;
		let r = this.rules.metadata.getItemsFilterSortMetadata(n), i = ww(t);
		if (r === void 0 && i === null) return null;
		let a = Ow(r, this.rules.state, i), o = Dw(r, this.rules.state, i);
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
		let r = this.rules.renderer, i = new Set(n.map(I)), a = /* @__PURE__ */ new Map();
		for (let e of n) {
			let t = bT(e)?.getAttribute("data-ui-tree-parent") ?? "", n = i.has(t) ? t : "", r = a.get(n);
			r === void 0 ? a.set(n, [e]) : r.push(e);
		}
		let o = [], s = (e) => {
			let n = a.get(e);
			if (n !== void 0) {
				n.sort((e, n) => Aw(r.getItemValue(e), r.getItemValue(n), t.sorts));
				for (let e of n) o.push(e), s(I(e));
			}
		};
		if (s(""), o.length !== n.length || o.every((e, t) => e === n[t])) return o.length === n.length ? o : n;
		let c = this.hostOf(e);
		if (c === null) return n;
		for (let e of c.querySelectorAll(`:scope > .${EB}`)) e.remove();
		for (let e of o) c.appendChild(e);
		return o;
	}
	matchingRows(e, t) {
		let n = /* @__PURE__ */ new Set();
		if (this.rules === void 0) return n;
		let r = this.rules.state, i = this.rules.renderer;
		for (let a = e.length - 1; a >= 0; a--) {
			let o = e[a], s = I(o), c = i.getItemValue(o);
			if (c === void 0 || Ew(t.config, c, r, t.query) || n.has(s)) {
				n.add(s);
				let e = bT(o)?.getAttribute("data-ui-tree-parent") ?? "";
				e.length > 0 && n.add(e);
			}
		}
		return n;
	}
	placeLoadingRow(e, t, n, r) {
		let i = e.nextElementSibling, a = i instanceof HTMLElement && i.classList.contains(EB) ? i : null;
		if (!n) {
			a?.remove();
			return;
		}
		let o = a ?? UB();
		o.style.setProperty(NB, String(t)), o.classList.toggle(SB, !r), a === null && e.after(o);
	}
	handleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null) return;
		let { tree: n, row: r, target: i } = t;
		i.closest(`.${kB}`) === null && (!gs(r, "data-ui-unselectable") || rl(i, r) !== null) || (e.preventDefault(), this.setFocus(n, r, null), this.toggle(n, r));
	}
	handleDoubleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null || rl(t.target, t.row) !== null) return;
		let { tree: n, row: r } = t;
		e.preventDefault(), n.hasAttribute("data-ui-tree-rename-dblclick") && this.canRename(n, r) ? this.startRename(r) : Ju(r, "open");
	}
	rowOfEvent(e) {
		if (!(e.target instanceof Element)) return null;
		let t = e.target.closest(`.${qn}`), n = t?.closest(".ui-tree") ?? null;
		return t === null || n === null || t.closest(".ui-tree") !== n || O(t) ? null : {
			tree: n,
			row: t,
			target: e.target
		};
	}
	handleFocusIn(e) {
		let t = e.target;
		!(t instanceof HTMLElement) || !t.classList.contains("ui-tree") || D(t) || yd() || bu(t, this.rowsOf(t));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || A(e) || !(e.target instanceof Element)) return;
		let t = mu(e);
		if (t === null) return;
		let n = t.root;
		if (!n.classList.contains("ui-tree") || D(n)) return;
		let r = e.altKey && j(e, { alt: !0 }) ? LB[e.key] : void 0;
		if (r !== void 0 && n.hasAttribute("data-ui-tree-draggable")) {
			e.preventDefault(), this.moveByKey(n, r);
			return;
		}
		if (!RB.has(e.key) && !Vu(e.key, "vertical")) return;
		let i = this.rowsOf(n), a = _u(i), o = Uu(e.key, i, vu(i), "vertical");
		if (o !== null) {
			e.preventDefault(), this.setFocus(n, o, Rl(n, e));
			return;
		}
		if (!(a === null || O(a))) {
			switch (e.key) {
				case " ":
					gB(n, i, a, null);
					break;
				case "ArrowRight":
					a.getAttribute("aria-expanded") === "false" ? this.toggle(n, a) : a.getAttribute("aria-expanded") === "true" && this.setFocus(n, Uu("ArrowDown", i, a, "vertical"), Nl);
					break;
				case "ArrowLeft":
					a.getAttribute("aria-expanded") === "true" ? this.toggle(n, a) : this.setFocus(n, this.parentOf(n, a), Nl);
					break;
				case "Enter":
					vB(n, i, a, null);
					break;
				case "F2":
					if (!this.canRename(n, a)) return;
					this.startRename(a);
					break;
				case "Delete":
					if (n.hasAttribute("data-ui-tree-unremovable") || !_B(n, i, a)) return;
					break;
				default: return;
			}
			e.preventDefault();
		}
	}
	moveByKey(e, t) {
		let n = this.rowsOf(e), r = _u(n);
		if (r === null || !r.draggable || (t === "up" || t === "down") && this.isSorted(e)) return;
		let i = ET(GB(n), I(r), t);
		i !== null && this.moveRows(e, [r], i, t === "in" ? n.find((e) => I(e) === i.parent) ?? null : null);
	}
	isSorted(e) {
		return (this.resolveRules(e)?.sorts.length ?? 0) > 0;
	}
	canRename(e, t) {
		return e.hasAttribute("data-ui-tree-renamable") && !gs(t, "data-ui-unrenamable");
	}
	handleDragStart(e) {
		let t = WB(e), n = t?.closest(".ui-tree") ?? null, r = n?.hasAttribute(fr) === !0, i = n === null ? null : this.hostOf(n);
		if (t === null || n === null || i === null || !r && !n.hasAttribute("data-ui-drag-kind")) return;
		if (O(t)) {
			e.preventDefault();
			return;
		}
		let a = YC(t, this.rowsOf(n)), o = JC(n, i, a);
		r ? Og(e, n, t, TB, I(t), a.filter((e) => e !== t), QC(o, !0)) : Ag(e, I(t), QC(o, !1)), $C(e, o);
	}
	draggingRows(e) {
		return this.rowsOf(e).filter((e) => e.classList.contains(TB));
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Kn}`), n = t === null ? [] : this.draggingRows(t), r = t === null ? null : this.hostOf(t);
		if (t === null || n.length === 0 || r === null) return;
		let i = e.target.closest(`.${qn}`), a = i !== null && i.closest(".ui-tree") === t ? i : null, o = a === null ? {
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
		let i = this.parentKeysOf(e), a = I(t), o = (e) => n.some((t) => I(t) === e || VB(i, e, I(t))), s = xT(t, bT(t)), c = t.getBoundingClientRect(), l = c.height > 0 ? (r - c.top) / c.height : .5, u = s ? IB : .5, d = this.isSorted(e) ? null : l < u ? "before" : l >= 1 - u ? "after" : null;
		if (d === null) return s && !o(a) ? {
			mark: "",
			place: {
				parent: a,
				before: null
			}
		} : null;
		if (n.includes(t)) return null;
		let f = this.rowsOf(e), p = GB(f), m = Number(t.style.getPropertyValue(NB)) || 0, h = new Set(n.map(I)), g = d === "after" && t.getAttribute("aria-expanded") === "true" ? p.find((e) => e.parent === a && e.shown !== !1 && !h.has(e.key)) : void 0, _ = i.get(a) ?? "", v = g === void 0 ? {
			parent: _,
			before: d === "before" ? a : AT(p, _, a, !1, h)
		} : {
			parent: a,
			before: g.key
		};
		return !ST(v.parent, (e) => f.find((t) => I(t) === e) ?? null) || o(v.parent) ? null : {
			mark: d,
			place: v,
			depth: g === void 0 ? m : m + 1
		};
	}
	springOpen(e, t) {
		let n = t !== null && t.getAttribute("aria-expanded") === "false" ? t : null;
		n !== this.springTarget && (window.clearTimeout(this.springTimer), this.springTarget = n, n !== null && (this.springTimer = window.setTimeout(() => this.expand(e, n), FB)));
	}
	handleDragLeave(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Kn}`);
		t !== null && jg(e, t) && (this.markDrop(t, null), this.springOpen(t, null));
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Kn}`), n = t === null ? [] : this.draggingRows(t), r = t?.querySelector(`[${MB}]`) ?? null, i = this.dropPlace;
		if (t === null || n.length === 0 || r === null || i === null) return;
		e.preventDefault();
		let a = this.parentKeysOf(t), o = n.filter((e) => !n.some((t) => t !== e && VB(a, I(e), I(t)))), s = r.getAttribute(MB) === "" && r.classList.contains("ui-tree__row") ? r : null;
		this.markDrop(t, null), this.springOpen(t, null), kg(t, TB), this.moveRows(t, o, i, s);
	}
	moveRows(e, t, n, r) {
		let i = jT(GB(this.rowsOf(e)), t.map(I), n);
		r !== null && this.expand(e, r), t.forEach((e, t) => {
			let r = bT(e)?.querySelector(`.${OB}`) ?? null;
			r !== null && (r.setAttribute(ur, n.parent), r.dispatchEvent(new Event("change", { bubbles: !0 })), eT(e, i[t]));
		});
	}
	handleDragEnd(e) {
		let t = WB(e)?.closest(".ui-tree") ?? null;
		t !== null && (kg(t, TB), this.markDrop(t, null), this.springOpen(t, null));
	}
	markDrop(e, t, n = "", r) {
		wT(e, t, n, r), t === null && (this.dropPlace = null);
	}
	parentKeysOf(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of this.rowsOf(e)) t.set(I(n), bT(n)?.getAttribute("data-ui-tree-parent") ?? "");
		return t;
	}
	toggle(e, t) {
		this.fold(e, t, t.getAttribute("aria-expanded") !== "true");
	}
	expand(e, t) {
		t.getAttribute("aria-expanded") === "false" && this.fold(e, t, !0);
	}
	fold(e, t, n) {
		let r = I(t);
		if (r.length === 0 || !t.hasAttribute("aria-expanded")) return;
		let i = this.foldOf(e);
		i[r] = n;
		let a = n ? this.rowsOf(e).filter((e) => e.classList.contains(SB)) : [];
		this.store.writeJson(e, PB, i), this.layout(e), BB(a.filter((e) => !e.classList.contains(SB)));
	}
	foldOf(e) {
		let t = this.folds.get(e);
		return t === void 0 && (t = this.store.readJson(e, PB) ?? {}, this.folds.set(e, t)), t;
	}
	setFocus(e, t, n) {
		if (t === null) return;
		let r = this.rowsOf(e), i = _u(r);
		Su(e, r, t), n !== null && hB(e, r, i, t, n);
	}
	parentOf(e, t) {
		let n = bT(t)?.getAttribute("data-ui-tree-parent") ?? "";
		return n.length === 0 ? null : this.rowsOf(e).find((e) => I(e) === n) ?? null;
	}
	startRename(e) {
		let t = e.closest(`.${Kn}`), n = bT(e), r = n?.querySelector(jB) ?? null;
		t === null || n === null || r === null || gs(e, "data-ui-unrenamable") || (this.setFocus(t, e, null), Ec({
			container: n,
			title: r,
			className: AB,
			value: n.getAttribute("data-ui-tree-title") ?? r.textContent?.trim() ?? "",
			commit: (t) => {
				n.setAttribute(cr, t), n.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
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
function BB(e) {
	if (!(e.length === 0 || qf())) for (let t of e) t.animate([{
		opacity: 0,
		offset: 0
	}], {
		duration: R.fast,
		easing: R.enter
	});
}
function VB(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let i = e.get(t) ?? ""; i.length > 0 && !r.has(i); i = e.get(i) ?? "") {
		if (i === n) return !0;
		r.add(i);
	}
	return !1;
}
function HB(e) {
	if (e.type !== "childList") return !0;
	let t = e.target;
	return t instanceof HTMLElement && (t.classList.contains("ui-tree__row") || t.hasAttribute("data-ui-items-host") && t.parentElement?.classList.contains("ui-tree") === !0);
}
function UB() {
	let e = document.createElement("div"), t = document.createElement("span");
	return e.className = EB, e.setAttribute("aria-hidden", "true"), t.className = DB, e.append(t, E.text("ui.tree.loading")), e;
}
function WB(e) {
	return e.target instanceof Element ? e.target.closest(`.${qn}`) : null;
}
function GB(e) {
	return e.map((e) => ({
		key: I(e),
		parent: bT(e)?.getAttribute("data-ui-tree-parent") ?? "",
		takesDrop: xT(e, bT(e)),
		shown: !e.classList.contains(Xn)
	}));
}
//#endregion
//#region src/runtime/client-state.ts
var KB = {
	visibilityState: () => document.visibilityState,
	notificationPermission: JB
};
function qB(e) {
	return e !== "hidden";
}
function JB() {
	return typeof Notification > "u" || !window.isSecureContext ? void 0 : Notification.permission;
}
var YB = 200;
function XB(e = KB) {
	return {
		visible: qB(e.visibilityState()),
		notificationPermission: e.notificationPermission() ?? "unsupported"
	};
}
var ZB = class {
	report;
	source;
	settleMilliseconds;
	held = null;
	timer;
	constructor(e) {
		this.report = e.report, this.source = e.source ?? KB, this.settleMilliseconds = e.settleMilliseconds ?? YB;
	}
	forAttach() {
		return clearTimeout(this.timer), this.held = XB(this.source), this.held;
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
		let t = XB(this.source);
		(t.visible !== e.visible || t.notificationPermission !== e.notificationPermission) && (this.held = t, this.report(t).catch(() => void 0));
	}
};
//#endregion
//#region src/interactions/system-notifications.ts
function QB(e) {
	return {
		permission: JB,
		registration: e ?? (() => Promise.resolve(void 0)),
		create: (e, t) => new Notification(e, t),
		focus: () => window.focus()
	};
}
async function $B(e, t, n = QB()) {
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
function eV(e, t, n, r = window.location) {
	if (e.bringTo !== void 0 && tV(e.bringTo, r)) {
		t(e.bringTo);
		return;
	}
	e.action !== void 0 && n(e.action);
}
function tV(e, t = window.location) {
	let n = new URL(e, t.origin);
	return n.pathname !== t.pathname || n.search !== t.search || n.hash !== "" && n.hash !== t.hash;
}
//#endregion
//#region src/interactions/tab-order.ts
function nV(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) e[n].pinned && (t = n + 1);
	return t;
}
//#endregion
//#region src/interactions/tabs-view-engine.ts
var K = "ui-tabs-view", rV = "ui-tab-item__label", iV = "ui-tab-item__close", aV = "ui-tab-item__rename", oV = "ui-tab-item__caption", sV = "ui-tab-item__pin", cV = ".ui-text__title", lV = "ui-tab-item--dragging", uV = "ui-tab-item__caption--overflowed", dV = "ui-tabs-view--overflowing", fV = "ui-tabs-view--no-overflow", pV = "ui-tab-item__page", mV = "ui-tab-item--selected", hV = `.${x}`, gV = "tab-menu-entry", _V = {
	name: gV,
	registration: { dynamicParameters: (e) => e.domEvent.detail?.keys ?? null }
}, vV = "tab-pin";
function yV(e) {
	return {
		name: vV,
		registration: VC((e) => Kw(e.target), e)
	};
}
var bV = "--ui-tabs-view-strip", xV = class {
	root;
	fitter;
	dragStart = null;
	menuTab = null;
	closed = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new zI({
			rootClass: K,
			overflowingClass: dV,
			wraps: (e) => e.classList.contains(fV),
			hiddenClass: uV,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(), e.effects?.register("RenameTab", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename tab effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(w(n.id), n.dynamicParameters ?? []), i = (r === null ? void 0 : this.ownItems(r).find((e) => MV(e) === t.key))?.querySelector(`.${rV}`) ?? null;
			if (i === null) {
				s("rename tab effect names no tab on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.root.addEventListener(gA, (e) => this.prepareMenu(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), RR(this.root, ["press"], (e) => {
			let t = e.closest(`.${iV}`)?.closest(`.${oV}`) ?? null;
			return t === null ? [] : [t];
		}), z(this.root, `.${K}`, {
			childList: !0,
			attributeFilter: [
				qr,
				be,
				ce,
				...Xr
			],
			relevant: (e) => !sm(e, `.${pV}`, `.${K}`)
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${K}`)) this.apply(e);
	}
	apply(e) {
		let t = this.ownItems(e);
		CV(e, t);
		let n = t.filter(LA), r = e.getAttribute("data-ui-tabs-selected") ?? "", i = kl(n, r, MV);
		if (i === null) return;
		if (i !== r) {
			this.select(e, i);
			return;
		}
		let a = e.hasAttribute(be), o = t.find((e) => e.classList.contains(mV))?.querySelector(`.${oV}`) ?? null, s = [], c = null, l = null;
		for (let e of t) {
			let t = MV(e) === r;
			e.classList.toggle(mV, t);
			let i = e.querySelector(`.${oV}`);
			i !== null && (i.draggable = a, KI(i), n.includes(e) && (s.push(i), t && (c = i))), e.querySelector(`.${rV}`)?.setAttribute("aria-selected", t ? "true" : "false");
			for (let n of e.querySelectorAll(`.${pV}`)) n.hidden = !t;
			t && (l = e.querySelector(`.${pV}`));
		}
		this.fitCaptions(e, s, c), this.writeStripHeight(e, l), qI(o, c), o !== null && o !== c && JI(l);
		let u = [], d = null;
		for (let e of s) {
			let t = e.querySelector(`.${rV}`);
			t === null || e.classList.contains(uV) || (u.push(t), e === c && (d = t));
		}
		M(u, d), this.focusAfterClose(e, d);
	}
	focusAfterClose(e, t) {
		let n = this.closed;
		n === null || n.root !== e || n.item.isConnected || (this.closed = null, t !== null && (document.activeElement === null || document.activeElement === document.body) && L(t));
	}
	writeStripHeight(e, t) {
		let n = this.hostOf(e);
		if (n === null || t === null || !LA(t)) return;
		let r = Math.max(0, Math.round(t.getBoundingClientRect().top - n.getBoundingClientRect().top));
		n.style.setProperty(bV, `${r}px`);
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${b}]`);
	}
	fitCaptions(e, t, n) {
		let r = this.hostOf(e), i = e.querySelector(`:scope > .${PI}`);
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownItems(e).find((e) => MV(e) === t)?.querySelector(`.${rV}`)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownItems(e).filter(LA).map((e) => ({
				key: MV(e),
				title: e.querySelector(`.${rV}`)?.textContent?.trim() ?? MV(e),
				current: MV(e) === t,
				disabled: D(e.querySelector(`.${rV}`) ?? e)
			}));
		});
	}
	prepareMenu(e) {
		let t = e.target;
		if (!(e instanceof CustomEvent) || !(t instanceof HTMLElement) || t.getAttribute("data-ui-context-menu") !== "tab") return;
		let n = t.parentElement, r = e.detail.target.closest(`.${Ww}`);
		if (n === null || !n.classList.contains(K) || r === null || r.closest(`.${K}`) !== n) {
			e.preventDefault();
			return;
		}
		let i = EV(n, r), a = OV(t), o = a.map((e) => {
			if (DV(e)) return "rule";
			let t = i.get(e.getAttribute("data-ui-key") ?? "");
			return t !== void 0 && (e.style.display = t ? "" : "none"), t ?? LA(e) ? "shown" : "hidden";
		});
		if (dA(o).forEach((e, t) => {
			o[t] === "rule" && (a[t].style.display = e ? "" : "none");
		}), !o.includes("shown")) {
			e.preventDefault();
			return;
		}
		this.menuTab = {
			root: n,
			key: MV(r)
		};
	}
	handleMenuEntry(e) {
		let t = e.closest(`[${Se}="tab"]`), n = t?.parentElement ?? null, r = e.closest(hV);
		if (t === null || n === null || !n.classList.contains(K) || r === null || !t.contains(r)) return !1;
		let i = r.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "", a = this.menuTab, o = a === null || a.root !== n ? void 0 : this.ownItems(n).find((e) => MV(e) === a.key);
		if (i.length === 0 || r.matches(`${En}, ${Tn}`) || o === void 0) return !0;
		if (!i.startsWith("tabs:")) return n.dispatchEvent(new CustomEvent(gV, {
			bubbles: !0,
			detail: { keys: [i, MV(o)] }
		})), !0;
		if (EV(n, o).get(i) !== !0) return !0;
		switch (i) {
			case iA: {
				let e = o.querySelector(`.${rV}`);
				e !== null && this.startRename(e);
				break;
			}
			case aA:
			case oA:
				this.setPinned(n, o, i === aA);
				break;
			default: o.dispatchEvent(new Event("remove", { bubbles: !0 }));
		}
		return !0;
	}
	setPinned(e, t, n) {
		if (t.hasAttribute("data-ui-tab-pinned") === n) return;
		let r = t.querySelector(`:scope > .${oV} > .${sV}`);
		t.toggleAttribute(Yr, n), r !== null && (r.toggleAttribute(Yr, n), r.dispatchEvent(new Event("change", { bubbles: !0 })));
		let i = this.ownItems(e), a = i.filter((e) => e !== t), o = nV(a.map(jV));
		if (i.indexOf(t) === o) return;
		let s = a[o];
		s === void 0 ? Gw(a[a.length - 1]).after(Gw(t)) : Gw(s).before(Gw(t)), t.dispatchEvent(new Event(vV, { bubbles: !0 }));
	}
	handleClick(e) {
		if (!(e.target instanceof Element) || this.handleMenuEntry(e.target) || this.handleClose(e, e.target)) return;
		let t = e.target.closest(`.${PI}`), n = t?.parentElement ?? null;
		if (t !== null && n !== null && n.classList.contains(K)) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = kV(e.target), i = r?.closest(`.${K}`) ?? null;
		if (r === null || i === null || D(r)) return;
		let a = r.closest(`.${Ww}`);
		a !== null && a.closest(`.${K}`) === i && (e.preventDefault(), this.select(i, MV(a)), document.activeElement !== r && L(r));
	}
	handleClose(e, t) {
		let n = t.closest(`.${iV}`), r = n?.closest(".ui-tab-item") ?? null, i = r?.closest(`.${K}`) ?? null;
		return n === null || r === null || i === null ? !1 : (e.preventDefault(), e.stopPropagation(), wV(i, r) && r.dispatchEvent(new Event("remove", { bubbles: !0 })), !0);
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = kV(e.target), n = t?.closest(`.${K}`) ?? null;
		t === null || n === null || !n.hasAttribute("data-ui-tabs-renamable") || (e.preventDefault(), this.startRename(t));
	}
	startRename(e) {
		let t = e.parentElement, n = e.querySelector(cV) ?? e, r = e.closest(`.${Ww}`);
		t === null || r === null || qw(r, "data-ui-unrenamable") || Ec({
			container: t,
			title: n,
			className: aV,
			value: e.getAttribute("data-ui-tab-caption") ?? n.textContent?.trim() ?? "",
			commit: (t) => {
				e.setAttribute(Jr, t), e.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			refocus: () => L(e)
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || Gc(e)) return;
		let t = e.target.closest(`.${rV}`), n = t?.closest(`.${K}`) ?? null;
		if (t === null || n === null) return;
		if (e.key === "F2") {
			if (!n.hasAttribute("data-ui-tabs-renamable")) return;
			e.preventDefault(), this.startRename(t);
			return;
		}
		let r = t.closest(`.${Ww}`);
		if (r === null || r.closest(`.${K}`) !== n) return;
		if (e.key === "Delete" && j(e)) {
			if (!TV(n, r)) return;
			e.preventDefault(), this.closed = {
				root: n,
				item: r
			}, r.dispatchEvent(new Event("remove", { bubbles: !0 }));
			return;
		}
		if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && e.altKey && j(e, { alt: !0 })) {
			this.moveByKey(n, r, e);
			return;
		}
		if (!j(e)) return;
		let i = this.ownItems(n).map((e) => e.querySelector(`.${rV}`)).filter((e) => e !== null), a = il({
			key: e.key,
			items: i,
			current: t,
			axis: "horizontal"
		});
		if (a === null) return;
		e.preventDefault();
		let o = a.closest(`.${Ww}`);
		o !== null && this.select(n, MV(o)), a.focus();
	}
	moveByKey(e, t, n) {
		if (!e.hasAttribute("data-ui-tabs-draggable") || qw(t, "data-ui-undraggable") || D(t) || t.hasAttribute("data-ui-tab-pinned")) return;
		n.preventDefault();
		let r = this.ownItems(e), i = r[r.indexOf(t) + (n.key === "ArrowLeft" ? -1 : 1)];
		i === void 0 || i.hasAttribute("data-ui-tab-pinned") || (n.key === "ArrowLeft" ? Gw(t).after(Gw(i)) : Gw(t).before(Gw(i)), eT(t, this.ownItems(e).indexOf(t)));
	}
	handleDragStart(e) {
		let t = AV(e);
		if (t === null) return;
		if (qw(t, "data-ui-undraggable") || D(t) || t.hasAttribute("data-ui-tab-pinned")) {
			e.preventDefault();
			return;
		}
		Og(e, t.closest(`.${K}`) ?? t, t, lV, MV(t));
		let n = Gw(t);
		this.dragStart = n.parentNode === null ? null : {
			parent: n.parentNode,
			next: n.nextSibling
		};
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${oV}`)?.closest(".ui-tab-item") ?? null, n = t?.closest(`.${K}`) ?? null;
		if (t === null || n === null) return;
		let r = n.querySelector(`.${lV}`);
		if (r === null || (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), r === t)) return;
		let i = t.querySelector(`.${oV}`)?.getBoundingClientRect();
		if (i === void 0) return;
		let a = Gw(r), o = t.hasAttribute("data-ui-tab-pinned") ? SV(n, a) : null, s = o ?? Gw(t), c = o === null && e.clientX < i.left + i.width / 2 ? s : s.nextElementSibling;
		c !== a && s.parentElement?.insertBefore(a, c);
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${K}`);
		t !== null && t.querySelector(`.${lV}`) !== null && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"));
	}
	handleDragEnd(e) {
		let t = AV(e);
		if (t === null) return;
		t.classList.remove(lV);
		let n = this.dragStart;
		if (this.dragStart = null, e instanceof DragEvent && e.dataTransfer?.dropEffect === "none" && n !== null) {
			n.parent.insertBefore(Gw(t), n.next);
			return;
		}
		let r = Gw(t);
		if (n !== null && r.parentNode === n.parent && r.nextSibling === n.next) return;
		let i = t.closest(`.${K}`);
		i !== null && eT(t, this.ownItems(i).indexOf(t));
	}
	select(e, t) {
		Ol(e, t, {
			attribute: qr,
			bindingAttribute: Kr,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return El(e, `.${Ww}`, `.${K}`);
	}
};
function SV(e, t) {
	let n = null;
	for (let r of El(e, `.${Ww}`, `.${K}`)) {
		let e = Gw(r);
		e !== t && r.hasAttribute("data-ui-tab-pinned") && (n = e);
	}
	return n;
}
function CV(e, t) {
	let n = !t.some((e) => !qw(e, ce));
	e.hasAttribute("data-ui-tabs-none-removable") !== n && e.toggleAttribute(ye, n);
}
function wV(e, t) {
	return !e.hasAttribute("data-ui-tabs-unremovable") && !qw(t, "data-ui-unremovable");
}
function TV(e, t) {
	return e.hasAttribute("data-ui-tabs-removes") && wV(e, t) && !t.hasAttribute("data-ui-tab-pinned") && !D(t);
}
function EV(e, t) {
	return uA(lA(e.getAttribute(xe)), {
		pinned: t.hasAttribute(Yr),
		renamable: !qw(t, le),
		removable: e.hasAttribute("data-ui-tabs-removes") && wV(e, t)
	});
}
function DV(e) {
	let t = e.getAttribute(y);
	return t === "tabs:separator" || t === "tabs:separator-remove" || e.querySelector(":scope > [data-ui-menu-item-kind=\"separator\"]") !== null;
}
function OV(e) {
	let t = e.querySelector(`[${b}]`);
	return t === null ? [] : Array.from(t.children).filter((e) => e instanceof HTMLElement && e.hasAttribute("data-ui-key"));
}
function kV(e) {
	return e.closest(`.${iV}`) !== null || Tc(e) ? null : e.closest(`.${oV}`)?.querySelector(`:scope > .${rV}`) ?? null;
}
function AV(e) {
	return e.target instanceof Element ? e.target.closest(`.${oV}`)?.closest(".ui-tab-item") ?? null : null;
}
function jV(e) {
	return { pinned: e.hasAttribute(Yr) };
}
function MV(e) {
	return e.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "";
}
//#endregion
//#region src/interactions/text-fold-engine.ts
var NV = "button.ui-text__fold-toggle", PV = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(NV);
		t !== null && (e.preventDefault(), t.setAttribute("aria-expanded", t.getAttribute("aria-expanded") === "true" ? "false" : "true"));
	}
}, FV = "ui-temporal-input__segments", IV = "ui-temporal-input__segment", LV = "ui-temporal-input__segment-literal", RV = "ui-temporal-input__segment--empty", zV = "data-ui-temporal-segment", BV = "data-ui-temporal-step-direction", VV = "data-ui-temporal-segments-of", HV = "--", UV = class {
	options;
	root;
	edits = /* @__PURE__ */ new WeakMap();
	wheelTurn = 0;
	onWheel = (e) => this.handleWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${U}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(pa(e.components, `.${U}`));
		}), z(this.root, `.${U}`, { attributeFilter: [...SE] }, (e) => this.applyAll(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("mousedown", (e) => this.handleStepperPress(e), !0);
	}
	applyAll(e) {
		for (let t of e) wE(t) === "time" && this.applySegments(t);
	}
	applySegments(e) {
		for (let t of e.querySelectorAll(`.${FV}`)) this.applyContainer(e, t);
	}
	applyContainer(e, t) {
		let n = TE(e), r = AE(e), i = W(e, RE(t));
		t.getAttribute(VV) !== n && (t.replaceChildren(...WV(n).map((e) => KV(e))), t.setAttribute(VV, n));
		for (let n of t.children) {
			if (!(n instanceof HTMLElement)) continue;
			let t = n.getAttribute(zV);
			if (t === null) {
				n.textContent = JV(n.dataset.token ?? "", n.dataset.formatted !== void 0, i, r);
				continue;
			}
			n.textContent = YV(t, Number(n.dataset.width ?? "2"), i, r), n.classList.toggle(RV, i === null), n.tabIndex = 0, XV(n, t, i, k(e));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !j(e, { shift: !0 })) return;
		let t = QV(e.target);
		if (t === null) return;
		let n = t.closest(`.${U}`), r = t.getAttribute(zV), i = ZV(t);
		if (e.key === "ArrowUp" || e.key === "ArrowDown") {
			e.preventDefault(), this.resetBuffer(n), this.applyStep(n, r, e.key === "ArrowUp" ? 1 : -1, i);
			return;
		}
		if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
			e.preventDefault(), this.resetBuffer(n), eH(n, t, e.key);
			return;
		}
		if (e.key === "Backspace" || e.key === "Delete") {
			e.preventDefault(), this.resetBuffer(n), WE(n, null, i), this.applySegments(n);
			return;
		}
		if (r === "meridiem") {
			let t = tH(e.key, AE(n));
			t !== null && (e.preventDefault(), this.applyMeridiem(n, t, i));
			return;
		}
		e.key.length === 1 && e.key >= "0" && e.key <= "9" && (e.preventDefault(), this.applyDigit(n, t, r, e.key, i));
	}
	handleFocusIn(e) {
		let t = QV(e.target);
		t !== null && (this.wheelTurn = 0, t.addEventListener("wheel", this.onWheel, { passive: !1 }));
	}
	handleWheel(e) {
		let t = QV(e.currentTarget);
		if (t === null || t !== document.activeElement || e.deltaY === 0) return;
		e.preventDefault();
		let { steps: n, carried: r } = iv(this.wheelTurn, rv(e).y);
		if (this.wheelTurn = r, n === 0) return;
		let i = t.closest(`.${U}`);
		this.resetBuffer(i);
		for (let e = 0; e < Math.abs(n); e++) this.applyStep(i, t.getAttribute(zV), n < 0 ? 1 : -1, ZV(t));
	}
	handleStepperPress(e) {
		e.target instanceof Element && e.target.closest(`[${BV}]`) !== null && e.preventDefault();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${BV}]`);
		if (t === null) return;
		let n = t.closest(`.${U}`);
		if (n === null || k(n)) return;
		e.preventDefault();
		let r = $V(n) ?? n.querySelector(`.${IV}`);
		r !== null && (r.focus(), this.resetBuffer(n), this.applyStep(n, r.getAttribute(zV), t.getAttribute(BV) === "up" ? 1 : -1, ZV(r)));
	}
	handleFocusOut(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${IV}`) : null;
		if (t === null) return;
		t.removeEventListener("wheel", this.onWheel);
		let n = t.closest(`.${U}`);
		n !== null && this.resetBuffer(n);
	}
	applyStep(e, t, n, r) {
		if (t === "meridiem") {
			let t = W(e, r), n = t !== null && t.getHours() >= 12 ? "am" : "pm";
			this.write(e, YE(e, rH(this.baseValue(e, r), n)), r);
			return;
		}
		let i = this.baseValue(e, r), a = nH(t), o = DE(EE(e), a) * n, s = a === "hour" ? 24 : 60, c = ((OE(i, a) + o) % s + s) % s;
		this.write(e, YE(e, kE(i, a, c)), r);
	}
	applyDigit(e, t, n, r, i) {
		let a = this.editState(e), o = n === "hour" ? 23 : n === "hour12" ? 12 : 59, s = +(n === "hour12"), c = (a.unit === n ? a.buffer : "") + r;
		Number(c) > o && (c = r);
		let l = Number(c), u = c.length >= 2 || l * 10 > o;
		if (a.unit = n, a.buffer = u ? "" : c, l >= s) {
			let t = this.baseValue(e, i);
			this.write(e, n === "hour12" ? kE(t, "hour", iH(l, t.getHours() >= 12)) : kE(t, nH(n), l), i);
		}
		u && eH(e, t, "ArrowRight");
	}
	applyMeridiem(e, t, n) {
		this.write(e, rH(this.baseValue(e, n), t), n);
	}
	baseValue(e, t) {
		return W(e, t) ?? JE(e);
	}
	write(e, t, n) {
		WE(e, t, n), KE(e), this.applySegments(e);
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
function WV(e) {
	let t = [];
	for (let n = 0; n < e.length;) {
		let r = Ra(e, n);
		if (r === null) {
			t.push({
				kind: "literal",
				token: e[n],
				formatted: !1
			}), n++;
			continue;
		}
		t.push(GV(r)), n += r.length;
	}
	return t;
}
function GV(e) {
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
function KV(e) {
	if (e.kind === "literal") {
		let t = document.createElement("span");
		return t.className = LV, t.dataset.token = e.token, e.formatted && (t.dataset.formatted = ""), t;
	}
	let t = document.createElement("span");
	return t.className = IV, t.tabIndex = 0, t.setAttribute("role", "spinbutton"), t.setAttribute(zV, e.unit), t.dataset.width = String(e.width), qV(t, e.unit), t;
}
function qV(e, t) {
	if (t === "meridiem") {
		E.write(e, "aria-label", "ui.picker.meridiem");
		return;
	}
	let n = nH(t);
	E.write(e, "aria-label", n === "hour" ? "ui.picker.hours" : n === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"), e.setAttribute("aria-valuemin", t === "hour12" ? "1" : "0"), e.setAttribute("aria-valuemax", t === "hour12" ? "12" : t === "hour" ? "23" : "59");
}
function JV(e, t, n, r) {
	return t && n !== null ? Na(n, e, r) : e;
}
function YV(e, t, n, r) {
	if (n === null) return HV;
	if (e === "meridiem") return n.getHours() < 12 ? r.amDesignator : r.pmDesignator;
	let i = e === "hour12" ? ao(n.getHours()) : OE(n, nH(e));
	return String(i).padStart(t, "0");
}
function XV(e, t, n, r) {
	if (r !== e.hasAttribute("aria-readonly") && (r ? e.setAttribute("aria-readonly", "true") : e.removeAttribute("aria-readonly")), t === "meridiem" || n === null) {
		e.removeAttribute("aria-valuenow");
		return;
	}
	e.setAttribute("aria-valuenow", String(t === "hour12" ? ao(n.getHours()) : OE(n, nH(t))));
}
function ZV(e) {
	return RE(e.closest(`.${FV}`));
}
function QV(e) {
	let t = e instanceof Element ? e.closest(`.${IV}`) : null;
	if (t === null) return null;
	let n = t.closest(`.${U}`);
	return n === null || k(n) ? null : t;
}
function $V(e) {
	return document.activeElement instanceof HTMLElement && document.activeElement.closest(".ui-temporal-input") === e ? document.activeElement.closest(`.${IV}`) : null;
}
function eH(e, t, n) {
	il({
		key: n,
		items: [...e.querySelectorAll(`.${IV}`)],
		current: t,
		axis: "horizontal",
		loop: !1
	})?.focus();
}
function tH(e, t) {
	let n = e.toLowerCase();
	return n.length === 1 ? n === "a" || n === t.amDesignator.charAt(0).toLowerCase() ? "am" : n === "p" || n === t.pmDesignator.charAt(0).toLowerCase() ? "pm" : null : null;
}
function nH(e) {
	return e === "hour12" || e === "meridiem" ? "hour" : e;
}
function rH(e, t) {
	return kE(e, "hour", iH(ao(e.getHours()), t === "pm"));
}
function iH(e, t) {
	let n = e % 12;
	return t ? n + 12 : n;
}
//#endregion
//#region src/interactions/timestamp-engine.ts
var aH = "datetime", oH = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.apply(this.root.querySelectorAll(`.${_t}`), E.temporal === null), E.onTable(() => this.apply(this.root.querySelectorAll(`.${_t}`))), e.propertyPatchEngine?.addValueChangeHandler((e) => this.apply(pa(e.components, `.${_t}`))), z(this.root, `.${_t}`, {
			childList: !0,
			attributeFilter: [aH],
			relevant: (e) => e.type === "attributes" || !(e.target instanceof Element && e.target.closest(".ui-timestamp") !== null)
		}, (e) => this.apply(e));
	}
	apply(e, t = !1) {
		let n = {
			temporal: E.temporal,
			language: E.language || document.documentElement.lang
		}, r = Date.now(), i = !1;
		for (let a of e) {
			let e = lo(a.getAttribute(yt)), o = co(a.getAttribute(aH)), s = a.querySelector(`.${vt}`);
			if (s === null || t && !sH(e, o, r)) continue;
			let c = o === null ? "" : mo(o, e, n, r);
			s.textContent !== c && (s.textContent = c), i ||= uo(e) && o !== null;
		}
		i && Go(this.refreshRelative);
	}
	refreshRelative = () => {
		let e = [...this.root.querySelectorAll(`.${_t}:is([${yt}="relative"], [${yt}="relative-date"])`)];
		return e.length !== 0 && (this.apply(e), !0);
	};
};
function sH(e, t, n) {
	return e === "relative" || e === "relative-date" && t !== null && ho(t, n) !== null;
}
//#endregion
//#region src/items/item-reveal.ts
var cH = /* @__PURE__ */ new Map();
function lH(e) {
	if (e.hasAttribute("data-ui-items-host")) return e;
	for (let t of e.querySelectorAll(`[${b}]`)) if (t.closest(S) === e) return t;
	return null;
}
function uH(e, t, n, r) {
	let i = dH(e, t);
	return i !== null && (cH.set(e, {
		key: t,
		block: n
	}), fH(e, i, n, r), !0);
}
function dH(e, t) {
	for (let n of e.children) if (n.getAttribute("data-ui-key") === t) return n;
	return null;
}
function fH(e, t, n, r) {
	let i = t.previousElementSibling, a = i !== null && i.hasAttribute("data-ui-group-header") && i.getAttribute("data-ui-group-anchor") === t.getAttribute("data-ui-key") ? i : null, o = ul(e);
	if (o.scrollHeight <= o.clientHeight) {
		(a ?? t).scrollIntoView({
			behavior: r,
			block: n === "Start" ? "start" : n === "End" ? "end" : n === "Center" ? "center" : "nearest"
		});
		return;
	}
	let s = o.getBoundingClientRect().top + o.clientTop, c = o.clientHeight, l = (a ?? t).getBoundingClientRect().top, u = t.getBoundingClientRect().bottom, d = pH(n, l - s, u - s, c);
	d !== 0 && (r === "smooth" ? o.scrollTo({
		top: o.scrollTop + d,
		behavior: r
	}) : o.scrollTop += d);
}
function pH(e, t, n, r) {
	switch (e) {
		case "Center": return (t + n - r) / 2;
		case "End": return n - r;
		case "Nearest": return t >= 0 && n <= r ? 0 : t < 0 || n - t > r ? t : n - r;
		default: return t;
	}
}
function mH(e) {
	let t = cH.get(e);
	if (t === void 0) return;
	let n = dH(e, t.key);
	if (n === null) {
		cH.delete(e);
		return;
	}
	fH(e, n, t.block, "auto");
}
function hH(e) {
	if (!(cH.size === 0 || !(e instanceof Node))) for (let t of [...cH.keys()]) (!t.isConnected || ul(t).contains(e)) && cH.delete(t);
}
//#endregion
//#region src/interactions/scroll-anchor-engine.ts
var gH = "data-ui-scroll-anchor", _H = "End", vH = `[${gH}="${_H}"]`, yH = 4, bH = [
	"wheel",
	"touchstart",
	"pointerdown",
	"keydown"
], xH = /* @__PURE__ */ new WeakSet();
function SH(e) {
	xH.add(e);
}
function CH(e) {
	hH(e);
	for (let t = e.closest(vH); t !== null; t = t.parentElement?.closest(vH) ?? null) xH.delete(t);
}
var wH = class {
	root;
	pinned = /* @__PURE__ */ new WeakMap();
	resizes = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null;
	watched = /* @__PURE__ */ new WeakMap();
	watchedContainers = /* @__PURE__ */ new WeakSet();
	heights = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0);
		for (let e of bH) this.root.addEventListener(e, (e) => TH(e), {
			capture: !0,
			passive: !0
		});
		z(this.root, `[${gH}="${_H}"]`, {
			childList: !0,
			characterData: !0,
			attributeFilter: [Jt]
		}, (e) => this.followEach(e)), this.followContent();
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof Element) || !DH(t) || this.pinned.set(t, xH.has(t) || kH(t) && !OH(t));
	}
	followContent() {
		this.followEach(this.root.querySelectorAll(`[${gH}="${_H}"]`));
	}
	followEach(e) {
		for (let t of e) {
			if (this.watchRows(t), xH.has(t)) {
				this.pinned.set(t, !0), EH(t);
				continue;
			}
			if (this.pinned.get(t) !== !1) {
				if (OH(t)) {
					this.pinned.set(t, !1);
					continue;
				}
				this.pinned.set(t, !0), EH(t);
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
			if (!e.isConnected || r === null || !DH(r)) {
				this.forget(e);
				continue;
			}
			let i = e.getBoundingClientRect(), a = this.heights.get(e);
			if (this.heights.set(e, i.height), a === i.height) continue;
			let o = a !== void 0 && i.top + a <= r.getBoundingClientRect().top ? i.height - a : 0;
			t.set(r, (t.get(r) ?? 0) + o);
		}
		for (let [e, n] of t) this.followsEnd(e) ? EH(e) : n !== 0 && e.getAttribute("data-ui-host-mode") !== "virtualized" && getComputedStyle(e).overflowAnchor === "none" && (e.scrollTop += n);
	}
	followOwnBox(e) {
		if (!e.isConnected || !DH(e)) {
			this.watchedContainers.delete(e), this.resizes?.unobserve(e);
			return;
		}
		this.followsEnd(e) && EH(e);
	}
	followsEnd(e) {
		return xH.has(e) || this.pinned.get(e) !== !1 && !OH(e);
	}
	forget(e) {
		this.resizes?.unobserve(e), this.heights.delete(e);
	}
};
function TH(e) {
	hH(e.target);
	let t = e.target instanceof Element ? e.target.closest(vH) : null;
	t !== null && xH.delete(t);
}
function EH(e) {
	e.scrollTop = e.scrollHeight;
}
function DH(e) {
	return e.getAttribute(gH) === _H;
}
function OH(e) {
	return WC(e, Ut);
}
function kH(e) {
	return e.scrollHeight - e.scrollTop - e.clientHeight <= yH;
}
//#endregion
//#region src/interactions/text-selection-engine.ts
var AH = `${Xc}, [role='menu'], [role='tab']`, jH = class {
	selection;
	selects;
	constructor(e = {}) {
		let t = e.root ?? document;
		this.selection = e.selection ?? (() => document.getSelection()), this.selects = e.selects ?? MH, t.addEventListener("pointerdown", (e) => this.handlePointerDown(e), { capture: !0 });
	}
	handlePointerDown(e) {
		if (e.button !== 0 || e.pointerType === "touch" || !(e.target instanceof Element)) return;
		let t = this.selection();
		t === null || t.isCollapsed || e.target.closest(AH) !== null || this.selects(e.target) || t.removeAllRanges();
	}
};
function MH(e) {
	let t = getComputedStyle(e);
	return (t.getPropertyValue("user-select") || t.getPropertyValue("-webkit-user-select")) !== "none";
}
//#endregion
//#region src/interactions/scroll-group-mapping.ts
function NH(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.top(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = FH(e, a, n), s = FH(e, a + 1, n);
	return IH(t, o.top, s.top, o.line, s.line);
}
function PH(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.line(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = FH(e, a, n), s = FH(e, a + 1, n);
	return IH(t, o.line, s.line, o.top, s.top);
}
function FH(e, t, n) {
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
function IH(e, t, n, r, i) {
	return n <= t ? r : r + Math.min(1, Math.max(0, (e - t) / (n - t))) * (i - r);
}
//#endregion
//#region src/interactions/scroll-group-engine.ts
var LH = 250, RH = class {
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
		let r = this.memberScrolledBy(t), i = r?.getAttribute(Nt);
		if (r != null && i != null && i.length !== 0) for (let e of this.membersOf(i)) e !== r && e.isConnected && this.follow(t, this.viewportOf(e));
	}
	membersOf(e) {
		let t = performance.now(), n = this.members.get(e);
		if (n !== void 0 && t - n.at < LH && n.found.every((e) => e.isConnected)) return n.found;
		let r = [...this.root.querySelectorAll(`[${Nt}="${wi(e)}"]`)];
		return this.members.set(e, {
			found: r,
			at: t
		}), r;
	}
	memberScrolledBy(e) {
		for (let t = e.closest(`[${Nt}]`); t !== null; t = t.parentElement?.closest("[data-ui-scroll-group]") ?? null) if (this.viewportOf(t) === e) return t;
		return null;
	}
	viewportOf(e) {
		let t = this.viewports.get(e);
		if (t !== void 0 && t.isConnected && e.contains(t)) return t;
		let n = zH(e, "data-ui-scroll-viewport") ?? BH(e) ?? e;
		return this.viewports.set(e, n), n;
	}
	follow(e, t) {
		let n = e.scrollHeight - e.clientHeight, r = t.scrollHeight - t.clientHeight;
		if (r <= 0 && t.scrollWidth <= t.clientWidth) return;
		let i = n > 0 ? HH(e) : null, a = i === null ? null : HH(t), o;
		if (n <= 0 || e.scrollTop <= 0) o = 0;
		else if (e.scrollTop >= n - 1) o = r;
		else if (i !== null && a !== null) {
			let t = Math.max(i.endLine, a.endLine);
			o = PH(a, NH(i, e.scrollTop, t), t);
		} else o = e.scrollTop / n * r;
		let s = i === null && a === null ? VH(e.scrollLeft, e.scrollWidth - e.clientWidth) * Math.max(0, t.scrollWidth - t.clientWidth) : t.scrollLeft;
		o = Math.round(Math.min(Math.max(0, o), Math.max(0, r))), !(Math.abs(t.scrollTop - o) < 1 && Math.abs(t.scrollLeft - s) < 1) && (t.scrollTo({
			top: o,
			left: s,
			behavior: "instant"
		}), this.driven.set(t, t.scrollTop));
	}
};
function zH(e, t) {
	for (let n of e.querySelectorAll(`[${t}]`)) if (n.closest("[data-ui-id]") === e) return n;
	return null;
}
function BH(e) {
	let t = e.hasAttribute("data-ui-items-host") ? e : zH(e, b);
	return t === null ? null : ul(t);
}
function VH(e, t) {
	return t > 0 ? e / t : 0;
}
function HH(e) {
	let t = e.getBoundingClientRect().top + e.clientTop - e.scrollTop, n = (e) => e.getBoundingClientRect().top - t, r = e.querySelector(`[${Pt}]`);
	if (r !== null && r.children.length > 0) return {
		count: r.children.length,
		line: (e) => e + 1,
		top: (e) => n(r.children[e]),
		endLine: r.children.length + 1,
		scrollHeight: e.scrollHeight
	};
	let i = e.querySelectorAll(`[${Ft}]`);
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
var UH = ".ui-tab-item__caption, .ui-split-button:not([data-ui-split-mode='menu']) > :is(.ui-split-button__main, .ui-split-button__toggle)", WH = `.${di}, .ui-action, .${x}, .ui-select__option, .ui-language-switcher__choice, .ui-pager__size-choice, .ui-color-input__swatch--button, .ui-expander__header, ${UH}`, GH = ".ui-expander--quiet > .ui-expander__header", KH = "ui-key-value-action__row", qH = `${WH}, ${`${jl}, .${KH}`}`, JH = "ui-pressing", YH = "ui-press-held", XH = "--ui-press-x", ZH = "--ui-press-y", QH = "--ui-ripple-radius", $H = "--ui-ripple-opacity", eU = class {
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
		if (t === null || typeof t.animate != "function" || qf()) return;
		for (let [e, n] of this.presses) n.element === t && this.finish(e, n);
		let n = t.getBoundingClientRect(), r = e.clientX - n.left, i = e.clientY - n.top, a = Math.hypot(Math.max(r, n.width - r), Math.max(i, n.height - i));
		t.style.setProperty(XH, `${r}px`), t.style.setProperty(ZH, `${i}px`), t.classList.add(JH, YH);
		let o = t.animate([{ [QH]: "0px" }, { [QH]: `${a}px` }], {
			duration: R.ripple,
			easing: R.ease,
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
		let t = e.closest(UH) ?? e.closest(qH);
		if (t === null || D(t) || t.matches(GH)) return null;
		let n = e.closest(ci);
		return n !== null && n !== t && t.contains(n) ? null : t.matches(WH) ? t : this.pressedRow(t, e);
	}
	pressedRow(e, t) {
		if (rl(t, e) !== null || O(e) || e.hasAttribute("data-ui-row-editing")) return null;
		let n = e.closest(P), r = n !== null && !e.classList.contains(KH) && !n.hasAttribute("data-ui-no-row-select") && (n.getAttribute("data-ui-selection") === "one" || n.getAttribute("data-ui-selection") === "many"), i = e.classList.contains("ui-tree__row") && gs(e, "data-ui-unselectable");
		return !r && !i && !this.raisesClick(e, t) ? null : F(e);
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
		n.element.classList.remove(YH);
		let r = Math.max(0, R.ripple - (performance.now() - n.started)), i = 0;
		!t && r > 0 && (i = Math.min(r, R.fast), n.grow.updatePlaybackRate(r / i)), n.fade = n.element.animate([{ [$H]: 1 }, { [$H]: 0 }], {
			duration: R.normal,
			delay: i,
			easing: R.exit,
			fill: "forwards"
		}), n.fade.addEventListener("finish", () => this.finish(e, n));
	}
	finish(e, t) {
		t.grow.cancel(), t.fade?.cancel(), t.element.classList.remove(JH, YH), this.presses.get(e) === t && this.presses.delete(e);
	}
}, tU = "ui-overlay-scrollbar", nU = "ui-overlay-scrollbar__box", rU = "ui-overlay-scrollbar__thumb", iU = "ui-overlay-scrollbar--shown", aU = "ui-overlay-scrollbar__thumb--held", oU = "(hover: hover) and (forced-colors: none)", sU = "--ui-overlay-thumb", cU = 12, lU = 2, uU = 24, dU = 900, fU = 16, pU = class {
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
		this.doc = e, this.layer = e.createElement("div"), this.layer.className = tU, this.layer.setAttribute("aria-hidden", "true"), this.layer.setAttribute("popover", "manual"), this.bars = {
			y: this.createBar(e, "y"),
			x: this.createBar(e, "x")
		}, this.layer.addEventListener("mousedown", (e) => e.preventDefault()), this.layer.addEventListener("contextmenu", (e) => e.preventDefault()), e.body.append(this.layer), bm((e) => e.includes(this.bars.y.thumb) ? this.bars.y.scroller : e.includes(this.bars.x.thumb) ? this.bars.x.scroller : null), this.media = window.matchMedia(oU), this.active = this.media.matches, this.media.addEventListener("change", () => this.follow()), this.active && this.raise(), e.addEventListener("pointermove", (e) => this.handlePointerMove(e), {
			capture: !0,
			passive: !0
		}), e.documentElement.addEventListener("pointerleave", () => this.leave()), e.addEventListener("scroll", (e) => this.handleScroll(e), {
			capture: !0,
			passive: !0
		}), window.addEventListener("resize", () => this.schedule());
	}
	createBar(e, t) {
		let n = e.createElement("div"), r = e.createElement("div");
		return n.className = `${nU} ${nU}--${t}`, r.className = `${rU} ${rU}--${t}`, n.append(r), this.layer.append(n), r.addEventListener("pointerdown", (e) => this.grab(e, t)), r.addEventListener("pointermove", (e) => this.pull(e)), r.addEventListener("pointerup", (e) => this.release(e)), r.addEventListener("pointercancel", (e) => this.release(e)), r.addEventListener("lostpointercapture", (e) => this.lose(e)), r.addEventListener("wheel", (e) => this.forwardWheel(e, t), { passive: !1 }), {
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
			this.pick(vU(t, "y") ? t : null, vU(t, "x") ? t : null, !1), this.settleLater(), this.schedule();
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
		}, dU);
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
		e !== null && this.layer.contains(e) || (this.target = e, this.pick(mU(e, "y"), mU(e, "x"), !0));
	}
	measure(e) {
		let t = this.bars[e].scroller;
		if (t === null || !t.isConnected || !vU(t, e)) return null;
		let n = xU(t);
		if (n === null) return null;
		let r = this.bars[e === "y" ? "x" : "y"].scroller === t;
		return {
			view: n,
			thumb: SU(t, e, yU(t), r)
		};
	}
	apply(e, t) {
		if (t === null) {
			e.box.classList.remove(iU);
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
		}), e.box.classList.add(iU);
	}
	grab(e, t) {
		let n = this.bars[t].scroller;
		if (e.button !== 0 || n === null) return;
		let r = t === "x" && EU(n), i = CU(n, t, yU(n), this.bars[t === "y" ? "x" : "y"].scroller === n, r), a = i.length - i.thumb;
		CH(n), this.bars[t].thumb.setPointerCapture(e.pointerId), this.bars[t].thumb.classList.add(aU), this.drag = {
			axis: t,
			scroller: n,
			pointerId: e.pointerId,
			from: t === "y" ? e.clientY : e.clientX,
			scroll: TU(n, t),
			ratio: a > 0 ? i.max / a : 0,
			rtl: r
		};
	}
	pull(e) {
		let t = this.drag;
		if (t === null || e.pointerId !== t.pointerId || !t.scroller.isConnected) return;
		let n = (t.axis === "y" ? e.clientY : e.clientX) - t.from;
		t.axis === "y" ? t.scroller.scrollTop = wU(t.scroll, n, t.ratio, !1) : t.scroller.scrollLeft = wU(t.scroll, n, t.ratio, t.rtl);
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
		this.drag !== null && this.bars[this.drag.axis].thumb.classList.remove(aU), this.drag = null;
	}
	forwardWheel(e, t) {
		let n = this.bars[t].scroller;
		if (n === null || e.ctrlKey) return;
		let r = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? "y" : "x", i = e.deltaX * _U(e, n, "x"), a = e.deltaY * _U(e, n, "y"), o = hU(n, r, r === "y" ? a : i);
		e.preventDefault(), o !== null && (CH(o), o.scrollBy({
			left: i,
			top: a
		}));
	}
};
function mU(e, t) {
	for (let n = e; n !== null; n = n.parentElement) if (vU(n, t)) return n;
	return null;
}
function hU(e, t, n) {
	for (let r = e; r !== null; r = mU(r.parentElement, t)) if (vU(r, t) && gU(r, t, n)) return r;
	return null;
}
function gU(e, t, n) {
	let r = t === "y" ? e.scrollHeight - e.clientHeight : e.scrollWidth - e.clientWidth, i = TU(e, t), a = t === "x" && EU(e) ? n < 0 : n > 0;
	return n !== 0 && (a ? i < r - 1 : i > 0);
}
function _U(e, t, n) {
	return e.deltaMode === WheelEvent.DOM_DELTA_LINE ? fU : e.deltaMode === WheelEvent.DOM_DELTA_PAGE ? n === "y" ? t.clientHeight : t.clientWidth : 1;
}
function vU(e, t) {
	if ((t === "y" ? e.scrollHeight - e.clientHeight : e.scrollWidth - e.clientWidth) <= 1) return !1;
	let n = e === document.scrollingElement, r = getComputedStyle(n ? document.documentElement : e), i = t === "y" ? r.overflowY : r.overflowX;
	return n ? i !== "hidden" && i !== "clip" : (i === "auto" || i === "scroll") && r.getPropertyValue(sU).trim() !== "none";
}
function yU(e) {
	if (e === document.scrollingElement) return DU(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
	let t = e.getBoundingClientRect(), n = e instanceof HTMLElement ? e : null, r = bU(t.width, n?.offsetWidth), i = bU(t.height, n?.offsetHeight), a = t.left + e.clientLeft * r, o = t.top + e.clientTop * i;
	return DU(a, o, a + e.clientWidth * r, o + e.clientHeight * i);
}
function bU(e, t) {
	return t === void 0 || t <= 0 || e <= 0 ? 1 : e / t;
}
function xU(e) {
	let t = yU(e);
	for (let n = e; n !== null && n !== document.documentElement; n = n.parentElement) {
		let r = getComputedStyle(n);
		if (n !== e && (r.overflowX !== "visible" || r.overflowY !== "visible") && (t = OU(t, yU(n))), r.position === "fixed" || n.matches(":popover-open, dialog:modal")) break;
	}
	return t = OU(t, DU(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight)), t.width > 0 && t.height > 0 ? t : null;
}
function SU(e, t, n, r) {
	let i = EU(e), a = CU(e, t, n, r, i), o = a.max > 0 ? TU(e, t) / a.max * (a.length - a.thumb) : 0;
	return t === "y" ? {
		left: i ? n.left : n.right - cU,
		top: a.start + o,
		width: cU,
		height: a.thumb
	} : {
		left: i ? a.start + a.length - a.thumb - o : a.start + o,
		top: n.bottom - cU,
		width: a.thumb,
		height: cU
	};
}
function CU(e, t, n, r, i) {
	let a = (t === "y" ? n.top : n.left) + lU + (r && i && t === "x" ? cU : 0), o = (t === "y" ? n.height : n.width) - 4 - (r ? cU : 0), s = t === "y" ? e.clientHeight : e.clientWidth, c = t === "y" ? e.scrollHeight : e.scrollWidth;
	return {
		start: a,
		length: o,
		thumb: Math.min(o, Math.max(uU, o * s / c)),
		max: c - s
	};
}
function wU(e, t, n, r) {
	return r ? -(e - t * n) : e + t * n;
}
function TU(e, t) {
	return t === "y" ? e.scrollTop : Math.abs(e.scrollLeft);
}
function EU(e) {
	return getComputedStyle(e).direction === "rtl";
}
function DU(e, t, n, r) {
	return {
		left: e,
		top: t,
		right: n,
		bottom: r,
		width: Math.max(0, n - e),
		height: Math.max(0, r - t)
	};
}
function OU(e, t) {
	return DU(Math.max(e.left, t.left), Math.max(e.top, t.top), Math.min(e.right, t.right), Math.min(e.bottom, t.bottom));
}
//#endregion
//#region src/interactions/refusal-engine.ts
var kU = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"Home",
	"End",
	"PageUp",
	"PageDown"
]), AU = [
	"click",
	"dblclick",
	"auxclick",
	"dragstart"
], jU = `.${$r}, .${ei}`, MU = RegExp(`(^|\\s)(${$r}|${ei})(\\s|$)`), NU = RegExp(`(^|\\s)${ti}(\\s|$)`), PU = "[type='range']", FU = /* @__PURE__ */ new WeakSet(), IU = /* @__PURE__ */ new WeakSet();
function LU(e = document) {
	let t = e === document ? window : e;
	for (let e of AU) t.addEventListener(e, GU, !0);
	t.addEventListener("keydown", qU, !0), t.addEventListener("change", JU, !0), t.addEventListener("pointerdown", YU, !0), t.addEventListener("mousedown", YU, !0), HU(e.querySelectorAll(jU)), BU(e.querySelectorAll(`[${Qr}]`)), zU(e.querySelectorAll(PU)), new MutationObserver((e) => {
		for (let t of e) RU(t);
	}).observe(e, {
		subtree: !0,
		childList: !0,
		attributes: !0,
		attributeFilter: ["class", Qr],
		attributeOldValue: !0
	});
}
function RU(e) {
	if (e.type === "attributes") {
		let t = e.target;
		if (e.attributeName === "data-ui-href") {
			VU(t, e.oldValue !== null);
			return;
		}
		let n = MU.test(e.oldValue ?? ""), r = t.matches(jU);
		n !== r && (UU(t, r), VU(t)), NU.test(e.oldValue ?? "") !== t.matches(".ui-readonly") && zU(t.querySelectorAll(PU));
		return;
	}
	let t = (e.target instanceof Element ? e.target : null)?.matches(jU) === !0;
	for (let n of e.addedNodes) n instanceof Element && (t && WU(n), n.matches(jU) && UU(n, !0), HU(n.querySelectorAll(jU)), VU(n), BU(n.querySelectorAll(`[${Qr}]`)), zU([n, ...n.querySelectorAll(PU)]));
}
function zU(e) {
	for (let t of e) {
		if (!(t instanceof HTMLInputElement) || t.type !== "range") continue;
		let e = k(t);
		e !== FU.has(t) && (e ? (FU.add(t), t.addEventListener("touchstart", YU, { passive: !1 })) : (FU.delete(t), t.removeEventListener("touchstart", YU)));
	}
}
function BU(e) {
	for (let t of e) VU(t);
}
function VU(e, t = !1) {
	let n = e.getAttribute(Qr);
	n === null && !t || (e.matches(jU) ? (e.removeAttribute("href"), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0")) : n === null || !Zm(n) ? e.removeAttribute("href") : e.getAttribute("href") !== n && (e.setAttribute("href", n), e.getAttribute("tabindex") === "0" && e.removeAttribute("tabindex")));
}
function HU(e) {
	for (let t of e) UU(t, !0);
}
function UU(e, t) {
	for (let n of e.children) t ? WU(n) : IU.has(n) && (IU.delete(n), n.removeAttribute("inert"));
}
function WU(e) {
	e.hasAttribute("inert") || (IU.add(e), e.setAttribute("inert", ""));
}
function GU(e) {
	e.target instanceof Element && (D(e.target) ? (e.type === "click" && Dm(e), XU(e)) : e.type === "click" && KU(e.target) && e.preventDefault());
}
function KU(e) {
	return e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio") && k(e);
}
function qU(e) {
	if (!(!(e instanceof KeyboardEvent) || !(e.target instanceof Element))) {
		if ((e.key === "Enter" || e.key === " ") && D(e.target)) {
			XU(e);
			return;
		}
		!kU.has(e.key) || !(e.target instanceof HTMLInputElement) || (e.target.type === "range" || e.target.type === "radio") && k(e.target) && e.preventDefault();
	}
}
function JU(e) {
	e.target instanceof HTMLInputElement && e.target.type === "range" && k(e.target) && e.stopImmediatePropagation();
}
function YU(e) {
	!(e.target instanceof HTMLInputElement) || e.target.type !== "range" || !k(e.target) || (e.preventDefault(), e.target.focus({ preventScroll: !0 }));
}
function XU(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region src/interactions/popup-service.ts
var ZU = /* @__PURE__ */ new WeakMap(), QU = /* @__PURE__ */ new WeakSet(), $U = /* @__PURE__ */ new WeakSet(), eW = new Jh({
	show: () => void 0,
	hide: ({ popup: e }, t) => {
		let n = ZU.get(e);
		ZU.delete(e), t !== void 0 && n?.(t);
	},
	single: !1,
	isInside: ({ popup: e, anchor: t }, n) => n.includes(e) || t !== void 0 && n.includes(t),
	onPress: !0,
	closesOnTab: ({ popup: e }) => QU.has(e),
	sheetOnPhone: ({ popup: e }) => $U.has(e)
});
function tW(e) {
	return {
		open: (e, t, n) => nW(e, t, n, (e) => eW.open(e)),
		openList: rW,
		listKey: wO,
		followPointer: DO,
		focusReturn: (t) => Ud(t, e)
	};
}
function nW(e, t, n, r) {
	let i = n.owner ?? (e instanceof HTMLElement ? e : t), a = () => eW.popupOf(i) === t;
	return ZU.set(t, n.onDismiss), n.closesOnTab === !0 ? QU.add(t) : QU.delete(t), n.sheetOnPhone === !0 ? $U.add(t) : $U.delete(t), r({
		owner: i,
		popup: t,
		anchor: e,
		placement: n
	}) || (ZU.delete(t), queueMicrotask(() => n.onDismiss("owner"))), {
		reposition: () => {
			a() && eW.reposition(i);
		},
		close: () => {
			a() && eW.close(i);
		}
	};
}
function rW(e, t, n) {
	return nW(e, t, {
		...n,
		closesOnTab: !0
	}, (e) => CO(eW, e, n.entries, n.checked, n.fromEnd, n.focus));
}
//#endregion
//#region src/rendering/series-colors.ts
var iW = "--ui-color-series-count", aW = "--ui-color-series-", oW = 8;
function sW(e) {
	let t = Number(getComputedStyle(e).getPropertyValue(iW));
	return Number.isFinite(t) && t >= 1 ? Math.floor(t) : oW;
}
function cW(e, t) {
	return `var(${aW}${e % t + 1})`;
}
var lW = {
	count: sW,
	color: cW
}, uW = ".ui-items-view", dW = `:scope > [${Ot}="${At}"]`, fW = `:scope > [${b}]`, pW = `:scope > [${Ct}]`, mW = `${Ge}first-visible-key`, hW = "ui-orientation--horizontal", gW = 1, _W = class {
	root;
	views = /* @__PURE__ */ new Set();
	waiting = /* @__PURE__ */ new Map();
	sized = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, z(this.root, uW, { childList: !0 }, (e) => this.findEach(e)), this.findEach(Array.from(this.root.querySelectorAll(`[${Ot}="${At}"]`), (e) => e.parentElement).filter((e) => e !== null)), this.root.addEventListener("scroll", (e) => this.handleScroll(e), {
			capture: !0,
			passive: !0
		});
	}
	findEach(e) {
		for (let t of e) vW(t) ? (this.views.add(t), this.watchHost(t), this.schedule(t)) : this.views.has(t) && this.forget(t);
	}
	watchHost(e) {
		let t = e.querySelector(fW), n = this.sized.get(e);
		if (n?.host === t) return;
		if (n?.stop(), t === null) {
			this.sized.delete(e);
			return;
		}
		let r = yF(t, () => this.schedule(e)), i = new MutationObserver((n) => {
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
		let t = e.querySelector(dW);
		if (!e.isConnected || t === null || !t.hasAttribute(mW)) {
			this.forget(e);
			return;
		}
		let n = e.querySelector(fW);
		if (n === null || D(t)) return;
		let r = yW(e, n);
		r !== void 0 && r !== t.getAttribute("data-ui-first-visible-key") && (r === null ? t.removeAttribute(ct) : t.setAttribute(ct, r), t.dispatchEvent(new Event("change", { bubbles: !0 })));
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
function vW(e) {
	return e.querySelector(dW)?.hasAttribute(mW) === !0;
}
function yW(e, t) {
	let n = e.classList.contains(hW), r = n && getComputedStyle(t).direction === "rtl", i = [], a = !1;
	for (let e of t.children) {
		let t = e.getAttribute(y);
		if (t === null || e.hasAttribute("data-ui-group-header")) continue;
		a = !0;
		let o = hl(e);
		!e.classList.contains("ui-hidden") && (o.width > 0 || o.height > 0) && i.push({
			key: t,
			...bW(o, n, r)
		});
	}
	if (!a) return null;
	let o = xW(t, n, r);
	return o.end - o.start <= gW ? void 0 : EW(i, o) ?? void 0;
}
function bW(e, t, n) {
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
function xW(e, t, n) {
	let r = ul(e), i = bW(SW(r, getComputedStyle(r)), t, n);
	for (let e = r.parentElement; e !== null; e = e.parentElement) {
		let r = getComputedStyle(e);
		(t ? r.overflowX : r.overflowY) !== "visible" && (i = wW(i, bW(SW(e, null), t, n)));
	}
	return i = wW(i, bW({
		left: 0,
		top: 0,
		right: window.innerWidth,
		bottom: window.innerHeight
	}, t, n)), TW(e, i, t, n);
}
function SW(e, t) {
	let n = e.getBoundingClientRect(), r = n.left + e.clientLeft, i = n.top + e.clientTop;
	return {
		left: r + CW(t?.paddingLeft),
		top: i + CW(t?.paddingTop),
		right: r + e.clientWidth - CW(t?.paddingRight),
		bottom: i + e.clientHeight - CW(t?.paddingBottom)
	};
}
function CW(e) {
	let t = e === void 0 ? NaN : parseFloat(e);
	return Number.isFinite(t) ? t : 0;
}
function wW(e, t) {
	return {
		start: Math.max(e.start, t.start),
		end: Math.min(e.end, t.end)
	};
}
function TW(e, t, n, r) {
	let i = t.start;
	for (let t of e.querySelectorAll(pW)) {
		let e = bW(t.getBoundingClientRect(), n, r);
		e.start <= i + gW && e.end > i && getComputedStyle(t).position === "sticky" && (i = e.end);
	}
	return {
		start: i,
		end: t.end
	};
}
function EW(e, t) {
	for (let n of e) if (n.key.length > 0 && n.end > t.start + gW && n.start < t.end) return n.key;
	return null;
}
//#endregion
//#region src/items/item-rows.ts
function DW(e, t, n) {
	return {
		itemOf: (e) => t.getItemValue(e),
		itemsOf: (e) => n.itemsOf(e),
		readPath: hw,
		renderVariant: (n, r, i) => {
			let a = e.getVariantTemplate(r, i), o = t.getItemScope(n);
			return a === void 0 || o === void 0 ? null : t.renderFromTemplate(a, o.item, t.getAncestorStack(n));
		},
		isKeyTarget: (e) => hu(e) !== null,
		cellsOf: (e) => {
			let t = e.closest(P);
			return t !== null && wu(t) ? Du(t, e) : [];
		},
		moveCursor: (e, t) => zu(e, t ?? null)
	};
}
//#endregion
//#region src/items/items-template-renderer.ts
var OW = class {
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
		let c = this.metadata.getItemsTemplateMetadata(e), l = c?.itemWrapperElementName ? jW(o, c.itemWrapperElementName, c.itemWrapperClassName ?? null, c.itemWrapperRole ?? null) : o;
		l !== o && this.moveItemScope(o, l), MW(l, n, t);
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
		let i = AW(r.item, t, n);
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
	setRowFiller(e) {
		this.fillRow = e;
	}
	rewriteRowWords(e, t) {
		this.translatableRowBindings ??= this.findTranslatableRowBindings();
		for (let [n, r] of this.translatableRowBindings) for (let i of e.querySelectorAll(r)) {
			let e = this.stackOf(i);
			kW(n, e) && this.applyBoundAttribute(i, String(w(n.bindingId)), e, t);
		}
	}
	findTranslatableRowBindings() {
		let e = [];
		for (let t of this.metadata.metadata.bindings) {
			let n = this.metadata.getPropertyDefinition(t.propertyId);
			if (n === void 0 || typeof t.itemTemplate != "string" || !this.metadata.isTranslatable(t)) continue;
			let r = w(t.bindingId);
			e.push([t, `[${Ge}${Ti(n.propertyName)}="${wi(r)}"]`]);
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
		let r = LW(t, n.templateKeyPropertyName);
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
		r !== void 0 && dw(e, r.itemTemplateParameters, n) || this.applyBoundAttribute(e, t, n);
	}
	applyBoundAttribute(e, t, n, r) {
		let i = Number(t);
		if (!Number.isInteger(i) || i <= 0) return;
		let a = this.metadata.getBindingById(i), o = a === void 0 ? void 0 : this.metadata.getPropertyDefinition(a.propertyId);
		if (a === void 0 || o === void 0) return;
		let c = a.itemTemplate === null || a.itemTemplate === void 0 ? this.state.has(a, []) ? {
			ok: !0,
			value: this.state.get(a, [])
		} : { ok: !1 } : uw(n, a.itemTemplate, a.itemTemplateParameters);
		if (!c.ok) {
			a.optional !== !0 && !this.unresolved.has(i) && (this.unresolved.add(i), s("item binding value could not be resolved; the item's path stops short of the property.", {
				binding: a,
				stack: n
			}));
			return;
		}
		let l = "scope" in c ? c.scope : void 0, u = c.value ?? a.fallbackValue;
		if (r !== void 0 && !r(u)) return;
		let d = as(u, () => this.metadata.isTranslatable(a) && !fw(l)), f = w(a.componentId), p = e.closest(`[${re}="${f}"]`);
		if (p === null) {
			s("item binding component root was not found in the cloned template.", { binding: a });
			return;
		}
		for (let t of o.operations) {
			let n = Oi(p, t, () => [e])[0] ?? null;
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
function kW(e, t) {
	for (let n of e.itemTemplateParameters ?? []) {
		let e = w(n.componentId);
		if (e > 0 && !t.some((t) => t.scopeComponentId === e)) return !1;
	}
	return !0;
}
function AW(e, t, n) {
	if (t.length === 0) return n;
	let r = e;
	for (let n = 0; n < t.length - 1; n++) {
		let i = t[n], a = i.kind === "property" ? gw(r, i.name) : xw(r, i.key);
		if (!a.ok) return e;
		r = a.value;
	}
	if (typeof r != "object" || !r) return e;
	let i = t[t.length - 1];
	if (i.kind === "element") return Sw(r, i.key, n), e;
	let a = r;
	return a[vw(a, i.name)] = n, e;
}
function jW(e, t, n, r) {
	let i = document.createElement(t);
	return n !== null && (i.className = n), r !== null && r.length > 0 && i.setAttribute("role", r), i.appendChild(e), i;
}
function MW(e, t, n) {
	e.setAttribute(y, t), IW(e, n), PW(e, n);
}
var NW = [
	["CanSelect", oe],
	["CanDrag", se],
	["CanRemove", ce],
	["CanRename", le],
	["CanShowContextMenu", ue]
];
function PW(e, t) {
	for (let [n, r] of NW) {
		let i = gw(t, n);
		e.toggleAttribute(r, i.ok && i.value === !1);
	}
}
function FW(e, t) {
	let n = e.getAttribute(y), r = e.closest(`[${b}]`);
	if (PW(e, t), n !== null) for (let i of e.querySelectorAll(`[${y}="${wi(n)}"]`)) i.closest("[data-ui-items-host]") === r && PW(i, t);
}
function IW(e, t) {
	let n = gw(t, "Group");
	n.ok && typeof n.value == "string" ? e.setAttribute(Tt, n.value) : e.removeAttribute(Tt);
}
function LW(e, t) {
	if (t == null || t.trim().length === 0) return null;
	let n = gw(e, t);
	return !n.ok || n.value === null || n.value === void 0 ? null : typeof n.value == "string" ? n.value : String(n.value);
}
//#endregion
//#region src/items/items-rule-watcher.ts
var RW = "Group", zW = class {
	options;
	dragged = null;
	deferred = /* @__PURE__ */ new Map();
	drawnByHost = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, e.propertyPatchEngine.addValueChangeHandler((e) => this.handleItemValueChange(e));
		for (let t of e.metadata.metadata.itemsFilterSort) {
			let n = w(t.componentId), r = [...t.filters, ...t.sorts], i = () => this.syncComponentHosts(n);
			for (let t of r) t.source !== null && t.source !== void 0 && e.reactiveSources.watch(t.source, i);
		}
		e.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), e.root.addEventListener("dragend", () => this.land(), !0), z(e.root, `[${Ot}="${kt}"]`, { attributeFilter: [st] }, (e) => {
			for (let t of e) {
				let e = ha(t);
				e !== null && this.syncComponentHosts(e);
			}
		}), z(e.root, `[${jt}="windowed"]`, { attributeFilter: [Wt] }, (e) => {
			for (let t of e) {
				let e = ha(t);
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
			for (let [t, n] of e) t.isConnected && Wz(t, n, this.options);
		});
	}
	handleItemValueChange(e) {
		if (e.dynamicParameters.length === 0) return;
		let t = this.options.metadata.getBindingByComponentAndPropertyId(w(e.reference.componentId), e.reference.propertyId), n = t === void 0 ? null : bw(t);
		if (n === null) return;
		let r = this.resolveItemRoots(e, n);
		for (let t of r) this.applyItemValue(t, n, e.value);
		r.length === 0 && this.applyVirtualizedItemValue(e, n);
	}
	applyVirtualizedItemValue(e, t) {
		let n = e.dynamicParameters[e.dynamicParameters.length - 1];
		if (typeof n == "string") for (let r of this.options.root.querySelectorAll(`[${b}]`)) {
			if (V(r) !== "virtualized") continue;
			let i = r.closest(S);
			i === null || !this.drawsPatchedComponent(i, w(e.reference.componentId), t) || !BW(i, e.dynamicParameters) || this.options.virtualization.updateValue(r, n, t.steps, e.value) && this.redrawsVirtualized(T(i), t) && this.sync(r, T(i));
		}
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
	redrawsVirtualized(e, t) {
		return t.steps.length === 0 || this.feedsRule(e, t);
	}
	sync(e, t) {
		if (this.dragged !== null && e.contains(this.dragged)) {
			this.deferred.set(e, t);
			return;
		}
		Wz(e, t, this.options);
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
		return typeof t == "string" ? [...this.options.root.querySelectorAll(`[${y}="${wi(t)}"]`)].filter((t) => this.isItemRoot(t) && aa(t, e)) : [];
	}
	applyItemValue(e, t, n) {
		let r = e.closest(`[${b}]`), i = r === null ? null : ha(r);
		if (r !== null && i !== null && V(r) === "virtualized") {
			let a = e.getAttribute(y);
			if (a === null || !this.options.virtualization.updateValue(r, a, t.steps, n)) return;
			e.isConnected && this.restampAbilities(e, t), this.redrawsVirtualized(i, t) && this.sync(r, i);
			return;
		}
		this.options.renderer.updateItemValue(e, t.steps, n);
		let a = VW(RW, t);
		a && IW(e, this.options.renderer.getItemValue(e)), this.restampAbilities(e, t), r !== null && i !== null && (!a && !this.feedsRule(i, t) || this.sync(r, i));
	}
	restampAbilities(e, t) {
		NW.some(([e]) => VW(e, t)) && FW(e, this.options.renderer.getItemValue(e));
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
		if (this.options.templates.getGroupTemplate(e) !== void 0 && VW(RW, t)) return !0;
		let n = this.options.metadata.getItemsFilterSortMetadata(e);
		return n === void 0 ? !1 : n.filters.some((e) => VW(e.itemProperty, t)) || n.sorts.some((e) => VW(e.itemProperty, t));
	}
	syncComponentHosts(e) {
		for (let t of this.options.root.querySelectorAll(`[${b}]`)) {
			let n = ha(t);
			n === e && this.sync(t, n);
		}
	}
};
function BW(e, t) {
	let n = ia(e, ra(e));
	return t.length === n.length + 1 && n.every((e, n) => String(e ?? "") === String(t[n] ?? ""));
}
function VW(e, t) {
	let n = t.ruleSegments.join(".");
	return n.length === 0 || e === n || e.startsWith(`${n}.`);
}
//#endregion
//#region src/items/table-row-indices.ts
var HW = "ui-table", UW = "ui-table--no-header";
function WW(e, t, n) {
	let r = e.parentElement, i = r?.parentElement ?? null;
	if (r === null || i === null || !r.classList.contains("ui-table__scroll") || !i.classList.contains(HW)) return;
	let a = [], o = [], s = !1;
	for (let t of r.children) t === e ? s = !0 : t.getAttribute("role") === "row" && !(t === r.firstElementChild && i.classList.contains(UW)) && (s ? o : a).push(t);
	a.forEach((e, t) => GW(e, t));
	for (let [e, n] of t) GW(e, a.length + n);
	n !== null && o.forEach((e, t) => GW(e, a.length + n + t)), KW(i, "aria-rowcount", n === null ? "-1" : String(a.length + n + o.length));
}
function GW(e, t) {
	KW(e, "aria-rowindex", String(t + 1));
}
function KW(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/items/items-window-engine.ts
var qW = 50, JW = 1, YW = .5, XW = 60, ZW = "--ui-window-look", QW = "--ui-window-row", $W = "--ui-window-tile", eG = 3, tG = class {
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
			if (this.layout(t), uG(t) === 0) {
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
		let t = UC(e, Bt);
		if (t !== null && DH(e) && WC(e, "data-ui-window-more-after")) {
			pl(e, Math.max(0, this.windowBottom(e, t) - fl(e).height));
			return;
		}
		t !== null && t !== 0 && pl(e, WC(e, "data-ui-window-more-after") ? t * this.getState(e).itemSize : e.scrollHeight);
	}
	windowBottom(e, t) {
		let n = lG(e), r = this.getState(e).itemSize, i = n.length === 0 ? 0 : hl(n[n.length - 1]).bottom - hl(n[0]).top;
		return t * r + (i > 0 ? i : n.length * r);
	}
	sync() {
		for (let e of this.hosts()) this.layout(e), this.getState(e).pending || this.realign(e);
	}
	realign(e) {
		let t = UC(e, Bt), n = lG(e);
		if (t === null || n.length === 0 || e.hasAttribute("data-ui-window-paged")) return;
		let r = this.getState(e), i = fl(e), a = Math.floor(i.top / r.itemSize);
		Math.ceil((i.top + i.height) / r.itemSize) >= t && a <= t + n.length || this.revealWindow(e);
	}
	reconsider() {
		for (let e of this.hosts()) this.considerRequest(e);
	}
	async requestOffsetAsync(e, t) {
		V(e) === "windowed" && await this.requestAsync(e, "Offset", Math.max(0, Math.floor(t)), null, !1);
	}
	hosts() {
		return [...this.root.querySelectorAll(`[${b}][${jt}="windowed"]`)];
	}
	handleScroll(e) {
		let t = dl(e.target);
		if (t === null || V(t) !== "windowed" || t.hasAttribute("data-ui-window-paged")) return;
		let n = this.getState(t);
		n.scheduled === 0 && (this.considerRequest(t), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.considerRequest(t);
		}, XW));
	}
	considerRequest(e) {
		let t = this.getState(e);
		if (t.pending) {
			t.restless = !0;
			return;
		}
		if (e.hasAttribute("data-ui-window-paged") && uG(e) > 0) return;
		let n = lG(e);
		if (n.length === 0) {
			this.requestAsync(e, "Start", 0, null, !1);
			return;
		}
		let r = UC(e, Bt), i = WC(e, Ht), a = WC(e, Ut);
		if (r !== null) {
			let o = this.windowSize(e), s = fl(e), c = Math.max(1, Math.round(s.height * JW / t.itemSize), Math.floor(o * YW)), l = Math.floor(s.top / t.itemSize), u = Math.ceil((s.top + s.height) / t.itemSize);
			if (u < r || l > r + n.length) {
				this.requestAsync(e, "Offset", this.landingOffset(e, l, o), null, !1);
				return;
			}
			if (l - c <= r && i) {
				this.requestAsync(e, "Before", 0, dG(n[0]), !0);
				return;
			}
			if (u + c >= r + n.length && a) {
				this.requestAsync(e, "After", 0, dG(n[n.length - 1]), !0);
				return;
			}
			return;
		}
		let o = fl(e), s = Math.max(1, o.height * JW), c = o.contentHeight - o.top - o.height;
		if (o.top <= s && i) {
			this.requestAsync(e, "Before", 0, dG(n[0]), !0);
			return;
		}
		c <= s && a && this.requestAsync(e, "After", 0, dG(n[n.length - 1]), !0);
	}
	landingOffset(e, t, n) {
		let r = Math.max(0, t - Math.floor(n / 4)), i = UC(e, Vt);
		return i === null ? r : Math.min(r, Math.max(0, i - n));
	}
	async requestAsync(e, t, n, r, i) {
		let a = ha(e);
		if (a === null) {
			s("a windowed items host is not inside an addressable component.", e);
			return;
		}
		if (r === null && (t === "Before" || t === "After")) return;
		let o = this.getState(e);
		o.pending = !0;
		let c = e.closest(S);
		e.setAttribute(Lt, t.toLowerCase()), c?.setAttribute(Lt, t.toLowerCase()), e.setAttribute("aria-busy", "true"), t === "After" && UC(e, "data-ui-window-total") === null && rG(e) && Lz(e, Iz, eG * this.rowSize(e));
		let l = UC(e, Bt) === null, u = l && t === "Before" ? oG(e) : null;
		try {
			await this.options.requestWindow({
				componentId: a,
				dynamicParameters: fG(e),
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
			o.pending = !1, e.removeAttribute(Lt), c?.removeAttribute(Lt), e.removeAttribute("aria-busy"), Lz(e, Iz, 0), this.layout(e), u !== null && cG(e, u), o.restless || l && aG(e, t, r) ? (o.restless = !1, this.considerRequest(e)) : this.realign(e);
		}
	}
	layout(e) {
		let t = this.getState(e), n = lG(e), r = UC(e, Vt), i = UC(e, Bt);
		if (WW(e, n.map((e, t) => [e, (i ?? 0) + t]), r), e.hasAttribute("data-ui-window-paged")) {
			Lz(e, "top", 0), Lz(e, Fz, 0);
			return;
		}
		if (n.length > 0) {
			let r = hl(n[n.length - 1]).bottom - hl(n[0]).top;
			if (r > 0) {
				let i = nG(n), a = Math.ceil(n.length / i);
				t.itemSize = Math.max(1, Math.round(r / (a * i))), iG(e, a > 1 ? (hl(n[n.length - 1]).top - hl(n[0]).top) / (a - 1) : r, i > 1 ? hl(n[1]).left - hl(n[0]).left : null);
			}
		}
		let a = r === null || i === null ? 0 : i * t.itemSize, o = r === null || i === null ? 0 : Math.max(0, r - i - n.length) * t.itemSize;
		Lz(e, "top", a), Lz(e, Fz, o), mH(e);
	}
	rowSize(e) {
		let t = Number.parseFloat(e.style.getPropertyValue(QW));
		return Number.isFinite(t) && t > 0 ? t : this.getState(e).itemSize;
	}
	windowSize(e) {
		let t = UC(e, zt);
		return t !== null && t > 0 ? t : qW;
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
function nG(e) {
	let t = hl(e[0]).top, n = 1;
	for (; n < e.length && hl(e[n]).top === t;) n++;
	return n;
}
function rG(e) {
	return getComputedStyle(e).getPropertyValue(ZW).trim() === "skeleton";
}
function iG(e, t, n) {
	let r = e.style, i = `${Math.round(t * 100) / 100}px`, a = n !== null && n > 0 ? `${Math.round(n * 100) / 100}px` : "";
	r.getPropertyValue(QW) !== i && r.setProperty(QW, i), r.getPropertyValue($W) !== a && (a.length === 0 ? r.removeProperty($W) : r.setProperty($W, a));
}
function aG(e, t, n) {
	let r = lG(e), i = t === "Before" ? r[0] : t === "After" ? r[r.length - 1] : void 0;
	return i !== void 0 && dG(i) !== n;
}
function oG(e) {
	let t = lG(e)[0];
	return t === void 0 ? null : {
		row: t,
		at: sG(e, t)
	};
}
function sG(e, t) {
	return hl(t).top + fl(e).top;
}
function cG(e, t) {
	if (!t.row.isConnected) return;
	let n = sG(e, t.row) - t.at;
	n !== 0 && pl(e, fl(e).top + n);
}
function lG(e) {
	return [...e.children].filter((e) => e.hasAttribute(y));
}
function uG(e) {
	return lG(e).length;
}
function dG(e) {
	return e.getAttribute(y);
}
function fG(e) {
	let t = e.closest(S);
	return t === null ? [] : ia(t, ra(t));
}
//#endregion
//#region src/items/items-composite-renderer.ts
var pG = [
	re,
	ie,
	ae
];
function mG(e, t, n, r, i, a, o) {
	let c = document.createElement(e.itemElementName);
	c.className = e.itemClassName, hG(c, e.itemRole);
	let l = _G(c, e, t, a);
	l !== 0 && o.populateElement(c, n, l, i);
	for (let l of e.slots) {
		let e = gG(l, t, n, a);
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
		d.className = l.wrapperClassName, hG(d, l.wrapperRole);
		for (let [e, t] of Object.entries(l.wrapperAttributes ?? {})) d.setAttribute(e, t);
		d.appendChild(u), MW(d, r, n), c.appendChild(d);
	}
	return MW(c, r, n), o.registerItemScope(c, l, n), c;
}
function hG(e, t) {
	t != null && t.length > 0 && e.setAttribute("role", t);
}
function gG(e, t, n, r) {
	let i = LW(n, e.variantKeyPropertyName);
	if (i !== null && i.length > 0) {
		let n = r.getVariantTemplate(t, `${e.variantKey}:${i}`);
		if (n !== void 0) return n;
	}
	return r.getVariantTemplate(t, e.variantKey);
}
function _G(e, t, n, r) {
	let i = t.hostSlotVariantKey;
	if (i == null || i.length === 0) return 0;
	let a = r.getVariantTemplate(n, i)?.content.firstElementChild ?? null;
	if (a === null) return s("composite item host slot template was not found.", {
		componentId: n,
		hostSlotVariantKey: i
	}), 0;
	for (let t of pG) {
		let n = a.getAttribute(t);
		n !== null && e.setAttribute(t, n);
	}
	for (let t of Array.from(a.attributes)) t.name.startsWith("data-ui-bind-") && e.setAttribute(t.name, t.value);
	return e instanceof HTMLElement && (e.style.alignSelf = "stretch", e.style.justifySelf = "stretch"), T(a);
}
//#endregion
//#region src/items/items-row-renderer.ts
function vG(e, t, n, r, i) {
	let a = i.metadata.getItemsTemplateMetadata(e), o = a?.composite;
	if (o == null) return yG(i.renderer.renderItem(e, t, n, r), a);
	let s = mG(o, e, t, n, r, i.templates, i.renderer);
	return s !== null && a?.rowDecorator && i.renderer.decorateRow(a.rowDecorator, s, t, n, e, r), yG(s, a);
}
function yG(e, t) {
	return e === null ? null : (t?.announcesSelection === !0 && !e.hasAttribute("aria-selected") && e.setAttribute("aria-selected", "false"), cs(e), e);
}
//#endregion
//#region src/items/items-virtualization-engine.ts
var bG = 6, xG = 60, SG = class {
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
		return r === void 0 || i < 0 || a < 0 ? null : r.slice(Math.min(i, a), Math.max(i, a) + 1).filter((e) => EG(e.entry) === !1).map((e) => e.entry.key);
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
		if (!AG(e) && !OG(e)) return a.element;
		let o = getComputedStyle(e), s = NG(o), c = r.projected.map((e) => this.pitchOf(r, e) + s), l = AG(e) ? jG(r.projected, c, r.across) : null, u = l === null ? i : kG(l.starts, i), d = l?.pitches ?? c, f = PG(o.paddingTop) + FG(d, 0, u), p = f + d[u] - s, m = fl(e), h = n === "start" || n === "nearest" && f < m.top ? f : n === "end" || p > m.top + m.height ? p - m.height : null;
		return h !== null && pl(e, Math.max(0, h)), this.layout(e, r), a.element;
	}
	sync(e) {
		let t = this.getState(e);
		if (t === null) return;
		let n = DH(e) && kH(e), r = t.projected;
		this.project(e, t), this.keepCursorShown(e, t, r), this.layout(e, t), n && !kH(e) && (pl(e, e.scrollHeight), this.layout(e, t));
	}
	refill(e, t) {
		let n = this.getState(e);
		if (n === null) return [];
		let r = new Map(n.entries.map((e) => [e.key, e])), i = [], a = [];
		for (let { key: n, item: o } of t) {
			let t = r.get(n);
			if (r.delete(n), t !== void 0 && mf(t.item, o)) {
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
		let n = $u(t);
		t.remove(), ed(e, null, n);
	}
	keepCursorShown(e, t, n) {
		let r = Qu(e), i = t.entries.find((e) => e.element?.hasAttribute("data-ui-row-focus") === !0) ?? null, a = i?.key ?? (r === null ? null : nd(r));
		if (r === null || a === null) return;
		let o = /* @__PURE__ */ new Set();
		for (let e of t.projected) e.header || o.add(e.entry.key);
		if (o.has(a)) return;
		let s = n.filter((e) => !e.header).map((e) => e.entry), c = s.findIndex((e) => e.key === a), l = c < 0 ? void 0 : s.slice(c + 1).find((e) => o.has(e.key)) ?? s.slice(0, c).reverse().find((e) => o.has(e.key));
		if (i?.element?.removeAttribute(je), l === void 0) {
			r.removeAttribute(Me), r.removeAttribute("aria-activedescendant");
			return;
		}
		l.element instanceof HTMLElement ? Su(r, H(e).filter((e) => e instanceof HTMLElement), l.element, null, !1) : r.setAttribute(Me, l.key);
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
		let i = n.entries[r].element, a = Qu(e), o = H(e).filter((e) => e instanceof HTMLElement), s = a !== null && i instanceof HTMLElement ? Yu(a, o, i) : null;
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
		return i === null || a === void 0 ? !1 : (a.item = AW(a.item, n, r), n.length === 0 && a.element !== null && (this.dropRow(e, a.element), a.element = null), !0);
	}
	project(e, t) {
		let n = this.options.metadata.getItemsFilterSortMetadata(t.componentId), r = ww(e), i = this.options.templates.getGroupTemplate(t.componentId), a = Ow(n, this.options.state, r), o = t.entries;
		if ((n !== void 0 && n.filters.length > 0 || (r?.filters ?? []).length > 0) && (o = o.filter((e) => Ew(n, e.item, this.options.state, r))), !(i !== void 0 && o.some((e) => DG(e) !== ""))) {
			a.length > 0 && (o = [...o].sort((e, t) => Aw(e.item, t.item, a))), t.projected = o.map((e) => ({
				entry: e,
				header: !1
			}));
			return;
		}
		let { buckets: s, order: c } = jz(o, DG, t.groupOrder);
		t.groupOrder = c;
		let l = [];
		for (let e of c) {
			let t = s.get(e);
			a.length > 0 && (t = [...t].sort((e, t) => Aw(e.item, t.item, a))), e !== "" && l.push({
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
		let t = dl(e.target);
		t !== null && V(t) === "virtualized" && this.relayout(t);
	}
	handleResize(e) {
		for (let t of e) {
			let e = t.target;
			e.isConnected && V(e) === "virtualized" ? window.requestAnimationFrame(() => this.relayout(e)) : this.resizes?.unobserve(e);
		}
	}
	relayout(e) {
		let t = this.getState(e);
		t !== null && t.scheduled === 0 && (this.layout(e, t), t.scheduled = window.setTimeout(() => {
			t.scheduled = 0, this.layout(e, t);
		}, xG));
	}
	layout(e, t) {
		let n = t.projected, r = getComputedStyle(e), i = NG(r), a = n.map((e) => this.pitchOf(t, e) + i), o = n.length, s = t.across, c = AG(e) ? jG(n, a, s) : null, l = c?.pitches ?? a, u = l.length, d = 0, f = u;
		if ((c !== null || OG(e)) && u > 0) {
			let i = PG(r.paddingTop), a = fl(e), o = wG(e, t, n, l, s, a.top - i, i), c = o + a.height, p = 0;
			d = u;
			for (let e = 0; e < u; e++) {
				let t = p + l[e];
				if (d === u && t > o && (d = e), p >= c) {
					f = e;
					break;
				}
				p = t;
			}
			d === u && (d = Math.max(0, u - 1)), d = Math.max(0, d - bG), f = Math.min(u, f + bG);
		}
		let p = c === null ? d : c.starts[d] ?? o, m = c === null ? f : f < u ? c.starts[f] : o, h = this.options.renderer.getAncestorStack(e), g = [], _ = [], v = -1, ee = !1;
		for (let r = 0; r < o; r++) {
			let i = n[r];
			i.header || v++;
			let a = r >= p && r < m, o = (i.header ? t.headers.get(DG(i.entry)) ?? null : i.entry)?.element ?? null;
			if (!a) {
				o !== null && (this.dropRow(e, o), TG(t, i, null), ee = !0);
				continue;
			}
			if (o !== null) {
				i.header && Pz(o, i.entry.key), g.push(o), i.header || _.push([o, v]);
				continue;
			}
			let s = i.header ? this.renderHeader(t, i.entry, h) : this.renderRow(t, i.entry, h);
			s !== null && (i.header || td(e, s), TG(t, i, s), g.push(s), i.header || _.push([s, v]), ee = !0);
		}
		let te = new Set(g);
		for (let n of t.entries) n.element !== null && !te.has(n.element) && (this.dropRow(e, n.element), n.element = null, ee = !0);
		for (let t of H(e)) te.has(t) || (this.dropRow(e, t), ee = !0);
		for (let t of e.querySelectorAll(`:scope > [${Ct}]`)) te.has(t) || (t.remove(), ee = !0);
		for (let e of t.headers.values()) e.element !== null && !te.has(e.element) && (e.element = null);
		let ne = FG(l, 0, d), re = FG(l, f, u);
		Rz(e, [...g, ...rw(iw(e))]), Lz(e, "top", ne > 0 ? ne - i : 0), Lz(e, Fz, re > 0 ? re - i : 0), aw(e, t.componentId, this.options.templates, this.options.renderer, o > 0), WW(e, _, v + 1), (ee || t.first !== p || t.last !== m) && (t.first = p, t.last = m, this.options.dom.invalidate(e)), t.laidOut = n, t.pitches = l, t.laidAcross = s, t.firstLine = d, t.lastLine = f, this.measure(t, n, p, m), c !== null && (t.across = MG(e, r, t.tileWidth) ?? t.across, t.across !== s && this.layout(e, t));
	}
	renderRow(e, t, n) {
		return vG(e.componentId, t.item, t.key, n, this.options);
	}
	renderHeader(e, t, n) {
		let r = this.options.templates.getGroupTemplate(e.componentId);
		return r === void 0 ? null : Nz(r, this.options.renderer, t.item, t.key, n);
	}
	measure(e, t, n, r) {
		let i = 0;
		for (let a = n; a < r && a < t.length; a++) {
			let n = t[a], r = n.header ? e.headers.get(DG(n.entry)) : n.entry, o = r?.element;
			if (r == null || o == null) continue;
			let s = hl(o);
			s.height <= 0 || (CG(n.header ? e.headerHeights : e.itemHeights, r.height, s.height), r.height = s.height, n.header || (i = Math.max(i, s.width)));
		}
		i > 0 && (e.tileWidth = i), e.itemHeights.count > 0 && (e.itemEstimate = e.itemHeights.sum / e.itemHeights.count), e.headerHeights.count > 0 && (e.headerEstimate = e.headerHeights.sum / e.headerHeights.count);
	}
	pitchOf(e, t) {
		return t.header ? e.headers.get(DG(t.entry))?.height ?? e.headerEstimate : t.entry.height ?? e.itemEstimate;
	}
	getState(e) {
		let t = this.states.get(e);
		if (t !== void 0) return t;
		let n = ga(e);
		if (n === null) return s("a virtualized items host is not inside an addressable component.", e), null;
		let r = n.componentId, i = [], a = /* @__PURE__ */ new Map();
		for (let t of H(e)) {
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
function CG(e, t, n) {
	t === null ? (e.sum += n, e.count++) : e.sum += n - t;
}
function wG(e, t, n, r, i, a, o) {
	if (t.laidOut !== n || t.laidAcross !== i || t.pitches.length !== r.length || a <= 0) return a;
	let s = 0, c = 0;
	for (let e = 0; e < r.length; e++) {
		let n = e >= t.firstLine && e < t.lastLine ? r[e] : t.pitches[e];
		if (s + n > a) break;
		s += n, c += r[e];
	}
	let l = c - s;
	return Math.abs(l) < .5 ? a : (pl(e, a + l + o), a + l);
}
function TG(e, t, n) {
	if (!t.header) {
		t.entry.element = n;
		return;
	}
	let r = DG(t.entry), i = e.headers.get(r);
	i === void 0 ? e.headers.set(r, {
		element: n,
		height: null
	}) : i.element = n;
}
function EG(e) {
	let t = gw(e.item, "CanSelect");
	return t.ok && t.value === !1;
}
function DG(e) {
	let t = gw(e.item, "Group");
	return t.ok && typeof t.value == "string" ? t.value : "";
}
function OG(e) {
	let t = e.parentElement;
	return t !== null && (t.classList.contains("ui-table__scroll") || t.classList.contains("ui-items-view--stack") && t.classList.contains("ui-orientation--vertical"));
}
function kG(e, t) {
	let n = 0;
	for (; n + 1 < e.length && e[n + 1] <= t;) n++;
	return n;
}
function AG(e) {
	return e.parentElement?.classList.contains("ui-items-view--wrap") === !0;
}
function jG(e, t, n) {
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
function MG(e, t, n) {
	let r = e.clientWidth - PG(t.paddingLeft) - PG(t.paddingRight);
	if (n === null || n <= 0 || r <= 0) return null;
	let i = PG(t.columnGap);
	return Math.max(1, Math.floor((r + i + .5) / (n + i)));
}
function NG(e) {
	return PG(e.rowGap);
}
function PG(e) {
	let t = Number.parseFloat(e);
	return Number.isFinite(t) ? t : 0;
}
function FG(e, t, n) {
	let r = 0;
	for (let i = t; i < n; i++) r += e[i];
	return r;
}
//#endregion
//#region src/items/items-template-registry.ts
var IG = "data-ui-template", LG = "default", RG = class {
	dom;
	templateComponentIds = null;
	constructor(e) {
		this.dom = e;
	}
	getTemplate(e, t) {
		let n = t ?? LG, r = this.findTemplate(e, n);
		return r === void 0 ? n === LG ? void 0 : this.getTemplate(e, null) : r;
	}
	getVariantTemplate(e, t) {
		return this.findTemplate(e, t);
	}
	findTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		if (n === null) return;
		let r = n.querySelectorAll(`:scope > template[${IG}]`);
		for (let e of r) if (e.getAttribute(IG) === t) return e;
	}
	isTemplateComponent(e) {
		return this.templateComponentIds ??= zG(this.dom.root), this.templateComponentIds.has(e);
	}
	getEmptyTemplate(e) {
		return this.getMarkedTemplate(e, bt);
	}
	getGroupTemplate(e) {
		return this.getMarkedTemplate(e, xt);
	}
	getMarkedTemplate(e, t) {
		return this.dom.findComponent(e, [])?.querySelector(`:scope > template[${t}]`) ?? void 0;
	}
};
function zG(e) {
	let t = /* @__PURE__ */ new Set();
	return is(e, (n) => {
		if (n !== e) for (let e of n.querySelectorAll(S)) {
			let n = T(e);
			n > 0 && t.add(n);
		}
	}), t;
}
//#endregion
//#region src/rendering/theme-colors.ts
function BG(e, t) {
	let n = e.querySelector(`style[${Tr}]`);
	if (t.length === 0) {
		n?.remove();
		return;
	}
	if (n !== null) {
		n.textContent !== t && (n.textContent = t);
		return;
	}
	let r = document.createElement("style");
	r.setAttribute(Tr, ""), r.textContent = t, e.insertBefore(r, e.querySelector("style")?.nextElementSibling ?? null);
}
//#endregion
//#region src/metadata/metadata-reader.ts
var VG = "script[type='application/json'][data-ui-metadata]";
function HG(e = document) {
	let t = e.querySelector(VG);
	if (t === null) return UG();
	let n = t.textContent?.trim() ?? "";
	if (n.length === 0) return UG();
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
function UG() {
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
var WG = "script[type='application/json'][data-ui-hydration]";
function GG(e) {
	return e !== null && (Ao(e.title) || Ao(e.changes));
}
function KG(e = document) {
	let t = e.querySelector(WG)?.textContent?.trim() ?? "";
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
var qG = "reconnecting";
async function JG(e, t, n, r) {
	for (let i = 0;; i++) try {
		return await e();
	} catch (e) {
		if (t()) return s("attaching the runtime failed as the connection dropped again; the reconnect attaches.", e), qG;
		if (i >= n.length) return c("attaching the runtime failed after retrying; giving up.", e), null;
		s("attaching the runtime failed; retrying.", {
			attempt: i + 1,
			error: e
		}), await r(n[i]);
	}
}
//#endregion
//#region src/transport/reader-time-zone.ts
function YG(e = () => Intl.DateTimeFormat().resolvedOptions().timeZone) {
	try {
		let t = e();
		return typeof t == "string" && t.length > 0 ? t : null;
	} catch {
		return null;
	}
}
function XG(e, t, n) {
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
var ZG = "/_ne/", QG = 3e3;
function $G(e, t, n) {
	let r = e.getAttribute(Cr);
	if (r === null || !("serviceWorker" in navigator)) return;
	let i = navigator.serviceWorker;
	if (XG(i, t, n), e.hasAttribute("data-ui-service-worker-imported")) return () => tK(i.ready);
	let a = i.register(r, { scope: ZG }).then(eK).catch((e) => {
		s("registering the notification service worker failed; notifications are the page's own.", e);
	});
	return () => a;
}
function eK(e) {
	let t = e.installing ?? e.waiting;
	return e.active !== null || t === null ? Promise.resolve(e) : new Promise((n) => {
		t.addEventListener("statechange", () => {
			t.state === "activated" && n(e);
		});
	});
}
function tK(e) {
	return Promise.race([e, new Promise((e) => setTimeout(() => e(void 0), QG))]);
}
//#endregion
//#region src/runtime/reload-guard.ts
var nK = "ne-standard-ui:reloaded-view";
function rK(e, t, n) {
	if (!t) return "no-cookie";
	if (oK(n) === e) return "asked-again";
	try {
		n?.setItem(nK, e);
	} catch {}
	return "reload";
}
function iK(e) {
	try {
		e?.removeItem(nK);
	} catch {}
}
function aK() {
	try {
		return window.sessionStorage;
	} catch {
		return null;
	}
}
function oK(e) {
	try {
		return e?.getItem(nK) ?? null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/runtime/connection-watch.ts
var sK = 2e3, cK = class {
	root;
	notifications;
	graceMilliseconds;
	grace = null;
	notice = null;
	given = !1;
	constructor(e) {
		this.root = e.root, this.notifications = e.notifications, this.graceMilliseconds = e.graceMilliseconds ?? sK, e.connection.onReconnecting(() => this.reconnecting()), e.connection.onReconnected(() => this.reconnected());
	}
	reconnecting() {
		this.given || this.grace !== null || this.notice !== null || (this.grace = window.setTimeout(() => this.showReconnecting(), this.graceMilliseconds));
	}
	showReconnecting() {
		this.grace = null, this.root.setAttribute(Fr, "reconnecting"), this.notice = this.notifications.show({
			message: E.text("ui.connection.reconnecting"),
			sticky: !0,
			connection: !0
		});
	}
	reconnected() {
		this.given || (this.clear(), this.root.removeAttribute(Fr));
	}
	clear() {
		this.grace !== null && (window.clearTimeout(this.grace), this.grace = null), this.notice !== null && (this.notifications.dismiss(this.notice), this.notice = null);
	}
	lost() {
		this.given = !0, this.clear(), this.root.setAttribute(Fr, "lost");
	}
}, lK = "/_ne/values", uK = 32768;
uK / 4;
var dK = 3e4;
function fK(e) {
	let t = JSON.stringify(e);
	if (t === void 0 || t.length * 3 <= 8192) return null;
	let n = new TextEncoder().encode(t);
	return n.byteLength > 8192 ? n : null;
}
function pK(e) {
	return e?.updates?.some((e) => typeof e.valueToken == "string") === !0;
}
async function mK(e, t = null, n = dK) {
	if (e === void 0 || !pK(e)) return e;
	let r = await Promise.all((e.updates ?? []).map(async (e) => {
		let r = e.valueToken;
		if (typeof r != "string") return e;
		let i = t === null ? "" : `?instance=${encodeURIComponent(t)}`, a = await fetch(`${lK}/${encodeURIComponent(r)}${i}`, {
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
async function hK(e) {
	let t = await fetch(lK, {
		method: "POST",
		body: e,
		headers: { "Content-Type": "application/json" },
		credentials: "same-origin",
		signal: AbortSignal.timeout(dK)
	});
	if (!t.ok) throw Error(`Staging a large value failed with status ${t.status}.`);
	let n = (await t.json())?.token;
	if (n === void 0 || n.length === 0) throw Error("Staging a large value answered with no token.");
	return n;
}
//#endregion
//#region src/transport/command-dispatcher.ts
var gK = class {
	transport;
	pendingKeys = /* @__PURE__ */ new Set();
	nextRequestId = 1;
	awaited = /* @__PURE__ */ new Map();
	staging = null;
	constructor(e) {
		this.transport = e;
	}
	isPending(e) {
		return this.pendingKeys.has(_K(vK(e)));
	}
	async dispatchAsync(e) {
		let t = vK(e), n = _K(t);
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
		let t = fK(e.dynamicParameters);
		if (t === null && this.staging === null) return this.transport.processEventAsync(e);
		let n = this.staging, r = t === null ? null : hK(t), i = () => {}, a = new Promise((e) => {
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
function _K(e) {
	return e.action === void 0 ? `${JSON.stringify(e.eventId)}:${JSON.stringify(e.dynamicParameters ?? [])}` : `action:${e.action}`;
}
function vK(e) {
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
var yK = class {
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
async function bK(e, t) {
	try {
		await e();
	} finally {
		t();
	}
}
//#endregion
//#region src/state/property-state-store.ts
var xK = class {
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
		return r.length > 0 ? (this.recordRows(i, r), this.removeUnplaced(i)) : t.length > 0 && !this.unplacedPathByEntry.has(i) && this.recordUnplaced(i, t), a !== void 0 && mf(a.value, n) ? !1 : (this.values.set(i, {
			reference: e,
			dynamicParameters: t,
			value: n
		}), !0);
	}
	entries() {
		return this.values.values();
	}
	forgetRows(e, t, n) {
		let r = SK(e, t);
		for (let e of n) this.forgetRow(r, e), this.forgetUnplaced(CK([...t, e]));
	}
	forgetHost(e, t) {
		this.forgetScope(SK(e, t));
		let n = this.unplaced.get(CK(t));
		for (let e of [...n?.children ?? []]) this.forgetUnplaced(e);
	}
	clear() {
		this.values.clear(), this.scopes.clear(), this.unplaced.clear(), this.unplacedPathByEntry.clear();
	}
	recordRows(e, t) {
		let n = null;
		for (let [r, i] of t.entries()) {
			let t = SK(i.host, i.hostParameters), a = this.rowState(t, i.key);
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
		let n = this.unplacedNode(CK([]), null), r = "";
		for (let e = 1; e <= t.length; e++) r = CK(t.slice(0, e)), n.children.add(r), n = this.unplacedNode(r, CK(t.slice(0, e - 1)));
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
		return `${w(e.componentId)}:${e.propertyId}:${wK(t)}`;
	}
};
function SK(e, t) {
	return JSON.stringify([e, ...t.map((e) => String(e ?? ""))]);
}
function CK(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function wK(e) {
	if (e.length === 0) return "";
	try {
		return JSON.stringify(e);
	} catch {
		return String(e);
	}
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Errors.js
var TK = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(`${e}: Status code '${t}'`), this.statusCode = t, this.__proto__ = n;
	}
}, EK = class extends Error {
	constructor(e = "A timeout occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, DK = class extends Error {
	constructor(e = "An abort occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, OK = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "UnsupportedTransportError", this.__proto__ = n;
	}
}, kK = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "DisabledTransportError", this.__proto__ = n;
	}
}, AK = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "FailedToStartTransportError", this.__proto__ = n;
	}
}, jK = class extends Error {
	constructor(e) {
		let t = new.target.prototype;
		super(e), this.errorType = "FailedToNegotiateWithServerError", this.__proto__ = t;
	}
}, MK = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.innerErrors = t, this.__proto__ = n;
	}
}, NK = class {
	constructor(e, t, n) {
		this.statusCode = e, this.statusText = t, this.content = n;
	}
}, PK = class {
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
var FK = class {
	constructor() {}
	log(e, t) {}
};
FK.instance = new FK();
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/pkg-version.js
var IK = "10.0.11", J = class {
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
function LK(e, t) {
	let n = "";
	return zK(e) ? (n = `Binary data of length ${e.byteLength}`, t && (n += `. Content: '${RK(e)}'`)) : typeof e == "string" && (n = `String data of length ${e.length}`, t && (n += `. Content: '${e}'`)), n;
}
function RK(e) {
	let t = new Uint8Array(e), n = "";
	return t.forEach((e) => {
		n += `0x${e < 16 ? "0" : ""}${e.toString(16)} `;
	}), n.substring(0, n.length - 1);
}
function zK(e) {
	return e && typeof ArrayBuffer < "u" && (e instanceof ArrayBuffer || e.constructor && e.constructor.name === "ArrayBuffer");
}
async function BK(e, t, n, r, i, a) {
	let o = {}, [s, c] = WK();
	o[s] = c, e.log(q.Trace, `(${t} transport) sending data. ${LK(i, a.logMessageContent)}.`);
	let l = zK(i) ? "arraybuffer" : "text", u = await n.post(r, {
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
function VK(e) {
	return e === void 0 ? new UK(q.Information) : e === null ? FK.instance : e.log === void 0 ? new UK(e) : e;
}
var HK = class {
	constructor(e, t) {
		this._subject = e, this._observer = t;
	}
	dispose() {
		let e = this._subject.observers.indexOf(this._observer);
		e > -1 && this._subject.observers.splice(e, 1), this._subject.observers.length === 0 && this._subject.cancelCallback && this._subject.cancelCallback().catch((e) => {});
	}
}, UK = class {
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
function WK() {
	let e = "X-SignalR-User-Agent";
	return Y.isNode && (e = "User-Agent"), [e, GK(IK, KK(), JK(), qK())];
}
function GK(e, t, n, r) {
	let i = "Microsoft SignalR/", a = e.split(".");
	return i += `${a[0]}.${a[1]}`, i += ` (${e}; `, i += t && t !== "" ? `${t}; ` : "Unknown OS; ", i += `${n}`, i += r ? `; ${r}` : "; Unknown Runtime Version", i += ")", i;
}
/*#__PURE__*/ function KK() {
	if (Y.isNode) switch (process.platform) {
		case "win32": return "Windows NT";
		case "darwin": return "macOS";
		case "linux": return "Linux";
		default: return process.platform;
	}
	else return "";
}
/*#__PURE__*/ function qK() {
	if (Y.isNode) return process.versions.node;
}
function JK() {
	return Y.isNode ? "NodeJS" : "Browser";
}
function YK(e) {
	return e.stack ? e.stack : e.message ? e.message : `${e}`;
}
function XK() {
	if (typeof globalThis < "u") return globalThis;
	if (typeof self < "u") return self;
	if (typeof window < "u") return window;
	if (typeof global < "u") return global;
	throw Error("could not find global");
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js
var ZK = class extends PK {
	constructor(t) {
		if (super(), this._logger = t, typeof fetch > "u" || Y.isNode) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._jar = new (t("tough-cookie")).CookieJar(), this._fetchType = typeof fetch > "u" ? t("node-fetch") : fetch, this._fetchType = t("fetch-cookie")(this._fetchType, this._jar);
		} else this._fetchType = fetch.bind(XK());
		if (typeof AbortController > "u") {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._abortControllerType = t("abort-controller");
		} else this._abortControllerType = AbortController;
	}
	async send(e) {
		if (e.abortSignal && e.abortSignal.aborted) throw new DK();
		if (!e.method) throw Error("No method defined.");
		if (!e.url) throw Error("No url defined.");
		let t = new this._abortControllerType(), n;
		e.abortSignal && (e.abortSignal.onabort = () => {
			t.abort(), n = new DK();
		});
		let r = null;
		if (e.timeout) {
			let i = e.timeout;
			r = setTimeout(() => {
				t.abort(), this._logger.log(q.Warning, "Timeout from HTTP request."), n = new EK();
			}, i);
		}
		e.content === "" && (e.content = void 0), e.content && (e.headers = e.headers || {}, zK(e.content) ? e.headers["Content-Type"] = "application/octet-stream" : e.headers["Content-Type"] = "text/plain;charset=UTF-8");
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
		if (!i.ok) throw new TK(await QK(i, "text") || i.statusText, i.status);
		let a = await QK(i, e.responseType);
		return new NK(i.status, i.statusText, a);
	}
	getCookieString(e) {
		let t = "";
		return Y.isNode && this._jar && this._jar.getCookies(e, (e, n) => t = n.join("; ")), t;
	}
};
function QK(e, t) {
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
var $K = class extends PK {
	constructor(e) {
		super(), this._logger = e;
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new DK()) : e.method ? e.url ? new Promise((t, n) => {
			let r = new XMLHttpRequest();
			r.open(e.method, e.url, !0), r.withCredentials = e.withCredentials === void 0 || e.withCredentials, r.setRequestHeader("X-Requested-With", "XMLHttpRequest"), e.content === "" && (e.content = void 0), e.content && (zK(e.content) ? r.setRequestHeader("Content-Type", "application/octet-stream") : r.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"));
			let i = e.headers;
			i && Object.keys(i).forEach((e) => {
				r.setRequestHeader(e, i[e]);
			}), e.responseType && (r.responseType = e.responseType), e.abortSignal && (e.abortSignal.onabort = () => {
				r.abort(), n(new DK());
			}), e.timeout && (r.timeout = e.timeout), r.onload = () => {
				e.abortSignal && (e.abortSignal.onabort = null), r.status >= 200 && r.status < 300 ? t(new NK(r.status, r.statusText, r.response || r.responseText)) : n(new TK(r.response || r.responseText || r.statusText, r.status));
			}, r.onerror = () => {
				this._logger.log(q.Warning, `Error from HTTP request. ${r.status}: ${r.statusText}.`), n(new TK(r.statusText, r.status));
			}, r.ontimeout = () => {
				this._logger.log(q.Warning, "Timeout from HTTP request."), n(new EK());
			}, r.send(e.content);
		}) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
}, eq = class extends PK {
	constructor(e) {
		if (super(), typeof fetch < "u" || Y.isNode) this._httpClient = new ZK(e);
		else if (typeof XMLHttpRequest < "u") this._httpClient = new $K(e);
		else throw Error("No usable HttpClient found.");
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new DK()) : e.method ? e.url ? this._httpClient.send(e) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
	getCookieString(e) {
		return this._httpClient.getCookieString(e);
	}
}, tq = class e {
	static write(t) {
		return `${t}${e.RecordSeparator}`;
	}
	static parse(t) {
		if (t[t.length - 1] !== e.RecordSeparator) throw Error("Message is incomplete.");
		let n = t.split(e.RecordSeparator);
		return n.pop(), n;
	}
};
tq.RecordSeparatorCode = 30, tq.RecordSeparator = String.fromCharCode(tq.RecordSeparatorCode);
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js
var nq = class {
	writeHandshakeRequest(e) {
		return tq.write(JSON.stringify(e));
	}
	parseHandshakeResponse(e) {
		let t, n;
		if (zK(e)) {
			let r = new Uint8Array(e), i = r.indexOf(tq.RecordSeparatorCode);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = String.fromCharCode.apply(null, Array.prototype.slice.call(r.slice(0, a))), n = r.byteLength > a ? r.slice(a).buffer : null;
		} else {
			let r = e, i = r.indexOf(tq.RecordSeparator);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = r.substring(0, a), n = r.length > a ? r.substring(a) : null;
		}
		let r = tq.parse(t), i = JSON.parse(r[0]);
		if (i.type) throw Error("Expected a handshake response from the server.");
		return [n, i];
	}
}, X;
(function(e) {
	e[e.Invocation = 1] = "Invocation", e[e.StreamItem = 2] = "StreamItem", e[e.Completion = 3] = "Completion", e[e.StreamInvocation = 4] = "StreamInvocation", e[e.CancelInvocation = 5] = "CancelInvocation", e[e.Ping = 6] = "Ping", e[e.Close = 7] = "Close", e[e.Ack = 8] = "Ack", e[e.Sequence = 9] = "Sequence";
})(X ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Subject.js
var rq = class {
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
		return this.observers.push(e), new HK(this, e);
	}
}, iq = class {
	constructor(e, t, n) {
		this._bufferSize = 1e5, this._messages = [], this._totalMessageCount = 0, this._waitForSequenceMessage = !1, this._nextReceivingSequenceId = 1, this._latestReceivedSequenceId = 0, this._bufferedByteCount = 0, this._reconnectInProgress = !1, this._protocol = e, this._connection = t, this._bufferSize = n;
	}
	async _send(e) {
		let t = this._protocol.writeMessage(e), n = Promise.resolve();
		if (this._isInvocationMessage(e)) {
			this._totalMessageCount++;
			let e = () => {}, r = () => {};
			zK(t) ? this._bufferedByteCount += t.byteLength : this._bufferedByteCount += t.length, this._bufferedByteCount >= this._bufferSize && (n = new Promise((t, n) => {
				e = t, r = n;
			})), this._messages.push(new aq(t, this._totalMessageCount, e, r));
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
			if (r._id <= e.sequenceId) t = n, zK(r._message) ? this._bufferedByteCount -= r._message.byteLength : this._bufferedByteCount -= r._message.length, r._resolver();
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
}, aq = class {
	constructor(e, t, n, r) {
		this._message = e, this._id = t, this._resolver = n, this._rejector = r;
	}
}, oq = 3e4, sq = 15e3, cq = 1e5, Z;
(function(e) {
	e.Disconnected = "Disconnected", e.Connecting = "Connecting", e.Connected = "Connected", e.Disconnecting = "Disconnecting", e.Reconnecting = "Reconnecting";
})(Z ||= {});
var lq = class e {
	static create(t, n, r, i, a, o, s) {
		return new e(t, n, r, i, a, o, s);
	}
	constructor(e, t, n, r, i, a, o) {
		this._nextKeepAlive = 0, this._freezeEventListener = () => {
			this._logger.log(q.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
		}, J.isRequired(e, "connection"), J.isRequired(t, "logger"), J.isRequired(n, "protocol"), this.serverTimeoutInMilliseconds = i ?? oq, this.keepAliveIntervalInMilliseconds = a ?? sq, this._statefulReconnectBufferSize = o ?? cq, this._logger = t, this._protocol = n, this.connection = e, this._reconnectPolicy = r, this._handshakeProtocol = new nq(), this.connection.onreceive = (e) => this._processIncomingData(e), this.connection.onclose = (e) => this._connectionClosed(e), this._callbacks = {}, this._methods = {}, this._closedCallbacks = [], this._reconnectingCallbacks = [], this._reconnectedCallbacks = [], this._invocationId = 0, this._receivedHandshakeResponse = !1, this._connectionState = Z.Disconnected, this._connectionStarted = !1, this._cachedPingMessage = this._protocol.writeMessage({ type: X.Ping });
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
			this.connection.features.reconnect && (this._messageBuffer = new iq(this._protocol, this.connection, this._statefulReconnectBufferSize), this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer), this.connection.features.resend = () => {
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
		return this._connectionState = Z.Disconnecting, this._logger.log(q.Debug, "Stopping HubConnection."), this._reconnectDelayHandle ? (this._logger.log(q.Debug, "Connection stopped during reconnect delay. Done reconnecting."), clearTimeout(this._reconnectDelayHandle), this._reconnectDelayHandle = void 0, this._completeClose(), Promise.resolve()) : (t === Z.Connected && this._sendCloseMessage(), this._cleanupTimeout(), this._cleanupPingTimer(), this._stopDuringStartError = e || new DK("The connection was stopped before the hub handshake could complete."), this.connection.stop(e));
	}
	async _sendCloseMessage() {
		try {
			await this._sendWithProtocol(this._createCloseMessage());
		} catch {}
	}
	stream(e, ...t) {
		let [n, r] = this._replaceStreamingParams(t), i = this._createStreamInvocation(e, t, r), a, o = new rq();
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
						this._logger.log(q.Error, `Invoke client method threw error: ${YK(e)}`);
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
							this._logger.log(q.Error, `Stream callback threw error: ${YK(e)}`);
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
		this._logger.log(q.Debug, `HubConnection.connectionClosed(${e}) called while in state ${this._connectionState}.`), this._stopDuringStartError = this._stopDuringStartError || e || new DK("The underlying connection was closed before the hub handshake could complete."), this._handshakeResolver && this._handshakeResolver(), this._cancelCallbacksWithError(e || /* @__PURE__ */ Error("Invocation canceled due to the underlying connection being closed.")), this._cleanupTimeout(), this._cleanupPingTimer(), this._connectionState === Z.Disconnecting ? this._completeClose(e) : this._connectionState === Z.Connected && this._reconnectPolicy ? this._reconnect(e) : this._connectionState === Z.Connected && this._completeClose(e);
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
				this._logger.log(q.Error, `Stream 'error' callback called with '${e}' threw error: ${YK(t)}`);
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
}, uq = [
	0,
	2e3,
	1e4,
	3e4,
	null
], dq = class {
	constructor(e) {
		this._retryDelays = e === void 0 ? uq : [...e, null];
	}
	nextRetryDelayInMilliseconds(e) {
		return this._retryDelays[e.previousRetryCount];
	}
}, fq = class {};
fq.Authorization = "Authorization", fq.Cookie = "Cookie";
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js
var pq = class extends PK {
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
		e.headers ||= {}, this._accessToken ? e.headers[fq.Authorization] = `Bearer ${this._accessToken}` : this._accessTokenFactory && e.headers[fq.Authorization] && delete e.headers[fq.Authorization];
	}
	getCookieString(e) {
		return this._innerClient.getCookieString(e);
	}
}, mq;
(function(e) {
	e[e.None = 0] = "None", e[e.WebSockets = 1] = "WebSockets", e[e.ServerSentEvents = 2] = "ServerSentEvents", e[e.LongPolling = 4] = "LongPolling";
})(mq ||= {});
var hq;
(function(e) {
	e[e.Text = 1] = "Text", e[e.Binary = 2] = "Binary";
})(hq ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AbortController.js
var gq = class {
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
}, _q = class {
	get pollAborted() {
		return this._pollAbort.aborted;
	}
	constructor(e, t, n) {
		this._httpClient = e, this._logger = t, this._pollAbort = new gq(), this._options = n, this._running = !1, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		if (J.isRequired(e, "url"), J.isRequired(t, "transferFormat"), J.isIn(t, hq, "transferFormat"), this._url = e, this._logger.log(q.Trace, "(LongPolling transport) Connecting."), t === hq.Binary && typeof XMLHttpRequest < "u" && typeof new XMLHttpRequest().responseType != "string") throw Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
		let [n, r] = WK(), i = {
			[n]: r,
			...this._options.headers
		}, a = {
			abortSignal: this._pollAbort.signal,
			headers: i,
			timeout: 1e5,
			withCredentials: this._options.withCredentials
		};
		t === hq.Binary && (a.responseType = "arraybuffer");
		let o = `${e}&_=${Date.now()}`;
		this._logger.log(q.Trace, `(LongPolling transport) polling: ${o}.`);
		let s = await this._httpClient.get(o, a);
		s.statusCode === 200 ? this._running = !0 : (this._logger.log(q.Error, `(LongPolling transport) Unexpected response code: ${s.statusCode}.`), this._closeError = new TK(s.statusText || "", s.statusCode), this._running = !1), this._receiving = this._poll(this._url, a);
	}
	async _poll(e, t) {
		try {
			for (; this._running;) try {
				let n = `${e}&_=${Date.now()}`;
				this._logger.log(q.Trace, `(LongPolling transport) polling: ${n}.`);
				let r = await this._httpClient.get(n, t);
				r.statusCode === 204 ? (this._logger.log(q.Information, "(LongPolling transport) Poll terminated by server."), this._running = !1) : r.statusCode === 200 ? r.content ? (this._logger.log(q.Trace, `(LongPolling transport) data received. ${LK(r.content, this._options.logMessageContent)}.`), this.onreceive && this.onreceive(r.content)) : this._logger.log(q.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._logger.log(q.Error, `(LongPolling transport) Unexpected response code: ${r.statusCode}.`), this._closeError = new TK(r.statusText || "", r.statusCode), this._running = !1);
			} catch (e) {
				this._running ? e instanceof EK ? this._logger.log(q.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._closeError = e, this._running = !1) : this._logger.log(q.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
			}
		} finally {
			this._logger.log(q.Trace, "(LongPolling transport) Polling complete."), this.pollAborted || this._raiseOnClose();
		}
	}
	async send(e) {
		return this._running ? BK(this._logger, "LongPolling", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	async stop() {
		this._logger.log(q.Trace, "(LongPolling transport) Stopping polling."), this._running = !1, this._pollAbort.abort();
		try {
			await this._receiving, this._logger.log(q.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
			let e = {}, [t, n] = WK();
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
			i ? i instanceof TK && (i.statusCode === 404 ? this._logger.log(q.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.") : this._logger.log(q.Trace, `(LongPolling transport) Error sending a DELETE request: ${i}`)) : this._logger.log(q.Trace, "(LongPolling transport) DELETE request accepted.");
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
}, vq = class {
	constructor(e, t, n, r) {
		this._httpClient = e, this._accessToken = t, this._logger = n, this._options = r, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		return J.isRequired(e, "url"), J.isRequired(t, "transferFormat"), J.isIn(t, hq, "transferFormat"), this._logger.log(q.Trace, "(SSE transport) Connecting."), this._url = e, this._accessToken && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(this._accessToken)}`), new Promise((n, r) => {
			let i = !1;
			if (t !== hq.Text) {
				r(/* @__PURE__ */ Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
				return;
			}
			let a;
			if (Y.isBrowser || Y.isWebWorker) a = new this._options.EventSource(e, { withCredentials: this._options.withCredentials });
			else {
				let t = this._httpClient.getCookieString(e), n = {};
				n.Cookie = t;
				let [r, i] = WK();
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
						this._logger.log(q.Trace, `(SSE transport) data received. ${LK(e.data, this._options.logMessageContent)}.`), this.onreceive(e.data);
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
		return this._eventSource ? BK(this._logger, "SSE", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	stop() {
		return this._close(), Promise.resolve();
	}
	_close(e) {
		this._eventSource && (this._eventSource.close(), this._eventSource = void 0, this.onclose && this.onclose(e));
	}
}, yq = class {
	constructor(e, t, n, r, i, a) {
		this._logger = n, this._accessTokenFactory = t, this._logMessageContent = r, this._webSocketConstructor = i, this._httpClient = e, this.onreceive = null, this.onclose = null, this._headers = a;
	}
	async connect(e, t) {
		J.isRequired(e, "url"), J.isRequired(t, "transferFormat"), J.isIn(t, hq, "transferFormat"), this._logger.log(q.Trace, "(WebSockets transport) Connecting.");
		let n;
		return this._accessTokenFactory && (n = await this._accessTokenFactory()), new Promise((r, i) => {
			e = e.replace(/^http/, "ws");
			let a, o = this._httpClient.getCookieString(e), s = !1;
			if (Y.isNode || Y.isReactNative) {
				let t = {}, [r, i] = WK();
				t[r] = i, n && (t[fq.Authorization] = `Bearer ${n}`), o && (t[fq.Cookie] = o), a = new this._webSocketConstructor(e, void 0, { headers: {
					...t,
					...this._headers
				} });
			} else n && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(n)}`);
			a ||= new this._webSocketConstructor(e), t === hq.Binary && (a.binaryType = "arraybuffer"), a.onopen = (t) => {
				this._logger.log(q.Information, `WebSocket connected to ${e}.`), this._webSocket = a, s = !0, r();
			}, a.onerror = (e) => {
				let t = null;
				t = typeof ErrorEvent < "u" && e instanceof ErrorEvent ? e.error : "There was an error with the transport", this._logger.log(q.Information, `(WebSockets transport) ${t}.`);
			}, a.onmessage = (e) => {
				if (this._logger.log(q.Trace, `(WebSockets transport) data received. ${LK(e.data, this._logMessageContent)}.`), this.onreceive) try {
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
		return this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN ? (this._logger.log(q.Trace, `(WebSockets transport) sending data. ${LK(e, this._logMessageContent)}.`), this._webSocket.send(e), Promise.resolve()) : Promise.reject("WebSocket is not in the OPEN state");
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
}, bq = 100, xq = class {
	constructor(t, n = {}) {
		if (this._stopPromiseResolver = () => {}, this.features = {}, this._negotiateVersion = 1, J.isRequired(t, "url"), this._logger = VK(n.logger), this.baseUrl = this._resolveUrl(t), n ||= {}, n.logMessageContent = n.logMessageContent !== void 0 && n.logMessageContent, typeof n.withCredentials == "boolean" || n.withCredentials === void 0) n.withCredentials = n.withCredentials === void 0 || n.withCredentials;
		else throw Error("withCredentials option was not a 'boolean' or 'undefined' value");
		n.timeout = n.timeout === void 0 ? 1e5 : n.timeout;
		let r = null, i = null;
		if (Y.isNode && e !== void 0) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			r = t("ws"), i = t("eventsource");
		}
		!Y.isNode && typeof WebSocket < "u" && !n.WebSocket ? n.WebSocket = WebSocket : Y.isNode && !n.WebSocket && r && (n.WebSocket = r), !Y.isNode && typeof EventSource < "u" && !n.EventSource ? n.EventSource = EventSource : Y.isNode && !n.EventSource && i !== void 0 && (n.EventSource = i), this._httpClient = new pq(n.httpClient || new eq(this._logger), n.accessTokenFactory), this._connectionState = "Disconnected", this._connectionStarted = !1, this._options = n, this.onreceive = null, this.onclose = null;
	}
	async start(e) {
		if (e ||= hq.Binary, J.isIn(e, hq, "transferFormat"), this._logger.log(q.Debug, `Starting connection with transfer format '${hq[e]}'.`), this._connectionState !== "Disconnected") return Promise.reject(/* @__PURE__ */ Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
		if (this._connectionState = "Connecting", this._startInternalPromise = this._startInternal(e), await this._startInternalPromise, this._connectionState === "Disconnecting") {
			let e = "Failed to start the HttpConnection before stop() was called.";
			return this._logger.log(q.Error, e), await this._stopPromise, Promise.reject(new DK(e));
		}
		if (this._connectionState !== "Connected") {
			let e = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
			return this._logger.log(q.Error, e), Promise.reject(new DK(e));
		}
		this._connectionStarted = !0;
	}
	send(e) {
		return this._connectionState === "Connected" ? (this._sendQueue ||= new Cq(this.transport), this._sendQueue.send(e)) : Promise.reject(/* @__PURE__ */ Error("Cannot send data if the connection is not in the 'Connected' State."));
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
				if (this._options.transport === mq.WebSockets) this.transport = this._constructTransport(mq.WebSockets), await this._startTransport(t, e);
				else throw Error("Negotiation can only be skipped when using the WebSocket transport directly.");
			} else {
				let n = null, r = 0;
				do {
					if (n = await this._getNegotiationResponse(t), this._connectionState === "Disconnecting" || this._connectionState === "Disconnected") throw new DK("The connection was stopped during negotiation.");
					if (n.error) throw Error(n.error);
					if (n.ProtocolVersion) throw Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
					if (n.url && (t = n.url), n.accessToken) {
						let e = n.accessToken;
						this._accessTokenFactory = () => e, this._httpClient._accessToken = e, this._httpClient._accessTokenFactory = void 0;
					}
					r++;
				} while (n.url && r < bq);
				if (r === bq && n.url) throw Error("Negotiate redirection limit exceeded.");
				await this._createTransport(t, this._options.transport, n, e);
			}
			this.transport instanceof _q && (this.features.inherentKeepAlive = !0), this._connectionState === "Connecting" && (this._logger.log(q.Debug, "The HttpConnection connected successfully."), this._connectionState = "Connected");
		} catch (e) {
			return this._logger.log(q.Error, "Failed to start the connection: " + e), this._connectionState = "Disconnected", this.transport = void 0, this._stopPromiseResolver(), Promise.reject(e);
		}
	}
	async _getNegotiationResponse(e) {
		let t = {}, [n, r] = WK();
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
			return (!n.negotiateVersion || n.negotiateVersion < 1) && (n.connectionToken = n.connectionId), n.useStatefulReconnect && this._options._useStatefulReconnect !== !0 ? Promise.reject(new jK("Client didn't negotiate Stateful Reconnect but the server did.")) : n;
		} catch (e) {
			let t = "Failed to complete negotiation with the server: " + e;
			return e instanceof TK && e.statusCode === 404 && (t += " Either this is not a SignalR endpoint or there is a proxy blocking the connection."), this._logger.log(q.Error, t), Promise.reject(new jK(t));
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
					if (this._logger.log(q.Error, `Failed to start the transport '${n.transport}': ${e}`), s = void 0, a.push(new AK(`${n.transport} failed: ${e}`, mq[n.transport])), this._connectionState !== "Connecting") {
						let e = "Failed to select transport before stop() was called.";
						return this._logger.log(q.Debug, e), Promise.reject(new DK(e));
					}
				}
			}
		}
		return a.length > 0 ? Promise.reject(new MK(`Unable to connect to the server with any of the available transports. ${a.join(" ")}`, a)) : Promise.reject(/* @__PURE__ */ Error("None of the transports supported by the client are supported by the server."));
	}
	_constructTransport(e) {
		switch (e) {
			case mq.WebSockets:
				if (!this._options.WebSocket) throw Error("'WebSocket' is not supported in your environment.");
				return new yq(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
			case mq.ServerSentEvents:
				if (!this._options.EventSource) throw Error("'EventSource' is not supported in your environment.");
				return new vq(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
			case mq.LongPolling: return new _q(this._httpClient, this._logger, this._options);
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
		let i = mq[e.transport];
		if (i == null) return this._logger.log(q.Debug, `Skipping transport '${e.transport}' because it is not supported by this client.`), /* @__PURE__ */ Error(`Skipping transport '${e.transport}' because it is not supported by this client.`);
		if (Sq(t, i)) {
			if (e.transferFormats.map((e) => hq[e]).indexOf(n) >= 0) {
				if (i === mq.WebSockets && !this._options.WebSocket || i === mq.ServerSentEvents && !this._options.EventSource) return this._logger.log(q.Debug, `Skipping transport '${mq[i]}' because it is not supported in your environment.'`), new OK(`'${mq[i]}' is not supported in your environment.`, i);
				this._logger.log(q.Debug, `Selecting transport '${mq[i]}'.`);
				try {
					return this.features.reconnect = i === mq.WebSockets ? r : void 0, this._constructTransport(i);
				} catch (e) {
					return e;
				}
			}
			return this._logger.log(q.Debug, `Skipping transport '${mq[i]}' because it does not support the requested transfer format '${hq[n]}'.`), /* @__PURE__ */ Error(`'${mq[i]}' does not support ${hq[n]}.`);
		}
		return this._logger.log(q.Debug, `Skipping transport '${mq[i]}' because it was disabled by the client.`), new kK(`'${mq[i]}' is disabled by the client.`, i);
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
function Sq(e, t) {
	return !e || (t & e) !== 0;
}
var Cq = class e {
	constructor(e) {
		this._transport = e, this._buffer = [], this._executing = !0, this._sendBufferedData = new wq(), this._transportResult = new wq(), this._sendLoopPromise = this._sendLoop();
	}
	send(e) {
		return this._bufferData(e), this._transportResult ||= new wq(), this._transportResult.promise;
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
			this._sendBufferedData = new wq();
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
}, wq = class {
	constructor() {
		this.promise = new Promise((e, t) => [this._resolver, this._rejecter] = [e, t]);
	}
	resolve() {
		this._resolver();
	}
	reject(e) {
		this._rejecter(e);
	}
}, Tq = "json", Eq = class {
	constructor() {
		this.name = Tq, this.version = 2, this.transferFormat = hq.Text;
	}
	parseMessages(e, t) {
		if (typeof e != "string") throw Error("Invalid input for JSON hub protocol. Expected a string.");
		if (!e) return [];
		t === null && (t = FK.instance);
		let n = tq.parse(e), r = [];
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
		return tq.write(JSON.stringify(e));
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
}, Dq = {
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
function Oq(e) {
	let t = Dq[e.toLowerCase()];
	if (t !== void 0) return t;
	throw Error(`Unknown log level: ${e}`);
}
var kq = class {
	configureLogging(e) {
		if (J.isRequired(e, "logging"), Aq(e)) this.logger = e;
		else if (typeof e == "string") {
			let t = Oq(e);
			this.logger = new UK(t);
		} else this.logger = new UK(e);
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
		return this.reconnectPolicy = e ? Array.isArray(e) ? new dq(e) : e : new dq(), this;
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
		let t = new xq(this.url, e);
		return lq.create(t, this.logger || FK.instance, this.protocol || new Eq(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
	}
};
function Aq(e) {
	return e.log !== void 0;
}
//#endregion
//#region src/transport/attach-gate.ts
var jq = class extends Error {
	byServerError;
	constructor(e) {
		super("the connection to the server dropped under the call; it is reconnecting.", { cause: e }), this.name = "ConnectionDropped", this.byServerError = e instanceof Error && e.message.startsWith("Server returned an error on close");
	}
}, Mq = class {
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
}, Nq = 500;
function Pq(e) {
	let { changes: t, ...n } = e;
	return n;
}
function Fq() {
	return {};
}
function Iq(e) {
	return typeof e == "string" ? e : null;
}
var Lq = class {
	windowId;
	connection;
	started = !1;
	gate = new Mq();
	inbound;
	constructor(e, t, n = {}) {
		this.windowId = e, this.inbound = new yK(t), this.connection = new kq().withUrl(n.hubUrl ?? "/_ne/hub").withAutomaticReconnect([...n.reconnectDelays ?? [
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
		this.connection.on("ui.changes", this.inbound.pushed((t, n) => e(t, Iq(n))));
	}
	onCommandResult(e) {
		this.connection.on("ui.commandResult", this.inbound.pushed((t, n) => e(t, Iq(n))));
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
		return await this.invokeAsync("ProcessEventAsync", [e], (e) => this.inbound.answered(e, (e) => e.changes, Pq));
	}
	async requestLeaveAsync(e) {
		return await this.invokeAsync("RequestLeaveAsync", [{ target: e }], (e) => this.inbound.answered(e, (e) => e.changes, Pq));
	}
	async navigateInPlaceAsync(e) {
		return await this.invokeAsync("NavigateInPlaceAsync", [{ parameters: e }], (e) => this.inbound.answered(e, (e) => e.changes, Pq));
	}
	async processChangeSetAsync(e, t) {
		try {
			await this.invokeAsync("ProcessChangeSetAsync", [e], (e) => this.inbound.answered(e, (e) => e, Fq, t));
		} catch (e) {
			throw this.isReconnecting && this.gate.failure === null ? new jq(e) : e;
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
		await this.invokeAsync("RequestItemWindowAsync", [e], (e) => this.inbound.answered(e, (e) => e, Fq));
	}
	async invokeAsync(e, t, n) {
		let r = window.setTimeout(() => s("call waiting behind the attach.", { methodName: e }), Nq);
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
}, Rq = Promise.resolve(), zq = () => {}, Bq = uK * 3 / 4, Vq = 128, Hq = class {
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
		if (this.handed >= this.given) return Rq;
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
		for (; this.flight !== null;) await this.flight.catch(zq);
	}
	dispatchAsync(e, t) {
		let n = ++this.given, r = fK(e.value), i = r === null ? null : hK(r);
		return i?.catch(zq), new Promise((a, o) => {
			let s = Wq(e), c = this.queue.findIndex((e) => e.field === s), l = [{
				resolve: a,
				reject: o
			}], u = n;
			c >= 0 && (l = [...this.queue[c].settles, ...l], u = this.queue[c].sequence, this.queue.splice(c, 1));
			let d = r === null ? Uq(e) : Uq({
				...e,
				value: void 0
			}) + Vq;
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
		let i = n.length === 0 ? null : this.transport.processChangeSetAsync({ updates: n }, Gq(r));
		if (this.markHanded(t), i !== null) try {
			await i;
			for (let e of r) for (let t of e.settles) t.resolve();
		} catch (e) {
			if (e instanceof jq) {
				this.requeue(r, e);
				return;
			}
			for (let t of r) for (let n of t.settles) n.reject(e);
		}
	}
	takeBatch() {
		let e = 0, t = 0;
		for (; e < this.queue.length && (e === 0 || t + this.queue[e].bytes <= Bq);) t += this.queue[e].bytes, e++;
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
		let t = this.transport.whenAttached().then(() => hK(e));
		return t.catch(zq), t;
	}
	markHanded(e) {
		this.handed = Math.max(this.handed, e);
		for (let e = this.sentWaiters.length - 1; e >= 0; e--) {
			let t = this.sentWaiters[e];
			t.through <= this.handed && (this.sentWaiters.splice(e, 1), t.resolve());
		}
	}
};
function Uq(e) {
	return new TextEncoder().encode(JSON.stringify(e)).byteLength;
}
function Wq(e) {
	return `${e.componentId}:${e.propertyName}:${JSON.stringify(e.dynamicParameters)}`;
}
function Gq(e) {
	let t = e.map((e) => e.before).filter((e) => e !== void 0);
	if (t.length !== 0) return () => {
		for (let e of t) e();
	};
}
//#endregion
//#region src/updates/content-fills.ts
var Kq = "content-fills", qq = "content", Jq = "data-ui-root", Yq = "--ui-height", Xq = "var(--ui-fill-height";
function Zq(e) {
	let t = e.parentElement;
	if (t === null || t.getAttribute("data-ui-region") !== "content") return;
	let n = t.parentElement;
	if (n === null || !n.hasAttribute(Jq)) return;
	let r = e.style.getPropertyValue(Yq).trimStart().startsWith(Xq);
	n.hasAttribute("data-ui-content-fills") !== r && n.toggleAttribute(_n, r);
}
//#endregion
//#region src/updates/form-owner.ts
var Qq = "form-owner", $q = "ui-form-";
function eJ(e) {
	return $q + e.replace(/[ \t\n\f\r]/g, "_");
}
function tJ(e, t) {
	if (typeof t != "string" || t.trim().length === 0) {
		e.hasAttribute("form") && e.removeAttribute("form");
		return;
	}
	let n = eJ(t);
	rJ(n), e.getAttribute("form") !== n && e.setAttribute("form", n);
}
function nJ(e) {
	for (let t of e.querySelectorAll("[form]")) {
		let e = t.getAttribute("form");
		e !== null && e.startsWith($q) && rJ(e);
	}
}
function rJ(e) {
	let t = iJ();
	if (t.querySelector(`form[id="${wi(e)}"]`) !== null) return;
	let n = document.createElement("form");
	n.setAttribute("id", e), n.setAttribute("method", "dialog"), n.setAttribute("novalidate", ""), t.appendChild(n);
}
function iJ() {
	let e = document.body.querySelector(`[${qt}]`);
	if (e !== null) return e;
	let t = document.createElement("div");
	return t.setAttribute(qt, ""), t.setAttribute("hidden", ""), document.body.appendChild(t);
}
//#endregion
//#region src/interactions/legacy-commands.ts
var aJ = document;
function oJ() {
	try {
		return aJ.execCommand("copy");
	} catch {
		return !1;
	}
}
function sJ(e) {
	try {
		return typeof aJ.execCommand == "function" && aJ.execCommand("insertText", !1, e);
	} catch {
		return !1;
	}
}
//#endregion
//#region src/interactions/lightbox.ts
var cJ = "ui-lightbox", lJ = "ui-lightbox-title", uJ = new $_("data-ui-lightbox-part"), dJ = "data-ui-lightbox-set", fJ = "data-ui-lightbox-slot", pJ = "data-ui-lightbox-still", mJ = "--ui-lightbox-shift", hJ = 16, gJ = 1 / 5, _J = null, vJ = null, yJ = null;
function bJ(e, t, n) {
	let r = t.filter((e) => oh(e.source) !== null);
	if (r.length === 0) return s("show image effect carries no picture the page may fetch.", t), !1;
	_J ??= TJ(e), (_J.dialog.hasAttribute("hidden") || !_J.dialog.isConnected) && document.body.append(_J.dialog);
	let i = t.slice(0, Math.max(0, n)).filter((e) => oh(e.source) === null).length;
	yJ = null, vJ = {
		pictures: r,
		index: wJ(n - i, r.length)
	}, _J.dialog.toggleAttribute(dJ, r.length > 1);
	for (let e of _J.neighbours) e.hidden = r.length < 2;
	return NJ(_J), PJ(_J, vJ), e.open(cJ);
}
function xJ(e, t, n) {
	let r = SJ(e);
	if (r === null) return null;
	let i = e.closest(`[${b}]`);
	if (!t || i === null) return {
		pictures: [r],
		start: 0
	};
	let a = [], o = 0;
	for (let t of [...n(e)].filter((e) => e.closest(`[${b}]`) === i).sort(CJ)) {
		let n = t === e ? r : SJ(t);
		n !== null && (t === e && (o = a.length), a.push(n));
	}
	return {
		pictures: a,
		start: o
	};
}
function SJ(e) {
	let t = e.matches("img") ? e : e.querySelector("img");
	if (t === null || t.closest("[data-ui-image-failed]") !== null) return null;
	let n = t.currentSrc, r = oh(typeof n == "string" && n.length > 0 ? n : t.getAttribute("src") ?? "");
	return r === null ? null : {
		source: r,
		altText: t.getAttribute("alt") ?? ""
	};
}
function CJ(e, t) {
	return e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}
function wJ(e, t) {
	return Math.min(Math.max(0, Math.trunc(Number.isFinite(e) ? e : 0)), t - 1);
}
function TJ(e) {
	let { dialog: t, surface: n } = Q_({
		key: cJ,
		className: "ui-lightbox",
		surfaceClassName: "ui-lightbox__surface",
		role: "dialog",
		labelledBy: lJ,
		closesOnEscapeAndBackdrop: !0
	}), r = uJ.element("h2", "ui-lightbox__title"), i = DJ("ui-lightbox__close", "close"), a = uJ.element("div", "ui-lightbox__stage"), [o, s] = EJ("previous"), [c, l] = EJ("current"), [u, d] = EJ("next"), f = uJ.element("div", "ui-lightbox__nav"), p = DJ("ui-lightbox__step ui-lightbox__step--previous", "previous"), m = DJ("ui-lightbox__step ui-lightbox__step--next", "next"), h = uJ.element("span", "ui-lightbox__counter ui-text-type--caption"), g = uJ.element("span", "ui-lightbox__count-room"), _ = uJ.element("span", "ui-lightbox__count"), v = uJ.element("p", "ui-lightbox__caption ui-text-type--body", "caption");
	return r.id = lJ, _.setAttribute("aria-live", "polite"), g.setAttribute("aria-hidden", "true"), E.write(r, null, "ui.lightbox.label"), E.write(i, "aria-label", "ui.action.close"), E.write(p, "aria-label", "ui.lightbox.previous"), E.write(m, "aria-label", "ui.lightbox.next"), h.append(g, _), f.append(p, h, m), c.append(f), a.append(o, c, u), n.append(r, i, a, v), t.addEventListener("click", (t) => {
		switch (uJ.pressed(t)) {
			case "close":
				e.dismiss(cJ);
				break;
			case "previous":
				OJ(-1);
				break;
			case "next": OJ(1);
		}
	}), t.addEventListener("keydown", (e) => {
		if (e.defaultPrevented || !j(e) || vJ === null || vJ.pictures.length < 2) return;
		let n = e.key === "ArrowLeft" ? -1 : +(e.key === "ArrowRight");
		n !== 0 && (e.preventDefault(), OJ(IJ(t) ? -n : n));
	}), LJ(t, a), {
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
function EJ(e) {
	let t = uJ.element("div", "ui-lightbox__figure"), n = uJ.element("img", "ui-lightbox__picture", e === "current" ? "picture" : void 0);
	return t.setAttribute(fJ, e), n.decoding = "async", n.draggable = !1, n.addEventListener("error", () => n.setAttribute(it, "")), e !== "current" && t.setAttribute("aria-hidden", "true"), t.append(n), [t, n];
}
function DJ(e, t) {
	let n = uJ.element("button", e, t);
	return n.type = "button", n;
}
function OJ(e) {
	if (_J === null || vJ === null || vJ.pictures.length < 2) return;
	let t = _J;
	if (jJ(t), qf()) {
		MJ(t, e), NJ(t), PJ(t, vJ);
		return;
	}
	let n = {
		by: e,
		landed: !1
	}, r = IJ(t.dialog) ? -1 : 1;
	yJ = n, t.stage.removeAttribute(pJ), t.stage.style.setProperty(mJ, `${-e * r * kJ(t.stage)}px`), Yf(t.current, R.normal + 100, () => AJ(t, n));
}
function kJ(e) {
	return e.getBoundingClientRect().width + hJ;
}
function AJ(e, t) {
	if (yJ !== t || t.landed) return;
	MJ(e, t.by), t.landed = !0;
	let n = typeof e.picture.decode == "function" ? e.picture.decode().catch(() => void 0) : null;
	n === null ? jJ(e) : n.then(() => {
		yJ === t && jJ(e);
	});
}
function jJ(e) {
	let t = yJ;
	t !== null && vJ !== null && (yJ = null, t.landed || MJ(e, t.by), NJ(e), PJ(e, vJ));
}
function MJ(e, t) {
	if (vJ === null) return;
	let n = vJ.pictures.length;
	vJ.index = ((vJ.index + t) % n + n) % n, FJ(e.picture, vJ.pictures[vJ.index].source);
}
function NJ(e) {
	e.stage.setAttribute(pJ, ""), e.stage.style.setProperty(mJ, "0px"), e.stage.getBoundingClientRect();
}
function PJ(e, t) {
	let n = t.pictures.length, r = t.pictures[t.index];
	FJ(e.picture, r.source), FJ(e.previousPicture, t.pictures[(t.index + n - 1) % n].source), FJ(e.nextPicture, t.pictures[(t.index + 1) % n].source), E.writeValue(e.picture, "alt", r.altText ?? r.caption ?? ""), E.writeValue(e.caption, null, r.caption ?? ""), e.caption.hidden = r.caption === void 0, E.write(e.count, null, "ui.lightbox.counter", {
		index: t.index + 1,
		count: n
	}), E.write(e.countRoom, null, "ui.lightbox.counter", {
		index: n,
		count: n
	});
}
function FJ(e, t) {
	e.getAttribute("src") !== t && (e.removeAttribute(it), e.src = t);
}
function IJ(e) {
	return getComputedStyle(e).direction === "rtl";
}
function LJ(e, t) {
	Hm(e, {
		axis: "x",
		begins: (e) => e.pointerType !== "touch" || _J === null || vJ === null || vJ.pictures.length < 2 ? !1 : (jJ(_J), !0),
		start: () => t.setAttribute(pJ, ""),
		follow: (e) => t.style.setProperty(mJ, `${e}px`),
		end: (n, r, i) => {
			if (i && RJ(n, window.innerWidth, r)) {
				OJ((IJ(e) ? n > 0 : n < 0) ? 1 : -1);
				return;
			}
			t.removeAttribute(pJ), t.style.setProperty(mJ, "0px");
		}
	});
}
function RJ(e, t, n) {
	return Math.abs(e) > t * gJ || Math.abs(n) > .5 && Math.abs(e) > 6;
}
//#endregion
//#region src/rendering/web-dom-converters.ts
var zJ = /* @__PURE__ */ new Map([
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
]), BJ = [
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
function VJ(e) {
	return $(e, BJ);
}
var HJ = [
	"small",
	"medium",
	"large"
], UJ = ["default", "circle"], WJ = [
	"display",
	"title",
	"subtitle",
	"body",
	"caption",
	"overline"
], GJ = [
	"start",
	"center",
	"end",
	"justify"
], KJ = ["nowrap", "wrap"], qJ = /* @__PURE__ */ new Map([
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
]), JJ = /* @__PURE__ */ new Map([
	["primary", "--ui-color-primary-ink"],
	["accent", "--ui-color-accent-ink"],
	["info", "--ui-color-info-ink"],
	["warning", "--ui-color-warning-ink"],
	["success", "--ui-color-success-ink"],
	["danger", "--ui-color-danger-ink"]
]), YJ = /* @__PURE__ */ new Map([
	["primary", "--ui-color-on-primary"],
	["accent", "--ui-color-on-accent"],
	["info", "--ui-color-on-info"],
	["warning", "--ui-color-on-warning"],
	["success", "--ui-color-on-success"],
	["danger", "--ui-color-on-danger"],
	["muted", "--ui-color-surface"]
]), XJ = ["inline", "trailing"], ZJ = [
	"filled",
	"outline",
	"underline",
	"ghost",
	"tonal"
], QJ = [
	"small",
	"medium",
	"large"
], $J = [
	"small",
	"medium",
	"large"
], eY = [
	"primary",
	"accent",
	"danger",
	"outline",
	"ghost",
	"link",
	"surface"
], tY = [
	"primary",
	"accent",
	"info",
	"warning",
	"success",
	"danger",
	"surface",
	"plain"
], nY = [
	"filled",
	"tinted",
	"outline"
], rY = ["light", "dark"], iY = [
	"start",
	"center",
	"end",
	"stretch"
], aY = ["clip", "visible"], oY = [
	"visible",
	"hidden",
	"collapsed"
], sY = [
	"background",
	"raised",
	"tinted",
	"flat"
], cY = ["horizontal", "vertical"], lY = [
	"none",
	"gap",
	"rule"
], uY = [
	"none",
	"one",
	"many"
], dY = [
	"none",
	"left",
	"right",
	"top",
	"bottom"
], fY = ["stack", "wrap"], pY = ["end", "start"], mY = [
	"disabled",
	"auto",
	"always"
], hY = [
	"disabled",
	"proximity",
	"mandatory"
], gY = [
	"text",
	"email",
	"password",
	"search",
	"tel",
	"url"
], _Y = [
	"text",
	"numeric",
	"decimal",
	"tel",
	"email",
	"url",
	"search"
], vY = ["hex", "rgb"], yY = ["field", "swatch"], bY = [
	"fill",
	"contain",
	"cover",
	"none"
], xY = [
	"100% 100%",
	"contain",
	"cover",
	"auto"
], SY = ["default", "circle"], CY = ["card", "quiet"], wY = ["uniform", "vignette"], TY = ["linear", "circular"], EY = [
	"none",
	"vertical",
	"horizontal",
	"both"
], DY = [
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
], OY = [
	"None",
	"Shade",
	"Tint"
], kY = /* @__PURE__ */ new Map();
function AY(e) {
	return kY.get(e);
}
function Q(e, t, n) {
	return NY(e, jY(t, n), (e) => `${t}${$(e, n)}`);
}
function jY(e, t) {
	return MY(t.map((t) => `${e}${t}`));
}
function MY(e) {
	let t = new Set(e);
	return (e) => t.has(e);
}
function NY(e, t, n) {
	return kY.set(e, t), [e, n];
}
function PY(e, t, n) {
	return Xf.map((r) => [`${e}${r[0].toUpperCase()}${r.slice(1)}${t}`, (e) => n(e, r)]);
}
var FY = new Map([
	Q("colorClass", "ui-color--", BJ),
	NY("themeColorClass", jY("ui-color--", BJ), (e) => vX(e)),
	NY("iconClass", yh, (e) => bh(e)),
	["iconUrlCss", (e) => fh(e)],
	["safeUrl", (e) => Qm(e)],
	["safeImageSource", (e) => sh(e)],
	["inlineMarkupPlainText", (e) => e == null ? void 0 : Mj(String(e))],
	["ariaBooleanAttribute", (e) => e === !0 ? "true" : "false"],
	["placeholderText", (e) => typeof e == "string" && e.length > 0 ? e : " "],
	Q("iconSizeClass", "ui-icon-size--", HJ),
	NY("iconShapeClass", MY(["ui-icon--circle"]), (e) => $(e, UJ) === "circle" ? "ui-icon--circle" : ""),
	Q("textTypeClass", "ui-text-type--", WJ),
	NY("textAppearanceClass", jY("ui-text-type--", WJ), (e) => DX(e, "ui-text-type--")),
	NY("textDescriptionTypeClass", jY("ui-text--description-", WJ), (e) => DX(e, "ui-text--description-")),
	Q("textAlignmentClass", "ui-text--align-", GJ),
	Q("textWrapClass", "ui-text--", KJ),
	Q("buttonAlignmentClass", "ui-button--align-", GJ),
	Q("textBadgePlacementHostClass", "ui-text--badge-", XJ),
	Q("badgeStyleClass", "ui-badge-style--", tY),
	Q("badgeFillClass", "ui-badge-fill--", nY),
	NY("badgeColoredClass", MY(["ui-badge--colored"]), (e) => uX(e).length > 0 ? "ui-badge--colored" : ""),
	["badgeTextFit", (e) => yX(e)],
	Q("buttonClass", "ui-button--", eY),
	Q("surfaceStyleClass", "ui-surface--", sY),
	Q("orientationClass", "ui-orientation--", cY),
	Q("groupSeparatorClass", "ui-command-bar--separator-", lY),
	["selectionModeAttribute", (e) => $(e, uY)],
	["selectionBackgroundCss", (e) => uX(sX(e, "background"))],
	["selectionForegroundCss", (e) => uX(sX(e, "foreground"))],
	["selectionMarkColorCss", (e) => uX(sX(e, "markColor"))],
	["selectionMarkCss", (e) => lX(sX(e, "mark"))],
	["selectionFontWeightCss", (e) => cX(sX(e, "bold"))],
	["selectionActionBarBackgroundCss", (e) => uX(sX(e, "actionBarBackground"))],
	Q("itemsViewLayoutClass", "ui-items-view--", fY),
	Q("dragHandlePlacementClass", "ui-drag-handle--", pY),
	Q("scrollXClass", "ui-scroll-x--", mY),
	Q("scrollYClass", "ui-scroll-y--", mY),
	["hostViewport", (e) => XY(e)],
	Q("scrollSnapClass", "ui-scroll-snap--", hY),
	Q("inputAppearanceClass", "ui-input--", ZJ),
	Q("inputSizeClass", "ui-input--", $J),
	Q("buttonSizeClass", "ui-button--", QJ),
	Q("buttonGroupSizeClass", "ui-button-group--", QJ),
	["textInputTypeAttribute", (e) => $(e, gY)],
	["inputModeAttribute", (e) => $(e, _Y)],
	["colorTextFormatAttribute", (e) => $(e, vY)],
	["colorInputVariantAttribute", (e) => $(e, yY)],
	["themeNameCss", (e) => $(e, rY)],
	["alignmentCss", (e) => $(e, iY)],
	["alignmentStretchFallbackCss", (e) => $(e, iY) === "stretch" ? "start" : ""],
	["overflowCss", (e) => $(e, aY)],
	["layoutLengthCss", (e) => ZY(e)],
	["thicknessCss", (e) => eX(e)],
	NY("borderNoneClass", MY(["ui-border--none"]), (e) => nX(e)),
	["radiusCss", (e) => rX(e)],
	["gridUnitCss", (e) => iX(e)],
	["pixelsCss", (e) => LX(e)],
	["gridTemplateCss", (e) => aX(e)],
	["colorVariantCss", (e) => jX(e)],
	["themeColorCss", (e) => uX(e)],
	["themeInkCss", (e) => fX(e)],
	["roleInkCss", (e) => pX(e)],
	["themeOnColorCss", (e) => hX(e)],
	["themeColorInlineCss", (e) => dX(e) ? "" : uX(e)],
	["themeColorCanonical", (e) => kX(e)],
	["textAppearanceFontSizeCss", (e) => OX(e, "size")],
	["textAppearanceFontWeightCss", (e) => OX(e, "weight")],
	["textAppearanceLineHeightCss", (e) => OX(e, "lineHeight")],
	["textAppearanceLetterSpacingCss", (e) => OX(e, "letterSpacing")],
	...PY("responsiveLayoutLength", "Css", (e, t) => ZY(np(e, t))),
	...PY("responsiveWidth", "Css", (e, t) => QY(np(e, t), "horizontal")),
	...PY("responsiveHeight", "Css", (e, t) => QY(np(e, t), "vertical")),
	...PY("responsiveThickness", "Css", (e, t) => eX(np(e, t))),
	...PY("responsiveThicknessHorizontal", "Css", (e, t) => tX(np(e, t), "horizontal")),
	...PY("responsiveThicknessVertical", "Css", (e, t) => tX(np(e, t), "vertical")),
	...PY("responsiveRadius", "Css", (e, t) => rX(np(e, t))),
	...PY("responsivePixels", "Css", (e, t) => RX(np(e, t))),
	...PY("visibility", "Attribute", (e, t) => zX(e, t)),
	...PY("gridPlacement", "ColumnCss", (e, t) => oX(np(e, t), "column")),
	...PY("gridPlacement", "RowCss", (e, t) => oX(np(e, t), "row")),
	...PY("gridPlacement", "ColumnSpanCss", (e, t) => oX(np(e, t), "columnSpan")),
	...PY("gridPlacement", "RowSpanCss", (e, t) => oX(np(e, t), "rowSpan")),
	Q("imageFitClass", "ui-image-fit--", bY),
	NY("expanderVariantClass", MY(["ui-expander--quiet"]), (e) => $(e, CY) === "quiet" ? "ui-expander--quiet" : ""),
	NY("imageShapeClass", MY(["ui-image--circle"]), (e) => $(e, SY) === "circle" ? "ui-image--circle" : ""),
	["backgroundImageCss", (e) => BY(e)],
	["backgroundImageAttribute", (e) => BY(e).length === 0 ? void 0 : ""],
	["imageFitSizeCss", (e) => $(e, xY)],
	["backgroundImageDimCss", (e) => VY(e)],
	["backgroundImageDimModeAttribute", (e) => $(e, wY) === "vignette" ? "vignette" : void 0],
	["backgroundImageBlurCss", (e) => GY(e) ? `${Number(e)}px` : ""],
	["backgroundImageBlurAttribute", (e) => GY(e) ? "" : void 0],
	["positiveCount", (e) => HY(e)?.toString()],
	["nonNegativeCount", (e) => UY(e, (e) => e >= 0)?.toString()],
	["nonZeroCount", (e) => UY(e, (e) => e !== 0)?.toString()],
	["positiveNumber", (e) => WY(e, (e) => e > 0)?.toString()],
	["nonNegativeNumber", (e) => WY(e, (e) => e >= 0)?.toString()],
	["share", (e) => WY(e, (e) => e >= 0 && e <= 1)?.toString()],
	["positiveFlagAttribute", (e) => HY(e) === void 0 ? void 0 : ""],
	NY("maxLinesClass", MY(["ui-text--max-lines"]), (e) => HY(e) === void 0 ? "" : "ui-text--max-lines"),
	Q("progressVariantClass", "ui-progress--", TY),
	["progressValueText", (e) => IX(e)],
	["textAreaResizeCss", (e) => $(e, EY)],
	Q("flyoutPlacementClass", "ui-flyout--", DY),
	["popupPlacementAttribute", (e) => $(e, DY)],
	["tabMenuEntriesAttribute", (e) => RY(e)],
	["markedDaysAttribute", (e) => zY(e)]
]);
function IY(e) {
	let t = FY.get("surfaceStyleClass");
	return sY.find((n, r) => e.classList.contains(t?.(r) ?? "")) ?? null;
}
var LY = [
	["rename", 1],
	["pin", 2],
	["close", 4],
	["delete", 8]
];
function RY(e) {
	let t = typeof e == "string" ? e.split(",").map((e) => e.trim().toLowerCase()) : null, n = typeof e == "number" ? e : 0, r = LY.filter(([e, r]) => t === null ? (n & r) !== 0 : t.includes(e)).map(([e]) => e);
	return r.length === 0 ? void 0 : r.join(" ");
}
function zY(e) {
	let t = Array.isArray(e) ? e.filter((e) => typeof e == "string" && e.length > 0).map((e) => e.slice(0, 10)) : [];
	return t.length === 0 ? void 0 : [...new Set(t)].sort().join(" ");
}
function BY(e) {
	return fh(e);
}
function VY(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isNaN(t) ? "" : String(Math.min(1, Math.max(0, t)));
}
function HY(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isInteger(t) && t > 0 ? t : void 0;
}
function UY(e, t) {
	let n = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isInteger(n) && t(n) ? n : void 0;
}
function WY(e, t) {
	let n = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isFinite(n) && t(n) ? n : void 0;
}
function GY(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isFinite(t) && t > 0;
}
var KY = [
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
], qY = new Map(KY.map(([, e, t, n, r]) => [e, [
	t,
	n,
	r
]])), JY = new Map(KY.map(([e, t]) => [e, t])), YY = /* @__PURE__ */ new Map([[aY, /* @__PURE__ */ new Map([["Hidden", "clip"]])], [xY, /* @__PURE__ */ new Map([["Fill", "100% 100%"], ["None", "auto"]])]]);
function $(e, t) {
	return typeof e == "string" ? (t === void 0 ? void 0 : YY.get(t)?.get(e)) ?? zJ.get(e) ?? Ti(e) : typeof e == "number" && t !== void 0 ? t[e] ?? String(e) : String(e ?? "");
}
function XY(e) {
	return e == null || $(e, mY) === "disabled" ? void 0 : "parent";
}
function ZY(e) {
	if (e == null) return "";
	if (typeof e == "number") return LX(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.kind, r = t.value ?? 0;
	return n === "Auto" || n === 0 ? "" : n === "Absolute" || n === 1 ? LX(r) : n === "Fill" || n === 2 ? "100%" : "";
}
function QY(e, t) {
	if (typeof e != "object" || !e) return ZY(e);
	let n = e.kind;
	return n !== "Fill" && n !== 2 ? ZY(e) : t === "horizontal" ? "var(--ui-fill-width, 100%)" : "var(--ui-fill-height, 100%)";
}
function $Y(e) {
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
function eX(e) {
	if (e == null) return "";
	let t = $Y(e);
	return t === void 0 ? String(e) : `${t.top}px ${t.right}px ${t.bottom}px ${t.left}px`;
}
function tX(e, t) {
	let n = $Y(e);
	return n === void 0 ? "" : LX(t === "horizontal" ? n.left + n.right : n.top + n.bottom);
}
function nX(e) {
	if (e == null) return "";
	if (typeof e == "object" && "base" in e) return Xf.map((t) => np(e, t)).filter((e) => e != null).every((e) => nX(e) !== "") ? "ui-border--none" : "";
	let t = $Y(e);
	return t !== void 0 && t.top === 0 && t.right === 0 && t.bottom === 0 && t.left === 0 ? "ui-border--none" : "";
}
function rX(e) {
	if (e == null) return "";
	if (typeof e == "number") return LX(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.topLeft ?? 0, r = t.topRight ?? 0, i = t.bottomRight ?? 0, a = t.bottomLeft ?? 0;
	return n === r && n === i && n === a ? LX(n) : `${n}px ${r}px ${i}px ${a}px`;
}
function iX(e) {
	if (e == null) return "";
	if (typeof e == "number") return e <= 0 ? "minmax(0, 1fr)" : `minmax(0, ${e}fr)`;
	if (typeof e != "object") return String(e);
	let t = e, n = t.unit, r = t.value ?? 1, i = t.minValue, a = t.maxValue;
	if (n === "Absolute" || n === 1) return LX(r);
	if (n === "Star" || n === 0) {
		let e = i != null && i > 0 ? `${i}px` : "0";
		return r <= 0 ? `minmax(${e}, 1fr)` : `minmax(${e}, ${r}fr)`;
	}
	return n === "Auto" || n === 2 ? i == null ? a == null ? "auto" : `fit-content(${a}px)` : `minmax(${i}px, auto)` : "";
}
function aX(e) {
	if (e == null) return "";
	if (!Array.isArray(e)) return iX(e);
	if (e.length === 0) return "none";
	if (e.length === 1) return iX(e[0]);
	let t = JSON.stringify(e[0]);
	return e.every((e) => JSON.stringify(e) === t) ? `repeat(${e.length}, ${iX(e[0])})` : e.map((e) => iX(e)).join(" ");
}
function oX(e, t) {
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
function sX(e, t) {
	return typeof e != "object" || !e ? null : e[t] ?? null;
}
function cX(e) {
	return e == null ? "" : e === !0 ? "600" : "400";
}
function lX(e) {
	if (e == null) return "";
	switch ($(e, dY)) {
		case "left": return "inset 2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "right": return "inset -2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "top": return "inset 0 2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "bottom": return "inset 0 -2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		default: return "none";
	}
}
function uX(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	if (AX(e)) return jX(e);
	let t = e, n = jX(t.light), r = jX(t.dark), i = n.length > 0 ? n : r, a = r.length > 0 ? r : n;
	if (i.length > 0 && a.length > 0) return i === a ? i : `light-dark(${i}, ${a})`;
	let o = t.style;
	if (o == null) return "";
	let s = qJ.get($(o, BJ));
	return s ? `var(${s})` : "";
}
function dX(e) {
	if (typeof e != "object" || !e || AX(e)) return !1;
	let t = e;
	return t.light == null && t.dark == null && t.style != null;
}
function fX(e) {
	if (dX(e)) {
		let t = JJ.get($(e.style, BJ));
		if (t !== void 0) return `var(${t})`;
	}
	return uX(e);
}
function pX(e) {
	if (typeof e != "object" || !e || AX(e)) return "";
	let t = e;
	return t.light == null && t.dark == null ? fX(e) : "";
}
var mX = /* @__PURE__ */ new Set(["background", "surface"]);
function hX(e) {
	if (typeof e != "object" || !e) return "";
	if (AX(e)) return gX(e) ? "initial" : _X(e);
	let t = e, n = _X(t.light ?? t.dark), r = _X(t.dark ?? t.light);
	if (n.length > 0 && r.length > 0 && gX(t.light ?? t.dark) && gX(t.dark ?? t.light)) return "initial";
	if (n.length > 0 && r.length > 0) return n === r ? n : `light-dark(${n}, ${r})`;
	if (t.style === null || t.style === void 0) return "";
	let i = $(t.style, BJ);
	if (mX.has(i)) return "initial";
	let a = YJ.get(i);
	return a ? `var(${a})` : "";
}
function gX(e) {
	return MX(e)?.[3] === 0;
}
function _X(e) {
	let t = MX(e);
	return t === void 0 ? "" : LL(t[0], t[1], t[2], t[3]);
}
function vX(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.light != null || t.dark != null) return "";
	let n = t.style;
	return n == null ? "" : `ui-color--${$(n, BJ)}`;
}
function yX(e) {
	let t = CX(e == null ? "" : String(e).trim(), bX + 1);
	return t > 0 && t <= bX ? "compact" : "";
}
var bX = 2, xX = /[\u0300-\uFFFF]/, SX = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function CX(e, t) {
	if (!xX.test(e)) return e.length;
	let n = 0;
	for (let { segment: r } of SX.segment(e)) {
		if (n >= t) break;
		n += wX(r) ? 2 : 1;
	}
	return n;
}
function wX(e) {
	if (e.includes("️")) return !0;
	let t = e.codePointAt(0) ?? 0;
	for (let e = 0; e < TX.length; e += 2) if (t >= TX[e] && t <= TX[e + 1]) return !0;
	return !1;
}
var TX = [
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
function EX(e, t) {
	let n = String(t), r = e.querySelector(".ui-badge__text");
	r !== null && (r.textContent = n), e.setAttribute(Ve, yX(n)), e.setAttribute(He, "");
}
function DX(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size != null) return "";
	let r = n.role;
	return r == null ? "" : `${t}${$(r, WJ)}`;
}
function OX(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size == null) return "";
	switch (t) {
		case "size": return LX(n.size);
		case "weight": {
			let e = n.weight;
			return e == null ? "" : String(e);
		}
		case "lineHeight": {
			let e = n.lineHeight;
			return e == null ? "" : LX(e);
		}
		case "letterSpacing": {
			let e = n.letterSpacing;
			return e == null ? "" : LX(e);
		}
		default: return "";
	}
}
function kX(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return "";
	let t = e, n = NX(t.style);
	if (n !== null) return `@${n}`;
	let r = t.light ?? t.dark;
	if (r == null) return "";
	if (typeof r.rgb == "number") {
		let e = r.opacity ?? 255, t = `#${IL(r.rgb >> 16 & 255)}${IL(r.rgb >> 8 & 255)}${IL(r.rgb & 255)}`;
		return e === 255 ? t : `${t}${IL(e)}`;
	}
	let i = PX(r.name);
	return i === null ? "" : `${i}/${FX(r.adjustment) ?? "None"}/${r.factor ?? 0}/${r.opacity ?? 255}`;
}
function AX(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.name !== void 0 || t.rgb !== void 0;
}
function jX(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	let t = MX(e);
	return t === void 0 ? "" : `#${IL(t[0])}${IL(t[1])}${IL(t[2])}${IL(t[3])}`;
}
function MX(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = typeof t.rgb == "number" ? [
		t.rgb >> 16 & 255,
		t.rgb >> 8 & 255,
		t.rgb & 255
	] : void 0, r = PX(t.name), i = n ?? (r === null ? void 0 : qY.get(r));
	if (!i) return;
	let a = FX(t.adjustment), o = (t.factor ?? 0) / 10, s = t.opacity ?? 255, [c, l, u] = i;
	return a === "Shade" ? (c = G(c * (1 - o)), l = G(l * (1 - o)), u = G(u * (1 - o))) : a === "Tint" && (c = G(c + (255 - c) * o), l = G(l + (255 - l) * o), u = G(u + (255 - u) * o)), [
		c,
		l,
		u,
		s
	];
}
function NX(e) {
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	if (typeof e != "number") return null;
	let t = BJ[e];
	return t === void 0 ? null : t.split("-").map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join("");
}
function PX(e) {
	if (typeof e == "number") return JY.get(e) ?? null;
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	return null;
}
function FX(e) {
	if (typeof e == "number") return OY[e] ?? "None";
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? "None" : t;
	}
	return "None";
}
function IX(e) {
	if (e == null || e === "") return "";
	let t = typeof e == "number" ? e : Number(e);
	return Number.isFinite(t) ? String(t) : "";
}
function LX(e) {
	return `${typeof e == "number" ? e : Number(e ?? 0)}px`;
}
function RX(e) {
	return e == null ? "" : LX(e);
}
function zX(e, t) {
	let n = rp(e, t);
	if (n == null) return;
	let r = $(n, oY);
	return r === "visible" ? void 0 : r;
}
//#endregion
//#region src/interactions/live-announcer.ts
var BX = "ui-announcer", VX = 7e3, HX = class {
	container;
	regions = /* @__PURE__ */ new Map();
	constructor(e) {
		this.container = e, this.ensureRegion("polite"), this.ensureRegion("assertive");
	}
	announce(e, t = "polite") {
		let n = document.createElement("div");
		return typeof e == "string" ? n.textContent = e : E.writeValue(n, null, e), this.ensureRegion(t).append(n), window.setTimeout(() => n.remove(), VX), n;
	}
	ensureRegion(e) {
		let t = this.regions.get(e);
		if (t !== void 0 && t.isConnected) return t;
		let n = `.${BX}[aria-live="${e}"]`, r = this.container.querySelector(n), i = r ?? document.createElement("div");
		return r === null && (i.className = BX, i.setAttribute("aria-live", e), this.container.append(i)), this.regions.set(e, i), i;
	}
}, UX = "ui-notification-host", WX = "ui-notification", GX = "ui-notification--leaving", KX = "ui-notification__message", qX = "ui-notification__title", JX = "ui-notification__action", YX = "ui-notification__close", XX = 5e3, ZX = 8e3, QX = "ui-notification--connection", $X = "--ui-notification-lift", eZ = /* @__PURE__ */ new Set([
	"info",
	"success",
	"warning",
	"danger",
	"primary",
	"accent"
]), tZ = class {
	root;
	components;
	durationMs;
	host = null;
	announcer;
	focusOrigins = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, this.durationMs = e.durationMs ?? XX, this.ensureHost(), this.announcer = new HX(this.root instanceof Document ? this.root.body : this.root);
	}
	announce(e, t) {
		return this.announcer.announce(e, t);
	}
	show(e) {
		let t = VJ(e.severity), n = document.createElement("div");
		n.className = eZ.has(t) ? `${WX} ${WX}--${t}` : WX, n.classList.toggle(QX, e.connection === !0), t === "danger" && n.setAttribute("role", "alert");
		let r = document.createElement("span");
		if (r.className = KX, e.title !== void 0) {
			let t = document.createElement("span");
			t.className = qX, E.writeValue(t, null, e.title), n.append(t);
		}
		typeof e.message == "string" ? r.textContent = e.message : E.writeValue(r, null, e.message), n.append(r);
		let i = document.createElement("button");
		return i.type = "button", i.className = YX, E.write(i, "aria-label", "ui.notification.close"), i.addEventListener("click", () => this.dismiss(n)), n.append(i), e.action !== void 0 && n.append(aZ(e.action, e.sticky === !0 ? null : () => this.dismiss(n))), n.addEventListener("keydown", (e) => {
			e.key !== "Escape" || e.defaultPrevented || A(e) || (e.preventDefault(), this.dismiss(n));
		}), n.addEventListener("focusin", (e) => {
			let t = e.relatedTarget;
			t instanceof HTMLElement && !n.contains(t) && this.focusOrigins.set(n, t);
		}), nZ(() => {
			if (n.classList.contains(GX)) return;
			let t = this.ensureHost();
			rZ(t), t.append(n), e.sticky !== !0 && this.standFor(n, e);
		}), n;
	}
	standFor(e, t) {
		let n = t.durationMs !== void 0 && t.durationMs > 0 ? t.durationMs : t.action === void 0 ? this.durationMs : ZX, r = !1, i = !1, a = window.setTimeout(() => this.dismiss(e), n), o = () => window.clearTimeout(a), s = () => {
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
		if (!e.classList.contains(GX) && (e.classList.add(GX), e.isConnected)) {
			if (this.returnFocus(e), qf() || typeof e.animate != "function") {
				e.remove();
				return;
			}
			window.setTimeout(() => iZ(e), R.fast);
		}
	}
	returnFocus(e) {
		if (!e.contains(document.activeElement)) return;
		let t = [...e.parentElement?.children ?? []].find((t) => t !== e && !t.classList.contains(GX));
		qd(Ud(this.focusOrigins.get(e), this.components) ?? t?.querySelector(`.${YX}`) ?? null, e);
	}
	ensureHost() {
		if (this.host !== null && this.host.isConnected) return this.host;
		let e = this.root instanceof Document ? this.root.body : this.root, t = e.querySelector(`.${UX}`), n = t ?? document.createElement("div");
		return n.classList.add(UX), n.setAttribute("role", "status"), n.setAttribute("aria-live", "polite"), t === null && e.append(n), this.host = n, n;
	}
};
function nZ(e) {
	if (qB(document.visibilityState)) {
		e();
		return;
	}
	let t = () => {
		qB(document.visibilityState) && (document.removeEventListener("visibilitychange", t), e());
	};
	document.addEventListener("visibilitychange", t);
}
function rZ(e) {
	let t = window.innerHeight - tm(window.innerHeight);
	t > 0 ? e.style.setProperty($X, `${Math.round(t)}px`) : e.style.removeProperty($X);
}
function iZ(e) {
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
		duration: R.fast,
		easing: R.exit,
		fill: "forwards"
	}), i = () => e.remove();
	r.finished.then(i, i);
}
function aZ(e, t) {
	let n = document.createElement("button"), r = !1;
	return n.type = "button", n.className = `${JX} ui-button ui-button--primary ui-button--small`, typeof e.label == "string" ? n.textContent = e.label : E.writeValue(n, null, e.label), n.addEventListener("click", () => {
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
function oZ(e, t) {
	let n = sZ(e), r = e?.label;
	if (n !== void 0) {
		if (!Eo(r) && !Do(r)) {
			s("a notification's action carries no words.", e);
			return;
		}
		return {
			label: r,
			run: () => t(n)
		};
	}
}
function sZ(e) {
	return e != null && typeof e.id == "string" && e.id.length > 0 ? e.id : void 0;
}
//#endregion
//#region src/effects/insert-text.ts
function cZ(e, t, n) {
	let r = e.itemKey === !0 ? lZ(n) : e.text;
	if (typeof r != "string") {
		s(e.itemKey === !0 ? "insert text effect reads the row's key but ran for no row." : "insert text effect carries no text.", e);
		return;
	}
	let i = uZ(t);
	if (i === null) {
		s("insert text effect target holds no text field.", e);
		return;
	}
	dZ(i, r);
}
function lZ(e) {
	let t = e.length === 0 ? null : e[e.length - 1];
	return t == null ? null : String(t);
}
function uZ(e) {
	if (Uc(e)) return e;
	for (let t of e.querySelectorAll("input, textarea")) if (Uc(t)) return t;
	return null;
}
function dZ(e, t) {
	if (t.length === 0 || e.readOnly || e.disabled || D(e) || k(e)) return !1;
	let n = e.value, r = e.selectionStart !== null, i = e.selectionStart ?? n.length, a = e.selectionEnd ?? i;
	return e.maxLength >= 0 && n.length - (a - i) + t.length > e.maxLength ? !1 : (document.activeElement !== e && e.focus({ preventScroll: !0 }), r && e.setSelectionRange(i, a), document.activeElement === e && sJ(t) && e.value !== n ? !0 : (r ? e.setRangeText(t, i, a, "end") : e.value = n + t, e.dispatchEvent(new Event("input", { bubbles: !0 })), !0));
}
//#endregion
//#region src/effects/navigation-url.ts
function fZ(e) {
	let t = e.request?.route;
	return t == null || t.length === 0 ? null : pZ(t, e.request?.parameters ?? null);
}
function pZ(e, t) {
	let n = mZ(t);
	if (n.length === 0) return e;
	let r = e.indexOf("#"), i = r < 0 ? e : e.slice(0, r), a = r < 0 ? "" : e.slice(r);
	return `${i}${i.includes("?") ? i.endsWith("?") || i.endsWith("&") ? "" : "&" : "?"}${n}${a}`;
}
function mZ(e) {
	if (e === null) return "";
	let t = new URLSearchParams();
	for (let [n, r] of Object.entries(e)) if (r != null) for (let e of Array.isArray(r) ? r : [r]) e != null && t.append(n, hZ(e));
	return t.toString();
}
function hZ(e) {
	return typeof e == "object" ? JSON.stringify(e) : String(e);
}
//#endregion
//#region src/effects/scroller.ts
function gZ(e, t) {
	let n = vZ([e, ...e.querySelectorAll("*")], t);
	if (n !== null) return n;
	let r = [];
	for (let t = e.parentElement; t !== null; t = t.parentElement) r.push(t);
	return vZ(r, t) ?? _Z(t);
}
function _Z(e) {
	let t = typeof document > "u" ? null : document.scrollingElement ?? null;
	return t !== null && yZ(t, e) ? t : null;
}
function vZ(e, t) {
	let n = null;
	for (let r of e) if (IA(r, t)) {
		if (yZ(r, t)) return r;
		n ??= r;
	}
	return n;
}
function yZ(e, t) {
	return t ? e.scrollHeight > e.clientHeight : e.scrollWidth > e.clientWidth;
}
//#endregion
//#region src/effects/effect-registry.ts
var bZ = class {
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
		this.handlers.set(Wi(e), t);
	}
	applyAll(e, t) {
		if (e != null) for (let n of e) this.apply({
			effect: n,
			dom: t
		});
	}
	apply(e) {
		let t = Wi(e.effect?.kind), n = t.length === 0 ? void 0 : this.handlers.get(t);
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
			let t = fZ(e.effect);
			if (t === null) {
				s("navigate effect carries no route.", e.effect);
				return;
			}
			if (!th(t)) {
				s("navigate effect names no route of this site; not followed.", e.effect);
				return;
			}
			this.leaveFor(t);
		}), this.register("NavigateBack", (e) => {
			if (this.address?.back() === !0) return;
			let t = e.effect.fallback;
			if (typeof t != "string" || !th(t)) {
				s("navigate back effect has nothing to go back to and names no route of this site; not followed.", e.effect);
				return;
			}
			this.leaveFor(t);
		}), this.register("ReplaceAddress", (e) => {
			this.writeAddress(e, (e, t) => e.replace(t));
		}), this.register("PushAddress", (e) => {
			this.writeAddress(e, (e, t) => e.push(t));
		}), this.register("SetTheme", (e) => {
			let t = e.effect, n = Ji(t.mode), r = n === "Unknown" ? "auto" : n.toLowerCase();
			document.documentElement.getAttribute("data-ui-theme") !== r && document.documentElement.setAttribute(wr, r), t.stored !== !0 && this.reportTheme?.(r);
		}), this.register("Focus", (e) => {
			let t = EZ(e);
			t !== null && (CH(t), OZ(t));
		}), this.register("ScrollTo", (e) => {
			let t = EZ(e);
			if (t === null) return;
			let n = e.effect, r = Gi(n.behavior), i = Ki(n.block);
			CH(t), t.scrollIntoView({
				behavior: DZ(r),
				block: i === "Unknown" ? "nearest" : i.toLowerCase()
			});
		}), this.register("ScrollToItem", (e) => {
			let t = EZ(e);
			if (t === null) return;
			let n = e.effect, r = lH(t);
			if (r === null || typeof n.key != "string" || n.key.length === 0) {
				s("scroll to item effect names no items host or no key.", e.effect);
				return;
			}
			let i = Ki(n.block);
			CH(ul(r)), uH(r, n.key, i === "Unknown" ? "Start" : i, DZ(Gi(n.behavior))) || s("scroll to item effect names a row the host has not drawn.", e.effect);
		}), this.register("Scroll", (e) => {
			let t = EZ(e);
			if (t === null) return;
			let n = e.effect, r = Yi(n.axis) !== "Horizontal", i = gZ(t, r);
			if (i === null) {
				s("scroll effect target has no scrollable element.", e.effect);
				return;
			}
			let a = r ? i.clientHeight : i.clientWidth, o = (r ? i.scrollHeight : i.scrollWidth) - a, c = r ? i.scrollTop : i.scrollLeft, l = qi(n.position), u;
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
			let d = DZ(Gi(n.behavior));
			CH(i), r && l === "End" && DH(i) && SH(i), i.scrollTo(r ? {
				top: u,
				behavior: d
			} : {
				left: u,
				behavior: d
			});
		}), this.register("Show", (e) => {
			TZ(EZ(e), null);
		}), this.register("Hide", (e) => {
			TZ(EZ(e), "hidden");
		}), this.register("Collapse", (e) => {
			TZ(EZ(e), "collapsed");
		}), this.register("CopyToClipboard", (e) => {
			let t = kZ(e, this.valueReaders);
			t !== null && AZ(t).catch((e) => s("copy to clipboard failed.", e));
		}), this.register("InsertText", (e) => {
			let t = EZ(e);
			t !== null && cZ(e.effect, t, e.row ?? []);
		}), this.register("OpenPicker", (e) => {
			let t = EZ(e);
			t !== null && !f_(t) && s("open picker effect names no file or image input.", e.effect);
		}), this.register("OpenDialog", (e) => {
			this.applyDialogEffect(e, "OpenDialog", (e, t) => e.open(t));
		}), this.register("ShowImage", (e) => {
			let t = e.effect;
			if (this.dialogs === void 0) {
				s("show image effect arrived but no dialog engine is wired up.", t);
				return;
			}
			if (t.target === void 0 || t.target === null) {
				bJ(this.dialogs, SZ(t.images), t.startIndex ?? 0);
				return;
			}
			let n = EZ(e), r = n === null ? null : xJ(n, t.rows === !0, (t) => e.dom.findEveryComponent(T(t)));
			r === null ? s("show image effect names a component that shows no picture.", t) : bJ(this.dialogs, r.pictures, r.start);
		}), this.register("CloseDialog", (e) => {
			let t = e.effect.raisesClose === !0;
			this.applyDialogEffect(e, "CloseDialog", (e, n) => t ? e.dismiss(n) : e.close(n));
		}), this.register("DownloadFile", (e) => {
			let t = e.effect;
			if (t.requestPath === void 0 || t.requestPath.length === 0) {
				s("download effect carries no path.", e.effect);
				return;
			}
			if (!Zm(t.requestPath)) {
				s("download effect refused: the path's scheme is not one a link may carry.", e.effect);
				return;
			}
			let n = document.createElement("a");
			n.href = t.requestPath, n.download = t.fileName ?? "", n.style.display = "none", document.body.appendChild(n), n.click(), n.remove();
		}), this.register("ShowNotification", (e) => {
			let t = e.effect;
			if (!Eo(t.message) && !Do(t.message)) {
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
				action: this.runAction === void 0 ? void 0 : oZ(t.action, this.runAction)
			});
		}), this.register("RequestNotificationPermission", () => {
			JB() !== void 0 && Notification.requestPermission().then(() => this.clientStateChanged?.()).catch((e) => s("asking for the notification permission failed.", e));
		}), this.register("ShowSystemNotification", (e) => this.showSystemNotification(e.effect)), this.register("Announce", (e) => {
			let t = e.effect;
			if (!Eo(t.message) && !Do(t.message)) {
				s("announce effect carries no message.", e.effect);
				return;
			}
			if (this.notifications === void 0) {
				s("announce effect arrived but no notification engine is wired up.", t.message);
				return;
			}
			this.notifications.announce(t.message, Xi(t.politeness) === "Assertive" ? "assertive" : "polite");
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
		if (!Eo(t) && !Do(t)) {
			s("system notification effect carries no title.", e);
			return;
		}
		let n = Eo(e.body) || Do(e.body) ? e.body : void 0, r = typeof e.address == "string" && th(e.address) ? e.address : void 0, i = () => {
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
		if (e.when !== "Always" && qB(document.visibilityState)) {
			i();
			return;
		}
		let a = sZ(e.action);
		$B({
			title: xZ(t),
			body: n === void 0 ? void 0 : xZ(n),
			tag: e.tag ?? "",
			icon: typeof e.icon == "string" && th(e.icon) ? e.icon : CZ(),
			silent: e.silent === !0,
			requireInteraction: e.requireInteraction === !0,
			address: r ?? wZ(),
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
		return t !== void 0 && n !== void 0 && tV(t) ? {
			label: Eo(e.addressLabel) || Do(e.addressLabel) ? e.addressLabel : { key: "ui.notification.open" },
			run: () => n(t)
		} : this.runAction === void 0 ? void 0 : oZ(e.action, this.runAction);
	}
};
function xZ(e) {
	return Eo(e) ? E.translate(e.key, e.args) : Do(e) ? E.resolveText(e.text) : "";
}
function SZ(e) {
	let t = [];
	for (let n of e ?? []) typeof n?.source == "string" && t.push({
		source: n.source,
		caption: Eo(n.caption) || Do(n.caption) ? n.caption : void 0,
		altText: Eo(n.altText) || Do(n.altText) ? n.altText : void 0
	});
	return t;
}
function CZ() {
	let e = document.querySelector("link[rel~='icon']")?.href;
	return e === void 0 || e.startsWith("data:") ? void 0 : e;
}
function wZ() {
	return window.location.pathname + window.location.search + window.location.hash;
}
function TZ(e, t) {
	if (e === null) return;
	let n = vf();
	for (let n of Xr) t === null ? e.removeAttribute(n) : e.setAttribute(n, t);
	n !== null && yf(n);
}
function EZ(e) {
	let t = e.effect.target;
	if (t === void 0 || t.id === void 0) return s("targeted client effect carries no resolved component address.", e.effect), null;
	let n = e.dom.findComponent(w(t.id), t.dynamicParameters ?? []);
	return n === null && s("client effect target was not found in the DOM.", e.effect), n;
}
function DZ(e) {
	return e === "Smooth" && !qf() ? "smooth" : "auto";
}
function OZ(e) {
	if (e instanceof HTMLElement && (e.tabIndex >= 0 || e.matches(ad))) {
		e.focus();
		return;
	}
	let t = Dd(e);
	if (t !== null) {
		t.focus();
		return;
	}
	s("focus effect target has nothing focusable.", e);
}
function kZ(e, t) {
	let n = e.effect;
	if (typeof n.text == "string") return n.text;
	let r = EZ(e);
	return r === null ? null : t === void 0 ? (s("copy to clipboard effect names a component but no value reader is wired up.", e.effect), null) : ac(r) === null ? (s("copy to clipboard effect target holds no value.", e.effect), null) : $s(t.readHeld(r));
}
async function AZ(e) {
	if (navigator.clipboard !== void 0) try {
		await navigator.clipboard.writeText(e);
		return;
	} catch {}
	if (!jZ(e)) throw Error("neither the clipboard API nor the selection command took the text.");
}
function jZ(e) {
	let t = document.createElement("textarea");
	t.value = e, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.opacity = "0", document.body.appendChild(t), t.select();
	try {
		return oJ();
	} finally {
		t.remove();
	}
}
//#endregion
//#region src/interactions/dialog-engine.ts
var MZ = class {
	root;
	components;
	returnFocusByKey = /* @__PURE__ */ new Map();
	swipes = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, this.root.addEventListener("mousedown", (e) => NZ(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0);
	}
	open(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (!t.hasAttribute("hidden")) return !0;
		t.removeAttribute("hidden");
		let n = t.querySelector(".ui-dialog__surface") ?? t, r = Dd(t), i = bd() && Uc(r);
		i && !n.hasAttribute("tabindex") && (n.tabIndex = -1);
		let a = Bd(n, i ? n : r);
		return a !== null && this.returnFocusByKey.set(e, a), PZ(t) && this.swipes.set(e, Jm(n, n, () => this.dismiss(e))), !0;
	}
	close(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (t.hasAttribute("hidden")) return !0;
		let n = this.returnFocusByKey.get(e);
		return this.returnFocusByKey.delete(e), this.swipes.get(e)?.(), this.swipes.delete(e), t.contains(document.activeElement) && qd(Ud(n, this.components), t), t.setAttribute("hidden", ""), !0;
	}
	closeAll() {
		for (let e of this.root.querySelectorAll(`[${cm}]:not([hidden])`)) {
			let t = e.getAttribute(cm);
			t !== null && this.close(t);
		}
	}
	find(e) {
		return this.root.querySelector(`[${cm}="${wi(e)}"]`);
	}
	handleClick(e) {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest(`[${um}]`);
		if (n === null) return;
		let r = n.closest(`[${cm}]`);
		if (!(r instanceof HTMLElement) || r.hasAttribute("hidden") || !r.hasAttribute("data-ui-dialog-close-backdrop")) return;
		let i = r.getAttribute(cm);
		i !== null && this.dismiss(i);
	}
	handleKeydown(e) {
		if (e.defaultPrevented || A(e)) return;
		let t = this.getTopmostOpen();
		if (!(t === null || _m(t))) {
			if (e.key === "Escape" && t.hasAttribute("data-ui-dialog-close-escape") && !Em() && !Pc(e)) {
				let n = t.getAttribute(cm);
				n !== null && (e.preventDefault(), this.dismiss(n));
				return;
			}
			e.key === "Tab" && t.hasAttribute("data-ui-dialog-modal") && Md(t, e);
		}
	}
	dismiss(e) {
		let t = this.find(e), n = t !== null && !t.hasAttribute("hidden");
		return !this.close(e) || !n || t === null ? !1 : (t.querySelector(S)?.dispatchEvent(new Event("close", { bubbles: !0 })), !0);
	}
	getTopmostOpen() {
		return hm(this.root);
	}
};
function NZ(e) {
	let t = e.target instanceof Element ? e.target.closest(`[${um}]`) : null;
	t !== null && t.closest("[data-ui-dialog]:not([hidden])") !== null && e.preventDefault();
}
function PZ(e) {
	return e.getAttribute("data-ui-dialog-placement") === "bottom" && (e.hasAttribute("data-ui-dialog-close-backdrop") || e.hasAttribute("data-ui-dialog-close-escape"));
}
//#endregion
//#region src/interactions/leave-dialog.ts
var FZ = "ui-leave", IZ = new $_("data-ui-leave-part"), LZ = "560px", RZ = null, zZ = null;
function BZ(e, t) {
	RZ ??= VZ();
	let n = RZ;
	n.isConnected || document.body.append(n), HZ(n, "title", E.text("ui.leave.title")), HZ(n, "message", E.text("ui.leave.message")), HZ(n, "stay", E.text("ui.leave.stay")), HZ(n, "leave", E.text("ui.leave.confirm")), zZ = {
		dialogs: e,
		leave: t
	}, e.open(FZ);
}
function VZ() {
	let { dialog: e, surface: t } = Q_({
		key: FZ,
		className: "ui-leave-dialog",
		role: "alertdialog",
		labelledBy: "ui-leave-title",
		describedBy: "ui-leave-message",
		closesOnEscapeAndBackdrop: !0
	});
	t.style.setProperty("--ui-max-width-sm", LZ);
	let n = IZ.element("h2", "ui-leave-dialog__title ui-text-type--subtitle", "title"), r = IZ.element("p", "ui-leave-dialog__message ui-text-type--body", "message");
	return n.id = "ui-leave-title", r.id = "ui-leave-message", t.append(n, r, IZ.actions(IZ.button("ui-button--ghost", "stay"), IZ.button("ui-button--danger", "leave"))), e.addEventListener("click", (e) => {
		let t = IZ.pressed(e);
		if (t !== "stay" && t !== "leave") return;
		let n = zZ;
		zZ = null, n?.dialogs.close(FZ), t === "leave" && n?.leave();
	}), e;
}
function HZ(e, t, n) {
	let r = IZ.find(e, t);
	r !== null && r.textContent !== n && (r.textContent = n);
}
//#endregion
//#region src/interactions/leave-guard.ts
var UZ = class {
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
		let t = WZ(e, this.options.window.location.href);
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
function WZ(e, t) {
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
	return th(s) ? s : null;
}
//#endregion
//#region src/effects/address-history.ts
var GZ = "neEntry", KZ = class {
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
		this.window = e.window, this.revisit = e.revisit, this.switchRuntime = e.switchRuntime, this.load = e.load, this.route = e.window.location.pathname, this.search = e.window.location.search, this.entry = qZ(e.window.history.state) ?? 0, qZ(e.window.history.state) === null && e.window.history.replaceState({ [GZ]: this.entry }, ""), e.window.addEventListener("popstate", () => this.onPopState());
	}
	replace(e) {
		this.write(pZ(this.route, e), !1);
	}
	push(e) {
		let t = pZ(this.route, e), n = this.window.location;
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
		t ? (this.entry++, this.window.history.pushState({ [GZ]: this.entry }, "", e)) : this.window.history.replaceState({ [GZ]: this.entry }, "", e), this.search = this.window.location.search;
	}
	onPopState() {
		let e = this.window.location, t = qZ(this.window.history.state), n = t === null ? null : t - this.entry;
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
		}, this.switchRuntime(e.search, r) || this.revisit(YZ(e.search));
	}
};
function qZ(e) {
	if (typeof e != "object" || !e) return null;
	let t = e[GZ];
	return typeof t == "number" ? t : null;
}
function JZ(e, t, n) {
	if (n.length === 0) return !1;
	let r = new URLSearchParams(e), i = new URLSearchParams(t);
	return n.some((e) => r.getAll(e).join(",") !== i.getAll(e).join(","));
}
function YZ(e) {
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
var XZ = class {
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
		!this.state.set(e, t, n, QZ(i[0]?.component)) && !this.restoring || o || this.notifyValueChanged({
			reference: e,
			propertyName: i[0]?.propertyName ?? this.addressResolver.getPropertyName(e.propertyId) ?? "",
			dynamicParameters: t,
			value: a,
			local: r,
			components: i.map((e) => e.component)
		});
	}
	shownValue(e, t) {
		return as(t, () => this.addressResolver.isTranslatable(e));
	}
	holdsProperty(e, t) {
		if (!this.isHeld(e)) return !1;
		let n = e.getAttribute(qe), r = n === null ? void 0 : this.addressResolver.getBindingById(Number(n));
		return r === void 0 || r.propertyId === t;
	}
	recordValue(e, t, n) {
		let r = this.addressResolver.resolveProperties(e, t);
		return this.state.set(e, t, n, QZ(r[0]?.component)) ? {
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
			(typeof n == "string" || Do(n) ? this.addressResolver.isTranslatable(t.reference) : Eo(n)) && (e === void 0 || e(n)) && this.applyPropertyValue(t.reference, t.dynamicParameters, n, !1);
		}
	}
	rewriteStatic(e, t, n) {
		let r = this.addressResolver.resolvePropertyOn(e, t);
		if (r === null) return;
		let i = `[${Ke}${Ti(r.propertyName)}]`;
		this.applyOperations(r, this.shownValue(t, n), (t) => Oi(e, t, () => ZZ(e, i)));
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
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(qe))), r = e.closest(S);
		return n === void 0 || r === null ? !1 : this.applyToComponent(r, {
			componentId: n.componentId,
			propertyId: n.propertyId
		}, t);
	}
	restoreBoundValue(e, t) {
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(qe)));
		if (n === void 0) return;
		let r = {
			componentId: n.componentId,
			propertyId: n.propertyId
		};
		if (!this.state.has(r, t)) {
			cc(e);
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
function ZZ(e, t) {
	if (e.matches(t)) return [e];
	for (let n of e.querySelectorAll(t)) if (n.closest(S) === e) return [n];
	return [e];
}
function QZ(e) {
	let t = [], n = e?.closest("[data-ui-key]") ?? null;
	for (; n !== null;) {
		let e = n.parentElement?.closest(S) ?? null, r = e === null ? 0 : T(e), i = n.getAttribute(y);
		e !== null && r > 0 && i !== null && t.push({
			host: r,
			hostParameters: ia(e, ra(e)),
			key: i
		}), n = n.parentElement?.closest("[data-ui-key]") ?? null;
	}
	return t;
}
//#endregion
//#region src/updates/reactive-source-registry.ts
var $Z = "EndValue", eQ = class {
	watchers = /* @__PURE__ */ new Map();
	sourcesByComponent = /* @__PURE__ */ new Map();
	propertyPatchEngine;
	edits;
	constructor(e, t) {
		if (this.propertyPatchEngine = e, this.edits = t, e.addValueChangeHandler((e) => this.notify(e)), t !== void 0) for (let e of Xd) t.root.addEventListener(e, (e) => this.applyEditedValue(e, t), !0);
	}
	watch(e, t) {
		let n = w(e.componentId), r = nQ(n, e.propertyId), i = this.watchers.get(r);
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
		let t = this.edits?.root.querySelector(`[data-ui-id="${w(e.componentId)}"]`) ?? null, n = t === null ? null : tQ(e, this.edits?.metadata) ? t.querySelector(`[${Dt}]`) : ac(t);
		this.edits !== void 0 && n !== null && this.propertyPatchEngine.recordValue(e, [], this.edits.valueReaders.readBound(n));
	}
	applyEditedValue(e, t) {
		if (!(e.target instanceof Element)) return;
		let n = ha(e.target), r = n === null ? void 0 : this.sourcesByComponent.get(n);
		if (r === void 0) return;
		let i = t.valueReaders.readBound(e.target), a = e.target.hasAttribute(Dt);
		for (let e of r) {
			if (t.metadata !== void 0 && tQ(e, t.metadata) !== a) continue;
			let n = this.propertyPatchEngine.recordValue(e, [], i);
			n !== null && this.notify(n);
		}
	}
	notify(e) {
		let t = nQ(w(e.reference.componentId), e.reference.propertyId), n = this.watchers.get(t);
		if (n !== void 0) for (let t of n) t(e);
	}
};
function tQ(e, t) {
	return t?.getPropertyDefinition(e.propertyId)?.propertyName === $Z;
}
function nQ(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/items/composite-slots.ts
function rQ(e) {
	let t = [];
	for (let n of e.children) {
		let e = n.hasAttribute("data-ui-key") ? n.firstElementChild : null, r = e === null ? 0 : T(e);
		e !== null && r > 0 && t.push([e, r]);
	}
	return t;
}
//#endregion
//#region src/items/held-collections.ts
var iQ = class {
	collections = /* @__PURE__ */ new Map();
	waiting = /* @__PURE__ */ new WeakMap();
	hold(e, t) {
		this.collections.set(e, aQ(t));
	}
	apply(e) {
		let t = w(e.component?.id), n = this.collections.get(t);
		switch (n === void 0 && (n = [], this.collections.set(t, n)), Vi(e.action)) {
			case "Insert":
				for (let t of e.items ?? []) oQ(n, t);
				break;
			case "Remove":
				for (let t of e.items ?? []) sQ(n, t.key);
				break;
			case "Replace":
				for (let t of e.items ?? []) cQ(n, t);
				break;
			case "Move":
				for (let t of e.moves ?? []) lQ(n, t.key, t.newIndex);
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
function aQ(e) {
	let t = [];
	for (let n of e) typeof n.key == "string" && t.push({
		key: n.key,
		item: n.item
	});
	return t;
}
function oQ(e, t) {
	typeof t.key == "string" && (sQ(e, t.key), e.splice(uQ(t.index, e.length), 0, {
		key: t.key,
		item: t.item
	}));
}
function sQ(e, t) {
	let n = e.findIndex((e) => e.key === t);
	n >= 0 && e.splice(n, 1);
}
function cQ(e, t) {
	if (typeof t.key != "string") return;
	let n = e.findIndex((e) => e.key === (t.oldKey ?? t.key));
	if (n < 0) {
		oQ(e, t);
		return;
	}
	e[n] = {
		key: t.key,
		item: t.item
	};
}
function lQ(e, t, n) {
	let r = e.findIndex((e) => e.key === t);
	if (r < 0) return;
	let [i] = e.splice(r, 1);
	e.splice(uQ(n, e.length), 0, i);
}
function uQ(e, t) {
	return typeof e == "number" && e >= 0 && e < t ? e : t;
}
//#endregion
//#region src/items/item-projections.ts
var dQ = class {
	byHost = /* @__PURE__ */ new Map();
	records = /* @__PURE__ */ new WeakMap();
	reported = /* @__PURE__ */ new Set();
	get isEmpty() {
		return this.byHost.size === 0;
	}
	describe(e, t) {
		this.byHost.set(e, fQ(e, "", t.map((e) => e.split("."))));
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
function fQ(e, t, n) {
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
	for (let [n, a] of r) i.set(n, a.whole || a.rest.length === 0 ? null : fQ(e, `${t}${a.name}.`, a.rest));
	return {
		host: e,
		prefix: t,
		members: i
	};
}
function pQ(e) {
	let t = new dQ();
	for (let n of e.metadata.items) n.itemPaths !== null && n.itemPaths !== void 0 && t.describe(w(n.componentId), n.itemPaths);
	return t;
}
//#endregion
//#region src/items/pending-moves.ts
var mQ = class {
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
}, hQ = class {
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
function gQ(e, t) {
	let n = _Q(e[t], "Reset");
	if (n === null) return null;
	let r = w(n.component?.id), i = n.component?.dynamicParameters ?? [];
	if (r <= 0) return null;
	let a = null, o = null, s = t + 1;
	for (; s < e.length; s++) {
		let t = _Q(e[s], "Insert");
		if (t === null || w(t.component?.id) !== r || !mf(i, t.component?.dynamicParameters ?? [])) break;
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
function _Q(e, t) {
	if (e === void 0 || Ui(e) !== "CollectionChange") return null;
	let n = e;
	return Vi(n.action) === t ? n : null;
}
//#endregion
//#region src/updates/collection-sinks.ts
var vQ = class {
	handlers = /* @__PURE__ */ new Map();
	register(e) {
		this.handlers.set(e.kind, e.handler);
	}
	dispatch(e, t) {
		let n = this.handlers.get(e);
		return n !== void 0 && (n(t), !0);
	}
};
function yQ(e, t, n, r) {
	return {
		action: Vi(e.action),
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
var bQ = [], xQ = class {
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
	held = new iQ();
	projections;
	moves = new mQ({
		indexOf: (e, t) => this.indexOfRow(e, t),
		move: (e, t, n) => this.moveRow(e, t, n)
	});
	transfers = new hQ({
		take: (e, t) => this.takeRow(e, t),
		restore: (e, t) => this.restoreRow(e, t),
		place: (e, t, n, r) => this.placeRow(e, t, n, r),
		remove: (e, t) => this.removeRow(e, t),
		holds: (e, t) => DQ(H(e), t) !== null,
		itemOf: (e) => this.readItemValue(e)
	});
	constructor(e, t, n, r, i, a, o, s) {
		this.metadata = e, this.propertyPatchEngine = t, this.state = n, this.itemsRenderer = r, this.itemsTemplates = i, this.dom = a, this.virtualization = o, this.sinks = s, r.setRowFiller((e) => this.fillHeldCollections(e)), this.projections = pQ(e), this.projections.isEmpty || lw((e, t) => this.projections.check(e, t));
	}
	fillHeldCollections(e) {
		let t = [];
		for (let n of e.querySelectorAll(`[${b}]`)) {
			let e = ha(n);
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
			return n === void 0 && (n = OQ(e), t.set(e, n)), n;
		};
		for (let e of this.dom.root.querySelectorAll(`[${b}]`)) {
			let t = ga(e);
			if (t === null) continue;
			let r = this.metadata.getItemValues(t.componentId, t.dynamicParameters);
			this.projections.isEmpty || this.projections.mark(t.componentId, r);
			for (let i of r) this.registerItemValue(t.componentId, n(e), i.key, i.item);
		}
		for (let t of e?.updates ?? []) {
			if (Ui(t) !== "CollectionChange") continue;
			let e = t;
			if (Vi(e.action) !== "Insert") continue;
			let r = w(e.component?.id);
			for (let t of this.findItemsHosts(r, e.component?.dynamicParameters ?? [])) {
				let i = n(t);
				for (let t of e.items ?? []) this.registerItemValue(r, i, t.key, t.item);
			}
		}
	}
	registerItemValue(e, t, n, r) {
		if (n == null) return;
		let i = t.get(n) ?? null;
		if (i !== null && this.readItemScope(i) === void 0 && (this.itemsRenderer.registerItemScope(i, EQ(i), r), this.metadata.getItemsTemplateMetadata(e)?.composite != null)) for (let [e, t] of rQ(i)) this.itemsRenderer.registerItemScope(e, t, r);
	}
	readItemScope(e) {
		let t = this.itemsRenderer.getItemScope(e);
		if (t !== void 0) return t;
		let n = e.firstElementChild;
		return n === null ? void 0 : this.itemsRenderer.getItemScope(n);
	}
	initializeItemsHosts() {
		for (let e of this.dom.root.querySelectorAll(`[${b}]`)) {
			let t = ha(e);
			t !== null && this.syncItemsHost(e, t);
		}
	}
	resortHost(e) {
		let t = ha(e);
		t !== null && this.syncItemsHost(e, t);
	}
	syncItemsHost(e, t) {
		Wz(e, t, {
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
		let n = u() ? performance.now() : -1, r = vf();
		for (let e = 0; e < t.length; e++) {
			let n = t[e];
			try {
				let r = gQ(t, e);
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
		r !== null && yf(r), n >= 0 && d(`applied ${t.length} server update(s)`, n);
	}
	namesSink(e) {
		return this.dom.findComponent(e.componentId, e.dynamicParameters)?.hasAttribute(ot) === !0;
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
		this.transfers.around(e, () => this.moves.around(e, bQ, () => this.refillHostRows(e, t)));
	}
	refillHostRows(e, t) {
		if (V(e) === "virtualized") {
			let n = this.virtualization.refill(e, t.items.filter((e) => e.key !== null && e.key !== void 0).map((e) => ({
				key: e.key,
				item: e.item
			})));
			this.state.forgetRows(t.componentId, t.dynamicParameters, n), this.syncItemsHost(e, t.componentId), this.dom.invalidate(e);
			return;
		}
		let n = this.itemsRenderer.getAncestorStack(e), r = OQ(e), i = [], a = [], o = null;
		for (let e of t.items) {
			let c = e.key ?? null;
			if (c === null) {
				s("collection insert carried no item key.", e);
				continue;
			}
			let l = r.get(c) ?? null;
			if (r.delete(c), l !== null && mf(this.readItemValue(l), e.item)) {
				i.push(l);
				continue;
			}
			let u = this.renderItemElement(t.componentId, e.item, c, n);
			if (l !== null) {
				let e = $u(l);
				e !== null && u !== null && (o = {
					row: u,
					held: e
				}), l.remove(), a.push(c);
			}
			u !== null && i.push(u);
		}
		let c = V(e) === "windowed";
		for (let [t, n] of r) {
			let r = c ? $u(n) : null;
			n.remove(), ed(e, null, r), a.push(t);
		}
		if (this.state.forgetRows(t.componentId, t.dynamicParameters, a), TQ(e, i), o !== null && ed(e, o.row, o.held), c) for (let t of i) td(e, t);
		this.syncItemsHost(e, t.componentId), this.dom.invalidate(e);
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
		switch (Ui(e)) {
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
		let t = w(e.address?.component?.id), n = Hi(e.address?.property), r = e.address?.component?.dynamicParameters ?? [];
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
			this.sinks.dispatch(i, yQ(e, r, t, n)) || s("no collection sink is registered for the kind the component names.", {
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
			a ? l("a collection change for a host inside an item template is held until a row draws it.", { componentId: t }) : (Vi(e.action) !== "Reset" || (e.items ?? []).length > 0) && s("items host was not found for a collection change update.", e);
			return;
		}
		let c = Vi(e.action) === "Move" ? CQ(e.moves ?? []) : bQ;
		for (let n of o) a && this.held.isWaiting(n) || this.transfers.around(n, () => this.moves.around(n, c, () => this.applyCollectionChangeToHost(n, t, e)));
	}
	applyCollectionChangeToHost(e, t, n) {
		if (V(e) === "virtualized") {
			this.applyVirtualizedCollectionChange(e, n), this.afterRowsChanged(e, t);
			return;
		}
		switch (Vi(n.action)) {
			case "Insert":
				this.applyCollectionInsert(e, t, n.items ?? []);
				break;
			case "Remove":
				SQ(e, n.items ?? []);
				break;
			case "Replace":
				this.applyCollectionReplace(e, t, n.items ?? []);
				break;
			case "Move":
				wQ(e, n.moves ?? []);
				break;
			case "Reset":
				e.replaceChildren(), Uw(e);
				break;
			default:
				s("collection update action is not supported.", n);
				return;
		}
		this.afterRowsChanged(e, t);
	}
	afterRowsChanged(e, t = ha(e)) {
		t !== null && this.syncItemsHost(e, t), this.dom.invalidate(e);
	}
	indexOfRow(e, t) {
		let n = V(e) === "virtualized" ? this.virtualization.keysOf(e)?.indexOf(t) ?? -1 : Lw(e, H(e)).findIndex((e) => e.getAttribute(y) === t);
		return n < 0 ? null : n + HC(e);
	}
	moveRow(e, t, n) {
		let r = ha(e);
		if (r === null) return;
		let i = Math.max(0, n - HC(e));
		V(e) === "virtualized" ? this.virtualization.move(e, t, i) : wQ(e, [{
			key: t,
			newIndex: i
		}]), this.afterRowsChanged(e, r);
	}
	takeRow(e, t) {
		let n = H(e), r = DQ(n, t);
		if (r === null) return null;
		let i = Lw(e, n), a = i.indexOf(r);
		return Bw(i, r), r.remove(), this.afterRowsChanged(e), {
			element: r,
			index: a
		};
	}
	restoreRow(e, t) {
		let n = Lw(e, H(e));
		vT(t.element), e.insertBefore(t.element, zw(n, t.element, t.index)), this.afterRowsChanged(e);
	}
	placeRow(e, t, n, r) {
		let i = ha(e), a = i === null ? null : this.renderItemElement(i, n, t, this.itemsRenderer.getAncestorStack(e));
		return a === null ? null : (e.insertBefore(a, zw(Lw(e, H(e)), a, r)), this.afterRowsChanged(e), a);
	}
	removeRow(e, t) {
		Bw(Lw(e, H(e)), t), t.remove(), this.afterRowsChanged(e);
	}
	forgetRowState(e, t, n) {
		switch (Vi(n.action)) {
			case "Remove":
			case "Replace":
				this.state.forgetRows(e, t, (n.items ?? []).map((e) => e.oldKey ?? e.key).filter((e) => typeof e == "string"));
				break;
			case "Reset": this.state.forgetHost(e, t);
		}
	}
	applyVirtualizedCollectionChange(e, t) {
		switch (Vi(t.action)) {
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
			let e = lH(r);
			e !== null && n.push(e);
		}
		return n;
	}
	applyCollectionInsert(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = Lw(e, H(e));
		for (let a of n) {
			let n = a.key ?? null;
			if (n === null) {
				s("collection insert carried no item key.", a);
				continue;
			}
			let o = this.renderItemElement(t, a.item, n, r);
			o !== null && (e.insertBefore(o, zw(i, o, a.index ?? null)), td(e, o));
		}
	}
	renderItemElement(e, t, n, r) {
		return vG(e, t, n, r, {
			metadata: this.metadata,
			templates: this.itemsTemplates,
			renderer: this.itemsRenderer
		});
	}
	applyCollectionReplace(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = H(e), a = Lw(e, i), o = OQ(e, i);
		for (let i of n) {
			let n = i.key ?? null;
			if (n === null) {
				s("collection replace carried no item key.", i);
				continue;
			}
			let c = o.get(i.oldKey ?? n) ?? null, l = this.renderItemElement(t, i.item, n, r);
			if (l !== null) {
				if (o.delete(i.oldKey ?? n), o.set(n, l), c !== null) {
					let t = $u(c);
					Hw(a, c, l), c.replaceWith(l), ed(e, l, t);
				} else e.insertBefore(l, zw(a, l, i.index ?? null));
			}
		}
	}
};
function SQ(e, t) {
	let n = H(e), r = Lw(e, n), i = OQ(e, n), a = Qu(e), o = a === null ? [] : n.filter((e) => e instanceof HTMLElement);
	for (let e of t) {
		let t = e.key ?? null, n = t === null ? null : i.get(t) ?? null;
		if (t === null || n === null) {
			s("collection remove did not resolve an item.", e);
			continue;
		}
		let c = a !== null && n instanceof HTMLElement ? Yu(a, o, n) : null;
		i.delete(t), Bw(r, n), n.remove();
		let l = o.indexOf(n);
		l >= 0 && o.splice(l, 1), c?.();
	}
}
function CQ(e) {
	return e.map((e) => e.key).filter((e) => typeof e == "string");
}
function wQ(e, t) {
	let n = H(e), r = Lw(e, n), i = OQ(e, n);
	for (let n of t) {
		let t = n.key === null || n.key === void 0 ? null : i.get(n.key) ?? null;
		if (t === null) {
			s("collection move did not resolve an item.", n);
			continue;
		}
		let a = Vw(r, t, n.newIndex ?? null);
		e.insertBefore(t, a ?? r[r.length - 2]?.nextSibling ?? null);
	}
}
function TQ(e, t) {
	let n = null;
	for (let r of t) {
		let t = n === null ? H(e)[0] ?? null : n.nextElementSibling;
		r !== t && e.insertBefore(r, t), n = r;
	}
}
function EQ(e) {
	let t = T(e);
	if (t > 0) return t;
	let n = e.firstElementChild;
	return n === null ? 0 : T(n);
}
function DQ(e, t) {
	return e.find((e) => e.getAttribute("data-ui-key") === t) ?? null;
}
function OQ(e, t = H(e)) {
	let n = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.getAttribute(y);
		t !== null && !n.has(t) && n.set(t, e);
	}
	return n;
}
//#endregion
//#region src/interactions/validation-words.ts
function kQ(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = t.message;
	return Eo(n) || Do(n) || typeof n == "string" && n.length > 0 ? {
		message: n,
		severity: jQ(t.severity)
	} : void 0;
}
function AQ(e) {
	let t = e.message;
	if (e.content === !0) return String(t ?? "");
	let n = E.resolve(Eo(t) || Do(t) ? t : String(t ?? ""), !0);
	return typeof n == "string" ? n : "";
}
function jQ(e) {
	let t = Ri(e);
	return t === "Unknown" ? "Error" : t;
}
//#endregion
//#region src/interactions/validation-engine.ts
var MQ = "ui-validation--warning", NQ = "ui-validation--info", PQ = "ui-validation-message--marker", FQ = "top-end", IQ = "right", LQ = "--ui-validation-marker-host", RQ = "ui-validation-mark", zQ = "--ui-validation-presentation", BQ = "--ui-validation-color", VQ = "Validation", HQ = /* @__PURE__ */ new Set(["Value", "EndValue"]), UQ = /* @__PURE__ */ new Set(["Min", "Max"]), WQ = `input:not([type='hidden']), textarea, select, .${li}[role='combobox'], [role='spinbutton']`, GQ = {
	Error: 0,
	Warning: 1,
	Info: 2
}, KQ = {
	Error: xi,
	Warning: MQ,
	Info: NQ
}, qQ = `.${xi}, .${MQ}, .${NQ}`, JQ = {
	Error: "danger",
	Warning: "warning",
	Info: "info"
}, YQ = {
	Error: "error",
	Warning: "warning",
	Info: "info"
}, XQ = {
	Error: `${RQ}--error`,
	Warning: `${RQ}--warning`,
	Info: `${RQ}--info`
}, ZQ = {
	error: "Error",
	warning: "Warning",
	info: "Info"
}, QQ = class {
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
		}, !0), this.applyRenderedMessages(this.root.querySelectorAll(qQ)), z(this.root, qQ, { childList: !0 }, (e) => this.applyRenderedMessages(e)), E.onChange(() => {
			this.applyRenderedMessages(this.root.querySelectorAll(qQ)), this.rewriteMessageLines(), this.rejudgeBounds();
		}), E.onTable(() => this.rewriteShownMessages());
	}
	rewriteShownMessages() {
		for (let e of this.root.querySelectorAll(qQ)) {
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
			r$(t, t$(t) === "Error");
			let e = t.querySelector(`:scope > [${Si}]`), n = e?.textContent ?? "";
			e !== null && n.length !== 0 && (this.recordRenderedMessage(t, e), i$(this.markerMirrors, t, e, {
				message: n,
				severity: t$(t)
			}));
		}
	}
	recordRenderedMessage(e, t) {
		if (this.renderedRead.has(e) || (this.renderedRead.add(e), this.resolveDisplay(T(e), e) !== void 0)) return;
		let n = ts(t), r = t$(e);
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
		if (e.propertyName === VQ) {
			this.applyBoundMessage(e);
			return;
		}
		this.applyGivenValue(e), this.applyChangeTrigger(e);
	}
	applyGivenValue(e) {
		let t = HQ.has(e.propertyName), n = UQ.has(e.propertyName);
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
		let t = w(e.reference.componentId), n = kQ(e.value);
		for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) n === void 0 ? this.boundMessageByElement.delete(r) : this.boundMessageByElement.set(r, n), this.touchedElements.add(r), this.applyCurrentState(t, r);
	}
	applyChangeTrigger(e) {
		let t = w(e.reference.componentId), n = this.options.metadata.getValidationsForComponent(t).filter((t) => Li(t.trigger) === "Change" && t.target.propertyId === e.reference.propertyId);
		if (n.length !== 0) for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) this.evaluateAndApply(t, r, n, e.value);
	}
	applyServerRefusal(e) {
		let t = w(e.address?.component?.id), n = e.address?.component?.dynamicParameters ?? [], r = e.message ?? "", i = Eo(r) || typeof r == "string" && r.length > 0;
		for (let a of this.options.dom.findAllComponents(t, n)) i ? (this.refusalByElement.set(a, {
			message: r,
			severity: jQ(e.severity),
			content: e.content === !0,
			property: Hi(e.address?.property)
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
		let n = k(t) || D(t) ? null : $Q(t, (e) => this.readValue(e)), r = this.boundRefusalByElement.get(t)?.message;
		return e$(r, n) ? n !== null : (n === null ? this.forgetBoundRefusal(t) : (this.boundRefusalByElement.set(t, {
			message: n,
			severity: "Error"
		}), this.boundRefused.add(t), this.touchedElements.add(t), this.refusalByElement.delete(t)), this.applyCurrentState(e, t), n !== null);
	}
	readValue(e) {
		return this.options.readValue?.(e) ?? this.options.valueReaders.readBound(e);
	}
	readRuleValue(e) {
		let t = ac(e);
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
			severity: ZQ[t]
		}), this.applyCurrentState(T(e), e);
	}
	entryRefusal(e, t, n) {
		for (let r of this.options.metadata.getValidationsForComponent(T(e))) if (jQ(r.severity) === "Error" && Nf(t, r.operator, r.value) && !Nf(n, r.operator, r.value)) return r.message;
		return null;
	}
	judge(e, t) {
		let n = null;
		for (let r of this.options.metadata.getValidationsForComponent(e)) !Nf(t, r.operator, r.value) && (n === null || GQ[jQ(r.severity)] < GQ[jQ(n.severity)]) && (n = r);
		return n === null ? null : {
			severity: YQ[jQ(n.severity)],
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
		n$(this.markerMirrors, t, n), this.writeMessageElsewhere(e, t, n);
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
		}, [], [...e.lines.values()].map(AQ).join("\n"), !0);
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
			severity: jQ(t.severity)
		});
		let c;
		for (let e of n) (c === void 0 || GQ[e.severity] < GQ[c.severity]) && (c = e);
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
		let r = this.options.metadata.getValidationsForComponent(n.componentId).filter((e) => Li(e.trigger) === t);
		r.length !== 0 && this.evaluateAndApply(n.componentId, n.element, r, this.readRuleValue(n.element));
	}
	runSubmitValidation(e) {
		let t = !0, n = /* @__PURE__ */ new Set();
		for (let { component: r } of this.formFields(e)) {
			if (n.has(r.element)) continue;
			n.add(r.element);
			let e = this.options.metadata.getValidationsForComponent(r.componentId).filter((e) => Li(e.trigger) === "Submit");
			e.length > 0 && (this.touchedElements.add(r.element), this.evaluateAndApply(r.componentId, r.element, e, this.readRuleValue(r.element))), this.hasError(r.componentId, r.element) && (t = !1, this.touchedElements.has(r.element) || (this.touchedElements.add(r.element), this.applyCurrentState(r.componentId, r.element)));
		}
		return t;
	}
	*formFields(e) {
		for (let t of this.root.querySelectorAll(`[${Kt}="${wi(e)}"]`)) {
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
			let e = [...t.element.querySelectorAll(WQ)].find((e) => e.closest("[role='listbox'], [role='menu'], [role='dialog']") === null) ?? null;
			if (e !== null) return e.focus({ preventScroll: !0 }), e.scrollIntoView({
				block: "center",
				behavior: qf() ? "auto" : "smooth"
			}), !0;
		}
		return !1;
	}
	hasError(e, t) {
		if (this.boundRefusalByElement.has(t) || this.refusalByElement.get(t)?.severity === "Error") return !0;
		let n = this.failingRulesByElement.get(t);
		if (n === void 0) return !1;
		for (let t of this.options.metadata.getValidationsForComponent(e)) if (n.has(t) && jQ(t.severity) === "Error") return !0;
		return !1;
	}
	evaluateAndApply(e, t, n, r) {
		let i = this.failingRulesByElement.get(t);
		i === void 0 && (i = /* @__PURE__ */ new Set(), this.failingRulesByElement.set(t, i));
		for (let e of n) Nf(r, e.operator, e.value) ? i.delete(e) : i.add(e);
		this.touchedElements.has(t) && this.applyCurrentState(e, t);
	}
};
function $Q(e, t) {
	return PC(e, t) ?? (e.matches($T) ? qE(e) : null);
}
function e$(e, t) {
	return e === void 0 || t === null ? e === void 0 && t === null : Eo(e) && e.key === t.key && JSON.stringify(e.args) === JSON.stringify(t.args);
}
function t$(e) {
	return e.classList.contains(MQ) ? "Warning" : e.classList.contains(NQ) ? "Info" : "Error";
}
function n$(e, t, n) {
	for (let e of Object.values(KQ)) t.classList.toggle(e, n !== void 0 && KQ[n.severity] === e);
	r$(t, n?.severity === "Error");
	let r = t;
	n === void 0 ? r.style.removeProperty(BQ) : r.style.setProperty(BQ, `var(--ui-color-${JQ[n.severity]}-ink)`);
	let i = t.querySelector(":scope > [data-ui-validation-message]") ?? t.querySelector("[data-ui-validation-message]");
	i !== null && (n?.content === !0 ? ($o(i, null), i.textContent = String(n.message ?? "")) : E.writeValue(i, null, n?.message ?? null), i$(e, r, i, n));
}
function r$(e, t) {
	for (let n of e.querySelectorAll(WQ)) {
		let r = n.closest(ci);
		r !== null && e.contains(r) || (t ? n.setAttribute("aria-invalid", "true") : n.removeAttribute("aria-invalid"));
	}
}
function i$(e, t, n, r) {
	let i = getComputedStyle(n), a = i.getPropertyValue(zQ).trim(), o = r !== void 0 && a === "marker";
	if (n.classList.toggle(PQ, o), a$(e, t, a === "elsewhere" ? void 0 : r, n.textContent ?? "", i.getPropertyValue(LQ).trim()), r !== void 0 && o) {
		n.setAttribute(Ie, n.textContent ?? ""), n.setAttribute(Le, FQ), n.setAttribute(ze, YQ[r.severity]), t.setAttribute(Re, ""), t.contains(document.activeElement) ? mN(n) : hN(n);
		return;
	}
	n.removeAttribute(Ie), n.removeAttribute(Le), n.removeAttribute(ze), t.removeAttribute(Re), hN(n);
}
function a$(e, t, n, r, i) {
	let a = e.get(t), o = n === void 0 || i.length === 0 ? null : s$(t, i);
	if (n === void 0 || o === null) {
		a !== void 0 && o$(a), e.delete(t);
		return;
	}
	let s = a ?? document.createElement("span");
	s.className = `${RQ} ${XQ[n.severity]}`, s.textContent = r, s.setAttribute(Ie, r), s.setAttribute(Le, IQ), s.setAttribute(ze, YQ[n.severity]), s.setAttribute(Be, ""), s.parentElement !== o && (o$(s), o.append(s)), o.setAttribute(Re, ""), e.set(t, s), hN(s);
}
function o$(e) {
	let t = e.parentElement;
	e.remove(), t !== null && t.querySelector(`:scope > .${RQ}`) === null && t.removeAttribute(Re);
}
function s$(e, t) {
	for (let n = e.parentElement; n !== null; n = n.parentElement) {
		let e = n.querySelector(`:scope > .${t}`);
		if (e !== null) return e;
	}
	return null;
}
//#endregion
//#region src/items/row-decorators.ts
var c$ = class {
	decorators = /* @__PURE__ */ new Map();
	register(e) {
		this.decorators.set(e.kind, e.decorate);
	}
	get(e) {
		return this.decorators.get(e);
	}
}, l$ = "card-header-shown", u$ = `[${mi}], [${hi}], [${gi}], [${_i}], [${vi}]`;
function d$(e) {
	let t = e.parentElement?.parentElement;
	if (t == null || !t.classList.contains("ui-card__header")) return;
	let n = !e.matches(u$);
	t.classList.contains("ui-card__header--empty") !== n && t.classList.toggle(yi, n);
}
//#endregion
//#region src/updates/menu-surface.ts
var f$ = "menu-surface";
function p$(e) {
	let t = e.parentElement;
	if (t === null || !t.matches(".ui-context-menu, .ui-split-button__menu")) return;
	let n = IY(e);
	n === null ? t.removeAttribute(rn) : t.getAttribute("data-ui-menu-surface") !== n && t.setAttribute(rn, n);
}
//#endregion
//#region src/updates/tooltip-name.ts
var m$ = "tooltip-name";
function h$(e, t, n) {
	let r = Mj(e.getAttribute(Ie));
	if ($o(t, n), r.trim().length === 0) {
		t.hasAttribute(n) && t.removeAttribute(n);
		return;
	}
	t.getAttribute(n) !== r && t.setAttribute(n, r);
}
//#endregion
//#region src/updates/dom-operation-registry.ts
var g$ = /* @__PURE__ */ new WeakMap(), _$ = /* @__PURE__ */ new WeakMap(), v$ = class {
	handlers = /* @__PURE__ */ new Map();
	constructor() {
		this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(zi(e), t);
	}
	apply(e) {
		let t = zi(e.operation.kind), n = this.handlers.get(t);
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
			let t = $s(e.convertedValue);
			e.target.textContent !== t && (e.target.textContent = t), $o(e.target, null);
		}), this.register("Markup", (e) => {
			Pj(e.target, ec(e.convertedValue) ? "" : $s(e.convertedValue)), $o(e.target, null);
		}), this.register("Attribute", (e) => {
			let t = E$(e.operation);
			if ($o(e.target, t), e.operation.convertsNull !== !0 && ec(e.value) || ec(e.convertedValue)) {
				T$(e.target, t);
				return;
			}
			w$(e.target, t, $s(e.convertedValue));
		}), this.register("RemoveAttribute", (e) => {
			let t = E$(e.operation);
			$o(e.target, t), T$(e.target, t);
		}), this.register("ToggleAttribute", (e) => {
			let t = E$(e.operation), n = e.operation.condition ?? "HasValue", r = !ec(e.value) && y$(e.value, n), i = e.operation.value ?? (ec(e.convertedValue) || b$(n) ? "" : $s(e.convertedValue));
			x$(e.target, C$(e), t, r, i);
		}), this.register("Class", (e) => {
			let t = !ec(e.value) && y$(e.value, e.operation.condition ?? "None") ? $s(e.convertedValue).trim() : "";
			S$(e.target, C$(e), t, AY(e.operation.converter ?? ""));
		}), this.register("ToggleClass", (e) => {
			let t = E$(e.operation), n = !ec(e.value) && y$(e.value, e.operation.condition ?? "IsTrue");
			if (e.target.classList.toggle(t, n), e.operation.converter !== null && e.operation.converter !== void 0 && e.operation.converter.trim().length > 0) {
				let t = n ? $s(e.convertedValue).trim() : "";
				S$(e.target, C$(e), t, AY(e.operation.converter));
			}
		}), this.register("Style", (e) => {
			let t = E$(e.operation), n = e.target;
			if (ec(e.value) || ec(e.convertedValue) || e.convertedValue === "") {
				n.style.getPropertyValue(t).length > 0 && n.style.removeProperty(t);
				return;
			}
			let r = $s(e.convertedValue);
			n.style.getPropertyValue(t) !== r && n.style.setProperty(t, r);
		}), this.register("Data", () => {}), this.register(m$, (e) => h$(e.resolved.component, e.target, E$(e.operation))), this.register(Qq, (e) => tJ(e.target, e.value)), this.register(l$, (e) => d$(e.resolved.component)), this.register(os, (e) => ss(e.target)), this.register(Kq, (e) => Zq(e.target)), this.register(Sk, (e) => wk(e.target)), this.register(Dk, (e) => Ak(e.resolved.component)), this.register(qy, (e) => {
			let t = ab(e.target);
			t !== "keep" && x$(e.resolved.component, qy, E$(e.operation), t === "show", "");
		}), this.register(f$, (e) => p$(e.target)), this.register("Property", (e) => {
			let t = E$(e.operation), n = e.target, r = ec(e.convertedValue) ? "" : e.convertedValue;
			n[t] !== r && (n[t] = r);
		});
	}
};
function y$(e, t) {
	switch (Bi(t)) {
		case "None": return !0;
		case "HasValue": return !ec(e);
		case "HasText": return typeof e == "string" ? e.trim().length > 0 : !ec(e) && String(e).trim().length > 0;
		case "IsTrue": return e === !0;
		case "IsFalse": return e === !1;
		case "DrawsIcon": return bh(e).length > 0;
		default: return !ec(e);
	}
}
function b$(e) {
	let t = Bi(e);
	return t === "IsTrue" || t === "IsFalse";
}
function x$(e, t, n, r, i) {
	let a = _$.get(e);
	a === void 0 && (a = /* @__PURE__ */ new Map(), _$.set(e, a));
	let o = a.get(n);
	if (o === void 0 && (o = /* @__PURE__ */ new Set(), a.set(n, o)), r) {
		o.add(t), w$(e, n, i);
		return;
	}
	o.delete(t), o.size === 0 && T$(e, n);
}
function S$(e, t, n, r) {
	let i = g$.get(e);
	i === void 0 && (i = /* @__PURE__ */ new Map(), g$.set(e, i));
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
function C$(e) {
	return `${e.resolved.componentId}:${e.resolved.propertyId}:${e.operation.kind}:${e.operation.name ?? ""}:${e.operation.converter ?? ""}`;
}
function w$(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function T$(e, t) {
	e.hasAttribute(t) && e.removeAttribute(t);
}
function E$(e) {
	let t = e.name;
	if (t == null || t.trim().length === 0) throw Error(`Operation '${e.kind}' requires a name.`);
	return t;
}
//#endregion
//#region src/extensions/converters.ts
var D$ = class {
	converters = /* @__PURE__ */ new Map();
	constructor() {
		this.register({
			name: "*",
			canConvert: (e) => FY.has(e.name),
			convert: (e) => FY.get(e.name)(e.value)
		});
	}
	register(e) {
		let t = O$(e.name), n = {
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
function O$(e) {
	let t = e.trim();
	if (t.length === 0) throw Error("Converter name is required.");
	return t;
}
//#endregion
//#region src/extensions/events.ts
var k$ = class {
	definitions = /* @__PURE__ */ new Map();
	register(e) {
		let t = Zi(e.name);
		if (t.length === 0) throw Error("Event name is required.");
		let n = Zi(e.domEventName) || t;
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
		return this.definitions.get(Zi(e));
	}
};
function A$(e, t) {
	e.root.addEventListener("toggle", (n) => {
		n.target instanceof HTMLDetailsElement && n.target.open === t && e.dispatch(n);
	}, !0);
}
function j$(e) {
	e.register({
		name: "click",
		attach: (e) => {
			e.root.addEventListener("click", e.dispatch, !0), e.root.addEventListener(qu, e.dispatch, !0);
		}
	}), e.registerNative("change"), e.registerNative("focus"), e.registerNative("blur"), e.registerNative("mouse-enter", "mouseenter"), e.registerNative("mouse-leave", "mouseleave"), e.registerNative("toggle"), e.register({
		name: "expand",
		domEventName: "toggle",
		attach: (e) => A$(e, !0)
	}), e.register({
		name: "collapse",
		domEventName: "toggle",
		attach: (e) => A$(e, !1)
	}), e.registerNative("open"), e.registerNative("close"), e.registerNative("search"), e.registerNative("enter"), e.registerNative("escape"), e.registerNative("rename"), e.registerNative("unfold"), e.registerNative("move"), e.registerNative("remove");
}
//#endregion
//#region src/extensions/extension-registry.ts
var M$ = class {
	converters = new D$();
	events = new k$();
	operations = new v$();
	valueReaders;
	collectionSinks = new vQ();
	rowDecorators = new c$();
	constructor(e, t, n, r) {
		j$(this.events), this.valueReaders = new nc(r);
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
}, N$ = "Submenu", P$ = "ui-menu__submenu", F$ = "Select", I$ = ["Header", "Separator"], L$ = {
	kind: "menu",
	decorate: R$
};
function R$(e) {
	if (I$.includes(B$(e.item, "Kind")) && e.row.setAttribute(tn, ""), !z$(e.item)) return;
	let t = e.templates.getVariantTemplate(e.componentId, N$);
	if (t === void 0) {
		s("menu submenu template was not found.", { componentId: e.componentId });
		return;
	}
	let n = e.renderer.renderFromTemplate(t, e.item, e.ancestors);
	if (n === null) return;
	e.row.setAttribute(Xt, ""), B$(e.item, "Kind") === F$ && e.row.setAttribute(Zt, ""), B$(e.item, "Expanded") === !0 && e.row.setAttribute(Qt, "");
	let r = document.createElement("div");
	r.className = P$, r.appendChild(n), MW(r, e.key, e.item), e.row.appendChild(r);
}
function z$(e) {
	let t = B$(e, "Items");
	return Array.isArray(t) && t.length > 0;
}
function B$(e, t) {
	let n = gw(e, t);
	return n.ok ? n.value : void 0;
}
//#endregion
//#region src/items/row-grip.ts
var V$ = {
	kind: "grip",
	decorate: H$
};
function H$(e) {
	e.row.append(U$());
}
function U$() {
	let e = document.createElement("span");
	return e.className = _e, e.setAttribute("role", "button"), E.write(e, "aria-label", "ui.row.drag"), e;
}
//#endregion
//#region src/rendering/page-culture.ts
function W$(e, t, n) {
	let r = t === null ? null : JSON.stringify(t), i = n === null ? null : JSON.stringify(K$(n));
	for (let t of e.querySelectorAll(`[${ut}]`)) G$(t, lt, r), G$(t, mt, i);
}
function G$(e, t, n) {
	n !== null && e.hasAttribute(t) && e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function K$(e) {
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
var q$ = `[${gt}]`;
function J$(e) {
	for (let t of e.querySelectorAll(q$)) t.removeAttribute(gt);
}
//#endregion
//#region src/runtime/engine-start.ts
var Y$ = 2;
function X$(e, t, n) {
	let r = u() ? performance.now() : -1;
	try {
		t(n);
	} catch (t) {
		c(`the ${e} engine failed to start; the page goes on without it.`, t);
	}
	if (r >= 0) {
		let t = performance.now() - r;
		t >= Y$ && l(`the ${e} engine took ${f(t)} to start.`);
	}
}
function Z$(e) {
	return e.name.length > 0 ? `"${e.name}" package` : "package";
}
//#endregion
//#region src/runtime/web-ui-runtime.ts
var Q$ = "ne.standard.ui.windowId", $$ = [
	500,
	1e3,
	2e3
], e1 = 3, t1 = [
	["refusal", ({ root: e }) => LU(e)],
	["file input", ({ root: e, validation: t }) => new b_({
		root: e,
		validation: t
	})],
	["image input", ({ root: e, validation: t, propertyPatchEngine: n, dialogs: r }) => new $v({
		root: e,
		validation: t,
		propertyPatchEngine: n,
		dialogs: r
	})],
	["key value action", ({ root: e, dom: t, propertyPatchEngine: n, validation: r }) => new vy({
		root: e,
		dom: t,
		propertyPatchEngine: n,
		validation: r
	})],
	["field keys", ({ root: e, propertyPatchEngine: t }) => new Uy({
		root: e,
		propertyPatchEngine: t
	})],
	["field box press", ({ root: e }) => new Oy({ root: e })],
	["image fallback", ({ root: e }) => new _b({ root: e })],
	["radio group sync", ({ root: e }) => new Pb({ root: e })],
	["select interaction", ({ root: e, validation: t }) => new Ux({
		root: e,
		validation: t
	})],
	["search input", ({ root: e }) => new Gb({ root: e })],
	["debounced commit", ({ root: e }) => new Iy({ root: e })],
	["commit gate", ({ root: e, propertyPatchEngine: t }) => new nS({
		root: e,
		propertyPatchEngine: t
	})],
	["text area grow", ({ root: e, propertyPatchEngine: t }) => aS() ? void 0 : new oS({
		root: e,
		propertyPatchEngine: t
	})],
	["items selection", ({ root: e, heldRows: t }) => new uB({
		root: e,
		rows: t
	})],
	["range value", ({ root: e, propertyPatchEngine: t }) => new NS({
		root: e,
		propertyPatchEngine: t
	})],
	["color input", ({ root: e, propertyPatchEngine: t }) => new fR({
		root: e,
		propertyPatchEngine: t
	})],
	["temporal picker", ({ root: e, propertyPatchEngine: t }) => new qD({
		root: e,
		propertyPatchEngine: t
	})],
	["theme switcher", ({ root: e, effects: t, dom: n }) => new jO({
		root: e,
		effects: t,
		dom: n
	})],
	["language switcher", ({ root: e, effects: t, dom: n }) => new BO({
		root: e,
		effects: t,
		dom: n
	})],
	["time segment", ({ root: e, propertyPatchEngine: t }) => new UV({
		root: e,
		propertyPatchEngine: t
	})],
	["timestamp", ({ root: e, propertyPatchEngine: t }) => new oH({
		root: e,
		propertyPatchEngine: t
	})],
	["context menu", ({ root: e, dom: t }) => new _A({
		root: e,
		dom: t
	})],
	["split button", ({ root: e }) => new CI({ root: e })],
	["toggle button", ({ root: e }) => new Ty({ root: e })],
	["button group", ({ root: e }) => new kI({ root: e })],
	["menu", ({ root: e }) => new wN({ root: e })],
	["action bar", ({ root: e, dom: t }) => new $A({
		root: e,
		dom: t
	})],
	["collapsible", ({ root: e }) => new mF({ root: e })],
	["menu group", ({ root: e }) => new Kk({ root: e })],
	["menu search", ({ root: e }) => new FP({ root: e })],
	["side drawer", ({ root: e }) => new eF({ root: e })],
	["screen keyboard", () => new GP()],
	["grid splitter", ({ root: e }) => new OF({ root: e })],
	["pane container", ({ root: e }) => new $F({ root: e })],
	["accordion", ({ root: e }) => new NI({ root: e })],
	["tabs", ({ root: e }) => new iL({ root: e })],
	["tabs view", ({ root: e, effects: t }) => new xV({
		root: e,
		effects: t
	})],
	["command bar", ({ root: e }) => new vL({ root: e })],
	["breadcrumbs", ({ root: e }) => new ML({ root: e })],
	["scroll anchor", ({ root: e }) => new wH({ root: e })],
	["first visible key", ({ root: e }) => new _W({ root: e })],
	["surface press", ({ root: e }) => new NR({ root: e })],
	["text selection", ({ root: e }) => new jH({ root: e })],
	["scroll group", ({ root: e }) => new RH({ root: e })],
	["flyout interaction", ({ root: e }) => new Sg({ root: e })],
	["text fold", ({ root: e }) => new PV({ root: e })],
	["tooltip", ({ root: e }) => EM(e)]
], n1 = class {
	windowId;
	options;
	root;
	culturesLanguage = document.documentElement.lang;
	metadata = new Ai(HG());
	hydration = KG();
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
		this.options = e, this.root = e.root ?? document, this.windowId = c1(e.windowIdStorageKey ?? Q$), this.dom = new ma(this.root), E.load(this.root), E.setLanguage(document.documentElement.lang), e.strings !== void 0 && E.register(e.strings), this.gateInbound(this.hydration?.words === null || this.hydration?.words === void 0 ? null : E.loadTableAsync(this.hydration.words.href)), this.extensions = new M$(e.converters, e.eventDefinitions, e.domOperations, e.valueReaders), this.extensions.registerRowDecorator(L$), this.extensions.registerRowDecorator(V$), this.extensions.registerRowDecorator(Db);
		let t = new na(this.dom, this.metadata), n = this.extensions.operations, r = new xK(), i = new XZ(t, n, this.extensions, r);
		this.reactiveSources = new eQ(i, {
			root: this.root,
			valueReaders: this.extensions.valueReaders,
			metadata: this.metadata
		}), this.dialogs = new MZ({
			root: this.root,
			dom: this.dom
		}), this.notifications = new tZ({
			root: this.root,
			dom: this.dom
		}), this.address = new KZ({
			window,
			revisit: (e) => void this.navigateInPlaceAsync(e),
			switchRuntime: (e, t) => this.revisitRuntime(e, t),
			load: () => window.location.reload()
		});
		let a = (e) => this.eventPipeline.dispatchCommandAsync({
			eventId: 0,
			action: e,
			dynamicParameters: []
		}).catch((e) => (s("running a notification's action failed.", e), !1)), o = (e) => eV(e, (e) => this.leaveGuard.navigate(e), (e) => void a(e)), u = $G(document.documentElement, this.windowId, o);
		this.effects = new bZ({
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
			systemNotifications: QB(u)
		});
		let d = new Vf(this.metadata), f, p = new Df(d, i, new Mf(), {
			root: this.root,
			effects: this.effects,
			dom: this.dom,
			metadata: this.metadata,
			valueReaders: this.extensions.valueReaders,
			writeBack: (e, t, n) => {
				f?.syncPropertyAsync(w(e.componentId), e.propertyId, t, n).catch((e) => s("writing an interaction's value back failed.", e));
			}
		}), m = new RG(this.dom), h = new OW(this.metadata, m, this.extensions, n, r);
		this.virtualization = new SG({
			root: this.root,
			metadata: this.metadata,
			templates: m,
			renderer: h,
			state: r,
			dom: this.dom
		}), this.updateProcessor = new xQ(this.metadata, i, r, h, m, this.dom, this.virtualization, this.extensions.collectionSinks), E.onChange(() => this.rewriteWords(i, h)), this.rewriteMoments = () => this.rewriteWords(i, h, !0), E.onMomentTick(this.rewriteMoments), new zW({
			root: this.root,
			metadata: this.metadata,
			templates: m,
			renderer: h,
			state: r,
			propertyPatchEngine: i,
			reactiveSources: this.reactiveSources,
			virtualization: this.virtualization
		}), this.transport = new Lq(this.windowId, (e, t) => this.applyChanges(e, t, this.heldRuntime), e.signalR), this.clientState = new ZB({ report: (e) => this.transport.reportClientStateAsync(e) }), this.dispatcher = new gK(this.transport), E.setAsker((e, t) => this.transport.translateAsync(e, t)), this.effects.register(ki.SetLanguage, (e) => {
			let t = e.effect, n = t.language;
			if (typeof n != "string" || n.trim().length === 0) {
				s("set language effect carries no language.", e.effect);
				return;
			}
			let r = typeof t.href == "string" && t.href.length > 0 ? t.href : null;
			this.switchLanguageAsync(n, r).catch((e) => s("switching the page's language failed.", e));
		}), this.effects.register(ki.SetThemeColors, (e) => {
			let t = e.effect, n = ++this.themeColorChanges;
			if (typeof t.css == "string") {
				BG(document.head, t.css);
				return;
			}
			this.transport.setThemeColorsAsync(t.colors ?? null).then((e) => {
				n === this.themeColorChanges && BG(document.head, e);
			}).catch((e) => s("applying the reader's colours failed.", e));
		});
		let g = new Hq(this.transport);
		f = new tf({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: g,
			valueReaders: this.extensions.valueReaders,
			recordSent: (e, t, n) => i.recordValue(e, t, n),
			refuses: (e) => _.refusesBounds(e)
		}), i.setHeldTargets((e) => f?.isHeld(e) === !0), this.settleValues = async () => {
			Py(), await g.whenAnsweredAsync();
		}, this.effects.register(ki.DiscardForm, (e) => {
			let t = e.effect.formId;
			if (typeof t == "string" && t.length !== 0) {
				for (let n of f?.releaseForm(t) ?? []) i.restoreBoundValue(n, e.dom.resolveNearestComponent(n, () => !0)?.dynamicParameters ?? []);
				_.discardForm(t);
			}
		}), this.leaveGuard = new UZ({
			window,
			ask: async (e) => (await f?.whenSent(), (await this.transport.requestLeaveAsync(e)).command?.effects),
			apply: (e) => {
				this.effects.applyAll(e, this.dom), this.windows.reconsider();
			},
			confirm: (e, t) => BZ(this.dialogs, t),
			pending: () => Ny() || g.isBusy,
			settle: () => this.settleValues(),
			follow: (e) => this.followInPlace(e)
		}), this.updateProcessor.addPageHandler((e) => this.leaveGuard.set(e.holdsUnsavedWork === !0)), this.effects.register(ki.ConfirmLeave, (e) => {
			let t = e.effect.target;
			if (!th(t)) {
				s("confirm leave effect names no address of this site; nothing asked.", e.effect);
				return;
			}
			this.leaveGuard.confirm(t);
		});
		let _ = new QQ({
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
			validation: _,
			dialogs: this.dialogs,
			heldRows: this.virtualization
		};
		for (let [e, t] of t1) X$(e, t, this.engineContext);
		X$("number input", ({ root: e, propertyPatchEngine: t }) => {
			this.numberInputs = new MC({
				root: e,
				propertyPatchEngine: t
			});
		}, this.engineContext), X$("tree", ({ root: e, effects: t }) => new zB({
			root: e,
			effects: t,
			rules: {
				metadata: this.metadata,
				state: r,
				renderer: h
			}
		}), this.engineContext), X$("items reorder", ({ root: e }) => new iT({
			root: e,
			services: {
				metadata: this.metadata,
				state: r,
				keysOf: (e) => this.virtualization.keysOf(e)
			}
		}), this.engineContext), X$("press ripple", ({ root: e }) => document.documentElement.hasAttribute("data-ui-press-ripple") ? new eU({
			root: e,
			clicks: (e) => this.metadata.hasServerEventForComponent("click", T(e)) || p.hasEventForComponent("click", T(e))
		}) : void 0, this.engineContext), X$("overlay scrollbars", () => document.documentElement.hasAttribute("data-ui-overlay-scrollbars") ? new pU() : void 0, this.engineContext), this.eventPipeline = new uf({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: this.dispatcher,
			afterEffects: () => this.windows.reconsider(),
			interactionEngine: p,
			eventCatalog: this.extensions.events,
			effects: this.effects,
			events: e.events,
			validationEngine: _,
			valueBinding: f
		});
		for (let e of /* @__PURE__ */ new Set([...this.metadata.getEventNames(), ...d.getSourceEventNames()])) this.eventPipeline.addEvent(e);
		this.eventPipeline.addEvent(_V.name, _V.registration);
		let v = (e) => this.updateProcessor.resortHost(e), ee = tT({
			ahead: (e, t, n) => this.updateProcessor.moves.ahead(e, t, n),
			settle: (e) => this.updateProcessor.moves.settle(e),
			resort: v
		});
		this.eventPipeline.addEvent(ee.name, ee.registration);
		let te = yV(v);
		this.eventPipeline.addEvent(te.name, te.registration);
		let ne = LT(this.updateProcessor.transfers);
		for (let e of this.metadata.getEventNames()) e.startsWith("drop:") && this.eventPipeline.addEvent(e, ne);
		this.eventPipeline.addEvent(Vy.name, Vy.registration), X$("shortcuts", ({ root: e, dom: t }) => new FN({
			root: e,
			viewShortcuts: IN(this.metadata.metadata),
			componentOf: (e) => t.findComponent(e, [])
		}), this.engineContext), X$("item drag", ({ root: e, dom: t }) => new BT({
			root: e,
			targetOf: (e, n) => {
				let r = t.resolveNearestComponent(e, (e) => this.metadata.hasServerEventForComponent("drop:" + n, e))?.element ?? null;
				return r instanceof HTMLElement ? r : null;
			},
			keysOf: (e) => this.virtualization.keysOf(e)
		}), this.engineContext), this.tables = new mz({ root: this.root }), this.windows = new tG({
			root: this.root,
			requestWindow: (e) => this.transport.requestItemWindowAsync(e)
		}), X$("pager", ({ root: e, dom: t }) => new vP({
			root: e,
			dom: t,
			windows: this.windows
		}), this.engineContext), this.pluginContext = {
			...this.engineContext,
			strings: E,
			observeComponents: z,
			observeSize: yF,
			store: new bk(),
			numbers: lC,
			temporal: io,
			icons: { apply: _h },
			badges: { writeCount: EX },
			urls: {
				isImageSource: ah,
				asBrowserReads: ih,
				isSafeLink: Zm,
				isExternalLink: eh
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
			tooltips: pN,
			renames: { open: Ec },
			tables: this.tables,
			rows: DW(m, h, this.virtualization),
			uploads: l_(_),
			selection: Zl,
			popups: tW(this.dom),
			roving: ol,
			typeAhead: TO,
			focus: Od,
			states: bs,
			validation: _,
			wheel: av,
			colors: lW,
			shortcuts: Kc,
			names: Ci
		}, this.transport.onChanges((e, t) => void this.applyChanges(e, void 0, t)), this.transport.onCommandResult((e, t) => {
			let { changes: n, ...r } = e;
			bK(() => this.applyChanges(n, void 0, t), () => {
				!this.holdsRuntime(t) || this.dispatcher.settle(r) || (this.effects.applyAll(e.command?.effects, this.dom), this.windows.reconsider());
			}).catch((e) => c("a pushed command result could not be applied.", e));
		}), this.updateProcessor.addFullResyncHandler(() => {
			this.attachAsync().catch((e) => c("re-attaching after a full resync failed.", e));
		}), this.transport.onReconnecting((e) => {
			s("SignalR reconnecting.", e), this.dispatcher.release(Error("the connection to the server dropped before the command answered.", { cause: e }));
		}), this.transport.onReconnected(async () => {
			l("SignalR reconnected. Reattaching runtime."), await this.attachAsync();
		}), this.transport.onClosed((e) => this.loseConnection(e ?? /* @__PURE__ */ Error("the connection to the server closed."))), this.connection = new cK({
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
		let t = ac(e);
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
		return r.length > 0 && this.heldRuntime !== null && !this.connectionLost && e === window.location.pathname && u1() === null && JZ(t, n, r);
	}
	async switchRuntimeAsync() {
		try {
			await this.settleValues();
		} catch (e) {
			s("the values still on their way did not settle before the page went to another runtime.", e);
		}
		this.dialogs.closeAll(), this.dispatcher.release(/* @__PURE__ */ Error("the page went to another runtime of its route before the command answered.")), this.transport.holdCalls();
		let e = i1();
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
		if (e === E.requestedLanguage) return;
		let n = ++this.languageSwitches, r = t, i = e;
		E.setRequested(e);
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
			if (n !== this.languageSwitches || i === E.language || !await E.switchToAsync(i, r)) return;
			E.notifyChanged();
		} finally {
			n === this.languageSwitches && E.setRequested(null);
		}
	}
	rewriteWords(e, t, n = !1) {
		let r = performance.now();
		this.dom.invalidate(), E.language !== this.culturesLanguage && (this.culturesLanguage = E.language, is(this.root, (e) => W$(e, E.number, E.temporal)));
		let i = n ? Ao : void 0;
		E.rewriteMarks(this.root, n), this.rewriteStaticWords(e, i), e.rewriteWords(i), t.rewriteRowWords(this.root, i);
		let a = this.hydration?.title ?? null;
		if (a !== null && (i === void 0 || i(a))) {
			let e = String(E.resolve(a, !0));
			document.title !== e && (document.title = e);
		}
		E.language.length > 0 && document.documentElement.lang !== E.language && (document.documentElement.lang = E.language), d(n ? "page's moments written again" : "page's words written again", r, { language: E.language });
	}
	rewriteStaticWords(e, t) {
		let n = t === void 0 ? this.metadata.getWords() : this.metadata.getWords().filter((e) => t(e.key));
		if (n.length === 0) return;
		let r = [];
		is(this.root, (e) => {
			e !== this.root && r.push(e);
		});
		for (let t of n) {
			let n = w(t.componentId), i = {
				componentId: n,
				propertyId: t.propertyId
			}, a = t.dynamicParameters ?? [];
			for (let r of this.findWordInstances(n, a)) e.rewriteStatic(r, i, t.key);
			for (let o of r) for (let r of o.querySelectorAll(`[${re}="${wi(n)}"]`)) oa(r, a) && e.rewriteStatic(r, i, t.key);
		}
	}
	findWordInstances(e, t) {
		if (t.length === 0) return this.dom.findEveryComponent(e);
		let n = this.dom.findAllComponents(e, t);
		return n.length > 0 ? n : this.dom.findAllComponents(e, []).filter((e) => oa(e, t));
	}
	loseConnection(e) {
		if (this.connectionLost) return;
		this.connectionLost = !0, c("the connection to the server is lost; the page offers a reload.", e), this.connection.lost();
		let t = Error("the connection to the server is lost; reload the page.", { cause: e });
		this.transport.close(t), this.dispatcher.release(t), this.notifications.show({
			message: E.text("ui.connection.lost"),
			severity: "danger",
			sticky: !0,
			connection: !0,
			action: {
				label: E.text("ui.connection.reload"),
				run: () => {
					this.leaveGuard.release(), window.location.reload();
				}
			}
		});
	}
	reloadForView(e) {
		let t = rK(e, navigator.cookieEnabled, aK());
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
		if (rK(e, navigator.cookieEnabled, aK()) !== "reload") {
			this.loseConnection(/* @__PURE__ */ Error("the server holds a new runtime for this page again after a reload for one."));
			return;
		}
		s("the page's runtime is gone and the server built a new one; reloading.", { view: e }), this.leaveGuard.release(), window.location.reload();
	}
	get instanceId() {
		return this.transport.instanceId;
	}
	async startAsync() {
		v(this, this.options.handlerGlobalKey), nJ(this.root), await s1();
		let e = this.connectAsync();
		await this.hydrateAsync(), this.startEnginesAwaitingHydration(), J$(this.root), this.clientState.start(), await e && (await this.attachAsync(), this.connectionLost || l(`page live ${f(performance.now())} after the navigation started.`));
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
		return Qo(this.root) || GG(this.hydration) || this.metadata.getWords().some((e) => Ao(e.key)) || Ao(this.metadata.metadata.itemValues);
	}
	startEnginesAwaitingHydration() {
		let e = this.enginesAwaitingHydration ?? [];
		this.enginesAwaitingHydration = null;
		for (let t of e) X$(Z$(t), t, this.pluginContext);
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
		E.register(e);
	}
	addEngine(e) {
		if (this.enginesAwaitingHydration !== null) {
			this.enginesAwaitingHydration.push(e);
			return;
		}
		X$(Z$(e), e, this.pluginContext);
	}
	applyChanges(e, t, n) {
		if (this.inbound === null && !pK(e)) {
			t?.(), this.holdsRuntime(n) && this.applyNow(e);
			return;
		}
		let r = this.transport.instanceId, i = (this.inbound ?? Promise.resolve()).then(async () => {
			t?.(), this.holdsRuntime(n) && this.applyNow(await mK(e, r));
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
			if (e >= e1) {
				this.loseConnection(/* @__PURE__ */ Error("the page fell behind the server on every attach."));
				return;
			}
		}
	}
	async attachCoreAsync() {
		if (this.connectionLost) return !1;
		let e = window.location.search, t = this.createAttachRequest(e), n = this.holdInbound(), r = performance.now();
		try {
			let i = await JG(() => this.transport.attachAsync(t), () => this.transport.isReconnecting, $$, o1), a = performance.now();
			if (i === null) return this.loseConnection(/* @__PURE__ */ Error("attaching the runtime failed after retrying.")), !1;
			if (i === "reconnecting") return !1;
			if (i.reload === !0) return this.reloadForView(this.hydration?.view ?? ""), !1;
			if (i.fresh === !0) return this.reloadForFreshRuntime(this.hydration?.view ?? ""), !1;
			iK(aK()), this.heldRuntime = i.runtime ?? null, this.runtimeSearch = e, this.dom.rebuild(), this.updateProcessor.registerServerRenderedItems(i.initialChanges), await n.previous;
			let o = i1();
			return t.switchRuntime && (this.pageId = null, o !== null && this.windows.forget(o)), this.leaveGuard.set(!1), await this.applyAttachChangesAsync(i.initialChanges), this.updateProcessor.initializeItemsHosts(), t.switchRuntime && a1(o), this.inertContent?.removeAttribute("inert"), this.inertContent = null, this.windows.start(), d("runtime attached", r, {
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
		let t = u1(), n = t === null && this.heldRuntime !== null && JZ(e, this.runtimeSearch, this.hydration?.identity ?? []), r = {
			clientWindowId: this.windowId,
			route: t?.route ?? window.location.pathname,
			pageId: n ? null : this.pageId,
			view: this.hydration?.view ?? null,
			since: this.renderSequence,
			runtime: this.heldRuntime,
			parameters: t === null ? YZ(e) : t.parameters,
			timeZone: YG(),
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
			this.applyNow(pK(e) ? await mK(e, this.transport.instanceId) : e);
		} catch (e) {
			c("a staged value of the attach could not be fetched; the page attaches again.", e), this.reattachRequested = !0;
		}
	}
};
async function r1(e = {}) {
	let t = performance.now(), n = new n1(e);
	return d("runtime built", t), await n.startAsync(), n;
}
function i1() {
	return document.querySelector(`[${vn}="${qq}"]`);
}
function a1(e) {
	if (document.scrollingElement?.scrollTo({
		top: 0,
		left: 0,
		behavior: "instant"
	}), e !== null) for (let t of [e, ...e.querySelectorAll("*")]) DH(t) && !(V(t) === "windowed" && OH(t)) ? (SH(t), t.scrollTo({
		top: t.scrollHeight,
		left: 0,
		behavior: "instant"
	})) : (t.scrollTop !== 0 || t.scrollLeft !== 0) && t.scrollTo({
		top: 0,
		left: 0,
		behavior: "instant"
	});
}
function o1(e) {
	return new Promise((t) => window.setTimeout(t, e));
}
function s1() {
	let e = performance.getEntriesByType("navigation")[0];
	return document.readyState === "complete" || e !== void 0 && e.domContentLoadedEventStart > 0 ? Promise.resolve() : new Promise((e) => document.addEventListener("DOMContentLoaded", () => e(), { once: !0 }));
}
function c1(e) {
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
	let n = l1();
	try {
		t?.setItem(e, n);
	} catch (e) {
		s("storing the tab id failed.", e);
	}
	return n;
}
function l1() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `tab-${typeof crypto < "u" && typeof crypto.getRandomValues == "function" ? [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16))].map((e) => e.toString(16).padStart(2, "0")).join("") : Math.random().toString(16).slice(2).padEnd(16, "0")}-${performance.now().toString(36).replace(".", "")}`;
}
function u1() {
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
_(), r1().catch((e) => {
	c("Web client failed to start.", e);
});
//#endregion
