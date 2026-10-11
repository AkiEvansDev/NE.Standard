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
	return ne();
}
function te(e, t = "__neStandardUIRuntime") {
	window[t] = e;
	let n = ne();
	n.runtime = e, re(e, n);
}
function ne() {
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
			let r = ie(e, t);
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
function re(e, t) {
	let n = t.__pending ?? [];
	t.__pending = [];
	for (let t of n) t.engine || t.apply(e);
	for (let t of n) t.engine && t.apply(e);
}
function ie(e, t) {
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
var ae = "data-ui-id", oe = "data-ui-context", se = "data-ui-pc", _ = "data-ui-key", ce = "data-ui-unselectable", le = "data-ui-undraggable", ue = "data-ui-unremovable", de = "data-ui-unrenamable", fe = "data-ui-no-context-menu", pe = "data-ui-no-row-open", me = "data-ui-no-row-drag", he = "data-ui-drag-kind", ge = "data-ui-drag-source", _e = "data-ui-item-drop-over", ve = "data-ui-drop-boxed", ye = "ui-row__grip", be = "data-ui-row-drop", xe = "data-ui-tabs-none-removable", Se = "data-ui-tabs-draggable", Ce = "data-ui-tabs-menu", we = "data-ui-context-menu", Te = "data-ui-context-menu-owner", Ee = "data-ui-context-menu-use", De = "data-ui-action-bar", Oe = "data-ui-action-bar-key", ke = "data-ui-action-bar-rest", Ae = "data-ui-menu-left-out", je = "data-ui-in-action-bar", Me = "ui-action-bar", Ne = "data-ui-row-focus", Pe = "data-ui-row-cursor-waits", Fe = "data-ui-tab-out", Ie = "data-ui-cell-focus", Le = "ui-cell-key", Re = "data-ui-tooltip", ze = "data-ui-tooltip-placement", Be = "data-ui-tooltip-mark", Ve = "data-ui-tooltip-severity", He = "data-ui-tooltip-press", Ue = "data-ui-badge-text", We = "data-ui-badge-set", Ge = "data-ui-folds", Ke = "data-ui-name", qe = "data-ui-bind-", Je = "data-ui-into-", Ye = "data-ui-bind-value", Xe = (e) => `data-ui-no-${e}`, Ze = "data-ui-event-boundary", Qe = "data-ui-image-caption", $e = "data-ui-image-crop", et = "data-ui-image-crop-size", tt = "ui-image", nt = "data-ui-fallback-src", rt = "data-ui-image-failed", v = "data-ui-items-host", it = "data-ui-collection-sink", at = "data-ui-items-query", ot = "data-ui-number-culture", st = "data-ui-page-culture", ct = "data-ui-pager-target", lt = "data-ui-pager-page", ut = "data-ui-pager-size", dt = "data-ui-temporal-culture", ft = "data-ui-empty-template", pt = "data-ui-group-template", mt = "data-ui-empty-placeholder", ht = "data-ui-group-header", gt = "data-ui-group-anchor", _t = "data-ui-group", vt = "data-ui-value-holder", yt = "data-ui-value-end", bt = "data-ui-value-kind", xt = "items-query", St = "data-ui-host-mode", Ct = "data-ui-host-viewport", wt = "data-ui-scroll-group", Tt = "data-ui-scroll-lines", Et = "data-ui-source-line", Dt = "data-ui-window-spacer", Ot = "data-ui-window-pending", kt = "data-ui-window-paged", At = "data-ui-window-size", jt = "data-ui-window-offset", Mt = "data-ui-window-total", Nt = "data-ui-window-more-before", Pt = "data-ui-window-more-after", Ft = "data-ui-window-group-before", It = "data-ui-window-aggregates", Lt = "data-ui-form-id", Rt = "data-ui-forms", zt = "data-ui-visibility", Bt = "data-ui-collapsed", Vt = "data-ui-menu-group", Ht = "data-ui-menu-select", Ut = "data-ui-menu-open", Wt = "data-ui-menu-holds-current", Gt = "data-ui-menu-icons", Kt = "data-ui-menu-passive", qt = "data-ui-menu-item-shortcut", Jt = "data-ui-menu-surface", Yt = "data-ui-menu-search", Xt = "data-ui-menu-searching", Zt = "data-ui-menu-unmatched", Qt = "data-ui-drawer-toggle", $t = "data-ui-drawer-open", en = "data-ui-drawer-switch", tn = "data-ui-drawer-switch-row", nn = "data-ui-side-drawers", rn = "data-ui-drawer-pin";
function an(e) {
	return e === "right-side" ? "data-ui-pinned-right-side" : "data-ui-pinned-left-side";
}
var on = "data-ui-bottom-bar", sn = "data-ui-rail-drawer", cn = "data-ui-content-fills", ln = "data-ui-region", un = "data-ui-menu-item-kind", dn = "ui-menu", y = "ui-menu-item", fn = "ui-menu-item--checked", pn = "ui-menu-item--selected", mn = "ui-menu--rail", hn = "ui-menu--nested", gn = `[${un}="header"], [${un}="separator"]`, _n = `[${Vt}] > .${y}`, vn = `.${y}:not(${gn})`, yn = `${_n}, .${y}[${un}="check"]`, bn = "data-ui-shortcut", xn = "data-ui-collapse-toggle", Sn = "data-ui-folding", Cn = "data-ui-column-limits", wn = "data-ui-row-limits", Tn = "data-ui-splitter-step", En = "data-ui-splitter-position", Dn = "data-ui-pane-layout", On = "data-ui-pane", kn = "data-ui-table-column", An = "data-ui-table-hide-below", jn = "data-ui-table-starts-hidden", Mn = "data-ui-table-hidden", Nn = "ui-table__row", Pn = "ui-table__scroll", Fn = "ui-table__header", In = "ui-table__resizer", Ln = "ui-tree", Rn = "ui-tree__row", zn = "ui-tree-node", Bn = "data-ui-tree-drop", Vn = "ui-tree__row--filtered", Hn = "data-ui-table-last", Un = "data-ui-table-reordering", Wn = "data-ui-table-dragging", Gn = "data-ui-table-drop", Kn = "data-ui-table-scrolled", qn = "data-ui-table-scrollbar", Jn = "data-ui-no-row-select", Yn = "data-ui-tree-parent", Xn = "data-ui-tree-children", Zn = "data-ui-tree-folder", Qn = "data-ui-tree-expanded", $n = "data-ui-tree-title", er = "data-ui-tree-loading", tr = "data-ui-tree-drop-target", nr = "data-ui-tree-boot", rr = "data-ui-tree-draggable", ir = "data-ui-row-editing", ar = "data-ui-boxed-editor", or = "data-ui-row-idle", sr = "data-ui-step-collapsed", cr = "data-ui-step-end", lr = "data-ui-row-bar", ur = "data-ui-image-source", dr = "data-ui-file-max-size", fr = "data-ui-file-pick", pr = "data-ui-file-drop-target-id", mr = "data-ui-service-worker", hr = "data-ui-theme", gr = "data-ui-theme-colors", _r = "data-ui-words", vr = "data-ui-language-switcher", yr = "data-ui-language", br = "data-ui-splitting", xr = "data-ui-keyboard-up", Sr = "data-ui-connection", Cr = "data-ui-split-folded", wr = "data-ui-split-edge", Tr = "data-ui-pointer-focus", Er = "data-ui-focus-within", Dr = "data-ui-popup-hover", Or = "data-ui-inner-pointer", kr = "data-ui-selection", Ar = "data-ui-selected", jr = "data-ui-selected-key", Mr = "data-ui-selected-keys", Nr = "data-ui-bind-selected-key", Pr = "data-ui-tabs-selected", Fr = "data-ui-tab-caption", Ir = "data-ui-tab-pinned", Lr = [
	zt,
	"data-ui-visibility-sm",
	"data-ui-visibility-md",
	"data-ui-visibility-xl",
	"data-ui-visibility-xxl"
], Rr = "data-ui-submit-form-id", b = `[${ae}]`, zr = "data-ui-href", Br = "ui-disabled", Vr = "ui-loading", Hr = "ui-readonly", Ur = "ui-hidden", Wr = "ui-dialog__surface", Gr = "ui-flyout__content", Kr = `.ui-context-menu, .ui-split-button__menu, .${Gr}`, qr = "data-ui-focus-holder", Jr = "data-ui-owns-keys", Yr = "[role='listbox'], [role='menu'], [role='dialog']", Xr = "ui-select__trigger", Zr = `.${Xr}`, Qr = "ui-button", $r = `${Qr} ui-button--ghost ui-button--small`, ei = "ui-select", ti = "data-ui-text-title", ni = "data-ui-text-description", ri = "data-ui-text-icon", ii = "data-ui-text-badge-icon", ai = "data-ui-text-badge-text", oi = "ui-card__header--empty", si = "ui-text-input", ci = "ui-invalid", li = "data-ui-validation-message", ui = {
	componentId: ae,
	key: _,
	selected: Ar,
	selectedKey: jr,
	selectedKeys: Mr,
	unselectable: ce,
	rowFocus: Ne,
	cellFocus: Ie,
	cellKey: Le,
	itemsHost: v,
	valueHolder: vt,
	bindValue: Ye,
	noRowOpen: pe,
	noRowDrag: me,
	eventBoundary: Ze,
	focusHolder: qr,
	ownsKeys: Jr,
	tooltip: Re,
	tooltipPlacement: ze,
	contextMenu: we,
	contextMenuUse: Ee,
	actionBar: De,
	actionBarKey: Oe,
	actionBarRest: ke,
	disabledClass: Br,
	loadingClass: Vr,
	readOnlyClass: Hr,
	hiddenClass: Ur,
	buttonClass: Qr,
	selectClass: ei,
	textInputClass: si,
	invalidClass: ci,
	validationMessage: li,
	sourceLine: Et,
	textDescription: ni,
	popupSelector: Yr,
	listTriggerSelector: Zr,
	tableRowClass: Nn,
	tableScrollClass: Pn,
	tableHeaderClass: Fn,
	tableResizerClass: In,
	tableHidden: Mn,
	hostMode: St,
	windowOffset: jt,
	windowTotal: Mt,
	windowSize: At,
	windowMoreAfter: Pt,
	windowAggregates: It,
	itemsQuery: at,
	valueKind: bt,
	itemsQueryKind: xt,
	menuItemClass: y,
	menuItemKind: un,
	menuItemCheckedClass: fn
};
function x(e) {
	return String(e).replace(/[\\"]/g, "\\$&").replace(/[\u0000-\u001f\u007f]/g, (e) => `\\${e.charCodeAt(0).toString(16)} `);
}
function di(e) {
	return e.replace(/(\p{Ll})(\p{Lu})/gu, "$1-$2").replace(/([\p{L}\p{Nd}])(\p{Lu}\p{Ll})/gu, "$1-$2").replace(/_/g, "-").toLowerCase();
}
var fi = 0;
function pi(e, t) {
	return e.id.length === 0 && (fi++, e.id = `${t}-${fi}`), e.id;
}
//#endregion
//#region src/addressing/operation-targets.ts
function mi(e, t, n) {
	let r = t.target;
	if (r === "root") return [e];
	if (r != null && r.trim().length > 0) {
		if (e.matches(r)) return [e];
		for (let t of e.querySelectorAll(r)) if (t.closest(b) === e) return [t];
		return [];
	}
	return n();
}
//#endregion
//#region src/metadata/metadata-index.ts
var hi = {
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
}, gi = class {
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
		for (let t of e.validationTargets ?? []) this.validationTargetsByComponentId.set(C(t.componentId), t);
		for (let t of e.exposedProperties ?? []) {
			let e = this.getPropertyDefinition(t.propertyId);
			e !== void 0 && this.exposedProperties.set(`${C(t.componentId)}:${e.propertyName}`, t);
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
		return this.propertyDefinitionsById.get(e.propertyId)?.translatable !== !0 || e.content === !0 ? !1 : ("bindingId" in e ? e : this.getBindingByComponentAndPropertyId(C(e.componentId), e.propertyId))?.content !== !0;
	}
	getWords() {
		return this.metadata.words ?? [];
	}
	hasComponentBindings(e) {
		for (let t of this.metadata.bindings) if (C(t.componentId) === e) return !0;
		return !1;
	}
	getBindingByComponentAndPropertyId(e, t) {
		return this.bindingsByComponentAndPropertyId.get(zi(e, t));
	}
	getBindingByComponentAndPropertyName(e, t) {
		return this.bindingsByComponentAndPropertyName.get(zi(e, Ri(t)));
	}
	getEvent(e, t) {
		return this.eventsByComponentAndName.get(Bi(e, t));
	}
	hasServerEvent(e) {
		return this.eventNames.has(Li(e));
	}
	getEventNames() {
		return this.eventNames;
	}
	hasServerEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(Li(e))?.has(t) === !0;
	}
	getItemsTemplateMetadata(e) {
		return this.itemsTemplatesByComponentId.get(e);
	}
	getItemsFilterSortMetadata(e) {
		return this.itemsFilterSortByComponentId.get(e);
	}
	getItemValues(e, t = []) {
		return this.itemValuesByAddress.get(Vi(e, t))?.items ?? [];
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
		let t = C(e.componentId), n = this.getPropertyDefinition(e.propertyId);
		if (t <= 0 || n === void 0) return;
		let r = C(e.bindingId);
		r > 0 && this.bindingsById.set(r, e), this.bindingsByComponentAndPropertyId.set(zi(t, e.propertyId), e), this.bindingsByComponentAndPropertyName.set(zi(t, n.propertyName), e);
	}
	addEvent(e) {
		let t = Li(e.eventName), n = C(e.componentId);
		if (t.length === 0 || n <= 0) return;
		this.eventsByComponentAndName.set(Bi(n, t), e), this.eventNames.add(t);
		let r = this.eventComponentIdsByName.get(t);
		r === void 0 && (r = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(t, r)), r.add(n);
	}
	addItemsTemplate(e) {
		let t = C(e.componentId);
		t <= 0 || this.itemsTemplatesByComponentId.set(t, e);
	}
	addItemsFilterSort(e) {
		let t = C(e.componentId);
		t <= 0 || this.itemsFilterSortByComponentId.set(t, e);
	}
	addItemValues(e) {
		let t = C(e.componentId);
		t > 0 && this.itemValuesByAddress.set(Vi(t, e.dynamicParameters ?? []), e);
	}
	addValidation(e) {
		let t = C(e.target?.componentId);
		if (t <= 0) return;
		let n = this.validationsByComponentId.get(t);
		n === void 0 && (n = [], this.validationsByComponentId.set(t, n)), n.push(e);
	}
};
function S(e, t) {
	return typeof e == "number" ? t[e] ?? "Unknown" : e != null && t.includes(e) ? e : "Unknown";
}
function _i(e) {
	return S(e, [
		"Dynamic",
		"Fixed",
		"Scope"
	]);
}
function vi(e) {
	return e == null ? "OneWay" : S(e, [
		"OneWay",
		"TwoWay",
		"OneWayToSource",
		"OnSubmit"
	]);
}
function yi(e) {
	return S(e, ["Property", "Event"]);
}
function bi(e) {
	return e == null ? "SetProperty" : S(e, [
		"SetProperty",
		"Effect",
		"CopyValue"
	]);
}
function xi(e) {
	return S(e, [
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
function Si(e) {
	return S(e, ["Ascending", "Descending"]);
}
function Ci(e) {
	return S(e, [
		"Change",
		"Blur",
		"Submit"
	]);
}
function wi(e) {
	return S(e, [
		"Error",
		"Warning",
		"Info"
	]);
}
function Ti(e) {
	return typeof e == "string" ? e : S(e, [
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
function Ei(e) {
	return S(e, [
		"None",
		"HasValue",
		"HasText",
		"IsTrue",
		"IsFalse",
		"DrawsIcon"
	]);
}
function Di(e) {
	return S(e, [
		"Insert",
		"Remove",
		"Move",
		"Replace",
		"Reset"
	]);
}
function C(e) {
	return e ?? 0;
}
function Oi(e) {
	return typeof e == "string" ? e : "";
}
function ki(e) {
	return S(e.kind, [
		"Value",
		"CollectionChange",
		"FullResync",
		"Validation",
		"Page"
	]);
}
function Ai(e) {
	return typeof e == "string" ? e.trim() : "";
}
function ji(e) {
	return S(e, ["Auto", "Smooth"]);
}
function Mi(e) {
	return S(e, [
		"Start",
		"Center",
		"End",
		"Nearest"
	]);
}
function Ni(e) {
	return S(e, [
		"Start",
		"End",
		"Offset",
		"PageBack",
		"PageForward"
	]);
}
function Pi(e) {
	return S(e, ["Light", "Dark"]);
}
function Fi(e) {
	return S(e, ["Horizontal", "Vertical"]);
}
function Ii(e) {
	return S(e, ["Polite", "Assertive"]);
}
function Li(e) {
	return e?.trim().toLowerCase() ?? "";
}
function Ri(e) {
	return e?.trim() ?? "";
}
function zi(e, t) {
	return `${e}:${Ri(t)}`;
}
function Bi(e, t) {
	return `${e}:${Li(t)}`;
}
function Vi(e, t) {
	return `${e}:${JSON.stringify(t.map((e) => String(e ?? "")))}`;
}
//#endregion
//#region src/addressing/address-resolver.ts
var Hi = class {
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
		return this.dom.findAllComponents(C(e.componentId), []).length > 0;
	}
	resolveProperties(e, t) {
		let n = C(e.componentId), r = this.metadata.getPropertyDefinition(e.propertyId);
		if (n <= 0 || r === void 0) return [];
		let i = this.dom.findAllComponents(n, t);
		if (i.length === 0) return [];
		let a = C(this.metadata.getBindingByComponentAndPropertyId(n, e.propertyId)?.bindingId), o = a > 0 ? `[${qe}${di(r.propertyName)}="${x(a)}"]` : null;
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
		let n = C(t.componentId), r = this.metadata.getPropertyDefinition(t.propertyId);
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
		return mi(e.component, t, () => {
			if (e.bindingSelector === null) return [e.component.querySelector(`[data-ui-into-${di(e.propertyName)}]`) ?? e.component];
			let t = Array.from(e.component.querySelectorAll(e.bindingSelector));
			return e.component.matches(e.bindingSelector) && t.unshift(e.component), t;
		});
	}
};
//#endregion
//#region src/addressing/dynamic-parameters.ts
function Ui(e) {
	return qi(e, se);
}
function Wi(e, t) {
	if (t <= 0) return [];
	let n = [], r = e;
	for (; r !== null && n.length < t;) {
		let e = Ji(r);
		e !== void 0 && n.push(e), r = r.parentElement;
	}
	return n.reverse(), n.length !== t && s("dynamic parameter count mismatch.", {
		expectedCount: t,
		actualCount: n.length,
		element: e
	}), n;
}
function Gi(e, t) {
	let n = Ui(e);
	if (n !== t.length) return !1;
	if (n === 0) return !0;
	let r = Wi(e, n);
	if (r.length !== t.length) return !1;
	for (let e = 0; e < t.length; e++) if (String(r[e] ?? "") !== String(t[e] ?? "")) return !1;
	return !0;
}
function Ki(e, t) {
	let n = t.length - 1, r = e;
	for (; r !== null && n >= 0;) {
		let e = Ji(r);
		if (e !== void 0) {
			if (e !== String(t[n] ?? "")) return !1;
			n--;
		}
		r = r.parentElement;
	}
	return n < 0;
}
function qi(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.trim().length === 0) return 0;
	let r = Number(n);
	return Number.isInteger(r) ? r : 0;
}
function Ji(e) {
	return e.getAttribute("data-ui-key") ?? e.getAttribute("data-ui-group-anchor") ?? void 0;
}
//#endregion
//#region src/addressing/dom-registry.ts
function Yi(e, t) {
	let n = [];
	for (let r of e) r instanceof HTMLElement && r.matches(t) ? n.push(r) : n.push(...r.querySelectorAll(t));
	return n;
}
var Xi = class {
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
		let e = this.root.querySelectorAll(b), t = this.root.querySelector(`[${ht}]`) !== null;
		for (let n of e) {
			let e = w(n);
			if (e <= 0 || t && n.closest("[data-ui-group-header]") !== null) continue;
			let r = this.componentsById.get(e);
			r === void 0 && (r = [], this.componentsById.set(e, r)), r.push(n), !this.staticComponentsById.has(e) && ea(n) && this.staticComponentsById.set(e, n);
		}
	}
	findComponent(e, t) {
		return this.findAllComponents(e, t)[0] ?? null;
	}
	ensureId(e, t) {
		return pi(e, t);
	}
	findComponentParts(e, t, n) {
		return Yi(this.findAllComponents(e, t), n);
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
		let n = this.keyedComponents(e).get($i(t)) ?? [];
		if (n.length > 0 && n.every((e) => Gi(e, t))) return [...n];
		let r = (this.componentsById.get(e) ?? []).filter((e) => Gi(e, t));
		return n.length > 0 && this.keyedComponentsById.delete(e), r;
	}
	keyedComponents(e) {
		let t = this.keyedComponentsById.get(e);
		if (t !== void 0) return t;
		t = /* @__PURE__ */ new Map();
		for (let n of this.componentsById.get(e) ?? []) {
			let e = Ui(n);
			if (e === 0) continue;
			let r = Wi(n, e);
			if (r.length !== e) continue;
			let i = $i(r), a = t.get(i);
			a === void 0 ? t.set(i, [n]) : a.push(n);
		}
		return this.keyedComponentsById.set(e, t), t;
	}
	resolveNearestComponent(e, t) {
		this.stale && this.rebuild();
		let n = e;
		for (; n !== null;) {
			let e = n.closest(b);
			if (e === null || !ta(this.root, e)) return null;
			let r = w(e);
			if (r > 0 && t(r, e)) return {
				element: e,
				componentId: r,
				dynamicParameters: Wi(e, Ui(e))
			};
			n = e.parentElement;
		}
		return null;
	}
};
function w(e) {
	return qi(e, ae);
}
function Zi(e) {
	let t = e.closest(b), n = t === null ? 0 : w(t);
	return n > 0 ? n : null;
}
function Qi(e) {
	let t = e.closest(b), n = t === null ? 0 : w(t);
	return t === null || n <= 0 ? null : {
		componentId: n,
		dynamicParameters: Wi(t, Ui(t))
	};
}
function $i(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function ea(e) {
	return Ui(e) === 0;
}
function ta(e, t) {
	return e === t || e instanceof Node && e.contains(t);
}
//#endregion
//#region src/runtime/plural-rules.ts
function na(e, t) {
	if (!Number.isFinite(t)) return "other";
	let n = Math.abs(t), r = Math.trunc(n), i = ra(n);
	switch (ia(e)) {
		case "en":
		case "de": return r === 1 && i === 0 ? "one" : "other";
		case "es": return n === 1 ? "one" : aa(r, i) ? "many" : "other";
		case "fr": return r === 0 || r === 1 ? "one" : aa(r, i) ? "many" : "other";
		case "ru":
		case "uk": return oa(r, i);
		case "pl": return sa(r, i);
		default: return "other";
	}
}
function ra(e) {
	if (Number.isInteger(e)) return 0;
	let t = String(e), n = t.indexOf("e"), r = n < 0 ? t : t.slice(0, n), i = n < 0 ? 0 : Number(t.slice(n + 1)), a = r.indexOf("."), o = a < 0 ? 0 : r.length - a - 1;
	return Math.max(0, o - i);
}
function ia(e) {
	return e == null || e.trim().length === 0 ? "" : e.split(/[-_]/, 1)[0].toLowerCase();
}
function aa(e, t) {
	return t === 0 && e !== 0 && e % 1e6 == 0;
}
function oa(e, t) {
	if (t !== 0) return "other";
	let n = e % 10, r = e % 100;
	return n === 1 && r !== 11 ? "one" : n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
function sa(e, t) {
	if (t !== 0) return "other";
	if (e === 1) return "one";
	let n = e % 10, r = e % 100;
	return n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
//#endregion
//#region src/rendering/temporal-format.ts
function ca(e, t) {
	return `${e.date} ${t ? e.longTime : e.shortTime}`;
}
var la = {
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
function ua(e) {
	let t = e.closest("[data-ui-temporal-culture]")?.getAttribute("data-ui-temporal-culture") ?? null;
	if (t === null) return la;
	try {
		return {
			...la,
			...JSON.parse(t)
		};
	} catch {
		return la;
	}
}
var da = [
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
function fa(e, t, n) {
	if (t == null || t.trim().length === 0) return `${ya(e.getFullYear(), 4)}-${ya(e.getMonth() + 1, 2)}-${ya(e.getDate(), 2)} ${ya(e.getHours(), 2)}:${ya(e.getMinutes(), 2)}:${ya(e.getSeconds(), 2)}`;
	let r = "", i = pa(t);
	for (let a = 0; a < t.length;) {
		let o = _a(t, a);
		if (o === null) {
			r += t[a], a++;
			continue;
		}
		r += va(o, e, n, i), a += o.length;
	}
	return r;
}
function pa(e) {
	for (let t = 0; t < e.length;) {
		let n = _a(e, t);
		if (n === null) {
			t++;
			continue;
		}
		if (n === "d" || n === "dd") return !0;
		t += n.length;
	}
	return !1;
}
var ma = /^[-./:,]$/, ha = /* @__PURE__ */ new Set([
	"MMMM",
	"MMM",
	"dddd",
	"ddd",
	"tt"
]);
function ga(e) {
	for (let t = 0; t < e.length;) {
		let n = _a(e, t);
		if (n !== null && ha.has(n) || n === null && !ma.test(e[t]) && !/\s/.test(e[t])) return !1;
		t += n?.length ?? 1;
	}
	return e.trim().length > 0;
}
function _a(e, t) {
	for (let n of da) if (e.startsWith(n, t)) return n;
	return null;
}
function va(e, t, n, r) {
	let i = t.getHours(), a = Ra(i);
	switch (e) {
		case "yyyy": return ya(t.getFullYear(), 4);
		case "yy": return ya(t.getFullYear() % 100, 2);
		case "MMMM": return r ? n.monthGenitiveNames[t.getMonth()] : n.monthNames[t.getMonth()];
		case "MMM": return n.abbreviatedMonthNames[t.getMonth()];
		case "MM": return ya(t.getMonth() + 1, 2);
		case "M": return String(t.getMonth() + 1);
		case "dddd": return n.dayNames[t.getDay()];
		case "ddd": return n.abbreviatedDayNames[t.getDay()];
		case "dd": return ya(t.getDate(), 2);
		case "d": return String(t.getDate());
		case "HH": return ya(i, 2);
		case "H": return String(i);
		case "hh": return ya(a, 2);
		case "h": return String(a);
		case "mm": return ya(t.getMinutes(), 2);
		case "m": return String(t.getMinutes());
		case "ss": return ya(t.getSeconds(), 2);
		case "s": return String(t.getSeconds());
		case "tt": return i < 12 ? n.amDesignator : n.pmDesignator;
		default: return e;
	}
}
function ya(e, t) {
	return String(e).padStart(t, "0");
}
var ba = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function xa(e) {
	let t = ba.exec(e.trim());
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
function Sa(e) {
	return Ca(e.year, e.month - 1, e.day, e.hour, e.minute, e.second, e.millisecond);
}
function Ca(e, t, n, r = 0, i = 0, a = 0, o = 0) {
	let s = new Date(2e3, 0, 1, r, i, a, o);
	return s.setFullYear(e, t, n), s;
}
var wa = {
	year: "y",
	month: "M",
	day: "d",
	hour: "H",
	minute: "m",
	second: "s"
};
function Ta(e, t) {
	let n = "";
	for (let r = 0; r < e.length;) {
		let i = _a(e, r);
		if (i === null) {
			n += e[r], r++;
			continue;
		}
		n += Ea(i, t).repeat(i.length), r += i.length;
	}
	return n;
}
function Ea(e, t) {
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
function Da(e, t, n) {
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
		let a = _a(t, e);
		if (a === null) {
			if (!Oa(r, i, t[e])) return null;
			e++;
			continue;
		}
		if (!ka(r, i, a, n)) return null;
		e += a.length;
	}
	return r.length > 0 && i.position === r.length ? Ia(i) : null;
}
function Oa(e, t, n) {
	if (/\s/.test(n)) {
		for (; t.position < e.length && /\s/.test(e[t.position]);) t.position++;
		return !0;
	}
	return ma.test(n) ? t.position >= e.length || !ma.test(e[t.position]) ? !1 : (t.position++, !0) : t.position >= e.length || e[t.position].toLowerCase() !== n.toLowerCase() ? !1 : (t.position++, !0);
}
function ka(e, t, n, r) {
	switch (n) {
		case "yyyy": return Aa(t, "year", Na(e, t, 4, 4));
		case "yy": return Aa(t, "year", ja(Na(e, t, 2, 2)));
		case "MMMM":
		case "MMM": return Aa(t, "month", Ma(Pa(e, t, [
			r.monthNames,
			r.monthGenitiveNames,
			r.abbreviatedMonthNames
		])));
		case "MM":
		case "M": return Aa(t, "month", Na(e, t, 1, 2));
		case "dddd":
		case "ddd": return Pa(e, t, [r.dayNames, r.abbreviatedDayNames]) !== null;
		case "dd":
		case "d": return Aa(t, "day", Na(e, t, 1, 2));
		case "HH":
		case "H": return Aa(t, "hour", Na(e, t, 1, 2));
		case "hh":
		case "h": return Aa(t, "hour12", Na(e, t, 1, 2));
		case "mm":
		case "m": return Aa(t, "minute", Na(e, t, 1, 2));
		case "ss":
		case "s": return Aa(t, "second", Na(e, t, 1, 2));
		case "tt": return Fa(e, t, r);
		default: return !1;
	}
}
function Aa(e, t, n) {
	return n !== null && (e[t] = n, !0);
}
function ja(e) {
	return e === null ? null : e + (e < 50 ? 2e3 : 1900);
}
function Ma(e) {
	return e === null ? null : e + 1;
}
function Na(e, t, n, r) {
	let i = t.position;
	for (; i < e.length && i - t.position < r && e[i] >= "0" && e[i] <= "9";) i++;
	if (i - t.position < n) return null;
	let a = Number(e.slice(t.position, i));
	return t.position = i, a;
}
function Pa(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = null, a = 0;
	for (let e of n) for (let t = 0; t < e.length; t++) {
		let n = e[t].toLowerCase();
		n.length > a && r.startsWith(n) && (i = t, a = n.length);
	}
	return t.position += a, i;
}
function Fa(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = n.amDesignator.toLowerCase(), a = n.pmDesignator.toLowerCase();
	for (let [e, n] of i.length >= a.length ? [[i, !1], [a, !0]] : [[a, !0], [i, !1]]) if (e.length > 0 && r.startsWith(e)) return t.position += e.length, t.afternoon = n, !0;
	return i.length === 0 && a.length === 0;
}
function Ia(e) {
	let t = e.hour ?? 0;
	if (e.hour12 !== null) {
		if (e.hour12 < 1 || e.hour12 > 12) return null;
		t = e.hour12 % 12 + (e.afternoon === !0 ? 12 : 0);
	}
	return e.year === null || e.month === null || e.day === null || e.year < 1 || e.month < 1 || e.month > 12 || e.day < 1 || e.day > Ca(e.year, e.month, 0).getDate() || t > 23 || e.minute > 59 || e.second > 59 ? null : {
		year: e.year,
		month: e.month,
		day: e.day,
		hour: t,
		minute: e.minute,
		second: e.second,
		millisecond: 0
	};
}
var La = {
	readCulture: ua,
	format: fa,
	parse: xa,
	toDate: Sa
};
function Ra(e) {
	return e % 12 == 0 ? 12 : e % 12;
}
//#endregion
//#region src/rendering/timestamp-format.ts
var za = /(?:Z|[+-]\d{2}(?::?\d{2})?)$/i, Ba = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function Va(e) {
	let t = e?.trim() ?? "";
	if (!Ba.test(t)) return null;
	let n = Date.parse(za.test(t) ? t : `${t}Z`);
	return Number.isNaN(n) ? null : n;
}
function Ha(e) {
	return e === "date" || e === "time" || e === "relative" || e === "relative-date" ? e : "date-time";
}
function Ua(e) {
	return e === "relative" || e === "relative-date";
}
var Wa = {
	...la,
	date: "yyyy-MM-dd",
	shortTime: "HH:mm",
	longTime: "HH:mm:ss"
};
function Ga(e, t, n, r) {
	if (t === "relative") return to(e - r, n.language);
	if (t === "relative-date") {
		let t = Ka(e, r);
		if (t !== null) return Ya(n.language).format(t, "day");
	}
	let i = n.temporal ?? Wa, a = t === "date" || t === "relative-date" ? i.date : t === "time" ? i.shortTime : ca(i, !1);
	return fa(new Date(e), a, i);
}
function Ka(e, t) {
	let n = new Date(e), r = new Date(t), i = Math.round((Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) - Date.UTC(r.getFullYear(), r.getMonth(), r.getDate())) / eo);
	return Math.abs(i) <= 1 ? i : null;
}
function qa(e, t) {
	return e.length === 0 ? e : e.charAt(0).toLocaleUpperCase(Xa(t)) + e.slice(1);
}
var Ja = /* @__PURE__ */ new Map();
function Ya(e) {
	let t = Ja.get(e);
	return t === void 0 && (t = new Intl.RelativeTimeFormat(Xa(e), { numeric: "auto" }), Ja.set(e, t)), t;
}
function Xa(e) {
	if (e.length !== 0) try {
		return Intl.DateTimeFormat.supportedLocalesOf(e).length > 0 ? e : void 0;
	} catch {
		return;
	}
}
var Za = 1e3, Qa = 60 * Za, $a = 60 * Qa, eo = 24 * $a;
function to(e, t) {
	let n = Ya(t), r = Math.abs(e);
	return r < 45 * Za ? n.format(0, "second") : r < 45 * Qa ? n.format(Math.round(e / Qa), "minute") : r < 22 * $a ? n.format(Math.round(e / $a), "hour") : r < 26 * eo ? n.format(Math.round(e / eo), "day") : r < 320 * eo ? n.format(Math.round(e / (30.4375 * eo)), "month") : n.format(Math.round(e / (365.25 * eo)), "year");
}
//#endregion
//#region src/runtime/words.ts
var no = "count";
function ro(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	if (typeof t.key != "string" || t.key.trim().length === 0) return !1;
	for (let e of Object.keys(t)) if (e !== "key" && e !== "args") return !1;
	return t.args === void 0 || t.args === null || typeof t.args == "object" && !Array.isArray(t.args);
}
function io(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.text == "string" && t.text.trim().length > 0 && Object.keys(t).length === 1;
}
var ao = /* @__PURE__ */ new Set([
	"date-time",
	"date",
	"time",
	"relative",
	"relative-date"
]);
function oo(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	for (let e of Object.keys(t)) if (e !== "moment" && e !== "format") return !1;
	return typeof t.moment == "string" && Va(t.moment) !== null && (t.format === void 0 || typeof t.format == "string" && ao.has(t.format));
}
function so(e) {
	if (typeof e != "object" || !e) return !1;
	if (oo(e)) return !0;
	for (let t of Array.isArray(e) ? e : Object.values(e)) if (so(t)) return !0;
	return !1;
}
function co(e, t) {
	let n = new Date(e).toISOString(), r = n.slice(0, 10), i = n.slice(11, 16);
	return t === "date" || t === "relative-date" ? r : t === "time" ? `${i} UTC` : `${r} ${i} UTC`;
}
function lo(e, t, n) {
	return ro(e) ? po(n, e.key, e.args) : io(e) ? uo(n, e.text) : t && typeof e == "string" ? uo(n, e) : e;
}
function uo(e, t) {
	return t.trim().length === 0 || !fo(e.prefixes, t) ? t : e.lookup(t) ?? t;
}
function fo(e, t) {
	if (e.length === 0) return !0;
	for (let n of e) if (t.startsWith(n)) return !0;
	return !1;
}
function po(e, t, n) {
	let r = n?.[no];
	return mo(typeof r == "number" ? e.lookup(`${t}.${na(e.language, r)}`) ?? e.lookup(`${t}.other`) ?? e.lookup(t) ?? t : e.lookup(t) ?? t, n, (t) => io(t) ? uo(e, t.text) : po(e, t.key, t.args), e.writeMoment);
}
function mo(e, t, n, r = co) {
	if (t == null || !e.includes("{")) return e;
	let i = "", a = 0;
	for (; a < e.length;) {
		if (e[a] === "{") {
			let o = ho(e, a);
			if (o > 0) {
				let s = e.slice(a + 1, o);
				if (Object.hasOwn(t, s)) {
					i += _o(t[s], n, r), a = o + 1;
					continue;
				}
			}
		}
		i += e[a], a++;
	}
	return i;
}
function ho(e, t) {
	let n = t + 1;
	for (; n < e.length && go(e.charCodeAt(n));) n++;
	return n > t + 1 && n < e.length && e[n] === "}" ? n : -1;
}
function go(e) {
	return e >= 48 && e <= 57 || e >= 65 && e <= 90 || e >= 97 && e <= 122 || e === 95;
}
function _o(e, t, n) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "boolean" ? e ? "true" : "false" : ro(e) ? t === void 0 ? mo(e.key, e.args, void 0, n) : t(e) : io(e) ? t === void 0 ? e.text : t(e) : oo(e) ? n(Va(e.moment) ?? 0, e.format ?? "date-time") : String(e);
}
//#endregion
//#region src/runtime/relative-clock.ts
var vo = 15e3, yo = /* @__PURE__ */ new Set(), bo = null;
function xo(e) {
	yo.add(e), bo === null && (bo = setInterval(So, vo));
}
function So() {
	for (let e of [...yo]) {
		let t = !1;
		try {
			t = e();
		} catch (e) {
			s("a relative tick failed; it is ticked no more.", e);
		}
		t || yo.delete(e);
	}
	yo.size === 0 && bo !== null && (clearInterval(bo), bo = null);
}
//#endregion
//#region src/runtime/client-strings.ts
var Co = 256, wo = 512, To = "script[type='application/json'][data-ui-strings]", Eo = "#text", Do = `[${_r}*='"moment"']`, Oo = class {
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
		let t = e.querySelector(To)?.textContent?.trim() ?? "";
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
		return this.lookup(e) === void 0 && this.text(e), po(this, e, t);
	}
	translate(e, t) {
		return po(this, e, t);
	}
	writeMoment = (e, t) => (Ua(t) && this.noteRelative(), Ga(e, t, {
		temporal: this.currentTemporal,
		language: this.currentLanguage
	}, Date.now()));
	noteRelative() {
		this.relativeWritten = !0, this.momentHandlers.size > 0 && xo(this.tickMoments);
	}
	tickMoments = () => this.relativeWritten ? (this.relativeWritten = !1, this.notify(this.momentHandlers, "a moment tick handler failed."), !0) : !1;
	resolve(e, t) {
		return lo(e, t, this);
	}
	resolveText(e) {
		return lo(e, !0, this);
	}
	write(e, t, n, r) {
		Po(e, t, this.translate(n, r)), this.mark(e, t, r == null || Object.keys(r).length === 0 ? [n] : [n, r]);
	}
	writeText(e, t, n) {
		Po(e, t, lo(n, !0, this)), this.mark(e, t, n);
	}
	writeValue(e, t, n) {
		if (ro(n)) {
			this.write(e, t, n.key, n.args);
			return;
		}
		let r = io(n) ? n.text : typeof n == "string" ? n : "";
		if (r.trim().length > 0) {
			this.writeText(e, t, r);
			return;
		}
		Po(e, t, ""), this.mark(e, t, null);
	}
	mark(e, t, n) {
		jo(e, t, n);
	}
	rewriteMarks(e, t = !1) {
		Fo(e, (e) => {
			for (let n of e.querySelectorAll(t ? Do : `[${_r}]`)) for (let [e, r] of Object.entries(No(n))) {
				if (t && !so(r)) continue;
				let i = this.wordsOfMark(r);
				i !== null && Po(n, e === Eo ? null : e, i);
			}
		});
	}
	wordsOfMark(e) {
		if (typeof e == "string") return lo(e, !0, this);
		if (!Array.isArray(e)) return null;
		let [t, n] = e;
		return typeof t == "string" ? this.translate(t, typeof n == "object" && n ? n : null) : null;
	}
	askLater(e) {
		this.asker === null || !this.tableLoaded || e.length > wo || e.trim().length === 0 || this.complete && !(this.report && this.currentPrefixes.length > 0 && fo(this.currentPrefixes, e)) || this.askedIn(this.currentLanguage).has(e) || (this.pending.add(e), !this.flushQueued && (this.flushQueued = !0, setTimeout(() => void this.flushAsync(), 0)));
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
		for (let r = 0; r < n.length; r += Co) try {
			let a = await e(t, n.slice(r, r + Co));
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
function ko(e) {
	let t = !1;
	return Fo(e, (e) => {
		t ||= e.querySelector(Do) !== null;
	}), t;
}
function Ao(e, t) {
	e.hasAttribute("data-ui-words") && jo(e, t, null);
}
function jo(e, t, n) {
	let r = No(e), i = t ?? Eo;
	if (n === null) {
		if (!(i in r)) return;
		delete r[i];
	} else r[i] = n;
	let a = JSON.stringify(r);
	Object.keys(r).length === 0 ? e.removeAttribute(_r) : e.getAttribute("data-ui-words") !== a && e.setAttribute(_r, a);
}
function Mo(e) {
	let t = No(e)[Eo];
	if (typeof t == "string") return t;
	if (!Array.isArray(t) || typeof t[0] != "string") return null;
	let n = t[1];
	return {
		key: t[0],
		args: typeof n == "object" && n ? n : null
	};
}
function No(e) {
	let t = e.getAttribute(_r);
	if (t === null || t.length === 0) return {};
	try {
		let e = JSON.parse(t);
		return typeof e == "object" && e && !Array.isArray(e) ? e : {};
	} catch {
		return {};
	}
}
function Po(e, t, n) {
	if (t === null) {
		e.textContent !== n && (e.textContent = n);
		return;
	}
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function Fo(e, t) {
	t(e);
	for (let n of e.querySelectorAll("template")) Fo(n.content, t);
}
var T = new Oo();
function Io(e, t) {
	let n = io(e) ? e.text : e;
	return T.resolve(n, typeof n == "string" && n.length > 0 && t());
}
//#endregion
//#region src/updates/row-idle.ts
var Lo = "row-idle";
function Ro(e) {
	let t = e.parentElement;
	t !== null && (Ho(t) ? zo(t) : !t.hasAttribute("data-ui-id") && t.parentElement !== null && Ho(t.parentElement) && zo(t.parentElement));
}
function zo(e) {
	let t = Bo(e);
	e.hasAttribute("data-ui-row-idle") !== t && e.toggleAttribute(or, t);
}
function Bo(e) {
	for (let t of e.children) {
		if (t.hasAttribute("data-ui-id")) {
			if (Vo(t)) return !0;
			continue;
		}
		for (let e of t.children) if (e.hasAttribute("data-ui-id") && Vo(e)) return !0;
	}
	return !1;
}
function Vo(e) {
	return e.classList.contains("ui-disabled") || e.classList.contains("ui-loading");
}
function Ho(e) {
	return e.hasAttribute("data-ui-key") && e.parentElement?.hasAttribute("data-ui-items-host") === !0;
}
//#endregion
//#region src/interactions/interactive-state.ts
var Uo = `.${Br}, .${Vr}, [inert]`;
function Wo(e) {
	return `:scope > [${ae}]:is(${e}), :scope > :not([${ae}]) > [${ae}]:is(${e})`;
}
var Go = Wo(Uo), Ko = /* @__PURE__ */ new Map();
function E(e) {
	return e.closest(Uo) !== null || e.matches(":disabled, [aria-disabled='true']");
}
function D(e) {
	return e.matches(Uo) || e.querySelector(Go) !== null;
}
function qo(e, t) {
	if (e.hasAttribute(t)) return !0;
	let n = Ko.get(t);
	return n === void 0 && (n = Wo(`[${t}]`), Ko.set(t, n)), e.querySelector(n) !== null;
}
function Jo(e) {
	return e.getClientRects().length > 0 && !e.matches(":disabled") && e.closest("[inert]") === null;
}
var Yo = `[${ae}], .${Hr}`;
function O(e) {
	return e.closest(Yo)?.matches(`.${Hr}`) === !0;
}
function Xo(e, t) {
	e.classList.contains("ui-disabled") !== t && (e.classList.toggle(Br, t), Ro(e)), t ? e.setAttribute("aria-disabled", "true") : e.removeAttribute("aria-disabled");
}
var Zo = {
	isInert: E,
	isReadOnly: O,
	setDisabled: Xo
};
//#endregion
//#region src/interactions/grid-tracks.ts
function Qo(e, t) {
	return Math.max(e, Math.round(t / 10));
}
function $o(e) {
	let t = [];
	for (let n of ns(e.trim())) {
		let e = /^repeat\(\s*(\d+)\s*,(.+)\)$/s.exec(n);
		if (e !== null) {
			let n = $o(e[2]);
			if (n === null) return null;
			for (let r = Number(e[1]); r > 0; r--) t.push(...n);
			continue;
		}
		let r = es(n);
		if (r === null) return null;
		t.push(r);
	}
	return t.length === 0 ? null : t;
}
function es(e) {
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
	if (n !== null) return ts({
		kind: "auto",
		value: 0
	}, Number(n[1]));
	let r = /^minmax\(\s*([\d.]+)(?:px)?\s*,\s*([\d.]+)(fr|px)\s*\)$/.exec(e);
	if (r !== null) return ts(r[3] === "fr" ? {
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
function ts(e, t) {
	return t > 0 ? {
		...e,
		min: t
	} : e;
}
function ns(e) {
	let t = [], n = 0, r = 0;
	for (let i = 0; i < e.length; i++) {
		let a = e[i];
		a === "(" ? n++ : a === ")" ? n-- : a === " " && n === 0 && (i > r && t.push(e.slice(r, i)), r = i + 1);
	}
	return r < e.length && t.push(e.slice(r)), t;
}
function rs(e, t = "auto") {
	return e.map((e) => is(e, t)).join(" ");
}
function is(e, t) {
	switch (e.kind) {
		case "px": return `${as(e.value)}px`;
		case "star": return `minmax(${e.min === void 0 ? "0" : `${as(e.min)}px`}, ${as(e.value)}fr)`;
		case "auto": return e.min === void 0 ? e.max === void 0 ? t : `fit-content(${as(e.max)}px)` : `minmax(${as(e.min)}px, auto)`;
	}
}
function as(e) {
	return String(Math.round(e * 1e3) / 1e3);
}
function os(e) {
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
function ss(e, t) {
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
function cs(e, t, n) {
	let r = 0, i = n;
	for (let n of t) n < e && n + 1 > r ? r = n + 1 : n > e && n < i && (i = n);
	let a = ls(r, e), o = ls(e + 1, i);
	return a.length === 0 || o.length === 0 ? null : {
		before: a,
		after: o
	};
}
function ls(e, t) {
	let n = [];
	for (let r = e; r < t; r++) n.push(r);
	return n;
}
function us(e, t, n, r, i = ds) {
	let a = ps(e, t, n.before), o = ps(e, t, n.after);
	if (a.total + o.total <= 0) return null;
	let s = Math.max(a.min - a.total, o.total - o.max), c = Math.min(a.max - a.total, o.total - o.min);
	if (s > c) return null;
	let l = fs(Math.min(Math.max(r, s), c), r, a.total, o.total, s, c, i);
	if (l === 0) return null;
	let u = [...e], d = n.before.every((t) => e[t].kind === "star"), f = n.after.every((t) => e[t].kind === "star");
	if (d && f) {
		let t = vs(n.before, e) + vs(n.after, e), r = a.total + o.total;
		ms(u, e, a, t * (a.total + l) / r), ms(u, e, o, t * (o.total - l) / r);
	} else d || hs(u, a, a.total + l), f || hs(u, o, o.total - l);
	return u;
}
var ds = 120;
function fs(e, t, n, r, i, a, o) {
	let s = e, c = n + s, l = r - s;
	return c > 0 && c < o ? s = t < 0 ? -n : o - n : l > 0 && l < o && (s = t > 0 ? r : r - o), Math.min(Math.max(s, i), a);
}
function ps(e, t, n) {
	let r = _s(n, t), i = n.map((e) => r > 0 ? t[e] / r : 1 / n.length), a = 0, o = Infinity;
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
function ms(e, t, n, r) {
	let i = vs(n.indices, t);
	for (let a = 0; a < n.indices.length; a++) {
		let o = n.indices[a], s = i > 0 && n.total > 0 ? n.shares[a] : 1 / n.indices.length;
		e[o] = {
			...t[o],
			value: r * s
		};
	}
}
function hs(e, t, n) {
	for (let r = 0; r < t.indices.length; r++) {
		let i = t.indices[r];
		e[i] = {
			kind: "px",
			value: n * t.shares[r],
			...gs(e[i])
		};
	}
}
function gs(e) {
	return {
		...e.min === void 0 ? {} : { min: e.min },
		...e.max === void 0 ? {} : { max: e.max }
	};
}
function _s(e, t) {
	let n = 0;
	for (let r of e) n += t[r];
	return n;
}
function vs(e, t) {
	let n = 0;
	for (let r of e) n += t[r].value;
	return n;
}
function ys(e, t) {
	return Math.round(bs(e, t) * 100);
}
function bs(e, t) {
	let n = _s(t.before, e), r = n + _s(t.after, e);
	return r <= 0 ? 0 : n / r;
}
function xs(e, t, n) {
	let r = _s(t.before, e);
	return (r + _s(t.after, e)) * Math.min(Math.max(n, 0), 1) - r;
}
function Ss(e) {
	let t = e === null || e.length === 0 ? NaN : Number(e);
	return t >= 0 && t <= 1 ? t : null;
}
function Cs(e, t) {
	let n = [];
	for (let r = 0, i = 0; r < t; r++) n.push(i), i += Number.isFinite(e[r]) ? e[r] : 0;
	return n;
}
var ws = /* @__PURE__ */ new Set();
function Ts(e, t, n) {
	let r = t.before.reduce((t, n) => t + (e[n] ?? 0), 0), i = t.after.reduce((t, n) => t + (e[n] ?? 0), 0);
	return r >= 1 && r < n ? -r : i >= 1 && i < n ? i : 0;
}
function Es(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let i of [t.before, t.after]) i.reduce((t, n) => t + (e[n] ?? 0), 0) < n && i.forEach((e) => r.add(e));
	return r;
}
function Ds(e, t) {
	return e.map((e, n) => t.has(n) ? {
		kind: "px",
		value: 0
	} : e);
}
function Os(e, t, n, r = ws) {
	let i = Number(e);
	if (!Number.isInteger(i) || i < 1) return !1;
	let a = /^span\s+(\d+)$/.exec(t.trim()), o = Number(t), s = a === null ? Number.isInteger(o) && o > i ? o : i + 1 : i + Number(a[1]);
	return s - 1 <= n.length && n.slice(i - 1, s - 1).every((e, t) => e < 1 || r.has(i - 1 + t));
}
//#endregion
//#region src/extensions/value-readers.ts
function ks(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" ? String(e) : JSON.stringify(e);
}
function As(e) {
	return e == null;
}
var js = "data-ui-trim-input", Ms = class {
	readers = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let e of Is) this.register(e);
		for (let t of e ?? []) this.register(t);
	}
	register(e) {
		this.readers.set(e.kind, e.read);
	}
	read(e) {
		let t = e.getAttribute(bt);
		if (t === null) return Ns(e);
		let n = this.readers.get(t);
		return n === void 0 ? (s("value reader: no reader registered for this kind.", { kind: t }), null) : n(e);
	}
	readBound(e) {
		let t = this.read(e);
		return typeof t == "string" && e.hasAttribute(js) ? t.trim() : t;
	}
	readHeld(e) {
		let t = Fs(e);
		return t === null ? null : this.read(t);
	}
};
function Ns(e) {
	if (e instanceof HTMLInputElement) switch (e.type) {
		case "checkbox": return e.checked;
		case "number":
		case "range": return e.value.trim().length === 0 ? null : Number(e.value);
		default: return e.value;
	}
	return e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement ? e.value : e instanceof HTMLDetailsElement ? e.open : null;
}
var Ps = "input, textarea, select";
function Fs(e) {
	return e.hasAttribute("data-ui-value-kind") || e.matches(Ps) ? e : e.querySelector("[data-ui-value-holder]") ?? e.querySelector(`[data-ui-value-kind], ${Ps}`);
}
var Is = [
	{
		kind: "flyout-open",
		read: (e) => e.classList.contains("ui-flyout--open")
	},
	{
		kind: "splitter-position",
		read: (e) => Ss(e.getAttribute(En))
	},
	{
		kind: "pane-layout",
		read: (e) => e.getAttribute(Dn)
	},
	{
		kind: "tabs-selected",
		read: (e) => e.getAttribute(Pr)
	},
	{
		kind: "tab-caption",
		read: (e) => e.getAttribute(Fr)
	},
	{
		kind: "tab-pinned",
		read: (e) => e.hasAttribute(Ir)
	},
	{
		kind: "tree-title",
		read: (e) => e.getAttribute($n)
	},
	{
		kind: "tree-drop-target",
		read: (e) => e.getAttribute("data-ui-tree-drop-target") ?? ""
	},
	{
		kind: "selected-key",
		read: (e) => e.getAttribute(jr)
	},
	{
		kind: "selected-keys",
		read: (e) => Ls(e, Mr)
	},
	{
		kind: xt,
		read: (e) => Ls(e, at)
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
function Ls(e, t) {
	let n = e.getAttribute(t);
	return n === null ? null : JSON.parse(n);
}
function Rs(e) {
	if (e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio")) {
		e.checked = !1;
		return;
	}
	(e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement) && (e.value = "");
}
//#endregion
//#region src/interactions/keyboard-shortcut.ts
function zs(e) {
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
		default: o = Qs(e);
	}
	return o === null ? null : {
		code: o,
		ctrl: n,
		shift: r,
		alt: i,
		meta: a
	};
}
function Bs(e, t, n = Ks()) {
	return t.code !== e.code || t.shiftKey !== e.shift || t.altKey !== e.alt ? !1 : e.ctrl && !e.meta && n ? t.ctrlKey !== t.metaKey : t.ctrlKey === e.ctrl && t.metaKey === e.meta;
}
function Vs(e, t = Ks()) {
	let n = Hs(e.code, t);
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
function Hs(e, t) {
	return /^Key[A-Z]$/.test(e) ? e.slice(3) : /^Digit[0-9]$/.test(e) ? e.slice(5) : (t ? Ws[e] : void 0) ?? Us[e] ?? e;
}
var Us = {
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
}, Ws = {
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
}, Gs = null;
function Ks() {
	return Gs === null && (Gs = qs()), Gs;
}
function qs() {
	if (typeof navigator > "u") return !1;
	let e = navigator.userAgentData?.platform;
	return /mac/i.test(e ?? navigator.platform ?? "");
}
var Js = {
	words(e) {
		let t = zs(e);
		return t === null ? null : Vs(t);
	},
	matches(e, t) {
		let n = zs(t);
		return n !== null && Bs(n, e);
	},
	isComposing: k
}, Ys = 229;
function k(e) {
	return e.isComposing || e.keyCode === Ys;
}
function A(e, t = {}) {
	return !e.ctrlKey && !e.metaKey && (t.alt === !0 || !e.altKey) && (t.shift === !0 || !e.shiftKey) && !k(e);
}
var Xs = class {
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
function Zs(e) {
	return [
		e.ctrl ? "ctrl" : "",
		e.shift ? "shift" : "",
		e.alt ? "alt" : "",
		e.meta ? "meta" : "",
		e.code
	].filter((e) => e.length > 0).join("+");
}
function Qs(e) {
	if (e.length === 1) {
		let t = e.toUpperCase();
		return t >= "A" && t <= "Z" ? `Key${t}` : t >= "0" && t <= "9" ? `Digit${t}` : $s[t] ?? null;
	}
	let t = e.length === 0 ? "" : e[0].toUpperCase() + e.slice(1).toLowerCase();
	return /^F([1-9]|1[0-9]|2[0-4])$/.test(t.toUpperCase()) ? t.toUpperCase() : $s[t] ?? null;
}
var $s = {
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
}, ec = "data-ui-rename-field";
function tc(e) {
	return e instanceof Element && e.closest(`[${ec}]`) !== null;
}
function nc(e) {
	let { container: t, title: n } = e;
	if (t.querySelector(`.${e.className}`) !== null) return !1;
	let r = document.createElement("input");
	r.type = "text", r.className = e.className, r.setAttribute(ec, ""), r.setAttribute(Ze, ""), r.value = e.value, rc(r, n, t);
	let i = !1, a = (t, a) => {
		if (i) return;
		i = !0;
		let o = r.value.trim();
		r.remove(), n.style.visibility = "", t && (o.length > 0 || e.allowEmpty === !0) && o !== e.value && e.commit(o), e.done?.(), a && e.refocus?.();
	};
	return r.addEventListener("keydown", (e) => {
		if (!k(e)) {
			if (e.key === "Enter") a(!0, !0);
			else if (e.key === "Escape") a(!1, !0);
			else return;
			e.preventDefault(), e.stopPropagation();
		}
	}), r.addEventListener("blur", () => a(!0, !1)), n.style.visibility = "hidden", t.appendChild(r), r.focus(), r.setSelectionRange(0, r.value.length, "backward"), r.scrollLeft = 0, !0;
}
function rc(e, t, n) {
	let r = t.getBoundingClientRect(), i = n.getBoundingClientRect(), a = getComputedStyle(t), o = ic(n), s = o > 0 && i.width > 0 ? i.width / o : 1;
	e.style.left = ac((r.left - i.left) / s - n.clientLeft), e.style.top = ac((r.top - i.top) / s - n.clientTop), e.style.width = ac(r.width / s), e.style.height = ac(r.height / s), e.style.fontFamily = a.fontFamily, e.style.fontSize = a.fontSize, e.style.fontWeight = a.fontWeight, e.style.fontStyle = a.fontStyle, e.style.lineHeight = a.lineHeight, e.style.letterSpacing = a.letterSpacing, e.style.textAlign = a.textAlign;
}
function ic(e) {
	let t = getComputedStyle(e), n = parseFloat(t.width);
	return Number.isFinite(n) ? t.boxSizing === "border-box" ? n : n + parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth) : e.offsetWidth;
}
function ac(e) {
	return `${Math.round(e * 64) / 64}px`;
}
//#endregion
//#region src/interactions/field-escape.ts
var oc = "data-ui-runs-on-escape", sc = "ui-key-value-action__row", cc = "ui-key-value-action__value-input", lc = "ui-key-value-action__edit-action";
function uc(e) {
	return k(e) || dc(e.target) !== null;
}
function dc(e) {
	return e instanceof Element ? tc(e) || fc(e) ? e : e.closest("[data-ui-owns-keys]") ?? pc(e)?.cell ?? null : null;
}
function fc(e) {
	return e instanceof Element && e.hasAttribute(oc) && (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && !e.readOnly && !E(e);
}
function pc(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${cc}, .${lc}`), n = t?.closest(".ui-key-value-action__row") ?? null;
	return t === null || n === null || !n.hasAttribute("data-ui-row-editing") ? null : {
		cell: t,
		row: n
	};
}
//#endregion
//#region src/interactions/caret-fields.ts
var mc = /* @__PURE__ */ new Set([
	"text",
	"search",
	"number",
	"password",
	"email",
	"url",
	"tel"
]), hc = /* @__PURE__ */ new Set([
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
]), gc = /* @__PURE__ */ new Set([
	"KeyA",
	"KeyC",
	"KeyV",
	"KeyX",
	"KeyZ",
	"KeyY",
	"Insert"
]), _c = /^F\d{1,2}$/;
function vc(e) {
	return e instanceof HTMLInputElement && mc.has(e.type);
}
function yc(e) {
	return vc(e) || e instanceof HTMLTextAreaElement;
}
function bc(e) {
	return yc(e) || e instanceof HTMLElement && e.isContentEditable;
}
function xc(e) {
	let t = e.target;
	if (!bc(t)) return !1;
	if (k(e)) return !0;
	let n = e.key;
	return n === "Tab" || n === "Escape" || _c.test(n) || e.altKey ? !1 : n === "Enter" ? !vc(t) : e.ctrlKey || e.metaKey ? hc.has(n) || gc.has(e.code) : !0;
}
var Sc = {
	...Js,
	isFieldKey: xc,
	isPlainKey: A,
	isEscapeClaimed: uc
}, Cc = "ui-draft-dropped";
function wc(e) {
	e.dispatchEvent(new Event(Cc, { bubbles: !0 }));
}
//#endregion
//#region src/interactions/own-control.ts
var Tc = `.ui-text-input__row, .ui-number-input__row, .ui-temporal-input__row, .ui-file-input__row, .ui-color-input__row, .${Xr}, .ui-field-box`, Ec = "button, a, input, select, textarea, label, summary, [role='button'], [contenteditable=''], [contenteditable='true']", Dc = `${Ec}, ${Tc}, ${Yr}, .${ye}`, Oc = "button, a, summary, [role='button']";
function kc(e) {
	let t = [];
	for (let n of e.querySelectorAll(Dc)) if (!(n.classList.contains("ui-row__grip") || !Mc(e, n) || jc(e, n) || t.some((e) => e.contains(n))) && (t.push(n), t.length > 1)) return null;
	let n = t[0];
	return n instanceof HTMLElement && n.matches(Oc) ? n : null;
}
function Ac(e) {
	let t = [];
	for (let n of e.querySelectorAll(Ec)) jc(e, n) && Mc(e, n) && t.push(n);
	return t;
}
function jc(e, t) {
	let n = t.closest(`[${pe}]`);
	return n !== null && n !== e && e.contains(n);
}
function Mc(e, t) {
	let n = t.closest(Yr);
	return (n === null || !e.contains(n)) && t.closest(".ui-action-bar") === null;
}
function Nc(e, t) {
	if (!(e instanceof Element)) return null;
	let n = e.closest(Dc);
	return n !== null && n !== t && t.contains(n) ? n : null;
}
//#endregion
//#region src/interactions/roving-focus.ts
function Pc(e) {
	let t = Rc(e.key), n = zc(e.key, e.axis);
	if (t === null && n === 0) return null;
	let r = e.items.filter(M);
	if (r.length === 0) return null;
	if (t !== null) return t === "first" ? r[0] : r[r.length - 1];
	let i = e.current === null ? -1 : r.indexOf(e.current);
	if (i === -1) return n > 0 ? r[0] : r[r.length - 1];
	let a = i + n;
	return a >= 0 && a < r.length ? r[a] : e.loop ?? !0 ? r[(a + r.length) % r.length] : null;
}
function Fc(e, t) {
	return Rc(e) !== null || zc(e, t) !== 0;
}
var Ic = {
	target: Pc,
	applyTabIndex: j
};
function j(e, t) {
	for (let n of e) n.tabIndex = n === t ? 0 : -1;
}
function Lc(e, t) {
	t !== null && (j(e, t), t.focus());
}
function M(e) {
	return e.getClientRects().length > 0 && !E(e);
}
function Rc(e) {
	return e === "Home" ? "first" : e === "End" ? "last" : null;
}
function zc(e, t) {
	return t !== "horizontal" && (e === "ArrowDown" || e === "ArrowUp") ? e === "ArrowDown" ? 1 : -1 : t !== "vertical" && (e === "ArrowRight" || e === "ArrowLeft") ? e === "ArrowRight" ? 1 : -1 : 0;
}
//#endregion
//#region src/items/items-viewport.ts
function Bc(e) {
	return e.hasAttribute("data-ui-host-viewport") ? e.parentElement ?? e : e;
}
function Vc(e) {
	return e instanceof Element ? e.hasAttribute("data-ui-items-host") ? e : e.querySelector(`:scope > [${v}][${Ct}]`) : null;
}
function Hc(e) {
	let t = Bc(e);
	return t === e ? {
		top: e.scrollTop,
		height: e.clientHeight,
		contentHeight: e.scrollHeight
	} : {
		top: t.scrollTop - Wc(e, t),
		height: t.clientHeight,
		contentHeight: e.scrollHeight
	};
}
function Uc(e, t) {
	let n = Bc(e);
	n.scrollTop = n === e ? t : t + Wc(e, n);
}
function Wc(e, t) {
	return e.getBoundingClientRect().top - t.getBoundingClientRect().top - t.clientTop + t.scrollTop;
}
function Gc(e) {
	let t = e.getBoundingClientRect();
	return t.height > 0 || e.firstElementChild === null ? t : e.firstElementChild.getBoundingClientRect();
}
//#endregion
//#region src/interactions/multi-select-keys.ts
function Kc(e) {
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
function qc(e) {
	if (e === null) return null;
	let t = Number(e);
	return Number.isInteger(t) && t > 0 ? t : null;
}
function Jc(e, t) {
	return t !== null && e.length >= t;
}
function Yc(e, t, n) {
	return e.includes(t) ? e.filter((e) => e !== t) : Jc(e, n) ? null : [...e, t];
}
function Xc(e, t) {
	return e.includes(t) ? e.filter((e) => e !== t) : null;
}
var Zc = /[,\uFF0C\r\n]/;
function Qc(e) {
	return Zc.test(e);
}
function $c(e) {
	return e.split(Zc).map((e) => e.trim()).filter((e) => e.length > 0);
}
function el(e) {
	let t = e.split(Zc), n = t.pop() ?? "";
	return {
		tags: t.map((e) => e.trim()).filter((e) => e.length > 0),
		rest: n
	};
}
function tl(e, t, n, r, i) {
	let a = [...e], o = [], s = null;
	for (let e of t) {
		if (a.includes(e.key)) continue;
		let t = [...a, e.key], c = Jc(a, n) ? r : i(a, t);
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
function nl(e, t, n) {
	let r = [];
	for (let i of e.querySelectorAll(t)) i.closest(n) === e && r.push(i);
	return r;
}
function rl(e) {
	return nl(e, vn, `.${dn}`);
}
//#endregion
//#region src/interactions/selected-key.ts
function il(e, t, n) {
	t.length !== 0 && e.getAttribute(n.attribute) !== t && (e.setAttribute(n.attribute, t), n.apply(e), e.hasAttribute(n.bindingAttribute) && e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function al(e, t, n) {
	return e.length === 0 ? null : e.some((e) => n(e) === t) ? t : n(e[0]);
}
//#endregion
//#region src/interactions/row-selection.ts
var ol = "data-ui-bind-selected-keys", N = `.ui-items-view, .ui-table, .${Ln}`, sl = `.ui-items-view__item, .${Nn}, .${Rn}`, cl = ".ui-items-view, .ui-table", ll = {
	shift: !1,
	ctrl: !1
}, ul = /* @__PURE__ */ new WeakMap();
function dl(e, t) {
	t !== null && !ul.has(e) && fl(e, t);
}
function fl(e, t) {
	let n = F(t);
	n.length > 0 && ul.set(e, n);
}
function pl(e) {
	return {
		shift: e.shiftKey,
		ctrl: e.ctrlKey || e.metaKey
	};
}
function ml(e, t) {
	let n = pl(t);
	return n.shift && e.hasAttribute("data-ui-no-row-select") ? {
		shift: !0,
		ctrl: !0
	} : n;
}
function hl(e) {
	return !e.hasAttribute(Jn);
}
function P(e) {
	if (e.getClientRects().length > 0) return e;
	let t = e.querySelector(`:scope > [${ae}]`);
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function gl(e) {
	switch (e.getAttribute(kr)) {
		case "one": {
			let t = e.getAttribute(jr);
			return new Set(t === null || t.length === 0 ? [] : [t]);
		}
		case "many": return new Set(Tl(El(e)));
		default: return /* @__PURE__ */ new Set();
	}
}
function _l(e, t) {
	let n = gl(e), r = e.getAttribute(kr), i = r === "one" || r === "many";
	for (let e of t) {
		let t = n.has(F(e));
		e.toggleAttribute(Ar, t), i ? e.setAttribute("aria-selected", t ? "true" : "false") : e.removeAttribute("aria-selected");
	}
}
function vl(e) {
	return e.filter((e) => e.hasAttribute(Ar));
}
function yl(e, t, n, r, i) {
	let a = F(n);
	if (!Sl(n)) return !1;
	switch (e.getAttribute(kr)) {
		case "one": return il(e, a, {
			attribute: jr,
			bindingAttribute: Nr,
			apply: (e) => _l(e, t)
		}), !0;
		case "many": return bl(e, t, n, a, r, i), !0;
		default: return !1;
	}
}
function bl(e, t, n, r, i, a) {
	let o = El(e);
	if (o === null) return;
	let s = Tl(o), c;
	if (i.shift) {
		let o = ul.get(e), l = o === void 0 ? null : a?.(o, r) ?? null, u = t.find((e) => F(e) === o) ?? n, d = l === null ? wl(t, u, n).map(F) : Cl(l, t);
		c = i.ctrl ? [...s.filter((e) => !d.includes(e)), ...d] : d;
	} else i.ctrl ? (c = s.includes(r) ? s.filter((e) => e !== r) : [...s, r], ul.set(e, r)) : (c = [r], ul.set(e, r));
	xl(e, t, c);
}
function xl(e, t, n) {
	let r = El(e);
	if (r === null) return;
	let i = JSON.stringify(n);
	r.getAttribute("data-ui-selected-keys") !== i && (r.setAttribute(Mr, i), _l(e, t), r.hasAttribute(ol) && r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function Sl(e) {
	return F(e).length > 0 && !qo(e, "data-ui-unselectable") && !D(e);
}
function Cl(e, t) {
	let n = new Map(t.map((e) => [F(e), e]));
	return e.filter((e) => {
		let t = n.get(e);
		return t === void 0 || P(t) !== null && Sl(t);
	});
}
function wl(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	return r < 0 || i < 0 ? [n] : e.slice(Math.min(r, i), Math.max(r, i) + 1).filter((e) => P(e) !== null && Sl(e));
}
function Tl(e) {
	return Kc(e?.getAttribute("data-ui-selected-keys") ?? null);
}
function El(e) {
	let t = e.closest(b);
	for (let n of e.querySelectorAll(`[${v}]`)) if (n.closest(N) === e && n.closest(b) === t) return n;
	return null;
}
function F(e) {
	return e.getAttribute("data-ui-key") ?? "";
}
var Dl = {
	isSelected: (e) => e.hasAttribute(Ar),
	toggle: Ol,
	setSelected: kl,
	setSelectedKeys: Al
};
function Ol(e) {
	let t = e.closest(N);
	t !== null && e instanceof HTMLElement && yl(t, jl(t), e, {
		shift: !1,
		ctrl: !0
	});
}
function kl(e, t, n) {
	let r = [];
	for (let e of t) e.classList.contains("ui-hidden") || r.push(F(e));
	Al(e, r, n);
}
function Al(e, t, n) {
	if (!(e instanceof HTMLElement)) return;
	let r = jl(e), i = new Set(r.filter((e) => !Sl(e)).map(F)), a = /* @__PURE__ */ new Set();
	for (let e of t) e.length > 0 && !i.has(e) && a.add(e);
	let o = [...gl(e)].filter((e) => !a.has(e));
	xl(e, r, n ? [...o, ...a] : o);
}
function jl(e) {
	return nl(e, sl, N);
}
//#endregion
//#region src/interactions/table-column-layout.ts
var Ml = "--ui-table-order-";
function Nl(e) {
	let t = new Set((e.getAttribute("data-ui-table-hidden") ?? "").split(" ").filter((e) => e.length > 0)), n = e instanceof HTMLElement ? e.style : null;
	return {
		place: (e) => {
			let t = n?.getPropertyValue(`--ui-table-order-${e}`).trim() ?? "";
			return t.length === 0 ? e : Number(t);
		},
		isHidden: (e) => t.has(String(e))
	};
}
var Pl = "ui-table", Fl = `[${kn}]:not(.${In})`, Il = `.${Nn} > [aria-colspan]:not([${kn}])`;
function Ll(e, t, n, r) {
	let i = /* @__PURE__ */ new Map();
	for (let e of t) n.has(e) || i.set(e, String(i.size + 1));
	let a = String(i.size), o = r ? ":not([aria-colindex])" : "";
	Rl(e, "aria-colcount", a);
	for (let t of e.querySelectorAll(`${Fl}${o}, ${Il}${o}`)) {
		if (t.closest(`.${Pl}`) !== e) continue;
		if (!t.hasAttribute("data-ui-table-column")) {
			Rl(t, "aria-colindex", "1"), Rl(t, "aria-colspan", a);
			continue;
		}
		let n = i.get(Number(t.getAttribute(kn)));
		n === void 0 ? t.removeAttribute("aria-colindex") : Rl(t, "aria-colindex", n);
	}
}
function Rl(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/interactions/row-cursor.ts
var zl = ".ui-table[role='grid']", Bl = "gridcell", Vl = "aria-colspan", Hl = /* @__PURE__ */ new WeakMap();
function Ul(e) {
	let t = e.closest(N);
	if (t === null) return null;
	if (e === t) return {
		root: t,
		row: null
	};
	let n = e.closest(sl);
	return n !== null && n.closest(N) === t ? {
		root: t,
		row: n
	} : null;
}
function Wl(e) {
	return e.target instanceof Element && !xc(e) ? Gl(e.target) : null;
}
function Gl(e) {
	let t = Ul(e);
	if (t === null || t.row !== null && Nc(e, t.row) !== null) return null;
	let n = e.closest(`[${Jr}]`);
	return n !== null && n !== t.root && t.root.contains(n) ? null : t;
}
function Kl(e) {
	return e.filter((e) => P(e) !== null && !D(e));
}
function ql(e) {
	return Jl(e) ?? Kl(e)[0] ?? null;
}
function Jl(e) {
	return e.find((e) => e.hasAttribute("data-ui-row-focus")) ?? e.find((e) => e.hasAttribute("data-ui-selected") && !D(e)) ?? null;
}
function Yl(e) {
	return Jl(jl(e));
}
function Xl(e, t) {
	if (e.hasAttribute("data-ui-row-cursor-waits") || t.some((e) => e.hasAttribute("data-ui-row-focus"))) return;
	let n = ql(t);
	n !== null && Ql(e, t, n);
}
function Zl(e, t) {
	t === null ? e.removeAttribute("aria-labelledby") : e.setAttribute("aria-labelledby", pi(t, "ui-row-name"));
}
function Ql(e, t, n, r = null, i = !0) {
	for (let e of t) e !== n && e.hasAttribute("data-ui-row-focus") && e.removeAttribute(Ne);
	n.hasAttribute("data-ui-row-focus") || n.setAttribute(Ne, ""), e.removeAttribute(Pe);
	let a = $l(e, n, r);
	i && ((P(n) ?? n).scrollIntoView({ block: "nearest" }), a !== null && au(e, n, a));
}
function $l(e, t, n) {
	let r = eu(e) ? tu(e, t, n) : null;
	for (let t of e.querySelectorAll(`[${Ie}]`)) t !== r && t.closest(N) === e && t.removeAttribute(Ie);
	if (r === null) return e.setAttribute("aria-activedescendant", pi(t, "ui-row")), null;
	r.hasAttribute("data-ui-cell-focus") || r.setAttribute(Ie, "");
	let i = r.getAttribute(kn);
	return i !== null && Hl.set(e, i), e.setAttribute("aria-activedescendant", pi(r, "ui-cell")), r;
}
function eu(e) {
	return e.matches(zl);
}
function tu(e, t, n) {
	if (n instanceof HTMLElement && n.parentElement === t && n.getAttribute("role") === Bl) {
		if (!n.hasAttribute("data-ui-owns-keys")) return n;
		let e = nu(t, n.getAttribute(kn));
		if (e !== null) return e;
	}
	let r = ru(e, t), i = Hl.get(e);
	if (i === void 0) return r[0] ?? null;
	let a = r.find((e) => e.getAttribute(kn) === i);
	if (a !== void 0) return a;
	let o = Nl(e), s = o.place(Number(i)), c = (e) => Math.abs(o.place(Number(e.getAttribute(kn))) - s);
	return r.reduce((e, t) => e === null || c(t) < c(e) ? t : e, null);
}
function nu(e, t) {
	for (let n of e.children) if (t !== null && n instanceof HTMLElement && n.getAttribute("data-ui-table-column") === t && iu(n)) return n;
	return null;
}
function ru(e, t) {
	let n = Nl(e), r = [];
	for (let e of t.children) {
		let t = Number(e.getAttribute("data-ui-table-column") ?? NaN);
		e instanceof HTMLElement && Number.isInteger(t) && iu(e) && !n.isHidden(t) && r.push({
			cell: e,
			place: n.place(t)
		});
	}
	return r.sort((e, t) => e.place - t.place).map((e) => e.cell);
}
function iu(e) {
	return e.getAttribute("role") === Bl && !e.hasAttribute("data-ui-owns-keys");
}
function au(e, t, n) {
	let r = e.querySelector(`:scope > .${Pn}`);
	if (r === null || !(r.scrollWidth > r.clientWidth) || !n.hasAttribute("data-ui-table-column")) return;
	let i = r.getBoundingClientRect(), a = i.left + i.width / 2, o = i.left + r.clientLeft, s = o + r.clientWidth;
	for (let e of t.children) {
		if (e === n || !(e instanceof HTMLElement) || getComputedStyle(e).position !== "sticky") continue;
		let t = e.getBoundingClientRect();
		t.left + t.width / 2 < a ? o = Math.max(o, t.right) : s = Math.min(s, t.left);
	}
	let c = n.getBoundingClientRect();
	r.scrollLeft += ou(c.left, c.right, o, s);
}
function ou(e, t, n, r) {
	return e < n ? e - n : t > r ? Math.min(t - r, e - n) : 0;
}
function su(e) {
	for (let t of e.children) if (t instanceof HTMLElement && t.hasAttribute("data-ui-cell-focus")) return t;
	return null;
}
function cu(e) {
	return Hl.get(e) ?? null;
}
function lu(e, t, n, r) {
	if (n !== null && fu(n)) return null;
	let i = ru(e, t), a = n?.getAttribute("data-ui-table-column") ?? null, o = i.findIndex((e) => e.getAttribute(kn) === a);
	switch (r) {
		case "Home": return i[0] ?? null;
		case "End": return i[i.length - 1] ?? null;
		case "ArrowLeft": return o > 0 ? i[o - 1] : null;
		case "ArrowRight": return o < 0 ? i[0] ?? null : i[o + 1] ?? null;
		default: return null;
	}
}
function uu(e, t, n, r) {
	let i = du(t), a = (n === null ? -1 : i.indexOf(n)) + (r ? 1 : -1);
	return i.length === 0 || a < -1 || a >= i.length ? null : a === -1 ? tu(e, t, null) : i[a];
}
function du(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && fu(e));
}
function fu(e) {
	return iu(e) && e.hasAttribute(Vl) && !e.hasAttribute("data-ui-table-column");
}
function pu(e) {
	let t = du(e);
	return t[t.length - 1] ?? null;
}
function mu(e, t) {
	let n = t;
	for (; n !== null && n.parentElement !== e;) n = n.parentElement;
	return n?.getAttribute("role") === Bl ? n : null;
}
function hu(e, t = null) {
	let n = e.closest(N);
	n !== null && e instanceof HTMLElement && Ql(n, jl(n), e, t);
}
function gu(e, t) {
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
function _u(e, t) {
	return Fc(e, t === "grid" ? "both" : t) || t !== "horizontal" && vu(e);
}
function vu(e) {
	return e === "PageDown" || e === "PageUp";
}
function yu(e, t, n, r) {
	if (!_u(e, r)) return null;
	let i = Kl(t);
	if (vu(e)) return bu(i, n, e === "PageDown");
	if (r === "grid" && (e === "ArrowUp" || e === "ArrowDown")) return xu(i, n, e === "ArrowDown");
	let a = i.map((e) => P(e) ?? e), o = Pc({
		key: e,
		items: a,
		current: n === null ? null : P(n),
		axis: r === "grid" ? "horizontal" : r,
		loop: !1
	});
	return o === null ? null : i[a.indexOf(o)] ?? null;
}
function bu(e, t, n) {
	let r = t === null ? -1 : e.indexOf(t), i = r < 0 ? null : e[r].parentElement;
	if (i === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let a = (P(e[r]) ?? e[r]).getBoundingClientRect(), o = Math.min(Hc(i).height, window.innerHeight), s = n ? 1 : -1, c = null;
	for (let t = r + s; t >= 0 && t < e.length; t += s) {
		let r = (P(e[t]) ?? e[t]).getBoundingClientRect();
		if (c !== null && (n ? r.bottom > a.top + o + .5 : r.top < a.bottom - o - .5)) break;
		c = e[t];
	}
	return c;
}
function xu(e, t, n) {
	let r = t === null ? null : P(t);
	if (r === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let i = r.getBoundingClientRect(), a = Su(i), o = e.map((e) => ({
		row: e,
		rect: (P(e) ?? e).getBoundingClientRect()
	})).filter(({ rect: e }) => n ? e.top >= i.bottom - .5 : e.bottom <= i.top + .5);
	if (o.length === 0) return null;
	let s = o.reduce((e, t) => (n ? t.rect.top < e.rect.top : t.rect.bottom > e.rect.bottom) ? t : e);
	return o.filter(({ rect: e }) => n ? e.top < s.rect.bottom - .5 : e.bottom > s.rect.top + .5).reduce((e, t) => Math.abs(Su(t.rect) - a) < Math.abs(Su(e.rect) - a) ? t : e).row;
}
function Su(e) {
	return e.left + e.width / 2;
}
var Cu = "ui-row-press";
function wu(e, t, n) {
	(e.hasAttribute("data-ui-id") ? e : e.querySelector(":scope > [data-ui-id]") ?? e).dispatchEvent(n === void 0 ? new Event(t, { bubbles: !0 }) : new CustomEvent(t, {
		bubbles: !0,
		detail: n
	}));
}
function Tu(e, t, n) {
	let r = n.hasAttribute(Ne), i = n.contains(document.activeElement);
	if (!r && !i) return null;
	let a = t.indexOf(n), o = t.filter((e) => e !== n);
	return () => {
		if (i && e.focus({ preventScroll: !0 }), !r) return;
		let n = Eu(t, o, a);
		n !== null && Ql(e, o, n);
	};
}
function Eu(e, t, n) {
	let r = Kl(t);
	return n < 0 || r.length === 0 ? null : r.find((t) => e.indexOf(t) > n) ?? r[r.length - 1];
}
function Du(e, t) {
	let n = t.find((e) => e.hasAttribute(Ne));
	if (n === void 0 || P(n) !== null) return;
	let r = Eu(t, t, t.indexOf(n));
	if (r !== null) {
		Ql(e, t, r, null, !1);
		return;
	}
	n.removeAttribute(Ne), su(n)?.removeAttribute(Ie), e.removeAttribute("aria-activedescendant");
}
function Ou(e) {
	let t = e.parentElement, n = t?.closest(N) ?? null;
	return n !== null && (n === t || n === t?.parentElement) ? n : t;
}
function ku(e) {
	let t = e.hasAttribute(Ne), n = e.contains(document.activeElement);
	return t || n ? {
		cursor: t,
		focus: n,
		key: e.getAttribute(_)
	} : null;
}
function Au(e, t, n) {
	let r = Ou(e);
	if (n !== null && r !== null && (n.focus && !r.contains(document.activeElement) && r.focus({ preventScroll: !0 }), n.cursor)) {
		if (t === null) {
			typeof n.key == "string" && r.setAttribute(Pe, n.key);
			return;
		}
		[...e.children].some((e) => e !== t && e.hasAttribute("data-ui-row-focus")) || Nu(r, t);
	}
}
function ju(e, t) {
	let n = Ou(e), r = n?.getAttribute("data-ui-row-cursor-waits") ?? null;
	n !== null && r !== null && r === t.getAttribute("data-ui-key") && (n.removeAttribute(Pe), [...e.children].some((e) => e !== t && e.hasAttribute("data-ui-row-focus")) || Nu(n, t));
}
function Mu(e) {
	return e.getAttribute(Pe);
}
function Nu(e, t) {
	t.setAttribute(Ne, ""), $l(e, t, null);
}
//#endregion
//#region src/interactions/popup-focus.ts
var Pu = "data-ui-active", Fu = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(","), Iu = /* @__PURE__ */ new Set([
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
]), Lu = !1, Ru = !1, zu = null, Bu = /* @__PURE__ */ new Set(), Vu = [], Hu = /* @__PURE__ */ new WeakSet();
typeof window < "u" && (window.addEventListener("pointerdown", (e) => Uu(e.target, e.pointerType), !0), window.addEventListener("keydown", (e) => Wu(e), !0), window.addEventListener("focus", (e) => Gu(e.target), !0), window.addEventListener("focusin", (e) => Gu(e.target), !0), window.addEventListener("focusout", (e) => Ku(e), !0));
function Uu(e, t = "") {
	Lu = !0, Ru = t === "touch";
	let n = document.activeElement;
	zu = n, n instanceof Element && n !== document.body && e instanceof Node && n.contains(e) && Zu(n, !qu(n)), Qu(n);
}
function Wu(e) {
	if (!(e instanceof KeyboardEvent && Iu.has(e.key))) {
		Lu = !1;
		for (let e of [...Bu]) Zu(e, !1);
		Qu(document.activeElement);
	}
}
function Gu(e) {
	Lu && !qu(e) && Zu(e, !0), e === document.activeElement && Qu(document.activeElement);
}
function Ku(e) {
	e.target instanceof Element && e.target.hasAttribute(Pu) || Zu(e.target, !1), e.relatedTarget === null && queueMicrotask(() => Qu(document.activeElement));
}
function qu(e) {
	return yc(e) ? !e.readOnly && !e.disabled : e instanceof HTMLElement && (e.isContentEditable || e.getAttribute("role") === "spinbutton" && e.getAttribute("aria-readonly") !== "true");
}
function Ju() {
	return Lu && zu instanceof HTMLElement && zu !== document.body ? zu : null;
}
function Yu() {
	return Lu;
}
function Xu() {
	return Lu && Ru;
}
function Zu(e, t) {
	if (e instanceof Element) {
		if (t) {
			for (let e of Bu) e.isConnected || Bu.delete(e);
			Bu.add(e);
		} else Bu.delete(e);
		e.hasAttribute("data-ui-pointer-focus") !== t && e.toggleAttribute(Tr, t), e === document.activeElement && Qu(e);
	}
}
function Qu(e) {
	let t = e === null || e === document.body || qu(e) ? null : e.hasAttribute("data-ui-pointer-focus") ? "pointer" : "keyboard", n = e === null || t === null ? [] : $u(e);
	for (let e of Vu) n.includes(e) || e.removeAttribute(Er);
	for (let e of n) t !== null && e.getAttribute("data-ui-focus-within") !== t && e.setAttribute(Er, t);
	Vu = n;
}
function $u(e) {
	let t = [];
	for (let n = e.parentElement; n !== null && n !== document.body && !n.hasAttribute("data-ui-region") && (t.push(n), !(n.hasAttribute("data-ui-id") && !ed(n))); n = n.parentElement);
	return t;
}
function ed(e) {
	return e.classList.contains("ui-menu--nested") || (e.parentElement?.closest(Tc) ?? null) !== null;
}
function I(e) {
	Gu(e), td(e);
}
function td(e) {
	Qu(e), e.focus({ preventScroll: !0 }), Qu(document.activeElement);
}
function nd(e) {
	Zu(e, !0), td(e);
}
function rd(e) {
	for (let t of e.querySelectorAll(Fu)) if (Jo(t)) return t;
	return null;
}
var id = {
	first: rd,
	stops: (e) => ad(e, document.activeElement),
	giveBack: (e) => pd(e),
	trapTab: cd
};
function ad(e, t) {
	let n = [...e.querySelectorAll(Fu)].filter((e) => e === t || e.tabIndex >= 0 && Jo(e)), r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let t = od(e);
		if (t === null) continue;
		let n = r.get(t);
		(n === void 0 || !sd(n) && sd(e)) && r.set(t, e);
	}
	return n.filter((e) => {
		let t = od(e);
		return t === null || r.get(t) === e;
	});
}
function od(e) {
	return e instanceof HTMLInputElement && e.type === "radio" && e.name !== "" ? e.name : null;
}
function sd(e) {
	return e instanceof HTMLInputElement && e.checked;
}
function cd(e, t) {
	let n = ad(e, document.activeElement);
	if (n.length === 0) {
		t.preventDefault();
		return;
	}
	let r = ld(e, n, document.activeElement, t.shiftKey);
	r !== null && (t.preventDefault(), r.focus());
}
function ld(e, t, n, r) {
	let i = t[0], a = t[t.length - 1];
	return n === null || !e.contains(n) ? r ? a : i : !r && ud(n, a) ? i : r && ud(n, i) ? a : null;
}
function ud(e, t) {
	return e === t || od(e) !== null && od(e) === od(t);
}
var dd = `.${Wr}, .${Gr}, [${qr}]`;
function fd(e) {
	let t = Ul(e)?.root ?? null;
	for (let n = e.parentElement; n !== null; n = n.parentElement) if ((n === t || n.matches(dd)) && n.hasAttribute("tabindex") && Jo(n)) return n;
	return null;
}
function pd(e, t = fd(e)) {
	let n = document.activeElement;
	if (t?.isConnected !== !0 || n !== null && n !== document.body) return;
	let r = Ul(e);
	r?.root === t && r.row !== null && Ql(t, jl(t), r.row, mu(r.row, e)), I(t);
}
function md(e, t) {
	if (e.contains(document.activeElement)) return null;
	let n = document.activeElement instanceof HTMLElement ? document.activeElement : null, r = t ?? rd(e);
	return Lu ? Hu.add(e) : Hu.delete(e), (r === null || r === e) && !e.hasAttribute("tabindex") && (e.tabIndex = -1), I(r ?? e), n;
}
function hd(e, t) {
	e.scrollTop = 0, e.scrollLeft = 0;
	let n = t ?? rd(e);
	return n !== null && gd(e, n), md(e, n);
}
function gd(e, t) {
	let n = e.getBoundingClientRect().top + e.clientTop, r = n + e.clientHeight, i = t.getBoundingClientRect();
	i.bottom > r && (e.scrollTop += Math.min(i.bottom - r, i.top - n));
}
function _d(e, t, n = !1) {
	if (Lu) {
		j(t, null), e.hasAttribute("tabindex") || (e.tabIndex = -1), I(e);
		return;
	}
	let r = t.filter(M), i = (n ? r[r.length - 1] : r[0]) ?? null;
	i !== null && (j(t, i), I(i));
}
function vd(e, t = null) {
	let n = e == null ? null : e.isConnected ? e : yd(e, t);
	for (let e = n; e !== null; e = e.parentElement) if (e.matches(`${Fu}, [tabindex]`) && Jo(e)) return e;
	return n === null ? null : bd(n);
}
function yd(e, t) {
	if (t === null) return null;
	for (let n = e.closest(b); n !== null; n = n.parentElement?.closest(b) ?? null) {
		let e = t.findEveryComponent(w(n)).filter((e) => e.isConnected);
		if (e.length === 1 && e[0] instanceof HTMLElement) return e[0];
	}
	return null;
}
function bd(e) {
	for (let t = e.closest(b); t !== null; t = t.parentElement?.closest(b) ?? null) if (Jo(t)) return xd(t), t;
	return null;
}
function xd(e) {
	if (e.hasAttribute("tabindex") || e.tabIndex >= 0) return;
	e.tabIndex = -1;
	let t = (n) => {
		n.target === e && (e.removeAttribute("tabindex"), e.removeEventListener("focusout", t));
	};
	e.addEventListener("focusout", t);
}
function Sd(e, t) {
	let n = document.activeElement;
	e == null || !t.contains(n) || (Cd(n, t) && Zu(e, !qu(e)), I(e));
}
function Cd(e, t) {
	for (let n = e; n !== null; n = n === t ? null : n.parentElement ?? null) if (Hu.has(n)) return !0;
	return !1;
}
//#endregion
//#region src/updates/value-binding-engine.ts
var wd = "data-ui-clear", Td = ["change", "toggle"], Ed = [
	...Td,
	"expand",
	"collapse",
	"open",
	"close"
];
function Dd(e) {
	let t = vi(e);
	return t === "TwoWay" || t === "OneWayToSource" || t === "OnSubmit";
}
function Od(e) {
	return vi(e) === "OnSubmit";
}
function kd(e, t) {
	let n = e.getAttribute(Ye);
	if (n !== null) {
		let e = t.getBindingById(Number(n));
		return {
			bindingId: n,
			binding: e,
			buffered: e !== void 0 && Od(e.mode)
		};
	}
	for (let n of e.getAttributeNames()) {
		if (!n.startsWith("data-ui-bind-")) continue;
		let r = e.getAttribute(n) ?? "", i = t.getBindingById(Number(r));
		if (i !== void 0 && Dd(i.mode)) return {
			bindingId: r,
			binding: i,
			buffered: Od(i.mode)
		};
	}
	return null;
}
var Ad = class {
	options;
	root;
	pendingSyncByComponent = /* @__PURE__ */ new WeakMap();
	bufferedElements = /* @__PURE__ */ new Set();
	unanswered = /* @__PURE__ */ new Map();
	sends = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document;
		for (let e of Td) this.root.addEventListener(e, (e) => {
			this.handleValueEventAsync(e).catch((e) => {
				c("value binding engine failed.", e);
			});
		}, !0);
		this.root.addEventListener("input", (e) => this.holdEdited(e), !0), this.root.addEventListener(Cc, (e) => this.releaseDropped(e)), this.root.addEventListener("click", (e) => this.handleClear(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && e.target.closest(`[${wd}]`) !== null && e.preventDefault();
		}, !0);
	}
	holdEdited(e) {
		!(e.target instanceof Element) || this.bufferedElements.has(e.target) || !e.target.hasAttribute("data-ui-form-id") || kd(e.target, this.options.metadata)?.buffered === !0 && this.bufferValue(e.target);
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
		let t = e.target.closest(`[${wd}]`);
		if (t === null) return;
		let n = t.closest(b), r = n?.querySelector("[data-ui-bind-value]") ?? n?.querySelector("input, textarea, select");
		r == null || jd(r) || (Rs(r), r.dispatchEvent(new Event("input", { bubbles: !0 })), r.dispatchEvent(new Event("change", { bubbles: !0 })), yc(r) && document.activeElement !== r && I(r));
	}
	async handleValueEventAsync(e) {
		if (!(e.target instanceof Element) || e.type === "change" && (O(e.target) || E(e.target))) return;
		let t = kd(e.target, this.options.metadata);
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
			let r = kd(n, this.options.metadata);
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
		if (i === void 0 || !Dd(i.mode) || Od(i.mode)) return;
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
function jd(e) {
	return e.matches(":disabled") || (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.readOnly;
}
//#endregion
//#region src/events/event-boundary.ts
function Md(e, t) {
	let n = e.closest(`[${Ze}]`);
	return n !== null && n !== t && t.contains(n);
}
//#endregion
//#region src/events/command-turns.ts
var Nd = class {
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
}, Pd = class {
	catalog;
	registrations = /* @__PURE__ */ new Map();
	attachments = /* @__PURE__ */ new Map();
	constructor(e) {
		this.catalog = e;
	}
	add(e, t = {}) {
		let n = Li(e);
		if (n.length === 0) throw Error("Event name is required.");
		let r = Li(t.domEventName) || this.catalog.get(n)?.domEventName || n, i = {
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
		return this.registrations.get(Li(e));
	}
	isAttached(e) {
		return this.attachments.has(Li(e));
	}
	attach(e) {
		let t = {};
		return this.attachments.set(Li(e), t), t;
	}
	isCurrent(e, t) {
		return this.attachments.get(e) === t;
	}
}, Fd = class {
	create(e, t) {
		return e.createRequest === void 0 ? t.metadata === void 0 ? null : {
			eventId: C(t.metadata.eventId),
			dynamicParameters: [...t.dynamicParameters]
		} : e.createRequest(t);
	}
}, Id = {
	dispatched: !1,
	success: !1
}, Ld = class extends Error {
	reason;
	constructor(e) {
		super(String(e)), this.reason = e;
	}
}, Rd = class {
	options;
	root;
	registry;
	requestFactory = new Fd();
	turns = new Nd();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.registry = new Pd(e.eventCatalog), this.addEvent("click");
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
		if (r === null || Bd(t, r.element) || Md(t.target, r.element)) return;
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
			let t = e instanceof Ld, r = t ? e.reason : e;
			throw n.completed?.({
				...a,
				dispatched: t,
				success: !1,
				error: String(r)
			}), r;
		}
	}
	async runAsync(e, t, n, r) {
		if (r.domEvent.target instanceof Element && E(r.domEvent.target)) return Id;
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
		if (this.options.dispatcher.isPending(i)) return r.domEvent.preventDefault(), Id;
		let a = this.turns.take();
		try {
			return await this.sendInTurnAsync(e, t, n, r, i, a);
		} finally {
			a.done();
		}
	}
	async sendInTurnAsync(e, t, n, r, i, a) {
		let o = n.getAttribute("data-ui-submit-form-id") ?? (t.submitsForm === !0 ? Vd(r) : null);
		if (o !== null) {
			if (this.options.validationEngine?.runSubmitValidation(o) === !1) return r.domEvent.preventDefault(), this.options.validationEngine.focusFirstInvalid(o), Id;
			await this.options.valueBinding?.submitFormAsync(o);
		}
		if (await this.isRefusedValueEventAsync(t, n) || (await a.ahead, await this.options.valueBinding?.whenSent(), this.options.dispatcher.isPending(i))) return Id;
		this.options.interactionEngine.applyEvent({
			name: `before-${e}`,
			componentId: r.componentId,
			dynamicParameters: r.dynamicParameters,
			domEvent: r.domEvent
		});
		let s = this.options.dispatcher.dispatchAsync(i);
		a.done();
		let c = await s.catch((t) => {
			throw this.applyAfterEvent(e, r), new Ld(t);
		});
		return this.options.effects.applyAll(c.command?.effects, this.options.dom), this.options.afterEffects?.(), this.applyAfterEvent(e, r), o !== null && this.options.validationEngine?.focusFirstInvalid(o), {
			dispatched: !0,
			success: c.command?.success !== !1,
			error: c.command?.error ?? null
		};
	}
	async isRefusedValueEventAsync(e, t) {
		return !Ed.includes(e.name) && e.settlesValue !== !0 ? !1 : (await this.options.valueBinding?.whenSettled(t), this.options.validationEngine?.isRefused(t) === !0);
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
		return n.hasAttribute(Xe(e)) ? !1 : this.options.metadata.hasServerEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(`before-${e}`, t) || this.options.interactionEngine.hasEventForComponent(`after-${e}`, t);
	}
	applyDomPolicy(e, t) {
		zd(e.preventDefault, t) && t.domEvent.preventDefault(), zd(e.stopPropagation, t) && t.domEvent.stopPropagation();
	}
};
function zd(e, t) {
	return e === void 0 ? !1 : typeof e == "function" ? e(t) : e;
}
function Bd(e, t) {
	if (e.type !== "mouseenter" && e.type !== "mouseleave") return !1;
	let n = e.relatedTarget;
	return n instanceof Node && t.contains(n);
}
function Vd(e) {
	let t = e.domEvent.target;
	return ((t instanceof Element ? t.closest("[data-ui-form-id]") : null) ?? e.component.querySelector("[data-ui-form-id]"))?.getAttribute("data-ui-form-id") ?? null;
}
//#endregion
//#region src/state/value-equality.ts
function Hd(e, t) {
	return Object.is(e, t) ? !0 : e === null || t === null || e === void 0 || t === void 0 ? !1 : e instanceof Date || t instanceof Date ? e instanceof Date && t instanceof Date && e.getTime() === t.getTime() : typeof e != "object" || typeof t != "object" ? !1 : Array.isArray(e) || Array.isArray(t) ? Array.isArray(e) && Array.isArray(t) && Ud(e, t) : Wd(e, t);
}
function Ud(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!Hd(e[n], t[n])) return !1;
	return !0;
}
function Wd(e, t) {
	for (let n in e) if (Object.hasOwn(e, n) && (Object.hasOwn(t, n) ? !Hd(e[n], t[n]) : !Gd(e[n]))) return !1;
	for (let n in t) if (Object.hasOwn(t, n) && !Object.hasOwn(e, n) && !Gd(t[n])) return !1;
	return !0;
}
function Gd(e) {
	return e == null;
}
//#endregion
//#region src/interactions/focus-handoff.ts
function Kd() {
	let e = document.activeElement;
	return e === null || e === document.body ? null : e;
}
function qd(e) {
	let t = document.activeElement;
	if (!e.isConnected || t !== e && t !== document.body) return null;
	if (Jd(e)) return Yd(e, () => qd(e)), null;
	let n = e;
	for (; n.parentElement !== null && !Jd(n.parentElement);) n = n.parentElement;
	let r = Qd(n) ?? $d(n) ?? ef();
	return r !== null && I(r), r;
}
function Jd(e) {
	return e.checkVisibility({ visibilityProperty: !0 });
}
function Yd(e, t) {
	if (typeof document.getAnimations != "function") return;
	let n = document.getAnimations().filter((t) => Xd(t) && Zd(t)?.contains(e) === !0);
	n.length > 0 && Promise.all(n.map((e) => e.finished)).then(t, () => void 0);
}
function Xd(e) {
	return e.transitionProperty === "visibility";
}
function Zd(e) {
	return e.effect?.target ?? null;
}
function Qd(e) {
	let t = (e.closest(".ui-key-value-action__value-input, .ui-key-value-action__edit-action")?.closest(".ui-key-value-action__row") ?? null)?.querySelector(".ui-key-value-action__action")?.querySelector(Fu) ?? null;
	return t !== null && Jd(t) ? t : null;
}
function $d(e) {
	let t = ad(e.closest(dd) ?? document, null).filter((t) => !e.contains(t)), n = t.find((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0), r = t.filter((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_PRECEDING) !== 0);
	return n ?? r[r.length - 1] ?? null;
}
function ef() {
	let e = document.querySelector(`[${ln}="content"]`);
	return e === null ? null : (xd(e), e);
}
//#endregion
//#region src/interactions/interaction-engine.ts
var tf = class {
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
		for (let e of Td) i.addEventListener(e, (e) => this.applyEditedValue(e), !0);
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
		let n = this.options.valueReaders.readBound(e.target), r = af(t.interactions[0].source, t.dynamicParameters);
		if (!(this.heard.has(r) && Hd(this.heard.get(r), n))) {
			this.heard.set(r, n);
			for (let e of t.interactions) this.applyInteraction(e, t.dynamicParameters, !0, n);
		}
	}
	resolveEdited(e) {
		let t = this.options.dom.resolveNearestComponent(e, () => !0);
		if (t === null) return null;
		let n = kd(e, this.options.metadata), r;
		if (n === null) r = e.hasAttribute("data-ui-value-end") ? this.index.getEndValueInteractions(t.componentId) : this.index.getValueInteractions(t.componentId);
		else if (n.binding === void 0) return null;
		else r = this.index.getPropertyInteractions(C(n.binding.componentId), n.binding.propertyId);
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
			for (let e of t.interactions) bi(e.actionKind) === "CopyValue" && of(e.target) && this.writeTarget(e.target, t.dynamicParameters, nf(e, n), !0);
		}
		this.moved.clear();
	};
	applyPropertyInteractions(e) {
		if (this.applyDepth > 8) {
			s("interaction chain depth limit exceeded.", {
				componentId: C(e.reference.componentId),
				propertyId: e.reference.propertyId
			});
			return;
		}
		let t = this.index.getPropertyInteractions(C(e.reference.componentId), e.reference.propertyId), n = t.length > 0 ? af(e.reference, e.dynamicParameters) : null;
		n !== null && this.heard.has(n) && this.heard.set(n, e.value);
		for (let n of t) this.applyInteraction(n, e.dynamicParameters, !1, e.value);
	}
	applyInteraction(e, t, n, r = !0) {
		let i = bi(e.actionKind);
		if (i === "Effect") {
			this.applyEffectInteraction(e, t, r);
			return;
		}
		let a = e.target;
		if (!of(a)) return;
		let o = i === "CopyValue" ? nf(e, r) : this.evaluator.evaluate(e, r);
		this.writeTarget(a, t, o, n), n && this.options.writeBack?.(a, t, o);
	}
	writeTarget(e, t, n, r) {
		let i = Kd();
		this.applyDepth++;
		try {
			this.propertyPatchEngine.applyPropertyValue(e, t, n, r);
		} finally {
			this.applyDepth--;
		}
		i !== null && qd(i);
	}
	applyEffectInteraction(e, t, n) {
		let r = e.effect;
		if (r == null) {
			s("effect interaction carries no effect.", e);
			return;
		}
		this.evaluator.matches(e, n) && this.options.effects.apply({
			effect: rf(r, t, this.options.dom),
			dom: this.options.dom,
			row: t
		});
	}
};
function nf(e, t) {
	return (t == null || typeof t == "string" && t.trim().length === 0) && e.falseValue !== void 0 ? e.falseValue : t;
}
function rf(e, t, n) {
	if (t.length === 0) return e;
	let r = e.target;
	if (r === void 0 || (r.dynamicParameters?.length ?? 0) > 0) return e;
	let i = C(r.id);
	for (let a = t.length; a >= 0; a--) {
		let o = t.slice(0, a), s = n.findComponent(i, o);
		if (s !== null && Gi(s, o)) return a === 0 ? e : {
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
function af(e, t) {
	return JSON.stringify([
		C(e?.componentId),
		e?.propertyId ?? "",
		...t.map((e) => String(e ?? ""))
	]);
}
function of(e) {
	return e != null && e.propertyId.length > 0;
}
//#endregion
//#region src/interactions/interaction-evaluator.ts
var sf = class {
	evaluate(e, t) {
		return this.matches(e, t) ? e.trueValue : e.falseValue;
	}
	matches(e, t) {
		return cf(t, e.operator, e.value);
	}
};
function cf(e, t, n) {
	let r = lf(e), i = lf(n);
	switch (xi(t)) {
		case "Required": return r != null && r !== !1 && String(r).trim().length > 0;
		case "Equal": return String(r ?? "") === String(i ?? "");
		case "NotEqual": return String(r ?? "") !== String(i ?? "");
		case "Greater": return uf(r, i, (e) => e > 0);
		case "GreaterOrEqual": return uf(r, i, (e) => e >= 0);
		case "Less": return uf(r, i, (e) => e < 0);
		case "LessOrEqual": return uf(r, i, (e) => e <= 0);
		case "Like": return String(r ?? "").includes(String(i ?? ""));
		case "LikeIgnoreCase": return String(r ?? "").toLocaleLowerCase().includes(String(i ?? "").toLocaleLowerCase());
		case "In": return Array.isArray(i) && i.some((e) => String(e ?? "") === String(r ?? ""));
		case "Regex": return ff(r, i);
		case "RegexEach": return df(r, i);
		default: return !1;
	}
}
function lf(e) {
	return ro(e) ? e.key : io(e) ? e.text : e;
}
function uf(e, t, n) {
	let r = Number(e), i = Number(t);
	return !Number.isNaN(r) && !Number.isNaN(i) ? n(r < i ? -1 : +(r > i)) : !Number.isNaN(r) || !Number.isNaN(i) || typeof e != "string" || typeof t != "string" ? !1 : n(e < t ? -1 : +(e > t));
}
function df(e, t) {
	return e == null ? !0 : Array.isArray(e) ? e.every((e) => ff(lf(e), t)) : ff(e, t);
}
function ff(e, t) {
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
var pf = "Value", mf = "EndValue", hf = class {
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
		return this.eventNames.has(Li(e));
	}
	getSourceEventNames() {
		let e = /* @__PURE__ */ new Set();
		for (let t of this.eventNames) vf(t) || e.add(t);
		return e;
	}
	hasEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(Li(e))?.has(t) === !0;
	}
	getEventInteractions(e, t) {
		return this.eventInteractions.get(yf(e, t)) ?? [];
	}
	getPropertyInteractions(e, t) {
		return this.propertyInteractions.get(bf(e, t)) ?? [];
	}
	getValueInteractions(e) {
		return this.valueInteractions.get(e) ?? [];
	}
	getEndValueInteractions(e) {
		return this.endValueInteractions.get(e) ?? [];
	}
	addInteraction(e) {
		if (gf(e)) {
			let t = C(e.sourceEvent?.componentId), n = Li(e.sourceEvent?.eventName);
			if (t > 0 && n.length > 0) {
				let r = this.eventInteractions.get(yf(t, n));
				r === void 0 && (r = [], this.eventInteractions.set(yf(t, n), r)), r.push(e), this.eventNames.add(n);
				let i = this.eventComponentIdsByName.get(n);
				i === void 0 && (i = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(n, i)), i.add(t);
			}
			return;
		}
		if (_f(e)) {
			let t = C(e.source?.componentId), n = e.source?.propertyId ?? "";
			if (t > 0 && n.length > 0) {
				let r = this.propertyInteractions.get(bf(t, n));
				r === void 0 && (r = [], this.propertyInteractions.set(bf(t, n), r)), r.push(e), bi(e.actionKind) === "CopyValue" && (this.copiesValues = !0);
				let i = this.metadata.getPropertyDefinition(n)?.propertyName, a = i === pf ? this.valueInteractions : i === mf ? this.endValueInteractions : null;
				if (a !== null) {
					let n = a.get(t) ?? [];
					n.push(e), a.set(t, n);
				}
			}
		}
	}
};
function gf(e) {
	return yi(e.sourceKind) === "Event";
}
function _f(e) {
	return yi(e.sourceKind) === "Property";
}
function vf(e) {
	return e.startsWith("before-") || e.startsWith("after-");
}
function yf(e, t) {
	return `${e}:${Li(t)}`;
}
function bf(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/rendering/motion.ts
var L = {
	fast: 120,
	normal: 200,
	ripple: 400,
	ease: "cubic-bezier(0.4, 0, 0.2, 1)",
	enter: "cubic-bezier(0, 0, 0.2, 1)",
	exit: "cubic-bezier(0.4, 0, 1, 1)",
	spring: "cubic-bezier(0.34, 1.56, 0.64, 1)"
};
function xf() {
	return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function Sf(e) {
	if (typeof e.getAnimations == "function") for (let t of e.getAnimations()) typeof CSSTransition == "function" && t instanceof CSSTransition && t.finish();
}
function Cf(e, t, n) {
	let r = !1, i = () => {
		r || (r = !0, clearTimeout(a), n());
	}, a = setTimeout(i, t), o = typeof e.getAnimations == "function" ? e.getAnimations().filter((e) => typeof CSSTransition != "function" || e instanceof CSSTransition) : [];
	Promise.allSettled(o.map((e) => e.finished)).then(i);
}
//#endregion
//#region src/rendering/responsive-tier.ts
var wf = [
	"base",
	"sm",
	"md",
	"xl",
	"xxl"
], Tf = {
	sm: 640,
	md: 768,
	xl: 1280,
	xxl: 1536
};
function Ef(e) {
	return `(min-width: ${Tf[e]}px)`;
}
var Df = Ef("sm");
function Of(e = (e) => matchMedia(e).matches) {
	for (let t of [
		"xxl",
		"xl",
		"md",
		"sm"
	]) if (e(Ef(t))) return t;
	return "base";
}
function kf(e, t) {
	return t === "base" ? e : `${e}-${t}`;
}
function Af(e, t) {
	if (e == null) return;
	let n = typeof e == "object" ? e : void 0;
	return n === void 0 || !("base" in n) ? t === "base" ? e : void 0 : n[t];
}
function jf(e, t) {
	return Mf(t, (t) => Af(e, t));
}
function Mf(e, t) {
	for (let n = wf.indexOf(e); n >= 0; n--) {
		let e = t(wf[n]);
		if (e != null) return e;
	}
}
//#endregion
//#region src/interactions/anchored-popup.ts
var Nf = /* @__PURE__ */ new Set([
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
function Pf(e) {
	return Nf.has(e);
}
var Ff = 4, If = 12, Lf = /* @__PURE__ */ new Map(), Rf = !1, zf = null, Bf = /* @__PURE__ */ new WeakMap(), Vf = "data-ui-popup-stood-in";
function Hf(e, t) {
	t === null ? Bf.delete(e) : Bf.set(e, t);
}
var Uf = "--ui-popup-ground";
function Wf(e, t) {
	let n = e.closest("[data-ui-theme]") === t.closest("[data-ui-theme]") ? getComputedStyle(e).getPropertyValue(Uf).trim() : "";
	n.length === 0 ? t.style.removeProperty(Uf) : t.style.setProperty(Uf, n);
}
function Gf(e, t, n) {
	Lf.set(t, {
		anchor: e,
		options: n
	}), ip(), zf?.observe(t), Zf(e, t), op(e, t, n);
}
var Kf = "data-ui-popup-lifted", qf = "data-ui-sheet";
function Jf() {
	return typeof matchMedia == "function" && !matchMedia(Df).matches;
}
function Yf(e) {
	return e.hasAttribute(qf);
}
function Xf(e) {
	if (e.hasAttribute(Kf)) {
		e.matches(":popover-open") || e.showPopover();
		return;
	}
	e.setAttribute("popover", "manual"), e.setAttribute(Kf, ""), Qf(e);
}
function Zf(e, t) {
	(t.hasAttribute(Kf) || $f(t) || e.closest(`[${Kf}]`) !== null) && Xf(t);
}
function Qf(e) {
	let t = getComputedStyle(e), n = t.transitionProperty.split(",").map((e) => e.trim()), r = n.indexOf("overlay");
	if (r === -1) {
		e.showPopover();
		return;
	}
	let i = t.transitionDuration.split(",").map((e) => e.trim());
	e.style.setProperty("transition-duration", n.map((e, t) => t === r ? "0s" : i[t % i.length]).join(", ")), e.showPopover(), getComputedStyle(e).getPropertyValue("overlay"), e.style.removeProperty("transition-duration");
}
function $f(e) {
	for (let t = e.parentElement; t !== null; t = t.parentElement) {
		let e = getComputedStyle(t);
		if (e.transform !== "none" || e.filter !== "none" || e.perspective !== "none" || t.hasAttribute("data-ui-surface-image-blur") && e.isolation === "isolate") return !0;
	}
	return !1;
}
var ep = L.normal * 5;
function tp(e, t) {
	e.hasAttribute(Kf) && (e.matches(":popover-open") && e.hidePopover(), Cf(e, ep, () => {
		e.matches(":popover-open") || Lf.has(e) || (e.removeAttribute("popover"), e.removeAttribute(Kf), t?.());
	}));
}
function np(e) {
	let t = Lf.get(e);
	t !== void 0 && op(t.anchor, e, t.options);
}
function rp(e) {
	e != null && (Lf.delete(e), zf?.unobserve(e), tp(e));
}
function ip() {
	Rf || (Rf = !0, document.addEventListener("scroll", ap, !0), window.addEventListener("resize", ap), window.visualViewport?.addEventListener("resize", ap), window.visualViewport?.addEventListener("scroll", ap), zf = new ResizeObserver((e) => {
		for (let t of e) {
			if (!(t.target instanceof HTMLElement)) continue;
			let e = Lf.get(t.target);
			e !== void 0 && op(e.anchor, t.target, e.options, !0);
		}
	}));
}
function ap() {
	for (let [e, t] of Lf) {
		if (!e.isConnected) {
			rp(e);
			continue;
		}
		op(t.anchor, e, t.options);
	}
}
function op(e, t, n, r = !1) {
	if (!e.isConnected) return;
	let i = up(e), a = i !== e;
	t.hasAttribute(Vf) !== a && t.toggleAttribute(Vf, a), n.minAnchorWidth === !0 && (t.style.minWidth = `${i.getBoundingClientRect().width}px`), lp(t);
	let o = i.getBoundingClientRect(), s = (i === e ? n.crossAnchor ?? i : i).getBoundingClientRect(), c = i === e && n.surface !== void 0 ? n.surface.getBoundingClientRect() : o, l = n.gap ?? 4, u = t.getBoundingClientRect(), d = pp(n.boundary), f = Lf.get(t), p = r ? f?.side : void 0, m = p !== void 0 && hp(c, u, p, l, d) ? p : mp(c, u, n.placement, l, d);
	f !== void 0 && (f.side = m), hp(c, u, m, l, d) || (cp(t, m, yp(c, m, d) - l - Ff), u = t.getBoundingClientRect());
	let h = n.alignEntries === !0 ? Cp(t, m) : Sp, g = Tp(c, s, u, m, l, h), ee = Ep(c, s, u, m, l, h);
	n.arrow === !0 && (vp(m) ? ee = dp(ee, s.left + s.width / 2, u.width) : g = dp(g, s.top + s.height / 2, u.height));
	let te = Op();
	g = te.top + Mp(g - te.top, u.height, te.bottom - te.top), ee = Mp(ee, u.width, window.innerWidth), t.style.top = `${g}px`, t.style.left = `${ee}px`, t.dataset.uiPlacement !== m && (t.dataset.uiPlacement = m), fp(t, s, u, m, g, ee);
}
var sp = "data-ui-popup-capped";
function cp(e, t, n) {
	let r = vp(t);
	e.setAttribute(sp, ""), e.style.setProperty(r ? "max-height" : "max-width", `${Math.max(0, n)}px`), e.style.setProperty(r ? "overflow-y" : "overflow-x", "auto");
}
function lp(e) {
	if (e.hasAttribute(sp)) {
		e.removeAttribute(sp);
		for (let t of [
			"max-height",
			"max-width",
			"overflow-y",
			"overflow-x"
		]) e.style.removeProperty(t);
	}
}
function up(e) {
	for (let t = e; t !== null; t = t.parentElement) {
		if (t.hasAttribute(Vf)) return e;
		let n = Bf.get(t);
		if (n !== void 0) return n;
	}
	return e;
}
function dp(e, t, n) {
	let r = t - e;
	return r < If ? e - (If - r) : r > n - If ? e + (r - (n - If)) : e;
}
function fp(e, t, n, r, i, a) {
	let o = vp(r), s = o ? t.left + t.width / 2 - a : t.top + t.height / 2 - i, c = o ? n.width : n.height;
	e.style.setProperty("--ui-popup-arrow", `${Math.max(If, Math.min(s, c - If))}px`);
}
function pp(e) {
	let t = Op(), n = {
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
function mp(e, t, n, r, i) {
	let a = bp(n);
	if (hp(e, t, n, r, i)) return n;
	if (hp(e, t, a, r, i)) return a;
	for (let a of gp(n)) if (hp(e, t, a, r, i)) return a;
	return yp(e, a, i) > yp(e, n, i) ? a : n;
}
function hp(e, t, n, r, i) {
	return yp(e, n, i) >= _p(t, n) + r;
}
function gp(e) {
	return e.startsWith("bottom") ? ["right-start", "left-start"] : e.startsWith("top") ? ["right-end", "left-end"] : e.startsWith("right") ? ["bottom-start", "top-start"] : ["bottom-end", "top-end"];
}
function _p(e, t) {
	return vp(t) ? e.height : e.width;
}
function vp(e) {
	return e.startsWith("top") || e.startsWith("bottom");
}
function yp(e, t, n) {
	return t.startsWith("top") ? e.top - n.top : t.startsWith("bottom") ? n.bottom - e.bottom : t.startsWith("left") ? e.left - n.left : n.right - e.right;
}
function bp(e) {
	return e.startsWith("top") ? `bottom${xp(e)}` : e.startsWith("bottom") ? `top${xp(e)}` : e.startsWith("left") ? `right${xp(e)}` : `left${xp(e)}`;
}
function xp(e) {
	let t = e.indexOf("-");
	return t === -1 ? "" : e.slice(t);
}
var Sp = {
	start: 0,
	end: 0
};
function Cp(e, t) {
	let n = getComputedStyle(e);
	return vp(t) ? {
		start: wp(n.paddingLeft) + wp(n.borderLeftWidth),
		end: wp(n.paddingRight) + wp(n.borderRightWidth)
	} : {
		start: wp(n.paddingTop) + wp(n.borderTopWidth),
		end: wp(n.paddingBottom) + wp(n.borderBottomWidth)
	};
}
function wp(e) {
	let t = Number.parseFloat(e ?? "");
	return Number.isFinite(t) ? t : 0;
}
function Tp(e, t, n, r, i, a) {
	return r.startsWith("top") ? e.top - i - n.height : r.startsWith("bottom") ? e.bottom + i : Dp(t.top, t.height, n.height, r, a);
}
function Ep(e, t, n, r, i, a) {
	return r.startsWith("left") ? e.left - i - n.width : r.startsWith("right") ? e.right + i : Dp(t.left, t.width, n.width, r, a);
}
function Dp(e, t, n, r, i) {
	let a = xp(r);
	return a === "-start" ? e - i.start : a === "-end" ? e + t - n + i.end : e + (t - n) / 2;
}
function Op() {
	let e = window.visualViewport, t = e == null || Math.abs(e.scale - 1) > .01, n = t ? 0 : Math.max(0, e.offsetTop), r = t ? window.innerHeight : Math.min(window.innerHeight, e.offsetTop + e.height);
	return {
		top: n,
		bottom: Math.min(r, kp(r))
	};
}
function kp(e) {
	let t = document.querySelector(`[${on}]`);
	if (t === null) return e;
	let n = t.getBoundingClientRect();
	return n.height > 0 && n.width >= window.innerWidth - 1 && n.top > 0 ? n.top : e;
}
function Ap(e, t, n) {
	if (Yf(e)) return;
	let r = e.getBoundingClientRect(), i = Op();
	e.style.left = `${jp(t, r.width, 0, window.innerWidth)}px`, e.style.top = `${jp(n, r.height, i.top, i.bottom)}px`;
}
function jp(e, t, n, r) {
	return e + t <= r - Ff ? e : e - t >= n + Ff ? e - t : n + Mp(e - n, t, r - n);
}
function Mp(e, t, n) {
	return Math.max(Ff, Math.min(e, n - t - Ff));
}
//#endregion
//#region src/interactions/dom-mutations.ts
var Np = 32;
function R(e, t, n, r) {
	if (!(e instanceof Node)) return null;
	let i = new MutationObserver((i) => {
		let a = Pp(e, n.relevant === void 0 ? i : i.filter(n.relevant), t);
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
function Pp(e, t, n) {
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
		if (r.size > Np) return new Set(e.querySelectorAll(n));
	}
	return r.size === 0 ? null : r;
}
function Fp(e, t, n) {
	return (e.target instanceof Element ? e.target : e.target.parentElement)?.closest(`${t}, ${n}`)?.matches(t) === !0;
}
//#endregion
//#region src/interactions/open-dialogs.ts
var Ip = "data-ui-dialog", Lp = "data-ui-dialog-modal", Rp = "data-ui-dialog-backdrop", zp = "data-ui-dialog-close-backdrop", Bp = "data-ui-dialog-close-escape", Vp = `[${Ip}]:not([hidden]), dialog[open]`, Hp = "dialog:modal";
function Up(e) {
	let t = e.querySelectorAll(`[${Ip}]:not([hidden])`);
	return t.length === 0 ? null : t[t.length - 1];
}
function Wp(e) {
	let t = e.querySelectorAll(Hp);
	if (t.length > 0) return t[t.length - 1];
	let n = Up(e);
	return n !== null && n.hasAttribute("data-ui-dialog-modal") ? n : null;
}
function Gp(e) {
	let t = typeof document > "u" ? null : Wp(document);
	return t !== null && !t.contains(e);
}
//#endregion
//#region src/interactions/popup-dismissal.ts
var Kp = /* @__PURE__ */ new Set(), qp = /* @__PURE__ */ new Map(), Jp = 0, Yp = !1;
function Xp() {
	Yp || (Yp = !0, document.addEventListener("keydown", (e) => {
		!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || k(e) || $p(dc(e.target)) && e.preventDefault();
	}, !0));
}
function Zp() {
	for (let e of Kp) for (let t of e.openPopups()) if (t.isConnected && !e.isBehind(t)) return !0;
	return !1;
}
function Qp(e) {
	for (let t of Kp) t.hearRefusedClick(e);
}
function $p(e) {
	let t = [];
	for (let e of Kp) for (let n of e.openPopups()) n.isConnected && t.push({
		instance: e,
		popup: n
	});
	let n = new Set(t.map((e) => e.popup));
	for (let e of [...qp.keys()]) n.has(e) || qp.delete(e);
	for (let { popup: e } of t) qp.has(e) || qp.set(e, ++Jp);
	let r = em(t, (e) => qp.get(e.popup) ?? 0, (e, t) => e.popup.contains(t.popup));
	for (let { instance: t, popup: n } of r) if ((e === null || e.contains(n)) && t.dismiss(n, "escape")) return !0;
	return !1;
}
function em(e, t, n) {
	let r = [...e].sort((e, n) => t(n) - t(e)), i = [];
	for (; r.length > 0;) {
		let e = r.findIndex((e) => !r.some((t) => t !== e && n(e, t)));
		i.push(...r.splice(e, 1));
	}
	return i;
}
var tm = class {
	options;
	pressedInside = /* @__PURE__ */ new Set();
	constructor(e) {
		this.options = e, document.addEventListener("pointerdown", (e) => this.handlePress(e), !0), document.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), e.onPress !== !0 && document.addEventListener("click", (e) => this.handleClick(e), !0), e.onWindowBlur === !0 && window.addEventListener("blur", () => this.dismissAll("blur")), Kp.add(this), Xp();
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
		return this.options.isBehind === void 0 ? Gp(e) : this.options.isBehind(e);
	}
	dismiss(e, t) {
		return this.isBehind(e) || this.options.canDismiss?.(e, t) === !1 ? !1 : (this.options.close(e, t), !0);
	}
	isInside(e, t) {
		return this.options.isInside === void 0 ? t.includes(e) : this.options.isInside(e, t);
	}
}, nm = /\p{M}/gu, rm = ".ui-text__title";
function im(e, t) {
	return am(e, t).split(/\s+/).filter((e) => e.length !== 0);
}
function am(e, t) {
	return cm(e, sm(t));
}
function om(e, t) {
	return t.every((t) => e.includes(t));
}
function sm(e) {
	return e.closest("[lang]")?.getAttribute("lang") || void 0;
}
function cm(e, t) {
	let n = e.normalize("NFD").replace(nm, "");
	try {
		return n.toLocaleLowerCase(t);
	} catch {
		return n.toLowerCase();
	}
}
function lm(e) {
	return e.querySelector(rm)?.textContent ?? e.textContent ?? "";
}
//#endregion
//#region src/interactions/pointer-drag.ts
var um = class {
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
		if (t === null || E(t)) return;
		let n = this.options.begin(t, {
			x: e.clientX,
			y: e.clientY
		});
		if (n === null) return;
		e.preventDefault();
		try {
			t.setPointerCapture(e.pointerId);
		} catch {}
		t.setAttribute(br, ""), t.tabIndex >= 0 && t.focus({ preventScroll: !0 });
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
			e.pointerId === t.pointerId ? t.point = n : t.second.point = n, this.options.pinch?.(t.context, dm(r, i, t.point, t.second.point));
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
		this.drag = null, n.removeAttribute(br), e.type === "pointercancel" && this.options.takenBack !== void 0 ? this.options.takenBack(n, r) : this.options.end(n, r);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || k(e) || this.drag === null) return;
		e.preventDefault();
		let { handle: t, context: n, pointerId: r, originPoint: i, second: a } = this.drag;
		this.drag = null, t.removeAttribute(br);
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
function dm(e, t, n, r) {
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
function fm() {
	let e = (e) => {
		e.preventDefault(), e.stopImmediatePropagation(), t();
	}, t = () => {
		window.removeEventListener("click", e, !0), window.removeEventListener("pointerdown", t, !0), window.removeEventListener("keydown", t, !0);
	};
	window.addEventListener("click", e, !0), window.addEventListener("pointerdown", t, !0), window.addEventListener("keydown", t, !0);
}
//#endregion
//#region src/interactions/sheet-swipe.ts
var pm = "data-ui-sheet-dragging", mm = "--ui-sheet-drag", hm = 6, gm = 24, _m = 1 / 3, vm = .5;
function ym(e, t, n) {
	return e > t * _m || n > vm && e > hm;
}
function bm(e, t, n) {
	let r = null;
	e.style.removeProperty(mm), e.removeAttribute(pm);
	let i = (n) => {
		if (r = null, !n.isPrimary || n.button !== 0 || t.scrollTop > 0 || n.pointerType !== "touch" && n.clientY - e.getBoundingClientRect().top > gm) return;
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
			if (i > hm && i > Math.abs(n) || n < -6) {
				r = null;
				return;
			}
			if (n <= hm) return;
			r.moving = !0, e.setAttribute(pm, ""), xm(e, t.pointerId);
		}
		r.previous = r.last, r.last = {
			y: t.clientY,
			time: t.timeStamp
		}, e.style.setProperty(mm, `${Math.max(0, n)}px`);
	}, o = (t) => {
		if (r === null || t.pointerId !== r.pointerId) return;
		let i = r;
		if (r = null, !i.moving) return;
		fm(), e.removeAttribute(pm);
		let a = Math.max(0, t.clientY - i.startY), o = i.last.time - i.previous.time, s = o > 0 ? (i.last.y - i.previous.y) / o : 0;
		t.type === "pointerup" && ym(a, e.getBoundingClientRect().height, s) ? n() : e.style.setProperty(mm, "0px");
	}, s = (e) => {
		let t = e.touches[0];
		r !== null && e.cancelable && t !== void 0 && (r.moving || t.clientY > r.startY) && e.preventDefault();
	};
	return e.addEventListener("pointerdown", i), e.addEventListener("pointermove", a), e.addEventListener("pointerup", o), e.addEventListener("pointercancel", o), e.addEventListener("touchmove", s, { passive: !1 }), () => {
		r = null, e.removeAttribute(pm), e.removeEventListener("pointerdown", i), e.removeEventListener("pointermove", a), e.removeEventListener("pointerup", o), e.removeEventListener("pointercancel", o), e.removeEventListener("touchmove", s);
	};
}
function xm(e, t) {
	try {
		e.setPointerCapture(t);
	} catch {}
}
//#endregion
//#region src/interactions/popup-sheet.ts
var Sm = "data-ui-sheet-covered", Cm = "ui-sheet-scrim", wm = "data-ui-sheet-scrim-leaving", Tm = 400, Em = "ui-sheet__back", Dm = "ui.sheet.back", Om = [], km = null, Am = !1, jm = !1;
function Mm(e, t) {
	if (Nm(e) !== null) return;
	let n = t.anchor?.closest("[data-ui-sheet]") ?? null, r = n === null ? null : Nm(n);
	e.style.removeProperty("top"), e.style.removeProperty("left"), e.style.removeProperty("min-width");
	let i = Yf(e);
	e.setAttribute(qf, r === null ? "root" : "nested"), i || (e.setAttribute("popover", "manual"), Sf(e));
	let a = null;
	e.querySelector(`:scope > .${Em}`)?.remove(), r !== null && (e.style.minHeight = `${r.popup.getBoundingClientRect().height}px`, r.popup.setAttribute(Sm, ""), a = Pm(t), e.prepend(a)), Fm(), Xf(e);
	let o = {
		popup: e,
		parent: r,
		opening: t,
		back: a,
		hidden: [],
		detachSwipe: bm(e, e, () => Im(e))
	};
	Om.push(o), Lm(), queueMicrotask(() => zm(o));
}
function Nm(e) {
	return Om.find((t) => t.popup === e) ?? null;
}
function Pm(e) {
	let t = document.createElement("button"), n = e.anchor === void 0 ? "" : lm(e.anchor).trim();
	return t.type = "button", t.className = Em, t.tabIndex = -1, t.textContent = n, T.write(t, "aria-label", Dm, { entry: n }), t.addEventListener("click", (t) => {
		t.stopPropagation(), e.close();
	}), t;
}
function Fm() {
	km === null && (km = document.createElement("div"), km.className = Cm, km.setAttribute("aria-hidden", "true"), km.addEventListener("mousedown", (e) => e.preventDefault())), km.parentElement === null && document.body.appendChild(km), km.removeAttribute(wm), Xf(km);
}
function Im(e) {
	for (let t = Nm(e); t !== null; t = t.parent) t.opening.close();
}
function Lm() {
	Am || (Am = !0, window.addEventListener("pointerdown", () => {
		jm = !0;
	}, !0), window.addEventListener("pointerup", Rm, !0), window.addEventListener("pointercancel", Rm, !0), window.addEventListener("keydown", (e) => {
		let t = Om.at(-1);
		e.key === "Tab" && !e.defaultPrevented && t !== void 0 && t.opening.trapsTab && e.target instanceof Node && t.popup.contains(e.target) && cd(t.popup, e);
	}, !0), matchMedia(Df).addEventListener("change", () => {
		for (let e of Om.filter((e) => e.parent === null)) e.opening.close();
	}));
}
function Rm() {
	if (jm = !1, km?.hasAttribute(wm) !== !0) return;
	let e = () => {
		km?.hasAttribute(wm) === !0 && Om.length === 0 && (km.removeAttribute(wm), km.hidePopover());
	};
	window.addEventListener("click", () => window.setTimeout(e), { once: !0 }), window.setTimeout(e, Tm);
}
function zm(e) {
	if (!Om.includes(e)) return;
	let { popup: t } = e;
	t.contains(document.activeElement) || (t.hasAttribute("tabindex") || (t.tabIndex = -1), I(t)), e.hidden = Bm(t);
}
function Bm(e) {
	let t = [];
	for (let n = e; n.parentElement !== null && n !== document.body; n = n.parentElement) for (let e of n.parentElement.children) e === n || e === km || !(e instanceof HTMLElement) || e.getAttribute("aria-hidden") === "true" || (e.setAttribute("aria-hidden", "true"), t.push(e));
	return t;
}
function Vm(e) {
	let t = Nm(e);
	if (t !== null) {
		for (let e of [...Om].reverse()) if (e === t || Hm(e, t)) {
			for (let t of e.hidden) t.removeAttribute("aria-hidden");
			e.hidden = [];
		}
	}
}
function Hm(e, t) {
	for (let n = e.parent; n !== null; n = n.parent) if (n === t) return !0;
	return !1;
}
function Um(e) {
	let t = Nm(e);
	if (t !== null) {
		for (let e of Om.filter((e) => e.parent === t)) e.opening.close(), Um(e.popup);
		Vm(e), Om.splice(Om.indexOf(t), 1), t.detachSwipe(), t.parent?.popup.removeAttribute(Sm), Om.length === 0 && Wm(), tp(e, () => {
			Nm(e) === null && (e.removeAttribute(qf), e.removeAttribute(Sm), e.style.removeProperty("min-height"), e.style.removeProperty("--ui-sheet-drag"), t.back?.remove());
		});
	}
}
function Wm() {
	km?.matches(":popover-open") === !0 && (jm ? km.setAttribute(wm, "") : km.hidePopover());
}
//#endregion
//#region src/interactions/owned-popup.ts
function Gm(e, t) {
	return e.isConnected && !E(e) && !(t && O(e));
}
var Km = class {
	options;
	entries = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, new tm({
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
			isBehind: (e) => Gp(this.entryOf(e)?.opening.owner ?? e),
			onPress: e.onPress,
			onWindowBlur: e.onWindowBlur
		}), (e.closesOnFocusLeave ?? !0) && document.addEventListener("focusout", (e) => this.handleFocusLeave(e), !0), e.closesOnTab !== void 0 && e.closesOnTab !== !1 && Jm(this);
	}
	listsAround(e) {
		return [...this.entries.values()].filter(({ opening: t }) => t.popup.contains(e) && eh(this.options.closesOnTab, t)).map(({ opening: e }) => ({
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
		if (!(e.target instanceof Node) || Yu() || t instanceof Element && t.hasAttribute("data-ui-pointer-focus")) return;
		if (t instanceof Element) {
			this.leaveFocus(e.target, t);
			return;
		}
		let n = e.target;
		Xm(n) && queueMicrotask(() => this.letGo(n));
	}
	leaveFocus(e, t) {
		for (let { opening: n } of [...this.entries.values()]) (n.popup.contains(e) || n.owner.contains(e)) && !this.isInside(n, $m(t)) && !Gp(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
	}
	letGo(e) {
		if (!Xm(e)) return;
		let t = fd(e);
		for (let { opening: n } of [...this.entries.values()]) {
			let r = n.popup.contains(e) || n.owner.contains(e), i = t !== null && n.popup.contains(t) || n.popup.contains(document.activeElement);
			r && !i && Gm(n.owner, this.closesWhenReadOnly) && !Gp(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
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
		if (this.close(e.owner), !Gm(e.owner, this.closesWhenReadOnly)) return !1;
		(this.options.single ?? !0) && this.closeAll();
		let t = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		return this.entries.set(e.owner, {
			opening: e,
			returnFocus: t
		}), this.options.show(e), this.place(e), th(e, !0), dh(this), oh(e), e.focus !== void 0 && e.focus !== !1 && md(e.popup, e.focus === !0 ? null : e.focus), !0;
	}
	get closesWhenReadOnly() {
		return this.options.closesWhenReadOnly ?? !0;
	}
	closeAll() {
		for (let e of [...this.entries.keys()]) this.close(e);
	}
	place(e) {
		if (Yf(e.popup) || eh(this.options.sheetOnPhone, e) && Jf()) {
			Mm(e.popup, {
				anchor: e.anchor,
				close: () => this.close(e.owner, "escape"),
				trapsTab: !eh(this.options.closesOnTab, e)
			});
			return;
		}
		e.anchor !== void 0 && e.placement !== void 0 && Gf(e.anchor, e.popup, e.placement);
	}
	reposition(e) {
		let t = this.entries.get(e);
		t !== void 0 && this.place(t.opening);
	}
	close(e = this.current, t) {
		let n = e === null ? void 0 : this.entries.get(e);
		if (e === null || n === void 0) return;
		let { opening: r } = n;
		this.entries.delete(e), sh(r.popup), Vm(r.popup), r.popup.contains(document.activeElement) && Sd(r.returnFocus === void 0 ? n.returnFocus : r.returnFocus(), r.popup), this.options.hide(r, t), th(r, !1), Yf(r.popup) ? Um(r.popup) : rp(r.popup), this.entries.size === 0 && fh(this);
	}
	closeStranded() {
		for (let [e, { opening: t }] of [...this.entries]) {
			if (Gm(e, this.closesWhenReadOnly)) continue;
			let n = document.activeElement, r = n === null || n === document.body || t.popup.contains(n) || e.contains(n);
			this.close(e, "owner"), r && e.isConnected && !Zm() && Qm(e);
		}
	}
}, qm = /* @__PURE__ */ new Set();
function Jm(e) {
	qm.size === 0 && window.addEventListener("keydown", (e) => {
		e instanceof KeyboardEvent && e.key === "Tab" && !e.defaultPrevented && !k(e) && e.target instanceof Node && Ym(e.target);
	}, !0), qm.add(e);
}
function Ym(e) {
	let t = [...qm].flatMap((t) => t.listsAround(e).map((e) => ({
		popups: t,
		...e
	})));
	for (let { popups: e, owner: n } of em(t, () => 0, (e, t) => e.popup.contains(t.popup))) e.close(n, "focus");
}
function Xm(e) {
	return e instanceof Element && e.isConnected && Jo(e) && typeof document.hasFocus == "function" && document.hasFocus();
}
function Zm() {
	let e = document.activeElement;
	return e instanceof Element && e !== document.body && Jo(e);
}
function Qm(e) {
	xd(e), I(e);
}
function $m(e) {
	let t = [];
	for (let n = e; n !== null; n = n.parentNode) t.push(n);
	return t;
}
function eh(e, t) {
	return e === !0 || typeof e == "function" && e(t);
}
function th(e, t) {
	for (let n of e.openers ?? []) n.setAttribute("aria-expanded", t ? "true" : "false");
}
var nh = /* @__PURE__ */ new Map(), rh = /* @__PURE__ */ new Set(), ih = /* @__PURE__ */ new WeakSet(), ah = [];
function oh(e) {
	let { popup: t } = e;
	nh.set(t, e.owner), !ih.has(t) && (ih.add(t), t.addEventListener("pointerenter", () => {
		nh.has(t) && (rh.add(t), ch());
	}), t.addEventListener("pointerleave", () => {
		rh.delete(t) && ch();
	}));
}
function sh(e) {
	nh.delete(e), rh.delete(e) && ch();
}
function ch() {
	let e = /* @__PURE__ */ new Set();
	for (let t of rh) {
		let n = nh.get(t);
		if (!(n === void 0 || !n.contains(t))) for (let r = t.parentElement; r !== null && (e.add(r), r !== n); r = r.parentElement);
	}
	for (let t of ah) e.has(t) || t.removeAttribute(Dr);
	for (let t of e) t.hasAttribute("data-ui-popup-hover") || t.setAttribute(Dr, "");
	ah = [...e];
}
var lh = /* @__PURE__ */ new Set(), uh = null;
function dh(e) {
	lh.add(e), uh === null && typeof MutationObserver == "function" && (uh = new MutationObserver(() => {
		for (let e of [...lh]) e.closeStranded();
	}), uh.observe(document, {
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
function fh(e) {
	lh.delete(e), !(lh.size > 0 || uh === null) && (uh.disconnect(), uh = null);
}
//#endregion
//#region src/interactions/flyout-interaction-engine.ts
var ph = "ui-flyout", mh = "ui-flyout--open", hh = "ui-flyout__anchor", gh = "data-ui-flyout-no-backdrop-close", _h = "data-ui-flyout-no-escape-close", vh = `${ph}--`, yh = "bottom-start", bh = class {
	root;
	flyouts = new Km({
		show: ({ owner: e }) => e.classList.add(mh),
		hide: ({ owner: e }, t) => this.markClosed(e, t !== "owner"),
		single: !1,
		closesWhenReadOnly: !1,
		canDismiss: ({ owner: e }, t) => !e.hasAttribute(t === "escape" ? _h : gh)
	});
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${ph}`)) this.place(e);
		R(this.root, `.${ph}`, { attributeFilter: ["class"] }, (e) => {
			for (let t of e) this.place(t);
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	place(e) {
		let t = e.querySelector(`:scope > .${Gr}`), n = e.querySelector(`:scope > .${hh}`);
		if (t === null) return;
		let r = xh(n, t);
		if (!e.classList.contains(mh)) {
			this.flyouts.close(e), r?.setAttribute("aria-expanded", "false");
			return;
		}
		this.flyouts.open({
			owner: e,
			popup: t,
			anchor: Ch(n) ?? e,
			placement: { placement: wh(e) },
			openers: r === null ? [] : [r],
			focus: !Yu() || t
		}) || this.markClosed(e);
	}
	markClosed(e, t = !0) {
		e.classList.contains(mh) && (e.classList.remove(mh), Sh(e, !1, t));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${hh}`)?.closest(`.${ph}`) ?? null;
		if (t !== null) {
			if (this.flyouts.isOpen(t)) {
				this.flyouts.close(t);
				return;
			}
			t.classList.add(mh), this.place(t), this.flyouts.isOpen(t) && Sh(t, !0);
		}
	}
};
function xh(e, t) {
	if (e === null) return null;
	let n = e.querySelector(Fu) ?? e;
	return n.setAttribute("aria-haspopup", "dialog"), n.setAttribute("aria-controls", pi(t, "ui-flyout-content")), n;
}
function Sh(e, t, n = !0) {
	e.dispatchEvent(new Event("toggle", { bubbles: !0 })), n && e.dispatchEvent(new Event(t ? "open" : "close", { bubbles: !0 }));
}
function Ch(e) {
	if (e === null) return null;
	let t = e.firstElementChild;
	return t instanceof HTMLElement ? t : e;
}
function wh(e) {
	for (let t of e.classList) {
		if (!t.startsWith(vh)) continue;
		let e = t.slice(vh.length);
		if (Pf(e)) return e;
	}
	return yh;
}
//#endregion
//#region src/interactions/drag-marks.ts
var Th = `:scope > :is(${Tc}, .ui-image-input__surface)`;
function Eh(e, t, n, r, i, a = [], o = "move") {
	Dh(t, r), n.classList.add(r);
	for (let e of a) e.classList.add(r);
	Oh(e, i, o);
}
function Dh(e, t) {
	for (let n of e.querySelectorAll(`.${t}`)) n.classList.remove(t);
}
function Oh(e, t, n) {
	!(e instanceof DragEvent) || e.dataTransfer === null || (e.dataTransfer.effectAllowed = n, e.dataTransfer.setData("text/plain", t));
}
function kh(e, t) {
	return !(e.relatedTarget instanceof Node && t.contains(e.relatedTarget));
}
function Ah(e, t) {
	let n = t && e.querySelector(Th) !== null;
	e.hasAttribute("data-ui-drop-boxed") !== n && e.toggleAttribute(ve, n);
}
//#endregion
//#region src/interactions/file-drop.ts
var jh = "data-ui-file-drop-over", Mh = 120, Nh = "refused", Ph = !1;
function Fh(e) {
	let t = {
		marked: /* @__PURE__ */ new Map(),
		leaving: 0
	};
	zh();
	for (let n of [
		"dragenter",
		"dragover",
		"dragleave",
		"drop"
	]) e.root.addEventListener(n, (n) => Ih(e, t, n), !0);
	e.root.addEventListener("dragend", () => Gh(t.marked), !0), window.addEventListener("blur", () => Gh(t.marked)), e.root.addEventListener("paste", (t) => Lh(e, t), !0);
}
function Ih(e, t, n) {
	if (!(n instanceof DragEvent) || !(n.target instanceof Element)) return;
	let r = t.marked;
	n.type !== "dragleave" && t.leaving !== 0 && (window.clearTimeout(t.leaving), t.leaving = 0);
	let i = e.resolveTarget(n.target);
	if (i === null || !(n.dataTransfer?.types.includes("Files") ?? !1)) {
		i === null && n.type === "dragover" && Gh(r);
		return;
	}
	let a = i.mark ?? i.host;
	if (i.refused === !0) {
		Bh(n), n.type !== "dragleave" && Gh(r);
		return;
	}
	if (n.type === "dragleave") {
		n.relatedTarget instanceof Node ? a.contains(n.relatedTarget) || Wh(r, a) : t.leaving = window.setTimeout(() => Gh(r), Mh);
		return;
	}
	if (n.preventDefault(), n.type !== "drop") {
		let t = Vh(i.accept, n.dataTransfer);
		n.dataTransfer !== null && (n.dataTransfer.dropEffect = t ? "none" : "copy");
		for (let e of r.keys()) e !== a && Wh(r, e);
		let o = i.mark === void 0 ? e.draggingAttribute : jh;
		r.set(a, o), a.setAttribute(o, t ? Nh : ""), Ah(a, o === jh);
		return;
	}
	Gh(r);
	let o = [...n.dataTransfer?.files ?? []].filter((e) => Kh(i.accept, e));
	o.length !== 0 && e.onFiles(i.host, i.multiple ? o : [o[0]]);
}
function Lh(e, t) {
	if (!(t instanceof ClipboardEvent) || !(t.target instanceof Element)) return;
	let n = t.clipboardData;
	if (n === null || n.files.length === 0 || n.getData("text/plain").trim().length > 0) return;
	let r = e.resolveTarget(t.target);
	if (r === null || r.refused === !0) return;
	let i = [...n.files].filter((e) => Kh(r.accept, e));
	i.length !== 0 && (t.preventDefault(), e.onFiles(r.host, r.multiple ? i : [i[0]]));
}
function Rh(e, t, n) {
	for (let r = t.closest(`[${ae}]`); r !== null; r = r.parentElement?.closest("[data-ui-id]") ?? null) {
		let t = r.getAttribute("data-ui-id") ?? "", i = [...e.querySelectorAll(`${n}[${pr}="${x(t)}"]`)];
		if (i.length > 0) return {
			field: i.find((e) => r.contains(e)) ?? i[0],
			component: r
		};
	}
	return null;
}
function zh() {
	if (!Ph) {
		Ph = !0;
		for (let e of ["dragover", "drop"]) window.addEventListener(e, (e) => {
			e instanceof DragEvent && !e.defaultPrevented && (e.dataTransfer?.types.includes("Files") ?? !1) && Bh(e);
		});
	}
}
function Bh(e) {
	e.type !== "dragleave" && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "none"));
}
function Vh(e, t) {
	let n = Hh(e);
	if (t === null || n.length === 0 || n.some((e) => e.startsWith("."))) return !1;
	let r = [...t.items].filter((e) => e.kind === "file").map((e) => e.type.toLowerCase());
	return r.length !== 0 && !r.some((e) => n.some((t) => Uh(t, e)));
}
function Hh(e) {
	return e.split(",").map((e) => e.trim().toLowerCase()).filter((e) => e.length > 0);
}
function Uh(e, t) {
	return e.endsWith("/*") ? t.startsWith(e.slice(0, -1)) : t === e;
}
function Wh(e, t) {
	let n = e.get(t);
	e.delete(t), n !== void 0 && t.removeAttribute(n), Ah(t, !1);
}
function Gh(e) {
	for (let t of [...e.keys()]) Wh(e, t);
}
function Kh(e, t) {
	let n = Hh(e);
	if (n.length === 0) return !0;
	let r = t.name.toLowerCase(), i = t.type.toLowerCase();
	return n.some((e) => e.startsWith(".") ? r.endsWith(e) : Uh(e, i));
}
//#endregion
//#region src/interactions/file-upload.ts
var qh = "/_ne/files/upload", Jh = [
	"kilobyte",
	"megabyte",
	"gigabyte"
], Yh = /* @__PURE__ */ new Map(), Xh = !1;
function Zh(e, t, n, r) {
	let i = Number(e.getAttribute(dr)), a = [], o = [];
	for (let e of t) !Number.isFinite(i) || i <= 0 || e.size <= i ? a.push(e) : o.push(e);
	if (o.length === 0) return Yh.delete(e) && r?.mark(e, null), a;
	if (r === void 0) return s("a chosen file exceeds the input's size limit and was refused.", {
		names: o.map((e) => e.name),
		limit: i
	}), a;
	let c = {
		validation: r,
		limit: i,
		names: n ? o.map((e) => e.name) : null
	};
	for (let e of Yh.keys()) e.isConnected || Yh.delete(e);
	return Yh.set(e, c), Qh(e, c), eg(), a;
}
function Qh(e, t) {
	let n = $h(t.limit, T.language);
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
function $h(e, t) {
	let n = e, r = "byte";
	for (let e of Jh) {
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
function eg() {
	Xh || (Xh = !0, T.onChange(() => {
		for (let [e, t] of Yh) e.isConnected ? Qh(e, t) : Yh.delete(e);
	}));
}
function tg(e, t) {
	return new Promise((n, r) => {
		let i = new FormData(), a = performance.now(), o = 0, s = 0;
		for (let t of e) i.append("files", t, t.name), o += t.size, s++;
		let c = new XMLHttpRequest();
		c.open("POST", qh), c.responseType = "json", c.withCredentials = !0, c.upload.addEventListener("progress", (e) => {
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
var ng = () => {};
function rg(e) {
	return {
		uploadAsync: (e, t) => tg(e, t ?? ng),
		accepts: Kh,
		takeWithinSizeLimit: (t, n, r) => Zh(t, n, r, e)
	};
}
function ig(e, t) {
	e !== null && e.value !== t && (e.value = t, e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/picker-events.ts
var ag = "ui-open-picker";
function og(e) {
	return !e.dispatchEvent(new Event(ag, {
		bubbles: !0,
		cancelable: !0
	}));
}
function sg(e, t) {
	if (!(e.target instanceof Element)) return;
	let n = e.target.closest(t.rootSelector);
	if (n === null) return;
	e.preventDefault();
	let r = n.querySelector(t.nativeSelector), i = t.pressed(n);
	r === null || r.disabled || i === null || O(n) || E(i) || r.click();
}
//#endregion
//#region src/interactions/file-input-engine.ts
var cg = "ui-file-input", lg = "ui-file-input__row", ug = "ui-file-input__native", dg = "ui-file-input__field", fg = "ui-file-input__selection", pg = "data-ui-file-dragging", mg = class {
	root;
	validation;
	picks = /* @__PURE__ */ new WeakMap();
	shownWords = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation, T.onChange(() => this.rewriteShownWords()), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener(ag, (e) => sg(e, {
			rootSelector: `.${cg}`,
			nativeSelector: `.${ug}`,
			pressed: (e) => e
		})), this.root.addEventListener("change", (e) => void this.handleSelectionAsync(e), !0), Fh({
			root: this.root,
			draggingAttribute: pg,
			resolveTarget: (e) => {
				let t = e.closest(`.${lg}`)?.closest(`.${cg}`) ?? null, n = t === null ? Rh(this.root, e, `.${cg}`) : null, r = t ?? n?.field ?? null, i = r?.querySelector(`.${ug}`) ?? null;
				return r === null || i === null ? null : {
					host: r,
					mark: n?.component,
					accept: i.getAttribute("accept") ?? "",
					multiple: i.multiple,
					refused: i.disabled || O(r) || E(r)
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
		let t = e.target.closest(`[${fr}], .${lg}`);
		if (t === null || E(t) || O(t) || !t.hasAttribute("data-ui-file-pick") && e.target.closest("button, a") !== null) return;
		let n = t.closest(`.${cg}`)?.querySelector(`.${ug}`);
		n == null || n.disabled || n.click();
	}
	async handleSelectionAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(ug)) return;
		let t = e.target.closest(`.${cg}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && await this.takeFilesAsync(t, n);
	}
	async takeFilesAsync(e, t) {
		let n = e.querySelector(`.${dg}`);
		if (n === null) return;
		if (t.length === 0) {
			this.show(n, ""), this.publishSelection(e, "");
			return;
		}
		let r = Zh(e, t, e.querySelector(`.${ug}`)?.multiple === !0, this.validation);
		if (r.length === 0) return;
		let i = (this.picks.get(e) ?? 0) + 1;
		this.picks.set(e, i);
		try {
			let t = await tg(r, (t) => {
				this.picks.get(e) === i && this.show(n, () => T.format("ui.file.uploading", { percent: t }));
			});
			if (this.picks.get(e) !== i) return;
			this.show(n, hg(r)), this.publishSelection(e, t.selectionId);
		} catch (t) {
			if (s("file upload failed.", t), this.picks.get(e) !== i) return;
			this.show(n, () => T.text("ui.file.failed")), this.publishSelection(e, "");
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
		ig(e.querySelector(`.${fg}`), t);
	}
};
function hg(e) {
	return e.length === 1 ? e[0].name : () => T.format("ui.file.count", { count: e.length });
}
//#endregion
//#region src/rendering/file-glyphs.ts
var gg = "ne-picture-as-pdf", _g = "ne-text-snippet", vg = "ne-description", yg = "ne-table-chart", bg = "ne-slideshow", xg = "ne-folder-zip", Sg = "ne-audio-file", Cg = "ne-video-file", wg = "ne-image", Tg = "ne-code", Eg = "ne-draft", Dg = new Map([
	...jg(gg, "pdf"),
	...jg(_g, "txt", "md", "log"),
	...jg(vg, "doc", "docx", "odt", "rtf"),
	...jg(yg, "xls", "xlsx", "ods", "csv", "tsv"),
	...jg(bg, "ppt", "pptx", "odp", "key"),
	...jg(xg, "zip", "rar", "7z", "tar", "gz", "tgz", "bz2", "xz"),
	...jg(Sg, "mp3", "wav", "ogg", "oga", "opus", "flac", "m4a", "aac"),
	...jg(Cg, "mp4", "m4v", "mov", "avi", "mkv", "webm"),
	...jg(wg, "png", "jpg", "jpeg", "gif", "webp", "avif", "bmp", "svg", "ico", "tif", "tiff", "heic", "heif"),
	...jg(Tg, "json", "xml", "yml", "yaml", "html", "htm", "css", "less", "scss", "js", "mjs", "ts", "tsx", "jsx", "cs", "csproj", "sln", "java", "kt", "py", "rb", "php", "go", "rs", "c", "h", "cpp", "hpp", "swift", "sql", "sh", "ps1")
]), Og = /* @__PURE__ */ new Map([
	["application/pdf", gg],
	["text/csv", yg],
	["application/msword", vg],
	["application/rtf", vg],
	["application/vnd.openxmlformats-officedocument.wordprocessingml.document", vg],
	["application/vnd.oasis.opendocument.text", vg],
	["application/vnd.ms-excel", yg],
	["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", yg],
	["application/vnd.oasis.opendocument.spreadsheet", yg],
	["application/vnd.ms-powerpoint", bg],
	["application/vnd.openxmlformats-officedocument.presentationml.presentation", bg],
	["application/vnd.oasis.opendocument.presentation", bg],
	["application/zip", xg],
	["application/x-zip-compressed", xg],
	["application/x-7z-compressed", xg],
	["application/vnd.rar", xg],
	["application/x-rar-compressed", xg],
	["application/x-tar", xg],
	["application/gzip", xg],
	["application/json", Tg],
	["application/xml", Tg],
	["text/xml", Tg],
	["text/html", Tg]
]), kg = /* @__PURE__ */ new Map([
	["image", wg],
	["audio", Sg],
	["video", Cg],
	["text", _g]
]);
function Ag(e, t) {
	let n = e.lastIndexOf("."), r = n < 0 ? void 0 : Dg.get(e.slice(n + 1).toLowerCase());
	if (r !== void 0) return r;
	let i = t.split(";", 1)[0].trim().toLowerCase(), a = i.indexOf("/");
	return Og.get(i) ?? (a < 0 ? void 0 : kg.get(i.slice(0, a))) ?? Eg;
}
function jg(e, ...t) {
	return t.map((t) => [t, e]);
}
//#endregion
//#region src/rendering/url-safety.ts
var Mg = [
	"http",
	"https",
	"mailto",
	"tel"
];
function Ng(e) {
	let t = String(e ?? "");
	if (t.trim().length === 0) return !1;
	for (let e of t) {
		let t = e.codePointAt(0) ?? 0;
		if (t <= 32 || t >= 127 && t <= 159) return !1;
	}
	if ("/#?.".includes(t[0])) return !0;
	let n = t.indexOf(":");
	return n < 0 || Mg.includes(t.slice(0, n).toLowerCase());
}
function Pg(e) {
	return Ng(e) ? String(e) : void 0;
}
var Fg = [
	"http:",
	"https:",
	"mailto:",
	"tel:"
];
function Ig(e) {
	let t = Bg(e), n = t.toLowerCase();
	return /^[\\/]{2}/.test(t) || Fg.some((e) => n.startsWith(e));
}
function Lg(e) {
	return typeof e != "string" || /[\x00-\x1f\x7f-\x9f]/.test(e) ? !1 : e === "/" || Rg(e);
}
function Rg(e) {
	return e.length > 1 && e[0] === "/" && e[1] !== "/" && e[1] !== "\\";
}
function zg(e) {
	return e.length > 0 && e[0] !== "/" && e[0] !== "\\" && !/^[A-Za-z][A-Za-z\d+.-]*:/.test(e);
}
function Bg(e) {
	let t = 0, n = e.length;
	for (; t < n && e.charCodeAt(t) <= 32;) t++;
	for (; n > t && e.charCodeAt(n - 1) <= 32;) n--;
	return e.slice(t, n).replace(/[\t\n\r]/g, "");
}
function Vg(e) {
	return Hg(e) !== null;
}
function Hg(e) {
	let t = Bg(e), n = t.toLowerCase();
	return Rg(t) || zg(t) || n.startsWith("https://") || n.startsWith("http://") || n.startsWith("data:image/") ? t : null;
}
function Ug(e) {
	return Hg(String(e ?? "").trim()) ?? void 0;
}
//#endregion
//#region src/rendering/icon-value.ts
var Wg = "mask:", Gg = "ui-icon--image", Kg = "ui-icon--mask";
function qg(e) {
	let t = String(e ?? "").trim(), n = !1;
	t.startsWith(Wg) && (n = !0, t = t.slice(5).trim());
	let r = t.includes("/") ? Hg(t) : null;
	return r === null ? null : {
		source: r,
		tinted: n
	};
}
function Jg(e) {
	let t = qg(e);
	return t === null ? "" : Yg(t.source);
}
function Yg(e) {
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
var Xg = "ui-icon", Zg = "data-ui-icon", Qg = "--ui-icon-url";
function $g(e, t) {
	e.classList.add(Xg);
	for (let t of Array.from(e.classList)) t_(t) && e.classList.remove(t);
	(e instanceof HTMLElement || e instanceof SVGElement) && e.style.removeProperty(Qg);
	let n = n_(t);
	if (n.length === 0) {
		e.removeAttribute(Zg);
		return;
	}
	e.setAttribute(Zg, ""), e.classList.add(n);
	let r = qg(t);
	r !== null && (e instanceof HTMLElement || e instanceof SVGElement) && e.style.setProperty(Qg, Yg(r.source));
}
var e_ = "ui-icon-glyph--";
function t_(e) {
	return e === Gg || e === Kg || e.startsWith(e_);
}
function n_(e) {
	let t = qg(e);
	return t === null ? r_(e) : t.tinted ? Kg : Gg;
}
function r_(e) {
	let t = String(e ?? "").trim();
	if (t.length === 0) return "";
	let n = e_;
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
var i_ = 1024, a_ = 16777216;
function o_(e) {
	return {
		x: e.width / 2,
		y: e.height / 2,
		zoom: 1
	};
}
function s_(e, t) {
	let n = __(t.zoom, 1, 4), r = g_(e) / n / 2;
	return {
		x: __(t.x, r, e.width - r),
		y: __(t.y, r, e.height - r),
		zoom: n
	};
}
function c_(e, t) {
	let n = g_(e) / t.zoom;
	return {
		x: t.x - n / 2,
		y: t.y - n / 2,
		side: n
	};
}
function l_(e, t, n) {
	return t.zoom * n / g_(e);
}
function u_(e, t, n, r, i) {
	let a = l_(e, t, n);
	return a > 0 ? s_(e, {
		x: t.x - r / a,
		y: t.y - i / a,
		zoom: t.zoom
	}) : t;
}
function d_(e, t, n, r, i = {
	x: 0,
	y: 0
}) {
	let a = __(t.zoom * r, 1, 4), o = l_(e, t, n), s = l_(e, {
		...t,
		zoom: a
	}, n);
	return !(o > 0) || !(s > 0) ? s_(e, {
		...t,
		zoom: a
	}) : s_(e, {
		x: t.x + i.x / o - i.x / s,
		y: t.y + i.y / o - i.y / s,
		zoom: a
	});
}
function f_(e, t) {
	return Math.max(1, Math.min(t, Math.round(e.side)));
}
function p_(e, t) {
	return Math.min(1, t * 4 / g_(e), Math.sqrt(a_ / (e.width * e.height)));
}
function m_(e) {
	return e === "image/jpeg" || e === "image/png" || e === "image/webp" ? e : "image/png";
}
function h_(e, t, n) {
	if (n === t) return e;
	let r = e.lastIndexOf(".");
	return `${r > 0 ? e.slice(0, r) : e}.${n === "image/jpeg" ? "jpg" : n.slice(n.indexOf("/") + 1)}`;
}
function g_(e) {
	return Math.min(e.width, e.height);
}
function __(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
//#endregion
//#region src/interactions/page-dialog.ts
function v_(e) {
	let t = document.createElement("div");
	t.className = `ui-dialog ${e.className}`, t.setAttribute(Ip, e.key), t.setAttribute(Lp, ""), e.closesOnEscapeAndBackdrop && (t.setAttribute(Bp, ""), t.setAttribute(zp, "")), t.setAttribute("hidden", "");
	let n = document.createElement("div");
	n.className = "ui-dialog__backdrop", n.setAttribute(Rp, "");
	let r = document.createElement("div");
	return r.className = e.surfaceClassName === void 0 ? Wr : `${Wr} ${e.surfaceClassName}`, r.setAttribute("role", e.role), r.setAttribute("tabindex", "-1"), r.setAttribute("aria-modal", "true"), r.setAttribute("aria-labelledby", e.labelledBy), e.describedBy !== void 0 && r.setAttribute("aria-describedby", e.describedBy), t.append(n, r), {
		dialog: t,
		surface: r
	};
}
var y_ = class {
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
}, b_ = 100 / 3, x_ = 1, S_ = 2;
function C_(e, t = b_) {
	let n = e.deltaMode === x_ ? b_ : e.deltaMode === S_ ? t : 1;
	return {
		x: e.deltaX * n,
		y: e.deltaY * n
	};
}
function w_(e, t) {
	let n = (Math.sign(e) === Math.sign(t) ? e : 0) + t, r = Math.trunc(n / 100) || 0;
	return {
		steps: r,
		carried: n - r * 100
	};
}
var T_ = {
	notch: 100,
	pixels: C_
}, E_ = "ui-image-crop", D_ = "ui-image-crop-title", O_ = new y_("data-ui-image-crop-part"), k_ = "data-ui-image-crop-frame", A_ = 10, j_ = 1.2, M_ = 380, N_ = 100, P_ = .92, z = null, F_ = !1, I_ = null, L_ = !1;
async function R_(e, t, n, r = X_) {
	if (z !== null || F_) return "cancelled";
	F_ = !0;
	let i;
	try {
		i = await r.decodeAsync(t, n.size);
	} finally {
		F_ = !1;
	}
	if (i === null) return "unreadable";
	let a = i;
	return new Promise((i) => {
		I_ ??= z_();
		let o = I_;
		o.dialog.isConnected || document.body.append(o.dialog), z = {
			file: t,
			source: a,
			request: n,
			imaging: r,
			view: o_(a),
			finish: (t) => {
				z = null, e.close(E_), a.release(), i(t);
			}
		}, T.write(o.title, null, "ui.crop.title"), T.write(o.stage, "aria-label", "ui.crop.frame"), T.write(o.zoom, "aria-label", "ui.crop.zoom"), T.write(o.cancel, null, "ui.crop.cancel"), T.write(o.apply, null, "ui.crop.apply"), o.stage.setAttribute(k_, n.frame), e.open(E_), J_(o);
	});
}
function z_() {
	let { dialog: e, surface: t } = v_({
		key: E_,
		className: "ui-image-crop",
		surfaceClassName: "ui-image-crop__surface",
		role: "dialog",
		labelledBy: D_,
		closesOnEscapeAndBackdrop: !1
	}), n = O_.element("h2", "ui-image-crop__title ui-text-type--subtitle");
	n.id = D_;
	let r = O_.element("div", "ui-image-crop__stage", "stage");
	r.setAttribute("tabindex", "0"), r.setAttribute("role", "group");
	let i = O_.element("canvas", "ui-image-crop__canvas"), a = O_.element("span", "ui-image-crop__frame");
	i.setAttribute("aria-hidden", "true"), a.setAttribute("aria-hidden", "true"), r.append(i, a);
	let o = O_.element("input", "ui-image-crop__zoom", "zoom");
	o.type = "range", o.min = "1", o.max = "4", o.step = "0.01";
	let s = O_.button("ui-button--outline", "cancel"), c = O_.button("ui-button--primary", "apply");
	t.append(n, r, o, O_.actions(s, c));
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
		let t = O_.pressed(e);
		t === "cancel" ? z?.finish("cancelled") : t === "apply" && B_();
	}), e.addEventListener("keydown", (e) => V_(l, e)), o.addEventListener("input", () => K_(l, Number(o.value))), r.addEventListener("wheel", (e) => H_(l, e), { passive: !1 }), window.addEventListener("resize", () => Y_(l)), new um({
		root: e,
		resolveHandle: (e) => r.contains(e) ? r : null,
		begin: (e, t) => z === null ? null : {
			last: t,
			start: z.view
		},
		move: (e, t, n) => {
			e.last !== null && U_(l, n.x - e.last.x, n.y - e.last.y), e.last = n;
		},
		end: () => void 0,
		cancel: (e, t) => {
			z !== null && (z.view = t.start, J_(l));
		},
		pinch: (e, t) => {
			e.last = null, W_(l, t);
		}
	}), l;
}
async function B_() {
	let e = z;
	if (e === null) return;
	let { file: t, source: n, request: r, imaging: i, view: a } = e, o = c_(n, a), s = m_(t.type), c = i.encodeAsync(n, o, f_(o, r.size), s);
	z = null;
	let l;
	try {
		l = await c;
	} catch {
		l = null;
	}
	e.finish(l === null ? "unreadable" : new File([l], h_(t.name, t.type, l.type), {
		type: l.type,
		lastModified: t.lastModified
	}));
}
function V_(e, t) {
	if (t.defaultPrevented || k(t) || z === null) return;
	if (t.key === "Escape") {
		t.preventDefault(), z.finish("cancelled");
		return;
	}
	if (t.target !== e.stage || t.ctrlKey || t.altKey || t.metaKey) return;
	let n = t.shiftKey ? 50 : A_;
	switch (t.key) {
		case "ArrowLeft":
			U_(e, -n, 0);
			break;
		case "ArrowRight":
			U_(e, n, 0);
			break;
		case "ArrowUp":
			U_(e, 0, -n);
			break;
		case "ArrowDown":
			U_(e, 0, n);
			break;
		case "+":
		case "=":
			G_(e, j_);
			break;
		case "-":
		case "_":
			G_(e, 1 / j_);
			break;
		case "Enter":
			B_();
			break;
		default: return;
	}
	t.preventDefault();
}
function H_(e, t) {
	if (z === null) return;
	t.preventDefault();
	let n = C_(t, e.stage.clientHeight), r = t.ctrlKey ? N_ : M_;
	G_(e, 2 ** (-n.y / r), q_(e, t.clientX, t.clientY));
}
function U_(e, t, n) {
	z !== null && (z.view = u_(z.source, z.view, e.frame.clientWidth, t, n), J_(e));
}
function W_(e, t) {
	if (z === null) return;
	let n = u_(z.source, z.view, e.frame.clientWidth, t.shift.x, t.shift.y);
	z.view = d_(z.source, n, e.frame.clientWidth, t.factor, q_(e, t.center.x, t.center.y)), J_(e);
}
function G_(e, t, n) {
	z !== null && (z.view = d_(z.source, z.view, e.frame.clientWidth, t, n), J_(e));
}
function K_(e, t) {
	z !== null && Number.isFinite(t) && t > 0 && G_(e, t / z.view.zoom);
}
function q_(e, t, n) {
	let r = e.stage.getBoundingClientRect();
	return {
		x: t - (r.left + r.width / 2),
		y: n - (r.top + r.height / 2)
	};
}
function J_(e) {
	if (z === null) return;
	let t = z.view.zoom;
	e.zoom.value = String(t), e.zoom.setAttribute("aria-valuetext", `${Math.round(t * 100)}%`), e.zoom.style.setProperty("--ui-slider-fraction", String((t - 1) / 3)), Y_(e);
}
function Y_(e) {
	L_ || z === null || (L_ = !0, requestAnimationFrame(() => {
		if (L_ = !1, z === null) return;
		let t = e.frame.clientWidth, n = e.stage.clientWidth, r = e.stage.clientHeight, i = z.view, a = l_(z.source, i, t);
		z.imaging.paint(e.canvas, z.source, {
			left: n / 2 - i.x * a,
			top: r / 2 - i.y * a,
			width: z.source.width * a,
			height: z.source.height * a,
			stageWidth: n,
			stageHeight: r
		});
	}));
}
var X_ = {
	decodeAsync: async (e, t) => {
		let n = await Z_(e);
		if (n === null) return null;
		let r = n, i = p_(r, t);
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
		}, r, P_);
	})
};
async function Z_(e) {
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
var Q_ = "ui-image-input", $_ = "ui-image-input--multiple", ev = "ui-image-input__surface", tv = "ui-image-input__native", nv = "ui-image-input__picture", rv = "ui-image-input__text", iv = "ui-image-input__selection", av = "ui-image-input__selections", ov = "ui-image-input__tiles", sv = "ui-image-input__tile", cv = "ui-image-input__remove", lv = "ui-image-input__progress", uv = "ui-image-input__tile--file", dv = "ui-image-input__file-glyph", fv = "ui-image-input__file-name", pv = "SelectionId", mv = "--ui-image-progress", hv = "data-ui-image-preview", gv = "data-ui-image-dragging", _v = "data-ui-image-tiles", vv = class {
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
		this.root = e.root ?? document, this.validation = e.validation, this.dialogs = e.dialogs, this.cropImaging = e.cropImaging, this.applyAll(this.root.querySelectorAll(`.${Q_}`)), R(this.root, `.${Q_}`, {
			childList: !0,
			attributeFilter: [
				ur,
				Qe,
				Mr
			]
		}, (e) => {
			this.applyAll(e), this.releaseDetached();
		}), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			e.propertyName === pv && (e.value === null || e.value === void 0 || e.value === "") && this.clearAll(Yi(e.components, `.${Q_}`));
		}), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("click", (e) => this.handleRemoveClick(e), !0), this.root.addEventListener("change", (e) => void this.handleNativeChangeAsync(e), !0), this.root.addEventListener(ag, (e) => sg(e, {
			rootSelector: `.${Q_}`,
			nativeSelector: `.${tv}`,
			pressed: (e) => e.querySelector(`.${ev}`)
		})), this.root.addEventListener(Cc, (e) => this.handleDraftDropped(e)), Fh({
			root: this.root,
			draggingAttribute: gv,
			resolveTarget: (e) => {
				let t = e.closest(`.${ev}`), n = t?.closest(`.${Q_}`) ?? null, r = n === null ? Rh(this.root, e, `.${Q_}`) : null, i = n ?? r?.field ?? null, a = t ?? i?.querySelector(`.${ev}`) ?? null;
				return i === null || a === null ? null : {
					host: i,
					mark: r?.component,
					accept: i.querySelector(`.${tv}`)?.getAttribute("accept") ?? "",
					multiple: yv(i),
					refused: O(i) || E(a)
				};
			},
			onFiles: (e, t) => void (yv(e) ? this.takeManyAsync(e, t) : this.takeFileAsync(e, t[0]))
		});
	}
	applyAll(e) {
		for (let t of e) yv(t) ? this.reconcileShelf(t) : this.apply(t);
	}
	apply(e) {
		let t = e.querySelector(`.${nv}`);
		if (t === null) return;
		let n = e.getAttribute("data-ui-image-source") ?? "", r = this.previews.has(e);
		if (r && e.dataset.previewFor === n) return;
		let i = r && n.length > 0;
		this.dropPreview(e, i), n.length === 0 ? t.removeAttribute("src") : t.getAttribute("src") !== n && t.setAttribute("src", n), i || Tv(e, e.getAttribute("data-ui-image-caption") ?? Ov(n)), Dv(e, n.length > 0);
	}
	reconcileShelf(e) {
		let t = this.shelves.get(e), n = e.getAttribute(Mr);
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
		for (let t of e) yv(t) || this.previews.get(t)?.landed !== !0 || (t.dataset.previewFor === (t.getAttribute("data-ui-image-source") ?? "") && this.dropPreview(t), this.apply(t));
	}
	handlePickClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${fr}]`), n = t?.closest(`.${Q_}`) ?? null;
		t === null || n === null || O(n) || E(t) || n.querySelector(`.${tv}`)?.click();
	}
	handleRemoveClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${cv}`), n = t?.closest(`.${Q_}`) ?? null;
		if (t === null || n === null || O(n) || E(n)) return;
		e.preventDefault(), e.stopPropagation();
		let r = this.shelves.get(n)?.find((e) => e.element === t.parentElement);
		r !== void 0 && (this.dropTile(n, r), this.publishShelf(n));
	}
	async handleNativeChangeAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(tv)) return;
		let t = e.target.closest(`.${Q_}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && n.length !== 0 && (yv(t) ? await this.takeManyAsync(t, n) : await this.takeFileAsync(t, n[0]));
	}
	handleDraftDropped(e) {
		if (e.target instanceof Element) for (let t of e.target.querySelectorAll(`.${Q_}`)) this.previews.has(t) && (this.dropPreview(t), this.apply(t), ig(t.querySelector(`.${iv}`), ""));
	}
	async takeFileAsync(e, t) {
		this.releaseDetached();
		let n = e.querySelector(`.${ev}`), r = e.querySelector(`.${nv}`), i = e.querySelector(`.${iv}`);
		if (n === null || r === null) return;
		let a = await this.cropAsync(e, t);
		if (a === null || Zh(e, [a], !1, this.validation).length === 0) return;
		this.dropPreview(e);
		let o = {
			url: URL.createObjectURL(a),
			landed: !1
		};
		this.previews.set(e, o), this.holding.add(e), e.dataset.previewFor = e.getAttribute("data-ui-image-source") ?? "", e.setAttribute(hv, ""), r.setAttribute("src", o.url), Tv(e, a.name), Dv(e, !0), n.classList.add(Vr);
		try {
			let t = await tg([a], () => void 0);
			this.previews.get(e) === o && (o.landed = !0, ig(i, t.selectionId));
		} catch (t) {
			s("picture upload failed.", t), this.previews.get(e) === o && (Ev(e), ig(i, ""));
		} finally {
			(this.previews.get(e) === o || !this.previews.has(e)) && n.classList.remove(Vr);
		}
	}
	async cropAsync(e, t) {
		let n = xv(e);
		if (n === null || this.dialogs === void 0) return t;
		if (this.cropping.has(e)) return null;
		this.cropping.add(e);
		try {
			let r = await R_(this.dialogs, t, {
				frame: n,
				size: Sv(e)
			}, this.cropImaging);
			return r === "cancelled" || !e.isConnected ? null : r === "unreadable" ? (this.unreadable.add(e), this.validation?.mark(e, "error", { key: "ui.image.unreadable" }), null) : (this.unreadable.delete(e) && this.validation?.mark(e, null), r);
		} finally {
			this.cropping.delete(e);
		}
	}
	async takeManyAsync(e, t) {
		this.releaseDetached();
		let n = e.querySelector(`.${ov}`), r = Zh(e, t, !0, this.validation);
		if (n === null || r.length === 0) return;
		let i = this.shelves.get(e) ?? [];
		this.shelves.set(e, i), this.holding.add(e);
		let a = r.map(async (t) => {
			let r = Cv(t);
			i.push(r), n.appendChild(r.element);
			try {
				let n = await tg([t], (e) => r.element.style.setProperty(mv, `${e}%`));
				if (!i.includes(r)) return;
				r.selectionId = n.selectionId, r.element.classList.remove(Vr), this.publishShelf(e);
			} catch (t) {
				this.dropTile(e, r), s("picture upload failed.", t);
			}
		});
		bv(e, i), await Promise.all(a);
	}
	dropTile(e, t) {
		let n = this.shelves.get(e), r = n?.indexOf(t) ?? -1;
		n !== void 0 && r >= 0 && n.splice(r, 1), URL.revokeObjectURL(t.url), t.element.remove(), bv(e, n ?? []);
	}
	publishShelf(e) {
		let t = e.querySelector(`.${av}`), n = (this.shelves.get(e) ?? []).map((e) => e.selectionId).filter((e) => e !== null), r = JSON.stringify(n);
		if (t === null || t.getAttribute("data-ui-selected-keys") === r) return;
		let i = this.published.get(e) ?? [];
		i.push(r), this.published.set(e, i), t.setAttribute(Mr, r), t.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	dropPreview(e, t = !1) {
		let n = this.previews.get(e);
		n !== void 0 && (URL.revokeObjectURL(n.url), this.previews.delete(e), delete e.dataset.previewFor, e.removeAttribute(hv), t || Tv(e, ""));
	}
};
function yv(e) {
	return e.classList.contains($_);
}
function bv(e, t) {
	e.hasAttribute(_v) !== t.length > 0 && e.toggleAttribute(_v, t.length > 0);
}
function xv(e) {
	let t = e.getAttribute($e);
	return t === "square" || t === "circle" ? t : null;
}
function Sv(e) {
	let t = Number(e.getAttribute(et));
	return Number.isInteger(t) && t > 0 ? t : i_;
}
function Cv(e) {
	let t = document.createElement("span"), n = document.createElement("button"), r = document.createElement("span"), i = URL.createObjectURL(e);
	if (t.className = `${sv} ${Vr}`, n.type = "button", n.className = cv, r.className = lv, e.type.startsWith("image/")) {
		let a = document.createElement("img");
		a.src = i, a.alt = e.name, T.write(n, "aria-label", "ui.image.remove"), a.addEventListener("error", () => t.replaceChildren(...wv(t, n, e), n, r), { once: !0 }), t.append(a, n, r);
	} else t.append(...wv(t, n, e), n, r);
	return {
		element: t,
		url: i,
		selectionId: null
	};
}
function wv(e, t, n) {
	let r = document.createElement("span"), i = document.createElement("span");
	return e.classList.add(uv), e.setAttribute("title", n.name), r.className = dv, r.setAttribute("aria-hidden", "true"), $g(r, Ag(n.name, n.type)), i.className = fv, i.textContent = n.name, T.write(t, "aria-label", "ui.file.remove"), [r, i];
}
function Tv(e, t) {
	let n = e.querySelector(`.${rv}`);
	n !== null && (Ao(n, null), n.textContent !== t && (n.textContent = t));
}
function Ev(e) {
	let t = e.querySelector(`.${rv}`);
	t !== null && T.write(t, null, "ui.file.failed");
}
function Dv(e, t) {
	let n = e.querySelector(`.${ev}`);
	n !== null && T.write(n, "aria-label", t ? "ui.image.change" : "ui.image.choose");
}
function Ov(e) {
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
var kv = "ui-key-value-action__value", Av = "ui-key-value-action--editable", jv = "ui-text__title", Mv = "ui-row-form-", Nv = ":scope > :is(.ui-input--filled, .ui-input--tonal, .ui-input--outline, .ui-input--ghost, .ui-input--underline)", Pv = class {
	options;
	root;
	openRows = /* @__PURE__ */ new WeakSet();
	closedRows = /* @__PURE__ */ new WeakSet();
	rowForms = /* @__PURE__ */ new WeakMap();
	formCount = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.handleRows(this.root.querySelectorAll(`.${sc}`), !1), R(this.root, `.${sc}`, {
			childList: !0,
			attributeFilter: [ir]
		}, (e) => this.handleRows(e, !0)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && zv(e.target) && e.preventDefault();
		}, !0), (this.root === document ? window : this.root).addEventListener("change", (e) => Rv(e), !0);
	}
	handleRows(e, t) {
		for (let n of e) {
			if (!n.hasAttribute("data-ui-row-editing")) {
				this.closedRows.has(n) || (this.openRows.delete(n), this.closedRows.add(n), this.close(n));
				continue;
			}
			this.closedRows.delete(n), this.joinForm(n), Fv(n), this.openRows.has(n) || (this.openRows.add(n), this.open(n, t), this.judge(n));
		}
	}
	joinForm(e) {
		let t = e.querySelector(`.${lc} button`);
		if (t === null) return;
		let n = this.rowForms.get(e);
		n === void 0 && (n = `${Mv}${++this.formCount}`, this.rowForms.set(e, n));
		for (let t of e.querySelectorAll(`.${cc} [${Ye}]:not([${Lt}])`)) t.setAttribute(Lt, n);
		t.setAttribute(Rr, n);
	}
	leaveForm(e) {
		let t = this.rowForms.get(e);
		if (t !== void 0) for (let n of e.querySelectorAll(`[${Lt}="${t}"], [${Rr}="${t}"]`)) n.removeAttribute(Lt), n.removeAttribute(Rr);
	}
	close(e) {
		this.leaveForm(e);
		for (let t of e.querySelectorAll(`.${cc} [${Ye}]`)) {
			if (yc(t)) {
				t.value = "";
				continue;
			}
			let e = this.options.dom.resolveNearestComponent(t, () => !0);
			this.options.propertyPatchEngine.restoreBoundValue(t, e?.dynamicParameters ?? []);
		}
		wc(e), this.judge(e);
	}
	judge(e) {
		let t = Lv(e);
		for (let n of e.querySelectorAll(`.${cc} [${Ye}]`)) this.options.validation.judgeShown(n, yc(n) && n.value.length === 0 ? t : null);
	}
	open(e, t) {
		let n = e.querySelector(`.${cc} :is(input, textarea, select)`);
		if (n !== null) {
			if (yc(n) && n.value.length === 0 && n.hasAttribute("data-ui-bind-value")) {
				let t = Lv(e);
				t.length > 0 && (n.value = t, n.dispatchEvent(new Event("change", { bubbles: !0 })));
			}
			t && (n.focus({ preventScroll: !0 }), vc(n) && n.select());
		}
	}
	handleKeydown(e) {
		if (e.key === "F2" && !e.defaultPrevented && A(e)) {
			Iv(e);
			return;
		}
		if (e.defaultPrevented || k(e) || !(e.target instanceof Element) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = pc(e.target);
		if (t === null || e.key === "Enter" && t.cell.classList.contains("ui-key-value-action__edit-action")) return;
		let { cell: n, row: r } = t, i = e.target.closest(Yr), a = n.querySelector("[role='listbox']");
		if (i !== null && n.contains(i) || a !== null && a.getClientRects().length > 0 || e.key === "Enter" && e.target instanceof HTMLTextAreaElement) return;
		let o = r.querySelectorAll(`.${lc} button`), s = e.key === "Enter" ? o[0] : o[o.length - 1];
		s !== void 0 && (e.preventDefault(), !E(s) && (e.key === "Enter" && e.target instanceof HTMLInputElement && (e.target.dispatchEvent(new Event("change", { bubbles: !0 })), s.focus({ preventScroll: !0 })), s.click()));
	}
};
function Fv(e) {
	for (let t of e.querySelectorAll(`:scope > .${cc}`)) {
		let e = t.querySelector(Nv) !== null;
		t.hasAttribute("data-ui-boxed-editor") !== e && t.toggleAttribute(ar, e);
	}
}
function Iv(e) {
	let t = e.target instanceof Element ? e.target.closest(`.${sc}`) : null, n = t === null || t.hasAttribute("data-ui-row-editing") || t.closest(`.${Av}`) === null ? null : t.querySelector(".ui-key-value-action__action")?.querySelector(Fu) ?? null;
	n === null || E(n) || (e.preventDefault(), n.click());
}
function Lv(e) {
	return e.querySelector(`.${kv} .${jv}`)?.textContent?.trim() ?? "";
}
function Rv(e) {
	if (!e.isTrusted || !(e.target instanceof Element)) return;
	let t = e.target.closest(".ui-key-value-action__value-input")?.closest(".ui-key-value-action__row") ?? null;
	t !== null && !t.hasAttribute("data-ui-row-editing") && e.stopImmediatePropagation();
}
function zv(e) {
	let t = e.closest(`.${lc} button`), n = t?.closest(`.${lc}`)?.querySelectorAll("button");
	return t !== null && n !== void 0 && n[n.length - 1] === t;
}
//#endregion
//#region src/interactions/toggle-button-engine.ts
var Bv = `.ui-button[${bt}="pressed"]`, Vv = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(Bv);
		t === null || E(t) || (t.setAttribute("aria-pressed", t.getAttribute("aria-pressed") === "true" ? "false" : "true"), t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, Hv = `${Ec}, [tabindex], [contenteditable], ${Yr}, [${Ze}]`, Uv = ":scope > input.ui-field, :scope > textarea.ui-field", Wv = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("pointerdown", (e) => this.handlePointerDown(e));
	}
	handlePointerDown(e) {
		if (e.defaultPrevented || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(Tc);
		if (t === null || e.target !== t && e.target.closest(Hv) !== null) return;
		let n = t.querySelector(Uv);
		if (!yc(n) || n.readOnly || E(n) || O(n) || (e.preventDefault(), n.focus({ preventScroll: !0 }), n.selectionStart === null)) return;
		let r = n.value.length;
		n.setSelectionRange(r, r);
	}
}, Gv = "data-ui-input-debounce", Kv = `input[${Gv}], textarea[${Gv}]`;
function qv(e) {
	return (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.matches(Kv);
}
var Jv = /* @__PURE__ */ new Set();
function Yv() {
	for (let e of Jv) if (e.waiting) return !0;
	return !1;
}
function Xv() {
	for (let e of Jv) e.commitAll();
}
function Zv(e) {
	for (let t of Jv) t.drop(e);
}
var Qv = class {
	root;
	timers = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleChange(e), !0), Jv.add(this);
	}
	get waiting() {
		return this.timers.size > 0;
	}
	drop(e) {
		if (!qv(e)) return;
		let t = this.timers.get(e);
		t !== void 0 && (window.clearTimeout(t), this.timers.delete(e));
	}
	commitAll() {
		for (let [e, t] of [...this.timers]) window.clearTimeout(t), this.commit(e);
	}
	handleInput(e) {
		let t = e.target;
		if (!qv(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = Number(t.getAttribute(Gv));
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(r) && r >= 0 ? r : 0));
	}
	handleChange(e) {
		let t = e.target;
		if (!qv(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && (window.clearTimeout(n), this.timers.delete(t));
	}
	commit(e) {
		this.timers.delete(e), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
}, $v = "data-ui-submit-on-enter", ey = "data-ui-runs-on-enter", ty = "enter", ny = "escape", ry = {
	name: ty,
	registration: { settlesValue: !0 }
}, iy = "ui-commit-in-place", ay = class {
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
		}, !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), this.root.addEventListener(iy, (e) => {
			(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) && this.commitInPlace(e.target);
		}), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = this.focusedField;
			t !== null && !(e.local && this.edited.has(t)) && e.components.some((e) => e.contains(t)) && (this.lastCommitted = t.value);
		});
	}
	handleKeydown(e) {
		if (e.defaultPrevented || k(e) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = e.target;
		if (t instanceof HTMLTextAreaElement) {
			e.key === "Escape" ? (e.preventDefault(), fc(t) ? this.runEscape(t, e) : this.leave(t)) : oy(t, e) ? (e.preventDefault(), this.runEnter(t, e)) : sy(t, e) && (e.preventDefault(), this.commitInPlace(t), this.submitForm(t));
			return;
		}
		if (vc(t)) {
			if (e.preventDefault(), oy(t, e)) {
				this.runEnter(t, e);
				return;
			}
			if (e.key === "Escape" && fc(t)) {
				this.runEscape(t, e);
				return;
			}
			this.leave(t), e.key === "Enter" && this.submitForm(t);
		}
	}
	runEnter(e, t) {
		t.repeat || e.readOnly || E(e) || (this.commitInPlace(e), e.dispatchEvent(new Event(ty, { bubbles: !0 })));
	}
	runEscape(e, t) {
		if (t.repeat) return;
		Zv(e), this.edited.delete(e), e === this.focusedField && e.value !== this.lastCommitted && this.putBack(e, this.lastCommitted);
		let n = fd(e);
		e.blur(), pd(e, n), e.dispatchEvent(new Event(ny, { bubbles: !0 }));
	}
	putBack(e, t) {
		this.propertyPatchEngine?.writeBoundValue(e, t), e.value !== t && (e.value = t);
	}
	submitForm(e) {
		let t = e.getAttribute(Lt);
		if (t === null || t.length === 0) return;
		let n = this.root.querySelector(`[${Rr}="${x(t)}"]`);
		n !== null && !E(n) && n.click();
	}
	leave(e) {
		let t = this.changes, n = fd(e);
		e.blur(), this.changes === t && this.commit(e), pd(e, n);
	}
	commit(e) {
		e.value !== this.committedValue && e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	commitInPlace(e) {
		this.edited.has(e) ? e.dispatchEvent(new Event("change", { bubbles: !0 })) : this.commit(e);
	}
};
function oy(e, t) {
	return cy(t) && e.hasAttribute(ey);
}
function sy(e, t) {
	return cy(t) && e.hasAttribute($v) && !e.readOnly && !E(e);
}
function cy(e) {
	return e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey;
}
//#endregion
//#region src/interactions/image-fallback-engine.ts
var ly = `img.${tt}`, uy = "%238c8c8c", dy = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='-12 -12 48 48'%3E%3Crect x='3' y='3' width='18' height='18' rx='3' fill='none' stroke='${uy}' stroke-width='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.75' fill='${uy}'/%3E%3Cpath d='M4 18l5-6 4 4.5 3-3 4 4.5' fill='none' stroke='${uy}' stroke-width='2' stroke-linejoin='round'/%3E%3C/svg%3E`, fy = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='-12 -12 48 48'%3E%3Ccircle cx='12' cy='8' r='4' fill='${uy}'/%3E%3Cpath d='M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z' fill='${uy}'/%3E%3C/svg%3E`, py = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("error", (e) => this.handleError(e), !0);
		for (let e of this.root.querySelectorAll(ly)) (my(e) || e.complete && e.naturalWidth === 0) && gy(e);
		R(this.root, ly, {
			childList: !0,
			attributeFilter: ["src"]
		}, (e) => {
			for (let t of e) t instanceof HTMLImageElement && (t.hasAttribute("data-ui-image-failed") && !hy(t) && t.removeAttribute(rt), my(t) && gy(t));
		});
	}
	handleError(e) {
		let t = e.target;
		t instanceof HTMLImageElement && t.matches(ly) && gy(t);
	}
};
function my(e) {
	let t = e.getAttribute("src");
	return t === null || t.trim().length === 0;
}
function hy(e) {
	let t = e.getAttribute("src");
	return t === dy || t === fy;
}
function gy(e) {
	let t = e.getAttribute(nt);
	if (t !== null && t.length > 0 && e.getAttribute("src") !== t) {
		e.setAttribute("src", t);
		return;
	}
	hy(e) || (e.setAttribute(rt, ""), e.setAttribute("src", e.classList.contains("ui-image--circle") ? fy : dy));
}
//#endregion
//#region src/items/radio-row-decorator.ts
var _y = "ui-radio-group__input", vy = "ui-radio-group__dot", yy = {
	kind: "radio",
	decorate: by
};
function by(e) {
	let t = document.createElement("input");
	t.className = _y, t.type = "radio", t.value = e.key;
	let n = document.createElement("span");
	n.className = vy, e.row.prepend(t, n);
}
//#endregion
//#region src/interactions/radio-group-sync-engine.ts
var xy = "data-ui-radio-value", Sy = "ui-radio-group", Cy = "ui-radio-group__item", wy = "data-ui-radio-group-name", Ty = "data-ui-radio-bind-value-id", Ey = class {
	root;
	renamed = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.claimGroupNames([...this.root.querySelectorAll(`.${Sy}`)]);
		for (let e of this.root.querySelectorAll(`.${Sy}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = [];
			for (let n of e) {
				if (n.type === "attributes" && n.target instanceof HTMLElement) {
					this.sync(n.target.closest(`.${Sy}`));
					continue;
				}
				for (let e of n.addedNodes) e instanceof HTMLElement && t.push(e);
			}
			this.claimGroupNames(t.flatMap(Dy));
			for (let e of new Set(t.map((e) => e.closest(`.${Sy}`)))) this.sync(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: [xy, "class"],
			childList: !0,
			subtree: !0
		});
	}
	claimGroupNames(e) {
		if (e.length === 0) return;
		let t = /* @__PURE__ */ new Map();
		for (let e of this.root.querySelectorAll(`.${Sy}`)) {
			let n = e.getAttribute(wy);
			n !== null && t.set(n, (t.get(n) ?? 0) + 1);
		}
		let n = /* @__PURE__ */ new Set();
		for (let r of e) {
			let e = r.getAttribute(wy), i = e === null ? 0 : t.get(e) ?? 0;
			if (e === null || i < 2) continue;
			t.set(e, i - 1), n.add(e);
			let a = `${e}-${++this.renamed}`;
			r.setAttribute(wy, a);
			for (let e of nl(r, `.${_y}`, `.${Sy}`)) e.name = a;
			this.sync(r);
		}
		if (n.size !== 0) for (let e of this.root.querySelectorAll(`.${Sy}`)) n.has(e.getAttribute(wy) ?? "") && this.sync(e);
	}
	sync(e) {
		if (e === null) return;
		let t = e.getAttribute(xy), n = e.getAttribute(wy), r = e.getAttribute(Ty);
		for (let i of nl(e, `.${_y}`, `.${Sy}`)) {
			n !== null && i.name !== n && (i.name = n), r !== null && i.getAttribute("data-ui-bind-value") !== r && i.setAttribute(Ye, r), i.checked = i.value === t;
			let e = Oy(i);
			i.disabled !== e && (i.disabled = e);
		}
	}
};
function Dy(e) {
	return e.classList.contains(Sy) ? [e] : [...e.querySelectorAll(`.${Sy}`)];
}
function Oy(e) {
	let t = e.closest(`.${Cy}`);
	return t !== null && D(t);
}
//#endregion
//#region src/interactions/search-input-engine.ts
var ky = "data-ui-search-debounce", Ay = "data-ui-search-min-length", jy = "data-ui-search-manual", My = "data-ui-search-answered", Ny = "ui-search__input", Py = "ui-select__list", Fy = "ui-select__option", Iy = 300, Ly = class {
	root;
	timers = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("compositionend", (e) => this.handleInput(e), !0), this.root.addEventListener("keydown", (e) => this.handleEnter(e), !0);
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Ny) || e instanceof InputEvent && e.isComposing) return;
		let t = e.target;
		zy(t);
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = t.getAttribute(ky), i = r === null ? Iy : Number(r);
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(i) && i >= 0 ? i : Iy));
	}
	handleEnter(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Enter" || e.defaultPrevented || k(e) || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Ny)) return;
		let t = e.target, n = this.timers.get(t);
		e.preventDefault(), n !== void 0 && (window.clearTimeout(n), this.timers.delete(t)), this.commit(t, !0);
	}
	commit(e, t = !1) {
		e.dispatchEvent(new Event("change", { bubbles: !0 })), !(!t && e.hasAttribute(jy)) && Ry(e) && e.dispatchEvent(new Event("search", { bubbles: !0 }));
	}
};
function Ry(e) {
	let t = Number(e.getAttribute(Ay) ?? 0);
	return !Number.isFinite(t) || e.value.trim().length >= t;
}
function zy(e) {
	if (e.hasAttribute(My)) return;
	let t = e.closest(`.${ei}`), n = t?.querySelector(`.${Py}`);
	if (t == null || n == null) return;
	let r = Ry(e) ? im(e.value, e) : [], i = By(n, (e) => r.length === 0 || om(am(lm(e), e), r));
	Uy(t, n, r.length > 0 && i === 0);
}
function By(e, t) {
	let n = null, r = !1, i = 0;
	for (let a of e.children) {
		if (!(a instanceof HTMLElement)) continue;
		if (a.hasAttribute("data-ui-group-header")) {
			n !== null && Vy(n, r), n = a, r = !1;
			continue;
		}
		if (!a.classList.contains(Fy)) continue;
		let e = t(a);
		Vy(a, e), r ||= e, e && i++;
	}
	return n !== null && Vy(n, r), i;
}
function Vy(e, t) {
	let n = t ? "" : "none";
	e.style.display !== n && (e.style.display = n);
}
function Hy(e) {
	let t = e.querySelector(`.${Py}`);
	t !== null && Uy(e, t, By(t, (e) => e.style.display !== "none") === 0);
}
function Uy(e, t, n) {
	let r = t.querySelector(`:scope > [${mt}]`);
	if (!n) {
		r?.remove();
		return;
	}
	if (r !== null) return;
	let i = e.querySelector(`:scope > template[${ft}]`);
	if (i === null) return;
	let a = i.content.cloneNode(!0).firstElementChild;
	a !== null && (a.setAttribute(mt, ""), t.appendChild(a));
}
//#endregion
//#region src/interactions/type-ahead.ts
var Wy = 500, Gy = class {
	owner = null;
	typed = "";
	last = -Infinity;
	now;
	constructor(e = () => performance.now()) {
		this.now = e;
	}
	next(e) {
		let t = this.now();
		(e.owner !== this.owner || t - this.last > Wy) && (this.typed = ""), this.owner = e.owner, this.last = t, this.typed += am(e.character, e.context);
		let n = Array.from(this.typed), r = n.every((e) => e === n[0]), i = r ? n[0] : this.typed, a = e.entries.length, o = e.current === null ? -1 : e.entries.indexOf(e.current), s = r ? o + 1 : Math.max(o, 0);
		for (let t = 0; t < a; t++) {
			let n = e.entries[(s + t) % a];
			if (am(e.words(n), e.context).trimStart().startsWith(i)) return n;
		}
		return null;
	}
};
function Ky(e) {
	return k(e) || e.metaKey || Array.from(e.key).length !== 1 || !/\S/u.test(e.key) || (e.ctrlKey || e.altKey) && !e.getModifierState("AltGraph") ? null : e.key;
}
//#endregion
//#region src/interactions/select-interaction-engine.ts
var qy = "data-ui-select-value", Jy = "data-ui-select-placement", Yy = "ui-select--open", Xy = "ui-select__trigger-content", Zy = "data-ui-select-content", Qy = "ui-select__placeholder", $y = "ui-input__affix-icon--prefix", eb = "ui-select__popup", tb = "ui-select__list", nb = "ui-select__option", rb = "ui-select__value-input", ib = "data-ui-select-clear", ab = "ui-search", ob = "ui-search__input", sb = "data-ui-active", cb = "data-ui-list-keyboard", lb = /* @__PURE__ */ new Set([
	"ArrowDown",
	"ArrowUp",
	"Home",
	"End",
	"PageDown",
	"PageUp"
]), ub = "ui-multi-select", db = "ui-multi-select__chips", fb = "ui-multi-select__chip", pb = "ui-multi-select__chip-label", mb = "ui-multi-select__chip-remove", hb = "data-ui-select-chip", gb = "data-ui-select-chips", _b = "data-ui-select-max", vb = "data-ui-select-free-text", yb = "ui-multi-select__entry", bb = "data-ui-select-tag-entry", xb = [
	qy,
	Mr,
	_b,
	"class",
	_
];
function Sb(e) {
	return e === null || O(e) || E(e);
}
function Cb(e) {
	return e.classList.contains(ub);
}
function wb(e) {
	return e.classList.contains(ab);
}
function Tb(e) {
	return wb(e) ? e.querySelector(`.${ob}`) : null;
}
function Eb(e) {
	return e.hasAttribute(vb) ? e.querySelector(`:scope > .${Xr} .${yb}`) : null;
}
function Db(e) {
	return Tb(e) ?? Eb(e);
}
function Ob(e) {
	return Eb(e) ?? e.querySelector(".ui-select__trigger");
}
function kb(e) {
	let t = e.target instanceof HTMLInputElement && e.target.classList.contains(yb) ? e.target : null, n = t?.closest(".ui-select") ?? null;
	return t === null || n === null ? null : {
		entry: t,
		select: n
	};
}
function Ab(e) {
	return nl(e, `.${eb} .${nb}`, `.${ei}`);
}
function jb(e) {
	let t = Ab(e).filter((e) => !D(e));
	return t.find((e) => e === document.activeElement) ?? t.find((e) => e.hasAttribute(sb)) ?? null;
}
function Mb(e) {
	for (let t of nl(e, `.${tb}`, `.${ei}`)) {
		let e = t.querySelector(`:scope > .${nb}[${sb}]:not([${Tr}])`) !== null;
		t.hasAttribute(cb) !== e && t.toggleAttribute(cb, e);
	}
}
function Nb(e) {
	return e === null ? null : lm(e);
}
function Pb(e) {
	for (let t of [e, ...e.querySelectorAll("*")]) {
		t.removeAttribute(ae), t.removeAttribute(_), t.removeAttribute(se), t.removeAttribute(oe);
		for (let e of [...t.attributes]) e.name.startsWith("data-ui-bind-") && t.removeAttribute(e.name);
	}
}
var Fb = class {
	root;
	popups = new Km({
		show: ({ owner: e }) => e.classList.add(Yy),
		hide: ({ owner: e }) => {
			e.classList.remove(Yy), this.markActive(e, null);
			let t = e.querySelector(`.${eb}`);
			t !== null && (t.style.minHeight = "");
		},
		closesOnTab: !0,
		sheetOnPhone: ({ owner: e }) => Db(e) === null
	});
	typeAhead = new Gy();
	drawnKeys = /* @__PURE__ */ new WeakMap();
	validation;
	refusedEntries = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation;
		for (let e of this.root.querySelectorAll(`.${ei}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = /* @__PURE__ */ new Set();
			for (let n of e) Kb(n, t);
			for (let e of t) this.sync(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: xb,
			childList: !0,
			characterData: !0,
			subtree: !0
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && (e.target.closest(`[${ib}], .${mb}`) !== null || Vb(e.target)) && e.preventDefault();
		}, !0), window.addEventListener("input", (e) => this.handleEntryEdit(e), !0), window.addEventListener("compositionend", (e) => this.handleEntryEdit(e), !0), window.addEventListener("change", (e) => this.holdEntryDraft(e), !0), window.addEventListener("keydown", (e) => this.handleEntryEscape(e), !0), this.root.addEventListener("paste", (e) => this.handleEntryPaste(e), !0);
	}
	handleEntryEdit(e) {
		let t = this.holdEntryDraft(e);
		if (t === null || e.isComposing === !0) return;
		let { entry: n, select: r } = t;
		if (Sb(r)) return;
		this.releaseRefusal(r);
		let i = el(n.value);
		i.tags.length > 0 ? this.enterTyped(r, n, i.tags, i.rest) : this.suggest(r, n);
	}
	holdEntryDraft(e) {
		let t = kb(e);
		return t === null || this.root instanceof Node && !this.root.contains(t.select) ? null : (e.stopImmediatePropagation(), t);
	}
	handleEntryEscape(e) {
		let t = e instanceof KeyboardEvent && e.key === "Escape" && !e.defaultPrevented && !k(e) ? kb(e) : null;
		t === null || this.openSelect !== t.select || t.select.getAttribute(bb) !== "first-suggestion" || !Ab(t.select).some((e) => e.hasAttribute(sb)) || (e.preventDefault(), this.markActive(t.select, null));
	}
	handleEntryPaste(e) {
		let t = kb(e), n = e.clipboardData?.getData("text") ?? "";
		if (t === null || Sb(t.select) || !Qc(n)) return;
		let { entry: r, select: i } = t, a = r.selectionStart ?? r.value.length, o = r.selectionEnd ?? a;
		e.preventDefault(), this.releaseRefusal(i), this.enterTyped(i, r, $c(r.value.slice(0, a) + n + r.value.slice(o)), "");
	}
	enterTyped(e, t, n, r) {
		let i = Kc(e.getAttribute(Mr)), a = qc(e.getAttribute(_b)), o = tl(i, n.map((t) => ({
			text: t,
			key: Hb(e, t) ?? t
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
		zy(t);
		let n = t.value.trim().length > 0, r = n ? Lb(e) : [], i = r.find((e) => e.getAttribute("aria-selected") !== "true") ?? null;
		this.openSelect === e ? r.length > 0 || !n ? this.popups.reposition(e) : this.close() : r.length > 0 && this.toggle(e, !0), this.openSelect === e && e.getAttribute(bb) === "first-suggestion" && (this.markActive(e, i), i !== null && zb(e, i));
	}
	get openSelect() {
		return this.popups.current;
	}
	sync(e) {
		if (Mb(e), Cb(e)) {
			this.syncMultiple(e);
			return;
		}
		let t = e.getAttribute(qy);
		this.decorateOptions(e);
		let n = t === null ? null : Ab(e).find((e) => e.getAttribute("data-ui-key") === t) ?? null, r = this.renderTriggerContent(e, n, t), i = e.querySelector(`.${Qy}`);
		i !== null && (i.style.display = r ? "none" : "");
		for (let n of Ab(e)) n.setAttribute("aria-selected", t !== null && n.dataset.uiKey === t ? "true" : "false");
		let a = e.querySelector(`.${rb}`);
		a !== null && a.value !== (t ?? "") && (a.value = t ?? ""), Hy(e);
	}
	syncMultiple(e) {
		let t = Kc(e.getAttribute(Mr)), n = new Set(t), r = Jc(t, qc(e.getAttribute(_b)));
		this.decorateOptions(e, (e) => r && !n.has(e.dataset.uiKey ?? ""));
		let i = Ab(e), a = new Map(i.map((e) => [e.dataset.uiKey ?? "", e])), o = Eb(e), s = o === null ? t.filter((e) => a.has(e)) : t;
		Wb(e, s.map((e) => ({
			key: e,
			label: Ub(a.get(e) ?? null, e)
		}))), o !== null && o.readOnly !== Sb(e) && (o.readOnly = Sb(e));
		let c = e.querySelector(`.${Qy}`);
		c !== null && (c.style.display = s.length > 0 ? "none" : "");
		for (let e of i) e.setAttribute("aria-selected", n.has(e.dataset.uiKey ?? "") ? "true" : "false");
		let l = e.querySelector(`.${rb}`), u = JSON.stringify(t);
		l !== null && l.getAttribute("data-ui-selected-keys") !== u && l.setAttribute(Mr, u), Hy(e);
	}
	renderTriggerContent(e, t, n) {
		let r = e.querySelector(`.${Xr}`);
		if (r === null) return t !== null;
		let i = r.querySelector(`:scope > .${Xy}`), a = i?.getAttribute(Zy) ?? null;
		if (i !== null && a !== null && (i.removeAttribute(Zy), this.drawnKeys.set(e, a)), t === null) return i !== null && n !== null && wb(e) && this.drawnKeys.get(e) === n ? !0 : (i?.remove(), this.drawnKeys.delete(e), !1);
		let o = t.getAttribute(_);
		if (o === null ? this.drawnKeys.delete(e) : this.drawnKeys.set(e, o), i !== null && o !== null && a === o) return !0;
		if (i === null) {
			i = document.createElement("span"), i.className = Xy;
			let e = r.querySelector(`:scope > .${$y}`);
			e === null ? r.prepend(i) : e.after(i);
		}
		i.style.display = "inline-flex";
		let s = t.cloneNode(!0);
		return Pb(s), i.replaceChildren(...s.childNodes), !0;
	}
	decorateOptions(e, t = () => !1) {
		for (let n of Ab(e)) {
			n.hasAttribute("role") || n.setAttribute("role", "option");
			let e = D(n), r = e || t(n) ? "true" : "false";
			n.getAttribute("aria-disabled") !== r && n.setAttribute("aria-disabled", r), (e ? n.tabIndex !== -1 : !n.hasAttribute("tabindex")) && (n.tabIndex = -1);
		}
	}
	handlePointerMove(e) {
		let t = this.openSelect, n = t === null || !(e.target instanceof Element) ? null : e.target.closest(`.${nb}`);
		t === null || n === null || n.hasAttribute(sb) || D(n) || E(n) || n.closest(".ui-select") !== t || (Db(t) === null && (j(Ab(t).filter((e) => !D(e)), n), nd(n)), this.markActive(t, n, !0));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${mb}`);
		if (t !== null) {
			let n = t.closest(`.${ei}`);
			n !== null && (e.preventDefault(), e.stopPropagation(), Sb(n) || this.removeChosen(n, t.closest(`.${fb}`)?.getAttribute(hb) ?? null));
			return;
		}
		let n = e.target.closest(`[${ib}]`);
		if (n !== null) {
			let t = n.closest(`.${ei}`);
			t !== null && (e.preventDefault(), e.stopPropagation(), Sb(t) || (this.clearValue(t), Ib(t)));
			return;
		}
		let r = e.target.closest(`.${Xr}`);
		if (r !== null) {
			let t = r.closest(`.${ei}`);
			if (Sb(t)) return;
			e.preventDefault();
			let n = t === null ? null : Eb(t);
			t !== null && n !== null ? this.pressEntryBox(t, n, e.target === n) : this.toggle(t);
			return;
		}
		let i = e.target.closest(`.${nb}`);
		if (i === null) return;
		let a = i.closest(`.${ei}`);
		a !== null && this.choose(a, i);
	}
	pressEntryBox(e, t, n) {
		document.activeElement !== t && t.focus(), !(Ab(e).length === 0 || n && this.openSelect === e) && this.toggle(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || k(e) || (this.openSelect !== null && Mb(this.openSelect), this.handleEntryKey(e) || this.handleChipKey(e)) || this.openSelect !== null && e.target instanceof Node && this.openSelect.contains(e.target) && this.handleOpenListKey(e, this.openSelect) || (e.key === "ArrowDown" || e.key === "ArrowUp") && A(e, { alt: e.key === "ArrowDown" }) && this.handleClosedArrow(e) || this.handleTypeAhead(e) || this.handleMultipleTriggerKey(e) || e.key !== "Enter" && e.key !== " " || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${nb}`) ?? this.markedOption(e);
		if (t === null) return;
		let n = t.closest(`.${ei}`);
		n !== null && (e.preventDefault(), this.choose(n, t));
	}
	handleOpenListKey(e, t) {
		if (e.key === "ArrowUp" && e.altKey && A(e, { alt: !0 })) {
			e.preventDefault();
			let n = jb(t);
			return n !== null && !Cb(t) ? this.choose(t, n) : this.close(), !0;
		}
		return !lb.has(e.key) || !A(e) || (e.key === "Home" || e.key === "End") && yc(e.target) ? !1 : (e.preventDefault(), this.moveCurrent(t, e.key), !0);
	}
	handleEntryKey(e) {
		let t = kb(e);
		if (t === null) return !1;
		let { entry: n, select: r } = t;
		if (Sb(r)) return !1;
		switch (e.key) {
			case "ArrowLeft": return n.selectionStart === 0 && n.selectionEnd === 0 && this.focusChip(e, r, -1);
			case "ArrowDown":
			case "ArrowUp": return e.preventDefault(), this.openSelect === r ? this.moveCurrent(r, e.key) : this.openSuggestions(r, n, e.key === "ArrowDown"), !0;
			case "Enter": {
				let t = this.openSelect === r ? Lb(r).find((e) => e.hasAttribute(sb)) : void 0;
				return t === void 0 ? (e.preventDefault(), n.value.trim().length === 0 ? (this.pressEntryBox(r, n, !1), !0) : (this.releaseRefusal(r), this.enterTyped(r, n, $c(n.value), ""), !0)) : (e.preventDefault(), this.choose(r, t), !0);
			}
			case ",": return e.preventDefault(), this.releaseRefusal(r), this.enterTyped(r, n, $c(n.value), ""), !0;
			case "Backspace": {
				if (n.value.length > 0) return !1;
				let t = r.querySelectorAll(`.${db} > .${fb}`);
				return t.length !== 0 && (e.preventDefault(), this.removeChosen(r, t[t.length - 1].getAttribute(hb)), !0);
			}
			default: return !1;
		}
	}
	focusChip(e, t, n, r = null) {
		let i = Bb(t);
		if (i.length === 0) return !1;
		let a = i[(r === null ? i.length : i.findIndex((e) => e.contains(r))) + n]?.querySelector(`.${mb}`) ?? (n === 1 ? Ob(t) : null);
		return e.preventDefault(), a === null || (a.focus(), a instanceof HTMLInputElement && a.setSelectionRange(0, 0), !0);
	}
	openSuggestions(e, t, n) {
		zy(t);
		let r = Lb(e), i = (n ? r[0] : r[r.length - 1]) ?? null;
		i !== null && this.toggle(e, !0, i);
	}
	handleChipKey(e) {
		let t = e.target instanceof HTMLElement && e.target.classList.contains(mb) ? e.target : null, n = t?.closest(".ui-select") ?? null;
		if (t === null || n === null || !Cb(n)) return !1;
		switch (e.key) {
			case "ArrowLeft": return this.focusChip(e, n, -1, t);
			case "ArrowRight": return this.focusChip(e, n, 1, t);
			case "Backspace":
			case "Delete": {
				if (e.preventDefault(), Sb(n)) return !0;
				let r = Bb(n), i = r.findIndex((e) => e.contains(t)), a = (r[i + 1] ?? r[i - 1])?.getAttribute(hb) ?? null;
				this.removeChosen(n, r[i]?.getAttribute(hb) ?? null);
				let o = a === null ? null : Bb(n).find((e) => e.getAttribute(hb) === a) ?? null;
				return o !== null && o.querySelector(`.${mb}`)?.focus(), !0;
			}
			default: return !1;
		}
	}
	handleClosedArrow(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || t === this.openSelect || Sb(t)) return !1;
		e.preventDefault();
		let n = Tb(t);
		n !== null && zy(n);
		let r = Lb(t), i = r.find((e) => e.getAttribute("aria-selected") === "true") ?? (e.key === "ArrowDown" ? r[0] : r[r.length - 1]) ?? null;
		return this.toggle(t, !1, i), !0;
	}
	handleTypeAhead(e) {
		let t = Ky(e), n = e.target instanceof HTMLElement ? e.target : null;
		if (t === null || n === null || !(n.classList.contains("ui-select__trigger") || n.classList.contains(nb))) return !1;
		let r = n.closest(`.${ei}`), i = r !== null && r === this.openSelect;
		if (r === null || Sb(r) || !i && !n.classList.contains("ui-select__trigger")) return !1;
		let a = Tb(r);
		if (a !== null) return !i && (e.preventDefault(), this.typeIntoSearch(r, a, t), !0);
		e.preventDefault();
		let o = Lb(r), s = i ? o.find((e) => e === document.activeElement) ?? o.find((e) => e.hasAttribute(sb)) ?? null : o.find((e) => e.getAttribute("aria-selected") === "true") ?? null, c = this.typeAhead.next({
			owner: r,
			character: t,
			entries: o,
			current: s,
			words: (e) => Nb(e) ?? "",
			context: r
		});
		return c === null ? !0 : i ? (j(Ab(r).filter((e) => !D(e)), c), zb(r, c), I(c), this.markActive(r, c), !0) : (this.toggle(r, !1, c), !0);
	}
	typeIntoSearch(e, t, n) {
		this.toggle(e, !0), this.openSelect === e && (t.value = n, t.setSelectionRange(n.length, n.length), t.dispatchEvent(new Event("input", { bubbles: !0 })));
	}
	handleMultipleTriggerKey(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || !Cb(t) || Sb(t)) return !1;
		switch (e.key) {
			case "Enter":
			case " ": return e.preventDefault(), this.toggle(t), !0;
			case "ArrowLeft": return this.focusChip(e, t, -1);
			case "Backspace": {
				let n = t.querySelectorAll(`.${db} > .${fb}`);
				return n.length !== 0 && (e.preventDefault(), this.removeChosen(t, n[n.length - 1].getAttribute(hb)), !0);
			}
			default: return !1;
		}
	}
	markedOption(e) {
		let t = this.openSelect;
		return e.key !== "Enter" || t === null || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(ob) || !t.contains(e.target) ? null : Lb(t).find((e) => e.hasAttribute(sb)) ?? null;
	}
	toggle(e, t = !1, n = null) {
		if (e === null) return;
		if (this.openSelect === e) {
			this.close();
			return;
		}
		this.close();
		let r = Db(e), i = Eb(e);
		r !== null && !t && zy(r), Hy(e);
		let a = e.querySelector(`.${Xr}`), o = e.querySelector(`.${eb}`), s = e.querySelector(`.${tb}`) ?? o, c = e.getAttribute(Jy);
		if (a === null || o === null || s === null) return;
		let l = pi(s, "ui-select-list");
		if (i === null && a.setAttribute("aria-controls", l), r?.setAttribute("aria-controls", l), this.popups.open({
			owner: e,
			popup: o,
			anchor: a,
			placement: {
				placement: c !== null && Pf(c) ? c : "bottom-start",
				minAnchorWidth: !0
			},
			openers: i === null ? r === null ? [a] : [a, r] : [i],
			returnFocus: () => i ?? a
		})) {
			if (r === null) {
				this.initializeFocus(e, n);
				return;
			}
			i === null ? this.initializeSearch(e, r, n, t) : this.initializeEntry(e, n), qb(o);
		}
	}
	close() {
		this.popups.close();
	}
	initializeFocus(e, t) {
		let n = Lb(e);
		if (n.length === 0) return;
		let r = t ?? n.find((e) => e.getAttribute("aria-selected") === "true");
		if (r === void 0 && Yu()) {
			j(n, null), this.markActive(e, null), Ib(e);
			return;
		}
		let i = r ?? n[0];
		j(n, i), this.markActive(e, i, Yu()), zb(e, i), I(i);
	}
	initializeSearch(e, t, n, r) {
		let i = Ab(e), a = Lb(e), o = (r ? void 0 : n ?? a.find((e) => e.getAttribute("aria-selected") === "true")) ?? (r || Yu() ? null : a[0] ?? null);
		j(i, null), this.markActive(e, o, Yu()), o !== null && zb(e, o), !Xu() && (I(t), t.select());
	}
	initializeEntry(e, t) {
		j(Ab(e), null), this.markActive(e, t), t !== null && zb(e, t);
	}
	moveCurrent(e, t) {
		let n = Ab(e).filter((e) => !D(e)), r = yu(t, n, jb(e), "vertical");
		r !== null && (Db(e) === null ? Lc(n, r) : zb(e, r), this.markActive(e, r));
	}
	markActive(e, t, n = !1) {
		for (let r of Ab(e)) r === t ? r.setAttribute(sb, "") : r.hasAttribute(sb) && r.removeAttribute(sb), Zu(r, r === t && n);
		Mb(e);
		let r = Db(e);
		r !== null && (t === null ? r.removeAttribute("aria-activedescendant") : r.setAttribute("aria-activedescendant", pi(t, "ui-select-option")));
	}
	choose(e, t) {
		let n = t.dataset.uiKey;
		if (n === void 0 || D(t) || Sb(e)) return;
		if (Cb(e)) {
			let r = Yc(Kc(e.getAttribute(Mr)), n, qc(e.getAttribute(_b)));
			this.markActive(e, t, Yu()), r !== null && this.writeChosen(e, r);
			let i = Eb(e);
			i !== null && i.value.length > 0 && (i.value = "", this.releaseRefusal(e), this.suggest(e, i));
			return;
		}
		if (e.getAttribute(qy) === n) {
			this.close();
			return;
		}
		e.setAttribute(qy, n), this.sync(e);
		let r = e.querySelector(`.${rb}`);
		r !== null && (r.value = n, r.dispatchEvent(new Event("change", { bubbles: !0 }))), this.close();
	}
	removeChosen(e, t) {
		let n = t === null ? null : Xc(Kc(e.getAttribute(Mr)), t);
		if (n === null) return;
		let r = document.activeElement instanceof HTMLElement && document.activeElement.closest(`.${fb}`) !== null;
		this.writeChosen(e, n), (r || document.activeElement === document.body) && Ob(e)?.focus();
	}
	writeChosen(e, t) {
		t.length === 0 ? e.removeAttribute(Mr) : e.setAttribute(Mr, JSON.stringify(t)), this.sync(e), this.popups.reposition(e), e.querySelector(`.${rb}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	clearValue(e) {
		if (Cb(e)) {
			e.hasAttribute("data-ui-selected-keys") && this.writeChosen(e, []);
			return;
		}
		if (!e.hasAttribute(qy)) return;
		e.removeAttribute(qy), this.sync(e);
		let t = e.querySelector(`.${rb}`);
		t !== null && (t.value = "", t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
};
function Ib(e) {
	let t = e.querySelector(`.${Xr}`), n = Ob(e);
	t !== null && n !== null && !t.contains(document.activeElement) && I(n);
}
function Lb(e) {
	return Ab(e).filter((e) => Rb(e) && !D(e) && !E(e));
}
function Rb(e) {
	return e.style.display !== "none" && !e.classList.contains("ui-hidden");
}
function zb(e, t) {
	let n = e.querySelector(`.${tb}`);
	if (n === null) return;
	let r = n.getBoundingClientRect(), i = t.getBoundingClientRect(), a = getComputedStyle(n), o = r.top + (Number.parseFloat(a.borderTopWidth) || 0), s = o + (Number.parseFloat(a.paddingTop) || 0), c = o + n.clientHeight - (Number.parseFloat(a.paddingBottom) || 0);
	i.top < s ? n.scrollTop -= s - i.top : i.bottom > c && (n.scrollTop += i.bottom - c);
}
function Bb(e) {
	return [...e.querySelectorAll(`.${db} > .${fb}`)];
}
function Vb(e) {
	let t = e.closest(".ui-select__trigger")?.closest(".ui-select") ?? null;
	return t !== null && Eb(t) !== null && !e.classList.contains(yb);
}
function Hb(e, t) {
	let n = t.trim().toLocaleLowerCase();
	for (let t of Ab(e)) {
		let e = t.dataset.uiKey;
		if (e !== void 0 && !D(t) && (e.toLocaleLowerCase() === n || Nb(t)?.trim().toLocaleLowerCase() === n)) return e;
	}
	return null;
}
function Ub(e, t) {
	let n = Nb(e)?.trim() ?? "";
	return n.length > 0 ? n : t;
}
function Wb(e, t) {
	let n = e.querySelector(`.${db}`);
	if (n === null) return;
	n.hasAttribute(gb) !== t.length > 0 && n.toggleAttribute(gb, t.length > 0);
	let r = [...n.querySelectorAll(`:scope > .${fb}`)];
	if (!(r.length === t.length && r.every((e, n) => e.getAttribute(hb) === t[n].key && e.querySelector(`.${pb}`)?.textContent === t[n].label))) {
		for (let e of r) e.remove();
		n.prepend(...t.map((e) => Gb(e.key, e.label)));
	}
}
function Gb(e, t) {
	let n = document.createElement("span"), r = document.createElement("span"), i = document.createElement("button");
	return n.className = fb, n.setAttribute(hb, e), r.className = pb, r.textContent = t, i.className = mb, i.type = "button", i.tabIndex = -1, T.write(i, "aria-label", "ui.select.remove", { label: t }), n.append(r, i), n;
}
function Kb(e, t) {
	if (e.type === "childList") {
		for (let n of e.addedNodes) if (n instanceof HTMLElement) {
			n.classList.contains("ui-select") && t.add(n);
			for (let e of n.querySelectorAll(`.${ei}`)) t.add(e);
		}
	}
	if (e.type === "attributes" && (e.attributeName === qy || e.attributeName === "data-ui-selected-keys" || e.attributeName === _b)) {
		e.target instanceof HTMLElement && e.target.classList.contains("ui-select") && t.add(e.target);
		return;
	}
	let n = (e.target instanceof HTMLElement ? e.target : e.target.parentElement)?.closest(`.${eb}`)?.closest(`.${ei}`);
	n != null && t.add(n);
}
function qb(e) {
	e.dataset.uiPlacement?.startsWith("top") === !0 && (e.style.minHeight = `${e.offsetHeight}px`);
}
//#endregion
//#region src/interactions/commit-gate.ts
var Jb = class {
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
		!yc(t) || !this.root.contains(t) || (this.field = t, this.committed = t.value);
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
}, Yb = "textarea.ui-text-area__field", Xb = "data-ui-text-area-grow";
function Zb() {
	return typeof CSS < "u" && CSS.supports("field-sizing", "content");
}
var Qb = class {
	root;
	widths = /* @__PURE__ */ new WeakMap();
	observer;
	constructor(e = {}) {
		this.root = e.root ?? document, this.observer = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null, this.root.addEventListener("input", (e) => {
			e.target instanceof HTMLTextAreaElement && e.target.matches(Yb) && this.fit(e.target);
		}, !0), this.fitAll(this.root.querySelectorAll(Yb)), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.fitAll(Yi(e.components, Yb));
		}), R(this.root, Yb, {
			childList: !0,
			attributeFilter: [Xb]
		}, (e) => {
			this.fitAll(Yi(e, Yb));
		});
	}
	fitAll(e) {
		for (let t of e) this.fit(t);
	}
	fit(e) {
		if (!e.hasAttribute(Xb)) {
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
function $b(e) {
	let t = ex(e.getAttribute("min"), 0), n = ex(e.getAttribute("max"), 100), r = e.getAttribute("step");
	return {
		min: t,
		max: Math.max(t, n),
		step: r === "any" ? 0 : Math.max(0, ex(r, 1))
	};
}
function ex(e, t) {
	let n = e === null || e.trim().length === 0 ? NaN : Number(e);
	return Number.isFinite(n) ? n : t;
}
function tx(e, t, n, r) {
	let i = (n ? e.height : e.width) - r;
	if (i <= 0) return 0;
	let a = n ? e.top + e.height - t.y : t.x - e.left;
	return Math.min(1, Math.max(0, (a - r / 2) / i));
}
function nx(e, t) {
	return rx(t.min + e * (t.max - t.min), t);
}
function rx(e, t) {
	let n = Math.min(t.max, Math.max(t.min, e));
	if (t.step <= 0) return n;
	let r = Math.round((n - t.min) / t.step);
	return t.min + r * t.step > t.max && r--, ix(t.min + r * t.step, t);
}
function ix(e, t) {
	return Number(e.toFixed(Math.min(20, Math.max(ax(t.step), ax(t.min)))));
}
function ax(e) {
	let t = String(e), n = t.indexOf("e-");
	if (n >= 0) return Number(t.slice(n + 2));
	let r = t.indexOf(".");
	return r < 0 ? 0 : t.length - r - 1;
}
function ox(e, t, n) {
	return t === n ? e < t ? "start" : e > t ? "end" : null : Math.abs(e - t) < Math.abs(e - n) ? "start" : "end";
}
function sx(e, t, n, r, i) {
	let a = Math.max(0, r);
	if (t === "start" ? e <= n - a : e >= n + a) return e;
	let o = t === "start" ? n - a : n + a;
	if (i.step <= 0) return cx(o, i);
	let s = (o - i.min) / i.step;
	return cx(ix(i.min + (t === "start" ? Math.floor(s + 1e-9) : Math.ceil(s - 1e-9)) * i.step, i), i);
}
function cx(e, t) {
	return Math.min(t.max, Math.max(t.min, e));
}
//#endregion
//#region src/interactions/range-value-engine.ts
var lx = "ui-slider__input", ux = "ui-slider__input--end", dx = "ui-slider__input--held", fx = "ui-slider__value", px = "ui-slider__bubble", mx = "ui-slider__track", hx = "ui-slider__thumb-anchor", gx = "ui-slider", _x = "ui-slider--range", vx = "ui-orientation--vertical", yx = "--ui-slider-fraction", bx = "--ui-slider-end-fraction", xx = 6, Sx = "Value", Cx = "EndValue", wx = /* @__PURE__ */ new Set([
	"Value",
	"EndValue",
	"Min",
	"Max"
]), Tx = class {
	options;
	root;
	settled = /* @__PURE__ */ new WeakMap();
	pressedFrom = /* @__PURE__ */ new WeakMap();
	cancelled = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("pointerdown", (e) => {
			this.notePress(e.target), this.placeBubble(e.target);
		}, !0), this.root.addEventListener("pointercancel", (e) => this.takeBackPress(e.target), !0), (this.root === document ? window : this.root).addEventListener("change", (e) => this.refuseCancelledChange(e), !0), this.root.addEventListener("focusin", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusout", (e) => this.releaseBubble(e.target), !0), new um({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${_x} .${mx}`),
			begin: (e, t) => this.beginBandDrag(e, t),
			move: (e, t, n) => this.moveBandDrag(e, n),
			end: (e, t) => this.endBandDrag(t),
			cancel: (e, t) => this.putBandBack(t),
			takenBack: (e, t) => this.putBandBack(t)
		}), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			if (wx.has(e.propertyName)) for (let t of Yi(e.components, `.${lx}`)) this.settled.set(t, t.value), this.writeReadings(t), e.propertyName === (Dx(t) ? Cx : Sx) && this.reportClamped(t, e.value);
		});
	}
	notePress(e) {
		let t = Ex(e);
		t !== null && (this.cancelled.delete(t), this.pressedFrom.set(t, t.value));
	}
	takeBackPress(e) {
		let t = Ex(e), n = t === null ? void 0 : this.pressedFrom.get(t);
		t !== null && n !== void 0 && (this.pressedFrom.delete(t), t.value !== n && (t.value = n, this.cancelled.add(t), this.settled.set(t, n), this.writeReadings(t)));
	}
	refuseCancelledChange(e) {
		let t = Ex(e.target);
		t === null || !this.cancelled.has(t) || (this.cancelled.delete(t), e.stopImmediatePropagation());
	}
	reportClamped(e, t) {
		t == null || e.value === String(t) || Ax(e) || e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(lx)) return;
		let t = e.target;
		if (this.cancelled.delete(t), Ax(t)) {
			t.value = this.settled.get(t) ?? t.defaultValue;
			return;
		}
		let n = Ox(t);
		if (n !== null) {
			let e = kx(t, Number(t.value), n);
			e !== t.value && (t.value = e, e === (this.settled.get(t) ?? t.defaultValue) && this.cancelled.add(t));
		}
		this.settled.set(t, t.value), this.writeReadings(t);
	}
	beginBandDrag(e, t) {
		let n = e.querySelector(`.${lx}:not(.${ux})`), r = e.querySelector(`.${ux}`);
		if (n === null || r === null) return null;
		let i = nx(tx(e.getBoundingClientRect(), t, jx(e), Mx(e)), $b(n)), a = ox(i, Number(n.value), Number(r.value));
		if (Ax(n)) return I(a === "end" ? r : n), null;
		let o = {
			start: n,
			end: r,
			from: [n.value, r.value],
			pressed: i,
			held: null
		};
		return a === null ? I(n) : this.holdHandle(o, a, i), o;
	}
	moveBandDrag(e, t) {
		let n = e.start.closest(`.${mx}`);
		if (n === null) return;
		let r = nx(tx(n.getBoundingClientRect(), t, jx(n), Mx(n)), $b(e.start));
		if (e.held === null) {
			if (r === e.pressed) return;
			this.holdHandle(e, r < e.pressed ? "start" : "end", r);
			return;
		}
		this.moveHandle(e.held, r);
	}
	holdHandle(e, t, n) {
		let r = t === "start" ? e.start : e.end;
		e.held = r, r.classList.add(dx), I(r), this.moveHandle(r, n), this.placeBubble(r);
	}
	moveHandle(e, t) {
		let n = Ox(e), r = n === null ? String(t) : kx(e, t, n);
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
		e.held?.classList.remove(dx), e.held !== null && this.writeReadings(e.held);
	}
	placeBubble(e) {
		let t = Nx(e);
		t !== null && Gf(t.anchor, t.bubble, {
			placement: t.vertical ? "left" : "top",
			gap: xx
		});
	}
	releaseBubble(e) {
		rp(Nx(e)?.bubble);
	}
	writeReadings(e) {
		let t = Dx(e), n = e.closest(`.${mx}`)?.parentElement ?? e.parentElement, r = t ? `.${fx}--end, .${px}--end` : `.${fx}:not(.${fx}--end), .${px}:not(.${px}--end)`;
		for (let t of n?.querySelectorAll(r) ?? []) t.textContent = e.value;
		e.closest(`.${mx}`)?.style.setProperty(t ? bx : yx, String(Px(e))), e.matches(`:active, :focus-visible, .${dx}`) ? this.placeBubble(e) : this.releaseBubble(e);
	}
};
function Ex(e) {
	return e instanceof HTMLInputElement && e.classList.contains(lx) ? e : null;
}
function Dx(e) {
	return e.classList.contains(ux);
}
function Ox(e) {
	return e.closest(`.${_x} .${mx}`)?.querySelector(Dx(e) ? `.${lx}:not(.${ux})` : `.${ux}`) ?? null;
}
function kx(e, t, n) {
	let r = Number(e.closest(`.${gx}`)?.getAttribute("data-ui-slider-min-distance") ?? 0);
	return String(sx(t, Dx(e) ? "end" : "start", Number(n.value), Number.isFinite(r) ? r : 0, $b(e)));
}
function Ax(e) {
	return O(e) || E(e);
}
function jx(e) {
	return e.closest(`.${gx}`)?.classList.contains(vx) === !0;
}
function Mx(e) {
	let t = e.querySelector(`.${hx}`)?.getBoundingClientRect();
	return t === void 0 ? 0 : jx(e) ? t.height : t.width;
}
function Nx(e) {
	if (!(e instanceof Element) || !e.classList.contains(lx)) return null;
	let t = e.closest(`.${mx}`), n = Dx(e), r = t?.querySelector(n ? `.${px}--end` : `.${px}:not(.${px}--end)`) ?? null, i = t?.querySelector(n ? `.${hx}--end` : `.${hx}:not(.${hx}--end)`) ?? null;
	return r === null || i === null ? null : {
		bubble: r,
		anchor: i,
		vertical: jx(e)
	};
}
function Px(e) {
	let { min: t, max: n } = $b(e), r = Number(e.value);
	return !Number.isFinite(r) || n <= t ? 0 : Math.min(1, Math.max(0, (r - t) / (n - t)));
}
//#endregion
//#region src/rendering/number-format.ts
var Fx = {
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
}, Ix = [
	"(n)",
	"-n",
	"- n",
	"n-",
	"n -"
], Lx = [
	"$n",
	"n$",
	"$ n",
	"n $"
], Rx = [
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
], zx = [
	"n %",
	"n%",
	"%n",
	"% n"
], Bx = [
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
], Vx = /[1-9]/;
function Hx(e) {
	let t = e.closest("[data-ui-number-culture]")?.getAttribute("data-ui-number-culture") ?? null;
	if (t === null) return Fx;
	try {
		return {
			...Fx,
			...JSON.parse(t)
		};
	} catch {
		return Fx;
	}
}
function Ux(e, t, n) {
	if (!Number.isFinite(e)) return String(e);
	let r = Gx(t);
	if (r === null) return Kx(e, n);
	let i = Math.abs(e);
	switch (r.kind) {
		case "N": {
			let t = qx(i, 0, r.precision ?? n.decimalDigits, n.groupSizes, n.groupSeparator, n.decimalSeparator);
			return Wx(e, t) ? Qx(Ix[n.negativePattern] ?? "-n", t, "", n.negativeSign) : t;
		}
		case "F": {
			let t = qx(i, 0, r.precision ?? n.decimalDigits, [], "", n.decimalSeparator);
			return Wx(e, t) ? n.negativeSign + t : t;
		}
		case "D": {
			let t = Jx(i, 0, 0).integer.padStart(r.precision ?? 1, "0");
			return Wx(e, t) ? n.negativeSign + t : t;
		}
		case "C": {
			let t = qx(i, 0, r.precision ?? n.currencyDecimalDigits, n.currencyGroupSizes, n.currencyGroupSeparator, n.currencyDecimalSeparator);
			return Qx(Wx(e, t) ? Rx[n.currencyNegativePattern] ?? "-$n" : Lx[n.currencyPositivePattern] ?? "$n", t, n.currencySymbol, n.negativeSign);
		}
		case "P": {
			let t = qx(i, 2, r.precision ?? n.percentDecimalDigits, n.percentGroupSizes, n.percentGroupSeparator, n.percentDecimalSeparator);
			return Qx(Wx(e, t) ? Bx[n.percentNegativePattern] ?? "-n %" : zx[n.percentPositivePattern] ?? "n %", t, n.percentSymbol, n.negativeSign);
		}
		default: return Kx(e, n);
	}
}
function Wx(e, t) {
	return e < 0 && Vx.test(t);
}
function Gx(e) {
	if (e == null || e.trim().length === 0) return null;
	let t = /^([NFCPDnfcpd])(\d{0,2})$/.exec(e.trim());
	if (t === null) throw Error(`Number format '${e}' is outside the shared subset (N, F, C, P, D, with an optional precision).`);
	return {
		kind: t[1].toUpperCase(),
		precision: t[2].length === 0 ? null : Number(t[2])
	};
}
function Kx(e, t) {
	let { integer: n, fraction: r } = Yx(Math.abs(e), 0), i = r.length === 0 ? n : `${n}${t.decimalSeparator}${r}`;
	return e < 0 ? t.negativeSign + i : i;
}
function qx(e, t, n, r, i, a) {
	let { integer: o, fraction: s } = Jx(e, t, n);
	return n === 0 ? Zx(o, r, i) : `${Zx(o, r, i)}${a}${s}`;
}
function Jx(e, t, n) {
	let { integer: r, fraction: i } = Yx(e, t), a = r + i.slice(0, n).padEnd(n, "0"), o = i.length > n && i[n] >= "5" ? Xx(a) : a, s = o.length - n;
	return {
		integer: o.slice(0, s),
		fraction: o.slice(s)
	};
}
function Yx(e, t) {
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
function Xx(e) {
	let t = e.length - 1;
	for (; t >= 0 && e[t] === "9";) t--;
	let n = "0".repeat(e.length - 1 - t);
	return t < 0 ? `1${n}` : `${e.slice(0, t)}${String(Number(e[t]) + 1)}${n}`;
}
function Zx(e, t, n) {
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
function Qx(e, t, n, r) {
	let i = "";
	for (let a of e) i += a === "n" ? t : a === "$" || a === "%" ? n : a === "-" ? r : a;
	return i;
}
var $x = /^[\t\n\v\f\r ]*[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?[\t\n\v\f\r ]*$/;
function eS(e) {
	if (!$x.test(e)) return null;
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}
var tS = {
	readCulture: Hx,
	format: Ux,
	parseInvariant: eS
}, nS = /^-?(\d+(\.\d*)?|\.\d+)$/;
function rS(e, t, n) {
	if (!nS.test(e)) return e;
	let r = n.thousands ? t : lS(t), i = Number(e);
	if (n.format !== null && n.format.trim().length > 0) try {
		return Ux(i, n.format, r);
	} catch {}
	let a = e.includes(".") ? e.length - e.indexOf(".") - 1 : 0;
	return Ux(i, `${n.thousands ? "N" : "F"}${Math.min(a, 99)}`, r);
}
function iS(e, t, n) {
	return nS.test(e) ? (cS(n) ? uS(e, 2) : e).replace(".", t.decimalSeparator) : e;
}
function aS(e, t, n) {
	let r = e.trim();
	if (r.length === 0) return "";
	let i = !1;
	r.startsWith("(") && r.endsWith(")") && (i = !0, r = r.slice(1, -1));
	let a = cS(n) || t.percentSymbol.length > 0 && r.includes(t.percentSymbol);
	for (let e of [t.currencySymbol, t.percentSymbol]) r = e.length === 0 ? r : r.split(e).join("");
	for (let e of /* @__PURE__ */ new Set([
		t.negativeSign,
		"-",
		"−"
	])) e.length > 0 && r.includes(e) && (i = !0, r = r.split(e).join(""));
	let o = t.decimalSeparator, [s, ...c] = o.length === 0 ? [r] : r.split(o);
	if (c.length > 1) return null;
	let l = s.replace(/[\s  ]/g, "").split(t.groupSeparator).join("").split(t.currencyGroupSeparator).join(""), u = c.length === 0 ? null : c[0].replace(/[\s  ]/g, ""), d = u === null ? l : `${l}.${u}`;
	if (!nS.test(d)) return null;
	let f = a ? uS(d, -2) : d;
	return i && Number(f) !== 0 ? `-${f}` : f;
}
function oS(e, t, n, r, i) {
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
function sS(e) {
	return e.includes(".") ? e.replace(/0+$/, "").replace(/\.$/, "") : e;
}
function cS(e) {
	return /^\s*[pP]\d{0,2}\s*$/.test(e ?? "");
}
function lS(e) {
	return {
		...e,
		groupSeparator: "",
		currencyGroupSeparator: "",
		percentGroupSeparator: ""
	};
}
function uS(e, t) {
	let n = e.startsWith("-"), r = n ? e.slice(1) : e, i = r.indexOf("."), a = r.replace(".", ""), o = (i < 0 ? r.length : i) + t, s = a;
	o <= 0 && (s = "0".repeat(1 - o) + s, o = 1), o > s.length && (s += "0".repeat(o - s.length));
	let c = s.slice(0, o).replace(/^0+(?=\d)/, ""), l = s.slice(o).replace(/0+$/, ""), u = l.length === 0 ? c : `${c}.${l}`;
	return n ? `-${u}` : u;
}
//#endregion
//#region src/interactions/number-input-engine.ts
var dS = "ui-number-input", fS = "ui-number-input__field", pS = "data-ui-number-no-decimals", mS = "data-ui-number-no-negative", hS = "data-ui-number-no-thousands", gS = "data-ui-number-trim-zeros", _S = "data-ui-number-step", vS = "data-ui-number-min", yS = "data-ui-number-max", bS = "data-ui-number-step-direction", xS = /* @__PURE__ */ new Map([
	["ArrowUp", 1],
	["ArrowDown", -1],
	["PageUp", 10],
	["PageDown", -10]
]), SS = class {
	options;
	root;
	values = /* @__PURE__ */ new WeakMap();
	shown = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("focus", (e) => this.handleFocus(e), !0), this.root.addEventListener("blur", (e) => this.handleBlur(e), !0), this.root.addEventListener("click", (e) => this.handleStepClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleStepKey(e), !0), window.addEventListener("change", (e) => this.handleChangeCapture(e), !0), window.addEventListener("change", (e) => this.handleChangeDone(e)), this.showAtRest(this.root.querySelectorAll(`.${fS}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.showAtRest(Yi(e.components, `.${fS}`));
		}), T.onChange(() => this.showAtRest(this.root.querySelectorAll(`.${fS}`)));
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
		let t = CS(e);
		if (t !== null) return this.keptValue(t) ?? DS(t) ?? t.value.trim();
	}
	show(e) {
		let t = this.values.get(e) ?? e.value, n = e.hasAttribute(gS) ? sS(t) : t, r = Hx(e), i = e === document.activeElement ? iS(n, r, OS(e)) : ES(e, n, r);
		e.value = i, this.shown.set(e, i);
	}
	handleInput(e) {
		let t = CS(e.target);
		if (t === null) return;
		let n = !t.hasAttribute(pS), r = !t.hasAttribute(mS), i = t.selectionStart ?? t.value.length, a = oS(t.value, i, Hx(t), n, r);
		a.value !== t.value && (t.value = a.value, t.setSelectionRange(a.cursor, a.cursor));
	}
	handleFocus(e) {
		let t = CS(e.target);
		t !== null && (this.values.set(t, this.valueOf(t)), this.show(t));
	}
	handleBlur(e) {
		let t = CS(e.target);
		if (t === null) return;
		let n = this.showsOwnText(t) ? null : DS(t);
		if (n !== null && this.values.set(t, n), t.hasAttribute(gS) && !O(t) && !E(t)) {
			let e = this.values.get(t) ?? "", n = sS(e);
			n !== e && this.commit(t, n);
		}
		this.show(t);
	}
	handleChangeCapture(e) {
		let t = CS(e.target);
		if (t === null) return;
		let n = DS(t);
		n !== null && (this.values.set(t, n), t.value = n, this.shown.set(t, n));
	}
	handleChangeDone(e) {
		let t = CS(e.target);
		t !== null && t === document.activeElement && this.show(t);
	}
	commit(e, t) {
		this.values.set(e, t), e.value = iS(t, Hx(e), OS(e)), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleStepClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[" + bS + "]");
		if (t === null) return;
		let n = t.closest(".ui-number-input__row")?.querySelector(`.${fS}`) ?? null;
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t.getAttribute(bS) === "down" ? -1 : 1));
	}
	handleStepKey(e) {
		let t = xS.get(e.key);
		if (t === void 0 || !A(e, { shift: !0 }) || e.defaultPrevented) return;
		let n = CS(e.target);
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t));
	}
	step(e, t) {
		let n = Number(e.getAttribute(_S) ?? "1"), r = (Number(this.showsOwnText(e) ? this.valueOf(e) : DS(e) ?? "0") || 0) + n * t, i = e.getAttribute(vS), a = e.getAttribute(yS);
		i !== null && (r = Math.max(r, Number(i))), a !== null && (r = Math.min(r, Number(a))), this.commit(e, kS(r)), this.show(e);
	}
};
function CS(e) {
	return e instanceof HTMLInputElement && e.classList.contains(fS) ? e : null;
}
function wS(e, t) {
	let n = e.classList.contains(dS) ? e.querySelector(`.${fS}`) : null, r = n === null ? null : t(n);
	if (n === null || typeof r != "string" || r.trim().length === 0 || !Number.isFinite(Number(r))) return null;
	let i = TS(n, vS), a = TS(n, yS);
	return i !== null && Number(r) < Number(i) ? {
		key: "ui.value.min",
		args: { min: ES(n, i, Hx(n)) }
	} : a !== null && Number(r) > Number(a) ? {
		key: "ui.value.max",
		args: { max: ES(n, a, Hx(n)) }
	} : null;
}
function TS(e, t) {
	let n = e.getAttribute(t)?.trim() ?? "";
	return n.length > 0 && Number.isFinite(Number(n)) ? n : null;
}
function ES(e, t, n) {
	return rS(t, n, {
		format: OS(e),
		thousands: !e.hasAttribute(hS)
	});
}
function DS(e) {
	return aS(e.value, Hx(e), OS(e));
}
function OS(e) {
	return e.closest(`.${dS}`)?.getAttribute("data-ui-number-format") ?? null;
}
function kS(e) {
	return Number(e.toFixed(10)).toString();
}
//#endregion
//#region src/events/ahead-of-answer.ts
function AS(e, t) {
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
function jS(e) {
	switch (e.getAttribute(St)) {
		case "windowed": return "windowed";
		case "virtualized": return "virtualized";
		default: return "plain";
	}
}
function MS(e) {
	let t = jS(e) === "windowed" ? NS(e, "data-ui-window-offset") ?? 0 : 0;
	return Number.isInteger(t) && t > 0 ? t : 0;
}
function NS(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.length === 0) return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
function PS(e, t) {
	return e.getAttribute(t)?.toLowerCase() === "true";
}
//#endregion
//#region src/interactions/item-drags.ts
var FS = "application/x-ne-items", IS = null, LS = null;
function RS(e, t, n) {
	let r = e.getAttribute(he), i = new Set((e.getAttribute("data-ui-drag-effects") ?? "").split(" ").filter((e) => e === "move" || e === "copy"));
	return r === null || r.length === 0 || i.size === 0 || n.length === 0 ? null : {
		kind: r,
		root: e,
		host: t,
		rows: n,
		keys: n.map(F),
		effects: i,
		source: e.getAttribute(ge)
	};
}
function zS(e, t) {
	let n = vl(t);
	return n.includes(e) ? n.filter((t) => t === e || VS(t)) : [e];
}
function BS(e) {
	return !qo(e, "data-ui-undraggable") && !D(e);
}
function VS(e) {
	return BS(e) && P(e) !== null;
}
function HS(e, t) {
	let n = e?.effects.has("copy") === !0, r = t || e?.effects.has("move") === !0;
	return n && r ? "copyMove" : n ? "copy" : "move";
}
function US(e, t, n = null) {
	IS = t, LS = t === null ? null : n, t !== null && e instanceof DragEvent && e.dataTransfer !== null && e.dataTransfer.setData(FS, t.kind);
}
function WS(e) {
	return IS !== null && e.dataTransfer?.types.includes(FS) === !0 ? IS : null;
}
function GS() {
	let e = LS;
	IS = null, LS = null, e?.();
}
//#endregion
//#region src/items/items-empty-renderer.ts
var KS = `:scope > [${mt}], :scope > [${ht}], :scope > [${Dt}]`;
function B(e) {
	let t = new Set(e.querySelectorAll(KS));
	return [...e.children].filter((e) => !t.has(e));
}
function qS(e) {
	return e === null ? [] : [e];
}
function JS(e) {
	return e.querySelector(`:scope > [${mt}]`);
}
function YS(e, t, n, r, i) {
	i ??= B(e).some((e) => !e.classList.contains(Ur));
	let a = JS(e);
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
	c.setAttribute(mt, ""), c.appendChild(s), e.appendChild(c);
}
//#endregion
//#region src/items/binding-template-evaluator.ts
var XS = { ok: !1 }, ZS = {
	ok: !0,
	value: null
}, QS = null;
function $S(e) {
	QS = e;
}
function eC(e, t, n) {
	let r = e.length === 0 ? void 0 : e[e.length - 1].item, i = t ?? "";
	if (i.length === 0 || i === ".") return {
		ok: !0,
		value: r,
		scope: r
	};
	let a = (n ?? []).filter((e) => _i(e.kind) !== "Scope"), o = -1;
	for (let e = 0; e < a.length; e++) _i(a[e].kind) === "Dynamic" && (o = e);
	let s = r, c = r, l = !0, u = 0, d = 0, f = !0;
	for (; d < i.length;) {
		let t = i[d];
		if (t === ".") {
			if (f) return XS;
			f = !0, d++;
			continue;
		}
		if (t === "[") {
			if (d + 1 >= i.length || i[d + 1] !== "]" || u >= a.length) return XS;
			let t = a[u];
			if (u++, _i(t.kind) === "Dynamic") {
				let n = iC(e, t.componentId);
				if (!n.ok) return XS;
				s = n.value, c = n.value, l = !0;
			} else {
				if (!l) return XS;
				let e = dC(s, t.value);
				if (!e.ok) return XS;
				s = e.value;
			}
			d += 2, f = !1;
			continue;
		}
		let n = d;
		for (; d < i.length && i[d] !== "." && i[d] !== "[";) d++;
		if (d === n) return XS;
		if (l) {
			let e = sC(s, i.slice(n, d), u > o);
			e.ok ? s = e.value : l = !1;
		}
		f = !1;
	}
	return f || u !== a.length || !l ? XS : {
		ok: !0,
		value: s,
		scope: c
	};
}
function tC(e, t, n) {
	for (let r of t ?? []) {
		if (_i(r.kind) !== "Dynamic") continue;
		let t = C(r.componentId);
		if (t > 0 && !n.some((e) => e.scopeComponentId === t) && e.closest(`[data-ui-id="${t}"][data-ui-key]`) !== null) return !0;
	}
	return !1;
}
function nC(e) {
	let t = oC(e, "IsContent");
	return t.ok && t.value === !0;
}
var rC = /* @__PURE__ */ new Set();
function iC(e, t) {
	let n = C(t);
	if (n > 0) {
		for (let t = e.length - 1; t >= 0; t--) if (e[t].scopeComponentId === n) return {
			ok: !0,
			value: e[t].item
		};
	}
	return rC.has(n) || (rC.add(n), s("an item scope a binding parameter names is not on the stack; the binding resolves to nothing.", {
		targetId: n,
		stack: e
	})), XS;
}
function aC(e, t) {
	let n = e;
	for (let e of t.split(".")) {
		let t = oC(n, e);
		if (!t.ok) return;
		n = t.value;
	}
	return n;
}
function oC(e, t) {
	return sC(e, t, !0);
}
function sC(e, t, n) {
	if (e == null) return XS;
	if (t === ".") return {
		ok: !0,
		value: e
	};
	if (typeof e != "object") return XS;
	let r = e, i = cC(r, t);
	return Object.hasOwn(r, i) ? {
		ok: !0,
		value: r[i]
	} : Array.isArray(e) ? XS : (n && QS?.(r, t), ZS);
}
function cC(e, t) {
	if (Object.hasOwn(e, t)) return t;
	let n = lC(t);
	if (Object.hasOwn(e, n)) return n;
	let r = null;
	for (let n in e) if (!(n.length !== t.length || !Object.hasOwn(e, n)) && (r ??= t.toLowerCase(), n.toLowerCase() === r)) return n;
	return n;
}
function lC(e) {
	let t = e.charAt(0);
	return t === t.toLowerCase() ? e : t.toLowerCase() + e.slice(1);
}
function uC(e) {
	let t = e.itemTemplate;
	if (t == null) return null;
	let n = (e.itemTemplateParameters ?? []).filter((e) => _i(e.kind) !== "Scope"), r = [], i = [], a = !1, o = 0, s = 0, c = 0;
	for (; c < t.length;) {
		let e = t[c];
		if (e === ".") {
			c++;
			continue;
		}
		if (e === "[") {
			if (c + 1 >= t.length || t[c + 1] !== "]" || s >= n.length) return null;
			let e = n[s];
			if (s++, c += 2, _i(e.kind) !== "Dynamic") {
				r.push({
					kind: "element",
					key: e.value
				}), a = !0;
				continue;
			}
			r = [], i = [], a = !1, o = C(e.componentId);
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
function dC(e, t) {
	if (e == null || t == null) return XS;
	if (typeof t == "number") return Array.isArray(e) && t >= 0 && t < e.length ? {
		ok: !0,
		value: e[t]
	} : XS;
	if (typeof t != "string") return XS;
	if (!Array.isArray(e) && typeof e == "object") {
		let n = e;
		if (Object.hasOwn(n, t)) return {
			ok: !0,
			value: n[t]
		};
	}
	if (Array.isArray(e)) {
		for (let n of e) if (pC(n, t)) return {
			ok: !0,
			value: n
		};
	}
	return XS;
}
function fC(e, t, n) {
	if (e == null || t == null) return !1;
	if (Array.isArray(e)) {
		if (typeof t == "number") return t < 0 || t >= e.length ? !1 : (e[t] = n, !0);
		if (typeof t != "string") return !1;
		for (let r = 0; r < e.length; r++) if (pC(e[r], t)) return e[r] = n, !0;
		return !1;
	}
	if (typeof t != "string" || typeof e != "object") return !1;
	let r = e;
	return Object.hasOwn(r, t) ? (r[t] = n, !0) : !1;
}
function pC(e, t) {
	return typeof e == "object" && !!e && e.id === t;
}
//#endregion
//#region src/items/items-filter-sort.ts
function mC(e) {
	let t = e.closest(b)?.querySelector(":scope > [data-ui-items-query]")?.getAttribute("data-ui-items-query") ?? null;
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
function hC(e, t, n, r, i) {
	let a = n.getItemsFilterSortMetadata(t), o = mC(e);
	if (a === void 0 && o === null) {
		for (let t of B(e)) t.classList.remove(Ur);
		return;
	}
	for (let n of B(e)) {
		let e = r.getItemValue(n);
		if (e === void 0) {
			s("item value is unknown, leaving the item visible.", {
				componentId: t,
				item: n
			}), n.classList.remove(Ur);
			continue;
		}
		n.classList.toggle(Ur, !gC(a, e, i, o));
	}
}
function gC(e, t, n, r = null) {
	return (e?.filters ?? []).every((e) => xC(e, t, n)) && (r?.filters ?? []).every((e) => cf(aC(t, e.itemProperty), e.operator, e.value));
}
function _C(e, t, n = null) {
	return (e?.filters ?? []).some((e) => SC(e.source, e.activeOperator, e.activeValue, t)) || (n?.filters?.length ?? 0) > 0;
}
function vC(e, t, n = null) {
	let r = (e?.sorts ?? []).filter((e) => SC(e.source, e.activeOperator, e.activeValue, t)).sort((e, t) => e.priority - t.priority);
	return [...n?.sorts ?? [], ...r];
}
function yC(e, t, n) {
	return t.length === 0 ? [...e] : [...e].sort((e, r) => bC(n.getItemValue(e), n.getItemValue(r), t));
}
function bC(e, t, n) {
	for (let r of n) {
		let n = CC(lf(aC(e, r.itemProperty)), lf(aC(t, r.itemProperty)));
		if (n !== 0) return Si(r.direction) === "Descending" ? -n : n;
	}
	return 0;
}
function xC(e, t, n) {
	if (!SC(e.source, e.activeOperator, e.activeValue, n)) return !0;
	let r = e.source !== null && e.source !== void 0 ? n.get(e.source, []) : e.value;
	return cf(aC(t, e.itemProperty), e.operator, r);
}
function SC(e, t, n, r) {
	return e == null || cf(r.get(e, []), t, n);
}
function CC(e, t) {
	if (e === t) return 0;
	let n = TC(e), r = TC(t);
	if (n !== r) return n - r;
	if (n === wC.Nothing) return 0;
	if (n === wC.Number) {
		let n = Number(e) - Number(t);
		return Number.isNaN(n) ? 0 : Math.sign(n);
	}
	return String(e).localeCompare(String(t));
}
var wC = {
	Nothing: 0,
	Number: 1,
	Text: 2
};
function TC(e) {
	return e == null ? wC.Nothing : typeof e == "number" ? Number.isNaN(e) ? wC.Nothing : wC.Number : typeof e == "string" && e.trim().length === 0 ? wC.Nothing : Number.isNaN(Number(e)) ? wC.Text : wC.Number;
}
//#endregion
//#region src/items/items-source-order.ts
var EC = /* @__PURE__ */ new WeakMap();
function DC(e, t) {
	let n = EC.get(e), r = n === void 0 ? [...t] : OC(n, t);
	return EC.set(e, r), r;
}
function OC(e, t) {
	let n = new Set(t), r = e.filter((e) => n.has(e));
	return r.length === t.length ? r : [...t];
}
function kC(e, t, n) {
	let r = n === null || n > e.length ? e.length : n;
	return e.splice(r, 0, t), e[r + 1] ?? null;
}
function AC(e, t) {
	let n = e.indexOf(t);
	n >= 0 && e.splice(n, 1);
}
function jC(e, t, n) {
	return AC(e, t), kC(e, t, n);
}
function MC(e, t, n) {
	let r = e.indexOf(t);
	r >= 0 && (e[r] = n);
}
function NC(e) {
	EC.delete(e);
}
//#endregion
//#region src/interactions/tab-rows.ts
var PC = "ui-tab-item";
function FC(e) {
	let t = e.parentElement;
	return t !== null && !t.hasAttribute("data-ui-items-host") && t.closest("[data-ui-items-host]") === t.parentElement ? t : e;
}
function IC(e) {
	return e instanceof HTMLElement && e.classList.contains("ui-tab-item") ? FC(e).parentElement : null;
}
function LC(e, t) {
	return qo(FC(e), t);
}
//#endregion
//#region src/interactions/items-reorder-engine.ts
var RC = ".ui-items-view__item, .ui-table__row", zC = "ui-row--dragging", BC = "--ui-row-drop-offset", VC = "move", HC = ".ui-items-view--wrap", UC = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight"
]);
function WC(e, t) {
	wu(e, VC, { index: t });
}
function GC(e) {
	return {
		name: VC,
		registration: {
			dynamicParameters: (e) => {
				let t = KC(e.domEvent);
				return t === null ? null : [...e.dynamicParameters, t];
			},
			...AS((t) => e === void 0 ? null : qC(e, t), (t) => "pending" in t ? e?.settle(t.pending) : e?.resort(t.strip))
		}
	};
}
function KC(e) {
	let t = e instanceof CustomEvent ? e.detail?.index : void 0;
	return typeof t == "number" ? t : null;
}
function qC(e, t) {
	let n = KC(t);
	if (n === null || !(t.target instanceof Element)) return null;
	let r = IC(t.target);
	if (r !== null) return { strip: r };
	let i = t.target.closest(RC), a = i?.parentElement ?? null, o = i === null || a === null || !a.hasAttribute("data-ui-items-host") ? null : e.ahead(a, F(i), n);
	return o === null ? null : { pending: o };
}
var JC = class {
	root;
	services;
	drag = null;
	lifted = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.services = e.services, this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("pointerup", () => this.release(), !0), this.root.addEventListener("pointercancel", () => this.release(), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", () => this.endDrag(), !0);
	}
	handlePointerDown(e) {
		if (this.release(), !(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = this.liftableRow(e.target), n = t === null ? null : P(t.row);
		if (t === null || n === null) return;
		let r = $C(t.root, t.row);
		if (r === null ? !ew(e.target, t.row) : !r.contains(e.target)) return;
		r !== null && (Ql(t.root, ow(t.row.parentElement ?? t.root), t.row), t.root.focus({ preventScroll: !0 }));
		let i = document.getSelection();
		i !== null && !i.isCollapsed && i.removeAllRanges(), n.draggable || (n.draggable = !0, this.lifted = n);
	}
	release() {
		this.lifted !== null && this.drag === null && (this.lifted.draggable = !1, this.lifted = null);
	}
	liftableRow(e) {
		let t = e.closest(sl), n = t?.parentElement ?? null, r = n?.closest(N) ?? null;
		if (t === null || n === null || r === null || !t.matches(RC) || !n.hasAttribute("data-ui-items-host") || E(r) || !VS(t)) return null;
		let i = r.hasAttribute("data-ui-rows-draggable") && !this.isSorted(r, n);
		return i || r.hasAttribute("data-ui-drag-kind") ? {
			root: r,
			row: t,
			moves: i
		} : null;
	}
	isSorted(e, t) {
		let n = Zi(e);
		return this.services === void 0 || n === null ? !1 : vC(this.services.metadata.getItemsFilterSortMetadata(n), this.services.state, mC(t)).length > 0;
	}
	handleDragStart(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.liftableRow(e.target), n = t?.row.parentElement ?? null, r = t === null ? null : P(t.row);
		if (t === null || n === null || r === null || e.target !== r) return;
		this.drag = {
			...t,
			host: n
		};
		let i = RS(t.root, n, zS(t.row, ow(n))), a = (i?.rows ?? []).filter((e) => e !== t.row).map((e) => P(e) ?? e);
		Eh(e, t.root, r, zC, F(t.row), a, HS(i, t.moves)), US(e, i, () => this.endDrag());
	}
	handleDragOver(e) {
		let t = this.ownDrag(e);
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let n = nw(t.root, t.host), r = ow(t.host), i = ZC(t.host, e.target, e, n, r);
		e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), i === null || this.indexOf(t, i.anchor, i.side) === null ? sw(t.root, null) : sw(t.root, i, iw(r, i, n));
	}
	ownDrag(e) {
		let t = this.drag;
		return t !== null && t.moves && e.target instanceof Element && t.host.contains(e.target) ? t : null;
	}
	indexOf(e, t, n) {
		if (tw(t) !== tw(e.row)) return null;
		let r = YC(QC(e.host, this.services?.keysOf), F(e.row), F(t), n);
		return r === null ? null : r + MS(e.host);
	}
	handleDragLeave(e) {
		let t = this.drag;
		t !== null && e instanceof DragEvent && kh(e, t.host) && sw(t.root, null);
	}
	handleDrop(e) {
		let t = this.ownDrag(e);
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		e.preventDefault();
		let n = ZC(t.host, e.target, e, nw(t.root, t.host), ow(t.host)), r = n === null ? null : this.indexOf(t, n.anchor, n.side);
		this.endDrag(), r !== null && WC(t.row, r);
	}
	endDrag() {
		let e = this.drag;
		this.drag = null, this.release(), e !== null && (Dh(e.root, zC), sw(e.root, null));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !e.altKey || !A(e, { alt: !0 }) || !UC.has(e.key) || !(e.target instanceof Element)) return;
		let t = Wl(e);
		if (t === null || !t.root.matches(".ui-items-view, .ui-table")) return;
		let n = El(t.root), r = n === null ? null : nw(t.root, n), i = e.key === "ArrowLeft" || e.key === "ArrowRight";
		if (n === null || r === null || i && !r.across) return;
		let a = ow(n), o = ql(a);
		if (o === null || this.liftableRow(o)?.moves !== !0) return;
		e.preventDefault();
		let s = e.key === "ArrowDown" || e.key === "ArrowRight", c = !i && t.root.matches(HC) ? xu(a, o, s) : a[a.indexOf(o) + (s ? 1 : -1)] ?? null, l = c === null ? null : this.indexOf({
			host: n,
			row: o
		}, c, s ? "after" : "before");
		l !== null && WC(o, l);
	}
};
function YC(e, t, n, r) {
	let i = e.indexOf(t);
	if (i < 0 || t === n) return null;
	let a = XC(e.filter((e) => e !== t), n, r);
	return a === i ? null : a;
}
function XC(e, t, n) {
	let r = e.indexOf(t);
	return r < 0 ? null : n === "before" ? r : r + 1;
}
function ZC(e, t, n, r, i) {
	if (t.closest("[data-ui-group-header]")?.parentElement === e) return null;
	let a = t.closest(sl);
	for (; a !== null && a.parentElement !== e;) a = a.parentElement?.closest(sl) ?? null;
	if (a ??= aw(i, n), a === null) return null;
	let o = (P(a) ?? a).getBoundingClientRect();
	if ((r.across ? n.clientX < o.left + o.width / 2 : n.clientY < o.top + o.height / 2) === r.rightToLeft) return {
		anchor: a,
		side: "after"
	};
	let s = i[i.indexOf(a) - 1];
	return s !== void 0 && rw(s, a, r) ? {
		anchor: s,
		side: "after"
	} : {
		anchor: a,
		side: "before"
	};
}
function QC(e, t) {
	switch (jS(e)) {
		case "virtualized": return [...t?.(e) ?? B(e).map(F)];
		case "windowed": return B(e).map(F);
		default: return DC(e, B(e)).map(F);
	}
}
function $C(e, t) {
	let n = e.hasAttribute("data-ui-rows-drag-handle") ? t.querySelector(`:scope > .${ye}`) : null;
	return n !== null && n.getClientRects().length > 0 ? n : null;
}
function ew(e, t) {
	return Nc(e, t) === null && e.closest("[data-ui-no-row-drag]") === null;
}
function tw(e) {
	return e.getAttribute("data-ui-group") ?? "";
}
function nw(e, t) {
	let n = e.matches(".ui-orientation--horizontal, .ui-items-view--wrap");
	return {
		across: n,
		rightToLeft: n && getComputedStyle(t).direction === "rtl"
	};
}
function rw(e, t, n) {
	if (tw(e) !== tw(t)) return !1;
	if (!n.across) return !0;
	let r = (P(e) ?? e).getBoundingClientRect(), i = (P(t) ?? t).getBoundingClientRect();
	return r.top < i.bottom && i.top < r.bottom;
}
function iw(e, t, n) {
	let r = t.side === "after" ? e[e.indexOf(t.anchor) + 1] : void 0;
	if (r === void 0 || !rw(t.anchor, r, n)) return -1;
	let i = (P(t.anchor) ?? t.anchor).getBoundingClientRect(), a = (P(r) ?? r).getBoundingClientRect(), o = n.across ? n.rightToLeft ? i.left - a.right : a.left - i.right : a.top - i.bottom;
	return Math.max(o, 0) / 2;
}
function aw(e, t) {
	let n = null, r = Infinity;
	for (let i of e) {
		let e = (P(i) ?? i).getBoundingClientRect(), a = Math.max(e.left - t.clientX, 0, t.clientX - e.right), o = Math.max(e.top - t.clientY, 0, t.clientY - e.bottom), s = a * a + o * o;
		s < r && (n = i, r = s);
	}
	return n;
}
function ow(e) {
	return B(e).filter((e) => e instanceof HTMLElement && e.matches(sl) && P(e) !== null);
}
function sw(e, t, n = 0) {
	let r = t === null ? null : P(t.anchor);
	for (let t of e.querySelectorAll(`[${be}]`)) t !== r && (t.removeAttribute(be), t.style.removeProperty(BC));
	if (r === null || t === null) return;
	r.getAttribute("data-ui-row-drop") !== t.side && r.setAttribute(be, t.side);
	let i = `${n}px`;
	r.style.getPropertyValue(BC) !== i && r.style.setProperty(BC, i);
}
function cw(e) {
	e.classList.remove(zC), e.querySelector(`:scope > [${ae}]`)?.classList.remove(zC);
}
//#endregion
//#region src/interactions/tree-drop.ts
var lw = "--ui-tree-drop-depth";
function uw(e) {
	return e.querySelector(`.${zn}`);
}
function dw(e, t) {
	if (D(e)) return !1;
	let n = t?.getAttribute(Zn);
	return n === "true" || n !== "false" && e.hasAttribute("aria-expanded");
}
function fw(e, t) {
	let n = e.length === 0 ? null : t(e);
	return n === null || dw(n, uw(n));
}
function pw(e, t) {
	let n = uw(e);
	if (dw(e, n)) return F(e);
	let r = n?.getAttribute("data-ui-tree-parent") ?? "";
	return fw(r, t) ? r : null;
}
function mw(e, t, n = "", r) {
	for (let n of e.querySelectorAll(`[${Bn}]`)) n !== t && (n.removeAttribute(Bn), n.style.removeProperty(lw));
	t !== null && (t.setAttribute(Bn, n), r === void 0 ? t.style.removeProperty(lw) : t.style.setProperty(lw, String(r)));
}
function hw(e, t, n) {
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
function gw(e, t, n) {
	let r = e.find((e) => e.key === t);
	if (r === void 0) return null;
	let i = _w(e, r, n);
	return i === null || !vw(e, i.parent) ? null : i;
}
function _w(e, t, n) {
	if (n === "in") {
		let n = hw(e, t.key, !0);
		return n === null ? null : {
			parent: n,
			before: null
		};
	}
	if (n === "out") {
		let n = hw(e, t.key, !1);
		return n === null ? null : {
			parent: n,
			before: bw(e, n, t.parent, !1)
		};
	}
	let r = yw(e, t.parent), i = r.findIndex((e) => e.key === t.key), a = n === "up" ? -1 : 1, o = i + a;
	for (; o >= 0 && o < r.length && r[o].shown === !1;) o += a;
	return o < 0 || o >= r.length ? null : {
		parent: t.parent,
		before: n === "up" ? r[o].key : r[o + 1]?.key ?? null
	};
}
function vw(e, t) {
	return t.length === 0 || e.find((e) => e.key === t)?.takesDrop === !0;
}
function yw(e, t) {
	return e.filter((e) => e.parent === t);
}
function bw(e, t, n, r, i = /* @__PURE__ */ new Set()) {
	let a = yw(e, t);
	for (let e = a.findIndex((e) => e.key === n) + 1; e > 0 && e < a.length; e++) if (!i.has(a[e].key) && (!r || a[e].shown !== !1)) return a[e].key;
	return null;
}
function xw(e, t, n) {
	let r = yw(e, n.parent).map((e) => e.key), i = new Set(t), a = n.before !== null && i.has(n.before) ? bw(e, n.parent, n.before, !1, i) : n.before, o = [], s = null;
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
var Sw = "drop:", Cw = "ui-row--cut", ww = {
	code: "KeyX",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
}, Tw = {
	code: "KeyC",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
}, Ew = {
	code: "KeyV",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
};
function Dw(e) {
	return {
		dynamicParameters: (e) => {
			let t = Ow(e.domEvent);
			return t === null ? null : [...e.dynamicParameters, JSON.stringify(t.drop)];
		},
		...AS((t) => kw(e, t), (t) => e?.settle(t))
	};
}
function Ow(e) {
	let t = e instanceof CustomEvent ? e.detail : null;
	return t?.drop === void 0 ? null : t;
}
function kw(e, t) {
	let n = Ow(t)?.transfer ?? null;
	return n === null || e === void 0 ? null : e.ahead(n.source, n.target, n.keys, n.index);
}
var Aw = class {
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
		let t = WS(e), n = e.target instanceof Element ? e.target : null, r = t === null || n === null ? null : this.targetOf(t, n);
		if (t === null || n === null || r === null) return null;
		let i = jw(t, r, Mw(e)), a = i === null ? null : this.landingOf(r, n, e);
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
		return n === null || E(n) ? null : n;
	}
	landingOf(e, t, n) {
		let r = e.matches(".ui-items-view, .ui-table") ? El(e) : null;
		if (r !== null) {
			let i = ow(r), a = nw(e, r), o = QC(r, this.options.keysOf), s = t !== null && n !== null ? ZC(r, t, n, a, i) : Nw(i);
			return {
				index: ((s === null ? null : XC(o, F(s.anchor), s.side)) ?? o.length) + MS(r),
				folder: null,
				list: r,
				mark: () => s === null ? e.setAttribute(_e, "") : sw(e, s, iw(i, s, a))
			};
		}
		if (e.classList.contains("ui-tree")) {
			let n = Pw(e, t ?? document.activeElement);
			if (n === null) return null;
			let r = n.length === 0 ? El(e) : Fw(e, n);
			return {
				index: null,
				folder: n,
				list: null,
				mark: () => mw(e, r)
			};
		}
		return {
			index: null,
			folder: null,
			list: null,
			mark: () => {
				e.setAttribute(_e, ""), Ah(e, !0);
			}
		};
	}
	unmark() {
		let e = this.marked;
		this.marked = null, e !== null && (e.removeAttribute(_e), Ah(e, !1), e.matches(".ui-items-view, .ui-table") ? sw(e, null) : e.classList.contains("ui-tree") && mw(e, null));
	}
	handleDragLeave(e) {
		this.marked !== null && e instanceof DragEvent && kh(e, this.marked) && this.unmark();
	}
	handleDrop(e) {
		let t = e instanceof DragEvent ? this.dropOf(e) : null;
		t !== null && (e.preventDefault(), this.unmark(), GS(), this.drop(t.drag, t.target, t.effect, t.landing));
	}
	drop(e, t, n, r) {
		let i = n === "move" && r.list !== null && r.index !== null && e.root.matches(".ui-items-view, .ui-table") && t.getAttribute("data-ui-drag-kind") === e.kind && jS(e.host) === "plain" && jS(r.list) === "plain", a = {
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
		t.dispatchEvent(new CustomEvent(Sw + e.kind, {
			bubbles: !0,
			detail: a
		}));
	}
	endDrag() {
		this.unmark(), GS();
	}
	handleKeyDown(e) {
		if (!(!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element))) {
			if (e.key === "Escape") {
				this.clipboard !== null && !k(e) && (e.preventDefault(), this.letGo());
				return;
			}
			bc(e.target) || (Bs(Ew, e) ? this.paste(e, e.target) : Bs(ww, e) ? this.take(e, e.target, !0) : Bs(Tw, e) && this.take(e, e.target, !1));
		}
	}
	letGo() {
		for (let e of this.clipboard?.items.rows ?? []) (P(e) ?? e).classList.remove(Cw);
		this.clipboard = null;
	}
	paste(e, t) {
		let n = this.clipboard, r = n === null ? null : this.targetOf(n.items, t), i = n === null || r === null ? null : jw(n.items, r, !n.cut), a = r === null || i === null ? null : this.landingOf(r, null, null);
		n !== null && r !== null && i !== null && a !== null && (e.preventDefault(), this.drop(n.items, r, i, a), n.cut && this.letGo());
	}
	take(e, t, n) {
		let r = document.getSelection();
		if (r !== null && !r.isCollapsed) return;
		let i = Ul(t), a = i === null ? null : El(i.root);
		if (i === null || a === null || E(i.root) || !i.root.hasAttribute("data-ui-drag-kind")) return;
		let o = ow(a), s = i.row ?? ql(o), c = s === null || !VS(s) ? null : RS(i.root, a, zS(s, o));
		if (!(c === null || !c.effects.has(n ? "move" : "copy")) && (e.preventDefault(), this.letGo(), this.clipboard = {
			items: c,
			cut: n
		}, n)) for (let e of c.rows) (P(e) ?? e).classList.add(Cw);
	}
};
function jw(e, t, n) {
	let r = n || t.getAttribute("data-ui-drag-kind") !== e.kind ? "copy" : "move";
	return e.effects.has(r) ? r : n ? null : r === "move" ? "copy" : "move";
}
function Mw(e) {
	return Ks() ? e.altKey : e.ctrlKey;
}
function Nw(e) {
	let t = Jl(e);
	return t === null ? null : {
		anchor: t,
		side: "after"
	};
}
function Pw(e, t) {
	let n = t?.closest(".ui-tree__row") ?? null;
	return n === null || n.closest(".ui-tree") !== e ? "" : pw(n, (t) => Fw(e, t));
}
function Fw(e, t) {
	return e.querySelector(`.${Rn}[${_}="${x(t)}"]`);
}
//#endregion
//#region src/interactions/temporal-range.ts
function Iw(e, t, n) {
	if (t === "start" || e.start === null) {
		let t = Bw(n, e.start ?? n);
		return {
			start: t,
			end: e.end !== null && e.end.getTime() < t.getTime() ? null : e.end,
			active: "end",
			complete: !1
		};
	}
	return n.getTime() < Vw(e.start).getTime() ? {
		start: Bw(n, e.start),
		end: null,
		active: "end",
		complete: !1
	} : {
		start: e.start,
		end: Bw(n, e.end ?? e.start),
		active: "end",
		complete: !0
	};
}
function Lw(e, t, n) {
	if (t === null || n === null) return !1;
	let r = Vw(e).getTime();
	return r > Vw(t).getTime() && r < Vw(n).getTime();
}
function Rw(e, t, n) {
	return !n && Lw(e, t.start, t.end);
}
function zw(e) {
	return e.start !== null && e.end !== null && e.end.getTime() < e.start.getTime() ? {
		start: e.end,
		end: e.start
	} : e;
}
function Bw(e, t) {
	return Ca(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function Vw(e) {
	return Ca(e.getFullYear(), e.getMonth(), e.getDate());
}
//#endregion
//#region src/interactions/temporal-dom.ts
var V = "ui-temporal-input", Hw = "ui-calendar", Uw = `.${V}, .${Hw}`, Ww = "ui-temporal-input__value-input", Gw = "ui-temporal-input__end-value-input", Kw = "data-ui-temporal-range", qw = "data-ui-temporal-end", Jw = "data-ui-temporal-mode", Yw = "data-ui-temporal-format", Xw = "data-ui-temporal-default-format", Zw = "data-ui-temporal-min", Qw = "data-ui-temporal-max", $w = "data-ui-temporal-step", eT = "data-ui-temporal-step-unit", tT = "data-ui-temporal-marked-days", nT = "data-ui-temporal-marked-only", rT = "data-ui-temporal-page-culture", iT = "data-ui-temporal-months", aT = "data-ui-temporal-months-genitive", oT = "data-ui-temporal-months-short", sT = "data-ui-temporal-daynames", cT = "data-ui-temporal-weekdays", lT = "data-ui-temporal-first-day", uT = "data-ui-temporal-am", dT = "data-ui-temporal-pm", fT = /* @__PURE__ */ new Set([
	Yw,
	Xw,
	Zw,
	Qw,
	iT,
	uT,
	dT,
	tT,
	nT
]), pT = 2e3;
function mT(e) {
	let t = e.getAttribute(Jw);
	return t === "time" || t === "date-time" ? t : "date";
}
function hT(e) {
	let t = e.getAttribute(Yw);
	return t === null || t.trim().length === 0 ? e.getAttribute(Xw) ?? "" : t;
}
function gT(e) {
	let t = e.getAttribute(eT), n = Math.max(1, Math.trunc(Number(e.getAttribute($w))) || 1);
	return {
		unit: t === "hour" || t === "minute" || t === "second" ? t : "day",
		hour: t === "hour" ? n : 1,
		minute: t === "minute" ? n : 1,
		second: t === "second" ? n : 1
	};
}
function _T(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function vT(e, t) {
	return t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function yT(e, t, n) {
	let r = new Date(e);
	return t === "hour" ? r.setHours(n) : t === "minute" ? r.setMinutes(n) : r.setSeconds(n), r;
}
function bT(e) {
	return {
		monthNames: xT(e, iT),
		monthGenitiveNames: xT(e, aT),
		abbreviatedMonthNames: xT(e, oT),
		dayNames: xT(e, sT),
		abbreviatedDayNames: xT(e, cT),
		amDesignator: e.getAttribute(uT) ?? "AM",
		pmDesignator: e.getAttribute(dT) ?? "PM"
	};
}
function xT(e, t) {
	return (e.getAttribute(t) ?? "").split("|");
}
function ST(e, t) {
	e.hasAttribute(rT) && (ET(e, aT, t.monthGenitiveNames.join("|")), ET(e, oT, t.abbreviatedMonthNames.join("|")), ET(e, sT, t.dayNames.join("|")), ET(e, cT, t.abbreviatedDayNames.join("|")), ET(e, iT, t.monthNames.join("|")), ET(e, uT, t.amDesignator), ET(e, dT, t.pmDesignator), ET(e, Xw, TT(mT(e), gT(e), t)));
}
function CT(e) {
	for (let t = 0; t < e.length;) {
		let n = _a(e, t);
		if (n === "h" || n === "hh") return !0;
		t += n?.length ?? 1;
	}
	return !1;
}
function wT(e, t, n) {
	if (!t) return String(e).padStart(2, "0");
	let r = e < 12 ? n.amDesignator : n.pmDesignator, i = String(Ra(e));
	return r.length === 0 ? i : `${i} ${r}`;
}
function TT(e, t, n) {
	let r = t.unit === "second";
	return e === "date" ? n.date : e === "time" ? r ? n.longTime : n.shortTime : ca(n, r);
}
function ET(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function DT(e) {
	return e.hasAttribute(Kw);
}
function OT(e) {
	return e !== null && e.hasAttribute(qw);
}
function kT(e) {
	return H(e, !1);
}
function H(e, t) {
	let n = AT(e, t);
	return n === null ? null : HT(n.value, mT(e));
}
function AT(e, t) {
	return e.querySelector(`.${t ? Gw : Ww}`);
}
function jT(e, t) {
	return HT(e.getAttribute(t) ?? "", mT(e));
}
function MT(e) {
	let t = jT(e, Zw), n = jT(e, Qw), r = (e.getAttribute(tT) ?? "").split(" ").filter((e) => e.length > 0);
	return {
		min: t === null ? null : UT(t, "date"),
		max: n === null ? null : UT(n, "date"),
		marked: new Set(r),
		markedOnly: e.hasAttribute(nT)
	};
}
function NT(e, t) {
	return (e.min === null || t >= e.min) && (e.max === null || t <= e.max) && (!e.markedOnly || e.marked.has(t));
}
function PT(e, t, n) {
	let r = AT(e, n);
	if (r === null) return;
	let i = t === null ? "" : UT(t, mT(e));
	r.value !== i && (r.value = i, r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function FT(e, t) {
	let n = t.trim(), r = n.length === 0 ? null : Da(n, hT(e), bT(e));
	return r === null ? n : UT(Sa(r), mT(e));
}
function IT(e) {
	if (!DT(e)) return;
	let t = {
		start: H(e, !1),
		end: H(e, !0)
	}, n = zw(t);
	n !== t && (PT(e, n.start, !1), PT(e, n.end, !0));
}
function LT(e) {
	let t = jT(e, Zw), n = jT(e, Qw);
	if (t === null && n === null) return null;
	for (let r of DT(e) ? [!1, !0] : [!1]) {
		let i = H(e, r);
		if (i !== null && t !== null && i.getTime() < t.getTime()) return {
			key: "ui.value.before",
			args: { min: fa(t, hT(e), bT(e)) }
		};
		if (i !== null && n !== null && i.getTime() > n.getTime()) return {
			key: "ui.value.after",
			args: { max: fa(n, hT(e), bT(e)) }
		};
	}
	return null;
}
function RT(e) {
	return BT(e, zT(e, /* @__PURE__ */ new Date()));
}
function zT(e, t) {
	let n = jT(e, Zw), r = jT(e, Qw);
	return n !== null && t.getTime() < n.getTime() ? n : r !== null && t.getTime() > r.getTime() ? r : t;
}
function BT(e, t) {
	let n = gT(e), r = new Date(t);
	return r.setMilliseconds(0), r.setSeconds(n.unit === "second" ? Math.floor(r.getSeconds() / n.second) * n.second : 0), n.unit === "hour" ? r.setMinutes(0) : r.setMinutes(Math.floor(r.getMinutes() / n.minute) * n.minute), r.setHours(Math.floor(r.getHours() / n.hour) * n.hour), r;
}
var VT = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/;
function HT(e, t) {
	let n = e.trim();
	if (n.length === 0) return null;
	if (t === "time") {
		let e = VT.exec(n);
		return e === null ? null : new Date(pT, 0, 1, Number(e[1]), Number(e[2]), Number(e[3] ?? "0"));
	}
	let r = xa(n);
	return r === null ? null : Sa(r);
}
function UT(e, t) {
	let n = `${WT(e.getHours())}:${WT(e.getMinutes())}:${WT(e.getSeconds())}`;
	if (t === "time") return n;
	let r = `${String(e.getFullYear()).padStart(4, "0")}-${WT(e.getMonth() + 1)}-${WT(e.getDate())}`;
	return t === "date" ? r : `${r}T${n}`;
}
function WT(e) {
	return String(e).padStart(2, "0");
}
//#endregion
//#region src/interactions/temporal-calendar.ts
var GT = "ui-temporal-input__day", KT = "ui-temporal-input__month", qT = 3, JT = "data-ui-temporal-nav", YT = "data-ui-temporal-day", XT = 366;
function ZT(e) {
	let t = kT(e);
	return {
		view: xE(t ?? zT(e, /* @__PURE__ */ new Date())),
		pane: "days",
		focusedDay: t,
		activeEnd: "start",
		hoverDay: null,
		choosingEnd: !1
	};
}
function QT(e, t, n, r) {
	let i = bE("div", `${V}__calendar`), a = bE("div", `${V}__calendar-header`), o = MT(e), s = yE("previous", "‹", T.text("ui.picker.previous"));
	s.disabled = $T(o, t, -1) === null, a.append(s);
	let c = yE("pane", t.pane === "days" ? `${n.monthNames[t.view.getMonth()]} ${t.view.getFullYear()}` : String(t.view.getFullYear()));
	c.classList.add(`${V}__calendar-label`), a.append(c);
	let l = yE("next", "›", T.text("ui.picker.next"));
	return l.disabled = $T(o, t, 1) === null, a.append(l), i.append(a), i.append(t.pane === "days" ? rE(e, t, n, r, o) : iE(t, n, o)), i;
}
function $T(e, t, n) {
	let r = t.pane === "months", i = wE(t.view, n * (r ? 12 : 1));
	return tE(e, eE(i, r ? 4 : 7)) ? nE(e, i) : null;
}
function eE(e, t) {
	return UT(e, "date").slice(0, t);
}
function tE(e, t) {
	return (e.min === null || t >= e.min.slice(0, t.length)) && (e.max === null || t <= e.max.slice(0, t.length));
}
function nE(e, t) {
	let n = eE(t, 7), r = e.min !== null && n < e.min.slice(0, 7) ? e.min : e.max !== null && n > e.max.slice(0, 7) ? e.max : null, i = r === null ? null : HT(r, "date");
	return i === null ? t : xE(i);
}
function rE(e, t, n, r, i) {
	let a = gE(e), o = bE("div", `${V}__weekdays`);
	for (let e = 0; e < 7; e++) {
		let t = bE("span", `${V}__weekday`);
		t.textContent = n.abbreviatedDayNames[(a + e) % 7], o.append(t);
	}
	let s = bE("div", `${V}__days`), c = Vw(/* @__PURE__ */ new Date()), l = DT(e), u = l ? H(e, !1) : r, d = l ? H(e, !0) : null, f = SE(t.view, a);
	for (let e = 0; e < 42; e++) {
		let n = CE(f, e), r = UT(n, "date"), a = bE("button", GT);
		a.type = "button", a.tabIndex = -1, a.textContent = String(n.getDate()), a.setAttribute(YT, r), n.getMonth() !== t.view.getMonth() && a.classList.add(`${GT}--outside`), TE(n, c) && (a.classList.add(`${GT}--today`), a.setAttribute("aria-current", "date")), i.marked.has(r) && a.classList.add(`${GT}--marked`);
		let o = u !== null && TE(n, u), p = d !== null && TE(n, d);
		a.setAttribute("aria-pressed", o || p ? "true" : "false"), (o || p) && a.classList.add(`${GT}--selected`), l && (o || p) && a.setAttribute("aria-description", T.text(o ? "ui.picker.start" : "ui.picker.end")), Rw(n, {
			start: u,
			end: d
		}, t.choosingEnd) && a.classList.add(`${GT}--within`), NT(i, r) || (a.disabled = !0), s.append(a);
	}
	let p = bE("div", `${V}__calendar-pane`);
	return p.append(o, s), p;
}
function iE(e, t, n) {
	let r = bE("div", `${V}__months`);
	for (let i = 0; i < 12; i++) {
		let a = bE("button", KT);
		a.type = "button", a.textContent = t.abbreviatedMonthNames[i], a.setAttribute(JT, `month:${i}`), i === e.view.getMonth() && (a.classList.add(`${KT}--selected`), a.setAttribute("aria-current", "true")), tE(n, eE(Ca(e.view.getFullYear(), i, 1), 7)) || (a.disabled = !0), r.append(a);
	}
	let i = [...r.children];
	return j(i, i.find((e) => e.getAttribute("aria-current") === "true" && !e.disabled) ?? i.find((e) => !e.disabled) ?? null), r;
}
function aE(e, t) {
	let n = [...e.parentElement?.querySelectorAll(".ui-temporal-input__month") ?? []], r = n.indexOf(e), i = r === -1 ? null : oE(t, r % qT);
	if (i === null) return null;
	for (let e = r + i.offset; e >= 0 && e < n.length; e += i.step) if (!n[e].disabled) return n[e];
	return null;
}
function oE(e, t) {
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
			offset: qT,
			step: qT
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
function sE(e) {
	let t = bE("div", `${V}__period-caption`);
	return t.textContent = T.text(e.activeEnd === "end" ? "ui.picker.end" : "ui.picker.start"), t;
}
function cE(e, t, n) {
	let r = MT(e);
	if (n.startsWith("month:")) {
		let i = Ca(t.view.getFullYear(), Number(n.slice(6)), 1);
		return tE(r, eE(i, 7)) && (t.view = i, t.pane = "days", t.focusedDay = pE(r, fE(i, t.focusedDay ?? kT(e) ?? zT(e, /* @__PURE__ */ new Date())))), !0;
	}
	switch (n) {
		case "previous": return t.view = $T(r, t, -1) ?? t.view, !0;
		case "next": return t.view = $T(r, t, 1) ?? t.view, !0;
		case "pane": return t.pane = t.pane === "days" ? "months" : "days", !0;
		default: return !1;
	}
}
function lE(e, t, n) {
	if (DT(e)) {
		uE(e, t, n);
		return;
	}
	let r = Bw(n, kT(e) ?? RT(e));
	t.focusedDay = r, t.view = xE(r), PT(e, r, !1);
}
function uE(e, t, n) {
	let r = Iw({
		start: H(e, !1),
		end: H(e, !0)
	}, t.activeEnd, Bw(n, RT(e)));
	t.focusedDay = r.end ?? r.start, t.view = xE(n), t.activeEnd = r.active, t.choosingEnd = !r.complete, t.hoverDay = null, PT(e, r.end, !0), PT(e, r.start, !1);
}
function dE(e, t, n, r = !1) {
	let i = mE(n), a = hE(t, n, gE(e), r);
	if (a === null) return null;
	let o = MT(e);
	if (i === 0) return pE(o, a);
	let s = a;
	for (let e = 0; e < XT; e++) {
		if (NT(o, UT(s, "date"))) return s;
		s = CE(s, i);
	}
	return t;
}
function fE(e, t) {
	let n = Ca(e.getFullYear(), e.getMonth() + 1, 0).getDate();
	return Ca(e.getFullYear(), e.getMonth(), Math.min(t.getDate(), n), t.getHours(), t.getMinutes(), t.getSeconds());
}
function pE(e, t) {
	let n = UT(t, "date"), r = e.min !== null && n < e.min ? e.min : e.max !== null && n > e.max ? e.max : null, i = r === null ? null : HT(r, "date");
	return i === null ? t : Bw(i, t);
}
function mE(e) {
	switch (e) {
		case "ArrowLeft": return -1;
		case "ArrowRight": return 1;
		case "ArrowUp": return -7;
		case "ArrowDown": return 7;
		default: return 0;
	}
}
function hE(e, t, n, r) {
	let i = (e.getDay() - n + 7) % 7;
	switch (t) {
		case "ArrowLeft": return CE(e, -1);
		case "ArrowRight": return CE(e, 1);
		case "ArrowUp": return CE(e, -7);
		case "ArrowDown": return CE(e, 7);
		case "PageUp": return wE(e, r ? -12 : -1);
		case "PageDown": return wE(e, r ? 12 : 1);
		case "Home": return CE(e, -i);
		case "End": return CE(e, 6 - i);
		default: return null;
	}
}
function gE(e) {
	let t = Number(e.getAttribute(lT));
	return Number.isInteger(t) && t >= 0 && t <= 6 ? t : 1;
}
function _E(e, t, n, r) {
	let i = [...e.querySelectorAll(`.${GT}`)];
	if (i.length === 0) return;
	let a = UT(Vw(t.focusedDay ?? n ?? /* @__PURE__ */ new Date()), "date"), o = i.find((e) => e.getAttribute("data-ui-temporal-day") === a && !e.disabled) ?? i.find((e) => !e.disabled);
	o !== void 0 && (j(i, o), r && I(o));
}
function vE(e, t) {
	let n = t.activeEnd === "end" && t.hoverDay !== null ? H(e, !1) : null, r = t.hoverDay;
	for (let t of e.querySelectorAll(`.${GT}`)) {
		let e = HT(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		t.classList.toggle(`${GT}--preview`, e !== null && n !== null && r !== null && Lw(e, n, CE(r, 1)));
	}
}
function yE(e, t, n) {
	let r = bE("button", `${V}__nav`);
	return r.type = "button", r.textContent = t, r.setAttribute(JT, e), n !== void 0 && r.setAttribute("aria-label", n), r;
}
function bE(e, t) {
	let n = document.createElement(e);
	return n.className = t, n;
}
function xE(e) {
	return Ca(e.getFullYear(), e.getMonth(), 1);
}
function SE(e, t) {
	let n = xE(e);
	return CE(n, -((n.getDay() - t + 7) % 7));
}
function CE(e, t) {
	return Ca(e.getFullYear(), e.getMonth(), e.getDate() + t, e.getHours(), e.getMinutes(), e.getSeconds());
}
function wE(e, t) {
	let n = Ca(e.getFullYear(), e.getMonth() + t, 1), r = Ca(n.getFullYear(), n.getMonth() + 1, 0).getDate();
	return Ca(n.getFullYear(), n.getMonth(), Math.min(e.getDate(), r), e.getHours(), e.getMinutes(), e.getSeconds());
}
function TE(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
//#endregion
//#region src/interactions/temporal-picker-engine.ts
var EE = "ui-temporal-input__field", DE = "ui-temporal-input__popup", OE = "ui-temporal-input--open", kE = "ui-calendar__body", AE = "ui-temporal-input__time-cell", jE = "ui-temporal-input__time-column", ME = 140, NE = "data-ui-temporal-toggle", PE = "data-ui-temporal-unit", FE = "data-ui-temporal-cell", IE = "data-ui-temporal-centred", LE = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	written = /* @__PURE__ */ new WeakSet();
	drawnLanguage = document.documentElement.lang;
	popups = new Km({
		show: ({ owner: e, popup: t }) => {
			e.classList.add(OE), t.addEventListener("wheel", this.onColumnWheel, { passive: !1 }), this.renderSurface(e, !0);
		},
		hide: ({ owner: e, popup: t }) => {
			for (let e of this.columnSettles.values()) window.clearTimeout(e);
			this.columnSettles.clear(), this.wheelTurns.clear(), t.removeEventListener("wheel", this.onColumnWheel), e.classList.remove(OE);
		}
	});
	columnSettles = /* @__PURE__ */ new Map();
	wheelTurns = /* @__PURE__ */ new Map();
	onColumnWheel = (e) => this.handleColumnWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.arrive(this.root.querySelectorAll(Uw)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = Yi(e.components, Uw), n = e.propertyName === "Value" || e.propertyName === "EndValue";
			this.applyDisplay(t);
			for (let e of t) n && RE(e) && this.states.set(e, ZT(e)), this.isShowing(e) && this.renderSurface(e);
		}), R(this.root, Uw, { attributeFilter: [...fT] }, (e) => {
			for (let t of e) this.applyDisplay([t]), this.isShowing(t) && this.renderSurface(t);
		}), R(this.root, Uw, { childList: !0 }, (e) => this.arrive(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), this.root.addEventListener("focusin", (e) => this.handleFieldFocus(e), !0), this.root.addEventListener("mouseover", (e) => this.handleDayHover(e), !0), this.root.addEventListener("mouseout", (e) => this.handleDayHover(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("scroll", (e) => this.handleColumnScroll(e), !0), this.root.addEventListener("blur", (e) => this.handleFieldBlur(e), !0), T.onChange(() => this.applyWords());
	}
	arrive(e) {
		let t = [...e];
		this.applyDisplay(t);
		for (let e of t) RE(e) && zE(e)?.firstElementChild === null && this.renderSurface(e);
	}
	applyWords() {
		let e = [...this.root.querySelectorAll(Uw)], t = T.temporal;
		if (t !== null && T.language !== this.drawnLanguage) {
			this.drawnLanguage = T.language;
			for (let n of e) ST(n, t);
		}
		this.applyDisplay(e);
		for (let t of e) this.isShowing(t) && this.renderSurface(t);
	}
	get openPicker() {
		return this.popups.current;
	}
	isShowing(e) {
		return e === this.openPicker || RE(e);
	}
	calendarFor(e) {
		if (!(e instanceof Element)) return null;
		let t = e.closest(`.${kE}`)?.closest(".ui-calendar") ?? null;
		if (t !== null) return t;
		let n = this.openPicker;
		return n !== null && zE(n)?.contains(e) === !0 ? n : null;
	}
	applyDisplay(e) {
		for (let t of e) {
			let e = Ta(hT(t), QE()), n = ga(hT(t)) ? "numeric" : "text";
			for (let r of t.querySelectorAll(`.${EE}`)) {
				if (r.placeholder !== e && (r.placeholder = e), r.inputMode !== n && (r.inputMode = n), r === document.activeElement && this.written.has(r)) continue;
				this.written.add(r);
				let i = AT(t, OT(r))?.value ?? "", a = HT(i, mT(t));
				if (a !== null) {
					r.value = fa(a, hT(t), bT(t));
					continue;
				}
				i.length === 0 && (r.value = "");
			}
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(EE)) return;
		let t = e.target.closest(`.${V}`), n = t === null ? null : AT(t, OT(e.target));
		if (t === null || n === null) return;
		let r = FT(t, e.target.value), i = HT(r, mT(t)), a = i === null ? r : UT(i, mT(t));
		if (BE(t, a)) {
			let n = H(t, OT(e.target));
			e.target.value = n === null ? "" : fa(n, hT(t), bT(t));
			return;
		}
		OT(e.target) && (this.getState(t).choosingEnd = !1), n.value = a, n.dispatchEvent(new Event("change", { bubbles: !0 })), IT(t), this.applyDisplay([t]);
	}
	handleFieldFocus(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(EE)) return;
		let t = e.target.closest(`.${V}`);
		t !== null && DT(t) && (this.getState(t).activeEnd = OT(e.target) ? "end" : "start");
	}
	handleDayHover(e) {
		let t = this.calendarFor(e.target);
		if (t === null || !(e.target instanceof Element) || !DT(t)) return;
		let n = e.type === "mouseover" ? e.target.closest(`[${YT}]`) : null, r = this.getState(t), i = n === null ? null : HT(n.getAttribute("data-ui-temporal-day") ?? "", "date");
		(r.hoverDay?.getTime() ?? null) !== (i?.getTime() ?? null) && (r.hoverDay = i, vE(t, r));
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`[${YT}], .${AE}`) : null, n = this.calendarFor(t);
		n === null || t === null || t === document.activeElement || t.matches(":disabled") || (t.classList.contains(AE) ? tD(t) : this.followPointer(n, t));
	}
	followPointer(e, t) {
		let n = zE(e), r = HT(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		n === null || r === null || !n.contains(document.activeElement) || (this.getState(e).focusedDay = r, j([...n.querySelectorAll(`.${GT}`)], t), nd(t));
	}
	handleFieldBlur(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(EE)) return;
		let t = e.target.closest(`.${V}`);
		t !== null && this.applyDisplay([t]);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${NE}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${V}`));
			return;
		}
		let n = this.calendarFor(e.target);
		if (n === null) return;
		let r = e.target.closest(`[${JT}]`);
		if (r !== null) {
			e.preventDefault(), this.applyNavigation(n, r.getAttribute("data-ui-temporal-nav") ?? "");
			return;
		}
		let i = e.target.closest(`[${YT}]`);
		if (i !== null) {
			e.preventDefault(), this.chooseDay(n, i.getAttribute("data-ui-temporal-day") ?? "");
			return;
		}
		let a = e.target.closest(`[${FE}]`);
		if (a !== null) {
			e.preventDefault();
			let t = a.closest(`[${PE}]`)?.getAttribute(PE);
			t != null && this.chooseTime(n, t, Number(a.getAttribute(FE)));
		}
	}
	applyNavigation(e, t) {
		let n = this.getState(e);
		if (cE(e, n, t)) {
			this.renderSurface(e);
			return;
		}
		switch (t) {
			case "now":
				n.choosingEnd = !1, this.commit(e, RT(e), n.activeEnd === "end");
				return;
			case "clear":
				this.commit(e, null), DT(e) && this.commit(e, null, !0), n.activeEnd = "start", n.choosingEnd = !1, this.close();
				return;
			case "done":
				this.close();
				return;
			default: return;
		}
	}
	chooseDay(e, t) {
		let n = HT(t, "date");
		if (n === null || O(e) || E(e) || !NT(MT(e), t)) return;
		let r = this.getState(e);
		RE(e) && DT(e) && !r.choosingEnd && H(e, !1) !== null && H(e, !0) !== null && (r.activeEnd = "start");
		let i = AT(e, !1), a = `${i?.value ?? ""}|${AT(e, !0)?.value ?? ""}`;
		lE(e, r, n), RE(e) && `${i?.value ?? ""}|${AT(e, !0)?.value ?? ""}` === a && i?.dispatchEvent(new Event("change", { bubbles: !0 })), this.applyDisplay([e]), this.renderSurface(e);
	}
	chooseTime(e, t, n) {
		if (!Number.isFinite(n)) return;
		let r = DT(e) && this.getState(e).activeEnd === "end", i = yT(H(e, r) ?? RT(e), t, n);
		this.commit(e, i, r);
	}
	commit(e, t, n = !1) {
		PT(e, t, n), IT(e), this.applyDisplay([e]), this.isShowing(e) && this.renderSurface(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || k(e)) return;
		if (e.key === "ArrowDown" && A(e, { alt: !0 }) && e.target instanceof HTMLElement && e.target.classList.contains(EE)) {
			e.preventDefault(), this.toggle(e.target.closest(`.${V}`), OT(e.target) ? "end" : "start");
			return;
		}
		let t = this.calendarFor(e.target);
		if (t === null) return;
		if (e.target instanceof HTMLElement && e.target.classList.contains(AE)) {
			A(e) && rD(e);
			return;
		}
		if (e.target instanceof HTMLElement && e.target.classList.contains("ui-temporal-input__month")) {
			A(e) && nD(e, e.target);
			return;
		}
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains("ui-temporal-input__day") || !A(e, { shift: e.key === "PageUp" || e.key === "PageDown" })) return;
		let n = HT(e.target.getAttribute("data-ui-temporal-day") ?? "", "date");
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault(), this.chooseDay(t, UT(n, "date"));
			return;
		}
		let r = dE(t, n, e.key, e.shiftKey);
		if (r === null) return;
		e.preventDefault();
		let i = this.getState(t);
		i.focusedDay = r, i.view = xE(r), this.renderSurface(t, !0);
	}
	handleColumnScroll(e) {
		if (this.openPicker === null || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${jE}`);
		t === null || !this.openPicker.contains(t) || (window.clearTimeout(this.columnSettles.get(t)), this.columnSettles.set(t, window.setTimeout(() => {
			this.columnSettles.delete(t), this.chooseCentredTime(t);
		}, ME)));
	}
	handleColumnWheel(e) {
		if (this.openPicker === null || e.deltaY === 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${jE}`), n = t?.getAttribute(PE) ?? null;
		if (t === null || n === null || !this.openPicker.contains(t)) return;
		e.preventDefault();
		let { steps: r, carried: i } = w_(this.wheelTurns.get(n) ?? 0, C_(e).y);
		if (this.wheelTurns.set(n, i), r === 0) return;
		let a = [...t.querySelectorAll(`.${AE}`)].filter((e) => !e.disabled), o = a.findIndex((e) => e.classList.contains(`${AE}--selected`)), s = a[Math.min(a.length - 1, Math.max(0, Math.max(0, o) + r))];
		s !== void 0 && !s.classList.contains(`${AE}--selected`) && this.chooseTime(this.openPicker, n, Number(s.getAttribute(FE)));
	}
	chooseCentredTime(e) {
		let t = this.openPicker;
		if (t === null || !t.contains(e)) return;
		let n = Number(e.getAttribute(IE));
		if (Number.isFinite(n) && Math.abs(e.scrollTop - n) <= 1) return;
		let r = e.getAttribute(PE), i = qE(e);
		if (!(r === null || i === null || i.classList.contains(`${AE}--selected`))) {
			if (i.matches(":disabled")) {
				GE(t);
				return;
			}
			this.chooseTime(t, r, Number(i.getAttribute(FE)));
		}
	}
	toggle(e, t) {
		let n = e?.querySelector(`.${DE}`) ?? null;
		if (e === null || n === null) return;
		if (this.openPicker === e) {
			this.close();
			return;
		}
		this.close();
		let r = this.getState(e);
		r.activeEnd = DT(e) ? t ?? (H(e, !1) === null ? "start" : H(e, !0) === null ? "end" : r.activeEnd) : "start", r.hoverDay = null, r.choosingEnd = !1;
		let i = H(e, r.activeEnd === "end") ?? kT(e);
		r.pane = "days", r.view = xE(i ?? zT(e, /* @__PURE__ */ new Date())), r.focusedDay = i;
		let a = e.querySelector(`[${NE}]`);
		this.popups.open({
			owner: e,
			popup: n,
			anchor: e.querySelector(".ui-temporal-input__row") ?? e,
			placement: { placement: "bottom-end" },
			openers: a === null ? [] : [a],
			returnFocus: () => eD(e, this.getState(e).activeEnd === "end")
		});
	}
	close() {
		this.popups.close();
	}
	getState(e) {
		let t = this.states.get(e);
		return t === void 0 && (t = ZT(e), this.states.set(e, t)), t;
	}
	renderSurface(e, t = !1) {
		let n = zE(e);
		if (n === null) return;
		let r = RE(e), i = mT(e), a = this.getState(e), o = bT(e), s = DT(e), c = H(e, s && a.activeEnd === "end"), l = JE(n), u = YE(n), d = n.contains(document.activeElement);
		if (n.replaceChildren(), s && n.append(sE(a)), r) n.append(QT(e, a, o, c));
		else {
			let t = bE("div", `${V}__panes`);
			t.append(QT(e, a, o, c)), i === "date-time" && t.append(VE(e, c)), n.append(t, ZE(i));
		}
		let f = u === null ? null : n.querySelector(`[${JT}="${x(u)}"]:not(:disabled)`);
		_E(n, a, c, t || d && l === null && f === null), vE(e, a), r || (WE(n), GE(n), XE(n, l)), f !== null && I(f), r || this.popups.reposition(e);
	}
};
function RE(e) {
	return e.classList.contains(Hw);
}
function zE(e) {
	return e.querySelector(`.${RE(e) ? kE : DE}`);
}
function BE(e, t) {
	let n = MT(e), r = n.markedOnly ? HT(t, mT(e)) : null;
	return r !== null && !n.marked.has(UT(r, "date"));
}
function VE(e, t) {
	let n = gT(e), r = bE("div", `${V}__time`), i = bE("div", `${V}__time-columns`);
	for (let r of HE(n)) i.append(UE(e, r, _T(n, r), t));
	return r.append(i), r;
}
function HE(e) {
	return e.unit === "second" ? [
		"hour",
		"minute",
		"second"
	] : e.unit === "hour" ? ["hour"] : ["hour", "minute"];
}
function UE(e, t, n, r) {
	let i = bE("div", jE);
	i.setAttribute(PE, t), i.setAttribute("role", "listbox"), i.setAttribute("aria-label", T.text(t === "hour" ? "ui.picker.hours" : t === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"));
	let a = t === "hour" ? 24 : 60, o = r === null ? null : vT(r, t), s = t === "hour" && CT(hT(e)), c = bT(e), l = null;
	for (let u = 0; u < a; u += n) {
		let n = bE("button", AE);
		n.type = "button", n.tabIndex = -1, n.textContent = t === "hour" ? wT(u, s, c) : String(u).padStart(2, "0"), n.setAttribute(FE, String(u)), n.setAttribute("role", "option"), n.setAttribute("aria-selected", u === o ? "true" : "false"), u === o && n.classList.add(`${AE}--selected`), sD(e, t, u, r) ? n.disabled = !0 : (l === null || u === o) && (l = n), i.append(n);
	}
	return l !== null && (l.tabIndex = 0), i;
}
function WE(e) {
	let t = e.querySelector(`.${V}__calendar`), n = e.querySelector(`.${V}__time-columns`);
	t !== null && n !== null && (n.style.maxHeight = `${t.clientHeight}px`);
}
function GE(e) {
	for (let t of e.querySelectorAll(`.${jE}`)) {
		let e = t.querySelector(`.${AE}--selected`) ?? t.firstElementChild;
		if (!(e instanceof HTMLElement)) continue;
		let n = Math.max(0, (t.clientHeight - e.getBoundingClientRect().height) / 2);
		t.style.paddingTop = `${n}px`, t.style.paddingBottom = `${n}px`, KE(t, e), t.setAttribute(IE, String(t.scrollTop));
	}
}
function KE(e, t) {
	let n = t.getBoundingClientRect();
	e.scrollTop += n.top - e.getBoundingClientRect().top - (e.clientHeight - n.height) / 2;
}
function qE(e) {
	let t = e.getBoundingClientRect().top + e.clientHeight / 2, n = null, r = Infinity;
	for (let i of e.querySelectorAll(`.${AE}`)) {
		let e = i.getBoundingClientRect(), a = Math.abs(e.top + e.height / 2 - t);
		a < r && (r = a, n = i);
	}
	return n;
}
function JE(e) {
	let t = document.activeElement;
	return !(t instanceof HTMLElement) || !e.contains(t) || !t.classList.contains(AE) ? null : t.closest(`.${jE}`)?.getAttribute(PE) ?? null;
}
function YE(e) {
	let t = document.activeElement;
	return t instanceof HTMLElement && e.contains(t) ? t.getAttribute(JT) : null;
}
function XE(e, t) {
	if (t === null) return;
	let n = e.querySelector(`.${jE}[${PE}="${t}"]`)?.querySelector(`.${AE}--selected`) ?? null;
	n !== null && I(n);
}
function ZE(e) {
	let t = bE("div", `${V}__popup-footer`);
	return t.append(yE("now", T.text(e === "date" ? "ui.picker.today" : "ui.picker.now"))), t.append(yE("clear", T.text("ui.picker.clear"))), t.append(yE("done", T.text("ui.picker.done"))), t;
}
function QE() {
	return {
		year: $E("ui.picker.letter.year", wa.year),
		month: $E("ui.picker.letter.month", wa.month),
		day: $E("ui.picker.letter.day", wa.day),
		hour: $E("ui.picker.letter.hour", wa.hour),
		minute: $E("ui.picker.letter.minute", wa.minute),
		second: $E("ui.picker.letter.second", wa.second)
	};
}
function $E(e, t) {
	let n = T.lookup(e);
	return n === void 0 || n.trim().length === 0 ? t : n;
}
function eD(e, t) {
	for (let n of e.querySelectorAll(`.${EE}`)) if (OT(n) === t) return n;
	return e.querySelector(`.${EE}`);
}
function tD(e) {
	let t = document.activeElement;
	t instanceof HTMLElement && t.classList.contains(AE) && nd(e);
}
function nD(e, t) {
	if (!Fc(e.key, "both")) return;
	e.preventDefault();
	let n = aE(t, e.key);
	Lc([...n?.parentElement?.children ?? []], n);
}
function rD(e) {
	let t = e.target, n = t.closest(`.${jE}`);
	if (n === null) return;
	let r = e.key === "ArrowLeft" || e.key === "ArrowRight" ? aD(n, e.key === "ArrowRight" ? 1 : -1) : iD(n, t, e.key);
	r !== null && (e.preventDefault(), r.focus({ preventScroll: !0 }), oD(r));
}
function iD(e, t, n) {
	let r = [...e.querySelectorAll(`.${AE}`)];
	return n === "PageUp" || n === "PageDown" ? yu(n, r.filter(M), t, "vertical") ?? t : Pc({
		key: n,
		items: r,
		current: t,
		axis: "vertical",
		loop: !1
	});
}
function aD(e, t) {
	let n = [...e.parentElement?.querySelectorAll(`.${jE}`) ?? []], r = n[n.indexOf(e) + t];
	return r === void 0 ? null : r.querySelector(`.${AE}--selected`) ?? r.querySelector(`.${AE}:not(:disabled)`);
}
function oD(e) {
	let t = e.closest(`.${jE}`);
	t !== null && KE(t, e);
}
function sD(e, t, n, r) {
	let i = jT(e, Zw), a = jT(e, Qw);
	if (i === null && a === null) return !1;
	let o = yT(r ?? RT(e), t, n), s = new Date(o), c = new Date(o);
	return t === "hour" ? (s.setMinutes(0, 0, 0), c.setMinutes(59, 59, 999)) : t === "minute" && (s.setSeconds(0, 0), c.setSeconds(59, 999)), i !== null && c.getTime() < i.getTime() || a !== null && s.getTime() > a.getTime();
}
//#endregion
//#region src/interactions/theme-switcher-engine.ts
var cD = "[data-ui-theme-switcher]", lD = class {
	options;
	root;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e));
	}
	handleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(cD) : null;
		t === null || t.hasAttribute("disabled") || (e.preventDefault(), this.options.effects.apply({
			effect: {
				kind: hi.SetTheme,
				mode: uD() === "dark" ? "Light" : "Dark"
			},
			dom: this.options.dom
		}));
	}
};
function uD() {
	let e = document.documentElement.getAttribute(hr);
	return e === "light" || e === "dark" ? e : window.matchMedia?.("(prefers-color-scheme: dark)").matches === !0 ? "dark" : "light";
}
//#endregion
//#region src/interactions/popup-list.ts
var dD = new Gy();
function fD(e, t, n, r, i = !1, a = !0) {
	let o = r ?? (a ? null : n.find(M) ?? null);
	o !== null && j(n, o);
	let s = e.open({
		...t,
		focus: a && r !== null ? r : !1
	});
	return s && a && r === null && _d(t.popup, n, i), s;
}
function pD(e, t) {
	let n = e.target instanceof HTMLElement && t.includes(e.target) ? e.target : null, r = Ky(e);
	if (r !== null) return e.preventDefault(), Lc(t, hD(t, n, r)), !0;
	if (!Fc(e.key, "vertical") || !A(e)) return !1;
	let i = Pc({
		key: e.key,
		items: t,
		current: n,
		axis: "vertical"
	});
	return i !== null && e.preventDefault(), Lc(t, i), !0;
}
var mD = {
	character: Ky,
	entry: hD
};
function hD(e, t, n) {
	let r = e.filter(M), i = r[0]?.parentElement;
	return i == null ? null : dD.next({
		owner: i,
		character: n,
		entries: r,
		current: t,
		words: lm,
		context: i
	});
}
function gD(e, t) {
	e === document.activeElement || !M(e) || (j(t, e), nd(e));
}
//#endregion
//#region src/interactions/language-switcher-engine.ts
var _D = `[${vr}]`, vD = "ui-language-switcher__trigger", yD = "ui-language-switcher__label-text", bD = "ui-language-switcher__label-text--current", xD = "ui-language-switcher__label-text--page", SD = "ui-language-switcher__menu", CD = "ui-language-switcher__choice", wD = "ui-language-switcher--open", TD = "ui.language.switch", ED = "ui.language.current", DD = class {
	options;
	root;
	menus = new Km({
		show: ({ owner: e }) => e.classList.add(wD),
		hide: ({ owner: e }) => e.classList.remove(wD),
		closesWhenReadOnly: !1,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e)), T.onChange(() => this.showLanguage(T.language));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${CD}`), n = e.target.closest(_D);
		if (n === null) return;
		if (t !== null) {
			e.preventDefault(), this.choose(n, t.getAttribute(yr));
			return;
		}
		let r = e.target.closest(`.${vD}`);
		if (r === null || E(r)) return;
		e.preventDefault();
		let i = OD(n);
		if (i.length === 2) {
			let e = T.requestedLanguage;
			this.choose(n, i.map((e) => e.getAttribute("data-ui-language")).find((t) => t !== e) ?? null);
			return;
		}
		this.menus.isOpen(n) ? this.menus.close(n) : i.length > 2 && this.openMenu(n, r);
	}
	handleKeyDown(e) {
		if (e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(_D);
		if (t === null) return;
		let n = OD(t), r = e.target.closest(`.${vD}`);
		if (r !== null && n.length > 2 && !this.menus.isOpen(t) && (e.key === "ArrowDown" || e.key === "ArrowUp") && A(e)) {
			e.preventDefault(), this.openMenu(t, r, e.key === "ArrowUp");
			return;
		}
		this.menus.isOpen(t) && pD(e, n);
	}
	handlePointerMove(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${CD}`), n = t?.closest(_D) ?? null;
		t !== null && n !== null && this.menus.isOpen(n) && gD(t, OD(n));
	}
	openMenu(e, t, n = !1) {
		let r = e.querySelector(`:scope > .${SD}`);
		if (r === null) return;
		let i = OD(e), a = i.find((e) => e.getAttribute("aria-checked") === "true") ?? null;
		fD(this.menus, {
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
				kind: hi.SetLanguage,
				language: t
			},
			dom: this.options.dom
		});
	}
	showLanguage(e) {
		for (let t of this.root.querySelectorAll(_D)) {
			let n = t.querySelector(`:scope > .${vD}`);
			if (n === null) continue;
			let r = OD(t);
			for (let t of r) t.setAttribute("aria-checked", t.getAttribute("data-ui-language") === e ? "true" : "false");
			for (let t of n.querySelectorAll(`.${yD}`)) {
				let n = t.getAttribute(yr) === e;
				t.classList.toggle(bD, n), t.classList.contains(xD) && t.toggleAttribute("hidden", !n);
			}
			let i = t.getAttribute(Re) === n.getAttribute("aria-label"), a = (r.find((t) => t.getAttribute("data-ui-language") !== e) ?? r[0]).getAttribute("data-ui-language") ?? "", [o, s] = r.length === 2 ? [TD, {
				language: kD(r, e),
				code: AD(e),
				other: kD(r, a),
				otherCode: AD(a)
			}] : [ED, {
				language: kD(r, e),
				code: AD(e)
			}];
			T.write(n, "aria-label", o, s), i && T.write(t, Re, o, s);
		}
	}
};
function OD(e) {
	return [...e.querySelectorAll(`:scope > .${SD} > .${CD}`)];
}
function kD(e, t) {
	let n = e.find((e) => e.getAttribute(yr) === t)?.textContent;
	if (n != null && n.length > 0) return n;
	try {
		let e = new Intl.DisplayNames([t], { type: "language" }).of(t) ?? t;
		return e.charAt(0).toLocaleUpperCase(t) + e.slice(1);
	} catch {
		return AD(t);
	}
}
function AD(e) {
	return e.split("-")[0].toUpperCase();
}
//#endregion
//#region src/interactions/action-bar.ts
var jD = `${Me}__button`, MD = `${Me}__more`, ND = `${jD}--icon`, PD = "ui-text__icon", FD = `.ui-button__content .${PD}`, ID = ".ui-button__content .ui-text__title", LD = /* @__PURE__ */ new WeakMap();
function RD(e) {
	let t = [], n = !1;
	for (let r of e.querySelectorAll(vn)) zD(r, e) && (r.hasAttribute("data-ui-in-action-bar") && !r.matches(_n) ? t.push(r) : n = !0);
	return {
		entries: t,
		more: n
	};
}
function zD(e, t) {
	for (let n = e; n !== null && n !== t; n = n.parentElement) if (!n.hasAttribute("data-ui-menu-left-out") && getComputedStyle(n).display === "none") return !1;
	return getComputedStyle(e).visibility !== "hidden";
}
function BD(e, t) {
	let n = t.entries.map((e) => VD(e, t));
	return t.more && t.openMore !== void 0 && n.push(UD(t.openMore)), e.replaceChildren(...n), n;
}
function VD(e, t) {
	let n = WD(jD), r = KD(e), i = HD(e);
	return i === null ? n.textContent = r : (n.classList.add(ND), n.append(i), n.setAttribute("aria-label", r)), t.role === "menuitem" && n.setAttribute("role", "menuitem"), E(e) && (n.classList.add(Br), n.setAttribute("aria-disabled", "true")), e.getAttribute("data-ui-menu-item-kind") === "check" && n.setAttribute("aria-pressed", e.getAttribute("aria-checked") === "true" ? "true" : "false"), LD.set(n, e), n.addEventListener("click", () => t.press(e, n)), n;
}
function HD(e) {
	let t = e.querySelector(FD);
	if (t === null || !t.className.split(" ").some(t_)) return null;
	let n = document.createElement("span");
	n.className = t.className, n.classList.remove(PD), n.setAttribute(Zg, ""), n.setAttribute("aria-hidden", "true");
	let r = t.style.getPropertyValue(Qg);
	return r.length > 0 && n.style.setProperty(Qg, r), n;
}
function UD(e) {
	let t = WD(`${jD} ${MD}`);
	return t.setAttribute("aria-haspopup", "menu"), T.write(t, "aria-label", "ui.actionbar.more"), t.addEventListener("click", () => e(t)), t;
}
function WD(e) {
	let t = document.createElement("button");
	return t.setAttribute("type", "button"), t.className = `${e} ${$r}`, t.tabIndex = -1, t;
}
function GD(e) {
	return LD.get(e) ?? null;
}
function KD(e) {
	return e.querySelector(ID)?.textContent?.trim() ?? "";
}
//#endregion
//#region src/interactions/long-press.ts
var qD = 500, JD = 10, YD = /* @__PURE__ */ new WeakSet();
function XD(e) {
	return YD.has(e);
}
var ZD = class {
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
			timer: setTimeout(() => this.fireHeld(), qD)
		};
	}
	handleMove(e) {
		let t = e, n = this.press, r = this.openedAt;
		r !== null && t.pointerId === r.pointerId && Math.hypot((t.clientX ?? r.x) - r.x, (t.clientY ?? r.y) - r.y) > JD && (this.slid = !0, (this.answered?.closest("[data-ui-splitting]") ?? null) !== null && this.leaveMenuToDrag()), n !== null && t.pointerId === n.pointerId && Math.hypot((t.clientX ?? n.x) - n.x, (t.clientY ?? n.y) - n.y) > JD && this.cancel();
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
		YD.add(t), e.target.dispatchEvent(t), this.answered = t.defaultPrevented ? e.target : null, this.openedAt = this.answered === null ? null : {
			pointerId: e.pointerId,
			x: e.x,
			y: e.y
		};
	}
	handleContextMenu(e) {
		if (!YD.has(e)) {
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
		!this.dragging || n === null || t.clientX === void 0 || t.clientY === void 0 || Math.hypot(t.clientX - n.x, t.clientY - n.y) > JD && this.leaveMenuToDrag();
	}
	endDrag() {
		this.dragging = !1;
	}
	handleClick(e) {
		let t = e.target instanceof Element ? e.target : null;
		this.answered === null || t === null || this.slid && t.closest("[data-ui-context-menu]") !== null || (this.answered = null, e.preventDefault(), e.stopImmediatePropagation());
	}
}, QD = [
	Ef("md"),
	Ef("xl"),
	Ef("xxl")
], $D = {
	md: Ef("md"),
	xl: Ef("xl"),
	xxl: Ef("xxl")
}, eO = Ef("md");
function tO(e, t) {
	return nO(e) && !(e.hasAttribute(an(t)) && !iO(e, t) && rO(eO));
}
function nO(e) {
	let t = e.getAttribute(nn);
	if (t === null) return !1;
	let n = $D[t];
	return n === void 0 || !rO(n);
}
function rO(e) {
	return typeof matchMedia == "function" && matchMedia(e).matches;
}
function iO(e, t) {
	return e.querySelector(`:scope > [${ln}="${x(t)}"][${on}]`) !== null;
}
//#endregion
//#region src/state/client-store.ts
var aO = "ne.ui", oO = "boot", sO = /* @__PURE__ */ new Set(), cO = class {
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
		let r = this.resolveKey(e, oO);
		if (r !== null) try {
			let e = lO(window.localStorage.getItem(r));
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
		let n = e.getAttribute(Ke);
		if (n === null || n.length === 0) {
			let n = `${e.tagName}:${t}`;
			return sO.has(n) || (sO.add(n), l("client state is not kept for a component with no authored id.", {
				slot: t,
				component: e
			})), null;
		}
		return `${aO}:${n}:${t}`;
	}
};
function lO(e) {
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
var uO = "menu-current", dO = `[${Vt}]`;
function fO(e) {
	for (let t = e.closest(dO); t !== null; t = t.parentElement?.closest(dO) ?? null) mO(t);
}
function pO(e) {
	for (let t of e.querySelectorAll(dO)) mO(t);
	fO(e);
}
function mO(e) {
	let t = e.querySelector(`.${pn}`) !== null;
	e.hasAttribute("data-ui-menu-holds-current") !== t && e.toggleAttribute(Wt, t);
}
//#endregion
//#region src/updates/menu-icons.ts
var hO = "menu-icons", gO = "ui-menu__host", _O = `:scope > :not([${Kt}]) > .${y}[${ri}]`;
function vO(e) {
	let t = e.closest(`.${gO}`);
	t !== null && bO(t);
}
function yO(e) {
	for (let t of e.querySelectorAll(`.${gO}`)) bO(t);
}
function bO(e) {
	let t = e.querySelector(_O) !== null;
	e.hasAttribute("data-ui-menu-icons") !== t && e.toggleAttribute(Gt, t);
}
//#endregion
//#region src/interactions/menu-group-engine.ts
var xO = "ui-menu__submenu", SO = Vt, CO = Ut, wO = "data-ui-menu-flyout", TO = `[${wO}], ${Kr}`, EO = "data-ui-menu-unfolded", DO = Ht, OO = "data-ui-menu-rail-list", kO = "left-side", AO = "[data-ui-root]", jO = "menu-open-group", MO = L.normal * 5, NO = Xe("click"), PO = class {
	root;
	store = new cO();
	seenCollapsed = /* @__PURE__ */ new WeakMap();
	flyouts = new Km({
		show: ({ owner: e, popup: t }) => {
			e.setAttribute(CO, ""), t.setAttribute(wO, "");
		},
		hide: ({ owner: e, popup: t }) => {
			e.removeAttribute(CO), queueMicrotask(() => Cf(t, MO, () => {
				this.flyouts.isOpen(e) || t.removeAttribute(wO);
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
		let t = this.root.querySelectorAll(`.${dn}`);
		zO(t), this.reconcileEach(t);
		for (let e of t) pO(e), yO(e);
		R(this.root, `.${dn}`, {
			childList: !0,
			attributeFilter: [Bt]
		}, (e) => {
			zO(e), this.reconcileEach(e);
			for (let t of e) pO(t), yO(t);
		});
		for (let e of this.root.querySelectorAll(`[${SO}]`)) FO(e);
		if (R(this.root, `[${SO}]`, {
			childList: !0,
			attributeFilter: [CO]
		}, (e) => {
			for (let t of e) FO(t);
		}), typeof matchMedia == "function") for (let e of QD) matchMedia(e).addEventListener("change", () => {
			this.closeBarFlyout(), this.refitDrawerRails();
		});
		R(this.root, AO, { attributeFilter: [an(kO)] }, () => this.refitDrawerRails());
	}
	refitDrawerRails() {
		let e = this.root.querySelectorAll(`[${sn}] .${dn}`);
		zO(e), this.reconcileEach(e);
	}
	closeBarFlyout() {
		let e = this.flyouts.current;
		e !== null && e.closest("[data-ui-bottom-bar]") !== null && this.flyouts.close(e);
	}
	reconcileEach(e) {
		for (let t of e) {
			let e = GO(t), n = this.seenCollapsed.get(t);
			n !== e && (this.seenCollapsed.set(t, e), n === void 0 ? this.restore(t, e) : this.handleCollapsedChange(t, e));
		}
	}
	restore(e, t) {
		t ? this.closeGroups(e) : this.openResolvedGroup(e);
	}
	handleCollapsedChange(e, t) {
		this.flyouts.close(), IO(e), this.closeGroups(e), e.hasAttribute("data-ui-folding") && e.setAttribute(EO, ""), t || this.openResolvedGroup(e);
		for (let t of e.querySelectorAll(`[${SO}]`)) FO(t);
	}
	openResolvedGroup(e) {
		let t = this.groupOf(e.querySelector(`.${pn}`), e);
		if (t !== null && !t.hasAttribute(DO)) {
			this.openInline(t);
			return;
		}
		let n = e.classList.contains("ui-menu--nested") ? null : this.store.read(e, jO), r = n === null ? null : this.findGroup(e, n);
		r !== null && this.openInline(r);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${y}`), n = this.flyouts.current, r = n === null ? null : this.submenuOf(n);
		if (t !== null && r !== null && r.contains(t)) {
			BO(t) && this.flyouts.close();
			return;
		}
		let i = t === null ? null : this.ownGroupOf(t);
		if (t === null || i === null) {
			this.flyouts.close();
			return;
		}
		e.preventDefault();
		let a = i.closest(`.${dn}`);
		a !== null && (WO(i) ? this.toggleFlyout(a, i, t) : this.toggleInline(a, i));
	}
	toggleInline(e, t) {
		let n = e.classList.contains(hn);
		if (e.setAttribute(EO, ""), t.closest("[data-ui-menu-searching]") !== null) {
			t.toggleAttribute(CO);
			return;
		}
		if (t.hasAttribute(CO)) {
			t.removeAttribute(CO), n || this.store.write(e, jO, null);
			return;
		}
		this.closeGroups(e), this.openInline(t), n || this.store.write(e, jO, t.getAttribute(_));
	}
	openInline(e) {
		e.setAttribute(CO, "");
	}
	closeGroups(e) {
		for (let t of e.querySelectorAll(`[${SO}][${CO}]`)) t.hasAttribute(DO) || t.removeAttribute(CO);
	}
	toggleFlyout(e, t, n) {
		let r = this.submenuOf(t);
		if (r === null) return;
		let i = this.flyouts.isOpen(t);
		if (this.flyouts.close(), i) return;
		IO(e), this.closeGroups(e);
		let a = n.closest(TO) ?? void 0;
		if (!this.flyouts.open({
			owner: t,
			popup: r,
			anchor: n,
			placement: {
				placement: `${LO(e)}-start`,
				surface: a,
				alignEntries: !0
			}
		})) return;
		let o = r.querySelector(`:scope > .${dn}`);
		o !== null && !Yu() && _d(o, VO(o));
	}
	findGroup(e, t) {
		for (let n of e.querySelectorAll(`[${SO}]`)) if (n.getAttribute("data-ui-key") === t) return n;
		return null;
	}
	ownGroupOf(e) {
		return e.matches(_n) ? e.parentElement : null;
	}
	groupOf(e, t) {
		let n = e?.closest(`[${SO}]`) ?? null;
		return n !== null && t.contains(n) ? n : null;
	}
	submenuOf(e) {
		return e.querySelector(`:scope > .${xO}`);
	}
};
function FO(e) {
	let t = e.querySelector(`:scope > .${y}`);
	t !== null && (t.setAttribute(NO, ""), t.setAttribute(Ze, ""), t.setAttribute("aria-expanded", e.hasAttribute(CO) ? "true" : "false"), WO(e) ? t.setAttribute("aria-haspopup", "menu") : t.removeAttribute("aria-haspopup"));
}
function IO(e) {
	for (let t of e.querySelectorAll(`[${wO}]`)) t.removeAttribute(wO);
}
function LO(e) {
	return RO(e) ? "top" : e.classList.contains("ui-side--right") ? "left" : e.classList.contains("ui-side--top") ? "bottom" : e.classList.contains("ui-side--bottom") ? "top" : "right";
}
function RO(e) {
	let t = e.closest(`[${on}]`);
	return e.classList.contains("ui-menu--rail") && t?.parentElement !== null && t?.parentElement !== void 0 && typeof matchMedia == "function" && tO(t.parentElement, kO);
}
function zO(e) {
	for (let t of e) {
		let e = t.closest(`[${sn}]`);
		if (!t.classList.contains("ui-menu--rail") && !t.hasAttribute(OO) || e?.parentElement === null || e?.parentElement === void 0) continue;
		let n = typeof matchMedia == "function" && tO(e.parentElement, kO);
		t.classList.toggle(mn, !n), t.toggleAttribute(OO, n);
	}
}
function BO(e) {
	let t = e.closest(`.${y}`);
	return t !== null && t.matches(vn) && !t.matches(yn) && !E(t);
}
function VO(e) {
	let t = [];
	for (let n of rl(e)) {
		t.push(n);
		let e = n.matches(_n) ? n.parentElement : null, r = e === null || !e.hasAttribute(CO) || WO(e) ? null : e.querySelector(`:scope > .${xO} > .${dn}`);
		r !== null && t.push(...VO(r));
	}
	return t;
}
function HO(e) {
	let t = UO(e), n = t?.closest(".ui-menu") ?? null;
	return t === null || n === null || WO(t) ? e : HO(n);
}
function UO(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(xO) && t.parentElement?.hasAttribute(SO) === !0 ? t.parentElement : null;
}
function WO(e) {
	let t = e.closest(`.${dn}`);
	return e.hasAttribute(DO) || t !== null && GO(t);
}
function GO(e) {
	return e.hasAttribute("data-ui-collapsed") || e.classList.contains("ui-menu--rail");
}
var KO = "tabs:rename", qO = "tabs:pin", JO = "tabs:unpin", YO = "tabs:close", XO = "tabs:delete";
function ZO(e) {
	let t = (e ?? "").split(/\s+/);
	return {
		rename: t.includes("rename"),
		pin: t.includes("pin"),
		close: t.includes("close"),
		delete: t.includes("delete")
	};
}
function QO(e, t) {
	let n = !t.pinned && t.removable;
	return /* @__PURE__ */ new Map([
		[KO, e.rename && t.renamable],
		[qO, e.pin && !t.pinned],
		[JO, e.pin && t.pinned],
		[YO, e.close && !e.delete && n],
		[XO, e.delete && n]
	]);
}
function $O(e) {
	let t = e.map(() => !1), n = !1, r = -1;
	for (let i = 0; i < e.length; i++) e[i] === "rule" ? n && r === -1 && (r = i) : e[i] === "shown" && (r !== -1 && (t[r] = !0), r = -1, n = !0);
	return t;
}
//#endregion
//#region src/interactions/context-menu-engine.ts
var ek = we, tk = "ui-context-menu--open", nk = `${Me}--strip`, rk = `.${Me}:not(.${nk}) > .${MD}`, ik = "ui-context-menu-opening", ak = class {
	root;
	components;
	closed = null;
	menus = new Km({
		show: ({ popup: e }) => e.classList.add(tk),
		hide: ({ popup: e }, t) => {
			e.classList.remove(tk), this.closed = e, t === "outside" && xk();
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e),
		onPress: !0,
		onWindowBlur: !0,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, new ZD({
			root: this.root,
			first: typeof window > "u" ? void 0 : window,
			opensMenu: (e) => e.closest("[data-ui-context-menu-owner]") !== null && !bc(e),
			closeMenu: () => this.menus.close(this.menus.current, "outside")
		}), this.root.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), this.root.addEventListener("click", (e) => this.handleInside(e), !1);
	}
	get openMenu() {
		let e = this.menus.current;
		return e === null ? null : this.menus.popupOf(e);
	}
	handleContextMenu(e) {
		if (!(e instanceof MouseEvent) || !(e.target instanceof Element)) return;
		let t = !Yu() && !XD(e), n = (t ? ck() : null) ?? e.target;
		if (this.openMenu !== null && e.composedPath().includes(this.openMenu)) {
			e.preventDefault();
			return;
		}
		let r = ok(n);
		r !== null && (e.preventDefault(), this.open(r.owner, r.menu, e.clientX, e.clientY, mk(e) ? n : null, n.closest(rk), t ? lk(n) : null));
	}
	open(e, t, n, r, i, a, o) {
		this.menus.close(), t.querySelector(`:scope > .${nk}`)?.remove(), hk(t), i !== null && gk(e, t, i), a?.closest("[data-ui-action-bar]")?.hasAttribute("data-ui-action-bar-rest") === !0 && vk(t), this.closed !== null && (Sf(this.closed), this.closed = null);
		let s = (document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null) ?? Ju(), c = a ?? o, l = {
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
			returnFocus: () => (s === null ? null : vd(s, this.components)) ?? vd(e, this.components)
		}) && (c === null && Ap(t, n, r), bk(t));
	}
	handleInside(e) {
		this.openMenu === null || !e.composedPath().includes(this.openMenu) || e.target instanceof Element && BO(e.target) && this.menus.close();
	}
};
function ok(e) {
	let t = e.closest(`[${fe}]`);
	for (let n = e.closest(`[${Te}]`); n !== null; n = n.parentElement?.closest("[data-ui-context-menu-owner]") ?? null) {
		if (t !== null && n.contains(t)) return null;
		let r = dk(n, e);
		if (r.length === 0 || E(n)) continue;
		if (Ck(n)) return null;
		let i = r.find((t) => fk(t, e, !1));
		if (i !== void 0) return {
			owner: n,
			menu: i
		};
	}
	return null;
}
var sk = `[${Te}]`;
function ck() {
	let e = document.activeElement;
	if (e === null || e === document.body) return null;
	let t = Ul(e);
	if (t === null || t.row !== null && t.row !== e) return e;
	let n = t.row ?? Yl(t.root);
	return n === null ? t.root : uk(n);
}
function lk(e) {
	let t = e.closest(sl);
	return t === null ? e : P(t) ?? t;
}
function uk(e) {
	if (e.matches(sk)) return e;
	for (let t of e.querySelectorAll(sk)) if (t.closest(sl) === e) return t;
	return e;
}
function dk(e, t) {
	let n = t.closest(`[${Ee}]`), r = n !== null && e.contains(n) ? n.getAttribute("data-ui-context-menu-use") ?? "" : "";
	return [r.length > 0 ? Sk(e, r) : null, Sk(e, "")].filter((e) => e !== null);
}
function fk(e, t, n) {
	let r = new CustomEvent(ik, {
		bubbles: !0,
		cancelable: !0,
		detail: {
			target: t,
			actionBar: n
		}
	});
	return e.dispatchEvent(r);
}
function pk(e, t) {
	let n = e.closest(`[${Te}]`), r = e.closest(`[${fe}]`);
	return n === null || E(n) || Ck(n) || r !== null && n.contains(r) ? null : dk(n, e).find((n) => fk(n, e, t)) ?? null;
}
function mk(e) {
	let t = e.pointerType;
	return XD(e) ? !0 : typeof t == "string" && t.length > 0 ? t === "touch" : Xu();
}
function hk(e) {
	for (let t of e.querySelectorAll(`[${Ae}]`)) t.removeAttribute(Ae);
}
function gk(e, t, n) {
	let r = n.closest(`[${De}]`);
	if (r === null || n.closest(".ui-action-bar") !== null || !e.contains(r) || !dk(e, r).includes(t)) return;
	let { entries: i } = RD(t);
	if (i.length === 0) return;
	let a = document.createElement("div");
	a.className = `${Me} ${nk}`, a.setAttribute("role", "group"), BD(a, {
		entries: i,
		more: !1,
		role: "menuitem",
		press: _k
	}), t.insertBefore(a, t.firstElementChild);
}
function _k(e) {
	E(e) || e.click();
}
function vk(e) {
	let { entries: t } = RD(e), n = e.querySelector(`.${dn}`);
	if (t.length === 0 || n === null) return;
	for (let e of t) yk(e);
	let r = nl(n, `.${y}`, `.${dn}`).filter((t) => t.closest("[data-ui-menu-left-out]") === null && zD(t, e)), i = [];
	for (let [e, t] of r.entries()) {
		let n = r[e + 1];
		t.getAttribute("data-ui-menu-item-kind") === "header" && (n === void 0 || n.matches(gn)) ? yk(t) : i.push(t);
	}
	let a = i.map((e) => {
		let t = e.getAttribute(un);
		return t === "separator" ? "rule" : t === "header" ? "hidden" : "shown";
	});
	$O(a).forEach((e, t) => {
		a[t] === "rule" && !e && yk(i[t]);
	});
}
function yk(e) {
	let t = e.parentElement;
	(t !== null && t.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t : e).setAttribute(Ae, "");
}
function bk(e) {
	let t = e.querySelector(`.${dn}`);
	t !== null && _d(e, VO(t));
}
function xk() {
	let e = (e) => {
		e.target instanceof Element && e.target.closest(`${Fu}, [contenteditable='true']`) === null && e.preventDefault();
	};
	document.addEventListener("mousedown", e, {
		capture: !0,
		once: !0
	}), setTimeout(() => document.removeEventListener("mousedown", e, !0));
}
function Sk(e, t) {
	for (let n of e.querySelectorAll(`[${ek}]`)) if ((n.getAttribute(ek) ?? "") === t && n.closest("[data-ui-context-menu-owner]") === e) return n;
	return null;
}
function Ck(e) {
	if (e.hasAttribute("data-ui-no-context-menu")) return !0;
	let t = e.closest(`[${v}]`);
	if (t === null) return !1;
	let n = e;
	for (; n.parentElement !== null && n.parentElement !== t;) n = n.parentElement;
	return qo(n, "data-ui-no-context-menu") || t.closest(b)?.hasAttribute("data-ui-no-context-menu") === !0;
}
//#endregion
//#region src/interactions/element-visibility.ts
function wk(e, t) {
	let n = getComputedStyle(e), r = t ? n.overflowY : n.overflowX;
	return r === "auto" || r === "scroll";
}
function Tk(e) {
	return getComputedStyle(e).display !== "none";
}
function Ek(e) {
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
				if (e.overflowX !== "visible" && kk(n, i, i + t.clientWidth, !0), e.overflowY !== "visible" && kk(n, a, a + t.clientHeight, !1), Ak(n)) return !0;
			}
			r = e.position;
		}
	}
	return kk(n, 0, window.innerWidth, !0), kk(n, 0, window.innerHeight, !1), Ak(n);
}
function Dk(e) {
	let t = getComputedStyle(e).position;
	for (let n = e.parentElement; n !== null && t !== "fixed"; n = n.parentElement) {
		let e = getComputedStyle(n);
		if (t !== "absolute" || e.position !== "static" || e.transform !== "none") {
			if (!(n.classList.contains("ui-scroll-y--disabled") && !wk(n, !1)) && (Ok(e.overflowX) || Ok(e.overflowY))) return n;
			t = e.position;
		}
	}
	return null;
}
function Ok(e) {
	return e === "hidden" || e === "auto" || e === "scroll";
}
function kk(e, t, n, r) {
	r ? (e.left = Math.max(e.left, t), e.right = Math.min(e.right, n)) : (e.top = Math.max(e.top, t), e.bottom = Math.min(e.bottom, n));
}
function Ak(e) {
	return e.left > e.right || e.top > e.bottom;
}
//#endregion
//#region src/interactions/action-bar-engine.ts
var jk = `[${De}]`, Mk = `.${Me}`, Nk = `${Me}--out`, Pk = `.ui-items-view__item, .${Nn}`, Fk = "ui-tree__node", Ik = 6, Lk = "--ui-action-bar-gap", Rk = 400, zk = /* @__PURE__ */ new WeakMap(), Bk = [
	"class",
	"style",
	"hidden",
	"aria-disabled",
	"aria-checked",
	je,
	...Lr
], Vk = class {
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
		if (n === null || n.closest(`${Mk}, [data-ui-context-menu]`) !== null) return;
		let r = Hk(n);
		if (t.pointerType === "touch") {
			this.pendingTap = {
				pointerId: t.pointerId ?? 0,
				host: r,
				identity: r === null ? null : Gk(r)
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
			let e = t.host !== null && !t.host.isConnected && t.identity !== null ? Kk(t.identity) : t.host;
			e !== null && e === this.chosen ? this.askAgain(e) : this.choose(e);
		}
		this.chosen !== null && this.chosen.isConnected && !this.shown.has(this.chosen) && this.sync();
	}
	handleContextMenu(e) {
		this.pendingTap = null, e instanceof MouseEvent && e.target instanceof Element && e.target.closest(Mk) === null && mk(e) && this.choose(null);
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement ? e.target : null;
		if (t === null) return;
		let n = t.closest(Mk);
		if (n !== null) {
			this.isHostedBar(n) && j(eA(n), t);
			return;
		}
		Yu() || this.isInOpenMenu(t) || this.menuHost !== null && t.contains(this.menuHost) || this.choose(Uk(t));
	}
	handleFocusOut(e) {
		let t = e.relatedTarget, n = t instanceof Element ? t.closest(Mk) : null;
		n !== null && this.isHostedBar(n) && e.target instanceof HTMLElement && !n.contains(e.target) && (this.cameFrom = e.target);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || !(e.target instanceof HTMLElement)) return;
		let t = e.target;
		if (e.defaultPrevented) {
			t.matches(N) && this.choose(Uk(t));
			return;
		}
		let n = t.closest(Mk);
		if (n !== null && t.classList.contains(jD)) {
			this.handleBarKey(e, n, t);
			return;
		}
		if (e.key === "Escape") {
			if (uc(e)) return;
			let n = t.closest(Vp);
			(n === null || this.chosen !== null && n.contains(this.chosen)) && (this.chosen !== null && e.preventDefault(), this.choose(null));
			return;
		}
		if (e.key === "Tab" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey && t.matches(N)) {
			let n = this.chosen === null ? null : this.tabStopOf(this.chosen);
			n !== null && t.contains(n) && (e.preventDefault(), n.focus());
			return;
		}
		t.matches(N) && this.choose(Uk(t));
	}
	handleBarKey(e, t, n) {
		if (e.ctrlKey || e.altKey || e.metaKey) return;
		if (e.key === "Escape") {
			if (!this.isHostedBar(t)) return;
			let n = this.hostOfBar(t), r = this.cameFrom !== null && this.cameFrom.isConnected && iA(this.cameFrom) && n !== null && (n.contains(this.cameFrom) || this.cameFrom.contains(n)) ? this.cameFrom : vd(n, this.components);
			e.preventDefault(), r?.focus();
			return;
		}
		let r = eA(t), i = Pc({
			key: e.key,
			items: r,
			current: n,
			axis: "horizontal"
		});
		i !== null && (e.preventDefault(), Lc(r, i));
	}
	choose(e) {
		(e === null ? this.chosen === null && this.identity === null : e === this.chosen) || (this.chosen = e, this.identity = e === null ? null : Gk(e), this.watchScope(), this.sync(), e !== null && this.makeRoomAbove(e));
	}
	makeRoomAbove(e) {
		let t = this.shown.get(e), n = Dk(e);
		if (t === void 0 || n === null || !wk(n, !0)) return;
		let r = Math.max(0, n.getBoundingClientRect().top + n.clientTop), i = Math.ceil(t.bar.getBoundingClientRect().height + Jk(e) - (e.getBoundingClientRect().top - r));
		i <= 0 || i > n.scrollTop || (n.scrollTop -= i, np(t.bar), this.markOut());
	}
	askAgain(e) {
		let t = this.shown.get(e);
		if (t === void 0) {
			this.sync();
			return;
		}
		pk(e, !0) === null && this.hide(e, t);
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
				this.chosen = Kk(e), this.sync();
			}
			for (let e of this.shown.values()) np(e.bar);
			this.markOut();
		}
	}
	sync() {
		for (let [e, t] of this.shown) (e !== this.chosen && e !== this.menuHost || !e.isConnected) && this.hide(e, t);
		for (let e of [this.chosen, this.menuHost]) e !== null && e.isConnected && !this.shown.has(e) && this.show(e);
	}
	show(e) {
		let t = pk(e, !0);
		if (t === null) return;
		let n = document.createElement("div");
		if (n.className = Me, n.setAttribute("role", "toolbar"), T.write(n, "aria-label", "ui.actionbar.label"), n.setAttribute(Ze, ""), n.setAttribute(me, ""), !Xk(n, t, (t) => this.openMore(e, t), !1)) return;
		e.insertBefore(n, $k(e)), Gf(e, n, {
			placement: qk(e),
			gap: Jk(e),
			boundary: Dk(e) ?? void 0
		}), n.classList.toggle(Nk, Ek(e));
		let r = new MutationObserver(() => this.redraw(e));
		r.observe(t, {
			subtree: !0,
			childList: !0,
			characterData: !0,
			attributes: !0,
			attributeFilter: Bk
		});
		let i = Yk(e);
		i?.setAttribute(lr, ""), this.shown.set(e, {
			bar: n,
			menu: t,
			observer: r,
			row: i
		}), zk.set(n, Date.now());
	}
	redraw(e) {
		let t = this.shown.get(e);
		if (t === void 0) return;
		let n = document.activeElement, r = n instanceof HTMLElement && t.bar.contains(n) ? n : null, i = r === null ? null : GD(r);
		if (!Xk(t.bar, t.menu, (t) => this.openMore(e, t), e === this.menuHost)) {
			this.hide(e, t);
			return;
		}
		if (r === null) return;
		let a = eA(t.bar);
		Lc(a, a.find((e) => GD(e) === i) ?? a.find(M) ?? null);
	}
	openMore(e, t) {
		let n = this.shown.get(e);
		if (n === void 0 || nA(t)) return;
		if (this.menuHost = e, rA(t), !n.menu.classList.contains("ui-context-menu--open")) {
			this.menuHost = null;
			return;
		}
		Zk(n.bar, !0);
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
		Zk(t.bar, !1);
		let n = document.activeElement;
		!Yu() && (n === null || n === document.body || e.contains(n) || n.contains(e)) && Qk(t.bar)?.focus();
	}
	hide(e, t) {
		t.observer.disconnect(), rp(t.bar), t.bar.remove(), this.shown.delete(e), t.row !== null && ![...this.shown.values()].some((e) => e.row === t.row) && t.row.removeAttribute(lr);
	}
	markOut() {
		for (let [e, t] of this.shown) t.bar.classList.toggle(Nk, Ek(e));
	}
	isInOpenMenu(e) {
		for (let t of this.shown.values()) if (t.menu.classList.contains("ui-context-menu--open") && t.menu.contains(e)) return !0;
		return !1;
	}
	tabStopOf(e) {
		let t = this.shown.get(e);
		return t === void 0 ? null : eA(t.bar).find((e) => e.tabIndex === 0) ?? null;
	}
	isHostedBar(e) {
		return this.hostOfBar(e) !== null;
	}
	hostOfBar(e) {
		for (let [t, n] of this.shown) if (n.bar === e) return t;
		return null;
	}
};
function Hk(e) {
	let t = e.closest(jk);
	if (t !== null) return t;
	let n = e.closest(`[${_}]`), r = e.closest(b);
	return n === null || r !== null && !r.contains(n) ? null : Wk(n)[0] ?? null;
}
function Uk(e) {
	if (e instanceof HTMLElement && e.matches(N)) {
		let t = Yl(e), n = t === null ? void 0 : Wk(t)[0];
		if (n !== void 0) return n;
	}
	return e.closest(jk);
}
function Wk(e) {
	let t = [...e.querySelectorAll(jk)];
	return e.matches(jk) ? [e, ...t] : t;
}
function Gk(e) {
	let t = e.getAttribute(Oe);
	if (t !== null && e.parentElement !== null) return {
		scope: e.parentElement,
		attribute: Oe,
		key: t,
		index: 0
	};
	let n = e.closest(`[${_}]`), r = n?.getAttribute("data-ui-key") ?? null;
	return n === null || r === null || n.parentElement === null ? null : {
		scope: n.parentElement,
		attribute: _,
		key: r,
		index: Wk(n).indexOf(e)
	};
}
function Kk(e) {
	for (let t of e.scope.children) if (t.getAttribute(e.attribute) === e.key) return Wk(t)[e.index] ?? null;
	return null;
}
function qk(e) {
	let t = e.getAttribute(De);
	if (t === "center") return "top";
	let n = getComputedStyle(e).direction === "rtl";
	return t === "start" === n ? "top-end" : "top-start";
}
function Jk(e) {
	let t = Number.parseFloat(getComputedStyle(e).getPropertyValue(Lk));
	return Number.isFinite(t) ? t : Ik;
}
function Yk(e) {
	if (e.classList.contains("ui-table__row")) return e;
	let t = e.parentElement;
	if (t === null) return null;
	if (t.matches(Pk)) return t;
	let n = t.parentElement;
	return t.classList.contains(Fk) && n !== null && n.classList.contains("ui-tree__row") ? n : null;
}
function Xk(e, t, n, r) {
	let { entries: i, more: a } = RD(t);
	if (i.length === 0 && !a) return !1;
	let o = BD(e, {
		entries: i,
		more: a,
		role: "button",
		press: tA,
		openMore: n
	});
	return j(o, o.find((e) => !E(e)) ?? o[0] ?? null), Zk(e, r), !0;
}
function Zk(e, t) {
	Qk(e)?.setAttribute("aria-expanded", t ? "true" : "false");
}
function Qk(e) {
	return eA(e).find((e) => GD(e) === null) ?? null;
}
function $k(e) {
	for (let t of e.children) if (t.hasAttribute("data-ui-context-menu")) return t;
	return null;
}
function eA(e) {
	return [...e.querySelectorAll(`:scope > .${jD}`)];
}
function tA(e, t) {
	if (E(t) || nA(t)) return;
	let n = pk(t, !1);
	n === null || !n.contains(e) || E(e) || !zD(e, n) || e.click();
}
function nA(e) {
	let t = e.closest(Mk), n = t === null ? void 0 : zk.get(t);
	return n !== void 0 && Xu() && Date.now() - n < Rk;
}
function rA(e) {
	let t = e.getBoundingClientRect();
	e.dispatchEvent(new MouseEvent("contextmenu", {
		bubbles: !0,
		cancelable: !0,
		button: 2,
		clientX: t.left,
		clientY: t.bottom
	}));
}
function iA(e) {
	return e.matches(Fu) || e.hasAttribute("tabindex");
}
//#endregion
//#region src/rendering/inline-markup.ts
var aA = {
	None: 0,
	Bold: 1,
	Italic: 2,
	Underline: 4,
	Strikethrough: 8,
	Code: 16
}, oA = "\\", sA = "`", cA = "!", lA = "{", uA = "}", dA = "ui-text__fold", fA = "ui-text__fold-toggle", pA = "ui-text__fold-content", mA = 8;
function hA(e) {
	if (e == null || e.length === 0) return [];
	let t = [], n = { value: "" };
	return DA(new IA(e), 0, e.length, aA.None, null, t, n), OA(t, n, aA.None, null), t;
}
function gA(e) {
	return hA(e).map((e) => xA(e) ? `${e.fold} ${gA(e.text)}` : e.text).join("");
}
function _A(e) {
	let t = "";
	for (let n of e) t += zA(n) ? oA + n : n;
	return t;
}
function vA(e, t, n = {}) {
	let r = hA(t), i = r.some(xA);
	if (e.hasAttribute("data-ui-folds") !== i && e.toggleAttribute(Ge, i), r.length === 0) {
		e.textContent = "";
		return;
	}
	if (r.length === 1 && yA(r[0])) {
		e.textContent = r[0].text;
		return;
	}
	e.replaceChildren(SA(r, n));
}
function yA(e) {
	return e.styles === aA.None && e.url === null && !bA(e) && !xA(e);
}
function bA(e) {
	return e.icon !== null && e.icon !== void 0 && e.icon.length > 0;
}
function xA(e) {
	return e.fold !== null && e.fold !== void 0;
}
function SA(e, t) {
	let n = document.createDocumentFragment();
	for (let r of e) n.append(CA(r, t));
	return n;
}
function CA(e, t) {
	if (bA(e)) return TA(e.icon);
	let n = xA(e) ? wA(e, t) : document.createTextNode(e.text);
	if ((e.styles & aA.Code) !== 0) {
		let e = document.createElement("code");
		e.className = "ui-text__code", e.append(n), n = e;
	}
	if ((e.styles & aA.Strikethrough) !== 0 && (n = EA("s", n)), (e.styles & aA.Underline) !== 0 && (n = EA("u", n)), (e.styles & aA.Italic) !== 0 && (n = EA("em", n)), (e.styles & aA.Bold) !== 0 && (n = EA("strong", n)), e.url !== null) {
		let t = document.createElement("a");
		t.setAttribute("href", e.url), t.className = "ui-text__link", Ig(e.url) && (t.setAttribute("target", "_blank"), t.setAttribute("rel", "noopener noreferrer")), t.append(n), n = t;
	}
	return n;
}
function wA(e, t) {
	let n = document.createElement("span"), r = document.createElement(t.staticFolds === !0 ? "span" : "button"), i = document.createElement("span");
	return n.className = t.staticFolds === !0 ? `${dA} ${dA}--static` : dA, r.className = fA, r.textContent = e.fold ?? "", i.className = pA, i.append(SA(hA(e.text), t)), t.staticFolds === !0 ? (n.append(r, " ", i), n) : (r.setAttribute("type", "button"), r.setAttribute("aria-expanded", "false"), r.setAttribute(Ze, ""), n.append(r, i), n);
}
function TA(e) {
	let t = document.createElement("i");
	return t.className = "ui-text__icon-inline", $g(t, e), t.setAttribute("aria-hidden", "true"), t;
}
function EA(e, t) {
	let n = document.createElement(e);
	return n.append(t), n;
}
function DA(e, t, n, r, i, a, o) {
	let s = e.text, c = t;
	for (; c < n;) {
		let t = s[c];
		if (t === oA && c + 1 < n && zA(s[c + 1])) {
			o.value += s[c + 1], c += 2;
			continue;
		}
		let l = kA(e, c, n);
		if (l !== null) {
			OA(a, o, r, i), AA(s, c + 1, l, o), OA(a, o, r | aA.Code, i), c = l + 1;
			continue;
		}
		let u = NA(e, c, n);
		if (u !== null) {
			OA(a, o, r, i), DA(e, c + u.markerLength, u.contentEnd, r | u.style, i, a, o), OA(a, o, r | u.style, i), c = u.contentEnd + u.markerLength;
			continue;
		}
		let d = jA(e, c, n);
		if (d !== null) {
			OA(a, o, r, i), a.push({
				text: "",
				styles: r,
				url: i,
				icon: d.name
			}), c = d.iconEnd;
			continue;
		}
		let f = i === null ? PA(e, c, n) : null;
		if (f !== null) {
			OA(a, o, r, i), DA(e, f.labelStart, f.labelEnd, r, f.url, a, o), OA(a, o, r, f.url), c = f.linkEnd;
			continue;
		}
		let p = FA(e, c, n);
		if (p !== null) {
			OA(a, o, r, i), a.push({
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
function OA(e, t, n, r) {
	t.value.length !== 0 && (e.push({
		text: t.value,
		styles: n,
		url: r
	}), t.value = "");
}
function kA(e, t, n) {
	let r = e.text;
	if (r[t] !== sA) return null;
	let i = t + 1;
	if (i >= n || BA(r[i])) return null;
	let a = e.findClosingMarker(i, n, sA, 1);
	return a > i ? a : null;
}
function AA(e, t, n, r) {
	for (let i = t; i < n; i++) {
		if (e[i] === oA && i + 1 < n && zA(e[i + 1])) {
			r.value += e[i + 1], i++;
			continue;
		}
		r.value += e[i];
	}
}
function jA(e, t, n) {
	let r = e.text;
	if (r[t] !== cA || t + 1 >= n || r[t + 1] !== "[") return null;
	let i = t + 2, a = e.findClosingBracket(i, n);
	if (a <= i) return null;
	let o = r.slice(i, a);
	return MA(o) ? {
		name: o,
		iconEnd: a + 1
	} : null;
}
function MA(e) {
	return e.length > 0 && /^[A-Za-z0-9._-]+$/.test(e);
}
function NA(e, t, n) {
	let r = e.text, i = r[t];
	if (i !== "*" && i !== "_" && i !== "~") return null;
	let a = t + 1 < n && r[t + 1] === i, o, s;
	if (i === "*" && a) o = aA.Bold, s = 2;
	else if (i === "*") o = aA.Italic, s = 1;
	else if (i === "_" && a) o = aA.Underline, s = 2;
	else if (i === "~" && a) o = aA.Strikethrough, s = 2;
	else return null;
	let c = t + s;
	if (c >= n || BA(r[c])) return null;
	let l = e.findClosingMarker(c, n, i, s);
	return l > c ? {
		style: o,
		markerLength: s,
		contentEnd: l
	} : null;
}
function PA(e, t, n) {
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
function FA(e, t, n) {
	let r = e.text;
	if (r[t] !== "[") return null;
	let i = e.findClosingBracket(t + 1, n);
	if (i <= t + 1 || i + 1 >= n || r[i + 1] !== lA || e.hasOpeningBracket(t + 1, i)) return null;
	let a = i + 1, o = a + 1, s = e.findMatchingBrace(a, n);
	if (s <= o || e.braceDepth(a) > mA) return null;
	let c = { value: "" };
	return AA(r, t + 1, i, c), {
		caption: c.value,
		contentStart: o,
		contentEnd: s
	};
}
var IA = class {
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
		return this.closeBrackets ??= this.next("]", !0), LA(this.closeBrackets[e], t);
	}
	hasOpeningBracket(e, t) {
		return this.openBrackets ??= this.next("[", !0), LA(this.openBrackets[e], t) >= 0;
	}
	findClosingParen(e, t) {
		return this.closeParens ??= this.next(")", !1), LA(this.closeParens[e], t);
	}
	findMatchingBrace(e, t) {
		return LA(this.braces()[e], t);
	}
	braceDepth(e) {
		return this.braces(), this.braceDepths[e];
	}
	findClosingMarker(e, t, n, r) {
		let i = RA(n, r), a = this.closers[i] ?? this.buildClosers(n, r);
		this.closers[i] = a;
		let o = a[e + 1];
		if (r === 2) return o >= 0 && o + 1 < t ? o : -1;
		if (o >= 0 && o < t - 1) return o;
		let s = t - 1;
		return s > e && this.text[s] === n && !this.isEscaped(s) && !BA(this.text[s - 1]) ? s : -1;
	}
	readLinkUrl(e, t) {
		if (this.linkLabel !== e) {
			let n = this.text.slice(e + 2, t).trim();
			this.linkLabel = e, this.linkUrl = Ng(n) ? n : null;
		}
		return this.linkUrl;
	}
	isEscaped(e) {
		if (this.escaped === null) {
			let e = new Uint8Array(this.text.length);
			for (let t = 1; t < this.text.length; t++) e[t] = +(this.text[t - 1] === oA && e[t - 1] === 0);
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
			if (this.text[r] === lA) n.push(r);
			else if (this.text[r] === uA && n.length > 0) {
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
		if (e === 0 || this.text[e] !== t || this.isEscaped(e) || BA(this.text[e - 1])) return !1;
		let r = e + 1 < this.text.length && this.text[e + 1] === t;
		return n === 2 ? r : !r;
	}
};
function LA(e, t) {
	return e >= 0 && e < t ? e : -1;
}
function RA(e, t) {
	switch (e) {
		case "*": return t === 2 ? 0 : 1;
		case "_": return 2;
		case "~": return 3;
		default: return 4;
	}
}
function zA(e) {
	return e === "*" || e === "_" || e === "~" || e === "[" || e === "]" || e === "(" || e === ")" || e === lA || e === uA || e === sA || e === oA;
}
function BA(e) {
	return e === " " || e === "	" || e === "\r" || e === "\n";
}
//#endregion
//#region src/interactions/tooltip-engine.ts
var VA = "ui-tooltip", HA = "ui-tooltip", UA = "ui-tooltip--visible", WA = "ui-tooltip--linked", GA = "[aria-haspopup][aria-expanded=\"true\"]", KA = "a[href], button, input, select, textarea, label, [role='button'], [role='link'], [tabindex]", qA = "top", JA = 250, YA = 200, XA = 300, ZA = 7, QA = null, U = null, $A = null, ej = null, tj = null, nj = 0, rj = null, ij = 0, aj = 0, oj = !1, sj = /* @__PURE__ */ new Set();
function cj(e) {
	sj.add(e);
}
function lj(e = document) {
	if (oj) return;
	oj = !0;
	let t = e instanceof Document ? e : document;
	t.addEventListener("pointerover", uj, !0), t.addEventListener("pointerout", pj, !0), t.addEventListener("focusin", hj, !0), t.addEventListener("focusout", gj, !0), t.addEventListener("scroll", fj, !0), t.addEventListener("pointerdown", vj, !0), t.addEventListener("pointermove", Ej, !0), t.addEventListener("pointerup", Tj, !0), t.addEventListener("pointercancel", Tj, !0), t.addEventListener("contextmenu", Oj, !0), t.addEventListener("click", Aj, !0), window.addEventListener("click", kj, !0), window.addEventListener("keydown", _j, !0), window.addEventListener("blur", () => {
		ej = null, eM(!0);
	});
}
function uj(e) {
	if (dj(), Mj(e.target)) {
		window.clearTimeout(ij);
		return;
	}
	let t = Nj(e.target);
	t !== null && t !== U && Rj(t);
}
function dj() {
	U === null || U.isConnected || (ej = null, eM(!0));
}
function fj(e) {
	if (dj(), U === null) return;
	let t = e.target;
	t instanceof Node && !(t instanceof Document) && !t.contains(U) || Ek(U) && (ej = null, eM(!0));
}
function pj(e) {
	if (ej !== null || tj !== null) return;
	let t = e.relatedTarget, n = U ?? rj?.target ?? null, r = n === null ? null : mj(n);
	t instanceof Node && (r !== null && r.contains(t) || Mj(t)) || (Mj(e.target) || r !== null && e.target instanceof Node && r.contains(e.target)) && eM(!1);
}
function mj(e) {
	let t = e.parentElement?.closest("[data-ui-tooltip-mark]") ?? null;
	return t !== null && Pj(t) === e ? t : e;
}
function hj(e) {
	if (e.target instanceof Element && e.target.hasAttribute("data-ui-pointer-focus")) return;
	let t = Nj(e.target);
	t !== null && (ej = e.target instanceof Element && e.target.closest("[data-ui-tooltip-mark]") !== null ? t : null, zj(t));
}
function gj(e) {
	Nj(e.target) === U && (ej = null, eM(!0));
}
function _j(e) {
	e.key !== "Escape" || U === null || e.defaultPrevented || (uc(e) || e.preventDefault(), ej = null, eM(!0));
}
function vj(e) {
	if (Tj(), Cj = null, Mj(e.target)) return;
	wj(e);
	let t = jj(e.target);
	if (t !== null) {
		if (tj === t) {
			eM(!0);
			return;
		}
		ej = null, eM(!0), zj(t), tj = U;
		return;
	}
	ej === null && eM(!0);
}
var yj = 500, bj = 10, xj = `[${Te}]`, Sj = null, Cj = null;
function wj(e) {
	let t = e;
	if (t.pointerType !== "touch" || !(e.target instanceof Element) || e.target.closest(xj) !== null || bc(e.target)) return;
	let n = Nj(e.target);
	n === null || n.hasAttribute("data-ui-tooltip-press") || (Sj = {
		pointerId: t.pointerId ?? 0,
		x: t.clientX ?? 0,
		y: t.clientY ?? 0,
		target: n,
		timer: window.setTimeout(Dj, yj)
	});
}
function Tj() {
	Sj !== null && (window.clearTimeout(Sj.timer), Sj = null);
}
function Ej(e) {
	let t = e;
	Sj !== null && t.pointerId === Sj.pointerId && Math.hypot((t.clientX ?? Sj.x) - Sj.x, (t.clientY ?? Sj.y) - Sj.y) > bj && Tj();
}
function Dj() {
	let e = Sj?.target ?? null;
	Sj = null, e !== null && (ej = null, eM(!0), zj(e), tj = U, Cj = U);
}
function Oj(e) {
	if (Sj !== null && e.target instanceof Node && Sj.target.contains(e.target)) {
		e.preventDefault(), window.clearTimeout(Sj.timer), Dj();
		return;
	}
	Cj !== null && e.target instanceof Node && Cj.contains(e.target) && e.preventDefault();
}
function kj(e) {
	Cj === null || !(e.target instanceof Node) || !Cj.contains(e.target) || (Cj = null, e.preventDefault(), e.stopImmediatePropagation());
}
function Aj(e) {
	jj(e.target) !== null && e.preventDefault();
}
function jj(e) {
	let t = Nj(e);
	if (t === null || !t.hasAttribute("data-ui-tooltip-press") || !(e instanceof Element)) return null;
	let n = e.closest(KA);
	return n === null || n.contains(t) ? t : null;
}
function Mj(e) {
	return QA !== null && e instanceof Node && QA.contains(e);
}
function Nj(e) {
	if (!(e instanceof Element)) return null;
	let t = Pj(e);
	for (let n of sj) {
		let r = n.anchor(e);
		if (r !== null && (t === null || t !== r && t.contains(r)) && Lj(r).length > 0) return r;
	}
	return t;
}
function Pj(e) {
	let t = e.closest(`[${Re}], [${Be}]`);
	if (t === null) return null;
	let n = t.hasAttribute("data-ui-tooltip") ? t : t.querySelector("[data-ui-tooltip][data-ui-tooltip-severity]") ?? t.querySelector("[data-ui-tooltip]");
	return n === null ? null : (n.getAttribute("data-ui-tooltip") ?? "").trim().length > 0 ? n : null;
}
function Fj(e) {
	let t = (e.getAttribute("data-ui-tooltip") ?? "").trim();
	return t.length > 0 ? t + Ij(e) : Lj(e);
}
function Ij(e) {
	let t = "";
	for (let n of sj) {
		let r = n.anchor(e) === e ? n.after?.(e)?.trim() ?? "" : "";
		r.length > 0 && (t += ` ${r}`);
	}
	return t;
}
function Lj(e) {
	for (let t of sj) {
		if (t.anchor(e) !== e) continue;
		let n = t.words(e)?.trim() ?? "";
		if (n.length > 0) return n;
	}
	return "";
}
function Rj(e, t) {
	if (ej === null && tj === null) {
		if (window.clearTimeout(ij), rj !== null && rj.target === e) {
			rj.words = t;
			return;
		}
		if (window.clearTimeout(nj), rj = null, U !== null) {
			eM(!0), zj(e, t);
			return;
		}
		if (Date.now() - aj < XA) {
			zj(e, t);
			return;
		}
		rj = {
			target: e,
			words: t
		}, nj = window.setTimeout(() => {
			let e = rj;
			rj = null, e !== null && zj(e.target, e.words);
		}, JA);
	}
}
function zj(e, t) {
	let n = (t ?? Fj(e)).trim();
	if (n.length === 0 || !e.isConnected || !Tk(e) || Hj(e) || Ek(e)) return;
	window.clearTimeout(nj), window.clearTimeout(ij), rj = null;
	let r = tM();
	vA(r, n, { staticFolds: !0 }), r.classList.toggle(WA, r.querySelector("a[href]") !== null), r.classList.add(UA), U = e, Wj(Uj(e)), r.setAttribute("data-ui-tooltip-text", gA(n)), qj(r, e.getAttribute(Ve)), Wf(e, r), Gf(e, r, {
		placement: $j(e),
		gap: ZA,
		arrow: !0
	}), Vj();
}
var Bj = null;
function Vj() {
	typeof MutationObserver > "u" || (Bj ??= new MutationObserver(dj), Bj.observe(document.documentElement, {
		childList: !0,
		subtree: !0
	}));
}
function Hj(e) {
	return e.matches(GA) || e.querySelector(GA) !== null || e.querySelector(":scope > .ui-action-bar") !== null;
}
function Uj(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t) ? t : e;
}
function Wj(e) {
	$A !== null && $A !== e && Gj();
	let t = Kj(e);
	t.includes(HA) || e.setAttribute("aria-describedby", [...t, HA].join(" ")), $A = e;
}
function Gj() {
	if ($A === null) return;
	let e = Kj($A).filter((e) => e !== HA);
	e.length === 0 ? $A.removeAttribute("aria-describedby") : $A.setAttribute("aria-describedby", e.join(" ")), $A = null;
}
function Kj(e) {
	return (e.getAttribute("aria-describedby") ?? "").split(" ").filter((e) => e.length > 0);
}
function qj(e, t) {
	t === null ? e.removeAttribute(Ve) : e.setAttribute(Ve, t);
}
function Jj(e, t, n) {
	let r = n?.plain === !0 ? _A(t) : t;
	n?.delay === !0 && U !== e ? Rj(e, r) : zj(e, r);
}
function Yj() {
	eM(!0);
}
var Xj = {
	show: Jj,
	hide: Yj,
	escape: _A
};
function Zj(e) {
	ej = e, zj(e);
}
function Qj(e) {
	if (U === e) {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) {
			ej = null, eM(!0);
			return;
		}
		zj(e);
	}
}
function $j(e) {
	if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) for (let t of sj) {
		let n = t.anchor(e) === e ? t.placement?.(e) ?? null : null;
		if (n !== null) return n;
	}
	let t = e.getAttribute(ze);
	return t !== null && Pf(t) ? t : qA;
}
function eM(e) {
	window.clearTimeout(nj), window.clearTimeout(ij), rj = null;
	let t = () => {
		U !== null && (Gj(), U = null, tj = null, Bj?.disconnect(), QA !== null && (QA.classList.remove(UA), rp(QA)), aj = Date.now());
	};
	e ? t() : ij = window.setTimeout(t, YA);
}
function tM() {
	return QA !== null && QA.isConnected ? QA : (QA = document.createElement("div"), QA.id = HA, QA.className = VA, QA.setAttribute("role", "tooltip"), QA.setAttribute("aria-hidden", "true"), document.body.append(QA), QA);
}
//#endregion
//#region src/interactions/menu-engine.ts
var nM = "ui-orientation--horizontal", rM = `.${mn} > .ui-menu__host > .ui-menu__item > .${y}`, iM = `${rM}, ${`.ui-menu[${Bt}] > .ui-menu__host > .ui-menu__item > .${y}`}`, aM = ":scope > .ui-button__content > .ui-text__body > .ui-text__header > .ui-text__title", oM = "[role='menuitem'], [role='menuitemcheckbox']", sM = class {
	root;
	tabStopsScheduled = !1;
	space = new Xs();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("keydown", (e) => this.handleEntryKeydown(e), !0), this.root.addEventListener("keyup", (e) => this.space.release(e, M), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), cj(dM), this.applyTabStops(), this.root instanceof Node && new MutationObserver((e) => {
			e.some(fM) && this.scheduleTabStops();
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [Zt, Ut]
		});
	}
	scheduleTabStops() {
		this.tabStopsScheduled || (this.tabStopsScheduled = !0, setTimeout(() => {
			this.tabStopsScheduled = !1, this.applyTabStops();
		}, 0));
	}
	applyTabStops() {
		for (let e of this.root.querySelectorAll(`.${dn}`)) {
			if (HO(e) !== e) continue;
			let t = VO(e);
			if (t.length === 0) continue;
			let n = t.filter((e) => e.tabIndex === 0 && M(e));
			j(t, t.find((e) => e === document.activeElement) ?? t.find((e) => e.classList.contains("ui-menu-item--selected") && M(e)) ?? (n.length === 1 ? n[0] : void 0) ?? t.find(M) ?? t[0]);
		}
	}
	handleEntryKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || xc(e) || k(e) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${y}`), n = t?.closest(".ui-menu") ?? null;
		if (t === null) {
			this.enterFromContainer(e);
			return;
		}
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			this.pressEntry(e, t);
			return;
		}
		let r = HO(n), i = VO(r), a = Ky(e);
		if (a !== null) {
			e.preventDefault(), Lc(i, hD(i, t, a));
			return;
		}
		let o = r.classList.contains(nM) || RO(r) ? "horizontal" : "vertical";
		if (!A(e) || this.handleGroupKey(e, t, r, o)) return;
		let s = e.key === "ArrowUp" && t === i.find(M) ? uM(r) : null, c = s ?? Pc({
			key: e.key,
			items: i,
			current: t,
			axis: o
		});
		c !== null && (e.preventDefault(), c !== s && j(i, c), c.focus());
	}
	handleGroupKey(e, t, n, r) {
		let i = r === "vertical" ? "ArrowRight" : LO(n) === "top" ? "ArrowUp" : "ArrowDown", a = t.matches(_n) ? t.parentElement : null;
		if (e.key === i && a !== null) return e.preventDefault(), a.hasAttribute("data-ui-menu-open") ? Lc([], cM(a)) : t.click(), !0;
		if (e.key !== "ArrowLeft" || r !== "vertical") return !1;
		let o = a !== null && a.hasAttribute("data-ui-menu-open") && !WO(a) ? a : lM(t), s = o?.querySelector(":scope > .ui-menu-item") ?? null;
		return o === null || s === null ? !1 : (e.preventDefault(), WO(o) || s.focus(), s.click(), !0);
	}
	pressEntry(e, t) {
		e.target !== t || !A(e, { shift: !0 }) || t.matches(gn) || !M(t) || t.hasAttribute("href") && e.key === "Enter" || (e.preventDefault(), !e.repeat && (e.key === " " ? this.space.hold(t) : t.click()));
	}
	enterFromContainer(e) {
		let t = e.target instanceof HTMLElement && e.target.getAttribute("role") === "menu" ? e.target : null, n = t === null ? null : t.matches(".ui-menu") ? t : t.querySelector(`.${dn}`);
		if (n === null) return;
		let r = VO(n), i = Ky(e);
		if (i !== null) {
			e.preventDefault(), Lc(r, hD(r, null, i));
			return;
		}
		let a = A(e) ? Pc({
			key: e.key,
			items: r,
			current: null,
			axis: n.classList.contains(nM) ? "horizontal" : "vertical"
		}) : null;
		a !== null && (e.preventDefault(), Lc(r, a));
	}
	handleFocusIn(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${y}`), n = t?.closest(".ui-menu") ?? null;
		t !== null && n !== null && j(VO(HO(n)), t);
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${y}`) : null;
		if (t === null || t === document.activeElement || !t.matches(oM) || t.matches(gn) || !M(t)) return;
		let n = document.activeElement;
		(n instanceof HTMLElement && n.getAttribute("role") === "menu" && n.contains(t) || t.closest(".ui-menu")?.contains(n) === !0) && nd(t);
	}
};
function cM(e) {
	let t = e.querySelector(`:scope > .ui-menu__submenu > .${dn}`);
	return t === null ? null : VO(t).find(M) ?? null;
}
function lM(e) {
	let t = e.closest(`.${dn}`), n = t === null ? null : UO(t);
	return n !== null && n.hasAttribute("data-ui-menu-open") ? n : null;
}
function uM(e) {
	return e.hasAttribute("data-ui-menu-search") ? e.querySelector(":scope > .ui-collapsible__bar input") : null;
}
var dM = {
	anchor: (e) => e.closest(iM),
	words: (e) => {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length > 0) return null;
		let t = e.querySelector(aM), n = t?.textContent?.trim() ?? "";
		return t === null || n.length === 0 || e.matches(rM) && t.scrollWidth <= t.clientWidth ? null : _A(n);
	},
	placement: (e) => {
		let t = e.closest(`.${dn}`);
		return t === null ? null : LO(t);
	}
};
function fM(e) {
	let t = e.target instanceof Element ? e.target : e.target.parentElement;
	if (t !== null && t.closest(".ui-menu") !== null) return !0;
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains("ui-menu") || t.querySelector(".ui-menu") !== null)) return !0;
	return !1;
}
//#endregion
//#region src/interactions/shortcut-engine.ts
var pM = "shortcut:", mM = ":scope > .ui-menu-item__shortcut", hM = `[${we}]`, gM = `[${bn}]`, _M = ".ui-text__title", vM = class {
	root;
	options;
	claims = /* @__PURE__ */ new Map();
	entryShortcuts = /* @__PURE__ */ new Map();
	stale = !0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.options = e, this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), cj(TM), SM(this.root), this.root instanceof Node && new MutationObserver((e) => {
			this.stale = !0;
			for (let t of e) xM(t);
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [bn]
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || k(e) || (this.stale && this.rebuild(), this.claims.size === 0 && this.entryShortcuts.size === 0 || xc(e))) return;
		let t = Wp(this.root);
		if (!this.pressContextEntry(e, t)) for (let n of this.claims.values()) {
			if (n === null || !Bs(n.shortcut, e)) continue;
			let r = n.element ?? this.contentOf(n.view);
			if (r === null || !M(r) || t !== null && !t.contains(r)) return;
			e.preventDefault(), bM(e), n.view === null ? r.click() : r.dispatchEvent(new CustomEvent(n.view.name, { bubbles: !0 }));
			return;
		}
	}
	pressContextEntry(e, t) {
		let n = !1;
		for (let t of this.entryShortcuts.values()) n ||= Bs(t, e);
		let r = n ? ck() : null;
		if (r === null || t !== null && !t.contains(r)) return !1;
		let i = ok(r);
		if (i === null) return !1;
		let a = [...i.menu.querySelectorAll(gM)].filter((t) => {
			let n = zs(t.getAttribute(bn));
			return n !== null && Bs(n, e) && !E(t) && zD(t, i.menu);
		});
		return a.length === 1 ? (e.preventDefault(), bM(e), a[0].click(), !0) : (a.length > 1 && s("context menu shortcut is claimed twice and will fire nothing.", { entries: a }), !1);
	}
	contentOf(e) {
		let t = e === null ? null : this.options.componentOf?.(e.componentId) ?? null;
		return t instanceof HTMLElement ? t : null;
	}
	rebuild() {
		this.claims.clear(), this.entryShortcuts.clear(), this.stale = !1;
		for (let e of this.root.querySelectorAll(gM)) {
			let t = e.getAttribute("data-ui-shortcut") ?? "", n = zs(t);
			if (n === null) {
				t.trim().length > 0 && s("shortcut could not be parsed.", {
					element: e,
					value: t
				});
				continue;
			}
			e.closest(hM) === null ? this.claim({
				shortcut: n,
				element: e,
				view: null
			}) : this.entryShortcuts.set(Zs(n), n);
		}
		for (let e of this.options.viewShortcuts ?? []) {
			let t = zs(e.name.slice(9));
			t !== null && this.claim({
				shortcut: t,
				element: null,
				view: e
			});
		}
	}
	claim(e) {
		let t = Zs(e.shortcut);
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
function yM(e) {
	let t = /* @__PURE__ */ new Map(), n = [...e.events, ...e.interactions.map((e) => e.sourceEvent)];
	for (let e of n) e != null && e.eventName.startsWith(pM) && t.set(e.eventName, {
		name: e.eventName,
		componentId: e.componentId
	});
	return [...t.values()];
}
function bM(e) {
	yc(e.target) && e.target.dispatchEvent(new Event(iy, { bubbles: !0 }));
}
function xM(e) {
	if (e.type === "attributes") {
		e.target instanceof HTMLElement && CM(e.target);
		return;
	}
	for (let t of e.addedNodes) t instanceof HTMLElement && SM(t);
}
function SM(e) {
	e instanceof HTMLElement && e.matches(gM) && CM(e);
	for (let t of e.querySelectorAll(gM)) CM(t);
}
function CM(e) {
	let t = e.querySelector(mM);
	if (t === null) return;
	let n = wM(e) ?? "";
	t.textContent !== n && (t.textContent = n), e.hasAttribute("data-ui-menu-item-shortcut") !== n.length > 0 && e.toggleAttribute(qt, n.length > 0);
}
function wM(e) {
	let t = e.getAttribute(bn), n = zs(t);
	return n === null ? t?.trim() || null : Vs(n);
}
var TM = {
	anchor: (e) => {
		let t = e.closest(gM);
		return t === null || t.classList.contains("ui-menu-item") || t.closest(hM) !== null ? null : t;
	},
	words: (e) => {
		let t = wM(e), n = (e.getAttribute("aria-label") ?? e.querySelector(_M)?.textContent ?? "").trim();
		return t === null ? null : _A(n.length > 0 ? `${n} (${t})` : t);
	},
	after: (e) => {
		let t = wM(e);
		return t === null ? null : _A(`(${t})`);
	}
}, EM = 50, DM = 1, OM = 7;
function kM(e) {
	let t = 0;
	for (let n of e.children) n.hasAttribute("data-ui-key") && t++;
	let n = NS(e, "data-ui-window-size") ?? 0;
	return {
		offset: NS(e, "data-ui-window-offset") ?? 0,
		count: t,
		size: n > 0 ? n : t > 0 ? t : EM,
		total: NS(e, Mt),
		moreAfter: PS(e, Pt)
	};
}
function AM(e) {
	return Math.floor(e.offset / e.size) + 1;
}
function jM(e) {
	return e.total === null ? null : Math.max(1, Math.ceil(e.total / e.size));
}
function MM(e, t) {
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
			let n = Number(t), r = jM(e);
			return !Number.isInteger(n) || n < 1 || r !== null && n > r || n === AM(e) ? null : (n - 1) * e.size;
		}
	}
}
function NM(e, t) {
	if (t <= OM) return FM(1, t);
	let n = Math.max(Math.min(e - DM, t - 2 - 2), 3), r = Math.min(Math.max(e + DM, 5), t - 2);
	return [
		1,
		n > 3 ? "gap" : 2,
		...FM(n, r),
		r < t - 2 ? "gap" : t - 1,
		t
	];
}
function PM(e, t) {
	let n = NM(e, t ? e + 1 : e);
	return t ? [...n, "gap"] : n;
}
function FM(e, t) {
	let n = [];
	for (let r = e; r <= t; r++) n.push(r);
	return n;
}
//#endregion
//#region src/interactions/pager-engine.ts
var IM = ".ui-pager", LM = "ui-pager__button", RM = "ui-pager__number", zM = "ui-pager__pages", BM = "ui-pager__gap", VM = "ui-pager__range", HM = "ui-pager__size", UM = "ui-pager__size--open", WM = "ui-pager__size-trigger", GM = "ui-pager__size-label", KM = "ui-pager__sizes", qM = "ui-pager__size-choice", JM = [
	LM,
	RM,
	"ui-button",
	"ui-button--ghost",
	"ui-button--small"
], YM = "ui.pager.page", XM = "ui.pager.range", ZM = "ui.pager.rows", QM = "ui.pager.size", $M = [
	jt,
	Mt,
	Pt,
	At,
	kt
], eN = "page-size", tN = class {
	options;
	root;
	drawn = /* @__PURE__ */ new WeakMap();
	store = new cO();
	restored = /* @__PURE__ */ new WeakSet();
	menus = new Km({
		show: ({ owner: e }) => e.classList.add(UM),
		hide: ({ owner: e }) => e.classList.remove(UM),
		closesWhenReadOnly: !1,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.syncAll(), this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e)), (e.pageKeys ?? window).addEventListener("keydown", (e) => this.handlePageKey(e), !0), R(this.root, `${IM}, [${v}]`, {
			childList: !0,
			attributeFilter: $M,
			relevant: (e) => e.type === "attributes" || uN(e.target) || dN(e)
		}, (e) => this.syncFound(e)), T.onChange(() => {
			this.drawn = /* @__PURE__ */ new WeakMap(), this.syncAll();
		});
	}
	syncAll() {
		for (let e of this.root.querySelectorAll(IM)) this.sync(e);
	}
	syncFound(e) {
		for (let t of e) {
			if (t.matches(IM)) {
				this.sync(t);
				continue;
			}
			for (let e of this.pagersOf(t)) this.sync(e);
		}
	}
	pagersOf(e) {
		let t = e.closest(b), n = t === null ? 0 : w(t);
		return n > 0 ? [...this.root.querySelectorAll(`${IM}[${ct}="${x(n)}"]`)] : [];
	}
	hostOf(e) {
		return this.targetOf(e)?.host ?? null;
	}
	targetOf(e) {
		let t = Number(e.getAttribute(ct));
		if (!Number.isInteger(t) || t <= 0) return null;
		for (let e of this.options.dom.findEveryComponent(t)) {
			let t = lN(e);
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
		let i = kM(n), a = `${i.offset}|${i.count}|${i.size}|${i.total}|${i.moreAfter}`;
		if (this.drawn.get(e) === a) return;
		this.drawn.set(e, a);
		let o = Hx(e), s = (e) => Ux(e, "N0", o);
		this.drawNumbers(e, i, o), rN(e, i, s), iN(e, i, s);
		for (let t of e.querySelectorAll(`:scope > .${LM}[${lt}]`)) Zo.setDisabled(t, MM(i, t.getAttribute("data-ui-pager-page") ?? "") === null);
		oN(e);
	}
	drawNumbers(e, t, n) {
		let r = e.querySelector(`:scope > .${zM}`);
		if (r === null) return;
		let i = AM(t), a = jM(t), o = a === null ? PM(i, t.moreAfter) : NM(i, a), s = r.contains(document.activeElement);
		r.replaceChildren(...o.map((e) => nN(e, i, n))), s && !e.contains(document.activeElement) && r.querySelector("[aria-current='page']")?.focus({ preventScroll: !0 });
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(IM);
		if (t === null || E(e.target)) return;
		let n = e.target.closest(`.${qM}`);
		if (n !== null) {
			e.preventDefault(), this.chooseSize(t, Number(n.getAttribute(ut)));
			return;
		}
		let r = e.target.closest(`.${WM}`);
		if (r !== null) {
			e.preventDefault(), this.toggleSizes(r);
			return;
		}
		let i = e.target.closest(`[${lt}]`), a = i === null ? null : this.hostOf(t);
		if (i === null || a === null) return;
		let o = MM(kM(a), i.getAttribute("data-ui-pager-page") ?? "");
		o !== null && (e.preventDefault(), this.turnAsync(a, o));
	}
	async turnAsync(e, t) {
		await this.options.windows.requestOffsetAsync(e, t), Hc(e).top > 0 && Uc(e, 0);
	}
	handleKeyDown(e) {
		if (e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(IM);
		if (t === null) return;
		let n = e.target.closest(`.${HM}`);
		if (n !== null && this.handleSizeKey(e, n)) return;
		let r = e.target.closest(`.${LM}, .${WM}`), i = aN(t);
		if (r === null || !i.includes(r) || !A(e)) return;
		let a = Pc({
			key: e.key,
			items: i,
			current: r,
			axis: "horizontal"
		});
		a !== null && (e.preventDefault(), Lc(i, a));
	}
	handleSizeKey(e, t) {
		let n = e.target instanceof Element ? e.target.closest(`.${WM}`) : null;
		return n !== null && !this.menus.isOpen(t) && (e.key === "ArrowDown" || e.key === "ArrowUp") && A(e) ? (e.preventDefault(), this.openSizes(t, n, e.key === "ArrowUp"), !0) : this.menus.isOpen(t) && pD(e, cN(t));
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${qM}`) : null, n = t?.closest(`.${HM}`) ?? null;
		t !== null && n !== null && this.menus.isOpen(n) && gD(t, cN(n));
	}
	toggleSizes(e) {
		let t = e.closest(`.${HM}`);
		t !== null && (this.menus.isOpen(t) ? this.menus.close(t) : this.openSizes(t, e, !1));
	}
	openSizes(e, t, n) {
		let r = e.querySelector(`:scope > .${KM}`);
		if (r === null) return;
		let i = cN(e), a = i.find((e) => e.getAttribute("aria-checked") === "true") ?? null;
		fD(this.menus, {
			owner: e,
			popup: r,
			anchor: t,
			placement: { placement: "bottom-end" },
			openers: [t]
		}, i, a, n);
	}
	restoreSize(e, t, n) {
		let r = this.store.read(t, eN), i = r === null ? 0 : Number(r);
		if (!Number.isInteger(i) || i <= 0) return;
		if (!sN(e, i)) {
			this.store.write(t, eN, null);
			return;
		}
		let a = kM(n);
		i !== a.size && (n.setAttribute(At, String(i)), a.count > 0 && this.turnAsync(n, Math.floor(a.offset / i) * i));
	}
	chooseSize(e, t) {
		let n = e.querySelector(`.${HM}`);
		n !== null && this.menus.close(n);
		let r = this.targetOf(e);
		if (r === null || !Number.isInteger(t) || t <= 0) return;
		let i = kM(r.host);
		t !== i.size && (this.store.write(r.component, eN, String(t)), r.host.setAttribute(At, String(t)), this.turnAsync(r.host, Math.floor(i.offset / t) * t));
	}
	handlePageKey(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "PageDown" && e.key !== "PageUp" || !A(e) || !(e.target instanceof Element)) return;
		let t = Wl(e);
		if (t === null || !t.root.matches(".ui-items-view, .ui-table") || E(t.root)) return;
		let n = lN(t.root);
		if (n === null || !n.hasAttribute("data-ui-window-paged")) return;
		let r = MM(kM(n), e.key === "PageDown" ? "next" : "previous");
		r !== null && (e.preventDefault(), this.turnFromKeyAsync(t.root, n, r));
	}
	async turnFromKeyAsync(e, t, n) {
		let r = jl(e), i = Jl(r), a = i === null ? 0 : Math.max(0, r.indexOf(i));
		await this.options.windows.requestOffsetAsync(t, n);
		let o = jl(e);
		o.length > 0 && Ql(e, o, o[Math.min(a, o.length - 1)]);
	}
};
function nN(e, t, n) {
	if (e === "gap") {
		let e = document.createElement("span");
		return e.className = BM, e.setAttribute("aria-hidden", "true"), e.textContent = "…", e;
	}
	let r = document.createElement("button"), i = Ux(e, "N0", n);
	return r.className = JM.join(" "), r.setAttribute("type", "button"), r.setAttribute(lt, String(e)), r.textContent = i, T.write(r, "aria-label", YM, { page: i }), e === t && r.setAttribute("aria-current", "page"), r;
}
function rN(e, t, n) {
	let r = e.querySelector(`:scope > .${VM}`);
	if (r === null) return;
	let i = n(t.count === 0 ? 0 : t.offset + 1), a = n(t.offset + t.count);
	t.total === null ? T.write(r, null, ZM, {
		from: i,
		to: a
	}) : T.write(r, null, XM, {
		from: i,
		to: a,
		total: n(t.total)
	});
}
function iN(e, t, n) {
	let r = e.querySelector(`:scope > .${HM}`), i = r?.querySelector(`.${GM}`) ?? null;
	if (r !== null && i !== null) {
		T.write(i, null, QM, { size: n(t.size) });
		for (let e of cN(r)) e.setAttribute("aria-checked", Number(e.getAttribute("data-ui-pager-size")) === t.size ? "true" : "false");
	}
}
function aN(e) {
	return [...e.querySelectorAll(`.${LM}, .${WM}`)];
}
function oN(e) {
	let t = aN(e), n = t.find((e) => e === document.activeElement), r = t.filter((e) => e.getAttribute("data-ui-pager-page") === "previous" || e.getAttribute("data-ui-pager-page") === "next");
	j(t, n ?? r.find(M) ?? t.find((e) => e.getClientRects().length > 0) ?? null);
}
function sN(e, t) {
	let n = e.querySelector(`:scope > .${HM}`);
	return n !== null && cN(n).some((e) => Number(e.getAttribute("data-ui-pager-size")) === t);
}
function cN(e) {
	return [...e.querySelectorAll(`:scope > .${KM} > .${qM}`)];
}
function lN(e) {
	for (let t of e.querySelectorAll(`[${v}][${St}="windowed"]`)) if (t.closest(b) === e) return t;
	return null;
}
function uN(e) {
	return e instanceof Element && e.hasAttribute("data-ui-items-host");
}
function dN(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(IM) || t.querySelector(IM) !== null)) return !0;
	return !1;
}
//#endregion
//#region src/interactions/menu-search-engine.ts
var fN = `.${dn}[${Yt}]`, pN = ":scope > .ui-collapsible__bar", mN = ":scope > .ui-menu__host", hN = "ui-menu__item", gN = `:scope > .${y}`, _N = ":scope > .ui-menu__submenu > .ui-menu > .ui-menu__host", vN = class {
	active = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("input", (e) => this.handle(e), !0), t.addEventListener("change", (e) => this.handle(e), !0), t.addEventListener("keydown", (e) => this.handleKeydown(e)), R(t, fN, {
			childList: !0,
			characterData: !0,
			attributeFilter: [Bt]
		}, (e) => this.reconcile(e));
	}
	handle(e) {
		let t = e.target;
		if (!(t instanceof HTMLInputElement)) return;
		let n = yN(t);
		n !== null && this.search(n, t);
	}
	search(e, t) {
		let n = e.querySelector(mN);
		if (n === null) return;
		let r = im(t.value, e);
		if (r.length === 0) {
			this.clear(e, n);
			return;
		}
		this.active.has(e) || this.active.set(e, {
			field: t,
			openBefore: bN(n)
		}), e.setAttribute(Xt, ""), Uy(e, n, !this.filter(n, r));
	}
	filter(e, t) {
		let n = null, r = !1, i = !1;
		for (let a of xN(e)) {
			let e = SN(a);
			if (e === "header") {
				n !== null && wN(n, r), n = a, r = !1;
				continue;
			}
			let o = e !== "separator" && this.match(a, t);
			wN(a, o), r ||= o, i ||= o;
		}
		return n !== null && wN(n, r), i;
	}
	match(e, t) {
		let n = om(CN(e), t), r = e.hasAttribute("data-ui-menu-group") ? e.querySelector(_N) : null;
		if (r === null) return n;
		if (n) return TN(r), e.removeAttribute(Ut), !0;
		let i = this.filter(r, t);
		return e.toggleAttribute(Ut, i), i;
	}
	clear(e, t) {
		TN(t), e.removeAttribute(Xt), xN(t).length > 0 && Uy(e, t, !1);
		let n = this.active.get(e);
		if (n === void 0) return;
		this.active.delete(e);
		let r = e.hasAttribute(Bt);
		for (let e of t.querySelectorAll(`[${Vt}]:not([${Ht}])`)) e.toggleAttribute(Ut, !r && n.openBefore.has(e.getAttribute("data-ui-key") ?? e));
	}
	reconcile(e) {
		for (let t of e) {
			let e = this.active.get(t);
			e !== void 0 && (t.hasAttribute("data-ui-collapsed") && (e.field.value = "", e.field.blur()), this.search(t, e.field));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "ArrowDown" || e.defaultPrevented || !A(e) || !(e.target instanceof HTMLInputElement)) return;
		let t = yN(e.target), n = t === null ? void 0 : VO(t).find(M);
		n !== void 0 && (e.preventDefault(), n.focus());
	}
};
function yN(e) {
	let t = e.closest(fN), n = t?.querySelector(pN) ?? null;
	return t !== null && n !== null && n.contains(e) ? t : null;
}
function bN(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e.querySelectorAll(`[${Vt}][${Ut}]`)) t.add(n.getAttribute("data-ui-key") ?? n);
	return t;
}
function xN(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && e.classList.contains(hN));
}
function SN(e) {
	return e.querySelector(gN)?.getAttribute("data-ui-menu-item-kind") ?? "item";
}
function CN(e) {
	let t = e.querySelector(gN);
	return t === null ? "" : am(lm(t), e);
}
function wN(e, t) {
	e.toggleAttribute(Zt, !t);
}
function TN(e) {
	for (let t of e.querySelectorAll(`[${Zt}]`)) t.removeAttribute(Zt);
}
//#endregion
//#region src/interactions/screen-keyboard.ts
var EN = 120;
function DN(e) {
	return e.typing && e.tallest - e.height > EN;
}
var ON = class {
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
		let t = DN({
			height: e.height,
			tallest: this.tallest,
			typing: bc(document.activeElement)
		});
		t !== document.documentElement.hasAttribute("data-ui-keyboard-up") && document.documentElement.toggleAttribute(xr, t);
	}
}, kN = "[data-ui-root]", AN = "a[href]", jN = "ui-collapsible", MN = "ui-collapsible__bar", NN = "right-side", PN = "ui-side--left", FN = "ui-side--right", IN = "pinned", LN = class {
	root;
	holders = /* @__PURE__ */ new Map();
	openers = /* @__PURE__ */ new WeakMap();
	switchNames = /* @__PURE__ */ new Map();
	store = new cO();
	constructor(e = {}) {
		if (this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), typeof matchMedia == "function") for (let e of QD) matchMedia(e).addEventListener("change", () => this.refit());
		for (let e of document.querySelectorAll(kN)) WN(e);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Qt}]`);
		if (t !== null) {
			let e = t.closest(kN), n = t.getAttribute(Qt);
			e !== null && n !== null && this.toggle(e, n, t);
			return;
		}
		let n = e.target.closest(`[${rn}]`);
		if (n !== null) {
			let e = n.closest(kN), t = n.getAttribute(rn);
			e !== null && t !== null && this.pin(e, t, !e.hasAttribute(an(t)), n);
			return;
		}
		if (e.target.closest("[data-ui-drawer-backdrop]") !== null) {
			this.closeAll();
			return;
		}
		let r = e.target.closest(`[${xn}]`);
		if (r !== null && !e.defaultPrevented && VN(r)) {
			this.closeAll();
			return;
		}
		let i = e.target.closest(`${AN}, .${y}`), a = i?.closest(`[${ln}]`), o = a?.parentElement ?? null;
		i !== null && a != null && o?.getAttribute("data-ui-drawer-open") === a.getAttribute("data-ui-region") && HN(i) && this.close(o);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || k(e)) return;
		if (e.key === "Tab") {
			this.trapTab(e);
			return;
		}
		if (e.key !== "Escape" || uc(e) || Zp()) return;
		let t = !1;
		for (let { shell: e, drawer: n, modal: r } of this.openDrawers()) !r && !n.contains(document.activeElement) || (this.close(e), t = !0);
		t && e.preventDefault();
	}
	trapTab(e) {
		for (let { drawer: t, modal: n } of this.openDrawers()) n && cd(t, e);
	}
	openDrawers() {
		let e = [];
		for (let t of document.querySelectorAll(`${kN}[${$t}]`)) {
			let n = t.getAttribute("data-ui-drawer-open") ?? "", r = GN(t, n);
			r !== null && !Gp(r) && e.push({
				shell: t,
				drawer: r,
				modal: UN(t, n)
			});
		}
		return e;
	}
	refit() {
		for (let e of document.querySelectorAll(`${kN}[${$t}]`)) {
			let t = e.getAttribute("data-ui-drawer-open") ?? "", n = GN(e, t), r = this.openers.get(e);
			n === null || !tO(e, t) ? this.close(e) : r?.isConnected === !0 && this.placeSwitch(n, r);
		}
	}
	toggle(e, t, n) {
		if (e.getAttribute("data-ui-drawer-open") === t) {
			this.close(e);
			return;
		}
		let r = GN(e, t);
		r === null || r.hasAttribute("data-ui-bottom-bar") || !tO(e, t) || (e.hasAttribute("data-ui-drawer-open") && this.close(e), e.setAttribute($t, t), this.openers.set(e, n), this.markToggles(e), this.hold(r, UN(e, t)), this.placeSwitch(r, n), this.focusInto(e, t, r, document.activeElement, Yu(), performance.now() + L.normal));
	}
	hold(e, t) {
		if (this.holders.has(e) || e.hasAttribute("data-ui-focus-holder")) return;
		let n = !e.hasAttribute("tabindex"), r = t && !e.hasAttribute("aria-label") && !e.hasAttribute("aria-labelledby");
		this.holders.set(e, {
			modal: t,
			addsTabIndex: n,
			addsName: r,
			role: e.getAttribute("role")
		}), n && (e.tabIndex = -1), t && (e.setAttribute(qr, ""), e.setAttribute("role", "dialog"), e.setAttribute("aria-modal", "true"), r && e.setAttribute("aria-label", T.text("ui.side.panel")));
	}
	placeSwitch(e, t) {
		let n = RN(e), r = t.getBoundingClientRect();
		if (n === null) return;
		this.switchNames.has(n) || this.switchNames.set(n, n.getAttribute("aria-label")), n.setAttribute("aria-label", T.text("ui.side.close"));
		let i = n.parentElement?.classList.contains(MN) === !0 ? n.parentElement : n;
		if (r.width === 0 || r.height === 0) {
			n.removeAttribute(en), i.removeAttribute(tn);
			return;
		}
		n.style.setProperty("--ui-drawer-switch-width", `${r.width}px`), n.style.setProperty("--ui-drawer-switch-height", `${r.height}px`), n.style.setProperty("--ui-drawer-switch-x", "0px"), i.style.setProperty("--ui-drawer-switch-y", "0px"), n.setAttribute(en, ""), i.setAttribute(tn, "");
		let a = n.getBoundingClientRect(), o = e.getBoundingClientRect(), s = BN(r.left - e.offsetLeft, e.clientWidth - a.width), c = BN(r.top - o.top, e.clientHeight - a.height);
		n.style.setProperty("--ui-drawer-switch-x", `${s - (a.left - o.left)}px`), i.style.setProperty("--ui-drawer-switch-y", `${c - (a.top - o.top)}px`);
	}
	focusInto(e, t, n, r, i, a) {
		e.getAttribute("data-ui-drawer-open") !== t || document.activeElement !== r || n.contains(r) || (md(n, i ? n : null), performance.now() < a && document.activeElement === r && requestAnimationFrame(() => this.focusInto(e, t, n, r, i, a)));
	}
	pin(e, t, n, r) {
		let i = GN(e, t);
		if (i === null || iO(e, t)) return;
		let a = i.contains(r);
		if (n && e.getAttribute("data-ui-drawer-open") === t && this.close(e, !a), e.toggleAttribute(an(t), n), WN(e), !n && a && i.contains(document.activeElement)) {
			let n = this.returnTarget(e, t);
			n !== null && I(n);
		}
		let o = i.querySelector(`[${Ke}]`);
		o !== null && this.store.write(o, IN, n ? "true" : null, n ? {
			root: !0,
			attributes: { [an(t)]: "" }
		} : null);
	}
	closeAll() {
		for (let e of document.querySelectorAll(`${kN}[${$t}]`)) this.close(e);
	}
	close(e, t = !0) {
		let n = e.getAttribute($t);
		if (e.removeAttribute($t), this.markToggles(e), n === null) return;
		let r = GN(e, n), i = document.activeElement;
		if (t && (i === null || i === document.body || r?.contains(i) === !0)) {
			let t = this.returnTarget(e, n);
			t !== null && r !== null && r.contains(i) ? Sd(t, r) : t !== null && I(t);
		}
		this.release(r), this.renameSwitch(r);
	}
	returnTarget(e, t) {
		let n = this.openers.get(e);
		if (this.openers.delete(e), n?.isConnected === !0 && n.getAttribute("data-ui-drawer-toggle") === t && n.checkVisibility()) return n;
		let r = [...e.querySelectorAll(`[${Qt}="${x(t)}"]`)];
		return r.find((e) => e.checkVisibility()) ?? r[0] ?? null;
	}
	markToggles(e) {
		let t = e.getAttribute($t);
		for (let n of e.querySelectorAll(`[${Qt}]`)) n.setAttribute("aria-expanded", String(n.getAttribute(Qt) === t));
	}
	release(e) {
		let t = e === null ? void 0 : this.holders.get(e);
		e !== null && t !== void 0 && (this.holders.delete(e), t.addsTabIndex && e.removeAttribute("tabindex"), t.modal && (e.removeAttribute(qr), e.removeAttribute("aria-modal"), t.role === null ? e.removeAttribute("role") : e.setAttribute("role", t.role), t.addsName && e.removeAttribute("aria-label")));
	}
	renameSwitch(e) {
		for (let [t, n] of this.switchNames) e?.contains(t) !== !0 && t.isConnected || (this.switchNames.delete(t), n === null ? t.removeAttribute("aria-label") : t.setAttribute("aria-label", n));
	}
};
function RN(e) {
	for (let t of e.querySelectorAll(`[${xn}]`)) if (VN(t) && t.checkVisibility() && zN(t.closest(`.${jN}`), e)) return t;
	return null;
}
function zN(e, t) {
	let n = e;
	for (; n !== null && n !== t;) {
		let e = n.parentElement;
		if (e === null || e.firstElementChild !== n) return !1;
		n = e;
	}
	return n === t;
}
function BN(e, t) {
	return Math.max(0, Math.min(e, t));
}
function VN(e) {
	let t = e.closest(`.${jN}`), n = t?.closest(`[${ln}]`), r = n?.getAttribute(ln), i = n?.parentElement;
	return t == null || t.hasAttribute("data-ui-collapsed") || r == null || i == null ? !1 : i.matches(kN) && i.getAttribute("data-ui-drawer-open") === r && t.classList.contains(r === NN ? FN : PN);
}
function HN(e) {
	return !e.classList.contains("ui-menu-item") || BO(e) && e.closest(Kr) === null;
}
function UN(e, t) {
	return !(e.getAttribute("data-ui-drawer-modeless") ?? "").split(" ").includes(t);
}
function WN(e) {
	for (let t of e.querySelectorAll(`[${rn}]`)) t.setAttribute("aria-pressed", String(e.hasAttribute(an(t.getAttribute("data-ui-drawer-pin") ?? ""))));
}
function GN(e, t) {
	return e.querySelector(`:scope > [${ln}="${x(t)}"]`);
}
//#endregion
//#region src/interactions/collapsible-engine.ts
var KN = "ui-collapsible", qN = "ui-collapsible__content", JN = "ui-collapsible__bar", YN = "ui-collapsible__bar-content", XN = "collapsed", ZN = class {
	root;
	store = new cO();
	restored = /* @__PURE__ */ new WeakSet();
	folds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.restoreEach(this.root.querySelectorAll(`.${KN}`)), R(this.root, `.${KN}`, {
			childList: !0,
			attributeFilter: [Bt]
		}, (e) => this.restoreEach(e));
	}
	restoreEach(e) {
		for (let t of e) {
			if (this.restored.has(t)) {
				this.apply(t, t.hasAttribute(Bt));
				continue;
			}
			this.restored.add(t), this.restore(t);
		}
	}
	restore(e) {
		if (this.toggleOf(e) === null) return;
		let t = this.store.read(e, XN);
		t !== null && this.apply(e, t === "true");
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${xn}]`), n = t?.closest(`.${KN}`) ?? null;
		if (t === null || n === null || VN(t)) return;
		e.preventDefault();
		let r = !n.hasAttribute(Bt), i = this.partsOf(n, t);
		this.cancelFold(n);
		let a = $N(n, i);
		this.apply(n, r), this.playFold(n, i, a, r), this.store.write(n, XN, r ? "true" : "false", r ? { attributes: { [Bt]: "" } } : null);
	}
	apply(e, t) {
		e.toggleAttribute(Bt, t), this.toggleOf(e)?.setAttribute("aria-expanded", t ? "false" : "true");
	}
	partsOf(e, t) {
		return {
			content: e.querySelector(`:scope > .${qN}`),
			bar: e.querySelector(`:scope > .${JN} > .${YN}`),
			toggle: t
		};
	}
	toggleOf(e) {
		return e.querySelector(`:scope > [${xn}], :scope > .${JN} > [${xn}]`);
	}
	playFold(e, t, n, r) {
		if (typeof e.animate != "function" || xf()) return;
		let i = tP(QN(e), n, $N(e, t), r);
		if (i === null) return;
		e.setAttribute(Sn, ""), e.offsetWidth;
		let a = {
			duration: L.normal,
			easing: L.ease
		}, o = [e.animate(i.component, a)];
		t.content !== null && o.push(t.content.animate(i.content, a)), t.bar !== null && o.push(t.bar.animate(i.bar, a)), i.toggle !== null && o.push(t.toggle.animate(i.toggle, a)), this.folds.set(e, o), Promise.allSettled(o.map((e) => e.finished)).then(() => {
			this.folds.get(e) === o && (this.folds.delete(e), e.removeAttribute(Sn));
		});
	}
	cancelFold(e) {
		let t = this.folds.get(e);
		if (t !== void 0) {
			this.folds.delete(e), e.removeAttribute(Sn);
			for (let e of t) e.cancel();
		}
	}
};
function QN(e) {
	return e.classList.contains("ui-side--top") || e.classList.contains("ui-side--bottom") ? "height" : "width";
}
function $N(e, t) {
	let n = QN(e), r = eP(n), i = e.getBoundingClientRect(), a = t.content?.getBoundingClientRect(), o = t.toggle.getBoundingClientRect();
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
function eP(e) {
	return e === "width" ? "height" : "width";
}
function tP(e, t, n, r) {
	let i = eP(e), a = t.component !== n.component, o = Math.abs(t.componentAcross - n.componentAcross) >= .5;
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
function nP(e, t) {
	if (typeof ResizeObserver == "function") {
		let n = new ResizeObserver(() => t(e));
		return n.observe(e), () => n.disconnect();
	}
	let n = () => t(e);
	return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
}
//#endregion
//#region src/interactions/grid-splitter-engine.ts
var rP = "ui-grid-splitter", iP = "ui-container", aP = "ui-orientation--vertical", oP = 16, sP = {
	slot: "columns",
	authored: "--ui-columns",
	split: "--ui-split-columns",
	limits: Cn,
	computed: "gridTemplateColumns",
	lineStart: "gridColumnStart",
	lineEnd: "gridColumnEnd",
	coordinate: "clientX",
	decrease: "ArrowLeft",
	increase: "ArrowRight"
}, cP = {
	slot: "rows",
	authored: "--ui-rows",
	split: "--ui-split-rows",
	limits: wn,
	computed: "gridTemplateRows",
	lineStart: "gridRowStart",
	lineEnd: "gridRowEnd",
	coordinate: "clientY",
	decrease: "ArrowUp",
	increase: "ArrowDown"
}, lP = class {
	root;
	store = new cO();
	restored = /* @__PURE__ */ new WeakMap();
	warner = new p();
	drag;
	placedTiers = /* @__PURE__ */ new WeakMap();
	waiting = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new um({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${rP}`),
			begin: (e) => this.resolveContext(e),
			coordinate: (e) => e.axis.coordinate,
			move: (e, t) => {
				this.apply(e, t, 0) && this.reportPosition(e.splitter, !0);
			},
			end: (e, t) => {
				this.foldNarrow(e), this.remember(t), this.reportPosition(e), this.writeBack(e, t);
			}
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.prepareEach(this.root.querySelectorAll(`.${rP}`)), R(this.root, `.${rP}`, { childList: !0 }, (e) => this.prepareEach(e)), R(this.root, `.${rP}`, { attributeFilter: [En] }, (e) => this.takeEach(e)), window.addEventListener("resize", () => this.reportEach());
	}
	prepareEach(e) {
		for (let t of e) {
			let e = fP(t);
			e !== null && (this.restore(e, pP(t)), this.place(t), this.reportPosition(t));
		}
	}
	restore(e, t) {
		let n = this.restored.get(e);
		if (n === void 0 && (n = /* @__PURE__ */ new Set(), this.restored.set(e, n)), n.has(t.slot)) return;
		n.add(t.slot);
		let r = this.store.readJson(e, t.slot);
		if (r !== null) for (let n of wf) {
			let i = r[n], a = kf(t.split, n);
			i !== void 0 && e.style.getPropertyValue(a).length === 0 && e.style.setProperty(a, i);
		}
	}
	place(e) {
		let t = bP(e);
		if (t === null) return;
		if (e.getClientRects().length === 0) {
			this.waitForBox(e);
			return;
		}
		this.stopWaiting(e);
		let n = this.resolveContext(e);
		if (n === null || (this.placedTiers.set(e, n.tier), !e.hasAttribute("data-ui-bind-position") && hP(n.container, n.axis, n.tier) !== void 0)) return;
		let r = xs(n.sizes, n.runs, t);
		Math.abs(r) >= 1 && this.apply(n, r) && this.remember(n);
	}
	waitForBox(e) {
		this.waiting.has(e) || this.waiting.set(e, nP(e, () => {
			!e.isConnected || bP(e) === null ? this.stopWaiting(e) : e.getClientRects().length > 0 && (this.place(e), this.reportPosition(e));
		}));
	}
	stopWaiting(e) {
		this.waiting.get(e)?.(), this.waiting.delete(e);
	}
	takeEach(e) {
		for (let t of e) bP(t) === null && t.hasAttribute("data-ui-bind-position") ? this.reset(t, !1) : this.place(t), this.reportPosition(t);
	}
	reportEach() {
		let e = Of();
		for (let t of this.root.querySelectorAll(`.${rP}`)) this.placedTiers.has(t) && this.placedTiers.get(t) !== e && this.place(t), this.reportPosition(t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || !A(e)) return;
		let t = e.target.closest(`.${rP}`);
		if (t === null || this.drag.active || E(t)) return;
		if (e.key === "Enter") {
			e.preventDefault(), this.reset(t);
			return;
		}
		let n = this.resolveContext(t);
		if (n === null) return;
		let r = SP(t), i = n.sizes.reduce((e, t) => e + t, 0), a;
		switch (e.key) {
			case n.axis.decrease:
				a = -r;
				break;
			case n.axis.increase:
				a = r;
				break;
			case "PageUp":
			case "PageDown":
				a = Qo(r, i) * yP(e.key, n.axis);
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
		let n = fP(e);
		if (n === null) return;
		let r = pP(e);
		for (let e of wf) n.style.removeProperty(kf(r.split, e));
		this.store.write(n, r.slot, null), this.placedTiers.delete(e), e.hasAttribute("data-ui-bind-position") || this.place(e), this.reportPosition(e), t && e.hasAttribute("data-ui-bind-position") && e.hasAttribute("data-ui-splitter-position") && (e.removeAttribute(En), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	writeBack(e, t) {
		if (!e.hasAttribute("data-ui-bind-position")) return;
		let n = xP(bs(gP(t.container, t.axis), t.runs));
		e.getAttribute("data-ui-splitter-position") !== n && (e.setAttribute(En, n), this.placedTiers.set(e, t.tier), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	handleDoubleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${rP}`) : null;
		t !== null && this.reset(t);
	}
	foldNarrow(e) {
		let t = this.resolveContext(e), n = t === null ? 0 : Ts(t.sizes, t.runs, 48);
		t !== null && n !== 0 && this.apply(t, n, 0);
	}
	apply(e, t, n = 48) {
		let r = us(e.tracks, e.sizes, e.runs, t, n);
		return r !== null && (e.container.style.setProperty(kf(e.axis.split, e.tier), rs(r)), !0);
	}
	remember(e) {
		let { container: t, axis: n } = e, r = {}, i = {};
		for (let e of wf) {
			let a = kf(n.split, e), o = t.style.getPropertyValue(a).trim();
			o.length > 0 && (r[e] = o, i[a] = o);
		}
		let a = { styles: i };
		this.store.write(t, n.slot, Object.keys(r).length === 0 ? null : JSON.stringify(r), a);
	}
	resolveContext(e) {
		let t = fP(e);
		if (t === null) return this.warner.warn(e, "a grid splitter must be a direct child of a container."), null;
		let n = pP(e), r = Of(), i = mP(t, n, r), a = i === null ? null : $o(i);
		if (a === null) return this.warner.warn(e, "the container's track list could not be read.", { template: i }), null;
		let o = ss(a, os(t.getAttribute(n.limits))), s = gP(t, n), c = _P(e, n);
		if (c === null || c >= o.length || s.length < o.length) return this.warner.warn(e, "the splitter's track could not be found in its container.", {
			index: c,
			tracks: o.length,
			sizes: s.length
		}), null;
		o[c].kind === "star" && this.warner.warn(e, "a grid splitter sits in a star track and shares the room it divides; give it an Auto or Absolute track.");
		let l = cs(c, vP(t, n).map((e) => _P(e, n)).filter((e) => e !== null && e !== c), o.length);
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
	reportPosition(e, t = !1) {
		let n = fP(e);
		if (n === null) return;
		let r = pP(e), i = _P(e, r), a = gP(n, r), o = vP(n, r).map((e) => _P(e, r)).filter((e) => e !== null && e !== i), s = i === null ? null : cs(i, o, a.length);
		if (s === null) return;
		e.setAttribute("aria-valuemin", "0"), e.setAttribute("aria-valuemax", "100"), e.setAttribute("aria-valuenow", String(ys(a, s)));
		let c = uP(a, s.before) ? "before" : uP(a, s.after) ? "after" : null;
		c === null ? e.removeAttribute(wr) : e.getAttribute("data-ui-split-edge") !== c && e.setAttribute(wr, c), dP(n, t ? {
			axis: r,
			tracks: Es(a, s, 48)
		} : null);
	}
};
function uP(e, t) {
	return t.every((t) => (e[t] ?? 0) < 1);
}
function dP(e, t) {
	let n = [sP, cP].filter((t) => vP(e, t).length > 0).map((t) => ({
		axis: t,
		sizes: gP(e, t)
	}));
	for (let r of e.children) {
		if (!(r instanceof HTMLElement)) continue;
		let e = getComputedStyle(r), i = r.classList.contains(rP) ? pP(r) : null, a = n.some(({ axis: n, sizes: r }) => n !== i && Os(e[n.lineStart], e[n.lineEnd], r, t?.axis === n ? t.tracks : void 0));
		a !== r.hasAttribute("data-ui-split-folded") && r.toggleAttribute(Cr, a);
	}
}
function fP(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(iP) ? t : null;
}
function pP(e) {
	return e.classList.contains(aP) ? sP : cP;
}
function mP(e, t, n) {
	let r = hP(e, t, n);
	if (r !== void 0) return r;
	let i = e.style.getPropertyValue(t.authored).trim();
	return i.length > 0 ? i : null;
}
function hP(e, t, n) {
	return Mf(n, (n) => e.style.getPropertyValue(kf(t.split, n)).trim() || void 0);
}
function gP(e, t) {
	return getComputedStyle(e)[t.computed].split(" ").map(parseFloat).filter((e) => Number.isFinite(e));
}
function _P(e, t) {
	let n = Number(getComputedStyle(e)[t.lineStart]);
	return Number.isInteger(n) && n >= 1 ? n - 1 : null;
}
function vP(e, t) {
	let n = [];
	for (let r of e.children) r instanceof HTMLElement && r.classList.contains(rP) && pP(r) === t && n.push(r);
	return n;
}
function yP(e, t) {
	return t.increase === "ArrowDown" ? e === "PageDown" ? 1 : -1 : e === "PageUp" ? 1 : -1;
}
function bP(e) {
	return Ss(e.getAttribute(En));
}
function xP(e) {
	return String(Math.round(e * 1e4) / 1e4);
}
function SP(e) {
	let t = Number(e.getAttribute(Tn));
	return Number.isFinite(t) && t > 0 ? t : oP;
}
//#endregion
//#region src/interactions/pane-container-engine.ts
var CP = "ui-pane-container", wP = "ui-pane-container__place", TP = "ui-pane-container__pane", EP = "ui-pane-container__grip", DP = "data-ui-pane-lifted", OP = "data-ui-pane-target", kP = "data-ui-pane-moving", AP = "data-ui-pane-near", jP = "panes", MP = ",", NP = 32, PP = class {
	root;
	store = new cO();
	drag;
	restored = /* @__PURE__ */ new WeakSet();
	held = null;
	near = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new um({
			root: this.root,
			resolveHandle: (e) => IP(e),
			begin: (e, t) => this.lift(e, t),
			move: (e, t, n) => this.follow(e, n),
			end: (e, t) => this.put(t),
			cancel: (e, t) => this.putBack(t),
			takenBack: (e, t) => this.putBack(t)
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), { passive: !0 }), this.root.addEventListener("pointerout", (e) => this.handlePointerOut(e), { passive: !0 }), this.arrangeEach(this.root.querySelectorAll(`.${CP}`), !1), R(this.root, `.${CP}`, {
			childList: !0,
			attributeFilter: [Dn],
			relevant: RP
		}, (e) => this.arrangeEach(zP(e), !0));
	}
	arrangeEach(e, t) {
		for (let n of e) {
			let e = !this.restored.has(n);
			e && (this.restored.add(n), this.restore(n)), n.hasAttribute(kP) || WP(n, HP(n), t && !e);
		}
	}
	restore(e) {
		if (e.hasAttribute("data-ui-bind-layout")) return;
		let t = this.store.read(e, jP);
		t !== null && e.setAttribute(Dn, t);
	}
	lift(e, t) {
		this.dropStaleHold();
		let n = e.parentElement, r = n?.parentElement, i = r?.parentElement;
		if (this.held !== null || n === null || r == null || i == null || VP(i).length < 2) return null;
		if (typeof n.getAnimations == "function") for (let e of n.getAnimations()) e.cancel();
		return n.setAttribute(DP, ""), i.setAttribute(kP, ""), {
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
		e.pane.style.transform = `translate(${t.x - e.start.x}px, ${t.y - e.start.y}px)`, this.mark(e, YP(e.container, e.origin, t));
	}
	mark(e, t) {
		e.target !== t && (e.target?.removeAttribute(OP), t?.setAttribute(OP, ""), e.target = t);
	}
	put(e) {
		let t = e.target, n = e.pane.parentElement, r = t?.querySelector(`:scope > .${TP}`) ?? null;
		if (t === null || n === null || r === e.pane || !e.container.isConnected) {
			this.putBack(e);
			return;
		}
		this.settle(e);
		let i = /* @__PURE__ */ new Map([[e.pane, t]]);
		r !== null && i.set(r, n), GP(i, !0), this.keep(e.container);
	}
	putBack(e) {
		this.settle(e), KP(e.pane), e.container.isConnected && WP(e.container, HP(e.container), !0);
	}
	settle(e) {
		e.target?.removeAttribute(OP), e.pane.removeAttribute(DP), e.container.removeAttribute(kP);
	}
	keep(e) {
		let t = UP(e);
		e.setAttribute(Dn, t), e.hasAttribute("data-ui-bind-layout") ? e.dispatchEvent(new Event("change", { bubbles: !0 })) : this.store.write(e, jP, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || !A(e)) return;
		this.dropStaleHold();
		let t = IP(e.target);
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
		let r = FP[e.key];
		if (r !== void 0) {
			e.preventDefault(), this.mark(n, XP(n.container, n.origin, n.target ?? n.origin, r) ?? n.target);
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
		let t = e.target instanceof Element ? LP(e.target) : null;
		this.markNear(t !== null && e.clientY - t.getBoundingClientRect().top < NP ? t : null);
	}
	markNear(e) {
		e !== this.near && (this.near?.removeAttribute(AP), e?.setAttribute(AP, ""), this.near = e);
	}
	handlePointerOut(e) {
		e instanceof PointerEvent && e.relatedTarget === null && this.markNear(null);
	}
}, FP = {
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
function IP(e) {
	let t = e.closest(`.${EP}`);
	return t?.parentElement?.parentElement?.parentElement?.classList.contains(CP) === !0 ? t : null;
}
function LP(e) {
	let t = e.closest(`.${TP}`);
	return t?.parentElement?.parentElement?.classList.contains(CP) === !0 ? t : null;
}
function RP(e) {
	if (e.type === "attributes") return e.target instanceof Element && e.target.classList.contains(CP);
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains(CP) || t.querySelector(`.${CP}`) !== null)) return !0;
	return !1;
}
function zP(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) {
		t.add(n);
		for (let e of n.querySelectorAll(`.${CP}`)) t.add(e);
	}
	return t;
}
function BP(e) {
	return Array.from(e.querySelectorAll(`:scope > .${wP}`));
}
function VP(e) {
	return BP(e).filter((e) => e.getClientRects().length > 0);
}
function HP(e) {
	return e.getAttribute(Dn);
}
function UP(e) {
	return BP(e).map((e) => e.querySelector(`:scope > .${TP}`)?.getAttribute("data-ui-pane") ?? "").join(MP);
}
function WP(e, t, n) {
	let r = BP(e), i = JP(r.map((e) => e.getAttribute("data-ui-pane-place") ?? ""), t), a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
	for (let e of r) {
		let t = e.querySelector(`:scope > .${TP}`), n = t?.getAttribute(On);
		t != null && n != null && a.set(n, t);
	}
	r.forEach((e, t) => {
		let n = a.get(i[t]);
		n !== void 0 && n.parentElement !== e && o.set(n, e);
	}), o.size > 0 && GP(o, n);
}
function GP(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let t of e.keys()) n.set(t, t.getBoundingClientRect());
	for (let [t, n] of e) t.style.transform = "", n.append(t);
	if (!t || xf()) return;
	let r = e.size + 1;
	for (let [e, t] of n) {
		let n = typeof e.animate == "function" ? qP(t, e.getBoundingClientRect()) : null, i = String(r--);
		n !== null && e.animate(n.map((e) => ({
			...e,
			zIndex: i
		})), {
			duration: L.normal + 60,
			easing: L.ease
		});
	}
}
function KP(e) {
	let t = e.style.transform;
	e.style.transform = "", !(t.length === 0 || t === "translate(0px, 0px)" || xf() || typeof e.animate != "function") && e.animate([{ transform: t }, { transform: "none" }], {
		duration: L.normal,
		easing: L.ease
	});
}
function qP(e, t) {
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
function JP(e, t) {
	let n = new Set(e), r = /* @__PURE__ */ new Set(), i = e.map(() => null), a = t === null || t.length === 0 ? [] : t.split(MP).map((e) => e.trim());
	for (let e = 0; e < i.length && e < a.length; e++) n.has(a[e]) && !r.has(a[e]) && (i[e] = a[e], r.add(a[e]));
	let o = e.filter((e) => !r.has(e));
	return i.map((e) => e ?? o.shift() ?? "");
}
function YP(e, t, n) {
	for (let r of VP(e)) {
		if (r === t) continue;
		let e = r.getBoundingClientRect();
		if (n.x >= e.left && n.x <= e.right && n.y >= e.top && n.y <= e.bottom) return r;
	}
	return null;
}
function XP(e, t, n, r) {
	let i = VP(e).map((e) => ({
		place: e,
		box: e.getBoundingClientRect()
	})), a = i.find((e) => e.place === n)?.box;
	if (a === void 0) return null;
	let o = QP(ZP(a), i.map((e) => e.place === t || e.place === n ? null : ZP(e.box)), r);
	return o === null ? null : i[o].place;
}
function ZP(e) {
	return {
		x: e.left + e.width / 2,
		y: e.top + e.height / 2
	};
}
function QP(e, t, n) {
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
var $P = "ui-split-button", eF = "ui-split-button__main", tF = "ui-split-button__toggle", nF = "ui-split-button__menu", rF = "ui-split-button--open", iF = class {
	root;
	menus = new Km({
		show: ({ owner: e }) => e.classList.add(rF),
		hide: ({ owner: e }) => e.classList.remove(rF),
		closesWhenReadOnly: !1,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), document.addEventListener("click", (e) => this.handleChoice(e), !1);
	}
	handleClick(e) {
		let t = aF(e.target);
		if (t !== null) {
			e.preventDefault(), this.menus.isOpen(t) ? this.menus.close(t) : this.openMenu(t);
			return;
		}
		let n = this.menus.current;
		n !== null && e.target instanceof Element && e.target.closest(`.${eF}`)?.closest(`.${$P}`) === n && this.menus.close(n);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "ArrowDown" && e.key !== "ArrowUp" || !A(e)) return;
		let t = aF(e.target);
		t === null || this.menus.isOpen(t) || (e.preventDefault(), this.openMenu(t, e.key === "ArrowUp"));
	}
	handleChoice(e) {
		let t = this.menus.current;
		if (t === null || !(e.target instanceof Element)) return;
		let n = oF(t), r = e.target.closest(`.${y}`);
		n !== null && r !== null && n.contains(r) && BO(r) && this.menus.close(t);
	}
	openMenu(e, t = !1) {
		let n = oF(e), r = n?.querySelector(".ui-menu") ?? null;
		if (n === null || r === null) return;
		let i = e.getAttribute("data-ui-split-placement") ?? "";
		this.menus.open({
			owner: e,
			popup: n,
			anchor: e,
			placement: { placement: Pf(i) ? i : "bottom-end" },
			openers: sF(e)
		}) && _d(r, VO(r), t);
	}
};
function aF(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${tF}, .${eF}`), n = t?.closest(`.${$P}`) ?? null;
	return t === null || n === null || t.classList.contains(eF) && n.getAttribute("data-ui-split-mode") !== "menu" ? null : n;
}
function oF(e) {
	return e.querySelector(`:scope > .${nF}`);
}
function sF(e) {
	return [...e.querySelectorAll(":scope > [aria-haspopup]")];
}
//#endregion
//#region src/interactions/button-group-engine.ts
var cF = "ui-button-group", lF = "ui-button-group__item", uF = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${cF}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), R(this.root, `.${cF}`, {
			childList: !0,
			attributeFilter: [jr]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-selected-key") ?? "", n = [], r = null;
		for (let i of this.ownItems(e)) {
			let e = t.length > 0 && i.getAttribute("data-ui-key") === t, a = dF(i);
			i.toggleAttribute(Ar, e), a !== null && (a.setAttribute("aria-pressed", e ? "true" : "false"), n.push(a), e && (r = a));
		}
		j(n, r ?? n.find(M) ?? null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${lF}`), n = t?.closest(`.${cF}`) ?? null;
		if (t === null || n === null || t.closest(`.${cF}`) !== n || E(n)) return;
		let r = dF(t);
		r !== null && E(r) || this.choose(n, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${lF} > .${Qr}`), n = t?.closest(`.${cF}`) ?? null;
		if (t === null || n === null || !A(e)) return;
		let r = this.ownItems(n).map(dF).filter((e) => e !== null), i = Pc({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault(), i.focus({ preventScroll: !0 });
		let a = i.closest(`.${lF}`);
		a !== null && this.choose(n, a);
	}
	choose(e, t) {
		il(e, t.getAttribute("data-ui-key") ?? "", {
			attribute: jr,
			bindingAttribute: Nr,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return nl(e, `.${lF}`, `.${cF}`);
	}
};
function dF(e) {
	return e.querySelector(`:scope > .${Qr}`);
}
//#endregion
//#region src/interactions/accordion-engine.ts
var fF = "ui-accordion", pF = "details", mF = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleSummaryClick(e), !0), this.root.addEventListener("toggle", (e) => this.handleToggle(e), !0), this.normalizeAll(this.root.querySelectorAll(`.${fF}`)), R(this.root, `.${fF}`, { childList: !0 }, (e) => this.normalizeAll(e));
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
		if (!(t === null || !t.classList.contains(fF))) for (let n of this.sectionsOf(t)) n !== e && n.open && (n.open = !1);
	}
	sectionsOf(e) {
		return [...e.querySelectorAll(`:scope > ${pF}`)];
	}
}, hF = "ui-tab-overflow", gF = "ui-tab-overflow__menu", _F = "ui-tab-overflow__menu--open", vF = "ui-tab-overflow__entry", yF = "ui-tab-overflow__entry--current", bF = class {
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
		this.options = e, this.list = new CF(e.pick);
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
		let r = () => e.classList.add(this.options.overflowingClass), i = this.options.trailing === !0 ? this.fitTrailing(t, r) : xF({
			...t,
			hiddenClass: this.options.hiddenClass,
			showButton: r
		});
		e.classList.toggle(this.options.overflowingClass, i), i || this.closeListOf(e);
	}
	fitTrailing(e, t) {
		for (let t of e.captions) this.resizes?.observe(t);
		return SF(e, this.options.hiddenClass, t);
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
function xF(e) {
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
function SF(e, t, n) {
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
var CF = class {
	menu;
	button = null;
	list = new Km({
		show: ({ popup: e }) => e.classList.add(_F),
		hide: ({ popup: e }) => {
			e.classList.remove(_F), this.button = null;
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e) || this.button !== null && t.includes(this.button),
		onWindowBlur: !0,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	pick;
	constructor(e) {
		this.pick = e, this.menu = document.createElement("div"), this.menu.className = gF, this.menu.setAttribute("role", "menu"), this.menu.addEventListener("click", (e) => this.handleClick(e)), this.menu.addEventListener("keydown", (e) => this.handleKeydown(e)), this.menu.addEventListener("pointermove", (e) => this.handlePointerMove(e));
	}
	isOpenFor(e) {
		return this.list.isOpen(e);
	}
	open(e, t, n) {
		this.close(), this.menu.replaceChildren(...n.map(wF)), this.menu.parentElement === null && document.body.appendChild(this.menu);
		let r = this.menu.querySelector(`.${yF}`);
		this.button = e, Wf(e, this.menu);
		let i = {
			owner: t,
			popup: this.menu,
			anchor: e,
			placement: { placement: "bottom-end" },
			openers: [e],
			returnFocus: () => e
		};
		fD(this.list, i, this.entries(), r) || (this.button = null);
	}
	close() {
		this.list.close();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${vF}`), n = t?.getAttribute("data-ui-key") ?? null, r = this.list.current;
		t === null || n === null || r === null || E(t) || (this.close(), this.pick(r, n));
	}
	handleKeydown(e) {
		e.defaultPrevented || pD(e, this.entries());
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${vF}`) : null;
		t !== null && gD(t, this.entries());
	}
	entries() {
		return Array.from(this.menu.querySelectorAll(`.${vF}`));
	}
};
function wF(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${vF} ${$r}`, t.classList.toggle(yF, e.current), t.setAttribute("role", "menuitem"), t.setAttribute(_, e.key), t.textContent = e.title, e.current && t.setAttribute("aria-current", "true"), e.disabled && (t.classList.add(Br), t.setAttribute("aria-disabled", "true")), t;
}
//#endregion
//#region src/interactions/tab-switch.ts
var TF = "data-ui-caption-text", EF = ".ui-text__title";
function DF(e) {
	for (let t of e.querySelectorAll(EF)) {
		let e = t.textContent ?? "";
		t.getAttribute(TF) !== e && t.setAttribute(TF, e);
	}
}
function OF(e, t) {
	if (e === null || t === null || e === t || typeof t.animate != "function" || xf()) return;
	let n = e.getBoundingClientRect(), r = t.getBoundingClientRect();
	n.width !== 0 && r.width !== 0 && t.animate([{ transform: `translateX(${n.left - r.left}px) scaleX(${n.width / r.width})` }, { transform: "none" }], {
		duration: L.normal,
		easing: L.ease,
		pseudoElement: "::after"
	});
}
function kF(e) {
	if (!(e === null || xf())) for (let t of e.children) typeof t.animate == "function" && t.animate([{ opacity: 0 }, { opacity: 1 }], {
		duration: L.fast,
		easing: L.enter
	});
}
//#endregion
//#region src/interactions/tabs-engine.ts
var AF = "ui-tabs", jF = "ui-tab-header", MF = "ui-tab-header--selected", NF = "ui-tab-header--overflowed", PF = "ui-tabs--overflowing", FF = "ui-tabs--no-overflow", IF = "ui-tabs__strip", LF = "data-ui-tab-key", RF = "data-ui-tab-page", zF = class {
	root;
	fitter;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new bF({
			rootClass: AF,
			overflowingClass: PF,
			wraps: (e) => e.classList.contains(FF),
			hiddenClass: NF,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${AF}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), R(this.root, `.${AF}`, {
			childList: !0,
			attributeFilter: [Pr, ...Lr],
			relevant: (e) => !Fp(e, `[${RF}]`, `.${AF}`)
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-tabs-selected") ?? "", n = this.ownHeaders(e), r = n.filter(BF), i = al(r, t, (e) => e.getAttribute(LF) ?? "");
		if (i !== null && i !== t) {
			this.select(e, i);
			return;
		}
		let a = n.find((e) => e.classList.contains(MF)) ?? null, o = null;
		for (let e of n) {
			let n = (e.getAttribute(LF) ?? "") === t;
			e.classList.toggle(MF, n), e.setAttribute("aria-selected", n ? "true" : "false"), DF(e), n && (o = e);
		}
		this.fitHeaders(e, r, o), OF(a, o), j(n.filter((e) => !e.classList.contains(NF)), o);
		for (let n of this.ownPages(e)) n.hidden = (n.getAttribute(RF) ?? "") !== t, !n.hidden && a !== null && a !== o && kF(n);
	}
	fitHeaders(e, t, n) {
		let r = e.querySelector(`:scope > .${IF}`), i = r?.querySelector(":scope > .ui-tab-overflow") ?? null;
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownHeaders(e).find((e) => (e.getAttribute(LF) ?? "") === t)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownHeaders(e).filter(BF).map((e) => {
				let n = e.getAttribute(LF) ?? "";
				return {
					key: n,
					title: e.textContent?.trim() ?? n,
					current: n === t,
					disabled: E(e)
				};
			});
		});
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${hF}`), n = t?.closest(`.${AF}`) ?? null;
		if (t !== null && n !== null && t.closest(`.${AF}`) === n) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = e.target.closest(`.${jF}`);
		if (r === null || E(r)) return;
		let i = r.closest(`.${AF}`), a = r.getAttribute(LF);
		i !== null && a !== null && r.closest(`.${AF}`) === i && (e.preventDefault(), this.select(i, a));
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || xc(e) || !A(e)) return;
		let t = e.target.closest(`.${jF}`), n = t?.closest(`.${AF}`) ?? null;
		if (t === null || n === null) return;
		let r = Pc({
			key: e.key,
			items: this.ownHeaders(n),
			current: t,
			axis: "horizontal"
		});
		r !== null && (e.preventDefault(), this.select(n, r.getAttribute(LF) ?? ""), r.focus());
	}
	select(e, t) {
		il(e, t, {
			attribute: Pr,
			bindingAttribute: Nr,
			apply: (e) => this.apply(e)
		});
	}
	ownHeaders(e) {
		return nl(e, `.${jF}`, `.${AF}`);
	}
	ownPages(e) {
		return nl(e, `[${RF}]`, `.${AF}`);
	}
};
function BF(e) {
	return e.classList.contains(NF) || Tk(e);
}
//#endregion
//#region src/interactions/tab-out.ts
function VF(e) {
	e.hasAttribute("data-ui-tab-out") || (e.setAttribute(Fe, e.getAttribute("tabindex") ?? ""), e.setAttribute("tabindex", "-1"));
}
function HF(e) {
	let t = e.getAttribute(Fe);
	t !== null && (e.removeAttribute(Fe), t.length === 0 ? e.removeAttribute("tabindex") : e.setAttribute("tabindex", t));
}
function UF(e) {
	return e.tabIndex >= 0 || e.hasAttribute("data-ui-tab-out");
}
//#endregion
//#region src/interactions/command-bar-engine.ts
var WF = "ui-command-bar", GF = "ui-command-bar__host", KF = "ui-command-bar__item", qF = "ui-command-bar__overflow", JF = "ui-command-bar--overflowing", YF = "ui-command-bar__overflowed", XF = "ui-orientation--vertical", ZF = "ui-text__title", QF = `${Fu}, [${Fe}]`, $F = class {
	root;
	fitter;
	listed = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new bF({
			rootClass: WF,
			overflowingClass: JF,
			wraps: (e) => !rI(e),
			hiddenClass: YF,
			trailing: !0,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pick(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${WF}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), R(this.root, `.${WF}`, { childList: !0 }, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = eI(e), n = e.querySelector(`:scope > .${qF}`);
		if (t === null || n === null) return;
		let r = iI(t);
		this.fitter.fit(e, {
			room: e,
			button: n,
			captions: r,
			selected: null
		}), e.classList.contains(JF) && aI(r);
		for (let e of r) Hf(e, e.classList.contains(YF) ? n : null);
		e.classList.contains(XF) ? e.setAttribute("aria-orientation", "vertical") : e.removeAttribute("aria-orientation"), tI(e, null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${qF}`), n = t?.parentElement ?? null;
		t === null || n === null || !n.classList.contains(WF) || (e.preventDefault(), this.fitter.toggleList(n, t, () => this.entriesOf(n)));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof HTMLElement) || !A(e) || xc(e)) return;
		let t = e.target.closest(`.${WF}`), n = t === null ? [] : nI(t);
		if (t === null || !n.includes(e.target)) return;
		let r = Pc({
			key: e.key,
			items: n,
			current: e.target,
			axis: t.classList.contains(XF) ? "vertical" : "horizontal"
		});
		r !== null && (e.preventDefault(), tI(t, r), r.focus());
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement ? e.target : null, n = t?.closest(`.${WF}`) ?? null;
		t !== null && n !== null && nI(n).includes(t) && tI(n, t);
	}
	entriesOf(e) {
		let t = eI(e), n = t === null ? [] : iI(t).filter((e) => e.classList.contains(KF) && e.classList.contains(YF)).map((e) => e.querySelector(b) ?? e);
		return this.listed.set(e, n), n.map((e, t) => ({
			key: String(t),
			title: oI(e),
			current: !1,
			disabled: E(e)
		}));
	}
	pick(e, t) {
		let n = this.listed.get(e)?.[Number(t)];
		n?.isConnected === !0 && !E(n) && sI(n).click();
	}
};
function eI(e) {
	return e.querySelector(`:scope > .${GF}`);
}
function tI(e, t) {
	let n = nI(e), r = n.find((e) => e.tabIndex >= 0 && M(e)), i = t ?? n.find((e) => e === document.activeElement) ?? r ?? n.find(M) ?? null;
	for (let e of n) e === i ? HF(e) : VF(e);
}
function nI(e) {
	let t = eI(e), n = [];
	for (let e of t === null ? [] : iI(t)) if (!(!e.classList.contains(KF) || e.classList.contains(YF))) for (let t of e.querySelectorAll(QF)) UF(t) && Mc(e, t) && n.push(t);
	let r = e.querySelector(`:scope > .${qF}`);
	return r !== null && e.classList.contains(JF) && n.push(r), n;
}
function rI(e) {
	let t = eI(e);
	if (t === null) return !1;
	let n = getComputedStyle(t);
	return n.flexDirection.startsWith("row") && n.flexWrap === "nowrap";
}
function iI(e) {
	let t = [];
	for (let n of Array.from(e.children)) {
		if (n.classList.contains("ui-hidden")) continue;
		if (n.hasAttribute("data-ui-group-header")) {
			t.push(n);
			continue;
		}
		let e = n.classList.contains(KF) ? n.querySelector(b) : null;
		e !== null && Tk(e) && t.push(n);
	}
	return t;
}
function aI(e) {
	let t = !1;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.classList.contains(KF) ? t ||= !r.classList.contains(YF) : t || r.classList.add(YF);
	}
}
function oI(e) {
	let t = sI(e), n = t.querySelector(`.${ZF}`)?.textContent?.trim() ?? "";
	return n.length > 0 ? n : e.getAttribute("aria-label")?.trim() || t.getAttribute("aria-label")?.trim() || t.textContent?.trim() || "";
}
function sI(e) {
	return e.matches(Fu) ? e : e.querySelector(Fu) ?? e;
}
//#endregion
//#region src/interactions/breadcrumbs-engine.ts
var cI = "ui-breadcrumbs", lI = "ui-breadcrumbs__item", uI = "ui-breadcrumb", dI = "ui-breadcrumb--current", fI = "ui-hidden", pI = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), R(this.root, `.${cI}`, {
			childList: !0,
			attributeFilter: ["class", ...Lr]
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${cI}`)) this.apply(e);
	}
	apply(e) {
		let t = nl(e, `.${lI}`, `.${cI}`);
		mI(t);
		let n = t.filter((e) => !e.classList.contains(fI)).map((e) => e.querySelector(`.${uI}`)).filter((e) => e !== null && !e.classList.contains(fI)), r = n.length === 0 ? null : n[n.length - 1];
		for (let e of n) {
			let t = e === r;
			e.classList.toggle(dI, t), t ? (e.setAttribute("aria-current", "page"), e.setAttribute("tabindex", "-1")) : (e.removeAttribute("aria-current"), e.removeAttribute("tabindex"));
		}
	}
};
function mI(e) {
	let t = wf.map(() => !1);
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n], i = wf.map((e, t) => hI(r, t));
		if (gI(r, sr, wf.filter((e, t) => i[t])), gI(r, cr, wf.filter((e, n) => !t[n])), !r.classList.contains(fI)) for (let e = 0; e < wf.length; e++) t[e] ||= !i[e];
	}
}
function hI(e, t) {
	for (let n of e.children) if (n.getAttribute(Lr[t]) === "collapsed") return !0;
	return !1;
}
function gI(e, t, n) {
	let r = n.join(" ");
	r.length === 0 ? e.removeAttribute(t) : e.getAttribute(t) !== r && e.setAttribute(t, r);
}
//#endregion
//#region src/rendering/color-bytes.ts
function W(e) {
	return Number.isFinite(e) ? Math.min(255, Math.max(0, Math.round(e))) : 0;
}
function _I(e) {
	return W(e).toString(16).padStart(2, "0").toUpperCase();
}
function vI(e, t, n, r) {
	let i = r / 255, a = (e) => Math.round(e * i + 255 * (1 - i));
	return (yI(a(e), a(t), a(n)) + .05) ** 2 > 1.05 * .05 ? "var(--ui-color-on-light)" : "var(--ui-color-on-dark)";
}
function yI(e, t, n) {
	return .2126 * bI(e) + .7152 * bI(t) + .0722 * bI(n);
}
function bI(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
//#endregion
//#region src/interactions/color-input-engine.ts
var xI = "ui-color-input", SI = "ui-color-input--open", CI = "ui-color-input__popup", wI = "ui-color-input__text", TI = "ui-color-input__row", EI = "ui-color-input__swatch--button", DI = "ui-color-input__value-input", OI = "ui-color-input__square-thumb", kI = "ui-color-input__hue-thumb", AI = "data-ui-color-toggle", jI = "data-ui-color-tab", MI = "data-ui-color-tab-selected", NI = "data-ui-color-pane", PI = "data-ui-color-pane-selected", FI = "data-ui-color-square", II = "data-ui-color-hue", LI = "data-ui-color-hex", RI = "data-ui-color-channel", zI = "data-ui-color-factor", BI = "data-ui-color-opacity", VI = "data-ui-color-name", HI = "data-ui-color-name-selected", UI = "data-ui-color-format", WI = "data-ui-color-variant", GI = "data-ui-color-no-picker", KI = "data-ui-color-no-palette", qI = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	popups = new Km({
		show: ({ owner: e }) => e.classList.add(SI),
		hide: ({ owner: e }) => e.classList.remove(SI)
	});
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${xI}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(Yi(e.components, `.${xI}`));
		}), R(this.root, `.${xI}`, {
			childList: !0,
			attributeFilter: [
				UI,
				WI,
				GI,
				KI
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), new um({
			root: this.root,
			resolveHandle: (e) => e.closest(`[${FI}], [${II}]`),
			begin: (e, t) => {
				let n = e.closest(`.${xI}`);
				if (n === null) return null;
				let r = {
					input: n,
					element: e,
					surface: e.hasAttribute(FI) ? "square" : "hue",
					stateBefore: this.states.get(n),
					valueBefore: n.querySelector(`.${DI}`)?.value ?? null
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
		let t = QI(e), n = this.states.get(e), r = n?.paneChosen === !0 ? JI(e, n.pane) : YI(e);
		if (t.length === 0 || t.startsWith("@")) return {
			...n ?? XI(r),
			pane: r,
			held: !1
		};
		if (t.startsWith("#")) {
			let i = oL(t);
			if (i === null) return n ?? XI(r);
			let [a, o, s, c] = i;
			if (n !== void 0 && n.name === null && ZI(this.resolveRgb(e, n), [
				a,
				o,
				s
			])) return {
				...n,
				pane: r,
				opacity: c,
				held: !0
			};
			let [l, u, d] = lL(a, o, s);
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
			...n ?? XI(r),
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
			let [e, a, o] = lL(n, r, i);
			t = {
				...t,
				hue: e,
				saturation: a,
				value: o
			};
		}
		let a = this.states.get(e);
		this.states.set(e, t), nL(e, "--ui-color-input-color", t.held ? cL(n, r, i, t.opacity) : "transparent"), nL(e, "--ui-color-input-solid", cL(n, r, i, 255)), nL(e, "--ui-color-input-on-color", t.held ? vI(n, r, i, t.opacity) : "inherit"), tL(e, t.held ? eL(e, n, r, i, t.opacity) : ""), this.applyPicker(e, t, n, r, i), (a === void 0 || a.name !== t.name || a.pane !== t.pane || a.held !== t.held) && (this.applyPalette(e, t), this.applyPanes(e, t));
	}
	applyPicker(e, t, n, r, i) {
		let a = e.querySelector(`[${FI}]`), o = e.querySelector(`[${II}]`), [s, c, l] = uL(t.hue, 1, 1);
		if (nL(e, "--ui-color-input-hue", cL(s, c, l, 255)), a !== null) {
			let e = a.querySelector(`.${OI}`);
			e !== null && (nL(e, "left", `${t.saturation * 100}%`), nL(e, "top", `${(1 - t.value) * 100}%`));
		}
		if (o !== null) {
			let e = o.querySelector(`.${kI}`);
			e !== null && nL(e, "top", `${t.hue / 360 * 100}%`);
		}
		rL(e, `[${LI}]`, sL(n, r, i)), rL(e, `[${RI}="r"]`, String(n)), rL(e, `[${RI}="g"]`, String(r)), rL(e, `[${RI}="b"]`, String(i)), nL(e, "--ui-color-input-opacity-fill", `${t.opacity / 255 * 100}%`), iL(e, `[${BI}]`, t.opacity);
	}
	applyPalette(e, t) {
		for (let n of e.querySelectorAll(`[${VI}]`)) n.getAttribute(VI) === t.name ? n.setAttribute(HI, "") : n.removeAttribute(HI);
		let n = t.name === null ? null : e.querySelector(`[${VI}="${t.name}"]`), r = n === null ? null : oL(n.style.getPropertyValue("--ui-color-input-chip").trim());
		nL(e, "--ui-color-input-base", r === null ? "transparent" : cL(r[0], r[1], r[2], 255)), iL(e, `[${zI}]`, t.factor);
	}
	applyPanes(e, t) {
		for (let n of e.querySelectorAll(`[${NI}]`)) n.getAttribute(NI) === t.pane ? n.setAttribute(PI, "") : n.removeAttribute(PI);
		for (let n of e.querySelectorAll(`[${jI}]`)) n.getAttribute(jI) === t.pane ? n.setAttribute(MI, "") : n.removeAttribute(MI);
	}
	resolveRgb(e, t) {
		if (t.name === null) return uL(t.hue, t.saturation, t.value);
		let n = e.querySelector(`[${VI}="${t.name}"]`), r = n === null ? null : oL(n.style.getPropertyValue("--ui-color-input-chip").trim());
		return r === null ? uL(t.hue, t.saturation, t.value) : aL([
			r[0],
			r[1],
			r[2]
		], t.factor);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${AI}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${xI}`));
			return;
		}
		let n = e.target.closest(`[${jI}]`), r = e.target.closest(`.${xI}`);
		if (r === null) return;
		if (n !== null) {
			e.preventDefault();
			let t = n.getAttribute(jI), i = this.states.get(r);
			i !== void 0 && (t === "picker" || t === "palette") && this.applyState(r, {
				...i,
				pane: t,
				paneChosen: !0
			});
			return;
		}
		let i = e.target.closest(`[${VI}]`);
		if (i !== null) {
			e.preventDefault(), this.commit(r, (e) => ({
				...e,
				name: i.getAttribute(VI)
			}));
			return;
		}
		let a = r.querySelector(`.${CI}`);
		(a === null || !e.composedPath().includes(a)) && (e.preventDefault(), this.toggle(r));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target.closest(`.${xI}`);
		if (t !== null) {
			if (e.target.hasAttribute(zI)) {
				this.commit(t, (t) => ({
					...t,
					factor: Number(e.target instanceof HTMLInputElement ? e.target.value : 0)
				}), !1);
				return;
			}
			e.target.hasAttribute(BI) && this.commit(t, (t) => ({
				...t,
				opacity: W(Number(e.target instanceof HTMLInputElement ? e.target.value : 255))
			}), !1);
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target, n = t.closest(`.${xI}`);
		if (n === null) return;
		if (t.hasAttribute(zI) || t.hasAttribute(BI)) {
			this.send(n);
			return;
		}
		if (t.hasAttribute(LI)) {
			let e = oL(t.value);
			if (e === null) {
				this.applyAll([n]);
				return;
			}
			let [r, i, a] = lL(e[0], e[1], e[2]);
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
		let r = t.getAttribute(RI);
		if (r === null) return;
		let i = this.states.get(n);
		if (i === void 0) return;
		let [a, o, s] = this.resolveRgb(n, i), c = {
			r: a,
			g: o,
			b: s
		};
		c[r] = W(Number(t.value));
		let [l, u, d] = lL(c.r, c.g, c.b);
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
		let t = e.input.querySelector(`.${DI}`);
		t !== null && e.valueBefore !== null && (t.value = e.valueBefore);
	}
	applyPoint(e, t) {
		let { input: n, element: r, surface: i } = e, a = r.getBoundingClientRect();
		if (i === "hue") {
			let e = dL((t.y - a.top) / a.height);
			this.commit(n, (t) => ({
				...t,
				hue: e * 360,
				name: null
			}), !1);
			return;
		}
		let o = dL((t.x - a.left) / a.width), s = 1 - dL((t.y - a.top) / a.height);
		this.commit(n, (e) => ({
			...e,
			saturation: o,
			value: s,
			name: null
		}), !1);
	}
	commit(e, t, n = !0) {
		let r = this.states.get(e);
		if (r === void 0 || O(e)) return;
		let i = {
			...t(r),
			held: !0
		};
		this.applyState(e, i);
		let a = e.querySelector(`.${DI}`);
		a !== null && (a.value = $I(i, this.resolveRgb(e, i)), n && this.send(e));
	}
	send(e) {
		O(e) || e.querySelector(`.${DI}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	toggle(e) {
		if (e === null || e.hasAttribute(GI) && e.hasAttribute(KI)) return;
		if (this.popups.isOpen(e)) {
			this.popups.close(e);
			return;
		}
		let t = e.querySelector(`.${CI}`);
		if (t === null) return;
		let n = e.getAttribute(WI) === "swatch", r = n ? e.querySelector(`.${EI}`) : e.querySelector(`.${TI}`), i = n ? r : r?.querySelector(`[${AI}]`) ?? null;
		this.popups.open({
			owner: e,
			popup: t,
			anchor: r ?? e,
			placement: { placement: "bottom-end" },
			openers: i === null ? [] : [i],
			focus: t.querySelector(`[${MI}]`) ?? !0
		});
	}
};
function JI(e, t) {
	return ((t) => !e.hasAttribute(t === "picker" ? GI : KI))(t) ? t : t === "picker" ? "palette" : "picker";
}
function YI(e) {
	return JI(e, "picker");
}
function XI(e) {
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
function ZI(e, t) {
	return e[0] === t[0] && e[1] === t[1] && e[2] === t[2];
}
function QI(e) {
	return e.querySelector(`.${DI}`)?.value.trim() ?? "";
}
function $I(e, t) {
	if (e.name !== null) {
		let t = e.factor === 0 ? "None" : e.factor < 0 ? "Shade" : "Tint";
		return `${e.name}/${t}/${Math.abs(e.factor)}/${e.opacity}`;
	}
	let n = sL(t[0], t[1], t[2]);
	return e.opacity === 255 ? n : `${n}${_I(e.opacity)}`;
}
function eL(e, t, n, r, i) {
	if (e.getAttribute(UI) === "rgb") return i === 255 ? `rgb(${t}, ${n}, ${r})` : `rgba(${t}, ${n}, ${r}, ${(i / 255).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")})`;
	let a = sL(t, n, r);
	return i === 255 ? a : `${a}${_I(i)}`;
}
function tL(e, t) {
	for (let n of e.querySelectorAll(`.${wI}`)) n.textContent !== t && (n.textContent = t);
}
function nL(e, t, n) {
	e !== null && e.style.getPropertyValue(t) !== n && e.style.setProperty(t, n);
}
function rL(e, t, n) {
	let r = e.querySelector(t);
	r !== null && r !== document.activeElement && r.value !== n && (r.value = n);
}
function iL(e, t, n) {
	for (let r of e.querySelectorAll(t)) r !== document.activeElement && r.value !== String(n) && (r.value = String(n));
}
function aL(e, t) {
	if (t === 0) return e;
	let n = Math.abs(t) / 10;
	return t < 0 ? [
		W(e[0] * (1 - n)),
		W(e[1] * (1 - n)),
		W(e[2] * (1 - n))
	] : [
		W(e[0] + (255 - e[0]) * n),
		W(e[1] + (255 - e[1]) * n),
		W(e[2] + (255 - e[2]) * n)
	];
}
function oL(e) {
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
function sL(e, t, n) {
	return `#${_I(e)}${_I(t)}${_I(n)}`;
}
function cL(e, t, n, r) {
	return `rgba(${e}, ${t}, ${n}, ${(r / 255).toFixed(3)})`;
}
function lL(e, t, n) {
	let r = e / 255, i = t / 255, a = n / 255, o = Math.max(r, i, a), s = o - Math.min(r, i, a), c = 0;
	return s !== 0 && (c = o === r ? (i - a) / s % 6 : o === i ? (a - r) / s + 2 : (r - i) / s + 4, c *= 60, c < 0 && (c += 360)), [
		c,
		o === 0 ? 0 : s / o,
		o
	];
}
function uL(e, t, n) {
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
		W((o + a) * 255),
		W((s + a) * 255),
		W((c + a) * 255)
	];
}
function dL(e) {
	return Math.min(1, Math.max(0, e));
}
//#endregion
//#region src/interactions/surface-press-engine.ts
var fL = `:is(.ui-surface, .ui-card)[${ae}]`, pL = "ui-surface--clickable", mL = class {
	pressable = /* @__PURE__ */ new WeakSet();
	space = new Xs();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("keydown", (e) => this.handleKeyDown(e)), t.addEventListener("keyup", (e) => this.space.release(e)), yL(t, ["hover", "press"], (e) => vL(e.closest(Dc))), R(t, fL, {
			childList: !0,
			attributeFilter: ["class"]
		}, (e) => this.syncEach(e)), this.syncEach(t.querySelectorAll(fL));
	}
	syncEach(e) {
		for (let t of e) {
			this.sync(t);
			let e = t.parentElement?.closest(fL) ?? null;
			e !== null && this.sync(e);
		}
	}
	sync(e) {
		if (!e.classList.contains(pL)) {
			this.pressable.delete(e) && (e.removeAttribute("tabindex"), e.removeAttribute("role"));
			return;
		}
		this.pressable.add(e), xL(e, "role", _L(e) ? "group" : "button"), xL(e, "tabindex", e.matches(".ui-disabled, .ui-loading") ? null : gL(e) ? "-1" : "0");
	}
	handleKeyDown(e) {
		let t = hL(e);
		if (t === null) return;
		let n = e.key;
		n === "Enter" ? (e.preventDefault(), e.repeat || t.click()) : n === " " && (e.preventDefault(), this.space.hold(t));
	}
};
function hL(e) {
	if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !A(e, { shift: !0 })) return null;
	let t = e.target;
	return t instanceof HTMLElement && t.classList.contains(pL) && t.hasAttribute("tabindex") ? t : null;
}
function gL(e) {
	let t = e.closest(sl);
	return t !== null && t.closest(N)?.matches(".ui-items-view, .ui-table") === !0 && kc(t) === e;
}
function _L(e) {
	for (let t of e.querySelectorAll(Dc)) if (Mc(e, t)) return !0;
	return !1;
}
function vL(e) {
	let t = [];
	for (let n = e?.parentElement?.closest(`.${pL}`) ?? null; n !== null; n = n.parentElement?.closest(`.${pL}`) ?? null) t.push(n);
	return t;
}
function yL(e, t, n) {
	let r = {
		hover: [],
		press: []
	}, i = !1, a = (e, t) => {
		let a = t instanceof Element ? n(t) : [];
		e === "press" && (i = !1);
		for (let t of r[e]) a.includes(t) || bL(t, e, !1);
		for (let t of a) bL(t, e, !0);
		r[e] = a;
	};
	t.includes("hover") && (e.addEventListener("pointerover", (e) => a("hover", e.target)), e.addEventListener("pointerout", (e) => a("hover", e.relatedTarget))), t.includes("press") && (e.addEventListener("pointerdown", (e) => a("press", e.button === 0 ? e.target : null), !0), e.addEventListener("pointerup", () => a("press", null), !0), e.addEventListener("dragend", () => a("press", null), !0), e.addEventListener("dragstart", () => {
		i = r.press.length > 0;
	}, !0), e.addEventListener("pointercancel", () => {
		i || a("press", null);
	}, !0));
}
function bL(e, t, n) {
	let r = (e.getAttribute("data-ui-inner-pointer") ?? "").split(" ").filter((e) => e !== "" && e !== t);
	n && r.push(t), xL(e, Or, r.length === 0 ? null : r.sort().join(" "));
}
function xL(e, t, n) {
	n === null ? e.removeAttribute(t) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/interactions/table-columns-engine.ts
var SL = "ui-table", CL = "ui-table--reorderable", wL = "ui-scroll-x--auto", TL = "ui-scroll-x--always", EL = `:scope > .${Pn}`, DL = `.${In}`, OL = "ui-table__header-cell", kL = `${OL}--pinned`, AL = `${EL} > .${Fn} > .${OL}`, jL = `${AL}--pinned`, ML = "ui-table__host", NL = `${EL} > .${ML}`, PL = `.${SL}, .${Nn}, [${kn}]`, FL = "--ui-table-columns", IL = "--ui-table-sticky-top", LL = "--ui-table-sticky-bottom", RL = "--ui-table-sized-columns", zL = "--ui-table-pin-", BL = 64, VL = "data-ui-table-cell-hidden", HL = "data-ui-table-cell-last", UL = "columns", WL = "hidden", GL = "order", KL = "layout", qL = 32, JL = 16, YL = class {
	root;
	store = new cO();
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
		if (this.root = e.root ?? document, this.drag = new um({
			root: this.root,
			resolveHandle: (e) => e.closest(DL),
			begin: (e) => this.resolveContext(e),
			coordinate: () => "clientX",
			move: (e, t) => this.apply(e, t),
			end: (e, t) => this.remember(t.table)
		}), this.reorder = new um({
			root: this.root,
			resolveHandle: (e) => this.resolveCaption(e),
			begin: (e, t) => this.beginReorder(e, t.x),
			coordinate: () => "clientX",
			move: (e, t) => this.aimDrop(e, t),
			end: (e, t) => this.endReorder(e, t)
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), yL(this.root, ["hover", "press"], (e) => {
			let t = e.closest(DL)?.parentElement ?? null;
			return t === null ? [] : [t];
		}), typeof matchMedia == "function") for (let e of wf) e !== "base" && matchMedia(Ef(e)).addEventListener("change", () => this.layoutAll());
		this.restoreEach(this.root.querySelectorAll(`.${SL}`)), R(this.root, `.${SL}`, {
			childList: !0,
			relevant: eR
		}, (e) => {
			for (let t of e) this.restored.has(t) && (this.stampUnstyledColumns(t, !0), this.indexColumns(t, !0));
			this.restoreEach(e);
		}), R(this.root, `.${SL}`, {
			attributeFilter: ["class"],
			relevant: (e) => e.target instanceof Element && e.target.classList.contains(SL)
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.layout(t);
		}), R(this.root, `.${SL}`, {
			childList: !0,
			attributeFilter: ["class", "hidden"],
			relevant: tR
		}, (e) => {
			for (let t of e) {
				let e = t.querySelector(NL);
				e !== null && t.hasAttribute("data-ui-table-scrollbar") && this.markScrollbar(t, e);
			}
		});
	}
	restoreEach(e) {
		for (let t of e) {
			if (this.restored.has(t)) continue;
			this.restored.add(t), this.restore(t), this.layout(t), nP(t, () => this.pin(t));
			let e = t.querySelector(EL);
			e !== null && nP(e, () => XL(t, e));
			let n = t.querySelector(NL);
			n !== null && (this.markScrollbar(t, n), nP(n, () => this.markScrollbar(t, n)));
		}
	}
	restore(e) {
		let t = this.columnsOf(e), n = this.store.read(e, UL), r = n === null ? null : $o(n);
		r !== null && r.length !== t.length ? (this.store.write(e, UL, null), this.store.writeBoot(e, KL, null), this.widths.set(e, null)) : this.widths.set(e, r);
		let i = this.store.readJson(e, GL);
		if (i !== null && !rR(i, t)) {
			this.store.write(e, GL, null), this.orders.set(e, null);
			return;
		}
		this.orders.set(e, i);
	}
	markScrollbar(e, t) {
		let n = getComputedStyle(t).overflowY;
		e.toggleAttribute(qn, n === "scroll" || n === "auto" && t.scrollHeight > t.clientHeight);
	}
	layoutAll() {
		for (let e of this.root.querySelectorAll(`.${SL}`)) this.layout(e);
	}
	layout(e) {
		let t = this.columnsOf(e), n = this.hiddenOf(e, t), r = this.placesOf(e, t), i = nR(r), a = this.widths.get(e) ?? null, o = r.some((e, t) => e !== t), s = e.classList.contains(wL) || e.classList.contains(TL);
		if (a === null && n.size === 0 && !o && !s) e.style.removeProperty(RL);
		else {
			let t = a ?? this.authoredTracks(e);
			if (t !== null) {
				let r = Ds(t, n);
				e.style.setProperty(RL, rs(i.map((e) => r[e]), s ? "max-content" : "auto"));
			}
		}
		for (let t = 0; t < r.length; t++) o ? e.style.setProperty(`${Ml}${t}`, String(r[t])) : e.style.removeProperty(`${Ml}${t}`);
		let c = [...n].sort((e, t) => e - t).join(" ");
		c.length === 0 ? e.removeAttribute(Mn) : e.getAttribute("data-ui-table-hidden") !== c && e.setAttribute(Mn, c);
		let l = [...i].reverse().find((e) => !n.has(e));
		if (l === void 0 ? e.removeAttribute(Hn) : e.getAttribute("data-ui-table-last") !== String(l) && e.setAttribute(Hn, String(l)), this.columnStates.set(e, {
			places: r,
			hidden: n,
			last: l ?? -1
		}), this.stampUnstyledColumns(e, !1), this.indexColumns(e, !1), e.classList.contains(CL)) for (let e of t) !e.anchored && !e.cell.hasAttribute("tabindex") && e.cell.setAttribute("tabindex", "-1");
		this.pin(e);
	}
	stampUnstyledColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0 || n.places.length <= BL) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}|${n.last}`;
		if (!(!t && this.stampedStates.get(e) === r)) {
			this.stampedStates.set(e, r);
			for (let t of e.querySelectorAll(`[${kn}]`)) {
				let r = Number(t.getAttribute(kn));
				!(r >= BL) || t.closest(`.${SL}`) !== e || (t.style.order = String(n.places[r] ?? r), t.toggleAttribute(VL, n.hidden.has(r)), t.toggleAttribute(HL, r === n.last));
			}
		}
	}
	indexColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}`, i = this.indexedStates.get(e) === r;
		i && !t || (this.indexedStates.set(e, r), Ll(e, nR(n.places), n.hidden, i));
	}
	columnsOf(e) {
		let t = [];
		for (let n of e.querySelectorAll(AL)) {
			let e = Number(n.getAttribute(kn)), r = n.getAttribute(An), i = n.classList.contains(kL) || n.hasAttribute("data-ui-table-fixed");
			Number.isInteger(e) && t.push({
				index: e,
				key: n.getAttribute("data-ui-table-column-key") ?? String(e),
				hideBelow: sR(r) ? r : null,
				startsHidden: n.hasAttribute(jn),
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
		for (let e of t) (n[e.key] ?? oR(e)) && r.add(e.index);
		return r;
	}
	choicesOf(e) {
		let t = this.hiddenChoices.get(e);
		return t === void 0 && (t = this.store.readJson(e, WL) ?? {}, this.hiddenChoices.set(e, t)), t;
	}
	authoredTracks(e) {
		let t = e.style.getPropertyValue(FL).trim(), n = t.length === 0 ? null : $o(t);
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
		n === null || i !== void 0 && n === oR(i) ? delete r[t] : r[t] = n, this.hiddenChoices.set(e, r), this.store.writeJson(e, WL, Object.keys(r).length === 0 ? null : r), this.layout(e), this.rememberBoot(e);
	}
	columnOrder(e) {
		if (!(e instanceof HTMLElement)) return [];
		let t = this.columnsOf(e), n = new Map(t.map((e) => [e.index, e]));
		return nR(this.placesOf(e, t)).map((e) => n.get(e)?.key ?? "").filter((e) => e.length > 0);
	}
	pin(e) {
		let t = e.querySelectorAll(jL).length;
		if (t < 2) return;
		let n = Cs(this.trackSizes(e), t);
		for (let t = 1; t < n.length; t++) e.style.setProperty(`${zL}${t}`, `${n[t]}px`);
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof HTMLElement) || !t.classList.contains("ui-table__scroll") || t.closest(`.${SL}`)?.toggleAttribute(Kn, t.scrollLeft > 0);
	}
	trackSizes(e) {
		let t = e.querySelector(EL), n = t === null ? [] : getComputedStyle(t).gridTemplateColumns.split(" ").map(parseFloat);
		return QL(e) ? n.slice(1) : n;
	}
	columnSizes(e, t) {
		let n = this.trackSizes(e);
		return t.map((e) => n[e]);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		if (e.altKey && A(e, { alt: !0 }) && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
			this.stepColumn(e, e.key === "ArrowLeft" ? -1 : 1);
			return;
		}
		let t = e.target.closest(DL), n = t ?? (e.shiftKey ? ZL(e.target) : null);
		if (n === null || this.drag.active || !A(e, { shift: t === null })) return;
		if (t !== null && e.key === "Enter" || t === null && e.key === "Backspace") {
			e.preventDefault(), this.reset(n);
			return;
		}
		let r = e.key === "PageUp" || e.key === "PageDown";
		if (!r && e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
		let i = this.resolveContext(n);
		if (i === null) return;
		let a = r ? Qo(JL, i.sizes.reduce((e, t) => e + t, 0)) : JL;
		e.preventDefault(), this.apply(i, e.key === "ArrowRight" || e.key === "PageUp" ? a : -a) && this.remember(i.table);
	}
	stepColumn(e, t) {
		let n = e.target instanceof Element ? this.resolveCaption(e.target) : null, r = n?.closest(`.${SL}`) ?? null;
		if (n === null || r === null || this.reorder.active) return;
		let i = this.movableColumns(r), a = Number(n.getAttribute(kn)), o = i.findIndex((e) => e.index === a), s = o + t;
		o < 0 || (e.preventDefault(), !(s < 0 || s >= i.length) && (this.moveColumn(r, a, t < 0 ? i[s].index : i[s + 1]?.index ?? null), n.focus({ preventScroll: !0 })));
	}
	handleDoubleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(DL) : null;
		t !== null && this.reset(t);
	}
	reset(e) {
		let t = e.closest(`.${SL}`);
		t !== null && (this.widths.set(t, null), this.layout(t), this.remember(t));
	}
	apply(e, t) {
		let n = us(e.tracks.map((t, n) => n === e.index || n === e.after ? {
			...t,
			min: Math.max(qL, e.floors.get(n) ?? 0)
		} : t), e.sizes, {
			before: [e.index],
			after: [e.after]
		}, t);
		return n !== null && (this.widths.set(e.table, $L(e.tracks, n, [e.index, e.after])), this.layout(e.table), !0);
	}
	remember(e) {
		let t = this.widths.get(e) ?? null;
		this.store.write(e, UL, t === null ? null : rs(t), null), this.rememberBoot(e);
	}
	rememberBoot(e) {
		let t = e.style.getPropertyValue(RL).trim(), n = e.getAttribute(Mn), r = {};
		t.length > 0 && (r[RL] = t);
		for (let t of e.style) t.startsWith("--ui-table-order-") && (r[t] = e.style.getPropertyValue(t));
		if (Object.keys(r).length === 0 && n === null) {
			this.store.writeBoot(e, KL, null);
			return;
		}
		this.store.writeBoot(e, KL, {
			styles: r,
			attributes: {
				[Mn]: n,
				[Hn]: e.getAttribute(Hn)
			}
		});
	}
	resolveContext(e) {
		let t = e.closest(`.${SL}`);
		if (t === null) return null;
		let n = this.widths.get(t) ?? this.authoredTracks(t);
		if (n === null) return null;
		let r = os(t.getAttribute(Cn)), i = ss(n, r), a = /* @__PURE__ */ new Map(), o = this.columnsOf(t), s = this.placesOf(t, o), c = this.columnSizes(t, s).filter((e) => Number.isFinite(e));
		for (let e of r) e.min !== void 0 && a.set(e.index, e.min);
		let l = Number(e.getAttribute(kn)), u = this.hiddenOf(t, o), d = nR(s), f = (s[l] ?? -1) + 1;
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
		let t = e.closest(`.${OL}`), n = t?.closest(`.${SL}`) ?? null;
		return t === null || n === null || !n.classList.contains(CL) || e.closest(DL) !== null || t.classList.contains(kL) || t.hasAttribute("data-ui-table-fixed") ? null : t;
	}
	beginReorder(e, t) {
		let n = e.closest(`.${SL}`), r = Number(e.getAttribute(kn));
		if (n === null || !Number.isInteger(r)) return null;
		let i = this.movableColumns(n), a = i.findIndex((e) => e.index === r);
		return a < 0 || i.length < 2 ? null : (n.setAttribute(Un, ""), e.setAttribute(Wn, ""), {
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
		for (let a of nR(this.placesOf(e, t))) {
			let e = r.get(a);
			e !== void 0 && !e.anchored && !n.has(a) && i.push(e);
		}
		return i;
	}
	aimDrop(e, t) {
		let n = e.origin + t, r = 0;
		for (; r < e.places.length && n > iR(e.places[r]);) r++;
		if (e.target = Math.min(Math.max(r > e.from ? r - 1 : r, 0), e.places.length - 1), aR(e.table), e.target === e.from) return;
		let i = e.places.filter((t, n) => n !== e.from), a = i[e.target];
		a === void 0 ? i[i.length - 1].cell.setAttribute(Gn, "after") : a.cell.setAttribute(Gn, "before");
	}
	endReorder(e, t) {
		if (e.removeAttribute(Wn), t.table.removeAttribute(Un), aR(t.table), t.target === t.from) return;
		let n = t.places.filter((e, n) => n !== t.from);
		fm(), this.moveColumn(t.table, t.index, n[t.target]?.index ?? null);
	}
	moveColumn(e, t, n) {
		let r = this.columnsOf(e), i = new Map(r.map((e) => [e.index, e])), a = nR(this.placesOf(e, r)).filter((e) => i.get(e)?.anchored === !1), o = a.indexOf(t);
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
		this.orders.set(e, u ? null : c), this.store.write(e, GL, u ? null : JSON.stringify(c)), this.layout(e), this.rememberBoot(e);
	}
};
function XL(e, t) {
	let n = 0, r = 0, i = !1;
	for (let e of t.children) if (e.matches(`.${ML}`)) i = !0;
	else if (!(e instanceof HTMLElement) || e.getAttribute("role") !== "row") continue;
	else i ? r += e.offsetHeight : n += e.offsetHeight;
	e.style.setProperty(IL, `${n}px`), e.style.setProperty(LL, `${r}px`);
}
function ZL(e) {
	let t = e.matches(`.${OL}`) ? e.querySelector(`:scope > ${DL}`) : null;
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function QL(e) {
	return e.hasAttribute("data-ui-rows-draggable") && e.hasAttribute("data-ui-rows-drag-handle") && e.classList.contains("ui-drag-handle--start");
}
function $L(e, t, n) {
	for (let r of n) e[r].kind === "star" && e[r].min === e[r].value && t[r].kind === "star" && (t[r] = {
		...t[r],
		min: t[r].value
	});
	return t;
}
function eR(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(PL) || t.querySelector(PL) !== null)) return !0;
	return !1;
}
function tR(e) {
	let t = e.type === "childList" ? e.target : e.target.parentElement;
	return t instanceof Element && t.classList.contains(ML);
}
function nR(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) t[e[n]] = n;
	return t;
}
function rR(e, t) {
	if (e.length !== t.length) return !1;
	let n = new Set(t.map((e) => e.key));
	return e.every((e) => n.delete(e)) && n.size === 0;
}
function iR(e) {
	let t = e.cell.getBoundingClientRect();
	return t.left + t.width / 2;
}
function aR(e) {
	for (let t of e.querySelectorAll(`[${Gn}]`)) t.removeAttribute(Gn);
}
function oR(e) {
	return e.startsHidden || e.hideBelow !== null && wf.indexOf(Of()) < wf.indexOf(e.hideBelow);
}
function sR(e) {
	return e !== null && wf.includes(e);
}
//#endregion
//#region src/items/items-group-runs.ts
var cR = /* @__PURE__ */ new WeakMap();
function lR(e, t) {
	let n = /* @__PURE__ */ new Set(), r = e.getAttribute(Ft);
	for (let i of B(e)) {
		let a = i.getAttribute("data-ui-group") ?? "";
		if (a !== "" && a !== r) {
			let r = uR(i, a) ?? dR(e, i, a, t);
			r !== null && n.add(r);
		}
		r = a;
	}
	for (let t of e.querySelectorAll(`:scope > [${ht}]`)) n.has(t) || t.remove();
}
function uR(e, t) {
	let n = e.previousElementSibling, r = n === null ? void 0 : cR.get(n);
	return r !== void 0 && r.row === e && r.group === t ? n : null;
}
function dR(e, t, n, r) {
	let i = r(t);
	return i === null ? null : (hR(i, t.getAttribute(_)), cR.set(i, {
		row: t,
		group: n
	}), e.insertBefore(i, t), i);
}
function fR(e, t, n) {
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
function pR(e) {
	return e.find((e) => !e.classList.contains(Ur));
}
function mR(e, t, n, r, i) {
	let a = t.renderFromTemplate(e, n, i);
	if (a === null) return null;
	let o = document.createElement("div");
	return hR(o, r), o.appendChild(a), o;
}
function hR(e, t) {
	e.setAttribute(ht, ""), t === null ? e.removeAttribute(gt) : e.setAttribute(gt, t);
}
var gR = "bottom", _R = "pending";
function vR(e, t, n) {
	let r = e.querySelector(`:scope > [${Dt}="${t}"]`);
	if (n <= 0) {
		r?.remove();
		return;
	}
	r === null && (r = document.createElement("div"), r.setAttribute(Dt, t), r.style.flexShrink = "0"), t === "top" ? e.firstElementChild !== r && e.insertBefore(r, e.firstElementChild) : e.lastElementChild !== r && e.appendChild(r), r.style.height = `${n}px`;
}
//#endregion
//#region src/items/items-dom-order.ts
function yR(e, t) {
	let n = e.firstElementChild;
	n !== null && n.getAttribute("data-ui-window-spacer") === "top" && (n = n.nextElementSibling);
	for (let r of t) r !== n && e.insertBefore(r, n), n = r.nextElementSibling;
}
//#endregion
//#region src/items/items-group-renderer.ts
var bR = /* @__PURE__ */ new WeakMap();
function xR(e) {
	for (let t of e.querySelectorAll(`:scope > [${ht}]`)) t.remove();
}
function SR(e, t, n, r, i, a) {
	let o = DC(e, B(e)), s = n.getGroupTemplate(t), c = s !== void 0, l = c && o.some((e) => e.hasAttribute("data-ui-group")), u = vC(i.getItemsFilterSortMetadata(t), a, mC(e));
	if (c && !l && xR(e), o.length === 0) {
		bR.set(e, []);
		return;
	}
	let d = JS(e);
	if (!l) {
		yR(e, [...yC(o, u, r), ...qS(d)]);
		return;
	}
	xR(e);
	let { buckets: f, order: p } = fR(o, (e) => e.getAttribute("data-ui-group") ?? "", bR.get(e) ?? []), m = r.getAncestorStack(e);
	bR.set(e, p);
	let h = [];
	for (let e of p) {
		let t = f.get(e);
		u.length > 0 && (t = yC(t, u, r));
		let n = e === "" ? void 0 : pR(t);
		if (n !== void 0) {
			let e = mR(s, r, r.getItemValue(n), n.getAttribute(_), m);
			e !== null && h.push(e);
		}
		h.push(...t);
	}
	yR(e, [...h, ...qS(d)]);
}
//#endregion
//#region src/items/items-host-sync.ts
var CR = "ui-tree-rules", wR = `:scope > .${Rn}:not(.${Vn})`;
function TR(e, t, n) {
	if (e.parentElement?.classList.contains("ui-tree") === !0) {
		e.dispatchEvent(new Event(CR, { bubbles: !0 })), YS(e, t, n.templates, n.renderer, e.querySelector(wR) !== null);
		return;
	}
	switch (jS(e)) {
		case "windowed":
			YS(e, t, n.templates, n.renderer), DR(e, t, n);
			return;
		case "virtualized":
			n.virtualization.sync(e);
			return;
		default:
			hC(e, t, n.metadata, n.renderer, n.state), ER(e), YS(e, t, n.templates, n.renderer), SR(e, t, n.templates, n.renderer, n.metadata, n.state);
			return;
	}
}
function ER(e) {
	let t = Ou(e);
	t !== null && Du(t, B(e).filter((e) => e instanceof HTMLElement));
}
function DR(e, t, n) {
	let r = n.templates.getGroupTemplate(t);
	if (r === void 0) return;
	let i = n.renderer.getAncestorStack(e);
	lR(e, (e) => mR(r, n.renderer, n.renderer.getItemValue(e), e.getAttribute(_), i));
}
//#endregion
//#region src/interactions/table-header-group.ts
var OR = ".ui-table", kR = `:scope > .${Pn} > .${Fn} > [role='columnheader']`, AR = `:scope > .${In}`, jR = "input:not([type='hidden']), button, select, textarea, a[href]", MR = /* @__PURE__ */ new WeakMap();
function NR(e) {
	for (let t of e.querySelectorAll(kR)) {
		let e = PR(t);
		e !== null && e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
	}
}
function PR(e) {
	let t = e.querySelector(jR);
	if (t !== null) return t;
	if (e.hasAttribute("tabindex")) return e;
	let n = e.querySelector(AR);
	return n !== null && n.getClientRects().length > 0 ? e : null;
}
function FR(e, t = null) {
	let n = IR(e), r = MR.get(e), i = n.find((e) => t !== null && RR(e) === t) ?? (r !== void 0 && n.includes(r) ? r : n[0]);
	return i !== void 0 && (LR(e, i), !0);
}
function IR(e) {
	let t = Nl(e), n = [];
	for (let r of e.querySelectorAll(kR)) {
		let e = PR(r), i = Number(r.getAttribute("data-ui-table-column") ?? NaN);
		e !== null && Number.isInteger(i) && M(e) && n.push({
			stop: e,
			place: t.place(i)
		});
	}
	return n.sort((e, t) => e.place - t.place).map((e) => e.stop);
}
function LR(e, t) {
	t.hasAttribute("tabindex") || t.setAttribute("tabindex", "-1"), MR.set(e, t), t.focus();
}
function RR(e) {
	return e.closest("[role='columnheader']")?.getAttribute("data-ui-table-column") ?? null;
}
function zR(e) {
	let t = e.closest("[role='columnheader']"), n = t?.parentElement?.parentElement?.parentElement ?? null;
	return t !== null && n instanceof HTMLElement && n.matches(OR) && PR(t) === e ? n : null;
}
function BR(e, t, n) {
	if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || !(e.target instanceof HTMLElement)) return !1;
	switch (e.key) {
		case "ArrowDown": return n(RR(e.target)), !0;
		case "ArrowUp": return !0;
	}
	if (!Fc(e.key, "horizontal")) return !1;
	let r = Pc({
		key: e.key,
		items: IR(t),
		current: e.target,
		axis: "horizontal",
		loop: !1
	});
	return r !== null && r !== e.target && LR(t, r), !0;
}
//#endregion
//#region src/interactions/items-selection-engine.ts
var VR = /* @__PURE__ */ new Set([
	" ",
	"Enter",
	"Delete"
]), HR = ".ui-table", UR = /* @__PURE__ */ new Set([
	"ArrowLeft",
	"ArrowRight",
	"ArrowUp",
	"ArrowDown",
	"Home",
	"End",
	"Enter",
	"F2",
	" "
]), WR = `:scope > [${v}], :scope > .${Pn}, :scope > .${Pn} > [${v}]`, GR = class {
	root;
	rows;
	pressedBoxes = [];
	windowEnds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.rows = e.rows, this.applyAll(this.root.querySelectorAll(N)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("mouseup", () => this.restoreBoxes(), !0), this.root.addEventListener("pointercancel", () => this.restoreBoxes(), !0), this.root.addEventListener("contextmenu", () => this.restoreBoxes(), !0), R(this.root, N, {
			childList: !0,
			attributeFilter: [
				kr,
				jr,
				Mr,
				Ot
			]
		}, (e) => this.applyAll(e)), this.root instanceof Node && new MutationObserver((e) => this.followCursor(e)).observe(this.root, {
			subtree: !0,
			attributes: !0,
			attributeFilter: [Ne]
		});
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = jl(e);
		_l(e, t);
		for (let t of e.querySelectorAll(WR)) qR(t);
		if (!e.matches(".ui-items-view, .ui-table")) return;
		e.matches(HR) && NR(e);
		for (let n of t) {
			let t = kc(n);
			t !== null && qR(t);
			for (let e of Ac(n)) qR(e);
			KR(e, n, n.hasAttribute(Ne));
		}
		let n = this.windowEnds.get(e);
		n !== void 0 && this.settleWindowEnd(e, t, n);
	}
	settleWindowEnd(e, t, n) {
		let r = El(e);
		if (r === null || r.hasAttribute("data-ui-window-pending")) return;
		let i = NS(r, Mt) !== null, a = n === "first" ? MS(r) === 0 && !PS(r, "data-ui-window-more-before") : !PS(r, Pt);
		if (i && !a) return;
		this.windowEnds.delete(e);
		let o = yu(n === "first" ? "Home" : "End", t, null, tz(e));
		o !== null && (Ql(e, t, o), e.getAttribute("data-ui-selection") === "one" && yl(e, t, o, ll));
	}
	handleClick(e) {
		let t = this.resolveRow(e, N);
		if (t === null || !(e instanceof MouseEvent)) return;
		let { root: n, item: r } = t, i = jl(n);
		if (Ql(n, i, r, e.target instanceof Element ? mu(r, e.target) : null), n.focus({ preventScroll: !0 }), n.hasAttribute("data-ui-no-row-select")) {
			fl(n, r);
			return;
		}
		yl(n, i, r, pl(e), this.heldRange(n)) && e.preventDefault();
	}
	resolveRow(e, t) {
		if (!(e.target instanceof Element)) return null;
		let n = e.target.closest(sl), r = n?.closest(N) ?? null;
		return n === null || r === null || n.closest(N) !== r || !r.matches(t) || E(r) ? null : Nc(e.target, n) === null && !D(n) ? {
			root: r,
			item: n
		} : null;
	}
	heldRange(e) {
		let t = this.rows, n = El(e);
		return t === void 0 || n === null ? void 0 : (e, r) => t.rangeKeysOf(n, e, r);
	}
	handleDoubleClick(e) {
		let t = this.resolveRow(e, cl);
		t === null || e.target instanceof Element && t.item.contains(e.target.closest("[data-ui-no-row-open]")) || (e.preventDefault(), wu(t.item, "open"));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.altKey || !(e.target instanceof Element) || xc(e)) return;
		let t = zR(e.target);
		if (t !== null && !E(t)) {
			BR(e, t, (e) => this.enterRows(t, e)) && e.preventDefault();
			return;
		}
		let n = Wl(e);
		if (n === null) return;
		let { root: r } = n;
		if (!r.matches(".ui-items-view, .ui-table") || E(r) || eu(r) && JR(e) && this.handleCellKey(r, e)) return;
		let i = tz(r);
		if (!VR.has(e.key) && !_u(e.key, i)) return;
		if (this.windowEnds.delete(r), this.reachWindowEnd(r, e)) {
			e.preventDefault();
			return;
		}
		this.bringRowsIn(r, e.key);
		let a = jl(r), o = ql(a), s = yu(e.key, a, Jl(a), i);
		if (s !== null) {
			e.preventDefault(), Ql(r, a, s, e.key === "ArrowUp" && !e.shiftKey && eu(r) ? pu(s) : null), XR(r, a, o, s, ml(r, e), this.heldRange(r));
			return;
		}
		if (e.key === "ArrowUp" && !e.shiftKey && !e.ctrlKey && !e.metaKey && r.matches(HR) && FR(r, cu(r))) {
			e.preventDefault();
			return;
		}
		if (o === null || D(o)) return;
		let c = kc(o);
		switch (e.key) {
			case " ":
				ZR(r, a, o, c);
				break;
			case "Enter":
				$R(r, a, o, c);
				break;
			case "Delete":
				if (!QR(r, a, o)) return;
				break;
			default: return;
		}
		e.preventDefault();
	}
	handleCellKey(e, t) {
		this.bringCursorRowIn(e);
		let n = jl(e), r = Jl(n);
		if (r === null || D(r)) return !1;
		let i = su(r), a = !t.ctrlKey && !t.metaKey && !t.shiftKey;
		switch (t.key) {
			case "ArrowLeft":
			case "ArrowRight":
			case "Home":
			case "End": {
				if (!a) return !1;
				let o = lu(e, r, i, t.key);
				return o !== null && Ql(e, n, r, o), t.preventDefault(), !0;
			}
			case "ArrowDown":
			case "ArrowUp": {
				let o = a ? uu(e, r, i, t.key === "ArrowDown") : null;
				return o !== null && (t.preventDefault(), Ql(e, n, r, o), !0);
			}
			default: return i !== null && YR(i, t);
		}
	}
	reachWindowEnd(e, t) {
		let n = t.key === "Home" || t.key === "End" ? El(e) : null;
		if (n === null || jS(n) !== "windowed" || n.hasAttribute("data-ui-window-paged")) return !1;
		let r = t.key === "Home";
		return !(r ? MS(n) === 0 && !PS(n, "data-ui-window-more-before") : !PS(n, "data-ui-window-more-after")) && (this.windowEnds.set(e, r ? "first" : "last"), Uc(n, r ? 0 : Hc(n).contentHeight), !0);
	}
	bringRowsIn(e, t) {
		let n = this.rows, r = n === void 0 ? null : El(e);
		if (n === void 0 || r === null) return;
		let i = Mu(e);
		switch (t) {
			case "Home":
			case "End": {
				let e = n.shownKeysOf(r);
				e !== null && e.length > 0 && n.reveal(r, t === "Home" ? e[0] : e[e.length - 1], "nearest");
				return;
			}
			case "PageDown":
			case "PageUp": {
				let a = i === null ? Jl(jl(e)) : null, o = i ?? (a === null ? null : F(a));
				o !== null && n.reveal(r, o, t === "PageDown" ? "start" : "end");
				return;
			}
			default: this.bringCursorRowIn(e);
		}
	}
	bringCursorRowIn(e) {
		let t = this.rows === void 0 ? null : El(e), n = Mu(e);
		t !== null && n !== null && this.rows?.reveal(t, n, "nearest");
	}
	enterRows(e, t) {
		let n = jl(e), r = Jl(n) ?? yu("ArrowDown", n, null, "vertical");
		e.focus({ preventScroll: !0 }), r !== null && (Ql(e, n, r, nu(r, t)), e.getAttribute("data-ui-selection") === "one" && yl(e, n, r, ll));
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement && e.target.matches("[data-ui-items-host], .ui-table__scroll") ? e.target : null, n = t?.closest(N) ?? null;
		if (t !== null && n !== null && [...n.querySelectorAll(WR)].includes(t)) {
			I(n);
			return;
		}
		if (e.target instanceof HTMLElement && e.target.matches(N) && e.target.matches(".ui-items-view, .ui-table") && !E(e.target) && !Yu()) {
			Xl(e.target, jl(e.target));
			return;
		}
		let r = e.target instanceof Element ? e.target.closest(sl) : null, i = r?.closest(N) ?? null;
		r === null || i === null || r.hasAttribute("data-ui-row-focus") || !i.matches(".ui-items-view, .ui-table") || Nc(e.target, r) === null || Ql(i, jl(i), r, e.target instanceof Element ? mu(r, e.target) : null, !1);
	}
	handlePointerDown(e) {
		this.restoreBoxes();
		let t = e.target instanceof Element ? e.target : null, n = t?.closest(N) ?? null;
		if (t !== null && n !== null) {
			document.activeElement !== n && Zu(n, !0);
			for (let e of n.querySelectorAll(WR)) e.contains(t) && e.getAttribute("tabindex") === "-1" && (e.removeAttribute("tabindex"), this.pressedBoxes.push(e));
		}
	}
	restoreBoxes() {
		for (let e of this.pressedBoxes) qR(e);
		this.pressedBoxes = [];
	}
	followCursor(e) {
		for (let t of e) {
			let e = t.target;
			if (!(e instanceof HTMLElement) || !e.matches(sl)) continue;
			let n = e.closest(N);
			n !== null && n.matches(".ui-items-view, .ui-table") && KR(n, e, e.hasAttribute(Ne));
		}
	}
};
function KR(e, t, n) {
	if (n) {
		for (let n of t.querySelectorAll(`[${Fe}]`)) n.parentElement?.closest(N) === e && HF(n);
		return;
	}
	for (let n of t.querySelectorAll(Fu)) n.tabIndex >= 0 && n.parentElement?.closest(N) === e && Mc(t, n) && VF(n);
}
function qR(e) {
	e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
}
function JR(e) {
	return UR.has(e.key) || Ky(e) !== null;
}
function YR(e, t) {
	let n = t.key, r = Ky(t) !== null, i = !t.ctrlKey && !t.metaKey && !t.altKey;
	if (!r && (!i || n !== "Enter" && n !== "F2" && n !== " ")) return !1;
	if (n !== " " && gu(e, t)) return !0;
	let a = kc(e);
	if (a !== null && (n === "Enter" || n === " ")) return t.preventDefault(), a.click(), !0;
	if (n !== "F2" && (n !== "Enter" || !fu(e))) return !1;
	let o = rd(e);
	return o !== null && (t.preventDefault(), o.focus(), !0);
}
function XR(e, t, n, r, i, a) {
	e.getAttribute("data-ui-selection") !== "one" && !i.shift || (i.shift && dl(e, n), yl(e, t, r, i, a));
}
function ZR(e, t, n, r) {
	yl(e, t, n, {
		shift: !1,
		ctrl: !0
	}) || ez(n, r);
}
function QR(e, t, n) {
	if (!e.hasAttribute("data-ui-rows-remove")) return !1;
	let r = nz(t, n);
	for (let e of r) wu(e, "remove");
	return r.length > 0;
}
function $R(e, t, n, r) {
	hl(e) && !vl(t).includes(n) && yl(e, t, n, ll), ez(n, r), r === null && wu(n, "open");
}
function ez(e, t) {
	t === null ? wu(e, Cu) : t.click();
}
function tz(e) {
	return e.matches(".ui-items-view--wrap") ? "grid" : e.matches(".ui-orientation--horizontal") ? "both" : "vertical";
}
function nz(e, t) {
	let n = vl(e);
	return (n.includes(t) ? n : [t]).filter((e) => !qo(e, "data-ui-unremovable") && !D(e));
}
//#endregion
//#region src/interactions/tree-engine.ts
var rz = "ui-tree__row--folded", iz = "fold-hidden", az = "fold-shown", oz = "ui-tree__row--dragging", sz = "ui-tree__loading", cz = "ui-tree__loading-ring", lz = "ui-tree-node__text", uz = "ui-tree-node__toggle", dz = "ui-tree-node__rename", fz = ".ui-text__title", pz = Bn, mz = "--ui-tree-depth", hz = "expanded", gz = 600, _z = .25, vz = {
	ArrowUp: "up",
	ArrowDown: "down",
	ArrowLeft: "out",
	ArrowRight: "in"
}, yz = /* @__PURE__ */ new Set([
	" ",
	"ArrowRight",
	"ArrowLeft",
	"Enter",
	"F2",
	"Delete"
]), bz = class {
	root;
	store = new cO();
	rules;
	folds = /* @__PURE__ */ new WeakMap();
	requested = /* @__PURE__ */ new WeakSet();
	writtenBoot = /* @__PURE__ */ new WeakMap();
	springTarget = null;
	springTimer = 0;
	dropPlace = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.rules = e.rules, this.root.addEventListener(CR, (e) => {
			let t = e.target instanceof Element ? e.target.closest(`.${Ln}`) : null;
			t !== null && (this.layout(t), Du(t, this.rowsOf(t)));
		}, !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), e.effects?.register("RenameNode", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename node effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(C(n.id), n.dynamicParameters ?? []), i = r === null ? null : this.rowsOf(r).find((e) => F(e) === t.key) ?? null;
			if (i === null) {
				s("rename node effect names no node on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.layoutAll(this.root.querySelectorAll(`.${Ln}`)), R(this.root, `.${Ln}`, {
			childList: !0,
			attributeFilter: [
				Yn,
				Xn,
				Qn,
				rr
			],
			relevant: Cz
		}, (e) => this.layoutAll(e));
	}
	layoutAll(e) {
		for (let t of e) this.layout(t);
	}
	layout(e) {
		let t = this.foldOf(e), n = this.resolveRules(e), r = n === null ? this.rowsOf(e) : this.orderRows(e, n), i = e.hasAttribute("data-ui-tree-draggable") || e.hasAttribute("data-ui-drag-kind"), a = /* @__PURE__ */ new Set();
		for (let e of r) {
			let t = uw(e)?.getAttribute(Yn);
			t != null && t.length > 0 && a.add(t);
		}
		let o = n?.filtering === !0 ? this.matchingRows(r, n) : null, s = /* @__PURE__ */ new Map();
		for (let e of r) {
			let n = F(e), r = uw(e), c = r?.getAttribute("data-ui-tree-parent") ?? "", l = c.length > 0 ? s.get(c) : void 0, u = l === void 0 ? 0 : l.depth + 1, d = l === void 0 || l.shown && l.expanded, f = r?.hasAttribute(Xn) === !0, p = f || a.has(n), m = p && r?.hasAttribute("data-ui-tree-expanded") === !0, h = l === void 0 || l.authoredShown && this.authoredExpandedOf(l), g = p && (o === null ? t[n] ?? m : o.has(n)), ee = o !== null && !o.has(n);
			e.style.setProperty(mz, String(u)), e.setAttribute("aria-level", String(u + 1)), Zl(e, r?.querySelector(`:scope > .${lz}`) ?? null), e.classList.toggle(rz, !d), e.classList.toggle(Vn, ee), e.removeAttribute(nr), e.draggable = i && BS(e), p ? e.setAttribute("aria-expanded", g ? "true" : "false") : e.removeAttribute("aria-expanded"), (a.has(n) || !f) && e.removeAttribute(er), g && d && f && !a.has(n) && !this.requested.has(e) && (this.requested.add(e), e.setAttribute(er, ""), e.dispatchEvent(new Event("unfold", { bubbles: !0 }))), g || this.requested.delete(e), this.placeLoadingRow(e, u + 1, e.hasAttribute(er), d && g && !ee), s.set(n, {
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
		return uw(e.row)?.hasAttribute(Qn) === !0;
	}
	writeBootFold(e, t, n) {
		if (Object.keys(t).length === 0) return;
		let r = [], i = [];
		for (let [e, t] of n) t.shown !== t.authoredShown && (t.shown ? i : r).push(`.${Rn}[${_}="${x(e)}"]`);
		let a = `${r.join(",")}|${i.join(",")}`;
		this.writtenBoot.get(e) !== a && (this.writtenBoot.set(e, a), this.store.writeBoot(e, iz, r.length === 0 ? null : this.bootPatch(r, "hidden")), this.store.writeBoot(e, az, i.length === 0 ? null : this.bootPatch(i, "shown")));
	}
	bootPatch(e, t) {
		return {
			selector: e.join(","),
			attributes: { [nr]: t }
		};
	}
	resolveRules(e) {
		let t = this.hostOf(e), n = Zi(e);
		if (this.rules === void 0 || t === null || n === null) return null;
		let r = this.rules.metadata.getItemsFilterSortMetadata(n), i = mC(t);
		if (r === void 0 && i === null) return null;
		let a = vC(r, this.rules.state, i), o = _C(r, this.rules.state, i);
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
		let r = this.rules.renderer, i = new Set(n.map(F)), a = /* @__PURE__ */ new Map();
		for (let e of n) {
			let t = uw(e)?.getAttribute("data-ui-tree-parent") ?? "", n = i.has(t) ? t : "", r = a.get(n);
			r === void 0 ? a.set(n, [e]) : r.push(e);
		}
		let o = [], s = (e) => {
			let n = a.get(e);
			if (n !== void 0) {
				n.sort((e, n) => bC(r.getItemValue(e), r.getItemValue(n), t.sorts));
				for (let e of n) o.push(e), s(F(e));
			}
		};
		if (s(""), o.length !== n.length || o.every((e, t) => e === n[t])) return o.length === n.length ? o : n;
		let c = this.hostOf(e);
		if (c === null) return n;
		for (let e of c.querySelectorAll(`:scope > .${sz}`)) e.remove();
		for (let e of o) c.appendChild(e);
		return o;
	}
	matchingRows(e, t) {
		let n = /* @__PURE__ */ new Set();
		if (this.rules === void 0) return n;
		let r = this.rules.state, i = this.rules.renderer;
		for (let a = e.length - 1; a >= 0; a--) {
			let o = e[a], s = F(o), c = i.getItemValue(o);
			if (c === void 0 || gC(t.config, c, r, t.query) || n.has(s)) {
				n.add(s);
				let e = uw(o)?.getAttribute("data-ui-tree-parent") ?? "";
				e.length > 0 && n.add(e);
			}
		}
		return n;
	}
	placeLoadingRow(e, t, n, r) {
		let i = e.nextElementSibling, a = i instanceof HTMLElement && i.classList.contains(sz) ? i : null;
		if (!n) {
			a?.remove();
			return;
		}
		let o = a ?? wz();
		o.style.setProperty(mz, String(t)), o.classList.toggle(rz, !r), a === null && e.after(o);
	}
	handleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null) return;
		let { tree: n, row: r, target: i } = t;
		i.closest(`.${uz}`) === null && (!qo(r, "data-ui-unselectable") || Nc(i, r) !== null) || (e.preventDefault(), this.setFocus(n, r, null), this.toggle(n, r));
	}
	handleDoubleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null || Nc(t.target, t.row) !== null) return;
		let { tree: n, row: r } = t;
		e.preventDefault(), n.hasAttribute("data-ui-tree-rename-dblclick") && this.canRename(n, r) ? this.startRename(r) : wu(r, "open");
	}
	rowOfEvent(e) {
		if (!(e.target instanceof Element)) return null;
		let t = e.target.closest(`.${Rn}`), n = t?.closest(".ui-tree") ?? null;
		return t === null || n === null || t.closest(".ui-tree") !== n || D(t) ? null : {
			tree: n,
			row: t,
			target: e.target
		};
	}
	handleFocusIn(e) {
		let t = e.target;
		!(t instanceof HTMLElement) || !t.classList.contains("ui-tree") || E(t) || Yu() || Xl(t, this.rowsOf(t));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || k(e) || !(e.target instanceof Element)) return;
		let t = Wl(e);
		if (t === null) return;
		let n = t.root;
		if (!n.classList.contains("ui-tree") || E(n)) return;
		let r = e.altKey && A(e, { alt: !0 }) ? vz[e.key] : void 0;
		if (r !== void 0 && n.hasAttribute("data-ui-tree-draggable")) {
			e.preventDefault(), this.moveByKey(n, r);
			return;
		}
		if (!yz.has(e.key) && !_u(e.key, "vertical")) return;
		let i = this.rowsOf(n), a = ql(i), o = yu(e.key, i, Jl(i), "vertical");
		if (o !== null) {
			e.preventDefault(), this.setFocus(n, o, ml(n, e));
			return;
		}
		if (!(a === null || D(a))) {
			switch (e.key) {
				case " ":
					ZR(n, i, a, null);
					break;
				case "ArrowRight":
					a.getAttribute("aria-expanded") === "false" ? this.toggle(n, a) : a.getAttribute("aria-expanded") === "true" && this.setFocus(n, yu("ArrowDown", i, a, "vertical"), ll);
					break;
				case "ArrowLeft":
					a.getAttribute("aria-expanded") === "true" ? this.toggle(n, a) : this.setFocus(n, this.parentOf(n, a), ll);
					break;
				case "Enter":
					$R(n, i, a, null);
					break;
				case "F2":
					if (!this.canRename(n, a)) return;
					this.startRename(a);
					break;
				case "Delete":
					if (n.hasAttribute("data-ui-tree-unremovable") || !QR(n, i, a)) return;
					break;
				default: return;
			}
			e.preventDefault();
		}
	}
	moveByKey(e, t) {
		let n = this.rowsOf(e), r = ql(n);
		if (r === null || !r.draggable || (t === "up" || t === "down") && this.isSorted(e)) return;
		let i = gw(Ez(n), F(r), t);
		i !== null && this.moveRows(e, [r], i, t === "in" ? n.find((e) => F(e) === i.parent) ?? null : null);
	}
	isSorted(e) {
		return (this.resolveRules(e)?.sorts.length ?? 0) > 0;
	}
	canRename(e, t) {
		return e.hasAttribute("data-ui-tree-renamable") && !qo(t, "data-ui-unrenamable");
	}
	handleDragStart(e) {
		let t = Tz(e), n = t?.closest(".ui-tree") ?? null, r = n?.hasAttribute(rr) === !0, i = n === null ? null : this.hostOf(n);
		if (t === null || n === null || i === null || !r && !n.hasAttribute("data-ui-drag-kind")) return;
		if (D(t)) {
			e.preventDefault();
			return;
		}
		let a = zS(t, this.rowsOf(n)), o = RS(n, i, a);
		r ? Eh(e, n, t, oz, F(t), a.filter((e) => e !== t), HS(o, !0)) : Oh(e, F(t), HS(o, !1)), US(e, o);
	}
	draggingRows(e) {
		return this.rowsOf(e).filter((e) => e.classList.contains(oz));
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Ln}`), n = t === null ? [] : this.draggingRows(t), r = t === null ? null : this.hostOf(t);
		if (t === null || n.length === 0 || r === null) return;
		let i = e.target.closest(`.${Rn}`), a = i !== null && i.closest(".ui-tree") === t ? i : null, o = a === null ? {
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
		let i = this.parentKeysOf(e), a = F(t), o = (e) => n.some((t) => F(t) === e || Sz(i, e, F(t))), s = dw(t, uw(t)), c = t.getBoundingClientRect(), l = c.height > 0 ? (r - c.top) / c.height : .5, u = s ? _z : .5, d = this.isSorted(e) ? null : l < u ? "before" : l >= 1 - u ? "after" : null;
		if (d === null) return s && !o(a) ? {
			mark: "",
			place: {
				parent: a,
				before: null
			}
		} : null;
		if (n.includes(t)) return null;
		let f = this.rowsOf(e), p = Ez(f), m = Number(t.style.getPropertyValue(mz)) || 0, h = new Set(n.map(F)), g = d === "after" && t.getAttribute("aria-expanded") === "true" ? p.find((e) => e.parent === a && e.shown !== !1 && !h.has(e.key)) : void 0, ee = i.get(a) ?? "", te = g === void 0 ? {
			parent: ee,
			before: d === "before" ? a : bw(p, ee, a, !1, h)
		} : {
			parent: a,
			before: g.key
		};
		return !fw(te.parent, (e) => f.find((t) => F(t) === e) ?? null) || o(te.parent) ? null : {
			mark: d,
			place: te,
			depth: g === void 0 ? m : m + 1
		};
	}
	springOpen(e, t) {
		let n = t !== null && t.getAttribute("aria-expanded") === "false" ? t : null;
		n !== this.springTarget && (window.clearTimeout(this.springTimer), this.springTarget = n, n !== null && (this.springTimer = window.setTimeout(() => this.expand(e, n), gz)));
	}
	handleDragLeave(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Ln}`);
		t !== null && kh(e, t) && (this.markDrop(t, null), this.springOpen(t, null));
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Ln}`), n = t === null ? [] : this.draggingRows(t), r = t?.querySelector(`[${pz}]`) ?? null, i = this.dropPlace;
		if (t === null || n.length === 0 || r === null || i === null) return;
		e.preventDefault();
		let a = this.parentKeysOf(t), o = n.filter((e) => !n.some((t) => t !== e && Sz(a, F(e), F(t)))), s = r.getAttribute(pz) === "" && r.classList.contains("ui-tree__row") ? r : null;
		this.markDrop(t, null), this.springOpen(t, null), Dh(t, oz), this.moveRows(t, o, i, s);
	}
	moveRows(e, t, n, r) {
		let i = xw(Ez(this.rowsOf(e)), t.map(F), n);
		r !== null && this.expand(e, r), t.forEach((e, t) => {
			let r = uw(e)?.querySelector(`.${lz}`) ?? null;
			r !== null && (r.setAttribute(tr, n.parent), r.dispatchEvent(new Event("change", { bubbles: !0 })), WC(e, i[t]));
		});
	}
	handleDragEnd(e) {
		let t = Tz(e)?.closest(".ui-tree") ?? null;
		t !== null && (Dh(t, oz), this.markDrop(t, null), this.springOpen(t, null));
	}
	markDrop(e, t, n = "", r) {
		mw(e, t, n, r), t === null && (this.dropPlace = null);
	}
	parentKeysOf(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of this.rowsOf(e)) t.set(F(n), uw(n)?.getAttribute("data-ui-tree-parent") ?? "");
		return t;
	}
	toggle(e, t) {
		this.fold(e, t, t.getAttribute("aria-expanded") !== "true");
	}
	expand(e, t) {
		t.getAttribute("aria-expanded") === "false" && this.fold(e, t, !0);
	}
	fold(e, t, n) {
		let r = F(t);
		if (r.length === 0 || !t.hasAttribute("aria-expanded")) return;
		let i = this.foldOf(e);
		i[r] = n;
		let a = n ? this.rowsOf(e).filter((e) => e.classList.contains(rz)) : [];
		this.store.writeJson(e, hz, i), this.layout(e), xz(a.filter((e) => !e.classList.contains(rz)));
	}
	foldOf(e) {
		let t = this.folds.get(e);
		return t === void 0 && (t = this.store.readJson(e, hz) ?? {}, this.folds.set(e, t)), t;
	}
	setFocus(e, t, n) {
		if (t === null) return;
		let r = this.rowsOf(e), i = ql(r);
		Ql(e, r, t), n !== null && XR(e, r, i, t, n);
	}
	parentOf(e, t) {
		let n = uw(t)?.getAttribute("data-ui-tree-parent") ?? "";
		return n.length === 0 ? null : this.rowsOf(e).find((e) => F(e) === n) ?? null;
	}
	startRename(e) {
		let t = e.closest(`.${Ln}`), n = uw(e), r = n?.querySelector(fz) ?? null;
		t === null || n === null || r === null || qo(e, "data-ui-unrenamable") || (this.setFocus(t, e, null), nc({
			container: n,
			title: r,
			className: dz,
			value: n.getAttribute("data-ui-tree-title") ?? r.textContent?.trim() ?? "",
			commit: (t) => {
				n.setAttribute($n, t), n.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			refocus: () => t.focus({ preventScroll: !0 })
		}));
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${v}]`);
	}
	rowsOf(e) {
		let t = this.hostOf(e), n = [];
		if (t === null) return n;
		for (let e of t.children) e instanceof HTMLElement && e.classList.contains("ui-tree__row") && n.push(e);
		return n;
	}
};
function xz(e) {
	if (!(e.length === 0 || xf())) for (let t of e) t.animate([{
		opacity: 0,
		offset: 0
	}], {
		duration: L.fast,
		easing: L.enter
	});
}
function Sz(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let i = e.get(t) ?? ""; i.length > 0 && !r.has(i); i = e.get(i) ?? "") {
		if (i === n) return !0;
		r.add(i);
	}
	return !1;
}
function Cz(e) {
	if (e.type !== "childList") return !0;
	let t = e.target;
	return t instanceof HTMLElement && (t.classList.contains("ui-tree__row") || t.hasAttribute("data-ui-items-host") && t.parentElement?.classList.contains("ui-tree") === !0);
}
function wz() {
	let e = document.createElement("div"), t = document.createElement("span");
	return e.className = sz, e.setAttribute("aria-hidden", "true"), t.className = cz, e.append(t, T.text("ui.tree.loading")), e;
}
function Tz(e) {
	return e.target instanceof Element ? e.target.closest(`.${Rn}`) : null;
}
function Ez(e) {
	return e.map((e) => ({
		key: F(e),
		parent: uw(e)?.getAttribute("data-ui-tree-parent") ?? "",
		takesDrop: dw(e, uw(e)),
		shown: !e.classList.contains(Vn)
	}));
}
//#endregion
//#region src/runtime/client-state.ts
var Dz = {
	visibilityState: () => document.visibilityState,
	notificationPermission: kz
};
function Oz(e) {
	return e !== "hidden";
}
function kz() {
	return typeof Notification > "u" || !window.isSecureContext ? void 0 : Notification.permission;
}
var Az = 200;
function jz(e = Dz) {
	return {
		visible: Oz(e.visibilityState()),
		notificationPermission: e.notificationPermission() ?? "unsupported"
	};
}
var Mz = class {
	report;
	source;
	settleMilliseconds;
	held = null;
	timer;
	constructor(e) {
		this.report = e.report, this.source = e.source ?? Dz, this.settleMilliseconds = e.settleMilliseconds ?? Az;
	}
	forAttach() {
		return clearTimeout(this.timer), this.held = jz(this.source), this.held;
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
		let t = jz(this.source);
		(t.visible !== e.visible || t.notificationPermission !== e.notificationPermission) && (this.held = t, this.report(t).catch(() => void 0));
	}
};
//#endregion
//#region src/interactions/system-notifications.ts
function Nz(e) {
	return {
		permission: kz,
		registration: e ?? (() => Promise.resolve(void 0)),
		create: (e, t) => new Notification(e, t),
		focus: () => window.focus()
	};
}
async function Pz(e, t, n = Nz()) {
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
function Fz(e, t, n, r = window.location) {
	if (e.bringTo !== void 0 && Iz(e.bringTo, r)) {
		t(e.bringTo);
		return;
	}
	e.action !== void 0 && n(e.action);
}
function Iz(e, t = window.location) {
	let n = new URL(e, t.origin);
	return n.pathname !== t.pathname || n.search !== t.search || n.hash !== "" && n.hash !== t.hash;
}
//#endregion
//#region src/interactions/tab-order.ts
function Lz(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) e[n].pinned && (t = n + 1);
	return t;
}
//#endregion
//#region src/interactions/tabs-view-engine.ts
var G = "ui-tabs-view", Rz = "ui-tab-item__label", zz = "ui-tab-item__close", Bz = "ui-tab-item__rename", Vz = "ui-tab-item__caption", Hz = "ui-tab-item__pin", Uz = ".ui-text__title", Wz = "ui-tab-item--dragging", Gz = "ui-tab-item__caption--overflowed", Kz = "ui-tabs-view--overflowing", qz = "ui-tabs-view--no-overflow", Jz = "ui-tab-item__page", Yz = "ui-tab-item--selected", Xz = `.${y}`, Zz = "tab-menu-entry", Qz = {
	name: Zz,
	registration: { dynamicParameters: (e) => e.domEvent.detail?.keys ?? null }
}, $z = "tab-pin";
function eB(e) {
	return {
		name: $z,
		registration: AS((e) => IC(e.target), e)
	};
}
var tB = "--ui-tabs-view-strip", nB = class {
	root;
	fitter;
	dragStart = null;
	menuTab = null;
	closed = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new bF({
			rootClass: G,
			overflowingClass: Kz,
			wraps: (e) => e.classList.contains(qz),
			hiddenClass: Gz,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(), e.effects?.register("RenameTab", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename tab effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(C(n.id), n.dynamicParameters ?? []), i = (r === null ? void 0 : this.ownItems(r).find((e) => pB(e) === t.key))?.querySelector(`.${Rz}`) ?? null;
			if (i === null) {
				s("rename tab effect names no tab on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.root.addEventListener(ik, (e) => this.prepareMenu(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), yL(this.root, ["press"], (e) => {
			let t = e.closest(`.${zz}`)?.closest(`.${Vz}`) ?? null;
			return t === null ? [] : [t];
		}), R(this.root, `.${G}`, {
			childList: !0,
			attributeFilter: [
				Pr,
				Se,
				ue,
				...Lr
			],
			relevant: (e) => !Fp(e, `.${Jz}`, `.${G}`)
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${G}`)) this.apply(e);
	}
	apply(e) {
		let t = this.ownItems(e);
		iB(e, t);
		let n = t.filter(Tk), r = e.getAttribute("data-ui-tabs-selected") ?? "", i = al(n, r, pB);
		if (i === null) return;
		if (i !== r) {
			this.select(e, i);
			return;
		}
		let a = e.hasAttribute(Se), o = t.find((e) => e.classList.contains(Yz))?.querySelector(`.${Vz}`) ?? null, s = [], c = null, l = null;
		for (let e of t) {
			let t = pB(e) === r;
			e.classList.toggle(Yz, t);
			let i = e.querySelector(`.${Vz}`);
			i !== null && (i.draggable = a, DF(i), n.includes(e) && (s.push(i), t && (c = i))), e.querySelector(`.${Rz}`)?.setAttribute("aria-selected", t ? "true" : "false");
			for (let n of e.querySelectorAll(`.${Jz}`)) n.hidden = !t;
			t && (l = e.querySelector(`.${Jz}`));
		}
		this.fitCaptions(e, s, c), this.writeStripHeight(e, l), OF(o, c), o !== null && o !== c && kF(l);
		let u = [], d = null;
		for (let e of s) {
			let t = e.querySelector(`.${Rz}`);
			t === null || e.classList.contains(Gz) || (u.push(t), e === c && (d = t));
		}
		j(u, d), this.focusAfterClose(e, d);
	}
	focusAfterClose(e, t) {
		let n = this.closed;
		n === null || n.root !== e || n.item.isConnected || (this.closed = null, t !== null && (document.activeElement === null || document.activeElement === document.body) && I(t));
	}
	writeStripHeight(e, t) {
		let n = this.hostOf(e);
		if (n === null || t === null || !Tk(t)) return;
		let r = Math.max(0, Math.round(t.getBoundingClientRect().top - n.getBoundingClientRect().top));
		n.style.setProperty(tB, `${r}px`);
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${v}]`);
	}
	fitCaptions(e, t, n) {
		let r = this.hostOf(e), i = e.querySelector(`:scope > .${hF}`);
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownItems(e).find((e) => pB(e) === t)?.querySelector(`.${Rz}`)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownItems(e).filter(Tk).map((e) => ({
				key: pB(e),
				title: e.querySelector(`.${Rz}`)?.textContent?.trim() ?? pB(e),
				current: pB(e) === t,
				disabled: E(e.querySelector(`.${Rz}`) ?? e)
			}));
		});
	}
	prepareMenu(e) {
		let t = e.target;
		if (!(e instanceof CustomEvent) || !(t instanceof HTMLElement) || t.getAttribute("data-ui-context-menu") !== "tab") return;
		let n = t.parentElement, r = e.detail.target.closest(`.${PC}`);
		if (n === null || !n.classList.contains(G) || r === null || r.closest(`.${G}`) !== n) {
			e.preventDefault();
			return;
		}
		let i = sB(n, r), a = lB(t), o = a.map((e) => {
			if (cB(e)) return "rule";
			let t = i.get(e.getAttribute("data-ui-key") ?? "");
			return t !== void 0 && (e.style.display = t ? "" : "none"), t ?? Tk(e) ? "shown" : "hidden";
		});
		if ($O(o).forEach((e, t) => {
			o[t] === "rule" && (a[t].style.display = e ? "" : "none");
		}), !o.includes("shown")) {
			e.preventDefault();
			return;
		}
		this.menuTab = {
			root: n,
			key: pB(r)
		};
	}
	handleMenuEntry(e) {
		let t = e.closest(`[${we}="tab"]`), n = t?.parentElement ?? null, r = e.closest(Xz);
		if (t === null || n === null || !n.classList.contains(G) || r === null || !t.contains(r)) return !1;
		let i = r.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "", a = this.menuTab, o = a === null || a.root !== n ? void 0 : this.ownItems(n).find((e) => pB(e) === a.key);
		if (i.length === 0 || r.matches(`${_n}, ${gn}`) || o === void 0) return !0;
		if (!i.startsWith("tabs:")) return n.dispatchEvent(new CustomEvent(Zz, {
			bubbles: !0,
			detail: { keys: [i, pB(o)] }
		})), !0;
		if (sB(n, o).get(i) !== !0) return !0;
		switch (i) {
			case KO: {
				let e = o.querySelector(`.${Rz}`);
				e !== null && this.startRename(e);
				break;
			}
			case qO:
			case JO:
				this.setPinned(n, o, i === qO);
				break;
			default: o.dispatchEvent(new Event("remove", { bubbles: !0 }));
		}
		return !0;
	}
	setPinned(e, t, n) {
		if (t.hasAttribute("data-ui-tab-pinned") === n) return;
		let r = t.querySelector(`:scope > .${Vz} > .${Hz}`);
		t.toggleAttribute(Ir, n), r !== null && (r.toggleAttribute(Ir, n), r.dispatchEvent(new Event("change", { bubbles: !0 })));
		let i = this.ownItems(e), a = i.filter((e) => e !== t), o = Lz(a.map(fB));
		if (i.indexOf(t) === o) return;
		let s = a[o];
		s === void 0 ? FC(a[a.length - 1]).after(FC(t)) : FC(s).before(FC(t)), t.dispatchEvent(new Event($z, { bubbles: !0 }));
	}
	handleClick(e) {
		if (!(e.target instanceof Element) || this.handleMenuEntry(e.target) || this.handleClose(e, e.target)) return;
		let t = e.target.closest(`.${hF}`), n = t?.parentElement ?? null;
		if (t !== null && n !== null && n.classList.contains(G)) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = uB(e.target), i = r?.closest(`.${G}`) ?? null;
		if (r === null || i === null || E(r)) return;
		let a = r.closest(`.${PC}`);
		a !== null && a.closest(`.${G}`) === i && (e.preventDefault(), this.select(i, pB(a)), document.activeElement !== r && I(r));
	}
	handleClose(e, t) {
		let n = t.closest(`.${zz}`), r = n?.closest(".ui-tab-item") ?? null, i = r?.closest(`.${G}`) ?? null;
		return n === null || r === null || i === null ? !1 : (e.preventDefault(), e.stopPropagation(), aB(i, r) && r.dispatchEvent(new Event("remove", { bubbles: !0 })), !0);
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = uB(e.target), n = t?.closest(`.${G}`) ?? null;
		t === null || n === null || !n.hasAttribute("data-ui-tabs-renamable") || (e.preventDefault(), this.startRename(t));
	}
	startRename(e) {
		let t = e.parentElement, n = e.querySelector(Uz) ?? e, r = e.closest(`.${PC}`);
		t === null || r === null || LC(r, "data-ui-unrenamable") || nc({
			container: t,
			title: n,
			className: Bz,
			value: e.getAttribute("data-ui-tab-caption") ?? n.textContent?.trim() ?? "",
			commit: (t) => {
				e.setAttribute(Fr, t), e.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			refocus: () => I(e)
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || xc(e)) return;
		let t = e.target.closest(`.${Rz}`), n = t?.closest(`.${G}`) ?? null;
		if (t === null || n === null) return;
		if (e.key === "F2") {
			if (!n.hasAttribute("data-ui-tabs-renamable")) return;
			e.preventDefault(), this.startRename(t);
			return;
		}
		let r = t.closest(`.${PC}`);
		if (r === null || r.closest(`.${G}`) !== n) return;
		if (e.key === "Delete" && A(e)) {
			if (!oB(n, r)) return;
			e.preventDefault(), this.closed = {
				root: n,
				item: r
			}, r.dispatchEvent(new Event("remove", { bubbles: !0 }));
			return;
		}
		if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && e.altKey && A(e, { alt: !0 })) {
			this.moveByKey(n, r, e);
			return;
		}
		if (!A(e)) return;
		let i = this.ownItems(n).map((e) => e.querySelector(`.${Rz}`)).filter((e) => e !== null), a = Pc({
			key: e.key,
			items: i,
			current: t,
			axis: "horizontal"
		});
		if (a === null) return;
		e.preventDefault();
		let o = a.closest(`.${PC}`);
		o !== null && this.select(n, pB(o)), a.focus();
	}
	moveByKey(e, t, n) {
		if (!e.hasAttribute("data-ui-tabs-draggable") || LC(t, "data-ui-undraggable") || E(t) || t.hasAttribute("data-ui-tab-pinned")) return;
		n.preventDefault();
		let r = this.ownItems(e), i = r[r.indexOf(t) + (n.key === "ArrowLeft" ? -1 : 1)];
		i === void 0 || i.hasAttribute("data-ui-tab-pinned") || (n.key === "ArrowLeft" ? FC(t).after(FC(i)) : FC(t).before(FC(i)), WC(t, this.ownItems(e).indexOf(t)));
	}
	handleDragStart(e) {
		let t = dB(e);
		if (t === null) return;
		if (LC(t, "data-ui-undraggable") || E(t) || t.hasAttribute("data-ui-tab-pinned")) {
			e.preventDefault();
			return;
		}
		Eh(e, t.closest(`.${G}`) ?? t, t, Wz, pB(t));
		let n = FC(t);
		this.dragStart = n.parentNode === null ? null : {
			parent: n.parentNode,
			next: n.nextSibling
		};
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Vz}`)?.closest(".ui-tab-item") ?? null, n = t?.closest(`.${G}`) ?? null;
		if (t === null || n === null) return;
		let r = n.querySelector(`.${Wz}`);
		if (r === null || (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), r === t)) return;
		let i = t.querySelector(`.${Vz}`)?.getBoundingClientRect();
		if (i === void 0) return;
		let a = FC(r), o = t.hasAttribute("data-ui-tab-pinned") ? rB(n, a) : null, s = o ?? FC(t), c = o === null && e.clientX < i.left + i.width / 2 ? s : s.nextElementSibling;
		c !== a && s.parentElement?.insertBefore(a, c);
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${G}`);
		t !== null && t.querySelector(`.${Wz}`) !== null && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"));
	}
	handleDragEnd(e) {
		let t = dB(e);
		if (t === null) return;
		t.classList.remove(Wz);
		let n = this.dragStart;
		if (this.dragStart = null, e instanceof DragEvent && e.dataTransfer?.dropEffect === "none" && n !== null) {
			n.parent.insertBefore(FC(t), n.next);
			return;
		}
		let r = FC(t);
		if (n !== null && r.parentNode === n.parent && r.nextSibling === n.next) return;
		let i = t.closest(`.${G}`);
		i !== null && WC(t, this.ownItems(i).indexOf(t));
	}
	select(e, t) {
		il(e, t, {
			attribute: Pr,
			bindingAttribute: Nr,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return nl(e, `.${PC}`, `.${G}`);
	}
};
function rB(e, t) {
	let n = null;
	for (let r of nl(e, `.${PC}`, `.${G}`)) {
		let e = FC(r);
		e !== t && r.hasAttribute("data-ui-tab-pinned") && (n = e);
	}
	return n;
}
function iB(e, t) {
	let n = !t.some((e) => !LC(e, ue));
	e.hasAttribute("data-ui-tabs-none-removable") !== n && e.toggleAttribute(xe, n);
}
function aB(e, t) {
	return !e.hasAttribute("data-ui-tabs-unremovable") && !LC(t, "data-ui-unremovable");
}
function oB(e, t) {
	return e.hasAttribute("data-ui-tabs-removes") && aB(e, t) && !t.hasAttribute("data-ui-tab-pinned") && !E(t);
}
function sB(e, t) {
	return QO(ZO(e.getAttribute(Ce)), {
		pinned: t.hasAttribute(Ir),
		renamable: !LC(t, de),
		removable: e.hasAttribute("data-ui-tabs-removes") && aB(e, t)
	});
}
function cB(e) {
	let t = e.getAttribute(_);
	return t === "tabs:separator" || t === "tabs:separator-remove" || e.querySelector(":scope > [data-ui-menu-item-kind=\"separator\"]") !== null;
}
function lB(e) {
	let t = e.querySelector(`[${v}]`);
	return t === null ? [] : Array.from(t.children).filter((e) => e instanceof HTMLElement && e.hasAttribute("data-ui-key"));
}
function uB(e) {
	return e.closest(`.${zz}`) !== null || tc(e) ? null : e.closest(`.${Vz}`)?.querySelector(`:scope > .${Rz}`) ?? null;
}
function dB(e) {
	return e.target instanceof Element ? e.target.closest(`.${Vz}`)?.closest(".ui-tab-item") ?? null : null;
}
function fB(e) {
	return { pinned: e.hasAttribute(Ir) };
}
function pB(e) {
	return e.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "";
}
//#endregion
//#region src/interactions/text-fold-engine.ts
var mB = "button.ui-text__fold-toggle", hB = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(mB);
		t !== null && (e.preventDefault(), t.setAttribute("aria-expanded", t.getAttribute("aria-expanded") === "true" ? "false" : "true"));
	}
}, gB = "ui-temporal-input__segments", _B = "ui-temporal-input__segment", vB = "ui-temporal-input__segment-literal", yB = "ui-temporal-input__segment--empty", bB = "data-ui-temporal-segment", xB = "data-ui-temporal-step-direction", SB = "data-ui-temporal-segments-of", CB = "--", wB = class {
	options;
	root;
	edits = /* @__PURE__ */ new WeakMap();
	wheelTurn = 0;
	onWheel = (e) => this.handleWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${V}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(Yi(e.components, `.${V}`));
		}), R(this.root, `.${V}`, { attributeFilter: [...fT] }, (e) => this.applyAll(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("mousedown", (e) => this.handleStepperPress(e), !0);
	}
	applyAll(e) {
		for (let t of e) mT(t) === "time" && this.applySegments(t);
	}
	applySegments(e) {
		for (let t of e.querySelectorAll(`.${gB}`)) this.applyContainer(e, t);
	}
	applyContainer(e, t) {
		let n = hT(e), r = bT(e), i = H(e, OT(t));
		t.getAttribute(SB) !== n && (t.replaceChildren(...TB(n).map((e) => DB(e))), t.setAttribute(SB, n));
		for (let n of t.children) {
			if (!(n instanceof HTMLElement)) continue;
			let t = n.getAttribute(bB);
			if (t === null) {
				n.textContent = kB(n.dataset.token ?? "", n.dataset.formatted !== void 0, i, r);
				continue;
			}
			n.textContent = AB(t, Number(n.dataset.width ?? "2"), i, r), n.classList.toggle(yB, i === null), n.tabIndex = 0, jB(n, t, i, O(e));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !A(e, { shift: !0 })) return;
		let t = NB(e.target);
		if (t === null) return;
		let n = t.closest(`.${V}`), r = t.getAttribute(bB), i = MB(t);
		if (e.key === "ArrowUp" || e.key === "ArrowDown") {
			e.preventDefault(), this.resetBuffer(n), this.applyStep(n, r, e.key === "ArrowUp" ? 1 : -1, i);
			return;
		}
		if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
			e.preventDefault(), this.resetBuffer(n), FB(n, t, e.key);
			return;
		}
		if (e.key === "Backspace" || e.key === "Delete") {
			e.preventDefault(), this.resetBuffer(n), PT(n, null, i), this.applySegments(n);
			return;
		}
		if (r === "meridiem") {
			let t = IB(e.key, bT(n));
			t !== null && (e.preventDefault(), this.applyMeridiem(n, t, i));
			return;
		}
		e.key.length === 1 && e.key >= "0" && e.key <= "9" && (e.preventDefault(), this.applyDigit(n, t, r, e.key, i));
	}
	handleFocusIn(e) {
		let t = NB(e.target);
		t !== null && (this.wheelTurn = 0, t.addEventListener("wheel", this.onWheel, { passive: !1 }));
	}
	handleWheel(e) {
		let t = NB(e.currentTarget);
		if (t === null || t !== document.activeElement || e.deltaY === 0) return;
		e.preventDefault();
		let { steps: n, carried: r } = w_(this.wheelTurn, C_(e).y);
		if (this.wheelTurn = r, n === 0) return;
		let i = t.closest(`.${V}`);
		this.resetBuffer(i);
		for (let e = 0; e < Math.abs(n); e++) this.applyStep(i, t.getAttribute(bB), n < 0 ? 1 : -1, MB(t));
	}
	handleStepperPress(e) {
		e.target instanceof Element && e.target.closest(`[${xB}]`) !== null && e.preventDefault();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${xB}]`);
		if (t === null) return;
		let n = t.closest(`.${V}`);
		if (n === null || O(n)) return;
		e.preventDefault();
		let r = PB(n) ?? n.querySelector(`.${_B}`);
		r !== null && (r.focus(), this.resetBuffer(n), this.applyStep(n, r.getAttribute(bB), t.getAttribute(xB) === "up" ? 1 : -1, MB(r)));
	}
	handleFocusOut(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${_B}`) : null;
		if (t === null) return;
		t.removeEventListener("wheel", this.onWheel);
		let n = t.closest(`.${V}`);
		n !== null && this.resetBuffer(n);
	}
	applyStep(e, t, n, r) {
		if (t === "meridiem") {
			let t = H(e, r), n = t !== null && t.getHours() >= 12 ? "am" : "pm";
			this.write(e, zT(e, RB(this.baseValue(e, r), n)), r);
			return;
		}
		let i = this.baseValue(e, r), a = LB(t), o = _T(gT(e), a) * n, s = a === "hour" ? 24 : 60, c = ((vT(i, a) + o) % s + s) % s;
		this.write(e, zT(e, yT(i, a, c)), r);
	}
	applyDigit(e, t, n, r, i) {
		let a = this.editState(e), o = n === "hour" ? 23 : n === "hour12" ? 12 : 59, s = +(n === "hour12"), c = (a.unit === n ? a.buffer : "") + r;
		Number(c) > o && (c = r);
		let l = Number(c), u = c.length >= 2 || l * 10 > o;
		if (a.unit = n, a.buffer = u ? "" : c, l >= s) {
			let t = this.baseValue(e, i);
			this.write(e, n === "hour12" ? yT(t, "hour", zB(l, t.getHours() >= 12)) : yT(t, LB(n), l), i);
		}
		u && FB(e, t, "ArrowRight");
	}
	applyMeridiem(e, t, n) {
		this.write(e, RB(this.baseValue(e, n), t), n);
	}
	baseValue(e, t) {
		return H(e, t) ?? RT(e);
	}
	write(e, t, n) {
		PT(e, t, n), IT(e), this.applySegments(e);
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
function TB(e) {
	let t = [];
	for (let n = 0; n < e.length;) {
		let r = _a(e, n);
		if (r === null) {
			t.push({
				kind: "literal",
				token: e[n],
				formatted: !1
			}), n++;
			continue;
		}
		t.push(EB(r)), n += r.length;
	}
	return t;
}
function EB(e) {
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
function DB(e) {
	if (e.kind === "literal") {
		let t = document.createElement("span");
		return t.className = vB, t.dataset.token = e.token, e.formatted && (t.dataset.formatted = ""), t;
	}
	let t = document.createElement("span");
	return t.className = _B, t.tabIndex = 0, t.setAttribute("role", "spinbutton"), t.setAttribute(bB, e.unit), t.dataset.width = String(e.width), OB(t, e.unit), t;
}
function OB(e, t) {
	if (t === "meridiem") {
		T.write(e, "aria-label", "ui.picker.meridiem");
		return;
	}
	let n = LB(t);
	T.write(e, "aria-label", n === "hour" ? "ui.picker.hours" : n === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"), e.setAttribute("aria-valuemin", t === "hour12" ? "1" : "0"), e.setAttribute("aria-valuemax", t === "hour12" ? "12" : t === "hour" ? "23" : "59");
}
function kB(e, t, n, r) {
	return t && n !== null ? fa(n, e, r) : e;
}
function AB(e, t, n, r) {
	if (n === null) return CB;
	if (e === "meridiem") return n.getHours() < 12 ? r.amDesignator : r.pmDesignator;
	let i = e === "hour12" ? Ra(n.getHours()) : vT(n, LB(e));
	return String(i).padStart(t, "0");
}
function jB(e, t, n, r) {
	if (r !== e.hasAttribute("aria-readonly") && (r ? e.setAttribute("aria-readonly", "true") : e.removeAttribute("aria-readonly")), t === "meridiem" || n === null) {
		e.removeAttribute("aria-valuenow");
		return;
	}
	e.setAttribute("aria-valuenow", String(t === "hour12" ? Ra(n.getHours()) : vT(n, LB(t))));
}
function MB(e) {
	return OT(e.closest(`.${gB}`));
}
function NB(e) {
	let t = e instanceof Element ? e.closest(`.${_B}`) : null;
	if (t === null) return null;
	let n = t.closest(`.${V}`);
	return n === null || O(n) ? null : t;
}
function PB(e) {
	return document.activeElement instanceof HTMLElement && document.activeElement.closest(".ui-temporal-input") === e ? document.activeElement.closest(`.${_B}`) : null;
}
function FB(e, t, n) {
	Pc({
		key: n,
		items: [...e.querySelectorAll(`.${_B}`)],
		current: t,
		axis: "horizontal",
		loop: !1
	})?.focus();
}
function IB(e, t) {
	let n = e.toLowerCase();
	return n.length === 1 ? n === "a" || n === t.amDesignator.charAt(0).toLowerCase() ? "am" : n === "p" || n === t.pmDesignator.charAt(0).toLowerCase() ? "pm" : null : null;
}
function LB(e) {
	return e === "hour12" || e === "meridiem" ? "hour" : e;
}
function RB(e, t) {
	return yT(e, "hour", zB(Ra(e.getHours()), t === "pm"));
}
function zB(e, t) {
	let n = e % 12;
	return t ? n + 12 : n;
}
//#endregion
//#region src/interactions/timestamp-engine.ts
var BB = "ui-timestamp", VB = "ui-timestamp__text", HB = "data-ui-timestamp-format", UB = "datetime", WB = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.apply(this.root.querySelectorAll(`.${BB}`), T.temporal === null), T.onTable(() => this.apply(this.root.querySelectorAll(`.${BB}`))), e.propertyPatchEngine?.addValueChangeHandler((e) => this.apply(Yi(e.components, `.${BB}`))), R(this.root, `.${BB}`, {
			childList: !0,
			attributeFilter: [UB],
			relevant: (e) => e.type === "attributes" || !(e.target instanceof Element && e.target.closest(`.${BB}`) !== null)
		}, (e) => this.apply(e));
	}
	apply(e, t = !1) {
		let n = {
			temporal: T.temporal,
			language: T.language || document.documentElement.lang
		}, r = Date.now(), i = !1;
		for (let a of e) {
			let e = Ha(a.getAttribute(HB)), o = Va(a.getAttribute(UB)), s = a.querySelector(`.${VB}`);
			if (s === null || t && !GB(e, o, r)) continue;
			let c = o === null ? "" : Ga(o, e, n, r), l = e === "relative-date" ? qa(c, n.language) : c;
			s.textContent !== l && (s.textContent = l), i ||= Ua(e) && o !== null;
		}
		i && xo(this.refreshRelative);
	}
	refreshRelative = () => {
		let e = [...this.root.querySelectorAll(`.${BB}:is([${HB}="relative"], [${HB}="relative-date"])`)];
		return e.length !== 0 && (this.apply(e), !0);
	};
};
function GB(e, t, n) {
	return e === "relative" || e === "relative-date" && t !== null && Ka(t, n) !== null;
}
//#endregion
//#region src/items/item-reveal.ts
var KB = /* @__PURE__ */ new Map();
function qB(e) {
	if (e.hasAttribute("data-ui-items-host")) return e;
	for (let t of e.querySelectorAll(`[${v}]`)) if (t.closest(b) === e) return t;
	return null;
}
function JB(e, t, n, r) {
	let i = YB(e, t);
	return i !== null && (KB.set(e, {
		key: t,
		block: n
	}), XB(e, i, n, r), !0);
}
function YB(e, t) {
	for (let n of e.children) if (n.getAttribute("data-ui-key") === t) return n;
	return null;
}
function XB(e, t, n, r) {
	let i = t.previousElementSibling, a = i !== null && i.hasAttribute("data-ui-group-header") && i.getAttribute("data-ui-group-anchor") === t.getAttribute("data-ui-key") ? i : null, o = Bc(e);
	if (o.scrollHeight <= o.clientHeight) {
		(a ?? t).scrollIntoView({
			behavior: r,
			block: n === "Start" ? "start" : n === "End" ? "end" : n === "Center" ? "center" : "nearest"
		});
		return;
	}
	let s = o.getBoundingClientRect().top + o.clientTop, c = o.clientHeight, l = (a ?? t).getBoundingClientRect().top, u = t.getBoundingClientRect().bottom, d = ZB(n, l - s, u - s, c);
	d !== 0 && (r === "smooth" ? o.scrollTo({
		top: o.scrollTop + d,
		behavior: r
	}) : o.scrollTop += d);
}
function ZB(e, t, n, r) {
	switch (e) {
		case "Center": return (t + n - r) / 2;
		case "End": return n - r;
		case "Nearest": return t >= 0 && n <= r ? 0 : t < 0 || n - t > r ? t : n - r;
		default: return t;
	}
}
function QB(e) {
	let t = KB.get(e);
	if (t === void 0) return;
	let n = YB(e, t.key);
	if (n === null) {
		KB.delete(e);
		return;
	}
	XB(e, n, t.block, "auto");
}
function $B(e) {
	if (!(KB.size === 0 || !(e instanceof Node))) for (let t of [...KB.keys()]) (!t.isConnected || Bc(t).contains(e)) && KB.delete(t);
}
//#endregion
//#region src/interactions/scroll-anchor-engine.ts
var eV = "data-ui-scroll-anchor", tV = "End", nV = `[${eV}="${tV}"]`, rV = 4, iV = [
	"wheel",
	"touchstart",
	"pointerdown",
	"keydown"
], aV = /* @__PURE__ */ new WeakSet();
function oV(e) {
	aV.add(e);
}
function sV(e) {
	$B(e);
	for (let t = e.closest(nV); t !== null; t = t.parentElement?.closest(nV) ?? null) aV.delete(t);
}
var cV = class {
	root;
	pinned = /* @__PURE__ */ new WeakMap();
	resizes = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null;
	watched = /* @__PURE__ */ new WeakMap();
	watchedContainers = /* @__PURE__ */ new WeakSet();
	heights = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0);
		for (let e of iV) this.root.addEventListener(e, (e) => lV(e), {
			capture: !0,
			passive: !0
		});
		R(this.root, `[${eV}="${tV}"]`, {
			childList: !0,
			characterData: !0,
			attributeFilter: [zt]
		}, (e) => this.followEach(e)), this.followContent();
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof Element) || !dV(t) || this.pinned.set(t, aV.has(t) || pV(t) && !fV(t));
	}
	followContent() {
		this.followEach(this.root.querySelectorAll(`[${eV}="${tV}"]`));
	}
	followEach(e) {
		for (let t of e) {
			if (this.watchRows(t), aV.has(t)) {
				this.pinned.set(t, !0), uV(t);
				continue;
			}
			if (this.pinned.get(t) !== !1) {
				if (fV(t)) {
					this.pinned.set(t, !1);
					continue;
				}
				this.pinned.set(t, !0), uV(t);
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
			if (!e.isConnected || r === null || !dV(r)) {
				this.forget(e);
				continue;
			}
			let i = e.getBoundingClientRect(), a = this.heights.get(e);
			if (this.heights.set(e, i.height), a === i.height) continue;
			let o = a !== void 0 && i.top + a <= r.getBoundingClientRect().top ? i.height - a : 0;
			t.set(r, (t.get(r) ?? 0) + o);
		}
		for (let [e, n] of t) this.followsEnd(e) ? uV(e) : n !== 0 && e.getAttribute("data-ui-host-mode") !== "virtualized" && getComputedStyle(e).overflowAnchor === "none" && (e.scrollTop += n);
	}
	followOwnBox(e) {
		if (!e.isConnected || !dV(e)) {
			this.watchedContainers.delete(e), this.resizes?.unobserve(e);
			return;
		}
		this.followsEnd(e) && uV(e);
	}
	followsEnd(e) {
		return aV.has(e) || this.pinned.get(e) !== !1 && !fV(e);
	}
	forget(e) {
		this.resizes?.unobserve(e), this.heights.delete(e);
	}
};
function lV(e) {
	$B(e.target);
	let t = e.target instanceof Element ? e.target.closest(nV) : null;
	t !== null && aV.delete(t);
}
function uV(e) {
	e.scrollTop = e.scrollHeight;
}
function dV(e) {
	return e.getAttribute(eV) === tV;
}
function fV(e) {
	return PS(e, Pt);
}
function pV(e) {
	return e.scrollHeight - e.scrollTop - e.clientHeight <= rV;
}
//#endregion
//#region src/interactions/text-selection-engine.ts
var mV = `${Ec}, [role='menu'], [role='tab']`, hV = class {
	selection;
	selects;
	constructor(e = {}) {
		let t = e.root ?? document;
		this.selection = e.selection ?? (() => document.getSelection()), this.selects = e.selects ?? gV, t.addEventListener("pointerdown", (e) => this.handlePointerDown(e), { capture: !0 });
	}
	handlePointerDown(e) {
		if (e.button !== 0 || e.pointerType === "touch" || !(e.target instanceof Element)) return;
		let t = this.selection();
		t === null || t.isCollapsed || e.target.closest(mV) !== null || this.selects(e.target) || t.removeAllRanges();
	}
};
function gV(e) {
	let t = getComputedStyle(e);
	return (t.getPropertyValue("user-select") || t.getPropertyValue("-webkit-user-select")) !== "none";
}
//#endregion
//#region src/interactions/scroll-group-mapping.ts
function _V(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.top(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = yV(e, a, n), s = yV(e, a + 1, n);
	return bV(t, o.top, s.top, o.line, s.line);
}
function vV(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.line(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = yV(e, a, n), s = yV(e, a + 1, n);
	return bV(t, o.line, s.line, o.top, s.top);
}
function yV(e, t, n) {
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
function bV(e, t, n, r, i) {
	return n <= t ? r : r + Math.min(1, Math.max(0, (e - t) / (n - t))) * (i - r);
}
//#endregion
//#region src/interactions/scroll-group-engine.ts
var xV = 250, SV = class {
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
		let r = this.memberScrolledBy(t), i = r?.getAttribute(wt);
		if (r != null && i != null && i.length !== 0) for (let e of this.membersOf(i)) e !== r && e.isConnected && this.follow(t, this.viewportOf(e));
	}
	membersOf(e) {
		let t = performance.now(), n = this.members.get(e);
		if (n !== void 0 && t - n.at < xV && n.found.every((e) => e.isConnected)) return n.found;
		let r = [...this.root.querySelectorAll(`[${wt}="${x(e)}"]`)];
		return this.members.set(e, {
			found: r,
			at: t
		}), r;
	}
	memberScrolledBy(e) {
		for (let t = e.closest(`[${wt}]`); t !== null; t = t.parentElement?.closest("[data-ui-scroll-group]") ?? null) if (this.viewportOf(t) === e) return t;
		return null;
	}
	viewportOf(e) {
		let t = this.viewports.get(e);
		if (t !== void 0 && t.isConnected && e.contains(t)) return t;
		let n = CV(e, "data-ui-scroll-viewport") ?? wV(e) ?? e;
		return this.viewports.set(e, n), n;
	}
	follow(e, t) {
		let n = e.scrollHeight - e.clientHeight, r = t.scrollHeight - t.clientHeight;
		if (r <= 0 && t.scrollWidth <= t.clientWidth) return;
		let i = n > 0 ? EV(e) : null, a = i === null ? null : EV(t), o;
		if (n <= 0 || e.scrollTop <= 0) o = 0;
		else if (e.scrollTop >= n - 1) o = r;
		else if (i !== null && a !== null) {
			let t = Math.max(i.endLine, a.endLine);
			o = vV(a, _V(i, e.scrollTop, t), t);
		} else o = e.scrollTop / n * r;
		let s = i === null && a === null ? TV(e.scrollLeft, e.scrollWidth - e.clientWidth) * Math.max(0, t.scrollWidth - t.clientWidth) : t.scrollLeft;
		o = Math.round(Math.min(Math.max(0, o), Math.max(0, r))), !(Math.abs(t.scrollTop - o) < 1 && Math.abs(t.scrollLeft - s) < 1) && (t.scrollTo({
			top: o,
			left: s,
			behavior: "instant"
		}), this.driven.set(t, t.scrollTop));
	}
};
function CV(e, t) {
	for (let n of e.querySelectorAll(`[${t}]`)) if (n.closest("[data-ui-id]") === e) return n;
	return null;
}
function wV(e) {
	let t = e.hasAttribute("data-ui-items-host") ? e : CV(e, v);
	return t === null ? null : Bc(t);
}
function TV(e, t) {
	return t > 0 ? e / t : 0;
}
function EV(e) {
	let t = e.getBoundingClientRect().top + e.clientTop - e.scrollTop, n = (e) => e.getBoundingClientRect().top - t, r = e.querySelector(`[${Tt}]`);
	if (r !== null && r.children.length > 0) return {
		count: r.children.length,
		line: (e) => e + 1,
		top: (e) => n(r.children[e]),
		endLine: r.children.length + 1,
		scrollHeight: e.scrollHeight
	};
	let i = e.querySelectorAll(`[${Et}]`);
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
var DV = ".ui-tab-item__caption, .ui-split-button:not([data-ui-split-mode='menu']) > :is(.ui-split-button__main, .ui-split-button__toggle)", OV = `.${Qr}, .ui-action, .${y}, .ui-select__option, .ui-language-switcher__choice, .ui-pager__size-choice, .ui-color-input__swatch--button, .ui-expander__header, ${DV}`, kV = "ui-key-value-action__row", AV = `${OV}, ${`${sl}, .${kV}`}`, jV = "ui-pressing", MV = "ui-press-held", NV = "--ui-press-x", PV = "--ui-press-y", FV = "--ui-ripple-radius", IV = "--ui-ripple-opacity", LV = class {
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
		if (t === null || typeof t.animate != "function" || xf()) return;
		for (let [e, n] of this.presses) n.element === t && this.finish(e, n);
		let n = t.getBoundingClientRect(), r = e.clientX - n.left, i = e.clientY - n.top, a = Math.hypot(Math.max(r, n.width - r), Math.max(i, n.height - i));
		t.style.setProperty(NV, `${r}px`), t.style.setProperty(PV, `${i}px`), t.classList.add(jV, MV);
		let o = t.animate([{ [FV]: "0px" }, { [FV]: `${a}px` }], {
			duration: L.ripple,
			easing: L.ease,
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
		let t = e.closest(DV) ?? e.closest(AV);
		if (t === null || E(t)) return null;
		let n = e.closest(Yr);
		return n !== null && n !== t && t.contains(n) ? null : t.matches(OV) ? t : this.pressedRow(t, e);
	}
	pressedRow(e, t) {
		if (Nc(t, e) !== null || D(e) || e.hasAttribute("data-ui-row-editing")) return null;
		let n = e.closest(N), r = n !== null && !e.classList.contains(kV) && !n.hasAttribute("data-ui-no-row-select") && (n.getAttribute("data-ui-selection") === "one" || n.getAttribute("data-ui-selection") === "many"), i = e.classList.contains("ui-tree__row") && qo(e, "data-ui-unselectable");
		return !r && !i && !this.raisesClick(e, t) ? null : P(e);
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
		n.element.classList.remove(MV);
		let r = Math.max(0, L.ripple - (performance.now() - n.started)), i = 0;
		!t && r > 0 && (i = Math.min(r, L.fast), n.grow.updatePlaybackRate(r / i)), n.fade = n.element.animate([{ [IV]: 1 }, { [IV]: 0 }], {
			duration: L.normal,
			delay: i,
			easing: L.exit,
			fill: "forwards"
		}), n.fade.addEventListener("finish", () => this.finish(e, n));
	}
	finish(e, t) {
		t.grow.cancel(), t.fade?.cancel(), t.element.classList.remove(jV, MV), this.presses.get(e) === t && this.presses.delete(e);
	}
}, RV = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"Home",
	"End",
	"PageUp",
	"PageDown"
]), zV = [
	"click",
	"dblclick",
	"auxclick",
	"dragstart"
], BV = `.${Br}, .${Vr}`, VV = RegExp(`(^|\\s)(${Br}|${Vr})(\\s|$)`), HV = RegExp(`(^|\\s)${Hr}(\\s|$)`), UV = "[type='range']", WV = /* @__PURE__ */ new WeakSet(), GV = /* @__PURE__ */ new WeakSet();
function KV(e = document) {
	let t = e === document ? window : e;
	for (let e of zV) t.addEventListener(e, eH, !0);
	t.addEventListener("keydown", nH, !0), t.addEventListener("change", rH, !0), t.addEventListener("pointerdown", iH, !0), t.addEventListener("mousedown", iH, !0), ZV(e.querySelectorAll(BV)), YV(e.querySelectorAll(`[${zr}]`)), JV(e.querySelectorAll(UV)), new MutationObserver((e) => {
		for (let t of e) qV(t);
	}).observe(e, {
		subtree: !0,
		childList: !0,
		attributes: !0,
		attributeFilter: ["class", zr],
		attributeOldValue: !0
	});
}
function qV(e) {
	if (e.type === "attributes") {
		let t = e.target;
		if (e.attributeName === "data-ui-href") {
			XV(t, e.oldValue !== null);
			return;
		}
		let n = VV.test(e.oldValue ?? ""), r = t.matches(BV);
		n !== r && (QV(t, r), XV(t)), HV.test(e.oldValue ?? "") !== t.matches(".ui-readonly") && JV(t.querySelectorAll(UV));
		return;
	}
	let t = (e.target instanceof Element ? e.target : null)?.matches(BV) === !0;
	for (let n of e.addedNodes) n instanceof Element && (t && $V(n), n.matches(BV) && QV(n, !0), ZV(n.querySelectorAll(BV)), XV(n), YV(n.querySelectorAll(`[${zr}]`)), JV([n, ...n.querySelectorAll(UV)]));
}
function JV(e) {
	for (let t of e) {
		if (!(t instanceof HTMLInputElement) || t.type !== "range") continue;
		let e = O(t);
		e !== WV.has(t) && (e ? (WV.add(t), t.addEventListener("touchstart", iH, { passive: !1 })) : (WV.delete(t), t.removeEventListener("touchstart", iH)));
	}
}
function YV(e) {
	for (let t of e) XV(t);
}
function XV(e, t = !1) {
	let n = e.getAttribute(zr);
	n === null && !t || (e.matches(BV) ? (e.removeAttribute("href"), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0")) : n === null || !Ng(n) ? e.removeAttribute("href") : e.getAttribute("href") !== n && (e.setAttribute("href", n), e.getAttribute("tabindex") === "0" && e.removeAttribute("tabindex")));
}
function ZV(e) {
	for (let t of e) QV(t, !0);
}
function QV(e, t) {
	for (let n of e.children) t ? $V(n) : GV.has(n) && (GV.delete(n), n.removeAttribute("inert"));
}
function $V(e) {
	e.hasAttribute("inert") || (GV.add(e), e.setAttribute("inert", ""));
}
function eH(e) {
	e.target instanceof Element && (E(e.target) ? (e.type === "click" && Qp(e), aH(e)) : e.type === "click" && tH(e.target) && e.preventDefault());
}
function tH(e) {
	return e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio") && O(e);
}
function nH(e) {
	if (!(!(e instanceof KeyboardEvent) || !(e.target instanceof Element))) {
		if ((e.key === "Enter" || e.key === " ") && E(e.target)) {
			aH(e);
			return;
		}
		!RV.has(e.key) || !(e.target instanceof HTMLInputElement) || (e.target.type === "range" || e.target.type === "radio") && O(e.target) && e.preventDefault();
	}
}
function rH(e) {
	e.target instanceof HTMLInputElement && e.target.type === "range" && O(e.target) && e.stopImmediatePropagation();
}
function iH(e) {
	!(e.target instanceof HTMLInputElement) || e.target.type !== "range" || !O(e.target) || (e.preventDefault(), e.target.focus({ preventScroll: !0 }));
}
function aH(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region src/interactions/popup-service.ts
var oH = /* @__PURE__ */ new WeakMap(), sH = /* @__PURE__ */ new WeakSet(), cH = /* @__PURE__ */ new WeakSet(), lH = new Km({
	show: () => void 0,
	hide: ({ popup: e }, t) => {
		let n = oH.get(e);
		oH.delete(e), t !== void 0 && n?.(t);
	},
	single: !1,
	isInside: ({ popup: e, anchor: t }, n) => n.includes(e) || t !== void 0 && n.includes(t),
	onPress: !0,
	closesOnTab: ({ popup: e }) => sH.has(e),
	sheetOnPhone: ({ popup: e }) => cH.has(e)
});
function uH(e) {
	return {
		open: (e, t, n) => dH(e, t, n, (e) => lH.open(e)),
		openList: fH,
		listKey: pD,
		followPointer: gD,
		focusReturn: (t) => vd(t, e)
	};
}
function dH(e, t, n, r) {
	let i = n.owner ?? (e instanceof HTMLElement ? e : t), a = () => lH.popupOf(i) === t;
	return oH.set(t, n.onDismiss), n.closesOnTab === !0 ? sH.add(t) : sH.delete(t), n.sheetOnPhone === !0 ? cH.add(t) : cH.delete(t), r({
		owner: i,
		popup: t,
		anchor: e,
		placement: n
	}) || (oH.delete(t), queueMicrotask(() => n.onDismiss("owner"))), {
		reposition: () => {
			a() && lH.reposition(i);
		},
		close: () => {
			a() && lH.close(i);
		}
	};
}
function fH(e, t, n) {
	return dH(e, t, {
		...n,
		closesOnTab: !0
	}, (e) => fD(lH, e, n.entries, n.checked, n.fromEnd, n.focus));
}
//#endregion
//#region src/rendering/series-colors.ts
var pH = "--ui-color-series-count", mH = "--ui-color-series-", hH = 8;
function gH(e) {
	let t = Number(getComputedStyle(e).getPropertyValue(pH));
	return Number.isFinite(t) && t >= 1 ? Math.floor(t) : hH;
}
function _H(e, t) {
	return `var(${mH}${e % t + 1})`;
}
var vH = {
	count: gH,
	color: _H
};
//#endregion
//#region src/items/item-rows.ts
function yH(e, t, n) {
	return {
		itemOf: (e) => t.getItemValue(e),
		itemsOf: (e) => n.itemsOf(e),
		readPath: aC,
		renderVariant: (n, r, i) => {
			let a = e.getVariantTemplate(r, i), o = t.getItemScope(n);
			return a === void 0 || o === void 0 ? null : t.renderFromTemplate(a, o.item, t.getAncestorStack(n));
		},
		isKeyTarget: (e) => Gl(e) !== null,
		cellsOf: (e) => {
			let t = e.closest(N);
			return t !== null && eu(t) ? ru(t, e) : [];
		},
		moveCursor: (e, t) => hu(e, t ?? null)
	};
}
//#endregion
//#region src/items/items-template-renderer.ts
var bH = class {
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
		let c = this.metadata.getItemsTemplateMetadata(e), l = c?.itemWrapperElementName ? CH(o, c.itemWrapperElementName, c.itemWrapperClassName ?? null, c.itemWrapperRole ?? null) : o;
		l !== o && this.moveItemScope(o, l), wH(l, n, t);
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
		let i = SH(r.item, t, n);
		i !== r.item && this.itemStackByRoot.set(e, {
			scopeComponentId: r.scopeComponentId,
			item: i
		});
	}
	renderFromTemplate(e, t, n = []) {
		let r = e.content.cloneNode(!0).firstElementChild;
		if (r === null) return s("template is empty.", { item: t }), null;
		let i = {
			scopeComponentId: w(r),
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
			xH(n, e) && this.applyBoundAttribute(i, String(C(n.bindingId)), e, t);
		}
	}
	findTranslatableRowBindings() {
		let e = [];
		for (let t of this.metadata.metadata.bindings) {
			let n = this.metadata.getPropertyDefinition(t.propertyId);
			if (n === void 0 || typeof t.itemTemplate != "string" || !this.metadata.isTranslatable(t)) continue;
			let r = C(t.bindingId);
			e.push([t, `[${qe}${di(n.propertyName)}="${x(r)}"]`]);
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
		let r = kH(t, n.templateKeyPropertyName);
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
		r !== void 0 && tC(e, r.itemTemplateParameters, n) || this.applyBoundAttribute(e, t, n);
	}
	applyBoundAttribute(e, t, n, r) {
		let i = Number(t);
		if (!Number.isInteger(i) || i <= 0) return;
		let a = this.metadata.getBindingById(i), o = a === void 0 ? void 0 : this.metadata.getPropertyDefinition(a.propertyId);
		if (a === void 0 || o === void 0) return;
		let c = a.itemTemplate === null || a.itemTemplate === void 0 ? this.state.has(a, []) ? {
			ok: !0,
			value: this.state.get(a, [])
		} : { ok: !1 } : eC(n, a.itemTemplate, a.itemTemplateParameters);
		if (!c.ok) {
			a.optional !== !0 && !this.unresolved.has(i) && (this.unresolved.add(i), s("item binding value could not be resolved; the item's path stops short of the property.", {
				binding: a,
				stack: n
			}));
			return;
		}
		let l = "scope" in c ? c.scope : void 0, u = c.value ?? a.fallbackValue;
		if (r !== void 0 && !r(u)) return;
		let d = Io(u, () => this.metadata.isTranslatable(a) && !nC(l)), f = C(a.componentId), p = e.closest(`[${ae}="${f}"]`);
		if (p === null) {
			s("item binding component root was not found in the cloned template.", { binding: a });
			return;
		}
		for (let t of o.operations) {
			let n = mi(p, t, () => [e])[0] ?? null;
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
function xH(e, t) {
	for (let n of e.itemTemplateParameters ?? []) {
		let e = C(n.componentId);
		if (e > 0 && !t.some((t) => t.scopeComponentId === e)) return !1;
	}
	return !0;
}
function SH(e, t, n) {
	if (t.length === 0) return n;
	let r = e;
	for (let n = 0; n < t.length - 1; n++) {
		let i = t[n], a = i.kind === "property" ? oC(r, i.name) : dC(r, i.key);
		if (!a.ok) return e;
		r = a.value;
	}
	if (typeof r != "object" || !r) return e;
	let i = t[t.length - 1];
	if (i.kind === "element") return fC(r, i.key, n), e;
	let a = r;
	return a[cC(a, i.name)] = n, e;
}
function CH(e, t, n, r) {
	let i = document.createElement(t);
	return n !== null && (i.className = n), r !== null && r.length > 0 && i.setAttribute("role", r), i.appendChild(e), i;
}
function wH(e, t, n) {
	e.setAttribute(_, t), OH(e, n), EH(e, n);
}
var TH = [
	["CanSelect", ce],
	["CanDrag", le],
	["CanRemove", ue],
	["CanRename", de],
	["CanShowContextMenu", fe]
];
function EH(e, t) {
	for (let [n, r] of TH) {
		let i = oC(t, n);
		e.toggleAttribute(r, i.ok && i.value === !1);
	}
}
function DH(e, t) {
	let n = e.getAttribute(_), r = e.closest(`[${v}]`);
	if (EH(e, t), n !== null) for (let i of e.querySelectorAll(`[${_}="${x(n)}"]`)) i.closest("[data-ui-items-host]") === r && EH(i, t);
}
function OH(e, t) {
	let n = oC(t, "Group");
	n.ok && typeof n.value == "string" ? e.setAttribute(_t, n.value) : e.removeAttribute(_t);
}
function kH(e, t) {
	if (t == null || t.trim().length === 0) return null;
	let n = oC(e, t);
	return !n.ok || n.value === null || n.value === void 0 ? null : typeof n.value == "string" ? n.value : String(n.value);
}
//#endregion
//#region src/items/items-rule-watcher.ts
var AH = "Group", jH = class {
	options;
	dragged = null;
	deferred = /* @__PURE__ */ new Map();
	drawnByHost = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, e.propertyPatchEngine.addValueChangeHandler((e) => this.handleItemValueChange(e));
		for (let t of e.metadata.metadata.itemsFilterSort) {
			let n = C(t.componentId), r = [...t.filters, ...t.sorts], i = () => this.syncComponentHosts(n);
			for (let t of r) t.source !== null && t.source !== void 0 && e.reactiveSources.watch(t.source, i);
		}
		e.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), e.root.addEventListener("dragend", () => this.land(), !0), R(e.root, `[${bt}="${xt}"]`, { attributeFilter: [at] }, (e) => {
			for (let t of e) {
				let e = Zi(t);
				e !== null && this.syncComponentHosts(e);
			}
		}), R(e.root, `[${St}="windowed"]`, { attributeFilter: [Ft] }, (e) => {
			for (let t of e) {
				let e = Zi(t);
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
			for (let [t, n] of e) t.isConnected && TR(t, n, this.options);
		});
	}
	handleItemValueChange(e) {
		if (e.dynamicParameters.length === 0) return;
		let t = this.options.metadata.getBindingByComponentAndPropertyId(C(e.reference.componentId), e.reference.propertyId), n = t === void 0 ? null : uC(t);
		if (n === null) return;
		let r = this.resolveItemRoots(e, n);
		for (let t of r) this.applyItemValue(t, n, e.value);
		r.length === 0 && this.applyVirtualizedItemValue(e, n);
	}
	applyVirtualizedItemValue(e, t) {
		let n = e.dynamicParameters[e.dynamicParameters.length - 1];
		if (typeof n == "string") for (let r of this.options.root.querySelectorAll(`[${v}]`)) {
			if (jS(r) !== "virtualized") continue;
			let i = r.closest(b);
			i === null || !this.drawsPatchedComponent(i, C(e.reference.componentId), t) || !MH(i, e.dynamicParameters) || this.options.virtualization.updateValue(r, n, t.steps, e.value) && this.redrawsVirtualized(w(i), t) && this.sync(r, w(i));
		}
	}
	drawsPatchedComponent(e, t, n) {
		let r = `${w(e)}:${n.scopeComponentId}:${t}`, i = this.drawnByHost.get(r);
		if (i !== void 0) return i;
		let a = !1;
		for (let r of e.querySelectorAll(":scope > template")) {
			let e = r.content.firstElementChild;
			if (e !== null && (a = n.scopeComponentId > 0 ? w(e) === n.scopeComponentId : w(e) === t || e.querySelector(`[data-ui-id="${t}"]`) !== null, a)) break;
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
		TR(e, t, this.options);
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
		return typeof t == "string" ? [...this.options.root.querySelectorAll(`[${_}="${x(t)}"]`)].filter((t) => this.isItemRoot(t) && Gi(t, e)) : [];
	}
	applyItemValue(e, t, n) {
		let r = e.closest(`[${v}]`), i = r === null ? null : Zi(r);
		if (r !== null && i !== null && jS(r) === "virtualized") {
			let a = e.getAttribute(_);
			if (a === null || !this.options.virtualization.updateValue(r, a, t.steps, n)) return;
			e.isConnected && this.restampAbilities(e, t), this.redrawsVirtualized(i, t) && this.sync(r, i);
			return;
		}
		this.options.renderer.updateItemValue(e, t.steps, n);
		let a = NH(AH, t);
		a && OH(e, this.options.renderer.getItemValue(e)), this.restampAbilities(e, t), r !== null && i !== null && (!a && !this.feedsRule(i, t) || this.sync(r, i));
	}
	restampAbilities(e, t) {
		TH.some(([e]) => NH(e, t)) && DH(e, this.options.renderer.getItemValue(e));
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
		if (this.options.templates.getGroupTemplate(e) !== void 0 && NH(AH, t)) return !0;
		let n = this.options.metadata.getItemsFilterSortMetadata(e);
		return n === void 0 ? !1 : n.filters.some((e) => NH(e.itemProperty, t)) || n.sorts.some((e) => NH(e.itemProperty, t));
	}
	syncComponentHosts(e) {
		for (let t of this.options.root.querySelectorAll(`[${v}]`)) {
			let n = Zi(t);
			n === e && this.sync(t, n);
		}
	}
};
function MH(e, t) {
	let n = Wi(e, Ui(e));
	return t.length === n.length + 1 && n.every((e, n) => String(e ?? "") === String(t[n] ?? ""));
}
function NH(e, t) {
	let n = t.ruleSegments.join(".");
	return n.length === 0 || e === n || e.startsWith(`${n}.`);
}
//#endregion
//#region src/items/table-row-indices.ts
var PH = "ui-table", FH = "ui-table--no-header";
function IH(e, t, n) {
	let r = e.parentElement, i = r?.parentElement ?? null;
	if (r === null || i === null || !r.classList.contains("ui-table__scroll") || !i.classList.contains(PH)) return;
	let a = [], o = [], s = !1;
	for (let t of r.children) t === e ? s = !0 : t.getAttribute("role") === "row" && !(t === r.firstElementChild && i.classList.contains(FH)) && (s ? o : a).push(t);
	a.forEach((e, t) => LH(e, t));
	for (let [e, n] of t) LH(e, a.length + n);
	n !== null && o.forEach((e, t) => LH(e, a.length + n + t)), RH(i, "aria-rowcount", n === null ? "-1" : String(a.length + n + o.length));
}
function LH(e, t) {
	RH(e, "aria-rowindex", String(t + 1));
}
function RH(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/items/items-window-engine.ts
var zH = 50, BH = 1, VH = .5, HH = 60, UH = "--ui-window-look", WH = "--ui-window-row", GH = "--ui-window-tile", KH = 3, qH = class {
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
			if (this.layout(t), QH(t) === 0) {
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
		let t = NS(e, jt);
		if (t !== null && dV(e) && PS(e, "data-ui-window-more-after")) {
			Uc(e, Math.max(0, this.windowBottom(e, t) - Hc(e).height));
			return;
		}
		t !== null && t !== 0 && Uc(e, PS(e, "data-ui-window-more-after") ? t * this.getState(e).itemSize : e.scrollHeight);
	}
	windowBottom(e, t) {
		let n = ZH(e), r = this.getState(e).itemSize, i = n.length === 0 ? 0 : Gc(n[n.length - 1]).bottom - Gc(n[0]).top;
		return t * r + (i > 0 ? i : n.length * r);
	}
	sync() {
		for (let e of this.hosts()) this.layout(e), this.getState(e).pending || this.realign(e);
	}
	realign(e) {
		let t = NS(e, jt), n = ZH(e);
		if (t === null || n.length === 0 || e.hasAttribute("data-ui-window-paged")) return;
		let r = this.getState(e), i = Hc(e), a = Math.floor(i.top / r.itemSize);
		Math.ceil((i.top + i.height) / r.itemSize) >= t && a <= t + n.length || this.revealWindow(e);
	}
	reconsider() {
		for (let e of this.hosts()) this.considerRequest(e);
	}
	async requestOffsetAsync(e, t) {
		jS(e) === "windowed" && await this.requestAsync(e, "Offset", Math.max(0, Math.floor(t)), null, !1);
	}
	hosts() {
		return [...this.root.querySelectorAll(`[${v}][${St}="windowed"]`)];
	}
	handleScroll(e) {
		let t = Vc(e.target);
		if (t === null || jS(t) !== "windowed" || t.hasAttribute("data-ui-window-paged")) return;
		let n = this.getState(t);
		n.scheduled === 0 && (this.considerRequest(t), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.considerRequest(t);
		}, HH));
	}
	considerRequest(e) {
		let t = this.getState(e);
		if (t.pending) {
			t.restless = !0;
			return;
		}
		if (e.hasAttribute("data-ui-window-paged") && QH(e) > 0) return;
		let n = ZH(e);
		if (n.length === 0) {
			this.requestAsync(e, "Start", 0, null, !1);
			return;
		}
		let r = NS(e, jt), i = PS(e, Nt), a = PS(e, Pt);
		if (r !== null) {
			let o = this.windowSize(e), s = Hc(e), c = Math.max(1, Math.round(s.height * BH / t.itemSize), Math.floor(o * VH)), l = Math.floor(s.top / t.itemSize), u = Math.ceil((s.top + s.height) / t.itemSize);
			if (u < r || l > r + n.length) {
				this.requestAsync(e, "Offset", this.landingOffset(e, l, o), null, !1);
				return;
			}
			if (l - c <= r && i) {
				this.requestAsync(e, "Before", 0, $H(n[0]), !0);
				return;
			}
			if (u + c >= r + n.length && a) {
				this.requestAsync(e, "After", 0, $H(n[n.length - 1]), !0);
				return;
			}
			return;
		}
		let o = Hc(e), s = Math.max(1, o.height * BH), c = o.contentHeight - o.top - o.height;
		if (o.top <= s && i) {
			this.requestAsync(e, "Before", 0, $H(n[0]), !0);
			return;
		}
		c <= s && a && this.requestAsync(e, "After", 0, $H(n[n.length - 1]), !0);
	}
	landingOffset(e, t, n) {
		let r = Math.max(0, t - Math.floor(n / 4)), i = NS(e, Mt);
		return i === null ? r : Math.min(r, Math.max(0, i - n));
	}
	async requestAsync(e, t, n, r, i) {
		let a = Zi(e);
		if (a === null) {
			s("a windowed items host is not inside an addressable component.", e);
			return;
		}
		if (r === null && (t === "Before" || t === "After")) return;
		let o = this.getState(e);
		o.pending = !0;
		let c = e.closest(b);
		e.setAttribute(Ot, t.toLowerCase()), c?.setAttribute(Ot, t.toLowerCase()), e.setAttribute("aria-busy", "true"), t === "After" && NS(e, "data-ui-window-total") === null && YH(e) && vR(e, _R, KH * this.rowSize(e));
		try {
			await this.options.requestWindow({
				componentId: a,
				dynamicParameters: eU(e),
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
			o.pending = !1, e.removeAttribute(Ot), c?.removeAttribute(Ot), e.removeAttribute("aria-busy"), vR(e, _R, 0), this.layout(e), o.restless ? (o.restless = !1, this.considerRequest(e)) : this.realign(e);
		}
	}
	layout(e) {
		let t = this.getState(e), n = ZH(e), r = NS(e, Mt), i = NS(e, jt);
		if (IH(e, n.map((e, t) => [e, (i ?? 0) + t]), r), e.hasAttribute("data-ui-window-paged")) {
			vR(e, "top", 0), vR(e, gR, 0);
			return;
		}
		if (n.length > 0) {
			let r = Gc(n[n.length - 1]).bottom - Gc(n[0]).top;
			if (r > 0) {
				let i = JH(n), a = Math.ceil(n.length / i);
				t.itemSize = Math.max(1, Math.round(r / (a * i))), XH(e, a > 1 ? (Gc(n[n.length - 1]).top - Gc(n[0]).top) / (a - 1) : r, i > 1 ? Gc(n[1]).left - Gc(n[0]).left : null);
			}
		}
		let a = r === null || i === null ? 0 : i * t.itemSize, o = r === null || i === null ? 0 : Math.max(0, r - i - n.length) * t.itemSize;
		vR(e, "top", a), vR(e, gR, o), QB(e);
	}
	rowSize(e) {
		let t = Number.parseFloat(e.style.getPropertyValue(WH));
		return Number.isFinite(t) && t > 0 ? t : this.getState(e).itemSize;
	}
	windowSize(e) {
		let t = NS(e, At);
		return t !== null && t > 0 ? t : zH;
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
function JH(e) {
	let t = Gc(e[0]).top, n = 1;
	for (; n < e.length && Gc(e[n]).top === t;) n++;
	return n;
}
function YH(e) {
	return getComputedStyle(e).getPropertyValue(UH).trim() === "skeleton";
}
function XH(e, t, n) {
	let r = e.style, i = `${Math.round(t * 100) / 100}px`, a = n !== null && n > 0 ? `${Math.round(n * 100) / 100}px` : "";
	r.getPropertyValue(WH) !== i && r.setProperty(WH, i), r.getPropertyValue(GH) !== a && (a.length === 0 ? r.removeProperty(GH) : r.setProperty(GH, a));
}
function ZH(e) {
	return [...e.children].filter((e) => e.hasAttribute(_));
}
function QH(e) {
	return ZH(e).length;
}
function $H(e) {
	return e.getAttribute(_);
}
function eU(e) {
	let t = e.closest(b);
	return t === null ? [] : Wi(t, Ui(t));
}
//#endregion
//#region src/items/items-composite-renderer.ts
var tU = [
	ae,
	oe,
	se
];
function nU(e, t, n, r, i, a, o) {
	let c = document.createElement(e.itemElementName);
	c.className = e.itemClassName, rU(c, e.itemRole);
	let l = aU(c, e, t, a);
	l !== 0 && o.populateElement(c, n, l, i);
	for (let l of e.slots) {
		let e = iU(l, t, n, a);
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
		d.className = l.wrapperClassName, rU(d, l.wrapperRole);
		for (let [e, t] of Object.entries(l.wrapperAttributes ?? {})) d.setAttribute(e, t);
		d.appendChild(u), wH(d, r, n), c.appendChild(d);
	}
	return wH(c, r, n), o.registerItemScope(c, l, n), c;
}
function rU(e, t) {
	t != null && t.length > 0 && e.setAttribute("role", t);
}
function iU(e, t, n, r) {
	let i = kH(n, e.variantKeyPropertyName);
	if (i !== null && i.length > 0) {
		let n = r.getVariantTemplate(t, `${e.variantKey}:${i}`);
		if (n !== void 0) return n;
	}
	return r.getVariantTemplate(t, e.variantKey);
}
function aU(e, t, n, r) {
	let i = t.hostSlotVariantKey;
	if (i == null || i.length === 0) return 0;
	let a = r.getVariantTemplate(n, i)?.content.firstElementChild ?? null;
	if (a === null) return s("composite item host slot template was not found.", {
		componentId: n,
		hostSlotVariantKey: i
	}), 0;
	for (let t of tU) {
		let n = a.getAttribute(t);
		n !== null && e.setAttribute(t, n);
	}
	for (let t of Array.from(a.attributes)) t.name.startsWith("data-ui-bind-") && e.setAttribute(t.name, t.value);
	return e instanceof HTMLElement && (e.style.alignSelf = "stretch", e.style.justifySelf = "stretch"), w(a);
}
//#endregion
//#region src/items/items-row-renderer.ts
function oU(e, t, n, r, i) {
	let a = i.metadata.getItemsTemplateMetadata(e), o = a?.composite;
	if (o == null) return sU(i.renderer.renderItem(e, t, n, r), a);
	let s = nU(o, e, t, n, r, i.templates, i.renderer);
	return s !== null && a?.rowDecorator && i.renderer.decorateRow(a.rowDecorator, s, t, n, e, r), sU(s, a);
}
function sU(e, t) {
	return e === null ? null : (t?.announcesSelection === !0 && !e.hasAttribute("aria-selected") && e.setAttribute("aria-selected", "false"), zo(e), e);
}
//#endregion
//#region src/items/items-virtualization-engine.ts
var cU = 6, lU = 60, uU = class {
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
		return r === void 0 || i < 0 || a < 0 ? null : r.slice(Math.min(i, a), Math.max(i, a) + 1).filter((e) => mU(e.entry) === !1).map((e) => e.entry.key);
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
		if (!vU(e) && !gU(e)) return a.element;
		let o = getComputedStyle(e), s = xU(o), c = r.projected.map((e) => this.pitchOf(r, e) + s), l = vU(e) ? yU(r.projected, c, r.across) : null, u = l === null ? i : _U(l.starts, i), d = l?.pitches ?? c, f = SU(o.paddingTop) + CU(d, 0, u), p = f + d[u] - s, m = Hc(e), h = n === "start" || n === "nearest" && f < m.top ? f : n === "end" || p > m.top + m.height ? p - m.height : null;
		return h !== null && Uc(e, Math.max(0, h)), this.layout(e, r), a.element;
	}
	sync(e) {
		let t = this.getState(e);
		if (t === null) return;
		let n = dV(e) && pV(e), r = t.projected;
		this.project(e, t), this.keepCursorShown(e, t, r), this.layout(e, t), n && !pV(e) && (Uc(e, e.scrollHeight), this.layout(e, t));
	}
	refill(e, t) {
		let n = this.getState(e);
		if (n === null) return [];
		let r = new Map(n.entries.map((e) => [e.key, e])), i = [], a = [];
		for (let { key: n, item: o } of t) {
			let t = r.get(n);
			if (r.delete(n), t !== void 0 && Hd(t.item, o)) {
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
		let n = ku(t);
		t.remove(), Au(e, null, n);
	}
	keepCursorShown(e, t, n) {
		let r = Ou(e), i = t.entries.find((e) => e.element?.hasAttribute("data-ui-row-focus") === !0) ?? null, a = i?.key ?? (r === null ? null : Mu(r));
		if (r === null || a === null) return;
		let o = /* @__PURE__ */ new Set();
		for (let e of t.projected) e.header || o.add(e.entry.key);
		if (o.has(a)) return;
		let s = n.filter((e) => !e.header).map((e) => e.entry), c = s.findIndex((e) => e.key === a), l = c < 0 ? void 0 : s.slice(c + 1).find((e) => o.has(e.key)) ?? s.slice(0, c).reverse().find((e) => o.has(e.key));
		if (i?.element?.removeAttribute(Ne), l === void 0) {
			r.removeAttribute(Pe), r.removeAttribute("aria-activedescendant");
			return;
		}
		l.element instanceof HTMLElement ? Ql(r, B(e).filter((e) => e instanceof HTMLElement), l.element, null, !1) : r.setAttribute(Pe, l.key);
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
		let i = n.entries[r].element, a = Ou(e), o = B(e).filter((e) => e instanceof HTMLElement), s = a !== null && i instanceof HTMLElement ? Tu(a, o, i) : null;
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
		return i === null || a === void 0 ? !1 : (a.item = SH(a.item, n, r), n.length === 0 && a.element !== null && (this.dropRow(e, a.element), a.element = null), !0);
	}
	project(e, t) {
		let n = this.options.metadata.getItemsFilterSortMetadata(t.componentId), r = mC(e), i = this.options.templates.getGroupTemplate(t.componentId), a = vC(n, this.options.state, r), o = t.entries;
		if ((n !== void 0 && n.filters.length > 0 || (r?.filters ?? []).length > 0) && (o = o.filter((e) => gC(n, e.item, this.options.state, r))), !(i !== void 0 && o.some((e) => hU(e) !== ""))) {
			a.length > 0 && (o = [...o].sort((e, t) => bC(e.item, t.item, a))), t.projected = o.map((e) => ({
				entry: e,
				header: !1
			}));
			return;
		}
		let { buckets: s, order: c } = fR(o, hU, t.groupOrder);
		t.groupOrder = c;
		let l = [];
		for (let e of c) {
			let t = s.get(e);
			a.length > 0 && (t = [...t].sort((e, t) => bC(e.item, t.item, a))), e !== "" && l.push({
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
		let t = Vc(e.target);
		t !== null && jS(t) === "virtualized" && this.relayout(t);
	}
	handleResize(e) {
		for (let t of e) {
			let e = t.target;
			e.isConnected && jS(e) === "virtualized" ? window.requestAnimationFrame(() => this.relayout(e)) : this.resizes?.unobserve(e);
		}
	}
	relayout(e) {
		let t = this.getState(e);
		t !== null && t.scheduled === 0 && (this.layout(e, t), t.scheduled = window.setTimeout(() => {
			t.scheduled = 0, this.layout(e, t);
		}, lU));
	}
	layout(e, t) {
		let n = t.projected, r = getComputedStyle(e), i = xU(r), a = n.map((e) => this.pitchOf(t, e) + i), o = n.length, s = t.across, c = vU(e) ? yU(n, a, s) : null, l = c?.pitches ?? a, u = l.length, d = 0, f = u;
		if ((c !== null || gU(e)) && u > 0) {
			let i = SU(r.paddingTop), a = Hc(e), o = fU(e, t, n, l, s, a.top - i, i), c = o + a.height, p = 0;
			d = u;
			for (let e = 0; e < u; e++) {
				let t = p + l[e];
				if (d === u && t > o && (d = e), p >= c) {
					f = e;
					break;
				}
				p = t;
			}
			d === u && (d = Math.max(0, u - 1)), d = Math.max(0, d - cU), f = Math.min(u, f + cU);
		}
		let p = c === null ? d : c.starts[d] ?? o, m = c === null ? f : f < u ? c.starts[f] : o, h = this.options.renderer.getAncestorStack(e), g = [], ee = [], te = -1, ne = !1;
		for (let r = 0; r < o; r++) {
			let i = n[r];
			i.header || te++;
			let a = r >= p && r < m, o = (i.header ? t.headers.get(hU(i.entry)) ?? null : i.entry)?.element ?? null;
			if (!a) {
				o !== null && (this.dropRow(e, o), pU(t, i, null), ne = !0);
				continue;
			}
			if (o !== null) {
				i.header && hR(o, i.entry.key), g.push(o), i.header || ee.push([o, te]);
				continue;
			}
			let s = i.header ? this.renderHeader(t, i.entry, h) : this.renderRow(t, i.entry, h);
			s !== null && (i.header || ju(e, s), pU(t, i, s), g.push(s), i.header || ee.push([s, te]), ne = !0);
		}
		let re = new Set(g);
		for (let n of t.entries) n.element !== null && !re.has(n.element) && (this.dropRow(e, n.element), n.element = null, ne = !0);
		for (let t of B(e)) re.has(t) || (this.dropRow(e, t), ne = !0);
		for (let t of e.querySelectorAll(`:scope > [${ht}]`)) re.has(t) || (t.remove(), ne = !0);
		for (let e of t.headers.values()) e.element !== null && !re.has(e.element) && (e.element = null);
		let ie = CU(l, 0, d), ae = CU(l, f, u);
		yR(e, [...g, ...qS(JS(e))]), vR(e, "top", ie > 0 ? ie - i : 0), vR(e, gR, ae > 0 ? ae - i : 0), YS(e, t.componentId, this.options.templates, this.options.renderer, o > 0), IH(e, ee, te + 1), (ne || t.first !== p || t.last !== m) && (t.first = p, t.last = m, this.options.dom.invalidate()), t.laidOut = n, t.pitches = l, t.laidAcross = s, t.firstLine = d, t.lastLine = f, this.measure(t, n, p, m), c !== null && (t.across = bU(e, r, t.tileWidth) ?? t.across, t.across !== s && this.layout(e, t));
	}
	renderRow(e, t, n) {
		return oU(e.componentId, t.item, t.key, n, this.options);
	}
	renderHeader(e, t, n) {
		let r = this.options.templates.getGroupTemplate(e.componentId);
		return r === void 0 ? null : mR(r, this.options.renderer, t.item, t.key, n);
	}
	measure(e, t, n, r) {
		let i = 0;
		for (let a = n; a < r && a < t.length; a++) {
			let n = t[a], r = n.header ? e.headers.get(hU(n.entry)) : n.entry, o = r?.element;
			if (r == null || o == null) continue;
			let s = Gc(o);
			s.height <= 0 || (dU(n.header ? e.headerHeights : e.itemHeights, r.height, s.height), r.height = s.height, n.header || (i = Math.max(i, s.width)));
		}
		i > 0 && (e.tileWidth = i), e.itemHeights.count > 0 && (e.itemEstimate = e.itemHeights.sum / e.itemHeights.count), e.headerHeights.count > 0 && (e.headerEstimate = e.headerHeights.sum / e.headerHeights.count);
	}
	pitchOf(e, t) {
		return t.header ? e.headers.get(hU(t.entry))?.height ?? e.headerEstimate : t.entry.height ?? e.itemEstimate;
	}
	getState(e) {
		let t = this.states.get(e);
		if (t !== void 0) return t;
		let n = Qi(e);
		if (n === null) return s("a virtualized items host is not inside an addressable component.", e), null;
		let r = n.componentId, i = [], a = /* @__PURE__ */ new Map();
		for (let t of B(e)) {
			let e = t.getAttribute(_);
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
function dU(e, t, n) {
	t === null ? (e.sum += n, e.count++) : e.sum += n - t;
}
function fU(e, t, n, r, i, a, o) {
	if (t.laidOut !== n || t.laidAcross !== i || t.pitches.length !== r.length || a <= 0) return a;
	let s = 0, c = 0;
	for (let e = 0; e < r.length; e++) {
		let n = e >= t.firstLine && e < t.lastLine ? r[e] : t.pitches[e];
		if (s + n > a) break;
		s += n, c += r[e];
	}
	let l = c - s;
	return Math.abs(l) < .5 ? a : (Uc(e, a + l + o), a + l);
}
function pU(e, t, n) {
	if (!t.header) {
		t.entry.element = n;
		return;
	}
	let r = hU(t.entry), i = e.headers.get(r);
	i === void 0 ? e.headers.set(r, {
		element: n,
		height: null
	}) : i.element = n;
}
function mU(e) {
	let t = oC(e.item, "CanSelect");
	return t.ok && t.value === !1;
}
function hU(e) {
	let t = oC(e.item, "Group");
	return t.ok && typeof t.value == "string" ? t.value : "";
}
function gU(e) {
	let t = e.parentElement;
	return t !== null && (t.classList.contains("ui-table__scroll") || t.classList.contains("ui-items-view--stack") && t.classList.contains("ui-orientation--vertical"));
}
function _U(e, t) {
	let n = 0;
	for (; n + 1 < e.length && e[n + 1] <= t;) n++;
	return n;
}
function vU(e) {
	return e.parentElement?.classList.contains("ui-items-view--wrap") === !0;
}
function yU(e, t, n) {
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
function bU(e, t, n) {
	let r = e.clientWidth - SU(t.paddingLeft) - SU(t.paddingRight);
	if (n === null || n <= 0 || r <= 0) return null;
	let i = SU(t.columnGap);
	return Math.max(1, Math.floor((r + i + .5) / (n + i)));
}
function xU(e) {
	return SU(e.rowGap);
}
function SU(e) {
	let t = Number.parseFloat(e);
	return Number.isFinite(t) ? t : 0;
}
function CU(e, t, n) {
	let r = 0;
	for (let i = t; i < n; i++) r += e[i];
	return r;
}
//#endregion
//#region src/items/items-template-registry.ts
var wU = "data-ui-template", TU = "default", EU = class {
	dom;
	templateComponentIds = null;
	constructor(e) {
		this.dom = e;
	}
	getTemplate(e, t) {
		let n = t ?? TU, r = this.findTemplate(e, n);
		return r === void 0 ? n === TU ? void 0 : this.getTemplate(e, null) : r;
	}
	getVariantTemplate(e, t) {
		return this.findTemplate(e, t);
	}
	findTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		if (n === null) return;
		let r = n.querySelectorAll(`:scope > template[${wU}]`);
		for (let e of r) if (e.getAttribute(wU) === t) return e;
	}
	isTemplateComponent(e) {
		return this.templateComponentIds ??= DU(this.dom.root), this.templateComponentIds.has(e);
	}
	getEmptyTemplate(e) {
		return this.getMarkedTemplate(e, ft);
	}
	getGroupTemplate(e) {
		return this.getMarkedTemplate(e, pt);
	}
	getMarkedTemplate(e, t) {
		return this.dom.findComponent(e, [])?.querySelector(`:scope > template[${t}]`) ?? void 0;
	}
};
function DU(e) {
	let t = /* @__PURE__ */ new Set();
	return Fo(e, (n) => {
		if (n !== e) for (let e of n.querySelectorAll(b)) {
			let n = w(e);
			n > 0 && t.add(n);
		}
	}), t;
}
//#endregion
//#region src/rendering/theme-colors.ts
function OU(e, t) {
	let n = e.querySelector(`style[${gr}]`);
	if (t.length === 0) {
		n?.remove();
		return;
	}
	if (n !== null) {
		n.textContent !== t && (n.textContent = t);
		return;
	}
	let r = document.createElement("style");
	r.setAttribute(gr, ""), r.textContent = t, e.insertBefore(r, e.querySelector("style")?.nextElementSibling ?? null);
}
//#endregion
//#region src/metadata/metadata-reader.ts
var kU = "script[type='application/json'][data-ui-metadata]";
function AU(e = document) {
	let t = e.querySelector(kU);
	if (t === null) return jU();
	let n = t.textContent?.trim() ?? "";
	if (n.length === 0) return jU();
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
function jU() {
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
var MU = "script[type='application/json'][data-ui-hydration]";
function NU(e) {
	return e !== null && (so(e.title) || so(e.changes));
}
function PU(e = document) {
	let t = e.querySelector(MU)?.textContent?.trim() ?? "";
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
var FU = "reconnecting";
async function IU(e, t, n, r) {
	for (let i = 0;; i++) try {
		return await e();
	} catch (e) {
		if (t()) return s("attaching the runtime failed as the connection dropped again; the reconnect attaches.", e), FU;
		if (i >= n.length) return c("attaching the runtime failed after retrying; giving up.", e), null;
		s("attaching the runtime failed; retrying.", {
			attempt: i + 1,
			error: e
		}), await r(n[i]);
	}
}
//#endregion
//#region src/transport/reader-time-zone.ts
function LU(e = () => Intl.DateTimeFormat().resolvedOptions().timeZone) {
	try {
		let t = e();
		return typeof t == "string" && t.length > 0 ? t : null;
	} catch {
		return null;
	}
}
function RU(e, t, n) {
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
var zU = "/_ne/", BU = 3e3;
function VU(e, t, n) {
	let r = e.getAttribute(mr);
	if (r === null || !("serviceWorker" in navigator)) return;
	let i = navigator.serviceWorker;
	if (RU(i, t, n), e.hasAttribute("data-ui-service-worker-imported")) return () => UU(i.ready);
	let a = i.register(r, { scope: zU }).then(HU).catch((e) => {
		s("registering the notification service worker failed; notifications are the page's own.", e);
	});
	return () => a;
}
function HU(e) {
	let t = e.installing ?? e.waiting;
	return e.active !== null || t === null ? Promise.resolve(e) : new Promise((n) => {
		t.addEventListener("statechange", () => {
			t.state === "activated" && n(e);
		});
	});
}
function UU(e) {
	return Promise.race([e, new Promise((e) => setTimeout(() => e(void 0), BU))]);
}
//#endregion
//#region src/runtime/reload-guard.ts
var WU = "ne-standard-ui:reloaded-view";
function GU(e, t, n) {
	if (!t) return "no-cookie";
	if (JU(n) === e) return "asked-again";
	try {
		n?.setItem(WU, e);
	} catch {}
	return "reload";
}
function KU(e) {
	try {
		e?.removeItem(WU);
	} catch {}
}
function qU() {
	try {
		return window.sessionStorage;
	} catch {
		return null;
	}
}
function JU(e) {
	try {
		return e?.getItem(WU) ?? null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/runtime/connection-watch.ts
var YU = 2e3, XU = class {
	root;
	notifications;
	graceMilliseconds;
	grace = null;
	notice = null;
	given = !1;
	constructor(e) {
		this.root = e.root, this.notifications = e.notifications, this.graceMilliseconds = e.graceMilliseconds ?? YU, e.connection.onReconnecting(() => this.reconnecting()), e.connection.onReconnected(() => this.reconnected());
	}
	reconnecting() {
		this.given || this.grace !== null || this.notice !== null || (this.grace = window.setTimeout(() => this.showReconnecting(), this.graceMilliseconds));
	}
	showReconnecting() {
		this.grace = null, this.root.setAttribute(Sr, "reconnecting"), this.notice = this.notifications.show({
			message: T.text("ui.connection.reconnecting"),
			sticky: !0,
			connection: !0
		});
	}
	reconnected() {
		this.given || (this.clear(), this.root.removeAttribute(Sr));
	}
	clear() {
		this.grace !== null && (window.clearTimeout(this.grace), this.grace = null), this.notice !== null && (this.notifications.dismiss(this.notice), this.notice = null);
	}
	lost() {
		this.given = !0, this.clear(), this.root.setAttribute(Sr, "lost");
	}
}, ZU = "/_ne/values", QU = 32768;
QU / 4;
var $U = 3e4;
function eW(e) {
	let t = JSON.stringify(e);
	if (t === void 0 || t.length * 3 <= 8192) return null;
	let n = new TextEncoder().encode(t);
	return n.byteLength > 8192 ? n : null;
}
function tW(e) {
	return e?.updates?.some((e) => typeof e.valueToken == "string") === !0;
}
async function nW(e, t = null, n = $U) {
	if (e === void 0 || !tW(e)) return e;
	let r = await Promise.all((e.updates ?? []).map(async (e) => {
		let r = e.valueToken;
		if (typeof r != "string") return e;
		let i = t === null ? "" : `?instance=${encodeURIComponent(t)}`, a = await fetch(`${ZU}/${encodeURIComponent(r)}${i}`, {
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
async function rW(e) {
	let t = await fetch(ZU, {
		method: "POST",
		body: e,
		headers: { "Content-Type": "application/json" },
		credentials: "same-origin",
		signal: AbortSignal.timeout($U)
	});
	if (!t.ok) throw Error(`Staging a large value failed with status ${t.status}.`);
	let n = (await t.json())?.token;
	if (n === void 0 || n.length === 0) throw Error("Staging a large value answered with no token.");
	return n;
}
//#endregion
//#region src/transport/command-dispatcher.ts
var iW = class {
	transport;
	pendingKeys = /* @__PURE__ */ new Set();
	nextRequestId = 1;
	awaited = /* @__PURE__ */ new Map();
	staging = null;
	constructor(e) {
		this.transport = e;
	}
	isPending(e) {
		return this.pendingKeys.has(aW(oW(e)));
	}
	async dispatchAsync(e) {
		let t = oW(e), n = aW(t);
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
		let t = eW(e.dynamicParameters);
		if (t === null && this.staging === null) return this.transport.processEventAsync(e);
		let n = this.staging, r = t === null ? null : rW(t), i = () => {}, a = new Promise((e) => {
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
function aW(e) {
	return e.action === void 0 ? `${JSON.stringify(e.eventId)}:${JSON.stringify(e.dynamicParameters ?? [])}` : `action:${e.action}`;
}
function oW(e) {
	return e.action === void 0 ? {
		eventId: C(e.eventId),
		dynamicParameters: e.dynamicParameters ?? []
	} : {
		eventId: 0,
		action: e.action,
		dynamicParameters: []
	};
}
//#endregion
//#region src/transport/inbound-order.ts
var sW = class {
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
async function cW(e, t) {
	try {
		await e();
	} finally {
		t();
	}
}
//#endregion
//#region src/state/property-state-store.ts
var lW = class {
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
		return r.length > 0 ? (this.recordRows(i, r), this.removeUnplaced(i)) : t.length > 0 && !this.unplacedPathByEntry.has(i) && this.recordUnplaced(i, t), a !== void 0 && Hd(a.value, n) ? !1 : (this.values.set(i, {
			reference: e,
			dynamicParameters: t,
			value: n
		}), !0);
	}
	entries() {
		return this.values.values();
	}
	forgetRows(e, t, n) {
		let r = uW(e, t);
		for (let e of n) this.forgetRow(r, e), this.forgetUnplaced(dW([...t, e]));
	}
	forgetHost(e, t) {
		this.forgetScope(uW(e, t));
		let n = this.unplaced.get(dW(t));
		for (let e of [...n?.children ?? []]) this.forgetUnplaced(e);
	}
	clear() {
		this.values.clear(), this.scopes.clear(), this.unplaced.clear(), this.unplacedPathByEntry.clear();
	}
	recordRows(e, t) {
		let n = null;
		for (let [r, i] of t.entries()) {
			let t = uW(i.host, i.hostParameters), a = this.rowState(t, i.key);
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
		let n = this.unplacedNode(dW([]), null), r = "";
		for (let e = 1; e <= t.length; e++) r = dW(t.slice(0, e)), n.children.add(r), n = this.unplacedNode(r, dW(t.slice(0, e - 1)));
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
		return `${C(e.componentId)}:${e.propertyId}:${fW(t)}`;
	}
};
function uW(e, t) {
	return JSON.stringify([e, ...t.map((e) => String(e ?? ""))]);
}
function dW(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function fW(e) {
	if (e.length === 0) return "";
	try {
		return JSON.stringify(e);
	} catch {
		return String(e);
	}
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Errors.js
var pW = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(`${e}: Status code '${t}'`), this.statusCode = t, this.__proto__ = n;
	}
}, mW = class extends Error {
	constructor(e = "A timeout occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, hW = class extends Error {
	constructor(e = "An abort occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, gW = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "UnsupportedTransportError", this.__proto__ = n;
	}
}, _W = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "DisabledTransportError", this.__proto__ = n;
	}
}, vW = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "FailedToStartTransportError", this.__proto__ = n;
	}
}, yW = class extends Error {
	constructor(e) {
		let t = new.target.prototype;
		super(e), this.errorType = "FailedToNegotiateWithServerError", this.__proto__ = t;
	}
}, bW = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.innerErrors = t, this.__proto__ = n;
	}
}, xW = class {
	constructor(e, t, n) {
		this.statusCode = e, this.statusText = t, this.content = n;
	}
}, SW = class {
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
var CW = class {
	constructor() {}
	log(e, t) {}
};
CW.instance = new CW();
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/pkg-version.js
var wW = "10.0.11", q = class {
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
function TW(e, t) {
	let n = "";
	return DW(e) ? (n = `Binary data of length ${e.byteLength}`, t && (n += `. Content: '${EW(e)}'`)) : typeof e == "string" && (n = `String data of length ${e.length}`, t && (n += `. Content: '${e}'`)), n;
}
function EW(e) {
	let t = new Uint8Array(e), n = "";
	return t.forEach((e) => {
		n += `0x${e < 16 ? "0" : ""}${e.toString(16)} `;
	}), n.substring(0, n.length - 1);
}
function DW(e) {
	return e && typeof ArrayBuffer < "u" && (e instanceof ArrayBuffer || e.constructor && e.constructor.name === "ArrayBuffer");
}
async function OW(e, t, n, r, i, a) {
	let o = {}, [s, c] = MW();
	o[s] = c, e.log(K.Trace, `(${t} transport) sending data. ${TW(i, a.logMessageContent)}.`);
	let l = DW(i) ? "arraybuffer" : "text", u = await n.post(r, {
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
function kW(e) {
	return e === void 0 ? new jW(K.Information) : e === null ? CW.instance : e.log === void 0 ? new jW(e) : e;
}
var AW = class {
	constructor(e, t) {
		this._subject = e, this._observer = t;
	}
	dispose() {
		let e = this._subject.observers.indexOf(this._observer);
		e > -1 && this._subject.observers.splice(e, 1), this._subject.observers.length === 0 && this._subject.cancelCallback && this._subject.cancelCallback().catch((e) => {});
	}
}, jW = class {
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
function MW() {
	let e = "X-SignalR-User-Agent";
	return J.isNode && (e = "User-Agent"), [e, NW(wW, PW(), IW(), FW())];
}
function NW(e, t, n, r) {
	let i = "Microsoft SignalR/", a = e.split(".");
	return i += `${a[0]}.${a[1]}`, i += ` (${e}; `, i += t && t !== "" ? `${t}; ` : "Unknown OS; ", i += `${n}`, i += r ? `; ${r}` : "; Unknown Runtime Version", i += ")", i;
}
/*#__PURE__*/ function PW() {
	if (J.isNode) switch (process.platform) {
		case "win32": return "Windows NT";
		case "darwin": return "macOS";
		case "linux": return "Linux";
		default: return process.platform;
	}
	else return "";
}
/*#__PURE__*/ function FW() {
	if (J.isNode) return process.versions.node;
}
function IW() {
	return J.isNode ? "NodeJS" : "Browser";
}
function LW(e) {
	return e.stack ? e.stack : e.message ? e.message : `${e}`;
}
function RW() {
	if (typeof globalThis < "u") return globalThis;
	if (typeof self < "u") return self;
	if (typeof window < "u") return window;
	if (typeof global < "u") return global;
	throw Error("could not find global");
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js
var zW = class extends SW {
	constructor(t) {
		if (super(), this._logger = t, typeof fetch > "u" || J.isNode) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._jar = new (t("tough-cookie")).CookieJar(), this._fetchType = typeof fetch > "u" ? t("node-fetch") : fetch, this._fetchType = t("fetch-cookie")(this._fetchType, this._jar);
		} else this._fetchType = fetch.bind(RW());
		if (typeof AbortController > "u") {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._abortControllerType = t("abort-controller");
		} else this._abortControllerType = AbortController;
	}
	async send(e) {
		if (e.abortSignal && e.abortSignal.aborted) throw new hW();
		if (!e.method) throw Error("No method defined.");
		if (!e.url) throw Error("No url defined.");
		let t = new this._abortControllerType(), n;
		e.abortSignal && (e.abortSignal.onabort = () => {
			t.abort(), n = new hW();
		});
		let r = null;
		if (e.timeout) {
			let i = e.timeout;
			r = setTimeout(() => {
				t.abort(), this._logger.log(K.Warning, "Timeout from HTTP request."), n = new mW();
			}, i);
		}
		e.content === "" && (e.content = void 0), e.content && (e.headers = e.headers || {}, DW(e.content) ? e.headers["Content-Type"] = "application/octet-stream" : e.headers["Content-Type"] = "text/plain;charset=UTF-8");
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
		if (!i.ok) throw new pW(await BW(i, "text") || i.statusText, i.status);
		let a = await BW(i, e.responseType);
		return new xW(i.status, i.statusText, a);
	}
	getCookieString(e) {
		let t = "";
		return J.isNode && this._jar && this._jar.getCookies(e, (e, n) => t = n.join("; ")), t;
	}
};
function BW(e, t) {
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
var VW = class extends SW {
	constructor(e) {
		super(), this._logger = e;
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new hW()) : e.method ? e.url ? new Promise((t, n) => {
			let r = new XMLHttpRequest();
			r.open(e.method, e.url, !0), r.withCredentials = e.withCredentials === void 0 || e.withCredentials, r.setRequestHeader("X-Requested-With", "XMLHttpRequest"), e.content === "" && (e.content = void 0), e.content && (DW(e.content) ? r.setRequestHeader("Content-Type", "application/octet-stream") : r.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"));
			let i = e.headers;
			i && Object.keys(i).forEach((e) => {
				r.setRequestHeader(e, i[e]);
			}), e.responseType && (r.responseType = e.responseType), e.abortSignal && (e.abortSignal.onabort = () => {
				r.abort(), n(new hW());
			}), e.timeout && (r.timeout = e.timeout), r.onload = () => {
				e.abortSignal && (e.abortSignal.onabort = null), r.status >= 200 && r.status < 300 ? t(new xW(r.status, r.statusText, r.response || r.responseText)) : n(new pW(r.response || r.responseText || r.statusText, r.status));
			}, r.onerror = () => {
				this._logger.log(K.Warning, `Error from HTTP request. ${r.status}: ${r.statusText}.`), n(new pW(r.statusText, r.status));
			}, r.ontimeout = () => {
				this._logger.log(K.Warning, "Timeout from HTTP request."), n(new mW());
			}, r.send(e.content);
		}) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
}, HW = class extends SW {
	constructor(e) {
		if (super(), typeof fetch < "u" || J.isNode) this._httpClient = new zW(e);
		else if (typeof XMLHttpRequest < "u") this._httpClient = new VW(e);
		else throw Error("No usable HttpClient found.");
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new hW()) : e.method ? e.url ? this._httpClient.send(e) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
	getCookieString(e) {
		return this._httpClient.getCookieString(e);
	}
}, UW = class e {
	static write(t) {
		return `${t}${e.RecordSeparator}`;
	}
	static parse(t) {
		if (t[t.length - 1] !== e.RecordSeparator) throw Error("Message is incomplete.");
		let n = t.split(e.RecordSeparator);
		return n.pop(), n;
	}
};
UW.RecordSeparatorCode = 30, UW.RecordSeparator = String.fromCharCode(UW.RecordSeparatorCode);
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js
var WW = class {
	writeHandshakeRequest(e) {
		return UW.write(JSON.stringify(e));
	}
	parseHandshakeResponse(e) {
		let t, n;
		if (DW(e)) {
			let r = new Uint8Array(e), i = r.indexOf(UW.RecordSeparatorCode);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = String.fromCharCode.apply(null, Array.prototype.slice.call(r.slice(0, a))), n = r.byteLength > a ? r.slice(a).buffer : null;
		} else {
			let r = e, i = r.indexOf(UW.RecordSeparator);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = r.substring(0, a), n = r.length > a ? r.substring(a) : null;
		}
		let r = UW.parse(t), i = JSON.parse(r[0]);
		if (i.type) throw Error("Expected a handshake response from the server.");
		return [n, i];
	}
}, Y;
(function(e) {
	e[e.Invocation = 1] = "Invocation", e[e.StreamItem = 2] = "StreamItem", e[e.Completion = 3] = "Completion", e[e.StreamInvocation = 4] = "StreamInvocation", e[e.CancelInvocation = 5] = "CancelInvocation", e[e.Ping = 6] = "Ping", e[e.Close = 7] = "Close", e[e.Ack = 8] = "Ack", e[e.Sequence = 9] = "Sequence";
})(Y ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Subject.js
var GW = class {
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
		return this.observers.push(e), new AW(this, e);
	}
}, KW = class {
	constructor(e, t, n) {
		this._bufferSize = 1e5, this._messages = [], this._totalMessageCount = 0, this._waitForSequenceMessage = !1, this._nextReceivingSequenceId = 1, this._latestReceivedSequenceId = 0, this._bufferedByteCount = 0, this._reconnectInProgress = !1, this._protocol = e, this._connection = t, this._bufferSize = n;
	}
	async _send(e) {
		let t = this._protocol.writeMessage(e), n = Promise.resolve();
		if (this._isInvocationMessage(e)) {
			this._totalMessageCount++;
			let e = () => {}, r = () => {};
			DW(t) ? this._bufferedByteCount += t.byteLength : this._bufferedByteCount += t.length, this._bufferedByteCount >= this._bufferSize && (n = new Promise((t, n) => {
				e = t, r = n;
			})), this._messages.push(new qW(t, this._totalMessageCount, e, r));
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
			if (r._id <= e.sequenceId) t = n, DW(r._message) ? this._bufferedByteCount -= r._message.byteLength : this._bufferedByteCount -= r._message.length, r._resolver();
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
}, qW = class {
	constructor(e, t, n, r) {
		this._message = e, this._id = t, this._resolver = n, this._rejector = r;
	}
}, JW = 3e4, YW = 15e3, XW = 1e5, X;
(function(e) {
	e.Disconnected = "Disconnected", e.Connecting = "Connecting", e.Connected = "Connected", e.Disconnecting = "Disconnecting", e.Reconnecting = "Reconnecting";
})(X ||= {});
var ZW = class e {
	static create(t, n, r, i, a, o, s) {
		return new e(t, n, r, i, a, o, s);
	}
	constructor(e, t, n, r, i, a, o) {
		this._nextKeepAlive = 0, this._freezeEventListener = () => {
			this._logger.log(K.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
		}, q.isRequired(e, "connection"), q.isRequired(t, "logger"), q.isRequired(n, "protocol"), this.serverTimeoutInMilliseconds = i ?? JW, this.keepAliveIntervalInMilliseconds = a ?? YW, this._statefulReconnectBufferSize = o ?? XW, this._logger = t, this._protocol = n, this.connection = e, this._reconnectPolicy = r, this._handshakeProtocol = new WW(), this.connection.onreceive = (e) => this._processIncomingData(e), this.connection.onclose = (e) => this._connectionClosed(e), this._callbacks = {}, this._methods = {}, this._closedCallbacks = [], this._reconnectingCallbacks = [], this._reconnectedCallbacks = [], this._invocationId = 0, this._receivedHandshakeResponse = !1, this._connectionState = X.Disconnected, this._connectionStarted = !1, this._cachedPingMessage = this._protocol.writeMessage({ type: Y.Ping });
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
			this.connection.features.reconnect && (this._messageBuffer = new KW(this._protocol, this.connection, this._statefulReconnectBufferSize), this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer), this.connection.features.resend = () => {
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
		return this._connectionState = X.Disconnecting, this._logger.log(K.Debug, "Stopping HubConnection."), this._reconnectDelayHandle ? (this._logger.log(K.Debug, "Connection stopped during reconnect delay. Done reconnecting."), clearTimeout(this._reconnectDelayHandle), this._reconnectDelayHandle = void 0, this._completeClose(), Promise.resolve()) : (t === X.Connected && this._sendCloseMessage(), this._cleanupTimeout(), this._cleanupPingTimer(), this._stopDuringStartError = e || new hW("The connection was stopped before the hub handshake could complete."), this.connection.stop(e));
	}
	async _sendCloseMessage() {
		try {
			await this._sendWithProtocol(this._createCloseMessage());
		} catch {}
	}
	stream(e, ...t) {
		let [n, r] = this._replaceStreamingParams(t), i = this._createStreamInvocation(e, t, r), a, o = new GW();
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
						this._logger.log(K.Error, `Invoke client method threw error: ${LW(e)}`);
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
							this._logger.log(K.Error, `Stream callback threw error: ${LW(e)}`);
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
		this._logger.log(K.Debug, `HubConnection.connectionClosed(${e}) called while in state ${this._connectionState}.`), this._stopDuringStartError = this._stopDuringStartError || e || new hW("The underlying connection was closed before the hub handshake could complete."), this._handshakeResolver && this._handshakeResolver(), this._cancelCallbacksWithError(e || /* @__PURE__ */ Error("Invocation canceled due to the underlying connection being closed.")), this._cleanupTimeout(), this._cleanupPingTimer(), this._connectionState === X.Disconnecting ? this._completeClose(e) : this._connectionState === X.Connected && this._reconnectPolicy ? this._reconnect(e) : this._connectionState === X.Connected && this._completeClose(e);
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
				this._logger.log(K.Error, `Stream 'error' callback called with '${e}' threw error: ${LW(t)}`);
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
}, QW = [
	0,
	2e3,
	1e4,
	3e4,
	null
], $W = class {
	constructor(e) {
		this._retryDelays = e === void 0 ? QW : [...e, null];
	}
	nextRetryDelayInMilliseconds(e) {
		return this._retryDelays[e.previousRetryCount];
	}
}, eG = class {};
eG.Authorization = "Authorization", eG.Cookie = "Cookie";
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js
var tG = class extends SW {
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
		e.headers ||= {}, this._accessToken ? e.headers[eG.Authorization] = `Bearer ${this._accessToken}` : this._accessTokenFactory && e.headers[eG.Authorization] && delete e.headers[eG.Authorization];
	}
	getCookieString(e) {
		return this._innerClient.getCookieString(e);
	}
}, Z;
(function(e) {
	e[e.None = 0] = "None", e[e.WebSockets = 1] = "WebSockets", e[e.ServerSentEvents = 2] = "ServerSentEvents", e[e.LongPolling = 4] = "LongPolling";
})(Z ||= {});
var nG;
(function(e) {
	e[e.Text = 1] = "Text", e[e.Binary = 2] = "Binary";
})(nG ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AbortController.js
var rG = class {
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
}, iG = class {
	get pollAborted() {
		return this._pollAbort.aborted;
	}
	constructor(e, t, n) {
		this._httpClient = e, this._logger = t, this._pollAbort = new rG(), this._options = n, this._running = !1, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		if (q.isRequired(e, "url"), q.isRequired(t, "transferFormat"), q.isIn(t, nG, "transferFormat"), this._url = e, this._logger.log(K.Trace, "(LongPolling transport) Connecting."), t === nG.Binary && typeof XMLHttpRequest < "u" && typeof new XMLHttpRequest().responseType != "string") throw Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
		let [n, r] = MW(), i = {
			[n]: r,
			...this._options.headers
		}, a = {
			abortSignal: this._pollAbort.signal,
			headers: i,
			timeout: 1e5,
			withCredentials: this._options.withCredentials
		};
		t === nG.Binary && (a.responseType = "arraybuffer");
		let o = `${e}&_=${Date.now()}`;
		this._logger.log(K.Trace, `(LongPolling transport) polling: ${o}.`);
		let s = await this._httpClient.get(o, a);
		s.statusCode === 200 ? this._running = !0 : (this._logger.log(K.Error, `(LongPolling transport) Unexpected response code: ${s.statusCode}.`), this._closeError = new pW(s.statusText || "", s.statusCode), this._running = !1), this._receiving = this._poll(this._url, a);
	}
	async _poll(e, t) {
		try {
			for (; this._running;) try {
				let n = `${e}&_=${Date.now()}`;
				this._logger.log(K.Trace, `(LongPolling transport) polling: ${n}.`);
				let r = await this._httpClient.get(n, t);
				r.statusCode === 204 ? (this._logger.log(K.Information, "(LongPolling transport) Poll terminated by server."), this._running = !1) : r.statusCode === 200 ? r.content ? (this._logger.log(K.Trace, `(LongPolling transport) data received. ${TW(r.content, this._options.logMessageContent)}.`), this.onreceive && this.onreceive(r.content)) : this._logger.log(K.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._logger.log(K.Error, `(LongPolling transport) Unexpected response code: ${r.statusCode}.`), this._closeError = new pW(r.statusText || "", r.statusCode), this._running = !1);
			} catch (e) {
				this._running ? e instanceof mW ? this._logger.log(K.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._closeError = e, this._running = !1) : this._logger.log(K.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
			}
		} finally {
			this._logger.log(K.Trace, "(LongPolling transport) Polling complete."), this.pollAborted || this._raiseOnClose();
		}
	}
	async send(e) {
		return this._running ? OW(this._logger, "LongPolling", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	async stop() {
		this._logger.log(K.Trace, "(LongPolling transport) Stopping polling."), this._running = !1, this._pollAbort.abort();
		try {
			await this._receiving, this._logger.log(K.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
			let e = {}, [t, n] = MW();
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
			i ? i instanceof pW && (i.statusCode === 404 ? this._logger.log(K.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.") : this._logger.log(K.Trace, `(LongPolling transport) Error sending a DELETE request: ${i}`)) : this._logger.log(K.Trace, "(LongPolling transport) DELETE request accepted.");
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
}, aG = class {
	constructor(e, t, n, r) {
		this._httpClient = e, this._accessToken = t, this._logger = n, this._options = r, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		return q.isRequired(e, "url"), q.isRequired(t, "transferFormat"), q.isIn(t, nG, "transferFormat"), this._logger.log(K.Trace, "(SSE transport) Connecting."), this._url = e, this._accessToken && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(this._accessToken)}`), new Promise((n, r) => {
			let i = !1;
			if (t !== nG.Text) {
				r(/* @__PURE__ */ Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
				return;
			}
			let a;
			if (J.isBrowser || J.isWebWorker) a = new this._options.EventSource(e, { withCredentials: this._options.withCredentials });
			else {
				let t = this._httpClient.getCookieString(e), n = {};
				n.Cookie = t;
				let [r, i] = MW();
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
						this._logger.log(K.Trace, `(SSE transport) data received. ${TW(e.data, this._options.logMessageContent)}.`), this.onreceive(e.data);
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
		return this._eventSource ? OW(this._logger, "SSE", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	stop() {
		return this._close(), Promise.resolve();
	}
	_close(e) {
		this._eventSource && (this._eventSource.close(), this._eventSource = void 0, this.onclose && this.onclose(e));
	}
}, oG = class {
	constructor(e, t, n, r, i, a) {
		this._logger = n, this._accessTokenFactory = t, this._logMessageContent = r, this._webSocketConstructor = i, this._httpClient = e, this.onreceive = null, this.onclose = null, this._headers = a;
	}
	async connect(e, t) {
		q.isRequired(e, "url"), q.isRequired(t, "transferFormat"), q.isIn(t, nG, "transferFormat"), this._logger.log(K.Trace, "(WebSockets transport) Connecting.");
		let n;
		return this._accessTokenFactory && (n = await this._accessTokenFactory()), new Promise((r, i) => {
			e = e.replace(/^http/, "ws");
			let a, o = this._httpClient.getCookieString(e), s = !1;
			if (J.isNode || J.isReactNative) {
				let t = {}, [r, i] = MW();
				t[r] = i, n && (t[eG.Authorization] = `Bearer ${n}`), o && (t[eG.Cookie] = o), a = new this._webSocketConstructor(e, void 0, { headers: {
					...t,
					...this._headers
				} });
			} else n && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(n)}`);
			a ||= new this._webSocketConstructor(e), t === nG.Binary && (a.binaryType = "arraybuffer"), a.onopen = (t) => {
				this._logger.log(K.Information, `WebSocket connected to ${e}.`), this._webSocket = a, s = !0, r();
			}, a.onerror = (e) => {
				let t = null;
				t = typeof ErrorEvent < "u" && e instanceof ErrorEvent ? e.error : "There was an error with the transport", this._logger.log(K.Information, `(WebSockets transport) ${t}.`);
			}, a.onmessage = (e) => {
				if (this._logger.log(K.Trace, `(WebSockets transport) data received. ${TW(e.data, this._logMessageContent)}.`), this.onreceive) try {
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
		return this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN ? (this._logger.log(K.Trace, `(WebSockets transport) sending data. ${TW(e, this._logMessageContent)}.`), this._webSocket.send(e), Promise.resolve()) : Promise.reject("WebSocket is not in the OPEN state");
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
}, sG = 100, cG = class {
	constructor(t, n = {}) {
		if (this._stopPromiseResolver = () => {}, this.features = {}, this._negotiateVersion = 1, q.isRequired(t, "url"), this._logger = kW(n.logger), this.baseUrl = this._resolveUrl(t), n ||= {}, n.logMessageContent = n.logMessageContent !== void 0 && n.logMessageContent, typeof n.withCredentials == "boolean" || n.withCredentials === void 0) n.withCredentials = n.withCredentials === void 0 || n.withCredentials;
		else throw Error("withCredentials option was not a 'boolean' or 'undefined' value");
		n.timeout = n.timeout === void 0 ? 1e5 : n.timeout;
		let r = null, i = null;
		if (J.isNode && e !== void 0) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			r = t("ws"), i = t("eventsource");
		}
		!J.isNode && typeof WebSocket < "u" && !n.WebSocket ? n.WebSocket = WebSocket : J.isNode && !n.WebSocket && r && (n.WebSocket = r), !J.isNode && typeof EventSource < "u" && !n.EventSource ? n.EventSource = EventSource : J.isNode && !n.EventSource && i !== void 0 && (n.EventSource = i), this._httpClient = new tG(n.httpClient || new HW(this._logger), n.accessTokenFactory), this._connectionState = "Disconnected", this._connectionStarted = !1, this._options = n, this.onreceive = null, this.onclose = null;
	}
	async start(e) {
		if (e ||= nG.Binary, q.isIn(e, nG, "transferFormat"), this._logger.log(K.Debug, `Starting connection with transfer format '${nG[e]}'.`), this._connectionState !== "Disconnected") return Promise.reject(/* @__PURE__ */ Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
		if (this._connectionState = "Connecting", this._startInternalPromise = this._startInternal(e), await this._startInternalPromise, this._connectionState === "Disconnecting") {
			let e = "Failed to start the HttpConnection before stop() was called.";
			return this._logger.log(K.Error, e), await this._stopPromise, Promise.reject(new hW(e));
		}
		if (this._connectionState !== "Connected") {
			let e = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
			return this._logger.log(K.Error, e), Promise.reject(new hW(e));
		}
		this._connectionStarted = !0;
	}
	send(e) {
		return this._connectionState === "Connected" ? (this._sendQueue ||= new uG(this.transport), this._sendQueue.send(e)) : Promise.reject(/* @__PURE__ */ Error("Cannot send data if the connection is not in the 'Connected' State."));
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
					if (n = await this._getNegotiationResponse(t), this._connectionState === "Disconnecting" || this._connectionState === "Disconnected") throw new hW("The connection was stopped during negotiation.");
					if (n.error) throw Error(n.error);
					if (n.ProtocolVersion) throw Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
					if (n.url && (t = n.url), n.accessToken) {
						let e = n.accessToken;
						this._accessTokenFactory = () => e, this._httpClient._accessToken = e, this._httpClient._accessTokenFactory = void 0;
					}
					r++;
				} while (n.url && r < sG);
				if (r === sG && n.url) throw Error("Negotiate redirection limit exceeded.");
				await this._createTransport(t, this._options.transport, n, e);
			}
			this.transport instanceof iG && (this.features.inherentKeepAlive = !0), this._connectionState === "Connecting" && (this._logger.log(K.Debug, "The HttpConnection connected successfully."), this._connectionState = "Connected");
		} catch (e) {
			return this._logger.log(K.Error, "Failed to start the connection: " + e), this._connectionState = "Disconnected", this.transport = void 0, this._stopPromiseResolver(), Promise.reject(e);
		}
	}
	async _getNegotiationResponse(e) {
		let t = {}, [n, r] = MW();
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
			return (!n.negotiateVersion || n.negotiateVersion < 1) && (n.connectionToken = n.connectionId), n.useStatefulReconnect && this._options._useStatefulReconnect !== !0 ? Promise.reject(new yW("Client didn't negotiate Stateful Reconnect but the server did.")) : n;
		} catch (e) {
			let t = "Failed to complete negotiation with the server: " + e;
			return e instanceof pW && e.statusCode === 404 && (t += " Either this is not a SignalR endpoint or there is a proxy blocking the connection."), this._logger.log(K.Error, t), Promise.reject(new yW(t));
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
					if (this._logger.log(K.Error, `Failed to start the transport '${n.transport}': ${e}`), s = void 0, a.push(new vW(`${n.transport} failed: ${e}`, Z[n.transport])), this._connectionState !== "Connecting") {
						let e = "Failed to select transport before stop() was called.";
						return this._logger.log(K.Debug, e), Promise.reject(new hW(e));
					}
				}
			}
		}
		return a.length > 0 ? Promise.reject(new bW(`Unable to connect to the server with any of the available transports. ${a.join(" ")}`, a)) : Promise.reject(/* @__PURE__ */ Error("None of the transports supported by the client are supported by the server."));
	}
	_constructTransport(e) {
		switch (e) {
			case Z.WebSockets:
				if (!this._options.WebSocket) throw Error("'WebSocket' is not supported in your environment.");
				return new oG(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
			case Z.ServerSentEvents:
				if (!this._options.EventSource) throw Error("'EventSource' is not supported in your environment.");
				return new aG(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
			case Z.LongPolling: return new iG(this._httpClient, this._logger, this._options);
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
		if (lG(t, i)) {
			if (e.transferFormats.map((e) => nG[e]).indexOf(n) >= 0) {
				if (i === Z.WebSockets && !this._options.WebSocket || i === Z.ServerSentEvents && !this._options.EventSource) return this._logger.log(K.Debug, `Skipping transport '${Z[i]}' because it is not supported in your environment.'`), new gW(`'${Z[i]}' is not supported in your environment.`, i);
				this._logger.log(K.Debug, `Selecting transport '${Z[i]}'.`);
				try {
					return this.features.reconnect = i === Z.WebSockets ? r : void 0, this._constructTransport(i);
				} catch (e) {
					return e;
				}
			}
			return this._logger.log(K.Debug, `Skipping transport '${Z[i]}' because it does not support the requested transfer format '${nG[n]}'.`), /* @__PURE__ */ Error(`'${Z[i]}' does not support ${nG[n]}.`);
		}
		return this._logger.log(K.Debug, `Skipping transport '${Z[i]}' because it was disabled by the client.`), new _W(`'${Z[i]}' is disabled by the client.`, i);
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
function lG(e, t) {
	return !e || (t & e) !== 0;
}
var uG = class e {
	constructor(e) {
		this._transport = e, this._buffer = [], this._executing = !0, this._sendBufferedData = new dG(), this._transportResult = new dG(), this._sendLoopPromise = this._sendLoop();
	}
	send(e) {
		return this._bufferData(e), this._transportResult ||= new dG(), this._transportResult.promise;
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
			this._sendBufferedData = new dG();
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
}, dG = class {
	constructor() {
		this.promise = new Promise((e, t) => [this._resolver, this._rejecter] = [e, t]);
	}
	resolve() {
		this._resolver();
	}
	reject(e) {
		this._rejecter(e);
	}
}, fG = "json", pG = class {
	constructor() {
		this.name = fG, this.version = 2, this.transferFormat = nG.Text;
	}
	parseMessages(e, t) {
		if (typeof e != "string") throw Error("Invalid input for JSON hub protocol. Expected a string.");
		if (!e) return [];
		t === null && (t = CW.instance);
		let n = UW.parse(e), r = [];
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
		return UW.write(JSON.stringify(e));
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
}, mG = {
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
function hG(e) {
	let t = mG[e.toLowerCase()];
	if (t !== void 0) return t;
	throw Error(`Unknown log level: ${e}`);
}
var gG = class {
	configureLogging(e) {
		if (q.isRequired(e, "logging"), _G(e)) this.logger = e;
		else if (typeof e == "string") {
			let t = hG(e);
			this.logger = new jW(t);
		} else this.logger = new jW(e);
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
		return this.reconnectPolicy = e ? Array.isArray(e) ? new $W(e) : e : new $W(), this;
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
		let t = new cG(this.url, e);
		return ZW.create(t, this.logger || CW.instance, this.protocol || new pG(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
	}
};
function _G(e) {
	return e.log !== void 0;
}
//#endregion
//#region src/transport/attach-gate.ts
var vG = class extends Error {
	byServerError;
	constructor(e) {
		super("the connection to the server dropped under the call; it is reconnecting.", { cause: e }), this.name = "ConnectionDropped", this.byServerError = e instanceof Error && e.message.startsWith("Server returned an error on close");
	}
}, yG = class {
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
}, bG = 500;
function xG(e) {
	let { changes: t, ...n } = e;
	return n;
}
function SG() {
	return {};
}
var CG = class {
	windowId;
	connection;
	started = !1;
	gate = new yG();
	inbound;
	constructor(e, t, n = {}) {
		this.windowId = e, this.inbound = new sW(t), this.connection = new gG().withUrl(n.hubUrl ?? "/_ne/hub").withAutomaticReconnect([...n.reconnectDelays ?? [
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
		return await this.invokeAsync("ProcessEventAsync", [e], (e) => this.inbound.answered(e, (e) => e.changes, xG));
	}
	async requestLeaveAsync(e) {
		return await this.invokeAsync("RequestLeaveAsync", [{ target: e }], (e) => this.inbound.answered(e, (e) => e.changes, xG));
	}
	async navigateInPlaceAsync(e) {
		return await this.invokeAsync("NavigateInPlaceAsync", [{ parameters: e }], (e) => this.inbound.answered(e, (e) => e.changes, xG));
	}
	async processChangeSetAsync(e, t) {
		try {
			await this.invokeAsync("ProcessChangeSetAsync", [e], (e) => this.inbound.answered(e, (e) => e, SG, t));
		} catch (e) {
			throw this.isReconnecting && this.gate.failure === null ? new vG(e) : e;
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
		await this.invokeAsync("RequestItemWindowAsync", [e], (e) => this.inbound.answered(e, (e) => e, SG));
	}
	async invokeAsync(e, t, n) {
		let r = window.setTimeout(() => s("call waiting behind the attach.", { methodName: e }), bG);
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
}, wG = Promise.resolve(), TG = () => {}, EG = QU * 3 / 4, DG = 128, OG = class {
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
		if (this.handed >= this.given) return wG;
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
		for (; this.flight !== null;) await this.flight.catch(TG);
	}
	dispatchAsync(e, t) {
		let n = ++this.given, r = eW(e.value), i = r === null ? null : rW(r);
		return i?.catch(TG), new Promise((a, o) => {
			let s = AG(e), c = this.queue.findIndex((e) => e.field === s), l = [{
				resolve: a,
				reject: o
			}], u = n;
			c >= 0 && (l = [...this.queue[c].settles, ...l], u = this.queue[c].sequence, this.queue.splice(c, 1));
			let d = r === null ? kG(e) : kG({
				...e,
				value: void 0
			}) + DG;
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
		let i = n.length === 0 ? null : this.transport.processChangeSetAsync({ updates: n }, jG(r));
		if (this.markHanded(t), i !== null) try {
			await i;
			for (let e of r) for (let t of e.settles) t.resolve();
		} catch (e) {
			if (e instanceof vG) {
				this.requeue(r, e);
				return;
			}
			for (let t of r) for (let n of t.settles) n.reject(e);
		}
	}
	takeBatch() {
		let e = 0, t = 0;
		for (; e < this.queue.length && (e === 0 || t + this.queue[e].bytes <= EG);) t += this.queue[e].bytes, e++;
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
		let t = this.transport.whenAttached().then(() => rW(e));
		return t.catch(TG), t;
	}
	markHanded(e) {
		this.handed = Math.max(this.handed, e);
		for (let e = this.sentWaiters.length - 1; e >= 0; e--) {
			let t = this.sentWaiters[e];
			t.through <= this.handed && (this.sentWaiters.splice(e, 1), t.resolve());
		}
	}
};
function kG(e) {
	return new TextEncoder().encode(JSON.stringify(e)).byteLength;
}
function AG(e) {
	return `${e.componentId}:${e.propertyName}:${JSON.stringify(e.dynamicParameters)}`;
}
function jG(e) {
	let t = e.map((e) => e.before).filter((e) => e !== void 0);
	if (t.length !== 0) return () => {
		for (let e of t) e();
	};
}
//#endregion
//#region src/updates/form-owner.ts
var MG = "form-owner", NG = "ui-form-";
function PG(e) {
	return NG + e.replace(/[ \t\n\f\r]/g, "_");
}
function FG(e, t) {
	if (typeof t != "string" || t.trim().length === 0) {
		e.hasAttribute("form") && e.removeAttribute("form");
		return;
	}
	let n = PG(t);
	LG(n), e.getAttribute("form") !== n && e.setAttribute("form", n);
}
function IG(e) {
	for (let t of e.querySelectorAll("[form]")) {
		let e = t.getAttribute("form");
		e !== null && e.startsWith(NG) && LG(e);
	}
}
function LG(e) {
	let t = RG();
	if (t.querySelector(`form[id="${x(e)}"]`) !== null) return;
	let n = document.createElement("form");
	n.setAttribute("id", e), n.setAttribute("method", "dialog"), n.setAttribute("novalidate", ""), t.appendChild(n);
}
function RG() {
	let e = document.body.querySelector(`[${Rt}]`);
	if (e !== null) return e;
	let t = document.createElement("div");
	return t.setAttribute(Rt, ""), t.setAttribute("hidden", ""), document.body.appendChild(t);
}
//#endregion
//#region src/interactions/legacy-commands.ts
var zG = document;
function BG() {
	try {
		return zG.execCommand("copy");
	} catch {
		return !1;
	}
}
function VG(e) {
	try {
		return typeof zG.execCommand == "function" && zG.execCommand("insertText", !1, e);
	} catch {
		return !1;
	}
}
//#endregion
//#region src/rendering/web-dom-converters.ts
var HG = /* @__PURE__ */ new Map([
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
]), UG = [
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
function WG(e) {
	return $(e, UG);
}
var GG = [
	"small",
	"medium",
	"large"
], KG = ["default", "circle"], qG = [
	"display",
	"title",
	"subtitle",
	"body",
	"caption",
	"overline"
], JG = [
	"start",
	"center",
	"end",
	"justify"
], YG = ["nowrap", "wrap"], XG = /* @__PURE__ */ new Map([
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
	["selected", "--ui-color-selected"],
	["focus-ring", "--ui-color-focus-ring"],
	["border", "--ui-color-border"],
	["shadow", "--ui-color-shadow"],
	["overlay", "--ui-color-overlay"],
	["mark", "--ui-color-mark"]
]), ZG = /* @__PURE__ */ new Map([
	["primary", "--ui-color-primary-ink"],
	["accent", "--ui-color-accent-ink"],
	["info", "--ui-color-info-ink"],
	["warning", "--ui-color-warning-ink"],
	["success", "--ui-color-success-ink"],
	["danger", "--ui-color-danger-ink"]
]), QG = /* @__PURE__ */ new Map([
	["primary", "--ui-color-on-primary"],
	["accent", "--ui-color-on-accent"],
	["info", "--ui-color-on-info"],
	["warning", "--ui-color-on-warning"],
	["success", "--ui-color-on-success"],
	["danger", "--ui-color-on-danger"]
]), $G = ["inline", "trailing"], eK = [
	"filled",
	"outline",
	"underline",
	"ghost",
	"tonal"
], tK = [
	"small",
	"medium",
	"large"
], nK = [
	"small",
	"medium",
	"large"
], rK = [
	"primary",
	"accent",
	"danger",
	"outline",
	"ghost",
	"link",
	"surface"
], iK = [
	"primary",
	"accent",
	"info",
	"warning",
	"success",
	"danger",
	"surface",
	"plain"
], aK = [
	"filled",
	"tinted",
	"outline"
], oK = ["light", "dark"], sK = [
	"start",
	"center",
	"end",
	"stretch"
], cK = ["clip", "visible"], lK = [
	"visible",
	"hidden",
	"collapsed"
], uK = [
	"background",
	"raised",
	"tinted"
], dK = ["horizontal", "vertical"], fK = [
	"none",
	"gap",
	"rule"
], pK = [
	"none",
	"one",
	"many"
], mK = [
	"none",
	"left",
	"right",
	"top",
	"bottom"
], hK = ["stack", "wrap"], gK = ["end", "start"], _K = [
	"disabled",
	"auto",
	"always"
], vK = [
	"disabled",
	"proximity",
	"mandatory"
], yK = [
	"text",
	"email",
	"password",
	"search",
	"tel",
	"url"
], bK = [
	"text",
	"numeric",
	"decimal",
	"tel",
	"email",
	"url",
	"search"
], xK = ["hex", "rgb"], SK = ["field", "swatch"], CK = [
	"fill",
	"contain",
	"cover",
	"none"
], wK = [
	"100% 100%",
	"contain",
	"cover",
	"auto"
], TK = ["default", "circle"], EK = ["uniform", "vignette"], DK = ["linear", "circular"], OK = [
	"none",
	"vertical",
	"horizontal",
	"both"
], kK = [
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
], AK = [
	"None",
	"Shade",
	"Tint"
], jK = /* @__PURE__ */ new Map();
function MK(e) {
	return jK.get(e);
}
function Q(e, t, n) {
	return FK(e, NK(t, n), (e) => `${t}${$(e, n)}`);
}
function NK(e, t) {
	return PK(t.map((t) => `${e}${t}`));
}
function PK(e) {
	let t = new Set(e);
	return (e) => t.has(e);
}
function FK(e, t, n) {
	return jK.set(e, t), [e, n];
}
function IK(e, t, n) {
	return wf.map((r) => [`${e}${r[0].toUpperCase()}${r.slice(1)}${t}`, (e) => n(e, r)]);
}
var LK = new Map([
	Q("colorClass", "ui-color--", UG),
	FK("themeColorClass", NK("ui-color--", UG), (e) => bq(e)),
	FK("iconClass", t_, (e) => n_(e)),
	["iconUrlCss", (e) => Jg(e)],
	["safeUrl", (e) => Pg(e)],
	["safeImageSource", (e) => Ug(e)],
	["inlineMarkupPlainText", (e) => e == null ? void 0 : gA(String(e))],
	["ariaBooleanAttribute", (e) => e === !0 ? "true" : "false"],
	["placeholderText", (e) => typeof e == "string" && e.length > 0 ? e : " "],
	Q("iconSizeClass", "ui-icon-size--", GG),
	FK("iconShapeClass", PK(["ui-icon--circle"]), (e) => $(e, KG) === "circle" ? "ui-icon--circle" : ""),
	Q("textTypeClass", "ui-text-type--", qG),
	FK("textAppearanceClass", NK("ui-text-type--", qG), (e) => kq(e, "ui-text-type--")),
	FK("textDescriptionTypeClass", NK("ui-text--description-", qG), (e) => kq(e, "ui-text--description-")),
	Q("textAlignmentClass", "ui-text--align-", JG),
	Q("textWrapClass", "ui-text--", YG),
	Q("buttonAlignmentClass", "ui-button--align-", JG),
	Q("textBadgePlacementHostClass", "ui-text--badge-", $G),
	Q("badgeStyleClass", "ui-badge-style--", iK),
	Q("badgeFillClass", "ui-badge-fill--", aK),
	FK("badgeColoredClass", PK(["ui-badge--colored"]), (e) => fq(e).length > 0 ? "ui-badge--colored" : ""),
	["badgeTextFit", (e) => xq(e)],
	Q("buttonClass", "ui-button--", rK),
	Q("surfaceStyleClass", "ui-surface--", uK),
	Q("orientationClass", "ui-orientation--", dK),
	Q("groupSeparatorClass", "ui-command-bar--separator-", fK),
	["selectionModeAttribute", (e) => $(e, pK)],
	["selectionBackgroundCss", (e) => fq(lq(e, "background"))],
	["selectionForegroundCss", (e) => fq(lq(e, "foreground"))],
	["selectionMarkColorCss", (e) => fq(lq(e, "markColor"))],
	["selectionMarkCss", (e) => dq(lq(e, "mark"))],
	["selectionFontWeightCss", (e) => uq(lq(e, "bold"))],
	["selectionActionBarBackgroundCss", (e) => fq(lq(e, "actionBarBackground"))],
	Q("itemsViewLayoutClass", "ui-items-view--", hK),
	Q("dragHandlePlacementClass", "ui-drag-handle--", gK),
	Q("scrollXClass", "ui-scroll-x--", _K),
	Q("scrollYClass", "ui-scroll-y--", _K),
	["hostViewport", (e) => QK(e)],
	Q("scrollSnapClass", "ui-scroll-snap--", vK),
	Q("inputAppearanceClass", "ui-input--", eK),
	Q("inputSizeClass", "ui-input--", nK),
	Q("buttonSizeClass", "ui-button--", tK),
	Q("buttonGroupSizeClass", "ui-button-group--", tK),
	["textInputTypeAttribute", (e) => $(e, yK)],
	["inputModeAttribute", (e) => $(e, bK)],
	["colorTextFormatAttribute", (e) => $(e, xK)],
	["colorInputVariantAttribute", (e) => $(e, SK)],
	["themeNameCss", (e) => $(e, oK)],
	["alignmentCss", (e) => $(e, sK)],
	["alignmentStretchFallbackCss", (e) => $(e, sK) === "stretch" ? "start" : ""],
	["overflowCss", (e) => $(e, cK)],
	["layoutLengthCss", (e) => $K(e)],
	["thicknessCss", (e) => nq(e)],
	FK("borderNoneClass", PK(["ui-border--none"]), (e) => iq(e)),
	["radiusCss", (e) => aq(e)],
	["gridUnitCss", (e) => oq(e)],
	["pixelsCss", (e) => zq(e)],
	["gridTemplateCss", (e) => sq(e)],
	["colorVariantCss", (e) => Nq(e)],
	["themeColorCss", (e) => fq(e)],
	["themeInkCss", (e) => mq(e)],
	["roleInkCss", (e) => hq(e)],
	["themeOnColorCss", (e) => _q(e)],
	["themeColorInlineCss", (e) => pq(e) ? "" : fq(e)],
	["themeColorCanonical", (e) => jq(e)],
	["textAppearanceFontSizeCss", (e) => Aq(e, "size")],
	["textAppearanceFontWeightCss", (e) => Aq(e, "weight")],
	["textAppearanceLineHeightCss", (e) => Aq(e, "lineHeight")],
	["textAppearanceLetterSpacingCss", (e) => Aq(e, "letterSpacing")],
	...IK("responsiveLayoutLength", "Css", (e, t) => $K(Af(e, t))),
	...IK("responsiveWidth", "Css", (e, t) => eq(Af(e, t), "horizontal")),
	...IK("responsiveHeight", "Css", (e, t) => eq(Af(e, t), "vertical")),
	...IK("responsiveThickness", "Css", (e, t) => nq(Af(e, t))),
	...IK("responsiveThicknessHorizontal", "Css", (e, t) => rq(Af(e, t), "horizontal")),
	...IK("responsiveThicknessVertical", "Css", (e, t) => rq(Af(e, t), "vertical")),
	...IK("responsiveRadius", "Css", (e, t) => aq(Af(e, t))),
	...IK("responsivePixels", "Css", (e, t) => Bq(Af(e, t))),
	...IK("visibility", "Attribute", (e, t) => Vq(e, t)),
	...IK("gridPlacement", "ColumnCss", (e, t) => cq(Af(e, t), "column")),
	...IK("gridPlacement", "RowCss", (e, t) => cq(Af(e, t), "row")),
	...IK("gridPlacement", "ColumnSpanCss", (e, t) => cq(Af(e, t), "columnSpan")),
	...IK("gridPlacement", "RowSpanCss", (e, t) => cq(Af(e, t), "rowSpan")),
	Q("imageFitClass", "ui-image-fit--", CK),
	FK("imageShapeClass", PK(["ui-image--circle"]), (e) => $(e, TK) === "circle" ? "ui-image--circle" : ""),
	["backgroundImageCss", (e) => HK(e)],
	["backgroundImageAttribute", (e) => HK(e).length === 0 ? void 0 : ""],
	["imageFitSizeCss", (e) => $(e, wK)],
	["backgroundImageDimCss", (e) => UK(e)],
	["backgroundImageDimModeAttribute", (e) => $(e, EK) === "vignette" ? "vignette" : void 0],
	["backgroundImageBlurCss", (e) => qK(e) ? `${Number(e)}px` : ""],
	["backgroundImageBlurAttribute", (e) => qK(e) ? "" : void 0],
	["positiveCount", (e) => WK(e)?.toString()],
	["nonNegativeCount", (e) => GK(e, (e) => e >= 0)?.toString()],
	["nonZeroCount", (e) => GK(e, (e) => e !== 0)?.toString()],
	["positiveNumber", (e) => KK(e, (e) => e > 0)?.toString()],
	["nonNegativeNumber", (e) => KK(e, (e) => e >= 0)?.toString()],
	["share", (e) => KK(e, (e) => e >= 0 && e <= 1)?.toString()],
	["positiveFlagAttribute", (e) => WK(e) === void 0 ? void 0 : ""],
	FK("maxLinesClass", PK(["ui-text--max-lines"]), (e) => WK(e) === void 0 ? "" : "ui-text--max-lines"),
	Q("progressVariantClass", "ui-progress--", DK),
	["progressValueText", (e) => Rq(e)],
	["textAreaResizeCss", (e) => $(e, OK)],
	Q("flyoutPlacementClass", "ui-flyout--", kK),
	["popupPlacementAttribute", (e) => $(e, kK)],
	["tabMenuEntriesAttribute", (e) => BK(e)],
	["markedDaysAttribute", (e) => VK(e)]
]);
function RK(e) {
	let t = LK.get("surfaceStyleClass");
	return uK.find((n, r) => e.classList.contains(t?.(r) ?? "")) ?? null;
}
var zK = [
	["rename", 1],
	["pin", 2],
	["close", 4],
	["delete", 8]
];
function BK(e) {
	let t = typeof e == "string" ? e.split(",").map((e) => e.trim().toLowerCase()) : null, n = typeof e == "number" ? e : 0, r = zK.filter(([e, r]) => t === null ? (n & r) !== 0 : t.includes(e)).map(([e]) => e);
	return r.length === 0 ? void 0 : r.join(" ");
}
function VK(e) {
	let t = Array.isArray(e) ? e.filter((e) => typeof e == "string" && e.length > 0).map((e) => e.slice(0, 10)) : [];
	return t.length === 0 ? void 0 : [...new Set(t)].sort().join(" ");
}
function HK(e) {
	return Jg(e);
}
function UK(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isNaN(t) ? "" : String(Math.min(1, Math.max(0, t)));
}
function WK(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isInteger(t) && t > 0 ? t : void 0;
}
function GK(e, t) {
	let n = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isInteger(n) && t(n) ? n : void 0;
}
function KK(e, t) {
	let n = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isFinite(n) && t(n) ? n : void 0;
}
function qK(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isFinite(t) && t > 0;
}
var JK = [
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
], YK = new Map(JK.map(([, e, t, n, r]) => [e, [
	t,
	n,
	r
]])), XK = new Map(JK.map(([e, t]) => [e, t])), ZK = /* @__PURE__ */ new Map([[cK, /* @__PURE__ */ new Map([["Hidden", "clip"]])], [wK, /* @__PURE__ */ new Map([["Fill", "100% 100%"], ["None", "auto"]])]]);
function $(e, t) {
	return typeof e == "string" ? (t === void 0 ? void 0 : ZK.get(t)?.get(e)) ?? HG.get(e) ?? di(e) : typeof e == "number" && t !== void 0 ? t[e] ?? String(e) : String(e ?? "");
}
function QK(e) {
	return e == null || $(e, _K) === "disabled" ? void 0 : "parent";
}
function $K(e) {
	if (e == null) return "";
	if (typeof e == "number") return zq(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.kind, r = t.value ?? 0;
	return n === "Auto" || n === 0 ? "" : n === "Absolute" || n === 1 ? zq(r) : n === "Fill" || n === 2 ? "100%" : "";
}
function eq(e, t) {
	if (typeof e != "object" || !e) return $K(e);
	let n = e.kind;
	return n !== "Fill" && n !== 2 ? $K(e) : t === "horizontal" ? "var(--ui-fill-width, 100%)" : "var(--ui-fill-height, 100%)";
}
function tq(e) {
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
function nq(e) {
	if (e == null) return "";
	let t = tq(e);
	return t === void 0 ? String(e) : `${t.top}px ${t.right}px ${t.bottom}px ${t.left}px`;
}
function rq(e, t) {
	let n = tq(e);
	return n === void 0 ? "" : zq(t === "horizontal" ? n.left + n.right : n.top + n.bottom);
}
function iq(e) {
	if (e == null) return "";
	if (typeof e == "object" && "base" in e) return wf.map((t) => Af(e, t)).filter((e) => e != null).every((e) => iq(e) !== "") ? "ui-border--none" : "";
	let t = tq(e);
	return t !== void 0 && t.top === 0 && t.right === 0 && t.bottom === 0 && t.left === 0 ? "ui-border--none" : "";
}
function aq(e) {
	if (e == null) return "";
	if (typeof e == "number") return zq(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.topLeft ?? 0, r = t.topRight ?? 0, i = t.bottomRight ?? 0, a = t.bottomLeft ?? 0;
	return n === r && n === i && n === a ? zq(n) : `${n}px ${r}px ${i}px ${a}px`;
}
function oq(e) {
	if (e == null) return "";
	if (typeof e == "number") return e <= 0 ? "minmax(0, 1fr)" : `minmax(0, ${e}fr)`;
	if (typeof e != "object") return String(e);
	let t = e, n = t.unit, r = t.value ?? 1, i = t.minValue, a = t.maxValue;
	if (n === "Absolute" || n === 1) return zq(r);
	if (n === "Star" || n === 0) {
		let e = i != null && i > 0 ? `${i}px` : "0";
		return r <= 0 ? `minmax(${e}, 1fr)` : `minmax(${e}, ${r}fr)`;
	}
	return n === "Auto" || n === 2 ? i == null ? a == null ? "auto" : `fit-content(${a}px)` : `minmax(${i}px, auto)` : "";
}
function sq(e) {
	if (e == null) return "";
	if (!Array.isArray(e)) return oq(e);
	if (e.length === 0) return "none";
	if (e.length === 1) return oq(e[0]);
	let t = JSON.stringify(e[0]);
	return e.every((e) => JSON.stringify(e) === t) ? `repeat(${e.length}, ${oq(e[0])})` : e.map((e) => oq(e)).join(" ");
}
function cq(e, t) {
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
function lq(e, t) {
	return typeof e != "object" || !e ? null : e[t] ?? null;
}
function uq(e) {
	return e == null ? "" : e === !0 ? "600" : "400";
}
function dq(e) {
	if (e == null) return "";
	switch ($(e, mK)) {
		case "left": return "inset 2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "right": return "inset -2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "top": return "inset 0 2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "bottom": return "inset 0 -2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		default: return "none";
	}
}
function fq(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	if (Mq(e)) return Nq(e);
	let t = e, n = Nq(t.light), r = Nq(t.dark), i = n.length > 0 ? n : r, a = r.length > 0 ? r : n;
	if (i.length > 0 && a.length > 0) return i === a ? i : `light-dark(${i}, ${a})`;
	let o = t.style;
	if (o == null) return "";
	let s = XG.get($(o, UG));
	return s ? `var(${s})` : "";
}
function pq(e) {
	if (typeof e != "object" || !e || Mq(e)) return !1;
	let t = e;
	return t.light == null && t.dark == null && t.style != null;
}
function mq(e) {
	if (pq(e)) {
		let t = ZG.get($(e.style, UG));
		if (t !== void 0) return `var(${t})`;
	}
	return fq(e);
}
function hq(e) {
	if (typeof e != "object" || !e || Mq(e)) return "";
	let t = e;
	return t.light == null && t.dark == null ? mq(e) : "";
}
var gq = /* @__PURE__ */ new Set(["background", "surface"]);
function _q(e) {
	if (typeof e != "object" || !e) return "";
	if (Mq(e)) return vq(e) ? "initial" : yq(e);
	let t = e, n = yq(t.light ?? t.dark), r = yq(t.dark ?? t.light);
	if (n.length > 0 && r.length > 0 && vq(t.light ?? t.dark) && vq(t.dark ?? t.light)) return "initial";
	if (n.length > 0 && r.length > 0) return n === r ? n : `light-dark(${n}, ${r})`;
	if (t.style === null || t.style === void 0) return "";
	let i = $(t.style, UG);
	if (gq.has(i)) return "initial";
	let a = QG.get(i);
	return a ? `var(${a})` : "";
}
function vq(e) {
	return Pq(e)?.[3] === 0;
}
function yq(e) {
	let t = Pq(e);
	return t === void 0 ? "" : vI(t[0], t[1], t[2], t[3]);
}
function bq(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.light != null || t.dark != null) return "";
	let n = t.style;
	return n == null ? "" : `ui-color--${$(n, UG)}`;
}
function xq(e) {
	let t = Tq(e == null ? "" : String(e).trim(), Sq + 1);
	return t > 0 && t <= Sq ? "compact" : "";
}
var Sq = 2, Cq = /[\u0300-\uFFFF]/, wq = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function Tq(e, t) {
	if (!Cq.test(e)) return e.length;
	let n = 0;
	for (let { segment: r } of wq.segment(e)) {
		if (n >= t) break;
		n += Eq(r) ? 2 : 1;
	}
	return n;
}
function Eq(e) {
	if (e.includes("️")) return !0;
	let t = e.codePointAt(0) ?? 0;
	for (let e = 0; e < Dq.length; e += 2) if (t >= Dq[e] && t <= Dq[e + 1]) return !0;
	return !1;
}
var Dq = [
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
function Oq(e, t) {
	let n = String(t), r = e.querySelector(".ui-badge__text");
	r !== null && (r.textContent = n), e.setAttribute(Ue, xq(n)), e.setAttribute(We, "");
}
function kq(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size != null) return "";
	let r = n.role;
	return r == null ? "" : `${t}${$(r, qG)}`;
}
function Aq(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size == null) return "";
	switch (t) {
		case "size": return zq(n.size);
		case "weight": {
			let e = n.weight;
			return e == null ? "" : String(e);
		}
		case "lineHeight": {
			let e = n.lineHeight;
			return e == null ? "" : zq(e);
		}
		case "letterSpacing": {
			let e = n.letterSpacing;
			return e == null ? "" : zq(e);
		}
		default: return "";
	}
}
function jq(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return "";
	let t = e, n = Fq(t.style);
	if (n !== null) return `@${n}`;
	let r = t.light ?? t.dark;
	if (r == null) return "";
	if (typeof r.rgb == "number") {
		let e = r.opacity ?? 255, t = `#${_I(r.rgb >> 16 & 255)}${_I(r.rgb >> 8 & 255)}${_I(r.rgb & 255)}`;
		return e === 255 ? t : `${t}${_I(e)}`;
	}
	let i = Iq(r.name);
	return i === null ? "" : `${i}/${Lq(r.adjustment) ?? "None"}/${r.factor ?? 0}/${r.opacity ?? 255}`;
}
function Mq(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.name !== void 0 || t.rgb !== void 0;
}
function Nq(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	let t = Pq(e);
	return t === void 0 ? "" : `#${_I(t[0])}${_I(t[1])}${_I(t[2])}${_I(t[3])}`;
}
function Pq(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = typeof t.rgb == "number" ? [
		t.rgb >> 16 & 255,
		t.rgb >> 8 & 255,
		t.rgb & 255
	] : void 0, r = Iq(t.name), i = n ?? (r === null ? void 0 : YK.get(r));
	if (!i) return;
	let a = Lq(t.adjustment), o = (t.factor ?? 0) / 10, s = t.opacity ?? 255, [c, l, u] = i;
	return a === "Shade" ? (c = W(c * (1 - o)), l = W(l * (1 - o)), u = W(u * (1 - o))) : a === "Tint" && (c = W(c + (255 - c) * o), l = W(l + (255 - l) * o), u = W(u + (255 - u) * o)), [
		c,
		l,
		u,
		s
	];
}
function Fq(e) {
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	if (typeof e != "number") return null;
	let t = UG[e];
	return t === void 0 ? null : t.split("-").map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join("");
}
function Iq(e) {
	if (typeof e == "number") return XK.get(e) ?? null;
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	return null;
}
function Lq(e) {
	if (typeof e == "number") return AK[e] ?? "None";
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? "None" : t;
	}
	return "None";
}
function Rq(e) {
	if (e == null || e === "") return "";
	let t = typeof e == "number" ? e : Number(e);
	return Number.isFinite(t) ? String(t) : "";
}
function zq(e) {
	return `${typeof e == "number" ? e : Number(e ?? 0)}px`;
}
function Bq(e) {
	return e == null ? "" : zq(e);
}
function Vq(e, t) {
	let n = jf(e, t);
	if (n == null) return;
	let r = $(n, lK);
	return r === "visible" ? void 0 : r;
}
//#endregion
//#region src/interactions/live-announcer.ts
var Hq = "ui-announcer", Uq = 7e3, Wq = class {
	container;
	regions = /* @__PURE__ */ new Map();
	constructor(e) {
		this.container = e, this.ensureRegion("polite"), this.ensureRegion("assertive");
	}
	announce(e, t = "polite") {
		let n = document.createElement("div");
		return typeof e == "string" ? n.textContent = e : T.writeValue(n, null, e), this.ensureRegion(t).append(n), window.setTimeout(() => n.remove(), Uq), n;
	}
	ensureRegion(e) {
		let t = this.regions.get(e);
		if (t !== void 0 && t.isConnected) return t;
		let n = `.${Hq}[aria-live="${e}"]`, r = this.container.querySelector(n), i = r ?? document.createElement("div");
		return r === null && (i.className = Hq, i.setAttribute("aria-live", e), this.container.append(i)), this.regions.set(e, i), i;
	}
}, Gq = "ui-notification-host", Kq = "ui-notification", qq = "ui-notification--leaving", Jq = "ui-notification__message", Yq = "ui-notification__title", Xq = "ui-notification__action", Zq = "ui-notification__close", Qq = 5e3, $q = 8e3, eJ = "ui-notification--connection", tJ = "--ui-notification-lift", nJ = /* @__PURE__ */ new Set([
	"info",
	"success",
	"warning",
	"danger",
	"primary",
	"accent"
]), rJ = class {
	root;
	components;
	durationMs;
	host = null;
	announcer;
	focusOrigins = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, this.durationMs = e.durationMs ?? Qq, this.ensureHost(), this.announcer = new Wq(this.root instanceof Document ? this.root.body : this.root);
	}
	announce(e, t) {
		return this.announcer.announce(e, t);
	}
	show(e) {
		let t = WG(e.severity), n = document.createElement("div");
		n.className = nJ.has(t) ? `${Kq} ${Kq}--${t}` : Kq, n.classList.toggle(eJ, e.connection === !0), t === "danger" && n.setAttribute("role", "alert");
		let r = document.createElement("span");
		if (r.className = Jq, e.title !== void 0) {
			let t = document.createElement("span");
			t.className = Yq, T.writeValue(t, null, e.title), n.append(t);
		}
		typeof e.message == "string" ? r.textContent = e.message : T.writeValue(r, null, e.message), n.append(r);
		let i = document.createElement("button");
		return i.type = "button", i.className = Zq, T.write(i, "aria-label", "ui.notification.close"), i.addEventListener("click", () => this.dismiss(n)), n.append(i), e.action !== void 0 && n.append(sJ(e.action, e.sticky === !0 ? null : () => this.dismiss(n))), n.addEventListener("keydown", (e) => {
			e.key !== "Escape" || e.defaultPrevented || k(e) || (e.preventDefault(), this.dismiss(n));
		}), n.addEventListener("focusin", (e) => {
			let t = e.relatedTarget;
			t instanceof HTMLElement && !n.contains(t) && this.focusOrigins.set(n, t);
		}), iJ(() => {
			if (n.classList.contains(qq)) return;
			let t = this.ensureHost();
			aJ(t), t.append(n), e.sticky !== !0 && this.standFor(n, e);
		}), n;
	}
	standFor(e, t) {
		let n = t.durationMs !== void 0 && t.durationMs > 0 ? t.durationMs : t.action === void 0 ? this.durationMs : $q, r = !1, i = !1, a = window.setTimeout(() => this.dismiss(e), n), o = () => window.clearTimeout(a), s = () => {
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
		if (!e.classList.contains(qq) && (e.classList.add(qq), e.isConnected)) {
			if (this.returnFocus(e), xf() || typeof e.animate != "function") {
				e.remove();
				return;
			}
			window.setTimeout(() => oJ(e), L.fast);
		}
	}
	returnFocus(e) {
		if (!e.contains(document.activeElement)) return;
		let t = [...e.parentElement?.children ?? []].find((t) => t !== e && !t.classList.contains(qq));
		Sd(vd(this.focusOrigins.get(e), this.components) ?? t?.querySelector(`.${Zq}`) ?? null, e);
	}
	ensureHost() {
		if (this.host !== null && this.host.isConnected) return this.host;
		let e = this.root instanceof Document ? this.root.body : this.root, t = e.querySelector(`.${Gq}`), n = t ?? document.createElement("div");
		return n.classList.add(Gq), n.setAttribute("role", "status"), n.setAttribute("aria-live", "polite"), t === null && e.append(n), this.host = n, n;
	}
};
function iJ(e) {
	if (Oz(document.visibilityState)) {
		e();
		return;
	}
	let t = () => {
		Oz(document.visibilityState) && (document.removeEventListener("visibilitychange", t), e());
	};
	document.addEventListener("visibilitychange", t);
}
function aJ(e) {
	let t = window.innerHeight - kp(window.innerHeight);
	t > 0 ? e.style.setProperty(tJ, `${Math.round(t)}px`) : e.style.removeProperty(tJ);
}
function oJ(e) {
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
		duration: L.fast,
		easing: L.exit,
		fill: "forwards"
	}), i = () => e.remove();
	r.finished.then(i, i);
}
function sJ(e, t) {
	let n = document.createElement("button"), r = !1;
	return n.type = "button", n.className = `${Xq} ui-button ui-button--primary ui-button--small`, typeof e.label == "string" ? n.textContent = e.label : T.writeValue(n, null, e.label), n.addEventListener("click", () => {
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
function cJ(e, t) {
	let n = lJ(e), r = e?.label;
	if (n !== void 0) {
		if (!ro(r) && !io(r)) {
			s("a notification's action carries no words.", e);
			return;
		}
		return {
			label: r,
			run: () => t(n)
		};
	}
}
function lJ(e) {
	return e != null && typeof e.id == "string" && e.id.length > 0 ? e.id : void 0;
}
//#endregion
//#region src/effects/insert-text.ts
function uJ(e, t, n) {
	let r = e.itemKey === !0 ? dJ(n) : e.text;
	if (typeof r != "string") {
		s(e.itemKey === !0 ? "insert text effect reads the row's key but ran for no row." : "insert text effect carries no text.", e);
		return;
	}
	let i = fJ(t);
	if (i === null) {
		s("insert text effect target holds no text field.", e);
		return;
	}
	pJ(i, r);
}
function dJ(e) {
	let t = e.length === 0 ? null : e[e.length - 1];
	return t == null ? null : String(t);
}
function fJ(e) {
	if (yc(e)) return e;
	for (let t of e.querySelectorAll("input, textarea")) if (yc(t)) return t;
	return null;
}
function pJ(e, t) {
	if (t.length === 0 || e.readOnly || e.disabled || E(e) || O(e)) return !1;
	let n = e.value, r = e.selectionStart !== null, i = e.selectionStart ?? n.length, a = e.selectionEnd ?? i;
	return e.maxLength >= 0 && n.length - (a - i) + t.length > e.maxLength ? !1 : (document.activeElement !== e && e.focus({ preventScroll: !0 }), r && e.setSelectionRange(i, a), document.activeElement === e && VG(t) && e.value !== n ? !0 : (r ? e.setRangeText(t, i, a, "end") : e.value = n + t, e.dispatchEvent(new Event("input", { bubbles: !0 })), !0));
}
//#endregion
//#region src/effects/navigation-url.ts
function mJ(e) {
	let t = e.request?.route;
	return t == null || t.length === 0 ? null : hJ(t, e.request?.parameters ?? null);
}
function hJ(e, t) {
	let n = gJ(t);
	if (n.length === 0) return e;
	let r = e.indexOf("#"), i = r < 0 ? e : e.slice(0, r), a = r < 0 ? "" : e.slice(r);
	return `${i}${i.includes("?") ? i.endsWith("?") || i.endsWith("&") ? "" : "&" : "?"}${n}${a}`;
}
function gJ(e) {
	if (e === null) return "";
	let t = new URLSearchParams();
	for (let [n, r] of Object.entries(e)) if (r != null) for (let e of Array.isArray(r) ? r : [r]) e != null && t.append(n, _J(e));
	return t.toString();
}
function _J(e) {
	return typeof e == "object" ? JSON.stringify(e) : String(e);
}
//#endregion
//#region src/effects/scroller.ts
function vJ(e, t) {
	let n = bJ([e, ...e.querySelectorAll("*")], t);
	if (n !== null) return n;
	let r = [];
	for (let t = e.parentElement; t !== null; t = t.parentElement) r.push(t);
	return bJ(r, t) ?? yJ(t);
}
function yJ(e) {
	let t = typeof document > "u" ? null : document.scrollingElement ?? null;
	return t !== null && xJ(t, e) ? t : null;
}
function bJ(e, t) {
	let n = null;
	for (let r of e) if (wk(r, t)) {
		if (xJ(r, t)) return r;
		n ??= r;
	}
	return n;
}
function xJ(e, t) {
	return t ? e.scrollHeight > e.clientHeight : e.scrollWidth > e.clientWidth;
}
//#endregion
//#region src/effects/effect-registry.ts
var SJ = class {
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
		this.handlers.set(Ai(e), t);
	}
	applyAll(e, t) {
		if (e != null) for (let n of e) this.apply({
			effect: n,
			dom: t
		});
	}
	apply(e) {
		let t = Ai(e.effect?.kind), n = t.length === 0 ? void 0 : this.handlers.get(t);
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
			let t = mJ(e.effect);
			if (t === null) {
				s("navigate effect carries no route.", e.effect);
				return;
			}
			if (!Lg(t)) {
				s("navigate effect names no route of this site; not followed.", e.effect);
				return;
			}
			this.navigate === void 0 ? window.location.assign(t) : this.navigate(t);
		}), this.register("ReplaceAddress", (e) => {
			this.writeAddress(e, (e, t) => e.replace(t));
		}), this.register("PushAddress", (e) => {
			this.writeAddress(e, (e, t) => e.push(t));
		}), this.register("SetTheme", (e) => {
			let t = e.effect, n = Pi(t.mode), r = n === "Unknown" ? "auto" : n.toLowerCase();
			document.documentElement.getAttribute("data-ui-theme") !== r && document.documentElement.setAttribute(hr, r), t.stored !== !0 && this.reportTheme?.(r);
		}), this.register("Focus", (e) => {
			let t = DJ(e);
			t !== null && (sV(t), kJ(t));
		}), this.register("ScrollTo", (e) => {
			let t = DJ(e);
			if (t === null) return;
			let n = e.effect, r = ji(n.behavior), i = Mi(n.block);
			sV(t), t.scrollIntoView({
				behavior: OJ(r),
				block: i === "Unknown" ? "nearest" : i.toLowerCase()
			});
		}), this.register("ScrollToItem", (e) => {
			let t = DJ(e);
			if (t === null) return;
			let n = e.effect, r = qB(t);
			if (r === null || typeof n.key != "string" || n.key.length === 0) {
				s("scroll to item effect names no items host or no key.", e.effect);
				return;
			}
			let i = Mi(n.block);
			sV(Bc(r)), JB(r, n.key, i === "Unknown" ? "Start" : i, OJ(ji(n.behavior))) || s("scroll to item effect names a row the host has not drawn.", e.effect);
		}), this.register("Scroll", (e) => {
			let t = DJ(e);
			if (t === null) return;
			let n = e.effect, r = Fi(n.axis) !== "Horizontal", i = vJ(t, r);
			if (i === null) {
				s("scroll effect target has no scrollable element.", e.effect);
				return;
			}
			let a = r ? i.clientHeight : i.clientWidth, o = (r ? i.scrollHeight : i.scrollWidth) - a, c = r ? i.scrollTop : i.scrollLeft, l = Ni(n.position), u;
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
			let d = OJ(ji(n.behavior));
			sV(i), r && l === "End" && dV(i) && oV(i), i.scrollTo(r ? {
				top: u,
				behavior: d
			} : {
				left: u,
				behavior: d
			});
		}), this.register("Show", (e) => {
			EJ(DJ(e), null);
		}), this.register("Hide", (e) => {
			EJ(DJ(e), "hidden");
		}), this.register("Collapse", (e) => {
			EJ(DJ(e), "collapsed");
		}), this.register("CopyToClipboard", (e) => {
			let t = AJ(e, this.valueReaders);
			t !== null && jJ(t).catch((e) => s("copy to clipboard failed.", e));
		}), this.register("InsertText", (e) => {
			let t = DJ(e);
			t !== null && uJ(e.effect, t, e.row ?? []);
		}), this.register("OpenPicker", (e) => {
			let t = DJ(e);
			t !== null && !og(t) && s("open picker effect names no file or image input.", e.effect);
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
			if (!Ng(t.requestPath)) {
				s("download effect refused: the path's scheme is not one a link may carry.", e.effect);
				return;
			}
			let n = document.createElement("a");
			n.href = t.requestPath, n.download = t.fileName ?? "", n.style.display = "none", document.body.appendChild(n), n.click(), n.remove();
		}), this.register("ShowNotification", (e) => {
			let t = e.effect;
			if (!ro(t.message) && !io(t.message)) {
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
				action: this.runAction === void 0 ? void 0 : cJ(t.action, this.runAction)
			});
		}), this.register("RequestNotificationPermission", () => {
			kz() !== void 0 && Notification.requestPermission().then(() => this.clientStateChanged?.()).catch((e) => s("asking for the notification permission failed.", e));
		}), this.register("ShowSystemNotification", (e) => this.showSystemNotification(e.effect)), this.register("Announce", (e) => {
			let t = e.effect;
			if (!ro(t.message) && !io(t.message)) {
				s("announce effect carries no message.", e.effect);
				return;
			}
			if (this.notifications === void 0) {
				s("announce effect arrived but no notification engine is wired up.", t.message);
				return;
			}
			this.notifications.announce(t.message, Ii(t.politeness) === "Assertive" ? "assertive" : "polite");
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
		if (!ro(t) && !io(t)) {
			s("system notification effect carries no title.", e);
			return;
		}
		let n = ro(e.body) || io(e.body) ? e.body : void 0, r = typeof e.address == "string" && Lg(e.address) ? e.address : void 0, i = () => {
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
		if (e.when !== "Always" && Oz(document.visibilityState)) {
			i();
			return;
		}
		let a = lJ(e.action);
		Pz({
			title: CJ(t),
			body: n === void 0 ? void 0 : CJ(n),
			tag: e.tag ?? "",
			icon: typeof e.icon == "string" && Lg(e.icon) ? e.icon : wJ(),
			silent: e.silent === !0,
			requireInteraction: e.requireInteraction === !0,
			address: r ?? TJ(),
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
		return t !== void 0 && n !== void 0 && Iz(t) ? {
			label: ro(e.addressLabel) || io(e.addressLabel) ? e.addressLabel : { key: "ui.notification.open" },
			run: () => n(t)
		} : this.runAction === void 0 ? void 0 : cJ(e.action, this.runAction);
	}
};
function CJ(e) {
	return ro(e) ? T.translate(e.key, e.args) : io(e) ? T.resolveText(e.text) : "";
}
function wJ() {
	let e = document.querySelector("link[rel~='icon']")?.href;
	return e === void 0 || e.startsWith("data:") ? void 0 : e;
}
function TJ() {
	return window.location.pathname + window.location.search + window.location.hash;
}
function EJ(e, t) {
	if (e === null) return;
	let n = Kd();
	for (let n of Lr) t === null ? e.removeAttribute(n) : e.setAttribute(n, t);
	n !== null && qd(n);
}
function DJ(e) {
	let t = e.effect.target;
	if (t === void 0 || t.id === void 0) return s("targeted client effect carries no resolved component address.", e.effect), null;
	let n = e.dom.findComponent(C(t.id), t.dynamicParameters ?? []);
	return n === null && s("client effect target was not found in the DOM.", e.effect), n;
}
function OJ(e) {
	return e === "Smooth" && !xf() ? "smooth" : "auto";
}
function kJ(e) {
	if (e instanceof HTMLElement && (e.tabIndex >= 0 || e.matches(Fu))) {
		e.focus();
		return;
	}
	let t = rd(e);
	if (t !== null) {
		t.focus();
		return;
	}
	s("focus effect target has nothing focusable.", e);
}
function AJ(e, t) {
	let n = e.effect;
	if (typeof n.text == "string") return n.text;
	let r = DJ(e);
	return r === null ? null : t === void 0 ? (s("copy to clipboard effect names a component but no value reader is wired up.", e.effect), null) : Fs(r) === null ? (s("copy to clipboard effect target holds no value.", e.effect), null) : ks(t.readHeld(r));
}
async function jJ(e) {
	if (navigator.clipboard !== void 0) try {
		await navigator.clipboard.writeText(e);
		return;
	} catch {}
	if (!MJ(e)) throw Error("neither the clipboard API nor the selection command took the text.");
}
function MJ(e) {
	let t = document.createElement("textarea");
	t.value = e, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.opacity = "0", document.body.appendChild(t), t.select();
	try {
		return BG();
	} finally {
		t.remove();
	}
}
//#endregion
//#region src/interactions/dialog-engine.ts
var NJ = class {
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
		let n = t.querySelector(".ui-dialog__surface") ?? t, r = rd(t), i = Xu() && yc(r);
		i && !n.hasAttribute("tabindex") && (n.tabIndex = -1);
		let a = hd(n, i ? n : r);
		return a !== null && this.returnFocusByKey.set(e, a), PJ(t) && this.swipes.set(e, bm(n, n, () => this.closeFromViewer(e))), !0;
	}
	close(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (t.hasAttribute("hidden")) return !0;
		let n = this.returnFocusByKey.get(e);
		return this.returnFocusByKey.delete(e), this.swipes.get(e)?.(), this.swipes.delete(e), t.contains(document.activeElement) && Sd(vd(n, this.components), t), t.setAttribute("hidden", ""), !0;
	}
	find(e) {
		return this.root.querySelector(`[${Ip}="${x(e)}"]`);
	}
	handleClick(e) {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest(`[${Rp}]`);
		if (n === null) return;
		let r = n.closest(`[${Ip}]`);
		if (!(r instanceof HTMLElement) || r.hasAttribute("hidden") || !r.hasAttribute("data-ui-dialog-close-backdrop")) return;
		let i = r.getAttribute(Ip);
		i !== null && this.closeFromViewer(i);
	}
	handleKeydown(e) {
		if (e.defaultPrevented || k(e)) return;
		let t = this.getTopmostOpen();
		if (!(t === null || Gp(t))) {
			if (e.key === "Escape" && t.hasAttribute("data-ui-dialog-close-escape") && !Zp() && !uc(e)) {
				let n = t.getAttribute(Ip);
				n !== null && (e.preventDefault(), this.closeFromViewer(n));
				return;
			}
			e.key === "Tab" && t.hasAttribute("data-ui-dialog-modal") && cd(t, e);
		}
	}
	closeFromViewer(e) {
		let t = this.find(e), n = t !== null && !t.hasAttribute("hidden");
		!this.close(e) || !n || t === null || t.querySelector(b)?.dispatchEvent(new Event("close", { bubbles: !0 }));
	}
	getTopmostOpen() {
		return Up(this.root);
	}
};
function PJ(e) {
	return e.getAttribute("data-ui-dialog-placement") === "bottom" && (e.hasAttribute("data-ui-dialog-close-backdrop") || e.hasAttribute("data-ui-dialog-close-escape"));
}
//#endregion
//#region src/interactions/leave-dialog.ts
var FJ = "ui-leave", IJ = new y_("data-ui-leave-part"), LJ = "560px", RJ = null, zJ = null;
function BJ(e, t) {
	RJ ??= VJ();
	let n = RJ;
	n.isConnected || document.body.append(n), HJ(n, "title", T.text("ui.leave.title")), HJ(n, "message", T.text("ui.leave.message")), HJ(n, "stay", T.text("ui.leave.stay")), HJ(n, "leave", T.text("ui.leave.confirm")), zJ = {
		dialogs: e,
		leave: t
	}, e.open(FJ);
}
function VJ() {
	let { dialog: e, surface: t } = v_({
		key: FJ,
		className: "ui-leave-dialog",
		role: "alertdialog",
		labelledBy: "ui-leave-title",
		describedBy: "ui-leave-message",
		closesOnEscapeAndBackdrop: !0
	});
	t.style.setProperty("--ui-max-width-sm", LJ);
	let n = IJ.element("h2", "ui-leave-dialog__title ui-text-type--subtitle", "title"), r = IJ.element("p", "ui-leave-dialog__message ui-text-type--body", "message");
	return n.id = "ui-leave-title", r.id = "ui-leave-message", t.append(n, r, IJ.actions(IJ.button("ui-button--outline", "stay"), IJ.button("ui-button--danger", "leave"))), e.addEventListener("click", (e) => {
		let t = IJ.pressed(e);
		if (t !== "stay" && t !== "leave") return;
		let n = zJ;
		zJ = null, n?.dialogs.close(FJ), t === "leave" && n?.leave();
	}), e;
}
function HJ(e, t, n) {
	let r = IJ.find(e, t);
	r !== null && r.textContent !== n && (r.textContent = n);
}
//#endregion
//#region src/interactions/leave-guard.ts
var UJ = class {
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
		let t = WJ(e, this.options.window.location.href);
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
function WJ(e, t) {
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
	return Lg(s) ? s : null;
}
//#endregion
//#region src/effects/address-history.ts
var GJ = class {
	window;
	revisit;
	load;
	route;
	search;
	constructor(e) {
		this.window = e.window, this.revisit = e.revisit, this.load = e.load, this.route = e.window.location.pathname, this.search = e.window.location.search, e.window.addEventListener("popstate", () => this.onPopState());
	}
	replace(e) {
		this.write(hJ(this.route, e), !1);
	}
	push(e) {
		let t = hJ(this.route, e), n = this.window.location;
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
		e.search !== this.search && (this.search = e.search, this.revisit(KJ(e.search)));
	}
};
function KJ(e) {
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
var qJ = class {
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
		!this.state.set(e, t, n, YJ(i[0]?.component)) && !this.restoring || o || this.notifyValueChanged({
			reference: e,
			propertyName: i[0]?.propertyName ?? this.addressResolver.getPropertyName(e.propertyId) ?? "",
			dynamicParameters: t,
			value: a,
			local: r,
			components: i.map((e) => e.component)
		});
	}
	shownValue(e, t) {
		return Io(t, () => this.addressResolver.isTranslatable(e));
	}
	holdsProperty(e, t) {
		if (!this.isHeld(e)) return !1;
		let n = e.getAttribute(Ye), r = n === null ? void 0 : this.addressResolver.getBindingById(Number(n));
		return r === void 0 || r.propertyId === t;
	}
	recordValue(e, t, n) {
		let r = this.addressResolver.resolveProperties(e, t);
		return this.state.set(e, t, n, YJ(r[0]?.component)) ? {
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
			(typeof n == "string" || io(n) ? this.addressResolver.isTranslatable(t.reference) : ro(n)) && (e === void 0 || e(n)) && this.applyPropertyValue(t.reference, t.dynamicParameters, n, !1);
		}
	}
	rewriteStatic(e, t, n) {
		let r = this.addressResolver.resolvePropertyOn(e, t);
		if (r === null) return;
		let i = `[${Je}${di(r.propertyName)}]`;
		this.applyOperations(r, this.shownValue(t, n), (t) => mi(e, t, () => JJ(e, i)));
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
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(Ye))), r = e.closest(b);
		return n === void 0 || r === null ? !1 : this.applyToComponent(r, {
			componentId: n.componentId,
			propertyId: n.propertyId
		}, t);
	}
	restoreBoundValue(e, t) {
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(Ye)));
		if (n === void 0) return;
		let r = {
			componentId: n.componentId,
			propertyId: n.propertyId
		};
		if (!this.state.has(r, t)) {
			Rs(e);
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
function JJ(e, t) {
	if (e.matches(t)) return [e];
	for (let n of e.querySelectorAll(t)) if (n.closest(b) === e) return [n];
	return [e];
}
function YJ(e) {
	let t = [], n = e?.closest("[data-ui-key]") ?? null;
	for (; n !== null;) {
		let e = n.parentElement?.closest(b) ?? null, r = e === null ? 0 : w(e), i = n.getAttribute(_);
		e !== null && r > 0 && i !== null && t.push({
			host: r,
			hostParameters: Wi(e, Ui(e)),
			key: i
		}), n = n.parentElement?.closest("[data-ui-key]") ?? null;
	}
	return t;
}
//#endregion
//#region src/updates/reactive-source-registry.ts
var XJ = "EndValue", ZJ = class {
	watchers = /* @__PURE__ */ new Map();
	sourcesByComponent = /* @__PURE__ */ new Map();
	propertyPatchEngine;
	edits;
	constructor(e, t) {
		if (this.propertyPatchEngine = e, this.edits = t, e.addValueChangeHandler((e) => this.notify(e)), t !== void 0) for (let e of Td) t.root.addEventListener(e, (e) => this.applyEditedValue(e, t), !0);
	}
	watch(e, t) {
		let n = C(e.componentId), r = $J(n, e.propertyId), i = this.watchers.get(r);
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
		let t = this.edits?.root.querySelector(`[data-ui-id="${C(e.componentId)}"]`) ?? null, n = t === null ? null : QJ(e, this.edits?.metadata) ? t.querySelector(`[${yt}]`) : Fs(t);
		this.edits !== void 0 && n !== null && this.propertyPatchEngine.recordValue(e, [], this.edits.valueReaders.readBound(n));
	}
	applyEditedValue(e, t) {
		if (!(e.target instanceof Element)) return;
		let n = Zi(e.target), r = n === null ? void 0 : this.sourcesByComponent.get(n);
		if (r === void 0) return;
		let i = t.valueReaders.readBound(e.target), a = e.target.hasAttribute(yt);
		for (let e of r) {
			if (t.metadata !== void 0 && QJ(e, t.metadata) !== a) continue;
			let n = this.propertyPatchEngine.recordValue(e, [], i);
			n !== null && this.notify(n);
		}
	}
	notify(e) {
		let t = $J(C(e.reference.componentId), e.reference.propertyId), n = this.watchers.get(t);
		if (n !== void 0) for (let t of n) t(e);
	}
};
function QJ(e, t) {
	return t?.getPropertyDefinition(e.propertyId)?.propertyName === XJ;
}
function $J(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/items/composite-slots.ts
function eY(e) {
	let t = [];
	for (let n of e.children) {
		let e = n.hasAttribute("data-ui-key") ? n.firstElementChild : null, r = e === null ? 0 : w(e);
		e !== null && r > 0 && t.push([e, r]);
	}
	return t;
}
//#endregion
//#region src/items/held-collections.ts
var tY = class {
	collections = /* @__PURE__ */ new Map();
	waiting = /* @__PURE__ */ new WeakMap();
	hold(e, t) {
		this.collections.set(e, nY(t));
	}
	apply(e) {
		let t = C(e.component?.id), n = this.collections.get(t);
		switch (n === void 0 && (n = [], this.collections.set(t, n)), Di(e.action)) {
			case "Insert":
				for (let t of e.items ?? []) rY(n, t);
				break;
			case "Remove":
				for (let t of e.items ?? []) iY(n, t.key);
				break;
			case "Replace":
				for (let t of e.items ?? []) aY(n, t);
				break;
			case "Move":
				for (let t of e.moves ?? []) oY(n, t.key, t.newIndex);
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
function nY(e) {
	let t = [];
	for (let n of e) typeof n.key == "string" && t.push({
		key: n.key,
		item: n.item
	});
	return t;
}
function rY(e, t) {
	typeof t.key == "string" && (iY(e, t.key), e.splice(sY(t.index, e.length), 0, {
		key: t.key,
		item: t.item
	}));
}
function iY(e, t) {
	let n = e.findIndex((e) => e.key === t);
	n >= 0 && e.splice(n, 1);
}
function aY(e, t) {
	if (typeof t.key != "string") return;
	let n = e.findIndex((e) => e.key === (t.oldKey ?? t.key));
	if (n < 0) {
		rY(e, t);
		return;
	}
	e[n] = {
		key: t.key,
		item: t.item
	};
}
function oY(e, t, n) {
	let r = e.findIndex((e) => e.key === t);
	if (r < 0) return;
	let [i] = e.splice(r, 1);
	e.splice(sY(n, e.length), 0, i);
}
function sY(e, t) {
	return typeof e == "number" && e >= 0 && e < t ? e : t;
}
//#endregion
//#region src/items/item-projections.ts
var cY = class {
	byHost = /* @__PURE__ */ new Map();
	records = /* @__PURE__ */ new WeakMap();
	reported = /* @__PURE__ */ new Set();
	get isEmpty() {
		return this.byHost.size === 0;
	}
	describe(e, t) {
		this.byHost.set(e, lY(e, "", t.map((e) => e.split("."))));
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
function lY(e, t, n) {
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
	for (let [n, a] of r) i.set(n, a.whole || a.rest.length === 0 ? null : lY(e, `${t}${a.name}.`, a.rest));
	return {
		host: e,
		prefix: t,
		members: i
	};
}
function uY(e) {
	let t = new cY();
	for (let n of e.metadata.items) n.itemPaths !== null && n.itemPaths !== void 0 && t.describe(C(n.componentId), n.itemPaths);
	return t;
}
//#endregion
//#region src/items/pending-moves.ts
var dY = class {
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
}, fY = class {
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
function pY(e, t) {
	let n = mY(e[t], "Reset");
	if (n === null) return null;
	let r = C(n.component?.id), i = n.component?.dynamicParameters ?? [];
	if (r <= 0) return null;
	let a = null, o = null, s = t + 1;
	for (; s < e.length; s++) {
		let t = mY(e[s], "Insert");
		if (t === null || C(t.component?.id) !== r || !Hd(i, t.component?.dynamicParameters ?? [])) break;
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
function mY(e, t) {
	if (e === void 0 || ki(e) !== "CollectionChange") return null;
	let n = e;
	return Di(n.action) === t ? n : null;
}
//#endregion
//#region src/updates/collection-sinks.ts
var hY = class {
	handlers = /* @__PURE__ */ new Map();
	register(e) {
		this.handlers.set(e.kind, e.handler);
	}
	dispatch(e, t) {
		let n = this.handlers.get(e);
		return n !== void 0 && (n(t), !0);
	}
};
function gY(e, t, n, r) {
	return {
		action: Di(e.action),
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
var _Y = [], vY = class {
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
	held = new tY();
	projections;
	moves = new dY({
		indexOf: (e, t) => this.indexOfRow(e, t),
		move: (e, t, n) => this.moveRow(e, t, n)
	});
	transfers = new fY({
		take: (e, t) => this.takeRow(e, t),
		restore: (e, t) => this.restoreRow(e, t),
		place: (e, t, n, r) => this.placeRow(e, t, n, r),
		remove: (e, t) => this.removeRow(e, t),
		holds: (e, t) => wY(B(e), t) !== null,
		itemOf: (e) => this.readItemValue(e)
	});
	constructor(e, t, n, r, i, a, o, s) {
		this.metadata = e, this.propertyPatchEngine = t, this.state = n, this.itemsRenderer = r, this.itemsTemplates = i, this.dom = a, this.virtualization = o, this.sinks = s, r.setRowFiller((e) => this.fillHeldCollections(e)), this.projections = uY(e), this.projections.isEmpty || $S((e, t) => this.projections.check(e, t));
	}
	fillHeldCollections(e) {
		let t = [];
		for (let n of e.querySelectorAll(`[${v}]`)) {
			let e = Zi(n);
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
			return n === void 0 && (n = TY(e), t.set(e, n)), n;
		};
		for (let e of this.dom.root.querySelectorAll(`[${v}]`)) {
			let t = Qi(e);
			if (t === null) continue;
			let r = this.metadata.getItemValues(t.componentId, t.dynamicParameters);
			this.projections.isEmpty || this.projections.mark(t.componentId, r);
			for (let i of r) this.registerItemValue(t.componentId, n(e), i.key, i.item);
		}
		for (let t of e?.updates ?? []) {
			if (ki(t) !== "CollectionChange") continue;
			let e = t;
			if (Di(e.action) !== "Insert") continue;
			let r = C(e.component?.id);
			for (let t of this.findItemsHosts(r, e.component?.dynamicParameters ?? [])) {
				let i = n(t);
				for (let t of e.items ?? []) this.registerItemValue(r, i, t.key, t.item);
			}
		}
	}
	registerItemValue(e, t, n, r) {
		if (n == null) return;
		let i = t.get(n) ?? null;
		if (i !== null && this.readItemScope(i) === void 0 && (this.itemsRenderer.registerItemScope(i, CY(i), r), this.metadata.getItemsTemplateMetadata(e)?.composite != null)) for (let [e, t] of eY(i)) this.itemsRenderer.registerItemScope(e, t, r);
	}
	readItemScope(e) {
		let t = this.itemsRenderer.getItemScope(e);
		if (t !== void 0) return t;
		let n = e.firstElementChild;
		return n === null ? void 0 : this.itemsRenderer.getItemScope(n);
	}
	initializeItemsHosts() {
		for (let e of this.dom.root.querySelectorAll(`[${v}]`)) {
			let t = Zi(e);
			t !== null && this.syncItemsHost(e, t);
		}
	}
	resortHost(e) {
		let t = Zi(e);
		t !== null && this.syncItemsHost(e, t);
	}
	syncItemsHost(e, t) {
		TR(e, t, {
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
		let n = u() ? performance.now() : -1, r = Kd();
		for (let e = 0; e < t.length; e++) {
			let n = t[e];
			try {
				let r = pY(t, e);
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
		r !== null && qd(r), n >= 0 && d(`applied ${t.length} server update(s)`, n);
	}
	namesSink(e) {
		return this.dom.findComponent(e.componentId, e.dynamicParameters)?.hasAttribute(it) === !0;
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
		this.transfers.around(e, () => this.moves.around(e, _Y, () => this.refillHostRows(e, t)));
	}
	refillHostRows(e, t) {
		if (jS(e) === "virtualized") {
			let n = this.virtualization.refill(e, t.items.filter((e) => e.key !== null && e.key !== void 0).map((e) => ({
				key: e.key,
				item: e.item
			})));
			this.state.forgetRows(t.componentId, t.dynamicParameters, n), this.syncItemsHost(e, t.componentId), this.dom.invalidate();
			return;
		}
		let n = this.itemsRenderer.getAncestorStack(e), r = TY(e), i = [], a = [], o = null;
		for (let e of t.items) {
			let c = e.key ?? null;
			if (c === null) {
				s("collection insert carried no item key.", e);
				continue;
			}
			let l = r.get(c) ?? null;
			if (r.delete(c), l !== null && Hd(this.readItemValue(l), e.item)) {
				i.push(l);
				continue;
			}
			let u = this.renderItemElement(t.componentId, e.item, c, n);
			if (l !== null) {
				let e = ku(l);
				e !== null && u !== null && (o = {
					row: u,
					held: e
				}), l.remove(), a.push(c);
			}
			u !== null && i.push(u);
		}
		let c = jS(e) === "windowed";
		for (let [t, n] of r) {
			let r = c ? ku(n) : null;
			n.remove(), Au(e, null, r), a.push(t);
		}
		if (this.state.forgetRows(t.componentId, t.dynamicParameters, a), SY(e, i), o !== null && Au(e, o.row, o.held), c) for (let t of i) ju(e, t);
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
		switch (ki(e)) {
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
		let t = C(e.address?.component?.id), n = Oi(e.address?.property), r = e.address?.component?.dynamicParameters ?? [];
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
		if (C(e.address?.component?.id) <= 0) {
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
		let t = C(e.component?.id);
		if (t <= 0) {
			s("collection change update has an invalid component address.", e);
			return;
		}
		let n = e.component?.dynamicParameters ?? [], r = this.dom.findComponent(t, n), i = r?.getAttribute("data-ui-collection-sink") ?? null;
		if (this.projections.isEmpty || this.projections.mark(t, e.items ?? []), r !== null && i !== null) {
			this.sinks.dispatch(i, gY(e, r, t, n)) || s("no collection sink is registered for the kind the component names.", {
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
			a ? l("a collection change for a host inside an item template is held until a row draws it.", { componentId: t }) : (Di(e.action) !== "Reset" || (e.items ?? []).length > 0) && s("items host was not found for a collection change update.", e);
			return;
		}
		let c = Di(e.action) === "Move" ? bY(e.moves ?? []) : _Y;
		for (let n of o) a && this.held.isWaiting(n) || this.transfers.around(n, () => this.moves.around(n, c, () => this.applyCollectionChangeToHost(n, t, e)));
	}
	applyCollectionChangeToHost(e, t, n) {
		if (jS(e) === "virtualized") {
			this.applyVirtualizedCollectionChange(e, n), this.afterRowsChanged(e, t);
			return;
		}
		switch (Di(n.action)) {
			case "Insert":
				this.applyCollectionInsert(e, t, n.items ?? []);
				break;
			case "Remove":
				yY(e, n.items ?? []);
				break;
			case "Replace":
				this.applyCollectionReplace(e, t, n.items ?? []);
				break;
			case "Move":
				xY(e, n.moves ?? []);
				break;
			case "Reset":
				e.replaceChildren(), NC(e);
				break;
			default:
				s("collection update action is not supported.", n);
				return;
		}
		this.afterRowsChanged(e, t);
	}
	afterRowsChanged(e, t = Zi(e)) {
		t !== null && this.syncItemsHost(e, t), this.dom.invalidate();
	}
	indexOfRow(e, t) {
		let n = jS(e) === "virtualized" ? this.virtualization.keysOf(e)?.indexOf(t) ?? -1 : DC(e, B(e)).findIndex((e) => e.getAttribute(_) === t);
		return n < 0 ? null : n + MS(e);
	}
	moveRow(e, t, n) {
		let r = Zi(e);
		if (r === null) return;
		let i = Math.max(0, n - MS(e));
		jS(e) === "virtualized" ? this.virtualization.move(e, t, i) : xY(e, [{
			key: t,
			newIndex: i
		}]), this.afterRowsChanged(e, r);
	}
	takeRow(e, t) {
		let n = B(e), r = wY(n, t);
		if (r === null) return null;
		let i = DC(e, n), a = i.indexOf(r);
		return AC(i, r), r.remove(), this.afterRowsChanged(e), {
			element: r,
			index: a
		};
	}
	restoreRow(e, t) {
		let n = DC(e, B(e));
		cw(t.element), e.insertBefore(t.element, kC(n, t.element, t.index)), this.afterRowsChanged(e);
	}
	placeRow(e, t, n, r) {
		let i = Zi(e), a = i === null ? null : this.renderItemElement(i, n, t, this.itemsRenderer.getAncestorStack(e));
		return a === null ? null : (e.insertBefore(a, kC(DC(e, B(e)), a, r)), this.afterRowsChanged(e), a);
	}
	removeRow(e, t) {
		AC(DC(e, B(e)), t), t.remove(), this.afterRowsChanged(e);
	}
	forgetRowState(e, t, n) {
		switch (Di(n.action)) {
			case "Remove":
			case "Replace":
				this.state.forgetRows(e, t, (n.items ?? []).map((e) => e.oldKey ?? e.key).filter((e) => typeof e == "string"));
				break;
			case "Reset": this.state.forgetHost(e, t);
		}
	}
	applyVirtualizedCollectionChange(e, t) {
		switch (Di(t.action)) {
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
			let e = qB(r);
			e !== null && n.push(e);
		}
		return n;
	}
	applyCollectionInsert(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = DC(e, B(e));
		for (let a of n) {
			let n = a.key ?? null;
			if (n === null) {
				s("collection insert carried no item key.", a);
				continue;
			}
			let o = this.renderItemElement(t, a.item, n, r);
			o !== null && (e.insertBefore(o, kC(i, o, a.index ?? null)), ju(e, o));
		}
	}
	renderItemElement(e, t, n, r) {
		return oU(e, t, n, r, {
			metadata: this.metadata,
			templates: this.itemsTemplates,
			renderer: this.itemsRenderer
		});
	}
	applyCollectionReplace(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = B(e), a = DC(e, i), o = TY(e, i);
		for (let i of n) {
			let n = i.key ?? null;
			if (n === null) {
				s("collection replace carried no item key.", i);
				continue;
			}
			let c = o.get(i.oldKey ?? n) ?? null, l = this.renderItemElement(t, i.item, n, r);
			if (l !== null) {
				if (o.delete(i.oldKey ?? n), o.set(n, l), c !== null) {
					let t = ku(c);
					MC(a, c, l), c.replaceWith(l), Au(e, l, t);
				} else e.insertBefore(l, kC(a, l, i.index ?? null));
			}
		}
	}
};
function yY(e, t) {
	let n = B(e), r = DC(e, n), i = TY(e, n), a = Ou(e), o = a === null ? [] : n.filter((e) => e instanceof HTMLElement);
	for (let e of t) {
		let t = e.key ?? null, n = t === null ? null : i.get(t) ?? null;
		if (t === null || n === null) {
			s("collection remove did not resolve an item.", e);
			continue;
		}
		let c = a !== null && n instanceof HTMLElement ? Tu(a, o, n) : null;
		i.delete(t), AC(r, n), n.remove();
		let l = o.indexOf(n);
		l >= 0 && o.splice(l, 1), c?.();
	}
}
function bY(e) {
	return e.map((e) => e.key).filter((e) => typeof e == "string");
}
function xY(e, t) {
	let n = B(e), r = DC(e, n), i = TY(e, n);
	for (let n of t) {
		let t = n.key === null || n.key === void 0 ? null : i.get(n.key) ?? null;
		if (t === null) {
			s("collection move did not resolve an item.", n);
			continue;
		}
		let a = jC(r, t, n.newIndex ?? null);
		e.insertBefore(t, a ?? r[r.length - 2]?.nextSibling ?? null);
	}
}
function SY(e, t) {
	let n = null;
	for (let r of t) {
		let t = n === null ? B(e)[0] ?? null : n.nextElementSibling;
		r !== t && e.insertBefore(r, t), n = r;
	}
}
function CY(e) {
	let t = w(e);
	if (t > 0) return t;
	let n = e.firstElementChild;
	return n === null ? 0 : w(n);
}
function wY(e, t) {
	return e.find((e) => e.getAttribute("data-ui-key") === t) ?? null;
}
function TY(e, t = B(e)) {
	let n = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.getAttribute(_);
		t !== null && !n.has(t) && n.set(t, e);
	}
	return n;
}
//#endregion
//#region src/interactions/validation-words.ts
function EY(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = t.message;
	return ro(n) || io(n) || typeof n == "string" && n.length > 0 ? {
		message: n,
		severity: OY(t.severity)
	} : void 0;
}
function DY(e) {
	let t = e.message;
	if (e.content === !0) return String(t ?? "");
	let n = T.resolve(ro(t) || io(t) ? t : String(t ?? ""), !0);
	return typeof n == "string" ? n : "";
}
function OY(e) {
	let t = wi(e);
	return t === "Unknown" ? "Error" : t;
}
//#endregion
//#region src/interactions/validation-engine.ts
var kY = "ui-validation--warning", AY = "ui-validation--info", jY = "ui-validation-message--marker", MY = "top-end", NY = "right", PY = "--ui-validation-marker-host", FY = "ui-validation-mark", IY = "--ui-validation-presentation", LY = "--ui-validation-color", RY = "Validation", zY = /* @__PURE__ */ new Set(["Value", "EndValue"]), BY = /* @__PURE__ */ new Set(["Min", "Max"]), VY = `input:not([type='hidden']), textarea, select, .${Xr}[role='combobox'], [role='spinbutton']`, HY = {
	Error: 0,
	Warning: 1,
	Info: 2
}, UY = {
	Error: ci,
	Warning: kY,
	Info: AY
}, WY = `.${ci}, .${kY}, .${AY}`, GY = {
	Error: "danger",
	Warning: "warning",
	Info: "info"
}, KY = {
	Error: "error",
	Warning: "warning",
	Info: "info"
}, qY = {
	Error: `${FY}--error`,
	Warning: `${FY}--warning`,
	Info: `${FY}--info`
}, JY = {
	error: "Error",
	warning: "Warning",
	info: "Info"
}, YY = class {
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
		}, !0), this.applyRenderedMessages(this.root.querySelectorAll(WY)), R(this.root, WY, { childList: !0 }, (e) => this.applyRenderedMessages(e)), T.onChange(() => {
			this.applyRenderedMessages(this.root.querySelectorAll(WY)), this.rewriteMessageLines(), this.rejudgeBounds();
		}), T.onTable(() => this.rewriteShownMessages());
	}
	rewriteShownMessages() {
		for (let e of this.root.querySelectorAll(WY)) {
			let t = w(e);
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
			eX(t, QY(t) === "Error");
			let e = t.querySelector(`:scope > [${li}]`), n = e?.textContent ?? "";
			e !== null && n.length !== 0 && (this.recordRenderedMessage(t, e), tX(this.markerMirrors, t, e, {
				message: n,
				severity: QY(t)
			}));
		}
	}
	recordRenderedMessage(e, t) {
		if (this.renderedRead.has(e) || (this.renderedRead.add(e), this.resolveDisplay(w(e), e) !== void 0)) return;
		let n = Mo(t), r = QY(e);
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
		if (e.propertyName === RY) {
			this.applyBoundMessage(e);
			return;
		}
		this.applyGivenValue(e), this.applyChangeTrigger(e);
	}
	applyGivenValue(e) {
		let t = zY.has(e.propertyName), n = BY.has(e.propertyName);
		for (let r of e.components) {
			let i = this.refusalByElement.get(r)?.property === e.propertyName, a = this.boundRefusalByElement.has(r);
			if (a && n) {
				this.judgeBounds(w(r), r);
				continue;
			}
			!i && !(a && t) || (i && this.refusalByElement.delete(r), t && this.forgetBoundRefusal(r), this.applyCurrentState(w(r), r));
		}
	}
	applyBoundMessage(e) {
		let t = C(e.reference.componentId), n = EY(e.value);
		for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) n === void 0 ? this.boundMessageByElement.delete(r) : this.boundMessageByElement.set(r, n), this.touchedElements.add(r), this.applyCurrentState(t, r);
	}
	applyChangeTrigger(e) {
		let t = C(e.reference.componentId), n = this.options.metadata.getValidationsForComponent(t).filter((t) => Ci(t.trigger) === "Change" && t.target.propertyId === e.reference.propertyId);
		if (n.length !== 0) for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) this.evaluateAndApply(t, r, n, e.value);
	}
	applyServerRefusal(e) {
		let t = C(e.address?.component?.id), n = e.address?.component?.dynamicParameters ?? [], r = e.message ?? "", i = ro(r) || typeof r == "string" && r.length > 0;
		for (let a of this.options.dom.findAllComponents(t, n)) i ? (this.refusalByElement.set(a, {
			message: r,
			severity: OY(e.severity),
			content: e.content === !0,
			property: Oi(e.address?.property)
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
		let n = O(t) || E(t) ? null : XY(t, (e) => this.readValue(e)), r = this.boundRefusalByElement.get(t)?.message;
		return ZY(r, n) ? n !== null : (n === null ? this.forgetBoundRefusal(t) : (this.boundRefusalByElement.set(t, {
			message: n,
			severity: "Error"
		}), this.boundRefused.add(t), this.touchedElements.add(t), this.refusalByElement.delete(t)), this.applyCurrentState(e, t), n !== null);
	}
	readValue(e) {
		return this.options.readValue?.(e) ?? this.options.valueReaders.readBound(e);
	}
	readRuleValue(e) {
		let t = Fs(e);
		return t === null ? null : this.readValue(t);
	}
	forgetBoundRefusal(e) {
		this.boundRefusalByElement.delete(e), this.boundRefused.delete(e);
	}
	rejudgeBounds() {
		for (let e of [...this.boundRefused]) e.isConnected ? this.judgeBounds(w(e), e) : this.forgetBoundRefusal(e);
	}
	mark(e, t, n) {
		t === null ? this.packageMarkByElement.delete(e) : this.packageMarkByElement.set(e, {
			message: n ?? null,
			severity: JY[t]
		}), this.applyCurrentState(w(e), e);
	}
	entryRefusal(e, t, n) {
		for (let r of this.options.metadata.getValidationsForComponent(w(e))) if (OY(r.severity) === "Error" && cf(t, r.operator, r.value) && !cf(n, r.operator, r.value)) return r.message;
		return null;
	}
	judge(e, t) {
		let n = null;
		for (let r of this.options.metadata.getValidationsForComponent(e)) !cf(t, r.operator, r.value) && (n === null || HY[OY(r.severity)] < HY[OY(n.severity)]) && (n = r);
		return n === null ? null : {
			severity: KY[OY(n.severity)],
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
		$Y(this.markerMirrors, t, n), this.writeMessageElsewhere(e, t, n);
	}
	writeMessageElsewhere(e, t, n) {
		let r = this.options.metadata.getValidationTarget(e);
		if (r === void 0) return;
		let i = `${C(r.message.componentId)}:${r.message.propertyId}`, a = this.messageLines.get(i);
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
		}, [], [...e.lines.values()].map(DY).join("\n"), !0);
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
			severity: OY(t.severity)
		});
		let c;
		for (let e of n) (c === void 0 || HY[e.severity] < HY[c.severity]) && (c = e);
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
		let r = this.options.metadata.getValidationsForComponent(n.componentId).filter((e) => Ci(e.trigger) === t);
		r.length !== 0 && this.evaluateAndApply(n.componentId, n.element, r, this.readRuleValue(n.element));
	}
	runSubmitValidation(e) {
		let t = !0, n = /* @__PURE__ */ new Set();
		for (let { component: r } of this.formFields(e)) {
			if (n.has(r.element)) continue;
			n.add(r.element);
			let e = this.options.metadata.getValidationsForComponent(r.componentId).filter((e) => Ci(e.trigger) === "Submit");
			e.length > 0 && (this.touchedElements.add(r.element), this.evaluateAndApply(r.componentId, r.element, e, this.readRuleValue(r.element))), this.hasError(r.componentId, r.element) && (t = !1, this.touchedElements.has(r.element) || (this.touchedElements.add(r.element), this.applyCurrentState(r.componentId, r.element)));
		}
		return t;
	}
	*formFields(e) {
		for (let t of this.root.querySelectorAll(`[${Lt}="${x(e)}"]`)) {
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
			let e = [...t.element.querySelectorAll(VY)].find((e) => e.closest("[role='listbox'], [role='menu'], [role='dialog']") === null) ?? null;
			if (e !== null) return e.focus({ preventScroll: !0 }), e.scrollIntoView({
				block: "center",
				behavior: xf() ? "auto" : "smooth"
			}), !0;
		}
		return !1;
	}
	hasError(e, t) {
		if (this.boundRefusalByElement.has(t) || this.refusalByElement.get(t)?.severity === "Error") return !0;
		let n = this.failingRulesByElement.get(t);
		if (n === void 0) return !1;
		for (let t of this.options.metadata.getValidationsForComponent(e)) if (n.has(t) && OY(t.severity) === "Error") return !0;
		return !1;
	}
	evaluateAndApply(e, t, n, r) {
		let i = this.failingRulesByElement.get(t);
		i === void 0 && (i = /* @__PURE__ */ new Set(), this.failingRulesByElement.set(t, i));
		for (let e of n) cf(r, e.operator, e.value) ? i.delete(e) : i.add(e);
		this.touchedElements.has(t) && this.applyCurrentState(e, t);
	}
};
function XY(e, t) {
	return wS(e, t) ?? (e.matches(Uw) ? LT(e) : null);
}
function ZY(e, t) {
	return e === void 0 || t === null ? e === void 0 && t === null : ro(e) && e.key === t.key && JSON.stringify(e.args) === JSON.stringify(t.args);
}
function QY(e) {
	return e.classList.contains(kY) ? "Warning" : e.classList.contains(AY) ? "Info" : "Error";
}
function $Y(e, t, n) {
	for (let e of Object.values(UY)) t.classList.toggle(e, n !== void 0 && UY[n.severity] === e);
	eX(t, n?.severity === "Error");
	let r = t;
	n === void 0 ? r.style.removeProperty(LY) : r.style.setProperty(LY, `var(--ui-color-${GY[n.severity]}-ink)`);
	let i = t.querySelector(":scope > [data-ui-validation-message]") ?? t.querySelector("[data-ui-validation-message]");
	i !== null && (n?.content === !0 ? (Ao(i, null), i.textContent = String(n.message ?? "")) : T.writeValue(i, null, n?.message ?? null), tX(e, r, i, n));
}
function eX(e, t) {
	for (let n of e.querySelectorAll(VY)) {
		let r = n.closest(Yr);
		r !== null && e.contains(r) || (t ? n.setAttribute("aria-invalid", "true") : n.removeAttribute("aria-invalid"));
	}
}
function tX(e, t, n, r) {
	let i = getComputedStyle(n), a = i.getPropertyValue(IY).trim(), o = r !== void 0 && a === "marker";
	if (n.classList.toggle(jY, o), nX(e, t, a === "elsewhere" ? void 0 : r, n.textContent ?? "", i.getPropertyValue(PY).trim()), r !== void 0 && o) {
		n.setAttribute(Re, n.textContent ?? ""), n.setAttribute(ze, MY), n.setAttribute(Ve, KY[r.severity]), t.setAttribute(Be, ""), t.contains(document.activeElement) ? Zj(n) : Qj(n);
		return;
	}
	n.removeAttribute(Re), n.removeAttribute(ze), n.removeAttribute(Ve), t.removeAttribute(Be), Qj(n);
}
function nX(e, t, n, r, i) {
	let a = e.get(t), o = n === void 0 || i.length === 0 ? null : iX(t, i);
	if (n === void 0 || o === null) {
		a !== void 0 && rX(a), e.delete(t);
		return;
	}
	let s = a ?? document.createElement("span");
	s.className = `${FY} ${qY[n.severity]}`, s.textContent = r, s.setAttribute(Re, r), s.setAttribute(ze, NY), s.setAttribute(Ve, KY[n.severity]), s.setAttribute(He, ""), s.parentElement !== o && (rX(s), o.append(s)), o.setAttribute(Be, ""), e.set(t, s), Qj(s);
}
function rX(e) {
	let t = e.parentElement;
	e.remove(), t !== null && t.querySelector(`:scope > .${FY}`) === null && t.removeAttribute(Be);
}
function iX(e, t) {
	for (let n = e.parentElement; n !== null; n = n.parentElement) {
		let e = n.querySelector(`:scope > .${t}`);
		if (e !== null) return e;
	}
	return null;
}
//#endregion
//#region src/items/row-decorators.ts
var aX = class {
	decorators = /* @__PURE__ */ new Map();
	register(e) {
		this.decorators.set(e.kind, e.decorate);
	}
	get(e) {
		return this.decorators.get(e);
	}
}, oX = "card-header-shown", sX = `[${ti}], [${ni}], [${ri}], [${ii}], [${ai}]`;
function cX(e) {
	let t = e.parentElement?.parentElement;
	if (t == null || !t.classList.contains("ui-card__header")) return;
	let n = !e.matches(sX);
	t.classList.contains("ui-card__header--empty") !== n && t.classList.toggle(oi, n);
}
//#endregion
//#region src/updates/content-fills.ts
var lX = "content-fills", uX = "content", dX = "data-ui-root", fX = "--ui-height", pX = "var(--ui-fill-height";
function mX(e) {
	let t = e.parentElement;
	if (t === null || t.getAttribute("data-ui-region") !== uX) return;
	let n = t.parentElement;
	if (n === null || !n.hasAttribute(dX)) return;
	let r = e.style.getPropertyValue(fX).trimStart().startsWith(pX);
	n.hasAttribute("data-ui-content-fills") !== r && n.toggleAttribute(cn, r);
}
//#endregion
//#region src/updates/menu-surface.ts
var hX = "menu-surface";
function gX(e) {
	let t = e.parentElement;
	if (t === null || !t.matches(".ui-context-menu, .ui-split-button__menu")) return;
	let n = RK(e);
	n === null ? t.removeAttribute(Jt) : t.getAttribute("data-ui-menu-surface") !== n && t.setAttribute(Jt, n);
}
//#endregion
//#region src/updates/tooltip-name.ts
var _X = "tooltip-name";
function vX(e, t, n) {
	let r = gA(e.getAttribute(Re));
	if (Ao(t, n), r.trim().length === 0) {
		t.hasAttribute(n) && t.removeAttribute(n);
		return;
	}
	t.getAttribute(n) !== r && t.setAttribute(n, r);
}
//#endregion
//#region src/updates/dom-operation-registry.ts
var yX = /* @__PURE__ */ new WeakMap(), bX = /* @__PURE__ */ new WeakMap(), xX = class {
	handlers = /* @__PURE__ */ new Map();
	constructor() {
		this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(Ti(e), t);
	}
	apply(e) {
		let t = Ti(e.operation.kind), n = this.handlers.get(t);
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
			let t = ks(e.convertedValue);
			e.target.textContent !== t && (e.target.textContent = t), Ao(e.target, null);
		}), this.register("Markup", (e) => {
			vA(e.target, As(e.convertedValue) ? "" : ks(e.convertedValue)), Ao(e.target, null);
		}), this.register("Attribute", (e) => {
			let t = kX(e.operation);
			if (Ao(e.target, t), e.operation.convertsNull !== !0 && As(e.value) || As(e.convertedValue)) {
				OX(e.target, t);
				return;
			}
			DX(e.target, t, ks(e.convertedValue));
		}), this.register("RemoveAttribute", (e) => {
			let t = kX(e.operation);
			Ao(e.target, t), OX(e.target, t);
		}), this.register("ToggleAttribute", (e) => {
			let t = kX(e.operation), n = e.operation.condition ?? "HasValue", r = !As(e.value) && SX(e.value, n), i = e.operation.value ?? (As(e.convertedValue) || CX(n) ? "" : ks(e.convertedValue));
			wX(e.target, EX(e), t, r, i);
		}), this.register("Class", (e) => {
			let t = !As(e.value) && SX(e.value, e.operation.condition ?? "None") ? ks(e.convertedValue).trim() : "";
			TX(e.target, EX(e), t, MK(e.operation.converter ?? ""));
		}), this.register("ToggleClass", (e) => {
			let t = kX(e.operation), n = !As(e.value) && SX(e.value, e.operation.condition ?? "IsTrue");
			if (e.target.classList.toggle(t, n), e.operation.converter !== null && e.operation.converter !== void 0 && e.operation.converter.trim().length > 0) {
				let t = n ? ks(e.convertedValue).trim() : "";
				TX(e.target, EX(e), t, MK(e.operation.converter));
			}
		}), this.register("Style", (e) => {
			let t = kX(e.operation), n = e.target;
			if (As(e.value) || As(e.convertedValue) || e.convertedValue === "") {
				n.style.getPropertyValue(t).length > 0 && n.style.removeProperty(t);
				return;
			}
			let r = ks(e.convertedValue);
			n.style.getPropertyValue(t) !== r && n.style.setProperty(t, r);
		}), this.register("Data", () => {}), this.register(_X, (e) => vX(e.resolved.component, e.target, kX(e.operation))), this.register(MG, (e) => FG(e.target, e.value)), this.register(oX, (e) => cX(e.resolved.component)), this.register(Lo, (e) => Ro(e.target)), this.register(lX, (e) => mX(e.target)), this.register(uO, (e) => fO(e.target)), this.register(hO, (e) => vO(e.resolved.component)), this.register(hX, (e) => gX(e.target)), this.register("Property", (e) => {
			let t = kX(e.operation), n = e.target, r = As(e.convertedValue) ? "" : e.convertedValue;
			n[t] !== r && (n[t] = r);
		});
	}
};
function SX(e, t) {
	switch (Ei(t)) {
		case "None": return !0;
		case "HasValue": return !As(e);
		case "HasText": return typeof e == "string" ? e.trim().length > 0 : !As(e) && String(e).trim().length > 0;
		case "IsTrue": return e === !0;
		case "IsFalse": return e === !1;
		case "DrawsIcon": return n_(e).length > 0;
		default: return !As(e);
	}
}
function CX(e) {
	let t = Ei(e);
	return t === "IsTrue" || t === "IsFalse";
}
function wX(e, t, n, r, i) {
	let a = bX.get(e);
	a === void 0 && (a = /* @__PURE__ */ new Map(), bX.set(e, a));
	let o = a.get(n);
	if (o === void 0 && (o = /* @__PURE__ */ new Set(), a.set(n, o)), r) {
		o.add(t), DX(e, n, i);
		return;
	}
	o.delete(t), o.size === 0 && OX(e, n);
}
function TX(e, t, n, r) {
	let i = yX.get(e);
	i === void 0 && (i = /* @__PURE__ */ new Map(), yX.set(e, i));
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
function EX(e) {
	return `${e.resolved.componentId}:${e.resolved.propertyId}:${e.operation.kind}:${e.operation.name ?? ""}:${e.operation.converter ?? ""}`;
}
function DX(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function OX(e, t) {
	e.hasAttribute(t) && e.removeAttribute(t);
}
function kX(e) {
	let t = e.name;
	if (t == null || t.trim().length === 0) throw Error(`Operation '${e.kind}' requires a name.`);
	return t;
}
//#endregion
//#region src/extensions/converters.ts
var AX = class {
	converters = /* @__PURE__ */ new Map();
	constructor() {
		this.register({
			name: "*",
			canConvert: (e) => LK.has(e.name),
			convert: (e) => LK.get(e.name)(e.value)
		});
	}
	register(e) {
		let t = jX(e.name), n = {
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
function jX(e) {
	let t = e.trim();
	if (t.length === 0) throw Error("Converter name is required.");
	return t;
}
//#endregion
//#region src/extensions/events.ts
var MX = class {
	definitions = /* @__PURE__ */ new Map();
	register(e) {
		let t = Li(e.name);
		if (t.length === 0) throw Error("Event name is required.");
		let n = Li(e.domEventName) || t;
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
		return this.definitions.get(Li(e));
	}
};
function NX(e, t) {
	e.root.addEventListener("toggle", (n) => {
		n.target instanceof HTMLDetailsElement && n.target.open === t && e.dispatch(n);
	}, !0);
}
function PX(e) {
	e.register({
		name: "click",
		attach: (e) => {
			e.root.addEventListener("click", e.dispatch, !0), e.root.addEventListener(Cu, e.dispatch, !0);
		}
	}), e.registerNative("change"), e.registerNative("focus"), e.registerNative("blur"), e.registerNative("mouse-enter", "mouseenter"), e.registerNative("mouse-leave", "mouseleave"), e.registerNative("toggle"), e.register({
		name: "expand",
		domEventName: "toggle",
		attach: (e) => NX(e, !0)
	}), e.register({
		name: "collapse",
		domEventName: "toggle",
		attach: (e) => NX(e, !1)
	}), e.registerNative("open"), e.registerNative("close"), e.registerNative("search"), e.registerNative("enter"), e.registerNative("escape"), e.registerNative("rename"), e.registerNative("unfold"), e.registerNative("move"), e.registerNative("remove");
}
//#endregion
//#region src/extensions/extension-registry.ts
var FX = class {
	converters = new AX();
	events = new MX();
	operations = new xX();
	valueReaders;
	collectionSinks = new hY();
	rowDecorators = new aX();
	constructor(e, t, n, r) {
		PX(this.events), this.valueReaders = new Ms(r);
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
}, IX = "Submenu", LX = "ui-menu__submenu", RX = "Select", zX = ["Header", "Separator"], BX = {
	kind: "menu",
	decorate: VX
};
function VX(e) {
	if (zX.includes(UX(e.item, "Kind")) && e.row.setAttribute(Kt, ""), !HX(e.item)) return;
	let t = e.templates.getVariantTemplate(e.componentId, IX);
	if (t === void 0) {
		s("menu submenu template was not found.", { componentId: e.componentId });
		return;
	}
	let n = e.renderer.renderFromTemplate(t, e.item, e.ancestors);
	if (n === null) return;
	e.row.setAttribute(Vt, ""), UX(e.item, "Kind") === RX && e.row.setAttribute(Ht, ""), UX(e.item, "Expanded") === !0 && e.row.setAttribute(Ut, "");
	let r = document.createElement("div");
	r.className = LX, r.appendChild(n), wH(r, e.key, e.item), e.row.appendChild(r);
}
function HX(e) {
	let t = UX(e, "Items");
	return Array.isArray(t) && t.length > 0;
}
function UX(e, t) {
	let n = oC(e, t);
	return n.ok ? n.value : void 0;
}
//#endregion
//#region src/items/row-grip.ts
var WX = {
	kind: "grip",
	decorate: GX
};
function GX(e) {
	e.row.append(KX());
}
function KX() {
	let e = document.createElement("span");
	return e.className = ye, e.setAttribute("role", "button"), T.write(e, "aria-label", "ui.row.drag"), e;
}
//#endregion
//#region src/rendering/page-culture.ts
function qX(e, t, n) {
	let r = t === null ? null : JSON.stringify(t), i = n === null ? null : JSON.stringify(YX(n));
	for (let t of e.querySelectorAll(`[${st}]`)) JX(t, ot, r), JX(t, dt, i);
}
function JX(e, t, n) {
	n !== null && e.hasAttribute(t) && e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function YX(e) {
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
var XX = 2;
function ZX(e, t, n) {
	let r = u() ? performance.now() : -1;
	try {
		t(n);
	} catch (t) {
		c(`the ${e} engine failed to start; the page goes on without it.`, t);
	}
	if (r >= 0) {
		let t = performance.now() - r;
		t >= XX && l(`the ${e} engine took ${f(t)} to start.`);
	}
}
function QX(e) {
	return e.name.length > 0 ? `"${e.name}" package` : "package";
}
//#endregion
//#region src/runtime/web-ui-runtime.ts
var $X = "ne.standard.ui.windowId", eZ = [
	500,
	1e3,
	2e3
], tZ = 3, nZ = [
	["refusal", ({ root: e }) => KV(e)],
	["file input", ({ root: e, validation: t }) => new mg({
		root: e,
		validation: t
	})],
	["image input", ({ root: e, validation: t, propertyPatchEngine: n, dialogs: r }) => new vv({
		root: e,
		validation: t,
		propertyPatchEngine: n,
		dialogs: r
	})],
	["key value action", ({ root: e, dom: t, propertyPatchEngine: n, validation: r }) => new Pv({
		root: e,
		dom: t,
		propertyPatchEngine: n,
		validation: r
	})],
	["field keys", ({ root: e, propertyPatchEngine: t }) => new ay({
		root: e,
		propertyPatchEngine: t
	})],
	["field box press", ({ root: e }) => new Wv({ root: e })],
	["image fallback", ({ root: e }) => new py({ root: e })],
	["radio group sync", ({ root: e }) => new Ey({ root: e })],
	["select interaction", ({ root: e, validation: t }) => new Fb({
		root: e,
		validation: t
	})],
	["search input", ({ root: e }) => new Ly({ root: e })],
	["debounced commit", ({ root: e }) => new Qv({ root: e })],
	["commit gate", ({ root: e, propertyPatchEngine: t }) => new Jb({
		root: e,
		propertyPatchEngine: t
	})],
	["text area grow", ({ root: e, propertyPatchEngine: t }) => Zb() ? void 0 : new Qb({
		root: e,
		propertyPatchEngine: t
	})],
	["items selection", ({ root: e, heldRows: t }) => new GR({
		root: e,
		rows: t
	})],
	["range value", ({ root: e, propertyPatchEngine: t }) => new Tx({
		root: e,
		propertyPatchEngine: t
	})],
	["color input", ({ root: e, propertyPatchEngine: t }) => new qI({
		root: e,
		propertyPatchEngine: t
	})],
	["temporal picker", ({ root: e, propertyPatchEngine: t }) => new LE({
		root: e,
		propertyPatchEngine: t
	})],
	["theme switcher", ({ root: e, effects: t, dom: n }) => new lD({
		root: e,
		effects: t,
		dom: n
	})],
	["language switcher", ({ root: e, effects: t, dom: n }) => new DD({
		root: e,
		effects: t,
		dom: n
	})],
	["time segment", ({ root: e, propertyPatchEngine: t }) => new wB({
		root: e,
		propertyPatchEngine: t
	})],
	["timestamp", ({ root: e, propertyPatchEngine: t }) => new WB({
		root: e,
		propertyPatchEngine: t
	})],
	["context menu", ({ root: e, dom: t }) => new ak({
		root: e,
		dom: t
	})],
	["split button", ({ root: e }) => new iF({ root: e })],
	["toggle button", ({ root: e }) => new Vv({ root: e })],
	["button group", ({ root: e }) => new uF({ root: e })],
	["menu", ({ root: e }) => new sM({ root: e })],
	["action bar", ({ root: e, dom: t }) => new Vk({
		root: e,
		dom: t
	})],
	["collapsible", ({ root: e }) => new ZN({ root: e })],
	["menu group", ({ root: e }) => new PO({ root: e })],
	["menu search", ({ root: e }) => new vN({ root: e })],
	["side drawer", ({ root: e }) => new LN({ root: e })],
	["screen keyboard", () => new ON()],
	["grid splitter", ({ root: e }) => new lP({ root: e })],
	["pane container", ({ root: e }) => new PP({ root: e })],
	["accordion", ({ root: e }) => new mF({ root: e })],
	["tabs", ({ root: e }) => new zF({ root: e })],
	["tabs view", ({ root: e, effects: t }) => new nB({
		root: e,
		effects: t
	})],
	["command bar", ({ root: e }) => new $F({ root: e })],
	["breadcrumbs", ({ root: e }) => new pI({ root: e })],
	["scroll anchor", ({ root: e }) => new cV({ root: e })],
	["surface press", ({ root: e }) => new mL({ root: e })],
	["text selection", ({ root: e }) => new hV({ root: e })],
	["scroll group", ({ root: e }) => new SV({ root: e })],
	["flyout interaction", ({ root: e }) => new bh({ root: e })],
	["text fold", ({ root: e }) => new hB({ root: e })],
	["tooltip", ({ root: e }) => lj(e)]
], rZ = class {
	windowId;
	options;
	root;
	culturesLanguage = document.documentElement.lang;
	metadata = new gi(AU());
	hydration = PU();
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
		this.options = e, this.root = e.root ?? document, this.windowId = sZ(e.windowIdStorageKey ?? $X), this.dom = new Xi(this.root), T.load(this.root), T.setLanguage(document.documentElement.lang), e.strings !== void 0 && T.register(e.strings), this.gateInbound(this.hydration?.words === null || this.hydration?.words === void 0 ? null : T.loadTableAsync(this.hydration.words.href)), this.extensions = new FX(e.converters, e.eventDefinitions, e.domOperations, e.valueReaders), this.extensions.registerRowDecorator(BX), this.extensions.registerRowDecorator(WX), this.extensions.registerRowDecorator(yy);
		let t = new Hi(this.dom, this.metadata), n = this.extensions.operations, r = new lW(), i = new qJ(t, n, this.extensions, r);
		this.reactiveSources = new ZJ(i, {
			root: this.root,
			valueReaders: this.extensions.valueReaders,
			metadata: this.metadata
		}), this.dialogs = new NJ({
			root: this.root,
			dom: this.dom
		}), this.notifications = new rJ({
			root: this.root,
			dom: this.dom
		});
		let a = new GJ({
			window,
			revisit: (e) => void this.navigateInPlaceAsync(e),
			load: () => window.location.reload()
		}), o = (e) => this.eventPipeline.dispatchCommandAsync({
			eventId: 0,
			action: e,
			dynamicParameters: []
		}).catch((e) => (s("running a notification's action failed.", e), !1)), u = (e) => Fz(e, (e) => this.leaveGuard.navigate(e), (e) => void o(e)), d = VU(document.documentElement, this.windowId, u);
		this.effects = new SJ({
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
			systemNotifications: Nz(d)
		});
		let f = new hf(this.metadata), p, m = new tf(f, i, new sf(), {
			root: this.root,
			effects: this.effects,
			dom: this.dom,
			metadata: this.metadata,
			valueReaders: this.extensions.valueReaders,
			writeBack: (e, t, n) => {
				p?.syncPropertyAsync(C(e.componentId), e.propertyId, t, n).catch((e) => s("writing an interaction's value back failed.", e));
			}
		}), h = new EU(this.dom), g = new bH(this.metadata, h, this.extensions, n, r);
		this.virtualization = new uU({
			root: this.root,
			metadata: this.metadata,
			templates: h,
			renderer: g,
			state: r,
			dom: this.dom
		}), this.updateProcessor = new vY(this.metadata, i, r, g, h, this.dom, this.virtualization, this.extensions.collectionSinks), T.onChange(() => this.rewriteWords(i, g)), this.rewriteMoments = () => this.rewriteWords(i, g, !0), T.onMomentTick(this.rewriteMoments), new jH({
			root: this.root,
			metadata: this.metadata,
			templates: h,
			renderer: g,
			state: r,
			propertyPatchEngine: i,
			reactiveSources: this.reactiveSources,
			virtualization: this.virtualization
		}), this.transport = new CG(this.windowId, (e, t) => this.applyChanges(e, t), e.signalR), this.clientState = new Mz({ report: (e) => this.transport.reportClientStateAsync(e) }), this.dispatcher = new iW(this.transport), T.setAsker((e, t) => this.transport.translateAsync(e, t)), this.effects.register(hi.SetLanguage, (e) => {
			let t = e.effect, n = t.language;
			if (typeof n != "string" || n.trim().length === 0) {
				s("set language effect carries no language.", e.effect);
				return;
			}
			let r = typeof t.href == "string" && t.href.length > 0 ? t.href : null;
			this.switchLanguageAsync(n, r).catch((e) => s("switching the page's language failed.", e));
		}), this.effects.register(hi.SetThemeColors, (e) => {
			let t = e.effect, n = ++this.themeColorChanges;
			if (typeof t.css == "string") {
				OU(document.head, t.css);
				return;
			}
			this.transport.setThemeColorsAsync(t.colors ?? null).then((e) => {
				n === this.themeColorChanges && OU(document.head, e);
			}).catch((e) => s("applying the reader's colours failed.", e));
		});
		let ee = new OG(this.transport);
		p = new Ad({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: ee,
			valueReaders: this.extensions.valueReaders,
			recordSent: (e, t, n) => i.recordValue(e, t, n),
			refuses: (e) => te.refusesBounds(e)
		}), i.setHeldTargets((e) => p?.isHeld(e) === !0), this.effects.register(hi.DiscardForm, (e) => {
			let t = e.effect.formId;
			if (typeof t == "string" && t.length !== 0) {
				for (let n of p?.releaseForm(t) ?? []) i.restoreBoundValue(n, e.dom.resolveNearestComponent(n, () => !0)?.dynamicParameters ?? []);
				te.discardForm(t);
			}
		}), this.leaveGuard = new UJ({
			window,
			ask: async (e) => (await p?.whenSent(), (await this.transport.requestLeaveAsync(e)).command?.effects),
			apply: (e) => {
				this.effects.applyAll(e, this.dom), this.windows.reconsider();
			},
			confirm: (e, t) => BJ(this.dialogs, t),
			pending: () => Yv() || ee.isBusy,
			settle: async () => {
				Xv(), await ee.whenAnsweredAsync();
			}
		}), this.updateProcessor.addPageHandler((e) => this.leaveGuard.set(e.holdsUnsavedWork === !0)), this.effects.register(hi.ConfirmLeave, (e) => {
			let t = e.effect.target;
			if (!Lg(t)) {
				s("confirm leave effect names no address of this site; nothing asked.", e.effect);
				return;
			}
			this.leaveGuard.confirm(t);
		});
		let te = new YY({
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
			validation: te,
			dialogs: this.dialogs,
			heldRows: this.virtualization
		};
		for (let [e, t] of nZ) ZX(e, t, this.engineContext);
		ZX("number input", ({ root: e, propertyPatchEngine: t }) => {
			this.numberInputs = new SS({
				root: e,
				propertyPatchEngine: t
			});
		}, this.engineContext), ZX("tree", ({ root: e, effects: t }) => new bz({
			root: e,
			effects: t,
			rules: {
				metadata: this.metadata,
				state: r,
				renderer: g
			}
		}), this.engineContext), ZX("items reorder", ({ root: e }) => new JC({
			root: e,
			services: {
				metadata: this.metadata,
				state: r,
				keysOf: (e) => this.virtualization.keysOf(e)
			}
		}), this.engineContext), ZX("press ripple", ({ root: e }) => document.documentElement.hasAttribute("data-ui-press-ripple") ? new LV({
			root: e,
			clicks: (e) => this.metadata.hasServerEventForComponent("click", w(e)) || m.hasEventForComponent("click", w(e))
		}) : void 0, this.engineContext), this.eventPipeline = new Rd({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: this.dispatcher,
			afterEffects: () => this.windows.reconsider(),
			interactionEngine: m,
			eventCatalog: this.extensions.events,
			effects: this.effects,
			events: e.events,
			validationEngine: te,
			valueBinding: p
		});
		for (let e of /* @__PURE__ */ new Set([...this.metadata.getEventNames(), ...f.getSourceEventNames()])) this.eventPipeline.addEvent(e);
		this.eventPipeline.addEvent(Qz.name, Qz.registration);
		let ne = (e) => this.updateProcessor.resortHost(e), re = GC({
			ahead: (e, t, n) => this.updateProcessor.moves.ahead(e, t, n),
			settle: (e) => this.updateProcessor.moves.settle(e),
			resort: ne
		});
		this.eventPipeline.addEvent(re.name, re.registration);
		let ie = eB(ne);
		this.eventPipeline.addEvent(ie.name, ie.registration);
		let ae = Dw(this.updateProcessor.transfers);
		for (let e of this.metadata.getEventNames()) e.startsWith("drop:") && this.eventPipeline.addEvent(e, ae);
		this.eventPipeline.addEvent(ry.name, ry.registration), ZX("shortcuts", ({ root: e, dom: t }) => new vM({
			root: e,
			viewShortcuts: yM(this.metadata.metadata),
			componentOf: (e) => t.findComponent(e, [])
		}), this.engineContext), ZX("item drag", ({ root: e, dom: t }) => new Aw({
			root: e,
			targetOf: (e, n) => {
				let r = t.resolveNearestComponent(e, (e) => this.metadata.hasServerEventForComponent("drop:" + n, e))?.element ?? null;
				return r instanceof HTMLElement ? r : null;
			},
			keysOf: (e) => this.virtualization.keysOf(e)
		}), this.engineContext), this.tables = new YL({ root: this.root }), this.windows = new qH({
			root: this.root,
			requestWindow: (e) => this.transport.requestItemWindowAsync(e)
		}), ZX("pager", ({ root: e, dom: t }) => new tN({
			root: e,
			dom: t,
			windows: this.windows
		}), this.engineContext), this.pluginContext = {
			...this.engineContext,
			strings: T,
			observeComponents: R,
			observeSize: nP,
			store: new cO(),
			numbers: tS,
			temporal: La,
			icons: { apply: $g },
			badges: { writeCount: Oq },
			urls: {
				isImageSource: Vg,
				asBrowserReads: Bg,
				isSafeLink: Ng,
				isExternalLink: Ig
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
				let r = e.closest(b), a = r === null ? void 0 : this.metadata.getExposedProperty(w(r), t);
				return r === null || a === void 0 ? (s("a package set a property its component's renderer did not expose.", { propertyName: t }), !1) : i.applyToComponent(r, a, n);
			} },
			windows: this.windows,
			tooltips: Xj,
			renames: { open: nc },
			tables: this.tables,
			rows: yH(h, g, this.virtualization),
			uploads: rg(te),
			selection: Dl,
			popups: uH(this.dom),
			roving: Ic,
			typeAhead: mD,
			focus: id,
			states: Zo,
			validation: te,
			wheel: T_,
			colors: vH,
			shortcuts: Sc,
			names: ui
		}, this.transport.onChanges((e) => void this.applyChanges(e)), this.transport.onCommandResult((e) => {
			let { changes: t, ...n } = e;
			cW(() => this.applyChanges(t), () => {
				this.dispatcher.settle(n) || (this.effects.applyAll(e.command?.effects, this.dom), this.windows.reconsider());
			}).catch((e) => c("a pushed command result could not be applied.", e));
		}), this.updateProcessor.addFullResyncHandler(() => {
			this.attachAsync().catch((e) => c("re-attaching after a full resync failed.", e));
		}), this.transport.onReconnecting((e) => {
			s("SignalR reconnecting.", e), this.dispatcher.release(Error("the connection to the server dropped before the command answered.", { cause: e }));
		}), this.transport.onReconnected(async () => {
			l("SignalR reconnected. Reattaching runtime."), await this.attachAsync();
		}), this.transport.onClosed((e) => this.loseConnection(e ?? /* @__PURE__ */ Error("the connection to the server closed."))), this.connection = new XU({
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
		let t = Fs(e);
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
		if (e === T.requestedLanguage) return;
		let n = ++this.languageSwitches, r = t, i = e;
		T.setRequested(e);
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
			if (n !== this.languageSwitches || i === T.language || !await T.switchToAsync(i, r)) return;
			T.notifyChanged();
		} finally {
			n === this.languageSwitches && T.setRequested(null);
		}
	}
	rewriteWords(e, t, n = !1) {
		let r = performance.now();
		this.dom.invalidate(), T.language !== this.culturesLanguage && (this.culturesLanguage = T.language, Fo(this.root, (e) => qX(e, T.number, T.temporal)));
		let i = n ? so : void 0;
		T.rewriteMarks(this.root, n), this.rewriteStaticWords(e, i), e.rewriteWords(i), t.rewriteRowWords(this.root, i);
		let a = this.hydration?.title ?? null;
		if (a !== null && (i === void 0 || i(a))) {
			let e = String(T.resolve(a, !0));
			document.title !== e && (document.title = e);
		}
		T.language.length > 0 && document.documentElement.lang !== T.language && (document.documentElement.lang = T.language), d(n ? "page's moments written again" : "page's words written again", r, { language: T.language });
	}
	rewriteStaticWords(e, t) {
		let n = t === void 0 ? this.metadata.getWords() : this.metadata.getWords().filter((e) => t(e.key));
		if (n.length === 0) return;
		let r = [];
		Fo(this.root, (e) => {
			e !== this.root && r.push(e);
		});
		for (let t of n) {
			let n = C(t.componentId), i = {
				componentId: n,
				propertyId: t.propertyId
			}, a = t.dynamicParameters ?? [];
			for (let r of this.findWordInstances(n, a)) e.rewriteStatic(r, i, t.key);
			for (let o of r) for (let r of o.querySelectorAll(`[${ae}="${x(n)}"]`)) Ki(r, a) && e.rewriteStatic(r, i, t.key);
		}
	}
	findWordInstances(e, t) {
		if (t.length === 0) return this.dom.findEveryComponent(e);
		let n = this.dom.findAllComponents(e, t);
		return n.length > 0 ? n : this.dom.findAllComponents(e, []).filter((e) => Ki(e, t));
	}
	loseConnection(e) {
		if (this.connectionLost) return;
		this.connectionLost = !0, c("the connection to the server is lost; the page offers a reload.", e), this.connection.lost();
		let t = Error("the connection to the server is lost; reload the page.", { cause: e });
		this.transport.close(t), this.dispatcher.release(t), this.notifications.show({
			message: T.text("ui.connection.lost"),
			severity: "danger",
			sticky: !0,
			connection: !0,
			action: {
				label: T.text("ui.connection.reload"),
				run: () => {
					this.leaveGuard.release(), window.location.reload();
				}
			}
		});
	}
	reloadForView(e) {
		let t = GU(e, navigator.cookieEnabled, qU());
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
		if (GU(e, navigator.cookieEnabled, qU()) !== "reload") {
			this.loseConnection(/* @__PURE__ */ Error("the server holds a new runtime for this page again after a reload for one."));
			return;
		}
		s("the page's runtime is gone and the server built a new one; reloading.", { view: e }), this.leaveGuard.release(), window.location.reload();
	}
	get instanceId() {
		return this.transport.instanceId;
	}
	async startAsync() {
		te(this, this.options.handlerGlobalKey), IG(this.root), await oZ();
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
		return ko(this.root) || NU(this.hydration) || this.metadata.getWords().some((e) => so(e.key)) || so(this.metadata.metadata.itemValues);
	}
	startEnginesAwaitingHydration() {
		let e = this.enginesAwaitingHydration ?? [];
		this.enginesAwaitingHydration = null;
		for (let t of e) ZX(QX(t), t, this.pluginContext);
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
		T.register(e);
	}
	addEngine(e) {
		if (this.enginesAwaitingHydration !== null) {
			this.enginesAwaitingHydration.push(e);
			return;
		}
		ZX(QX(e), e, this.pluginContext);
	}
	applyChanges(e, t) {
		if (this.inbound === null && !tW(e)) {
			t?.(), this.applyNow(e);
			return;
		}
		let n = this.transport.instanceId, r = (this.inbound ?? Promise.resolve()).then(() => (t?.(), nW(e, n))).then((e) => this.applyNow(e)).catch((e) => {
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
			if (e >= tZ) {
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
			return n === null ? (this.loseConnection(/* @__PURE__ */ Error("attaching the runtime failed after retrying.")), !1) : n === "reconnecting" ? !1 : n.reload === !0 ? (this.reloadForView(this.hydration?.view ?? ""), !1) : n.fresh === !0 ? (this.reloadForFreshRuntime(this.hydration?.view ?? ""), !1) : (KU(qU()), this.heldRuntime = n.runtime ?? null, this.dom.rebuild(), this.updateProcessor.registerServerRenderedItems(n.initialChanges), await e.previous, this.leaveGuard.set(!1), await this.applyAttachChangesAsync(n.initialChanges), this.updateProcessor.initializeItemsHosts(), this.windows.start(), d("runtime attached", t, {
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
			this.applyNow(tW(e) ? await nW(e, this.transport.instanceId) : e);
		} catch (e) {
			c("a staged value of the attach could not be fetched; the page attaches again.", e), this.reattachRequested = !0;
		}
	}
	async attachWithRetryAsync() {
		let e = lZ(), t = {
			clientWindowId: this.windowId,
			route: e?.route ?? window.location.pathname,
			pageId: this.hydration?.pageId ?? null,
			view: this.hydration?.view ?? null,
			since: this.renderSequence,
			runtime: this.heldRuntime,
			parameters: e === null ? KJ(window.location.search) : e.parameters,
			timeZone: LU(),
			clientState: this.clientState.forAttach()
		};
		return this.renderSequence = null, await IU(() => this.transport.attachAsync(t), () => this.transport.isReconnecting, eZ, aZ);
	}
};
async function iZ(e = {}) {
	let t = performance.now(), n = new rZ(e);
	return d("runtime built", t), await n.startAsync(), n;
}
function aZ(e) {
	return new Promise((t) => window.setTimeout(t, e));
}
function oZ() {
	let e = performance.getEntriesByType("navigation")[0];
	return document.readyState === "complete" || e !== void 0 && e.domContentLoadedEventStart > 0 ? Promise.resolve() : new Promise((e) => document.addEventListener("DOMContentLoaded", () => e(), { once: !0 }));
}
function sZ(e) {
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
	let n = cZ();
	try {
		t?.setItem(e, n);
	} catch (e) {
		s("storing the tab id failed.", e);
	}
	return n;
}
function cZ() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `tab-${typeof crypto < "u" && typeof crypto.getRandomValues == "function" ? [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16))].map((e) => e.toString(16).padStart(2, "0")).join("") : Math.random().toString(16).slice(2).padEnd(16, "0")}-${performance.now().toString(36).replace(".", "")}`;
}
function lZ() {
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
ee(), iZ().catch((e) => {
	c("Web client failed to start.", e);
});
//#endregion
