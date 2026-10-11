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
function ee() {
	return te();
}
function _(e, t = "__neStandardUIRuntime") {
	window[t] = e;
	let n = te();
	n.runtime = e, ne(e, n);
}
function te() {
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
function ne(e, t) {
	let n = t.__pending ?? [];
	t.__pending = [];
	for (let t of n) t.engine || t.apply(e);
	for (let t of n) t.engine && t.apply(e);
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
var v = "data-ui-id", ie = "data-ui-context", ae = "data-ui-pc", y = "data-ui-key", oe = "data-ui-unselectable", se = "data-ui-undraggable", ce = "data-ui-unremovable", le = "data-ui-unrenamable", ue = "data-ui-no-context-menu", de = "data-ui-no-row-open", fe = "data-ui-no-row-drag", pe = "data-ui-drag-kind", me = "data-ui-drag-source", he = "data-ui-item-drop-over", ge = "data-ui-drop-boxed", _e = "ui-row__grip", ve = "data-ui-row-drop", ye = "data-ui-tabs-none-removable", be = "data-ui-tabs-draggable", xe = "data-ui-tabs-menu", Se = "data-ui-context-menu", Ce = "data-ui-context-menu-owner", we = "data-ui-context-menu-use", Te = "data-ui-action-bar", Ee = "data-ui-action-bar-key", De = "data-ui-action-bar-rest", Oe = "data-ui-menu-left-out", ke = "data-ui-in-action-bar", Ae = "ui-action-bar", je = "data-ui-row-focus", Me = "data-ui-row-cursor-waits", Ne = "data-ui-tab-out", Pe = "data-ui-cell-focus", Fe = "ui-cell-key", Ie = "data-ui-tooltip", Le = "data-ui-tooltip-placement", Re = "data-ui-tooltip-mark", ze = "data-ui-tooltip-severity", Be = "data-ui-tooltip-press", Ve = "data-ui-badge-text", He = "data-ui-badge-set", Ue = "data-ui-folds", We = "data-ui-name", Ge = "data-ui-bind-", Ke = "data-ui-into-", qe = "data-ui-bind-value", Je = (e) => `data-ui-no-${e}`, Ye = "data-ui-event-boundary", Xe = "data-ui-image-caption", Ze = "data-ui-image-crop", Qe = "data-ui-image-crop-size", $e = "ui-image", et = "data-ui-fallback-src", tt = "data-ui-image-failed", b = "data-ui-items-host", nt = "data-ui-collection-sink", rt = "data-ui-items-query", it = "data-ui-number-culture", at = "data-ui-page-culture", ot = "data-ui-pager-target", st = "data-ui-pager-page", ct = "data-ui-pager-size", lt = "data-ui-temporal-culture", ut = "data-ui-temporal", dt = "ui-timestamp", ft = "ui-timestamp__text", pt = "data-ui-timestamp-format", mt = "data-ui-empty-template", ht = "data-ui-group-template", gt = "data-ui-empty-placeholder", _t = "data-ui-group-header", vt = "data-ui-group-anchor", yt = "data-ui-group", bt = "data-ui-value-holder", xt = "data-ui-value-end", St = "data-ui-value-kind", Ct = "items-query", wt = "data-ui-host-mode", Tt = "data-ui-host-viewport", Et = "data-ui-scroll-group", Dt = "data-ui-scroll-lines", Ot = "data-ui-source-line", kt = "data-ui-window-spacer", At = "data-ui-window-pending", jt = "data-ui-window-paged", Mt = "data-ui-window-size", Nt = "data-ui-window-offset", Pt = "data-ui-window-total", Ft = "data-ui-window-more-before", It = "data-ui-window-more-after", Lt = "data-ui-window-group-before", Rt = "data-ui-window-aggregates", zt = "data-ui-form-id", Bt = "data-ui-forms", Vt = "data-ui-visibility", Ht = "data-ui-collapsed", Ut = "data-ui-menu-group", Wt = "data-ui-menu-select", Gt = "data-ui-menu-open", Kt = "data-ui-menu-holds-current", qt = "data-ui-menu-icons", Jt = "data-ui-menu-passive", Yt = "data-ui-menu-item-shortcut", Xt = "data-ui-menu-surface", Zt = "data-ui-menu-search", Qt = "data-ui-menu-searching", $t = "data-ui-menu-unmatched", en = "data-ui-drawer-toggle", tn = "data-ui-drawer-open", nn = "data-ui-drawer-switch", rn = "data-ui-drawer-switch-row", an = "data-ui-side-drawers", on = "data-ui-drawer-pin";
function sn(e) {
	return e === "right-side" ? "data-ui-pinned-right-side" : "data-ui-pinned-left-side";
}
var cn = "data-ui-bottom-bar", ln = "data-ui-rail-drawer", un = "data-ui-content-fills", dn = "data-ui-region", fn = "data-ui-menu-item-kind", pn = "ui-menu", x = "ui-menu-item", mn = "ui-menu-item--checked", hn = "ui-menu-item--selected", gn = "ui-menu--rail", _n = "ui-menu--nested", vn = `[${fn}="header"], [${fn}="separator"]`, yn = `[${Ut}] > .${x}`, bn = `.${x}:not(${vn})`, xn = `${yn}, .${x}[${fn}="check"]`, Sn = "data-ui-shortcut", Cn = "data-ui-collapse-toggle", wn = "data-ui-folding", Tn = "data-ui-column-limits", En = "data-ui-row-limits", Dn = "data-ui-splitter-step", On = "data-ui-splitter-position", kn = "data-ui-pane-layout", An = "data-ui-pane", jn = "data-ui-table-column", Mn = "data-ui-table-hide-below", Nn = "data-ui-table-starts-hidden", Pn = "data-ui-table-hidden", Fn = "ui-table__row", In = "ui-table__scroll", Ln = "ui-table__header", Rn = "ui-table__resizer", zn = "ui-tree", Bn = "ui-tree__row", Vn = "ui-tree-node", Hn = "data-ui-tree-drop", Un = "ui-tree__row--filtered", Wn = "data-ui-table-last", Gn = "data-ui-table-reordering", Kn = "data-ui-table-dragging", qn = "data-ui-table-drop", Jn = "data-ui-table-scrolled", Yn = "data-ui-table-scrollbar", Xn = "data-ui-no-row-select", Zn = "data-ui-tree-parent", Qn = "data-ui-tree-children", $n = "data-ui-tree-folder", er = "data-ui-tree-expanded", tr = "data-ui-tree-title", nr = "data-ui-tree-loading", rr = "data-ui-tree-drop-target", ir = "data-ui-tree-boot", ar = "data-ui-tree-draggable", or = "data-ui-row-editing", sr = "data-ui-boxed-editor", cr = "data-ui-row-idle", lr = "data-ui-step-collapsed", ur = "data-ui-step-end", dr = "data-ui-row-bar", fr = "data-ui-image-source", pr = "data-ui-file-max-size", mr = "data-ui-file-pick", hr = "data-ui-file-drop-target-id", gr = "data-ui-service-worker", _r = "data-ui-theme", vr = "data-ui-theme-colors", yr = "data-ui-words", br = "#text", xr = "data-ui-language-switcher", Sr = "data-ui-language", Cr = "data-ui-splitting", wr = "data-ui-keyboard-up", Tr = "data-ui-connection", Er = "data-ui-split-folded", Dr = "data-ui-split-edge", Or = "data-ui-pointer-focus", kr = "data-ui-focus-within", Ar = "data-ui-popup-hover", jr = "data-ui-inner-pointer", Mr = "data-ui-selection", Nr = "data-ui-selected", Pr = "data-ui-selected-key", Fr = "data-ui-selected-keys", Ir = "data-ui-bind-selected-key", Lr = "data-ui-tabs-selected", Rr = "data-ui-tab-caption", zr = "data-ui-tab-pinned", Br = [
	Vt,
	"data-ui-visibility-sm",
	"data-ui-visibility-md",
	"data-ui-visibility-xl",
	"data-ui-visibility-xxl"
], Vr = "data-ui-submit-form-id", S = `[${v}]`, Hr = "data-ui-href", Ur = "ui-disabled", Wr = "ui-loading", Gr = "ui-readonly", Kr = "ui-hidden", qr = "ui-dialog__surface", Jr = "ui-flyout__content", Yr = `.ui-context-menu, .ui-split-button__menu, .${Jr}`, Xr = "data-ui-focus-holder", Zr = "data-ui-owns-keys", Qr = "[role='listbox'], [role='menu'], [role='dialog']", $r = "ui-select__trigger", ei = `.${$r}`, ti = "ui-button", ni = `${ti} ui-button--ghost ui-button--small`, ri = "ui-select", ii = "data-ui-text-title", ai = "data-ui-text-description", oi = "data-ui-text-icon", si = "data-ui-text-badge-icon", ci = "data-ui-text-badge-text", li = "ui-card__header--empty", ui = "ui-text-input", di = "ui-invalid", fi = "data-ui-validation-message", pi = {
	componentId: v,
	key: y,
	selected: Nr,
	selectedKey: Pr,
	selectedKeys: Fr,
	unselectable: oe,
	rowFocus: je,
	cellFocus: Pe,
	cellKey: Fe,
	itemsHost: b,
	valueHolder: bt,
	bindValue: qe,
	noRowOpen: de,
	noRowDrag: fe,
	eventBoundary: Ye,
	focusHolder: Xr,
	ownsKeys: Zr,
	tooltip: Ie,
	tooltipPlacement: Le,
	contextMenu: Se,
	contextMenuUse: we,
	actionBar: Te,
	actionBarKey: Ee,
	actionBarRest: De,
	disabledClass: Ur,
	loadingClass: Wr,
	readOnlyClass: Gr,
	hiddenClass: Kr,
	buttonClass: ti,
	selectClass: ri,
	textInputClass: ui,
	invalidClass: di,
	validationMessage: fi,
	sourceLine: Ot,
	textDescription: ai,
	popupSelector: Qr,
	listTriggerSelector: ei,
	tableRowClass: Fn,
	tableScrollClass: In,
	tableHeaderClass: Ln,
	tableResizerClass: Rn,
	tableHidden: Pn,
	hostMode: wt,
	windowOffset: Nt,
	windowTotal: Pt,
	windowSize: Mt,
	windowMoreAfter: It,
	windowAggregates: Rt,
	itemsQuery: rt,
	valueKind: St,
	itemsQueryKind: Ct,
	menuItemClass: x,
	menuItemKind: fn,
	menuItemCheckedClass: mn
};
function C(e) {
	return String(e).replace(/[\\"]/g, "\\$&").replace(/[\u0000-\u001f\u007f]/g, (e) => `\\${e.charCodeAt(0).toString(16)} `);
}
function mi(e) {
	return e.replace(/(\p{Ll})(\p{Lu})/gu, "$1-$2").replace(/([\p{L}\p{Nd}])(\p{Lu}\p{Ll})/gu, "$1-$2").replace(/_/g, "-").toLowerCase();
}
var hi = 0;
function gi(e, t) {
	return e.id.length === 0 && (hi++, e.id = `${t}-${hi}`), e.id;
}
//#endregion
//#region src/addressing/operation-targets.ts
function _i(e, t, n) {
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
var vi = {
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
}, yi = class {
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
		return this.bindingsByComponentAndPropertyId.get(Hi(e, t));
	}
	getBindingByComponentAndPropertyName(e, t) {
		return this.bindingsByComponentAndPropertyName.get(Hi(e, Vi(t)));
	}
	getEvent(e, t) {
		return this.eventsByComponentAndName.get(Ui(e, t));
	}
	hasServerEvent(e) {
		return this.eventNames.has(Bi(e));
	}
	getEventNames() {
		return this.eventNames;
	}
	hasServerEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(Bi(e))?.has(t) === !0;
	}
	getItemsTemplateMetadata(e) {
		return this.itemsTemplatesByComponentId.get(e);
	}
	getItemsFilterSortMetadata(e) {
		return this.itemsFilterSortByComponentId.get(e);
	}
	getItemValues(e, t = []) {
		return this.itemValuesByAddress.get(Wi(e, t))?.items ?? [];
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
		r > 0 && this.bindingsById.set(r, e), this.bindingsByComponentAndPropertyId.set(Hi(t, e.propertyId), e), this.bindingsByComponentAndPropertyName.set(Hi(t, n.propertyName), e);
	}
	addEvent(e) {
		let t = Bi(e.eventName), n = T(e.componentId);
		if (t.length === 0 || n <= 0) return;
		this.eventsByComponentAndName.set(Ui(n, t), e), this.eventNames.add(t);
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
		t > 0 && this.itemValuesByAddress.set(Wi(t, e.dynamicParameters ?? []), e);
	}
	addValidation(e) {
		let t = T(e.target?.componentId);
		if (t <= 0) return;
		let n = this.validationsByComponentId.get(t);
		n === void 0 && (n = [], this.validationsByComponentId.set(t, n)), n.push(e);
	}
};
function w(e, t) {
	return typeof e == "number" ? t[e] ?? "Unknown" : e != null && t.includes(e) ? e : "Unknown";
}
function bi(e) {
	return w(e, [
		"Dynamic",
		"Fixed",
		"Scope"
	]);
}
function xi(e) {
	return e == null ? "OneWay" : w(e, [
		"OneWay",
		"TwoWay",
		"OneWayToSource",
		"OnSubmit"
	]);
}
function Si(e) {
	return w(e, ["Property", "Event"]);
}
function Ci(e) {
	return e == null ? "SetProperty" : w(e, [
		"SetProperty",
		"Effect",
		"CopyValue"
	]);
}
function wi(e) {
	return w(e, [
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
function Ti(e) {
	return w(e, ["Ascending", "Descending"]);
}
function Ei(e) {
	return w(e, [
		"Change",
		"Blur",
		"Submit"
	]);
}
function Di(e) {
	return w(e, [
		"Error",
		"Warning",
		"Info"
	]);
}
function Oi(e) {
	return typeof e == "string" ? e : w(e, [
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
function ki(e) {
	return w(e, [
		"None",
		"HasValue",
		"HasText",
		"IsTrue",
		"IsFalse",
		"DrawsIcon"
	]);
}
function Ai(e) {
	return w(e, [
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
function ji(e) {
	return typeof e == "string" ? e : "";
}
function Mi(e) {
	return w(e.kind, [
		"Value",
		"CollectionChange",
		"FullResync",
		"Validation",
		"Page"
	]);
}
function Ni(e) {
	return typeof e == "string" ? e.trim() : "";
}
function Pi(e) {
	return w(e, ["Auto", "Smooth"]);
}
function Fi(e) {
	return w(e, [
		"Start",
		"Center",
		"End",
		"Nearest"
	]);
}
function Ii(e) {
	return w(e, [
		"Start",
		"End",
		"Offset",
		"PageBack",
		"PageForward"
	]);
}
function Li(e) {
	return w(e, ["Light", "Dark"]);
}
function Ri(e) {
	return w(e, ["Horizontal", "Vertical"]);
}
function zi(e) {
	return w(e, ["Polite", "Assertive"]);
}
function Bi(e) {
	return e?.trim().toLowerCase() ?? "";
}
function Vi(e) {
	return e?.trim() ?? "";
}
function Hi(e, t) {
	return `${e}:${Vi(t)}`;
}
function Ui(e, t) {
	return `${e}:${Bi(t)}`;
}
function Wi(e, t) {
	return `${e}:${JSON.stringify(t.map((e) => String(e ?? "")))}`;
}
//#endregion
//#region src/addressing/address-resolver.ts
var Gi = class {
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
		return this.dom.findAllComponents(T(e.componentId), []).length > 0;
	}
	resolveProperties(e, t) {
		let n = T(e.componentId), r = this.metadata.getPropertyDefinition(e.propertyId);
		if (n <= 0 || r === void 0) return [];
		let i = this.dom.findAllComponents(n, t);
		if (i.length === 0) return [];
		let a = T(this.metadata.getBindingByComponentAndPropertyId(n, e.propertyId)?.bindingId), o = a > 0 ? `[${Ge}${mi(r.propertyName)}="${C(a)}"]` : null;
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
		return _i(e.component, t, () => {
			if (e.bindingSelector === null) return [e.component.querySelector(`[data-ui-into-${mi(e.propertyName)}]`) ?? e.component];
			let t = Array.from(e.component.querySelectorAll(e.bindingSelector));
			return e.component.matches(e.bindingSelector) && t.unshift(e.component), t;
		});
	}
};
//#endregion
//#region src/addressing/dynamic-parameters.ts
function Ki(e) {
	return Xi(e, ae);
}
function qi(e, t) {
	if (t <= 0) return [];
	let n = [], r = e;
	for (; r !== null && n.length < t;) {
		let e = Zi(r);
		e !== void 0 && n.push(e), r = r.parentElement;
	}
	return n.reverse(), n.length !== t && s("dynamic parameter count mismatch.", {
		expectedCount: t,
		actualCount: n.length,
		element: e
	}), n;
}
function Ji(e, t) {
	let n = Ki(e);
	if (n !== t.length) return !1;
	if (n === 0) return !0;
	let r = qi(e, n);
	if (r.length !== t.length) return !1;
	for (let e = 0; e < t.length; e++) if (String(r[e] ?? "") !== String(t[e] ?? "")) return !1;
	return !0;
}
function Yi(e, t) {
	let n = t.length - 1, r = e;
	for (; r !== null && n >= 0;) {
		let e = Zi(r);
		if (e !== void 0) {
			if (e !== String(t[n] ?? "")) return !1;
			n--;
		}
		r = r.parentElement;
	}
	return n < 0;
}
function Xi(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.trim().length === 0) return 0;
	let r = Number(n);
	return Number.isInteger(r) ? r : 0;
}
function Zi(e) {
	return e.getAttribute("data-ui-key") ?? e.getAttribute("data-ui-group-anchor") ?? void 0;
}
//#endregion
//#region src/addressing/dom-registry.ts
function Qi(e, t) {
	let n = [];
	for (let r of e) r instanceof HTMLElement && r.matches(t) ? n.push(r) : n.push(...r.querySelectorAll(t));
	return n;
}
var $i = class {
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
		let e = this.root.querySelectorAll(S), t = this.root.querySelector(`[${_t}]`) !== null;
		for (let n of e) {
			let e = E(n);
			if (e <= 0 || t && n.closest("[data-ui-group-header]") !== null) continue;
			let r = this.componentsById.get(e);
			r === void 0 && (r = [], this.componentsById.set(e, r)), r.push(n), !this.staticComponentsById.has(e) && ra(n) && this.staticComponentsById.set(e, n);
		}
	}
	findComponent(e, t) {
		return this.findAllComponents(e, t)[0] ?? null;
	}
	ensureId(e, t) {
		return gi(e, t);
	}
	findComponentParts(e, t, n) {
		return Qi(this.findAllComponents(e, t), n);
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
		let n = this.keyedComponents(e).get(na(t)) ?? [];
		if (n.length > 0 && n.every((e) => Ji(e, t))) return [...n];
		let r = (this.componentsById.get(e) ?? []).filter((e) => Ji(e, t));
		return n.length > 0 && this.keyedComponentsById.delete(e), r;
	}
	keyedComponents(e) {
		let t = this.keyedComponentsById.get(e);
		if (t !== void 0) return t;
		t = /* @__PURE__ */ new Map();
		for (let n of this.componentsById.get(e) ?? []) {
			let e = Ki(n);
			if (e === 0) continue;
			let r = qi(n, e);
			if (r.length !== e) continue;
			let i = na(r), a = t.get(i);
			a === void 0 ? t.set(i, [n]) : a.push(n);
		}
		return this.keyedComponentsById.set(e, t), t;
	}
	resolveNearestComponent(e, t) {
		this.stale && this.rebuild();
		let n = e;
		for (; n !== null;) {
			let e = n.closest(S);
			if (e === null || !ia(this.root, e)) return null;
			let r = E(e);
			if (r > 0 && t(r, e)) return {
				element: e,
				componentId: r,
				dynamicParameters: qi(e, Ki(e))
			};
			n = e.parentElement;
		}
		return null;
	}
};
function E(e) {
	return Xi(e, v);
}
function ea(e) {
	let t = e.closest(S), n = t === null ? 0 : E(t);
	return n > 0 ? n : null;
}
function ta(e) {
	let t = e.closest(S), n = t === null ? 0 : E(t);
	return t === null || n <= 0 ? null : {
		componentId: n,
		dynamicParameters: qi(t, Ki(t))
	};
}
function na(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function ra(e) {
	return Ki(e) === 0;
}
function ia(e, t) {
	return e === t || e instanceof Node && e.contains(t);
}
//#endregion
//#region src/runtime/plural-rules.ts
function aa(e, t) {
	if (!Number.isFinite(t)) return "other";
	let n = Math.abs(t), r = Math.trunc(n), i = oa(n);
	switch (sa(e)) {
		case "en":
		case "de": return r === 1 && i === 0 ? "one" : "other";
		case "es": return n === 1 ? "one" : ca(r, i) ? "many" : "other";
		case "fr": return r === 0 || r === 1 ? "one" : ca(r, i) ? "many" : "other";
		case "ru":
		case "uk": return la(r, i);
		case "pl": return ua(r, i);
		default: return "other";
	}
}
function oa(e) {
	if (Number.isInteger(e)) return 0;
	let t = String(e), n = t.indexOf("e"), r = n < 0 ? t : t.slice(0, n), i = n < 0 ? 0 : Number(t.slice(n + 1)), a = r.indexOf("."), o = a < 0 ? 0 : r.length - a - 1;
	return Math.max(0, o - i);
}
function sa(e) {
	return e == null || e.trim().length === 0 ? "" : e.split(/[-_]/, 1)[0].toLowerCase();
}
function ca(e, t) {
	return t === 0 && e !== 0 && e % 1e6 == 0;
}
function la(e, t) {
	if (t !== 0) return "other";
	let n = e % 10, r = e % 100;
	return n === 1 && r !== 11 ? "one" : n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
function ua(e, t) {
	if (t !== 0) return "other";
	if (e === 1) return "one";
	let n = e % 10, r = e % 100;
	return n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
//#endregion
//#region src/rendering/temporal-format.ts
function da(e, t) {
	return `${e.date} ${t ? e.longTime : e.shortTime}`;
}
var fa = {
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
function pa(e) {
	let t = e.closest("[data-ui-temporal-culture]")?.getAttribute("data-ui-temporal-culture") ?? null;
	if (t === null) return fa;
	try {
		return {
			...fa,
			...JSON.parse(t)
		};
	} catch {
		return fa;
	}
}
var ma = [
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
function ha(e, t, n) {
	if (t == null || t.trim().length === 0) return `${Sa(e.getFullYear(), 4)}-${Sa(e.getMonth() + 1, 2)}-${Sa(e.getDate(), 2)} ${Sa(e.getHours(), 2)}:${Sa(e.getMinutes(), 2)}:${Sa(e.getSeconds(), 2)}`;
	let r = "", i = ga(t);
	for (let a = 0; a < t.length;) {
		let o = ba(t, a);
		if (o === null) {
			r += t[a], a++;
			continue;
		}
		r += xa(o, e, n, i), a += o.length;
	}
	return r;
}
function ga(e) {
	for (let t = 0; t < e.length;) {
		let n = ba(e, t);
		if (n === null) {
			t++;
			continue;
		}
		if (n === "d" || n === "dd") return !0;
		t += n.length;
	}
	return !1;
}
var _a = /^[-./:,]$/, va = /* @__PURE__ */ new Set([
	"MMMM",
	"MMM",
	"dddd",
	"ddd",
	"tt"
]);
function ya(e) {
	for (let t = 0; t < e.length;) {
		let n = ba(e, t);
		if (n !== null && va.has(n) || n === null && !_a.test(e[t]) && !/\s/.test(e[t])) return !1;
		t += n?.length ?? 1;
	}
	return e.trim().length > 0;
}
function ba(e, t) {
	for (let n of ma) if (e.startsWith(n, t)) return n;
	return null;
}
function xa(e, t, n, r) {
	let i = t.getHours(), a = Va(i);
	switch (e) {
		case "yyyy": return Sa(t.getFullYear(), 4);
		case "yy": return Sa(t.getFullYear() % 100, 2);
		case "MMMM": return r ? n.monthGenitiveNames[t.getMonth()] : n.monthNames[t.getMonth()];
		case "MMM": return n.abbreviatedMonthNames[t.getMonth()];
		case "MM": return Sa(t.getMonth() + 1, 2);
		case "M": return String(t.getMonth() + 1);
		case "dddd": return n.dayNames[t.getDay()];
		case "ddd": return n.abbreviatedDayNames[t.getDay()];
		case "dd": return Sa(t.getDate(), 2);
		case "d": return String(t.getDate());
		case "HH": return Sa(i, 2);
		case "H": return String(i);
		case "hh": return Sa(a, 2);
		case "h": return String(a);
		case "mm": return Sa(t.getMinutes(), 2);
		case "m": return String(t.getMinutes());
		case "ss": return Sa(t.getSeconds(), 2);
		case "s": return String(t.getSeconds());
		case "tt": return i < 12 ? n.amDesignator : n.pmDesignator;
		default: return e;
	}
}
function Sa(e, t) {
	return String(e).padStart(t, "0");
}
var Ca = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function wa(e) {
	let t = Ca.exec(e.trim());
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
function Ta(e) {
	return Ea(e.year, e.month - 1, e.day, e.hour, e.minute, e.second, e.millisecond);
}
function Ea(e, t, n, r = 0, i = 0, a = 0, o = 0) {
	let s = new Date(2e3, 0, 1, r, i, a, o);
	return s.setFullYear(e, t, n), s;
}
var Da = {
	year: "y",
	month: "M",
	day: "d",
	hour: "H",
	minute: "m",
	second: "s"
};
function Oa(e, t) {
	let n = "";
	for (let r = 0; r < e.length;) {
		let i = ba(e, r);
		if (i === null) {
			n += e[r], r++;
			continue;
		}
		n += ka(i, t).repeat(i.length), r += i.length;
	}
	return n;
}
function ka(e, t) {
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
function Aa(e, t, n) {
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
		let a = ba(t, e);
		if (a === null) {
			if (!ja(r, i, t[e])) return null;
			e++;
			continue;
		}
		if (!Ma(r, i, a, n)) return null;
		e += a.length;
	}
	return r.length > 0 && i.position === r.length ? za(i) : null;
}
function ja(e, t, n) {
	if (/\s/.test(n)) {
		for (; t.position < e.length && /\s/.test(e[t.position]);) t.position++;
		return !0;
	}
	return _a.test(n) ? t.position >= e.length || !_a.test(e[t.position]) ? !1 : (t.position++, !0) : t.position >= e.length || e[t.position].toLowerCase() !== n.toLowerCase() ? !1 : (t.position++, !0);
}
function Ma(e, t, n, r) {
	switch (n) {
		case "yyyy": return Na(t, "year", Ia(e, t, 4, 4));
		case "yy": return Na(t, "year", Pa(Ia(e, t, 2, 2)));
		case "MMMM":
		case "MMM": return Na(t, "month", Fa(La(e, t, [
			r.monthNames,
			r.monthGenitiveNames,
			r.abbreviatedMonthNames
		])));
		case "MM":
		case "M": return Na(t, "month", Ia(e, t, 1, 2));
		case "dddd":
		case "ddd": return La(e, t, [r.dayNames, r.abbreviatedDayNames]) !== null;
		case "dd":
		case "d": return Na(t, "day", Ia(e, t, 1, 2));
		case "HH":
		case "H": return Na(t, "hour", Ia(e, t, 1, 2));
		case "hh":
		case "h": return Na(t, "hour12", Ia(e, t, 1, 2));
		case "mm":
		case "m": return Na(t, "minute", Ia(e, t, 1, 2));
		case "ss":
		case "s": return Na(t, "second", Ia(e, t, 1, 2));
		case "tt": return Ra(e, t, r);
		default: return !1;
	}
}
function Na(e, t, n) {
	return n !== null && (e[t] = n, !0);
}
function Pa(e) {
	return e === null ? null : e + (e < 50 ? 2e3 : 1900);
}
function Fa(e) {
	return e === null ? null : e + 1;
}
function Ia(e, t, n, r) {
	let i = t.position;
	for (; i < e.length && i - t.position < r && e[i] >= "0" && e[i] <= "9";) i++;
	if (i - t.position < n) return null;
	let a = Number(e.slice(t.position, i));
	return t.position = i, a;
}
function La(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = null, a = 0;
	for (let e of n) for (let t = 0; t < e.length; t++) {
		let n = e[t].toLowerCase();
		n.length > a && r.startsWith(n) && (i = t, a = n.length);
	}
	return t.position += a, i;
}
function Ra(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = n.amDesignator.toLowerCase(), a = n.pmDesignator.toLowerCase();
	for (let [e, n] of i.length >= a.length ? [[i, !1], [a, !0]] : [[a, !0], [i, !1]]) if (e.length > 0 && r.startsWith(e)) return t.position += e.length, t.afternoon = n, !0;
	return i.length === 0 && a.length === 0;
}
function za(e) {
	let t = e.hour ?? 0;
	if (e.hour12 !== null) {
		if (e.hour12 < 1 || e.hour12 > 12) return null;
		t = e.hour12 % 12 + (e.afternoon === !0 ? 12 : 0);
	}
	return e.year === null || e.month === null || e.day === null || e.year < 1 || e.month < 1 || e.month > 12 || e.day < 1 || e.day > Ea(e.year, e.month, 0).getDate() || t > 23 || e.minute > 59 || e.second > 59 ? null : {
		year: e.year,
		month: e.month,
		day: e.day,
		hour: t,
		minute: e.minute,
		second: e.second,
		millisecond: 0
	};
}
var Ba = {
	readCulture: pa,
	format: ha,
	parse: wa,
	toDate: Ta
};
function Va(e) {
	return e % 12 == 0 ? 12 : e % 12;
}
//#endregion
//#region src/rendering/timestamp-format.ts
var Ha = /(?:Z|[+-]\d{2}(?::?\d{2})?)$/i, Ua = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function Wa(e) {
	let t = e?.trim() ?? "";
	if (!Ua.test(t)) return null;
	let n = Date.parse(Ha.test(t) ? t : `${t}Z`);
	return Number.isNaN(n) ? null : n;
}
function Ga(e) {
	return e === "date" || e === "time" || e === "relative" || e === "relative-date" ? e : "date-time";
}
function Ka(e) {
	return e === "relative" || e === "relative-date";
}
var qa = {
	...fa,
	date: "yyyy-MM-dd",
	shortTime: "HH:mm",
	longTime: "HH:mm:ss"
};
function Ja(e, t, n, r) {
	if (t === "relative") return ao(e - r, n.language);
	if (t === "relative-date") {
		let t = Xa(e, r);
		if (t !== null) return $a(n.language).format(t, "day");
	}
	let i = n.temporal ?? qa, a = t === "date" || t === "relative-date" ? i.date : t === "time" ? i.shortTime : da(i, !1);
	return ha(new Date(e), a, i);
}
function Ya(e, t, n, r) {
	let i = Ja(e, t, n, r);
	return t === "relative-date" ? Za(i, n.language) : i;
}
function Xa(e, t) {
	let n = new Date(e), r = new Date(t), i = Math.round((Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) - Date.UTC(r.getFullYear(), r.getMonth(), r.getDate())) / io);
	return Math.abs(i) <= 1 ? i : null;
}
function Za(e, t) {
	return e.length === 0 ? e : e.charAt(0).toLocaleUpperCase(eo(t)) + e.slice(1);
}
var Qa = /* @__PURE__ */ new Map();
function $a(e) {
	let t = Qa.get(e);
	return t === void 0 && (t = new Intl.RelativeTimeFormat(eo(e), { numeric: "auto" }), Qa.set(e, t)), t;
}
function eo(e) {
	if (e.length !== 0) try {
		return Intl.DateTimeFormat.supportedLocalesOf(e).length > 0 ? e : void 0;
	} catch {
		return;
	}
}
var to = 1e3, no = 60 * to, ro = 60 * no, io = 24 * ro;
function ao(e, t) {
	let n = $a(t), r = Math.abs(e);
	return r < 45 * to ? n.format(0, "second") : r < 45 * no ? n.format(Math.round(e / no), "minute") : r < 22 * ro ? n.format(Math.round(e / ro), "hour") : r < 26 * io ? n.format(Math.round(e / io), "day") : r < 320 * io ? n.format(Math.round(e / (30.4375 * io)), "month") : n.format(Math.round(e / (365.25 * io)), "year");
}
//#endregion
//#region src/runtime/words.ts
var oo = "count";
function so(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	if (typeof t.key != "string" || t.key.trim().length === 0) return !1;
	for (let e of Object.keys(t)) if (e !== "key" && e !== "args") return !1;
	return t.args === void 0 || t.args === null || typeof t.args == "object" && !Array.isArray(t.args);
}
function co(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.text == "string" && t.text.trim().length > 0 && Object.keys(t).length === 1;
}
var lo = /* @__PURE__ */ new Set([
	"date-time",
	"date",
	"time",
	"relative",
	"relative-date"
]);
function uo(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	for (let e of Object.keys(t)) if (e !== "moment" && e !== "format") return !1;
	return typeof t.moment == "string" && Wa(t.moment) !== null && (t.format === void 0 || typeof t.format == "string" && lo.has(t.format));
}
function fo(e) {
	if (typeof e != "object" || !e) return !1;
	if (uo(e)) return !0;
	for (let t of Array.isArray(e) ? e : Object.values(e)) if (fo(t)) return !0;
	return !1;
}
function po(e, t) {
	let n = new Date(e).toISOString(), r = n.slice(0, 10), i = n.slice(11, 16);
	return t === "date" || t === "relative-date" ? r : t === "time" ? `${i} UTC` : `${r} ${i} UTC`;
}
function mo(e, t, n) {
	return so(e) ? _o(n, e.key, e.args) : co(e) ? ho(n, e.text) : t && typeof e == "string" ? ho(n, e) : e;
}
function ho(e, t) {
	return t.trim().length === 0 || !go(e.prefixes, t) ? t : e.lookup(t) ?? t;
}
function go(e, t) {
	if (e.length === 0) return !0;
	for (let n of e) if (t.startsWith(n)) return !0;
	return !1;
}
function _o(e, t, n) {
	let r = n?.[oo];
	return vo(typeof r == "number" ? e.lookup(`${t}.${aa(e.language, r)}`) ?? e.lookup(`${t}.other`) ?? e.lookup(t) ?? t : e.lookup(t) ?? t, n, (t) => co(t) ? ho(e, t.text) : _o(e, t.key, t.args), e.writeMoment);
}
function vo(e, t, n, r = po) {
	if (t == null || !e.includes("{")) return e;
	let i = "", a = 0;
	for (; a < e.length;) {
		if (e[a] === "{") {
			let o = yo(e, a);
			if (o > 0) {
				let s = e.slice(a + 1, o);
				if (Object.hasOwn(t, s)) {
					i += xo(t[s], n, r), a = o + 1;
					continue;
				}
			}
		}
		i += e[a], a++;
	}
	return i;
}
function yo(e, t) {
	let n = t + 1;
	for (; n < e.length && bo(e.charCodeAt(n));) n++;
	return n > t + 1 && n < e.length && e[n] === "}" ? n : -1;
}
function bo(e) {
	return e >= 48 && e <= 57 || e >= 65 && e <= 90 || e >= 97 && e <= 122 || e === 95;
}
function xo(e, t, n) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "boolean" ? e ? "true" : "false" : so(e) ? t === void 0 ? vo(e.key, e.args, void 0, n) : t(e) : co(e) ? t === void 0 ? e.text : t(e) : uo(e) ? n(Wa(e.moment) ?? 0, e.format ?? "date-time") : String(e);
}
//#endregion
//#region src/rendering/moment-first-paint.ts
var So = `script[type='application/json'][${ut}]`;
function Co(e) {
	let t = e.querySelector(So)?.textContent?.trim() ?? "";
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
var wo = 15e3, To = /* @__PURE__ */ new Set(), Eo = null;
function Do(e) {
	To.add(e), Eo === null && (Eo = setInterval(Oo, wo));
}
function Oo() {
	for (let e of [...To]) {
		let t = !1;
		try {
			t = e();
		} catch (e) {
			s("a relative tick failed; it is ticked no more.", e);
		}
		t || To.delete(e);
	}
	To.size === 0 && Eo !== null && (clearInterval(Eo), Eo = null);
}
//#endregion
//#region src/runtime/client-strings.ts
var ko = 256, Ao = 512, jo = "script[type='application/json'][data-ui-strings]", Mo = `[${yr}*='"moment"']`, No = class {
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
		this.tableLoaded || (this.currentTemporal = Co(e) ?? this.currentTemporal);
		let t = e.querySelector(jo)?.textContent?.trim() ?? "";
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
		return this.lookup(e) === void 0 && this.text(e), _o(this, e, t);
	}
	translate(e, t) {
		return _o(this, e, t);
	}
	writeMoment = (e, t) => (Ka(t) && this.noteRelative(), Ja(e, t, {
		temporal: this.currentTemporal,
		language: this.currentLanguage
	}, Date.now()));
	noteRelative() {
		this.relativeWritten = !0, this.momentHandlers.size > 0 && Do(this.tickMoments);
	}
	tickMoments = () => this.relativeWritten ? (this.relativeWritten = !1, this.notify(this.momentHandlers, "a moment tick handler failed."), !0) : !1;
	resolve(e, t) {
		return mo(e, t, this);
	}
	resolveText(e) {
		return mo(e, !0, this);
	}
	write(e, t, n, r) {
		zo(e, t, this.translate(n, r)), this.mark(e, t, r == null || Object.keys(r).length === 0 ? [n] : [n, r]);
	}
	writeText(e, t, n) {
		zo(e, t, mo(n, !0, this)), this.mark(e, t, n);
	}
	writeValue(e, t, n) {
		if (so(n)) {
			this.write(e, t, n.key, n.args);
			return;
		}
		let r = co(n) ? n.text : typeof n == "string" ? n : "";
		if (r.trim().length > 0) {
			this.writeText(e, t, r);
			return;
		}
		zo(e, t, ""), this.mark(e, t, null);
	}
	mark(e, t, n) {
		Io(e, t, n);
	}
	rewriteMarks(e, t = !1) {
		Bo(e, (e) => {
			for (let n of e.querySelectorAll(t ? Mo : `[${yr}]`)) for (let [e, r] of Object.entries(Ro(n))) {
				if (t && !fo(r)) continue;
				let i = this.wordsOfMark(r);
				i !== null && zo(n, e === "#text" ? null : e, i);
			}
		});
	}
	wordsOfMark(e) {
		if (typeof e == "string") return mo(e, !0, this);
		if (!Array.isArray(e)) return null;
		let [t, n] = e;
		return typeof t == "string" ? this.translate(t, typeof n == "object" && n ? n : null) : null;
	}
	askLater(e) {
		this.asker === null || !this.tableLoaded || e.length > Ao || e.trim().length === 0 || this.complete && !(this.report && this.currentPrefixes.length > 0 && go(this.currentPrefixes, e)) || this.askedIn(this.currentLanguage).has(e) || (this.pending.add(e), !this.flushQueued && (this.flushQueued = !0, setTimeout(() => void this.flushAsync(), 0)));
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
		for (let r = 0; r < n.length; r += ko) try {
			let a = await e(t, n.slice(r, r + ko));
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
function Po(e) {
	let t = !1;
	return Bo(e, (e) => {
		t ||= e.querySelector(Mo) !== null;
	}), t;
}
function Fo(e, t) {
	e.hasAttribute("data-ui-words") && Io(e, t, null);
}
function Io(e, t, n) {
	let r = Ro(e), i = t ?? "#text";
	if (n === null) {
		if (!(i in r)) return;
		delete r[i];
	} else r[i] = n;
	let a = JSON.stringify(r);
	Object.keys(r).length === 0 ? e.removeAttribute(yr) : e.getAttribute("data-ui-words") !== a && e.setAttribute(yr, a);
}
function Lo(e) {
	let t = Ro(e)[br];
	if (typeof t == "string") return t;
	if (!Array.isArray(t) || typeof t[0] != "string") return null;
	let n = t[1];
	return {
		key: t[0],
		args: typeof n == "object" && n ? n : null
	};
}
function Ro(e) {
	let t = e.getAttribute(yr);
	if (t === null || t.length === 0) return {};
	try {
		let e = JSON.parse(t);
		return typeof e == "object" && e && !Array.isArray(e) ? e : {};
	} catch {
		return {};
	}
}
function zo(e, t, n) {
	if (t === null) {
		e.textContent !== n && (e.textContent = n);
		return;
	}
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function Bo(e, t) {
	t(e);
	for (let n of e.querySelectorAll("template")) Bo(n.content, t);
}
var D = new No();
function Vo(e, t) {
	let n = co(e) ? e.text : e;
	return D.resolve(n, typeof n == "string" && n.length > 0 && t());
}
//#endregion
//#region src/updates/row-idle.ts
var Ho = "row-idle";
function Uo(e) {
	let t = e.parentElement;
	t !== null && (qo(t) ? Wo(t) : !t.hasAttribute("data-ui-id") && t.parentElement !== null && qo(t.parentElement) && Wo(t.parentElement));
}
function Wo(e) {
	let t = Go(e);
	e.hasAttribute("data-ui-row-idle") !== t && e.toggleAttribute(cr, t);
}
function Go(e) {
	for (let t of e.children) {
		if (t.hasAttribute("data-ui-id")) {
			if (Ko(t)) return !0;
			continue;
		}
		for (let e of t.children) if (e.hasAttribute("data-ui-id") && Ko(e)) return !0;
	}
	return !1;
}
function Ko(e) {
	return e.classList.contains("ui-disabled") || e.classList.contains("ui-loading");
}
function qo(e) {
	return e.hasAttribute("data-ui-key") && e.parentElement?.hasAttribute("data-ui-items-host") === !0;
}
//#endregion
//#region src/interactions/interactive-state.ts
var Jo = `.${Ur}, .${Wr}, [inert]`;
function Yo(e) {
	return `:scope > [${v}]:is(${e}), :scope > :not([${v}]) > [${v}]:is(${e})`;
}
var Xo = Yo(Jo), Zo = /* @__PURE__ */ new Map();
function O(e) {
	return e.closest(Jo) !== null || e.matches(":disabled, [aria-disabled='true']");
}
function k(e) {
	return e.matches(Jo) || e.querySelector(Xo) !== null;
}
function Qo(e, t) {
	if (e.hasAttribute(t)) return !0;
	let n = Zo.get(t);
	return n === void 0 && (n = Yo(`[${t}]`), Zo.set(t, n)), e.querySelector(n) !== null;
}
function $o(e) {
	return e.getClientRects().length > 0 && !e.matches(":disabled") && e.closest("[inert]") === null;
}
var es = `[${v}], .${Gr}`;
function A(e) {
	return e.closest(es)?.matches(`.${Gr}`) === !0;
}
function ts(e, t) {
	e.classList.contains("ui-disabled") !== t && (e.classList.toggle(Ur, t), Uo(e)), t ? e.setAttribute("aria-disabled", "true") : e.removeAttribute("aria-disabled");
}
var ns = {
	isInert: O,
	isReadOnly: A,
	setDisabled: ts
};
//#endregion
//#region src/interactions/grid-tracks.ts
function rs(e, t) {
	return Math.max(e, Math.round(t / 10));
}
function is(e) {
	let t = [];
	for (let n of ss(e.trim())) {
		let e = /^repeat\(\s*(\d+)\s*,(.+)\)$/s.exec(n);
		if (e !== null) {
			let n = is(e[2]);
			if (n === null) return null;
			for (let r = Number(e[1]); r > 0; r--) t.push(...n);
			continue;
		}
		let r = as(n);
		if (r === null) return null;
		t.push(r);
	}
	return t.length === 0 ? null : t;
}
function as(e) {
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
	if (n !== null) return os({
		kind: "auto",
		value: 0
	}, Number(n[1]));
	let r = /^minmax\(\s*([\d.]+)(?:px)?\s*,\s*([\d.]+)(fr|px)\s*\)$/.exec(e);
	if (r !== null) return os(r[3] === "fr" ? {
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
function os(e, t) {
	return t > 0 ? {
		...e,
		min: t
	} : e;
}
function ss(e) {
	let t = [], n = 0, r = 0;
	for (let i = 0; i < e.length; i++) {
		let a = e[i];
		a === "(" ? n++ : a === ")" ? n-- : a === " " && n === 0 && (i > r && t.push(e.slice(r, i)), r = i + 1);
	}
	return r < e.length && t.push(e.slice(r)), t;
}
function cs(e, t = "auto") {
	return e.map((e) => ls(e, t)).join(" ");
}
function ls(e, t) {
	switch (e.kind) {
		case "px": return `${us(e.value)}px`;
		case "star": return `minmax(${e.min === void 0 ? "0" : `${us(e.min)}px`}, ${us(e.value)}fr)`;
		case "auto": return e.min === void 0 ? e.max === void 0 ? t : `fit-content(${us(e.max)}px)` : `minmax(${us(e.min)}px, auto)`;
	}
}
function us(e) {
	return String(Math.round(e * 1e3) / 1e3);
}
function ds(e) {
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
function fs(e, t) {
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
function ps(e, t, n) {
	let r = 0, i = n;
	for (let n of t) n < e && n + 1 > r ? r = n + 1 : n > e && n < i && (i = n);
	let a = ms(r, e), o = ms(e + 1, i);
	return a.length === 0 || o.length === 0 ? null : {
		before: a,
		after: o
	};
}
function ms(e, t) {
	let n = [];
	for (let r = e; r < t; r++) n.push(r);
	return n;
}
var hs = {
	sliver: 120,
	passFloors: !1
};
function gs(e, t, n, r, i = hs) {
	let a = ys(e, t, n.before), o = ys(e, t, n.after);
	if (a.total + o.total <= 0) return null;
	let s = Math.max((i.passFloors ? 0 : a.min) - a.total, o.total - o.max), c = Math.min(a.max - a.total, o.total - (i.passFloors ? 0 : o.min));
	if (s > c) return null;
	let l = (e) => i.sliver > 0 && i.passFloors ? Math.max(i.sliver, e.min) : i.sliver, u = vs(Math.min(Math.max(r, s), c), r, a.total, o.total, s, c, l(a), l(o));
	if (u === 0) return null;
	let d = [...e], f = n.before.every((t) => e[t].kind === "star"), p = n.after.every((t) => e[t].kind === "star");
	if (f && p) {
		let t = ws(n.before, e) + ws(n.after, e), r = a.total + o.total;
		bs(d, e, a, t * (a.total + u) / r), bs(d, e, o, t * (o.total - u) / r);
	} else f || xs(d, a, a.total + u), p || xs(d, o, o.total - u);
	return i.passFloors && (_s(d, a, a.total + u), _s(d, o, o.total - u)), d;
}
function _s(e, t, n) {
	if (!(n >= t.min - .5)) for (let n of t.indices) {
		let { min: t, ...r } = e[n];
		e[n] = r;
	}
}
function vs(e, t, n, r, i, a, o, s) {
	let c = e, l = n + c, u = r - c;
	return l > 0 && l < o ? c = t < 0 ? -n : o - n : u > 0 && u < s && (c = t > 0 ? r : r - s), Math.min(Math.max(c, i), a);
}
function ys(e, t, n) {
	let r = Cs(n, t), i = n.map((e) => r > 0 ? t[e] / r : 1 / n.length), a = 0, o = Infinity;
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
function bs(e, t, n, r) {
	let i = ws(n.indices, t);
	for (let a = 0; a < n.indices.length; a++) {
		let o = n.indices[a], s = i > 0 && n.total > 0 ? n.shares[a] : 1 / n.indices.length;
		e[o] = {
			...t[o],
			value: r * s
		};
	}
}
function xs(e, t, n) {
	for (let r = 0; r < t.indices.length; r++) {
		let i = t.indices[r];
		e[i] = {
			kind: "px",
			value: n * t.shares[r],
			...Ss(e[i])
		};
	}
}
function Ss(e) {
	return {
		...e.min === void 0 ? {} : { min: e.min },
		...e.max === void 0 ? {} : { max: e.max }
	};
}
function Cs(e, t) {
	let n = 0;
	for (let r of e) n += t[r];
	return n;
}
function ws(e, t) {
	let n = 0;
	for (let r of e) n += t[r].value;
	return n;
}
function Ts(e, t) {
	return Math.round(Es(e, t) * 100);
}
function Es(e, t) {
	let n = Cs(t.before, e), r = n + Cs(t.after, e);
	return r <= 0 ? 0 : n / r;
}
function Ds(e, t, n) {
	let r = Cs(t.before, e);
	return (r + Cs(t.after, e)) * Math.min(Math.max(n, 0), 1) - r;
}
function Os(e) {
	let t = e === null || e.length === 0 ? NaN : Number(e);
	return t >= 0 && t <= 1 ? t : null;
}
function ks(e, t) {
	let n = [];
	for (let r = 0, i = 0; r < t; r++) n.push(i), i += Number.isFinite(e[r]) ? e[r] : 0;
	return n;
}
var As = /* @__PURE__ */ new Set();
function js(e, t, n, r) {
	let i = ys(e, t, n.before), a = ys(e, t, n.after);
	return i.total >= 1 && i.total < r ? -i.total : a.total >= 1 && a.total < r ? a.total : i.total >= 1 && i.total < i.min - .5 ? i.min - i.total : a.total >= 1 && a.total < a.min - .5 ? a.total - a.min : 0;
}
function Ms(e, t, n, r) {
	let i = /* @__PURE__ */ new Set();
	for (let a of [n.before, n.after]) {
		let n = ys(e, t, a);
		n.total < Math.max(r, n.min - .5) && a.forEach((e) => i.add(e));
	}
	return i;
}
function Ns(e, t) {
	return e.map((e, n) => t.has(n) ? {
		kind: "px",
		value: 0
	} : e);
}
function Ps(e, t, n, r = As) {
	let i = Number(e);
	if (!Number.isInteger(i) || i < 1) return !1;
	let a = /^span\s+(\d+)$/.exec(t.trim()), o = Number(t), s = a === null ? Number.isInteger(o) && o > i ? o : i + 1 : i + Number(a[1]);
	return s - 1 <= n.length && n.slice(i - 1, s - 1).every((e, t) => e < 1 || r.has(i - 1 + t));
}
//#endregion
//#region src/extensions/value-readers.ts
function Fs(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" ? String(e) : JSON.stringify(e);
}
function Is(e) {
	return e == null;
}
var Ls = "data-ui-trim-input", Rs = class {
	readers = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let e of Hs) this.register(e);
		for (let t of e ?? []) this.register(t);
	}
	register(e) {
		this.readers.set(e.kind, e.read);
	}
	read(e) {
		let t = e.getAttribute(St);
		if (t === null) return zs(e);
		let n = this.readers.get(t);
		return n === void 0 ? (s("value reader: no reader registered for this kind.", { kind: t }), null) : n(e);
	}
	readBound(e) {
		let t = this.read(e);
		return typeof t == "string" && e.hasAttribute(Ls) ? t.trim() : t;
	}
	readHeld(e) {
		let t = Vs(e);
		return t === null ? null : this.read(t);
	}
};
function zs(e) {
	if (e instanceof HTMLInputElement) switch (e.type) {
		case "checkbox": return e.checked;
		case "number":
		case "range": return e.value.trim().length === 0 ? null : Number(e.value);
		default: return e.value;
	}
	return e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement ? e.value : e instanceof HTMLDetailsElement ? e.open : null;
}
var Bs = "input, textarea, select";
function Vs(e) {
	return e.hasAttribute("data-ui-value-kind") || e.matches(Bs) ? e : e.querySelector("[data-ui-value-holder]") ?? e.querySelector(`[data-ui-value-kind], ${Bs}`);
}
var Hs = [
	{
		kind: "flyout-open",
		read: (e) => e.classList.contains("ui-flyout--open")
	},
	{
		kind: "splitter-position",
		read: (e) => Os(e.getAttribute(On))
	},
	{
		kind: "pane-layout",
		read: (e) => e.getAttribute(kn)
	},
	{
		kind: "tabs-selected",
		read: (e) => e.getAttribute(Lr)
	},
	{
		kind: "tab-caption",
		read: (e) => e.getAttribute(Rr)
	},
	{
		kind: "tab-pinned",
		read: (e) => e.hasAttribute(zr)
	},
	{
		kind: "tree-title",
		read: (e) => e.getAttribute(tr)
	},
	{
		kind: "tree-drop-target",
		read: (e) => e.getAttribute("data-ui-tree-drop-target") ?? ""
	},
	{
		kind: "selected-key",
		read: (e) => e.getAttribute(Pr)
	},
	{
		kind: "selected-keys",
		read: (e) => Us(e, Fr)
	},
	{
		kind: Ct,
		read: (e) => Us(e, rt)
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
function Us(e, t) {
	let n = e.getAttribute(t);
	return n === null ? null : JSON.parse(n);
}
function Ws(e) {
	if (e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio")) {
		e.checked = !1;
		return;
	}
	(e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement) && (e.value = "");
}
//#endregion
//#region src/interactions/keyboard-shortcut.ts
function Gs(e) {
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
		default: o = ic(e);
	}
	return o === null ? null : {
		code: o,
		ctrl: n,
		shift: r,
		alt: i,
		meta: a
	};
}
function Ks(e, t, n = Qs()) {
	return t.code !== e.code || t.shiftKey !== e.shift || t.altKey !== e.alt ? !1 : e.ctrl && !e.meta && n ? t.ctrlKey !== t.metaKey : t.ctrlKey === e.ctrl && t.metaKey === e.meta;
}
function qs(e, t = Qs()) {
	let n = Js(e.code, t);
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
function Js(e, t) {
	return /^Key[A-Z]$/.test(e) ? e.slice(3) : /^Digit[0-9]$/.test(e) ? e.slice(5) : (t ? Xs[e] : void 0) ?? Ys[e] ?? e;
}
var Ys = {
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
}, Xs = {
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
}, Zs = null;
function Qs() {
	return Zs === null && (Zs = $s()), Zs;
}
function $s() {
	if (typeof navigator > "u") return !1;
	let e = navigator.userAgentData?.platform;
	return /mac/i.test(e ?? navigator.platform ?? "");
}
var ec = {
	words(e) {
		let t = Gs(e);
		return t === null ? null : qs(t);
	},
	matches(e, t) {
		let n = Gs(t);
		return n !== null && Ks(n, e);
	},
	isComposing: j
}, tc = 229;
function j(e) {
	return e.isComposing || e.keyCode === tc;
}
function M(e, t = {}) {
	return !e.ctrlKey && !e.metaKey && (t.alt === !0 || !e.altKey) && (t.shift === !0 || !e.shiftKey) && !j(e);
}
var nc = class {
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
function rc(e) {
	return [
		e.ctrl ? "ctrl" : "",
		e.shift ? "shift" : "",
		e.alt ? "alt" : "",
		e.meta ? "meta" : "",
		e.code
	].filter((e) => e.length > 0).join("+");
}
function ic(e) {
	if (e.length === 1) {
		let t = e.toUpperCase();
		return t >= "A" && t <= "Z" ? `Key${t}` : t >= "0" && t <= "9" ? `Digit${t}` : ac[t] ?? null;
	}
	let t = e.length === 0 ? "" : e[0].toUpperCase() + e.slice(1).toLowerCase();
	return /^F([1-9]|1[0-9]|2[0-4])$/.test(t.toUpperCase()) ? t.toUpperCase() : ac[t] ?? null;
}
var ac = {
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
}, oc = "data-ui-rename-field";
function sc(e) {
	return e instanceof Element && e.closest(`[${oc}]`) !== null;
}
function cc(e) {
	let { container: t, title: n } = e;
	if (t.querySelector(`.${e.className}`) !== null) return !1;
	let r = document.createElement("input");
	r.type = "text", r.className = e.className, r.setAttribute(oc, ""), r.setAttribute(Ye, ""), r.value = e.value, lc(r, n, t);
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
function lc(e, t, n) {
	let r = t.getBoundingClientRect(), i = n.getBoundingClientRect(), a = getComputedStyle(t), o = uc(n), s = o > 0 && i.width > 0 ? i.width / o : 1;
	e.style.left = dc((r.left - i.left) / s - n.clientLeft), e.style.top = dc((r.top - i.top) / s - n.clientTop), e.style.width = dc(r.width / s), e.style.height = dc(r.height / s), e.style.fontFamily = a.fontFamily, e.style.fontSize = a.fontSize, e.style.fontWeight = a.fontWeight, e.style.fontStyle = a.fontStyle, e.style.lineHeight = a.lineHeight, e.style.letterSpacing = a.letterSpacing, e.style.textAlign = a.textAlign;
}
function uc(e) {
	let t = getComputedStyle(e), n = parseFloat(t.width);
	return Number.isFinite(n) ? t.boxSizing === "border-box" ? n : n + parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth) : e.offsetWidth;
}
function dc(e) {
	return `${Math.round(e * 64) / 64}px`;
}
//#endregion
//#region src/interactions/field-escape.ts
var fc = "data-ui-runs-on-escape", pc = "ui-key-value-action__row", mc = "ui-key-value-action__value-input", hc = "ui-key-value-action__edit-action";
function gc(e) {
	return j(e) || _c(e.target) !== null;
}
function _c(e) {
	return e instanceof Element ? sc(e) || vc(e) ? e : e.closest("[data-ui-owns-keys]") ?? yc(e)?.cell ?? null : null;
}
function vc(e) {
	return e instanceof Element && e.hasAttribute(fc) && (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && !e.readOnly && !O(e);
}
function yc(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${mc}, .${hc}`), n = t?.closest(".ui-key-value-action__row") ?? null;
	return t === null || n === null || !n.hasAttribute("data-ui-row-editing") ? null : {
		cell: t,
		row: n
	};
}
//#endregion
//#region src/interactions/caret-fields.ts
var bc = /* @__PURE__ */ new Set([
	"text",
	"search",
	"number",
	"password",
	"email",
	"url",
	"tel"
]), xc = /* @__PURE__ */ new Set([
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
]), Sc = /* @__PURE__ */ new Set([
	"KeyA",
	"KeyC",
	"KeyV",
	"KeyX",
	"KeyZ",
	"KeyY",
	"Insert"
]), Cc = /^F\d{1,2}$/;
function wc(e) {
	return e instanceof HTMLInputElement && bc.has(e.type);
}
function Tc(e) {
	return wc(e) || e instanceof HTMLTextAreaElement;
}
function Ec(e) {
	return Tc(e) || e instanceof HTMLElement && e.isContentEditable;
}
function Dc(e) {
	let t = e.target;
	if (!Ec(t)) return !1;
	if (j(e)) return !0;
	let n = e.key;
	return n === "Tab" || n === "Escape" || Cc.test(n) || e.altKey ? !1 : n === "Enter" ? !wc(t) : e.ctrlKey || e.metaKey ? xc.has(n) || Sc.has(e.code) : !0;
}
var Oc = {
	...ec,
	isFieldKey: Dc,
	isPlainKey: M,
	isEscapeClaimed: gc
}, kc = "ui-draft-dropped";
function Ac(e) {
	e.dispatchEvent(new Event(kc, { bubbles: !0 }));
}
//#endregion
//#region src/interactions/own-control.ts
var jc = `.ui-text-input__row, .ui-number-input__row, .ui-temporal-input__row, .ui-file-input__row, .ui-color-input__row, .${$r}, .ui-field-box`, Mc = "button, a, input, select, textarea, label, summary, [role='button'], [contenteditable=''], [contenteditable='true']", Nc = `${Mc}, ${jc}, ${Qr}, .${_e}`, Pc = "button, a, summary, [role='button']";
function Fc(e) {
	let t = [];
	for (let n of e.querySelectorAll(Nc)) if (!(n.classList.contains("ui-row__grip") || !Rc(e, n) || Lc(e, n) || t.some((e) => e.contains(n))) && (t.push(n), t.length > 1)) return null;
	let n = t[0];
	return n instanceof HTMLElement && n.matches(Pc) ? n : null;
}
function Ic(e) {
	let t = [];
	for (let n of e.querySelectorAll(Mc)) Lc(e, n) && Rc(e, n) && t.push(n);
	return t;
}
function Lc(e, t) {
	let n = t.closest(`[${de}]`);
	return n !== null && n !== e && e.contains(n);
}
function Rc(e, t) {
	let n = t.closest(Qr);
	return (n === null || !e.contains(n)) && t.closest(".ui-action-bar") === null;
}
function zc(e, t) {
	if (!(e instanceof Element)) return null;
	let n = e.closest(Nc);
	return n !== null && n !== t && t.contains(n) ? n : null;
}
//#endregion
//#region src/interactions/roving-focus.ts
function Bc(e) {
	let t = Wc(e.key), n = Gc(e.key, e.axis);
	if (t === null && n === 0) return null;
	let r = e.items.filter(P);
	if (r.length === 0) return null;
	if (t !== null) return t === "first" ? r[0] : r[r.length - 1];
	let i = e.current === null ? -1 : r.indexOf(e.current);
	if (i === -1) return n > 0 ? r[0] : r[r.length - 1];
	let a = i + n;
	return a >= 0 && a < r.length ? r[a] : e.loop ?? !0 ? r[(a + r.length) % r.length] : null;
}
function Vc(e, t) {
	return Wc(e) !== null || Gc(e, t) !== 0;
}
var Hc = {
	target: Bc,
	applyTabIndex: N
};
function N(e, t) {
	for (let n of e) n.tabIndex = n === t ? 0 : -1;
}
function Uc(e, t) {
	t !== null && (N(e, t), t.focus());
}
function P(e) {
	return e.getClientRects().length > 0 && !O(e);
}
function Wc(e) {
	return e === "Home" ? "first" : e === "End" ? "last" : null;
}
function Gc(e, t) {
	return t !== "horizontal" && (e === "ArrowDown" || e === "ArrowUp") ? e === "ArrowDown" ? 1 : -1 : t !== "vertical" && (e === "ArrowRight" || e === "ArrowLeft") ? e === "ArrowRight" ? 1 : -1 : 0;
}
//#endregion
//#region src/items/items-viewport.ts
function Kc(e) {
	return e.hasAttribute("data-ui-host-viewport") ? e.parentElement ?? e : e;
}
function qc(e) {
	return e instanceof Element ? e.hasAttribute("data-ui-items-host") ? e : e.querySelector(`:scope > [${b}][${Tt}]`) : null;
}
function Jc(e) {
	let t = Kc(e);
	return t === e ? {
		top: e.scrollTop,
		height: e.clientHeight,
		contentHeight: e.scrollHeight
	} : {
		top: t.scrollTop - Xc(e, t),
		height: t.clientHeight,
		contentHeight: e.scrollHeight
	};
}
function Yc(e, t) {
	let n = Kc(e);
	n.scrollTop = n === e ? t : t + Xc(e, n);
}
function Xc(e, t) {
	return e.getBoundingClientRect().top - t.getBoundingClientRect().top - t.clientTop + t.scrollTop;
}
function Zc(e) {
	let t = e.getBoundingClientRect();
	return t.height > 0 || e.firstElementChild === null ? t : e.firstElementChild.getBoundingClientRect();
}
//#endregion
//#region src/interactions/multi-select-keys.ts
function Qc(e) {
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
function $c(e) {
	if (e === null) return null;
	let t = Number(e);
	return Number.isInteger(t) && t > 0 ? t : null;
}
function el(e, t) {
	return t !== null && e.length >= t;
}
function tl(e, t, n) {
	return e.includes(t) ? e.filter((e) => e !== t) : el(e, n) ? null : [...e, t];
}
function nl(e, t) {
	return e.includes(t) ? e.filter((e) => e !== t) : null;
}
var rl = /[,\uFF0C\r\n]/;
function il(e) {
	return rl.test(e);
}
function al(e) {
	return e.split(rl).map((e) => e.trim()).filter((e) => e.length > 0);
}
function ol(e) {
	let t = e.split(rl), n = t.pop() ?? "";
	return {
		tags: t.map((e) => e.trim()).filter((e) => e.length > 0),
		rest: n
	};
}
function sl(e, t, n, r, i) {
	let a = [...e], o = [], s = null;
	for (let e of t) {
		if (a.includes(e.key)) continue;
		let t = [...a, e.key], c = el(a, n) ? r : i(a, t);
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
function cl(e, t, n) {
	let r = [];
	for (let i of e.querySelectorAll(t)) i.closest(n) === e && r.push(i);
	return r;
}
function ll(e) {
	return cl(e, bn, `.${pn}`);
}
//#endregion
//#region src/interactions/selected-key.ts
function ul(e, t, n) {
	t.length !== 0 && e.getAttribute(n.attribute) !== t && (e.setAttribute(n.attribute, t), n.apply(e), e.hasAttribute(n.bindingAttribute) && e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function dl(e, t, n) {
	return e.length === 0 ? null : e.some((e) => n(e) === t) ? t : n(e[0]);
}
//#endregion
//#region src/interactions/row-selection.ts
var fl = "data-ui-bind-selected-keys", F = `.ui-items-view, .ui-table, .${zn}`, pl = `.ui-items-view__item, .${Fn}, .${Bn}`, ml = ".ui-items-view, .ui-table", hl = {
	shift: !1,
	ctrl: !1
}, gl = /* @__PURE__ */ new WeakMap();
function _l(e, t) {
	t !== null && !gl.has(e) && vl(e, t);
}
function vl(e, t) {
	let n = L(t);
	n.length > 0 && gl.set(e, n);
}
function yl(e) {
	return {
		shift: e.shiftKey,
		ctrl: e.ctrlKey || e.metaKey
	};
}
function bl(e, t) {
	let n = yl(t);
	return n.shift && e.hasAttribute("data-ui-no-row-select") ? {
		shift: !0,
		ctrl: !0
	} : n;
}
function xl(e) {
	return !e.hasAttribute(Xn);
}
function I(e) {
	if (e.getClientRects().length > 0) return e;
	let t = e.querySelector(`:scope > [${v}]`);
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function Sl(e) {
	switch (e.getAttribute(Mr)) {
		case "one": {
			let t = e.getAttribute(Pr);
			return new Set(t === null || t.length === 0 ? [] : [t]);
		}
		case "many": return new Set(jl(Ml(e)));
		default: return /* @__PURE__ */ new Set();
	}
}
function Cl(e, t) {
	let n = Sl(e), r = e.getAttribute(Mr), i = r === "one" || r === "many";
	for (let e of t) {
		let t = n.has(L(e));
		e.toggleAttribute(Nr, t), i ? e.setAttribute("aria-selected", t ? "true" : "false") : e.removeAttribute("aria-selected");
	}
}
function wl(e) {
	return e.filter((e) => e.hasAttribute(Nr));
}
function Tl(e, t, n, r, i) {
	let a = L(n);
	if (!Ol(n)) return !1;
	switch (e.getAttribute(Mr)) {
		case "one": return ul(e, a, {
			attribute: Pr,
			bindingAttribute: Ir,
			apply: (e) => Cl(e, t)
		}), !0;
		case "many": return El(e, t, n, a, r, i), !0;
		default: return !1;
	}
}
function El(e, t, n, r, i, a) {
	let o = Ml(e);
	if (o === null) return;
	let s = jl(o), c;
	if (i.shift) {
		let o = gl.get(e), l = o === void 0 ? null : a?.(o, r) ?? null, u = t.find((e) => L(e) === o) ?? n, d = l === null ? Al(t, u, n).map(L) : kl(l, t);
		c = i.ctrl ? [...s.filter((e) => !d.includes(e)), ...d] : d;
	} else i.ctrl ? (c = s.includes(r) ? s.filter((e) => e !== r) : [...s, r], gl.set(e, r)) : (c = [r], gl.set(e, r));
	Dl(e, t, c);
}
function Dl(e, t, n) {
	let r = Ml(e);
	if (r === null) return;
	let i = JSON.stringify(n);
	r.getAttribute("data-ui-selected-keys") !== i && (r.setAttribute(Fr, i), Cl(e, t), r.hasAttribute(fl) && r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function Ol(e) {
	return L(e).length > 0 && !Qo(e, "data-ui-unselectable") && !k(e);
}
function kl(e, t) {
	let n = new Map(t.map((e) => [L(e), e]));
	return e.filter((e) => {
		let t = n.get(e);
		return t === void 0 || I(t) !== null && Ol(t);
	});
}
function Al(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	return r < 0 || i < 0 ? [n] : e.slice(Math.min(r, i), Math.max(r, i) + 1).filter((e) => I(e) !== null && Ol(e));
}
function jl(e) {
	return Qc(e?.getAttribute("data-ui-selected-keys") ?? null);
}
function Ml(e) {
	let t = e.closest(S);
	for (let n of e.querySelectorAll(`[${b}]`)) if (n.closest(F) === e && n.closest(S) === t) return n;
	return null;
}
function L(e) {
	return e.getAttribute("data-ui-key") ?? "";
}
var Nl = {
	isSelected: (e) => e.hasAttribute(Nr),
	toggle: Pl,
	setSelected: Fl,
	setSelectedKeys: Il
};
function Pl(e) {
	let t = e.closest(F);
	t !== null && e instanceof HTMLElement && Tl(t, Ll(t), e, {
		shift: !1,
		ctrl: !0
	});
}
function Fl(e, t, n) {
	let r = [];
	for (let e of t) e.classList.contains("ui-hidden") || r.push(L(e));
	Il(e, r, n);
}
function Il(e, t, n) {
	if (!(e instanceof HTMLElement)) return;
	let r = Ll(e), i = new Set(r.filter((e) => !Ol(e)).map(L)), a = /* @__PURE__ */ new Set();
	for (let e of t) e.length > 0 && !i.has(e) && a.add(e);
	let o = [...Sl(e)].filter((e) => !a.has(e));
	Dl(e, r, n ? [...o, ...a] : o);
}
function Ll(e) {
	return cl(e, pl, F);
}
//#endregion
//#region src/interactions/table-column-layout.ts
var Rl = "--ui-table-order-";
function zl(e) {
	let t = new Set((e.getAttribute("data-ui-table-hidden") ?? "").split(" ").filter((e) => e.length > 0)), n = e instanceof HTMLElement ? e.style : null;
	return {
		place: (e) => {
			let t = n?.getPropertyValue(`--ui-table-order-${e}`).trim() ?? "";
			return t.length === 0 ? e : Number(t);
		},
		isHidden: (e) => t.has(String(e))
	};
}
var Bl = "ui-table", Vl = `[${jn}]:not(.${Rn})`, Hl = `.${Fn} > [aria-colspan]:not([${jn}])`;
function Ul(e, t, n, r) {
	let i = /* @__PURE__ */ new Map();
	for (let e of t) n.has(e) || i.set(e, String(i.size + 1));
	let a = String(i.size), o = r ? ":not([aria-colindex])" : "";
	Wl(e, "aria-colcount", a);
	for (let t of e.querySelectorAll(`${Vl}${o}, ${Hl}${o}`)) {
		if (t.closest(`.${Bl}`) !== e) continue;
		if (!t.hasAttribute("data-ui-table-column")) {
			Wl(t, "aria-colindex", "1"), Wl(t, "aria-colspan", a);
			continue;
		}
		let n = i.get(Number(t.getAttribute(jn)));
		n === void 0 ? t.removeAttribute("aria-colindex") : Wl(t, "aria-colindex", n);
	}
}
function Wl(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/interactions/row-cursor.ts
var Gl = ".ui-table[role='grid']", Kl = "gridcell", ql = "aria-colspan", Jl = /* @__PURE__ */ new WeakMap();
function Yl(e) {
	let t = e.closest(F);
	if (t === null) return null;
	if (e === t) return {
		root: t,
		row: null
	};
	let n = e.closest(pl);
	return n !== null && n.closest(F) === t ? {
		root: t,
		row: n
	} : null;
}
function Xl(e) {
	return e.target instanceof Element && !Dc(e) ? Zl(e.target) : null;
}
function Zl(e) {
	let t = Yl(e);
	if (t === null || t.row !== null && zc(e, t.row) !== null) return null;
	let n = e.closest(`[${Zr}]`);
	return n !== null && n !== t.root && t.root.contains(n) ? null : t;
}
function Ql(e) {
	return e.filter((e) => I(e) !== null && !k(e));
}
function $l(e) {
	return eu(e) ?? Ql(e)[0] ?? null;
}
function eu(e) {
	return e.find((e) => e.hasAttribute("data-ui-row-focus")) ?? e.find((e) => e.hasAttribute("data-ui-selected") && !k(e)) ?? null;
}
function tu(e) {
	return eu(Ll(e));
}
function nu(e, t) {
	if (e.hasAttribute("data-ui-row-cursor-waits") || t.some((e) => e.hasAttribute("data-ui-row-focus"))) return;
	let n = $l(t);
	n !== null && iu(e, t, n);
}
function ru(e, t) {
	t === null ? e.removeAttribute("aria-labelledby") : e.setAttribute("aria-labelledby", gi(t, "ui-row-name"));
}
function iu(e, t, n, r = null, i = !0) {
	for (let e of t) e !== n && e.hasAttribute("data-ui-row-focus") && e.removeAttribute(je);
	n.hasAttribute("data-ui-row-focus") || n.setAttribute(je, ""), e.removeAttribute(Me);
	let a = au(e, n, r);
	i && ((I(n) ?? n).scrollIntoView({ block: "nearest" }), a !== null && du(e, n, a));
}
function au(e, t, n) {
	let r = ou(e) ? su(e, t, n) : null;
	for (let t of e.querySelectorAll(`[${Pe}]`)) t !== r && t.closest(F) === e && t.removeAttribute(Pe);
	if (r === null) return e.setAttribute("aria-activedescendant", gi(t, "ui-row")), null;
	r.hasAttribute("data-ui-cell-focus") || r.setAttribute(Pe, "");
	let i = r.getAttribute(jn);
	return i !== null && Jl.set(e, i), e.setAttribute("aria-activedescendant", gi(r, "ui-cell")), r;
}
function ou(e) {
	return e.matches(Gl);
}
function su(e, t, n) {
	if (n instanceof HTMLElement && n.parentElement === t && n.getAttribute("role") === Kl) {
		if (!n.hasAttribute("data-ui-owns-keys")) return n;
		let e = cu(t, n.getAttribute(jn));
		if (e !== null) return e;
	}
	let r = lu(e, t), i = Jl.get(e);
	if (i === void 0) return r[0] ?? null;
	let a = r.find((e) => e.getAttribute(jn) === i);
	if (a !== void 0) return a;
	let o = zl(e), s = o.place(Number(i)), c = (e) => Math.abs(o.place(Number(e.getAttribute(jn))) - s);
	return r.reduce((e, t) => e === null || c(t) < c(e) ? t : e, null);
}
function cu(e, t) {
	for (let n of e.children) if (t !== null && n instanceof HTMLElement && n.getAttribute("data-ui-table-column") === t && uu(n)) return n;
	return null;
}
function lu(e, t) {
	let n = zl(e), r = [];
	for (let e of t.children) {
		let t = Number(e.getAttribute("data-ui-table-column") ?? NaN);
		e instanceof HTMLElement && Number.isInteger(t) && uu(e) && !n.isHidden(t) && r.push({
			cell: e,
			place: n.place(t)
		});
	}
	return r.sort((e, t) => e.place - t.place).map((e) => e.cell);
}
function uu(e) {
	return e.getAttribute("role") === Kl && !e.hasAttribute("data-ui-owns-keys");
}
function du(e, t, n) {
	let r = e.querySelector(`:scope > .${In}`);
	if (r === null || !(r.scrollWidth > r.clientWidth) || !n.hasAttribute("data-ui-table-column")) return;
	let i = r.getBoundingClientRect(), a = i.left + i.width / 2, o = i.left + r.clientLeft, s = o + r.clientWidth;
	for (let e of t.children) {
		if (e === n || !(e instanceof HTMLElement) || getComputedStyle(e).position !== "sticky") continue;
		let t = e.getBoundingClientRect();
		t.left + t.width / 2 < a ? o = Math.max(o, t.right) : s = Math.min(s, t.left);
	}
	let c = n.getBoundingClientRect();
	r.scrollLeft += fu(c.left, c.right, o, s);
}
function fu(e, t, n, r) {
	return e < n ? e - n : t > r ? Math.min(t - r, e - n) : 0;
}
function pu(e) {
	for (let t of e.children) if (t instanceof HTMLElement && t.hasAttribute("data-ui-cell-focus")) return t;
	return null;
}
function mu(e) {
	return Jl.get(e) ?? null;
}
function hu(e, t, n, r) {
	if (n !== null && vu(n)) return null;
	let i = lu(e, t), a = n?.getAttribute("data-ui-table-column") ?? null, o = i.findIndex((e) => e.getAttribute(jn) === a);
	switch (r) {
		case "Home": return i[0] ?? null;
		case "End": return i[i.length - 1] ?? null;
		case "ArrowLeft": return o > 0 ? i[o - 1] : null;
		case "ArrowRight": return o < 0 ? i[0] ?? null : i[o + 1] ?? null;
		default: return null;
	}
}
function gu(e, t, n, r) {
	let i = _u(t), a = (n === null ? -1 : i.indexOf(n)) + (r ? 1 : -1);
	return i.length === 0 || a < -1 || a >= i.length ? null : a === -1 ? su(e, t, null) : i[a];
}
function _u(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && vu(e));
}
function vu(e) {
	return uu(e) && e.hasAttribute(ql) && !e.hasAttribute("data-ui-table-column");
}
function yu(e) {
	let t = _u(e);
	return t[t.length - 1] ?? null;
}
function bu(e, t) {
	let n = t;
	for (; n !== null && n.parentElement !== e;) n = n.parentElement;
	return n?.getAttribute("role") === Kl ? n : null;
}
function xu(e, t = null) {
	let n = e.closest(F);
	n !== null && e instanceof HTMLElement && iu(n, Ll(n), e, t);
}
function Su(e, t) {
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
function Cu(e, t) {
	return Vc(e, t === "grid" ? "both" : t) || t !== "horizontal" && wu(e);
}
function wu(e) {
	return e === "PageDown" || e === "PageUp";
}
function Tu(e, t, n, r) {
	if (!Cu(e, r)) return null;
	let i = Ql(t);
	if (wu(e)) return Eu(i, n, e === "PageDown");
	if (r === "grid" && (e === "ArrowUp" || e === "ArrowDown")) return Du(i, n, e === "ArrowDown");
	let a = i.map((e) => I(e) ?? e), o = Bc({
		key: e,
		items: a,
		current: n === null ? null : I(n),
		axis: r === "grid" ? "horizontal" : r,
		loop: !1
	});
	return o === null ? null : i[a.indexOf(o)] ?? null;
}
function Eu(e, t, n) {
	let r = t === null ? -1 : e.indexOf(t), i = r < 0 ? null : e[r].parentElement;
	if (i === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let a = (I(e[r]) ?? e[r]).getBoundingClientRect(), o = Math.min(Jc(i).height, window.innerHeight), s = n ? 1 : -1, c = null;
	for (let t = r + s; t >= 0 && t < e.length; t += s) {
		let r = (I(e[t]) ?? e[t]).getBoundingClientRect();
		if (c !== null && (n ? r.bottom > a.top + o + .5 : r.top < a.bottom - o - .5)) break;
		c = e[t];
	}
	return c;
}
function Du(e, t, n) {
	let r = t === null ? null : I(t);
	if (r === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let i = r.getBoundingClientRect(), a = Ou(i), o = e.map((e) => ({
		row: e,
		rect: (I(e) ?? e).getBoundingClientRect()
	})).filter(({ rect: e }) => n ? e.top >= i.bottom - .5 : e.bottom <= i.top + .5);
	if (o.length === 0) return null;
	let s = o.reduce((e, t) => (n ? t.rect.top < e.rect.top : t.rect.bottom > e.rect.bottom) ? t : e);
	return o.filter(({ rect: e }) => n ? e.top < s.rect.bottom - .5 : e.bottom > s.rect.top + .5).reduce((e, t) => Math.abs(Ou(t.rect) - a) < Math.abs(Ou(e.rect) - a) ? t : e).row;
}
function Ou(e) {
	return e.left + e.width / 2;
}
var ku = "ui-row-press";
function Au(e, t, n) {
	(e.hasAttribute("data-ui-id") ? e : e.querySelector(":scope > [data-ui-id]") ?? e).dispatchEvent(n === void 0 ? new Event(t, { bubbles: !0 }) : new CustomEvent(t, {
		bubbles: !0,
		detail: n
	}));
}
function ju(e, t, n) {
	let r = n.hasAttribute(je), i = n.contains(document.activeElement);
	if (!r && !i) return null;
	let a = t.indexOf(n), o = t.filter((e) => e !== n);
	return () => {
		if (i && e.focus({ preventScroll: !0 }), !r) return;
		let n = Mu(t, o, a);
		n !== null && iu(e, o, n);
	};
}
function Mu(e, t, n) {
	let r = Ql(t);
	return n < 0 || r.length === 0 ? null : r.find((t) => e.indexOf(t) > n) ?? r[r.length - 1];
}
function Nu(e, t) {
	let n = t.find((e) => e.hasAttribute(je));
	if (n === void 0 || I(n) !== null) return;
	let r = Mu(t, t, t.indexOf(n));
	if (r !== null) {
		iu(e, t, r, null, !1);
		return;
	}
	n.removeAttribute(je), pu(n)?.removeAttribute(Pe), e.removeAttribute("aria-activedescendant");
}
function Pu(e) {
	let t = e.parentElement, n = t?.closest(F) ?? null;
	return n !== null && (n === t || n === t?.parentElement) ? n : t;
}
function Fu(e) {
	let t = e.hasAttribute(je), n = e.contains(document.activeElement);
	return t || n ? {
		cursor: t,
		focus: n,
		key: e.getAttribute(y)
	} : null;
}
function Iu(e, t, n) {
	let r = Pu(e);
	if (n !== null && r !== null && (n.focus && !r.contains(document.activeElement) && r.focus({ preventScroll: !0 }), n.cursor)) {
		if (t === null) {
			typeof n.key == "string" && r.setAttribute(Me, n.key);
			return;
		}
		[...e.children].some((e) => e !== t && e.hasAttribute("data-ui-row-focus")) || zu(r, t);
	}
}
function Lu(e, t) {
	let n = Pu(e), r = n?.getAttribute("data-ui-row-cursor-waits") ?? null;
	n !== null && r !== null && r === t.getAttribute("data-ui-key") && (n.removeAttribute(Me), [...e.children].some((e) => e !== t && e.hasAttribute("data-ui-row-focus")) || zu(n, t));
}
function Ru(e) {
	return e.getAttribute(Me);
}
function zu(e, t) {
	t.setAttribute(je, ""), au(e, t, null);
}
//#endregion
//#region src/interactions/popup-focus.ts
var Bu = "data-ui-active", Vu = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(","), Hu = /* @__PURE__ */ new Set([
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
]), Uu = !1, Wu = !1, Gu = null, Ku = /* @__PURE__ */ new Set(), qu = [], Ju = /* @__PURE__ */ new WeakSet();
typeof window < "u" && (window.addEventListener("pointerdown", (e) => Yu(e.target, e.pointerType), !0), window.addEventListener("keydown", (e) => Xu(e), !0), window.addEventListener("focus", (e) => Zu(e.target), !0), window.addEventListener("focusin", (e) => Zu(e.target), !0), window.addEventListener("focusout", (e) => Qu(e), !0));
function Yu(e, t = "") {
	Uu = !0, Wu = t === "touch";
	let n = document.activeElement;
	Gu = n, n instanceof Element && n !== document.body && e instanceof Node && n.contains(e) && rd(n, !$u(n)), id(n);
}
function Xu(e) {
	if (!(e instanceof KeyboardEvent && Hu.has(e.key))) {
		Uu = !1;
		for (let e of [...Ku]) rd(e, !1);
		id(document.activeElement);
	}
}
function Zu(e) {
	Uu && !$u(e) && rd(e, !0), e === document.activeElement && id(document.activeElement);
}
function Qu(e) {
	e.target instanceof Element && e.target.hasAttribute(Bu) || rd(e.target, !1), e.relatedTarget === null && queueMicrotask(() => id(document.activeElement));
}
function $u(e) {
	return Tc(e) ? !e.readOnly && !e.disabled : e instanceof HTMLElement && (e.isContentEditable || e.getAttribute("role") === "spinbutton" && e.getAttribute("aria-readonly") !== "true");
}
function ed() {
	return Uu && Gu instanceof HTMLElement && Gu !== document.body ? Gu : null;
}
function td() {
	return Uu;
}
function nd() {
	return Uu && Wu;
}
function rd(e, t) {
	if (e instanceof Element) {
		if (t) {
			for (let e of Ku) e.isConnected || Ku.delete(e);
			Ku.add(e);
		} else Ku.delete(e);
		e.hasAttribute("data-ui-pointer-focus") !== t && e.toggleAttribute(Or, t), e === document.activeElement && id(e);
	}
}
function id(e) {
	let t = e === null || e === document.body || $u(e) ? null : e.hasAttribute("data-ui-pointer-focus") ? "pointer" : "keyboard", n = e === null || t === null ? [] : ad(e);
	for (let e of qu) n.includes(e) || e.removeAttribute(kr);
	for (let e of n) t !== null && e.getAttribute("data-ui-focus-within") !== t && e.setAttribute(kr, t);
	qu = n;
}
function ad(e) {
	let t = [];
	for (let n = e.parentElement; n !== null && n !== document.body && !n.hasAttribute("data-ui-region") && (t.push(n), !(n.hasAttribute("data-ui-id") && !od(n))); n = n.parentElement);
	return t;
}
function od(e) {
	return e.classList.contains("ui-menu--nested") || (e.parentElement?.closest(jc) ?? null) !== null;
}
function R(e) {
	Zu(e), sd(e);
}
function sd(e) {
	id(e), e.focus({ preventScroll: !0 }), id(document.activeElement);
}
function cd(e) {
	rd(e, !0), sd(e);
}
function ld(e) {
	for (let t of e.querySelectorAll(Vu)) if ($o(t)) return t;
	return null;
}
var ud = {
	first: ld,
	stops: (e) => dd(e, document.activeElement),
	giveBack: (e) => yd(e),
	trapTab: md
};
function dd(e, t) {
	let n = [...e.querySelectorAll(Vu)].filter((e) => e === t || e.tabIndex >= 0 && $o(e)), r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let t = fd(e);
		if (t === null) continue;
		let n = r.get(t);
		(n === void 0 || !pd(n) && pd(e)) && r.set(t, e);
	}
	return n.filter((e) => {
		let t = fd(e);
		return t === null || r.get(t) === e;
	});
}
function fd(e) {
	return e instanceof HTMLInputElement && e.type === "radio" && e.name !== "" ? e.name : null;
}
function pd(e) {
	return e instanceof HTMLInputElement && e.checked;
}
function md(e, t) {
	let n = dd(e, document.activeElement);
	if (n.length === 0) {
		t.preventDefault();
		return;
	}
	let r = hd(e, n, document.activeElement, t.shiftKey);
	r !== null && (t.preventDefault(), r.focus());
}
function hd(e, t, n, r) {
	let i = t[0], a = t[t.length - 1];
	return n === null || !e.contains(n) ? r ? a : i : !r && gd(n, a) ? i : r && gd(n, i) ? a : null;
}
function gd(e, t) {
	return e === t || fd(e) !== null && fd(e) === fd(t);
}
var _d = `.${qr}, .${Jr}, [${Xr}]`;
function vd(e) {
	let t = Yl(e)?.root ?? null;
	for (let n = e.parentElement; n !== null; n = n.parentElement) if ((n === t || n.matches(_d)) && n.hasAttribute("tabindex") && $o(n)) return n;
	return null;
}
function yd(e, t = vd(e)) {
	let n = document.activeElement;
	if (t?.isConnected !== !0 || n !== null && n !== document.body) return;
	let r = Yl(e);
	r?.root === t && r.row !== null && iu(t, Ll(t), r.row, bu(r.row, e)), R(t);
}
function bd(e, t) {
	if (e.contains(document.activeElement)) return null;
	let n = document.activeElement instanceof HTMLElement ? document.activeElement : null, r = t ?? ld(e);
	return Uu ? Ju.add(e) : Ju.delete(e), (r === null || r === e) && !e.hasAttribute("tabindex") && (e.tabIndex = -1), R(r ?? e), n;
}
function xd(e, t) {
	e.scrollTop = 0, e.scrollLeft = 0;
	let n = t ?? ld(e);
	return n !== null && Sd(e, n), bd(e, n);
}
function Sd(e, t) {
	let n = e.getBoundingClientRect().top + e.clientTop, r = n + e.clientHeight, i = t.getBoundingClientRect();
	i.bottom > r && (e.scrollTop += Math.min(i.bottom - r, i.top - n));
}
function Cd(e, t, n = !1) {
	if (Uu) {
		N(t, null), e.hasAttribute("tabindex") || (e.tabIndex = -1), R(e);
		return;
	}
	let r = t.filter(P), i = (n ? r[r.length - 1] : r[0]) ?? null;
	i !== null && (N(t, i), R(i));
}
function wd(e, t = null) {
	let n = e == null ? null : e.isConnected ? e : Td(e, t);
	for (let e = n; e !== null; e = e.parentElement) if (e.matches(`${Vu}, [tabindex]`) && $o(e)) return e;
	return n === null ? null : Ed(n);
}
function Td(e, t) {
	if (t === null) return null;
	for (let n = e.closest(S); n !== null; n = n.parentElement?.closest(S) ?? null) {
		let e = t.findEveryComponent(E(n)).filter((e) => e.isConnected);
		if (e.length === 1 && e[0] instanceof HTMLElement) return e[0];
	}
	return null;
}
function Ed(e) {
	for (let t = e.closest(S); t !== null; t = t.parentElement?.closest(S) ?? null) if ($o(t)) return Dd(t), t;
	return null;
}
function Dd(e) {
	if (e.hasAttribute("tabindex") || e.tabIndex >= 0) return;
	e.tabIndex = -1;
	let t = (n) => {
		n.target === e && (e.removeAttribute("tabindex"), e.removeEventListener("focusout", t));
	};
	e.addEventListener("focusout", t);
}
function Od(e, t) {
	let n = document.activeElement;
	e == null || !t.contains(n) || (kd(n, t) && rd(e, !$u(e)), R(e));
}
function kd(e, t) {
	for (let n = e; n !== null; n = n === t ? null : n.parentElement ?? null) if (Ju.has(n)) return !0;
	return !1;
}
//#endregion
//#region src/updates/value-binding-engine.ts
var Ad = "data-ui-clear", jd = ["change", "toggle"], Md = [
	...jd,
	"expand",
	"collapse",
	"open",
	"close"
];
function Nd(e) {
	let t = xi(e);
	return t === "TwoWay" || t === "OneWayToSource" || t === "OnSubmit";
}
function Pd(e) {
	return xi(e) === "OnSubmit";
}
function Fd(e, t) {
	let n = e.getAttribute(qe);
	if (n !== null) {
		let e = t.getBindingById(Number(n));
		return {
			bindingId: n,
			binding: e,
			buffered: e !== void 0 && Pd(e.mode)
		};
	}
	for (let n of e.getAttributeNames()) {
		if (!n.startsWith("data-ui-bind-")) continue;
		let r = e.getAttribute(n) ?? "", i = t.getBindingById(Number(r));
		if (i !== void 0 && Nd(i.mode)) return {
			bindingId: r,
			binding: i,
			buffered: Pd(i.mode)
		};
	}
	return null;
}
var Id = class {
	options;
	root;
	pendingSyncByComponent = /* @__PURE__ */ new WeakMap();
	bufferedElements = /* @__PURE__ */ new Set();
	unanswered = /* @__PURE__ */ new Map();
	sends = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document;
		for (let e of jd) this.root.addEventListener(e, (e) => {
			this.handleValueEventAsync(e).catch((e) => {
				c("value binding engine failed.", e);
			});
		}, !0);
		this.root.addEventListener("input", (e) => this.holdEdited(e), !0), this.root.addEventListener(kc, (e) => this.releaseDropped(e)), this.root.addEventListener("click", (e) => this.handleClear(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && e.target.closest(`[${Ad}]`) !== null && e.preventDefault();
		}, !0);
	}
	holdEdited(e) {
		!(e.target instanceof Element) || this.bufferedElements.has(e.target) || !e.target.hasAttribute("data-ui-form-id") || Fd(e.target, this.options.metadata)?.buffered === !0 && this.bufferValue(e.target);
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
		let t = e.target.closest(`[${Ad}]`);
		if (t === null) return;
		let n = t.closest(S), r = n?.querySelector("[data-ui-bind-value]") ?? n?.querySelector("input, textarea, select");
		r == null || Ld(r) || (Ws(r), r.dispatchEvent(new Event("input", { bubbles: !0 })), r.dispatchEvent(new Event("change", { bubbles: !0 })), Tc(r) && document.activeElement !== r && R(r));
	}
	async handleValueEventAsync(e) {
		if (!(e.target instanceof Element) || e.type === "change" && (A(e.target) || O(e.target))) return;
		let t = Fd(e.target, this.options.metadata);
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
			let r = Fd(n, this.options.metadata);
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
		if (i === void 0 || !Nd(i.mode) || Pd(i.mode)) return;
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
function Ld(e) {
	return e.matches(":disabled") || (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.readOnly;
}
//#endregion
//#region src/events/event-boundary.ts
function Rd(e, t) {
	let n = e.closest(`[${Ye}]`);
	return n !== null && n !== t && t.contains(n);
}
//#endregion
//#region src/events/command-turns.ts
var zd = class {
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
}, Bd = class {
	catalog;
	registrations = /* @__PURE__ */ new Map();
	attachments = /* @__PURE__ */ new Map();
	constructor(e) {
		this.catalog = e;
	}
	add(e, t = {}) {
		let n = Bi(e);
		if (n.length === 0) throw Error("Event name is required.");
		let r = Bi(t.domEventName) || this.catalog.get(n)?.domEventName || n, i = {
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
		return this.registrations.get(Bi(e));
	}
	isAttached(e) {
		return this.attachments.has(Bi(e));
	}
	attach(e) {
		let t = {};
		return this.attachments.set(Bi(e), t), t;
	}
	isCurrent(e, t) {
		return this.attachments.get(e) === t;
	}
}, Vd = class {
	create(e, t) {
		return e.createRequest === void 0 ? t.metadata === void 0 ? null : {
			eventId: T(t.metadata.eventId),
			dynamicParameters: [...t.dynamicParameters]
		} : e.createRequest(t);
	}
}, Hd = {
	dispatched: !1,
	success: !1
}, Ud = class extends Error {
	reason;
	constructor(e) {
		super(String(e)), this.reason = e;
	}
}, Wd = class {
	options;
	root;
	registry;
	requestFactory = new Vd();
	turns = new zd();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.registry = new Bd(e.eventCatalog), this.addEvent("click");
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
		if (r === null || Kd(t, r.element) || Rd(t.target, r.element)) return;
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
			let t = e instanceof Ud, r = t ? e.reason : e;
			throw n.completed?.({
				...a,
				dispatched: t,
				success: !1,
				error: String(r)
			}), r;
		}
	}
	async runAsync(e, t, n, r) {
		if (r.domEvent.target instanceof Element && O(r.domEvent.target)) return Hd;
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
		if (this.options.dispatcher.isPending(i)) return r.domEvent.preventDefault(), Hd;
		let a = this.turns.take();
		try {
			return await this.sendInTurnAsync(e, t, n, r, i, a);
		} finally {
			a.done();
		}
	}
	async sendInTurnAsync(e, t, n, r, i, a) {
		let o = n.getAttribute("data-ui-submit-form-id") ?? (t.submitsForm === !0 ? qd(r) : null);
		if (o !== null) {
			if (this.options.validationEngine?.runSubmitValidation(o) === !1) return r.domEvent.preventDefault(), this.options.validationEngine.focusFirstInvalid(o), Hd;
			await this.options.valueBinding?.submitFormAsync(o);
		}
		if (await this.isRefusedValueEventAsync(t, n) || (await a.ahead, await this.options.valueBinding?.whenSent(), this.options.dispatcher.isPending(i))) return Hd;
		this.options.interactionEngine.applyEvent({
			name: `before-${e}`,
			componentId: r.componentId,
			dynamicParameters: r.dynamicParameters,
			domEvent: r.domEvent
		});
		let s = this.options.dispatcher.dispatchAsync(i);
		a.done();
		let c = await s.catch((t) => {
			throw this.applyAfterEvent(e, r), new Ud(t);
		});
		return this.options.effects.applyAll(c.command?.effects, this.options.dom), this.options.afterEffects?.(), this.applyAfterEvent(e, r), o !== null && this.options.validationEngine?.focusFirstInvalid(o), {
			dispatched: !0,
			success: c.command?.success !== !1,
			error: c.command?.error ?? null
		};
	}
	async isRefusedValueEventAsync(e, t) {
		return !Md.includes(e.name) && e.settlesValue !== !0 ? !1 : (await this.options.valueBinding?.whenSettled(t), this.options.validationEngine?.isRefused(t) === !0);
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
		Gd(e.preventDefault, t) && t.domEvent.preventDefault(), Gd(e.stopPropagation, t) && t.domEvent.stopPropagation();
	}
};
function Gd(e, t) {
	return e === void 0 ? !1 : typeof e == "function" ? e(t) : e;
}
function Kd(e, t) {
	if (e.type !== "mouseenter" && e.type !== "mouseleave") return !1;
	let n = e.relatedTarget;
	return n instanceof Node && t.contains(n);
}
function qd(e) {
	let t = e.domEvent.target;
	return ((t instanceof Element ? t.closest("[data-ui-form-id]") : null) ?? e.component.querySelector("[data-ui-form-id]"))?.getAttribute("data-ui-form-id") ?? null;
}
//#endregion
//#region src/state/value-equality.ts
function Jd(e, t) {
	return Object.is(e, t) ? !0 : e === null || t === null || e === void 0 || t === void 0 ? !1 : e instanceof Date || t instanceof Date ? e instanceof Date && t instanceof Date && e.getTime() === t.getTime() : typeof e != "object" || typeof t != "object" ? !1 : Array.isArray(e) || Array.isArray(t) ? Array.isArray(e) && Array.isArray(t) && Yd(e, t) : Xd(e, t);
}
function Yd(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!Jd(e[n], t[n])) return !1;
	return !0;
}
function Xd(e, t) {
	for (let n in e) if (Object.hasOwn(e, n) && (Object.hasOwn(t, n) ? !Jd(e[n], t[n]) : !Zd(e[n]))) return !1;
	for (let n in t) if (Object.hasOwn(t, n) && !Object.hasOwn(e, n) && !Zd(t[n])) return !1;
	return !0;
}
function Zd(e) {
	return e == null;
}
//#endregion
//#region src/interactions/focus-handoff.ts
function Qd() {
	let e = document.activeElement;
	return e === null || e === document.body ? null : e;
}
function $d(e) {
	let t = document.activeElement;
	if (!e.isConnected || t !== e && t !== document.body) return null;
	if (ef(e)) return tf(e, () => $d(e)), null;
	let n = e;
	for (; n.parentElement !== null && !ef(n.parentElement);) n = n.parentElement;
	let r = af(n) ?? of(n) ?? sf();
	return r !== null && R(r), r;
}
function ef(e) {
	return e.checkVisibility({ visibilityProperty: !0 });
}
function tf(e, t) {
	if (typeof document.getAnimations != "function") return;
	let n = document.getAnimations().filter((t) => nf(t) && rf(t)?.contains(e) === !0);
	n.length > 0 && Promise.all(n.map((e) => e.finished)).then(t, () => void 0);
}
function nf(e) {
	return e.transitionProperty === "visibility";
}
function rf(e) {
	return e.effect?.target ?? null;
}
function af(e) {
	let t = (e.closest(".ui-key-value-action__value-input, .ui-key-value-action__edit-action")?.closest(".ui-key-value-action__row") ?? null)?.querySelector(".ui-key-value-action__action")?.querySelector(Vu) ?? null;
	return t !== null && ef(t) ? t : null;
}
function of(e) {
	let t = dd(e.closest(_d) ?? document, null).filter((t) => !e.contains(t)), n = t.find((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0), r = t.filter((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_PRECEDING) !== 0);
	return n ?? r[r.length - 1] ?? null;
}
function sf() {
	let e = document.querySelector(`[${dn}="content"]`);
	return e === null ? null : (Dd(e), e);
}
//#endregion
//#region src/interactions/interaction-engine.ts
var cf = class {
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
		for (let e of jd) i.addEventListener(e, (e) => this.applyEditedValue(e), !0);
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
		let n = this.options.valueReaders.readBound(e.target), r = df(t.interactions[0].source, t.dynamicParameters);
		if (!(this.heard.has(r) && Jd(this.heard.get(r), n))) {
			this.heard.set(r, n);
			for (let e of t.interactions) this.applyInteraction(e, t.dynamicParameters, !0, n);
		}
	}
	resolveEdited(e) {
		let t = this.options.dom.resolveNearestComponent(e, () => !0);
		if (t === null) return null;
		let n = Fd(e, this.options.metadata), r;
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
			for (let e of t.interactions) Ci(e.actionKind) === "CopyValue" && ff(e.target) && this.writeTarget(e.target, t.dynamicParameters, lf(e, n), !0);
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
		let t = this.index.getPropertyInteractions(T(e.reference.componentId), e.reference.propertyId), n = t.length > 0 ? df(e.reference, e.dynamicParameters) : null;
		n !== null && this.heard.has(n) && this.heard.set(n, e.value);
		for (let n of t) this.applyInteraction(n, e.dynamicParameters, !1, e.value);
	}
	applyInteraction(e, t, n, r = !0) {
		let i = Ci(e.actionKind);
		if (i === "Effect") {
			this.applyEffectInteraction(e, t, r);
			return;
		}
		let a = e.target;
		if (!ff(a)) return;
		let o = i === "CopyValue" ? lf(e, r) : this.evaluator.evaluate(e, r);
		this.writeTarget(a, t, o, n), n && this.options.writeBack?.(a, t, o);
	}
	writeTarget(e, t, n, r) {
		let i = Qd();
		this.applyDepth++;
		try {
			this.propertyPatchEngine.applyPropertyValue(e, t, n, r);
		} finally {
			this.applyDepth--;
		}
		i !== null && $d(i);
	}
	applyEffectInteraction(e, t, n) {
		let r = e.effect;
		if (r == null) {
			s("effect interaction carries no effect.", e);
			return;
		}
		this.evaluator.matches(e, n) && this.options.effects.apply({
			effect: uf(r, t, this.options.dom),
			dom: this.options.dom,
			row: t
		});
	}
};
function lf(e, t) {
	return (t == null || typeof t == "string" && t.trim().length === 0) && e.falseValue !== void 0 ? e.falseValue : t;
}
function uf(e, t, n) {
	if (t.length === 0) return e;
	let r = e.target;
	if (r === void 0 || (r.dynamicParameters?.length ?? 0) > 0) return e;
	let i = T(r.id);
	for (let a = t.length; a >= 0; a--) {
		let o = t.slice(0, a), s = n.findComponent(i, o);
		if (s !== null && Ji(s, o)) return a === 0 ? e : {
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
function df(e, t) {
	return JSON.stringify([
		T(e?.componentId),
		e?.propertyId ?? "",
		...t.map((e) => String(e ?? ""))
	]);
}
function ff(e) {
	return e != null && e.propertyId.length > 0;
}
//#endregion
//#region src/interactions/interaction-evaluator.ts
var pf = class {
	evaluate(e, t) {
		return this.matches(e, t) ? e.trueValue : e.falseValue;
	}
	matches(e, t) {
		return mf(t, e.operator, e.value);
	}
};
function mf(e, t, n) {
	let r = hf(e), i = hf(n);
	switch (wi(t)) {
		case "Required": return r != null && r !== !1 && String(r).trim().length > 0;
		case "Equal": return String(r ?? "") === String(i ?? "");
		case "NotEqual": return String(r ?? "") !== String(i ?? "");
		case "Greater": return gf(r, i, (e) => e > 0);
		case "GreaterOrEqual": return gf(r, i, (e) => e >= 0);
		case "Less": return gf(r, i, (e) => e < 0);
		case "LessOrEqual": return gf(r, i, (e) => e <= 0);
		case "Like": return String(r ?? "").includes(String(i ?? ""));
		case "LikeIgnoreCase": return String(r ?? "").toLocaleLowerCase().includes(String(i ?? "").toLocaleLowerCase());
		case "In": return Array.isArray(i) && i.some((e) => String(e ?? "") === String(r ?? ""));
		case "Regex": return vf(r, i);
		case "RegexEach": return _f(r, i);
		default: return !1;
	}
}
function hf(e) {
	return so(e) ? e.key : co(e) ? e.text : e;
}
function gf(e, t, n) {
	let r = Number(e), i = Number(t);
	return !Number.isNaN(r) && !Number.isNaN(i) ? n(r < i ? -1 : +(r > i)) : !Number.isNaN(r) || !Number.isNaN(i) || typeof e != "string" || typeof t != "string" ? !1 : n(e < t ? -1 : +(e > t));
}
function _f(e, t) {
	return e == null ? !0 : Array.isArray(e) ? e.every((e) => vf(hf(e), t)) : vf(e, t);
}
function vf(e, t) {
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
var yf = "Value", bf = "EndValue", xf = "Pressed", Sf = class {
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
		return this.eventNames.has(Bi(e));
	}
	getSourceEventNames() {
		let e = /* @__PURE__ */ new Set();
		for (let t of this.eventNames) Tf(t) || e.add(t);
		return e;
	}
	hasEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(Bi(e))?.has(t) === !0;
	}
	getEventInteractions(e, t) {
		return this.eventInteractions.get(Ef(e, t)) ?? [];
	}
	getPropertyInteractions(e, t) {
		return this.propertyInteractions.get(Df(e, t)) ?? [];
	}
	getValueInteractions(e) {
		return this.valueInteractions.get(e) ?? [];
	}
	getEndValueInteractions(e) {
		return this.endValueInteractions.get(e) ?? [];
	}
	addInteraction(e) {
		if (Cf(e)) {
			let t = T(e.sourceEvent?.componentId), n = Bi(e.sourceEvent?.eventName);
			if (t > 0 && n.length > 0) {
				let r = this.eventInteractions.get(Ef(t, n));
				r === void 0 && (r = [], this.eventInteractions.set(Ef(t, n), r)), r.push(e), this.eventNames.add(n);
				let i = this.eventComponentIdsByName.get(n);
				i === void 0 && (i = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(n, i)), i.add(t);
			}
			return;
		}
		if (wf(e)) {
			let t = T(e.source?.componentId), n = e.source?.propertyId ?? "";
			if (t > 0 && n.length > 0) {
				let r = this.propertyInteractions.get(Df(t, n));
				r === void 0 && (r = [], this.propertyInteractions.set(Df(t, n), r)), r.push(e), Ci(e.actionKind) === "CopyValue" && (this.copiesValues = !0);
				let i = this.metadata.getPropertyDefinition(n)?.propertyName, a = i === yf || i === xf ? this.valueInteractions : i === bf ? this.endValueInteractions : null;
				if (a !== null) {
					let n = a.get(t) ?? [];
					n.push(e), a.set(t, n);
				}
			}
		}
	}
};
function Cf(e) {
	return Si(e.sourceKind) === "Event";
}
function wf(e) {
	return Si(e.sourceKind) === "Property";
}
function Tf(e) {
	return e.startsWith("before-") || e.startsWith("after-");
}
function Ef(e, t) {
	return `${e}:${Bi(t)}`;
}
function Df(e, t) {
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
function Of() {
	return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function kf(e) {
	if (typeof e.getAnimations == "function") for (let t of e.getAnimations()) typeof CSSTransition == "function" && t instanceof CSSTransition && t.finish();
}
function Af(e, t, n) {
	let r = !1, i = () => {
		r || (r = !0, clearTimeout(a), n());
	}, a = setTimeout(i, t), o = typeof e.getAnimations == "function" ? e.getAnimations().filter((e) => typeof CSSTransition != "function" || e instanceof CSSTransition) : [];
	Promise.allSettled(o.map((e) => e.finished)).then(i);
}
//#endregion
//#region src/rendering/responsive-tier.ts
var jf = [
	"base",
	"sm",
	"md",
	"xl",
	"xxl"
], Mf = {
	sm: 640,
	md: 768,
	xl: 1280,
	xxl: 1536
};
function Nf(e) {
	return `(min-width: ${Mf[e]}px)`;
}
var Pf = Nf("sm");
function Ff(e = (e) => matchMedia(e).matches) {
	for (let t of [
		"xxl",
		"xl",
		"md",
		"sm"
	]) if (e(Nf(t))) return t;
	return "base";
}
function If(e, t) {
	return t === "base" ? e : `${e}-${t}`;
}
function Lf(e, t) {
	if (e == null) return;
	let n = typeof e == "object" ? e : void 0;
	return n === void 0 || !("base" in n) ? t === "base" ? e : void 0 : n[t];
}
function Rf(e, t) {
	return zf(t, (t) => Lf(e, t));
}
function zf(e, t) {
	for (let n = jf.indexOf(e); n >= 0; n--) {
		let e = t(jf[n]);
		if (e != null) return e;
	}
}
//#endregion
//#region src/interactions/anchored-popup.ts
var Bf = /* @__PURE__ */ new Set([
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
function Vf(e) {
	return Bf.has(e);
}
var Hf = 4, Uf = 12, Wf = /* @__PURE__ */ new Map(), Gf = !1, Kf = null, qf = /* @__PURE__ */ new WeakMap(), Jf = "data-ui-popup-stood-in";
function Yf(e, t) {
	t === null ? qf.delete(e) : qf.set(e, t);
}
var Xf = "--ui-popup-ground";
function Zf(e, t) {
	let n = e.closest("[data-ui-theme]") === t.closest("[data-ui-theme]") ? getComputedStyle(e).getPropertyValue(Xf).trim() : "";
	n.length === 0 ? t.style.removeProperty(Xf) : t.style.setProperty(Xf, n);
}
function Qf(e, t, n) {
	Wf.set(t, {
		anchor: e,
		options: n
	}), dp(), Kf?.observe(t), ip(e, t), pp(e, t, n);
}
var $f = "data-ui-popup-lifted", ep = "data-ui-sheet";
function tp() {
	return typeof matchMedia == "function" && !matchMedia(Pf).matches;
}
function np(e) {
	return e.hasAttribute(ep);
}
function rp(e) {
	if (e.hasAttribute($f)) {
		e.matches(":popover-open") || e.showPopover();
		return;
	}
	e.setAttribute("popover", "manual"), e.setAttribute($f, ""), ap(e);
}
function ip(e, t) {
	(t.hasAttribute($f) || op(t) || e.closest(`[${$f}]`) !== null) && rp(t);
}
function ap(e) {
	let t = getComputedStyle(e), n = t.transitionProperty.split(",").map((e) => e.trim()), r = n.indexOf("overlay");
	if (r === -1) {
		e.showPopover();
		return;
	}
	let i = t.transitionDuration.split(",").map((e) => e.trim());
	e.style.setProperty("transition-duration", n.map((e, t) => t === r ? "0s" : i[t % i.length]).join(", ")), e.showPopover(), getComputedStyle(e).getPropertyValue("overlay"), e.style.removeProperty("transition-duration");
}
function op(e) {
	for (let t = e.parentElement; t !== null; t = t.parentElement) {
		let e = getComputedStyle(t);
		if (e.transform !== "none" || e.filter !== "none" || e.perspective !== "none" || t.hasAttribute("data-ui-surface-image-blur") && e.isolation === "isolate") return !0;
	}
	return !1;
}
var sp = z.normal * 5;
function cp(e, t) {
	e.hasAttribute($f) && (e.matches(":popover-open") && e.hidePopover(), Af(e, sp, () => {
		e.matches(":popover-open") || Wf.has(e) || (e.removeAttribute("popover"), e.removeAttribute($f), t?.());
	}));
}
function lp(e) {
	let t = Wf.get(e);
	t !== void 0 && pp(t.anchor, e, t.options);
}
function up(e) {
	e != null && (Wf.delete(e), Kf?.unobserve(e), cp(e));
}
function dp() {
	Gf || (Gf = !0, document.addEventListener("scroll", fp, !0), window.addEventListener("resize", fp), window.visualViewport?.addEventListener("resize", fp), window.visualViewport?.addEventListener("scroll", fp), Kf = new ResizeObserver((e) => {
		for (let t of e) {
			if (!(t.target instanceof HTMLElement)) continue;
			let e = Wf.get(t.target);
			e !== void 0 && pp(e.anchor, t.target, e.options, !0);
		}
	}));
}
function fp() {
	for (let [e, t] of Wf) {
		if (!e.isConnected) {
			up(e);
			continue;
		}
		pp(t.anchor, e, t.options);
	}
}
function pp(e, t, n, r = !1) {
	if (!e.isConnected) return;
	let i = _p(e), a = i !== e;
	t.hasAttribute(Jf) !== a && t.toggleAttribute(Jf, a), n.minAnchorWidth === !0 && (t.style.minWidth = `${i.getBoundingClientRect().width}px`), gp(t);
	let o = i.getBoundingClientRect(), s = (i === e ? n.crossAnchor ?? i : i).getBoundingClientRect(), c = i === e && n.surface !== void 0 ? n.surface.getBoundingClientRect() : o, l = n.gap ?? 4, u = t.getBoundingClientRect(), d = bp(n.boundary), f = Wf.get(t), p = r ? f?.side : void 0, m = p !== void 0 && Sp(c, u, p, l, d) ? p : xp(c, u, n.placement, l, d);
	f !== void 0 && (f.side = m), Sp(c, u, m, l, d) || (hp(t, m, Ep(c, m, d) - l - Hf), u = t.getBoundingClientRect());
	let h = n.alignEntries === !0 ? Ap(t, m) : kp, g = Mp(c, s, u, m, l, h), ee = Np(c, s, u, m, l, h);
	n.arrow === !0 && (Tp(m) ? ee = vp(ee, s.left + s.width / 2, u.width) : g = vp(g, s.top + s.height / 2, u.height));
	let _ = Fp();
	g = _.top + zp(g - _.top, u.height, _.bottom - _.top), ee = zp(ee, u.width, window.innerWidth), t.style.top = `${g}px`, t.style.left = `${ee}px`, t.dataset.uiPlacement !== m && (t.dataset.uiPlacement = m), yp(t, s, u, m, g, ee);
}
var mp = "data-ui-popup-capped";
function hp(e, t, n) {
	let r = Tp(t);
	e.setAttribute(mp, ""), e.style.setProperty(r ? "max-height" : "max-width", `${Math.max(0, n)}px`), e.style.setProperty(r ? "overflow-y" : "overflow-x", "auto");
}
function gp(e) {
	if (e.hasAttribute(mp)) {
		e.removeAttribute(mp);
		for (let t of [
			"max-height",
			"max-width",
			"overflow-y",
			"overflow-x"
		]) e.style.removeProperty(t);
	}
}
function _p(e) {
	for (let t = e; t !== null; t = t.parentElement) {
		if (t.hasAttribute(Jf)) return e;
		let n = qf.get(t);
		if (n !== void 0) return n;
	}
	return e;
}
function vp(e, t, n) {
	let r = t - e;
	return r < Uf ? e - (Uf - r) : r > n - Uf ? e + (r - (n - Uf)) : e;
}
function yp(e, t, n, r, i, a) {
	let o = Tp(r), s = o ? t.left + t.width / 2 - a : t.top + t.height / 2 - i, c = o ? n.width : n.height;
	e.style.setProperty("--ui-popup-arrow", `${Math.max(Uf, Math.min(s, c - Uf))}px`);
}
function bp(e) {
	let t = Fp(), n = {
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
function xp(e, t, n, r, i) {
	let a = Dp(n);
	if (Sp(e, t, n, r, i)) return n;
	if (Sp(e, t, a, r, i)) return a;
	for (let a of Cp(n)) if (Sp(e, t, a, r, i)) return a;
	return Ep(e, a, i) > Ep(e, n, i) ? a : n;
}
function Sp(e, t, n, r, i) {
	return Ep(e, n, i) >= wp(t, n) + r;
}
function Cp(e) {
	return e.startsWith("bottom") ? ["right-start", "left-start"] : e.startsWith("top") ? ["right-end", "left-end"] : e.startsWith("right") ? ["bottom-start", "top-start"] : ["bottom-end", "top-end"];
}
function wp(e, t) {
	return Tp(t) ? e.height : e.width;
}
function Tp(e) {
	return e.startsWith("top") || e.startsWith("bottom");
}
function Ep(e, t, n) {
	return t.startsWith("top") ? e.top - n.top : t.startsWith("bottom") ? n.bottom - e.bottom : t.startsWith("left") ? e.left - n.left : n.right - e.right;
}
function Dp(e) {
	return e.startsWith("top") ? `bottom${Op(e)}` : e.startsWith("bottom") ? `top${Op(e)}` : e.startsWith("left") ? `right${Op(e)}` : `left${Op(e)}`;
}
function Op(e) {
	let t = e.indexOf("-");
	return t === -1 ? "" : e.slice(t);
}
var kp = {
	start: 0,
	end: 0
};
function Ap(e, t) {
	let n = getComputedStyle(e);
	return Tp(t) ? {
		start: jp(n.paddingLeft) + jp(n.borderLeftWidth),
		end: jp(n.paddingRight) + jp(n.borderRightWidth)
	} : {
		start: jp(n.paddingTop) + jp(n.borderTopWidth),
		end: jp(n.paddingBottom) + jp(n.borderBottomWidth)
	};
}
function jp(e) {
	let t = Number.parseFloat(e ?? "");
	return Number.isFinite(t) ? t : 0;
}
function Mp(e, t, n, r, i, a) {
	return r.startsWith("top") ? e.top - i - n.height : r.startsWith("bottom") ? e.bottom + i : Pp(t.top, t.height, n.height, r, a);
}
function Np(e, t, n, r, i, a) {
	return r.startsWith("left") ? e.left - i - n.width : r.startsWith("right") ? e.right + i : Pp(t.left, t.width, n.width, r, a);
}
function Pp(e, t, n, r, i) {
	let a = Op(r);
	return a === "-start" ? e - i.start : a === "-end" ? e + t - n + i.end : e + (t - n) / 2;
}
function Fp() {
	let e = window.visualViewport, t = e == null || Math.abs(e.scale - 1) > .01, n = t ? 0 : Math.max(0, e.offsetTop), r = t ? window.innerHeight : Math.min(window.innerHeight, e.offsetTop + e.height);
	return {
		top: n,
		bottom: Math.min(r, Ip(r))
	};
}
function Ip(e) {
	let t = document.querySelector(`[${cn}]`);
	if (t === null) return e;
	let n = t.getBoundingClientRect();
	return n.height > 0 && n.width >= window.innerWidth - 1 && n.top > 0 ? n.top : e;
}
function Lp(e, t, n) {
	if (np(e)) return;
	let r = e.getBoundingClientRect(), i = Fp();
	e.style.left = `${Rp(t, r.width, 0, window.innerWidth)}px`, e.style.top = `${Rp(n, r.height, i.top, i.bottom)}px`;
}
function Rp(e, t, n, r) {
	return e + t <= r - Hf ? e : e - t >= n + Hf ? e - t : n + zp(e - n, t, r - n);
}
function zp(e, t, n) {
	return Math.max(Hf, Math.min(e, n - t - Hf));
}
//#endregion
//#region src/interactions/dom-mutations.ts
var Bp = 32;
function B(e, t, n, r) {
	if (!(e instanceof Node)) return null;
	let i = new MutationObserver((i) => {
		let a = Vp(e, n.relevant === void 0 ? i : i.filter(n.relevant), t);
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
function Vp(e, t, n) {
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
		if (r.size > Bp) return new Set(e.querySelectorAll(n));
	}
	return r.size === 0 ? null : r;
}
function Hp(e, t, n) {
	return (e.target instanceof Element ? e.target : e.target.parentElement)?.closest(`${t}, ${n}`)?.matches(t) === !0;
}
//#endregion
//#region src/interactions/open-dialogs.ts
var Up = "data-ui-dialog", Wp = "data-ui-dialog-modal", Gp = "data-ui-dialog-backdrop", Kp = "data-ui-dialog-close-backdrop", qp = "data-ui-dialog-close-escape", Jp = `[${Up}]:not([hidden]), dialog[open]`, Yp = "dialog:modal";
function Xp(e) {
	let t = e.querySelectorAll(`[${Up}]:not([hidden])`);
	return t.length === 0 ? null : t[t.length - 1];
}
function Zp(e) {
	let t = e.querySelectorAll(Yp);
	if (t.length > 0) return t[t.length - 1];
	let n = Xp(e);
	return n !== null && n.hasAttribute("data-ui-dialog-modal") ? n : null;
}
function Qp(e) {
	let t = typeof document > "u" ? null : Zp(document);
	return t !== null && !t.contains(e);
}
//#endregion
//#region src/interactions/popup-dismissal.ts
var $p = /* @__PURE__ */ new Set(), em = /* @__PURE__ */ new Map(), tm = 0, nm = !1;
function rm() {
	nm || (nm = !0, document.addEventListener("keydown", (e) => {
		!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || j(e) || om(_c(e.target)) && e.preventDefault();
	}, !0));
}
function im() {
	for (let e of $p) for (let t of e.openPopups()) if (t.isConnected && !e.isBehind(t)) return !0;
	return !1;
}
function am(e) {
	for (let t of $p) t.hearRefusedClick(e);
}
function om(e) {
	let t = [];
	for (let e of $p) for (let n of e.openPopups()) n.isConnected && t.push({
		instance: e,
		popup: n
	});
	let n = new Set(t.map((e) => e.popup));
	for (let e of [...em.keys()]) n.has(e) || em.delete(e);
	for (let { popup: e } of t) em.has(e) || em.set(e, ++tm);
	let r = sm(t, (e) => em.get(e.popup) ?? 0, (e, t) => e.popup.contains(t.popup));
	for (let { instance: t, popup: n } of r) if ((e === null || e.contains(n)) && t.dismiss(n, "escape")) return !0;
	return !1;
}
function sm(e, t, n) {
	let r = [...e].sort((e, n) => t(n) - t(e)), i = [];
	for (; r.length > 0;) {
		let e = r.findIndex((e) => !r.some((t) => t !== e && n(e, t)));
		i.push(...r.splice(e, 1));
	}
	return i;
}
var cm = class {
	options;
	pressedInside = /* @__PURE__ */ new Set();
	constructor(e) {
		this.options = e, document.addEventListener("pointerdown", (e) => this.handlePress(e), !0), document.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), e.onPress !== !0 && document.addEventListener("click", (e) => this.handleClick(e), !0), e.onWindowBlur === !0 && window.addEventListener("blur", () => this.dismissAll("blur")), $p.add(this), rm();
	}
	openPopups() {
		return [...this.options.openPopups()];
	}
	handlePress(e) {
		let t = e.composedPath(), n = this.options.onPress === !0 || e instanceof MouseEvent && e.button !== 0;
		this.pressedInside.clear();
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) ? this.pressedInside.add(e) : n && this.dismiss(e, "outside");
	}
	handleContextMenu(e) {
		let t = e.composedPath();
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) || this.dismiss(e, "outside");
	}
	hearRefusedClick(e) {
		this.options.onPress !== !0 && this.handleClick(e);
	}
	handleClick(e) {
		let t = e.composedPath();
		for (let e of [...this.options.openPopups()]) this.isInside(e, t) || this.pressedInside.has(e) || this.dismiss(e, "outside");
		this.pressedInside.clear();
	}
	dismissAll(e) {
		let t = !1;
		for (let n of [...this.options.openPopups()]) t = this.dismiss(n, e) || t;
		return t;
	}
	isBehind(e) {
		return this.options.isBehind === void 0 ? Qp(e) : this.options.isBehind(e);
	}
	dismiss(e, t) {
		return this.isBehind(e) || this.options.canDismiss?.(e, t) === !1 ? !1 : (this.options.close(e, t), !0);
	}
	isInside(e, t) {
		return this.options.isInside === void 0 ? t.includes(e) : this.options.isInside(e, t);
	}
}, lm = /\p{M}/gu, um = ".ui-text__title";
function dm(e, t) {
	return fm(e, t).split(/\s+/).filter((e) => e.length !== 0);
}
function fm(e, t) {
	return hm(e, mm(t));
}
function pm(e, t) {
	return t.every((t) => e.includes(t));
}
function mm(e) {
	return e.closest("[lang]")?.getAttribute("lang") || void 0;
}
function hm(e, t) {
	let n = e.normalize("NFD").replace(lm, "");
	try {
		return n.toLocaleLowerCase(t);
	} catch {
		return n.toLowerCase();
	}
}
function gm(e) {
	return e.querySelector(um)?.textContent ?? e.textContent ?? "";
}
//#endregion
//#region src/interactions/pointer-drag.ts
var _m = class {
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
		t.setAttribute(Cr, ""), t.tabIndex >= 0 && t.focus({ preventScroll: !0 });
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
			e.pointerId === t.pointerId ? t.point = n : t.second.point = n, this.options.pinch?.(t.context, vm(r, i, t.point, t.second.point));
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
		this.drag = null, n.removeAttribute(Cr), e.type === "pointercancel" && this.options.takenBack !== void 0 ? this.options.takenBack(n, r) : this.options.end(n, r);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || j(e) || this.drag === null) return;
		e.preventDefault();
		let { handle: t, context: n, pointerId: r, originPoint: i, second: a } = this.drag;
		this.drag = null, t.removeAttribute(Cr);
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
function vm(e, t, n, r) {
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
function ym() {
	let e = (e) => {
		e.preventDefault(), e.stopImmediatePropagation(), t();
	}, t = () => {
		window.removeEventListener("click", e, !0), window.removeEventListener("pointerdown", t, !0), window.removeEventListener("keydown", t, !0);
	};
	window.addEventListener("click", e, !0), window.addEventListener("pointerdown", t, !0), window.addEventListener("keydown", t, !0);
}
//#endregion
//#region src/interactions/sheet-swipe.ts
var bm = "data-ui-sheet-dragging", xm = "--ui-sheet-drag", Sm = 6, Cm = 24, wm = 1 / 3, Tm = .5;
function Em(e, t, n) {
	return e > t * wm || n > Tm && e > Sm;
}
function Dm(e, t, n) {
	let r = null;
	e.style.removeProperty(xm), e.removeAttribute(bm);
	let i = (n) => {
		if (r = null, !n.isPrimary || n.button !== 0 || t.scrollTop > 0 || n.pointerType !== "touch" && n.clientY - e.getBoundingClientRect().top > Cm) return;
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
			if (i > Sm && i > Math.abs(n) || n < -6) {
				r = null;
				return;
			}
			if (n <= Sm) return;
			r.moving = !0, e.setAttribute(bm, ""), Om(e, t.pointerId);
		}
		r.previous = r.last, r.last = {
			y: t.clientY,
			time: t.timeStamp
		}, e.style.setProperty(xm, `${Math.max(0, n)}px`);
	}, o = (t) => {
		if (r === null || t.pointerId !== r.pointerId) return;
		let i = r;
		if (r = null, !i.moving) return;
		ym(), e.removeAttribute(bm);
		let a = Math.max(0, t.clientY - i.startY), o = i.last.time - i.previous.time, s = o > 0 ? (i.last.y - i.previous.y) / o : 0;
		t.type === "pointerup" && Em(a, e.getBoundingClientRect().height, s) ? n() : e.style.setProperty(xm, "0px");
	}, s = (e) => {
		let t = e.touches[0];
		r !== null && e.cancelable && t !== void 0 && (r.moving || t.clientY > r.startY) && e.preventDefault();
	};
	return e.addEventListener("pointerdown", i), e.addEventListener("pointermove", a), e.addEventListener("pointerup", o), e.addEventListener("pointercancel", o), e.addEventListener("touchmove", s, { passive: !1 }), () => {
		r = null, e.removeAttribute(bm), e.removeEventListener("pointerdown", i), e.removeEventListener("pointermove", a), e.removeEventListener("pointerup", o), e.removeEventListener("pointercancel", o), e.removeEventListener("touchmove", s);
	};
}
function Om(e, t) {
	try {
		e.setPointerCapture(t);
	} catch {}
}
//#endregion
//#region src/interactions/popup-sheet.ts
var km = "data-ui-sheet-covered", Am = "ui-sheet-scrim", jm = "data-ui-sheet-scrim-leaving", Mm = 400, Nm = "ui-sheet__back", Pm = "ui.sheet.back", Fm = [], Im = null, Lm = !1, Rm = !1;
function zm(e, t) {
	if (Bm(e) !== null) return;
	let n = t.anchor?.closest("[data-ui-sheet]") ?? null, r = n === null ? null : Bm(n);
	e.style.removeProperty("top"), e.style.removeProperty("left"), e.style.removeProperty("min-width");
	let i = np(e);
	e.setAttribute(ep, r === null ? "root" : "nested"), i || (e.setAttribute("popover", "manual"), kf(e));
	let a = null;
	e.querySelector(`:scope > .${Nm}`)?.remove(), r !== null && (e.style.minHeight = `${r.popup.getBoundingClientRect().height}px`, r.popup.setAttribute(km, ""), a = Vm(t), e.prepend(a)), Hm(), rp(e);
	let o = {
		popup: e,
		parent: r,
		opening: t,
		back: a,
		hidden: [],
		detachSwipe: Dm(e, e, () => Um(e))
	};
	Fm.push(o), Wm(), queueMicrotask(() => Km(o));
}
function Bm(e) {
	return Fm.find((t) => t.popup === e) ?? null;
}
function Vm(e) {
	let t = document.createElement("button"), n = e.anchor === void 0 ? "" : gm(e.anchor).trim();
	return t.type = "button", t.className = Nm, t.tabIndex = -1, t.textContent = n, D.write(t, "aria-label", Pm, { entry: n }), t.addEventListener("click", (t) => {
		t.stopPropagation(), e.close();
	}), t;
}
function Hm() {
	Im === null && (Im = document.createElement("div"), Im.className = Am, Im.setAttribute("aria-hidden", "true"), Im.addEventListener("mousedown", (e) => e.preventDefault())), Im.parentElement === null && document.body.appendChild(Im), Im.removeAttribute(jm), rp(Im);
}
function Um(e) {
	for (let t = Bm(e); t !== null; t = t.parent) t.opening.close();
}
function Wm() {
	Lm || (Lm = !0, window.addEventListener("pointerdown", () => {
		Rm = !0;
	}, !0), window.addEventListener("pointerup", Gm, !0), window.addEventListener("pointercancel", Gm, !0), window.addEventListener("keydown", (e) => {
		let t = Fm.at(-1);
		e.key === "Tab" && !e.defaultPrevented && t !== void 0 && t.opening.trapsTab && e.target instanceof Node && t.popup.contains(e.target) && md(t.popup, e);
	}, !0), matchMedia(Pf).addEventListener("change", () => {
		for (let e of Fm.filter((e) => e.parent === null)) e.opening.close();
	}));
}
function Gm() {
	if (Rm = !1, Im?.hasAttribute(jm) !== !0) return;
	let e = () => {
		Im?.hasAttribute(jm) === !0 && Fm.length === 0 && (Im.removeAttribute(jm), Im.hidePopover());
	};
	window.addEventListener("click", () => window.setTimeout(e), { once: !0 }), window.setTimeout(e, Mm);
}
function Km(e) {
	if (!Fm.includes(e)) return;
	let { popup: t } = e;
	t.contains(document.activeElement) || (t.hasAttribute("tabindex") || (t.tabIndex = -1), R(t)), e.hidden = qm(t);
}
function qm(e) {
	let t = [];
	for (let n = e; n.parentElement !== null && n !== document.body; n = n.parentElement) for (let e of n.parentElement.children) e === n || e === Im || !(e instanceof HTMLElement) || e.getAttribute("aria-hidden") === "true" || (e.setAttribute("aria-hidden", "true"), t.push(e));
	return t;
}
function Jm(e) {
	let t = Bm(e);
	if (t !== null) {
		for (let e of [...Fm].reverse()) if (e === t || Ym(e, t)) {
			for (let t of e.hidden) t.removeAttribute("aria-hidden");
			e.hidden = [];
		}
	}
}
function Ym(e, t) {
	for (let n = e.parent; n !== null; n = n.parent) if (n === t) return !0;
	return !1;
}
function Xm(e) {
	let t = Bm(e);
	if (t !== null) {
		for (let e of Fm.filter((e) => e.parent === t)) e.opening.close(), Xm(e.popup);
		Jm(e), Fm.splice(Fm.indexOf(t), 1), t.detachSwipe(), t.parent?.popup.removeAttribute(km), Fm.length === 0 && Zm(), cp(e, () => {
			Bm(e) === null && (e.removeAttribute(ep), e.removeAttribute(km), e.style.removeProperty("min-height"), e.style.removeProperty("--ui-sheet-drag"), t.back?.remove());
		});
	}
}
function Zm() {
	Im?.matches(":popover-open") === !0 && (Rm ? Im.setAttribute(jm, "") : Im.hidePopover());
}
//#endregion
//#region src/interactions/owned-popup.ts
function Qm(e, t) {
	return e.isConnected && !O(e) && !(t && A(e));
}
var $m = class {
	options;
	entries = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, new cm({
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
			isBehind: (e) => Qp(this.entryOf(e)?.opening.owner ?? e),
			onPress: e.onPress,
			onWindowBlur: e.onWindowBlur
		}), (e.closesOnFocusLeave ?? !0) && document.addEventListener("focusout", (e) => this.handleFocusLeave(e), !0), e.closesOnTab !== void 0 && e.closesOnTab !== !1 && th(this);
	}
	listsAround(e) {
		return [...this.entries.values()].filter(({ opening: t }) => t.popup.contains(e) && sh(this.options.closesOnTab, t)).map(({ opening: e }) => ({
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
		if (!(e.target instanceof Node) || td() || t instanceof Element && t.hasAttribute("data-ui-pointer-focus")) return;
		if (t instanceof Element) {
			this.leaveFocus(e.target, t);
			return;
		}
		let n = e.target;
		rh(n) && queueMicrotask(() => this.letGo(n));
	}
	leaveFocus(e, t) {
		for (let { opening: n } of [...this.entries.values()]) (n.popup.contains(e) || n.owner.contains(e)) && !this.isInside(n, oh(t)) && !Qp(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
	}
	letGo(e) {
		if (!rh(e)) return;
		let t = vd(e);
		for (let { opening: n } of [...this.entries.values()]) {
			let r = n.popup.contains(e) || n.owner.contains(e), i = t !== null && n.popup.contains(t) || n.popup.contains(document.activeElement);
			r && !i && Qm(n.owner, this.closesWhenReadOnly) && !Qp(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
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
		if (this.close(e.owner), !Qm(e.owner, this.closesWhenReadOnly)) return !1;
		(this.options.single ?? !0) && this.closeAll();
		let t = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		return this.entries.set(e.owner, {
			opening: e,
			returnFocus: t
		}), this.options.show(e), this.place(e), ch(e, !0), vh(this), ph(e), e.focus !== void 0 && e.focus !== !1 && bd(e.popup, e.focus === !0 ? null : e.focus), !0;
	}
	get closesWhenReadOnly() {
		return this.options.closesWhenReadOnly ?? !0;
	}
	closeAll() {
		for (let e of [...this.entries.keys()]) this.close(e);
	}
	place(e) {
		if (np(e.popup) || sh(this.options.sheetOnPhone, e) && tp()) {
			zm(e.popup, {
				anchor: e.anchor,
				close: () => this.close(e.owner, "escape"),
				trapsTab: !sh(this.options.closesOnTab, e)
			});
			return;
		}
		e.anchor !== void 0 && e.placement !== void 0 && Qf(e.anchor, e.popup, e.placement);
	}
	reposition(e) {
		let t = this.entries.get(e);
		t !== void 0 && this.place(t.opening);
	}
	close(e = this.current, t) {
		let n = e === null ? void 0 : this.entries.get(e);
		if (e === null || n === void 0) return;
		let { opening: r } = n;
		this.entries.delete(e), mh(r.popup), Jm(r.popup), r.popup.contains(document.activeElement) && Od(r.returnFocus === void 0 ? n.returnFocus : r.returnFocus(), r.popup), this.options.hide(r, t), ch(r, !1), np(r.popup) ? Xm(r.popup) : up(r.popup), this.entries.size === 0 && yh(this);
	}
	closeStranded() {
		for (let [e, { opening: t }] of [...this.entries]) {
			if (Qm(e, this.closesWhenReadOnly)) continue;
			let n = document.activeElement, r = n === null || n === document.body || t.popup.contains(n) || e.contains(n);
			this.close(e, "owner"), r && e.isConnected && !ih() && ah(e);
		}
	}
}, eh = /* @__PURE__ */ new Set();
function th(e) {
	eh.size === 0 && window.addEventListener("keydown", (e) => {
		e instanceof KeyboardEvent && e.key === "Tab" && !e.defaultPrevented && !j(e) && e.target instanceof Node && nh(e.target);
	}, !0), eh.add(e);
}
function nh(e) {
	let t = [...eh].flatMap((t) => t.listsAround(e).map((e) => ({
		popups: t,
		...e
	})));
	for (let { popups: e, owner: n } of sm(t, () => 0, (e, t) => e.popup.contains(t.popup))) e.close(n, "focus");
}
function rh(e) {
	return e instanceof Element && e.isConnected && $o(e) && typeof document.hasFocus == "function" && document.hasFocus();
}
function ih() {
	let e = document.activeElement;
	return e instanceof Element && e !== document.body && $o(e);
}
function ah(e) {
	Dd(e), R(e);
}
function oh(e) {
	let t = [];
	for (let n = e; n !== null; n = n.parentNode) t.push(n);
	return t;
}
function sh(e, t) {
	return e === !0 || typeof e == "function" && e(t);
}
function ch(e, t) {
	for (let n of e.openers ?? []) n.setAttribute("aria-expanded", t ? "true" : "false");
}
var lh = /* @__PURE__ */ new Map(), uh = /* @__PURE__ */ new Set(), dh = /* @__PURE__ */ new WeakSet(), fh = [];
function ph(e) {
	let { popup: t } = e;
	lh.set(t, e.owner), !dh.has(t) && (dh.add(t), t.addEventListener("pointerenter", () => {
		lh.has(t) && (uh.add(t), hh());
	}), t.addEventListener("pointerleave", () => {
		uh.delete(t) && hh();
	}));
}
function mh(e) {
	lh.delete(e), uh.delete(e) && hh();
}
function hh() {
	let e = /* @__PURE__ */ new Set();
	for (let t of uh) {
		let n = lh.get(t);
		if (!(n === void 0 || !n.contains(t))) for (let r = t.parentElement; r !== null && (e.add(r), r !== n); r = r.parentElement);
	}
	for (let t of fh) e.has(t) || t.removeAttribute(Ar);
	for (let t of e) t.hasAttribute("data-ui-popup-hover") || t.setAttribute(Ar, "");
	fh = [...e];
}
var gh = /* @__PURE__ */ new Set(), _h = null;
function vh(e) {
	gh.add(e), _h === null && typeof MutationObserver == "function" && (_h = new MutationObserver(() => {
		for (let e of [...gh]) e.closeStranded();
	}), _h.observe(document, {
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
function yh(e) {
	gh.delete(e), !(gh.size > 0 || _h === null) && (_h.disconnect(), _h = null);
}
//#endregion
//#region src/interactions/flyout-interaction-engine.ts
var bh = "ui-flyout", xh = "ui-flyout--open", Sh = "ui-flyout__anchor", Ch = "data-ui-flyout-no-backdrop-close", wh = "data-ui-flyout-no-escape-close", Th = `${bh}--`, Eh = "bottom-start", Dh = class {
	root;
	flyouts = new $m({
		show: ({ owner: e }) => e.classList.add(xh),
		hide: ({ owner: e }, t) => this.markClosed(e, t !== "owner"),
		single: !1,
		closesWhenReadOnly: !1,
		canDismiss: ({ owner: e }, t) => !e.hasAttribute(t === "escape" ? wh : Ch)
	});
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${bh}`)) this.place(e);
		B(this.root, `.${bh}`, { attributeFilter: ["class"] }, (e) => {
			for (let t of e) this.place(t);
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	place(e) {
		let t = e.querySelector(`:scope > .${Jr}`), n = e.querySelector(`:scope > .${Sh}`);
		if (t === null) return;
		let r = Oh(n, t);
		if (!e.classList.contains(xh)) {
			this.flyouts.close(e), r?.setAttribute("aria-expanded", "false");
			return;
		}
		this.flyouts.open({
			owner: e,
			popup: t,
			anchor: Ah(n) ?? e,
			placement: { placement: jh(e) },
			openers: r === null ? [] : [r],
			focus: !td() || t
		}) || this.markClosed(e);
	}
	markClosed(e, t = !0) {
		e.classList.contains(xh) && (e.classList.remove(xh), kh(e, !1, t));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Sh}`)?.closest(`.${bh}`) ?? null;
		if (t !== null) {
			if (this.flyouts.isOpen(t)) {
				this.flyouts.close(t);
				return;
			}
			t.classList.add(xh), this.place(t), this.flyouts.isOpen(t) && kh(t, !0);
		}
	}
};
function Oh(e, t) {
	if (e === null) return null;
	let n = e.querySelector(Vu) ?? e;
	return n.setAttribute("aria-haspopup", "dialog"), n.setAttribute("aria-controls", gi(t, "ui-flyout-content")), n;
}
function kh(e, t, n = !0) {
	e.dispatchEvent(new Event("toggle", { bubbles: !0 })), n && e.dispatchEvent(new Event(t ? "open" : "close", { bubbles: !0 }));
}
function Ah(e) {
	if (e === null) return null;
	let t = e.firstElementChild;
	return t instanceof HTMLElement ? t : e;
}
function jh(e) {
	for (let t of e.classList) {
		if (!t.startsWith(Th)) continue;
		let e = t.slice(Th.length);
		if (Vf(e)) return e;
	}
	return Eh;
}
//#endregion
//#region src/interactions/drag-marks.ts
var Mh = `:scope > :is(${jc}, .ui-image-input__surface)`;
function Nh(e, t, n, r, i, a = [], o = "move") {
	Ph(t, r), n.classList.add(r);
	for (let e of a) e.classList.add(r);
	Fh(e, i, o);
}
function Ph(e, t) {
	for (let n of e.querySelectorAll(`.${t}`)) n.classList.remove(t);
}
function Fh(e, t, n) {
	!(e instanceof DragEvent) || e.dataTransfer === null || (e.dataTransfer.effectAllowed = n, e.dataTransfer.setData("text/plain", t));
}
function Ih(e, t) {
	return !(e.relatedTarget instanceof Node && t.contains(e.relatedTarget));
}
function Lh(e, t) {
	let n = t && e.querySelector(Mh) !== null;
	e.hasAttribute("data-ui-drop-boxed") !== n && e.toggleAttribute(ge, n);
}
//#endregion
//#region src/interactions/file-drop.ts
var Rh = "data-ui-file-drop-over", zh = 120, Bh = "refused", Vh = !1;
function Hh(e) {
	let t = {
		marked: /* @__PURE__ */ new Map(),
		leaving: 0
	};
	Kh();
	for (let n of [
		"dragenter",
		"dragover",
		"dragleave",
		"drop"
	]) e.root.addEventListener(n, (n) => Uh(e, t, n), !0);
	e.root.addEventListener("dragend", () => Qh(t.marked), !0), window.addEventListener("blur", () => Qh(t.marked)), e.root.addEventListener("paste", (t) => Wh(e, t), !0);
}
function Uh(e, t, n) {
	if (!(n instanceof DragEvent) || !(n.target instanceof Element)) return;
	let r = t.marked;
	n.type !== "dragleave" && t.leaving !== 0 && (window.clearTimeout(t.leaving), t.leaving = 0);
	let i = e.resolveTarget(n.target);
	if (i === null || !(n.dataTransfer?.types.includes("Files") ?? !1)) {
		i === null && n.type === "dragover" && Qh(r);
		return;
	}
	let a = i.mark ?? i.host;
	if (i.refused === !0) {
		qh(n), n.type !== "dragleave" && Qh(r);
		return;
	}
	if (n.type === "dragleave") {
		n.relatedTarget instanceof Node ? a.contains(n.relatedTarget) || Zh(r, a) : t.leaving = window.setTimeout(() => Qh(r), zh);
		return;
	}
	if (n.preventDefault(), n.type !== "drop") {
		let t = Jh(i.accept, n.dataTransfer);
		n.dataTransfer !== null && (n.dataTransfer.dropEffect = t ? "none" : "copy");
		for (let e of r.keys()) e !== a && Zh(r, e);
		let o = i.mark === void 0 ? e.draggingAttribute : Rh;
		r.set(a, o), a.setAttribute(o, t ? Bh : ""), Lh(a, o === Rh);
		return;
	}
	Qh(r);
	let o = [...n.dataTransfer?.files ?? []].filter((e) => $h(i.accept, e));
	o.length !== 0 && e.onFiles(i.host, i.multiple ? o : [o[0]]);
}
function Wh(e, t) {
	if (!(t instanceof ClipboardEvent) || !(t.target instanceof Element)) return;
	let n = t.clipboardData;
	if (n === null || n.files.length === 0 || n.getData("text/plain").trim().length > 0) return;
	let r = e.resolveTarget(t.target);
	if (r === null || r.refused === !0) return;
	let i = [...n.files].filter((e) => $h(r.accept, e));
	i.length !== 0 && (t.preventDefault(), e.onFiles(r.host, r.multiple ? i : [i[0]]));
}
function Gh(e, t, n) {
	for (let r = t.closest(`[${v}]`); r !== null; r = r.parentElement?.closest("[data-ui-id]") ?? null) {
		let t = r.getAttribute("data-ui-id") ?? "", i = [...e.querySelectorAll(`${n}[${hr}="${C(t)}"]`)];
		if (i.length > 0) return {
			field: i.find((e) => r.contains(e)) ?? i[0],
			component: r
		};
	}
	return null;
}
function Kh() {
	if (!Vh) {
		Vh = !0;
		for (let e of ["dragover", "drop"]) window.addEventListener(e, (e) => {
			e instanceof DragEvent && !e.defaultPrevented && (e.dataTransfer?.types.includes("Files") ?? !1) && qh(e);
		});
	}
}
function qh(e) {
	e.type !== "dragleave" && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "none"));
}
function Jh(e, t) {
	let n = Yh(e);
	if (t === null || n.length === 0 || n.some((e) => e.startsWith("."))) return !1;
	let r = [...t.items].filter((e) => e.kind === "file").map((e) => e.type.toLowerCase());
	return r.length !== 0 && !r.some((e) => n.some((t) => Xh(t, e)));
}
function Yh(e) {
	return e.split(",").map((e) => e.trim().toLowerCase()).filter((e) => e.length > 0);
}
function Xh(e, t) {
	return e.endsWith("/*") ? t.startsWith(e.slice(0, -1)) : t === e;
}
function Zh(e, t) {
	let n = e.get(t);
	e.delete(t), n !== void 0 && t.removeAttribute(n), Lh(t, !1);
}
function Qh(e) {
	for (let t of [...e.keys()]) Zh(e, t);
}
function $h(e, t) {
	let n = Yh(e);
	if (n.length === 0) return !0;
	let r = t.name.toLowerCase(), i = t.type.toLowerCase();
	return n.some((e) => e.startsWith(".") ? r.endsWith(e) : Xh(e, i));
}
//#endregion
//#region src/interactions/file-upload.ts
var eg = "/_ne/files/upload", tg = [
	"kilobyte",
	"megabyte",
	"gigabyte"
], ng = /* @__PURE__ */ new Map(), rg = !1;
function ig(e, t, n, r) {
	let i = Number(e.getAttribute(pr)), a = [], o = [];
	for (let e of t) !Number.isFinite(i) || i <= 0 || e.size <= i ? a.push(e) : o.push(e);
	if (o.length === 0) return ng.delete(e) && r?.mark(e, null), a;
	if (r === void 0) return s("a chosen file exceeds the input's size limit and was refused.", {
		names: o.map((e) => e.name),
		limit: i
	}), a;
	let c = {
		validation: r,
		limit: i,
		names: n ? o.map((e) => e.name) : null
	};
	for (let e of ng.keys()) e.isConnected || ng.delete(e);
	return ng.set(e, c), ag(e, c), sg(), a;
}
function ag(e, t) {
	let n = og(t.limit, D.language);
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
function og(e, t) {
	let n = e, r = "byte";
	for (let e of tg) {
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
function sg() {
	rg || (rg = !0, D.onChange(() => {
		for (let [e, t] of ng) e.isConnected ? ag(e, t) : ng.delete(e);
	}));
}
function cg(e, t) {
	return new Promise((n, r) => {
		let i = new FormData(), a = performance.now(), o = 0, s = 0;
		for (let t of e) i.append("files", t, t.name), o += t.size, s++;
		let c = new XMLHttpRequest();
		c.open("POST", eg), c.responseType = "json", c.withCredentials = !0, c.upload.addEventListener("progress", (e) => {
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
var lg = () => {};
function ug(e) {
	return {
		uploadAsync: (e, t) => cg(e, t ?? lg),
		accepts: $h,
		takeWithinSizeLimit: (t, n, r) => ig(t, n, r, e)
	};
}
function dg(e, t) {
	e !== null && e.value !== t && (e.value = t, e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/picker-events.ts
var fg = "ui-open-picker";
function pg(e) {
	return !e.dispatchEvent(new Event(fg, {
		bubbles: !0,
		cancelable: !0
	}));
}
function mg(e, t) {
	if (!(e.target instanceof Element)) return;
	let n = e.target.closest(t.rootSelector);
	if (n === null) return;
	e.preventDefault();
	let r = n.querySelector(t.nativeSelector), i = t.pressed(n);
	r === null || r.disabled || i === null || A(n) || O(i) || r.click();
}
//#endregion
//#region src/interactions/file-input-engine.ts
var hg = "ui-file-input", gg = "ui-file-input__row", _g = "ui-file-input__native", vg = "ui-file-input__field", yg = "ui-file-input__selection", bg = "data-ui-file-dragging", xg = class {
	root;
	validation;
	picks = /* @__PURE__ */ new WeakMap();
	shownWords = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation, D.onChange(() => this.rewriteShownWords()), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener(fg, (e) => mg(e, {
			rootSelector: `.${hg}`,
			nativeSelector: `.${_g}`,
			pressed: (e) => e
		})), this.root.addEventListener("change", (e) => void this.handleSelectionAsync(e), !0), Hh({
			root: this.root,
			draggingAttribute: bg,
			resolveTarget: (e) => {
				let t = e.closest(`.${gg}`)?.closest(`.${hg}`) ?? null, n = t === null ? Gh(this.root, e, `.${hg}`) : null, r = t ?? n?.field ?? null, i = r?.querySelector(`.${_g}`) ?? null;
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
		let t = e.target.closest(`[${mr}], .${gg}`);
		if (t === null || O(t) || A(t) || !t.hasAttribute("data-ui-file-pick") && e.target.closest("button, a") !== null) return;
		let n = t.closest(`.${hg}`)?.querySelector(`.${_g}`);
		n == null || n.disabled || n.click();
	}
	async handleSelectionAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(_g)) return;
		let t = e.target.closest(`.${hg}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && await this.takeFilesAsync(t, n);
	}
	async takeFilesAsync(e, t) {
		let n = e.querySelector(`.${vg}`);
		if (n === null) return;
		if (t.length === 0) {
			this.show(n, ""), this.publishSelection(e, "");
			return;
		}
		let r = ig(e, t, e.querySelector(`.${_g}`)?.multiple === !0, this.validation);
		if (r.length === 0) return;
		let i = (this.picks.get(e) ?? 0) + 1;
		this.picks.set(e, i);
		try {
			let t = await cg(r, (t) => {
				this.picks.get(e) === i && this.show(n, () => D.format("ui.file.uploading", { percent: t }));
			});
			if (this.picks.get(e) !== i) return;
			this.show(n, Sg(r)), this.publishSelection(e, t.selectionId);
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
		dg(e.querySelector(`.${yg}`), t);
	}
};
function Sg(e) {
	return e.length === 1 ? e[0].name : () => D.format("ui.file.count", { count: e.length });
}
//#endregion
//#region src/rendering/file-glyphs.ts
var Cg = "ne-picture-as-pdf", wg = "ne-text-snippet", Tg = "ne-description", Eg = "ne-table-chart", Dg = "ne-slideshow", Og = "ne-folder-zip", kg = "ne-audio-file", Ag = "ne-video-file", jg = "ne-image", Mg = "ne-code", Ng = "ne-draft", Pg = new Map([
	...Rg(Cg, "pdf"),
	...Rg(wg, "txt", "md", "log"),
	...Rg(Tg, "doc", "docx", "odt", "rtf"),
	...Rg(Eg, "xls", "xlsx", "ods", "csv", "tsv"),
	...Rg(Dg, "ppt", "pptx", "odp", "key"),
	...Rg(Og, "zip", "rar", "7z", "tar", "gz", "tgz", "bz2", "xz"),
	...Rg(kg, "mp3", "wav", "ogg", "oga", "opus", "flac", "m4a", "aac"),
	...Rg(Ag, "mp4", "m4v", "mov", "avi", "mkv", "webm"),
	...Rg(jg, "png", "jpg", "jpeg", "gif", "webp", "avif", "bmp", "svg", "ico", "tif", "tiff", "heic", "heif"),
	...Rg(Mg, "json", "xml", "yml", "yaml", "html", "htm", "css", "less", "scss", "js", "mjs", "ts", "tsx", "jsx", "cs", "csproj", "sln", "java", "kt", "py", "rb", "php", "go", "rs", "c", "h", "cpp", "hpp", "swift", "sql", "sh", "ps1")
]), Fg = /* @__PURE__ */ new Map([
	["application/pdf", Cg],
	["text/csv", Eg],
	["application/msword", Tg],
	["application/rtf", Tg],
	["application/vnd.openxmlformats-officedocument.wordprocessingml.document", Tg],
	["application/vnd.oasis.opendocument.text", Tg],
	["application/vnd.ms-excel", Eg],
	["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", Eg],
	["application/vnd.oasis.opendocument.spreadsheet", Eg],
	["application/vnd.ms-powerpoint", Dg],
	["application/vnd.openxmlformats-officedocument.presentationml.presentation", Dg],
	["application/vnd.oasis.opendocument.presentation", Dg],
	["application/zip", Og],
	["application/x-zip-compressed", Og],
	["application/x-7z-compressed", Og],
	["application/vnd.rar", Og],
	["application/x-rar-compressed", Og],
	["application/x-tar", Og],
	["application/gzip", Og],
	["application/json", Mg],
	["application/xml", Mg],
	["text/xml", Mg],
	["text/html", Mg]
]), Ig = /* @__PURE__ */ new Map([
	["image", jg],
	["audio", kg],
	["video", Ag],
	["text", wg]
]);
function Lg(e, t) {
	let n = e.lastIndexOf("."), r = n < 0 ? void 0 : Pg.get(e.slice(n + 1).toLowerCase());
	if (r !== void 0) return r;
	let i = t.split(";", 1)[0].trim().toLowerCase(), a = i.indexOf("/");
	return Fg.get(i) ?? (a < 0 ? void 0 : Ig.get(i.slice(0, a))) ?? Ng;
}
function Rg(e, ...t) {
	return t.map((t) => [t, e]);
}
//#endregion
//#region src/rendering/url-safety.ts
var zg = [
	"http",
	"https",
	"mailto",
	"tel"
];
function Bg(e) {
	let t = String(e ?? "");
	if (t.trim().length === 0) return !1;
	for (let e of t) {
		let t = e.codePointAt(0) ?? 0;
		if (t <= 32 || t >= 127 && t <= 159) return !1;
	}
	if ("/#?.".includes(t[0])) return !0;
	let n = t.indexOf(":");
	return n < 0 || zg.includes(t.slice(0, n).toLowerCase());
}
function Vg(e) {
	return Bg(e) ? String(e) : void 0;
}
var Hg = [
	"http:",
	"https:",
	"mailto:",
	"tel:"
];
function Ug(e) {
	let t = qg(e), n = t.toLowerCase();
	return /^[\\/]{2}/.test(t) || Hg.some((e) => n.startsWith(e));
}
function Wg(e) {
	return typeof e != "string" || /[\x00-\x1f\x7f-\x9f]/.test(e) ? !1 : e === "/" || Gg(e);
}
function Gg(e) {
	return e.length > 1 && e[0] === "/" && e[1] !== "/" && e[1] !== "\\";
}
function Kg(e) {
	return e.length > 0 && e[0] !== "/" && e[0] !== "\\" && !/^[A-Za-z][A-Za-z\d+.-]*:/.test(e);
}
function qg(e) {
	let t = 0, n = e.length;
	for (; t < n && e.charCodeAt(t) <= 32;) t++;
	for (; n > t && e.charCodeAt(n - 1) <= 32;) n--;
	return e.slice(t, n).replace(/[\t\n\r]/g, "");
}
function Jg(e) {
	return Yg(e) !== null;
}
function Yg(e) {
	let t = qg(e), n = t.toLowerCase();
	return Gg(t) || Kg(t) || n.startsWith("https://") || n.startsWith("http://") || n.startsWith("data:image/") ? t : null;
}
function Xg(e) {
	return Yg(String(e ?? "").trim()) ?? void 0;
}
//#endregion
//#region src/rendering/icon-value.ts
var Zg = "mask:", Qg = "ui-icon--image", $g = "ui-icon--mask";
function e_(e) {
	let t = String(e ?? "").trim(), n = !1;
	t.startsWith(Zg) && (n = !0, t = t.slice(5).trim());
	let r = t.includes("/") ? Yg(t) : null;
	return r === null ? null : {
		source: r,
		tinted: n
	};
}
function t_(e) {
	let t = e_(e);
	return t === null ? "" : n_(t.source);
}
function n_(e) {
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
var r_ = "ui-icon", i_ = "data-ui-icon", a_ = "--ui-icon-url";
function o_(e, t) {
	e.classList.add(r_);
	for (let t of Array.from(e.classList)) c_(t) && e.classList.remove(t);
	(e instanceof HTMLElement || e instanceof SVGElement) && e.style.removeProperty(a_);
	let n = l_(t);
	if (n.length === 0) {
		e.removeAttribute(i_);
		return;
	}
	e.setAttribute(i_, ""), e.classList.add(n);
	let r = e_(t);
	r !== null && (e instanceof HTMLElement || e instanceof SVGElement) && e.style.setProperty(a_, n_(r.source));
}
var s_ = "ui-icon-glyph--";
function c_(e) {
	return e === Qg || e === $g || e.startsWith(s_);
}
function l_(e) {
	let t = e_(e);
	return t === null ? u_(e) : t.tinted ? $g : Qg;
}
function u_(e) {
	let t = String(e ?? "").trim();
	if (t.length === 0) return "";
	let n = s_;
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
var d_ = 1024, f_ = 16777216;
function p_(e) {
	return {
		x: e.width / 2,
		y: e.height / 2,
		zoom: 1
	};
}
function m_(e, t) {
	let n = w_(t.zoom, 1, 4), r = C_(e) / n / 2;
	return {
		x: w_(t.x, r, e.width - r),
		y: w_(t.y, r, e.height - r),
		zoom: n
	};
}
function h_(e, t) {
	let n = C_(e) / t.zoom;
	return {
		x: t.x - n / 2,
		y: t.y - n / 2,
		side: n
	};
}
function g_(e, t, n) {
	return t.zoom * n / C_(e);
}
function __(e, t, n, r, i) {
	let a = g_(e, t, n);
	return a > 0 ? m_(e, {
		x: t.x - r / a,
		y: t.y - i / a,
		zoom: t.zoom
	}) : t;
}
function v_(e, t, n, r, i = {
	x: 0,
	y: 0
}) {
	let a = w_(t.zoom * r, 1, 4), o = g_(e, t, n), s = g_(e, {
		...t,
		zoom: a
	}, n);
	return !(o > 0) || !(s > 0) ? m_(e, {
		...t,
		zoom: a
	}) : m_(e, {
		x: t.x + i.x / o - i.x / s,
		y: t.y + i.y / o - i.y / s,
		zoom: a
	});
}
function y_(e, t) {
	return Math.max(1, Math.min(t, Math.round(e.side)));
}
function b_(e, t) {
	return Math.min(1, t * 4 / C_(e), Math.sqrt(f_ / (e.width * e.height)));
}
function x_(e) {
	return e === "image/jpeg" || e === "image/png" || e === "image/webp" ? e : "image/png";
}
function S_(e, t, n) {
	if (n === t) return e;
	let r = e.lastIndexOf(".");
	return `${r > 0 ? e.slice(0, r) : e}.${n === "image/jpeg" ? "jpg" : n.slice(n.indexOf("/") + 1)}`;
}
function C_(e) {
	return Math.min(e.width, e.height);
}
function w_(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
//#endregion
//#region src/interactions/page-dialog.ts
function T_(e) {
	let t = document.createElement("div");
	t.className = `ui-dialog ${e.className}`, t.setAttribute(Up, e.key), t.setAttribute(Wp, ""), e.closesOnEscapeAndBackdrop && (t.setAttribute(qp, ""), t.setAttribute(Kp, "")), t.setAttribute("hidden", "");
	let n = document.createElement("div");
	n.className = "ui-dialog__backdrop", n.setAttribute(Gp, "");
	let r = document.createElement("div");
	return r.className = e.surfaceClassName === void 0 ? qr : `${qr} ${e.surfaceClassName}`, r.setAttribute("role", e.role), r.setAttribute("tabindex", "-1"), r.setAttribute("aria-modal", "true"), r.setAttribute("aria-labelledby", e.labelledBy), e.describedBy !== void 0 && r.setAttribute("aria-describedby", e.describedBy), t.append(n, r), {
		dialog: t,
		surface: r
	};
}
var E_ = class {
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
}, D_ = 100 / 3, O_ = 1, k_ = 2;
function A_(e, t = D_) {
	let n = e.deltaMode === O_ ? D_ : e.deltaMode === k_ ? t : 1;
	return {
		x: e.deltaX * n,
		y: e.deltaY * n
	};
}
function j_(e, t) {
	let n = (Math.sign(e) === Math.sign(t) ? e : 0) + t, r = Math.trunc(n / 100) || 0;
	return {
		steps: r,
		carried: n - r * 100
	};
}
var M_ = {
	notch: 100,
	pixels: A_
}, N_ = "ui-image-crop", P_ = "ui-image-crop-title", F_ = new E_("data-ui-image-crop-part"), I_ = "data-ui-image-crop-frame", L_ = 10, R_ = 1.2, z_ = 380, B_ = 100, V_ = .92, V = null, H_ = !1, U_ = null, W_ = !1;
async function G_(e, t, n, r = rv) {
	if (V !== null || H_) return "cancelled";
	H_ = !0;
	let i;
	try {
		i = await r.decodeAsync(t, n.size);
	} finally {
		H_ = !1;
	}
	if (i === null) return "unreadable";
	let a = i;
	return new Promise((i) => {
		U_ ??= K_();
		let o = U_;
		o.dialog.isConnected || document.body.append(o.dialog), V = {
			file: t,
			source: a,
			request: n,
			imaging: r,
			view: p_(a),
			finish: (t) => {
				V = null, e.close(N_), a.release(), i(t);
			}
		}, D.write(o.title, null, "ui.crop.title"), D.write(o.stage, "aria-label", "ui.crop.frame"), D.write(o.zoom, "aria-label", "ui.crop.zoom"), D.write(o.cancel, null, "ui.crop.cancel"), D.write(o.apply, null, "ui.crop.apply"), o.stage.setAttribute(I_, n.frame), e.open(N_), tv(o);
	});
}
function K_() {
	let { dialog: e, surface: t } = T_({
		key: N_,
		className: "ui-image-crop",
		surfaceClassName: "ui-image-crop__surface",
		role: "dialog",
		labelledBy: P_,
		closesOnEscapeAndBackdrop: !1
	}), n = F_.element("h2", "ui-image-crop__title ui-text-type--subtitle");
	n.id = P_;
	let r = F_.element("div", "ui-image-crop__stage", "stage");
	r.setAttribute("tabindex", "0"), r.setAttribute("role", "group");
	let i = F_.element("canvas", "ui-image-crop__canvas"), a = F_.element("span", "ui-image-crop__frame");
	i.setAttribute("aria-hidden", "true"), a.setAttribute("aria-hidden", "true"), r.append(i, a);
	let o = F_.element("input", "ui-image-crop__zoom", "zoom");
	o.type = "range", o.min = "1", o.max = "4", o.step = "0.01";
	let s = F_.button("ui-button--outline", "cancel"), c = F_.button("ui-button--primary", "apply");
	t.append(n, r, o, F_.actions(s, c));
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
		let t = F_.pressed(e);
		t === "cancel" ? V?.finish("cancelled") : t === "apply" && q_();
	}), e.addEventListener("keydown", (e) => J_(l, e)), o.addEventListener("input", () => $_(l, Number(o.value))), r.addEventListener("wheel", (e) => Y_(l, e), { passive: !1 }), window.addEventListener("resize", () => nv(l)), new _m({
		root: e,
		resolveHandle: (e) => r.contains(e) ? r : null,
		begin: (e, t) => V === null ? null : {
			last: t,
			start: V.view
		},
		move: (e, t, n) => {
			e.last !== null && X_(l, n.x - e.last.x, n.y - e.last.y), e.last = n;
		},
		end: () => void 0,
		cancel: (e, t) => {
			V !== null && (V.view = t.start, tv(l));
		},
		pinch: (e, t) => {
			e.last = null, Z_(l, t);
		}
	}), l;
}
async function q_() {
	let e = V;
	if (e === null) return;
	let { file: t, source: n, request: r, imaging: i, view: a } = e, o = h_(n, a), s = x_(t.type), c = i.encodeAsync(n, o, y_(o, r.size), s);
	V = null;
	let l;
	try {
		l = await c;
	} catch {
		l = null;
	}
	e.finish(l === null ? "unreadable" : new File([l], S_(t.name, t.type, l.type), {
		type: l.type,
		lastModified: t.lastModified
	}));
}
function J_(e, t) {
	if (t.defaultPrevented || j(t) || V === null) return;
	if (t.key === "Escape") {
		t.preventDefault(), V.finish("cancelled");
		return;
	}
	if (t.target !== e.stage || t.ctrlKey || t.altKey || t.metaKey) return;
	let n = t.shiftKey ? 50 : L_;
	switch (t.key) {
		case "ArrowLeft":
			X_(e, -n, 0);
			break;
		case "ArrowRight":
			X_(e, n, 0);
			break;
		case "ArrowUp":
			X_(e, 0, -n);
			break;
		case "ArrowDown":
			X_(e, 0, n);
			break;
		case "+":
		case "=":
			Q_(e, R_);
			break;
		case "-":
		case "_":
			Q_(e, 1 / R_);
			break;
		case "Enter":
			q_();
			break;
		default: return;
	}
	t.preventDefault();
}
function Y_(e, t) {
	if (V === null) return;
	t.preventDefault();
	let n = A_(t, e.stage.clientHeight), r = t.ctrlKey ? B_ : z_;
	Q_(e, 2 ** (-n.y / r), ev(e, t.clientX, t.clientY));
}
function X_(e, t, n) {
	V !== null && (V.view = __(V.source, V.view, e.frame.clientWidth, t, n), tv(e));
}
function Z_(e, t) {
	if (V === null) return;
	let n = __(V.source, V.view, e.frame.clientWidth, t.shift.x, t.shift.y);
	V.view = v_(V.source, n, e.frame.clientWidth, t.factor, ev(e, t.center.x, t.center.y)), tv(e);
}
function Q_(e, t, n) {
	V !== null && (V.view = v_(V.source, V.view, e.frame.clientWidth, t, n), tv(e));
}
function $_(e, t) {
	V !== null && Number.isFinite(t) && t > 0 && Q_(e, t / V.view.zoom);
}
function ev(e, t, n) {
	let r = e.stage.getBoundingClientRect();
	return {
		x: t - (r.left + r.width / 2),
		y: n - (r.top + r.height / 2)
	};
}
function tv(e) {
	if (V === null) return;
	let t = V.view.zoom;
	e.zoom.value = String(t), e.zoom.setAttribute("aria-valuetext", `${Math.round(t * 100)}%`), e.zoom.style.setProperty("--ui-slider-fraction", String((t - 1) / 3)), nv(e);
}
function nv(e) {
	W_ || V === null || (W_ = !0, requestAnimationFrame(() => {
		if (W_ = !1, V === null) return;
		let t = e.frame.clientWidth, n = e.stage.clientWidth, r = e.stage.clientHeight, i = V.view, a = g_(V.source, i, t);
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
var rv = {
	decodeAsync: async (e, t) => {
		let n = await iv(e);
		if (n === null) return null;
		let r = n, i = b_(r, t);
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
		}, r, V_);
	})
};
async function iv(e) {
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
var av = "ui-image-input", ov = "ui-image-input--multiple", sv = "ui-image-input__surface", cv = "ui-image-input__native", lv = "ui-image-input__picture", uv = "ui-image-input__text", dv = "ui-image-input__selection", fv = "ui-image-input__selections", pv = "ui-image-input__tiles", mv = "ui-image-input__tile", hv = "ui-image-input__remove", gv = "ui-image-input__progress", _v = "ui-image-input__tile--file", vv = "ui-image-input__file-glyph", yv = "ui-image-input__file-name", bv = "ui-image-input__file-size", xv = "SelectionId", Sv = "--ui-image-progress", Cv = "data-ui-image-preview", wv = "data-ui-image-dragging", Tv = "data-ui-image-tiles", Ev = class {
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
		this.root = e.root ?? document, this.validation = e.validation, this.dialogs = e.dialogs, this.cropImaging = e.cropImaging, this.applyAll(this.root.querySelectorAll(`.${av}`)), B(this.root, `.${av}`, {
			childList: !0,
			attributeFilter: [
				fr,
				Xe,
				Fr
			]
		}, (e) => {
			this.applyAll(e), this.releaseDetached();
		}), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			e.propertyName === xv && (e.value === null || e.value === void 0 || e.value === "") && this.clearAll(Qi(e.components, `.${av}`));
		}), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("click", (e) => this.handleRemoveClick(e), !0), this.root.addEventListener("change", (e) => void this.handleNativeChangeAsync(e), !0), this.root.addEventListener(fg, (e) => mg(e, {
			rootSelector: `.${av}`,
			nativeSelector: `.${cv}`,
			pressed: (e) => e.querySelector(`.${sv}`)
		})), this.root.addEventListener(kc, (e) => this.handleDraftDropped(e)), Hh({
			root: this.root,
			draggingAttribute: wv,
			resolveTarget: (e) => {
				let t = e.closest(`.${sv}`), n = t?.closest(`.${av}`) ?? null, r = n === null ? Gh(this.root, e, `.${av}`) : null, i = n ?? r?.field ?? null, a = t ?? i?.querySelector(`.${sv}`) ?? null;
				return i === null || a === null ? null : {
					host: i,
					mark: r?.component,
					accept: i.querySelector(`.${cv}`)?.getAttribute("accept") ?? "",
					multiple: Dv(i),
					refused: A(i) || O(a)
				};
			},
			onFiles: (e, t) => void (Dv(e) ? this.takeManyAsync(e, t) : this.takeFileAsync(e, t[0]))
		});
	}
	applyAll(e) {
		for (let t of e) Dv(t) ? this.reconcileShelf(t) : this.apply(t);
	}
	apply(e) {
		let t = e.querySelector(`.${lv}`);
		if (t === null) return;
		let n = e.getAttribute("data-ui-image-source") ?? "", r = this.previews.has(e);
		if (r && e.dataset.previewFor === n) return;
		let i = r && n.length > 0;
		this.dropPreview(e, i), n.length === 0 ? t.removeAttribute("src") : t.getAttribute("src") !== n && t.setAttribute("src", n), i || Nv(e, e.getAttribute("data-ui-image-caption") ?? Iv(n)), Fv(e, n.length > 0);
	}
	reconcileShelf(e) {
		let t = this.shelves.get(e), n = e.getAttribute(Fr);
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
		for (let t of e) Dv(t) || this.previews.get(t)?.landed !== !0 || (t.dataset.previewFor === (t.getAttribute("data-ui-image-source") ?? "") && this.dropPreview(t), this.apply(t));
	}
	handlePickClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${mr}]`), n = t?.closest(`.${av}`) ?? null;
		t === null || n === null || A(n) || O(t) || n.querySelector(`.${cv}`)?.click();
	}
	handleRemoveClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${hv}`), n = t?.closest(`.${av}`) ?? null;
		if (t === null || n === null || A(n) || O(n)) return;
		e.preventDefault(), e.stopPropagation();
		let r = this.shelves.get(n)?.find((e) => e.element === t.parentElement);
		r !== void 0 && (this.dropTile(n, r), this.publishShelf(n));
	}
	async handleNativeChangeAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(cv)) return;
		let t = e.target.closest(`.${av}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && n.length !== 0 && (Dv(t) ? await this.takeManyAsync(t, n) : await this.takeFileAsync(t, n[0]));
	}
	handleDraftDropped(e) {
		if (e.target instanceof Element) for (let t of e.target.querySelectorAll(`.${av}`)) this.previews.has(t) && (this.dropPreview(t), this.apply(t), dg(t.querySelector(`.${dv}`), ""));
	}
	async takeFileAsync(e, t) {
		this.releaseDetached();
		let n = e.querySelector(`.${sv}`), r = e.querySelector(`.${lv}`), i = e.querySelector(`.${dv}`);
		if (n === null || r === null) return;
		let a = await this.cropAsync(e, t);
		if (a === null || ig(e, [a], !1, this.validation).length === 0) return;
		this.dropPreview(e);
		let o = {
			url: URL.createObjectURL(a),
			landed: !1
		};
		this.previews.set(e, o), this.holding.add(e), e.dataset.previewFor = e.getAttribute("data-ui-image-source") ?? "", e.setAttribute(Cv, ""), r.setAttribute("src", o.url), Nv(e, a.name), Fv(e, !0), n.classList.add(Wr);
		try {
			let t = await cg([a], () => void 0);
			this.previews.get(e) === o && (o.landed = !0, dg(i, t.selectionId));
		} catch (t) {
			s("picture upload failed.", t), this.previews.get(e) === o && (Pv(e), dg(i, ""));
		} finally {
			(this.previews.get(e) === o || !this.previews.has(e)) && n.classList.remove(Wr);
		}
	}
	async cropAsync(e, t) {
		let n = kv(e);
		if (n === null || this.dialogs === void 0) return t;
		if (this.cropping.has(e)) return null;
		this.cropping.add(e);
		try {
			let r = await G_(this.dialogs, t, {
				frame: n,
				size: Av(e)
			}, this.cropImaging);
			return r === "cancelled" || !e.isConnected ? null : r === "unreadable" ? (this.unreadable.add(e), this.validation?.mark(e, "error", { key: "ui.image.unreadable" }), null) : (this.unreadable.delete(e) && this.validation?.mark(e, null), r);
		} finally {
			this.cropping.delete(e);
		}
	}
	async takeManyAsync(e, t) {
		this.releaseDetached();
		let n = e.querySelector(`.${pv}`), r = ig(e, t, !0, this.validation);
		if (n === null || r.length === 0) return;
		let i = this.shelves.get(e) ?? [];
		this.shelves.set(e, i), this.holding.add(e);
		let a = r.map(async (t) => {
			let r = jv(t);
			i.push(r), n.appendChild(r.element);
			try {
				let n = await cg([t], (e) => r.element.style.setProperty(Sv, `${e}%`));
				if (!i.includes(r)) return;
				r.selectionId = n.selectionId, r.element.classList.remove(Wr), this.publishShelf(e);
			} catch (t) {
				this.dropTile(e, r), s("picture upload failed.", t);
			}
		});
		Ov(e, i), await Promise.all(a);
	}
	dropTile(e, t) {
		let n = this.shelves.get(e), r = n?.indexOf(t) ?? -1;
		n !== void 0 && r >= 0 && n.splice(r, 1), URL.revokeObjectURL(t.url), t.element.remove(), Ov(e, n ?? []);
	}
	publishShelf(e) {
		let t = e.querySelector(`.${fv}`), n = (this.shelves.get(e) ?? []).map((e) => e.selectionId).filter((e) => e !== null), r = JSON.stringify(n);
		if (t === null || t.getAttribute("data-ui-selected-keys") === r) return;
		let i = this.published.get(e) ?? [];
		i.push(r), this.published.set(e, i), t.setAttribute(Fr, r), t.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	dropPreview(e, t = !1) {
		let n = this.previews.get(e);
		n !== void 0 && (URL.revokeObjectURL(n.url), this.previews.delete(e), delete e.dataset.previewFor, e.removeAttribute(Cv), t || Nv(e, ""));
	}
};
function Dv(e) {
	return e.classList.contains(ov);
}
function Ov(e, t) {
	e.hasAttribute(Tv) !== t.length > 0 && e.toggleAttribute(Tv, t.length > 0);
}
function kv(e) {
	let t = e.getAttribute(Ze);
	return t === "square" || t === "circle" ? t : null;
}
function Av(e) {
	let t = Number(e.getAttribute(Qe));
	return Number.isInteger(t) && t > 0 ? t : d_;
}
function jv(e) {
	let t = document.createElement("span"), n = document.createElement("button"), r = document.createElement("span"), i = URL.createObjectURL(e);
	if (t.className = `${mv} ${Wr}`, n.type = "button", n.className = hv, r.className = gv, e.type.startsWith("image/")) {
		let a = document.createElement("img");
		a.src = i, a.alt = e.name, D.write(n, "aria-label", "ui.image.remove"), a.addEventListener("error", () => t.replaceChildren(...Mv(t, n, e), n, r), { once: !0 }), t.append(a, n, r);
	} else t.append(...Mv(t, n, e), n, r);
	return {
		element: t,
		url: i,
		selectionId: null
	};
}
function Mv(e, t, n) {
	let r = document.createElement("span"), i = document.createElement("span"), a = document.createElement("span");
	return e.classList.add(_v), e.setAttribute("title", n.name), r.className = vv, r.setAttribute("aria-hidden", "true"), o_(r, Lg(n.name, n.type)), i.className = yv, i.textContent = n.name, a.className = bv, a.textContent = og(n.size, D.language), D.write(t, "aria-label", "ui.file.remove"), [
		r,
		i,
		a
	];
}
function Nv(e, t) {
	let n = e.querySelector(`.${uv}`);
	n !== null && (Fo(n, null), n.textContent !== t && (n.textContent = t));
}
function Pv(e) {
	let t = e.querySelector(`.${uv}`);
	t !== null && D.write(t, null, "ui.file.failed");
}
function Fv(e, t) {
	let n = e.querySelector(`.${sv}`);
	n !== null && D.write(n, "aria-label", t ? "ui.image.change" : "ui.image.choose");
}
function Iv(e) {
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
var Lv = "ui-key-value-action__value", Rv = "ui-key-value-action--editable", zv = "ui-text__title", Bv = "ui-row-form-", Vv = ":scope > :is(.ui-input--filled, .ui-input--tonal, .ui-input--outline, .ui-input--ghost, .ui-input--underline)", Hv = class {
	options;
	root;
	openRows = /* @__PURE__ */ new WeakSet();
	closedRows = /* @__PURE__ */ new WeakSet();
	rowForms = /* @__PURE__ */ new WeakMap();
	formCount = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.handleRows(this.root.querySelectorAll(`.${pc}`), !1), B(this.root, `.${pc}`, {
			childList: !0,
			attributeFilter: [or]
		}, (e) => this.handleRows(e, !0)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && qv(e.target) && e.preventDefault();
		}, !0), (this.root === document ? window : this.root).addEventListener("change", (e) => Kv(e), !0);
	}
	handleRows(e, t) {
		for (let n of e) {
			if (!n.hasAttribute("data-ui-row-editing")) {
				this.closedRows.has(n) || (this.openRows.delete(n), this.closedRows.add(n), this.close(n));
				continue;
			}
			this.closedRows.delete(n), this.joinForm(n), Uv(n), this.openRows.has(n) || (this.openRows.add(n), this.open(n, t), this.judge(n));
		}
	}
	joinForm(e) {
		let t = e.querySelector(`.${hc} button`);
		if (t === null) return;
		let n = this.rowForms.get(e);
		n === void 0 && (n = `${Bv}${++this.formCount}`, this.rowForms.set(e, n));
		for (let t of e.querySelectorAll(`.${mc} [${qe}]:not([${zt}])`)) t.setAttribute(zt, n);
		t.setAttribute(Vr, n);
	}
	leaveForm(e) {
		let t = this.rowForms.get(e);
		if (t !== void 0) for (let n of e.querySelectorAll(`[${zt}="${t}"], [${Vr}="${t}"]`)) n.removeAttribute(zt), n.removeAttribute(Vr);
	}
	close(e) {
		this.leaveForm(e);
		for (let t of e.querySelectorAll(`.${mc} [${qe}]`)) {
			if (Tc(t)) {
				t.value = "";
				continue;
			}
			let e = this.options.dom.resolveNearestComponent(t, () => !0);
			this.options.propertyPatchEngine.restoreBoundValue(t, e?.dynamicParameters ?? []);
		}
		Ac(e), this.judge(e);
	}
	judge(e) {
		let t = Gv(e);
		for (let n of e.querySelectorAll(`.${mc} [${qe}]`)) this.options.validation.judgeShown(n, Tc(n) && n.value.length === 0 ? t : null);
	}
	open(e, t) {
		let n = e.querySelector(`.${mc} :is(input, textarea, select)`);
		if (n !== null) {
			if (Tc(n) && n.value.length === 0 && n.hasAttribute("data-ui-bind-value")) {
				let t = Gv(e);
				t.length > 0 && (n.value = t, n.dispatchEvent(new Event("change", { bubbles: !0 })));
			}
			t && (n.focus({ preventScroll: !0 }), wc(n) && n.select());
		}
	}
	handleKeydown(e) {
		if (e.key === "F2" && !e.defaultPrevented && M(e)) {
			Wv(e);
			return;
		}
		if (e.defaultPrevented || j(e) || !(e.target instanceof Element) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = yc(e.target);
		if (t === null || e.key === "Enter" && t.cell.classList.contains("ui-key-value-action__edit-action")) return;
		let { cell: n, row: r } = t, i = e.target.closest(Qr), a = n.querySelector("[role='listbox']");
		if (i !== null && n.contains(i) || a !== null && a.getClientRects().length > 0 || e.key === "Enter" && e.target instanceof HTMLTextAreaElement) return;
		let o = r.querySelectorAll(`.${hc} button`), s = e.key === "Enter" ? o[0] : o[o.length - 1];
		s !== void 0 && (e.preventDefault(), !O(s) && (e.key === "Enter" && e.target instanceof HTMLInputElement && (e.target.dispatchEvent(new Event("change", { bubbles: !0 })), s.focus({ preventScroll: !0 })), s.click()));
	}
};
function Uv(e) {
	for (let t of e.querySelectorAll(`:scope > .${mc}`)) {
		let e = t.querySelector(Vv) !== null;
		t.hasAttribute("data-ui-boxed-editor") !== e && t.toggleAttribute(sr, e);
	}
}
function Wv(e) {
	let t = e.target instanceof Element ? e.target.closest(`.${pc}`) : null, n = t === null || t.hasAttribute("data-ui-row-editing") || t.closest(`.${Rv}`) === null ? null : t.querySelector(".ui-key-value-action__action")?.querySelector(Vu) ?? null;
	n === null || O(n) || (e.preventDefault(), n.click());
}
function Gv(e) {
	return e.querySelector(`.${Lv} .${zv}`)?.textContent?.trim() ?? "";
}
function Kv(e) {
	if (!e.isTrusted || !(e.target instanceof Element)) return;
	let t = e.target.closest(".ui-key-value-action__value-input")?.closest(".ui-key-value-action__row") ?? null;
	t !== null && !t.hasAttribute("data-ui-row-editing") && e.stopImmediatePropagation();
}
function qv(e) {
	let t = e.closest(`.${hc} button`), n = t?.closest(`.${hc}`)?.querySelectorAll("button");
	return t !== null && n !== void 0 && n[n.length - 1] === t;
}
var Jv = `.ui-button[${St}="pressed"]`, Yv = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(Jv);
		t === null || O(t) || t.hasAttribute("data-ui-drawer-pin") || (t.setAttribute("aria-pressed", t.getAttribute("aria-pressed") === "true" ? "false" : "true"), t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, Xv = `${Mc}, [tabindex], [contenteditable], ${Qr}, [${Ye}]`, Zv = ":scope > input.ui-field, :scope > textarea.ui-field", Qv = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("pointerdown", (e) => this.handlePointerDown(e));
	}
	handlePointerDown(e) {
		if (e.defaultPrevented || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(jc);
		if (t === null || e.target !== t && e.target.closest(Xv) !== null) return;
		let n = t.querySelector(Zv);
		if (!Tc(n) || n.readOnly || O(n) || A(n) || (e.preventDefault(), n.focus({ preventScroll: !0 }), n.selectionStart === null)) return;
		let r = n.value.length;
		n.setSelectionRange(r, r);
	}
}, $v = "data-ui-input-debounce", ey = `input[${$v}], textarea[${$v}]`;
function ty(e) {
	return (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.matches(ey);
}
var ny = /* @__PURE__ */ new Set();
function ry() {
	for (let e of ny) if (e.waiting) return !0;
	return !1;
}
function iy() {
	for (let e of ny) e.commitAll();
}
function ay(e) {
	for (let t of ny) t.drop(e);
}
var oy = class {
	root;
	timers = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleChange(e), !0), ny.add(this);
	}
	get waiting() {
		return this.timers.size > 0;
	}
	drop(e) {
		if (!ty(e)) return;
		let t = this.timers.get(e);
		t !== void 0 && (window.clearTimeout(t), this.timers.delete(e));
	}
	commitAll() {
		for (let [e, t] of [...this.timers]) window.clearTimeout(t), this.commit(e);
	}
	handleInput(e) {
		let t = e.target;
		if (!ty(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = Number(t.getAttribute($v));
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(r) && r >= 0 ? r : 0));
	}
	handleChange(e) {
		let t = e.target;
		if (!ty(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && (window.clearTimeout(n), this.timers.delete(t));
	}
	commit(e) {
		this.timers.delete(e), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
}, sy = "data-ui-submit-on-enter", cy = "data-ui-runs-on-enter", ly = "enter", uy = "escape", dy = {
	name: ly,
	registration: { settlesValue: !0 }
}, fy = "ui-commit-in-place", py = class {
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
		}, !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), this.root.addEventListener(fy, (e) => {
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
			e.key === "Escape" ? (e.preventDefault(), vc(t) ? this.runEscape(t, e) : this.leave(t)) : my(t, e) ? (e.preventDefault(), this.runEnter(t, e)) : hy(t, e) && (e.preventDefault(), this.commitInPlace(t), this.submitForm(t));
			return;
		}
		if (wc(t)) {
			if (e.preventDefault(), my(t, e)) {
				this.runEnter(t, e);
				return;
			}
			if (e.key === "Escape" && vc(t)) {
				this.runEscape(t, e);
				return;
			}
			this.leave(t), e.key === "Enter" && this.submitForm(t);
		}
	}
	runEnter(e, t) {
		t.repeat || e.readOnly || O(e) || (this.commitInPlace(e), e.dispatchEvent(new Event(ly, { bubbles: !0 })));
	}
	runEscape(e, t) {
		if (t.repeat) return;
		ay(e), this.edited.delete(e), e === this.focusedField && e.value !== this.lastCommitted && this.putBack(e, this.lastCommitted);
		let n = vd(e);
		e.blur(), yd(e, n), e.dispatchEvent(new Event(uy, { bubbles: !0 }));
	}
	putBack(e, t) {
		this.propertyPatchEngine?.writeBoundValue(e, t), e.value !== t && (e.value = t);
	}
	submitForm(e) {
		let t = e.getAttribute(zt);
		if (t === null || t.length === 0) return;
		let n = this.root.querySelector(`[${Vr}="${C(t)}"]`);
		n !== null && !O(n) && n.click();
	}
	leave(e) {
		let t = this.changes, n = vd(e);
		e.blur(), this.changes === t && this.commit(e), yd(e, n);
	}
	commit(e) {
		e.value !== this.committedValue && e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	commitInPlace(e) {
		this.edited.has(e) ? e.dispatchEvent(new Event("change", { bubbles: !0 })) : this.commit(e);
	}
};
function my(e, t) {
	return gy(t) && e.hasAttribute(cy);
}
function hy(e, t) {
	return gy(t) && e.hasAttribute(sy) && !e.readOnly && !O(e);
}
function gy(e) {
	return e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey;
}
//#endregion
//#region src/interactions/image-fallback-engine.ts
var _y = `img.${$e}`, vy = "%238c8c8c", yy = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='-12 -12 48 48'%3E%3Crect x='3' y='3' width='18' height='18' rx='3' fill='none' stroke='${vy}' stroke-width='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.75' fill='${vy}'/%3E%3Cpath d='M4 18l5-6 4 4.5 3-3 4 4.5' fill='none' stroke='${vy}' stroke-width='2' stroke-linejoin='round'/%3E%3C/svg%3E`, by = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='-12 -12 48 48'%3E%3Ccircle cx='12' cy='8' r='4' fill='${vy}'/%3E%3Cpath d='M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z' fill='${vy}'/%3E%3C/svg%3E`, xy = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("error", (e) => this.handleError(e), !0);
		for (let e of this.root.querySelectorAll(_y)) (Sy(e) || e.complete && e.naturalWidth === 0) && wy(e);
		B(this.root, _y, {
			childList: !0,
			attributeFilter: ["src"]
		}, (e) => {
			for (let t of e) t instanceof HTMLImageElement && (t.hasAttribute("data-ui-image-failed") && !Cy(t) && t.removeAttribute(tt), Sy(t) && wy(t));
		});
	}
	handleError(e) {
		let t = e.target;
		t instanceof HTMLImageElement && t.matches(_y) && wy(t);
	}
};
function Sy(e) {
	let t = e.getAttribute("src");
	return t === null || t.trim().length === 0;
}
function Cy(e) {
	let t = e.getAttribute("src");
	return t === yy || t === by;
}
function wy(e) {
	let t = e.getAttribute(et);
	if (t !== null && t.length > 0 && e.getAttribute("src") !== t) {
		e.setAttribute("src", t);
		return;
	}
	Cy(e) || (e.setAttribute(tt, ""), e.setAttribute("src", e.classList.contains("ui-image--circle") ? by : yy));
}
//#endregion
//#region src/items/radio-row-decorator.ts
var Ty = "ui-radio-group__input", Ey = "ui-radio-group__dot", Dy = {
	kind: "radio",
	decorate: Oy
};
function Oy(e) {
	let t = document.createElement("input");
	t.className = Ty, t.type = "radio", t.value = e.key;
	let n = document.createElement("span");
	n.className = Ey, e.row.prepend(t, n);
}
//#endregion
//#region src/interactions/radio-group-sync-engine.ts
var ky = "data-ui-radio-value", Ay = "ui-radio-group", jy = "ui-radio-group__item", My = "data-ui-radio-group-name", Ny = "data-ui-radio-bind-value-id", Py = class {
	root;
	renamed = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.claimGroupNames([...this.root.querySelectorAll(`.${Ay}`)]);
		for (let e of this.root.querySelectorAll(`.${Ay}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = [];
			for (let n of e) {
				if (n.type === "attributes" && n.target instanceof HTMLElement) {
					this.sync(n.target.closest(`.${Ay}`));
					continue;
				}
				for (let e of n.addedNodes) e instanceof HTMLElement && t.push(e);
			}
			this.claimGroupNames(t.flatMap(Fy));
			for (let e of new Set(t.map((e) => e.closest(`.${Ay}`)))) this.sync(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: [ky, "class"],
			childList: !0,
			subtree: !0
		});
	}
	claimGroupNames(e) {
		if (e.length === 0) return;
		let t = /* @__PURE__ */ new Map();
		for (let e of this.root.querySelectorAll(`.${Ay}`)) {
			let n = e.getAttribute(My);
			n !== null && t.set(n, (t.get(n) ?? 0) + 1);
		}
		let n = /* @__PURE__ */ new Set();
		for (let r of e) {
			let e = r.getAttribute(My), i = e === null ? 0 : t.get(e) ?? 0;
			if (e === null || i < 2) continue;
			t.set(e, i - 1), n.add(e);
			let a = `${e}-${++this.renamed}`;
			r.setAttribute(My, a);
			for (let e of cl(r, `.${Ty}`, `.${Ay}`)) e.name = a;
			this.sync(r);
		}
		if (n.size !== 0) for (let e of this.root.querySelectorAll(`.${Ay}`)) n.has(e.getAttribute(My) ?? "") && this.sync(e);
	}
	sync(e) {
		if (e === null) return;
		let t = e.getAttribute(ky), n = e.getAttribute(My), r = e.getAttribute(Ny);
		for (let i of cl(e, `.${Ty}`, `.${Ay}`)) {
			n !== null && i.name !== n && (i.name = n), r !== null && i.getAttribute("data-ui-bind-value") !== r && i.setAttribute(qe, r), i.checked = i.value === t;
			let e = Iy(i);
			i.disabled !== e && (i.disabled = e);
		}
	}
};
function Fy(e) {
	return e.classList.contains(Ay) ? [e] : [...e.querySelectorAll(`.${Ay}`)];
}
function Iy(e) {
	let t = e.closest(`.${jy}`);
	return t !== null && k(t);
}
//#endregion
//#region src/interactions/search-input-engine.ts
var Ly = "data-ui-search-debounce", Ry = "data-ui-search-min-length", zy = "data-ui-search-manual", By = "data-ui-search-answered", Vy = "ui-search__input", Hy = "ui-select__list", Uy = "ui-select__option", Wy = 300, Gy = class {
	root;
	timers = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("compositionend", (e) => this.handleInput(e), !0), this.root.addEventListener("keydown", (e) => this.handleEnter(e), !0);
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Vy) || e instanceof InputEvent && e.isComposing) return;
		let t = e.target;
		qy(t);
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = t.getAttribute(Ly), i = r === null ? Wy : Number(r);
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(i) && i >= 0 ? i : Wy));
	}
	handleEnter(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Enter" || e.defaultPrevented || j(e) || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Vy)) return;
		let t = e.target, n = this.timers.get(t);
		e.preventDefault(), n !== void 0 && (window.clearTimeout(n), this.timers.delete(t)), this.commit(t, !0);
	}
	commit(e, t = !1) {
		e.dispatchEvent(new Event("change", { bubbles: !0 })), !(!t && e.hasAttribute(zy)) && Ky(e) && e.dispatchEvent(new Event("search", { bubbles: !0 }));
	}
};
function Ky(e) {
	let t = Number(e.getAttribute(Ry) ?? 0);
	return !Number.isFinite(t) || e.value.trim().length >= t;
}
function qy(e) {
	if (e.hasAttribute(By)) return;
	let t = e.closest(`.${ri}`), n = t?.querySelector(`.${Hy}`);
	if (t == null || n == null) return;
	let r = Ky(e) ? dm(e.value, e) : [], i = Jy(n, (e) => r.length === 0 || pm(fm(gm(e), e), r));
	Zy(t, n, r.length > 0 && i === 0);
}
function Jy(e, t) {
	let n = null, r = !1, i = 0;
	for (let a of e.children) {
		if (!(a instanceof HTMLElement)) continue;
		if (a.hasAttribute("data-ui-group-header")) {
			n !== null && Yy(n, r), n = a, r = !1;
			continue;
		}
		if (!a.classList.contains(Uy)) continue;
		let e = t(a);
		Yy(a, e), r ||= e, e && i++;
	}
	return n !== null && Yy(n, r), i;
}
function Yy(e, t) {
	let n = t ? "" : "none";
	e.style.display !== n && (e.style.display = n);
}
function Xy(e) {
	let t = e.querySelector(`.${Hy}`);
	t !== null && Zy(e, t, Jy(t, (e) => e.style.display !== "none") === 0);
}
function Zy(e, t, n) {
	let r = t.querySelector(`:scope > [${gt}]`);
	if (!n) {
		r?.remove();
		return;
	}
	if (r !== null) return;
	let i = e.querySelector(`:scope > template[${mt}]`);
	if (i === null) return;
	let a = i.content.cloneNode(!0).firstElementChild;
	a !== null && (a.setAttribute(gt, ""), t.appendChild(a));
}
//#endregion
//#region src/interactions/type-ahead.ts
var Qy = 500, $y = class {
	owner = null;
	typed = "";
	last = -Infinity;
	now;
	constructor(e = () => performance.now()) {
		this.now = e;
	}
	next(e) {
		let t = this.now();
		(e.owner !== this.owner || t - this.last > Qy) && (this.typed = ""), this.owner = e.owner, this.last = t, this.typed += fm(e.character, e.context);
		let n = Array.from(this.typed), r = n.every((e) => e === n[0]), i = r ? n[0] : this.typed, a = e.entries.length, o = e.current === null ? -1 : e.entries.indexOf(e.current), s = r ? o + 1 : Math.max(o, 0);
		for (let t = 0; t < a; t++) {
			let n = e.entries[(s + t) % a];
			if (fm(e.words(n), e.context).trimStart().startsWith(i)) return n;
		}
		return null;
	}
};
function eb(e) {
	return j(e) || e.metaKey || Array.from(e.key).length !== 1 || !/\S/u.test(e.key) || (e.ctrlKey || e.altKey) && !e.getModifierState("AltGraph") ? null : e.key;
}
//#endregion
//#region src/interactions/select-interaction-engine.ts
var tb = "data-ui-select-value", nb = "data-ui-select-placement", rb = "ui-select--open", ib = "ui-select__trigger-content", ab = "data-ui-select-content", ob = "ui-select__placeholder", sb = "ui-input__affix-icon--prefix", cb = "ui-select__popup", lb = "ui-select__list", ub = "ui-select__option", db = "ui-select__value-input", fb = "data-ui-select-clear", pb = "ui-search", mb = "ui-search__input", hb = "data-ui-active", gb = "data-ui-list-keyboard", _b = /* @__PURE__ */ new Set([
	"ArrowDown",
	"ArrowUp",
	"Home",
	"End",
	"PageDown",
	"PageUp"
]), vb = "ui-multi-select", yb = "ui-multi-select__chips", bb = "ui-multi-select__chip", xb = "ui-multi-select__chip-label", Sb = "ui-multi-select__chip-remove", Cb = "data-ui-select-chip", wb = "data-ui-select-chips", Tb = "data-ui-select-max", Eb = "data-ui-select-free-text", Db = "ui-multi-select__entry", Ob = "data-ui-select-tag-entry", kb = [
	tb,
	Fr,
	Tb,
	"class",
	y
];
function Ab(e) {
	return e === null || A(e) || O(e);
}
function jb(e) {
	return e.classList.contains(vb);
}
function Mb(e) {
	return e.classList.contains(pb);
}
function Nb(e) {
	return Mb(e) ? e.querySelector(`.${mb}`) : null;
}
function Pb(e) {
	return e.hasAttribute(Eb) ? e.querySelector(`:scope > .${$r} .${Db}`) : null;
}
function Fb(e) {
	return Nb(e) ?? Pb(e);
}
function Ib(e) {
	return Pb(e) ?? e.querySelector(".ui-select__trigger");
}
function Lb(e) {
	let t = e.target instanceof HTMLInputElement && e.target.classList.contains(Db) ? e.target : null, n = t?.closest(".ui-select") ?? null;
	return t === null || n === null ? null : {
		entry: t,
		select: n
	};
}
function Rb(e) {
	return cl(e, `.${cb} .${ub}`, `.${ri}`);
}
function zb(e) {
	let t = Rb(e).filter((e) => !k(e));
	return t.find((e) => e === document.activeElement) ?? t.find((e) => e.hasAttribute(hb)) ?? null;
}
function Bb(e) {
	for (let t of cl(e, `.${lb}`, `.${ri}`)) {
		let e = t.querySelector(`:scope > .${ub}[${hb}]:not([${Or}])`) !== null;
		t.hasAttribute(gb) !== e && t.toggleAttribute(gb, e);
	}
}
function Vb(e) {
	return e === null ? null : gm(e);
}
function Hb(e) {
	for (let t of [e, ...e.querySelectorAll("*")]) {
		t.removeAttribute(v), t.removeAttribute(y), t.removeAttribute(ae), t.removeAttribute(ie);
		for (let e of [...t.attributes]) e.name.startsWith("data-ui-bind-") && t.removeAttribute(e.name);
	}
}
var Ub = class {
	root;
	popups = new $m({
		show: ({ owner: e }) => e.classList.add(rb),
		hide: ({ owner: e }) => {
			e.classList.remove(rb), this.markActive(e, null);
			let t = e.querySelector(`.${cb}`);
			t !== null && (t.style.minHeight = "");
		},
		closesOnTab: !0,
		sheetOnPhone: ({ owner: e }) => Fb(e) === null
	});
	typeAhead = new $y();
	drawnKeys = /* @__PURE__ */ new WeakMap();
	validation;
	refusedEntries = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation;
		for (let e of this.root.querySelectorAll(`.${ri}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = /* @__PURE__ */ new Set();
			for (let n of e) ex(n, t);
			for (let e of t) this.sync(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: kb,
			childList: !0,
			characterData: !0,
			subtree: !0
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && (e.target.closest(`[${fb}], .${Sb}`) !== null || Yb(e.target)) && e.preventDefault();
		}, !0), window.addEventListener("input", (e) => this.handleEntryEdit(e), !0), window.addEventListener("compositionend", (e) => this.handleEntryEdit(e), !0), window.addEventListener("change", (e) => this.holdEntryDraft(e), !0), window.addEventListener("keydown", (e) => this.handleEntryEscape(e), !0), this.root.addEventListener("paste", (e) => this.handleEntryPaste(e), !0);
	}
	handleEntryEdit(e) {
		let t = this.holdEntryDraft(e);
		if (t === null || e.isComposing === !0) return;
		let { entry: n, select: r } = t;
		if (Ab(r)) return;
		this.releaseRefusal(r);
		let i = ol(n.value);
		i.tags.length > 0 ? this.enterTyped(r, n, i.tags, i.rest) : this.suggest(r, n);
	}
	holdEntryDraft(e) {
		let t = Lb(e);
		return t === null || this.root instanceof Node && !this.root.contains(t.select) ? null : (e.stopImmediatePropagation(), t);
	}
	handleEntryEscape(e) {
		let t = e instanceof KeyboardEvent && e.key === "Escape" && !e.defaultPrevented && !j(e) ? Lb(e) : null;
		t === null || this.openSelect !== t.select || t.select.getAttribute(Ob) !== "first-suggestion" || !Rb(t.select).some((e) => e.hasAttribute(hb)) || (e.preventDefault(), this.markActive(t.select, null));
	}
	handleEntryPaste(e) {
		let t = Lb(e), n = e.clipboardData?.getData("text") ?? "";
		if (t === null || Ab(t.select) || !il(n)) return;
		let { entry: r, select: i } = t, a = r.selectionStart ?? r.value.length, o = r.selectionEnd ?? a;
		e.preventDefault(), this.releaseRefusal(i), this.enterTyped(i, r, al(r.value.slice(0, a) + n + r.value.slice(o)), "");
	}
	enterTyped(e, t, n, r) {
		let i = Qc(e.getAttribute(Fr)), a = $c(e.getAttribute(Tb)), o = sl(i, n.map((t) => ({
			text: t,
			key: Xb(e, t) ?? t
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
		qy(t);
		let n = t.value.trim().length > 0, r = n ? Gb(e) : [], i = r.find((e) => e.getAttribute("aria-selected") !== "true") ?? null;
		this.openSelect === e ? r.length > 0 || !n ? this.popups.reposition(e) : this.close() : r.length > 0 && this.toggle(e, !0), this.openSelect === e && e.getAttribute(Ob) === "first-suggestion" && (this.markActive(e, i), i !== null && qb(e, i));
	}
	get openSelect() {
		return this.popups.current;
	}
	sync(e) {
		if (Bb(e), jb(e)) {
			this.syncMultiple(e);
			return;
		}
		let t = e.getAttribute(tb);
		this.decorateOptions(e);
		let n = t === null ? null : Rb(e).find((e) => e.getAttribute("data-ui-key") === t) ?? null, r = this.renderTriggerContent(e, n, t), i = e.querySelector(`.${ob}`);
		i !== null && (i.style.display = r ? "none" : "");
		for (let n of Rb(e)) n.setAttribute("aria-selected", t !== null && n.dataset.uiKey === t ? "true" : "false");
		let a = e.querySelector(`.${db}`);
		a !== null && a.value !== (t ?? "") && (a.value = t ?? ""), Xy(e);
	}
	syncMultiple(e) {
		let t = Qc(e.getAttribute(Fr)), n = new Set(t), r = el(t, $c(e.getAttribute(Tb)));
		this.decorateOptions(e, (e) => r && !n.has(e.dataset.uiKey ?? ""));
		let i = Rb(e), a = new Map(i.map((e) => [e.dataset.uiKey ?? "", e])), o = Pb(e), s = o === null ? t.filter((e) => a.has(e)) : t;
		Qb(e, s.map((e) => ({
			key: e,
			label: Zb(a.get(e) ?? null, e)
		}))), o !== null && o.readOnly !== Ab(e) && (o.readOnly = Ab(e));
		let c = e.querySelector(`.${ob}`);
		c !== null && (c.style.display = s.length > 0 ? "none" : "");
		for (let e of i) e.setAttribute("aria-selected", n.has(e.dataset.uiKey ?? "") ? "true" : "false");
		let l = e.querySelector(`.${db}`), u = JSON.stringify(t);
		l !== null && l.getAttribute("data-ui-selected-keys") !== u && l.setAttribute(Fr, u), Xy(e);
	}
	renderTriggerContent(e, t, n) {
		let r = e.querySelector(`.${$r}`);
		if (r === null) return t !== null;
		let i = r.querySelector(`:scope > .${ib}`), a = i?.getAttribute(ab) ?? null;
		if (i !== null && a !== null && (i.removeAttribute(ab), this.drawnKeys.set(e, a)), t === null) return i !== null && n !== null && Mb(e) && this.drawnKeys.get(e) === n ? !0 : (i?.remove(), this.drawnKeys.delete(e), !1);
		let o = t.getAttribute(y);
		if (o === null ? this.drawnKeys.delete(e) : this.drawnKeys.set(e, o), i !== null && o !== null && a === o) return !0;
		if (i === null) {
			i = document.createElement("span"), i.className = ib;
			let e = r.querySelector(`:scope > .${sb}`);
			e === null ? r.prepend(i) : e.after(i);
		}
		i.style.display = "inline-flex";
		let s = t.cloneNode(!0);
		return Hb(s), i.replaceChildren(...s.childNodes), !0;
	}
	decorateOptions(e, t = () => !1) {
		for (let n of Rb(e)) {
			n.hasAttribute("role") || n.setAttribute("role", "option");
			let e = k(n), r = e || t(n) ? "true" : "false";
			n.getAttribute("aria-disabled") !== r && n.setAttribute("aria-disabled", r), (e ? n.tabIndex !== -1 : !n.hasAttribute("tabindex")) && (n.tabIndex = -1);
		}
	}
	handlePointerMove(e) {
		let t = this.openSelect, n = t === null || !(e.target instanceof Element) ? null : e.target.closest(`.${ub}`);
		t === null || n === null || n.hasAttribute(hb) || k(n) || O(n) || n.closest(".ui-select") !== t || (Fb(t) === null && (N(Rb(t).filter((e) => !k(e)), n), cd(n)), this.markActive(t, n, !0));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Sb}`);
		if (t !== null) {
			let n = t.closest(`.${ri}`);
			n !== null && (e.preventDefault(), e.stopPropagation(), Ab(n) || this.removeChosen(n, t.closest(`.${bb}`)?.getAttribute(Cb) ?? null));
			return;
		}
		let n = e.target.closest(`[${fb}]`);
		if (n !== null) {
			let t = n.closest(`.${ri}`);
			t !== null && (e.preventDefault(), e.stopPropagation(), Ab(t) || (this.clearValue(t), Wb(t)));
			return;
		}
		let r = e.target.closest(`.${$r}`);
		if (r !== null) {
			let t = r.closest(`.${ri}`);
			if (Ab(t)) return;
			e.preventDefault();
			let n = t === null ? null : Pb(t);
			t !== null && n !== null ? this.pressEntryBox(t, n, e.target === n) : this.toggle(t);
			return;
		}
		let i = e.target.closest(`.${ub}`);
		if (i === null) return;
		let a = i.closest(`.${ri}`);
		a !== null && this.choose(a, i);
	}
	pressEntryBox(e, t, n) {
		document.activeElement !== t && t.focus(), !(Rb(e).length === 0 || n && this.openSelect === e) && this.toggle(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || j(e) || (this.openSelect !== null && Bb(this.openSelect), this.handleEntryKey(e) || this.handleChipKey(e)) || this.openSelect !== null && e.target instanceof Node && this.openSelect.contains(e.target) && this.handleOpenListKey(e, this.openSelect) || (e.key === "ArrowDown" || e.key === "ArrowUp") && M(e, { alt: e.key === "ArrowDown" }) && this.handleClosedArrow(e) || this.handleTypeAhead(e) || this.handleMultipleTriggerKey(e) || e.key !== "Enter" && e.key !== " " || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${ub}`) ?? this.markedOption(e);
		if (t === null) return;
		let n = t.closest(`.${ri}`);
		n !== null && (e.preventDefault(), this.choose(n, t));
	}
	handleOpenListKey(e, t) {
		if (e.key === "ArrowUp" && e.altKey && M(e, { alt: !0 })) {
			e.preventDefault();
			let n = zb(t);
			return n !== null && !jb(t) ? this.choose(t, n) : this.close(), !0;
		}
		return !_b.has(e.key) || !M(e) || (e.key === "Home" || e.key === "End") && Tc(e.target) ? !1 : (e.preventDefault(), this.moveCurrent(t, e.key), !0);
	}
	handleEntryKey(e) {
		let t = Lb(e);
		if (t === null) return !1;
		let { entry: n, select: r } = t;
		if (Ab(r)) return !1;
		switch (e.key) {
			case "ArrowLeft": return n.selectionStart === 0 && n.selectionEnd === 0 && this.focusChip(e, r, -1);
			case "ArrowDown":
			case "ArrowUp": return e.preventDefault(), this.openSelect === r ? this.moveCurrent(r, e.key) : this.openSuggestions(r, n, e.key === "ArrowDown"), !0;
			case "Enter": {
				let t = this.openSelect === r ? Gb(r).find((e) => e.hasAttribute(hb)) : void 0;
				return t === void 0 ? (e.preventDefault(), n.value.trim().length === 0 ? (this.pressEntryBox(r, n, !1), !0) : (this.releaseRefusal(r), this.enterTyped(r, n, al(n.value), ""), !0)) : (e.preventDefault(), this.choose(r, t), !0);
			}
			case ",": return e.preventDefault(), this.releaseRefusal(r), this.enterTyped(r, n, al(n.value), ""), !0;
			case "Backspace": {
				if (n.value.length > 0) return !1;
				let t = r.querySelectorAll(`.${yb} > .${bb}`);
				return t.length !== 0 && (e.preventDefault(), this.removeChosen(r, t[t.length - 1].getAttribute(Cb)), !0);
			}
			default: return !1;
		}
	}
	focusChip(e, t, n, r = null) {
		let i = Jb(t);
		if (i.length === 0) return !1;
		let a = i[(r === null ? i.length : i.findIndex((e) => e.contains(r))) + n]?.querySelector(`.${Sb}`) ?? (n === 1 ? Ib(t) : null);
		return e.preventDefault(), a === null || (a.focus(), a instanceof HTMLInputElement && a.setSelectionRange(0, 0), !0);
	}
	openSuggestions(e, t, n) {
		qy(t);
		let r = Gb(e), i = (n ? r[0] : r[r.length - 1]) ?? null;
		i !== null && this.toggle(e, !0, i);
	}
	handleChipKey(e) {
		let t = e.target instanceof HTMLElement && e.target.classList.contains(Sb) ? e.target : null, n = t?.closest(".ui-select") ?? null;
		if (t === null || n === null || !jb(n)) return !1;
		switch (e.key) {
			case "ArrowLeft": return this.focusChip(e, n, -1, t);
			case "ArrowRight": return this.focusChip(e, n, 1, t);
			case "Backspace":
			case "Delete": {
				if (e.preventDefault(), Ab(n)) return !0;
				let r = Jb(n), i = r.findIndex((e) => e.contains(t)), a = (r[i + 1] ?? r[i - 1])?.getAttribute(Cb) ?? null;
				this.removeChosen(n, r[i]?.getAttribute(Cb) ?? null);
				let o = a === null ? null : Jb(n).find((e) => e.getAttribute(Cb) === a) ?? null;
				return o !== null && o.querySelector(`.${Sb}`)?.focus(), !0;
			}
			default: return !1;
		}
	}
	handleClosedArrow(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || t === this.openSelect || Ab(t)) return !1;
		e.preventDefault();
		let n = Nb(t);
		n !== null && qy(n);
		let r = Gb(t), i = r.find((e) => e.getAttribute("aria-selected") === "true") ?? (e.key === "ArrowDown" ? r[0] : r[r.length - 1]) ?? null;
		return this.toggle(t, !1, i), !0;
	}
	handleTypeAhead(e) {
		let t = eb(e), n = e.target instanceof HTMLElement ? e.target : null;
		if (t === null || n === null || !(n.classList.contains("ui-select__trigger") || n.classList.contains(ub))) return !1;
		let r = n.closest(`.${ri}`), i = r !== null && r === this.openSelect;
		if (r === null || Ab(r) || !i && !n.classList.contains("ui-select__trigger")) return !1;
		let a = Nb(r);
		if (a !== null) return !i && (e.preventDefault(), this.typeIntoSearch(r, a, t), !0);
		e.preventDefault();
		let o = Gb(r), s = i ? o.find((e) => e === document.activeElement) ?? o.find((e) => e.hasAttribute(hb)) ?? null : o.find((e) => e.getAttribute("aria-selected") === "true") ?? null, c = this.typeAhead.next({
			owner: r,
			character: t,
			entries: o,
			current: s,
			words: (e) => Vb(e) ?? "",
			context: r
		});
		return c === null ? !0 : i ? (N(Rb(r).filter((e) => !k(e)), c), qb(r, c), R(c), this.markActive(r, c), !0) : (this.toggle(r, !1, c), !0);
	}
	typeIntoSearch(e, t, n) {
		this.toggle(e, !0), this.openSelect === e && (t.value = n, t.setSelectionRange(n.length, n.length), t.dispatchEvent(new Event("input", { bubbles: !0 })));
	}
	handleMultipleTriggerKey(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || !jb(t) || Ab(t)) return !1;
		switch (e.key) {
			case "Enter":
			case " ": return e.preventDefault(), this.toggle(t), !0;
			case "ArrowLeft": return this.focusChip(e, t, -1);
			case "Backspace": {
				let n = t.querySelectorAll(`.${yb} > .${bb}`);
				return n.length !== 0 && (e.preventDefault(), this.removeChosen(t, n[n.length - 1].getAttribute(Cb)), !0);
			}
			default: return !1;
		}
	}
	markedOption(e) {
		let t = this.openSelect;
		return e.key !== "Enter" || t === null || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(mb) || !t.contains(e.target) ? null : Gb(t).find((e) => e.hasAttribute(hb)) ?? null;
	}
	toggle(e, t = !1, n = null) {
		if (e === null) return;
		if (this.openSelect === e) {
			this.close();
			return;
		}
		this.close();
		let r = Fb(e), i = Pb(e);
		r !== null && !t && qy(r), Xy(e);
		let a = e.querySelector(`.${$r}`), o = e.querySelector(`.${cb}`), s = e.querySelector(`.${lb}`) ?? o, c = e.getAttribute(nb);
		if (a === null || o === null || s === null) return;
		let l = gi(s, "ui-select-list");
		if (i === null && a.setAttribute("aria-controls", l), r?.setAttribute("aria-controls", l), this.popups.open({
			owner: e,
			popup: o,
			anchor: a,
			placement: {
				placement: c !== null && Vf(c) ? c : "bottom-start",
				minAnchorWidth: !0
			},
			openers: i === null ? r === null ? [a] : [a, r] : [i],
			returnFocus: () => i ?? a
		})) {
			if (r === null) {
				this.initializeFocus(e, n);
				return;
			}
			i === null ? this.initializeSearch(e, r, n, t) : this.initializeEntry(e, n), tx(o);
		}
	}
	close() {
		this.popups.close();
	}
	initializeFocus(e, t) {
		let n = Gb(e);
		if (n.length === 0) return;
		let r = t ?? n.find((e) => e.getAttribute("aria-selected") === "true");
		if (r === void 0 && td()) {
			N(n, null), this.markActive(e, null), Wb(e);
			return;
		}
		let i = r ?? n[0];
		N(n, i), this.markActive(e, i, td()), qb(e, i), R(i);
	}
	initializeSearch(e, t, n, r) {
		let i = Rb(e), a = Gb(e), o = (r ? void 0 : n ?? a.find((e) => e.getAttribute("aria-selected") === "true")) ?? (r || td() ? null : a[0] ?? null);
		N(i, null), this.markActive(e, o, td()), o !== null && qb(e, o), !nd() && (R(t), t.select());
	}
	initializeEntry(e, t) {
		N(Rb(e), null), this.markActive(e, t), t !== null && qb(e, t);
	}
	moveCurrent(e, t) {
		let n = Rb(e).filter((e) => !k(e)), r = Tu(t, n, zb(e), "vertical");
		r !== null && (Fb(e) === null ? Uc(n, r) : qb(e, r), this.markActive(e, r));
	}
	markActive(e, t, n = !1) {
		for (let r of Rb(e)) r === t ? r.setAttribute(hb, "") : r.hasAttribute(hb) && r.removeAttribute(hb), rd(r, r === t && n);
		Bb(e);
		let r = Fb(e);
		r !== null && (t === null ? r.removeAttribute("aria-activedescendant") : r.setAttribute("aria-activedescendant", gi(t, "ui-select-option")));
	}
	choose(e, t) {
		let n = t.dataset.uiKey;
		if (n === void 0 || k(t) || Ab(e)) return;
		if (jb(e)) {
			let r = tl(Qc(e.getAttribute(Fr)), n, $c(e.getAttribute(Tb)));
			this.markActive(e, t, td()), r !== null && this.writeChosen(e, r);
			let i = Pb(e);
			i !== null && i.value.length > 0 && (i.value = "", this.releaseRefusal(e), this.suggest(e, i));
			return;
		}
		if (e.getAttribute(tb) === n) {
			this.close();
			return;
		}
		e.setAttribute(tb, n), this.sync(e);
		let r = e.querySelector(`.${db}`);
		r !== null && (r.value = n, r.dispatchEvent(new Event("change", { bubbles: !0 }))), this.close();
	}
	removeChosen(e, t) {
		let n = t === null ? null : nl(Qc(e.getAttribute(Fr)), t);
		if (n === null) return;
		let r = document.activeElement instanceof HTMLElement && document.activeElement.closest(`.${bb}`) !== null;
		this.writeChosen(e, n), (r || document.activeElement === document.body) && Ib(e)?.focus();
	}
	writeChosen(e, t) {
		t.length === 0 ? e.removeAttribute(Fr) : e.setAttribute(Fr, JSON.stringify(t)), this.sync(e), this.popups.reposition(e), e.querySelector(`.${db}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	clearValue(e) {
		if (jb(e)) {
			e.hasAttribute("data-ui-selected-keys") && this.writeChosen(e, []);
			return;
		}
		if (!e.hasAttribute(tb)) return;
		e.removeAttribute(tb), this.sync(e);
		let t = e.querySelector(`.${db}`);
		t !== null && (t.value = "", t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
};
function Wb(e) {
	let t = e.querySelector(`.${$r}`), n = Ib(e);
	t !== null && n !== null && !t.contains(document.activeElement) && R(n);
}
function Gb(e) {
	return Rb(e).filter((e) => Kb(e) && !k(e) && !O(e));
}
function Kb(e) {
	return e.style.display !== "none" && !e.classList.contains("ui-hidden");
}
function qb(e, t) {
	let n = e.querySelector(`.${lb}`);
	if (n === null) return;
	let r = n.getBoundingClientRect(), i = t.getBoundingClientRect(), a = getComputedStyle(n), o = r.top + (Number.parseFloat(a.borderTopWidth) || 0), s = o + (Number.parseFloat(a.paddingTop) || 0), c = o + n.clientHeight - (Number.parseFloat(a.paddingBottom) || 0);
	i.top < s ? n.scrollTop -= s - i.top : i.bottom > c && (n.scrollTop += i.bottom - c);
}
function Jb(e) {
	return [...e.querySelectorAll(`.${yb} > .${bb}`)];
}
function Yb(e) {
	let t = e.closest(".ui-select__trigger")?.closest(".ui-select") ?? null;
	return t !== null && Pb(t) !== null && !e.classList.contains(Db);
}
function Xb(e, t) {
	let n = t.trim().toLocaleLowerCase();
	for (let t of Rb(e)) {
		let e = t.dataset.uiKey;
		if (e !== void 0 && !k(t) && (e.toLocaleLowerCase() === n || Vb(t)?.trim().toLocaleLowerCase() === n)) return e;
	}
	return null;
}
function Zb(e, t) {
	let n = Vb(e)?.trim() ?? "";
	return n.length > 0 ? n : t;
}
function Qb(e, t) {
	let n = e.querySelector(`.${yb}`);
	if (n === null) return;
	n.hasAttribute(wb) !== t.length > 0 && n.toggleAttribute(wb, t.length > 0);
	let r = [...n.querySelectorAll(`:scope > .${bb}`)];
	if (!(r.length === t.length && r.every((e, n) => e.getAttribute(Cb) === t[n].key && e.querySelector(`.${xb}`)?.textContent === t[n].label))) {
		for (let e of r) e.remove();
		n.prepend(...t.map((e) => $b(e.key, e.label)));
	}
}
function $b(e, t) {
	let n = document.createElement("span"), r = document.createElement("span"), i = document.createElement("button");
	return n.className = bb, n.setAttribute(Cb, e), r.className = xb, r.textContent = t, i.className = Sb, i.type = "button", i.tabIndex = -1, D.write(i, "aria-label", "ui.select.remove", { label: t }), n.append(r, i), n;
}
function ex(e, t) {
	if (e.type === "childList") {
		for (let n of e.addedNodes) if (n instanceof HTMLElement) {
			n.classList.contains("ui-select") && t.add(n);
			for (let e of n.querySelectorAll(`.${ri}`)) t.add(e);
		}
	}
	if (e.type === "attributes" && (e.attributeName === tb || e.attributeName === "data-ui-selected-keys" || e.attributeName === Tb)) {
		e.target instanceof HTMLElement && e.target.classList.contains("ui-select") && t.add(e.target);
		return;
	}
	let n = (e.target instanceof HTMLElement ? e.target : e.target.parentElement)?.closest(`.${cb}`)?.closest(`.${ri}`);
	n != null && t.add(n);
}
function tx(e) {
	e.dataset.uiPlacement?.startsWith("top") === !0 && (e.style.minHeight = `${e.offsetHeight}px`);
}
//#endregion
//#region src/interactions/commit-gate.ts
var nx = class {
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
		!Tc(t) || !this.root.contains(t) || (this.field = t, this.committed = t.value);
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
}, rx = "textarea.ui-text-area__field", ix = "data-ui-text-area-grow";
function ax() {
	return typeof CSS < "u" && CSS.supports("field-sizing", "content");
}
var ox = class {
	root;
	widths = /* @__PURE__ */ new WeakMap();
	observer;
	constructor(e = {}) {
		this.root = e.root ?? document, this.observer = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null, this.root.addEventListener("input", (e) => {
			e.target instanceof HTMLTextAreaElement && e.target.matches(rx) && this.fit(e.target);
		}, !0), this.fitAll(this.root.querySelectorAll(rx)), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.fitAll(Qi(e.components, rx));
		}), B(this.root, rx, {
			childList: !0,
			attributeFilter: [ix]
		}, (e) => {
			this.fitAll(Qi(e, rx));
		});
	}
	fitAll(e) {
		for (let t of e) this.fit(t);
	}
	fit(e) {
		if (!e.hasAttribute(ix)) {
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
function sx(e) {
	let t = cx(e.getAttribute("min"), 0), n = cx(e.getAttribute("max"), 100), r = e.getAttribute("step");
	return {
		min: t,
		max: Math.max(t, n),
		step: r === "any" ? 0 : Math.max(0, cx(r, 1))
	};
}
function cx(e, t) {
	let n = e === null || e.trim().length === 0 ? NaN : Number(e);
	return Number.isFinite(n) ? n : t;
}
function lx(e, t, n, r) {
	let i = (n ? e.height : e.width) - r;
	if (i <= 0) return 0;
	let a = n ? e.top + e.height - t.y : t.x - e.left;
	return Math.min(1, Math.max(0, (a - r / 2) / i));
}
function ux(e, t) {
	return dx(t.min + e * (t.max - t.min), t);
}
function dx(e, t) {
	let n = Math.min(t.max, Math.max(t.min, e));
	if (t.step <= 0) return n;
	let r = Math.round((n - t.min) / t.step);
	return t.min + r * t.step > t.max && r--, fx(t.min + r * t.step, t);
}
function fx(e, t) {
	return Number(e.toFixed(Math.min(20, Math.max(px(t.step), px(t.min)))));
}
function px(e) {
	let t = String(e), n = t.indexOf("e-");
	if (n >= 0) return Number(t.slice(n + 2));
	let r = t.indexOf(".");
	return r < 0 ? 0 : t.length - r - 1;
}
function mx(e, t, n) {
	return t === n ? e < t ? "start" : e > t ? "end" : null : Math.abs(e - t) < Math.abs(e - n) ? "start" : "end";
}
function hx(e, t, n, r, i) {
	let a = Math.max(0, r);
	if (t === "start" ? e <= n - a : e >= n + a) return e;
	let o = t === "start" ? n - a : n + a;
	if (i.step <= 0) return gx(o, i);
	let s = (o - i.min) / i.step;
	return gx(fx(i.min + (t === "start" ? Math.floor(s + 1e-9) : Math.ceil(s - 1e-9)) * i.step, i), i);
}
function gx(e, t) {
	return Math.min(t.max, Math.max(t.min, e));
}
//#endregion
//#region src/interactions/range-value-engine.ts
var _x = "ui-slider__input", vx = "ui-slider__input--end", yx = "ui-slider__input--held", bx = "ui-slider__value", xx = "ui-slider__bubble", Sx = "ui-slider__track", Cx = "ui-slider__thumb-anchor", wx = "ui-slider", Tx = "ui-slider--range", Ex = "ui-orientation--vertical", Dx = "--ui-slider-fraction", Ox = "--ui-slider-end-fraction", kx = 6, Ax = "Value", jx = "EndValue", Mx = /* @__PURE__ */ new Set([
	"Value",
	"EndValue",
	"Min",
	"Max"
]), Nx = class {
	options;
	root;
	settled = /* @__PURE__ */ new WeakMap();
	pressedFrom = /* @__PURE__ */ new WeakMap();
	cancelled = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("pointerdown", (e) => {
			this.notePress(e.target), this.placeBubble(e.target);
		}, !0), this.root.addEventListener("pointercancel", (e) => this.takeBackPress(e.target), !0), (this.root === document ? window : this.root).addEventListener("change", (e) => this.refuseCancelledChange(e), !0), this.root.addEventListener("focusin", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusout", (e) => this.releaseBubble(e.target), !0), new _m({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${Tx} .${Sx}`),
			begin: (e, t) => this.beginBandDrag(e, t),
			move: (e, t, n) => this.moveBandDrag(e, n),
			end: (e, t) => this.endBandDrag(t),
			cancel: (e, t) => this.putBandBack(t),
			takenBack: (e, t) => this.putBandBack(t)
		}), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			if (Mx.has(e.propertyName)) for (let t of Qi(e.components, `.${_x}`)) this.settled.set(t, t.value), this.writeReadings(t), e.propertyName === (Fx(t) ? jx : Ax) && this.reportClamped(t, e.value);
		});
	}
	notePress(e) {
		let t = Px(e);
		t !== null && (this.cancelled.delete(t), this.pressedFrom.set(t, t.value));
	}
	takeBackPress(e) {
		let t = Px(e), n = t === null ? void 0 : this.pressedFrom.get(t);
		t !== null && n !== void 0 && (this.pressedFrom.delete(t), t.value !== n && (t.value = n, this.cancelled.add(t), this.settled.set(t, n), this.writeReadings(t)));
	}
	refuseCancelledChange(e) {
		let t = Px(e.target);
		t === null || !this.cancelled.has(t) || (this.cancelled.delete(t), e.stopImmediatePropagation());
	}
	reportClamped(e, t) {
		t == null || e.value === String(t) || Rx(e) || e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(_x)) return;
		let t = e.target;
		if (this.cancelled.delete(t), Rx(t)) {
			t.value = this.settled.get(t) ?? t.defaultValue;
			return;
		}
		let n = Ix(t);
		if (n !== null) {
			let e = Lx(t, Number(t.value), n);
			e !== t.value && (t.value = e, e === (this.settled.get(t) ?? t.defaultValue) && this.cancelled.add(t));
		}
		this.settled.set(t, t.value), this.writeReadings(t);
	}
	beginBandDrag(e, t) {
		let n = e.querySelector(`.${_x}:not(.${vx})`), r = e.querySelector(`.${vx}`);
		if (n === null || r === null) return null;
		let i = ux(lx(e.getBoundingClientRect(), t, zx(e), Bx(e)), sx(n)), a = mx(i, Number(n.value), Number(r.value));
		if (Rx(n)) return R(a === "end" ? r : n), null;
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
		let n = e.start.closest(`.${Sx}`);
		if (n === null) return;
		let r = ux(lx(n.getBoundingClientRect(), t, zx(n), Bx(n)), sx(e.start));
		if (e.held === null) {
			if (r === e.pressed) return;
			this.holdHandle(e, r < e.pressed ? "start" : "end", r);
			return;
		}
		this.moveHandle(e.held, r);
	}
	holdHandle(e, t, n) {
		let r = t === "start" ? e.start : e.end;
		e.held = r, r.classList.add(yx), R(r), this.moveHandle(r, n), this.placeBubble(r);
	}
	moveHandle(e, t) {
		let n = Ix(e), r = n === null ? String(t) : Lx(e, t, n);
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
		e.held?.classList.remove(yx), e.held !== null && this.writeReadings(e.held);
	}
	placeBubble(e) {
		let t = Vx(e);
		t !== null && Qf(t.anchor, t.bubble, {
			placement: t.vertical ? "left" : "top",
			gap: kx
		});
	}
	releaseBubble(e) {
		up(Vx(e)?.bubble);
	}
	writeReadings(e) {
		let t = Fx(e), n = e.closest(`.${Sx}`)?.parentElement ?? e.parentElement, r = t ? `.${bx}--end, .${xx}--end` : `.${bx}:not(.${bx}--end), .${xx}:not(.${xx}--end)`;
		for (let t of n?.querySelectorAll(r) ?? []) t.textContent = e.value;
		e.closest(`.${Sx}`)?.style.setProperty(t ? Ox : Dx, String(Hx(e))), e.matches(`:active, :focus-visible, .${yx}`) ? this.placeBubble(e) : this.releaseBubble(e);
	}
};
function Px(e) {
	return e instanceof HTMLInputElement && e.classList.contains(_x) ? e : null;
}
function Fx(e) {
	return e.classList.contains(vx);
}
function Ix(e) {
	return e.closest(`.${Tx} .${Sx}`)?.querySelector(Fx(e) ? `.${_x}:not(.${vx})` : `.${vx}`) ?? null;
}
function Lx(e, t, n) {
	let r = Number(e.closest(`.${wx}`)?.getAttribute("data-ui-slider-min-distance") ?? 0);
	return String(hx(t, Fx(e) ? "end" : "start", Number(n.value), Number.isFinite(r) ? r : 0, sx(e)));
}
function Rx(e) {
	return A(e) || O(e);
}
function zx(e) {
	return e.closest(`.${wx}`)?.classList.contains(Ex) === !0;
}
function Bx(e) {
	let t = e.querySelector(`.${Cx}`)?.getBoundingClientRect();
	return t === void 0 ? 0 : zx(e) ? t.height : t.width;
}
function Vx(e) {
	if (!(e instanceof Element) || !e.classList.contains(_x)) return null;
	let t = e.closest(`.${Sx}`), n = Fx(e), r = t?.querySelector(n ? `.${xx}--end` : `.${xx}:not(.${xx}--end)`) ?? null, i = t?.querySelector(n ? `.${Cx}--end` : `.${Cx}:not(.${Cx}--end)`) ?? null;
	return r === null || i === null ? null : {
		bubble: r,
		anchor: i,
		vertical: zx(e)
	};
}
function Hx(e) {
	let { min: t, max: n } = sx(e), r = Number(e.value);
	return !Number.isFinite(r) || n <= t ? 0 : Math.min(1, Math.max(0, (r - t) / (n - t)));
}
//#endregion
//#region src/rendering/number-format.ts
var Ux = {
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
}, Wx = [
	"(n)",
	"-n",
	"- n",
	"n-",
	"n -"
], Gx = [
	"$n",
	"n$",
	"$ n",
	"n $"
], Kx = [
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
], qx = [
	"n %",
	"n%",
	"%n",
	"% n"
], Jx = [
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
], Yx = /[1-9]/;
function Xx(e) {
	let t = e.closest("[data-ui-number-culture]")?.getAttribute("data-ui-number-culture") ?? null;
	if (t === null) return Ux;
	try {
		return {
			...Ux,
			...JSON.parse(t)
		};
	} catch {
		return Ux;
	}
}
function Zx(e, t, n) {
	if (!Number.isFinite(e)) return String(e);
	let r = $x(t);
	if (r === null) return eS(e, n);
	let i = Math.abs(e);
	switch (r.kind) {
		case "N": {
			let t = tS(i, 0, r.precision ?? n.decimalDigits, n.groupSizes, n.groupSeparator, n.decimalSeparator);
			return Qx(e, t) ? oS(Wx[n.negativePattern] ?? "-n", t, "", n.negativeSign) : t;
		}
		case "F": {
			let t = tS(i, 0, r.precision ?? n.decimalDigits, [], "", n.decimalSeparator);
			return Qx(e, t) ? n.negativeSign + t : t;
		}
		case "D": {
			let t = nS(i, 0, 0).integer.padStart(r.precision ?? 1, "0");
			return Qx(e, t) ? n.negativeSign + t : t;
		}
		case "C": {
			let t = tS(i, 0, r.precision ?? n.currencyDecimalDigits, n.currencyGroupSizes, n.currencyGroupSeparator, n.currencyDecimalSeparator);
			return oS(Qx(e, t) ? Kx[n.currencyNegativePattern] ?? "-$n" : Gx[n.currencyPositivePattern] ?? "$n", t, n.currencySymbol, n.negativeSign);
		}
		case "P": {
			let t = tS(i, 2, r.precision ?? n.percentDecimalDigits, n.percentGroupSizes, n.percentGroupSeparator, n.percentDecimalSeparator);
			return oS(Qx(e, t) ? Jx[n.percentNegativePattern] ?? "-n %" : qx[n.percentPositivePattern] ?? "n %", t, n.percentSymbol, n.negativeSign);
		}
		default: return eS(e, n);
	}
}
function Qx(e, t) {
	return e < 0 && Yx.test(t);
}
function $x(e) {
	if (e == null || e.trim().length === 0) return null;
	let t = /^([NFCPDnfcpd])(\d{0,2})$/.exec(e.trim());
	if (t === null) throw Error(`Number format '${e}' is outside the shared subset (N, F, C, P, D, with an optional precision).`);
	return {
		kind: t[1].toUpperCase(),
		precision: t[2].length === 0 ? null : Number(t[2])
	};
}
function eS(e, t) {
	let { integer: n, fraction: r } = rS(Math.abs(e), 0), i = r.length === 0 ? n : `${n}${t.decimalSeparator}${r}`;
	return e < 0 ? t.negativeSign + i : i;
}
function tS(e, t, n, r, i, a) {
	let { integer: o, fraction: s } = nS(e, t, n);
	return n === 0 ? aS(o, r, i) : `${aS(o, r, i)}${a}${s}`;
}
function nS(e, t, n) {
	let { integer: r, fraction: i } = rS(e, t), a = r + i.slice(0, n).padEnd(n, "0"), o = i.length > n && i[n] >= "5" ? iS(a) : a, s = o.length - n;
	return {
		integer: o.slice(0, s),
		fraction: o.slice(s)
	};
}
function rS(e, t) {
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
function iS(e) {
	let t = e.length - 1;
	for (; t >= 0 && e[t] === "9";) t--;
	let n = "0".repeat(e.length - 1 - t);
	return t < 0 ? `1${n}` : `${e.slice(0, t)}${String(Number(e[t]) + 1)}${n}`;
}
function aS(e, t, n) {
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
function oS(e, t, n, r) {
	let i = "";
	for (let a of e) i += a === "n" ? t : a === "$" || a === "%" ? n : a === "-" ? r : a;
	return i;
}
var sS = /^[\t\n\v\f\r ]*[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?[\t\n\v\f\r ]*$/;
function cS(e) {
	if (!sS.test(e)) return null;
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}
var lS = {
	readCulture: Xx,
	format: Zx,
	parseInvariant: cS
}, uS = /^-?(\d+(\.\d*)?|\.\d+)$/;
function dS(e, t, n) {
	if (!uS.test(e)) return e;
	let r = n.thousands ? t : _S(t), i = Number(e);
	if (n.format !== null && n.format.trim().length > 0) try {
		return Zx(i, n.format, r);
	} catch {}
	let a = e.includes(".") ? e.length - e.indexOf(".") - 1 : 0;
	return Zx(i, `${n.thousands ? "N" : "F"}${Math.min(a, 99)}`, r);
}
function fS(e, t, n) {
	return uS.test(e) ? (gS(n) ? vS(e, 2) : e).replace(".", t.decimalSeparator) : e;
}
function pS(e, t, n) {
	let r = e.trim();
	if (r.length === 0) return "";
	let i = !1;
	r.startsWith("(") && r.endsWith(")") && (i = !0, r = r.slice(1, -1));
	let a = gS(n) || t.percentSymbol.length > 0 && r.includes(t.percentSymbol);
	for (let e of [t.currencySymbol, t.percentSymbol]) r = e.length === 0 ? r : r.split(e).join("");
	for (let e of /* @__PURE__ */ new Set([
		t.negativeSign,
		"-",
		"−"
	])) e.length > 0 && r.includes(e) && (i = !0, r = r.split(e).join(""));
	let o = t.decimalSeparator, [s, ...c] = o.length === 0 ? [r] : r.split(o);
	if (c.length > 1) return null;
	let l = s.replace(/[\s  ]/g, "").split(t.groupSeparator).join("").split(t.currencyGroupSeparator).join(""), u = c.length === 0 ? null : c[0].replace(/[\s  ]/g, ""), d = u === null ? l : `${l}.${u}`;
	if (!uS.test(d)) return null;
	let f = a ? vS(d, -2) : d;
	return i && Number(f) !== 0 ? `-${f}` : f;
}
function mS(e, t, n, r, i) {
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
function hS(e) {
	return e.includes(".") ? e.replace(/0+$/, "").replace(/\.$/, "") : e;
}
function gS(e) {
	return /^\s*[pP]\d{0,2}\s*$/.test(e ?? "");
}
function _S(e) {
	return {
		...e,
		groupSeparator: "",
		currencyGroupSeparator: "",
		percentGroupSeparator: ""
	};
}
function vS(e, t) {
	let n = e.startsWith("-"), r = n ? e.slice(1) : e, i = r.indexOf("."), a = r.replace(".", ""), o = (i < 0 ? r.length : i) + t, s = a;
	o <= 0 && (s = "0".repeat(1 - o) + s, o = 1), o > s.length && (s += "0".repeat(o - s.length));
	let c = s.slice(0, o).replace(/^0+(?=\d)/, ""), l = s.slice(o).replace(/0+$/, ""), u = l.length === 0 ? c : `${c}.${l}`;
	return n ? `-${u}` : u;
}
//#endregion
//#region src/interactions/number-input-engine.ts
var yS = "ui-number-input", bS = "ui-number-input__field", xS = "data-ui-number-no-decimals", SS = "data-ui-number-no-negative", CS = "data-ui-number-no-thousands", wS = "data-ui-number-trim-zeros", TS = "data-ui-number-step", ES = "data-ui-number-min", DS = "data-ui-number-max", OS = "data-ui-number-step-direction", kS = /* @__PURE__ */ new Map([
	["ArrowUp", 1],
	["ArrowDown", -1],
	["PageUp", 10],
	["PageDown", -10]
]), AS = class {
	options;
	root;
	values = /* @__PURE__ */ new WeakMap();
	shown = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("focus", (e) => this.handleFocus(e), !0), this.root.addEventListener("blur", (e) => this.handleBlur(e), !0), this.root.addEventListener("click", (e) => this.handleStepClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleStepKey(e), !0), window.addEventListener("change", (e) => this.handleChangeCapture(e), !0), window.addEventListener("change", (e) => this.handleChangeDone(e)), this.showAtRest(this.root.querySelectorAll(`.${bS}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.showAtRest(Qi(e.components, `.${bS}`));
		}), D.onChange(() => this.showAtRest(this.root.querySelectorAll(`.${bS}`)));
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
		let t = jS(e);
		if (t !== null) return this.keptValue(t) ?? FS(t) ?? t.value.trim();
	}
	show(e) {
		let t = this.values.get(e) ?? e.value, n = e.hasAttribute(wS) ? hS(t) : t, r = Xx(e), i = e === document.activeElement ? fS(n, r, IS(e)) : PS(e, n, r);
		e.value = i, this.shown.set(e, i);
	}
	handleInput(e) {
		let t = jS(e.target);
		if (t === null) return;
		let n = !t.hasAttribute(xS), r = !t.hasAttribute(SS), i = t.selectionStart ?? t.value.length, a = mS(t.value, i, Xx(t), n, r);
		a.value !== t.value && (t.value = a.value, t.setSelectionRange(a.cursor, a.cursor));
	}
	handleFocus(e) {
		let t = jS(e.target);
		t !== null && (this.values.set(t, this.valueOf(t)), this.show(t));
	}
	handleBlur(e) {
		let t = jS(e.target);
		if (t === null) return;
		let n = this.showsOwnText(t) ? null : FS(t);
		if (n !== null && this.values.set(t, n), t.hasAttribute(wS) && !A(t) && !O(t)) {
			let e = this.values.get(t) ?? "", n = hS(e);
			n !== e && this.commit(t, n);
		}
		this.show(t);
	}
	handleChangeCapture(e) {
		let t = jS(e.target);
		if (t === null) return;
		let n = FS(t);
		n !== null && (this.values.set(t, n), t.value = n, this.shown.set(t, n));
	}
	handleChangeDone(e) {
		let t = jS(e.target);
		t !== null && t === document.activeElement && this.show(t);
	}
	commit(e, t) {
		this.values.set(e, t), e.value = fS(t, Xx(e), IS(e)), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleStepClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[" + OS + "]");
		if (t === null) return;
		let n = t.closest(".ui-number-input__row")?.querySelector(`.${bS}`) ?? null;
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t.getAttribute(OS) === "down" ? -1 : 1));
	}
	handleStepKey(e) {
		let t = kS.get(e.key);
		if (t === void 0 || !M(e, { shift: !0 }) || e.defaultPrevented) return;
		let n = jS(e.target);
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t));
	}
	step(e, t) {
		let n = Number(e.getAttribute(TS) ?? "1"), r = (Number(this.showsOwnText(e) ? this.valueOf(e) : FS(e) ?? "0") || 0) + n * t, i = e.getAttribute(ES), a = e.getAttribute(DS);
		i !== null && (r = Math.max(r, Number(i))), a !== null && (r = Math.min(r, Number(a))), this.commit(e, LS(r)), this.show(e);
	}
};
function jS(e) {
	return e instanceof HTMLInputElement && e.classList.contains(bS) ? e : null;
}
function MS(e, t) {
	let n = e.classList.contains(yS) ? e.querySelector(`.${bS}`) : null, r = n === null ? null : t(n);
	if (n === null || typeof r != "string" || r.trim().length === 0 || !Number.isFinite(Number(r))) return null;
	let i = NS(n, ES), a = NS(n, DS);
	return i !== null && Number(r) < Number(i) ? {
		key: "ui.value.min",
		args: { min: PS(n, i, Xx(n)) }
	} : a !== null && Number(r) > Number(a) ? {
		key: "ui.value.max",
		args: { max: PS(n, a, Xx(n)) }
	} : null;
}
function NS(e, t) {
	let n = e.getAttribute(t)?.trim() ?? "";
	return n.length > 0 && Number.isFinite(Number(n)) ? n : null;
}
function PS(e, t, n) {
	return dS(t, n, {
		format: IS(e),
		thousands: !e.hasAttribute(CS)
	});
}
function FS(e) {
	return pS(e.value, Xx(e), IS(e));
}
function IS(e) {
	return e.closest(`.${yS}`)?.getAttribute("data-ui-number-format") ?? null;
}
function LS(e) {
	return Number(e.toFixed(10)).toString();
}
//#endregion
//#region src/events/ahead-of-answer.ts
function RS(e, t) {
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
function zS(e) {
	switch (e.getAttribute(wt)) {
		case "windowed": return "windowed";
		case "virtualized": return "virtualized";
		default: return "plain";
	}
}
function BS(e) {
	let t = zS(e) === "windowed" ? VS(e, "data-ui-window-offset") ?? 0 : 0;
	return Number.isInteger(t) && t > 0 ? t : 0;
}
function VS(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.length === 0) return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
function HS(e, t) {
	return e.getAttribute(t)?.toLowerCase() === "true";
}
//#endregion
//#region src/interactions/item-drags.ts
var US = "application/x-ne-items", WS = null, GS = null;
function KS(e, t, n) {
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
function qS(e, t) {
	let n = wl(t);
	return n.includes(e) ? n.filter((t) => t === e || YS(t)) : [e];
}
function JS(e) {
	return !Qo(e, "data-ui-undraggable") && !k(e);
}
function YS(e) {
	return JS(e) && I(e) !== null;
}
function XS(e, t) {
	let n = e?.effects.has("copy") === !0, r = t || e?.effects.has("move") === !0;
	return n && r ? "copyMove" : n ? "copy" : "move";
}
function ZS(e, t, n = null) {
	WS = t, GS = t === null ? null : n, t !== null && e instanceof DragEvent && e.dataTransfer !== null && e.dataTransfer.setData(US, t.kind);
}
function QS(e) {
	return WS !== null && e.dataTransfer?.types.includes(US) === !0 ? WS : null;
}
function $S() {
	let e = GS;
	WS = null, GS = null, e?.();
}
//#endregion
//#region src/items/items-empty-renderer.ts
var eC = `:scope > [${gt}], :scope > [${_t}], :scope > [${kt}]`;
function H(e) {
	let t = new Set(e.querySelectorAll(eC));
	return [...e.children].filter((e) => !t.has(e));
}
function tC(e) {
	return e === null ? [] : [e];
}
function nC(e) {
	return e.querySelector(`:scope > [${gt}]`);
}
function rC(e, t, n, r, i) {
	i ??= H(e).some((e) => !e.classList.contains(Kr));
	let a = nC(e);
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
	c.setAttribute(gt, ""), c.appendChild(s), e.appendChild(c);
}
//#endregion
//#region src/items/binding-template-evaluator.ts
var iC = { ok: !1 }, aC = {
	ok: !0,
	value: null
}, oC = null;
function sC(e) {
	oC = e;
}
function cC(e, t, n) {
	let r = e.length === 0 ? void 0 : e[e.length - 1].item, i = t ?? "";
	if (i.length === 0 || i === ".") return {
		ok: !0,
		value: r,
		scope: r
	};
	let a = (n ?? []).filter((e) => bi(e.kind) !== "Scope"), o = -1;
	for (let e = 0; e < a.length; e++) bi(a[e].kind) === "Dynamic" && (o = e);
	let s = r, c = r, l = !0, u = 0, d = 0, f = !0;
	for (; d < i.length;) {
		let t = i[d];
		if (t === ".") {
			if (f) return iC;
			f = !0, d++;
			continue;
		}
		if (t === "[") {
			if (d + 1 >= i.length || i[d + 1] !== "]" || u >= a.length) return iC;
			let t = a[u];
			if (u++, bi(t.kind) === "Dynamic") {
				let n = fC(e, t.componentId);
				if (!n.ok) return iC;
				s = n.value, c = n.value, l = !0;
			} else {
				if (!l) return iC;
				let e = yC(s, t.value);
				if (!e.ok) return iC;
				s = e.value;
			}
			d += 2, f = !1;
			continue;
		}
		let n = d;
		for (; d < i.length && i[d] !== "." && i[d] !== "[";) d++;
		if (d === n) return iC;
		if (l) {
			let e = hC(s, i.slice(n, d), u > o);
			e.ok ? s = e.value : l = !1;
		}
		f = !1;
	}
	return f || u !== a.length || !l ? iC : {
		ok: !0,
		value: s,
		scope: c
	};
}
function lC(e, t, n) {
	for (let r of t ?? []) {
		if (bi(r.kind) !== "Dynamic") continue;
		let t = T(r.componentId);
		if (t > 0 && !n.some((e) => e.scopeComponentId === t) && e.closest(`[data-ui-id="${t}"][data-ui-key]`) !== null) return !0;
	}
	return !1;
}
function uC(e) {
	let t = mC(e, "IsContent");
	return t.ok && t.value === !0;
}
var dC = /* @__PURE__ */ new Set();
function fC(e, t) {
	let n = T(t);
	if (n > 0) {
		for (let t = e.length - 1; t >= 0; t--) if (e[t].scopeComponentId === n) return {
			ok: !0,
			value: e[t].item
		};
	}
	return dC.has(n) || (dC.add(n), s("an item scope a binding parameter names is not on the stack; the binding resolves to nothing.", {
		targetId: n,
		stack: e
	})), iC;
}
function pC(e, t) {
	let n = e;
	for (let e of t.split(".")) {
		let t = mC(n, e);
		if (!t.ok) return;
		n = t.value;
	}
	return n;
}
function mC(e, t) {
	return hC(e, t, !0);
}
function hC(e, t, n) {
	if (e == null) return iC;
	if (t === ".") return {
		ok: !0,
		value: e
	};
	if (typeof e != "object") return iC;
	let r = e, i = gC(r, t);
	return Object.hasOwn(r, i) ? {
		ok: !0,
		value: r[i]
	} : Array.isArray(e) ? iC : (n && oC?.(r, t), aC);
}
function gC(e, t) {
	if (Object.hasOwn(e, t)) return t;
	let n = _C(t);
	if (Object.hasOwn(e, n)) return n;
	let r = null;
	for (let n in e) if (!(n.length !== t.length || !Object.hasOwn(e, n)) && (r ??= t.toLowerCase(), n.toLowerCase() === r)) return n;
	return n;
}
function _C(e) {
	let t = e.charAt(0);
	return t === t.toLowerCase() ? e : t.toLowerCase() + e.slice(1);
}
function vC(e) {
	let t = e.itemTemplate;
	if (t == null) return null;
	let n = (e.itemTemplateParameters ?? []).filter((e) => bi(e.kind) !== "Scope"), r = [], i = [], a = !1, o = 0, s = 0, c = 0;
	for (; c < t.length;) {
		let e = t[c];
		if (e === ".") {
			c++;
			continue;
		}
		if (e === "[") {
			if (c + 1 >= t.length || t[c + 1] !== "]" || s >= n.length) return null;
			let e = n[s];
			if (s++, c += 2, bi(e.kind) !== "Dynamic") {
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
function yC(e, t) {
	if (e == null || t == null) return iC;
	if (typeof t == "number") return Array.isArray(e) && t >= 0 && t < e.length ? {
		ok: !0,
		value: e[t]
	} : iC;
	if (typeof t != "string") return iC;
	if (!Array.isArray(e) && typeof e == "object") {
		let n = e;
		if (Object.hasOwn(n, t)) return {
			ok: !0,
			value: n[t]
		};
	}
	if (Array.isArray(e)) {
		for (let n of e) if (xC(n, t)) return {
			ok: !0,
			value: n
		};
	}
	return iC;
}
function bC(e, t, n) {
	if (e == null || t == null) return !1;
	if (Array.isArray(e)) {
		if (typeof t == "number") return t < 0 || t >= e.length ? !1 : (e[t] = n, !0);
		if (typeof t != "string") return !1;
		for (let r = 0; r < e.length; r++) if (xC(e[r], t)) return e[r] = n, !0;
		return !1;
	}
	if (typeof t != "string" || typeof e != "object") return !1;
	let r = e;
	return Object.hasOwn(r, t) ? (r[t] = n, !0) : !1;
}
function xC(e, t) {
	return typeof e == "object" && !!e && e.id === t;
}
//#endregion
//#region src/items/items-filter-sort.ts
function SC(e) {
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
function CC(e, t, n, r, i) {
	let a = n.getItemsFilterSortMetadata(t), o = SC(e);
	if (a === void 0 && o === null) {
		for (let t of H(e)) t.classList.remove(Kr);
		return;
	}
	for (let n of H(e)) {
		let e = r.getItemValue(n);
		if (e === void 0) {
			s("item value is unknown, leaving the item visible.", {
				componentId: t,
				item: n
			}), n.classList.remove(Kr);
			continue;
		}
		n.classList.toggle(Kr, !wC(a, e, i, o));
	}
}
function wC(e, t, n, r = null) {
	return (e?.filters ?? []).every((e) => kC(e, t, n)) && (r?.filters ?? []).every((e) => mf(pC(t, e.itemProperty), e.operator, e.value));
}
function TC(e, t, n = null) {
	return (e?.filters ?? []).some((e) => AC(e.source, e.activeOperator, e.activeValue, t)) || (n?.filters?.length ?? 0) > 0;
}
function EC(e, t, n = null) {
	let r = (e?.sorts ?? []).filter((e) => AC(e.source, e.activeOperator, e.activeValue, t)).sort((e, t) => e.priority - t.priority);
	return [...n?.sorts ?? [], ...r];
}
function DC(e, t, n) {
	return t.length === 0 ? [...e] : [...e].sort((e, r) => OC(n.getItemValue(e), n.getItemValue(r), t));
}
function OC(e, t, n) {
	for (let r of n) {
		let n = jC(hf(pC(e, r.itemProperty)), hf(pC(t, r.itemProperty)));
		if (n !== 0) return Ti(r.direction) === "Descending" ? -n : n;
	}
	return 0;
}
function kC(e, t, n) {
	if (!AC(e.source, e.activeOperator, e.activeValue, n)) return !0;
	let r = e.source !== null && e.source !== void 0 ? n.get(e.source, []) : e.value;
	return mf(pC(t, e.itemProperty), e.operator, r);
}
function AC(e, t, n, r) {
	return e == null || mf(r.get(e, []), t, n);
}
function jC(e, t) {
	if (e === t) return 0;
	let n = NC(e), r = NC(t);
	if (n !== r) return n - r;
	if (n === MC.Nothing) return 0;
	if (n === MC.Number) {
		let n = Number(e) - Number(t);
		return Number.isNaN(n) ? 0 : Math.sign(n);
	}
	return String(e).localeCompare(String(t));
}
var MC = {
	Nothing: 0,
	Number: 1,
	Text: 2
};
function NC(e) {
	return e == null ? MC.Nothing : typeof e == "number" ? Number.isNaN(e) ? MC.Nothing : MC.Number : typeof e == "string" && e.trim().length === 0 ? MC.Nothing : Number.isNaN(Number(e)) ? MC.Text : MC.Number;
}
//#endregion
//#region src/items/items-source-order.ts
var PC = /* @__PURE__ */ new WeakMap();
function FC(e, t) {
	let n = PC.get(e), r = n === void 0 ? [...t] : IC(n, t);
	return PC.set(e, r), r;
}
function IC(e, t) {
	let n = new Set(t), r = e.filter((e) => n.has(e));
	return r.length === t.length ? r : [...t];
}
function LC(e, t, n) {
	let r = n === null || n > e.length ? e.length : n;
	return e.splice(r, 0, t), e[r + 1] ?? null;
}
function RC(e, t) {
	let n = e.indexOf(t);
	n >= 0 && e.splice(n, 1);
}
function zC(e, t, n) {
	return RC(e, t), LC(e, t, n);
}
function BC(e, t, n) {
	let r = e.indexOf(t);
	r >= 0 && (e[r] = n);
}
function VC(e) {
	PC.delete(e);
}
//#endregion
//#region src/interactions/tab-rows.ts
var HC = "ui-tab-item";
function UC(e) {
	let t = e.parentElement;
	return t !== null && !t.hasAttribute("data-ui-items-host") && t.closest("[data-ui-items-host]") === t.parentElement ? t : e;
}
function WC(e) {
	return e instanceof HTMLElement && e.classList.contains("ui-tab-item") ? UC(e).parentElement : null;
}
function GC(e, t) {
	return Qo(UC(e), t);
}
//#endregion
//#region src/interactions/items-reorder-engine.ts
var KC = ".ui-items-view__item, .ui-table__row", qC = "ui-row--dragging", JC = "--ui-row-drop-offset", YC = "move", XC = ".ui-items-view--wrap", ZC = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight"
]);
function QC(e, t) {
	Au(e, YC, { index: t });
}
function $C(e) {
	return {
		name: YC,
		registration: {
			dynamicParameters: (e) => {
				let t = ew(e.domEvent);
				return t === null ? null : [...e.dynamicParameters, t];
			},
			...RS((t) => e === void 0 ? null : tw(e, t), (t) => "pending" in t ? e?.settle(t.pending) : e?.resort(t.strip))
		}
	};
}
function ew(e) {
	let t = e instanceof CustomEvent ? e.detail?.index : void 0;
	return typeof t == "number" ? t : null;
}
function tw(e, t) {
	let n = ew(t);
	if (n === null || !(t.target instanceof Element)) return null;
	let r = WC(t.target);
	if (r !== null) return { strip: r };
	let i = t.target.closest(KC), a = i?.parentElement ?? null, o = i === null || a === null || !a.hasAttribute("data-ui-items-host") ? null : e.ahead(a, L(i), n);
	return o === null ? null : { pending: o };
}
var nw = class {
	root;
	services;
	drag = null;
	lifted = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.services = e.services, this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("pointerup", () => this.release(), !0), this.root.addEventListener("pointercancel", () => this.release(), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", () => this.endDrag(), !0);
	}
	handlePointerDown(e) {
		if (this.release(), !(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = this.liftableRow(e.target), n = t === null ? null : I(t.row);
		if (t === null || n === null) return;
		let r = sw(t.root, t.row);
		if (r === null ? !cw(e.target, t.row) : !r.contains(e.target)) return;
		r !== null && (iu(t.root, mw(t.row.parentElement ?? t.root), t.row), t.root.focus({ preventScroll: !0 }));
		let i = document.getSelection();
		i !== null && !i.isCollapsed && i.removeAllRanges(), n.draggable || (n.draggable = !0, this.lifted = n);
	}
	release() {
		this.lifted !== null && this.drag === null && (this.lifted.draggable = !1, this.lifted = null);
	}
	liftableRow(e) {
		let t = e.closest(pl), n = t?.parentElement ?? null, r = n?.closest(F) ?? null;
		if (t === null || n === null || r === null || !t.matches(KC) || !n.hasAttribute("data-ui-items-host") || O(r) || !YS(t)) return null;
		let i = r.hasAttribute("data-ui-rows-draggable") && !this.isSorted(r, n);
		return i || r.hasAttribute("data-ui-drag-kind") ? {
			root: r,
			row: t,
			moves: i
		} : null;
	}
	isSorted(e, t) {
		let n = ea(e);
		return this.services === void 0 || n === null ? !1 : EC(this.services.metadata.getItemsFilterSortMetadata(n), this.services.state, SC(t)).length > 0;
	}
	handleDragStart(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.liftableRow(e.target), n = t?.row.parentElement ?? null, r = t === null ? null : I(t.row);
		if (t === null || n === null || r === null || e.target !== r) return;
		this.drag = {
			...t,
			host: n
		};
		let i = KS(t.root, n, qS(t.row, mw(n))), a = (i?.rows ?? []).filter((e) => e !== t.row).map((e) => I(e) ?? e);
		Nh(e, t.root, r, qC, L(t.row), a, XS(i, t.moves)), ZS(e, i, () => this.endDrag());
	}
	handleDragOver(e) {
		let t = this.ownDrag(e);
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let n = uw(t.root, t.host), r = mw(t.host), i = aw(t.host, e.target, e, n, r);
		e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), i === null || this.indexOf(t, i.anchor, i.side) === null ? hw(t.root, null) : hw(t.root, i, fw(r, i, n));
	}
	ownDrag(e) {
		let t = this.drag;
		return t !== null && t.moves && e.target instanceof Element && t.host.contains(e.target) ? t : null;
	}
	indexOf(e, t, n) {
		if (lw(t) !== lw(e.row)) return null;
		let r = rw(ow(e.host, this.services?.keysOf), L(e.row), L(t), n);
		return r === null ? null : r + BS(e.host);
	}
	handleDragLeave(e) {
		let t = this.drag;
		t !== null && e instanceof DragEvent && Ih(e, t.host) && hw(t.root, null);
	}
	handleDrop(e) {
		let t = this.ownDrag(e);
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		e.preventDefault();
		let n = aw(t.host, e.target, e, uw(t.root, t.host), mw(t.host)), r = n === null ? null : this.indexOf(t, n.anchor, n.side);
		this.endDrag(), r !== null && QC(t.row, r);
	}
	endDrag() {
		let e = this.drag;
		this.drag = null, this.release(), e !== null && (Ph(e.root, qC), hw(e.root, null));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !e.altKey || !M(e, { alt: !0 }) || !ZC.has(e.key) || !(e.target instanceof Element)) return;
		let t = Xl(e);
		if (t === null || !t.root.matches(".ui-items-view, .ui-table")) return;
		let n = Ml(t.root), r = n === null ? null : uw(t.root, n), i = e.key === "ArrowLeft" || e.key === "ArrowRight";
		if (n === null || r === null || i && !r.across) return;
		let a = mw(n), o = $l(a);
		if (o === null || this.liftableRow(o)?.moves !== !0) return;
		e.preventDefault();
		let s = e.key === "ArrowDown" || e.key === "ArrowRight", c = !i && t.root.matches(XC) ? Du(a, o, s) : a[a.indexOf(o) + (s ? 1 : -1)] ?? null, l = c === null ? null : this.indexOf({
			host: n,
			row: o
		}, c, s ? "after" : "before");
		l !== null && QC(o, l);
	}
};
function rw(e, t, n, r) {
	let i = e.indexOf(t);
	if (i < 0 || t === n) return null;
	let a = iw(e.filter((e) => e !== t), n, r);
	return a === i ? null : a;
}
function iw(e, t, n) {
	let r = e.indexOf(t);
	return r < 0 ? null : n === "before" ? r : r + 1;
}
function aw(e, t, n, r, i) {
	if (t.closest("[data-ui-group-header]")?.parentElement === e) return null;
	let a = t.closest(pl);
	for (; a !== null && a.parentElement !== e;) a = a.parentElement?.closest(pl) ?? null;
	if (a ??= pw(i, n), a === null) return null;
	let o = (I(a) ?? a).getBoundingClientRect();
	if ((r.across ? n.clientX < o.left + o.width / 2 : n.clientY < o.top + o.height / 2) === r.rightToLeft) return {
		anchor: a,
		side: "after"
	};
	let s = i[i.indexOf(a) - 1];
	return s !== void 0 && dw(s, a, r) ? {
		anchor: s,
		side: "after"
	} : {
		anchor: a,
		side: "before"
	};
}
function ow(e, t) {
	switch (zS(e)) {
		case "virtualized": return [...t?.(e) ?? H(e).map(L)];
		case "windowed": return H(e).map(L);
		default: return FC(e, H(e)).map(L);
	}
}
function sw(e, t) {
	let n = e.hasAttribute("data-ui-rows-drag-handle") ? t.querySelector(`:scope > .${_e}`) : null;
	return n !== null && n.getClientRects().length > 0 ? n : null;
}
function cw(e, t) {
	return zc(e, t) === null && e.closest("[data-ui-no-row-drag]") === null;
}
function lw(e) {
	return e.getAttribute("data-ui-group") ?? "";
}
function uw(e, t) {
	let n = e.matches(".ui-orientation--horizontal, .ui-items-view--wrap");
	return {
		across: n,
		rightToLeft: n && getComputedStyle(t).direction === "rtl"
	};
}
function dw(e, t, n) {
	if (lw(e) !== lw(t)) return !1;
	if (!n.across) return !0;
	let r = (I(e) ?? e).getBoundingClientRect(), i = (I(t) ?? t).getBoundingClientRect();
	return r.top < i.bottom && i.top < r.bottom;
}
function fw(e, t, n) {
	let r = t.side === "after" ? e[e.indexOf(t.anchor) + 1] : void 0;
	if (r === void 0 || !dw(t.anchor, r, n)) return -1;
	let i = (I(t.anchor) ?? t.anchor).getBoundingClientRect(), a = (I(r) ?? r).getBoundingClientRect(), o = n.across ? n.rightToLeft ? i.left - a.right : a.left - i.right : a.top - i.bottom;
	return Math.max(o, 0) / 2;
}
function pw(e, t) {
	let n = null, r = Infinity;
	for (let i of e) {
		let e = (I(i) ?? i).getBoundingClientRect(), a = Math.max(e.left - t.clientX, 0, t.clientX - e.right), o = Math.max(e.top - t.clientY, 0, t.clientY - e.bottom), s = a * a + o * o;
		s < r && (n = i, r = s);
	}
	return n;
}
function mw(e) {
	return H(e).filter((e) => e instanceof HTMLElement && e.matches(pl) && I(e) !== null);
}
function hw(e, t, n = 0) {
	let r = t === null ? null : I(t.anchor);
	for (let t of e.querySelectorAll(`[${ve}]`)) t !== r && (t.removeAttribute(ve), t.style.removeProperty(JC));
	if (r === null || t === null) return;
	r.getAttribute("data-ui-row-drop") !== t.side && r.setAttribute(ve, t.side);
	let i = `${n}px`;
	r.style.getPropertyValue(JC) !== i && r.style.setProperty(JC, i);
}
function gw(e) {
	e.classList.remove(qC), e.querySelector(`:scope > [${v}]`)?.classList.remove(qC);
}
//#endregion
//#region src/interactions/tree-drop.ts
var _w = "--ui-tree-drop-depth";
function vw(e) {
	return e.querySelector(`.${Vn}`);
}
function yw(e, t) {
	if (k(e)) return !1;
	let n = t?.getAttribute($n);
	return n === "true" || n !== "false" && e.hasAttribute("aria-expanded");
}
function bw(e, t) {
	let n = e.length === 0 ? null : t(e);
	return n === null || yw(n, vw(n));
}
function xw(e, t) {
	let n = vw(e);
	if (yw(e, n)) return L(e);
	let r = n?.getAttribute("data-ui-tree-parent") ?? "";
	return bw(r, t) ? r : null;
}
function Sw(e, t, n = "", r) {
	for (let n of e.querySelectorAll(`[${Hn}]`)) n !== t && (n.removeAttribute(Hn), n.style.removeProperty(_w));
	t !== null && (t.setAttribute(Hn, n), r === void 0 ? t.style.removeProperty(_w) : t.style.setProperty(_w, String(r)));
}
function Cw(e, t, n) {
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
function ww(e, t, n) {
	let r = e.find((e) => e.key === t);
	if (r === void 0) return null;
	let i = Tw(e, r, n);
	return i === null || !Ew(e, i.parent) ? null : i;
}
function Tw(e, t, n) {
	if (n === "in") {
		let n = Cw(e, t.key, !0);
		return n === null ? null : {
			parent: n,
			before: null
		};
	}
	if (n === "out") {
		let n = Cw(e, t.key, !1);
		return n === null ? null : {
			parent: n,
			before: Ow(e, n, t.parent, !1)
		};
	}
	let r = Dw(e, t.parent), i = r.findIndex((e) => e.key === t.key), a = n === "up" ? -1 : 1, o = i + a;
	for (; o >= 0 && o < r.length && r[o].shown === !1;) o += a;
	return o < 0 || o >= r.length ? null : {
		parent: t.parent,
		before: n === "up" ? r[o].key : r[o + 1]?.key ?? null
	};
}
function Ew(e, t) {
	return t.length === 0 || e.find((e) => e.key === t)?.takesDrop === !0;
}
function Dw(e, t) {
	return e.filter((e) => e.parent === t);
}
function Ow(e, t, n, r, i = /* @__PURE__ */ new Set()) {
	let a = Dw(e, t);
	for (let e = a.findIndex((e) => e.key === n) + 1; e > 0 && e < a.length; e++) if (!i.has(a[e].key) && (!r || a[e].shown !== !1)) return a[e].key;
	return null;
}
function kw(e, t, n) {
	let r = Dw(e, n.parent).map((e) => e.key), i = new Set(t), a = n.before !== null && i.has(n.before) ? Ow(e, n.parent, n.before, !1, i) : n.before, o = [], s = null;
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
var Aw = "drop:", jw = "ui-row--cut", Mw = {
	code: "KeyX",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
}, Nw = {
	code: "KeyC",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
}, Pw = {
	code: "KeyV",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
};
function Fw(e) {
	return {
		dynamicParameters: (e) => {
			let t = Iw(e.domEvent);
			return t === null ? null : [...e.dynamicParameters, JSON.stringify(t.drop)];
		},
		...RS((t) => Lw(e, t), (t) => e?.settle(t))
	};
}
function Iw(e) {
	let t = e instanceof CustomEvent ? e.detail : null;
	return t?.drop === void 0 ? null : t;
}
function Lw(e, t) {
	let n = Iw(t)?.transfer ?? null;
	return n === null || e === void 0 ? null : e.ahead(n.source, n.target, n.keys, n.index);
}
var Rw = class {
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
		let t = QS(e), n = e.target instanceof Element ? e.target : null, r = t === null || n === null ? null : this.targetOf(t, n);
		if (t === null || n === null || r === null) return null;
		let i = zw(t, r, Bw(e)), a = i === null ? null : this.landingOf(r, n, e);
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
		let r = e.matches(".ui-items-view, .ui-table") ? Ml(e) : null;
		if (r !== null) {
			let i = mw(r), a = uw(e, r), o = ow(r, this.options.keysOf), s = t !== null && n !== null ? aw(r, t, n, a, i) : Vw(i);
			return {
				index: ((s === null ? null : iw(o, L(s.anchor), s.side)) ?? o.length) + BS(r),
				folder: null,
				list: r,
				mark: () => s === null ? e.setAttribute(he, "") : hw(e, s, fw(i, s, a))
			};
		}
		if (e.classList.contains("ui-tree")) {
			let n = Hw(e, t ?? document.activeElement);
			if (n === null) return null;
			let r = n.length === 0 ? Ml(e) : Uw(e, n);
			return {
				index: null,
				folder: n,
				list: null,
				mark: () => Sw(e, r)
			};
		}
		return {
			index: null,
			folder: null,
			list: null,
			mark: () => {
				e.setAttribute(he, ""), Lh(e, !0);
			}
		};
	}
	unmark() {
		let e = this.marked;
		this.marked = null, e !== null && (e.removeAttribute(he), Lh(e, !1), e.matches(".ui-items-view, .ui-table") ? hw(e, null) : e.classList.contains("ui-tree") && Sw(e, null));
	}
	handleDragLeave(e) {
		this.marked !== null && e instanceof DragEvent && Ih(e, this.marked) && this.unmark();
	}
	handleDrop(e) {
		let t = e instanceof DragEvent ? this.dropOf(e) : null;
		t !== null && (e.preventDefault(), this.unmark(), $S(), this.drop(t.drag, t.target, t.effect, t.landing));
	}
	drop(e, t, n, r) {
		let i = n === "move" && r.list !== null && r.index !== null && e.root.matches(".ui-items-view, .ui-table") && t.getAttribute("data-ui-drag-kind") === e.kind && zS(e.host) === "plain" && zS(r.list) === "plain", a = {
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
		t.dispatchEvent(new CustomEvent(Aw + e.kind, {
			bubbles: !0,
			detail: a
		}));
	}
	endDrag() {
		this.unmark(), $S();
	}
	handleKeyDown(e) {
		if (!(!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element))) {
			if (e.key === "Escape") {
				this.clipboard !== null && !j(e) && (e.preventDefault(), this.letGo());
				return;
			}
			Ec(e.target) || (Ks(Pw, e) ? this.paste(e, e.target) : Ks(Mw, e) ? this.take(e, e.target, !0) : Ks(Nw, e) && this.take(e, e.target, !1));
		}
	}
	letGo() {
		for (let e of this.clipboard?.items.rows ?? []) (I(e) ?? e).classList.remove(jw);
		this.clipboard = null;
	}
	paste(e, t) {
		let n = this.clipboard, r = n === null ? null : this.targetOf(n.items, t), i = n === null || r === null ? null : zw(n.items, r, !n.cut), a = r === null || i === null ? null : this.landingOf(r, null, null);
		n !== null && r !== null && i !== null && a !== null && (e.preventDefault(), this.drop(n.items, r, i, a), n.cut && this.letGo());
	}
	take(e, t, n) {
		let r = document.getSelection();
		if (r !== null && !r.isCollapsed) return;
		let i = Yl(t), a = i === null ? null : Ml(i.root);
		if (i === null || a === null || O(i.root) || !i.root.hasAttribute("data-ui-drag-kind")) return;
		let o = mw(a), s = i.row ?? $l(o), c = s === null || !YS(s) ? null : KS(i.root, a, qS(s, o));
		if (!(c === null || !c.effects.has(n ? "move" : "copy")) && (e.preventDefault(), this.letGo(), this.clipboard = {
			items: c,
			cut: n
		}, n)) for (let e of c.rows) (I(e) ?? e).classList.add(jw);
	}
};
function zw(e, t, n) {
	let r = n || t.getAttribute("data-ui-drag-kind") !== e.kind ? "copy" : "move";
	return e.effects.has(r) ? r : n ? null : r === "move" ? "copy" : "move";
}
function Bw(e) {
	return Qs() ? e.altKey : e.ctrlKey;
}
function Vw(e) {
	let t = eu(e);
	return t === null ? null : {
		anchor: t,
		side: "after"
	};
}
function Hw(e, t) {
	let n = t?.closest(".ui-tree__row") ?? null;
	return n === null || n.closest(".ui-tree") !== e ? "" : xw(n, (t) => Uw(e, t));
}
function Uw(e, t) {
	return e.querySelector(`.${Bn}[${y}="${C(t)}"]`);
}
//#endregion
//#region src/interactions/temporal-range.ts
function Ww(e, t, n) {
	if (t === "start" || e.start === null) {
		let t = Jw(n, e.start ?? n);
		return {
			start: t,
			end: e.end !== null && e.end.getTime() < t.getTime() ? null : e.end,
			active: "end",
			complete: !1
		};
	}
	return n.getTime() < Yw(e.start).getTime() ? {
		start: Jw(n, e.start),
		end: null,
		active: "end",
		complete: !1
	} : {
		start: e.start,
		end: Jw(n, e.end ?? e.start),
		active: "end",
		complete: !0
	};
}
function Gw(e, t, n) {
	if (t === null || n === null) return !1;
	let r = Yw(e).getTime();
	return r > Yw(t).getTime() && r < Yw(n).getTime();
}
function Kw(e, t, n) {
	return !n && Gw(e, t.start, t.end);
}
function qw(e) {
	return e.start !== null && e.end !== null && e.end.getTime() < e.start.getTime() ? {
		start: e.end,
		end: e.start
	} : e;
}
function Jw(e, t) {
	return Ea(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function Yw(e) {
	return Ea(e.getFullYear(), e.getMonth(), e.getDate());
}
//#endregion
//#region src/interactions/temporal-dom.ts
var U = "ui-temporal-input", Xw = "ui-calendar", Zw = `.${U}, .${Xw}`, Qw = "ui-temporal-input__value-input", $w = "ui-temporal-input__end-value-input", eT = "data-ui-temporal-range", tT = "data-ui-temporal-end", nT = "data-ui-temporal-mode", rT = "data-ui-temporal-format", iT = "data-ui-temporal-default-format", aT = "data-ui-temporal-min", oT = "data-ui-temporal-max", sT = "data-ui-temporal-step", cT = "data-ui-temporal-step-unit", lT = "data-ui-temporal-marked-days", uT = "data-ui-temporal-marked-only", dT = "data-ui-temporal-page-culture", fT = "data-ui-temporal-months", pT = "data-ui-temporal-months-genitive", mT = "data-ui-temporal-months-short", hT = "data-ui-temporal-daynames", gT = "data-ui-temporal-weekdays", _T = "data-ui-temporal-first-day", vT = "data-ui-temporal-am", yT = "data-ui-temporal-pm", bT = /* @__PURE__ */ new Set([
	rT,
	iT,
	aT,
	oT,
	fT,
	vT,
	yT,
	lT,
	uT
]), xT = 2e3;
function ST(e) {
	let t = e.getAttribute(nT);
	return t === "time" || t === "date-time" ? t : "date";
}
function CT(e) {
	let t = e.getAttribute(rT);
	return t === null || t.trim().length === 0 ? e.getAttribute(iT) ?? "" : t;
}
function wT(e) {
	let t = e.getAttribute(cT), n = Math.max(1, Math.trunc(Number(e.getAttribute(sT))) || 1);
	return {
		unit: t === "hour" || t === "minute" || t === "second" ? t : "day",
		hour: t === "hour" ? n : 1,
		minute: t === "minute" ? n : 1,
		second: t === "second" ? n : 1
	};
}
function TT(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function ET(e, t) {
	return t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function DT(e, t, n) {
	let r = new Date(e);
	return t === "hour" ? r.setHours(n) : t === "minute" ? r.setMinutes(n) : r.setSeconds(n), r;
}
function OT(e) {
	return {
		monthNames: kT(e, fT),
		monthGenitiveNames: kT(e, pT),
		abbreviatedMonthNames: kT(e, mT),
		dayNames: kT(e, hT),
		abbreviatedDayNames: kT(e, gT),
		amDesignator: e.getAttribute(vT) ?? "AM",
		pmDesignator: e.getAttribute(yT) ?? "PM"
	};
}
function kT(e, t) {
	return (e.getAttribute(t) ?? "").split("|");
}
function AT(e, t) {
	e.hasAttribute(dT) && (PT(e, pT, t.monthGenitiveNames.join("|")), PT(e, mT, t.abbreviatedMonthNames.join("|")), PT(e, hT, t.dayNames.join("|")), PT(e, gT, t.abbreviatedDayNames.join("|")), PT(e, fT, t.monthNames.join("|")), PT(e, vT, t.amDesignator), PT(e, yT, t.pmDesignator), PT(e, iT, NT(ST(e), wT(e), t)));
}
function jT(e) {
	for (let t = 0; t < e.length;) {
		let n = ba(e, t);
		if (n === "h" || n === "hh") return !0;
		t += n?.length ?? 1;
	}
	return !1;
}
function MT(e, t, n) {
	if (!t) return String(e).padStart(2, "0");
	let r = e < 12 ? n.amDesignator : n.pmDesignator, i = String(Va(e));
	return r.length === 0 ? i : `${i} ${r}`;
}
function NT(e, t, n) {
	let r = t.unit === "second";
	return e === "date" ? n.date : e === "time" ? r ? n.longTime : n.shortTime : da(n, r);
}
function PT(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function FT(e) {
	return e.hasAttribute(eT);
}
function IT(e) {
	return e !== null && e.hasAttribute(tT);
}
function LT(e) {
	return W(e, !1);
}
function W(e, t) {
	let n = RT(e, t);
	return n === null ? null : XT(n.value, ST(e));
}
function RT(e, t) {
	return e.querySelector(`.${t ? $w : Qw}`);
}
function zT(e, t) {
	return XT(e.getAttribute(t) ?? "", ST(e));
}
function BT(e) {
	let t = zT(e, aT), n = zT(e, oT), r = (e.getAttribute(lT) ?? "").split(" ").filter((e) => e.length > 0);
	return {
		min: t === null ? null : ZT(t, "date"),
		max: n === null ? null : ZT(n, "date"),
		marked: new Set(r),
		markedOnly: e.hasAttribute(uT)
	};
}
function VT(e, t) {
	return (e.min === null || t >= e.min) && (e.max === null || t <= e.max) && (!e.markedOnly || e.marked.has(t));
}
function HT(e, t, n) {
	let r = RT(e, n);
	if (r === null) return;
	let i = t === null ? "" : ZT(t, ST(e));
	r.value !== i && (r.value = i, r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function UT(e, t) {
	let n = t.trim(), r = n.length === 0 ? null : Aa(n, CT(e), OT(e));
	return r === null ? n : ZT(Ta(r), ST(e));
}
function WT(e) {
	if (!FT(e)) return;
	let t = {
		start: W(e, !1),
		end: W(e, !0)
	}, n = qw(t);
	n !== t && (HT(e, n.start, !1), HT(e, n.end, !0));
}
function GT(e) {
	let t = zT(e, aT), n = zT(e, oT);
	if (t === null && n === null) return null;
	for (let r of FT(e) ? [!1, !0] : [!1]) {
		let i = W(e, r);
		if (i !== null && t !== null && i.getTime() < t.getTime()) return {
			key: "ui.value.before",
			args: { min: ha(t, CT(e), OT(e)) }
		};
		if (i !== null && n !== null && i.getTime() > n.getTime()) return {
			key: "ui.value.after",
			args: { max: ha(n, CT(e), OT(e)) }
		};
	}
	return null;
}
function KT(e) {
	return JT(e, qT(e, /* @__PURE__ */ new Date()));
}
function qT(e, t) {
	let n = zT(e, aT), r = zT(e, oT);
	return n !== null && t.getTime() < n.getTime() ? n : r !== null && t.getTime() > r.getTime() ? r : t;
}
function JT(e, t) {
	let n = wT(e), r = new Date(t);
	return r.setMilliseconds(0), r.setSeconds(n.unit === "second" ? Math.floor(r.getSeconds() / n.second) * n.second : 0), n.unit === "hour" ? r.setMinutes(0) : r.setMinutes(Math.floor(r.getMinutes() / n.minute) * n.minute), r.setHours(Math.floor(r.getHours() / n.hour) * n.hour), r;
}
var YT = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/;
function XT(e, t) {
	let n = e.trim();
	if (n.length === 0) return null;
	if (t === "time") {
		let e = YT.exec(n);
		return e === null ? null : new Date(xT, 0, 1, Number(e[1]), Number(e[2]), Number(e[3] ?? "0"));
	}
	let r = wa(n);
	return r === null ? null : Ta(r);
}
function ZT(e, t) {
	let n = `${QT(e.getHours())}:${QT(e.getMinutes())}:${QT(e.getSeconds())}`;
	if (t === "time") return n;
	let r = `${String(e.getFullYear()).padStart(4, "0")}-${QT(e.getMonth() + 1)}-${QT(e.getDate())}`;
	return t === "date" ? r : `${r}T${n}`;
}
function QT(e) {
	return String(e).padStart(2, "0");
}
//#endregion
//#region src/interactions/temporal-calendar.ts
var $T = "ui-temporal-input__day", eE = "ui-temporal-input__month", tE = 3, nE = "data-ui-temporal-nav", rE = "data-ui-temporal-day", iE = 366;
function aE(e) {
	let t = LT(e);
	return {
		view: kE(t ?? qT(e, /* @__PURE__ */ new Date())),
		pane: "days",
		focusedDay: t,
		activeEnd: "start",
		hoverDay: null,
		choosingEnd: !1
	};
}
function oE(e, t, n, r) {
	let i = OE("div", `${U}__calendar`), a = OE("div", `${U}__calendar-header`), o = BT(e), s = DE("previous", "‹", D.text("ui.picker.previous"));
	s.disabled = sE(o, t, -1) === null, a.append(s);
	let c = DE("pane", t.pane === "days" ? `${n.monthNames[t.view.getMonth()]} ${t.view.getFullYear()}` : String(t.view.getFullYear()));
	c.classList.add(`${U}__calendar-label`), a.append(c);
	let l = DE("next", "›", D.text("ui.picker.next"));
	return l.disabled = sE(o, t, 1) === null, a.append(l), i.append(a), i.append(t.pane === "days" ? dE(e, t, n, r, o) : fE(t, n, o)), i;
}
function sE(e, t, n) {
	let r = t.pane === "months", i = ME(t.view, n * (r ? 12 : 1));
	return lE(e, cE(i, r ? 4 : 7)) ? uE(e, i) : null;
}
function cE(e, t) {
	return ZT(e, "date").slice(0, t);
}
function lE(e, t) {
	return (e.min === null || t >= e.min.slice(0, t.length)) && (e.max === null || t <= e.max.slice(0, t.length));
}
function uE(e, t) {
	let n = cE(t, 7), r = e.min !== null && n < e.min.slice(0, 7) ? e.min : e.max !== null && n > e.max.slice(0, 7) ? e.max : null, i = r === null ? null : XT(r, "date");
	return i === null ? t : kE(i);
}
function dE(e, t, n, r, i) {
	let a = wE(e), o = OE("div", `${U}__weekdays`);
	for (let e = 0; e < 7; e++) {
		let t = OE("span", `${U}__weekday`);
		t.textContent = n.abbreviatedDayNames[(a + e) % 7], o.append(t);
	}
	let s = OE("div", `${U}__days`), c = Yw(/* @__PURE__ */ new Date()), l = FT(e), u = l ? W(e, !1) : r, d = l ? W(e, !0) : null, f = AE(t.view, a);
	for (let e = 0; e < 42; e++) {
		let n = jE(f, e), r = ZT(n, "date"), a = OE("button", $T);
		a.type = "button", a.tabIndex = -1, a.textContent = String(n.getDate()), a.setAttribute(rE, r), n.getMonth() !== t.view.getMonth() && a.classList.add(`${$T}--outside`), NE(n, c) && (a.classList.add(`${$T}--today`), a.setAttribute("aria-current", "date")), i.marked.has(r) && a.classList.add(`${$T}--marked`);
		let o = u !== null && NE(n, u), p = d !== null && NE(n, d);
		a.setAttribute("aria-pressed", o || p ? "true" : "false"), (o || p) && a.classList.add(`${$T}--selected`), l && (o || p) && a.setAttribute("aria-description", D.text(o ? "ui.picker.start" : "ui.picker.end")), Kw(n, {
			start: u,
			end: d
		}, t.choosingEnd) && a.classList.add(`${$T}--within`), VT(i, r) || (a.disabled = !0), s.append(a);
	}
	let p = OE("div", `${U}__calendar-pane`);
	return p.append(o, s), p;
}
function fE(e, t, n) {
	let r = OE("div", `${U}__months`);
	for (let i = 0; i < 12; i++) {
		let a = OE("button", eE);
		a.type = "button", a.textContent = t.abbreviatedMonthNames[i], a.setAttribute(nE, `month:${i}`), i === e.view.getMonth() && (a.classList.add(`${eE}--selected`), a.setAttribute("aria-current", "true")), lE(n, cE(Ea(e.view.getFullYear(), i, 1), 7)) || (a.disabled = !0), r.append(a);
	}
	let i = [...r.children];
	return N(i, i.find((e) => e.getAttribute("aria-current") === "true" && !e.disabled) ?? i.find((e) => !e.disabled) ?? null), r;
}
function pE(e, t) {
	let n = [...e.parentElement?.querySelectorAll(".ui-temporal-input__month") ?? []], r = n.indexOf(e), i = r === -1 ? null : mE(t, r % tE);
	if (i === null) return null;
	for (let e = r + i.offset; e >= 0 && e < n.length; e += i.step) if (!n[e].disabled) return n[e];
	return null;
}
function mE(e, t) {
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
			offset: tE,
			step: tE
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
function hE(e) {
	let t = OE("div", `${U}__period-caption`);
	return t.textContent = D.text(e.activeEnd === "end" ? "ui.picker.end" : "ui.picker.start"), t;
}
function gE(e, t, n) {
	let r = BT(e);
	if (n.startsWith("month:")) {
		let i = Ea(t.view.getFullYear(), Number(n.slice(6)), 1);
		return lE(r, cE(i, 7)) && (t.view = i, t.pane = "days", t.focusedDay = xE(r, bE(i, t.focusedDay ?? LT(e) ?? qT(e, /* @__PURE__ */ new Date())))), !0;
	}
	switch (n) {
		case "previous": return t.view = sE(r, t, -1) ?? t.view, !0;
		case "next": return t.view = sE(r, t, 1) ?? t.view, !0;
		case "pane": return t.pane = t.pane === "days" ? "months" : "days", !0;
		default: return !1;
	}
}
function _E(e, t, n) {
	if (FT(e)) {
		vE(e, t, n);
		return;
	}
	let r = Jw(n, LT(e) ?? KT(e));
	t.focusedDay = r, t.view = kE(r), HT(e, r, !1);
}
function vE(e, t, n) {
	let r = Ww({
		start: W(e, !1),
		end: W(e, !0)
	}, t.activeEnd, Jw(n, KT(e)));
	t.focusedDay = r.end ?? r.start, t.view = kE(n), t.activeEnd = r.active, t.choosingEnd = !r.complete, t.hoverDay = null, HT(e, r.end, !0), HT(e, r.start, !1);
}
function yE(e, t, n, r = !1) {
	let i = SE(n), a = CE(t, n, wE(e), r);
	if (a === null) return null;
	let o = BT(e);
	if (i === 0) return xE(o, a);
	let s = a;
	for (let e = 0; e < iE; e++) {
		if (VT(o, ZT(s, "date"))) return s;
		s = jE(s, i);
	}
	return t;
}
function bE(e, t) {
	let n = Ea(e.getFullYear(), e.getMonth() + 1, 0).getDate();
	return Ea(e.getFullYear(), e.getMonth(), Math.min(t.getDate(), n), t.getHours(), t.getMinutes(), t.getSeconds());
}
function xE(e, t) {
	let n = ZT(t, "date"), r = e.min !== null && n < e.min ? e.min : e.max !== null && n > e.max ? e.max : null, i = r === null ? null : XT(r, "date");
	return i === null ? t : Jw(i, t);
}
function SE(e) {
	switch (e) {
		case "ArrowLeft": return -1;
		case "ArrowRight": return 1;
		case "ArrowUp": return -7;
		case "ArrowDown": return 7;
		default: return 0;
	}
}
function CE(e, t, n, r) {
	let i = (e.getDay() - n + 7) % 7;
	switch (t) {
		case "ArrowLeft": return jE(e, -1);
		case "ArrowRight": return jE(e, 1);
		case "ArrowUp": return jE(e, -7);
		case "ArrowDown": return jE(e, 7);
		case "PageUp": return ME(e, r ? -12 : -1);
		case "PageDown": return ME(e, r ? 12 : 1);
		case "Home": return jE(e, -i);
		case "End": return jE(e, 6 - i);
		default: return null;
	}
}
function wE(e) {
	let t = Number(e.getAttribute(_T));
	return Number.isInteger(t) && t >= 0 && t <= 6 ? t : 1;
}
function TE(e, t, n, r) {
	let i = [...e.querySelectorAll(`.${$T}`)];
	if (i.length === 0) return;
	let a = ZT(Yw(t.focusedDay ?? n ?? /* @__PURE__ */ new Date()), "date"), o = i.find((e) => e.getAttribute("data-ui-temporal-day") === a && !e.disabled) ?? i.find((e) => !e.disabled);
	o !== void 0 && (N(i, o), r && R(o));
}
function EE(e, t) {
	let n = t.activeEnd === "end" && t.hoverDay !== null ? W(e, !1) : null, r = t.hoverDay;
	for (let t of e.querySelectorAll(`.${$T}`)) {
		let e = XT(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		t.classList.toggle(`${$T}--preview`, e !== null && n !== null && r !== null && Gw(e, n, jE(r, 1)));
	}
}
function DE(e, t, n) {
	let r = OE("button", `${U}__nav`);
	return r.type = "button", r.textContent = t, r.setAttribute(nE, e), n !== void 0 && r.setAttribute("aria-label", n), r;
}
function OE(e, t) {
	let n = document.createElement(e);
	return n.className = t, n;
}
function kE(e) {
	return Ea(e.getFullYear(), e.getMonth(), 1);
}
function AE(e, t) {
	let n = kE(e);
	return jE(n, -((n.getDay() - t + 7) % 7));
}
function jE(e, t) {
	return Ea(e.getFullYear(), e.getMonth(), e.getDate() + t, e.getHours(), e.getMinutes(), e.getSeconds());
}
function ME(e, t) {
	let n = Ea(e.getFullYear(), e.getMonth() + t, 1), r = Ea(n.getFullYear(), n.getMonth() + 1, 0).getDate();
	return Ea(n.getFullYear(), n.getMonth(), Math.min(e.getDate(), r), e.getHours(), e.getMinutes(), e.getSeconds());
}
function NE(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
//#endregion
//#region src/interactions/temporal-picker-engine.ts
var PE = "ui-temporal-input__field", FE = "ui-temporal-input__popup", IE = "ui-temporal-input--open", LE = "ui-calendar__body", RE = "ui-temporal-input__time-cell", zE = "ui-temporal-input__time-column", BE = 140, VE = "data-ui-temporal-toggle", HE = "data-ui-temporal-unit", UE = "data-ui-temporal-cell", WE = "data-ui-temporal-centred", GE = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	written = /* @__PURE__ */ new WeakSet();
	drawnLanguage = document.documentElement.lang;
	popups = new $m({
		show: ({ owner: e, popup: t }) => {
			e.classList.add(IE), t.addEventListener("wheel", this.onColumnWheel, { passive: !1 }), this.renderSurface(e, !0);
		},
		hide: ({ owner: e, popup: t }) => {
			for (let e of this.columnSettles.values()) window.clearTimeout(e);
			this.columnSettles.clear(), this.wheelTurns.clear(), t.removeEventListener("wheel", this.onColumnWheel), e.classList.remove(IE);
		}
	});
	columnSettles = /* @__PURE__ */ new Map();
	wheelTurns = /* @__PURE__ */ new Map();
	onColumnWheel = (e) => this.handleColumnWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.arrive(this.root.querySelectorAll(Zw)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = Qi(e.components, Zw), n = e.propertyName === "Value" || e.propertyName === "EndValue";
			this.applyDisplay(t);
			for (let e of t) n && KE(e) && this.states.set(e, aE(e)), this.isShowing(e) && this.renderSurface(e);
		}), B(this.root, Zw, { attributeFilter: [...bT] }, (e) => {
			for (let t of e) this.applyDisplay([t]), this.isShowing(t) && this.renderSurface(t);
		}), B(this.root, Zw, { childList: !0 }, (e) => this.arrive(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), this.root.addEventListener("focusin", (e) => this.handleFieldFocus(e), !0), this.root.addEventListener("mouseover", (e) => this.handleDayHover(e), !0), this.root.addEventListener("mouseout", (e) => this.handleDayHover(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("scroll", (e) => this.handleColumnScroll(e), !0), this.root.addEventListener("blur", (e) => this.handleFieldBlur(e), !0), D.onChange(() => this.applyWords());
	}
	arrive(e) {
		let t = [...e];
		this.applyDisplay(t);
		for (let e of t) KE(e) && qE(e)?.firstElementChild === null && this.renderSurface(e);
	}
	applyWords() {
		let e = [...this.root.querySelectorAll(Zw)], t = D.temporal;
		if (t !== null && D.language !== this.drawnLanguage) {
			this.drawnLanguage = D.language;
			for (let n of e) AT(n, t);
		}
		this.applyDisplay(e);
		for (let t of e) this.isShowing(t) && this.renderSurface(t);
	}
	get openPicker() {
		return this.popups.current;
	}
	isShowing(e) {
		return e === this.openPicker || KE(e);
	}
	calendarFor(e) {
		if (!(e instanceof Element)) return null;
		let t = e.closest(`.${LE}`)?.closest(".ui-calendar") ?? null;
		if (t !== null) return t;
		let n = this.openPicker;
		return n !== null && qE(n)?.contains(e) === !0 ? n : null;
	}
	applyDisplay(e) {
		for (let t of e) {
			let e = Oa(CT(t), oD()), n = ya(CT(t)) ? "numeric" : "text";
			for (let r of t.querySelectorAll(`.${PE}`)) {
				if (r.placeholder !== e && (r.placeholder = e), r.inputMode !== n && (r.inputMode = n), r === document.activeElement && this.written.has(r)) continue;
				this.written.add(r);
				let i = RT(t, IT(r))?.value ?? "", a = XT(i, ST(t));
				if (a !== null) {
					r.value = ha(a, CT(t), OT(t));
					continue;
				}
				i.length === 0 && (r.value = "");
			}
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(PE)) return;
		let t = e.target.closest(`.${U}`), n = t === null ? null : RT(t, IT(e.target));
		if (t === null || n === null) return;
		let r = UT(t, e.target.value), i = XT(r, ST(t)), a = i === null ? r : ZT(i, ST(t));
		if (JE(t, a)) {
			let n = W(t, IT(e.target));
			e.target.value = n === null ? "" : ha(n, CT(t), OT(t));
			return;
		}
		IT(e.target) && (this.getState(t).choosingEnd = !1), n.value = a, n.dispatchEvent(new Event("change", { bubbles: !0 })), WT(t), this.applyDisplay([t]);
	}
	handleFieldFocus(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(PE)) return;
		let t = e.target.closest(`.${U}`);
		t !== null && FT(t) && (this.getState(t).activeEnd = IT(e.target) ? "end" : "start");
	}
	handleDayHover(e) {
		let t = this.calendarFor(e.target);
		if (t === null || !(e.target instanceof Element) || !FT(t)) return;
		let n = e.type === "mouseover" ? e.target.closest(`[${rE}]`) : null, r = this.getState(t), i = n === null ? null : XT(n.getAttribute("data-ui-temporal-day") ?? "", "date");
		(r.hoverDay?.getTime() ?? null) !== (i?.getTime() ?? null) && (r.hoverDay = i, EE(t, r));
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`[${rE}], .${RE}`) : null, n = this.calendarFor(t);
		n === null || t === null || t === document.activeElement || t.matches(":disabled") || (t.classList.contains(RE) ? lD(t) : this.followPointer(n, t));
	}
	followPointer(e, t) {
		let n = qE(e), r = XT(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		n === null || r === null || !n.contains(document.activeElement) || (this.getState(e).focusedDay = r, N([...n.querySelectorAll(`.${$T}`)], t), cd(t));
	}
	handleFieldBlur(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(PE)) return;
		let t = e.target.closest(`.${U}`);
		t !== null && this.applyDisplay([t]);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${VE}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${U}`));
			return;
		}
		let n = this.calendarFor(e.target);
		if (n === null) return;
		let r = e.target.closest(`[${nE}]`);
		if (r !== null) {
			e.preventDefault(), this.applyNavigation(n, r.getAttribute("data-ui-temporal-nav") ?? "");
			return;
		}
		let i = e.target.closest(`[${rE}]`);
		if (i !== null) {
			e.preventDefault(), this.chooseDay(n, i.getAttribute("data-ui-temporal-day") ?? "");
			return;
		}
		let a = e.target.closest(`[${UE}]`);
		if (a !== null) {
			e.preventDefault();
			let t = a.closest(`[${HE}]`)?.getAttribute(HE);
			t != null && this.chooseTime(n, t, Number(a.getAttribute(UE)));
		}
	}
	applyNavigation(e, t) {
		let n = this.getState(e);
		if (gE(e, n, t)) {
			this.renderSurface(e);
			return;
		}
		switch (t) {
			case "now":
				n.choosingEnd = !1, this.commit(e, KT(e), n.activeEnd === "end");
				return;
			case "clear":
				this.commit(e, null), FT(e) && this.commit(e, null, !0), n.activeEnd = "start", n.choosingEnd = !1, this.close();
				return;
			case "done":
				this.close();
				return;
			default: return;
		}
	}
	chooseDay(e, t) {
		let n = XT(t, "date");
		if (n === null || A(e) || O(e) || !VT(BT(e), t)) return;
		let r = this.getState(e);
		KE(e) && FT(e) && !r.choosingEnd && W(e, !1) !== null && W(e, !0) !== null && (r.activeEnd = "start");
		let i = RT(e, !1), a = `${i?.value ?? ""}|${RT(e, !0)?.value ?? ""}`;
		_E(e, r, n), KE(e) && `${i?.value ?? ""}|${RT(e, !0)?.value ?? ""}` === a && i?.dispatchEvent(new Event("change", { bubbles: !0 })), this.applyDisplay([e]), this.renderSurface(e);
	}
	chooseTime(e, t, n) {
		if (!Number.isFinite(n)) return;
		let r = FT(e) && this.getState(e).activeEnd === "end", i = DT(W(e, r) ?? KT(e), t, n);
		this.commit(e, i, r);
	}
	commit(e, t, n = !1) {
		HT(e, t, n), WT(e), this.applyDisplay([e]), this.isShowing(e) && this.renderSurface(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || j(e)) return;
		if (e.key === "ArrowDown" && M(e, { alt: !0 }) && e.target instanceof HTMLElement && e.target.classList.contains(PE)) {
			e.preventDefault(), this.toggle(e.target.closest(`.${U}`), IT(e.target) ? "end" : "start");
			return;
		}
		let t = this.calendarFor(e.target);
		if (t === null) return;
		if (e.target instanceof HTMLElement && e.target.classList.contains(RE)) {
			M(e) && dD(e);
			return;
		}
		if (e.target instanceof HTMLElement && e.target.classList.contains("ui-temporal-input__month")) {
			M(e) && uD(e, e.target);
			return;
		}
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains("ui-temporal-input__day") || !M(e, { shift: e.key === "PageUp" || e.key === "PageDown" })) return;
		let n = XT(e.target.getAttribute("data-ui-temporal-day") ?? "", "date");
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault(), this.chooseDay(t, ZT(n, "date"));
			return;
		}
		let r = yE(t, n, e.key, e.shiftKey);
		if (r === null) return;
		e.preventDefault();
		let i = this.getState(t);
		i.focusedDay = r, i.view = kE(r), this.renderSurface(t, !0);
	}
	handleColumnScroll(e) {
		if (this.openPicker === null || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${zE}`);
		t === null || !this.openPicker.contains(t) || (window.clearTimeout(this.columnSettles.get(t)), this.columnSettles.set(t, window.setTimeout(() => {
			this.columnSettles.delete(t), this.chooseCentredTime(t);
		}, BE)));
	}
	handleColumnWheel(e) {
		if (this.openPicker === null || e.deltaY === 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${zE}`), n = t?.getAttribute(HE) ?? null;
		if (t === null || n === null || !this.openPicker.contains(t)) return;
		e.preventDefault();
		let { steps: r, carried: i } = j_(this.wheelTurns.get(n) ?? 0, A_(e).y);
		if (this.wheelTurns.set(n, i), r === 0) return;
		let a = [...t.querySelectorAll(`.${RE}`)].filter((e) => !e.disabled), o = a.findIndex((e) => e.classList.contains(`${RE}--selected`)), s = a[Math.min(a.length - 1, Math.max(0, Math.max(0, o) + r))];
		s !== void 0 && !s.classList.contains(`${RE}--selected`) && this.chooseTime(this.openPicker, n, Number(s.getAttribute(UE)));
	}
	chooseCentredTime(e) {
		let t = this.openPicker;
		if (t === null || !t.contains(e)) return;
		let n = Number(e.getAttribute(WE));
		if (Number.isFinite(n) && Math.abs(e.scrollTop - n) <= 1) return;
		let r = e.getAttribute(HE), i = tD(e);
		if (!(r === null || i === null || i.classList.contains(`${RE}--selected`))) {
			if (i.matches(":disabled")) {
				$E(t);
				return;
			}
			this.chooseTime(t, r, Number(i.getAttribute(UE)));
		}
	}
	toggle(e, t) {
		let n = e?.querySelector(`.${FE}`) ?? null;
		if (e === null || n === null) return;
		if (this.openPicker === e) {
			this.close();
			return;
		}
		this.close();
		let r = this.getState(e);
		r.activeEnd = FT(e) ? t ?? (W(e, !1) === null ? "start" : W(e, !0) === null ? "end" : r.activeEnd) : "start", r.hoverDay = null, r.choosingEnd = !1;
		let i = W(e, r.activeEnd === "end") ?? LT(e);
		r.pane = "days", r.view = kE(i ?? qT(e, /* @__PURE__ */ new Date())), r.focusedDay = i;
		let a = e.querySelector(`[${VE}]`);
		this.popups.open({
			owner: e,
			popup: n,
			anchor: e.querySelector(".ui-temporal-input__row") ?? e,
			placement: { placement: "bottom-end" },
			openers: a === null ? [] : [a],
			returnFocus: () => cD(e, this.getState(e).activeEnd === "end")
		});
	}
	close() {
		this.popups.close();
	}
	getState(e) {
		let t = this.states.get(e);
		return t === void 0 && (t = aE(e), this.states.set(e, t)), t;
	}
	renderSurface(e, t = !1) {
		let n = qE(e);
		if (n === null) return;
		let r = KE(e), i = ST(e), a = this.getState(e), o = OT(e), s = FT(e), c = W(e, s && a.activeEnd === "end"), l = nD(n), u = rD(n), d = n.contains(document.activeElement);
		if (n.replaceChildren(), s && n.append(hE(a)), r) n.append(oE(e, a, o, c));
		else {
			let t = OE("div", `${U}__panes`);
			t.append(oE(e, a, o, c)), i === "date-time" && t.append(YE(e, c)), n.append(t, aD(i));
		}
		let f = u === null ? null : n.querySelector(`[${nE}="${C(u)}"]:not(:disabled)`);
		TE(n, a, c, t || d && l === null && f === null), EE(e, a), r || (QE(n), $E(n), iD(n, l)), f !== null && R(f), r || this.popups.reposition(e);
	}
};
function KE(e) {
	return e.classList.contains(Xw);
}
function qE(e) {
	return e.querySelector(`.${KE(e) ? LE : FE}`);
}
function JE(e, t) {
	let n = BT(e), r = n.markedOnly ? XT(t, ST(e)) : null;
	return r !== null && !n.marked.has(ZT(r, "date"));
}
function YE(e, t) {
	let n = wT(e), r = OE("div", `${U}__time`), i = OE("div", `${U}__time-columns`);
	for (let r of XE(n)) i.append(ZE(e, r, TT(n, r), t));
	return r.append(i), r;
}
function XE(e) {
	return e.unit === "second" ? [
		"hour",
		"minute",
		"second"
	] : e.unit === "hour" ? ["hour"] : ["hour", "minute"];
}
function ZE(e, t, n, r) {
	let i = OE("div", zE);
	i.setAttribute(HE, t), i.setAttribute("role", "listbox"), i.setAttribute("aria-label", D.text(t === "hour" ? "ui.picker.hours" : t === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"));
	let a = t === "hour" ? 24 : 60, o = r === null ? null : ET(r, t), s = t === "hour" && jT(CT(e)), c = OT(e), l = null;
	for (let u = 0; u < a; u += n) {
		let n = OE("button", RE);
		n.type = "button", n.tabIndex = -1, n.textContent = t === "hour" ? MT(u, s, c) : String(u).padStart(2, "0"), n.setAttribute(UE, String(u)), n.setAttribute("role", "option"), n.setAttribute("aria-selected", u === o ? "true" : "false"), u === o && n.classList.add(`${RE}--selected`), hD(e, t, u, r) ? n.disabled = !0 : (l === null || u === o) && (l = n), i.append(n);
	}
	return l !== null && (l.tabIndex = 0), i;
}
function QE(e) {
	let t = e.querySelector(`.${U}__calendar`), n = e.querySelector(`.${U}__time-columns`);
	t !== null && n !== null && (n.style.maxHeight = `${t.clientHeight}px`);
}
function $E(e) {
	for (let t of e.querySelectorAll(`.${zE}`)) {
		let e = t.querySelector(`.${RE}--selected`) ?? t.firstElementChild;
		if (!(e instanceof HTMLElement)) continue;
		let n = Math.max(0, (t.clientHeight - e.getBoundingClientRect().height) / 2);
		t.style.paddingTop = `${n}px`, t.style.paddingBottom = `${n}px`, eD(t, e), t.setAttribute(WE, String(t.scrollTop));
	}
}
function eD(e, t) {
	let n = t.getBoundingClientRect();
	e.scrollTop += n.top - e.getBoundingClientRect().top - (e.clientHeight - n.height) / 2;
}
function tD(e) {
	let t = e.getBoundingClientRect().top + e.clientHeight / 2, n = null, r = Infinity;
	for (let i of e.querySelectorAll(`.${RE}`)) {
		let e = i.getBoundingClientRect(), a = Math.abs(e.top + e.height / 2 - t);
		a < r && (r = a, n = i);
	}
	return n;
}
function nD(e) {
	let t = document.activeElement;
	return !(t instanceof HTMLElement) || !e.contains(t) || !t.classList.contains(RE) ? null : t.closest(`.${zE}`)?.getAttribute(HE) ?? null;
}
function rD(e) {
	let t = document.activeElement;
	return t instanceof HTMLElement && e.contains(t) ? t.getAttribute(nE) : null;
}
function iD(e, t) {
	if (t === null) return;
	let n = e.querySelector(`.${zE}[${HE}="${t}"]`)?.querySelector(`.${RE}--selected`) ?? null;
	n !== null && R(n);
}
function aD(e) {
	let t = OE("div", `${U}__popup-footer`);
	return t.append(DE("now", D.text(e === "date" ? "ui.picker.today" : "ui.picker.now"))), t.append(DE("clear", D.text("ui.picker.clear"))), t.append(DE("done", D.text("ui.picker.done"))), t;
}
function oD() {
	return {
		year: sD("ui.picker.letter.year", Da.year),
		month: sD("ui.picker.letter.month", Da.month),
		day: sD("ui.picker.letter.day", Da.day),
		hour: sD("ui.picker.letter.hour", Da.hour),
		minute: sD("ui.picker.letter.minute", Da.minute),
		second: sD("ui.picker.letter.second", Da.second)
	};
}
function sD(e, t) {
	let n = D.lookup(e);
	return n === void 0 || n.trim().length === 0 ? t : n;
}
function cD(e, t) {
	for (let n of e.querySelectorAll(`.${PE}`)) if (IT(n) === t) return n;
	return e.querySelector(`.${PE}`);
}
function lD(e) {
	let t = document.activeElement;
	t instanceof HTMLElement && t.classList.contains(RE) && cd(e);
}
function uD(e, t) {
	if (!Vc(e.key, "both")) return;
	e.preventDefault();
	let n = pE(t, e.key);
	Uc([...n?.parentElement?.children ?? []], n);
}
function dD(e) {
	let t = e.target, n = t.closest(`.${zE}`);
	if (n === null) return;
	let r = e.key === "ArrowLeft" || e.key === "ArrowRight" ? pD(n, e.key === "ArrowRight" ? 1 : -1) : fD(n, t, e.key);
	r !== null && (e.preventDefault(), r.focus({ preventScroll: !0 }), mD(r));
}
function fD(e, t, n) {
	let r = [...e.querySelectorAll(`.${RE}`)];
	return n === "PageUp" || n === "PageDown" ? Tu(n, r.filter(P), t, "vertical") ?? t : Bc({
		key: n,
		items: r,
		current: t,
		axis: "vertical",
		loop: !1
	});
}
function pD(e, t) {
	let n = [...e.parentElement?.querySelectorAll(`.${zE}`) ?? []], r = n[n.indexOf(e) + t];
	return r === void 0 ? null : r.querySelector(`.${RE}--selected`) ?? r.querySelector(`.${RE}:not(:disabled)`);
}
function mD(e) {
	let t = e.closest(`.${zE}`);
	t !== null && eD(t, e);
}
function hD(e, t, n, r) {
	let i = zT(e, aT), a = zT(e, oT);
	if (i === null && a === null) return !1;
	let o = DT(r ?? KT(e), t, n), s = new Date(o), c = new Date(o);
	return t === "hour" ? (s.setMinutes(0, 0, 0), c.setMinutes(59, 59, 999)) : t === "minute" && (s.setSeconds(0, 0), c.setSeconds(59, 999)), i !== null && c.getTime() < i.getTime() || a !== null && s.getTime() > a.getTime();
}
//#endregion
//#region src/interactions/theme-switcher-engine.ts
var gD = "[data-ui-theme-switcher]", _D = class {
	options;
	root;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e));
	}
	handleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(gD) : null;
		t === null || t.hasAttribute("disabled") || (e.preventDefault(), this.options.effects.apply({
			effect: {
				kind: vi.SetTheme,
				mode: vD() === "dark" ? "Light" : "Dark"
			},
			dom: this.options.dom
		}));
	}
};
function vD() {
	let e = document.documentElement.getAttribute(_r);
	return e === "light" || e === "dark" ? e : window.matchMedia?.("(prefers-color-scheme: dark)").matches === !0 ? "dark" : "light";
}
//#endregion
//#region src/interactions/popup-list.ts
var yD = new $y();
function bD(e, t, n, r, i = !1, a = !0) {
	let o = r ?? (a ? null : n.find(P) ?? null);
	o !== null && N(n, o);
	let s = e.open({
		...t,
		focus: a && r !== null ? r : !1
	});
	return s && a && r === null && Cd(t.popup, n, i), s;
}
function xD(e, t) {
	let n = e.target instanceof HTMLElement && t.includes(e.target) ? e.target : null, r = eb(e);
	if (r !== null) return e.preventDefault(), Uc(t, CD(t, n, r)), !0;
	if (!Vc(e.key, "vertical") || !M(e)) return !1;
	let i = Bc({
		key: e.key,
		items: t,
		current: n,
		axis: "vertical"
	});
	return i !== null && e.preventDefault(), Uc(t, i), !0;
}
var SD = {
	character: eb,
	entry: CD
};
function CD(e, t, n) {
	let r = e.filter(P), i = r[0]?.parentElement;
	return i == null ? null : yD.next({
		owner: i,
		character: n,
		entries: r,
		current: t,
		words: gm,
		context: i
	});
}
function wD(e, t) {
	e === document.activeElement || !P(e) || (N(t, e), cd(e));
}
//#endregion
//#region src/interactions/language-switcher-engine.ts
var TD = `[${xr}]`, ED = "ui-language-switcher__trigger", DD = "ui-language-switcher__label-text", OD = "ui-language-switcher__label-text--current", kD = "ui-language-switcher__label-text--page", AD = "ui-language-switcher__menu", jD = "ui-language-switcher__choice", MD = "ui-language-switcher--open", ND = "ui.language.switch", PD = "ui.language.current", FD = class {
	options;
	root;
	menus = new $m({
		show: ({ owner: e }) => e.classList.add(MD),
		hide: ({ owner: e }) => e.classList.remove(MD),
		closesWhenReadOnly: !1,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e)), D.onChange(() => this.showLanguage(D.language));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${jD}`), n = e.target.closest(TD);
		if (n === null) return;
		if (t !== null) {
			e.preventDefault(), this.choose(n, t.getAttribute(Sr));
			return;
		}
		let r = e.target.closest(`.${ED}`);
		if (r === null || O(r)) return;
		e.preventDefault();
		let i = ID(n);
		if (i.length === 2) {
			let e = D.requestedLanguage;
			this.choose(n, i.map((e) => e.getAttribute("data-ui-language")).find((t) => t !== e) ?? null);
			return;
		}
		this.menus.isOpen(n) ? this.menus.close(n) : i.length > 2 && this.openMenu(n, r);
	}
	handleKeyDown(e) {
		if (e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(TD);
		if (t === null) return;
		let n = ID(t), r = e.target.closest(`.${ED}`);
		if (r !== null && n.length > 2 && !this.menus.isOpen(t) && (e.key === "ArrowDown" || e.key === "ArrowUp") && M(e)) {
			e.preventDefault(), this.openMenu(t, r, e.key === "ArrowUp");
			return;
		}
		this.menus.isOpen(t) && xD(e, n);
	}
	handlePointerMove(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${jD}`), n = t?.closest(TD) ?? null;
		t !== null && n !== null && this.menus.isOpen(n) && wD(t, ID(n));
	}
	openMenu(e, t, n = !1) {
		let r = e.querySelector(`:scope > .${AD}`);
		if (r === null) return;
		let i = ID(e), a = i.find((e) => e.getAttribute("aria-checked") === "true") ?? null;
		bD(this.menus, {
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
				kind: vi.SetLanguage,
				language: t
			},
			dom: this.options.dom
		});
	}
	showLanguage(e) {
		for (let t of this.root.querySelectorAll(TD)) {
			let n = t.querySelector(`:scope > .${ED}`);
			if (n === null) continue;
			let r = ID(t);
			for (let t of r) t.setAttribute("aria-checked", t.getAttribute("data-ui-language") === e ? "true" : "false");
			for (let t of n.querySelectorAll(`.${DD}`)) {
				let n = t.getAttribute(Sr) === e;
				t.classList.toggle(OD, n), t.classList.contains(kD) && t.toggleAttribute("hidden", !n);
			}
			let i = t.getAttribute(Ie) === n.getAttribute("aria-label"), a = (r.find((t) => t.getAttribute("data-ui-language") !== e) ?? r[0]).getAttribute("data-ui-language") ?? "", [o, s] = r.length === 2 ? [ND, {
				language: LD(r, e),
				code: RD(e),
				other: LD(r, a),
				otherCode: RD(a)
			}] : [PD, {
				language: LD(r, e),
				code: RD(e)
			}];
			D.write(n, "aria-label", o, s), i && D.write(t, Ie, o, s);
		}
	}
};
function ID(e) {
	return [...e.querySelectorAll(`:scope > .${AD} > .${jD}`)];
}
function LD(e, t) {
	let n = e.find((e) => e.getAttribute(Sr) === t)?.textContent;
	if (n != null && n.length > 0) return n;
	try {
		let e = new Intl.DisplayNames([t], { type: "language" }).of(t) ?? t;
		return e.charAt(0).toLocaleUpperCase(t) + e.slice(1);
	} catch {
		return RD(t);
	}
}
function RD(e) {
	return e.split("-")[0].toUpperCase();
}
//#endregion
//#region src/interactions/action-bar.ts
var zD = `${Ae}__button`, BD = `${Ae}__more`, VD = `${zD}--icon`, HD = "ui-text__icon", UD = `.ui-button__content .${HD}`, WD = ".ui-button__content .ui-text__title", GD = /* @__PURE__ */ new WeakMap();
function KD(e) {
	let t = [], n = !1;
	for (let r of e.querySelectorAll(bn)) qD(r, e) && (r.hasAttribute("data-ui-in-action-bar") && !r.matches(yn) ? t.push(r) : n = !0);
	return {
		entries: t,
		more: n
	};
}
function qD(e, t) {
	for (let n = e; n !== null && n !== t; n = n.parentElement) if (!n.hasAttribute("data-ui-menu-left-out") && getComputedStyle(n).display === "none") return !1;
	return getComputedStyle(e).visibility !== "hidden";
}
function JD(e, t) {
	let n = t.entries.map((e) => YD(e, t));
	return t.more && t.openMore !== void 0 && n.push(ZD(t.openMore)), e.replaceChildren(...n), n;
}
function YD(e, t) {
	let n = QD(zD), r = eO(e), i = XD(e);
	return i === null ? n.textContent = r : (n.classList.add(VD), n.append(i), n.setAttribute("aria-label", r)), t.role === "menuitem" && n.setAttribute("role", "menuitem"), O(e) && (n.classList.add(Ur), n.setAttribute("aria-disabled", "true")), e.getAttribute("data-ui-menu-item-kind") === "check" && n.setAttribute("aria-pressed", e.getAttribute("aria-checked") === "true" ? "true" : "false"), GD.set(n, e), n.addEventListener("click", () => t.press(e, n)), n;
}
function XD(e) {
	let t = e.querySelector(UD);
	if (t === null || !t.className.split(" ").some(c_)) return null;
	let n = document.createElement("span");
	n.className = t.className, n.classList.remove(HD), n.setAttribute(i_, ""), n.setAttribute("aria-hidden", "true");
	let r = t.style.getPropertyValue(a_);
	return r.length > 0 && n.style.setProperty(a_, r), n;
}
function ZD(e) {
	let t = QD(`${zD} ${BD}`);
	return t.setAttribute("aria-haspopup", "menu"), D.write(t, "aria-label", "ui.actionbar.more"), t.addEventListener("click", () => e(t)), t;
}
function QD(e) {
	let t = document.createElement("button");
	return t.setAttribute("type", "button"), t.className = `${e} ${ni}`, t.tabIndex = -1, t;
}
function $D(e) {
	return GD.get(e) ?? null;
}
function eO(e) {
	return e.querySelector(WD)?.textContent?.trim() ?? "";
}
//#endregion
//#region src/interactions/long-press.ts
var tO = 500, nO = 10, rO = /* @__PURE__ */ new WeakSet();
function iO(e) {
	return rO.has(e);
}
var aO = class {
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
			timer: setTimeout(() => this.fireHeld(), tO)
		};
	}
	handleMove(e) {
		let t = e, n = this.press, r = this.openedAt;
		r !== null && t.pointerId === r.pointerId && Math.hypot((t.clientX ?? r.x) - r.x, (t.clientY ?? r.y) - r.y) > nO && (this.slid = !0, (this.answered?.closest("[data-ui-splitting]") ?? null) !== null && this.leaveMenuToDrag()), n !== null && t.pointerId === n.pointerId && Math.hypot((t.clientX ?? n.x) - n.x, (t.clientY ?? n.y) - n.y) > nO && this.cancel();
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
		rO.add(t), e.target.dispatchEvent(t), this.answered = t.defaultPrevented ? e.target : null, this.openedAt = this.answered === null ? null : {
			pointerId: e.pointerId,
			x: e.x,
			y: e.y
		};
	}
	handleContextMenu(e) {
		if (!rO.has(e)) {
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
		!this.dragging || n === null || t.clientX === void 0 || t.clientY === void 0 || Math.hypot(t.clientX - n.x, t.clientY - n.y) > nO && this.leaveMenuToDrag();
	}
	endDrag() {
		this.dragging = !1;
	}
	handleClick(e) {
		let t = e.target instanceof Element ? e.target : null;
		this.answered === null || t === null || this.slid && t.closest("[data-ui-context-menu]") !== null || (this.answered = null, e.preventDefault(), e.stopImmediatePropagation());
	}
}, oO = [
	Nf("md"),
	Nf("xl"),
	Nf("xxl")
], sO = {
	md: Nf("md"),
	xl: Nf("xl"),
	xxl: Nf("xxl")
}, cO = Nf("md");
function lO(e, t) {
	return uO(e) && !(e.hasAttribute(sn(t)) && !fO(e, t) && dO(cO));
}
function uO(e) {
	let t = e.getAttribute(an);
	if (t === null) return !1;
	let n = sO[t];
	return n === void 0 || !dO(n);
}
function dO(e) {
	return typeof matchMedia == "function" && matchMedia(e).matches;
}
function fO(e, t) {
	return e.querySelector(`:scope > [${dn}="${C(t)}"][${cn}]`) !== null;
}
//#endregion
//#region src/state/client-store.ts
var pO = "ne.ui", mO = "boot", hO = /* @__PURE__ */ new Set(), gO = class {
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
		let r = this.resolveKey(e, mO);
		if (r !== null) try {
			let e = _O(window.localStorage.getItem(r));
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
			return hO.has(n) || (hO.add(n), l("client state is not kept for a component with no authored id.", {
				slot: t,
				component: e
			})), null;
		}
		return `${pO}:${n}:${t}`;
	}
};
function _O(e) {
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
var vO = "menu-current", yO = `[${Ut}]`;
function bO(e) {
	for (let t = e.closest(yO); t !== null; t = t.parentElement?.closest(yO) ?? null) SO(t);
}
function xO(e) {
	for (let t of e.querySelectorAll(yO)) SO(t);
	bO(e);
}
function SO(e) {
	let t = e.querySelector(`.${hn}`) !== null;
	e.hasAttribute("data-ui-menu-holds-current") !== t && e.toggleAttribute(Kt, t);
}
//#endregion
//#region src/updates/menu-icons.ts
var CO = "menu-icons", wO = "ui-menu__host", TO = `:scope > :not([${Jt}]) > .${x}[${oi}]`;
function EO(e) {
	let t = e.closest(`.${wO}`);
	t !== null && OO(t);
}
function DO(e) {
	for (let t of e.querySelectorAll(`.${wO}`)) OO(t);
}
function OO(e) {
	let t = e.querySelector(TO) !== null;
	e.hasAttribute("data-ui-menu-icons") !== t && e.toggleAttribute(qt, t);
}
//#endregion
//#region src/interactions/menu-group-engine.ts
var kO = "ui-menu__submenu", AO = Ut, jO = Gt, MO = "data-ui-menu-flyout", NO = `[${MO}], ${Yr}`, PO = "data-ui-menu-unfolded", FO = Wt, IO = "data-ui-menu-rail-list", LO = "left-side", RO = "[data-ui-root]", zO = "menu-open-group", BO = z.normal * 5, VO = Je("click"), HO = class {
	root;
	store = new gO();
	seenCollapsed = /* @__PURE__ */ new WeakMap();
	flyouts = new $m({
		show: ({ owner: e, popup: t }) => {
			e.setAttribute(jO, ""), t.setAttribute(MO, "");
		},
		hide: ({ owner: e, popup: t }) => {
			e.removeAttribute(jO), queueMicrotask(() => Af(t, BO, () => {
				this.flyouts.isOpen(e) || t.removeAttribute(MO);
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
		let t = this.root.querySelectorAll(`.${pn}`);
		qO(t), this.reconcileEach(t);
		for (let e of t) xO(e), DO(e);
		B(this.root, `.${pn}`, {
			childList: !0,
			attributeFilter: [Ht]
		}, (e) => {
			qO(e), this.reconcileEach(e);
			for (let t of e) xO(t), DO(t);
		});
		for (let e of this.root.querySelectorAll(`[${AO}]`)) UO(e);
		if (B(this.root, `[${AO}]`, {
			childList: !0,
			attributeFilter: [jO]
		}, (e) => {
			for (let t of e) UO(t);
		}), typeof matchMedia == "function") for (let e of oO) matchMedia(e).addEventListener("change", () => {
			this.closeBarFlyout(), this.refitDrawerRails();
		});
		B(this.root, RO, { attributeFilter: [sn(LO)] }, () => this.refitDrawerRails());
	}
	refitDrawerRails() {
		let e = this.root.querySelectorAll(`[${ln}] .${pn}`);
		qO(e), this.reconcileEach(e);
	}
	closeBarFlyout() {
		let e = this.flyouts.current;
		e !== null && e.closest("[data-ui-bottom-bar]") !== null && this.flyouts.close(e);
	}
	reconcileEach(e) {
		for (let t of e) {
			let e = $O(t), n = this.seenCollapsed.get(t);
			n !== e && (this.seenCollapsed.set(t, e), n === void 0 ? this.restore(t, e) : this.handleCollapsedChange(t, e));
		}
	}
	restore(e, t) {
		t ? this.closeGroups(e) : this.openResolvedGroup(e);
	}
	handleCollapsedChange(e, t) {
		this.flyouts.close(), WO(e), this.closeGroups(e), e.hasAttribute("data-ui-folding") && e.setAttribute(PO, ""), t || this.openResolvedGroup(e);
		for (let t of e.querySelectorAll(`[${AO}]`)) UO(t);
	}
	openResolvedGroup(e) {
		let t = this.groupOf(e.querySelector(`.${hn}`), e);
		if (t !== null && !t.hasAttribute(FO)) {
			this.openInline(t);
			return;
		}
		let n = e.classList.contains("ui-menu--nested") ? null : this.store.read(e, zO), r = n === null ? null : this.findGroup(e, n);
		r !== null && this.openInline(r);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${x}`), n = this.flyouts.current, r = n === null ? null : this.submenuOf(n);
		if (t !== null && r !== null && r.contains(t)) {
			JO(t) && this.flyouts.close();
			return;
		}
		let i = t === null ? null : this.ownGroupOf(t);
		if (t === null || i === null) {
			this.flyouts.close();
			return;
		}
		e.preventDefault();
		let a = i.closest(`.${pn}`);
		a !== null && (QO(i) ? this.toggleFlyout(a, i, t) : this.toggleInline(a, i));
	}
	toggleInline(e, t) {
		let n = e.classList.contains(_n);
		if (e.setAttribute(PO, ""), t.closest("[data-ui-menu-searching]") !== null) {
			t.toggleAttribute(jO);
			return;
		}
		if (t.hasAttribute(jO)) {
			t.removeAttribute(jO), n || this.store.write(e, zO, null);
			return;
		}
		this.closeGroups(e), this.openInline(t), n || this.store.write(e, zO, t.getAttribute(y));
	}
	openInline(e) {
		e.setAttribute(jO, "");
	}
	closeGroups(e) {
		for (let t of e.querySelectorAll(`[${AO}][${jO}]`)) t.hasAttribute(FO) || t.removeAttribute(jO);
	}
	toggleFlyout(e, t, n) {
		let r = this.submenuOf(t);
		if (r === null) return;
		let i = this.flyouts.isOpen(t);
		if (this.flyouts.close(), i) return;
		WO(e), this.closeGroups(e);
		let a = n.closest(NO) ?? void 0;
		if (!this.flyouts.open({
			owner: t,
			popup: r,
			anchor: n,
			placement: {
				placement: `${GO(e)}-start`,
				surface: a,
				alignEntries: !0
			}
		})) return;
		let o = r.querySelector(`:scope > .${pn}`);
		o !== null && !td() && Cd(o, YO(o));
	}
	findGroup(e, t) {
		for (let n of e.querySelectorAll(`[${AO}]`)) if (n.getAttribute("data-ui-key") === t) return n;
		return null;
	}
	ownGroupOf(e) {
		return e.matches(yn) ? e.parentElement : null;
	}
	groupOf(e, t) {
		let n = e?.closest(`[${AO}]`) ?? null;
		return n !== null && t.contains(n) ? n : null;
	}
	submenuOf(e) {
		return e.querySelector(`:scope > .${kO}`);
	}
};
function UO(e) {
	let t = e.querySelector(`:scope > .${x}`);
	t !== null && (t.setAttribute(VO, ""), t.setAttribute(Ye, ""), t.setAttribute("aria-expanded", e.hasAttribute(jO) ? "true" : "false"), QO(e) ? t.setAttribute("aria-haspopup", "menu") : t.removeAttribute("aria-haspopup"));
}
function WO(e) {
	for (let t of e.querySelectorAll(`[${MO}]`)) t.removeAttribute(MO);
}
function GO(e) {
	return KO(e) ? "top" : e.classList.contains("ui-side--right") ? "left" : e.classList.contains("ui-side--top") ? "bottom" : e.classList.contains("ui-side--bottom") ? "top" : "right";
}
function KO(e) {
	let t = e.closest(`[${cn}]`);
	return e.classList.contains("ui-menu--rail") && t?.parentElement !== null && t?.parentElement !== void 0 && typeof matchMedia == "function" && lO(t.parentElement, LO);
}
function qO(e) {
	for (let t of e) {
		let e = t.closest(`[${ln}]`);
		if (!t.classList.contains("ui-menu--rail") && !t.hasAttribute(IO) || e?.parentElement === null || e?.parentElement === void 0) continue;
		let n = typeof matchMedia == "function" && lO(e.parentElement, LO);
		t.classList.toggle(gn, !n), t.toggleAttribute(IO, n);
	}
}
function JO(e) {
	let t = e.closest(`.${x}`);
	return t !== null && t.matches(bn) && !t.matches(xn) && !O(t);
}
function YO(e) {
	let t = [];
	for (let n of ll(e)) {
		t.push(n);
		let e = n.matches(yn) ? n.parentElement : null, r = e === null || !e.hasAttribute(jO) || QO(e) ? null : e.querySelector(`:scope > .${kO} > .${pn}`);
		r !== null && t.push(...YO(r));
	}
	return t;
}
function XO(e) {
	let t = ZO(e), n = t?.closest(".ui-menu") ?? null;
	return t === null || n === null || QO(t) ? e : XO(n);
}
function ZO(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(kO) && t.parentElement?.hasAttribute(AO) === !0 ? t.parentElement : null;
}
function QO(e) {
	let t = e.closest(`.${pn}`);
	return e.hasAttribute(FO) || t !== null && $O(t);
}
function $O(e) {
	return e.hasAttribute("data-ui-collapsed") || e.classList.contains("ui-menu--rail");
}
var ek = "tabs:rename", tk = "tabs:pin", nk = "tabs:unpin", rk = "tabs:close", ik = "tabs:delete";
function ak(e) {
	let t = (e ?? "").split(/\s+/);
	return {
		rename: t.includes("rename"),
		pin: t.includes("pin"),
		close: t.includes("close"),
		delete: t.includes("delete")
	};
}
function ok(e, t) {
	let n = !t.pinned && t.removable;
	return /* @__PURE__ */ new Map([
		[ek, e.rename && t.renamable],
		[tk, e.pin && !t.pinned],
		[nk, e.pin && t.pinned],
		[rk, e.close && !e.delete && n],
		[ik, e.delete && n]
	]);
}
function sk(e) {
	let t = e.map(() => !1), n = !1, r = -1;
	for (let i = 0; i < e.length; i++) e[i] === "rule" ? n && r === -1 && (r = i) : e[i] === "shown" && (r !== -1 && (t[r] = !0), r = -1, n = !0);
	return t;
}
//#endregion
//#region src/interactions/context-menu-engine.ts
var ck = Se, lk = "ui-context-menu--open", uk = `${Ae}--strip`, dk = `.${Ae}:not(.${uk}) > .${BD}`, fk = "ui-context-menu-opening", pk = class {
	root;
	components;
	closed = null;
	menus = new $m({
		show: ({ popup: e }) => e.classList.add(lk),
		hide: ({ popup: e }, t) => {
			e.classList.remove(lk), this.closed = e, t === "outside" && kk();
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e),
		onPress: !0,
		onWindowBlur: !0,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, new aO({
			root: this.root,
			first: typeof window > "u" ? void 0 : window,
			opensMenu: (e) => e.closest("[data-ui-context-menu-owner]") !== null && !Ec(e),
			closeMenu: () => this.menus.close(this.menus.current, "outside")
		}), this.root.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), this.root.addEventListener("click", (e) => this.handleInside(e), !1);
	}
	get openMenu() {
		let e = this.menus.current;
		return e === null ? null : this.menus.popupOf(e);
	}
	handleContextMenu(e) {
		if (!(e instanceof MouseEvent) || !(e.target instanceof Element)) return;
		let t = !td() && !iO(e), n = (t ? gk() : null) ?? e.target;
		if (this.openMenu !== null && e.composedPath().includes(this.openMenu)) {
			e.preventDefault();
			return;
		}
		let r = mk(n);
		r !== null && (e.preventDefault(), this.open(r.owner, r.menu, e.clientX, e.clientY, Sk(e) ? n : null, n.closest(dk), t ? _k(n) : null));
	}
	open(e, t, n, r, i, a, o) {
		this.menus.close(), t.querySelector(`:scope > .${uk}`)?.remove(), Ck(t), i !== null && wk(e, t, i), a?.closest("[data-ui-action-bar]")?.hasAttribute("data-ui-action-bar-rest") === !0 && Ek(t), this.closed !== null && (kf(this.closed), this.closed = null);
		let s = (document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null) ?? ed(), c = a ?? o, l = {
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
			returnFocus: () => (s === null ? null : wd(s, this.components)) ?? wd(e, this.components)
		}) && (c === null && Lp(t, n, r), Ok(t));
	}
	handleInside(e) {
		this.openMenu === null || !e.composedPath().includes(this.openMenu) || e.target instanceof Element && JO(e.target) && this.menus.close();
	}
};
function mk(e) {
	let t = e.closest(`[${ue}]`);
	for (let n = e.closest(`[${Ce}]`); n !== null; n = n.parentElement?.closest("[data-ui-context-menu-owner]") ?? null) {
		if (t !== null && n.contains(t)) return null;
		let r = yk(n, e);
		if (r.length === 0 || O(n)) continue;
		if (jk(n)) return null;
		let i = r.find((t) => bk(t, e, !1));
		if (i !== void 0) return {
			owner: n,
			menu: i
		};
	}
	return null;
}
var hk = `[${Ce}]`;
function gk() {
	let e = document.activeElement;
	if (e === null || e === document.body) return null;
	let t = Yl(e);
	if (t === null || t.row !== null && t.row !== e) return e;
	let n = t.row ?? tu(t.root);
	return n === null ? t.root : vk(n);
}
function _k(e) {
	let t = e.closest(pl);
	return t === null ? e : I(t) ?? t;
}
function vk(e) {
	if (e.matches(hk)) return e;
	for (let t of e.querySelectorAll(hk)) if (t.closest(pl) === e) return t;
	return e;
}
function yk(e, t) {
	let n = t.closest(`[${we}]`), r = n !== null && e.contains(n) ? n.getAttribute("data-ui-context-menu-use") ?? "" : "";
	return [r.length > 0 ? Ak(e, r) : null, Ak(e, "")].filter((e) => e !== null);
}
function bk(e, t, n) {
	let r = new CustomEvent(fk, {
		bubbles: !0,
		cancelable: !0,
		detail: {
			target: t,
			actionBar: n
		}
	});
	return e.dispatchEvent(r);
}
function xk(e, t) {
	let n = e.closest(`[${Ce}]`), r = e.closest(`[${ue}]`);
	return n === null || O(n) || jk(n) || r !== null && n.contains(r) ? null : yk(n, e).find((n) => bk(n, e, t)) ?? null;
}
function Sk(e) {
	let t = e.pointerType;
	return iO(e) ? !0 : typeof t == "string" && t.length > 0 ? t === "touch" : nd();
}
function Ck(e) {
	for (let t of e.querySelectorAll(`[${Oe}]`)) t.removeAttribute(Oe);
}
function wk(e, t, n) {
	let r = n.closest(`[${Te}]`);
	if (r === null || n.closest(".ui-action-bar") !== null || !e.contains(r) || !yk(e, r).includes(t)) return;
	let { entries: i } = KD(t);
	if (i.length === 0) return;
	let a = document.createElement("div");
	a.className = `${Ae} ${uk}`, a.setAttribute("role", "group"), JD(a, {
		entries: i,
		more: !1,
		role: "menuitem",
		press: Tk
	}), t.insertBefore(a, t.firstElementChild);
}
function Tk(e) {
	O(e) || e.click();
}
function Ek(e) {
	let { entries: t } = KD(e), n = e.querySelector(`.${pn}`);
	if (t.length === 0 || n === null) return;
	for (let e of t) Dk(e);
	let r = cl(n, `.${x}`, `.${pn}`).filter((t) => t.closest("[data-ui-menu-left-out]") === null && qD(t, e)), i = [];
	for (let [e, t] of r.entries()) {
		let n = r[e + 1];
		t.getAttribute("data-ui-menu-item-kind") === "header" && (n === void 0 || n.matches(vn)) ? Dk(t) : i.push(t);
	}
	let a = i.map((e) => {
		let t = e.getAttribute(fn);
		return t === "separator" ? "rule" : t === "header" ? "hidden" : "shown";
	});
	sk(a).forEach((e, t) => {
		a[t] === "rule" && !e && Dk(i[t]);
	});
}
function Dk(e) {
	let t = e.parentElement;
	(t !== null && t.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t : e).setAttribute(Oe, "");
}
function Ok(e) {
	let t = e.querySelector(`.${pn}`);
	t !== null && Cd(e, YO(t));
}
function kk() {
	let e = (e) => {
		e.target instanceof Element && e.target.closest(`${Vu}, [contenteditable='true']`) === null && e.preventDefault();
	};
	document.addEventListener("mousedown", e, {
		capture: !0,
		once: !0
	}), setTimeout(() => document.removeEventListener("mousedown", e, !0));
}
function Ak(e, t) {
	for (let n of e.querySelectorAll(`[${ck}]`)) if ((n.getAttribute(ck) ?? "") === t && n.closest("[data-ui-context-menu-owner]") === e) return n;
	return null;
}
function jk(e) {
	if (e.hasAttribute("data-ui-no-context-menu")) return !0;
	let t = e.closest(`[${b}]`);
	if (t === null) return !1;
	let n = e;
	for (; n.parentElement !== null && n.parentElement !== t;) n = n.parentElement;
	return Qo(n, "data-ui-no-context-menu") || t.closest(S)?.hasAttribute("data-ui-no-context-menu") === !0;
}
//#endregion
//#region src/interactions/element-visibility.ts
function Mk(e, t) {
	let n = getComputedStyle(e), r = t ? n.overflowY : n.overflowX;
	return r === "auto" || r === "scroll";
}
function Nk(e) {
	return getComputedStyle(e).display !== "none";
}
function Pk(e) {
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
				if (e.overflowX !== "visible" && Lk(n, i, i + t.clientWidth, !0), e.overflowY !== "visible" && Lk(n, a, a + t.clientHeight, !1), Rk(n)) return !0;
			}
			r = e.position;
		}
	}
	return Lk(n, 0, window.innerWidth, !0), Lk(n, 0, window.innerHeight, !1), Rk(n);
}
function Fk(e) {
	let t = getComputedStyle(e).position;
	for (let n = e.parentElement; n !== null && t !== "fixed"; n = n.parentElement) {
		let e = getComputedStyle(n);
		if (t !== "absolute" || e.position !== "static" || e.transform !== "none") {
			if (!(n.classList.contains("ui-scroll-y--disabled") && !Mk(n, !1)) && (Ik(e.overflowX) || Ik(e.overflowY))) return n;
			t = e.position;
		}
	}
	return null;
}
function Ik(e) {
	return e === "hidden" || e === "auto" || e === "scroll";
}
function Lk(e, t, n, r) {
	r ? (e.left = Math.max(e.left, t), e.right = Math.min(e.right, n)) : (e.top = Math.max(e.top, t), e.bottom = Math.min(e.bottom, n));
}
function Rk(e) {
	return e.left > e.right || e.top > e.bottom;
}
//#endregion
//#region src/interactions/action-bar-engine.ts
var zk = `[${Te}]`, Bk = `.${Ae}`, Vk = `${Ae}--out`, Hk = `.ui-items-view__item, .${Fn}`, Uk = "ui-tree__node", Wk = 6, Gk = "--ui-action-bar-gap", Kk = 400, qk = /* @__PURE__ */ new WeakMap(), Jk = [
	"class",
	"style",
	"hidden",
	"aria-disabled",
	"aria-checked",
	ke,
	...Br
], Yk = class {
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
		if (n === null || n.closest(`${Bk}, [data-ui-context-menu]`) !== null) return;
		let r = Xk(n);
		if (t.pointerType === "touch") {
			this.pendingTap = {
				pointerId: t.pointerId ?? 0,
				host: r,
				identity: r === null ? null : $k(r)
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
			let e = t.host !== null && !t.host.isConnected && t.identity !== null ? eA(t.identity) : t.host;
			e !== null && e === this.chosen ? this.askAgain(e) : this.choose(e);
		}
		this.chosen !== null && this.chosen.isConnected && !this.shown.has(this.chosen) && this.sync();
	}
	handleContextMenu(e) {
		this.pendingTap = null, e instanceof MouseEvent && e.target instanceof Element && e.target.closest(Bk) === null && Sk(e) && this.choose(null);
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement ? e.target : null;
		if (t === null) return;
		let n = t.closest(Bk);
		if (n !== null) {
			this.isHostedBar(n) && N(cA(n), t);
			return;
		}
		td() || this.isInOpenMenu(t) || this.menuHost !== null && t.contains(this.menuHost) || this.choose(Zk(t));
	}
	handleFocusOut(e) {
		let t = e.relatedTarget, n = t instanceof Element ? t.closest(Bk) : null;
		n !== null && this.isHostedBar(n) && e.target instanceof HTMLElement && !n.contains(e.target) && (this.cameFrom = e.target);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || !(e.target instanceof HTMLElement)) return;
		let t = e.target;
		if (e.defaultPrevented) {
			t.matches(F) && this.choose(Zk(t));
			return;
		}
		let n = t.closest(Bk);
		if (n !== null && t.classList.contains(zD)) {
			this.handleBarKey(e, n, t);
			return;
		}
		if (e.key === "Escape") {
			if (gc(e)) return;
			let n = t.closest(Jp);
			(n === null || this.chosen !== null && n.contains(this.chosen)) && (this.chosen !== null && e.preventDefault(), this.choose(null));
			return;
		}
		if (e.key === "Tab" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey && t.matches(F)) {
			let n = this.chosen === null ? null : this.tabStopOf(this.chosen);
			n !== null && t.contains(n) && (e.preventDefault(), n.focus());
			return;
		}
		t.matches(F) && this.choose(Zk(t));
	}
	handleBarKey(e, t, n) {
		if (e.ctrlKey || e.altKey || e.metaKey) return;
		if (e.key === "Escape") {
			if (!this.isHostedBar(t)) return;
			let n = this.hostOfBar(t), r = this.cameFrom !== null && this.cameFrom.isConnected && fA(this.cameFrom) && n !== null && (n.contains(this.cameFrom) || this.cameFrom.contains(n)) ? this.cameFrom : wd(n, this.components);
			e.preventDefault(), r?.focus();
			return;
		}
		let r = cA(t), i = Bc({
			key: e.key,
			items: r,
			current: n,
			axis: "horizontal"
		});
		i !== null && (e.preventDefault(), Uc(r, i));
	}
	choose(e) {
		(e === null ? this.chosen === null && this.identity === null : e === this.chosen) || (this.chosen = e, this.identity = e === null ? null : $k(e), this.watchScope(), this.sync(), e !== null && this.makeRoomAbove(e));
	}
	makeRoomAbove(e) {
		let t = this.shown.get(e), n = Fk(e);
		if (t === void 0 || n === null || !Mk(n, !0)) return;
		let r = Math.max(0, n.getBoundingClientRect().top + n.clientTop), i = Math.ceil(t.bar.getBoundingClientRect().height + nA(e) - (e.getBoundingClientRect().top - r));
		i <= 0 || i > n.scrollTop || (n.scrollTop -= i, lp(t.bar), this.markOut());
	}
	askAgain(e) {
		let t = this.shown.get(e);
		if (t === void 0) {
			this.sync();
			return;
		}
		xk(e, !0) === null && this.hide(e, t);
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
				this.chosen = eA(e), this.sync();
			}
			for (let e of this.shown.values()) lp(e.bar);
			this.markOut();
		}
	}
	sync() {
		for (let [e, t] of this.shown) (e !== this.chosen && e !== this.menuHost || !e.isConnected) && this.hide(e, t);
		for (let e of [this.chosen, this.menuHost]) e !== null && e.isConnected && !this.shown.has(e) && this.show(e);
	}
	show(e) {
		let t = xk(e, !0);
		if (t === null) return;
		let n = document.createElement("div");
		if (n.className = Ae, n.setAttribute("role", "toolbar"), D.write(n, "aria-label", "ui.actionbar.label"), n.setAttribute(Ye, ""), n.setAttribute(fe, ""), !iA(n, t, (t) => this.openMore(e, t), !1)) return;
		e.insertBefore(n, sA(e)), Qf(e, n, {
			placement: tA(e),
			gap: nA(e),
			boundary: Fk(e) ?? void 0
		}), n.classList.toggle(Vk, Pk(e));
		let r = new MutationObserver(() => this.redraw(e));
		r.observe(t, {
			subtree: !0,
			childList: !0,
			characterData: !0,
			attributes: !0,
			attributeFilter: Jk
		});
		let i = rA(e);
		i?.setAttribute(dr, ""), this.shown.set(e, {
			bar: n,
			menu: t,
			observer: r,
			row: i
		}), qk.set(n, Date.now());
	}
	redraw(e) {
		let t = this.shown.get(e);
		if (t === void 0) return;
		let n = document.activeElement, r = n instanceof HTMLElement && t.bar.contains(n) ? n : null, i = r === null ? null : $D(r);
		if (!iA(t.bar, t.menu, (t) => this.openMore(e, t), e === this.menuHost)) {
			this.hide(e, t);
			return;
		}
		if (r === null) return;
		let a = cA(t.bar);
		Uc(a, a.find((e) => $D(e) === i) ?? a.find(P) ?? null);
	}
	openMore(e, t) {
		let n = this.shown.get(e);
		if (n === void 0 || uA(t)) return;
		if (this.menuHost = e, dA(t), !n.menu.classList.contains("ui-context-menu--open")) {
			this.menuHost = null;
			return;
		}
		aA(n.bar, !0);
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
		aA(t.bar, !1);
		let n = document.activeElement;
		!td() && (n === null || n === document.body || e.contains(n) || n.contains(e)) && oA(t.bar)?.focus();
	}
	hide(e, t) {
		t.observer.disconnect(), up(t.bar), t.bar.remove(), this.shown.delete(e), t.row !== null && ![...this.shown.values()].some((e) => e.row === t.row) && t.row.removeAttribute(dr);
	}
	markOut() {
		for (let [e, t] of this.shown) t.bar.classList.toggle(Vk, Pk(e));
	}
	isInOpenMenu(e) {
		for (let t of this.shown.values()) if (t.menu.classList.contains("ui-context-menu--open") && t.menu.contains(e)) return !0;
		return !1;
	}
	tabStopOf(e) {
		let t = this.shown.get(e);
		return t === void 0 ? null : cA(t.bar).find((e) => e.tabIndex === 0) ?? null;
	}
	isHostedBar(e) {
		return this.hostOfBar(e) !== null;
	}
	hostOfBar(e) {
		for (let [t, n] of this.shown) if (n.bar === e) return t;
		return null;
	}
};
function Xk(e) {
	let t = e.closest(zk);
	if (t !== null) return t;
	let n = e.closest(`[${y}]`), r = e.closest(S);
	return n === null || r !== null && !r.contains(n) ? null : Qk(n)[0] ?? null;
}
function Zk(e) {
	if (e instanceof HTMLElement && e.matches(F)) {
		let t = tu(e), n = t === null ? void 0 : Qk(t)[0];
		if (n !== void 0) return n;
	}
	return e.closest(zk);
}
function Qk(e) {
	let t = [...e.querySelectorAll(zk)];
	return e.matches(zk) ? [e, ...t] : t;
}
function $k(e) {
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
		index: Qk(n).indexOf(e)
	};
}
function eA(e) {
	for (let t of e.scope.children) if (t.getAttribute(e.attribute) === e.key) return Qk(t)[e.index] ?? null;
	return null;
}
function tA(e) {
	let t = e.getAttribute(Te);
	if (t === "center") return "top";
	let n = getComputedStyle(e).direction === "rtl";
	return t === "start" === n ? "top-end" : "top-start";
}
function nA(e) {
	let t = Number.parseFloat(getComputedStyle(e).getPropertyValue(Gk));
	return Number.isFinite(t) ? t : Wk;
}
function rA(e) {
	if (e.classList.contains("ui-table__row")) return e;
	let t = e.parentElement;
	if (t === null) return null;
	if (t.matches(Hk)) return t;
	let n = t.parentElement;
	return t.classList.contains(Uk) && n !== null && n.classList.contains("ui-tree__row") ? n : null;
}
function iA(e, t, n, r) {
	let { entries: i, more: a } = KD(t);
	if (i.length === 0 && !a) return !1;
	let o = JD(e, {
		entries: i,
		more: a,
		role: "button",
		press: lA,
		openMore: n
	});
	return N(o, o.find((e) => !O(e)) ?? o[0] ?? null), aA(e, r), !0;
}
function aA(e, t) {
	oA(e)?.setAttribute("aria-expanded", t ? "true" : "false");
}
function oA(e) {
	return cA(e).find((e) => $D(e) === null) ?? null;
}
function sA(e) {
	for (let t of e.children) if (t.hasAttribute("data-ui-context-menu")) return t;
	return null;
}
function cA(e) {
	return [...e.querySelectorAll(`:scope > .${zD}`)];
}
function lA(e, t) {
	if (O(t) || uA(t)) return;
	let n = xk(t, !1);
	n === null || !n.contains(e) || O(e) || !qD(e, n) || e.click();
}
function uA(e) {
	let t = e.closest(Bk), n = t === null ? void 0 : qk.get(t);
	return n !== void 0 && nd() && Date.now() - n < Kk;
}
function dA(e) {
	let t = e.getBoundingClientRect();
	e.dispatchEvent(new MouseEvent("contextmenu", {
		bubbles: !0,
		cancelable: !0,
		button: 2,
		clientX: t.left,
		clientY: t.bottom
	}));
}
function fA(e) {
	return e.matches(Vu) || e.hasAttribute("tabindex");
}
//#endregion
//#region src/rendering/inline-markup.ts
var pA = {
	None: 0,
	Bold: 1,
	Italic: 2,
	Underline: 4,
	Strikethrough: 8,
	Code: 16
}, mA = "\\", hA = "`", gA = "!", _A = "{", vA = "}", yA = "ui-text__fold", bA = "ui-text__fold-toggle", xA = "ui-text__fold-content", SA = 8;
function CA(e) {
	if (e == null || e.length === 0) return [];
	let t = [], n = { value: "" };
	return FA(new WA(e), 0, e.length, pA.None, null, t, n), IA(t, n, pA.None, null), t;
}
function wA(e) {
	return CA(e).map((e) => kA(e) ? `${e.fold} ${wA(e.text)}` : e.text).join("");
}
function TA(e) {
	let t = "";
	for (let n of e) t += qA(n) ? mA + n : n;
	return t;
}
function EA(e, t, n = {}) {
	let r = CA(t), i = r.some(kA);
	if (e.hasAttribute("data-ui-folds") !== i && e.toggleAttribute(Ue, i), r.length === 0) {
		e.textContent = "";
		return;
	}
	if (r.length === 1 && DA(r[0])) {
		e.textContent = r[0].text;
		return;
	}
	e.replaceChildren(AA(r, n));
}
function DA(e) {
	return e.styles === pA.None && e.url === null && !OA(e) && !kA(e);
}
function OA(e) {
	return e.icon !== null && e.icon !== void 0 && e.icon.length > 0;
}
function kA(e) {
	return e.fold !== null && e.fold !== void 0;
}
function AA(e, t) {
	let n = document.createDocumentFragment();
	for (let r of e) n.append(jA(r, t));
	return n;
}
function jA(e, t) {
	if (OA(e)) return NA(e.icon);
	let n = kA(e) ? MA(e, t) : document.createTextNode(e.text);
	if ((e.styles & pA.Code) !== 0) {
		let e = document.createElement("code");
		e.className = "ui-text__code", e.append(n), n = e;
	}
	if ((e.styles & pA.Strikethrough) !== 0 && (n = PA("s", n)), (e.styles & pA.Underline) !== 0 && (n = PA("u", n)), (e.styles & pA.Italic) !== 0 && (n = PA("em", n)), (e.styles & pA.Bold) !== 0 && (n = PA("strong", n)), e.url !== null) {
		let t = document.createElement("a");
		t.setAttribute("href", e.url), t.className = "ui-text__link", Ug(e.url) && (t.setAttribute("target", "_blank"), t.setAttribute("rel", "noopener noreferrer")), t.append(n), n = t;
	}
	return n;
}
function MA(e, t) {
	let n = document.createElement("span"), r = document.createElement(t.staticFolds === !0 ? "span" : "button"), i = document.createElement("span");
	return n.className = t.staticFolds === !0 ? `${yA} ${yA}--static` : yA, r.className = bA, r.textContent = e.fold ?? "", i.className = xA, i.append(AA(CA(e.text), t)), t.staticFolds === !0 ? (n.append(r, " ", i), n) : (r.setAttribute("type", "button"), r.setAttribute("aria-expanded", "false"), r.setAttribute(Ye, ""), n.append(r, i), n);
}
function NA(e) {
	let t = document.createElement("i");
	return t.className = "ui-text__icon-inline", o_(t, e), t.setAttribute("aria-hidden", "true"), t;
}
function PA(e, t) {
	let n = document.createElement(e);
	return n.append(t), n;
}
function FA(e, t, n, r, i, a, o) {
	let s = e.text, c = t;
	for (; c < n;) {
		let t = s[c];
		if (t === mA && c + 1 < n && qA(s[c + 1])) {
			o.value += s[c + 1], c += 2;
			continue;
		}
		let l = LA(e, c, n);
		if (l !== null) {
			IA(a, o, r, i), RA(s, c + 1, l, o), IA(a, o, r | pA.Code, i), c = l + 1;
			continue;
		}
		let u = VA(e, c, n);
		if (u !== null) {
			IA(a, o, r, i), FA(e, c + u.markerLength, u.contentEnd, r | u.style, i, a, o), IA(a, o, r | u.style, i), c = u.contentEnd + u.markerLength;
			continue;
		}
		let d = zA(e, c, n);
		if (d !== null) {
			IA(a, o, r, i), a.push({
				text: "",
				styles: r,
				url: i,
				icon: d.name
			}), c = d.iconEnd;
			continue;
		}
		let f = i === null ? HA(e, c, n) : null;
		if (f !== null) {
			IA(a, o, r, i), FA(e, f.labelStart, f.labelEnd, r, f.url, a, o), IA(a, o, r, f.url), c = f.linkEnd;
			continue;
		}
		let p = UA(e, c, n);
		if (p !== null) {
			IA(a, o, r, i), a.push({
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
function IA(e, t, n, r) {
	t.value.length !== 0 && (e.push({
		text: t.value,
		styles: n,
		url: r
	}), t.value = "");
}
function LA(e, t, n) {
	let r = e.text;
	if (r[t] !== hA) return null;
	let i = t + 1;
	if (i >= n || JA(r[i])) return null;
	let a = e.findClosingMarker(i, n, hA, 1);
	return a > i ? a : null;
}
function RA(e, t, n, r) {
	for (let i = t; i < n; i++) {
		if (e[i] === mA && i + 1 < n && qA(e[i + 1])) {
			r.value += e[i + 1], i++;
			continue;
		}
		r.value += e[i];
	}
}
function zA(e, t, n) {
	let r = e.text;
	if (r[t] !== gA || t + 1 >= n || r[t + 1] !== "[") return null;
	let i = t + 2, a = e.findClosingBracket(i, n);
	if (a <= i) return null;
	let o = r.slice(i, a);
	return BA(o) ? {
		name: o,
		iconEnd: a + 1
	} : null;
}
function BA(e) {
	return e.length > 0 && /^[A-Za-z0-9._-]+$/.test(e);
}
function VA(e, t, n) {
	let r = e.text, i = r[t];
	if (i !== "*" && i !== "_" && i !== "~") return null;
	let a = t + 1 < n && r[t + 1] === i, o, s;
	if (i === "*" && a) o = pA.Bold, s = 2;
	else if (i === "*") o = pA.Italic, s = 1;
	else if (i === "_" && a) o = pA.Underline, s = 2;
	else if (i === "~" && a) o = pA.Strikethrough, s = 2;
	else return null;
	let c = t + s;
	if (c >= n || JA(r[c])) return null;
	let l = e.findClosingMarker(c, n, i, s);
	return l > c ? {
		style: o,
		markerLength: s,
		contentEnd: l
	} : null;
}
function HA(e, t, n) {
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
function UA(e, t, n) {
	let r = e.text;
	if (r[t] !== "[") return null;
	let i = e.findClosingBracket(t + 1, n);
	if (i <= t + 1 || i + 1 >= n || r[i + 1] !== _A || e.hasOpeningBracket(t + 1, i)) return null;
	let a = i + 1, o = a + 1, s = e.findMatchingBrace(a, n);
	if (s <= o || e.braceDepth(a) > SA) return null;
	let c = { value: "" };
	return RA(r, t + 1, i, c), {
		caption: c.value,
		contentStart: o,
		contentEnd: s
	};
}
var WA = class {
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
		return this.closeBrackets ??= this.next("]", !0), GA(this.closeBrackets[e], t);
	}
	hasOpeningBracket(e, t) {
		return this.openBrackets ??= this.next("[", !0), GA(this.openBrackets[e], t) >= 0;
	}
	findClosingParen(e, t) {
		return this.closeParens ??= this.next(")", !1), GA(this.closeParens[e], t);
	}
	findMatchingBrace(e, t) {
		return GA(this.braces()[e], t);
	}
	braceDepth(e) {
		return this.braces(), this.braceDepths[e];
	}
	findClosingMarker(e, t, n, r) {
		let i = KA(n, r), a = this.closers[i] ?? this.buildClosers(n, r);
		this.closers[i] = a;
		let o = a[e + 1];
		if (r === 2) return o >= 0 && o + 1 < t ? o : -1;
		if (o >= 0 && o < t - 1) return o;
		let s = t - 1;
		return s > e && this.text[s] === n && !this.isEscaped(s) && !JA(this.text[s - 1]) ? s : -1;
	}
	readLinkUrl(e, t) {
		if (this.linkLabel !== e) {
			let n = this.text.slice(e + 2, t).trim();
			this.linkLabel = e, this.linkUrl = Bg(n) ? n : null;
		}
		return this.linkUrl;
	}
	isEscaped(e) {
		if (this.escaped === null) {
			let e = new Uint8Array(this.text.length);
			for (let t = 1; t < this.text.length; t++) e[t] = +(this.text[t - 1] === mA && e[t - 1] === 0);
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
			if (this.text[r] === _A) n.push(r);
			else if (this.text[r] === vA && n.length > 0) {
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
		if (e === 0 || this.text[e] !== t || this.isEscaped(e) || JA(this.text[e - 1])) return !1;
		let r = e + 1 < this.text.length && this.text[e + 1] === t;
		return n === 2 ? r : !r;
	}
};
function GA(e, t) {
	return e >= 0 && e < t ? e : -1;
}
function KA(e, t) {
	switch (e) {
		case "*": return t === 2 ? 0 : 1;
		case "_": return 2;
		case "~": return 3;
		default: return 4;
	}
}
function qA(e) {
	return e === "*" || e === "_" || e === "~" || e === "[" || e === "]" || e === "(" || e === ")" || e === _A || e === vA || e === hA || e === mA;
}
function JA(e) {
	return e === " " || e === "	" || e === "\r" || e === "\n";
}
//#endregion
//#region src/interactions/tooltip-engine.ts
var YA = "ui-tooltip", XA = "ui-tooltip", ZA = "ui-tooltip--visible", QA = "ui-tooltip--linked", $A = "[aria-haspopup][aria-expanded=\"true\"]", ej = "a[href], button, input, select, textarea, label, [role='button'], [role='link'], [tabindex]", tj = "top", nj = 250, rj = 200, ij = 300, aj = 7, oj = null, sj = null, cj = null, lj = null, uj = null, dj = 0, fj = null, pj = 0, mj = 0, hj = !1, gj = /* @__PURE__ */ new Set();
function _j(e) {
	gj.add(e);
}
function vj(e = document) {
	if (hj) return;
	hj = !0;
	let t = e instanceof Document ? e : document;
	t.addEventListener("pointerover", yj, !0), t.addEventListener("pointerout", Sj, !0), t.addEventListener("focusin", wj, !0), t.addEventListener("focusout", Tj, !0), t.addEventListener("scroll", xj, !0), t.addEventListener("pointerdown", Dj, !0), t.addEventListener("pointermove", Fj, !0), t.addEventListener("pointerup", Pj, !0), t.addEventListener("pointercancel", Pj, !0), t.addEventListener("contextmenu", Lj, !0), t.addEventListener("click", zj, !0), window.addEventListener("click", Rj, !0), window.addEventListener("keydown", Ej, !0), window.addEventListener("blur", () => {
		lj = null, lM(!0);
	});
}
function yj(e) {
	if (bj(), Vj(e.target)) {
		window.clearTimeout(pj);
		return;
	}
	let t = Hj(e.target);
	t !== null && t !== sj && qj(t);
}
function bj() {
	sj === null || sj.isConnected || (lj = null, lM(!0));
}
function xj(e) {
	if (bj(), sj === null) return;
	let t = e.target;
	t instanceof Node && !(t instanceof Document) && !t.contains(sj) || Pk(sj) && (lj = null, lM(!0));
}
function Sj(e) {
	if (lj !== null || uj !== null) return;
	let t = e.relatedTarget, n = sj ?? fj?.target ?? null, r = n === null ? null : Cj(n);
	t instanceof Node && (r !== null && r.contains(t) || Vj(t)) || (Vj(e.target) || r !== null && e.target instanceof Node && r.contains(e.target)) && lM(!1);
}
function Cj(e) {
	let t = e.parentElement?.closest("[data-ui-tooltip-mark]") ?? null;
	return t !== null && Uj(t) === e ? t : e;
}
function wj(e) {
	if (e.target instanceof Element && e.target.hasAttribute("data-ui-pointer-focus")) return;
	let t = Hj(e.target);
	t !== null && (lj = e.target instanceof Element && e.target.closest("[data-ui-tooltip-mark]") !== null ? t : null, Jj(t));
}
function Tj(e) {
	Hj(e.target) === sj && (lj = null, lM(!0));
}
function Ej(e) {
	e.key !== "Escape" || sj === null || e.defaultPrevented || (gc(e) || e.preventDefault(), lj = null, lM(!0));
}
function Dj(e) {
	if (Pj(), Mj = null, Vj(e.target)) return;
	Nj(e);
	let t = Bj(e.target);
	if (t !== null) {
		if (uj === t) {
			lM(!0);
			return;
		}
		lj = null, lM(!0), Jj(t), uj = sj;
		return;
	}
	lj === null && lM(!0);
}
var Oj = 500, kj = 10, Aj = `[${Ce}]`, jj = null, Mj = null;
function Nj(e) {
	let t = e;
	if (t.pointerType !== "touch" || !(e.target instanceof Element) || e.target.closest(Aj) !== null || Ec(e.target)) return;
	let n = Hj(e.target);
	n === null || n.hasAttribute("data-ui-tooltip-press") || (jj = {
		pointerId: t.pointerId ?? 0,
		x: t.clientX ?? 0,
		y: t.clientY ?? 0,
		target: n,
		timer: window.setTimeout(Ij, Oj)
	});
}
function Pj() {
	jj !== null && (window.clearTimeout(jj.timer), jj = null);
}
function Fj(e) {
	let t = e;
	jj !== null && t.pointerId === jj.pointerId && Math.hypot((t.clientX ?? jj.x) - jj.x, (t.clientY ?? jj.y) - jj.y) > kj && Pj();
}
function Ij() {
	let e = jj?.target ?? null;
	jj = null, e !== null && (lj = null, lM(!0), Jj(e), uj = sj, Mj = sj);
}
function Lj(e) {
	if (jj !== null && e.target instanceof Node && jj.target.contains(e.target)) {
		e.preventDefault(), window.clearTimeout(jj.timer), Ij();
		return;
	}
	Mj !== null && e.target instanceof Node && Mj.contains(e.target) && e.preventDefault();
}
function Rj(e) {
	Mj === null || !(e.target instanceof Node) || !Mj.contains(e.target) || (Mj = null, e.preventDefault(), e.stopImmediatePropagation());
}
function zj(e) {
	Bj(e.target) !== null && e.preventDefault();
}
function Bj(e) {
	let t = Hj(e);
	if (t === null || !t.hasAttribute("data-ui-tooltip-press") || !(e instanceof Element)) return null;
	let n = e.closest(ej);
	return n === null || n.contains(t) ? t : null;
}
function Vj(e) {
	return oj !== null && e instanceof Node && oj.contains(e);
}
function Hj(e) {
	if (!(e instanceof Element)) return null;
	let t = Uj(e);
	for (let n of gj) {
		let r = n.anchor(e);
		if (r !== null && (t === null || t !== r && t.contains(r)) && Kj(r).length > 0) return r;
	}
	return t;
}
function Uj(e) {
	let t = e.closest(`[${Ie}], [${Re}]`);
	if (t === null) return null;
	let n = t.hasAttribute("data-ui-tooltip") ? t : t.querySelector("[data-ui-tooltip][data-ui-tooltip-severity]") ?? t.querySelector("[data-ui-tooltip]");
	return n === null ? null : (n.getAttribute("data-ui-tooltip") ?? "").trim().length > 0 ? n : null;
}
function Wj(e) {
	let t = (e.getAttribute("data-ui-tooltip") ?? "").trim();
	return t.length > 0 ? t + Gj(e) : Kj(e);
}
function Gj(e) {
	let t = "";
	for (let n of gj) {
		let r = n.anchor(e) === e ? n.after?.(e)?.trim() ?? "" : "";
		r.length > 0 && (t += ` ${r}`);
	}
	return t;
}
function Kj(e) {
	for (let t of gj) {
		if (t.anchor(e) !== e) continue;
		let n = t.words(e)?.trim() ?? "";
		if (n.length > 0) return n;
	}
	return "";
}
function qj(e, t) {
	if (lj === null && uj === null) {
		if (window.clearTimeout(pj), fj !== null && fj.target === e) {
			fj.words = t;
			return;
		}
		if (window.clearTimeout(dj), fj = null, sj !== null) {
			lM(!0), Jj(e, t);
			return;
		}
		if (Date.now() - mj < ij) {
			Jj(e, t);
			return;
		}
		fj = {
			target: e,
			words: t
		}, dj = window.setTimeout(() => {
			let e = fj;
			fj = null, e !== null && Jj(e.target, e.words);
		}, nj);
	}
}
function Jj(e, t) {
	let n = (t ?? Wj(e)).trim();
	if (n.length === 0 || !e.isConnected || !Nk(e) || Zj(e) || Pk(e)) return;
	window.clearTimeout(dj), window.clearTimeout(pj), fj = null;
	let r = uM();
	EA(r, n, { staticFolds: !0 }), r.classList.toggle(QA, r.querySelector("a[href]") !== null), r.classList.add(ZA), sj = e, $j(Qj(e)), r.setAttribute("data-ui-tooltip-text", wA(n)), nM(r, e.getAttribute(ze)), Zf(e, r), Qf(e, r, {
		placement: cM(e),
		gap: aj,
		arrow: !0
	}), Xj();
}
var Yj = null;
function Xj() {
	typeof MutationObserver > "u" || (Yj ??= new MutationObserver(bj), Yj.observe(document.documentElement, {
		childList: !0,
		subtree: !0
	}));
}
function Zj(e) {
	return e.matches($A) || e.querySelector($A) !== null || e.querySelector(":scope > .ui-action-bar") !== null;
}
function Qj(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t) ? t : e;
}
function $j(e) {
	cj !== null && cj !== e && eM();
	let t = tM(e);
	t.includes(XA) || e.setAttribute("aria-describedby", [...t, XA].join(" ")), cj = e;
}
function eM() {
	if (cj === null) return;
	let e = tM(cj).filter((e) => e !== XA);
	e.length === 0 ? cj.removeAttribute("aria-describedby") : cj.setAttribute("aria-describedby", e.join(" ")), cj = null;
}
function tM(e) {
	return (e.getAttribute("aria-describedby") ?? "").split(" ").filter((e) => e.length > 0);
}
function nM(e, t) {
	t === null ? e.removeAttribute(ze) : e.setAttribute(ze, t);
}
function rM(e, t, n) {
	let r = n?.plain === !0 ? TA(t) : t;
	n?.delay === !0 && sj !== e ? qj(e, r) : Jj(e, r);
}
function iM() {
	lM(!0);
}
var aM = {
	show: rM,
	hide: iM,
	escape: TA
};
function oM(e) {
	lj = e, Jj(e);
}
function sM(e) {
	if (sj === e) {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) {
			lj = null, lM(!0);
			return;
		}
		Jj(e);
	}
}
function cM(e) {
	if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) for (let t of gj) {
		let n = t.anchor(e) === e ? t.placement?.(e) ?? null : null;
		if (n !== null) return n;
	}
	let t = e.getAttribute(Le);
	return t !== null && Vf(t) ? t : tj;
}
function lM(e) {
	window.clearTimeout(dj), window.clearTimeout(pj), fj = null;
	let t = () => {
		sj !== null && (eM(), sj = null, uj = null, Yj?.disconnect(), oj !== null && (oj.classList.remove(ZA), up(oj)), mj = Date.now());
	};
	e ? t() : pj = window.setTimeout(t, rj);
}
function uM() {
	return oj !== null && oj.isConnected ? oj : (oj = document.createElement("div"), oj.id = XA, oj.className = YA, oj.setAttribute("role", "tooltip"), oj.setAttribute("aria-hidden", "true"), document.body.append(oj), oj);
}
//#endregion
//#region src/interactions/menu-engine.ts
var dM = "ui-orientation--horizontal", fM = `.${gn} > .ui-menu__host > .ui-menu__item > .${x}`, pM = `${fM}, ${`.ui-menu[${Ht}] > .ui-menu__host > .ui-menu__item > .${x}`}`, mM = ":scope > .ui-button__content > .ui-text__body > .ui-text__header > .ui-text__title", hM = "[role='menuitem'], [role='menuitemcheckbox']", gM = class {
	root;
	tabStopsScheduled = !1;
	space = new nc();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("keydown", (e) => this.handleEntryKeydown(e), !0), this.root.addEventListener("keyup", (e) => this.space.release(e, P), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), _j(bM), this.applyTabStops(), this.root instanceof Node && new MutationObserver((e) => {
			e.some(xM) && this.scheduleTabStops();
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [$t, Gt]
		});
	}
	scheduleTabStops() {
		this.tabStopsScheduled || (this.tabStopsScheduled = !0, setTimeout(() => {
			this.tabStopsScheduled = !1, this.applyTabStops();
		}, 0));
	}
	applyTabStops() {
		for (let e of this.root.querySelectorAll(`.${pn}`)) {
			if (XO(e) !== e) continue;
			let t = YO(e);
			if (t.length === 0) continue;
			let n = t.filter((e) => e.tabIndex === 0 && P(e));
			N(t, t.find((e) => e === document.activeElement) ?? t.find((e) => e.classList.contains("ui-menu-item--selected") && P(e)) ?? (n.length === 1 ? n[0] : void 0) ?? t.find(P) ?? t[0]);
		}
	}
	handleEntryKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || Dc(e) || j(e) || !(e.target instanceof Element)) return;
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
		let r = XO(n), i = YO(r), a = eb(e);
		if (a !== null) {
			e.preventDefault(), Uc(i, CD(i, t, a));
			return;
		}
		let o = r.classList.contains(dM) || KO(r) ? "horizontal" : "vertical";
		if (!M(e) || this.handleGroupKey(e, t, r, o)) return;
		let s = e.key === "ArrowUp" && t === i.find(P) ? yM(r) : null, c = s ?? Bc({
			key: e.key,
			items: i,
			current: t,
			axis: o
		});
		c !== null && (e.preventDefault(), c !== s && N(i, c), c.focus());
	}
	handleGroupKey(e, t, n, r) {
		let i = r === "vertical" ? "ArrowRight" : GO(n) === "top" ? "ArrowUp" : "ArrowDown", a = t.matches(yn) ? t.parentElement : null;
		if (e.key === i && a !== null) return e.preventDefault(), a.hasAttribute("data-ui-menu-open") ? Uc([], _M(a)) : t.click(), !0;
		if (e.key !== "ArrowLeft" || r !== "vertical") return !1;
		let o = a !== null && a.hasAttribute("data-ui-menu-open") && !QO(a) ? a : vM(t), s = o?.querySelector(":scope > .ui-menu-item") ?? null;
		return o === null || s === null ? !1 : (e.preventDefault(), QO(o) || s.focus(), s.click(), !0);
	}
	pressEntry(e, t) {
		e.target !== t || !M(e, { shift: !0 }) || t.matches(vn) || !P(t) || t.hasAttribute("href") && e.key === "Enter" || (e.preventDefault(), !e.repeat && (e.key === " " ? this.space.hold(t) : t.click()));
	}
	enterFromContainer(e) {
		let t = e.target instanceof HTMLElement && e.target.getAttribute("role") === "menu" ? e.target : null, n = t === null ? null : t.matches(".ui-menu") ? t : t.querySelector(`.${pn}`);
		if (n === null) return;
		let r = YO(n), i = eb(e);
		if (i !== null) {
			e.preventDefault(), Uc(r, CD(r, null, i));
			return;
		}
		let a = M(e) ? Bc({
			key: e.key,
			items: r,
			current: null,
			axis: n.classList.contains(dM) ? "horizontal" : "vertical"
		}) : null;
		a !== null && (e.preventDefault(), Uc(r, a));
	}
	handleFocusIn(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${x}`), n = t?.closest(".ui-menu") ?? null;
		t !== null && n !== null && N(YO(XO(n)), t);
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${x}`) : null;
		if (t === null || t === document.activeElement || !t.matches(hM) || t.matches(vn) || !P(t)) return;
		let n = document.activeElement;
		(n instanceof HTMLElement && n.getAttribute("role") === "menu" && n.contains(t) || t.closest(".ui-menu")?.contains(n) === !0) && cd(t);
	}
};
function _M(e) {
	let t = e.querySelector(`:scope > .ui-menu__submenu > .${pn}`);
	return t === null ? null : YO(t).find(P) ?? null;
}
function vM(e) {
	let t = e.closest(`.${pn}`), n = t === null ? null : ZO(t);
	return n !== null && n.hasAttribute("data-ui-menu-open") ? n : null;
}
function yM(e) {
	return e.hasAttribute("data-ui-menu-search") ? e.querySelector(":scope > .ui-collapsible__bar input") : null;
}
var bM = {
	anchor: (e) => e.closest(pM),
	words: (e) => {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length > 0) return null;
		let t = e.querySelector(mM), n = t?.textContent?.trim() ?? "";
		return t === null || n.length === 0 || e.matches(fM) && t.scrollWidth <= t.clientWidth ? null : TA(n);
	},
	placement: (e) => {
		let t = e.closest(`.${pn}`);
		return t === null ? null : GO(t);
	}
};
function xM(e) {
	let t = e.target instanceof Element ? e.target : e.target.parentElement;
	if (t !== null && t.closest(".ui-menu") !== null) return !0;
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains("ui-menu") || t.querySelector(".ui-menu") !== null)) return !0;
	return !1;
}
//#endregion
//#region src/interactions/shortcut-engine.ts
var SM = "shortcut:", CM = ":scope > .ui-menu-item__shortcut", wM = `[${Se}]`, TM = `[${Sn}]`, EM = ".ui-text__title", DM = class {
	root;
	options;
	claims = /* @__PURE__ */ new Map();
	entryShortcuts = /* @__PURE__ */ new Map();
	stale = !0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.options = e, this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), _j(PM), jM(this.root), this.root instanceof Node && new MutationObserver((e) => {
			this.stale = !0;
			for (let t of e) AM(t);
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [Sn]
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || j(e) || (this.stale && this.rebuild(), this.claims.size === 0 && this.entryShortcuts.size === 0 || Dc(e))) return;
		let t = Zp(this.root);
		if (!this.pressContextEntry(e, t)) for (let n of this.claims.values()) {
			if (n === null || !Ks(n.shortcut, e)) continue;
			let r = n.element ?? this.contentOf(n.view);
			if (r === null || !P(r) || t !== null && !t.contains(r)) return;
			e.preventDefault(), kM(e), n.view === null ? r.click() : r.dispatchEvent(new CustomEvent(n.view.name, { bubbles: !0 }));
			return;
		}
	}
	pressContextEntry(e, t) {
		let n = !1;
		for (let t of this.entryShortcuts.values()) n ||= Ks(t, e);
		let r = n ? gk() : null;
		if (r === null || t !== null && !t.contains(r)) return !1;
		let i = mk(r);
		if (i === null) return !1;
		let a = [...i.menu.querySelectorAll(TM)].filter((t) => {
			let n = Gs(t.getAttribute(Sn));
			return n !== null && Ks(n, e) && !O(t) && qD(t, i.menu);
		});
		return a.length === 1 ? (e.preventDefault(), kM(e), a[0].click(), !0) : (a.length > 1 && s("context menu shortcut is claimed twice and will fire nothing.", { entries: a }), !1);
	}
	contentOf(e) {
		let t = e === null ? null : this.options.componentOf?.(e.componentId) ?? null;
		return t instanceof HTMLElement ? t : null;
	}
	rebuild() {
		this.claims.clear(), this.entryShortcuts.clear(), this.stale = !1;
		for (let e of this.root.querySelectorAll(TM)) {
			let t = e.getAttribute("data-ui-shortcut") ?? "", n = Gs(t);
			if (n === null) {
				t.trim().length > 0 && s("shortcut could not be parsed.", {
					element: e,
					value: t
				});
				continue;
			}
			e.closest(wM) === null ? this.claim({
				shortcut: n,
				element: e,
				view: null
			}) : this.entryShortcuts.set(rc(n), n);
		}
		for (let e of this.options.viewShortcuts ?? []) {
			let t = Gs(e.name.slice(9));
			t !== null && this.claim({
				shortcut: t,
				element: null,
				view: e
			});
		}
	}
	claim(e) {
		let t = rc(e.shortcut);
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
function OM(e) {
	let t = /* @__PURE__ */ new Map(), n = [...e.events, ...e.interactions.map((e) => e.sourceEvent)];
	for (let e of n) e != null && e.eventName.startsWith(SM) && t.set(e.eventName, {
		name: e.eventName,
		componentId: e.componentId
	});
	return [...t.values()];
}
function kM(e) {
	Tc(e.target) && e.target.dispatchEvent(new Event(fy, { bubbles: !0 }));
}
function AM(e) {
	if (e.type === "attributes") {
		e.target instanceof HTMLElement && MM(e.target);
		return;
	}
	for (let t of e.addedNodes) t instanceof HTMLElement && jM(t);
}
function jM(e) {
	e instanceof HTMLElement && e.matches(TM) && MM(e);
	for (let t of e.querySelectorAll(TM)) MM(t);
}
function MM(e) {
	let t = e.querySelector(CM);
	if (t === null) return;
	let n = NM(e) ?? "";
	t.textContent !== n && (t.textContent = n), e.hasAttribute("data-ui-menu-item-shortcut") !== n.length > 0 && e.toggleAttribute(Yt, n.length > 0);
}
function NM(e) {
	let t = e.getAttribute(Sn), n = Gs(t);
	return n === null ? t?.trim() || null : qs(n);
}
var PM = {
	anchor: (e) => {
		let t = e.closest(TM);
		return t === null || t.classList.contains("ui-menu-item") || t.closest(wM) !== null ? null : t;
	},
	words: (e) => {
		let t = NM(e), n = (e.getAttribute("aria-label") ?? e.querySelector(EM)?.textContent ?? "").trim();
		return t === null ? null : TA(n.length > 0 ? `${n} (${t})` : t);
	},
	after: (e) => {
		let t = NM(e);
		return t === null ? null : TA(`(${t})`);
	}
}, FM = 50, IM = 1, LM = 7;
function RM(e) {
	let t = 0;
	for (let n of e.children) n.hasAttribute("data-ui-key") && t++;
	let n = VS(e, "data-ui-window-size") ?? 0;
	return {
		offset: VS(e, "data-ui-window-offset") ?? 0,
		count: t,
		size: n > 0 ? n : t > 0 ? t : FM,
		total: VS(e, Pt),
		moreAfter: HS(e, It)
	};
}
function zM(e) {
	return Math.floor(e.offset / e.size) + 1;
}
function BM(e) {
	return e.total === null ? null : Math.max(1, Math.ceil(e.total / e.size));
}
function VM(e, t) {
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
			let n = Number(t), r = BM(e);
			return !Number.isInteger(n) || n < 1 || r !== null && n > r || n === zM(e) ? null : (n - 1) * e.size;
		}
	}
}
function HM(e, t) {
	if (t <= LM) return WM(1, t);
	let n = Math.max(Math.min(e - IM, t - 2 - 2), 3), r = Math.min(Math.max(e + IM, 5), t - 2);
	return [
		1,
		n > 3 ? "gap" : 2,
		...WM(n, r),
		r < t - 2 ? "gap" : t - 1,
		t
	];
}
function UM(e, t) {
	let n = HM(e, t ? e + 1 : e);
	return t ? [...n, "gap"] : n;
}
function WM(e, t) {
	let n = [];
	for (let r = e; r <= t; r++) n.push(r);
	return n;
}
//#endregion
//#region src/interactions/pager-engine.ts
var GM = ".ui-pager", KM = "ui-pager__button", qM = "ui-pager__number", JM = "ui-pager__pages", YM = "ui-pager__gap", XM = "ui-pager__range", ZM = "ui-pager__size", QM = "ui-pager__size--open", $M = "ui-pager__size-trigger", eN = "ui-pager__size-label", tN = "ui-pager__sizes", nN = "ui-pager__size-choice", rN = [
	KM,
	qM,
	"ui-button",
	"ui-button--ghost",
	"ui-button--small"
], iN = "ui.pager.page", aN = "ui.pager.range", oN = "ui.pager.rows", sN = "ui.pager.size", cN = [
	Nt,
	Pt,
	It,
	Mt,
	jt
], lN = "page-size", uN = class {
	options;
	root;
	drawn = /* @__PURE__ */ new WeakMap();
	store = new gO();
	restored = /* @__PURE__ */ new WeakSet();
	menus = new $m({
		show: ({ owner: e }) => e.classList.add(QM),
		hide: ({ owner: e }) => e.classList.remove(QM),
		closesWhenReadOnly: !1,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.syncAll(), this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e)), (e.pageKeys ?? window).addEventListener("keydown", (e) => this.handlePageKey(e), !0), B(this.root, `${GM}, [${b}]`, {
			childList: !0,
			attributeFilter: cN,
			relevant: (e) => e.type === "attributes" || yN(e.target) || bN(e)
		}, (e) => this.syncFound(e)), D.onChange(() => {
			this.drawn = /* @__PURE__ */ new WeakMap(), this.syncAll();
		});
	}
	syncAll() {
		for (let e of this.root.querySelectorAll(GM)) this.sync(e);
	}
	syncFound(e) {
		for (let t of e) {
			if (t.matches(GM)) {
				this.sync(t);
				continue;
			}
			for (let e of this.pagersOf(t)) this.sync(e);
		}
	}
	pagersOf(e) {
		let t = e.closest(S), n = t === null ? 0 : E(t);
		return n > 0 ? [...this.root.querySelectorAll(`${GM}[${ot}="${C(n)}"]`)] : [];
	}
	hostOf(e) {
		return this.targetOf(e)?.host ?? null;
	}
	targetOf(e) {
		let t = Number(e.getAttribute(ot));
		if (!Number.isInteger(t) || t <= 0) return null;
		for (let e of this.options.dom.findEveryComponent(t)) {
			let t = vN(e);
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
		let i = RM(n), a = `${i.offset}|${i.count}|${i.size}|${i.total}|${i.moreAfter}`;
		if (this.drawn.get(e) === a) return;
		this.drawn.set(e, a);
		let o = Xx(e), s = (e) => Zx(e, "N0", o);
		this.drawNumbers(e, i, o), fN(e, i, s), pN(e, i, s);
		for (let t of e.querySelectorAll(`:scope > .${KM}[${st}]`)) ns.setDisabled(t, VM(i, t.getAttribute("data-ui-pager-page") ?? "") === null);
		hN(e);
	}
	drawNumbers(e, t, n) {
		let r = e.querySelector(`:scope > .${JM}`);
		if (r === null) return;
		let i = zM(t), a = BM(t), o = a === null ? UM(i, t.moreAfter) : HM(i, a), s = r.contains(document.activeElement);
		r.replaceChildren(...o.map((e) => dN(e, i, n))), s && !e.contains(document.activeElement) && r.querySelector("[aria-current='page']")?.focus({ preventScroll: !0 });
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(GM);
		if (t === null || O(e.target)) return;
		let n = e.target.closest(`.${nN}`);
		if (n !== null) {
			e.preventDefault(), this.chooseSize(t, Number(n.getAttribute(ct)));
			return;
		}
		let r = e.target.closest(`.${$M}`);
		if (r !== null) {
			e.preventDefault(), this.toggleSizes(r);
			return;
		}
		let i = e.target.closest(`[${st}]`), a = i === null ? null : this.hostOf(t);
		if (i === null || a === null) return;
		let o = VM(RM(a), i.getAttribute("data-ui-pager-page") ?? "");
		o !== null && (e.preventDefault(), this.turnAsync(a, o));
	}
	async turnAsync(e, t) {
		await this.options.windows.requestOffsetAsync(e, t), Jc(e).top > 0 && Yc(e, 0);
	}
	handleKeyDown(e) {
		if (e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(GM);
		if (t === null) return;
		let n = e.target.closest(`.${ZM}`);
		if (n !== null && this.handleSizeKey(e, n)) return;
		let r = e.target.closest(`.${KM}, .${$M}`), i = mN(t);
		if (r === null || !i.includes(r) || !M(e)) return;
		let a = Bc({
			key: e.key,
			items: i,
			current: r,
			axis: "horizontal"
		});
		a !== null && (e.preventDefault(), Uc(i, a));
	}
	handleSizeKey(e, t) {
		let n = e.target instanceof Element ? e.target.closest(`.${$M}`) : null;
		return n !== null && !this.menus.isOpen(t) && (e.key === "ArrowDown" || e.key === "ArrowUp") && M(e) ? (e.preventDefault(), this.openSizes(t, n, e.key === "ArrowUp"), !0) : this.menus.isOpen(t) && xD(e, _N(t));
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${nN}`) : null, n = t?.closest(`.${ZM}`) ?? null;
		t !== null && n !== null && this.menus.isOpen(n) && wD(t, _N(n));
	}
	toggleSizes(e) {
		let t = e.closest(`.${ZM}`);
		t !== null && (this.menus.isOpen(t) ? this.menus.close(t) : this.openSizes(t, e, !1));
	}
	openSizes(e, t, n) {
		let r = e.querySelector(`:scope > .${tN}`);
		if (r === null) return;
		let i = _N(e), a = i.find((e) => e.getAttribute("aria-checked") === "true") ?? null;
		bD(this.menus, {
			owner: e,
			popup: r,
			anchor: t,
			placement: { placement: "bottom-end" },
			openers: [t]
		}, i, a, n);
	}
	restoreSize(e, t, n) {
		let r = this.store.read(t, lN), i = r === null ? 0 : Number(r);
		if (!Number.isInteger(i) || i <= 0) return;
		if (!gN(e, i)) {
			this.store.write(t, lN, null);
			return;
		}
		let a = RM(n);
		i !== a.size && (n.setAttribute(Mt, String(i)), a.count > 0 && this.turnAsync(n, Math.floor(a.offset / i) * i));
	}
	chooseSize(e, t) {
		let n = e.querySelector(`.${ZM}`);
		n !== null && this.menus.close(n);
		let r = this.targetOf(e);
		if (r === null || !Number.isInteger(t) || t <= 0) return;
		let i = RM(r.host);
		t !== i.size && (this.store.write(r.component, lN, String(t)), r.host.setAttribute(Mt, String(t)), this.turnAsync(r.host, Math.floor(i.offset / t) * t));
	}
	handlePageKey(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "PageDown" && e.key !== "PageUp" || !M(e) || !(e.target instanceof Element)) return;
		let t = Xl(e);
		if (t === null || !t.root.matches(".ui-items-view, .ui-table") || O(t.root)) return;
		let n = vN(t.root);
		if (n === null || !n.hasAttribute("data-ui-window-paged")) return;
		let r = VM(RM(n), e.key === "PageDown" ? "next" : "previous");
		r !== null && (e.preventDefault(), this.turnFromKeyAsync(t.root, n, r));
	}
	async turnFromKeyAsync(e, t, n) {
		let r = Ll(e), i = eu(r), a = i === null ? 0 : Math.max(0, r.indexOf(i));
		await this.options.windows.requestOffsetAsync(t, n);
		let o = Ll(e);
		o.length > 0 && iu(e, o, o[Math.min(a, o.length - 1)]);
	}
};
function dN(e, t, n) {
	if (e === "gap") {
		let e = document.createElement("span");
		return e.className = YM, e.setAttribute("aria-hidden", "true"), e.textContent = "…", e;
	}
	let r = document.createElement("button"), i = Zx(e, "N0", n);
	return r.className = rN.join(" "), r.setAttribute("type", "button"), r.setAttribute(st, String(e)), r.textContent = i, D.write(r, "aria-label", iN, { page: i }), e === t && r.setAttribute("aria-current", "page"), r;
}
function fN(e, t, n) {
	let r = e.querySelector(`:scope > .${XM}`);
	if (r === null) return;
	let i = n(t.count === 0 ? 0 : t.offset + 1), a = n(t.offset + t.count);
	t.total === null ? D.write(r, null, oN, {
		from: i,
		to: a
	}) : D.write(r, null, aN, {
		from: i,
		to: a,
		total: n(t.total)
	});
}
function pN(e, t, n) {
	let r = e.querySelector(`:scope > .${ZM}`), i = r?.querySelector(`.${eN}`) ?? null;
	if (r !== null && i !== null) {
		D.write(i, null, sN, { size: n(t.size) });
		for (let e of _N(r)) e.setAttribute("aria-checked", Number(e.getAttribute("data-ui-pager-size")) === t.size ? "true" : "false");
	}
}
function mN(e) {
	return [...e.querySelectorAll(`.${KM}, .${$M}`)];
}
function hN(e) {
	let t = mN(e), n = t.find((e) => e === document.activeElement), r = t.filter((e) => e.getAttribute("data-ui-pager-page") === "previous" || e.getAttribute("data-ui-pager-page") === "next");
	N(t, n ?? r.find(P) ?? t.find((e) => e.getClientRects().length > 0) ?? null);
}
function gN(e, t) {
	let n = e.querySelector(`:scope > .${ZM}`);
	return n !== null && _N(n).some((e) => Number(e.getAttribute("data-ui-pager-size")) === t);
}
function _N(e) {
	return [...e.querySelectorAll(`:scope > .${tN} > .${nN}`)];
}
function vN(e) {
	for (let t of e.querySelectorAll(`[${b}][${wt}="windowed"]`)) if (t.closest(S) === e) return t;
	return null;
}
function yN(e) {
	return e instanceof Element && e.hasAttribute("data-ui-items-host");
}
function bN(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(GM) || t.querySelector(GM) !== null)) return !0;
	return !1;
}
//#endregion
//#region src/interactions/menu-search-engine.ts
var xN = `.${pn}[${Zt}]`, SN = ":scope > .ui-collapsible__bar", CN = ":scope > .ui-menu__host", wN = "ui-menu__item", TN = `:scope > .${x}`, EN = ":scope > .ui-menu__submenu > .ui-menu > .ui-menu__host", DN = class {
	active = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("input", (e) => this.handle(e), !0), t.addEventListener("change", (e) => this.handle(e), !0), t.addEventListener("keydown", (e) => this.handleKeydown(e)), B(t, xN, {
			childList: !0,
			characterData: !0,
			attributeFilter: [Ht]
		}, (e) => this.reconcile(e));
	}
	handle(e) {
		let t = e.target;
		if (!(t instanceof HTMLInputElement)) return;
		let n = ON(t);
		n !== null && this.search(n, t);
	}
	search(e, t) {
		let n = e.querySelector(CN);
		if (n === null) return;
		let r = dm(t.value, e);
		if (r.length === 0) {
			this.clear(e, n);
			return;
		}
		this.active.has(e) || this.active.set(e, {
			field: t,
			openBefore: kN(n)
		}), e.setAttribute(Qt, ""), Zy(e, n, !this.filter(n, r));
	}
	filter(e, t) {
		let n = null, r = !1, i = !1;
		for (let a of AN(e)) {
			let e = jN(a);
			if (e === "header") {
				n !== null && NN(n, r), n = a, r = !1;
				continue;
			}
			let o = e !== "separator" && this.match(a, t);
			NN(a, o), r ||= o, i ||= o;
		}
		return n !== null && NN(n, r), i;
	}
	match(e, t) {
		let n = pm(MN(e), t), r = e.hasAttribute("data-ui-menu-group") ? e.querySelector(EN) : null;
		if (r === null) return n;
		if (n) return PN(r), e.removeAttribute(Gt), !0;
		let i = this.filter(r, t);
		return e.toggleAttribute(Gt, i), i;
	}
	clear(e, t) {
		PN(t), e.removeAttribute(Qt), AN(t).length > 0 && Zy(e, t, !1);
		let n = this.active.get(e);
		if (n === void 0) return;
		this.active.delete(e);
		let r = e.hasAttribute(Ht);
		for (let e of t.querySelectorAll(`[${Ut}]:not([${Wt}])`)) e.toggleAttribute(Gt, !r && n.openBefore.has(e.getAttribute("data-ui-key") ?? e));
	}
	reconcile(e) {
		for (let t of e) {
			let e = this.active.get(t);
			e !== void 0 && (t.hasAttribute("data-ui-collapsed") && (e.field.value = "", e.field.blur()), this.search(t, e.field));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "ArrowDown" || e.defaultPrevented || !M(e) || !(e.target instanceof HTMLInputElement)) return;
		let t = ON(e.target), n = t === null ? void 0 : YO(t).find(P);
		n !== void 0 && (e.preventDefault(), n.focus());
	}
};
function ON(e) {
	let t = e.closest(xN), n = t?.querySelector(SN) ?? null;
	return t !== null && n !== null && n.contains(e) ? t : null;
}
function kN(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e.querySelectorAll(`[${Ut}][${Gt}]`)) t.add(n.getAttribute("data-ui-key") ?? n);
	return t;
}
function AN(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && e.classList.contains(wN));
}
function jN(e) {
	return e.querySelector(TN)?.getAttribute("data-ui-menu-item-kind") ?? "item";
}
function MN(e) {
	let t = e.querySelector(TN);
	return t === null ? "" : fm(gm(t), e);
}
function NN(e, t) {
	e.toggleAttribute($t, !t);
}
function PN(e) {
	for (let t of e.querySelectorAll(`[${$t}]`)) t.removeAttribute($t);
}
//#endregion
//#region src/interactions/screen-keyboard.ts
var FN = 120;
function IN(e) {
	return e.typing && e.tallest - e.height > FN;
}
var LN = class {
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
		let t = IN({
			height: e.height,
			tallest: this.tallest,
			typing: Ec(document.activeElement)
		});
		t !== document.documentElement.hasAttribute("data-ui-keyboard-up") && document.documentElement.toggleAttribute(wr, t);
	}
}, RN = "[data-ui-root]", zN = "a[href]", BN = "ui-collapsible", VN = "ui-collapsible__bar", HN = "right-side", UN = "ui-side--left", WN = "ui-side--right", GN = "pinned", KN = class {
	root;
	holders = /* @__PURE__ */ new Map();
	openers = /* @__PURE__ */ new WeakMap();
	switchNames = /* @__PURE__ */ new Map();
	store = new gO();
	constructor(e = {}) {
		if (this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), typeof matchMedia == "function") for (let e of oO) matchMedia(e).addEventListener("change", () => this.refit());
		for (let e of document.querySelectorAll(RN)) $N(e);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${en}]`);
		if (t !== null) {
			let e = t.closest(RN), n = t.getAttribute(en);
			e !== null && n !== null && this.toggle(e, n, t);
			return;
		}
		let n = e.target.closest(`[${on}]`);
		if (n !== null) {
			let e = n.closest(RN), t = n.getAttribute(on);
			e !== null && t !== null && this.pin(e, t, !e.hasAttribute(sn(t)), n);
			return;
		}
		if (e.target.closest("[data-ui-drawer-backdrop]") !== null) {
			this.closeAll();
			return;
		}
		let r = e.target.closest(`[${Cn}]`);
		if (r !== null && !e.defaultPrevented && XN(r)) {
			this.closeAll();
			return;
		}
		let i = e.target.closest(`${zN}, .${x}`), a = i?.closest(`[${dn}]`), o = a?.parentElement ?? null;
		i !== null && a != null && o?.getAttribute("data-ui-drawer-open") === a.getAttribute("data-ui-region") && ZN(i) && this.close(o);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || j(e)) return;
		if (e.key === "Tab") {
			this.trapTab(e);
			return;
		}
		if (e.key !== "Escape" || gc(e) || im()) return;
		let t = !1;
		for (let { shell: e, drawer: n, modal: r } of this.openDrawers()) !r && !n.contains(document.activeElement) || (this.close(e), t = !0);
		t && e.preventDefault();
	}
	trapTab(e) {
		for (let { drawer: t, modal: n } of this.openDrawers()) n && md(t, e);
	}
	openDrawers() {
		let e = [];
		for (let t of document.querySelectorAll(`${RN}[${tn}]`)) {
			let n = t.getAttribute("data-ui-drawer-open") ?? "", r = eP(t, n);
			r !== null && !Qp(r) && e.push({
				shell: t,
				drawer: r,
				modal: QN(t, n)
			});
		}
		return e;
	}
	refit() {
		for (let e of document.querySelectorAll(`${RN}[${tn}]`)) {
			let t = e.getAttribute("data-ui-drawer-open") ?? "", n = eP(e, t), r = this.openers.get(e);
			n === null || !lO(e, t) ? this.close(e) : r?.isConnected === !0 && this.placeSwitch(n, r);
		}
	}
	toggle(e, t, n) {
		if (e.getAttribute("data-ui-drawer-open") === t) {
			this.close(e);
			return;
		}
		let r = eP(e, t);
		r === null || r.hasAttribute("data-ui-bottom-bar") || !lO(e, t) || (e.hasAttribute("data-ui-drawer-open") && this.close(e), e.setAttribute(tn, t), this.openers.set(e, n), this.markToggles(e), this.hold(r, QN(e, t)), this.placeSwitch(r, n), this.focusInto(e, t, r, document.activeElement, td(), performance.now() + z.normal));
	}
	hold(e, t) {
		if (this.holders.has(e) || e.hasAttribute("data-ui-focus-holder")) return;
		let n = !e.hasAttribute("tabindex"), r = t && !e.hasAttribute("aria-label") && !e.hasAttribute("aria-labelledby");
		this.holders.set(e, {
			modal: t,
			addsTabIndex: n,
			addsName: r,
			role: e.getAttribute("role")
		}), n && (e.tabIndex = -1), t && (e.setAttribute(Xr, ""), e.setAttribute("role", "dialog"), e.setAttribute("aria-modal", "true"), r && e.setAttribute("aria-label", D.text("ui.side.panel")));
	}
	placeSwitch(e, t) {
		let n = qN(e), r = t.getBoundingClientRect();
		if (n === null) return;
		this.switchNames.has(n) || this.switchNames.set(n, n.getAttribute("aria-label")), n.setAttribute("aria-label", D.text("ui.side.close"));
		let i = n.parentElement?.classList.contains(VN) === !0 ? n.parentElement : n;
		if (r.width === 0 || r.height === 0) {
			n.removeAttribute(nn), i.removeAttribute(rn);
			return;
		}
		n.style.setProperty("--ui-drawer-switch-width", `${r.width}px`), n.style.setProperty("--ui-drawer-switch-height", `${r.height}px`), n.style.setProperty("--ui-drawer-switch-x", "0px"), i.style.setProperty("--ui-drawer-switch-y", "0px"), n.setAttribute(nn, ""), i.setAttribute(rn, "");
		let a = n.getBoundingClientRect(), o = e.getBoundingClientRect(), s = YN(r.left - e.offsetLeft, e.clientWidth - a.width), c = YN(r.top - o.top, e.clientHeight - a.height);
		n.style.setProperty("--ui-drawer-switch-x", `${s - (a.left - o.left)}px`), i.style.setProperty("--ui-drawer-switch-y", `${c - (a.top - o.top)}px`);
	}
	focusInto(e, t, n, r, i, a) {
		e.getAttribute("data-ui-drawer-open") !== t || document.activeElement !== r || n.contains(r) || (bd(n, i ? n : null), performance.now() < a && document.activeElement === r && requestAnimationFrame(() => this.focusInto(e, t, n, r, i, a)));
	}
	pin(e, t, n, r) {
		let i = eP(e, t);
		if (i === null || fO(e, t)) return;
		let a = i.contains(r);
		if (n && e.getAttribute("data-ui-drawer-open") === t && this.close(e, !a), e.toggleAttribute(sn(t), n), $N(e), !n && a && i.contains(document.activeElement)) {
			let n = this.returnTarget(e, t);
			n !== null && R(n);
		}
		let o = i.querySelector(`[${We}]`);
		o !== null && this.store.write(o, GN, n ? "true" : null, n ? {
			root: !0,
			attributes: { [sn(t)]: "" }
		} : null);
	}
	closeAll() {
		for (let e of document.querySelectorAll(`${RN}[${tn}]`)) this.close(e);
	}
	close(e, t = !0) {
		let n = e.getAttribute(tn);
		if (e.removeAttribute(tn), this.markToggles(e), n === null) return;
		let r = eP(e, n), i = document.activeElement;
		if (t && (i === null || i === document.body || r?.contains(i) === !0)) {
			let t = this.returnTarget(e, n);
			t !== null && r !== null && r.contains(i) ? Od(t, r) : t !== null && R(t);
		}
		this.release(r), this.renameSwitch(r);
	}
	returnTarget(e, t) {
		let n = this.openers.get(e);
		if (this.openers.delete(e), n?.isConnected === !0 && n.getAttribute("data-ui-drawer-toggle") === t && n.checkVisibility()) return n;
		let r = [...e.querySelectorAll(`[${en}="${C(t)}"]`)];
		return r.find((e) => e.checkVisibility()) ?? r[0] ?? null;
	}
	markToggles(e) {
		let t = e.getAttribute(tn);
		for (let n of e.querySelectorAll(`[${en}]`)) n.setAttribute("aria-expanded", String(n.getAttribute(en) === t));
	}
	release(e) {
		let t = e === null ? void 0 : this.holders.get(e);
		e !== null && t !== void 0 && (this.holders.delete(e), t.addsTabIndex && e.removeAttribute("tabindex"), t.modal && (e.removeAttribute(Xr), e.removeAttribute("aria-modal"), t.role === null ? e.removeAttribute("role") : e.setAttribute("role", t.role), t.addsName && e.removeAttribute("aria-label")));
	}
	renameSwitch(e) {
		for (let [t, n] of this.switchNames) e?.contains(t) !== !0 && t.isConnected || (this.switchNames.delete(t), n === null ? t.removeAttribute("aria-label") : t.setAttribute("aria-label", n));
	}
};
function qN(e) {
	for (let t of e.querySelectorAll(`[${Cn}]`)) if (XN(t) && t.checkVisibility() && JN(t.closest(`.${BN}`), e)) return t;
	return null;
}
function JN(e, t) {
	let n = e;
	for (; n !== null && n !== t;) {
		let e = n.parentElement;
		if (e === null || e.firstElementChild !== n) return !1;
		n = e;
	}
	return n === t;
}
function YN(e, t) {
	return Math.max(0, Math.min(e, t));
}
function XN(e) {
	let t = e.closest(`.${BN}`), n = t?.closest(`[${dn}]`), r = n?.getAttribute(dn), i = n?.parentElement;
	return t == null || t.hasAttribute("data-ui-collapsed") || r == null || i == null ? !1 : i.matches(RN) && i.getAttribute("data-ui-drawer-open") === r && t.classList.contains(r === HN ? WN : UN);
}
function ZN(e) {
	return !e.classList.contains("ui-menu-item") || JO(e) && e.closest(Yr) === null;
}
function QN(e, t) {
	return !(e.getAttribute("data-ui-drawer-modeless") ?? "").split(" ").includes(t);
}
function $N(e) {
	for (let t of e.querySelectorAll(`[${on}]`)) {
		let n = String(e.hasAttribute(sn(t.getAttribute("data-ui-drawer-pin") ?? "")));
		t.getAttribute("aria-pressed") !== n && (t.setAttribute("aria-pressed", n), t.getAttribute("data-ui-value-kind") === "pressed" && t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}
function eP(e, t) {
	return e.querySelector(`:scope > [${dn}="${C(t)}"]`);
}
//#endregion
//#region src/interactions/collapsible-engine.ts
var tP = "ui-collapsible", nP = "ui-collapsible__content", rP = "ui-collapsible__bar", iP = "ui-collapsible__bar-content", aP = "collapsed", oP = class {
	root;
	store = new gO();
	restored = /* @__PURE__ */ new WeakSet();
	folds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.restoreEach(this.root.querySelectorAll(`.${tP}`)), B(this.root, `.${tP}`, {
			childList: !0,
			attributeFilter: [Ht]
		}, (e) => this.restoreEach(e));
	}
	restoreEach(e) {
		for (let t of e) {
			if (this.restored.has(t)) {
				this.apply(t, t.hasAttribute(Ht));
				continue;
			}
			this.restored.add(t), this.restore(t);
		}
	}
	restore(e) {
		if (this.toggleOf(e) === null) return;
		let t = this.store.read(e, aP);
		t !== null && this.apply(e, t === "true");
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Cn}]`), n = t?.closest(`.${tP}`) ?? null;
		if (t === null || n === null || XN(t)) return;
		e.preventDefault();
		let r = !n.hasAttribute(Ht), i = this.partsOf(n, t);
		this.cancelFold(n);
		let a = cP(n, i);
		this.apply(n, r), this.playFold(n, i, a, r), this.store.write(n, aP, r ? "true" : "false", r ? { attributes: { [Ht]: "" } } : null);
	}
	apply(e, t) {
		e.toggleAttribute(Ht, t), this.toggleOf(e)?.setAttribute("aria-expanded", t ? "false" : "true");
	}
	partsOf(e, t) {
		return {
			content: e.querySelector(`:scope > .${nP}`),
			bar: e.querySelector(`:scope > .${rP} > .${iP}`),
			toggle: t
		};
	}
	toggleOf(e) {
		return e.querySelector(`:scope > [${Cn}], :scope > .${rP} > [${Cn}]`);
	}
	playFold(e, t, n, r) {
		if (typeof e.animate != "function" || Of()) return;
		let i = uP(sP(e), n, cP(e, t), r);
		if (i === null) return;
		e.setAttribute(wn, ""), e.offsetWidth;
		let a = {
			duration: z.normal,
			easing: z.ease
		}, o = [e.animate(i.component, a)];
		t.content !== null && o.push(t.content.animate(i.content, a)), t.bar !== null && o.push(t.bar.animate(i.bar, a)), i.toggle !== null && o.push(t.toggle.animate(i.toggle, a)), this.folds.set(e, o), Promise.allSettled(o.map((e) => e.finished)).then(() => {
			this.folds.get(e) === o && (this.folds.delete(e), e.removeAttribute(wn));
		});
	}
	cancelFold(e) {
		let t = this.folds.get(e);
		if (t !== void 0) {
			this.folds.delete(e), e.removeAttribute(wn);
			for (let e of t) e.cancel();
		}
	}
};
function sP(e) {
	return e.classList.contains("ui-side--top") || e.classList.contains("ui-side--bottom") ? "height" : "width";
}
function cP(e, t) {
	let n = sP(e), r = lP(n), i = e.getBoundingClientRect(), a = t.content?.getBoundingClientRect(), o = t.toggle.getBoundingClientRect();
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
function lP(e) {
	return e === "width" ? "height" : "width";
}
function uP(e, t, n, r) {
	let i = lP(e), a = t.component !== n.component, o = Math.abs(t.componentAcross - n.componentAcross) >= .5;
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
function dP(e, t) {
	if (typeof ResizeObserver == "function") {
		let n = new ResizeObserver(() => t(e));
		return n.observe(e), () => n.disconnect();
	}
	let n = () => t(e);
	return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
}
//#endregion
//#region src/interactions/grid-splitter-engine.ts
var fP = "ui-grid-splitter", pP = "ui-container", mP = "ui-orientation--vertical", hP = 16, gP = {
	sliver: 0,
	passFloors: !0
}, _P = {
	sliver: 48,
	passFloors: !0
}, vP = {
	slot: "columns",
	authored: "--ui-columns",
	split: "--ui-split-columns",
	limits: Tn,
	computed: "gridTemplateColumns",
	lineStart: "gridColumnStart",
	lineEnd: "gridColumnEnd",
	coordinate: "clientX",
	decrease: "ArrowLeft",
	increase: "ArrowRight"
}, yP = {
	slot: "rows",
	authored: "--ui-rows",
	split: "--ui-split-rows",
	limits: En,
	computed: "gridTemplateRows",
	lineStart: "gridRowStart",
	lineEnd: "gridRowEnd",
	coordinate: "clientY",
	decrease: "ArrowUp",
	increase: "ArrowDown"
}, bP = class {
	root;
	store = new gO();
	restored = /* @__PURE__ */ new WeakMap();
	warner = new p();
	drag;
	placedTiers = /* @__PURE__ */ new WeakMap();
	waiting = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new _m({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${fP}`),
			begin: (e) => this.resolveContext(e),
			coordinate: (e) => e.axis.coordinate,
			move: (e, t) => {
				this.apply(e, t, gP) && this.reportPosition(e.splitter, e.tracks);
			},
			end: (e, t) => {
				this.settle(e), this.remember(t), this.reportPosition(e), this.writeBack(e, t);
			}
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.prepareEach(this.root.querySelectorAll(`.${fP}`)), B(this.root, `.${fP}`, { childList: !0 }, (e) => this.prepareEach(e)), B(this.root, `.${fP}`, { attributeFilter: [On] }, (e) => this.takeEach(e)), window.addEventListener("resize", () => this.reportEach());
	}
	prepareEach(e) {
		for (let t of e) {
			let e = CP(t);
			e !== null && (this.restore(e, wP(t)), this.place(t), this.reportPosition(t));
		}
	}
	restore(e, t) {
		let n = this.restored.get(e);
		if (n === void 0 && (n = /* @__PURE__ */ new Set(), this.restored.set(e, n)), n.has(t.slot)) return;
		n.add(t.slot);
		let r = this.store.readJson(e, t.slot);
		if (r !== null) for (let n of jf) {
			let i = r[n], a = If(t.split, n);
			i !== void 0 && e.style.getPropertyValue(a).length === 0 && e.style.setProperty(a, i);
		}
	}
	place(e) {
		let t = jP(e);
		if (t === null) return;
		if (e.getClientRects().length === 0) {
			this.waitForBox(e);
			return;
		}
		this.stopWaiting(e);
		let n = this.resolveContext(e);
		if (n === null || (this.placedTiers.set(e, n.tier), !e.hasAttribute("data-ui-bind-position") && EP(n.container, n.axis, n.tier) !== void 0)) return;
		let r = Ds(n.sizes, n.runs, t);
		Math.abs(r) >= 1 && this.apply(n, r) && this.remember(n);
	}
	waitForBox(e) {
		this.waiting.has(e) || this.waiting.set(e, dP(e, () => {
			!e.isConnected || jP(e) === null ? this.stopWaiting(e) : e.getClientRects().length > 0 && (this.place(e), this.reportPosition(e));
		}));
	}
	stopWaiting(e) {
		this.waiting.get(e)?.(), this.waiting.delete(e);
	}
	takeEach(e) {
		for (let t of e) jP(t) === null && t.hasAttribute("data-ui-bind-position") ? this.reset(t, !1) : this.place(t), this.reportPosition(t);
	}
	reportEach() {
		let e = Ff();
		for (let t of this.root.querySelectorAll(`.${fP}`)) this.placedTiers.has(t) && this.placedTiers.get(t) !== e && this.place(t), this.reportPosition(t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || !M(e)) return;
		let t = e.target.closest(`.${fP}`);
		if (t === null || this.drag.active || O(t)) return;
		if (e.key === "Enter") {
			e.preventDefault(), this.reset(t);
			return;
		}
		let n = this.resolveContext(t);
		if (n === null) return;
		let r = NP(t), i = n.sizes.reduce((e, t) => e + t, 0), a;
		switch (e.key) {
			case n.axis.decrease:
				a = -r;
				break;
			case n.axis.increase:
				a = r;
				break;
			case "PageUp":
			case "PageDown":
				a = rs(r, i) * AP(e.key, n.axis);
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
		let n = CP(e);
		if (n === null) return;
		let r = wP(e);
		for (let e of jf) n.style.removeProperty(If(r.split, e));
		this.store.write(n, r.slot, null), this.placedTiers.delete(e), e.hasAttribute("data-ui-bind-position") || this.place(e), this.reportPosition(e), t && e.hasAttribute("data-ui-bind-position") && e.hasAttribute("data-ui-splitter-position") && (e.removeAttribute(On), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	writeBack(e, t) {
		if (!e.hasAttribute("data-ui-bind-position")) return;
		let n = MP(Es(DP(t.container, t.axis), t.runs));
		e.getAttribute("data-ui-splitter-position") !== n && (e.setAttribute(On, n), this.placedTiers.set(e, t.tier), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	handleDoubleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${fP}`) : null;
		t !== null && this.reset(t);
	}
	settle(e) {
		let t = this.resolveContext(e), n = t === null ? 0 : js(t.tracks, t.sizes, t.runs, 48);
		t !== null && n !== 0 && this.apply(t, n, gP);
	}
	apply(e, t, n = _P) {
		let r = gs(e.tracks, e.sizes, e.runs, t, n);
		return r !== null && (e.container.style.setProperty(If(e.axis.split, e.tier), cs(r)), !0);
	}
	remember(e) {
		let { container: t, axis: n } = e, r = {}, i = {};
		for (let e of jf) {
			let a = If(n.split, e), o = t.style.getPropertyValue(a).trim();
			o.length > 0 && (r[e] = o, i[a] = o);
		}
		let a = { styles: i };
		this.store.write(t, n.slot, Object.keys(r).length === 0 ? null : JSON.stringify(r), a);
	}
	resolveContext(e) {
		let t = CP(e);
		if (t === null) return this.warner.warn(e, "a grid splitter must be a direct child of a container."), null;
		let n = wP(e), r = Ff(), i = TP(t, n, r), a = i === null ? null : is(i);
		if (a === null) return this.warner.warn(e, "the container's track list could not be read.", { template: i }), null;
		let o = fs(a, ds(t.getAttribute(n.limits))), s = DP(t, n), c = OP(e, n);
		if (c === null || c >= o.length || s.length < o.length) return this.warner.warn(e, "the splitter's track could not be found in its container.", {
			index: c,
			tracks: o.length,
			sizes: s.length
		}), null;
		o[c].kind === "star" && this.warner.warn(e, "a grid splitter sits in a star track and shares the room it divides; give it an Auto or Absolute track.");
		let l = ps(c, kP(t, n).map((e) => OP(e, n)).filter((e) => e !== null && e !== c), o.length);
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
		let n = CP(e);
		if (n === null) return;
		let r = wP(e), i = OP(e, r), a = DP(n, r), o = kP(n, r).map((e) => OP(e, r)).filter((e) => e !== null && e !== i), s = i === null ? null : ps(i, o, a.length);
		if (s === null) return;
		e.setAttribute("aria-valuemin", "0"), e.setAttribute("aria-valuemax", "100"), e.setAttribute("aria-valuenow", String(Ts(a, s)));
		let c = xP(a, s.before) ? "before" : xP(a, s.after) ? "after" : null;
		c === null ? e.removeAttribute(Dr) : e.getAttribute("data-ui-split-edge") !== c && e.setAttribute(Dr, c), SP(n, t === void 0 ? null : {
			axis: r,
			tracks: Ms(t, a, s, 48)
		});
	}
};
function xP(e, t) {
	return t.every((t) => (e[t] ?? 0) < 1);
}
function SP(e, t) {
	let n = [vP, yP].filter((t) => kP(e, t).length > 0).map((t) => ({
		axis: t,
		sizes: DP(e, t)
	}));
	for (let r of e.children) {
		if (!(r instanceof HTMLElement)) continue;
		let e = getComputedStyle(r), i = r.classList.contains(fP) ? wP(r) : null, a = n.some(({ axis: n, sizes: r }) => n !== i && Ps(e[n.lineStart], e[n.lineEnd], r, t?.axis === n ? t.tracks : void 0));
		a !== r.hasAttribute("data-ui-split-folded") && r.toggleAttribute(Er, a);
	}
}
function CP(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(pP) ? t : null;
}
function wP(e) {
	return e.classList.contains(mP) ? vP : yP;
}
function TP(e, t, n) {
	let r = EP(e, t, n);
	if (r !== void 0) return r;
	let i = e.style.getPropertyValue(t.authored).trim();
	return i.length > 0 ? i : null;
}
function EP(e, t, n) {
	return zf(n, (n) => e.style.getPropertyValue(If(t.split, n)).trim() || void 0);
}
function DP(e, t) {
	return getComputedStyle(e)[t.computed].split(" ").map(parseFloat).filter((e) => Number.isFinite(e));
}
function OP(e, t) {
	let n = Number(getComputedStyle(e)[t.lineStart]);
	return Number.isInteger(n) && n >= 1 ? n - 1 : null;
}
function kP(e, t) {
	let n = [];
	for (let r of e.children) r instanceof HTMLElement && r.classList.contains(fP) && wP(r) === t && n.push(r);
	return n;
}
function AP(e, t) {
	return t.increase === "ArrowDown" ? e === "PageDown" ? 1 : -1 : e === "PageUp" ? 1 : -1;
}
function jP(e) {
	return Os(e.getAttribute(On));
}
function MP(e) {
	return String(Math.round(e * 1e4) / 1e4);
}
function NP(e) {
	let t = Number(e.getAttribute(Dn));
	return Number.isFinite(t) && t > 0 ? t : hP;
}
//#endregion
//#region src/interactions/pane-container-engine.ts
var PP = "ui-pane-container", FP = "ui-pane-container__place", IP = "ui-pane-container__pane", LP = "ui-pane-container__grip", RP = "data-ui-pane-lifted", zP = "data-ui-pane-target", BP = "data-ui-pane-moving", VP = "data-ui-pane-near", HP = "panes", UP = ",", WP = 32, GP = class {
	root;
	store = new gO();
	drag;
	restored = /* @__PURE__ */ new WeakSet();
	held = null;
	near = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new _m({
			root: this.root,
			resolveHandle: (e) => qP(e),
			begin: (e, t) => this.lift(e, t),
			move: (e, t, n) => this.follow(e, n),
			end: (e, t) => this.put(t),
			cancel: (e, t) => this.putBack(t),
			takenBack: (e, t) => this.putBack(t)
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), { passive: !0 }), this.root.addEventListener("pointerout", (e) => this.handlePointerOut(e), { passive: !0 }), this.arrangeEach(this.root.querySelectorAll(`.${PP}`), !1), B(this.root, `.${PP}`, {
			childList: !0,
			attributeFilter: [kn],
			relevant: YP
		}, (e) => this.arrangeEach(XP(e), !0));
	}
	arrangeEach(e, t) {
		for (let n of e) {
			let e = !this.restored.has(n);
			e && (this.restored.add(n), this.restore(n)), n.hasAttribute(BP) || tF(n, $P(n), t && !e);
		}
	}
	restore(e) {
		if (e.hasAttribute("data-ui-bind-layout")) return;
		let t = this.store.read(e, HP);
		t !== null && e.setAttribute(kn, t);
	}
	lift(e, t) {
		this.dropStaleHold();
		let n = e.parentElement, r = n?.parentElement, i = r?.parentElement;
		if (this.held !== null || n === null || r == null || i == null || QP(i).length < 2) return null;
		if (typeof n.getAnimations == "function") for (let e of n.getAnimations()) e.cancel();
		return n.setAttribute(RP, ""), i.setAttribute(BP, ""), {
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
		e.pane.style.transform = `translate(${t.x - e.start.x}px, ${t.y - e.start.y}px)`, this.mark(e, oF(e.container, e.origin, t));
	}
	mark(e, t) {
		e.target !== t && (e.target?.removeAttribute(zP), t?.setAttribute(zP, ""), e.target = t);
	}
	put(e) {
		let t = e.target, n = e.pane.parentElement, r = t?.querySelector(`:scope > .${IP}`) ?? null;
		if (t === null || n === null || r === e.pane || !e.container.isConnected) {
			this.putBack(e);
			return;
		}
		this.settle(e);
		let i = /* @__PURE__ */ new Map([[e.pane, t]]);
		r !== null && i.set(r, n), nF(i, !0), this.keep(e.container);
	}
	putBack(e) {
		this.settle(e), rF(e.pane), e.container.isConnected && tF(e.container, $P(e.container), !0);
	}
	settle(e) {
		e.target?.removeAttribute(zP), e.pane.removeAttribute(RP), e.container.removeAttribute(BP);
	}
	keep(e) {
		let t = eF(e);
		e.setAttribute(kn, t), e.hasAttribute("data-ui-bind-layout") ? e.dispatchEvent(new Event("change", { bubbles: !0 })) : this.store.write(e, HP, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || !M(e)) return;
		this.dropStaleHold();
		let t = qP(e.target);
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
		let r = KP[e.key];
		if (r !== void 0) {
			e.preventDefault(), this.mark(n, sF(n.container, n.origin, n.target ?? n.origin, r) ?? n.target);
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
		let t = e.target instanceof Element ? JP(e.target) : null;
		this.markNear(t !== null && e.clientY - t.getBoundingClientRect().top < WP ? t : null);
	}
	markNear(e) {
		e !== this.near && (this.near?.removeAttribute(VP), e?.setAttribute(VP, ""), this.near = e);
	}
	handlePointerOut(e) {
		e instanceof PointerEvent && e.relatedTarget === null && this.markNear(null);
	}
}, KP = {
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
function qP(e) {
	let t = e.closest(`.${LP}`);
	return t?.parentElement?.parentElement?.parentElement?.classList.contains(PP) === !0 ? t : null;
}
function JP(e) {
	let t = e.closest(`.${IP}`);
	return t?.parentElement?.parentElement?.classList.contains(PP) === !0 ? t : null;
}
function YP(e) {
	if (e.type === "attributes") return e.target instanceof Element && e.target.classList.contains(PP);
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains(PP) || t.querySelector(`.${PP}`) !== null)) return !0;
	return !1;
}
function XP(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) {
		t.add(n);
		for (let e of n.querySelectorAll(`.${PP}`)) t.add(e);
	}
	return t;
}
function ZP(e) {
	return Array.from(e.querySelectorAll(`:scope > .${FP}`));
}
function QP(e) {
	return ZP(e).filter((e) => e.getClientRects().length > 0);
}
function $P(e) {
	return e.getAttribute(kn);
}
function eF(e) {
	return ZP(e).map((e) => e.querySelector(`:scope > .${IP}`)?.getAttribute("data-ui-pane") ?? "").join(UP);
}
function tF(e, t, n) {
	let r = ZP(e), i = aF(r.map((e) => e.getAttribute("data-ui-pane-place") ?? ""), t), a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
	for (let e of r) {
		let t = e.querySelector(`:scope > .${IP}`), n = t?.getAttribute(An);
		t != null && n != null && a.set(n, t);
	}
	r.forEach((e, t) => {
		let n = a.get(i[t]);
		n !== void 0 && n.parentElement !== e && o.set(n, e);
	}), o.size > 0 && nF(o, n);
}
function nF(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let t of e.keys()) n.set(t, t.getBoundingClientRect());
	for (let [t, n] of e) t.style.transform = "", n.append(t);
	if (!t || Of()) return;
	let r = e.size + 1;
	for (let [e, t] of n) {
		let n = typeof e.animate == "function" ? iF(t, e.getBoundingClientRect()) : null, i = String(r--);
		n !== null && e.animate(n.map((e) => ({
			...e,
			zIndex: i
		})), {
			duration: z.normal + 60,
			easing: z.ease
		});
	}
}
function rF(e) {
	let t = e.style.transform;
	e.style.transform = "", !(t.length === 0 || t === "translate(0px, 0px)" || Of() || typeof e.animate != "function") && e.animate([{ transform: t }, { transform: "none" }], {
		duration: z.normal,
		easing: z.ease
	});
}
function iF(e, t) {
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
function aF(e, t) {
	let n = new Set(e), r = /* @__PURE__ */ new Set(), i = e.map(() => null), a = t === null || t.length === 0 ? [] : t.split(UP).map((e) => e.trim());
	for (let e = 0; e < i.length && e < a.length; e++) n.has(a[e]) && !r.has(a[e]) && (i[e] = a[e], r.add(a[e]));
	let o = e.filter((e) => !r.has(e));
	return i.map((e) => e ?? o.shift() ?? "");
}
function oF(e, t, n) {
	for (let r of QP(e)) {
		if (r === t) continue;
		let e = r.getBoundingClientRect();
		if (n.x >= e.left && n.x <= e.right && n.y >= e.top && n.y <= e.bottom) return r;
	}
	return null;
}
function sF(e, t, n, r) {
	let i = QP(e).map((e) => ({
		place: e,
		box: e.getBoundingClientRect()
	})), a = i.find((e) => e.place === n)?.box;
	if (a === void 0) return null;
	let o = lF(cF(a), i.map((e) => e.place === t || e.place === n ? null : cF(e.box)), r);
	return o === null ? null : i[o].place;
}
function cF(e) {
	return {
		x: e.left + e.width / 2,
		y: e.top + e.height / 2
	};
}
function lF(e, t, n) {
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
var uF = "ui-split-button", dF = "ui-split-button__main", fF = "ui-split-button__toggle", pF = "ui-split-button__menu", mF = "ui-split-button--open", hF = class {
	root;
	menus = new $m({
		show: ({ owner: e }) => e.classList.add(mF),
		hide: ({ owner: e }) => e.classList.remove(mF),
		closesWhenReadOnly: !1,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), document.addEventListener("click", (e) => this.handleChoice(e), !1);
	}
	handleClick(e) {
		let t = gF(e.target);
		if (t !== null) {
			e.preventDefault(), this.menus.isOpen(t) ? this.menus.close(t) : this.openMenu(t);
			return;
		}
		let n = this.menus.current;
		n !== null && e.target instanceof Element && e.target.closest(`.${dF}`)?.closest(`.${uF}`) === n && this.menus.close(n);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "ArrowDown" && e.key !== "ArrowUp" || !M(e)) return;
		let t = gF(e.target);
		t === null || this.menus.isOpen(t) || (e.preventDefault(), this.openMenu(t, e.key === "ArrowUp"));
	}
	handleChoice(e) {
		let t = this.menus.current;
		if (t === null || !(e.target instanceof Element)) return;
		let n = _F(t), r = e.target.closest(`.${x}`);
		n !== null && r !== null && n.contains(r) && JO(r) && this.menus.close(t);
	}
	openMenu(e, t = !1) {
		let n = _F(e), r = n?.querySelector(".ui-menu") ?? null;
		if (n === null || r === null) return;
		let i = e.getAttribute("data-ui-split-placement") ?? "";
		this.menus.open({
			owner: e,
			popup: n,
			anchor: e,
			placement: { placement: Vf(i) ? i : "bottom-end" },
			openers: vF(e)
		}) && Cd(r, YO(r), t);
	}
};
function gF(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${fF}, .${dF}`), n = t?.closest(`.${uF}`) ?? null;
	return t === null || n === null || t.classList.contains(dF) && n.getAttribute("data-ui-split-mode") !== "menu" ? null : n;
}
function _F(e) {
	return e.querySelector(`:scope > .${pF}`);
}
function vF(e) {
	return [...e.querySelectorAll(":scope > [aria-haspopup]")];
}
//#endregion
//#region src/interactions/button-group-engine.ts
var yF = "ui-button-group", bF = "ui-button-group__item", xF = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${yF}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), B(this.root, `.${yF}`, {
			childList: !0,
			attributeFilter: [Pr]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-selected-key") ?? "", n = [], r = null;
		for (let i of this.ownItems(e)) {
			let e = t.length > 0 && i.getAttribute("data-ui-key") === t, a = SF(i);
			i.toggleAttribute(Nr, e), a !== null && (a.setAttribute("aria-pressed", e ? "true" : "false"), n.push(a), e && (r = a));
		}
		N(n, r ?? n.find(P) ?? null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${bF}`), n = t?.closest(`.${yF}`) ?? null;
		if (t === null || n === null || t.closest(`.${yF}`) !== n || O(n)) return;
		let r = SF(t);
		r !== null && O(r) || this.choose(n, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${bF} > .${ti}`), n = t?.closest(`.${yF}`) ?? null;
		if (t === null || n === null || !M(e)) return;
		let r = this.ownItems(n).map(SF).filter((e) => e !== null), i = Bc({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault(), i.focus({ preventScroll: !0 });
		let a = i.closest(`.${bF}`);
		a !== null && this.choose(n, a);
	}
	choose(e, t) {
		ul(e, t.getAttribute("data-ui-key") ?? "", {
			attribute: Pr,
			bindingAttribute: Ir,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return cl(e, `.${bF}`, `.${yF}`);
	}
};
function SF(e) {
	return e.querySelector(`:scope > .${ti}`);
}
//#endregion
//#region src/interactions/accordion-engine.ts
var CF = "ui-accordion", wF = "details", TF = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleSummaryClick(e), !0), this.root.addEventListener("toggle", (e) => this.handleToggle(e), !0), this.normalizeAll(this.root.querySelectorAll(`.${CF}`)), B(this.root, `.${CF}`, { childList: !0 }, (e) => this.normalizeAll(e));
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
		if (!(t === null || !t.classList.contains(CF))) for (let n of this.sectionsOf(t)) n !== e && n.open && (n.open = !1);
	}
	sectionsOf(e) {
		return [...e.querySelectorAll(`:scope > ${wF}`)];
	}
}, EF = "ui-tab-overflow", DF = "ui-tab-overflow__menu", OF = "ui-tab-overflow__menu--open", kF = "ui-tab-overflow__entry", AF = "ui-tab-overflow__entry--current", jF = class {
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
		this.options = e, this.list = new PF(e.pick);
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
		let r = () => e.classList.add(this.options.overflowingClass), i = this.options.trailing === !0 ? this.fitTrailing(t, r) : MF({
			...t,
			hiddenClass: this.options.hiddenClass,
			showButton: r
		});
		e.classList.toggle(this.options.overflowingClass, i), i || this.closeListOf(e);
	}
	fitTrailing(e, t) {
		for (let t of e.captions) this.resizes?.observe(t);
		return NF(e, this.options.hiddenClass, t);
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
function MF(e) {
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
function NF(e, t, n) {
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
var PF = class {
	menu;
	button = null;
	list = new $m({
		show: ({ popup: e }) => e.classList.add(OF),
		hide: ({ popup: e }) => {
			e.classList.remove(OF), this.button = null;
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e) || this.button !== null && t.includes(this.button),
		onWindowBlur: !0,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	pick;
	constructor(e) {
		this.pick = e, this.menu = document.createElement("div"), this.menu.className = DF, this.menu.setAttribute("role", "menu"), this.menu.addEventListener("click", (e) => this.handleClick(e)), this.menu.addEventListener("keydown", (e) => this.handleKeydown(e)), this.menu.addEventListener("pointermove", (e) => this.handlePointerMove(e));
	}
	isOpenFor(e) {
		return this.list.isOpen(e);
	}
	open(e, t, n) {
		this.close(), this.menu.replaceChildren(...n.map(FF)), this.menu.parentElement === null && document.body.appendChild(this.menu);
		let r = this.menu.querySelector(`.${AF}`);
		this.button = e, Zf(e, this.menu);
		let i = {
			owner: t,
			popup: this.menu,
			anchor: e,
			placement: { placement: "bottom-end" },
			openers: [e],
			returnFocus: () => e
		};
		bD(this.list, i, this.entries(), r) || (this.button = null);
	}
	close() {
		this.list.close();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${kF}`), n = t?.getAttribute("data-ui-key") ?? null, r = this.list.current;
		t === null || n === null || r === null || O(t) || (this.close(), this.pick(r, n));
	}
	handleKeydown(e) {
		e.defaultPrevented || xD(e, this.entries());
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${kF}`) : null;
		t !== null && wD(t, this.entries());
	}
	entries() {
		return Array.from(this.menu.querySelectorAll(`.${kF}`));
	}
};
function FF(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${kF} ${ni}`, t.classList.toggle(AF, e.current), t.setAttribute("role", "menuitem"), t.setAttribute(y, e.key), t.textContent = e.title, e.current && t.setAttribute("aria-current", "true"), e.disabled && (t.classList.add(Ur), t.setAttribute("aria-disabled", "true")), t;
}
//#endregion
//#region src/interactions/tab-switch.ts
var IF = "data-ui-caption-text", LF = ".ui-text__title";
function RF(e) {
	for (let t of e.querySelectorAll(LF)) {
		let e = t.textContent ?? "";
		t.getAttribute(IF) !== e && t.setAttribute(IF, e);
	}
}
function zF(e, t) {
	if (e === null || t === null || e === t || typeof t.animate != "function" || Of()) return;
	let n = e.getBoundingClientRect(), r = t.getBoundingClientRect();
	n.width !== 0 && r.width !== 0 && t.animate([{ transform: `translateX(${n.left - r.left}px) scaleX(${n.width / r.width})` }, { transform: "none" }], {
		duration: z.normal,
		easing: z.ease,
		pseudoElement: "::after"
	});
}
function BF(e) {
	if (!(e === null || Of())) for (let t of e.children) typeof t.animate == "function" && t.animate([{ opacity: 0 }, { opacity: 1 }], {
		duration: z.fast,
		easing: z.enter
	});
}
//#endregion
//#region src/interactions/tabs-engine.ts
var VF = "ui-tabs", HF = "ui-tab-header", UF = "ui-tab-header--selected", WF = "ui-tab-header--overflowed", GF = "ui-tabs--overflowing", KF = "ui-tabs--no-overflow", qF = "ui-tabs__strip", JF = "data-ui-tab-key", YF = "data-ui-tab-page", XF = class {
	root;
	fitter;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new jF({
			rootClass: VF,
			overflowingClass: GF,
			wraps: (e) => e.classList.contains(KF),
			hiddenClass: WF,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${VF}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), B(this.root, `.${VF}`, {
			childList: !0,
			attributeFilter: [Lr, ...Br],
			relevant: (e) => !Hp(e, `[${YF}]`, `.${VF}`)
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-tabs-selected") ?? "", n = this.ownHeaders(e), r = n.filter(ZF), i = dl(r, t, (e) => e.getAttribute(JF) ?? "");
		if (i !== null && i !== t) {
			this.select(e, i);
			return;
		}
		let a = n.find((e) => e.classList.contains(UF)) ?? null, o = null;
		for (let e of n) {
			let n = (e.getAttribute(JF) ?? "") === t;
			e.classList.toggle(UF, n), e.setAttribute("aria-selected", n ? "true" : "false"), RF(e), n && (o = e);
		}
		this.fitHeaders(e, r, o), zF(a, o), N(n.filter((e) => !e.classList.contains(WF)), o);
		for (let n of this.ownPages(e)) n.hidden = (n.getAttribute(YF) ?? "") !== t, !n.hidden && a !== null && a !== o && BF(n);
	}
	fitHeaders(e, t, n) {
		let r = e.querySelector(`:scope > .${qF}`), i = r?.querySelector(":scope > .ui-tab-overflow") ?? null;
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownHeaders(e).find((e) => (e.getAttribute(JF) ?? "") === t)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownHeaders(e).filter(ZF).map((e) => {
				let n = e.getAttribute(JF) ?? "";
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
		let t = e.target.closest(`.${EF}`), n = t?.closest(`.${VF}`) ?? null;
		if (t !== null && n !== null && t.closest(`.${VF}`) === n) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = e.target.closest(`.${HF}`);
		if (r === null || O(r)) return;
		let i = r.closest(`.${VF}`), a = r.getAttribute(JF);
		i !== null && a !== null && r.closest(`.${VF}`) === i && (e.preventDefault(), this.select(i, a));
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || Dc(e) || !M(e)) return;
		let t = e.target.closest(`.${HF}`), n = t?.closest(`.${VF}`) ?? null;
		if (t === null || n === null) return;
		let r = Bc({
			key: e.key,
			items: this.ownHeaders(n),
			current: t,
			axis: "horizontal"
		});
		r !== null && (e.preventDefault(), this.select(n, r.getAttribute(JF) ?? ""), r.focus());
	}
	select(e, t) {
		ul(e, t, {
			attribute: Lr,
			bindingAttribute: Ir,
			apply: (e) => this.apply(e)
		});
	}
	ownHeaders(e) {
		return cl(e, `.${HF}`, `.${VF}`);
	}
	ownPages(e) {
		return cl(e, `[${YF}]`, `.${VF}`);
	}
};
function ZF(e) {
	return e.classList.contains(WF) || Nk(e);
}
//#endregion
//#region src/interactions/tab-out.ts
function QF(e) {
	e.hasAttribute("data-ui-tab-out") || (e.setAttribute(Ne, e.getAttribute("tabindex") ?? ""), e.setAttribute("tabindex", "-1"));
}
function $F(e) {
	let t = e.getAttribute(Ne);
	t !== null && (e.removeAttribute(Ne), t.length === 0 ? e.removeAttribute("tabindex") : e.setAttribute("tabindex", t));
}
function eI(e) {
	return e.tabIndex >= 0 || e.hasAttribute("data-ui-tab-out");
}
//#endregion
//#region src/interactions/command-bar-engine.ts
var tI = "ui-command-bar", nI = "ui-command-bar__host", rI = "ui-command-bar__item", iI = "ui-command-bar__overflow", aI = "ui-command-bar--overflowing", oI = "ui-command-bar__overflowed", sI = "ui-orientation--vertical", cI = "ui-text__title", lI = `${Vu}, [${Ne}]`, uI = class {
	root;
	fitter;
	listed = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new jF({
			rootClass: tI,
			overflowingClass: aI,
			wraps: (e) => !mI(e),
			hiddenClass: oI,
			trailing: !0,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pick(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${tI}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), B(this.root, `.${tI}`, { childList: !0 }, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = dI(e), n = e.querySelector(`:scope > .${iI}`);
		if (t === null || n === null) return;
		let r = hI(t);
		this.fitter.fit(e, {
			room: e,
			button: n,
			captions: r,
			selected: null
		}), e.classList.contains(aI) && gI(r);
		for (let e of r) Yf(e, e.classList.contains(oI) ? n : null);
		e.classList.contains(sI) ? e.setAttribute("aria-orientation", "vertical") : e.removeAttribute("aria-orientation"), fI(e, null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${iI}`), n = t?.parentElement ?? null;
		t === null || n === null || !n.classList.contains(tI) || (e.preventDefault(), this.fitter.toggleList(n, t, () => this.entriesOf(n)));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof HTMLElement) || !M(e) || Dc(e)) return;
		let t = e.target.closest(`.${tI}`), n = t === null ? [] : pI(t);
		if (t === null || !n.includes(e.target)) return;
		let r = Bc({
			key: e.key,
			items: n,
			current: e.target,
			axis: t.classList.contains(sI) ? "vertical" : "horizontal"
		});
		r !== null && (e.preventDefault(), fI(t, r), r.focus());
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement ? e.target : null, n = t?.closest(`.${tI}`) ?? null;
		t !== null && n !== null && pI(n).includes(t) && fI(n, t);
	}
	entriesOf(e) {
		let t = dI(e), n = t === null ? [] : hI(t).filter((e) => e.classList.contains(rI) && e.classList.contains(oI)).map((e) => e.querySelector(S) ?? e);
		return this.listed.set(e, n), n.map((e, t) => ({
			key: String(t),
			title: _I(e),
			current: !1,
			disabled: O(e)
		}));
	}
	pick(e, t) {
		let n = this.listed.get(e)?.[Number(t)];
		n?.isConnected === !0 && !O(n) && vI(n).click();
	}
};
function dI(e) {
	return e.querySelector(`:scope > .${nI}`);
}
function fI(e, t) {
	let n = pI(e), r = n.find((e) => e.tabIndex >= 0 && P(e)), i = t ?? n.find((e) => e === document.activeElement) ?? r ?? n.find(P) ?? null;
	for (let e of n) e === i ? $F(e) : QF(e);
}
function pI(e) {
	let t = dI(e), n = [];
	for (let e of t === null ? [] : hI(t)) if (!(!e.classList.contains(rI) || e.classList.contains(oI))) for (let t of e.querySelectorAll(lI)) eI(t) && Rc(e, t) && n.push(t);
	let r = e.querySelector(`:scope > .${iI}`);
	return r !== null && e.classList.contains(aI) && n.push(r), n;
}
function mI(e) {
	let t = dI(e);
	if (t === null) return !1;
	let n = getComputedStyle(t);
	return n.flexDirection.startsWith("row") && n.flexWrap === "nowrap";
}
function hI(e) {
	let t = [];
	for (let n of Array.from(e.children)) {
		if (n.classList.contains("ui-hidden")) continue;
		if (n.hasAttribute("data-ui-group-header")) {
			t.push(n);
			continue;
		}
		let e = n.classList.contains(rI) ? n.querySelector(S) : null;
		e !== null && Nk(e) && t.push(n);
	}
	return t;
}
function gI(e) {
	let t = !1;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.classList.contains(rI) ? t ||= !r.classList.contains(oI) : t || r.classList.add(oI);
	}
}
function _I(e) {
	let t = vI(e), n = t.querySelector(`.${cI}`)?.textContent?.trim() ?? "";
	return n.length > 0 ? n : e.getAttribute("aria-label")?.trim() || t.getAttribute("aria-label")?.trim() || t.textContent?.trim() || "";
}
function vI(e) {
	return e.matches(Vu) ? e : e.querySelector(Vu) ?? e;
}
//#endregion
//#region src/interactions/breadcrumbs-engine.ts
var yI = "ui-breadcrumbs", bI = "ui-breadcrumbs__item", xI = "ui-breadcrumb", SI = "ui-breadcrumb--current", CI = "ui-hidden", wI = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), B(this.root, `.${yI}`, {
			childList: !0,
			attributeFilter: ["class", ...Br]
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${yI}`)) this.apply(e);
	}
	apply(e) {
		let t = cl(e, `.${bI}`, `.${yI}`);
		TI(t);
		let n = t.filter((e) => !e.classList.contains(CI)).map((e) => e.querySelector(`.${xI}`)).filter((e) => e !== null && !e.classList.contains(CI)), r = n.length === 0 ? null : n[n.length - 1];
		for (let e of n) {
			let t = e === r;
			e.classList.toggle(SI, t), t ? (e.setAttribute("aria-current", "page"), e.setAttribute("tabindex", "-1")) : (e.removeAttribute("aria-current"), e.removeAttribute("tabindex"));
		}
	}
};
function TI(e) {
	let t = jf.map(() => !1);
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n], i = jf.map((e, t) => EI(r, t));
		if (DI(r, lr, jf.filter((e, t) => i[t])), DI(r, ur, jf.filter((e, n) => !t[n])), !r.classList.contains(CI)) for (let e = 0; e < jf.length; e++) t[e] ||= !i[e];
	}
}
function EI(e, t) {
	for (let n of e.children) if (n.getAttribute(Br[t]) === "collapsed") return !0;
	return !1;
}
function DI(e, t, n) {
	let r = n.join(" ");
	r.length === 0 ? e.removeAttribute(t) : e.getAttribute(t) !== r && e.setAttribute(t, r);
}
//#endregion
//#region src/rendering/color-bytes.ts
function OI(e) {
	return Number.isFinite(e) ? Math.min(255, Math.max(0, Math.round(e))) : 0;
}
function kI(e) {
	return OI(e).toString(16).padStart(2, "0").toUpperCase();
}
function AI(e, t, n, r) {
	let i = r / 255, a = (e) => Math.round(e * i + 255 * (1 - i));
	return (jI(a(e), a(t), a(n)) + .05) ** 2 > 1.05 * .05 ? "var(--ui-color-on-light)" : "var(--ui-color-on-dark)";
}
function jI(e, t, n) {
	return .2126 * MI(e) + .7152 * MI(t) + .0722 * MI(n);
}
function MI(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
//#endregion
//#region src/interactions/color-input-engine.ts
var NI = "ui-color-input", PI = "ui-color-input--open", FI = "ui-color-input__popup", II = "ui-color-input__text", LI = "ui-color-input__row", RI = "ui-color-input__swatch--button", zI = "ui-color-input__value-input", BI = "ui-color-input__square-thumb", VI = "ui-color-input__hue-thumb", HI = "data-ui-color-toggle", UI = "data-ui-color-tab", WI = "data-ui-color-tab-selected", GI = "data-ui-color-pane", KI = "data-ui-color-pane-selected", qI = "data-ui-color-square", JI = "data-ui-color-hue", YI = "data-ui-color-hex", XI = "data-ui-color-channel", ZI = "data-ui-color-factor", QI = "data-ui-color-opacity", $I = "data-ui-color-name", eL = "data-ui-color-name-selected", tL = "data-ui-color-format", nL = "data-ui-color-variant", rL = "data-ui-color-no-picker", iL = "data-ui-color-no-palette", aL = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	popups = new $m({
		show: ({ owner: e }) => e.classList.add(PI),
		hide: ({ owner: e }) => e.classList.remove(PI)
	});
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${NI}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(Qi(e.components, `.${NI}`));
		}), B(this.root, `.${NI}`, {
			childList: !0,
			attributeFilter: [
				tL,
				nL,
				rL,
				iL
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), new _m({
			root: this.root,
			resolveHandle: (e) => e.closest(`[${qI}], [${JI}]`),
			begin: (e, t) => {
				let n = e.closest(`.${NI}`);
				if (n === null) return null;
				let r = {
					input: n,
					element: e,
					surface: e.hasAttribute(qI) ? "square" : "hue",
					stateBefore: this.states.get(n),
					valueBefore: n.querySelector(`.${zI}`)?.value ?? null
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
		let t = uL(e), n = this.states.get(e), r = n?.paneChosen === !0 ? oL(e, n.pane) : sL(e);
		if (t.length === 0 || t.startsWith("@")) return {
			...n ?? cL(r),
			pane: r,
			held: !1
		};
		if (t.startsWith("#")) {
			let i = vL(t);
			if (i === null) return n ?? cL(r);
			let [a, o, s, c] = i;
			if (n !== void 0 && n.name === null && lL(this.resolveRgb(e, n), [
				a,
				o,
				s
			])) return {
				...n,
				pane: r,
				opacity: c,
				held: !0
			};
			let [l, u, d] = xL(a, o, s);
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
			...n ?? cL(r),
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
			let [e, a, o] = xL(n, r, i);
			t = {
				...t,
				hue: e,
				saturation: a,
				value: o
			};
		}
		let a = this.states.get(e);
		this.states.set(e, t), mL(e, "--ui-color-input-color", t.held ? bL(n, r, i, t.opacity) : "transparent"), mL(e, "--ui-color-input-solid", bL(n, r, i, 255)), mL(e, "--ui-color-input-on-color", t.held ? AI(n, r, i, t.opacity) : "inherit"), pL(e, t.held ? fL(e, n, r, i, t.opacity) : ""), this.applyPicker(e, t, n, r, i), (a === void 0 || a.name !== t.name || a.pane !== t.pane || a.held !== t.held) && (this.applyPalette(e, t), this.applyPanes(e, t));
	}
	applyPicker(e, t, n, r, i) {
		let a = e.querySelector(`[${qI}]`), o = e.querySelector(`[${JI}]`), [s, c, l] = SL(t.hue, 1, 1);
		if (mL(e, "--ui-color-input-hue", bL(s, c, l, 255)), a !== null) {
			let e = a.querySelector(`.${BI}`);
			e !== null && (mL(e, "left", `${t.saturation * 100}%`), mL(e, "top", `${(1 - t.value) * 100}%`));
		}
		if (o !== null) {
			let e = o.querySelector(`.${VI}`);
			e !== null && mL(e, "top", `${t.hue / 360 * 100}%`);
		}
		hL(e, `[${YI}]`, yL(n, r, i)), hL(e, `[${XI}="r"]`, String(n)), hL(e, `[${XI}="g"]`, String(r)), hL(e, `[${XI}="b"]`, String(i)), mL(e, "--ui-color-input-opacity-fill", `${t.opacity / 255 * 100}%`), gL(e, `[${QI}]`, t.opacity);
	}
	applyPalette(e, t) {
		for (let n of e.querySelectorAll(`[${$I}]`)) n.getAttribute($I) === t.name ? n.setAttribute(eL, "") : n.removeAttribute(eL);
		let n = t.name === null ? null : e.querySelector(`[${$I}="${t.name}"]`), r = n === null ? null : vL(n.style.getPropertyValue("--ui-color-input-chip").trim());
		mL(e, "--ui-color-input-base", r === null ? "transparent" : bL(r[0], r[1], r[2], 255)), gL(e, `[${ZI}]`, t.factor);
	}
	applyPanes(e, t) {
		for (let n of e.querySelectorAll(`[${GI}]`)) n.getAttribute(GI) === t.pane ? n.setAttribute(KI, "") : n.removeAttribute(KI);
		for (let n of e.querySelectorAll(`[${UI}]`)) n.getAttribute(UI) === t.pane ? n.setAttribute(WI, "") : n.removeAttribute(WI);
	}
	resolveRgb(e, t) {
		if (t.name === null) return SL(t.hue, t.saturation, t.value);
		let n = e.querySelector(`[${$I}="${t.name}"]`), r = n === null ? null : vL(n.style.getPropertyValue("--ui-color-input-chip").trim());
		return r === null ? SL(t.hue, t.saturation, t.value) : _L([
			r[0],
			r[1],
			r[2]
		], t.factor);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${HI}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${NI}`));
			return;
		}
		let n = e.target.closest(`[${UI}]`), r = e.target.closest(`.${NI}`);
		if (r === null) return;
		if (n !== null) {
			e.preventDefault();
			let t = n.getAttribute(UI), i = this.states.get(r);
			i !== void 0 && (t === "picker" || t === "palette") && this.applyState(r, {
				...i,
				pane: t,
				paneChosen: !0
			});
			return;
		}
		let i = e.target.closest(`[${$I}]`);
		if (i !== null) {
			e.preventDefault(), this.commit(r, (e) => ({
				...e,
				name: i.getAttribute($I)
			}));
			return;
		}
		let a = r.querySelector(`.${FI}`);
		(a === null || !e.composedPath().includes(a)) && (e.preventDefault(), this.toggle(r));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target.closest(`.${NI}`);
		if (t !== null) {
			if (e.target.hasAttribute(ZI)) {
				this.commit(t, (t) => ({
					...t,
					factor: Number(e.target instanceof HTMLInputElement ? e.target.value : 0)
				}), !1);
				return;
			}
			e.target.hasAttribute(QI) && this.commit(t, (t) => ({
				...t,
				opacity: OI(Number(e.target instanceof HTMLInputElement ? e.target.value : 255))
			}), !1);
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target, n = t.closest(`.${NI}`);
		if (n === null) return;
		if (t.hasAttribute(ZI) || t.hasAttribute(QI)) {
			this.send(n);
			return;
		}
		if (t.hasAttribute(YI)) {
			let e = vL(t.value);
			if (e === null) {
				this.applyAll([n]);
				return;
			}
			let [r, i, a] = xL(e[0], e[1], e[2]);
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
		let r = t.getAttribute(XI);
		if (r === null) return;
		let i = this.states.get(n);
		if (i === void 0) return;
		let [a, o, s] = this.resolveRgb(n, i), c = {
			r: a,
			g: o,
			b: s
		};
		c[r] = OI(Number(t.value));
		let [l, u, d] = xL(c.r, c.g, c.b);
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
		let t = e.input.querySelector(`.${zI}`);
		t !== null && e.valueBefore !== null && (t.value = e.valueBefore);
	}
	applyPoint(e, t) {
		let { input: n, element: r, surface: i } = e, a = r.getBoundingClientRect();
		if (i === "hue") {
			let e = CL((t.y - a.top) / a.height);
			this.commit(n, (t) => ({
				...t,
				hue: e * 360,
				name: null
			}), !1);
			return;
		}
		let o = CL((t.x - a.left) / a.width), s = 1 - CL((t.y - a.top) / a.height);
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
		let a = e.querySelector(`.${zI}`);
		a !== null && (a.value = dL(i, this.resolveRgb(e, i)), n && this.send(e));
	}
	send(e) {
		A(e) || e.querySelector(`.${zI}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	toggle(e) {
		if (e === null || e.hasAttribute(rL) && e.hasAttribute(iL)) return;
		if (this.popups.isOpen(e)) {
			this.popups.close(e);
			return;
		}
		let t = e.querySelector(`.${FI}`);
		if (t === null) return;
		let n = e.getAttribute(nL) === "swatch", r = n ? e.querySelector(`.${RI}`) : e.querySelector(`.${LI}`), i = n ? r : r?.querySelector(`[${HI}]`) ?? null;
		this.popups.open({
			owner: e,
			popup: t,
			anchor: r ?? e,
			placement: { placement: "bottom-end" },
			openers: i === null ? [] : [i],
			focus: t.querySelector(`[${WI}]`) ?? !0
		});
	}
};
function oL(e, t) {
	return ((t) => !e.hasAttribute(t === "picker" ? rL : iL))(t) ? t : t === "picker" ? "palette" : "picker";
}
function sL(e) {
	return oL(e, "picker");
}
function cL(e) {
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
function lL(e, t) {
	return e[0] === t[0] && e[1] === t[1] && e[2] === t[2];
}
function uL(e) {
	return e.querySelector(`.${zI}`)?.value.trim() ?? "";
}
function dL(e, t) {
	if (e.name !== null) {
		let t = e.factor === 0 ? "None" : e.factor < 0 ? "Shade" : "Tint";
		return `${e.name}/${t}/${Math.abs(e.factor)}/${e.opacity}`;
	}
	let n = yL(t[0], t[1], t[2]);
	return e.opacity === 255 ? n : `${n}${kI(e.opacity)}`;
}
function fL(e, t, n, r, i) {
	if (e.getAttribute(tL) === "rgb") return i === 255 ? `rgb(${t}, ${n}, ${r})` : `rgba(${t}, ${n}, ${r}, ${(i / 255).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")})`;
	let a = yL(t, n, r);
	return i === 255 ? a : `${a}${kI(i)}`;
}
function pL(e, t) {
	for (let n of e.querySelectorAll(`.${II}`)) n.textContent !== t && (n.textContent = t);
}
function mL(e, t, n) {
	e !== null && e.style.getPropertyValue(t) !== n && e.style.setProperty(t, n);
}
function hL(e, t, n) {
	let r = e.querySelector(t);
	r !== null && r !== document.activeElement && r.value !== n && (r.value = n);
}
function gL(e, t, n) {
	for (let r of e.querySelectorAll(t)) r !== document.activeElement && r.value !== String(n) && (r.value = String(n));
}
function _L(e, t) {
	if (t === 0) return e;
	let n = Math.abs(t) / 10;
	return t < 0 ? [
		OI(e[0] * (1 - n)),
		OI(e[1] * (1 - n)),
		OI(e[2] * (1 - n))
	] : [
		OI(e[0] + (255 - e[0]) * n),
		OI(e[1] + (255 - e[1]) * n),
		OI(e[2] + (255 - e[2]) * n)
	];
}
function vL(e) {
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
function yL(e, t, n) {
	return `#${kI(e)}${kI(t)}${kI(n)}`;
}
function bL(e, t, n, r) {
	return `rgba(${e}, ${t}, ${n}, ${(r / 255).toFixed(3)})`;
}
function xL(e, t, n) {
	let r = e / 255, i = t / 255, a = n / 255, o = Math.max(r, i, a), s = o - Math.min(r, i, a), c = 0;
	return s !== 0 && (c = o === r ? (i - a) / s % 6 : o === i ? (a - r) / s + 2 : (r - i) / s + 4, c *= 60, c < 0 && (c += 360)), [
		c,
		o === 0 ? 0 : s / o,
		o
	];
}
function SL(e, t, n) {
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
		OI((o + a) * 255),
		OI((s + a) * 255),
		OI((c + a) * 255)
	];
}
function CL(e) {
	return Math.min(1, Math.max(0, e));
}
//#endregion
//#region src/interactions/surface-press-engine.ts
var wL = `:is(.ui-surface, .ui-card)[${v}]`, TL = "ui-surface--clickable", EL = class {
	pressable = /* @__PURE__ */ new WeakSet();
	space = new nc();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("keydown", (e) => this.handleKeyDown(e)), t.addEventListener("keyup", (e) => this.space.release(e)), jL(t, ["hover", "press"], (e) => AL(e.closest(Nc))), B(t, wL, {
			childList: !0,
			attributeFilter: ["class"]
		}, (e) => this.syncEach(e)), this.syncEach(t.querySelectorAll(wL));
	}
	syncEach(e) {
		for (let t of e) {
			this.sync(t);
			let e = t.parentElement?.closest(wL) ?? null;
			e !== null && this.sync(e);
		}
	}
	sync(e) {
		if (!e.classList.contains(TL)) {
			this.pressable.delete(e) && (e.removeAttribute("tabindex"), e.removeAttribute("role"));
			return;
		}
		this.pressable.add(e), NL(e, "role", kL(e) ? "group" : "button"), NL(e, "tabindex", e.matches(".ui-disabled, .ui-loading") ? null : OL(e) ? "-1" : "0");
	}
	handleKeyDown(e) {
		let t = DL(e);
		if (t === null) return;
		let n = e.key;
		n === "Enter" ? (e.preventDefault(), e.repeat || t.click()) : n === " " && (e.preventDefault(), this.space.hold(t));
	}
};
function DL(e) {
	if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !M(e, { shift: !0 })) return null;
	let t = e.target;
	return t instanceof HTMLElement && t.classList.contains(TL) && t.hasAttribute("tabindex") ? t : null;
}
function OL(e) {
	let t = e.closest(pl);
	return t !== null && t.closest(F)?.matches(".ui-items-view, .ui-table") === !0 && Fc(t) === e;
}
function kL(e) {
	for (let t of e.querySelectorAll(Nc)) if (Rc(e, t)) return !0;
	return !1;
}
function AL(e) {
	let t = [];
	for (let n = e?.parentElement?.closest(`.${TL}`) ?? null; n !== null; n = n.parentElement?.closest(`.${TL}`) ?? null) t.push(n);
	return t;
}
function jL(e, t, n) {
	let r = {
		hover: [],
		press: []
	}, i = !1, a = (e, t) => {
		let a = t instanceof Element ? n(t) : [];
		e === "press" && (i = !1);
		for (let t of r[e]) a.includes(t) || ML(t, e, !1);
		for (let t of a) ML(t, e, !0);
		r[e] = a;
	};
	t.includes("hover") && (e.addEventListener("pointerover", (e) => a("hover", e.target)), e.addEventListener("pointerout", (e) => a("hover", e.relatedTarget))), t.includes("press") && (e.addEventListener("pointerdown", (e) => a("press", e.button === 0 ? e.target : null), !0), e.addEventListener("pointerup", () => a("press", null), !0), e.addEventListener("dragend", () => a("press", null), !0), e.addEventListener("dragstart", () => {
		i = r.press.length > 0;
	}, !0), e.addEventListener("pointercancel", () => {
		i || a("press", null);
	}, !0));
}
function ML(e, t, n) {
	let r = (e.getAttribute("data-ui-inner-pointer") ?? "").split(" ").filter((e) => e !== "" && e !== t);
	n && r.push(t), NL(e, jr, r.length === 0 ? null : r.sort().join(" "));
}
function NL(e, t, n) {
	n === null ? e.removeAttribute(t) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/interactions/table-columns-engine.ts
var PL = "ui-table", FL = "ui-table--reorderable", IL = "ui-scroll-x--auto", LL = "ui-scroll-x--always", RL = `:scope > .${In}`, zL = `.${Rn}`, BL = "ui-table__header-cell", VL = `${BL}--pinned`, HL = `${RL} > .${Ln} > .${BL}`, UL = `${HL}--pinned`, WL = "ui-table__host", GL = `${RL} > .${WL}`, KL = `.${PL}, .${Fn}, [${jn}]`, qL = "--ui-table-columns", JL = "--ui-table-sticky-top", YL = "--ui-table-sticky-bottom", XL = "--ui-table-sized-columns", ZL = "--ui-table-pin-", QL = 64, $L = "data-ui-table-cell-hidden", eR = "data-ui-table-cell-last", tR = "columns", nR = "hidden", rR = "order", iR = "layout", aR = 32, oR = 16, sR = class {
	root;
	store = new gO();
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
		if (this.root = e.root ?? document, this.drag = new _m({
			root: this.root,
			resolveHandle: (e) => e.closest(zL),
			begin: (e) => this.resolveContext(e),
			coordinate: () => "clientX",
			move: (e, t) => this.apply(e, t),
			end: (e, t) => this.remember(t.table)
		}), this.reorder = new _m({
			root: this.root,
			resolveHandle: (e) => this.resolveCaption(e),
			begin: (e, t) => this.beginReorder(e, t.x),
			coordinate: () => "clientX",
			move: (e, t) => this.aimDrop(e, t),
			end: (e, t) => this.endReorder(e, t)
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), jL(this.root, ["hover", "press"], (e) => {
			let t = e.closest(zL)?.parentElement ?? null;
			return t === null ? [] : [t];
		}), typeof matchMedia == "function") for (let e of jf) e !== "base" && matchMedia(Nf(e)).addEventListener("change", () => this.layoutAll());
		this.restoreEach(this.root.querySelectorAll(`.${PL}`)), B(this.root, `.${PL}`, {
			childList: !0,
			relevant: fR
		}, (e) => {
			for (let t of e) this.restored.has(t) && (this.stampUnstyledColumns(t, !0), this.indexColumns(t, !0));
			this.restoreEach(e);
		}), B(this.root, `.${PL}`, {
			attributeFilter: ["class"],
			relevant: (e) => e.target instanceof Element && e.target.classList.contains(PL)
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.layout(t);
		}), B(this.root, `.${PL}`, {
			childList: !0,
			attributeFilter: ["class", "hidden"],
			relevant: pR
		}, (e) => {
			for (let t of e) {
				let e = t.querySelector(GL);
				e !== null && t.hasAttribute("data-ui-table-scrollbar") && this.markScrollbar(t, e);
			}
		});
	}
	restoreEach(e) {
		for (let t of e) {
			if (this.restored.has(t)) continue;
			this.restored.add(t), this.restore(t), this.layout(t), dP(t, () => this.pin(t));
			let e = t.querySelector(RL);
			e !== null && dP(e, () => cR(t, e));
			let n = t.querySelector(GL);
			n !== null && (this.markScrollbar(t, n), dP(n, () => this.markScrollbar(t, n)));
		}
	}
	restore(e) {
		let t = this.columnsOf(e), n = this.store.read(e, tR), r = n === null ? null : is(n);
		r !== null && r.length !== t.length ? (this.store.write(e, tR, null), this.store.writeBoot(e, iR, null), this.widths.set(e, null)) : this.widths.set(e, r);
		let i = this.store.readJson(e, rR);
		if (i !== null && !hR(i, t)) {
			this.store.write(e, rR, null), this.orders.set(e, null);
			return;
		}
		this.orders.set(e, i);
	}
	markScrollbar(e, t) {
		let n = getComputedStyle(t).overflowY;
		e.toggleAttribute(Yn, n === "scroll" || n === "auto" && t.scrollHeight > t.clientHeight);
	}
	layoutAll() {
		for (let e of this.root.querySelectorAll(`.${PL}`)) this.layout(e);
	}
	layout(e) {
		let t = this.columnsOf(e), n = this.hiddenOf(e, t), r = this.placesOf(e, t), i = mR(r), a = this.widths.get(e) ?? null, o = r.some((e, t) => e !== t), s = e.classList.contains(IL) || e.classList.contains(LL);
		if (a === null && n.size === 0 && !o && !s) e.style.removeProperty(XL);
		else {
			let t = a ?? this.authoredTracks(e);
			if (t !== null) {
				let r = Ns(t, n);
				e.style.setProperty(XL, cs(i.map((e) => r[e]), s ? "max-content" : "auto"));
			}
		}
		for (let t = 0; t < r.length; t++) o ? e.style.setProperty(`${Rl}${t}`, String(r[t])) : e.style.removeProperty(`${Rl}${t}`);
		let c = [...n].sort((e, t) => e - t).join(" ");
		c.length === 0 ? e.removeAttribute(Pn) : e.getAttribute("data-ui-table-hidden") !== c && e.setAttribute(Pn, c);
		let l = [...i].reverse().find((e) => !n.has(e));
		if (l === void 0 ? e.removeAttribute(Wn) : e.getAttribute("data-ui-table-last") !== String(l) && e.setAttribute(Wn, String(l)), this.columnStates.set(e, {
			places: r,
			hidden: n,
			last: l ?? -1
		}), this.stampUnstyledColumns(e, !1), this.indexColumns(e, !1), e.classList.contains(FL)) for (let e of t) !e.anchored && !e.cell.hasAttribute("tabindex") && e.cell.setAttribute("tabindex", "-1");
		this.pin(e);
	}
	stampUnstyledColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0 || n.places.length <= QL) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}|${n.last}`;
		if (!(!t && this.stampedStates.get(e) === r)) {
			this.stampedStates.set(e, r);
			for (let t of e.querySelectorAll(`[${jn}]`)) {
				let r = Number(t.getAttribute(jn));
				!(r >= QL) || t.closest(`.${PL}`) !== e || (t.style.order = String(n.places[r] ?? r), t.toggleAttribute($L, n.hidden.has(r)), t.toggleAttribute(eR, r === n.last));
			}
		}
	}
	indexColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}`, i = this.indexedStates.get(e) === r;
		i && !t || (this.indexedStates.set(e, r), Ul(e, mR(n.places), n.hidden, i));
	}
	columnsOf(e) {
		let t = [];
		for (let n of e.querySelectorAll(HL)) {
			let e = Number(n.getAttribute(jn)), r = n.getAttribute(Mn), i = n.classList.contains(VL) || n.hasAttribute("data-ui-table-fixed");
			Number.isInteger(e) && t.push({
				index: e,
				key: n.getAttribute("data-ui-table-column-key") ?? String(e),
				hideBelow: yR(r) ? r : null,
				startsHidden: n.hasAttribute(Nn),
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
		for (let e of t) (n[e.key] ?? vR(e)) && r.add(e.index);
		return r;
	}
	choicesOf(e) {
		let t = this.hiddenChoices.get(e);
		return t === void 0 && (t = this.store.readJson(e, nR) ?? {}, this.hiddenChoices.set(e, t)), t;
	}
	authoredTracks(e) {
		let t = e.style.getPropertyValue(qL).trim(), n = t.length === 0 ? null : is(t);
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
		n === null || i !== void 0 && n === vR(i) ? delete r[t] : r[t] = n, this.hiddenChoices.set(e, r), this.store.writeJson(e, nR, Object.keys(r).length === 0 ? null : r), this.layout(e), this.rememberBoot(e);
	}
	columnOrder(e) {
		if (!(e instanceof HTMLElement)) return [];
		let t = this.columnsOf(e), n = new Map(t.map((e) => [e.index, e]));
		return mR(this.placesOf(e, t)).map((e) => n.get(e)?.key ?? "").filter((e) => e.length > 0);
	}
	pin(e) {
		let t = e.querySelectorAll(UL).length;
		if (t < 2) return;
		let n = ks(this.trackSizes(e), t);
		for (let t = 1; t < n.length; t++) e.style.setProperty(`${ZL}${t}`, `${n[t]}px`);
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof HTMLElement) || !t.classList.contains("ui-table__scroll") || t.closest(`.${PL}`)?.toggleAttribute(Jn, t.scrollLeft > 0);
	}
	trackSizes(e) {
		let t = e.querySelector(RL), n = t === null ? [] : getComputedStyle(t).gridTemplateColumns.split(" ").map(parseFloat);
		return uR(e) ? n.slice(1) : n;
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
		let t = e.target.closest(zL), n = t ?? (e.shiftKey ? lR(e.target) : null);
		if (n === null || this.drag.active || !M(e, { shift: t === null })) return;
		if (t !== null && e.key === "Enter" || t === null && e.key === "Backspace") {
			e.preventDefault(), this.reset(n);
			return;
		}
		let r = e.key === "PageUp" || e.key === "PageDown";
		if (!r && e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
		let i = this.resolveContext(n);
		if (i === null) return;
		let a = r ? rs(oR, i.sizes.reduce((e, t) => e + t, 0)) : oR;
		e.preventDefault(), this.apply(i, e.key === "ArrowRight" || e.key === "PageUp" ? a : -a) && this.remember(i.table);
	}
	stepColumn(e, t) {
		let n = e.target instanceof Element ? this.resolveCaption(e.target) : null, r = n?.closest(`.${PL}`) ?? null;
		if (n === null || r === null || this.reorder.active) return;
		let i = this.movableColumns(r), a = Number(n.getAttribute(jn)), o = i.findIndex((e) => e.index === a), s = o + t;
		o < 0 || (e.preventDefault(), !(s < 0 || s >= i.length) && (this.moveColumn(r, a, t < 0 ? i[s].index : i[s + 1]?.index ?? null), n.focus({ preventScroll: !0 })));
	}
	handleDoubleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(zL) : null;
		t !== null && this.reset(t);
	}
	reset(e) {
		let t = e.closest(`.${PL}`);
		t !== null && (this.widths.set(t, null), this.layout(t), this.remember(t));
	}
	apply(e, t) {
		let n = gs(e.tracks.map((t, n) => n === e.index || n === e.after ? {
			...t,
			min: Math.max(aR, e.floors.get(n) ?? 0)
		} : t), e.sizes, {
			before: [e.index],
			after: [e.after]
		}, t);
		return n !== null && (this.widths.set(e.table, dR(e.tracks, n, [e.index, e.after])), this.layout(e.table), !0);
	}
	remember(e) {
		let t = this.widths.get(e) ?? null;
		this.store.write(e, tR, t === null ? null : cs(t), null), this.rememberBoot(e);
	}
	rememberBoot(e) {
		let t = e.style.getPropertyValue(XL).trim(), n = e.getAttribute(Pn), r = {};
		t.length > 0 && (r[XL] = t);
		for (let t of e.style) t.startsWith("--ui-table-order-") && (r[t] = e.style.getPropertyValue(t));
		if (Object.keys(r).length === 0 && n === null) {
			this.store.writeBoot(e, iR, null);
			return;
		}
		this.store.writeBoot(e, iR, {
			styles: r,
			attributes: {
				[Pn]: n,
				[Wn]: e.getAttribute(Wn)
			}
		});
	}
	resolveContext(e) {
		let t = e.closest(`.${PL}`);
		if (t === null) return null;
		let n = this.widths.get(t) ?? this.authoredTracks(t);
		if (n === null) return null;
		let r = ds(t.getAttribute(Tn)), i = fs(n, r), a = /* @__PURE__ */ new Map(), o = this.columnsOf(t), s = this.placesOf(t, o), c = this.columnSizes(t, s).filter((e) => Number.isFinite(e));
		for (let e of r) e.min !== void 0 && a.set(e.index, e.min);
		let l = Number(e.getAttribute(jn)), u = this.hiddenOf(t, o), d = mR(s), f = (s[l] ?? -1) + 1;
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
		let t = e.closest(`.${BL}`), n = t?.closest(`.${PL}`) ?? null;
		return t === null || n === null || !n.classList.contains(FL) || e.closest(zL) !== null || t.classList.contains(VL) || t.hasAttribute("data-ui-table-fixed") ? null : t;
	}
	beginReorder(e, t) {
		let n = e.closest(`.${PL}`), r = Number(e.getAttribute(jn));
		if (n === null || !Number.isInteger(r)) return null;
		let i = this.movableColumns(n), a = i.findIndex((e) => e.index === r);
		return a < 0 || i.length < 2 ? null : (n.setAttribute(Gn, ""), e.setAttribute(Kn, ""), {
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
		for (let a of mR(this.placesOf(e, t))) {
			let e = r.get(a);
			e !== void 0 && !e.anchored && !n.has(a) && i.push(e);
		}
		return i;
	}
	aimDrop(e, t) {
		let n = e.origin + t, r = 0;
		for (; r < e.places.length && n > gR(e.places[r]);) r++;
		if (e.target = Math.min(Math.max(r > e.from ? r - 1 : r, 0), e.places.length - 1), _R(e.table), e.target === e.from) return;
		let i = e.places.filter((t, n) => n !== e.from), a = i[e.target];
		a === void 0 ? i[i.length - 1].cell.setAttribute(qn, "after") : a.cell.setAttribute(qn, "before");
	}
	endReorder(e, t) {
		if (e.removeAttribute(Kn), t.table.removeAttribute(Gn), _R(t.table), t.target === t.from) return;
		let n = t.places.filter((e, n) => n !== t.from);
		ym(), this.moveColumn(t.table, t.index, n[t.target]?.index ?? null);
	}
	moveColumn(e, t, n) {
		let r = this.columnsOf(e), i = new Map(r.map((e) => [e.index, e])), a = mR(this.placesOf(e, r)).filter((e) => i.get(e)?.anchored === !1), o = a.indexOf(t);
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
		this.orders.set(e, u ? null : c), this.store.write(e, rR, u ? null : JSON.stringify(c)), this.layout(e), this.rememberBoot(e);
	}
};
function cR(e, t) {
	let n = 0, r = 0, i = !1;
	for (let e of t.children) if (e.matches(`.${WL}`)) i = !0;
	else if (!(e instanceof HTMLElement) || e.getAttribute("role") !== "row") continue;
	else i ? r += e.offsetHeight : n += e.offsetHeight;
	e.style.setProperty(JL, `${n}px`), e.style.setProperty(YL, `${r}px`);
}
function lR(e) {
	let t = e.matches(`.${BL}`) ? e.querySelector(`:scope > ${zL}`) : null;
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function uR(e) {
	return e.hasAttribute("data-ui-rows-draggable") && e.hasAttribute("data-ui-rows-drag-handle") && e.classList.contains("ui-drag-handle--start");
}
function dR(e, t, n) {
	for (let r of n) e[r].kind === "star" && e[r].min === e[r].value && t[r].kind === "star" && (t[r] = {
		...t[r],
		min: t[r].value
	});
	return t;
}
function fR(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(KL) || t.querySelector(KL) !== null)) return !0;
	return !1;
}
function pR(e) {
	let t = e.type === "childList" ? e.target : e.target.parentElement;
	return t instanceof Element && t.classList.contains(WL);
}
function mR(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) t[e[n]] = n;
	return t;
}
function hR(e, t) {
	if (e.length !== t.length) return !1;
	let n = new Set(t.map((e) => e.key));
	return e.every((e) => n.delete(e)) && n.size === 0;
}
function gR(e) {
	let t = e.cell.getBoundingClientRect();
	return t.left + t.width / 2;
}
function _R(e) {
	for (let t of e.querySelectorAll(`[${qn}]`)) t.removeAttribute(qn);
}
function vR(e) {
	return e.startsHidden || e.hideBelow !== null && jf.indexOf(Ff()) < jf.indexOf(e.hideBelow);
}
function yR(e) {
	return e !== null && jf.includes(e);
}
//#endregion
//#region src/items/items-group-runs.ts
var bR = /* @__PURE__ */ new WeakMap();
function xR(e, t) {
	let n = /* @__PURE__ */ new Set(), r = e.getAttribute(Lt);
	for (let i of H(e)) {
		let a = i.getAttribute("data-ui-group") ?? "";
		if (a !== "" && a !== r) {
			let r = SR(i, a) ?? CR(e, i, a, t);
			r !== null && n.add(r);
		}
		r = a;
	}
	for (let t of e.querySelectorAll(`:scope > [${_t}]`)) n.has(t) || t.remove();
}
function SR(e, t) {
	let n = e.previousElementSibling, r = n === null ? void 0 : bR.get(n);
	return r !== void 0 && r.row === e && r.group === t ? n : null;
}
function CR(e, t, n, r) {
	let i = r(t);
	return i === null ? null : (DR(i, t.getAttribute(y)), bR.set(i, {
		row: t,
		group: n
	}), e.insertBefore(i, t), i);
}
function wR(e, t, n) {
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
function TR(e) {
	return e.find((e) => !e.classList.contains(Kr));
}
function ER(e, t, n, r, i) {
	let a = t.renderFromTemplate(e, n, i);
	if (a === null) return null;
	let o = document.createElement("div");
	return DR(o, r), o.appendChild(a), o;
}
function DR(e, t) {
	e.setAttribute(_t, ""), t === null ? e.removeAttribute(vt) : e.setAttribute(vt, t);
}
var OR = "bottom", kR = "pending";
function AR(e, t, n) {
	let r = e.querySelector(`:scope > [${kt}="${t}"]`);
	if (n <= 0) {
		r?.remove();
		return;
	}
	r === null && (r = document.createElement("div"), r.setAttribute(kt, t), r.style.flexShrink = "0"), t === "top" ? e.firstElementChild !== r && e.insertBefore(r, e.firstElementChild) : e.lastElementChild !== r && e.appendChild(r), r.style.height = `${n}px`;
}
//#endregion
//#region src/items/items-dom-order.ts
function jR(e, t) {
	let n = e.firstElementChild;
	n !== null && n.getAttribute("data-ui-window-spacer") === "top" && (n = n.nextElementSibling);
	for (let r of t) r !== n && e.insertBefore(r, n), n = r.nextElementSibling;
}
//#endregion
//#region src/items/items-group-renderer.ts
var MR = /* @__PURE__ */ new WeakMap();
function NR(e) {
	for (let t of e.querySelectorAll(`:scope > [${_t}]`)) t.remove();
}
function PR(e, t, n, r, i, a) {
	let o = FC(e, H(e)), s = n.getGroupTemplate(t), c = s !== void 0, l = c && o.some((e) => e.hasAttribute("data-ui-group")), u = EC(i.getItemsFilterSortMetadata(t), a, SC(e));
	if (c && !l && NR(e), o.length === 0) {
		MR.set(e, []);
		return;
	}
	let d = nC(e);
	if (!l) {
		jR(e, [...DC(o, u, r), ...tC(d)]);
		return;
	}
	NR(e);
	let { buckets: f, order: p } = wR(o, (e) => e.getAttribute("data-ui-group") ?? "", MR.get(e) ?? []), m = r.getAncestorStack(e);
	MR.set(e, p);
	let h = [];
	for (let e of p) {
		let t = f.get(e);
		u.length > 0 && (t = DC(t, u, r));
		let n = e === "" ? void 0 : TR(t);
		if (n !== void 0) {
			let e = ER(s, r, r.getItemValue(n), n.getAttribute(y), m);
			e !== null && h.push(e);
		}
		h.push(...t);
	}
	jR(e, [...h, ...tC(d)]);
}
//#endregion
//#region src/items/items-host-sync.ts
var FR = "ui-tree-rules", IR = `:scope > .${Bn}:not(.${Un})`;
function LR(e, t, n) {
	if (e.parentElement?.classList.contains("ui-tree") === !0) {
		e.dispatchEvent(new Event(FR, { bubbles: !0 })), rC(e, t, n.templates, n.renderer, e.querySelector(IR) !== null);
		return;
	}
	switch (zS(e)) {
		case "windowed":
			rC(e, t, n.templates, n.renderer), zR(e, t, n);
			return;
		case "virtualized":
			n.virtualization.sync(e);
			return;
		default:
			CC(e, t, n.metadata, n.renderer, n.state), RR(e), rC(e, t, n.templates, n.renderer), PR(e, t, n.templates, n.renderer, n.metadata, n.state);
			return;
	}
}
function RR(e) {
	let t = Pu(e);
	t !== null && Nu(t, H(e).filter((e) => e instanceof HTMLElement));
}
function zR(e, t, n) {
	let r = n.templates.getGroupTemplate(t);
	if (r === void 0) return;
	let i = n.renderer.getAncestorStack(e);
	xR(e, (e) => ER(r, n.renderer, n.renderer.getItemValue(e), e.getAttribute(y), i));
}
//#endregion
//#region src/interactions/table-header-group.ts
var BR = ".ui-table", VR = `:scope > .${In} > .${Ln} > [role='columnheader']`, HR = `:scope > .${Rn}`, UR = "input:not([type='hidden']), button, select, textarea, a[href]", WR = /* @__PURE__ */ new WeakMap();
function GR(e) {
	for (let t of e.querySelectorAll(VR)) {
		let e = KR(t);
		e !== null && e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
	}
}
function KR(e) {
	let t = e.querySelector(UR);
	if (t !== null) return t;
	if (e.hasAttribute("tabindex")) return e;
	let n = e.querySelector(HR);
	return n !== null && n.getClientRects().length > 0 ? e : null;
}
function qR(e, t = null) {
	let n = JR(e), r = WR.get(e), i = n.find((e) => t !== null && XR(e) === t) ?? (r !== void 0 && n.includes(r) ? r : n[0]);
	return i !== void 0 && (YR(e, i), !0);
}
function JR(e) {
	let t = zl(e), n = [];
	for (let r of e.querySelectorAll(VR)) {
		let e = KR(r), i = Number(r.getAttribute("data-ui-table-column") ?? NaN);
		e !== null && Number.isInteger(i) && P(e) && n.push({
			stop: e,
			place: t.place(i)
		});
	}
	return n.sort((e, t) => e.place - t.place).map((e) => e.stop);
}
function YR(e, t) {
	t.hasAttribute("tabindex") || t.setAttribute("tabindex", "-1"), WR.set(e, t), t.focus();
}
function XR(e) {
	return e.closest("[role='columnheader']")?.getAttribute("data-ui-table-column") ?? null;
}
function ZR(e) {
	let t = e.closest("[role='columnheader']"), n = t?.parentElement?.parentElement?.parentElement ?? null;
	return t !== null && n instanceof HTMLElement && n.matches(BR) && KR(t) === e ? n : null;
}
function QR(e, t, n) {
	if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || !(e.target instanceof HTMLElement)) return !1;
	switch (e.key) {
		case "ArrowDown": return n(XR(e.target)), !0;
		case "ArrowUp": return !0;
	}
	if (!Vc(e.key, "horizontal")) return !1;
	let r = Bc({
		key: e.key,
		items: JR(t),
		current: e.target,
		axis: "horizontal",
		loop: !1
	});
	return r !== null && r !== e.target && YR(t, r), !0;
}
//#endregion
//#region src/interactions/items-selection-engine.ts
var $R = /* @__PURE__ */ new Set([
	" ",
	"Enter",
	"Delete"
]), ez = ".ui-table", tz = /* @__PURE__ */ new Set([
	"ArrowLeft",
	"ArrowRight",
	"ArrowUp",
	"ArrowDown",
	"Home",
	"End",
	"Enter",
	"F2",
	" "
]), nz = `:scope > [${b}], :scope > .${In}, :scope > .${In} > [${b}]`, rz = class {
	root;
	rows;
	pressedBoxes = [];
	windowEnds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.rows = e.rows, this.applyAll(this.root.querySelectorAll(F)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("mouseup", () => this.restoreBoxes(), !0), this.root.addEventListener("pointercancel", () => this.restoreBoxes(), !0), this.root.addEventListener("contextmenu", () => this.restoreBoxes(), !0), B(this.root, F, {
			childList: !0,
			attributeFilter: [
				Mr,
				Pr,
				Fr,
				At
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
		let t = Ll(e);
		Cl(e, t);
		for (let t of e.querySelectorAll(nz)) az(t);
		if (!e.matches(".ui-items-view, .ui-table")) return;
		e.matches(ez) && GR(e);
		for (let n of t) {
			let t = Fc(n);
			t !== null && az(t);
			for (let e of Ic(n)) az(e);
			iz(e, n, n.hasAttribute(je));
		}
		let n = this.windowEnds.get(e);
		n !== void 0 && this.settleWindowEnd(e, t, n);
	}
	settleWindowEnd(e, t, n) {
		let r = Ml(e);
		if (r === null || r.hasAttribute("data-ui-window-pending")) return;
		let i = VS(r, Pt) !== null, a = n === "first" ? BS(r) === 0 && !HS(r, "data-ui-window-more-before") : !HS(r, It);
		if (i && !a) return;
		this.windowEnds.delete(e);
		let o = Tu(n === "first" ? "Home" : "End", t, null, pz(e));
		o !== null && (iu(e, t, o), e.getAttribute("data-ui-selection") === "one" && Tl(e, t, o, hl));
	}
	handleClick(e) {
		let t = this.resolveRow(e, F);
		if (t === null || !(e instanceof MouseEvent)) return;
		let { root: n, item: r } = t, i = Ll(n);
		if (iu(n, i, r, e.target instanceof Element ? bu(r, e.target) : null), n.focus({ preventScroll: !0 }), n.hasAttribute("data-ui-no-row-select")) {
			vl(n, r);
			return;
		}
		Tl(n, i, r, yl(e), this.heldRange(n)) && e.preventDefault();
	}
	resolveRow(e, t) {
		if (!(e.target instanceof Element)) return null;
		let n = e.target.closest(pl), r = n?.closest(F) ?? null;
		return n === null || r === null || n.closest(F) !== r || !r.matches(t) || O(r) ? null : zc(e.target, n) === null && !k(n) ? {
			root: r,
			item: n
		} : null;
	}
	heldRange(e) {
		let t = this.rows, n = Ml(e);
		return t === void 0 || n === null ? void 0 : (e, r) => t.rangeKeysOf(n, e, r);
	}
	handleDoubleClick(e) {
		let t = this.resolveRow(e, ml);
		t === null || e.target instanceof Element && t.item.contains(e.target.closest("[data-ui-no-row-open]")) || (e.preventDefault(), Au(t.item, "open"));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.altKey || !(e.target instanceof Element) || Dc(e)) return;
		let t = ZR(e.target);
		if (t !== null && !O(t)) {
			QR(e, t, (e) => this.enterRows(t, e)) && e.preventDefault();
			return;
		}
		let n = Xl(e);
		if (n === null) return;
		let { root: r } = n;
		if (!r.matches(".ui-items-view, .ui-table") || O(r) || ou(r) && oz(e) && this.handleCellKey(r, e)) return;
		let i = pz(r);
		if (!$R.has(e.key) && !Cu(e.key, i)) return;
		if (this.windowEnds.delete(r), this.reachWindowEnd(r, e)) {
			e.preventDefault();
			return;
		}
		this.bringRowsIn(r, e.key);
		let a = Ll(r), o = $l(a), s = Tu(e.key, a, eu(a), i);
		if (s !== null) {
			e.preventDefault(), iu(r, a, s, e.key === "ArrowUp" && !e.shiftKey && ou(r) ? yu(s) : null), cz(r, a, o, s, bl(r, e), this.heldRange(r));
			return;
		}
		if (e.key === "ArrowUp" && !e.shiftKey && !e.ctrlKey && !e.metaKey && r.matches(ez) && qR(r, mu(r))) {
			e.preventDefault();
			return;
		}
		if (o === null || k(o)) return;
		let c = Fc(o);
		switch (e.key) {
			case " ":
				lz(r, a, o, c);
				break;
			case "Enter":
				dz(r, a, o, c);
				break;
			case "Delete":
				if (!uz(r, a, o)) return;
				break;
			default: return;
		}
		e.preventDefault();
	}
	handleCellKey(e, t) {
		this.bringCursorRowIn(e);
		let n = Ll(e), r = eu(n);
		if (r === null || k(r)) return !1;
		let i = pu(r), a = !t.ctrlKey && !t.metaKey && !t.shiftKey;
		switch (t.key) {
			case "ArrowLeft":
			case "ArrowRight":
			case "Home":
			case "End": {
				if (!a) return !1;
				let o = hu(e, r, i, t.key);
				return o !== null && iu(e, n, r, o), t.preventDefault(), !0;
			}
			case "ArrowDown":
			case "ArrowUp": {
				let o = a ? gu(e, r, i, t.key === "ArrowDown") : null;
				return o !== null && (t.preventDefault(), iu(e, n, r, o), !0);
			}
			default: return i !== null && sz(i, t);
		}
	}
	reachWindowEnd(e, t) {
		let n = t.key === "Home" || t.key === "End" ? Ml(e) : null;
		if (n === null || zS(n) !== "windowed" || n.hasAttribute("data-ui-window-paged")) return !1;
		let r = t.key === "Home";
		return !(r ? BS(n) === 0 && !HS(n, "data-ui-window-more-before") : !HS(n, "data-ui-window-more-after")) && (this.windowEnds.set(e, r ? "first" : "last"), Yc(n, r ? 0 : Jc(n).contentHeight), !0);
	}
	bringRowsIn(e, t) {
		let n = this.rows, r = n === void 0 ? null : Ml(e);
		if (n === void 0 || r === null) return;
		let i = Ru(e);
		switch (t) {
			case "Home":
			case "End": {
				let e = n.shownKeysOf(r);
				e !== null && e.length > 0 && n.reveal(r, t === "Home" ? e[0] : e[e.length - 1], "nearest");
				return;
			}
			case "PageDown":
			case "PageUp": {
				let a = i === null ? eu(Ll(e)) : null, o = i ?? (a === null ? null : L(a));
				o !== null && n.reveal(r, o, t === "PageDown" ? "start" : "end");
				return;
			}
			default: this.bringCursorRowIn(e);
		}
	}
	bringCursorRowIn(e) {
		let t = this.rows === void 0 ? null : Ml(e), n = Ru(e);
		t !== null && n !== null && this.rows?.reveal(t, n, "nearest");
	}
	enterRows(e, t) {
		let n = Ll(e), r = eu(n) ?? Tu("ArrowDown", n, null, "vertical");
		e.focus({ preventScroll: !0 }), r !== null && (iu(e, n, r, cu(r, t)), e.getAttribute("data-ui-selection") === "one" && Tl(e, n, r, hl));
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement && e.target.matches("[data-ui-items-host], .ui-table__scroll") ? e.target : null, n = t?.closest(F) ?? null;
		if (t !== null && n !== null && [...n.querySelectorAll(nz)].includes(t)) {
			R(n);
			return;
		}
		if (e.target instanceof HTMLElement && e.target.matches(F) && e.target.matches(".ui-items-view, .ui-table") && !O(e.target) && !td()) {
			nu(e.target, Ll(e.target));
			return;
		}
		let r = e.target instanceof Element ? e.target.closest(pl) : null, i = r?.closest(F) ?? null;
		r === null || i === null || r.hasAttribute("data-ui-row-focus") || !i.matches(".ui-items-view, .ui-table") || zc(e.target, r) === null || iu(i, Ll(i), r, e.target instanceof Element ? bu(r, e.target) : null, !1);
	}
	handlePointerDown(e) {
		this.restoreBoxes();
		let t = e.target instanceof Element ? e.target : null, n = t?.closest(F) ?? null;
		if (t !== null && n !== null) {
			document.activeElement !== n && rd(n, !0);
			for (let e of n.querySelectorAll(nz)) e.contains(t) && e.getAttribute("tabindex") === "-1" && (e.removeAttribute("tabindex"), this.pressedBoxes.push(e));
		}
	}
	restoreBoxes() {
		for (let e of this.pressedBoxes) az(e);
		this.pressedBoxes = [];
	}
	followCursor(e) {
		for (let t of e) {
			let e = t.target;
			if (!(e instanceof HTMLElement) || !e.matches(pl)) continue;
			let n = e.closest(F);
			n !== null && n.matches(".ui-items-view, .ui-table") && iz(n, e, e.hasAttribute(je));
		}
	}
};
function iz(e, t, n) {
	if (n) {
		for (let n of t.querySelectorAll(`[${Ne}]`)) n.parentElement?.closest(F) === e && $F(n);
		return;
	}
	for (let n of t.querySelectorAll(Vu)) n.tabIndex >= 0 && n.parentElement?.closest(F) === e && Rc(t, n) && QF(n);
}
function az(e) {
	e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
}
function oz(e) {
	return tz.has(e.key) || eb(e) !== null;
}
function sz(e, t) {
	let n = t.key, r = eb(t) !== null, i = !t.ctrlKey && !t.metaKey && !t.altKey;
	if (!r && (!i || n !== "Enter" && n !== "F2" && n !== " ")) return !1;
	if (n !== " " && Su(e, t)) return !0;
	let a = Fc(e);
	if (a !== null && (n === "Enter" || n === " ")) return t.preventDefault(), a.click(), !0;
	if (n !== "F2" && (n !== "Enter" || !vu(e))) return !1;
	let o = ld(e);
	return o !== null && (t.preventDefault(), o.focus(), !0);
}
function cz(e, t, n, r, i, a) {
	e.getAttribute("data-ui-selection") !== "one" && !i.shift || (i.shift && _l(e, n), Tl(e, t, r, i, a));
}
function lz(e, t, n, r) {
	Tl(e, t, n, {
		shift: !1,
		ctrl: !0
	}) || fz(n, r);
}
function uz(e, t, n) {
	if (!e.hasAttribute("data-ui-rows-remove")) return !1;
	let r = mz(t, n);
	for (let e of r) Au(e, "remove");
	return r.length > 0;
}
function dz(e, t, n, r) {
	xl(e) && !wl(t).includes(n) && Tl(e, t, n, hl), fz(n, r), r === null && Au(n, "open");
}
function fz(e, t) {
	t === null ? Au(e, ku) : t.click();
}
function pz(e) {
	return e.matches(".ui-items-view--wrap") ? "grid" : e.matches(".ui-orientation--horizontal") ? "both" : "vertical";
}
function mz(e, t) {
	let n = wl(e);
	return (n.includes(t) ? n : [t]).filter((e) => !Qo(e, "data-ui-unremovable") && !k(e));
}
//#endregion
//#region src/interactions/tree-engine.ts
var hz = "ui-tree__row--folded", gz = "fold-hidden", _z = "fold-shown", vz = "ui-tree__row--dragging", yz = "ui-tree__loading", bz = "ui-tree__loading-ring", xz = "ui-tree-node__text", Sz = "ui-tree-node__toggle", Cz = "ui-tree-node__rename", wz = ".ui-text__title", Tz = Hn, Ez = "--ui-tree-depth", Dz = "expanded", Oz = 600, kz = .25, Az = {
	ArrowUp: "up",
	ArrowDown: "down",
	ArrowLeft: "out",
	ArrowRight: "in"
}, jz = /* @__PURE__ */ new Set([
	" ",
	"ArrowRight",
	"ArrowLeft",
	"Enter",
	"F2",
	"Delete"
]), Mz = class {
	root;
	store = new gO();
	rules;
	folds = /* @__PURE__ */ new WeakMap();
	requested = /* @__PURE__ */ new WeakSet();
	writtenBoot = /* @__PURE__ */ new WeakMap();
	springTarget = null;
	springTimer = 0;
	dropPlace = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.rules = e.rules, this.root.addEventListener(FR, (e) => {
			let t = e.target instanceof Element ? e.target.closest(`.${zn}`) : null;
			t !== null && (this.layout(t), Nu(t, this.rowsOf(t)));
		}, !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), e.effects?.register("RenameNode", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename node effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(T(n.id), n.dynamicParameters ?? []), i = r === null ? null : this.rowsOf(r).find((e) => L(e) === t.key) ?? null;
			if (i === null) {
				s("rename node effect names no node on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.layoutAll(this.root.querySelectorAll(`.${zn}`)), B(this.root, `.${zn}`, {
			childList: !0,
			attributeFilter: [
				Zn,
				Qn,
				er,
				ar
			],
			relevant: Fz
		}, (e) => this.layoutAll(e));
	}
	layoutAll(e) {
		for (let t of e) this.layout(t);
	}
	layout(e) {
		let t = this.foldOf(e), n = this.resolveRules(e), r = n === null ? this.rowsOf(e) : this.orderRows(e, n), i = e.hasAttribute("data-ui-tree-draggable") || e.hasAttribute("data-ui-drag-kind"), a = /* @__PURE__ */ new Set();
		for (let e of r) {
			let t = vw(e)?.getAttribute(Zn);
			t != null && t.length > 0 && a.add(t);
		}
		let o = n?.filtering === !0 ? this.matchingRows(r, n) : null, s = /* @__PURE__ */ new Map();
		for (let e of r) {
			let n = L(e), r = vw(e), c = r?.getAttribute("data-ui-tree-parent") ?? "", l = c.length > 0 ? s.get(c) : void 0, u = l === void 0 ? 0 : l.depth + 1, d = l === void 0 || l.shown && l.expanded, f = r?.hasAttribute(Qn) === !0, p = f || a.has(n), m = p && r?.hasAttribute("data-ui-tree-expanded") === !0, h = l === void 0 || l.authoredShown && this.authoredExpandedOf(l), g = p && (o === null ? t[n] ?? m : o.has(n)), ee = o !== null && !o.has(n);
			e.style.setProperty(Ez, String(u)), e.setAttribute("aria-level", String(u + 1)), ru(e, r?.querySelector(`:scope > .${xz}`) ?? null), e.classList.toggle(hz, !d), e.classList.toggle(Un, ee), e.removeAttribute(ir), e.draggable = i && JS(e), p ? e.setAttribute("aria-expanded", g ? "true" : "false") : e.removeAttribute("aria-expanded"), (a.has(n) || !f) && e.removeAttribute(nr), g && d && f && !a.has(n) && !this.requested.has(e) && (this.requested.add(e), e.setAttribute(nr, ""), e.dispatchEvent(new Event("unfold", { bubbles: !0 }))), g || this.requested.delete(e), this.placeLoadingRow(e, u + 1, e.hasAttribute(nr), d && g && !ee), s.set(n, {
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
		return vw(e.row)?.hasAttribute(er) === !0;
	}
	writeBootFold(e, t, n) {
		if (Object.keys(t).length === 0) return;
		let r = [], i = [];
		for (let [e, t] of n) t.shown !== t.authoredShown && (t.shown ? i : r).push(`.${Bn}[${y}="${C(e)}"]`);
		let a = `${r.join(",")}|${i.join(",")}`;
		this.writtenBoot.get(e) !== a && (this.writtenBoot.set(e, a), this.store.writeBoot(e, gz, r.length === 0 ? null : this.bootPatch(r, "hidden")), this.store.writeBoot(e, _z, i.length === 0 ? null : this.bootPatch(i, "shown")));
	}
	bootPatch(e, t) {
		return {
			selector: e.join(","),
			attributes: { [ir]: t }
		};
	}
	resolveRules(e) {
		let t = this.hostOf(e), n = ea(e);
		if (this.rules === void 0 || t === null || n === null) return null;
		let r = this.rules.metadata.getItemsFilterSortMetadata(n), i = SC(t);
		if (r === void 0 && i === null) return null;
		let a = EC(r, this.rules.state, i), o = TC(r, this.rules.state, i);
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
			let t = vw(e)?.getAttribute("data-ui-tree-parent") ?? "", n = i.has(t) ? t : "", r = a.get(n);
			r === void 0 ? a.set(n, [e]) : r.push(e);
		}
		let o = [], s = (e) => {
			let n = a.get(e);
			if (n !== void 0) {
				n.sort((e, n) => OC(r.getItemValue(e), r.getItemValue(n), t.sorts));
				for (let e of n) o.push(e), s(L(e));
			}
		};
		if (s(""), o.length !== n.length || o.every((e, t) => e === n[t])) return o.length === n.length ? o : n;
		let c = this.hostOf(e);
		if (c === null) return n;
		for (let e of c.querySelectorAll(`:scope > .${yz}`)) e.remove();
		for (let e of o) c.appendChild(e);
		return o;
	}
	matchingRows(e, t) {
		let n = /* @__PURE__ */ new Set();
		if (this.rules === void 0) return n;
		let r = this.rules.state, i = this.rules.renderer;
		for (let a = e.length - 1; a >= 0; a--) {
			let o = e[a], s = L(o), c = i.getItemValue(o);
			if (c === void 0 || wC(t.config, c, r, t.query) || n.has(s)) {
				n.add(s);
				let e = vw(o)?.getAttribute("data-ui-tree-parent") ?? "";
				e.length > 0 && n.add(e);
			}
		}
		return n;
	}
	placeLoadingRow(e, t, n, r) {
		let i = e.nextElementSibling, a = i instanceof HTMLElement && i.classList.contains(yz) ? i : null;
		if (!n) {
			a?.remove();
			return;
		}
		let o = a ?? Iz();
		o.style.setProperty(Ez, String(t)), o.classList.toggle(hz, !r), a === null && e.after(o);
	}
	handleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null) return;
		let { tree: n, row: r, target: i } = t;
		i.closest(`.${Sz}`) === null && (!Qo(r, "data-ui-unselectable") || zc(i, r) !== null) || (e.preventDefault(), this.setFocus(n, r, null), this.toggle(n, r));
	}
	handleDoubleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null || zc(t.target, t.row) !== null) return;
		let { tree: n, row: r } = t;
		e.preventDefault(), n.hasAttribute("data-ui-tree-rename-dblclick") && this.canRename(n, r) ? this.startRename(r) : Au(r, "open");
	}
	rowOfEvent(e) {
		if (!(e.target instanceof Element)) return null;
		let t = e.target.closest(`.${Bn}`), n = t?.closest(".ui-tree") ?? null;
		return t === null || n === null || t.closest(".ui-tree") !== n || k(t) ? null : {
			tree: n,
			row: t,
			target: e.target
		};
	}
	handleFocusIn(e) {
		let t = e.target;
		!(t instanceof HTMLElement) || !t.classList.contains("ui-tree") || O(t) || td() || nu(t, this.rowsOf(t));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || j(e) || !(e.target instanceof Element)) return;
		let t = Xl(e);
		if (t === null) return;
		let n = t.root;
		if (!n.classList.contains("ui-tree") || O(n)) return;
		let r = e.altKey && M(e, { alt: !0 }) ? Az[e.key] : void 0;
		if (r !== void 0 && n.hasAttribute("data-ui-tree-draggable")) {
			e.preventDefault(), this.moveByKey(n, r);
			return;
		}
		if (!jz.has(e.key) && !Cu(e.key, "vertical")) return;
		let i = this.rowsOf(n), a = $l(i), o = Tu(e.key, i, eu(i), "vertical");
		if (o !== null) {
			e.preventDefault(), this.setFocus(n, o, bl(n, e));
			return;
		}
		if (!(a === null || k(a))) {
			switch (e.key) {
				case " ":
					lz(n, i, a, null);
					break;
				case "ArrowRight":
					a.getAttribute("aria-expanded") === "false" ? this.toggle(n, a) : a.getAttribute("aria-expanded") === "true" && this.setFocus(n, Tu("ArrowDown", i, a, "vertical"), hl);
					break;
				case "ArrowLeft":
					a.getAttribute("aria-expanded") === "true" ? this.toggle(n, a) : this.setFocus(n, this.parentOf(n, a), hl);
					break;
				case "Enter":
					dz(n, i, a, null);
					break;
				case "F2":
					if (!this.canRename(n, a)) return;
					this.startRename(a);
					break;
				case "Delete":
					if (n.hasAttribute("data-ui-tree-unremovable") || !uz(n, i, a)) return;
					break;
				default: return;
			}
			e.preventDefault();
		}
	}
	moveByKey(e, t) {
		let n = this.rowsOf(e), r = $l(n);
		if (r === null || !r.draggable || (t === "up" || t === "down") && this.isSorted(e)) return;
		let i = ww(Rz(n), L(r), t);
		i !== null && this.moveRows(e, [r], i, t === "in" ? n.find((e) => L(e) === i.parent) ?? null : null);
	}
	isSorted(e) {
		return (this.resolveRules(e)?.sorts.length ?? 0) > 0;
	}
	canRename(e, t) {
		return e.hasAttribute("data-ui-tree-renamable") && !Qo(t, "data-ui-unrenamable");
	}
	handleDragStart(e) {
		let t = Lz(e), n = t?.closest(".ui-tree") ?? null, r = n?.hasAttribute(ar) === !0, i = n === null ? null : this.hostOf(n);
		if (t === null || n === null || i === null || !r && !n.hasAttribute("data-ui-drag-kind")) return;
		if (k(t)) {
			e.preventDefault();
			return;
		}
		let a = qS(t, this.rowsOf(n)), o = KS(n, i, a);
		r ? Nh(e, n, t, vz, L(t), a.filter((e) => e !== t), XS(o, !0)) : Fh(e, L(t), XS(o, !1)), ZS(e, o);
	}
	draggingRows(e) {
		return this.rowsOf(e).filter((e) => e.classList.contains(vz));
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${zn}`), n = t === null ? [] : this.draggingRows(t), r = t === null ? null : this.hostOf(t);
		if (t === null || n.length === 0 || r === null) return;
		let i = e.target.closest(`.${Bn}`), a = i !== null && i.closest(".ui-tree") === t ? i : null, o = a === null ? {
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
		let i = this.parentKeysOf(e), a = L(t), o = (e) => n.some((t) => L(t) === e || Pz(i, e, L(t))), s = yw(t, vw(t)), c = t.getBoundingClientRect(), l = c.height > 0 ? (r - c.top) / c.height : .5, u = s ? kz : .5, d = this.isSorted(e) ? null : l < u ? "before" : l >= 1 - u ? "after" : null;
		if (d === null) return s && !o(a) ? {
			mark: "",
			place: {
				parent: a,
				before: null
			}
		} : null;
		if (n.includes(t)) return null;
		let f = this.rowsOf(e), p = Rz(f), m = Number(t.style.getPropertyValue(Ez)) || 0, h = new Set(n.map(L)), g = d === "after" && t.getAttribute("aria-expanded") === "true" ? p.find((e) => e.parent === a && e.shown !== !1 && !h.has(e.key)) : void 0, ee = i.get(a) ?? "", _ = g === void 0 ? {
			parent: ee,
			before: d === "before" ? a : Ow(p, ee, a, !1, h)
		} : {
			parent: a,
			before: g.key
		};
		return !bw(_.parent, (e) => f.find((t) => L(t) === e) ?? null) || o(_.parent) ? null : {
			mark: d,
			place: _,
			depth: g === void 0 ? m : m + 1
		};
	}
	springOpen(e, t) {
		let n = t !== null && t.getAttribute("aria-expanded") === "false" ? t : null;
		n !== this.springTarget && (window.clearTimeout(this.springTimer), this.springTarget = n, n !== null && (this.springTimer = window.setTimeout(() => this.expand(e, n), Oz)));
	}
	handleDragLeave(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${zn}`);
		t !== null && Ih(e, t) && (this.markDrop(t, null), this.springOpen(t, null));
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${zn}`), n = t === null ? [] : this.draggingRows(t), r = t?.querySelector(`[${Tz}]`) ?? null, i = this.dropPlace;
		if (t === null || n.length === 0 || r === null || i === null) return;
		e.preventDefault();
		let a = this.parentKeysOf(t), o = n.filter((e) => !n.some((t) => t !== e && Pz(a, L(e), L(t)))), s = r.getAttribute(Tz) === "" && r.classList.contains("ui-tree__row") ? r : null;
		this.markDrop(t, null), this.springOpen(t, null), Ph(t, vz), this.moveRows(t, o, i, s);
	}
	moveRows(e, t, n, r) {
		let i = kw(Rz(this.rowsOf(e)), t.map(L), n);
		r !== null && this.expand(e, r), t.forEach((e, t) => {
			let r = vw(e)?.querySelector(`.${xz}`) ?? null;
			r !== null && (r.setAttribute(rr, n.parent), r.dispatchEvent(new Event("change", { bubbles: !0 })), QC(e, i[t]));
		});
	}
	handleDragEnd(e) {
		let t = Lz(e)?.closest(".ui-tree") ?? null;
		t !== null && (Ph(t, vz), this.markDrop(t, null), this.springOpen(t, null));
	}
	markDrop(e, t, n = "", r) {
		Sw(e, t, n, r), t === null && (this.dropPlace = null);
	}
	parentKeysOf(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of this.rowsOf(e)) t.set(L(n), vw(n)?.getAttribute("data-ui-tree-parent") ?? "");
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
		let i = this.foldOf(e);
		i[r] = n;
		let a = n ? this.rowsOf(e).filter((e) => e.classList.contains(hz)) : [];
		this.store.writeJson(e, Dz, i), this.layout(e), Nz(a.filter((e) => !e.classList.contains(hz)));
	}
	foldOf(e) {
		let t = this.folds.get(e);
		return t === void 0 && (t = this.store.readJson(e, Dz) ?? {}, this.folds.set(e, t)), t;
	}
	setFocus(e, t, n) {
		if (t === null) return;
		let r = this.rowsOf(e), i = $l(r);
		iu(e, r, t), n !== null && cz(e, r, i, t, n);
	}
	parentOf(e, t) {
		let n = vw(t)?.getAttribute("data-ui-tree-parent") ?? "";
		return n.length === 0 ? null : this.rowsOf(e).find((e) => L(e) === n) ?? null;
	}
	startRename(e) {
		let t = e.closest(`.${zn}`), n = vw(e), r = n?.querySelector(wz) ?? null;
		t === null || n === null || r === null || Qo(e, "data-ui-unrenamable") || (this.setFocus(t, e, null), cc({
			container: n,
			title: r,
			className: Cz,
			value: n.getAttribute("data-ui-tree-title") ?? r.textContent?.trim() ?? "",
			commit: (t) => {
				n.setAttribute(tr, t), n.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
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
function Nz(e) {
	if (!(e.length === 0 || Of())) for (let t of e) t.animate([{
		opacity: 0,
		offset: 0
	}], {
		duration: z.fast,
		easing: z.enter
	});
}
function Pz(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let i = e.get(t) ?? ""; i.length > 0 && !r.has(i); i = e.get(i) ?? "") {
		if (i === n) return !0;
		r.add(i);
	}
	return !1;
}
function Fz(e) {
	if (e.type !== "childList") return !0;
	let t = e.target;
	return t instanceof HTMLElement && (t.classList.contains("ui-tree__row") || t.hasAttribute("data-ui-items-host") && t.parentElement?.classList.contains("ui-tree") === !0);
}
function Iz() {
	let e = document.createElement("div"), t = document.createElement("span");
	return e.className = yz, e.setAttribute("aria-hidden", "true"), t.className = bz, e.append(t, D.text("ui.tree.loading")), e;
}
function Lz(e) {
	return e.target instanceof Element ? e.target.closest(`.${Bn}`) : null;
}
function Rz(e) {
	return e.map((e) => ({
		key: L(e),
		parent: vw(e)?.getAttribute("data-ui-tree-parent") ?? "",
		takesDrop: yw(e, vw(e)),
		shown: !e.classList.contains(Un)
	}));
}
//#endregion
//#region src/runtime/client-state.ts
var zz = {
	visibilityState: () => document.visibilityState,
	notificationPermission: Vz
};
function Bz(e) {
	return e !== "hidden";
}
function Vz() {
	return typeof Notification > "u" || !window.isSecureContext ? void 0 : Notification.permission;
}
var Hz = 200;
function Uz(e = zz) {
	return {
		visible: Bz(e.visibilityState()),
		notificationPermission: e.notificationPermission() ?? "unsupported"
	};
}
var Wz = class {
	report;
	source;
	settleMilliseconds;
	held = null;
	timer;
	constructor(e) {
		this.report = e.report, this.source = e.source ?? zz, this.settleMilliseconds = e.settleMilliseconds ?? Hz;
	}
	forAttach() {
		return clearTimeout(this.timer), this.held = Uz(this.source), this.held;
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
		let t = Uz(this.source);
		(t.visible !== e.visible || t.notificationPermission !== e.notificationPermission) && (this.held = t, this.report(t).catch(() => void 0));
	}
};
//#endregion
//#region src/interactions/system-notifications.ts
function Gz(e) {
	return {
		permission: Vz,
		registration: e ?? (() => Promise.resolve(void 0)),
		create: (e, t) => new Notification(e, t),
		focus: () => window.focus()
	};
}
async function Kz(e, t, n = Gz()) {
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
function qz(e, t, n, r = window.location) {
	if (e.bringTo !== void 0 && Jz(e.bringTo, r)) {
		t(e.bringTo);
		return;
	}
	e.action !== void 0 && n(e.action);
}
function Jz(e, t = window.location) {
	let n = new URL(e, t.origin);
	return n.pathname !== t.pathname || n.search !== t.search || n.hash !== "" && n.hash !== t.hash;
}
//#endregion
//#region src/interactions/tab-order.ts
function Yz(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) e[n].pinned && (t = n + 1);
	return t;
}
//#endregion
//#region src/interactions/tabs-view-engine.ts
var G = "ui-tabs-view", Xz = "ui-tab-item__label", Zz = "ui-tab-item__close", Qz = "ui-tab-item__rename", $z = "ui-tab-item__caption", eB = "ui-tab-item__pin", tB = ".ui-text__title", nB = "ui-tab-item--dragging", rB = "ui-tab-item__caption--overflowed", iB = "ui-tabs-view--overflowing", aB = "ui-tabs-view--no-overflow", oB = "ui-tab-item__page", sB = "ui-tab-item--selected", cB = `.${x}`, lB = "tab-menu-entry", uB = {
	name: lB,
	registration: { dynamicParameters: (e) => e.domEvent.detail?.keys ?? null }
}, dB = "tab-pin";
function fB(e) {
	return {
		name: dB,
		registration: RS((e) => WC(e.target), e)
	};
}
var pB = "--ui-tabs-view-strip", mB = class {
	root;
	fitter;
	dragStart = null;
	menuTab = null;
	closed = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new jF({
			rootClass: G,
			overflowingClass: iB,
			wraps: (e) => e.classList.contains(aB),
			hiddenClass: rB,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(), e.effects?.register("RenameTab", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename tab effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(T(n.id), n.dynamicParameters ?? []), i = (r === null ? void 0 : this.ownItems(r).find((e) => TB(e) === t.key))?.querySelector(`.${Xz}`) ?? null;
			if (i === null) {
				s("rename tab effect names no tab on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.root.addEventListener(fk, (e) => this.prepareMenu(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), jL(this.root, ["press"], (e) => {
			let t = e.closest(`.${Zz}`)?.closest(`.${$z}`) ?? null;
			return t === null ? [] : [t];
		}), B(this.root, `.${G}`, {
			childList: !0,
			attributeFilter: [
				Lr,
				be,
				ce,
				...Br
			],
			relevant: (e) => !Hp(e, `.${oB}`, `.${G}`)
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${G}`)) this.apply(e);
	}
	apply(e) {
		let t = this.ownItems(e);
		gB(e, t);
		let n = t.filter(Nk), r = e.getAttribute("data-ui-tabs-selected") ?? "", i = dl(n, r, TB);
		if (i === null) return;
		if (i !== r) {
			this.select(e, i);
			return;
		}
		let a = e.hasAttribute(be), o = t.find((e) => e.classList.contains(sB))?.querySelector(`.${$z}`) ?? null, s = [], c = null, l = null;
		for (let e of t) {
			let t = TB(e) === r;
			e.classList.toggle(sB, t);
			let i = e.querySelector(`.${$z}`);
			i !== null && (i.draggable = a, RF(i), n.includes(e) && (s.push(i), t && (c = i))), e.querySelector(`.${Xz}`)?.setAttribute("aria-selected", t ? "true" : "false");
			for (let n of e.querySelectorAll(`.${oB}`)) n.hidden = !t;
			t && (l = e.querySelector(`.${oB}`));
		}
		this.fitCaptions(e, s, c), this.writeStripHeight(e, l), zF(o, c), o !== null && o !== c && BF(l);
		let u = [], d = null;
		for (let e of s) {
			let t = e.querySelector(`.${Xz}`);
			t === null || e.classList.contains(rB) || (u.push(t), e === c && (d = t));
		}
		N(u, d), this.focusAfterClose(e, d);
	}
	focusAfterClose(e, t) {
		let n = this.closed;
		n === null || n.root !== e || n.item.isConnected || (this.closed = null, t !== null && (document.activeElement === null || document.activeElement === document.body) && R(t));
	}
	writeStripHeight(e, t) {
		let n = this.hostOf(e);
		if (n === null || t === null || !Nk(t)) return;
		let r = Math.max(0, Math.round(t.getBoundingClientRect().top - n.getBoundingClientRect().top));
		n.style.setProperty(pB, `${r}px`);
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${b}]`);
	}
	fitCaptions(e, t, n) {
		let r = this.hostOf(e), i = e.querySelector(`:scope > .${EF}`);
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownItems(e).find((e) => TB(e) === t)?.querySelector(`.${Xz}`)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownItems(e).filter(Nk).map((e) => ({
				key: TB(e),
				title: e.querySelector(`.${Xz}`)?.textContent?.trim() ?? TB(e),
				current: TB(e) === t,
				disabled: O(e.querySelector(`.${Xz}`) ?? e)
			}));
		});
	}
	prepareMenu(e) {
		let t = e.target;
		if (!(e instanceof CustomEvent) || !(t instanceof HTMLElement) || t.getAttribute("data-ui-context-menu") !== "tab") return;
		let n = t.parentElement, r = e.detail.target.closest(`.${HC}`);
		if (n === null || !n.classList.contains(G) || r === null || r.closest(`.${G}`) !== n) {
			e.preventDefault();
			return;
		}
		let i = yB(n, r), a = xB(t), o = a.map((e) => {
			if (bB(e)) return "rule";
			let t = i.get(e.getAttribute("data-ui-key") ?? "");
			return t !== void 0 && (e.style.display = t ? "" : "none"), t ?? Nk(e) ? "shown" : "hidden";
		});
		if (sk(o).forEach((e, t) => {
			o[t] === "rule" && (a[t].style.display = e ? "" : "none");
		}), !o.includes("shown")) {
			e.preventDefault();
			return;
		}
		this.menuTab = {
			root: n,
			key: TB(r)
		};
	}
	handleMenuEntry(e) {
		let t = e.closest(`[${Se}="tab"]`), n = t?.parentElement ?? null, r = e.closest(cB);
		if (t === null || n === null || !n.classList.contains(G) || r === null || !t.contains(r)) return !1;
		let i = r.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "", a = this.menuTab, o = a === null || a.root !== n ? void 0 : this.ownItems(n).find((e) => TB(e) === a.key);
		if (i.length === 0 || r.matches(`${yn}, ${vn}`) || o === void 0) return !0;
		if (!i.startsWith("tabs:")) return n.dispatchEvent(new CustomEvent(lB, {
			bubbles: !0,
			detail: { keys: [i, TB(o)] }
		})), !0;
		if (yB(n, o).get(i) !== !0) return !0;
		switch (i) {
			case ek: {
				let e = o.querySelector(`.${Xz}`);
				e !== null && this.startRename(e);
				break;
			}
			case tk:
			case nk:
				this.setPinned(n, o, i === tk);
				break;
			default: o.dispatchEvent(new Event("remove", { bubbles: !0 }));
		}
		return !0;
	}
	setPinned(e, t, n) {
		if (t.hasAttribute("data-ui-tab-pinned") === n) return;
		let r = t.querySelector(`:scope > .${$z} > .${eB}`);
		t.toggleAttribute(zr, n), r !== null && (r.toggleAttribute(zr, n), r.dispatchEvent(new Event("change", { bubbles: !0 })));
		let i = this.ownItems(e), a = i.filter((e) => e !== t), o = Yz(a.map(wB));
		if (i.indexOf(t) === o) return;
		let s = a[o];
		s === void 0 ? UC(a[a.length - 1]).after(UC(t)) : UC(s).before(UC(t)), t.dispatchEvent(new Event(dB, { bubbles: !0 }));
	}
	handleClick(e) {
		if (!(e.target instanceof Element) || this.handleMenuEntry(e.target) || this.handleClose(e, e.target)) return;
		let t = e.target.closest(`.${EF}`), n = t?.parentElement ?? null;
		if (t !== null && n !== null && n.classList.contains(G)) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = SB(e.target), i = r?.closest(`.${G}`) ?? null;
		if (r === null || i === null || O(r)) return;
		let a = r.closest(`.${HC}`);
		a !== null && a.closest(`.${G}`) === i && (e.preventDefault(), this.select(i, TB(a)), document.activeElement !== r && R(r));
	}
	handleClose(e, t) {
		let n = t.closest(`.${Zz}`), r = n?.closest(".ui-tab-item") ?? null, i = r?.closest(`.${G}`) ?? null;
		return n === null || r === null || i === null ? !1 : (e.preventDefault(), e.stopPropagation(), _B(i, r) && r.dispatchEvent(new Event("remove", { bubbles: !0 })), !0);
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = SB(e.target), n = t?.closest(`.${G}`) ?? null;
		t === null || n === null || !n.hasAttribute("data-ui-tabs-renamable") || (e.preventDefault(), this.startRename(t));
	}
	startRename(e) {
		let t = e.parentElement, n = e.querySelector(tB) ?? e, r = e.closest(`.${HC}`);
		t === null || r === null || GC(r, "data-ui-unrenamable") || cc({
			container: t,
			title: n,
			className: Qz,
			value: e.getAttribute("data-ui-tab-caption") ?? n.textContent?.trim() ?? "",
			commit: (t) => {
				e.setAttribute(Rr, t), e.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			refocus: () => R(e)
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || Dc(e)) return;
		let t = e.target.closest(`.${Xz}`), n = t?.closest(`.${G}`) ?? null;
		if (t === null || n === null) return;
		if (e.key === "F2") {
			if (!n.hasAttribute("data-ui-tabs-renamable")) return;
			e.preventDefault(), this.startRename(t);
			return;
		}
		let r = t.closest(`.${HC}`);
		if (r === null || r.closest(`.${G}`) !== n) return;
		if (e.key === "Delete" && M(e)) {
			if (!vB(n, r)) return;
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
		let i = this.ownItems(n).map((e) => e.querySelector(`.${Xz}`)).filter((e) => e !== null), a = Bc({
			key: e.key,
			items: i,
			current: t,
			axis: "horizontal"
		});
		if (a === null) return;
		e.preventDefault();
		let o = a.closest(`.${HC}`);
		o !== null && this.select(n, TB(o)), a.focus();
	}
	moveByKey(e, t, n) {
		if (!e.hasAttribute("data-ui-tabs-draggable") || GC(t, "data-ui-undraggable") || O(t) || t.hasAttribute("data-ui-tab-pinned")) return;
		n.preventDefault();
		let r = this.ownItems(e), i = r[r.indexOf(t) + (n.key === "ArrowLeft" ? -1 : 1)];
		i === void 0 || i.hasAttribute("data-ui-tab-pinned") || (n.key === "ArrowLeft" ? UC(t).after(UC(i)) : UC(t).before(UC(i)), QC(t, this.ownItems(e).indexOf(t)));
	}
	handleDragStart(e) {
		let t = CB(e);
		if (t === null) return;
		if (GC(t, "data-ui-undraggable") || O(t) || t.hasAttribute("data-ui-tab-pinned")) {
			e.preventDefault();
			return;
		}
		Nh(e, t.closest(`.${G}`) ?? t, t, nB, TB(t));
		let n = UC(t);
		this.dragStart = n.parentNode === null ? null : {
			parent: n.parentNode,
			next: n.nextSibling
		};
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${$z}`)?.closest(".ui-tab-item") ?? null, n = t?.closest(`.${G}`) ?? null;
		if (t === null || n === null) return;
		let r = n.querySelector(`.${nB}`);
		if (r === null || (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), r === t)) return;
		let i = t.querySelector(`.${$z}`)?.getBoundingClientRect();
		if (i === void 0) return;
		let a = UC(r), o = t.hasAttribute("data-ui-tab-pinned") ? hB(n, a) : null, s = o ?? UC(t), c = o === null && e.clientX < i.left + i.width / 2 ? s : s.nextElementSibling;
		c !== a && s.parentElement?.insertBefore(a, c);
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${G}`);
		t !== null && t.querySelector(`.${nB}`) !== null && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"));
	}
	handleDragEnd(e) {
		let t = CB(e);
		if (t === null) return;
		t.classList.remove(nB);
		let n = this.dragStart;
		if (this.dragStart = null, e instanceof DragEvent && e.dataTransfer?.dropEffect === "none" && n !== null) {
			n.parent.insertBefore(UC(t), n.next);
			return;
		}
		let r = UC(t);
		if (n !== null && r.parentNode === n.parent && r.nextSibling === n.next) return;
		let i = t.closest(`.${G}`);
		i !== null && QC(t, this.ownItems(i).indexOf(t));
	}
	select(e, t) {
		ul(e, t, {
			attribute: Lr,
			bindingAttribute: Ir,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return cl(e, `.${HC}`, `.${G}`);
	}
};
function hB(e, t) {
	let n = null;
	for (let r of cl(e, `.${HC}`, `.${G}`)) {
		let e = UC(r);
		e !== t && r.hasAttribute("data-ui-tab-pinned") && (n = e);
	}
	return n;
}
function gB(e, t) {
	let n = !t.some((e) => !GC(e, ce));
	e.hasAttribute("data-ui-tabs-none-removable") !== n && e.toggleAttribute(ye, n);
}
function _B(e, t) {
	return !e.hasAttribute("data-ui-tabs-unremovable") && !GC(t, "data-ui-unremovable");
}
function vB(e, t) {
	return e.hasAttribute("data-ui-tabs-removes") && _B(e, t) && !t.hasAttribute("data-ui-tab-pinned") && !O(t);
}
function yB(e, t) {
	return ok(ak(e.getAttribute(xe)), {
		pinned: t.hasAttribute(zr),
		renamable: !GC(t, le),
		removable: e.hasAttribute("data-ui-tabs-removes") && _B(e, t)
	});
}
function bB(e) {
	let t = e.getAttribute(y);
	return t === "tabs:separator" || t === "tabs:separator-remove" || e.querySelector(":scope > [data-ui-menu-item-kind=\"separator\"]") !== null;
}
function xB(e) {
	let t = e.querySelector(`[${b}]`);
	return t === null ? [] : Array.from(t.children).filter((e) => e instanceof HTMLElement && e.hasAttribute("data-ui-key"));
}
function SB(e) {
	return e.closest(`.${Zz}`) !== null || sc(e) ? null : e.closest(`.${$z}`)?.querySelector(`:scope > .${Xz}`) ?? null;
}
function CB(e) {
	return e.target instanceof Element ? e.target.closest(`.${$z}`)?.closest(".ui-tab-item") ?? null : null;
}
function wB(e) {
	return { pinned: e.hasAttribute(zr) };
}
function TB(e) {
	return e.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "";
}
//#endregion
//#region src/interactions/text-fold-engine.ts
var EB = "button.ui-text__fold-toggle", DB = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(EB);
		t !== null && (e.preventDefault(), t.setAttribute("aria-expanded", t.getAttribute("aria-expanded") === "true" ? "false" : "true"));
	}
}, OB = "ui-temporal-input__segments", kB = "ui-temporal-input__segment", AB = "ui-temporal-input__segment-literal", jB = "ui-temporal-input__segment--empty", MB = "data-ui-temporal-segment", NB = "data-ui-temporal-step-direction", PB = "data-ui-temporal-segments-of", FB = "--", IB = class {
	options;
	root;
	edits = /* @__PURE__ */ new WeakMap();
	wheelTurn = 0;
	onWheel = (e) => this.handleWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${U}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(Qi(e.components, `.${U}`));
		}), B(this.root, `.${U}`, { attributeFilter: [...bT] }, (e) => this.applyAll(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("mousedown", (e) => this.handleStepperPress(e), !0);
	}
	applyAll(e) {
		for (let t of e) ST(t) === "time" && this.applySegments(t);
	}
	applySegments(e) {
		for (let t of e.querySelectorAll(`.${OB}`)) this.applyContainer(e, t);
	}
	applyContainer(e, t) {
		let n = CT(e), r = OT(e), i = W(e, IT(t));
		t.getAttribute(PB) !== n && (t.replaceChildren(...LB(n).map((e) => zB(e))), t.setAttribute(PB, n));
		for (let n of t.children) {
			if (!(n instanceof HTMLElement)) continue;
			let t = n.getAttribute(MB);
			if (t === null) {
				n.textContent = VB(n.dataset.token ?? "", n.dataset.formatted !== void 0, i, r);
				continue;
			}
			n.textContent = HB(t, Number(n.dataset.width ?? "2"), i, r), n.classList.toggle(jB, i === null), n.tabIndex = 0, UB(n, t, i, A(e));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !M(e, { shift: !0 })) return;
		let t = GB(e.target);
		if (t === null) return;
		let n = t.closest(`.${U}`), r = t.getAttribute(MB), i = WB(t);
		if (e.key === "ArrowUp" || e.key === "ArrowDown") {
			e.preventDefault(), this.resetBuffer(n), this.applyStep(n, r, e.key === "ArrowUp" ? 1 : -1, i);
			return;
		}
		if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
			e.preventDefault(), this.resetBuffer(n), qB(n, t, e.key);
			return;
		}
		if (e.key === "Backspace" || e.key === "Delete") {
			e.preventDefault(), this.resetBuffer(n), HT(n, null, i), this.applySegments(n);
			return;
		}
		if (r === "meridiem") {
			let t = JB(e.key, OT(n));
			t !== null && (e.preventDefault(), this.applyMeridiem(n, t, i));
			return;
		}
		e.key.length === 1 && e.key >= "0" && e.key <= "9" && (e.preventDefault(), this.applyDigit(n, t, r, e.key, i));
	}
	handleFocusIn(e) {
		let t = GB(e.target);
		t !== null && (this.wheelTurn = 0, t.addEventListener("wheel", this.onWheel, { passive: !1 }));
	}
	handleWheel(e) {
		let t = GB(e.currentTarget);
		if (t === null || t !== document.activeElement || e.deltaY === 0) return;
		e.preventDefault();
		let { steps: n, carried: r } = j_(this.wheelTurn, A_(e).y);
		if (this.wheelTurn = r, n === 0) return;
		let i = t.closest(`.${U}`);
		this.resetBuffer(i);
		for (let e = 0; e < Math.abs(n); e++) this.applyStep(i, t.getAttribute(MB), n < 0 ? 1 : -1, WB(t));
	}
	handleStepperPress(e) {
		e.target instanceof Element && e.target.closest(`[${NB}]`) !== null && e.preventDefault();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${NB}]`);
		if (t === null) return;
		let n = t.closest(`.${U}`);
		if (n === null || A(n)) return;
		e.preventDefault();
		let r = KB(n) ?? n.querySelector(`.${kB}`);
		r !== null && (r.focus(), this.resetBuffer(n), this.applyStep(n, r.getAttribute(MB), t.getAttribute(NB) === "up" ? 1 : -1, WB(r)));
	}
	handleFocusOut(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${kB}`) : null;
		if (t === null) return;
		t.removeEventListener("wheel", this.onWheel);
		let n = t.closest(`.${U}`);
		n !== null && this.resetBuffer(n);
	}
	applyStep(e, t, n, r) {
		if (t === "meridiem") {
			let t = W(e, r), n = t !== null && t.getHours() >= 12 ? "am" : "pm";
			this.write(e, qT(e, XB(this.baseValue(e, r), n)), r);
			return;
		}
		let i = this.baseValue(e, r), a = YB(t), o = TT(wT(e), a) * n, s = a === "hour" ? 24 : 60, c = ((ET(i, a) + o) % s + s) % s;
		this.write(e, qT(e, DT(i, a, c)), r);
	}
	applyDigit(e, t, n, r, i) {
		let a = this.editState(e), o = n === "hour" ? 23 : n === "hour12" ? 12 : 59, s = +(n === "hour12"), c = (a.unit === n ? a.buffer : "") + r;
		Number(c) > o && (c = r);
		let l = Number(c), u = c.length >= 2 || l * 10 > o;
		if (a.unit = n, a.buffer = u ? "" : c, l >= s) {
			let t = this.baseValue(e, i);
			this.write(e, n === "hour12" ? DT(t, "hour", ZB(l, t.getHours() >= 12)) : DT(t, YB(n), l), i);
		}
		u && qB(e, t, "ArrowRight");
	}
	applyMeridiem(e, t, n) {
		this.write(e, XB(this.baseValue(e, n), t), n);
	}
	baseValue(e, t) {
		return W(e, t) ?? KT(e);
	}
	write(e, t, n) {
		HT(e, t, n), WT(e), this.applySegments(e);
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
function LB(e) {
	let t = [];
	for (let n = 0; n < e.length;) {
		let r = ba(e, n);
		if (r === null) {
			t.push({
				kind: "literal",
				token: e[n],
				formatted: !1
			}), n++;
			continue;
		}
		t.push(RB(r)), n += r.length;
	}
	return t;
}
function RB(e) {
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
function zB(e) {
	if (e.kind === "literal") {
		let t = document.createElement("span");
		return t.className = AB, t.dataset.token = e.token, e.formatted && (t.dataset.formatted = ""), t;
	}
	let t = document.createElement("span");
	return t.className = kB, t.tabIndex = 0, t.setAttribute("role", "spinbutton"), t.setAttribute(MB, e.unit), t.dataset.width = String(e.width), BB(t, e.unit), t;
}
function BB(e, t) {
	if (t === "meridiem") {
		D.write(e, "aria-label", "ui.picker.meridiem");
		return;
	}
	let n = YB(t);
	D.write(e, "aria-label", n === "hour" ? "ui.picker.hours" : n === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"), e.setAttribute("aria-valuemin", t === "hour12" ? "1" : "0"), e.setAttribute("aria-valuemax", t === "hour12" ? "12" : t === "hour" ? "23" : "59");
}
function VB(e, t, n, r) {
	return t && n !== null ? ha(n, e, r) : e;
}
function HB(e, t, n, r) {
	if (n === null) return FB;
	if (e === "meridiem") return n.getHours() < 12 ? r.amDesignator : r.pmDesignator;
	let i = e === "hour12" ? Va(n.getHours()) : ET(n, YB(e));
	return String(i).padStart(t, "0");
}
function UB(e, t, n, r) {
	if (r !== e.hasAttribute("aria-readonly") && (r ? e.setAttribute("aria-readonly", "true") : e.removeAttribute("aria-readonly")), t === "meridiem" || n === null) {
		e.removeAttribute("aria-valuenow");
		return;
	}
	e.setAttribute("aria-valuenow", String(t === "hour12" ? Va(n.getHours()) : ET(n, YB(t))));
}
function WB(e) {
	return IT(e.closest(`.${OB}`));
}
function GB(e) {
	let t = e instanceof Element ? e.closest(`.${kB}`) : null;
	if (t === null) return null;
	let n = t.closest(`.${U}`);
	return n === null || A(n) ? null : t;
}
function KB(e) {
	return document.activeElement instanceof HTMLElement && document.activeElement.closest(".ui-temporal-input") === e ? document.activeElement.closest(`.${kB}`) : null;
}
function qB(e, t, n) {
	Bc({
		key: n,
		items: [...e.querySelectorAll(`.${kB}`)],
		current: t,
		axis: "horizontal",
		loop: !1
	})?.focus();
}
function JB(e, t) {
	let n = e.toLowerCase();
	return n.length === 1 ? n === "a" || n === t.amDesignator.charAt(0).toLowerCase() ? "am" : n === "p" || n === t.pmDesignator.charAt(0).toLowerCase() ? "pm" : null : null;
}
function YB(e) {
	return e === "hour12" || e === "meridiem" ? "hour" : e;
}
function XB(e, t) {
	return DT(e, "hour", ZB(Va(e.getHours()), t === "pm"));
}
function ZB(e, t) {
	let n = e % 12;
	return t ? n + 12 : n;
}
//#endregion
//#region src/interactions/timestamp-engine.ts
var QB = "datetime", $B = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.apply(this.root.querySelectorAll(`.${dt}`), D.temporal === null), D.onTable(() => this.apply(this.root.querySelectorAll(`.${dt}`))), e.propertyPatchEngine?.addValueChangeHandler((e) => this.apply(Qi(e.components, `.${dt}`))), B(this.root, `.${dt}`, {
			childList: !0,
			attributeFilter: [QB],
			relevant: (e) => e.type === "attributes" || !(e.target instanceof Element && e.target.closest(".ui-timestamp") !== null)
		}, (e) => this.apply(e));
	}
	apply(e, t = !1) {
		let n = {
			temporal: D.temporal,
			language: D.language || document.documentElement.lang
		}, r = Date.now(), i = !1;
		for (let a of e) {
			let e = Ga(a.getAttribute(pt)), o = Wa(a.getAttribute(QB)), s = a.querySelector(`.${ft}`);
			if (s === null || t && !eV(e, o, r)) continue;
			let c = o === null ? "" : Ya(o, e, n, r);
			s.textContent !== c && (s.textContent = c), i ||= Ka(e) && o !== null;
		}
		i && Do(this.refreshRelative);
	}
	refreshRelative = () => {
		let e = [...this.root.querySelectorAll(`.${dt}:is([${pt}="relative"], [${pt}="relative-date"])`)];
		return e.length !== 0 && (this.apply(e), !0);
	};
};
function eV(e, t, n) {
	return e === "relative" || e === "relative-date" && t !== null && Xa(t, n) !== null;
}
//#endregion
//#region src/items/item-reveal.ts
var tV = /* @__PURE__ */ new Map();
function nV(e) {
	if (e.hasAttribute("data-ui-items-host")) return e;
	for (let t of e.querySelectorAll(`[${b}]`)) if (t.closest(S) === e) return t;
	return null;
}
function rV(e, t, n, r) {
	let i = iV(e, t);
	return i !== null && (tV.set(e, {
		key: t,
		block: n
	}), aV(e, i, n, r), !0);
}
function iV(e, t) {
	for (let n of e.children) if (n.getAttribute("data-ui-key") === t) return n;
	return null;
}
function aV(e, t, n, r) {
	let i = t.previousElementSibling, a = i !== null && i.hasAttribute("data-ui-group-header") && i.getAttribute("data-ui-group-anchor") === t.getAttribute("data-ui-key") ? i : null, o = Kc(e);
	if (o.scrollHeight <= o.clientHeight) {
		(a ?? t).scrollIntoView({
			behavior: r,
			block: n === "Start" ? "start" : n === "End" ? "end" : n === "Center" ? "center" : "nearest"
		});
		return;
	}
	let s = o.getBoundingClientRect().top + o.clientTop, c = o.clientHeight, l = (a ?? t).getBoundingClientRect().top, u = t.getBoundingClientRect().bottom, d = oV(n, l - s, u - s, c);
	d !== 0 && (r === "smooth" ? o.scrollTo({
		top: o.scrollTop + d,
		behavior: r
	}) : o.scrollTop += d);
}
function oV(e, t, n, r) {
	switch (e) {
		case "Center": return (t + n - r) / 2;
		case "End": return n - r;
		case "Nearest": return t >= 0 && n <= r ? 0 : t < 0 || n - t > r ? t : n - r;
		default: return t;
	}
}
function sV(e) {
	let t = tV.get(e);
	if (t === void 0) return;
	let n = iV(e, t.key);
	if (n === null) {
		tV.delete(e);
		return;
	}
	aV(e, n, t.block, "auto");
}
function cV(e) {
	if (!(tV.size === 0 || !(e instanceof Node))) for (let t of [...tV.keys()]) (!t.isConnected || Kc(t).contains(e)) && tV.delete(t);
}
//#endregion
//#region src/interactions/scroll-anchor-engine.ts
var lV = "data-ui-scroll-anchor", uV = "End", dV = `[${lV}="${uV}"]`, fV = 4, pV = [
	"wheel",
	"touchstart",
	"pointerdown",
	"keydown"
], mV = /* @__PURE__ */ new WeakSet();
function hV(e) {
	mV.add(e);
}
function gV(e) {
	cV(e);
	for (let t = e.closest(dV); t !== null; t = t.parentElement?.closest(dV) ?? null) mV.delete(t);
}
var _V = class {
	root;
	pinned = /* @__PURE__ */ new WeakMap();
	resizes = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null;
	watched = /* @__PURE__ */ new WeakMap();
	watchedContainers = /* @__PURE__ */ new WeakSet();
	heights = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0);
		for (let e of pV) this.root.addEventListener(e, (e) => vV(e), {
			capture: !0,
			passive: !0
		});
		B(this.root, `[${lV}="${uV}"]`, {
			childList: !0,
			characterData: !0,
			attributeFilter: [Vt]
		}, (e) => this.followEach(e)), this.followContent();
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof Element) || !bV(t) || this.pinned.set(t, mV.has(t) || SV(t) && !xV(t));
	}
	followContent() {
		this.followEach(this.root.querySelectorAll(`[${lV}="${uV}"]`));
	}
	followEach(e) {
		for (let t of e) {
			if (this.watchRows(t), mV.has(t)) {
				this.pinned.set(t, !0), yV(t);
				continue;
			}
			if (this.pinned.get(t) !== !1) {
				if (xV(t)) {
					this.pinned.set(t, !1);
					continue;
				}
				this.pinned.set(t, !0), yV(t);
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
			if (!e.isConnected || r === null || !bV(r)) {
				this.forget(e);
				continue;
			}
			let i = e.getBoundingClientRect(), a = this.heights.get(e);
			if (this.heights.set(e, i.height), a === i.height) continue;
			let o = a !== void 0 && i.top + a <= r.getBoundingClientRect().top ? i.height - a : 0;
			t.set(r, (t.get(r) ?? 0) + o);
		}
		for (let [e, n] of t) this.followsEnd(e) ? yV(e) : n !== 0 && e.getAttribute("data-ui-host-mode") !== "virtualized" && getComputedStyle(e).overflowAnchor === "none" && (e.scrollTop += n);
	}
	followOwnBox(e) {
		if (!e.isConnected || !bV(e)) {
			this.watchedContainers.delete(e), this.resizes?.unobserve(e);
			return;
		}
		this.followsEnd(e) && yV(e);
	}
	followsEnd(e) {
		return mV.has(e) || this.pinned.get(e) !== !1 && !xV(e);
	}
	forget(e) {
		this.resizes?.unobserve(e), this.heights.delete(e);
	}
};
function vV(e) {
	cV(e.target);
	let t = e.target instanceof Element ? e.target.closest(dV) : null;
	t !== null && mV.delete(t);
}
function yV(e) {
	e.scrollTop = e.scrollHeight;
}
function bV(e) {
	return e.getAttribute(lV) === uV;
}
function xV(e) {
	return HS(e, It);
}
function SV(e) {
	return e.scrollHeight - e.scrollTop - e.clientHeight <= fV;
}
//#endregion
//#region src/interactions/text-selection-engine.ts
var CV = `${Mc}, [role='menu'], [role='tab']`, wV = class {
	selection;
	selects;
	constructor(e = {}) {
		let t = e.root ?? document;
		this.selection = e.selection ?? (() => document.getSelection()), this.selects = e.selects ?? TV, t.addEventListener("pointerdown", (e) => this.handlePointerDown(e), { capture: !0 });
	}
	handlePointerDown(e) {
		if (e.button !== 0 || e.pointerType === "touch" || !(e.target instanceof Element)) return;
		let t = this.selection();
		t === null || t.isCollapsed || e.target.closest(CV) !== null || this.selects(e.target) || t.removeAllRanges();
	}
};
function TV(e) {
	let t = getComputedStyle(e);
	return (t.getPropertyValue("user-select") || t.getPropertyValue("-webkit-user-select")) !== "none";
}
//#endregion
//#region src/interactions/scroll-group-mapping.ts
function EV(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.top(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = OV(e, a, n), s = OV(e, a + 1, n);
	return kV(t, o.top, s.top, o.line, s.line);
}
function DV(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.line(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = OV(e, a, n), s = OV(e, a + 1, n);
	return kV(t, o.line, s.line, o.top, s.top);
}
function OV(e, t, n) {
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
function kV(e, t, n, r, i) {
	return n <= t ? r : r + Math.min(1, Math.max(0, (e - t) / (n - t))) * (i - r);
}
//#endregion
//#region src/interactions/scroll-group-engine.ts
var AV = 250, jV = class {
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
		let r = this.memberScrolledBy(t), i = r?.getAttribute(Et);
		if (r != null && i != null && i.length !== 0) for (let e of this.membersOf(i)) e !== r && e.isConnected && this.follow(t, this.viewportOf(e));
	}
	membersOf(e) {
		let t = performance.now(), n = this.members.get(e);
		if (n !== void 0 && t - n.at < AV && n.found.every((e) => e.isConnected)) return n.found;
		let r = [...this.root.querySelectorAll(`[${Et}="${C(e)}"]`)];
		return this.members.set(e, {
			found: r,
			at: t
		}), r;
	}
	memberScrolledBy(e) {
		for (let t = e.closest(`[${Et}]`); t !== null; t = t.parentElement?.closest("[data-ui-scroll-group]") ?? null) if (this.viewportOf(t) === e) return t;
		return null;
	}
	viewportOf(e) {
		let t = this.viewports.get(e);
		if (t !== void 0 && t.isConnected && e.contains(t)) return t;
		let n = MV(e, "data-ui-scroll-viewport") ?? NV(e) ?? e;
		return this.viewports.set(e, n), n;
	}
	follow(e, t) {
		let n = e.scrollHeight - e.clientHeight, r = t.scrollHeight - t.clientHeight;
		if (r <= 0 && t.scrollWidth <= t.clientWidth) return;
		let i = n > 0 ? FV(e) : null, a = i === null ? null : FV(t), o;
		if (n <= 0 || e.scrollTop <= 0) o = 0;
		else if (e.scrollTop >= n - 1) o = r;
		else if (i !== null && a !== null) {
			let t = Math.max(i.endLine, a.endLine);
			o = DV(a, EV(i, e.scrollTop, t), t);
		} else o = e.scrollTop / n * r;
		let s = i === null && a === null ? PV(e.scrollLeft, e.scrollWidth - e.clientWidth) * Math.max(0, t.scrollWidth - t.clientWidth) : t.scrollLeft;
		o = Math.round(Math.min(Math.max(0, o), Math.max(0, r))), !(Math.abs(t.scrollTop - o) < 1 && Math.abs(t.scrollLeft - s) < 1) && (t.scrollTo({
			top: o,
			left: s,
			behavior: "instant"
		}), this.driven.set(t, t.scrollTop));
	}
};
function MV(e, t) {
	for (let n of e.querySelectorAll(`[${t}]`)) if (n.closest("[data-ui-id]") === e) return n;
	return null;
}
function NV(e) {
	let t = e.hasAttribute("data-ui-items-host") ? e : MV(e, b);
	return t === null ? null : Kc(t);
}
function PV(e, t) {
	return t > 0 ? e / t : 0;
}
function FV(e) {
	let t = e.getBoundingClientRect().top + e.clientTop - e.scrollTop, n = (e) => e.getBoundingClientRect().top - t, r = e.querySelector(`[${Dt}]`);
	if (r !== null && r.children.length > 0) return {
		count: r.children.length,
		line: (e) => e + 1,
		top: (e) => n(r.children[e]),
		endLine: r.children.length + 1,
		scrollHeight: e.scrollHeight
	};
	let i = e.querySelectorAll(`[${Ot}]`);
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
var IV = ".ui-tab-item__caption, .ui-split-button:not([data-ui-split-mode='menu']) > :is(.ui-split-button__main, .ui-split-button__toggle)", LV = `.${ti}, .ui-action, .${x}, .ui-select__option, .ui-language-switcher__choice, .ui-pager__size-choice, .ui-color-input__swatch--button, .ui-expander__header, ${IV}`, RV = "ui-key-value-action__row", zV = `${LV}, ${`${pl}, .${RV}`}`, BV = "ui-pressing", VV = "ui-press-held", HV = "--ui-press-x", UV = "--ui-press-y", WV = "--ui-ripple-radius", GV = "--ui-ripple-opacity", KV = class {
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
		if (t === null || typeof t.animate != "function" || Of()) return;
		for (let [e, n] of this.presses) n.element === t && this.finish(e, n);
		let n = t.getBoundingClientRect(), r = e.clientX - n.left, i = e.clientY - n.top, a = Math.hypot(Math.max(r, n.width - r), Math.max(i, n.height - i));
		t.style.setProperty(HV, `${r}px`), t.style.setProperty(UV, `${i}px`), t.classList.add(BV, VV);
		let o = t.animate([{ [WV]: "0px" }, { [WV]: `${a}px` }], {
			duration: z.ripple,
			easing: z.ease,
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
		let t = e.closest(IV) ?? e.closest(zV);
		if (t === null || O(t)) return null;
		let n = e.closest(Qr);
		return n !== null && n !== t && t.contains(n) ? null : t.matches(LV) ? t : this.pressedRow(t, e);
	}
	pressedRow(e, t) {
		if (zc(t, e) !== null || k(e) || e.hasAttribute("data-ui-row-editing")) return null;
		let n = e.closest(F), r = n !== null && !e.classList.contains(RV) && !n.hasAttribute("data-ui-no-row-select") && (n.getAttribute("data-ui-selection") === "one" || n.getAttribute("data-ui-selection") === "many"), i = e.classList.contains("ui-tree__row") && Qo(e, "data-ui-unselectable");
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
		n.element.classList.remove(VV);
		let r = Math.max(0, z.ripple - (performance.now() - n.started)), i = 0;
		!t && r > 0 && (i = Math.min(r, z.fast), n.grow.updatePlaybackRate(r / i)), n.fade = n.element.animate([{ [GV]: 1 }, { [GV]: 0 }], {
			duration: z.normal,
			delay: i,
			easing: z.exit,
			fill: "forwards"
		}), n.fade.addEventListener("finish", () => this.finish(e, n));
	}
	finish(e, t) {
		t.grow.cancel(), t.fade?.cancel(), t.element.classList.remove(BV, VV), this.presses.get(e) === t && this.presses.delete(e);
	}
}, qV = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"Home",
	"End",
	"PageUp",
	"PageDown"
]), JV = [
	"click",
	"dblclick",
	"auxclick",
	"dragstart"
], YV = `.${Ur}, .${Wr}`, XV = RegExp(`(^|\\s)(${Ur}|${Wr})(\\s|$)`), ZV = RegExp(`(^|\\s)${Gr}(\\s|$)`), QV = "[type='range']", $V = /* @__PURE__ */ new WeakSet(), eH = /* @__PURE__ */ new WeakSet();
function tH(e = document) {
	let t = e === document ? window : e;
	for (let e of JV) t.addEventListener(e, lH, !0);
	t.addEventListener("keydown", dH, !0), t.addEventListener("change", fH, !0), t.addEventListener("pointerdown", pH, !0), t.addEventListener("mousedown", pH, !0), oH(e.querySelectorAll(YV)), iH(e.querySelectorAll(`[${Hr}]`)), rH(e.querySelectorAll(QV)), new MutationObserver((e) => {
		for (let t of e) nH(t);
	}).observe(e, {
		subtree: !0,
		childList: !0,
		attributes: !0,
		attributeFilter: ["class", Hr],
		attributeOldValue: !0
	});
}
function nH(e) {
	if (e.type === "attributes") {
		let t = e.target;
		if (e.attributeName === "data-ui-href") {
			aH(t, e.oldValue !== null);
			return;
		}
		let n = XV.test(e.oldValue ?? ""), r = t.matches(YV);
		n !== r && (sH(t, r), aH(t)), ZV.test(e.oldValue ?? "") !== t.matches(".ui-readonly") && rH(t.querySelectorAll(QV));
		return;
	}
	let t = (e.target instanceof Element ? e.target : null)?.matches(YV) === !0;
	for (let n of e.addedNodes) n instanceof Element && (t && cH(n), n.matches(YV) && sH(n, !0), oH(n.querySelectorAll(YV)), aH(n), iH(n.querySelectorAll(`[${Hr}]`)), rH([n, ...n.querySelectorAll(QV)]));
}
function rH(e) {
	for (let t of e) {
		if (!(t instanceof HTMLInputElement) || t.type !== "range") continue;
		let e = A(t);
		e !== $V.has(t) && (e ? ($V.add(t), t.addEventListener("touchstart", pH, { passive: !1 })) : ($V.delete(t), t.removeEventListener("touchstart", pH)));
	}
}
function iH(e) {
	for (let t of e) aH(t);
}
function aH(e, t = !1) {
	let n = e.getAttribute(Hr);
	n === null && !t || (e.matches(YV) ? (e.removeAttribute("href"), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0")) : n === null || !Bg(n) ? e.removeAttribute("href") : e.getAttribute("href") !== n && (e.setAttribute("href", n), e.getAttribute("tabindex") === "0" && e.removeAttribute("tabindex")));
}
function oH(e) {
	for (let t of e) sH(t, !0);
}
function sH(e, t) {
	for (let n of e.children) t ? cH(n) : eH.has(n) && (eH.delete(n), n.removeAttribute("inert"));
}
function cH(e) {
	e.hasAttribute("inert") || (eH.add(e), e.setAttribute("inert", ""));
}
function lH(e) {
	e.target instanceof Element && (O(e.target) ? (e.type === "click" && am(e), mH(e)) : e.type === "click" && uH(e.target) && e.preventDefault());
}
function uH(e) {
	return e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio") && A(e);
}
function dH(e) {
	if (!(!(e instanceof KeyboardEvent) || !(e.target instanceof Element))) {
		if ((e.key === "Enter" || e.key === " ") && O(e.target)) {
			mH(e);
			return;
		}
		!qV.has(e.key) || !(e.target instanceof HTMLInputElement) || (e.target.type === "range" || e.target.type === "radio") && A(e.target) && e.preventDefault();
	}
}
function fH(e) {
	e.target instanceof HTMLInputElement && e.target.type === "range" && A(e.target) && e.stopImmediatePropagation();
}
function pH(e) {
	!(e.target instanceof HTMLInputElement) || e.target.type !== "range" || !A(e.target) || (e.preventDefault(), e.target.focus({ preventScroll: !0 }));
}
function mH(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region src/interactions/popup-service.ts
var hH = /* @__PURE__ */ new WeakMap(), gH = /* @__PURE__ */ new WeakSet(), _H = /* @__PURE__ */ new WeakSet(), vH = new $m({
	show: () => void 0,
	hide: ({ popup: e }, t) => {
		let n = hH.get(e);
		hH.delete(e), t !== void 0 && n?.(t);
	},
	single: !1,
	isInside: ({ popup: e, anchor: t }, n) => n.includes(e) || t !== void 0 && n.includes(t),
	onPress: !0,
	closesOnTab: ({ popup: e }) => gH.has(e),
	sheetOnPhone: ({ popup: e }) => _H.has(e)
});
function yH(e) {
	return {
		open: (e, t, n) => bH(e, t, n, (e) => vH.open(e)),
		openList: xH,
		listKey: xD,
		followPointer: wD,
		focusReturn: (t) => wd(t, e)
	};
}
function bH(e, t, n, r) {
	let i = n.owner ?? (e instanceof HTMLElement ? e : t), a = () => vH.popupOf(i) === t;
	return hH.set(t, n.onDismiss), n.closesOnTab === !0 ? gH.add(t) : gH.delete(t), n.sheetOnPhone === !0 ? _H.add(t) : _H.delete(t), r({
		owner: i,
		popup: t,
		anchor: e,
		placement: n
	}) || (hH.delete(t), queueMicrotask(() => n.onDismiss("owner"))), {
		reposition: () => {
			a() && vH.reposition(i);
		},
		close: () => {
			a() && vH.close(i);
		}
	};
}
function xH(e, t, n) {
	return bH(e, t, {
		...n,
		closesOnTab: !0
	}, (e) => bD(vH, e, n.entries, n.checked, n.fromEnd, n.focus));
}
//#endregion
//#region src/rendering/series-colors.ts
var SH = "--ui-color-series-count", CH = "--ui-color-series-", wH = 8;
function TH(e) {
	let t = Number(getComputedStyle(e).getPropertyValue(SH));
	return Number.isFinite(t) && t >= 1 ? Math.floor(t) : wH;
}
function EH(e, t) {
	return `var(${CH}${e % t + 1})`;
}
var DH = {
	count: TH,
	color: EH
};
//#endregion
//#region src/items/item-rows.ts
function OH(e, t, n) {
	return {
		itemOf: (e) => t.getItemValue(e),
		itemsOf: (e) => n.itemsOf(e),
		readPath: pC,
		renderVariant: (n, r, i) => {
			let a = e.getVariantTemplate(r, i), o = t.getItemScope(n);
			return a === void 0 || o === void 0 ? null : t.renderFromTemplate(a, o.item, t.getAncestorStack(n));
		},
		isKeyTarget: (e) => Zl(e) !== null,
		cellsOf: (e) => {
			let t = e.closest(F);
			return t !== null && ou(t) ? lu(t, e) : [];
		},
		moveCursor: (e, t) => xu(e, t ?? null)
	};
}
//#endregion
//#region src/items/items-template-renderer.ts
var kH = class {
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
		let c = this.metadata.getItemsTemplateMetadata(e), l = c?.itemWrapperElementName ? MH(o, c.itemWrapperElementName, c.itemWrapperClassName ?? null, c.itemWrapperRole ?? null) : o;
		l !== o && this.moveItemScope(o, l), NH(l, n, t);
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
		let i = jH(r.item, t, n);
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
	setRowFiller(e) {
		this.fillRow = e;
	}
	rewriteRowWords(e, t) {
		this.translatableRowBindings ??= this.findTranslatableRowBindings();
		for (let [n, r] of this.translatableRowBindings) for (let i of e.querySelectorAll(r)) {
			let e = this.stackOf(i);
			AH(n, e) && this.applyBoundAttribute(i, String(T(n.bindingId)), e, t);
		}
	}
	findTranslatableRowBindings() {
		let e = [];
		for (let t of this.metadata.metadata.bindings) {
			let n = this.metadata.getPropertyDefinition(t.propertyId);
			if (n === void 0 || typeof t.itemTemplate != "string" || !this.metadata.isTranslatable(t)) continue;
			let r = T(t.bindingId);
			e.push([t, `[${Ge}${mi(n.propertyName)}="${C(r)}"]`]);
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
		let r = RH(t, n.templateKeyPropertyName);
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
		r !== void 0 && lC(e, r.itemTemplateParameters, n) || this.applyBoundAttribute(e, t, n);
	}
	applyBoundAttribute(e, t, n, r) {
		let i = Number(t);
		if (!Number.isInteger(i) || i <= 0) return;
		let a = this.metadata.getBindingById(i), o = a === void 0 ? void 0 : this.metadata.getPropertyDefinition(a.propertyId);
		if (a === void 0 || o === void 0) return;
		let c = a.itemTemplate === null || a.itemTemplate === void 0 ? this.state.has(a, []) ? {
			ok: !0,
			value: this.state.get(a, [])
		} : { ok: !1 } : cC(n, a.itemTemplate, a.itemTemplateParameters);
		if (!c.ok) {
			a.optional !== !0 && !this.unresolved.has(i) && (this.unresolved.add(i), s("item binding value could not be resolved; the item's path stops short of the property.", {
				binding: a,
				stack: n
			}));
			return;
		}
		let l = "scope" in c ? c.scope : void 0, u = c.value ?? a.fallbackValue;
		if (r !== void 0 && !r(u)) return;
		let d = Vo(u, () => this.metadata.isTranslatable(a) && !uC(l)), f = T(a.componentId), p = e.closest(`[${v}="${f}"]`);
		if (p === null) {
			s("item binding component root was not found in the cloned template.", { binding: a });
			return;
		}
		for (let t of o.operations) {
			let n = _i(p, t, () => [e])[0] ?? null;
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
function AH(e, t) {
	for (let n of e.itemTemplateParameters ?? []) {
		let e = T(n.componentId);
		if (e > 0 && !t.some((t) => t.scopeComponentId === e)) return !1;
	}
	return !0;
}
function jH(e, t, n) {
	if (t.length === 0) return n;
	let r = e;
	for (let n = 0; n < t.length - 1; n++) {
		let i = t[n], a = i.kind === "property" ? mC(r, i.name) : yC(r, i.key);
		if (!a.ok) return e;
		r = a.value;
	}
	if (typeof r != "object" || !r) return e;
	let i = t[t.length - 1];
	if (i.kind === "element") return bC(r, i.key, n), e;
	let a = r;
	return a[gC(a, i.name)] = n, e;
}
function MH(e, t, n, r) {
	let i = document.createElement(t);
	return n !== null && (i.className = n), r !== null && r.length > 0 && i.setAttribute("role", r), i.appendChild(e), i;
}
function NH(e, t, n) {
	e.setAttribute(y, t), LH(e, n), FH(e, n);
}
var PH = [
	["CanSelect", oe],
	["CanDrag", se],
	["CanRemove", ce],
	["CanRename", le],
	["CanShowContextMenu", ue]
];
function FH(e, t) {
	for (let [n, r] of PH) {
		let i = mC(t, n);
		e.toggleAttribute(r, i.ok && i.value === !1);
	}
}
function IH(e, t) {
	let n = e.getAttribute(y), r = e.closest(`[${b}]`);
	if (FH(e, t), n !== null) for (let i of e.querySelectorAll(`[${y}="${C(n)}"]`)) i.closest("[data-ui-items-host]") === r && FH(i, t);
}
function LH(e, t) {
	let n = mC(t, "Group");
	n.ok && typeof n.value == "string" ? e.setAttribute(yt, n.value) : e.removeAttribute(yt);
}
function RH(e, t) {
	if (t == null || t.trim().length === 0) return null;
	let n = mC(e, t);
	return !n.ok || n.value === null || n.value === void 0 ? null : typeof n.value == "string" ? n.value : String(n.value);
}
//#endregion
//#region src/items/items-rule-watcher.ts
var zH = "Group", BH = class {
	options;
	dragged = null;
	deferred = /* @__PURE__ */ new Map();
	drawnByHost = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, e.propertyPatchEngine.addValueChangeHandler((e) => this.handleItemValueChange(e));
		for (let t of e.metadata.metadata.itemsFilterSort) {
			let n = T(t.componentId), r = [...t.filters, ...t.sorts], i = () => this.syncComponentHosts(n);
			for (let t of r) t.source !== null && t.source !== void 0 && e.reactiveSources.watch(t.source, i);
		}
		e.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), e.root.addEventListener("dragend", () => this.land(), !0), B(e.root, `[${St}="${Ct}"]`, { attributeFilter: [rt] }, (e) => {
			for (let t of e) {
				let e = ea(t);
				e !== null && this.syncComponentHosts(e);
			}
		}), B(e.root, `[${wt}="windowed"]`, { attributeFilter: [Lt] }, (e) => {
			for (let t of e) {
				let e = ea(t);
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
			for (let [t, n] of e) t.isConnected && LR(t, n, this.options);
		});
	}
	handleItemValueChange(e) {
		if (e.dynamicParameters.length === 0) return;
		let t = this.options.metadata.getBindingByComponentAndPropertyId(T(e.reference.componentId), e.reference.propertyId), n = t === void 0 ? null : vC(t);
		if (n === null) return;
		let r = this.resolveItemRoots(e, n);
		for (let t of r) this.applyItemValue(t, n, e.value);
		r.length === 0 && this.applyVirtualizedItemValue(e, n);
	}
	applyVirtualizedItemValue(e, t) {
		let n = e.dynamicParameters[e.dynamicParameters.length - 1];
		if (typeof n == "string") for (let r of this.options.root.querySelectorAll(`[${b}]`)) {
			if (zS(r) !== "virtualized") continue;
			let i = r.closest(S);
			i === null || !this.drawsPatchedComponent(i, T(e.reference.componentId), t) || !VH(i, e.dynamicParameters) || this.options.virtualization.updateValue(r, n, t.steps, e.value) && this.redrawsVirtualized(E(i), t) && this.sync(r, E(i));
		}
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
	redrawsVirtualized(e, t) {
		return t.steps.length === 0 || this.feedsRule(e, t);
	}
	sync(e, t) {
		if (this.dragged !== null && e.contains(this.dragged)) {
			this.deferred.set(e, t);
			return;
		}
		LR(e, t, this.options);
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
		return typeof t == "string" ? [...this.options.root.querySelectorAll(`[${y}="${C(t)}"]`)].filter((t) => this.isItemRoot(t) && Ji(t, e)) : [];
	}
	applyItemValue(e, t, n) {
		let r = e.closest(`[${b}]`), i = r === null ? null : ea(r);
		if (r !== null && i !== null && zS(r) === "virtualized") {
			let a = e.getAttribute(y);
			if (a === null || !this.options.virtualization.updateValue(r, a, t.steps, n)) return;
			e.isConnected && this.restampAbilities(e, t), this.redrawsVirtualized(i, t) && this.sync(r, i);
			return;
		}
		this.options.renderer.updateItemValue(e, t.steps, n);
		let a = HH(zH, t);
		a && LH(e, this.options.renderer.getItemValue(e)), this.restampAbilities(e, t), r !== null && i !== null && (!a && !this.feedsRule(i, t) || this.sync(r, i));
	}
	restampAbilities(e, t) {
		PH.some(([e]) => HH(e, t)) && IH(e, this.options.renderer.getItemValue(e));
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
		if (this.options.templates.getGroupTemplate(e) !== void 0 && HH(zH, t)) return !0;
		let n = this.options.metadata.getItemsFilterSortMetadata(e);
		return n === void 0 ? !1 : n.filters.some((e) => HH(e.itemProperty, t)) || n.sorts.some((e) => HH(e.itemProperty, t));
	}
	syncComponentHosts(e) {
		for (let t of this.options.root.querySelectorAll(`[${b}]`)) {
			let n = ea(t);
			n === e && this.sync(t, n);
		}
	}
};
function VH(e, t) {
	let n = qi(e, Ki(e));
	return t.length === n.length + 1 && n.every((e, n) => String(e ?? "") === String(t[n] ?? ""));
}
function HH(e, t) {
	let n = t.ruleSegments.join(".");
	return n.length === 0 || e === n || e.startsWith(`${n}.`);
}
//#endregion
//#region src/items/table-row-indices.ts
var UH = "ui-table", WH = "ui-table--no-header";
function GH(e, t, n) {
	let r = e.parentElement, i = r?.parentElement ?? null;
	if (r === null || i === null || !r.classList.contains("ui-table__scroll") || !i.classList.contains(UH)) return;
	let a = [], o = [], s = !1;
	for (let t of r.children) t === e ? s = !0 : t.getAttribute("role") === "row" && !(t === r.firstElementChild && i.classList.contains(WH)) && (s ? o : a).push(t);
	a.forEach((e, t) => KH(e, t));
	for (let [e, n] of t) KH(e, a.length + n);
	n !== null && o.forEach((e, t) => KH(e, a.length + n + t)), qH(i, "aria-rowcount", n === null ? "-1" : String(a.length + n + o.length));
}
function KH(e, t) {
	qH(e, "aria-rowindex", String(t + 1));
}
function qH(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/items/items-window-engine.ts
var JH = 50, YH = 1, XH = .5, ZH = 60, QH = "--ui-window-look", $H = "--ui-window-row", eU = "--ui-window-tile", tU = 3, nU = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	started = !1;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0);
	}
	start() {
		let e = !this.started;
		this.started = !0;
		for (let t of this.hosts()) {
			if (this.layout(t), sU(t) === 0) {
				this.getState(t).pending || this.requestAsync(t, "Start", 0, null, !1);
				continue;
			}
			if (e) {
				this.revealWindow(t);
				continue;
			}
			this.realign(t), this.considerRequest(t);
		}
	}
	revealWindow(e) {
		if (e.hasAttribute("data-ui-window-paged")) return;
		let t = VS(e, Nt);
		if (t !== null && bV(e) && HS(e, "data-ui-window-more-after")) {
			Yc(e, Math.max(0, this.windowBottom(e, t) - Jc(e).height));
			return;
		}
		t !== null && t !== 0 && Yc(e, HS(e, "data-ui-window-more-after") ? t * this.getState(e).itemSize : e.scrollHeight);
	}
	windowBottom(e, t) {
		let n = oU(e), r = this.getState(e).itemSize, i = n.length === 0 ? 0 : Zc(n[n.length - 1]).bottom - Zc(n[0]).top;
		return t * r + (i > 0 ? i : n.length * r);
	}
	sync() {
		for (let e of this.hosts()) this.layout(e), this.getState(e).pending || this.realign(e);
	}
	realign(e) {
		let t = VS(e, Nt), n = oU(e);
		if (t === null || n.length === 0 || e.hasAttribute("data-ui-window-paged")) return;
		let r = this.getState(e), i = Jc(e), a = Math.floor(i.top / r.itemSize);
		Math.ceil((i.top + i.height) / r.itemSize) >= t && a <= t + n.length || this.revealWindow(e);
	}
	reconsider() {
		for (let e of this.hosts()) this.considerRequest(e);
	}
	async requestOffsetAsync(e, t) {
		zS(e) === "windowed" && await this.requestAsync(e, "Offset", Math.max(0, Math.floor(t)), null, !1);
	}
	hosts() {
		return [...this.root.querySelectorAll(`[${b}][${wt}="windowed"]`)];
	}
	handleScroll(e) {
		let t = qc(e.target);
		if (t === null || zS(t) !== "windowed" || t.hasAttribute("data-ui-window-paged")) return;
		let n = this.getState(t);
		n.scheduled === 0 && (this.considerRequest(t), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.considerRequest(t);
		}, ZH));
	}
	considerRequest(e) {
		let t = this.getState(e);
		if (t.pending) {
			t.restless = !0;
			return;
		}
		if (e.hasAttribute("data-ui-window-paged") && sU(e) > 0) return;
		let n = oU(e);
		if (n.length === 0) {
			this.requestAsync(e, "Start", 0, null, !1);
			return;
		}
		let r = VS(e, Nt), i = HS(e, Ft), a = HS(e, It);
		if (r !== null) {
			let o = this.windowSize(e), s = Jc(e), c = Math.max(1, Math.round(s.height * YH / t.itemSize), Math.floor(o * XH)), l = Math.floor(s.top / t.itemSize), u = Math.ceil((s.top + s.height) / t.itemSize);
			if (u < r || l > r + n.length) {
				this.requestAsync(e, "Offset", this.landingOffset(e, l, o), null, !1);
				return;
			}
			if (l - c <= r && i) {
				this.requestAsync(e, "Before", 0, cU(n[0]), !0);
				return;
			}
			if (u + c >= r + n.length && a) {
				this.requestAsync(e, "After", 0, cU(n[n.length - 1]), !0);
				return;
			}
			return;
		}
		let o = Jc(e), s = Math.max(1, o.height * YH), c = o.contentHeight - o.top - o.height;
		if (o.top <= s && i) {
			this.requestAsync(e, "Before", 0, cU(n[0]), !0);
			return;
		}
		c <= s && a && this.requestAsync(e, "After", 0, cU(n[n.length - 1]), !0);
	}
	landingOffset(e, t, n) {
		let r = Math.max(0, t - Math.floor(n / 4)), i = VS(e, Pt);
		return i === null ? r : Math.min(r, Math.max(0, i - n));
	}
	async requestAsync(e, t, n, r, i) {
		let a = ea(e);
		if (a === null) {
			s("a windowed items host is not inside an addressable component.", e);
			return;
		}
		if (r === null && (t === "Before" || t === "After")) return;
		let o = this.getState(e);
		o.pending = !0;
		let c = e.closest(S);
		e.setAttribute(At, t.toLowerCase()), c?.setAttribute(At, t.toLowerCase()), e.setAttribute("aria-busy", "true"), t === "After" && VS(e, "data-ui-window-total") === null && iU(e) && AR(e, kR, tU * this.rowSize(e));
		try {
			await this.options.requestWindow({
				componentId: a,
				dynamicParameters: lU(e),
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
			o.pending = !1, e.removeAttribute(At), c?.removeAttribute(At), e.removeAttribute("aria-busy"), AR(e, kR, 0), this.layout(e), o.restless ? (o.restless = !1, this.considerRequest(e)) : this.realign(e);
		}
	}
	layout(e) {
		let t = this.getState(e), n = oU(e), r = VS(e, Pt), i = VS(e, Nt);
		if (GH(e, n.map((e, t) => [e, (i ?? 0) + t]), r), e.hasAttribute("data-ui-window-paged")) {
			AR(e, "top", 0), AR(e, OR, 0);
			return;
		}
		if (n.length > 0) {
			let r = Zc(n[n.length - 1]).bottom - Zc(n[0]).top;
			if (r > 0) {
				let i = rU(n), a = Math.ceil(n.length / i);
				t.itemSize = Math.max(1, Math.round(r / (a * i))), aU(e, a > 1 ? (Zc(n[n.length - 1]).top - Zc(n[0]).top) / (a - 1) : r, i > 1 ? Zc(n[1]).left - Zc(n[0]).left : null);
			}
		}
		let a = r === null || i === null ? 0 : i * t.itemSize, o = r === null || i === null ? 0 : Math.max(0, r - i - n.length) * t.itemSize;
		AR(e, "top", a), AR(e, OR, o), sV(e);
	}
	rowSize(e) {
		let t = Number.parseFloat(e.style.getPropertyValue($H));
		return Number.isFinite(t) && t > 0 ? t : this.getState(e).itemSize;
	}
	windowSize(e) {
		let t = VS(e, Mt);
		return t !== null && t > 0 ? t : JH;
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
function rU(e) {
	let t = Zc(e[0]).top, n = 1;
	for (; n < e.length && Zc(e[n]).top === t;) n++;
	return n;
}
function iU(e) {
	return getComputedStyle(e).getPropertyValue(QH).trim() === "skeleton";
}
function aU(e, t, n) {
	let r = e.style, i = `${Math.round(t * 100) / 100}px`, a = n !== null && n > 0 ? `${Math.round(n * 100) / 100}px` : "";
	r.getPropertyValue($H) !== i && r.setProperty($H, i), r.getPropertyValue(eU) !== a && (a.length === 0 ? r.removeProperty(eU) : r.setProperty(eU, a));
}
function oU(e) {
	return [...e.children].filter((e) => e.hasAttribute(y));
}
function sU(e) {
	return oU(e).length;
}
function cU(e) {
	return e.getAttribute(y);
}
function lU(e) {
	let t = e.closest(S);
	return t === null ? [] : qi(t, Ki(t));
}
//#endregion
//#region src/items/items-composite-renderer.ts
var uU = [
	v,
	ie,
	ae
];
function dU(e, t, n, r, i, a, o) {
	let c = document.createElement(e.itemElementName);
	c.className = e.itemClassName, fU(c, e.itemRole);
	let l = mU(c, e, t, a);
	l !== 0 && o.populateElement(c, n, l, i);
	for (let l of e.slots) {
		let e = pU(l, t, n, a);
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
		d.className = l.wrapperClassName, fU(d, l.wrapperRole);
		for (let [e, t] of Object.entries(l.wrapperAttributes ?? {})) d.setAttribute(e, t);
		d.appendChild(u), NH(d, r, n), c.appendChild(d);
	}
	return NH(c, r, n), o.registerItemScope(c, l, n), c;
}
function fU(e, t) {
	t != null && t.length > 0 && e.setAttribute("role", t);
}
function pU(e, t, n, r) {
	let i = RH(n, e.variantKeyPropertyName);
	if (i !== null && i.length > 0) {
		let n = r.getVariantTemplate(t, `${e.variantKey}:${i}`);
		if (n !== void 0) return n;
	}
	return r.getVariantTemplate(t, e.variantKey);
}
function mU(e, t, n, r) {
	let i = t.hostSlotVariantKey;
	if (i == null || i.length === 0) return 0;
	let a = r.getVariantTemplate(n, i)?.content.firstElementChild ?? null;
	if (a === null) return s("composite item host slot template was not found.", {
		componentId: n,
		hostSlotVariantKey: i
	}), 0;
	for (let t of uU) {
		let n = a.getAttribute(t);
		n !== null && e.setAttribute(t, n);
	}
	for (let t of Array.from(a.attributes)) t.name.startsWith("data-ui-bind-") && e.setAttribute(t.name, t.value);
	return e instanceof HTMLElement && (e.style.alignSelf = "stretch", e.style.justifySelf = "stretch"), E(a);
}
//#endregion
//#region src/items/items-row-renderer.ts
function hU(e, t, n, r, i) {
	let a = i.metadata.getItemsTemplateMetadata(e), o = a?.composite;
	if (o == null) return gU(i.renderer.renderItem(e, t, n, r), a);
	let s = dU(o, e, t, n, r, i.templates, i.renderer);
	return s !== null && a?.rowDecorator && i.renderer.decorateRow(a.rowDecorator, s, t, n, e, r), gU(s, a);
}
function gU(e, t) {
	return e === null ? null : (t?.announcesSelection === !0 && !e.hasAttribute("aria-selected") && e.setAttribute("aria-selected", "false"), Wo(e), e);
}
//#endregion
//#region src/items/items-virtualization-engine.ts
var _U = 6, vU = 60, yU = class {
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
		return r === void 0 || i < 0 || a < 0 ? null : r.slice(Math.min(i, a), Math.max(i, a) + 1).filter((e) => CU(e.entry) === !1).map((e) => e.entry.key);
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
		if (!DU(e) && !TU(e)) return a.element;
		let o = getComputedStyle(e), s = AU(o), c = r.projected.map((e) => this.pitchOf(r, e) + s), l = DU(e) ? OU(r.projected, c, r.across) : null, u = l === null ? i : EU(l.starts, i), d = l?.pitches ?? c, f = jU(o.paddingTop) + MU(d, 0, u), p = f + d[u] - s, m = Jc(e), h = n === "start" || n === "nearest" && f < m.top ? f : n === "end" || p > m.top + m.height ? p - m.height : null;
		return h !== null && Yc(e, Math.max(0, h)), this.layout(e, r), a.element;
	}
	sync(e) {
		let t = this.getState(e);
		if (t === null) return;
		let n = bV(e) && SV(e), r = t.projected;
		this.project(e, t), this.keepCursorShown(e, t, r), this.layout(e, t), n && !SV(e) && (Yc(e, e.scrollHeight), this.layout(e, t));
	}
	refill(e, t) {
		let n = this.getState(e);
		if (n === null) return [];
		let r = new Map(n.entries.map((e) => [e.key, e])), i = [], a = [];
		for (let { key: n, item: o } of t) {
			let t = r.get(n);
			if (r.delete(n), t !== void 0 && Jd(t.item, o)) {
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
		let n = Fu(t);
		t.remove(), Iu(e, null, n);
	}
	keepCursorShown(e, t, n) {
		let r = Pu(e), i = t.entries.find((e) => e.element?.hasAttribute("data-ui-row-focus") === !0) ?? null, a = i?.key ?? (r === null ? null : Ru(r));
		if (r === null || a === null) return;
		let o = /* @__PURE__ */ new Set();
		for (let e of t.projected) e.header || o.add(e.entry.key);
		if (o.has(a)) return;
		let s = n.filter((e) => !e.header).map((e) => e.entry), c = s.findIndex((e) => e.key === a), l = c < 0 ? void 0 : s.slice(c + 1).find((e) => o.has(e.key)) ?? s.slice(0, c).reverse().find((e) => o.has(e.key));
		if (i?.element?.removeAttribute(je), l === void 0) {
			r.removeAttribute(Me), r.removeAttribute("aria-activedescendant");
			return;
		}
		l.element instanceof HTMLElement ? iu(r, H(e).filter((e) => e instanceof HTMLElement), l.element, null, !1) : r.setAttribute(Me, l.key);
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
		let i = n.entries[r].element, a = Pu(e), o = H(e).filter((e) => e instanceof HTMLElement), s = a !== null && i instanceof HTMLElement ? ju(a, o, i) : null;
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
		return i === null || a === void 0 ? !1 : (a.item = jH(a.item, n, r), n.length === 0 && a.element !== null && (this.dropRow(e, a.element), a.element = null), !0);
	}
	project(e, t) {
		let n = this.options.metadata.getItemsFilterSortMetadata(t.componentId), r = SC(e), i = this.options.templates.getGroupTemplate(t.componentId), a = EC(n, this.options.state, r), o = t.entries;
		if ((n !== void 0 && n.filters.length > 0 || (r?.filters ?? []).length > 0) && (o = o.filter((e) => wC(n, e.item, this.options.state, r))), !(i !== void 0 && o.some((e) => wU(e) !== ""))) {
			a.length > 0 && (o = [...o].sort((e, t) => OC(e.item, t.item, a))), t.projected = o.map((e) => ({
				entry: e,
				header: !1
			}));
			return;
		}
		let { buckets: s, order: c } = wR(o, wU, t.groupOrder);
		t.groupOrder = c;
		let l = [];
		for (let e of c) {
			let t = s.get(e);
			a.length > 0 && (t = [...t].sort((e, t) => OC(e.item, t.item, a))), e !== "" && l.push({
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
		let t = qc(e.target);
		t !== null && zS(t) === "virtualized" && this.relayout(t);
	}
	handleResize(e) {
		for (let t of e) {
			let e = t.target;
			e.isConnected && zS(e) === "virtualized" ? window.requestAnimationFrame(() => this.relayout(e)) : this.resizes?.unobserve(e);
		}
	}
	relayout(e) {
		let t = this.getState(e);
		t !== null && t.scheduled === 0 && (this.layout(e, t), t.scheduled = window.setTimeout(() => {
			t.scheduled = 0, this.layout(e, t);
		}, vU));
	}
	layout(e, t) {
		let n = t.projected, r = getComputedStyle(e), i = AU(r), a = n.map((e) => this.pitchOf(t, e) + i), o = n.length, s = t.across, c = DU(e) ? OU(n, a, s) : null, l = c?.pitches ?? a, u = l.length, d = 0, f = u;
		if ((c !== null || TU(e)) && u > 0) {
			let i = jU(r.paddingTop), a = Jc(e), o = xU(e, t, n, l, s, a.top - i, i), c = o + a.height, p = 0;
			d = u;
			for (let e = 0; e < u; e++) {
				let t = p + l[e];
				if (d === u && t > o && (d = e), p >= c) {
					f = e;
					break;
				}
				p = t;
			}
			d === u && (d = Math.max(0, u - 1)), d = Math.max(0, d - _U), f = Math.min(u, f + _U);
		}
		let p = c === null ? d : c.starts[d] ?? o, m = c === null ? f : f < u ? c.starts[f] : o, h = this.options.renderer.getAncestorStack(e), g = [], ee = [], _ = -1, te = !1;
		for (let r = 0; r < o; r++) {
			let i = n[r];
			i.header || _++;
			let a = r >= p && r < m, o = (i.header ? t.headers.get(wU(i.entry)) ?? null : i.entry)?.element ?? null;
			if (!a) {
				o !== null && (this.dropRow(e, o), SU(t, i, null), te = !0);
				continue;
			}
			if (o !== null) {
				i.header && DR(o, i.entry.key), g.push(o), i.header || ee.push([o, _]);
				continue;
			}
			let s = i.header ? this.renderHeader(t, i.entry, h) : this.renderRow(t, i.entry, h);
			s !== null && (i.header || Lu(e, s), SU(t, i, s), g.push(s), i.header || ee.push([s, _]), te = !0);
		}
		let ne = new Set(g);
		for (let n of t.entries) n.element !== null && !ne.has(n.element) && (this.dropRow(e, n.element), n.element = null, te = !0);
		for (let t of H(e)) ne.has(t) || (this.dropRow(e, t), te = !0);
		for (let t of e.querySelectorAll(`:scope > [${_t}]`)) ne.has(t) || (t.remove(), te = !0);
		for (let e of t.headers.values()) e.element !== null && !ne.has(e.element) && (e.element = null);
		let re = MU(l, 0, d), v = MU(l, f, u);
		jR(e, [...g, ...tC(nC(e))]), AR(e, "top", re > 0 ? re - i : 0), AR(e, OR, v > 0 ? v - i : 0), rC(e, t.componentId, this.options.templates, this.options.renderer, o > 0), GH(e, ee, _ + 1), (te || t.first !== p || t.last !== m) && (t.first = p, t.last = m, this.options.dom.invalidate()), t.laidOut = n, t.pitches = l, t.laidAcross = s, t.firstLine = d, t.lastLine = f, this.measure(t, n, p, m), c !== null && (t.across = kU(e, r, t.tileWidth) ?? t.across, t.across !== s && this.layout(e, t));
	}
	renderRow(e, t, n) {
		return hU(e.componentId, t.item, t.key, n, this.options);
	}
	renderHeader(e, t, n) {
		let r = this.options.templates.getGroupTemplate(e.componentId);
		return r === void 0 ? null : ER(r, this.options.renderer, t.item, t.key, n);
	}
	measure(e, t, n, r) {
		let i = 0;
		for (let a = n; a < r && a < t.length; a++) {
			let n = t[a], r = n.header ? e.headers.get(wU(n.entry)) : n.entry, o = r?.element;
			if (r == null || o == null) continue;
			let s = Zc(o);
			s.height <= 0 || (bU(n.header ? e.headerHeights : e.itemHeights, r.height, s.height), r.height = s.height, n.header || (i = Math.max(i, s.width)));
		}
		i > 0 && (e.tileWidth = i), e.itemHeights.count > 0 && (e.itemEstimate = e.itemHeights.sum / e.itemHeights.count), e.headerHeights.count > 0 && (e.headerEstimate = e.headerHeights.sum / e.headerHeights.count);
	}
	pitchOf(e, t) {
		return t.header ? e.headers.get(wU(t.entry))?.height ?? e.headerEstimate : t.entry.height ?? e.itemEstimate;
	}
	getState(e) {
		let t = this.states.get(e);
		if (t !== void 0) return t;
		let n = ta(e);
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
function bU(e, t, n) {
	t === null ? (e.sum += n, e.count++) : e.sum += n - t;
}
function xU(e, t, n, r, i, a, o) {
	if (t.laidOut !== n || t.laidAcross !== i || t.pitches.length !== r.length || a <= 0) return a;
	let s = 0, c = 0;
	for (let e = 0; e < r.length; e++) {
		let n = e >= t.firstLine && e < t.lastLine ? r[e] : t.pitches[e];
		if (s + n > a) break;
		s += n, c += r[e];
	}
	let l = c - s;
	return Math.abs(l) < .5 ? a : (Yc(e, a + l + o), a + l);
}
function SU(e, t, n) {
	if (!t.header) {
		t.entry.element = n;
		return;
	}
	let r = wU(t.entry), i = e.headers.get(r);
	i === void 0 ? e.headers.set(r, {
		element: n,
		height: null
	}) : i.element = n;
}
function CU(e) {
	let t = mC(e.item, "CanSelect");
	return t.ok && t.value === !1;
}
function wU(e) {
	let t = mC(e.item, "Group");
	return t.ok && typeof t.value == "string" ? t.value : "";
}
function TU(e) {
	let t = e.parentElement;
	return t !== null && (t.classList.contains("ui-table__scroll") || t.classList.contains("ui-items-view--stack") && t.classList.contains("ui-orientation--vertical"));
}
function EU(e, t) {
	let n = 0;
	for (; n + 1 < e.length && e[n + 1] <= t;) n++;
	return n;
}
function DU(e) {
	return e.parentElement?.classList.contains("ui-items-view--wrap") === !0;
}
function OU(e, t, n) {
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
function kU(e, t, n) {
	let r = e.clientWidth - jU(t.paddingLeft) - jU(t.paddingRight);
	if (n === null || n <= 0 || r <= 0) return null;
	let i = jU(t.columnGap);
	return Math.max(1, Math.floor((r + i + .5) / (n + i)));
}
function AU(e) {
	return jU(e.rowGap);
}
function jU(e) {
	let t = Number.parseFloat(e);
	return Number.isFinite(t) ? t : 0;
}
function MU(e, t, n) {
	let r = 0;
	for (let i = t; i < n; i++) r += e[i];
	return r;
}
//#endregion
//#region src/items/items-template-registry.ts
var NU = "data-ui-template", PU = "default", FU = class {
	dom;
	templateComponentIds = null;
	constructor(e) {
		this.dom = e;
	}
	getTemplate(e, t) {
		let n = t ?? PU, r = this.findTemplate(e, n);
		return r === void 0 ? n === PU ? void 0 : this.getTemplate(e, null) : r;
	}
	getVariantTemplate(e, t) {
		return this.findTemplate(e, t);
	}
	findTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		if (n === null) return;
		let r = n.querySelectorAll(`:scope > template[${NU}]`);
		for (let e of r) if (e.getAttribute(NU) === t) return e;
	}
	isTemplateComponent(e) {
		return this.templateComponentIds ??= IU(this.dom.root), this.templateComponentIds.has(e);
	}
	getEmptyTemplate(e) {
		return this.getMarkedTemplate(e, mt);
	}
	getGroupTemplate(e) {
		return this.getMarkedTemplate(e, ht);
	}
	getMarkedTemplate(e, t) {
		return this.dom.findComponent(e, [])?.querySelector(`:scope > template[${t}]`) ?? void 0;
	}
};
function IU(e) {
	let t = /* @__PURE__ */ new Set();
	return Bo(e, (n) => {
		if (n !== e) for (let e of n.querySelectorAll(S)) {
			let n = E(e);
			n > 0 && t.add(n);
		}
	}), t;
}
//#endregion
//#region src/rendering/theme-colors.ts
function LU(e, t) {
	let n = e.querySelector(`style[${vr}]`);
	if (t.length === 0) {
		n?.remove();
		return;
	}
	if (n !== null) {
		n.textContent !== t && (n.textContent = t);
		return;
	}
	let r = document.createElement("style");
	r.setAttribute(vr, ""), r.textContent = t, e.insertBefore(r, e.querySelector("style")?.nextElementSibling ?? null);
}
//#endregion
//#region src/metadata/metadata-reader.ts
var RU = "script[type='application/json'][data-ui-metadata]";
function zU(e = document) {
	let t = e.querySelector(RU);
	if (t === null) return BU();
	let n = t.textContent?.trim() ?? "";
	if (n.length === 0) return BU();
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
function BU() {
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
var VU = "script[type='application/json'][data-ui-hydration]";
function HU(e) {
	return e !== null && (fo(e.title) || fo(e.changes));
}
function UU(e = document) {
	let t = e.querySelector(VU)?.textContent?.trim() ?? "";
	if (t.length === 0) return null;
	try {
		let e = JSON.parse(t), n = e.words;
		return {
			pageId: e.pageId ?? null,
			sequence: typeof e.sequence == "number" ? e.sequence : null,
			view: typeof e.view == "string" ? e.view : null,
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
var WU = "reconnecting";
async function GU(e, t, n, r) {
	for (let i = 0;; i++) try {
		return await e();
	} catch (e) {
		if (t()) return s("attaching the runtime failed as the connection dropped again; the reconnect attaches.", e), WU;
		if (i >= n.length) return c("attaching the runtime failed after retrying; giving up.", e), null;
		s("attaching the runtime failed; retrying.", {
			attempt: i + 1,
			error: e
		}), await r(n[i]);
	}
}
//#endregion
//#region src/transport/reader-time-zone.ts
function KU(e = () => Intl.DateTimeFormat().resolvedOptions().timeZone) {
	try {
		let t = e();
		return typeof t == "string" && t.length > 0 ? t : null;
	} catch {
		return null;
	}
}
function qU(e, t, n) {
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
var JU = "/_ne/", YU = 3e3;
function XU(e, t, n) {
	let r = e.getAttribute(gr);
	if (r === null || !("serviceWorker" in navigator)) return;
	let i = navigator.serviceWorker;
	if (qU(i, t, n), e.hasAttribute("data-ui-service-worker-imported")) return () => QU(i.ready);
	let a = i.register(r, { scope: JU }).then(ZU).catch((e) => {
		s("registering the notification service worker failed; notifications are the page's own.", e);
	});
	return () => a;
}
function ZU(e) {
	let t = e.installing ?? e.waiting;
	return e.active !== null || t === null ? Promise.resolve(e) : new Promise((n) => {
		t.addEventListener("statechange", () => {
			t.state === "activated" && n(e);
		});
	});
}
function QU(e) {
	return Promise.race([e, new Promise((e) => setTimeout(() => e(void 0), YU))]);
}
//#endregion
//#region src/runtime/reload-guard.ts
var $U = "ne-standard-ui:reloaded-view";
function eW(e, t, n) {
	if (!t) return "no-cookie";
	if (rW(n) === e) return "asked-again";
	try {
		n?.setItem($U, e);
	} catch {}
	return "reload";
}
function tW(e) {
	try {
		e?.removeItem($U);
	} catch {}
}
function nW() {
	try {
		return window.sessionStorage;
	} catch {
		return null;
	}
}
function rW(e) {
	try {
		return e?.getItem($U) ?? null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/runtime/connection-watch.ts
var iW = 2e3, aW = class {
	root;
	notifications;
	graceMilliseconds;
	grace = null;
	notice = null;
	given = !1;
	constructor(e) {
		this.root = e.root, this.notifications = e.notifications, this.graceMilliseconds = e.graceMilliseconds ?? iW, e.connection.onReconnecting(() => this.reconnecting()), e.connection.onReconnected(() => this.reconnected());
	}
	reconnecting() {
		this.given || this.grace !== null || this.notice !== null || (this.grace = window.setTimeout(() => this.showReconnecting(), this.graceMilliseconds));
	}
	showReconnecting() {
		this.grace = null, this.root.setAttribute(Tr, "reconnecting"), this.notice = this.notifications.show({
			message: D.text("ui.connection.reconnecting"),
			sticky: !0,
			connection: !0
		});
	}
	reconnected() {
		this.given || (this.clear(), this.root.removeAttribute(Tr));
	}
	clear() {
		this.grace !== null && (window.clearTimeout(this.grace), this.grace = null), this.notice !== null && (this.notifications.dismiss(this.notice), this.notice = null);
	}
	lost() {
		this.given = !0, this.clear(), this.root.setAttribute(Tr, "lost");
	}
}, oW = "/_ne/values", sW = 32768;
sW / 4;
var cW = 3e4;
function lW(e) {
	let t = JSON.stringify(e);
	if (t === void 0 || t.length * 3 <= 8192) return null;
	let n = new TextEncoder().encode(t);
	return n.byteLength > 8192 ? n : null;
}
function uW(e) {
	return e?.updates?.some((e) => typeof e.valueToken == "string") === !0;
}
async function dW(e, t = null, n = cW) {
	if (e === void 0 || !uW(e)) return e;
	let r = await Promise.all((e.updates ?? []).map(async (e) => {
		let r = e.valueToken;
		if (typeof r != "string") return e;
		let i = t === null ? "" : `?instance=${encodeURIComponent(t)}`, a = await fetch(`${oW}/${encodeURIComponent(r)}${i}`, {
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
async function fW(e) {
	let t = await fetch(oW, {
		method: "POST",
		body: e,
		headers: { "Content-Type": "application/json" },
		credentials: "same-origin",
		signal: AbortSignal.timeout(cW)
	});
	if (!t.ok) throw Error(`Staging a large value failed with status ${t.status}.`);
	let n = (await t.json())?.token;
	if (n === void 0 || n.length === 0) throw Error("Staging a large value answered with no token.");
	return n;
}
//#endregion
//#region src/transport/command-dispatcher.ts
var pW = class {
	transport;
	pendingKeys = /* @__PURE__ */ new Set();
	nextRequestId = 1;
	awaited = /* @__PURE__ */ new Map();
	staging = null;
	constructor(e) {
		this.transport = e;
	}
	isPending(e) {
		return this.pendingKeys.has(mW(hW(e)));
	}
	async dispatchAsync(e) {
		let t = hW(e), n = mW(t);
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
		let t = lW(e.dynamicParameters);
		if (t === null && this.staging === null) return this.transport.processEventAsync(e);
		let n = this.staging, r = t === null ? null : fW(t), i = () => {}, a = new Promise((e) => {
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
function mW(e) {
	return e.action === void 0 ? `${JSON.stringify(e.eventId)}:${JSON.stringify(e.dynamicParameters ?? [])}` : `action:${e.action}`;
}
function hW(e) {
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
var gW = class {
	apply;
	constructor(e) {
		this.apply = e;
	}
	pushed(e) {
		return (t) => queueMicrotask(() => e(t));
	}
	answered(e, t, n, r) {
		return e.then(async (e) => (await this.apply(t(e), r), n(e)));
	}
};
async function _W(e, t) {
	try {
		await e();
	} finally {
		t();
	}
}
//#endregion
//#region src/state/property-state-store.ts
var vW = class {
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
		return r.length > 0 ? (this.recordRows(i, r), this.removeUnplaced(i)) : t.length > 0 && !this.unplacedPathByEntry.has(i) && this.recordUnplaced(i, t), a !== void 0 && Jd(a.value, n) ? !1 : (this.values.set(i, {
			reference: e,
			dynamicParameters: t,
			value: n
		}), !0);
	}
	entries() {
		return this.values.values();
	}
	forgetRows(e, t, n) {
		let r = yW(e, t);
		for (let e of n) this.forgetRow(r, e), this.forgetUnplaced(bW([...t, e]));
	}
	forgetHost(e, t) {
		this.forgetScope(yW(e, t));
		let n = this.unplaced.get(bW(t));
		for (let e of [...n?.children ?? []]) this.forgetUnplaced(e);
	}
	clear() {
		this.values.clear(), this.scopes.clear(), this.unplaced.clear(), this.unplacedPathByEntry.clear();
	}
	recordRows(e, t) {
		let n = null;
		for (let [r, i] of t.entries()) {
			let t = yW(i.host, i.hostParameters), a = this.rowState(t, i.key);
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
		let n = this.unplacedNode(bW([]), null), r = "";
		for (let e = 1; e <= t.length; e++) r = bW(t.slice(0, e)), n.children.add(r), n = this.unplacedNode(r, bW(t.slice(0, e - 1)));
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
		return `${T(e.componentId)}:${e.propertyId}:${xW(t)}`;
	}
};
function yW(e, t) {
	return JSON.stringify([e, ...t.map((e) => String(e ?? ""))]);
}
function bW(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function xW(e) {
	if (e.length === 0) return "";
	try {
		return JSON.stringify(e);
	} catch {
		return String(e);
	}
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Errors.js
var SW = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(`${e}: Status code '${t}'`), this.statusCode = t, this.__proto__ = n;
	}
}, CW = class extends Error {
	constructor(e = "A timeout occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, wW = class extends Error {
	constructor(e = "An abort occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, TW = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "UnsupportedTransportError", this.__proto__ = n;
	}
}, EW = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "DisabledTransportError", this.__proto__ = n;
	}
}, DW = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "FailedToStartTransportError", this.__proto__ = n;
	}
}, OW = class extends Error {
	constructor(e) {
		let t = new.target.prototype;
		super(e), this.errorType = "FailedToNegotiateWithServerError", this.__proto__ = t;
	}
}, kW = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.innerErrors = t, this.__proto__ = n;
	}
}, AW = class {
	constructor(e, t, n) {
		this.statusCode = e, this.statusText = t, this.content = n;
	}
}, jW = class {
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
}, K;
(function(e) {
	e[e.Trace = 0] = "Trace", e[e.Debug = 1] = "Debug", e[e.Information = 2] = "Information", e[e.Warning = 3] = "Warning", e[e.Error = 4] = "Error", e[e.Critical = 5] = "Critical", e[e.None = 6] = "None";
})(K ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Loggers.js
var MW = class {
	constructor() {}
	log(e, t) {}
};
MW.instance = new MW();
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/pkg-version.js
var NW = "10.0.11", q = class {
	static isRequired(e, t) {
		if (e == null) throw Error(`The '${t}' argument is required.`);
	}
	static isNotEmpty(e, t) {
		if (!e || e.match(/^\s*$/)) throw Error(`The '${t}' argument should not be empty.`);
	}
	static isIn(e, t, n) {
		if (!(e in t)) throw Error(`Unknown ${n} value: ${e}.`);
	}
}, J = class e {
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
function PW(e, t) {
	let n = "";
	return IW(e) ? (n = `Binary data of length ${e.byteLength}`, t && (n += `. Content: '${FW(e)}'`)) : typeof e == "string" && (n = `String data of length ${e.length}`, t && (n += `. Content: '${e}'`)), n;
}
function FW(e) {
	let t = new Uint8Array(e), n = "";
	return t.forEach((e) => {
		n += `0x${e < 16 ? "0" : ""}${e.toString(16)} `;
	}), n.substring(0, n.length - 1);
}
function IW(e) {
	return e && typeof ArrayBuffer < "u" && (e instanceof ArrayBuffer || e.constructor && e.constructor.name === "ArrayBuffer");
}
async function LW(e, t, n, r, i, a) {
	let o = {}, [s, c] = VW();
	o[s] = c, e.log(K.Trace, `(${t} transport) sending data. ${PW(i, a.logMessageContent)}.`);
	let l = IW(i) ? "arraybuffer" : "text", u = await n.post(r, {
		content: i,
		headers: {
			...o,
			...a.headers
		},
		responseType: l,
		timeout: a.timeout,
		withCredentials: a.withCredentials
	});
	e.log(K.Trace, `(${t} transport) request complete. Response status: ${u.statusCode}.`);
}
function RW(e) {
	return e === void 0 ? new BW(K.Information) : e === null ? MW.instance : e.log === void 0 ? new BW(e) : e;
}
var zW = class {
	constructor(e, t) {
		this._subject = e, this._observer = t;
	}
	dispose() {
		let e = this._subject.observers.indexOf(this._observer);
		e > -1 && this._subject.observers.splice(e, 1), this._subject.observers.length === 0 && this._subject.cancelCallback && this._subject.cancelCallback().catch((e) => {});
	}
}, BW = class {
	constructor(e) {
		this._minLevel = e, this.out = console;
	}
	log(e, t) {
		if (e >= this._minLevel) {
			let n = `[${(/* @__PURE__ */ new Date()).toISOString()}] ${K[e]}: ${t}`;
			switch (e) {
				case K.Critical:
				case K.Error:
					this.out.error(n);
					break;
				case K.Warning:
					this.out.warn(n);
					break;
				case K.Information:
					this.out.info(n);
					break;
				default: this.out.log(n);
			}
		}
	}
};
function VW() {
	let e = "X-SignalR-User-Agent";
	return J.isNode && (e = "User-Agent"), [e, HW(NW, UW(), GW(), WW())];
}
function HW(e, t, n, r) {
	let i = "Microsoft SignalR/", a = e.split(".");
	return i += `${a[0]}.${a[1]}`, i += ` (${e}; `, i += t && t !== "" ? `${t}; ` : "Unknown OS; ", i += `${n}`, i += r ? `; ${r}` : "; Unknown Runtime Version", i += ")", i;
}
/*#__PURE__*/ function UW() {
	if (J.isNode) switch (process.platform) {
		case "win32": return "Windows NT";
		case "darwin": return "macOS";
		case "linux": return "Linux";
		default: return process.platform;
	}
	else return "";
}
/*#__PURE__*/ function WW() {
	if (J.isNode) return process.versions.node;
}
function GW() {
	return J.isNode ? "NodeJS" : "Browser";
}
function KW(e) {
	return e.stack ? e.stack : e.message ? e.message : `${e}`;
}
function qW() {
	if (typeof globalThis < "u") return globalThis;
	if (typeof self < "u") return self;
	if (typeof window < "u") return window;
	if (typeof global < "u") return global;
	throw Error("could not find global");
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js
var JW = class extends jW {
	constructor(t) {
		if (super(), this._logger = t, typeof fetch > "u" || J.isNode) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._jar = new (t("tough-cookie")).CookieJar(), this._fetchType = typeof fetch > "u" ? t("node-fetch") : fetch, this._fetchType = t("fetch-cookie")(this._fetchType, this._jar);
		} else this._fetchType = fetch.bind(qW());
		if (typeof AbortController > "u") {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._abortControllerType = t("abort-controller");
		} else this._abortControllerType = AbortController;
	}
	async send(e) {
		if (e.abortSignal && e.abortSignal.aborted) throw new wW();
		if (!e.method) throw Error("No method defined.");
		if (!e.url) throw Error("No url defined.");
		let t = new this._abortControllerType(), n;
		e.abortSignal && (e.abortSignal.onabort = () => {
			t.abort(), n = new wW();
		});
		let r = null;
		if (e.timeout) {
			let i = e.timeout;
			r = setTimeout(() => {
				t.abort(), this._logger.log(K.Warning, "Timeout from HTTP request."), n = new CW();
			}, i);
		}
		e.content === "" && (e.content = void 0), e.content && (e.headers = e.headers || {}, IW(e.content) ? e.headers["Content-Type"] = "application/octet-stream" : e.headers["Content-Type"] = "text/plain;charset=UTF-8");
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
			throw n || (this._logger.log(K.Warning, `Error from HTTP request. ${e}.`), e);
		} finally {
			r && clearTimeout(r), e.abortSignal && (e.abortSignal.onabort = null);
		}
		if (!i.ok) throw new SW(await YW(i, "text") || i.statusText, i.status);
		let a = await YW(i, e.responseType);
		return new AW(i.status, i.statusText, a);
	}
	getCookieString(e) {
		let t = "";
		return J.isNode && this._jar && this._jar.getCookies(e, (e, n) => t = n.join("; ")), t;
	}
};
function YW(e, t) {
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
var XW = class extends jW {
	constructor(e) {
		super(), this._logger = e;
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new wW()) : e.method ? e.url ? new Promise((t, n) => {
			let r = new XMLHttpRequest();
			r.open(e.method, e.url, !0), r.withCredentials = e.withCredentials === void 0 || e.withCredentials, r.setRequestHeader("X-Requested-With", "XMLHttpRequest"), e.content === "" && (e.content = void 0), e.content && (IW(e.content) ? r.setRequestHeader("Content-Type", "application/octet-stream") : r.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"));
			let i = e.headers;
			i && Object.keys(i).forEach((e) => {
				r.setRequestHeader(e, i[e]);
			}), e.responseType && (r.responseType = e.responseType), e.abortSignal && (e.abortSignal.onabort = () => {
				r.abort(), n(new wW());
			}), e.timeout && (r.timeout = e.timeout), r.onload = () => {
				e.abortSignal && (e.abortSignal.onabort = null), r.status >= 200 && r.status < 300 ? t(new AW(r.status, r.statusText, r.response || r.responseText)) : n(new SW(r.response || r.responseText || r.statusText, r.status));
			}, r.onerror = () => {
				this._logger.log(K.Warning, `Error from HTTP request. ${r.status}: ${r.statusText}.`), n(new SW(r.statusText, r.status));
			}, r.ontimeout = () => {
				this._logger.log(K.Warning, "Timeout from HTTP request."), n(new CW());
			}, r.send(e.content);
		}) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
}, ZW = class extends jW {
	constructor(e) {
		if (super(), typeof fetch < "u" || J.isNode) this._httpClient = new JW(e);
		else if (typeof XMLHttpRequest < "u") this._httpClient = new XW(e);
		else throw Error("No usable HttpClient found.");
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new wW()) : e.method ? e.url ? this._httpClient.send(e) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
	getCookieString(e) {
		return this._httpClient.getCookieString(e);
	}
}, QW = class e {
	static write(t) {
		return `${t}${e.RecordSeparator}`;
	}
	static parse(t) {
		if (t[t.length - 1] !== e.RecordSeparator) throw Error("Message is incomplete.");
		let n = t.split(e.RecordSeparator);
		return n.pop(), n;
	}
};
QW.RecordSeparatorCode = 30, QW.RecordSeparator = String.fromCharCode(QW.RecordSeparatorCode);
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js
var $W = class {
	writeHandshakeRequest(e) {
		return QW.write(JSON.stringify(e));
	}
	parseHandshakeResponse(e) {
		let t, n;
		if (IW(e)) {
			let r = new Uint8Array(e), i = r.indexOf(QW.RecordSeparatorCode);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = String.fromCharCode.apply(null, Array.prototype.slice.call(r.slice(0, a))), n = r.byteLength > a ? r.slice(a).buffer : null;
		} else {
			let r = e, i = r.indexOf(QW.RecordSeparator);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = r.substring(0, a), n = r.length > a ? r.substring(a) : null;
		}
		let r = QW.parse(t), i = JSON.parse(r[0]);
		if (i.type) throw Error("Expected a handshake response from the server.");
		return [n, i];
	}
}, Y;
(function(e) {
	e[e.Invocation = 1] = "Invocation", e[e.StreamItem = 2] = "StreamItem", e[e.Completion = 3] = "Completion", e[e.StreamInvocation = 4] = "StreamInvocation", e[e.CancelInvocation = 5] = "CancelInvocation", e[e.Ping = 6] = "Ping", e[e.Close = 7] = "Close", e[e.Ack = 8] = "Ack", e[e.Sequence = 9] = "Sequence";
})(Y ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Subject.js
var eG = class {
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
		return this.observers.push(e), new zW(this, e);
	}
}, tG = class {
	constructor(e, t, n) {
		this._bufferSize = 1e5, this._messages = [], this._totalMessageCount = 0, this._waitForSequenceMessage = !1, this._nextReceivingSequenceId = 1, this._latestReceivedSequenceId = 0, this._bufferedByteCount = 0, this._reconnectInProgress = !1, this._protocol = e, this._connection = t, this._bufferSize = n;
	}
	async _send(e) {
		let t = this._protocol.writeMessage(e), n = Promise.resolve();
		if (this._isInvocationMessage(e)) {
			this._totalMessageCount++;
			let e = () => {}, r = () => {};
			IW(t) ? this._bufferedByteCount += t.byteLength : this._bufferedByteCount += t.length, this._bufferedByteCount >= this._bufferSize && (n = new Promise((t, n) => {
				e = t, r = n;
			})), this._messages.push(new nG(t, this._totalMessageCount, e, r));
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
			if (r._id <= e.sequenceId) t = n, IW(r._message) ? this._bufferedByteCount -= r._message.byteLength : this._bufferedByteCount -= r._message.length, r._resolver();
			else if (this._bufferedByteCount < this._bufferSize) r._resolver();
			else break;
		}
		t !== -1 && (this._messages = this._messages.slice(t + 1));
	}
	_shouldProcessMessage(e) {
		if (this._waitForSequenceMessage) return e.type === Y.Sequence && (this._waitForSequenceMessage = !1, !0);
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
			type: Y.Sequence,
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
			case Y.Invocation:
			case Y.StreamItem:
			case Y.Completion:
			case Y.StreamInvocation:
			case Y.CancelInvocation: return !0;
			case Y.Close:
			case Y.Sequence:
			case Y.Ping:
			case Y.Ack: return !1;
		}
	}
	_ackTimer() {
		this._ackTimerHandle === void 0 && (this._ackTimerHandle = setTimeout(async () => {
			try {
				this._reconnectInProgress || await this._connection.send(this._protocol.writeMessage({
					type: Y.Ack,
					sequenceId: this._latestReceivedSequenceId
				}));
			} catch {}
			clearTimeout(this._ackTimerHandle), this._ackTimerHandle = void 0;
		}, 1e3));
	}
}, nG = class {
	constructor(e, t, n, r) {
		this._message = e, this._id = t, this._resolver = n, this._rejector = r;
	}
}, rG = 3e4, iG = 15e3, aG = 1e5, X;
(function(e) {
	e.Disconnected = "Disconnected", e.Connecting = "Connecting", e.Connected = "Connected", e.Disconnecting = "Disconnecting", e.Reconnecting = "Reconnecting";
})(X ||= {});
var oG = class e {
	static create(t, n, r, i, a, o, s) {
		return new e(t, n, r, i, a, o, s);
	}
	constructor(e, t, n, r, i, a, o) {
		this._nextKeepAlive = 0, this._freezeEventListener = () => {
			this._logger.log(K.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
		}, q.isRequired(e, "connection"), q.isRequired(t, "logger"), q.isRequired(n, "protocol"), this.serverTimeoutInMilliseconds = i ?? rG, this.keepAliveIntervalInMilliseconds = a ?? iG, this._statefulReconnectBufferSize = o ?? aG, this._logger = t, this._protocol = n, this.connection = e, this._reconnectPolicy = r, this._handshakeProtocol = new $W(), this.connection.onreceive = (e) => this._processIncomingData(e), this.connection.onclose = (e) => this._connectionClosed(e), this._callbacks = {}, this._methods = {}, this._closedCallbacks = [], this._reconnectingCallbacks = [], this._reconnectedCallbacks = [], this._invocationId = 0, this._receivedHandshakeResponse = !1, this._connectionState = X.Disconnected, this._connectionStarted = !1, this._cachedPingMessage = this._protocol.writeMessage({ type: Y.Ping });
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
		if (this._connectionState !== X.Disconnected && this._connectionState !== X.Reconnecting) throw Error("The HubConnection must be in the Disconnected or Reconnecting state to change the url.");
		if (!e) throw Error("The HubConnection url must be a valid url.");
		this.connection.baseUrl = e;
	}
	start() {
		return this._startPromise = this._startWithStateTransitions(), this._startPromise;
	}
	async _startWithStateTransitions() {
		if (this._connectionState !== X.Disconnected) return Promise.reject(/* @__PURE__ */ Error("Cannot start a HubConnection that is not in the 'Disconnected' state."));
		this._connectionState = X.Connecting, this._logger.log(K.Debug, "Starting HubConnection.");
		try {
			await this._startInternal(), J.isBrowser && window.document.addEventListener("freeze", this._freezeEventListener), this._connectionState = X.Connected, this._connectionStarted = !0, this._logger.log(K.Debug, "HubConnection connected successfully.");
		} catch (e) {
			return this._connectionState = X.Disconnected, this._logger.log(K.Debug, `HubConnection failed to start successfully because of error '${e}'.`), Promise.reject(e);
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
			if (this._logger.log(K.Debug, "Sending handshake request."), await this._sendMessage(this._handshakeProtocol.writeHandshakeRequest(n)), this._logger.log(K.Information, `Using HubProtocol '${this._protocol.name}'.`), this._cleanupTimeout(), this._resetTimeoutPeriod(), this._resetKeepAliveInterval(), await e, this._stopDuringStartError) throw this._stopDuringStartError;
			this.connection.features.reconnect && (this._messageBuffer = new tG(this._protocol, this.connection, this._statefulReconnectBufferSize), this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer), this.connection.features.resend = () => {
				if (this._messageBuffer) return this._messageBuffer._resend();
			}), this.connection.features.inherentKeepAlive || await this._sendMessage(this._cachedPingMessage);
		} catch (e) {
			throw this._logger.log(K.Debug, `Hub handshake failed with error '${e}' during start(). Stopping HubConnection.`), this._cleanupTimeout(), this._cleanupPingTimer(), await this.connection.stop(e), e;
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
		if (this._connectionState === X.Disconnected) return this._logger.log(K.Debug, `Call to HubConnection.stop(${e}) ignored because it is already in the disconnected state.`), Promise.resolve();
		if (this._connectionState === X.Disconnecting) return this._logger.log(K.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnecting state.`), this._stopPromise;
		let t = this._connectionState;
		return this._connectionState = X.Disconnecting, this._logger.log(K.Debug, "Stopping HubConnection."), this._reconnectDelayHandle ? (this._logger.log(K.Debug, "Connection stopped during reconnect delay. Done reconnecting."), clearTimeout(this._reconnectDelayHandle), this._reconnectDelayHandle = void 0, this._completeClose(), Promise.resolve()) : (t === X.Connected && this._sendCloseMessage(), this._cleanupTimeout(), this._cleanupPingTimer(), this._stopDuringStartError = e || new wW("The connection was stopped before the hub handshake could complete."), this.connection.stop(e));
	}
	async _sendCloseMessage() {
		try {
			await this._sendWithProtocol(this._createCloseMessage());
		} catch {}
	}
	stream(e, ...t) {
		let [n, r] = this._replaceStreamingParams(t), i = this._createStreamInvocation(e, t, r), a, o = new eG();
		return o.cancelCallback = () => {
			let e = this._createCancelInvocation(i.invocationId);
			return delete this._callbacks[i.invocationId], a.then(() => this._sendWithProtocol(e));
		}, this._callbacks[i.invocationId] = (e, t) => {
			if (t) {
				o.error(t);
				return;
			}
			e && (e.type === Y.Completion ? e.error ? o.error(Error(e.error)) : o.complete() : o.next(e.item));
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
				n && (n.type === Y.Completion ? n.error ? t(Error(n.error)) : e(n.result) : t(/* @__PURE__ */ Error(`Unexpected message type: ${n.type}`)));
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
				case Y.Invocation:
					this._invokeClientMethod(e).catch((e) => {
						this._logger.log(K.Error, `Invoke client method threw error: ${KW(e)}`);
					});
					break;
				case Y.StreamItem:
				case Y.Completion: {
					let t = this._callbacks[e.invocationId];
					if (t) {
						e.type === Y.Completion && delete this._callbacks[e.invocationId];
						try {
							t(e);
						} catch (e) {
							this._logger.log(K.Error, `Stream callback threw error: ${KW(e)}`);
						}
					}
					break;
				}
				case Y.Ping: break;
				case Y.Close: {
					this._logger.log(K.Information, "Close message received from server.");
					let t = e.error ? /* @__PURE__ */ Error("Server returned an error on close: " + e.error) : void 0;
					e.allowReconnect === !0 ? this.connection.stop(t) : this._stopPromise = this._stopInternal(t);
					break;
				}
				case Y.Ack:
					this._messageBuffer && this._messageBuffer._ack(e);
					break;
				case Y.Sequence:
					this._messageBuffer && this._messageBuffer._resetSequence(e);
					break;
				default: this._logger.log(K.Warning, `Invalid message type: ${e.type}.`);
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
			this._logger.log(K.Error, t);
			let n = Error(t);
			throw this._handshakeRejecter(n), n;
		}
		if (t.error) {
			let e = "Server returned handshake error: " + t.error;
			this._logger.log(K.Error, e);
			let n = Error(e);
			throw this._handshakeRejecter(n), n;
		}
		return this._logger.log(K.Debug, "Server handshake complete."), this._handshakeResolver(), n;
	}
	_resetKeepAliveInterval() {
		this.connection.features.inherentKeepAlive || (this._nextKeepAlive = (/* @__PURE__ */ new Date()).getTime() + this.keepAliveIntervalInMilliseconds, this._cleanupPingTimer());
	}
	_resetTimeoutPeriod() {
		if (!this.connection.features || !this.connection.features.inherentKeepAlive) {
			this._timeoutHandle = setTimeout(() => this.serverTimeout(), this.serverTimeoutInMilliseconds);
			let e = this._nextKeepAlive - (/* @__PURE__ */ new Date()).getTime();
			if (e < 0) {
				this._connectionState === X.Connected && this._trySendPingMessage();
				return;
			}
			this._pingServerHandle === void 0 && (e < 0 && (e = 0), this._pingServerHandle = setTimeout(async () => {
				this._connectionState === X.Connected && await this._trySendPingMessage();
			}, e));
		}
	}
	serverTimeout() {
		this.connection.stop(/* @__PURE__ */ Error("Server timeout elapsed without receiving a message from the server."));
	}
	async _invokeClientMethod(e) {
		let t = e.target.toLowerCase(), n = this._methods[t];
		if (!n) {
			this._logger.log(K.Warning, `No client method with the name '${t}' found.`), e.invocationId && (this._logger.log(K.Warning, `No result given for '${t}' method and invocation ID '${e.invocationId}'.`), await this._sendWithProtocol(this._createCompletionMessage(e.invocationId, "Client didn't provide a result.", null)));
			return;
		}
		let r = n.slice(), i = !!e.invocationId, a, o, s;
		for (let n of r) try {
			let r = a;
			a = await n.apply(this, e.arguments), i && a && r && (this._logger.log(K.Error, `Multiple results provided for '${t}'. Sending error to server.`), s = this._createCompletionMessage(e.invocationId, "Client provided multiple results.", null)), o = void 0;
		} catch (e) {
			o = e, this._logger.log(K.Error, `A callback for the method '${t}' threw error '${e}'.`);
		}
		s ? await this._sendWithProtocol(s) : i ? (o ? s = this._createCompletionMessage(e.invocationId, `${o}`, null) : a === void 0 ? (this._logger.log(K.Warning, `No result given for '${t}' method and invocation ID '${e.invocationId}'.`), s = this._createCompletionMessage(e.invocationId, "Client didn't provide a result.", null)) : s = this._createCompletionMessage(e.invocationId, null, a), await this._sendWithProtocol(s)) : a && this._logger.log(K.Error, `Result given for '${t}' method but server is not expecting a result.`);
	}
	_connectionClosed(e) {
		this._logger.log(K.Debug, `HubConnection.connectionClosed(${e}) called while in state ${this._connectionState}.`), this._stopDuringStartError = this._stopDuringStartError || e || new wW("The underlying connection was closed before the hub handshake could complete."), this._handshakeResolver && this._handshakeResolver(), this._cancelCallbacksWithError(e || /* @__PURE__ */ Error("Invocation canceled due to the underlying connection being closed.")), this._cleanupTimeout(), this._cleanupPingTimer(), this._connectionState === X.Disconnecting ? this._completeClose(e) : this._connectionState === X.Connected && this._reconnectPolicy ? this._reconnect(e) : this._connectionState === X.Connected && this._completeClose(e);
	}
	_completeClose(e) {
		if (this._connectionStarted) {
			this._connectionState = X.Disconnected, this._connectionStarted = !1, this._messageBuffer &&= (this._messageBuffer._dispose(e ?? /* @__PURE__ */ Error("Connection closed.")), void 0), J.isBrowser && window.document.removeEventListener("freeze", this._freezeEventListener);
			try {
				this._closedCallbacks.forEach((t) => t.apply(this, [e]));
			} catch (t) {
				this._logger.log(K.Error, `An onclose callback called with error '${e}' threw error '${t}'.`);
			}
		}
	}
	async _reconnect(e) {
		let t = Date.now(), n = 0, r = e === void 0 ? /* @__PURE__ */ Error("Attempting to reconnect due to a unknown error.") : e, i = this._getNextRetryDelay(n, 0, r);
		if (i === null) {
			this._logger.log(K.Debug, "Connection not reconnecting because the IRetryPolicy returned null on the first reconnect attempt."), this._completeClose(e);
			return;
		}
		if (this._connectionState = X.Reconnecting, e ? this._logger.log(K.Information, `Connection reconnecting because of error '${e}'.`) : this._logger.log(K.Information, "Connection reconnecting."), this._reconnectingCallbacks.length !== 0) {
			try {
				this._reconnectingCallbacks.forEach((t) => t.apply(this, [e]));
			} catch (t) {
				this._logger.log(K.Error, `An onreconnecting callback called with error '${e}' threw error '${t}'.`);
			}
			if (this._connectionState !== X.Reconnecting) {
				this._logger.log(K.Debug, "Connection left the reconnecting state in onreconnecting callback. Done reconnecting.");
				return;
			}
		}
		for (; i !== null;) {
			if (this._logger.log(K.Information, `Reconnect attempt number ${n + 1} will start in ${i} ms.`), await new Promise((e) => {
				this._reconnectDelayHandle = setTimeout(e, i);
			}), this._reconnectDelayHandle = void 0, this._connectionState !== X.Reconnecting) {
				this._logger.log(K.Debug, "Connection left the reconnecting state during reconnect delay. Done reconnecting.");
				return;
			}
			try {
				if (await this._startInternal(), this._connectionState = X.Connected, this._logger.log(K.Information, "HubConnection reconnected successfully."), this._reconnectedCallbacks.length !== 0) try {
					this._reconnectedCallbacks.forEach((e) => e.apply(this, [this.connection.connectionId]));
				} catch (e) {
					this._logger.log(K.Error, `An onreconnected callback called with connectionId '${this.connection.connectionId}; threw error '${e}'.`);
				}
				return;
			} catch (e) {
				if (this._logger.log(K.Information, `Reconnect attempt failed because of error '${e}'.`), this._connectionState !== X.Reconnecting) {
					this._logger.log(K.Debug, `Connection moved to the '${this._connectionState}' from the reconnecting state during reconnect attempt. Done reconnecting.`), this._connectionState === X.Disconnecting && this._completeClose();
					return;
				}
				n++, r = e instanceof Error ? e : Error(e.toString()), i = this._getNextRetryDelay(n, Date.now() - t, r);
			}
		}
		this._logger.log(K.Information, `Reconnect retries have been exhausted after ${Date.now() - t} ms and ${n} failed attempts. Connection disconnecting.`), this._completeClose();
	}
	_getNextRetryDelay(e, t, n) {
		try {
			return this._reconnectPolicy.nextRetryDelayInMilliseconds({
				elapsedMilliseconds: t,
				previousRetryCount: e,
				retryReason: n
			});
		} catch (n) {
			return this._logger.log(K.Error, `IRetryPolicy.nextRetryDelayInMilliseconds(${e}, ${t}) threw error '${n}'.`), null;
		}
	}
	_cancelCallbacksWithError(e) {
		let t = this._callbacks;
		this._callbacks = {}, Object.keys(t).forEach((n) => {
			let r = t[n];
			try {
				r(null, e);
			} catch (t) {
				this._logger.log(K.Error, `Stream 'error' callback called with '${e}' threw error: ${KW(t)}`);
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
			type: Y.Invocation
		} : {
			target: e,
			arguments: t,
			streamIds: r,
			type: Y.Invocation
		};
		{
			let n = this._invocationId;
			return this._invocationId++, r.length === 0 ? {
				target: e,
				arguments: t,
				invocationId: n.toString(),
				type: Y.Invocation
			} : {
				target: e,
				arguments: t,
				invocationId: n.toString(),
				streamIds: r,
				type: Y.Invocation
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
			type: Y.StreamInvocation
		} : {
			target: e,
			arguments: t,
			invocationId: r.toString(),
			streamIds: n,
			type: Y.StreamInvocation
		};
	}
	_createCancelInvocation(e) {
		return {
			invocationId: e,
			type: Y.CancelInvocation
		};
	}
	_createStreamItemMessage(e, t) {
		return {
			invocationId: e,
			item: t,
			type: Y.StreamItem
		};
	}
	_createCompletionMessage(e, t, n) {
		return t ? {
			error: t,
			invocationId: e,
			type: Y.Completion
		} : {
			invocationId: e,
			result: n,
			type: Y.Completion
		};
	}
	_createCloseMessage() {
		return { type: Y.Close };
	}
	async _trySendPingMessage() {
		try {
			await this._sendMessage(this._cachedPingMessage);
		} catch {
			this._cleanupPingTimer();
		}
	}
}, sG = [
	0,
	2e3,
	1e4,
	3e4,
	null
], cG = class {
	constructor(e) {
		this._retryDelays = e === void 0 ? sG : [...e, null];
	}
	nextRetryDelayInMilliseconds(e) {
		return this._retryDelays[e.previousRetryCount];
	}
}, lG = class {};
lG.Authorization = "Authorization", lG.Cookie = "Cookie";
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js
var uG = class extends jW {
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
		e.headers ||= {}, this._accessToken ? e.headers[lG.Authorization] = `Bearer ${this._accessToken}` : this._accessTokenFactory && e.headers[lG.Authorization] && delete e.headers[lG.Authorization];
	}
	getCookieString(e) {
		return this._innerClient.getCookieString(e);
	}
}, Z;
(function(e) {
	e[e.None = 0] = "None", e[e.WebSockets = 1] = "WebSockets", e[e.ServerSentEvents = 2] = "ServerSentEvents", e[e.LongPolling = 4] = "LongPolling";
})(Z ||= {});
var dG;
(function(e) {
	e[e.Text = 1] = "Text", e[e.Binary = 2] = "Binary";
})(dG ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AbortController.js
var fG = class {
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
}, pG = class {
	get pollAborted() {
		return this._pollAbort.aborted;
	}
	constructor(e, t, n) {
		this._httpClient = e, this._logger = t, this._pollAbort = new fG(), this._options = n, this._running = !1, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		if (q.isRequired(e, "url"), q.isRequired(t, "transferFormat"), q.isIn(t, dG, "transferFormat"), this._url = e, this._logger.log(K.Trace, "(LongPolling transport) Connecting."), t === dG.Binary && typeof XMLHttpRequest < "u" && typeof new XMLHttpRequest().responseType != "string") throw Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
		let [n, r] = VW(), i = {
			[n]: r,
			...this._options.headers
		}, a = {
			abortSignal: this._pollAbort.signal,
			headers: i,
			timeout: 1e5,
			withCredentials: this._options.withCredentials
		};
		t === dG.Binary && (a.responseType = "arraybuffer");
		let o = `${e}&_=${Date.now()}`;
		this._logger.log(K.Trace, `(LongPolling transport) polling: ${o}.`);
		let s = await this._httpClient.get(o, a);
		s.statusCode === 200 ? this._running = !0 : (this._logger.log(K.Error, `(LongPolling transport) Unexpected response code: ${s.statusCode}.`), this._closeError = new SW(s.statusText || "", s.statusCode), this._running = !1), this._receiving = this._poll(this._url, a);
	}
	async _poll(e, t) {
		try {
			for (; this._running;) try {
				let n = `${e}&_=${Date.now()}`;
				this._logger.log(K.Trace, `(LongPolling transport) polling: ${n}.`);
				let r = await this._httpClient.get(n, t);
				r.statusCode === 204 ? (this._logger.log(K.Information, "(LongPolling transport) Poll terminated by server."), this._running = !1) : r.statusCode === 200 ? r.content ? (this._logger.log(K.Trace, `(LongPolling transport) data received. ${PW(r.content, this._options.logMessageContent)}.`), this.onreceive && this.onreceive(r.content)) : this._logger.log(K.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._logger.log(K.Error, `(LongPolling transport) Unexpected response code: ${r.statusCode}.`), this._closeError = new SW(r.statusText || "", r.statusCode), this._running = !1);
			} catch (e) {
				this._running ? e instanceof CW ? this._logger.log(K.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._closeError = e, this._running = !1) : this._logger.log(K.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
			}
		} finally {
			this._logger.log(K.Trace, "(LongPolling transport) Polling complete."), this.pollAborted || this._raiseOnClose();
		}
	}
	async send(e) {
		return this._running ? LW(this._logger, "LongPolling", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	async stop() {
		this._logger.log(K.Trace, "(LongPolling transport) Stopping polling."), this._running = !1, this._pollAbort.abort();
		try {
			await this._receiving, this._logger.log(K.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
			let e = {}, [t, n] = VW();
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
			i ? i instanceof SW && (i.statusCode === 404 ? this._logger.log(K.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.") : this._logger.log(K.Trace, `(LongPolling transport) Error sending a DELETE request: ${i}`)) : this._logger.log(K.Trace, "(LongPolling transport) DELETE request accepted.");
		} finally {
			this._logger.log(K.Trace, "(LongPolling transport) Stop finished."), this._raiseOnClose();
		}
	}
	_raiseOnClose() {
		if (this.onclose) {
			let e = "(LongPolling transport) Firing onclose event.";
			this._closeError && (e += " Error: " + this._closeError), this._logger.log(K.Trace, e), this.onclose(this._closeError);
		}
	}
}, mG = class {
	constructor(e, t, n, r) {
		this._httpClient = e, this._accessToken = t, this._logger = n, this._options = r, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		return q.isRequired(e, "url"), q.isRequired(t, "transferFormat"), q.isIn(t, dG, "transferFormat"), this._logger.log(K.Trace, "(SSE transport) Connecting."), this._url = e, this._accessToken && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(this._accessToken)}`), new Promise((n, r) => {
			let i = !1;
			if (t !== dG.Text) {
				r(/* @__PURE__ */ Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
				return;
			}
			let a;
			if (J.isBrowser || J.isWebWorker) a = new this._options.EventSource(e, { withCredentials: this._options.withCredentials });
			else {
				let t = this._httpClient.getCookieString(e), n = {};
				n.Cookie = t;
				let [r, i] = VW();
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
						this._logger.log(K.Trace, `(SSE transport) data received. ${PW(e.data, this._options.logMessageContent)}.`), this.onreceive(e.data);
					} catch (e) {
						this._close(e);
						return;
					}
				}, a.onerror = (e) => {
					i ? this._close() : r(/* @__PURE__ */ Error("EventSource failed to connect. The connection could not be found on the server, either the connection ID is not present on the server, or a proxy is refusing/buffering the connection. If you have multiple servers check that sticky sessions are enabled."));
				}, a.onopen = () => {
					this._logger.log(K.Information, `SSE connected to ${this._url}`), this._eventSource = a, i = !0, n();
				};
			} catch (e) {
				r(e);
				return;
			}
		});
	}
	async send(e) {
		return this._eventSource ? LW(this._logger, "SSE", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	stop() {
		return this._close(), Promise.resolve();
	}
	_close(e) {
		this._eventSource && (this._eventSource.close(), this._eventSource = void 0, this.onclose && this.onclose(e));
	}
}, hG = class {
	constructor(e, t, n, r, i, a) {
		this._logger = n, this._accessTokenFactory = t, this._logMessageContent = r, this._webSocketConstructor = i, this._httpClient = e, this.onreceive = null, this.onclose = null, this._headers = a;
	}
	async connect(e, t) {
		q.isRequired(e, "url"), q.isRequired(t, "transferFormat"), q.isIn(t, dG, "transferFormat"), this._logger.log(K.Trace, "(WebSockets transport) Connecting.");
		let n;
		return this._accessTokenFactory && (n = await this._accessTokenFactory()), new Promise((r, i) => {
			e = e.replace(/^http/, "ws");
			let a, o = this._httpClient.getCookieString(e), s = !1;
			if (J.isNode || J.isReactNative) {
				let t = {}, [r, i] = VW();
				t[r] = i, n && (t[lG.Authorization] = `Bearer ${n}`), o && (t[lG.Cookie] = o), a = new this._webSocketConstructor(e, void 0, { headers: {
					...t,
					...this._headers
				} });
			} else n && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(n)}`);
			a ||= new this._webSocketConstructor(e), t === dG.Binary && (a.binaryType = "arraybuffer"), a.onopen = (t) => {
				this._logger.log(K.Information, `WebSocket connected to ${e}.`), this._webSocket = a, s = !0, r();
			}, a.onerror = (e) => {
				let t = null;
				t = typeof ErrorEvent < "u" && e instanceof ErrorEvent ? e.error : "There was an error with the transport", this._logger.log(K.Information, `(WebSockets transport) ${t}.`);
			}, a.onmessage = (e) => {
				if (this._logger.log(K.Trace, `(WebSockets transport) data received. ${PW(e.data, this._logMessageContent)}.`), this.onreceive) try {
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
		return this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN ? (this._logger.log(K.Trace, `(WebSockets transport) sending data. ${PW(e, this._logMessageContent)}.`), this._webSocket.send(e), Promise.resolve()) : Promise.reject("WebSocket is not in the OPEN state");
	}
	stop() {
		return this._webSocket && this._close(void 0), Promise.resolve();
	}
	_close(e) {
		this._webSocket &&= (this._webSocket.onclose = () => {}, this._webSocket.onmessage = () => {}, this._webSocket.onerror = () => {}, this._webSocket.close(), void 0), this._logger.log(K.Trace, "(WebSockets transport) socket closed."), this.onclose && (this._isCloseEvent(e) && (e.wasClean === !1 || e.code !== 1e3) ? this.onclose(/* @__PURE__ */ Error(`WebSocket closed with status code: ${e.code} (${e.reason || "no reason given"}).`)) : e instanceof Error ? this.onclose(e) : this.onclose());
	}
	_isCloseEvent(e) {
		return e && typeof e.wasClean == "boolean" && typeof e.code == "number";
	}
}, gG = 100, _G = class {
	constructor(t, n = {}) {
		if (this._stopPromiseResolver = () => {}, this.features = {}, this._negotiateVersion = 1, q.isRequired(t, "url"), this._logger = RW(n.logger), this.baseUrl = this._resolveUrl(t), n ||= {}, n.logMessageContent = n.logMessageContent !== void 0 && n.logMessageContent, typeof n.withCredentials == "boolean" || n.withCredentials === void 0) n.withCredentials = n.withCredentials === void 0 || n.withCredentials;
		else throw Error("withCredentials option was not a 'boolean' or 'undefined' value");
		n.timeout = n.timeout === void 0 ? 1e5 : n.timeout;
		let r = null, i = null;
		if (J.isNode && e !== void 0) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			r = t("ws"), i = t("eventsource");
		}
		!J.isNode && typeof WebSocket < "u" && !n.WebSocket ? n.WebSocket = WebSocket : J.isNode && !n.WebSocket && r && (n.WebSocket = r), !J.isNode && typeof EventSource < "u" && !n.EventSource ? n.EventSource = EventSource : J.isNode && !n.EventSource && i !== void 0 && (n.EventSource = i), this._httpClient = new uG(n.httpClient || new ZW(this._logger), n.accessTokenFactory), this._connectionState = "Disconnected", this._connectionStarted = !1, this._options = n, this.onreceive = null, this.onclose = null;
	}
	async start(e) {
		if (e ||= dG.Binary, q.isIn(e, dG, "transferFormat"), this._logger.log(K.Debug, `Starting connection with transfer format '${dG[e]}'.`), this._connectionState !== "Disconnected") return Promise.reject(/* @__PURE__ */ Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
		if (this._connectionState = "Connecting", this._startInternalPromise = this._startInternal(e), await this._startInternalPromise, this._connectionState === "Disconnecting") {
			let e = "Failed to start the HttpConnection before stop() was called.";
			return this._logger.log(K.Error, e), await this._stopPromise, Promise.reject(new wW(e));
		}
		if (this._connectionState !== "Connected") {
			let e = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
			return this._logger.log(K.Error, e), Promise.reject(new wW(e));
		}
		this._connectionStarted = !0;
	}
	send(e) {
		return this._connectionState === "Connected" ? (this._sendQueue ||= new yG(this.transport), this._sendQueue.send(e)) : Promise.reject(/* @__PURE__ */ Error("Cannot send data if the connection is not in the 'Connected' State."));
	}
	async stop(e) {
		if (this._connectionState === "Disconnected") return this._logger.log(K.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnected state.`), Promise.resolve();
		if (this._connectionState === "Disconnecting") return this._logger.log(K.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnecting state.`), this._stopPromise;
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
				this._logger.log(K.Error, `HttpConnection.transport.stop() threw error '${e}'.`), this._stopConnection();
			}
			this.transport = void 0;
		} else this._logger.log(K.Debug, "HttpConnection.transport is undefined in HttpConnection.stop() because start() failed.");
	}
	async _startInternal(e) {
		let t = this.baseUrl;
		this._accessTokenFactory = this._options.accessTokenFactory, this._httpClient._accessTokenFactory = this._accessTokenFactory;
		try {
			if (this._options.skipNegotiation) {
				if (this._options.transport === Z.WebSockets) this.transport = this._constructTransport(Z.WebSockets), await this._startTransport(t, e);
				else throw Error("Negotiation can only be skipped when using the WebSocket transport directly.");
			} else {
				let n = null, r = 0;
				do {
					if (n = await this._getNegotiationResponse(t), this._connectionState === "Disconnecting" || this._connectionState === "Disconnected") throw new wW("The connection was stopped during negotiation.");
					if (n.error) throw Error(n.error);
					if (n.ProtocolVersion) throw Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
					if (n.url && (t = n.url), n.accessToken) {
						let e = n.accessToken;
						this._accessTokenFactory = () => e, this._httpClient._accessToken = e, this._httpClient._accessTokenFactory = void 0;
					}
					r++;
				} while (n.url && r < gG);
				if (r === gG && n.url) throw Error("Negotiate redirection limit exceeded.");
				await this._createTransport(t, this._options.transport, n, e);
			}
			this.transport instanceof pG && (this.features.inherentKeepAlive = !0), this._connectionState === "Connecting" && (this._logger.log(K.Debug, "The HttpConnection connected successfully."), this._connectionState = "Connected");
		} catch (e) {
			return this._logger.log(K.Error, "Failed to start the connection: " + e), this._connectionState = "Disconnected", this.transport = void 0, this._stopPromiseResolver(), Promise.reject(e);
		}
	}
	async _getNegotiationResponse(e) {
		let t = {}, [n, r] = VW();
		t[n] = r;
		let i = this._resolveNegotiateUrl(e);
		this._logger.log(K.Debug, `Sending negotiation request: ${i}.`);
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
			return (!n.negotiateVersion || n.negotiateVersion < 1) && (n.connectionToken = n.connectionId), n.useStatefulReconnect && this._options._useStatefulReconnect !== !0 ? Promise.reject(new OW("Client didn't negotiate Stateful Reconnect but the server did.")) : n;
		} catch (e) {
			let t = "Failed to complete negotiation with the server: " + e;
			return e instanceof SW && e.statusCode === 404 && (t += " Either this is not a SignalR endpoint or there is a proxy blocking the connection."), this._logger.log(K.Error, t), Promise.reject(new OW(t));
		}
	}
	_createConnectUrl(e, t) {
		return t ? e + (e.indexOf("?") === -1 ? "?" : "&") + `id=${t}` : e;
	}
	async _createTransport(e, t, n, r) {
		let i = this._createConnectUrl(e, n.connectionToken);
		if (this._isITransport(t)) {
			this._logger.log(K.Debug, "Connection was provided an instance of ITransport, using that directly."), this.transport = t, await this._startTransport(i, r), this.connectionId = n.connectionId;
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
					if (this._logger.log(K.Error, `Failed to start the transport '${n.transport}': ${e}`), s = void 0, a.push(new DW(`${n.transport} failed: ${e}`, Z[n.transport])), this._connectionState !== "Connecting") {
						let e = "Failed to select transport before stop() was called.";
						return this._logger.log(K.Debug, e), Promise.reject(new wW(e));
					}
				}
			}
		}
		return a.length > 0 ? Promise.reject(new kW(`Unable to connect to the server with any of the available transports. ${a.join(" ")}`, a)) : Promise.reject(/* @__PURE__ */ Error("None of the transports supported by the client are supported by the server."));
	}
	_constructTransport(e) {
		switch (e) {
			case Z.WebSockets:
				if (!this._options.WebSocket) throw Error("'WebSocket' is not supported in your environment.");
				return new hG(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
			case Z.ServerSentEvents:
				if (!this._options.EventSource) throw Error("'EventSource' is not supported in your environment.");
				return new mG(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
			case Z.LongPolling: return new pG(this._httpClient, this._logger, this._options);
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
		let i = Z[e.transport];
		if (i == null) return this._logger.log(K.Debug, `Skipping transport '${e.transport}' because it is not supported by this client.`), /* @__PURE__ */ Error(`Skipping transport '${e.transport}' because it is not supported by this client.`);
		if (vG(t, i)) {
			if (e.transferFormats.map((e) => dG[e]).indexOf(n) >= 0) {
				if (i === Z.WebSockets && !this._options.WebSocket || i === Z.ServerSentEvents && !this._options.EventSource) return this._logger.log(K.Debug, `Skipping transport '${Z[i]}' because it is not supported in your environment.'`), new TW(`'${Z[i]}' is not supported in your environment.`, i);
				this._logger.log(K.Debug, `Selecting transport '${Z[i]}'.`);
				try {
					return this.features.reconnect = i === Z.WebSockets ? r : void 0, this._constructTransport(i);
				} catch (e) {
					return e;
				}
			}
			return this._logger.log(K.Debug, `Skipping transport '${Z[i]}' because it does not support the requested transfer format '${dG[n]}'.`), /* @__PURE__ */ Error(`'${Z[i]}' does not support ${dG[n]}.`);
		}
		return this._logger.log(K.Debug, `Skipping transport '${Z[i]}' because it was disabled by the client.`), new EW(`'${Z[i]}' is disabled by the client.`, i);
	}
	_isITransport(e) {
		return e && typeof e == "object" && "connect" in e;
	}
	_stopConnection(e) {
		if (this._logger.log(K.Debug, `HttpConnection.stopConnection(${e}) called while in state ${this._connectionState}.`), this.transport = void 0, e = this._stopError || e, this._stopError = void 0, this._connectionState === "Disconnected") {
			this._logger.log(K.Debug, `Call to HttpConnection.stopConnection(${e}) was ignored because the connection is already in the disconnected state.`);
			return;
		}
		if (this._connectionState === "Connecting") throw this._logger.log(K.Warning, `Call to HttpConnection.stopConnection(${e}) was ignored because the connection is still in the connecting state.`), Error(`HttpConnection.stopConnection(${e}) was called while the connection is still in the connecting state.`);
		if (this._connectionState === "Disconnecting" && this._stopPromiseResolver(), e ? this._logger.log(K.Error, `Connection disconnected with error '${e}'.`) : this._logger.log(K.Information, "Connection disconnected."), this._sendQueue &&= (this._sendQueue.stop().catch((e) => {
			this._logger.log(K.Error, `TransportSendQueue.stop() threw error '${e}'.`);
		}), void 0), this.connectionId = void 0, this._connectionState = "Disconnected", this._connectionStarted) {
			this._connectionStarted = !1;
			try {
				this.onclose && this.onclose(e);
			} catch (t) {
				this._logger.log(K.Error, `HttpConnection.onclose(${e}) threw error '${t}'.`);
			}
		}
	}
	_resolveUrl(e) {
		if (e.lastIndexOf("https://", 0) === 0 || e.lastIndexOf("http://", 0) === 0) return e;
		if (!J.isBrowser) throw Error(`Cannot resolve '${e}'.`);
		let t = window.document.createElement("a");
		return t.href = e, this._logger.log(K.Information, `Normalizing '${e}' to '${t.href}'.`), t.href;
	}
	_resolveNegotiateUrl(e) {
		let t = new URL(e);
		t.pathname.endsWith("/") ? t.pathname += "negotiate" : t.pathname += "/negotiate";
		let n = new URLSearchParams(t.searchParams);
		return n.has("negotiateVersion") || n.append("negotiateVersion", this._negotiateVersion.toString()), n.has("useStatefulReconnect") ? n.get("useStatefulReconnect") === "true" && (this._options._useStatefulReconnect = !0) : this._options._useStatefulReconnect === !0 && n.append("useStatefulReconnect", "true"), t.search = n.toString(), t.toString();
	}
};
function vG(e, t) {
	return !e || (t & e) !== 0;
}
var yG = class e {
	constructor(e) {
		this._transport = e, this._buffer = [], this._executing = !0, this._sendBufferedData = new bG(), this._transportResult = new bG(), this._sendLoopPromise = this._sendLoop();
	}
	send(e) {
		return this._bufferData(e), this._transportResult ||= new bG(), this._transportResult.promise;
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
			this._sendBufferedData = new bG();
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
}, bG = class {
	constructor() {
		this.promise = new Promise((e, t) => [this._resolver, this._rejecter] = [e, t]);
	}
	resolve() {
		this._resolver();
	}
	reject(e) {
		this._rejecter(e);
	}
}, xG = "json", SG = class {
	constructor() {
		this.name = xG, this.version = 2, this.transferFormat = dG.Text;
	}
	parseMessages(e, t) {
		if (typeof e != "string") throw Error("Invalid input for JSON hub protocol. Expected a string.");
		if (!e) return [];
		t === null && (t = MW.instance);
		let n = QW.parse(e), r = [];
		for (let e of n) {
			let n = JSON.parse(e);
			if (typeof n.type != "number") throw Error("Invalid payload.");
			switch (n.type) {
				case Y.Invocation:
					this._isInvocationMessage(n);
					break;
				case Y.StreamItem:
					this._isStreamItemMessage(n);
					break;
				case Y.Completion:
					this._isCompletionMessage(n);
					break;
				case Y.Ping: break;
				case Y.Close: break;
				case Y.Ack:
					this._isAckMessage(n);
					break;
				case Y.Sequence:
					this._isSequenceMessage(n);
					break;
				default:
					t.log(K.Information, "Unknown message type '" + n.type + "' ignored.");
					continue;
			}
			r.push(n);
		}
		return r;
	}
	writeMessage(e) {
		return QW.write(JSON.stringify(e));
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
}, CG = {
	trace: K.Trace,
	debug: K.Debug,
	info: K.Information,
	information: K.Information,
	warn: K.Warning,
	warning: K.Warning,
	error: K.Error,
	critical: K.Critical,
	none: K.None
};
function wG(e) {
	let t = CG[e.toLowerCase()];
	if (t !== void 0) return t;
	throw Error(`Unknown log level: ${e}`);
}
var TG = class {
	configureLogging(e) {
		if (q.isRequired(e, "logging"), EG(e)) this.logger = e;
		else if (typeof e == "string") {
			let t = wG(e);
			this.logger = new BW(t);
		} else this.logger = new BW(e);
		return this;
	}
	withUrl(e, t) {
		return q.isRequired(e, "url"), q.isNotEmpty(e, "url"), this.url = e, this.httpConnectionOptions = typeof t == "object" ? {
			...this.httpConnectionOptions,
			...t
		} : {
			...this.httpConnectionOptions,
			transport: t
		}, this;
	}
	withHubProtocol(e) {
		return q.isRequired(e, "protocol"), this.protocol = e, this;
	}
	withAutomaticReconnect(e) {
		if (this.reconnectPolicy) throw Error("A reconnectPolicy has already been set.");
		return this.reconnectPolicy = e ? Array.isArray(e) ? new cG(e) : e : new cG(), this;
	}
	withServerTimeout(e) {
		return q.isRequired(e, "milliseconds"), this._serverTimeoutInMilliseconds = e, this;
	}
	withKeepAliveInterval(e) {
		return q.isRequired(e, "milliseconds"), this._keepAliveIntervalInMilliseconds = e, this;
	}
	withStatefulReconnect(e) {
		return this.httpConnectionOptions === void 0 && (this.httpConnectionOptions = {}), this.httpConnectionOptions._useStatefulReconnect = !0, this._statefulReconnectBufferSize = e?.bufferSize, this;
	}
	build() {
		let e = this.httpConnectionOptions || {};
		if (e.logger === void 0 && (e.logger = this.logger), !this.url) throw Error("The 'HubConnectionBuilder.withUrl' method must be called before building the connection.");
		let t = new _G(this.url, e);
		return oG.create(t, this.logger || MW.instance, this.protocol || new SG(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
	}
};
function EG(e) {
	return e.log !== void 0;
}
//#endregion
//#region src/transport/attach-gate.ts
var DG = class extends Error {
	byServerError;
	constructor(e) {
		super("the connection to the server dropped under the call; it is reconnecting.", { cause: e }), this.name = "ConnectionDropped", this.byServerError = e instanceof Error && e.message.startsWith("Server returned an error on close");
	}
}, OG = class {
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
}, kG = 500;
function AG(e) {
	let { changes: t, ...n } = e;
	return n;
}
function jG() {
	return {};
}
var MG = class {
	windowId;
	connection;
	started = !1;
	gate = new OG();
	inbound;
	constructor(e, t, n = {}) {
		this.windowId = e, this.inbound = new gW(t), this.connection = new TG().withUrl(n.hubUrl ?? "/_ne/hub").withAutomaticReconnect([...n.reconnectDelays ?? [
			0,
			1e3,
			3e3,
			1e4,
			3e4
		]]).configureLogging(K.Warning).build();
	}
	get instanceId() {
		return this.connection.connectionId ?? null;
	}
	get isReconnecting() {
		return this.connection.state === X.Reconnecting;
	}
	onChanges(e) {
		this.connection.on("ui.changes", this.inbound.pushed((t) => e(t)));
	}
	onCommandResult(e) {
		this.connection.on("ui.commandResult", this.inbound.pushed((t) => e(t)));
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
		if (!(this.started || this.connection.state !== X.Disconnected)) try {
			await this.connection.start(), this.started = !0, l("SignalR connected.", {
				connectionId: this.connection.connectionId,
				windowId: this.windowId
			});
		} catch (e) {
			throw this.started = !1, c("SignalR connection failed.", e), e;
		}
	}
	async stopAsync() {
		this.connection.state !== X.Disconnected && (await this.connection.stop(), this.started = !1);
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
		return await this.invokeAsync("ProcessEventAsync", [e], (e) => this.inbound.answered(e, (e) => e.changes, AG));
	}
	async requestLeaveAsync(e) {
		return await this.invokeAsync("RequestLeaveAsync", [{ target: e }], (e) => this.inbound.answered(e, (e) => e.changes, AG));
	}
	async navigateInPlaceAsync(e) {
		return await this.invokeAsync("NavigateInPlaceAsync", [{ parameters: e }], (e) => this.inbound.answered(e, (e) => e.changes, AG));
	}
	async processChangeSetAsync(e, t) {
		try {
			await this.invokeAsync("ProcessChangeSetAsync", [e], (e) => this.inbound.answered(e, (e) => e, jG, t));
		} catch (e) {
			throw this.isReconnecting && this.gate.failure === null ? new DG(e) : e;
		}
	}
	whenAttached() {
		return this.gate.wait();
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
		await this.invokeAsync("RequestItemWindowAsync", [e], (e) => this.inbound.answered(e, (e) => e, jG));
	}
	async invokeAsync(e, t, n) {
		let r = window.setTimeout(() => s("call waiting behind the attach.", { methodName: e }), kG);
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
		if (this.connection.state !== X.Connected) {
			if (this.connection.state === X.Disconnected) {
				this.started = !1, await this.startAsync();
				return;
			}
			throw Error(`SignalR connection is not ready. State: ${this.connection.state}.`);
		}
	}
}, NG = Promise.resolve(), PG = () => {}, FG = sW * 3 / 4, IG = 128, LG = class {
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
		if (this.handed >= this.given) return NG;
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
		for (; this.flight !== null;) await this.flight.catch(PG);
	}
	dispatchAsync(e, t) {
		let n = ++this.given, r = lW(e.value), i = r === null ? null : fW(r);
		return i?.catch(PG), new Promise((a, o) => {
			let s = zG(e), c = this.queue.findIndex((e) => e.field === s), l = [{
				resolve: a,
				reject: o
			}], u = n;
			c >= 0 && (l = [...this.queue[c].settles, ...l], u = this.queue[c].sequence, this.queue.splice(c, 1));
			let d = r === null ? RG(e) : RG({
				...e,
				value: void 0
			}) + IG;
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
		let i = n.length === 0 ? null : this.transport.processChangeSetAsync({ updates: n }, BG(r));
		if (this.markHanded(t), i !== null) try {
			await i;
			for (let e of r) for (let t of e.settles) t.resolve();
		} catch (e) {
			if (e instanceof DG) {
				this.requeue(r, e);
				return;
			}
			for (let t of r) for (let n of t.settles) n.reject(e);
		}
	}
	takeBatch() {
		let e = 0, t = 0;
		for (; e < this.queue.length && (e === 0 || t + this.queue[e].bytes <= FG);) t += this.queue[e].bytes, e++;
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
		let t = this.transport.whenAttached().then(() => fW(e));
		return t.catch(PG), t;
	}
	markHanded(e) {
		this.handed = Math.max(this.handed, e);
		for (let e = this.sentWaiters.length - 1; e >= 0; e--) {
			let t = this.sentWaiters[e];
			t.through <= this.handed && (this.sentWaiters.splice(e, 1), t.resolve());
		}
	}
};
function RG(e) {
	return new TextEncoder().encode(JSON.stringify(e)).byteLength;
}
function zG(e) {
	return `${e.componentId}:${e.propertyName}:${JSON.stringify(e.dynamicParameters)}`;
}
function BG(e) {
	let t = e.map((e) => e.before).filter((e) => e !== void 0);
	if (t.length !== 0) return () => {
		for (let e of t) e();
	};
}
//#endregion
//#region src/updates/form-owner.ts
var VG = "form-owner", HG = "ui-form-";
function UG(e) {
	return HG + e.replace(/[ \t\n\f\r]/g, "_");
}
function WG(e, t) {
	if (typeof t != "string" || t.trim().length === 0) {
		e.hasAttribute("form") && e.removeAttribute("form");
		return;
	}
	let n = UG(t);
	KG(n), e.getAttribute("form") !== n && e.setAttribute("form", n);
}
function GG(e) {
	for (let t of e.querySelectorAll("[form]")) {
		let e = t.getAttribute("form");
		e !== null && e.startsWith(HG) && KG(e);
	}
}
function KG(e) {
	let t = qG();
	if (t.querySelector(`form[id="${C(e)}"]`) !== null) return;
	let n = document.createElement("form");
	n.setAttribute("id", e), n.setAttribute("method", "dialog"), n.setAttribute("novalidate", ""), t.appendChild(n);
}
function qG() {
	let e = document.body.querySelector(`[${Bt}]`);
	if (e !== null) return e;
	let t = document.createElement("div");
	return t.setAttribute(Bt, ""), t.setAttribute("hidden", ""), document.body.appendChild(t);
}
//#endregion
//#region src/interactions/legacy-commands.ts
var JG = document;
function YG() {
	try {
		return JG.execCommand("copy");
	} catch {
		return !1;
	}
}
function XG(e) {
	try {
		return typeof JG.execCommand == "function" && JG.execCommand("insertText", !1, e);
	} catch {
		return !1;
	}
}
//#endregion
//#region src/rendering/web-dom-converters.ts
var ZG = /* @__PURE__ */ new Map([
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
]), QG = [
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
function $G(e) {
	return $(e, QG);
}
var eK = [
	"small",
	"medium",
	"large"
], tK = ["default", "circle"], nK = [
	"display",
	"title",
	"subtitle",
	"body",
	"caption",
	"overline"
], rK = [
	"start",
	"center",
	"end",
	"justify"
], iK = ["nowrap", "wrap"], aK = /* @__PURE__ */ new Map([
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
]), oK = /* @__PURE__ */ new Map([
	["primary", "--ui-color-primary-ink"],
	["accent", "--ui-color-accent-ink"],
	["info", "--ui-color-info-ink"],
	["warning", "--ui-color-warning-ink"],
	["success", "--ui-color-success-ink"],
	["danger", "--ui-color-danger-ink"]
]), sK = /* @__PURE__ */ new Map([
	["primary", "--ui-color-on-primary"],
	["accent", "--ui-color-on-accent"],
	["info", "--ui-color-on-info"],
	["warning", "--ui-color-on-warning"],
	["success", "--ui-color-on-success"],
	["danger", "--ui-color-on-danger"],
	["muted", "--ui-color-surface"]
]), cK = ["inline", "trailing"], lK = [
	"filled",
	"outline",
	"underline",
	"ghost",
	"tonal"
], uK = [
	"small",
	"medium",
	"large"
], dK = [
	"small",
	"medium",
	"large"
], fK = [
	"primary",
	"accent",
	"danger",
	"outline",
	"ghost",
	"link",
	"surface"
], pK = [
	"primary",
	"accent",
	"info",
	"warning",
	"success",
	"danger",
	"surface",
	"plain"
], mK = [
	"filled",
	"tinted",
	"outline"
], hK = ["light", "dark"], gK = [
	"start",
	"center",
	"end",
	"stretch"
], _K = ["clip", "visible"], vK = [
	"visible",
	"hidden",
	"collapsed"
], yK = [
	"background",
	"raised",
	"tinted"
], bK = ["horizontal", "vertical"], xK = [
	"none",
	"gap",
	"rule"
], SK = [
	"none",
	"one",
	"many"
], CK = [
	"none",
	"left",
	"right",
	"top",
	"bottom"
], wK = ["stack", "wrap"], TK = ["end", "start"], EK = [
	"disabled",
	"auto",
	"always"
], DK = [
	"disabled",
	"proximity",
	"mandatory"
], OK = [
	"text",
	"email",
	"password",
	"search",
	"tel",
	"url"
], kK = [
	"text",
	"numeric",
	"decimal",
	"tel",
	"email",
	"url",
	"search"
], AK = ["hex", "rgb"], jK = ["field", "swatch"], MK = [
	"fill",
	"contain",
	"cover",
	"none"
], NK = [
	"100% 100%",
	"contain",
	"cover",
	"auto"
], PK = ["default", "circle"], FK = ["uniform", "vignette"], IK = ["linear", "circular"], LK = [
	"none",
	"vertical",
	"horizontal",
	"both"
], RK = [
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
], zK = [
	"None",
	"Shade",
	"Tint"
], BK = /* @__PURE__ */ new Map();
function VK(e) {
	return BK.get(e);
}
function Q(e, t, n) {
	return WK(e, HK(t, n), (e) => `${t}${$(e, n)}`);
}
function HK(e, t) {
	return UK(t.map((t) => `${e}${t}`));
}
function UK(e) {
	let t = new Set(e);
	return (e) => t.has(e);
}
function WK(e, t, n) {
	return BK.set(e, t), [e, n];
}
function GK(e, t, n) {
	return jf.map((r) => [`${e}${r[0].toUpperCase()}${r.slice(1)}${t}`, (e) => n(e, r)]);
}
var KK = new Map([
	Q("colorClass", "ui-color--", QG),
	WK("themeColorClass", HK("ui-color--", QG), (e) => kq(e)),
	WK("iconClass", c_, (e) => l_(e)),
	["iconUrlCss", (e) => t_(e)],
	["safeUrl", (e) => Vg(e)],
	["safeImageSource", (e) => Xg(e)],
	["inlineMarkupPlainText", (e) => e == null ? void 0 : wA(String(e))],
	["ariaBooleanAttribute", (e) => e === !0 ? "true" : "false"],
	["placeholderText", (e) => typeof e == "string" && e.length > 0 ? e : " "],
	Q("iconSizeClass", "ui-icon-size--", eK),
	WK("iconShapeClass", UK(["ui-icon--circle"]), (e) => $(e, tK) === "circle" ? "ui-icon--circle" : ""),
	Q("textTypeClass", "ui-text-type--", nK),
	WK("textAppearanceClass", HK("ui-text-type--", nK), (e) => Rq(e, "ui-text-type--")),
	WK("textDescriptionTypeClass", HK("ui-text--description-", nK), (e) => Rq(e, "ui-text--description-")),
	Q("textAlignmentClass", "ui-text--align-", rK),
	Q("textWrapClass", "ui-text--", iK),
	Q("buttonAlignmentClass", "ui-button--align-", rK),
	Q("textBadgePlacementHostClass", "ui-text--badge-", cK),
	Q("badgeStyleClass", "ui-badge-style--", pK),
	Q("badgeFillClass", "ui-badge-fill--", mK),
	WK("badgeColoredClass", UK(["ui-badge--colored"]), (e) => xq(e).length > 0 ? "ui-badge--colored" : ""),
	["badgeTextFit", (e) => Aq(e)],
	Q("buttonClass", "ui-button--", fK),
	Q("surfaceStyleClass", "ui-surface--", yK),
	Q("orientationClass", "ui-orientation--", bK),
	Q("groupSeparatorClass", "ui-command-bar--separator-", xK),
	["selectionModeAttribute", (e) => $(e, SK)],
	["selectionBackgroundCss", (e) => xq(vq(e, "background"))],
	["selectionForegroundCss", (e) => xq(vq(e, "foreground"))],
	["selectionMarkColorCss", (e) => xq(vq(e, "markColor"))],
	["selectionMarkCss", (e) => bq(vq(e, "mark"))],
	["selectionFontWeightCss", (e) => yq(vq(e, "bold"))],
	["selectionActionBarBackgroundCss", (e) => xq(vq(e, "actionBarBackground"))],
	Q("itemsViewLayoutClass", "ui-items-view--", wK),
	Q("dragHandlePlacementClass", "ui-drag-handle--", TK),
	Q("scrollXClass", "ui-scroll-x--", EK),
	Q("scrollYClass", "ui-scroll-y--", EK),
	["hostViewport", (e) => sq(e)],
	Q("scrollSnapClass", "ui-scroll-snap--", DK),
	Q("inputAppearanceClass", "ui-input--", lK),
	Q("inputSizeClass", "ui-input--", dK),
	Q("buttonSizeClass", "ui-button--", uK),
	Q("buttonGroupSizeClass", "ui-button-group--", uK),
	["textInputTypeAttribute", (e) => $(e, OK)],
	["inputModeAttribute", (e) => $(e, kK)],
	["colorTextFormatAttribute", (e) => $(e, AK)],
	["colorInputVariantAttribute", (e) => $(e, jK)],
	["themeNameCss", (e) => $(e, hK)],
	["alignmentCss", (e) => $(e, gK)],
	["alignmentStretchFallbackCss", (e) => $(e, gK) === "stretch" ? "start" : ""],
	["overflowCss", (e) => $(e, _K)],
	["layoutLengthCss", (e) => cq(e)],
	["thicknessCss", (e) => dq(e)],
	WK("borderNoneClass", UK(["ui-border--none"]), (e) => pq(e)),
	["radiusCss", (e) => mq(e)],
	["gridUnitCss", (e) => hq(e)],
	["pixelsCss", (e) => Jq(e)],
	["gridTemplateCss", (e) => gq(e)],
	["colorVariantCss", (e) => Hq(e)],
	["themeColorCss", (e) => xq(e)],
	["themeInkCss", (e) => Cq(e)],
	["roleInkCss", (e) => wq(e)],
	["themeOnColorCss", (e) => Eq(e)],
	["themeColorInlineCss", (e) => Sq(e) ? "" : xq(e)],
	["themeColorCanonical", (e) => Bq(e)],
	["textAppearanceFontSizeCss", (e) => zq(e, "size")],
	["textAppearanceFontWeightCss", (e) => zq(e, "weight")],
	["textAppearanceLineHeightCss", (e) => zq(e, "lineHeight")],
	["textAppearanceLetterSpacingCss", (e) => zq(e, "letterSpacing")],
	...GK("responsiveLayoutLength", "Css", (e, t) => cq(Lf(e, t))),
	...GK("responsiveWidth", "Css", (e, t) => lq(Lf(e, t), "horizontal")),
	...GK("responsiveHeight", "Css", (e, t) => lq(Lf(e, t), "vertical")),
	...GK("responsiveThickness", "Css", (e, t) => dq(Lf(e, t))),
	...GK("responsiveThicknessHorizontal", "Css", (e, t) => fq(Lf(e, t), "horizontal")),
	...GK("responsiveThicknessVertical", "Css", (e, t) => fq(Lf(e, t), "vertical")),
	...GK("responsiveRadius", "Css", (e, t) => mq(Lf(e, t))),
	...GK("responsivePixels", "Css", (e, t) => Yq(Lf(e, t))),
	...GK("visibility", "Attribute", (e, t) => Xq(e, t)),
	...GK("gridPlacement", "ColumnCss", (e, t) => _q(Lf(e, t), "column")),
	...GK("gridPlacement", "RowCss", (e, t) => _q(Lf(e, t), "row")),
	...GK("gridPlacement", "ColumnSpanCss", (e, t) => _q(Lf(e, t), "columnSpan")),
	...GK("gridPlacement", "RowSpanCss", (e, t) => _q(Lf(e, t), "rowSpan")),
	Q("imageFitClass", "ui-image-fit--", MK),
	WK("imageShapeClass", UK(["ui-image--circle"]), (e) => $(e, PK) === "circle" ? "ui-image--circle" : ""),
	["backgroundImageCss", (e) => ZK(e)],
	["backgroundImageAttribute", (e) => ZK(e).length === 0 ? void 0 : ""],
	["imageFitSizeCss", (e) => $(e, NK)],
	["backgroundImageDimCss", (e) => QK(e)],
	["backgroundImageDimModeAttribute", (e) => $(e, FK) === "vignette" ? "vignette" : void 0],
	["backgroundImageBlurCss", (e) => nq(e) ? `${Number(e)}px` : ""],
	["backgroundImageBlurAttribute", (e) => nq(e) ? "" : void 0],
	["positiveCount", (e) => $K(e)?.toString()],
	["nonNegativeCount", (e) => eq(e, (e) => e >= 0)?.toString()],
	["nonZeroCount", (e) => eq(e, (e) => e !== 0)?.toString()],
	["positiveNumber", (e) => tq(e, (e) => e > 0)?.toString()],
	["nonNegativeNumber", (e) => tq(e, (e) => e >= 0)?.toString()],
	["share", (e) => tq(e, (e) => e >= 0 && e <= 1)?.toString()],
	["positiveFlagAttribute", (e) => $K(e) === void 0 ? void 0 : ""],
	WK("maxLinesClass", UK(["ui-text--max-lines"]), (e) => $K(e) === void 0 ? "" : "ui-text--max-lines"),
	Q("progressVariantClass", "ui-progress--", IK),
	["progressValueText", (e) => qq(e)],
	["textAreaResizeCss", (e) => $(e, LK)],
	Q("flyoutPlacementClass", "ui-flyout--", RK),
	["popupPlacementAttribute", (e) => $(e, RK)],
	["tabMenuEntriesAttribute", (e) => YK(e)],
	["markedDaysAttribute", (e) => XK(e)]
]);
function qK(e) {
	let t = KK.get("surfaceStyleClass");
	return yK.find((n, r) => e.classList.contains(t?.(r) ?? "")) ?? null;
}
var JK = [
	["rename", 1],
	["pin", 2],
	["close", 4],
	["delete", 8]
];
function YK(e) {
	let t = typeof e == "string" ? e.split(",").map((e) => e.trim().toLowerCase()) : null, n = typeof e == "number" ? e : 0, r = JK.filter(([e, r]) => t === null ? (n & r) !== 0 : t.includes(e)).map(([e]) => e);
	return r.length === 0 ? void 0 : r.join(" ");
}
function XK(e) {
	let t = Array.isArray(e) ? e.filter((e) => typeof e == "string" && e.length > 0).map((e) => e.slice(0, 10)) : [];
	return t.length === 0 ? void 0 : [...new Set(t)].sort().join(" ");
}
function ZK(e) {
	return t_(e);
}
function QK(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isNaN(t) ? "" : String(Math.min(1, Math.max(0, t)));
}
function $K(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isInteger(t) && t > 0 ? t : void 0;
}
function eq(e, t) {
	let n = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isInteger(n) && t(n) ? n : void 0;
}
function tq(e, t) {
	let n = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isFinite(n) && t(n) ? n : void 0;
}
function nq(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isFinite(t) && t > 0;
}
var rq = [
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
], iq = new Map(rq.map(([, e, t, n, r]) => [e, [
	t,
	n,
	r
]])), aq = new Map(rq.map(([e, t]) => [e, t])), oq = /* @__PURE__ */ new Map([[_K, /* @__PURE__ */ new Map([["Hidden", "clip"]])], [NK, /* @__PURE__ */ new Map([["Fill", "100% 100%"], ["None", "auto"]])]]);
function $(e, t) {
	return typeof e == "string" ? (t === void 0 ? void 0 : oq.get(t)?.get(e)) ?? ZG.get(e) ?? mi(e) : typeof e == "number" && t !== void 0 ? t[e] ?? String(e) : String(e ?? "");
}
function sq(e) {
	return e == null || $(e, EK) === "disabled" ? void 0 : "parent";
}
function cq(e) {
	if (e == null) return "";
	if (typeof e == "number") return Jq(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.kind, r = t.value ?? 0;
	return n === "Auto" || n === 0 ? "" : n === "Absolute" || n === 1 ? Jq(r) : n === "Fill" || n === 2 ? "100%" : "";
}
function lq(e, t) {
	if (typeof e != "object" || !e) return cq(e);
	let n = e.kind;
	return n !== "Fill" && n !== 2 ? cq(e) : t === "horizontal" ? "var(--ui-fill-width, 100%)" : "var(--ui-fill-height, 100%)";
}
function uq(e) {
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
function dq(e) {
	if (e == null) return "";
	let t = uq(e);
	return t === void 0 ? String(e) : `${t.top}px ${t.right}px ${t.bottom}px ${t.left}px`;
}
function fq(e, t) {
	let n = uq(e);
	return n === void 0 ? "" : Jq(t === "horizontal" ? n.left + n.right : n.top + n.bottom);
}
function pq(e) {
	if (e == null) return "";
	if (typeof e == "object" && "base" in e) return jf.map((t) => Lf(e, t)).filter((e) => e != null).every((e) => pq(e) !== "") ? "ui-border--none" : "";
	let t = uq(e);
	return t !== void 0 && t.top === 0 && t.right === 0 && t.bottom === 0 && t.left === 0 ? "ui-border--none" : "";
}
function mq(e) {
	if (e == null) return "";
	if (typeof e == "number") return Jq(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.topLeft ?? 0, r = t.topRight ?? 0, i = t.bottomRight ?? 0, a = t.bottomLeft ?? 0;
	return n === r && n === i && n === a ? Jq(n) : `${n}px ${r}px ${i}px ${a}px`;
}
function hq(e) {
	if (e == null) return "";
	if (typeof e == "number") return e <= 0 ? "minmax(0, 1fr)" : `minmax(0, ${e}fr)`;
	if (typeof e != "object") return String(e);
	let t = e, n = t.unit, r = t.value ?? 1, i = t.minValue, a = t.maxValue;
	if (n === "Absolute" || n === 1) return Jq(r);
	if (n === "Star" || n === 0) {
		let e = i != null && i > 0 ? `${i}px` : "0";
		return r <= 0 ? `minmax(${e}, 1fr)` : `minmax(${e}, ${r}fr)`;
	}
	return n === "Auto" || n === 2 ? i == null ? a == null ? "auto" : `fit-content(${a}px)` : `minmax(${i}px, auto)` : "";
}
function gq(e) {
	if (e == null) return "";
	if (!Array.isArray(e)) return hq(e);
	if (e.length === 0) return "none";
	if (e.length === 1) return hq(e[0]);
	let t = JSON.stringify(e[0]);
	return e.every((e) => JSON.stringify(e) === t) ? `repeat(${e.length}, ${hq(e[0])})` : e.map((e) => hq(e)).join(" ");
}
function _q(e, t) {
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
function vq(e, t) {
	return typeof e != "object" || !e ? null : e[t] ?? null;
}
function yq(e) {
	return e == null ? "" : e === !0 ? "600" : "400";
}
function bq(e) {
	if (e == null) return "";
	switch ($(e, CK)) {
		case "left": return "inset 2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "right": return "inset -2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "top": return "inset 0 2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "bottom": return "inset 0 -2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		default: return "none";
	}
}
function xq(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	if (Vq(e)) return Hq(e);
	let t = e, n = Hq(t.light), r = Hq(t.dark), i = n.length > 0 ? n : r, a = r.length > 0 ? r : n;
	if (i.length > 0 && a.length > 0) return i === a ? i : `light-dark(${i}, ${a})`;
	let o = t.style;
	if (o == null) return "";
	let s = aK.get($(o, QG));
	return s ? `var(${s})` : "";
}
function Sq(e) {
	if (typeof e != "object" || !e || Vq(e)) return !1;
	let t = e;
	return t.light == null && t.dark == null && t.style != null;
}
function Cq(e) {
	if (Sq(e)) {
		let t = oK.get($(e.style, QG));
		if (t !== void 0) return `var(${t})`;
	}
	return xq(e);
}
function wq(e) {
	if (typeof e != "object" || !e || Vq(e)) return "";
	let t = e;
	return t.light == null && t.dark == null ? Cq(e) : "";
}
var Tq = /* @__PURE__ */ new Set(["background", "surface"]);
function Eq(e) {
	if (typeof e != "object" || !e) return "";
	if (Vq(e)) return Dq(e) ? "initial" : Oq(e);
	let t = e, n = Oq(t.light ?? t.dark), r = Oq(t.dark ?? t.light);
	if (n.length > 0 && r.length > 0 && Dq(t.light ?? t.dark) && Dq(t.dark ?? t.light)) return "initial";
	if (n.length > 0 && r.length > 0) return n === r ? n : `light-dark(${n}, ${r})`;
	if (t.style === null || t.style === void 0) return "";
	let i = $(t.style, QG);
	if (Tq.has(i)) return "initial";
	let a = sK.get(i);
	return a ? `var(${a})` : "";
}
function Dq(e) {
	return Uq(e)?.[3] === 0;
}
function Oq(e) {
	let t = Uq(e);
	return t === void 0 ? "" : AI(t[0], t[1], t[2], t[3]);
}
function kq(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.light != null || t.dark != null) return "";
	let n = t.style;
	return n == null ? "" : `ui-color--${$(n, QG)}`;
}
function Aq(e) {
	let t = Pq(e == null ? "" : String(e).trim(), jq + 1);
	return t > 0 && t <= jq ? "compact" : "";
}
var jq = 2, Mq = /[\u0300-\uFFFF]/, Nq = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function Pq(e, t) {
	if (!Mq.test(e)) return e.length;
	let n = 0;
	for (let { segment: r } of Nq.segment(e)) {
		if (n >= t) break;
		n += Fq(r) ? 2 : 1;
	}
	return n;
}
function Fq(e) {
	if (e.includes("️")) return !0;
	let t = e.codePointAt(0) ?? 0;
	for (let e = 0; e < Iq.length; e += 2) if (t >= Iq[e] && t <= Iq[e + 1]) return !0;
	return !1;
}
var Iq = [
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
function Lq(e, t) {
	let n = String(t), r = e.querySelector(".ui-badge__text");
	r !== null && (r.textContent = n), e.setAttribute(Ve, Aq(n)), e.setAttribute(He, "");
}
function Rq(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size != null) return "";
	let r = n.role;
	return r == null ? "" : `${t}${$(r, nK)}`;
}
function zq(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size == null) return "";
	switch (t) {
		case "size": return Jq(n.size);
		case "weight": {
			let e = n.weight;
			return e == null ? "" : String(e);
		}
		case "lineHeight": {
			let e = n.lineHeight;
			return e == null ? "" : Jq(e);
		}
		case "letterSpacing": {
			let e = n.letterSpacing;
			return e == null ? "" : Jq(e);
		}
		default: return "";
	}
}
function Bq(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return "";
	let t = e, n = Wq(t.style);
	if (n !== null) return `@${n}`;
	let r = t.light ?? t.dark;
	if (r == null) return "";
	if (typeof r.rgb == "number") {
		let e = r.opacity ?? 255, t = `#${kI(r.rgb >> 16 & 255)}${kI(r.rgb >> 8 & 255)}${kI(r.rgb & 255)}`;
		return e === 255 ? t : `${t}${kI(e)}`;
	}
	let i = Gq(r.name);
	return i === null ? "" : `${i}/${Kq(r.adjustment) ?? "None"}/${r.factor ?? 0}/${r.opacity ?? 255}`;
}
function Vq(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.name !== void 0 || t.rgb !== void 0;
}
function Hq(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	let t = Uq(e);
	return t === void 0 ? "" : `#${kI(t[0])}${kI(t[1])}${kI(t[2])}${kI(t[3])}`;
}
function Uq(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = typeof t.rgb == "number" ? [
		t.rgb >> 16 & 255,
		t.rgb >> 8 & 255,
		t.rgb & 255
	] : void 0, r = Gq(t.name), i = n ?? (r === null ? void 0 : iq.get(r));
	if (!i) return;
	let a = Kq(t.adjustment), o = (t.factor ?? 0) / 10, s = t.opacity ?? 255, [c, l, u] = i;
	return a === "Shade" ? (c = OI(c * (1 - o)), l = OI(l * (1 - o)), u = OI(u * (1 - o))) : a === "Tint" && (c = OI(c + (255 - c) * o), l = OI(l + (255 - l) * o), u = OI(u + (255 - u) * o)), [
		c,
		l,
		u,
		s
	];
}
function Wq(e) {
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	if (typeof e != "number") return null;
	let t = QG[e];
	return t === void 0 ? null : t.split("-").map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join("");
}
function Gq(e) {
	if (typeof e == "number") return aq.get(e) ?? null;
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	return null;
}
function Kq(e) {
	if (typeof e == "number") return zK[e] ?? "None";
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? "None" : t;
	}
	return "None";
}
function qq(e) {
	if (e == null || e === "") return "";
	let t = typeof e == "number" ? e : Number(e);
	return Number.isFinite(t) ? String(t) : "";
}
function Jq(e) {
	return `${typeof e == "number" ? e : Number(e ?? 0)}px`;
}
function Yq(e) {
	return e == null ? "" : Jq(e);
}
function Xq(e, t) {
	let n = Rf(e, t);
	if (n == null) return;
	let r = $(n, vK);
	return r === "visible" ? void 0 : r;
}
//#endregion
//#region src/interactions/live-announcer.ts
var Zq = "ui-announcer", Qq = 7e3, $q = class {
	container;
	regions = /* @__PURE__ */ new Map();
	constructor(e) {
		this.container = e, this.ensureRegion("polite"), this.ensureRegion("assertive");
	}
	announce(e, t = "polite") {
		let n = document.createElement("div");
		return typeof e == "string" ? n.textContent = e : D.writeValue(n, null, e), this.ensureRegion(t).append(n), window.setTimeout(() => n.remove(), Qq), n;
	}
	ensureRegion(e) {
		let t = this.regions.get(e);
		if (t !== void 0 && t.isConnected) return t;
		let n = `.${Zq}[aria-live="${e}"]`, r = this.container.querySelector(n), i = r ?? document.createElement("div");
		return r === null && (i.className = Zq, i.setAttribute("aria-live", e), this.container.append(i)), this.regions.set(e, i), i;
	}
}, eJ = "ui-notification-host", tJ = "ui-notification", nJ = "ui-notification--leaving", rJ = "ui-notification__message", iJ = "ui-notification__title", aJ = "ui-notification__action", oJ = "ui-notification__close", sJ = 5e3, cJ = 8e3, lJ = "ui-notification--connection", uJ = "--ui-notification-lift", dJ = /* @__PURE__ */ new Set([
	"info",
	"success",
	"warning",
	"danger",
	"primary",
	"accent"
]), fJ = class {
	root;
	components;
	durationMs;
	host = null;
	announcer;
	focusOrigins = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, this.durationMs = e.durationMs ?? sJ, this.ensureHost(), this.announcer = new $q(this.root instanceof Document ? this.root.body : this.root);
	}
	announce(e, t) {
		return this.announcer.announce(e, t);
	}
	show(e) {
		let t = $G(e.severity), n = document.createElement("div");
		n.className = dJ.has(t) ? `${tJ} ${tJ}--${t}` : tJ, n.classList.toggle(lJ, e.connection === !0), t === "danger" && n.setAttribute("role", "alert");
		let r = document.createElement("span");
		if (r.className = rJ, e.title !== void 0) {
			let t = document.createElement("span");
			t.className = iJ, D.writeValue(t, null, e.title), n.append(t);
		}
		typeof e.message == "string" ? r.textContent = e.message : D.writeValue(r, null, e.message), n.append(r);
		let i = document.createElement("button");
		return i.type = "button", i.className = oJ, D.write(i, "aria-label", "ui.notification.close"), i.addEventListener("click", () => this.dismiss(n)), n.append(i), e.action !== void 0 && n.append(gJ(e.action, e.sticky === !0 ? null : () => this.dismiss(n))), n.addEventListener("keydown", (e) => {
			e.key !== "Escape" || e.defaultPrevented || j(e) || (e.preventDefault(), this.dismiss(n));
		}), n.addEventListener("focusin", (e) => {
			let t = e.relatedTarget;
			t instanceof HTMLElement && !n.contains(t) && this.focusOrigins.set(n, t);
		}), pJ(() => {
			if (n.classList.contains(nJ)) return;
			let t = this.ensureHost();
			mJ(t), t.append(n), e.sticky !== !0 && this.standFor(n, e);
		}), n;
	}
	standFor(e, t) {
		let n = t.durationMs !== void 0 && t.durationMs > 0 ? t.durationMs : t.action === void 0 ? this.durationMs : cJ, r = !1, i = !1, a = window.setTimeout(() => this.dismiss(e), n), o = () => window.clearTimeout(a), s = () => {
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
		if (!e.classList.contains(nJ) && (e.classList.add(nJ), e.isConnected)) {
			if (this.returnFocus(e), Of() || typeof e.animate != "function") {
				e.remove();
				return;
			}
			window.setTimeout(() => hJ(e), z.fast);
		}
	}
	returnFocus(e) {
		if (!e.contains(document.activeElement)) return;
		let t = [...e.parentElement?.children ?? []].find((t) => t !== e && !t.classList.contains(nJ));
		Od(wd(this.focusOrigins.get(e), this.components) ?? t?.querySelector(`.${oJ}`) ?? null, e);
	}
	ensureHost() {
		if (this.host !== null && this.host.isConnected) return this.host;
		let e = this.root instanceof Document ? this.root.body : this.root, t = e.querySelector(`.${eJ}`), n = t ?? document.createElement("div");
		return n.classList.add(eJ), n.setAttribute("role", "status"), n.setAttribute("aria-live", "polite"), t === null && e.append(n), this.host = n, n;
	}
};
function pJ(e) {
	if (Bz(document.visibilityState)) {
		e();
		return;
	}
	let t = () => {
		Bz(document.visibilityState) && (document.removeEventListener("visibilitychange", t), e());
	};
	document.addEventListener("visibilitychange", t);
}
function mJ(e) {
	let t = window.innerHeight - Ip(window.innerHeight);
	t > 0 ? e.style.setProperty(uJ, `${Math.round(t)}px`) : e.style.removeProperty(uJ);
}
function hJ(e) {
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
function gJ(e, t) {
	let n = document.createElement("button"), r = !1;
	return n.type = "button", n.className = `${aJ} ui-button ui-button--primary ui-button--small`, typeof e.label == "string" ? n.textContent = e.label : D.writeValue(n, null, e.label), n.addEventListener("click", () => {
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
function _J(e, t) {
	let n = vJ(e), r = e?.label;
	if (n !== void 0) {
		if (!so(r) && !co(r)) {
			s("a notification's action carries no words.", e);
			return;
		}
		return {
			label: r,
			run: () => t(n)
		};
	}
}
function vJ(e) {
	return e != null && typeof e.id == "string" && e.id.length > 0 ? e.id : void 0;
}
//#endregion
//#region src/effects/insert-text.ts
function yJ(e, t, n) {
	let r = e.itemKey === !0 ? bJ(n) : e.text;
	if (typeof r != "string") {
		s(e.itemKey === !0 ? "insert text effect reads the row's key but ran for no row." : "insert text effect carries no text.", e);
		return;
	}
	let i = xJ(t);
	if (i === null) {
		s("insert text effect target holds no text field.", e);
		return;
	}
	SJ(i, r);
}
function bJ(e) {
	let t = e.length === 0 ? null : e[e.length - 1];
	return t == null ? null : String(t);
}
function xJ(e) {
	if (Tc(e)) return e;
	for (let t of e.querySelectorAll("input, textarea")) if (Tc(t)) return t;
	return null;
}
function SJ(e, t) {
	if (t.length === 0 || e.readOnly || e.disabled || O(e) || A(e)) return !1;
	let n = e.value, r = e.selectionStart !== null, i = e.selectionStart ?? n.length, a = e.selectionEnd ?? i;
	return e.maxLength >= 0 && n.length - (a - i) + t.length > e.maxLength ? !1 : (document.activeElement !== e && e.focus({ preventScroll: !0 }), r && e.setSelectionRange(i, a), document.activeElement === e && XG(t) && e.value !== n ? !0 : (r ? e.setRangeText(t, i, a, "end") : e.value = n + t, e.dispatchEvent(new Event("input", { bubbles: !0 })), !0));
}
//#endregion
//#region src/effects/navigation-url.ts
function CJ(e) {
	let t = e.request?.route;
	return t == null || t.length === 0 ? null : wJ(t, e.request?.parameters ?? null);
}
function wJ(e, t) {
	let n = TJ(t);
	if (n.length === 0) return e;
	let r = e.indexOf("#"), i = r < 0 ? e : e.slice(0, r), a = r < 0 ? "" : e.slice(r);
	return `${i}${i.includes("?") ? i.endsWith("?") || i.endsWith("&") ? "" : "&" : "?"}${n}${a}`;
}
function TJ(e) {
	if (e === null) return "";
	let t = new URLSearchParams();
	for (let [n, r] of Object.entries(e)) if (r != null) for (let e of Array.isArray(r) ? r : [r]) e != null && t.append(n, EJ(e));
	return t.toString();
}
function EJ(e) {
	return typeof e == "object" ? JSON.stringify(e) : String(e);
}
//#endregion
//#region src/effects/scroller.ts
function DJ(e, t) {
	let n = kJ([e, ...e.querySelectorAll("*")], t);
	if (n !== null) return n;
	let r = [];
	for (let t = e.parentElement; t !== null; t = t.parentElement) r.push(t);
	return kJ(r, t) ?? OJ(t);
}
function OJ(e) {
	let t = typeof document > "u" ? null : document.scrollingElement ?? null;
	return t !== null && AJ(t, e) ? t : null;
}
function kJ(e, t) {
	let n = null;
	for (let r of e) if (Mk(r, t)) {
		if (AJ(r, t)) return r;
		n ??= r;
	}
	return n;
}
function AJ(e, t) {
	return t ? e.scrollHeight > e.clientHeight : e.scrollWidth > e.clientWidth;
}
//#endregion
//#region src/effects/effect-registry.ts
var jJ = class {
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
		this.handlers.set(Ni(e), t);
	}
	applyAll(e, t) {
		if (e != null) for (let n of e) this.apply({
			effect: n,
			dom: t
		});
	}
	apply(e) {
		let t = Ni(e.effect?.kind), n = t.length === 0 ? void 0 : this.handlers.get(t);
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
			let t = CJ(e.effect);
			if (t === null) {
				s("navigate effect carries no route.", e.effect);
				return;
			}
			if (!Wg(t)) {
				s("navigate effect names no route of this site; not followed.", e.effect);
				return;
			}
			this.navigate === void 0 ? window.location.assign(t) : this.navigate(t);
		}), this.register("ReplaceAddress", (e) => {
			this.writeAddress(e, (e, t) => e.replace(t));
		}), this.register("PushAddress", (e) => {
			this.writeAddress(e, (e, t) => e.push(t));
		}), this.register("SetTheme", (e) => {
			let t = e.effect, n = Li(t.mode), r = n === "Unknown" ? "auto" : n.toLowerCase();
			document.documentElement.getAttribute("data-ui-theme") !== r && document.documentElement.setAttribute(_r, r), t.stored !== !0 && this.reportTheme?.(r);
		}), this.register("Focus", (e) => {
			let t = IJ(e);
			t !== null && (gV(t), RJ(t));
		}), this.register("ScrollTo", (e) => {
			let t = IJ(e);
			if (t === null) return;
			let n = e.effect, r = Pi(n.behavior), i = Fi(n.block);
			gV(t), t.scrollIntoView({
				behavior: LJ(r),
				block: i === "Unknown" ? "nearest" : i.toLowerCase()
			});
		}), this.register("ScrollToItem", (e) => {
			let t = IJ(e);
			if (t === null) return;
			let n = e.effect, r = nV(t);
			if (r === null || typeof n.key != "string" || n.key.length === 0) {
				s("scroll to item effect names no items host or no key.", e.effect);
				return;
			}
			let i = Fi(n.block);
			gV(Kc(r)), rV(r, n.key, i === "Unknown" ? "Start" : i, LJ(Pi(n.behavior))) || s("scroll to item effect names a row the host has not drawn.", e.effect);
		}), this.register("Scroll", (e) => {
			let t = IJ(e);
			if (t === null) return;
			let n = e.effect, r = Ri(n.axis) !== "Horizontal", i = DJ(t, r);
			if (i === null) {
				s("scroll effect target has no scrollable element.", e.effect);
				return;
			}
			let a = r ? i.clientHeight : i.clientWidth, o = (r ? i.scrollHeight : i.scrollWidth) - a, c = r ? i.scrollTop : i.scrollLeft, l = Ii(n.position), u;
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
			let d = LJ(Pi(n.behavior));
			gV(i), r && l === "End" && bV(i) && hV(i), i.scrollTo(r ? {
				top: u,
				behavior: d
			} : {
				left: u,
				behavior: d
			});
		}), this.register("Show", (e) => {
			FJ(IJ(e), null);
		}), this.register("Hide", (e) => {
			FJ(IJ(e), "hidden");
		}), this.register("Collapse", (e) => {
			FJ(IJ(e), "collapsed");
		}), this.register("CopyToClipboard", (e) => {
			let t = zJ(e, this.valueReaders);
			t !== null && BJ(t).catch((e) => s("copy to clipboard failed.", e));
		}), this.register("InsertText", (e) => {
			let t = IJ(e);
			t !== null && yJ(e.effect, t, e.row ?? []);
		}), this.register("OpenPicker", (e) => {
			let t = IJ(e);
			t !== null && !pg(t) && s("open picker effect names no file or image input.", e.effect);
		}), this.register("OpenDialog", (e) => {
			this.applyDialogEffect(e, "OpenDialog", (e, t) => e.open(t));
		}), this.register("CloseDialog", (e) => {
			this.applyDialogEffect(e, "CloseDialog", (e, t) => e.close(t));
		}), this.register("DownloadFile", (e) => {
			let t = e.effect;
			if (t.requestPath === void 0 || t.requestPath.length === 0) {
				s("download effect carries no path.", e.effect);
				return;
			}
			if (!Bg(t.requestPath)) {
				s("download effect refused: the path's scheme is not one a link may carry.", e.effect);
				return;
			}
			let n = document.createElement("a");
			n.href = t.requestPath, n.download = t.fileName ?? "", n.style.display = "none", document.body.appendChild(n), n.click(), n.remove();
		}), this.register("ShowNotification", (e) => {
			let t = e.effect;
			if (!so(t.message) && !co(t.message)) {
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
				action: this.runAction === void 0 ? void 0 : _J(t.action, this.runAction)
			});
		}), this.register("RequestNotificationPermission", () => {
			Vz() !== void 0 && Notification.requestPermission().then(() => this.clientStateChanged?.()).catch((e) => s("asking for the notification permission failed.", e));
		}), this.register("ShowSystemNotification", (e) => this.showSystemNotification(e.effect)), this.register("Announce", (e) => {
			let t = e.effect;
			if (!so(t.message) && !co(t.message)) {
				s("announce effect carries no message.", e.effect);
				return;
			}
			if (this.notifications === void 0) {
				s("announce effect arrived but no notification engine is wired up.", t.message);
				return;
			}
			this.notifications.announce(t.message, zi(t.politeness) === "Assertive" ? "assertive" : "polite");
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
		if (!so(t) && !co(t)) {
			s("system notification effect carries no title.", e);
			return;
		}
		let n = so(e.body) || co(e.body) ? e.body : void 0, r = typeof e.address == "string" && Wg(e.address) ? e.address : void 0, i = () => {
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
		if (e.when !== "Always" && Bz(document.visibilityState)) {
			i();
			return;
		}
		let a = vJ(e.action);
		Kz({
			title: MJ(t),
			body: n === void 0 ? void 0 : MJ(n),
			tag: e.tag ?? "",
			icon: typeof e.icon == "string" && Wg(e.icon) ? e.icon : NJ(),
			silent: e.silent === !0,
			requireInteraction: e.requireInteraction === !0,
			address: r ?? PJ(),
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
		return t !== void 0 && n !== void 0 && Jz(t) ? {
			label: so(e.addressLabel) || co(e.addressLabel) ? e.addressLabel : { key: "ui.notification.open" },
			run: () => n(t)
		} : this.runAction === void 0 ? void 0 : _J(e.action, this.runAction);
	}
};
function MJ(e) {
	return so(e) ? D.translate(e.key, e.args) : co(e) ? D.resolveText(e.text) : "";
}
function NJ() {
	let e = document.querySelector("link[rel~='icon']")?.href;
	return e === void 0 || e.startsWith("data:") ? void 0 : e;
}
function PJ() {
	return window.location.pathname + window.location.search + window.location.hash;
}
function FJ(e, t) {
	if (e === null) return;
	let n = Qd();
	for (let n of Br) t === null ? e.removeAttribute(n) : e.setAttribute(n, t);
	n !== null && $d(n);
}
function IJ(e) {
	let t = e.effect.target;
	if (t === void 0 || t.id === void 0) return s("targeted client effect carries no resolved component address.", e.effect), null;
	let n = e.dom.findComponent(T(t.id), t.dynamicParameters ?? []);
	return n === null && s("client effect target was not found in the DOM.", e.effect), n;
}
function LJ(e) {
	return e === "Smooth" && !Of() ? "smooth" : "auto";
}
function RJ(e) {
	if (e instanceof HTMLElement && (e.tabIndex >= 0 || e.matches(Vu))) {
		e.focus();
		return;
	}
	let t = ld(e);
	if (t !== null) {
		t.focus();
		return;
	}
	s("focus effect target has nothing focusable.", e);
}
function zJ(e, t) {
	let n = e.effect;
	if (typeof n.text == "string") return n.text;
	let r = IJ(e);
	return r === null ? null : t === void 0 ? (s("copy to clipboard effect names a component but no value reader is wired up.", e.effect), null) : Vs(r) === null ? (s("copy to clipboard effect target holds no value.", e.effect), null) : Fs(t.readHeld(r));
}
async function BJ(e) {
	if (navigator.clipboard !== void 0) try {
		await navigator.clipboard.writeText(e);
		return;
	} catch {}
	if (!VJ(e)) throw Error("neither the clipboard API nor the selection command took the text.");
}
function VJ(e) {
	let t = document.createElement("textarea");
	t.value = e, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.opacity = "0", document.body.appendChild(t), t.select();
	try {
		return YG();
	} finally {
		t.remove();
	}
}
//#endregion
//#region src/interactions/dialog-engine.ts
var HJ = class {
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
		let n = t.querySelector(".ui-dialog__surface") ?? t, r = ld(t), i = nd() && Tc(r);
		i && !n.hasAttribute("tabindex") && (n.tabIndex = -1);
		let a = xd(n, i ? n : r);
		return a !== null && this.returnFocusByKey.set(e, a), UJ(t) && this.swipes.set(e, Dm(n, n, () => this.closeFromViewer(e))), !0;
	}
	close(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (t.hasAttribute("hidden")) return !0;
		let n = this.returnFocusByKey.get(e);
		return this.returnFocusByKey.delete(e), this.swipes.get(e)?.(), this.swipes.delete(e), t.contains(document.activeElement) && Od(wd(n, this.components), t), t.setAttribute("hidden", ""), !0;
	}
	find(e) {
		return this.root.querySelector(`[${Up}="${C(e)}"]`);
	}
	handleClick(e) {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest(`[${Gp}]`);
		if (n === null) return;
		let r = n.closest(`[${Up}]`);
		if (!(r instanceof HTMLElement) || r.hasAttribute("hidden") || !r.hasAttribute("data-ui-dialog-close-backdrop")) return;
		let i = r.getAttribute(Up);
		i !== null && this.closeFromViewer(i);
	}
	handleKeydown(e) {
		if (e.defaultPrevented || j(e)) return;
		let t = this.getTopmostOpen();
		if (!(t === null || Qp(t))) {
			if (e.key === "Escape" && t.hasAttribute("data-ui-dialog-close-escape") && !im() && !gc(e)) {
				let n = t.getAttribute(Up);
				n !== null && (e.preventDefault(), this.closeFromViewer(n));
				return;
			}
			e.key === "Tab" && t.hasAttribute("data-ui-dialog-modal") && md(t, e);
		}
	}
	closeFromViewer(e) {
		let t = this.find(e), n = t !== null && !t.hasAttribute("hidden");
		!this.close(e) || !n || t === null || t.querySelector(S)?.dispatchEvent(new Event("close", { bubbles: !0 }));
	}
	getTopmostOpen() {
		return Xp(this.root);
	}
};
function UJ(e) {
	return e.getAttribute("data-ui-dialog-placement") === "bottom" && (e.hasAttribute("data-ui-dialog-close-backdrop") || e.hasAttribute("data-ui-dialog-close-escape"));
}
//#endregion
//#region src/interactions/leave-dialog.ts
var WJ = "ui-leave", GJ = new E_("data-ui-leave-part"), KJ = "560px", qJ = null, JJ = null;
function YJ(e, t) {
	qJ ??= XJ();
	let n = qJ;
	n.isConnected || document.body.append(n), ZJ(n, "title", D.text("ui.leave.title")), ZJ(n, "message", D.text("ui.leave.message")), ZJ(n, "stay", D.text("ui.leave.stay")), ZJ(n, "leave", D.text("ui.leave.confirm")), JJ = {
		dialogs: e,
		leave: t
	}, e.open(WJ);
}
function XJ() {
	let { dialog: e, surface: t } = T_({
		key: WJ,
		className: "ui-leave-dialog",
		role: "alertdialog",
		labelledBy: "ui-leave-title",
		describedBy: "ui-leave-message",
		closesOnEscapeAndBackdrop: !0
	});
	t.style.setProperty("--ui-max-width-sm", KJ);
	let n = GJ.element("h2", "ui-leave-dialog__title ui-text-type--subtitle", "title"), r = GJ.element("p", "ui-leave-dialog__message ui-text-type--body", "message");
	return n.id = "ui-leave-title", r.id = "ui-leave-message", t.append(n, r, GJ.actions(GJ.button("ui-button--outline", "stay"), GJ.button("ui-button--danger", "leave"))), e.addEventListener("click", (e) => {
		let t = GJ.pressed(e);
		if (t !== "stay" && t !== "leave") return;
		let n = JJ;
		JJ = null, n?.dialogs.close(WJ), t === "leave" && n?.leave();
	}), e;
}
function ZJ(e, t, n) {
	let r = GJ.find(e, t);
	r !== null && r.textContent !== n && (r.textContent = n);
}
//#endregion
//#region src/interactions/leave-guard.ts
var QJ = class {
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
	navigate(e) {
		if (this.deciding || this.released || !this.holds && !this.options.pending()) {
			this.leave(e);
			return;
		}
		this.decideAsync(e);
	}
	confirm(e) {
		this.options.confirm(e, () => this.leave(e));
	}
	leave(e) {
		this.release(), this.options.window.location.assign(e);
	}
	release() {
		this.released = !0, this.options.window.removeEventListener("beforeunload", this.beforeUnload);
	}
	rearm() {
		this.released = !1, this.guards && this.options.window.addEventListener("beforeunload", this.beforeUnload);
	}
	handlePress(e) {
		if (this.released || !this.holds && !this.options.pending()) return;
		let t = $J(e, this.options.window.location.href);
		t !== null && (e.preventDefault(), this.decideAsync(t));
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
function $J(e, t) {
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
	return Wg(s) ? s : null;
}
//#endregion
//#region src/effects/address-history.ts
var eY = class {
	window;
	revisit;
	load;
	route;
	search;
	constructor(e) {
		this.window = e.window, this.revisit = e.revisit, this.load = e.load, this.route = e.window.location.pathname, this.search = e.window.location.search, e.window.addEventListener("popstate", () => this.onPopState());
	}
	replace(e) {
		this.write(wJ(this.route, e), !1);
	}
	push(e) {
		let t = wJ(this.route, e), n = this.window.location;
		this.write(t, t !== `${n.pathname}${n.search}`);
	}
	write(e, t) {
		t ? this.window.history.pushState(null, "", e) : this.window.history.replaceState(null, "", e), this.search = this.window.location.search;
	}
	onPopState() {
		let e = this.window.location;
		if (e.pathname !== this.route) {
			this.load();
			return;
		}
		e.search !== this.search && (this.search = e.search, this.revisit(tY(e.search)));
	}
};
function tY(e) {
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
var nY = class {
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
		!this.state.set(e, t, n, iY(i[0]?.component)) && !this.restoring || o || this.notifyValueChanged({
			reference: e,
			propertyName: i[0]?.propertyName ?? this.addressResolver.getPropertyName(e.propertyId) ?? "",
			dynamicParameters: t,
			value: a,
			local: r,
			components: i.map((e) => e.component)
		});
	}
	shownValue(e, t) {
		return Vo(t, () => this.addressResolver.isTranslatable(e));
	}
	holdsProperty(e, t) {
		if (!this.isHeld(e)) return !1;
		let n = e.getAttribute(qe), r = n === null ? void 0 : this.addressResolver.getBindingById(Number(n));
		return r === void 0 || r.propertyId === t;
	}
	recordValue(e, t, n) {
		let r = this.addressResolver.resolveProperties(e, t);
		return this.state.set(e, t, n, iY(r[0]?.component)) ? {
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
			(typeof n == "string" || co(n) ? this.addressResolver.isTranslatable(t.reference) : so(n)) && (e === void 0 || e(n)) && this.applyPropertyValue(t.reference, t.dynamicParameters, n, !1);
		}
	}
	rewriteStatic(e, t, n) {
		let r = this.addressResolver.resolvePropertyOn(e, t);
		if (r === null) return;
		let i = `[${Ke}${mi(r.propertyName)}]`;
		this.applyOperations(r, this.shownValue(t, n), (t) => _i(e, t, () => rY(e, i)));
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
			Ws(e);
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
function rY(e, t) {
	if (e.matches(t)) return [e];
	for (let n of e.querySelectorAll(t)) if (n.closest(S) === e) return [n];
	return [e];
}
function iY(e) {
	let t = [], n = e?.closest("[data-ui-key]") ?? null;
	for (; n !== null;) {
		let e = n.parentElement?.closest(S) ?? null, r = e === null ? 0 : E(e), i = n.getAttribute(y);
		e !== null && r > 0 && i !== null && t.push({
			host: r,
			hostParameters: qi(e, Ki(e)),
			key: i
		}), n = n.parentElement?.closest("[data-ui-key]") ?? null;
	}
	return t;
}
//#endregion
//#region src/updates/reactive-source-registry.ts
var aY = "EndValue", oY = class {
	watchers = /* @__PURE__ */ new Map();
	sourcesByComponent = /* @__PURE__ */ new Map();
	propertyPatchEngine;
	edits;
	constructor(e, t) {
		if (this.propertyPatchEngine = e, this.edits = t, e.addValueChangeHandler((e) => this.notify(e)), t !== void 0) for (let e of jd) t.root.addEventListener(e, (e) => this.applyEditedValue(e, t), !0);
	}
	watch(e, t) {
		let n = T(e.componentId), r = cY(n, e.propertyId), i = this.watchers.get(r);
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
		let t = this.edits?.root.querySelector(`[data-ui-id="${T(e.componentId)}"]`) ?? null, n = t === null ? null : sY(e, this.edits?.metadata) ? t.querySelector(`[${xt}]`) : Vs(t);
		this.edits !== void 0 && n !== null && this.propertyPatchEngine.recordValue(e, [], this.edits.valueReaders.readBound(n));
	}
	applyEditedValue(e, t) {
		if (!(e.target instanceof Element)) return;
		let n = ea(e.target), r = n === null ? void 0 : this.sourcesByComponent.get(n);
		if (r === void 0) return;
		let i = t.valueReaders.readBound(e.target), a = e.target.hasAttribute(xt);
		for (let e of r) {
			if (t.metadata !== void 0 && sY(e, t.metadata) !== a) continue;
			let n = this.propertyPatchEngine.recordValue(e, [], i);
			n !== null && this.notify(n);
		}
	}
	notify(e) {
		let t = cY(T(e.reference.componentId), e.reference.propertyId), n = this.watchers.get(t);
		if (n !== void 0) for (let t of n) t(e);
	}
};
function sY(e, t) {
	return t?.getPropertyDefinition(e.propertyId)?.propertyName === aY;
}
function cY(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/items/composite-slots.ts
function lY(e) {
	let t = [];
	for (let n of e.children) {
		let e = n.hasAttribute("data-ui-key") ? n.firstElementChild : null, r = e === null ? 0 : E(e);
		e !== null && r > 0 && t.push([e, r]);
	}
	return t;
}
//#endregion
//#region src/items/held-collections.ts
var uY = class {
	collections = /* @__PURE__ */ new Map();
	waiting = /* @__PURE__ */ new WeakMap();
	hold(e, t) {
		this.collections.set(e, dY(t));
	}
	apply(e) {
		let t = T(e.component?.id), n = this.collections.get(t);
		switch (n === void 0 && (n = [], this.collections.set(t, n)), Ai(e.action)) {
			case "Insert":
				for (let t of e.items ?? []) fY(n, t);
				break;
			case "Remove":
				for (let t of e.items ?? []) pY(n, t.key);
				break;
			case "Replace":
				for (let t of e.items ?? []) mY(n, t);
				break;
			case "Move":
				for (let t of e.moves ?? []) hY(n, t.key, t.newIndex);
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
function dY(e) {
	let t = [];
	for (let n of e) typeof n.key == "string" && t.push({
		key: n.key,
		item: n.item
	});
	return t;
}
function fY(e, t) {
	typeof t.key == "string" && (pY(e, t.key), e.splice(gY(t.index, e.length), 0, {
		key: t.key,
		item: t.item
	}));
}
function pY(e, t) {
	let n = e.findIndex((e) => e.key === t);
	n >= 0 && e.splice(n, 1);
}
function mY(e, t) {
	if (typeof t.key != "string") return;
	let n = e.findIndex((e) => e.key === (t.oldKey ?? t.key));
	if (n < 0) {
		fY(e, t);
		return;
	}
	e[n] = {
		key: t.key,
		item: t.item
	};
}
function hY(e, t, n) {
	let r = e.findIndex((e) => e.key === t);
	if (r < 0) return;
	let [i] = e.splice(r, 1);
	e.splice(gY(n, e.length), 0, i);
}
function gY(e, t) {
	return typeof e == "number" && e >= 0 && e < t ? e : t;
}
//#endregion
//#region src/items/item-projections.ts
var _Y = class {
	byHost = /* @__PURE__ */ new Map();
	records = /* @__PURE__ */ new WeakMap();
	reported = /* @__PURE__ */ new Set();
	get isEmpty() {
		return this.byHost.size === 0;
	}
	describe(e, t) {
		this.byHost.set(e, vY(e, "", t.map((e) => e.split("."))));
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
function vY(e, t, n) {
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
	for (let [n, a] of r) i.set(n, a.whole || a.rest.length === 0 ? null : vY(e, `${t}${a.name}.`, a.rest));
	return {
		host: e,
		prefix: t,
		members: i
	};
}
function yY(e) {
	let t = new _Y();
	for (let n of e.metadata.items) n.itemPaths !== null && n.itemPaths !== void 0 && t.describe(T(n.componentId), n.itemPaths);
	return t;
}
//#endregion
//#region src/items/pending-moves.ts
var bY = class {
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
}, xY = class {
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
function SY(e, t) {
	let n = CY(e[t], "Reset");
	if (n === null) return null;
	let r = T(n.component?.id), i = n.component?.dynamicParameters ?? [];
	if (r <= 0) return null;
	let a = null, o = null, s = t + 1;
	for (; s < e.length; s++) {
		let t = CY(e[s], "Insert");
		if (t === null || T(t.component?.id) !== r || !Jd(i, t.component?.dynamicParameters ?? [])) break;
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
function CY(e, t) {
	if (e === void 0 || Mi(e) !== "CollectionChange") return null;
	let n = e;
	return Ai(n.action) === t ? n : null;
}
//#endregion
//#region src/updates/collection-sinks.ts
var wY = class {
	handlers = /* @__PURE__ */ new Map();
	register(e) {
		this.handlers.set(e.kind, e.handler);
	}
	dispatch(e, t) {
		let n = this.handlers.get(e);
		return n !== void 0 && (n(t), !0);
	}
};
function TY(e, t, n, r) {
	return {
		action: Ai(e.action),
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
var EY = [], DY = class {
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
	held = new uY();
	projections;
	moves = new bY({
		indexOf: (e, t) => this.indexOfRow(e, t),
		move: (e, t, n) => this.moveRow(e, t, n)
	});
	transfers = new xY({
		take: (e, t) => this.takeRow(e, t),
		restore: (e, t) => this.restoreRow(e, t),
		place: (e, t, n, r) => this.placeRow(e, t, n, r),
		remove: (e, t) => this.removeRow(e, t),
		holds: (e, t) => NY(H(e), t) !== null,
		itemOf: (e) => this.readItemValue(e)
	});
	constructor(e, t, n, r, i, a, o, s) {
		this.metadata = e, this.propertyPatchEngine = t, this.state = n, this.itemsRenderer = r, this.itemsTemplates = i, this.dom = a, this.virtualization = o, this.sinks = s, r.setRowFiller((e) => this.fillHeldCollections(e)), this.projections = yY(e), this.projections.isEmpty || sC((e, t) => this.projections.check(e, t));
	}
	fillHeldCollections(e) {
		let t = [];
		for (let n of e.querySelectorAll(`[${b}]`)) {
			let e = ea(n);
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
			return n === void 0 && (n = PY(e), t.set(e, n)), n;
		};
		for (let e of this.dom.root.querySelectorAll(`[${b}]`)) {
			let t = ta(e);
			if (t === null) continue;
			let r = this.metadata.getItemValues(t.componentId, t.dynamicParameters);
			this.projections.isEmpty || this.projections.mark(t.componentId, r);
			for (let i of r) this.registerItemValue(t.componentId, n(e), i.key, i.item);
		}
		for (let t of e?.updates ?? []) {
			if (Mi(t) !== "CollectionChange") continue;
			let e = t;
			if (Ai(e.action) !== "Insert") continue;
			let r = T(e.component?.id);
			for (let t of this.findItemsHosts(r, e.component?.dynamicParameters ?? [])) {
				let i = n(t);
				for (let t of e.items ?? []) this.registerItemValue(r, i, t.key, t.item);
			}
		}
	}
	registerItemValue(e, t, n, r) {
		if (n == null) return;
		let i = t.get(n) ?? null;
		if (i !== null && this.readItemScope(i) === void 0 && (this.itemsRenderer.registerItemScope(i, MY(i), r), this.metadata.getItemsTemplateMetadata(e)?.composite != null)) for (let [e, t] of lY(i)) this.itemsRenderer.registerItemScope(e, t, r);
	}
	readItemScope(e) {
		let t = this.itemsRenderer.getItemScope(e);
		if (t !== void 0) return t;
		let n = e.firstElementChild;
		return n === null ? void 0 : this.itemsRenderer.getItemScope(n);
	}
	initializeItemsHosts() {
		for (let e of this.dom.root.querySelectorAll(`[${b}]`)) {
			let t = ea(e);
			t !== null && this.syncItemsHost(e, t);
		}
	}
	resortHost(e) {
		let t = ea(e);
		t !== null && this.syncItemsHost(e, t);
	}
	syncItemsHost(e, t) {
		LR(e, t, {
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
		let n = u() ? performance.now() : -1, r = Qd();
		for (let e = 0; e < t.length; e++) {
			let n = t[e];
			try {
				let r = SY(t, e);
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
		r !== null && $d(r), n >= 0 && d(`applied ${t.length} server update(s)`, n);
	}
	namesSink(e) {
		return this.dom.findComponent(e.componentId, e.dynamicParameters)?.hasAttribute(nt) === !0;
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
		this.transfers.around(e, () => this.moves.around(e, EY, () => this.refillHostRows(e, t)));
	}
	refillHostRows(e, t) {
		if (zS(e) === "virtualized") {
			let n = this.virtualization.refill(e, t.items.filter((e) => e.key !== null && e.key !== void 0).map((e) => ({
				key: e.key,
				item: e.item
			})));
			this.state.forgetRows(t.componentId, t.dynamicParameters, n), this.syncItemsHost(e, t.componentId), this.dom.invalidate();
			return;
		}
		let n = this.itemsRenderer.getAncestorStack(e), r = PY(e), i = [], a = [], o = null;
		for (let e of t.items) {
			let c = e.key ?? null;
			if (c === null) {
				s("collection insert carried no item key.", e);
				continue;
			}
			let l = r.get(c) ?? null;
			if (r.delete(c), l !== null && Jd(this.readItemValue(l), e.item)) {
				i.push(l);
				continue;
			}
			let u = this.renderItemElement(t.componentId, e.item, c, n);
			if (l !== null) {
				let e = Fu(l);
				e !== null && u !== null && (o = {
					row: u,
					held: e
				}), l.remove(), a.push(c);
			}
			u !== null && i.push(u);
		}
		let c = zS(e) === "windowed";
		for (let [t, n] of r) {
			let r = c ? Fu(n) : null;
			n.remove(), Iu(e, null, r), a.push(t);
		}
		if (this.state.forgetRows(t.componentId, t.dynamicParameters, a), jY(e, i), o !== null && Iu(e, o.row, o.held), c) for (let t of i) Lu(e, t);
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
		switch (Mi(e)) {
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
		let t = T(e.address?.component?.id), n = ji(e.address?.property), r = e.address?.component?.dynamicParameters ?? [];
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
		if (T(e.address?.component?.id) <= 0) {
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
		let t = T(e.component?.id);
		if (t <= 0) {
			s("collection change update has an invalid component address.", e);
			return;
		}
		let n = e.component?.dynamicParameters ?? [], r = this.dom.findComponent(t, n), i = r?.getAttribute("data-ui-collection-sink") ?? null;
		if (this.projections.isEmpty || this.projections.mark(t, e.items ?? []), r !== null && i !== null) {
			this.sinks.dispatch(i, TY(e, r, t, n)) || s("no collection sink is registered for the kind the component names.", {
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
			a ? l("a collection change for a host inside an item template is held until a row draws it.", { componentId: t }) : (Ai(e.action) !== "Reset" || (e.items ?? []).length > 0) && s("items host was not found for a collection change update.", e);
			return;
		}
		let c = Ai(e.action) === "Move" ? kY(e.moves ?? []) : EY;
		for (let n of o) a && this.held.isWaiting(n) || this.transfers.around(n, () => this.moves.around(n, c, () => this.applyCollectionChangeToHost(n, t, e)));
	}
	applyCollectionChangeToHost(e, t, n) {
		if (zS(e) === "virtualized") {
			this.applyVirtualizedCollectionChange(e, n), this.afterRowsChanged(e, t);
			return;
		}
		switch (Ai(n.action)) {
			case "Insert":
				this.applyCollectionInsert(e, t, n.items ?? []);
				break;
			case "Remove":
				OY(e, n.items ?? []);
				break;
			case "Replace":
				this.applyCollectionReplace(e, t, n.items ?? []);
				break;
			case "Move":
				AY(e, n.moves ?? []);
				break;
			case "Reset":
				e.replaceChildren(), VC(e);
				break;
			default:
				s("collection update action is not supported.", n);
				return;
		}
		this.afterRowsChanged(e, t);
	}
	afterRowsChanged(e, t = ea(e)) {
		t !== null && this.syncItemsHost(e, t), this.dom.invalidate();
	}
	indexOfRow(e, t) {
		let n = zS(e) === "virtualized" ? this.virtualization.keysOf(e)?.indexOf(t) ?? -1 : FC(e, H(e)).findIndex((e) => e.getAttribute(y) === t);
		return n < 0 ? null : n + BS(e);
	}
	moveRow(e, t, n) {
		let r = ea(e);
		if (r === null) return;
		let i = Math.max(0, n - BS(e));
		zS(e) === "virtualized" ? this.virtualization.move(e, t, i) : AY(e, [{
			key: t,
			newIndex: i
		}]), this.afterRowsChanged(e, r);
	}
	takeRow(e, t) {
		let n = H(e), r = NY(n, t);
		if (r === null) return null;
		let i = FC(e, n), a = i.indexOf(r);
		return RC(i, r), r.remove(), this.afterRowsChanged(e), {
			element: r,
			index: a
		};
	}
	restoreRow(e, t) {
		let n = FC(e, H(e));
		gw(t.element), e.insertBefore(t.element, LC(n, t.element, t.index)), this.afterRowsChanged(e);
	}
	placeRow(e, t, n, r) {
		let i = ea(e), a = i === null ? null : this.renderItemElement(i, n, t, this.itemsRenderer.getAncestorStack(e));
		return a === null ? null : (e.insertBefore(a, LC(FC(e, H(e)), a, r)), this.afterRowsChanged(e), a);
	}
	removeRow(e, t) {
		RC(FC(e, H(e)), t), t.remove(), this.afterRowsChanged(e);
	}
	forgetRowState(e, t, n) {
		switch (Ai(n.action)) {
			case "Remove":
			case "Replace":
				this.state.forgetRows(e, t, (n.items ?? []).map((e) => e.oldKey ?? e.key).filter((e) => typeof e == "string"));
				break;
			case "Reset": this.state.forgetHost(e, t);
		}
	}
	applyVirtualizedCollectionChange(e, t) {
		switch (Ai(t.action)) {
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
			let e = nV(r);
			e !== null && n.push(e);
		}
		return n;
	}
	applyCollectionInsert(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = FC(e, H(e));
		for (let a of n) {
			let n = a.key ?? null;
			if (n === null) {
				s("collection insert carried no item key.", a);
				continue;
			}
			let o = this.renderItemElement(t, a.item, n, r);
			o !== null && (e.insertBefore(o, LC(i, o, a.index ?? null)), Lu(e, o));
		}
	}
	renderItemElement(e, t, n, r) {
		return hU(e, t, n, r, {
			metadata: this.metadata,
			templates: this.itemsTemplates,
			renderer: this.itemsRenderer
		});
	}
	applyCollectionReplace(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = H(e), a = FC(e, i), o = PY(e, i);
		for (let i of n) {
			let n = i.key ?? null;
			if (n === null) {
				s("collection replace carried no item key.", i);
				continue;
			}
			let c = o.get(i.oldKey ?? n) ?? null, l = this.renderItemElement(t, i.item, n, r);
			if (l !== null) {
				if (o.delete(i.oldKey ?? n), o.set(n, l), c !== null) {
					let t = Fu(c);
					BC(a, c, l), c.replaceWith(l), Iu(e, l, t);
				} else e.insertBefore(l, LC(a, l, i.index ?? null));
			}
		}
	}
};
function OY(e, t) {
	let n = H(e), r = FC(e, n), i = PY(e, n), a = Pu(e), o = a === null ? [] : n.filter((e) => e instanceof HTMLElement);
	for (let e of t) {
		let t = e.key ?? null, n = t === null ? null : i.get(t) ?? null;
		if (t === null || n === null) {
			s("collection remove did not resolve an item.", e);
			continue;
		}
		let c = a !== null && n instanceof HTMLElement ? ju(a, o, n) : null;
		i.delete(t), RC(r, n), n.remove();
		let l = o.indexOf(n);
		l >= 0 && o.splice(l, 1), c?.();
	}
}
function kY(e) {
	return e.map((e) => e.key).filter((e) => typeof e == "string");
}
function AY(e, t) {
	let n = H(e), r = FC(e, n), i = PY(e, n);
	for (let n of t) {
		let t = n.key === null || n.key === void 0 ? null : i.get(n.key) ?? null;
		if (t === null) {
			s("collection move did not resolve an item.", n);
			continue;
		}
		let a = zC(r, t, n.newIndex ?? null);
		e.insertBefore(t, a ?? r[r.length - 2]?.nextSibling ?? null);
	}
}
function jY(e, t) {
	let n = null;
	for (let r of t) {
		let t = n === null ? H(e)[0] ?? null : n.nextElementSibling;
		r !== t && e.insertBefore(r, t), n = r;
	}
}
function MY(e) {
	let t = E(e);
	if (t > 0) return t;
	let n = e.firstElementChild;
	return n === null ? 0 : E(n);
}
function NY(e, t) {
	return e.find((e) => e.getAttribute("data-ui-key") === t) ?? null;
}
function PY(e, t = H(e)) {
	let n = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.getAttribute(y);
		t !== null && !n.has(t) && n.set(t, e);
	}
	return n;
}
//#endregion
//#region src/interactions/validation-words.ts
function FY(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = t.message;
	return so(n) || co(n) || typeof n == "string" && n.length > 0 ? {
		message: n,
		severity: LY(t.severity)
	} : void 0;
}
function IY(e) {
	let t = e.message;
	if (e.content === !0) return String(t ?? "");
	let n = D.resolve(so(t) || co(t) ? t : String(t ?? ""), !0);
	return typeof n == "string" ? n : "";
}
function LY(e) {
	let t = Di(e);
	return t === "Unknown" ? "Error" : t;
}
//#endregion
//#region src/interactions/validation-engine.ts
var RY = "ui-validation--warning", zY = "ui-validation--info", BY = "ui-validation-message--marker", VY = "top-end", HY = "right", UY = "--ui-validation-marker-host", WY = "ui-validation-mark", GY = "--ui-validation-presentation", KY = "--ui-validation-color", qY = "Validation", JY = /* @__PURE__ */ new Set(["Value", "EndValue"]), YY = /* @__PURE__ */ new Set(["Min", "Max"]), XY = `input:not([type='hidden']), textarea, select, .${$r}[role='combobox'], [role='spinbutton']`, ZY = {
	Error: 0,
	Warning: 1,
	Info: 2
}, QY = {
	Error: di,
	Warning: RY,
	Info: zY
}, $Y = `.${di}, .${RY}, .${zY}`, eX = {
	Error: "danger",
	Warning: "warning",
	Info: "info"
}, tX = {
	Error: "error",
	Warning: "warning",
	Info: "info"
}, nX = {
	Error: `${WY}--error`,
	Warning: `${WY}--warning`,
	Info: `${WY}--info`
}, rX = {
	error: "Error",
	warning: "Warning",
	info: "Info"
}, iX = class {
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
		}, !0), this.applyRenderedMessages(this.root.querySelectorAll($Y)), B(this.root, $Y, { childList: !0 }, (e) => this.applyRenderedMessages(e)), D.onChange(() => {
			this.applyRenderedMessages(this.root.querySelectorAll($Y)), this.rewriteMessageLines(), this.rejudgeBounds();
		}), D.onTable(() => this.rewriteShownMessages());
	}
	rewriteShownMessages() {
		for (let e of this.root.querySelectorAll($Y)) {
			let t = E(e);
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
			lX(t, sX(t) === "Error");
			let e = t.querySelector(`:scope > [${fi}]`), n = e?.textContent ?? "";
			e !== null && n.length !== 0 && (this.recordRenderedMessage(t, e), uX(this.markerMirrors, t, e, {
				message: n,
				severity: sX(t)
			}));
		}
	}
	recordRenderedMessage(e, t) {
		if (this.renderedRead.has(e) || (this.renderedRead.add(e), this.resolveDisplay(E(e), e) !== void 0)) return;
		let n = Lo(t), r = sX(e);
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
		if (e.propertyName === qY) {
			this.applyBoundMessage(e);
			return;
		}
		this.applyGivenValue(e), this.applyChangeTrigger(e);
	}
	applyGivenValue(e) {
		let t = JY.has(e.propertyName), n = YY.has(e.propertyName);
		for (let r of e.components) {
			let i = this.refusalByElement.get(r)?.property === e.propertyName, a = this.boundRefusalByElement.has(r);
			if (a && n) {
				this.judgeBounds(E(r), r);
				continue;
			}
			!i && !(a && t) || (i && this.refusalByElement.delete(r), t && this.forgetBoundRefusal(r), this.applyCurrentState(E(r), r));
		}
	}
	applyBoundMessage(e) {
		let t = T(e.reference.componentId), n = FY(e.value);
		for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) n === void 0 ? this.boundMessageByElement.delete(r) : this.boundMessageByElement.set(r, n), this.touchedElements.add(r), this.applyCurrentState(t, r);
	}
	applyChangeTrigger(e) {
		let t = T(e.reference.componentId), n = this.options.metadata.getValidationsForComponent(t).filter((t) => Ei(t.trigger) === "Change" && t.target.propertyId === e.reference.propertyId);
		if (n.length !== 0) for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) this.evaluateAndApply(t, r, n, e.value);
	}
	applyServerRefusal(e) {
		let t = T(e.address?.component?.id), n = e.address?.component?.dynamicParameters ?? [], r = e.message ?? "", i = so(r) || typeof r == "string" && r.length > 0;
		for (let a of this.options.dom.findAllComponents(t, n)) i ? (this.refusalByElement.set(a, {
			message: r,
			severity: LY(e.severity),
			content: e.content === !0,
			property: ji(e.address?.property)
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
		let n = A(t) || O(t) ? null : aX(t, (e) => this.readValue(e)), r = this.boundRefusalByElement.get(t)?.message;
		return oX(r, n) ? n !== null : (n === null ? this.forgetBoundRefusal(t) : (this.boundRefusalByElement.set(t, {
			message: n,
			severity: "Error"
		}), this.boundRefused.add(t), this.touchedElements.add(t), this.refusalByElement.delete(t)), this.applyCurrentState(e, t), n !== null);
	}
	readValue(e) {
		return this.options.readValue?.(e) ?? this.options.valueReaders.readBound(e);
	}
	readRuleValue(e) {
		let t = Vs(e);
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
			severity: rX[t]
		}), this.applyCurrentState(E(e), e);
	}
	entryRefusal(e, t, n) {
		for (let r of this.options.metadata.getValidationsForComponent(E(e))) if (LY(r.severity) === "Error" && mf(t, r.operator, r.value) && !mf(n, r.operator, r.value)) return r.message;
		return null;
	}
	judge(e, t) {
		let n = null;
		for (let r of this.options.metadata.getValidationsForComponent(e)) !mf(t, r.operator, r.value) && (n === null || ZY[LY(r.severity)] < ZY[LY(n.severity)]) && (n = r);
		return n === null ? null : {
			severity: tX[LY(n.severity)],
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
		cX(this.markerMirrors, t, n), this.writeMessageElsewhere(e, t, n);
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
		}, [], [...e.lines.values()].map(IY).join("\n"), !0);
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
			severity: LY(t.severity)
		});
		let c;
		for (let e of n) (c === void 0 || ZY[e.severity] < ZY[c.severity]) && (c = e);
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
		let r = this.options.metadata.getValidationsForComponent(n.componentId).filter((e) => Ei(e.trigger) === t);
		r.length !== 0 && this.evaluateAndApply(n.componentId, n.element, r, this.readRuleValue(n.element));
	}
	runSubmitValidation(e) {
		let t = !0, n = /* @__PURE__ */ new Set();
		for (let { component: r } of this.formFields(e)) {
			if (n.has(r.element)) continue;
			n.add(r.element);
			let e = this.options.metadata.getValidationsForComponent(r.componentId).filter((e) => Ei(e.trigger) === "Submit");
			e.length > 0 && (this.touchedElements.add(r.element), this.evaluateAndApply(r.componentId, r.element, e, this.readRuleValue(r.element))), this.hasError(r.componentId, r.element) && (t = !1, this.touchedElements.has(r.element) || (this.touchedElements.add(r.element), this.applyCurrentState(r.componentId, r.element)));
		}
		return t;
	}
	*formFields(e) {
		for (let t of this.root.querySelectorAll(`[${zt}="${C(e)}"]`)) {
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
			let e = [...t.element.querySelectorAll(XY)].find((e) => e.closest("[role='listbox'], [role='menu'], [role='dialog']") === null) ?? null;
			if (e !== null) return e.focus({ preventScroll: !0 }), e.scrollIntoView({
				block: "center",
				behavior: Of() ? "auto" : "smooth"
			}), !0;
		}
		return !1;
	}
	hasError(e, t) {
		if (this.boundRefusalByElement.has(t) || this.refusalByElement.get(t)?.severity === "Error") return !0;
		let n = this.failingRulesByElement.get(t);
		if (n === void 0) return !1;
		for (let t of this.options.metadata.getValidationsForComponent(e)) if (n.has(t) && LY(t.severity) === "Error") return !0;
		return !1;
	}
	evaluateAndApply(e, t, n, r) {
		let i = this.failingRulesByElement.get(t);
		i === void 0 && (i = /* @__PURE__ */ new Set(), this.failingRulesByElement.set(t, i));
		for (let e of n) mf(r, e.operator, e.value) ? i.delete(e) : i.add(e);
		this.touchedElements.has(t) && this.applyCurrentState(e, t);
	}
};
function aX(e, t) {
	return MS(e, t) ?? (e.matches(Zw) ? GT(e) : null);
}
function oX(e, t) {
	return e === void 0 || t === null ? e === void 0 && t === null : so(e) && e.key === t.key && JSON.stringify(e.args) === JSON.stringify(t.args);
}
function sX(e) {
	return e.classList.contains(RY) ? "Warning" : e.classList.contains(zY) ? "Info" : "Error";
}
function cX(e, t, n) {
	for (let e of Object.values(QY)) t.classList.toggle(e, n !== void 0 && QY[n.severity] === e);
	lX(t, n?.severity === "Error");
	let r = t;
	n === void 0 ? r.style.removeProperty(KY) : r.style.setProperty(KY, `var(--ui-color-${eX[n.severity]}-ink)`);
	let i = t.querySelector(":scope > [data-ui-validation-message]") ?? t.querySelector("[data-ui-validation-message]");
	i !== null && (n?.content === !0 ? (Fo(i, null), i.textContent = String(n.message ?? "")) : D.writeValue(i, null, n?.message ?? null), uX(e, r, i, n));
}
function lX(e, t) {
	for (let n of e.querySelectorAll(XY)) {
		let r = n.closest(Qr);
		r !== null && e.contains(r) || (t ? n.setAttribute("aria-invalid", "true") : n.removeAttribute("aria-invalid"));
	}
}
function uX(e, t, n, r) {
	let i = getComputedStyle(n), a = i.getPropertyValue(GY).trim(), o = r !== void 0 && a === "marker";
	if (n.classList.toggle(BY, o), dX(e, t, a === "elsewhere" ? void 0 : r, n.textContent ?? "", i.getPropertyValue(UY).trim()), r !== void 0 && o) {
		n.setAttribute(Ie, n.textContent ?? ""), n.setAttribute(Le, VY), n.setAttribute(ze, tX[r.severity]), t.setAttribute(Re, ""), t.contains(document.activeElement) ? oM(n) : sM(n);
		return;
	}
	n.removeAttribute(Ie), n.removeAttribute(Le), n.removeAttribute(ze), t.removeAttribute(Re), sM(n);
}
function dX(e, t, n, r, i) {
	let a = e.get(t), o = n === void 0 || i.length === 0 ? null : pX(t, i);
	if (n === void 0 || o === null) {
		a !== void 0 && fX(a), e.delete(t);
		return;
	}
	let s = a ?? document.createElement("span");
	s.className = `${WY} ${nX[n.severity]}`, s.textContent = r, s.setAttribute(Ie, r), s.setAttribute(Le, HY), s.setAttribute(ze, tX[n.severity]), s.setAttribute(Be, ""), s.parentElement !== o && (fX(s), o.append(s)), o.setAttribute(Re, ""), e.set(t, s), sM(s);
}
function fX(e) {
	let t = e.parentElement;
	e.remove(), t !== null && t.querySelector(`:scope > .${WY}`) === null && t.removeAttribute(Re);
}
function pX(e, t) {
	for (let n = e.parentElement; n !== null; n = n.parentElement) {
		let e = n.querySelector(`:scope > .${t}`);
		if (e !== null) return e;
	}
	return null;
}
//#endregion
//#region src/items/row-decorators.ts
var mX = class {
	decorators = /* @__PURE__ */ new Map();
	register(e) {
		this.decorators.set(e.kind, e.decorate);
	}
	get(e) {
		return this.decorators.get(e);
	}
}, hX = "card-header-shown", gX = `[${ii}], [${ai}], [${oi}], [${si}], [${ci}]`;
function _X(e) {
	let t = e.parentElement?.parentElement;
	if (t == null || !t.classList.contains("ui-card__header")) return;
	let n = !e.matches(gX);
	t.classList.contains("ui-card__header--empty") !== n && t.classList.toggle(li, n);
}
//#endregion
//#region src/updates/content-fills.ts
var vX = "content-fills", yX = "content", bX = "data-ui-root", xX = "--ui-height", SX = "var(--ui-fill-height";
function CX(e) {
	let t = e.parentElement;
	if (t === null || t.getAttribute("data-ui-region") !== yX) return;
	let n = t.parentElement;
	if (n === null || !n.hasAttribute(bX)) return;
	let r = e.style.getPropertyValue(xX).trimStart().startsWith(SX);
	n.hasAttribute("data-ui-content-fills") !== r && n.toggleAttribute(un, r);
}
//#endregion
//#region src/updates/menu-surface.ts
var wX = "menu-surface";
function TX(e) {
	let t = e.parentElement;
	if (t === null || !t.matches(".ui-context-menu, .ui-split-button__menu")) return;
	let n = qK(e);
	n === null ? t.removeAttribute(Xt) : t.getAttribute("data-ui-menu-surface") !== n && t.setAttribute(Xt, n);
}
//#endregion
//#region src/updates/tooltip-name.ts
var EX = "tooltip-name";
function DX(e, t, n) {
	let r = wA(e.getAttribute(Ie));
	if (Fo(t, n), r.trim().length === 0) {
		t.hasAttribute(n) && t.removeAttribute(n);
		return;
	}
	t.getAttribute(n) !== r && t.setAttribute(n, r);
}
//#endregion
//#region src/updates/dom-operation-registry.ts
var OX = /* @__PURE__ */ new WeakMap(), kX = /* @__PURE__ */ new WeakMap(), AX = class {
	handlers = /* @__PURE__ */ new Map();
	constructor() {
		this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(Oi(e), t);
	}
	apply(e) {
		let t = Oi(e.operation.kind), n = this.handlers.get(t);
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
			let t = Fs(e.convertedValue);
			e.target.textContent !== t && (e.target.textContent = t), Fo(e.target, null);
		}), this.register("Markup", (e) => {
			EA(e.target, Is(e.convertedValue) ? "" : Fs(e.convertedValue)), Fo(e.target, null);
		}), this.register("Attribute", (e) => {
			let t = RX(e.operation);
			if (Fo(e.target, t), e.operation.convertsNull !== !0 && Is(e.value) || Is(e.convertedValue)) {
				LX(e.target, t);
				return;
			}
			IX(e.target, t, Fs(e.convertedValue));
		}), this.register("RemoveAttribute", (e) => {
			let t = RX(e.operation);
			Fo(e.target, t), LX(e.target, t);
		}), this.register("ToggleAttribute", (e) => {
			let t = RX(e.operation), n = e.operation.condition ?? "HasValue", r = !Is(e.value) && jX(e.value, n), i = e.operation.value ?? (Is(e.convertedValue) || MX(n) ? "" : Fs(e.convertedValue));
			NX(e.target, FX(e), t, r, i);
		}), this.register("Class", (e) => {
			let t = !Is(e.value) && jX(e.value, e.operation.condition ?? "None") ? Fs(e.convertedValue).trim() : "";
			PX(e.target, FX(e), t, VK(e.operation.converter ?? ""));
		}), this.register("ToggleClass", (e) => {
			let t = RX(e.operation), n = !Is(e.value) && jX(e.value, e.operation.condition ?? "IsTrue");
			if (e.target.classList.toggle(t, n), e.operation.converter !== null && e.operation.converter !== void 0 && e.operation.converter.trim().length > 0) {
				let t = n ? Fs(e.convertedValue).trim() : "";
				PX(e.target, FX(e), t, VK(e.operation.converter));
			}
		}), this.register("Style", (e) => {
			let t = RX(e.operation), n = e.target;
			if (Is(e.value) || Is(e.convertedValue) || e.convertedValue === "") {
				n.style.getPropertyValue(t).length > 0 && n.style.removeProperty(t);
				return;
			}
			let r = Fs(e.convertedValue);
			n.style.getPropertyValue(t) !== r && n.style.setProperty(t, r);
		}), this.register("Data", () => {}), this.register(EX, (e) => DX(e.resolved.component, e.target, RX(e.operation))), this.register(VG, (e) => WG(e.target, e.value)), this.register(hX, (e) => _X(e.resolved.component)), this.register(Ho, (e) => Uo(e.target)), this.register(vX, (e) => CX(e.target)), this.register(vO, (e) => bO(e.target)), this.register(CO, (e) => EO(e.resolved.component)), this.register(wX, (e) => TX(e.target)), this.register("Property", (e) => {
			let t = RX(e.operation), n = e.target, r = Is(e.convertedValue) ? "" : e.convertedValue;
			n[t] !== r && (n[t] = r);
		});
	}
};
function jX(e, t) {
	switch (ki(t)) {
		case "None": return !0;
		case "HasValue": return !Is(e);
		case "HasText": return typeof e == "string" ? e.trim().length > 0 : !Is(e) && String(e).trim().length > 0;
		case "IsTrue": return e === !0;
		case "IsFalse": return e === !1;
		case "DrawsIcon": return l_(e).length > 0;
		default: return !Is(e);
	}
}
function MX(e) {
	let t = ki(e);
	return t === "IsTrue" || t === "IsFalse";
}
function NX(e, t, n, r, i) {
	let a = kX.get(e);
	a === void 0 && (a = /* @__PURE__ */ new Map(), kX.set(e, a));
	let o = a.get(n);
	if (o === void 0 && (o = /* @__PURE__ */ new Set(), a.set(n, o)), r) {
		o.add(t), IX(e, n, i);
		return;
	}
	o.delete(t), o.size === 0 && LX(e, n);
}
function PX(e, t, n, r) {
	let i = OX.get(e);
	i === void 0 && (i = /* @__PURE__ */ new Map(), OX.set(e, i));
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
function FX(e) {
	return `${e.resolved.componentId}:${e.resolved.propertyId}:${e.operation.kind}:${e.operation.name ?? ""}:${e.operation.converter ?? ""}`;
}
function IX(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function LX(e, t) {
	e.hasAttribute(t) && e.removeAttribute(t);
}
function RX(e) {
	let t = e.name;
	if (t == null || t.trim().length === 0) throw Error(`Operation '${e.kind}' requires a name.`);
	return t;
}
//#endregion
//#region src/extensions/converters.ts
var zX = class {
	converters = /* @__PURE__ */ new Map();
	constructor() {
		this.register({
			name: "*",
			canConvert: (e) => KK.has(e.name),
			convert: (e) => KK.get(e.name)(e.value)
		});
	}
	register(e) {
		let t = BX(e.name), n = {
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
function BX(e) {
	let t = e.trim();
	if (t.length === 0) throw Error("Converter name is required.");
	return t;
}
//#endregion
//#region src/extensions/events.ts
var VX = class {
	definitions = /* @__PURE__ */ new Map();
	register(e) {
		let t = Bi(e.name);
		if (t.length === 0) throw Error("Event name is required.");
		let n = Bi(e.domEventName) || t;
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
		return this.definitions.get(Bi(e));
	}
};
function HX(e, t) {
	e.root.addEventListener("toggle", (n) => {
		n.target instanceof HTMLDetailsElement && n.target.open === t && e.dispatch(n);
	}, !0);
}
function UX(e) {
	e.register({
		name: "click",
		attach: (e) => {
			e.root.addEventListener("click", e.dispatch, !0), e.root.addEventListener(ku, e.dispatch, !0);
		}
	}), e.registerNative("change"), e.registerNative("focus"), e.registerNative("blur"), e.registerNative("mouse-enter", "mouseenter"), e.registerNative("mouse-leave", "mouseleave"), e.registerNative("toggle"), e.register({
		name: "expand",
		domEventName: "toggle",
		attach: (e) => HX(e, !0)
	}), e.register({
		name: "collapse",
		domEventName: "toggle",
		attach: (e) => HX(e, !1)
	}), e.registerNative("open"), e.registerNative("close"), e.registerNative("search"), e.registerNative("enter"), e.registerNative("escape"), e.registerNative("rename"), e.registerNative("unfold"), e.registerNative("move"), e.registerNative("remove");
}
//#endregion
//#region src/extensions/extension-registry.ts
var WX = class {
	converters = new zX();
	events = new VX();
	operations = new AX();
	valueReaders;
	collectionSinks = new wY();
	rowDecorators = new mX();
	constructor(e, t, n, r) {
		UX(this.events), this.valueReaders = new Rs(r);
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
}, GX = "Submenu", KX = "ui-menu__submenu", qX = "Select", JX = ["Header", "Separator"], YX = {
	kind: "menu",
	decorate: XX
};
function XX(e) {
	if (JX.includes(QX(e.item, "Kind")) && e.row.setAttribute(Jt, ""), !ZX(e.item)) return;
	let t = e.templates.getVariantTemplate(e.componentId, GX);
	if (t === void 0) {
		s("menu submenu template was not found.", { componentId: e.componentId });
		return;
	}
	let n = e.renderer.renderFromTemplate(t, e.item, e.ancestors);
	if (n === null) return;
	e.row.setAttribute(Ut, ""), QX(e.item, "Kind") === qX && e.row.setAttribute(Wt, ""), QX(e.item, "Expanded") === !0 && e.row.setAttribute(Gt, "");
	let r = document.createElement("div");
	r.className = KX, r.appendChild(n), NH(r, e.key, e.item), e.row.appendChild(r);
}
function ZX(e) {
	let t = QX(e, "Items");
	return Array.isArray(t) && t.length > 0;
}
function QX(e, t) {
	let n = mC(e, t);
	return n.ok ? n.value : void 0;
}
//#endregion
//#region src/items/row-grip.ts
var $X = {
	kind: "grip",
	decorate: eZ
};
function eZ(e) {
	e.row.append(tZ());
}
function tZ() {
	let e = document.createElement("span");
	return e.className = _e, e.setAttribute("role", "button"), D.write(e, "aria-label", "ui.row.drag"), e;
}
//#endregion
//#region src/rendering/page-culture.ts
function nZ(e, t, n) {
	let r = t === null ? null : JSON.stringify(t), i = n === null ? null : JSON.stringify(iZ(n));
	for (let t of e.querySelectorAll(`[${at}]`)) rZ(t, it, r), rZ(t, lt, i);
}
function rZ(e, t, n) {
	n !== null && e.hasAttribute(t) && e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function iZ(e) {
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
var aZ = 2;
function oZ(e, t, n) {
	let r = u() ? performance.now() : -1;
	try {
		t(n);
	} catch (t) {
		c(`the ${e} engine failed to start; the page goes on without it.`, t);
	}
	if (r >= 0) {
		let t = performance.now() - r;
		t >= aZ && l(`the ${e} engine took ${f(t)} to start.`);
	}
}
function sZ(e) {
	return e.name.length > 0 ? `"${e.name}" package` : "package";
}
//#endregion
//#region src/runtime/web-ui-runtime.ts
var cZ = "ne.standard.ui.windowId", lZ = [
	500,
	1e3,
	2e3
], uZ = 3, dZ = [
	["refusal", ({ root: e }) => tH(e)],
	["file input", ({ root: e, validation: t }) => new xg({
		root: e,
		validation: t
	})],
	["image input", ({ root: e, validation: t, propertyPatchEngine: n, dialogs: r }) => new Ev({
		root: e,
		validation: t,
		propertyPatchEngine: n,
		dialogs: r
	})],
	["key value action", ({ root: e, dom: t, propertyPatchEngine: n, validation: r }) => new Hv({
		root: e,
		dom: t,
		propertyPatchEngine: n,
		validation: r
	})],
	["field keys", ({ root: e, propertyPatchEngine: t }) => new py({
		root: e,
		propertyPatchEngine: t
	})],
	["field box press", ({ root: e }) => new Qv({ root: e })],
	["image fallback", ({ root: e }) => new xy({ root: e })],
	["radio group sync", ({ root: e }) => new Py({ root: e })],
	["select interaction", ({ root: e, validation: t }) => new Ub({
		root: e,
		validation: t
	})],
	["search input", ({ root: e }) => new Gy({ root: e })],
	["debounced commit", ({ root: e }) => new oy({ root: e })],
	["commit gate", ({ root: e, propertyPatchEngine: t }) => new nx({
		root: e,
		propertyPatchEngine: t
	})],
	["text area grow", ({ root: e, propertyPatchEngine: t }) => ax() ? void 0 : new ox({
		root: e,
		propertyPatchEngine: t
	})],
	["items selection", ({ root: e, heldRows: t }) => new rz({
		root: e,
		rows: t
	})],
	["range value", ({ root: e, propertyPatchEngine: t }) => new Nx({
		root: e,
		propertyPatchEngine: t
	})],
	["color input", ({ root: e, propertyPatchEngine: t }) => new aL({
		root: e,
		propertyPatchEngine: t
	})],
	["temporal picker", ({ root: e, propertyPatchEngine: t }) => new GE({
		root: e,
		propertyPatchEngine: t
	})],
	["theme switcher", ({ root: e, effects: t, dom: n }) => new _D({
		root: e,
		effects: t,
		dom: n
	})],
	["language switcher", ({ root: e, effects: t, dom: n }) => new FD({
		root: e,
		effects: t,
		dom: n
	})],
	["time segment", ({ root: e, propertyPatchEngine: t }) => new IB({
		root: e,
		propertyPatchEngine: t
	})],
	["timestamp", ({ root: e, propertyPatchEngine: t }) => new $B({
		root: e,
		propertyPatchEngine: t
	})],
	["context menu", ({ root: e, dom: t }) => new pk({
		root: e,
		dom: t
	})],
	["split button", ({ root: e }) => new hF({ root: e })],
	["toggle button", ({ root: e }) => new Yv({ root: e })],
	["button group", ({ root: e }) => new xF({ root: e })],
	["menu", ({ root: e }) => new gM({ root: e })],
	["action bar", ({ root: e, dom: t }) => new Yk({
		root: e,
		dom: t
	})],
	["collapsible", ({ root: e }) => new oP({ root: e })],
	["menu group", ({ root: e }) => new HO({ root: e })],
	["menu search", ({ root: e }) => new DN({ root: e })],
	["side drawer", ({ root: e }) => new KN({ root: e })],
	["screen keyboard", () => new LN()],
	["grid splitter", ({ root: e }) => new bP({ root: e })],
	["pane container", ({ root: e }) => new GP({ root: e })],
	["accordion", ({ root: e }) => new TF({ root: e })],
	["tabs", ({ root: e }) => new XF({ root: e })],
	["tabs view", ({ root: e, effects: t }) => new mB({
		root: e,
		effects: t
	})],
	["command bar", ({ root: e }) => new uI({ root: e })],
	["breadcrumbs", ({ root: e }) => new wI({ root: e })],
	["scroll anchor", ({ root: e }) => new _V({ root: e })],
	["surface press", ({ root: e }) => new EL({ root: e })],
	["text selection", ({ root: e }) => new wV({ root: e })],
	["scroll group", ({ root: e }) => new jV({ root: e })],
	["flyout interaction", ({ root: e }) => new Dh({ root: e })],
	["text fold", ({ root: e }) => new DB({ root: e })],
	["tooltip", ({ root: e }) => vj(e)]
], fZ = class {
	windowId;
	options;
	root;
	culturesLanguage = document.documentElement.lang;
	metadata = new yi(zU());
	hydration = UU();
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
	clientState;
	reactiveSources;
	attachTask = null;
	reattachRequested = !1;
	connectionLost = !1;
	connection;
	heldRuntime = null;
	inbound = null;
	enginesAwaitingHydration = [];
	languageSwitches = 0;
	themeColorChanges = 0;
	numberInputs = null;
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.windowId = gZ(e.windowIdStorageKey ?? cZ), this.dom = new $i(this.root), D.load(this.root), D.setLanguage(document.documentElement.lang), e.strings !== void 0 && D.register(e.strings), this.gateInbound(this.hydration?.words === null || this.hydration?.words === void 0 ? null : D.loadTableAsync(this.hydration.words.href)), this.extensions = new WX(e.converters, e.eventDefinitions, e.domOperations, e.valueReaders), this.extensions.registerRowDecorator(YX), this.extensions.registerRowDecorator($X), this.extensions.registerRowDecorator(Dy);
		let t = new Gi(this.dom, this.metadata), n = this.extensions.operations, r = new vW(), i = new nY(t, n, this.extensions, r);
		this.reactiveSources = new oY(i, {
			root: this.root,
			valueReaders: this.extensions.valueReaders,
			metadata: this.metadata
		}), this.dialogs = new HJ({
			root: this.root,
			dom: this.dom
		}), this.notifications = new fJ({
			root: this.root,
			dom: this.dom
		});
		let a = new eY({
			window,
			revisit: (e) => void this.navigateInPlaceAsync(e),
			load: () => window.location.reload()
		}), o = (e) => this.eventPipeline.dispatchCommandAsync({
			eventId: 0,
			action: e,
			dynamicParameters: []
		}).catch((e) => (s("running a notification's action failed.", e), !1)), u = (e) => qz(e, (e) => this.leaveGuard.navigate(e), (e) => void o(e)), d = XU(document.documentElement, this.windowId, u);
		this.effects = new jJ({
			address: a,
			dialogs: this.dialogs,
			notifications: this.notifications,
			runAction: o,
			valueReaders: this.extensions.valueReaders,
			reportTheme: (e) => void this.transport.setThemeAsync(e).catch((e) => s("reporting the theme to the session failed.", e)),
			navigate: (e) => this.leaveGuard.navigate(e),
			clientStateChanged: () => this.clientState.changed(),
			windowId: this.windowId,
			followNotificationClick: u,
			systemNotifications: Gz(d)
		});
		let f = new Sf(this.metadata), p, m = new cf(f, i, new pf(), {
			root: this.root,
			effects: this.effects,
			dom: this.dom,
			metadata: this.metadata,
			valueReaders: this.extensions.valueReaders,
			writeBack: (e, t, n) => {
				p?.syncPropertyAsync(T(e.componentId), e.propertyId, t, n).catch((e) => s("writing an interaction's value back failed.", e));
			}
		}), h = new FU(this.dom), g = new kH(this.metadata, h, this.extensions, n, r);
		this.virtualization = new yU({
			root: this.root,
			metadata: this.metadata,
			templates: h,
			renderer: g,
			state: r,
			dom: this.dom
		}), this.updateProcessor = new DY(this.metadata, i, r, g, h, this.dom, this.virtualization, this.extensions.collectionSinks), D.onChange(() => this.rewriteWords(i, g)), this.rewriteMoments = () => this.rewriteWords(i, g, !0), D.onMomentTick(this.rewriteMoments), new BH({
			root: this.root,
			metadata: this.metadata,
			templates: h,
			renderer: g,
			state: r,
			propertyPatchEngine: i,
			reactiveSources: this.reactiveSources,
			virtualization: this.virtualization
		}), this.transport = new MG(this.windowId, (e, t) => this.applyChanges(e, t), e.signalR), this.clientState = new Wz({ report: (e) => this.transport.reportClientStateAsync(e) }), this.dispatcher = new pW(this.transport), D.setAsker((e, t) => this.transport.translateAsync(e, t)), this.effects.register(vi.SetLanguage, (e) => {
			let t = e.effect, n = t.language;
			if (typeof n != "string" || n.trim().length === 0) {
				s("set language effect carries no language.", e.effect);
				return;
			}
			let r = typeof t.href == "string" && t.href.length > 0 ? t.href : null;
			this.switchLanguageAsync(n, r).catch((e) => s("switching the page's language failed.", e));
		}), this.effects.register(vi.SetThemeColors, (e) => {
			let t = e.effect, n = ++this.themeColorChanges;
			if (typeof t.css == "string") {
				LU(document.head, t.css);
				return;
			}
			this.transport.setThemeColorsAsync(t.colors ?? null).then((e) => {
				n === this.themeColorChanges && LU(document.head, e);
			}).catch((e) => s("applying the reader's colours failed.", e));
		});
		let ee = new LG(this.transport);
		p = new Id({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: ee,
			valueReaders: this.extensions.valueReaders,
			recordSent: (e, t, n) => i.recordValue(e, t, n),
			refuses: (e) => _.refusesBounds(e)
		}), i.setHeldTargets((e) => p?.isHeld(e) === !0), this.effects.register(vi.DiscardForm, (e) => {
			let t = e.effect.formId;
			if (typeof t == "string" && t.length !== 0) {
				for (let n of p?.releaseForm(t) ?? []) i.restoreBoundValue(n, e.dom.resolveNearestComponent(n, () => !0)?.dynamicParameters ?? []);
				_.discardForm(t);
			}
		}), this.leaveGuard = new QJ({
			window,
			ask: async (e) => (await p?.whenSent(), (await this.transport.requestLeaveAsync(e)).command?.effects),
			apply: (e) => {
				this.effects.applyAll(e, this.dom), this.windows.reconsider();
			},
			confirm: (e, t) => YJ(this.dialogs, t),
			pending: () => ry() || ee.isBusy,
			settle: async () => {
				iy(), await ee.whenAnsweredAsync();
			}
		}), this.updateProcessor.addPageHandler((e) => this.leaveGuard.set(e.holdsUnsavedWork === !0)), this.effects.register(vi.ConfirmLeave, (e) => {
			let t = e.effect.target;
			if (!Wg(t)) {
				s("confirm leave effect names no address of this site; nothing asked.", e.effect);
				return;
			}
			this.leaveGuard.confirm(t);
		});
		let _ = new iX({
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
		for (let [e, t] of dZ) oZ(e, t, this.engineContext);
		oZ("number input", ({ root: e, propertyPatchEngine: t }) => {
			this.numberInputs = new AS({
				root: e,
				propertyPatchEngine: t
			});
		}, this.engineContext), oZ("tree", ({ root: e, effects: t }) => new Mz({
			root: e,
			effects: t,
			rules: {
				metadata: this.metadata,
				state: r,
				renderer: g
			}
		}), this.engineContext), oZ("items reorder", ({ root: e }) => new nw({
			root: e,
			services: {
				metadata: this.metadata,
				state: r,
				keysOf: (e) => this.virtualization.keysOf(e)
			}
		}), this.engineContext), oZ("press ripple", ({ root: e }) => document.documentElement.hasAttribute("data-ui-press-ripple") ? new KV({
			root: e,
			clicks: (e) => this.metadata.hasServerEventForComponent("click", E(e)) || m.hasEventForComponent("click", E(e))
		}) : void 0, this.engineContext), this.eventPipeline = new Wd({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: this.dispatcher,
			afterEffects: () => this.windows.reconsider(),
			interactionEngine: m,
			eventCatalog: this.extensions.events,
			effects: this.effects,
			events: e.events,
			validationEngine: _,
			valueBinding: p
		});
		for (let e of /* @__PURE__ */ new Set([...this.metadata.getEventNames(), ...f.getSourceEventNames()])) this.eventPipeline.addEvent(e);
		this.eventPipeline.addEvent(uB.name, uB.registration);
		let te = (e) => this.updateProcessor.resortHost(e), ne = $C({
			ahead: (e, t, n) => this.updateProcessor.moves.ahead(e, t, n),
			settle: (e) => this.updateProcessor.moves.settle(e),
			resort: te
		});
		this.eventPipeline.addEvent(ne.name, ne.registration);
		let re = fB(te);
		this.eventPipeline.addEvent(re.name, re.registration);
		let v = Fw(this.updateProcessor.transfers);
		for (let e of this.metadata.getEventNames()) e.startsWith("drop:") && this.eventPipeline.addEvent(e, v);
		this.eventPipeline.addEvent(dy.name, dy.registration), oZ("shortcuts", ({ root: e, dom: t }) => new DM({
			root: e,
			viewShortcuts: OM(this.metadata.metadata),
			componentOf: (e) => t.findComponent(e, [])
		}), this.engineContext), oZ("item drag", ({ root: e, dom: t }) => new Rw({
			root: e,
			targetOf: (e, n) => {
				let r = t.resolveNearestComponent(e, (e) => this.metadata.hasServerEventForComponent("drop:" + n, e))?.element ?? null;
				return r instanceof HTMLElement ? r : null;
			},
			keysOf: (e) => this.virtualization.keysOf(e)
		}), this.engineContext), this.tables = new sR({ root: this.root }), this.windows = new nU({
			root: this.root,
			requestWindow: (e) => this.transport.requestItemWindowAsync(e)
		}), oZ("pager", ({ root: e, dom: t }) => new uN({
			root: e,
			dom: t,
			windows: this.windows
		}), this.engineContext), this.pluginContext = {
			...this.engineContext,
			strings: D,
			observeComponents: B,
			observeSize: dP,
			store: new gO(),
			numbers: lS,
			temporal: Ba,
			icons: { apply: o_ },
			badges: { writeCount: Lq },
			urls: {
				isImageSource: Jg,
				asBrowserReads: qg,
				isSafeLink: Bg,
				isExternalLink: Ug
			},
			values: {
				read: (e) => this.readPluginValue(e),
				hold: (e) => p?.hold(e),
				release: (e) => {
					p?.release(e) === !0 && i.restoreBoundValue(e, this.dom.resolveNearestComponent(e, () => !0)?.dynamicParameters ?? []);
				},
				write: (e, t) => i.writeBoundValue(e, t),
				whenSettled: async (e) => {
					let t = this.dom.resolveNearestComponent(e, () => !0)?.element ?? e;
					await p?.whenSettled(t);
				}
			},
			properties: { set: (e, t, n) => {
				let r = e.closest(S), a = r === null ? void 0 : this.metadata.getExposedProperty(E(r), t);
				return r === null || a === void 0 ? (s("a package set a property its component's renderer did not expose.", { propertyName: t }), !1) : i.applyToComponent(r, a, n);
			} },
			windows: this.windows,
			tooltips: aM,
			renames: { open: cc },
			tables: this.tables,
			rows: OH(h, g, this.virtualization),
			uploads: ug(_),
			selection: Nl,
			popups: yH(this.dom),
			roving: Hc,
			typeAhead: SD,
			focus: ud,
			states: ns,
			validation: _,
			wheel: M_,
			colors: DH,
			shortcuts: Oc,
			names: pi
		}, this.transport.onChanges((e) => void this.applyChanges(e)), this.transport.onCommandResult((e) => {
			let { changes: t, ...n } = e;
			_W(() => this.applyChanges(t), () => {
				this.dispatcher.settle(n) || (this.effects.applyAll(e.command?.effects, this.dom), this.windows.reconsider());
			}).catch((e) => c("a pushed command result could not be applied.", e));
		}), this.updateProcessor.addFullResyncHandler(() => {
			this.attachAsync().catch((e) => c("re-attaching after a full resync failed.", e));
		}), this.transport.onReconnecting((e) => {
			s("SignalR reconnecting.", e), this.dispatcher.release(Error("the connection to the server dropped before the command answered.", { cause: e }));
		}), this.transport.onReconnected(async () => {
			l("SignalR reconnected. Reattaching runtime."), await this.attachAsync();
		}), this.transport.onClosed((e) => this.loseConnection(e ?? /* @__PURE__ */ Error("the connection to the server closed."))), this.connection = new aW({
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
		let t = Vs(e);
		return t === null ? null : this.numberInputs?.readValue(t) ?? this.extensions.valueReaders.readBound(t);
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
		this.dom.invalidate(), D.language !== this.culturesLanguage && (this.culturesLanguage = D.language, Bo(this.root, (e) => nZ(e, D.number, D.temporal)));
		let i = n ? fo : void 0;
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
		Bo(this.root, (e) => {
			e !== this.root && r.push(e);
		});
		for (let t of n) {
			let n = T(t.componentId), i = {
				componentId: n,
				propertyId: t.propertyId
			}, a = t.dynamicParameters ?? [];
			for (let r of this.findWordInstances(n, a)) e.rewriteStatic(r, i, t.key);
			for (let o of r) for (let r of o.querySelectorAll(`[${v}="${C(n)}"]`)) Yi(r, a) && e.rewriteStatic(r, i, t.key);
		}
	}
	findWordInstances(e, t) {
		if (t.length === 0) return this.dom.findEveryComponent(e);
		let n = this.dom.findAllComponents(e, t);
		return n.length > 0 ? n : this.dom.findAllComponents(e, []).filter((e) => Yi(e, t));
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
					this.leaveGuard.release(), window.location.reload();
				}
			}
		});
	}
	reloadForView(e) {
		let t = eW(e, navigator.cookieEnabled, nW());
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
		if (eW(e, navigator.cookieEnabled, nW()) !== "reload") {
			this.loseConnection(/* @__PURE__ */ Error("the server holds a new runtime for this page again after a reload for one."));
			return;
		}
		s("the page's runtime is gone and the server built a new one; reloading.", { view: e }), this.leaveGuard.release(), window.location.reload();
	}
	get instanceId() {
		return this.transport.instanceId;
	}
	async startAsync() {
		_(this, this.options.handlerGlobalKey), GG(this.root), await hZ();
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
		return Po(this.root) || HU(this.hydration) || this.metadata.getWords().some((e) => fo(e.key)) || fo(this.metadata.metadata.itemValues);
	}
	startEnginesAwaitingHydration() {
		let e = this.enginesAwaitingHydration ?? [];
		this.enginesAwaitingHydration = null;
		for (let t of e) oZ(sZ(t), t, this.pluginContext);
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
		oZ(sZ(e), e, this.pluginContext);
	}
	applyChanges(e, t) {
		if (this.inbound === null && !uW(e)) {
			t?.(), this.applyNow(e);
			return;
		}
		let n = this.transport.instanceId, r = (this.inbound ?? Promise.resolve()).then(() => (t?.(), dW(e, n))).then((e) => this.applyNow(e)).catch((e) => {
			c("a staged value could not be fetched; the page attaches again.", e), this.attachAsync().catch((e) => c("re-attaching after a lost staged value failed.", e));
		});
		return this.inbound = r, r.then(() => {
			this.inbound === r && (this.inbound = null);
		}), r;
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
			if (e >= uZ) {
				this.loseConnection(/* @__PURE__ */ Error("the page fell behind the server on every attach."));
				return;
			}
		}
	}
	async attachCoreAsync() {
		if (this.connectionLost) return !1;
		let e = this.holdInbound(), t = performance.now();
		try {
			let n = await this.attachWithRetryAsync(), r = performance.now();
			return n === null ? (this.loseConnection(/* @__PURE__ */ Error("attaching the runtime failed after retrying.")), !1) : n === "reconnecting" ? !1 : n.reload === !0 ? (this.reloadForView(this.hydration?.view ?? ""), !1) : n.fresh === !0 ? (this.reloadForFreshRuntime(this.hydration?.view ?? ""), !1) : (tW(nW()), this.heldRuntime = n.runtime ?? null, this.dom.rebuild(), this.updateProcessor.registerServerRenderedItems(n.initialChanges), await e.previous, this.leaveGuard.set(!1), await this.applyAttachChangesAsync(n.initialChanges), this.updateProcessor.initializeItemsHosts(), this.windows.start(), d("runtime attached", t, {
				windowId: this.windowId,
				instanceId: this.instanceId,
				answered: f(r - t),
				updates: n.initialChanges?.updates?.length ?? 0
			}), !0);
		} finally {
			e.release();
		}
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
			this.applyNow(uW(e) ? await dW(e, this.transport.instanceId) : e);
		} catch (e) {
			c("a staged value of the attach could not be fetched; the page attaches again.", e), this.reattachRequested = !0;
		}
	}
	async attachWithRetryAsync() {
		let e = vZ(), t = {
			clientWindowId: this.windowId,
			route: e?.route ?? window.location.pathname,
			pageId: this.hydration?.pageId ?? null,
			view: this.hydration?.view ?? null,
			since: this.renderSequence,
			runtime: this.heldRuntime,
			parameters: e === null ? tY(window.location.search) : e.parameters,
			timeZone: KU(),
			clientState: this.clientState.forAttach()
		};
		return this.renderSequence = null, await GU(() => this.transport.attachAsync(t), () => this.transport.isReconnecting, lZ, mZ);
	}
};
async function pZ(e = {}) {
	let t = performance.now(), n = new fZ(e);
	return d("runtime built", t), await n.startAsync(), n;
}
function mZ(e) {
	return new Promise((t) => window.setTimeout(t, e));
}
function hZ() {
	let e = performance.getEntriesByType("navigation")[0];
	return document.readyState === "complete" || e !== void 0 && e.domContentLoadedEventStart > 0 ? Promise.resolve() : new Promise((e) => document.addEventListener("DOMContentLoaded", () => e(), { once: !0 }));
}
function gZ(e) {
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
	let n = _Z();
	try {
		t?.setItem(e, n);
	} catch (e) {
		s("storing the tab id failed.", e);
	}
	return n;
}
function _Z() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `tab-${typeof crypto < "u" && typeof crypto.getRandomValues == "function" ? [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16))].map((e) => e.toString(16).padStart(2, "0")).join("") : Math.random().toString(16).slice(2).padEnd(16, "0")}-${performance.now().toString(36).replace(".", "")}`;
}
function vZ() {
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
ee(), pZ().catch((e) => {
	c("Web client failed to start.", e);
});
//#endregion
